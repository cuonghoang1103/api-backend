/**
 * OSG202 · Chương 2 — Processes & Threads (osg2: 2.A 1–27, 2.B 28–55, 2.C 56–74).
 * Bài 📑 học theo từng slide: osg2 (tmp_02.pptx, slide 1–74).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: osg202-on-ch2.
 * Quiz viết lại (10 câu, giữ slug osg202-quiz-ch2).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs từ gen/src/**, gen/code/**, gen/sim/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node OSG202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 2.A — 📑 Slide by slide · Processes and Threads: process model, states, threads, Pthreads (slides 1–27) ───────── */
const L_osg2_1 = {
  title: '2.A — 📑 Slide by slide · Processes and Threads: process model, states, threads, Pthreads (slides 1–27)|||2.A — 📑 Học theo từng slide · Processes and Threads: mô hình tiến trình, trạng thái, luồng, Pthreads (slide 1–27)',
  slug: 'osg202-slide-osg2-1',
  type: 'VIDEO',
  description: 'Giảng đủ 27 slide đầu Chương 2 (Tanenbaum, Modern Operating Systems 4e): mô hình tiến trình và một bộ đếm chương trình nhảy giữa bốn chương trình (đo thật trên một lõi), bốn cách tạo và bốn cách kết thúc tiến trình, ba trạng thái và các chữ R/S/T/Z của ps, bảng tiến trình là /proc/<PID>, tám bước khi có ngắt và giá một lần chuyển tiến trình đo bằng micro-giây, mô hình hiệu suất CPU 1 − pⁿ với ví dụ RAM của sách, luồng trong trình soạn thảo và máy chủ web (luồng điều phối – luồng thợ bằng C, luồng ảo Java 21, vòng lặp sự kiện Node), cái gì luồng dùng chung và giữ riêng, Pthreads (kèm lỗi của Hình 2-15 và pthread_yield đã lỗi thời), luồng mức người dùng – mức nhân – lai, luồng bật lên, errno và biến toàn cục riêng của từng luồng.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.A · deck "Chapter 2 · Processes and Threads", slides 1–27</span>
<h2>Processes and threads: the units of work an OS juggles</h2>
<p class="lead">Chapter 2 is the heart of the course and of every backend job interview about operating systems. This first part follows sections 2.1–2.2 of the book: what a <strong>process</strong> is, how it is born, lives in three states and dies, what the kernel stores about it, why running many processes keeps the CPU busy — and then the <strong>thread</strong>, a lighter unit of execution that lives inside a process. Almost every slide is one figure of the book; each figure is explained in full, and every idea you can watch on Linux is shown with a C, Java or Node program that was really run in the course container.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>2.1.1 The process model</td><td>explain how one CPU gives the illusion of many programs running at once</td></tr>
<tr><td>5–6</td><td>2.1.2–2.1.4 Creation, termination</td><td>list the four ways a process starts and the four ways it ends</td></tr>
<tr><td>7–9</td><td>2.1.5 Process states</td><td>draw the three states and the four legal transitions, read the STAT column of ps</td></tr>
<tr><td>10–11</td><td>2.1.6 Implementation of processes</td><td>say what is in a process table entry and what happens on an interrupt</td></tr>
<tr><td>12</td><td>2.1.7 Modeling multiprogramming</td><td>compute CPU utilization with 1 − pⁿ</td></tr>
<tr><td>13–16</td><td>2.2.1 Thread usage</td><td>explain why word processors and web servers use threads; compare three server designs</td></tr>
<tr><td>17–19</td><td>2.2.2 The classical thread model</td><td>separate what threads share from what each thread owns</td></tr>
<tr><td>20–22</td><td>2.2.3 POSIX threads</td><td>create and join threads with Pthreads, and spot the bugs in the book's example</td></tr>
<tr><td>23–25</td><td>2.2.4–2.2.8 Implementing threads</td><td>compare user-level, kernel-level and hybrid threads; pop-up threads</td></tr>
<tr><td>26–27</td><td>2.2.9 Making single-threaded code multithreaded</td><td>explain the errno problem and per-thread global variables</td></tr>
</tbody>
</table>
<div class="callout">The older web lessons 2.1–2.3 further down stay as short summaries (2.3 has the PCB table, fork/exec, zombies and copy-on-write); this lesson refers to them instead of repeating them, and goes deeper slide by slide.</div>`,
    `<span class="eyebrow">Chương 2 · Bài 2.A · deck "Chapter 2 · Processes and Threads", slide 1–27</span>
<h2>Tiến trình và luồng: những đơn vị công việc mà HĐH tung hứng</h2>
<p class="lead">Chương 2 là trái tim của môn học và của mọi buổi phỏng vấn backend có hỏi về hệ điều hành. Phần đầu này đi theo mục 2.1–2.2 của sách: <strong>tiến trình (process)</strong> là gì, nó sinh ra thế nào, sống qua ba trạng thái và chết ra sao, nhân lưu những gì về nó, vì sao chạy nhiều tiến trình giữ cho CPU luôn bận — rồi tới <strong>luồng (thread)</strong>, một đơn vị thực thi nhẹ hơn sống bên trong tiến trình. Gần như slide nào cũng là một hình của sách; hình nào cũng được giảng trọn, và ý nào xem được trên Linux đều có chương trình C, Java hoặc Node đã chạy thật trong container của môn.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>2.1.1 Mô hình tiến trình</td><td>giải thích một CPU tạo ảo giác nhiều chương trình cùng chạy như thế nào</td></tr>
<tr><td>5–6</td><td>2.1.2–2.1.4 Tạo, kết thúc</td><td>kể bốn cách một tiến trình bắt đầu và bốn cách nó kết thúc</td></tr>
<tr><td>7–9</td><td>2.1.5 Trạng thái tiến trình</td><td>vẽ ba trạng thái và bốn chuyển đổi hợp lệ, đọc cột STAT của ps</td></tr>
<tr><td>10–11</td><td>2.1.6 Cài đặt tiến trình</td><td>nói được một mục bảng tiến trình chứa gì và chuyện gì xảy ra khi có ngắt</td></tr>
<tr><td>12</td><td>2.1.7 Mô hình hoá đa chương trình</td><td>tính hiệu suất CPU bằng 1 − pⁿ</td></tr>
<tr><td>13–16</td><td>2.2.1 Công dụng của luồng</td><td>giải thích vì sao trình soạn thảo và máy chủ web dùng luồng; so ba kiểu dựng máy chủ</td></tr>
<tr><td>17–19</td><td>2.2.2 Mô hình luồng cổ điển</td><td>tách cái luồng dùng chung khỏi cái mỗi luồng giữ riêng</td></tr>
<tr><td>20–22</td><td>2.2.3 Luồng POSIX</td><td>tạo và đợi luồng bằng Pthreads, và chỉ ra lỗi trong ví dụ của sách</td></tr>
<tr><td>23–25</td><td>2.2.4–2.2.8 Cài đặt luồng</td><td>so luồng mức người dùng, mức nhân và lai; luồng bật lên</td></tr>
<tr><td>26–27</td><td>2.2.9 Biến mã đơn luồng thành đa luồng</td><td>giải thích vấn đề errno và biến toàn cục riêng của từng luồng</td></tr>
</tbody>
</table>
<div class="callout">Các bài web cũ 2.1–2.3 phía dưới vẫn giữ làm bản tóm tắt ngắn (bài 2.3 có bảng PCB, fork/exec, zombie và copy-on-write); bài này dẫn sang chúng thay vì lặp lại, và đi sâu hơn từng slide một.</div>`),
    walkHead('osg2', 1, 27),
    walk('osg2', [
      [1, 'Processes and Threads',
        `<p class="y-chinh">🎯 Chapter 2 of <em>Modern Operating Systems</em> (4th ed.) — "Processes and Threads", the longest and most examined chapter: syllabus sessions on processes, threads, interprocess communication and scheduling, outcome CLO2.</p>
<p>The <strong>process</strong> is the most central idea of any operating system: an abstraction of a running program. Everything else in the course hangs on it — memory (Chapter 3) is given to processes, files (Chapter 4) are opened by processes, deadlocks (Chapter 6) happen between processes. The deck has four parts, and this course splits it into three lessons: 2.A processes and threads (slides 1–27), 2.B synchronization (28–55), 2.C scheduling and the classical problems (56–74).</p>
<p>What to expect on the FE: definitions (states, what threads share), "which transition is illegal", race conditions and semaphores, and above all <strong>scheduling calculations</strong> — Gantt charts with FCFS, SJF, SRTF, Round Robin and Priority appear in almost every one of the 29 real exams in the Exam Room.</p>
<p class="meo">🧠 Chapter 2 in one sentence: <em>the OS turns one CPU into many virtual CPUs (processes and threads), and then must stop them from corrupting each other's data and decide who runs next.</em></p>`,
        `<p class="y-chinh">🎯 Chương 2 của <em>Modern Operating Systems</em> (bản 4) — "Processes and Threads" (tiến trình và luồng), chương dài nhất và bị thi nhiều nhất: các buổi về tiến trình, luồng, giao tiếp liên tiến trình và lập lịch trong đề cương, chuẩn đầu ra CLO2.</p>
<p><strong>Tiến trình (process)</strong> là ý tưởng trung tâm của mọi hệ điều hành: một sự trừu tượng hoá của chương trình đang chạy. Mọi thứ khác của môn đều treo trên nó — bộ nhớ (Chương 3) được cấp cho tiến trình, tệp (Chương 4) do tiến trình mở, bế tắc (Chương 6) xảy ra giữa các tiến trình. Bộ slide có bốn phần, và môn học chia thành ba bài: 2.A tiến trình và luồng (slide 1–27), 2.B đồng bộ (28–55), 2.C lập lịch và các bài toán kinh điển (56–74).</p>
<p>FE sẽ hỏi gì: định nghĩa (trạng thái, luồng dùng chung cái gì), "chuyển trạng thái nào không hợp lệ", tình trạng tranh chấp và semaphore, và trên hết là <strong>bài tính lập lịch</strong> — biểu đồ Gantt với FCFS, SJF, SRTF, Round Robin và Priority xuất hiện ở gần như cả 29 đề thật trong Phòng thi.</p>
<p class="meo">🧠 Chương 2 trong một câu: <em>HĐH biến một CPU thành nhiều CPU ảo (tiến trình và luồng), rồi phải ngăn chúng làm hỏng dữ liệu của nhau và quyết định ai được chạy tiếp.</em></p>`],
      [2, 'The Process Model (1)',
        `<p class="y-chinh">🎯 Figure 2-1(a): <strong>multiprogramming</strong> of four programs A, B, C, D in memory. There is only <strong>one physical program counter</strong>: the CPU runs a bit of A, then switches ("process switch") to B, then C, then D, and around again.</p>
<p>A <strong>process</strong> is an instance of an executing program, including the current values of its program counter, registers and variables. Conceptually each process has its own virtual CPU; in reality the real CPU switches back and forth from process to process. This rapid switching is called <strong>multiprogramming</strong>. The program counter is the register that holds the address of the next instruction — when the OS switches, it saves A's program counter (and all other registers) and loads B's.</p>
<p>➕ See Figure 2-1 for real. The program below starts four processes A–D that only compute, and pins all of them to <strong>one</strong> CPU core with <code>taskset -c 0</code>. Each process watches the clock; whenever the clock jumps by more than 1 ms between two of its own instructions, someone else had the CPU. It counts its "turns":</p>
<pre><code class="language-c">// Figure 2-1 for real: four processes, ONE CPU core, one program counter that jumps between them
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static double now_ms(void) {
    struct timespec t;
    clock_gettime(CLOCK_MONOTONIC, &amp;t);
    return t.tv_sec * 1e3 + t.tv_nsec / 1e6;
}

static void busy(char name) {                  // a CPU-bound "program" A, B, C or D
    double start = now_ms(), last = start, waited = 0;
    int turns = 1;
    while (now_ms() - start &lt; 600) {           // run for 0.6 s of wall-clock time
        double t = now_ms();
        if (t - last &gt; 1.0) {                  // a jump &gt; 1 ms: someone else had the CPU
            turns++;
            waited += t - last;
        }
        last = t;
    }
    printf("%c: ran in %3d turns, waited %3.0f of 600 ms\\n", name, turns, waited);
    exit(0);
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    for (char p = 'A'; p &lt;= 'D'; p++)
        if (fork() == 0) busy(p);              // child = one more sequential process
    while (wait(NULL) &gt; 0) ;                   // parent waits for all four
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bon-tien-trinh.c -o bon-tien-trinh &amp;&amp; taskset -c 0 ./bon-tien-trinh<br>
C: ran in &nbsp;43 turns, waited 531 of 600 ms<br>
B: ran in &nbsp;37 turns, waited 545 of 600 ms<br>
A: ran in &nbsp;46 turns, waited 493 of 600 ms<br>
D: ran in &nbsp;48 turns, waited 504 of 600 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Each process got the core dozens of times in 0.6 seconds and spent most of that time waiting: the single program counter really did jump between A, B, C and D many times — exactly the picture on the slide, with the switches at about every few milliseconds. (This run shared the machine with other containers, so the processes waited even longer than a quarter each.)</p>
<p class="meo">🧠 Program = a recipe written in a book (a file on disk). Process = a cook actually cooking that recipe right now, with a current step, ingredients on the table and a state. Two cooks can follow the same recipe: two processes of one program.</p>`,
        `<p class="y-chinh">🎯 Hình 2-1(a): <strong>đa chương trình (multiprogramming)</strong> với bốn chương trình A, B, C, D trong bộ nhớ. Chỉ có <strong>một bộ đếm chương trình vật lý</strong>: CPU chạy một chút A, rồi chuyển ("process switch") sang B, rồi C, rồi D, rồi lại vòng lại.</p>
<p><strong>Tiến trình</strong> là một thể hiện của chương trình đang thực thi, gồm cả giá trị hiện thời của bộ đếm chương trình, các thanh ghi và các biến. Về mặt khái niệm mỗi tiến trình có một CPU ảo riêng; thực tế CPU thật chuyển qua lại giữa các tiến trình. Việc chuyển nhanh này gọi là <strong>đa chương trình</strong>. Bộ đếm chương trình (program counter, PC) là thanh ghi giữ địa chỉ của lệnh kế tiếp — khi HĐH chuyển, nó lưu PC của A (cùng mọi thanh ghi khác) rồi nạp PC của B.</p>
<p>➕ Xem Hình 2-1 làm thật. Chương trình dưới đây khởi động bốn tiến trình A–D chỉ tính toán, và ghim cả bốn vào <strong>một</strong> lõi CPU bằng <code>taskset -c 0</code>. Mỗi tiến trình theo dõi đồng hồ; hễ đồng hồ nhảy quá 1 ms giữa hai lệnh của chính nó là CPU vừa ở chỗ người khác. Nó đếm số "lượt" của mình:</p>
<pre><code class="language-c">// Hình 2-1 làm thật: bốn tiến trình, MỘT lõi CPU, một bộ đếm chương trình nhảy qua lại giữa chúng
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static double now_ms(void) {
    struct timespec t;
    clock_gettime(CLOCK_MONOTONIC, &amp;t);
    return t.tv_sec * 1e3 + t.tv_nsec / 1e6;
}

static void busy(char name) {                  // một "chương trình" chỉ tính toán: A, B, C hoặc D
    double start = now_ms(), last = start, waited = 0;
    int turns = 1;
    while (now_ms() - start &lt; 600) {           // chạy trong 0,6 giây đồng hồ
        double t = now_ms();
        if (t - last &gt; 1.0) {                  // nhảy &gt; 1 ms: CPU vừa ở chỗ người khác
            turns++;
            waited += t - last;
        }
        last = t;
    }
    printf("%c: ran in %3d turns, waited %3.0f of 600 ms\\n", name, turns, waited);
    exit(0);
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    for (char p = 'A'; p &lt;= 'D'; p++)
        if (fork() == 0) busy(p);              // con = thêm một tiến trình tuần tự
    while (wait(NULL) &gt; 0) ;                   // cha đợi cả bốn
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bon-tien-trinh.c -o bon-tien-trinh &amp;&amp; taskset -c 0 ./bon-tien-trinh<br>
C: ran in &nbsp;43 turns, waited 531 of 600 ms<br>
B: ran in &nbsp;37 turns, waited 545 of 600 ms<br>
A: ran in &nbsp;46 turns, waited 493 of 600 ms<br>
D: ran in &nbsp;48 turns, waited 504 of 600 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Mỗi tiến trình được lõi CPU vài chục lần trong 0,6 giây và phần lớn thời gian là ngồi chờ: bộ đếm chương trình duy nhất thật sự nhảy qua lại giữa A, B, C, D rất nhiều lần — đúng bức hình trên slide, cứ vài mili-giây một lần chuyển. (Lần chạy này dùng chung máy với các container khác, nên các tiến trình còn chờ lâu hơn mức một phần tư.)</p>
<p class="meo">🧠 Chương trình = công thức nấu ăn in trong sách (một tệp trên đĩa). Tiến trình = một đầu bếp đang nấu đúng công thức đó ngay lúc này, có bước đang làm, nguyên liệu trên bàn và một trạng thái. Hai đầu bếp cùng theo một công thức: hai tiến trình của cùng một chương trình.</p>`],
      [3, 'The Process Model (2)',
        `<p class="y-chinh">🎯 Figure 2-1(b): the <strong>conceptual model</strong> — four independent, <strong>sequential</strong> processes, each with its own program counter. This is how programmers and the rest of the OS think about it: every process runs its code from top to bottom as if it owned a CPU.</p>
<p>The model is a lie that is extremely useful. Each of the four boxes has its own <em>logical</em> program counter; when a process is switched out, its logical PC is copied into memory, and when it runs again the value is loaded back into the one physical PC. The process never notices — except in one way: <strong>time</strong>. A process cannot assume how fast it runs or when it will be interrupted. The book's example: a process that reads a tape and wants to wait exactly 10 000 loop iterations for the tape to reach speed will fail, because another process may run in between. That is why anything time-critical must ask the OS for help (Chapter 2's scheduling, real-time policies).</p>
<p>➕ The model also explains the difference between a <strong>program</strong> and a <strong>process</strong>: the same program (a file) can be running as several processes at once, each with its own counter and data. The book's analogy: a computer scientist baking a cake from a recipe is the process; the recipe is the program; when his son runs in with a bee sting he stops (process switch), follows a first-aid book (a higher-priority process), and then returns to the cake at the step where he left off.</p>
<p class="pitfall">⚠️ "Each process has its own program counter" (conceptual view) vs "there is only one physical program counter" (per CPU). FE options often mix the two; read whether the question asks about the model or the hardware.</p>`,
        `<p class="y-chinh">🎯 Hình 2-1(b): <strong>mô hình khái niệm</strong> — bốn tiến trình độc lập, <strong>tuần tự (sequential)</strong>, mỗi tiến trình có bộ đếm chương trình riêng. Đây là cách lập trình viên và phần còn lại của HĐH nghĩ về nó: tiến trình nào cũng chạy mã của mình từ trên xuống dưới như thể sở hữu riêng một CPU.</p>
<p>Mô hình này là một "lời nói dối" cực kỳ hữu ích. Mỗi ô trong bốn ô có bộ đếm chương trình <em>logic</em> riêng; khi tiến trình bị chuyển ra, PC logic của nó được chép vào bộ nhớ, và khi nó chạy lại, giá trị đó được nạp trở lại vào PC vật lý duy nhất. Tiến trình không hề nhận ra — trừ một điều: <strong>thời gian</strong>. Tiến trình không được giả định mình chạy nhanh cỡ nào hay khi nào bị ngắt. Ví dụ của sách: một tiến trình đọc băng từ muốn chờ đúng 10 000 vòng lặp cho băng quay đủ tốc độ sẽ thất bại, vì một tiến trình khác có thể chen vào giữa. Vì thế việc gì nhạy cảm về thời gian phải nhờ HĐH (lập lịch của Chương 2, chính sách thời gian thực).</p>
<p>➕ Mô hình cũng giải thích khác biệt giữa <strong>chương trình</strong> và <strong>tiến trình</strong>: cùng một chương trình (một tệp) có thể đang chạy thành nhiều tiến trình cùng lúc, mỗi cái có bộ đếm và dữ liệu riêng. Phép so sánh của sách: nhà khoa học máy tính đang nướng bánh theo công thức là tiến trình; công thức là chương trình; khi con trai chạy vào vì bị ong đốt, ông dừng tay (chuyển tiến trình), làm theo sách sơ cứu (một tiến trình ưu tiên cao hơn), rồi quay lại cái bánh đúng ở bước đã bỏ dở.</p>
<p class="pitfall">⚠️ "Mỗi tiến trình có bộ đếm chương trình riêng" (góc nhìn khái niệm) khác với "chỉ có một bộ đếm chương trình vật lý" (mỗi CPU). Phương án FE hay trộn hai ý này; đọc kỹ câu hỏi hỏi về mô hình hay về phần cứng.</p>`],
      [4, 'The Process Model (3)',
        `<p class="y-chinh">🎯 Figure 2-1(c): plotted over time, <strong>only one program is active at any instant</strong> on one CPU — A runs, then B, then C, then D, then A again. Over a long enough interval every process has made progress.</p>
<p>The horizontal bars are the same thing our program above measured: short stretches of real execution separated by long waits. This is <strong>pseudoparallelism</strong> — it looks parallel to a human because the switches happen many times per second, but at each instant there is one runner. True parallelism needs several CPUs (cores); on a 10-core machine, ten processes can really run at the same moment, and the OS does the same juggling on each core.</p>
<p>➕ Two consequences used all through the chapter. First, the order and the moment of switches are decided by the <strong>scheduler</strong> (slides 56–66), not by the program — so two runs of the same program can interleave differently. Second, because a switch can happen between <em>any</em> two instructions, processes that share data can corrupt it (race conditions, slide 28). Lesson 1.A (slide 5) showed the same core-sharing with three <code>yes</code> programs and <code>ps</code>.</p>
<p class="meo">🧠 One CPU = one runner on the track at a time, relay style. Multicore = several tracks. The OS is the coach who decides who runs next and for how long.</p>`,
        `<p class="y-chinh">🎯 Hình 2-1(c): vẽ theo thời gian, <strong>tại mỗi thời điểm chỉ một chương trình đang hoạt động</strong> trên một CPU — A chạy, rồi B, rồi C, rồi D, rồi lại A. Qua một khoảng đủ dài thì tiến trình nào cũng đã tiến lên được.</p>
<p>Các vạch ngang chính là thứ chương trình ở trên đã đo: những đoạn chạy thật ngắn ngủi xen giữa những lần chờ dài. Đây là <strong>giả song song (pseudoparallelism)</strong> — với con người trông như song song vì việc chuyển xảy ra nhiều lần mỗi giây, nhưng tại mỗi khoảnh khắc chỉ có một người chạy. Song song thật cần nhiều CPU (nhiều lõi); trên máy 10 lõi, mười tiến trình có thể chạy đúng cùng một lúc, và HĐH vẫn tung hứng y như vậy trên từng lõi.</p>
<p>➕ Hai hệ quả dùng suốt chương. Một: thứ tự và thời điểm chuyển do <strong>bộ lập lịch (scheduler)</strong> quyết định (slide 56–66), không do chương trình — nên hai lần chạy cùng một chương trình có thể xen kẽ khác nhau. Hai: vì việc chuyển có thể xảy ra giữa <em>bất kỳ</em> hai lệnh nào, các tiến trình dùng chung dữ liệu có thể làm hỏng nó (tranh chấp, slide 28). Bài 1.A (slide 5) đã cho thấy cùng cảnh chia lõi đó với ba chương trình <code>yes</code> và <code>ps</code>.</p>
<p class="meo">🧠 Một CPU = mỗi lúc chỉ một vận động viên trên đường chạy, kiểu chạy tiếp sức. Nhiều lõi = nhiều đường chạy. HĐH là huấn luyện viên quyết định ai chạy tiếp và chạy bao lâu.</p>`],
      [5, 'Process Creation',
        `<p class="y-chinh">🎯 Four principal events create processes: (1) <strong>system initialization</strong>, (2) a running process executes a <strong>process-creation system call</strong>, (3) a <strong>user request</strong> to create a new process, (4) <strong>initiation of a batch job</strong>.</p>
<p>(1) When the OS boots, it starts some processes: foreground ones that interact with users and background ones called <strong>daemons</strong> (web server, e-mail, print spooler). (2) A running process can create helpers — a download program starts several processes to fetch parts in parallel. (3) Typing a command or double-clicking an icon makes the shell or GUI create a process. (4) On mainframes, when the OS has resources it takes the next batch job from the queue. Technically all four are the same thing: <strong>some existing process</strong> executes a creation system call. In UNIX that is <code>fork</code> (an exact clone of the caller), usually followed by <code>execve</code> to load a new program; in Windows <code>CreateProcess</code> does both in one call (lesson 1.B, slide 37).</p>
<p>➕ Who created whom, on this course's Linux:</p>
<div class="out"># Who created whom? Every process (except PID 1) was created by another one with a system call<br>
# 1. system initialization: in a container PID 1 is the first program started (on a full Linux: systemd)<br>
$ ps -o pid,ppid,comm -p 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 bash<br>
# 3. a user request: typing a command makes the shell fork + exec it<br>
$ sleep 30 &amp;<br>
# 2. a running process calls fork itself: here bash -c starts two children<br>
$ bash -c 'sleep 31 &amp; sleep 32 &amp; wait' &amp;<br>
$ sleep 0.3<br>
$ ps -o pid,ppid,comm --forest<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 bash<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 bash<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;18 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;\\_ sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;\\_ sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;23 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ps<br>
$ kill %1 %2</div>
<p>PID 1 is the first process (inside a container it is the shell that started the session; on a full Linux it is <code>systemd</code>, case 1). Typing <code>sleep 30 &amp;</code> made the shell fork + exec (case 3). The <code>bash -c</code> process itself called fork twice: its two <code>sleep</code> children appear indented under it in the <code>--forest</code> view, with PPID = its PID (case 2). Every process except PID 1 has a parent — that is the <strong>process tree</strong> of lesson 1.A, slide 22.</p>
<p class="pitfall">⚠️ FE: "In UNIX, which POSIX system call creates a new process?" — <strong>fork</strong> (FE6#5, FE7#7, FE9#10). <code>exec</code> does NOT create a process; it replaces the program of an existing one. "What does the OS do first to execute a new process?" — creates its <strong>PCB</strong> (process table entry) (FE2#8, FE5#14).</p>`,
        `<p class="y-chinh">🎯 Bốn sự kiện chính tạo ra tiến trình: (1) <strong>khởi động hệ thống</strong>, (2) một tiến trình đang chạy thực thi <strong>lời gọi hệ thống tạo tiến trình</strong>, (3) <strong>người dùng yêu cầu</strong> tạo tiến trình mới, (4) <strong>bắt đầu một job lô (batch job)</strong>.</p>
<p>(1) Khi HĐH khởi động, nó chạy một số tiến trình: loại tiền cảnh giao tiếp với người dùng và loại hậu cảnh gọi là <strong>daemon</strong> (máy chủ web, thư điện tử, hàng đợi in). (2) Một tiến trình đang chạy có thể sinh tiến trình phụ — một chương trình tải xuống mở vài tiến trình để tải song song từng phần. (3) Gõ một lệnh hay nhấp đúp một biểu tượng khiến shell hay giao diện đồ hoạ tạo tiến trình. (4) Trên máy lớn, khi đủ tài nguyên HĐH lấy job lô kế tiếp trong hàng đợi. Về kỹ thuật cả bốn là một: <strong>một tiến trình đã có</strong> thực thi lời gọi hệ thống tạo tiến trình. Trong UNIX đó là <code>fork</code> (một bản sao y hệt của bên gọi), thường theo sau là <code>execve</code> để nạp chương trình mới; trong Windows <code>CreateProcess</code> làm cả hai trong một lời gọi (bài 1.B, slide 37).</p>
<p>➕ Ai tạo ra ai, trên Linux của môn học:</p>
<div class="out"># Ai tạo ra ai? Mọi tiến trình (trừ PID 1) đều do một tiến trình khác tạo bằng lời gọi hệ thống<br>
# 1. khởi động hệ thống: trong container PID 1 là chương trình chạy đầu tiên (trên Linux đầy đủ: systemd)<br>
$ ps -o pid,ppid,comm -p 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 bash<br>
# 3. người dùng yêu cầu: gõ một lệnh là shell fork + exec nó<br>
$ sleep 30 &amp;<br>
# 2. một tiến trình đang chạy tự gọi fork: ở đây bash -c sinh hai con<br>
$ bash -c 'sleep 31 &amp; sleep 32 &amp; wait' &amp;<br>
$ sleep 0.3<br>
$ ps -o pid,ppid,comm --forest<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 bash<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 bash<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;18 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;\\_ sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;\\_ sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;23 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ps<br>
$ kill %1 %2</div>
<p>PID 1 là tiến trình đầu tiên (trong container đó là shell khởi động phiên; trên Linux đầy đủ là <code>systemd</code>, trường hợp 1). Gõ <code>sleep 30 &amp;</code> làm shell fork + exec (trường hợp 3). Bản thân tiến trình <code>bash -c</code> gọi fork hai lần: hai con <code>sleep</code> của nó hiện thụt vào dưới nó trong chế độ xem <code>--forest</code>, với PPID = PID của nó (trường hợp 2). Mọi tiến trình trừ PID 1 đều có cha — đó là <strong>cây tiến trình</strong> của bài 1.A, slide 22.</p>
<p class="pitfall">⚠️ FE: "Trong UNIX, lời gọi hệ thống POSIX nào tạo tiến trình mới?" — <strong>fork</strong> (FE6#5, FE7#7, FE9#10). <code>exec</code> KHÔNG tạo tiến trình; nó thay chương trình của một tiến trình đã có. "Để chạy một tiến trình mới, HĐH làm gì trước?" — tạo <strong>PCB</strong> (mục bảng tiến trình) cho nó (FE2#8, FE5#14).</p>`],
      [6, 'Process Termination',
        `<p class="y-chinh">🎯 Four typical reasons a process ends: (1) <strong>normal exit</strong> (voluntary), (2) <strong>error exit</strong> (voluntary), (3) <strong>fatal error</strong> (involuntary), (4) <strong>killed by another process</strong> (involuntary).</p>
<p>(1) The work is done: a compiler finishes and calls <code>exit</code> (UNIX) / <code>ExitProcess</code> (Windows). (2) The program itself finds a problem — <code>cc foo.c</code> when <code>foo.c</code> does not exist — and exits with a non-zero status. (3) A bug the CPU catches: an illegal instruction, a reference to nonexistent memory, a division by zero; the hardware traps and the kernel kills the process (unless it handles the signal itself). (4) Another process calls <code>kill</code> (UNIX) / <code>TerminateProcess</code> (Windows) — it needs permission to do so.</p>
<p>➕ All four, plus one surprise, from the parent's side. The parent learns <em>how</em> each child ended through <code>waitpid</code>:</p>
<pre><code class="language-c">// The four ways a process ends (Tanenbaum §2.1.4), seen by the parent through waitpid
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;sys/wait.h&gt;

static void report(const char *what, pid_t pid) {
    int st;
    waitpid(pid, &amp;st, 0);
    if (WIFEXITED(st))
        printf("%-34s -&gt; exited, status %d\\n", what, WEXITSTATUS(st));
    else if (WIFSIGNALED(st))
        printf("%-34s -&gt; killed by signal %d (%s)\\n", what, WTERMSIG(st), strsignal(WTERMSIG(st)));
}

int main(void) {
    pid_t p;
    setvbuf(stdout, NULL, _IOLBF, 0);                       // one line at a time, so no line is copied by fork
    if ((p = fork()) == 0) exit(0);                          // 1. normal exit: work finished
    report("1 normal exit (voluntary)", p);

    if ((p = fork()) == 0) {                                 // 2. error exit: the program sees a problem
        if (open("no-such-file.txt", O_RDONLY) &lt; 0) { perror("cc: no-such-file.txt"); exit(2); }
        exit(0);
    }
    report("2 error exit (voluntary)", p);

    if ((p = fork()) == 0) {                                 // 3. fatal error: the CPU traps, the kernel kills
        int *ptr = NULL;
        *ptr = 42;                                           // write to address 0
        exit(0);
    }
    report("3 fatal error (involuntary)", p);

    if ((p = fork()) == 0) { pause(); exit(0); }             // 4. a child that would wait forever
    sleep(1);
    kill(p, SIGKILL);                                        // ... killed by another process
    report("4 killed by another (involuntary)", p);

    if ((p = fork()) == 0) {                                 // bonus: divide by zero
        volatile int a = 7, b = 0;
        printf("child computed 7 / 0 = %d\\n", a / b);
        exit(0);
    }
    report("5 integer divide by zero", p);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ket-thuc.c -o ket-thuc &amp;&amp; ./ket-thuc<br>
1 normal exit (voluntary) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; exited, status 0<br>
cc: no-such-file.txt: No such file or directory<br>
2 error exit (voluntary) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; exited, status 2<br>
3 fatal error (involuntary) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; killed by signal 11 (Segmentation fault)<br>
4 killed by another (involuntary) &nbsp;-&gt; killed by signal 9 (Killed)<br>
child computed 7 / 0 = 0<br>
5 integer divide by zero &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; exited, status 0</div>
<p>"Exited, status N" is the voluntary kind; "killed by signal" is the involuntary kind: signal 11 (SIGSEGV) for writing to address 0, signal 9 (SIGKILL) from our <code>kill</code>. The surprise is case 5: on this <strong>ARM64</strong> container an integer division by zero does <em>not</em> trap — the ARM divide instruction simply returns 0, so the child printed "7 / 0 = 0" and exited normally. On an <strong>x86-64</strong> PC or WSL, the same program dies with signal 8 (SIGFPE, "Floating point exception"). The C standard calls it undefined behaviour; "fatal error" depends on the hardware.</p>
<p class="meo">🧠 In a shell, <code>echo $?</code> shows the exit status: 0 = success, 1–125 = the program's own error codes, 128 + n = killed by signal n (137 = 128 + 9 = SIGKILL, typical of the OOM killer in Docker).</p>`,
        `<p class="y-chinh">🎯 Bốn lý do điển hình khiến tiến trình kết thúc: (1) <strong>thoát bình thường</strong> (tự nguyện), (2) <strong>thoát do lỗi</strong> (tự nguyện), (3) <strong>lỗi nghiêm trọng</strong> (không tự nguyện), (4) <strong>bị tiến trình khác giết</strong> (không tự nguyện).</p>
<p>(1) Xong việc: trình biên dịch dịch xong và gọi <code>exit</code> (UNIX) / <code>ExitProcess</code> (Windows). (2) Chương trình tự phát hiện vấn đề — <code>cc foo.c</code> trong khi <code>foo.c</code> không tồn tại — và thoát với mã khác 0. (3) Một lỗi do CPU bắt được: lệnh không hợp lệ, tham chiếu vùng nhớ không tồn tại, chia cho 0; phần cứng bẫy và nhân giết tiến trình (trừ khi nó tự xử lý tín hiệu). (4) Một tiến trình khác gọi <code>kill</code> (UNIX) / <code>TerminateProcess</code> (Windows) — nó phải có quyền làm vậy.</p>
<p>➕ Cả bốn, cộng một bất ngờ, nhìn từ phía tiến trình cha. Cha biết <em>mỗi con kết thúc ra sao</em> nhờ <code>waitpid</code>:</p>
<pre><code class="language-c">// Bốn cách một tiến trình kết thúc (Tanenbaum §2.1.4), cha nhìn thấy qua waitpid
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;sys/wait.h&gt;

static void report(const char *what, pid_t pid) {
    int st;
    waitpid(pid, &amp;st, 0);
    if (WIFEXITED(st))
        printf("%-34s -&gt; exited, status %d\\n", what, WEXITSTATUS(st));
    else if (WIFSIGNALED(st))
        printf("%-34s -&gt; killed by signal %d (%s)\\n", what, WTERMSIG(st), strsignal(WTERMSIG(st)));
}

int main(void) {
    pid_t p;
    setvbuf(stdout, NULL, _IOLBF, 0);                       // từng dòng một, để fork không chép dòng nào hai lần
    if ((p = fork()) == 0) exit(0);                          // 1. thoát bình thường: xong việc
    report("1 normal exit (voluntary)", p);

    if ((p = fork()) == 0) {                                 // 2. thoát do lỗi: chương trình tự thấy có vấn đề
        if (open("no-such-file.txt", O_RDONLY) &lt; 0) { perror("cc: no-such-file.txt"); exit(2); }
        exit(0);
    }
    report("2 error exit (voluntary)", p);

    if ((p = fork()) == 0) {                                 // 3. lỗi nghiêm trọng: CPU bẫy, nhân giết
        int *ptr = NULL;
        *ptr = 42;                                           // ghi vào địa chỉ 0
        exit(0);
    }
    report("3 fatal error (involuntary)", p);

    if ((p = fork()) == 0) { pause(); exit(0); }             // 4. một tiến trình con sẽ chờ mãi
    sleep(1);
    kill(p, SIGKILL);                                        // ... bị tiến trình khác giết
    report("4 killed by another (involuntary)", p);

    if ((p = fork()) == 0) {                                 // thêm: chia cho 0
        volatile int a = 7, b = 0;
        printf("child computed 7 / 0 = %d\\n", a / b);
        exit(0);
    }
    report("5 integer divide by zero", p);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ket-thuc.c -o ket-thuc &amp;&amp; ./ket-thuc<br>
1 normal exit (voluntary) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; exited, status 0<br>
cc: no-such-file.txt: No such file or directory<br>
2 error exit (voluntary) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; exited, status 2<br>
3 fatal error (involuntary) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; killed by signal 11 (Segmentation fault)<br>
4 killed by another (involuntary) &nbsp;-&gt; killed by signal 9 (Killed)<br>
child computed 7 / 0 = 0<br>
5 integer divide by zero &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; exited, status 0</div>
<p>"exited, status N" là loại tự nguyện; "killed by signal" là loại không tự nguyện: tín hiệu 11 (SIGSEGV) vì ghi vào địa chỉ 0, tín hiệu 9 (SIGKILL) từ lệnh <code>kill</code> của ta. Bất ngờ nằm ở trường hợp 5: trên container <strong>ARM64</strong> này phép chia số nguyên cho 0 <em>không</em> gây bẫy — lệnh chia của ARM chỉ trả về 0, nên tiến trình con in "7 / 0 = 0" rồi thoát bình thường. Trên PC <strong>x86-64</strong> hay WSL, cùng chương trình đó chết với tín hiệu 8 (SIGFPE, "Floating point exception"). Chuẩn C gọi đây là hành vi không xác định; "lỗi nghiêm trọng" tuỳ vào phần cứng.</p>
<p class="meo">🧠 Trong shell, <code>echo $?</code> cho xem mã thoát: 0 = thành công, 1–125 = mã lỗi riêng của chương trình, 128 + n = bị tín hiệu n giết (137 = 128 + 9 = SIGKILL, kiểu điển hình khi bị OOM killer giết trong Docker).</p>`],
      [7, 'Process States (1)',
        `<p class="y-chinh">🎯 A process is always in one of three states: <strong>Running</strong> (actually using the CPU at that instant), <strong>Ready</strong> (runnable; temporarily stopped to let another process run), <strong>Blocked</strong> (unable to run until some external event happens).</p>
<p>The difference between Ready and Blocked is the whole point. A <strong>ready</strong> process could run right now — it only lacks a CPU, and it is waiting in the scheduler's queue. A <strong>blocked</strong> process could not run even if the CPU were free: it waits for input from the keyboard, for a disk block, for a network packet, for a timer, for a lock. The book's example: in <code>cat chapter1 chapter2 | grep tree</code>, <code>grep</code> may be ready to run but have no input yet — it blocks until <code>cat</code> writes into the pipe.</p>
<p>➕ Linux shows the state in the <code>STAT</code> column of <code>ps</code>. Here are all of them at once, made on purpose:</p>
<div class="out"># The three states of Figure 2-2 (plus two Linux extras), read from the STAT column of ps<br>
# R = running or ready (runnable): a busy loop<br>
$ sh -c 'while :; do :; done' &amp;<br>
# S = blocked (sleeping), waiting for an event: here for a timer<br>
$ sleep 100 &amp;<br>
# T = stopped by a signal (Ctrl+Z sends one)<br>
$ sleep 101 &amp;<br>
$ kill -STOP %3<br>
# Z = zombie: finished, but its parent has not called wait() yet<br>
$ bash -c 'sleep 0.1 &amp; exec sleep 102' &amp;<br>
$ sleep 1<br>
$ ps -o pid,ppid,stat,args<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 Ss &nbsp;&nbsp;bash /usr/local/bin/phien trang-thai.sh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 R &nbsp;&nbsp;&nbsp;sh -c while :; do :; done<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 S &nbsp;&nbsp;&nbsp;sleep 100<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 T &nbsp;&nbsp;&nbsp;sleep 101<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 S &nbsp;&nbsp;&nbsp;sleep 102<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;23 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 Z &nbsp;&nbsp;&nbsp;[sleep] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;35 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 R &nbsp;&nbsp;&nbsp;ps -o pid,ppid,stat,args<br>
$ kill -9 %1 %2 %3 %4</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p><code>R</code> = runnable: Linux uses one letter for both <em>running</em> and <em>ready</em> (the busy loop <code>sh</code>, and <code>ps</code> itself which is running while it prints). <code>S</code> = interruptible sleep = <strong>blocked</strong> (the <code>sleep</code> processes wait for a timer). <code>T</code> = stopped by a signal (what Ctrl+Z does), and <code>Z</code> = zombie, a finished process whose parent has not yet collected its status — the two extra states most books draw around the basic three (next slide). There is also <code>D</code>, uninterruptible sleep (blocked inside a disk or NFS operation; even <code>kill -9</code> waits).</p>
<p class="pitfall">⚠️ FE: "What are the basic states of a process?" — <strong>Running, Ready, and Blocked</strong> (FE6#11, FE7#9, FE8#8). Options with "Create" or "Exit" describe the 5-state model, not the three basic states of this slide.</p>`,
        `<p class="y-chinh">🎯 Tiến trình luôn ở một trong ba trạng thái: <strong>Running</strong> (đang chạy — đang thật sự dùng CPU ở khoảnh khắc đó), <strong>Ready</strong> (sẵn sàng — chạy được, tạm dừng để tiến trình khác chạy), <strong>Blocked</strong> (bị chặn — không chạy được cho tới khi một sự kiện bên ngoài xảy ra).</p>
<p>Khác biệt giữa Ready và Blocked là toàn bộ vấn đề. Tiến trình <strong>sẵn sàng</strong> có thể chạy ngay — nó chỉ thiếu CPU, và đang chờ trong hàng đợi của bộ lập lịch. Tiến trình <strong>bị chặn</strong> thì dù CPU rảnh cũng không chạy được: nó chờ dữ liệu từ bàn phím, một khối đĩa, một gói tin mạng, một đồng hồ, một khoá. Ví dụ của sách: trong <code>cat chapter1 chapter2 | grep tree</code>, <code>grep</code> có thể sẵn sàng chạy nhưng chưa có dữ liệu — nó bị chặn tới khi <code>cat</code> ghi vào ống.</p>
<p>➕ Linux hiện trạng thái ở cột <code>STAT</code> của <code>ps</code>. Đây là tất cả cùng một lúc, được tạo ra có chủ ý:</p>
<div class="out"># Ba trạng thái của Hình 2-2 (cộng hai trạng thái riêng của Linux), đọc ở cột STAT của ps<br>
# R = đang chạy hoặc sẵn sàng (runnable): một vòng lặp bận<br>
$ sh -c 'while :; do :; done' &amp;<br>
# S = bị chặn (đang ngủ), chờ một sự kiện: ở đây là đồng hồ<br>
$ sleep 100 &amp;<br>
# T = bị dừng bởi tín hiệu (Ctrl+Z gửi tín hiệu này)<br>
$ sleep 101 &amp;<br>
$ kill -STOP %3<br>
# Z = xác sống: đã chạy xong, nhưng cha chưa gọi wait()<br>
$ bash -c 'sleep 0.1 &amp; exec sleep 102' &amp;<br>
$ sleep 1<br>
$ ps -o pid,ppid,stat,args<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 Ss &nbsp;&nbsp;bash /usr/local/bin/phien trang-thai.sh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 R &nbsp;&nbsp;&nbsp;sh -c while :; do :; done<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 S &nbsp;&nbsp;&nbsp;sleep 100<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 T &nbsp;&nbsp;&nbsp;sleep 101<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 S &nbsp;&nbsp;&nbsp;sleep 102<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;23 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 Z &nbsp;&nbsp;&nbsp;[sleep] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;35 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 R &nbsp;&nbsp;&nbsp;ps -o pid,ppid,stat,args<br>
$ kill -9 %1 %2 %3 %4</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p><code>R</code> = runnable (chạy được): Linux dùng một chữ cho cả <em>đang chạy</em> lẫn <em>sẵn sàng</em> (vòng lặp bận <code>sh</code>, và chính <code>ps</code> đang chạy lúc nó in). <code>S</code> = ngủ ngắt được = <strong>bị chặn</strong> (các tiến trình <code>sleep</code> chờ đồng hồ). <code>T</code> = bị dừng bởi tín hiệu (việc Ctrl+Z làm), và <code>Z</code> = zombie (xác sống), tiến trình đã xong mà cha chưa lấy mã thoát — hai trạng thái thêm mà phần lớn sách vẽ quanh ba trạng thái cơ bản (slide sau). Còn có <code>D</code>, ngủ không ngắt được (bị chặn bên trong một thao tác đĩa hay NFS; đến <code>kill -9</code> cũng phải đợi).</p>
<p class="pitfall">⚠️ FE: "Các trạng thái cơ bản của một tiến trình là gì?" — <strong>Running, Ready và Blocked</strong> (FE6#11, FE7#9, FE8#8). Phương án có "Create" hay "Exit" là mô hình 5 trạng thái, không phải ba trạng thái cơ bản của slide này.</p>`],
      [8, 'Process States (2)',
        `<p class="y-chinh">🎯 Figure 2-2: four transitions between the three states — (1) Running → Blocked: the process blocks for input; (2) Running → Ready: the scheduler picks another process; (3) Ready → Running: the scheduler picks this process; (4) Blocked → Ready: the input becomes available.</p>
<p>Transition 1 happens when the process discovers it cannot continue — usually inside a system call such as <code>read</code> on an empty pipe. Transitions 2 and 3 are caused by the <strong>scheduler</strong>, not by the process: 2 when the process has used up its time slice (a timer interrupt), 3 when it is this process's turn. Transition 4 happens when the event the process waited for occurs — an interrupt from the disk, a packet, another process writing into the pipe; if no other process is running at that moment, transition 3 follows immediately.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/f21b2c6fe51ee08631dc6c30b174dad2945f877b.svg" alt="Figure 2-2 with the two states most textbooks add (New, Terminated) and the Linux letter of each state" loading="lazy" /><p class="chu-thich">🧩 Figure 2-2 with the two states most textbooks add (New, Terminated) and the Linux letter of each state</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 2-2 plus the two states most books add, with the Linux STAT letter of each
hide empty description
state "New\\n(being created: fork)" as New
state "Ready\\nrunnable, waiting for a CPU\\nLinux STAT: R" as Ready #DCFCE7
state "Running\\nusing the CPU right now\\nLinux STAT: R" as Running #BFDBFE
state "Blocked\\nwaiting for an event (I/O, timer, lock)\\nLinux STAT: S or D" as Blocked #FEE2E2
state "Terminated\\nexited, parent not yet waited\\nLinux STAT: Z (zombie)" as Term
[*] --&gt; New
New --&gt; Ready : admitted
Running --&gt; Blocked : 1. blocks for input\\n(read on an empty pipe, sleep, lock taken)
Running --&gt; Ready : 2. scheduler picks another process\\n(quantum used up / preempted)
Ready --&gt; Running : 3. scheduler picks this process\\n(dispatch)
Blocked --&gt; Ready : 4. input becomes available\\n(interrupt, wakeup)
Running --&gt; Term : exit() or killed
Term --&gt; [*] : parent calls wait()
note right of Blocked
  There is NO arrow Blocked -&gt; Running
  and NO arrow Ready -&gt; Blocked:
  a process can only block while it runs,
  and after the event it must queue again.
end note
@enduml</code></pre></details>
<p>➕ The diagram above adds <strong>New</strong> (being created) and <strong>Terminated</strong> (finished, waiting for the parent's <code>wait</code>), which many textbooks and some FE questions use (the "5-state model"). Lesson 2.3 below draws the same five states in text and explains the zombie.</p>
<p class="pitfall">⚠️ The favourite FE question: "Which transition is illegal?" — <strong>Ready → Blocked</strong> (FE5#12, FE8#9): a process can only block while it is running (it must execute the instruction that waits). Also impossible: Blocked → Running directly — after the event, the process goes back to Ready and waits for the scheduler. And FE3#6: in Round Robin, a process that uses up its quantum goes <strong>Running → Ready</strong>, not to Blocked.</p>`,
        `<p class="y-chinh">🎯 Hình 2-2: bốn chuyển đổi giữa ba trạng thái — (1) Running → Blocked: tiến trình bị chặn chờ dữ liệu; (2) Running → Ready: bộ lập lịch chọn tiến trình khác; (3) Ready → Running: bộ lập lịch chọn tiến trình này; (4) Blocked → Ready: dữ liệu đã có.</p>
<p>Chuyển đổi 1 xảy ra khi tiến trình phát hiện mình không đi tiếp được — thường là bên trong một lời gọi hệ thống như <code>read</code> trên một ống rỗng. Chuyển đổi 2 và 3 do <strong>bộ lập lịch</strong> gây ra, không phải do tiến trình: 2 khi tiến trình dùng hết lát thời gian của nó (ngắt đồng hồ), 3 khi tới lượt tiến trình này. Chuyển đổi 4 xảy ra khi sự kiện tiến trình chờ đã tới — một ngắt từ đĩa, một gói tin, một tiến trình khác ghi vào ống; nếu lúc đó không có tiến trình nào đang chạy, chuyển đổi 3 theo ngay sau.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/f21b2c6fe51ee08631dc6c30b174dad2945f877b.svg" alt="Hình 2-2 cộng hai trạng thái mà phần lớn giáo trình thêm vào (New, Terminated) và chữ cái Linux của từng trạng thái" loading="lazy" /><p class="chu-thich">🧩 Hình 2-2 cộng hai trạng thái mà phần lớn giáo trình thêm vào (New, Terminated) và chữ cái Linux của từng trạng thái</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 2-2 cộng hai trạng thái mà nhiều sách thêm vào, kèm chữ STAT của Linux cho từng trạng thái
hide empty description
state "New\\n(being created: fork)" as New
state "Ready\\nrunnable, waiting for a CPU\\nLinux STAT: R" as Ready #DCFCE7
state "Running\\nusing the CPU right now\\nLinux STAT: R" as Running #BFDBFE
state "Blocked\\nwaiting for an event (I/O, timer, lock)\\nLinux STAT: S or D" as Blocked #FEE2E2
state "Terminated\\nexited, parent not yet waited\\nLinux STAT: Z (zombie)" as Term
[*] --&gt; New
New --&gt; Ready : admitted
Running --&gt; Blocked : 1. blocks for input\\n(read on an empty pipe, sleep, lock taken)
Running --&gt; Ready : 2. scheduler picks another process\\n(quantum used up / preempted)
Ready --&gt; Running : 3. scheduler picks this process\\n(dispatch)
Blocked --&gt; Ready : 4. input becomes available\\n(interrupt, wakeup)
Running --&gt; Term : exit() or killed
Term --&gt; [*] : parent calls wait()
note right of Blocked
  There is NO arrow Blocked -&gt; Running
  and NO arrow Ready -&gt; Blocked:
  a process can only block while it runs,
  and after the event it must queue again.
end note
@enduml</code></pre></details>
<p>➕ Sơ đồ trên thêm <strong>New</strong> (đang được tạo) và <strong>Terminated</strong> (đã xong, chờ cha gọi <code>wait</code>), thứ mà nhiều giáo trình và một số câu FE dùng ("mô hình 5 trạng thái"). Bài 2.3 bên dưới vẽ cùng năm trạng thái bằng chữ và giải thích zombie.</p>
<p class="pitfall">⚠️ Câu FE được ưa thích: "Chuyển đổi nào không hợp lệ?" — <strong>Ready → Blocked</strong> (FE5#12, FE8#9): tiến trình chỉ bị chặn được khi đang chạy (nó phải thực thi chính lệnh chờ). Cũng không thể: Blocked → Running trực tiếp — sau sự kiện, tiến trình quay về Ready và chờ bộ lập lịch. Và FE3#6: trong Round Robin, tiến trình dùng hết lượng tử chuyển <strong>Running → Ready</strong>, không phải sang Blocked.</p>`],
      [9, 'Process States (3)',
        `<p class="y-chinh">🎯 Figure 2-3: a <strong>process-structured OS</strong>. The lowest layer is the <strong>scheduler</strong>, which handles all interrupts and the starting and stopping of processes; above it are sequential processes 0, 1, …, n−1 — user processes, disk processes, terminal processes.</p>
<p>This is the "process model" applied to the OS itself. Instead of thinking "when the disk interrupt arrives, the kernel runs code X", you think "the disk process was blocked waiting for the disk; the interrupt makes it ready; the scheduler runs it". All interrupt handling and the actual switching hide inside the small bottom layer; everything above is written as ordinary sequential code that blocks and wakes up. The book notes that few real systems are built this purely, but it is the right mental model.</p>
<p>➕ You can see the idea in Linux: many kernel activities run as <strong>kernel threads</strong> that are scheduled like processes — <code>kworker</code>, <code>ksoftirqd</code>, <code>kswapd</code> (memory), <code>jbd2</code> (the ext4 journal). On a normal Linux, <code>ps -ef</code> shows them in square brackets, all children of PID 2 (<code>kthreadd</code>). (Inside a container you do not see them: the container has its own PID namespace.)</p>
<div class="callout">🧭 <strong>On a real server:</strong> the same layering is how backend frameworks are written. An event loop (Node.js, Netty under Spring WebFlux) is the "bottom layer" that handles all I/O events and decides which piece of code runs next; your handlers above it look sequential. Understanding Figure 2-3 makes "the event loop is blocked" errors much easier to reason about.</div>`,
        `<p class="y-chinh">🎯 Hình 2-3: một <strong>HĐH được cấu trúc theo tiến trình</strong>. Tầng thấp nhất là <strong>bộ lập lịch</strong>, lo mọi ngắt và việc khởi động, dừng tiến trình; bên trên là các tiến trình tuần tự 0, 1, …, n−1 — tiến trình người dùng, tiến trình đĩa, tiến trình thiết bị đầu cuối.</p>
<p>Đây là "mô hình tiến trình" áp vào chính HĐH. Thay vì nghĩ "khi ngắt đĩa tới, nhân chạy đoạn mã X", bạn nghĩ "tiến trình đĩa đang bị chặn chờ đĩa; ngắt làm nó sẵn sàng; bộ lập lịch cho nó chạy". Mọi việc xử lý ngắt và việc chuyển tiến trình thật sự được giấu trong tầng đáy nhỏ; mọi thứ bên trên viết như mã tuần tự bình thường, bị chặn rồi được đánh thức. Sách lưu ý ít hệ thống thật được xây thuần tuý như vậy, nhưng đó là mô hình tư duy đúng.</p>
<p>➕ Bạn thấy được ý này trong Linux: nhiều việc của nhân chạy dưới dạng <strong>luồng nhân (kernel thread)</strong> được lập lịch y như tiến trình — <code>kworker</code>, <code>ksoftirqd</code>, <code>kswapd</code> (bộ nhớ), <code>jbd2</code> (nhật ký của ext4). Trên Linux bình thường, <code>ps -ef</code> hiện chúng trong ngoặc vuông, đều là con của PID 2 (<code>kthreadd</code>). (Trong container bạn không thấy chúng: container có không gian tên PID riêng.)</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> cách phân tầng này cũng là cách các framework backend được viết. Vòng lặp sự kiện (Node.js, Netty bên dưới Spring WebFlux) chính là "tầng đáy" lo mọi sự kiện I/O và quyết định đoạn mã nào chạy tiếp; các hàm xử lý của bạn ở trên trông như tuần tự. Hiểu Hình 2-3 giúp lỗi "event loop bị chặn" dễ suy luận hơn nhiều.</div>`],
      [10, 'Implementation of Processes (1)',
        `<p class="y-chinh">🎯 Figure 2-4: the OS keeps one <strong>process table</strong> with one entry per process — also called a <strong>process control block (PCB)</strong>. An entry holds everything needed to stop a process and later restart it as if it had never been stopped, in three groups: process management, memory management, file management.</p>
<p><strong>Process management</strong>: registers, program counter, program status word, stack pointer, process state, priority, scheduling parameters, process ID, parent process, process group, signals, time when the process started, CPU time used, children's CPU time, time of next alarm. <strong>Memory management</strong>: pointers to the text (code), data and stack segments (in a paged system, the page table — Chapter 3). <strong>File management</strong>: root directory, working directory, file descriptors, user ID, group ID. When the process is not running, its registers live here; when it runs, they live in the CPU.</p>
<p>➕ On Linux the entry is a C structure called <code>task_struct</code> (several kilobytes, in <code>include/linux/sched.h</code>), and the kernel lets you read most of it as text under <code>/proc/&lt;PID&gt;/</code>. Every group of Figure 2-4, for a sleeping process:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Figure 2-4 on Linux: the "process table entry" is the kernel's task_struct, shown to us as /proc/&lt;PID&gt;/<br>
$ sleep 60 &amp;<br>
$ P=$(jobs -p %1)<br>
# process management: state, IDs, parent, priority, signals, context switches<br>
$ grep -E '^(Name|State|Pid|PPid|Uid|Gid|Threads|SigBlk|voluntary_ctxt_switches|nonvoluntary_ctxt_switches)' /proc/$P/status<br>
Name:	sleep<br>
State:	S (sleeping)<br>
Pid:	9<br>
PPid:	1<br>
Uid:	1000	1000	1000	1000<br>
Gid:	1000	1000	1000	1000<br>
Threads:	1<br>
SigBlk:	0000000000000000<br>
voluntary_ctxt_switches:	1<br>
nonvoluntary_ctxt_switches:	3<br>
$ grep -E '^(policy|prio)' /proc/$P/sched<br>
policy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
prio &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120<br>
# memory management: where text, data, heap and stack segments are<br>
$ grep -E '^(VmSize|VmRSS|VmData|VmStk|VmExe)' /proc/$P/status<br>
VmSize:	 &nbsp;&nbsp;&nbsp;2660 kB<br>
VmRSS:	 &nbsp;&nbsp;&nbsp;1440 kB<br>
VmData:	 &nbsp;&nbsp;&nbsp;&nbsp;220 kB<br>
VmStk:	 &nbsp;&nbsp;&nbsp;&nbsp;132 kB<br>
VmExe:	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32 kB<br>
# file management: root directory, working directory, open file descriptors<br>
$ ls -l /proc/$P/root /proc/$P/cwd | cut -d' ' -f9-<br>
/proc/9/cwd -&gt; /w<br>
/proc/9/root -&gt; /<br>
$ ls /proc/$P/fd<br>
0<br>
1<br>
2<br>
# the raw table entry: 52 numbers on one line (field 3 = state, 4 = parent, 14/15 = CPU time used)<br>
$ cut -d' ' -f1-4 /proc/$P/stat<br>
9 (sleep) S 1<br>
$ tr ' ' '\\n' &lt; /proc/$P/stat | wc -l<br>
52<br>
$ kill $P</div>
<p>Name, state, PID, parent, user and group IDs, the blocked-signals mask and the counters of voluntary/involuntary context switches (process management); <code>policy</code> and <code>prio</code> are the scheduling parameters (0 = normal policy, priority 120 = nice 0); VmData, VmStk, VmExe are the data, stack and code segments (memory management); <code>root</code>, <code>cwd</code> and <code>fd</code> are the root directory, working directory and file descriptors (file management). The raw <code>/proc/PID/stat</code> line has 52 fields — the same entry as numbers.</p>
<p class="pitfall">⚠️ FE2#4: "The PCB does NOT store which of the following?" — the <strong>source code</strong> of the program. The PCB stores state, registers, scheduling and I/O information, and only <em>pointers</em> to the memory segments.</p>`,
        `<p class="y-chinh">🎯 Hình 2-4: HĐH giữ một <strong>bảng tiến trình (process table)</strong> với mỗi tiến trình một mục — còn gọi là <strong>khối điều khiển tiến trình (process control block, PCB)</strong>. Một mục chứa mọi thứ cần để dừng một tiến trình và sau đó cho chạy lại như thể nó chưa từng bị dừng, chia ba nhóm: quản lý tiến trình, quản lý bộ nhớ, quản lý tệp.</p>
<p><strong>Quản lý tiến trình</strong>: các thanh ghi, bộ đếm chương trình, từ trạng thái chương trình (PSW), con trỏ ngăn xếp, trạng thái tiến trình, độ ưu tiên, tham số lập lịch, ID tiến trình, tiến trình cha, nhóm tiến trình, tín hiệu, thời điểm bắt đầu, thời gian CPU đã dùng, thời gian CPU của các con, thời điểm báo thức kế tiếp. <strong>Quản lý bộ nhớ</strong>: con trỏ tới đoạn text (mã), data và stack (trong hệ phân trang là bảng trang — Chương 3). <strong>Quản lý tệp</strong>: thư mục gốc, thư mục làm việc, các bộ mô tả tệp, ID người dùng, ID nhóm. Khi tiến trình không chạy, thanh ghi của nó nằm ở đây; khi nó chạy, chúng nằm trong CPU.</p>
<p>➕ Trên Linux, mục này là một cấu trúc C tên <code>task_struct</code> (vài kilobyte, trong <code>include/linux/sched.h</code>), và nhân cho đọc phần lớn nội dung của nó dưới dạng chữ trong <code>/proc/&lt;PID&gt;/</code>. Mọi nhóm của Hình 2-4, cho một tiến trình đang ngủ:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Hình 2-4 trên Linux: "mục bảng tiến trình" là task_struct của nhân, hiện cho ta xem qua /proc/&lt;PID&gt;/<br>
$ sleep 60 &amp;<br>
$ P=$(jobs -p %1)<br>
# quản lý tiến trình: trạng thái, các ID, cha, độ ưu tiên, tín hiệu, số lần chuyển ngữ cảnh<br>
$ grep -E '^(Name|State|Pid|PPid|Uid|Gid|Threads|SigBlk|voluntary_ctxt_switches|nonvoluntary_ctxt_switches)' /proc/$P/status<br>
Name:	sleep<br>
State:	S (sleeping)<br>
Pid:	9<br>
PPid:	1<br>
Uid:	1000	1000	1000	1000<br>
Gid:	1000	1000	1000	1000<br>
Threads:	1<br>
SigBlk:	0000000000000000<br>
voluntary_ctxt_switches:	1<br>
nonvoluntary_ctxt_switches:	3<br>
$ grep -E '^(policy|prio)' /proc/$P/sched<br>
policy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
prio &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120<br>
# quản lý bộ nhớ: đoạn mã, dữ liệu, heap và ngăn xếp nằm ở đâu<br>
$ grep -E '^(VmSize|VmRSS|VmData|VmStk|VmExe)' /proc/$P/status<br>
VmSize:	 &nbsp;&nbsp;&nbsp;2660 kB<br>
VmRSS:	 &nbsp;&nbsp;&nbsp;1440 kB<br>
VmData:	 &nbsp;&nbsp;&nbsp;&nbsp;220 kB<br>
VmStk:	 &nbsp;&nbsp;&nbsp;&nbsp;132 kB<br>
VmExe:	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32 kB<br>
# quản lý tệp: thư mục gốc, thư mục làm việc, các bộ mô tả tệp đang mở<br>
$ ls -l /proc/$P/root /proc/$P/cwd | cut -d' ' -f9-<br>
/proc/9/cwd -&gt; /w<br>
/proc/9/root -&gt; /<br>
$ ls /proc/$P/fd<br>
0<br>
1<br>
2<br>
# mục bảng ở dạng thô: 52 con số trên một dòng (trường 3 = trạng thái, 4 = cha, 14/15 = thời gian CPU đã dùng)<br>
$ cut -d' ' -f1-4 /proc/$P/stat<br>
9 (sleep) S 1<br>
$ tr ' ' '\\n' &lt; /proc/$P/stat | wc -l<br>
52<br>
$ kill $P</div>
<p>Tên, trạng thái, PID, cha, ID người dùng và nhóm, mặt nạ tín hiệu bị chặn và bộ đếm số lần chuyển ngữ cảnh tự nguyện/không tự nguyện (quản lý tiến trình); <code>policy</code> và <code>prio</code> là tham số lập lịch (0 = chính sách thường, độ ưu tiên 120 = nice 0); VmData, VmStk, VmExe là đoạn dữ liệu, ngăn xếp và mã (quản lý bộ nhớ); <code>root</code>, <code>cwd</code> và <code>fd</code> là thư mục gốc, thư mục làm việc và các bộ mô tả tệp (quản lý tệp). Dòng thô <code>/proc/PID/stat</code> có 52 trường — chính mục đó ở dạng số.</p>
<p class="pitfall">⚠️ FE2#4: "PCB KHÔNG lưu thứ nào sau đây?" — <strong>mã nguồn (source code)</strong> của chương trình. PCB lưu trạng thái, thanh ghi, thông tin lập lịch và I/O, và chỉ lưu <em>con trỏ</em> tới các đoạn bộ nhớ.</p>`],
      [11, 'Implementation of Processes (2)',
        `<p class="y-chinh">🎯 Figure 2-5: what the lowest level of the OS does when an interrupt occurs — (1) hardware stacks the program counter etc.; (2) hardware loads a new PC from the interrupt vector; (3) an assembly procedure saves the registers; (4) it sets up a new stack; (5) the C interrupt service runs (typically reads and buffers input); (6) the scheduler decides which process runs next; (7) the C procedure returns to the assembly code; (8) the assembly procedure starts the new current process.</p>
<p>Steps 1–2 are done by the CPU itself; the <strong>interrupt vector</strong> is a table of handler addresses, one per device. Steps 3–4 must be in assembly, because C cannot say "save every register" or "switch stacks". The interrupt has made some blocked process ready (the one that waited for this disk block), so in step 6 the scheduler may pick it instead of the process that was interrupted — that is a <strong>process switch</strong> (also called a context switch).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/11308a909a5e535c2af157c3ae51b2e9d702ada7.svg" alt="Figure 2-5 as a sequence: an interrupt arrives while A runs, and the scheduler may hand the CPU to B" loading="lazy" /><p class="chu-thich">🧩 Figure 2-5 as a sequence: an interrupt arrives while A runs, and the scheduler may hand the CPU to B</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 2-5 as a sequence: an interrupt arrives while process A runs; the scheduler may pick process B
participant "Process A\\n(user mode)" as A
participant "CPU hardware" as HW
participant "Assembly stub\\n(kernel)" as ASM
participant "C interrupt service\\n(driver, kernel)" as C
participant "Scheduler\\n(kernel)" as S
participant "Process B\\n(user mode)" as B
A -&gt; HW : running ... a device raises an interrupt
HW -&gt; HW : 1. push PC, PSW (and a few registers) on the stack
HW -&gt; ASM : 2. load new PC from the interrupt vector
ASM -&gt; ASM : 3. save all registers into A's process table entry
ASM -&gt; ASM : 4. set up a new (kernel) stack
ASM -&gt; C : 5. call the C interrupt service
C -&gt; C : read and buffer the input,\\nmark the waiting process READY
C -&gt; S : 6. scheduler decides who runs next
S --&gt; ASM : 7. return to the assembly code
ASM -&gt; B : 8. load B's registers and memory map, start B
note over A, B : If the scheduler picks A again, step 8 simply resumes A — A never notices the interrupt.
@enduml</code></pre></details>
<p>➕ How much does one switch cost? Two processes on <strong>one</strong> core bounce one byte through two pipes; every <code>read</code> on an empty pipe blocks the reader, so the kernel must switch to the other process:</p>
<pre><code class="language-c">// How expensive is a process switch (slide 11)? Two processes on ONE core bounce a byte through two pipes
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;sys/resource.h&gt;

#define ROUNDS 100000

int main(void) {
    int ping[2], pong[2];
    char b = 'x';
    pipe(ping);
    pipe(pong);
    if (fork() == 0) {                          // child: wait for a byte, send it back
        for (int i = 0; i &lt; ROUNDS; i++) {
            read(ping[0], &amp;b, 1);               // blocks -&gt; the kernel switches to the parent
            write(pong[1], &amp;b, 1);
        }
        exit(0);
    }
    struct timespec s, e;
    clock_gettime(CLOCK_MONOTONIC, &amp;s);
    for (int i = 0; i &lt; ROUNDS; i++) {
        write(ping[1], &amp;b, 1);
        read(pong[0], &amp;b, 1);                   // blocks -&gt; switch to the child
    }
    clock_gettime(CLOCK_MONOTONIC, &amp;e);
    struct rusage ru;
    wait4(-1, NULL, 0, &amp;ru);                    // resource usage of the child
    double ns = ((e.tv_sec - s.tv_sec) * 1e9 + (e.tv_nsec - s.tv_nsec));
    printf("round trips             : %d (= %d process switches)\\n", ROUNDS, 2 * ROUNDS);
    printf("total time              : %.0f ms\\n", ns / 1e6);
    printf("one switch (+ 1 syscall): %.2f us\\n", ns / (2.0 * ROUNDS) / 1e3);
    printf("child, voluntary switches  : %ld (it blocked in read)\\n", ru.ru_nvcsw);
    printf("child, involuntary switches: %ld (the kernel took the CPU away)\\n", ru.ru_nivcsw);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread chuyen-ngu-canh.c -o chuyen-ngu-canh &amp;&amp; taskset -c 0 ./chuyen-ngu-canh<br>
round trips &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 100000 (= 200000 process switches)<br>
total time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 342 ms<br>
one switch (+ 1 syscall): 1.71 us<br>
child, voluntary switches &nbsp;: 61047 (it blocked in read)<br>
child, involuntary switches: 38962 (the kernel took the CPU away)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>About two microseconds per switch, including the system call — thousands of instructions. The kernel's own accounting (the child's voluntary + involuntary switches) adds up to the 100 000 rounds. Cheap enough to do hundreds of times per second, too expensive to do millions of times: that is why the quantum is milliseconds, not microseconds (slide 62).</p>
<p class="meo">🧠 Context switch = save (registers → old PCB), choose (scheduler), restore (new PCB → registers, change the memory map). Old lesson 2.3 lists exactly these steps; the memory-map change is why switching between processes costs more than switching between threads of one process.</p>`,
        `<p class="y-chinh">🎯 Hình 2-5: việc tầng thấp nhất của HĐH làm khi có ngắt — (1) phần cứng đẩy bộ đếm chương trình v.v. vào ngăn xếp; (2) phần cứng nạp PC mới từ vector ngắt; (3) một thủ tục hợp ngữ lưu các thanh ghi; (4) nó dựng một ngăn xếp mới; (5) dịch vụ ngắt viết bằng C chạy (thường là đọc và đệm dữ liệu vào); (6) bộ lập lịch quyết định tiến trình nào chạy tiếp; (7) thủ tục C trả về mã hợp ngữ; (8) thủ tục hợp ngữ khởi động tiến trình hiện hành mới.</p>
<p>Bước 1–2 do chính CPU làm; <strong>vector ngắt (interrupt vector)</strong> là bảng địa chỉ các trình xử lý, mỗi thiết bị một ô. Bước 3–4 phải viết bằng hợp ngữ, vì C không nói được "lưu mọi thanh ghi" hay "đổi ngăn xếp". Ngắt vừa làm một tiến trình đang bị chặn trở nên sẵn sàng (tiến trình đang chờ khối đĩa này), nên ở bước 6 bộ lập lịch có thể chọn nó thay vì tiến trình vừa bị ngắt — đó là một <strong>lần chuyển tiến trình</strong> (còn gọi là chuyển ngữ cảnh, context switch).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/11308a909a5e535c2af157c3ae51b2e9d702ada7.svg" alt="Hình 2-5 dạng tuần tự: một ngắt tới khi A đang chạy, và bộ lập lịch có thể trao CPU cho B" loading="lazy" /><p class="chu-thich">🧩 Hình 2-5 dạng tuần tự: một ngắt tới khi A đang chạy, và bộ lập lịch có thể trao CPU cho B</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 2-5 dạng tuần tự: một ngắt tới lúc tiến trình A đang chạy; bộ lập lịch có thể chọn tiến trình B
participant "Process A\\n(user mode)" as A
participant "CPU hardware" as HW
participant "Assembly stub\\n(kernel)" as ASM
participant "C interrupt service\\n(driver, kernel)" as C
participant "Scheduler\\n(kernel)" as S
participant "Process B\\n(user mode)" as B
A -&gt; HW : running ... a device raises an interrupt
HW -&gt; HW : 1. push PC, PSW (and a few registers) on the stack
HW -&gt; ASM : 2. load new PC from the interrupt vector
ASM -&gt; ASM : 3. save all registers into A's process table entry
ASM -&gt; ASM : 4. set up a new (kernel) stack
ASM -&gt; C : 5. call the C interrupt service
C -&gt; C : read and buffer the input,\\nmark the waiting process READY
C -&gt; S : 6. scheduler decides who runs next
S --&gt; ASM : 7. return to the assembly code
ASM -&gt; B : 8. load B's registers and memory map, start B
note over A, B : If the scheduler picks A again, step 8 simply resumes A — A never notices the interrupt.
@enduml</code></pre></details>
<p>➕ Một lần chuyển tốn bao nhiêu? Hai tiến trình trên <strong>một</strong> lõi tung hứng một byte qua hai pipe; mỗi lần <code>read</code> trên ống rỗng làm bên đọc bị chặn, nên nhân phải chuyển sang tiến trình kia:</p>
<pre><code class="language-c">// Một lần chuyển tiến trình đắt cỡ nào (slide 11)? Hai tiến trình trên MỘT lõi tung hứng một byte qua hai pipe
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;sys/resource.h&gt;

#define ROUNDS 100000

int main(void) {
    int ping[2], pong[2];
    char b = 'x';
    pipe(ping);
    pipe(pong);
    if (fork() == 0) {                          // con: chờ một byte, gửi trả lại
        for (int i = 0; i &lt; ROUNDS; i++) {
            read(ping[0], &amp;b, 1);               // bị chặn -&gt; nhân chuyển sang cha
            write(pong[1], &amp;b, 1);
        }
        exit(0);
    }
    struct timespec s, e;
    clock_gettime(CLOCK_MONOTONIC, &amp;s);
    for (int i = 0; i &lt; ROUNDS; i++) {
        write(ping[1], &amp;b, 1);
        read(pong[0], &amp;b, 1);                   // bị chặn -&gt; chuyển sang con
    }
    clock_gettime(CLOCK_MONOTONIC, &amp;e);
    struct rusage ru;
    wait4(-1, NULL, 0, &amp;ru);                    // tài nguyên con đã dùng
    double ns = ((e.tv_sec - s.tv_sec) * 1e9 + (e.tv_nsec - s.tv_nsec));
    printf("round trips             : %d (= %d process switches)\\n", ROUNDS, 2 * ROUNDS);
    printf("total time              : %.0f ms\\n", ns / 1e6);
    printf("one switch (+ 1 syscall): %.2f us\\n", ns / (2.0 * ROUNDS) / 1e3);
    printf("child, voluntary switches  : %ld (it blocked in read)\\n", ru.ru_nvcsw);
    printf("child, involuntary switches: %ld (the kernel took the CPU away)\\n", ru.ru_nivcsw);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread chuyen-ngu-canh.c -o chuyen-ngu-canh &amp;&amp; taskset -c 0 ./chuyen-ngu-canh<br>
round trips &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 100000 (= 200000 process switches)<br>
total time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 342 ms<br>
one switch (+ 1 syscall): 1.71 us<br>
child, voluntary switches &nbsp;: 61047 (it blocked in read)<br>
child, involuntary switches: 38962 (the kernel took the CPU away)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Khoảng hai micro-giây mỗi lần chuyển, kể cả lời gọi hệ thống — hàng nghìn lệnh máy. Sổ sách của chính nhân (số lần chuyển tự nguyện + không tự nguyện của tiến trình con) cộng lại đúng 100 000 vòng. Đủ rẻ để làm hàng trăm lần mỗi giây, quá đắt để làm hàng triệu lần: vì thế lượng tử tính bằng mili-giây chứ không phải micro-giây (slide 62).</p>
<p class="meo">🧠 Chuyển ngữ cảnh = lưu (thanh ghi → PCB cũ), chọn (bộ lập lịch), khôi phục (PCB mới → thanh ghi, đổi bản đồ bộ nhớ). Bài cũ 2.3 liệt kê đúng các bước này; việc đổi bản đồ bộ nhớ là lý do chuyển giữa hai tiến trình đắt hơn chuyển giữa hai luồng của cùng một tiến trình.</p>`],
      [12, 'Modeling Multiprogramming',
        `<p class="y-chinh">🎯 Figure 2-6: if a process spends a fraction <em>p</em> of its time waiting for I/O, and <em>n</em> processes are in memory, the CPU is idle only when all <em>n</em> wait at once, with probability pⁿ. So <strong>CPU utilization = 1 − pⁿ</strong>, where <em>n</em> is the <strong>degree of multiprogramming</strong>.</p>
<p>The curves: with 20% I/O wait, two or three processes already keep the CPU almost fully busy; with 80% I/O wait (typical of interactive or database-heavy programs) you need about ten processes to reach 90%. The model is approximate — it assumes the processes are independent, which they are not on one CPU (if three are ready, only one runs) — but it is good enough to predict the effect of buying memory.</p>
<p>➕ The book's worked example, computed by the simulator: 8 GB of RAM, the OS takes 2 GB, each user program 2 GB, 80% I/O wait.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/cfd61ad801f7b211002904f9e594111cc99579d0.svg" alt="The book's example: each extra 8 GB of RAM lets more programs stay in memory, but the gain shrinks" loading="lazy" /><p class="chu-thich">🧮 The book's example: each extra 8 GB of RAM lets more programs stay in memory, but the gain shrinks</p></div>
<p>Computed: n = 3 ⇒ 1 − 0.8³ = 48.8% · n = 7 ⇒ 79% · n = 11 ⇒ 91.4%.</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const P = 0.8;                                  // fraction of time a process waits for I/O
const HE_DIEU_HANH = 2, MOI_CT = 2;             // GB taken by the OS, GB per user program
const soChuongTrinh = (gb) =&gt; Math.floor((gb - HE_DIEU_HANH) / MOI_CT);
const hieuSuat = (n) =&gt; 1 - P ** n;             // CPU utilization = 1 − p^n</code></pre></details>
<p>Three programs fit → 1 − 0.8³ ≈ 49%. Another 8 GB → seven programs → 79%: +30 points of throughput for the money. Another 8 GB → eleven programs → 91%: only +12. Lesson 1.A (slide 10) has the full curve of Figure 2-6, and exercise 6 of lesson 1.C the reverse question ("how many processes to reach 90%?").</p>
<p class="pitfall">⚠️ FE1#22 asks what happens to CPU utilization "if the degree of multiprogramming is increased": <strong>increase first, then decrease</strong>. The 1 − pⁿ curve alone only rises; the later fall comes from memory — too many processes for the RAM cause constant page faults (thrashing, Chapter 3). Read whether the question is about the model or about a real system.</p>`,
        `<p class="y-chinh">🎯 Hình 2-6: nếu một tiến trình dành tỉ lệ <em>p</em> thời gian để chờ I/O, và có <em>n</em> tiến trình trong bộ nhớ, thì CPU chỉ rảnh khi cả <em>n</em> cùng chờ, với xác suất pⁿ. Vậy <strong>hiệu suất CPU = 1 − pⁿ</strong>, trong đó <em>n</em> là <strong>mức độ đa chương trình (degree of multiprogramming)</strong>.</p>
<p>Đọc các đường cong: chờ I/O 20% thì hai, ba tiến trình đã giữ CPU gần như bận hết; chờ I/O 80% (thường gặp ở chương trình tương tác hay chương trình làm việc nhiều với cơ sở dữ liệu) thì cần khoảng mười tiến trình mới đạt 90%. Mô hình chỉ gần đúng — nó giả sử các tiến trình độc lập, điều không đúng trên một CPU (nếu ba tiến trình cùng sẵn sàng, chỉ một chạy) — nhưng đủ tốt để dự đoán tác dụng của việc mua thêm bộ nhớ.</p>
<p>➕ Ví dụ có lời giải của sách, do bộ mô phỏng tính: RAM 8 GB, HĐH chiếm 2 GB, mỗi chương trình người dùng 2 GB, chờ I/O 80%.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d457b2fa4ca620f8c8dffcd9f96f27720825e729.svg" alt="Ví dụ của sách: mỗi 8 GB RAM thêm cho nhiều chương trình nằm trong bộ nhớ hơn, nhưng phần lợi nhỏ dần" loading="lazy" /><p class="chu-thich">🧮 Ví dụ của sách: mỗi 8 GB RAM thêm cho nhiều chương trình nằm trong bộ nhớ hơn, nhưng phần lợi nhỏ dần</p></div>
<p>Máy tính ra: n = 3 ⇒ 1 − 0,8³ = 48.8% · n = 7 ⇒ 79% · n = 11 ⇒ 91.4%.</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const P = 0.8;                                  // fraction of time a process waits for I/O
const HE_DIEU_HANH = 2, MOI_CT = 2;             // GB taken by the OS, GB per user program
const soChuongTrinh = (gb) =&gt; Math.floor((gb - HE_DIEU_HANH) / MOI_CT);
const hieuSuat = (n) =&gt; 1 - P ** n;             // CPU utilization = 1 − p^n</code></pre></details>
<p>Vừa ba chương trình → 1 − 0,8³ ≈ 49%. Thêm 8 GB → bảy chương trình → 79%: thêm 30 điểm thông lượng cho số tiền bỏ ra. Thêm 8 GB nữa → mười một chương trình → 91%: chỉ thêm 12. Bài 1.A (slide 10) có trọn đường cong của Hình 2-6, và bài tập 6 của bài 1.C có câu hỏi ngược lại ("cần bao nhiêu tiến trình để đạt 90%?").</p>
<p class="pitfall">⚠️ FE1#22 hỏi hiệu suất CPU thay đổi thế nào "khi tăng mức độ đa chương trình": <strong>tăng trước, rồi giảm</strong>. Riêng đường 1 − pⁿ thì chỉ đi lên; phần giảm về sau đến từ bộ nhớ — quá nhiều tiến trình so với RAM gây lỗi trang liên tục (thrashing, Chương 3). Đọc kỹ câu hỏi nói về mô hình hay về hệ thống thật.</p>`],
      [13, 'Thread Usage (1)',
        `<p class="y-chinh">🎯 Figure 2-7: a <strong>word processor with three threads</strong> — one interacts with the user (keyboard), one reformats the document in the background, one saves it to disk periodically. All three work on the <em>same</em> document in memory.</p>
<p>A <strong>thread</strong> is a flow of execution inside a process: its own program counter, registers and stack, but sharing the process's memory and open files. Why not three processes? Because the three activities must see the same document: with three processes they would need shared memory or messages; with threads they simply share it. The book's story: the user deletes one sentence on page 1 of an 800-page book, then jumps to page 600. With one thread the program would freeze while it reformats 600 pages; with a background reformatting thread, the work starts as soon as the sentence is deleted, and the keyboard thread stays responsive.</p>
<p>➕ The three reasons the book gives for threads, which you will repeat in interviews: (1) many applications have several activities, some of which <strong>block</strong> — threads let the others continue; (2) threads are <strong>lighter</strong> than processes — 10–100 times faster to create, because no new address space is built; (3) when activities do both computing and I/O, threads let them <strong>overlap</strong>; and on multicore CPUs threads give <strong>real parallelism</strong>.</p>
<p class="meo">🧠 Process = a house (address space, files, rooms). Threads = the people living in it: each walks around on their own (own PC, own stack), but they share the kitchen and the fridge (memory) — and fight over it if they don't coordinate (2.B).</p>`,
        `<p class="y-chinh">🎯 Hình 2-7: một <strong>trình soạn thảo văn bản có ba luồng</strong> — một luồng giao tiếp với người dùng (bàn phím), một luồng định dạng lại tài liệu ở hậu cảnh, một luồng định kỳ lưu xuống đĩa. Cả ba làm việc trên <em>cùng</em> một tài liệu trong bộ nhớ.</p>
<p><strong>Luồng (thread)</strong> là một dòng thực thi bên trong tiến trình: có bộ đếm chương trình, thanh ghi và ngăn xếp riêng, nhưng dùng chung bộ nhớ và các tệp đang mở của tiến trình. Sao không dùng ba tiến trình? Vì ba việc phải thấy cùng một tài liệu: với ba tiến trình thì cần bộ nhớ dùng chung hoặc thông điệp; với luồng thì chúng dùng chung sẵn. Câu chuyện của sách: người dùng xoá một câu ở trang 1 của cuốn sách 800 trang, rồi nhảy tới trang 600. Chỉ có một luồng thì chương trình đứng hình trong lúc định dạng lại 600 trang; có luồng định dạng hậu cảnh thì việc đó bắt đầu ngay khi câu bị xoá, còn luồng bàn phím vẫn phản hồi nhanh.</p>
<p>➕ Ba lý do sách đưa ra cho luồng, thứ bạn sẽ nhắc lại khi phỏng vấn: (1) nhiều ứng dụng có nhiều việc, một số việc bị <strong>chặn</strong> — luồng cho các việc khác chạy tiếp; (2) luồng <strong>nhẹ</strong> hơn tiến trình — tạo nhanh hơn 10–100 lần, vì không phải dựng không gian địa chỉ mới; (3) khi các việc vừa tính toán vừa I/O, luồng cho chúng <strong>chồng lên nhau</strong>; và trên CPU đa lõi, luồng cho <strong>song song thật</strong>.</p>
<p class="meo">🧠 Tiến trình = một ngôi nhà (không gian địa chỉ, tệp, các phòng). Luồng = những người sống trong đó: mỗi người tự đi lại (PC riêng, ngăn xếp riêng), nhưng dùng chung bếp và tủ lạnh (bộ nhớ) — và giành nhau nếu không phối hợp (2.B).</p>`],
      [14, 'Thread Usage (2)',
        `<p class="y-chinh">🎯 Figure 2-8: a <strong>multithreaded web server</strong>. One <strong>dispatcher thread</strong> reads incoming requests from the network; for each request it picks an idle (blocked) <strong>worker thread</strong> and hands it the request. The worker looks in a shared <strong>web page cache</strong>; if the page is not there, it reads it from disk.</p>
<p>The design works because of blocking: while one worker waits for the disk (blocked, slide 7), the CPU runs the dispatcher or other workers, so the server keeps accepting and answering requests. The cache lives in the process's memory, and every worker can read it — that is why these are threads and not processes. The figure also shows the user/kernel split: all threads are in user space, the network connection enters through the kernel.</p>
<p>➕ The same design, compiled and run: one dispatcher, three workers, a work queue and a cache of pages. Eight requests arrive 10 ms apart; reading a page from "disk" takes 50 ms:</p>
<pre><code class="language-c">// Figures 2-8 and 2-9 in C: one dispatcher thread, three worker threads, a work queue and a web page cache
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;pthread.h&gt;
#include &lt;unistd.h&gt;

#define REQUESTS 8
const char *wanted[REQUESTS] = {"/", "/a", "/", "/b", "/a", "/", "/c", "/b"};   // incoming requests

int queue[REQUESTS], head = 0, tail = 0;              // the work queue
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t has_work = PTHREAD_COND_INITIALIZER;
char cache[8][8]; int cached = 0, disk_reads = 0;     // the shared web page cache
char result[REQUESTS][64];

static int in_cache(const char *page) {
    for (int i = 0; i &lt; cached; i++) if (!strcmp(cache[i], page)) return 1;
    return 0;
}

void *worker(void *arg) {                             // Figure 2-9(b)
    int me = (int)(long)arg;
    for (;;) {
        pthread_mutex_lock(&amp;m);
        while (head == tail) pthread_cond_wait(&amp;has_work, &amp;m);   // wait_for_work(&amp;buf)
        int r = queue[head++];
        int hit = in_cache(wanted[r]);                // look_for_page_in_cache
        pthread_mutex_unlock(&amp;m);
        if (!hit) {
            usleep(50 * 1000);                        // read_page_from_disk: this worker BLOCKS, the others go on
            pthread_mutex_lock(&amp;m);
            if (!in_cache(wanted[r])) strcpy(cache[cached++], wanted[r]);
            disk_reads++;
            pthread_mutex_unlock(&amp;m);
        }
        snprintf(result[r], 64, "page %-3s by worker %d (%s)", wanted[r], me, hit ? "cache hit" : "read from disk");
    }
}

int main(void) {
    pthread_t w[3];
    for (long i = 0; i &lt; 3; i++) pthread_create(&amp;w[i], NULL, worker, (void *)i);
    for (int r = 0; r &lt; REQUESTS; r++) {              // Figure 2-9(a): the dispatcher
        usleep(10 * 1000);                            // get_next_request: a request arrives every 10 ms
        pthread_mutex_lock(&amp;m);
        queue[tail++] = r;                            // handoff_work
        pthread_cond_signal(&amp;has_work);
        pthread_mutex_unlock(&amp;m);
    }
    sleep(1);
    for (int r = 0; r &lt; REQUESTS; r++) printf("request %d %s\\n", r, result[r]);
    printf("disk reads: %d (4 different pages)\\n", disk_reads);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dieu-phoi.c -o dieu-phoi &amp;&amp; ./dieu-phoi<br>
request 0 page / &nbsp;&nbsp;by worker 0 (read from disk)<br>
request 1 page /a &nbsp;by worker 1 (read from disk)<br>
request 2 page / &nbsp;&nbsp;by worker 2 (read from disk)<br>
request 3 page /b &nbsp;by worker 0 (read from disk)<br>
request 4 page /a &nbsp;by worker 1 (cache hit)<br>
request 5 page / &nbsp;&nbsp;by worker 1 (cache hit)<br>
request 6 page /c &nbsp;by worker 1 (read from disk)<br>
request 7 page /b &nbsp;by worker 2 (read from disk)<br>
disk reads: 6 (4 different pages)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Different workers took the requests in turn while others were blocked on the "disk". Some requests for an already-requested page were still read from disk: the first worker had not finished loading it yet — a real server would make later workers wait for the in-flight read. Later requests hit the cache. (The code is printed in full; slide 15 walks through its two loops.)</p>
<div class="callout">🧭 <strong>On a real server:</strong> this is exactly Tomcat inside a Spring Boot application: an acceptor/poller thread receives connections and a pool of worker threads (<code>http-nio-8080-exec-1</code>, <code>-2</code>, …) runs your controllers. The pool's maximum is 200 by default (<code>server.tomcat.threads.max</code>). When all 200 workers block on a slow database, request 201 waits in the queue — the most common "the API is slow but the CPU is idle" incident.</div>`,
        `<p class="y-chinh">🎯 Hình 2-8: một <strong>máy chủ web đa luồng</strong>. Một <strong>luồng điều phối (dispatcher)</strong> đọc yêu cầu từ mạng; với mỗi yêu cầu nó chọn một <strong>luồng thợ (worker)</strong> đang rảnh (đang bị chặn) và giao yêu cầu cho nó. Luồng thợ tìm trong <strong>bộ đệm trang web (web page cache)</strong> dùng chung; nếu trang không có ở đó, nó đọc từ đĩa.</p>
<p>Thiết kế này chạy được là nhờ cơ chế bị chặn: trong lúc một luồng thợ chờ đĩa (bị chặn, slide 7), CPU chạy luồng điều phối hoặc các luồng thợ khác, nên máy chủ vẫn nhận và trả lời yêu cầu. Bộ đệm nằm trong bộ nhớ của tiến trình, và luồng thợ nào cũng đọc được — đó là lý do chúng là luồng chứ không phải tiến trình. Hình cũng cho thấy ranh giới người dùng/nhân: mọi luồng ở không gian người dùng, kết nối mạng đi vào qua nhân.</p>
<p>➕ Cùng thiết kế đó, biên dịch và chạy thật: một luồng điều phối, ba luồng thợ, một hàng đợi việc và một bộ đệm trang. Tám yêu cầu tới cách nhau 10 ms; đọc một trang từ "đĩa" mất 50 ms:</p>
<pre><code class="language-c">// Hình 2-8 và 2-9 bằng C: một luồng điều phối, ba luồng thợ, một hàng đợi việc và một bộ đệm trang web
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;pthread.h&gt;
#include &lt;unistd.h&gt;

#define REQUESTS 8
const char *wanted[REQUESTS] = {"/", "/a", "/", "/b", "/a", "/", "/c", "/b"};   // các yêu cầu đến

int queue[REQUESTS], head = 0, tail = 0;              // hàng đợi việc
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t has_work = PTHREAD_COND_INITIALIZER;
char cache[8][8]; int cached = 0, disk_reads = 0;     // bộ đệm trang dùng chung
char result[REQUESTS][64];

static int in_cache(const char *page) {
    for (int i = 0; i &lt; cached; i++) if (!strcmp(cache[i], page)) return 1;
    return 0;
}

void *worker(void *arg) {                             // Hình 2-9(b)
    int me = (int)(long)arg;
    for (;;) {
        pthread_mutex_lock(&amp;m);
        while (head == tail) pthread_cond_wait(&amp;has_work, &amp;m);   // chờ việc
        int r = queue[head++];
        int hit = in_cache(wanted[r]);                // tìm trang trong bộ đệm
        pthread_mutex_unlock(&amp;m);
        if (!hit) {
            usleep(50 * 1000);                        // đọc trang từ đĩa: luồng thợ này BỊ CHẶN, các luồng khác vẫn chạy
            pthread_mutex_lock(&amp;m);
            if (!in_cache(wanted[r])) strcpy(cache[cached++], wanted[r]);
            disk_reads++;
            pthread_mutex_unlock(&amp;m);
        }
        snprintf(result[r], 64, "page %-3s by worker %d (%s)", wanted[r], me, hit ? "cache hit" : "read from disk");
    }
}

int main(void) {
    pthread_t w[3];
    for (long i = 0; i &lt; 3; i++) pthread_create(&amp;w[i], NULL, worker, (void *)i);
    for (int r = 0; r &lt; REQUESTS; r++) {              // Hình 2-9(a): luồng điều phối
        usleep(10 * 1000);                            // mỗi 10 ms có một yêu cầu đến
        pthread_mutex_lock(&amp;m);
        queue[tail++] = r;                            // giao việc
        pthread_cond_signal(&amp;has_work);
        pthread_mutex_unlock(&amp;m);
    }
    sleep(1);
    for (int r = 0; r &lt; REQUESTS; r++) printf("request %d %s\\n", r, result[r]);
    printf("disk reads: %d (4 different pages)\\n", disk_reads);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dieu-phoi.c -o dieu-phoi &amp;&amp; ./dieu-phoi<br>
request 0 page / &nbsp;&nbsp;by worker 0 (read from disk)<br>
request 1 page /a &nbsp;by worker 1 (read from disk)<br>
request 2 page / &nbsp;&nbsp;by worker 2 (read from disk)<br>
request 3 page /b &nbsp;by worker 0 (read from disk)<br>
request 4 page /a &nbsp;by worker 1 (cache hit)<br>
request 5 page / &nbsp;&nbsp;by worker 1 (cache hit)<br>
request 6 page /c &nbsp;by worker 1 (read from disk)<br>
request 7 page /b &nbsp;by worker 2 (read from disk)<br>
disk reads: 6 (4 different pages)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Các luồng thợ khác nhau lần lượt nhận yêu cầu trong lúc những luồng khác bị chặn chờ "đĩa". Một vài yêu cầu tới trang đã có người hỏi vẫn phải đọc đĩa: luồng thợ đầu tiên chưa nạp xong — máy chủ thật sẽ cho các luồng sau chờ lần đọc đang dở. Những yêu cầu sau đó trúng bộ đệm. (Mã được in đầy đủ; slide 15 đi qua hai vòng lặp của nó.)</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> đây chính là Tomcat bên trong một ứng dụng Spring Boot: một luồng acceptor/poller nhận kết nối, một bể luồng thợ (<code>http-nio-8080-exec-1</code>, <code>-2</code>, …) chạy các controller của bạn. Mặc định bể tối đa 200 luồng (<code>server.tomcat.threads.max</code>). Khi cả 200 luồng thợ bị chặn chờ một cơ sở dữ liệu chậm, yêu cầu thứ 201 phải chờ trong hàng — sự cố "API chậm mà CPU rảnh" hay gặp nhất.</div>`],
      [15, 'Thread Usage (3)',
        `<p class="y-chinh">🎯 Figure 2-9: the rough code of Figure 2-8. (a) <strong>Dispatcher</strong>: <code>while (TRUE) { get_next_request(&amp;buf); handoff_work(&amp;buf); }</code>. (b) <strong>Worker</strong>: <code>while (TRUE) { wait_for_work(&amp;buf); look_for_page_in_cache(&amp;buf, &amp;page); if (page_not_in_cache(&amp;page)) read_page_from_disk(&amp;buf, &amp;page); return_page(&amp;page); }</code>.</p>
<p>Notice how <em>simple</em> each loop is: the worker is written as plain sequential code — "wait, look, maybe read, answer" — even though the disk read blocks. The blocking is not a problem because other threads keep the server going. The book's key sentence: threads make it possible to keep the idea of <strong>sequential processes that make blocking calls</strong> and still achieve parallelism.</p>
<p>➕ In the C program of slide 14, <code>wait_for_work</code> is a <strong>condition variable</strong> wait (<code>pthread_cond_wait</code>, slide 41), <code>handoff_work</code> puts the request into a queue protected by a <strong>mutex</strong> and signals one worker, and <code>read_page_from_disk</code> is a 50 ms <code>usleep</code>. Here are the two loops again, so you can map each line of Figure 2-9 — first the dispatcher (a), then the worker (b):</p>
<pre class="trich"><code class="language-c">for (int r = 0; r &lt; REQUESTS; r++) {              // Figure 2-9(a): the dispatcher
    usleep(10 * 1000);                            // get_next_request: a request arrives every 10 ms
    pthread_mutex_lock(&amp;m);
    queue[tail++] = r;                            // handoff_work
    pthread_cond_signal(&amp;has_work);
    pthread_mutex_unlock(&amp;m);
}</code></pre>
<pre class="trich"><code class="language-c">void *worker(void *arg) {                             // Figure 2-9(b)
    int me = (int)(long)arg;
    for (;;) {
        pthread_mutex_lock(&amp;m);
        while (head == tail) pthread_cond_wait(&amp;has_work, &amp;m);   // wait_for_work(&amp;buf)
        int r = queue[head++];
        int hit = in_cache(wanted[r]);                // look_for_page_in_cache
        pthread_mutex_unlock(&amp;m);
        if (!hit) {
            usleep(50 * 1000);                        // read_page_from_disk: this worker BLOCKS, the others go on
            pthread_mutex_lock(&amp;m);
            if (!in_cache(wanted[r])) strcpy(cache[cached++], wanted[r]);
            disk_reads++;
            pthread_mutex_unlock(&amp;m);
        }
        snprintf(result[r], 64, "page %-3s by worker %d (%s)", wanted[r], me, hit ? "cache hit" : "read from disk");
    }
}</code></pre>
<p>The mutex and the condition variable appear because the queue and the cache are shared — exactly the synchronization problems of lesson 2.B. Figure 2-9 hides them; a real program cannot.</p>
<p class="meo">🧠 "Dispatcher hands off, worker blocks" = the producer–consumer pattern (slides 35–44): the dispatcher produces requests, workers consume them, the queue is the bounded buffer.</p>`,
        `<p class="y-chinh">🎯 Hình 2-9: mã phác thảo của Hình 2-8. (a) <strong>Luồng điều phối</strong>: <code>while (TRUE) { get_next_request(&amp;buf); handoff_work(&amp;buf); }</code>. (b) <strong>Luồng thợ</strong>: <code>while (TRUE) { wait_for_work(&amp;buf); look_for_page_in_cache(&amp;buf, &amp;page); if (page_not_in_cache(&amp;page)) read_page_from_disk(&amp;buf, &amp;page); return_page(&amp;page); }</code>.</p>
<p>Để ý mỗi vòng lặp <em>đơn giản</em> cỡ nào: luồng thợ được viết như mã tuần tự thông thường — "chờ, tìm, có thể đọc, trả lời" — dù việc đọc đĩa bị chặn. Bị chặn không phải vấn đề vì các luồng khác vẫn giữ cho máy chủ chạy. Câu then chốt của sách: luồng cho phép giữ ý tưởng <strong>các tiến trình tuần tự gọi lời gọi chặn</strong> mà vẫn đạt được song song.</p>
<p>➕ Trong chương trình C của slide 14, <code>wait_for_work</code> là chờ trên một <strong>biến điều kiện (condition variable)</strong> (<code>pthread_cond_wait</code>, slide 41), <code>handoff_work</code> đặt yêu cầu vào hàng đợi được bảo vệ bằng <strong>mutex</strong> rồi báo cho một luồng thợ, còn <code>read_page_from_disk</code> là một lệnh <code>usleep</code> 50 ms. Đây lại là hai vòng lặp, để bạn đối chiếu từng dòng của Hình 2-9 — trước là luồng điều phối (a), rồi luồng thợ (b):</p>
<pre class="trich"><code class="language-c">for (int r = 0; r &lt; REQUESTS; r++) {              // Hình 2-9(a): luồng điều phối
    usleep(10 * 1000);                            // mỗi 10 ms có một yêu cầu đến
    pthread_mutex_lock(&amp;m);
    queue[tail++] = r;                            // giao việc
    pthread_cond_signal(&amp;has_work);
    pthread_mutex_unlock(&amp;m);
}</code></pre>
<pre class="trich"><code class="language-c">void *worker(void *arg) {                             // Hình 2-9(b)
    int me = (int)(long)arg;
    for (;;) {
        pthread_mutex_lock(&amp;m);
        while (head == tail) pthread_cond_wait(&amp;has_work, &amp;m);   // chờ việc
        int r = queue[head++];
        int hit = in_cache(wanted[r]);                // tìm trang trong bộ đệm
        pthread_mutex_unlock(&amp;m);
        if (!hit) {
            usleep(50 * 1000);                        // đọc trang từ đĩa: luồng thợ này BỊ CHẶN, các luồng khác vẫn chạy
            pthread_mutex_lock(&amp;m);
            if (!in_cache(wanted[r])) strcpy(cache[cached++], wanted[r]);
            disk_reads++;
            pthread_mutex_unlock(&amp;m);
        }
        snprintf(result[r], 64, "page %-3s by worker %d (%s)", wanted[r], me, hit ? "cache hit" : "read from disk");
    }
}</code></pre>
<p>Mutex và biến điều kiện xuất hiện vì hàng đợi và bộ đệm là đồ dùng chung — đúng các bài toán đồng bộ của bài 2.B. Hình 2-9 giấu chúng đi; chương trình thật thì không giấu được.</p>
<p class="meo">🧠 "Điều phối giao việc, thợ bị chặn" = mẫu sản xuất–tiêu thụ (slide 35–44): luồng điều phối sản xuất yêu cầu, luồng thợ tiêu thụ chúng, hàng đợi là bộ đệm có giới hạn.</p>`],
      [16, 'Thread Usage (4)',
        `<p class="y-chinh">🎯 Figure 2-10: three ways to construct a server — <strong>threads</strong>: parallelism, blocking system calls; <strong>single-threaded process</strong>: no parallelism, blocking system calls; <strong>finite-state machine</strong>: parallelism, nonblocking system calls, interrupts.</p>
<p>The single-threaded server handles one request at a time: while it waits for the disk, the CPU idles and other requests wait — simple but slow. The finite-state machine keeps one thread but never blocks: it starts an I/O with a <em>nonblocking</em> call, records the state of that request in a table, and goes on to the next event; when the I/O completes (a signal or interrupt), it looks up the saved state and continues. It is fast but the programming is hard: the "sequential process" disappears, every request becomes a set of callbacks. Threads give both: sequential code <em>and</em> parallelism.</p>
<p>➕ The two modern descendants, measured. Java 21 can use a pool of 200 OS threads (the Tomcat model) or one <strong>virtual thread</strong> per request:</p>
<pre><code class="language-java">// Slides 16 and 24 in Java 21: 2,000 "requests" that each wait 100 ms for I/O — a pool of 200 OS threads vs virtual threads
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class LuongAo {
    static void request() {
        try { Thread.sleep(100); } catch (InterruptedException e) { }   // a blocking call, like JDBC or HTTP
    }

    static long run(ExecutorService pool) throws Exception {
        long t0 = System.nanoTime();
        try (pool) {                                                      // close() waits for all tasks
            for (int i = 0; i &lt; 2000; i++) pool.submit(LuongAo::request);
        }
        return (System.nanoTime() - t0) / 1_000_000;
    }

    static String osThreads() throws Exception {
        return Files.readAllLines(Path.of("/proc/self/status")).stream()
                .filter(l -&gt; l.startsWith("Threads:")).findFirst().orElse("?").replaceAll("\\\\D+", "");
    }

    public static void main(String[] args) throws Exception {
        // like Tomcat's default (server.tomcat.threads.max = 200): one OS thread per request
        System.out.println("platform threads (pool of 200): " + run(Executors.newFixedThreadPool(200)) + " ms");
        // Java 21: one VIRTUAL thread per request, multiplexed onto a few OS threads (M:N)
        System.out.println("virtual threads (one per task) : " + run(Executors.newVirtualThreadPerTaskExecutor()) + " ms");
        Thread v = Thread.ofVirtual().start(() -&gt; System.out.println("inside a virtual thread: " + Thread.currentThread()));
        v.join();
        System.out.println("OS threads in this JVM now: " + osThreads());
    }
}</code></pre>
<div class="out">$ javac LuongAo.java &amp;&amp; java LuongAo<br>
platform threads (pool of 200): 1150 ms<br>
virtual threads (one per task) : 122 ms<br>
inside a virtual thread: VirtualThread[#2239]/runnable@ForkJoinPool-1-worker-4<br>
OS threads in this JVM now: 37</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>2 000 requests that each block for 100 ms take about ten rounds of 200 with a pool of OS threads, but almost a single round with virtual threads — because blocking a virtual thread does not block an OS thread (slide 24 explains how). And Node.js is the <strong>finite-state machine</strong> row of the table:</p>
<pre><code class="language-javascript">// The third row of Figure 2-10, the "finite-state machine": ONE thread, non-blocking calls, an event loop (Node.js)
const { isMainThread } = require('worker_threads');

const t0 = Date.now();
let done = 0;
for (let i = 0; i &lt; 1000; i++) {
  // start 1000 "I/O operations" (100 ms timers); nothing blocks, each one only registers a callback
  setTimeout(() =&gt; {
    done++;
    if (done === 1000) {
      console.log(&#96;all 1000 done after &#36;{Date.now() - t0} ms&#96;);
      console.log(&#96;OS threads running JavaScript: 1 (isMainThread = &#36;{isMainThread})&#96;);
    }
  }, 100);
}
console.log('loop finished in', Date.now() - t0, 'ms — now the event loop waits for events');</code></pre>
<div class="out">$ node vong-su-kien.js<br>
loop finished in 1 ms — now the event loop waits for events<br>
all 1000 done after 104 ms<br>
OS threads running JavaScript: 1 (isMainThread = true)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>One JavaScript thread started 1 000 timers without blocking, then the event loop handled their completions: all done after about 100 ms.</p>
<p class="pitfall">⚠️ FE3#7: "Which model supports parallel execution but may involve blocking system calls?" — <strong>Threads</strong>. Single-threaded: no parallelism. Finite-state machine: parallelism with <em>nonblocking</em> calls.</p>`,
        `<p class="y-chinh">🎯 Hình 2-10: ba cách dựng một máy chủ — <strong>luồng</strong>: có song song, lời gọi hệ thống chặn; <strong>tiến trình đơn luồng</strong>: không song song, lời gọi chặn; <strong>máy trạng thái hữu hạn (finite-state machine)</strong>: có song song, lời gọi không chặn, ngắt.</p>
<p>Máy chủ đơn luồng xử lý từng yêu cầu một: trong lúc nó chờ đĩa, CPU ngồi không và các yêu cầu khác phải đợi — đơn giản nhưng chậm. Máy trạng thái hữu hạn giữ một luồng nhưng không bao giờ bị chặn: nó khởi động I/O bằng lời gọi <em>không chặn</em>, ghi trạng thái của yêu cầu đó vào một bảng, rồi đi tiếp sang sự kiện kế; khi I/O xong (một tín hiệu hay ngắt), nó tra trạng thái đã lưu và làm tiếp. Nó nhanh nhưng lập trình khó: "tiến trình tuần tự" biến mất, mỗi yêu cầu thành một chuỗi hàm gọi lại (callback). Luồng cho cả hai: mã tuần tự <em>và</em> song song.</p>
<p>➕ Hai hậu duệ hiện đại, đo thật. Java 21 dùng được một bể 200 luồng HĐH (mô hình Tomcat) hoặc mỗi yêu cầu một <strong>luồng ảo (virtual thread)</strong>:</p>
<pre><code class="language-java">// Slide 16 và 24 bằng Java 21: 2.000 "yêu cầu", mỗi cái chờ I/O 100 ms — bể 200 luồng HĐH so với luồng ảo
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class LuongAo {
    static void request() {
        try { Thread.sleep(100); } catch (InterruptedException e) { }   // một lời gọi chặn, như JDBC hay HTTP
    }

    static long run(ExecutorService pool) throws Exception {
        long t0 = System.nanoTime();
        try (pool) {                                                      // close() đợi mọi tác vụ xong
            for (int i = 0; i &lt; 2000; i++) pool.submit(LuongAo::request);
        }
        return (System.nanoTime() - t0) / 1_000_000;
    }

    static String osThreads() throws Exception {
        return Files.readAllLines(Path.of("/proc/self/status")).stream()
                .filter(l -&gt; l.startsWith("Threads:")).findFirst().orElse("?").replaceAll("\\\\D+", "");
    }

    public static void main(String[] args) throws Exception {
        // như mặc định của Tomcat: một luồng HĐH cho mỗi yêu cầu
        System.out.println("platform threads (pool of 200): " + run(Executors.newFixedThreadPool(200)) + " ms");
        // Java 21: mỗi yêu cầu một luồng ẢO, dồn lên vài luồng HĐH (M:N)
        System.out.println("virtual threads (one per task) : " + run(Executors.newVirtualThreadPerTaskExecutor()) + " ms");
        Thread v = Thread.ofVirtual().start(() -&gt; System.out.println("inside a virtual thread: " + Thread.currentThread()));
        v.join();
        System.out.println("OS threads in this JVM now: " + osThreads());
    }
}</code></pre>
<div class="out">$ javac LuongAo.java &amp;&amp; java LuongAo<br>
platform threads (pool of 200): 1150 ms<br>
virtual threads (one per task) : 122 ms<br>
inside a virtual thread: VirtualThread[#2239]/runnable@ForkJoinPool-1-worker-4<br>
OS threads in this JVM now: 37</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>2 000 yêu cầu, mỗi cái bị chặn 100 ms, mất khoảng mười lượt 200 với bể luồng HĐH, nhưng gần như chỉ một lượt với luồng ảo — vì chặn một luồng ảo không chặn luồng HĐH nào (slide 24 giải thích vì sao). Còn Node.js chính là dòng <strong>máy trạng thái hữu hạn</strong> của bảng:</p>
<pre><code class="language-javascript">// Dòng thứ ba của Hình 2-10, "máy trạng thái hữu hạn": MỘT luồng, lời gọi không chặn, một vòng lặp sự kiện (Node.js)
const { isMainThread } = require('worker_threads');

const t0 = Date.now();
let done = 0;
for (let i = 0; i &lt; 1000; i++) {
  // khởi động 1000 "thao tác I/O" (đồng hồ 100 ms); không gì bị chặn, mỗi cái chỉ đăng ký một hàm gọi lại
  setTimeout(() =&gt; {
    done++;
    if (done === 1000) {
      console.log(&#96;all 1000 done after &#36;{Date.now() - t0} ms&#96;);
      console.log(&#96;OS threads running JavaScript: 1 (isMainThread = &#36;{isMainThread})&#96;);
    }
  }, 100);
}
console.log('loop finished in', Date.now() - t0, 'ms — now the event loop waits for events');</code></pre>
<div class="out">$ node vong-su-kien.js<br>
loop finished in 1 ms — now the event loop waits for events<br>
all 1000 done after 104 ms<br>
OS threads running JavaScript: 1 (isMainThread = true)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Một luồng JavaScript khởi động 1 000 đồng hồ mà không bị chặn, rồi vòng lặp sự kiện xử lý lúc chúng xong: tất cả xong sau khoảng 100 ms.</p>
<p class="pitfall">⚠️ FE3#7: "Mô hình nào có song song nhưng có thể dùng lời gọi hệ thống chặn?" — <strong>Threads</strong> (luồng). Đơn luồng: không song song. Máy trạng thái hữu hạn: song song với lời gọi <em>không chặn</em>.</p>`],
      [17, 'The Classical Thread Model (1)',
        `<p class="y-chinh">🎯 Figure 2-11: (a) three processes, each with one thread — three address spaces; (b) one process with three threads — one address space shared by three threads of control.</p>
<p>The process model separates two ideas that usually travel together: <strong>resource grouping</strong> (an address space with code and data, open files, child processes, signal handlers, accounting) and <strong>execution</strong> (a thread of control with a program counter, registers and a stack). A process groups resources; threads are the entities scheduled on the CPU. In (a) the three activities are unrelated programs that compete for resources; in (b) they are parts of the same job and cooperate closely. Having several threads in one process is called <strong>multithreading</strong>; on one CPU the threads take turns exactly like processes in Figure 2-1.</p>
<p>➕ Figure 2-11(b) as Linux shows it — one process with three extra threads, listed with <code>ps -L</code> (one line per thread):</p>
<pre><code class="language-c">// Figure 2-11(b): ONE process, three extra threads — what ps -L shows
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;pthread.h&gt;
#include &lt;unistd.h&gt;

pthread_barrier_t ready;

void *sleeper(void *arg) {
    pthread_barrier_wait(&amp;ready);
    sleep(2);                                 // stay alive while ps looks
    return NULL;
}

int main(void) {
    pthread_t t[3];
    char cmd[80];
    pthread_barrier_init(&amp;ready, NULL, 4);
    for (int i = 0; i &lt; 3; i++) pthread_create(&amp;t[i], NULL, sleeper, NULL);
    pthread_barrier_wait(&amp;ready);             // all three threads exist now
    printf("process ID (getpid) = the same for every thread of the process\\n");
    fflush(stdout);
    snprintf(cmd, sizeof cmd, "ps -L -o pid,lwp,nlwp,stat,comm -p %d", getpid());
    system(cmd);                              // PID = process, LWP = thread (kernel task)
    for (int i = 0; i &lt; 3; i++) pthread_join(t[i], NULL);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ps-luong.c -o ps-luong &amp;&amp; ./ps-luong<br>
process ID (getpid) = the same for every thread of the process<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;&nbsp;LWP NLWP STAT COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;4 Sl &nbsp;&nbsp;ps-luong<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;4 Sl &nbsp;&nbsp;ps-luong<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;4 Sl &nbsp;&nbsp;ps-luong<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;4 Sl &nbsp;&nbsp;ps-luong</div>
<p>Four lines, one <code>PID</code> (the process), four different <code>LWP</code> numbers (the threads — "light-weight process", the kernel's name for a thread) and <code>NLWP</code> = 4 threads in total. The first LWP equals the PID: that is the main thread. <code>Sl</code> = sleeping, multithreaded. In Linux each thread is a kernel task with its own ID, created by the same <code>clone</code> system call as a process, with flags that say "share the address space and the files".</p>
<p class="pitfall">⚠️ FE9#15: the main difference between a process and a thread — <strong>threads share the same memory space, processes do not</strong>. FE4#12 / FE7#12: threads share the memory space but have their own registers.</p>`,
        `<p class="y-chinh">🎯 Hình 2-11: (a) ba tiến trình, mỗi tiến trình một luồng — ba không gian địa chỉ; (b) một tiến trình với ba luồng — một không gian địa chỉ dùng chung cho ba dòng điều khiển.</p>
<p>Mô hình tiến trình tách hai ý vốn thường đi cùng nhau: <strong>gom tài nguyên</strong> (một không gian địa chỉ chứa mã và dữ liệu, tệp đang mở, tiến trình con, hàm xử lý tín hiệu, thông tin kế toán) và <strong>thực thi</strong> (một dòng điều khiển có bộ đếm chương trình, thanh ghi và ngăn xếp). Tiến trình gom tài nguyên; luồng là thực thể được lập lịch trên CPU. Ở (a) ba việc là ba chương trình không liên quan, tranh nhau tài nguyên; ở (b) chúng là các phần của cùng một công việc và hợp tác chặt chẽ. Có nhiều luồng trong một tiến trình gọi là <strong>đa luồng (multithreading)</strong>; trên một CPU các luồng thay phiên nhau y như các tiến trình ở Hình 2-1.</p>
<p>➕ Hình 2-11(b) theo cách Linux hiển thị — một tiến trình thêm ba luồng, liệt kê bằng <code>ps -L</code> (mỗi luồng một dòng):</p>
<pre><code class="language-c">// Hình 2-11(b): MỘT tiến trình, thêm ba luồng — ps -L cho thấy gì
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;pthread.h&gt;
#include &lt;unistd.h&gt;

pthread_barrier_t ready;

void *sleeper(void *arg) {
    pthread_barrier_wait(&amp;ready);
    sleep(2);                                 // sống tiếp trong lúc ps nhìn
    return NULL;
}

int main(void) {
    pthread_t t[3];
    char cmd[80];
    pthread_barrier_init(&amp;ready, NULL, 4);
    for (int i = 0; i &lt; 3; i++) pthread_create(&amp;t[i], NULL, sleeper, NULL);
    pthread_barrier_wait(&amp;ready);             // cả ba luồng giờ đã tồn tại
    printf("process ID (getpid) = the same for every thread of the process\\n");
    fflush(stdout);
    snprintf(cmd, sizeof cmd, "ps -L -o pid,lwp,nlwp,stat,comm -p %d", getpid());
    system(cmd);                              // PID = tiến trình, LWP = luồng (tác vụ của nhân)
    for (int i = 0; i &lt; 3; i++) pthread_join(t[i], NULL);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ps-luong.c -o ps-luong &amp;&amp; ./ps-luong<br>
process ID (getpid) = the same for every thread of the process<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;&nbsp;LWP NLWP STAT COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;4 Sl &nbsp;&nbsp;ps-luong<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;4 Sl &nbsp;&nbsp;ps-luong<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;4 Sl &nbsp;&nbsp;ps-luong<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;4 Sl &nbsp;&nbsp;ps-luong</div>
<p>Bốn dòng, một <code>PID</code> (tiến trình), bốn số <code>LWP</code> khác nhau (các luồng — "light-weight process", tên nhân gọi luồng) và <code>NLWP</code> = tổng cộng 4 luồng. LWP đầu tiên bằng PID: đó là luồng chính. <code>Sl</code> = đang ngủ, đa luồng. Trong Linux mỗi luồng là một tác vụ của nhân có ID riêng, được tạo bằng cùng lời gọi hệ thống <code>clone</code> như tiến trình, kèm các cờ nói "dùng chung không gian địa chỉ và tệp".</p>
<p class="pitfall">⚠️ FE9#15: khác biệt chính giữa tiến trình và luồng — <strong>các luồng dùng chung không gian bộ nhớ, các tiến trình thì không</strong>. FE4#12 / FE7#12: luồng dùng chung không gian bộ nhớ nhưng có thanh ghi riêng.</p>`],
      [18, 'The Classical Thread Model (2)',
        `<p class="y-chinh">🎯 Figure 2-12: <strong>per-process items</strong> (shared by all threads): address space, global variables, open files, child processes, pending alarms, signals and signal handlers, accounting information. <strong>Per-thread items</strong> (private): program counter, registers, stack, state.</p>
<p>Everything in the left column belongs to the process, so if one thread opens a file, the others can read it; if one thread changes a global variable, the others see the new value. There is <strong>no protection</strong> between threads of a process: a thread can read, write or even wipe out another thread's stack. The book's argument: protection is not needed, because the threads belong to one user and were written to cooperate. Each thread has its own state (running, ready, blocked) exactly like a process.</p>
<p>➕ Every row of the table tested in one program, plus the same experiment with <code>fork</code> for contrast:</p>
<pre><code class="language-c">// Figures 2-12 and 2-13: what threads of one process SHARE and what each keeps PRIVATE — compared with fork
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;pthread.h&gt;
#include &lt;unistd.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;sys/wait.h&gt;

int global = 0;                               // a global variable
int *heap;                                    // memory from malloc (the heap)
int fd;                                       // an open file
void *stack_of[2];                            // address of a local variable in each thread
pthread_barrier_t both;                       // keeps both threads alive at the same time
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

void *thread(void *arg) {
    int me = (int)(long)arg;
    int local = 100 + me;                     // lives on THIS thread's stack
    stack_of[me] = &amp;local;
    pthread_mutex_lock(&amp;m);
    global++;                                 // the same variable for everyone
    heap[me] = local;
    write(fd, me ? "B" : "A", 1);             // the same file offset for everyone
    pthread_mutex_unlock(&amp;m);
    pthread_barrier_wait(&amp;both);
    return NULL;
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    pthread_barrier_init(&amp;both, NULL, 2);
    heap = malloc(2 * sizeof(int));
    fd = open("shared.txt", O_CREAT | O_TRUNC | O_RDWR, 0644);
    pthread_t t[2];
    for (long i = 0; i &lt; 2; i++) pthread_create(&amp;t[i], NULL, thread, (void *)i);
    for (int i = 0; i &lt; 2; i++) pthread_join(t[i], NULL);
    printf("THREADS  global = %d (both increments seen)\\n", global);
    printf("THREADS  heap[0] = %d, heap[1] = %d (main sees what the threads wrote)\\n", heap[0], heap[1]);
    printf("THREADS  file offset = %ld (one shared offset, the file holds 2 bytes)\\n", (long)lseek(fd, 0, SEEK_CUR));
    printf("THREADS  the two stacks are %ld KiB apart (a separate stack each)\\n",
           labs((char *)stack_of[0] - (char *)stack_of[1]) / 1024);

    pthread_attr_t a; size_t size;
    pthread_attr_init(&amp;a);
    pthread_attr_getstacksize(&amp;a, &amp;size);
    printf("THREADS  default stack size of a new thread = %zu KiB\\n", size / 1024);

    if (fork() == 0) { global = 999; heap[0] = 999; exit(0); }   // a PROCESS changes its copies
    wait(NULL);
    printf("FORK     after the child wrote 999: global = %d, heap[0] = %d (copies, not shared)\\n", global, heap[0]);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread chung-rieng.c -o chung-rieng &amp;&amp; ./chung-rieng<br>
THREADS &nbsp;global = 2 (both increments seen)<br>
THREADS &nbsp;heap[0] = 100, heap[1] = 101 (main sees what the threads wrote)<br>
THREADS &nbsp;file offset = 2 (one shared offset, the file holds 2 bytes)<br>
THREADS &nbsp;the two stacks are 8256 KiB apart (a separate stack each)<br>
THREADS &nbsp;default stack size of a new thread = 8192 KiB<br>
FORK &nbsp;&nbsp;&nbsp;&nbsp;after the child wrote 999: global = 2, heap[0] = 100 (copies, not shared)</div>
<p>Threads: both increments of the global variable are visible; the heap is shared; both writes moved one shared file offset; but each thread's local variable sits on a different stack, about 8 MiB apart. Fork: the child changed its <em>copies</em> of the global variable and the heap, and the parent saw nothing — two processes, two address spaces.</p>
<p class="pitfall">⚠️ FE2#7: "Which is shared among threads of the same process?" — <strong>file descriptors, heap and global variables</strong>. Stack, program counter and CPU registers are per thread.</p>`,
        `<p class="y-chinh">🎯 Hình 2-12: <strong>các mục của tiến trình</strong> (mọi luồng dùng chung): không gian địa chỉ, biến toàn cục, tệp đang mở, tiến trình con, báo thức đang chờ, tín hiệu và hàm xử lý tín hiệu, thông tin kế toán. <strong>Các mục của từng luồng</strong> (riêng): bộ đếm chương trình, thanh ghi, ngăn xếp, trạng thái.</p>
<p>Mọi thứ ở cột trái thuộc về tiến trình, nên một luồng mở tệp thì các luồng khác đọc được; một luồng sửa biến toàn cục thì các luồng khác thấy giá trị mới. <strong>Không có bảo vệ</strong> giữa các luồng của một tiến trình: một luồng có thể đọc, ghi, thậm chí xoá sạch ngăn xếp của luồng khác. Lập luận của sách: không cần bảo vệ, vì các luồng thuộc cùng một người dùng và được viết ra để hợp tác. Mỗi luồng có trạng thái riêng (đang chạy, sẵn sàng, bị chặn) y như tiến trình.</p>
<p>➕ Từng dòng của bảng được kiểm trong một chương trình, cộng cùng thí nghiệm với <code>fork</code> để đối chiếu:</p>
<pre><code class="language-c">// Hình 2-12 và 2-13: các luồng của một tiến trình DÙNG CHUNG gì và mỗi luồng GIỮ RIÊNG gì — so với fork
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;pthread.h&gt;
#include &lt;unistd.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;sys/wait.h&gt;

int global = 0;                               // biến toàn cục
int *heap;                                    // bộ nhớ lấy bằng malloc (heap)
int fd;                                       // một tệp đang mở
void *stack_of[2];                            // địa chỉ một biến cục bộ của từng luồng
pthread_barrier_t both;                       // giữ cả hai luồng cùng sống một lúc
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

void *thread(void *arg) {
    int me = (int)(long)arg;
    int local = 100 + me;                     // nằm trên ngăn xếp của RIÊNG luồng này
    stack_of[me] = &amp;local;
    pthread_mutex_lock(&amp;m);
    global++;                                 // cùng một biến cho mọi luồng
    heap[me] = local;
    write(fd, me ? "B" : "A", 1);             // cùng một vị trí đọc/ghi tệp cho mọi luồng
    pthread_mutex_unlock(&amp;m);
    pthread_barrier_wait(&amp;both);
    return NULL;
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    pthread_barrier_init(&amp;both, NULL, 2);
    heap = malloc(2 * sizeof(int));
    fd = open("shared.txt", O_CREAT | O_TRUNC | O_RDWR, 0644);
    pthread_t t[2];
    for (long i = 0; i &lt; 2; i++) pthread_create(&amp;t[i], NULL, thread, (void *)i);
    for (int i = 0; i &lt; 2; i++) pthread_join(t[i], NULL);
    printf("THREADS  global = %d (both increments seen)\\n", global);
    printf("THREADS  heap[0] = %d, heap[1] = %d (main sees what the threads wrote)\\n", heap[0], heap[1]);
    printf("THREADS  file offset = %ld (one shared offset, the file holds 2 bytes)\\n", (long)lseek(fd, 0, SEEK_CUR));
    printf("THREADS  the two stacks are %ld KiB apart (a separate stack each)\\n",
           labs((char *)stack_of[0] - (char *)stack_of[1]) / 1024);

    pthread_attr_t a; size_t size;
    pthread_attr_init(&amp;a);
    pthread_attr_getstacksize(&amp;a, &amp;size);
    printf("THREADS  default stack size of a new thread = %zu KiB\\n", size / 1024);

    if (fork() == 0) { global = 999; heap[0] = 999; exit(0); }   // một TIẾN TRÌNH sửa các bản sao của nó
    wait(NULL);
    printf("FORK     after the child wrote 999: global = %d, heap[0] = %d (copies, not shared)\\n", global, heap[0]);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread chung-rieng.c -o chung-rieng &amp;&amp; ./chung-rieng<br>
THREADS &nbsp;global = 2 (both increments seen)<br>
THREADS &nbsp;heap[0] = 100, heap[1] = 101 (main sees what the threads wrote)<br>
THREADS &nbsp;file offset = 2 (one shared offset, the file holds 2 bytes)<br>
THREADS &nbsp;the two stacks are 8256 KiB apart (a separate stack each)<br>
THREADS &nbsp;default stack size of a new thread = 8192 KiB<br>
FORK &nbsp;&nbsp;&nbsp;&nbsp;after the child wrote 999: global = 2, heap[0] = 100 (copies, not shared)</div>
<p>Luồng: cả hai lần tăng biến toàn cục đều thấy được; heap dùng chung; hai lần ghi làm dịch chung một vị trí tệp; nhưng biến cục bộ của mỗi luồng nằm trên một ngăn xếp khác, cách nhau khoảng 8 MiB. Fork: tiến trình con sửa các <em>bản sao</em> của biến toàn cục và heap, còn cha không thấy gì — hai tiến trình, hai không gian địa chỉ.</p>
<p class="pitfall">⚠️ FE2#7: "Thứ nào được các luồng của cùng tiến trình dùng chung?" — <strong>bộ mô tả tệp, heap và biến toàn cục</strong>. Ngăn xếp, bộ đếm chương trình và thanh ghi CPU là của riêng từng luồng.</p>`],
      [19, 'The Classical Thread Model (3)',
        `<p class="y-chinh">🎯 Figure 2-13: <strong>each thread has its own stack</strong>. Thread 1's stack and thread 3's stack sit in the same process address space, side by side.</p>
<p>Why must the stack be private? Each thread calls different procedures, in a different order: thread 1 may be inside <code>X</code> called from <code>main</code>, thread 2 inside <code>Y</code>. A stack holds one <strong>frame</strong> per procedure that has been called and not yet returned — local variables and the return address. If two threads shared a stack, their frames would interleave and every return would jump to the wrong place. So the history of calls (the "execution history") is per thread; the data on the heap and in globals is shared.</p>
<p>➕ The numbers from the program on slide 18: the default stack of a new thread on this Linux is <strong>8192 KiB = 8 MiB</strong> (it follows <code>ulimit -s</code>), and the two thread stacks were 8256 KiB apart — 8 MiB of stack plus a small <strong>guard page</strong> region that is not mapped, so a thread that overflows its stack crashes immediately instead of silently writing into its neighbour's stack.</p>
<div class="callout">🧭 <strong>On a real server:</strong> 8 MiB is <em>reserved</em> address space, not memory used — but it is why 10 000 OS threads are expensive. The JVM gives each platform thread a 1 MiB stack by default (<code>-Xss</code>); Java 21 virtual threads keep their stack in the heap and grow it only as needed, which is how one JVM holds a million of them. A deep recursion in one thread gives <code>StackOverflowError</code> in Java and a segmentation fault in C — the guard page doing its job.</div>`,
        `<p class="y-chinh">🎯 Hình 2-13: <strong>mỗi luồng có ngăn xếp riêng</strong>. Ngăn xếp của luồng 1 và của luồng 3 nằm trong cùng một không gian địa chỉ của tiến trình, cạnh nhau.</p>
<p>Vì sao ngăn xếp phải riêng? Mỗi luồng gọi những thủ tục khác nhau, theo thứ tự khác nhau: luồng 1 có thể đang ở trong <code>X</code> được gọi từ <code>main</code>, luồng 2 đang ở trong <code>Y</code>. Ngăn xếp giữ một <strong>khung (frame)</strong> cho mỗi thủ tục đã được gọi mà chưa trả về — biến cục bộ và địa chỉ trả về. Nếu hai luồng dùng chung một ngăn xếp, các khung sẽ xen vào nhau và mỗi lần trả về sẽ nhảy sai chỗ. Vậy lịch sử các lời gọi ("lịch sử thực thi") là của riêng từng luồng; dữ liệu trên heap và biến toàn cục thì dùng chung.</p>
<p>➕ Các con số từ chương trình ở slide 18: ngăn xếp mặc định của một luồng mới trên Linux này là <strong>8192 KiB = 8 MiB</strong> (theo <code>ulimit -s</code>), và hai ngăn xếp cách nhau 8256 KiB — 8 MiB ngăn xếp cộng một vùng <strong>trang canh (guard page)</strong> nhỏ không được ánh xạ, để luồng nào tràn ngăn xếp sẽ đổ vỡ ngay thay vì âm thầm ghi đè sang ngăn xếp hàng xóm.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> 8 MiB là không gian địa chỉ <em>đặt trước</em>, không phải bộ nhớ đã dùng — nhưng đó là lý do 10 000 luồng HĐH đắt đỏ. JVM cho mỗi luồng nền tảng (platform thread) ngăn xếp 1 MiB theo mặc định (<code>-Xss</code>); luồng ảo của Java 21 giữ ngăn xếp trong heap và chỉ nới khi cần, nhờ vậy một JVM giữ được cả triệu luồng ảo. Đệ quy quá sâu trong một luồng cho ra <code>StackOverflowError</code> ở Java và segmentation fault ở C — chính trang canh đang làm việc của nó.</div>`],
      [20, 'POSIX Threads (1)',
        `<p class="y-chinh">🎯 Figure 2-14: some <strong>Pthreads</strong> calls — <code>pthread_create</code> (create a new thread), <code>pthread_exit</code> (terminate the calling thread), <code>pthread_join</code> (wait for a specific thread to exit), <code>pthread_yield</code> (release the CPU to let another thread run), <code>pthread_attr_init</code> (create and initialize a thread's attribute structure), <code>pthread_attr_destroy</code> (remove it).</p>
<p><strong>Pthreads</strong> is the thread package defined by the IEEE POSIX standard 1003.1c (1995), available on Linux, macOS and every UNIX. Each thread has an identifier (<code>pthread_t</code>), a set of registers and a set of <strong>attributes</strong> (stack size, scheduling parameters…) stored in an attribute structure. <code>pthread_create</code> takes four arguments: where to put the new thread's ID, the attributes (NULL = defaults), the function the thread runs, and one <code>void *</code> argument for that function; it returns 0 on success or an error number. <code>pthread_join</code> is the thread version of <code>waitpid</code>: the caller blocks until that thread finishes and may collect the value it returned.</p>
<p>➕ One row of the table is outdated. Compile a call to <code>pthread_yield</code> with today's GNU C library:</p>
<div class="out"># Figure 2-14 lists pthread_yield — today's glibc (2.36 in this container) marks it deprecated<br>
$ ldd --version | head -1<br>
ldd (Debian GLIBC 2.36-9+deb12u14) 2.36<br>
$ cat &gt; nhuong.c &lt;&lt;'X'<br>
&gt; #define _GNU_SOURCE<br>
&gt; #include &lt;pthread.h&gt;<br>
&gt; int main(void) { return pthread_yield(); }<br>
&gt; X<br>
$ gcc -Wall -pthread nhuong.c -o nhuong<br>
nhuong.c: In function ‘main’:<br>
nhuong.c:3:1: warning: ‘pthread_yield’ is deprecated: pthread_yield is deprecated, use sched_yield instead [-Wdeprecated-declarations]<br>
&nbsp;&nbsp;&nbsp;&nbsp;3 | int main(void) { return pthread_yield(); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| ^~~<br>
In file included from /usr/include/features.h:489,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;from /usr/include/pthread.h:21,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;from nhuong.c:2:<br>
/usr/include/pthread.h:479:12: note: declared here<br>
&nbsp;&nbsp;479 | extern int __REDIRECT_NTH (pthread_yield, (void), sched_yield)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^~~~~~~~~~~~~~<br>
# the replacement the warning names: sched_yield (POSIX)<br>
$ grep -n 'pthread_yield' /usr/include/pthread.h | head -3<br>
477:extern int pthread_yield (void) __THROW;<br>
479:extern int __REDIRECT_NTH (pthread_yield, (void), sched_yield)<br>
481:pthread_yield is deprecated, use sched_yield instead");</div>
<p>Since glibc 2.34 (2021) the function is <strong>deprecated</strong> — it is not even declared unless you define <code>_GNU_SOURCE</code>, and the header redirects it to <code>sched_yield</code>, the POSIX call that does the same job (it never was part of POSIX). Write <code>sched_yield()</code> in new code. In C you compile Pthreads programs with <code>gcc -pthread</code>, which the course runner always adds.</p>
<p class="pitfall">⚠️ FE6#8: "What is the purpose of pthread_join?" — <strong>to wait for a specific thread to exit</strong>. Don't confuse it with <code>pthread_exit</code> (terminate the <em>calling</em> thread) or <code>pthread_yield</code> (give up the CPU but stay ready).</p>`,
        `<p class="y-chinh">🎯 Hình 2-14: một số lời gọi <strong>Pthreads</strong> — <code>pthread_create</code> (tạo luồng mới), <code>pthread_exit</code> (kết thúc luồng đang gọi), <code>pthread_join</code> (chờ một luồng cụ thể kết thúc), <code>pthread_yield</code> (nhường CPU cho luồng khác chạy), <code>pthread_attr_init</code> (tạo và khởi tạo cấu trúc thuộc tính của luồng), <code>pthread_attr_destroy</code> (huỷ nó).</p>
<p><strong>Pthreads</strong> là gói luồng do chuẩn IEEE POSIX 1003.1c (1995) định nghĩa, có trên Linux, macOS và mọi UNIX. Mỗi luồng có một định danh (<code>pthread_t</code>), một bộ thanh ghi và một bộ <strong>thuộc tính (attribute)</strong> (cỡ ngăn xếp, tham số lập lịch…) cất trong một cấu trúc thuộc tính. <code>pthread_create</code> nhận bốn đối số: chỗ đặt ID của luồng mới, các thuộc tính (NULL = mặc định), hàm mà luồng chạy, và một đối số <code>void *</code> cho hàm đó; nó trả 0 nếu thành công, hoặc một mã lỗi. <code>pthread_join</code> là phiên bản luồng của <code>waitpid</code>: bên gọi bị chặn tới khi luồng đó kết thúc và có thể lấy giá trị nó trả về.</p>
<p>➕ Một dòng của bảng đã lỗi thời. Biên dịch một lời gọi <code>pthread_yield</code> với thư viện C GNU ngày nay:</p>
<div class="out"># Hình 2-14 có pthread_yield — glibc ngày nay (2.36 trong container này) đã đánh dấu nó lỗi thời<br>
$ ldd --version | head -1<br>
ldd (Debian GLIBC 2.36-9+deb12u14) 2.36<br>
$ cat &gt; nhuong.c &lt;&lt;'X'<br>
&gt; #define _GNU_SOURCE<br>
&gt; #include &lt;pthread.h&gt;<br>
&gt; int main(void) { return pthread_yield(); }<br>
&gt; X<br>
$ gcc -Wall -pthread nhuong.c -o nhuong<br>
nhuong.c: In function ‘main’:<br>
nhuong.c:3:1: warning: ‘pthread_yield’ is deprecated: pthread_yield is deprecated, use sched_yield instead [-Wdeprecated-declarations]<br>
&nbsp;&nbsp;&nbsp;&nbsp;3 | int main(void) { return pthread_yield(); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| ^~~<br>
In file included from /usr/include/features.h:489,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;from /usr/include/pthread.h:21,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;from nhuong.c:2:<br>
/usr/include/pthread.h:479:12: note: declared here<br>
&nbsp;&nbsp;479 | extern int __REDIRECT_NTH (pthread_yield, (void), sched_yield)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^~~~~~~~~~~~~~<br>
# hàm thay thế mà cảnh báo chỉ ra: sched_yield (POSIX)<br>
$ grep -n 'pthread_yield' /usr/include/pthread.h | head -3<br>
477:extern int pthread_yield (void) __THROW;<br>
479:extern int __REDIRECT_NTH (pthread_yield, (void), sched_yield)<br>
481:pthread_yield is deprecated, use sched_yield instead");</div>
<p>Từ glibc 2.34 (2021) hàm này bị <strong>đánh dấu lỗi thời (deprecated)</strong> — thậm chí không được khai báo nếu bạn không định nghĩa <code>_GNU_SOURCE</code>, và tệp tiêu đề chuyển hướng nó sang <code>sched_yield</code>, lời gọi POSIX làm đúng việc đó (bản thân nó chưa bao giờ thuộc POSIX). Mã mới hãy viết <code>sched_yield()</code>. Trong C, chương trình Pthreads được biên dịch bằng <code>gcc -pthread</code>, cờ mà trình chạy của môn luôn thêm vào.</p>
<p class="pitfall">⚠️ FE6#8: "pthread_join dùng để làm gì?" — <strong>chờ một luồng cụ thể kết thúc</strong>. Đừng nhầm với <code>pthread_exit</code> (kết thúc luồng <em>đang gọi</em>) hay <code>pthread_yield</code> (nhường CPU nhưng vẫn sẵn sàng).</p>`],
      [21, 'POSIX Threads (2)',
        `<p class="y-chinh">🎯 Figure 2-15 (first half): an example program — <code>main</code> creates <code>NUMBER_OF_THREADS</code> = 10 threads in a loop; each thread runs <code>print_hello_world</code>, which prints "Hello World. Greetings from thread %d" with its number and calls <code>pthread_exit(NULL)</code>.</p>
<p>Read it slowly, it is the template of every Pthreads program. <code>pthread_t threads[10]</code> holds the IDs. In the loop, <code>main</code> prints "Main here. Creating thread i" and calls <code>pthread_create(&amp;threads[i], NULL, print_hello_world, (void *)i)</code>: the number <code>i</code> travels to the new thread disguised as a pointer, because the thread function's only parameter is a <code>void *</code>. The order in which the messages appear is <em>not</em> defined: the new threads and <code>main</code> run concurrently, and the scheduler decides who prints first.</p>
<p>➕ So let's compile the book's code exactly as printed, with the warnings that every C course should switch on (<code>-Wall</code>), and run it:</p>
<pre><code class="language-c">// Figure 2-15 EXACTLY as printed in the book (slides 21–22) — compile it with warnings on and run it
#include &lt;pthread.h&gt;
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

#define NUMBER_OF_THREADS 10

void *print_hello_world(void *tid)
{
    /* This function prints the thread's identifier and then exits. */
    printf("Hello World. Greetings from thread %d\\n", tid);
    pthread_exit(NULL);
}

int main(int argc, char *argv[])
{
    /* The main program creates 10 threads and then exits. */
    pthread_t threads[NUMBER_OF_THREADS];
    int status, i;

    for(i=0; i &lt; NUMBER_OF_THREADS; i++) {
        printf("Main here. Creating thread %d\\n", i);
        status = pthread_create(&amp;threads[i], NULL, print_hello_world, (void *)i);

        if (status != 0) {
            printf("Oops. pthread_create returned error code %d\\n", status);
            exit(-1);
        }
    }
    exit(NULL);
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread hello-sach.c -o hello-sach &amp;&amp; ./hello-sach<br>
hello-sach.c: In function ‘print_hello_world’:<br>
hello-sach.c:13:49: warning: format ‘%d’ expects argument of type ‘int’, but argument 2 has type ‘void *’ [-Wformat=]<br>
&nbsp;&nbsp;&nbsp;13 | &nbsp;&nbsp;&nbsp;&nbsp;printf("Hello World. Greetings from thread %d\\n", tid);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~^ &nbsp;&nbsp;&nbsp;&nbsp;~~~<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;|<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int &nbsp;&nbsp;void *<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%p<br>
hello-sach.c: In function ‘main’:<br>
hello-sach.c:25:71: warning: cast to pointer from integer of different size [-Wint-to-pointer-cast]<br>
&nbsp;&nbsp;&nbsp;25 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status = pthread_create(&amp;threads[i], NULL, print_hello_world, (void *)i);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
hello-sach.c:32:10: warning: passing argument 1 of ‘exit’ makes integer from pointer without a cast [-Wint-conversion]<br>
&nbsp;&nbsp;&nbsp;32 | &nbsp;&nbsp;&nbsp;&nbsp;exit(NULL);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^~~~<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;void *<br>
In file included from hello-sach.c:6:<br>
/usr/include/stdlib.h:637:23: note: expected ‘int’ but argument is of type ‘void *’<br>
&nbsp;&nbsp;637 | extern void exit (int __status) __THROW __attribute__ ((__noreturn__));<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~~~~^~~~~~~~<br>
Main here. Creating thread 0<br>
Main here. Creating thread 1<br>
Main here. Creating thread 2<br>
Main here. Creating thread 3<br>
Main here. Creating thread 4<br>
Main here. Creating thread 5<br>
Main here. Creating thread 6<br>
Main here. Creating thread 7<br>
Main here. Creating thread 8<br>
Hello World. Greetings from thread 0<br>
Hello World. Greetings from thread 3<br>
Main here. Creating thread 9<br>
Hello World. Greetings from thread 1<br>
Hello World. Greetings from thread 7<br>
Hello World. Greetings from thread 5<br>
Hello World. Greetings from thread 4<br>
Hello World. Greetings from thread 8<br>
Hello World. Greetings from thread 9</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Three warnings and one wrong behaviour. <code>printf("%d", tid)</code> prints a <em>pointer</em> with an integer format; <code>(void *)i</code> converts a 32-bit <code>int</code> into a 64-bit pointer; <code>exit(NULL)</code> passes a pointer where an <code>int</code> is expected (GCC 14 even turns this one into an error). And look at the output: all ten "Main here" lines, but fewer than ten "Hello World" lines — this run lost some. The next slide explains why.</p>
<p class="pitfall">⚠️ "In what order will the threads print?" — <strong>unknown / any order</strong>. Never write code that depends on the order in which threads start; if order matters, use synchronization (2.B).</p>`,
        `<p class="y-chinh">🎯 Hình 2-15 (nửa đầu): một chương trình ví dụ — <code>main</code> tạo <code>NUMBER_OF_THREADS</code> = 10 luồng trong một vòng lặp; mỗi luồng chạy <code>print_hello_world</code>, in "Hello World. Greetings from thread %d" kèm số của nó và gọi <code>pthread_exit(NULL)</code>.</p>
<p>Đọc chậm, đây là khuôn mẫu của mọi chương trình Pthreads. <code>pthread_t threads[10]</code> giữ các ID. Trong vòng lặp, <code>main</code> in "Main here. Creating thread i" rồi gọi <code>pthread_create(&amp;threads[i], NULL, print_hello_world, (void *)i)</code>: số <code>i</code> được gửi sang luồng mới dưới lốt một con trỏ, vì tham số duy nhất của hàm luồng là một <code>void *</code>. Thứ tự các dòng in ra <em>không</em> xác định: các luồng mới và <code>main</code> chạy đồng thời, bộ lập lịch quyết định ai in trước.</p>
<p>➕ Vậy hãy biên dịch mã của sách đúng như in, với các cảnh báo mà môn C nào cũng nên bật (<code>-Wall</code>), rồi chạy:</p>
<pre><code class="language-c">// Hình 2-15 ĐÚNG như in trong sách (slide 21–22) — biên dịch có bật cảnh báo rồi chạy
#include &lt;pthread.h&gt;
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

#define NUMBER_OF_THREADS 10

void *print_hello_world(void *tid)
{
    /* This function prints the thread's identifier and then exits. */
    printf("Hello World. Greetings from thread %d\\n", tid);
    pthread_exit(NULL);
}

int main(int argc, char *argv[])
{
    /* The main program creates 10 threads and then exits. */
    pthread_t threads[NUMBER_OF_THREADS];
    int status, i;

    for(i=0; i &lt; NUMBER_OF_THREADS; i++) {
        printf("Main here. Creating thread %d\\n", i);
        status = pthread_create(&amp;threads[i], NULL, print_hello_world, (void *)i);

        if (status != 0) {
            printf("Oops. pthread_create returned error code %d\\n", status);
            exit(-1);
        }
    }
    exit(NULL);
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread hello-sach.c -o hello-sach &amp;&amp; ./hello-sach<br>
hello-sach.c: In function ‘print_hello_world’:<br>
hello-sach.c:13:49: warning: format ‘%d’ expects argument of type ‘int’, but argument 2 has type ‘void *’ [-Wformat=]<br>
&nbsp;&nbsp;&nbsp;13 | &nbsp;&nbsp;&nbsp;&nbsp;printf("Hello World. Greetings from thread %d\\n", tid);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~^ &nbsp;&nbsp;&nbsp;&nbsp;~~~<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;|<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int &nbsp;&nbsp;void *<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%p<br>
hello-sach.c: In function ‘main’:<br>
hello-sach.c:25:71: warning: cast to pointer from integer of different size [-Wint-to-pointer-cast]<br>
&nbsp;&nbsp;&nbsp;25 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status = pthread_create(&amp;threads[i], NULL, print_hello_world, (void *)i);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
hello-sach.c:32:10: warning: passing argument 1 of ‘exit’ makes integer from pointer without a cast [-Wint-conversion]<br>
&nbsp;&nbsp;&nbsp;32 | &nbsp;&nbsp;&nbsp;&nbsp;exit(NULL);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^~~~<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;void *<br>
In file included from hello-sach.c:6:<br>
/usr/include/stdlib.h:637:23: note: expected ‘int’ but argument is of type ‘void *’<br>
&nbsp;&nbsp;637 | extern void exit (int __status) __THROW __attribute__ ((__noreturn__));<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~~~~^~~~~~~~<br>
Main here. Creating thread 0<br>
Main here. Creating thread 1<br>
Main here. Creating thread 2<br>
Main here. Creating thread 3<br>
Main here. Creating thread 4<br>
Main here. Creating thread 5<br>
Main here. Creating thread 6<br>
Main here. Creating thread 7<br>
Main here. Creating thread 8<br>
Hello World. Greetings from thread 0<br>
Hello World. Greetings from thread 3<br>
Main here. Creating thread 9<br>
Hello World. Greetings from thread 1<br>
Hello World. Greetings from thread 7<br>
Hello World. Greetings from thread 5<br>
Hello World. Greetings from thread 4<br>
Hello World. Greetings from thread 8<br>
Hello World. Greetings from thread 9</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Ba cảnh báo và một hành vi sai. <code>printf("%d", tid)</code> in một <em>con trỏ</em> bằng định dạng số nguyên; <code>(void *)i</code> đổi một <code>int</code> 32 bit thành con trỏ 64 bit; <code>exit(NULL)</code> truyền con trỏ vào chỗ cần <code>int</code> (GCC 14 còn biến cảnh báo này thành lỗi). Và nhìn output: đủ mười dòng "Main here", nhưng ít hơn mười dòng "Hello World" — lần chạy này mất vài dòng. Slide sau giải thích vì sao.</p>
<p class="pitfall">⚠️ "Các luồng sẽ in theo thứ tự nào?" — <strong>không biết / thứ tự bất kỳ</strong>. Đừng bao giờ viết mã phụ thuộc thứ tự các luồng khởi động; nếu thứ tự quan trọng, hãy đồng bộ (2.B).</p>`],
      [22, 'POSIX Threads (3)',
        `<p class="y-chinh">🎯 Figure 2-15 (second half): after creating each thread, <code>main</code> checks the status — if <code>pthread_create</code> returned non-zero it prints "Oops. pthread_create returned error code %d" and exits — and at the end calls <code>exit(NULL)</code>.</p>
<p>The error check is good practice: <code>pthread_create</code> fails, for example, with <code>EAGAIN</code> when the system's thread limit is reached. The ending is the bug. <code>exit</code> terminates the whole <strong>process</strong>, and with it every thread that has not finished yet. <code>main</code> created ten threads and exited immediately, so any thread that had not yet reached its <code>printf</code> was killed silently — that is why our run printed fewer than ten greetings. (The book's text says the order of the messages is not determined; on a slow 1990s machine the threads usually finished in time, which hid the problem.)</p>
<p>➕ The repaired version: the number travels through <code>intptr_t</code> (an integer type guaranteed to fit in a pointer), and <code>main</code> <strong>joins</strong> every thread before returning:</p>
<pre><code class="language-c">// Figure 2-15 repaired: an integer type that fits in a pointer, and main WAITS for its threads
#include &lt;pthread.h&gt;
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;stdlib.h&gt;

#define NUMBER_OF_THREADS 10

void *print_hello_world(void *tid) {
    printf("Hello World. Greetings from thread %d\\n", (int)(intptr_t)tid);   // pointer -&gt; integer, explicitly
    return NULL;                                                            // same as pthread_exit(NULL)
}

int main(void) {
    pthread_t threads[NUMBER_OF_THREADS];
    for (int i = 0; i &lt; NUMBER_OF_THREADS; i++) {
        int status = pthread_create(&amp;threads[i], NULL, print_hello_world, (void *)(intptr_t)i);
        if (status != 0) { printf("Oops. pthread_create returned error code %d\\n", status); exit(1); }
    }
    for (int i = 0; i &lt; NUMBER_OF_THREADS; i++)
        pthread_join(threads[i], NULL);                                     // wait for every thread
    printf("main: all %d threads have finished\\n", NUMBER_OF_THREADS);
    return 0;                                                               // exit(0), not exit(NULL)
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread hello-dung.c -o hello-dung &amp;&amp; ./hello-dung<br>
Hello World. Greetings from thread 0<br>
Hello World. Greetings from thread 9<br>
Hello World. Greetings from thread 3<br>
Hello World. Greetings from thread 8<br>
Hello World. Greetings from thread 7<br>
Hello World. Greetings from thread 4<br>
Hello World. Greetings from thread 2<br>
Hello World. Greetings from thread 1<br>
Hello World. Greetings from thread 5<br>
Hello World. Greetings from thread 6<br>
main: all 10 threads have finished</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>No warnings, all ten greetings every time — in a different order on each run, which is fine. Two alternatives also work: <code>main</code> may call <code>pthread_exit(NULL)</code> instead of <code>exit</code> (the process then lives until its last thread ends), or the threads can be created <em>detached</em> if nobody needs their result.</p>
<p class="meo">🧠 Return from <code>main</code> or call <code>exit</code> = the whole process dies, all threads with it. <code>pthread_exit</code> = only the calling thread dies.</p>`,
        `<p class="y-chinh">🎯 Hình 2-15 (nửa sau): sau khi tạo mỗi luồng, <code>main</code> kiểm tra trạng thái — nếu <code>pthread_create</code> trả khác 0 thì in "Oops. pthread_create returned error code %d" và thoát — và cuối cùng gọi <code>exit(NULL)</code>.</p>
<p>Việc kiểm lỗi là thói quen tốt: <code>pthread_create</code> thất bại chẳng hạn với <code>EAGAIN</code> khi chạm giới hạn số luồng của hệ thống. Chỗ kết thúc mới là lỗi. <code>exit</code> kết thúc cả <strong>tiến trình</strong>, kéo theo mọi luồng chưa chạy xong. <code>main</code> tạo mười luồng rồi thoát ngay, nên luồng nào chưa kịp tới <code>printf</code> bị giết âm thầm — đó là lý do lần chạy của ta in ít hơn mười lời chào. (Lời sách nói thứ tự các dòng không xác định; trên máy chậm thập niên 1990, các luồng thường kịp chạy xong, nên lỗi bị che đi.)</p>
<p>➕ Bản đã sửa: con số đi qua kiểu <code>intptr_t</code> (kiểu số nguyên được bảo đảm vừa một con trỏ), và <code>main</code> <strong>join</strong> (đợi) từng luồng trước khi trả về:</p>
<pre><code class="language-c">// Hình 2-15 đã sửa: kiểu số nguyên vừa một con trỏ, và main ĐỢI các luồng của nó
#include &lt;pthread.h&gt;
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;stdlib.h&gt;

#define NUMBER_OF_THREADS 10

void *print_hello_world(void *tid) {
    printf("Hello World. Greetings from thread %d\\n", (int)(intptr_t)tid);   // con trỏ -&gt; số nguyên, ghi rõ
    return NULL;                                                            // giống pthread_exit(NULL)
}

int main(void) {
    pthread_t threads[NUMBER_OF_THREADS];
    for (int i = 0; i &lt; NUMBER_OF_THREADS; i++) {
        int status = pthread_create(&amp;threads[i], NULL, print_hello_world, (void *)(intptr_t)i);
        if (status != 0) { printf("Oops. pthread_create returned error code %d\\n", status); exit(1); }
    }
    for (int i = 0; i &lt; NUMBER_OF_THREADS; i++)
        pthread_join(threads[i], NULL);                                     // đợi từng luồng
    printf("main: all %d threads have finished\\n", NUMBER_OF_THREADS);
    return 0;                                                               // exit(0), không phải exit(NULL)
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread hello-dung.c -o hello-dung &amp;&amp; ./hello-dung<br>
Hello World. Greetings from thread 0<br>
Hello World. Greetings from thread 9<br>
Hello World. Greetings from thread 3<br>
Hello World. Greetings from thread 8<br>
Hello World. Greetings from thread 7<br>
Hello World. Greetings from thread 4<br>
Hello World. Greetings from thread 2<br>
Hello World. Greetings from thread 1<br>
Hello World. Greetings from thread 5<br>
Hello World. Greetings from thread 6<br>
main: all 10 threads have finished</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Không cảnh báo nào, lần nào cũng đủ mười lời chào — mỗi lần một thứ tự khác, và như vậy là đúng. Hai cách khác cũng được: <code>main</code> gọi <code>pthread_exit(NULL)</code> thay cho <code>exit</code> (tiến trình sống tới khi luồng cuối kết thúc), hoặc tạo luồng ở chế độ <em>detached</em> (tách rời) nếu không ai cần kết quả của chúng.</p>
<p class="meo">🧠 Trả về từ <code>main</code> hay gọi <code>exit</code> = cả tiến trình chết, mọi luồng chết theo. <code>pthread_exit</code> = chỉ luồng đang gọi chết.</p>`],
      [23, 'Implementing Threads in User Space',
        `<p class="y-chinh">🎯 Figure 2-16: (a) a <strong>user-level threads package</strong> — the kernel knows only processes; each process has its own <strong>run-time system</strong> and <strong>thread table</strong> in user space. (b) A threads package <strong>managed by the kernel</strong> — the kernel has the thread table next to the process table, and there is no run-time system.</p>
<p><strong>User-level threads</strong> (a): switching threads is just a procedure call into the run-time system — save registers into the thread table, load another thread's — at least an order of magnitude faster than trapping into the kernel; each process can use its <em>own</em> scheduling algorithm; it works even on an OS that has no threads. The problems: (1) if one thread makes a <strong>blocking system call</strong>, the kernel blocks the <em>whole process</em>, all threads with it; (2) a page fault blocks the whole process too; (3) the kernel's clock interrupts the process, not a thread, so a thread that never yields keeps the CPU from the other threads of its process. <strong>Kernel-level threads</strong> (b): blocking calls and page faults block only one thread, and the kernel may run another thread of the same process; the cost is that every thread operation is a system call.</p>
<p>➕ Linux uses (b), the <strong>1:1</strong> model: the NPTL thread library (standard since Linux 2.6, 2003) maps each <code>pthread</code> to its own kernel task — the LWP numbers on slide 17. Windows does the same. Go goroutines and Java 21 virtual threads went back to the user-level idea, combined with kernel threads (slide 24).</p>
<p class="pitfall">⚠️ FE21#23 asks which statement about user-level threads is NOT correct: "with user-level threads, customized scheduling algorithms <strong>cannot</strong> be implemented" — false, they <em>can</em>; that is one of their advantages. FE3#3: implementing threads in the kernel ⇒ <strong>the kernel has a thread table</strong>; "runs on top of a run-time system" and "suitable for an OS without threads" describe user-level threads.</p>`,
        `<p class="y-chinh">🎯 Hình 2-16: (a) một <strong>gói luồng mức người dùng</strong> — nhân chỉ biết tiến trình; mỗi tiến trình có <strong>hệ thống thời gian chạy (run-time system)</strong> và <strong>bảng luồng</strong> riêng nằm trong không gian người dùng. (b) Một gói luồng <strong>do nhân quản lý</strong> — nhân giữ bảng luồng bên cạnh bảng tiến trình, và không có hệ thống thời gian chạy.</p>
<p><strong>Luồng mức người dùng</strong> (a): chuyển luồng chỉ là một lời gọi thủ tục vào hệ thống thời gian chạy — lưu thanh ghi vào bảng luồng, nạp thanh ghi của luồng khác — nhanh hơn ít nhất một bậc độ lớn so với bẫy vào nhân; mỗi tiến trình dùng được thuật toán lập lịch <em>riêng</em>; chạy được cả trên HĐH không hỗ trợ luồng. Các vấn đề: (1) một luồng gọi <strong>lời gọi hệ thống chặn</strong> thì nhân chặn <em>cả tiến trình</em>, mọi luồng chết đứng theo; (2) một lỗi trang cũng chặn cả tiến trình; (3) ngắt đồng hồ của nhân ngắt tiến trình chứ không ngắt luồng, nên một luồng không chịu nhường sẽ giữ CPU khỏi các luồng khác trong cùng tiến trình. <strong>Luồng mức nhân</strong> (b): lời gọi chặn và lỗi trang chỉ chặn một luồng, và nhân có thể cho luồng khác của cùng tiến trình chạy; cái giá là mọi thao tác với luồng là một lời gọi hệ thống.</p>
<p>➕ Linux dùng (b), mô hình <strong>1:1</strong>: thư viện luồng NPTL (chuẩn từ Linux 2.6, 2003) ánh xạ mỗi <code>pthread</code> thành một tác vụ riêng của nhân — các số LWP ở slide 17. Windows cũng vậy. Goroutine của Go và luồng ảo của Java 21 quay lại ý tưởng mức người dùng, kết hợp với luồng nhân (slide 24).</p>
<p class="pitfall">⚠️ FE21#23 hỏi phát biểu nào về luồng mức người dùng là KHÔNG đúng: "với luồng mức người dùng, <strong>không thể</strong> cài thuật toán lập lịch tuỳ biến" — sai, chúng <em>có thể</em>; đó là một ưu điểm của chúng. FE3#3: cài luồng trong nhân ⇒ <strong>nhân có bảng luồng</strong>; "chạy trên một hệ thống thời gian chạy" và "hợp với HĐH không có luồng" là mô tả luồng mức người dùng.</p>`],
      [24, 'Hybrid Implementations',
        `<p class="y-chinh">🎯 Figure 2-17: <strong>multiplexing user-level threads onto kernel-level threads</strong> — the kernel knows only a few kernel threads; on top of each, a user-level run-time system runs several user threads. This is the <strong>M:N</strong> model.</p>
<p>The hybrid tries to get the best of both: user threads are cheap to create and switch (no kernel call), while having several kernel threads lets the process use several CPUs and keep running when one kernel thread blocks. The programmer decides how many kernel threads to use and how many user threads to put on each. The difficulty, and the reason it was abandoned for years, is coordination: when a user thread blocks in the kernel, the run-time system must notice and move the other user threads to another kernel thread. The book also mentions <strong>scheduler activations</strong> (upcalls from the kernel to tell the run-time system that a thread blocked).</p>
<p>➕ M:N is back, and you will use it in Java. A <strong>virtual thread</strong> (Java 21, JEP 444, final in September 2023) is a user-level thread scheduled by the JVM onto a small pool of OS "carrier" threads; when a virtual thread blocks on I/O, the JVM unmounts it and runs another one on the same carrier. The output on slide 16 showed it: the virtual thread printed itself as <code>VirtualThread[#…]/runnable@ForkJoinPool-1-worker-…</code> — a user thread mounted on a kernel-backed worker of a ForkJoinPool — and the whole JVM still had only a few dozen OS threads after running 2 000 virtual ones.</p>
<div class="callout">🧭 <strong>On a real server:</strong> Spring Boot 3.2+ switches Tomcat to virtual threads with one property, <code>spring.threads.virtual.enabled=true</code>. Go's goroutines are the same M:N idea (the Go scheduler multiplexes goroutines onto OS threads). Node.js is not M:N: one JavaScript thread plus a libuv thread pool for blocking work.</div>`,
        `<p class="y-chinh">🎯 Hình 2-17: <strong>dồn nhiều luồng mức người dùng lên các luồng mức nhân</strong> — nhân chỉ biết vài luồng nhân; trên mỗi luồng nhân, một hệ thống thời gian chạy ở mức người dùng chạy vài luồng người dùng. Đây là mô hình <strong>M:N</strong>.</p>
<p>Mô hình lai cố lấy cái tốt nhất của cả hai: luồng người dùng rẻ khi tạo và khi chuyển (không gọi nhân), còn có nhiều luồng nhân cho phép tiến trình dùng nhiều CPU và chạy tiếp khi một luồng nhân bị chặn. Lập trình viên quyết định dùng bao nhiêu luồng nhân và đặt bao nhiêu luồng người dùng lên mỗi cái. Cái khó, và là lý do nó bị bỏ rơi nhiều năm, là sự phối hợp: khi một luồng người dùng bị chặn trong nhân, hệ thống thời gian chạy phải biết để dời các luồng người dùng khác sang luồng nhân khác. Sách còn nhắc <strong>scheduler activations</strong> (nhân gọi ngược lên — upcall — để báo cho hệ thống thời gian chạy rằng một luồng vừa bị chặn).</p>
<p>➕ M:N đã quay lại, và bạn sẽ dùng nó trong Java. Một <strong>luồng ảo (virtual thread)</strong> (Java 21, JEP 444, chính thức từ tháng 9/2023) là luồng mức người dùng được JVM lập lịch lên một bể nhỏ các luồng HĐH "mang vác" (carrier); khi luồng ảo bị chặn vì I/O, JVM tháo nó ra và chạy luồng ảo khác trên cùng carrier. Output ở slide 16 cho thấy điều đó: luồng ảo tự in mình là <code>VirtualThread[#…]/runnable@ForkJoinPool-1-worker-…</code> — một luồng người dùng gắn trên một worker có luồng nhân bên dưới của ForkJoinPool — và cả JVM vẫn chỉ có vài chục luồng HĐH sau khi chạy 2 000 luồng ảo.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> Spring Boot 3.2+ chuyển Tomcat sang luồng ảo chỉ với một thuộc tính, <code>spring.threads.virtual.enabled=true</code>. Goroutine của Go cũng là ý tưởng M:N đó (bộ lập lịch của Go dồn goroutine lên luồng HĐH). Node.js không phải M:N: một luồng JavaScript cộng một bể luồng libuv cho việc chặn.</div>`],
      [25, 'Pop-Up Threads',
        `<p class="y-chinh">🎯 Figure 2-18: creation of a new thread when a message arrives — (a) before the message arrives, the process has an existing thread; (b) after it arrives, the system creates a <strong>pop-up thread</strong> just to handle that message.</p>
<p>The traditional way is a thread that is <em>blocked</em> in a <code>receive</code> call, waiting for messages. With pop-up threads the arrival of a message itself causes a fresh thread to be created. The new thread has no history — no registers or stack to restore — so it can be created quickly, and the latency between the message's arrival and the start of processing is short. In some systems the pop-up thread even runs in kernel space, which is faster but dangerous: a buggy kernel thread can do far more damage.</p>
<p>➕ The idea lives on in "one handler per event" designs: a Java 21 server that starts a new virtual thread for every incoming request (slide 16 created 2 000 of them in a fraction of a second), serverless platforms that start a fresh function instance per request, and Linux's <strong>threaded interrupt handlers</strong> (a kernel thread that wakes up for each interrupt of a device). Contrast with the dispatcher/worker server of slide 14, whose threads are created in advance and reused (a <strong>thread pool</strong>).</p>
<p class="meo">🧠 Pool = waiters already standing by. Pop-up = call a new waiter the moment a customer walks in — fine if hiring is nearly free (virtual threads), costly if it isn't (OS threads).</p>`,
        `<p class="y-chinh">🎯 Hình 2-18: tạo luồng mới khi có thông điệp tới — (a) trước khi thông điệp tới, tiến trình có một luồng sẵn; (b) khi nó tới, hệ thống tạo một <strong>luồng bật lên (pop-up thread)</strong> chỉ để xử lý thông điệp đó.</p>
<p>Cách truyền thống là một luồng <em>bị chặn</em> trong lời gọi <code>receive</code>, chờ thông điệp. Với luồng bật lên, chính việc thông điệp tới làm sinh ra một luồng mới tinh. Luồng mới không có quá khứ — không có thanh ghi hay ngăn xếp nào phải khôi phục — nên tạo nhanh, và độ trễ từ lúc thông điệp tới đến lúc bắt đầu xử lý ngắn. Ở một số hệ thống luồng bật lên còn chạy trong không gian nhân, nhanh hơn nhưng nguy hiểm: một luồng nhân có lỗi gây hại lớn hơn nhiều.</p>
<p>➕ Ý tưởng này sống tiếp trong các thiết kế "mỗi sự kiện một trình xử lý": máy chủ Java 21 khởi động một luồng ảo mới cho mỗi yêu cầu tới (slide 16 tạo 2 000 cái trong chưa tới một giây), các nền tảng serverless khởi động một thể hiện hàm mới cho mỗi yêu cầu, và <strong>trình xử lý ngắt dạng luồng (threaded interrupt handler)</strong> của Linux (một luồng nhân thức dậy cho mỗi ngắt của một thiết bị). Đối lập với máy chủ điều phối/thợ ở slide 14, nơi các luồng được tạo sẵn và dùng lại (một <strong>bể luồng — thread pool</strong>).</p>
<p class="meo">🧠 Bể luồng = bồi bàn đứng chờ sẵn. Luồng bật lên = gọi một bồi bàn mới ngay khi khách bước vào — ổn nếu thuê người gần như miễn phí (luồng ảo), tốn kém nếu không (luồng HĐH).</p>`],
      [26, 'Making Single-Threaded Code Multithreaded (1)',
        `<p class="y-chinh">🎯 Figure 2-19: conflicts between threads over a <strong>global variable</strong> — thread 1 calls <code>access</code>, which sets <code>errno</code>; before thread 1 inspects it, the scheduler runs thread 2, whose <code>open</code> fails and <strong>overwrites</strong> <code>errno</code>; thread 1 then reads the wrong error code.</p>
<p>Old UNIX code was written for one thread per process, and it is full of process-wide globals: <code>errno</code> (the last error), static buffers inside library functions, the memory allocator's lists. Turning such a program into a multithreaded one is not just "add threads": every global that a thread uses for its own purposes becomes a race. The book lists the other traps too: library procedures that are not <strong>reentrant</strong> (they keep state between calls, like <code>strtok</code>), signals (which thread receives them?), and stack management (how does the OS grow the stack of a thread it does not know about?).</p>
<p>➕ Figure 2-19 replayed with real threads and barriers forcing exactly the book's order:</p>
<pre><code class="language-c">// Figure 2-19 replayed with real threads: thread 1 sets errno, thread 2 overwrites "errno", thread 1 inspects it
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;

pthread_barrier_t step1, step2;
int *errno_addr[2];

void *thread1(void *arg) {
    access("/no/such/file", F_OK);                     // fails: errno = ENOENT
    errno_addr[0] = &amp;errno;
    pthread_barrier_wait(&amp;step1);                      // let thread 2 run now
    pthread_barrier_wait(&amp;step2);                      // ... and wait until it has finished
    printf("thread 1 inspects errno: %d (%s)\\n", errno, strerror(errno));
    return NULL;
}

void *thread2(void *arg) {
    pthread_barrier_wait(&amp;step1);
    open("/", O_WRONLY);                               // fails: errno = EISDIR
    errno_addr[1] = &amp;errno;
    printf("thread 2 open failed : %d (%s)\\n", errno, strerror(errno));
    pthread_barrier_wait(&amp;step2);
    return NULL;
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    pthread_t a, b;
    pthread_barrier_init(&amp;step1, NULL, 2);
    pthread_barrier_init(&amp;step2, NULL, 2);
    pthread_create(&amp;a, NULL, thread1, NULL);
    pthread_create(&amp;b, NULL, thread2, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("&amp;errno in thread 1 == &amp;errno in thread 2 ? %s\\n", errno_addr[0] == errno_addr[1] ? "yes" : "no");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread errno-luong.c -o errno-luong &amp;&amp; ./errno-luong<br>
thread 2 open failed : 21 (Is a directory)<br>
thread 1 inspects errno: 2 (No such file or directory)<br>
&amp;errno in thread 1 == &amp;errno in thread 2 ? no</div>
<p>Thread 2's failure (21, EISDIR) did <strong>not</strong> overwrite thread 1's error (2, ENOENT), and the two threads' <code>&amp;errno</code> are different addresses. Modern C libraries solved Figure 2-19 for <code>errno</code>: it is a macro that refers to a <strong>per-thread</strong> variable (POSIX requires this). The problem remains for <em>your</em> globals — the next slide shows the tool.</p>
<p class="pitfall">⚠️ Non-reentrant library calls are a classic interview question: <code>strtok</code> → use <code>strtok_r</code>; <code>localtime</code> → <code>localtime_r</code>; Java's <code>SimpleDateFormat</code> shared between threads → corrupt dates (use <code>DateTimeFormatter</code>, which is immutable).</p>`,
        `<p class="y-chinh">🎯 Hình 2-19: xung đột giữa các luồng quanh một <strong>biến toàn cục</strong> — luồng 1 gọi <code>access</code>, hàm này đặt <code>errno</code>; trước khi luồng 1 kịp xem, bộ lập lịch cho luồng 2 chạy, lời gọi <code>open</code> của nó thất bại và <strong>ghi đè</strong> <code>errno</code>; luồng 1 rồi đọc nhầm mã lỗi.</p>
<p>Mã UNIX cũ được viết cho mỗi tiến trình một luồng, và đầy những biến toàn cục cấp tiến trình: <code>errno</code> (lỗi gần nhất), vùng đệm tĩnh bên trong hàm thư viện, các danh sách của bộ cấp phát bộ nhớ. Biến một chương trình như vậy thành đa luồng không chỉ là "thêm luồng": mọi biến toàn cục mà một luồng dùng cho việc riêng của nó trở thành một chỗ tranh chấp. Sách liệt kê cả các bẫy khác: thủ tục thư viện không <strong>tái nhập được (reentrant)</strong> (giữ trạng thái giữa các lần gọi, như <code>strtok</code>), tín hiệu (luồng nào nhận?), và quản lý ngăn xếp (HĐH nới ngăn xếp thế nào cho một luồng mà nó không biết tới?).</p>
<p>➕ Diễn lại Hình 2-19 bằng luồng thật, với rào chắn ép đúng thứ tự của sách:</p>
<pre><code class="language-c">// Diễn lại Hình 2-19 bằng luồng thật: luồng 1 đặt errno, luồng 2 ghi đè "errno", luồng 1 xem lại
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;

pthread_barrier_t step1, step2;
int *errno_addr[2];

void *thread1(void *arg) {
    access("/no/such/file", F_OK);                     // thất bại: errno = ENOENT
    errno_addr[0] = &amp;errno;
    pthread_barrier_wait(&amp;step1);                      // giờ cho luồng 2 chạy
    pthread_barrier_wait(&amp;step2);                      // ... rồi đợi nó làm xong
    printf("thread 1 inspects errno: %d (%s)\\n", errno, strerror(errno));
    return NULL;
}

void *thread2(void *arg) {
    pthread_barrier_wait(&amp;step1);
    open("/", O_WRONLY);                               // thất bại: errno = EISDIR
    errno_addr[1] = &amp;errno;
    printf("thread 2 open failed : %d (%s)\\n", errno, strerror(errno));
    pthread_barrier_wait(&amp;step2);
    return NULL;
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    pthread_t a, b;
    pthread_barrier_init(&amp;step1, NULL, 2);
    pthread_barrier_init(&amp;step2, NULL, 2);
    pthread_create(&amp;a, NULL, thread1, NULL);
    pthread_create(&amp;b, NULL, thread2, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("&amp;errno in thread 1 == &amp;errno in thread 2 ? %s\\n", errno_addr[0] == errno_addr[1] ? "yes" : "no");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread errno-luong.c -o errno-luong &amp;&amp; ./errno-luong<br>
thread 2 open failed : 21 (Is a directory)<br>
thread 1 inspects errno: 2 (No such file or directory)<br>
&amp;errno in thread 1 == &amp;errno in thread 2 ? no</div>
<p>Lỗi của luồng 2 (21, EISDIR) <strong>không</strong> ghi đè lỗi của luồng 1 (2, ENOENT), và <code>&amp;errno</code> của hai luồng là hai địa chỉ khác nhau. Thư viện C hiện đại đã giải Hình 2-19 cho <code>errno</code>: nó là một macro trỏ tới một biến <strong>riêng của từng luồng</strong> (POSIX bắt buộc điều này). Vấn đề vẫn còn với biến toàn cục <em>của bạn</em> — slide sau cho công cụ.</p>
<p class="pitfall">⚠️ Lời gọi thư viện không tái nhập là câu phỏng vấn kinh điển: <code>strtok</code> → dùng <code>strtok_r</code>; <code>localtime</code> → <code>localtime_r</code>; <code>SimpleDateFormat</code> của Java dùng chung giữa các luồng → ngày tháng hỏng (dùng <code>DateTimeFormatter</code>, vốn bất biến).</p>`],
      [27, 'Making Single-Threaded Code Multithreaded (2)',
        `<p class="y-chinh">🎯 Figure 2-20: <strong>threads can have private global variables</strong> — each thread gets its own copy of the variables it uses as "globals": thread 1's globals and thread 2's globals sit next to their code and stacks.</p>
<p>A private global is visible to every procedure <em>within one thread</em> (like a global) but each thread has its own copy (like a local). The book's solution is a library with calls such as <code>create_global("bufptr")</code>, <code>set_global</code> and <code>read_global</code>. Pthreads standardized it as <code>pthread_key_create</code> / <code>pthread_setspecific</code> / <code>pthread_getspecific</code>, and C11 added a keyword so the compiler does it for you: <code>_Thread_local</code> (GCC also accepts <code>__thread</code>).</p>
<p>➕ One ordinary global and one <code>_Thread_local</code> global, updated by the same function from three threads:</p>
<pre><code class="language-c">// Figure 2-20 in C11: a "private global" — one copy of the variable per thread
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

int shared_calls = 0;                    // ONE copy for the whole process
_Thread_local int my_calls = 0;          // one copy PER THREAD (gcc also accepts __thread)
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

void count_call(void) {                  // any function can use it like a global
    my_calls++;
    pthread_mutex_lock(&amp;m);
    shared_calls++;
    pthread_mutex_unlock(&amp;m);
}

void *work(void *arg) {
    int n = (int)(long)arg;
    for (int i = 0; i &lt; n; i++) count_call();
    pthread_mutex_lock(&amp;m);
    printf("thread asked to call %d times: my_calls = %d\\n", n, my_calls);
    pthread_mutex_unlock(&amp;m);
    return NULL;
}

int main(void) {
    pthread_t t[3];
    long n[3] = {3, 5, 7};
    for (int i = 0; i &lt; 3; i++) { pthread_create(&amp;t[i], NULL, work, (void *)n[i]); pthread_join(t[i], NULL); }
    printf("main thread: my_calls = %d, shared_calls = %d\\n", my_calls, shared_calls);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bien-rieng.c -o bien-rieng &amp;&amp; ./bien-rieng<br>
thread asked to call 3 times: my_calls = 3<br>
thread asked to call 5 times: my_calls = 5<br>
thread asked to call 7 times: my_calls = 7<br>
main thread: my_calls = 0, shared_calls = 15</div>
<p>Each thread's <code>my_calls</code> counted only its own calls (3, 5, 7), and the main thread's copy is still 0; the ordinary global, protected by a mutex, counted all 15. This is exactly the mechanism behind <code>errno</code> on the previous slide.</p>
<div class="callout">🧭 <strong>On a real server:</strong> Java's <code>ThreadLocal</code> is Figure 2-20. Spring keeps the current transaction and the logged-in user (<code>SecurityContextHolder</code>) in thread-locals, and logging frameworks keep the request ID there (MDC). With a thread pool, a value left behind by one request leaks into the next request that reuses the thread — always clear thread-locals in a <code>finally</code> block; Java 21 adds <code>ScopedValue</code> (preview) for virtual threads.</div>`,
        `<p class="y-chinh">🎯 Hình 2-20: <strong>luồng có thể có biến toàn cục riêng</strong> — mỗi luồng có bản sao riêng của các biến nó dùng như "toàn cục": biến toàn cục của luồng 1 và của luồng 2 nằm cạnh mã và ngăn xếp của chúng.</p>
<p>Một biến toàn cục riêng thấy được từ mọi thủ tục <em>trong cùng một luồng</em> (như biến toàn cục) nhưng mỗi luồng có một bản (như biến cục bộ). Lời giải của sách là một thư viện với các lời gọi như <code>create_global("bufptr")</code>, <code>set_global</code> và <code>read_global</code>. Pthreads chuẩn hoá điều này thành <code>pthread_key_create</code> / <code>pthread_setspecific</code> / <code>pthread_getspecific</code>, và C11 thêm một từ khoá để trình biên dịch làm hộ: <code>_Thread_local</code> (GCC cũng nhận <code>__thread</code>).</p>
<p>➕ Một biến toàn cục thường và một biến toàn cục <code>_Thread_local</code>, được cùng một hàm cập nhật từ ba luồng:</p>
<pre><code class="language-c">// Hình 2-20 bằng C11: "biến toàn cục riêng" — mỗi luồng một bản của biến
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

int shared_calls = 0;                    // MỘT bản cho cả tiến trình
_Thread_local int my_calls = 0;          // mỗi LUỒNG một bản (gcc cũng nhận __thread)
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

void count_call(void) {                  // hàm nào cũng dùng được như biến toàn cục
    my_calls++;
    pthread_mutex_lock(&amp;m);
    shared_calls++;
    pthread_mutex_unlock(&amp;m);
}

void *work(void *arg) {
    int n = (int)(long)arg;
    for (int i = 0; i &lt; n; i++) count_call();
    pthread_mutex_lock(&amp;m);
    printf("thread asked to call %d times: my_calls = %d\\n", n, my_calls);
    pthread_mutex_unlock(&amp;m);
    return NULL;
}

int main(void) {
    pthread_t t[3];
    long n[3] = {3, 5, 7};
    for (int i = 0; i &lt; 3; i++) { pthread_create(&amp;t[i], NULL, work, (void *)n[i]); pthread_join(t[i], NULL); }
    printf("main thread: my_calls = %d, shared_calls = %d\\n", my_calls, shared_calls);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bien-rieng.c -o bien-rieng &amp;&amp; ./bien-rieng<br>
thread asked to call 3 times: my_calls = 3<br>
thread asked to call 5 times: my_calls = 5<br>
thread asked to call 7 times: my_calls = 7<br>
main thread: my_calls = 0, shared_calls = 15</div>
<p><code>my_calls</code> của mỗi luồng chỉ đếm lời gọi của chính nó (3, 5, 7), và bản của luồng chính vẫn là 0; biến toàn cục thường, có mutex bảo vệ, đếm đủ 15. Đây chính là cơ chế đứng sau <code>errno</code> ở slide trước.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> <code>ThreadLocal</code> của Java chính là Hình 2-20. Spring giữ giao dịch hiện hành và người dùng đã đăng nhập (<code>SecurityContextHolder</code>) trong biến thread-local, các framework ghi log giữ mã yêu cầu ở đó (MDC). Với bể luồng, giá trị một yêu cầu để lại sẽ rò sang yêu cầu sau dùng lại luồng đó — luôn xoá thread-local trong khối <code>finally</code>; Java 21 thêm <code>ScopedValue</code> (bản xem trước) cho luồng ảo.</div>`],
    ]),
    bi(`<h2>📌 What you can now do</h2>
<ul>
<li>Explain the process model (one physical program counter, many logical ones) and why a process cannot assume anything about timing.</li>
<li>List the four causes of process creation and termination, and read exit statuses (0, error codes, 128 + signal).</li>
<li>Draw the three states with the four legal transitions — and name the illegal ones (Ready → Blocked, Blocked → Running).</li>
<li>Say what a process table entry holds (and find it in <code>/proc/PID</code>), and describe the eight steps of an interrupt and a context switch (~2 µs measured).</li>
<li>Compute CPU utilization 1 − pⁿ and reason about adding memory.</li>
<li>Explain why servers use threads, separate shared from per-thread items, write and join Pthreads correctly, and compare user-level, kernel-level (Linux 1:1) and hybrid (Java virtual threads, M:N) threads.</li>
</ul>
<p>Next, lesson 2.B: what goes wrong when threads and processes share data — race conditions, critical regions, and the tools that fix them.</p>`,
    `<h2>📌 Giờ bạn làm được</h2>
<ul>
<li>Giải thích mô hình tiến trình (một bộ đếm chương trình vật lý, nhiều bộ đếm logic) và vì sao tiến trình không được giả định gì về thời gian.</li>
<li>Kể bốn nguyên nhân tạo và kết thúc tiến trình, và đọc mã thoát (0, mã lỗi, 128 + tín hiệu).</li>
<li>Vẽ ba trạng thái với bốn chuyển đổi hợp lệ — và gọi tên các chuyển đổi không hợp lệ (Ready → Blocked, Blocked → Running).</li>
<li>Nói được một mục bảng tiến trình chứa gì (và tìm nó trong <code>/proc/PID</code>), tả tám bước khi có ngắt và một lần chuyển ngữ cảnh (đo được ~2 µs).</li>
<li>Tính hiệu suất CPU 1 − pⁿ và suy luận về việc thêm bộ nhớ.</li>
<li>Giải thích vì sao máy chủ dùng luồng, tách mục dùng chung khỏi mục riêng của luồng, viết và join Pthreads đúng cách, và so sánh luồng mức người dùng, mức nhân (Linux 1:1) và lai (luồng ảo Java, M:N).</li>
</ul>
<p>Tiếp theo, bài 2.B: chuyện gì hỏng khi luồng và tiến trình dùng chung dữ liệu — tranh chấp, vùng găng, và các công cụ sửa chúng.</p>`),
    books([
      ['mos4', 'Chapter 2, sections 2.1–2.2 (pp. 85–125): Figures 2-1 to 2-20', 'Chương 2, mục 2.1–2.2 (tr. 85–125): Hình 2-1 tới 2-20'],
      ['ostep', 'Chapters 4–6 (the process, process API, limited direct execution) and 26–27 (concurrency, thread API)', 'Chương 4–6 (tiến trình, API tiến trình, thực thi trực tiếp có giới hạn) và 26–27 (đồng thời, API luồng)'],
      ['man7', 'proc(5), ps(1), fork(2), wait(2), pthread_create(3), pthread_join(3), pthread_yield(3), pthreads(7), errno(3)', 'proc(5), ps(1), fork(2), wait(2), pthread_create(3), pthread_join(3), pthread_yield(3), pthreads(7), errno(3)'],
      ['posix', 'pthread_create, pthread_join, pthread_exit, pthread_key_create (IEEE Std 1003.1)', 'pthread_create, pthread_join, pthread_exit, pthread_key_create (IEEE Std 1003.1)'],
      ['mchoes', 'Chapter 4 (processor management) — process states and threads explained again, more gently', 'Chương 4 (quản lý bộ xử lý) — trạng thái tiến trình và luồng được giảng lại, nhẹ nhàng hơn'],
    ]),
  ].join('\n'),
};

/* ───────── 2.B — 📑 Slide by slide · Processes and Threads: races, mutual exclusion, semaphores, monitors (slides 28–55) ───────── */
const L_osg2_2 = {
  title: '2.B — 📑 Slide by slide · Processes and Threads: races, mutual exclusion, semaphores, monitors (slides 28–55)|||2.B — 📑 Học theo từng slide · Processes and Threads: tranh chấp, loại trừ tương hỗ, semaphore, monitor (slide 28–55)',
  slug: 'osg202-slide-osg2-2',
  type: 'VIDEO',
  description: 'Giảng đủ 28 slide giữa Chương 2 về giao tiếp liên tiến trình: tình trạng tranh chấp ở thư mục spooler (mô phỏng từng bước và chương trình mất hàng trăm nghìn tệp), bốn điều kiện của vùng găng, luân phiên nghiêm ngặt, Peterson (bản trong sách SAI trên CPU hiện đại — chạy thật mất cập nhật, bản atomic đúng), lệnh TSL/XCHG và lệnh máy thật trên ARM64, sleep/wakeup và tín hiệu đánh thức bị mất, semaphore giải bài sản xuất–tiêu thụ (kể cả bế tắc khi đảo hai lệnh down), mutex quay hay nhường, futex, biến điều kiện, monitor và bản Java của sách, truyền thông điệp bằng pipe và worker của Node, rào chắn và Read-Copy-Update — mọi dòng thời gian do bộ mô phỏng tính, mọi đoạn mã chạy thật trên Linux.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.B · deck "Chapter 2 · Processes and Threads", slides 28–55</span>
<h2>Interprocess communication: when sharing goes wrong, and how to make it right</h2>
<p class="lead">Lesson 2.A gave us many processes and threads running "at the same time". This part follows section 2.3 of the book: the moment two of them touch the same data, the result can depend on <em>who runs when</em> — a <strong>race condition</strong>. The slides walk through the classic attempts to prevent it, from the simplest (and wrong) to the tools you use every day: busy waiting, Peterson, the TSL instruction, sleep and wakeup, <strong>semaphores</strong>, <strong>mutexes</strong> and condition variables, <strong>monitors</strong>, <strong>message passing</strong>, barriers and lock-free RCU. Every interleaving is drawn by a simulator that executes the algorithm step by step, and every C program was run on Linux — some of them show the bugs happening for real.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>28</td><td>2.3.1 Race conditions</td><td>explain and reproduce a lost update</td></tr>
<tr><td>29–30</td><td>2.3.2 Critical regions</td><td>state the four conditions of a good solution</td></tr>
<tr><td>31–34</td><td>2.3.3 Mutual exclusion with busy waiting</td><td>judge strict alternation, Peterson and TSL — and why Peterson needs memory barriers today</td></tr>
<tr><td>35–36</td><td>2.3.4 Sleep and wakeup</td><td>explain the lost-wakeup problem</td></tr>
<tr><td>37–38</td><td>2.3.5 Semaphores</td><td>solve producer–consumer with three semaphores and spot a swapped down()</td></tr>
<tr><td>39–44</td><td>2.3.6 Mutexes (and Pthreads)</td><td>write a mutex with TSL, use pthread mutexes and condition variables</td></tr>
<tr><td>45–50</td><td>2.3.7 Monitors</td><td>explain what a monitor guarantees; read the Java version</td></tr>
<tr><td>51–52</td><td>2.3.8 Message passing</td><td>solve producer–consumer without shared memory</td></tr>
<tr><td>53–55</td><td>2.3.9–2.3.10 Barriers, RCU</td><td>synchronize phases; read data without locks</td></tr>
</tbody>
</table>
<div class="callout">The older web lessons 2.5 (race conditions, the four requirements, semaphores, IPC mechanisms, lock-free) and 2.6 (the classical problems, monitors and channels) stay as summaries; this lesson goes slide by slide and makes every mechanism run.</div>`,
    `<span class="eyebrow">Chương 2 · Bài 2.B · deck "Chapter 2 · Processes and Threads", slide 28–55</span>
<h2>Giao tiếp liên tiến trình: khi dùng chung thì hỏng ở đâu, và sửa cho đúng thế nào</h2>
<p class="lead">Bài 2.A cho ta nhiều tiến trình và luồng chạy "cùng lúc". Phần này đi theo mục 2.3 của sách: ngay khi hai trong số chúng chạm vào cùng một dữ liệu, kết quả có thể phụ thuộc vào việc <em>ai chạy lúc nào</em> — một <strong>tình trạng tranh chấp (race condition)</strong>. Các slide đi qua những cách kinh điển để ngăn nó, từ đơn giản nhất (và sai) tới những công cụ bạn dùng hằng ngày: chờ bận, Peterson, lệnh TSL, sleep và wakeup, <strong>semaphore</strong>, <strong>mutex</strong> và biến điều kiện, <strong>monitor</strong>, <strong>truyền thông điệp</strong>, rào chắn và RCU không khoá. Mọi cách đan xen được vẽ bằng một bộ mô phỏng chạy thuật toán từng bước, và mọi chương trình C đã chạy thật trên Linux — vài chương trình cho thấy lỗi xảy ra thật.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>28</td><td>2.3.1 Tình trạng tranh chấp</td><td>giải thích và tái hiện một lần mất cập nhật</td></tr>
<tr><td>29–30</td><td>2.3.2 Vùng găng</td><td>nêu bốn điều kiện của một lời giải tốt</td></tr>
<tr><td>31–34</td><td>2.3.3 Loại trừ tương hỗ bằng chờ bận</td><td>đánh giá luân phiên nghiêm ngặt, Peterson và TSL — và vì sao Peterson ngày nay cần rào chắn bộ nhớ</td></tr>
<tr><td>35–36</td><td>2.3.4 Sleep và wakeup</td><td>giải thích vấn đề mất tín hiệu đánh thức</td></tr>
<tr><td>37–38</td><td>2.3.5 Semaphore</td><td>giải bài sản xuất–tiêu thụ bằng ba semaphore và phát hiện down() bị đảo</td></tr>
<tr><td>39–44</td><td>2.3.6 Mutex (và Pthreads)</td><td>viết mutex bằng TSL, dùng mutex và biến điều kiện của pthread</td></tr>
<tr><td>45–50</td><td>2.3.7 Monitor</td><td>giải thích monitor bảo đảm điều gì; đọc bản Java</td></tr>
<tr><td>51–52</td><td>2.3.8 Truyền thông điệp</td><td>giải sản xuất–tiêu thụ không cần bộ nhớ dùng chung</td></tr>
<tr><td>53–55</td><td>2.3.9–2.3.10 Rào chắn, RCU</td><td>đồng bộ theo pha; đọc dữ liệu không cần khoá</td></tr>
</tbody>
</table>
<div class="callout">Các bài web cũ 2.5 (tranh chấp, bốn yêu cầu, semaphore, các cơ chế IPC, lock-free) và 2.6 (các bài toán kinh điển, monitor và channel) giữ làm bản tóm tắt; bài này đi từng slide và làm cho mọi cơ chế chạy được.</div>`),
    walkHead('osg2', 28, 55),
    walk('osg2', [
      [28, 'Race Conditions',
        `<p class="y-chinh">🎯 Figure 2-21: a <strong>spooler directory</strong> with slots 0, 1, 2, … for files to print; two shared variables <code>out</code> = 4 (next file to print) and <code>in</code> = 7 (next free slot). Processes A and B decide almost simultaneously to print a file — both read <code>in</code> = 7.</p>
<p>The book's story: A reads <code>in</code> (7) into a local variable <code>next_free_slot</code>; a clock interrupt arrives and the CPU switches to B. B also reads <code>in</code> (still 7), stores the name of its file in slot 7, sets <code>in</code> to 8, and goes on. Later A runs again from where it stopped: it writes its file name into slot 7 — erasing B's — and sets <code>in</code> to 8. The directory looks consistent, the printer daemon notices nothing wrong, and B's file is never printed. A <strong>race condition</strong> is exactly this: two or more processes read or write shared data and the final result depends on who runs precisely when. The simulator executes the three statements of each process with the bad schedule:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/61fdb68a31e5415fab7ae26aefdd1c7440617dd9.svg" alt="Figure 2-21 step by step: A is switched out between reading &quot;in&quot; and updating it" loading="lazy" /><p class="chu-thich">🧮 Figure 2-21 step by step: A is switched out between reading "in" and updating it</p></div>
<details><summary>Step-by-step trace</summary>
<table>
<thead><tr><th>t</th><th>who</th><th>what happens in this step</th><th>in</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>A</td><td>A: next_free_slot = in (= 7)</td><td>7</td></tr>
<tr><td>1→2</td><td>B</td><td>B: next_free_slot = in (= 7)</td><td>7</td></tr>
<tr><td>2→3</td><td>B</td><td>B: slot[7] = "b.txt"</td><td>7</td></tr>
<tr><td>3→4</td><td>B</td><td>B: in = next_free_slot + 1 = 8</td><td>8</td></tr>
<tr><td>4→5</td><td>A</td><td>A: slot[7] = "a.txt"</td><td>8</td></tr>
<tr><td>5→6</td><td>A</td><td>A: in = next_free_slot + 1 = 8</td><td>8</td></tr>
</tbody>
</table>
</details>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">function* spoolA(s, l) {
  l.next = s.in;                    yield { n: &#96;next=&#36;{l.next}&#96;, d: &#96;A: next_free_slot = in (= &#36;{l.next})&#96; };
  s.slot[l.next] = 'a.txt';         yield { n: &#96;slot&#36;{l.next}=a&#96;, d: &#96;A: slot[&#36;{l.next}] = "a.txt"&#96; };
  s.in = l.next + 1;                yield { n: &#96;in=&#36;{s.in}&#96;, d: &#96;A: in = next_free_slot + 1 = &#36;{s.in}&#96; };
}
function* spoolB(s, l) {
  l.next = s.in;                    yield { n: &#96;next=&#36;{l.next}&#96;, d: &#96;B: next_free_slot = in (= &#36;{l.next})&#96; };
  s.slot[l.next] = 'b.txt';         yield { n: &#96;slot&#36;{l.next}=b&#96;, d: &#96;B: slot[&#36;{l.next}] = "b.txt"&#96; };
  s.in = l.next + 1;                yield { n: &#96;in=&#36;{s.in}&#96;, d: &#96;B: in = next_free_slot + 1 = &#36;{s.in}&#96; };
}
const tang = (ten) =&gt; function* (s, l) {   // counter = counter + 1, as the CPU really does it
  {
    l.r = s.counter;                yield { n: &#96;LOAD &#36;{l.r}&#96;, d: &#96;&#36;{ten}: LOAD R, counter   (R = &#36;{l.r})&#96; };
    l.r = l.r + 1;                  yield { n: &#96;ADD &#36;{l.r}&#96;, d: &#96;&#36;{ten}: ADD R, 1          (R = &#36;{l.r})&#96; };
    s.counter = l.r;                yield { n: &#96;STORE &#36;{l.r}&#96;, d: &#96;&#36;{ten}: STORE counter, R  (counter = &#36;{l.r})&#96; };
  }
};</code></pre></details>
<p>➕ The race is not a story. Why is even <code>counter = counter + 1</code> unsafe? Because the CPU executes it as three instructions:</p>
<div class="out"># Why is counter = counter + 1 not safe? Ask the compiler what the CPU will really execute (ARM64 here)<br>
$ cat &gt; tang.c &lt;&lt;'X'<br>
&gt; long counter;<br>
&gt; void increment(void) { counter = counter + 1; }<br>
&gt; X<br>
$ gcc -O2 -S tang.c -o - | grep -E '^\\s+(adrp|ldr|add|str)\\b'<br>
	adrp	x1, .LANCHOR0<br>
	ldr	x0, [x1, #:lo12:.LANCHOR0]<br>
	add	x0, x0, 1<br>
	str	x0, [x1, #:lo12:.LANCHOR0]<br>
# three instructions: LOAD (ldr), ADD (add), STORE (str) — a thread can be switched out between any two</div>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6031d7f66fb37323d3aa560c588c27367da40873.svg" alt="The same race on a counter: two LOADs of 5, two STOREs of 6" loading="lazy" /><p class="chu-thich">🧮 The same race on a counter: two LOADs of 5, two STOREs of 6</p></div>
<details><summary>Step-by-step trace</summary>
<table>
<thead><tr><th>t</th><th>who</th><th>what happens in this step</th><th>counter</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>T1</td><td>T1: LOAD R, counter   (R = 5)</td><td>5</td></tr>
<tr><td>1→2</td><td>T2</td><td>T2: LOAD R, counter   (R = 5)</td><td>5</td></tr>
<tr><td>2→3</td><td>T2</td><td>T2: ADD R, 1          (R = 6)</td><td>5</td></tr>
<tr><td>3→4</td><td>T2</td><td>T2: STORE counter, R  (counter = 6)</td><td>6</td></tr>
<tr><td>4→5</td><td>T1</td><td>T1: ADD R, 1          (R = 6)</td><td>6</td></tr>
<tr><td>5→6</td><td>T1</td><td>T1: STORE counter, R  (counter = 6)</td><td>6</td></tr>
</tbody>
</table>
</details>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">function* spoolA(s, l) {
  l.next = s.in;                    yield { n: &#96;next=&#36;{l.next}&#96;, d: &#96;A: next_free_slot = in (= &#36;{l.next})&#96; };
  s.slot[l.next] = 'a.txt';         yield { n: &#96;slot&#36;{l.next}=a&#96;, d: &#96;A: slot[&#36;{l.next}] = "a.txt"&#96; };
  s.in = l.next + 1;                yield { n: &#96;in=&#36;{s.in}&#96;, d: &#96;A: in = next_free_slot + 1 = &#36;{s.in}&#96; };
}
function* spoolB(s, l) {
  l.next = s.in;                    yield { n: &#96;next=&#36;{l.next}&#96;, d: &#96;B: next_free_slot = in (= &#36;{l.next})&#96; };
  s.slot[l.next] = 'b.txt';         yield { n: &#96;slot&#36;{l.next}=b&#96;, d: &#96;B: slot[&#36;{l.next}] = "b.txt"&#96; };
  s.in = l.next + 1;                yield { n: &#96;in=&#36;{s.in}&#96;, d: &#96;B: in = next_free_slot + 1 = &#36;{s.in}&#96; };
}
const tang = (ten) =&gt; function* (s, l) {   // counter = counter + 1, as the CPU really does it
  {
    l.r = s.counter;                yield { n: &#96;LOAD &#36;{l.r}&#96;, d: &#96;&#36;{ten}: LOAD R, counter   (R = &#36;{l.r})&#96; };
    l.r = l.r + 1;                  yield { n: &#96;ADD &#36;{l.r}&#96;, d: &#96;&#36;{ten}: ADD R, 1          (R = &#36;{l.r})&#96; };
    s.counter = l.r;                yield { n: &#96;STORE &#36;{l.r}&#96;, d: &#96;&#36;{ten}: STORE counter, R  (counter = &#36;{l.r})&#96; };
  }
};</code></pre></details>
<p>And the spooler, run for real: two threads each submit 1 000 000 files using exactly the three lines of the story:</p>
<pre><code class="language-c">// Figure 2-21 for real: two threads put file names into a spooler directory using a shared "in"
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

#define JOBS 1000000
int slot[2 * JOBS];          // the spooler directory: slot i holds a job (0 = empty)
int in = 0;                  // next free slot — SHARED
pthread_barrier_t start;     // both threads start at the same moment

void *print_files(void *arg) {
    int me = (int)(long)arg;
    pthread_barrier_wait(&amp;start);
    for (int i = 0; i &lt; JOBS; i++) {
        int next_free_slot = in;          // read "in"
        slot[next_free_slot] = me;        // put my file there
        in = next_free_slot + 1;          // update "in"
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_barrier_init(&amp;start, NULL, 2);
    pthread_create(&amp;a, NULL, print_files, (void *)1L);   // process A
    pthread_create(&amp;b, NULL, print_files, (void *)2L);   // process B
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("files submitted: %d\\n", 2 * JOBS);
    printf("final in       : %d\\n", in);
    printf("files lost     : %d (overwritten in the directory)\\n", 2 * JOBS - in);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread spooler.c -o spooler &amp;&amp; ./spooler<br>
files submitted: 2000000<br>
final in &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1871314<br>
files lost &nbsp;&nbsp;&nbsp;&nbsp;: 128686 (overwritten in the directory)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Hundreds of thousands of files lost in a fraction of a second, and a different number on each run — that is what makes races dangerous: the program passes a test and fails in production. (The ⭐ "Start here" lesson showed the same with a counter, <code>dem-hai-luong.c</code>.)</p>
<p class="pitfall">⚠️ FE9#47: "Which best describes a race condition?" — <strong>multiple processes access and manipulate shared data concurrently</strong> (and the outcome depends on the order). An infinite loop, a process waiting forever, or running out of memory are other problems.</p>`,
        `<p class="y-chinh">🎯 Hình 2-21: một <strong>thư mục spooler</strong> (hàng đợi in) với các ô 0, 1, 2, … chứa tệp cần in; hai biến dùng chung <code>out</code> = 4 (tệp kế tiếp sẽ in) và <code>in</code> = 7 (ô trống kế tiếp). Tiến trình A và B gần như cùng lúc quyết định in một tệp — cả hai đều đọc <code>in</code> = 7.</p>
<p>Câu chuyện của sách: A đọc <code>in</code> (7) vào biến cục bộ <code>next_free_slot</code>; một ngắt đồng hồ tới và CPU chuyển sang B. B cũng đọc <code>in</code> (vẫn là 7), ghi tên tệp của mình vào ô 7, đặt <code>in</code> = 8, rồi đi tiếp. Sau đó A chạy lại đúng từ chỗ đã dừng: nó ghi tên tệp của mình vào ô 7 — xoá mất tệp của B — và đặt <code>in</code> = 8. Thư mục trông vẫn nhất quán, daemon máy in không thấy gì sai, và tệp của B không bao giờ được in. <strong>Tình trạng tranh chấp (race condition)</strong> chính là thế này: hai hay nhiều tiến trình đọc hoặc ghi dữ liệu dùng chung và kết quả cuối cùng phụ thuộc vào việc ai chạy đúng lúc nào. Bộ mô phỏng thực thi ba câu lệnh của mỗi tiến trình theo lịch chạy xấu:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/0936cd38fbebb507cefb3ad7a193f4645d06ce23.svg" alt="Hình 2-21 từng bước: A bị chuyển ra giữa lúc đọc &quot;in&quot; và lúc cập nhật nó" loading="lazy" /><p class="chu-thich">🧮 Hình 2-21 từng bước: A bị chuyển ra giữa lúc đọc "in" và lúc cập nhật nó</p></div>
<details><summary>Vết từng bước</summary>
<table>
<thead><tr><th>t</th><th>ai</th><th>việc xảy ra trong bước này</th><th>in</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>A</td><td>A: next_free_slot = in (= 7)</td><td>7</td></tr>
<tr><td>1→2</td><td>B</td><td>B: next_free_slot = in (= 7)</td><td>7</td></tr>
<tr><td>2→3</td><td>B</td><td>B: slot[7] = "b.txt"</td><td>7</td></tr>
<tr><td>3→4</td><td>B</td><td>B: in = next_free_slot + 1 = 8</td><td>8</td></tr>
<tr><td>4→5</td><td>A</td><td>A: slot[7] = "a.txt"</td><td>8</td></tr>
<tr><td>5→6</td><td>A</td><td>A: in = next_free_slot + 1 = 8</td><td>8</td></tr>
</tbody>
</table>
</details>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">function* spoolA(s, l) {
  l.next = s.in;                    yield { n: &#96;next=&#36;{l.next}&#96;, d: &#96;A: next_free_slot = in (= &#36;{l.next})&#96; };
  s.slot[l.next] = 'a.txt';         yield { n: &#96;slot&#36;{l.next}=a&#96;, d: &#96;A: slot[&#36;{l.next}] = "a.txt"&#96; };
  s.in = l.next + 1;                yield { n: &#96;in=&#36;{s.in}&#96;, d: &#96;A: in = next_free_slot + 1 = &#36;{s.in}&#96; };
}
function* spoolB(s, l) {
  l.next = s.in;                    yield { n: &#96;next=&#36;{l.next}&#96;, d: &#96;B: next_free_slot = in (= &#36;{l.next})&#96; };
  s.slot[l.next] = 'b.txt';         yield { n: &#96;slot&#36;{l.next}=b&#96;, d: &#96;B: slot[&#36;{l.next}] = "b.txt"&#96; };
  s.in = l.next + 1;                yield { n: &#96;in=&#36;{s.in}&#96;, d: &#96;B: in = next_free_slot + 1 = &#36;{s.in}&#96; };
}
const tang = (ten) =&gt; function* (s, l) {   // counter = counter + 1, as the CPU really does it
  {
    l.r = s.counter;                yield { n: &#96;LOAD &#36;{l.r}&#96;, d: &#96;&#36;{ten}: LOAD R, counter   (R = &#36;{l.r})&#96; };
    l.r = l.r + 1;                  yield { n: &#96;ADD &#36;{l.r}&#96;, d: &#96;&#36;{ten}: ADD R, 1          (R = &#36;{l.r})&#96; };
    s.counter = l.r;                yield { n: &#96;STORE &#36;{l.r}&#96;, d: &#96;&#36;{ten}: STORE counter, R  (counter = &#36;{l.r})&#96; };
  }
};</code></pre></details>
<p>➕ Tranh chấp không phải chuyện kể. Vì sao đến <code>counter = counter + 1</code> cũng không an toàn? Vì CPU thực thi nó bằng ba lệnh:</p>
<div class="out"># Vì sao counter = counter + 1 không an toàn? Hỏi trình biên dịch xem CPU thật sự chạy gì (ở đây là ARM64)<br>
$ cat &gt; tang.c &lt;&lt;'X'<br>
&gt; long counter;<br>
&gt; void increment(void) { counter = counter + 1; }<br>
&gt; X<br>
$ gcc -O2 -S tang.c -o - | grep -E '^\\s+(adrp|ldr|add|str)\\b'<br>
	adrp	x1, .LANCHOR0<br>
	ldr	x0, [x1, #:lo12:.LANCHOR0]<br>
	add	x0, x0, 1<br>
	str	x0, [x1, #:lo12:.LANCHOR0]<br>
# ba lệnh: NẠP (ldr), CỘNG (add), GHI (str) — luồng có thể bị chuyển đi giữa hai lệnh bất kỳ</div>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4c22a54de136c38bb1e6b91c52927870c0695542.svg" alt="Cùng kiểu tranh chấp trên một bộ đếm: hai lần LOAD được 5, hai lần STORE ghi 6" loading="lazy" /><p class="chu-thich">🧮 Cùng kiểu tranh chấp trên một bộ đếm: hai lần LOAD được 5, hai lần STORE ghi 6</p></div>
<details><summary>Vết từng bước</summary>
<table>
<thead><tr><th>t</th><th>ai</th><th>việc xảy ra trong bước này</th><th>counter</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>T1</td><td>T1: LOAD R, counter   (R = 5)</td><td>5</td></tr>
<tr><td>1→2</td><td>T2</td><td>T2: LOAD R, counter   (R = 5)</td><td>5</td></tr>
<tr><td>2→3</td><td>T2</td><td>T2: ADD R, 1          (R = 6)</td><td>5</td></tr>
<tr><td>3→4</td><td>T2</td><td>T2: STORE counter, R  (counter = 6)</td><td>6</td></tr>
<tr><td>4→5</td><td>T1</td><td>T1: ADD R, 1          (R = 6)</td><td>6</td></tr>
<tr><td>5→6</td><td>T1</td><td>T1: STORE counter, R  (counter = 6)</td><td>6</td></tr>
</tbody>
</table>
</details>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">function* spoolA(s, l) {
  l.next = s.in;                    yield { n: &#96;next=&#36;{l.next}&#96;, d: &#96;A: next_free_slot = in (= &#36;{l.next})&#96; };
  s.slot[l.next] = 'a.txt';         yield { n: &#96;slot&#36;{l.next}=a&#96;, d: &#96;A: slot[&#36;{l.next}] = "a.txt"&#96; };
  s.in = l.next + 1;                yield { n: &#96;in=&#36;{s.in}&#96;, d: &#96;A: in = next_free_slot + 1 = &#36;{s.in}&#96; };
}
function* spoolB(s, l) {
  l.next = s.in;                    yield { n: &#96;next=&#36;{l.next}&#96;, d: &#96;B: next_free_slot = in (= &#36;{l.next})&#96; };
  s.slot[l.next] = 'b.txt';         yield { n: &#96;slot&#36;{l.next}=b&#96;, d: &#96;B: slot[&#36;{l.next}] = "b.txt"&#96; };
  s.in = l.next + 1;                yield { n: &#96;in=&#36;{s.in}&#96;, d: &#96;B: in = next_free_slot + 1 = &#36;{s.in}&#96; };
}
const tang = (ten) =&gt; function* (s, l) {   // counter = counter + 1, as the CPU really does it
  {
    l.r = s.counter;                yield { n: &#96;LOAD &#36;{l.r}&#96;, d: &#96;&#36;{ten}: LOAD R, counter   (R = &#36;{l.r})&#96; };
    l.r = l.r + 1;                  yield { n: &#96;ADD &#36;{l.r}&#96;, d: &#96;&#36;{ten}: ADD R, 1          (R = &#36;{l.r})&#96; };
    s.counter = l.r;                yield { n: &#96;STORE &#36;{l.r}&#96;, d: &#96;&#36;{ten}: STORE counter, R  (counter = &#36;{l.r})&#96; };
  }
};</code></pre></details>
<p>Và thư mục spooler, chạy thật: hai luồng mỗi luồng nộp 1 000 000 tệp bằng đúng ba dòng của câu chuyện:</p>
<pre><code class="language-c">// Hình 2-21 làm thật: hai luồng ghi tên tệp vào thư mục spooler, dùng chung biến "in"
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

#define JOBS 1000000
int slot[2 * JOBS];          // thư mục spooler: ô i giữ một job (0 = trống)
int in = 0;                  // ô trống kế tiếp — DÙNG CHUNG
pthread_barrier_t start;     // hai luồng xuất phát cùng một lúc

void *print_files(void *arg) {
    int me = (int)(long)arg;
    pthread_barrier_wait(&amp;start);
    for (int i = 0; i &lt; JOBS; i++) {
        int next_free_slot = in;          // đọc "in"
        slot[next_free_slot] = me;        // đặt tệp của mình vào đó
        in = next_free_slot + 1;          // cập nhật "in"
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_barrier_init(&amp;start, NULL, 2);
    pthread_create(&amp;a, NULL, print_files, (void *)1L);   // tiến trình A
    pthread_create(&amp;b, NULL, print_files, (void *)2L);   // tiến trình B
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("files submitted: %d\\n", 2 * JOBS);
    printf("final in       : %d\\n", in);
    printf("files lost     : %d (overwritten in the directory)\\n", 2 * JOBS - in);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread spooler.c -o spooler &amp;&amp; ./spooler<br>
files submitted: 2000000<br>
final in &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1871314<br>
files lost &nbsp;&nbsp;&nbsp;&nbsp;: 128686 (overwritten in the directory)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Hàng trăm nghìn tệp mất trong chưa tới một giây, và mỗi lần chạy ra một số khác — đó là điều làm tranh chấp nguy hiểm: chương trình qua được phép thử rồi hỏng trên môi trường thật. (Bài ⭐ "Bắt đầu tại đây" đã cho thấy điều tương tự với một bộ đếm, <code>dem-hai-luong.c</code>.)</p>
<p class="pitfall">⚠️ FE9#47: "Mô tả nào đúng nhất về race condition?" — <strong>nhiều tiến trình cùng truy cập và thao tác trên dữ liệu dùng chung một cách đồng thời</strong> (và kết quả phụ thuộc thứ tự). Vòng lặp vô hạn, tiến trình chờ mãi, hay hết bộ nhớ là những vấn đề khác.</p>`],
      [29, 'Critical Regions (1)',
        `<p class="y-chinh">🎯 Four requirements for a good solution to race conditions: (1) no two processes may be simultaneously inside their critical regions; (2) no assumptions may be made about speeds or the number of CPUs; (3) no process running outside its critical region may block other processes; (4) no process should have to wait forever to enter its critical region.</p>
<p>The part of a program that accesses shared memory is its <strong>critical region</strong> (or critical section). Races disappear if we arrange that no two processes are ever in their critical regions at the same time — <strong>mutual exclusion</strong>. But mutual exclusion alone is easy to get in a useless way (never let anyone in!), so conditions 2–4 rule out cheating: the solution must work on any hardware and any timing (2), a process that is not even interested must not hold others up (3, often called <strong>progress</strong>), and nobody may starve (4, <strong>bounded waiting</strong>).</p>
<table>
<thead><tr><th>Condition on the slide</th><th>Name used in other textbooks and FE answers</th><th>Violated by</th></tr></thead>
<tbody>
<tr><td>1. no two inside at once</td><td>mutual exclusion</td><td>no lock at all (slide 28)</td></tr>
<tr><td>2. no assumptions about speed or CPUs</td><td>—</td><td>"it never happened in my test"</td></tr>
<tr><td>3. outside processes don't block</td><td>progress</td><td>strict alternation (slide 31)</td></tr>
<tr><td>4. nobody waits forever</td><td>bounded waiting (no starvation)</td><td>unfair locks, readers–writers (slide 72)</td></tr>
</tbody>
</table>
<p>➕ Every solution in the rest of the lesson is graded against these four lines; keep the table in mind. In practice a fifth requirement matters too: <strong>efficiency</strong> — a waiting process should not burn the CPU (busy waiting, slides 31–34, versus blocking, slides 35+).</p>
<p class="pitfall">⚠️ FE3#8 / FE7#13 / FE8#12: "When a process is running in its critical zone, no other process runs in the same zone — this condition is called?" — <strong>mutual exclusion</strong>. Bounded waiting and progress are conditions 4 and 3.</p>`,
        `<p class="y-chinh">🎯 Bốn yêu cầu cho một lời giải tốt chống tranh chấp: (1) không có hai tiến trình nào cùng lúc ở trong vùng găng của chúng; (2) không được giả định gì về tốc độ hay số lượng CPU; (3) tiến trình đang chạy ngoài vùng găng không được chặn tiến trình khác; (4) không tiến trình nào phải chờ mãi mãi để vào vùng găng.</p>
<p>Phần chương trình truy cập bộ nhớ dùng chung là <strong>vùng găng (critical region)</strong>, còn gọi đoạn găng/miền găng (critical section). Tranh chấp biến mất nếu ta sắp xếp để không bao giờ có hai tiến trình cùng ở trong vùng găng — <strong>loại trừ tương hỗ (mutual exclusion)</strong>. Nhưng riêng loại trừ tương hỗ thì dễ đạt theo kiểu vô dụng (đừng cho ai vào!), nên điều kiện 2–4 chặn kiểu gian lận đó: lời giải phải đúng trên mọi phần cứng và mọi nhịp thời gian (2), tiến trình còn chẳng muốn vào thì không được cản người khác (3, thường gọi là <strong>tiến triển — progress</strong>), và không ai bị bỏ đói (4, <strong>chờ có giới hạn — bounded waiting</strong>).</p>
<table>
<thead><tr><th>Điều kiện trên slide</th><th>Tên trong giáo trình khác và đáp án FE</th><th>Bị vi phạm bởi</th></tr></thead>
<tbody>
<tr><td>1. không hai tiến trình cùng ở trong</td><td>loại trừ tương hỗ (mutual exclusion)</td><td>không khoá gì cả (slide 28)</td></tr>
<tr><td>2. không giả định tốc độ hay số CPU</td><td>—</td><td>"trong lúc tôi thử chưa thấy lỗi"</td></tr>
<tr><td>3. tiến trình ở ngoài không chặn ai</td><td>tiến triển (progress)</td><td>luân phiên nghiêm ngặt (slide 31)</td></tr>
<tr><td>4. không ai chờ mãi</td><td>chờ có giới hạn (không đói)</td><td>khoá không công bằng, đọc–ghi (slide 72)</td></tr>
</tbody>
</table>
<p>➕ Mọi lời giải trong phần còn lại của bài đều được chấm theo bốn dòng này; hãy nhớ bảng. Trong thực tế còn một yêu cầu thứ năm: <strong>hiệu quả</strong> — tiến trình đang chờ không nên đốt CPU (chờ bận, slide 31–34, so với bị chặn, slide 35 trở đi).</p>
<p class="pitfall">⚠️ FE3#8 / FE7#13 / FE8#12: "Khi một tiến trình đang chạy trong vùng găng thì không tiến trình nào khác chạy trong vùng đó — điều kiện này gọi là?" — <strong>mutual exclusion</strong> (loại trừ tương hỗ). Bounded waiting và progress là điều kiện 4 và 3.</p>`],
      [30, 'Critical Regions (2)',
        `<p class="y-chinh">🎯 Figure 2-22: mutual exclusion over time — A enters its critical region at T1; at T2 B attempts to enter but is <strong>blocked</strong>; at T3 A leaves and B enters at once; at T4 B leaves.</p>
<p>This is the behaviour we want from any solution: between T2 and T3 B is held back (the dotted part of its line), and the moment A leaves, B gets in. Nothing in the figure says <em>how</em> B is held back; slides 31–34 make it spin in a loop, slides 35 onwards put it to sleep. In the simulation below, the region is protected by a mutex (slide 39) and the scheduler switches between A and B on its own:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ca22a056a2865d89ba95cf5c3828097e113eae9f.svg" alt="Figure 2-22 executed: B is blocked from its lock attempt until A unlocks" loading="lazy" /><p class="chu-thich">🧮 Figure 2-22 executed: B is blocked from its lock attempt until A unlocks</p></div>
<details><summary>Step-by-step trace</summary>
<table>
<thead><tr><th>t</th><th>who</th><th>what happens in this step</th><th>m</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>A</td><td>A: noncritical code</td><td>1</td></tr>
<tr><td>1→2</td><td>A</td><td>A: lock(m) — free, A enters (T1)</td><td>0</td></tr>
<tr><td>2→3</td><td>A</td><td>A: critical region, step 1</td><td>0</td></tr>
<tr><td>3→4</td><td>B</td><td>B: noncritical code</td><td>0</td></tr>
<tr><td>4→5</td><td>B</td><td>B: lock(m) — taken by A (T2) — <strong>blocks</strong></td><td>0</td></tr>
<tr><td>5→6</td><td>A</td><td>A: critical region, step 2</td><td>0</td></tr>
<tr><td>6→7</td><td>A</td><td>A: critical region, step 3</td><td>0</td></tr>
<tr><td>7→8</td><td>A</td><td>A: critical region, step 4</td><td>0</td></tr>
<tr><td>8→9</td><td>A</td><td>A: unlock(m) — wakes B (T3)</td><td>0</td></tr>
<tr><td>9→10</td><td>A</td><td>A: noncritical code</td><td>0</td></tr>
<tr><td>10→11</td><td>B</td><td>B: critical region, step 1</td><td>0</td></tr>
<tr><td>11→12</td><td>B</td><td>B: critical region, step 2</td><td>0</td></tr>
<tr><td>12→13</td><td>B</td><td>B: critical region, step 3</td><td>0</td></tr>
<tr><td>13→14</td><td>B</td><td>B: unlock(m) — leaves (T4)</td><td>1</td></tr>
</tbody>
</table>
</details>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">function* A(s) {
  yield { n: 'other', d: 'A: noncritical code' };
  yield { lock: 'm', n: 'lock', d: 'A: lock(m) — free, A enters (T1)' };
  for (let i = 1; i &lt;= 4; i++) yield { n: &#96;CR &#36;{i}&#96;, d: &#96;A: critical region, step &#36;{i}&#96; };
  yield { unlock: 'm', n: 'unlock', d: 'A: unlock(m) — wakes B (T3)' };
  yield { n: 'other', d: 'A: noncritical code' };
}
function* B(s) {
  yield { n: 'other', d: 'B: noncritical code' };
  yield { lock: 'm', n: 'lock', d: 'B: lock(m) — taken by A (T2)' };
  for (let i = 1; i &lt;= 3; i++) yield { n: &#96;CR &#36;{i}&#96;, d: &#96;B: critical region, step &#36;{i}&#96; };
  yield { unlock: 'm', n: 'unlock', d: 'B: unlock(m) — leaves (T4)' };
}</code></pre></details>
<p>➕ Read the trace: B's <code>lock</code> found the mutex taken and B became blocked; the scheduler ran only A (B could not run anyway); A's <code>unlock</code> woke B, and B continued inside its critical region. If you count the time B spent blocked you get the "B blocked" interval of the book's figure. Note also what the figure assumes implicitly: the critical regions are <strong>short</strong>. A long critical region makes everyone else wait — on a real server, a lock held while calling a slow HTTP service serializes the whole application.</p>
<p class="meo">🧠 Picture a single-occupancy bathroom with a lock: T1 A locks the door; T2 B tries the handle and waits; T3 A comes out, B goes in; T4 B comes out. The four conditions say: only one inside, works whatever the people's speed, nobody standing outside the door blocks it, and nobody waits forever.</p>`,
        `<p class="y-chinh">🎯 Hình 2-22: loại trừ tương hỗ theo thời gian — A vào vùng găng lúc T1; lúc T2 B thử vào nhưng <strong>bị chặn</strong>; lúc T3 A ra và B vào ngay; lúc T4 B ra.</p>
<p>Đây là hành vi ta muốn từ mọi lời giải: giữa T2 và T3 B bị giữ lại (đoạn chấm trên đường của nó), và ngay khi A ra, B vào được. Hình không nói B bị giữ lại <em>bằng cách nào</em>; slide 31–34 bắt nó quay vòng trong một vòng lặp, slide 35 trở đi cho nó ngủ. Trong mô phỏng dưới đây, vùng găng được bảo vệ bằng một mutex (slide 39) và bộ lập lịch tự chuyển qua lại giữa A và B:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ee925c5ae6ecc98c8841386a1198aac35ab419b9.svg" alt="Hình 2-22 được thực thi: B bị chặn từ lần thử khoá cho tới khi A mở khoá" loading="lazy" /><p class="chu-thich">🧮 Hình 2-22 được thực thi: B bị chặn từ lần thử khoá cho tới khi A mở khoá</p></div>
<details><summary>Vết từng bước</summary>
<table>
<thead><tr><th>t</th><th>ai</th><th>việc xảy ra trong bước này</th><th>m</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>A</td><td>A: noncritical code</td><td>1</td></tr>
<tr><td>1→2</td><td>A</td><td>A: lock(m) — free, A enters (T1)</td><td>0</td></tr>
<tr><td>2→3</td><td>A</td><td>A: critical region, step 1</td><td>0</td></tr>
<tr><td>3→4</td><td>B</td><td>B: noncritical code</td><td>0</td></tr>
<tr><td>4→5</td><td>B</td><td>B: lock(m) — taken by A (T2) — <strong>bị chặn</strong></td><td>0</td></tr>
<tr><td>5→6</td><td>A</td><td>A: critical region, step 2</td><td>0</td></tr>
<tr><td>6→7</td><td>A</td><td>A: critical region, step 3</td><td>0</td></tr>
<tr><td>7→8</td><td>A</td><td>A: critical region, step 4</td><td>0</td></tr>
<tr><td>8→9</td><td>A</td><td>A: unlock(m) — wakes B (T3)</td><td>0</td></tr>
<tr><td>9→10</td><td>A</td><td>A: noncritical code</td><td>0</td></tr>
<tr><td>10→11</td><td>B</td><td>B: critical region, step 1</td><td>0</td></tr>
<tr><td>11→12</td><td>B</td><td>B: critical region, step 2</td><td>0</td></tr>
<tr><td>12→13</td><td>B</td><td>B: critical region, step 3</td><td>0</td></tr>
<tr><td>13→14</td><td>B</td><td>B: unlock(m) — leaves (T4)</td><td>1</td></tr>
</tbody>
</table>
</details>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">function* A(s) {
  yield { n: 'other', d: 'A: noncritical code' };
  yield { lock: 'm', n: 'lock', d: 'A: lock(m) — free, A enters (T1)' };
  for (let i = 1; i &lt;= 4; i++) yield { n: &#96;CR &#36;{i}&#96;, d: &#96;A: critical region, step &#36;{i}&#96; };
  yield { unlock: 'm', n: 'unlock', d: 'A: unlock(m) — wakes B (T3)' };
  yield { n: 'other', d: 'A: noncritical code' };
}
function* B(s) {
  yield { n: 'other', d: 'B: noncritical code' };
  yield { lock: 'm', n: 'lock', d: 'B: lock(m) — taken by A (T2)' };
  for (let i = 1; i &lt;= 3; i++) yield { n: &#96;CR &#36;{i}&#96;, d: &#96;B: critical region, step &#36;{i}&#96; };
  yield { unlock: 'm', n: 'unlock', d: 'B: unlock(m) — leaves (T4)' };
}</code></pre></details>
<p>➕ Đọc vết: lệnh <code>lock</code> của B thấy mutex đã có người giữ và B bị chặn; bộ lập lịch chỉ chạy A (B đằng nào cũng không chạy được); lệnh <code>unlock</code> của A đánh thức B, và B đi tiếp vào trong vùng găng. Đếm thời gian B bị chặn là được đúng đoạn "B blocked" trong hình của sách. Cũng để ý điều hình ngầm giả định: vùng găng <strong>ngắn</strong>. Vùng găng dài bắt mọi người khác phải chờ — trên server thật, giữ khoá trong lúc gọi một dịch vụ HTTP chậm là tuần tự hoá cả ứng dụng.</p>
<p class="meo">🧠 Hình dung một nhà vệ sinh một chỗ có khoá: T1 A khoá cửa; T2 B vặn tay nắm và đứng chờ; T3 A ra, B vào; T4 B ra. Bốn điều kiện nói: chỉ một người bên trong, đúng với mọi tốc độ của người, người đứng ngoài không chặn cửa, và không ai chờ mãi.</p>`],
      [31, 'Mutual Exclusion with Busy Waiting: Strict Alternation',
        `<p class="y-chinh">🎯 Figure 2-23: a proposed solution with an integer <code>turn</code>, initially 0. Process 0: <code>while (TRUE) { while (turn != 0) /* loop */ ; critical_region(); turn = 1; noncritical_region(); }</code>; process 1 is the mirror image (<code>turn != 1</code>, then <code>turn = 0</code>). Note the semicolons ending the inner <code>while</code> statements: the loop body is empty.</p>
<p>Continuously testing a variable until a value appears is called <strong>busy waiting</strong>; a lock that uses it is a <strong>spin lock</strong>. Strict alternation does give mutual exclusion — <code>turn</code> is 0 or 1, never both. But it violates condition 3: the two processes must take turns <em>strictly</em>. If process 0 is slow outside its critical region (in <code>noncritical_region</code>) while process 1 wants to enter twice in a row, process 1 is stuck waiting for process 0 even though nobody is in the critical region. The book: "taking turns is not a good idea when one of the processes is much slower than the other".</p>
<p>➕ Measured: process 0 spends 300 ms in its noncritical region; process 1 is fast and wants to enter three times:</p>
<pre><code class="language-c">// Figure 2-23, strict alternation: correct, but process 1 waits for process 0 even when 0 is far away
#include &lt;stdio.h&gt;
#include &lt;stdatomic.h&gt;
#include &lt;pthread.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;

atomic_int turn = 0;                                 // whose turn is it?

static double now_ms(void) {
    struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t);
    return t.tv_sec * 1e3 + t.tv_nsec / 1e6;
}

void *process0(void *arg) {                          // (a) process 0: slow outside its critical region
    for (int i = 0; i &lt; 3; i++) {
        while (turn != 0) ;                          // loop
        /* critical_region(); */
        turn = 1;
        usleep(300 * 1000);                          // noncritical_region() takes 300 ms
    }
    return NULL;
}

void *process1(void *arg) {                          // (b) process 1: fast, wants to enter often
    double longest = 0;
    for (int i = 0; i &lt; 3; i++) {
        double t0 = now_ms();
        while (turn != 1) ;                          // loop — busy waiting
        double w = now_ms() - t0;
        if (w &gt; longest) longest = w;
        printf("process 1 entered round %d after waiting %4.0f ms\\n", i, w);
        turn = 0;
        /* noncritical_region(); — takes almost no time */
    }
    printf("longest wait of process 1: %.0f ms, although nobody was inside the critical region\\n", longest);
    return NULL;
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    pthread_t a, b;
    pthread_create(&amp;a, NULL, process0, NULL);
    pthread_create(&amp;b, NULL, process1, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread luan-phien.c -o luan-phien &amp;&amp; ./luan-phien<br>
process 1 entered round 0 after waiting &nbsp;&nbsp;&nbsp;0 ms<br>
process 1 entered round 1 after waiting &nbsp;303 ms<br>
process 1 entered round 2 after waiting &nbsp;311 ms<br>
longest wait of process 1: 311 ms, although nobody was inside the critical region</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Each time, process 1 waited about 300 ms — the duration of process 0's noncritical work — with the critical region empty, and it burned a whole CPU core while waiting. (The program uses C11 <code>atomic_int</code> for <code>turn</code>; with a plain <code>int</code> the compiler or CPU could cache it, see slide 32.)</p>
<p class="pitfall">⚠️ Exam phrasing: strict alternation satisfies mutual exclusion but <strong>not progress</strong> (condition 3), and it wastes CPU with busy waiting.</p>`,
        `<p class="y-chinh">🎯 Hình 2-23: một lời giải đề xuất với biến nguyên <code>turn</code>, ban đầu bằng 0. Tiến trình 0: <code>while (TRUE) { while (turn != 0) /* loop */ ; critical_region(); turn = 1; noncritical_region(); }</code>; tiến trình 1 là ảnh gương (<code>turn != 1</code>, rồi <code>turn = 0</code>). Để ý các dấu chấm phẩy kết thúc các câu <code>while</code> bên trong: thân vòng lặp rỗng.</p>
<p>Liên tục kiểm tra một biến cho tới khi nó có giá trị mong muốn gọi là <strong>chờ bận (busy waiting)</strong>; khoá dùng cách này là <strong>khoá quay (spin lock)</strong>. Luân phiên nghiêm ngặt có cho loại trừ tương hỗ — <code>turn</code> là 0 hoặc 1, không bao giờ cả hai. Nhưng nó vi phạm điều kiện 3: hai tiến trình phải thay phiên <em>nghiêm ngặt</em>. Nếu tiến trình 0 chậm ở ngoài vùng găng (trong <code>noncritical_region</code>) mà tiến trình 1 muốn vào hai lần liền, tiến trình 1 bị kẹt chờ tiến trình 0 dù chẳng ai ở trong vùng găng. Sách nói: "thay phiên không phải ý hay khi một tiến trình chậm hơn hẳn tiến trình kia".</p>
<p>➕ Đo thật: tiến trình 0 ở trong vùng không găng 300 ms; tiến trình 1 nhanh và muốn vào ba lần:</p>
<pre><code class="language-c">// Hình 2-23, luân phiên nghiêm ngặt: đúng, nhưng tiến trình 1 phải chờ tiến trình 0 dù 0 đang ở rất xa
#include &lt;stdio.h&gt;
#include &lt;stdatomic.h&gt;
#include &lt;pthread.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;

atomic_int turn = 0;                                 // tới lượt ai?

static double now_ms(void) {
    struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t);
    return t.tv_sec * 1e3 + t.tv_nsec / 1e6;
}

void *process0(void *arg) {                          // (a) tiến trình 0: chậm ở ngoài vùng găng
    for (int i = 0; i &lt; 3; i++) {
        while (turn != 0) ;                          // vòng lặp chờ
        /* critical_region(); */
        turn = 1;
        usleep(300 * 1000);                          // noncritical_region() mất 300 ms
    }
    return NULL;
}

void *process1(void *arg) {                          // (b) tiến trình 1: nhanh, muốn vào liên tục
    double longest = 0;
    for (int i = 0; i &lt; 3; i++) {
        double t0 = now_ms();
        while (turn != 1) ;                          // vòng lặp — chờ bận
        double w = now_ms() - t0;
        if (w &gt; longest) longest = w;
        printf("process 1 entered round %d after waiting %4.0f ms\\n", i, w);
        turn = 0;
        /* noncritical_region(); — takes almost no time */
    }
    printf("longest wait of process 1: %.0f ms, although nobody was inside the critical region\\n", longest);
    return NULL;
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    pthread_t a, b;
    pthread_create(&amp;a, NULL, process0, NULL);
    pthread_create(&amp;b, NULL, process1, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread luan-phien.c -o luan-phien &amp;&amp; ./luan-phien<br>
process 1 entered round 0 after waiting &nbsp;&nbsp;&nbsp;0 ms<br>
process 1 entered round 1 after waiting &nbsp;303 ms<br>
process 1 entered round 2 after waiting &nbsp;311 ms<br>
longest wait of process 1: 311 ms, although nobody was inside the critical region</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Lần nào tiến trình 1 cũng chờ khoảng 300 ms — đúng thời gian tiến trình 0 làm việc không găng — trong khi vùng găng trống, và nó đốt trọn một lõi CPU trong lúc chờ. (Chương trình dùng <code>atomic_int</code> của C11 cho <code>turn</code>; với <code>int</code> thường, trình biên dịch hay CPU có thể giữ giá trị cũ, xem slide 32.)</p>
<p class="pitfall">⚠️ Cách đề thi hỏi: luân phiên nghiêm ngặt thoả loại trừ tương hỗ nhưng <strong>không thoả tiến triển (progress)</strong> (điều kiện 3), và phí CPU vì chờ bận.</p>`],
      [32, 'Mutual Exclusion with Busy Waiting: Peterson’s Solution',
        `<p class="y-chinh">🎯 Figure 2-24: <strong>Peterson's solution</strong> (1981) for two processes. Shared: <code>int turn; int interested[2];</code>. <code>enter_region(process)</code>: <code>other = 1 − process; interested[process] = TRUE; turn = process; while (turn == process &amp;&amp; interested[other] == TRUE) ;</code>. <code>leave_region(process)</code>: <code>interested[process] = FALSE;</code>.</p>
<p>How it works: a process announces its interest, then writes its own number into <code>turn</code>, then waits only while the other is interested <em>and</em> it was itself the last to write <code>turn</code>. If only process 0 is interested, it enters immediately (condition 3 is now satisfied, unlike strict alternation). If both call <code>enter_region</code> almost simultaneously, both store into <code>turn</code>; whichever store comes <strong>last</strong> is the one that counts, and that process waits — the other enters. The simulator plays the book's case: P0 writes <code>turn</code> first, P1 second:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c6316c88b77c5107001a12931aa2fb3b8b127ec6.svg" alt="Both processes enter_region at once: the last writer of turn (P1) spins until P0 leaves" loading="lazy" /><p class="chu-thich">🧮 Both processes enter_region at once: the last writer of turn (P1) spins until P0 leaves</p></div>
<details><summary>Step-by-step trace</summary>
<table>
<thead><tr><th>t</th><th>who</th><th>what happens in this step</th><th>turn</th><th>interested</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>P0</td><td>P0: interested[0] = TRUE</td><td>0</td><td>1 0</td></tr>
<tr><td>1→2</td><td>P1</td><td>P1: interested[1] = TRUE</td><td>0</td><td>1 1</td></tr>
<tr><td>2→3</td><td>P0</td><td>P0: turn = 0</td><td>0</td><td>1 1</td></tr>
<tr><td>3→4</td><td>P1</td><td>P1: turn = 1</td><td>1</td><td>1 1</td></tr>
<tr><td>4→5</td><td>P0</td><td>P0: while condition false — enters the critical region</td><td>1</td><td>1 1</td></tr>
<tr><td>5→6</td><td>P0</td><td>P0: critical region, step 1</td><td>1</td><td>1 1</td></tr>
<tr><td>6→7</td><td>P1</td><td>P1: while (turn == 1 &amp;&amp; interested[0]) — true, loop</td><td>1</td><td>1 1</td></tr>
<tr><td>7→8</td><td>P1</td><td>P1: while (turn == 1 &amp;&amp; interested[0]) — true, loop</td><td>1</td><td>1 1</td></tr>
<tr><td>8→9</td><td>P0</td><td>P0: critical region, step 2</td><td>1</td><td>1 1</td></tr>
<tr><td>9→10</td><td>P0</td><td>P0: critical region, step 3</td><td>1</td><td>1 1</td></tr>
<tr><td>10→11</td><td>P1</td><td>P1: while (turn == 1 &amp;&amp; interested[0]) — true, loop</td><td>1</td><td>1 1</td></tr>
<tr><td>11→12</td><td>P1</td><td>P1: while (turn == 1 &amp;&amp; interested[0]) — true, loop</td><td>1</td><td>1 1</td></tr>
<tr><td>12→13</td><td>P0</td><td>P0: leave_region: interested[0] = FALSE</td><td>1</td><td>0 1</td></tr>
<tr><td>13→14</td><td>P1</td><td>P1: while condition false — enters the critical region</td><td>1</td><td>0 1</td></tr>
<tr><td>14→15</td><td>P1</td><td>P1: critical region, step 1</td><td>1</td><td>0 1</td></tr>
<tr><td>15→16</td><td>P1</td><td>P1: critical region, step 2</td><td>1</td><td>0 1</td></tr>
<tr><td>16→17</td><td>P1</td><td>P1: critical region, step 3</td><td>1</td><td>0 1</td></tr>
<tr><td>17→18</td><td>P1</td><td>P1: leave_region: interested[1] = FALSE</td><td>1</td><td>0 0</td></tr>
</tbody>
</table>
</details>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const peterson = (me) =&gt; function* (s) {
  const other = 1 - me;
  s.interested[me] = 1;                 yield { n: &#96;int[&#36;{me}]=1&#96;, d: &#96;P&#36;{me}: interested[&#36;{me}] = TRUE&#96; };
  s.turn = me;                          yield { n: &#96;turn=&#36;{me}&#96;, d: &#96;P&#36;{me}: turn = &#36;{me}&#96; };
  while (s.turn === me &amp;&amp; s.interested[other] === 1) yield { quay: true, n: 'spin', d: &#96;P&#36;{me}: while (turn == &#36;{me} &amp;&amp; interested[&#36;{other}]) — true, loop&#96; };
  s.vao.push(&#96;P&#36;{me}&#96;);                 yield { n: 'test ok', d: &#96;P&#36;{me}: while condition false — enters the critical region&#96; };
  for (let i = 1; i &lt;= 3; i++) yield { n: &#96;CR &#36;{i}&#96;, d: &#96;P&#36;{me}: critical region, step &#36;{i}&#96; };
  s.interested[me] = 0;                 yield { n: &#96;int[&#36;{me}]=0&#96;, d: &#96;P&#36;{me}: leave_region: interested[&#36;{me}] = FALSE&#96; };
};
const tsl = (me) =&gt; function* (s, l) {
  for (;;) {
    l.reg = s.lock; s.lock = 1;         yield { n: &#96;TSL→&#36;{l.reg}&#96;, d: &#96;P&#36;{me}: TSL REGISTER,LOCK — REGISTER = &#36;{l.reg}, LOCK = 1 (one indivisible step)&#96; };
    if (l.reg === 0) break;
    yield { quay: true, n: 'JNE', d: &#96;P&#36;{me}: CMP REGISTER,#0 / JNE enter_region — lock was set, loop&#96; };
  }
  s.vao.push(&#96;P&#36;{me}&#96;);
  for (let i = 1; i &lt;= 3; i++) yield { n: &#96;CR &#36;{i}&#96;, d: &#96;P&#36;{me}: critical region, step &#36;{i}&#96; };
  s.lock = 0;                           yield { n: 'LOCK=0', d: &#96;P&#36;{me}: leave_region: MOVE LOCK,#0&#96; };
};</code></pre></details>
<p>➕ <strong>The slide is outdated on today's hardware.</strong> Peterson assumes every store is seen by the other CPU in program order. Modern CPUs (ARM64 and even x86) may let a <em>load</em> overtake an earlier <em>store</em> to a different address, so a process can read <code>interested[other] == FALSE</code> before its own <code>interested[process] = TRUE</code> is visible — both enter. Here is Figure 2-24 copied literally, used 5 000 000 times by each of two threads:</p>
<pre><code class="language-c">// Figure 2-24 copied from the book (plain int variables), used by two threads 5,000,000 times each
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

#define FALSE 0
#define TRUE  1
#define N     2                          /* number of processes */

int turn;                                /* whose turn is it? */
int interested[N];                       /* all values initially 0 (FALSE) */

void enter_region(int process) {         /* process is 0 or 1 */
    int other;                           /* number of the other process */
    other = 1 - process;                 /* the opposite of process */
    interested[process] = TRUE;          /* show that you are interested */
    turn = process;                      /* set flag */
    while (turn == process &amp;&amp; interested[other] == TRUE) /* null statement */ ;
}

void leave_region(int process) {         /* process: who is leaving */
    interested[process] = FALSE;         /* indicate departure from critical region */
}

long counter = 0;
pthread_barrier_t start;                 // both threads start together

void *work(void *arg) {
    int me = (int)(long)arg;
    pthread_barrier_wait(&amp;start);
    for (int i = 0; i &lt; 5000000; i++) {
        enter_region(me);
        counter = counter + 1;           // the critical region
        leave_region(me);
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_barrier_init(&amp;start, NULL, 2);
    pthread_create(&amp;a, NULL, work, (void *)0L);
    pthread_create(&amp;b, NULL, work, (void *)1L);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("expected = 10000000\\n");
    printf("total    = %ld\\n", counter);
    printf("lost     = %ld\\n", 10000000 - counter);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread peterson-sach.c -o peterson-sach &amp;&amp; ./peterson-sach<br>
expected = 10000000<br>
total &nbsp;&nbsp;&nbsp;= 9999865<br>
lost &nbsp;&nbsp;&nbsp;&nbsp;= 135</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Updates were lost: mutual exclusion failed. The fix is to tell the compiler and the CPU not to reorder — C11 sequentially consistent atomics (a full memory barrier on each access):</p>
<pre><code class="language-c">// The same algorithm with C11 atomics (sequentially consistent): the CPU may no longer reorder the stores and loads
#include &lt;stdio.h&gt;
#include &lt;stdatomic.h&gt;
#include &lt;pthread.h&gt;

atomic_int turn;
atomic_int interested[2];

void enter_region(int process) {
    int other = 1 - process;
    atomic_store(&amp;interested[process], 1);            // seq_cst store: a full barrier on ARM64 and x86
    atomic_store(&amp;turn, process);
    while (atomic_load(&amp;turn) == process &amp;&amp; atomic_load(&amp;interested[other]) == 1) ;
}

void leave_region(int process) { atomic_store(&amp;interested[process], 0); }

long counter = 0;

void *work(void *arg) {
    int me = (int)(long)arg;
    for (int i = 0; i &lt; 5000000; i++) {
        enter_region(me);
        counter = counter + 1;
        leave_region(me);
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&amp;a, NULL, work, (void *)0L);
    pthread_create(&amp;b, NULL, work, (void *)1L);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("expected = 10000000\\n");
    printf("total    = %ld\\n", counter);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread peterson-dung.c -o peterson-dung &amp;&amp; ./peterson-dung<br>
expected = 10000000<br>
total &nbsp;&nbsp;&nbsp;= 10000000</div>
<p>Exact count. That is why nobody uses Peterson in production: real locks are built on atomic instructions (next slide) that include the necessary barriers.</p>
<p class="meo">🧠 Peterson in one line: "I want to go in; but I let you go first" — if both say it, the one who said "you first" last waits.</p>`,
        `<p class="y-chinh">🎯 Hình 2-24: <strong>lời giải Peterson</strong> (1981) cho hai tiến trình. Dùng chung: <code>int turn; int interested[2];</code>. <code>enter_region(process)</code>: <code>other = 1 − process; interested[process] = TRUE; turn = process; while (turn == process &amp;&amp; interested[other] == TRUE) ;</code>. <code>leave_region(process)</code>: <code>interested[process] = FALSE;</code>.</p>
<p>Cách hoạt động: tiến trình tuyên bố mình muốn vào, rồi ghi số của chính nó vào <code>turn</code>, rồi chỉ chờ khi bên kia cũng muốn vào <em>và</em> chính nó là người ghi <code>turn</code> sau cùng. Nếu chỉ tiến trình 0 muốn vào, nó vào ngay (điều kiện 3 giờ được thoả, khác với luân phiên nghiêm ngặt). Nếu cả hai gọi <code>enter_region</code> gần như cùng lúc, cả hai đều ghi vào <code>turn</code>; lần ghi <strong>sau cùng</strong> mới có hiệu lực, và tiến trình đó phải chờ — bên kia được vào. Bộ mô phỏng diễn trường hợp của sách: P0 ghi <code>turn</code> trước, P1 ghi sau:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/dfbba0822d8f9ab8d468300a80a85175074d53a9.svg" alt="Cả hai cùng gọi enter_region: người ghi turn sau cùng (P1) quay vòng tới khi P0 ra" loading="lazy" /><p class="chu-thich">🧮 Cả hai cùng gọi enter_region: người ghi turn sau cùng (P1) quay vòng tới khi P0 ra</p></div>
<details><summary>Vết từng bước</summary>
<table>
<thead><tr><th>t</th><th>ai</th><th>việc xảy ra trong bước này</th><th>turn</th><th>interested</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>P0</td><td>P0: interested[0] = TRUE</td><td>0</td><td>1 0</td></tr>
<tr><td>1→2</td><td>P1</td><td>P1: interested[1] = TRUE</td><td>0</td><td>1 1</td></tr>
<tr><td>2→3</td><td>P0</td><td>P0: turn = 0</td><td>0</td><td>1 1</td></tr>
<tr><td>3→4</td><td>P1</td><td>P1: turn = 1</td><td>1</td><td>1 1</td></tr>
<tr><td>4→5</td><td>P0</td><td>P0: while condition false — enters the critical region</td><td>1</td><td>1 1</td></tr>
<tr><td>5→6</td><td>P0</td><td>P0: critical region, step 1</td><td>1</td><td>1 1</td></tr>
<tr><td>6→7</td><td>P1</td><td>P1: while (turn == 1 &amp;&amp; interested[0]) — true, loop</td><td>1</td><td>1 1</td></tr>
<tr><td>7→8</td><td>P1</td><td>P1: while (turn == 1 &amp;&amp; interested[0]) — true, loop</td><td>1</td><td>1 1</td></tr>
<tr><td>8→9</td><td>P0</td><td>P0: critical region, step 2</td><td>1</td><td>1 1</td></tr>
<tr><td>9→10</td><td>P0</td><td>P0: critical region, step 3</td><td>1</td><td>1 1</td></tr>
<tr><td>10→11</td><td>P1</td><td>P1: while (turn == 1 &amp;&amp; interested[0]) — true, loop</td><td>1</td><td>1 1</td></tr>
<tr><td>11→12</td><td>P1</td><td>P1: while (turn == 1 &amp;&amp; interested[0]) — true, loop</td><td>1</td><td>1 1</td></tr>
<tr><td>12→13</td><td>P0</td><td>P0: leave_region: interested[0] = FALSE</td><td>1</td><td>0 1</td></tr>
<tr><td>13→14</td><td>P1</td><td>P1: while condition false — enters the critical region</td><td>1</td><td>0 1</td></tr>
<tr><td>14→15</td><td>P1</td><td>P1: critical region, step 1</td><td>1</td><td>0 1</td></tr>
<tr><td>15→16</td><td>P1</td><td>P1: critical region, step 2</td><td>1</td><td>0 1</td></tr>
<tr><td>16→17</td><td>P1</td><td>P1: critical region, step 3</td><td>1</td><td>0 1</td></tr>
<tr><td>17→18</td><td>P1</td><td>P1: leave_region: interested[1] = FALSE</td><td>1</td><td>0 0</td></tr>
</tbody>
</table>
</details>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const peterson = (me) =&gt; function* (s) {
  const other = 1 - me;
  s.interested[me] = 1;                 yield { n: &#96;int[&#36;{me}]=1&#96;, d: &#96;P&#36;{me}: interested[&#36;{me}] = TRUE&#96; };
  s.turn = me;                          yield { n: &#96;turn=&#36;{me}&#96;, d: &#96;P&#36;{me}: turn = &#36;{me}&#96; };
  while (s.turn === me &amp;&amp; s.interested[other] === 1) yield { quay: true, n: 'spin', d: &#96;P&#36;{me}: while (turn == &#36;{me} &amp;&amp; interested[&#36;{other}]) — true, loop&#96; };
  s.vao.push(&#96;P&#36;{me}&#96;);                 yield { n: 'test ok', d: &#96;P&#36;{me}: while condition false — enters the critical region&#96; };
  for (let i = 1; i &lt;= 3; i++) yield { n: &#96;CR &#36;{i}&#96;, d: &#96;P&#36;{me}: critical region, step &#36;{i}&#96; };
  s.interested[me] = 0;                 yield { n: &#96;int[&#36;{me}]=0&#96;, d: &#96;P&#36;{me}: leave_region: interested[&#36;{me}] = FALSE&#96; };
};
const tsl = (me) =&gt; function* (s, l) {
  for (;;) {
    l.reg = s.lock; s.lock = 1;         yield { n: &#96;TSL→&#36;{l.reg}&#96;, d: &#96;P&#36;{me}: TSL REGISTER,LOCK — REGISTER = &#36;{l.reg}, LOCK = 1 (one indivisible step)&#96; };
    if (l.reg === 0) break;
    yield { quay: true, n: 'JNE', d: &#96;P&#36;{me}: CMP REGISTER,#0 / JNE enter_region — lock was set, loop&#96; };
  }
  s.vao.push(&#96;P&#36;{me}&#96;);
  for (let i = 1; i &lt;= 3; i++) yield { n: &#96;CR &#36;{i}&#96;, d: &#96;P&#36;{me}: critical region, step &#36;{i}&#96; };
  s.lock = 0;                           yield { n: 'LOCK=0', d: &#96;P&#36;{me}: leave_region: MOVE LOCK,#0&#96; };
};</code></pre></details>
<p>➕ <strong>Slide đã lỗi thời trên phần cứng ngày nay.</strong> Peterson giả định mọi lệnh ghi được CPU kia nhìn thấy theo đúng thứ tự trong chương trình. CPU hiện đại (ARM64 và cả x86) có thể cho một lệnh <em>đọc</em> vượt lên trước một lệnh <em>ghi</em> trước đó vào địa chỉ khác, nên một tiến trình có thể đọc thấy <code>interested[other] == FALSE</code> trước khi lệnh <code>interested[process] = TRUE</code> của chính nó hiện ra — cả hai cùng vào. Đây là Hình 2-24 chép nguyên văn, mỗi luồng trong hai luồng dùng 5 000 000 lần:</p>
<pre><code class="language-c">// Hình 2-24 chép từ sách (biến int thường), hai luồng dùng mỗi luồng 5.000.000 lần
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

#define FALSE 0
#define TRUE  1
#define N     2                          /* number of processes */

int turn;                                /* whose turn is it? */
int interested[N];                       /* all values initially 0 (FALSE) */

void enter_region(int process) {         /* process is 0 or 1 */
    int other;                           /* number of the other process */
    other = 1 - process;                 /* the opposite of process */
    interested[process] = TRUE;          /* show that you are interested */
    turn = process;                      /* set flag */
    while (turn == process &amp;&amp; interested[other] == TRUE) /* null statement */ ;
}

void leave_region(int process) {         /* process: who is leaving */
    interested[process] = FALSE;         /* indicate departure from critical region */
}

long counter = 0;
pthread_barrier_t start;                 // hai luồng xuất phát cùng lúc

void *work(void *arg) {
    int me = (int)(long)arg;
    pthread_barrier_wait(&amp;start);
    for (int i = 0; i &lt; 5000000; i++) {
        enter_region(me);
        counter = counter + 1;           // vùng găng
        leave_region(me);
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_barrier_init(&amp;start, NULL, 2);
    pthread_create(&amp;a, NULL, work, (void *)0L);
    pthread_create(&amp;b, NULL, work, (void *)1L);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("expected = 10000000\\n");
    printf("total    = %ld\\n", counter);
    printf("lost     = %ld\\n", 10000000 - counter);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread peterson-sach.c -o peterson-sach &amp;&amp; ./peterson-sach<br>
expected = 10000000<br>
total &nbsp;&nbsp;&nbsp;= 9999865<br>
lost &nbsp;&nbsp;&nbsp;&nbsp;= 135</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Có cập nhật bị mất: loại trừ tương hỗ đã thất bại. Cách sửa là bảo trình biên dịch và CPU không được đảo thứ tự — atomic nhất quán tuần tự của C11 (một rào chắn bộ nhớ đầy đủ ở mỗi lần truy cập):</p>
<pre><code class="language-c">// Cùng thuật toán với atomic của C11 (nhất quán tuần tự): CPU không còn được đảo thứ tự các lệnh ghi và đọc
#include &lt;stdio.h&gt;
#include &lt;stdatomic.h&gt;
#include &lt;pthread.h&gt;

atomic_int turn;
atomic_int interested[2];

void enter_region(int process) {
    int other = 1 - process;
    atomic_store(&amp;interested[process], 1);            // ghi seq_cst: rào chắn đầy đủ trên ARM64 và x86
    atomic_store(&amp;turn, process);
    while (atomic_load(&amp;turn) == process &amp;&amp; atomic_load(&amp;interested[other]) == 1) ;
}

void leave_region(int process) { atomic_store(&amp;interested[process], 0); }

long counter = 0;

void *work(void *arg) {
    int me = (int)(long)arg;
    for (int i = 0; i &lt; 5000000; i++) {
        enter_region(me);
        counter = counter + 1;
        leave_region(me);
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&amp;a, NULL, work, (void *)0L);
    pthread_create(&amp;b, NULL, work, (void *)1L);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("expected = 10000000\\n");
    printf("total    = %ld\\n", counter);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread peterson-dung.c -o peterson-dung &amp;&amp; ./peterson-dung<br>
expected = 10000000<br>
total &nbsp;&nbsp;&nbsp;= 10000000</div>
<p>Đếm đúng tuyệt đối. Đó là lý do không ai dùng Peterson trong sản phẩm thật: khoá thật được dựng trên lệnh nguyên tử (slide sau) vốn đã kèm các rào chắn cần thiết.</p>
<p class="meo">🧠 Peterson trong một câu: "Tôi muốn vào; nhưng mời bạn trước" — nếu cả hai cùng nói, người nói "mời bạn trước" sau cùng phải chờ.</p>`],
      [33, 'Mutual Exclusion with Busy Waiting: The TSL Instruction (1)',
        `<p class="y-chinh">🎯 Figure 2-25: entering and leaving a critical region with <strong>TSL REGISTER,LOCK</strong> (Test and Set Lock): <code>enter_region: TSL REGISTER,LOCK | CMP REGISTER,#0 | JNE enter_region | RET</code>; <code>leave_region: MOVE LOCK,#0 | RET</code>.</p>
<p>TSL reads the word <code>LOCK</code> into a register <em>and</em> stores a nonzero value into it, as one <strong>indivisible</strong> operation: the CPU locks the memory bus (or the cache line) so no other CPU can access the word between the read and the write. That is exactly what the spooler code lacked — reading and updating in one step. If the old value was 0, the lock was free and is now ours; if it was 1, someone else holds it, so we loop. Leaving is an ordinary store of 0. Note that disabling interrupts would not work on a multiprocessor — other CPUs keep running — so the hardware support has to be in the memory operation itself.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7a2bcf8864b465df95252bf87ddac2d134b77f31.svg" alt="Two processes race for the lock with TSL: only one of the two TSLs can read 0" loading="lazy" /><p class="chu-thich">🧮 Two processes race for the lock with TSL: only one of the two TSLs can read 0</p></div>
<details><summary>Step-by-step trace</summary>
<table>
<thead><tr><th>t</th><th>who</th><th>what happens in this step</th><th>lock</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>P0</td><td>P0: TSL REGISTER,LOCK — REGISTER = 0, LOCK = 1 (one indivisible step)</td><td>1</td></tr>
<tr><td>1→2</td><td>P1</td><td>P1: TSL REGISTER,LOCK — REGISTER = 1, LOCK = 1 (one indivisible step)</td><td>1</td></tr>
<tr><td>2→3</td><td>P0</td><td>P0: critical region, step 1</td><td>1</td></tr>
<tr><td>3→4</td><td>P0</td><td>P0: critical region, step 2</td><td>1</td></tr>
<tr><td>4→5</td><td>P1</td><td>P1: CMP REGISTER,#0 / JNE enter_region — lock was set, loop</td><td>1</td></tr>
<tr><td>5→6</td><td>P1</td><td>P1: TSL REGISTER,LOCK — REGISTER = 1, LOCK = 1 (one indivisible step)</td><td>1</td></tr>
<tr><td>6→7</td><td>P0</td><td>P0: critical region, step 3</td><td>1</td></tr>
<tr><td>7→8</td><td>P0</td><td>P0: leave_region: MOVE LOCK,#0</td><td>0</td></tr>
<tr><td>8→9</td><td>P1</td><td>P1: CMP REGISTER,#0 / JNE enter_region — lock was set, loop</td><td>0</td></tr>
<tr><td>9→10</td><td>P1</td><td>P1: TSL REGISTER,LOCK — REGISTER = 0, LOCK = 1 (one indivisible step)</td><td>1</td></tr>
<tr><td>10→11</td><td>P1</td><td>P1: critical region, step 1</td><td>1</td></tr>
<tr><td>11→12</td><td>P1</td><td>P1: critical region, step 2</td><td>1</td></tr>
<tr><td>12→13</td><td>P1</td><td>P1: critical region, step 3</td><td>1</td></tr>
<tr><td>13→14</td><td>P1</td><td>P1: leave_region: MOVE LOCK,#0</td><td>0</td></tr>
</tbody>
</table>
</details>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const peterson = (me) =&gt; function* (s) {
  const other = 1 - me;
  s.interested[me] = 1;                 yield { n: &#96;int[&#36;{me}]=1&#96;, d: &#96;P&#36;{me}: interested[&#36;{me}] = TRUE&#96; };
  s.turn = me;                          yield { n: &#96;turn=&#36;{me}&#96;, d: &#96;P&#36;{me}: turn = &#36;{me}&#96; };
  while (s.turn === me &amp;&amp; s.interested[other] === 1) yield { quay: true, n: 'spin', d: &#96;P&#36;{me}: while (turn == &#36;{me} &amp;&amp; interested[&#36;{other}]) — true, loop&#96; };
  s.vao.push(&#96;P&#36;{me}&#96;);                 yield { n: 'test ok', d: &#96;P&#36;{me}: while condition false — enters the critical region&#96; };
  for (let i = 1; i &lt;= 3; i++) yield { n: &#96;CR &#36;{i}&#96;, d: &#96;P&#36;{me}: critical region, step &#36;{i}&#96; };
  s.interested[me] = 0;                 yield { n: &#96;int[&#36;{me}]=0&#96;, d: &#96;P&#36;{me}: leave_region: interested[&#36;{me}] = FALSE&#96; };
};
const tsl = (me) =&gt; function* (s, l) {
  for (;;) {
    l.reg = s.lock; s.lock = 1;         yield { n: &#96;TSL→&#36;{l.reg}&#96;, d: &#96;P&#36;{me}: TSL REGISTER,LOCK — REGISTER = &#36;{l.reg}, LOCK = 1 (one indivisible step)&#96; };
    if (l.reg === 0) break;
    yield { quay: true, n: 'JNE', d: &#96;P&#36;{me}: CMP REGISTER,#0 / JNE enter_region — lock was set, loop&#96; };
  }
  s.vao.push(&#96;P&#36;{me}&#96;);
  for (let i = 1; i &lt;= 3; i++) yield { n: &#96;CR &#36;{i}&#96;, d: &#96;P&#36;{me}: critical region, step &#36;{i}&#96; };
  s.lock = 0;                           yield { n: 'LOCK=0', d: &#96;P&#36;{me}: leave_region: MOVE LOCK,#0&#96; };
};</code></pre></details>
<p>➕ The same <code>enter_region</code> written in C with GCC's atomic built-in, protecting a counter shared by four threads:</p>
<pre><code class="language-c">// enter_region / leave_region of Figure 2-25 written with GCC's atomic built-ins — and it really protects the counter
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

int lock = 0;                                            // 0 = free, 1 = taken
long counter = 0;

void enter_region(void) {
    while (__atomic_exchange_n(&amp;lock, 1, __ATOMIC_ACQUIRE) != 0)   // TSL / XCHG: old value out, 1 in
        ;                                                // it was 1: somebody is inside, loop
}
void leave_region(void) {
    __atomic_store_n(&amp;lock, 0, __ATOMIC_RELEASE);        // MOVE LOCK,#0
}

void *work(void *arg) {
    for (int i = 0; i &lt; 1000000; i++) {
        enter_region();
        counter = counter + 1;
        leave_region();
    }
    return NULL;
}

int main(void) {
    pthread_t t[4];
    for (int i = 0; i &lt; 4; i++) pthread_create(&amp;t[i], NULL, work, NULL);
    for (int i = 0; i &lt; 4; i++) pthread_join(t[i], NULL);
    printf("4 threads x 1000000 = %ld\\n", counter);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread tsl-khoa.c -o tsl-khoa &amp;&amp; ./tsl-khoa<br>
4 threads x 1000000 = 4000000</div>
<p>Exactly 4 000 000. <code>__atomic_exchange_n(&amp;lock, 1, …)</code> is the TSL: "put 1 in, give me the old value". This is a <strong>spin lock</strong>, the lock the Linux kernel uses for very short critical regions on multiprocessors — still busy waiting, so only worth it when the holder will release the lock within a few microseconds.</p>
<p class="pitfall">⚠️ "Why not disable interrupts to protect a critical region?" — it is a privileged instruction (a user program could keep the CPU forever) and it does not stop the <strong>other</strong> CPUs. It is used only inside the kernel, for a few instructions.</p>`,
        `<p class="y-chinh">🎯 Hình 2-25: vào và ra vùng găng bằng <strong>TSL REGISTER,LOCK</strong> (Test and Set Lock — kiểm và đặt khoá): <code>enter_region: TSL REGISTER,LOCK | CMP REGISTER,#0 | JNE enter_region | RET</code>; <code>leave_region: MOVE LOCK,#0 | RET</code>.</p>
<p>TSL đọc từ nhớ <code>LOCK</code> vào một thanh ghi <em>và</em> ghi một giá trị khác 0 vào đó, như một thao tác <strong>không chia cắt được (indivisible)</strong>: CPU khoá bus bộ nhớ (hoặc dòng cache) nên không CPU nào khác chạm được vào từ nhớ đó giữa lúc đọc và lúc ghi. Đó đúng là thứ mã spooler thiếu — đọc và cập nhật trong một bước. Nếu giá trị cũ là 0, khoá đang trống và giờ thuộc về ta; nếu là 1, đã có người giữ, nên ta lặp lại. Ra khỏi vùng găng chỉ là một lệnh ghi 0 bình thường. Lưu ý tắt ngắt không dùng được trên máy nhiều bộ xử lý — các CPU khác vẫn chạy — nên sự hỗ trợ của phần cứng phải nằm ngay trong thao tác bộ nhớ.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/db220ed5e4cbf19bb172f8fca498df360dc63782.svg" alt="Hai tiến trình giành khoá bằng TSL: chỉ một trong hai lệnh TSL đọc được 0" loading="lazy" /><p class="chu-thich">🧮 Hai tiến trình giành khoá bằng TSL: chỉ một trong hai lệnh TSL đọc được 0</p></div>
<details><summary>Vết từng bước</summary>
<table>
<thead><tr><th>t</th><th>ai</th><th>việc xảy ra trong bước này</th><th>lock</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>P0</td><td>P0: TSL REGISTER,LOCK — REGISTER = 0, LOCK = 1 (one indivisible step)</td><td>1</td></tr>
<tr><td>1→2</td><td>P1</td><td>P1: TSL REGISTER,LOCK — REGISTER = 1, LOCK = 1 (one indivisible step)</td><td>1</td></tr>
<tr><td>2→3</td><td>P0</td><td>P0: critical region, step 1</td><td>1</td></tr>
<tr><td>3→4</td><td>P0</td><td>P0: critical region, step 2</td><td>1</td></tr>
<tr><td>4→5</td><td>P1</td><td>P1: CMP REGISTER,#0 / JNE enter_region — lock was set, loop</td><td>1</td></tr>
<tr><td>5→6</td><td>P1</td><td>P1: TSL REGISTER,LOCK — REGISTER = 1, LOCK = 1 (one indivisible step)</td><td>1</td></tr>
<tr><td>6→7</td><td>P0</td><td>P0: critical region, step 3</td><td>1</td></tr>
<tr><td>7→8</td><td>P0</td><td>P0: leave_region: MOVE LOCK,#0</td><td>0</td></tr>
<tr><td>8→9</td><td>P1</td><td>P1: CMP REGISTER,#0 / JNE enter_region — lock was set, loop</td><td>0</td></tr>
<tr><td>9→10</td><td>P1</td><td>P1: TSL REGISTER,LOCK — REGISTER = 0, LOCK = 1 (one indivisible step)</td><td>1</td></tr>
<tr><td>10→11</td><td>P1</td><td>P1: critical region, step 1</td><td>1</td></tr>
<tr><td>11→12</td><td>P1</td><td>P1: critical region, step 2</td><td>1</td></tr>
<tr><td>12→13</td><td>P1</td><td>P1: critical region, step 3</td><td>1</td></tr>
<tr><td>13→14</td><td>P1</td><td>P1: leave_region: MOVE LOCK,#0</td><td>0</td></tr>
</tbody>
</table>
</details>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const peterson = (me) =&gt; function* (s) {
  const other = 1 - me;
  s.interested[me] = 1;                 yield { n: &#96;int[&#36;{me}]=1&#96;, d: &#96;P&#36;{me}: interested[&#36;{me}] = TRUE&#96; };
  s.turn = me;                          yield { n: &#96;turn=&#36;{me}&#96;, d: &#96;P&#36;{me}: turn = &#36;{me}&#96; };
  while (s.turn === me &amp;&amp; s.interested[other] === 1) yield { quay: true, n: 'spin', d: &#96;P&#36;{me}: while (turn == &#36;{me} &amp;&amp; interested[&#36;{other}]) — true, loop&#96; };
  s.vao.push(&#96;P&#36;{me}&#96;);                 yield { n: 'test ok', d: &#96;P&#36;{me}: while condition false — enters the critical region&#96; };
  for (let i = 1; i &lt;= 3; i++) yield { n: &#96;CR &#36;{i}&#96;, d: &#96;P&#36;{me}: critical region, step &#36;{i}&#96; };
  s.interested[me] = 0;                 yield { n: &#96;int[&#36;{me}]=0&#96;, d: &#96;P&#36;{me}: leave_region: interested[&#36;{me}] = FALSE&#96; };
};
const tsl = (me) =&gt; function* (s, l) {
  for (;;) {
    l.reg = s.lock; s.lock = 1;         yield { n: &#96;TSL→&#36;{l.reg}&#96;, d: &#96;P&#36;{me}: TSL REGISTER,LOCK — REGISTER = &#36;{l.reg}, LOCK = 1 (one indivisible step)&#96; };
    if (l.reg === 0) break;
    yield { quay: true, n: 'JNE', d: &#96;P&#36;{me}: CMP REGISTER,#0 / JNE enter_region — lock was set, loop&#96; };
  }
  s.vao.push(&#96;P&#36;{me}&#96;);
  for (let i = 1; i &lt;= 3; i++) yield { n: &#96;CR &#36;{i}&#96;, d: &#96;P&#36;{me}: critical region, step &#36;{i}&#96; };
  s.lock = 0;                           yield { n: 'LOCK=0', d: &#96;P&#36;{me}: leave_region: MOVE LOCK,#0&#96; };
};</code></pre></details>
<p>➕ Cùng <code>enter_region</code> đó viết bằng C với hàm nguyên tử dựng sẵn của GCC, bảo vệ một bộ đếm bốn luồng dùng chung:</p>
<pre><code class="language-c">// enter_region / leave_region của Hình 2-25 viết bằng hàm nguyên tử dựng sẵn của GCC — và nó bảo vệ bộ đếm thật
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

int lock = 0;                                            // 0 = trống, 1 = có người
long counter = 0;

void enter_region(void) {
    while (__atomic_exchange_n(&amp;lock, 1, __ATOMIC_ACQUIRE) != 0)   // TSL / XCHG: lấy giá trị cũ ra, đặt 1 vào
        ;                                                // là 1: có người bên trong, lặp
}
void leave_region(void) {
    __atomic_store_n(&amp;lock, 0, __ATOMIC_RELEASE);        // MOVE LOCK,#0
}

void *work(void *arg) {
    for (int i = 0; i &lt; 1000000; i++) {
        enter_region();
        counter = counter + 1;
        leave_region();
    }
    return NULL;
}

int main(void) {
    pthread_t t[4];
    for (int i = 0; i &lt; 4; i++) pthread_create(&amp;t[i], NULL, work, NULL);
    for (int i = 0; i &lt; 4; i++) pthread_join(t[i], NULL);
    printf("4 threads x 1000000 = %ld\\n", counter);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread tsl-khoa.c -o tsl-khoa &amp;&amp; ./tsl-khoa<br>
4 threads x 1000000 = 4000000</div>
<p>Đúng 4 000 000. <code>__atomic_exchange_n(&amp;lock, 1, …)</code> chính là TSL: "đặt 1 vào, trả tôi giá trị cũ". Đây là một <strong>khoá quay (spin lock)</strong>, loại khoá nhân Linux dùng cho các vùng găng rất ngắn trên máy nhiều bộ xử lý — vẫn là chờ bận, nên chỉ đáng dùng khi người giữ khoá sẽ nhả nó trong vài micro-giây.</p>
<p class="pitfall">⚠️ "Sao không tắt ngắt để bảo vệ vùng găng?" — đó là lệnh đặc quyền (chương trình người dùng có thể giữ CPU mãi mãi) và nó không ngăn được các CPU <strong>khác</strong>. Chỉ dùng bên trong nhân, cho vài lệnh.</p>`],
      [34, 'Mutual Exclusion with Busy Waiting: The TSL Instruction (2)',
        `<p class="y-chinh">🎯 Figure 2-26: the same with <strong>XCHG</strong>, which atomically exchanges the contents of two locations: <code>enter_region: MOVE REGISTER,#1 | XCHG REGISTER,LOCK | CMP REGISTER,#0 | JNE enter_region | RET</code>; <code>leave_region: MOVE LOCK,#0 | RET</code>.</p>
<p>XCHG is the alternative the book gives because every Intel x86 CPU uses it for low-level synchronization: put 1 in a register, swap it with <code>LOCK</code>, and look at what came out. The effect is identical to TSL — the old value tells us whether we got the lock. On x86, <code>xchg</code> with a memory operand is <em>implicitly</em> locked; other read-modify-write instructions need the <code>lock</code> prefix (<code>lock cmpxchg</code>, <code>lock xadd</code>).</p>
<p>➕ What does your machine use? Let the compiler answer for ARM64, the CPU of this course's container (and of Apple-silicon Macs, phones and AWS Graviton servers):</p>
<div class="out"># Figures 2-25 and 2-26 today: the C compiler emits the indivisible "test and set" for us<br>
$ cat &gt; khoa.c &lt;&lt;'X'<br>
&gt; int lock;<br>
&gt; void enter_region(void) { while (__atomic_exchange_n(&amp;lock, 1, __ATOMIC_ACQUIRE)) ; }<br>
&gt; void leave_region(void) { __atomic_store_n(&amp;lock, 0, __ATOMIC_RELEASE); }<br>
&gt; X<br>
# ARMv8.1 and later (every Apple-silicon Mac, AWS Graviton): one instruction, SWPA = swap with acquire<br>
$ gcc -O2 -march=armv8.1-a -S khoa.c -o - | grep -E '^\\s+(swp|stlr|cbnz|ldaxr|stxr)'<br>
	swpa	w2, w1, [x0]<br>
	cbnz	w1, .L2<br>
	stlr	wzr, [x0]<br>
# plain ARMv8.0 has no swap instruction: a load-exclusive / store-exclusive loop does the same job<br>
$ gcc -O2 -march=armv8-a -mno-outline-atomics -S khoa.c -o - | grep -E '^\\s+(swp|stlr|cbnz|ldaxr|stxr)'<br>
	ldaxr	w1, [x0]<br>
	stxr	w3, w2, [x0]<br>
	cbnz	w3, .L5<br>
	cbnz	w1, .L2<br>
	stlr	wzr, [x0]</div>
<p>On ARMv8.1 and later there is a single swap instruction, <strong><code>swpa</code></strong> (swap with acquire semantics) — the XCHG of ARM. Plain ARMv8.0 has no swap: the compiler builds one from a <strong>load-exclusive / store-exclusive</strong> pair (<code>ldaxr</code> / <code>stxr</code>) — the store succeeds only if nobody touched the word since the load, otherwise the loop tries again. On your x86-64 PC or WSL the same C code becomes an <code>xchg</code>. Leaving is <code>stlr</code>, a store with release semantics (the barrier that makes everything written inside the critical region visible before the lock looks free).</p>
<p class="meo">🧠 TSL, XCHG, SWP, CAS (compare-and-swap), LL/SC (load-linked/store-conditional): different names, one idea — read and write a word as one atomic step. Every lock, semaphore and <code>AtomicInteger</code> above is built on one of them.</p>`,
        `<p class="y-chinh">🎯 Hình 2-26: cùng việc đó với <strong>XCHG</strong>, lệnh tráo đổi nội dung hai vị trí một cách nguyên tử: <code>enter_region: MOVE REGISTER,#1 | XCHG REGISTER,LOCK | CMP REGISTER,#0 | JNE enter_region | RET</code>; <code>leave_region: MOVE LOCK,#0 | RET</code>.</p>
<p>XCHG là lựa chọn thay thế mà sách đưa ra vì mọi CPU Intel x86 dùng nó cho đồng bộ mức thấp: đặt 1 vào thanh ghi, tráo nó với <code>LOCK</code>, rồi xem cái gì đi ra. Tác dụng y hệt TSL — giá trị cũ cho biết ta có lấy được khoá không. Trên x86, <code>xchg</code> với toán hạng bộ nhớ được khoá <em>ngầm định</em>; các lệnh đọc-sửa-ghi khác cần tiền tố <code>lock</code> (<code>lock cmpxchg</code>, <code>lock xadd</code>).</p>
<p>➕ Máy của bạn dùng lệnh gì? Để trình biên dịch trả lời cho ARM64, CPU của container môn học (và của Mac chip Apple, điện thoại, máy chủ AWS Graviton):</p>
<div class="out"># Hình 2-25 và 2-26 ngày nay: trình biên dịch C sinh lệnh "kiểm và đặt" không chia cắt cho ta<br>
$ cat &gt; khoa.c &lt;&lt;'X'<br>
&gt; int lock;<br>
&gt; void enter_region(void) { while (__atomic_exchange_n(&amp;lock, 1, __ATOMIC_ACQUIRE)) ; }<br>
&gt; void leave_region(void) { __atomic_store_n(&amp;lock, 0, __ATOMIC_RELEASE); }<br>
&gt; X<br>
# ARMv8.1 trở lên (mọi Mac chip Apple, AWS Graviton): một lệnh, SWPA = tráo đổi kèm acquire<br>
$ gcc -O2 -march=armv8.1-a -S khoa.c -o - | grep -E '^\\s+(swp|stlr|cbnz|ldaxr|stxr)'<br>
	swpa	w2, w1, [x0]<br>
	cbnz	w1, .L2<br>
	stlr	wzr, [x0]<br>
# ARMv8.0 thuần không có lệnh tráo: vòng nạp-độc-quyền / ghi-độc-quyền làm cùng việc đó<br>
$ gcc -O2 -march=armv8-a -mno-outline-atomics -S khoa.c -o - | grep -E '^\\s+(swp|stlr|cbnz|ldaxr|stxr)'<br>
	ldaxr	w1, [x0]<br>
	stxr	w3, w2, [x0]<br>
	cbnz	w3, .L5<br>
	cbnz	w1, .L2<br>
	stlr	wzr, [x0]</div>
<p>Từ ARMv8.1 trở lên có một lệnh tráo duy nhất, <strong><code>swpa</code></strong> (tráo kèm ngữ nghĩa acquire) — XCHG của ARM. ARMv8.0 thuần không có lệnh tráo: trình biên dịch dựng nó từ cặp <strong>nạp-độc-quyền / ghi-độc-quyền</strong> (<code>ldaxr</code> / <code>stxr</code>) — lệnh ghi chỉ thành công nếu không ai chạm vào từ nhớ đó kể từ lúc nạp, nếu không vòng lặp thử lại. Trên PC x86-64 hay WSL của bạn, cùng đoạn C đó thành một lệnh <code>xchg</code>. Ra khỏi vùng găng là <code>stlr</code>, lệnh ghi kèm ngữ nghĩa release (rào chắn bảo đảm mọi thứ ghi trong vùng găng hiện ra trước khi khoá trông như trống).</p>
<p class="meo">🧠 TSL, XCHG, SWP, CAS (so sánh và tráo), LL/SC (load-linked/store-conditional): khác tên, cùng một ý — đọc và ghi một từ nhớ trong một bước nguyên tử. Mọi khoá, semaphore và <code>AtomicInteger</code> ở tầng trên đều dựng trên một trong số chúng.</p>`],
      [35, 'Sleep and Wakeup: The Producer-Consumer Problem (1)',
        `<p class="y-chinh">🎯 Figure 2-27 (producer): <code>#define N 100; int count = 0;</code> — the producer loops: <code>item = produce_item(); if (count == N) sleep(); insert_item(item); count = count + 1; if (count == 1) wakeup(consumer);</code></p>
<p>Busy waiting wastes CPU time and has a nastier problem, <strong>priority inversion</strong>: a high-priority process H spinning for a lock held by a low-priority process L never lets L run (if the scheduler always prefers H), so L never releases the lock and H spins forever. The better primitives <strong>block</strong> instead of spinning: <code>sleep()</code> makes the caller blocked; <code>wakeup(p)</code> makes process p ready. The example is the <strong>producer–consumer</strong> (or <strong>bounded-buffer</strong>) problem: a producer puts items into a buffer of N slots, a consumer takes them out; the producer must sleep when the buffer is full, the consumer when it is empty, and each wakes the other.</p>
<p>➕ The producer's logic reads well: "if full, sleep; insert; count one more; if I just made the buffer non-empty, the consumer may be asleep — wake it". The flaw is that <code>count</code> is shared and accessed without any protection, and — worse — the test of <code>count</code> and the call to <code>sleep</code> are two separate steps. The old lesson 2.2 tells the priority-inversion story of the Mars Pathfinder (1997); the next slide shows the race in this code.</p>
<p class="pitfall">⚠️ FE4#10: "What problem do semaphores help to solve in the producer–consumer scenario?" — the <strong>lost-wakeup problem</strong> of this figure (slide 36), which sleep/wakeup cannot solve.</p>`,
        `<p class="y-chinh">🎯 Hình 2-27 (bên sản xuất): <code>#define N 100; int count = 0;</code> — bên sản xuất lặp: <code>item = produce_item(); if (count == N) sleep(); insert_item(item); count = count + 1; if (count == 1) wakeup(consumer);</code></p>
<p>Chờ bận phí thời gian CPU và còn một vấn đề tệ hơn, <strong>đảo ngược ưu tiên (priority inversion)</strong>: tiến trình ưu tiên cao H quay vòng chờ một khoá do tiến trình ưu tiên thấp L giữ thì không bao giờ cho L chạy (nếu bộ lập lịch luôn ưu tiên H), nên L không bao giờ nhả khoá và H quay mãi. Các hàm nguyên thuỷ tốt hơn sẽ <strong>chặn</strong> thay vì quay: <code>sleep()</code> làm bên gọi bị chặn; <code>wakeup(p)</code> làm tiến trình p sẵn sàng. Ví dụ là bài toán <strong>sản xuất–tiêu thụ (producer–consumer)</strong> (hay <strong>bộ đệm có giới hạn — bounded buffer</strong>): bên sản xuất bỏ món hàng vào bộ đệm N ô, bên tiêu thụ lấy ra; bên sản xuất phải ngủ khi bộ đệm đầy, bên tiêu thụ ngủ khi rỗng, và mỗi bên đánh thức bên kia.</p>
<p>➕ Lô-gic của bên sản xuất đọc rất xuôi: "đầy thì ngủ; bỏ vào; đếm thêm một; nếu tôi vừa làm bộ đệm hết rỗng thì có thể bên tiêu thụ đang ngủ — đánh thức nó". Chỗ hỏng là <code>count</code> dùng chung mà truy cập không có bảo vệ gì, và — tệ hơn — việc kiểm <code>count</code> và lời gọi <code>sleep</code> là hai bước tách rời. Bài cũ 2.2 kể chuyện đảo ngược ưu tiên của tàu Mars Pathfinder (1997); slide sau cho thấy tranh chấp trong đoạn mã này.</p>
<p class="pitfall">⚠️ FE4#10: "Semaphore giúp giải vấn đề gì trong bài sản xuất–tiêu thụ?" — <strong>vấn đề mất tín hiệu đánh thức (lost wakeup)</strong> của hình này (slide 36), thứ sleep/wakeup không giải được.</p>`],
      [36, 'Sleep and Wakeup: The Producer-Consumer Problem (2)',
        `<p class="y-chinh">🎯 Figure 2-27 (consumer): <code>while (TRUE) { if (count == 0) sleep(); item = remove_item(); count = count − 1; if (count == N − 1) wakeup(producer); consume_item(item); }</code> — and the fatal race between the two.</p>
<p>The book's scenario: the buffer is empty; the consumer reads <code>count</code> = 0; just then the scheduler stops it and runs the producer. The producer inserts an item, increments <code>count</code> to 1, sees 1, and calls <code>wakeup(consumer)</code> — but the consumer is not asleep yet, so the wakeup signal is <strong>lost</strong>. When the consumer runs again, it acts on the 0 it read earlier and goes to sleep. The producer fills the buffer and goes to sleep too. <strong>Both sleep forever.</strong> The simulator runs that exact schedule:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/80209eb3a47afa761c3625819e61fd4e789c5b92.svg" alt="The lost wakeup: the producer's wakeup arrives before the consumer sleeps, and both end asleep" loading="lazy" /><p class="chu-thich">🧮 The lost wakeup: the producer's wakeup arrives before the consumer sleeps, and both end asleep</p></div>
<details><summary>Step-by-step trace</summary>
<table>
<thead><tr><th>t</th><th>who</th><th>what happens in this step</th><th>count</th><th>buf</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>C</td><td>consumer: reads count (= 0)</td><td>0</td><td></td></tr>
<tr><td>1→2</td><td>P</td><td>producer: item = produce_item() → 1</td><td>0</td><td></td></tr>
<tr><td>2→3</td><td>P</td><td>producer: insert_item(1)</td><td>0</td><td>1</td></tr>
<tr><td>3→4</td><td>P</td><td>producer: count = count + 1 = 1</td><td>1</td><td>1</td></tr>
<tr><td>4→5</td><td>P</td><td>producer: count == 1 → wakeup(consumer)</td><td>1</td><td>1</td></tr>
<tr><td>5→6</td><td>P</td><td>producer: item = produce_item() → 2</td><td>1</td><td>1</td></tr>
<tr><td>6→7</td><td>C</td><td>consumer: count was 0 → sleep() — <strong>blocks</strong></td><td>1</td><td>1</td></tr>
<tr><td>7→8</td><td>P</td><td>producer: insert_item(2)</td><td>1</td><td>1 2</td></tr>
<tr><td>8→9</td><td>P</td><td>producer: count = count + 1 = 2</td><td>2</td><td>1 2</td></tr>
<tr><td>9→10</td><td>P</td><td>producer: item = produce_item() → 3</td><td>2</td><td>1 2</td></tr>
<tr><td>10→11</td><td>P</td><td>producer: insert_item(3)</td><td>2</td><td>1 2 3</td></tr>
<tr><td>11→12</td><td>P</td><td>producer: count = count + 1 = 3</td><td>3</td><td>1 2 3</td></tr>
<tr><td>12→13</td><td>P</td><td>producer: item = produce_item() → 4</td><td>3</td><td>1 2 3</td></tr>
<tr><td>13→14</td><td>P</td><td>producer: count == N (3) → sleep() — <strong>blocks</strong></td><td>3</td><td>1 2 3</td></tr>
</tbody>
</table>
</details>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const N = 3;
function* producer(s, l) {
  for (let item = 1; ; item++) {
    yield { n: &#96;make &#36;{item}&#96;, d: &#96;producer: item = produce_item() → &#36;{item}&#96; };
    if (s.count === N) yield { ngu: true, n: 'sleep', d: &#96;producer: count == N (&#36;{N}) → sleep()&#96; };
    s.buf.push(item);                   yield { n: &#96;put &#36;{item}&#96;, d: &#96;producer: insert_item(&#36;{item})&#96; };
    s.count++;                          yield { n: &#96;count=&#36;{s.count}&#96;, d: &#96;producer: count = count + 1 = &#36;{s.count}&#96; };
    if (s.count === 1) yield { danhThuc: 'C', n: 'wakeup', d: 'producer: count == 1 → wakeup(consumer)' };
  }
}
function* consumer(s, l) {
  for (;;) {
    l.c = s.count;                      yield { n: &#96;count?&#36;{l.c}&#96;, d: &#96;consumer: reads count (= &#36;{l.c})&#96; };
    if (l.c === 0) yield { ngu: true, n: 'sleep', d: 'consumer: count was 0 → sleep()' };
    l.item = s.buf.shift();             yield { n: &#96;take &#36;{l.item}&#96;, d: &#96;consumer: remove_item() → &#36;{l.item}&#96; };
    s.count--;                          yield { n: &#96;count=&#36;{s.count}&#96;, d: &#96;consumer: count = count − 1 = &#36;{s.count}&#96; };
    if (s.count === N - 1) yield { danhThuc: 'P', n: 'wakeup', d: 'consumer: count == N − 1 → wakeup(producer)' };
  }
}</code></pre></details>
<p>➕ And with real threads: <code>sleep()</code> is <code>pause()</code>, <code>wakeup()</code> is a signal sent to that thread; the consumer is held between its test and its <code>pause</code> for 100 ms:</p>
<pre><code class="language-c">// Figure 2-27's fatal race with real threads: "sleep" = pause(), "wakeup" = a signal sent to that thread
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;signal.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;

#define N 3
volatile int count = 0;                   // items in the buffer — shared, unprotected (as in the book)
pthread_t producer_t, consumer_t;

static void on_wakeup(int sig) { }        // a wakeup just interrupts pause()

static void spin_ms(int ms) {             // keep the CPU busy: the consumer "is between two instructions"
    struct timespec a, b;
    clock_gettime(CLOCK_MONOTONIC, &amp;a);
    do clock_gettime(CLOCK_MONOTONIC, &amp;b);
    while ((b.tv_sec - a.tv_sec) * 1000 + (b.tv_nsec - a.tv_nsec) / 1000000 &lt; ms);
}

void *consumer(void *arg) {
    for (;;) {
        if (count == 0) {                                   // reads count: 0
            printf("consumer: count == 0, I am about to sleep...\\n");
            spin_ms(100);                                   // ...the scheduler runs the producer right here
            printf("consumer: now I call sleep()\\n");
            pause();                                        // sleep(): waits for a wakeup that already came
        }
        count = count - 1;
        printf("consumer: took an item\\n");
    }
}

void *producer(void *arg) {
    for (int item = 1; ; item++) {
        if (count == N) { printf("producer: buffer full, I call sleep()\\n"); pause(); }
        count = count + 1;                                  // insert_item(item)
        printf("producer: inserted item %d, count = %d\\n", item, count);
        if (count == 1) {
            printf("producer: count == 1 -&gt; wakeup(consumer)\\n");
            pthread_kill(consumer_t, SIGUSR1);              // the consumer is NOT asleep yet: the wakeup is lost
        }
    }
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    signal(SIGUSR1, on_wakeup);
    pthread_create(&amp;consumer_t, NULL, consumer, NULL);
    usleep(20 * 1000);
    pthread_create(&amp;producer_t, NULL, producer, NULL);
    sleep(2);                                               // a watchdog: look again after 2 seconds
    printf("watchdog after 2 s: count = %d, the consumer sleeps, the producer sleeps — forever\\n", count);
    exit(0);
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread danh-thuc-mat.c -o danh-thuc-mat &amp;&amp; ./danh-thuc-mat<br>
consumer: count == 0, I am about to sleep...<br>
producer: inserted item 1, count = 1<br>
producer: count == 1 -&gt; wakeup(consumer)<br>
producer: inserted item 2, count = 2<br>
producer: inserted item 3, count = 3<br>
producer: buffer full, I call sleep()<br>
consumer: now I call sleep()<br>
watchdog after 2 s: count = 3, the consumer sleeps, the producer sleeps — forever</div>
<p>The watchdog finds three items in the buffer, a producer asleep and a consumer asleep — a hang without any crash, the hardest kind of bug to find. The book's quick fix is a <strong>wakeup-waiting bit</strong> that remembers a wakeup sent to a process that was awake; it does not scale (two processes need two bits, n processes n bits). The real fix is the semaphore: it <em>counts</em> the wakeups.</p>
<p class="meo">🧠 Lost wakeup = a phone call to someone who has not yet fallen asleep but is about to: they hang up thinking "nobody called", and fall asleep waiting for a call that already came.</p>`,
        `<p class="y-chinh">🎯 Hình 2-27 (bên tiêu thụ): <code>while (TRUE) { if (count == 0) sleep(); item = remove_item(); count = count − 1; if (count == N − 1) wakeup(producer); consume_item(item); }</code> — và tranh chấp chết người giữa hai bên.</p>
<p>Kịch bản của sách: bộ đệm rỗng; bên tiêu thụ đọc <code>count</code> = 0; đúng lúc đó bộ lập lịch dừng nó và cho bên sản xuất chạy. Bên sản xuất bỏ vào một món, tăng <code>count</code> lên 1, thấy 1, và gọi <code>wakeup(consumer)</code> — nhưng bên tiêu thụ chưa ngủ, nên tín hiệu đánh thức bị <strong>mất</strong>. Khi bên tiêu thụ chạy lại, nó hành động theo số 0 đã đọc từ trước và đi ngủ. Bên sản xuất lấp đầy bộ đệm rồi cũng đi ngủ. <strong>Cả hai ngủ mãi mãi.</strong> Bộ mô phỏng chạy đúng lịch đó:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/bf14c8d77b980394421476674819146083328661.svg" alt="Mất tín hiệu đánh thức: wakeup của bên sản xuất tới trước khi bên tiêu thụ ngủ, và cả hai kết thúc trong giấc ngủ" loading="lazy" /><p class="chu-thich">🧮 Mất tín hiệu đánh thức: wakeup của bên sản xuất tới trước khi bên tiêu thụ ngủ, và cả hai kết thúc trong giấc ngủ</p></div>
<details><summary>Vết từng bước</summary>
<table>
<thead><tr><th>t</th><th>ai</th><th>việc xảy ra trong bước này</th><th>count</th><th>buf</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>C</td><td>consumer: reads count (= 0)</td><td>0</td><td></td></tr>
<tr><td>1→2</td><td>P</td><td>producer: item = produce_item() → 1</td><td>0</td><td></td></tr>
<tr><td>2→3</td><td>P</td><td>producer: insert_item(1)</td><td>0</td><td>1</td></tr>
<tr><td>3→4</td><td>P</td><td>producer: count = count + 1 = 1</td><td>1</td><td>1</td></tr>
<tr><td>4→5</td><td>P</td><td>producer: count == 1 → wakeup(consumer)</td><td>1</td><td>1</td></tr>
<tr><td>5→6</td><td>P</td><td>producer: item = produce_item() → 2</td><td>1</td><td>1</td></tr>
<tr><td>6→7</td><td>C</td><td>consumer: count was 0 → sleep() — <strong>bị chặn</strong></td><td>1</td><td>1</td></tr>
<tr><td>7→8</td><td>P</td><td>producer: insert_item(2)</td><td>1</td><td>1 2</td></tr>
<tr><td>8→9</td><td>P</td><td>producer: count = count + 1 = 2</td><td>2</td><td>1 2</td></tr>
<tr><td>9→10</td><td>P</td><td>producer: item = produce_item() → 3</td><td>2</td><td>1 2</td></tr>
<tr><td>10→11</td><td>P</td><td>producer: insert_item(3)</td><td>2</td><td>1 2 3</td></tr>
<tr><td>11→12</td><td>P</td><td>producer: count = count + 1 = 3</td><td>3</td><td>1 2 3</td></tr>
<tr><td>12→13</td><td>P</td><td>producer: item = produce_item() → 4</td><td>3</td><td>1 2 3</td></tr>
<tr><td>13→14</td><td>P</td><td>producer: count == N (3) → sleep() — <strong>bị chặn</strong></td><td>3</td><td>1 2 3</td></tr>
</tbody>
</table>
</details>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const N = 3;
function* producer(s, l) {
  for (let item = 1; ; item++) {
    yield { n: &#96;make &#36;{item}&#96;, d: &#96;producer: item = produce_item() → &#36;{item}&#96; };
    if (s.count === N) yield { ngu: true, n: 'sleep', d: &#96;producer: count == N (&#36;{N}) → sleep()&#96; };
    s.buf.push(item);                   yield { n: &#96;put &#36;{item}&#96;, d: &#96;producer: insert_item(&#36;{item})&#96; };
    s.count++;                          yield { n: &#96;count=&#36;{s.count}&#96;, d: &#96;producer: count = count + 1 = &#36;{s.count}&#96; };
    if (s.count === 1) yield { danhThuc: 'C', n: 'wakeup', d: 'producer: count == 1 → wakeup(consumer)' };
  }
}
function* consumer(s, l) {
  for (;;) {
    l.c = s.count;                      yield { n: &#96;count?&#36;{l.c}&#96;, d: &#96;consumer: reads count (= &#36;{l.c})&#96; };
    if (l.c === 0) yield { ngu: true, n: 'sleep', d: 'consumer: count was 0 → sleep()' };
    l.item = s.buf.shift();             yield { n: &#96;take &#36;{l.item}&#96;, d: &#96;consumer: remove_item() → &#36;{l.item}&#96; };
    s.count--;                          yield { n: &#96;count=&#36;{s.count}&#96;, d: &#96;consumer: count = count − 1 = &#36;{s.count}&#96; };
    if (s.count === N - 1) yield { danhThuc: 'P', n: 'wakeup', d: 'consumer: count == N − 1 → wakeup(producer)' };
  }
}</code></pre></details>
<p>➕ Và với luồng thật: <code>sleep()</code> là <code>pause()</code>, <code>wakeup()</code> là một tín hiệu gửi tới luồng đó; bên tiêu thụ bị giữ giữa lúc kiểm tra và lúc gọi <code>pause</code> trong 100 ms:</p>
<pre><code class="language-c">// Tranh chấp chết người của Hình 2-27 bằng luồng thật: "sleep" = pause(), "wakeup" = một tín hiệu gửi tới luồng đó
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;signal.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;

#define N 3
volatile int count = 0;                   // số món trong bộ đệm — dùng chung, không bảo vệ (như sách)
pthread_t producer_t, consumer_t;

static void on_wakeup(int sig) { }        // wakeup chỉ làm pause() thôi chờ

static void spin_ms(int ms) {             // giữ CPU bận: tiêu thụ "đang ở giữa hai lệnh"
    struct timespec a, b;
    clock_gettime(CLOCK_MONOTONIC, &amp;a);
    do clock_gettime(CLOCK_MONOTONIC, &amp;b);
    while ((b.tv_sec - a.tv_sec) * 1000 + (b.tv_nsec - a.tv_nsec) / 1000000 &lt; ms);
}

void *consumer(void *arg) {
    for (;;) {
        if (count == 0) {                                   // đọc count: 0
            printf("consumer: count == 0, I am about to sleep...\\n");
            spin_ms(100);                                   // ...bộ lập lịch cho sản xuất chạy đúng chỗ này
            printf("consumer: now I call sleep()\\n");
            pause();                                        // sleep(): chờ một wakeup đã tới từ trước
        }
        count = count - 1;
        printf("consumer: took an item\\n");
    }
}

void *producer(void *arg) {
    for (int item = 1; ; item++) {
        if (count == N) { printf("producer: buffer full, I call sleep()\\n"); pause(); }
        count = count + 1;                                  // bỏ món vào bộ đệm
        printf("producer: inserted item %d, count = %d\\n", item, count);
        if (count == 1) {
            printf("producer: count == 1 -&gt; wakeup(consumer)\\n");
            pthread_kill(consumer_t, SIGUSR1);              // tiêu thụ CHƯA ngủ: wakeup bị mất
        }
    }
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    signal(SIGUSR1, on_wakeup);
    pthread_create(&amp;consumer_t, NULL, consumer, NULL);
    usleep(20 * 1000);
    pthread_create(&amp;producer_t, NULL, producer, NULL);
    sleep(2);                                               // bộ canh: 2 giây sau nhìn lại
    printf("watchdog after 2 s: count = %d, the consumer sleeps, the producer sleeps — forever\\n", count);
    exit(0);
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread danh-thuc-mat.c -o danh-thuc-mat &amp;&amp; ./danh-thuc-mat<br>
consumer: count == 0, I am about to sleep...<br>
producer: inserted item 1, count = 1<br>
producer: count == 1 -&gt; wakeup(consumer)<br>
producer: inserted item 2, count = 2<br>
producer: inserted item 3, count = 3<br>
producer: buffer full, I call sleep()<br>
consumer: now I call sleep()<br>
watchdog after 2 s: count = 3, the consumer sleeps, the producer sleeps — forever</div>
<p>Bộ canh thấy ba món trong bộ đệm, bên sản xuất đang ngủ và bên tiêu thụ đang ngủ — một lần treo không có đổ vỡ nào, loại lỗi khó tìm nhất. Cách vá nhanh của sách là một <strong>bit chờ đánh thức (wakeup-waiting bit)</strong> nhớ hộ tín hiệu gửi tới tiến trình đang thức; nó không mở rộng được (hai tiến trình cần hai bit, n tiến trình n bit). Cách sửa thật là semaphore: nó <em>đếm</em> số lần đánh thức.</p>
<p class="meo">🧠 Mất tín hiệu đánh thức = gọi điện cho một người chưa ngủ nhưng sắp ngủ: họ cúp máy nghĩ "chẳng ai gọi", rồi đi ngủ chờ một cuộc gọi đã tới từ trước.</p>`],
      [37, 'Semaphores (1)',
        `<p class="y-chinh">🎯 Figure 2-28 (producer): three semaphores — <code>mutex = 1</code> (controls access to the critical region), <code>empty = N</code> (counts empty slots), <code>full = 0</code> (counts full slots). The producer: <code>item = produce_item(); down(&amp;empty); down(&amp;mutex); insert_item(item); up(&amp;mutex); up(&amp;full);</code></p>
<p>Dijkstra (1965) proposed the <strong>semaphore</strong>: an integer variable that counts saved wakeups, with two operations. <strong>down</strong> (P, wait): if the value is greater than 0, decrement it and continue; if it is 0, the caller is put to sleep — and checking, changing and possibly sleeping are done as one <strong>atomic action</strong>. <strong>up</strong> (V, signal, post): if processes are sleeping on the semaphore, wake one of them (it completes its down); otherwise increment the value. Because the value remembers ups that nobody was waiting for, no wakeup can be lost. The OS makes down/up atomic by disabling interrupts for a few instructions on one CPU, or with TSL/XCHG-protected spin locks on several.</p>
<p>➕ The three semaphores have two jobs. <code>mutex</code> is a <strong>binary semaphore</strong> (values 0 and 1) used for <strong>mutual exclusion</strong>: only one process touches the buffer at a time. <code>empty</code> and <code>full</code> are used for <strong>synchronization</strong>: they make sure the producer stops when the buffer is full and the consumer stops when it is empty. Executed step by step with N = 2 (↓ = down, ↑ = up):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f918f5ea57d8db73274d115e327b9e86073b15c2.svg" alt="Figure 2-28 executed: the producer blocks on empty when the buffer is full and is woken by the consumer's up(empty)" loading="lazy" /><p class="chu-thich">🧮 Figure 2-28 executed: the producer blocks on empty when the buffer is full and is woken by the consumer's up(empty)</p></div>
<details><summary>Step-by-step trace</summary>
<table>
<thead><tr><th>t</th><th>who</th><th>what happens in this step</th><th>mutex</th><th>empty</th><th>full</th><th>buf</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>P</td><td>producer: down(&amp;empty)</td><td>1</td><td>1</td><td>0</td><td></td></tr>
<tr><td>1→2</td><td>P</td><td>producer: down(&amp;mutex)</td><td>0</td><td>1</td><td>0</td><td></td></tr>
<tr><td>2→3</td><td>P</td><td>producer: insert_item(1)</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>3→4</td><td>P</td><td>producer: up(&amp;mutex)</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>4→5</td><td>P</td><td>producer: up(&amp;full)</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>5→6</td><td>P</td><td>producer: down(&amp;empty)</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>6→7</td><td>P</td><td>producer: down(&amp;mutex)</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>7→8</td><td>P</td><td>producer: insert_item(2)</td><td>0</td><td>0</td><td>1</td><td>1 2</td></tr>
<tr><td>8→9</td><td>P</td><td>producer: up(&amp;mutex)</td><td>1</td><td>0</td><td>1</td><td>1 2</td></tr>
<tr><td>9→10</td><td>P</td><td>producer: up(&amp;full)</td><td>1</td><td>0</td><td>2</td><td>1 2</td></tr>
<tr><td>10→11</td><td>P</td><td>producer: down(&amp;empty) — <strong>blocks</strong></td><td>1</td><td>0</td><td>2</td><td>1 2</td></tr>
<tr><td>11→12</td><td>C</td><td>consumer: down(&amp;full)</td><td>1</td><td>0</td><td>1</td><td>1 2</td></tr>
<tr><td>12→13</td><td>C</td><td>consumer: down(&amp;mutex)</td><td>0</td><td>0</td><td>1</td><td>1 2</td></tr>
<tr><td>13→14</td><td>C</td><td>consumer: remove_item() → 1</td><td>0</td><td>0</td><td>1</td><td>2</td></tr>
<tr><td>14→15</td><td>C</td><td>consumer: up(&amp;mutex)</td><td>1</td><td>0</td><td>1</td><td>2</td></tr>
<tr><td>15→16</td><td>C</td><td>consumer: up(&amp;empty)</td><td>1</td><td>0</td><td>1</td><td>2</td></tr>
<tr><td>16→17</td><td>C</td><td>consumer: down(&amp;full)</td><td>1</td><td>0</td><td>0</td><td>2</td></tr>
<tr><td>17→18</td><td>P</td><td>producer: down(&amp;mutex)</td><td>0</td><td>0</td><td>0</td><td>2</td></tr>
<tr><td>18→19</td><td>P</td><td>producer: insert_item(3)</td><td>0</td><td>0</td><td>0</td><td>2 3</td></tr>
<tr><td>19→20</td><td>P</td><td>producer: up(&amp;mutex)</td><td>1</td><td>0</td><td>0</td><td>2 3</td></tr>
<tr><td>20→21</td><td>C</td><td>consumer: down(&amp;mutex)</td><td>0</td><td>0</td><td>0</td><td>2 3</td></tr>
<tr><td>21→22</td><td>C</td><td>consumer: remove_item() → 2</td><td>0</td><td>0</td><td>0</td><td>3</td></tr>
<tr><td>22→23</td><td>C</td><td>consumer: up(&amp;mutex)</td><td>1</td><td>0</td><td>0</td><td>3</td></tr>
<tr><td>23→24</td><td>P</td><td>producer: up(&amp;full)</td><td>1</td><td>0</td><td>1</td><td>3</td></tr>
<tr><td>24→25</td><td>C</td><td>consumer: up(&amp;empty)</td><td>1</td><td>1</td><td>1</td><td>3</td></tr>
<tr><td>25→26</td><td>C</td><td>consumer: down(&amp;full)</td><td>1</td><td>1</td><td>0</td><td>3</td></tr>
<tr><td>26→27</td><td>C</td><td>consumer: down(&amp;mutex)</td><td>0</td><td>1</td><td>0</td><td>3</td></tr>
<tr><td>27→28</td><td>C</td><td>consumer: remove_item() → 3</td><td>0</td><td>1</td><td>0</td><td></td></tr>
<tr><td>28→29</td><td>C</td><td>consumer: up(&amp;mutex)</td><td>1</td><td>1</td><td>0</td><td></td></tr>
<tr><td>29→30</td><td>C</td><td>consumer: up(&amp;empty)</td><td>1</td><td>2</td><td>0</td><td></td></tr>
</tbody>
</table>
</details>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const N = 2, SO_MON = 3;
const producer = (dao) =&gt; function* (s) {
  for (let item = 1; item &lt;= SO_MON; item++) {
    if (dao) {
      yield { down: 'mutex', n: '↓mutex', d: 'producer: down(&amp;mutex)   ← SWAPPED' };
      yield { down: 'empty', n: '↓empty', d: 'producer: down(&amp;empty)' };
    } else {
      yield { down: 'empty', n: '↓empty', d: 'producer: down(&amp;empty)' };
      yield { down: 'mutex', n: '↓mutex', d: 'producer: down(&amp;mutex)' };
    }
    s.buf.push(item);                   yield { n: &#96;put &#36;{item}&#96;, d: &#96;producer: insert_item(&#36;{item})&#96; };
    yield { up: 'mutex', n: '↑mutex', d: 'producer: up(&amp;mutex)' };
    yield { up: 'full', n: '↑full', d: 'producer: up(&amp;full)' };
  }
};
function* consumer(s, l) {
  for (let k = 1; k &lt;= SO_MON; k++) {
    yield { down: 'full', n: '↓full', d: 'consumer: down(&amp;full)' };
    yield { down: 'mutex', n: '↓mutex', d: 'consumer: down(&amp;mutex)' };
    l.item = s.buf.shift();             yield { n: &#96;take &#36;{l.item}&#96;, d: &#96;consumer: remove_item() → &#36;{l.item}&#96; };
    yield { up: 'mutex', n: '↑mutex', d: 'consumer: up(&amp;mutex)' };
    yield { up: 'empty', n: '↑empty', d: 'consumer: up(&amp;empty)' };
    s.got.push(l.item);
  }
}</code></pre></details>
<p>The producer filled both slots, blocked on <code>down(&amp;empty)</code> for the third item, and was woken by the consumer's <code>up(&amp;empty)</code>; everything was consumed in order.</p>
<p class="meo">🧠 A semaphore is a car park counter: <code>empty</code> = free spaces shown on the sign. Each car entering does down (−1); at 0 the barrier stays shut and cars queue; each car leaving does up (+1) and lets one waiting car in.</p>`,
        `<p class="y-chinh">🎯 Hình 2-28 (bên sản xuất): ba semaphore — <code>mutex = 1</code> (kiểm soát vào vùng găng), <code>empty = N</code> (đếm ô trống), <code>full = 0</code> (đếm ô đầy). Bên sản xuất: <code>item = produce_item(); down(&amp;empty); down(&amp;mutex); insert_item(item); up(&amp;mutex); up(&amp;full);</code></p>
<p>Dijkstra (1965) đề xuất <strong>semaphore</strong>: một biến nguyên đếm số lần đánh thức đã để dành, với hai thao tác. <strong>down</strong> (P, wait): nếu giá trị lớn hơn 0 thì giảm đi 1 rồi đi tiếp; nếu bằng 0 thì bên gọi bị cho ngủ — và việc kiểm tra, thay đổi và có thể đi ngủ được làm như một <strong>hành động nguyên tử</strong>. <strong>up</strong> (V, signal, post): nếu có tiến trình đang ngủ trên semaphore thì đánh thức một tiến trình (nó hoàn tất lệnh down của mình); nếu không thì tăng giá trị lên. Vì giá trị nhớ hộ những lần up không ai chờ, không tín hiệu đánh thức nào bị mất. HĐH làm down/up nguyên tử bằng cách tắt ngắt trong vài lệnh trên một CPU, hoặc bằng khoá quay dùng TSL/XCHG trên nhiều CPU.</p>
<p>➕ Ba semaphore làm hai việc. <code>mutex</code> là <strong>semaphore nhị phân</strong> (giá trị 0 và 1) dùng cho <strong>loại trừ tương hỗ</strong>: mỗi lúc chỉ một tiến trình chạm vào bộ đệm. <code>empty</code> và <code>full</code> dùng cho <strong>đồng bộ (synchronization)</strong>: bảo đảm bên sản xuất dừng khi bộ đệm đầy và bên tiêu thụ dừng khi rỗng. Thực thi từng bước với N = 2 (↓ = down, ↑ = up):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/baf9634a9976162ffdf124f6f9ebe3894fc8b42a.svg" alt="Hình 2-28 được thực thi: bên sản xuất bị chặn ở empty khi bộ đệm đầy và được up(empty) của bên tiêu thụ đánh thức" loading="lazy" /><p class="chu-thich">🧮 Hình 2-28 được thực thi: bên sản xuất bị chặn ở empty khi bộ đệm đầy và được up(empty) của bên tiêu thụ đánh thức</p></div>
<details><summary>Vết từng bước</summary>
<table>
<thead><tr><th>t</th><th>ai</th><th>việc xảy ra trong bước này</th><th>mutex</th><th>empty</th><th>full</th><th>buf</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>P</td><td>producer: down(&amp;empty)</td><td>1</td><td>1</td><td>0</td><td></td></tr>
<tr><td>1→2</td><td>P</td><td>producer: down(&amp;mutex)</td><td>0</td><td>1</td><td>0</td><td></td></tr>
<tr><td>2→3</td><td>P</td><td>producer: insert_item(1)</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>3→4</td><td>P</td><td>producer: up(&amp;mutex)</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>4→5</td><td>P</td><td>producer: up(&amp;full)</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>5→6</td><td>P</td><td>producer: down(&amp;empty)</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>6→7</td><td>P</td><td>producer: down(&amp;mutex)</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>7→8</td><td>P</td><td>producer: insert_item(2)</td><td>0</td><td>0</td><td>1</td><td>1 2</td></tr>
<tr><td>8→9</td><td>P</td><td>producer: up(&amp;mutex)</td><td>1</td><td>0</td><td>1</td><td>1 2</td></tr>
<tr><td>9→10</td><td>P</td><td>producer: up(&amp;full)</td><td>1</td><td>0</td><td>2</td><td>1 2</td></tr>
<tr><td>10→11</td><td>P</td><td>producer: down(&amp;empty) — <strong>bị chặn</strong></td><td>1</td><td>0</td><td>2</td><td>1 2</td></tr>
<tr><td>11→12</td><td>C</td><td>consumer: down(&amp;full)</td><td>1</td><td>0</td><td>1</td><td>1 2</td></tr>
<tr><td>12→13</td><td>C</td><td>consumer: down(&amp;mutex)</td><td>0</td><td>0</td><td>1</td><td>1 2</td></tr>
<tr><td>13→14</td><td>C</td><td>consumer: remove_item() → 1</td><td>0</td><td>0</td><td>1</td><td>2</td></tr>
<tr><td>14→15</td><td>C</td><td>consumer: up(&amp;mutex)</td><td>1</td><td>0</td><td>1</td><td>2</td></tr>
<tr><td>15→16</td><td>C</td><td>consumer: up(&amp;empty)</td><td>1</td><td>0</td><td>1</td><td>2</td></tr>
<tr><td>16→17</td><td>C</td><td>consumer: down(&amp;full)</td><td>1</td><td>0</td><td>0</td><td>2</td></tr>
<tr><td>17→18</td><td>P</td><td>producer: down(&amp;mutex)</td><td>0</td><td>0</td><td>0</td><td>2</td></tr>
<tr><td>18→19</td><td>P</td><td>producer: insert_item(3)</td><td>0</td><td>0</td><td>0</td><td>2 3</td></tr>
<tr><td>19→20</td><td>P</td><td>producer: up(&amp;mutex)</td><td>1</td><td>0</td><td>0</td><td>2 3</td></tr>
<tr><td>20→21</td><td>C</td><td>consumer: down(&amp;mutex)</td><td>0</td><td>0</td><td>0</td><td>2 3</td></tr>
<tr><td>21→22</td><td>C</td><td>consumer: remove_item() → 2</td><td>0</td><td>0</td><td>0</td><td>3</td></tr>
<tr><td>22→23</td><td>C</td><td>consumer: up(&amp;mutex)</td><td>1</td><td>0</td><td>0</td><td>3</td></tr>
<tr><td>23→24</td><td>P</td><td>producer: up(&amp;full)</td><td>1</td><td>0</td><td>1</td><td>3</td></tr>
<tr><td>24→25</td><td>C</td><td>consumer: up(&amp;empty)</td><td>1</td><td>1</td><td>1</td><td>3</td></tr>
<tr><td>25→26</td><td>C</td><td>consumer: down(&amp;full)</td><td>1</td><td>1</td><td>0</td><td>3</td></tr>
<tr><td>26→27</td><td>C</td><td>consumer: down(&amp;mutex)</td><td>0</td><td>1</td><td>0</td><td>3</td></tr>
<tr><td>27→28</td><td>C</td><td>consumer: remove_item() → 3</td><td>0</td><td>1</td><td>0</td><td></td></tr>
<tr><td>28→29</td><td>C</td><td>consumer: up(&amp;mutex)</td><td>1</td><td>1</td><td>0</td><td></td></tr>
<tr><td>29→30</td><td>C</td><td>consumer: up(&amp;empty)</td><td>1</td><td>2</td><td>0</td><td></td></tr>
</tbody>
</table>
</details>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const N = 2, SO_MON = 3;
const producer = (dao) =&gt; function* (s) {
  for (let item = 1; item &lt;= SO_MON; item++) {
    if (dao) {
      yield { down: 'mutex', n: '↓mutex', d: 'producer: down(&amp;mutex)   ← SWAPPED' };
      yield { down: 'empty', n: '↓empty', d: 'producer: down(&amp;empty)' };
    } else {
      yield { down: 'empty', n: '↓empty', d: 'producer: down(&amp;empty)' };
      yield { down: 'mutex', n: '↓mutex', d: 'producer: down(&amp;mutex)' };
    }
    s.buf.push(item);                   yield { n: &#96;put &#36;{item}&#96;, d: &#96;producer: insert_item(&#36;{item})&#96; };
    yield { up: 'mutex', n: '↑mutex', d: 'producer: up(&amp;mutex)' };
    yield { up: 'full', n: '↑full', d: 'producer: up(&amp;full)' };
  }
};
function* consumer(s, l) {
  for (let k = 1; k &lt;= SO_MON; k++) {
    yield { down: 'full', n: '↓full', d: 'consumer: down(&amp;full)' };
    yield { down: 'mutex', n: '↓mutex', d: 'consumer: down(&amp;mutex)' };
    l.item = s.buf.shift();             yield { n: &#96;take &#36;{l.item}&#96;, d: &#96;consumer: remove_item() → &#36;{l.item}&#96; };
    yield { up: 'mutex', n: '↑mutex', d: 'consumer: up(&amp;mutex)' };
    yield { up: 'empty', n: '↑empty', d: 'consumer: up(&amp;empty)' };
    s.got.push(l.item);
  }
}</code></pre></details>
<p>Bên sản xuất lấp đầy hai ô, bị chặn ở <code>down(&amp;empty)</code> cho món thứ ba, và được lệnh <code>up(&amp;empty)</code> của bên tiêu thụ đánh thức; mọi món đều được tiêu thụ đúng thứ tự.</p>
<p class="meo">🧠 Semaphore là bảng đếm của bãi đỗ xe: <code>empty</code> = số chỗ trống trên bảng. Mỗi xe vào làm down (−1); về 0 thì barie đóng và xe xếp hàng; mỗi xe ra làm up (+1) và cho một xe đang chờ vào.</p>`],
      [38, 'Semaphores (2)',
        `<p class="y-chinh">🎯 Figure 2-28 (consumer): <code>down(&amp;full); down(&amp;mutex); item = remove_item(); up(&amp;mutex); up(&amp;empty); consume_item(item);</code> — the mirror image of the producer.</p>
<p>The consumer waits until there is at least one full slot, takes the mutex, removes an item, releases the mutex, announces one more empty slot, and only then consumes the item — outside the critical region, so the buffer is held as briefly as possible. Each semaphore is "upped" by one side and "downed" by the other: <code>full</code> goes from producer to consumer, <code>empty</code> back from consumer to producer. In the book's version all three are initialized before any process starts, and the down/up operations are system calls that the OS implements atomically.</p>
<p>➕ Figure 2-28 with real POSIX semaphores (<code>sem_wait</code> = down, <code>sem_post</code> = up), a buffer of 4 slots and 20 items:</p>
<pre><code class="language-c">// Figure 2-28 with real POSIX semaphores: sem_wait = down, sem_post = up
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;semaphore.h&gt;

#define N 4                                  // slots in the buffer
#define ITEMS 20
sem_t mutex, empty, full;                    // the three semaphores of the book
int buffer[N], in = 0, out = 0;
long sum = 0;

void *producer(void *arg) {
    for (int item = 1; item &lt;= ITEMS; item++) {   // produce_item()
        sem_wait(&amp;empty);                    // down(&amp;empty)
        sem_wait(&amp;mutex);                    // down(&amp;mutex)
        buffer[in] = item; in = (in + 1) % N;  // insert_item(item)
        sem_post(&amp;mutex);                    // up(&amp;mutex)
        sem_post(&amp;full);                     // up(&amp;full)
    }
    return NULL;
}

void *consumer(void *arg) {
    for (int k = 1; k &lt;= ITEMS; k++) {
        sem_wait(&amp;full);                     // down(&amp;full)
        sem_wait(&amp;mutex);
        int item = buffer[out]; out = (out + 1) % N;   // remove_item()
        sem_post(&amp;mutex);
        sem_post(&amp;empty);                    // up(&amp;empty)
        printf("%d%s", item, k &lt; ITEMS ? " " : "\\n");  // consume_item(item)
        sum += item;
    }
    return NULL;
}

int main(void) {
    sem_init(&amp;mutex, 0, 1);                  // 0 = shared between threads of this process
    sem_init(&amp;empty, 0, N);
    sem_init(&amp;full, 0, 0);
    pthread_t p, c;
    pthread_create(&amp;p, NULL, producer, NULL);
    pthread_create(&amp;c, NULL, consumer, NULL);
    pthread_join(p, NULL);
    pthread_join(c, NULL);
    int e, f;
    sem_getvalue(&amp;empty, &amp;e); sem_getvalue(&amp;full, &amp;f);
    printf("consumed %d items, sum = %ld (1 + 2 + ... + %d = %d)\\n", ITEMS, sum, ITEMS, ITEMS * (ITEMS + 1) / 2);
    printf("at the end: empty = %d, full = %d\\n", e, f);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread sx-tt-semaphore.c -o sx-tt-semaphore &amp;&amp; ./sx-tt-semaphore<br>
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20<br>
consumed 20 items, sum = 210 (1 + 2 + ... + 20 = 210)<br>
at the end: empty = 4, full = 0</div>
<p>All twenty items, in order, and both counters back to their starting values (4 empty, 0 full). Now the most famous exam question of the chapter: <strong>what if the producer does <code>down(&amp;mutex)</code> before <code>down(&amp;empty)</code>?</strong> When the buffer is full, the producer sleeps on <code>empty</code> while <em>holding</em> the mutex; the consumer then sleeps on the mutex and can never free a slot:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/0a231f0bcb5034d8366bca37617a20671d253fcc.svg" alt="The two downs swapped: the producer sleeps holding the mutex, the consumer sleeps on the mutex — deadlock" loading="lazy" /><p class="chu-thich">🧮 The two downs swapped: the producer sleeps holding the mutex, the consumer sleeps on the mutex — deadlock</p></div>
<details><summary>Step-by-step trace</summary>
<table>
<thead><tr><th>t</th><th>who</th><th>what happens in this step</th><th>mutex</th><th>empty</th><th>full</th><th>buf</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>P</td><td>producer: down(&amp;mutex)   ← SWAPPED</td><td>0</td><td>2</td><td>0</td><td></td></tr>
<tr><td>1→2</td><td>P</td><td>producer: down(&amp;empty)</td><td>0</td><td>1</td><td>0</td><td></td></tr>
<tr><td>2→3</td><td>P</td><td>producer: insert_item(1)</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>3→4</td><td>P</td><td>producer: up(&amp;mutex)</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>4→5</td><td>P</td><td>producer: up(&amp;full)</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>5→6</td><td>P</td><td>producer: down(&amp;mutex)   ← SWAPPED</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>6→7</td><td>P</td><td>producer: down(&amp;empty)</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>7→8</td><td>P</td><td>producer: insert_item(2)</td><td>0</td><td>0</td><td>1</td><td>1 2</td></tr>
<tr><td>8→9</td><td>P</td><td>producer: up(&amp;mutex)</td><td>1</td><td>0</td><td>1</td><td>1 2</td></tr>
<tr><td>9→10</td><td>P</td><td>producer: up(&amp;full)</td><td>1</td><td>0</td><td>2</td><td>1 2</td></tr>
<tr><td>10→11</td><td>P</td><td>producer: down(&amp;mutex)   ← SWAPPED</td><td>0</td><td>0</td><td>2</td><td>1 2</td></tr>
<tr><td>11→12</td><td>P</td><td>producer: down(&amp;empty) — <strong>blocks</strong></td><td>0</td><td>0</td><td>2</td><td>1 2</td></tr>
<tr><td>12→13</td><td>C</td><td>consumer: down(&amp;full)</td><td>0</td><td>0</td><td>1</td><td>1 2</td></tr>
<tr><td>13→14</td><td>C</td><td>consumer: down(&amp;mutex) — <strong>blocks</strong></td><td>0</td><td>0</td><td>1</td><td>1 2</td></tr>
</tbody>
</table>
</details>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const N = 2, SO_MON = 3;
const producer = (dao) =&gt; function* (s) {
  for (let item = 1; item &lt;= SO_MON; item++) {
    if (dao) {
      yield { down: 'mutex', n: '↓mutex', d: 'producer: down(&amp;mutex)   ← SWAPPED' };
      yield { down: 'empty', n: '↓empty', d: 'producer: down(&amp;empty)' };
    } else {
      yield { down: 'empty', n: '↓empty', d: 'producer: down(&amp;empty)' };
      yield { down: 'mutex', n: '↓mutex', d: 'producer: down(&amp;mutex)' };
    }
    s.buf.push(item);                   yield { n: &#96;put &#36;{item}&#96;, d: &#96;producer: insert_item(&#36;{item})&#96; };
    yield { up: 'mutex', n: '↑mutex', d: 'producer: up(&amp;mutex)' };
    yield { up: 'full', n: '↑full', d: 'producer: up(&amp;full)' };
  }
};
function* consumer(s, l) {
  for (let k = 1; k &lt;= SO_MON; k++) {
    yield { down: 'full', n: '↓full', d: 'consumer: down(&amp;full)' };
    yield { down: 'mutex', n: '↓mutex', d: 'consumer: down(&amp;mutex)' };
    l.item = s.buf.shift();             yield { n: &#96;take &#36;{l.item}&#96;, d: &#96;consumer: remove_item() → &#36;{l.item}&#96; };
    yield { up: 'mutex', n: '↑mutex', d: 'consumer: up(&amp;mutex)' };
    yield { up: 'empty', n: '↑empty', d: 'consumer: up(&amp;empty)' };
    s.got.push(l.item);
  }
}</code></pre></details>
<pre><code class="language-c">// The exam question made real: swap down(&amp;empty) and down(&amp;mutex) in the producer
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;
#include &lt;semaphore.h&gt;

#define N 2
sem_t mutex, empty, full;
int buffer[N], in = 0, out = 0;

void *producer(void *arg) {
    for (int item = 1; ; item++) {
        sem_wait(&amp;mutex);                    // SWAPPED: mutex first...
        printf("producer: holds mutex, wants an empty slot for item %d\\n", item);
        sem_wait(&amp;empty);                    // ...then sleeps here while holding mutex
        buffer[in] = item; in = (in + 1) % N;
        sem_post(&amp;mutex);
        sem_post(&amp;full);
    }
}

void *consumer(void *arg) {
    usleep(200 * 1000);                      // starts a little later: the buffer is already full
    printf("consumer: wants an item\\n");
    sem_wait(&amp;full);
    printf("consumer: there are items, now wants the mutex\\n");
    sem_wait(&amp;mutex);                        // never returns
    printf("consumer: got the mutex (never printed)\\n");
    return NULL;
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    sem_init(&amp;mutex, 0, 1); sem_init(&amp;empty, 0, N); sem_init(&amp;full, 0, 0);
    pthread_t p, c;
    pthread_create(&amp;p, NULL, producer, NULL);
    pthread_create(&amp;c, NULL, consumer, NULL);
    sleep(2);                                // watchdog
    int m, e, f;
    sem_getvalue(&amp;mutex, &amp;m); sem_getvalue(&amp;empty, &amp;e); sem_getvalue(&amp;full, &amp;f);
    printf("watchdog after 2 s: mutex = %d, empty = %d, full = %d — both threads blocked: DEADLOCK\\n", m, e, f);
    exit(0);
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dao-down.c -o dao-down &amp;&amp; ./dao-down<br>
producer: holds mutex, wants an empty slot for item 1<br>
producer: holds mutex, wants an empty slot for item 2<br>
producer: holds mutex, wants an empty slot for item 3<br>
consumer: wants an item<br>
consumer: there are items, now wants the mutex<br>
watchdog after 2 s: mutex = 0, empty = 0, full = 1 — both threads blocked: DEADLOCK</div>
<p>Deadlock, measured: <code>mutex</code> = 0 (held by the sleeping producer), <code>empty</code> = 0, both threads blocked. The rule: <strong>acquire the counting semaphore first, the mutex last</strong>; and keep the mutex only around the buffer operations. (Order of the two <code>up</code>s does not matter.)</p>
<p class="pitfall">⚠️ "Swap down(&amp;empty) and down(&amp;mutex) in the producer — what happens?" → <strong>deadlock</strong> when the buffer is full (similarly, swapping down(&amp;full) and down(&amp;mutex) in the consumer deadlocks when the buffer is empty). This is Chapter 6's "hold and wait" in four lines.</p>`,
        `<p class="y-chinh">🎯 Hình 2-28 (bên tiêu thụ): <code>down(&amp;full); down(&amp;mutex); item = remove_item(); up(&amp;mutex); up(&amp;empty); consume_item(item);</code> — ảnh gương của bên sản xuất.</p>
<p>Bên tiêu thụ chờ tới khi có ít nhất một ô đầy, lấy mutex, lấy một món ra, nhả mutex, báo có thêm một ô trống, và chỉ sau đó mới dùng món hàng — ngoài vùng găng, để bộ đệm bị giữ trong thời gian ngắn nhất. Mỗi semaphore được một bên "up" và bên kia "down": <code>full</code> đi từ sản xuất sang tiêu thụ, <code>empty</code> đi ngược lại từ tiêu thụ về sản xuất. Trong bản của sách cả ba được khởi tạo trước khi tiến trình nào chạy, và down/up là các lời gọi hệ thống mà HĐH thực hiện một cách nguyên tử.</p>
<p>➕ Hình 2-28 với semaphore POSIX thật (<code>sem_wait</code> = down, <code>sem_post</code> = up), bộ đệm 4 ô và 20 món:</p>
<pre><code class="language-c">// Hình 2-28 với semaphore POSIX thật: sem_wait = down, sem_post = up
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;semaphore.h&gt;

#define N 4                                  // số ô của bộ đệm
#define ITEMS 20
sem_t mutex, empty, full;                    // ba semaphore của sách
int buffer[N], in = 0, out = 0;
long sum = 0;

void *producer(void *arg) {
    for (int item = 1; item &lt;= ITEMS; item++) {   // tạo món hàng
        sem_wait(&amp;empty);                    // down(&amp;empty)
        sem_wait(&amp;mutex);                    // down(&amp;mutex)
        buffer[in] = item; in = (in + 1) % N;  // bỏ món vào bộ đệm
        sem_post(&amp;mutex);                    // up(&amp;mutex)
        sem_post(&amp;full);                     // up(&amp;full)
    }
    return NULL;
}

void *consumer(void *arg) {
    for (int k = 1; k &lt;= ITEMS; k++) {
        sem_wait(&amp;full);                     // down(&amp;full)
        sem_wait(&amp;mutex);
        int item = buffer[out]; out = (out + 1) % N;   // lấy món ra
        sem_post(&amp;mutex);
        sem_post(&amp;empty);                    // up(&amp;empty)
        printf("%d%s", item, k &lt; ITEMS ? " " : "\\n");  // dùng món hàng
        sum += item;
    }
    return NULL;
}

int main(void) {
    sem_init(&amp;mutex, 0, 1);                  // 0 = dùng chung giữa các luồng của tiến trình này
    sem_init(&amp;empty, 0, N);
    sem_init(&amp;full, 0, 0);
    pthread_t p, c;
    pthread_create(&amp;p, NULL, producer, NULL);
    pthread_create(&amp;c, NULL, consumer, NULL);
    pthread_join(p, NULL);
    pthread_join(c, NULL);
    int e, f;
    sem_getvalue(&amp;empty, &amp;e); sem_getvalue(&amp;full, &amp;f);
    printf("consumed %d items, sum = %ld (1 + 2 + ... + %d = %d)\\n", ITEMS, sum, ITEMS, ITEMS * (ITEMS + 1) / 2);
    printf("at the end: empty = %d, full = %d\\n", e, f);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread sx-tt-semaphore.c -o sx-tt-semaphore &amp;&amp; ./sx-tt-semaphore<br>
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20<br>
consumed 20 items, sum = 210 (1 + 2 + ... + 20 = 210)<br>
at the end: empty = 4, full = 0</div>
<p>Đủ hai mươi món, đúng thứ tự, và cả hai bộ đếm trở về giá trị ban đầu (4 trống, 0 đầy). Giờ là câu thi nổi tiếng nhất của chương: <strong>nếu bên sản xuất làm <code>down(&amp;mutex)</code> trước <code>down(&amp;empty)</code> thì sao?</strong> Khi bộ đệm đầy, bên sản xuất ngủ ở <code>empty</code> trong lúc <em>đang giữ</em> mutex; bên tiêu thụ khi đó ngủ ở mutex và không bao giờ làm trống được ô nào:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f229218956b7be71002d02bc5dc1bbe9b2919b13.svg" alt="Đảo hai lệnh down: bên sản xuất ngủ khi đang giữ mutex, bên tiêu thụ ngủ ở mutex — bế tắc" loading="lazy" /><p class="chu-thich">🧮 Đảo hai lệnh down: bên sản xuất ngủ khi đang giữ mutex, bên tiêu thụ ngủ ở mutex — bế tắc</p></div>
<details><summary>Vết từng bước</summary>
<table>
<thead><tr><th>t</th><th>ai</th><th>việc xảy ra trong bước này</th><th>mutex</th><th>empty</th><th>full</th><th>buf</th></tr></thead>
<tbody>
<tr><td>0→1</td><td>P</td><td>producer: down(&amp;mutex)   ← SWAPPED</td><td>0</td><td>2</td><td>0</td><td></td></tr>
<tr><td>1→2</td><td>P</td><td>producer: down(&amp;empty)</td><td>0</td><td>1</td><td>0</td><td></td></tr>
<tr><td>2→3</td><td>P</td><td>producer: insert_item(1)</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>3→4</td><td>P</td><td>producer: up(&amp;mutex)</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>4→5</td><td>P</td><td>producer: up(&amp;full)</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>5→6</td><td>P</td><td>producer: down(&amp;mutex)   ← SWAPPED</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>6→7</td><td>P</td><td>producer: down(&amp;empty)</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>7→8</td><td>P</td><td>producer: insert_item(2)</td><td>0</td><td>0</td><td>1</td><td>1 2</td></tr>
<tr><td>8→9</td><td>P</td><td>producer: up(&amp;mutex)</td><td>1</td><td>0</td><td>1</td><td>1 2</td></tr>
<tr><td>9→10</td><td>P</td><td>producer: up(&amp;full)</td><td>1</td><td>0</td><td>2</td><td>1 2</td></tr>
<tr><td>10→11</td><td>P</td><td>producer: down(&amp;mutex)   ← SWAPPED</td><td>0</td><td>0</td><td>2</td><td>1 2</td></tr>
<tr><td>11→12</td><td>P</td><td>producer: down(&amp;empty) — <strong>bị chặn</strong></td><td>0</td><td>0</td><td>2</td><td>1 2</td></tr>
<tr><td>12→13</td><td>C</td><td>consumer: down(&amp;full)</td><td>0</td><td>0</td><td>1</td><td>1 2</td></tr>
<tr><td>13→14</td><td>C</td><td>consumer: down(&amp;mutex) — <strong>bị chặn</strong></td><td>0</td><td>0</td><td>1</td><td>1 2</td></tr>
</tbody>
</table>
</details>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const N = 2, SO_MON = 3;
const producer = (dao) =&gt; function* (s) {
  for (let item = 1; item &lt;= SO_MON; item++) {
    if (dao) {
      yield { down: 'mutex', n: '↓mutex', d: 'producer: down(&amp;mutex)   ← SWAPPED' };
      yield { down: 'empty', n: '↓empty', d: 'producer: down(&amp;empty)' };
    } else {
      yield { down: 'empty', n: '↓empty', d: 'producer: down(&amp;empty)' };
      yield { down: 'mutex', n: '↓mutex', d: 'producer: down(&amp;mutex)' };
    }
    s.buf.push(item);                   yield { n: &#96;put &#36;{item}&#96;, d: &#96;producer: insert_item(&#36;{item})&#96; };
    yield { up: 'mutex', n: '↑mutex', d: 'producer: up(&amp;mutex)' };
    yield { up: 'full', n: '↑full', d: 'producer: up(&amp;full)' };
  }
};
function* consumer(s, l) {
  for (let k = 1; k &lt;= SO_MON; k++) {
    yield { down: 'full', n: '↓full', d: 'consumer: down(&amp;full)' };
    yield { down: 'mutex', n: '↓mutex', d: 'consumer: down(&amp;mutex)' };
    l.item = s.buf.shift();             yield { n: &#96;take &#36;{l.item}&#96;, d: &#96;consumer: remove_item() → &#36;{l.item}&#96; };
    yield { up: 'mutex', n: '↑mutex', d: 'consumer: up(&amp;mutex)' };
    yield { up: 'empty', n: '↑empty', d: 'consumer: up(&amp;empty)' };
    s.got.push(l.item);
  }
}</code></pre></details>
<pre><code class="language-c">// Câu hỏi thi làm thật: đảo down(&amp;empty) và down(&amp;mutex) ở bên sản xuất
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;
#include &lt;semaphore.h&gt;

#define N 2
sem_t mutex, empty, full;
int buffer[N], in = 0, out = 0;

void *producer(void *arg) {
    for (int item = 1; ; item++) {
        sem_wait(&amp;mutex);                    // ĐẢO: lấy mutex trước...
        printf("producer: holds mutex, wants an empty slot for item %d\\n", item);
        sem_wait(&amp;empty);                    // ...rồi ngủ ở đây khi vẫn giữ mutex
        buffer[in] = item; in = (in + 1) % N;
        sem_post(&amp;mutex);
        sem_post(&amp;full);
    }
}

void *consumer(void *arg) {
    usleep(200 * 1000);                      // bắt đầu muộn một chút: bộ đệm đã đầy
    printf("consumer: wants an item\\n");
    sem_wait(&amp;full);
    printf("consumer: there are items, now wants the mutex\\n");
    sem_wait(&amp;mutex);                        // không bao giờ trả về
    printf("consumer: got the mutex (never printed)\\n");
    return NULL;
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    sem_init(&amp;mutex, 0, 1); sem_init(&amp;empty, 0, N); sem_init(&amp;full, 0, 0);
    pthread_t p, c;
    pthread_create(&amp;p, NULL, producer, NULL);
    pthread_create(&amp;c, NULL, consumer, NULL);
    sleep(2);                                // bộ canh
    int m, e, f;
    sem_getvalue(&amp;mutex, &amp;m); sem_getvalue(&amp;empty, &amp;e); sem_getvalue(&amp;full, &amp;f);
    printf("watchdog after 2 s: mutex = %d, empty = %d, full = %d — both threads blocked: DEADLOCK\\n", m, e, f);
    exit(0);
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dao-down.c -o dao-down &amp;&amp; ./dao-down<br>
producer: holds mutex, wants an empty slot for item 1<br>
producer: holds mutex, wants an empty slot for item 2<br>
producer: holds mutex, wants an empty slot for item 3<br>
consumer: wants an item<br>
consumer: there are items, now wants the mutex<br>
watchdog after 2 s: mutex = 0, empty = 0, full = 1 — both threads blocked: DEADLOCK</div>
<p>Bế tắc, đo thật: <code>mutex</code> = 0 (bên sản xuất đang ngủ giữ nó), <code>empty</code> = 0, cả hai luồng bị chặn. Quy tắc: <strong>lấy semaphore đếm trước, lấy mutex sau cùng</strong>; và chỉ giữ mutex quanh các thao tác trên bộ đệm. (Thứ tự hai lệnh <code>up</code> thì không quan trọng.)</p>
<p class="pitfall">⚠️ "Đảo down(&amp;empty) và down(&amp;mutex) ở bên sản xuất — chuyện gì xảy ra?" → <strong>bế tắc (deadlock)</strong> khi bộ đệm đầy (tương tự, đảo down(&amp;full) và down(&amp;mutex) ở bên tiêu thụ thì bế tắc khi bộ đệm rỗng). Đây là điều kiện "giữ và chờ" của Chương 6 gói trong bốn dòng.</p>`],
      [39, 'Mutexes',
        `<p class="y-chinh">🎯 Figure 2-29: implementation of <code>mutex_lock</code> and <code>mutex_unlock</code> for user-level threads: <code>mutex_lock: TSL REGISTER,MUTEX | CMP REGISTER,#0 | JZE ok | CALL thread_yield | JMP mutex_lock | ok: RET</code>; <code>mutex_unlock: MOVE MUTEX,#0 | RET</code>.</p>
<p>A <strong>mutex</strong> is a simplified semaphore with two states, unlocked (0) and locked: it only does mutual exclusion, no counting. Compare it with <code>enter_region</code> of Figure 2-25: the only difference is what happens when the lock is taken. <code>enter_region</code> loops (busy waiting); <code>mutex_lock</code> calls <code>thread_yield</code> to give the CPU to another thread, then tries again. With user-level threads there is no clock to stop a spinning thread, so a thread that spins would spin <em>forever</em> — the lock holder never gets to run. Yielding solves it, and because <code>thread_yield</code> is just a call into the user-space run-time system, the whole lock needs no kernel call.</p>
<p>➕ The difference measured with kernel threads too: 8 threads on <strong>one</strong> core share a lock whose critical region is fairly long. First the lock spins like <code>enter_region</code>, then it yields like <code>mutex_lock</code>:</p>
<pre><code class="language-c">// Figure 2-29's point: 8 threads on ONE CPU — a waiting thread should give the CPU away (thread_yield), not spin
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;sched.h&gt;
#include &lt;time.h&gt;

int lock = 0;
long counter = 0;
int polite;                                         // 0 = spin, 1 = yield

static void mutex_lock(void) {
    while (__atomic_test_and_set(&amp;lock, __ATOMIC_ACQUIRE)) {   // TSL REGISTER,MUTEX
        if (polite) sched_yield();                  // CALL thread_yield: let the lock holder run
    }                                               // (polite == 0: just try again — a spin lock)
}
static void mutex_unlock(void) { __atomic_clear(&amp;lock, __ATOMIC_RELEASE); }

void *work(void *arg) {
    for (int i = 0; i &lt; 10000; i++) {
        mutex_lock();
        counter++;
        for (volatile int k = 0; k &lt; 2000; k++) ;   // a longer critical region
        mutex_unlock();
    }
    return NULL;
}

static double run(void) {
    struct timespec s, e;
    counter = 0;
    clock_gettime(CLOCK_MONOTONIC, &amp;s);
    pthread_t t[8];
    for (int i = 0; i &lt; 8; i++) pthread_create(&amp;t[i], NULL, work, NULL);
    for (int i = 0; i &lt; 8; i++) pthread_join(t[i], NULL);
    clock_gettime(CLOCK_MONOTONIC, &amp;e);
    return (e.tv_sec - s.tv_sec) * 1e3 + (e.tv_nsec - s.tv_nsec) / 1e6;
}

int main(void) {
    polite = 0; double a = run();
    printf("spin  : counter = %ld, time %.0f ms\\n", counter, a);
    polite = 1; double b = run();
    printf("yield : counter = %ld, time %.0f ms\\n", counter, b);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread quay-hay-nhuong.c -o quay-hay-nhuong &amp;&amp; taskset -c 0 ./quay-hay-nhuong<br>
spin &nbsp;: counter = 80000, time 647 ms<br>
yield : counter = 80000, time 134 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Same correct count, but the spinning version is several times slower: whenever the lock holder is preempted inside its critical region, the other threads burn their whole time slices spinning on a lock that cannot be released until the holder runs again. Yielding hands the CPU back at once. (On a multicore machine with very short critical regions, spinning can win — the holder is running on another core and releases within nanoseconds. Real locks spin briefly and then sleep.)</p>
<p class="meo">🧠 Spin = stand at the locked door rattling the handle. Yield = knock once, go sit down, come back later. Sleep (futex, next slide) = leave your phone number so the person inside calls you when they come out.</p>`,
        `<p class="y-chinh">🎯 Hình 2-29: cài đặt <code>mutex_lock</code> và <code>mutex_unlock</code> cho luồng mức người dùng: <code>mutex_lock: TSL REGISTER,MUTEX | CMP REGISTER,#0 | JZE ok | CALL thread_yield | JMP mutex_lock | ok: RET</code>; <code>mutex_unlock: MOVE MUTEX,#0 | RET</code>.</p>
<p><strong>Mutex</strong> là một semaphore rút gọn có hai trạng thái, mở (0) và khoá: nó chỉ làm loại trừ tương hỗ, không đếm. So với <code>enter_region</code> của Hình 2-25: khác biệt duy nhất là việc làm khi khoá đã có người giữ. <code>enter_region</code> lặp (chờ bận); <code>mutex_lock</code> gọi <code>thread_yield</code> để nhường CPU cho luồng khác, rồi thử lại. Với luồng mức người dùng không có đồng hồ nào dừng được một luồng đang quay, nên luồng quay sẽ quay <em>mãi mãi</em> — người giữ khoá không bao giờ được chạy. Nhường giải được chuyện đó, và vì <code>thread_yield</code> chỉ là lời gọi vào hệ thống thời gian chạy ở không gian người dùng, cả cái khoá không cần gọi nhân lần nào.</p>
<p>➕ Khác biệt đo được cả với luồng nhân: 8 luồng trên <strong>một</strong> lõi dùng chung một khoá có vùng găng khá dài. Đầu tiên khoá quay như <code>enter_region</code>, sau đó nhường như <code>mutex_lock</code>:</p>
<pre><code class="language-c">// Ý của Hình 2-29: 8 luồng trên MỘT CPU — luồng đang chờ nên nhường CPU (thread_yield), đừng quay vòng
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;sched.h&gt;
#include &lt;time.h&gt;

int lock = 0;
long counter = 0;
int polite;                                         // 0 = quay, 1 = nhường

static void mutex_lock(void) {
    while (__atomic_test_and_set(&amp;lock, __ATOMIC_ACQUIRE)) {   // TSL REGISTER,MUTEX
        if (polite) sched_yield();                  // CALL thread_yield: cho người giữ khoá chạy
    }                                               // (polite == 0: thử lại ngay — khoá quay)
}
static void mutex_unlock(void) { __atomic_clear(&amp;lock, __ATOMIC_RELEASE); }

void *work(void *arg) {
    for (int i = 0; i &lt; 10000; i++) {
        mutex_lock();
        counter++;
        for (volatile int k = 0; k &lt; 2000; k++) ;   // một vùng găng dài hơn
        mutex_unlock();
    }
    return NULL;
}

static double run(void) {
    struct timespec s, e;
    counter = 0;
    clock_gettime(CLOCK_MONOTONIC, &amp;s);
    pthread_t t[8];
    for (int i = 0; i &lt; 8; i++) pthread_create(&amp;t[i], NULL, work, NULL);
    for (int i = 0; i &lt; 8; i++) pthread_join(t[i], NULL);
    clock_gettime(CLOCK_MONOTONIC, &amp;e);
    return (e.tv_sec - s.tv_sec) * 1e3 + (e.tv_nsec - s.tv_nsec) / 1e6;
}

int main(void) {
    polite = 0; double a = run();
    printf("spin  : counter = %ld, time %.0f ms\\n", counter, a);
    polite = 1; double b = run();
    printf("yield : counter = %ld, time %.0f ms\\n", counter, b);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread quay-hay-nhuong.c -o quay-hay-nhuong &amp;&amp; taskset -c 0 ./quay-hay-nhuong<br>
spin &nbsp;: counter = 80000, time 647 ms<br>
yield : counter = 80000, time 134 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Cùng kết quả đếm đúng, nhưng bản quay chậm hơn vài lần: mỗi khi người giữ khoá bị chiếm CPU ngay trong vùng găng, các luồng khác đốt trọn lát thời gian của chúng để quay trên một cái khoá không thể được nhả cho tới khi người giữ chạy lại. Nhường thì trả CPU về ngay. (Trên máy nhiều lõi với vùng găng rất ngắn, quay có thể thắng — người giữ đang chạy trên lõi khác và nhả trong vài nano-giây. Khoá thật quay một chút rồi mới ngủ.)</p>
<p class="meo">🧠 Quay = đứng trước cửa đã khoá và giật tay nắm liên tục. Nhường = gõ một lần, về ghế ngồi, lát quay lại. Ngủ (futex, slide sau) = để lại số điện thoại để người bên trong gọi khi họ ra.</p>`],
      [40, 'Mutexes in Pthreads (1)',
        `<p class="y-chinh">🎯 Figure 2-30: the Pthreads mutex calls — <code>pthread_mutex_init</code> (create a mutex), <code>pthread_mutex_destroy</code> (destroy an existing mutex), <code>pthread_mutex_lock</code> (acquire a lock or block), <code>pthread_mutex_trylock</code> (acquire a lock or fail), <code>pthread_mutex_unlock</code> (release a lock).</p>
<p>The pattern is always: lock, critical region, unlock — and the same thread that locked must unlock (a mutex has an <strong>owner</strong>, a semaphore does not). <code>trylock</code> never blocks: it returns 0 if it got the lock or <code>EBUSY</code> if not, so the thread can do something else instead of waiting — useful to avoid deadlocks (Chapter 6). A static mutex can be initialized with <code>PTHREAD_MUTEX_INITIALIZER</code> instead of calling <code>pthread_mutex_init</code>.</p>
<p>➕ How does Linux implement <code>pthread_mutex_lock</code>? With a <strong>futex</strong> ("fast userspace mutex", Linux 2.6): the lock is a word in user memory; an uncontended lock/unlock is a single atomic instruction in user space (slide 34) — no system call at all. Only when a thread must wait does it call <code>futex(FUTEX_WAIT)</code> to sleep in the kernel, and the unlocker calls <code>futex(FUTEX_WAKE)</code>. Count the system calls:</p>
<div class="out"># A pthread mutex asks the kernel for help (the futex system call) ONLY when a thread really has to wait<br>
# _dem.c: N threads, each locks and unlocks ONE mutex 100000 times<br>
$ gcc -O2 -pthread _dem.c -o dem<br>
# strace -c counts the system calls; we keep only the futex line<br>
$ strace -f -c -e trace=futex ./dem 1 2&gt;&amp;1 | grep -E 'thread|futex'<br>
1 thread(s): counter = 100000<br>
100.00 &nbsp;&nbsp;&nbsp;0.001234 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;617 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;futex<br>
$ strace -f -c -e trace=futex ./dem 4 2&gt;&amp;1 | grep -E 'thread|futex'<br>
4 thread(s): counter = 400000<br>
100.00 &nbsp;&nbsp;&nbsp;0.021505 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;90 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;238 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;86 futex</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>One thread locked and unlocked 100 000 times: only 2 futex calls in total (they belong to thread creation and <code>join</code>, not to the mutex). Four threads competing: a few dozen calls for 400 000 lock operations — the kernel is involved only in the rare moments of real contention. That is the hybrid the book describes for user-level threads (slide 39), done in the kernel's favour: spin briefly in user space, sleep in the kernel only when necessary.</p>
<p class="pitfall">⚠️ Mutex vs binary semaphore (FE-style): both give mutual exclusion; a mutex is owned — only the locking thread may unlock — while any thread may <code>up</code> a semaphore, which is why semaphores can also <strong>signal</strong> between threads (producer → consumer).</p>`,
        `<p class="y-chinh">🎯 Hình 2-30: các lời gọi mutex của Pthreads — <code>pthread_mutex_init</code> (tạo mutex), <code>pthread_mutex_destroy</code> (huỷ một mutex đã có), <code>pthread_mutex_lock</code> (lấy khoá hoặc bị chặn), <code>pthread_mutex_trylock</code> (lấy khoá hoặc thất bại), <code>pthread_mutex_unlock</code> (nhả khoá).</p>
<p>Mẫu luôn là: khoá, vùng găng, mở khoá — và luồng nào khoá thì chính luồng đó phải mở (mutex có <strong>chủ sở hữu</strong>, semaphore thì không). <code>trylock</code> không bao giờ bị chặn: nó trả 0 nếu lấy được khoá, hoặc <code>EBUSY</code> nếu không, để luồng làm việc khác thay vì chờ — hữu ích để tránh bế tắc (Chương 6). Một mutex tĩnh có thể khởi tạo bằng <code>PTHREAD_MUTEX_INITIALIZER</code> thay vì gọi <code>pthread_mutex_init</code>.</p>
<p>➕ Linux cài <code>pthread_mutex_lock</code> thế nào? Bằng <strong>futex</strong> ("fast userspace mutex", Linux 2.6): khoá là một từ nhớ trong bộ nhớ người dùng; khoá/mở khi không ai tranh chỉ là một lệnh nguyên tử trong không gian người dùng (slide 34) — không có lời gọi hệ thống nào. Chỉ khi một luồng phải chờ nó mới gọi <code>futex(FUTEX_WAIT)</code> để ngủ trong nhân, và bên mở khoá gọi <code>futex(FUTEX_WAKE)</code>. Đếm số lời gọi hệ thống:</p>
<div class="out"># Mutex của pthread chỉ nhờ nhân (lời gọi hệ thống futex) KHI một luồng thật sự phải chờ<br>
# _dem.c: N luồng, mỗi luồng khoá rồi mở MỘT mutex 100000 lần<br>
$ gcc -O2 -pthread _dem.c -o dem<br>
# strace -c đếm các lời gọi hệ thống; ta chỉ giữ dòng futex<br>
$ strace -f -c -e trace=futex ./dem 1 2&gt;&amp;1 | grep -E 'thread|futex'<br>
1 thread(s): counter = 100000<br>
100.00 &nbsp;&nbsp;&nbsp;0.001234 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;617 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;futex<br>
$ strace -f -c -e trace=futex ./dem 4 2&gt;&amp;1 | grep -E 'thread|futex'<br>
4 thread(s): counter = 400000<br>
100.00 &nbsp;&nbsp;&nbsp;0.021505 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;90 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;238 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;86 futex</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Một luồng khoá và mở 100 000 lần: tổng cộng chỉ 2 lời gọi futex (chúng thuộc về việc tạo luồng và <code>join</code>, không thuộc về mutex). Bốn luồng tranh nhau: vài chục lời gọi cho 400 000 lần khoá — nhân chỉ dính vào ở những khoảnh khắc hiếm hoi có tranh chấp thật. Đó chính là kiểu lai mà sách tả cho luồng mức người dùng (slide 39), làm theo hướng có lợi cho nhân: quay ngắn ở không gian người dùng, chỉ ngủ trong nhân khi thật cần.</p>
<p class="pitfall">⚠️ Mutex so với semaphore nhị phân (dạng câu FE): cả hai cho loại trừ tương hỗ; mutex có chủ — chỉ luồng đã khoá được mở — còn luồng nào cũng <code>up</code> được semaphore, nên semaphore còn dùng để <strong>báo hiệu</strong> giữa các luồng (sản xuất → tiêu thụ).</p>`],
      [41, 'Mutexes in Pthreads (2)',
        `<p class="y-chinh">🎯 Figure 2-31: the Pthreads <strong>condition variable</strong> calls — <code>pthread_cond_init</code> (create), <code>pthread_cond_destroy</code> (destroy), <code>pthread_cond_wait</code> (block waiting for a signal), <code>pthread_cond_signal</code> (signal another thread and wake it up), <code>pthread_cond_broadcast</code> (signal multiple threads and wake all of them).</p>
<p>A mutex answers "may I enter?"; a <strong>condition variable</strong> answers "should I wait until something becomes true?" — for example "the buffer is no longer empty". They always work as a pair: <code>pthread_cond_wait(&amp;cond, &amp;mutex)</code> must be called with the mutex held; it <strong>atomically releases the mutex and blocks</strong> the thread, and when the thread is woken, it re-acquires the mutex before returning. That atomic "unlock and sleep" is precisely what sleep/wakeup lacked (slide 36): no wakeup can slip in between the test and the sleep, because the test is done under the mutex.</p>
<p>➕ Two rules from the manual page (man7 <code>pthread_cond_wait</code>) that every interview checks: (1) <strong>always wait in a <code>while</code> loop</strong>, re-testing the condition — a thread may wake up although the condition is false again (another thread got there first) or even without any signal (a <em>spurious wakeup</em>, which POSIX allows); (2) unlike semaphores, condition variables have <strong>no memory</strong>: a <code>signal</code> sent when nobody waits is simply lost — which is harmless here only because the waiter tests the shared state before waiting. <code>broadcast</code> wakes everyone and each re-tests; use it when several waiters might be able to proceed.</p>
<p class="meo">🧠 Mutex = the key of the room. Condition variable = the waiting room with a bell: you give back the key, sit down, and when the bell rings you take the key again and look whether it is really your turn.</p>`,
        `<p class="y-chinh">🎯 Hình 2-31: các lời gọi <strong>biến điều kiện (condition variable)</strong> của Pthreads — <code>pthread_cond_init</code> (tạo), <code>pthread_cond_destroy</code> (huỷ), <code>pthread_cond_wait</code> (bị chặn chờ tín hiệu), <code>pthread_cond_signal</code> (báo tín hiệu cho một luồng khác và đánh thức nó), <code>pthread_cond_broadcast</code> (báo cho nhiều luồng và đánh thức tất cả).</p>
<p>Mutex trả lời "tôi có được vào không?"; <strong>biến điều kiện</strong> trả lời "tôi có nên chờ tới khi điều gì đó thành đúng không?" — ví dụ "bộ đệm không còn rỗng". Chúng luôn đi thành cặp: <code>pthread_cond_wait(&amp;cond, &amp;mutex)</code> phải được gọi khi đang giữ mutex; nó <strong>nhả mutex và chặn luồng một cách nguyên tử</strong>, và khi luồng được đánh thức, nó lấy lại mutex trước khi trả về. Chính việc "mở khoá rồi ngủ" nguyên tử đó là thứ sleep/wakeup thiếu (slide 36): không tín hiệu đánh thức nào lọt được vào giữa lúc kiểm tra và lúc ngủ, vì việc kiểm tra làm dưới mutex.</p>
<p>➕ Hai quy tắc từ trang hướng dẫn (man7 <code>pthread_cond_wait</code>) mà buổi phỏng vấn nào cũng kiểm: (1) <strong>luôn chờ trong một vòng <code>while</code></strong>, kiểm lại điều kiện — luồng có thể thức dậy dù điều kiện lại đã sai (luồng khác tới trước) hoặc thậm chí chẳng có tín hiệu nào (<em>đánh thức giả — spurious wakeup</em>, POSIX cho phép); (2) khác semaphore, biến điều kiện <strong>không có trí nhớ</strong>: một lần <code>signal</code> khi không ai chờ là mất luôn — điều đó vô hại ở đây chỉ vì bên chờ kiểm trạng thái dùng chung trước khi chờ. <code>broadcast</code> đánh thức tất cả và mỗi luồng tự kiểm lại; dùng nó khi nhiều bên chờ có thể cùng đi tiếp được.</p>
<p class="meo">🧠 Mutex = chìa khoá căn phòng. Biến điều kiện = phòng chờ có chuông: bạn trả chìa khoá, ngồi xuống, khi chuông reo thì lấy lại chìa và xem có thật tới lượt mình không.</p>`],
      [42, 'Mutexes in Pthreads (3)',
        `<p class="y-chinh">🎯 Figure 2-32 (part 1): producer–consumer with Pthreads and a <strong>one-item buffer</strong>. Globals: <code>#define MAX 1000000000</code>, <code>pthread_mutex_t the_mutex; pthread_cond_t condc, condp; int buffer = 0;</code>. The producer: for i = 1 … MAX: lock; <code>while (buffer != 0) pthread_cond_wait(&amp;condp, &amp;the_mutex);</code> buffer = i; signal <code>condc</code>; unlock.</p>
<p>The buffer holds one number; 0 means empty. The producer locks the mutex, and while the buffer is full it waits on <code>condp</code> ("producer may proceed"); when it may, it puts <code>i</code> into the buffer, signals <code>condc</code> ("consumer may proceed") and unlocks. Note that the book does use <code>while</code> around the wait — correct, as slide 41 required. Each condition variable stands for one reason to wait: <code>condp</code> = "buffer became empty", <code>condc</code> = "buffer became full".</p>
<p>➕ The producer's part, as compiled and run in the program of slide 44:</p>
<pre class="trich"><code class="language-c">void *producer(void *ptr)                               /* produce data */
{   int i;
    for (i = 1; i &lt;= MAX; i++) {
        pthread_mutex_lock(&amp;the_mutex);                 /* get exclusive access to buffer */
        while (buffer != 0) pthread_cond_wait(&amp;condp, &amp;the_mutex);
        buffer = i;                                     /* put item in buffer */
        pthread_cond_signal(&amp;condc);                    /* wake up consumer */
        pthread_mutex_unlock(&amp;the_mutex);               /* release access to buffer */
    }
    pthread_exit(0);
}</code></pre>
<p>MAX = 1 000 000 000 in the book would print a billion lines; the course version uses MAX = 10 and adds one <code>printf</code> in the consumer. Everything else is the book's code, character for character (including <code>pthread_exit(0)</code> and passing <code>0</code> for NULL attributes).</p>
<p class="pitfall">⚠️ The mutex protects the shared variable <code>buffer</code>; the condition variables are only for waiting. Testing <code>buffer</code> without holding the mutex would bring back the race of slide 36.</p>`,
        `<p class="y-chinh">🎯 Hình 2-32 (phần 1): sản xuất–tiêu thụ bằng Pthreads với <strong>bộ đệm một món</strong>. Biến toàn cục: <code>#define MAX 1000000000</code>, <code>pthread_mutex_t the_mutex; pthread_cond_t condc, condp; int buffer = 0;</code>. Bên sản xuất: với i = 1 … MAX: khoá; <code>while (buffer != 0) pthread_cond_wait(&amp;condp, &amp;the_mutex);</code> buffer = i; báo <code>condc</code>; mở khoá.</p>
<p>Bộ đệm giữ một số; 0 nghĩa là rỗng. Bên sản xuất khoá mutex, và chừng nào bộ đệm còn đầy thì chờ trên <code>condp</code> ("bên sản xuất được đi tiếp"); khi được, nó đặt <code>i</code> vào bộ đệm, báo <code>condc</code> ("bên tiêu thụ được đi tiếp") rồi mở khoá. Để ý sách CÓ dùng <code>while</code> quanh lệnh chờ — đúng như slide 41 đòi hỏi. Mỗi biến điều kiện đại diện cho một lý do để chờ: <code>condp</code> = "bộ đệm vừa rỗng", <code>condc</code> = "bộ đệm vừa đầy".</p>
<p>➕ Phần của bên sản xuất, như đã biên dịch và chạy trong chương trình ở slide 44:</p>
<pre class="trich"><code class="language-c">void *producer(void *ptr)                               /* produce data */
{   int i;
    for (i = 1; i &lt;= MAX; i++) {
        pthread_mutex_lock(&amp;the_mutex);                 /* get exclusive access to buffer */
        while (buffer != 0) pthread_cond_wait(&amp;condp, &amp;the_mutex);
        buffer = i;                                     /* put item in buffer */
        pthread_cond_signal(&amp;condc);                    /* wake up consumer */
        pthread_mutex_unlock(&amp;the_mutex);               /* release access to buffer */
    }
    pthread_exit(0);
}</code></pre>
<p>MAX = 1 000 000 000 như sách sẽ in một tỉ dòng; bản của môn dùng MAX = 10 và thêm một lệnh <code>printf</code> ở bên tiêu thụ. Mọi thứ khác là mã của sách, đúng từng ký tự (kể cả <code>pthread_exit(0)</code> và truyền <code>0</code> thay cho thuộc tính NULL).</p>
<p class="pitfall">⚠️ Mutex bảo vệ biến dùng chung <code>buffer</code>; biến điều kiện chỉ để chờ. Kiểm <code>buffer</code> mà không giữ mutex là đưa tranh chấp của slide 36 quay lại.</p>`],
      [43, 'Mutexes in Pthreads (4)',
        `<p class="y-chinh">🎯 Figure 2-32 (part 2): the consumer — for i = 1 … MAX: lock; <code>while (buffer == 0) pthread_cond_wait(&amp;condc, &amp;the_mutex);</code> buffer = 0 (take the item); signal <code>condp</code>; unlock.</p>
<p>The consumer is the mirror image: wait while the buffer is empty, take the item, wake the producer. Follow one round: the producer puts 1, signals <code>condc</code>, unlocks; the consumer wakes, re-acquires the mutex inside <code>pthread_cond_wait</code>, sees <code>buffer</code> = 1, takes it, signals <code>condp</code>, unlocks; the producer, which was waiting on <code>condp</code> for the buffer to empty, wakes and puts 2. The two threads alternate strictly because the buffer has only one slot — with N slots (slide 37) the producer could run ahead.</p>
<p>The consumer as compiled (the only line added to the book's code prints the number):</p>
<pre class="trich"><code class="language-c">void *consumer(void *ptr)                               /* consume data */
{   int i;
    for (i = 1; i &lt;= MAX; i++) {
        pthread_mutex_lock(&amp;the_mutex);                 /* get exclusive access to buffer */
        while (buffer == 0) pthread_cond_wait(&amp;condc, &amp;the_mutex);
        printf("consumer got %d\\n", buffer);            // added for this lesson
        buffer = 0;                                     /* take item out of buffer */
        pthread_cond_signal(&amp;condp);                    /* wake up producer */
        pthread_mutex_unlock(&amp;the_mutex);               /* release access to buffer */
    }
    pthread_exit(0);
}</code></pre>
<p>➕ What if the consumer used <code>if</code> instead of <code>while</code>? With exactly one producer and one consumer it would still work; with two consumers, both could be woken by one item, the first takes it, and the second continues with <code>buffer == 0</code> and "consumes" an empty buffer. The <code>while</code> loop costs nothing and protects against it. Java's <code>Object.wait()</code> documentation says the same (slide 48).</p>
<p class="meo">🧠 The pattern to memorize: <code>lock; while (!condition) wait(cond, mutex); … change state …; signal(other_cond); unlock;</code> — the body of almost every hand-written monitor.</p>`,
        `<p class="y-chinh">🎯 Hình 2-32 (phần 2): bên tiêu thụ — với i = 1 … MAX: khoá; <code>while (buffer == 0) pthread_cond_wait(&amp;condc, &amp;the_mutex);</code> buffer = 0 (lấy món); báo <code>condp</code>; mở khoá.</p>
<p>Bên tiêu thụ là ảnh gương: chờ khi bộ đệm rỗng, lấy món, đánh thức bên sản xuất. Theo dõi một vòng: bên sản xuất đặt 1, báo <code>condc</code>, mở khoá; bên tiêu thụ thức dậy, lấy lại mutex bên trong <code>pthread_cond_wait</code>, thấy <code>buffer</code> = 1, lấy nó, báo <code>condp</code>, mở khoá; bên sản xuất, đang chờ trên <code>condp</code> cho bộ đệm rỗng, thức dậy và đặt 2. Hai luồng thay phiên nghiêm ngặt vì bộ đệm chỉ có một ô — với N ô (slide 37) bên sản xuất có thể chạy trước.</p>
<p>Bên tiêu thụ như đã biên dịch (dòng duy nhất thêm vào mã của sách là dòng in con số):</p>
<pre class="trich"><code class="language-c">void *consumer(void *ptr)                               /* consume data */
{   int i;
    for (i = 1; i &lt;= MAX; i++) {
        pthread_mutex_lock(&amp;the_mutex);                 /* get exclusive access to buffer */
        while (buffer == 0) pthread_cond_wait(&amp;condc, &amp;the_mutex);
        printf("consumer got %d\\n", buffer);            // thêm cho bài học
        buffer = 0;                                     /* take item out of buffer */
        pthread_cond_signal(&amp;condp);                    /* wake up producer */
        pthread_mutex_unlock(&amp;the_mutex);               /* release access to buffer */
    }
    pthread_exit(0);
}</code></pre>
<p>➕ Nếu bên tiêu thụ dùng <code>if</code> thay cho <code>while</code> thì sao? Với đúng một bên sản xuất và một bên tiêu thụ thì vẫn chạy; với hai bên tiêu thụ, cả hai có thể bị một món hàng đánh thức, người đầu lấy mất, người thứ hai đi tiếp với <code>buffer == 0</code> và "tiêu thụ" một bộ đệm rỗng. Vòng <code>while</code> không tốn gì mà chặn được chuyện đó. Tài liệu <code>Object.wait()</code> của Java nói y như vậy (slide 48).</p>
<p class="meo">🧠 Mẫu cần thuộc: <code>lock; while (!điều_kiện) wait(cond, mutex); … đổi trạng thái …; signal(cond_kia); unlock;</code> — thân của gần như mọi monitor viết tay.</p>`],
      [44, 'Mutexes in Pthreads (5)',
        `<p class="y-chinh">🎯 Figure 2-32 (part 3): <code>main</code> — <code>pthread_mutex_init</code>, two <code>pthread_cond_init</code>, create the consumer and the producer threads, <code>pthread_join</code> both, then destroy the two condition variables and the mutex.</p>
<p>Everything that is shared is initialized before any thread starts and destroyed after all threads have finished — the lifetime rule for every synchronization object. <code>main</code> waits for both threads with <code>pthread_join</code>, so the process does not end early (the bug of slide 22). Creating the consumer first is deliberate in the book: it starts, finds the buffer empty and blocks on <code>condc</code>, waiting for the producer.</p>
<p>➕ The <code>main</code> of the course version, and the output of the whole program:</p>
<pre class="trich"><code class="language-c">int main(int argc, char **argv)
{
    pthread_t pro, con;
    pthread_mutex_init(&amp;the_mutex, 0);
    pthread_cond_init(&amp;condc, 0);
    pthread_cond_init(&amp;condp, 0);
    pthread_create(&amp;con, 0, consumer, 0);
    pthread_create(&amp;pro, 0, producer, 0);
    pthread_join(pro, 0);
    pthread_join(con, 0);
    pthread_cond_destroy(&amp;condc);
    pthread_cond_destroy(&amp;condp);
    pthread_mutex_destroy(&amp;the_mutex);
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread sx-tt-condvar.c -o sx-tt-condvar &amp;&amp; ./sx-tt-condvar<br>
consumer got 1<br>
consumer got 2<br>
consumer got 3<br>
consumer got 4<br>
consumer got 5<br>
consumer got 6<br>
consumer got 7<br>
consumer got 8<br>
consumer got 9<br>
consumer got 10</div>
<p>Ten numbers, in order, each handed over exactly once — and deterministic: whatever the scheduler does, the condition variables force the strict alternation of slide 43. Compare with the semaphore version (slide 38): same problem, different tools; the condition-variable version needs the mutex for every check, the semaphore version counts the slots itself.</p>
<div class="callout">🧭 <strong>On a real server:</strong> you rarely write <code>pthread_cond_wait</code> by hand. Java's <code>ReentrantLock</code> + <code>Condition</code> (<code>await</code>/<code>signal</code>) are exactly these calls, and <code>ArrayBlockingQueue</code> is a bounded buffer built from one lock and two conditions, <code>notEmpty</code> and <code>notFull</code> — Figure 2-32 inside the JDK.</div>`,
        `<p class="y-chinh">🎯 Hình 2-32 (phần 3): <code>main</code> — <code>pthread_mutex_init</code>, hai <code>pthread_cond_init</code>, tạo luồng tiêu thụ và luồng sản xuất, <code>pthread_join</code> cả hai, rồi huỷ hai biến điều kiện và mutex.</p>
<p>Mọi thứ dùng chung được khởi tạo trước khi luồng nào chạy và huỷ sau khi mọi luồng xong — quy tắc vòng đời cho mọi đối tượng đồng bộ. <code>main</code> đợi cả hai luồng bằng <code>pthread_join</code>, nên tiến trình không kết thúc sớm (lỗi của slide 22). Tạo luồng tiêu thụ trước là cố ý trong sách: nó chạy, thấy bộ đệm rỗng và bị chặn trên <code>condc</code>, chờ bên sản xuất.</p>
<p>➕ Hàm <code>main</code> của bản dùng cho môn, và output của cả chương trình:</p>
<pre class="trich"><code class="language-c">int main(int argc, char **argv)
{
    pthread_t pro, con;
    pthread_mutex_init(&amp;the_mutex, 0);
    pthread_cond_init(&amp;condc, 0);
    pthread_cond_init(&amp;condp, 0);
    pthread_create(&amp;con, 0, consumer, 0);
    pthread_create(&amp;pro, 0, producer, 0);
    pthread_join(pro, 0);
    pthread_join(con, 0);
    pthread_cond_destroy(&amp;condc);
    pthread_cond_destroy(&amp;condp);
    pthread_mutex_destroy(&amp;the_mutex);
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread sx-tt-condvar.c -o sx-tt-condvar &amp;&amp; ./sx-tt-condvar<br>
consumer got 1<br>
consumer got 2<br>
consumer got 3<br>
consumer got 4<br>
consumer got 5<br>
consumer got 6<br>
consumer got 7<br>
consumer got 8<br>
consumer got 9<br>
consumer got 10</div>
<p>Mười con số, đúng thứ tự, mỗi số được trao đúng một lần — và tất định: bộ lập lịch làm gì thì làm, các biến điều kiện vẫn ép đúng kiểu thay phiên nghiêm ngặt của slide 43. So với bản semaphore (slide 38): cùng bài toán, khác công cụ; bản biến điều kiện cần mutex cho mỗi lần kiểm, bản semaphore tự đếm số ô.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> bạn hiếm khi tự viết <code>pthread_cond_wait</code>. <code>ReentrantLock</code> + <code>Condition</code> của Java (<code>await</code>/<code>signal</code>) chính là các lời gọi này, và <code>ArrayBlockingQueue</code> là một bộ đệm có giới hạn dựng từ một khoá và hai điều kiện, <code>notEmpty</code> và <code>notFull</code> — Hình 2-32 nằm bên trong JDK.</div>`],
      [45, 'Monitors (1)',
        `<p class="y-chinh">🎯 Figure 2-33: a <strong>monitor</strong> — a module (in a programming language) grouping procedures, variables and data structures: <code>monitor example; integer i; condition c; procedure producer(); … end; procedure consumer(); … end; end monitor;</code>. Only one process can be active inside a monitor at any instant.</p>
<p>Semaphores are powerful but fragile: one swapped <code>down</code> (slide 38) and the program deadlocks; one forgotten <code>up</code> and it hangs. Hoare (1974) and Brinch Hansen (1973) proposed moving the synchronization into the <strong>language</strong>. Processes may call a monitor's procedures but cannot touch its internal data directly; the <strong>compiler</strong> inserts the mutual exclusion — when a process calls a monitor procedure while another is active inside, the caller is blocked. The programmer only has to put all critical regions into monitor procedures and will never forget a lock.</p>
<p>➕ Mutual exclusion is not enough: a process inside the monitor may need to wait (buffer full). For that, monitors have <strong>condition variables</strong> with <code>wait</code> and <code>signal</code> — the ancestors of slide 41's Pthreads calls. <code>wait(c)</code> blocks the caller <em>and lets another process enter the monitor</em>. The languages that had monitors were Concurrent Pascal, Mesa, Modula; today the best-known monitor is every Java object: a <code>synchronized</code> method is a monitor procedure, and <code>wait</code>/<code>notify</code> are its single condition variable.</p>
<p class="meo">🧠 A monitor is a room with one door and a guard: only one person inside at a time (the compiler is the guard), and a waiting bench inside (condition variables) where people can sit and let the next person in.</p>`,
        `<p class="y-chinh">🎯 Hình 2-33: một <strong>monitor</strong> — một mô-đun (của ngôn ngữ lập trình) gom các thủ tục, biến và cấu trúc dữ liệu: <code>monitor example; integer i; condition c; procedure producer(); … end; procedure consumer(); … end; end monitor;</code>. Tại mỗi thời điểm chỉ một tiến trình được hoạt động bên trong monitor.</p>
<p>Semaphore mạnh nhưng mong manh: đảo một lệnh <code>down</code> (slide 38) là chương trình bế tắc; quên một lệnh <code>up</code> là treo. Hoare (1974) và Brinch Hansen (1973) đề xuất đưa việc đồng bộ vào <strong>ngôn ngữ</strong>. Tiến trình được gọi các thủ tục của monitor nhưng không chạm trực tiếp vào dữ liệu bên trong; <strong>trình biên dịch</strong> chèn sẵn loại trừ tương hỗ — khi một tiến trình gọi thủ tục của monitor trong lúc tiến trình khác đang hoạt động bên trong, bên gọi bị chặn. Lập trình viên chỉ cần đặt mọi vùng găng vào thủ tục của monitor và sẽ không bao giờ quên khoá.</p>
<p>➕ Loại trừ tương hỗ thôi chưa đủ: một tiến trình trong monitor có thể cần chờ (bộ đệm đầy). Vì thế monitor có <strong>biến điều kiện</strong> với <code>wait</code> và <code>signal</code> — tổ tiên của các lời gọi Pthreads ở slide 41. <code>wait(c)</code> chặn bên gọi <em>và cho tiến trình khác vào monitor</em>. Các ngôn ngữ có monitor là Concurrent Pascal, Mesa, Modula; ngày nay monitor nổi tiếng nhất là mọi đối tượng Java: phương thức <code>synchronized</code> là một thủ tục monitor, còn <code>wait</code>/<code>notify</code> là biến điều kiện duy nhất của nó.</p>
<p class="meo">🧠 Monitor là một căn phòng một cửa có người gác: mỗi lúc chỉ một người bên trong (trình biên dịch là người gác), và bên trong có ghế chờ (biến điều kiện), nơi người ta ngồi đợi và nhường cho người kế tiếp vào.</p>`],
      [46, 'Monitors (2)',
        `<p class="y-chinh">🎯 Figure 2-34 (part 1): <code>monitor ProducerConsumer</code> — <code>condition full, empty; integer count;</code> <code>procedure insert(item)</code>: <code>if count = N then wait(full); insert_item(item); count := count + 1; if count = 1 then signal(empty)</code>; <code>function remove</code>: <code>if count = 0 then wait(empty); remove = remove_item; count := count − 1; if count = N − 1 then signal(full)</code>; <code>count := 0</code>.</p>
<p>Compare with the broken sleep/wakeup version (slide 35): the code looks almost identical, yet it is correct. Why? Because <code>insert</code> and <code>remove</code> run under the monitor's mutual exclusion: the consumer's test <code>count = 0</code> and its <code>wait(empty)</code> cannot be interrupted by the producer, who cannot even enter the monitor until the consumer has finished waiting. The lost-wakeup window is gone. Note the condition variable names follow the book: <code>full</code> is waited on when the buffer is full.</p>
<p>➕ What happens on <code>signal</code>? Two processes would now be active inside the monitor — the signaller and the awakened one. Three answers exist: <strong>Hoare</strong>: the awakened process runs immediately, the signaller is suspended; <strong>Brinch Hansen</strong>: <code>signal</code> must be the last statement of a procedure, the signaller leaves at once; <strong>Mesa / Java / Pthreads</strong> ("signal and continue"): the signaller keeps running, the awakened process only becomes ready and must re-acquire the monitor later — by then the condition may be false again, which is why modern code re-tests in a <code>while</code> loop (slide 41). The book's <code>if</code> is correct only with Hoare or Brinch Hansen semantics.</p>
<p class="pitfall">⚠️ Monitors differ from sleep/wakeup in that <strong>wait/signal never lose a signal</strong> by racing: they are always executed inside the monitor. But a <code>signal</code> on a condition nobody waits on is still lost (unlike a semaphore's <code>up</code>).</p>`,
        `<p class="y-chinh">🎯 Hình 2-34 (phần 1): <code>monitor ProducerConsumer</code> — <code>condition full, empty; integer count;</code> <code>procedure insert(item)</code>: <code>if count = N then wait(full); insert_item(item); count := count + 1; if count = 1 then signal(empty)</code>; <code>function remove</code>: <code>if count = 0 then wait(empty); remove = remove_item; count := count − 1; if count = N − 1 then signal(full)</code>; <code>count := 0</code>.</p>
<p>So với bản sleep/wakeup bị lỗi (slide 35): mã trông gần như y hệt, vậy mà đúng. Vì sao? Vì <code>insert</code> và <code>remove</code> chạy dưới loại trừ tương hỗ của monitor: phép kiểm <code>count = 0</code> và lệnh <code>wait(empty)</code> của bên tiêu thụ không thể bị bên sản xuất chen vào, vì bên sản xuất còn không vào được monitor cho tới khi bên tiêu thụ đã chờ xong. Khe hở mất tín hiệu biến mất. Để ý tên biến điều kiện theo đúng sách: <code>full</code> là chỗ chờ khi bộ đệm đầy.</p>
<p>➕ Khi <code>signal</code> thì sao? Lúc đó sẽ có hai tiến trình hoạt động trong monitor — bên báo và bên vừa được đánh thức. Có ba câu trả lời: <strong>Hoare</strong>: bên được đánh thức chạy ngay, bên báo tạm dừng; <strong>Brinch Hansen</strong>: <code>signal</code> phải là câu lệnh cuối cùng của thủ tục, bên báo ra khỏi monitor ngay; <strong>Mesa / Java / Pthreads</strong> ("báo rồi chạy tiếp — signal and continue"): bên báo chạy tiếp, bên được đánh thức chỉ thành sẵn sàng và phải giành lại monitor sau — tới lúc đó điều kiện có thể đã sai lại, vì thế mã hiện đại kiểm lại trong vòng <code>while</code> (slide 41). Chữ <code>if</code> của sách chỉ đúng với ngữ nghĩa Hoare hoặc Brinch Hansen.</p>
<p class="pitfall">⚠️ Monitor khác sleep/wakeup ở chỗ <strong>wait/signal không bao giờ mất tín hiệu do tranh chấp</strong>: chúng luôn được thực thi bên trong monitor. Nhưng một lần <code>signal</code> trên điều kiện không ai chờ vẫn mất (khác với lệnh <code>up</code> của semaphore).</p>`],
      [47, 'Monitors (3)',
        `<p class="y-chinh">🎯 Figure 2-34 (part 2): the processes using the monitor — <code>procedure producer: while true do begin item = produce_item; ProducerConsumer.insert(item) end</code>; <code>procedure consumer: while true do begin item = ProducerConsumer.remove; consume_item(item) end</code>.</p>
<p>This is the payoff: the producer and the consumer contain <strong>no synchronization code at all</strong>. They call <code>insert</code> and <code>remove</code> like ordinary procedures; all locking and waiting is hidden inside the monitor, and the compiler guarantees it is right. Producing and consuming the item happen outside the monitor, in parallel. The book's verdict: monitors make parallel programming much less error-prone than semaphores — but they need language support (C has none), and like semaphores they assume shared memory, so they do not work between machines (slide 51).</p>
<p>➕ C has no monitors, so in C you build one by hand from a mutex and condition variables — exactly Figure 2-32 (slides 42–44): the mutex plays the monitor's lock, <code>condp</code> and <code>condc</code> play <code>full</code> and <code>empty</code>. Java has them built in (next three slides). Go took the other road: "do not communicate by sharing memory; share memory by communicating" — a channel is a bounded buffer with the monitor inside, close to message passing (old lesson 2.6 discusses it).</p>
<div class="callout">🧭 <strong>On a real server:</strong> a Spring <code>@Service</code> bean is shared by all request threads. Mutable fields in it are shared data with no monitor around them; the usual fix is not <code>synchronized</code> everywhere but to keep services stateless and put shared state in the database or in thread-safe classes (<code>ConcurrentHashMap</code>, <code>AtomicLong</code>).</div>`,
        `<p class="y-chinh">🎯 Hình 2-34 (phần 2): các tiến trình dùng monitor — <code>procedure producer: while true do begin item = produce_item; ProducerConsumer.insert(item) end</code>; <code>procedure consumer: while true do begin item = ProducerConsumer.remove; consume_item(item) end</code>.</p>
<p>Đây là thành quả: bên sản xuất và bên tiêu thụ <strong>không chứa dòng mã đồng bộ nào</strong>. Chúng gọi <code>insert</code> và <code>remove</code> như thủ tục bình thường; mọi việc khoá và chờ được giấu trong monitor, và trình biên dịch bảo đảm nó đúng. Việc tạo và dùng món hàng diễn ra ngoài monitor, song song. Phán quyết của sách: monitor làm lập trình song song ít lỗi hơn semaphore nhiều — nhưng cần ngôn ngữ hỗ trợ (C không có), và cũng như semaphore, nó giả định có bộ nhớ dùng chung, nên không dùng được giữa các máy (slide 51).</p>
<p>➕ C không có monitor, nên trong C bạn tự dựng một cái từ mutex và biến điều kiện — đúng Hình 2-32 (slide 42–44): mutex đóng vai khoá của monitor, <code>condp</code> và <code>condc</code> đóng vai <code>full</code> và <code>empty</code>. Java có sẵn monitor (ba slide sau). Go đi đường khác: "đừng giao tiếp bằng cách dùng chung bộ nhớ; hãy dùng chung bộ nhớ bằng cách giao tiếp" — channel là một bộ đệm có giới hạn với monitor nằm bên trong, gần với truyền thông điệp (bài cũ 2.6 có bàn).</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> một bean <code>@Service</code> của Spring được mọi luồng xử lý yêu cầu dùng chung. Trường có thể thay đổi trong nó là dữ liệu dùng chung không có monitor nào bao quanh; cách chữa thường gặp không phải rắc <code>synchronized</code> khắp nơi mà là giữ service không trạng thái (stateless) và đặt trạng thái dùng chung vào cơ sở dữ liệu hoặc lớp an toàn luồng (<code>ConcurrentHashMap</code>, <code>AtomicLong</code>).</div>`],
      [48, 'Monitors (4)',
        `<p class="y-chinh">🎯 Figure 2-35 (part 1): <strong>producer–consumer in Java</strong> — class <code>ProducerConsumer</code> with <code>static final int N = 100</code>, a <code>producer p</code> thread, a <code>consumer c</code> thread and one monitor object <code>our_monitor mon</code>; <code>main</code> starts both threads; the producer's <code>run()</code> loops <code>item = produce_item(); mon.insert(item);</code>.</p>
<p>Java supports user-level threads in the language and has monitors built in: any method declared <code>synchronized</code> runs under the object's lock, so at most one thread at a time executes the synchronized methods of one object. The design of the figure is three classes: the producer and the consumer are <code>Thread</code> subclasses whose <code>run</code> method is the thread's code; <code>our_monitor</code> holds the buffer and the two synchronized methods <code>insert</code> and <code>remove</code>. <code>p.start()</code> creates the thread and calls <code>run</code> in it (calling <code>run()</code> directly would just run it in the current thread — a classic beginner mistake).</p>
<p>➕ The book's program, kept line for line except that each thread stops after 20 items instead of looping forever (so the run ends), compiled and run on Java 21:</p>
<pre><code class="language-java">// Figure 2-35 (slides 48–50) run on Java 21 — the book's monitor, with a finite loop of 20 items instead of while (true)
public class SanXuatTieuThu {
    static final int N = 100;                          // constant giving the buffer size
    static final int ITEMS = 20;
    static producer p = new producer();                // instantiate a new producer thread
    static consumer c = new consumer();                // instantiate a new consumer thread
    static our_monitor mon = new our_monitor();        // instantiate a new monitor

    public static void main(String[] args) throws InterruptedException {
        p.start();                                     // start the producer thread
        c.start();                                     // start the consumer thread
        p.join(); c.join();
        System.out.println("consumer total = " + c.total + " (expected " + ITEMS * (ITEMS + 1) / 2 + ")");
    }

    static class producer extends Thread {
        public void run() {                            // run method contains the thread code
            for (int item = 1; item &lt;= ITEMS; item++)  // producer loop
                mon.insert(item);
        }
    }

    static class consumer extends Thread {
        long total = 0;
        public void run() {
            for (int k = 1; k &lt;= ITEMS; k++) {         // consumer loop
                int item = mon.remove();
                total += item;                         // consume_item
            }
        }
    }

    static class our_monitor {                         // this is a monitor
        private int buffer[] = new int[N];
        private int count = 0, lo = 0, hi = 0;         // counters and indices

        public synchronized void insert(int val) {
            if (count == N) go_to_sleep();             // if the buffer is full, go to sleep
            buffer[hi] = val;                          // insert an item into the buffer
            hi = (hi + 1) % N;                         // slot to place next item in
            count = count + 1;                         // one more item in the buffer now
            if (count == 1) notify();                  // if consumer was sleeping, wake it up
        }

        public synchronized int remove() {
            int val;
            if (count == 0) go_to_sleep();             // if the buffer is empty, go to sleep
            val = buffer[lo];                          // fetch an item from the buffer
            lo = (lo + 1) % N;                         // slot to fetch next item from
            count = count - 1;                         // one few items in the buffer
            if (count == N - 1) notify();              // if producer was sleeping, wake it up
            return val;
        }

        private void go_to_sleep() { try { wait(); } catch (InterruptedException exc) {} }
    }
}</code></pre>
<div class="out">$ javac SanXuatTieuThu.java &amp;&amp; java SanXuatTieuThu<br>
consumer total = 210 (expected 210)</div>
<p>The consumer received all items 1…20 (sum 210). Slides 49–50 walk through the rest of the code shown above; the class names in lower case (<code>producer</code>, <code>our_monitor</code>) are the book's, not Java style.</p>
<p class="meo">🧠 In Java every object is a monitor: one lock + one wait set. <code>synchronized</code> = enter the monitor, <code>wait()</code> = sit on the bench, <code>notify()</code> = wake one sitter, <code>notifyAll()</code> = wake all.</p>`,
        `<p class="y-chinh">🎯 Hình 2-35 (phần 1): <strong>sản xuất–tiêu thụ bằng Java</strong> — lớp <code>ProducerConsumer</code> với <code>static final int N = 100</code>, một luồng <code>producer p</code>, một luồng <code>consumer c</code> và một đối tượng monitor <code>our_monitor mon</code>; <code>main</code> khởi động cả hai luồng; <code>run()</code> của bên sản xuất lặp <code>item = produce_item(); mon.insert(item);</code>.</p>
<p>Java hỗ trợ luồng ngay trong ngôn ngữ và có sẵn monitor: phương thức nào khai báo <code>synchronized</code> sẽ chạy dưới khoá của đối tượng, nên mỗi lúc nhiều nhất một luồng thực thi các phương thức synchronized của một đối tượng. Thiết kế của hình gồm ba lớp: bên sản xuất và bên tiêu thụ là lớp con của <code>Thread</code> với phương thức <code>run</code> là mã của luồng; <code>our_monitor</code> giữ bộ đệm và hai phương thức synchronized <code>insert</code> và <code>remove</code>. <code>p.start()</code> tạo luồng rồi gọi <code>run</code> trong luồng đó (gọi <code>run()</code> trực tiếp chỉ chạy nó trong luồng hiện tại — lỗi kinh điển của người mới học).</p>
<p>➕ Chương trình của sách, giữ nguyên từng dòng trừ việc mỗi luồng dừng sau 20 món thay vì lặp mãi (để lần chạy kết thúc), biên dịch và chạy trên Java 21:</p>
<pre><code class="language-java">// Hình 2-35 (slide 48–50) chạy trên Java 21 — monitor của sách, với vòng lặp 20 món thay cho while (true)
public class SanXuatTieuThu {
    static final int N = 100;                          // hằng số cho cỡ bộ đệm
    static final int ITEMS = 20;
    static producer p = new producer();                // tạo luồng sản xuất
    static consumer c = new consumer();                // tạo luồng tiêu thụ
    static our_monitor mon = new our_monitor();        // tạo monitor

    public static void main(String[] args) throws InterruptedException {
        p.start();                                     // chạy luồng sản xuất
        c.start();                                     // chạy luồng tiêu thụ
        p.join(); c.join();
        System.out.println("consumer total = " + c.total + " (expected " + ITEMS * (ITEMS + 1) / 2 + ")");
    }

    static class producer extends Thread {
        public void run() {                            // run chứa mã của luồng
            for (int item = 1; item &lt;= ITEMS; item++)  // vòng lặp sản xuất
                mon.insert(item);
        }
    }

    static class consumer extends Thread {
        long total = 0;
        public void run() {
            for (int k = 1; k &lt;= ITEMS; k++) {         // vòng lặp tiêu thụ
                int item = mon.remove();
                total += item;                         // dùng món hàng
            }
        }
    }

    static class our_monitor {                         // đây là một monitor
        private int buffer[] = new int[N];
        private int count = 0, lo = 0, hi = 0;         // bộ đếm và chỉ số

        public synchronized void insert(int val) {
            if (count == N) go_to_sleep();             // bộ đệm đầy thì ngủ
            buffer[hi] = val;                          // bỏ một món vào bộ đệm
            hi = (hi + 1) % N;                         // ô đặt món kế tiếp
            count = count + 1;                         // thêm một món
            if (count == 1) notify();                  // tiêu thụ đang ngủ thì đánh thức
        }

        public synchronized int remove() {
            int val;
            if (count == 0) go_to_sleep();             // bộ đệm rỗng thì ngủ
            val = buffer[lo];                          // lấy một món ra
            lo = (lo + 1) % N;                         // ô lấy món kế tiếp
            count = count - 1;                         // bớt một món
            if (count == N - 1) notify();              // sản xuất đang ngủ thì đánh thức
            return val;
        }

        private void go_to_sleep() { try { wait(); } catch (InterruptedException exc) {} }
    }
}</code></pre>
<div class="out">$ javac SanXuatTieuThu.java &amp;&amp; java SanXuatTieuThu<br>
consumer total = 210 (expected 210)</div>
<p>Bên tiêu thụ nhận đủ các món 1…20 (tổng 210). Slide 49–50 đi qua phần còn lại của mã ở trên; tên lớp viết thường (<code>producer</code>, <code>our_monitor</code>) là của sách, không theo phong cách Java.</p>
<p class="meo">🧠 Trong Java mọi đối tượng là một monitor: một khoá + một hàng chờ. <code>synchronized</code> = vào monitor, <code>wait()</code> = ngồi xuống ghế chờ, <code>notify()</code> = đánh thức một người đang ngồi, <code>notifyAll()</code> = đánh thức tất cả.</p>`],
      [49, 'Monitors (5)',
        `<p class="y-chinh">🎯 Figure 2-35 (part 2): the consumer thread — <code>run()</code> loops <code>item = mon.remove(); consume_item(item);</code> — and the start of the monitor class <code>our_monitor</code>: <code>private int buffer[] = new int[N]; private int count = 0, lo = 0, hi = 0;</code>.</p>
<p>The buffer is a <strong>circular array</strong>: <code>hi</code> is the slot where the next item will be inserted, <code>lo</code> the slot from which the next item will be removed, <code>count</code> the number of items in between; both indices wrap around with <code>% N</code>. The fields are <code>private</code>, so the only way to reach them from outside is through the synchronized methods — the "processes cannot access the monitor's data directly" rule of slide 45, enforced by Java's access control. The consumer, like the producer, contains no synchronization at all.</p>
<p>➕ Why is the buffer inside a separate object and not in the producer or consumer? Because the lock that <code>synchronized</code> takes is the lock of the object whose method is called — <code>mon</code>. If <code>insert</code> were a synchronized method of the producer and <code>remove</code> of the consumer, they would lock two different objects and protect nothing. Choosing the right object to lock on is the single most common Java concurrency bug in code reviews.</p>
<p class="pitfall">⚠️ <code>synchronized</code> on a static method locks the <em>class</em> object; on an instance method it locks <code>this</code>. Two threads calling a synchronized method on two different instances do not exclude each other.</p>`,
        `<p class="y-chinh">🎯 Hình 2-35 (phần 2): luồng tiêu thụ — <code>run()</code> lặp <code>item = mon.remove(); consume_item(item);</code> — và phần đầu lớp monitor <code>our_monitor</code>: <code>private int buffer[] = new int[N]; private int count = 0, lo = 0, hi = 0;</code>.</p>
<p>Bộ đệm là một <strong>mảng vòng (circular array)</strong>: <code>hi</code> là ô sẽ đặt món kế tiếp, <code>lo</code> là ô sẽ lấy món kế tiếp, <code>count</code> là số món nằm giữa; cả hai chỉ số quay vòng nhờ <code>% N</code>. Các trường là <code>private</code>, nên cách duy nhất để chạm vào chúng từ bên ngoài là qua các phương thức synchronized — luật "tiến trình không được truy cập trực tiếp dữ liệu của monitor" ở slide 45, được kiểm soát truy cập của Java thực thi. Bên tiêu thụ, cũng như bên sản xuất, không có dòng đồng bộ nào.</p>
<p>➕ Sao bộ đệm nằm trong một đối tượng riêng mà không nằm trong bên sản xuất hay tiêu thụ? Vì khoá mà <code>synchronized</code> lấy là khoá của đối tượng có phương thức được gọi — <code>mon</code>. Nếu <code>insert</code> là phương thức synchronized của bên sản xuất và <code>remove</code> của bên tiêu thụ, chúng khoá hai đối tượng khác nhau và chẳng bảo vệ được gì. Chọn đúng đối tượng để khoá là lỗi đồng thời Java hay gặp nhất khi review mã.</p>
<p class="pitfall">⚠️ <code>synchronized</code> trên phương thức static khoá đối tượng <em>lớp</em>; trên phương thức của đối tượng thì khoá <code>this</code>. Hai luồng gọi một phương thức synchronized trên hai thể hiện khác nhau thì không loại trừ nhau.</p>`],
      [50, 'Monitors (6)',
        `<p class="y-chinh">🎯 Figure 2-35 (part 3): <code>public synchronized void insert(int val)</code>: <code>if (count == N) go_to_sleep(); buffer[hi] = val; hi = (hi + 1) % N; count = count + 1; if (count == 1) notify();</code>; <code>public synchronized int remove()</code>: <code>if (count == 0) go_to_sleep(); val = buffer[lo]; lo = (lo + 1) % N; count = count − 1; if (count == N − 1) notify(); return val;</code>; <code>private void go_to_sleep() { try { wait(); } catch (InterruptedException exc) {}; }</code>.</p>
<p>It is the monitor of Figure 2-34 in Java: <code>wait()</code> releases the object's lock and blocks; <code>notify()</code> wakes one thread waiting on the object. Java monitors have only <strong>one</strong> condition variable per object, so the producer and the consumer wait in the same place — the conditions "not full" and "not empty" share one queue.</p>
<p>➕ <strong>Outdated detail: <code>if</code> must be <code>while</code>.</strong> Java's documentation of <code>Object.wait()</code> says a thread can wake up without being notified (a <em>spurious wakeup</em>) and that wait "should always be used in loops" re-testing the condition. Java uses Mesa semantics (slide 46): after <code>notify</code>, another thread may get the lock first. With one producer and one consumer the book's <code>if</code> happens to work (our run above did); with several producers or consumers it can insert into a full buffer or read an empty one. The safe form is <code>while (count == N) wait();</code> plus <code>notifyAll()</code>. And in real code you do not write this class at all — the JDK has it:</p>
<pre><code class="language-java">// What a Java 21 backend writes instead of Figure 2-35: a BlockingQueue — the monitor is already inside
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class HangDoiChan {
    public static void main(String[] args) throws Exception {
        BlockingQueue&lt;Integer&gt; q = new ArrayBlockingQueue&lt;&gt;(4);       // bounded buffer, N = 4
        int consumers = 2, items = 20;
        long[] total = new long[consumers];
        Thread producer = Thread.ofPlatform().start(() -&gt; {
            try {
                for (int i = 1; i &lt;= items; i++) q.put(i);           // blocks while full
                for (int k = 0; k &lt; consumers; k++) q.put(-1);       // one "stop" message per consumer
            } catch (InterruptedException e) { }
        });
        Thread[] cs = new Thread[consumers];
        for (int k = 0; k &lt; consumers; k++) {
            int me = k;
            cs[k] = Thread.ofPlatform().start(() -&gt; {
                try {
                    for (int v; (v = q.take()) != -1; ) total[me] += v;   // blocks while empty
                } catch (InterruptedException e) { }
            });
        }
        producer.join();
        for (Thread c : cs) c.join();
        System.out.println("two consumers, total = " + (total[0] + total[1]) + " (expected " + items * (items + 1) / 2 + ")");
    }
}</code></pre>
<div class="out">$ javac HangDoiChan.java &amp;&amp; java HangDoiChan<br>
two consumers, total = 210 (expected 210)</div>
<p><code>ArrayBlockingQueue</code> with two consumers and one producer: <code>put</code> blocks while full, <code>take</code> while empty; a special "stop" value (a <strong>poison pill</strong>) ends each consumer. Correct total, no hand-written wait/notify.</p>
<p class="pitfall">⚠️ A typical Java interview question: "why must <code>wait()</code> be called inside a loop?" — spurious wakeups and "signal and continue" semantics: the condition may be false again when the thread gets the lock back.</p>`,
        `<p class="y-chinh">🎯 Hình 2-35 (phần 3): <code>public synchronized void insert(int val)</code>: <code>if (count == N) go_to_sleep(); buffer[hi] = val; hi = (hi + 1) % N; count = count + 1; if (count == 1) notify();</code>; <code>public synchronized int remove()</code>: <code>if (count == 0) go_to_sleep(); val = buffer[lo]; lo = (lo + 1) % N; count = count − 1; if (count == N − 1) notify(); return val;</code>; <code>private void go_to_sleep() { try { wait(); } catch (InterruptedException exc) {}; }</code>.</p>
<p>Đây là monitor của Hình 2-34 viết bằng Java: <code>wait()</code> nhả khoá của đối tượng và bị chặn; <code>notify()</code> đánh thức một luồng đang chờ trên đối tượng đó. Monitor của Java chỉ có <strong>một</strong> biến điều kiện mỗi đối tượng, nên bên sản xuất và bên tiêu thụ chờ ở cùng một chỗ — hai điều kiện "chưa đầy" và "chưa rỗng" dùng chung một hàng chờ.</p>
<p>➕ <strong>Chi tiết lỗi thời: <code>if</code> phải là <code>while</code>.</strong> Tài liệu <code>Object.wait()</code> của Java nói một luồng có thể thức dậy mà không được notify (<em>đánh thức giả — spurious wakeup</em>) và wait "luôn phải được dùng trong vòng lặp" kiểm lại điều kiện. Java dùng ngữ nghĩa Mesa (slide 46): sau <code>notify</code>, một luồng khác có thể giành khoá trước. Với một bên sản xuất và một bên tiêu thụ, chữ <code>if</code> của sách tình cờ vẫn đúng (lần chạy ở trên là vậy); với nhiều bên sản xuất hay tiêu thụ, nó có thể chèn vào bộ đệm đầy hoặc đọc bộ đệm rỗng. Dạng an toàn là <code>while (count == N) wait();</code> cùng <code>notifyAll()</code>. Và trong mã thật bạn không viết lớp này — JDK có sẵn:</p>
<pre><code class="language-java">// Thứ một backend Java 21 viết thay cho Hình 2-35: BlockingQueue — monitor đã nằm sẵn bên trong
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class HangDoiChan {
    public static void main(String[] args) throws Exception {
        BlockingQueue&lt;Integer&gt; q = new ArrayBlockingQueue&lt;&gt;(4);       // bộ đệm có giới hạn, N = 4
        int consumers = 2, items = 20;
        long[] total = new long[consumers];
        Thread producer = Thread.ofPlatform().start(() -&gt; {
            try {
                for (int i = 1; i &lt;= items; i++) q.put(i);           // bị chặn khi đầy
                for (int k = 0; k &lt; consumers; k++) q.put(-1);       // mỗi luồng tiêu thụ một thông điệp "dừng"
            } catch (InterruptedException e) { }
        });
        Thread[] cs = new Thread[consumers];
        for (int k = 0; k &lt; consumers; k++) {
            int me = k;
            cs[k] = Thread.ofPlatform().start(() -&gt; {
                try {
                    for (int v; (v = q.take()) != -1; ) total[me] += v;   // bị chặn khi rỗng
                } catch (InterruptedException e) { }
            });
        }
        producer.join();
        for (Thread c : cs) c.join();
        System.out.println("two consumers, total = " + (total[0] + total[1]) + " (expected " + items * (items + 1) / 2 + ")");
    }
}</code></pre>
<div class="out">$ javac HangDoiChan.java &amp;&amp; java HangDoiChan<br>
two consumers, total = 210 (expected 210)</div>
<p><code>ArrayBlockingQueue</code> với hai bên tiêu thụ và một bên sản xuất: <code>put</code> bị chặn khi đầy, <code>take</code> bị chặn khi rỗng; một giá trị "dừng" đặc biệt (<strong>viên thuốc độc — poison pill</strong>) kết thúc từng bên tiêu thụ. Tổng đúng, không cần tự viết wait/notify.</p>
<p class="pitfall">⚠️ Câu phỏng vấn Java điển hình: "vì sao <code>wait()</code> phải gọi trong vòng lặp?" — đánh thức giả và ngữ nghĩa "báo rồi chạy tiếp": khi luồng giành lại được khoá, điều kiện có thể đã sai lại.</p>`],
      [51, 'The Producer-Consumer Problem with Message Passing (1)',
        `<p class="y-chinh">🎯 Figure 2-36 (producer): <code>#define N 100</code>; the producer loops: <code>item = produce_item(); receive(consumer, &amp;m); /* wait for an empty to arrive */ build_message(&amp;m, item); send(consumer, &amp;m);</code></p>
<p>Semaphores and monitors assume <strong>shared memory</strong>. Between machines on a network — or between processes that share nothing — we need <strong>message passing</strong>, two system calls: <code>send(destination, &amp;message)</code> and <code>receive(source, &amp;message)</code>; if no message is available, <code>receive</code> blocks (or returns an error). Message passing has its own design problems: messages can be lost (acknowledgements, sequence numbers), processes must be named, the sender must be authenticated, and copying messages is slower than using shared memory.</p>
<p>➕ The trick of Figure 2-36: the consumer first sends <strong>N empty messages</strong> to the producer. The producer may only send an item after receiving an empty message, and each item comes back as a new empty — so the number of messages in circulation is always N: the empties are the free slots of the bounded buffer, and no semaphore is needed. Messages sent but not yet received are buffered by the OS; alternatively the system may use no buffering at all, a <strong>rendezvous</strong>: <code>send</code> blocks until the matching <code>receive</code>. On the next slide it runs between two real processes.</p>
<p class="meo">🧠 Shared memory = two cooks at one table, they need rules (locks). Message passing = two cooks in two kitchens passing plates through a hatch; the hatch (kernel) holds at most N plates.</p>`,
        `<p class="y-chinh">🎯 Hình 2-36 (bên sản xuất): <code>#define N 100</code>; bên sản xuất lặp: <code>item = produce_item(); receive(consumer, &amp;m); /* chờ một thông điệp rỗng */ build_message(&amp;m, item); send(consumer, &amp;m);</code></p>
<p>Semaphore và monitor giả định có <strong>bộ nhớ dùng chung</strong>. Giữa các máy trên mạng — hay giữa các tiến trình chẳng dùng chung gì — ta cần <strong>truyền thông điệp (message passing)</strong>, hai lời gọi hệ thống: <code>send(đích, &amp;thông_điệp)</code> và <code>receive(nguồn, &amp;thông_điệp)</code>; nếu chưa có thông điệp, <code>receive</code> bị chặn (hoặc trả lỗi). Truyền thông điệp có những vấn đề thiết kế riêng: thông điệp có thể mất (xác nhận, số thứ tự), tiến trình phải được đặt tên, bên gửi phải được xác thực, và chép thông điệp chậm hơn dùng bộ nhớ chung.</p>
<p>➕ Mẹo của Hình 2-36: bên tiêu thụ gửi trước <strong>N thông điệp rỗng</strong> cho bên sản xuất. Bên sản xuất chỉ được gửi một món sau khi nhận một thông điệp rỗng, và mỗi món quay về thành một thông điệp rỗng mới — nên số thông điệp đang lưu hành luôn là N: các thông điệp rỗng chính là các ô trống của bộ đệm có giới hạn, và không cần semaphore nào. Thông điệp đã gửi mà chưa nhận do HĐH đệm giữ; hoặc hệ thống có thể không đệm gì cả, kiểu <strong>hẹn gặp (rendezvous)</strong>: <code>send</code> bị chặn tới khi có <code>receive</code> tương ứng. Ở slide sau nó chạy giữa hai tiến trình thật.</p>
<p class="meo">🧠 Bộ nhớ dùng chung = hai đầu bếp chung một bàn, cần luật (khoá). Truyền thông điệp = hai đầu bếp ở hai bếp chuyền đĩa qua ô cửa; ô cửa (nhân) chứa tối đa N đĩa.</p>`],
      [52, 'The Producer-Consumer Problem with Message Passing (2)',
        `<p class="y-chinh">🎯 Figure 2-36 (consumer): <code>for (i = 0; i &lt; N; i++) send(producer, &amp;m); /* send N empties */ while (TRUE) { receive(producer, &amp;m); item = extract_item(&amp;m); send(producer, &amp;m); /* send back empty reply */ consume_item(item); }</code></p>
<p>The consumer primes the pump with N empties, then for every item it receives it returns one empty. If the producer is faster, all messages end up full in the consumer's direction and the producer blocks waiting for an empty; if the consumer is faster, all messages are empty and it blocks waiting for an item. Either way nobody busy-waits and nothing is lost. The book adds that messages can be addressed to processes directly or to <strong>mailboxes</strong> — a place that buffers a certain number of messages; MPI, used on supercomputers, is a message-passing library.</p>
<p>➕ Two real processes created by <code>fork</code>, two pipes as the mailboxes (the kernel buffers the bytes), N = 4 empties, ten items:</p>
<pre><code class="language-c">// Figure 2-36 with two real processes: the kernel's pipes are the mailboxes, N empty messages travel back
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

#define N 4                                     /* number of slots in the buffer */
#define ITEMS 10
typedef struct { int item; } message;           /* message buffer */
int to_consumer[2], to_producer[2];             // two mailboxes

void send(int *box, message *m)    { write(box[1], m, sizeof *m); }
void receive(int *box, message *m) { if (read(box[0], m, sizeof *m) != sizeof *m) exit(1); }

void producer(void) {
    message m;
    for (int item = 1; item &lt;= ITEMS; item++) {    /* item = produce_item() */
        receive(to_producer, &amp;m);                  /* wait for an empty to arrive */
        m.item = item;                             /* construct a message to send */
        send(to_consumer, &amp;m);                     /* send item to consumer */
    }
}

void consumer(void) {
    message m;
    for (int i = 0; i &lt; N; i++) send(to_producer, &amp;m);   /* send N empties */
    for (int k = 1; k &lt;= ITEMS; k++) {
        receive(to_consumer, &amp;m);                  /* get message containing item */
        int item = m.item;                         /* extract item from message */
        send(to_producer, &amp;m);                     /* send back empty reply */
        printf("consumer got item %d\\n", item);      /* consume_item(item) */
    }
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    pipe(to_consumer);
    pipe(to_producer);
    if (fork() == 0) { producer(); exit(0); }     // process A: the producer
    if (fork() == 0) { consumer(); exit(0); }     // process B: the consumer
    while (wait(NULL) &gt; 0) ;
    printf("no shared memory, no semaphore: only send and receive\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread tin-nhan.c -o tin-nhan &amp;&amp; ./tin-nhan<br>
consumer got item 1<br>
consumer got item 2<br>
consumer got item 3<br>
consumer got item 4<br>
consumer got item 5<br>
consumer got item 6<br>
consumer got item 7<br>
consumer got item 8<br>
consumer got item 9<br>
consumer got item 10<br>
no shared memory, no semaphore: only send and receive</div>
<p>No shared variable, no semaphore — the pipes' blocking <code>read</code> is the synchronization. And message passing between <strong>threads</strong> in Node.js: worker threads share no JavaScript variables at all; they can only <code>postMessage</code>:</p>
<pre><code class="language-javascript">// Message passing in Node.js: worker_threads share NO variables, they only postMessage
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  let done = 0, total = 0;
  for (let k = 0; k &lt; 4; k++) {                                  // 4 workers, each sums a quarter of 1..4,000,000
    const w = new Worker(__filename, { workerData: { from: k * 1e6 + 1, to: (k + 1) * 1e6 } });
    w.on('message', (msg) =&gt; {                                   // receive(worker, &amp;m)
      total += msg.sum;
      if (++done === 4) console.log(&#96;sum 1..4000000 = &#36;{total} (from 4 messages)&#96;);
    });
  }
} else {
  let sum = 0;
  for (let i = workerData.from; i &lt;= workerData.to; i++) sum += i;
  parentPort.postMessage({ sum });                               // send(main, &amp;m)
}</code></pre>
<div class="out">$ node worker.js<br>
sum 1..4000000 = 8000002000000 (from 4 messages)</div>
<div class="callout">🧭 <strong>On a real server:</strong> message passing is how backends talk across machines — HTTP/REST and gRPC calls, and message queues (RabbitMQ, Kafka, SQS) that are exactly mailboxes: a producer service <code>send</code>s, a consumer service <code>receive</code>s, the broker buffers. Kafka consumer lag is the "how many full messages are waiting" of Figure 2-36.</div>`,
        `<p class="y-chinh">🎯 Hình 2-36 (bên tiêu thụ): <code>for (i = 0; i &lt; N; i++) send(producer, &amp;m); /* gửi N thông điệp rỗng */ while (TRUE) { receive(producer, &amp;m); item = extract_item(&amp;m); send(producer, &amp;m); /* gửi trả thông điệp rỗng */ consume_item(item); }</code></p>
<p>Bên tiêu thụ "mồi" N thông điệp rỗng, rồi cứ nhận một món là trả về một thông điệp rỗng. Nếu bên sản xuất nhanh hơn, mọi thông điệp dồn về phía bên tiêu thụ ở dạng đầy và bên sản xuất bị chặn chờ thông điệp rỗng; nếu bên tiêu thụ nhanh hơn, mọi thông điệp đều rỗng và nó bị chặn chờ món hàng. Đằng nào cũng không ai chờ bận và không gì bị mất. Sách thêm rằng thông điệp có thể gửi thẳng tới tiến trình hoặc tới <strong>hộp thư (mailbox)</strong> — một chỗ đệm được một số thông điệp nhất định; MPI, dùng trên siêu máy tính, là một thư viện truyền thông điệp.</p>
<p>➕ Hai tiến trình thật tạo bằng <code>fork</code>, hai pipe làm hộp thư (nhân đệm các byte), N = 4 thông điệp rỗng, mười món:</p>
<pre><code class="language-c">// Hình 2-36 với hai tiến trình thật: pipe của nhân là các hộp thư, N thông điệp rỗng đi ngược lại
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

#define N 4                                     /* number of slots in the buffer */
#define ITEMS 10
typedef struct { int item; } message;           /* message buffer */
int to_consumer[2], to_producer[2];             // hai hộp thư

void send(int *box, message *m)    { write(box[1], m, sizeof *m); }
void receive(int *box, message *m) { if (read(box[0], m, sizeof *m) != sizeof *m) exit(1); }

void producer(void) {
    message m;
    for (int item = 1; item &lt;= ITEMS; item++) {    /* item = produce_item() */
        receive(to_producer, &amp;m);                  /* wait for an empty to arrive */
        m.item = item;                             /* construct a message to send */
        send(to_consumer, &amp;m);                     /* send item to consumer */
    }
}

void consumer(void) {
    message m;
    for (int i = 0; i &lt; N; i++) send(to_producer, &amp;m);   /* send N empties */
    for (int k = 1; k &lt;= ITEMS; k++) {
        receive(to_consumer, &amp;m);                  /* get message containing item */
        int item = m.item;                         /* extract item from message */
        send(to_producer, &amp;m);                     /* send back empty reply */
        printf("consumer got item %d\\n", item);      /* consume_item(item) */
    }
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    pipe(to_consumer);
    pipe(to_producer);
    if (fork() == 0) { producer(); exit(0); }     // tiến trình A: sản xuất
    if (fork() == 0) { consumer(); exit(0); }     // tiến trình B: tiêu thụ
    while (wait(NULL) &gt; 0) ;
    printf("no shared memory, no semaphore: only send and receive\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread tin-nhan.c -o tin-nhan &amp;&amp; ./tin-nhan<br>
consumer got item 1<br>
consumer got item 2<br>
consumer got item 3<br>
consumer got item 4<br>
consumer got item 5<br>
consumer got item 6<br>
consumer got item 7<br>
consumer got item 8<br>
consumer got item 9<br>
consumer got item 10<br>
no shared memory, no semaphore: only send and receive</div>
<p>Không biến dùng chung, không semaphore — chính lệnh <code>read</code> có chặn của pipe là cơ chế đồng bộ. Và truyền thông điệp giữa các <strong>luồng</strong> trong Node.js: worker thread không dùng chung biến JavaScript nào; chúng chỉ có thể <code>postMessage</code>:</p>
<pre><code class="language-javascript">// Truyền thông điệp trong Node.js: worker_threads KHÔNG dùng chung biến nào, chỉ postMessage
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  let done = 0, total = 0;
  for (let k = 0; k &lt; 4; k++) {                                  // 4 worker, mỗi cái cộng một phần tư của 1..4.000.000
    const w = new Worker(__filename, { workerData: { from: k * 1e6 + 1, to: (k + 1) * 1e6 } });
    w.on('message', (msg) =&gt; {                                   // nhận thông điệp
      total += msg.sum;
      if (++done === 4) console.log(&#96;sum 1..4000000 = &#36;{total} (from 4 messages)&#96;);
    });
  }
} else {
  let sum = 0;
  for (let i = workerData.from; i &lt;= workerData.to; i++) sum += i;
  parentPort.postMessage({ sum });                               // gửi thông điệp
}</code></pre>
<div class="out">$ node worker.js<br>
sum 1..4000000 = 8000002000000 (from 4 messages)</div>
<div class="callout">🧭 <strong>Trên server thật:</strong> truyền thông điệp là cách các backend nói chuyện xuyên máy — gọi HTTP/REST và gRPC, và hàng đợi thông điệp (RabbitMQ, Kafka, SQS) chính là hộp thư: dịch vụ sản xuất <code>send</code>, dịch vụ tiêu thụ <code>receive</code>, broker đệm giữ. Độ trễ tiêu thụ (consumer lag) của Kafka chính là "có bao nhiêu thông điệp đầy đang chờ" của Hình 2-36.</div>`],
      [53, 'Barriers',
        `<p class="y-chinh">🎯 Figure 2-37: use of a <strong>barrier</strong> — (a) processes A–D approach a barrier; (b) all processes but one are blocked at the barrier; (c) when the last process (C) arrives, all of them are let through.</p>
<p>Some applications are divided into <strong>phases</strong> with the rule that no process may start the next phase until all processes have finished the current one. The book's example: a large matrix (say, temperatures of a metal plate) is updated in rounds; each process computes part of the new matrix from the whole old one, so nobody may start round k+1 before everyone has finished round k. A barrier is placed at the end of each phase: a process that reaches it blocks, and the last arrival releases everyone.</p>
<p>➕ Pthreads has barriers built in. Four threads with different phase-1 durations (D fastest, A slowest):</p>
<pre><code class="language-c">// Figure 2-37 with pthread_barrier_wait: nobody starts phase 2 until all four have finished phase 1
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;unistd.h&gt;

pthread_barrier_t barrier;

void *process(void *arg) {
    int me = (int)(long)arg;
    usleep((4 - me) * 50 * 1000);                    // D is fastest, A is slowest (A arrives last)
    printf("%c: phase 1 done, waiting at the barrier\\n", 'A' + me);
    int r = pthread_barrier_wait(&amp;barrier);          // blocks until 4 threads are here
    printf("%c: phase 2 starts%s\\n", 'A' + me, r == PTHREAD_BARRIER_SERIAL_THREAD ? "  (I was chosen as the serial thread)" : "");
    return NULL;
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    pthread_t t[4];
    pthread_barrier_init(&amp;barrier, NULL, 4);
    for (long i = 0; i &lt; 4; i++) pthread_create(&amp;t[i], NULL, process, (void *)i);
    for (int i = 0; i &lt; 4; i++) pthread_join(t[i], NULL);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread rao-chan.c -o rao-chan &amp;&amp; ./rao-chan<br>
D: phase 1 done, waiting at the barrier<br>
C: phase 1 done, waiting at the barrier<br>
B: phase 1 done, waiting at the barrier<br>
A: phase 1 done, waiting at the barrier<br>
A: phase 2 starts &nbsp;(I was chosen as the serial thread)<br>
D: phase 2 starts<br>
C: phase 2 starts<br>
B: phase 2 starts</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>All four "phase 1 done" lines come before any "phase 2" line, whatever the speeds; the last thread to arrive (A here) opened the barrier, and <code>pthread_barrier_wait</code> returned a special value to exactly one thread (the "serial thread", useful for one-time work such as swapping the old and new matrices). The barriers in <code>errno-luong.c</code> and <code>ps-luong.c</code> (2.A) were used for the same reason: to force an order.</p>
<div class="callout">🧭 <strong>On a real server:</strong> Java's <code>CyclicBarrier</code> and <code>CountDownLatch</code>, Go's <code>sync.WaitGroup</code> and JavaScript's <code>Promise.all</code> are barriers — "start all, continue when all are done". A web endpoint that calls three services in parallel and waits for all answers uses one.</div>`,
        `<p class="y-chinh">🎯 Hình 2-37: dùng <strong>rào chắn (barrier)</strong> — (a) các tiến trình A–D tiến tới rào chắn; (b) mọi tiến trình trừ một đều bị chặn ở rào; (c) khi tiến trình cuối cùng (C) tới, tất cả được cho đi qua.</p>
<p>Một số ứng dụng chia thành các <strong>pha (phase)</strong> với quy tắc không tiến trình nào được bắt đầu pha sau khi chưa mọi tiến trình xong pha hiện tại. Ví dụ của sách: một ma trận lớn (chẳng hạn nhiệt độ của một tấm kim loại) được cập nhật theo từng vòng; mỗi tiến trình tính một phần ma trận mới từ toàn bộ ma trận cũ, nên không ai được bắt đầu vòng k+1 trước khi mọi người xong vòng k. Rào chắn đặt ở cuối mỗi pha: tiến trình nào tới thì bị chặn, người tới sau cùng mở cho tất cả.</p>
<p>➕ Pthreads có sẵn rào chắn. Bốn luồng với thời gian pha 1 khác nhau (D nhanh nhất, A chậm nhất):</p>
<pre><code class="language-c">// Hình 2-37 với pthread_barrier_wait: không ai bắt đầu pha 2 khi cả bốn chưa xong pha 1
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;unistd.h&gt;

pthread_barrier_t barrier;

void *process(void *arg) {
    int me = (int)(long)arg;
    usleep((4 - me) * 50 * 1000);                    // D nhanh nhất, A chậm nhất (A tới sau cùng)
    printf("%c: phase 1 done, waiting at the barrier\\n", 'A' + me);
    int r = pthread_barrier_wait(&amp;barrier);          // bị chặn tới khi đủ 4 luồng
    printf("%c: phase 2 starts%s\\n", 'A' + me, r == PTHREAD_BARRIER_SERIAL_THREAD ? "  (I was chosen as the serial thread)" : "");
    return NULL;
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    pthread_t t[4];
    pthread_barrier_init(&amp;barrier, NULL, 4);
    for (long i = 0; i &lt; 4; i++) pthread_create(&amp;t[i], NULL, process, (void *)i);
    for (int i = 0; i &lt; 4; i++) pthread_join(t[i], NULL);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread rao-chan.c -o rao-chan &amp;&amp; ./rao-chan<br>
D: phase 1 done, waiting at the barrier<br>
C: phase 1 done, waiting at the barrier<br>
B: phase 1 done, waiting at the barrier<br>
A: phase 1 done, waiting at the barrier<br>
A: phase 2 starts &nbsp;(I was chosen as the serial thread)<br>
D: phase 2 starts<br>
C: phase 2 starts<br>
B: phase 2 starts</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Cả bốn dòng "phase 1 done" đứng trước mọi dòng "phase 2", bất kể tốc độ; luồng tới sau cùng (ở đây là A) mở rào, và <code>pthread_barrier_wait</code> trả một giá trị đặc biệt cho đúng một luồng ("serial thread", hữu ích cho việc chỉ làm một lần như tráo ma trận cũ và mới). Các rào chắn trong <code>errno-luong.c</code> và <code>ps-luong.c</code> (2.A) được dùng vì cùng lý do: ép một thứ tự.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> <code>CyclicBarrier</code> và <code>CountDownLatch</code> của Java, <code>sync.WaitGroup</code> của Go và <code>Promise.all</code> của JavaScript đều là rào chắn — "khởi động hết, đi tiếp khi tất cả xong". Một endpoint gọi ba dịch vụ song song rồi chờ đủ ba câu trả lời đang dùng một rào chắn.</div>`],
      [54, 'Avoiding Locks: Read-Copy-Update (1)',
        `<p class="y-chinh">🎯 Figure 2-38 (adding a node): (a) the original tree A → B, E; B → C, D. (b) Initialize a new node X and connect E to it — readers in A and E are not affected, nobody can reach X yet. (c) When X is completely initialized, connect X to A with one pointer store; readers currently in E read the old version, readers in A will pick up the new version.</p>
<p>The fastest lock is no lock. <strong>Read-Copy-Update (RCU)</strong> lets readers access a shared structure with <strong>no lock at all</strong> while a writer updates it, by guaranteeing that every reader sees either the complete old version or the complete new one, never a mix. The trick is that the writer never modifies anything readers can see in place: it builds the new piece on the side (b) and then publishes it with a <strong>single atomic pointer write</strong> (c). A reader who already passed A continues in the old part of the tree; a reader starting now goes through X.</p>
<p>➕ The same idea in everyday Java: <code>CopyOnWriteArrayList</code> — every write copies the array, changes the copy and atomically publishes it; an iterator started earlier keeps reading the old array:</p>
<pre><code class="language-java">// Read-Copy-Update's idea in everyday Java: CopyOnWriteArrayList — a reader keeps the OLD version, writers never wait for it
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class SaoChepKhiGhi {
    public static void main(String[] args) {
        List&lt;String&gt; routes = new CopyOnWriteArrayList&lt;&gt;(List.of("/home", "/login", "/cart"));
        Iterator&lt;String&gt; reader = routes.iterator();       // a reader starts walking version 1
        System.out.println("reader sees " + reader.next());
        routes.add("/admin");                              // writer: COPY the array, change the copy, publish it
        routes.remove("/login");                           // no lock held by the reader, no waiting
        StringBuilder rest = new StringBuilder();
        reader.forEachRemaining(r -&gt; rest.append(r).append(' '));
        System.out.println("same reader continues: " + rest.toString().trim() + "   (old version, still consistent)");
        System.out.println("a NEW reader sees    : " + String.join(" ", routes) + "   (new version)");
    }
}</code></pre>
<div class="out">$ javac SaoChepKhiGhi.java &amp;&amp; java SaoChepKhiGhi<br>
reader sees /home<br>
same reader continues: /login /cart &nbsp;&nbsp;(old version, still consistent)<br>
a NEW reader sees &nbsp;&nbsp;&nbsp;: /home /cart /admin &nbsp;&nbsp;(new version)</div>
<p>The old reader finished its walk on the version it started with (it still saw <code>/login</code>, which had been removed), consistent and without any lock; a new reader sees the new version. That is RCU's guarantee, at the price of copying on every write — perfect for data read thousands of times per write (routing tables, configuration, listener lists).</p>
<p class="meo">🧠 RCU = editing a printed timetable: you print the new version and swap it on the wall in one move; people already reading the old sheet finish reading it, newcomers read the new one. Nobody is told "wait, I'm editing".</p>`,
        `<p class="y-chinh">🎯 Hình 2-38 (thêm một nút): (a) cây ban đầu A → B, E; B → C, D. (b) Khởi tạo nút mới X và nối E vào nó — người đọc ở A và E không bị ảnh hưởng, chưa ai tới được X. (c) Khi X đã khởi tạo xong, nối X vào A bằng một lệnh ghi con trỏ; người đọc đang ở E đọc bản cũ, người đọc ở A sẽ đi theo bản mới.</p>
<p>Khoá nhanh nhất là không có khoá. <strong>Read-Copy-Update (RCU — đọc-chép-cập nhật)</strong> cho người đọc truy cập một cấu trúc dùng chung <strong>không cần khoá nào</strong> trong lúc người ghi cập nhật nó, bằng cách bảo đảm mọi người đọc thấy hoặc trọn bản cũ hoặc trọn bản mới, không bao giờ lẫn lộn. Mẹo là người ghi không bao giờ sửa tại chỗ thứ người đọc đang thấy: nó dựng phần mới ở bên cạnh (b) rồi công bố bằng <strong>một lệnh ghi con trỏ nguyên tử</strong> (c). Người đọc đã đi qua A thì tiếp tục trong phần cũ của cây; người đọc bắt đầu bây giờ đi qua X.</p>
<p>➕ Cùng ý tưởng đó trong Java hằng ngày: <code>CopyOnWriteArrayList</code> — mỗi lần ghi chép mảng, sửa bản chép rồi công bố nó một cách nguyên tử; một iterator bắt đầu từ trước vẫn đọc mảng cũ:</p>
<pre><code class="language-java">// Ý tưởng Read-Copy-Update trong Java hằng ngày: CopyOnWriteArrayList — người đọc giữ phiên bản CŨ, người ghi không phải chờ
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class SaoChepKhiGhi {
    public static void main(String[] args) {
        List&lt;String&gt; routes = new CopyOnWriteArrayList&lt;&gt;(List.of("/home", "/login", "/cart"));
        Iterator&lt;String&gt; reader = routes.iterator();       // một người đọc bắt đầu đi trên phiên bản 1
        System.out.println("reader sees " + reader.next());
        routes.add("/admin");                              // người ghi: CHÉP mảng, sửa bản chép, công bố nó
        routes.remove("/login");                           // người đọc không giữ khoá nào, không ai phải chờ
        StringBuilder rest = new StringBuilder();
        reader.forEachRemaining(r -&gt; rest.append(r).append(' '));
        System.out.println("same reader continues: " + rest.toString().trim() + "   (old version, still consistent)");
        System.out.println("a NEW reader sees    : " + String.join(" ", routes) + "   (new version)");
    }
}</code></pre>
<div class="out">$ javac SaoChepKhiGhi.java &amp;&amp; java SaoChepKhiGhi<br>
reader sees /home<br>
same reader continues: /login /cart &nbsp;&nbsp;(old version, still consistent)<br>
a NEW reader sees &nbsp;&nbsp;&nbsp;: /home /cart /admin &nbsp;&nbsp;(new version)</div>
<p>Người đọc cũ đi hết lượt trên phiên bản lúc nó bắt đầu (vẫn thấy <code>/login</code> dù nó đã bị xoá), nhất quán và không cần khoá; người đọc mới thấy phiên bản mới. Đó là bảo đảm của RCU, đổi lại phải chép mỗi lần ghi — rất hợp cho dữ liệu đọc hàng nghìn lần mới ghi một lần (bảng định tuyến, cấu hình, danh sách listener).</p>
<p class="meo">🧠 RCU = sửa bảng giờ tàu in giấy: in bản mới rồi thay lên tường trong một động tác; ai đang đọc tờ cũ thì đọc nốt, người mới tới đọc tờ mới. Không ai bị bảo "chờ đã, đang sửa".</p>`],
      [55, 'Avoiding Locks: Read-Copy-Update (2)',
        `<p class="y-chinh">🎯 Figure 2-38 (removing nodes): (d) decouple B from A — readers already in B still see the old version, readers in A see the new one; (e) wait until all readers have left B and C (the <strong>grace period</strong>) — then these nodes cannot be accessed any more; (f) now B and D can safely be removed (freed).</p>
<p>Removal is the hard part. Unlinking B is again a single pointer write (d), but B's memory cannot be freed immediately: a reader may still be walking through it. RCU therefore waits for a <strong>grace period</strong> — any period after which every thread that might have held a reference has finished its read-side critical section. The Linux kernel knows this cheaply: readers are not allowed to block inside an RCU read section, so once every CPU has done at least one context switch, no old reader can remain. Only then is the memory freed (f).</p>
<p>➕ RCU was added to the Linux kernel in 2002 (2.5.43) and is now used thousands of times in it — the routing table, the list of loaded modules, the directory-entry cache, process lists. In Java and other garbage-collected languages the grace period comes for free: the old version is freed by the garbage collector only when no reader references it any more — which is exactly why <code>CopyOnWriteArrayList</code> on the previous slide needed no extra code. Old lesson 2.5 discusses the related lock-free technique, compare-and-swap, and its ABA problem.</p>
<p class="pitfall">⚠️ RCU suits read-mostly data. Writers still need to coordinate with <em>each other</em> (usually with a lock), and every write costs a copy — for write-heavy data a normal lock or a read-write lock (slide 72) is better.</p>`,
        `<p class="y-chinh">🎯 Hình 2-38 (xoá nút): (d) tách B khỏi A — người đọc đã ở trong B vẫn thấy bản cũ, người đọc ở A thấy bản mới; (e) chờ tới khi mọi người đọc đã rời B và C (<strong>thời gian ân hạn — grace period</strong>) — lúc đó không ai còn truy cập các nút này được; (f) giờ có thể xoá (giải phóng) B và D một cách an toàn.</p>
<p>Xoá mới là phần khó. Gỡ B lại chỉ là một lệnh ghi con trỏ (d), nhưng bộ nhớ của B chưa thể giải phóng ngay: có thể còn người đọc đang đi qua nó. Vì thế RCU chờ một <strong>thời gian ân hạn</strong> — khoảng thời gian mà sau đó mọi luồng có thể đang giữ tham chiếu đều đã xong đoạn đọc của mình. Nhân Linux biết điều này với giá rất rẻ: người đọc không được phép bị chặn bên trong đoạn đọc RCU, nên khi mọi CPU đã chuyển ngữ cảnh ít nhất một lần thì không thể còn người đọc cũ nào. Chỉ khi đó bộ nhớ mới được giải phóng (f).</p>
<p>➕ RCU được đưa vào nhân Linux năm 2002 (bản 2.5.43) và nay được dùng hàng nghìn chỗ trong đó — bảng định tuyến, danh sách mô-đun đã nạp, bộ đệm mục thư mục, danh sách tiến trình. Trong Java và các ngôn ngữ có bộ gom rác, thời gian ân hạn có sẵn miễn phí: bản cũ chỉ bị bộ gom rác giải phóng khi không người đọc nào còn tham chiếu tới nó — chính vì vậy <code>CopyOnWriteArrayList</code> ở slide trước không cần thêm dòng mã nào. Bài cũ 2.5 bàn kỹ thuật không khoá họ hàng, compare-and-swap, và vấn đề ABA của nó.</p>
<p class="pitfall">⚠️ RCU hợp với dữ liệu chủ yếu là đọc. Người ghi vẫn phải phối hợp <em>với nhau</em> (thường bằng một khoá), và mỗi lần ghi tốn một lần chép — với dữ liệu ghi nhiều thì khoá thường hoặc khoá đọc-ghi (slide 72) tốt hơn.</p>`],
    ]),
    bi(`<h2>📌 What you can now do</h2>
<ul>
<li>Explain a race condition with the spooler and the three-instruction counter, and reproduce one.</li>
<li>State the four conditions for a correct critical-region solution and judge strict alternation (no progress), Peterson (correct in theory, needs memory barriers on real CPUs) and TSL/XCHG (atomic hardware, busy waiting).</li>
<li>Explain the lost wakeup, and solve producer–consumer with three semaphores — and know that swapping the downs deadlocks.</li>
<li>Choose between spinning, yielding and sleeping (futex), and use Pthreads mutexes and condition variables with the <code>while</code> rule.</li>
<li>Explain what a monitor guarantees, the Hoare / Mesa difference, and read Java's synchronized/wait/notify (and replace it with BlockingQueue).</li>
<li>Solve producer–consumer with message passing, synchronize phases with barriers, and explain how RCU lets readers go lock-free.</li>
</ul>
<p>Next, lesson 2.C: who runs next — scheduling algorithms, worked numerically — and the classical IPC problems (dining philosophers, readers and writers).</p>`,
    `<h2>📌 Giờ bạn làm được</h2>
<ul>
<li>Giải thích tranh chấp bằng thư mục spooler và bộ đếm ba lệnh máy, và tái hiện được nó.</li>
<li>Nêu bốn điều kiện cho lời giải vùng găng đúng và đánh giá luân phiên nghiêm ngặt (thiếu tiến triển), Peterson (đúng trên lý thuyết, cần rào chắn bộ nhớ trên CPU thật) và TSL/XCHG (phần cứng nguyên tử, chờ bận).</li>
<li>Giải thích mất tín hiệu đánh thức, và giải sản xuất–tiêu thụ bằng ba semaphore — và biết đảo hai lệnh down là bế tắc.</li>
<li>Chọn giữa quay, nhường và ngủ (futex), và dùng mutex với biến điều kiện của Pthreads theo quy tắc <code>while</code>.</li>
<li>Giải thích monitor bảo đảm điều gì, khác biệt Hoare / Mesa, và đọc synchronized/wait/notify của Java (và thay nó bằng BlockingQueue).</li>
<li>Giải sản xuất–tiêu thụ bằng truyền thông điệp, đồng bộ các pha bằng rào chắn, và giải thích RCU cho người đọc chạy không khoá ra sao.</li>
</ul>
<p>Tiếp theo, bài 2.C: ai được chạy tiếp — các thuật toán lập lịch, giải bằng số — và các bài toán IPC kinh điển (triết gia ăn tối, người đọc và người ghi).</p>`),
    books([
      ['mos4', 'Chapter 2, section 2.3 (pp. 119–148): Figures 2-21 to 2-38', 'Chương 2, mục 2.3 (tr. 119–148): Hình 2-21 tới 2-38'],
      ['ostep', 'Chapters 28–31 (locks, lock-based data structures, condition variables, semaphores)', 'Chương 28–31 (khoá, cấu trúc dữ liệu có khoá, biến điều kiện, semaphore)'],
      ['man7', 'sem_overview(7), sem_wait(3), pthread_mutex_lock(3p), pthread_cond_wait(3p), pthread_barrier_wait(3p), futex(2), futex(7), pipe(2)', 'sem_overview(7), sem_wait(3), pthread_mutex_lock(3p), pthread_cond_wait(3p), pthread_barrier_wait(3p), futex(2), futex(7), pipe(2)'],
      ['kernelDocs', '"What is RCU?" (Documentation/RCU/whatisRCU.rst) and the memory-barriers guide (Documentation/memory-barriers.txt)', '"What is RCU?" (Documentation/RCU/whatisRCU.rst) và hướng dẫn rào chắn bộ nhớ (Documentation/memory-barriers.txt)'],
      ['posix', 'sem_init, sem_wait, sem_post, pthread_mutex_*, pthread_cond_*, pthread_barrier_* (IEEE Std 1003.1)', 'sem_init, sem_wait, sem_post, pthread_mutex_*, pthread_cond_*, pthread_barrier_* (IEEE Std 1003.1)'],
    ]),
  ].join('\n'),
};

/* ───────── 2.C — 📑 Slide by slide · Processes and Threads: scheduling, real time, classical IPC problems (slides 56–74) ───────── */
const L_osg2_3 = {
  title: '2.C — 📑 Slide by slide · Processes and Threads: scheduling, real time, classical IPC problems (slides 56–74)|||2.C — 📑 Học theo từng slide · Processes and Threads: lập lịch, thời gian thực, bài toán IPC kinh điển (slide 56–74)',
  slug: 'osg202-slide-osg2-3',
  type: 'VIDEO',
  description: 'Giảng đủ 19 slide cuối Chương 2: tiến trình nặng CPU và nặng I/O đo bằng getrusage, ba loại hệ thống và chính sách lập lịch thật của Linux (SCHED_OTHER/BATCH/FIFO/RR/DEADLINE, chrt cần CAP_SYS_NICE), mục tiêu lập lịch, FCFS/SJF/SRTN với Hình 2-41 và các câu tính FE thật (mọi đáp án do bộ mô phỏng tính và đối chiếu ngân hàng đề), ước lượng lão hoá, Round Robin và cái giá của lượng tử, lập lịch ưu tiên với nice đo thật 90/10, thời gian thực Σ C/P ≤ 1 và lịch EDF, lập lịch luồng mức người dùng và mức nhân (Hình 2-44), bữa tối các triết gia (bản ngây thơ bế tắc thật, đồ thị chu trình, lời giải của sách chạy thật) và người đọc – người ghi (người ghi bị bỏ đói đo bằng mili-giây).',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.C · deck "Chapter 2 · Processes and Threads", slides 56–74</span>
<h2>Scheduling and the classical IPC problems</h2>
<p class="lead">The last part of the deck answers the question every multiprogrammed system faces many times per second: <strong>which ready process runs next?</strong> (section 2.4), and then closes with two classical synchronization problems that every OS course uses as tests, the dining philosophers and the readers and writers (section 2.5). Scheduling is where the FE puts its calculation questions — every Gantt chart here is computed by the course simulator, and every FE answer quoted was checked against it. Linux's real scheduling policies are shown with <code>chrt</code>, <code>nice</code> and <code>taskset</code> in the container.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>56–58</td><td>2.4.1 Introduction to scheduling</td><td>tell CPU-bound from I/O-bound, name the three environments and their goals</td></tr>
<tr><td>59–60</td><td>2.4.2 Batch systems</td><td>compute FCFS, SJF and SRTN schedules and average turnaround/waiting times</td></tr>
<tr><td>61–63</td><td>2.4.3 Interactive systems</td><td>compute Round Robin and Priority schedules; explain aging, lottery and fair-share</td></tr>
<tr><td>64</td><td>2.4.4 Real-time systems</td><td>test schedulability with Σ C/P ≤ 1</td></tr>
<tr><td>65–66</td><td>2.4.6 Thread scheduling</td><td>compare user-level and kernel-level thread scheduling</td></tr>
<tr><td>67–71</td><td>2.5.1 Dining philosophers</td><td>explain why the naive solution deadlocks and how Figure 2-47 avoids it</td></tr>
<tr><td>72–73</td><td>2.5.2 Readers and writers</td><td>explain the solution and its writer starvation</td></tr>
</tbody>
</table>
<div class="callout">The older web lesson 2.4 works one data set through six algorithms by hand (including MLFQ and Linux CFS/EEVDF); 2.6 covers the classical problems with fixes. This lesson follows the slides, draws every schedule with the simulator, and runs the solutions.</div>`,
    `<span class="eyebrow">Chương 2 · Bài 2.C · deck "Chapter 2 · Processes and Threads", slide 56–74</span>
<h2>Lập lịch và các bài toán IPC kinh điển</h2>
<p class="lead">Phần cuối bộ slide trả lời câu hỏi mà mọi hệ đa chương trình gặp nhiều lần mỗi giây: <strong>tiến trình sẵn sàng nào chạy tiếp?</strong> (mục 2.4), rồi khép lại bằng hai bài toán đồng bộ kinh điển mà môn HĐH nào cũng dùng làm bài kiểm tra, các triết gia ăn tối và người đọc – người ghi (mục 2.5). Lập lịch là nơi FE đặt các câu tính toán — mọi biểu đồ Gantt ở đây do bộ mô phỏng của môn tính, và mọi đáp án FE được trích đều đã đối chiếu với nó. Các chính sách lập lịch thật của Linux được cho xem bằng <code>chrt</code>, <code>nice</code> và <code>taskset</code> trong container.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>56–58</td><td>2.4.1 Giới thiệu lập lịch</td><td>phân biệt nặng CPU với nặng I/O, kể ba môi trường và mục tiêu của chúng</td></tr>
<tr><td>59–60</td><td>2.4.2 Hệ lô</td><td>tính lịch FCFS, SJF và SRTN cùng thời gian hoàn thành/chờ trung bình</td></tr>
<tr><td>61–63</td><td>2.4.3 Hệ tương tác</td><td>tính lịch Round Robin và Priority; giải thích lão hoá, xổ số và chia phần công bằng</td></tr>
<tr><td>64</td><td>2.4.4 Hệ thời gian thực</td><td>kiểm khả năng lập lịch bằng Σ C/P ≤ 1</td></tr>
<tr><td>65–66</td><td>2.4.6 Lập lịch luồng</td><td>so lập lịch luồng mức người dùng và mức nhân</td></tr>
<tr><td>67–71</td><td>2.5.1 Triết gia ăn tối</td><td>giải thích vì sao lời giải ngây thơ bế tắc và Hình 2-47 tránh nó thế nào</td></tr>
<tr><td>72–73</td><td>2.5.2 Người đọc và người ghi</td><td>giải thích lời giải và việc người ghi bị bỏ đói</td></tr>
</tbody>
</table>
<div class="callout">Bài web cũ 2.4 giải tay một bộ số qua sáu thuật toán (kể cả MLFQ và CFS/EEVDF của Linux); bài 2.6 nói về các bài toán kinh điển và cách chữa. Bài này đi theo slide, vẽ mọi lịch bằng bộ mô phỏng, và chạy thật các lời giải.</div>`),
    walkHead('osg2', 56, 74),
    walk('osg2', [
      [56, 'Introduction to Scheduling: Process Behavior',
        `<p class="y-chinh">🎯 Figure 2-39: bursts of CPU usage alternate with periods of waiting for I/O. (a) A <strong>CPU-bound</strong> (compute-bound) process: long CPU bursts, infrequent I/O waits. (b) An <strong>I/O-bound</strong> process: short CPU bursts, frequent I/O waits.</p>
<p>When more processes are ready than there are CPUs, the part of the OS that chooses is the <strong>scheduler</strong>, and its algorithm is the <strong>scheduling algorithm</strong>. Almost every process alternates computing with waiting for I/O; what matters is the <em>length of the CPU bursts</em>, not of the I/O waits — an I/O-bound process is I/O-bound because it computes little between requests, not because its requests are long. As CPUs get faster than disks, processes tend to become more I/O-bound, so the book's advice is: <strong>when an I/O-bound process wants to run, give it a chance quickly</strong>, so that it issues its next disk request and keeps the disk busy.</p>
<p>➕ Both kinds measured with the kernel's own accounting (<code>getrusage</code> of the finished child):</p>
<pre><code class="language-c">// Figure 2-39 measured: a CPU-bound and an I/O-bound process, as the kernel accounts them (getrusage)
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;sys/resource.h&gt;

static void cpu_bound(void) {                 // long CPU bursts, almost no I/O
    volatile double x = 0;
    for (long i = 0; i &lt; 200000000; i++) x += i * 0.5;
}

static void io_bound(void) {                  // a short burst, then wait for I/O, again and again
    int fd = open("log.txt", O_CREAT | O_WRONLY | O_TRUNC, 0644);
    for (int i = 0; i &lt; 300; i++) {
        volatile double x = 0;
        for (int k = 0; k &lt; 20000; k++) x += k;   // short CPU burst
        write(fd, "log line\\n", 9);
        fsync(fd);                            // wait until the disk has it
        usleep(1000);                         // and wait for the "network"
    }
    close(fd);
}

static void measure(const char *name, void (*f)(void)) {
    struct timespec a, b;
    clock_gettime(CLOCK_MONOTONIC, &amp;a);
    pid_t p = fork();
    if (p == 0) { f(); exit(0); }
    struct rusage ru;
    wait4(p, NULL, 0, &amp;ru);
    clock_gettime(CLOCK_MONOTONIC, &amp;b);
    double wall = (b.tv_sec - a.tv_sec) + (b.tv_nsec - a.tv_nsec) / 1e9;
    double cpu = ru.ru_utime.tv_sec + ru.ru_utime.tv_usec / 1e6 + ru.ru_stime.tv_sec + ru.ru_stime.tv_usec / 1e6;
    printf("%-9s | %5.2f | %5.2f | %6ld | %5.0f%%\\n", name, wall, cpu, ru.ru_nvcsw, 100 * cpu / wall);
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    printf("process   | wall s | CPU s | blocks | CPU share\\n");
    measure("CPU-bound", cpu_bound);
    measure("I/O-bound", io_bound);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread cpu-io.c -o cpu-io &amp;&amp; ./cpu-io<br>
process &nbsp;&nbsp;| wall s | CPU s | blocks | CPU share<br>
CPU-bound | &nbsp;0.74 | &nbsp;0.74 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 | &nbsp;&nbsp;100%<br>
I/O-bound | &nbsp;0.51 | &nbsp;0.06 | &nbsp;&nbsp;&nbsp;905 | &nbsp;&nbsp;&nbsp;11%</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The CPU-bound child used the CPU for its whole lifetime and almost never blocked; the I/O-bound child blocked hundreds of times (each <code>fsync</code> and each <code>usleep</code>) and used the CPU for only a small fraction of its wall-clock time. A scheduler that favours short bursts lets the I/O-bound one get in, issue its request, and step aside.</p>
<p class="pitfall">⚠️ FE1#8: "Which statement is true about the classification of a process by its behaviour?" — <strong>a compute-bound process spends most of its time computing</strong>. The other options reverse the definitions.</p>`,
        `<p class="y-chinh">🎯 Hình 2-39: các đợt dùng CPU xen kẽ với các khoảng chờ I/O. (a) Tiến trình <strong>nặng CPU (CPU-bound, compute-bound)</strong>: đợt CPU dài, ít khi chờ I/O. (b) Tiến trình <strong>nặng I/O (I/O-bound)</strong>: đợt CPU ngắn, chờ I/O thường xuyên.</p>
<p>Khi số tiến trình sẵn sàng nhiều hơn số CPU, phần HĐH đưa ra lựa chọn là <strong>bộ lập lịch (scheduler)</strong>, và thuật toán của nó là <strong>thuật toán lập lịch</strong>. Gần như tiến trình nào cũng xen kẽ tính toán với chờ I/O; điều quan trọng là <em>độ dài các đợt CPU</em>, không phải độ dài lúc chờ I/O — tiến trình nặng I/O là vì nó tính rất ít giữa các yêu cầu, không phải vì yêu cầu của nó dài. Khi CPU ngày càng nhanh hơn đĩa, các tiến trình có xu hướng nặng I/O hơn, nên lời khuyên của sách là: <strong>tiến trình nặng I/O muốn chạy thì cho nó cơ hội ngay</strong>, để nó gửi yêu cầu đĩa kế tiếp và giữ cho đĩa bận.</p>
<p>➕ Cả hai loại được đo bằng sổ sách của chính nhân (<code>getrusage</code> của tiến trình con đã xong):</p>
<pre><code class="language-c">// Hình 2-39 đo thật: một tiến trình nặng CPU và một tiến trình nặng I/O, theo sổ sách của nhân (getrusage)
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;sys/resource.h&gt;

static void cpu_bound(void) {                 // các đợt CPU dài, gần như không I/O
    volatile double x = 0;
    for (long i = 0; i &lt; 200000000; i++) x += i * 0.5;
}

static void io_bound(void) {                  // một đợt CPU ngắn, rồi chờ I/O, lặp đi lặp lại
    int fd = open("log.txt", O_CREAT | O_WRONLY | O_TRUNC, 0644);
    for (int i = 0; i &lt; 300; i++) {
        volatile double x = 0;
        for (int k = 0; k &lt; 20000; k++) x += k;   // đợt CPU ngắn
        write(fd, "log line\\n", 9);
        fsync(fd);                            // chờ tới khi đĩa nhận xong
        usleep(1000);                         // và chờ "mạng"
    }
    close(fd);
}

static void measure(const char *name, void (*f)(void)) {
    struct timespec a, b;
    clock_gettime(CLOCK_MONOTONIC, &amp;a);
    pid_t p = fork();
    if (p == 0) { f(); exit(0); }
    struct rusage ru;
    wait4(p, NULL, 0, &amp;ru);
    clock_gettime(CLOCK_MONOTONIC, &amp;b);
    double wall = (b.tv_sec - a.tv_sec) + (b.tv_nsec - a.tv_nsec) / 1e9;
    double cpu = ru.ru_utime.tv_sec + ru.ru_utime.tv_usec / 1e6 + ru.ru_stime.tv_sec + ru.ru_stime.tv_usec / 1e6;
    printf("%-9s | %5.2f | %5.2f | %6ld | %5.0f%%\\n", name, wall, cpu, ru.ru_nvcsw, 100 * cpu / wall);
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    printf("process   | wall s | CPU s | blocks | CPU share\\n");
    measure("CPU-bound", cpu_bound);
    measure("I/O-bound", io_bound);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread cpu-io.c -o cpu-io &amp;&amp; ./cpu-io<br>
process &nbsp;&nbsp;| wall s | CPU s | blocks | CPU share<br>
CPU-bound | &nbsp;0.74 | &nbsp;0.74 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 | &nbsp;&nbsp;100%<br>
I/O-bound | &nbsp;0.51 | &nbsp;0.06 | &nbsp;&nbsp;&nbsp;905 | &nbsp;&nbsp;&nbsp;11%</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Tiến trình con nặng CPU dùng CPU suốt đời nó và gần như không bao giờ bị chặn; tiến trình con nặng I/O bị chặn hàng trăm lần (mỗi lần <code>fsync</code> và mỗi lần <code>usleep</code>) và chỉ dùng CPU một phần nhỏ thời gian đồng hồ. Bộ lập lịch ưu ái đợt ngắn sẽ cho tiến trình nặng I/O vào, gửi yêu cầu, rồi tránh sang một bên.</p>
<p class="pitfall">⚠️ FE1#8: "Phát biểu nào đúng về phân loại tiến trình theo hành vi?" — <strong>tiến trình nặng tính toán (compute-bound) dành phần lớn thời gian để tính toán</strong>. Các phương án khác đảo ngược định nghĩa.</p>`],
      [57, 'Categories of Scheduling Algorithms',
        `<p class="y-chinh">🎯 Three environments need different scheduling algorithms: (1) <strong>batch</strong>, (2) <strong>interactive</strong>, (3) <strong>real time</strong>.</p>
<p><strong>Batch</strong> systems (payroll, inventory, bank interest — still common in business) have no users waiting at a terminal, so <strong>nonpreemptive</strong> algorithms, or preemptive ones with long time slices, are acceptable: fewer switches, more work done. <strong>Interactive</strong> systems (desktops, servers handling many users) need <strong>preemption</strong>: without it one process could shut out all others, by bug or on purpose. <strong>Real-time</strong> systems sometimes need no preemption because their processes know they cannot run long and do their work quickly. Key terms: a <strong>nonpreemptive</strong> algorithm lets a process run until it blocks or voluntarily releases the CPU; a <strong>preemptive</strong> algorithm runs it for at most a fixed time and then suspends it (which needs a clock interrupt).</p>
<p>➕ Linux expresses the three categories as <strong>scheduling policies</strong> attached to each process:</p>
<div class="out"># Linux's answer to slide 57 (batch, interactive, real time): one scheduling POLICY per process<br>
# normal = SCHED_OTHER (the fair scheduler), batch = SCHED_BATCH / SCHED_IDLE, real time = SCHED_FIFO / SCHED_RR / SCHED_DEADLINE<br>
$ chrt -m<br>
SCHED_OTHER min/max priority	: 0/0<br>
SCHED_FIFO min/max priority	: 1/99<br>
SCHED_RR min/max priority	: 1/99<br>
SCHED_BATCH min/max priority	: 0/0<br>
SCHED_IDLE min/max priority	: 0/0<br>
SCHED_DEADLINE min/max priority	: 0/0<br>
$ chrt -p $$<br>
pid 1's current scheduling policy: SCHED_OTHER<br>
pid 1's current scheduling priority: 0<br>
# the round-robin quantum Linux gives SCHED_RR processes, in milliseconds<br>
$ cat /proc/sys/kernel/sched_rr_timeslice_ms<br>
100<br>
# run something as a batch job: allowed for anyone<br>
$ chrt -b 0 chrt -p 0<br>
pid 18's current scheduling policy: SCHED_BATCH<br>
pid 18's current scheduling priority: 0<br>
# ask for real-time priority: refused without the CAP_SYS_NICE privilege (even for root in a default container)<br>
$ chrt -f 10 true<br>
chrt: failed to set pid 0's policy: Operation not permitted</div>
<p><code>SCHED_OTHER</code> is the normal interactive policy (the fair scheduler, CFS since Linux 2.6.23 in 2007, replaced by EEVDF in Linux 6.6 in 2023); <code>SCHED_BATCH</code> and <code>SCHED_IDLE</code> are for batch work — anyone may choose them (we just did); <code>SCHED_FIFO</code>, <code>SCHED_RR</code> (priorities 1–99) and <code>SCHED_DEADLINE</code> (Linux 3.14) are real time — and asking for them was refused: it needs the <code>CAP_SYS_NICE</code> privilege, which a default Docker container does not give even to root. The RR quantum for real-time round robin is 100 ms here.</p>
<p class="pitfall">⚠️ FE6#3: "An operating system characterized by having time as a key parameter" — a <strong>real-time</strong> system. FE19#32: FCFS is fine for most <strong>batch</strong> systems.</p>`,
        `<p class="y-chinh">🎯 Ba môi trường cần ba kiểu thuật toán lập lịch khác nhau: (1) <strong>lô (batch)</strong>, (2) <strong>tương tác (interactive)</strong>, (3) <strong>thời gian thực (real time)</strong>.</p>
<p>Hệ <strong>lô</strong> (tính lương, kiểm kho, tính lãi ngân hàng — vẫn phổ biến trong doanh nghiệp) không có người ngồi chờ ở màn hình, nên chấp nhận được thuật toán <strong>không chiếm quyền (nonpreemptive)</strong>, hoặc chiếm quyền với lát thời gian dài: ít lần chuyển, làm được nhiều việc. Hệ <strong>tương tác</strong> (máy để bàn, máy chủ phục vụ nhiều người) cần <strong>chiếm quyền (preemption)</strong>: không có nó, một tiến trình có thể chặn mọi tiến trình khác, do lỗi hay do cố ý. Hệ <strong>thời gian thực</strong> đôi khi không cần chiếm quyền vì các tiến trình biết mình không được chạy lâu và làm việc rất nhanh. Thuật ngữ then chốt: thuật toán <strong>không chiếm quyền</strong> cho tiến trình chạy tới khi nó bị chặn hoặc tự nhả CPU; thuật toán <strong>chiếm quyền</strong> chỉ cho nó chạy tối đa một khoảng thời gian rồi tạm dừng nó (cần ngắt đồng hồ).</p>
<p>➕ Linux thể hiện ba loại này bằng <strong>chính sách lập lịch (scheduling policy)</strong> gắn với từng tiến trình:</p>
<div class="out"># Câu trả lời của Linux cho slide 57 (lô, tương tác, thời gian thực): mỗi tiến trình một CHÍNH SÁCH lập lịch<br>
# thường = SCHED_OTHER (bộ lập lịch công bằng), lô = SCHED_BATCH / SCHED_IDLE, thời gian thực = SCHED_FIFO / SCHED_RR / SCHED_DEADLINE<br>
$ chrt -m<br>
SCHED_OTHER min/max priority	: 0/0<br>
SCHED_FIFO min/max priority	: 1/99<br>
SCHED_RR min/max priority	: 1/99<br>
SCHED_BATCH min/max priority	: 0/0<br>
SCHED_IDLE min/max priority	: 0/0<br>
SCHED_DEADLINE min/max priority	: 0/0<br>
$ chrt -p $$<br>
pid 1's current scheduling policy: SCHED_OTHER<br>
pid 1's current scheduling priority: 0<br>
# lượng tử round-robin Linux cho tiến trình SCHED_RR, tính bằng mili-giây<br>
$ cat /proc/sys/kernel/sched_rr_timeslice_ms<br>
100<br>
# chạy một việc theo kiểu lô: ai cũng được phép<br>
$ chrt -b 0 chrt -p 0<br>
pid 18's current scheduling policy: SCHED_BATCH<br>
pid 18's current scheduling priority: 0<br>
# xin ưu tiên thời gian thực: bị từ chối khi không có đặc quyền CAP_SYS_NICE (kể cả root trong container mặc định)<br>
$ chrt -f 10 true<br>
chrt: failed to set pid 0's policy: Operation not permitted</div>
<p><code>SCHED_OTHER</code> là chính sách tương tác thường (bộ lập lịch công bằng, CFS từ Linux 2.6.23 năm 2007, được EEVDF thay thế từ Linux 6.6 năm 2023); <code>SCHED_BATCH</code> và <code>SCHED_IDLE</code> dành cho việc lô — ai cũng chọn được (ta vừa làm); <code>SCHED_FIFO</code>, <code>SCHED_RR</code> (ưu tiên 1–99) và <code>SCHED_DEADLINE</code> (Linux 3.14) là thời gian thực — và yêu cầu đó bị từ chối: cần đặc quyền <code>CAP_SYS_NICE</code>, thứ container Docker mặc định không cấp kể cả cho root. Lượng tử của round robin thời gian thực ở đây là 100 ms.</p>
<p class="pitfall">⚠️ FE6#3: "Hệ điều hành lấy thời gian làm tham số then chốt" — hệ <strong>thời gian thực (real-time)</strong>. FE19#32: FCFS ổn với phần lớn hệ <strong>lô (batch)</strong>.</p>`],
      [58, 'Scheduling Algorithm Goals',
        `<p class="y-chinh">🎯 Figure 2-40: goals of the scheduling algorithm. <strong>All systems</strong>: fairness (each process a fair share of the CPU), policy enforcement (the stated policy is carried out), balance (all parts of the system busy). <strong>Batch</strong>: throughput (maximize jobs per hour), turnaround time (minimize time between submission and termination), CPU utilization (keep the CPU busy all the time). <strong>Interactive</strong>: response time (respond to requests quickly), proportionality (meet users' expectations). <strong>Real time</strong>: meeting deadlines (avoid losing data), predictability (avoid quality degradation in multimedia).</p>
<p>The definitions the FE tests: <strong>throughput</strong> = jobs completed per unit of time; <strong>turnaround time</strong> = from submission to completion (= completion − arrival); <strong>waiting time</strong> = time spent ready but not running (= turnaround − burst); <strong>response time</strong> = from a request to the first response. The goals conflict: maximizing throughput may favour short jobs and give long ones a terrible turnaround; and CPU utilization alone is a poor metric — a car going 5000 rpm says nothing about where it is going. <strong>Proportionality</strong>: users expect "simple" things (connecting to a server, closing a window) to be fast and accept that "complex" ones take time.</p>
<p>➕ In the backend world these become your service-level objectives: <em>throughput</em> = requests per second, <em>response time</em> = latency, usually measured as the 95th or 99th percentile (p95, p99) rather than the average, because users feel the slow tail; and Linux's <code>SCHED_OTHER</code> fairness is "fairness" in this table.</p>
<p class="pitfall">⚠️ FE2#5 / FE9#12: "The interval from submission of a process to its completion" — <strong>turnaround time</strong>. FE6#7: "maximize the number of jobs completed per hour" — <strong>throughput</strong>. FE26#17: "Which is NOT a goal for batch systems?" — <strong>response time</strong> (it is an interactive goal).</p>`,
        `<p class="y-chinh">🎯 Hình 2-40: các mục tiêu của thuật toán lập lịch. <strong>Mọi hệ thống</strong>: công bằng (mỗi tiến trình một phần CPU công bằng), thực thi chính sách (chính sách đã nêu được thực hiện), cân bằng (mọi bộ phận của hệ thống đều bận). <strong>Hệ lô</strong>: thông lượng (tối đa số job mỗi giờ), thời gian hoàn thành (tối thiểu thời gian từ lúc nộp tới lúc kết thúc), hiệu suất CPU (giữ CPU luôn bận). <strong>Hệ tương tác</strong>: thời gian đáp ứng (trả lời yêu cầu nhanh), tính tương xứng (đáp ứng kỳ vọng của người dùng). <strong>Thời gian thực</strong>: kịp hạn chót (tránh mất dữ liệu), tính dự đoán được (tránh giảm chất lượng ở đa phương tiện).</p>
<p>Các định nghĩa FE hỏi: <strong>thông lượng (throughput)</strong> = số job xong trong một đơn vị thời gian; <strong>thời gian hoàn thành (turnaround)</strong> = từ lúc nộp tới lúc xong (= thời điểm xong − thời điểm đến); <strong>thời gian chờ (waiting)</strong> = thời gian sẵn sàng mà không được chạy (= hoàn thành − thời gian chạy); <strong>thời gian đáp ứng (response)</strong> = từ lúc có yêu cầu tới phản hồi đầu tiên. Các mục tiêu mâu thuẫn nhau: tối đa thông lượng có thể ưu ái job ngắn và để job dài có thời gian hoàn thành tệ hại; và riêng hiệu suất CPU là thước đo kém — xe chạy 5000 vòng/phút không nói gì về chuyện nó đang đi đâu. <strong>Tính tương xứng</strong>: người dùng mong việc "đơn giản" (kết nối máy chủ, đóng cửa sổ) phải nhanh và chấp nhận việc "phức tạp" mất thời gian.</p>
<p>➕ Trong thế giới backend chúng thành các mục tiêu mức dịch vụ (SLO): <em>thông lượng</em> = số yêu cầu mỗi giây, <em>thời gian đáp ứng</em> = độ trễ, thường đo bằng phân vị 95 hoặc 99 (p95, p99) thay vì trung bình, vì người dùng cảm nhận cái đuôi chậm; còn sự công bằng của <code>SCHED_OTHER</code> trong Linux chính là "fairness" trong bảng này.</p>
<p class="pitfall">⚠️ FE2#5 / FE9#12: "Khoảng thời gian từ lúc nộp tiến trình tới lúc hoàn tất" — <strong>turnaround time</strong>. FE6#7: "tối đa số job hoàn thành mỗi giờ" — <strong>throughput</strong>. FE26#17: "Đâu KHÔNG phải mục tiêu của hệ lô?" — <strong>response time</strong> (đó là mục tiêu tương tác).</p>`],
      [59, 'Scheduling in Batch Systems',
        `<p class="y-chinh">🎯 Three batch algorithms: <strong>First-Come First-Served</strong> (FCFS), <strong>Shortest Job First</strong> (SJF), <strong>Shortest Remaining Time Next</strong> (SRTN).</p>
<p><strong>FCFS</strong> (nonpreemptive): processes get the CPU in the order they request it, one ready queue; a running job runs until it finishes or blocks. Easy to understand and to program — and it suffers the <strong>convoy effect</strong>: short jobs stuck behind a long one. <strong>SJF</strong> (nonpreemptive): when the CPU is free, pick the ready job with the shortest run time — it needs the run times in advance (batch jobs often have estimates). <strong>SRTN</strong> (also called SRTF, <strong>preemptive</strong> SJF): always run the job whose <em>remaining</em> time is shortest; when a new job arrives with a shorter time than what remains of the current one, the current one is suspended.</p>
<p>➕ The four-job set of several real FE questions (A 0/8, B 1/4, C 2/9, D 3/5 as arrival/burst), first FCFS, then SRTN, computed by the simulator (the course's tie-breaking rules are written in <code>_thuat-toan/lap-lich.mjs</code>: ties go to the earlier arrival, and SRTN only preempts when the newcomer is strictly shorter):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/0fdef75229230e1cd09a4a10b64f5ed86a270fc5.svg" alt="FCFS on the FE17 data: B waits 7 behind the long job A" loading="lazy" /><p class="chu-thich">🧮 FCFS on the FE17 data: B waits 7 behind the long job A</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>First run</th><th>Completion</th><th>Turnaround = completion − arrival</th><th>Waiting = turnaround − burst</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>8</td><td>0</td><td>8</td><td>8</td><td>0</td></tr>
<tr><td>B</td><td>1</td><td>4</td><td>8</td><td>12</td><td>11</td><td>7</td></tr>
<tr><td>C</td><td>2</td><td>9</td><td>12</td><td>21</td><td>19</td><td>10</td></tr>
<tr><td>D</td><td>3</td><td>5</td><td>21</td><td>26</td><td>23</td><td>18</td></tr>
<tr><td colspan="5"><strong>Average</strong></td><td><strong>15.25</strong></td><td><strong>8.75</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 0, chay: 4 }, { ten: 'C', den: 0, chay: 4 }, { ten: 'D', den: 0, chay: 4 }],
  fe17: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 1, chay: 4 }, { ten: 'C', den: 2, chay: 9 }, { ten: 'D', den: 3, chay: 5 }],
  fe19: [[8, 3], [6, 5], [2, 2], [10, 1], [4, 4]].map(([chay, p], i) =&gt; ({ ten: 'ABCDE'[i], den: 0, chay, uuTien: 6 - p, p })),
  fe9: [10, 1, 2, 4, 5].map((chay, i) =&gt; ({ ten: &#96;P&#36;{i + 1}&#96;, den: 0, chay })),
  fe25: [{ ten: 'A', den: 0, chay: 5 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 4 }],
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5bd7ee646faddbc7fb899f55c1e9d967828fcff5.svg" alt="SRTN on the same data: B preempts A at t = 1; average waiting drops to 6.5" loading="lazy" /><p class="chu-thich">🧮 SRTN on the same data: B preempts A at t = 1; average waiting drops to 6.5</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>First run</th><th>Completion</th><th>Turnaround = completion − arrival</th><th>Waiting = turnaround − burst</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>8</td><td>0</td><td>17</td><td>17</td><td>9</td></tr>
<tr><td>B</td><td>1</td><td>4</td><td>1</td><td>5</td><td>4</td><td>0</td></tr>
<tr><td>C</td><td>2</td><td>9</td><td>17</td><td>26</td><td>24</td><td>15</td></tr>
<tr><td>D</td><td>3</td><td>5</td><td>5</td><td>10</td><td>7</td><td>2</td></tr>
<tr><td colspan="5"><strong>Average</strong></td><td><strong>13</strong></td><td><strong>6.5</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 0, chay: 4 }, { ten: 'C', den: 0, chay: 4 }, { ten: 'D', den: 0, chay: 4 }],
  fe17: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 1, chay: 4 }, { ten: 'C', den: 2, chay: 9 }, { ten: 'D', den: 3, chay: 5 }],
  fe19: [[8, 3], [6, 5], [2, 2], [10, 1], [4, 4]].map(([chay, p], i) =&gt; ({ ten: 'ABCDE'[i], den: 0, chay, uuTien: 6 - p, p })),
  fe9: [10, 1, 2, 4, 5].map((chay, i) =&gt; ({ ten: &#96;P&#36;{i + 1}&#96;, den: 0, chay })),
  fe25: [{ ten: 'A', den: 0, chay: 5 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 4 }],
};</code></pre></details>
<p>Average waiting 8.75 with FCFS, 6.5 with SRTN (this is also the textbook example of Silberschatz, whose published answer is 6.5). Note how in SRTN the long job C waits until everybody else is done: preemptive shortest-first can <strong>starve</strong> long jobs if short ones keep arriving.</p>
<p class="pitfall">⚠️ FE5#15 / FE8#13 / FE9#13 / FE12#13: "A preemptive version of SJF is" — <strong>Shortest Remaining Time Next</strong>. FE6#13: "not a batch algorithm" — <strong>Round-Robin</strong>. FE9#9: "nonpreemptive, CPU in the order requested" — <strong>FCFS</strong>. FE24#50's answer key marks "Shortest Job First" as preemptive — wrong for the book's SJF, which is nonpreemptive; the correct pair is SRTN and Round Robin (as in FE23#18).</p>`,
        `<p class="y-chinh">🎯 Ba thuật toán cho hệ lô: <strong>First-Come First-Served</strong> (FCFS — đến trước phục vụ trước), <strong>Shortest Job First</strong> (SJF — việc ngắn nhất trước), <strong>Shortest Remaining Time Next</strong> (SRTN — thời gian còn lại ngắn nhất kế tiếp).</p>
<p><strong>FCFS</strong> (không chiếm quyền): tiến trình được CPU theo thứ tự yêu cầu, một hàng đợi sẵn sàng; job đang chạy chạy tới khi xong hoặc bị chặn. Dễ hiểu, dễ lập trình — và bị <strong>hiệu ứng đoàn xe (convoy effect)</strong>: job ngắn kẹt sau job dài. <strong>SJF</strong> (không chiếm quyền): khi CPU rảnh, chọn job sẵn sàng có thời gian chạy ngắn nhất — cần biết trước thời gian chạy (job lô thường có ước lượng). <strong>SRTN</strong> (còn gọi SRTF, SJF <strong>có chiếm quyền</strong>): luôn chạy job có thời gian <em>còn lại</em> ngắn nhất; khi một job mới tới với thời gian ngắn hơn phần còn lại của job đang chạy, job đang chạy bị tạm dừng.</p>
<p>➕ Bộ bốn job của nhiều câu FE thật (A 0/8, B 1/4, C 2/9, D 3/5 dạng đến/chạy), trước là FCFS, sau là SRTN, do bộ mô phỏng tính (quy ước hoà của môn ghi trong <code>_thuat-toan/lap-lich.mjs</code>: hoà thì ai đến trước được trước, và SRTN chỉ chiếm quyền khi job mới tới ngắn hơn hẳn):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d0e3b1e312cf1c66903e2d283feaab942af2dffd.svg" alt="FCFS với dữ liệu FE17: B chờ 7 sau job dài A" loading="lazy" /><p class="chu-thich">🧮 FCFS với dữ liệu FE17: B chờ 7 sau job dài A</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Lần đầu chạy</th><th>Xong</th><th>Hoàn thành = xong − đến</th><th>Chờ = hoàn thành − chạy</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>8</td><td>0</td><td>8</td><td>8</td><td>0</td></tr>
<tr><td>B</td><td>1</td><td>4</td><td>8</td><td>12</td><td>11</td><td>7</td></tr>
<tr><td>C</td><td>2</td><td>9</td><td>12</td><td>21</td><td>19</td><td>10</td></tr>
<tr><td>D</td><td>3</td><td>5</td><td>21</td><td>26</td><td>23</td><td>18</td></tr>
<tr><td colspan="5"><strong>Trung bình</strong></td><td><strong>15.25</strong></td><td><strong>8.75</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 0, chay: 4 }, { ten: 'C', den: 0, chay: 4 }, { ten: 'D', den: 0, chay: 4 }],
  fe17: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 1, chay: 4 }, { ten: 'C', den: 2, chay: 9 }, { ten: 'D', den: 3, chay: 5 }],
  fe19: [[8, 3], [6, 5], [2, 2], [10, 1], [4, 4]].map(([chay, p], i) =&gt; ({ ten: 'ABCDE'[i], den: 0, chay, uuTien: 6 - p, p })),
  fe9: [10, 1, 2, 4, 5].map((chay, i) =&gt; ({ ten: &#96;P&#36;{i + 1}&#96;, den: 0, chay })),
  fe25: [{ ten: 'A', den: 0, chay: 5 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 4 }],
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fadbf48c29f5c76f57de52717bf297ec3c3a809f.svg" alt="SRTN với cùng dữ liệu: B chiếm quyền của A lúc t = 1; chờ trung bình giảm còn 6,5" loading="lazy" /><p class="chu-thich">🧮 SRTN với cùng dữ liệu: B chiếm quyền của A lúc t = 1; chờ trung bình giảm còn 6,5</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Lần đầu chạy</th><th>Xong</th><th>Hoàn thành = xong − đến</th><th>Chờ = hoàn thành − chạy</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>8</td><td>0</td><td>17</td><td>17</td><td>9</td></tr>
<tr><td>B</td><td>1</td><td>4</td><td>1</td><td>5</td><td>4</td><td>0</td></tr>
<tr><td>C</td><td>2</td><td>9</td><td>17</td><td>26</td><td>24</td><td>15</td></tr>
<tr><td>D</td><td>3</td><td>5</td><td>5</td><td>10</td><td>7</td><td>2</td></tr>
<tr><td colspan="5"><strong>Trung bình</strong></td><td><strong>13</strong></td><td><strong>6.5</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 0, chay: 4 }, { ten: 'C', den: 0, chay: 4 }, { ten: 'D', den: 0, chay: 4 }],
  fe17: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 1, chay: 4 }, { ten: 'C', den: 2, chay: 9 }, { ten: 'D', den: 3, chay: 5 }],
  fe19: [[8, 3], [6, 5], [2, 2], [10, 1], [4, 4]].map(([chay, p], i) =&gt; ({ ten: 'ABCDE'[i], den: 0, chay, uuTien: 6 - p, p })),
  fe9: [10, 1, 2, 4, 5].map((chay, i) =&gt; ({ ten: &#96;P&#36;{i + 1}&#96;, den: 0, chay })),
  fe25: [{ ten: 'A', den: 0, chay: 5 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 4 }],
};</code></pre></details>
<p>Chờ trung bình 8,75 với FCFS, 6,5 với SRTN (đây cũng là ví dụ giáo khoa của Silberschatz, đáp án công bố là 6,5). Để ý trong SRTN job dài C phải chờ tới khi mọi người khác xong: ngắn-nhất-trước có chiếm quyền có thể <strong>bỏ đói (starve)</strong> job dài nếu job ngắn cứ tới liên tục.</p>
<p class="pitfall">⚠️ FE5#15 / FE8#13 / FE9#13 / FE12#13: "Phiên bản chiếm quyền của SJF là" — <strong>Shortest Remaining Time Next</strong>. FE6#13: "không phải thuật toán hệ lô" — <strong>Round-Robin</strong>. FE9#9: "không chiếm quyền, CPU theo thứ tự yêu cầu" — <strong>FCFS</strong>. Đáp án của FE24#50 đánh dấu "Shortest Job First" là có chiếm quyền — sai với SJF của sách, vốn không chiếm quyền; cặp đúng là SRTN và Round Robin (như FE23#18).</p>`],
      [60, 'Shortest Job First',
        `<p class="y-chinh">🎯 Figure 2-41: four jobs A (8), B (4), C (4), D (4), all available at time 0. (a) In the original order A, B, C, D; (b) in shortest-job-first order B, C, D, A.</p>
<p>The book's arithmetic, done by the simulator. In order (a), the turnaround times are 8, 12, 16 and 20 minutes — average 14. In SJF order (b) they are 4, 8, 12 and 20 — average 11:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a17a2bc9cb108c3df38637eeb23f8c472bb31a30.svg" alt="Figure 2-41(a): original order, average turnaround 14" loading="lazy" /><p class="chu-thich">🧮 Figure 2-41(a): original order, average turnaround 14</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>First run</th><th>Completion</th><th>Turnaround = completion − arrival</th><th>Waiting = turnaround − burst</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>8</td><td>0</td><td>8</td><td>8</td><td>0</td></tr>
<tr><td>B</td><td>0</td><td>4</td><td>8</td><td>12</td><td>12</td><td>8</td></tr>
<tr><td>C</td><td>0</td><td>4</td><td>12</td><td>16</td><td>16</td><td>12</td></tr>
<tr><td>D</td><td>0</td><td>4</td><td>16</td><td>20</td><td>20</td><td>16</td></tr>
<tr><td colspan="5"><strong>Average</strong></td><td><strong>14</strong></td><td><strong>9</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 0, chay: 4 }, { ten: 'C', den: 0, chay: 4 }, { ten: 'D', den: 0, chay: 4 }],
  fe17: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 1, chay: 4 }, { ten: 'C', den: 2, chay: 9 }, { ten: 'D', den: 3, chay: 5 }],
  fe19: [[8, 3], [6, 5], [2, 2], [10, 1], [4, 4]].map(([chay, p], i) =&gt; ({ ten: 'ABCDE'[i], den: 0, chay, uuTien: 6 - p, p })),
  fe9: [10, 1, 2, 4, 5].map((chay, i) =&gt; ({ ten: &#96;P&#36;{i + 1}&#96;, den: 0, chay })),
  fe25: [{ ten: 'A', den: 0, chay: 5 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 4 }],
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/2445be75ad060919f75969314e0494f6b171b9b5.svg" alt="Figure 2-41(b): shortest job first, average turnaround 11" loading="lazy" /><p class="chu-thich">🧮 Figure 2-41(b): shortest job first, average turnaround 11</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>First run</th><th>Completion</th><th>Turnaround = completion − arrival</th><th>Waiting = turnaround − burst</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>8</td><td>12</td><td>20</td><td>20</td><td>12</td></tr>
<tr><td>B</td><td>0</td><td>4</td><td>0</td><td>4</td><td>4</td><td>0</td></tr>
<tr><td>C</td><td>0</td><td>4</td><td>4</td><td>8</td><td>8</td><td>4</td></tr>
<tr><td>D</td><td>0</td><td>4</td><td>8</td><td>12</td><td>12</td><td>8</td></tr>
<tr><td colspan="5"><strong>Average</strong></td><td><strong>11</strong></td><td><strong>6</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 0, chay: 4 }, { ten: 'C', den: 0, chay: 4 }, { ten: 'D', den: 0, chay: 4 }],
  fe17: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 1, chay: 4 }, { ten: 'C', den: 2, chay: 9 }, { ten: 'D', den: 3, chay: 5 }],
  fe19: [[8, 3], [6, 5], [2, 2], [10, 1], [4, 4]].map(([chay, p], i) =&gt; ({ ten: 'ABCDE'[i], den: 0, chay, uuTien: 6 - p, p })),
  fe9: [10, 1, 2, 4, 5].map((chay, i) =&gt; ({ ten: &#96;P&#36;{i + 1}&#96;, den: 0, chay })),
  fe25: [{ ten: 'A', den: 0, chay: 5 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 4 }],
};</code></pre></details>
<p>➕ Why SJF is optimal <em>when all jobs are available at the same time</em>: with four jobs of run times a, b, c, d run in that order, the first finishes at a, the second at a + b, and so on, so the average turnaround is (4a + 3b + 2c + d) / 4. The first job counts four times, the last only once — so the shortest job should go first, the next shortest second, and so on. The proof breaks when jobs arrive at different times: the book's counterexample has A–E with run times 2, 4, 1, 1, 1 arriving at 0, 0, 3, 3, 3 — SJF runs A, B, C, D, E (average wait 4.6) while B, C, D, E, A gives 4.4. FE questions also use the all-at-zero case:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e17f78b2be15d4a4d332bc5e6a32d206e002c841.svg" alt="FE9#16: five processes all at time 0, SJF average waiting 4.6" loading="lazy" /><p class="chu-thich">🧮 FE9#16: five processes all at time 0, SJF average waiting 4.6</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>First run</th><th>Completion</th><th>Turnaround = completion − arrival</th><th>Waiting = turnaround − burst</th></tr></thead>
<tbody>
<tr><td>P1</td><td>0</td><td>10</td><td>12</td><td>22</td><td>22</td><td>12</td></tr>
<tr><td>P2</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>P3</td><td>0</td><td>2</td><td>1</td><td>3</td><td>3</td><td>1</td></tr>
<tr><td>P4</td><td>0</td><td>4</td><td>3</td><td>7</td><td>7</td><td>3</td></tr>
<tr><td>P5</td><td>0</td><td>5</td><td>7</td><td>12</td><td>12</td><td>7</td></tr>
<tr><td colspan="5"><strong>Average</strong></td><td><strong>9</strong></td><td><strong>4.6</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 0, chay: 4 }, { ten: 'C', den: 0, chay: 4 }, { ten: 'D', den: 0, chay: 4 }],
  fe17: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 1, chay: 4 }, { ten: 'C', den: 2, chay: 9 }, { ten: 'D', den: 3, chay: 5 }],
  fe19: [[8, 3], [6, 5], [2, 2], [10, 1], [4, 4]].map(([chay, p], i) =&gt; ({ ten: 'ABCDE'[i], den: 0, chay, uuTien: 6 - p, p })),
  fe9: [10, 1, 2, 4, 5].map((chay, i) =&gt; ({ ten: &#96;P&#36;{i + 1}&#96;, den: 0, chay })),
  fe25: [{ ten: 'A', den: 0, chay: 5 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 4 }],
};</code></pre></details>
<p class="pitfall">⚠️ FE20#3 / FE21#42: "Which is correct about SJF?" — <strong>minimizes average waiting time</strong>; it does NOT avoid starvation. Turnaround vs waiting: in (b), waiting = turnaround − burst = 0, 4, 8, 12 (average 6). Read which one the question asks.</p>`,
        `<p class="y-chinh">🎯 Hình 2-41: bốn job A (8), B (4), C (4), D (4), cùng có mặt lúc 0. (a) Theo thứ tự ban đầu A, B, C, D; (b) theo thứ tự việc ngắn nhất trước B, C, D, A.</p>
<p>Phép tính của sách, do bộ mô phỏng làm. Ở thứ tự (a), thời gian hoàn thành là 8, 12, 16 và 20 phút — trung bình 14. Ở thứ tự SJF (b) là 4, 8, 12 và 20 — trung bình 11:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7bdd324bed4bbdbb3ccb2f8136f8f6c82472653b.svg" alt="Hình 2-41(a): thứ tự ban đầu, hoàn thành trung bình 14" loading="lazy" /><p class="chu-thich">🧮 Hình 2-41(a): thứ tự ban đầu, hoàn thành trung bình 14</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Lần đầu chạy</th><th>Xong</th><th>Hoàn thành = xong − đến</th><th>Chờ = hoàn thành − chạy</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>8</td><td>0</td><td>8</td><td>8</td><td>0</td></tr>
<tr><td>B</td><td>0</td><td>4</td><td>8</td><td>12</td><td>12</td><td>8</td></tr>
<tr><td>C</td><td>0</td><td>4</td><td>12</td><td>16</td><td>16</td><td>12</td></tr>
<tr><td>D</td><td>0</td><td>4</td><td>16</td><td>20</td><td>20</td><td>16</td></tr>
<tr><td colspan="5"><strong>Trung bình</strong></td><td><strong>14</strong></td><td><strong>9</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 0, chay: 4 }, { ten: 'C', den: 0, chay: 4 }, { ten: 'D', den: 0, chay: 4 }],
  fe17: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 1, chay: 4 }, { ten: 'C', den: 2, chay: 9 }, { ten: 'D', den: 3, chay: 5 }],
  fe19: [[8, 3], [6, 5], [2, 2], [10, 1], [4, 4]].map(([chay, p], i) =&gt; ({ ten: 'ABCDE'[i], den: 0, chay, uuTien: 6 - p, p })),
  fe9: [10, 1, 2, 4, 5].map((chay, i) =&gt; ({ ten: &#96;P&#36;{i + 1}&#96;, den: 0, chay })),
  fe25: [{ ten: 'A', den: 0, chay: 5 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 4 }],
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/760e9a2dee7717dcf7a4e6d05db05a8f965327c4.svg" alt="Hình 2-41(b): việc ngắn nhất trước, hoàn thành trung bình 11" loading="lazy" /><p class="chu-thich">🧮 Hình 2-41(b): việc ngắn nhất trước, hoàn thành trung bình 11</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Lần đầu chạy</th><th>Xong</th><th>Hoàn thành = xong − đến</th><th>Chờ = hoàn thành − chạy</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>8</td><td>12</td><td>20</td><td>20</td><td>12</td></tr>
<tr><td>B</td><td>0</td><td>4</td><td>0</td><td>4</td><td>4</td><td>0</td></tr>
<tr><td>C</td><td>0</td><td>4</td><td>4</td><td>8</td><td>8</td><td>4</td></tr>
<tr><td>D</td><td>0</td><td>4</td><td>8</td><td>12</td><td>12</td><td>8</td></tr>
<tr><td colspan="5"><strong>Trung bình</strong></td><td><strong>11</strong></td><td><strong>6</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 0, chay: 4 }, { ten: 'C', den: 0, chay: 4 }, { ten: 'D', den: 0, chay: 4 }],
  fe17: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 1, chay: 4 }, { ten: 'C', den: 2, chay: 9 }, { ten: 'D', den: 3, chay: 5 }],
  fe19: [[8, 3], [6, 5], [2, 2], [10, 1], [4, 4]].map(([chay, p], i) =&gt; ({ ten: 'ABCDE'[i], den: 0, chay, uuTien: 6 - p, p })),
  fe9: [10, 1, 2, 4, 5].map((chay, i) =&gt; ({ ten: &#96;P&#36;{i + 1}&#96;, den: 0, chay })),
  fe25: [{ ten: 'A', den: 0, chay: 5 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 4 }],
};</code></pre></details>
<p>➕ Vì sao SJF tối ưu <em>khi mọi job có mặt cùng lúc</em>: với bốn job có thời gian chạy a, b, c, d chạy theo thứ tự đó, job đầu xong lúc a, job thứ hai lúc a + b, v.v., nên thời gian hoàn thành trung bình là (4a + 3b + 2c + d) / 4. Job đầu được tính bốn lần, job cuối chỉ một lần — nên job ngắn nhất phải đi trước, job ngắn nhì đi thứ hai, cứ thế. Chứng minh này gãy khi các job tới vào những lúc khác nhau: phản ví dụ của sách có A–E với thời gian chạy 2, 4, 1, 1, 1 tới lúc 0, 0, 3, 3, 3 — SJF chạy A, B, C, D, E (chờ trung bình 4,6) trong khi B, C, D, E, A cho 4,4. Câu FE cũng dùng trường hợp cùng tới lúc 0:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f7c54d11f9be58179dd0a0773e5662a4c4d89a87.svg" alt="FE9#16: năm tiến trình cùng tới lúc 0, SJF chờ trung bình 4,6" loading="lazy" /><p class="chu-thich">🧮 FE9#16: năm tiến trình cùng tới lúc 0, SJF chờ trung bình 4,6</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Lần đầu chạy</th><th>Xong</th><th>Hoàn thành = xong − đến</th><th>Chờ = hoàn thành − chạy</th></tr></thead>
<tbody>
<tr><td>P1</td><td>0</td><td>10</td><td>12</td><td>22</td><td>22</td><td>12</td></tr>
<tr><td>P2</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>P3</td><td>0</td><td>2</td><td>1</td><td>3</td><td>3</td><td>1</td></tr>
<tr><td>P4</td><td>0</td><td>4</td><td>3</td><td>7</td><td>7</td><td>3</td></tr>
<tr><td>P5</td><td>0</td><td>5</td><td>7</td><td>12</td><td>12</td><td>7</td></tr>
<tr><td colspan="5"><strong>Trung bình</strong></td><td><strong>9</strong></td><td><strong>4.6</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 0, chay: 4 }, { ten: 'C', den: 0, chay: 4 }, { ten: 'D', den: 0, chay: 4 }],
  fe17: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 1, chay: 4 }, { ten: 'C', den: 2, chay: 9 }, { ten: 'D', den: 3, chay: 5 }],
  fe19: [[8, 3], [6, 5], [2, 2], [10, 1], [4, 4]].map(([chay, p], i) =&gt; ({ ten: 'ABCDE'[i], den: 0, chay, uuTien: 6 - p, p })),
  fe9: [10, 1, 2, 4, 5].map((chay, i) =&gt; ({ ten: &#96;P&#36;{i + 1}&#96;, den: 0, chay })),
  fe25: [{ ten: 'A', den: 0, chay: 5 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 4 }],
};</code></pre></details>
<p class="pitfall">⚠️ FE20#3 / FE21#42: "Phát biểu nào đúng về SJF?" — <strong>tối thiểu thời gian chờ trung bình</strong>; nó KHÔNG tránh được bỏ đói. Hoàn thành khác chờ: ở (b), chờ = hoàn thành − chạy = 0, 4, 8, 12 (trung bình 6). Đọc kỹ đề hỏi cái nào.</p>`],
      [61, 'Scheduling in Interactive Systems',
        `<p class="y-chinh">🎯 Seven algorithms for interactive systems: <strong>Round-Robin</strong>, <strong>Priority</strong>, <strong>Multiple Queues</strong>, <strong>Shortest Process Next</strong>, <strong>Guaranteed</strong>, <strong>Lottery</strong>, <strong>Fair-Share</strong> scheduling.</p>
<p>Round robin and priority have their own slides (62–63). <strong>Multiple queues</strong> (CTSS, 1962): priority classes where lower classes get longer quanta — a process that uses up its quantum moves down a class, so CPU-bound jobs sink and get fewer but longer turns (the ancestor of MLFQ, old lesson 2.4). <strong>Shortest Process Next</strong> applies SJF to interactive commands by <em>estimating</em> the next burst from past ones with <strong>aging</strong>: estimate = a·T<sub>last</sub> + (1 − a)·estimate; with a = 1/2 the successive estimates are T0, T0/2 + T1/2, T0/4 + T1/4 + T2/2, … — old measurements fade by half at each step:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/2ecccd39b23db2d296a57ff66b25d39a1c9308ec.svg" alt="Aging with a = 1/2: the estimate follows the measured bursts with a delay, and adapts when the process changes behaviour" loading="lazy" /><p class="chu-thich">🧮 Aging with a = 1/2: the estimate follows the measured bursts with a delay, and adapts when the process changes behaviour</p></div>
<table>
<thead><tr><th>Burst i</th><th>Guess before it</th><th>Measured T<sub>i</sub></th><th>New guess = T/2 + old/2</th></tr></thead>
<tbody>
<tr><td>0</td><td>10</td><td>10</td><td>10</td></tr>
<tr><td>1</td><td>10</td><td>6</td><td>8</td></tr>
<tr><td>2</td><td>8</td><td>4</td><td>6</td></tr>
<tr><td>3</td><td>6</td><td>6</td><td>6</td></tr>
<tr><td>4</td><td>6</td><td>4</td><td>5</td></tr>
<tr><td>5</td><td>5</td><td>13</td><td>9</td></tr>
<tr><td>6</td><td>9</td><td>13</td><td>11</td></tr>
<tr><td>7</td><td>11</td><td>13</td><td>12</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const A = 0.5;
const DO = [10, 6, 4, 6, 4, 13, 13, 13];        // measured CPU bursts T0, T1, ...
function uocLuong(ds, a, dau) {
  const uoc = [dau];                             // uoc[i] = guess made BEFORE burst i
  for (const T of ds) uoc.push(a * T + (1 - a) * uoc[uoc.length - 1]);
  return uoc;
}</code></pre></details>
<p><strong>Guaranteed</strong>: promise each of n users 1/n of the CPU, compute the ratio "CPU actually received / CPU entitled" and run the process with the lowest ratio. <strong>Lottery</strong> (Waldspurger &amp; Weihl, 1994): give processes lottery tickets for resources, draw a ticket at each scheduling decision; a process holding 20% of the tickets gets about 20% of the CPU, and cooperating processes can hand tickets to each other. <strong>Fair-share</strong>: share the CPU per <em>user</em>, not per process — a user with 9 processes should not get 9 times the CPU of a user with 1.</p>
<p class="pitfall">⚠️ FE19#19 / FE23#32: "Detecting starvation by tracking how long each job has waited" uses the concept of <strong>aging</strong>. (Aging in priority scheduling = raising the priority of a process the longer it waits; in SPN = the averaging technique above — same word, same idea of "time changes the weight".)</p>`,
        `<p class="y-chinh">🎯 Bảy thuật toán cho hệ tương tác: <strong>Round-Robin</strong> (xoay vòng), <strong>Priority</strong> (ưu tiên), <strong>Multiple Queues</strong> (nhiều hàng đợi), <strong>Shortest Process Next</strong> (tiến trình ngắn nhất kế tiếp), <strong>Guaranteed</strong> (bảo đảm), <strong>Lottery</strong> (xổ số), <strong>Fair-Share</strong> (chia phần công bằng).</p>
<p>Round robin và ưu tiên có slide riêng (62–63). <strong>Nhiều hàng đợi</strong> (CTSS, 1962): các lớp ưu tiên trong đó lớp thấp hơn được lượng tử dài hơn — tiến trình dùng hết lượng tử thì tụt xuống một lớp, nên job nặng CPU chìm dần và được ít lượt hơn nhưng dài hơn (tổ tiên của MLFQ, bài cũ 2.4). <strong>Tiến trình ngắn nhất kế tiếp</strong> áp SJF cho các lệnh tương tác bằng cách <em>ước lượng</em> đợt kế tiếp từ các đợt trước bằng <strong>lão hoá (aging)</strong>: ước lượng = a·T<sub>vừa đo</sub> + (1 − a)·ước lượng cũ; với a = 1/2 các ước lượng lần lượt là T0, T0/2 + T1/2, T0/4 + T1/4 + T2/2, … — số đo cũ mờ đi một nửa sau mỗi bước:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/97aec517701af458300dda3ef8f629da56c31120.svg" alt="Lão hoá với a = 1/2: ước lượng bám theo các đợt đo được với độ trễ, và tự điều chỉnh khi tiến trình đổi tính nết" loading="lazy" /><p class="chu-thich">🧮 Lão hoá với a = 1/2: ước lượng bám theo các đợt đo được với độ trễ, và tự điều chỉnh khi tiến trình đổi tính nết</p></div>
<table>
<thead><tr><th>Đợt i</th><th>Ước trước đó</th><th>Đo được T<sub>i</sub></th><th>Ước mới = T/2 + cũ/2</th></tr></thead>
<tbody>
<tr><td>0</td><td>10</td><td>10</td><td>10</td></tr>
<tr><td>1</td><td>10</td><td>6</td><td>8</td></tr>
<tr><td>2</td><td>8</td><td>4</td><td>6</td></tr>
<tr><td>3</td><td>6</td><td>6</td><td>6</td></tr>
<tr><td>4</td><td>6</td><td>4</td><td>5</td></tr>
<tr><td>5</td><td>5</td><td>13</td><td>9</td></tr>
<tr><td>6</td><td>9</td><td>13</td><td>11</td></tr>
<tr><td>7</td><td>11</td><td>13</td><td>12</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const A = 0.5;
const DO = [10, 6, 4, 6, 4, 13, 13, 13];        // measured CPU bursts T0, T1, ...
function uocLuong(ds, a, dau) {
  const uoc = [dau];                             // uoc[i] = guess made BEFORE burst i
  for (const T of ds) uoc.push(a * T + (1 - a) * uoc[uoc.length - 1]);
  return uoc;
}</code></pre></details>
<p><strong>Bảo đảm</strong>: hứa mỗi người trong n người dùng 1/n CPU, tính tỉ số "CPU thật sự nhận / CPU được hưởng" rồi chạy tiến trình có tỉ số thấp nhất. <strong>Xổ số</strong> (Waldspurger &amp; Weihl, 1994): phát vé số cho tiến trình để giành tài nguyên, mỗi lần lập lịch rút một vé; tiến trình giữ 20% số vé được khoảng 20% CPU, và các tiến trình hợp tác có thể chuyển vé cho nhau. <strong>Chia phần công bằng</strong>: chia CPU theo <em>người dùng</em>, không theo tiến trình — người có 9 tiến trình không được gấp 9 lần CPU so với người chỉ có 1.</p>
<p class="pitfall">⚠️ FE19#19 / FE23#32: "Phát hiện bỏ đói bằng cách theo dõi mỗi job đã chờ bao lâu" là dùng khái niệm <strong>lão hoá (aging)</strong>. (Lão hoá trong lập lịch ưu tiên = tăng độ ưu tiên của tiến trình càng chờ lâu; trong SPN = kỹ thuật lấy trung bình ở trên — cùng một từ, cùng ý "thời gian làm đổi trọng số".)</p>`],
      [62, 'Round-Robin Scheduling',
        `<p class="y-chinh">🎯 Figure 2-42: round robin. (a) The list of runnable processes B, F, D, G, A with B current; (b) after B uses up its <strong>quantum</strong>, it goes to the end of the list: F, D, G, A, B.</p>
<p>Round robin is the oldest, simplest, fairest and most widely used interactive algorithm: each process is assigned a time interval, its <strong>quantum</strong>; if it is still running at the end of the quantum, the CPU is preempted and given to the next process; if it blocks or finishes earlier, the switch happens then. The only interesting parameter is the quantum length, because a process switch costs time. The book's numbers, computed: switch = 1 ms, quantum = 4 ms ⇒ 20% of the CPU wasted; quantum = 100 ms ⇒ 1% wasted, but with 50 runnable users the last one waits about 5 seconds:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b755d41a9f962fdebb1754e261897da883fe33f5.svg" alt="The quantum trades overhead (bar) against the wait of the last process in a queue of 50" loading="lazy" /><p class="chu-thich">🧮 The quantum trades overhead (bar) against the wait of the last process in a queue of 50</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHUYEN = 1;                               // ms per process switch
const NGUOI = 50;                               // runnable processes in the queue
const phi = (q) =&gt; (100 * CHUYEN) / (q + CHUYEN);              // wasted share of the CPU
const choCuoi = (q) =&gt; (NGUOI - 1) * (q + CHUYEN);             // wait of the last one in line, ms
const Q = [1, 4, 10, 20, 50, 100];</code></pre></details>
<p>Too short ⇒ too many switches; too long ⇒ poor response to short interactive requests. The book's conclusion: around 20–50 ms is often a reasonable compromise. ➕ A full round-robin calculation, the FE17/FE21/FE22/FE24 data with quantum 4 (convention: processes arriving during a slice join the queue before the preempted one):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a66b16044e93f8266afab57ae19b2e0a7e2f0342.svg" alt="Round robin, q = 4, on the FE17 data: turnaround A 20, B 7, C 24, D 22 — average 18.25" loading="lazy" /><p class="chu-thich">🧮 Round robin, q = 4, on the FE17 data: turnaround A 20, B 7, C 24, D 22 — average 18.25</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>First run</th><th>Completion</th><th>Turnaround = completion − arrival</th><th>Waiting = turnaround − burst</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>8</td><td>0</td><td>20</td><td>20</td><td>12</td></tr>
<tr><td>B</td><td>1</td><td>4</td><td>4</td><td>8</td><td>7</td><td>3</td></tr>
<tr><td>C</td><td>2</td><td>9</td><td>8</td><td>26</td><td>24</td><td>15</td></tr>
<tr><td>D</td><td>3</td><td>5</td><td>12</td><td>25</td><td>22</td><td>17</td></tr>
<tr><td colspan="5"><strong>Average</strong></td><td><strong>18.25</strong></td><td><strong>11.75</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 0, chay: 4 }, { ten: 'C', den: 0, chay: 4 }, { ten: 'D', den: 0, chay: 4 }],
  fe17: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 1, chay: 4 }, { ten: 'C', den: 2, chay: 9 }, { ten: 'D', den: 3, chay: 5 }],
  fe19: [[8, 3], [6, 5], [2, 2], [10, 1], [4, 4]].map(([chay, p], i) =&gt; ({ ten: 'ABCDE'[i], den: 0, chay, uuTien: 6 - p, p })),
  fe9: [10, 1, 2, 4, 5].map((chay, i) =&gt; ({ ten: &#96;P&#36;{i + 1}&#96;, den: 0, chay })),
  fe25: [{ ten: 'A', den: 0, chay: 5 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 4 }],
};</code></pre></details>
<p>B (4 units) finishes in its first quantum: turnaround 8 − 1 = 7 (FE17#19). A finishes at 20 (FE24#10), D at 25 ⇒ 25 − 3 = 22 (FE21#5); average turnaround (20 + 7 + 24 + 22) / 4 = 18.25 (FE22#46). The bank's answers all match the simulator. Exercise 5 of lesson 2.D and the quiz include more.</p>
<p class="pitfall">⚠️ FE20#31 / FE28#19: the quantum should be long enough that <strong>80%</strong> of CPU bursts finish within it (a rule of thumb from Silberschatz). FE26#14: all three statements (large quantum ⇒ FCFS; small ⇒ low efficiency; 20–50 ms reasonable) are correct, so the "wrong statement" is <strong>None of the other choices</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình 2-42: round robin (xoay vòng). (a) Danh sách tiến trình chạy được B, F, D, G, A với B đang chạy; (b) sau khi B dùng hết <strong>lượng tử (quantum)</strong>, nó về cuối danh sách: F, D, G, A, B.</p>
<p>Round robin là thuật toán tương tác lâu đời nhất, đơn giản nhất, công bằng nhất và được dùng rộng rãi nhất: mỗi tiến trình được giao một khoảng thời gian, gọi là <strong>lượng tử</strong>; nếu hết lượng tử mà nó vẫn chạy, CPU bị lấy lại và giao cho tiến trình kế tiếp; nếu nó bị chặn hoặc xong sớm hơn, việc chuyển xảy ra lúc đó. Tham số đáng bàn duy nhất là độ dài lượng tử, vì chuyển tiến trình tốn thời gian. Số của sách, máy tính hộ: chuyển = 1 ms, lượng tử = 4 ms ⇒ phí 20% CPU; lượng tử = 100 ms ⇒ chỉ phí 1%, nhưng có 50 người dùng thì người cuối chờ khoảng 5 giây:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/88e9f1a23ac2753181125e9ff1d4770f06ece6b4.svg" alt="Lượng tử đổi chi phí (thanh) lấy thời gian chờ của tiến trình cuối trong hàng 50 người" loading="lazy" /><p class="chu-thich">🧮 Lượng tử đổi chi phí (thanh) lấy thời gian chờ của tiến trình cuối trong hàng 50 người</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHUYEN = 1;                               // ms per process switch
const NGUOI = 50;                               // runnable processes in the queue
const phi = (q) =&gt; (100 * CHUYEN) / (q + CHUYEN);              // wasted share of the CPU
const choCuoi = (q) =&gt; (NGUOI - 1) * (q + CHUYEN);             // wait of the last one in line, ms
const Q = [1, 4, 10, 20, 50, 100];</code></pre></details>
<p>Quá ngắn ⇒ chuyển quá nhiều; quá dài ⇒ đáp ứng kém cho các yêu cầu tương tác ngắn. Kết luận của sách: khoảng 20–50 ms thường là thoả hiệp hợp lý. ➕ Một bài tính round robin trọn vẹn, dữ liệu của FE17/FE21/FE22/FE24 với lượng tử 4 (quy ước: tiến trình tới trong lúc một lát đang chạy vào hàng trước tiến trình vừa bị lấy CPU):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/acabd7111deed02ad119b36eca7d2a5ffd24728b.svg" alt="Round robin, q = 4, dữ liệu FE17: hoàn thành A 20, B 7, C 24, D 22 — trung bình 18,25" loading="lazy" /><p class="chu-thich">🧮 Round robin, q = 4, dữ liệu FE17: hoàn thành A 20, B 7, C 24, D 22 — trung bình 18,25</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Lần đầu chạy</th><th>Xong</th><th>Hoàn thành = xong − đến</th><th>Chờ = hoàn thành − chạy</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>8</td><td>0</td><td>20</td><td>20</td><td>12</td></tr>
<tr><td>B</td><td>1</td><td>4</td><td>4</td><td>8</td><td>7</td><td>3</td></tr>
<tr><td>C</td><td>2</td><td>9</td><td>8</td><td>26</td><td>24</td><td>15</td></tr>
<tr><td>D</td><td>3</td><td>5</td><td>12</td><td>25</td><td>22</td><td>17</td></tr>
<tr><td colspan="5"><strong>Trung bình</strong></td><td><strong>18.25</strong></td><td><strong>11.75</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 0, chay: 4 }, { ten: 'C', den: 0, chay: 4 }, { ten: 'D', den: 0, chay: 4 }],
  fe17: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 1, chay: 4 }, { ten: 'C', den: 2, chay: 9 }, { ten: 'D', den: 3, chay: 5 }],
  fe19: [[8, 3], [6, 5], [2, 2], [10, 1], [4, 4]].map(([chay, p], i) =&gt; ({ ten: 'ABCDE'[i], den: 0, chay, uuTien: 6 - p, p })),
  fe9: [10, 1, 2, 4, 5].map((chay, i) =&gt; ({ ten: &#96;P&#36;{i + 1}&#96;, den: 0, chay })),
  fe25: [{ ten: 'A', den: 0, chay: 5 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 4 }],
};</code></pre></details>
<p>B (4 đơn vị) xong ngay trong lượng tử đầu tiên: hoàn thành 8 − 1 = 7 (FE17#19). A xong lúc 20 (FE24#10), D lúc 25 ⇒ 25 − 3 = 22 (FE21#5); hoàn thành trung bình (20 + 7 + 24 + 22) / 4 = 18,25 (FE22#46). Đáp án ngân hàng đều khớp bộ mô phỏng. Bài tập 5 của bài 2.D và quiz có thêm.</p>
<p class="pitfall">⚠️ FE20#31 / FE28#19: lượng tử nên đủ dài để <strong>80%</strong> số đợt CPU xong gọn trong nó (kinh nghiệm từ Silberschatz). FE26#14: cả ba phát biểu (lượng tử lớn ⇒ thành FCFS; nhỏ ⇒ hiệu suất thấp; 20–50 ms là hợp lý) đều đúng, nên "phát biểu sai" là <strong>None of the other choices</strong>.</p>`],
      [63, 'Priority Scheduling',
        `<p class="y-chinh">🎯 Figure 2-43: a scheduling algorithm with <strong>four priority classes</strong> — queue headers Priority 4 (highest) down to Priority 1 (lowest), each with its list of runnable processes; run the processes of the highest non-empty class round robin, ignore the lower classes while it has work.</p>
<p>Round robin assumes all processes are equally important. <strong>Priority scheduling</strong> gives each process a priority and runs the runnable process with the highest one. Priorities can be <strong>static</strong> (a military example: the general's jobs first) or <strong>dynamic</strong>: the book suggests 1/f, where f is the fraction of its last quantum a process used — a process that used 1 ms of a 50 ms quantum gets priority 50, one that used all 50 ms gets 1, so I/O-bound processes come first. To stop high-priority processes from running forever, the scheduler may lower the running process's priority at each clock tick, or give each a maximum quantum. If lower classes are never served they <strong>starve</strong>; the cure is <strong>aging</strong> — raising the priority of processes that wait long.</p>
<p>➕ A priority calculation from the bank (FE19#45 / FE24#15 / FE29#3): five jobs at time 0 with run times 8, 6, 2, 10, 4 and priorities 3, 5, 2, 1, 4, where <strong>5 is the highest</strong>. (The course simulator uses "smaller number = higher priority" internally, so it converts 6 − p; the table shows the original priorities.)</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f5fc7f5ba33681b73885135333fb7f8b6ed1f125.svg" alt="Priority scheduling, FE19 data: B (5), E (4), A (3), C (2), D (1) — average waiting 10.8" loading="lazy" /><p class="chu-thich">🧮 Priority scheduling, FE19 data: B (5), E (4), A (3), C (2), D (1) — average waiting 10.8</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Priority (5 = highest)</th><th>First run</th><th>Completion</th><th>Turnaround = completion − arrival</th><th>Waiting = turnaround − burst</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>8</td><td>3</td><td>10</td><td>18</td><td>18</td><td>10</td></tr>
<tr><td>B</td><td>0</td><td>6</td><td>5</td><td>0</td><td>6</td><td>6</td><td>0</td></tr>
<tr><td>C</td><td>0</td><td>2</td><td>2</td><td>18</td><td>20</td><td>20</td><td>18</td></tr>
<tr><td>D</td><td>0</td><td>10</td><td>1</td><td>20</td><td>30</td><td>30</td><td>20</td></tr>
<tr><td>E</td><td>0</td><td>4</td><td>4</td><td>6</td><td>10</td><td>10</td><td>6</td></tr>
<tr><td colspan="6"><strong>Average</strong></td><td><strong>16.8</strong></td><td><strong>10.8</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 0, chay: 4 }, { ten: 'C', den: 0, chay: 4 }, { ten: 'D', den: 0, chay: 4 }],
  fe17: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 1, chay: 4 }, { ten: 'C', den: 2, chay: 9 }, { ten: 'D', den: 3, chay: 5 }],
  fe19: [[8, 3], [6, 5], [2, 2], [10, 1], [4, 4]].map(([chay, p], i) =&gt; ({ ten: 'ABCDE'[i], den: 0, chay, uuTien: 6 - p, p })),
  fe9: [10, 1, 2, 4, 5].map((chay, i) =&gt; ({ ten: &#96;P&#36;{i + 1}&#96;, den: 0, chay })),
  fe25: [{ ten: 'A', den: 0, chay: 5 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 4 }],
};</code></pre></details>
<p>And Linux's priorities, measured: two identical CPU hogs on one core, one started with <code>nice -n 10</code> (lower priority):</p>
<div class="out"># Priority scheduling on Linux: two identical CPU hogs on ONE core, one with nice 10<br>
$ taskset -c 0 sh -c 'while :; do :; done' &amp;<br>
$ taskset -c 0 nice -n 10 sh -c 'while :; do :; done' &amp;<br>
$ sleep 3<br>
$ ps -o pid,ni,pcpu,psr,comm -C sh<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;NI %CPU PSR COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;0 89.1 &nbsp;&nbsp;0 sh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 &nbsp;10 &nbsp;9.2 &nbsp;&nbsp;0 sh<br>
$ kill %1 %2<br>
# the weights of the fair scheduler: nice 0 = 1024, nice 10 = 110, so about 1024 / (1024 + 110) = 90% vs 10%</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>About 90% versus 10% — the fair scheduler's weights (1024 for nice 0, 110 for nice 10; man7 sched(7): each nice step is a factor of about 1.25). Unlike Figure 2-43, the low-priority process is not starved: Linux's normal policy gives it a smaller share, never zero.</p>
<p class="pitfall">⚠️ FE3#20: "Which algorithm could potentially lead to starvation?" — <strong>Priority scheduling</strong> (SJF/SRTN too, for long jobs; FCFS and RR never starve). FE5#9: in preemptive priority scheduling, an arriving process's priority is compared with that of the <strong>currently running process</strong>. Always check whether "1" means highest or lowest in the question.</p>`,
        `<p class="y-chinh">🎯 Hình 2-43: một thuật toán lập lịch với <strong>bốn lớp ưu tiên</strong> — các đầu hàng đợi từ Priority 4 (cao nhất) xuống Priority 1 (thấp nhất), mỗi lớp có danh sách tiến trình chạy được; chạy round robin các tiến trình của lớp cao nhất còn việc, bỏ qua các lớp thấp hơn chừng nào lớp đó còn việc.</p>
<p>Round robin giả định mọi tiến trình quan trọng như nhau. <strong>Lập lịch ưu tiên</strong> cho mỗi tiến trình một độ ưu tiên và chạy tiến trình chạy được có ưu tiên cao nhất. Ưu tiên có thể <strong>tĩnh</strong> (ví dụ quân đội: việc của tướng trước) hoặc <strong>động</strong>: sách gợi ý 1/f, với f là tỉ lệ lượng tử gần nhất mà tiến trình đã dùng — tiến trình dùng 1 ms trong lượng tử 50 ms được ưu tiên 50, tiến trình dùng hết 50 ms được 1, nên tiến trình nặng I/O được trước. Để tiến trình ưu tiên cao không chạy mãi, bộ lập lịch có thể hạ ưu tiên của tiến trình đang chạy ở mỗi nhịp đồng hồ, hoặc cho mỗi tiến trình một lượng tử tối đa. Nếu các lớp thấp không bao giờ được phục vụ, chúng bị <strong>bỏ đói (starvation)</strong>; thuốc chữa là <strong>lão hoá (aging)</strong> — tăng ưu tiên cho tiến trình chờ lâu.</p>
<p>➕ Một bài tính ưu tiên từ ngân hàng đề (FE19#45 / FE24#15 / FE29#3): năm job lúc 0 với thời gian chạy 8, 6, 2, 10, 4 và ưu tiên 3, 5, 2, 1, 4, trong đó <strong>5 là cao nhất</strong>. (Bộ mô phỏng của môn dùng quy ước "số nhỏ = ưu tiên cao" bên trong, nên đổi thành 6 − p; bảng hiện ưu tiên gốc.)</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/58b036157fa8a541b4dd28fc94285a292fa0fbe4.svg" alt="Lập lịch ưu tiên, dữ liệu FE19: B (5), E (4), A (3), C (2), D (1) — chờ trung bình 10,8" loading="lazy" /><p class="chu-thich">🧮 Lập lịch ưu tiên, dữ liệu FE19: B (5), E (4), A (3), C (2), D (1) — chờ trung bình 10,8</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Ưu tiên (5 = cao nhất)</th><th>Lần đầu chạy</th><th>Xong</th><th>Hoàn thành = xong − đến</th><th>Chờ = hoàn thành − chạy</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>8</td><td>3</td><td>10</td><td>18</td><td>18</td><td>10</td></tr>
<tr><td>B</td><td>0</td><td>6</td><td>5</td><td>0</td><td>6</td><td>6</td><td>0</td></tr>
<tr><td>C</td><td>0</td><td>2</td><td>2</td><td>18</td><td>20</td><td>20</td><td>18</td></tr>
<tr><td>D</td><td>0</td><td>10</td><td>1</td><td>20</td><td>30</td><td>30</td><td>20</td></tr>
<tr><td>E</td><td>0</td><td>4</td><td>4</td><td>6</td><td>10</td><td>10</td><td>6</td></tr>
<tr><td colspan="6"><strong>Trung bình</strong></td><td><strong>16.8</strong></td><td><strong>10.8</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 0, chay: 4 }, { ten: 'C', den: 0, chay: 4 }, { ten: 'D', den: 0, chay: 4 }],
  fe17: [{ ten: 'A', den: 0, chay: 8 }, { ten: 'B', den: 1, chay: 4 }, { ten: 'C', den: 2, chay: 9 }, { ten: 'D', den: 3, chay: 5 }],
  fe19: [[8, 3], [6, 5], [2, 2], [10, 1], [4, 4]].map(([chay, p], i) =&gt; ({ ten: 'ABCDE'[i], den: 0, chay, uuTien: 6 - p, p })),
  fe9: [10, 1, 2, 4, 5].map((chay, i) =&gt; ({ ten: &#96;P&#36;{i + 1}&#96;, den: 0, chay })),
  fe25: [{ ten: 'A', den: 0, chay: 5 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 4 }],
};</code></pre></details>
<p>Và ưu tiên của Linux, đo thật: hai chương trình ngốn CPU giống hệt nhau trên một lõi, một cái chạy bằng <code>nice -n 10</code> (ưu tiên thấp hơn):</p>
<div class="out"># Lập lịch ưu tiên trên Linux: hai chương trình ngốn CPU giống hệt nhau trên MỘT lõi, một cái nice 10<br>
$ taskset -c 0 sh -c 'while :; do :; done' &amp;<br>
$ taskset -c 0 nice -n 10 sh -c 'while :; do :; done' &amp;<br>
$ sleep 3<br>
$ ps -o pid,ni,pcpu,psr,comm -C sh<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;NI %CPU PSR COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;0 89.1 &nbsp;&nbsp;0 sh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 &nbsp;10 &nbsp;9.2 &nbsp;&nbsp;0 sh<br>
$ kill %1 %2<br>
# trọng số của bộ lập lịch công bằng: nice 0 = 1024, nice 10 = 110, nên khoảng 1024 / (1024 + 110) = 90% và 10%</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Khoảng 90% so với 10% — trọng số của bộ lập lịch công bằng (1024 cho nice 0, 110 cho nice 10; man7 sched(7): mỗi bậc nice khoảng hệ số 1,25). Khác Hình 2-43, tiến trình ưu tiên thấp không bị bỏ đói: chính sách thường của Linux cho nó phần nhỏ hơn, không bao giờ bằng 0.</p>
<p class="pitfall">⚠️ FE3#20: "Thuật toán nào có thể dẫn tới bỏ đói?" — <strong>Priority scheduling</strong> (SJF/SRTN cũng có, với job dài; FCFS và RR không bao giờ bỏ đói). FE5#9: trong lập lịch ưu tiên chiếm quyền, ưu tiên của tiến trình vừa tới được so với ưu tiên của <strong>tiến trình đang chạy</strong>. Luôn xem đề cho "1" là cao nhất hay thấp nhất.</p>`],
      [64, 'Scheduling in Real-Time Systems',
        `<p class="y-chinh">🎯 Real-time scheduling: time plays an essential role. Categories: <strong>hard real time</strong>, <strong>soft real time</strong>; events are <strong>periodic</strong> or <strong>aperiodic</strong>. A set of m periodic events, event i with period P<sub>i</sub> needing C<sub>i</sub> seconds of CPU, is <strong>schedulable</strong> if Σ C<sub>i</sub>/P<sub>i</sub> ≤ 1.</p>
<p>A real-time system must react to external events within a fixed time: a CD player must convert bits to sound on time, an aircraft's autopilot must respond before it is too late. <strong>Hard</strong> real time = deadlines must be met absolutely (missing one is a failure: a car's ABS); <strong>soft</strong> = missing an occasional deadline is undesirable but tolerable (a dropped video frame). Each event needs a fraction C/P of one CPU; if the fractions add up to more than 1, no algorithm can keep up. The book's example: three periodic events with periods 100, 200 and 500 ms needing 50, 30 and 100 ms of CPU: 0.5 + 0.15 + 0.2 = 0.85 ≤ 1 ⇒ schedulable; a fourth event with period 1 second can be added only if it needs at most 150 ms (process-switching overhead ignored).</p>
<p>➕ Computed, and scheduled with <strong>EDF</strong> (earliest deadline first: always run the ready event whose deadline — the end of its period — is closest; preemptive) over the first 500 ms:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/2a41632d9656d41483645f7c53ddefdd7f0c1540.svg" alt="The book's three events: U = 0.85, every deadline met" loading="lazy" /><p class="chu-thich">🧮 The book's three events: U = 0.85, every deadline met</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: [{ ten: 'E1', P: 100, C: 50 }, { ten: 'E2', P: 200, C: 30 }, { ten: 'E3', P: 500, C: 100 }],
  them: [{ ten: 'E1', P: 100, C: 50 }, { ten: 'E2', P: 200, C: 30 }, { ten: 'E3', P: 500, C: 100 }, { ten: 'E4', P: 1000, C: 150 }],
};
const tongU = (ds) =&gt; ds.reduce((s, e) =&gt; s + e.C / e.P, 0);   // schedulable if &lt;= 1
function edf(ds, het, buoc = 10) {
  const viec = [];                                 // jobs: one per period
  for (const e of ds) for (let r = 0; r &lt; het; r += e.P) viec.push({ ten: e.ten, den: r, han: r + e.P, con: e.C, P: e.P });
  const doan = [];
  for (let t = 0; t &lt; het; t += buoc) {
    const san = viec.filter((v) =&gt; v.den &lt;= t &amp;&amp; v.con &gt; 0).sort((a, b) =&gt; a.han - b.han || a.P - b.P);
    const v = san[0];
    if (v) v.con -= buoc;
    const ten = v ? v.ten : null, cuoi = doan[doan.length - 1];
    if (cuoi &amp;&amp; cuoi.ten === ten) cuoi.den = t + buoc; else doan.push({ ten, tu: t, den: t + buoc });
  }
  const tre = viec.filter((v) =&gt; v.han &lt;= het &amp;&amp; v.con &gt; 0).length;   // jobs whose deadline passed unfinished
  return { doan, tre };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ef847d4c8f26e9bfbf989c9f5e9502cc16c7e65b.svg" alt="With the fourth event at its limit (150 ms per second): U = 1, still no deadline missed" loading="lazy" /><p class="chu-thich">🧮 With the fourth event at its limit (150 ms per second): U = 1, still no deadline missed</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: [{ ten: 'E1', P: 100, C: 50 }, { ten: 'E2', P: 200, C: 30 }, { ten: 'E3', P: 500, C: 100 }],
  them: [{ ten: 'E1', P: 100, C: 50 }, { ten: 'E2', P: 200, C: 30 }, { ten: 'E3', P: 500, C: 100 }, { ten: 'E4', P: 1000, C: 150 }],
};
const tongU = (ds) =&gt; ds.reduce((s, e) =&gt; s + e.C / e.P, 0);   // schedulable if &lt;= 1
function edf(ds, het, buoc = 10) {
  const viec = [];                                 // jobs: one per period
  for (const e of ds) for (let r = 0; r &lt; het; r += e.P) viec.push({ ten: e.ten, den: r, han: r + e.P, con: e.C, P: e.P });
  const doan = [];
  for (let t = 0; t &lt; het; t += buoc) {
    const san = viec.filter((v) =&gt; v.den &lt;= t &amp;&amp; v.con &gt; 0).sort((a, b) =&gt; a.han - b.han || a.P - b.P);
    const v = san[0];
    if (v) v.con -= buoc;
    const ten = v ? v.ten : null, cuoi = doan[doan.length - 1];
    if (cuoi &amp;&amp; cuoi.ten === ten) cuoi.den = t + buoc; else doan.push({ ten, tu: t, den: t + buoc });
  }
  const tre = viec.filter((v) =&gt; v.han &lt;= het &amp;&amp; v.con &gt; 0).length;   // jobs whose deadline passed unfinished
  return { doan, tre };
}</code></pre></details>
<p>With U = 1 the CPU is never idle, yet EDF meets every deadline — on one CPU, EDF can schedule any set with U ≤ 1. Linux offers this through <code>SCHED_DEADLINE</code>; the classic policies need privileges:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_NICE</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># The same request with the privilege granted (docker run --cap-add=SYS_NICE)<br>
$ chrt -f 10 chrt -p 0<br>
pid 9's current scheduling policy: SCHED_FIFO<br>
pid 9's current scheduling priority: 10<br>
$ chrt -r 20 chrt -p 0<br>
pid 12's current scheduling policy: SCHED_RR<br>
pid 12's current scheduling priority: 20<br>
# the kernel's safety net: real-time tasks may use at most 950000 of every 1000000 µs<br>
$ cat /proc/sys/kernel/sched_rt_runtime_us /proc/sys/kernel/sched_rt_period_us<br>
950000<br>
1000000</div>
<p>With <code>--cap-add=SYS_NICE</code> the same <code>chrt</code> that failed on slide 57 works. The kernel still keeps a safety net: real-time tasks may use at most 950 000 µs of every 1 000 000 µs, so a runaway <code>SCHED_FIFO</code> loop cannot freeze the machine completely.</p>
<p class="pitfall">⚠️ FE2#9 / FE11#14 / FE16#17: in a real-time system, the highest priority goes to the <strong>processes with the earliest deadlines</strong> (EDF).</p>`,
        `<p class="y-chinh">🎯 Lập lịch thời gian thực: thời gian đóng vai trò cốt yếu. Phân loại: <strong>thời gian thực cứng (hard)</strong>, <strong>thời gian thực mềm (soft)</strong>; sự kiện <strong>tuần hoàn (periodic)</strong> hoặc <strong>không tuần hoàn (aperiodic)</strong>. Một tập m sự kiện tuần hoàn, sự kiện i có chu kỳ P<sub>i</sub> và cần C<sub>i</sub> giây CPU, là <strong>lập lịch được (schedulable)</strong> nếu Σ C<sub>i</sub>/P<sub>i</sub> ≤ 1.</p>
<p>Hệ thời gian thực phải phản ứng với sự kiện bên ngoài trong một thời gian cố định: máy CD phải đổi bit thành âm thanh đúng lúc, hệ lái tự động của máy bay phải phản ứng trước khi quá muộn. <strong>Cứng</strong> = phải kịp hạn chót tuyệt đối (lỡ một lần là hỏng: phanh ABS của ô tô); <strong>mềm</strong> = thỉnh thoảng lỡ hạn thì không hay nhưng chấp nhận được (rớt một khung hình video). Mỗi sự kiện cần một phần C/P của một CPU; nếu tổng các phần lớn hơn 1, không thuật toán nào theo kịp. Ví dụ của sách: ba sự kiện tuần hoàn chu kỳ 100, 200 và 500 ms cần 50, 30 và 100 ms CPU: 0,5 + 0,15 + 0,2 = 0,85 ≤ 1 ⇒ lập lịch được; một sự kiện thứ tư chu kỳ 1 giây chỉ thêm được nếu nó cần tối đa 150 ms (bỏ qua chi phí chuyển tiến trình).</p>
<p>➕ Máy tính hộ, và lập lịch bằng <strong>EDF</strong> (earliest deadline first — hạn chót sớm nhất trước: luôn chạy sự kiện sẵn sàng có hạn chót — cuối chu kỳ của nó — gần nhất; có chiếm quyền) trong 500 ms đầu:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/017aa5f370be1f0ef60ad206725930f4a81d2acb.svg" alt="Ba sự kiện của sách: U = 0,85, mọi hạn chót đều kịp" loading="lazy" /><p class="chu-thich">🧮 Ba sự kiện của sách: U = 0,85, mọi hạn chót đều kịp</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: [{ ten: 'E1', P: 100, C: 50 }, { ten: 'E2', P: 200, C: 30 }, { ten: 'E3', P: 500, C: 100 }],
  them: [{ ten: 'E1', P: 100, C: 50 }, { ten: 'E2', P: 200, C: 30 }, { ten: 'E3', P: 500, C: 100 }, { ten: 'E4', P: 1000, C: 150 }],
};
const tongU = (ds) =&gt; ds.reduce((s, e) =&gt; s + e.C / e.P, 0);   // schedulable if &lt;= 1
function edf(ds, het, buoc = 10) {
  const viec = [];                                 // jobs: one per period
  for (const e of ds) for (let r = 0; r &lt; het; r += e.P) viec.push({ ten: e.ten, den: r, han: r + e.P, con: e.C, P: e.P });
  const doan = [];
  for (let t = 0; t &lt; het; t += buoc) {
    const san = viec.filter((v) =&gt; v.den &lt;= t &amp;&amp; v.con &gt; 0).sort((a, b) =&gt; a.han - b.han || a.P - b.P);
    const v = san[0];
    if (v) v.con -= buoc;
    const ten = v ? v.ten : null, cuoi = doan[doan.length - 1];
    if (cuoi &amp;&amp; cuoi.ten === ten) cuoi.den = t + buoc; else doan.push({ ten, tu: t, den: t + buoc });
  }
  const tre = viec.filter((v) =&gt; v.han &lt;= het &amp;&amp; v.con &gt; 0).length;   // jobs whose deadline passed unfinished
  return { doan, tre };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7b2da6d941746058b8f5aadd1f0d45bd4fdcc399.svg" alt="Thêm sự kiện thứ tư đúng ở giới hạn (150 ms mỗi giây): U = 1, vẫn không lỡ hạn nào" loading="lazy" /><p class="chu-thich">🧮 Thêm sự kiện thứ tư đúng ở giới hạn (150 ms mỗi giây): U = 1, vẫn không lỡ hạn nào</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BO = {
  sach: [{ ten: 'E1', P: 100, C: 50 }, { ten: 'E2', P: 200, C: 30 }, { ten: 'E3', P: 500, C: 100 }],
  them: [{ ten: 'E1', P: 100, C: 50 }, { ten: 'E2', P: 200, C: 30 }, { ten: 'E3', P: 500, C: 100 }, { ten: 'E4', P: 1000, C: 150 }],
};
const tongU = (ds) =&gt; ds.reduce((s, e) =&gt; s + e.C / e.P, 0);   // schedulable if &lt;= 1
function edf(ds, het, buoc = 10) {
  const viec = [];                                 // jobs: one per period
  for (const e of ds) for (let r = 0; r &lt; het; r += e.P) viec.push({ ten: e.ten, den: r, han: r + e.P, con: e.C, P: e.P });
  const doan = [];
  for (let t = 0; t &lt; het; t += buoc) {
    const san = viec.filter((v) =&gt; v.den &lt;= t &amp;&amp; v.con &gt; 0).sort((a, b) =&gt; a.han - b.han || a.P - b.P);
    const v = san[0];
    if (v) v.con -= buoc;
    const ten = v ? v.ten : null, cuoi = doan[doan.length - 1];
    if (cuoi &amp;&amp; cuoi.ten === ten) cuoi.den = t + buoc; else doan.push({ ten, tu: t, den: t + buoc });
  }
  const tre = viec.filter((v) =&gt; v.han &lt;= het &amp;&amp; v.con &gt; 0).length;   // jobs whose deadline passed unfinished
  return { doan, tre };
}</code></pre></details>
<p>Với U = 1 CPU không lúc nào rảnh, vậy mà EDF vẫn kịp mọi hạn — trên một CPU, EDF lập lịch được mọi tập có U ≤ 1. Linux cung cấp điều này qua <code>SCHED_DEADLINE</code>; các chính sách cổ điển cần đặc quyền:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_NICE</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Cùng yêu cầu đó khi đã được cấp đặc quyền (docker run --cap-add=SYS_NICE)<br>
$ chrt -f 10 chrt -p 0<br>
pid 9's current scheduling policy: SCHED_FIFO<br>
pid 9's current scheduling priority: 10<br>
$ chrt -r 20 chrt -p 0<br>
pid 12's current scheduling policy: SCHED_RR<br>
pid 12's current scheduling priority: 20<br>
# lưới an toàn của nhân: tác vụ thời gian thực dùng tối đa 950000 trong mỗi 1000000 µs<br>
$ cat /proc/sys/kernel/sched_rt_runtime_us /proc/sys/kernel/sched_rt_period_us<br>
950000<br>
1000000</div>
<p>Có <code>--cap-add=SYS_NICE</code> thì đúng lệnh <code>chrt</code> đã thất bại ở slide 57 chạy được. Nhân vẫn giữ một lưới an toàn: tác vụ thời gian thực chỉ được dùng tối đa 950 000 µs trong mỗi 1 000 000 µs, nên một vòng lặp <code>SCHED_FIFO</code> chạy loạn không làm đơ cả máy.</p>
<p class="pitfall">⚠️ FE2#9 / FE11#14 / FE16#17: trong hệ thời gian thực, ưu tiên cao nhất dành cho <strong>tiến trình có hạn chót sớm nhất</strong> (EDF).</p>`],
      [65, 'Thread Scheduling (1)',
        `<p class="y-chinh">🎯 Figure 2-44(a): possible scheduling of <strong>user-level threads</strong> with a 50-ms process quantum and threads that run 5 ms per CPU burst. (1) The kernel picks a process (A); (2) the run-time system inside A picks a thread. Possible: A1, A2, A3, A1, A2, A3. Not possible: A1, B1, A2, B2, A3, B3.</p>
<p>With user-level threads the kernel does not know threads exist: it gives process A its quantum, and A's run-time system decides which of A's threads runs, with any algorithm it likes (round robin and priority are typical, but it has no clock interrupt to stop a thread, so threads usually run until they block or yield). In the figure each thread runs 5 ms and yields, so within A's 50 ms the threads go round A1, A2, A3 several times; only when A's quantum ends does the kernel switch to process B. A thread of B can never run in the middle of A's quantum.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1d6948909dc72190fc8c930f6837bcef23c0ded5.svg" alt="Figure 2-44(a) over 100 ms: 50 ms of A's threads, then 50 ms of B's threads" loading="lazy" /><p class="chu-thich">🧮 Figure 2-44(a) over 100 ms: 50 ms of A's threads, then 50 ms of B's threads</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BURST = 5, QUANTUM = 50, HET = 100;
function nguoiDung() {                          // the kernel picks a PROCESS; the run-time system picks its threads
  const lich = [];
  for (let t = 0, p = 0; t &lt; HET; t += QUANTUM, p = 1 - p) {
    const P = 'AB'[p];
    for (let k = 0; k &lt; QUANTUM / BURST; k++) lich.push({ ten: &#96;&#36;{P}&#36;{(k % 3) + 1}&#96;, tu: t + k * BURST, den: t + (k + 1) * BURST });
  }
  return lich;
}
function nhan() {                               // the kernel picks a THREAD each time, from either process
  const vong = ['A1', 'B1', 'A2', 'B2', 'A3', 'B3'];
  return Array.from({ length: HET / BURST }, (_, k) =&gt; ({ ten: vong[k % 6], tu: k * BURST, den: (k + 1) * BURST }));
}</code></pre></details>
<p>➕ The advantage is speed and freedom: a thread switch is a procedure call (tens of nanoseconds instead of the ~2 µs process switch measured on slide 11), and an application can use a scheduler that knows its threads — the book's example is a web server that prefers the dispatcher thread over workers.</p>
<p class="meo">🧠 User-level threads = the kernel lends the car to the family (process); who drives during the family's hour is decided inside the family.</p>`,
        `<p class="y-chinh">🎯 Hình 2-44(a): một cách lập lịch có thể có với <strong>luồng mức người dùng</strong>, lượng tử tiến trình 50 ms và mỗi luồng chạy 5 ms mỗi đợt CPU. (1) Nhân chọn một tiến trình (A); (2) hệ thống thời gian chạy bên trong A chọn một luồng. Có thể: A1, A2, A3, A1, A2, A3. Không thể: A1, B1, A2, B2, A3, B3.</p>
<p>Với luồng mức người dùng, nhân không biết luồng tồn tại: nó cho tiến trình A lượng tử của A, và hệ thống thời gian chạy của A quyết định luồng nào của A chạy, bằng thuật toán gì tuỳ thích (round robin và ưu tiên là điển hình, nhưng nó không có ngắt đồng hồ để dừng một luồng, nên luồng thường chạy tới khi bị chặn hoặc tự nhường). Trong hình mỗi luồng chạy 5 ms rồi nhường, nên trong 50 ms của A các luồng xoay vòng A1, A2, A3 vài lượt; chỉ khi hết lượng tử của A nhân mới chuyển sang tiến trình B. Một luồng của B không bao giờ chạy được giữa chừng lượng tử của A.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/83c6a76b9b380ae1ce00d90630e7c2202a62d542.svg" alt="Hình 2-44(a) trong 100 ms: 50 ms cho các luồng của A, rồi 50 ms cho các luồng của B" loading="lazy" /><p class="chu-thich">🧮 Hình 2-44(a) trong 100 ms: 50 ms cho các luồng của A, rồi 50 ms cho các luồng của B</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BURST = 5, QUANTUM = 50, HET = 100;
function nguoiDung() {                          // the kernel picks a PROCESS; the run-time system picks its threads
  const lich = [];
  for (let t = 0, p = 0; t &lt; HET; t += QUANTUM, p = 1 - p) {
    const P = 'AB'[p];
    for (let k = 0; k &lt; QUANTUM / BURST; k++) lich.push({ ten: &#96;&#36;{P}&#36;{(k % 3) + 1}&#96;, tu: t + k * BURST, den: t + (k + 1) * BURST });
  }
  return lich;
}
function nhan() {                               // the kernel picks a THREAD each time, from either process
  const vong = ['A1', 'B1', 'A2', 'B2', 'A3', 'B3'];
  return Array.from({ length: HET / BURST }, (_, k) =&gt; ({ ten: vong[k % 6], tu: k * BURST, den: (k + 1) * BURST }));
}</code></pre></details>
<p>➕ Ưu điểm là tốc độ và sự tự do: chuyển luồng là một lời gọi thủ tục (vài chục nano-giây thay vì ~2 µs của lần chuyển tiến trình đo ở slide 11), và ứng dụng dùng được bộ lập lịch hiểu các luồng của mình — ví dụ của sách là máy chủ web ưu ái luồng điều phối hơn các luồng thợ.</p>
<p class="meo">🧠 Luồng mức người dùng = nhân cho cả gia đình (tiến trình) mượn xe; trong giờ của gia đình ai cầm lái là chuyện nội bộ gia đình quyết.</p>`],
      [66, 'Thread Scheduling (2)',
        `<p class="y-chinh">🎯 Figure 2-44(b): possible scheduling of <strong>kernel-level threads</strong> with the same characteristics. The kernel picks a thread. Possible: A1, A2, A3, A1, A2, A3. Also possible: A1, B1, A2, B2, A3, B3.</p>
<p>With kernel-level threads the kernel schedules threads directly, and it may or may not take into account which process a thread belongs to. After each 5-ms burst it may pick a thread of another process, so the interleaving A1, B1, A2, B2 becomes possible. The cost: every thread switch is a full context switch through the kernel; and switching from a thread of A to a thread of B also changes the memory map, which is slower than switching between two threads of A. A clever kernel therefore prefers, among equally important threads, one of the same process.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/24a1d54a1d2e116d3746e7077fc1d74ae9f6c513.svg" alt="Figure 2-44(b): the kernel interleaves threads of A and B" loading="lazy" /><p class="chu-thich">🧮 Figure 2-44(b): the kernel interleaves threads of A and B</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BURST = 5, QUANTUM = 50, HET = 100;
function nguoiDung() {                          // the kernel picks a PROCESS; the run-time system picks its threads
  const lich = [];
  for (let t = 0, p = 0; t &lt; HET; t += QUANTUM, p = 1 - p) {
    const P = 'AB'[p];
    for (let k = 0; k &lt; QUANTUM / BURST; k++) lich.push({ ten: &#96;&#36;{P}&#36;{(k % 3) + 1}&#96;, tu: t + k * BURST, den: t + (k + 1) * BURST });
  }
  return lich;
}
function nhan() {                               // the kernel picks a THREAD each time, from either process
  const vong = ['A1', 'B1', 'A2', 'B2', 'A3', 'B3'];
  return Array.from({ length: HET / BURST }, (_, k) =&gt; ({ ten: vong[k % 6], tu: k * BURST, den: (k + 1) * BURST }));
}</code></pre></details>
<p>➕ Linux is in case (b): every thread is a schedulable kernel task (the LWPs of slide 17), and the scheduler is per-thread — a process with 8 busy threads competes as 8 entities, which is why a multithreaded program can use 8 cores. A blocked thread blocks only itself. Java virtual threads bring back case (a) on top of it: the JVM schedules virtual threads onto the kernel threads it owns (slide 24).</p>
<p class="pitfall">⚠️ FE21#23 statement "user-level threads cannot be preempted by clock interrupts unless the whole process's quantum has been used up" is <strong>true</strong> — that is Figure 2-44(a); and "if one user-level thread makes a blocking system call, the whole process blocks" is also true. Only the one about "customized scheduling cannot be implemented" is false.</p>`,
        `<p class="y-chinh">🎯 Hình 2-44(b): một cách lập lịch có thể có với <strong>luồng mức nhân</strong>, cùng các đặc điểm như trên. Nhân chọn một luồng. Có thể: A1, A2, A3, A1, A2, A3. Cũng có thể: A1, B1, A2, B2, A3, B3.</p>
<p>Với luồng mức nhân, nhân lập lịch trực tiếp các luồng, và có thể để ý hoặc không để ý luồng thuộc tiến trình nào. Sau mỗi đợt 5 ms nó có thể chọn luồng của tiến trình khác, nên kiểu đan xen A1, B1, A2, B2 trở thành có thể. Cái giá: mỗi lần chuyển luồng là một lần chuyển ngữ cảnh đầy đủ qua nhân; và chuyển từ luồng của A sang luồng của B còn phải đổi bản đồ bộ nhớ, chậm hơn chuyển giữa hai luồng của A. Vì vậy một nhân khéo léo sẽ ưu tiên, giữa các luồng quan trọng như nhau, luồng của cùng tiến trình.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/cbc88e0081590e90010029e00c59894e503e0470.svg" alt="Hình 2-44(b): nhân xen kẽ các luồng của A và B" loading="lazy" /><p class="chu-thich">🧮 Hình 2-44(b): nhân xen kẽ các luồng của A và B</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BURST = 5, QUANTUM = 50, HET = 100;
function nguoiDung() {                          // the kernel picks a PROCESS; the run-time system picks its threads
  const lich = [];
  for (let t = 0, p = 0; t &lt; HET; t += QUANTUM, p = 1 - p) {
    const P = 'AB'[p];
    for (let k = 0; k &lt; QUANTUM / BURST; k++) lich.push({ ten: &#96;&#36;{P}&#36;{(k % 3) + 1}&#96;, tu: t + k * BURST, den: t + (k + 1) * BURST });
  }
  return lich;
}
function nhan() {                               // the kernel picks a THREAD each time, from either process
  const vong = ['A1', 'B1', 'A2', 'B2', 'A3', 'B3'];
  return Array.from({ length: HET / BURST }, (_, k) =&gt; ({ ten: vong[k % 6], tu: k * BURST, den: (k + 1) * BURST }));
}</code></pre></details>
<p>➕ Linux thuộc trường hợp (b): mỗi luồng là một tác vụ nhân được lập lịch riêng (các LWP ở slide 17), và bộ lập lịch làm việc theo luồng — một tiến trình có 8 luồng bận tranh CPU như 8 thực thể, nhờ vậy chương trình đa luồng dùng được 8 lõi. Một luồng bị chặn chỉ chặn chính nó. Luồng ảo Java mang trường hợp (a) trở lại ở tầng trên: JVM lập lịch luồng ảo lên các luồng nhân của nó (slide 24).</p>
<p class="pitfall">⚠️ Phát biểu trong FE21#23 "luồng mức người dùng không thể bị ngắt đồng hồ chiếm quyền trừ khi cả lượng tử của tiến trình đã dùng hết" là <strong>đúng</strong> — đó là Hình 2-44(a); và "nếu một luồng mức người dùng gọi lời gọi hệ thống chặn, cả tiến trình bị chặn" cũng đúng. Chỉ câu "không thể cài thuật toán lập lịch tuỳ biến" là sai.</p>`],
      [67, 'The Dining Philosophers Problem (1)',
        `<p class="y-chinh">🎯 Figure 2-45: lunch time in the Philosophy Department — five philosophers around a circular table, a plate of spaghetti each, and <strong>one fork between each pair of plates</strong>: five forks in total. A philosopher alternates between eating and thinking; to eat he needs <strong>both</strong> forks next to his plate, taken one at a time.</p>
<p>Dijkstra posed and solved this problem in 1965; it has since become the standard test for every new synchronization primitive, because it models a common situation: processes competing for exclusive access to a limited number of resources, where each needs <em>several</em> resources at once. The forks are the resources (think: two database rows a transaction must lock, two bank accounts in a transfer, two network ports); the philosophers are the processes. Two requirements: no <strong>deadlock</strong> (everyone stuck forever) and no <strong>starvation</strong> (some philosopher never eats while others do).</p>
<p>➕ Why can't they all eat at once? With five forks and two per meal, at most <strong>two</strong> philosophers (non-neighbours) can eat at the same time — a fact our correct solution will check by itself on slide 71. The problem is also the shape of Chapter 6: the naive solution on the next slide shows all four conditions of deadlock at once.</p>
<p class="pitfall">⚠️ FE2#15 / FE4#16: "In 1965, Dijkstra posed and then solved a synchronization problem he called" — <strong>the dining philosophers problem</strong>. FE4#13 / FE7#16: the philosophers represent <strong>concurrent processes competing for access to shared resources</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình 2-45: giờ ăn trưa ở khoa Triết — năm triết gia quanh một bàn tròn, mỗi người một đĩa mì Ý, và <strong>một chiếc nĩa giữa mỗi cặp đĩa</strong>: tổng cộng năm chiếc. Triết gia luân phiên ăn và nghĩ; muốn ăn, ông cần <strong>cả hai</strong> chiếc nĩa cạnh đĩa mình, lấy từng chiếc một.</p>
<p>Dijkstra đặt ra và giải bài toán này năm 1965; từ đó nó thành phép thử chuẩn cho mọi công cụ đồng bộ mới, vì nó mô hình hoá một tình huống phổ biến: các tiến trình tranh quyền dùng độc quyền một số lượng tài nguyên có hạn, mỗi tiến trình cần <em>nhiều</em> tài nguyên cùng lúc. Nĩa là tài nguyên (hãy nghĩ: hai dòng dữ liệu mà một giao dịch phải khoá, hai tài khoản trong một lần chuyển tiền, hai cổng mạng); triết gia là tiến trình. Hai yêu cầu: không <strong>bế tắc (deadlock)</strong> (mọi người kẹt mãi) và không <strong>bỏ đói (starvation)</strong> (một triết gia không bao giờ được ăn trong khi người khác vẫn ăn).</p>
<p>➕ Sao không cho tất cả ăn cùng lúc? Năm chiếc nĩa, mỗi bữa cần hai, nên nhiều nhất <strong>hai</strong> triết gia (không ngồi cạnh nhau) ăn được cùng lúc — điều mà lời giải đúng của ta sẽ tự kiểm ở slide 71. Bài toán cũng là hình dạng của Chương 6: lời giải ngây thơ ở slide sau phô ra cả bốn điều kiện của bế tắc cùng lúc.</p>
<p class="pitfall">⚠️ FE2#15 / FE4#16: "Năm 1965, Dijkstra đặt ra rồi giải một bài toán đồng bộ mà ông gọi là" — <strong>the dining philosophers problem</strong>. FE4#13 / FE7#16: các triết gia đại diện cho <strong>các tiến trình đồng thời tranh nhau truy cập tài nguyên dùng chung</strong>.</p>`],
      [68, 'The Dining Philosophers Problem (2)',
        `<p class="y-chinh">🎯 Figure 2-46: a <strong>nonsolution</strong>. <code>#define N 5; void philosopher(int i) { while (TRUE) { think(); take_fork(i); take_fork((i+1) % N); eat(); put_fork(i); put_fork((i+1) % N); } }</code></p>
<p>The obvious solution: wait for the left fork, then the right one. It fails when all five philosophers take their left fork simultaneously — none can get a right fork, and they wait forever: <strong>deadlock</strong>. The book then tries a fix: after taking the left fork, check whether the right one is available; if not, put the left fork down, wait some time and retry. That fails too: all philosophers could start together, take left forks, see no right forks, put them down, wait the same time, and repeat forever — they are all running but make no progress, a situation called <strong>starvation</strong> in the book (today usually <strong>livelock</strong>). Waiting a <em>random</em> time works in practice (Ethernet does this) but not always.</p>
<p>➕ The deadlock, made certain: each philosopher thinks for a moment between the two forks, so all five hold their left fork before anyone reaches for the right one:</p>
<pre><code class="language-c">// Figure 2-46, the "nonsolution": every philosopher takes the left fork, then the right one
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;

#define N 5                                         /* number of philosophers */
pthread_mutex_t fork_[N];                           // one mutex per fork
int holding[N];                                     // which fork each philosopher holds

void *philosopher(void *arg) {                      /* i: philosopher number, from 0 to 4 */
    int i = (int)(long)arg;
    for (;;) {
        /* think(); */
        pthread_mutex_lock(&amp;fork_[i]);              /* take left fork */
        holding[i] = 1;
        usleep(100 * 1000);                         // a moment of thought between the two forks
        pthread_mutex_lock(&amp;fork_[(i + 1) % N]);    /* take right fork; % is modulo operator */
        printf("philosopher %d eats (never printed)\\n", i);   /* yum-yum, spaghetti */
        pthread_mutex_unlock(&amp;fork_[i]);
        pthread_mutex_unlock(&amp;fork_[(i + 1) % N]);
    }
}

int main(void) {
    pthread_t t[N];
    for (int i = 0; i &lt; N; i++) pthread_mutex_init(&amp;fork_[i], NULL);
    for (long i = 0; i &lt; N; i++) pthread_create(&amp;t[i], NULL, philosopher, (void *)i);
    sleep(2);                                       // watchdog
    for (int i = 0; i &lt; N; i++)
        printf("philosopher %d holds fork %d, waits for fork %d\\n", i, i, (i + 1) % N);
    printf("after 2 s nobody has eaten: a circular wait — DEADLOCK\\n");
    exit(0);
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread triet-gia-ngay-tho.c -o triet-gia-ngay-tho &amp;&amp; ./triet-gia-ngay-tho<br>
philosopher 0 holds fork 0, waits for fork 1<br>
philosopher 1 holds fork 1, waits for fork 2<br>
philosopher 2 holds fork 2, waits for fork 3<br>
philosopher 3 holds fork 3, waits for fork 4<br>
philosopher 4 holds fork 4, waits for fork 0<br>
after 2 s nobody has eaten: a circular wait — DEADLOCK</div>
<p>Nobody ever eats. Drawn as a resource-allocation graph (Chapter 6's tool) the situation is a single cycle through all ten nodes:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/610c0eb3fd7de645d7eb44287149a14bfbe6eafd.svg" alt="Every philosopher holds one fork (solid arrow) and requests the next (dashed): a cycle — the four deadlock conditions hold" loading="lazy" /><p class="chu-thich">🧮 Every philosopher holds one fork (solid arrow) and requests the next (dashed): a cycle — the four deadlock conditions hold</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const N = 5, AN = 3, BUA = 2;
const nghi = (i) =&gt; 2 + i;
function giai() {
  const THINK = 0, HUNGRY = 1, EAT = 2;
  const st = Array(N).fill(THINK), het = Array.from({ length: N }, (_, i) =&gt; nghi(i)), bua = Array(N).fill(0);
  const doan = Array.from({ length: N }, () =&gt; []), batDau = Array(N).fill(0);
  const LEFT = (i) =&gt; (i + N - 1) % N, RIGHT = (i) =&gt; (i + 1) % N;
  let t = 0, maxAn = 0;
  const ghi = (i, loai) =&gt; { if (t &gt; batDau[i]) doan[i].push({ tu: batDau[i], den: t, loai }); batDau[i] = t; };
  const test = (i) =&gt; { if (st[i] === HUNGRY &amp;&amp; st[LEFT(i)] !== EAT &amp;&amp; st[RIGHT(i)] !== EAT) { ghi(i, HUNGRY); st[i] = EAT; het[i] = t + AN; } };
  while (bua.some((b) =&gt; b &lt; BUA) &amp;&amp; t &lt; 200) {
    for (let i = 0; i &lt; N; i++) {
      if (st[i] === THINK &amp;&amp; het[i] === t &amp;&amp; bua[i] &lt; BUA) { ghi(i, THINK); st[i] = HUNGRY; test(i); }     // take_forks(i)
      else if (st[i] === EAT &amp;&amp; het[i] === t) {                                                           // put_forks(i)
        ghi(i, EAT); st[i] = THINK; bua[i]++; het[i] = t + nghi(i); test(LEFT(i)); test(RIGHT(i));
      }
    }
    maxAn = Math.max(maxAn, st.filter((x) =&gt; x === EAT).length);
    t++;
  }
  return { doan, t: t - 1, maxAn };
}</code></pre></details>
<p>Mutual exclusion (a fork is held by one philosopher), hold and wait (each holds one and waits for another), no preemption (nobody snatches forks), circular wait (the cycle) — remove any one and the deadlock disappears. Exercise 6 of lesson 2.D breaks the cycle in one line.</p>`,
        `<p class="y-chinh">🎯 Hình 2-46: một <strong>lời giải sai (nonsolution)</strong>. <code>#define N 5; void philosopher(int i) { while (TRUE) { think(); take_fork(i); take_fork((i+1) % N); eat(); put_fork(i); put_fork((i+1) % N); } }</code></p>
<p>Lời giải hiển nhiên: chờ nĩa trái, rồi nĩa phải. Nó hỏng khi cả năm triết gia cùng cầm nĩa trái một lúc — không ai lấy được nĩa phải, và họ chờ mãi: <strong>bế tắc</strong>. Sách thử một cách vá: sau khi cầm nĩa trái, xem nĩa phải có sẵn không; nếu không, đặt nĩa trái xuống, chờ một lúc rồi thử lại. Cách này cũng hỏng: mọi triết gia có thể cùng bắt đầu, cầm nĩa trái, thấy không có nĩa phải, đặt xuống, chờ cùng một khoảng, rồi lặp lại mãi — tất cả đều chạy mà không ai tiến được, sách gọi là <strong>starvation</strong> (ngày nay thường gọi <strong>livelock</strong>). Chờ một khoảng <em>ngẫu nhiên</em> thì chạy được trong thực tế (Ethernet làm vậy) nhưng không phải lúc nào cũng được.</p>
<p>➕ Bế tắc, làm cho chắc chắn xảy ra: mỗi triết gia nghĩ một chút giữa hai chiếc nĩa, nên cả năm đều cầm nĩa trái trước khi ai kịp với nĩa phải:</p>
<pre><code class="language-c">// Hình 2-46, "lời giải sai": triết gia nào cũng lấy đũa trái, rồi đũa phải
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;

#define N 5                                         /* number of philosophers */
pthread_mutex_t fork_[N];                           // mỗi chiếc đũa một mutex
int holding[N];                                     // mỗi triết gia đang cầm chiếc nào

void *philosopher(void *arg) {                      /* i: philosopher number, from 0 to 4 */
    int i = (int)(long)arg;
    for (;;) {
        /* think(); */
        pthread_mutex_lock(&amp;fork_[i]);              /* take left fork */
        holding[i] = 1;
        usleep(100 * 1000);                         // một chút suy nghĩ giữa hai chiếc đũa
        pthread_mutex_lock(&amp;fork_[(i + 1) % N]);    /* take right fork; % is modulo operator */
        printf("philosopher %d eats (never printed)\\n", i);   /* yum-yum, spaghetti */
        pthread_mutex_unlock(&amp;fork_[i]);
        pthread_mutex_unlock(&amp;fork_[(i + 1) % N]);
    }
}

int main(void) {
    pthread_t t[N];
    for (int i = 0; i &lt; N; i++) pthread_mutex_init(&amp;fork_[i], NULL);
    for (long i = 0; i &lt; N; i++) pthread_create(&amp;t[i], NULL, philosopher, (void *)i);
    sleep(2);                                       // bộ canh
    for (int i = 0; i &lt; N; i++)
        printf("philosopher %d holds fork %d, waits for fork %d\\n", i, i, (i + 1) % N);
    printf("after 2 s nobody has eaten: a circular wait — DEADLOCK\\n");
    exit(0);
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread triet-gia-ngay-tho.c -o triet-gia-ngay-tho &amp;&amp; ./triet-gia-ngay-tho<br>
philosopher 0 holds fork 0, waits for fork 1<br>
philosopher 1 holds fork 1, waits for fork 2<br>
philosopher 2 holds fork 2, waits for fork 3<br>
philosopher 3 holds fork 3, waits for fork 4<br>
philosopher 4 holds fork 4, waits for fork 0<br>
after 2 s nobody has eaten: a circular wait — DEADLOCK</div>
<p>Không ai được ăn. Vẽ thành đồ thị cấp phát tài nguyên (công cụ của Chương 6), tình huống là một chu trình duy nhất qua cả mười đỉnh:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/bc77cc6689967988be8afd254cb8bbc166928f78.svg" alt="Triết gia nào cũng giữ một nĩa (mũi tên liền) và xin chiếc kế (mũi tên đứt): một chu trình — bốn điều kiện bế tắc cùng thoả" loading="lazy" /><p class="chu-thich">🧮 Triết gia nào cũng giữ một nĩa (mũi tên liền) và xin chiếc kế (mũi tên đứt): một chu trình — bốn điều kiện bế tắc cùng thoả</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const N = 5, AN = 3, BUA = 2;
const nghi = (i) =&gt; 2 + i;
function giai() {
  const THINK = 0, HUNGRY = 1, EAT = 2;
  const st = Array(N).fill(THINK), het = Array.from({ length: N }, (_, i) =&gt; nghi(i)), bua = Array(N).fill(0);
  const doan = Array.from({ length: N }, () =&gt; []), batDau = Array(N).fill(0);
  const LEFT = (i) =&gt; (i + N - 1) % N, RIGHT = (i) =&gt; (i + 1) % N;
  let t = 0, maxAn = 0;
  const ghi = (i, loai) =&gt; { if (t &gt; batDau[i]) doan[i].push({ tu: batDau[i], den: t, loai }); batDau[i] = t; };
  const test = (i) =&gt; { if (st[i] === HUNGRY &amp;&amp; st[LEFT(i)] !== EAT &amp;&amp; st[RIGHT(i)] !== EAT) { ghi(i, HUNGRY); st[i] = EAT; het[i] = t + AN; } };
  while (bua.some((b) =&gt; b &lt; BUA) &amp;&amp; t &lt; 200) {
    for (let i = 0; i &lt; N; i++) {
      if (st[i] === THINK &amp;&amp; het[i] === t &amp;&amp; bua[i] &lt; BUA) { ghi(i, THINK); st[i] = HUNGRY; test(i); }     // take_forks(i)
      else if (st[i] === EAT &amp;&amp; het[i] === t) {                                                           // put_forks(i)
        ghi(i, EAT); st[i] = THINK; bua[i]++; het[i] = t + nghi(i); test(LEFT(i)); test(RIGHT(i));
      }
    }
    maxAn = Math.max(maxAn, st.filter((x) =&gt; x === EAT).length);
    t++;
  }
  return { doan, t: t - 1, maxAn };
}</code></pre></details>
<p>Loại trừ tương hỗ (mỗi nĩa một người giữ), giữ và chờ (mỗi người giữ một chiếc và chờ chiếc khác), không chiếm quyền (không ai giật nĩa), chờ vòng tròn (chu trình) — bỏ bất kỳ điều kiện nào là hết bế tắc. Bài tập 6 của bài 2.D phá chu trình bằng một dòng.</p>`],
      [69, 'The Dining Philosophers Problem (3)',
        `<p class="y-chinh">🎯 Figure 2-47 (part 1): a solution. <code>#define N 5, LEFT (i+N−1)%N, RIGHT (i+1)%N, THINKING 0, HUNGRY 1, EATING 2; int state[N]; semaphore mutex = 1; semaphore s[N];</code> — <code>philosopher(i)</code>: <code>while (TRUE) { think(); take_forks(i); eat(); put_forks(i); }</code></p>
<p>The book first mentions a correct but poor solution: protect the five statements after <code>think()</code> with one binary semaphore — no deadlock, but only one philosopher can eat at a time, although five forks allow two. Figure 2-47 allows maximum parallelism. It keeps an array <code>state</code> recording whether each philosopher is thinking, hungry (trying to get forks) or eating, protected by <code>mutex</code>; a philosopher may move into the eating state only if neither neighbour is eating. <code>LEFT</code> and <code>RIGHT</code> are the neighbours' numbers (for i = 2: 1 and 3). Each philosopher also has a semaphore <code>s[i]</code>, initially 0, on which he blocks if the forks he needs are busy.</p>
<p>➕ The key change compared with Figure 2-46: a philosopher never holds <em>one</em> fork while waiting for the other. Taking forks is "both or nothing", decided inside a critical region — which removes the <strong>hold and wait</strong> condition. Here is the solution running on a timeline, from the simulator (each philosopher i thinks 2 + i units, eats 3 units, two meals; striped = hungry, waiting):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/037d19988602fbb2e84747437eeae22ee10215e5.svg" alt="Figure 2-47 in action: at most two eat at once, never two neighbours, and everybody eats twice" loading="lazy" /><p class="chu-thich">🧮 Figure 2-47 in action: at most two eat at once, never two neighbours, and everybody eats twice</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const N = 5, AN = 3, BUA = 2;
const nghi = (i) =&gt; 2 + i;
function giai() {
  const THINK = 0, HUNGRY = 1, EAT = 2;
  const st = Array(N).fill(THINK), het = Array.from({ length: N }, (_, i) =&gt; nghi(i)), bua = Array(N).fill(0);
  const doan = Array.from({ length: N }, () =&gt; []), batDau = Array(N).fill(0);
  const LEFT = (i) =&gt; (i + N - 1) % N, RIGHT = (i) =&gt; (i + 1) % N;
  let t = 0, maxAn = 0;
  const ghi = (i, loai) =&gt; { if (t &gt; batDau[i]) doan[i].push({ tu: batDau[i], den: t, loai }); batDau[i] = t; };
  const test = (i) =&gt; { if (st[i] === HUNGRY &amp;&amp; st[LEFT(i)] !== EAT &amp;&amp; st[RIGHT(i)] !== EAT) { ghi(i, HUNGRY); st[i] = EAT; het[i] = t + AN; } };
  while (bua.some((b) =&gt; b &lt; BUA) &amp;&amp; t &lt; 200) {
    for (let i = 0; i &lt; N; i++) {
      if (st[i] === THINK &amp;&amp; het[i] === t &amp;&amp; bua[i] &lt; BUA) { ghi(i, THINK); st[i] = HUNGRY; test(i); }     // take_forks(i)
      else if (st[i] === EAT &amp;&amp; het[i] === t) {                                                           // put_forks(i)
        ghi(i, EAT); st[i] = THINK; bua[i]++; het[i] = t + nghi(i); test(LEFT(i)); test(RIGHT(i));
      }
    }
    maxAn = Math.max(maxAn, st.filter((x) =&gt; x === EAT).length);
    t++;
  }
  return { doan, t: t - 1, maxAn };
}</code></pre></details>
<p>P1 became hungry at t = 3 while P0 was eating, so P1 waited; when P0 finished, P2 was eating, so P1 still waited; it ate only after P2 put its forks down. No cycle can form, because nobody waits holding a fork.</p>`,
        `<p class="y-chinh">🎯 Hình 2-47 (phần 1): một lời giải. <code>#define N 5, LEFT (i+N−1)%N, RIGHT (i+1)%N, THINKING 0, HUNGRY 1, EATING 2; int state[N]; semaphore mutex = 1; semaphore s[N];</code> — <code>philosopher(i)</code>: <code>while (TRUE) { think(); take_forks(i); eat(); put_forks(i); }</code></p>
<p>Sách nhắc trước một lời giải đúng nhưng kém: bảo vệ năm câu lệnh sau <code>think()</code> bằng một semaphore nhị phân — không bế tắc, nhưng mỗi lúc chỉ một triết gia được ăn, dù năm chiếc nĩa cho phép hai. Hình 2-47 cho song song tối đa. Nó giữ một mảng <code>state</code> ghi mỗi triết gia đang nghĩ, đói (đang cố lấy nĩa) hay đang ăn, được bảo vệ bằng <code>mutex</code>; một triết gia chỉ được chuyển sang trạng thái ăn khi cả hai hàng xóm đều không ăn. <code>LEFT</code> và <code>RIGHT</code> là số của hai hàng xóm (với i = 2: 1 và 3). Mỗi triết gia còn có một semaphore <code>s[i]</code>, ban đầu bằng 0, để bị chặn trên đó nếu nĩa ông cần đang bận.</p>
<p>➕ Thay đổi then chốt so với Hình 2-46: không triết gia nào giữ <em>một</em> chiếc nĩa trong lúc chờ chiếc kia. Lấy nĩa là "cả hai hoặc không", quyết định trong vùng găng — điều đó loại bỏ điều kiện <strong>giữ và chờ</strong>. Đây là lời giải chạy trên dòng thời gian, từ bộ mô phỏng (triết gia i nghĩ 2 + i đơn vị, ăn 3 đơn vị, hai bữa; ô sọc = đói, đang chờ):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/dc40adc064e0073fb8899431caaa2af5b61c8e69.svg" alt="Hình 2-47 hoạt động: nhiều nhất hai người ăn cùng lúc, không bao giờ hai người cạnh nhau, và ai cũng ăn đủ hai bữa" loading="lazy" /><p class="chu-thich">🧮 Hình 2-47 hoạt động: nhiều nhất hai người ăn cùng lúc, không bao giờ hai người cạnh nhau, và ai cũng ăn đủ hai bữa</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const N = 5, AN = 3, BUA = 2;
const nghi = (i) =&gt; 2 + i;
function giai() {
  const THINK = 0, HUNGRY = 1, EAT = 2;
  const st = Array(N).fill(THINK), het = Array.from({ length: N }, (_, i) =&gt; nghi(i)), bua = Array(N).fill(0);
  const doan = Array.from({ length: N }, () =&gt; []), batDau = Array(N).fill(0);
  const LEFT = (i) =&gt; (i + N - 1) % N, RIGHT = (i) =&gt; (i + 1) % N;
  let t = 0, maxAn = 0;
  const ghi = (i, loai) =&gt; { if (t &gt; batDau[i]) doan[i].push({ tu: batDau[i], den: t, loai }); batDau[i] = t; };
  const test = (i) =&gt; { if (st[i] === HUNGRY &amp;&amp; st[LEFT(i)] !== EAT &amp;&amp; st[RIGHT(i)] !== EAT) { ghi(i, HUNGRY); st[i] = EAT; het[i] = t + AN; } };
  while (bua.some((b) =&gt; b &lt; BUA) &amp;&amp; t &lt; 200) {
    for (let i = 0; i &lt; N; i++) {
      if (st[i] === THINK &amp;&amp; het[i] === t &amp;&amp; bua[i] &lt; BUA) { ghi(i, THINK); st[i] = HUNGRY; test(i); }     // take_forks(i)
      else if (st[i] === EAT &amp;&amp; het[i] === t) {                                                           // put_forks(i)
        ghi(i, EAT); st[i] = THINK; bua[i]++; het[i] = t + nghi(i); test(LEFT(i)); test(RIGHT(i));
      }
    }
    maxAn = Math.max(maxAn, st.filter((x) =&gt; x === EAT).length);
    t++;
  }
  return { doan, t: t - 1, maxAn };
}</code></pre></details>
<p>P1 đói lúc t = 3 khi P0 đang ăn, nên P1 chờ; khi P0 ăn xong thì P2 đang ăn, nên P1 vẫn chờ; nó chỉ được ăn sau khi P2 đặt nĩa xuống. Không chu trình nào hình thành được, vì không ai vừa giữ nĩa vừa chờ.</p>`],
      [70, 'The Dining Philosophers Problem (4)',
        `<p class="y-chinh">🎯 Figure 2-47 (part 2): <code>void take_forks(int i) { down(&amp;mutex); state[i] = HUNGRY; test(i); up(&amp;mutex); down(&amp;s[i]); }</code></p>
<p>Line by line: enter the critical region (<code>mutex</code>) so that nobody else changes <code>state</code> meanwhile; record "I am hungry"; call <code>test(i)</code>, which gives me both forks <em>if</em> neither neighbour is eating (it sets my state to EATING and does <code>up(&amp;s[i])</code>); leave the critical region; finally <code>down(&amp;s[i])</code>. If <code>test</code> succeeded, <code>s[i]</code> is 1 and the down passes at once; if not, <code>s[i]</code> is 0 and I block here — <em>outside</em> the critical region, holding no fork, until a neighbour who finishes eating calls <code>test(i)</code> for me and ups my semaphore.</p>
<p>➕ The real code of the course version (POSIX names: <code>sem_wait</code> = down, <code>sem_post</code> = up):</p>
<pre class="trich"><code class="language-c">void take_forks(int i) {
    sem_wait(&amp;mutex);           /* enter critical region */
    state[i] = HUNGRY;          /* record fact that philosopher i is hungry */
    test(i);                    /* try to acquire 2 forks */
    sem_post(&amp;mutex);           /* exit critical region */
    sem_wait(&amp;s[i]);            /* block if forks were not acquired */
}</code></pre>
<p>Two details deserve attention. The final down is <strong>after</strong> <code>up(&amp;mutex)</code>: blocking on <code>s[i]</code> while holding <code>mutex</code> would freeze everyone — the same mistake as swapping the downs of producer–consumer (slide 38). And the "up before down" trick on <code>s[i]</code> works because a semaphore <strong>remembers</strong> the up: a condition variable's signal would be lost if it came before the wait (slide 41).</p>
<p class="pitfall">⚠️ FE3#10: "In the deadlock-avoiding solution, when can a philosopher eat?" — when <strong>both neighbours are not eating</strong>. "Both neighbours are thinking or hungry" says the same thing in a different way, but the answer key uses the "not eating" wording of <code>test()</code>.</p>`,
        `<p class="y-chinh">🎯 Hình 2-47 (phần 2): <code>void take_forks(int i) { down(&amp;mutex); state[i] = HUNGRY; test(i); up(&amp;mutex); down(&amp;s[i]); }</code></p>
<p>Từng dòng: vào vùng găng (<code>mutex</code>) để trong lúc này không ai khác sửa <code>state</code>; ghi "tôi đói"; gọi <code>test(i)</code>, hàm này trao cho tôi cả hai chiếc nĩa <em>nếu</em> cả hai hàng xóm đều không ăn (đặt trạng thái của tôi thành EATING và làm <code>up(&amp;s[i])</code>); ra khỏi vùng găng; cuối cùng <code>down(&amp;s[i])</code>. Nếu <code>test</code> thành công, <code>s[i]</code> bằng 1 và lệnh down qua ngay; nếu không, <code>s[i]</code> bằng 0 và tôi bị chặn ở đây — <em>bên ngoài</em> vùng găng, không giữ chiếc nĩa nào, tới khi một hàng xóm ăn xong gọi <code>test(i)</code> hộ tôi và up semaphore của tôi.</p>
<p>➕ Mã thật của bản dùng cho môn (tên POSIX: <code>sem_wait</code> = down, <code>sem_post</code> = up):</p>
<pre class="trich"><code class="language-c">void take_forks(int i) {
    sem_wait(&amp;mutex);           /* enter critical region */
    state[i] = HUNGRY;          /* record fact that philosopher i is hungry */
    test(i);                    /* try to acquire 2 forks */
    sem_post(&amp;mutex);           /* exit critical region */
    sem_wait(&amp;s[i]);            /* block if forks were not acquired */
}</code></pre>
<p>Hai chi tiết đáng chú ý. Lệnh down cuối cùng nằm <strong>sau</strong> <code>up(&amp;mutex)</code>: bị chặn trên <code>s[i]</code> trong lúc giữ <code>mutex</code> sẽ làm cả bàn đứng hình — cùng lỗi với việc đảo hai lệnh down của sản xuất–tiêu thụ (slide 38). Và mẹo "up trước down" trên <code>s[i]</code> chạy được vì semaphore <strong>nhớ</strong> lần up: tín hiệu của biến điều kiện thì sẽ mất nếu tới trước lệnh chờ (slide 41).</p>
<p class="pitfall">⚠️ FE3#10: "Trong lời giải tránh bế tắc, khi nào một triết gia được ăn?" — khi <strong>cả hai hàng xóm đều không đang ăn</strong>. "Cả hai hàng xóm đang nghĩ hoặc đang đói" nói cùng ý theo cách khác, nhưng đáp án dùng cách nói "không đang ăn" của hàm <code>test()</code>.</p>`],
      [71, 'The Dining Philosophers Problem (5)',
        `<p class="y-chinh">🎯 Figure 2-47 (part 3): <code>void put_forks(i) { down(&amp;mutex); state[i] = THINKING; test(LEFT); test(RIGHT); up(&amp;mutex); }</code> and <code>void test(i) { if (state[i] == HUNGRY &amp;&amp; state[LEFT] != EATING &amp;&amp; state[RIGHT] != EATING) { state[i] = EATING; up(&amp;s[i]); } }</code></p>
<p>When a philosopher finishes eating he marks himself THINKING and checks <strong>both neighbours</strong>: a neighbour who is hungry and now has no eating neighbour gets the forks and is woken by <code>up(&amp;s[neighbour])</code>. <code>test</code> is the single place where the rule "eat only if no neighbour eats" is enforced, and it is always called inside the critical region, so two neighbours can never both see the other as "not eating" and both start. That is the whole solution: no deadlock, maximum parallelism.</p>
<pre class="trich"><code class="language-c">void put_forks(int i) {
    sem_wait(&amp;mutex);           /* enter critical region */
    state[i] = THINKING;        /* philosopher has finished eating */
    test(LEFT);                 /* see if left neighbor can now eat */
    test(RIGHT);                /* see if right neighbor can now eat */
    sem_post(&amp;mutex);           /* exit critical region */
}</code></pre>
<pre class="trich"><code class="language-c">void test(int i) {              /* i: philosopher number, from 0 to N-1 */
    if (state[i] == HUNGRY &amp;&amp; state[LEFT] != EATING &amp;&amp; state[RIGHT] != EATING) {
        state[i] = EATING;
        sem_post(&amp;s[i]);        /* up(&amp;s[i]) */
    }
}</code></pre>
<p>➕ Run for real with five threads, 20 meals each; the program itself checks the two rules every time someone eats:</p>
<div class="out">$ gcc -Wall -O0 -pthread triet-gia.c -o triet-gia &amp;&amp; ./triet-gia<br>
philosopher 0 ate 20 times<br>
philosopher 1 ate 20 times<br>
philosopher 2 ate 20 times<br>
philosopher 3 ate 20 times<br>
philosopher 4 ate 20 times<br>
most philosophers eating at once : 2 (never more than N/2 = 2)<br>
two neighbours eating together &nbsp;&nbsp;: 0 times<br>
no deadlock: every thread finished</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Everybody ate 20 times, never more than two at once, never two neighbours together, and the program finished — no deadlock. What the solution does not promise is <strong>fairness</strong>: in an unlucky pattern two neighbours can take turns so that the philosopher between them waits a long time (starvation is possible in theory). Old lesson 2.6 lists the other standard fixes (at most four at the table; odd/even order — exercise 6 of lesson 2.D).</p>`,
        `<p class="y-chinh">🎯 Hình 2-47 (phần 3): <code>void put_forks(i) { down(&amp;mutex); state[i] = THINKING; test(LEFT); test(RIGHT); up(&amp;mutex); }</code> và <code>void test(i) { if (state[i] == HUNGRY &amp;&amp; state[LEFT] != EATING &amp;&amp; state[RIGHT] != EATING) { state[i] = EATING; up(&amp;s[i]); } }</code></p>
<p>Ăn xong, triết gia đánh dấu mình THINKING và kiểm <strong>cả hai hàng xóm</strong>: hàng xóm nào đang đói mà giờ không có ai bên cạnh đang ăn thì được trao nĩa và được đánh thức bằng <code>up(&amp;s[hàng_xóm])</code>. <code>test</code> là chỗ duy nhất thực thi luật "chỉ ăn khi không hàng xóm nào ăn", và nó luôn được gọi bên trong vùng găng, nên hai người cạnh nhau không bao giờ cùng thấy người kia "không ăn" rồi cùng bắt đầu. Toàn bộ lời giải chỉ có vậy: không bế tắc, song song tối đa.</p>
<pre class="trich"><code class="language-c">void put_forks(int i) {
    sem_wait(&amp;mutex);           /* enter critical region */
    state[i] = THINKING;        /* philosopher has finished eating */
    test(LEFT);                 /* see if left neighbor can now eat */
    test(RIGHT);                /* see if right neighbor can now eat */
    sem_post(&amp;mutex);           /* exit critical region */
}</code></pre>
<pre class="trich"><code class="language-c">void test(int i) {              /* i: philosopher number, from 0 to N-1 */
    if (state[i] == HUNGRY &amp;&amp; state[LEFT] != EATING &amp;&amp; state[RIGHT] != EATING) {
        state[i] = EATING;
        sem_post(&amp;s[i]);        /* up(&amp;s[i]) */
    }
}</code></pre>
<p>➕ Chạy thật với năm luồng, mỗi người 20 bữa; chính chương trình tự kiểm hai luật mỗi lần có người ăn:</p>
<div class="out">$ gcc -Wall -O0 -pthread triet-gia.c -o triet-gia &amp;&amp; ./triet-gia<br>
philosopher 0 ate 20 times<br>
philosopher 1 ate 20 times<br>
philosopher 2 ate 20 times<br>
philosopher 3 ate 20 times<br>
philosopher 4 ate 20 times<br>
most philosophers eating at once : 2 (never more than N/2 = 2)<br>
two neighbours eating together &nbsp;&nbsp;: 0 times<br>
no deadlock: every thread finished</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Ai cũng ăn đủ 20 lần, không bao giờ quá hai người cùng lúc, không bao giờ hai người cạnh nhau cùng ăn, và chương trình chạy xong — không bế tắc. Điều lời giải không hứa là <strong>công bằng</strong>: trong một kiểu xui xẻo, hai người hàng xóm thay phiên nhau ăn khiến người ngồi giữa phải chờ rất lâu (về lý thuyết có thể bị bỏ đói). Bài cũ 2.6 liệt kê các cách chữa chuẩn khác (tối đa bốn người ngồi bàn; thứ tự chẵn/lẻ — bài tập 6 của bài 2.D).</p>`],
      [72, 'The Readers and Writers Problem (1)',
        `<p class="y-chinh">🎯 Figure 2-48 (part 1): <code>semaphore mutex = 1; /* controls access to rc */ semaphore db = 1; /* controls access to the database */ int rc = 0; /* # of processes reading or wanting to */</code> — the reader: <code>down(&amp;mutex); rc = rc + 1; if (rc == 1) down(&amp;db); up(&amp;mutex); read_data_base(); down(&amp;mutex); rc = rc − 1; if (rc == 0) up(&amp;db); up(&amp;mutex); use_data_read();</code></p>
<p>The <strong>readers and writers</strong> problem (Courtois et al., 1971) models access to a database, e.g. an airline reservation system: many processes may <strong>read</strong> at the same time, but a process that <strong>writes</strong> must have exclusive access — no other reader or writer. The solution: <code>db</code> guards the database; the <strong>first</strong> reader to arrive does <code>down(&amp;db)</code> on behalf of all readers, later readers just increment the counter <code>rc</code>, and the <strong>last</strong> reader to leave does <code>up(&amp;db)</code>, letting a waiting writer in. <code>mutex</code> protects <code>rc</code> itself (it is shared, so updating it is a critical region).</p>
<p>➕ The solution run with three readers that keep arriving in overlapping waves for 1.5 s and one writer that arrives after 50 ms:</p>
<pre><code class="language-c">// Figure 2-48 with semaphores: a steady stream of readers keeps the writer out
#include &lt;stdio.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;
#include &lt;semaphore.h&gt;

sem_t mutex;                    /* controls access to 'rc' (= 1) */
sem_t db;                       /* controls access to the database (= 1) */
int rc = 0;                     /* # of processes reading or wanting to */
double t0;

static double now_ms(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t); return t.tv_sec * 1e3 + t.tv_nsec / 1e6; }

void *reader(void *arg) {
    int me = (int)(long)arg;
    usleep(me * 100 * 1000);                    // readers start 0, 100, 200 ms
    while (now_ms() - t0 &lt; 1500) {              // keep reading for 1.5 s
        sem_wait(&amp;mutex);                       /* get exclusive access to 'rc' */
        rc = rc + 1;                            /* one reader more now */
        if (rc == 1) sem_wait(&amp;db);             /* if this is the first reader ... */
        sem_post(&amp;mutex);
        usleep(250 * 1000);                     /* read_data_base(): 250 ms */
        sem_wait(&amp;mutex);
        rc = rc - 1;                            /* one reader fewer now */
        if (rc == 0) sem_post(&amp;db);             /* if this is the last reader ... */
        sem_post(&amp;mutex);
        usleep(10 * 1000);                      /* use_data_read() */
    }
    return NULL;
}

void *writer(void *arg) {
    usleep(50 * 1000);                          // the writer arrives at 50 ms
    double a = now_ms();
    sem_wait(&amp;db);                              /* get exclusive access */
    printf("writer waited %4.0f ms before it could write\\n", now_ms() - a);
    sem_post(&amp;db);                              /* release exclusive access */
    return NULL;
}

int main(void) {
    sem_init(&amp;mutex, 0, 1); sem_init(&amp;db, 0, 1);
    t0 = now_ms();
    pthread_t r[3], w;
    for (long i = 0; i &lt; 3; i++) pthread_create(&amp;r[i], NULL, reader, (void *)i);
    pthread_create(&amp;w, NULL, writer, NULL);
    for (int i = 0; i &lt; 3; i++) pthread_join(r[i], NULL);
    pthread_join(w, NULL);
    printf("the 3 readers overlapped for 1.5 s, so rc never fell to 0 until they stopped\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread doc-ghi.c -o doc-ghi &amp;&amp; ./doc-ghi<br>
writer waited 1617 ms before it could write<br>
the 3 readers overlapped for 1.5 s, so rc never fell to 0 until they stopped</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The writer waited about as long as the whole reading period. Readers kept overlapping, so <code>rc</code> never dropped to 0 and the last-reader <code>up(&amp;db)</code> never happened until the readers stopped. This is the weakness the book points out on the next slide.</p>
<p class="meo">🧠 "First one in turns the light on, last one out turns it off" — readers share the room; a writer needs the room dark and empty.</p>`,
        `<p class="y-chinh">🎯 Hình 2-48 (phần 1): <code>semaphore mutex = 1; /* kiểm soát rc */ semaphore db = 1; /* kiểm soát cơ sở dữ liệu */ int rc = 0; /* số tiến trình đang đọc hoặc muốn đọc */</code> — người đọc: <code>down(&amp;mutex); rc = rc + 1; if (rc == 1) down(&amp;db); up(&amp;mutex); read_data_base(); down(&amp;mutex); rc = rc − 1; if (rc == 0) up(&amp;db); up(&amp;mutex); use_data_read();</code></p>
<p>Bài toán <strong>người đọc và người ghi (readers and writers)</strong> (Courtois và cộng sự, 1971) mô hình hoá việc truy cập một cơ sở dữ liệu, chẳng hạn hệ thống đặt vé máy bay: nhiều tiến trình được <strong>đọc</strong> cùng lúc, nhưng tiến trình <strong>ghi</strong> phải được độc quyền — không người đọc hay người ghi nào khác. Lời giải: <code>db</code> canh cơ sở dữ liệu; người đọc <strong>đầu tiên</strong> tới làm <code>down(&amp;db)</code> thay cho mọi người đọc, những người đọc sau chỉ tăng bộ đếm <code>rc</code>, và người đọc <strong>cuối cùng</strong> rời đi làm <code>up(&amp;db)</code>, cho một người ghi đang chờ vào. <code>mutex</code> bảo vệ chính <code>rc</code> (nó dùng chung, nên cập nhật nó là một vùng găng).</p>
<p>➕ Lời giải chạy với ba người đọc liên tục tới theo các đợt chồng lên nhau trong 1,5 giây và một người ghi tới sau 50 ms:</p>
<pre><code class="language-c">// Hình 2-48 với semaphore: dòng người đọc liên tục giữ người ghi ở ngoài
#include &lt;stdio.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;
#include &lt;semaphore.h&gt;

sem_t mutex;                    /* controls access to 'rc' (= 1) */
sem_t db;                       /* controls access to the database (= 1) */
int rc = 0;                     /* # of processes reading or wanting to */
double t0;

static double now_ms(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t); return t.tv_sec * 1e3 + t.tv_nsec / 1e6; }

void *reader(void *arg) {
    int me = (int)(long)arg;
    usleep(me * 100 * 1000);                    // người đọc bắt đầu ở 0, 100, 200 ms
    while (now_ms() - t0 &lt; 1500) {              // đọc liên tục trong 1,5 giây
        sem_wait(&amp;mutex);                       /* get exclusive access to 'rc' */
        rc = rc + 1;                            /* one reader more now */
        if (rc == 1) sem_wait(&amp;db);             /* if this is the first reader ... */
        sem_post(&amp;mutex);
        usleep(250 * 1000);                     /* read_data_base(): 250 ms */
        sem_wait(&amp;mutex);
        rc = rc - 1;                            /* one reader fewer now */
        if (rc == 0) sem_post(&amp;db);             /* if this is the last reader ... */
        sem_post(&amp;mutex);
        usleep(10 * 1000);                      /* use_data_read() */
    }
    return NULL;
}

void *writer(void *arg) {
    usleep(50 * 1000);                          // người ghi tới lúc 50 ms
    double a = now_ms();
    sem_wait(&amp;db);                              /* get exclusive access */
    printf("writer waited %4.0f ms before it could write\\n", now_ms() - a);
    sem_post(&amp;db);                              /* release exclusive access */
    return NULL;
}

int main(void) {
    sem_init(&amp;mutex, 0, 1); sem_init(&amp;db, 0, 1);
    t0 = now_ms();
    pthread_t r[3], w;
    for (long i = 0; i &lt; 3; i++) pthread_create(&amp;r[i], NULL, reader, (void *)i);
    pthread_create(&amp;w, NULL, writer, NULL);
    for (int i = 0; i &lt; 3; i++) pthread_join(r[i], NULL);
    pthread_join(w, NULL);
    printf("the 3 readers overlapped for 1.5 s, so rc never fell to 0 until they stopped\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread doc-ghi.c -o doc-ghi &amp;&amp; ./doc-ghi<br>
writer waited 1617 ms before it could write<br>
the 3 readers overlapped for 1.5 s, so rc never fell to 0 until they stopped</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Người ghi chờ xấp xỉ cả quãng thời gian đọc. Người đọc cứ chồng lên nhau, nên <code>rc</code> không bao giờ về 0 và lệnh <code>up(&amp;db)</code> của người đọc cuối không xảy ra cho tới khi người đọc dừng. Đây là điểm yếu sách chỉ ra ở slide sau.</p>
<p class="meo">🧠 "Người vào đầu tiên bật đèn, người ra cuối cùng tắt đèn" — người đọc dùng chung phòng; người ghi cần phòng tối và trống.</p>`],
      [73, 'The Readers and Writers Problem (2)',
        `<p class="y-chinh">🎯 Figure 2-48 (part 2): the writer — <code>while (TRUE) { think_up_data(); /* noncritical region */ down(&amp;db); /* get exclusive access */ write_data_base(); /* update the data */ up(&amp;db); /* release exclusive access */ }</code></p>
<p>The writer is simple: it takes <code>db</code> like an ordinary mutex. The subtlety is <strong>priority</strong>. This solution gives readers priority: as long as at least one reader is active, a new reader is admitted immediately — so with a steady stream of readers, a writer may wait <strong>forever</strong> (writer starvation, which our run on slide 72 measured). The book's alternative: when a writer is waiting, new readers are not admitted but queue behind the writer; then a writer waits only for the readers already inside, at the price of less concurrency. A fair version serves everyone in arrival order.</p>
<pre class="trich"><code class="language-c">void *writer(void *arg) {
    usleep(50 * 1000);                          // the writer arrives at 50 ms
    double a = now_ms();
    sem_wait(&amp;db);                              /* get exclusive access */
    printf("writer waited %4.0f ms before it could write\\n", now_ms() - a);
    sem_post(&amp;db);                              /* release exclusive access */
    return NULL;
}</code></pre>
<p>➕ Where you meet it: Pthreads has it built in (<code>pthread_rwlock_rdlock</code> / <code>wrlock</code>; glibc lets you choose reader or writer preference), Java has <code>ReentrantReadWriteLock</code> (with an optional <em>fair</em> mode) and <code>StampedLock</code>, Go has <code>sync.RWMutex</code> (which blocks new readers once a writer waits). Databases solve the same problem at a different scale: PostgreSQL's MVCC lets readers see an old version while a writer works, so readers never block writers — the RCU idea of slide 54.</p>
<p class="pitfall">⚠️ FE2#10: in the readers–writers problem, writer starvation is caused by <strong>a continuous stream of incoming readers</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình 2-48 (phần 2): người ghi — <code>while (TRUE) { think_up_data(); /* vùng không găng */ down(&amp;db); /* lấy quyền độc quyền */ write_data_base(); /* cập nhật dữ liệu */ up(&amp;db); /* nhả quyền độc quyền */ }</code></p>
<p>Người ghi thì đơn giản: nó lấy <code>db</code> như một mutex bình thường. Chỗ tinh tế là <strong>quyền ưu tiên</strong>. Lời giải này ưu tiên người đọc: chừng nào còn ít nhất một người đọc đang đọc, người đọc mới được vào ngay — nên với dòng người đọc liên tục, người ghi có thể chờ <strong>mãi mãi</strong> (người ghi bị bỏ đói, điều lần chạy ở slide 72 đã đo được). Phương án thay thế của sách: khi có người ghi đang chờ, người đọc mới không được vào mà phải xếp hàng sau người ghi; khi đó người ghi chỉ chờ những người đọc đang ở bên trong, đổi lại ít song song hơn. Một bản công bằng phục vụ mọi người theo thứ tự tới.</p>
<pre class="trich"><code class="language-c">void *writer(void *arg) {
    usleep(50 * 1000);                          // người ghi tới lúc 50 ms
    double a = now_ms();
    sem_wait(&amp;db);                              /* get exclusive access */
    printf("writer waited %4.0f ms before it could write\\n", now_ms() - a);
    sem_post(&amp;db);                              /* release exclusive access */
    return NULL;
}</code></pre>
<p>➕ Bạn gặp nó ở đâu: Pthreads có sẵn (<code>pthread_rwlock_rdlock</code> / <code>wrlock</code>; glibc cho chọn ưu tiên người đọc hay người ghi), Java có <code>ReentrantReadWriteLock</code> (có chế độ <em>công bằng</em> tuỳ chọn) và <code>StampedLock</code>, Go có <code>sync.RWMutex</code> (chặn người đọc mới khi có người ghi đang chờ). Cơ sở dữ liệu giải cùng bài toán ở quy mô khác: MVCC của PostgreSQL cho người đọc thấy phiên bản cũ trong lúc người ghi làm việc, nên người đọc không bao giờ chặn người ghi — ý tưởng RCU của slide 54.</p>
<p class="pitfall">⚠️ FE2#10: trong bài toán người đọc – người ghi, người ghi bị bỏ đói là do <strong>dòng người đọc tới liên tục</strong>.</p>`],
      [74, 'End',
        `<p class="y-chinh">🎯 End of Chapter 2 — processes and threads, how they synchronize, and how the OS decides who runs.</p>
<p>Check yourself before moving on: can you draw the three states and name the illegal transitions (slide 8), list what threads share (slide 18), explain a race condition (slide 28) and the four conditions for a solution (slide 29), solve producer–consumer with three semaphores and say what happens if two downs are swapped (slides 37–38), compute FCFS, SJF, SRTN, Round Robin and Priority schedules by hand and check them with the simulator (slides 59–63), and explain why the naive dining philosophers deadlock (slide 68)? Then do the 🧪 practice lesson 2.D and the Chapter 2 quiz.</p>
<p class="meo">🧠 Next: Chapter 3 gives each of these processes its own address space — memory management, paging and page replacement. The thrashing that made CPU utilization "increase then decrease" (slide 12) is waiting there.</p>`,
        `<p class="y-chinh">🎯 Hết Chương 2 — tiến trình và luồng, chúng đồng bộ với nhau ra sao, và HĐH quyết định ai được chạy thế nào.</p>
<p>Tự kiểm trước khi đi tiếp: bạn có vẽ được ba trạng thái và gọi tên các chuyển đổi không hợp lệ (slide 8), kể được luồng dùng chung những gì (slide 18), giải thích được tranh chấp (slide 28) và bốn điều kiện của một lời giải (slide 29), giải sản xuất–tiêu thụ bằng ba semaphore và nói được chuyện gì xảy ra nếu đảo hai lệnh down (slide 37–38), tính tay lịch FCFS, SJF, SRTN, Round Robin và Priority rồi kiểm bằng bộ mô phỏng (slide 59–63), và giải thích vì sao các triết gia ngây thơ bế tắc (slide 68) chưa? Rồi làm bài 🧪 thực hành 2.D và quiz Chương 2.</p>
<p class="meo">🧠 Tiếp theo: Chương 3 cho mỗi tiến trình này một không gian địa chỉ riêng — quản lý bộ nhớ, phân trang và thay trang. Hiện tượng thrashing làm hiệu suất CPU "tăng rồi giảm" (slide 12) đang chờ bạn ở đó.</p>`],
    ]),
    bi(`<h2>📌 What you can now do</h2>
<ul>
<li>Tell CPU-bound from I/O-bound processes, name the three scheduling environments, their goals, and Linux's policies (OTHER, BATCH, IDLE, FIFO, RR, DEADLINE).</li>
<li>Compute FCFS, SJF, SRTN, Round Robin and Priority schedules — turnaround, waiting and response times — and know the tie-breaking conventions.</li>
<li>Explain aging estimates, multiple queues, guaranteed, lottery and fair-share scheduling, and choose a quantum.</li>
<li>Test a real-time set with Σ C/P ≤ 1 and read an EDF schedule.</li>
<li>Compare user-level and kernel-level thread scheduling (Figure 2-44).</li>
<li>Explain why the naive dining philosophers deadlock, how Figure 2-47 avoids it, and why the readers–writers solution can starve writers.</li>
</ul>`,
    `<h2>📌 Giờ bạn làm được</h2>
<ul>
<li>Phân biệt tiến trình nặng CPU và nặng I/O, kể ba môi trường lập lịch, mục tiêu của chúng và các chính sách của Linux (OTHER, BATCH, IDLE, FIFO, RR, DEADLINE).</li>
<li>Tính lịch FCFS, SJF, SRTN, Round Robin và Priority — thời gian hoàn thành, chờ và đáp ứng — và biết các quy ước khi hoà.</li>
<li>Giải thích ước lượng lão hoá, nhiều hàng đợi, lập lịch bảo đảm, xổ số và chia phần công bằng, và chọn lượng tử.</li>
<li>Kiểm một tập thời gian thực bằng Σ C/P ≤ 1 và đọc lịch EDF.</li>
<li>So sánh lập lịch luồng mức người dùng và mức nhân (Hình 2-44).</li>
<li>Giải thích vì sao triết gia ngây thơ bế tắc, Hình 2-47 tránh nó thế nào, và vì sao lời giải người đọc – người ghi có thể bỏ đói người ghi.</li>
</ul>`),
    books([
      ['mos4', 'Chapter 2, sections 2.4–2.5 (pp. 148–175): Figures 2-39 to 2-48', 'Chương 2, mục 2.4–2.5 (tr. 148–175): Hình 2-39 tới 2-48'],
      ['ostep', 'Chapters 7–10 (scheduling: introduction, MLFQ, proportional share/lottery, multiprocessor) and 31 (semaphores, dining philosophers, reader–writer locks)', 'Chương 7–10 (lập lịch: mở đầu, MLFQ, chia phần/xổ số, nhiều bộ xử lý) và 31 (semaphore, triết gia ăn tối, khoá đọc–ghi)'],
      ['man7', 'sched(7), chrt(1), nice(1), taskset(1), getrusage(2), sched_setscheduler(2), pthread_rwlock_rdlock(3p)', 'sched(7), chrt(1), nice(1), taskset(1), getrusage(2), sched_setscheduler(2), pthread_rwlock_rdlock(3p)'],
      ['kernelDocs', 'Documentation/scheduler/ (sched-design-CFS, sched-eevdf, sched-deadline, sched-rt-group)', 'Documentation/scheduler/ (sched-design-CFS, sched-eevdf, sched-deadline, sched-rt-group)'],
      ['mchoes', 'Chapter 4 (processor scheduling policies and algorithms, with worked Gantt charts) and Chapter 6 (concurrent processes)', 'Chương 4 (chính sách và thuật toán lập lịch bộ xử lý, có biểu đồ Gantt giải mẫu) và Chương 6 (tiến trình đồng thời)'],
    ]),
  ].join('\n'),
};

/* ───────── 2.D — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 2: zombies, threads, races, semaphores, scheduling ───────── */
const L_on_ch2 = {
  title: '2.D — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 2: zombies, threads, races, semaphores, scheduling|||2.D — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Chương 2: zombie, luồng, tranh chấp, semaphore, lập lịch',
  slug: 'osg202-on-ch2',
  type: 'VIDEO',
  description: '7 bài tập Chương 2 có lời giải chạy thật trên Linux: tạo và thu dọn tiến trình zombie, tiến trình mồ côi được PID 1 nhận nuôi, đoán output của chương trình trộn luồng và fork, sửa tranh chấp bằng mutex và atomic kèm số đo thời gian, bộ đệm có giới hạn với hai bên sản xuất và hai bên tiêu thụ bằng ba semaphore, bài tính lập lịch kiểu FE với năm tiến trình và sáu thuật toán (Gantt và đáp án do bộ mô phỏng tính), sửa bế tắc của các triết gia bằng thứ tự chẵn – lẻ, và dùng chrt, renice, taskset, /proc/<pid>/sched để điều khiển bộ lập lịch Linux; kèm bảng thuật ngữ Anh–Việt và tóm tắt chương.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.D · Practice &amp; review</span>
<h2>Seven exercises: processes, threads, synchronization and scheduling with your own hands</h2>
<p class="lead">Chapter 2 is where the FE puts its calculations and its trickiest concept questions. Try each exercise first (the time is a target), then open the solution: every program was compiled and run in the course's Linux container, every Gantt chart was computed by the simulator, and the outputs are real. Exercises 2 and 5 are exactly the kind of question the FE asks; exercises 3, 4 and 6 are the programs a Lab or an interview asks you to write.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>1</td><td>create a zombie on purpose, reap it, watch an orphan get adopted</td><td>2.A slides 6–8</td></tr>
<tr><td>2</td><td>predict the output of a program mixing threads and fork</td><td>2.A slides 17–18</td></tr>
<tr><td>3</td><td>fix a race condition two ways, and measure the cost</td><td>2.B slides 28, 33, 40</td></tr>
<tr><td>4</td><td>bounded buffer with two producers and two consumers</td><td>2.B slides 37–38</td></tr>
<tr><td>5</td><td>the scheduling calculation: five processes, six algorithms</td><td>2.C slides 59–63</td></tr>
<tr><td>6</td><td>break the dining philosophers' deadlock in one line</td><td>2.C slides 67–71</td></tr>
<tr><td>7</td><td>control the Linux scheduler: policy, nice, CPU affinity</td><td>2.C slides 57, 63</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 2 · Bài 2.D · Thực hành &amp; ôn tập</span>
<h2>Bảy bài tập: tiến trình, luồng, đồng bộ và lập lịch bằng chính tay bạn</h2>
<p class="lead">Chương 2 là nơi FE đặt các câu tính toán và các câu khái niệm hóc nhất. Tự làm từng bài trước (thời gian ghi kèm là mục tiêu), rồi mới mở lời giải: chương trình nào cũng đã được biên dịch và chạy trong container Linux của môn, biểu đồ Gantt nào cũng do bộ mô phỏng tính, và output là thật. Bài 2 và bài 5 đúng là dạng câu FE hỏi; bài 3, 4 và 6 là những chương trình mà Lab hay buổi phỏng vấn bắt bạn viết.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>1</td><td>cố ý tạo zombie, thu dọn nó, xem tiến trình mồ côi được nhận nuôi</td><td>2.A slide 6–8</td></tr>
<tr><td>2</td><td>đoán output của chương trình trộn luồng và fork</td><td>2.A slide 17–18</td></tr>
<tr><td>3</td><td>sửa tranh chấp bằng hai cách, và đo cái giá</td><td>2.B slide 28, 33, 40</td></tr>
<tr><td>4</td><td>bộ đệm có giới hạn với hai bên sản xuất và hai bên tiêu thụ</td><td>2.B slide 37–38</td></tr>
<tr><td>5</td><td>bài tính lập lịch: năm tiến trình, sáu thuật toán</td><td>2.C slide 59–63</td></tr>
<tr><td>6</td><td>phá bế tắc của các triết gia bằng một dòng</td><td>2.C slide 67–71</td></tr>
<tr><td>7</td><td>điều khiển bộ lập lịch Linux: chính sách, nice, CPU được dùng</td><td>2.C slide 57, 63</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — make a zombie, reap it, and meet an orphan (15 min)</h3>
<p>(a) Which of these transitions are legal in Figure 2-2: Running → Blocked, Ready → Blocked, Blocked → Running, Blocked → Ready, Running → Ready, Ready → Running? (b) Write a C program whose child exits with status 7 while the parent sleeps for a second without calling <code>wait</code>; show the child with <code>ps</code>, then reap it and print its status. (c) Make a grandchild whose parent exits first: who is its parent afterwards?</p>
<details><summary>Solution — with the real run</summary>
<p>(a) Legal: Running → Blocked (1), Running → Ready (2), Ready → Running (3), Blocked → Ready (4). Illegal: <strong>Ready → Blocked</strong> (a process must be running to execute the call that blocks it) and <strong>Blocked → Running</strong> (after the event the process goes back to Ready and waits for the scheduler). (b) and (c):</p>
<pre><code class="language-c">// Exercise 1: make a zombie on purpose, look at it, then reap it; and watch an orphan get a new parent
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    pid_t z = fork();
    if (z == 0) exit(7);                        // the child ends at once
    sleep(1);                                   // the parent does NOT wait yet
    printf("--- child finished, parent has not called wait():\\n");
    system("ps -o pid,ppid,stat,args --ppid $PPID | grep -v ps");   // children of this program
    int st;
    waitpid(z, &amp;st, 0);                         // reap it: read its exit status
    printf("--- after waitpid: exit status %d collected, zombie gone:\\n", WEXITSTATUS(st));
    system("ps -o pid,ppid,stat,args --ppid $PPID | grep -v ps");   // children of this program

    if (fork() == 0) {                          // orphan: a child whose parent dies first
        if (fork() == 0) {
            printf("--- grandchild: my parent is %d\\n", getppid());
            sleep(1);
            printf("--- grandchild after its parent exited: my parent is now %d\\n", getppid());
            exit(0);
        }
        usleep(200 * 1000);
        exit(0);                                // the middle process dies, the grandchild is orphaned
    }
    sleep(2);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread xac-song.c -o xac-song &amp;&amp; ./xac-song<br>
--- child finished, parent has not called wait():<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 Z &nbsp;&nbsp;&nbsp;[xac-song] &lt;defunct&gt;<br>
--- after waitpid: exit status 7 collected, zombie gone:<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT COMMAND<br>
--- grandchild: my parent is 20<br>
--- grandchild after its parent exited: my parent is now 1</div>
<p>Before <code>waitpid</code>, the finished child is still in the process table with STAT <code>Z</code> and name <code>&lt;defunct&gt;</code>: a <strong>zombie</strong> keeps its PID and exit status until the parent collects them. After <code>waitpid</code> the parent got status 7 and the entry is gone. The grandchild's parent changed to <strong>1</strong> when its parent exited: orphans are adopted by PID 1 (here the container's first process, on a full Linux <code>systemd</code> — or a "subreaper"), which waits for them. A server that forks without waiting fills the process table with zombies; old lesson 2.3 tells that story.</p>
</details>`,
    `<h3>🧪 Bài 1 — tạo zombie, thu dọn nó, và gặp tiến trình mồ côi (15 phút)</h3>
<p>(a) Chuyển đổi nào sau đây hợp lệ trong Hình 2-2: Running → Blocked, Ready → Blocked, Blocked → Running, Blocked → Ready, Running → Ready, Ready → Running? (b) Viết chương trình C có tiến trình con thoát với mã 7 trong lúc cha ngủ một giây mà không gọi <code>wait</code>; dùng <code>ps</code> cho thấy con, rồi thu dọn nó và in mã thoát. (c) Tạo một tiến trình cháu có cha thoát trước: sau đó cha của nó là ai?</p>
<details><summary>Lời giải — kèm lần chạy thật</summary>
<p>(a) Hợp lệ: Running → Blocked (1), Running → Ready (2), Ready → Running (3), Blocked → Ready (4). Không hợp lệ: <strong>Ready → Blocked</strong> (tiến trình phải đang chạy mới thực thi được lời gọi làm nó bị chặn) và <strong>Blocked → Running</strong> (sau sự kiện tiến trình quay về Ready và chờ bộ lập lịch). (b) và (c):</p>
<pre><code class="language-c">// Bài 1: cố ý tạo một xác sống, nhìn nó, rồi thu dọn nó; và xem một tiến trình mồ côi được nhận cha mới
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    pid_t z = fork();
    if (z == 0) exit(7);                        // tiến trình con kết thúc ngay
    sleep(1);                                   // cha CHƯA gọi wait
    printf("--- child finished, parent has not called wait():\\n");
    system("ps -o pid,ppid,stat,args --ppid $PPID | grep -v ps");   // các con của chương trình này
    int st;
    waitpid(z, &amp;st, 0);                         // thu dọn: đọc mã thoát của nó
    printf("--- after waitpid: exit status %d collected, zombie gone:\\n", WEXITSTATUS(st));
    system("ps -o pid,ppid,stat,args --ppid $PPID | grep -v ps");   // các con của chương trình này

    if (fork() == 0) {                          // mồ côi: con có cha chết trước
        if (fork() == 0) {
            printf("--- grandchild: my parent is %d\\n", getppid());
            sleep(1);
            printf("--- grandchild after its parent exited: my parent is now %d\\n", getppid());
            exit(0);
        }
        usleep(200 * 1000);
        exit(0);                                // tiến trình giữa chết, cháu thành mồ côi
    }
    sleep(2);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread xac-song.c -o xac-song &amp;&amp; ./xac-song<br>
--- child finished, parent has not called wait():<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 Z &nbsp;&nbsp;&nbsp;[xac-song] &lt;defunct&gt;<br>
--- after waitpid: exit status 7 collected, zombie gone:<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT COMMAND<br>
--- grandchild: my parent is 20<br>
--- grandchild after its parent exited: my parent is now 1</div>
<p>Trước <code>waitpid</code>, tiến trình con đã xong vẫn nằm trong bảng tiến trình với STAT <code>Z</code> và tên <code>&lt;defunct&gt;</code>: một <strong>zombie (xác sống)</strong> giữ PID và mã thoát tới khi cha lấy chúng. Sau <code>waitpid</code> cha nhận mã 7 và mục đó biến mất. Cha của tiến trình cháu đổi thành <strong>1</strong> khi cha nó thoát: tiến trình mồ côi được PID 1 nhận nuôi (ở đây là tiến trình đầu tiên của container, trên Linux đầy đủ là <code>systemd</code> — hoặc một "subreaper"), tiến trình này wait hộ chúng. Một máy chủ fork mà không wait sẽ làm đầy bảng tiến trình bằng zombie; bài cũ 2.3 kể chuyện đó.</p>
</details>`),
    bi(`<h3>🧪 Exercise 2 — predict the output: threads share, fork copies (10 min)</h3>
<p>Without running it, write down the three lines this program prints. <code>x</code> starts at 10; a thread adds 5; then a child created by <code>fork</code> doubles <code>x</code>.</p>
<pre><code class="language-c">// Exercise 2: predict the output — one global variable, changed once by a THREAD and once by a forked CHILD
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;pthread.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int x = 10;

void *add5(void *arg) { x = x + 5; return NULL; }

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    pthread_t t;
    pthread_create(&amp;t, NULL, add5, NULL);
    pthread_join(t, NULL);
    printf("A: after the thread, x = %d\\n", x);
    pid_t p = fork();
    if (p == 0) {
        x = x * 2;
        printf("B: in the child, x = %d\\n", x);
        exit(0);
    }
    wait(NULL);
    printf("C: in the parent after the child, x = %d\\n", x);
    return 0;
}</code></pre>
<details><summary>Solution</summary>
<div class="out">$ gcc -Wall -O0 -pthread fork-hay-luong.c -o fork-hay-luong &amp;&amp; ./fork-hay-luong<br>
A: after the thread, x = 15<br>
B: in the child, x = 30<br>
C: in the parent after the child, x = 15</div>
<p>A: the thread runs in the <strong>same address space</strong>, so its <code>x = x + 5</code> changes the one and only <code>x</code>: 15 (and <code>pthread_join</code> guarantees it has finished). B: <code>fork</code> copies the whole address space; the child doubles <em>its copy</em>: 30. C: the parent's <code>x</code> is untouched: 15. The FE version of this question asks "which variables are shared" — globals, heap and open files between threads (FE2#7), nothing between processes after <code>fork</code> (except open file descriptors, which point to shared file table entries). Note the <code>setvbuf</code> line: without line buffering, a <code>printf</code> still in the buffer at <code>fork</code> would be printed twice — one copy per process.</p>
</details>`,
    `<h3>🧪 Bài 2 — đoán output: luồng dùng chung, fork thì chép (10 phút)</h3>
<p>Không chạy, hãy viết ra ba dòng mà chương trình này in. <code>x</code> bắt đầu bằng 10; một luồng cộng 5; rồi một tiến trình con tạo bằng <code>fork</code> nhân đôi <code>x</code>.</p>
<pre><code class="language-c">// Bài 2: đoán output — một biến toàn cục, bị một LUỒNG sửa một lần và một tiến trình CON (fork) sửa một lần
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;pthread.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int x = 10;

void *add5(void *arg) { x = x + 5; return NULL; }

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    pthread_t t;
    pthread_create(&amp;t, NULL, add5, NULL);
    pthread_join(t, NULL);
    printf("A: after the thread, x = %d\\n", x);
    pid_t p = fork();
    if (p == 0) {
        x = x * 2;
        printf("B: in the child, x = %d\\n", x);
        exit(0);
    }
    wait(NULL);
    printf("C: in the parent after the child, x = %d\\n", x);
    return 0;
}</code></pre>
<details><summary>Lời giải</summary>
<div class="out">$ gcc -Wall -O0 -pthread fork-hay-luong.c -o fork-hay-luong &amp;&amp; ./fork-hay-luong<br>
A: after the thread, x = 15<br>
B: in the child, x = 30<br>
C: in the parent after the child, x = 15</div>
<p>A: luồng chạy trong <strong>cùng không gian địa chỉ</strong>, nên <code>x = x + 5</code> của nó sửa đúng cái <code>x</code> duy nhất: 15 (và <code>pthread_join</code> bảo đảm nó đã chạy xong). B: <code>fork</code> chép toàn bộ không gian địa chỉ; tiến trình con nhân đôi <em>bản sao của nó</em>: 30. C: <code>x</code> của cha không bị đụng tới: 15. Phiên bản FE của câu này hỏi "biến nào được dùng chung" — biến toàn cục, heap và tệp đang mở giữa các luồng (FE2#7), không gì cả giữa các tiến trình sau <code>fork</code> (trừ bộ mô tả tệp đang mở, vốn trỏ tới mục bảng tệp dùng chung). Để ý dòng <code>setvbuf</code>: không có đệm theo dòng thì một lệnh <code>printf</code> còn nằm trong bộ đệm lúc <code>fork</code> sẽ bị in hai lần — mỗi tiến trình một bản.</p>
</details>`),
    bi(`<h3>🧪 Exercise 3 — fix the race: a mutex or an atomic? (20 min)</h3>
<p>Four threads each add 1 to a shared counter 3 000 000 times. All four threads start together at a barrier. Write three versions — (a) no protection, (b) a <code>pthread_mutex_t</code> around the increment, (c) <code>atomic_fetch_add</code> from <code>&lt;stdatomic.h&gt;</code> — and measure the total and the time of each.</p>
<details><summary>Solution — one real run</summary>
<pre><code class="language-c">// Exercise 3: the same 4-thread counter three ways — no lock, a mutex, an atomic add
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;stdatomic.h&gt;
#include &lt;time.h&gt;

#define THREADS 4
#define TIMES 3000000
long plain = 0;
long guarded = 0;
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
atomic_long atom = 0;
int mode;
pthread_barrier_t start;                // all threads start together

void *work(void *arg) {
    pthread_barrier_wait(&amp;start);
    for (int i = 0; i &lt; TIMES; i++) {
        if (mode == 0) plain = plain + 1;                                       // race
        else if (mode == 1) { pthread_mutex_lock(&amp;m); guarded++; pthread_mutex_unlock(&amp;m); }
        else atomic_fetch_add(&amp;atom, 1);                                        // one indivisible instruction
    }
    return NULL;
}

int main(void) {
    const char *name[] = {"no lock", "mutex", "atomic"};
    pthread_barrier_init(&amp;start, NULL, THREADS);
    for (mode = 0; mode &lt; 3; mode++) {
        struct timespec a, b;
        clock_gettime(CLOCK_MONOTONIC, &amp;a);
        pthread_t t[THREADS];
        for (int i = 0; i &lt; THREADS; i++) pthread_create(&amp;t[i], NULL, work, NULL);
        for (int i = 0; i &lt; THREADS; i++) pthread_join(t[i], NULL);
        clock_gettime(CLOCK_MONOTONIC, &amp;b);
        long total = mode == 0 ? plain : mode == 1 ? guarded : atom;
        printf("%-8s: total = %8ld   time %4.0f ms\\n", name[mode], total,
               (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread sua-tranh-chap.c -o sua-tranh-chap &amp;&amp; ./sua-tranh-chap<br>
no lock : total = 10093940 &nbsp;&nbsp;time &nbsp;&nbsp;64 ms<br>
mutex &nbsp;&nbsp;: total = 12000000 &nbsp;&nbsp;time &nbsp;392 ms<br>
atomic &nbsp;: total = 12000000 &nbsp;&nbsp;time &nbsp;310 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>(a) is fast and wrong: a large share of the 12 000 000 updates is lost (a different number on every run) (slide 28 explains the LOAD/ADD/STORE race). (b) and (c) are both exact. The atomic version is faster than the mutex here because one atomic instruction (slide 34) replaces lock + increment + unlock; the mutex still wins when the critical region is more than one variable — you cannot update a list, a map or two balances with one atomic instruction. Both are much slower than (a): with four threads hammering one variable, the cache line holding it bounces between cores on every increment. The real cure for a hot counter is to give each thread its own counter and add them up at the end (Java's <code>LongAdder</code> does exactly that).</p>
</details>`,
    `<h3>🧪 Bài 3 — sửa tranh chấp: mutex hay atomic? (20 phút)</h3>
<p>Bốn luồng, mỗi luồng cộng 1 vào một bộ đếm dùng chung 3 000 000 lần. Cả bốn luồng xuất phát cùng lúc nhờ một rào chắn. Viết ba bản — (a) không bảo vệ, (b) một <code>pthread_mutex_t</code> quanh phép tăng, (c) <code>atomic_fetch_add</code> của <code>&lt;stdatomic.h&gt;</code> — rồi đo tổng và thời gian của từng bản.</p>
<details><summary>Lời giải — một lần chạy thật</summary>
<pre><code class="language-c">// Bài 3: cùng bộ đếm 4 luồng làm ba cách — không khoá, mutex, cộng nguyên tử
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;stdatomic.h&gt;
#include &lt;time.h&gt;

#define THREADS 4
#define TIMES 3000000
long plain = 0;
long guarded = 0;
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
atomic_long atom = 0;
int mode;
pthread_barrier_t start;                // mọi luồng xuất phát cùng lúc

void *work(void *arg) {
    pthread_barrier_wait(&amp;start);
    for (int i = 0; i &lt; TIMES; i++) {
        if (mode == 0) plain = plain + 1;                                       // tranh chấp
        else if (mode == 1) { pthread_mutex_lock(&amp;m); guarded++; pthread_mutex_unlock(&amp;m); }
        else atomic_fetch_add(&amp;atom, 1);                                        // một lệnh không chia cắt
    }
    return NULL;
}

int main(void) {
    const char *name[] = {"no lock", "mutex", "atomic"};
    pthread_barrier_init(&amp;start, NULL, THREADS);
    for (mode = 0; mode &lt; 3; mode++) {
        struct timespec a, b;
        clock_gettime(CLOCK_MONOTONIC, &amp;a);
        pthread_t t[THREADS];
        for (int i = 0; i &lt; THREADS; i++) pthread_create(&amp;t[i], NULL, work, NULL);
        for (int i = 0; i &lt; THREADS; i++) pthread_join(t[i], NULL);
        clock_gettime(CLOCK_MONOTONIC, &amp;b);
        long total = mode == 0 ? plain : mode == 1 ? guarded : atom;
        printf("%-8s: total = %8ld   time %4.0f ms\\n", name[mode], total,
               (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread sua-tranh-chap.c -o sua-tranh-chap &amp;&amp; ./sua-tranh-chap<br>
no lock : total = 10093940 &nbsp;&nbsp;time &nbsp;&nbsp;64 ms<br>
mutex &nbsp;&nbsp;: total = 12000000 &nbsp;&nbsp;time &nbsp;392 ms<br>
atomic &nbsp;: total = 12000000 &nbsp;&nbsp;time &nbsp;310 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>(a) nhanh và sai: mất một phần lớn trong 12 000 000 lần cập nhật (mỗi lần chạy một số khác) (slide 28 giải thích tranh chấp LOAD/ADD/STORE). (b) và (c) đều đúng tuyệt đối. Bản atomic nhanh hơn bản mutex ở đây vì một lệnh nguyên tử (slide 34) thay cho khoá + tăng + mở khoá; mutex vẫn thắng khi vùng găng nhiều hơn một biến — bạn không cập nhật được một danh sách, một map hay hai số dư tài khoản bằng một lệnh nguyên tử. Cả hai đều chậm hơn nhiều so với (a): bốn luồng cùng dội vào một biến khiến dòng cache chứa nó bị chuyền qua lại giữa các lõi ở mỗi lần tăng. Cách chữa thật cho một bộ đếm "nóng" là cho mỗi luồng một bộ đếm riêng rồi cộng lại ở cuối (<code>LongAdder</code> của Java làm đúng như vậy).</p>
</details>`),
    bi(`<h3>🧪 Exercise 4 — a bounded buffer with two producers and two consumers (25 min)</h3>
<p>Extend Figure 2-28: a buffer of N = 3 slots, two producers (one makes 1…1000, the other 1001…2000), two consumers that each take 1000 items. Do the three semaphores <code>mutex</code>, <code>empty</code>, <code>full</code> still suffice, or do you need more? Check by summing everything consumed.</p>
<details><summary>Solution — with the real run</summary>
<pre><code class="language-c">// Exercise 4: a bounded buffer with TWO producers and TWO consumers — the three semaphores of Figure 2-28 still suffice
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;semaphore.h&gt;

#define N 3
#define PER_PRODUCER 1000
int buffer[N], in = 0, out = 0;
sem_t mutex, empty, full;
long consumed_sum[2], consumed_count[2];

void *producer(void *arg) {
    int base = (int)(long)arg * PER_PRODUCER;           // producer 0 makes 1..1000, producer 1 makes 1001..2000
    for (int k = 1; k &lt;= PER_PRODUCER; k++) {
        sem_wait(&amp;empty);
        sem_wait(&amp;mutex);
        buffer[in] = base + k; in = (in + 1) % N;
        sem_post(&amp;mutex);
        sem_post(&amp;full);
    }
    return NULL;
}

void *consumer(void *arg) {
    int me = (int)(long)arg;
    for (int k = 0; k &lt; PER_PRODUCER; k++) {              // 2 consumers x 1000 = all 2000 items
        sem_wait(&amp;full);
        sem_wait(&amp;mutex);
        int item = buffer[out]; out = (out + 1) % N;
        sem_post(&amp;mutex);
        sem_post(&amp;empty);
        consumed_sum[me] += item;
        consumed_count[me]++;
    }
    return NULL;
}

int main(void) {
    sem_init(&amp;mutex, 0, 1); sem_init(&amp;empty, 0, N); sem_init(&amp;full, 0, 0);
    pthread_t p[2], c[2];
    for (long i = 0; i &lt; 2; i++) { pthread_create(&amp;p[i], NULL, producer, (void *)i); pthread_create(&amp;c[i], NULL, consumer, (void *)i); }
    for (int i = 0; i &lt; 2; i++) { pthread_join(p[i], NULL); pthread_join(c[i], NULL); }
    printf("items consumed: %ld\\n", consumed_count[0] + consumed_count[1]);
    printf("sum of items  : %ld (1 + 2 + ... + 2000 = %d)\\n", consumed_sum[0] + consumed_sum[1], 2000 * 2001 / 2);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bo-dem.c -o bo-dem &amp;&amp; ./bo-dem<br>
items consumed: 2000<br>
sum of items &nbsp;: 2001000 (1 + 2 + ... + 2000 = 2001000)</div>
<p>They suffice. <code>empty</code> and <code>full</code> count slots no matter how many processes produce or consume, and <code>mutex</code> makes the buffer operations — including the shared indices <code>in</code> and <code>out</code> — one-at-a-time. All 2000 items arrived exactly once (sum 2 001 000 = 2000·2001/2). The two traps: (1) <code>in</code> and <code>out</code> must be updated <em>inside</em> the mutex, otherwise two producers write the same slot (the spooler race of slide 28 again); (2) never take <code>mutex</code> before <code>empty</code>/<code>full</code> (slide 38). In Java this whole exercise is one <code>ArrayBlockingQueue</code> (slide 50).</p>
</details>`,
    `<h3>🧪 Bài 4 — bộ đệm có giới hạn với hai bên sản xuất và hai bên tiêu thụ (25 phút)</h3>
<p>Mở rộng Hình 2-28: bộ đệm N = 3 ô, hai bên sản xuất (một bên làm 1…1000, bên kia 1001…2000), hai bên tiêu thụ mỗi bên lấy 1000 món. Ba semaphore <code>mutex</code>, <code>empty</code>, <code>full</code> còn đủ không, hay cần thêm? Kiểm bằng cách cộng mọi thứ đã tiêu thụ.</p>
<details><summary>Lời giải — kèm lần chạy thật</summary>
<pre><code class="language-c">// Bài 4: bộ đệm có giới hạn với HAI bên sản xuất và HAI bên tiêu thụ — ba semaphore của Hình 2-28 vẫn đủ
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;semaphore.h&gt;

#define N 3
#define PER_PRODUCER 1000
int buffer[N], in = 0, out = 0;
sem_t mutex, empty, full;
long consumed_sum[2], consumed_count[2];

void *producer(void *arg) {
    int base = (int)(long)arg * PER_PRODUCER;           // bên 0 làm 1..1000, bên 1 làm 1001..2000
    for (int k = 1; k &lt;= PER_PRODUCER; k++) {
        sem_wait(&amp;empty);
        sem_wait(&amp;mutex);
        buffer[in] = base + k; in = (in + 1) % N;
        sem_post(&amp;mutex);
        sem_post(&amp;full);
    }
    return NULL;
}

void *consumer(void *arg) {
    int me = (int)(long)arg;
    for (int k = 0; k &lt; PER_PRODUCER; k++) {              // 2 bên tiêu thụ x 1000 = đủ 2000 món
        sem_wait(&amp;full);
        sem_wait(&amp;mutex);
        int item = buffer[out]; out = (out + 1) % N;
        sem_post(&amp;mutex);
        sem_post(&amp;empty);
        consumed_sum[me] += item;
        consumed_count[me]++;
    }
    return NULL;
}

int main(void) {
    sem_init(&amp;mutex, 0, 1); sem_init(&amp;empty, 0, N); sem_init(&amp;full, 0, 0);
    pthread_t p[2], c[2];
    for (long i = 0; i &lt; 2; i++) { pthread_create(&amp;p[i], NULL, producer, (void *)i); pthread_create(&amp;c[i], NULL, consumer, (void *)i); }
    for (int i = 0; i &lt; 2; i++) { pthread_join(p[i], NULL); pthread_join(c[i], NULL); }
    printf("items consumed: %ld\\n", consumed_count[0] + consumed_count[1]);
    printf("sum of items  : %ld (1 + 2 + ... + 2000 = %d)\\n", consumed_sum[0] + consumed_sum[1], 2000 * 2001 / 2);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bo-dem.c -o bo-dem &amp;&amp; ./bo-dem<br>
items consumed: 2000<br>
sum of items &nbsp;: 2001000 (1 + 2 + ... + 2000 = 2001000)</div>
<p>Vẫn đủ. <code>empty</code> và <code>full</code> đếm số ô bất kể có bao nhiêu tiến trình sản xuất hay tiêu thụ, còn <code>mutex</code> làm cho các thao tác trên bộ đệm — kể cả hai chỉ số dùng chung <code>in</code> và <code>out</code> — diễn ra lần lượt từng cái một. Cả 2000 món tới đúng một lần (tổng 2 001 000 = 2000·2001/2). Hai cái bẫy: (1) <code>in</code> và <code>out</code> phải được cập nhật <em>bên trong</em> mutex, không thì hai bên sản xuất ghi cùng một ô (lại tranh chấp spooler của slide 28); (2) không bao giờ lấy <code>mutex</code> trước <code>empty</code>/<code>full</code> (slide 38). Trong Java cả bài này chỉ là một <code>ArrayBlockingQueue</code> (slide 50).</p>
</details>`),
    bi(`<h3>🧪 Exercise 5 — the scheduling calculation, FE style (30 min)</h3>
<p>Five processes (arrival / burst / priority, where <strong>1 = highest</strong>): A 0/6/3, B 1/3/1, C 2/8/4, D 3/2/2, E 5/4/5. For FCFS, SJF (nonpreemptive), SRTF, Round Robin with q = 2, Priority (nonpreemptive) and Priority (preemptive): draw the Gantt chart and compute the average waiting time. Conventions (as in the course simulator and most exam keys): ties go to the earlier arrival; in RR a process arriving during a slice joins the queue before the preempted one; preemption only by a strictly better process.</p>
<details><summary>Solution — every chart computed by the simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/443d2a1f2ff100c05c97f492cbd68fb6ce1803a4.svg" alt="FCFS: the convoy behind A and C" loading="lazy" /><p class="chu-thich">🧮 FCFS: the convoy behind A and C</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Priority (1 = highest)</th><th>Completion</th><th>Turnaround</th><th>Waiting</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>6</td><td>3</td><td>6</td><td>6</td><td>0</td></tr>
<tr><td>B</td><td>1</td><td>3</td><td>1</td><td>9</td><td>8</td><td>5</td></tr>
<tr><td>C</td><td>2</td><td>8</td><td>4</td><td>17</td><td>15</td><td>7</td></tr>
<tr><td>D</td><td>3</td><td>2</td><td>2</td><td>19</td><td>16</td><td>14</td></tr>
<tr><td>E</td><td>5</td><td>4</td><td>5</td><td>23</td><td>18</td><td>14</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'A', den: 0, chay: 6, uuTien: 3 },
  { ten: 'B', den: 1, chay: 3, uuTien: 1 },
  { ten: 'C', den: 2, chay: 8, uuTien: 4 },
  { ten: 'D', den: 3, chay: 2, uuTien: 2 },
  { ten: 'E', den: 5, chay: 4, uuTien: 5 },
];
const TAT_CA = [['fcfs'], ['sjf'], ['srtf'], ['rr', 2], ['prio'], ['prio-p']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fffa6e855e88e087972164e522bbee8a1d5436cf.svg" alt="SJF (nonpreemptive): at t = 6, the shortest ready job D goes first" loading="lazy" /><p class="chu-thich">🧮 SJF (nonpreemptive): at t = 6, the shortest ready job D goes first</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Priority (1 = highest)</th><th>Completion</th><th>Turnaround</th><th>Waiting</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>6</td><td>3</td><td>6</td><td>6</td><td>0</td></tr>
<tr><td>B</td><td>1</td><td>3</td><td>1</td><td>11</td><td>10</td><td>7</td></tr>
<tr><td>C</td><td>2</td><td>8</td><td>4</td><td>23</td><td>21</td><td>13</td></tr>
<tr><td>D</td><td>3</td><td>2</td><td>2</td><td>8</td><td>5</td><td>3</td></tr>
<tr><td>E</td><td>5</td><td>4</td><td>5</td><td>15</td><td>10</td><td>6</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'A', den: 0, chay: 6, uuTien: 3 },
  { ten: 'B', den: 1, chay: 3, uuTien: 1 },
  { ten: 'C', den: 2, chay: 8, uuTien: 4 },
  { ten: 'D', den: 3, chay: 2, uuTien: 2 },
  { ten: 'E', den: 5, chay: 4, uuTien: 5 },
];
const TAT_CA = [['fcfs'], ['sjf'], ['srtf'], ['rr', 2], ['prio'], ['prio-p']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e006ba653b78283760b4a0643f85a62d57eba843.svg" alt="SRTF: B preempts A at t = 1; best average waiting" loading="lazy" /><p class="chu-thich">🧮 SRTF: B preempts A at t = 1; best average waiting</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Priority (1 = highest)</th><th>Completion</th><th>Turnaround</th><th>Waiting</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>6</td><td>3</td><td>15</td><td>15</td><td>9</td></tr>
<tr><td>B</td><td>1</td><td>3</td><td>1</td><td>4</td><td>3</td><td>0</td></tr>
<tr><td>C</td><td>2</td><td>8</td><td>4</td><td>23</td><td>21</td><td>13</td></tr>
<tr><td>D</td><td>3</td><td>2</td><td>2</td><td>6</td><td>3</td><td>1</td></tr>
<tr><td>E</td><td>5</td><td>4</td><td>5</td><td>10</td><td>5</td><td>1</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'A', den: 0, chay: 6, uuTien: 3 },
  { ten: 'B', den: 1, chay: 3, uuTien: 1 },
  { ten: 'C', den: 2, chay: 8, uuTien: 4 },
  { ten: 'D', den: 3, chay: 2, uuTien: 2 },
  { ten: 'E', den: 5, chay: 4, uuTien: 5 },
];
const TAT_CA = [['fcfs'], ['sjf'], ['srtf'], ['rr', 2], ['prio'], ['prio-p']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/33fafa71c00d8cb6fe451080154357a8ef377c69.svg" alt="Round Robin, q = 2" loading="lazy" /><p class="chu-thich">🧮 Round Robin, q = 2</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Priority (1 = highest)</th><th>Completion</th><th>Turnaround</th><th>Waiting</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>6</td><td>3</td><td>17</td><td>17</td><td>11</td></tr>
<tr><td>B</td><td>1</td><td>3</td><td>1</td><td>11</td><td>10</td><td>7</td></tr>
<tr><td>C</td><td>2</td><td>8</td><td>4</td><td>23</td><td>21</td><td>13</td></tr>
<tr><td>D</td><td>3</td><td>2</td><td>2</td><td>10</td><td>7</td><td>5</td></tr>
<tr><td>E</td><td>5</td><td>4</td><td>5</td><td>19</td><td>14</td><td>10</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'A', den: 0, chay: 6, uuTien: 3 },
  { ten: 'B', den: 1, chay: 3, uuTien: 1 },
  { ten: 'C', den: 2, chay: 8, uuTien: 4 },
  { ten: 'D', den: 3, chay: 2, uuTien: 2 },
  { ten: 'E', den: 5, chay: 4, uuTien: 5 },
];
const TAT_CA = [['fcfs'], ['sjf'], ['srtf'], ['rr', 2], ['prio'], ['prio-p']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/42644e7e7f89c82fcb2a5a45dea934801978953d.svg" alt="Priority, nonpreemptive" loading="lazy" /><p class="chu-thich">🧮 Priority, nonpreemptive</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Priority (1 = highest)</th><th>Completion</th><th>Turnaround</th><th>Waiting</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>6</td><td>3</td><td>6</td><td>6</td><td>0</td></tr>
<tr><td>B</td><td>1</td><td>3</td><td>1</td><td>9</td><td>8</td><td>5</td></tr>
<tr><td>C</td><td>2</td><td>8</td><td>4</td><td>19</td><td>17</td><td>9</td></tr>
<tr><td>D</td><td>3</td><td>2</td><td>2</td><td>11</td><td>8</td><td>6</td></tr>
<tr><td>E</td><td>5</td><td>4</td><td>5</td><td>23</td><td>18</td><td>14</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'A', den: 0, chay: 6, uuTien: 3 },
  { ten: 'B', den: 1, chay: 3, uuTien: 1 },
  { ten: 'C', den: 2, chay: 8, uuTien: 4 },
  { ten: 'D', den: 3, chay: 2, uuTien: 2 },
  { ten: 'E', den: 5, chay: 4, uuTien: 5 },
];
const TAT_CA = [['fcfs'], ['sjf'], ['srtf'], ['rr', 2], ['prio'], ['prio-p']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/66e77851f60f61381a50db79c6cb62d4e7ce996d.svg" alt="Priority, preemptive" loading="lazy" /><p class="chu-thich">🧮 Priority, preemptive</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Priority (1 = highest)</th><th>Completion</th><th>Turnaround</th><th>Waiting</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>6</td><td>3</td><td>11</td><td>11</td><td>5</td></tr>
<tr><td>B</td><td>1</td><td>3</td><td>1</td><td>4</td><td>3</td><td>0</td></tr>
<tr><td>C</td><td>2</td><td>8</td><td>4</td><td>19</td><td>17</td><td>9</td></tr>
<tr><td>D</td><td>3</td><td>2</td><td>2</td><td>6</td><td>3</td><td>1</td></tr>
<tr><td>E</td><td>5</td><td>4</td><td>5</td><td>23</td><td>18</td><td>14</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'A', den: 0, chay: 6, uuTien: 3 },
  { ten: 'B', den: 1, chay: 3, uuTien: 1 },
  { ten: 'C', den: 2, chay: 8, uuTien: 4 },
  { ten: 'D', den: 3, chay: 2, uuTien: 2 },
  { ten: 'E', den: 5, chay: 4, uuTien: 5 },
];
const TAT_CA = [['fcfs'], ['sjf'], ['srtf'], ['rr', 2], ['prio'], ['prio-p']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/40feae4b6e9253882be38b3c4c199b58e9813aed.svg" alt="All six on one chart: average waiting time" loading="lazy" /><p class="chu-thich">🧮 All six on one chart: average waiting time</p></div>
<table>
<thead><tr><th>Algorithm</th><th>Avg waiting</th><th>Avg turnaround</th><th>Avg response</th></tr></thead>
<tbody>
<tr><td>FCFS (first-come, first-served)</td><td>8</td><td>12.6</td><td>8</td></tr>
<tr><td>SJF (non-preemptive)</td><td>5.8</td><td>10.4</td><td>5.8</td></tr>
<tr><td>SRTF (preemptive SJF)</td><td>4.8</td><td>9.4</td><td>3</td></tr>
<tr><td>Round Robin (q = 2)</td><td>9.2</td><td>13.8</td><td>2.8</td></tr>
<tr><td>Priority (non-preemptive)</td><td>6.8</td><td>11.4</td><td>6.8</td></tr>
<tr><td>Priority (preemptive)</td><td>5.8</td><td>10.4</td><td>4.8</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'A', den: 0, chay: 6, uuTien: 3 },
  { ten: 'B', den: 1, chay: 3, uuTien: 1 },
  { ten: 'C', den: 2, chay: 8, uuTien: 4 },
  { ten: 'D', den: 3, chay: 2, uuTien: 2 },
  { ten: 'E', den: 5, chay: 4, uuTien: 5 },
];
const TAT_CA = [['fcfs'], ['sjf'], ['srtf'], ['rr', 2], ['prio'], ['prio-p']];</code></pre></details>
<p>Check by hand at least FCFS and SRTF. FCFS: A 0–6, B 6–9, C 9–17, D 17–19, E 19–23 ⇒ waiting 0, 5, 7, 14, 14 ⇒ 40 / 5 = 8. SRTF: A runs 0–1; B (3) is shorter than A's remaining 5 ⇒ B 1–4 (D arrives at 3 with 2, not shorter than B's remaining 1); then D 4–6, E 6–10 (4 &lt; A's 5), A 10–15, C 15–23 ⇒ waiting 9, 0, 13, 1, 1 ⇒ 4.8. RR has the worst average here but the best response time — the trade of slide 62. The most common error: computing waiting as completion − arrival (that is turnaround) — always subtract the burst.</p>
</details>`,
    `<h3>🧪 Bài 5 — bài tính lập lịch, kiểu FE (30 phút)</h3>
<p>Năm tiến trình (đến / chạy / ưu tiên, trong đó <strong>1 = cao nhất</strong>): A 0/6/3, B 1/3/1, C 2/8/4, D 3/2/2, E 5/4/5. Với FCFS, SJF (không chiếm quyền), SRTF, Round Robin q = 2, Priority (không chiếm quyền) và Priority (chiếm quyền): vẽ biểu đồ Gantt và tính thời gian chờ trung bình. Quy ước (như bộ mô phỏng của môn và phần lớn đáp án đề thi): hoà thì ai đến trước được trước; trong RR tiến trình tới trong lúc một lát đang chạy vào hàng trước tiến trình vừa bị lấy CPU; chỉ chiếm quyền khi tiến trình mới tốt hơn hẳn.</p>
<details><summary>Lời giải — mọi biểu đồ do bộ mô phỏng tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1c53409848cecdde25fbe1447ff364b343bcd05f.svg" alt="FCFS: đoàn xe phía sau A và C" loading="lazy" /><p class="chu-thich">🧮 FCFS: đoàn xe phía sau A và C</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Ưu tiên (1 = cao nhất)</th><th>Xong</th><th>Hoàn thành</th><th>Chờ</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>6</td><td>3</td><td>6</td><td>6</td><td>0</td></tr>
<tr><td>B</td><td>1</td><td>3</td><td>1</td><td>9</td><td>8</td><td>5</td></tr>
<tr><td>C</td><td>2</td><td>8</td><td>4</td><td>17</td><td>15</td><td>7</td></tr>
<tr><td>D</td><td>3</td><td>2</td><td>2</td><td>19</td><td>16</td><td>14</td></tr>
<tr><td>E</td><td>5</td><td>4</td><td>5</td><td>23</td><td>18</td><td>14</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'A', den: 0, chay: 6, uuTien: 3 },
  { ten: 'B', den: 1, chay: 3, uuTien: 1 },
  { ten: 'C', den: 2, chay: 8, uuTien: 4 },
  { ten: 'D', den: 3, chay: 2, uuTien: 2 },
  { ten: 'E', den: 5, chay: 4, uuTien: 5 },
];
const TAT_CA = [['fcfs'], ['sjf'], ['srtf'], ['rr', 2], ['prio'], ['prio-p']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/2dc219157c44b392b9aaeb4cab487d25068306c7.svg" alt="SJF (không chiếm quyền): lúc t = 6, job ngắn nhất đang sẵn sàng là D được chạy trước" loading="lazy" /><p class="chu-thich">🧮 SJF (không chiếm quyền): lúc t = 6, job ngắn nhất đang sẵn sàng là D được chạy trước</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Ưu tiên (1 = cao nhất)</th><th>Xong</th><th>Hoàn thành</th><th>Chờ</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>6</td><td>3</td><td>6</td><td>6</td><td>0</td></tr>
<tr><td>B</td><td>1</td><td>3</td><td>1</td><td>11</td><td>10</td><td>7</td></tr>
<tr><td>C</td><td>2</td><td>8</td><td>4</td><td>23</td><td>21</td><td>13</td></tr>
<tr><td>D</td><td>3</td><td>2</td><td>2</td><td>8</td><td>5</td><td>3</td></tr>
<tr><td>E</td><td>5</td><td>4</td><td>5</td><td>15</td><td>10</td><td>6</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'A', den: 0, chay: 6, uuTien: 3 },
  { ten: 'B', den: 1, chay: 3, uuTien: 1 },
  { ten: 'C', den: 2, chay: 8, uuTien: 4 },
  { ten: 'D', den: 3, chay: 2, uuTien: 2 },
  { ten: 'E', den: 5, chay: 4, uuTien: 5 },
];
const TAT_CA = [['fcfs'], ['sjf'], ['srtf'], ['rr', 2], ['prio'], ['prio-p']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c3b7dd62ff81f701d68ef760bd7ec40a566ce808.svg" alt="SRTF: B chiếm quyền của A lúc t = 1; chờ trung bình tốt nhất" loading="lazy" /><p class="chu-thich">🧮 SRTF: B chiếm quyền của A lúc t = 1; chờ trung bình tốt nhất</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Ưu tiên (1 = cao nhất)</th><th>Xong</th><th>Hoàn thành</th><th>Chờ</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>6</td><td>3</td><td>15</td><td>15</td><td>9</td></tr>
<tr><td>B</td><td>1</td><td>3</td><td>1</td><td>4</td><td>3</td><td>0</td></tr>
<tr><td>C</td><td>2</td><td>8</td><td>4</td><td>23</td><td>21</td><td>13</td></tr>
<tr><td>D</td><td>3</td><td>2</td><td>2</td><td>6</td><td>3</td><td>1</td></tr>
<tr><td>E</td><td>5</td><td>4</td><td>5</td><td>10</td><td>5</td><td>1</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'A', den: 0, chay: 6, uuTien: 3 },
  { ten: 'B', den: 1, chay: 3, uuTien: 1 },
  { ten: 'C', den: 2, chay: 8, uuTien: 4 },
  { ten: 'D', den: 3, chay: 2, uuTien: 2 },
  { ten: 'E', den: 5, chay: 4, uuTien: 5 },
];
const TAT_CA = [['fcfs'], ['sjf'], ['srtf'], ['rr', 2], ['prio'], ['prio-p']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/912fbd295e12ad9a965b8f9d5334ebd9e3e34725.svg" alt="Round Robin, q = 2" loading="lazy" /><p class="chu-thich">🧮 Round Robin, q = 2</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Ưu tiên (1 = cao nhất)</th><th>Xong</th><th>Hoàn thành</th><th>Chờ</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>6</td><td>3</td><td>17</td><td>17</td><td>11</td></tr>
<tr><td>B</td><td>1</td><td>3</td><td>1</td><td>11</td><td>10</td><td>7</td></tr>
<tr><td>C</td><td>2</td><td>8</td><td>4</td><td>23</td><td>21</td><td>13</td></tr>
<tr><td>D</td><td>3</td><td>2</td><td>2</td><td>10</td><td>7</td><td>5</td></tr>
<tr><td>E</td><td>5</td><td>4</td><td>5</td><td>19</td><td>14</td><td>10</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'A', den: 0, chay: 6, uuTien: 3 },
  { ten: 'B', den: 1, chay: 3, uuTien: 1 },
  { ten: 'C', den: 2, chay: 8, uuTien: 4 },
  { ten: 'D', den: 3, chay: 2, uuTien: 2 },
  { ten: 'E', den: 5, chay: 4, uuTien: 5 },
];
const TAT_CA = [['fcfs'], ['sjf'], ['srtf'], ['rr', 2], ['prio'], ['prio-p']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/44a62bacd9c33bc86e68ffcee696b1f9d558dc29.svg" alt="Ưu tiên, không chiếm quyền" loading="lazy" /><p class="chu-thich">🧮 Ưu tiên, không chiếm quyền</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Ưu tiên (1 = cao nhất)</th><th>Xong</th><th>Hoàn thành</th><th>Chờ</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>6</td><td>3</td><td>6</td><td>6</td><td>0</td></tr>
<tr><td>B</td><td>1</td><td>3</td><td>1</td><td>9</td><td>8</td><td>5</td></tr>
<tr><td>C</td><td>2</td><td>8</td><td>4</td><td>19</td><td>17</td><td>9</td></tr>
<tr><td>D</td><td>3</td><td>2</td><td>2</td><td>11</td><td>8</td><td>6</td></tr>
<tr><td>E</td><td>5</td><td>4</td><td>5</td><td>23</td><td>18</td><td>14</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'A', den: 0, chay: 6, uuTien: 3 },
  { ten: 'B', den: 1, chay: 3, uuTien: 1 },
  { ten: 'C', den: 2, chay: 8, uuTien: 4 },
  { ten: 'D', den: 3, chay: 2, uuTien: 2 },
  { ten: 'E', den: 5, chay: 4, uuTien: 5 },
];
const TAT_CA = [['fcfs'], ['sjf'], ['srtf'], ['rr', 2], ['prio'], ['prio-p']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/aae116b98d3fb2c35ff38ea7eb0126d6005c65c7.svg" alt="Ưu tiên, chiếm quyền" loading="lazy" /><p class="chu-thich">🧮 Ưu tiên, chiếm quyền</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Ưu tiên (1 = cao nhất)</th><th>Xong</th><th>Hoàn thành</th><th>Chờ</th></tr></thead>
<tbody>
<tr><td>A</td><td>0</td><td>6</td><td>3</td><td>11</td><td>11</td><td>5</td></tr>
<tr><td>B</td><td>1</td><td>3</td><td>1</td><td>4</td><td>3</td><td>0</td></tr>
<tr><td>C</td><td>2</td><td>8</td><td>4</td><td>19</td><td>17</td><td>9</td></tr>
<tr><td>D</td><td>3</td><td>2</td><td>2</td><td>6</td><td>3</td><td>1</td></tr>
<tr><td>E</td><td>5</td><td>4</td><td>5</td><td>23</td><td>18</td><td>14</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'A', den: 0, chay: 6, uuTien: 3 },
  { ten: 'B', den: 1, chay: 3, uuTien: 1 },
  { ten: 'C', den: 2, chay: 8, uuTien: 4 },
  { ten: 'D', den: 3, chay: 2, uuTien: 2 },
  { ten: 'E', den: 5, chay: 4, uuTien: 5 },
];
const TAT_CA = [['fcfs'], ['sjf'], ['srtf'], ['rr', 2], ['prio'], ['prio-p']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/11b8b2f012ab1d0fc284ae8e08d87dbf561bbd7d.svg" alt="Cả sáu trên một biểu đồ: thời gian chờ trung bình" loading="lazy" /><p class="chu-thich">🧮 Cả sáu trên một biểu đồ: thời gian chờ trung bình</p></div>
<table>
<thead><tr><th>Thuật toán</th><th>Chờ TB</th><th>Hoàn thành TB</th><th>Đáp ứng TB</th></tr></thead>
<tbody>
<tr><td>FCFS (đến trước phục vụ trước)</td><td>8</td><td>12.6</td><td>8</td></tr>
<tr><td>SJF (không chiếm quyền)</td><td>5.8</td><td>10.4</td><td>5.8</td></tr>
<tr><td>SRTF (SJF chiếm quyền)</td><td>4.8</td><td>9.4</td><td>3</td></tr>
<tr><td>Round Robin (xoay vòng) (q = 2)</td><td>9.2</td><td>13.8</td><td>2.8</td></tr>
<tr><td>Ưu tiên (không chiếm quyền)</td><td>6.8</td><td>11.4</td><td>6.8</td></tr>
<tr><td>Ưu tiên (chiếm quyền)</td><td>5.8</td><td>10.4</td><td>4.8</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'A', den: 0, chay: 6, uuTien: 3 },
  { ten: 'B', den: 1, chay: 3, uuTien: 1 },
  { ten: 'C', den: 2, chay: 8, uuTien: 4 },
  { ten: 'D', den: 3, chay: 2, uuTien: 2 },
  { ten: 'E', den: 5, chay: 4, uuTien: 5 },
];
const TAT_CA = [['fcfs'], ['sjf'], ['srtf'], ['rr', 2], ['prio'], ['prio-p']];</code></pre></details>
<p>Tự kiểm tay ít nhất FCFS và SRTF. FCFS: A 0–6, B 6–9, C 9–17, D 17–19, E 19–23 ⇒ chờ 0, 5, 7, 14, 14 ⇒ 40 / 5 = 8. SRTF: A chạy 0–1; B (3) ngắn hơn phần còn lại 5 của A ⇒ B 1–4 (D tới lúc 3 với 2, không ngắn hơn phần còn lại 1 của B); rồi D 4–6, E 6–10 (4 &lt; 5 còn lại của A), A 10–15, C 15–23 ⇒ chờ 9, 0, 13, 1, 1 ⇒ 4,8. RR có trung bình tệ nhất ở đây nhưng thời gian đáp ứng tốt nhất — phép đánh đổi của slide 62. Lỗi hay gặp nhất: tính chờ bằng thời điểm xong − thời điểm đến (đó là thời gian hoàn thành) — luôn trừ thêm thời gian chạy.</p>
</details>`),
    bi(`<h3>🧪 Exercise 6 — break the philosophers' deadlock in one line (15 min)</h3>
<p>Take the deadlocking program of slide 68 (each philosopher locks the left fork, pauses, locks the right fork). Change <em>only the order</em> in which some philosophers take their forks so that a deadlock becomes impossible, run it with 50 meals each, and explain which of the four deadlock conditions you removed.</p>
<details><summary>Solution — with the real run</summary>
<pre><code class="language-c">// Exercise 6: break the circular wait — even philosophers take the LEFT fork first, odd ones the RIGHT fork first
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;unistd.h&gt;

#define N 5
pthread_mutex_t fork_[N];
int meals[N];

void *philosopher(void *arg) {
    int i = (int)(long)arg;
    int left = i, right = (i + 1) % N;
    int first = (i % 2 == 0) ? left : right;            // the only change from Figure 2-46
    int second = (i % 2 == 0) ? right : left;
    for (int m = 0; m &lt; 50; m++) {
        pthread_mutex_lock(&amp;fork_[first]);
        usleep(1000);                                   // the same pause that deadlocked the naive version
        pthread_mutex_lock(&amp;fork_[second]);
        meals[i]++;                                     // eat
        pthread_mutex_unlock(&amp;fork_[second]);
        pthread_mutex_unlock(&amp;fork_[first]);
    }
    return NULL;
}

int main(void) {
    pthread_t t[N];
    for (int i = 0; i &lt; N; i++) pthread_mutex_init(&amp;fork_[i], NULL);
    for (long i = 0; i &lt; N; i++) pthread_create(&amp;t[i], NULL, philosopher, (void *)i);
    for (int i = 0; i &lt; N; i++) pthread_join(t[i], NULL);
    for (int i = 0; i &lt; N; i++) printf("philosopher %d ate %d times\\n", i, meals[i]);
    printf("finished: no deadlock\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread triet-gia-chan-le.c -o triet-gia-chan-le &amp;&amp; ./triet-gia-chan-le<br>
philosopher 0 ate 50 times<br>
philosopher 1 ate 50 times<br>
philosopher 2 ate 50 times<br>
philosopher 3 ate 50 times<br>
philosopher 4 ate 50 times<br>
finished: no deadlock</div>
<p>Even-numbered philosophers take the left fork first, odd-numbered ones the right fork first. Same pause between the two forks as the naive version — yet every philosopher ate 50 times. A cycle P0 → P1 → … → P4 → P0 needs every philosopher to hold one fork and wait for the next one in the <em>same</em> direction around the table; philosophers 0 and 1 now compete for fork 1 <em>first</em>, so one of them holds nothing while waiting. The <strong>circular wait</strong> condition can no longer hold. The general version, used everywhere from the Linux kernel to databases: number all resources and always lock them in increasing order (Chapter 6, resource ordering; FE1#29: "forcing all processes to request resources in a predefined order eliminates circular wait").</p>
</details>`,
    `<h3>🧪 Bài 6 — phá bế tắc của các triết gia bằng một dòng (15 phút)</h3>
<p>Lấy chương trình bế tắc của slide 68 (mỗi triết gia khoá nĩa trái, dừng một chút, khoá nĩa phải). Chỉ đổi <em>thứ tự</em> lấy nĩa của một số triết gia sao cho bế tắc trở thành không thể, chạy với mỗi người 50 bữa, và giải thích bạn đã loại bỏ điều kiện nào trong bốn điều kiện bế tắc.</p>
<details><summary>Lời giải — kèm lần chạy thật</summary>
<pre><code class="language-c">// Bài 6: phá vòng chờ — triết gia số chẵn lấy đũa TRÁI trước, số lẻ lấy đũa PHẢI trước
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;unistd.h&gt;

#define N 5
pthread_mutex_t fork_[N];
int meals[N];

void *philosopher(void *arg) {
    int i = (int)(long)arg;
    int left = i, right = (i + 1) % N;
    int first = (i % 2 == 0) ? left : right;            // thay đổi duy nhất so với Hình 2-46
    int second = (i % 2 == 0) ? right : left;
    for (int m = 0; m &lt; 50; m++) {
        pthread_mutex_lock(&amp;fork_[first]);
        usleep(1000);                                   // cùng khoảng dừng đã làm bản ngây thơ bế tắc
        pthread_mutex_lock(&amp;fork_[second]);
        meals[i]++;                                     // ăn
        pthread_mutex_unlock(&amp;fork_[second]);
        pthread_mutex_unlock(&amp;fork_[first]);
    }
    return NULL;
}

int main(void) {
    pthread_t t[N];
    for (int i = 0; i &lt; N; i++) pthread_mutex_init(&amp;fork_[i], NULL);
    for (long i = 0; i &lt; N; i++) pthread_create(&amp;t[i], NULL, philosopher, (void *)i);
    for (int i = 0; i &lt; N; i++) pthread_join(t[i], NULL);
    for (int i = 0; i &lt; N; i++) printf("philosopher %d ate %d times\\n", i, meals[i]);
    printf("finished: no deadlock\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread triet-gia-chan-le.c -o triet-gia-chan-le &amp;&amp; ./triet-gia-chan-le<br>
philosopher 0 ate 50 times<br>
philosopher 1 ate 50 times<br>
philosopher 2 ate 50 times<br>
philosopher 3 ate 50 times<br>
philosopher 4 ate 50 times<br>
finished: no deadlock</div>
<p>Triết gia số chẵn lấy nĩa trái trước, số lẻ lấy nĩa phải trước. Cùng khoảng dừng giữa hai chiếc nĩa như bản ngây thơ — vậy mà ai cũng ăn đủ 50 bữa. Một chu trình P0 → P1 → … → P4 → P0 đòi mọi triết gia đều giữ một nĩa và chờ chiếc kế tiếp theo <em>cùng</em> một chiều quanh bàn; giờ triết gia 0 và 1 tranh nĩa 1 <em>trước tiên</em>, nên một trong hai không giữ gì trong lúc chờ. Điều kiện <strong>chờ vòng tròn</strong> không còn thoả được. Bản tổng quát, dùng ở mọi nơi từ nhân Linux tới cơ sở dữ liệu: đánh số mọi tài nguyên và luôn khoá theo thứ tự tăng dần (Chương 6, sắp thứ tự tài nguyên; FE1#29: "buộc mọi tiến trình xin tài nguyên theo một thứ tự định trước sẽ loại bỏ chờ vòng tròn").</p>
</details>`),
    bi(`<h3>🧪 Exercise 7 — drive the Linux scheduler (10 min)</h3>
<p>Start a busy loop in the background. Read what the scheduler knows about it in <code>/proc/&lt;pid&gt;/sched</code>; switch it to the batch policy with <code>chrt</code>; lower its priority with <code>renice</code>; pin it to CPU 0 with <code>taskset</code>; verify each change.</p>
<details><summary>Solution — one real session</summary>
<div class="out"># Exercise 7: the scheduler's view of ONE process, then change its policy, niceness and CPU set<br>
$ sh -c 'while :; do :; done' &amp;<br>
$ P=$(jobs -p %1)<br>
$ sleep 1<br>
$ grep -E '^(se\\.sum_exec_runtime|nr_switches|nr_voluntary_switches|nr_involuntary_switches|policy|prio)' /proc/$P/sched<br>
se.sum_exec_runtime &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1008.253246<br>
nr_switches &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;29<br>
nr_voluntary_switches &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
nr_involuntary_switches &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;29<br>
policy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
prio &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120<br>
$ chrt -b -p 0 $P<br>
$ chrt -p $P<br>
pid 9's current scheduling policy: SCHED_BATCH<br>
pid 9's current scheduling priority: 0<br>
$ renice -n 5 -p $P<br>
9 (process ID) old priority 0, new priority 5<br>
$ ps -o pid,ni,cls,pri,comm -p $P<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;NI CLS PRI COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 &nbsp;&nbsp;5 &nbsp;&nbsp;B &nbsp;14 sh<br>
$ taskset -c -p 0 $P<br>
pid 9's current affinity list: 0-9<br>
pid 9's new affinity list: 0<br>
$ taskset -c -p $P<br>
pid 9's current affinity list: 0<br>
$ kill $P</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>After one second the busy loop had run about 1000 ms of CPU (<code>se.sum_exec_runtime</code>, in ms) and every switch was involuntary — it never blocked, the scheduler preempted it (it is CPU-bound, slide 56). <code>chrt -b -p 0</code> moved it to <code>SCHED_BATCH</code> (ps column CLS = B); <code>renice -n 5</code> made it nicer (NI = 5) — an ordinary user may only <em>raise</em> niceness, lowering it needs privileges; <code>taskset</code> changed its <strong>CPU affinity</strong> from all ten CPUs (0–9) to CPU 0 only. These three commands are what you reach for on a server when a backup job steals CPU from the web application.</p>
</details>`,
    `<h3>🧪 Bài 7 — cầm lái bộ lập lịch Linux (10 phút)</h3>
<p>Chạy một vòng lặp bận ở hậu cảnh. Đọc những gì bộ lập lịch biết về nó trong <code>/proc/&lt;pid&gt;/sched</code>; chuyển nó sang chính sách lô bằng <code>chrt</code>; hạ ưu tiên bằng <code>renice</code>; ghim nó vào CPU 0 bằng <code>taskset</code>; kiểm từng thay đổi.</p>
<details><summary>Lời giải — một phiên chạy thật</summary>
<div class="out"># Bài 7: cái nhìn của bộ lập lịch về MỘT tiến trình, rồi đổi chính sách, độ nice và tập CPU của nó<br>
$ sh -c 'while :; do :; done' &amp;<br>
$ P=$(jobs -p %1)<br>
$ sleep 1<br>
$ grep -E '^(se\\.sum_exec_runtime|nr_switches|nr_voluntary_switches|nr_involuntary_switches|policy|prio)' /proc/$P/sched<br>
se.sum_exec_runtime &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1008.253246<br>
nr_switches &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;29<br>
nr_voluntary_switches &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
nr_involuntary_switches &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;29<br>
policy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
prio &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120<br>
$ chrt -b -p 0 $P<br>
$ chrt -p $P<br>
pid 9's current scheduling policy: SCHED_BATCH<br>
pid 9's current scheduling priority: 0<br>
$ renice -n 5 -p $P<br>
9 (process ID) old priority 0, new priority 5<br>
$ ps -o pid,ni,cls,pri,comm -p $P<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;NI CLS PRI COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 &nbsp;&nbsp;5 &nbsp;&nbsp;B &nbsp;14 sh<br>
$ taskset -c -p 0 $P<br>
pid 9's current affinity list: 0-9<br>
pid 9's new affinity list: 0<br>
$ taskset -c -p $P<br>
pid 9's current affinity list: 0<br>
$ kill $P</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Sau một giây vòng lặp bận đã chạy khoảng 1000 ms CPU (<code>se.sum_exec_runtime</code>, đơn vị ms) và mọi lần chuyển đều không tự nguyện — nó không bao giờ bị chặn, bộ lập lịch chiếm CPU của nó (nó nặng CPU, slide 56). <code>chrt -b -p 0</code> đưa nó sang <code>SCHED_BATCH</code> (cột CLS của ps = B); <code>renice -n 5</code> làm nó "hiền" hơn (NI = 5) — người dùng thường chỉ được <em>tăng</em> nice, giảm cần đặc quyền; <code>taskset</code> đổi <strong>CPU affinity</strong> (tập CPU được dùng) từ cả mười CPU (0–9) xuống chỉ CPU 0. Ba lệnh này là thứ bạn dùng trên server khi một job sao lưu giành CPU của ứng dụng web.</p>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>process</strong></td><td>tiến trình</td><td>A program in execution: its address space, registers, program counter and resources.</td></tr>
<tr><td><strong>thread</strong></td><td>luồng</td><td>A flow of execution inside a process, with its own PC, registers and stack, sharing the process's memory and files.</td></tr>
<tr><td><strong>process control block (PCB) / process table</strong></td><td>khối điều khiển tiến trình / bảng tiến trình</td><td>The kernel's record of a process: state, registers, scheduling, memory and file information.</td></tr>
<tr><td><strong>running / ready / blocked</strong></td><td>đang chạy / sẵn sàng / bị chặn</td><td>The three process states; ready = could run but has no CPU, blocked = waits for an event.</td></tr>
<tr><td><strong>context switch</strong></td><td>chuyển ngữ cảnh</td><td>Saving one process's or thread's CPU state and loading another's (about 2 µs measured).</td></tr>
<tr><td><strong>zombie / orphan</strong></td><td>tiến trình xác sống / mồ côi</td><td>A finished process not yet waited for by its parent / a process whose parent has exited (adopted by PID 1).</td></tr>
<tr><td><strong>user-level / kernel-level threads</strong></td><td>luồng mức người dùng / mức nhân</td><td>Threads managed by a run-time library the kernel cannot see, versus threads the kernel schedules (Linux: 1:1).</td></tr>
<tr><td><strong>race condition</strong></td><td>tình trạng tranh chấp</td><td>A result that depends on the timing of processes accessing shared data.</td></tr>
<tr><td><strong>critical region (section)</strong></td><td>vùng găng (đoạn găng)</td><td>The part of a program that accesses shared data and must not run concurrently with another.</td></tr>
<tr><td><strong>mutual exclusion</strong></td><td>loại trừ tương hỗ</td><td>The guarantee that at most one process is inside its critical region at a time.</td></tr>
<tr><td><strong>busy waiting / spin lock</strong></td><td>chờ bận / khoá quay</td><td>Waiting by testing a variable in a loop, burning CPU time.</td></tr>
<tr><td><strong>TSL / XCHG (atomic instruction)</strong></td><td>lệnh nguyên tử TSL / XCHG</td><td>A hardware instruction that reads and writes a memory word in one indivisible step.</td></tr>
<tr><td><strong>semaphore (down / up)</strong></td><td>semaphore (down / up)</td><td>An integer counting saved wakeups; down blocks at 0, up wakes one waiter or increments.</td></tr>
<tr><td><strong>mutex / condition variable</strong></td><td>mutex / biến điều kiện</td><td>A two-state lock with an owner / a queue to wait on until a condition holds, always used with a mutex.</td></tr>
<tr><td><strong>monitor</strong></td><td>monitor (bộ giám sát)</td><td>A language construct whose procedures run with mutual exclusion; Java's synchronized.</td></tr>
<tr><td><strong>message passing</strong></td><td>truyền thông điệp</td><td>Interprocess communication by send/receive, without shared memory.</td></tr>
<tr><td><strong>deadlock / starvation</strong></td><td>bế tắc / bỏ đói</td><td>Everyone waits forever for each other / one process waits indefinitely while others proceed.</td></tr>
<tr><td><strong>preemptive / nonpreemptive</strong></td><td>có chiếm quyền / không chiếm quyền</td><td>The scheduler may take the CPU away from a running process / a process runs until it blocks or finishes.</td></tr>
<tr><td><strong>quantum (time slice)</strong></td><td>lượng tử (lát thời gian)</td><td>The maximum time a process runs before round robin preempts it.</td></tr>
<tr><td><strong>turnaround / waiting / response time</strong></td><td>thời gian hoàn thành / chờ / đáp ứng</td><td>Completion − arrival / turnaround − burst / first run − arrival.</td></tr>
<tr><td><strong>aging</strong></td><td>lão hoá</td><td>Raising a waiting process's priority over time (or averaging past bursts) to prevent starvation.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>process</strong></td><td>tiến trình</td><td>Chương trình đang thực thi: không gian địa chỉ, thanh ghi, bộ đếm chương trình và tài nguyên của nó.</td></tr>
<tr><td><strong>thread</strong></td><td>luồng</td><td>Một dòng thực thi bên trong tiến trình, có PC, thanh ghi và ngăn xếp riêng, dùng chung bộ nhớ và tệp của tiến trình.</td></tr>
<tr><td><strong>process control block (PCB) / process table</strong></td><td>khối điều khiển tiến trình / bảng tiến trình</td><td>Bản ghi của nhân về một tiến trình: trạng thái, thanh ghi, lập lịch, thông tin bộ nhớ và tệp.</td></tr>
<tr><td><strong>running / ready / blocked</strong></td><td>đang chạy / sẵn sàng / bị chặn</td><td>Ba trạng thái tiến trình; sẵn sàng = chạy được nhưng chưa có CPU, bị chặn = chờ một sự kiện.</td></tr>
<tr><td><strong>context switch</strong></td><td>chuyển ngữ cảnh</td><td>Lưu trạng thái CPU của một tiến trình/luồng và nạp của cái khác (đo được khoảng 2 µs).</td></tr>
<tr><td><strong>zombie / orphan</strong></td><td>tiến trình xác sống / mồ côi</td><td>Tiến trình đã xong mà cha chưa wait / tiến trình có cha đã thoát (được PID 1 nhận nuôi).</td></tr>
<tr><td><strong>user-level / kernel-level threads</strong></td><td>luồng mức người dùng / mức nhân</td><td>Luồng do thư viện thời gian chạy quản lý mà nhân không thấy, so với luồng do nhân lập lịch (Linux: 1:1).</td></tr>
<tr><td><strong>race condition</strong></td><td>tình trạng tranh chấp</td><td>Kết quả phụ thuộc vào thời điểm các tiến trình truy cập dữ liệu dùng chung.</td></tr>
<tr><td><strong>critical region (section)</strong></td><td>vùng găng (đoạn găng)</td><td>Phần chương trình truy cập dữ liệu dùng chung, không được chạy đồng thời với phần tương ứng của tiến trình khác.</td></tr>
<tr><td><strong>mutual exclusion</strong></td><td>loại trừ tương hỗ</td><td>Bảo đảm mỗi lúc nhiều nhất một tiến trình ở trong vùng găng.</td></tr>
<tr><td><strong>busy waiting / spin lock</strong></td><td>chờ bận / khoá quay</td><td>Chờ bằng cách kiểm một biến trong vòng lặp, đốt thời gian CPU.</td></tr>
<tr><td><strong>TSL / XCHG (atomic instruction)</strong></td><td>lệnh nguyên tử TSL / XCHG</td><td>Lệnh phần cứng đọc và ghi một từ nhớ trong một bước không chia cắt.</td></tr>
<tr><td><strong>semaphore (down / up)</strong></td><td>semaphore (down / up)</td><td>Một số nguyên đếm các lần đánh thức để dành; down bị chặn khi bằng 0, up đánh thức một người chờ hoặc tăng lên.</td></tr>
<tr><td><strong>mutex / condition variable</strong></td><td>mutex / biến điều kiện</td><td>Khoá hai trạng thái có chủ / hàng chờ để đợi tới khi điều kiện thành đúng, luôn đi kèm mutex.</td></tr>
<tr><td><strong>monitor</strong></td><td>monitor (bộ giám sát)</td><td>Cấu trúc ngôn ngữ mà các thủ tục chạy với loại trừ tương hỗ; synchronized của Java.</td></tr>
<tr><td><strong>message passing</strong></td><td>truyền thông điệp</td><td>Giao tiếp liên tiến trình bằng send/receive, không cần bộ nhớ dùng chung.</td></tr>
<tr><td><strong>deadlock / starvation</strong></td><td>bế tắc / bỏ đói</td><td>Mọi bên chờ nhau mãi mãi / một tiến trình chờ vô hạn trong khi các tiến trình khác vẫn chạy.</td></tr>
<tr><td><strong>preemptive / nonpreemptive</strong></td><td>có chiếm quyền / không chiếm quyền</td><td>Bộ lập lịch được lấy CPU khỏi tiến trình đang chạy / tiến trình chạy tới khi bị chặn hoặc xong.</td></tr>
<tr><td><strong>quantum (time slice)</strong></td><td>lượng tử (lát thời gian)</td><td>Thời gian tối đa một tiến trình chạy trước khi round robin lấy lại CPU.</td></tr>
<tr><td><strong>turnaround / waiting / response time</strong></td><td>thời gian hoàn thành / chờ / đáp ứng</td><td>Thời điểm xong − đến / hoàn thành − thời gian chạy / lần đầu chạy − đến.</td></tr>
<tr><td><strong>aging</strong></td><td>lão hoá</td><td>Tăng ưu tiên của tiến trình chờ lâu theo thời gian (hoặc lấy trung bình các đợt cũ) để chống bỏ đói.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 2</h2>
<ol>
<li>A <strong>process</strong> is a program in execution; one CPU runs many processes by switching between them (pseudoparallelism). Processes are created by <code>fork</code> (+ <code>exec</code>) and end voluntarily (exit) or involuntarily (signal).</li>
<li>Three states — Running, Ready, Blocked — and four transitions; <strong>Ready → Blocked</strong> and <strong>Blocked → Running</strong> are illegal. The kernel keeps a PCB per process (Linux: <code>/proc/PID</code>); a context switch saves one and loads another.</li>
<li>CPU utilization ≈ 1 − pⁿ: more processes in memory keep the CPU busier, with diminishing returns.</li>
<li><strong>Threads</strong> share the address space, globals, heap and open files; each has its own PC, registers, stack and state. Linux threads are kernel threads (1:1); Java virtual threads are M:N.</li>
<li>A <strong>race condition</strong> happens when shared data is updated by interleaved steps; a correct critical-region solution gives mutual exclusion, makes no timing assumptions, lets outsiders not block, and starves nobody.</li>
<li>Tools: busy waiting (strict alternation ✗ progress, Peterson ✓ but needs barriers, TSL/XCHG atomic), then blocking ones: <strong>semaphores</strong> (producer–consumer: empty, full, mutex — never take mutex first), mutexes + condition variables (wait in a <code>while</code>), monitors, message passing, barriers, RCU.</li>
<li>Scheduling: batch — FCFS, SJF (optimal average when all arrive together), SRTN (preemptive SJF); interactive — Round Robin (quantum 20–50 ms), Priority (starvation ⇒ aging), multiple queues, lottery, fair-share; real time — Σ C/P ≤ 1, EDF. Waiting = turnaround − burst.</li>
<li>Classical problems: dining philosophers (naive version deadlocks — take both forks atomically or order the forks), readers–writers (readers' priority starves writers).</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 2</h2>
<ol>
<li><strong>Tiến trình</strong> là chương trình đang thực thi; một CPU chạy nhiều tiến trình bằng cách chuyển qua lại (giả song song). Tiến trình được tạo bằng <code>fork</code> (+ <code>exec</code>) và kết thúc tự nguyện (exit) hoặc không tự nguyện (tín hiệu).</li>
<li>Ba trạng thái — Running, Ready, Blocked — và bốn chuyển đổi; <strong>Ready → Blocked</strong> và <strong>Blocked → Running</strong> là không hợp lệ. Nhân giữ một PCB cho mỗi tiến trình (Linux: <code>/proc/PID</code>); chuyển ngữ cảnh lưu cái này và nạp cái kia.</li>
<li>Hiệu suất CPU ≈ 1 − pⁿ: càng nhiều tiến trình trong bộ nhớ CPU càng bận, nhưng lợi ích giảm dần.</li>
<li><strong>Luồng</strong> dùng chung không gian địa chỉ, biến toàn cục, heap và tệp đang mở; mỗi luồng có PC, thanh ghi, ngăn xếp và trạng thái riêng. Luồng Linux là luồng nhân (1:1); luồng ảo Java là M:N.</li>
<li><strong>Tranh chấp</strong> xảy ra khi dữ liệu dùng chung bị cập nhật bằng các bước đan xen; lời giải vùng găng đúng phải loại trừ tương hỗ, không giả định thời gian, người ở ngoài không chặn ai, và không bỏ đói ai.</li>
<li>Công cụ: chờ bận (luân phiên nghiêm ngặt ✗ tiến triển, Peterson ✓ nhưng cần rào chắn, TSL/XCHG nguyên tử), rồi các công cụ chặn: <strong>semaphore</strong> (sản xuất–tiêu thụ: empty, full, mutex — đừng bao giờ lấy mutex trước), mutex + biến điều kiện (chờ trong <code>while</code>), monitor, truyền thông điệp, rào chắn, RCU.</li>
<li>Lập lịch: hệ lô — FCFS, SJF (tối ưu trung bình khi mọi job cùng tới), SRTN (SJF chiếm quyền); tương tác — Round Robin (lượng tử 20–50 ms), Priority (bỏ đói ⇒ lão hoá), nhiều hàng đợi, xổ số, chia phần công bằng; thời gian thực — Σ C/P ≤ 1, EDF. Chờ = hoàn thành − thời gian chạy.</li>
<li>Bài toán kinh điển: triết gia ăn tối (bản ngây thơ bế tắc — lấy cả hai nĩa một cách nguyên tử hoặc sắp thứ tự nĩa), người đọc – người ghi (ưu tiên người đọc làm người ghi bị bỏ đói).</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-ch2) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 1200,
  questions: [
    { id: 'q1',
      question: '(FE question type) Which of the following process state transitions is illegal?|||(Dạng câu FE) Chuyển trạng thái tiến trình nào sau đây là không hợp lệ?',
      options: ['Running → Blocked|||Running → Blocked (đang chạy → bị chặn)', 'Blocked → Ready|||Blocked → Ready (bị chặn → sẵn sàng)', 'Ready → Blocked|||Ready → Blocked (sẵn sàng → bị chặn)', 'Running → Ready|||Running → Ready (đang chạy → sẵn sàng)'],
      correctIndex: 2,
      points: 1,
      explanation: 'A process can only block while it is running: it must execute the system call (read, sleep, lock…) that makes it wait. A ready process is not executing anything, so it cannot move to Blocked. The four legal transitions of Figure 2-2 are Running → Blocked, Running → Ready, Ready → Running and Blocked → Ready. Lesson 2.A, slide 8.|||Tiến trình chỉ bị chặn được khi đang chạy: nó phải thực thi lời gọi hệ thống (read, sleep, lock…) khiến nó phải chờ. Tiến trình sẵn sàng không thực thi gì cả, nên không thể chuyển sang Blocked. Bốn chuyển đổi hợp lệ của Hình 2-2 là Running → Blocked, Running → Ready, Ready → Running và Blocked → Ready. Bài 2.A, slide 8.' },
    { id: 'q2',
      question: '(FE question type) Which of the following is shared among threads of the same process?|||(Dạng câu FE) Thứ nào sau đây được các luồng của cùng một tiến trình dùng chung?',
      options: ['The stack and the program counter|||Ngăn xếp và bộ đếm chương trình', 'File descriptors, the heap and global variables|||Bộ mô tả tệp, heap và biến toàn cục', 'The CPU registers and the instruction pointer|||Các thanh ghi CPU và con trỏ lệnh', 'The thread state (running, ready, blocked)|||Trạng thái luồng (đang chạy, sẵn sàng, bị chặn)'],
      correctIndex: 1,
      points: 1,
      explanation: 'Figure 2-12: per-process items (address space, globals, open files, child processes, signals) are shared by all threads; per-thread items are the program counter, registers, stack and state. The program chung-rieng.c in lesson 2.A (slide 18) shows both increments of a global variable, a shared heap and one shared file offset — and two stacks about 8 MiB apart.|||Hình 2-12: các mục của tiến trình (không gian địa chỉ, biến toàn cục, tệp đang mở, tiến trình con, tín hiệu) được mọi luồng dùng chung; mục riêng của từng luồng là bộ đếm chương trình, thanh ghi, ngăn xếp và trạng thái. Chương trình chung-rieng.c ở bài 2.A (slide 18) cho thấy cả hai lần tăng một biến toàn cục, heap dùng chung và một vị trí tệp dùng chung — cùng hai ngăn xếp cách nhau khoảng 8 MiB.' },
    { id: 'q3',
      question: '(FE question type) Jobs A–D arrive at times 0, 1, 2, 3 with CPU bursts 8, 4, 9, 5. Using Round Robin with quantum = 4 (a job arriving during a slice joins the queue before the preempted job), what is the turnaround time of job D?|||(Dạng câu FE) Các job A–D tới lúc 0, 1, 2, 3 với thời gian chạy 8, 4, 9, 5. Dùng Round Robin lượng tử = 4 (job tới trong lúc một lát đang chạy vào hàng trước job vừa bị lấy CPU), thời gian hoàn thành (turnaround) của job D là bao nhiêu?',
      options: ['7|||7', '20|||20', '24|||24', '22|||22'],
      correctIndex: 3,
      points: 1,
      explanation: "Computed by the simulator: A 0–4, B 4–8 (done), C 8–12, D 12–16, A 16–20 (done), C 20–24, D 24–25 (done), C 25–26. D finishes at 25 and arrived at 3, so turnaround = 25 − 3 = 22. 7 is B's turnaround, 20 is A's, 24 is C's (FE17#19, FE24#10 ask those). Lesson 2.C, slide 62.|||Do bộ mô phỏng tính: A 0–4, B 4–8 (xong), C 8–12, D 12–16, A 16–20 (xong), C 20–24, D 24–25 (xong), C 25–26. D xong lúc 25 và tới lúc 3, nên hoàn thành = 25 − 3 = 22. 7 là của B, 20 của A, 24 của C (FE17#19, FE24#10 hỏi các số đó). Bài 2.C, slide 62." },
    { id: 'q4',
      question: '(FE question type) Processes P1–P5 all arrive at time 0 with burst times 10, 1, 2, 4, 5. What is the average waiting time with Shortest Job First?|||(Dạng câu FE) Các tiến trình P1–P5 cùng tới lúc 0 với thời gian chạy 10, 1, 2, 4, 5. Thời gian chờ trung bình với Shortest Job First là bao nhiêu?',
      options: ['4.6|||4,6', '6.2|||6,2', '5.2|||5,2', '4.2|||4,2'],
      correctIndex: 0,
      points: 1,
      explanation: 'Computed by the simulator: order P2 (1), P3 (2), P4 (4), P5 (5), P1 (10); waiting times 0, 1, 3, 7, 12; average 23 / 5 = 4.6. With everyone arriving at once, SJF gives the minimum possible average waiting time (lesson 2.C, slide 60).|||Do bộ mô phỏng tính: thứ tự P2 (1), P3 (2), P4 (4), P5 (5), P1 (10); thời gian chờ 0, 1, 3, 7, 12; trung bình 23 / 5 = 4,6. Khi mọi tiến trình cùng tới, SJF cho thời gian chờ trung bình nhỏ nhất có thể (bài 2.C, slide 60).' },
    { id: 'q5',
      question: 'In the semaphore solution of producer–consumer (mutex = 1, empty = N, full = 0), the producer is changed to do down(&mutex) BEFORE down(&empty). What can happen?|||Trong lời giải sản xuất–tiêu thụ bằng semaphore (mutex = 1, empty = N, full = 0), bên sản xuất bị sửa thành down(&mutex) TRƯỚC down(&empty). Điều gì có thể xảy ra?',
      options: ['Nothing changes; the order of the downs does not matter|||Không gì thay đổi; thứ tự các lệnh down không quan trọng', 'Items may be consumed twice|||Món hàng có thể bị tiêu thụ hai lần', 'Deadlock when the buffer is full: the producer sleeps on empty while holding mutex, and the consumer blocks on mutex|||Bế tắc khi bộ đệm đầy: bên sản xuất ngủ ở empty khi đang giữ mutex, còn bên tiêu thụ bị chặn ở mutex', 'The buffer may overflow because empty is no longer checked|||Bộ đệm có thể tràn vì empty không còn được kiểm'],
      correctIndex: 2,
      points: 1,
      explanation: 'With a full buffer, empty = 0: the producer takes mutex, then blocks on down(&empty) still holding it. The consumer does down(&full) then down(&mutex) — blocked, so it can never up(&empty). Both wait forever. The simulator (osg2/sx-tt.mjs#dao) ends in deadlock and the real program dao-down.c reports mutex = 0, empty = 0 with both threads blocked (lesson 2.B, slide 38). Rule: counting semaphore first, mutex last.|||Khi bộ đệm đầy, empty = 0: bên sản xuất lấy mutex, rồi bị chặn ở down(&empty) mà vẫn giữ nó. Bên tiêu thụ làm down(&full) rồi down(&mutex) — bị chặn, nên không bao giờ up(&empty) được. Cả hai chờ mãi. Bộ mô phỏng (osg2/sx-tt.mjs#dao) kết thúc bằng bế tắc và chương trình thật dao-down.c báo mutex = 0, empty = 0 với cả hai luồng bị chặn (bài 2.B, slide 38). Quy tắc: semaphore đếm trước, mutex sau cùng.' },
    { id: 'q6',
      question: 'What does this program print? (A thread adds 5 to the global x, then the process forks; the child doubles x.)|||Chương trình này in ra gì? (Một luồng cộng 5 vào biến toàn cục x, rồi tiến trình fork; tiến trình con nhân đôi x.)',
      code: `int x = 10;
void *add5(void *arg) { x = x + 5; return NULL; }

int main(void) {
    pthread_t t;
    pthread_create(&t, NULL, add5, NULL);
    pthread_join(t, NULL);
    printf("%d", x);
    fflush(stdout);
    if (fork() == 0) {
        x = x * 2;
        printf(" %d", x);
        exit(0);
    }
    wait(NULL);
    printf(" %d", x);
    puts("");
    return 0;
}`,
      codeLang: 'c',
      options: ['15 30 30|||15 30 30', '15 30 15|||15 30 15', '10 20 10|||10 20 10', '15 15 15|||15 15 15'],
      correctIndex: 1,
      points: 1,
      explanation: "Output of the real program: \"15 30 15\". The thread shares the process's memory, so after pthread_join x is 15. fork copies the address space: the child doubles its own copy and prints 30; the parent's x is still 15. (fflush before fork stops the \"15\" in the buffer from being printed twice.) Lesson 2.D, exercise 2.|||Output của chương trình thật: \"15 30 15\". Luồng dùng chung bộ nhớ của tiến trình, nên sau pthread_join x bằng 15. fork chép không gian địa chỉ: tiến trình con nhân đôi bản sao của nó và in 30; x của cha vẫn là 15. (fflush trước fork ngăn số \"15\" còn trong bộ đệm bị in hai lần.) Bài 2.D, bài tập 2." },
    { id: 'q7',
      question: '(FE question type) What problem do semaphores solve in the producer–consumer scenario that sleep() and wakeup() cannot?|||(Dạng câu FE) Semaphore giải được vấn đề gì trong bài sản xuất–tiêu thụ mà sleep() và wakeup() không giải được?',
      options: ['The lost-wakeup problem|||Vấn đề mất tín hiệu đánh thức (lost wakeup)', 'Deadlock between any processes|||Bế tắc giữa mọi tiến trình', 'Process termination|||Việc kết thúc tiến trình', 'Memory allocation|||Việc cấp phát bộ nhớ'],
      correctIndex: 0,
      points: 1,
      explanation: 'With sleep/wakeup, a wakeup sent to a process that has tested count but not yet gone to sleep is lost, and both processes end up sleeping forever (Figure 2-27; simulated and run for real in lesson 2.B, slide 36). A semaphore counts the ups, so a wakeup that arrives early is remembered and the next down passes. Semaphores do not prevent deadlock in general — Q5 shows they can create one.|||Với sleep/wakeup, tín hiệu đánh thức gửi tới một tiến trình đã kiểm count mà chưa kịp ngủ sẽ bị mất, và cả hai tiến trình rốt cuộc ngủ mãi (Hình 2-27; mô phỏng và chạy thật ở bài 2.B, slide 36). Semaphore đếm số lần up, nên lần đánh thức tới sớm được nhớ lại và lệnh down kế tiếp đi qua. Semaphore không ngăn bế tắc nói chung — câu 5 cho thấy chúng có thể gây bế tắc.' },
    { id: 'q8',
      question: '(FE question type) Five batch jobs A–E arrive at the same time with run times 8, 6, 2, 10, 4 minutes and priorities 3, 5, 2, 1, 4 (5 = highest). What is the average waiting time with (nonpreemptive) priority scheduling?|||(Dạng câu FE) Năm job lô A–E cùng tới với thời gian chạy 8, 6, 2, 10, 4 phút và độ ưu tiên 3, 5, 2, 1, 4 (5 = cao nhất). Thời gian chờ trung bình với lập lịch ưu tiên (không chiếm quyền) là bao nhiêu?',
      options: ['12.8 minutes|||12,8 phút', '16.8 minutes|||16,8 phút', '54 minutes|||54 phút', '10.8 minutes|||10,8 phút'],
      correctIndex: 3,
      points: 1,
      explanation: 'Computed by the simulator: order B (5), E (4), A (3), C (2), D (1); waiting times B 0, E 6, A 10, C 18, D 20; sum 54 (the trap answer), average 54 / 5 = 10.8. 12.8 is the FCFS average waiting time of the same jobs (FE21#31). Lesson 2.C, slide 63.|||Do bộ mô phỏng tính: thứ tự B (5), E (4), A (3), C (2), D (1); thời gian chờ B 0, E 6, A 10, C 18, D 20; tổng 54 (phương án bẫy), trung bình 54 / 5 = 10,8. 12,8 là thời gian chờ trung bình FCFS của cùng các job (FE21#31). Bài 2.C, slide 63.' },
    { id: 'q9',
      question: '(FE question type) Which statement about user-level threads is NOT correct?|||(Dạng câu FE) Phát biểu nào về luồng mức người dùng là KHÔNG đúng?',
      options: ['Switching between them needs no kernel call, so it is faster than switching kernel threads|||Chuyển giữa chúng không cần gọi nhân, nên nhanh hơn chuyển luồng nhân', 'If one of them makes a blocking system call, the whole process blocks|||Nếu một luồng gọi lời gọi hệ thống chặn, cả tiến trình bị chặn', 'Customized scheduling algorithms cannot be implemented with them|||Không thể cài thuật toán lập lịch tuỳ biến với chúng', "They cannot be preempted by the clock until the whole process's quantum is used up|||Chúng không bị ngắt đồng hồ chiếm quyền cho tới khi cả lượng tử của tiến trình đã dùng hết"],
      correctIndex: 2,
      points: 1,
      explanation: "User-level threads are scheduled by the process's own run-time system, so each application CAN use its own scheduling algorithm — one of their advantages. A, B and D are all true (Figures 2-16 and 2-44(a); lesson 2.A slide 23 and 2.C slide 65). This is FE21#23.|||Luồng mức người dùng do hệ thống thời gian chạy của chính tiến trình lập lịch, nên mỗi ứng dụng CÓ THỂ dùng thuật toán lập lịch riêng — một ưu điểm của chúng. A, B và D đều đúng (Hình 2-16 và 2-44(a); bài 2.A slide 23 và 2.C slide 65). Đây là FE21#23." },
    { id: 'q10',
      question: "In Peterson's solution, processes P0 and P1 call enter_region almost simultaneously. P0 executes \"turn = 0\" first, then P1 executes \"turn = 1\". Which process enters its critical region first?|||Trong lời giải Peterson, P0 và P1 gần như cùng lúc gọi enter_region. P0 thực hiện \"turn = 0\" trước, rồi P1 thực hiện \"turn = 1\". Tiến trình nào vào vùng găng trước?",
      options: ['P1|||P1', 'P0|||P0', 'Both at the same time|||Cả hai cùng lúc', 'Neither: they deadlock|||Không ai: chúng bế tắc'],
      correctIndex: 1,
      points: 1,
      explanation: 'The simulator executes the algorithm step by step: P1 wrote turn last, so for P1 the loop condition "turn == 1 && interested[0]" is true and it spins; for P0 "turn == 0" is false, so P0 enters. The process that stores into turn LAST waits. (On real ARM64/x86 CPUs this is only guaranteed with memory barriers — lesson 2.B, slide 32.)|||Bộ mô phỏng thực thi thuật toán từng bước: P1 ghi turn sau cùng, nên với P1 điều kiện vòng lặp "turn == 1 && interested[0]" đúng và nó quay vòng; với P0 "turn == 0" sai, nên P0 vào. Tiến trình ghi vào turn SAU CÙNG phải chờ. (Trên CPU ARM64/x86 thật điều này chỉ được bảo đảm khi có rào chắn bộ nhớ — bài 2.B, slide 32.)' },
  ],
};

export default {
  slides: [L_osg2_1, L_osg2_2, L_osg2_3],
  practice: L_on_ch2,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 2 viết lại theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ, câu tính toán và câu "in ra gì" có đáp án kiểm bằng bộ mô phỏng hoặc chương trình C chạy thật: chuyển trạng thái không hợp lệ, cái luồng dùng chung, Round Robin lượng tử 4, SJF, đảo hai lệnh down của bài sản xuất–tiêu thụ, chương trình trộn luồng và fork, vấn đề mất tín hiệu đánh thức, lập lịch ưu tiên, luồng mức người dùng và lời giải Peterson.',
};
