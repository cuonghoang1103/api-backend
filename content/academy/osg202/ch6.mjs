/**
 * OSG202 · Chương 6 — Deadlocks (osg6: 6.A 1–31).
 * Bài 📑 học theo từng slide: osg6 (tmp_06.pptx, slide 1–31).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: osg202-on-ch6.
 * Quiz viết lại (10 câu, giữ slug osg202-quiz-ch6).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs từ gen/src/**, gen/code/**, gen/sim/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node OSG202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 6.A — 📑 Slide by slide · Deadlocks: conditions, detection, recovery, banker’s algorithm, prevention (slides 1–31) ───────── */
const L_osg6_1 = {
  title: '6.A — 📑 Slide by slide · Deadlocks: conditions, detection, recovery, banker’s algorithm, prevention (slides 1–31)|||6.A — 📑 Học theo từng slide · Bế tắc: điều kiện, phát hiện, khôi phục, nhà băng, ngăn ngừa (slide 1–31)',
  slug: 'osg202-slide-osg6-1',
  type: 'VIDEO',
  description: 'Giảng đủ 31 slide Chương 6 (Tanenbaum, Modern Operating Systems 4e): tài nguyên trưng dụng được và không trưng dụng được, định nghĩa bế tắc, bốn điều kiện Coffman, đồ thị cấp phát tài nguyên, bốn chiến lược (đà điểu, phát hiện và khôi phục, tránh, ngăn ngừa), thuật toán tìm chu trình và thuật toán ma trận E–A–C–R chạy từng bước bằng bộ mô phỏng, ba cách khôi phục, quỹ đạo tài nguyên, trạng thái an toàn và không an toàn, thuật toán nhà băng một và nhiều loại tài nguyên (kèm các câu FE tính chuỗi an toàn và giá trị x nhỏ nhất), sắp thứ tự tài nguyên, bế tắc truyền thông, livelock và bỏ đói — mỗi ý có chương trình chạy thật trên Linux: bế tắc thật giữa hai mutex pthread, sửa bằng thứ tự khoá và trylock lùi ngẫu nhiên, nhân Linux phát hiện bế tắc của fcntl và trả EDEADLK, pipe đầy hai chiều, JVM tự tìm chu trình bằng ThreadMXBean và jstack, pool luồng tự bế tắc, Node.js chờ nhau bằng Promise, và bế tắc của PostgreSQL trong backend thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.A · deck "Chapter 6 · Deadlocks", slides 1–31</span>
<h2>When everybody waits for everybody: what a deadlock is, how to find one, and how to make sure it never happens</h2>
<p class="lead">Chapter 2 gave you locks and semaphores to stop race conditions. Chapter 6 shows the price: the same tools can freeze a program forever. Two threads each holding one lock and waiting for the other's; two database transactions each holding one row; a thread pool whose threads all wait for tasks that have no thread to run on — in production these look like a server that "just hangs", with no error message and the CPU at zero. The deck follows sections 6.1–6.7 of the book: resources (slides 2–4), the definition and the four conditions (5–7), modelling with graphs (8–11), detection and recovery (12–19), avoidance with safe states and the banker's algorithm (20–25), prevention (26–28) and other issues — communication deadlocks, livelock, starvation (29–30).</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>6.1 Resources</td><td>tell preemptable from nonpreemptable resources and write the request–use–release pattern with semaphores</td></tr>
<tr><td>5–7</td><td>6.2 Introduction to deadlocks</td><td>define a deadlock, name the four Coffman conditions and read a resource-allocation graph</td></tr>
<tr><td>8–11</td><td>6.2.2 Deadlock modeling</td><td>replay Figure 6-4 event by event and list the four strategies</td></tr>
<tr><td>12–15</td><td>6.4.1 Detection, one resource of each type</td><td>find a cycle with the book's depth-first algorithm</td></tr>
<tr><td>16–18</td><td>6.4.2 Detection, several resources of each type</td><td>run the E–A–C–R matrix algorithm by hand</td></tr>
<tr><td>19</td><td>6.4.3 Recovery</td><td>compare preemption, rollback and killing — and see PostgreSQL do it</td></tr>
<tr><td>20–25</td><td>6.5 Deadlock avoidance</td><td>draw resource trajectories, decide safe or unsafe, and run the banker's algorithm (FE calculation questions)</td></tr>
<tr><td>26–28</td><td>6.6 Deadlock prevention</td><td>attack each condition, especially by ordering locks</td></tr>
<tr><td>29–30</td><td>6.7 Other issues</td><td>recognise communication deadlocks, livelock and starvation</td></tr>
</tbody>
</table>
<div class="callout">The two older web lessons 6.1 and 6.2 further down stay as short summaries (the four conditions; the banker's algorithm on the 10/5/7 example) — this lesson refers to them instead of repeating them. Dining philosophers, the classic deadlock example, was already run for real in lesson 2.C (slides 67–71); here we build on it.</div>`,
    `<span class="eyebrow">Chương 6 · Bài 6.A · deck "Chapter 6 · Deadlocks", slide 1–31</span>
<h2>Khi ai cũng chờ ai: bế tắc là gì, tìm ra nó thế nào, và làm sao để nó không bao giờ xảy ra</h2>
<p class="lead">Chương 2 cho bạn khoá (lock) và semaphore để chặn tranh chấp (race condition). Chương 6 cho thấy cái giá: chính các công cụ đó có thể làm chương trình đứng hình mãi mãi. Hai luồng mỗi bên giữ một khoá và chờ khoá của bên kia; hai giao dịch cơ sở dữ liệu mỗi bên giữ một dòng; một thread pool mà mọi luồng đều chờ những việc không còn luồng nào để chạy — ngoài đời những thứ này trông như một server "tự nhiên treo", không thông báo lỗi nào, CPU về 0. Bộ slide đi theo mục 6.1–6.7 của sách: tài nguyên (slide 2–4), định nghĩa và bốn điều kiện (5–7), mô hình hoá bằng đồ thị (8–11), phát hiện và khôi phục (12–19), tránh bế tắc bằng trạng thái an toàn và thuật toán nhà băng (20–25), ngăn ngừa (26–28) và các vấn đề khác — bế tắc truyền thông, livelock, bỏ đói (29–30).</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>6.1 Tài nguyên</td><td>phân biệt tài nguyên trưng dụng được và không trưng dụng được, viết mẫu xin–dùng–trả bằng semaphore</td></tr>
<tr><td>5–7</td><td>6.2 Nhập môn bế tắc</td><td>định nghĩa bế tắc, kể bốn điều kiện Coffman và đọc đồ thị cấp phát tài nguyên</td></tr>
<tr><td>8–11</td><td>6.2.2 Mô hình hoá bế tắc</td><td>diễn lại Hình 6-4 từng sự kiện và kể bốn chiến lược</td></tr>
<tr><td>12–15</td><td>6.4.1 Phát hiện, mỗi loại một tài nguyên</td><td>tìm chu trình bằng thuật toán duyệt sâu của sách</td></tr>
<tr><td>16–18</td><td>6.4.2 Phát hiện, mỗi loại nhiều tài nguyên</td><td>chạy tay thuật toán ma trận E–A–C–R</td></tr>
<tr><td>19</td><td>6.4.3 Khôi phục</td><td>so sánh trưng dụng, quay lui và giết tiến trình — và xem PostgreSQL làm thật</td></tr>
<tr><td>20–25</td><td>6.5 Tránh bế tắc</td><td>vẽ quỹ đạo tài nguyên, xét an toàn hay không, chạy thuật toán nhà băng (câu tính toán FE)</td></tr>
<tr><td>26–28</td><td>6.6 Ngăn ngừa bế tắc</td><td>tấn công từng điều kiện, nhất là bằng thứ tự khoá</td></tr>
<tr><td>29–30</td><td>6.7 Các vấn đề khác</td><td>nhận ra bế tắc truyền thông, livelock và bỏ đói</td></tr>
</tbody>
</table>
<div class="callout">Hai bài web cũ 6.1 và 6.2 phía dưới vẫn giữ làm bản tóm tắt ngắn (bốn điều kiện; thuật toán nhà băng trên ví dụ 10/5/7) — bài này dẫn sang chúng thay vì lặp lại. Bữa tối các triết gia, ví dụ bế tắc kinh điển, đã được chạy thật ở bài 2.C (slide 67–71); ở đây ta xây tiếp trên nó.</div>`),
    walkHead('osg6', 1, 31),
    walk('osg6', [
      [1, 'Deadlocks',
        `<p class="y-chinh">🎯 Chapter 6 of <em>Modern Operating Systems</em> (4th edition): <strong>deadlocks</strong> — a set of processes (or threads) stuck forever because each one waits for something only another one in the set can give.</p>
<p>Think of a narrow one-lane bridge with a car entering from each end. Both drivers reach the middle, nose to nose. Neither can move forward, neither wants to reverse, and nobody else can help. That is a deadlock: nobody is broken, everybody is waiting, and the waiting will never end on its own. The book's computer version: process A has the scanner and asks for the Blu-ray recorder, process B has the recorder and asks for the scanner — both block forever.</p>
<p>In the syllabus this chapter is outcome <strong>CLO6</strong>, examined in Progress Test 2 together with file systems and I/O, and it is one of the most frequent topics of the FE: in the 29 FE papers of the question bank there are more than 100 deadlock questions — definitions (preemptable resource, the four conditions, ostrich algorithm), matching (which approach attacks which condition), and calculations (safe sequence of the banker's algorithm, smallest value of x, which event causes the deadlock). Every calculation below is computed by a simulator, and every bank answer that disagrees with the textbook is pointed out.</p>
<p>➕ Why a backend developer cares: deadlocks are not an exam curiosity. PostgreSQL detects and kills a few deadlocked transactions on almost every busy system; Java servers hang on lock-order bugs; thread pools and connection pools freeze when their threads wait for each other. The second half of each slide shows where the textbook idea appears in real code — and the code is run.</p>
<p class="meo">🧠 One sentence for the chapter: <em>a deadlock needs four things at once — exclusive resources, holding while waiting, no taking back, and a cycle — so remove any one of them and it cannot happen.</em></p>`,
        `<p class="y-chinh">🎯 Chương 6 của <em>Modern Operating Systems</em> (bản 4): <strong>bế tắc (deadlock)</strong> — một nhóm tiến trình (hoặc luồng) kẹt mãi mãi vì mỗi thành viên đều chờ một thứ mà chỉ thành viên khác trong nhóm mới đưa được.</p>
<p>Hãy nghĩ tới một cây cầu hẹp chỉ đủ một làn xe, mỗi đầu có một ô tô đi vào. Cả hai tài xế ra tới giữa cầu, mũi chạm mũi. Không ai tiến được, không ai chịu lùi, và chẳng ai khác giúp được. Đó là bế tắc: không ai hỏng, ai cũng đang chờ, và sự chờ đó không bao giờ tự kết thúc. Bản máy tính trong sách: tiến trình A đang giữ máy quét và xin đầu ghi Blu-ray, tiến trình B đang giữ đầu ghi và xin máy quét — cả hai bị chặn vĩnh viễn.</p>
<p>Trong đề cương, chương này là chuẩn đầu ra <strong>CLO6</strong>, thi trong Progress Test 2 cùng hệ thống tệp và I/O, và là một trong những chủ đề xuất hiện nhiều nhất trong FE: trong 29 đề FE của ngân hàng câu hỏi có hơn 100 câu về bế tắc — định nghĩa (tài nguyên trưng dụng được, bốn điều kiện, thuật toán đà điểu), ghép cặp (cách nào tấn công điều kiện nào) và tính toán (chuỗi an toàn của thuật toán nhà băng, giá trị x nhỏ nhất, sự kiện nào gây bế tắc). Mọi phép tính bên dưới đều do bộ mô phỏng tính, và mọi đáp án ngân hàng trái với giáo trình đều được chỉ ra.</p>
<p>➕ Vì sao dev backend phải quan tâm: bế tắc không phải trò đố của đề thi. PostgreSQL phát hiện và huỷ vài giao dịch bế tắc trên gần như mọi hệ thống đông khách; server Java treo vì lỗi thứ tự khoá; thread pool và connection pool đứng hình khi các luồng của nó chờ lẫn nhau. Nửa sau của mỗi slide cho thấy ý tưởng trong sách xuất hiện ở đâu trong mã thật — và mã đó được chạy thật.</p>
<p class="meo">🧠 Cả chương trong một câu: <em>bế tắc cần bốn thứ cùng lúc — tài nguyên độc quyền, vừa giữ vừa chờ, không bị lấy lại, và một vòng tròn — nên bỏ bất kỳ một thứ nào là nó không thể xảy ra.</em></p>`],
      [2, 'Preemptable and Nonpreemptable Resources',
        `<p class="y-chinh">🎯 A <strong>resource</strong> is anything that must be granted, used and released over time — a device, a record in a database, a lock. Using one always takes three steps: <strong>1. request</strong> it, <strong>2. use</strong> it, <strong>3. release</strong> it. If the request cannot be granted, the requester waits (blocks, or sleeps a little and tries again).</p>
<p>➕ The slide's title promises two definitions that its body never gives — and the FE asks them constantly. From §6.1.1 of the book:</p>
<ul>
<li>A <strong>preemptable resource</strong> can be taken away from the process owning it <em>with no ill effects</em>. Memory is the textbook example: the OS can write a process's pages to disk (swap) and give the frames to someone else, then bring them back later; the process never notices. The CPU is preemptable too — that is exactly what a time slice does.</li>
<li>A <strong>nonpreemptable resource</strong> cannot be taken away from its current owner <em>without potentially causing failure</em>. If a process has begun to burn a Blu-ray, taking the recorder away and giving it to someone else produces a garbled disc. Printers, tape drives, a half-written file and — in backend code — a row locked inside a database transaction are nonpreemptable.</li>
</ul>
<p>Deadlocks involve <strong>nonpreemptable</strong> resources. With preemptable ones the OS can always break a potential deadlock by reallocating — that is why two programs fighting over RAM end up slow (paging), not deadlocked. Whether a resource is preemptable can depend on the context: on a PC that cannot swap, memory becomes nonpreemptable.</p>
<p>🧭 On a real server: a PostgreSQL row lock is nonpreemptable in the textbook sense — the database cannot hand your locked row to another transaction halfway through your <code>UPDATE</code>. The only way to "take it back" is to <strong>abort</strong> your whole transaction (rollback), which is exactly what PostgreSQL does when it detects a deadlock (slide 19).</p>
<p class="pitfall">⚠️ FE wording: preemptable = "can be taken away with no ill effects" (FE6#44, FE11#42, FE23#4, FE29#25); nonpreemptable = "will cause the process to fail if taken away" (FE19#10, FE24#12, FE27#17) — the Blu-ray story is the nonpreemptable example (FE5#46, FE7#43, FE12#42); memory is the preemptable example (FE20#14). Careful: several banks key the garbled option "cannot be taken away <em>with</em> potentially causing failure" (FE8#42, FE12#43, FE13#43, FE14#46); the book's sentence is "cannot be taken away … <em>without</em> potentially causing failure" (FE7#42, FE16#43).</p>`,
        `<p class="y-chinh">🎯 <strong>Tài nguyên (resource)</strong> là bất cứ thứ gì phải được cấp, được dùng rồi được trả theo thời gian — một thiết bị, một bản ghi trong cơ sở dữ liệu, một khoá. Dùng tài nguyên luôn qua ba bước: <strong>1. xin (request)</strong>, <strong>2. dùng (use)</strong>, <strong>3. trả (release)</strong>. Xin không được thì bên xin phải chờ (bị chặn, hoặc ngủ một chút rồi thử lại).</p>
<p>➕ Tiêu đề slide hứa hai định nghĩa mà thân slide không hề đưa — trong khi FE hỏi chúng liên tục. Theo mục 6.1.1 của sách:</p>
<ul>
<li><strong>Tài nguyên trưng dụng được (preemptable resource)</strong> là tài nguyên có thể lấy khỏi tiến trình đang giữ nó <em>mà không gây hậu quả xấu</em>. Bộ nhớ là ví dụ kinh điển: HĐH có thể ghi các trang của một tiến trình ra đĩa (swap) để đưa khung trang cho người khác, rồi nạp lại sau; tiến trình chẳng hề hay biết. CPU cũng trưng dụng được — lát cắt thời gian (time slice) chính là việc đó.</li>
<li><strong>Tài nguyên không trưng dụng được (nonpreemptable resource)</strong> là tài nguyên không thể lấy khỏi chủ hiện tại <em>mà không có nguy cơ gây hỏng</em>. Nếu một tiến trình đang ghi dở đĩa Blu-ray, giật đầu ghi đưa cho người khác thì đĩa hỏng. Máy in, ổ băng từ, một tệp đang ghi dở và — trong mã backend — một dòng bị khoá bên trong một giao dịch cơ sở dữ liệu đều không trưng dụng được.</li>
</ul>
<p>Bế tắc liên quan tới tài nguyên <strong>không trưng dụng được</strong>. Với tài nguyên trưng dụng được, HĐH luôn phá được một bế tắc tiềm năng bằng cách cấp phát lại — vì vậy hai chương trình tranh RAM chỉ chạy chậm (phân trang), chứ không bế tắc. Một tài nguyên có trưng dụng được hay không còn tuỳ hoàn cảnh: trên một máy tính không swap được, bộ nhớ trở thành không trưng dụng được.</p>
<p>🧭 Trên server thật: khoá dòng của PostgreSQL là không trưng dụng được theo đúng nghĩa của sách — cơ sở dữ liệu không thể đưa dòng bạn đang khoá cho giao dịch khác giữa chừng câu <code>UPDATE</code> của bạn. Cách duy nhất để "lấy lại" là <strong>huỷ</strong> cả giao dịch của bạn (rollback), và đó chính là việc PostgreSQL làm khi phát hiện bế tắc (slide 19).</p>
<p class="pitfall">⚠️ Cách FE hỏi: trưng dụng được = "can be taken away with no ill effects" (FE6#44, FE11#42, FE23#4, FE29#25); không trưng dụng được = "will cause the process to fail if taken away" (FE19#10, FE24#12, FE27#17) — chuyện đĩa Blu-ray là ví dụ không trưng dụng được (FE5#46, FE7#43, FE12#42); bộ nhớ là ví dụ trưng dụng được (FE20#14). Cẩn thận: nhiều đề trong ngân hàng đánh dấu phương án viết sai "cannot be taken away <em>with</em> potentially causing failure" (FE8#42, FE12#43, FE13#43, FE14#46); câu của sách là "cannot be taken away … <em>without</em> potentially causing failure" (FE7#42, FE16#43).</p>`],
      [3, 'Resource Acquisition (1)',
        `<p class="y-chinh">🎯 Figure 6-1: protect each resource with a semaphore initialised to 1 — (a) for one resource: <code>down(&amp;resource_1)</code>, use it, <code>up(&amp;resource_1)</code>; (b) for two resources: <code>down</code> both in turn, use both, <code>up</code> both in the reverse order.</p>
<p>This is the request–use–release pattern of slide 2 written in code. For some resources (records in a database system) the user process itself manages them, so the OS cannot even see them — the program has to do the locking. A semaphore (Chapter 2, lesson 2.B) is the natural tool: <code>down</code> = request (blocks if the value is 0), <code>up</code> = release (wakes a waiter). With one process, (b) is fine: it simply takes two resources one after the other. The trouble starts with two processes, on the next slide.</p>
<p>➕ The book writes <code>typedef int semaphore</code> — pseudo-code. Real C uses POSIX <code>sem_t</code>: <code>sem_wait</code> is down, <code>sem_post</code> is up. A semaphore can also model a resource type with <em>several</em> identical instances (two printers): initialise it to 2, and its value is exactly the number of free instances — the vector A of slide 16:</p>
<pre><code class="language-c">// Figure 6-1 with real POSIX semaphores: a semaphore per resource TYPE, its value = free instances
#include &lt;stdio.h&gt;
#include &lt;semaphore.h&gt;

sem_t printers, scanner;
void show(const char *what) {
    int p, s;
    sem_getvalue(&amp;printers, &amp;p); sem_getvalue(&amp;scanner, &amp;s);
    printf("%-34s free printers = %d, free scanners = %d\\n", what, p, s);
}

int main(void) {
    sem_init(&amp;printers, 0, 2);                    // 2 instances of "printer" (E = 2)
    sem_init(&amp;scanner, 0, 1);                     // 1 instance of "scanner"
    show("start:");
    sem_wait(&amp;printers);  show("down(&amp;printers)  -&gt; request");      // 1. request
    sem_wait(&amp;scanner);   show("down(&amp;scanner)   -&gt; request");
    /* use_both_resources(); */                                     // 2. use
    sem_post(&amp;scanner);   show("up(&amp;scanner)     -&gt; release");      // 3. release
    sem_post(&amp;printers);  show("up(&amp;printers)    -&gt; release");
    sem_wait(&amp;scanner);
    printf("a second down(&amp;scanner) now: sem_trywait -&gt; %s\\n", sem_trywait(&amp;scanner) == 0 ? "got it" : "EAGAIN (would block: 0 left)");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread hinh-6-1.c -o hinh-6-1 &amp;&amp; ./hinh-6-1<br>
start: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free printers = 2, free scanners = 1<br>
down(&amp;printers) &nbsp;-&gt; request &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free printers = 1, free scanners = 1<br>
down(&amp;scanner) &nbsp;&nbsp;-&gt; request &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free printers = 1, free scanners = 0<br>
up(&amp;scanner) &nbsp;&nbsp;&nbsp;&nbsp;-&gt; release &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free printers = 1, free scanners = 1<br>
up(&amp;printers) &nbsp;&nbsp;&nbsp;-&gt; release &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free printers = 2, free scanners = 1<br>
a second down(&amp;scanner) now: sem_trywait -&gt; EAGAIN (would block: 0 left)</div>
<p>Each <code>sem_wait</code> took one instance (request), each <code>sem_post</code> gave it back (release). When the value is 0, a second <code>down</code> would block — <code>sem_trywait</code> shows it instead of hanging: <code>EAGAIN</code>. Remember this: <em>a blocked down</em> is how every deadlock in this chapter begins.</p>
<p>🧭 On a real server: the same pattern appears as <code>pthread_mutex_lock/unlock</code>, Java <code>synchronized</code> or <code>lock()/unlock()</code> in <code>try/finally</code>, a <code>BEGIN … SELECT … FOR UPDATE … COMMIT</code> block in SQL, and in Node.js as an async mutex. Different syntax, same three steps.</p>
<p class="meo">🧠 Release in the reverse order of acquisition (LIFO) — it does not prevent deadlock by itself, but it keeps the code easy to reason about and matches the way <code>try/finally</code> and nested blocks unwind.</p>`,
        `<p class="y-chinh">🎯 Hình 6-1: bảo vệ mỗi tài nguyên bằng một semaphore khởi tạo bằng 1 — (a) với một tài nguyên: <code>down(&amp;resource_1)</code>, dùng nó, <code>up(&amp;resource_1)</code>; (b) với hai tài nguyên: lần lượt <code>down</code> cả hai, dùng cả hai, <code>up</code> cả hai theo thứ tự ngược lại.</p>
<p>Đây là mẫu xin–dùng–trả của slide 2 viết thành mã. Với một số tài nguyên (bản ghi trong hệ cơ sở dữ liệu), chính tiến trình người dùng quản lý chúng, nên HĐH thậm chí không thấy chúng — chương trình phải tự khoá. Semaphore (Chương 2, bài 2.B) là công cụ tự nhiên: <code>down</code> = xin (chặn nếu giá trị bằng 0), <code>up</code> = trả (đánh thức một kẻ đang chờ). Với một tiến trình, (b) chẳng có vấn đề gì: nó chỉ lấy hai tài nguyên lần lượt. Rắc rối bắt đầu khi có hai tiến trình, ở slide sau.</p>
<p>➕ Sách viết <code>typedef int semaphore</code> — đó là mã giả. C thật dùng <code>sem_t</code> của POSIX: <code>sem_wait</code> là down, <code>sem_post</code> là up. Semaphore còn mô hình được một loại tài nguyên có <em>nhiều</em> thể hiện giống nhau (hai máy in): khởi tạo bằng 2, và giá trị của nó đúng bằng số thể hiện còn rảnh — chính vector A của slide 16:</p>
<pre><code class="language-c">// Hình 6-1 bằng semaphore POSIX thật: mỗi LOẠI tài nguyên một semaphore, giá trị = số thể hiện còn rảnh
#include &lt;stdio.h&gt;
#include &lt;semaphore.h&gt;

sem_t printers, scanner;
void show(const char *what) {
    int p, s;
    sem_getvalue(&amp;printers, &amp;p); sem_getvalue(&amp;scanner, &amp;s);
    printf("%-34s free printers = %d, free scanners = %d\\n", what, p, s);
}

int main(void) {
    sem_init(&amp;printers, 0, 2);                    // 2 thể hiện "máy in" (E = 2)
    sem_init(&amp;scanner, 0, 1);                     // 1 thể hiện "máy quét"
    show("start:");
    sem_wait(&amp;printers);  show("down(&amp;printers)  -&gt; request");      // 1. xin
    sem_wait(&amp;scanner);   show("down(&amp;scanner)   -&gt; request");
    /* use_both_resources(); */                                     // 2. dùng
    sem_post(&amp;scanner);   show("up(&amp;scanner)     -&gt; release");      // 3. trả
    sem_post(&amp;printers);  show("up(&amp;printers)    -&gt; release");
    sem_wait(&amp;scanner);
    printf("a second down(&amp;scanner) now: sem_trywait -&gt; %s\\n", sem_trywait(&amp;scanner) == 0 ? "got it" : "EAGAIN (would block: 0 left)");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread hinh-6-1.c -o hinh-6-1 &amp;&amp; ./hinh-6-1<br>
start: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free printers = 2, free scanners = 1<br>
down(&amp;printers) &nbsp;-&gt; request &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free printers = 1, free scanners = 1<br>
down(&amp;scanner) &nbsp;&nbsp;-&gt; request &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free printers = 1, free scanners = 0<br>
up(&amp;scanner) &nbsp;&nbsp;&nbsp;&nbsp;-&gt; release &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free printers = 1, free scanners = 1<br>
up(&amp;printers) &nbsp;&nbsp;&nbsp;-&gt; release &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free printers = 2, free scanners = 1<br>
a second down(&amp;scanner) now: sem_trywait -&gt; EAGAIN (would block: 0 left)</div>
<p>Mỗi <code>sem_wait</code> lấy một thể hiện (xin), mỗi <code>sem_post</code> trả nó lại (trả). Khi giá trị bằng 0, một <code>down</code> nữa sẽ bị chặn — <code>sem_trywait</code> cho thấy điều đó thay vì treo: <code>EAGAIN</code>. Hãy nhớ: <em>một lần down bị chặn</em> là cách mọi bế tắc trong chương này bắt đầu.</p>
<p>🧭 Trên server thật: cùng mẫu này xuất hiện dưới dạng <code>pthread_mutex_lock/unlock</code>, <code>synchronized</code> của Java hoặc <code>lock()/unlock()</code> trong <code>try/finally</code>, một khối <code>BEGIN … SELECT … FOR UPDATE … COMMIT</code> trong SQL, và trong Node.js là một async mutex. Cú pháp khác nhau, vẫn ba bước.</p>
<p class="meo">🧠 Trả theo thứ tự ngược với lúc lấy (vào sau ra trước — LIFO) — tự nó không ngăn được bế tắc, nhưng giữ mã dễ suy luận và khớp cách <code>try/finally</code> cùng các khối lồng nhau tự tháo ra.</p>`],
      [4, 'Resource Acquisition (2)',
        `<p class="y-chinh">🎯 Figure 6-2: two processes A and B both need resource_1 and resource_2. (a) <strong>Deadlock-free</strong>: both ask in the same order — 1, then 2. (b) <strong>Potential deadlock</strong>: A asks 1 then 2, B asks 2 then 1.</p>
<p>In (a), whoever gets resource_1 first is guaranteed to get resource_2 as well — the other process blocks on resource_1 while holding nothing, and simply waits its turn. In (b), an unlucky interleaving ruins everything: A takes resource_1, B takes resource_2, then A blocks on resource_2 (held by B) and B blocks on resource_1 (held by A). Neither will ever run again. Note the word <em>potential</em>: (b) works correctly most of the time — that is why such bugs pass testing and appear in production under load. The two versions of the code differ by a single swapped line, which the book calls "a subtle difference that is easy to miss".</p>
<p>➕ Version (b) with real pthread mutexes. Each process pauses 0.1 s between its two locks — like a slow database call — so the bad interleaving happens on almost every run; a watchdog in <code>main</code> reports after 1 s instead of letting the program hang:</p>
<pre><code class="language-c">// Figure 6-2(b) with two pthread mutexes: a REAL deadlock, and a watchdog so the program still ends
#define _GNU_SOURCE                                    // for pthread_tryjoin_np
#include &lt;stdio.h&gt;
#include &lt;errno.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;

pthread_mutex_t resource_1 = PTHREAD_MUTEX_INITIALIZER;
pthread_mutex_t resource_2 = PTHREAD_MUTEX_INITIALIZER;

void *process_A(void *arg) {
    pthread_mutex_lock(&amp;resource_1);                    // down(&amp;resource_1)
    printf("A: holds resource_1, asks for resource_2\\n");
    usleep(100 * 1000);                                 // 0.1 s — enough for B to grab resource_2
    pthread_mutex_lock(&amp;resource_2);                    // blocks forever
    printf("A finished\\n");                             // never printed
    pthread_mutex_unlock(&amp;resource_2);
    pthread_mutex_unlock(&amp;resource_1);
    return NULL;
}

void *process_B(void *arg) {
    pthread_mutex_lock(&amp;resource_2);                    // the OTHER order
    printf("B: holds resource_2, asks for resource_1\\n");
    usleep(100 * 1000);
    pthread_mutex_lock(&amp;resource_1);
    printf("B finished\\n");
    pthread_mutex_unlock(&amp;resource_1);
    pthread_mutex_unlock(&amp;resource_2);
    return NULL;
}

int main(void) {
    pthread_t a, b;
    alarm(5);                                           // last safety net: SIGALRM kills the process after 5 s
    pthread_create(&amp;a, NULL, process_A, NULL);
    pthread_create(&amp;b, NULL, process_B, NULL);
    sleep(1);                                           // the watchdog waits 1 s
    int ra = pthread_tryjoin_np(a, NULL), rb = pthread_tryjoin_np(b, NULL);
    printf("after 1 s: A %s, B %s\\n", ra == EBUSY ? "still running" : "ended", rb == EBUSY ? "still running" : "ended");
    printf("trylock(resource_1) = %s\\n", pthread_mutex_trylock(&amp;resource_1) == EBUSY ? "EBUSY" : "0");
    printf("trylock(resource_2) = %s\\n", pthread_mutex_trylock(&amp;resource_2) == EBUSY ? "EBUSY" : "0");
    if (ra == EBUSY &amp;&amp; rb == EBUSY)
        printf("both held, both waited, nobody gives up: DEADLOCK\\n");
    return 0;                                           // exit() ends the whole process, blocked threads included
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread khoa-chet.c -o khoa-chet &amp;&amp; ./khoa-chet<br>
B: holds resource_2, asks for resource_1<br>
A: holds resource_1, asks for resource_2<br>
after 1 s: A still running, B still running<br>
trylock(resource_1) = EBUSY<br>
trylock(resource_2) = EBUSY<br>
both held, both waited, nobody gives up: DEADLOCK</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Both threads are still "running" after 1 s, both mutexes are taken (<code>trylock</code> returns <code>EBUSY</code>), and neither line "finished" was printed. Note that the first two lines can come in either order: the two threads really run in parallel. And the fix of version (a) — one global order — run with 400,000 transfers in opposite directions:</p>
<pre><code class="language-c">// Figure 6-2(a) and Figure 6-13: take the locks in ONE global order — the deadlock cannot happen
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

#define N_ACC 2
struct account { int id; long balance; pthread_mutex_t lock; } acc[N_ACC] = {
    { 1, 1000000, PTHREAD_MUTEX_INITIALIZER }, { 2, 1000000, PTHREAD_MUTEX_INITIALIZER } };

void transfer(struct account *from, struct account *to, long amount) {
    // lock the account with the SMALLER id first, whatever the direction
    struct account *first  = from-&gt;id &lt; to-&gt;id ? from : to;
    struct account *second = from-&gt;id &lt; to-&gt;id ? to : from;
    pthread_mutex_lock(&amp;first-&gt;lock);
    pthread_mutex_lock(&amp;second-&gt;lock);
    from-&gt;balance -= amount;
    to-&gt;balance   += amount;
    pthread_mutex_unlock(&amp;second-&gt;lock);
    pthread_mutex_unlock(&amp;first-&gt;lock);
}

void *one_to_two(void *x) { for (int i = 0; i &lt; 200000; i++) transfer(&amp;acc[0], &amp;acc[1], 3); return NULL; }
void *two_to_one(void *x) { for (int i = 0; i &lt; 200000; i++) transfer(&amp;acc[1], &amp;acc[0], 2); return NULL; }

int main(void) {
    pthread_t t1, t2;
    pthread_create(&amp;t1, NULL, one_to_two, NULL);   // 200,000 transfers 1 -&gt; 2
    pthread_create(&amp;t2, NULL, two_to_one, NULL);   // 200,000 transfers 2 -&gt; 1, at the same time
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("account 1 = %ld\\naccount 2 = %ld\\n", acc[0].balance, acc[1].balance);
    printf("total     = %ld (must stay 2000000)\\n", acc[0].balance + acc[1].balance);
    printf("400000 transfers in opposite directions finished: no deadlock\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread thu-tu-khoa.c -o thu-tu-khoa &amp;&amp; ./thu-tu-khoa<br>
account 1 = 800000<br>
account 2 = 1200000<br>
total &nbsp;&nbsp;&nbsp;&nbsp;= 2000000 (must stay 2000000)<br>
400000 transfers in opposite directions finished: no deadlock</div>
<p>The function decides the lock order by account id, not by the direction of the transfer — so "1 → 2" and "2 → 1" both lock account 1 first. That is Figure 6-2(a) in a form you can use in a banking service (slide 27 generalises it).</p>
<p class="pitfall">⚠️ "Swap two <code>down</code>s and the program may deadlock" is the classic exam trap of Chapters 2 and 6 alike: the producer–consumer with <code>down(&amp;mutex)</code> before <code>down(&amp;empty)</code> (lesson 2.B, slide 38) is the same bug.</p>`,
        `<p class="y-chinh">🎯 Hình 6-2: hai tiến trình A và B cùng cần resource_1 và resource_2. (a) <strong>Không bế tắc</strong>: cả hai xin theo cùng thứ tự — 1 rồi 2. (b) <strong>Có thể bế tắc</strong>: A xin 1 rồi 2, B xin 2 rồi 1.</p>
<p>Ở (a), ai lấy được resource_1 trước chắc chắn cũng lấy được resource_2 — tiến trình kia bị chặn ở resource_1 trong khi chẳng giữ gì, và chỉ việc chờ tới lượt. Ở (b), một cách xen kẽ không may làm hỏng tất cả: A lấy resource_1, B lấy resource_2, rồi A bị chặn ở resource_2 (B đang giữ) và B bị chặn ở resource_1 (A đang giữ). Không ai được chạy lại nữa. Để ý chữ <em>có thể</em>: (b) chạy đúng phần lớn thời gian — vì vậy lỗi kiểu này qua được kiểm thử rồi mới lộ ra trên production khi tải cao. Hai phiên bản mã chỉ khác nhau đúng một dòng bị đảo, điều sách gọi là "một khác biệt tinh tế, rất dễ bỏ sót".</p>
<p>➕ Phiên bản (b) bằng mutex pthread thật. Mỗi tiến trình dừng 0,1 giây giữa hai lần khoá — như một lần gọi cơ sở dữ liệu chậm — nên cách xen kẽ xấu xảy ra gần như mọi lần chạy; một bộ canh (watchdog) trong <code>main</code> báo cáo sau 1 giây thay vì để chương trình treo:</p>
<pre><code class="language-c">// Hình 6-2(b) bằng hai mutex pthread: bế tắc THẬT, kèm một bộ canh để chương trình vẫn kết thúc
#define _GNU_SOURCE                                    // để dùng pthread_tryjoin_np
#include &lt;stdio.h&gt;
#include &lt;errno.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;

pthread_mutex_t resource_1 = PTHREAD_MUTEX_INITIALIZER;
pthread_mutex_t resource_2 = PTHREAD_MUTEX_INITIALIZER;

void *process_A(void *arg) {
    pthread_mutex_lock(&amp;resource_1);                    // down(&amp;resource_1)
    printf("A: holds resource_1, asks for resource_2\\n");
    usleep(100 * 1000);                                 // 0,1 giây — đủ để B kịp lấy resource_2
    pthread_mutex_lock(&amp;resource_2);                    // chặn mãi mãi
    printf("A finished\\n");                             // không bao giờ in
    pthread_mutex_unlock(&amp;resource_2);
    pthread_mutex_unlock(&amp;resource_1);
    return NULL;
}

void *process_B(void *arg) {
    pthread_mutex_lock(&amp;resource_2);                    // thứ tự NGƯỢC LẠI
    printf("B: holds resource_2, asks for resource_1\\n");
    usleep(100 * 1000);
    pthread_mutex_lock(&amp;resource_1);
    printf("B finished\\n");
    pthread_mutex_unlock(&amp;resource_1);
    pthread_mutex_unlock(&amp;resource_2);
    return NULL;
}

int main(void) {
    pthread_t a, b;
    alarm(5);                                           // lưới cuối: SIGALRM giết tiến trình sau 5 giây
    pthread_create(&amp;a, NULL, process_A, NULL);
    pthread_create(&amp;b, NULL, process_B, NULL);
    sleep(1);                                           // bộ canh chờ 1 giây
    int ra = pthread_tryjoin_np(a, NULL), rb = pthread_tryjoin_np(b, NULL);
    printf("after 1 s: A %s, B %s\\n", ra == EBUSY ? "still running" : "ended", rb == EBUSY ? "still running" : "ended");
    printf("trylock(resource_1) = %s\\n", pthread_mutex_trylock(&amp;resource_1) == EBUSY ? "EBUSY" : "0");
    printf("trylock(resource_2) = %s\\n", pthread_mutex_trylock(&amp;resource_2) == EBUSY ? "EBUSY" : "0");
    if (ra == EBUSY &amp;&amp; rb == EBUSY)
        printf("both held, both waited, nobody gives up: DEADLOCK\\n");
    return 0;                                           // exit() kết thúc cả tiến trình, kể cả các luồng đang bị chặn
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread khoa-chet.c -o khoa-chet &amp;&amp; ./khoa-chet<br>
B: holds resource_2, asks for resource_1<br>
A: holds resource_1, asks for resource_2<br>
after 1 s: A still running, B still running<br>
trylock(resource_1) = EBUSY<br>
trylock(resource_2) = EBUSY<br>
both held, both waited, nobody gives up: DEADLOCK</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Sau 1 giây cả hai luồng vẫn "đang chạy", cả hai mutex đều đã bị lấy (<code>trylock</code> trả <code>EBUSY</code>), và không dòng "finished" nào được in. Để ý hai dòng đầu có thể ra theo thứ tự bất kỳ: hai luồng chạy song song thật. Còn đây là cách sửa của phiên bản (a) — một thứ tự chung — chạy với 400.000 lần chuyển tiền ngược chiều nhau:</p>
<pre><code class="language-c">// Hình 6-2(a) và Hình 6-13: lấy khoá theo MỘT thứ tự chung — bế tắc không thể xảy ra
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

#define N_ACC 2
struct account { int id; long balance; pthread_mutex_t lock; } acc[N_ACC] = {
    { 1, 1000000, PTHREAD_MUTEX_INITIALIZER }, { 2, 1000000, PTHREAD_MUTEX_INITIALIZER } };

void transfer(struct account *from, struct account *to, long amount) {
    // khoá tài khoản có id NHỎ hơn trước, bất kể chiều chuyển
    struct account *first  = from-&gt;id &lt; to-&gt;id ? from : to;
    struct account *second = from-&gt;id &lt; to-&gt;id ? to : from;
    pthread_mutex_lock(&amp;first-&gt;lock);
    pthread_mutex_lock(&amp;second-&gt;lock);
    from-&gt;balance -= amount;
    to-&gt;balance   += amount;
    pthread_mutex_unlock(&amp;second-&gt;lock);
    pthread_mutex_unlock(&amp;first-&gt;lock);
}

void *one_to_two(void *x) { for (int i = 0; i &lt; 200000; i++) transfer(&amp;acc[0], &amp;acc[1], 3); return NULL; }
void *two_to_one(void *x) { for (int i = 0; i &lt; 200000; i++) transfer(&amp;acc[1], &amp;acc[0], 2); return NULL; }

int main(void) {
    pthread_t t1, t2;
    pthread_create(&amp;t1, NULL, one_to_two, NULL);   // 200.000 lần chuyển 1 -&gt; 2
    pthread_create(&amp;t2, NULL, two_to_one, NULL);   // 200.000 lần chuyển 2 -&gt; 1, cùng lúc
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("account 1 = %ld\\naccount 2 = %ld\\n", acc[0].balance, acc[1].balance);
    printf("total     = %ld (must stay 2000000)\\n", acc[0].balance + acc[1].balance);
    printf("400000 transfers in opposite directions finished: no deadlock\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread thu-tu-khoa.c -o thu-tu-khoa &amp;&amp; ./thu-tu-khoa<br>
account 1 = 800000<br>
account 2 = 1200000<br>
total &nbsp;&nbsp;&nbsp;&nbsp;= 2000000 (must stay 2000000)<br>
400000 transfers in opposite directions finished: no deadlock</div>
<p>Hàm quyết định thứ tự khoá theo id tài khoản, không theo chiều chuyển — nên cả "1 → 2" lẫn "2 → 1" đều khoá tài khoản 1 trước. Đó là Hình 6-2(a) ở dạng dùng được ngay trong một dịch vụ ngân hàng (slide 27 tổng quát hoá nó).</p>
<p class="pitfall">⚠️ "Đảo hai lệnh <code>down</code> là chương trình có thể bế tắc" là bẫy kinh điển của cả Chương 2 lẫn Chương 6: bài sản xuất–tiêu thụ với <code>down(&amp;mutex)</code> đứng trước <code>down(&amp;empty)</code> (bài 2.B, slide 38) chính là lỗi này.</p>`],
      [5, 'Deadlock Definition',
        `<p class="y-chinh">🎯 Definition: <em>a set of processes is deadlocked if each process in the set is waiting for an event that only another process in the set can cause.</em> In a resource deadlock that event is the <strong>release</strong> of a resource currently held by another member.</p>
<p>Read the definition word by word. "<strong>A set</strong>": a deadlock involves a group — the book's usual minimum is two processes. "<strong>Each</strong> waiting": every member is blocked; if one could still run it could release something and break the jam. "<strong>Only another process in the set</strong>": nobody outside can help — the waiting is closed in on itself. Because all of them are waiting, none of them can run, none can release any resource, and none can be awakened. The number of processes and the kind of resource (hardware or software) do not matter. The book also assumes no interrupts can wake a process up: a process woken by an alarm is not deadlocked.</p>
<p>➕ The smallest deadlock does not even need two threads: one thread that locks the same non-recursive mutex twice is waiting for itself to release it. POSIX lets the mutex type decide what happens; here are three types tried for real (each second lock gives up after 0.3 s):</p>
<pre><code class="language-c">// One thread, one mutex, locked twice: the smallest deadlock — and what each mutex type does about it
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;time.h&gt;
#include &lt;pthread.h&gt;

void try_type(const char *name, int type) {
    pthread_mutexattr_t at;
    pthread_mutex_t m;
    pthread_mutexattr_init(&amp;at);
    pthread_mutexattr_settype(&amp;at, type);
    pthread_mutex_init(&amp;m, &amp;at);
    pthread_mutex_lock(&amp;m);                                     // first lock: fine
    struct timespec until;
    clock_gettime(CLOCK_REALTIME, &amp;until);
    until.tv_nsec += 300 * 1000 * 1000;                         // give up after 0.3 s instead of hanging
    if (until.tv_nsec &gt;= 1000000000) { until.tv_sec++; until.tv_nsec -= 1000000000; }
    int r = pthread_mutex_timedlock(&amp;m, &amp;until);                // second lock by the SAME thread
    printf("%-26s second lock -&gt; %s\\n", name, r == 0 ? "0 (locked again, count = 2)" : r == EDEADLK ? "EDEADLK (refused: you already own it)" : r == ETIMEDOUT ? "ETIMEDOUT (it waited for itself)" : strerror(r));
}

int main(void) {
    try_type("PTHREAD_MUTEX_NORMAL", PTHREAD_MUTEX_NORMAL);
    try_type("PTHREAD_MUTEX_ERRORCHECK", PTHREAD_MUTEX_ERRORCHECK);
    try_type("PTHREAD_MUTEX_RECURSIVE", PTHREAD_MUTEX_RECURSIVE);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread tu-khoa.c -o tu-khoa &amp;&amp; ./tu-khoa<br>
PTHREAD_MUTEX_NORMAL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;second lock -&gt; ETIMEDOUT (it waited for itself)<br>
PTHREAD_MUTEX_ERRORCHECK &nbsp;&nbsp;second lock -&gt; EDEADLK (refused: you already own it)<br>
PTHREAD_MUTEX_RECURSIVE &nbsp;&nbsp;&nbsp;second lock -&gt; 0 (locked again, count = 2)</div>
<p><code>NORMAL</code> (the default kind) simply waits — for ever, without the timeout; <code>ERRORCHECK</code> notices that the caller already owns it and refuses with <code>EDEADLK</code> — the only deadlock pthreads detects for you; <code>RECURSIVE</code> counts the locks, which is why Java's <code>synchronized</code> and <code>ReentrantLock</code> can be re-entered by the same thread. A "set" of one is a corner case of the definition, but it is the first deadlock most programmers meet (a function holding a lock calls another function that takes the same lock).</p>
<p class="pitfall">⚠️ FE: "What does <em>event</em> mean in the definition?" → <strong>the release of a currently held resource</strong> (FE23#35, FE27#30, FE28#11). "All deadlocks involve conflicting needs for resources by" → <strong>two or more processes</strong> (FE22#1). "If a system is deadlocked, no processes can" → run, release resources, be awakened — <strong>all of them</strong> (FE25#6).</p>`,
        `<p class="y-chinh">🎯 Định nghĩa: <em>một tập tiến trình bị bế tắc nếu mỗi tiến trình trong tập đều đang chờ một sự kiện mà chỉ một tiến trình khác trong tập mới gây ra được.</em> Với bế tắc tài nguyên (resource deadlock), sự kiện đó là việc <strong>trả</strong> một tài nguyên mà thành viên khác đang giữ.</p>
<p>Đọc định nghĩa từng chữ. "<strong>Một tập</strong>": bế tắc liên quan tới một nhóm — mức tối thiểu sách hay dùng là hai tiến trình. "<strong>Mỗi</strong> tiến trình đều chờ": mọi thành viên đều bị chặn; nếu còn một ai chạy được, nó có thể trả một thứ gì đó và gỡ nút thắt. "<strong>Chỉ tiến trình khác trong tập</strong>": người ngoài không giúp được — sự chờ khép kín vào chính nó. Vì tất cả đều đang chờ, không ai chạy được, không ai trả được tài nguyên nào, và không ai được đánh thức. Số tiến trình và loại tài nguyên (phần cứng hay phần mềm) không quan trọng. Sách còn giả định không có ngắt nào đánh thức tiến trình: một tiến trình được báo thức gọi dậy thì không bế tắc.</p>
<p>➕ Bế tắc nhỏ nhất thậm chí không cần hai luồng: một luồng khoá hai lần cùng một mutex không đệ quy là đang chờ chính nó trả khoá. POSIX để kiểu (type) của mutex quyết định chuyện gì xảy ra; đây là ba kiểu chạy thật (mỗi lần khoá thứ hai bỏ cuộc sau 0,3 giây):</p>
<pre><code class="language-c">// Một luồng, một mutex, khoá hai lần: bế tắc nhỏ nhất — và mỗi kiểu mutex xử lý ra sao
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;time.h&gt;
#include &lt;pthread.h&gt;

void try_type(const char *name, int type) {
    pthread_mutexattr_t at;
    pthread_mutex_t m;
    pthread_mutexattr_init(&amp;at);
    pthread_mutexattr_settype(&amp;at, type);
    pthread_mutex_init(&amp;m, &amp;at);
    pthread_mutex_lock(&amp;m);                                     // lần khoá đầu: ổn
    struct timespec until;
    clock_gettime(CLOCK_REALTIME, &amp;until);
    until.tv_nsec += 300 * 1000 * 1000;                         // bỏ cuộc sau 0,3 giây thay vì treo
    if (until.tv_nsec &gt;= 1000000000) { until.tv_sec++; until.tv_nsec -= 1000000000; }
    int r = pthread_mutex_timedlock(&amp;m, &amp;until);                // lần khoá thứ hai, CÙNG một luồng
    printf("%-26s second lock -&gt; %s\\n", name, r == 0 ? "0 (locked again, count = 2)" : r == EDEADLK ? "EDEADLK (refused: you already own it)" : r == ETIMEDOUT ? "ETIMEDOUT (it waited for itself)" : strerror(r));
}

int main(void) {
    try_type("PTHREAD_MUTEX_NORMAL", PTHREAD_MUTEX_NORMAL);
    try_type("PTHREAD_MUTEX_ERRORCHECK", PTHREAD_MUTEX_ERRORCHECK);
    try_type("PTHREAD_MUTEX_RECURSIVE", PTHREAD_MUTEX_RECURSIVE);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread tu-khoa.c -o tu-khoa &amp;&amp; ./tu-khoa<br>
PTHREAD_MUTEX_NORMAL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;second lock -&gt; ETIMEDOUT (it waited for itself)<br>
PTHREAD_MUTEX_ERRORCHECK &nbsp;&nbsp;second lock -&gt; EDEADLK (refused: you already own it)<br>
PTHREAD_MUTEX_RECURSIVE &nbsp;&nbsp;&nbsp;second lock -&gt; 0 (locked again, count = 2)</div>
<p><code>NORMAL</code> (kiểu mặc định) cứ thế chờ — mãi mãi nếu không có hạn chờ; <code>ERRORCHECK</code> nhận ra người gọi đã sở hữu nó và từ chối bằng <code>EDEADLK</code> — bế tắc duy nhất mà pthreads tự phát hiện giúp bạn; <code>RECURSIVE</code> đếm số lần khoá, đó là lý do <code>synchronized</code> và <code>ReentrantLock</code> của Java cho cùng một luồng vào lại được. "Một tập" chỉ có một phần tử là ca biên của định nghĩa, nhưng lại là bế tắc đầu tiên mà phần lớn lập trình viên gặp (một hàm đang giữ khoá gọi sang hàm khác cũng lấy đúng khoá đó).</p>
<p class="pitfall">⚠️ FE: "Chữ <em>event</em> trong định nghĩa nghĩa là gì?" → <strong>việc trả một tài nguyên đang bị giữ</strong> (FE23#35, FE27#30, FE28#11). "All deadlocks involve conflicting needs for resources by" → <strong>hai tiến trình trở lên</strong> (FE22#1). "Nếu hệ thống bế tắc thì không tiến trình nào có thể" → chạy, trả tài nguyên, được đánh thức — <strong>tất cả các ý đó</strong> (FE25#6).</p>`],
      [6, 'Conditions for Resource Deadlocks',
        `<p class="y-chinh">🎯 Coffman et al. (1971): four conditions must <strong>all</strong> hold for a resource deadlock — <strong>1. mutual exclusion</strong>: each resource is either assigned to exactly one process or available; <strong>2. hold and wait</strong>: processes holding resources granted earlier can request new ones; <strong>3. no preemption</strong>: resources previously granted cannot be forcibly taken away — they must be released by their holder; <strong>4. circular wait</strong>: there is a circular chain of two or more processes, each waiting for a resource held by the next one.</p>
<p>Check them on the bridge of slide 1: one car per lane-section (mutual exclusion); each car keeps its half of the bridge while wanting the other half (hold and wait); nobody can lift a car off the bridge (no preemption); car 1 waits for car 2, which waits for car 1 (circular wait). Now check them on <code>khoa-chet.c</code> of slide 4: a mutex has one owner; A holds resource_1 while blocked on resource_2; nobody can unlock a pthread mutex for its owner; A → resource_2 → B → resource_1 → A is a cycle. All four hold — and the program froze.</p>
<p>The first three are <em>properties of the system</em> (how resources and locks behave); the fourth is a <em>situation</em> that arises at run time. The first three are necessary but not enough — many programs satisfy them every day and never deadlock; the cycle is what actually closes the trap. That is also why the fourth condition is the favourite target of prevention (slide 27). If any one condition is absent, a resource deadlock is impossible.</p>
<p>➕ A PostgreSQL row lock satisfies the first three by design: one transaction holds the row (mutual exclusion), it keeps the lock until COMMIT while executing more statements (hold and wait — this is <em>two-phase locking</em>, slide 29), and no one can take it away except by aborting the transaction (no preemption). So two transactions updating the same two rows in opposite orders only need the fourth condition to deadlock — exactly the example in the PostgreSQL manual, §13.3.4.</p>
<p class="pitfall">⚠️ FE matches description to name: "holding resources … can request new resources" → hold-and-wait (FE1#15, FE4#42); "cannot be forcibly taken away" → no-preemption (FE1#18, FE4#44, FE5#47); "each resource either assigned to exactly one process or available" → mutual exclusion (FE4#45, FE6#46, FE14#48); "waiting for another to voluntarily release so that at least one can continue" → circular wait (FE20#15). "Which is NOT a necessary condition?" → <strong>preemption</strong> (FE19#23, FE24#3, FE29#37) — the condition is <em>no</em> preemption. McHoes-style wording also appears: "allows a resource to be held as long as it is needed" / "two processes do not release control of resources" → no preemption (FE17#11, FE18#35, FE20#8); "only one process may access a dedicated resource" → mutual exclusion (FE18#38, FE25#9). FE3#38 asks for the condition that is "necessary and sufficient" and keys circular wait — strictly that is true only with a single instance of each resource (slide 13 vs 16).</p>`,
        `<p class="y-chinh">🎯 Coffman và cộng sự (1971): bốn điều kiện phải <strong>cùng</strong> đúng thì mới có bế tắc tài nguyên — <strong>1. loại trừ lẫn nhau (mutual exclusion)</strong>: mỗi tài nguyên hoặc đang được cấp cho đúng một tiến trình, hoặc đang rảnh; <strong>2. giữ và chờ (hold and wait)</strong>: tiến trình đang giữ tài nguyên đã được cấp vẫn được xin thêm tài nguyên mới; <strong>3. không trưng dụng (no preemption)</strong>: tài nguyên đã cấp không thể bị cưỡng ép lấy lại — chủ của nó phải tự trả; <strong>4. chờ vòng tròn (circular wait)</strong>: có một chuỗi vòng tròn từ hai tiến trình trở lên, mỗi tiến trình chờ một tài nguyên do tiến trình kế tiếp giữ.</p>
<p>Kiểm chúng trên cây cầu của slide 1: mỗi đoạn cầu chỉ một xe (loại trừ lẫn nhau); mỗi xe giữ nửa cầu của mình trong khi muốn nửa kia (giữ và chờ); không ai nhấc được xe khỏi cầu (không trưng dụng); xe 1 chờ xe 2, xe 2 chờ xe 1 (chờ vòng tròn). Giờ kiểm trên <code>khoa-chet.c</code> của slide 4: một mutex có một chủ; A giữ resource_1 trong khi bị chặn ở resource_2; không ai mở khoá hộ chủ của một mutex pthread; A → resource_2 → B → resource_1 → A là một vòng. Cả bốn điều kiện đều đúng — và chương trình đứng hình.</p>
<p>Ba điều kiện đầu là <em>tính chất của hệ thống</em> (tài nguyên và khoá hoạt động thế nào); điều kiện thứ tư là một <em>tình huống</em> nảy sinh lúc chạy. Ba điều kiện đầu là cần nhưng chưa đủ — rất nhiều chương trình thoả chúng hằng ngày mà chẳng bao giờ bế tắc; chính cái vòng mới sập bẫy. Vì vậy điều kiện thứ tư là mục tiêu ưa thích của việc ngăn ngừa (slide 27). Chỉ cần vắng một điều kiện bất kỳ là bế tắc tài nguyên không thể xảy ra.</p>
<p>➕ Khoá dòng của PostgreSQL thoả ba điều kiện đầu theo thiết kế: một giao dịch giữ dòng (loại trừ lẫn nhau), nó giữ khoá tới COMMIT trong khi chạy thêm các câu lệnh khác (giữ và chờ — đây là <em>khoá hai pha</em>, slide 29), và không ai lấy được khoá đó trừ khi huỷ giao dịch (không trưng dụng). Nên hai giao dịch cập nhật cùng hai dòng theo thứ tự ngược nhau chỉ cần thêm điều kiện thứ tư là bế tắc — đúng ví dụ trong tài liệu PostgreSQL, mục 13.3.4.</p>
<p class="pitfall">⚠️ FE cho mô tả, hỏi tên: "đang giữ tài nguyên … vẫn xin được tài nguyên mới" → giữ và chờ (FE1#15, FE4#42); "không thể bị cưỡng ép lấy lại" → không trưng dụng (FE1#18, FE4#44, FE5#47); "mỗi tài nguyên hoặc cấp cho đúng một tiến trình hoặc rảnh" → loại trừ lẫn nhau (FE4#45, FE6#46, FE14#48); "chờ người kia tự nguyện trả để ít nhất một bên đi tiếp được" → chờ vòng tròn (FE20#15). "Cái nào KHÔNG phải điều kiện cần?" → <strong>preemption</strong> (FE19#23, FE24#3, FE29#37) — điều kiện là <em>không</em> trưng dụng. Còn có cách diễn đạt kiểu McHoes: "cho phép giữ tài nguyên bao lâu tuỳ cần" / "hai tiến trình không nhả quyền điều khiển tài nguyên" → không trưng dụng (FE17#11, FE18#35, FE20#8); "chỉ một tiến trình được truy cập một tài nguyên dành riêng" → loại trừ lẫn nhau (FE18#38, FE25#9). FE3#38 hỏi điều kiện "cần và đủ" và đánh dấu chờ vòng tròn — nói chặt thì điều đó chỉ đúng khi mỗi loại tài nguyên có một thể hiện (so slide 13 với 16).</p>`],
      [7, 'Deadlock Modeling (1)',
        `<p class="y-chinh">🎯 Figure 6-3: Holt's (1972) <strong>resource-allocation graph</strong>. Processes are circles, resources are squares. (a) An arc from a resource to a process means the resource is <strong>held</strong> by that process (R → A: A holds R). (b) An arc from a process to a resource means the process is <strong>currently blocked waiting</strong> for it (B → S). (c) A <strong>cycle</strong> — D waits for U held by C, C waits for T held by D — means deadlock.</p>
<p>The graph turns the four conditions into a picture: a square has at most one arc out (mutual exclusion, one instance), a circle can have arcs in and out at once (hold and wait), arcs only disappear when the holder releases (no preemption), and condition 4 is literally a cycle. With one instance of each resource the rule is exact: <strong>cycle ⇔ deadlock</strong>, and every process on the cycle is deadlocked. The simulator drew the three graphs and found the cycle with the detection algorithm of slide 14:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/23c2ebef6e7ec7307cc3595c44ad5ef4c17433f2.svg" alt="Figure 6-3 recomputed: the cycle of (c) found by depth-first search" loading="lazy" /><p class="chu-thich">🧮 Figure 6-3 recomputed: the cycle of (c) found by depth-first search</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const KICH_BAN = {
  'hinh-6-4-tac': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['B', 'xin', 'S'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['B', 'xin', 'T'], ['C', 'xin', 'R']] },
  'hinh-6-4-tranh': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['C', 'xin', 'R'], ['A', 'tra', 'R'], ['A', 'tra', 'S']] },
  'fe28-14': { tp: ['P1', 'P2', 'P3'], tn: ['R1', 'R2', 'R3'], sk: [['P1', 'xin', 'R1'], ['P2', 'xin', 'R2'], ['P3', 'xin', 'R3'], ['P1', 'xin', 'R2'], ['P2', 'xin', 'R3'], ['P3', 'xin', 'R1']] },
};

/** Chạy chuỗi sự kiện xin/trả trên tài nguyên một thể hiện; trả từng trạng thái + chu trình (nếu có) sau mỗi sự kiện. */
function chay({ tp, tn, sk }) {
  const giu = new Map(), cho = new Map(), hang = new Map(tn.map((r) =&gt; [r, []]));
  const buoc = [];
  for (const [p, op, r] of sk) {
    if (cho.has(p)) throw new Error(&#96;&#36;{p} đang bị chặn mà vẫn phát sự kiện&#96;);
    let kq;
    if (op === 'xin') {
      if (!giu.has(r)) { giu.set(r, p); kq = 'cap'; } else { cho.set(p, r); hang.get(r).push(p); kq = 'chan'; }
    } else {
      if (giu.get(r) !== p) throw new Error(&#96;&#36;{p} trả &#36;{r} mà không giữ&#96;);
      giu.delete(r);
      const ke = hang.get(r).shift();
      if (ke) { giu.set(r, ke); cho.delete(ke); kq = &#96;trao:&#36;{ke}&#96;; } else kq = 'tu-do';
    }
    const cap = [...giu].map(([rr, pp]) =&gt; [rr, pp]), xin = [...cho].map(([pp, rr]) =&gt; [pp, rr]);
    const ct = timChuTrinh({ dinh: [...tp, ...tn], canh: [...cap, ...xin] });
    buoc.push({ p, op, r, kq, cap, xin, chuTrinh: ct.coChuTrinh ? ct.chuTrinh : [] });
  }
  return buoc;
}

// Hình 6-5: "X holds Y" ⇒ Y → X ; "X wants Y" ⇒ X → Y (slide 12)
const H65 = {
  giu: [['R', 'A'], ['U', 'D'], ['T', 'E'], ['W', 'F'], ['V', 'G']],
  muon: [['A', 'S'], ['B', 'T'], ['C', 'S'], ['D', 'S'], ['D', 'T'], ['E', 'V'], ['F', 'S'], ['G', 'U']],
  thuTuDinh: ['R', 'A', 'B', 'C', 'S', 'D', 'T', 'E', 'F', 'U', 'V', 'W', 'G'],
  viTri: { R: [0, 0], A: [1, 0], B: [3, 0], C: [0, 1], S: [1, 1], D: [2, 1], T: [3, 1], E: [4, 1], F: [1, 2], U: [2, 2], V: [4, 2], W: [1, 3], G: [2, 3] },
};</code></pre></details>
<p>➕ The JVM keeps exactly this graph for every <code>synchronized</code> monitor and <code>java.util.concurrent</code> lock, and anybody can ask it to look for cycles. Two threads transferring money in opposite directions, then <code>ThreadMXBean.findDeadlockedThreads()</code>:</p>
<pre><code class="language-java">// Java 21: two threads, two synchronized blocks in opposite order — and the JVM finding the cycle by itself
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;

public class KhoaChet {
    static final Object accountA = new Object();
    static final Object accountB = new Object();

    static void pause() { try { Thread.sleep(100); } catch (InterruptedException e) { } }

    public static void main(String[] args) throws Exception {
        Thread t1 = new Thread(() -&gt; {
            synchronized (accountA) { pause(); synchronized (accountB) { System.out.println("t1 done"); } }
        }, "transfer-A-to-B");
        Thread t2 = new Thread(() -&gt; {
            synchronized (accountB) { pause(); synchronized (accountA) { System.out.println("t2 done"); } }
        }, "transfer-B-to-A");
        t1.setDaemon(true); t2.setDaemon(true);         // daemon threads do not keep the JVM alive
        t1.start(); t2.start();
        Thread.sleep(1000);

        ThreadMXBean mx = ManagementFactory.getThreadMXBean();
        long[] ids = mx.findDeadlockedThreads();        // the JVM's own cycle detection
        System.out.println("deadlocked threads: " + (ids == null ? 0 : ids.length));
        for (ThreadInfo ti : mx.getThreadInfo(ids)) {
            System.out.println(ti.getThreadName() + " is " + ti.getThreadState()
                + ", waits for " + ti.getLockName() + " held by " + ti.getLockOwnerName());
        }
    }
}</code></pre>
<div class="out">$ javac KhoaChet.java &amp;&amp; java KhoaChet<br>
deadlocked threads: 2<br>
transfer-A-to-B is BLOCKED, waits for java.lang.Object@7ba4f24f held by transfer-B-to-A<br>
transfer-B-to-A is BLOCKED, waits for java.lang.Object@6acbcfc0 held by transfer-A-to-B</div>
<p>Each line is one arc pair of the graph: the thread is BLOCKED (arc thread → lock) on a lock whose owner is the other thread (arc lock → thread). Monitoring tools for Spring Boot (Actuator's thread dump, JConsole, VisualVM) use this same API.</p>
<p class="pitfall">⚠️ FE: resources drawn as <strong>squares</strong> (FE19#6, FE24#45), processes as <strong>circles</strong> (FE27#10, FE29#40); an arc from a process to a resource means the process is <strong>currently blocked waiting</strong> for it — the bank keys plain "waiting" in FE6#47, FE13#44, FE16#45 and "blocked waiting" in FE11#45: same idea, the book's words are "blocked waiting". "In a directed graph used to model deadlock, ___ represents deadlock" → a <strong>cycle</strong> (FE21#17); the graph "depicts the processes and resources and their relationships" (FE6#48).</p>`,
        `<p class="y-chinh">🎯 Hình 6-3: <strong>đồ thị cấp phát tài nguyên (resource-allocation graph)</strong> của Holt (1972). Tiến trình là hình tròn, tài nguyên là hình vuông. (a) Cạnh từ tài nguyên tới tiến trình nghĩa là tài nguyên <strong>đang được tiến trình đó giữ</strong> (R → A: A giữ R). (b) Cạnh từ tiến trình tới tài nguyên nghĩa là tiến trình <strong>đang bị chặn chờ</strong> tài nguyên đó (B → S). (c) Một <strong>chu trình</strong> — D chờ U mà C giữ, C chờ T mà D giữ — nghĩa là bế tắc.</p>
<p>Đồ thị biến bốn điều kiện thành một bức hình: một hình vuông có nhiều nhất một cạnh đi ra (loại trừ lẫn nhau, một thể hiện), một hình tròn có thể vừa có cạnh vào vừa có cạnh ra (giữ và chờ), cạnh chỉ biến mất khi chủ của nó trả (không trưng dụng), còn điều kiện 4 đúng nghĩa đen là một chu trình. Khi mỗi tài nguyên chỉ có một thể hiện, quy tắc là chính xác: <strong>có chu trình ⇔ có bế tắc</strong>, và mọi tiến trình trên chu trình đều bế tắc. Bộ mô phỏng vẽ ba đồ thị và tìm chu trình bằng thuật toán phát hiện của slide 14:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d5623354b05d0f05e313ee2a547f6162ee254203.svg" alt="Tính lại Hình 6-3: chu trình của (c) do thuật toán duyệt sâu tìm ra" loading="lazy" /><p class="chu-thich">🧮 Tính lại Hình 6-3: chu trình của (c) do thuật toán duyệt sâu tìm ra</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const KICH_BAN = {
  'hinh-6-4-tac': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['B', 'xin', 'S'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['B', 'xin', 'T'], ['C', 'xin', 'R']] },
  'hinh-6-4-tranh': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['C', 'xin', 'R'], ['A', 'tra', 'R'], ['A', 'tra', 'S']] },
  'fe28-14': { tp: ['P1', 'P2', 'P3'], tn: ['R1', 'R2', 'R3'], sk: [['P1', 'xin', 'R1'], ['P2', 'xin', 'R2'], ['P3', 'xin', 'R3'], ['P1', 'xin', 'R2'], ['P2', 'xin', 'R3'], ['P3', 'xin', 'R1']] },
};

/** Chạy chuỗi sự kiện xin/trả trên tài nguyên một thể hiện; trả từng trạng thái + chu trình (nếu có) sau mỗi sự kiện. */
function chay({ tp, tn, sk }) {
  const giu = new Map(), cho = new Map(), hang = new Map(tn.map((r) =&gt; [r, []]));
  const buoc = [];
  for (const [p, op, r] of sk) {
    if (cho.has(p)) throw new Error(&#96;&#36;{p} đang bị chặn mà vẫn phát sự kiện&#96;);
    let kq;
    if (op === 'xin') {
      if (!giu.has(r)) { giu.set(r, p); kq = 'cap'; } else { cho.set(p, r); hang.get(r).push(p); kq = 'chan'; }
    } else {
      if (giu.get(r) !== p) throw new Error(&#96;&#36;{p} trả &#36;{r} mà không giữ&#96;);
      giu.delete(r);
      const ke = hang.get(r).shift();
      if (ke) { giu.set(r, ke); cho.delete(ke); kq = &#96;trao:&#36;{ke}&#96;; } else kq = 'tu-do';
    }
    const cap = [...giu].map(([rr, pp]) =&gt; [rr, pp]), xin = [...cho].map(([pp, rr]) =&gt; [pp, rr]);
    const ct = timChuTrinh({ dinh: [...tp, ...tn], canh: [...cap, ...xin] });
    buoc.push({ p, op, r, kq, cap, xin, chuTrinh: ct.coChuTrinh ? ct.chuTrinh : [] });
  }
  return buoc;
}

// Hình 6-5: "X holds Y" ⇒ Y → X ; "X wants Y" ⇒ X → Y (slide 12)
const H65 = {
  giu: [['R', 'A'], ['U', 'D'], ['T', 'E'], ['W', 'F'], ['V', 'G']],
  muon: [['A', 'S'], ['B', 'T'], ['C', 'S'], ['D', 'S'], ['D', 'T'], ['E', 'V'], ['F', 'S'], ['G', 'U']],
  thuTuDinh: ['R', 'A', 'B', 'C', 'S', 'D', 'T', 'E', 'F', 'U', 'V', 'W', 'G'],
  viTri: { R: [0, 0], A: [1, 0], B: [3, 0], C: [0, 1], S: [1, 1], D: [2, 1], T: [3, 1], E: [4, 1], F: [1, 2], U: [2, 2], V: [4, 2], W: [1, 3], G: [2, 3] },
};</code></pre></details>
<p>➕ JVM giữ đúng đồ thị này cho mọi monitor <code>synchronized</code> và mọi khoá của <code>java.util.concurrent</code>, và ai cũng có thể nhờ nó tìm chu trình. Hai luồng chuyển tiền ngược chiều nhau, rồi gọi <code>ThreadMXBean.findDeadlockedThreads()</code>:</p>
<pre><code class="language-java">// Java 21: hai luồng, hai khối synchronized ngược thứ tự — và JVM tự tìm ra chu trình
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;

public class KhoaChet {
    static final Object accountA = new Object();
    static final Object accountB = new Object();

    static void pause() { try { Thread.sleep(100); } catch (InterruptedException e) { } }

    public static void main(String[] args) throws Exception {
        Thread t1 = new Thread(() -&gt; {
            synchronized (accountA) { pause(); synchronized (accountB) { System.out.println("t1 done"); } }
        }, "transfer-A-to-B");
        Thread t2 = new Thread(() -&gt; {
            synchronized (accountB) { pause(); synchronized (accountA) { System.out.println("t2 done"); } }
        }, "transfer-B-to-A");
        t1.setDaemon(true); t2.setDaemon(true);         // luồng daemon không giữ JVM sống
        t1.start(); t2.start();
        Thread.sleep(1000);

        ThreadMXBean mx = ManagementFactory.getThreadMXBean();
        long[] ids = mx.findDeadlockedThreads();        // JVM tự dò chu trình
        System.out.println("deadlocked threads: " + (ids == null ? 0 : ids.length));
        for (ThreadInfo ti : mx.getThreadInfo(ids)) {
            System.out.println(ti.getThreadName() + " is " + ti.getThreadState()
                + ", waits for " + ti.getLockName() + " held by " + ti.getLockOwnerName());
        }
    }
}</code></pre>
<div class="out">$ javac KhoaChet.java &amp;&amp; java KhoaChet<br>
deadlocked threads: 2<br>
transfer-A-to-B is BLOCKED, waits for java.lang.Object@7ba4f24f held by transfer-B-to-A<br>
transfer-B-to-A is BLOCKED, waits for java.lang.Object@6acbcfc0 held by transfer-A-to-B</div>
<p>Mỗi dòng là một cặp cạnh của đồ thị: luồng ở trạng thái BLOCKED (cạnh luồng → khoá) trên một khoá mà chủ là luồng kia (cạnh khoá → luồng). Các công cụ giám sát cho Spring Boot (thread dump của Actuator, JConsole, VisualVM) dùng chính API này.</p>
<p class="pitfall">⚠️ FE: tài nguyên vẽ bằng <strong>hình vuông</strong> (FE19#6, FE24#45), tiến trình bằng <strong>hình tròn</strong> (FE27#10, FE29#40); cạnh từ tiến trình tới tài nguyên nghĩa là tiến trình <strong>đang bị chặn chờ</strong> nó — ngân hàng đánh dấu "waiting" trơn ở FE6#47, FE13#44, FE16#45 và "blocked waiting" ở FE11#45: cùng một ý, chữ của sách là "blocked waiting". "Trong đồ thị có hướng mô hình bế tắc, ___ biểu diễn bế tắc" → một <strong>chu trình</strong> (FE21#17); đồ thị "mô tả các tiến trình, tài nguyên và quan hệ giữa chúng" (FE6#48).</p>`],
      [8, 'Deadlock Modeling (2)',
        `<p class="y-chinh">🎯 Figure 6-4 (a)–(g): three processes A, B, C and three resources R, S, T. A requests R then S, B requests S then T, C requests T then R. (d) If the OS runs them strictly one after another there is no problem; interleaved round-robin, the requests come as 1. A requests R, 2. B requests S, 3. C requests T, 4. A requests S, 5. B requests T, 6. C requests R — and the result is a deadlock. (e)–(g) show the graph after the first three requests: each process holds one resource.</p>
<p>Look at the code in parts (a)–(c): each process does request, request, release, release — it holds its first resource while asking for the second. Run them one at a time (A completely, then B, then C) and nothing bad can happen, but there is also no parallelism: while A waits for its disk, the CPU is idle. Real schedulers interleave, and with round-robin the six requests arrive in the order of (d). After step 3 every process holds exactly one resource, all three squares have an arc pointing to their owner, and nobody is blocked yet: the graph has no cycle, the system is fine — for now.</p>
<p>➕ The important lesson of this figure: <em>the OS does not choose the program code, but it does choose the order</em>. The same three programs can deadlock or not depending on the scheduler's decisions. That observation is the root of deadlock avoidance (slides 20–25): if the OS can see trouble coming, it can schedule around it.</p>
<p>The simulator replays the six events on a real data structure — a table "who holds what" and "who waits for what" — and runs the cycle detector after every event; the table under the graph shows the state step by step (the graph itself is drawn for the final state on the next slide):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a770d3943bf0e1bd6ed6e260461aad636299b2ea.svg" alt="Figure 6-4 (d)–(j) replayed: requests 1–3 granted, 4 and 5 block, request 6 closes the cycle" loading="lazy" /><p class="chu-thich">🧮 Figure 6-4 (d)–(j) replayed: requests 1–3 granted, 4 and 5 block, request 6 closes the cycle</p></div>
<table>
<thead><tr><th>#</th><th>Event</th><th>Result</th><th>Graph</th></tr></thead>
<tbody>
<tr><td>1</td><td>A requests R</td><td>granted</td><td>no cycle</td></tr>
<tr><td>2</td><td>B requests S</td><td>granted</td><td>no cycle</td></tr>
<tr><td>3</td><td>C requests T</td><td>granted</td><td>no cycle</td></tr>
<tr><td>4</td><td>A requests S</td><td>blocks (S is held)</td><td>no cycle</td></tr>
<tr><td>5</td><td>B requests T</td><td>blocks (T is held)</td><td>no cycle</td></tr>
<tr><td>6</td><td>C requests R</td><td>blocks (R is held)</td><td><strong>cycle A → S → B → T → C → R → A: DEADLOCK</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const KICH_BAN = {
  'hinh-6-4-tac': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['B', 'xin', 'S'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['B', 'xin', 'T'], ['C', 'xin', 'R']] },
  'hinh-6-4-tranh': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['C', 'xin', 'R'], ['A', 'tra', 'R'], ['A', 'tra', 'S']] },
  'fe28-14': { tp: ['P1', 'P2', 'P3'], tn: ['R1', 'R2', 'R3'], sk: [['P1', 'xin', 'R1'], ['P2', 'xin', 'R2'], ['P3', 'xin', 'R3'], ['P1', 'xin', 'R2'], ['P2', 'xin', 'R3'], ['P3', 'xin', 'R1']] },
};

/** Chạy chuỗi sự kiện xin/trả trên tài nguyên một thể hiện; trả từng trạng thái + chu trình (nếu có) sau mỗi sự kiện. */
function chay({ tp, tn, sk }) {
  const giu = new Map(), cho = new Map(), hang = new Map(tn.map((r) =&gt; [r, []]));
  const buoc = [];
  for (const [p, op, r] of sk) {
    if (cho.has(p)) throw new Error(&#96;&#36;{p} đang bị chặn mà vẫn phát sự kiện&#96;);
    let kq;
    if (op === 'xin') {
      if (!giu.has(r)) { giu.set(r, p); kq = 'cap'; } else { cho.set(p, r); hang.get(r).push(p); kq = 'chan'; }
    } else {
      if (giu.get(r) !== p) throw new Error(&#96;&#36;{p} trả &#36;{r} mà không giữ&#96;);
      giu.delete(r);
      const ke = hang.get(r).shift();
      if (ke) { giu.set(r, ke); cho.delete(ke); kq = &#96;trao:&#36;{ke}&#96;; } else kq = 'tu-do';
    }
    const cap = [...giu].map(([rr, pp]) =&gt; [rr, pp]), xin = [...cho].map(([pp, rr]) =&gt; [pp, rr]);
    const ct = timChuTrinh({ dinh: [...tp, ...tn], canh: [...cap, ...xin] });
    buoc.push({ p, op, r, kq, cap, xin, chuTrinh: ct.coChuTrinh ? ct.chuTrinh : [] });
  }
  return buoc;
}

// Hình 6-5: "X holds Y" ⇒ Y → X ; "X wants Y" ⇒ X → Y (slide 12)
const H65 = {
  giu: [['R', 'A'], ['U', 'D'], ['T', 'E'], ['W', 'F'], ['V', 'G']],
  muon: [['A', 'S'], ['B', 'T'], ['C', 'S'], ['D', 'S'], ['D', 'T'], ['E', 'V'], ['F', 'S'], ['G', 'U']],
  thuTuDinh: ['R', 'A', 'B', 'C', 'S', 'D', 'T', 'E', 'F', 'U', 'V', 'W', 'G'],
  viTri: { R: [0, 0], A: [1, 0], B: [3, 0], C: [0, 1], S: [1, 1], D: [2, 1], T: [3, 1], E: [4, 1], F: [1, 2], U: [2, 2], V: [4, 2], W: [1, 3], G: [2, 3] },
};</code></pre></details>
<p class="meo">🧠 Every arc in the graph is a fact you can check in a running system: for threads, a thread dump; for processes, <code>ps</code> with the wait channel (slide 30); for databases, the <code>pg_locks</code> view of PostgreSQL. Drawing the graph is how you debug a hang.</p>`,
        `<p class="y-chinh">🎯 Hình 6-4 (a)–(g): ba tiến trình A, B, C và ba tài nguyên R, S, T. A xin R rồi S, B xin S rồi T, C xin T rồi R. (d) Nếu HĐH chạy chúng tuần tự từng cái một thì không sao; chạy xen kẽ kiểu round-robin, các yêu cầu tới theo thứ tự 1. A xin R, 2. B xin S, 3. C xin T, 4. A xin S, 5. B xin T, 6. C xin R — và kết quả là bế tắc. (e)–(g) là đồ thị sau ba yêu cầu đầu: mỗi tiến trình giữ một tài nguyên.</p>
<p>Nhìn mã ở phần (a)–(c): tiến trình nào cũng làm xin, xin, trả, trả — nó giữ tài nguyên thứ nhất trong khi xin tài nguyên thứ hai. Chạy chúng từng cái một (xong hẳn A, rồi B, rồi C) thì chẳng có gì xấu xảy ra được, nhưng cũng chẳng có chút song song nào: trong lúc A chờ đĩa, CPU ngồi không. Bộ lập lịch thật chạy xen kẽ, và với round-robin sáu yêu cầu tới theo thứ tự của (d). Sau bước 3 mỗi tiến trình giữ đúng một tài nguyên, cả ba hình vuông đều có cạnh chỉ về chủ của nó, và chưa ai bị chặn: đồ thị chưa có chu trình, hệ thống vẫn ổn — tạm thời.</p>
<p>➕ Bài học quan trọng của hình này: <em>HĐH không chọn mã chương trình, nhưng nó chọn thứ tự chạy</em>. Cùng ba chương trình đó có thể bế tắc hoặc không tuỳ quyết định của bộ lập lịch. Nhận xét này là gốc rễ của việc tránh bế tắc (slide 20–25): nếu HĐH thấy trước rắc rối thì nó có thể lập lịch né đi.</p>
<p>Bộ mô phỏng diễn lại sáu sự kiện trên một cấu trúc dữ liệu thật — một bảng "ai giữ gì" và "ai chờ gì" — và chạy bộ dò chu trình sau mỗi sự kiện; bảng dưới đồ thị ghi trạng thái từng bước (chính đồ thị được vẽ cho trạng thái cuối, ở slide sau):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b3bc96b7e0dda9c5f59998788a26afdf430b13cb.svg" alt="Diễn lại Hình 6-4 (d)–(j): yêu cầu 1–3 được cấp, 4 và 5 bị chặn, yêu cầu 6 đóng chu trình" loading="lazy" /><p class="chu-thich">🧮 Diễn lại Hình 6-4 (d)–(j): yêu cầu 1–3 được cấp, 4 và 5 bị chặn, yêu cầu 6 đóng chu trình</p></div>
<table>
<thead><tr><th>#</th><th>Sự kiện</th><th>Kết quả</th><th>Đồ thị</th></tr></thead>
<tbody>
<tr><td>1</td><td>A xin R</td><td>được cấp</td><td>không chu trình</td></tr>
<tr><td>2</td><td>B xin S</td><td>được cấp</td><td>không chu trình</td></tr>
<tr><td>3</td><td>C xin T</td><td>được cấp</td><td>không chu trình</td></tr>
<tr><td>4</td><td>A xin S</td><td>bị chặn (S đang bị giữ)</td><td>không chu trình</td></tr>
<tr><td>5</td><td>B xin T</td><td>bị chặn (T đang bị giữ)</td><td>không chu trình</td></tr>
<tr><td>6</td><td>C xin R</td><td>bị chặn (R đang bị giữ)</td><td><strong>chu trình A → S → B → T → C → R → A: BẾ TẮC</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const KICH_BAN = {
  'hinh-6-4-tac': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['B', 'xin', 'S'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['B', 'xin', 'T'], ['C', 'xin', 'R']] },
  'hinh-6-4-tranh': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['C', 'xin', 'R'], ['A', 'tra', 'R'], ['A', 'tra', 'S']] },
  'fe28-14': { tp: ['P1', 'P2', 'P3'], tn: ['R1', 'R2', 'R3'], sk: [['P1', 'xin', 'R1'], ['P2', 'xin', 'R2'], ['P3', 'xin', 'R3'], ['P1', 'xin', 'R2'], ['P2', 'xin', 'R3'], ['P3', 'xin', 'R1']] },
};

/** Chạy chuỗi sự kiện xin/trả trên tài nguyên một thể hiện; trả từng trạng thái + chu trình (nếu có) sau mỗi sự kiện. */
function chay({ tp, tn, sk }) {
  const giu = new Map(), cho = new Map(), hang = new Map(tn.map((r) =&gt; [r, []]));
  const buoc = [];
  for (const [p, op, r] of sk) {
    if (cho.has(p)) throw new Error(&#96;&#36;{p} đang bị chặn mà vẫn phát sự kiện&#96;);
    let kq;
    if (op === 'xin') {
      if (!giu.has(r)) { giu.set(r, p); kq = 'cap'; } else { cho.set(p, r); hang.get(r).push(p); kq = 'chan'; }
    } else {
      if (giu.get(r) !== p) throw new Error(&#96;&#36;{p} trả &#36;{r} mà không giữ&#96;);
      giu.delete(r);
      const ke = hang.get(r).shift();
      if (ke) { giu.set(r, ke); cho.delete(ke); kq = &#96;trao:&#36;{ke}&#96;; } else kq = 'tu-do';
    }
    const cap = [...giu].map(([rr, pp]) =&gt; [rr, pp]), xin = [...cho].map(([pp, rr]) =&gt; [pp, rr]);
    const ct = timChuTrinh({ dinh: [...tp, ...tn], canh: [...cap, ...xin] });
    buoc.push({ p, op, r, kq, cap, xin, chuTrinh: ct.coChuTrinh ? ct.chuTrinh : [] });
  }
  return buoc;
}

// Hình 6-5: "X holds Y" ⇒ Y → X ; "X wants Y" ⇒ X → Y (slide 12)
const H65 = {
  giu: [['R', 'A'], ['U', 'D'], ['T', 'E'], ['W', 'F'], ['V', 'G']],
  muon: [['A', 'S'], ['B', 'T'], ['C', 'S'], ['D', 'S'], ['D', 'T'], ['E', 'V'], ['F', 'S'], ['G', 'U']],
  thuTuDinh: ['R', 'A', 'B', 'C', 'S', 'D', 'T', 'E', 'F', 'U', 'V', 'W', 'G'],
  viTri: { R: [0, 0], A: [1, 0], B: [3, 0], C: [0, 1], S: [1, 1], D: [2, 1], T: [3, 1], E: [4, 1], F: [1, 2], U: [2, 2], V: [4, 2], W: [1, 3], G: [2, 3] },
};</code></pre></details>
<p class="meo">🧠 Mỗi cạnh trong đồ thị là một sự thật kiểm được trên hệ thống đang chạy: với luồng là thread dump; với tiến trình là <code>ps</code> kèm kênh chờ (wait channel, slide 30); với cơ sở dữ liệu là view <code>pg_locks</code> của PostgreSQL. Vẽ đồ thị chính là cách gỡ lỗi một chương trình treo.</p>`],
      [9, 'Deadlock Modeling (3)',
        `<p class="y-chinh">🎯 Figure 6-4 (h)–(j): request 4 (A asks for S, held by B) blocks A; request 5 (B asks for T, held by C) blocks B; request 6 (C asks for R, held by A) blocks C and <strong>closes the cycle A → S → B → T → C → R → A</strong> — deadlock. (k)–(n) begin the other story: the OS, knowing the requests, decides to suspend B and run only A and C.</p>
<p>Follow the arcs of (j) with your finger: from A along its request arc to S, S's holder is B, B requests T, T's holder is C, C requests R, R's holder is A — you are back where you started. Each process is blocked, each holds what the next one needs. All four conditions hold and nobody outside the cycle can help: by the definition of slide 5, A, B and C are deadlocked. The graph of the simulator is the state after event 6; the red arcs are the cycle that the depth-first search found:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5df3ed58e9b288e522bf2b0ebe6d904b6d124936.svg" alt="The same pattern with other names — FE28#14: event 6 closes the cycle" loading="lazy" /><p class="chu-thich">🧮 The same pattern with other names — FE28#14: event 6 closes the cycle</p></div>
<table>
<thead><tr><th>#</th><th>Event</th><th>Result</th><th>Graph</th></tr></thead>
<tbody>
<tr><td>1</td><td>P1 requests R1</td><td>granted</td><td>no cycle</td></tr>
<tr><td>2</td><td>P2 requests R2</td><td>granted</td><td>no cycle</td></tr>
<tr><td>3</td><td>P3 requests R3</td><td>granted</td><td>no cycle</td></tr>
<tr><td>4</td><td>P1 requests R2</td><td>blocks (R2 is held)</td><td>no cycle</td></tr>
<tr><td>5</td><td>P2 requests R3</td><td>blocks (R3 is held)</td><td>no cycle</td></tr>
<tr><td>6</td><td>P3 requests R1</td><td>blocks (R1 is held)</td><td><strong>cycle P1 → R2 → P2 → R3 → P3 → R1 → P1: DEADLOCK</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const KICH_BAN = {
  'hinh-6-4-tac': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['B', 'xin', 'S'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['B', 'xin', 'T'], ['C', 'xin', 'R']] },
  'hinh-6-4-tranh': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['C', 'xin', 'R'], ['A', 'tra', 'R'], ['A', 'tra', 'S']] },
  'fe28-14': { tp: ['P1', 'P2', 'P3'], tn: ['R1', 'R2', 'R3'], sk: [['P1', 'xin', 'R1'], ['P2', 'xin', 'R2'], ['P3', 'xin', 'R3'], ['P1', 'xin', 'R2'], ['P2', 'xin', 'R3'], ['P3', 'xin', 'R1']] },
};

/** Chạy chuỗi sự kiện xin/trả trên tài nguyên một thể hiện; trả từng trạng thái + chu trình (nếu có) sau mỗi sự kiện. */
function chay({ tp, tn, sk }) {
  const giu = new Map(), cho = new Map(), hang = new Map(tn.map((r) =&gt; [r, []]));
  const buoc = [];
  for (const [p, op, r] of sk) {
    if (cho.has(p)) throw new Error(&#96;&#36;{p} đang bị chặn mà vẫn phát sự kiện&#96;);
    let kq;
    if (op === 'xin') {
      if (!giu.has(r)) { giu.set(r, p); kq = 'cap'; } else { cho.set(p, r); hang.get(r).push(p); kq = 'chan'; }
    } else {
      if (giu.get(r) !== p) throw new Error(&#96;&#36;{p} trả &#36;{r} mà không giữ&#96;);
      giu.delete(r);
      const ke = hang.get(r).shift();
      if (ke) { giu.set(r, ke); cho.delete(ke); kq = &#96;trao:&#36;{ke}&#96;; } else kq = 'tu-do';
    }
    const cap = [...giu].map(([rr, pp]) =&gt; [rr, pp]), xin = [...cho].map(([pp, rr]) =&gt; [pp, rr]);
    const ct = timChuTrinh({ dinh: [...tp, ...tn], canh: [...cap, ...xin] });
    buoc.push({ p, op, r, kq, cap, xin, chuTrinh: ct.coChuTrinh ? ct.chuTrinh : [] });
  }
  return buoc;
}

// Hình 6-5: "X holds Y" ⇒ Y → X ; "X wants Y" ⇒ X → Y (slide 12)
const H65 = {
  giu: [['R', 'A'], ['U', 'D'], ['T', 'E'], ['W', 'F'], ['V', 'G']],
  muon: [['A', 'S'], ['B', 'T'], ['C', 'S'], ['D', 'S'], ['D', 'T'], ['E', 'V'], ['F', 'S'], ['G', 'U']],
  thuTuDinh: ['R', 'A', 'B', 'C', 'S', 'D', 'T', 'E', 'F', 'U', 'V', 'W', 'G'],
  viTri: { R: [0, 0], A: [1, 0], B: [3, 0], C: [0, 1], S: [1, 1], D: [2, 1], T: [3, 1], E: [4, 1], F: [1, 2], U: [2, 2], V: [4, 2], W: [1, 3], G: [2, 3] },
};</code></pre></details>
<p>➕ (k)–(n): the second half of the figure starts with a different sequence. If the OS knows in advance what each process will ask for — a big "if" — it can see that granting S to B would lead to trouble, and simply not run B for a while. With only A and C running, the order becomes 1. A requests R, 2. C requests T, 3. A requests S, 4. C requests R (blocks — A holds R), 5. A releases R, 6. A releases S. That is not prevention and not detection: it is <strong>avoidance</strong> — the OS keeps the system out of dangerous states by careful scheduling.</p>
<p class="pitfall">⚠️ FE28#14 gives exactly this kind of sequence (P1 gets R1, P2 gets R2, P3 gets R3, P1 requests R2, P2 requests R3, P3 requests R1) and asks which event causes the deadlock: <strong>event 6</strong> — events 4 and 5 only block a process; the deadlock exists from the moment the cycle closes. Method: after each event, draw the new arc and look for a cycle.</p>`,
        `<p class="y-chinh">🎯 Hình 6-4 (h)–(j): yêu cầu 4 (A xin S, B đang giữ) chặn A; yêu cầu 5 (B xin T, C đang giữ) chặn B; yêu cầu 6 (C xin R, A đang giữ) chặn C và <strong>đóng chu trình A → S → B → T → C → R → A</strong> — bế tắc. (k)–(n) mở đầu câu chuyện còn lại: HĐH, biết trước các yêu cầu, quyết định tạm hoãn B và chỉ chạy A với C.</p>
<p>Lấy ngón tay dò theo các cạnh của (j): từ A theo cạnh xin tới S, chủ của S là B, B xin T, chủ của T là C, C xin R, chủ của R là A — bạn quay về đúng chỗ xuất phát. Tiến trình nào cũng bị chặn, tiến trình nào cũng giữ thứ mà kẻ kế tiếp cần. Cả bốn điều kiện đều đúng và không ai ngoài vòng giúp được: theo định nghĩa ở slide 5, A, B và C bế tắc. Đồ thị của bộ mô phỏng là trạng thái sau sự kiện 6; các cạnh đỏ là chu trình mà phép duyệt sâu tìm được:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a441ce7ec200c2d9126c2b772c9b2ceea3960ff8.svg" alt="Cùng một mẫu với tên khác — FE28#14: sự kiện 6 đóng chu trình" loading="lazy" /><p class="chu-thich">🧮 Cùng một mẫu với tên khác — FE28#14: sự kiện 6 đóng chu trình</p></div>
<table>
<thead><tr><th>#</th><th>Sự kiện</th><th>Kết quả</th><th>Đồ thị</th></tr></thead>
<tbody>
<tr><td>1</td><td>P1 xin R1</td><td>được cấp</td><td>không chu trình</td></tr>
<tr><td>2</td><td>P2 xin R2</td><td>được cấp</td><td>không chu trình</td></tr>
<tr><td>3</td><td>P3 xin R3</td><td>được cấp</td><td>không chu trình</td></tr>
<tr><td>4</td><td>P1 xin R2</td><td>bị chặn (R2 đang bị giữ)</td><td>không chu trình</td></tr>
<tr><td>5</td><td>P2 xin R3</td><td>bị chặn (R3 đang bị giữ)</td><td>không chu trình</td></tr>
<tr><td>6</td><td>P3 xin R1</td><td>bị chặn (R1 đang bị giữ)</td><td><strong>chu trình P1 → R2 → P2 → R3 → P3 → R1 → P1: BẾ TẮC</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const KICH_BAN = {
  'hinh-6-4-tac': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['B', 'xin', 'S'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['B', 'xin', 'T'], ['C', 'xin', 'R']] },
  'hinh-6-4-tranh': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['C', 'xin', 'R'], ['A', 'tra', 'R'], ['A', 'tra', 'S']] },
  'fe28-14': { tp: ['P1', 'P2', 'P3'], tn: ['R1', 'R2', 'R3'], sk: [['P1', 'xin', 'R1'], ['P2', 'xin', 'R2'], ['P3', 'xin', 'R3'], ['P1', 'xin', 'R2'], ['P2', 'xin', 'R3'], ['P3', 'xin', 'R1']] },
};

/** Chạy chuỗi sự kiện xin/trả trên tài nguyên một thể hiện; trả từng trạng thái + chu trình (nếu có) sau mỗi sự kiện. */
function chay({ tp, tn, sk }) {
  const giu = new Map(), cho = new Map(), hang = new Map(tn.map((r) =&gt; [r, []]));
  const buoc = [];
  for (const [p, op, r] of sk) {
    if (cho.has(p)) throw new Error(&#96;&#36;{p} đang bị chặn mà vẫn phát sự kiện&#96;);
    let kq;
    if (op === 'xin') {
      if (!giu.has(r)) { giu.set(r, p); kq = 'cap'; } else { cho.set(p, r); hang.get(r).push(p); kq = 'chan'; }
    } else {
      if (giu.get(r) !== p) throw new Error(&#96;&#36;{p} trả &#36;{r} mà không giữ&#96;);
      giu.delete(r);
      const ke = hang.get(r).shift();
      if (ke) { giu.set(r, ke); cho.delete(ke); kq = &#96;trao:&#36;{ke}&#96;; } else kq = 'tu-do';
    }
    const cap = [...giu].map(([rr, pp]) =&gt; [rr, pp]), xin = [...cho].map(([pp, rr]) =&gt; [pp, rr]);
    const ct = timChuTrinh({ dinh: [...tp, ...tn], canh: [...cap, ...xin] });
    buoc.push({ p, op, r, kq, cap, xin, chuTrinh: ct.coChuTrinh ? ct.chuTrinh : [] });
  }
  return buoc;
}

// Hình 6-5: "X holds Y" ⇒ Y → X ; "X wants Y" ⇒ X → Y (slide 12)
const H65 = {
  giu: [['R', 'A'], ['U', 'D'], ['T', 'E'], ['W', 'F'], ['V', 'G']],
  muon: [['A', 'S'], ['B', 'T'], ['C', 'S'], ['D', 'S'], ['D', 'T'], ['E', 'V'], ['F', 'S'], ['G', 'U']],
  thuTuDinh: ['R', 'A', 'B', 'C', 'S', 'D', 'T', 'E', 'F', 'U', 'V', 'W', 'G'],
  viTri: { R: [0, 0], A: [1, 0], B: [3, 0], C: [0, 1], S: [1, 1], D: [2, 1], T: [3, 1], E: [4, 1], F: [1, 2], U: [2, 2], V: [4, 2], W: [1, 3], G: [2, 3] },
};</code></pre></details>
<p>➕ (k)–(n): nửa sau của hình bắt đầu bằng một thứ tự khác. Nếu HĐH biết trước mỗi tiến trình sẽ xin gì — một chữ "nếu" rất lớn — nó thấy được rằng cấp S cho B sẽ dẫn tới rắc rối, và đơn giản là tạm không chạy B. Chỉ còn A và C chạy, thứ tự thành 1. A xin R, 2. C xin T, 3. A xin S, 4. C xin R (bị chặn — A đang giữ R), 5. A trả R, 6. A trả S. Đó không phải ngăn ngừa, cũng không phải phát hiện: đó là <strong>tránh (avoidance)</strong> — HĐH giữ hệ thống tránh xa các trạng thái nguy hiểm bằng cách lập lịch cẩn thận.</p>
<p class="pitfall">⚠️ FE28#14 cho đúng kiểu dãy này (P1 được R1, P2 được R2, P3 được R3, P1 xin R2, P2 xin R3, P3 xin R1) và hỏi sự kiện nào gây bế tắc: <strong>sự kiện 6</strong> — sự kiện 4 và 5 chỉ chặn một tiến trình; bế tắc tồn tại kể từ lúc chu trình khép lại. Cách làm: sau mỗi sự kiện, vẽ cạnh mới rồi tìm chu trình.</p>`],
      [10, 'Deadlock Modeling (4)',
        `<p class="y-chinh">🎯 Figure 6-4 (l)–(q): the avoiding schedule step by step. A gets R, C gets T, A gets S; C's request for R blocks; A finishes and releases R and S; R goes to the waiting C. In (q) C holds R and T and can finish — no cycle ever forms, and B can be run afterwards.</p>
<p>The price of avoiding the deadlock is visible in the figure: B did nothing at all during these six steps, and C had to wait at step 4. The OS traded some parallelism for safety. In (o) there is a moment where C is blocked on R, but the graph has no cycle: A, the holder of R, is not waiting for anything held by C, so A can run to completion and release R. A blocked process is not a deadlocked process — what matters is whether its wait can end.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5d595f1c69d54160e588e6feee1b33ce4bd54d0b.svg" alt="Figure 6-4 (k)–(q) replayed: with B suspended, R is handed to C when A releases it — no cycle" loading="lazy" /><p class="chu-thich">🧮 Figure 6-4 (k)–(q) replayed: with B suspended, R is handed to C when A releases it — no cycle</p></div>
<table>
<thead><tr><th>#</th><th>Event</th><th>Result</th><th>Graph</th></tr></thead>
<tbody>
<tr><td>1</td><td>A requests R</td><td>granted</td><td>no cycle</td></tr>
<tr><td>2</td><td>C requests T</td><td>granted</td><td>no cycle</td></tr>
<tr><td>3</td><td>A requests S</td><td>granted</td><td>no cycle</td></tr>
<tr><td>4</td><td>C requests R</td><td>blocks (R is held)</td><td>no cycle</td></tr>
<tr><td>5</td><td>A releases R</td><td>R handed to C, which wakes up</td><td>no cycle</td></tr>
<tr><td>6</td><td>A releases S</td><td>S is free again</td><td>no cycle</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const KICH_BAN = {
  'hinh-6-4-tac': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['B', 'xin', 'S'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['B', 'xin', 'T'], ['C', 'xin', 'R']] },
  'hinh-6-4-tranh': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['C', 'xin', 'R'], ['A', 'tra', 'R'], ['A', 'tra', 'S']] },
  'fe28-14': { tp: ['P1', 'P2', 'P3'], tn: ['R1', 'R2', 'R3'], sk: [['P1', 'xin', 'R1'], ['P2', 'xin', 'R2'], ['P3', 'xin', 'R3'], ['P1', 'xin', 'R2'], ['P2', 'xin', 'R3'], ['P3', 'xin', 'R1']] },
};

/** Chạy chuỗi sự kiện xin/trả trên tài nguyên một thể hiện; trả từng trạng thái + chu trình (nếu có) sau mỗi sự kiện. */
function chay({ tp, tn, sk }) {
  const giu = new Map(), cho = new Map(), hang = new Map(tn.map((r) =&gt; [r, []]));
  const buoc = [];
  for (const [p, op, r] of sk) {
    if (cho.has(p)) throw new Error(&#96;&#36;{p} đang bị chặn mà vẫn phát sự kiện&#96;);
    let kq;
    if (op === 'xin') {
      if (!giu.has(r)) { giu.set(r, p); kq = 'cap'; } else { cho.set(p, r); hang.get(r).push(p); kq = 'chan'; }
    } else {
      if (giu.get(r) !== p) throw new Error(&#96;&#36;{p} trả &#36;{r} mà không giữ&#96;);
      giu.delete(r);
      const ke = hang.get(r).shift();
      if (ke) { giu.set(r, ke); cho.delete(ke); kq = &#96;trao:&#36;{ke}&#96;; } else kq = 'tu-do';
    }
    const cap = [...giu].map(([rr, pp]) =&gt; [rr, pp]), xin = [...cho].map(([pp, rr]) =&gt; [pp, rr]);
    const ct = timChuTrinh({ dinh: [...tp, ...tn], canh: [...cap, ...xin] });
    buoc.push({ p, op, r, kq, cap, xin, chuTrinh: ct.coChuTrinh ? ct.chuTrinh : [] });
  }
  return buoc;
}

// Hình 6-5: "X holds Y" ⇒ Y → X ; "X wants Y" ⇒ X → Y (slide 12)
const H65 = {
  giu: [['R', 'A'], ['U', 'D'], ['T', 'E'], ['W', 'F'], ['V', 'G']],
  muon: [['A', 'S'], ['B', 'T'], ['C', 'S'], ['D', 'S'], ['D', 'T'], ['E', 'V'], ['F', 'S'], ['G', 'U']],
  thuTuDinh: ['R', 'A', 'B', 'C', 'S', 'D', 'T', 'E', 'F', 'U', 'V', 'W', 'G'],
  viTri: { R: [0, 0], A: [1, 0], B: [3, 0], C: [0, 1], S: [1, 1], D: [2, 1], T: [3, 1], E: [4, 1], F: [1, 2], U: [2, 2], V: [4, 2], W: [1, 3], G: [2, 3] },
};</code></pre></details>
<p>➕ Two general facts follow. First, a graph with no cycle is always "reducible": find a process that is not blocked, let it finish, delete its arcs, repeat — this is exactly the matrix detection algorithm of slide 17 in graph form. Second, the sequence that avoided the deadlock here was found by looking ahead at what each process would request — the next slides formalise that "look ahead" into safe states and the banker's algorithm.</p>
<p class="meo">🧠 In (q) R is "handed over" from A to C at the moment A releases it — the waiting process wakes up already owning the resource. That is how <code>pthread_mutex_unlock</code>, Java's <code>ReentrantLock(true)</code> (fair mode) and PostgreSQL's lock queue behave too: a release wakes the next waiter.</p>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>Resource-allocation graphs like slides 7–11: one instance per resource, so a cycle means deadlock.</p>
<div class="os-lab os-lab-sim-deadlock os-lab-p-cycle os-lab-t-deadlock-detect"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> a resource-allocation graph with a cycle <a href="/os-lab?sim=deadlock&amp;preset=cycle&amp;lang=en&amp;tour=deadlock-detect" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Step the requests until the cycle closes and name the processes in it.</li><li>Change the order of one request and show that the cycle no longer forms.</li></ol></div>
</div>`,
        `<p class="y-chinh">🎯 Hình 6-4 (l)–(q): lịch trình tránh bế tắc từng bước. A được R, C được T, A được S; yêu cầu R của C bị chặn; A chạy xong và trả R lẫn S; R được trao cho C đang chờ. Ở (q) C giữ R và T và chạy xong được — không chu trình nào hình thành, và B được chạy sau đó.</p>
<p>Cái giá của việc tránh bế tắc hiện rõ trong hình: B không làm gì suốt sáu bước này, còn C phải chờ ở bước 4. HĐH đã đổi một phần song song lấy sự an toàn. Ở (o) có một lúc C bị chặn ở R, nhưng đồ thị không có chu trình: A, chủ của R, không chờ thứ gì C đang giữ, nên A chạy được tới cùng và trả R. Một tiến trình bị chặn chưa phải là tiến trình bế tắc — điều quan trọng là sự chờ của nó có kết thúc được không.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/666e4d41af790780b21915e54975e803d7c792c7.svg" alt="Diễn lại Hình 6-4 (k)–(q): khi B bị hoãn, R được trao cho C ngay lúc A trả — không có chu trình" loading="lazy" /><p class="chu-thich">🧮 Diễn lại Hình 6-4 (k)–(q): khi B bị hoãn, R được trao cho C ngay lúc A trả — không có chu trình</p></div>
<table>
<thead><tr><th>#</th><th>Sự kiện</th><th>Kết quả</th><th>Đồ thị</th></tr></thead>
<tbody>
<tr><td>1</td><td>A xin R</td><td>được cấp</td><td>không chu trình</td></tr>
<tr><td>2</td><td>C xin T</td><td>được cấp</td><td>không chu trình</td></tr>
<tr><td>3</td><td>A xin S</td><td>được cấp</td><td>không chu trình</td></tr>
<tr><td>4</td><td>C xin R</td><td>bị chặn (R đang bị giữ)</td><td>không chu trình</td></tr>
<tr><td>5</td><td>A trả R</td><td>R trao cho C, nó tỉnh dậy</td><td>không chu trình</td></tr>
<tr><td>6</td><td>A trả S</td><td>S rảnh trở lại</td><td>không chu trình</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const KICH_BAN = {
  'hinh-6-4-tac': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['B', 'xin', 'S'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['B', 'xin', 'T'], ['C', 'xin', 'R']] },
  'hinh-6-4-tranh': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['C', 'xin', 'R'], ['A', 'tra', 'R'], ['A', 'tra', 'S']] },
  'fe28-14': { tp: ['P1', 'P2', 'P3'], tn: ['R1', 'R2', 'R3'], sk: [['P1', 'xin', 'R1'], ['P2', 'xin', 'R2'], ['P3', 'xin', 'R3'], ['P1', 'xin', 'R2'], ['P2', 'xin', 'R3'], ['P3', 'xin', 'R1']] },
};

/** Chạy chuỗi sự kiện xin/trả trên tài nguyên một thể hiện; trả từng trạng thái + chu trình (nếu có) sau mỗi sự kiện. */
function chay({ tp, tn, sk }) {
  const giu = new Map(), cho = new Map(), hang = new Map(tn.map((r) =&gt; [r, []]));
  const buoc = [];
  for (const [p, op, r] of sk) {
    if (cho.has(p)) throw new Error(&#96;&#36;{p} đang bị chặn mà vẫn phát sự kiện&#96;);
    let kq;
    if (op === 'xin') {
      if (!giu.has(r)) { giu.set(r, p); kq = 'cap'; } else { cho.set(p, r); hang.get(r).push(p); kq = 'chan'; }
    } else {
      if (giu.get(r) !== p) throw new Error(&#96;&#36;{p} trả &#36;{r} mà không giữ&#96;);
      giu.delete(r);
      const ke = hang.get(r).shift();
      if (ke) { giu.set(r, ke); cho.delete(ke); kq = &#96;trao:&#36;{ke}&#96;; } else kq = 'tu-do';
    }
    const cap = [...giu].map(([rr, pp]) =&gt; [rr, pp]), xin = [...cho].map(([pp, rr]) =&gt; [pp, rr]);
    const ct = timChuTrinh({ dinh: [...tp, ...tn], canh: [...cap, ...xin] });
    buoc.push({ p, op, r, kq, cap, xin, chuTrinh: ct.coChuTrinh ? ct.chuTrinh : [] });
  }
  return buoc;
}

// Hình 6-5: "X holds Y" ⇒ Y → X ; "X wants Y" ⇒ X → Y (slide 12)
const H65 = {
  giu: [['R', 'A'], ['U', 'D'], ['T', 'E'], ['W', 'F'], ['V', 'G']],
  muon: [['A', 'S'], ['B', 'T'], ['C', 'S'], ['D', 'S'], ['D', 'T'], ['E', 'V'], ['F', 'S'], ['G', 'U']],
  thuTuDinh: ['R', 'A', 'B', 'C', 'S', 'D', 'T', 'E', 'F', 'U', 'V', 'W', 'G'],
  viTri: { R: [0, 0], A: [1, 0], B: [3, 0], C: [0, 1], S: [1, 1], D: [2, 1], T: [3, 1], E: [4, 1], F: [1, 2], U: [2, 2], V: [4, 2], W: [1, 3], G: [2, 3] },
};</code></pre></details>
<p>➕ Từ đây rút ra hai sự thật tổng quát. Thứ nhất, một đồ thị không có chu trình luôn "rút gọn được": tìm một tiến trình không bị chặn, cho nó chạy xong, xoá các cạnh của nó, lặp lại — đó chính là thuật toán phát hiện bằng ma trận ở slide 17 dưới dạng đồ thị. Thứ hai, thứ tự tránh được bế tắc ở đây được tìm ra nhờ nhìn trước xem mỗi tiến trình sẽ xin gì — các slide sau chính thức hoá việc "nhìn trước" đó thành trạng thái an toàn và thuật toán nhà băng.</p>
<p class="meo">🧠 Ở (q), R được "trao tay" từ A sang C ngay lúc A trả — tiến trình đang chờ tỉnh dậy với tài nguyên đã thuộc về mình. <code>pthread_mutex_unlock</code>, <code>ReentrantLock(true)</code> của Java (chế độ công bằng) và hàng đợi khoá của PostgreSQL cũng hoạt động như vậy: một lần trả đánh thức kẻ chờ kế tiếp.</p>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>Đồ thị cấp phát tài nguyên như slide 7–11: mỗi tài nguyên một thể hiện, nên có chu trình là bế tắc.</p>
<div class="os-lab os-lab-sim-deadlock os-lab-p-cycle os-lab-t-deadlock-detect"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> đồ thị cấp phát tài nguyên có chu trình <a href="/os-lab?sim=deadlock&amp;preset=cycle&amp;lang=vi&amp;tour=deadlock-detect" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Bấm các yêu cầu tới khi chu trình khép lại và gọi tên các tiến trình trong đó.</li><li>Đổi thứ tự một yêu cầu và chỉ ra chu trình không còn hình thành.</li></ol></div>
</div>`],
      [11, 'Deadlock Modeling (5)',
        `<p class="y-chinh">🎯 Four strategies for dealing with deadlocks: <strong>1. ignore the problem</strong> (maybe it will go away); <strong>2. detection and recovery</strong> — let deadlocks occur, detect them, take action; <strong>3. dynamic avoidance</strong> by careful resource allocation; <strong>4. prevention</strong> — structurally negate one of the four conditions.</p>
<p>The rest of the chapter takes them in this order: the ostrich (§6.3), detection and recovery (slides 12–19), avoidance (20–25), prevention (26–28). They differ in <em>when</em> they act. Prevention acts at design time: the rules make a deadlock impossible. Avoidance acts at every request: the OS refuses requests that could lead to trouble. Detection acts afterwards: deadlocks happen, are found, and are broken. The ostrich does not act at all.</p>
<p>➕ <strong>The ostrich algorithm</strong> (§6.3): stick your head in the sand and pretend there is no problem. Mathematicians find it unacceptable; engineers ask how often the problem occurs and what it costs to fix. If a deadlock happens once every few years while crashes from bugs happen every week, paying a large performance or convenience price to eliminate it is a bad trade. UNIX and Windows take this approach for most resources: the process table, the open-file table and user-level locks can all deadlock in principle, and the OS does nothing — if your two threads lock two mutexes in opposite orders, Linux lets them hang (slide 4).</p>
<p>🧭 Where each strategy lives in real systems: <strong>ostrich</strong> — the OS kernel for user-space locks, the JVM (it can <em>report</em> a deadlock but never breaks one); <strong>detection and recovery</strong> — PostgreSQL, MySQL InnoDB and SQL Server for row locks (they abort a victim transaction), the Linux kernel for <code>fcntl</code> record locks (slide 19); <strong>avoidance</strong> — almost nowhere in general-purpose systems, because it needs the maximum demands in advance (slide 25); <strong>prevention</strong> — everywhere in application code, mainly by a global lock order, and in the Linux kernel, whose <em>lockdep</em> validator checks every lock acquisition against the order seen so far.</p>
<p class="pitfall">⚠️ FE: the ostrich algorithm is "a deadlock dealing algorithm" (FE4#46, FE7#46) — not detection, not avoidance, not recovery; the statement that does NOT apply to it: "OS designers are normally very sensitive to deadlock" (FE17#34, FE26#44). Typical approaches do NOT include "deterrence" (FE18#19, FE26#34). The banker's algorithm is avoidance, so it is "not a method to <em>prevent</em> deadlocks" (FE10#46). The primary objective of avoidance: "to preemptively avoid potential deadlocks" (FE9#44), and it "dynamically examines the <em>resource allocation state</em>" (FE1#16).</p>`,
        `<p class="y-chinh">🎯 Bốn chiến lược đối phó với bế tắc: <strong>1. lờ vấn đề đi</strong> (biết đâu nó tự hết); <strong>2. phát hiện và khôi phục</strong> — để bế tắc xảy ra, phát hiện nó, rồi xử lý; <strong>3. tránh động</strong> bằng cách cấp phát tài nguyên cẩn thận; <strong>4. ngăn ngừa</strong> — về mặt cấu trúc phủ định một trong bốn điều kiện.</p>
<p>Phần còn lại của chương đi lần lượt theo thứ tự này: đà điểu (§6.3), phát hiện và khôi phục (slide 12–19), tránh (20–25), ngăn ngừa (26–28). Chúng khác nhau ở chỗ hành động <em>khi nào</em>. Ngăn ngừa hành động lúc thiết kế: luật chơi khiến bế tắc không thể xảy ra. Tránh hành động ở mỗi lần xin: HĐH từ chối những yêu cầu có thể dẫn tới rắc rối. Phát hiện hành động sau sự việc: bế tắc xảy ra, bị tìm ra, rồi bị phá. Đà điểu thì không hành động gì cả.</p>
<p>➕ <strong>Thuật toán đà điểu (ostrich algorithm)</strong> (§6.3): vùi đầu vào cát và coi như không có vấn đề. Nhà toán học thấy điều đó không chấp nhận được; kỹ sư thì hỏi vấn đề xảy ra thường xuyên cỡ nào và sửa nó tốn bao nhiêu. Nếu bế tắc xảy ra vài năm một lần trong khi sập vì lỗi phần mềm xảy ra hằng tuần, thì trả một cái giá lớn về hiệu năng hay sự tiện lợi để loại bỏ nó là một vụ đổi chác tồi. UNIX và Windows chọn cách này cho phần lớn tài nguyên: bảng tiến trình, bảng tệp đang mở và khoá ở mức người dùng về nguyên tắc đều có thể bế tắc, và HĐH không làm gì — nếu hai luồng của bạn khoá hai mutex theo thứ tự ngược nhau, Linux để chúng treo (slide 4).</p>
<p>🧭 Mỗi chiến lược sống ở đâu trong hệ thống thật: <strong>đà điểu</strong> — nhân HĐH với khoá ở không gian người dùng, JVM (nó <em>báo</em> được bế tắc nhưng không bao giờ phá); <strong>phát hiện và khôi phục</strong> — PostgreSQL, MySQL InnoDB và SQL Server với khoá dòng (chúng huỷ một giao dịch "nạn nhân"), nhân Linux với khoá bản ghi <code>fcntl</code> (slide 19); <strong>tránh</strong> — gần như không có trong hệ thống đa dụng, vì nó cần biết trước nhu cầu tối đa (slide 25); <strong>ngăn ngừa</strong> — ở khắp nơi trong mã ứng dụng, chủ yếu bằng một thứ tự khoá chung, và trong nhân Linux, nơi bộ kiểm <em>lockdep</em> soi mọi lần lấy khoá với thứ tự đã thấy trước đó.</p>
<p class="pitfall">⚠️ FE: thuật toán đà điểu là "a deadlock dealing algorithm" (một thuật toán đối phó bế tắc) (FE4#46, FE7#46) — không phải phát hiện, không phải tránh, không phải khôi phục; câu KHÔNG đúng với nó: "OS designers are normally very sensitive to deadlock" (FE17#34, FE26#44). Các cách tiếp cận thường gặp KHÔNG gồm "deterrence" (răn đe) (FE18#19, FE26#34). Thuật toán nhà băng là tránh, nên nó "không phải một cách <em>ngăn ngừa</em> bế tắc" (FE10#46). Mục tiêu chính của tránh: "to preemptively avoid potential deadlocks" (FE9#44), và nó "kiểm tra động <em>trạng thái cấp phát tài nguyên</em>" (FE1#16).</p>`],
      [12, 'Deadlock Detection with One Resource of Each Type (1)',
        `<p class="y-chinh">🎯 Detection, simplest case: only <strong>one resource of each type</strong> (one scanner, one recorder…). Example of slide 12 — seven processes A–G, six resources R–W: A holds R and wants S; B holds nothing, wants T; C holds nothing, wants S; D holds U, wants S and T; E holds T, wants V; F holds W, wants S; G holds V, wants U. <strong>Is this system deadlocked, and if so, who?</strong></p>
<p>With detection the OS does not try to stop deadlocks from happening. It lets processes request and receive resources freely, and from time to time it checks whether a deadlock has formed; if so, it does something about it (slide 19). The check needs a model of the system — the resource graph of slide 7 — and an algorithm to find cycles in it. With one instance of each resource type, any cycle is a deadlock and the processes on the cycle are the deadlocked ones.</p>
<p>Turn the seven sentences into arcs before looking at the next slide: "X holds Y" becomes an arc <strong>Y → X</strong>, "X wants Y" becomes <strong>X → Y</strong>. That gives 5 holding arcs (R→A, U→D, T→E, W→F, V→G) and 8 waiting arcs (A→S, B→T, C→S, D→S, D→T, E→V, F→S, G→U). Note D wants <em>two</em> resources at once — the model allows it.</p>
<p>➕ How a real system collects the same data: PostgreSQL keeps a table of all locks in shared memory (visible as the <code>pg_locks</code> view, with <code>granted = true</code> for holding arcs and <code>granted = false</code> for waiting arcs); the JVM keeps an owner field in every monitor and a "blocked on" field in every thread. The detector only has to read them — the hard part is doing it without stopping the whole system, which is why PostgreSQL waits <code>deadlock_timeout</code> (1 s by default) before looking (slide 19).</p>
<p class="meo">🧠 Exam tip: in a question that lists "holds / wants", write the arcs first, then search — trying to "see" the cycle in your head with seven processes is how points are lost.</p>`,
        `<p class="y-chinh">🎯 Phát hiện, trường hợp đơn giản nhất: mỗi loại <strong>chỉ có một tài nguyên</strong> (một máy quét, một đầu ghi…). Ví dụ của slide 12 — bảy tiến trình A–G, sáu tài nguyên R–W: A giữ R và muốn S; B không giữ gì, muốn T; C không giữ gì, muốn S; D giữ U, muốn S và T; E giữ T, muốn V; F giữ W, muốn S; G giữ V, muốn U. <strong>Hệ thống có bế tắc không, và nếu có thì những ai?</strong></p>
<p>Với cách phát hiện, HĐH không cố ngăn bế tắc xảy ra. Nó để các tiến trình tự do xin và nhận tài nguyên, rồi thỉnh thoảng kiểm xem bế tắc đã hình thành chưa; nếu có thì xử lý (slide 19). Phép kiểm cần một mô hình của hệ thống — đồ thị tài nguyên của slide 7 — và một thuật toán tìm chu trình trong đó. Khi mỗi loại tài nguyên chỉ có một thể hiện, chu trình nào cũng là bế tắc, và các tiến trình trên chu trình chính là những kẻ bế tắc.</p>
<p>Hãy đổi bảy câu thành các cạnh trước khi xem slide sau: "X giữ Y" thành cạnh <strong>Y → X</strong>, "X muốn Y" thành <strong>X → Y</strong>. Ta có 5 cạnh giữ (R→A, U→D, T→E, W→F, V→G) và 8 cạnh chờ (A→S, B→T, C→S, D→S, D→T, E→V, F→S, G→U). Để ý D muốn <em>hai</em> tài nguyên cùng lúc — mô hình cho phép điều đó.</p>
<p>➕ Hệ thống thật thu thập cùng dữ liệu đó thế nào: PostgreSQL giữ một bảng mọi khoá trong bộ nhớ dùng chung (xem được qua view <code>pg_locks</code>, cột <code>granted = true</code> là cạnh giữ, <code>granted = false</code> là cạnh chờ); JVM giữ một trường chủ sở hữu trong mỗi monitor và một trường "đang bị chặn trên" trong mỗi luồng. Bộ dò chỉ cần đọc chúng — phần khó là làm việc đó mà không dừng cả hệ thống, vì vậy PostgreSQL chờ <code>deadlock_timeout</code> (mặc định 1 giây) rồi mới nhìn (slide 19).</p>
<p class="meo">🧠 Mẹo thi: gặp câu liệt kê "giữ / muốn", hãy viết các cạnh ra trước rồi mới tìm — cố "nhìn" chu trình trong đầu với bảy tiến trình là cách mất điểm.</p>`],
      [13, 'Deadlock Detection with One Resource of Each Type (2)',
        `<p class="y-chinh">🎯 Figure 6-5: (a) the resource graph of slide 12; (b) the cycle extracted from it: <strong>D → T → E → V → G → U → D</strong>. Processes D, E and G are deadlocked. A, C and F are not — although they are blocked on S, which is free, they can be granted S one at a time and finish.</p>
<p>Look at S: four arcs point into it (A, C, D, F want it) but no arc goes out — nobody holds S. So S is available, and A, C, F can each get it in turn and complete. D also wants S, but D is part of the cycle: it holds U, which G needs, and it waits for T, which E holds. The simulator rebuilds the graph from the seven sentences and runs the depth-first search of the next two slides, starting from R, then A, then B — exactly the order of the book's walk-through. The table under the figure is the list L at every step:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7f7e6a95b94ca9e72617a4ac0e70834ad81e2ce1.svg" alt="Figure 6-5 recomputed: the cycle found from root B, with the list L step by step" loading="lazy" /><p class="chu-thich">🧮 Figure 6-5 recomputed: the cycle found from root B, with the list L step by step</p></div>
<table>
<thead><tr><th>#</th><th>Root</th><th>List L</th><th>What happens</th></tr></thead>
<tbody>
<tr><td>1</td><td>R</td><td>[R]</td><td>follow an unmarked arc to A</td></tr>
<tr><td>2</td><td>R</td><td>[R, A]</td><td>follow an unmarked arc to S</td></tr>
<tr><td>3</td><td>R</td><td>[R, A]</td><td>dead end at S ⇒ remove it, back up</td></tr>
<tr><td>4</td><td>R</td><td>[R]</td><td>dead end at A ⇒ remove it, back up</td></tr>
<tr><td>5</td><td>R</td><td>[]</td><td>back at the root, no arc left ⇒ no cycle through this root</td></tr>
<tr><td>6</td><td>A</td><td>[A]</td><td>follow an unmarked arc to S</td></tr>
<tr><td>7</td><td>A</td><td>[A]</td><td>dead end at S ⇒ remove it, back up</td></tr>
<tr><td>8</td><td>A</td><td>[]</td><td>back at the root, no arc left ⇒ no cycle through this root</td></tr>
<tr><td>9</td><td>B</td><td>[B]</td><td>follow an unmarked arc to T</td></tr>
<tr><td>10</td><td>B</td><td>[B, T]</td><td>follow an unmarked arc to E</td></tr>
<tr><td>11</td><td>B</td><td>[B, T, E]</td><td>follow an unmarked arc to V</td></tr>
<tr><td>12</td><td>B</td><td>[B, T, E, V]</td><td>follow an unmarked arc to G</td></tr>
<tr><td>13</td><td>B</td><td>[B, T, E, V, G]</td><td>follow an unmarked arc to U</td></tr>
<tr><td>14</td><td>B</td><td>[B, T, E, V, G, U]</td><td>follow an unmarked arc to D</td></tr>
<tr><td>15</td><td>B</td><td>[B, T, E, V, G, U, D]</td><td>follow an unmarked arc to S</td></tr>
<tr><td>16</td><td>B</td><td>[B, T, E, V, G, U, D]</td><td>dead end at S ⇒ remove it, back up</td></tr>
<tr><td>17</td><td>B</td><td>[B, T, E, V, G, U, D]</td><td>follow an unmarked arc to T</td></tr>
<tr><td>18</td><td>B</td><td>[B, T, E, V, G, U, D, T]</td><td>node appears twice ⇒ CYCLE, stop</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const KICH_BAN = {
  'hinh-6-4-tac': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['B', 'xin', 'S'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['B', 'xin', 'T'], ['C', 'xin', 'R']] },
  'hinh-6-4-tranh': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['C', 'xin', 'R'], ['A', 'tra', 'R'], ['A', 'tra', 'S']] },
  'fe28-14': { tp: ['P1', 'P2', 'P3'], tn: ['R1', 'R2', 'R3'], sk: [['P1', 'xin', 'R1'], ['P2', 'xin', 'R2'], ['P3', 'xin', 'R3'], ['P1', 'xin', 'R2'], ['P2', 'xin', 'R3'], ['P3', 'xin', 'R1']] },
};

/** Chạy chuỗi sự kiện xin/trả trên tài nguyên một thể hiện; trả từng trạng thái + chu trình (nếu có) sau mỗi sự kiện. */
function chay({ tp, tn, sk }) {
  const giu = new Map(), cho = new Map(), hang = new Map(tn.map((r) =&gt; [r, []]));
  const buoc = [];
  for (const [p, op, r] of sk) {
    if (cho.has(p)) throw new Error(&#96;&#36;{p} đang bị chặn mà vẫn phát sự kiện&#96;);
    let kq;
    if (op === 'xin') {
      if (!giu.has(r)) { giu.set(r, p); kq = 'cap'; } else { cho.set(p, r); hang.get(r).push(p); kq = 'chan'; }
    } else {
      if (giu.get(r) !== p) throw new Error(&#96;&#36;{p} trả &#36;{r} mà không giữ&#96;);
      giu.delete(r);
      const ke = hang.get(r).shift();
      if (ke) { giu.set(r, ke); cho.delete(ke); kq = &#96;trao:&#36;{ke}&#96;; } else kq = 'tu-do';
    }
    const cap = [...giu].map(([rr, pp]) =&gt; [rr, pp]), xin = [...cho].map(([pp, rr]) =&gt; [pp, rr]);
    const ct = timChuTrinh({ dinh: [...tp, ...tn], canh: [...cap, ...xin] });
    buoc.push({ p, op, r, kq, cap, xin, chuTrinh: ct.coChuTrinh ? ct.chuTrinh : [] });
  }
  return buoc;
}

// Hình 6-5: "X holds Y" ⇒ Y → X ; "X wants Y" ⇒ X → Y (slide 12)
const H65 = {
  giu: [['R', 'A'], ['U', 'D'], ['T', 'E'], ['W', 'F'], ['V', 'G']],
  muon: [['A', 'S'], ['B', 'T'], ['C', 'S'], ['D', 'S'], ['D', 'T'], ['E', 'V'], ['F', 'S'], ['G', 'U']],
  thuTuDinh: ['R', 'A', 'B', 'C', 'S', 'D', 'T', 'E', 'F', 'U', 'V', 'W', 'G'],
  viTri: { R: [0, 0], A: [1, 0], B: [3, 0], C: [0, 1], S: [1, 1], D: [2, 1], T: [3, 1], E: [4, 1], F: [1, 2], U: [2, 2], V: [4, 2], W: [1, 3], G: [2, 3] },
};</code></pre></details>
<p>Read the trace: from root R the search goes R → A → S and hits a dead end (S has no outgoing arc), backs up to A, then to R — no cycle through R. Root A: the same dead end. Root B: B → T → E → V → G → U → D; D has two outgoing arcs; first S — dead end, back to D; then T — and T is already in L. The cycle is the part of L from the first T: T, E, V, G, U, D.</p>
<p>➕ A cycle tells you who is deadlocked, but not who is <em>affected</em>. B wants T, which belongs to the deadlocked E; B is not on the cycle and is not deadlocked by the strict definition — but it will wait for ever unless the deadlock is broken. In a server this is the usual picture: two requests deadlock, and then every request that needs one of their locks piles up behind them. That is why a small deadlock can take a whole service down.</p>
<p class="pitfall">⚠️ "If the wait-for graph contains a cycle, a deadlock exists" (FE5#43) — true because a wait-for graph is only used when every resource has one instance. "The resource-allocation graph does not apply to systems with multiple instances of each resource type" (FE5#45) — Silberschatz's wording about the graph <em>algorithm</em>; with several instances you use the matrices of slides 16–18.</p>`,
        `<p class="y-chinh">🎯 Hình 6-5: (a) đồ thị tài nguyên của slide 12; (b) chu trình tách ra từ đó: <strong>D → T → E → V → G → U → D</strong>. Các tiến trình D, E và G bế tắc. A, C và F thì không — dù đang bị chặn chờ S, nhưng S đang rảnh, chúng lần lượt được cấp S và chạy xong được.</p>
<p>Nhìn S: có bốn cạnh đi vào (A, C, D, F đều muốn nó) nhưng không cạnh nào đi ra — không ai giữ S. Vậy S rảnh, và A, C, F lần lượt lấy nó rồi chạy xong. D cũng muốn S, nhưng D nằm trên chu trình: nó giữ U, thứ G cần, và chờ T, thứ E đang giữ. Bộ mô phỏng dựng lại đồ thị từ bảy câu và chạy phép duyệt sâu của hai slide sau, bắt đầu từ R, rồi A, rồi B — đúng thứ tự sách đi qua. Bảng dưới hình là danh sách L ở từng bước:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/32bb2b32006b5269d388a97b52b41d9339fc6b96.svg" alt="Tính lại Hình 6-5: chu trình tìm được từ gốc B, kèm danh sách L từng bước" loading="lazy" /><p class="chu-thich">🧮 Tính lại Hình 6-5: chu trình tìm được từ gốc B, kèm danh sách L từng bước</p></div>
<table>
<thead><tr><th>#</th><th>Gốc</th><th>Danh sách L</th><th>Chuyện gì xảy ra</th></tr></thead>
<tbody>
<tr><td>1</td><td>R</td><td>[R]</td><td>đi theo cạnh chưa đánh dấu tới A</td></tr>
<tr><td>2</td><td>R</td><td>[R, A]</td><td>đi theo cạnh chưa đánh dấu tới S</td></tr>
<tr><td>3</td><td>R</td><td>[R, A]</td><td>ngõ cụt ở S ⇒ bỏ nó, lùi lại</td></tr>
<tr><td>4</td><td>R</td><td>[R]</td><td>ngõ cụt ở A ⇒ bỏ nó, lùi lại</td></tr>
<tr><td>5</td><td>R</td><td>[]</td><td>lùi về gốc, hết cạnh ⇒ gốc này không nằm trên chu trình</td></tr>
<tr><td>6</td><td>A</td><td>[A]</td><td>đi theo cạnh chưa đánh dấu tới S</td></tr>
<tr><td>7</td><td>A</td><td>[A]</td><td>ngõ cụt ở S ⇒ bỏ nó, lùi lại</td></tr>
<tr><td>8</td><td>A</td><td>[]</td><td>lùi về gốc, hết cạnh ⇒ gốc này không nằm trên chu trình</td></tr>
<tr><td>9</td><td>B</td><td>[B]</td><td>đi theo cạnh chưa đánh dấu tới T</td></tr>
<tr><td>10</td><td>B</td><td>[B, T]</td><td>đi theo cạnh chưa đánh dấu tới E</td></tr>
<tr><td>11</td><td>B</td><td>[B, T, E]</td><td>đi theo cạnh chưa đánh dấu tới V</td></tr>
<tr><td>12</td><td>B</td><td>[B, T, E, V]</td><td>đi theo cạnh chưa đánh dấu tới G</td></tr>
<tr><td>13</td><td>B</td><td>[B, T, E, V, G]</td><td>đi theo cạnh chưa đánh dấu tới U</td></tr>
<tr><td>14</td><td>B</td><td>[B, T, E, V, G, U]</td><td>đi theo cạnh chưa đánh dấu tới D</td></tr>
<tr><td>15</td><td>B</td><td>[B, T, E, V, G, U, D]</td><td>đi theo cạnh chưa đánh dấu tới S</td></tr>
<tr><td>16</td><td>B</td><td>[B, T, E, V, G, U, D]</td><td>ngõ cụt ở S ⇒ bỏ nó, lùi lại</td></tr>
<tr><td>17</td><td>B</td><td>[B, T, E, V, G, U, D]</td><td>đi theo cạnh chưa đánh dấu tới T</td></tr>
<tr><td>18</td><td>B</td><td>[B, T, E, V, G, U, D, T]</td><td>đỉnh xuất hiện hai lần ⇒ CHU TRÌNH, dừng</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const KICH_BAN = {
  'hinh-6-4-tac': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['B', 'xin', 'S'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['B', 'xin', 'T'], ['C', 'xin', 'R']] },
  'hinh-6-4-tranh': { tp: ['A', 'B', 'C'], tn: ['R', 'S', 'T'], sk: [['A', 'xin', 'R'], ['C', 'xin', 'T'], ['A', 'xin', 'S'], ['C', 'xin', 'R'], ['A', 'tra', 'R'], ['A', 'tra', 'S']] },
  'fe28-14': { tp: ['P1', 'P2', 'P3'], tn: ['R1', 'R2', 'R3'], sk: [['P1', 'xin', 'R1'], ['P2', 'xin', 'R2'], ['P3', 'xin', 'R3'], ['P1', 'xin', 'R2'], ['P2', 'xin', 'R3'], ['P3', 'xin', 'R1']] },
};

/** Chạy chuỗi sự kiện xin/trả trên tài nguyên một thể hiện; trả từng trạng thái + chu trình (nếu có) sau mỗi sự kiện. */
function chay({ tp, tn, sk }) {
  const giu = new Map(), cho = new Map(), hang = new Map(tn.map((r) =&gt; [r, []]));
  const buoc = [];
  for (const [p, op, r] of sk) {
    if (cho.has(p)) throw new Error(&#96;&#36;{p} đang bị chặn mà vẫn phát sự kiện&#96;);
    let kq;
    if (op === 'xin') {
      if (!giu.has(r)) { giu.set(r, p); kq = 'cap'; } else { cho.set(p, r); hang.get(r).push(p); kq = 'chan'; }
    } else {
      if (giu.get(r) !== p) throw new Error(&#96;&#36;{p} trả &#36;{r} mà không giữ&#96;);
      giu.delete(r);
      const ke = hang.get(r).shift();
      if (ke) { giu.set(r, ke); cho.delete(ke); kq = &#96;trao:&#36;{ke}&#96;; } else kq = 'tu-do';
    }
    const cap = [...giu].map(([rr, pp]) =&gt; [rr, pp]), xin = [...cho].map(([pp, rr]) =&gt; [pp, rr]);
    const ct = timChuTrinh({ dinh: [...tp, ...tn], canh: [...cap, ...xin] });
    buoc.push({ p, op, r, kq, cap, xin, chuTrinh: ct.coChuTrinh ? ct.chuTrinh : [] });
  }
  return buoc;
}

// Hình 6-5: "X holds Y" ⇒ Y → X ; "X wants Y" ⇒ X → Y (slide 12)
const H65 = {
  giu: [['R', 'A'], ['U', 'D'], ['T', 'E'], ['W', 'F'], ['V', 'G']],
  muon: [['A', 'S'], ['B', 'T'], ['C', 'S'], ['D', 'S'], ['D', 'T'], ['E', 'V'], ['F', 'S'], ['G', 'U']],
  thuTuDinh: ['R', 'A', 'B', 'C', 'S', 'D', 'T', 'E', 'F', 'U', 'V', 'W', 'G'],
  viTri: { R: [0, 0], A: [1, 0], B: [3, 0], C: [0, 1], S: [1, 1], D: [2, 1], T: [3, 1], E: [4, 1], F: [1, 2], U: [2, 2], V: [4, 2], W: [1, 3], G: [2, 3] },
};</code></pre></details>
<p>Đọc vết: từ gốc R, phép tìm đi R → A → S rồi gặp ngõ cụt (S không có cạnh ra), lùi về A, rồi về R — không có chu trình qua R. Gốc A: cùng ngõ cụt đó. Gốc B: B → T → E → V → G → U → D; D có hai cạnh ra; trước tiên S — ngõ cụt, lùi về D; rồi T — và T đã có trong L. Chu trình là phần của L kể từ chữ T đầu tiên: T, E, V, G, U, D.</p>
<p>➕ Chu trình cho biết ai bế tắc, nhưng không cho biết ai <em>bị liên luỵ</em>. B muốn T, thứ thuộc về E đang bế tắc; B không nằm trên chu trình và theo định nghĩa chặt thì không bế tắc — nhưng nó sẽ chờ mãi trừ khi bế tắc bị phá. Trên server đây là bức tranh thường gặp: hai request bế tắc, rồi mọi request cần một trong các khoá của chúng dồn ứ phía sau. Vì vậy một bế tắc nhỏ có thể đánh sập cả một dịch vụ.</p>
<p class="pitfall">⚠️ "Nếu đồ thị chờ (wait-for graph) có chu trình thì có bế tắc" (FE5#43) — đúng vì đồ thị chờ chỉ dùng khi mỗi tài nguyên có một thể hiện. "Đồ thị cấp phát tài nguyên không áp dụng cho hệ có nhiều thể hiện mỗi loại" (FE5#45) — là cách nói của Silberschatz về <em>thuật toán</em> trên đồ thị; khi có nhiều thể hiện thì dùng các ma trận của slide 16–18.</p>`],
      [14, 'Algorithm to Detect Deadlocks (1)',
        `<p class="y-chinh">🎯 The cycle-finding algorithm, steps 1–3: <strong>1.</strong> for each node N in the graph, perform the following steps with N as the starting node; <strong>2.</strong> initialise L to the empty list and mark all arcs as unmarked; <strong>3.</strong> add the current node to the end of L and check whether it now appears in L twice — if so, the graph contains a cycle (listed in L) and the algorithm terminates.</p>
<p>L is the path walked so far, from the root to where we stand. Step 3 is the whole idea: if we can walk along arcs and arrive at a node that is already on our path, we have walked in a circle. Marking arcs (steps 4–5, next slide) makes sure we never try the same arc twice from the same root, so the search always ends. Restarting from every node (step 1) guarantees that a cycle anywhere in the graph is found, even in parts not reachable from the first root. This is depth-first search — the same algorithm you meet in the data-structures course (CSD201), applied to a deadlock.</p>
<p>➕ The algorithm is simple but not the fastest: restarting from every node can walk the same arcs again and again. Real detectors use one depth-first pass with three colours (white = not visited, grey = on the current path, black = finished; meeting a grey node = cycle), which runs in time proportional to the number of nodes plus arcs. For an exam, however, follow the book's steps exactly — questions are about the list L.</p>
<p>The book's version on Figure 6-5, step by step, is the table on the previous slide; the code of the simulator (open "xem mã mô phỏng" under any figure) implements steps 1–6 literally in <code>timChuTrinh</code>, with arcs chosen in the order they are listed instead of "at random", so that the trace is repeatable.</p>
<p class="meo">🧠 Why "appears twice" and not "appears again at the root"? Because a cycle does not have to pass through the root: starting from B, the walk entered the cycle at T and found it there. A search that only looks for "back to the start" would have missed it.</p>`,
        `<p class="y-chinh">🎯 Thuật toán tìm chu trình, bước 1–3: <strong>1.</strong> với mỗi đỉnh N của đồ thị, thực hiện các bước sau với N là đỉnh xuất phát; <strong>2.</strong> khởi tạo L là danh sách rỗng và coi mọi cạnh là chưa đánh dấu; <strong>3.</strong> thêm đỉnh hiện tại vào cuối L và kiểm xem nó có xuất hiện trong L hai lần chưa — nếu có, đồ thị chứa một chu trình (liệt kê trong L) và thuật toán kết thúc.</p>
<p>L là con đường đã đi tới giờ, từ gốc tới chỗ đang đứng. Bước 3 là toàn bộ ý tưởng: nếu đi theo các cạnh mà tới được một đỉnh đã nằm trên đường đi của mình thì ta vừa đi một vòng. Việc đánh dấu cạnh (bước 4–5, slide sau) bảo đảm không bao giờ thử cùng một cạnh hai lần từ cùng một gốc, nên phép tìm luôn kết thúc. Bắt đầu lại từ mọi đỉnh (bước 1) bảo đảm chu trình ở bất kỳ đâu trong đồ thị cũng được tìm thấy, kể cả ở những phần không đi tới được từ gốc đầu tiên. Đây là duyệt theo chiều sâu (depth-first search — DFS) — cùng thuật toán bạn gặp ở môn cấu trúc dữ liệu (CSD201), áp vào bài toán bế tắc.</p>
<p>➕ Thuật toán đơn giản nhưng không nhanh nhất: bắt đầu lại từ mọi đỉnh có thể đi lại các cạnh cũ nhiều lần. Bộ dò thật dùng một lượt DFS với ba màu (trắng = chưa thăm, xám = đang trên đường đi, đen = đã xong; gặp đỉnh xám = chu trình), thời gian chạy tỉ lệ với số đỉnh cộng số cạnh. Nhưng khi đi thi, hãy theo đúng các bước của sách — câu hỏi xoay quanh danh sách L.</p>
<p>Phiên bản của sách trên Hình 6-5, từng bước, là bảng ở slide trước; mã của bộ mô phỏng (mở "xem mã mô phỏng" dưới hình bất kỳ) cài đúng từng chữ sáu bước đó trong hàm <code>timChuTrinh</code>, chỉ khác là chọn cạnh theo thứ tự khai báo thay vì "ngẫu nhiên", để vết chạy lặp lại được.</p>
<p class="meo">🧠 Vì sao là "xuất hiện hai lần" mà không phải "quay lại gốc"? Vì chu trình không nhất thiết đi qua gốc: xuất phát từ B, đường đi vào chu trình ở T và tìm thấy nó ở đó. Một phép tìm chỉ chờ "quay về điểm xuất phát" sẽ bỏ sót.</p>`],
      [15, 'Algorithm to Detect Deadlocks (2)',
        `<p class="y-chinh">🎯 Steps 4–6: <strong>4.</strong> from the current node, see if there are any unmarked outgoing arcs — if so go to step 5, if not go to step 6; <strong>5.</strong> pick an unmarked outgoing arc at random and mark it, then follow it to the new current node and go to step 3; <strong>6.</strong> if this is the initial node, the graph does not contain any cycles through it — terminate this root; otherwise we have reached a dead end: remove it, go back to the previous node and go to step 3.</p>
<p>⚠️ The slide numbers these three steps "4. 4. 4." — a numbering error of the slide; they are steps 4, 5 and 6 of the book's six-step algorithm (step 1 is the outer loop over roots). Also note the wording of step 6: reaching the initial node with no arcs left means there is no cycle <em>containing this root</em>; the algorithm then moves to the next root of step 1, and only when every root has been tried can it say "the graph has no cycle".</p>
<p>Step 5's "at random" only changes the order in which arcs are tried; the answer (cycle or no cycle) is the same. For a written answer, choose arcs in alphabetical order and say so.</p>
<p>➕ Real detectors at work. The JVM implements this search when you ask for a thread dump: <code>jstack</code> attaches to a running Java process and prints every thread's stack, and at the end runs the cycle search over monitors. Here it is on a Java "server" that hung — the way you would diagnose it on a production machine (find the PID, take a dump):</p>
<div class="out"># A hung Java server, diagnosed the way you would on a real machine: find the PID, ask jstack for a thread dump<br>
# the program never ends — what are its threads doing?<br>
$ jstack $(pgrep -f _TreoMai) | sed -n '/Found one Java-level deadlock/,$p'<br>
Found one Java-level deadlock:<br>
=============================<br>
"transfer-A-to-B":<br>
&nbsp;&nbsp;waiting to lock monitor 0x0000ffff1c001da0 (object 0x000000008bb134c8, a java.lang.Object),<br>
&nbsp;&nbsp;which is held by "transfer-B-to-A"<br>
<br>
"transfer-B-to-A":<br>
&nbsp;&nbsp;waiting to lock monitor 0x0000ffff20000f70 (object 0x000000008bb134b8, a java.lang.Object),<br>
&nbsp;&nbsp;which is held by "transfer-A-to-B"<br>
<br>
Java stack information for the threads listed above:<br>
===================================================<br>
"transfer-A-to-B":<br>
	at _TreoMai.lambda$main$0(_TreoMai.java:6)<br>
	- waiting to lock &lt;0x000000008bb134c8&gt; (a java.lang.Object)<br>
	- locked &lt;0x000000008bb134b8&gt; (a java.lang.Object)<br>
	at _TreoMai$$Lambda/0x000000e801000a08.run(Unknown Source)<br>
	at java.lang.Thread.runWith(java.base@21.0.12.1/Thread.java:1596)<br>
	at java.lang.Thread.run(java.base@21.0.12.1/Thread.java:1583)<br>
"transfer-B-to-A":<br>
	at _TreoMai.lambda$main$1(_TreoMai.java:7)<br>
	- waiting to lock &lt;0x000000008bb134b8&gt; (a java.lang.Object)<br>
	- locked &lt;0x000000008bb134c8&gt; (a java.lang.Object)<br>
	at _TreoMai$$Lambda/0x000000e801000c28.run(Unknown Source)<br>
	at java.lang.Thread.runWith(java.base@21.0.12.1/Thread.java:1596)<br>
	at java.lang.Thread.run(java.base@21.0.12.1/Thread.java:1583)<br>
<br>
Found 1 deadlock.</div>
<p>"Found one Java-level deadlock": each thread is "waiting to lock" one object and "locked" the other, with the source line where it happened (<code>_TreoMai.java</code> line 6 and line 7 — the two <code>synchronized</code> blocks). That is the cycle of the graph printed for humans. In a Spring Boot service the same dump is available through the Actuator endpoint <code>/actuator/threaddump</code>.</p>
<p class="meo">🧠 When a Java service "hangs" with 0% CPU, take <strong>two</strong> thread dumps a few seconds apart: threads stuck on the same lines in both are blocked for real; a deadlock line in either one tells you exactly which two code paths take locks in opposite orders.</p>`,
        `<p class="y-chinh">🎯 Bước 4–6: <strong>4.</strong> từ đỉnh hiện tại, xem còn cạnh ra nào chưa đánh dấu không — có thì sang bước 5, không thì sang bước 6; <strong>5.</strong> chọn ngẫu nhiên một cạnh ra chưa đánh dấu và đánh dấu nó, rồi đi theo nó tới đỉnh hiện tại mới và quay về bước 3; <strong>6.</strong> nếu đây là đỉnh xuất phát thì đồ thị không có chu trình nào qua nó — kết thúc với gốc này; ngược lại ta đã tới ngõ cụt: bỏ đỉnh đó đi, lùi về đỉnh trước và quay về bước 3.</p>
<p>⚠️ Slide đánh số ba bước này là "4. 4. 4." — lỗi đánh số của slide; chúng là bước 4, 5 và 6 trong thuật toán sáu bước của sách (bước 1 là vòng lặp ngoài qua các gốc). Cũng để ý câu chữ của bước 6: về tới đỉnh xuất phát mà hết cạnh nghĩa là không có chu trình <em>chứa gốc này</em>; thuật toán khi đó chuyển sang gốc kế tiếp của bước 1, và chỉ khi đã thử hết mọi gốc mới nói được "đồ thị không có chu trình".</p>
<p>Chữ "ngẫu nhiên" ở bước 5 chỉ đổi thứ tự thử các cạnh; đáp án (có hay không có chu trình) vẫn vậy. Khi làm bài tự luận, hãy chọn cạnh theo thứ tự chữ cái và ghi rõ điều đó.</p>
<p>➕ Bộ dò thật làm việc. JVM cài phép tìm này khi bạn xin một bản thread dump: <code>jstack</code> gắn vào một tiến trình Java đang chạy, in ngăn xếp của mọi luồng, và cuối cùng chạy phép tìm chu trình trên các monitor. Đây là nó trên một "server" Java bị treo — đúng cách bạn chẩn đoán trên máy production (tìm PID, lấy dump):</p>
<div class="out"># Một server Java bị treo, chẩn đoán như trên máy thật: tìm PID, xin jstack một bản thread dump<br>
# chương trình không bao giờ kết thúc — các luồng của nó đang làm gì?<br>
$ jstack $(pgrep -f _TreoMai) | sed -n '/Found one Java-level deadlock/,$p'<br>
Found one Java-level deadlock:<br>
=============================<br>
"transfer-A-to-B":<br>
&nbsp;&nbsp;waiting to lock monitor 0x0000ffff1c001da0 (object 0x000000008bb134c8, a java.lang.Object),<br>
&nbsp;&nbsp;which is held by "transfer-B-to-A"<br>
<br>
"transfer-B-to-A":<br>
&nbsp;&nbsp;waiting to lock monitor 0x0000ffff20000f70 (object 0x000000008bb134b8, a java.lang.Object),<br>
&nbsp;&nbsp;which is held by "transfer-A-to-B"<br>
<br>
Java stack information for the threads listed above:<br>
===================================================<br>
"transfer-A-to-B":<br>
	at _TreoMai.lambda$main$0(_TreoMai.java:6)<br>
	- waiting to lock &lt;0x000000008bb134c8&gt; (a java.lang.Object)<br>
	- locked &lt;0x000000008bb134b8&gt; (a java.lang.Object)<br>
	at _TreoMai$$Lambda/0x000000e801000a08.run(Unknown Source)<br>
	at java.lang.Thread.runWith(java.base@21.0.12.1/Thread.java:1596)<br>
	at java.lang.Thread.run(java.base@21.0.12.1/Thread.java:1583)<br>
"transfer-B-to-A":<br>
	at _TreoMai.lambda$main$1(_TreoMai.java:7)<br>
	- waiting to lock &lt;0x000000008bb134b8&gt; (a java.lang.Object)<br>
	- locked &lt;0x000000008bb134c8&gt; (a java.lang.Object)<br>
	at _TreoMai$$Lambda/0x000000e801000c28.run(Unknown Source)<br>
	at java.lang.Thread.runWith(java.base@21.0.12.1/Thread.java:1596)<br>
	at java.lang.Thread.run(java.base@21.0.12.1/Thread.java:1583)<br>
<br>
Found 1 deadlock.</div>
<p>"Found one Java-level deadlock": mỗi luồng đang "waiting to lock" (chờ khoá) một đối tượng và đã "locked" (khoá) đối tượng kia, kèm dòng mã nơi chuyện xảy ra (<code>_TreoMai.java</code> dòng 6 và dòng 7 — hai khối <code>synchronized</code>). Đó là chu trình của đồ thị được in ra cho người đọc. Trong một dịch vụ Spring Boot, bản dump này có sẵn qua endpoint <code>/actuator/threaddump</code> của Actuator.</p>
<p class="meo">🧠 Khi một dịch vụ Java "treo" với 0% CPU, hãy lấy <strong>hai</strong> bản thread dump cách nhau vài giây: luồng nào kẹt ở cùng dòng trong cả hai bản là bị chặn thật; một dòng báo bế tắc ở bản nào cũng chỉ ra chính xác hai đường mã nào lấy khoá ngược thứ tự nhau.</p>`],
      [16, 'Deadlock Detection with Multiple Resources of Each Type (1)',
        `<p class="y-chinh">🎯 Figure 6-6: when a resource type has several identical instances, the detector uses four data structures for n processes and m resource types — the <strong>existing resource vector E</strong> (E<sub>j</sub> = how many instances of type j exist), the <strong>available resource vector A</strong> (how many are free now), the <strong>current allocation matrix C</strong> (row i = what process i holds) and the <strong>request matrix R</strong> (row i = what process i is still asking for and blocked on).</p>
<p>Why a cycle is not enough any more: with two tape drives, process A may wait for "a tape drive" while both are held — one by B, which is waiting for something, and one by C, which is running and will soon release it. The graph has a cycle through A and B, but C's release breaks it. So with several instances <strong>a cycle is necessary but not sufficient</strong> for a deadlock, and we count instead of drawing.</p>
<p>The four structures obey one invariant, equation 6-1 of the book: for every resource type j, <strong>Σ<sub>i</sub> C<sub>ij</sub> + A<sub>j</sub> = E<sub>j</sub></strong> — every instance is either allocated to someone or free. The simulator checks this before running and refuses data that breaks it (a good habit for exam questions too: if the numbers do not add up, you copied the question wrong). Comparing vectors is done component by component: A ≤ B means A<sub>j</sub> ≤ B<sub>j</sub> for every j — (1 0 1) ≤ (2 0 1) is true, (1 1 0) ≤ (2 0 1) is false because of the second component.</p>
<p>➕ The same four structures come back for the banker's algorithm (slide 24), with one change: R (what a process asks for <em>now</em>) is replaced by "still needed" = Max − C (what it <em>might</em> ask for in the future). Keep the two straight and half of the chapter's calculation questions become routine.</p>
<p class="pitfall">⚠️ FE names the pieces: "number of instances of each resource each process <em>needs</em>" → <strong>request matrix</strong> (FE19#47, FE24#19); "currently un-allocated / available" → <strong>available resource vector</strong> (FE27#9); "each process currently <em>holds</em>" → <strong>current allocation matrix</strong> (FE28#27, FE29#13).</p>`,
        `<p class="y-chinh">🎯 Hình 6-6: khi một loại tài nguyên có nhiều thể hiện giống nhau, bộ dò dùng bốn cấu trúc dữ liệu cho n tiến trình và m loại tài nguyên — <strong>vector tài nguyên tồn tại E</strong> (E<sub>j</sub> = có tất cả bao nhiêu thể hiện loại j), <strong>vector tài nguyên khả dụng A</strong> (lúc này còn rảnh bao nhiêu), <strong>ma trận cấp phát hiện tại C</strong> (hàng i = tiến trình i đang giữ gì) và <strong>ma trận yêu cầu R</strong> (hàng i = tiến trình i còn đang xin gì và bị chặn ở đó).</p>
<p>Vì sao chu trình không còn đủ: với hai ổ băng từ, tiến trình A có thể chờ "một ổ băng từ" trong khi cả hai ổ đều bị giữ — một bởi B, đang chờ thứ khác, và một bởi C, đang chạy và sắp trả. Đồ thị có chu trình qua A và B, nhưng việc C trả sẽ phá nó. Nên khi có nhiều thể hiện, <strong>chu trình là điều kiện cần nhưng chưa đủ</strong> cho bế tắc, và ta phải đếm thay vì vẽ.</p>
<p>Bốn cấu trúc tuân theo một bất biến, phương trình 6-1 của sách: với mọi loại tài nguyên j, <strong>Σ<sub>i</sub> C<sub>ij</sub> + A<sub>j</sub> = E<sub>j</sub></strong> — mọi thể hiện hoặc đang cấp cho ai đó, hoặc đang rảnh. Bộ mô phỏng kiểm điều này trước khi chạy và từ chối dữ liệu vi phạm (cũng là thói quen tốt khi làm đề: nếu các số không cộng khớp, bạn đã chép sai đề). So hai vector là so từng thành phần: A ≤ B nghĩa là A<sub>j</sub> ≤ B<sub>j</sub> với mọi j — (1 0 1) ≤ (2 0 1) đúng, (1 1 0) ≤ (2 0 1) sai vì thành phần thứ hai.</p>
<p>➕ Bốn cấu trúc này quay lại ở thuật toán nhà băng (slide 24), chỉ đổi một thứ: R (tiến trình đang xin gì <em>bây giờ</em>) được thay bằng "còn cần" = Max − C (nó <em>có thể</em> xin gì trong tương lai). Phân biệt rõ hai thứ này là một nửa số câu tính toán của chương thành việc quen tay.</p>
<p class="pitfall">⚠️ FE hỏi tên từng mảnh: "số thể hiện mỗi tài nguyên mà mỗi tiến trình <em>cần</em>" → <strong>ma trận yêu cầu (request matrix)</strong> (FE19#47, FE24#19); "đang chưa cấp / khả dụng" → <strong>vector tài nguyên khả dụng</strong> (FE27#9); "mỗi tiến trình đang <em>giữ</em>" → <strong>ma trận cấp phát hiện tại</strong> (FE28#27, FE29#13).</p>`],
      [17, 'Deadlock Detection with Multiple Resources of Each Type (2)',
        `<p class="y-chinh">🎯 The detection algorithm: <strong>1.</strong> look for an unmarked process P<sub>i</sub> whose row of R is ≤ A; <strong>2.</strong> if one is found, add its row of C to A, mark it, and go back to step 1; <strong>3.</strong> if none exists, stop. Every process still <strong>unmarked</strong> at the end is <strong>deadlocked</strong>.</p>
<p>The idea in one sentence: <em>pretend every process that could get what it is waiting for does get it, runs to completion and gives back everything it holds — then see who is left.</em> Step 1 asks "can this process's current request be satisfied with what is free?". If yes, it is not stuck: it will finish (we assume optimistically that it then asks for nothing more) and return its row of C, so A grows. Marking means "can finish". If at some point no unmarked process fits, the remaining ones are each waiting for something that only the others hold — exactly the definition of slide 5.</p>
<p>The optimistic assumption ("once satisfied, a process finishes without asking for more") is fine for detection: if it later asks for more and blocks, the next run of the detector will see it. Running the algorithm takes up to m × n² comparisons (n rounds, each scanning n rows of m numbers) — cheap enough to run every few seconds.</p>
<p>➕ When to run the detector? The book lists three choices: on every resource request (finds deadlocks early, costs CPU on every request), every k minutes, or when CPU utilisation drops below some threshold — a deadlock leaves processes blocked, so the CPU becomes idle. PostgreSQL uses a fourth, smarter rule: a transaction that has been waiting for a lock longer than <code>deadlock_timeout</code> (1 s by default) runs the check itself. Most lock waits end within milliseconds, so the expensive check runs only for the suspicious ones.</p>
<p class="pitfall">⚠️ FE9#46: "Every time a request cannot be granted immediately, the detection algorithm is invoked. This helps identify ___." The bank keys "the specific process that caused the deadlock"; "the set of processes that have been deadlocked" is also identified (Silberschatz names both) — a poorly-built question. Pick the bank's answer, know both.</p>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>The detection algorithm of slides 16–18: find a process whose request fits in A, let it finish, give back its allocation, repeat.</p>
<div class="os-lab os-lab-sim-deadlock os-lab-p-detect os-lab-t-deadlock-detect"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> detection with E, A, C and R <a href="/os-lab?sim=deadlock&amp;preset=detect&amp;lang=en&amp;tour=deadlock-detect" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Step the scan and write A after every process that finishes.</li><li>Find the processes that can never finish: those are the deadlocked ones.</li></ol></div>
</div>`,
        `<p class="y-chinh">🎯 Thuật toán phát hiện: <strong>1.</strong> tìm một tiến trình P<sub>i</sub> chưa đánh dấu có hàng R của nó ≤ A; <strong>2.</strong> nếu tìm thấy, cộng hàng C của nó vào A, đánh dấu nó, rồi quay lại bước 1; <strong>3.</strong> nếu không còn tiến trình nào như vậy thì dừng. Mọi tiến trình vẫn <strong>chưa được đánh dấu</strong> lúc kết thúc đều <strong>bế tắc</strong>.</p>
<p>Ý tưởng trong một câu: <em>giả sử mọi tiến trình có thể nhận được thứ nó đang chờ thì đều nhận được, chạy xong và trả lại hết những gì nó giữ — rồi xem còn ai sót lại.</em> Bước 1 hỏi "yêu cầu hiện tại của tiến trình này có được đáp ứng bằng phần đang rảnh không?". Có thì nó không kẹt: nó sẽ chạy xong (ta giả định lạc quan rằng sau đó nó không xin gì thêm) và trả lại hàng C của mình, nên A lớn lên. Đánh dấu nghĩa là "chạy xong được". Nếu tới lúc không tiến trình chưa đánh dấu nào vừa, thì những kẻ còn lại đều đang chờ thứ mà chỉ những kẻ khác trong nhóm giữ — đúng định nghĩa ở slide 5.</p>
<p>Giả định lạc quan ("đã được đáp ứng thì chạy xong, không xin thêm") là chấp nhận được với việc phát hiện: nếu về sau nó xin thêm và bị chặn, lần chạy kế tiếp của bộ dò sẽ thấy. Chạy thuật toán tốn tối đa m × n² phép so (n vòng, mỗi vòng quét n hàng m số) — đủ rẻ để chạy vài giây một lần.</p>
<p>➕ Khi nào chạy bộ dò? Sách kể ba lựa chọn: ở mỗi lần xin tài nguyên (bắt bế tắc sớm, tốn CPU ở mọi lần xin), mỗi k phút, hoặc khi mức dùng CPU tụt dưới một ngưỡng — bế tắc làm các tiến trình bị chặn nên CPU rảnh ra. PostgreSQL dùng luật thứ tư, khôn hơn: giao dịch nào đã chờ khoá lâu hơn <code>deadlock_timeout</code> (mặc định 1 giây) thì tự chạy phép kiểm. Phần lớn lần chờ khoá kết thúc trong vài mili giây, nên phép kiểm đắt chỉ chạy cho những ca đáng ngờ.</p>
<p class="pitfall">⚠️ FE9#46: "Mỗi khi một yêu cầu không được đáp ứng ngay, thuật toán phát hiện được gọi. Điều này giúp xác định ___." Ngân hàng đánh dấu "chính tiến trình đã gây ra bế tắc"; còn "tập các tiến trình đã bế tắc" cũng xác định được (Silberschatz nêu cả hai) — một câu ra đề không chặt. Chọn theo ngân hàng, nhưng biết cả hai.</p>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>Thuật toán phát hiện của slide 16–18: tìm tiến trình có yêu cầu vừa với A, cho nó xong, thu lại phần nó giữ, lặp lại.</p>
<div class="os-lab os-lab-sim-deadlock os-lab-p-detect os-lab-t-deadlock-detect"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> phát hiện với E, A, C và R <a href="/os-lab?sim=deadlock&amp;preset=detect&amp;lang=vi&amp;tour=deadlock-detect" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Bấm từng bước quét và ghi A sau mỗi tiến trình xong.</li><li>Tìm các tiến trình không bao giờ xong được: đó là các tiến trình bị bế tắc.</li></ol></div>
</div>`],
      [18, 'Deadlock Detection with Multiple Resources of Each Type (3)',
        `<p class="y-chinh">🎯 Figure 6-7: four resource types — tape drives, plotters, scanners, CD-ROMs — with E = (4 2 3 1) and A = (2 1 0 0); three processes with C and R as in the figure. Running the algorithm: process 3 can be satisfied, then process 2, then process 1 — <strong>no deadlock</strong>.</p>
<p>Check the invariant first: column sums of C are (2 1 3 1); plus A (2 1 0 0) gives (4 2 3 1) = E. Then the run, every comparison recorded by the simulator:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c11baa2b5783339f923f60d017ab0a7a9b682481.svg" alt="Figure 6-7 recomputed: P3, then P2, then P1 finish — nobody is deadlocked" loading="lazy" /><p class="chu-thich">🧮 Figure 6-7 recomputed: P3, then P2, then P1 finish — nobody is deadlocked</p></div>
<table>
<thead><tr><th>Process</th><th>C (current allocation)</th><th>R (request)</th></tr></thead>
<tbody>
<tr><td>P1</td><td>0 0 1 0</td><td>2 0 0 1</td></tr>
<tr><td>P2</td><td>2 0 0 1</td><td>1 0 1 0</td></tr>
<tr><td>P3</td><td>0 1 2 0</td><td>2 1 0 0</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-7': { E: [4, 2, 3, 1], A: [2, 1, 0, 0], C: [[0, 0, 1, 0], [2, 0, 0, 1], [0, 1, 2, 0]], R: [[2, 0, 0, 1], [1, 0, 1, 0], [2, 1, 0, 0]], ten: ['P1', 'P2', 'P3'] },
  'hinh-6-7-cd': { E: [4, 2, 3, 1], A: [2, 1, 0, 0], C: [[0, 0, 1, 0], [2, 0, 0, 1], [0, 1, 2, 0]], R: [[2, 0, 0, 1], [1, 0, 1, 0], [2, 1, 0, 1]], ten: ['P1', 'P2', 'P3'] },
  // quiz Chương 6 câu 3 — dữ liệu mới: P0 không xin gì, P3 xin đúng thứ P0 trả ⇒ chỉ P1, P2 kẹt
  quiz: { E: [7, 2, 4], A: [0, 0, 0], C: [[0, 1, 0], [2, 0, 0], [3, 0, 3], [2, 1, 1]], R: [[0, 0, 0], [0, 0, 2], [3, 0, 1], [0, 1, 0]], ten: ['P0', 'P1', 'P2', 'P3'] },
  'fe1-27': { A: [1, 1, 1], C: [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R: [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], ten: ['P1', 'P2', 'P3', 'P4'] },
};
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Ghi vết từng lần so (cả trượt), quét lại từ đầu sau mỗi lần đánh dấu — phải trùng phatHien(). */
function vet({ A, C, R }) {
  const n = C.length, dau = Array(n).fill(false), dong = [];
  let work = [...A];
  for (;;) {
    let chon = -1;
    for (let i = 0; i &lt; n; i++) {
      if (dau[i]) continue;
      if (R[i].every((x, k) =&gt; x &lt;= work[k])) { chon = i; break; }
      dong.push({ i, ok: false, A: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, k) =&gt; x + C[chon][k]);
    dong.push({ i: chon, ok: true, A: [...work], sau });
    work = sau; dau[chon] = true;
  }
  return dong;
}</code></pre></details>
<p>Process 1 asks for a CD-ROM, but A has none; process 2 asks for a scanner, none free either; process 3 asks for (2 1 0 0) — exactly A — so it runs, finishes and returns (0 1 2 0): A becomes (2 2 2 0). Now process 2's request (1 0 1 0) fits; it returns (2 0 0 1) and A = (4 2 2 1). Finally process 1's (2 0 0 1) fits. Everybody is marked: no deadlock.</p>
<p>➕ The book then changes one number: suppose process 3 also needs a CD-ROM drive. Its request becomes (2 1 0 1), and the outcome flips:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/bc400d68cb194b8b83cb0835c6df2faa01051a69.svg" alt="The variation: one extra CD-ROM request and all three processes are deadlocked" loading="lazy" /><p class="chu-thich">🧮 The variation: one extra CD-ROM request and all three processes are deadlocked</p></div>
<table>
<thead><tr><th>Process</th><th>C (current allocation)</th><th>R (request)</th></tr></thead>
<tbody>
<tr><td>P1</td><td>0 0 1 0</td><td>2 0 0 1</td></tr>
<tr><td>P2</td><td>2 0 0 1</td><td>1 0 1 0</td></tr>
<tr><td>P3</td><td>0 1 2 0</td><td>2 1 0 1</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-7': { E: [4, 2, 3, 1], A: [2, 1, 0, 0], C: [[0, 0, 1, 0], [2, 0, 0, 1], [0, 1, 2, 0]], R: [[2, 0, 0, 1], [1, 0, 1, 0], [2, 1, 0, 0]], ten: ['P1', 'P2', 'P3'] },
  'hinh-6-7-cd': { E: [4, 2, 3, 1], A: [2, 1, 0, 0], C: [[0, 0, 1, 0], [2, 0, 0, 1], [0, 1, 2, 0]], R: [[2, 0, 0, 1], [1, 0, 1, 0], [2, 1, 0, 1]], ten: ['P1', 'P2', 'P3'] },
  // quiz Chương 6 câu 3 — dữ liệu mới: P0 không xin gì, P3 xin đúng thứ P0 trả ⇒ chỉ P1, P2 kẹt
  quiz: { E: [7, 2, 4], A: [0, 0, 0], C: [[0, 1, 0], [2, 0, 0], [3, 0, 3], [2, 1, 1]], R: [[0, 0, 0], [0, 0, 2], [3, 0, 1], [0, 1, 0]], ten: ['P0', 'P1', 'P2', 'P3'] },
  'fe1-27': { A: [1, 1, 1], C: [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R: [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], ten: ['P1', 'P2', 'P3', 'P4'] },
};
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Ghi vết từng lần so (cả trượt), quét lại từ đầu sau mỗi lần đánh dấu — phải trùng phatHien(). */
function vet({ A, C, R }) {
  const n = C.length, dau = Array(n).fill(false), dong = [];
  let work = [...A];
  for (;;) {
    let chon = -1;
    for (let i = 0; i &lt; n; i++) {
      if (dau[i]) continue;
      if (R[i].every((x, k) =&gt; x &lt;= work[k])) { chon = i; break; }
      dong.push({ i, ok: false, A: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, k) =&gt; x + C[chon][k]);
    dong.push({ i: chon, ok: true, A: [...work], sau });
    work = sau; dau[chon] = true;
  }
  return dong;
}</code></pre></details>
<p>No row of R fits A = (2 1 0 0) — two need the only CD-ROM (held by process 2), one needs a scanner (all held by processes 1 and 3). Nobody can be marked; all three are deadlocked. One instance more or less decides between "fine" and "frozen" — which is why exam questions on this algorithm must be computed, not guessed.</p>
<p class="pitfall">⚠️ FE1#27 (SU26-RE, the newest paper) is this algorithm in disguise: four processes, three resource types, "Allocated" and "Requested" matrices, Available (1 1 1), "is the system in a safe state?". Run it: P2 (1 1 1) fits → A = (3 2 1); P1, P3, P4 follow → everyone can finish → <strong>"Yes, it's safe"</strong>, as the bank says. (Strictly, "safe" is a word of the banker's algorithm; with a request matrix the right word is "not deadlocked" — same computation.)</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d8cede7b89482b6625f6de0e16c322eb35e9654f.svg" alt="FE1#27 checked: all four processes can finish" loading="lazy" /><p class="chu-thich">🧮 FE1#27 checked: all four processes can finish</p></div>
<table>
<thead><tr><th>Process</th><th>C (current allocation)</th><th>R (request)</th></tr></thead>
<tbody>
<tr><td>P1</td><td>1 0 1</td><td>2 0 0</td></tr>
<tr><td>P2</td><td>2 1 0</td><td>1 1 1</td></tr>
<tr><td>P3</td><td>0 2 2</td><td>2 1 0</td></tr>
<tr><td>P4</td><td>1 0 1</td><td>0 2 1</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-7': { E: [4, 2, 3, 1], A: [2, 1, 0, 0], C: [[0, 0, 1, 0], [2, 0, 0, 1], [0, 1, 2, 0]], R: [[2, 0, 0, 1], [1, 0, 1, 0], [2, 1, 0, 0]], ten: ['P1', 'P2', 'P3'] },
  'hinh-6-7-cd': { E: [4, 2, 3, 1], A: [2, 1, 0, 0], C: [[0, 0, 1, 0], [2, 0, 0, 1], [0, 1, 2, 0]], R: [[2, 0, 0, 1], [1, 0, 1, 0], [2, 1, 0, 1]], ten: ['P1', 'P2', 'P3'] },
  // quiz Chương 6 câu 3 — dữ liệu mới: P0 không xin gì, P3 xin đúng thứ P0 trả ⇒ chỉ P1, P2 kẹt
  quiz: { E: [7, 2, 4], A: [0, 0, 0], C: [[0, 1, 0], [2, 0, 0], [3, 0, 3], [2, 1, 1]], R: [[0, 0, 0], [0, 0, 2], [3, 0, 1], [0, 1, 0]], ten: ['P0', 'P1', 'P2', 'P3'] },
  'fe1-27': { A: [1, 1, 1], C: [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R: [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], ten: ['P1', 'P2', 'P3', 'P4'] },
};
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Ghi vết từng lần so (cả trượt), quét lại từ đầu sau mỗi lần đánh dấu — phải trùng phatHien(). */
function vet({ A, C, R }) {
  const n = C.length, dau = Array(n).fill(false), dong = [];
  let work = [...A];
  for (;;) {
    let chon = -1;
    for (let i = 0; i &lt; n; i++) {
      if (dau[i]) continue;
      if (R[i].every((x, k) =&gt; x &lt;= work[k])) { chon = i; break; }
      dong.push({ i, ok: false, A: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, k) =&gt; x + C[chon][k]);
    dong.push({ i: chon, ok: true, A: [...work], sau });
    work = sau; dau[chon] = true;
  }
  return dong;
}</code></pre></details>`,
        `<p class="y-chinh">🎯 Hình 6-7: bốn loại tài nguyên — ổ băng từ, máy vẽ, máy quét, ổ CD-ROM — với E = (4 2 3 1) và A = (2 1 0 0); ba tiến trình có C và R như trong hình. Chạy thuật toán: tiến trình 3 được đáp ứng, rồi tiến trình 2, rồi tiến trình 1 — <strong>không bế tắc</strong>.</p>
<p>Kiểm bất biến trước: tổng từng cột của C là (2 1 3 1); cộng A (2 1 0 0) được (4 2 3 1) = E. Rồi chạy, mọi phép so đều được bộ mô phỏng ghi lại:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/254680b1af6242840ab2dee1af87d2ab3cf27b87.svg" alt="Tính lại Hình 6-7: P3, rồi P2, rồi P1 chạy xong — không ai bế tắc" loading="lazy" /><p class="chu-thich">🧮 Tính lại Hình 6-7: P3, rồi P2, rồi P1 chạy xong — không ai bế tắc</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>C (đang được cấp)</th><th>R (đang xin)</th></tr></thead>
<tbody>
<tr><td>P1</td><td>0 0 1 0</td><td>2 0 0 1</td></tr>
<tr><td>P2</td><td>2 0 0 1</td><td>1 0 1 0</td></tr>
<tr><td>P3</td><td>0 1 2 0</td><td>2 1 0 0</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-7': { E: [4, 2, 3, 1], A: [2, 1, 0, 0], C: [[0, 0, 1, 0], [2, 0, 0, 1], [0, 1, 2, 0]], R: [[2, 0, 0, 1], [1, 0, 1, 0], [2, 1, 0, 0]], ten: ['P1', 'P2', 'P3'] },
  'hinh-6-7-cd': { E: [4, 2, 3, 1], A: [2, 1, 0, 0], C: [[0, 0, 1, 0], [2, 0, 0, 1], [0, 1, 2, 0]], R: [[2, 0, 0, 1], [1, 0, 1, 0], [2, 1, 0, 1]], ten: ['P1', 'P2', 'P3'] },
  // quiz Chương 6 câu 3 — dữ liệu mới: P0 không xin gì, P3 xin đúng thứ P0 trả ⇒ chỉ P1, P2 kẹt
  quiz: { E: [7, 2, 4], A: [0, 0, 0], C: [[0, 1, 0], [2, 0, 0], [3, 0, 3], [2, 1, 1]], R: [[0, 0, 0], [0, 0, 2], [3, 0, 1], [0, 1, 0]], ten: ['P0', 'P1', 'P2', 'P3'] },
  'fe1-27': { A: [1, 1, 1], C: [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R: [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], ten: ['P1', 'P2', 'P3', 'P4'] },
};
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Ghi vết từng lần so (cả trượt), quét lại từ đầu sau mỗi lần đánh dấu — phải trùng phatHien(). */
function vet({ A, C, R }) {
  const n = C.length, dau = Array(n).fill(false), dong = [];
  let work = [...A];
  for (;;) {
    let chon = -1;
    for (let i = 0; i &lt; n; i++) {
      if (dau[i]) continue;
      if (R[i].every((x, k) =&gt; x &lt;= work[k])) { chon = i; break; }
      dong.push({ i, ok: false, A: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, k) =&gt; x + C[chon][k]);
    dong.push({ i: chon, ok: true, A: [...work], sau });
    work = sau; dau[chon] = true;
  }
  return dong;
}</code></pre></details>
<p>Tiến trình 1 xin một ổ CD-ROM, nhưng A không còn cái nào; tiến trình 2 xin một máy quét, cũng không còn; tiến trình 3 xin (2 1 0 0) — đúng bằng A — nên nó chạy, xong và trả (0 1 2 0): A thành (2 2 2 0). Giờ yêu cầu (1 0 1 0) của tiến trình 2 vừa; nó trả (2 0 0 1) và A = (4 2 2 1). Cuối cùng (2 0 0 1) của tiến trình 1 vừa. Ai cũng được đánh dấu: không bế tắc.</p>
<p>➕ Sách sau đó đổi một con số: giả sử tiến trình 3 cần thêm một ổ CD-ROM. Yêu cầu của nó thành (2 1 0 1), và kết quả lật ngược:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b136492526249481e6ca5f1364618c5ab3c32c5f.svg" alt="Biến thể: thêm một yêu cầu CD-ROM là cả ba tiến trình bế tắc" loading="lazy" /><p class="chu-thich">🧮 Biến thể: thêm một yêu cầu CD-ROM là cả ba tiến trình bế tắc</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>C (đang được cấp)</th><th>R (đang xin)</th></tr></thead>
<tbody>
<tr><td>P1</td><td>0 0 1 0</td><td>2 0 0 1</td></tr>
<tr><td>P2</td><td>2 0 0 1</td><td>1 0 1 0</td></tr>
<tr><td>P3</td><td>0 1 2 0</td><td>2 1 0 1</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-7': { E: [4, 2, 3, 1], A: [2, 1, 0, 0], C: [[0, 0, 1, 0], [2, 0, 0, 1], [0, 1, 2, 0]], R: [[2, 0, 0, 1], [1, 0, 1, 0], [2, 1, 0, 0]], ten: ['P1', 'P2', 'P3'] },
  'hinh-6-7-cd': { E: [4, 2, 3, 1], A: [2, 1, 0, 0], C: [[0, 0, 1, 0], [2, 0, 0, 1], [0, 1, 2, 0]], R: [[2, 0, 0, 1], [1, 0, 1, 0], [2, 1, 0, 1]], ten: ['P1', 'P2', 'P3'] },
  // quiz Chương 6 câu 3 — dữ liệu mới: P0 không xin gì, P3 xin đúng thứ P0 trả ⇒ chỉ P1, P2 kẹt
  quiz: { E: [7, 2, 4], A: [0, 0, 0], C: [[0, 1, 0], [2, 0, 0], [3, 0, 3], [2, 1, 1]], R: [[0, 0, 0], [0, 0, 2], [3, 0, 1], [0, 1, 0]], ten: ['P0', 'P1', 'P2', 'P3'] },
  'fe1-27': { A: [1, 1, 1], C: [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R: [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], ten: ['P1', 'P2', 'P3', 'P4'] },
};
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Ghi vết từng lần so (cả trượt), quét lại từ đầu sau mỗi lần đánh dấu — phải trùng phatHien(). */
function vet({ A, C, R }) {
  const n = C.length, dau = Array(n).fill(false), dong = [];
  let work = [...A];
  for (;;) {
    let chon = -1;
    for (let i = 0; i &lt; n; i++) {
      if (dau[i]) continue;
      if (R[i].every((x, k) =&gt; x &lt;= work[k])) { chon = i; break; }
      dong.push({ i, ok: false, A: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, k) =&gt; x + C[chon][k]);
    dong.push({ i: chon, ok: true, A: [...work], sau });
    work = sau; dau[chon] = true;
  }
  return dong;
}</code></pre></details>
<p>Không hàng nào của R vừa A = (2 1 0 0) — hai hàng cần ổ CD-ROM duy nhất (tiến trình 2 đang giữ), một hàng cần máy quét (tiến trình 1 và 3 giữ hết). Không ai được đánh dấu; cả ba bế tắc. Hơn kém đúng một thể hiện quyết định giữa "ổn" và "đứng hình" — vì vậy câu thi về thuật toán này phải tính, không được đoán.</p>
<p class="pitfall">⚠️ FE1#27 (SU26-RE, đề mới nhất) chính là thuật toán này trá hình: bốn tiến trình, ba loại tài nguyên, ma trận "Allocated" và "Requested", Available (1 1 1), "hệ thống có ở trạng thái an toàn không?". Chạy thử: P2 (1 1 1) vừa → A = (3 2 1); P1, P3, P4 lần lượt theo sau → ai cũng chạy xong → <strong>"Yes, it's safe"</strong>, đúng như ngân hàng. (Nói chặt, "an toàn" là chữ của thuật toán nhà băng; với ma trận yêu cầu thì chữ đúng là "không bế tắc" — cùng một phép tính.)</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fa37df360c3320bae314795b920f9740c51df015.svg" alt="Kiểm FE1#27: cả bốn tiến trình đều chạy xong được" loading="lazy" /><p class="chu-thich">🧮 Kiểm FE1#27: cả bốn tiến trình đều chạy xong được</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>C (đang được cấp)</th><th>R (đang xin)</th></tr></thead>
<tbody>
<tr><td>P1</td><td>1 0 1</td><td>2 0 0</td></tr>
<tr><td>P2</td><td>2 1 0</td><td>1 1 1</td></tr>
<tr><td>P3</td><td>0 2 2</td><td>2 1 0</td></tr>
<tr><td>P4</td><td>1 0 1</td><td>0 2 1</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-7': { E: [4, 2, 3, 1], A: [2, 1, 0, 0], C: [[0, 0, 1, 0], [2, 0, 0, 1], [0, 1, 2, 0]], R: [[2, 0, 0, 1], [1, 0, 1, 0], [2, 1, 0, 0]], ten: ['P1', 'P2', 'P3'] },
  'hinh-6-7-cd': { E: [4, 2, 3, 1], A: [2, 1, 0, 0], C: [[0, 0, 1, 0], [2, 0, 0, 1], [0, 1, 2, 0]], R: [[2, 0, 0, 1], [1, 0, 1, 0], [2, 1, 0, 1]], ten: ['P1', 'P2', 'P3'] },
  // quiz Chương 6 câu 3 — dữ liệu mới: P0 không xin gì, P3 xin đúng thứ P0 trả ⇒ chỉ P1, P2 kẹt
  quiz: { E: [7, 2, 4], A: [0, 0, 0], C: [[0, 1, 0], [2, 0, 0], [3, 0, 3], [2, 1, 1]], R: [[0, 0, 0], [0, 0, 2], [3, 0, 1], [0, 1, 0]], ten: ['P0', 'P1', 'P2', 'P3'] },
  'fe1-27': { A: [1, 1, 1], C: [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R: [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], ten: ['P1', 'P2', 'P3', 'P4'] },
};
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Ghi vết từng lần so (cả trượt), quét lại từ đầu sau mỗi lần đánh dấu — phải trùng phatHien(). */
function vet({ A, C, R }) {
  const n = C.length, dau = Array(n).fill(false), dong = [];
  let work = [...A];
  for (;;) {
    let chon = -1;
    for (let i = 0; i &lt; n; i++) {
      if (dau[i]) continue;
      if (R[i].every((x, k) =&gt; x &lt;= work[k])) { chon = i; break; }
      dong.push({ i, ok: false, A: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, k) =&gt; x + C[chon][k]);
    dong.push({ i: chon, ok: true, A: [...work], sau });
    work = sau; dau[chon] = true;
  }
  return dong;
}</code></pre></details>`],
      [19, 'Recovery from Deadlock',
        `<p class="y-chinh">🎯 Once a deadlock is detected, three ways to recover — none of them attractive: <strong>1. preemption</strong> — take a resource away from its owner and give it to another; <strong>2. rollback</strong> — return a process to an earlier checkpoint, releasing what it acquired since; <strong>3. killing processes</strong> — kill one or more processes until the cycle is broken.</p>
<p><strong>Preemption</strong> means breaking condition 3 by force. Sometimes it is possible with manual intervention (an operator takes the printer away, saves the pages printed so far, gives it back later), but for most nonpreemptable resources it is not — that is what "nonpreemptable" means. <strong>Rollback</strong> needs <em>checkpoints</em>: the process's state (memory image and resource state) is periodically saved to a file, new checkpoints are written, old ones kept. On deadlock, a process that owns a needed resource is rolled back to a point before it acquired that resource; work done since is lost. <strong>Killing</strong> is the crudest but simplest: kill a process in the cycle and hope the others can go on; or kill one outside the cycle that holds what the cycle needs. Choose the victim carefully: a process that can be rerun from the start with no ill effects (a compilation) is a good victim; a process that updates a database (e.g. "add 1 to a field") cannot always safely be run a second time.</p>
<p>➕ Databases combine all three, and do it well, because a <strong>transaction</strong> is built to be undone: PostgreSQL picks a victim, <em>aborts</em> it (killing the transaction, not the process), undoes its changes (rollback), and that releases its row locks (preemption in effect). The victim gets an error and the application can simply retry. Real output from the PostgreSQL course (two psql sessions, PostgreSQL 17.11):</p>
<pre><code class="language-plaintext">A│ ERROR:  deadlock detected
A│ DETAIL:  Process 4328 waits for ShareLock on transaction 773; blocked by process 4329.
A│ Process 4329 waits for ShareLock on transaction 772; blocked by process 4328.
A│ HINT:  See server log for query details.
A│ CONTEXT:  while updating tuple (0,18) in relation "accounts"
B│ UPDATE 1</code></pre>
<p>The DETAIL is the cycle, printed for humans: process 4328 waits for 4329 and 4329 waits for 4328. The SQLSTATE of this error is <code>40P01</code>; Spring translates it into a <code>PessimisticLockingFailureException</code> subclass, and the standard pattern is "retry the whole transaction a few times". Details and the full two-session run: course <code>/courses/postgresql</code>, Chapter 11.</p>
<p>The Linux kernel itself detects one kind of deadlock — POSIX record locks taken with <code>fcntl(F_SETLKW)</code> — and recovers by making one of the blocking requests fail with <code>EDEADLK</code> (fcntl(2): "the kernel … causes one of the blocking lock requests to immediately fail"). Two processes locking two bytes of a file in opposite orders:</p>
<pre><code class="language-c">// The Linux kernel DOES detect one kind of deadlock: POSIX record locks taken with fcntl(F_SETLKW)
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int lock_byte(int fd, int byte) {                       // block until byte &#96;byte&#96; of the file is ours
    struct flock fl = { .l_type = F_WRLCK, .l_whence = SEEK_SET, .l_start = byte, .l_len = 1 };
    return fcntl(fd, F_SETLKW, &amp;fl);
}

int main(void) {
    int fd = open("accounts.db", O_RDWR | O_CREAT, 0644);
    write(fd, "AB", 2);                                 // byte 0 = account A, byte 1 = account B
    int go[2]; pipe(go);
    pid_t child = fork();
    if (child == 0) {                                   // process 2: locks B, then wants A
        lock_byte(fd, 1);
        printf("process 2: holds B, asks for A\\n"); fflush(stdout);
        write(go[1], "x", 1);
        usleep(300 * 1000);                             // let process 1 block on B first
        if (lock_byte(fd, 0) &lt; 0)
            printf("process 2: fcntl -&gt; %s: the kernel found the cycle and picked me as the victim\\n", errno == EDEADLK ? "EDEADLK" : strerror(errno));
        printf("process 2: rolls back and exits (its locks are released)\\n"); fflush(stdout);
        _exit(0);                                       // closing the file drops its locks
    }
    char c; read(go[0], &amp;c, 1);
    lock_byte(fd, 0);                                   // process 1: locks A ...
    printf("process 1: holds A, asks for B (blocks)\\n"); fflush(stdout);
    lock_byte(fd, 1);                                   // ... and waits for B
    waitpid(child, NULL, 0);
    printf("process 1: got B after the victim left — finished\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread fcntl-phat-hien.c -o fcntl-phat-hien &amp;&amp; ./fcntl-phat-hien<br>
process 2: holds B, asks for A<br>
process 1: holds A, asks for B (blocks)<br>
process 2: fcntl -&gt; EDEADLK: the kernel found the cycle and picked me as the victim<br>
process 2: rolls back and exits (its locks are released)<br>
process 1: got B after the victim left — finished</div>
<p>The kernel found the cycle and chose process 2 as the victim; process 2 "rolled back" (gave up and exited, which released its lock), and process 1 finished. Limits documented on man7.org: the search is at most 10 steps deep, it can give false positives, and the newer OFD locks get no detection at all.</p>
<p class="pitfall">⚠️ FE: ways to recover → preempt, rollback, kill — <strong>"All of the other choices"</strong> (FE20#26, FE23#2, FE26#33); NOT a way to recover → <strong>"Locks one of the processes"</strong> (FE19#38, FE24#43, FE27#29); the simplest way to break a deadlock → <strong>kill one of the processes</strong> (FE28#8, FE29#41); least impact on performance but may cause inconsistency → <strong>preempting resources</strong> (FE3#47). FE9#45 keys "rollback" for "can lead to inconsistency when re-executed" — the book ties that risk to <em>killing</em> a process that updates a database, so the question is ambiguous.</p>`,
        `<p class="y-chinh">🎯 Khi đã phát hiện bế tắc, có ba cách khôi phục — chẳng cách nào dễ chịu: <strong>1. trưng dụng (preemption)</strong> — lấy một tài nguyên khỏi chủ của nó để đưa cho kẻ khác; <strong>2. quay lui (rollback)</strong> — đưa một tiến trình về một điểm kiểm tra (checkpoint) trước đó, nhả những gì nó lấy từ sau điểm đó; <strong>3. giết tiến trình</strong> — giết một hay nhiều tiến trình cho tới khi chu trình bị phá.</p>
<p><strong>Trưng dụng</strong> nghĩa là phá điều kiện 3 bằng vũ lực. Đôi khi làm được nhờ can thiệp bằng tay (người vận hành lấy máy in đi, cất các trang đã in, rồi trả lại sau), nhưng với phần lớn tài nguyên không trưng dụng được thì không làm được — đó chính là nghĩa của "không trưng dụng được". <strong>Quay lui</strong> cần các <em>checkpoint</em>: trạng thái của tiến trình (ảnh bộ nhớ và trạng thái tài nguyên) được định kỳ ghi ra tệp, checkpoint mới được ghi thêm, cái cũ vẫn giữ. Khi bế tắc, một tiến trình đang giữ tài nguyên cần thiết bị đưa về thời điểm trước khi nó lấy tài nguyên đó; phần việc làm từ đó tới giờ bị mất. <strong>Giết</strong> là thô bạo nhất nhưng đơn giản nhất: giết một tiến trình trong vòng và mong những kẻ còn lại đi tiếp được; hoặc giết một tiến trình ngoài vòng đang giữ thứ vòng cần. Chọn nạn nhân phải cẩn thận: một tiến trình chạy lại từ đầu mà không hại gì (một lần biên dịch) là nạn nhân tốt; một tiến trình cập nhật cơ sở dữ liệu (vd "cộng 1 vào một trường") không phải lúc nào cũng chạy lại lần hai một cách an toàn.</p>
<p>➕ Cơ sở dữ liệu kết hợp cả ba, và làm tốt, vì <strong>giao dịch (transaction)</strong> sinh ra là để hoàn tác được: PostgreSQL chọn một nạn nhân, <em>huỷ</em> nó (giết giao dịch, không giết tiến trình), hoàn tác các thay đổi của nó (rollback), và việc đó nhả các khoá dòng của nó (thực chất là trưng dụng). Nạn nhân nhận một lỗi và ứng dụng chỉ việc thử lại. Output thật từ khoá học PostgreSQL (hai phiên psql, PostgreSQL 17.11):</p>
<pre><code class="language-plaintext">A│ ERROR:  deadlock detected
A│ DETAIL:  Process 4328 waits for ShareLock on transaction 773; blocked by process 4329.
A│ Process 4329 waits for ShareLock on transaction 772; blocked by process 4328.
A│ HINT:  See server log for query details.
A│ CONTEXT:  while updating tuple (0,18) in relation "accounts"
B│ UPDATE 1</code></pre>
<p>Dòng DETAIL chính là chu trình, in ra cho người đọc: tiến trình 4328 chờ 4329 và 4329 chờ 4328. SQLSTATE của lỗi này là <code>40P01</code>; Spring dịch nó thành một lớp con của <code>PessimisticLockingFailureException</code>, và mẫu chuẩn là "thử lại cả giao dịch vài lần". Chi tiết và toàn bộ lượt chạy hai phiên: khoá <code>/courses/postgresql</code>, Chương 11.</p>
<p>Chính nhân Linux cũng phát hiện một loại bế tắc — khoá bản ghi POSIX lấy bằng <code>fcntl(F_SETLKW)</code> — và khôi phục bằng cách cho một trong các yêu cầu đang bị chặn thất bại với <code>EDEADLK</code> (fcntl(2): "nhân … khiến một trong các yêu cầu khoá đang bị chặn thất bại ngay lập tức"). Hai tiến trình khoá hai byte của một tệp theo thứ tự ngược nhau:</p>
<pre><code class="language-c">// Nhân Linux CÓ phát hiện một loại bế tắc: khoá bản ghi POSIX lấy bằng fcntl(F_SETLKW)
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int lock_byte(int fd, int byte) {                       // chặn cho tới khi byte &#96;byte&#96; của tệp là của mình
    struct flock fl = { .l_type = F_WRLCK, .l_whence = SEEK_SET, .l_start = byte, .l_len = 1 };
    return fcntl(fd, F_SETLKW, &amp;fl);
}

int main(void) {
    int fd = open("accounts.db", O_RDWR | O_CREAT, 0644);
    write(fd, "AB", 2);                                 // byte 0 = tài khoản A, byte 1 = tài khoản B
    int go[2]; pipe(go);
    pid_t child = fork();
    if (child == 0) {                                   // tiến trình 2: khoá B, rồi muốn A
        lock_byte(fd, 1);
        printf("process 2: holds B, asks for A\\n"); fflush(stdout);
        write(go[1], "x", 1);
        usleep(300 * 1000);                             // để tiến trình 1 bị chặn ở B trước
        if (lock_byte(fd, 0) &lt; 0)
            printf("process 2: fcntl -&gt; %s: the kernel found the cycle and picked me as the victim\\n", errno == EDEADLK ? "EDEADLK" : strerror(errno));
        printf("process 2: rolls back and exits (its locks are released)\\n"); fflush(stdout);
        _exit(0);                                       // đóng tệp là nhả khoá
    }
    char c; read(go[0], &amp;c, 1);
    lock_byte(fd, 0);                                   // tiến trình 1: khoá A ...
    printf("process 1: holds A, asks for B (blocks)\\n"); fflush(stdout);
    lock_byte(fd, 1);                                   // ... rồi chờ B
    waitpid(child, NULL, 0);
    printf("process 1: got B after the victim left — finished\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread fcntl-phat-hien.c -o fcntl-phat-hien &amp;&amp; ./fcntl-phat-hien<br>
process 2: holds B, asks for A<br>
process 1: holds A, asks for B (blocks)<br>
process 2: fcntl -&gt; EDEADLK: the kernel found the cycle and picked me as the victim<br>
process 2: rolls back and exits (its locks are released)<br>
process 1: got B after the victim left — finished</div>
<p>Nhân tìm ra chu trình và chọn tiến trình 2 làm nạn nhân; tiến trình 2 "quay lui" (bỏ cuộc và thoát, việc đó nhả khoá của nó), và tiến trình 1 chạy xong. Giới hạn ghi trên man7.org: phép tìm sâu tối đa 10 bước, có thể báo nhầm (dương tính giả), và loại khoá OFD mới hơn thì hoàn toàn không được phát hiện.</p>
<p class="pitfall">⚠️ FE: các cách khôi phục → trưng dụng, quay lui, giết — <strong>"All of the other choices"</strong> (FE20#26, FE23#2, FE26#33); KHÔNG phải cách khôi phục → <strong>"Locks one of the processes"</strong> (FE19#38, FE24#43, FE27#29); cách đơn giản nhất để phá bế tắc → <strong>giết một tiến trình</strong> (FE28#8, FE29#41); ít ảnh hưởng hiệu năng nhất nhưng có thể gây mất nhất quán → <strong>trưng dụng tài nguyên</strong> (FE3#47). FE9#45 đánh dấu "rollback" cho "có thể gây mất nhất quán khi chạy lại" — sách gắn nguy cơ đó với việc <em>giết</em> một tiến trình cập nhật cơ sở dữ liệu, nên câu này mơ hồ.</p>`],
      [20, 'Deadlock AvoidanceResource Trajectories',
        `<p class="y-chinh">🎯 Figure 6-8 (Dijkstra): the horizontal axis is the number of instructions process A has executed, the vertical axis the number B has executed. A uses the printer from I1 to I3 and the plotter from I2 to I4; B uses the plotter from I5 to I7 and the printer from I6 to I8. The shaded regions are impossible (both would hold the same device). The <strong>box between I1–I2 and I5–I6 is unsafe</strong>: entering it leads to a deadlock at (I2, I6).</p>
<p>On a single CPU the system's state is a point moving right (A runs) or up (B runs), never diagonally and never backwards. The path p → q → r → s → t of the figure is one possible schedule. At t, B asks for the plotter. If the OS grants it, the point enters the box: A holds the printer and will soon need the plotter, B holds the plotter and will soon need the printer — whichever runs, it reaches the corner (I2, I6), where both are blocked. Nothing in the box is a deadlock yet, but every path from it leads to one. The only safe decision at t is to refuse B's request and run A until it has passed I4 (released the plotter); after that any path to u (both finished) is fine.</p>
<p>The simulator computes the regions instead of copying them: on a grid it marks every point from which <em>no</em> right/up path can reach u without entering a shaded region — dynamic programming backwards from u. The result is exactly the book's box:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7c0ae337ff738d44d67241fdc993c5015c9a12d4.svg" alt="Figure 6-8 recomputed: the unsafe box is found by search, and the drawn trajectory never enters it" loading="lazy" /><p class="chu-thich">🧮 Figure 6-8 recomputed: the unsafe box is found by search, and the drawn trajectory never enters it</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const I = { I1: 2, I2: 3, I3: 4, I4: 5, I5: 2, I6: 3, I7: 4, I8: 5 }, HET = 7, B_ = 0.5;
const CAM = [
  { x0: I.I1, x1: I.I3, y0: I.I6, y1: I.I8, ten: 'printer' },   // cả hai giữ máy in
  { x0: I.I2, x1: I.I4, y0: I.I5, y1: I.I7, ten: 'plotter' },   // cả hai giữ máy vẽ
];
const cam = (x, y) =&gt; CAM.some((r) =&gt; x &gt; r.x0 &amp;&amp; x &lt; r.x1 &amp;&amp; y &gt; r.y0 &amp;&amp; y &lt; r.y1);
function phanLoai() {
  const n = Math.round(HET / B_);
  const ok = Array.from({ length: n + 1 }, () =&gt; Array(n + 1).fill(false));
  for (let i = n; i &gt;= 0; i--) for (let j = n; j &gt;= 0; j--) {
    const x = i * B_, y = j * B_;
    if (cam(x, y)) continue;
    ok[i][j] = (i === n &amp;&amp; j === n) || (i &lt; n &amp;&amp; ok[i + 1][j]) || (j &lt; n &amp;&amp; ok[i][j + 1]);
  }
  const khongAnToan = [];
  for (let i = 0; i &lt;= n; i++) for (let j = 0; j &lt;= n; j++) if (!cam(i * B_, j * B_) &amp;&amp; !ok[i][j]) khongAnToan.push([i * B_, j * B_]);
  return { ok, khongAnToan, n };
}
const QUY_DAO = [['p', 0, 0], ['q', 1, 0], ['r', 1, 1.5], ['s', 2.5, 1.5], ['t', 2.5, 2], ['', 5, 2], ['', 5, 7], ['u', 7, 7]];</code></pre></details>
<p>➕ This picture contains the whole idea of avoidance: a <em>deadlock</em> is a point where nobody can move; an <em>unsafe</em> state is a point from which a deadlock is unavoidable if the processes go on as planned; the OS's job is to keep the point out of unsafe states by choosing who runs and whom to refuse. The trajectory picture only works for two processes and two resources, which is why the next slides replace it with tables.</p>
<p class="meo">🧠 Notice the cost: at t the plotter is free and B asks for it, yet B is told to wait. Avoidance often refuses requests that could be granted — it trades utilisation for certainty.</p>`,
        `<p class="y-chinh">🎯 Hình 6-8 (Dijkstra): trục ngang là số lệnh tiến trình A đã chạy, trục dọc là số lệnh B đã chạy. A dùng máy in từ I1 tới I3 và máy vẽ từ I2 tới I4; B dùng máy vẽ từ I5 tới I7 và máy in từ I6 tới I8. Các vùng tô là không thể xảy ra (cả hai cùng giữ một thiết bị). <strong>Hộp giữa I1–I2 và I5–I6 là không an toàn</strong>: đi vào đó là dẫn tới bế tắc ở (I2, I6).</p>
<p>Trên một CPU, trạng thái hệ thống là một điểm đi sang phải (A chạy) hoặc đi lên (B chạy), không bao giờ đi chéo và không bao giờ lùi. Đường p → q → r → s → t của hình là một lịch chạy có thể có. Tại t, B xin máy vẽ. Nếu HĐH cấp, điểm đi vào hộp: A giữ máy in và sắp cần máy vẽ, B giữ máy vẽ và sắp cần máy in — ai chạy thì cũng tới góc (I2, I6), nơi cả hai đều bị chặn. Bên trong hộp chưa có chỗ nào là bế tắc, nhưng mọi đường đi từ đó đều dẫn tới bế tắc. Quyết định an toàn duy nhất tại t là từ chối yêu cầu của B và cho A chạy cho tới khi qua I4 (trả máy vẽ); sau đó đường nào tới u (cả hai xong) cũng ổn.</p>
<p>Bộ mô phỏng tính các vùng thay vì chép lại: trên một lưới, nó đánh dấu mọi điểm mà từ đó <em>không</em> đường nào đi phải/lên tới được u mà không lọt vào vùng tô — quy hoạch động ngược từ u. Kết quả đúng là cái hộp của sách:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/64a02a47d4a611fe319db890053813085f6ef479.svg" alt="Tính lại Hình 6-8: hộp không an toàn do phép tìm kiếm tìm ra, và quỹ đạo vẽ ra không bao giờ đi vào nó" loading="lazy" /><p class="chu-thich">🧮 Tính lại Hình 6-8: hộp không an toàn do phép tìm kiếm tìm ra, và quỹ đạo vẽ ra không bao giờ đi vào nó</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const I = { I1: 2, I2: 3, I3: 4, I4: 5, I5: 2, I6: 3, I7: 4, I8: 5 }, HET = 7, B_ = 0.5;
const CAM = [
  { x0: I.I1, x1: I.I3, y0: I.I6, y1: I.I8, ten: 'printer' },   // cả hai giữ máy in
  { x0: I.I2, x1: I.I4, y0: I.I5, y1: I.I7, ten: 'plotter' },   // cả hai giữ máy vẽ
];
const cam = (x, y) =&gt; CAM.some((r) =&gt; x &gt; r.x0 &amp;&amp; x &lt; r.x1 &amp;&amp; y &gt; r.y0 &amp;&amp; y &lt; r.y1);
function phanLoai() {
  const n = Math.round(HET / B_);
  const ok = Array.from({ length: n + 1 }, () =&gt; Array(n + 1).fill(false));
  for (let i = n; i &gt;= 0; i--) for (let j = n; j &gt;= 0; j--) {
    const x = i * B_, y = j * B_;
    if (cam(x, y)) continue;
    ok[i][j] = (i === n &amp;&amp; j === n) || (i &lt; n &amp;&amp; ok[i + 1][j]) || (j &lt; n &amp;&amp; ok[i][j + 1]);
  }
  const khongAnToan = [];
  for (let i = 0; i &lt;= n; i++) for (let j = 0; j &lt;= n; j++) if (!cam(i * B_, j * B_) &amp;&amp; !ok[i][j]) khongAnToan.push([i * B_, j * B_]);
  return { ok, khongAnToan, n };
}
const QUY_DAO = [['p', 0, 0], ['q', 1, 0], ['r', 1, 1.5], ['s', 2.5, 1.5], ['t', 2.5, 2], ['', 5, 2], ['', 5, 7], ['u', 7, 7]];</code></pre></details>
<p>➕ Bức hình này chứa trọn ý tưởng của việc tránh bế tắc: <em>bế tắc</em> là một điểm mà không ai đi tiếp được; trạng thái <em>không an toàn</em> là một điểm mà từ đó bế tắc là không tránh khỏi nếu các tiến trình cứ chạy theo kế hoạch; việc của HĐH là giữ điểm đó ngoài vùng không an toàn bằng cách chọn ai được chạy và từ chối ai. Bức hình quỹ đạo chỉ dùng được cho hai tiến trình và hai tài nguyên, vì vậy các slide sau thay nó bằng bảng.</p>
<p class="meo">🧠 Để ý cái giá: tại t máy vẽ đang rảnh và B xin nó, vậy mà B bị bảo chờ. Tránh bế tắc thường từ chối những yêu cầu lẽ ra cấp được — nó đổi hiệu suất sử dụng lấy sự chắc chắn.</p>`],
      [21, 'Safe and Unsafe States (1)',
        `<p class="y-chinh">🎯 Figure 6-9: a state is <strong>safe</strong> if there is <em>some scheduling order</em> in which every process can run to completion, even if all of them suddenly request their maximum number of resources immediately. State (a): 10 instances in total, A has 3 of max 9, B has 2 of max 4, C has 2 of max 7, 3 free — safe, as (b)–(e) demonstrate: B, then C, then A.</p>
<p>A state here is the table "Has / Max / Free". Max is a promise each process made in advance: "I will never need more than this". The proof of safety is a schedule: give B the 2 it may still need (Free 1, B has 4 = its max), B finishes and returns 4 (Free 5); now C may need 5 more — give them (Free 0), C finishes (Free 7); now A can get its 6. Every process finished, so (a) is safe. The simulator does the same search and prints every step as a small table, exactly like the figure:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/0c1decc50c62aa14ffaccd25417d47472100a496.svg" alt="Figure 6-9 recomputed: B, then C, then A — the state is safe" loading="lazy" /><p class="chu-thich">🧮 Figure 6-9 recomputed: B, then C, then A — the state is safe</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-9': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3 },
  'hinh-6-10': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3, capTruoc: { i: 0, so: 1 } },
  'fe2-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [8, 6, 5], free: 5 },
  'fe3-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [6, 5, 7], free: 0 },
};
const HINH_6_11 = [
  { nhan: '(a)', has: [0, 0, 0, 0], max: [6, 5, 4, 7], free: 10 },
  { nhan: '(b)', has: [1, 1, 2, 4], max: [6, 5, 4, 7], free: 2 },
  { nhan: '(c)', has: [1, 2, 2, 4], max: [6, 5, 4, 7], free: 1 },
];

/** Dựng dãy bảng: với mỗi tiến trình thuật toán chọn — (1) nó nhận đủ phần còn thiếu, (2) nó chạy xong và trả hết. */
function trinhDien({ ten, has, max, free, capTruoc }, t) {
  const st = { has: [...has], max: [...max], free };
  const buoc = [];
  const chup = (ghi, toMau = -1, xau = false) =&gt; buoc.push({ nhan: &#96;(&#36;{String.fromCharCode(97 + buoc.length)})&#96;, ten, has: [...st.has], max: [...st.max], free: st.free, toMau, ghi, xau });
  chup(t('start', 'ban đầu'));
  if (capTruoc) {
    st.has[capTruoc.i] += capTruoc.so; st.free -= capTruoc.so;
    chup(t(&#96;&#36;{ten[capTruoc.i]} gets &#36;{capTruoc.so} more&#96;, &#96;&#36;{ten[capTruoc.i]} được thêm &#36;{capTruoc.so}&#96;), capTruoc.i, true);
  }
  const r = motLoai(st);
  for (const i of r.chuoi) {
    const thieu = st.max[i] - st.has[i];
    if (thieu &gt; 0) { st.has[i] += thieu; st.free -= thieu; chup(t(&#96;&#36;{ten[i]} gets &#36;{thieu}, runs&#96;, &#96;&#36;{ten[i]} nhận &#36;{thieu}, chạy&#96;), i); }
    st.free += st.has[i]; st.has[i] = 0; st.max[i] = null;
    chup(t(&#96;&#36;{ten[i]} done, frees all&#96;, &#96;&#36;{ten[i]} xong, trả hết&#96;), i);
  }
  if (!r.anToan) chup(t(&#96;stuck: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} need &gt; &#36;{st.free}&#96;, &#96;kẹt: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} cần &gt; &#36;{st.free}&#96;), -1, true);
  return { buoc, r };
}</code></pre></details>
<p>The order matters and the search must be clever: starting with A (needs 6, only 3 free) is impossible, starting with C (needs 5) too. A safe state is one where <em>at least one</em> order works. Finding it is greedy — pick any process whose remaining need fits into Free, let it finish, add its holding to Free, repeat — and greedy never fails here, because letting a process finish can only increase Free.</p>
<p>➕ Why the strong assumption "all request their maximum at once"? Because the OS cannot know what the processes will do next; it plans for the worst case. If even the worst case can be handled, nothing worse can happen.</p>
<p class="pitfall">⚠️ FE: "A possibility of deadlock can occur if the system is in an <strong>unsafe state</strong>" (FE20#43) — not "safe", not "instable".</p>`,
        `<p class="y-chinh">🎯 Hình 6-9: một trạng thái là <strong>an toàn (safe)</strong> nếu tồn tại <em>một thứ tự lập lịch nào đó</em> cho mọi tiến trình chạy xong, kể cả khi tất cả đột ngột xin ngay số tài nguyên tối đa của mình. Trạng thái (a): tổng 10 thể hiện, A có 3 trên tối đa 9, B có 2 trên tối đa 4, C có 2 trên tối đa 7, còn trống 3 — an toàn, như (b)–(e) chứng minh: B, rồi C, rồi A.</p>
<p>Trạng thái ở đây là bảng "Has / Max / Free" (đang có / tối đa / còn trống). Max là lời hứa mỗi tiến trình đưa ra từ trước: "tôi sẽ không bao giờ cần quá chừng này". Chứng minh an toàn là một lịch chạy: đưa B 2 cái nó còn có thể cần (Free 1, B có 4 = max của nó), B chạy xong và trả 4 (Free 5); giờ C có thể cần thêm 5 — đưa cho nó (Free 0), C chạy xong (Free 7); giờ A lấy được 6 cái của nó. Mọi tiến trình đều xong, vậy (a) an toàn. Bộ mô phỏng làm đúng phép tìm đó và in mỗi bước thành một bảng nhỏ, y như hình:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/503eb2f75cdcb9de9be04b73e0d93c006d4e3430.svg" alt="Tính lại Hình 6-9: B, rồi C, rồi A — trạng thái an toàn" loading="lazy" /><p class="chu-thich">🧮 Tính lại Hình 6-9: B, rồi C, rồi A — trạng thái an toàn</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-9': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3 },
  'hinh-6-10': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3, capTruoc: { i: 0, so: 1 } },
  'fe2-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [8, 6, 5], free: 5 },
  'fe3-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [6, 5, 7], free: 0 },
};
const HINH_6_11 = [
  { nhan: '(a)', has: [0, 0, 0, 0], max: [6, 5, 4, 7], free: 10 },
  { nhan: '(b)', has: [1, 1, 2, 4], max: [6, 5, 4, 7], free: 2 },
  { nhan: '(c)', has: [1, 2, 2, 4], max: [6, 5, 4, 7], free: 1 },
];

/** Dựng dãy bảng: với mỗi tiến trình thuật toán chọn — (1) nó nhận đủ phần còn thiếu, (2) nó chạy xong và trả hết. */
function trinhDien({ ten, has, max, free, capTruoc }, t) {
  const st = { has: [...has], max: [...max], free };
  const buoc = [];
  const chup = (ghi, toMau = -1, xau = false) =&gt; buoc.push({ nhan: &#96;(&#36;{String.fromCharCode(97 + buoc.length)})&#96;, ten, has: [...st.has], max: [...st.max], free: st.free, toMau, ghi, xau });
  chup(t('start', 'ban đầu'));
  if (capTruoc) {
    st.has[capTruoc.i] += capTruoc.so; st.free -= capTruoc.so;
    chup(t(&#96;&#36;{ten[capTruoc.i]} gets &#36;{capTruoc.so} more&#96;, &#96;&#36;{ten[capTruoc.i]} được thêm &#36;{capTruoc.so}&#96;), capTruoc.i, true);
  }
  const r = motLoai(st);
  for (const i of r.chuoi) {
    const thieu = st.max[i] - st.has[i];
    if (thieu &gt; 0) { st.has[i] += thieu; st.free -= thieu; chup(t(&#96;&#36;{ten[i]} gets &#36;{thieu}, runs&#96;, &#96;&#36;{ten[i]} nhận &#36;{thieu}, chạy&#96;), i); }
    st.free += st.has[i]; st.has[i] = 0; st.max[i] = null;
    chup(t(&#96;&#36;{ten[i]} done, frees all&#96;, &#96;&#36;{ten[i]} xong, trả hết&#96;), i);
  }
  if (!r.anToan) chup(t(&#96;stuck: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} need &gt; &#36;{st.free}&#96;, &#96;kẹt: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} cần &gt; &#36;{st.free}&#96;), -1, true);
  return { buoc, r };
}</code></pre></details>
<p>Thứ tự là quan trọng và phép tìm phải khéo: bắt đầu bằng A (cần 6, chỉ có 3 trống) là không được, bằng C (cần 5) cũng không. Trạng thái an toàn là trạng thái có <em>ít nhất một</em> thứ tự chạy được. Tìm nó bằng cách tham lam — chọn bất kỳ tiến trình nào có phần còn cần vừa với Free, cho nó chạy xong, cộng phần nó giữ vào Free, lặp lại — và tham lam ở đây không bao giờ thất bại, vì cho một tiến trình chạy xong chỉ có thể làm Free tăng lên.</p>
<p>➕ Vì sao lại giả định mạnh "tất cả cùng xin mức tối đa ngay"? Vì HĐH không biết các tiến trình sẽ làm gì tiếp; nó lên kế hoạch cho trường hợp xấu nhất. Nếu ngay cả trường hợp xấu nhất cũng xử lý được thì không gì tệ hơn có thể xảy ra.</p>
<p class="pitfall">⚠️ FE: "Khả năng bế tắc có thể xảy ra nếu hệ thống ở <strong>trạng thái không an toàn</strong>" (FE20#43) — không phải "an toàn", không phải "instable".</p>`],
      [22, 'Safe and Unsafe States (2)',
        `<p class="y-chinh">🎯 Figure 6-10: start from the safe state (a) of Figure 6-9, and suppose A requests and gets one more instance: (b) A has 4, Free 2. Now only B can be guaranteed to finish; then Free is 4, but A may need 5 and C may need 5 — no order works. State (b) is <strong>not safe</strong>, and A's request should not have been granted.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7e0ce4aa8278bbe7bb9c301fdedf7fd9d79b85f4.svg" alt="Figure 6-10 recomputed: after A gets one more unit, only B can finish — stuck at Free 4" loading="lazy" /><p class="chu-thich">🧮 Figure 6-10 recomputed: after A gets one more unit, only B can finish — stuck at Free 4</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-9': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3 },
  'hinh-6-10': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3, capTruoc: { i: 0, so: 1 } },
  'fe2-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [8, 6, 5], free: 5 },
  'fe3-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [6, 5, 7], free: 0 },
};
const HINH_6_11 = [
  { nhan: '(a)', has: [0, 0, 0, 0], max: [6, 5, 4, 7], free: 10 },
  { nhan: '(b)', has: [1, 1, 2, 4], max: [6, 5, 4, 7], free: 2 },
  { nhan: '(c)', has: [1, 2, 2, 4], max: [6, 5, 4, 7], free: 1 },
];

/** Dựng dãy bảng: với mỗi tiến trình thuật toán chọn — (1) nó nhận đủ phần còn thiếu, (2) nó chạy xong và trả hết. */
function trinhDien({ ten, has, max, free, capTruoc }, t) {
  const st = { has: [...has], max: [...max], free };
  const buoc = [];
  const chup = (ghi, toMau = -1, xau = false) =&gt; buoc.push({ nhan: &#96;(&#36;{String.fromCharCode(97 + buoc.length)})&#96;, ten, has: [...st.has], max: [...st.max], free: st.free, toMau, ghi, xau });
  chup(t('start', 'ban đầu'));
  if (capTruoc) {
    st.has[capTruoc.i] += capTruoc.so; st.free -= capTruoc.so;
    chup(t(&#96;&#36;{ten[capTruoc.i]} gets &#36;{capTruoc.so} more&#96;, &#96;&#36;{ten[capTruoc.i]} được thêm &#36;{capTruoc.so}&#96;), capTruoc.i, true);
  }
  const r = motLoai(st);
  for (const i of r.chuoi) {
    const thieu = st.max[i] - st.has[i];
    if (thieu &gt; 0) { st.has[i] += thieu; st.free -= thieu; chup(t(&#96;&#36;{ten[i]} gets &#36;{thieu}, runs&#96;, &#96;&#36;{ten[i]} nhận &#36;{thieu}, chạy&#96;), i); }
    st.free += st.has[i]; st.has[i] = 0; st.max[i] = null;
    chup(t(&#96;&#36;{ten[i]} done, frees all&#96;, &#96;&#36;{ten[i]} xong, trả hết&#96;), i);
  }
  if (!r.anToan) chup(t(&#96;stuck: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} need &gt; &#36;{st.free}&#96;, &#96;kẹt: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} cần &gt; &#36;{st.free}&#96;), -1, true);
  return { buoc, r };
}</code></pre></details>
<p>One small grant turned a safe state into an unsafe one. The decision at (a) was the mistake: "Free is 3, A asks for 1, so grant it" looks harmless, but the OS must check the state <em>after</em> the grant. That is exactly what the banker's algorithm does on the next slides.</p>
<p>⚠️ The most important sentence of §6.5.2: <strong>an unsafe state is not a deadlocked state</strong>. From (b) the system can still run for a while — B finishes, and maybe A releases some units before asking for more, and everything ends well. Unsafe means only that the OS can no longer <em>guarantee</em> that all processes finish; with safe states it can, whatever the processes do. That is also why slide 25's "system will eventually deadlock" is too strong — it is true only if every process really asks for its maximum.</p>
<p>➕ In everyday terms: an unsafe state is like a bank that has lent so much that, if several clients ask for the rest of their credit line on the same day, it cannot pay them all. It may never happen — but a careful banker does not lend into that situation. That is the analogy behind the algorithm's name.</p>
<p class="pitfall">⚠️ FE3#48 is this slide with other numbers: 10 units, P1 3 of max 6, P2 4 of max 5, P3 3 of max 7, so 0 free. Nobody's remaining need (3, 1, 4) fits into 0 → <strong>unsafe</strong> (bank key correct). Note the trap option "the system is in a deadlock": it is not — the processes are not necessarily blocked; they simply cannot be guaranteed to finish.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/25651080002ba7703ff1cb01a6798d52cf4634c5.svg" alt="FE3#48 checked: unsafe from the first step" loading="lazy" /><p class="chu-thich">🧮 FE3#48 checked: unsafe from the first step</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-9': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3 },
  'hinh-6-10': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3, capTruoc: { i: 0, so: 1 } },
  'fe2-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [8, 6, 5], free: 5 },
  'fe3-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [6, 5, 7], free: 0 },
};
const HINH_6_11 = [
  { nhan: '(a)', has: [0, 0, 0, 0], max: [6, 5, 4, 7], free: 10 },
  { nhan: '(b)', has: [1, 1, 2, 4], max: [6, 5, 4, 7], free: 2 },
  { nhan: '(c)', has: [1, 2, 2, 4], max: [6, 5, 4, 7], free: 1 },
];

/** Dựng dãy bảng: với mỗi tiến trình thuật toán chọn — (1) nó nhận đủ phần còn thiếu, (2) nó chạy xong và trả hết. */
function trinhDien({ ten, has, max, free, capTruoc }, t) {
  const st = { has: [...has], max: [...max], free };
  const buoc = [];
  const chup = (ghi, toMau = -1, xau = false) =&gt; buoc.push({ nhan: &#96;(&#36;{String.fromCharCode(97 + buoc.length)})&#96;, ten, has: [...st.has], max: [...st.max], free: st.free, toMau, ghi, xau });
  chup(t('start', 'ban đầu'));
  if (capTruoc) {
    st.has[capTruoc.i] += capTruoc.so; st.free -= capTruoc.so;
    chup(t(&#96;&#36;{ten[capTruoc.i]} gets &#36;{capTruoc.so} more&#96;, &#96;&#36;{ten[capTruoc.i]} được thêm &#36;{capTruoc.so}&#96;), capTruoc.i, true);
  }
  const r = motLoai(st);
  for (const i of r.chuoi) {
    const thieu = st.max[i] - st.has[i];
    if (thieu &gt; 0) { st.has[i] += thieu; st.free -= thieu; chup(t(&#96;&#36;{ten[i]} gets &#36;{thieu}, runs&#96;, &#96;&#36;{ten[i]} nhận &#36;{thieu}, chạy&#96;), i); }
    st.free += st.has[i]; st.has[i] = 0; st.max[i] = null;
    chup(t(&#96;&#36;{ten[i]} done, frees all&#96;, &#96;&#36;{ten[i]} xong, trả hết&#96;), i);
  }
  if (!r.anToan) chup(t(&#96;stuck: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} need &gt; &#36;{st.free}&#96;, &#96;kẹt: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} cần &gt; &#36;{st.free}&#96;), -1, true);
  return { buoc, r };
}</code></pre></details>`,
        `<p class="y-chinh">🎯 Hình 6-10: xuất phát từ trạng thái an toàn (a) của Hình 6-9, giả sử A xin và được cấp thêm một thể hiện: (b) A có 4, Free 2. Giờ chỉ B là chắc chắn chạy xong được; sau đó Free là 4, nhưng A có thể cần 5 và C có thể cần 5 — không thứ tự nào chạy được. Trạng thái (b) <strong>không an toàn</strong>, và lẽ ra không được cấp cho yêu cầu của A.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/106e8459ba0390426fff3248a2cf8c2f06028826.svg" alt="Tính lại Hình 6-10: sau khi A được thêm một đơn vị, chỉ B chạy xong — kẹt ở Free 4" loading="lazy" /><p class="chu-thich">🧮 Tính lại Hình 6-10: sau khi A được thêm một đơn vị, chỉ B chạy xong — kẹt ở Free 4</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-9': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3 },
  'hinh-6-10': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3, capTruoc: { i: 0, so: 1 } },
  'fe2-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [8, 6, 5], free: 5 },
  'fe3-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [6, 5, 7], free: 0 },
};
const HINH_6_11 = [
  { nhan: '(a)', has: [0, 0, 0, 0], max: [6, 5, 4, 7], free: 10 },
  { nhan: '(b)', has: [1, 1, 2, 4], max: [6, 5, 4, 7], free: 2 },
  { nhan: '(c)', has: [1, 2, 2, 4], max: [6, 5, 4, 7], free: 1 },
];

/** Dựng dãy bảng: với mỗi tiến trình thuật toán chọn — (1) nó nhận đủ phần còn thiếu, (2) nó chạy xong và trả hết. */
function trinhDien({ ten, has, max, free, capTruoc }, t) {
  const st = { has: [...has], max: [...max], free };
  const buoc = [];
  const chup = (ghi, toMau = -1, xau = false) =&gt; buoc.push({ nhan: &#96;(&#36;{String.fromCharCode(97 + buoc.length)})&#96;, ten, has: [...st.has], max: [...st.max], free: st.free, toMau, ghi, xau });
  chup(t('start', 'ban đầu'));
  if (capTruoc) {
    st.has[capTruoc.i] += capTruoc.so; st.free -= capTruoc.so;
    chup(t(&#96;&#36;{ten[capTruoc.i]} gets &#36;{capTruoc.so} more&#96;, &#96;&#36;{ten[capTruoc.i]} được thêm &#36;{capTruoc.so}&#96;), capTruoc.i, true);
  }
  const r = motLoai(st);
  for (const i of r.chuoi) {
    const thieu = st.max[i] - st.has[i];
    if (thieu &gt; 0) { st.has[i] += thieu; st.free -= thieu; chup(t(&#96;&#36;{ten[i]} gets &#36;{thieu}, runs&#96;, &#96;&#36;{ten[i]} nhận &#36;{thieu}, chạy&#96;), i); }
    st.free += st.has[i]; st.has[i] = 0; st.max[i] = null;
    chup(t(&#96;&#36;{ten[i]} done, frees all&#96;, &#96;&#36;{ten[i]} xong, trả hết&#96;), i);
  }
  if (!r.anToan) chup(t(&#96;stuck: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} need &gt; &#36;{st.free}&#96;, &#96;kẹt: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} cần &gt; &#36;{st.free}&#96;), -1, true);
  return { buoc, r };
}</code></pre></details>
<p>Một lần cấp nhỏ biến trạng thái an toàn thành không an toàn. Quyết định ở (a) mới là sai lầm: "Free là 3, A xin 1, vậy cấp" nghe vô hại, nhưng HĐH phải kiểm trạng thái <em>sau khi</em> cấp. Đó chính là việc thuật toán nhà băng làm ở các slide sau.</p>
<p>⚠️ Câu quan trọng nhất của §6.5.2: <strong>trạng thái không an toàn không phải là trạng thái bế tắc</strong>. Từ (b) hệ thống vẫn chạy tiếp được một lúc — B chạy xong, và biết đâu A trả bớt vài đơn vị trước khi xin thêm, rồi mọi chuyện kết thúc êm đẹp. Không an toàn chỉ có nghĩa là HĐH không còn <em>bảo đảm</em> được mọi tiến trình đều chạy xong; với trạng thái an toàn thì nó bảo đảm được, bất kể các tiến trình làm gì. Vì vậy câu "system will eventually deadlock" của slide 25 là quá mạnh — nó chỉ đúng nếu mọi tiến trình thật sự xin tới mức tối đa.</p>
<p>➕ Nói theo đời thường: trạng thái không an toàn giống một ngân hàng đã cho vay nhiều tới mức, nếu vài khách cùng xin rút nốt hạn mức tín dụng trong một ngày, ngân hàng không trả nổi tất cả. Có thể chuyện đó không bao giờ xảy ra — nhưng một chủ nhà băng cẩn thận sẽ không cho vay để rơi vào tình thế đó. Đó là phép so sánh đứng sau tên thuật toán.</p>
<p class="pitfall">⚠️ FE3#48 chính là slide này với số khác: 10 đơn vị, P1 có 3 trên tối đa 6, P2 có 4 trên tối đa 5, P3 có 3 trên tối đa 7, vậy trống 0. Phần còn cần của không ai (3, 1, 4) vừa với 0 → <strong>không an toàn</strong> (đáp án ngân hàng đúng). Để ý phương án bẫy "hệ thống đang bế tắc": không phải — các tiến trình chưa chắc đã bị chặn; chỉ là không bảo đảm được chúng chạy xong.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/619e5cbb0a6271ed9d0e244aa3e0625677aff262.svg" alt="Kiểm FE3#48: không an toàn ngay từ bước đầu" loading="lazy" /><p class="chu-thich">🧮 Kiểm FE3#48: không an toàn ngay từ bước đầu</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-9': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3 },
  'hinh-6-10': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3, capTruoc: { i: 0, so: 1 } },
  'fe2-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [8, 6, 5], free: 5 },
  'fe3-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [6, 5, 7], free: 0 },
};
const HINH_6_11 = [
  { nhan: '(a)', has: [0, 0, 0, 0], max: [6, 5, 4, 7], free: 10 },
  { nhan: '(b)', has: [1, 1, 2, 4], max: [6, 5, 4, 7], free: 2 },
  { nhan: '(c)', has: [1, 2, 2, 4], max: [6, 5, 4, 7], free: 1 },
];

/** Dựng dãy bảng: với mỗi tiến trình thuật toán chọn — (1) nó nhận đủ phần còn thiếu, (2) nó chạy xong và trả hết. */
function trinhDien({ ten, has, max, free, capTruoc }, t) {
  const st = { has: [...has], max: [...max], free };
  const buoc = [];
  const chup = (ghi, toMau = -1, xau = false) =&gt; buoc.push({ nhan: &#96;(&#36;{String.fromCharCode(97 + buoc.length)})&#96;, ten, has: [...st.has], max: [...st.max], free: st.free, toMau, ghi, xau });
  chup(t('start', 'ban đầu'));
  if (capTruoc) {
    st.has[capTruoc.i] += capTruoc.so; st.free -= capTruoc.so;
    chup(t(&#96;&#36;{ten[capTruoc.i]} gets &#36;{capTruoc.so} more&#96;, &#96;&#36;{ten[capTruoc.i]} được thêm &#36;{capTruoc.so}&#96;), capTruoc.i, true);
  }
  const r = motLoai(st);
  for (const i of r.chuoi) {
    const thieu = st.max[i] - st.has[i];
    if (thieu &gt; 0) { st.has[i] += thieu; st.free -= thieu; chup(t(&#96;&#36;{ten[i]} gets &#36;{thieu}, runs&#96;, &#96;&#36;{ten[i]} nhận &#36;{thieu}, chạy&#96;), i); }
    st.free += st.has[i]; st.has[i] = 0; st.max[i] = null;
    chup(t(&#96;&#36;{ten[i]} done, frees all&#96;, &#96;&#36;{ten[i]} xong, trả hết&#96;), i);
  }
  if (!r.anToan) chup(t(&#96;stuck: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} need &gt; &#36;{st.free}&#96;, &#96;kẹt: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} cần &gt; &#36;{st.free}&#96;), -1, true);
  return { buoc, r };
}</code></pre></details>`],
      [23, 'Banker’s Algorithm for Single Resource',
        `<p class="y-chinh">🎯 Figure 6-11: Dijkstra's (1965) <strong>banker's algorithm</strong> for one resource type. A small-town banker has four customers A–D with credit lines 6, 5, 4, 7 (total 22) but keeps only 10 units in the vault. (a) Nobody has borrowed: safe. (b) A 1, B 1, C 2, D 4 borrowed, 2 left: safe — C can be given its last 2. (c) B borrows one more, 1 left: <strong>unsafe</strong>.</p>
<p>The algorithm, in the book's words: for each request, check whether granting it leads to a safe state. If yes, grant it; if not, postpone the request until later (the customer waits, even though the banker could pay right now). The banker relies on the fact that not every customer needs the full credit line at once — that is why he can promise 22 with 10 in the vault. The check is the search of slide 21 run on the state <em>after</em> the grant:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7a8ae14ba719387bd6f845005e9441404b9d1c7b.svg" alt="Figure 6-11 recomputed: (a) and (b) safe, (c) unsafe" loading="lazy" /><p class="chu-thich">🧮 Figure 6-11 recomputed: (a) and (b) safe, (c) unsafe</p></div>
<table>
<thead><tr><th>State</th><th>Free</th><th>Still needs</th><th>Banker’s verdict</th></tr></thead>
<tbody>
<tr><td>(a)</td><td>10</td><td>A 6, B 5, C 4, D 7</td><td>safe — e.g. A → B → C → D</td></tr>
<tr><td>(b)</td><td>2</td><td>A 5, B 4, C 2, D 3</td><td>safe — e.g. C → D → A → B</td></tr>
<tr><td>(c)</td><td>1</td><td>A 5, B 3, C 2, D 3</td><td><strong>unsafe</strong>: every process still needs more than 1</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-9': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3 },
  'hinh-6-10': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3, capTruoc: { i: 0, so: 1 } },
  'fe2-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [8, 6, 5], free: 5 },
  'fe3-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [6, 5, 7], free: 0 },
};
const HINH_6_11 = [
  { nhan: '(a)', has: [0, 0, 0, 0], max: [6, 5, 4, 7], free: 10 },
  { nhan: '(b)', has: [1, 1, 2, 4], max: [6, 5, 4, 7], free: 2 },
  { nhan: '(c)', has: [1, 2, 2, 4], max: [6, 5, 4, 7], free: 1 },
];

/** Dựng dãy bảng: với mỗi tiến trình thuật toán chọn — (1) nó nhận đủ phần còn thiếu, (2) nó chạy xong và trả hết. */
function trinhDien({ ten, has, max, free, capTruoc }, t) {
  const st = { has: [...has], max: [...max], free };
  const buoc = [];
  const chup = (ghi, toMau = -1, xau = false) =&gt; buoc.push({ nhan: &#96;(&#36;{String.fromCharCode(97 + buoc.length)})&#96;, ten, has: [...st.has], max: [...st.max], free: st.free, toMau, ghi, xau });
  chup(t('start', 'ban đầu'));
  if (capTruoc) {
    st.has[capTruoc.i] += capTruoc.so; st.free -= capTruoc.so;
    chup(t(&#96;&#36;{ten[capTruoc.i]} gets &#36;{capTruoc.so} more&#96;, &#96;&#36;{ten[capTruoc.i]} được thêm &#36;{capTruoc.so}&#96;), capTruoc.i, true);
  }
  const r = motLoai(st);
  for (const i of r.chuoi) {
    const thieu = st.max[i] - st.has[i];
    if (thieu &gt; 0) { st.has[i] += thieu; st.free -= thieu; chup(t(&#96;&#36;{ten[i]} gets &#36;{thieu}, runs&#96;, &#96;&#36;{ten[i]} nhận &#36;{thieu}, chạy&#96;), i); }
    st.free += st.has[i]; st.has[i] = 0; st.max[i] = null;
    chup(t(&#96;&#36;{ten[i]} done, frees all&#96;, &#96;&#36;{ten[i]} xong, trả hết&#96;), i);
  }
  if (!r.anToan) chup(t(&#96;stuck: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} need &gt; &#36;{st.free}&#96;, &#96;kẹt: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} cần &gt; &#36;{st.free}&#96;), -1, true);
  return { buoc, r };
}</code></pre></details>
<p>In (c) every customer still needs more than the 1 unit in the vault (A 5, B 3, C 2, D 3). If all of them came for the rest of their credit, the banker could satisfy nobody — no order works. So in state (b), B's request for one more unit must be refused, although a unit is available. The simulator's sequence for (b) is C, D, A, B — another valid order exists (C, then B, then A, then D); any one is enough.</p>
<p>➕ The algorithm is named after a bank, but it fits any allocator that knows maximum demands: a connection pool that knows each request handler needs at most 3 connections; a GPU scheduler that knows each job's maximum memory. In practice it is almost never used — see slide 25 for why.</p>
<p class="pitfall">⚠️ This exact figure is in the bank five times. "Which state is <strong>unsafe</strong>?" → <strong>Fig. C</strong> (FE21#2, FE25#15) — correct. "Which state is <strong>safe</strong>?" → bank key <strong>Fig. B</strong> (FE18#12, FE20#39, FE22#31) — but Fig. A (nobody borrowed, Free 10) is safe as well; there is no option "Fig. A and Fig. B", so the question has no fully correct option. Answer Fig. B in the exam (the other options — "Fig. C", "Fig. B and Fig. C", "None" — are wrong for sure), and know why. "Who invented the banker's algorithm?" → <strong>Dijkstra</strong> (FE6#49, FE7#48, FE12#48).</p>`,
        `<p class="y-chinh">🎯 Hình 6-11: <strong>thuật toán nhà băng (banker's algorithm)</strong> của Dijkstra (1965) cho một loại tài nguyên. Một chủ nhà băng ở thị trấn nhỏ có bốn khách A–D với hạn mức tín dụng 6, 5, 4, 7 (tổng 22) nhưng chỉ giữ 10 đơn vị trong két. (a) Chưa ai vay: an toàn. (b) A 1, B 1, C 2, D 4 đã vay, còn 2: an toàn — có thể đưa C nốt 2. (c) B vay thêm một, còn 1: <strong>không an toàn</strong>.</p>
<p>Thuật toán, theo lời sách: với mỗi yêu cầu, kiểm xem cấp nó có dẫn tới trạng thái an toàn không. Có thì cấp; không thì hoãn yêu cầu lại để sau (khách phải chờ, dù chủ nhà băng trả được ngay lúc này). Chủ nhà băng dựa vào sự thật là không phải khách nào cũng cần trọn hạn mức cùng lúc — nhờ vậy ông hứa được 22 khi trong két chỉ có 10. Phép kiểm là phép tìm của slide 21 chạy trên trạng thái <em>sau khi</em> cấp:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/50037554b0d2eaed3bdf8c9a9d4aca2c12c838ba.svg" alt="Tính lại Hình 6-11: (a) và (b) an toàn, (c) không an toàn" loading="lazy" /><p class="chu-thich">🧮 Tính lại Hình 6-11: (a) và (b) an toàn, (c) không an toàn</p></div>
<table>
<thead><tr><th>Trạng thái</th><th>Free</th><th>Còn cần</th><th>Kết luận của nhà băng</th></tr></thead>
<tbody>
<tr><td>(a)</td><td>10</td><td>A 6, B 5, C 4, D 7</td><td>an toàn — vd A → B → C → D</td></tr>
<tr><td>(b)</td><td>2</td><td>A 5, B 4, C 2, D 3</td><td>an toàn — vd C → D → A → B</td></tr>
<tr><td>(c)</td><td>1</td><td>A 5, B 3, C 2, D 3</td><td><strong>không an toàn</strong>: tiến trình nào cũng còn cần hơn 1</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-9': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3 },
  'hinh-6-10': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3, capTruoc: { i: 0, so: 1 } },
  'fe2-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [8, 6, 5], free: 5 },
  'fe3-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [6, 5, 7], free: 0 },
};
const HINH_6_11 = [
  { nhan: '(a)', has: [0, 0, 0, 0], max: [6, 5, 4, 7], free: 10 },
  { nhan: '(b)', has: [1, 1, 2, 4], max: [6, 5, 4, 7], free: 2 },
  { nhan: '(c)', has: [1, 2, 2, 4], max: [6, 5, 4, 7], free: 1 },
];

/** Dựng dãy bảng: với mỗi tiến trình thuật toán chọn — (1) nó nhận đủ phần còn thiếu, (2) nó chạy xong và trả hết. */
function trinhDien({ ten, has, max, free, capTruoc }, t) {
  const st = { has: [...has], max: [...max], free };
  const buoc = [];
  const chup = (ghi, toMau = -1, xau = false) =&gt; buoc.push({ nhan: &#96;(&#36;{String.fromCharCode(97 + buoc.length)})&#96;, ten, has: [...st.has], max: [...st.max], free: st.free, toMau, ghi, xau });
  chup(t('start', 'ban đầu'));
  if (capTruoc) {
    st.has[capTruoc.i] += capTruoc.so; st.free -= capTruoc.so;
    chup(t(&#96;&#36;{ten[capTruoc.i]} gets &#36;{capTruoc.so} more&#96;, &#96;&#36;{ten[capTruoc.i]} được thêm &#36;{capTruoc.so}&#96;), capTruoc.i, true);
  }
  const r = motLoai(st);
  for (const i of r.chuoi) {
    const thieu = st.max[i] - st.has[i];
    if (thieu &gt; 0) { st.has[i] += thieu; st.free -= thieu; chup(t(&#96;&#36;{ten[i]} gets &#36;{thieu}, runs&#96;, &#96;&#36;{ten[i]} nhận &#36;{thieu}, chạy&#96;), i); }
    st.free += st.has[i]; st.has[i] = 0; st.max[i] = null;
    chup(t(&#96;&#36;{ten[i]} done, frees all&#96;, &#96;&#36;{ten[i]} xong, trả hết&#96;), i);
  }
  if (!r.anToan) chup(t(&#96;stuck: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} need &gt; &#36;{st.free}&#96;, &#96;kẹt: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} cần &gt; &#36;{st.free}&#96;), -1, true);
  return { buoc, r };
}</code></pre></details>
<p>Ở (c), khách nào cũng còn cần nhiều hơn 1 đơn vị trong két (A 5, B 3, C 2, D 3). Nếu tất cả cùng tới đòi nốt hạn mức, chủ nhà băng không đáp ứng được ai — không thứ tự nào chạy được. Vậy ở trạng thái (b), yêu cầu thêm một đơn vị của B phải bị từ chối, dù đang có một đơn vị. Chuỗi bộ mô phỏng tìm cho (b) là C, D, A, B — còn những thứ tự hợp lệ khác (C, rồi B, rồi A, rồi D); chỉ cần một là đủ.</p>
<p>➕ Thuật toán mang tên ngân hàng, nhưng hợp với mọi bộ cấp phát biết trước nhu cầu tối đa: một connection pool biết mỗi handler cần tối đa 3 kết nối; một bộ lập lịch GPU biết bộ nhớ tối đa của mỗi job. Trên thực tế nó gần như không được dùng — xem slide 25 để biết vì sao.</p>
<p class="pitfall">⚠️ Đúng hình này có trong ngân hàng năm lần. "Trạng thái nào <strong>không an toàn</strong>?" → <strong>Fig. C</strong> (FE21#2, FE25#15) — đúng. "Trạng thái nào <strong>an toàn</strong>?" → đáp án ngân hàng <strong>Fig. B</strong> (FE18#12, FE20#39, FE22#31) — nhưng Fig. A (chưa ai vay, Free 10) cũng an toàn; không có phương án "Fig. A và Fig. B", nên câu này không có phương án đúng trọn vẹn. Đi thi cứ chọn Fig. B (các phương án còn lại — "Fig. C", "Fig. B và Fig. C", "None" — chắc chắn sai), và hiểu vì sao. "Ai nghĩ ra thuật toán nhà băng?" → <strong>Dijkstra</strong> (FE6#49, FE7#48, FE12#48).</p>`],
      [24, 'Banker’s Algorithm for Multiple Resources (1)',
        `<p class="y-chinh">🎯 Figure 6-12: the banker's algorithm with several resource types. Five processes A–E, four types (tape drives, plotters, printers, CD-ROMs). Left matrix: <strong>resources assigned</strong> (C); right matrix: <strong>resources still needed</strong> (Max − C). E = (6 3 4 2) existing, P = (5 3 2 2) possessed (sum of C), A = E − P = (1 0 2 0) available.</p>
<p>The same structures as detection (slide 16), with "still needed" in place of the request matrix. The question "is this state safe?" is answered by the search of slide 21, done with vectors: find a row of "still needed" that is ≤ A, let that process finish, add its row of "assigned" to A, repeat. The simulator records every comparison, including the failed ones:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9bcd0e8bcfe3552a19ab678a2b3f8164dc943bb9.svg" alt="Figure 6-12 recomputed: D first, then E, A, B, C — the state is safe" loading="lazy" /><p class="chu-thich">🧮 Figure 6-12 recomputed: D first, then E, A, B, C — the state is safe</p></div>
<table>
<thead><tr><th>Process</th><th>Allocation (tape plotter printer CD)</th><th>Max</th><th>Need = Max − Allocation</th></tr></thead>
<tbody>
<tr><td>A</td><td>3 0 1 1</td><td>4 1 1 1</td><td>1 1 0 0</td></tr>
<tr><td>B</td><td>0 1 0 0</td><td>0 2 1 2</td><td>0 1 1 2</td></tr>
<tr><td>C</td><td>1 1 1 0</td><td>4 2 1 0</td><td>3 1 0 0</td></tr>
<tr><td>D</td><td>1 1 0 1</td><td>1 1 1 1</td><td>0 0 1 0</td></tr>
<tr><td>E</td><td>0 0 0 0</td><td>2 1 1 0</td><td>2 1 1 0</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TANEN = {   // Hình 6-12 — 4 loại: tape drives, plotters, printers, CD-ROMs
  ten: ['A', 'B', 'C', 'D', 'E'], loai: ['tape', 'plotter', 'printer', 'CD'],
  giu: [[3, 0, 1, 1], [0, 1, 0, 0], [1, 1, 1, 0], [1, 1, 0, 1], [0, 0, 0, 0]],
  can: [[1, 1, 0, 0], [0, 1, 1, 2], [3, 1, 0, 0], [0, 0, 1, 0], [2, 1, 1, 0]],
  E: [6, 3, 4, 2],
};
const SILB = {    // FE1#28: A = 10, B = 5, C = 7
  ten: ['P0', 'P1', 'P2', 'P3', 'P4'], loai: ['A', 'B', 'C'],
  giu: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
  max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
  E: [10, 5, 7],
};
const FE17 = {    // FE17#28 — ảnh đề gốc: A 10211/11212, B 20110/22210, C 11011/21311, D 11010/11121, Available 00x11
  ten: ['A', 'B', 'C', 'D'], loai: ['R1', 'R2', 'R3', 'R4', 'R5'],
  giu: [[1, 0, 2, 1, 1], [2, 0, 1, 1, 0], [1, 1, 0, 1, 1], [1, 1, 0, 1, 0]],
  max: [[1, 1, 2, 1, 2], [2, 2, 2, 1, 0], [2, 1, 3, 1, 1], [1, 1, 1, 2, 1]],
};
const QUIZ = {    // quiz Chương 6 câu 1–2 — dữ liệu mới
  ten: ['P0', 'P1', 'P2', 'P3'], loai: ['A', 'B', 'C'], E: [8, 5, 6],
  giu: [[2, 1, 0], [1, 0, 2], [3, 1, 1], [0, 2, 1]], max: [[5, 3, 2], [3, 2, 2], [4, 1, 3], [2, 4, 3]],
  phuongAn: [[1, 2, 3, 0], [0, 2, 3, 1], [2, 3, 0, 1], [3, 2, 0, 1]],
};
const tong = (rows) =&gt; rows.reduce((s, r) =&gt; s.map((x, k) =&gt; x + r[k]));
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Lặp lại phép quét vòng để GHI VẾT cả lần trượt; kết quả phải trùng antToan. */
function vet({ ten, giu, can, A }) {
  const n = ten.length, xong = Array(n).fill(false), dong = [];
  let work = [...A], tu = 0, chuoi = [];
  for (;;) {
    let chon = -1;
    for (let k = 0; k &lt; n; k++) {
      const i = (tu + k) % n;
      if (xong[i]) continue;
      const ok = can[i].every((x, j) =&gt; x &lt;= work[j]);
      if (ok) { chon = i; break; }
      dong.push({ i, ok: false, work: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, j) =&gt; x + giu[chon][j]);
    dong.push({ i: chon, ok: true, work: [...work], sau });
    work = sau; xong[chon] = true; chuoi.push(chon); tu = (chon + 1) % n;
  }
  const r = antToan({ conLai: A, giuLai: giu, canThem: can });
  if (r.chuoi.join() !== chuoi.join()) throw new Error(&#96;vết ≠ antToan: &#36;{chuoi} vs &#36;{r.chuoi}&#96;);
  // bỏ bớt các lần trượt lặp lại liền nhau của cùng một vòng (giữ bảng gọn): giữ tối đa 12 dòng trượt
  return { dong, chuoi, anToan: r.anToan, ket: r.ket, work };
}

function bangVet({ tieuDe, phuDe, ten, giu, can, A, t, chuThich = [] }) {
  const r = vet({ ten, giu, can, A });
  const hang = r.dong.map((d, k) =&gt; [k + 1, ten[d.i], v(can[d.i]), v(d.work), d.ok ? t('yes', 'có') : t('no', 'không'), d.ok ? &#96;&#36;{v(d.work)} + &#36;{v(giu[d.i])} = &#36;{v(d.sau)}&#96; : '—']);
  const ket = r.anToan
    ? t(&#96;SAFE — safe sequence &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;, &#96;AN TOÀN — chuỗi an toàn &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;)
    : t(&#96;NOT SAFE — no order is guaranteed to finish &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')}&#96;, &#96;KHÔNG AN TOÀN — không thứ tự nào chắc chắn cho &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} chạy xong&#96;);
  const svg = bangSvg({
    tieuDe, phuDe,
    cot: [t('Step', 'Bước'), t('Process', 'Tiến trình'), 'Need', t('Work (A)', 'Work (A)'), 'Need ≤ Work?', t('finishes, gives back', 'chạy xong, trả lại')],
    hang, mauHang: (i) =&gt; (r.dong[i].ok ? MAU.totNen : null), dam: (i, j) =&gt; j === 1 &amp;&amp; r.dong[i].ok,
    chuThich: [ket, ...chuThich],
  });
  return { svg, r, ket };
}

function bangMaTran({ ten, loai, giu, can, max, t }) {
  const th = &#96;&lt;tr&gt;&lt;th&gt;&#36;{t('Process', 'Tiến trình')}&lt;/th&gt;&lt;th&gt;Allocation (&#36;{loai.join(' ')})&lt;/th&gt;&#36;{max ? &#96;&lt;th&gt;Max&lt;/th&gt;&#96; : ''}&lt;th&gt;Need = Max − Allocation&lt;/th&gt;&lt;/tr&gt;&#96;;
  const rows = ten.map((p, i) =&gt; &#96;&lt;tr&gt;&lt;td&gt;&#36;{p}&lt;/td&gt;&lt;td&gt;&#36;{giu[i].join(' ')}&lt;/td&gt;&#36;{max ? &#96;&lt;td&gt;&#36;{max[i].join(' ')}&lt;/td&gt;&#96; : ''}&lt;td&gt;&#36;{can[i].join(' ')}&lt;/td&gt;&lt;/tr&gt;&#96;).join('\\n');
  return &#96;&lt;table&gt;\\n&lt;thead&gt;&#36;{th}&lt;/thead&gt;\\n&lt;tbody&gt;\\n&#36;{rows}\\n&lt;/tbody&gt;\\n&lt;/table&gt;&#96;;
}</code></pre></details>
<p>Only D fits at first (it needs one printer, and two are free). D returns (1 1 0 1), A becomes (2 1 2 1); then E, A, B, C all fit in turn. The book says "D can run, then A or E, followed by the rest" — our scan, continuing in a circle after D, picks E first; both are valid. The state is safe.</p>
<p>➕ Now the book's two requests, each checked by "pretend to grant, then test the new state":</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1affd2e066edf1374ab9adfbbd93196391924345.svg" alt="B asks for a printer: the state after the grant is still safe — grant it" loading="lazy" /><p class="chu-thich">🧮 B asks for a printer: the state after the grant is still safe — grant it</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TANEN = {   // Hình 6-12 — 4 loại: tape drives, plotters, printers, CD-ROMs
  ten: ['A', 'B', 'C', 'D', 'E'], loai: ['tape', 'plotter', 'printer', 'CD'],
  giu: [[3, 0, 1, 1], [0, 1, 0, 0], [1, 1, 1, 0], [1, 1, 0, 1], [0, 0, 0, 0]],
  can: [[1, 1, 0, 0], [0, 1, 1, 2], [3, 1, 0, 0], [0, 0, 1, 0], [2, 1, 1, 0]],
  E: [6, 3, 4, 2],
};
const SILB = {    // FE1#28: A = 10, B = 5, C = 7
  ten: ['P0', 'P1', 'P2', 'P3', 'P4'], loai: ['A', 'B', 'C'],
  giu: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
  max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
  E: [10, 5, 7],
};
const FE17 = {    // FE17#28 — ảnh đề gốc: A 10211/11212, B 20110/22210, C 11011/21311, D 11010/11121, Available 00x11
  ten: ['A', 'B', 'C', 'D'], loai: ['R1', 'R2', 'R3', 'R4', 'R5'],
  giu: [[1, 0, 2, 1, 1], [2, 0, 1, 1, 0], [1, 1, 0, 1, 1], [1, 1, 0, 1, 0]],
  max: [[1, 1, 2, 1, 2], [2, 2, 2, 1, 0], [2, 1, 3, 1, 1], [1, 1, 1, 2, 1]],
};
const QUIZ = {    // quiz Chương 6 câu 1–2 — dữ liệu mới
  ten: ['P0', 'P1', 'P2', 'P3'], loai: ['A', 'B', 'C'], E: [8, 5, 6],
  giu: [[2, 1, 0], [1, 0, 2], [3, 1, 1], [0, 2, 1]], max: [[5, 3, 2], [3, 2, 2], [4, 1, 3], [2, 4, 3]],
  phuongAn: [[1, 2, 3, 0], [0, 2, 3, 1], [2, 3, 0, 1], [3, 2, 0, 1]],
};
const tong = (rows) =&gt; rows.reduce((s, r) =&gt; s.map((x, k) =&gt; x + r[k]));
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Lặp lại phép quét vòng để GHI VẾT cả lần trượt; kết quả phải trùng antToan. */
function vet({ ten, giu, can, A }) {
  const n = ten.length, xong = Array(n).fill(false), dong = [];
  let work = [...A], tu = 0, chuoi = [];
  for (;;) {
    let chon = -1;
    for (let k = 0; k &lt; n; k++) {
      const i = (tu + k) % n;
      if (xong[i]) continue;
      const ok = can[i].every((x, j) =&gt; x &lt;= work[j]);
      if (ok) { chon = i; break; }
      dong.push({ i, ok: false, work: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, j) =&gt; x + giu[chon][j]);
    dong.push({ i: chon, ok: true, work: [...work], sau });
    work = sau; xong[chon] = true; chuoi.push(chon); tu = (chon + 1) % n;
  }
  const r = antToan({ conLai: A, giuLai: giu, canThem: can });
  if (r.chuoi.join() !== chuoi.join()) throw new Error(&#96;vết ≠ antToan: &#36;{chuoi} vs &#36;{r.chuoi}&#96;);
  // bỏ bớt các lần trượt lặp lại liền nhau của cùng một vòng (giữ bảng gọn): giữ tối đa 12 dòng trượt
  return { dong, chuoi, anToan: r.anToan, ket: r.ket, work };
}

function bangVet({ tieuDe, phuDe, ten, giu, can, A, t, chuThich = [] }) {
  const r = vet({ ten, giu, can, A });
  const hang = r.dong.map((d, k) =&gt; [k + 1, ten[d.i], v(can[d.i]), v(d.work), d.ok ? t('yes', 'có') : t('no', 'không'), d.ok ? &#96;&#36;{v(d.work)} + &#36;{v(giu[d.i])} = &#36;{v(d.sau)}&#96; : '—']);
  const ket = r.anToan
    ? t(&#96;SAFE — safe sequence &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;, &#96;AN TOÀN — chuỗi an toàn &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;)
    : t(&#96;NOT SAFE — no order is guaranteed to finish &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')}&#96;, &#96;KHÔNG AN TOÀN — không thứ tự nào chắc chắn cho &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} chạy xong&#96;);
  const svg = bangSvg({
    tieuDe, phuDe,
    cot: [t('Step', 'Bước'), t('Process', 'Tiến trình'), 'Need', t('Work (A)', 'Work (A)'), 'Need ≤ Work?', t('finishes, gives back', 'chạy xong, trả lại')],
    hang, mauHang: (i) =&gt; (r.dong[i].ok ? MAU.totNen : null), dam: (i, j) =&gt; j === 1 &amp;&amp; r.dong[i].ok,
    chuThich: [ket, ...chuThich],
  });
  return { svg, r, ket };
}

function bangMaTran({ ten, loai, giu, can, max, t }) {
  const th = &#96;&lt;tr&gt;&lt;th&gt;&#36;{t('Process', 'Tiến trình')}&lt;/th&gt;&lt;th&gt;Allocation (&#36;{loai.join(' ')})&lt;/th&gt;&#36;{max ? &#96;&lt;th&gt;Max&lt;/th&gt;&#96; : ''}&lt;th&gt;Need = Max − Allocation&lt;/th&gt;&lt;/tr&gt;&#96;;
  const rows = ten.map((p, i) =&gt; &#96;&lt;tr&gt;&lt;td&gt;&#36;{p}&lt;/td&gt;&lt;td&gt;&#36;{giu[i].join(' ')}&lt;/td&gt;&#36;{max ? &#96;&lt;td&gt;&#36;{max[i].join(' ')}&lt;/td&gt;&#96; : ''}&lt;td&gt;&#36;{can[i].join(' ')}&lt;/td&gt;&lt;/tr&gt;&#96;).join('\\n');
  return &#96;&lt;table&gt;\\n&lt;thead&gt;&#36;{th}&lt;/thead&gt;\\n&lt;tbody&gt;\\n&#36;{rows}\\n&lt;/tbody&gt;\\n&lt;/table&gt;&#96;;
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/652d3ddb8b214f109d9b5d421cad9118cb2f308d.svg" alt="Then E asks for the last printer: the state after the grant is unsafe — E must wait" loading="lazy" /><p class="chu-thich">🧮 Then E asks for the last printer: the state after the grant is unsafe — E must wait</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TANEN = {   // Hình 6-12 — 4 loại: tape drives, plotters, printers, CD-ROMs
  ten: ['A', 'B', 'C', 'D', 'E'], loai: ['tape', 'plotter', 'printer', 'CD'],
  giu: [[3, 0, 1, 1], [0, 1, 0, 0], [1, 1, 1, 0], [1, 1, 0, 1], [0, 0, 0, 0]],
  can: [[1, 1, 0, 0], [0, 1, 1, 2], [3, 1, 0, 0], [0, 0, 1, 0], [2, 1, 1, 0]],
  E: [6, 3, 4, 2],
};
const SILB = {    // FE1#28: A = 10, B = 5, C = 7
  ten: ['P0', 'P1', 'P2', 'P3', 'P4'], loai: ['A', 'B', 'C'],
  giu: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
  max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
  E: [10, 5, 7],
};
const FE17 = {    // FE17#28 — ảnh đề gốc: A 10211/11212, B 20110/22210, C 11011/21311, D 11010/11121, Available 00x11
  ten: ['A', 'B', 'C', 'D'], loai: ['R1', 'R2', 'R3', 'R4', 'R5'],
  giu: [[1, 0, 2, 1, 1], [2, 0, 1, 1, 0], [1, 1, 0, 1, 1], [1, 1, 0, 1, 0]],
  max: [[1, 1, 2, 1, 2], [2, 2, 2, 1, 0], [2, 1, 3, 1, 1], [1, 1, 1, 2, 1]],
};
const QUIZ = {    // quiz Chương 6 câu 1–2 — dữ liệu mới
  ten: ['P0', 'P1', 'P2', 'P3'], loai: ['A', 'B', 'C'], E: [8, 5, 6],
  giu: [[2, 1, 0], [1, 0, 2], [3, 1, 1], [0, 2, 1]], max: [[5, 3, 2], [3, 2, 2], [4, 1, 3], [2, 4, 3]],
  phuongAn: [[1, 2, 3, 0], [0, 2, 3, 1], [2, 3, 0, 1], [3, 2, 0, 1]],
};
const tong = (rows) =&gt; rows.reduce((s, r) =&gt; s.map((x, k) =&gt; x + r[k]));
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Lặp lại phép quét vòng để GHI VẾT cả lần trượt; kết quả phải trùng antToan. */
function vet({ ten, giu, can, A }) {
  const n = ten.length, xong = Array(n).fill(false), dong = [];
  let work = [...A], tu = 0, chuoi = [];
  for (;;) {
    let chon = -1;
    for (let k = 0; k &lt; n; k++) {
      const i = (tu + k) % n;
      if (xong[i]) continue;
      const ok = can[i].every((x, j) =&gt; x &lt;= work[j]);
      if (ok) { chon = i; break; }
      dong.push({ i, ok: false, work: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, j) =&gt; x + giu[chon][j]);
    dong.push({ i: chon, ok: true, work: [...work], sau });
    work = sau; xong[chon] = true; chuoi.push(chon); tu = (chon + 1) % n;
  }
  const r = antToan({ conLai: A, giuLai: giu, canThem: can });
  if (r.chuoi.join() !== chuoi.join()) throw new Error(&#96;vết ≠ antToan: &#36;{chuoi} vs &#36;{r.chuoi}&#96;);
  // bỏ bớt các lần trượt lặp lại liền nhau của cùng một vòng (giữ bảng gọn): giữ tối đa 12 dòng trượt
  return { dong, chuoi, anToan: r.anToan, ket: r.ket, work };
}

function bangVet({ tieuDe, phuDe, ten, giu, can, A, t, chuThich = [] }) {
  const r = vet({ ten, giu, can, A });
  const hang = r.dong.map((d, k) =&gt; [k + 1, ten[d.i], v(can[d.i]), v(d.work), d.ok ? t('yes', 'có') : t('no', 'không'), d.ok ? &#96;&#36;{v(d.work)} + &#36;{v(giu[d.i])} = &#36;{v(d.sau)}&#96; : '—']);
  const ket = r.anToan
    ? t(&#96;SAFE — safe sequence &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;, &#96;AN TOÀN — chuỗi an toàn &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;)
    : t(&#96;NOT SAFE — no order is guaranteed to finish &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')}&#96;, &#96;KHÔNG AN TOÀN — không thứ tự nào chắc chắn cho &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} chạy xong&#96;);
  const svg = bangSvg({
    tieuDe, phuDe,
    cot: [t('Step', 'Bước'), t('Process', 'Tiến trình'), 'Need', t('Work (A)', 'Work (A)'), 'Need ≤ Work?', t('finishes, gives back', 'chạy xong, trả lại')],
    hang, mauHang: (i) =&gt; (r.dong[i].ok ? MAU.totNen : null), dam: (i, j) =&gt; j === 1 &amp;&amp; r.dong[i].ok,
    chuThich: [ket, ...chuThich],
  });
  return { svg, r, ket };
}

function bangMaTran({ ten, loai, giu, can, max, t }) {
  const th = &#96;&lt;tr&gt;&lt;th&gt;&#36;{t('Process', 'Tiến trình')}&lt;/th&gt;&lt;th&gt;Allocation (&#36;{loai.join(' ')})&lt;/th&gt;&#36;{max ? &#96;&lt;th&gt;Max&lt;/th&gt;&#96; : ''}&lt;th&gt;Need = Max − Allocation&lt;/th&gt;&lt;/tr&gt;&#96;;
  const rows = ten.map((p, i) =&gt; &#96;&lt;tr&gt;&lt;td&gt;&#36;{p}&lt;/td&gt;&lt;td&gt;&#36;{giu[i].join(' ')}&lt;/td&gt;&#36;{max ? &#96;&lt;td&gt;&#36;{max[i].join(' ')}&lt;/td&gt;&#96; : ''}&lt;td&gt;&#36;{can[i].join(' ')}&lt;/td&gt;&lt;/tr&gt;&#96;).join('\\n');
  return &#96;&lt;table&gt;\\n&lt;thead&gt;&#36;{th}&lt;/thead&gt;\\n&lt;tbody&gt;\\n&#36;{rows}\\n&lt;/tbody&gt;\\n&lt;/table&gt;&#96;;
}</code></pre></details>
<p>After B's grant, A = (1 0 1 0) and D can still finish first, so the request is granted. Then E asks for the last printer: A would become (1 0 0 0), and no row of "still needed" fits — nobody can be guaranteed to finish. The book writes "leads to deadlock"; strictly the state is <em>unsafe</em> (a deadlock could follow if the processes ask for their maxima). Either way E's request is deferred.</p>
<p class="pitfall">⚠️ FE: the purpose of the "maximum demand" matrix in the banker's algorithm → <strong>to record the maximum resources each process may need during its execution</strong> (FE4#48, FE8#47, FE11#47, FE16#47); the algorithm "commonly used to determine whether the resource allocation state is safe" → <strong>banker's</strong> (FE5#48, FE8#48), not Dijkstra's shortest path or Kruskal.</p>`,
        `<p class="y-chinh">🎯 Hình 6-12: thuật toán nhà băng với nhiều loại tài nguyên. Năm tiến trình A–E, bốn loại (ổ băng từ, máy vẽ, máy in, ổ CD-ROM). Ma trận trái: <strong>tài nguyên đã cấp</strong> (C); ma trận phải: <strong>tài nguyên còn cần</strong> (Max − C). E = (6 3 4 2) tồn tại, P = (5 3 2 2) đang bị giữ (tổng của C), A = E − P = (1 0 2 0) khả dụng.</p>
<p>Cùng các cấu trúc của việc phát hiện (slide 16), chỉ thay ma trận yêu cầu bằng "còn cần". Câu hỏi "trạng thái này có an toàn không?" được trả lời bằng phép tìm của slide 21, làm với vector: tìm một hàng "còn cần" ≤ A, cho tiến trình đó chạy xong, cộng hàng "đã cấp" của nó vào A, lặp lại. Bộ mô phỏng ghi lại mọi phép so, kể cả các lần trượt:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7c33e63138923583de605f45b2d04ab839a23a0c.svg" alt="Tính lại Hình 6-12: D trước, rồi E, A, B, C — trạng thái an toàn" loading="lazy" /><p class="chu-thich">🧮 Tính lại Hình 6-12: D trước, rồi E, A, B, C — trạng thái an toàn</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Allocation (tape plotter printer CD)</th><th>Max</th><th>Need = Max − Allocation</th></tr></thead>
<tbody>
<tr><td>A</td><td>3 0 1 1</td><td>4 1 1 1</td><td>1 1 0 0</td></tr>
<tr><td>B</td><td>0 1 0 0</td><td>0 2 1 2</td><td>0 1 1 2</td></tr>
<tr><td>C</td><td>1 1 1 0</td><td>4 2 1 0</td><td>3 1 0 0</td></tr>
<tr><td>D</td><td>1 1 0 1</td><td>1 1 1 1</td><td>0 0 1 0</td></tr>
<tr><td>E</td><td>0 0 0 0</td><td>2 1 1 0</td><td>2 1 1 0</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TANEN = {   // Hình 6-12 — 4 loại: tape drives, plotters, printers, CD-ROMs
  ten: ['A', 'B', 'C', 'D', 'E'], loai: ['tape', 'plotter', 'printer', 'CD'],
  giu: [[3, 0, 1, 1], [0, 1, 0, 0], [1, 1, 1, 0], [1, 1, 0, 1], [0, 0, 0, 0]],
  can: [[1, 1, 0, 0], [0, 1, 1, 2], [3, 1, 0, 0], [0, 0, 1, 0], [2, 1, 1, 0]],
  E: [6, 3, 4, 2],
};
const SILB = {    // FE1#28: A = 10, B = 5, C = 7
  ten: ['P0', 'P1', 'P2', 'P3', 'P4'], loai: ['A', 'B', 'C'],
  giu: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
  max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
  E: [10, 5, 7],
};
const FE17 = {    // FE17#28 — ảnh đề gốc: A 10211/11212, B 20110/22210, C 11011/21311, D 11010/11121, Available 00x11
  ten: ['A', 'B', 'C', 'D'], loai: ['R1', 'R2', 'R3', 'R4', 'R5'],
  giu: [[1, 0, 2, 1, 1], [2, 0, 1, 1, 0], [1, 1, 0, 1, 1], [1, 1, 0, 1, 0]],
  max: [[1, 1, 2, 1, 2], [2, 2, 2, 1, 0], [2, 1, 3, 1, 1], [1, 1, 1, 2, 1]],
};
const QUIZ = {    // quiz Chương 6 câu 1–2 — dữ liệu mới
  ten: ['P0', 'P1', 'P2', 'P3'], loai: ['A', 'B', 'C'], E: [8, 5, 6],
  giu: [[2, 1, 0], [1, 0, 2], [3, 1, 1], [0, 2, 1]], max: [[5, 3, 2], [3, 2, 2], [4, 1, 3], [2, 4, 3]],
  phuongAn: [[1, 2, 3, 0], [0, 2, 3, 1], [2, 3, 0, 1], [3, 2, 0, 1]],
};
const tong = (rows) =&gt; rows.reduce((s, r) =&gt; s.map((x, k) =&gt; x + r[k]));
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Lặp lại phép quét vòng để GHI VẾT cả lần trượt; kết quả phải trùng antToan. */
function vet({ ten, giu, can, A }) {
  const n = ten.length, xong = Array(n).fill(false), dong = [];
  let work = [...A], tu = 0, chuoi = [];
  for (;;) {
    let chon = -1;
    for (let k = 0; k &lt; n; k++) {
      const i = (tu + k) % n;
      if (xong[i]) continue;
      const ok = can[i].every((x, j) =&gt; x &lt;= work[j]);
      if (ok) { chon = i; break; }
      dong.push({ i, ok: false, work: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, j) =&gt; x + giu[chon][j]);
    dong.push({ i: chon, ok: true, work: [...work], sau });
    work = sau; xong[chon] = true; chuoi.push(chon); tu = (chon + 1) % n;
  }
  const r = antToan({ conLai: A, giuLai: giu, canThem: can });
  if (r.chuoi.join() !== chuoi.join()) throw new Error(&#96;vết ≠ antToan: &#36;{chuoi} vs &#36;{r.chuoi}&#96;);
  // bỏ bớt các lần trượt lặp lại liền nhau của cùng một vòng (giữ bảng gọn): giữ tối đa 12 dòng trượt
  return { dong, chuoi, anToan: r.anToan, ket: r.ket, work };
}

function bangVet({ tieuDe, phuDe, ten, giu, can, A, t, chuThich = [] }) {
  const r = vet({ ten, giu, can, A });
  const hang = r.dong.map((d, k) =&gt; [k + 1, ten[d.i], v(can[d.i]), v(d.work), d.ok ? t('yes', 'có') : t('no', 'không'), d.ok ? &#96;&#36;{v(d.work)} + &#36;{v(giu[d.i])} = &#36;{v(d.sau)}&#96; : '—']);
  const ket = r.anToan
    ? t(&#96;SAFE — safe sequence &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;, &#96;AN TOÀN — chuỗi an toàn &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;)
    : t(&#96;NOT SAFE — no order is guaranteed to finish &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')}&#96;, &#96;KHÔNG AN TOÀN — không thứ tự nào chắc chắn cho &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} chạy xong&#96;);
  const svg = bangSvg({
    tieuDe, phuDe,
    cot: [t('Step', 'Bước'), t('Process', 'Tiến trình'), 'Need', t('Work (A)', 'Work (A)'), 'Need ≤ Work?', t('finishes, gives back', 'chạy xong, trả lại')],
    hang, mauHang: (i) =&gt; (r.dong[i].ok ? MAU.totNen : null), dam: (i, j) =&gt; j === 1 &amp;&amp; r.dong[i].ok,
    chuThich: [ket, ...chuThich],
  });
  return { svg, r, ket };
}

function bangMaTran({ ten, loai, giu, can, max, t }) {
  const th = &#96;&lt;tr&gt;&lt;th&gt;&#36;{t('Process', 'Tiến trình')}&lt;/th&gt;&lt;th&gt;Allocation (&#36;{loai.join(' ')})&lt;/th&gt;&#36;{max ? &#96;&lt;th&gt;Max&lt;/th&gt;&#96; : ''}&lt;th&gt;Need = Max − Allocation&lt;/th&gt;&lt;/tr&gt;&#96;;
  const rows = ten.map((p, i) =&gt; &#96;&lt;tr&gt;&lt;td&gt;&#36;{p}&lt;/td&gt;&lt;td&gt;&#36;{giu[i].join(' ')}&lt;/td&gt;&#36;{max ? &#96;&lt;td&gt;&#36;{max[i].join(' ')}&lt;/td&gt;&#96; : ''}&lt;td&gt;&#36;{can[i].join(' ')}&lt;/td&gt;&lt;/tr&gt;&#96;).join('\\n');
  return &#96;&lt;table&gt;\\n&lt;thead&gt;&#36;{th}&lt;/thead&gt;\\n&lt;tbody&gt;\\n&#36;{rows}\\n&lt;/tbody&gt;\\n&lt;/table&gt;&#96;;
}</code></pre></details>
<p>Lúc đầu chỉ D vừa (nó cần một máy in, và còn trống hai). D trả (1 1 0 1), A thành (2 1 2 1); rồi E, A, B, C lần lượt vừa. Sách viết "D chạy được, rồi A hoặc E, sau đó tới những tiến trình còn lại" — cách quét của ta, đi tiếp vòng tròn sau D, chọn E trước; cả hai đều hợp lệ. Trạng thái an toàn.</p>
<p>➕ Giờ là hai yêu cầu của sách, mỗi cái được kiểm bằng cách "giả vờ cấp, rồi kiểm trạng thái mới":</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/0dbeee5bad3b740bc61dcccb976d6d57ac624dcc.svg" alt="B xin một máy in: trạng thái sau khi cấp vẫn an toàn — cấp" loading="lazy" /><p class="chu-thich">🧮 B xin một máy in: trạng thái sau khi cấp vẫn an toàn — cấp</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TANEN = {   // Hình 6-12 — 4 loại: tape drives, plotters, printers, CD-ROMs
  ten: ['A', 'B', 'C', 'D', 'E'], loai: ['tape', 'plotter', 'printer', 'CD'],
  giu: [[3, 0, 1, 1], [0, 1, 0, 0], [1, 1, 1, 0], [1, 1, 0, 1], [0, 0, 0, 0]],
  can: [[1, 1, 0, 0], [0, 1, 1, 2], [3, 1, 0, 0], [0, 0, 1, 0], [2, 1, 1, 0]],
  E: [6, 3, 4, 2],
};
const SILB = {    // FE1#28: A = 10, B = 5, C = 7
  ten: ['P0', 'P1', 'P2', 'P3', 'P4'], loai: ['A', 'B', 'C'],
  giu: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
  max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
  E: [10, 5, 7],
};
const FE17 = {    // FE17#28 — ảnh đề gốc: A 10211/11212, B 20110/22210, C 11011/21311, D 11010/11121, Available 00x11
  ten: ['A', 'B', 'C', 'D'], loai: ['R1', 'R2', 'R3', 'R4', 'R5'],
  giu: [[1, 0, 2, 1, 1], [2, 0, 1, 1, 0], [1, 1, 0, 1, 1], [1, 1, 0, 1, 0]],
  max: [[1, 1, 2, 1, 2], [2, 2, 2, 1, 0], [2, 1, 3, 1, 1], [1, 1, 1, 2, 1]],
};
const QUIZ = {    // quiz Chương 6 câu 1–2 — dữ liệu mới
  ten: ['P0', 'P1', 'P2', 'P3'], loai: ['A', 'B', 'C'], E: [8, 5, 6],
  giu: [[2, 1, 0], [1, 0, 2], [3, 1, 1], [0, 2, 1]], max: [[5, 3, 2], [3, 2, 2], [4, 1, 3], [2, 4, 3]],
  phuongAn: [[1, 2, 3, 0], [0, 2, 3, 1], [2, 3, 0, 1], [3, 2, 0, 1]],
};
const tong = (rows) =&gt; rows.reduce((s, r) =&gt; s.map((x, k) =&gt; x + r[k]));
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Lặp lại phép quét vòng để GHI VẾT cả lần trượt; kết quả phải trùng antToan. */
function vet({ ten, giu, can, A }) {
  const n = ten.length, xong = Array(n).fill(false), dong = [];
  let work = [...A], tu = 0, chuoi = [];
  for (;;) {
    let chon = -1;
    for (let k = 0; k &lt; n; k++) {
      const i = (tu + k) % n;
      if (xong[i]) continue;
      const ok = can[i].every((x, j) =&gt; x &lt;= work[j]);
      if (ok) { chon = i; break; }
      dong.push({ i, ok: false, work: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, j) =&gt; x + giu[chon][j]);
    dong.push({ i: chon, ok: true, work: [...work], sau });
    work = sau; xong[chon] = true; chuoi.push(chon); tu = (chon + 1) % n;
  }
  const r = antToan({ conLai: A, giuLai: giu, canThem: can });
  if (r.chuoi.join() !== chuoi.join()) throw new Error(&#96;vết ≠ antToan: &#36;{chuoi} vs &#36;{r.chuoi}&#96;);
  // bỏ bớt các lần trượt lặp lại liền nhau của cùng một vòng (giữ bảng gọn): giữ tối đa 12 dòng trượt
  return { dong, chuoi, anToan: r.anToan, ket: r.ket, work };
}

function bangVet({ tieuDe, phuDe, ten, giu, can, A, t, chuThich = [] }) {
  const r = vet({ ten, giu, can, A });
  const hang = r.dong.map((d, k) =&gt; [k + 1, ten[d.i], v(can[d.i]), v(d.work), d.ok ? t('yes', 'có') : t('no', 'không'), d.ok ? &#96;&#36;{v(d.work)} + &#36;{v(giu[d.i])} = &#36;{v(d.sau)}&#96; : '—']);
  const ket = r.anToan
    ? t(&#96;SAFE — safe sequence &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;, &#96;AN TOÀN — chuỗi an toàn &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;)
    : t(&#96;NOT SAFE — no order is guaranteed to finish &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')}&#96;, &#96;KHÔNG AN TOÀN — không thứ tự nào chắc chắn cho &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} chạy xong&#96;);
  const svg = bangSvg({
    tieuDe, phuDe,
    cot: [t('Step', 'Bước'), t('Process', 'Tiến trình'), 'Need', t('Work (A)', 'Work (A)'), 'Need ≤ Work?', t('finishes, gives back', 'chạy xong, trả lại')],
    hang, mauHang: (i) =&gt; (r.dong[i].ok ? MAU.totNen : null), dam: (i, j) =&gt; j === 1 &amp;&amp; r.dong[i].ok,
    chuThich: [ket, ...chuThich],
  });
  return { svg, r, ket };
}

function bangMaTran({ ten, loai, giu, can, max, t }) {
  const th = &#96;&lt;tr&gt;&lt;th&gt;&#36;{t('Process', 'Tiến trình')}&lt;/th&gt;&lt;th&gt;Allocation (&#36;{loai.join(' ')})&lt;/th&gt;&#36;{max ? &#96;&lt;th&gt;Max&lt;/th&gt;&#96; : ''}&lt;th&gt;Need = Max − Allocation&lt;/th&gt;&lt;/tr&gt;&#96;;
  const rows = ten.map((p, i) =&gt; &#96;&lt;tr&gt;&lt;td&gt;&#36;{p}&lt;/td&gt;&lt;td&gt;&#36;{giu[i].join(' ')}&lt;/td&gt;&#36;{max ? &#96;&lt;td&gt;&#36;{max[i].join(' ')}&lt;/td&gt;&#96; : ''}&lt;td&gt;&#36;{can[i].join(' ')}&lt;/td&gt;&lt;/tr&gt;&#96;).join('\\n');
  return &#96;&lt;table&gt;\\n&lt;thead&gt;&#36;{th}&lt;/thead&gt;\\n&lt;tbody&gt;\\n&#36;{rows}\\n&lt;/tbody&gt;\\n&lt;/table&gt;&#96;;
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f4c6e4fe7b99a1fa36cc171608e2582d99267429.svg" alt="Rồi E xin máy in cuối cùng: trạng thái sau khi cấp không an toàn — E phải chờ" loading="lazy" /><p class="chu-thich">🧮 Rồi E xin máy in cuối cùng: trạng thái sau khi cấp không an toàn — E phải chờ</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TANEN = {   // Hình 6-12 — 4 loại: tape drives, plotters, printers, CD-ROMs
  ten: ['A', 'B', 'C', 'D', 'E'], loai: ['tape', 'plotter', 'printer', 'CD'],
  giu: [[3, 0, 1, 1], [0, 1, 0, 0], [1, 1, 1, 0], [1, 1, 0, 1], [0, 0, 0, 0]],
  can: [[1, 1, 0, 0], [0, 1, 1, 2], [3, 1, 0, 0], [0, 0, 1, 0], [2, 1, 1, 0]],
  E: [6, 3, 4, 2],
};
const SILB = {    // FE1#28: A = 10, B = 5, C = 7
  ten: ['P0', 'P1', 'P2', 'P3', 'P4'], loai: ['A', 'B', 'C'],
  giu: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
  max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
  E: [10, 5, 7],
};
const FE17 = {    // FE17#28 — ảnh đề gốc: A 10211/11212, B 20110/22210, C 11011/21311, D 11010/11121, Available 00x11
  ten: ['A', 'B', 'C', 'D'], loai: ['R1', 'R2', 'R3', 'R4', 'R5'],
  giu: [[1, 0, 2, 1, 1], [2, 0, 1, 1, 0], [1, 1, 0, 1, 1], [1, 1, 0, 1, 0]],
  max: [[1, 1, 2, 1, 2], [2, 2, 2, 1, 0], [2, 1, 3, 1, 1], [1, 1, 1, 2, 1]],
};
const QUIZ = {    // quiz Chương 6 câu 1–2 — dữ liệu mới
  ten: ['P0', 'P1', 'P2', 'P3'], loai: ['A', 'B', 'C'], E: [8, 5, 6],
  giu: [[2, 1, 0], [1, 0, 2], [3, 1, 1], [0, 2, 1]], max: [[5, 3, 2], [3, 2, 2], [4, 1, 3], [2, 4, 3]],
  phuongAn: [[1, 2, 3, 0], [0, 2, 3, 1], [2, 3, 0, 1], [3, 2, 0, 1]],
};
const tong = (rows) =&gt; rows.reduce((s, r) =&gt; s.map((x, k) =&gt; x + r[k]));
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Lặp lại phép quét vòng để GHI VẾT cả lần trượt; kết quả phải trùng antToan. */
function vet({ ten, giu, can, A }) {
  const n = ten.length, xong = Array(n).fill(false), dong = [];
  let work = [...A], tu = 0, chuoi = [];
  for (;;) {
    let chon = -1;
    for (let k = 0; k &lt; n; k++) {
      const i = (tu + k) % n;
      if (xong[i]) continue;
      const ok = can[i].every((x, j) =&gt; x &lt;= work[j]);
      if (ok) { chon = i; break; }
      dong.push({ i, ok: false, work: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, j) =&gt; x + giu[chon][j]);
    dong.push({ i: chon, ok: true, work: [...work], sau });
    work = sau; xong[chon] = true; chuoi.push(chon); tu = (chon + 1) % n;
  }
  const r = antToan({ conLai: A, giuLai: giu, canThem: can });
  if (r.chuoi.join() !== chuoi.join()) throw new Error(&#96;vết ≠ antToan: &#36;{chuoi} vs &#36;{r.chuoi}&#96;);
  // bỏ bớt các lần trượt lặp lại liền nhau của cùng một vòng (giữ bảng gọn): giữ tối đa 12 dòng trượt
  return { dong, chuoi, anToan: r.anToan, ket: r.ket, work };
}

function bangVet({ tieuDe, phuDe, ten, giu, can, A, t, chuThich = [] }) {
  const r = vet({ ten, giu, can, A });
  const hang = r.dong.map((d, k) =&gt; [k + 1, ten[d.i], v(can[d.i]), v(d.work), d.ok ? t('yes', 'có') : t('no', 'không'), d.ok ? &#96;&#36;{v(d.work)} + &#36;{v(giu[d.i])} = &#36;{v(d.sau)}&#96; : '—']);
  const ket = r.anToan
    ? t(&#96;SAFE — safe sequence &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;, &#96;AN TOÀN — chuỗi an toàn &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;)
    : t(&#96;NOT SAFE — no order is guaranteed to finish &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')}&#96;, &#96;KHÔNG AN TOÀN — không thứ tự nào chắc chắn cho &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} chạy xong&#96;);
  const svg = bangSvg({
    tieuDe, phuDe,
    cot: [t('Step', 'Bước'), t('Process', 'Tiến trình'), 'Need', t('Work (A)', 'Work (A)'), 'Need ≤ Work?', t('finishes, gives back', 'chạy xong, trả lại')],
    hang, mauHang: (i) =&gt; (r.dong[i].ok ? MAU.totNen : null), dam: (i, j) =&gt; j === 1 &amp;&amp; r.dong[i].ok,
    chuThich: [ket, ...chuThich],
  });
  return { svg, r, ket };
}

function bangMaTran({ ten, loai, giu, can, max, t }) {
  const th = &#96;&lt;tr&gt;&lt;th&gt;&#36;{t('Process', 'Tiến trình')}&lt;/th&gt;&lt;th&gt;Allocation (&#36;{loai.join(' ')})&lt;/th&gt;&#36;{max ? &#96;&lt;th&gt;Max&lt;/th&gt;&#96; : ''}&lt;th&gt;Need = Max − Allocation&lt;/th&gt;&lt;/tr&gt;&#96;;
  const rows = ten.map((p, i) =&gt; &#96;&lt;tr&gt;&lt;td&gt;&#36;{p}&lt;/td&gt;&lt;td&gt;&#36;{giu[i].join(' ')}&lt;/td&gt;&#36;{max ? &#96;&lt;td&gt;&#36;{max[i].join(' ')}&lt;/td&gt;&#96; : ''}&lt;td&gt;&#36;{can[i].join(' ')}&lt;/td&gt;&lt;/tr&gt;&#96;).join('\\n');
  return &#96;&lt;table&gt;\\n&lt;thead&gt;&#36;{th}&lt;/thead&gt;\\n&lt;tbody&gt;\\n&#36;{rows}\\n&lt;/tbody&gt;\\n&lt;/table&gt;&#96;;
}</code></pre></details>
<p>Sau khi cấp cho B, A = (1 0 1 0) và D vẫn chạy xong trước được, nên yêu cầu được cấp. Rồi E xin máy in cuối cùng: A sẽ thành (1 0 0 0), và không hàng "còn cần" nào vừa — không ai được bảo đảm chạy xong. Sách viết "leads to deadlock" (dẫn tới bế tắc); nói chặt thì trạng thái là <em>không an toàn</em> (bế tắc có thể theo sau nếu các tiến trình xin tới mức tối đa). Đằng nào thì yêu cầu của E cũng bị hoãn.</p>
<p class="pitfall">⚠️ FE: mục đích của ma trận "maximum demand" trong thuật toán nhà băng → <strong>ghi lại lượng tài nguyên tối đa mỗi tiến trình có thể cần trong suốt quá trình chạy</strong> (FE4#48, FE8#47, FE11#47, FE16#47); thuật toán "thường dùng để xác định trạng thái cấp phát có an toàn không" → <strong>nhà băng</strong> (FE5#48, FE8#48), không phải thuật toán đường đi ngắn nhất Dijkstra hay Kruskal.</p>`],
      [25, 'Banker’s Algorithm for Multiple Resources (2)',
        `<p class="y-chinh">🎯 The safety check: <strong>1.</strong> look for a row R whose unmet needs are all ≤ A — if none exists, the state is unsafe (the system <em>may</em> deadlock); <strong>2.</strong> assume that process gets everything it needs and finishes: mark it terminated and add its resources to A; <strong>3.</strong> repeat until all processes are terminated (the state is <strong>safe</strong>) or no process's needs can be met (<strong>unsafe</strong>).</p>
<p>⚠️ The slide says "system will eventually deadlock" in step 1 and "(deadlock)" in step 3. That is the book's worst-case shorthand; the precise word is <em>unsafe</em>: a deadlock is possible, not certain (slide 22). When several rows fit, it does not matter which one you pick — the conclusion is the same — but the <em>sequence</em> you write down depends on your choice. Exam questions that ask "which is the safe sequence?" therefore come with options, and you check each option instead of hoping your sequence is the same as the key.</p>
<p>The full request algorithm (Silberschatz's name for it, used in the older web lesson 6.2) checks three things in order when process i asks for a vector Request: (1) Request ≤ Need<sub>i</sub>, otherwise it is an <strong>error</strong> (it broke its promise); (2) Request ≤ A, otherwise it must <strong>wait</strong> (not enough free now); (3) pretend to grant and run the safety check — safe ⇒ <strong>grant</strong>, unsafe ⇒ <strong>defer</strong>. The newest FE paper asks exactly the safety check:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/516cd9a4a6ee7ad4259a5b8bbe5595da353d83ff.svg" alt="FE1#28 (SU26-RE) recomputed: the safe sequence P1 → P3 → P4 → P0 → P2, and the four options of the exam checked one by one" loading="lazy" /><p class="chu-thich">🧮 FE1#28 (SU26-RE) recomputed: the safe sequence P1 → P3 → P4 → P0 → P2, and the four options of the exam checked one by one</p></div>
<table>
<thead><tr><th>Process</th><th>Allocation (A B C)</th><th>Max</th><th>Need = Max − Allocation</th></tr></thead>
<tbody>
<tr><td>P0</td><td>0 1 0</td><td>7 5 3</td><td>7 4 3</td></tr>
<tr><td>P1</td><td>2 0 0</td><td>3 2 2</td><td>1 2 2</td></tr>
<tr><td>P2</td><td>3 0 2</td><td>9 0 2</td><td>6 0 0</td></tr>
<tr><td>P3</td><td>2 1 1</td><td>2 2 2</td><td>0 1 1</td></tr>
<tr><td>P4</td><td>0 0 2</td><td>4 3 3</td><td>4 3 1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Option of the exam</th><th>Checked by the simulator</th></tr></thead>
<tbody>
<tr><td>P1 → P3 → P4 → P0 → P2</td><td><strong>valid</strong> — every step fits</td></tr>
<tr><td>P0 → P2 → P3 → P1 → P4</td><td>breaks at P0: Need (7 4 3) does not fit</td></tr>
<tr><td>P1 → P0 → P2 → P3 → P4</td><td>breaks at P0: Need (7 4 3) does not fit</td></tr>
<tr><td>P2 → P1 → P0 → P4 → P3</td><td>breaks at P2: Need (6 0 0) does not fit</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TANEN = {   // Hình 6-12 — 4 loại: tape drives, plotters, printers, CD-ROMs
  ten: ['A', 'B', 'C', 'D', 'E'], loai: ['tape', 'plotter', 'printer', 'CD'],
  giu: [[3, 0, 1, 1], [0, 1, 0, 0], [1, 1, 1, 0], [1, 1, 0, 1], [0, 0, 0, 0]],
  can: [[1, 1, 0, 0], [0, 1, 1, 2], [3, 1, 0, 0], [0, 0, 1, 0], [2, 1, 1, 0]],
  E: [6, 3, 4, 2],
};
const SILB = {    // FE1#28: A = 10, B = 5, C = 7
  ten: ['P0', 'P1', 'P2', 'P3', 'P4'], loai: ['A', 'B', 'C'],
  giu: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
  max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
  E: [10, 5, 7],
};
const FE17 = {    // FE17#28 — ảnh đề gốc: A 10211/11212, B 20110/22210, C 11011/21311, D 11010/11121, Available 00x11
  ten: ['A', 'B', 'C', 'D'], loai: ['R1', 'R2', 'R3', 'R4', 'R5'],
  giu: [[1, 0, 2, 1, 1], [2, 0, 1, 1, 0], [1, 1, 0, 1, 1], [1, 1, 0, 1, 0]],
  max: [[1, 1, 2, 1, 2], [2, 2, 2, 1, 0], [2, 1, 3, 1, 1], [1, 1, 1, 2, 1]],
};
const QUIZ = {    // quiz Chương 6 câu 1–2 — dữ liệu mới
  ten: ['P0', 'P1', 'P2', 'P3'], loai: ['A', 'B', 'C'], E: [8, 5, 6],
  giu: [[2, 1, 0], [1, 0, 2], [3, 1, 1], [0, 2, 1]], max: [[5, 3, 2], [3, 2, 2], [4, 1, 3], [2, 4, 3]],
  phuongAn: [[1, 2, 3, 0], [0, 2, 3, 1], [2, 3, 0, 1], [3, 2, 0, 1]],
};
const tong = (rows) =&gt; rows.reduce((s, r) =&gt; s.map((x, k) =&gt; x + r[k]));
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Lặp lại phép quét vòng để GHI VẾT cả lần trượt; kết quả phải trùng antToan. */
function vet({ ten, giu, can, A }) {
  const n = ten.length, xong = Array(n).fill(false), dong = [];
  let work = [...A], tu = 0, chuoi = [];
  for (;;) {
    let chon = -1;
    for (let k = 0; k &lt; n; k++) {
      const i = (tu + k) % n;
      if (xong[i]) continue;
      const ok = can[i].every((x, j) =&gt; x &lt;= work[j]);
      if (ok) { chon = i; break; }
      dong.push({ i, ok: false, work: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, j) =&gt; x + giu[chon][j]);
    dong.push({ i: chon, ok: true, work: [...work], sau });
    work = sau; xong[chon] = true; chuoi.push(chon); tu = (chon + 1) % n;
  }
  const r = antToan({ conLai: A, giuLai: giu, canThem: can });
  if (r.chuoi.join() !== chuoi.join()) throw new Error(&#96;vết ≠ antToan: &#36;{chuoi} vs &#36;{r.chuoi}&#96;);
  // bỏ bớt các lần trượt lặp lại liền nhau của cùng một vòng (giữ bảng gọn): giữ tối đa 12 dòng trượt
  return { dong, chuoi, anToan: r.anToan, ket: r.ket, work };
}

function bangVet({ tieuDe, phuDe, ten, giu, can, A, t, chuThich = [] }) {
  const r = vet({ ten, giu, can, A });
  const hang = r.dong.map((d, k) =&gt; [k + 1, ten[d.i], v(can[d.i]), v(d.work), d.ok ? t('yes', 'có') : t('no', 'không'), d.ok ? &#96;&#36;{v(d.work)} + &#36;{v(giu[d.i])} = &#36;{v(d.sau)}&#96; : '—']);
  const ket = r.anToan
    ? t(&#96;SAFE — safe sequence &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;, &#96;AN TOÀN — chuỗi an toàn &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;)
    : t(&#96;NOT SAFE — no order is guaranteed to finish &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')}&#96;, &#96;KHÔNG AN TOÀN — không thứ tự nào chắc chắn cho &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} chạy xong&#96;);
  const svg = bangSvg({
    tieuDe, phuDe,
    cot: [t('Step', 'Bước'), t('Process', 'Tiến trình'), 'Need', t('Work (A)', 'Work (A)'), 'Need ≤ Work?', t('finishes, gives back', 'chạy xong, trả lại')],
    hang, mauHang: (i) =&gt; (r.dong[i].ok ? MAU.totNen : null), dam: (i, j) =&gt; j === 1 &amp;&amp; r.dong[i].ok,
    chuThich: [ket, ...chuThich],
  });
  return { svg, r, ket };
}

function bangMaTran({ ten, loai, giu, can, max, t }) {
  const th = &#96;&lt;tr&gt;&lt;th&gt;&#36;{t('Process', 'Tiến trình')}&lt;/th&gt;&lt;th&gt;Allocation (&#36;{loai.join(' ')})&lt;/th&gt;&#36;{max ? &#96;&lt;th&gt;Max&lt;/th&gt;&#96; : ''}&lt;th&gt;Need = Max − Allocation&lt;/th&gt;&lt;/tr&gt;&#96;;
  const rows = ten.map((p, i) =&gt; &#96;&lt;tr&gt;&lt;td&gt;&#36;{p}&lt;/td&gt;&lt;td&gt;&#36;{giu[i].join(' ')}&lt;/td&gt;&#36;{max ? &#96;&lt;td&gt;&#36;{max[i].join(' ')}&lt;/td&gt;&#96; : ''}&lt;td&gt;&#36;{can[i].join(' ')}&lt;/td&gt;&lt;/tr&gt;&#96;).join('\\n');
  return &#96;&lt;table&gt;\\n&lt;thead&gt;&#36;{th}&lt;/thead&gt;\\n&lt;tbody&gt;\\n&#36;{rows}\\n&lt;/tbody&gt;\\n&lt;/table&gt;&#96;;
}</code></pre></details>
<p>The scan finds P1 → P3 → P4 → P0 → P2, which is option A of the paper, and the table under the figure shows why the other three options break at their very first or second step (P0 and P2 need more than (3 3 2) at the start; P1 → P0 fails because P0 still needs (7 4 3)). Scanning from the start after every pick gives P1 → P3 → P0 → P2 → P4 instead — also safe, but not among the options. Two "smallest x" questions of the same kind:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/512ddc346985de0960f5d324ce5c5d09e32d28fc.svg" alt="FE25#14: Available (3 3 x) — the smallest safe x is 1" loading="lazy" /><p class="chu-thich">🧮 FE25#14: Available (3 3 x) — the smallest safe x is 1</p></div>
<table>
<thead><tr><th>Process</th><th>Allocation (A B C)</th><th>Max</th><th>Need = Max − Allocation</th></tr></thead>
<tbody>
<tr><td>A</td><td>0 1 0</td><td>7 5 3</td><td>7 4 3</td></tr>
<tr><td>B</td><td>2 0 0</td><td>3 2 2</td><td>1 2 2</td></tr>
<tr><td>C</td><td>3 0 2</td><td>9 0 2</td><td>6 0 0</td></tr>
<tr><td>D</td><td>2 1 1</td><td>2 2 2</td><td>0 1 1</td></tr>
<tr><td>E</td><td>0 0 2</td><td>4 3 3</td><td>4 3 1</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TANEN = {   // Hình 6-12 — 4 loại: tape drives, plotters, printers, CD-ROMs
  ten: ['A', 'B', 'C', 'D', 'E'], loai: ['tape', 'plotter', 'printer', 'CD'],
  giu: [[3, 0, 1, 1], [0, 1, 0, 0], [1, 1, 1, 0], [1, 1, 0, 1], [0, 0, 0, 0]],
  can: [[1, 1, 0, 0], [0, 1, 1, 2], [3, 1, 0, 0], [0, 0, 1, 0], [2, 1, 1, 0]],
  E: [6, 3, 4, 2],
};
const SILB = {    // FE1#28: A = 10, B = 5, C = 7
  ten: ['P0', 'P1', 'P2', 'P3', 'P4'], loai: ['A', 'B', 'C'],
  giu: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
  max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
  E: [10, 5, 7],
};
const FE17 = {    // FE17#28 — ảnh đề gốc: A 10211/11212, B 20110/22210, C 11011/21311, D 11010/11121, Available 00x11
  ten: ['A', 'B', 'C', 'D'], loai: ['R1', 'R2', 'R3', 'R4', 'R5'],
  giu: [[1, 0, 2, 1, 1], [2, 0, 1, 1, 0], [1, 1, 0, 1, 1], [1, 1, 0, 1, 0]],
  max: [[1, 1, 2, 1, 2], [2, 2, 2, 1, 0], [2, 1, 3, 1, 1], [1, 1, 1, 2, 1]],
};
const QUIZ = {    // quiz Chương 6 câu 1–2 — dữ liệu mới
  ten: ['P0', 'P1', 'P2', 'P3'], loai: ['A', 'B', 'C'], E: [8, 5, 6],
  giu: [[2, 1, 0], [1, 0, 2], [3, 1, 1], [0, 2, 1]], max: [[5, 3, 2], [3, 2, 2], [4, 1, 3], [2, 4, 3]],
  phuongAn: [[1, 2, 3, 0], [0, 2, 3, 1], [2, 3, 0, 1], [3, 2, 0, 1]],
};
const tong = (rows) =&gt; rows.reduce((s, r) =&gt; s.map((x, k) =&gt; x + r[k]));
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Lặp lại phép quét vòng để GHI VẾT cả lần trượt; kết quả phải trùng antToan. */
function vet({ ten, giu, can, A }) {
  const n = ten.length, xong = Array(n).fill(false), dong = [];
  let work = [...A], tu = 0, chuoi = [];
  for (;;) {
    let chon = -1;
    for (let k = 0; k &lt; n; k++) {
      const i = (tu + k) % n;
      if (xong[i]) continue;
      const ok = can[i].every((x, j) =&gt; x &lt;= work[j]);
      if (ok) { chon = i; break; }
      dong.push({ i, ok: false, work: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, j) =&gt; x + giu[chon][j]);
    dong.push({ i: chon, ok: true, work: [...work], sau });
    work = sau; xong[chon] = true; chuoi.push(chon); tu = (chon + 1) % n;
  }
  const r = antToan({ conLai: A, giuLai: giu, canThem: can });
  if (r.chuoi.join() !== chuoi.join()) throw new Error(&#96;vết ≠ antToan: &#36;{chuoi} vs &#36;{r.chuoi}&#96;);
  // bỏ bớt các lần trượt lặp lại liền nhau của cùng một vòng (giữ bảng gọn): giữ tối đa 12 dòng trượt
  return { dong, chuoi, anToan: r.anToan, ket: r.ket, work };
}

function bangVet({ tieuDe, phuDe, ten, giu, can, A, t, chuThich = [] }) {
  const r = vet({ ten, giu, can, A });
  const hang = r.dong.map((d, k) =&gt; [k + 1, ten[d.i], v(can[d.i]), v(d.work), d.ok ? t('yes', 'có') : t('no', 'không'), d.ok ? &#96;&#36;{v(d.work)} + &#36;{v(giu[d.i])} = &#36;{v(d.sau)}&#96; : '—']);
  const ket = r.anToan
    ? t(&#96;SAFE — safe sequence &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;, &#96;AN TOÀN — chuỗi an toàn &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;)
    : t(&#96;NOT SAFE — no order is guaranteed to finish &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')}&#96;, &#96;KHÔNG AN TOÀN — không thứ tự nào chắc chắn cho &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} chạy xong&#96;);
  const svg = bangSvg({
    tieuDe, phuDe,
    cot: [t('Step', 'Bước'), t('Process', 'Tiến trình'), 'Need', t('Work (A)', 'Work (A)'), 'Need ≤ Work?', t('finishes, gives back', 'chạy xong, trả lại')],
    hang, mauHang: (i) =&gt; (r.dong[i].ok ? MAU.totNen : null), dam: (i, j) =&gt; j === 1 &amp;&amp; r.dong[i].ok,
    chuThich: [ket, ...chuThich],
  });
  return { svg, r, ket };
}

function bangMaTran({ ten, loai, giu, can, max, t }) {
  const th = &#96;&lt;tr&gt;&lt;th&gt;&#36;{t('Process', 'Tiến trình')}&lt;/th&gt;&lt;th&gt;Allocation (&#36;{loai.join(' ')})&lt;/th&gt;&#36;{max ? &#96;&lt;th&gt;Max&lt;/th&gt;&#96; : ''}&lt;th&gt;Need = Max − Allocation&lt;/th&gt;&lt;/tr&gt;&#96;;
  const rows = ten.map((p, i) =&gt; &#96;&lt;tr&gt;&lt;td&gt;&#36;{p}&lt;/td&gt;&lt;td&gt;&#36;{giu[i].join(' ')}&lt;/td&gt;&#36;{max ? &#96;&lt;td&gt;&#36;{max[i].join(' ')}&lt;/td&gt;&#96; : ''}&lt;td&gt;&#36;{can[i].join(' ')}&lt;/td&gt;&lt;/tr&gt;&#96;).join('\\n');
  return &#96;&lt;table&gt;\\n&lt;thead&gt;&#36;{th}&lt;/thead&gt;\\n&lt;tbody&gt;\\n&#36;{rows}\\n&lt;/tbody&gt;\\n&lt;/table&gt;&#96;;
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d064c2a804ca8d452b352ec008daf90d917bc1b4.svg" alt="FE17#28: Available (0 0 x 1 1) — the smallest safe x is 1 (data checked against the original exam image)" loading="lazy" /><p class="chu-thich">🧮 FE17#28: Available (0 0 x 1 1) — the smallest safe x is 1 (data checked against the original exam image)</p></div>
<table>
<thead><tr><th>Process</th><th>Allocation (R1 R2 R3 R4 R5)</th><th>Max</th><th>Need = Max − Allocation</th></tr></thead>
<tbody>
<tr><td>A</td><td>1 0 2 1 1</td><td>1 1 2 1 2</td><td>0 1 0 0 1</td></tr>
<tr><td>B</td><td>2 0 1 1 0</td><td>2 2 2 1 0</td><td>0 2 1 0 0</td></tr>
<tr><td>C</td><td>1 1 0 1 1</td><td>2 1 3 1 1</td><td>1 0 3 0 0</td></tr>
<tr><td>D</td><td>1 1 0 1 0</td><td>1 1 1 2 1</td><td>0 0 1 1 1</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TANEN = {   // Hình 6-12 — 4 loại: tape drives, plotters, printers, CD-ROMs
  ten: ['A', 'B', 'C', 'D', 'E'], loai: ['tape', 'plotter', 'printer', 'CD'],
  giu: [[3, 0, 1, 1], [0, 1, 0, 0], [1, 1, 1, 0], [1, 1, 0, 1], [0, 0, 0, 0]],
  can: [[1, 1, 0, 0], [0, 1, 1, 2], [3, 1, 0, 0], [0, 0, 1, 0], [2, 1, 1, 0]],
  E: [6, 3, 4, 2],
};
const SILB = {    // FE1#28: A = 10, B = 5, C = 7
  ten: ['P0', 'P1', 'P2', 'P3', 'P4'], loai: ['A', 'B', 'C'],
  giu: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
  max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
  E: [10, 5, 7],
};
const FE17 = {    // FE17#28 — ảnh đề gốc: A 10211/11212, B 20110/22210, C 11011/21311, D 11010/11121, Available 00x11
  ten: ['A', 'B', 'C', 'D'], loai: ['R1', 'R2', 'R3', 'R4', 'R5'],
  giu: [[1, 0, 2, 1, 1], [2, 0, 1, 1, 0], [1, 1, 0, 1, 1], [1, 1, 0, 1, 0]],
  max: [[1, 1, 2, 1, 2], [2, 2, 2, 1, 0], [2, 1, 3, 1, 1], [1, 1, 1, 2, 1]],
};
const QUIZ = {    // quiz Chương 6 câu 1–2 — dữ liệu mới
  ten: ['P0', 'P1', 'P2', 'P3'], loai: ['A', 'B', 'C'], E: [8, 5, 6],
  giu: [[2, 1, 0], [1, 0, 2], [3, 1, 1], [0, 2, 1]], max: [[5, 3, 2], [3, 2, 2], [4, 1, 3], [2, 4, 3]],
  phuongAn: [[1, 2, 3, 0], [0, 2, 3, 1], [2, 3, 0, 1], [3, 2, 0, 1]],
};
const tong = (rows) =&gt; rows.reduce((s, r) =&gt; s.map((x, k) =&gt; x + r[k]));
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Lặp lại phép quét vòng để GHI VẾT cả lần trượt; kết quả phải trùng antToan. */
function vet({ ten, giu, can, A }) {
  const n = ten.length, xong = Array(n).fill(false), dong = [];
  let work = [...A], tu = 0, chuoi = [];
  for (;;) {
    let chon = -1;
    for (let k = 0; k &lt; n; k++) {
      const i = (tu + k) % n;
      if (xong[i]) continue;
      const ok = can[i].every((x, j) =&gt; x &lt;= work[j]);
      if (ok) { chon = i; break; }
      dong.push({ i, ok: false, work: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, j) =&gt; x + giu[chon][j]);
    dong.push({ i: chon, ok: true, work: [...work], sau });
    work = sau; xong[chon] = true; chuoi.push(chon); tu = (chon + 1) % n;
  }
  const r = antToan({ conLai: A, giuLai: giu, canThem: can });
  if (r.chuoi.join() !== chuoi.join()) throw new Error(&#96;vết ≠ antToan: &#36;{chuoi} vs &#36;{r.chuoi}&#96;);
  // bỏ bớt các lần trượt lặp lại liền nhau của cùng một vòng (giữ bảng gọn): giữ tối đa 12 dòng trượt
  return { dong, chuoi, anToan: r.anToan, ket: r.ket, work };
}

function bangVet({ tieuDe, phuDe, ten, giu, can, A, t, chuThich = [] }) {
  const r = vet({ ten, giu, can, A });
  const hang = r.dong.map((d, k) =&gt; [k + 1, ten[d.i], v(can[d.i]), v(d.work), d.ok ? t('yes', 'có') : t('no', 'không'), d.ok ? &#96;&#36;{v(d.work)} + &#36;{v(giu[d.i])} = &#36;{v(d.sau)}&#96; : '—']);
  const ket = r.anToan
    ? t(&#96;SAFE — safe sequence &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;, &#96;AN TOÀN — chuỗi an toàn &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;)
    : t(&#96;NOT SAFE — no order is guaranteed to finish &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')}&#96;, &#96;KHÔNG AN TOÀN — không thứ tự nào chắc chắn cho &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} chạy xong&#96;);
  const svg = bangSvg({
    tieuDe, phuDe,
    cot: [t('Step', 'Bước'), t('Process', 'Tiến trình'), 'Need', t('Work (A)', 'Work (A)'), 'Need ≤ Work?', t('finishes, gives back', 'chạy xong, trả lại')],
    hang, mauHang: (i) =&gt; (r.dong[i].ok ? MAU.totNen : null), dam: (i, j) =&gt; j === 1 &amp;&amp; r.dong[i].ok,
    chuThich: [ket, ...chuThich],
  });
  return { svg, r, ket };
}

function bangMaTran({ ten, loai, giu, can, max, t }) {
  const th = &#96;&lt;tr&gt;&lt;th&gt;&#36;{t('Process', 'Tiến trình')}&lt;/th&gt;&lt;th&gt;Allocation (&#36;{loai.join(' ')})&lt;/th&gt;&#36;{max ? &#96;&lt;th&gt;Max&lt;/th&gt;&#96; : ''}&lt;th&gt;Need = Max − Allocation&lt;/th&gt;&lt;/tr&gt;&#96;;
  const rows = ten.map((p, i) =&gt; &#96;&lt;tr&gt;&lt;td&gt;&#36;{p}&lt;/td&gt;&lt;td&gt;&#36;{giu[i].join(' ')}&lt;/td&gt;&#36;{max ? &#96;&lt;td&gt;&#36;{max[i].join(' ')}&lt;/td&gt;&#96; : ''}&lt;td&gt;&#36;{can[i].join(' ')}&lt;/td&gt;&lt;/tr&gt;&#96;).join('\\n');
  return &#96;&lt;table&gt;\\n&lt;thead&gt;&#36;{th}&lt;/thead&gt;\\n&lt;tbody&gt;\\n&#36;{rows}\\n&lt;/tbody&gt;\\n&lt;/table&gt;&#96;;
}</code></pre></details>
<p>➕ Why nobody runs it: the banker's algorithm is beautiful and almost useless in practice (the book says so). Processes rarely know their maximum needs in advance; the number of processes changes all the time (users log in and out, requests come and go); resources can disappear (a disk fails). And the check costs m × n² operations on every single request. General-purpose systems therefore use the ostrich plus prevention; databases use detection. Avoidance survives in special places — some real-time and embedded systems with a fixed set of tasks, and admission control (a cluster scheduler that admits a job only if its declared maximum memory can be guaranteed).</p>
<p class="pitfall">⚠️ FE: the weakness of the banker's algorithm → <strong>requiring that processes state their maximum needs in advance</strong> (FE18#34, FE20#35, FE25#23); before granting, it checks <strong>whether granting will lead to a safe state</strong> (FE2#36). FE2#49 keys "avoidance using banker's algorithm" for safety-critical systems while FE2#47 says prevention is favoured in real-time systems "without complex runtime checks" — both are bank keys; remember the reason in each.</p>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>The banker’s algorithm for several resource types, one Work vector at a time — exactly what you write on the exam paper.</p>
<div class="os-lab os-lab-sim-deadlock os-lab-p-banker os-lab-t-deadlock-banker"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> Need = Max − Allocation, then the safety scan <a href="/os-lab?sim=deadlock&amp;preset=banker&amp;lang=en&amp;tour=deadlock-banker" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Compute the Need matrix yourself, then compare with the simulator.</li><li>Step the scan and write the safe sequence it finds.</li><li>Make one request that leads to an unsafe state and see it refused.</li></ol></div>
</div>`,
        `<p class="y-chinh">🎯 Phép kiểm an toàn: <strong>1.</strong> tìm một hàng R mà mọi nhu cầu chưa đáp ứng đều ≤ A — không có thì trạng thái không an toàn (hệ thống <em>có thể</em> bế tắc); <strong>2.</strong> giả sử tiến trình đó nhận đủ mọi thứ nó cần và chạy xong: đánh dấu nó đã kết thúc và cộng tài nguyên của nó vào A; <strong>3.</strong> lặp lại tới khi mọi tiến trình đều kết thúc (trạng thái <strong>an toàn</strong>) hoặc không còn tiến trình nào được đáp ứng (<strong>không an toàn</strong>).</p>
<p>⚠️ Slide viết "system will eventually deadlock" ở bước 1 và "(deadlock)" ở bước 3. Đó là cách nói tắt theo trường hợp xấu nhất của sách; chữ chính xác là <em>không an toàn</em>: bế tắc là có thể, không phải chắc chắn (slide 22). Khi có nhiều hàng cùng vừa, chọn hàng nào cũng được — kết luận như nhau — nhưng <em>chuỗi</em> bạn viết ra phụ thuộc lựa chọn đó. Vì thế câu thi hỏi "chuỗi an toàn là chuỗi nào?" luôn đi kèm phương án, và bạn kiểm từng phương án thay vì mong chuỗi của mình trùng đáp án.</p>
<p>Thuật toán xin tài nguyên đầy đủ (tên Silberschatz đặt, dùng trong bài web cũ 6.2) kiểm ba điều theo thứ tự khi tiến trình i xin một vector Request: (1) Request ≤ Need<sub>i</sub>, nếu không là <strong>lỗi</strong> (nó phá lời hứa); (2) Request ≤ A, nếu không thì phải <strong>chờ</strong> (lúc này chưa đủ chỗ trống); (3) giả vờ cấp rồi chạy phép kiểm an toàn — an toàn ⇒ <strong>cấp</strong>, không an toàn ⇒ <strong>hoãn</strong>. Đề FE mới nhất hỏi đúng phép kiểm an toàn:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/048d4ba363b5ec80ba3ac9aa5e822432d101fdff.svg" alt="Tính lại FE1#28 (SU26-RE): chuỗi an toàn P1 → P3 → P4 → P0 → P2, và kiểm từng phương án của đề" loading="lazy" /><p class="chu-thich">🧮 Tính lại FE1#28 (SU26-RE): chuỗi an toàn P1 → P3 → P4 → P0 → P2, và kiểm từng phương án của đề</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Allocation (A B C)</th><th>Max</th><th>Need = Max − Allocation</th></tr></thead>
<tbody>
<tr><td>P0</td><td>0 1 0</td><td>7 5 3</td><td>7 4 3</td></tr>
<tr><td>P1</td><td>2 0 0</td><td>3 2 2</td><td>1 2 2</td></tr>
<tr><td>P2</td><td>3 0 2</td><td>9 0 2</td><td>6 0 0</td></tr>
<tr><td>P3</td><td>2 1 1</td><td>2 2 2</td><td>0 1 1</td></tr>
<tr><td>P4</td><td>0 0 2</td><td>4 3 3</td><td>4 3 1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Phương án của đề</th><th>Bộ mô phỏng kiểm</th></tr></thead>
<tbody>
<tr><td>P1 → P3 → P4 → P0 → P2</td><td><strong>hợp lệ</strong> — bước nào cũng vừa</td></tr>
<tr><td>P0 → P2 → P3 → P1 → P4</td><td>gãy ở P0: Need (7 4 3) không vừa</td></tr>
<tr><td>P1 → P0 → P2 → P3 → P4</td><td>gãy ở P0: Need (7 4 3) không vừa</td></tr>
<tr><td>P2 → P1 → P0 → P4 → P3</td><td>gãy ở P2: Need (6 0 0) không vừa</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TANEN = {   // Hình 6-12 — 4 loại: tape drives, plotters, printers, CD-ROMs
  ten: ['A', 'B', 'C', 'D', 'E'], loai: ['tape', 'plotter', 'printer', 'CD'],
  giu: [[3, 0, 1, 1], [0, 1, 0, 0], [1, 1, 1, 0], [1, 1, 0, 1], [0, 0, 0, 0]],
  can: [[1, 1, 0, 0], [0, 1, 1, 2], [3, 1, 0, 0], [0, 0, 1, 0], [2, 1, 1, 0]],
  E: [6, 3, 4, 2],
};
const SILB = {    // FE1#28: A = 10, B = 5, C = 7
  ten: ['P0', 'P1', 'P2', 'P3', 'P4'], loai: ['A', 'B', 'C'],
  giu: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
  max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
  E: [10, 5, 7],
};
const FE17 = {    // FE17#28 — ảnh đề gốc: A 10211/11212, B 20110/22210, C 11011/21311, D 11010/11121, Available 00x11
  ten: ['A', 'B', 'C', 'D'], loai: ['R1', 'R2', 'R3', 'R4', 'R5'],
  giu: [[1, 0, 2, 1, 1], [2, 0, 1, 1, 0], [1, 1, 0, 1, 1], [1, 1, 0, 1, 0]],
  max: [[1, 1, 2, 1, 2], [2, 2, 2, 1, 0], [2, 1, 3, 1, 1], [1, 1, 1, 2, 1]],
};
const QUIZ = {    // quiz Chương 6 câu 1–2 — dữ liệu mới
  ten: ['P0', 'P1', 'P2', 'P3'], loai: ['A', 'B', 'C'], E: [8, 5, 6],
  giu: [[2, 1, 0], [1, 0, 2], [3, 1, 1], [0, 2, 1]], max: [[5, 3, 2], [3, 2, 2], [4, 1, 3], [2, 4, 3]],
  phuongAn: [[1, 2, 3, 0], [0, 2, 3, 1], [2, 3, 0, 1], [3, 2, 0, 1]],
};
const tong = (rows) =&gt; rows.reduce((s, r) =&gt; s.map((x, k) =&gt; x + r[k]));
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Lặp lại phép quét vòng để GHI VẾT cả lần trượt; kết quả phải trùng antToan. */
function vet({ ten, giu, can, A }) {
  const n = ten.length, xong = Array(n).fill(false), dong = [];
  let work = [...A], tu = 0, chuoi = [];
  for (;;) {
    let chon = -1;
    for (let k = 0; k &lt; n; k++) {
      const i = (tu + k) % n;
      if (xong[i]) continue;
      const ok = can[i].every((x, j) =&gt; x &lt;= work[j]);
      if (ok) { chon = i; break; }
      dong.push({ i, ok: false, work: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, j) =&gt; x + giu[chon][j]);
    dong.push({ i: chon, ok: true, work: [...work], sau });
    work = sau; xong[chon] = true; chuoi.push(chon); tu = (chon + 1) % n;
  }
  const r = antToan({ conLai: A, giuLai: giu, canThem: can });
  if (r.chuoi.join() !== chuoi.join()) throw new Error(&#96;vết ≠ antToan: &#36;{chuoi} vs &#36;{r.chuoi}&#96;);
  // bỏ bớt các lần trượt lặp lại liền nhau của cùng một vòng (giữ bảng gọn): giữ tối đa 12 dòng trượt
  return { dong, chuoi, anToan: r.anToan, ket: r.ket, work };
}

function bangVet({ tieuDe, phuDe, ten, giu, can, A, t, chuThich = [] }) {
  const r = vet({ ten, giu, can, A });
  const hang = r.dong.map((d, k) =&gt; [k + 1, ten[d.i], v(can[d.i]), v(d.work), d.ok ? t('yes', 'có') : t('no', 'không'), d.ok ? &#96;&#36;{v(d.work)} + &#36;{v(giu[d.i])} = &#36;{v(d.sau)}&#96; : '—']);
  const ket = r.anToan
    ? t(&#96;SAFE — safe sequence &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;, &#96;AN TOÀN — chuỗi an toàn &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;)
    : t(&#96;NOT SAFE — no order is guaranteed to finish &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')}&#96;, &#96;KHÔNG AN TOÀN — không thứ tự nào chắc chắn cho &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} chạy xong&#96;);
  const svg = bangSvg({
    tieuDe, phuDe,
    cot: [t('Step', 'Bước'), t('Process', 'Tiến trình'), 'Need', t('Work (A)', 'Work (A)'), 'Need ≤ Work?', t('finishes, gives back', 'chạy xong, trả lại')],
    hang, mauHang: (i) =&gt; (r.dong[i].ok ? MAU.totNen : null), dam: (i, j) =&gt; j === 1 &amp;&amp; r.dong[i].ok,
    chuThich: [ket, ...chuThich],
  });
  return { svg, r, ket };
}

function bangMaTran({ ten, loai, giu, can, max, t }) {
  const th = &#96;&lt;tr&gt;&lt;th&gt;&#36;{t('Process', 'Tiến trình')}&lt;/th&gt;&lt;th&gt;Allocation (&#36;{loai.join(' ')})&lt;/th&gt;&#36;{max ? &#96;&lt;th&gt;Max&lt;/th&gt;&#96; : ''}&lt;th&gt;Need = Max − Allocation&lt;/th&gt;&lt;/tr&gt;&#96;;
  const rows = ten.map((p, i) =&gt; &#96;&lt;tr&gt;&lt;td&gt;&#36;{p}&lt;/td&gt;&lt;td&gt;&#36;{giu[i].join(' ')}&lt;/td&gt;&#36;{max ? &#96;&lt;td&gt;&#36;{max[i].join(' ')}&lt;/td&gt;&#96; : ''}&lt;td&gt;&#36;{can[i].join(' ')}&lt;/td&gt;&lt;/tr&gt;&#96;).join('\\n');
  return &#96;&lt;table&gt;\\n&lt;thead&gt;&#36;{th}&lt;/thead&gt;\\n&lt;tbody&gt;\\n&#36;{rows}\\n&lt;/tbody&gt;\\n&lt;/table&gt;&#96;;
}</code></pre></details>
<p>Phép quét tìm ra P1 → P3 → P4 → P0 → P2, đúng phương án A của đề, và bảng dưới hình cho thấy vì sao ba phương án còn lại gãy ngay bước đầu hoặc bước hai (P0 và P2 cần nhiều hơn (3 3 2) lúc đầu; P1 → P0 hỏng vì P0 còn cần (7 4 3)). Quét lại từ đầu sau mỗi lần chọn thì ra P1 → P3 → P0 → P2 → P4 — cũng an toàn, nhưng không có trong phương án. Hai câu "x nhỏ nhất" cùng kiểu:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3da6c47bfd6d0a788544779ffb3b3fa2755b5b52.svg" alt="FE25#14: Available (3 3 x) — x nhỏ nhất cho an toàn là 1" loading="lazy" /><p class="chu-thich">🧮 FE25#14: Available (3 3 x) — x nhỏ nhất cho an toàn là 1</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Allocation (A B C)</th><th>Max</th><th>Need = Max − Allocation</th></tr></thead>
<tbody>
<tr><td>A</td><td>0 1 0</td><td>7 5 3</td><td>7 4 3</td></tr>
<tr><td>B</td><td>2 0 0</td><td>3 2 2</td><td>1 2 2</td></tr>
<tr><td>C</td><td>3 0 2</td><td>9 0 2</td><td>6 0 0</td></tr>
<tr><td>D</td><td>2 1 1</td><td>2 2 2</td><td>0 1 1</td></tr>
<tr><td>E</td><td>0 0 2</td><td>4 3 3</td><td>4 3 1</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TANEN = {   // Hình 6-12 — 4 loại: tape drives, plotters, printers, CD-ROMs
  ten: ['A', 'B', 'C', 'D', 'E'], loai: ['tape', 'plotter', 'printer', 'CD'],
  giu: [[3, 0, 1, 1], [0, 1, 0, 0], [1, 1, 1, 0], [1, 1, 0, 1], [0, 0, 0, 0]],
  can: [[1, 1, 0, 0], [0, 1, 1, 2], [3, 1, 0, 0], [0, 0, 1, 0], [2, 1, 1, 0]],
  E: [6, 3, 4, 2],
};
const SILB = {    // FE1#28: A = 10, B = 5, C = 7
  ten: ['P0', 'P1', 'P2', 'P3', 'P4'], loai: ['A', 'B', 'C'],
  giu: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
  max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
  E: [10, 5, 7],
};
const FE17 = {    // FE17#28 — ảnh đề gốc: A 10211/11212, B 20110/22210, C 11011/21311, D 11010/11121, Available 00x11
  ten: ['A', 'B', 'C', 'D'], loai: ['R1', 'R2', 'R3', 'R4', 'R5'],
  giu: [[1, 0, 2, 1, 1], [2, 0, 1, 1, 0], [1, 1, 0, 1, 1], [1, 1, 0, 1, 0]],
  max: [[1, 1, 2, 1, 2], [2, 2, 2, 1, 0], [2, 1, 3, 1, 1], [1, 1, 1, 2, 1]],
};
const QUIZ = {    // quiz Chương 6 câu 1–2 — dữ liệu mới
  ten: ['P0', 'P1', 'P2', 'P3'], loai: ['A', 'B', 'C'], E: [8, 5, 6],
  giu: [[2, 1, 0], [1, 0, 2], [3, 1, 1], [0, 2, 1]], max: [[5, 3, 2], [3, 2, 2], [4, 1, 3], [2, 4, 3]],
  phuongAn: [[1, 2, 3, 0], [0, 2, 3, 1], [2, 3, 0, 1], [3, 2, 0, 1]],
};
const tong = (rows) =&gt; rows.reduce((s, r) =&gt; s.map((x, k) =&gt; x + r[k]));
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Lặp lại phép quét vòng để GHI VẾT cả lần trượt; kết quả phải trùng antToan. */
function vet({ ten, giu, can, A }) {
  const n = ten.length, xong = Array(n).fill(false), dong = [];
  let work = [...A], tu = 0, chuoi = [];
  for (;;) {
    let chon = -1;
    for (let k = 0; k &lt; n; k++) {
      const i = (tu + k) % n;
      if (xong[i]) continue;
      const ok = can[i].every((x, j) =&gt; x &lt;= work[j]);
      if (ok) { chon = i; break; }
      dong.push({ i, ok: false, work: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, j) =&gt; x + giu[chon][j]);
    dong.push({ i: chon, ok: true, work: [...work], sau });
    work = sau; xong[chon] = true; chuoi.push(chon); tu = (chon + 1) % n;
  }
  const r = antToan({ conLai: A, giuLai: giu, canThem: can });
  if (r.chuoi.join() !== chuoi.join()) throw new Error(&#96;vết ≠ antToan: &#36;{chuoi} vs &#36;{r.chuoi}&#96;);
  // bỏ bớt các lần trượt lặp lại liền nhau của cùng một vòng (giữ bảng gọn): giữ tối đa 12 dòng trượt
  return { dong, chuoi, anToan: r.anToan, ket: r.ket, work };
}

function bangVet({ tieuDe, phuDe, ten, giu, can, A, t, chuThich = [] }) {
  const r = vet({ ten, giu, can, A });
  const hang = r.dong.map((d, k) =&gt; [k + 1, ten[d.i], v(can[d.i]), v(d.work), d.ok ? t('yes', 'có') : t('no', 'không'), d.ok ? &#96;&#36;{v(d.work)} + &#36;{v(giu[d.i])} = &#36;{v(d.sau)}&#96; : '—']);
  const ket = r.anToan
    ? t(&#96;SAFE — safe sequence &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;, &#96;AN TOÀN — chuỗi an toàn &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;)
    : t(&#96;NOT SAFE — no order is guaranteed to finish &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')}&#96;, &#96;KHÔNG AN TOÀN — không thứ tự nào chắc chắn cho &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} chạy xong&#96;);
  const svg = bangSvg({
    tieuDe, phuDe,
    cot: [t('Step', 'Bước'), t('Process', 'Tiến trình'), 'Need', t('Work (A)', 'Work (A)'), 'Need ≤ Work?', t('finishes, gives back', 'chạy xong, trả lại')],
    hang, mauHang: (i) =&gt; (r.dong[i].ok ? MAU.totNen : null), dam: (i, j) =&gt; j === 1 &amp;&amp; r.dong[i].ok,
    chuThich: [ket, ...chuThich],
  });
  return { svg, r, ket };
}

function bangMaTran({ ten, loai, giu, can, max, t }) {
  const th = &#96;&lt;tr&gt;&lt;th&gt;&#36;{t('Process', 'Tiến trình')}&lt;/th&gt;&lt;th&gt;Allocation (&#36;{loai.join(' ')})&lt;/th&gt;&#36;{max ? &#96;&lt;th&gt;Max&lt;/th&gt;&#96; : ''}&lt;th&gt;Need = Max − Allocation&lt;/th&gt;&lt;/tr&gt;&#96;;
  const rows = ten.map((p, i) =&gt; &#96;&lt;tr&gt;&lt;td&gt;&#36;{p}&lt;/td&gt;&lt;td&gt;&#36;{giu[i].join(' ')}&lt;/td&gt;&#36;{max ? &#96;&lt;td&gt;&#36;{max[i].join(' ')}&lt;/td&gt;&#96; : ''}&lt;td&gt;&#36;{can[i].join(' ')}&lt;/td&gt;&lt;/tr&gt;&#96;).join('\\n');
  return &#96;&lt;table&gt;\\n&lt;thead&gt;&#36;{th}&lt;/thead&gt;\\n&lt;tbody&gt;\\n&#36;{rows}\\n&lt;/tbody&gt;\\n&lt;/table&gt;&#96;;
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6c7181d1e68c61ee514d93005eaee3c5a4c457bf.svg" alt="FE17#28: Available (0 0 x 1 1) — x nhỏ nhất cho an toàn là 1 (dữ liệu đã đối chiếu ảnh đề gốc)" loading="lazy" /><p class="chu-thich">🧮 FE17#28: Available (0 0 x 1 1) — x nhỏ nhất cho an toàn là 1 (dữ liệu đã đối chiếu ảnh đề gốc)</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Allocation (R1 R2 R3 R4 R5)</th><th>Max</th><th>Need = Max − Allocation</th></tr></thead>
<tbody>
<tr><td>A</td><td>1 0 2 1 1</td><td>1 1 2 1 2</td><td>0 1 0 0 1</td></tr>
<tr><td>B</td><td>2 0 1 1 0</td><td>2 2 2 1 0</td><td>0 2 1 0 0</td></tr>
<tr><td>C</td><td>1 1 0 1 1</td><td>2 1 3 1 1</td><td>1 0 3 0 0</td></tr>
<tr><td>D</td><td>1 1 0 1 0</td><td>1 1 1 2 1</td><td>0 0 1 1 1</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TANEN = {   // Hình 6-12 — 4 loại: tape drives, plotters, printers, CD-ROMs
  ten: ['A', 'B', 'C', 'D', 'E'], loai: ['tape', 'plotter', 'printer', 'CD'],
  giu: [[3, 0, 1, 1], [0, 1, 0, 0], [1, 1, 1, 0], [1, 1, 0, 1], [0, 0, 0, 0]],
  can: [[1, 1, 0, 0], [0, 1, 1, 2], [3, 1, 0, 0], [0, 0, 1, 0], [2, 1, 1, 0]],
  E: [6, 3, 4, 2],
};
const SILB = {    // FE1#28: A = 10, B = 5, C = 7
  ten: ['P0', 'P1', 'P2', 'P3', 'P4'], loai: ['A', 'B', 'C'],
  giu: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
  max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
  E: [10, 5, 7],
};
const FE17 = {    // FE17#28 — ảnh đề gốc: A 10211/11212, B 20110/22210, C 11011/21311, D 11010/11121, Available 00x11
  ten: ['A', 'B', 'C', 'D'], loai: ['R1', 'R2', 'R3', 'R4', 'R5'],
  giu: [[1, 0, 2, 1, 1], [2, 0, 1, 1, 0], [1, 1, 0, 1, 1], [1, 1, 0, 1, 0]],
  max: [[1, 1, 2, 1, 2], [2, 2, 2, 1, 0], [2, 1, 3, 1, 1], [1, 1, 1, 2, 1]],
};
const QUIZ = {    // quiz Chương 6 câu 1–2 — dữ liệu mới
  ten: ['P0', 'P1', 'P2', 'P3'], loai: ['A', 'B', 'C'], E: [8, 5, 6],
  giu: [[2, 1, 0], [1, 0, 2], [3, 1, 1], [0, 2, 1]], max: [[5, 3, 2], [3, 2, 2], [4, 1, 3], [2, 4, 3]],
  phuongAn: [[1, 2, 3, 0], [0, 2, 3, 1], [2, 3, 0, 1], [3, 2, 0, 1]],
};
const tong = (rows) =&gt; rows.reduce((s, r) =&gt; s.map((x, k) =&gt; x + r[k]));
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;

/** Lặp lại phép quét vòng để GHI VẾT cả lần trượt; kết quả phải trùng antToan. */
function vet({ ten, giu, can, A }) {
  const n = ten.length, xong = Array(n).fill(false), dong = [];
  let work = [...A], tu = 0, chuoi = [];
  for (;;) {
    let chon = -1;
    for (let k = 0; k &lt; n; k++) {
      const i = (tu + k) % n;
      if (xong[i]) continue;
      const ok = can[i].every((x, j) =&gt; x &lt;= work[j]);
      if (ok) { chon = i; break; }
      dong.push({ i, ok: false, work: [...work] });
    }
    if (chon &lt; 0) break;
    const sau = work.map((x, j) =&gt; x + giu[chon][j]);
    dong.push({ i: chon, ok: true, work: [...work], sau });
    work = sau; xong[chon] = true; chuoi.push(chon); tu = (chon + 1) % n;
  }
  const r = antToan({ conLai: A, giuLai: giu, canThem: can });
  if (r.chuoi.join() !== chuoi.join()) throw new Error(&#96;vết ≠ antToan: &#36;{chuoi} vs &#36;{r.chuoi}&#96;);
  // bỏ bớt các lần trượt lặp lại liền nhau của cùng một vòng (giữ bảng gọn): giữ tối đa 12 dòng trượt
  return { dong, chuoi, anToan: r.anToan, ket: r.ket, work };
}

function bangVet({ tieuDe, phuDe, ten, giu, can, A, t, chuThich = [] }) {
  const r = vet({ ten, giu, can, A });
  const hang = r.dong.map((d, k) =&gt; [k + 1, ten[d.i], v(can[d.i]), v(d.work), d.ok ? t('yes', 'có') : t('no', 'không'), d.ok ? &#96;&#36;{v(d.work)} + &#36;{v(giu[d.i])} = &#36;{v(d.sau)}&#96; : '—']);
  const ket = r.anToan
    ? t(&#96;SAFE — safe sequence &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;, &#96;AN TOÀN — chuỗi an toàn &#36;{r.chuoi.map((i) =&gt; ten[i]).join(' → ')}&#96;)
    : t(&#96;NOT SAFE — no order is guaranteed to finish &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')}&#96;, &#96;KHÔNG AN TOÀN — không thứ tự nào chắc chắn cho &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} chạy xong&#96;);
  const svg = bangSvg({
    tieuDe, phuDe,
    cot: [t('Step', 'Bước'), t('Process', 'Tiến trình'), 'Need', t('Work (A)', 'Work (A)'), 'Need ≤ Work?', t('finishes, gives back', 'chạy xong, trả lại')],
    hang, mauHang: (i) =&gt; (r.dong[i].ok ? MAU.totNen : null), dam: (i, j) =&gt; j === 1 &amp;&amp; r.dong[i].ok,
    chuThich: [ket, ...chuThich],
  });
  return { svg, r, ket };
}

function bangMaTran({ ten, loai, giu, can, max, t }) {
  const th = &#96;&lt;tr&gt;&lt;th&gt;&#36;{t('Process', 'Tiến trình')}&lt;/th&gt;&lt;th&gt;Allocation (&#36;{loai.join(' ')})&lt;/th&gt;&#36;{max ? &#96;&lt;th&gt;Max&lt;/th&gt;&#96; : ''}&lt;th&gt;Need = Max − Allocation&lt;/th&gt;&lt;/tr&gt;&#96;;
  const rows = ten.map((p, i) =&gt; &#96;&lt;tr&gt;&lt;td&gt;&#36;{p}&lt;/td&gt;&lt;td&gt;&#36;{giu[i].join(' ')}&lt;/td&gt;&#36;{max ? &#96;&lt;td&gt;&#36;{max[i].join(' ')}&lt;/td&gt;&#96; : ''}&lt;td&gt;&#36;{can[i].join(' ')}&lt;/td&gt;&lt;/tr&gt;&#96;).join('\\n');
  return &#96;&lt;table&gt;\\n&lt;thead&gt;&#36;{th}&lt;/thead&gt;\\n&lt;tbody&gt;\\n&#36;{rows}\\n&lt;/tbody&gt;\\n&lt;/table&gt;&#96;;
}</code></pre></details>
<p>➕ Vì sao chẳng ai chạy nó: thuật toán nhà băng đẹp nhưng gần như vô dụng trong thực tế (chính sách nói vậy). Tiến trình hiếm khi biết trước nhu cầu tối đa của mình; số tiến trình thay đổi liên tục (người dùng đăng nhập, đăng xuất, request tới rồi đi); tài nguyên có thể biến mất (một ổ đĩa hỏng). Và phép kiểm tốn m × n² phép tính ở từng lần xin. Vì vậy các hệ thống đa dụng dùng đà điểu cộng ngăn ngừa; cơ sở dữ liệu dùng phát hiện. Việc tránh bế tắc chỉ sống sót ở những chỗ đặc biệt — vài hệ thời gian thực và nhúng có tập tác vụ cố định, và kiểm soát nhận việc (admission control: một bộ lập lịch cụm chỉ nhận một job nếu bảo đảm được lượng bộ nhớ tối đa nó khai).</p>
<p class="pitfall">⚠️ FE: điểm yếu của thuật toán nhà băng → <strong>đòi tiến trình khai trước nhu cầu tối đa</strong> (FE18#34, FE20#35, FE25#23); trước khi cấp, nó kiểm <strong>việc cấp có dẫn tới trạng thái an toàn không</strong> (FE2#36). FE2#49 đánh dấu "tránh bằng thuật toán nhà băng" cho hệ thống an toàn-sống-còn, trong khi FE2#47 nói hệ thời gian thực ưa ngăn ngừa vì "không cần kiểm tra phức tạp lúc chạy" — cả hai đều là đáp án ngân hàng; hãy nhớ lý do của từng câu.</p>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>Thuật toán nhà băng cho nhiều loại tài nguyên, từng vector Work một — đúng thứ bạn viết lên giấy thi.</p>
<div class="os-lab os-lab-sim-deadlock os-lab-p-banker os-lab-t-deadlock-banker"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> Need = Max − Allocation, rồi vòng kiểm an toàn <a href="/os-lab?sim=deadlock&amp;preset=banker&amp;lang=vi&amp;tour=deadlock-banker" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Tự tính ma trận Need rồi so với mô phỏng.</li><li>Bấm từng bước quét và ghi chuỗi an toàn nó tìm ra.</li><li>Tạo một yêu cầu dẫn tới trạng thái không an toàn và xem nó bị từ chối.</li></ol></div>
</div>`],
      [26, 'Deadlock Prevention',
        `<p class="y-chinh">🎯 Prevention: make sure at least one of the four conditions can <strong>never</strong> be satisfied — attack <strong>mutual exclusion</strong>, <strong>hold and wait</strong>, <strong>no preemption</strong> or <strong>circular wait</strong>. Then deadlock is impossible by construction, with no detector and no banker.</p>
<p><strong>Attacking mutual exclusion</strong> (§6.6.1): if no resource were ever assigned exclusively to one process, there would be no deadlock. Data that is read-only can be shared freely. For printers the book proposes <em>spooling</em>: processes write output to a spool directory, and only the printer daemon touches the real printer — the daemon never requests another resource, so no deadlock involves the printer. But spooling only moves the problem: if two processes fill the spool disk with half-finished output and the daemon waits for complete jobs, they deadlock on the disk. General lesson: avoid assigning a resource unless absolutely necessary, and let as few processes as possible claim it.</p>
<p><strong>Attacking hold and wait</strong> (§6.6.2): (a) every process requests <em>all</em> its resources before starting — all or nothing; problems: many processes do not know what they will need, and resources sit idle while held "just in case". (b) a process that wants a new resource must first <em>release everything</em> it holds, then request all it needs at once. ➕ The modern version is <code>trylock</code>: take the first lock, <em>try</em> the second; if it is busy, give the first one back and retry — the thread never waits while holding:</p>
<pre><code class="language-c">// Breaking "hold and wait": take the first lock, TRY the second; if busy, give the first back and retry after a random pause
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;

pthread_mutex_t lock_a = PTHREAD_MUTEX_INITIALIZER, lock_b = PTHREAD_MUTEX_INITIALIZER;
long balance_a = 1000000, balance_b = 1000000, retries = 0;   // retries is only touched while holding a lock
pthread_mutex_t count_lock = PTHREAD_MUTEX_INITIALIZER;

void lock_both(pthread_mutex_t *first, pthread_mutex_t *second, unsigned *seed) {
    for (;;) {
        pthread_mutex_lock(first);
        if (pthread_mutex_trylock(second) == 0) return;     // got both
        pthread_mutex_unlock(first);                        // give back what we hold
        pthread_mutex_lock(&amp;count_lock); retries++; pthread_mutex_unlock(&amp;count_lock);
        usleep(rand_r(seed) % 200);                         // random back-off, 0–199 µs
    }
}

void *a_to_b(void *x) {
    unsigned seed = 1;
    for (int i = 0; i &lt; 20000; i++) {
        lock_both(&amp;lock_a, &amp;lock_b, &amp;seed);                 // order a, b
        balance_a -= 5; balance_b += 5;
        pthread_mutex_unlock(&amp;lock_b); pthread_mutex_unlock(&amp;lock_a);
    }
    return NULL;
}
void *b_to_a(void *x) {
    unsigned seed = 2;
    for (int i = 0; i &lt; 20000; i++) {
        lock_both(&amp;lock_b, &amp;lock_a, &amp;seed);                 // the OPPOSITE order — would deadlock with plain lock()
        balance_b -= 5; balance_a += 5;
        pthread_mutex_unlock(&amp;lock_a); pthread_mutex_unlock(&amp;lock_b);
    }
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    pthread_create(&amp;t1, NULL, a_to_b, NULL);
    pthread_create(&amp;t2, NULL, b_to_a, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("40000 transfers done, total = %ld\\n", balance_a + balance_b);
    printf("retries = %ld (times a thread had to give its first lock back)\\n", retries);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread trylock-lui.c -o trylock-lui &amp;&amp; ./trylock-lui<br>
40000 transfers done, total = 2000000<br>
retries = 5 (times a thread had to give its first lock back)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The two threads take the locks in opposite orders — with plain <code>lock()</code> this is the deadlock of slide 4 — yet all 40,000 transfers finished; the "retries" line counts how often a thread had to give its first lock back (one real run — the number changes from run to run). The random pause is important; without it the threads can give way to each other forever (livelock, slide 30).</p>
<p class="pitfall">⚠️ FE: "To ensure hold and wait never occurs, it must be ensured that ___" (FE2#37) — "whenever a process requests a resource it holds no other", "each process requests and is allocated all its resources before it begins" and "a process can request resources only when it has none" are all correct; the bank keys the first. "Which strategy prevents deadlock by requiring all resources at once?" → one-shot allocation (FE3#35); "the correct approach with hold and wait" → <strong>request all resources initially</strong> (FE17#3). "One way to prevent deadlock" → <strong>spool everything</strong> (FE17#1, FE26#4).</p>`,
        `<p class="y-chinh">🎯 Ngăn ngừa: bảo đảm ít nhất một trong bốn điều kiện <strong>không bao giờ</strong> được thoả — tấn công <strong>loại trừ lẫn nhau</strong>, <strong>giữ và chờ</strong>, <strong>không trưng dụng</strong> hoặc <strong>chờ vòng tròn</strong>. Khi đó bế tắc là không thể xảy ra ngay từ thiết kế, không cần bộ dò, không cần nhà băng.</p>
<p><strong>Tấn công loại trừ lẫn nhau</strong> (§6.6.1): nếu không tài nguyên nào bị cấp độc quyền cho một tiến trình thì sẽ không có bế tắc. Dữ liệu chỉ đọc thì chia sẻ thoải mái. Với máy in, sách đề xuất <em>spooling</em>: các tiến trình ghi output vào một thư mục spool, chỉ tiến trình nền máy in (printer daemon) chạm vào máy in thật — daemon không bao giờ xin thêm tài nguyên khác, nên không bế tắc nào dính tới máy in. Nhưng spooling chỉ dời vấn đề đi chỗ khác: nếu hai tiến trình làm đầy đĩa spool bằng output dở dang và daemon chờ đủ job mới in, chúng bế tắc trên đĩa. Bài học chung: tránh cấp tài nguyên khi không thật sự cần, và để càng ít tiến trình được giành nó càng tốt.</p>
<p><strong>Tấn công giữ và chờ</strong> (§6.6.2): (a) mọi tiến trình xin <em>tất cả</em> tài nguyên trước khi bắt đầu — được cả hoặc không gì cả; vấn đề: nhiều tiến trình không biết mình sẽ cần gì, và tài nguyên nằm không trong khi bị giữ "phòng khi". (b) tiến trình muốn tài nguyên mới phải <em>trả hết</em> những gì đang giữ trước, rồi xin một lần mọi thứ nó cần. ➕ Phiên bản hiện đại là <code>trylock</code>: lấy khoá thứ nhất, <em>thử</em> khoá thứ hai; nếu bận thì trả khoá thứ nhất rồi thử lại — luồng không bao giờ chờ trong khi đang giữ:</p>
<pre><code class="language-c">// Phá "giữ và chờ": lấy khoá thứ nhất, THỬ khoá thứ hai; bận thì trả khoá thứ nhất rồi thử lại sau một khoảng ngẫu nhiên
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;

pthread_mutex_t lock_a = PTHREAD_MUTEX_INITIALIZER, lock_b = PTHREAD_MUTEX_INITIALIZER;
long balance_a = 1000000, balance_b = 1000000, retries = 0;   // retries chỉ được sửa khi đang giữ một khoá
pthread_mutex_t count_lock = PTHREAD_MUTEX_INITIALIZER;

void lock_both(pthread_mutex_t *first, pthread_mutex_t *second, unsigned *seed) {
    for (;;) {
        pthread_mutex_lock(first);
        if (pthread_mutex_trylock(second) == 0) return;     // có đủ hai khoá
        pthread_mutex_unlock(first);                        // trả lại thứ đang giữ
        pthread_mutex_lock(&amp;count_lock); retries++; pthread_mutex_unlock(&amp;count_lock);
        usleep(rand_r(seed) % 200);                         // lùi ngẫu nhiên 0–199 µs
    }
}

void *a_to_b(void *x) {
    unsigned seed = 1;
    for (int i = 0; i &lt; 20000; i++) {
        lock_both(&amp;lock_a, &amp;lock_b, &amp;seed);                 // thứ tự a, b
        balance_a -= 5; balance_b += 5;
        pthread_mutex_unlock(&amp;lock_b); pthread_mutex_unlock(&amp;lock_a);
    }
    return NULL;
}
void *b_to_a(void *x) {
    unsigned seed = 2;
    for (int i = 0; i &lt; 20000; i++) {
        lock_both(&amp;lock_b, &amp;lock_a, &amp;seed);                 // thứ tự NGƯỢC — với lock() thường sẽ bế tắc
        balance_b -= 5; balance_a += 5;
        pthread_mutex_unlock(&amp;lock_a); pthread_mutex_unlock(&amp;lock_b);
    }
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    pthread_create(&amp;t1, NULL, a_to_b, NULL);
    pthread_create(&amp;t2, NULL, b_to_a, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("40000 transfers done, total = %ld\\n", balance_a + balance_b);
    printf("retries = %ld (times a thread had to give its first lock back)\\n", retries);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread trylock-lui.c -o trylock-lui &amp;&amp; ./trylock-lui<br>
40000 transfers done, total = 2000000<br>
retries = 5 (times a thread had to give its first lock back)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Hai luồng lấy khoá theo thứ tự ngược nhau — với <code>lock()</code> thường thì đây là bế tắc của slide 4 — vậy mà cả 40.000 lần chuyển đều xong; dòng "retries" đếm số lần một luồng phải trả lại khoá thứ nhất (một lần chạy thật — chạy lại con số sẽ khác). Khoảng nghỉ ngẫu nhiên là quan trọng; thiếu nó, hai luồng có thể nhường nhau mãi mãi (livelock, slide 30).</p>
<p class="pitfall">⚠️ FE: "Để bảo đảm giữ và chờ không bao giờ xảy ra, phải bảo đảm ___" (FE2#37) — "khi xin tài nguyên thì không đang giữ cái nào khác", "mỗi tiến trình xin và được cấp đủ mọi tài nguyên trước khi bắt đầu" và "chỉ được xin khi không giữ gì" đều đúng; ngân hàng chọn câu đầu. "Chiến lược nào ngăn bế tắc bằng cách xin mọi tài nguyên một lần?" → one-shot allocation (FE3#35); "cách đúng với điều kiện giữ và chờ" → <strong>request all resources initially</strong> (FE17#3). "Một cách ngăn bế tắc" → <strong>spool everything</strong> (FE17#1, FE26#4).</p>`],
      [27, 'Attacking Circular Wait Condition (1)',
        `<p class="y-chinh">🎯 Figure 6-13: (a) give every resource a global number — 1. imagesetter, 2. printer, 3. plotter, 4. tape drive, 5. CD-ROM drive — and require every process to request resources <strong>in increasing numerical order</strong>. (b) Then a cycle is impossible: if A holds i and asks for j, then i &lt; j; if B held j and asked for i, then j &lt; i — contradiction.</p>
<p>The proof generalises to any number of processes: in a cycle, each process holds a resource and waits for one held by the next. Follow the cycle and the numbers strictly increase at every step — but you return to the start, so a number would be greater than itself. Impossible, hence no cycle, hence no deadlock. Variants: a process may request a lower-numbered resource only after releasing all higher ones; or simply "never request a resource lower than one already held". The rule costs little at run time — no detector, no matrices — which is why it is the prevention used in real code.</p>
<p>The weakness the book points out: it may be impossible to find an ordering that satisfies everyone, and resources may be needed in an order that does not match their numbers (a process may learn it needs the printer only after reading the tape). Programmers also forget the rule. Hence tools to enforce it.</p>
<p>🧭 Lock ordering in real backend code:</p>
<ul>
<li><strong>Bank transfer</strong> (slide 4, <code>thu-tu-khoa.c</code>): lock the account with the smaller id first, whatever the direction. In SQL: <code>SELECT … FROM accounts WHERE id IN (:a, :b) ORDER BY id FOR UPDATE</code> — PostgreSQL then locks the rows in id order in every transaction. A batch <code>UPDATE</code> of many rows should also touch them in a fixed order (sort the ids in the application first).</li>
<li><strong>Java</strong>: when objects have no natural id, order by <code>System.identityHashCode</code> and use a third "tie lock" for the rare case of equal hashes (the technique of <em>Java Concurrency in Practice</em>, §10.1.2).</li>
<li><strong>Linux kernel</strong>: <em>lockdep</em> (Documentation/locking/lockdep-design) records the order in which lock classes have ever been taken and reports a possible deadlock the first time a new order would create a cycle — before the deadlock actually happens.</li>
</ul>
<p class="pitfall">⚠️ FE: "eliminates circular wait" → <strong>forcing all processes to request resources in a predefined order</strong> (FE1#29, FE3#49); "ordering resources numerically" attacks <strong>circular wait</strong> (FE17#24); "hierarchical ordering removes the possibility of circular wait" (FE22#50); the strategy that prevents deadlock "while still allowing high utilisation" → <strong>allocating resources based on a resource hierarchy</strong> (FE2#38). "Which condition, if not present, can help prevent deadlocks?" — the bank keys circular wait (FE4#49, FE7#49, FE8#49, FE12#49) but mutual exclusion in FE13#49: any one of the four would do; choose circular wait unless the options force otherwise.</p>`,
        `<p class="y-chinh">🎯 Hình 6-13: (a) gán cho mọi tài nguyên một số thứ tự chung — 1. máy sắp chữ, 2. máy in, 3. máy vẽ, 4. ổ băng từ, 5. ổ CD-ROM — và bắt mọi tiến trình xin tài nguyên <strong>theo thứ tự số tăng dần</strong>. (b) Khi đó chu trình là không thể: nếu A giữ i và xin j thì i &lt; j; nếu B giữ j và xin i thì j &lt; i — mâu thuẫn.</p>
<p>Chứng minh mở rộng cho số tiến trình bất kỳ: trong một chu trình, mỗi tiến trình giữ một tài nguyên và chờ tài nguyên do kẻ kế tiếp giữ. Đi theo chu trình thì số thứ tự tăng ngặt ở mỗi bước — nhưng bạn quay về điểm xuất phát, nên một số sẽ lớn hơn chính nó. Vô lý, vậy không có chu trình, vậy không có bế tắc. Các biến thể: một tiến trình chỉ được xin tài nguyên số nhỏ hơn sau khi đã trả mọi tài nguyên số lớn hơn; hoặc đơn giản "không bao giờ xin tài nguyên có số nhỏ hơn một cái đang giữ". Luật này gần như không tốn gì lúc chạy — không bộ dò, không ma trận — vì vậy nó là cách ngăn ngừa được dùng trong mã thật.</p>
<p>Điểm yếu sách chỉ ra: có thể không tìm được thứ tự nào làm hài lòng mọi người, và tài nguyên có thể được cần theo thứ tự không khớp với số của chúng (một tiến trình có khi chỉ biết mình cần máy in sau khi đọc xong băng từ). Lập trình viên cũng hay quên luật. Vì vậy cần công cụ để ép luật.</p>
<p>🧭 Thứ tự khoá trong mã backend thật:</p>
<ul>
<li><strong>Chuyển tiền</strong> (slide 4, <code>thu-tu-khoa.c</code>): khoá tài khoản có id nhỏ hơn trước, bất kể chiều chuyển. Trong SQL: <code>SELECT … FROM accounts WHERE id IN (:a, :b) ORDER BY id FOR UPDATE</code> — PostgreSQL khi đó khoá các dòng theo thứ tự id ở mọi giao dịch. Một câu <code>UPDATE</code> hàng loạt nhiều dòng cũng nên chạm chúng theo thứ tự cố định (sắp xếp id trong ứng dụng trước).</li>
<li><strong>Java</strong>: khi đối tượng không có id tự nhiên, sắp theo <code>System.identityHashCode</code> và dùng thêm một "khoá phân xử" (tie lock) cho trường hợp hiếm hai hash bằng nhau (kỹ thuật của sách <em>Java Concurrency in Practice</em>, §10.1.2).</li>
<li><strong>Nhân Linux</strong>: <em>lockdep</em> (Documentation/locking/lockdep-design) ghi lại thứ tự các lớp khoá từng được lấy và báo một bế tắc tiềm năng ngay lần đầu một thứ tự mới sẽ tạo ra chu trình — trước khi bế tắc thật sự xảy ra.</li>
</ul>
<p class="pitfall">⚠️ FE: "loại bỏ chờ vòng tròn" → <strong>buộc mọi tiến trình xin tài nguyên theo một thứ tự định trước</strong> (FE1#29, FE3#49); "đánh số tài nguyên" tấn công <strong>chờ vòng tròn</strong> (FE17#24); "thứ tự phân cấp loại bỏ khả năng chờ vòng tròn" (FE22#50); chiến lược ngăn bế tắc "mà vẫn cho hiệu suất dùng cao" → <strong>cấp phát theo phân cấp tài nguyên</strong> (FE2#38). "Điều kiện nào, nếu vắng mặt, giúp ngăn bế tắc?" — ngân hàng đánh dấu chờ vòng tròn (FE4#49, FE7#49, FE8#49, FE12#49) nhưng lại đánh dấu loại trừ lẫn nhau ở FE13#49: vắng điều kiện nào trong bốn cũng được; cứ chọn chờ vòng tròn trừ khi phương án buộc khác đi.</p>`],
      [28, 'Attacking Circular Wait Condition (2)',
        `<p class="y-chinh">🎯 Figure 6-14, the summary of prevention: <strong>mutual exclusion → spool everything</strong>; <strong>hold and wait → request all resources initially</strong>; <strong>no preemption → take resources away</strong>; <strong>circular wait → order resources numerically</strong>.</p>
<p>This four-row table is the single most-asked deadlock fact in the FE bank — learn it as four pairs. The one condition the previous slides did not cover is <strong>no preemption</strong> (§6.6.3): if a process has the printer and is halfway through its output, forcibly taking the printer away because a needed plotter is not available is tricky at best and impossible at worst. Some resources, however, can be <em>virtualised</em> so that "taking away" becomes possible: spooling printer output to disk lets the OS (through the daemon) control the real printer. Note that the same idea — spooling — appears both under mutual exclusion (only the daemon uses the printer) and under no preemption (the virtual printer can be taken away) in the book's text; the figure puts it under mutual exclusion.</p>
<p>➕ The modern table, for code you write:</p>
<table>
<thead><tr><th>Condition</th><th>Textbook attack</th><th>What backend code does</th></tr></thead>
<tbody>
<tr><td>Mutual exclusion</td><td>spool everything</td><td>share instead of locking: immutable data, copy-on-write, MVCC (PostgreSQL readers never block writers), lock-free atomics, a single owner thread/actor per resource</td></tr>
<tr><td>Hold and wait</td><td>request all initially</td><td>take every lock in one call (SQL <code>SELECT … FOR UPDATE</code> of all rows at once), or <code>tryLock</code> and give back on failure (slide 26)</td></tr>
<tr><td>No preemption</td><td>take resources away</td><td>timeouts: <code>tryLock(timeout)</code>, <code>lock_timeout</code> / <code>statement_timeout</code> in PostgreSQL, request timeouts in HTTP clients — the waiter preempts itself</td></tr>
<tr><td>Circular wait</td><td>order resources numerically</td><td>a global lock order (by id), enforced by review and tools (lockdep)</td></tr>
</tbody>
</table>
<p>Timeouts deserve a sentence: they do not prevent the cycle from forming, but they guarantee it cannot last — after the timeout one waiter gives up, releases what it holds, and the others continue. In practice almost every robust server combines a lock order (so deadlocks are rare) with timeouts and retries (so the rare one heals itself).</p>
<p class="pitfall">⚠️ FE wordings of the table: "take resources away" attacks <strong>no preemption</strong> (FE11#48, FE16#48, FE19#11, FE21#45, FE27#20, FE28#30, FE29#8; reversed in FE23#21, FE24#34); "spool everything" attacks <strong>mutual exclusion</strong> (FE23#39, FE24#20; reversed in FE19#49, FE27#2, FE29#43). FE2#50 keys "spooling printer output to disk to allow the printer daemon exclusive access" as an attack on <em>no preemption</em> — the same bank keys spooling as mutual exclusion everywhere else; follow the figure unless the option text is that exact sentence. Spooling's own deadlock — "the printer needs all of a job's output before printing, but the spooling system fills the disk with partially completed output" (FE18#41, FE25#18, FE28#16).</p>`,
        `<p class="y-chinh">🎯 Hình 6-14, bảng tóm tắt việc ngăn ngừa: <strong>loại trừ lẫn nhau → spool mọi thứ</strong>; <strong>giữ và chờ → xin mọi tài nguyên ngay từ đầu</strong>; <strong>không trưng dụng → lấy tài nguyên đi</strong>; <strong>chờ vòng tròn → đánh số thứ tự tài nguyên</strong>.</p>
<p>Bảng bốn dòng này là sự thật về bế tắc được hỏi nhiều nhất trong ngân hàng FE — hãy học thuộc thành bốn cặp. Điều kiện duy nhất các slide trước chưa nói tới là <strong>không trưng dụng</strong> (§6.6.3): nếu một tiến trình đang giữ máy in và in được nửa chừng, cưỡng ép lấy máy in đi chỉ vì chưa có máy vẽ nó cần thì tốt nhất là khó, tệ nhất là không thể. Tuy vậy một số tài nguyên có thể được <em>ảo hoá</em> để việc "lấy đi" thành ra làm được: spool output của máy in ra đĩa cho phép HĐH (qua daemon) điều khiển máy in thật. Để ý cùng một ý tưởng — spooling — xuất hiện cả dưới loại trừ lẫn nhau (chỉ daemon dùng máy in) lẫn dưới không trưng dụng (máy in ảo lấy đi được) trong chữ của sách; còn hình thì xếp nó dưới loại trừ lẫn nhau.</p>
<p>➕ Bảng hiện đại, cho mã bạn viết:</p>
<table>
<thead><tr><th>Điều kiện</th><th>Cách tấn công của sách</th><th>Mã backend làm gì</th></tr></thead>
<tbody>
<tr><td>Loại trừ lẫn nhau</td><td>spool mọi thứ</td><td>chia sẻ thay vì khoá: dữ liệu bất biến, copy-on-write, MVCC (ở PostgreSQL người đọc không bao giờ chặn người ghi), atomic không khoá, mỗi tài nguyên một luồng/actor làm chủ duy nhất</td></tr>
<tr><td>Giữ và chờ</td><td>xin mọi thứ từ đầu</td><td>lấy mọi khoá trong một lần gọi (SQL <code>SELECT … FOR UPDATE</code> mọi dòng cùng lúc), hoặc <code>tryLock</code> rồi trả lại khi thất bại (slide 26)</td></tr>
<tr><td>Không trưng dụng</td><td>lấy tài nguyên đi</td><td>hạn chờ: <code>tryLock(timeout)</code>, <code>lock_timeout</code> / <code>statement_timeout</code> của PostgreSQL, timeout của HTTP client — kẻ chờ tự trưng dụng chính mình</td></tr>
<tr><td>Chờ vòng tròn</td><td>đánh số tài nguyên</td><td>một thứ tự khoá chung (theo id), ép bằng review và công cụ (lockdep)</td></tr>
</tbody>
</table>
<p>Hạn chờ (timeout) đáng một câu riêng: nó không ngăn chu trình hình thành, nhưng bảo đảm chu trình không kéo dài — hết hạn, một kẻ chờ bỏ cuộc, nhả những gì nó giữ, và những kẻ khác đi tiếp. Trên thực tế gần như mọi server vững vàng đều kết hợp thứ tự khoá (để bế tắc hiếm) với hạn chờ và thử lại (để ca hiếm đó tự lành).</p>
<p class="pitfall">⚠️ Cách FE hỏi bảng này: "take resources away" tấn công <strong>không trưng dụng</strong> (FE11#48, FE16#48, FE19#11, FE21#45, FE27#20, FE28#30, FE29#8; hỏi ngược ở FE23#21, FE24#34); "spool everything" tấn công <strong>loại trừ lẫn nhau</strong> (FE23#39, FE24#20; hỏi ngược ở FE19#49, FE27#2, FE29#43). FE2#50 đánh dấu "spool output máy in ra đĩa để daemon máy in độc quyền truy cập" là tấn công <em>không trưng dụng</em> — trong khi chính ngân hàng ở mọi chỗ khác xếp spooling vào loại trừ lẫn nhau; cứ theo hình trừ khi phương án viết đúng câu đó. Bế tắc của chính spooling — "máy in cần đủ output của một job mới in, nhưng hệ spool làm đầy đĩa bằng output dở dang" (FE18#41, FE25#18, FE28#16).</p>`],
      [29, 'Communication Deadlocks',
        `<p class="y-chinh">🎯 Figure 6-15: four routers A, B, C, D in a ring, each with a buffer full of packets for the next router. A cannot forward to B (B's buffers are full), B cannot forward to C, C to D, D to A — a <strong>resource deadlock in a network</strong>: the resources are buffer slots.</p>
<p>§6.7.2 distinguishes two kinds. A <strong>communication deadlock</strong> in the strict sense has no resources at all: A sends a request message to B and blocks waiting for the reply; the request is lost; B blocks waiting for a request; both wait forever for a message. No resource, no cycle in a resource graph — the usual tools do not apply; the cure is a <strong>timeout</strong>: the sender starts a timer, and if no reply comes it resends (then the protocol must cope with duplicates — a request carrying a sequence number). Figure 6-15 is the other kind: a resource deadlock that happens to involve communication — each router holds buffers and waits for buffers held by the next.</p>
<p>➕ The same thing on one machine, with pipes: two processes each send a 1 MB message to the other through a pipe before reading anything. A pipe has a fixed buffer; once it is full, <code>write</code> blocks until the reader reads — but the reader is also writing:</p>
<pre><code class="language-c">// Figure 6-15 on one machine: two processes each WRITE 1 MB into a pipe before READING — both buffers fill up
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;string.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static long sent;
static void on_alarm(int s) { (void)s; }               // only to interrupt the blocked write()

static void talker(const char *who, int out, int in, int seconds) {
    char block[4096];
    memset(block, 'x', sizeof block);
    struct sigaction sa = { .sa_handler = on_alarm };  // no SA_RESTART: write() returns -1 / EINTR
    sigaction(SIGALRM, &amp;sa, NULL);
    alarm(seconds);
    while (sent &lt; 1024 * 1024) {                       // 1 MB "message" to the other side
        ssize_t n = write(out, block, sizeof block);
        if (n &lt; 0) break;                              // interrupted by the alarm
        sent += n;
    }
    printf("%s: wrote %ld bytes, blocked in write(), never reached read(%d)\\n", who, sent, in);
    fflush(stdout);
}

int main(void) {
    int p2c[2], c2p[2];                                // parent -&gt; child, child -&gt; parent
    pipe(p2c); pipe(c2p);
    printf("pipe capacity on this kernel: %d bytes\\n", fcntl(p2c[1], F_GETPIPE_SZ));
    fflush(stdout);
    if (fork() == 0) {                                 // child: send first, read later
        talker("child ", c2p[1], p2c[0], 1);
        _exit(0);
    }
    talker("parent", p2c[1], c2p[0], 2);               // parent: the same plan
    wait(NULL);
    printf("each side waits for the other to read: a communication deadlock on buffer space\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ong-dan-ket.c -o ong-dan-ket &amp;&amp; ./ong-dan-ket<br>
pipe capacity on this kernel: 65536 bytes<br>
child : wrote 65536 bytes, blocked in write(), never reached read(3)<br>
parent: wrote 65536 bytes, blocked in write(), never reached read(5)<br>
each side waits for the other to read: a communication deadlock on buffer space</div>
<p>Each side wrote exactly 65,536 bytes (the pipe capacity of this kernel) and blocked; each waits for the other to call <code>read</code>, which it will never do. The alarm only exists so the demo ends. The fixes are the network's: read and write concurrently (two threads, or <code>poll</code>/<code>epoll</code>), or bound the message size below the buffer, or time out.</p>
<p>➕ Two backend deadlocks with <em>no lock in the code at all</em>. A thread pool of 2 where each task submits a sub-task to the same pool and waits for its result — both threads are busy waiting, the sub-tasks sit in the queue with no thread to run them:</p>
<pre><code class="language-java">// A fixed pool of 2 threads; each task submits a sub-task to the SAME pool and waits for it
import java.util.concurrent.*;

public class PoolCan {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        Callable&lt;String&gt; outer = () -&gt; {
            Future&lt;String&gt; inner = pool.submit(() -&gt; "inner result");    // needs a free pool thread
            return inner.get();                                          // ...but this thread waits here, holding its pool slot
        };
        Future&lt;String&gt; f1 = pool.submit(outer), f2 = pool.submit(outer);   // 2 outer tasks occupy BOTH threads
        try {
            System.out.println(f1.get(2, TimeUnit.SECONDS));
        } catch (TimeoutException e) {
            System.out.println("no answer after 2 s: both pool threads wait for sub-tasks that have no thread to run on");
        }
        ThreadPoolExecutor tp = (ThreadPoolExecutor) pool;
        System.out.println("active threads = " + tp.getActiveCount() + ", tasks waiting in the queue = " + tp.getQueue().size());
        pool.shutdownNow();                                              // interrupt the stuck tasks
        System.out.println("thread-starvation deadlock: no lock anywhere, only a full pool");
    }
}</code></pre>
<div class="out">$ javac PoolCan.java &amp;&amp; java PoolCan<br>
no answer after 2 s: both pool threads wait for sub-tasks that have no thread to run on<br>
active threads = 2, tasks waiting in the queue = 2<br>
thread-starvation deadlock: no lock anywhere, only a full pool</div>
<p>This "thread-starvation deadlock" is common in Spring applications that call <code>@Async</code> methods or <code>CompletableFuture.get()</code> from inside the same executor, and in services that call themselves over HTTP with a fixed-size server thread pool (and its cousin: each request holds one database connection from a pool of N and asks for a second — N concurrent requests freeze the pool). The fix: separate pools for different levels of work, and timeouts. And Node.js, which has only one thread, can still deadlock — with Promises:</p>
<pre><code class="language-javascript">// Node.js has one thread, yet two async tasks can still wait for each other forever
class Mutex {                                   // a tiny async lock, like the npm package async-mutex
  #locked = false; #queue = [];
  async lock() {
    if (!this.#locked) { this.#locked = true; return; }
    await new Promise((resolve) =&gt; this.#queue.push(resolve));   // wait in line
  }
  unlock() { const next = this.#queue.shift(); if (next) next(); else this.#locked = false; }
}
const stock = new Mutex(), wallet = new Mutex();
const tick = () =&gt; new Promise((r) =&gt; setTimeout(r, 50));       // e.g. a database round trip

async function buy() {                         // order: stock, then wallet
  await stock.lock(); console.log('buy:    has stock, wants wallet'); await tick();
  await wallet.lock(); console.log('buy done');
}
async function refund() {                      // order: wallet, then stock
  await wallet.lock(); console.log('refund: has wallet, wants stock'); await tick();
  await stock.lock(); console.log('refund done');
}
// top-level await: it never settles
await Promise.all([buy(), refund()]);
console.log('never printed');</code></pre>
<div class="out">$ node cho-nhau.mjs<br>
buy: &nbsp;&nbsp;&nbsp;has stock, wants wallet<br>
refund: has wallet, wants stock<br>
Warning: Detected unsettled top-level await at file:///w/cho-nhau.mjs:23<br>
await Promise.all([buy(), refund()]);<br>
^<br>
[exit code 13]</div>
<p>Two async functions each hold one async mutex and await the other's. The event loop has nothing left to do, so Node exits with code 13 and the warning "unsettled top-level await" — the Node.js version of a deadlocked server is one that silently stops answering. The same four conditions, the same cure: one order for the locks.</p>
<p class="meo">🧠 ➕ Two-phase locking (§6.7.1), the database version of "request all initially": phase 1 the transaction locks every record it needs, one at a time; phase 2 it does the updates and releases. If some record is already locked in phase 1, it releases everything and starts over. Real databases use the <em>strict</em> variant (locks held until commit), which gives correct isolation but brings hold and wait back — that is why PostgreSQL still needs its deadlock detector.</p>`,
        `<p class="y-chinh">🎯 Hình 6-15: bốn router A, B, C, D xếp thành vòng, mỗi router có bộ đệm đầy gói tin gửi cho router kế tiếp. A không chuyển được cho B (bộ đệm của B đầy), B không chuyển được cho C, C cho D, D cho A — một <strong>bế tắc tài nguyên trong mạng</strong>: tài nguyên là các ô bộ đệm.</p>
<p>Mục 6.7.2 phân biệt hai loại. <strong>Bế tắc truyền thông (communication deadlock)</strong> theo nghĩa hẹp không có tài nguyên nào cả: A gửi một thông điệp yêu cầu cho B rồi bị chặn chờ trả lời; yêu cầu bị mất; B bị chặn chờ một yêu cầu; cả hai chờ mãi một thông điệp. Không tài nguyên, không chu trình trong đồ thị tài nguyên — các công cụ quen thuộc không áp dụng được; cách chữa là <strong>hạn chờ (timeout)</strong>: bên gửi bật một bộ hẹn giờ, hết giờ mà chưa có trả lời thì gửi lại (khi đó giao thức phải chịu được bản trùng — yêu cầu mang số thứ tự). Hình 6-15 là loại còn lại: một bế tắc tài nguyên tình cờ dính tới truyền thông — mỗi router giữ bộ đệm và chờ bộ đệm của router kế tiếp.</p>
<p>➕ Cùng chuyện đó trên một máy, bằng pipe: hai tiến trình mỗi bên gửi cho bên kia một thông điệp 1 MB qua pipe trước khi đọc bất cứ thứ gì. Pipe có bộ đệm cỡ cố định; đầy rồi thì <code>write</code> bị chặn tới khi bên đọc đọc — nhưng bên đọc cũng đang ghi:</p>
<pre><code class="language-c">// Hình 6-15 trên một máy: hai tiến trình đều GHI 1 MB vào pipe trước khi ĐỌC — cả hai bộ đệm đầy
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;string.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static long sent;
static void on_alarm(int s) { (void)s; }               // chỉ để ngắt write() đang bị chặn

static void talker(const char *who, int out, int in, int seconds) {
    char block[4096];
    memset(block, 'x', sizeof block);
    struct sigaction sa = { .sa_handler = on_alarm };  // không SA_RESTART: write() trả -1 / EINTR
    sigaction(SIGALRM, &amp;sa, NULL);
    alarm(seconds);
    while (sent &lt; 1024 * 1024) {                       // "thông điệp" 1 MB gửi bên kia
        ssize_t n = write(out, block, sizeof block);
        if (n &lt; 0) break;                              // bị báo thức ngắt
        sent += n;
    }
    printf("%s: wrote %ld bytes, blocked in write(), never reached read(%d)\\n", who, sent, in);
    fflush(stdout);
}

int main(void) {
    int p2c[2], c2p[2];                                // cha -&gt; con, con -&gt; cha
    pipe(p2c); pipe(c2p);
    printf("pipe capacity on this kernel: %d bytes\\n", fcntl(p2c[1], F_GETPIPE_SZ));
    fflush(stdout);
    if (fork() == 0) {                                 // con: gửi trước, đọc sau
        talker("child ", c2p[1], p2c[0], 1);
        _exit(0);
    }
    talker("parent", p2c[1], c2p[0], 2);               // cha: cùng kế hoạch đó
    wait(NULL);
    printf("each side waits for the other to read: a communication deadlock on buffer space\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ong-dan-ket.c -o ong-dan-ket &amp;&amp; ./ong-dan-ket<br>
pipe capacity on this kernel: 65536 bytes<br>
child : wrote 65536 bytes, blocked in write(), never reached read(3)<br>
parent: wrote 65536 bytes, blocked in write(), never reached read(5)<br>
each side waits for the other to read: a communication deadlock on buffer space</div>
<p>Mỗi bên ghi đúng 65.536 byte (dung lượng pipe của nhân này) rồi bị chặn; mỗi bên chờ bên kia gọi <code>read</code>, điều sẽ không bao giờ xảy ra. Báo thức chỉ có để bản demo kết thúc. Cách sửa giống hệt bên mạng: đọc và ghi đồng thời (hai luồng, hoặc <code>poll</code>/<code>epoll</code>), hoặc giới hạn cỡ thông điệp dưới cỡ bộ đệm, hoặc đặt hạn chờ.</p>
<p>➕ Hai bế tắc backend mà trong mã <em>không có lấy một khoá</em>. Một thread pool 2 luồng, mỗi việc gửi một việc con vào chính pool đó rồi chờ kết quả — cả hai luồng bận chờ, các việc con nằm trong hàng đợi chẳng còn luồng nào chạy:</p>
<pre><code class="language-java">// Một pool cố định 2 luồng; mỗi việc gửi một việc con vào CHÍNH pool đó rồi chờ nó
import java.util.concurrent.*;

public class PoolCan {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        Callable&lt;String&gt; outer = () -&gt; {
            Future&lt;String&gt; inner = pool.submit(() -&gt; "inner result");    // cần một luồng rảnh của pool
            return inner.get();                                          // ...mà luồng này đứng chờ ở đây, chiếm luôn chỗ trong pool
        };
        Future&lt;String&gt; f1 = pool.submit(outer), f2 = pool.submit(outer);   // 2 việc ngoài chiếm CẢ HAI luồng
        try {
            System.out.println(f1.get(2, TimeUnit.SECONDS));
        } catch (TimeoutException e) {
            System.out.println("no answer after 2 s: both pool threads wait for sub-tasks that have no thread to run on");
        }
        ThreadPoolExecutor tp = (ThreadPoolExecutor) pool;
        System.out.println("active threads = " + tp.getActiveCount() + ", tasks waiting in the queue = " + tp.getQueue().size());
        pool.shutdownNow();                                              // ngắt các việc đang kẹt
        System.out.println("thread-starvation deadlock: no lock anywhere, only a full pool");
    }
}</code></pre>
<div class="out">$ javac PoolCan.java &amp;&amp; java PoolCan<br>
no answer after 2 s: both pool threads wait for sub-tasks that have no thread to run on<br>
active threads = 2, tasks waiting in the queue = 2<br>
thread-starvation deadlock: no lock anywhere, only a full pool</div>
<p>"Bế tắc do đói luồng" (thread-starvation deadlock) này hay gặp trong ứng dụng Spring gọi phương thức <code>@Async</code> hoặc <code>CompletableFuture.get()</code> từ bên trong cùng executor, và ở dịch vụ tự gọi lại chính mình qua HTTP với thread pool server cỡ cố định (cùng họ với nó: mỗi request giữ một kết nối CSDL từ pool N kết nối rồi xin thêm cái thứ hai — N request đồng thời là pool đứng hình). Cách sửa: tách pool riêng cho từng tầng công việc, và đặt hạn chờ. Còn Node.js, chỉ có một luồng, vẫn bế tắc được — bằng Promise:</p>
<pre><code class="language-javascript">// Node.js chỉ có một luồng, vậy mà hai việc async vẫn chờ nhau mãi được
class Mutex {                                   // một khoá async tí hon, giống gói npm async-mutex
  #locked = false; #queue = [];
  async lock() {
    if (!this.#locked) { this.#locked = true; return; }
    await new Promise((resolve) =&gt; this.#queue.push(resolve));   // xếp hàng chờ
  }
  unlock() { const next = this.#queue.shift(); if (next) next(); else this.#locked = false; }
}
const stock = new Mutex(), wallet = new Mutex();
const tick = () =&gt; new Promise((r) =&gt; setTimeout(r, 50));       // vd một lượt hỏi CSDL

async function buy() {                         // thứ tự: kho, rồi ví
  await stock.lock(); console.log('buy:    has stock, wants wallet'); await tick();
  await wallet.lock(); console.log('buy done');
}
async function refund() {                      // thứ tự: ví, rồi kho
  await wallet.lock(); console.log('refund: has wallet, wants stock'); await tick();
  await stock.lock(); console.log('refund done');
}
// await cấp cao nhất: không bao giờ xong
await Promise.all([buy(), refund()]);
console.log('never printed');</code></pre>
<div class="out">$ node cho-nhau.mjs<br>
buy: &nbsp;&nbsp;&nbsp;has stock, wants wallet<br>
refund: has wallet, wants stock<br>
Warning: Detected unsettled top-level await at file:///w/cho-nhau.mjs:23<br>
await Promise.all([buy(), refund()]);<br>
^<br>
[exit code 13]</div>
<p>Hai hàm async mỗi bên giữ một async mutex và await cái của bên kia. Vòng lặp sự kiện chẳng còn việc gì để làm, nên Node thoát với mã 13 và lời cảnh báo "unsettled top-level await" — phiên bản Node.js của một server bế tắc là một server lặng lẽ ngừng trả lời. Vẫn bốn điều kiện đó, vẫn cách chữa đó: một thứ tự chung cho các khoá.</p>
<p class="meo">🧠 ➕ Khoá hai pha (two-phase locking, §6.7.1), phiên bản cơ sở dữ liệu của "xin mọi thứ từ đầu": pha 1 giao dịch khoá lần lượt mọi bản ghi nó cần; pha 2 nó cập nhật rồi nhả. Nếu ở pha 1 có bản ghi đã bị khoá thì nó nhả hết rồi làm lại từ đầu. Cơ sở dữ liệu thật dùng biến thể <em>nghiêm ngặt</em> (giữ khoá tới lúc commit), cho cô lập đúng nhưng lại mang điều kiện giữ và chờ trở lại — vì vậy PostgreSQL vẫn cần bộ dò bế tắc của nó.</p>`],
      [30, 'Livelock',
        `<p class="y-chinh">🎯 Figure 6-16: process A takes resource_1 then resource_2, process B takes resource_2 then resource_1 — with <code>enter_region</code>, a <strong>busy-waiting</strong> lock. If A gets 1 and B gets 2, each spins forever on the other's lock: neither is blocked, both use up their CPU quantum over and over, and neither makes progress. The book calls this <strong>livelock</strong>: functionally equivalent to deadlock, but nobody is blocked.</p>
<p>The difference is visible from outside. A deadlocked thread sleeps in the kernel (state S, waiting on a futex) and costs no CPU; a spinning or livelocked thread is running (state R) and burns a whole core. Here is the same two-lock pattern built both ways, seen with <code>ps</code>:</p>
<div class="out"># Deadlock vs livelock seen from the outside: blocked threads sleep (S), spinning threads burn CPU (R)<br>
$ ps -L -o tid,stat,wchan:22,comm -p $(pgrep -x treo)<br>
&nbsp;&nbsp;&nbsp;&nbsp;TID STAT WCHAN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 Sl &nbsp;&nbsp;futex_do_wait &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;treo<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17 Sl &nbsp;&nbsp;futex_do_wait &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;treo<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;18 Sl &nbsp;&nbsp;futex_do_wait &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;treo<br>
$ ps -L -o tid,stat,wchan:22,comm -p $(pgrep -x treo)<br>
&nbsp;&nbsp;&nbsp;&nbsp;TID STAT WCHAN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;29 Sl &nbsp;&nbsp;futex_do_wait &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;treo<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;31 Rl &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;treo<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32 Rl &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;treo</div>
<p>First run: the two worker threads (and <code>main</code>, which waits for them) are all <code>S</code> in <code>futex_do_wait</code> — a classic deadlock. Second run: the two workers are <code>R</code> with no wait channel — they are spinning; <code>top</code> would show 200% CPU for a program that does nothing.</p>
<p>➕ Many modern texts reserve "livelock" for the more interesting case where the processes keep <em>changing state</em> in response to each other — like two polite people in a corridor who both step aside the same way, again and again. In code: each thread takes its first lock, tries the second, and, being polite, gives the first back and waits the same fixed time before retrying. If they move in lockstep, they never get through:</p>
<pre><code class="language-c">// Livelock: two "polite" threads give their lock back whenever they cannot get the second one — in lockstep, forever
#include &lt;stdio.h&gt;
#include &lt;errno.h&gt;
#include &lt;pthread.h&gt;

pthread_mutex_t resource_1 = PTHREAD_MUTEX_INITIALIZER, resource_2 = PTHREAD_MUTEX_INITIALIZER;
pthread_barrier_t step;                         // forces the worst case: both threads move in exact lockstep
#define ROUNDS 5
int got[2][ROUNDS];                             // result of trylock for each thread and round
int meals = 0;

void polite(int me, pthread_mutex_t *mine, pthread_mutex_t *other) {
    for (int r = 0; r &lt; ROUNDS; r++) {
        pthread_mutex_lock(mine);                       // 1. take my first resource
        pthread_barrier_wait(&amp;step);                    // (both now hold one)
        got[me][r] = pthread_mutex_trylock(other);      // 2. try the second — never blocks
        pthread_barrier_wait(&amp;step);
        if (got[me][r] == 0) { meals++; pthread_mutex_unlock(other); }
        pthread_mutex_unlock(mine);                     // 3. be polite: give the first one back
        pthread_barrier_wait(&amp;step);                    // 4. "wait a fixed time" — the same for both
    }
}
void *A(void *x) { polite(0, &amp;resource_1, &amp;resource_2); return NULL; }
void *B(void *x) { polite(1, &amp;resource_2, &amp;resource_1); return NULL; }

int main(void) {
    pthread_t a, b;
    pthread_barrier_init(&amp;step, NULL, 2);
    pthread_create(&amp;a, NULL, A, NULL);
    pthread_create(&amp;b, NULL, B, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    for (int r = 0; r &lt; ROUNDS; r++)
        printf("round %d: A holds resource_1, trylock(resource_2) = %s | B holds resource_2, trylock(resource_1) = %s\\n", r + 1,
               got[0][r] == EBUSY ? "EBUSY" : "ok", got[1][r] == EBUSY ? "EBUSY" : "ok");
    printf("%d rounds, %d lock operations, %d meals — nobody blocked, nobody progressed: LIVELOCK\\n", ROUNDS, ROUNDS * 4, meals);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread livelock.c -o livelock &amp;&amp; ./livelock<br>
round 1: A holds resource_1, trylock(resource_2) = EBUSY | B holds resource_2, trylock(resource_1) = EBUSY<br>
round 2: A holds resource_1, trylock(resource_2) = EBUSY | B holds resource_2, trylock(resource_1) = EBUSY<br>
round 3: A holds resource_1, trylock(resource_2) = EBUSY | B holds resource_2, trylock(resource_1) = EBUSY<br>
round 4: A holds resource_1, trylock(resource_2) = EBUSY | B holds resource_2, trylock(resource_1) = EBUSY<br>
round 5: A holds resource_1, trylock(resource_2) = EBUSY | B holds resource_2, trylock(resource_1) = EBUSY<br>
5 rounds, 20 lock operations, 0 meals — nobody blocked, nobody progressed: LIVELOCK</div>
<p>The barrier forces the worst case (perfect lockstep) so the run is repeatable; in reality the timing drifts and the threads usually get through after some rounds — but under load, with identical retry intervals, a livelock can last for a long time. The cure is to break the symmetry: <strong>random back-off</strong> (the <code>usleep(rand_r(…))</code> of slide 26), exactly as Ethernet does after a collision, or a fixed order.</p>
<p>➕ <strong>Starvation</strong> (§6.7.4), closely related: a policy that is fair "on average" may keep one process waiting forever although it is not deadlocked — e.g. printing the shortest file first: a big file can wait for ever if short ones keep arriving. Cure: first-come, first-served, or <strong>aging</strong> (raise the priority of whoever has waited long). Readers–writers with a continuous stream of readers starves the writer (lesson 2.C). On a server: a connection pool where some requests always lose the race for a connection and time out while others are served — the pool is busy, nobody is deadlocked, yet those requests starve.</p>
<p class="pitfall">⚠️ FE: "a problem closely related to deadlock and livelock is ___" → <strong>starvation</strong> (FE4#50, FE7#50, FE10#47, FE11#49, FE14#50); detecting starvation by tracking how long each job has waited is the same concept as <strong>aging</strong> (FE19#19, FE23#32, FE24#17, FE25#39, FE27#3); "which scheduling algorithm can lead to starvation?" → priority scheduling (FE3#20). FE5#44 keys "in livelock processes make progress, in deadlock they do not" — the key is badly worded: in a livelock the processes keep <em>running</em> (they are not blocked) but make <strong>no</strong> progress; choose that option because the others are worse, and know the real definition.</p>`,
        `<p class="y-chinh">🎯 Hình 6-16: tiến trình A lấy resource_1 rồi resource_2, tiến trình B lấy resource_2 rồi resource_1 — bằng <code>enter_region</code>, một khoá <strong>chờ bận (busy waiting)</strong>. Nếu A lấy được 1 và B lấy được 2, mỗi bên quay vòng mãi trên khoá của bên kia: không ai bị chặn, cả hai cứ tiêu hết lượng tử CPU hết lần này tới lần khác, và không ai tiến lên. Sách gọi đó là <strong>livelock</strong>: về chức năng tương đương bế tắc, nhưng không ai bị chặn.</p>
<p>Sự khác biệt nhìn được từ bên ngoài. Một luồng bế tắc ngủ trong nhân (trạng thái S, chờ trên một futex) và không tốn CPU; một luồng đang quay vòng hay livelock thì đang chạy (trạng thái R) và đốt trọn một nhân CPU. Đây là cùng một mẫu hai khoá dựng theo cả hai cách, nhìn bằng <code>ps</code>:</p>
<div class="out"># Bế tắc và livelock nhìn từ bên ngoài: luồng bị chặn thì ngủ (S), luồng quay vòng thì đốt CPU (R)<br>
$ ps -L -o tid,stat,wchan:22,comm -p $(pgrep -x treo)<br>
&nbsp;&nbsp;&nbsp;&nbsp;TID STAT WCHAN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 Sl &nbsp;&nbsp;futex_do_wait &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;treo<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17 Sl &nbsp;&nbsp;futex_do_wait &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;treo<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;18 Sl &nbsp;&nbsp;futex_do_wait &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;treo<br>
$ ps -L -o tid,stat,wchan:22,comm -p $(pgrep -x treo)<br>
&nbsp;&nbsp;&nbsp;&nbsp;TID STAT WCHAN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;29 Sl &nbsp;&nbsp;futex_do_wait &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;treo<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;31 Rl &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;treo<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32 Rl &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;treo</div>
<p>Lần chạy đầu: hai luồng làm việc (và <code>main</code>, đang chờ chúng) đều <code>S</code> trong <code>futex_do_wait</code> — bế tắc kinh điển. Lần chạy thứ hai: hai luồng làm việc là <code>R</code>, không có kênh chờ — chúng đang quay vòng; <code>top</code> sẽ cho thấy 200% CPU cho một chương trình chẳng làm gì.</p>
<p>➕ Nhiều tài liệu hiện đại dành chữ "livelock" cho trường hợp thú vị hơn, khi các tiến trình liên tục <em>đổi trạng thái</em> để phản ứng với nhau — như hai người lịch sự trong hành lang cùng né sang một phía, hết lần này tới lần khác. Trong mã: mỗi luồng lấy khoá thứ nhất, thử khoá thứ hai, và vì lịch sự nên trả khoá thứ nhất rồi chờ một khoảng cố định như nhau trước khi thử lại. Nếu chúng đi đều bước, chúng không bao giờ qua được:</p>
<pre><code class="language-c">// Livelock: hai luồng "lịch sự" trả khoá mỗi khi không lấy được khoá thứ hai — đi đều bước, mãi mãi
#include &lt;stdio.h&gt;
#include &lt;errno.h&gt;
#include &lt;pthread.h&gt;

pthread_mutex_t resource_1 = PTHREAD_MUTEX_INITIALIZER, resource_2 = PTHREAD_MUTEX_INITIALIZER;
pthread_barrier_t step;                         // ép trường hợp xấu nhất: hai luồng đi đúng đều bước
#define ROUNDS 5
int got[2][ROUNDS];                             // kết quả trylock của mỗi luồng ở mỗi vòng
int meals = 0;

void polite(int me, pthread_mutex_t *mine, pthread_mutex_t *other) {
    for (int r = 0; r &lt; ROUNDS; r++) {
        pthread_mutex_lock(mine);                       // 1. lấy tài nguyên thứ nhất
        pthread_barrier_wait(&amp;step);                    // (giờ cả hai đều giữ một cái)
        got[me][r] = pthread_mutex_trylock(other);      // 2. thử cái thứ hai — không bao giờ bị chặn
        pthread_barrier_wait(&amp;step);
        if (got[me][r] == 0) { meals++; pthread_mutex_unlock(other); }
        pthread_mutex_unlock(mine);                     // 3. lịch sự: trả lại cái thứ nhất
        pthread_barrier_wait(&amp;step);                    // 4. "chờ một khoảng cố định" — như nhau cho cả hai
    }
}
void *A(void *x) { polite(0, &amp;resource_1, &amp;resource_2); return NULL; }
void *B(void *x) { polite(1, &amp;resource_2, &amp;resource_1); return NULL; }

int main(void) {
    pthread_t a, b;
    pthread_barrier_init(&amp;step, NULL, 2);
    pthread_create(&amp;a, NULL, A, NULL);
    pthread_create(&amp;b, NULL, B, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    for (int r = 0; r &lt; ROUNDS; r++)
        printf("round %d: A holds resource_1, trylock(resource_2) = %s | B holds resource_2, trylock(resource_1) = %s\\n", r + 1,
               got[0][r] == EBUSY ? "EBUSY" : "ok", got[1][r] == EBUSY ? "EBUSY" : "ok");
    printf("%d rounds, %d lock operations, %d meals — nobody blocked, nobody progressed: LIVELOCK\\n", ROUNDS, ROUNDS * 4, meals);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread livelock.c -o livelock &amp;&amp; ./livelock<br>
round 1: A holds resource_1, trylock(resource_2) = EBUSY | B holds resource_2, trylock(resource_1) = EBUSY<br>
round 2: A holds resource_1, trylock(resource_2) = EBUSY | B holds resource_2, trylock(resource_1) = EBUSY<br>
round 3: A holds resource_1, trylock(resource_2) = EBUSY | B holds resource_2, trylock(resource_1) = EBUSY<br>
round 4: A holds resource_1, trylock(resource_2) = EBUSY | B holds resource_2, trylock(resource_1) = EBUSY<br>
round 5: A holds resource_1, trylock(resource_2) = EBUSY | B holds resource_2, trylock(resource_1) = EBUSY<br>
5 rounds, 20 lock operations, 0 meals — nobody blocked, nobody progressed: LIVELOCK</div>
<p>Rào chắn (barrier) ép trường hợp xấu nhất (đều bước hoàn hảo) để lần chạy lặp lại được; ngoài đời thời điểm trôi lệch và các luồng thường qua được sau vài vòng — nhưng khi tải cao, với khoảng thử lại giống hệt nhau, livelock có thể kéo dài rất lâu. Cách chữa là phá thế đối xứng: <strong>lùi ngẫu nhiên (random back-off)</strong> (chính <code>usleep(rand_r(…))</code> của slide 26), đúng như Ethernet làm sau một lần va chạm, hoặc một thứ tự cố định.</p>
<p>➕ <strong>Bỏ đói (starvation)</strong> (§6.7.4), họ hàng gần: một chính sách công bằng "tính trung bình" có thể bắt một tiến trình chờ mãi dù nó không bế tắc — vd in tệp ngắn nhất trước: một tệp lớn có thể chờ mãi nếu tệp ngắn cứ tới. Cách chữa: đến trước phục vụ trước, hoặc <strong>lão hoá (aging)</strong> (nâng độ ưu tiên của ai đã chờ lâu). Bài toán readers–writers với dòng người đọc liên tục làm người ghi bị bỏ đói (bài 2.C). Trên server: một connection pool mà vài request luôn thua cuộc tranh kết nối và hết hạn chờ trong khi request khác được phục vụ — pool vẫn bận, không ai bế tắc, vậy mà những request đó bị bỏ đói.</p>
<p class="pitfall">⚠️ FE: "vấn đề họ hàng gần với bế tắc và livelock là ___" → <strong>bỏ đói (starvation)</strong> (FE4#50, FE7#50, FE10#47, FE11#49, FE14#50); phát hiện bỏ đói bằng cách theo dõi mỗi job đã chờ bao lâu là cùng khái niệm với <strong>aging</strong> (FE19#19, FE23#32, FE24#17, FE25#39, FE27#3); "thuật toán lập lịch nào có thể gây bỏ đói?" → lập lịch theo độ ưu tiên (FE3#20). FE5#44 đánh dấu "trong livelock tiến trình có tiến triển, trong bế tắc thì không" — đáp án viết sai chữ: trong livelock tiến trình vẫn <em>chạy</em> (không bị chặn) nhưng <strong>không</strong> tiến triển; chọn phương án đó vì các phương án khác còn tệ hơn, và nhớ định nghĩa thật.</p>`],
      [31, 'End',
        `<p class="y-chinh">🎯 End of Chapter 6 — you can now define a deadlock, recognise it in a graph, a matrix or a thread dump, and choose among ignoring it, detecting and recovering, avoiding it, or preventing it.</p>
<p>Check yourself before moving on: can you tell a preemptable from a nonpreemptable resource (slide 2), state the four conditions and match each to its prevention approach (slides 6 and 28), say which event of a request sequence closes the cycle (slides 8–10), find a cycle with the book's algorithm (slides 14–15), run the E–A–C–R detection algorithm by hand (slides 16–18), list the three recovery methods (slide 19), explain why an unsafe state is not a deadlock (slide 22), decide safe or unsafe for single and multiple resources and check a proposed safe sequence (slides 21–25), and explain why ordering locks prevents deadlock (slide 27)? Then do the 🧪 practice lesson 6.B and the Chapter 6 quiz.</p>
<p>🧭 Three habits to take into every backend project: <strong>one lock order</strong> (by id) for anything that locks more than one thing, in Java and in SQL; <strong>timeouts</strong> on every wait — locks, database statements, HTTP calls, pool checkouts; and <strong>retry on deadlock</strong> for database transactions, because even with good ordering the database will occasionally pick your transaction as a victim.</p>
<p class="meo">🧠 Next: Advanced 1 — virtualisation and the cloud (deck osg7), then Chapters 8–12. Chapter 8's spinlocks and multiprocessor scheduling meet this chapter's locks again, on many CPUs at once.</p>`,
        `<p class="y-chinh">🎯 Hết Chương 6 — giờ bạn định nghĩa được bế tắc, nhận ra nó trong đồ thị, ma trận hay thread dump, và chọn được giữa lờ nó đi, phát hiện rồi khôi phục, tránh nó, hay ngăn ngừa nó.</p>
<p>Tự kiểm trước khi đi tiếp: bạn có phân biệt được tài nguyên trưng dụng được và không trưng dụng được (slide 2), kể được bốn điều kiện và ghép mỗi cái với cách ngăn ngừa của nó (slide 6 và 28), chỉ ra sự kiện nào trong một dãy yêu cầu đóng chu trình (slide 8–10), tìm được chu trình bằng thuật toán của sách (slide 14–15), chạy tay được thuật toán phát hiện E–A–C–R (slide 16–18), kể được ba cách khôi phục (slide 19), giải thích được vì sao trạng thái không an toàn chưa phải bế tắc (slide 22), kết luận an toàn hay không với một và nhiều loại tài nguyên và kiểm được một chuỗi an toàn cho sẵn (slide 21–25), và giải thích được vì sao sắp thứ tự khoá ngăn được bế tắc (slide 27) chưa? Rồi làm bài 🧪 thực hành 6.B và quiz Chương 6.</p>
<p>🧭 Ba thói quen mang vào mọi dự án backend: <strong>một thứ tự khoá</strong> (theo id) cho mọi chỗ khoá nhiều hơn một thứ, cả trong Java lẫn trong SQL; <strong>hạn chờ</strong> cho mọi sự chờ — khoá, câu lệnh CSDL, lời gọi HTTP, lấy kết nối từ pool; và <strong>thử lại khi bế tắc</strong> cho giao dịch cơ sở dữ liệu, vì kể cả khi sắp thứ tự tốt, cơ sở dữ liệu thỉnh thoảng vẫn chọn giao dịch của bạn làm nạn nhân.</p>
<p class="meo">🧠 Tiếp theo: Nâng cao 1 — ảo hoá và đám mây (deck osg7), rồi Chương 8–12. Spinlock và lập lịch đa xử lý của Chương 8 gặp lại các khoá của chương này, trên nhiều CPU cùng lúc.</p>`],
    ]),
    books([
      ['mos4', "Chapter 6, sections 6.1–6.7: resources, conditions and modeling, the ostrich algorithm, detection and recovery, avoidance (resource trajectories, safe states, the banker's algorithm), prevention, communication deadlocks, livelock, starvation; Figures 6-1 to 6-16", 'Chương 6, mục 6.1–6.7: tài nguyên, điều kiện và mô hình hoá, thuật toán đà điểu, phát hiện và khôi phục, tránh (quỹ đạo tài nguyên, trạng thái an toàn, thuật toán nhà băng), ngăn ngừa, bế tắc truyền thông, livelock, bỏ đói; Hình 6-1 tới 6-16'],
      ['ostep', 'Chapter 32 "Common Concurrency Problems" (deadlock bugs, the four conditions, prevention by lock ordering and trylock, avoidance via scheduling, detect and recover)', 'Chương 32 "Common Concurrency Problems" (lỗi bế tắc, bốn điều kiện, ngăn ngừa bằng thứ tự khoá và trylock, tránh nhờ lập lịch, phát hiện và khôi phục)'],
      ['mchoes', 'the process-management chapter on deadlock, starvation and the dining philosophers (the source of the FE wordings "no preemption allows a resource to be held as long as it is needed", "spooling deadlock")', 'chương quản lý tiến trình về bế tắc, bỏ đói và bữa tối các triết gia (nguồn của các câu FE "no preemption cho phép giữ tài nguyên bao lâu tuỳ cần", "bế tắc của spooling")'],
      ['man7', 'pthread_mutex_lock(3p) and pthread_mutexattr_settype(3p) (ERRORCHECK ⇒ EDEADLK), pthread_mutex_trylock, fcntl_locking(2) (F_SETLKW deadlock detection and its limits), pipe(7) (capacity), sem_wait(3)', 'pthread_mutex_lock(3p) và pthread_mutexattr_settype(3p) (ERRORCHECK ⇒ EDEADLK), pthread_mutex_trylock, fcntl_locking(2) (phát hiện bế tắc của F_SETLKW và giới hạn), pipe(7) (dung lượng), sem_wait(3)'],
      ['kernelDocs', 'Documentation/locking/lockdep-design.rst — the runtime locking correctness validator that reports lock-order cycles before they deadlock', 'Documentation/locking/lockdep-design.rst — bộ kiểm tính đúng của khoá lúc chạy, báo chu trình thứ tự khoá trước khi chúng thành bế tắc'],
    ]),
  ].join('\n'),
};

/* ───────── 6.B — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 6: banker, detection, safe states, fixing real deadlocks ───────── */
const L_on_ch6 = {
  title: '6.B — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 6: banker, detection, safe states, fixing real deadlocks|||6.B — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Chương 6: nhà băng, phát hiện, trạng thái an toàn, sửa bế tắc thật',
  slug: 'osg202-on-ch6',
  type: 'VIDEO',
  description: '7 bài tập Chương 6 có lời giải chạy thật trên Linux: thuật toán nhà băng nhiều loại tài nguyên trên dữ liệu mới (chuỗi an toàn và bốn yêu cầu với bốn kết cục cấp, hoãn, chờ, lỗi), thuật toán phát hiện bằng ma trận E–A–C–R (có tiến trình bế tắc mà không nằm trên chu trình), trạng thái an toàn với một loại tài nguyên, dãy sự kiện xin tài nguyên và sự kiện đóng chu trình, sửa một bế tắc vòng tròn ba luồng bằng thứ tự khoá, chẩn đoán một server treo bằng gdb gắn vào tiến trình đang chạy, và chuyển tiền trong Java bằng tryLock có hạn chờ; kèm bảng thuật ngữ Anh–Việt và tóm tắt chương.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.B · Practice &amp; review</span>
<h2>Seven exercises: the deadlock chapter, computed and run</h2>
<p class="lead">Chapter 6 gives the FE two kinds of questions: definitions and matching (lesson 6.A covers them slide by slide), and calculations — the banker's algorithm, the detection algorithm, safe or unsafe, which event closes the cycle. Exercises 1–4 are those calculations on <em>new</em> data, so you cannot just remember the book's answers; every answer is produced by the simulator of the course. Exercises 5–7 are the backend side: a real deadlock to fix, a hung program to diagnose, and a Java version that never waits forever. Try each first (the time is a target), then open the solution.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>1</td><td>banker's algorithm, several resource types: Need, A, safe sequence, four requests</td><td>6.A slides 24–25</td></tr>
<tr><td>2</td><td>detection with E, A, C, R — who is deadlocked</td><td>6.A slides 16–18</td></tr>
<tr><td>3</td><td>safe or unsafe with one resource type</td><td>6.A slides 21–23</td></tr>
<tr><td>4</td><td>a sequence of requests: which event closes the cycle</td><td>6.A slides 8–10</td></tr>
<tr><td>5</td><td>fix a three-thread circular wait by ordering locks</td><td>6.A slides 4, 27</td></tr>
<tr><td>6</td><td>diagnose a hung server with gdb</td><td>6.A slides 13–15</td></tr>
<tr><td>7</td><td>tryLock with a timeout in Java</td><td>6.A slides 26, 28</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 6 · Bài 6.B · Thực hành &amp; ôn tập</span>
<h2>Bảy bài tập: chương bế tắc, tính ra và chạy thật</h2>
<p class="lead">Chương 6 đưa vào FE hai kiểu câu: định nghĩa và ghép cặp (bài 6.A đã đi qua từng slide), và tính toán — thuật toán nhà băng, thuật toán phát hiện, an toàn hay không, sự kiện nào đóng chu trình. Bài 1–4 chính là các phép tính đó trên dữ liệu <em>mới</em>, để bạn không thể chỉ nhớ đáp án của sách; đáp án nào cũng do bộ mô phỏng của môn tính ra. Bài 5–7 là phía backend: một bế tắc thật phải sửa, một chương trình treo phải chẩn đoán, và một phiên bản Java không bao giờ chờ mãi. Tự làm từng bài trước (thời gian ghi kèm là mục tiêu), rồi mới mở lời giải.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>1</td><td>thuật toán nhà băng nhiều loại tài nguyên: Need, A, chuỗi an toàn, bốn yêu cầu</td><td>6.A slide 24–25</td></tr>
<tr><td>2</td><td>phát hiện với E, A, C, R — ai bế tắc</td><td>6.A slide 16–18</td></tr>
<tr><td>3</td><td>an toàn hay không với một loại tài nguyên</td><td>6.A slide 21–23</td></tr>
<tr><td>4</td><td>một dãy yêu cầu: sự kiện nào đóng chu trình</td><td>6.A slide 8–10</td></tr>
<tr><td>5</td><td>sửa chờ vòng tròn ba luồng bằng thứ tự khoá</td><td>6.A slide 4, 27</td></tr>
<tr><td>6</td><td>chẩn đoán server treo bằng gdb</td><td>6.A slide 13–15</td></tr>
<tr><td>7</td><td>tryLock có hạn chờ trong Java</td><td>6.A slide 26, 28</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — the banker's algorithm on new data (25 min)</h3>
<p>Three resource types with E = (7 4 8). Five processes:</p>
<table>
<thead><tr><th>Process</th><th>Allocation</th><th>Max</th></tr></thead>
<tbody>
<tr><td>P0</td><td>0 1 1</td><td>4 3 3</td></tr>
<tr><td>P1</td><td>2 0 0</td><td>3 2 2</td></tr>
<tr><td>P2</td><td>1 0 2</td><td>6 0 4</td></tr>
<tr><td>P3</td><td>1 1 0</td><td>2 2 2</td></tr>
<tr><td>P4</td><td>0 0 2</td><td>4 3 3</td></tr>
</tbody>
</table>
<p>(a) Compute Need = Max − Allocation and the available vector A. (b) Is the state safe? Give a safe sequence (scan P0…P4 in a circle). (c) Starting each time from <em>this</em> state, what does the banker answer to: P1 requests (1 0 1); P4 requests (2 2 0); P4 requests (3 3 0); P3 requests (2 0 0)?</p>
<details><summary>Solution — computed by the simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/2f6be4c16fc41c0f4589496de950a996644c2499.svg" alt="Exercise 1: the safety check, step by step" loading="lazy" /><p class="chu-thich">🧮 Exercise 1: the safety check, step by step</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BT1 = { ten: ['P0', 'P1', 'P2', 'P3', 'P4'], E: [7, 4, 8],
  giu: [[0, 1, 1], [2, 0, 0], [1, 0, 2], [1, 1, 0], [0, 0, 2]], max: [[4, 3, 3], [3, 2, 2], [6, 0, 4], [2, 2, 2], [4, 3, 3]] };
const YC = [[1, [1, 0, 1]], [4, [2, 2, 0]], [4, [3, 3, 0]], [3, [2, 0, 0]]];
const BT2 = { ten: ['P0', 'P1', 'P2', 'P3'], E: [3, 1, 1], A: [1, 0, 0],
  C: [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]], R: [[0, 1, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]] };
const BT3 = [
  { nhan: '(a)', has: [2, 4, 3], max: [8, 6, 5], free: 3 },
  { nhan: '(b)', has: [3, 3, 4], max: [8, 6, 9], free: 2 },
  { nhan: '(c)', has: [5, 2, 3], max: [8, 6, 5], free: 2 },
];
const BT4 = { tp: ['P1', 'P2', 'P3', 'P4'], tn: ['R1', 'R2', 'R3'],
  sk: [['P1', 'R1'], ['P2', 'R2'], ['P3', 'R3'], ['P1', 'R2'], ['P3', 'R1'], ['P4', 'R3'], ['P2', 'R3']] };
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/07fa716900cfa11675e3f665f33313dd123c1c1e.svg" alt="Exercise 1: the four requests" loading="lazy" /><p class="chu-thich">🧮 Exercise 1: the four requests</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BT1 = { ten: ['P0', 'P1', 'P2', 'P3', 'P4'], E: [7, 4, 8],
  giu: [[0, 1, 1], [2, 0, 0], [1, 0, 2], [1, 1, 0], [0, 0, 2]], max: [[4, 3, 3], [3, 2, 2], [6, 0, 4], [2, 2, 2], [4, 3, 3]] };
const YC = [[1, [1, 0, 1]], [4, [2, 2, 0]], [4, [3, 3, 0]], [3, [2, 0, 0]]];
const BT2 = { ten: ['P0', 'P1', 'P2', 'P3'], E: [3, 1, 1], A: [1, 0, 0],
  C: [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]], R: [[0, 1, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]] };
const BT3 = [
  { nhan: '(a)', has: [2, 4, 3], max: [8, 6, 5], free: 3 },
  { nhan: '(b)', has: [3, 3, 4], max: [8, 6, 9], free: 2 },
  { nhan: '(c)', has: [5, 2, 3], max: [8, 6, 5], free: 2 },
];
const BT4 = { tp: ['P1', 'P2', 'P3', 'P4'], tn: ['R1', 'R2', 'R3'],
  sk: [['P1', 'R1'], ['P2', 'R2'], ['P3', 'R3'], ['P1', 'R2'], ['P3', 'R1'], ['P4', 'R3'], ['P2', 'R3']] };
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;</code></pre></details>
<ul>
<li>(a) Sum of Allocation = (4 2 5), so A = (7 4 8) − (4 2 5) = <strong>(3 2 3)</strong>. Need: P0 (4 2 2), P1 (1 2 2), P2 (5 0 2), P3 (1 1 2), P4 (4 3 1).</li>
<li>(b) <strong>Safe</strong>: P1 → P2 → P3 → P4 → P0. P0 is skipped first (needs 4 tapes, only 3 free); after P1 finishes A = (5 2 3) and P2's (5 0 2) fits.</li>
<li>(c) Three checks in order — ≤ Need? ≤ A? still safe? P1 (1 0 1): passes all three → <strong>grant</strong>. P4 (2 2 0): fits Need and A, but the new A (1 0 3) leaves nobody able to finish → <strong>defer</strong> (unsafe). P4 (3 3 0): more plotters than available → <strong>wait</strong>. P3 (2 0 0): more than its own Need (1 1 2) → <strong>error</strong> — it broke its declared maximum.</li>
</ul>
</details>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>Rehearse the request routine on the simulator’s table, then apply it to the exercise: pretend to grant, run the safety scan, keep it only if the state stays safe.</p>
<div class="os-lab os-lab-sim-deadlock os-lab-p-request os-lab-t-deadlock-banker"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> grant or wait: a request against the banker <a href="/os-lab?sim=deadlock&amp;preset=request&amp;lang=en&amp;tour=deadlock-banker" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Type a request in the Request boxes: check Request ≤ Need and Request ≤ Available first.</li><li>Step the safety scan on the pretended state and decide: grant or wait.</li></ol></div>
</div>`,
    `<h3>🧪 Bài 1 — thuật toán nhà băng trên dữ liệu mới (25 phút)</h3>
<p>Ba loại tài nguyên với E = (7 4 8). Năm tiến trình:</p>
<table>
<thead><tr><th>Tiến trình</th><th>Allocation</th><th>Max</th></tr></thead>
<tbody>
<tr><td>P0</td><td>0 1 1</td><td>4 3 3</td></tr>
<tr><td>P1</td><td>2 0 0</td><td>3 2 2</td></tr>
<tr><td>P2</td><td>1 0 2</td><td>6 0 4</td></tr>
<tr><td>P3</td><td>1 1 0</td><td>2 2 2</td></tr>
<tr><td>P4</td><td>0 0 2</td><td>4 3 3</td></tr>
</tbody>
</table>
<p>(a) Tính Need = Max − Allocation và vector khả dụng A. (b) Trạng thái có an toàn không? Cho một chuỗi an toàn (quét P0…P4 theo vòng). (c) Mỗi lần đều xuất phát từ <em>trạng thái này</em>, nhà băng trả lời gì cho: P1 xin (1 0 1); P4 xin (2 2 0); P4 xin (3 3 0); P3 xin (2 0 0)?</p>
<details><summary>Lời giải — bộ mô phỏng tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8c430708ac3f4c94515153122f2245a964cbaa48.svg" alt="Bài 1: phép kiểm an toàn từng bước" loading="lazy" /><p class="chu-thich">🧮 Bài 1: phép kiểm an toàn từng bước</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BT1 = { ten: ['P0', 'P1', 'P2', 'P3', 'P4'], E: [7, 4, 8],
  giu: [[0, 1, 1], [2, 0, 0], [1, 0, 2], [1, 1, 0], [0, 0, 2]], max: [[4, 3, 3], [3, 2, 2], [6, 0, 4], [2, 2, 2], [4, 3, 3]] };
const YC = [[1, [1, 0, 1]], [4, [2, 2, 0]], [4, [3, 3, 0]], [3, [2, 0, 0]]];
const BT2 = { ten: ['P0', 'P1', 'P2', 'P3'], E: [3, 1, 1], A: [1, 0, 0],
  C: [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]], R: [[0, 1, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]] };
const BT3 = [
  { nhan: '(a)', has: [2, 4, 3], max: [8, 6, 5], free: 3 },
  { nhan: '(b)', has: [3, 3, 4], max: [8, 6, 9], free: 2 },
  { nhan: '(c)', has: [5, 2, 3], max: [8, 6, 5], free: 2 },
];
const BT4 = { tp: ['P1', 'P2', 'P3', 'P4'], tn: ['R1', 'R2', 'R3'],
  sk: [['P1', 'R1'], ['P2', 'R2'], ['P3', 'R3'], ['P1', 'R2'], ['P3', 'R1'], ['P4', 'R3'], ['P2', 'R3']] };
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9b3bfe0bfd661094bd57dcb34a068f759a163994.svg" alt="Bài 1: bốn yêu cầu" loading="lazy" /><p class="chu-thich">🧮 Bài 1: bốn yêu cầu</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BT1 = { ten: ['P0', 'P1', 'P2', 'P3', 'P4'], E: [7, 4, 8],
  giu: [[0, 1, 1], [2, 0, 0], [1, 0, 2], [1, 1, 0], [0, 0, 2]], max: [[4, 3, 3], [3, 2, 2], [6, 0, 4], [2, 2, 2], [4, 3, 3]] };
const YC = [[1, [1, 0, 1]], [4, [2, 2, 0]], [4, [3, 3, 0]], [3, [2, 0, 0]]];
const BT2 = { ten: ['P0', 'P1', 'P2', 'P3'], E: [3, 1, 1], A: [1, 0, 0],
  C: [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]], R: [[0, 1, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]] };
const BT3 = [
  { nhan: '(a)', has: [2, 4, 3], max: [8, 6, 5], free: 3 },
  { nhan: '(b)', has: [3, 3, 4], max: [8, 6, 9], free: 2 },
  { nhan: '(c)', has: [5, 2, 3], max: [8, 6, 5], free: 2 },
];
const BT4 = { tp: ['P1', 'P2', 'P3', 'P4'], tn: ['R1', 'R2', 'R3'],
  sk: [['P1', 'R1'], ['P2', 'R2'], ['P3', 'R3'], ['P1', 'R2'], ['P3', 'R1'], ['P4', 'R3'], ['P2', 'R3']] };
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;</code></pre></details>
<ul>
<li>(a) Tổng Allocation = (4 2 5), nên A = (7 4 8) − (4 2 5) = <strong>(3 2 3)</strong>. Need: P0 (4 2 2), P1 (1 2 2), P2 (5 0 2), P3 (1 1 2), P4 (4 3 1).</li>
<li>(b) <strong>An toàn</strong>: P1 → P2 → P3 → P4 → P0. P0 bị bỏ qua lúc đầu (cần 4 ổ băng, chỉ còn 3); sau khi P1 xong A = (5 2 3) và (5 0 2) của P2 vừa.</li>
<li>(c) Ba phép kiểm theo thứ tự — ≤ Need? ≤ A? còn an toàn? P1 (1 0 1): qua cả ba → <strong>cấp</strong>. P4 (2 2 0): vừa Need và A, nhưng A mới (1 0 3) không để ai chạy xong được → <strong>hoãn</strong> (không an toàn). P4 (3 3 0): xin nhiều máy vẽ hơn số đang có → <strong>chờ</strong>. P3 (2 0 0): vượt chính Need của nó (1 1 2) → <strong>lỗi</strong> — nó phá mức tối đa đã khai.</li>
</ul>
</details>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>Tập quy trình xử lý yêu cầu trên bảng của mô phỏng, rồi áp vào bài: giả vờ cấp, chạy vòng kiểm an toàn, chỉ giữ nếu trạng thái còn an toàn.</p>
<div class="os-lab os-lab-sim-deadlock os-lab-p-request os-lab-t-deadlock-banker"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> cấp hay chờ: một yêu cầu trước nhà băng <a href="/os-lab?sim=deadlock&amp;preset=request&amp;lang=vi&amp;tour=deadlock-banker" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Gõ một yêu cầu vào các ô Request: kiểm Request ≤ Need và Request ≤ Available trước.</li><li>Bấm vòng kiểm an toàn trên trạng thái giả định rồi quyết: cấp hay chờ.</li></ol></div>
</div>`),
    bi(`<h3>🧪 Exercise 2 — who is deadlocked? (15 min)</h3>
<p>Three resource types X, Y, Z with E = (3 1 1) and A = (1 0 0). Current allocation C and request matrix R:</p>
<table>
<thead><tr><th>Process</th><th>C (holds)</th><th>R (requests)</th></tr></thead>
<tbody>
<tr><td>P0</td><td>1 0 0</td><td>0 1 0</td></tr>
<tr><td>P1</td><td>0 1 0</td><td>0 0 1</td></tr>
<tr><td>P2</td><td>0 0 1</td><td>0 1 0</td></tr>
<tr><td>P3</td><td>1 0 0</td><td>1 0 0</td></tr>
</tbody>
</table>
<p>(a) Check E = A + ΣC. (b) Run the detection algorithm of slide 17. Which processes are deadlocked? (c) Is every deadlocked process on a cycle?</p>
<details><summary>Solution — computed by the simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5ad13aaaa8d82c248a4e7e85969e28436b78cad9.svg" alt="Exercise 2 drawn as a graph: the cycle P1 → Z → P2 → Y → P1, and P0 waiting for Y" loading="lazy" /><p class="chu-thich">🧮 Exercise 2 drawn as a graph: the cycle P1 → Z → P2 → Y → P1, and P0 waiting for Y</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BT1 = { ten: ['P0', 'P1', 'P2', 'P3', 'P4'], E: [7, 4, 8],
  giu: [[0, 1, 1], [2, 0, 0], [1, 0, 2], [1, 1, 0], [0, 0, 2]], max: [[4, 3, 3], [3, 2, 2], [6, 0, 4], [2, 2, 2], [4, 3, 3]] };
const YC = [[1, [1, 0, 1]], [4, [2, 2, 0]], [4, [3, 3, 0]], [3, [2, 0, 0]]];
const BT2 = { ten: ['P0', 'P1', 'P2', 'P3'], E: [3, 1, 1], A: [1, 0, 0],
  C: [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]], R: [[0, 1, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]] };
const BT3 = [
  { nhan: '(a)', has: [2, 4, 3], max: [8, 6, 5], free: 3 },
  { nhan: '(b)', has: [3, 3, 4], max: [8, 6, 9], free: 2 },
  { nhan: '(c)', has: [5, 2, 3], max: [8, 6, 5], free: 2 },
];
const BT4 = { tp: ['P1', 'P2', 'P3', 'P4'], tn: ['R1', 'R2', 'R3'],
  sk: [['P1', 'R1'], ['P2', 'R2'], ['P3', 'R3'], ['P1', 'R2'], ['P3', 'R1'], ['P4', 'R3'], ['P2', 'R3']] };
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;</code></pre></details>
<ul>
<li>(a) ΣC = (2 1 1); plus A (1 0 0) = (3 1 1) = E ✓.</li>
<li>(b) Only P3's request (1 0 0) fits A: P3 finishes and returns (1 0 0), A = (2 0 0). Now P0 needs Y, P1 needs Z, P2 needs Y — none is free. <strong>P0, P1 and P2 are deadlocked.</strong></li>
<li>(c) No. The cycle is P1 → Z → P2 → Y → P1 (P1 holds Y and wants Z, P2 holds Z and wants Y). P0 is not on it, but it waits for Y, which only a member of the cycle can release — by the definition of slide 5 it is deadlocked too. The matrix algorithm finds such processes automatically; a picture-based search for cycles would miss P0.</li>
</ul>
</details>
<div class="lab-try">
<h3>🔬 Try it now</h3>
<p>The scan of this exercise on the simulator’s table: detection uses Request instead of Need.</p>
<div class="os-lab os-lab-sim-deadlock os-lab-p-detect os-lab-t-deadlock-detect"><p class="os-lab-cap">🧪 <strong>OS lab:</strong> detection with a Request matrix <a href="/os-lab?sim=deadlock&amp;preset=detect&amp;lang=en&amp;tour=deadlock-detect" target="_blank" rel="noopener">Open full screen →</a></p></div>
<div class="callout"><b>Your tasks:</b><ol><li>Step the scan and cross out each process that can finish.</li><li>The processes left at the end are the deadlocked ones — then run the same scan on the exercise on paper.</li></ol></div>
</div>`,
    `<h3>🧪 Bài 2 — ai bế tắc? (15 phút)</h3>
<p>Ba loại tài nguyên X, Y, Z với E = (3 1 1) và A = (1 0 0). Ma trận cấp phát hiện tại C và ma trận yêu cầu R:</p>
<table>
<thead><tr><th>Tiến trình</th><th>C (đang giữ)</th><th>R (đang xin)</th></tr></thead>
<tbody>
<tr><td>P0</td><td>1 0 0</td><td>0 1 0</td></tr>
<tr><td>P1</td><td>0 1 0</td><td>0 0 1</td></tr>
<tr><td>P2</td><td>0 0 1</td><td>0 1 0</td></tr>
<tr><td>P3</td><td>1 0 0</td><td>1 0 0</td></tr>
</tbody>
</table>
<p>(a) Kiểm E = A + ΣC. (b) Chạy thuật toán phát hiện của slide 17. Những tiến trình nào bế tắc? (c) Tiến trình bế tắc nào cũng nằm trên chu trình à?</p>
<details><summary>Lời giải — bộ mô phỏng tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4553457323a118854b5fb6703b028406b33a3f93.svg" alt="Bài 2 vẽ thành đồ thị: chu trình P1 → Z → P2 → Y → P1, và P0 chờ Y" loading="lazy" /><p class="chu-thich">🧮 Bài 2 vẽ thành đồ thị: chu trình P1 → Z → P2 → Y → P1, và P0 chờ Y</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BT1 = { ten: ['P0', 'P1', 'P2', 'P3', 'P4'], E: [7, 4, 8],
  giu: [[0, 1, 1], [2, 0, 0], [1, 0, 2], [1, 1, 0], [0, 0, 2]], max: [[4, 3, 3], [3, 2, 2], [6, 0, 4], [2, 2, 2], [4, 3, 3]] };
const YC = [[1, [1, 0, 1]], [4, [2, 2, 0]], [4, [3, 3, 0]], [3, [2, 0, 0]]];
const BT2 = { ten: ['P0', 'P1', 'P2', 'P3'], E: [3, 1, 1], A: [1, 0, 0],
  C: [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]], R: [[0, 1, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]] };
const BT3 = [
  { nhan: '(a)', has: [2, 4, 3], max: [8, 6, 5], free: 3 },
  { nhan: '(b)', has: [3, 3, 4], max: [8, 6, 9], free: 2 },
  { nhan: '(c)', has: [5, 2, 3], max: [8, 6, 5], free: 2 },
];
const BT4 = { tp: ['P1', 'P2', 'P3', 'P4'], tn: ['R1', 'R2', 'R3'],
  sk: [['P1', 'R1'], ['P2', 'R2'], ['P3', 'R3'], ['P1', 'R2'], ['P3', 'R1'], ['P4', 'R3'], ['P2', 'R3']] };
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;</code></pre></details>
<ul>
<li>(a) ΣC = (2 1 1); cộng A (1 0 0) = (3 1 1) = E ✓.</li>
<li>(b) Chỉ yêu cầu (1 0 0) của P3 vừa A: P3 chạy xong và trả (1 0 0), A = (2 0 0). Giờ P0 cần Y, P1 cần Z, P2 cần Y — không cái nào rảnh. <strong>P0, P1 và P2 bế tắc.</strong></li>
<li>(c) Không. Chu trình là P1 → Z → P2 → Y → P1 (P1 giữ Y và muốn Z, P2 giữ Z và muốn Y). P0 không nằm trên đó, nhưng nó chờ Y, thứ chỉ một thành viên của chu trình mới trả được — theo định nghĩa ở slide 5 nó cũng bế tắc. Thuật toán ma trận tự tìm ra những tiến trình như vậy; tìm chu trình bằng mắt trên hình sẽ bỏ sót P0.</li>
</ul>
</details>
<div class="lab-try">
<h3>🔬 Thử ngay</h3>
<p>Vòng quét của bài này trên bảng của mô phỏng: phát hiện dùng Request thay cho Need.</p>
<div class="os-lab os-lab-sim-deadlock os-lab-p-detect os-lab-t-deadlock-detect"><p class="os-lab-cap">🧪 <strong>Phòng lab hệ điều hành:</strong> phát hiện với ma trận Request <a href="/os-lab?sim=deadlock&amp;preset=detect&amp;lang=vi&amp;tour=deadlock-detect" target="_blank" rel="noopener">Mở toàn màn hình →</a></p></div>
<div class="callout"><b>Việc cần làm:</b><ol><li>Bấm vòng quét và gạch từng tiến trình xong được.</li><li>Các tiến trình còn lại cuối cùng là các tiến trình bế tắc — rồi chạy cùng vòng quét đó cho bài trên giấy.</li></ol></div>
</div>`),
    bi(`<h3>🧪 Exercise 3 — safe or unsafe, one resource type (10 min)</h3>
<p>12 units of one resource. For each state, decide safe or unsafe and give a safe sequence if there is one: (a) A has 2 / max 8, B 4 / 6, C 3 / 5, free 3; (b) A 3 / 8, B 3 / 6, C 4 / 9, free 2; (c) A 5 / 8, B 2 / 6, C 3 / 5, free 2. (d) FE type: "10 units; P1 has 3 of max 6, P2 4 of 5, P3 3 of 7 — what is the state?"</p>
<details><summary>Solution — computed by the simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4d998be9d0879550d28af9ffabbcfdfc2b4bd46d.svg" alt="Exercise 3: (a) safe, (b) unsafe, (c) safe" loading="lazy" /><p class="chu-thich">🧮 Exercise 3: (a) safe, (b) unsafe, (c) safe</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BT1 = { ten: ['P0', 'P1', 'P2', 'P3', 'P4'], E: [7, 4, 8],
  giu: [[0, 1, 1], [2, 0, 0], [1, 0, 2], [1, 1, 0], [0, 0, 2]], max: [[4, 3, 3], [3, 2, 2], [6, 0, 4], [2, 2, 2], [4, 3, 3]] };
const YC = [[1, [1, 0, 1]], [4, [2, 2, 0]], [4, [3, 3, 0]], [3, [2, 0, 0]]];
const BT2 = { ten: ['P0', 'P1', 'P2', 'P3'], E: [3, 1, 1], A: [1, 0, 0],
  C: [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]], R: [[0, 1, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]] };
const BT3 = [
  { nhan: '(a)', has: [2, 4, 3], max: [8, 6, 5], free: 3 },
  { nhan: '(b)', has: [3, 3, 4], max: [8, 6, 9], free: 2 },
  { nhan: '(c)', has: [5, 2, 3], max: [8, 6, 5], free: 2 },
];
const BT4 = { tp: ['P1', 'P2', 'P3', 'P4'], tn: ['R1', 'R2', 'R3'],
  sk: [['P1', 'R1'], ['P2', 'R2'], ['P3', 'R3'], ['P1', 'R2'], ['P3', 'R1'], ['P4', 'R3'], ['P2', 'R3']] };
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;</code></pre></details>
<ul>
<li>(a) Remaining needs 6, 2, 2 with 3 free → B (free 7), C (free 10), A → <strong>safe</strong>.</li>
<li>(b) Needs 5, 3, 5 with 2 free → nobody fits → <strong>unsafe</strong> (not necessarily a deadlock).</li>
<li>(c) Needs 3, 4, 2 with 2 free → C (free 5), A (free 10), B → <strong>safe</strong>.</li>
<li>(d) That is FE3#48: 10 units are all allocated, free 0, needs 3, 1, 4 → <strong>unsafe</strong>.</li>
</ul>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/25651080002ba7703ff1cb01a6798d52cf4634c5.svg" alt="FE3#48 recomputed" loading="lazy" /><p class="chu-thich">🧮 FE3#48 recomputed</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-9': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3 },
  'hinh-6-10': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3, capTruoc: { i: 0, so: 1 } },
  'fe2-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [8, 6, 5], free: 5 },
  'fe3-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [6, 5, 7], free: 0 },
};
const HINH_6_11 = [
  { nhan: '(a)', has: [0, 0, 0, 0], max: [6, 5, 4, 7], free: 10 },
  { nhan: '(b)', has: [1, 1, 2, 4], max: [6, 5, 4, 7], free: 2 },
  { nhan: '(c)', has: [1, 2, 2, 4], max: [6, 5, 4, 7], free: 1 },
];

/** Dựng dãy bảng: với mỗi tiến trình thuật toán chọn — (1) nó nhận đủ phần còn thiếu, (2) nó chạy xong và trả hết. */
function trinhDien({ ten, has, max, free, capTruoc }, t) {
  const st = { has: [...has], max: [...max], free };
  const buoc = [];
  const chup = (ghi, toMau = -1, xau = false) =&gt; buoc.push({ nhan: &#96;(&#36;{String.fromCharCode(97 + buoc.length)})&#96;, ten, has: [...st.has], max: [...st.max], free: st.free, toMau, ghi, xau });
  chup(t('start', 'ban đầu'));
  if (capTruoc) {
    st.has[capTruoc.i] += capTruoc.so; st.free -= capTruoc.so;
    chup(t(&#96;&#36;{ten[capTruoc.i]} gets &#36;{capTruoc.so} more&#96;, &#96;&#36;{ten[capTruoc.i]} được thêm &#36;{capTruoc.so}&#96;), capTruoc.i, true);
  }
  const r = motLoai(st);
  for (const i of r.chuoi) {
    const thieu = st.max[i] - st.has[i];
    if (thieu &gt; 0) { st.has[i] += thieu; st.free -= thieu; chup(t(&#96;&#36;{ten[i]} gets &#36;{thieu}, runs&#96;, &#96;&#36;{ten[i]} nhận &#36;{thieu}, chạy&#96;), i); }
    st.free += st.has[i]; st.has[i] = 0; st.max[i] = null;
    chup(t(&#96;&#36;{ten[i]} done, frees all&#96;, &#96;&#36;{ten[i]} xong, trả hết&#96;), i);
  }
  if (!r.anToan) chup(t(&#96;stuck: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} need &gt; &#36;{st.free}&#96;, &#96;kẹt: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} cần &gt; &#36;{st.free}&#96;), -1, true);
  return { buoc, r };
}</code></pre></details>
</details>`,
    `<h3>🧪 Bài 3 — an toàn hay không, một loại tài nguyên (10 phút)</h3>
<p>12 đơn vị của một loại tài nguyên. Với mỗi trạng thái, kết luận an toàn hay không và cho chuỗi an toàn nếu có: (a) A có 2 / tối đa 8, B 4 / 6, C 3 / 5, trống 3; (b) A 3 / 8, B 3 / 6, C 4 / 9, trống 2; (c) A 5 / 8, B 2 / 6, C 3 / 5, trống 2. (d) Kiểu FE: "10 đơn vị; P1 có 3 trên tối đa 6, P2 có 4 trên 5, P3 có 3 trên 7 — trạng thái là gì?"</p>
<details><summary>Lời giải — bộ mô phỏng tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b8ae3f13a6b533c76b9d5ea1e7d9c00457d1196a.svg" alt="Bài 3: (a) an toàn, (b) không an toàn, (c) an toàn" loading="lazy" /><p class="chu-thich">🧮 Bài 3: (a) an toàn, (b) không an toàn, (c) an toàn</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BT1 = { ten: ['P0', 'P1', 'P2', 'P3', 'P4'], E: [7, 4, 8],
  giu: [[0, 1, 1], [2, 0, 0], [1, 0, 2], [1, 1, 0], [0, 0, 2]], max: [[4, 3, 3], [3, 2, 2], [6, 0, 4], [2, 2, 2], [4, 3, 3]] };
const YC = [[1, [1, 0, 1]], [4, [2, 2, 0]], [4, [3, 3, 0]], [3, [2, 0, 0]]];
const BT2 = { ten: ['P0', 'P1', 'P2', 'P3'], E: [3, 1, 1], A: [1, 0, 0],
  C: [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]], R: [[0, 1, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]] };
const BT3 = [
  { nhan: '(a)', has: [2, 4, 3], max: [8, 6, 5], free: 3 },
  { nhan: '(b)', has: [3, 3, 4], max: [8, 6, 9], free: 2 },
  { nhan: '(c)', has: [5, 2, 3], max: [8, 6, 5], free: 2 },
];
const BT4 = { tp: ['P1', 'P2', 'P3', 'P4'], tn: ['R1', 'R2', 'R3'],
  sk: [['P1', 'R1'], ['P2', 'R2'], ['P3', 'R3'], ['P1', 'R2'], ['P3', 'R1'], ['P4', 'R3'], ['P2', 'R3']] };
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;</code></pre></details>
<ul>
<li>(a) Phần còn cần 6, 2, 2 với 3 trống → B (trống 7), C (trống 10), A → <strong>an toàn</strong>.</li>
<li>(b) Còn cần 5, 3, 5 với 2 trống → không ai vừa → <strong>không an toàn</strong> (chưa chắc đã bế tắc).</li>
<li>(c) Còn cần 3, 4, 2 với 2 trống → C (trống 5), A (trống 10), B → <strong>an toàn</strong>.</li>
<li>(d) Đó là FE3#48: 10 đơn vị đã cấp hết, trống 0, còn cần 3, 1, 4 → <strong>không an toàn</strong>.</li>
</ul>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/619e5cbb0a6271ed9d0e244aa3e0625677aff262.svg" alt="Tính lại FE3#48" loading="lazy" /><p class="chu-thich">🧮 Tính lại FE3#48</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  'hinh-6-9': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3 },
  'hinh-6-10': { ten: ['A', 'B', 'C'], has: [3, 2, 2], max: [9, 4, 7], free: 3, capTruoc: { i: 0, so: 1 } },
  'fe2-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [8, 6, 5], free: 5 },
  'fe3-48': { ten: ['P1', 'P2', 'P3'], has: [3, 4, 3], max: [6, 5, 7], free: 0 },
};
const HINH_6_11 = [
  { nhan: '(a)', has: [0, 0, 0, 0], max: [6, 5, 4, 7], free: 10 },
  { nhan: '(b)', has: [1, 1, 2, 4], max: [6, 5, 4, 7], free: 2 },
  { nhan: '(c)', has: [1, 2, 2, 4], max: [6, 5, 4, 7], free: 1 },
];

/** Dựng dãy bảng: với mỗi tiến trình thuật toán chọn — (1) nó nhận đủ phần còn thiếu, (2) nó chạy xong và trả hết. */
function trinhDien({ ten, has, max, free, capTruoc }, t) {
  const st = { has: [...has], max: [...max], free };
  const buoc = [];
  const chup = (ghi, toMau = -1, xau = false) =&gt; buoc.push({ nhan: &#96;(&#36;{String.fromCharCode(97 + buoc.length)})&#96;, ten, has: [...st.has], max: [...st.max], free: st.free, toMau, ghi, xau });
  chup(t('start', 'ban đầu'));
  if (capTruoc) {
    st.has[capTruoc.i] += capTruoc.so; st.free -= capTruoc.so;
    chup(t(&#96;&#36;{ten[capTruoc.i]} gets &#36;{capTruoc.so} more&#96;, &#96;&#36;{ten[capTruoc.i]} được thêm &#36;{capTruoc.so}&#96;), capTruoc.i, true);
  }
  const r = motLoai(st);
  for (const i of r.chuoi) {
    const thieu = st.max[i] - st.has[i];
    if (thieu &gt; 0) { st.has[i] += thieu; st.free -= thieu; chup(t(&#96;&#36;{ten[i]} gets &#36;{thieu}, runs&#96;, &#96;&#36;{ten[i]} nhận &#36;{thieu}, chạy&#96;), i); }
    st.free += st.has[i]; st.has[i] = 0; st.max[i] = null;
    chup(t(&#96;&#36;{ten[i]} done, frees all&#96;, &#96;&#36;{ten[i]} xong, trả hết&#96;), i);
  }
  if (!r.anToan) chup(t(&#96;stuck: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} need &gt; &#36;{st.free}&#96;, &#96;kẹt: &#36;{r.ket.map((i) =&gt; ten[i]).join(', ')} cần &gt; &#36;{st.free}&#96;), -1, true);
  return { buoc, r };
}</code></pre></details>
</details>`),
    bi(`<h3>🧪 Exercise 4 — which event causes the deadlock? (10 min)</h3>
<p>Single-instance resources R1, R2, R3. Events in order: 1. P1 requests R1; 2. P2 requests R2; 3. P3 requests R3; 4. P1 requests R2; 5. P3 requests R1; 6. P4 requests R3; 7. P2 requests R3. After which event does the system first contain a deadlock, and which processes are stuck?</p>
<details><summary>Solution — computed by the simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3c0075e42ffe4888177bd1721228907b0146ef38.svg" alt="Exercise 4: the graph after event 7" loading="lazy" /><p class="chu-thich">🧮 Exercise 4: the graph after event 7</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BT1 = { ten: ['P0', 'P1', 'P2', 'P3', 'P4'], E: [7, 4, 8],
  giu: [[0, 1, 1], [2, 0, 0], [1, 0, 2], [1, 1, 0], [0, 0, 2]], max: [[4, 3, 3], [3, 2, 2], [6, 0, 4], [2, 2, 2], [4, 3, 3]] };
const YC = [[1, [1, 0, 1]], [4, [2, 2, 0]], [4, [3, 3, 0]], [3, [2, 0, 0]]];
const BT2 = { ten: ['P0', 'P1', 'P2', 'P3'], E: [3, 1, 1], A: [1, 0, 0],
  C: [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]], R: [[0, 1, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]] };
const BT3 = [
  { nhan: '(a)', has: [2, 4, 3], max: [8, 6, 5], free: 3 },
  { nhan: '(b)', has: [3, 3, 4], max: [8, 6, 9], free: 2 },
  { nhan: '(c)', has: [5, 2, 3], max: [8, 6, 5], free: 2 },
];
const BT4 = { tp: ['P1', 'P2', 'P3', 'P4'], tn: ['R1', 'R2', 'R3'],
  sk: [['P1', 'R1'], ['P2', 'R2'], ['P3', 'R3'], ['P1', 'R2'], ['P3', 'R1'], ['P4', 'R3'], ['P2', 'R3']] };
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;</code></pre></details>
<ul>
<li>Events 1–3 are granted. Event 4 blocks P1 (P2 holds R2), event 5 blocks P3 (P1 holds R1), event 6 blocks P4 (P3 holds R3) — still no cycle: P2 is running and could release R2.</li>
<li>Event 7: P2 requests R3, held by P3 → the cycle P1 → R2 → P2 → R3 → P3 → R1 → P1 closes. <strong>Event 7</strong> causes the deadlock (same reasoning as FE28#14, where the answer is event 6).</li>
<li>P1, P2, P3 are on the cycle; P4 waits for R3 behind it — stuck as well.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 4 — sự kiện nào gây bế tắc? (10 phút)</h3>
<p>Tài nguyên một thể hiện R1, R2, R3. Các sự kiện theo thứ tự: 1. P1 xin R1; 2. P2 xin R2; 3. P3 xin R3; 4. P1 xin R2; 5. P3 xin R1; 6. P4 xin R3; 7. P2 xin R3. Sau sự kiện nào hệ thống lần đầu chứa bế tắc, và những tiến trình nào kẹt?</p>
<details><summary>Lời giải — bộ mô phỏng tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/19f4f889b373a2191f85bb902df87973a298ca8a.svg" alt="Bài 4: đồ thị sau sự kiện 7" loading="lazy" /><p class="chu-thich">🧮 Bài 4: đồ thị sau sự kiện 7</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BT1 = { ten: ['P0', 'P1', 'P2', 'P3', 'P4'], E: [7, 4, 8],
  giu: [[0, 1, 1], [2, 0, 0], [1, 0, 2], [1, 1, 0], [0, 0, 2]], max: [[4, 3, 3], [3, 2, 2], [6, 0, 4], [2, 2, 2], [4, 3, 3]] };
const YC = [[1, [1, 0, 1]], [4, [2, 2, 0]], [4, [3, 3, 0]], [3, [2, 0, 0]]];
const BT2 = { ten: ['P0', 'P1', 'P2', 'P3'], E: [3, 1, 1], A: [1, 0, 0],
  C: [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]], R: [[0, 1, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]] };
const BT3 = [
  { nhan: '(a)', has: [2, 4, 3], max: [8, 6, 5], free: 3 },
  { nhan: '(b)', has: [3, 3, 4], max: [8, 6, 9], free: 2 },
  { nhan: '(c)', has: [5, 2, 3], max: [8, 6, 5], free: 2 },
];
const BT4 = { tp: ['P1', 'P2', 'P3', 'P4'], tn: ['R1', 'R2', 'R3'],
  sk: [['P1', 'R1'], ['P2', 'R2'], ['P3', 'R3'], ['P1', 'R2'], ['P3', 'R1'], ['P4', 'R3'], ['P2', 'R3']] };
const v = (a) =&gt; &#96;(&#36;{a.join(' ')})&#96;;</code></pre></details>
<ul>
<li>Sự kiện 1–3 được cấp. Sự kiện 4 chặn P1 (P2 giữ R2), sự kiện 5 chặn P3 (P1 giữ R1), sự kiện 6 chặn P4 (P3 giữ R3) — vẫn chưa có chu trình: P2 đang chạy và có thể trả R2.</li>
<li>Sự kiện 7: P2 xin R3, P3 đang giữ → chu trình P1 → R2 → P2 → R3 → P3 → R1 → P1 khép lại. <strong>Sự kiện 7</strong> gây bế tắc (cùng cách lập luận với FE28#14, nơi đáp án là sự kiện 6).</li>
<li>P1, P2, P3 nằm trên chu trình; P4 chờ R3 phía sau nó — cũng kẹt.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 5 — fix a three-way deadlock (15 min)</h3>
<p>Three threads move money around a ring: thread 0 from account A to B, thread 1 from B to C, thread 2 from C to A. Each transfer locks the source account, then the destination:</p>
<pre class="trich"><code class="language-c">void transfer(struct account *from, struct account *to, long amount) {
    pthread_mutex_lock(&amp;from-&gt;lock);            // hold "from" ...
    usleep(50 * 1000);                          // (a slow database call in real life)
    pthread_mutex_lock(&amp;to-&gt;lock);              // ... and wait for "to"
    from-&gt;balance -= amount; to-&gt;balance += amount;
    pthread_mutex_unlock(&amp;to-&gt;lock);
    pthread_mutex_unlock(&amp;from-&gt;lock);
}</code></pre>
<p>(a) Run it in your head: which four conditions hold, and what is the cycle? (b) Change <code>transfer</code> so that no deadlock is possible, without adding a new lock.</p>
<details><summary>Solution — run for real</summary>
<pre><code class="language-c">// Exercise 5 (bug): three threads move money A-&gt;B, B-&gt;C, C-&gt;A; each locks "from" first, then "to"
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;errno.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;

struct account { int id; long balance; pthread_mutex_t lock; } acc[3] = {
    { 0, 1000, PTHREAD_MUTEX_INITIALIZER }, { 1, 1000, PTHREAD_MUTEX_INITIALIZER }, { 2, 1000, PTHREAD_MUTEX_INITIALIZER } };

void transfer(struct account *from, struct account *to, long amount) {
    pthread_mutex_lock(&amp;from-&gt;lock);            // hold "from" ...
    usleep(50 * 1000);                          // (a slow database call in real life)
    pthread_mutex_lock(&amp;to-&gt;lock);              // ... and wait for "to"
    from-&gt;balance -= amount; to-&gt;balance += amount;
    pthread_mutex_unlock(&amp;to-&gt;lock);
    pthread_mutex_unlock(&amp;from-&gt;lock);
}

void *worker(void *arg) {
    int i = (int)(long)arg;                     // thread i moves from account i to account (i+1) % 3
    for (int k = 0; k &lt; 100; k++) transfer(&amp;acc[i], &amp;acc[(i + 1) % 3], 1);
    return NULL;
}

int main(void) {
    pthread_t t[3];
    alarm(5);
    for (long i = 0; i &lt; 3; i++) pthread_create(&amp;t[i], NULL, worker, (void *)i);
    sleep(1);
    int stuck = 0;
    for (int i = 0; i &lt; 3; i++) if (pthread_tryjoin_np(t[i], NULL) == EBUSY) stuck++;
    if (stuck == 3) printf("after 1 s all 3 threads are stuck: 0 waits for 1, 1 waits for 2, 2 waits for 0 — DEADLOCK\\n");
    else printf("all transfers done\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread vong-ba.c -o vong-ba &amp;&amp; ./vong-ba<br>
after 1 s all 3 threads are stuck: 0 waits for 1, 1 waits for 2, 2 waits for 0 — DEADLOCK</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<ul>
<li>(a) Mutex = mutual exclusion; each thread holds "from" while waiting for "to" = hold and wait; nobody unlocks another thread's mutex = no preemption; 0 waits for B (held by 1), 1 waits for C (held by 2), 2 waits for A (held by 0) = <strong>circular wait of length 3</strong>.</li>
<li>(b) Order the locks by account id (Figure 6-13): thread 2 (C → A) now locks A first, then C. The ring is broken — one thread always holds the lower-numbered lock of the pair it needs, and can only wait for a higher one:</li>
</ul>
<pre class="trich"><code class="language-c">void transfer(struct account *from, struct account *to, long amount) {
    struct account *lo = from-&gt;id &lt; to-&gt;id ? from : to;    // Figure 6-13: resources numbered,
    struct account *hi = from-&gt;id &lt; to-&gt;id ? to : from;    // always request in increasing order
    pthread_mutex_lock(&amp;lo-&gt;lock);
    usleep(50 * 1000);
    pthread_mutex_lock(&amp;hi-&gt;lock);
    from-&gt;balance -= amount; to-&gt;balance += amount;
    pthread_mutex_unlock(&amp;hi-&gt;lock);
    pthread_mutex_unlock(&amp;lo-&gt;lock);
}</code></pre>
<pre><code class="language-c">// Exercise 5 (fixed): the same three threads, locks taken in increasing account id
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;

struct account { int id; long balance; pthread_mutex_t lock; } acc[3] = {
    { 0, 1000, PTHREAD_MUTEX_INITIALIZER }, { 1, 1000, PTHREAD_MUTEX_INITIALIZER }, { 2, 1000, PTHREAD_MUTEX_INITIALIZER } };

void transfer(struct account *from, struct account *to, long amount) {
    struct account *lo = from-&gt;id &lt; to-&gt;id ? from : to;    // Figure 6-13: resources numbered,
    struct account *hi = from-&gt;id &lt; to-&gt;id ? to : from;    // always request in increasing order
    pthread_mutex_lock(&amp;lo-&gt;lock);
    usleep(50 * 1000);
    pthread_mutex_lock(&amp;hi-&gt;lock);
    from-&gt;balance -= amount; to-&gt;balance += amount;
    pthread_mutex_unlock(&amp;hi-&gt;lock);
    pthread_mutex_unlock(&amp;lo-&gt;lock);
}

void *worker(void *arg) {
    int i = (int)(long)arg;
    for (int k = 0; k &lt; 20; k++) transfer(&amp;acc[i], &amp;acc[(i + 1) % 3], 1);
    return NULL;
}

int main(void) {
    pthread_t t[3];
    for (long i = 0; i &lt; 3; i++) pthread_create(&amp;t[i], NULL, worker, (void *)i);
    for (int i = 0; i &lt; 3; i++) pthread_join(t[i], NULL);
    printf("all transfers done: A = %ld, B = %ld, C = %ld, total = %ld\\n",
           acc[0].balance, acc[1].balance, acc[2].balance, acc[0].balance + acc[1].balance + acc[2].balance);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread vong-ba-sua.c -o vong-ba-sua &amp;&amp; ./vong-ba-sua<br>
all transfers done: A = 1000, B = 1000, C = 1000, total = 3000</div>
<p>All 60 transfers finish and the total stays 3000. In SQL the same fix is <code>SELECT … FOR UPDATE … ORDER BY id</code>.</p>
</details>`,
    `<h3>🧪 Bài 5 — sửa một bế tắc ba bên (15 phút)</h3>
<p>Ba luồng chuyển tiền theo vòng: luồng 0 từ tài khoản A sang B, luồng 1 từ B sang C, luồng 2 từ C sang A. Mỗi lần chuyển khoá tài khoản nguồn, rồi tài khoản đích:</p>
<pre class="trich"><code class="language-c">void transfer(struct account *from, struct account *to, long amount) {
    pthread_mutex_lock(&amp;from-&gt;lock);            // giữ "từ" ...
    usleep(50 * 1000);                          // (ngoài đời: một lần gọi CSDL chậm)
    pthread_mutex_lock(&amp;to-&gt;lock);              // ... rồi chờ "tới"
    from-&gt;balance -= amount; to-&gt;balance += amount;
    pthread_mutex_unlock(&amp;to-&gt;lock);
    pthread_mutex_unlock(&amp;from-&gt;lock);
}</code></pre>
<p>(a) Chạy trong đầu: bốn điều kiện nào đúng, và chu trình là gì? (b) Sửa <code>transfer</code> để không thể bế tắc, mà không thêm khoá mới.</p>
<details><summary>Lời giải — chạy thật</summary>
<pre><code class="language-c">// Bài 5 (lỗi): ba luồng chuyển tiền A-&gt;B, B-&gt;C, C-&gt;A; luồng nào cũng khoá "từ" trước, rồi "tới"
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;errno.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;

struct account { int id; long balance; pthread_mutex_t lock; } acc[3] = {
    { 0, 1000, PTHREAD_MUTEX_INITIALIZER }, { 1, 1000, PTHREAD_MUTEX_INITIALIZER }, { 2, 1000, PTHREAD_MUTEX_INITIALIZER } };

void transfer(struct account *from, struct account *to, long amount) {
    pthread_mutex_lock(&amp;from-&gt;lock);            // giữ "từ" ...
    usleep(50 * 1000);                          // (ngoài đời: một lần gọi CSDL chậm)
    pthread_mutex_lock(&amp;to-&gt;lock);              // ... rồi chờ "tới"
    from-&gt;balance -= amount; to-&gt;balance += amount;
    pthread_mutex_unlock(&amp;to-&gt;lock);
    pthread_mutex_unlock(&amp;from-&gt;lock);
}

void *worker(void *arg) {
    int i = (int)(long)arg;                     // luồng i chuyển từ tài khoản i sang (i+1) % 3
    for (int k = 0; k &lt; 100; k++) transfer(&amp;acc[i], &amp;acc[(i + 1) % 3], 1);
    return NULL;
}

int main(void) {
    pthread_t t[3];
    alarm(5);
    for (long i = 0; i &lt; 3; i++) pthread_create(&amp;t[i], NULL, worker, (void *)i);
    sleep(1);
    int stuck = 0;
    for (int i = 0; i &lt; 3; i++) if (pthread_tryjoin_np(t[i], NULL) == EBUSY) stuck++;
    if (stuck == 3) printf("after 1 s all 3 threads are stuck: 0 waits for 1, 1 waits for 2, 2 waits for 0 — DEADLOCK\\n");
    else printf("all transfers done\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread vong-ba.c -o vong-ba &amp;&amp; ./vong-ba<br>
after 1 s all 3 threads are stuck: 0 waits for 1, 1 waits for 2, 2 waits for 0 — DEADLOCK</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<ul>
<li>(a) Mutex = loại trừ lẫn nhau; mỗi luồng giữ "từ" trong khi chờ "tới" = giữ và chờ; không ai mở mutex hộ luồng khác = không trưng dụng; 0 chờ B (1 giữ), 1 chờ C (2 giữ), 2 chờ A (0 giữ) = <strong>chờ vòng tròn độ dài 3</strong>.</li>
<li>(b) Sắp khoá theo id tài khoản (Hình 6-13): luồng 2 (C → A) giờ khoá A trước, rồi C. Vòng bị phá — luôn có một luồng đang giữ khoá số nhỏ hơn trong cặp nó cần, và chỉ có thể chờ khoá số lớn hơn:</li>
</ul>
<pre class="trich"><code class="language-c">void transfer(struct account *from, struct account *to, long amount) {
    struct account *lo = from-&gt;id &lt; to-&gt;id ? from : to;    // Hình 6-13: đánh số tài nguyên,
    struct account *hi = from-&gt;id &lt; to-&gt;id ? to : from;    // luôn xin theo thứ tự tăng dần
    pthread_mutex_lock(&amp;lo-&gt;lock);
    usleep(50 * 1000);
    pthread_mutex_lock(&amp;hi-&gt;lock);
    from-&gt;balance -= amount; to-&gt;balance += amount;
    pthread_mutex_unlock(&amp;hi-&gt;lock);
    pthread_mutex_unlock(&amp;lo-&gt;lock);
}</code></pre>
<pre><code class="language-c">// Bài 5 (đã sửa): vẫn ba luồng đó, khoá lấy theo id tài khoản tăng dần
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;

struct account { int id; long balance; pthread_mutex_t lock; } acc[3] = {
    { 0, 1000, PTHREAD_MUTEX_INITIALIZER }, { 1, 1000, PTHREAD_MUTEX_INITIALIZER }, { 2, 1000, PTHREAD_MUTEX_INITIALIZER } };

void transfer(struct account *from, struct account *to, long amount) {
    struct account *lo = from-&gt;id &lt; to-&gt;id ? from : to;    // Hình 6-13: đánh số tài nguyên,
    struct account *hi = from-&gt;id &lt; to-&gt;id ? to : from;    // luôn xin theo thứ tự tăng dần
    pthread_mutex_lock(&amp;lo-&gt;lock);
    usleep(50 * 1000);
    pthread_mutex_lock(&amp;hi-&gt;lock);
    from-&gt;balance -= amount; to-&gt;balance += amount;
    pthread_mutex_unlock(&amp;hi-&gt;lock);
    pthread_mutex_unlock(&amp;lo-&gt;lock);
}

void *worker(void *arg) {
    int i = (int)(long)arg;
    for (int k = 0; k &lt; 20; k++) transfer(&amp;acc[i], &amp;acc[(i + 1) % 3], 1);
    return NULL;
}

int main(void) {
    pthread_t t[3];
    for (long i = 0; i &lt; 3; i++) pthread_create(&amp;t[i], NULL, worker, (void *)i);
    for (int i = 0; i &lt; 3; i++) pthread_join(t[i], NULL);
    printf("all transfers done: A = %ld, B = %ld, C = %ld, total = %ld\\n",
           acc[0].balance, acc[1].balance, acc[2].balance, acc[0].balance + acc[1].balance + acc[2].balance);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread vong-ba-sua.c -o vong-ba-sua &amp;&amp; ./vong-ba-sua<br>
all transfers done: A = 1000, B = 1000, C = 1000, total = 3000</div>
<p>Cả 60 lần chuyển đều xong và tổng vẫn là 3000. Trong SQL cách sửa tương tự là <code>SELECT … FOR UPDATE … ORDER BY id</code>.</p>
</details>`),
    bi(`<h3>🧪 Exercise 6 — a server stopped answering: diagnose it with gdb (15 min)</h3>
<p>A small C "payment server" has two request handlers, <code>handle_pay</code> and <code>handle_refund</code>. After a few seconds it stops answering; CPU is 0%. Without reading its source, attach a debugger to the running process and find out (a) what every thread is doing, (b) which two code paths are involved, (c) the fix.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_PTRACE</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 6: a "server" stopped answering. Attach gdb to the running process and look at every thread's stack<br>
$ gdb -p $(pgrep -x server) -batch -ex "thread apply all bt" 2&gt;/dev/null | grep -E "^Thread|^#[0-9]+ .* in (lock_|handle_|pay|refund|main)"<br>
Thread 3 (Thread 0xffffb432f1a0 (LWP 18) "server"):<br>
#2 &nbsp;0x0000aaaab9fc08a8 in lock_orders () at _treo-lon.c:5<br>
#3 &nbsp;0x0000aaaab9fc0920 in handle_refund (x=0x0) at _treo-lon.c:8<br>
Thread 2 (Thread 0xffffb4b3f1a0 (LWP 17) "server"):<br>
#2 &nbsp;0x0000aaaab9fc08c8 in lock_wallets () at _treo-lon.c:6<br>
#3 &nbsp;0x0000aaaab9fc08f4 in handle_pay (x=0x0) at _treo-lon.c:7<br>
Thread 1 (Thread 0xffffb4d2ff80 (LWP 15) "server"):<br>
#2 &nbsp;0x0000aaaab9fc0980 in main () at _treo-lon.c:14</div>
<ul>
<li>(a) <code>gdb -p &lt;pid&gt; -batch -ex "thread apply all bt"</code> attaches to the live process and prints every thread's call stack (the course container needs <code>--cap-add=SYS_PTRACE</code>; on your own Linux, use <code>sudo</code>). Thread 1 is <code>main</code>, waiting in <code>pthread_join</code>; threads 2 and 3 are inside <code>pthread_mutex_lock</code> (frames #0–#1 are glibc, filtered out here).</li>
<li>(b) Thread 2 is in <code>handle_pay</code> → <code>lock_wallets</code> (it already holds orders); thread 3 is in <code>handle_refund</code> → <code>lock_orders</code> (it already holds wallets). Opposite orders — the cycle of slide 4.</li>
<li>(c) Make both handlers take <code>orders</code> before <code>wallets</code>. For Java the same diagnosis is <code>jstack &lt;pid&gt;</code> (6.A, slide 15), which even names the cycle for you.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 6 — server không trả lời nữa: chẩn đoán bằng gdb (15 phút)</h3>
<p>Một "server thanh toán" nhỏ viết bằng C có hai handler xử lý request, <code>handle_pay</code> và <code>handle_refund</code>. Sau vài giây nó ngừng trả lời; CPU 0%. Không đọc mã nguồn, hãy gắn trình gỡ lỗi vào tiến trình đang chạy và tìm ra (a) mỗi luồng đang làm gì, (b) hai đường mã nào dính vào, (c) cách sửa.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_PTRACE</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 6: một "server" không trả lời nữa. Gắn gdb vào tiến trình đang chạy và xem ngăn xếp của mọi luồng<br>
$ gdb -p $(pgrep -x server) -batch -ex "thread apply all bt" 2&gt;/dev/null | grep -E "^Thread|^#[0-9]+ .* in (lock_|handle_|pay|refund|main)"<br>
Thread 3 (Thread 0xffffb432f1a0 (LWP 18) "server"):<br>
#2 &nbsp;0x0000aaaab9fc08a8 in lock_orders () at _treo-lon.c:5<br>
#3 &nbsp;0x0000aaaab9fc0920 in handle_refund (x=0x0) at _treo-lon.c:8<br>
Thread 2 (Thread 0xffffb4b3f1a0 (LWP 17) "server"):<br>
#2 &nbsp;0x0000aaaab9fc08c8 in lock_wallets () at _treo-lon.c:6<br>
#3 &nbsp;0x0000aaaab9fc08f4 in handle_pay (x=0x0) at _treo-lon.c:7<br>
Thread 1 (Thread 0xffffb4d2ff80 (LWP 15) "server"):<br>
#2 &nbsp;0x0000aaaab9fc0980 in main () at _treo-lon.c:14</div>
<ul>
<li>(a) <code>gdb -p &lt;pid&gt; -batch -ex "thread apply all bt"</code> gắn vào tiến trình đang sống và in ngăn xếp lời gọi của mọi luồng (container của môn cần <code>--cap-add=SYS_PTRACE</code>; trên Linux của bạn thì dùng <code>sudo</code>). Luồng 1 là <code>main</code>, đang chờ trong <code>pthread_join</code>; luồng 2 và 3 đang ở trong <code>pthread_mutex_lock</code> (khung #0–#1 là của glibc, đã lọc bỏ ở đây).</li>
<li>(b) Luồng 2 ở <code>handle_pay</code> → <code>lock_wallets</code> (nó đã giữ orders); luồng 3 ở <code>handle_refund</code> → <code>lock_orders</code> (nó đã giữ wallets). Ngược thứ tự — chính chu trình của slide 4.</li>
<li>(c) Cho cả hai handler lấy <code>orders</code> trước <code>wallets</code>. Với Java, cách chẩn đoán tương tự là <code>jstack &lt;pid&gt;</code> (6.A, slide 15), còn gọi tên luôn chu trình giúp bạn.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 7 — Java transfers that never wait forever (15 min)</h3>
<p>Two threads transfer money 2,000 times each between accounts a and b, in opposite directions, each taking <code>from.lock</code> then <code>to.lock</code>. Without changing the order, use <code>ReentrantLock.tryLock(timeout)</code> so that a deadlock cannot last: which of the four conditions does your version break, and what must happen when the second lock is not obtained?</p>
<details><summary>Solution — run for real</summary>
<pre class="trich"><code class="language-java">static int giveUps = 0;
static boolean transfer(Account from, Account to, long amount) throws InterruptedException {
    for (int attempt = 1; attempt &lt;= 50; attempt++) {
        if (from.lock.tryLock(10, TimeUnit.MILLISECONDS)) {            // wait at most 10 ms
            try {
                if (to.lock.tryLock(10, TimeUnit.MILLISECONDS)) {
                    try { from.balance -= amount; to.balance += amount; return true; }
                    finally { to.lock.unlock(); }
                }
            } finally { from.lock.unlock(); }                           // ALWAYS give the first lock back
        }
        synchronized (ChuyenTien.class) { giveUps++; }
        Thread.sleep(attempt % 3);                                      // short back-off, different each attempt
    }
    return false;
}</code></pre>
<pre><code class="language-java">// Exercise 7: ReentrantLock.tryLock(timeout) — never wait forever, give back, retry
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class ChuyenTien {
    static class Account {
        final int id; long balance; final ReentrantLock lock = new ReentrantLock();
        Account(int id, long b) { this.id = id; this.balance = b; }
    }

    static int giveUps = 0;
    static boolean transfer(Account from, Account to, long amount) throws InterruptedException {
        for (int attempt = 1; attempt &lt;= 50; attempt++) {
            if (from.lock.tryLock(10, TimeUnit.MILLISECONDS)) {            // wait at most 10 ms
                try {
                    if (to.lock.tryLock(10, TimeUnit.MILLISECONDS)) {
                        try { from.balance -= amount; to.balance += amount; return true; }
                        finally { to.lock.unlock(); }
                    }
                } finally { from.lock.unlock(); }                           // ALWAYS give the first lock back
            }
            synchronized (ChuyenTien.class) { giveUps++; }
            Thread.sleep(attempt % 3);                                      // short back-off, different each attempt
        }
        return false;
    }

    public static void main(String[] args) throws Exception {
        Account a = new Account(1, 1000), b = new Account(2, 1000);
        Thread t1 = new Thread(() -&gt; { try { for (int i = 0; i &lt; 2000; i++) transfer(a, b, 1); } catch (InterruptedException e) { } });
        Thread t2 = new Thread(() -&gt; { try { for (int i = 0; i &lt; 2000; i++) transfer(b, a, 1); } catch (InterruptedException e) { } });
        t1.start(); t2.start(); t1.join(); t2.join();
        System.out.println("4000 transfers in opposite directions finished");
        System.out.println("total = " + (a.balance + b.balance) + " (must be 2000)");
    }
}</code></pre>
<div class="out">$ javac ChuyenTien.java &amp;&amp; java ChuyenTien<br>
4000 transfers in opposite directions finished<br>
total = 2000 (must be 2000)</div>
<ul>
<li>A thread never waits more than 10 ms for a lock, and if it cannot get the second one it <strong>releases the first</strong> (the <code>finally</code>) before retrying — so it never waits while holding: <strong>hold and wait</strong> is broken (and, seen from the other side, the thread "preempts itself" — a timeout attacks <strong>no preemption</strong>).</li>
<li>The short back-off, different for each attempt, prevents the two threads from retrying in lockstep for ever (livelock, slide 30).</li>
<li>In Spring with JPA the same idea is a pessimistic lock timeout (<code>jakarta.persistence.lock.timeout</code>) plus a retry around the transaction.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 7 — chuyển tiền Java không bao giờ chờ mãi (15 phút)</h3>
<p>Hai luồng chuyển tiền mỗi luồng 2.000 lần giữa tài khoản a và b, ngược chiều nhau, mỗi lần lấy <code>from.lock</code> rồi <code>to.lock</code>. Không đổi thứ tự, hãy dùng <code>ReentrantLock.tryLock(timeout)</code> để bế tắc không thể kéo dài: phiên bản của bạn phá điều kiện nào trong bốn, và khi không lấy được khoá thứ hai thì phải làm gì?</p>
<details><summary>Lời giải — chạy thật</summary>
<pre class="trich"><code class="language-java">static int giveUps = 0;
static boolean transfer(Account from, Account to, long amount) throws InterruptedException {
    for (int attempt = 1; attempt &lt;= 50; attempt++) {
        if (from.lock.tryLock(10, TimeUnit.MILLISECONDS)) {            // chờ tối đa 10 ms
            try {
                if (to.lock.tryLock(10, TimeUnit.MILLISECONDS)) {
                    try { from.balance -= amount; to.balance += amount; return true; }
                    finally { to.lock.unlock(); }
                }
            } finally { from.lock.unlock(); }                           // LUÔN trả khoá thứ nhất
        }
        synchronized (ChuyenTien.class) { giveUps++; }
        Thread.sleep(attempt % 3);                                      // lùi một chút, mỗi lần một khác
    }
    return false;
}</code></pre>
<pre><code class="language-java">// Bài 7: ReentrantLock.tryLock(timeout) — không bao giờ chờ mãi, trả lại, thử lại
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class ChuyenTien {
    static class Account {
        final int id; long balance; final ReentrantLock lock = new ReentrantLock();
        Account(int id, long b) { this.id = id; this.balance = b; }
    }

    static int giveUps = 0;
    static boolean transfer(Account from, Account to, long amount) throws InterruptedException {
        for (int attempt = 1; attempt &lt;= 50; attempt++) {
            if (from.lock.tryLock(10, TimeUnit.MILLISECONDS)) {            // chờ tối đa 10 ms
                try {
                    if (to.lock.tryLock(10, TimeUnit.MILLISECONDS)) {
                        try { from.balance -= amount; to.balance += amount; return true; }
                        finally { to.lock.unlock(); }
                    }
                } finally { from.lock.unlock(); }                           // LUÔN trả khoá thứ nhất
            }
            synchronized (ChuyenTien.class) { giveUps++; }
            Thread.sleep(attempt % 3);                                      // lùi một chút, mỗi lần một khác
        }
        return false;
    }

    public static void main(String[] args) throws Exception {
        Account a = new Account(1, 1000), b = new Account(2, 1000);
        Thread t1 = new Thread(() -&gt; { try { for (int i = 0; i &lt; 2000; i++) transfer(a, b, 1); } catch (InterruptedException e) { } });
        Thread t2 = new Thread(() -&gt; { try { for (int i = 0; i &lt; 2000; i++) transfer(b, a, 1); } catch (InterruptedException e) { } });
        t1.start(); t2.start(); t1.join(); t2.join();
        System.out.println("4000 transfers in opposite directions finished");
        System.out.println("total = " + (a.balance + b.balance) + " (must be 2000)");
    }
}</code></pre>
<div class="out">$ javac ChuyenTien.java &amp;&amp; java ChuyenTien<br>
4000 transfers in opposite directions finished<br>
total = 2000 (must be 2000)</div>
<ul>
<li>Một luồng không bao giờ chờ khoá quá 10 ms, và nếu không lấy được khoá thứ hai nó <strong>trả khoá thứ nhất</strong> (khối <code>finally</code>) trước khi thử lại — nên nó không bao giờ vừa giữ vừa chờ: phá <strong>giữ và chờ</strong> (và nhìn từ phía bên kia, luồng "tự trưng dụng chính mình" — hạn chờ tấn công <strong>không trưng dụng</strong>).</li>
<li>Khoảng lùi ngắn, mỗi lần thử một khác, ngăn hai luồng thử lại đều bước mãi mãi (livelock, slide 30).</li>
<li>Trong Spring với JPA, cùng ý tưởng là hạn chờ khoá bi quan (<code>jakarta.persistence.lock.timeout</code>) cộng một vòng thử lại quanh giao dịch.</li>
</ul>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>deadlock</strong></td><td>bế tắc</td><td>A set of processes each waiting for an event that only another process in the set can cause.</td></tr>
<tr><td><strong>preemptable / nonpreemptable resource</strong></td><td>tài nguyên trưng dụng được / không trưng dụng được</td><td>Can be taken away with no ill effects (memory) versus cannot be taken away without potentially causing failure (Blu-ray recorder, a locked row).</td></tr>
<tr><td><strong>mutual exclusion</strong></td><td>loại trừ lẫn nhau</td><td>Each resource is either assigned to exactly one process or available.</td></tr>
<tr><td><strong>hold and wait</strong></td><td>giữ và chờ</td><td>A process holding resources may request more and wait for them.</td></tr>
<tr><td><strong>no preemption</strong></td><td>không trưng dụng</td><td>Granted resources cannot be forcibly taken away; the holder must release them.</td></tr>
<tr><td><strong>circular wait</strong></td><td>chờ vòng tròn</td><td>A cycle of two or more processes, each waiting for a resource held by the next.</td></tr>
<tr><td><strong>resource-allocation graph</strong></td><td>đồ thị cấp phát tài nguyên</td><td>Circles = processes, squares = resources; resource → process = held, process → resource = blocked waiting.</td></tr>
<tr><td><strong>ostrich algorithm</strong></td><td>thuật toán đà điểu</td><td>Ignore deadlocks because they are rare and costly to prevent.</td></tr>
<tr><td><strong>E, A, C, R</strong></td><td>vector tồn tại, vector khả dụng, ma trận cấp phát, ma trận yêu cầu</td><td>The four structures of matrix detection; Σ C + A = E for every resource type.</td></tr>
<tr><td><strong>safe / unsafe state</strong></td><td>trạng thái an toàn / không an toàn</td><td>Safe = some order lets every process finish even if all ask for their maximum; unsafe = no such order is guaranteed (not yet a deadlock).</td></tr>
<tr><td><strong>safe sequence</strong></td><td>chuỗi an toàn</td><td>An order P1, P2, … in which each process's remaining need fits into what is free plus what the earlier ones returned.</td></tr>
<tr><td><strong>banker's algorithm</strong></td><td>thuật toán nhà băng</td><td>Dijkstra's avoidance algorithm: grant a request only if the resulting state is safe.</td></tr>
<tr><td><strong>checkpoint / rollback</strong></td><td>điểm kiểm tra / quay lui</td><td>Periodically saved process state; on deadlock a process is restarted from an earlier checkpoint.</td></tr>
<tr><td><strong>lock ordering</strong></td><td>sắp thứ tự khoá</td><td>Number all resources and always request them in increasing order — breaks circular wait.</td></tr>
<tr><td><strong>two-phase locking</strong></td><td>khoá hai pha</td><td>A transaction first acquires all the locks it needs, then does its work and releases them.</td></tr>
<tr><td><strong>livelock</strong></td><td>khoá sống</td><td>Processes keep running or changing state in response to each other but make no progress.</td></tr>
<tr><td><strong>starvation / aging</strong></td><td>bỏ đói / lão hoá</td><td>A process waits indefinitely although others progress; aging raises the priority of whoever has waited long.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>deadlock</strong></td><td>bế tắc</td><td>Một tập tiến trình mà mỗi tiến trình chờ một sự kiện chỉ tiến trình khác trong tập gây ra được.</td></tr>
<tr><td><strong>preemptable / nonpreemptable resource</strong></td><td>tài nguyên trưng dụng được / không trưng dụng được</td><td>Lấy đi được mà không hại gì (bộ nhớ) so với không lấy đi được mà không có nguy cơ gây hỏng (đầu ghi Blu-ray, một dòng đang bị khoá).</td></tr>
<tr><td><strong>mutual exclusion</strong></td><td>loại trừ lẫn nhau</td><td>Mỗi tài nguyên hoặc đang cấp cho đúng một tiến trình, hoặc đang rảnh.</td></tr>
<tr><td><strong>hold and wait</strong></td><td>giữ và chờ</td><td>Tiến trình đang giữ tài nguyên vẫn được xin thêm và chờ chúng.</td></tr>
<tr><td><strong>no preemption</strong></td><td>không trưng dụng</td><td>Tài nguyên đã cấp không thể bị cưỡng ép lấy lại; chủ của nó phải tự trả.</td></tr>
<tr><td><strong>circular wait</strong></td><td>chờ vòng tròn</td><td>Một vòng từ hai tiến trình trở lên, mỗi tiến trình chờ tài nguyên do kẻ kế tiếp giữ.</td></tr>
<tr><td><strong>resource-allocation graph</strong></td><td>đồ thị cấp phát tài nguyên</td><td>Tròn = tiến trình, vuông = tài nguyên; tài nguyên → tiến trình = đang giữ, tiến trình → tài nguyên = đang bị chặn chờ.</td></tr>
<tr><td><strong>ostrich algorithm</strong></td><td>thuật toán đà điểu</td><td>Lờ bế tắc đi vì nó hiếm và ngăn nó thì đắt.</td></tr>
<tr><td><strong>E, A, C, R</strong></td><td>vector tồn tại, vector khả dụng, ma trận cấp phát, ma trận yêu cầu</td><td>Bốn cấu trúc của phát hiện bằng ma trận; Σ C + A = E với mọi loại tài nguyên.</td></tr>
<tr><td><strong>safe / unsafe state</strong></td><td>trạng thái an toàn / không an toàn</td><td>An toàn = có thứ tự cho mọi tiến trình chạy xong kể cả khi tất cả xin mức tối đa; không an toàn = không bảo đảm có thứ tự đó (chưa phải bế tắc).</td></tr>
<tr><td><strong>safe sequence</strong></td><td>chuỗi an toàn</td><td>Một thứ tự P1, P2, … trong đó phần còn cần của mỗi tiến trình vừa với phần trống cộng phần các tiến trình trước đã trả.</td></tr>
<tr><td><strong>banker's algorithm</strong></td><td>thuật toán nhà băng</td><td>Thuật toán tránh bế tắc của Dijkstra: chỉ cấp yêu cầu nếu trạng thái sau khi cấp là an toàn.</td></tr>
<tr><td><strong>checkpoint / rollback</strong></td><td>điểm kiểm tra / quay lui</td><td>Trạng thái tiến trình được lưu định kỳ; khi bế tắc, một tiến trình được chạy lại từ một điểm kiểm tra trước đó.</td></tr>
<tr><td><strong>lock ordering</strong></td><td>sắp thứ tự khoá</td><td>Đánh số mọi tài nguyên và luôn xin theo thứ tự tăng dần — phá chờ vòng tròn.</td></tr>
<tr><td><strong>two-phase locking</strong></td><td>khoá hai pha</td><td>Một giao dịch trước hết lấy mọi khoá nó cần, rồi làm việc và nhả chúng.</td></tr>
<tr><td><strong>livelock</strong></td><td>khoá sống</td><td>Các tiến trình vẫn chạy hoặc đổi trạng thái theo nhau nhưng không tiến triển.</td></tr>
<tr><td><strong>starvation / aging</strong></td><td>bỏ đói / lão hoá</td><td>Một tiến trình chờ vô hạn trong khi kẻ khác vẫn tiến; lão hoá nâng độ ưu tiên của ai đã chờ lâu.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 6</h2>
<ol>
<li>Resources are used by <strong>request – use – release</strong>. <strong>Preemptable</strong> ones (memory, CPU) can be taken away harmlessly; deadlocks involve <strong>nonpreemptable</strong> ones (devices, locks, locked rows).</li>
<li>A <strong>deadlock</strong>: each process in a set waits for an event (a release) only another member can cause. It needs all four <strong>Coffman conditions</strong>: mutual exclusion, hold and wait, no preemption, circular wait.</li>
<li><strong>Resource-allocation graph</strong>: circles = processes, squares = resources, resource → process = held, process → resource = blocked waiting. One instance per type: cycle ⇔ deadlock.</li>
<li>Four strategies: <strong>ostrich</strong> (ignore — UNIX, Windows, the JVM for user locks), <strong>detection and recovery</strong> (databases, fcntl locks), <strong>avoidance</strong> (banker's — rarely used), <strong>prevention</strong> (break a condition — lock ordering everywhere).</li>
<li><strong>Detection</strong> with several instances: E, A, C, R; repeatedly finish any process with R<sub>i</sub> ≤ A and add C<sub>i</sub> to A; whoever is left is deadlocked (even if not on a cycle). Recovery: preemption, rollback to a checkpoint, killing (a database aborts one transaction).</li>
<li><strong>Safe</strong> = some order lets everyone finish even if all ask for their maximum; <strong>unsafe ≠ deadlocked</strong>. The <strong>banker</strong> checks a request in three steps — ≤ Need, ≤ A, still safe after a pretend grant — and grants, defers, makes wait, or rejects. Its weakness: maximum needs must be known in advance.</li>
<li>Prevention table: mutual exclusion → spool everything; hold and wait → request all initially; no preemption → take resources away; circular wait → order resources numerically. In code: one global lock order, <code>tryLock</code> with back-off, timeouts.</li>
<li>Also: <strong>communication deadlocks</strong> (cure: timeouts), pipes and thread pools that deadlock without any lock, <strong>livelock</strong> (busy but no progress — cure: random back-off), <strong>starvation</strong> (cure: FCFS or aging).</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 6</h2>
<ol>
<li>Tài nguyên được dùng theo <strong>xin – dùng – trả</strong>. Loại <strong>trưng dụng được</strong> (bộ nhớ, CPU) lấy đi được mà không hại gì; bế tắc liên quan tới loại <strong>không trưng dụng được</strong> (thiết bị, khoá, dòng bị khoá).</li>
<li><strong>Bế tắc</strong>: mỗi tiến trình trong một tập chờ một sự kiện (việc trả) mà chỉ thành viên khác gây ra được. Nó cần đủ bốn <strong>điều kiện Coffman</strong>: loại trừ lẫn nhau, giữ và chờ, không trưng dụng, chờ vòng tròn.</li>
<li><strong>Đồ thị cấp phát tài nguyên</strong>: tròn = tiến trình, vuông = tài nguyên, tài nguyên → tiến trình = đang giữ, tiến trình → tài nguyên = đang bị chặn chờ. Mỗi loại một thể hiện: có chu trình ⇔ có bế tắc.</li>
<li>Bốn chiến lược: <strong>đà điểu</strong> (lờ đi — UNIX, Windows, JVM với khoá người dùng), <strong>phát hiện và khôi phục</strong> (cơ sở dữ liệu, khoá fcntl), <strong>tránh</strong> (nhà băng — hiếm dùng), <strong>ngăn ngừa</strong> (phá một điều kiện — thứ tự khoá ở khắp nơi).</li>
<li><strong>Phát hiện</strong> khi có nhiều thể hiện: E, A, C, R; lặp lại việc cho chạy xong tiến trình bất kỳ có R<sub>i</sub> ≤ A và cộng C<sub>i</sub> vào A; ai còn sót lại là bế tắc (kể cả khi không nằm trên chu trình). Khôi phục: trưng dụng, quay lui về checkpoint, giết (cơ sở dữ liệu huỷ một giao dịch).</li>
<li><strong>An toàn</strong> = có thứ tự cho mọi tiến trình chạy xong kể cả khi tất cả xin mức tối đa; <strong>không an toàn ≠ bế tắc</strong>. <strong>Nhà băng</strong> kiểm một yêu cầu qua ba bước — ≤ Need, ≤ A, vẫn an toàn sau khi giả vờ cấp — rồi cấp, hoãn, bắt chờ, hoặc từ chối. Điểm yếu: phải biết trước nhu cầu tối đa.</li>
<li>Bảng ngăn ngừa: loại trừ lẫn nhau → spool mọi thứ; giữ và chờ → xin hết từ đầu; không trưng dụng → lấy tài nguyên đi; chờ vòng tròn → đánh số tài nguyên. Trong mã: một thứ tự khoá chung, <code>tryLock</code> kèm lùi, hạn chờ.</li>
<li>Thêm: <strong>bế tắc truyền thông</strong> (chữa bằng hạn chờ), pipe và thread pool bế tắc mà không cần khoá nào, <strong>livelock</strong> (bận mà không tiến — chữa bằng lùi ngẫu nhiên), <strong>bỏ đói</strong> (chữa bằng FCFS hoặc lão hoá).</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-ch6) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) Resource types A, B, C have 8, 5, 6 instances. Allocation / Max: P0 (2 1 0) / (5 3 2), P1 (1 0 2) / (3 2 2), P2 (3 1 1) / (4 1 3), P3 (0 2 1) / (2 4 3). Which is a safe sequence?|||(Dạng câu FE) Các loại tài nguyên A, B, C có 8, 5, 6 thể hiện. Allocation / Max: P0 (2 1 0) / (5 3 2), P1 (1 0 2) / (3 2 2), P2 (3 1 1) / (4 1 3), P3 (0 2 1) / (2 4 3). Chuỗi nào là chuỗi an toàn?',
      options: ['P1 → P2 → P3 → P0|||P1 → P2 → P3 → P0', 'P0 → P2 → P3 → P1|||P0 → P2 → P3 → P1', 'P2 → P3 → P0 → P1|||P2 → P3 → P0 → P1', 'P3 → P2 → P0 → P1|||P3 → P2 → P0 → P1'],
      correctIndex: 2,
      points: 1,
      explanation: 'Computed by the simulator: Allocation sums to (6 4 4), so Available = (2 1 2). Need = Max − Allocation: P0 (3 2 2), P1 (2 2 0), P2 (1 0 2), P3 (2 2 2). Only P2 fits first → A = (5 2 3); then P3 (2 2 2) → (5 4 4); P0 (3 2 2) → (7 5 4); P1 → (8 5 6). The other options break at the first step: P1 needs 2 of B (1 free), P0 needs 3 of A (2 free), P3 needs 2 of B. Always check an option step by step — several safe sequences may exist, but a wrong one fails somewhere. Lesson 6.A, slides 24–25.|||Bộ mô phỏng tính: tổng Allocation là (6 4 4), nên Available = (2 1 2). Need = Max − Allocation: P0 (3 2 2), P1 (2 2 0), P2 (1 0 2), P3 (2 2 2). Lúc đầu chỉ P2 vừa → A = (5 2 3); rồi P3 (2 2 2) → (5 4 4); P0 (3 2 2) → (7 5 4); P1 → (8 5 6). Các phương án khác gãy ngay bước đầu: P1 cần 2 B (còn 1), P0 cần 3 A (còn 2), P3 cần 2 B. Luôn kiểm phương án từng bước — có thể có nhiều chuỗi an toàn, nhưng chuỗi sai sẽ gãy ở đâu đó. Bài 6.A, slide 24–25.' },
    { id: 'q2',
      question: '(FE question type) Same four processes and the same Allocation and Max as the previous question, but now Available = (2 1 x). What is the smallest value of x for which the state is safe?|||(Dạng câu FE) Vẫn bốn tiến trình với cùng Allocation và Max như câu trước, nhưng giờ Available = (2 1 x). Giá trị x nhỏ nhất để trạng thái an toàn là bao nhiêu?',
      options: ['1|||1', '2|||2', '3|||3', '0|||0'],
      correctIndex: 1,
      points: 1,
      explanation: 'Computed by the simulator for x = 0, 1, 2, 3: with x = 0 or 1 nobody can start — P2 needs 2 of C, P1 and P3 need 2 of B, P0 needs 3 of A. With x = 2, P2 fits and the sequence P2 → P3 → P0 → P1 follows. So the smallest x is 2. Same method as FE25#14 and FE17#28 (both answer 1 with their own data). Lesson 6.A, slide 25.|||Bộ mô phỏng tính với x = 0, 1, 2, 3: với x = 0 hoặc 1 không ai bắt đầu được — P2 cần 2 C, P1 và P3 cần 2 B, P0 cần 3 A. Với x = 2, P2 vừa và chuỗi P2 → P3 → P0 → P1 theo sau. Vậy x nhỏ nhất là 2. Cùng cách làm với FE25#14 và FE17#28 (cả hai có đáp án 1 với dữ liệu của chúng). Bài 6.A, slide 25.' },
    { id: 'q3',
      question: '(FE question type) Detection with three resource types, Available = (0 0 0). Current allocation C / request R: P0 (0 1 0) / (0 0 0), P1 (2 0 0) / (0 0 2), P2 (3 0 3) / (3 0 1), P3 (2 1 1) / (0 1 0). Which processes are deadlocked?|||(Dạng câu FE) Phát hiện với ba loại tài nguyên, Available = (0 0 0). Cấp phát hiện tại C / yêu cầu R: P0 (0 1 0) / (0 0 0), P1 (2 0 0) / (0 0 2), P2 (3 0 3) / (3 0 1), P3 (2 1 1) / (0 1 0). Những tiến trình nào bế tắc?',
      options: ['P1 P2|||P1 P2', 'P0 P1 P2|||P0 P1 P2', 'P2 P3|||P2 P3', 'none|||không ai'],
      correctIndex: 0,
      points: 1,
      explanation: "Computed by the simulator: P0 requests nothing, so it finishes and returns (0 1 0) → A = (0 1 0); now P3's request (0 1 0) fits, it finishes → A = (2 2 1). P1 still wants 2 of the third type (1 free) and P2 wants 3 of the first type (2 free): neither can ever be satisfied — P1 and P2 are deadlocked. A process that requests nothing is never deadlocked. Lesson 6.A, slides 17–18.|||Bộ mô phỏng tính: P0 không xin gì, nên nó chạy xong và trả (0 1 0) → A = (0 1 0); giờ yêu cầu (0 1 0) của P3 vừa, nó chạy xong → A = (2 2 1). P1 vẫn muốn 2 thể hiện loại thứ ba (còn 1) và P2 muốn 3 thể hiện loại thứ nhất (còn 2): không ai được đáp ứng nữa — P1 và P2 bế tắc. Tiến trình không xin gì thì không bao giờ bế tắc. Bài 6.A, slide 17–18." },
    { id: 'q4',
      question: '(FE question type) Events: 1. P1 requests and gets R1. 2. P2 requests and gets R2. 3. P3 requests and gets R3. 4. P1 requests R2. 5. P2 requests R3. 6. P3 requests R1. Every resource has one instance. Which statement is true?|||(Dạng câu FE) Các sự kiện: 1. P1 xin và được R1. 2. P2 xin và được R2. 3. P3 xin và được R3. 4. P1 xin R2. 5. P2 xin R3. 6. P3 xin R1. Mỗi tài nguyên có một thể hiện. Câu nào đúng?',
      options: ['Event 4 caused the deadlock.|||Sự kiện 4 gây ra bế tắc.', 'Event 5 caused the deadlock.|||Sự kiện 5 gây ra bế tắc.', 'There is no deadlock.|||Không có bế tắc.', 'Event 6 caused the deadlock.|||Sự kiện 6 gây ra bế tắc.'],
      correctIndex: 3,
      points: 1,
      explanation: 'The simulator runs the cycle detector after every event: events 4 and 5 only block P1 and P2 (each waits for a resource whose owner can still run); event 6 adds P3 → R1, closing P1 → R2 → P2 → R3 → P3 → R1 → P1 — the first moment a cycle exists. This is FE28#14 of the question bank. Lesson 6.A, slide 9.|||Bộ mô phỏng chạy bộ dò chu trình sau mỗi sự kiện: sự kiện 4 và 5 chỉ chặn P1 và P2 (mỗi tiến trình chờ một tài nguyên mà chủ của nó vẫn chạy được); sự kiện 6 thêm P3 → R1, khép vòng P1 → R2 → P2 → R3 → P3 → R1 → P1 — thời điểm đầu tiên có chu trình. Đây là FE28#14 của ngân hàng câu hỏi. Bài 6.A, slide 9.' },
    { id: 'q5',
      question: '(FE question type) Which of the following is a preemptable resource?|||(Dạng câu FE) Tài nguyên nào sau đây là tài nguyên trưng dụng được (preemptable)?',
      options: ['Main memory, because pages can be written to disk and brought back without the process noticing|||Bộ nhớ chính, vì các trang có thể ghi ra đĩa rồi nạp lại mà tiến trình không hề hay biết', 'A Blu-ray recorder in the middle of burning a disc|||Một đầu ghi Blu-ray đang ghi dở một đĩa', 'A printer that has printed half of a job|||Một máy in đã in được nửa job', 'A database row locked by an unfinished transaction|||Một dòng cơ sở dữ liệu bị khoá bởi một giao dịch chưa xong'],
      correctIndex: 0,
      points: 1,
      explanation: "A preemptable resource can be taken away from its owner with no ill effects; memory is the book's example (swap it out, give the frames to someone else, bring it back later). Taking the recorder or the printer away ruins the output, and a locked row can only be \"taken back\" by aborting the whole transaction — all three are nonpreemptable, and deadlocks involve exactly that kind (FE6#44, FE20#14, FE5#46). Lesson 6.A, slide 2.|||Tài nguyên trưng dụng được là tài nguyên lấy khỏi chủ của nó mà không gây hậu quả xấu; bộ nhớ là ví dụ của sách (đẩy ra đĩa, đưa khung trang cho người khác, nạp lại sau). Lấy đầu ghi hay máy in đi thì hỏng output, còn một dòng bị khoá chỉ \"lấy lại\" được bằng cách huỷ cả giao dịch — cả ba đều không trưng dụng được, và bế tắc liên quan đúng tới loại đó (FE6#44, FE20#14, FE5#46). Bài 6.A, slide 2." },
    { id: 'q6',
      question: '(FE question type) Which of the following is NOT one of the conditions necessary for a resource deadlock?|||(Dạng câu FE) Điều nào sau đây KHÔNG phải một trong các điều kiện cần cho bế tắc tài nguyên?',
      options: ['Mutual exclusion|||Loại trừ lẫn nhau (mutual exclusion)', 'Hold and wait|||Giữ và chờ (hold and wait)', 'Circular wait|||Chờ vòng tròn (circular wait)', 'Preemption|||Trưng dụng (preemption)'],
      correctIndex: 3,
      points: 1,
      explanation: 'The four Coffman conditions are mutual exclusion, hold and wait, NO preemption and circular wait. "Preemption" is the opposite of the third condition — if resources could be taken away, the OS could always break a deadlock (FE19#23, FE24#3, FE29#37). Lesson 6.A, slide 6.|||Bốn điều kiện Coffman là loại trừ lẫn nhau, giữ và chờ, KHÔNG trưng dụng và chờ vòng tròn. "Trưng dụng" là điều ngược với điều kiện thứ ba — nếu tài nguyên lấy đi được thì HĐH luôn phá được bế tắc (FE19#23, FE24#3, FE29#37). Bài 6.A, slide 6.' },
    { id: 'q7',
      question: 'What does this C program print (Linux, glibc)?|||Chương trình C này in ra gì (Linux, glibc)?',
      code: `pthread_mutexattr_t at;
pthread_mutex_t m;
pthread_mutexattr_init(&at);
pthread_mutexattr_settype(&at, PTHREAD_MUTEX_ERRORCHECK);
pthread_mutex_init(&m, &at);
pthread_mutex_lock(&m);
int r = pthread_mutex_lock(&m);          /* the same thread, again */
puts(r == 0 ? "0" : r == EDEADLK ? "EDEADLK" : r == EBUSY ? "EBUSY" : "other");`,
      codeLang: 'c',
      options: ['0|||0', 'EDEADLK|||EDEADLK', 'EBUSY|||EBUSY', 'Nothing — the program hangs for ever|||Không in gì — chương trình treo mãi'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program: EDEADLK. An ERRORCHECK mutex remembers its owner; when the owner locks it again, pthread_mutex_lock refuses with EDEADLK instead of waiting for itself. A default (NORMAL) mutex would hang — a one-thread deadlock — and a RECURSIVE one would return 0 and count 2. EBUSY is what trylock returns for a mutex held by someone else. Lesson 6.A, slide 5.|||Output của chương trình thật: EDEADLK. Mutex ERRORCHECK nhớ chủ của nó; khi chính chủ khoá lại lần nữa, pthread_mutex_lock từ chối bằng EDEADLK thay vì tự chờ chính mình. Mutex mặc định (NORMAL) sẽ treo — bế tắc chỉ với một luồng — còn mutex RECURSIVE trả 0 và đếm lên 2. EBUSY là thứ trylock trả về khi mutex đang bị người khác giữ. Bài 6.A, slide 5.' },
    { id: 'q8',
      question: '(FE question type) All resources are numbered, and every process must request resources in strictly increasing numerical order. Which deadlock condition does this attack?|||(Dạng câu FE) Mọi tài nguyên được đánh số, và mọi tiến trình phải xin tài nguyên theo thứ tự số tăng ngặt. Cách này tấn công điều kiện bế tắc nào?',
      options: ['Mutual exclusion|||Loại trừ lẫn nhau', 'Hold and wait|||Giữ và chờ', 'Circular wait|||Chờ vòng tròn', 'No preemption|||Không trưng dụng'],
      correctIndex: 2,
      points: 1,
      explanation: 'In a cycle every process would wait for a higher number than the one it holds, so going round the cycle the numbers would keep increasing back to the start — impossible. Figure 6-14: mutual exclusion → spool everything, hold and wait → request all initially, no preemption → take resources away, circular wait → order resources numerically (FE17#24, FE1#29). In backend code: lock rows or accounts in id order. Lesson 6.A, slides 27–28.|||Trong một chu trình, tiến trình nào cũng chờ một số lớn hơn số nó đang giữ, nên đi hết vòng các số cứ tăng mãi rồi lại quay về điểm đầu — vô lý. Hình 6-14: loại trừ lẫn nhau → spool mọi thứ, giữ và chờ → xin hết từ đầu, không trưng dụng → lấy tài nguyên đi, chờ vòng tròn → đánh số tài nguyên (FE17#24, FE1#29). Trong mã backend: khoá dòng hay tài khoản theo thứ tự id. Bài 6.A, slide 27–28.' },
    { id: 'q9',
      question: "(FE question type) The banker's algorithm finds that a state is unsafe. Which statement is correct?|||(Dạng câu FE) Thuật toán nhà băng thấy một trạng thái là không an toàn. Câu nào đúng?",
      options: ['The processes involved are already deadlocked|||Các tiến trình liên quan đã bế tắc rồi', 'A deadlock will certainly occur, whatever the processes do|||Bế tắc chắc chắn sẽ xảy ra, dù các tiến trình làm gì', 'The OS must kill one process immediately|||HĐH phải giết ngay một tiến trình', 'A deadlock is possible: the OS can no longer guarantee that every process finishes|||Bế tắc là có thể xảy ra: HĐH không còn bảo đảm được mọi tiến trình đều chạy xong'],
      correctIndex: 3,
      points: 1,
      explanation: 'An unsafe state is not a deadlocked state. It only means there is no order that lets every process finish if all of them ask for their declared maximum; they may release resources first and everything may end well. "A possibility of deadlock can occur if the system is in an unsafe state" (FE20#43). Avoidance therefore refuses requests that would lead into an unsafe state rather than killing anybody. Lesson 6.A, slides 22 and 25.|||Trạng thái không an toàn không phải trạng thái bế tắc. Nó chỉ có nghĩa là không có thứ tự nào cho mọi tiến trình chạy xong nếu tất cả cùng xin mức tối đa đã khai; chúng có thể trả bớt tài nguyên trước và mọi chuyện có thể kết thúc êm đẹp. "Khả năng bế tắc có thể xảy ra nếu hệ thống ở trạng thái không an toàn" (FE20#43). Vì vậy cách tránh từ chối những yêu cầu dẫn vào trạng thái không an toàn chứ không giết ai cả. Bài 6.A, slide 22 và 25.' },
    { id: 'q10',
      question: 'Two PostgreSQL transactions update the same two rows in opposite orders and end up waiting for each other. What does PostgreSQL do?|||Hai giao dịch PostgreSQL cập nhật cùng hai dòng theo thứ tự ngược nhau và rốt cuộc chờ lẫn nhau. PostgreSQL làm gì?',
      options: ['Nothing — both transactions wait until a database administrator kills one|||Không làm gì — cả hai giao dịch chờ tới khi quản trị viên giết một cái', 'After about deadlock_timeout (1 s by default) it detects the cycle and aborts one transaction with "deadlock detected", letting the other finish|||Sau khoảng deadlock_timeout (mặc định 1 giây) nó phát hiện chu trình và huỷ một giao dịch với lỗi "deadlock detected", để giao dịch kia chạy xong', "It refuses the second UPDATE in advance using the banker's algorithm|||Nó từ chối câu UPDATE thứ hai từ trước bằng thuật toán nhà băng", "It reorders the two transactions' statements so that both succeed|||Nó sắp xếp lại các câu lệnh của hai giao dịch để cả hai đều thành công"],
      correctIndex: 1,
      points: 1,
      explanation: 'Databases use detection and recovery: a transaction that has waited for a lock longer than deadlock_timeout runs the deadlock check over the wait-for graph; if it finds a cycle, one transaction is aborted (rolled back, its locks released) with SQLSTATE 40P01 "deadlock detected", and the other continues. The application should retry the aborted transaction — and prevent most deadlocks by locking rows in a consistent order (PostgreSQL manual §13.3.4). Lesson 6.A, slides 17 and 19.|||Cơ sở dữ liệu dùng phát hiện và khôi phục: giao dịch nào chờ khoá lâu hơn deadlock_timeout thì chạy phép kiểm bế tắc trên đồ thị chờ; thấy chu trình thì một giao dịch bị huỷ (quay lui, nhả khoá) với SQLSTATE 40P01 "deadlock detected", giao dịch kia đi tiếp. Ứng dụng nên thử lại giao dịch bị huỷ — và ngăn phần lớn bế tắc bằng cách khoá dòng theo một thứ tự thống nhất (tài liệu PostgreSQL §13.3.4). Bài 6.A, slide 17 và 19.' },
  ],
};

export default {
  slides: [L_osg6_1],
  practice: L_on_ch6,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 6 viết lại theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ, câu tính toán và câu "in ra gì" có đáp án kiểm bằng bộ mô phỏng hoặc chương trình chạy thật: chuỗi an toàn của thuật toán nhà băng, giá trị x nhỏ nhất để an toàn, thuật toán phát hiện bằng ma trận, sự kiện đóng chu trình, tài nguyên trưng dụng được, điều kiện không cần cho bế tắc, mutex ERRORCHECK khoá hai lần, đánh số tài nguyên, trạng thái không an toàn và cách PostgreSQL xử lý bế tắc.',
};
