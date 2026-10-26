/**
 * OSG202 · Chương 8 — Multiple Processor Systems (osg8: 8.A 1–19, 8.B 20–50).
 * Bài 📑 học theo từng slide: osg8 (tmp_08.pptx, slide 1–50).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: osg202-on-ch8.
 * Quiz MỚI (10 câu, slug osg202-quiz-ch8).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs từ gen/src/**, gen/code/**, gen/sim/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node OSG202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 8.A — 📑 Slide by slide · Multiprocessors: UMA/NUMA, multiprocessor OS, synchronization, scheduling (slides 1–19) ───────── */
const L_osg8_1 = {
  title: '8.A — 📑 Slide by slide · Multiprocessors: UMA/NUMA, multiprocessor OS, synchronization, scheduling (slides 1–19)|||8.A — 📑 Học theo từng slide · Đa xử lý: UMA/NUMA, HĐH đa xử lý, đồng bộ, lập lịch (slide 1–19)',
  slug: 'osg202-slide-osg8-1',
  type: 'VIDEO',
  description: 'Giảng đủ 19 slide đầu của Chương 8 (Tanenbaum, Modern Operating Systems 4e, mục 8.1): ba loại hệ thống nhiều CPU và định luật Amdahl, bus có cache và giao thức MESI, công tắc chéo crossbar và mạng omega (định tuyến bằng địa chỉ, đếm hoán vị không va), máy NUMA và thư mục của máy 256 nút, ba kiểu HĐH đa xử lý (mỗi CPU một HĐH, chủ–thợ, đối xứng SMP), đồng bộ bằng TSL, khoá quay TAS/TTAS/mutex đo thật, false sharing, chia giờ, chia không gian và gang scheduling với biểu đồ Gantt nhiều CPU — kèm lệnh nproc/lscpu/taskset, chương trình C đo khoá và dòng cache, Java Fork/Join và các chỗ slide đã cũ.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.A · deck "Chapter 8 · Multiple Processor Systems", slides 1–19</span>
<h2>When one CPU is not enough: several processors that share ONE memory</h2>
<p class="lead">Every chapter so far assumed a single CPU. Today that assumption is false even for a phone: your laptop has 8–16 cores, a database server 64–192, and the cloud is millions of machines. Chapter 8 of <em>Modern Operating Systems</em> asks what an operating system must change when there is more than one CPU. The first half (§8.1, slides 1–19) covers machines where all CPUs share one memory — <strong>multiprocessors</strong>: how they are wired, which kind of OS runs on them, how the kernel protects its own tables, and how threads are placed on CPUs. The second half (lesson 8.B) removes the shared memory and ends in the Internet.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–2</td><td>8 intro</td><td>place a system on the ladder multiprocessor → multicomputer → distributed system, and use Amdahl's law</td></tr>
<tr><td>3–9</td><td>8.1.1–8.1.3 Multiprocessor hardware</td><td>explain bus + cache coherence, crossbar, omega network, UMA vs NUMA and a directory</td></tr>
<tr><td>10–12</td><td>8.1.4 Multiprocessor operating systems</td><td>compare "own OS per CPU", master–slave and SMP</td></tr>
<tr><td>13–14</td><td>8.1.5 Multiprocessor synchronization</td><td>explain why TSL needs the bus locked, spin vs switch, cache thrashing and false sharing</td></tr>
<tr><td>15–19</td><td>8.1.6 Multiprocessor scheduling</td><td>compare time sharing, space sharing and gang scheduling</td></tr>
</tbody>
</table>
<div class="callout">This chapter has no session of its own in the course outline and few FE questions (FE8#4, FE7#5 and their copies) — but it is the chapter that explains why a Node.js cluster, a JVM thread pool and a PostgreSQL server on a 64-core machine behave as they do. Chapter 2 (threads, TSL, scheduling) is the prerequisite; this chapter re-opens it with more than one CPU.</div>`,
    `<span class="eyebrow">Chương 8 · Bài 8.A · deck "Chapter 8 · Multiple Processor Systems", slide 1–19</span>
<h2>Khi một CPU không đủ: nhiều bộ xử lý dùng chung MỘT bộ nhớ</h2>
<p class="lead">Mọi chương trước đều giả định chỉ có một CPU. Ngày nay giả định đó sai ngay cả với điện thoại: laptop của bạn có 8–16 nhân (core), một server cơ sở dữ liệu có 64–192, còn đám mây là hàng triệu máy. Chương 8 của <em>Modern Operating Systems</em> hỏi: khi có nhiều hơn một CPU thì hệ điều hành phải đổi gì? Nửa đầu (§8.1, slide 1–19) nói về máy mà mọi CPU dùng chung một bộ nhớ — <strong>đa xử lý (multiprocessor)</strong>: nối dây ra sao, loại HĐH nào chạy trên đó, nhân bảo vệ các bảng của chính nó thế nào, và các luồng được đặt lên CPU ra sao. Nửa sau (bài 8.B) bỏ bộ nhớ dùng chung và kết thúc ở Internet.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–2</td><td>Mở đầu chương 8</td><td>đặt một hệ thống lên nấc thang multiprocessor → multicomputer → hệ phân tán, và dùng định luật Amdahl</td></tr>
<tr><td>3–9</td><td>8.1.1–8.1.3 Phần cứng đa xử lý</td><td>giải thích bus + đồng bộ cache, crossbar, mạng omega, UMA so với NUMA và thư mục</td></tr>
<tr><td>10–12</td><td>8.1.4 HĐH đa xử lý</td><td>so sánh "mỗi CPU một HĐH", chủ–thợ (master–slave) và SMP</td></tr>
<tr><td>13–14</td><td>8.1.5 Đồng bộ trên đa xử lý</td><td>giải thích vì sao TSL cần khoá bus, quay hay chuyển, cache thrashing và false sharing</td></tr>
<tr><td>15–19</td><td>8.1.6 Lập lịch đa xử lý</td><td>so sánh chia giờ, chia không gian và gang scheduling</td></tr>
</tbody>
</table>
<div class="callout">Chương này không có buổi riêng trong đề cương và rất ít câu FE (FE8#4, FE7#5 cùng các bản sao) — nhưng nó là chương giải thích vì sao một cluster Node.js, một thread pool của JVM và một server PostgreSQL trên máy 64 nhân hành xử như chúng đang làm. Chương 2 (luồng, TSL, lập lịch) là kiến thức nền; chương này mở lại nó khi có hơn một CPU.</div>`),
    walkHead('osg8', 1, 19),
    walk('osg8', [
      [1, 'Multiple Processor Systems',
        `<p class="y-chinh">🎯 Chapter 8 of Tanenbaum &amp; Bos: what changes in an operating system when the machine has <strong>many CPUs</strong> — from several CPUs sharing one memory, to many whole computers talking over a network.</p>
<p>Think of a restaurant kitchen. One cook (one CPU) can only make one dish at a time; to serve more guests you hire more cooks. But now new problems appear that a single cook never had: two cooks reach for the same pan (<em>mutual exclusion</em>), the head chef must decide who cooks what (<em>scheduling</em>), cooks need to call out orders to each other (<em>communication</em>), and if the kitchen is too small you open a second restaurant across town (<em>distributed system</em>). Chapter 8 is the OS version of exactly these problems.</p>
<p>The book defines three families, drawn on the next slide, and a good way to remember them is <strong>how long a CPU waits to reach another CPU's data</strong>: nanoseconds (shared memory), microseconds (a fast private network), milliseconds (the Internet). Everything else — programming model, failure behaviour, price — follows from that one number.</p>
<p>➕ A quick look at the machine you are on. Chapter 5 already showed that this course container is a virtual machine; its CPUs are virtual too, but to a program they behave like real ones.</p>
<p class="meo">🧠 Keep one question in mind through the whole chapter: <em>"what do these CPUs share, and what must they send as messages?"</em> Shared memory ⇒ fast, but needs locks and cache coherence. Nothing shared ⇒ scales far, but every interaction is a message that can be slow, lost or duplicated.</p>`,
        `<p class="y-chinh">🎯 Chương 8 của Tanenbaum &amp; Bos: hệ điều hành phải đổi gì khi máy có <strong>nhiều CPU</strong> — từ vài CPU dùng chung một bộ nhớ, tới nhiều máy tính nguyên vẹn nói chuyện qua mạng.</p>
<p>Hãy nghĩ tới bếp một nhà hàng. Một đầu bếp (một CPU) mỗi lúc chỉ làm được một món; muốn phục vụ nhiều khách thì thuê thêm đầu bếp. Nhưng lúc đó xuất hiện những vấn đề mà một đầu bếp chưa từng gặp: hai người cùng với tay lấy một cái chảo (<em>loại trừ tương hỗ</em>), bếp trưởng phải quyết ai nấu món nào (<em>lập lịch</em>), các đầu bếp phải gọi nhau báo món (<em>giao tiếp</em>), và nếu bếp quá chật thì mở nhà hàng thứ hai ở bên kia thành phố (<em>hệ phân tán</em>). Chương 8 chính là phiên bản hệ điều hành của đúng những vấn đề này.</p>
<p>Sách định nghĩa ba họ máy, vẽ ở slide kế, và cách dễ nhớ chúng là <strong>một CPU phải chờ bao lâu để chạm vào dữ liệu của CPU khác</strong>: nano giây (bộ nhớ chung), micro giây (mạng riêng nhanh), mili giây (Internet). Mọi thứ còn lại — mô hình lập trình, cách chịu lỗi, giá tiền — đều suy ra từ một con số đó.</p>
<p>➕ Nhìn nhanh cái máy bạn đang dùng. Chương 5 đã cho thấy container của môn này là một máy ảo; CPU của nó cũng là CPU ảo, nhưng với chương trình thì chúng cư xử như CPU thật.</p>
<p class="meo">🧠 Giữ một câu hỏi suốt chương: <em>"các CPU này dùng chung cái gì, và cái gì buộc phải gửi bằng thông điệp?"</em> Dùng chung bộ nhớ ⇒ nhanh, nhưng cần khoá và đồng bộ cache. Không dùng chung gì ⇒ mở rộng được rất xa, nhưng mỗi tương tác là một thông điệp có thể chậm, mất hoặc bị lặp.</p>`],
      [2, 'Multiple Processor Systems',
        `<p class="y-chinh">🎯 Figure 8-1 — three ways to use many CPUs: (a) a <strong>shared-memory multiprocessor</strong> (all CPUs read and write one memory), (b) a <strong>message-passing multicomputer</strong> (each CPU has private memory and a fast interconnect carries messages), (c) a <strong>wide-area distributed system</strong> (complete computers linked by the Internet).</p>
<p>Orders of magnitude (the usual textbook classes, not exact specifications): in (a) a CPU reaches another CPU's data in roughly <strong>10 ns</strong>; in (b) roughly <strong>10 µs</strong>; in (c) roughly <strong>10 ms</strong>. Each step costs a factor of about a thousand in delay and buys a large factor in how many CPUs you can connect. The programming model changes too: threads and locks on (a); explicit messages on (b) and (c). Slides 3–19 are (a), slides 20–32 are (b), slides 33–49 are (c).</p>
<p>Why not always buy (a)? <strong>Because CPUs share memory only up to a point.</strong> The more CPUs touch one memory, the more the hardware that keeps them consistent costs, and the more time they spend waiting for each other. The classic way to see the limit is <strong>Amdahl's law</strong> (Gene Amdahl, 1967): if a fraction <em>p</em> of a job can run in parallel and the rest <em>(1 − p)</em> is serial, then with <em>n</em> CPUs the speed-up is <code>1 / ((1 − p) + p / n)</code>. With 95% parallel work, 8 CPUs give only 5.9× and even a million CPUs never beat 20×:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e393e45ed75e4b51cd3b26280bdb29a8d92f78f4.svg" alt="Amdahl's law for p = 50%, 90%, 95%, 99%" loading="lazy" /><p class="chu-thich">🧮 Amdahl's law for p = 50%, 90%, 95%, 99%</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const tangToc = (p, n) =&gt; 1 / ((1 - p) + p / n);
const NHAN = [1, 2, 4, 8, 16, 32, 64];
const P = [[0.5, '#94A3B8'], [0.9, '#4338CA'], [0.95, '#15803D'], [0.99, '#B91C1C']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ffc6e2ecf29030fc089f1c37dfcf0c81d0226632.svg" alt="The same law at 1–8 cores, the size of a typical server" loading="lazy" /><p class="chu-thich">🧮 The same law at 1–8 cores, the size of a typical server</p></div>
<table>
<thead><tr><th>Parallel part p</th><th>Serial part</th><th>2 cores</th><th>8 cores</th><th>64 cores</th><th>limit (n → ∞)</th></tr></thead>
<tbody>
<tr><td>50%</td><td>50%</td><td>1.33×</td><td>1.78×</td><td>1.97×</td><td>2×</td></tr>
<tr><td>90%</td><td>10%</td><td>1.82×</td><td>4.71×</td><td>8.77×</td><td>10×</td></tr>
<tr><td>95%</td><td>5%</td><td>1.9×</td><td>5.93×</td><td>15.42×</td><td>20×</td></tr>
<tr><td>99%</td><td>1%</td><td>1.98×</td><td>7.48×</td><td>39.26×</td><td>100×</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const tangToc = (p, n) =&gt; 1 / ((1 - p) + p / n);
const NHAN = [1, 2, 4, 8, 16, 32, 64];
const P = [[0.5, '#94A3B8'], [0.9, '#4338CA'], [0.95, '#15803D'], [0.99, '#B91C1C']];</code></pre></details>
<p>The serial part is not always "code that cannot be parallelised": it is also <em>everything the CPUs fight over</em> — one lock, one hot row in a table, one counter. Remember this before adding cores to a slow backend.</p>
<div class="callout">🧭 On a real server: a Spring Boot or Node.js service rarely scales linearly with cores. The serial part is usually a single database row, a global lock, or the connection pool. Adding CPUs to the application server when the bottleneck is one PostgreSQL primary just moves the queue. Measure first (Chapter ⭐ lessons on <code>perf</code> and <code>top</code>), then scale.</div>`,
        `<p class="y-chinh">🎯 Hình 8-1 — ba cách dùng nhiều CPU: (a) <strong>đa xử lý chia sẻ bộ nhớ (shared-memory multiprocessor)</strong> (mọi CPU đọc/ghi một bộ nhớ), (b) <strong>đa máy tính truyền thông điệp (message-passing multicomputer)</strong> (mỗi CPU có bộ nhớ riêng và một mạng liên kết nhanh chở thông điệp), (c) <strong>hệ phân tán diện rộng (wide-area distributed system)</strong> (các máy tính nguyên vẹn nối nhau qua Internet).</p>
<p>Cấp độ lớn (các lớp thường gặp trong giáo trình, không phải đặc tả chính xác): ở (a) một CPU chạm dữ liệu của CPU khác mất khoảng <strong>10 ns</strong>; ở (b) khoảng <strong>10 µs</strong>; ở (c) khoảng <strong>10 ms</strong>. Mỗi bước tốn thêm hệ số cỡ một nghìn về độ trễ và đổi lại cho phép nối được nhiều CPU hơn rất nhiều. Mô hình lập trình cũng đổi: luồng và khoá ở (a); thông điệp tường minh ở (b) và (c). Slide 3–19 là (a), slide 20–32 là (b), slide 33–49 là (c).</p>
<p>Sao không luôn mua loại (a)? <strong>Vì các CPU chỉ dùng chung bộ nhớ được tới một mức.</strong> Càng nhiều CPU đụng vào một bộ nhớ, phần cứng giữ cho chúng nhất quán càng đắt, và chúng càng mất thời gian chờ nhau. Cách kinh điển để thấy giới hạn là <strong>định luật Amdahl</strong> (Gene Amdahl, 1967): nếu một phần <em>p</em> của công việc chạy song song được còn lại <em>(1 − p)</em> là tuần tự, thì với <em>n</em> CPU tăng tốc là <code>1 / ((1 − p) + p / n)</code>. Với 95% việc song song, 8 CPU chỉ cho 5,9 lần và dù có một triệu CPU cũng không vượt 20 lần:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d285c2261db90c8c078ccc995f186d7ff797878a.svg" alt="Định luật Amdahl với p = 50%, 90%, 95%, 99%" loading="lazy" /><p class="chu-thich">🧮 Định luật Amdahl với p = 50%, 90%, 95%, 99%</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const tangToc = (p, n) =&gt; 1 / ((1 - p) + p / n);
const NHAN = [1, 2, 4, 8, 16, 32, 64];
const P = [[0.5, '#94A3B8'], [0.9, '#4338CA'], [0.95, '#15803D'], [0.99, '#B91C1C']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6334376ff5fdc9b0e06d59d10e15b4da1f41b254.svg" alt="Cũng định luật đó ở 1–8 nhân, cỡ một server thường gặp" loading="lazy" /><p class="chu-thich">🧮 Cũng định luật đó ở 1–8 nhân, cỡ một server thường gặp</p></div>
<table>
<thead><tr><th>Phần song song p</th><th>Phần tuần tự</th><th>2 nhân</th><th>8 nhân</th><th>64 nhân</th><th>giới hạn (n → ∞)</th></tr></thead>
<tbody>
<tr><td>50%</td><td>50%</td><td>1.33×</td><td>1.78×</td><td>1.97×</td><td>2×</td></tr>
<tr><td>90%</td><td>10%</td><td>1.82×</td><td>4.71×</td><td>8.77×</td><td>10×</td></tr>
<tr><td>95%</td><td>5%</td><td>1.9×</td><td>5.93×</td><td>15.42×</td><td>20×</td></tr>
<tr><td>99%</td><td>1%</td><td>1.98×</td><td>7.48×</td><td>39.26×</td><td>100×</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const tangToc = (p, n) =&gt; 1 / ((1 - p) + p / n);
const NHAN = [1, 2, 4, 8, 16, 32, 64];
const P = [[0.5, '#94A3B8'], [0.9, '#4338CA'], [0.95, '#15803D'], [0.99, '#B91C1C']];</code></pre></details>
<p>Phần tuần tự không phải lúc nào cũng là "mã không song song hoá được": nó còn là <em>mọi thứ các CPU tranh nhau</em> — một khoá, một dòng nóng trong bảng, một biến đếm. Hãy nhớ điều này trước khi thêm nhân cho một backend chậm.</p>
<div class="callout">🧭 Trên server thật: một service Spring Boot hay Node.js hiếm khi tăng tốc tuyến tính theo số nhân. Phần tuần tự thường là một dòng cơ sở dữ liệu, một khoá toàn cục, hoặc connection pool. Thêm CPU cho máy ứng dụng trong khi nút cổ chai là một PostgreSQL primary chỉ làm hàng đợi dời chỗ. Hãy đo trước (các bài ⭐ về <code>perf</code> và <code>top</code>), rồi mới mở rộng.</div>`],
      [3, 'Multiprocessor Hardware',
        `<p class="y-chinh">🎯 Figure 8-2 — three bus-based multiprocessors: (a) several CPUs and a memory on one bus, <strong>no cache</strong> — every access crosses the bus; (b) each CPU gets a <strong>cache</strong>, which removes most bus traffic but creates the <strong>cache-coherence</strong> problem; (c) caches <strong>plus a private memory</strong> per CPU, used for data that is never shared.</p>
<p>A <strong>multiprocessor</strong> is a computer with several CPUs and <em>one</em> address space: any CPU can <code>LOAD</code> or <code>STORE</code> any memory word, and the OS sees one memory. A CPU is much faster than memory, and one bus carries one transfer at a time. In (a) a few CPUs already saturate the bus. In (b) each CPU keeps recent words in its own fast cache, so most reads never touch the bus — but now the same word can live in several caches at once. If CPU 1 writes it, CPU 2's copy is <em>obsolete</em>. The hardware fixes this with a <strong>cache-coherence protocol</strong>: every cache <em>snoops</em> (listens to) the bus, and when it sees a write to a line it holds, it invalidates or updates its copy. The book describes the write-through version; real CPUs use <strong>MESI</strong> and relatives — each cache line is in one of four states, Modified, Exclusive, Shared or Invalid:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/086afd0de847d080893368fc8b888a5065e8c3e9.svg" alt="One cache line, seen from one cache: the four MESI states" loading="lazy" /><p class="chu-thich">🧩 One cache line, seen from one cache: the four MESI states</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' MESI: the four states of one cache line in one CPU's cache (bus snooping)
title MESI — one cache line, seen from ONE cache
state "I  Invalid\\nno valid copy here" as I
state "S  Shared\\nclean, others may have it" as S
state "E  Exclusive\\nclean, only copy" as E
state "M  Modified\\ndirty, only copy" as M
[*] --&gt; I
I --&gt; E : this CPU reads,\\nno other cache has it
I --&gt; S : this CPU reads,\\nanother cache has it
I --&gt; M : this CPU writes\\n(bus: read-for-ownership)
S --&gt; M : this CPU writes\\n(bus: invalidate others)
E --&gt; M : this CPU writes\\n(silent, no bus traffic)
M --&gt; S : another CPU reads\\n(write the data back first)
E --&gt; S : another CPU reads
M --&gt; I : another CPU writes\\n(write back, then drop)
E --&gt; I : another CPU writes
S --&gt; I : another CPU writes
note bottom of M : a line in M or E is the ONLY valid copy:\\nwrites need no bus traffic\\n(why a lock owned by one CPU is cheap,\\nand one fought over by many is not)
@enduml</code></pre></details>
<p>Coherence works on <strong>cache lines</strong> (typically 64 bytes on x86), not on single variables. That detail will matter on slide 14. In (c) the compiler or programmer puts <em>private</em> data (stack, thread-local variables) in the private memory, so the shared bus carries only truly shared data. Linux does a version of this for you: per-CPU variables (<code>DEFINE_PER_CPU</code> in the kernel) exist so that CPUs do not fight over one cache line.</p>
<p>➕ What does the machine in front of you look like? Run it:</p>
<div class="out"># How many processors does THIS machine have, and does it have NUMA nodes?<br>
$ echo "CPUs online: $(nproc) &nbsp;(list: $(cat /sys/devices/system/cpu/online))"<br>
CPUs online: 10 &nbsp;(list: 0-9)<br>
$ lscpu | grep -E "^(Architecture|CPU\\(s\\)|Thread\\(s\\) per core|Core\\(s\\) per|Socket|Model name)"<br>
Architecture: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;aarch64<br>
CPU(s): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
Model name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
Thread(s) per core: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Core(s) per cluster: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
Socket(s): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
# On a NUMA server this directory has node0, node1, ...; a laptop or a small VM has one node or none<br>
$ if [ -d /sys/devices/system/node ]; then echo "NUMA nodes: $(ls -d /sys/devices/system/node/node* | wc -l)"; else echo "NUMA nodes: none exposed (no /sys/devices/system/node)"; fi<br>
NUMA nodes: none exposed (no /sys/devices/system/node)<br>
# Cache coherence works on whole cache LINES; how big is one line here?<br>
$ cat /sys/devices/system/cpu/cpu0/cache/index0/coherency_line_size 2&gt;/dev/null || echo "(sysfs does not report the line size in this VM)"<br>
(sysfs does not report the line size in this VM)<br>
# All CPUs see ONE address space: the same /proc/meminfo, whichever CPU runs the command<br>
$ taskset -c 0 grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
$ taskset -c 5 grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The container reports 10 CPUs (this is a Mac with Apple silicon under Docker Desktop, so the CPUs are virtual and the architecture is <code>aarch64</code>; on WSL or a PC you would see <code>x86_64</code>). The last two lines are the point of a multiprocessor: whichever CPU runs the command, <code>/proc/meminfo</code> shows the same memory — <em>one</em> address space for all CPUs. The cache line size was not reported by this virtual machine; on a physical x86 server <code>cat /sys/devices/system/cpu/cpu0/cache/index0/coherency_line_size</code> prints 64.</p>
<p class="pitfall">⚠️ "Cache coherence" is <em>not</em> "cache consistency of your application cache (Redis)". Coherence is a hardware protocol between CPU caches that you never call; if your threads share a variable without a lock you still have a <em>race condition</em> (Chapter 2) — coherence only guarantees that every cache eventually agrees on each single word, not that a read-modify-write is atomic.</p>`,
        `<p class="y-chinh">🎯 Hình 8-2 — ba máy đa xử lý dùng bus: (a) vài CPU và một bộ nhớ trên một bus, <strong>không cache</strong> — mọi truy cập đều đi qua bus; (b) mỗi CPU có một <strong>cache</strong>, bớt gần hết lưu lượng bus nhưng sinh ra bài toán <strong>đồng bộ cache (cache coherence)</strong>; (c) cache <strong>cộng thêm bộ nhớ riêng</strong> cho mỗi CPU, dùng cho dữ liệu không bao giờ chia sẻ.</p>
<p>Một <strong>multiprocessor</strong> là máy có nhiều CPU và <em>một</em> không gian địa chỉ: CPU nào cũng <code>LOAD</code> hay <code>STORE</code> được mọi ô nhớ, và HĐH thấy một bộ nhớ. CPU nhanh hơn bộ nhớ nhiều lần, còn một bus mỗi lúc chỉ chở một lượt truyền. Ở (a) chỉ vài CPU đã làm nghẽn bus. Ở (b) mỗi CPU giữ các từ dùng gần đây trong cache nhanh của riêng nó, nên phần lớn lần đọc không chạm bus — nhưng giờ cùng một từ có thể nằm trong nhiều cache. Nếu CPU 1 ghi nó thì bản của CPU 2 bị <em>lỗi thời</em>. Phần cứng giải quyết bằng một <strong>giao thức đồng bộ cache</strong>: mỗi cache <em>nghe lén (snoop)</em> bus, thấy ai ghi vào dòng mà mình đang giữ thì vô hiệu hoặc cập nhật bản của mình. Sách mô tả bản write-through; CPU thật dùng <strong>MESI</strong> và các họ hàng — mỗi dòng cache ở một trong bốn trạng thái: Modified, Exclusive, Shared hoặc Invalid:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/086afd0de847d080893368fc8b888a5065e8c3e9.svg" alt="Một dòng cache, nhìn từ một cache: bốn trạng thái MESI" loading="lazy" /><p class="chu-thich">🧩 Một dòng cache, nhìn từ một cache: bốn trạng thái MESI</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' MESI: bốn trạng thái của MỘT dòng cache trong cache của MỘT CPU (nghe lén bus)
title MESI — one cache line, seen from ONE cache
state "I  Invalid\\nno valid copy here" as I
state "S  Shared\\nclean, others may have it" as S
state "E  Exclusive\\nclean, only copy" as E
state "M  Modified\\ndirty, only copy" as M
[*] --&gt; I
I --&gt; E : this CPU reads,\\nno other cache has it
I --&gt; S : this CPU reads,\\nanother cache has it
I --&gt; M : this CPU writes\\n(bus: read-for-ownership)
S --&gt; M : this CPU writes\\n(bus: invalidate others)
E --&gt; M : this CPU writes\\n(silent, no bus traffic)
M --&gt; S : another CPU reads\\n(write the data back first)
E --&gt; S : another CPU reads
M --&gt; I : another CPU writes\\n(write back, then drop)
E --&gt; I : another CPU writes
S --&gt; I : another CPU writes
note bottom of M : a line in M or E is the ONLY valid copy:\\nwrites need no bus traffic\\n(why a lock owned by one CPU is cheap,\\nand one fought over by many is not)
@enduml</code></pre></details>
<p>Đồng bộ cache làm việc theo <strong>dòng cache (cache line)</strong> (thường 64 byte trên x86), không theo từng biến. Chi tiết này sẽ quan trọng ở slide 14. Ở (c) trình biên dịch hoặc lập trình viên đặt dữ liệu <em>riêng</em> (stack, biến thread-local) vào bộ nhớ riêng, để bus chung chỉ chở dữ liệu thật sự chia sẻ. Linux làm một phiên bản của việc này hộ bạn: biến theo từng CPU (per-CPU, <code>DEFINE_PER_CPU</code> trong nhân) tồn tại để các CPU không tranh nhau một dòng cache.</p>
<p>➕ Cái máy trước mặt bạn trông thế nào? Chạy thử:</p>
<div class="out"># Máy NÀY có bao nhiêu bộ xử lý, và có node NUMA không?<br>
$ echo "CPUs online: $(nproc) &nbsp;(list: $(cat /sys/devices/system/cpu/online))"<br>
CPUs online: 10 &nbsp;(list: 0-9)<br>
$ lscpu | grep -E "^(Architecture|CPU\\(s\\)|Thread\\(s\\) per core|Core\\(s\\) per|Socket|Model name)"<br>
Architecture: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;aarch64<br>
CPU(s): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
Model name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
Thread(s) per core: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Core(s) per cluster: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
Socket(s): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
# Trên server NUMA thư mục này có node0, node1, ...; laptop hay VM nhỏ có một node hoặc không có<br>
$ if [ -d /sys/devices/system/node ]; then echo "NUMA nodes: $(ls -d /sys/devices/system/node/node* | wc -l)"; else echo "NUMA nodes: none exposed (no /sys/devices/system/node)"; fi<br>
NUMA nodes: none exposed (no /sys/devices/system/node)<br>
# Đồng bộ cache làm việc theo cả DÒNG cache; một dòng ở đây dài bao nhiêu?<br>
$ cat /sys/devices/system/cpu/cpu0/cache/index0/coherency_line_size 2&gt;/dev/null || echo "(sysfs does not report the line size in this VM)"<br>
(sysfs does not report the line size in this VM)<br>
# Mọi CPU thấy MỘT không gian địa chỉ: cùng /proc/meminfo, dù CPU nào chạy lệnh<br>
$ taskset -c 0 grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
$ taskset -c 5 grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Container báo 10 CPU (đây là Mac chip Apple dưới Docker Desktop, nên CPU là CPU ảo và kiến trúc là <code>aarch64</code>; trên WSL hay PC bạn sẽ thấy <code>x86_64</code>). Hai dòng cuối là điểm mấu chốt của multiprocessor: CPU nào chạy lệnh thì <code>/proc/meminfo</code> cũng hiện cùng một bộ nhớ — <em>một</em> không gian địa chỉ cho mọi CPU. Máy ảo này không báo cỡ dòng cache; trên server x86 vật lý, <code>cat /sys/devices/system/cpu/cpu0/cache/index0/coherency_line_size</code> in ra 64.</p>
<p class="pitfall">⚠️ "Cache coherence" <em>không phải</em> "nhất quán cache của ứng dụng (Redis)". Coherence là giao thức phần cứng giữa các cache của CPU mà bạn không bao giờ gọi; nếu các luồng dùng chung một biến mà không khoá thì vẫn có <em>race condition</em> (Chương 2) — coherence chỉ đảm bảo mọi cache rốt cuộc đồng ý về từng từ đơn lẻ, không đảm bảo một lệnh đọc-sửa-ghi là nguyên tử.</p>`],
      [4, 'UMA Multiprocessors Using Crossbar Switches',
        `<p class="y-chinh">🎯 Figure 8-3 — a <strong>crossbar switch</strong> connects <em>n</em> CPUs to <em>n</em> memories through an <em>n × n</em> grid of <strong>crosspoints</strong>; closing one crosspoint joins one CPU to one memory. It is <strong>non-blocking</strong> (any CPU can reach any free memory) but needs <strong>n²</strong> crosspoints.</p>
<p>The slide's machine is "UMA" — <strong>Uniform Memory Access</strong>: every CPU reads any memory word in the same time. A bus gives UMA but only one transfer at a time. A crossbar gives UMA <em>and</em> many simultaneous transfers: in Figure 8-3 several CPUs are connected to different memories at the same moment, each over its own closed crosspoint (the dark dots; open crosspoints are the empty circles). The only conflict is when two CPUs want the <em>same</em> memory — one must wait. The old telephone exchange (a "crossbar exchange") worked exactly like this, which is where the name comes from.</p>
<p>The price is the problem. With <em>n</em> = 8 there are 64 crosspoints; with 1024 CPUs and 1024 memories there are <strong>1,048,576</strong>. That is fine for a handful of CPUs and absurd for a thousand. Here is the cost, computed, next to the cheaper network of the next slide:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/439ff0b08c7d1cbed1652de6717dbe593d3cc766.svg" alt="Crosspoints needed by a crossbar and by an omega network (log scale)" loading="lazy" /><p class="chu-thich">🧮 Crosspoints needed by a crossbar and by an omega network (log scale)</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const K = 3, N = 8;
const rotl = (x) =&gt; ((x &lt;&lt; 1) | (x &gt;&gt; (K - 1))) &amp; (N - 1);
const bin = (x) =&gt; x.toString(2).padStart(K, '0');</code></pre></details>
<p>➕ The idea survives in modern hardware at small scale. A server-class chip's cores reach the shared last-level cache and the memory controllers through an on-chip network (a ring or a mesh); a network <em>switch</em> in a data centre is a crossbar inside; and a PCIe switch connecting GPUs and NVMe drives is another.</p>
<p class="meo">🧠 Remember crossbar as <strong>"fast and fair, but it grows with n²"</strong>. Whenever a design grows with n², the question is how large n can be.</p>`,
        `<p class="y-chinh">🎯 Hình 8-3 — một <strong>công tắc chéo (crossbar switch)</strong> nối <em>n</em> CPU với <em>n</em> bộ nhớ qua lưới <em>n × n</em> các <strong>điểm nối (crosspoint)</strong>; đóng một điểm nối là nối một CPU với một bộ nhớ. Nó <strong>không bị chặn (non-blocking)</strong> (CPU nào cũng với tới bộ nhớ nào đang rảnh) nhưng cần <strong>n²</strong> điểm nối.</p>
<p>Cỗ máy trên slide là "UMA" — <strong>Uniform Memory Access (truy cập bộ nhớ đồng đều)</strong>: mọi CPU đọc bất kỳ ô nhớ nào trong cùng một thời gian. Bus cho UMA nhưng mỗi lúc chỉ một lượt truyền. Crossbar cho UMA <em>và</em> nhiều lượt truyền cùng lúc: ở Hình 8-3 nhiều CPU nối với các bộ nhớ khác nhau cùng một lúc, mỗi cặp qua một điểm nối đã đóng riêng (chấm đen; điểm nối mở là vòng tròn rỗng). Xung đột duy nhất là khi hai CPU muốn <em>cùng một</em> bộ nhớ — một bên phải chờ. Tổng đài điện thoại cũ ("crossbar exchange") hoạt động đúng như vậy, tên gọi bắt nguồn từ đó.</p>
<p>Cái giá mới là vấn đề. Với <em>n</em> = 8 có 64 điểm nối; với 1024 CPU và 1024 bộ nhớ có <strong>1.048.576</strong>. Thế là ổn cho vài CPU và vô lý cho một nghìn. Đây là chi phí, tính ra, bên cạnh mạng rẻ hơn của slide kế:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ab97ab1bacfa5b67af6310144cb1c3aef9f9d129.svg" alt="Số điểm nối cần cho crossbar và cho mạng omega (thang log)" loading="lazy" /><p class="chu-thich">🧮 Số điểm nối cần cho crossbar và cho mạng omega (thang log)</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const K = 3, N = 8;
const rotl = (x) =&gt; ((x &lt;&lt; 1) | (x &gt;&gt; (K - 1))) &amp; (N - 1);
const bin = (x) =&gt; x.toString(2).padStart(K, '0');</code></pre></details>
<p>➕ Ý tưởng này còn sống trong phần cứng hiện đại ở quy mô nhỏ. Các nhân của chip hạng server với tới cache cuối chung và bộ điều khiển bộ nhớ qua một mạng trên chip (vòng hoặc lưới); một <em>switch</em> mạng trong trung tâm dữ liệu bên trong là một crossbar; và switch PCIe nối GPU với ổ NVMe là một ví dụ nữa.</p>
<p class="meo">🧠 Nhớ crossbar là <strong>"nhanh và công bằng, nhưng tăng theo n²"</strong>. Hễ thiết kế nào tăng theo n² thì câu hỏi là n lớn nhất được bao nhiêu.</p>`],
      [5, 'UMA Multiprocessors Using Multistage Switching Networks (1)',
        `<p class="y-chinh">🎯 Figure 8-4 — the building block of a <strong>multistage switching network</strong> is a tiny <strong>2 × 2 switch</strong> (two inputs A, B; two outputs X, Y) that can send each input to either output. A message has four fields: <strong>Module</strong> (which memory), <strong>Address</strong> (where inside that memory), <strong>Opcode</strong> (READ or WRITE) and an optional <strong>Value</strong> (for WRITE).</p>
<p>Instead of one huge grid, build a network of many small 2 × 2 switches in several <strong>stages</strong>. A switch looks at part of the message to decide which output to use — no central controller. The message format of Figure 8-4(b) is built for that: the <em>Module</em> field is what the switches read; the rest travels along to the memory. For 8 memories, Module needs 3 bits, so there are 3 stages, and stage <em>s</em> looks at bit <em>s</em> of the module number: 0 means "upper output", 1 means "lower output".</p>
<p>Count the hardware. A network for <em>n</em> CPUs and <em>n</em> memories has <code>log₂ n</code> stages of <code>n/2</code> switches each, so <code>(n/2)·log₂ n</code> switches. For n = 8 that is 12 switches (4 per stage, 3 stages) — the labels 1A…3D in the figure. For n = 1024 it is 5120 switches; the delay is 10 switch transitions instead of 1. Compare the chart of slide 4: ~20,000 crosspoints instead of a million. The price: <strong>a message now crosses log₂ n switches</strong> (slower than one crosspoint) and, as slide 6 shows, <strong>the network can block</strong>.</p>
<p>➕ Why is "A, B → X, Y" enough? Because a 2 × 2 switch has exactly two states — <em>straight</em> (A→X, B→Y) or <em>crossed</em> (A→Y, B→X). A whole network of 12 such switches therefore has 2¹² = 4096 possible settings. That number returns on the next slide.</p>
<p class="pitfall">⚠️ Do not confuse <code>log₂ 1024 = 10</code> (stages) with the number of switches 5120. A short FE-style check: for n = 16 the answer is 4 stages × 8 switches = 32 switches; for n = 8 it is 3 × 4 = 12.</p>`,
        `<p class="y-chinh">🎯 Hình 8-4 — viên gạch của một <strong>mạng chuyển mạch nhiều tầng (multistage switching network)</strong> là <strong>công tắc 2 × 2</strong> nhỏ xíu (hai ngõ vào A, B; hai ngõ ra X, Y) có thể gửi mỗi ngõ vào tới một trong hai ngõ ra. Một thông điệp có bốn trường: <strong>Module</strong> (bộ nhớ nào), <strong>Address</strong> (chỗ nào trong bộ nhớ đó), <strong>Opcode</strong> (READ hay WRITE) và <strong>Value</strong> tuỳ chọn (cho WRITE).</p>
<p>Thay vì một lưới khổng lồ, dựng một mạng nhiều công tắc 2 × 2 nhỏ qua nhiều <strong>tầng (stage)</strong>. Công tắc nhìn một phần của thông điệp để chọn ngõ ra — không có bộ điều khiển trung tâm. Khuôn dạng thông điệp ở Hình 8-4(b) được thiết kế cho việc đó: trường <em>Module</em> là thứ các công tắc đọc; phần còn lại đi theo tới bộ nhớ. Với 8 bộ nhớ, Module cần 3 bit, nên có 3 tầng, và tầng <em>s</em> nhìn bit <em>s</em> của số module: 0 là "ngõ ra trên", 1 là "ngõ ra dưới".</p>
<p>Đếm phần cứng. Mạng cho <em>n</em> CPU và <em>n</em> bộ nhớ có <code>log₂ n</code> tầng, mỗi tầng <code>n/2</code> công tắc, tức <code>(n/2)·log₂ n</code> công tắc. Với n = 8 là 12 công tắc (4 mỗi tầng, 3 tầng) — các nhãn 1A…3D trong hình. Với n = 1024 là 5120 công tắc; độ trễ là 10 lần qua công tắc thay vì 1. So với biểu đồ ở slide 4: ~20.000 điểm nối thay vì một triệu. Cái giá: <strong>thông điệp giờ đi qua log₂ n công tắc</strong> (chậm hơn một điểm nối) và, như slide 6 sẽ cho thấy, <strong>mạng có thể bị chặn</strong>.</p>
<p>➕ Vì sao "A, B → X, Y" là đủ? Vì công tắc 2 × 2 có đúng hai trạng thái — <em>thẳng</em> (A→X, B→Y) hoặc <em>chéo</em> (A→Y, B→X). Cả mạng 12 công tắc như vậy có 2¹² = 4096 cách đặt. Con số này sẽ quay lại ở slide sau.</p>
<p class="pitfall">⚠️ Đừng lẫn <code>log₂ 1024 = 10</code> (số tầng) với số công tắc 5120. Kiểm nhanh kiểu FE: với n = 16 đáp án là 4 tầng × 8 công tắc = 32 công tắc; với n = 8 là 3 × 4 = 12.</p>`],
      [6, 'UMA Multiprocessors Using Multistage Switching Networks (2)',
        `<p class="y-chinh">🎯 Figure 8-5 — an <strong>omega network</strong>: 8 CPUs, 8 memories, 3 stages of 2 × 2 switches, with a fixed wiring pattern between stages called a <strong>perfect shuffle</strong>. A message finds its way by itself: at stage <em>s</em> the switch reads bit <em>s</em> of the destination memory number. It is cheaper than a crossbar but it is a <strong>blocking</strong> network.</p>
<p>The wiring between stages is the same everywhere: take the output lines numbered 0…7 and rotate the bits of the number left by one position — like shuffling a deck by interleaving the two halves. Follow one message: CPU 011 wants memory 110. It enters stage 1 on line <code>110</code> (011 rotated), i.e. switch 1D; the first bit of the destination is 1, so it leaves by the <em>lower</em> output; the second bit is 1, lower again; the third bit is 0, upper. After three hops it arrives at line 110 = memory 6. The drawing below is made by the program, which also checks that every one of the 64 CPU–memory pairs really arrives:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d782d68b324fd585590a2b07d863c7e25cc7f886.svg" alt="CPU 011 → memory 110 through switches 1D, 2D, 3D" loading="lazy" /><p class="chu-thich">🧮 CPU 011 → memory 110 through switches 1D, 2D, 3D</p></div>
<p>Path: 1D (bit 1 → lower) → 2D (bit 1 → lower) → 3D (bit 0 → upper)</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const K = 3, N = 8;
const rotl = (x) =&gt; ((x &lt;&lt; 1) | (x &gt;&gt; (K - 1))) &amp; (N - 1);
const bin = (x) =&gt; x.toString(2).padStart(K, '0');</code></pre></details>
<p><strong>Blocking.</strong> There are 8! = 40,320 ways to connect 8 CPUs one-to-one with 8 memories, but the network has only 12 two-state switches = 2¹² = 4096 settings, so it cannot realise them all at once. Two messages that need the same output of the same switch collide, and one must wait. Example: CPU 000 → memory 000 and CPU 100 → memory 001 both enter switch 1A and both want its upper output:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1184584209a50e4f6b3109af233bb7b45f0f0a70.svg" alt="Two messages at once: they collide in switch 1A (and share the wire after it)" loading="lazy" /><p class="chu-thich">🧮 Two messages at once: they collide in switch 1A (and share the wire after it)</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const K = 3, N = 8;
const rotl = (x) =&gt; ((x &lt;&lt; 1) | (x &gt;&gt; (K - 1))) &amp; (N - 1);
const bin = (x) =&gt; x.toString(2).padStart(K, '0');</code></pre></details>
<p>And how many of the 40,320 pairings go through without any collision? The program tries them all:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/de6555def16ee35bafe51ce6a193fffc8effa371.svg" alt="Brute force over all 40,320 permutations: exactly 4096 pass" loading="lazy" /><p class="chu-thich">🧮 Brute force over all 40,320 permutations: exactly 4096 pass</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const K = 3, N = 8;
const rotl = (x) =&gt; ((x &lt;&lt; 1) | (x &gt;&gt; (K - 1))) &amp; (N - 1);
const bin = (x) =&gt; x.toString(2).padStart(K, '0');</code></pre></details>
<p>So an omega network passes only about 10% of "everybody talks to a different memory" patterns without waiting; a crossbar passes all. In real systems the hardware also queues messages in the switches and the OS spreads the load, so the loss is usually tolerable — which is why the book calls the omega network a <em>compromise</em>.</p>
<p>➕ The same shuffle-exchange idea shows up outside multiprocessors: the sorting networks used on GPUs, the FFT butterfly, and the topology of some switch fabrics all use it.</p>
<p class="meo">🧠 One sentence: <em>crossbar = every pair can talk at once (n² switches); omega = fewer switches (n/2·log₂n) but some pairs must wait.</em></p>`,
        `<p class="y-chinh">🎯 Hình 8-5 — một <strong>mạng omega</strong>: 8 CPU, 8 bộ nhớ, 3 tầng công tắc 2 × 2, với kiểu đi dây cố định giữa các tầng gọi là <strong>xáo trộn hoàn hảo (perfect shuffle)</strong>. Thông điệp tự tìm đường: ở tầng <em>s</em>, công tắc đọc bit <em>s</em> của số bộ nhớ đích. Nó rẻ hơn crossbar nhưng là mạng <strong>có thể bị chặn (blocking)</strong>.</p>
<p>Kiểu đi dây giữa các tầng ở đâu cũng giống nhau: lấy các đường ra đánh số 0…7 rồi xoay các bit của số đó sang trái một vị trí — như xáo bài bằng cách chen hai nửa xen kẽ. Theo dõi một thông điệp: CPU 011 muốn bộ nhớ 110. Nó vào tầng 1 trên đường <code>110</code> (011 xoay), tức công tắc 1D; bit đầu của đích là 1 nên nó ra ở ngõ <em>dưới</em>; bit thứ hai là 1, lại dưới; bit thứ ba là 0, trên. Sau ba bước nó tới đường 110 = bộ nhớ 6. Hình dưới do chương trình vẽ, và chương trình cũng kiểm rằng cả 64 cặp CPU–bộ nhớ đều thật sự tới nơi:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/031f16d57d703be8aed93ce64325d590a908d894.svg" alt="CPU 011 → bộ nhớ 110 qua các công tắc 1D, 2D, 3D" loading="lazy" /><p class="chu-thich">🧮 CPU 011 → bộ nhớ 110 qua các công tắc 1D, 2D, 3D</p></div>
<p>Đường đi: 1D (bit 1 → dưới) → 2D (bit 1 → dưới) → 3D (bit 0 → trên)</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const K = 3, N = 8;
const rotl = (x) =&gt; ((x &lt;&lt; 1) | (x &gt;&gt; (K - 1))) &amp; (N - 1);
const bin = (x) =&gt; x.toString(2).padStart(K, '0');</code></pre></details>
<p><strong>Bị chặn.</strong> Có 8! = 40.320 cách nối 8 CPU một-một với 8 bộ nhớ, nhưng mạng chỉ có 12 công tắc hai trạng thái = 2¹² = 4096 cách đặt, nên không thể thực hiện hết chúng cùng lúc. Hai thông điệp cần cùng một ngõ ra của cùng một công tắc sẽ va nhau, một bên phải chờ. Ví dụ: CPU 000 → bộ nhớ 000 và CPU 100 → bộ nhớ 001 cùng vào công tắc 1A và cùng muốn ngõ ra trên của nó:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/2b16006821207c925bd4a1f0515975409ff9bf69.svg" alt="Hai thông điệp cùng lúc: va nhau ở công tắc 1A (và dùng chung dây phía sau)" loading="lazy" /><p class="chu-thich">🧮 Hai thông điệp cùng lúc: va nhau ở công tắc 1A (và dùng chung dây phía sau)</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const K = 3, N = 8;
const rotl = (x) =&gt; ((x &lt;&lt; 1) | (x &gt;&gt; (K - 1))) &amp; (N - 1);
const bin = (x) =&gt; x.toString(2).padStart(K, '0');</code></pre></details>
<p>Vậy trong 40.320 cách ghép, bao nhiêu cách đi qua không va nhau? Chương trình thử hết:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8b1c07eaff46d056bf294ea49e03399cfd1cc6fe.svg" alt="Vét cạn mọi 40.320 hoán vị: đúng 4096 cách đi qua" loading="lazy" /><p class="chu-thich">🧮 Vét cạn mọi 40.320 hoán vị: đúng 4096 cách đi qua</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const K = 3, N = 8;
const rotl = (x) =&gt; ((x &lt;&lt; 1) | (x &gt;&gt; (K - 1))) &amp; (N - 1);
const bin = (x) =&gt; x.toString(2).padStart(K, '0');</code></pre></details>
<p>Tức là mạng omega chỉ cho qua khoảng 10% kiểu "ai cũng nói chuyện với một bộ nhớ khác nhau" mà không phải chờ; crossbar cho qua tất cả. Ở hệ thống thật, phần cứng còn xếp hàng thông điệp trong các công tắc và HĐH rải tải, nên mất mát thường chấp nhận được — vì vậy sách gọi mạng omega là một sự <em>thoả hiệp</em>.</p>
<p>➕ Cùng ý tưởng xáo trộn–đổi chỗ này xuất hiện ngoài đa xử lý: mạng sắp xếp trên GPU, bướm FFT, và cấu trúc của một số mạch switch đều dùng nó.</p>
<p class="meo">🧠 Một câu: <em>crossbar = cặp nào cũng nói chuyện cùng lúc được (n² công tắc); omega = ít công tắc hơn (n/2·log₂n) nhưng có cặp phải chờ.</em></p>`],
      [7, 'NUMA Multiprocessors (1)',
        `<p class="y-chinh">🎯 Three properties define a <strong>NUMA</strong> (<em>Non-Uniform Memory Access</em>) machine: (1) <strong>one address space</strong> visible to all CPUs; (2) remote memory is reached with ordinary <strong>LOAD and STORE</strong>; (3) remote memory is <strong>slower</strong> than local memory.</p>
<p>A bus or a crossbar cannot grow past a few dozen CPUs, so big shared-memory machines give each group of CPUs its own <em>local</em> memory and join the groups with a network. Every CPU still sees the whole memory as one address space (property 1), so a program does not change; but a word held by a far group takes longer to reach (property 3). Picture a library with several branches: you can borrow any book in the city (one catalogue), but a book in your own branch arrives instantly and one in another branch needs a delivery van.</p>
<p>The book separates two variants: <strong>NC-NUMA</strong> (no caching of remote memory: slow and rare) and <strong>CC-NUMA</strong> (<em>cache-coherent</em> NUMA: remote words may be cached and the hardware keeps the copies consistent — this is what all real servers are). The next two slides show how a directory achieves coherence without a shared bus.</p>
<p>➕ A modern server is NUMA even if you never asked for it: a 2-socket machine has two CPU chips, each wired to its own DIMMs; a single AMD EPYC chip can be several NUMA domains inside one socket. Linux names each domain a <em>node</em>:</p>
<pre><code class="language-bash">$ numactl -H          # sample from a 2-socket x86 server (typical shape, not run in the course container)
available: 2 nodes (0-1)
node 0 cpus: 0 1 2 3 4 5 6 7
node 0 size: 64000 MB
node distances:
node   0   1
  0:  10  21
  1:  21  10</code></pre>
<p>The matrix is the firmware's <em>relative</em> distance table (ACPI "SLIT"): 10 means "local", so 21 means "about 2× as far" — a convention, not nanoseconds. In the course container (a virtual machine with no NUMA topology) the directory <code>/sys/devices/system/node</code> does not exist at all, as the program of slide 3 printed — so NUMA effects <em>cannot be measured here</em>; we model them with a simulator on the next slides.</p>
<p>Linux placement policy: by default a page is allocated on the node of the CPU that first touches it (<em>first-touch</em>), and the scheduler tries to keep a thread near its memory. You can override it: <code>numactl --cpunodebind=0 --membind=0 ./prog</code> pins a program and its memory to node 0; <code>numactl --interleave=all</code> spreads pages round-robin over all nodes — the usual advice for a big database buffer pool that every CPU shares.</p>
<div class="callout">🧭 On a real server: PostgreSQL's <code>shared_buffers</code> and the MySQL InnoDB buffer pool are one huge memory region shared by all backends; on a 2-socket server half the accesses can be remote. Operators commonly start such databases under <code>numactl --interleave=all</code> and set <code>vm.zone_reclaim_mode = 0</code> so one node's memory pressure does not stall everything (check the documentation of your database version before copying). Kubernetes has a "topology manager" that tries to give a pod CPUs and memory from the same NUMA node.</div>
<p class="pitfall">⚠️ "NUMA = slower than UMA" is wrong as a slogan. NUMA is how machines get <em>bigger</em>; a well-placed program is as fast as on UMA. The cost appears when a thread and its data end up on different nodes.</p>`,
        `<p class="y-chinh">🎯 Ba tính chất xác định một máy <strong>NUMA</strong> (<em>Non-Uniform Memory Access — truy cập bộ nhớ không đồng đều</em>): (1) <strong>một không gian địa chỉ</strong> mọi CPU đều thấy; (2) bộ nhớ ở xa được truy cập bằng lệnh <strong>LOAD và STORE</strong> bình thường; (3) bộ nhớ ở xa <strong>chậm hơn</strong> bộ nhớ cục bộ.</p>
<p>Bus hay crossbar không lớn quá vài chục CPU, nên các máy chia sẻ bộ nhớ lớn cho mỗi nhóm CPU một bộ nhớ <em>cục bộ</em> riêng và nối các nhóm bằng một mạng. CPU vẫn thấy toàn bộ bộ nhớ như một không gian địa chỉ (tính chất 1), nên chương trình không phải đổi; nhưng một từ nằm ở nhóm xa thì lâu hơn mới tới (tính chất 3). Hãy hình dung một thư viện có nhiều chi nhánh: bạn mượn được mọi cuốn sách trong thành phố (một mục lục chung), nhưng sách ở chi nhánh của bạn tới ngay còn sách ở chi nhánh khác cần xe chở.</p>
<p>Sách tách hai biến thể: <strong>NC-NUMA</strong> (không cache bộ nhớ ở xa: chậm và hiếm) và <strong>CC-NUMA</strong> (<em>NUMA có đồng bộ cache</em>: từ ở xa có thể được cache và phần cứng giữ các bản sao nhất quán — mọi server thật đều là loại này). Hai slide kế cho thấy một thư mục (directory) đạt đồng bộ cache thế nào mà không cần bus chung.</p>
<p>➕ Server hiện đại là NUMA dù bạn không đòi: máy 2 socket có hai chip CPU, mỗi chip nối với dãy RAM riêng; một chip AMD EPYC còn có thể là vài miền NUMA trong một socket. Linux gọi mỗi miền là một <em>node</em>:</p>
<pre><code class="language-bash">$ numactl -H          # mẫu từ server x86 2 socket (hình dạng điển hình, KHÔNG chạy trong container của môn)
available: 2 nodes (0-1)
node 0 cpus: 0 1 2 3 4 5 6 7
node 0 size: 64000 MB
node distances:
node   0   1
  0:  10  21
  1:  21  10</code></pre>
<p>Ma trận là bảng khoảng cách <em>tương đối</em> của firmware (ACPI "SLIT"): 10 nghĩa là "cục bộ", nên 21 là "xa gấp khoảng 2 lần" — một quy ước, không phải nano giây. Trong container của môn (máy ảo không có cấu trúc NUMA) thư mục <code>/sys/devices/system/node</code> hoàn toàn không tồn tại, như chương trình ở slide 3 đã in — nên hiệu ứng NUMA <em>không đo được ở đây</em>; ta mô hình hoá bằng bộ mô phỏng ở các slide sau.</p>
<p>Chính sách đặt trang của Linux: mặc định một trang được cấp ở node của CPU chạm vào nó đầu tiên (<em>first-touch</em>), và bộ lập lịch cố giữ luồng gần bộ nhớ của nó. Bạn ghi đè được: <code>numactl --cpunodebind=0 --membind=0 ./prog</code> ghim chương trình và bộ nhớ vào node 0; <code>numactl --interleave=all</code> rải trang vòng tròn khắp các node — lời khuyên thường gặp cho buffer pool lớn của cơ sở dữ liệu mà mọi CPU cùng dùng.</p>
<div class="callout">🧭 Trên server thật: <code>shared_buffers</code> của PostgreSQL và buffer pool InnoDB của MySQL là một vùng nhớ khổng lồ mọi backend dùng chung; trên server 2 socket có thể một nửa số truy cập là ở xa. Người vận hành thường khởi động các CSDL đó dưới <code>numactl --interleave=all</code> và đặt <code>vm.zone_reclaim_mode = 0</code> để áp lực bộ nhớ của một node không làm kẹt cả máy (hãy đọc tài liệu của đúng phiên bản CSDL trước khi chép). Kubernetes có "topology manager" cố cấp cho một pod CPU và bộ nhớ từ cùng một node NUMA.</div>
<p class="pitfall">⚠️ "NUMA = chậm hơn UMA" là khẩu hiệu sai. NUMA là cách máy trở nên <em>lớn hơn</em>; một chương trình đặt chỗ tốt nhanh bằng trên UMA. Cái giá chỉ lộ ra khi luồng và dữ liệu của nó rơi vào hai node khác nhau.</p>`],
      [8, 'NUMA Multiprocessors (2)',
        `<p class="y-chinh">🎯 Figure 8-6(a) — a <strong>directory-based</strong> CC-NUMA machine with <strong>256 nodes</strong>: each node has a CPU, local memory on a local bus, and a <strong>directory</strong> that records which of <em>its own</em> memory blocks are cached somewhere. Nodes are joined by an interconnection network.</p>
<p>With a bus, coherence is easy: everybody listens. With 256 nodes and no common bus, nobody can listen to everybody. The book's answer is the <strong>directory</strong>. Every memory block (one cache line) has a <em>home node</em> — the node whose RAM holds it — and the home node keeps a small table entry per block that says "who has a cached copy". To read or write a word, a CPU sends a message to the home node of that address; the home node looks at its directory and either answers from its own RAM or tells the current holder to hand the block over. So a coherence action costs <strong>a few point-to-point messages</strong>, never a broadcast to 255 nodes.</p>
<p>What does that bookkeeping cost? With the book's numbers (256 nodes, 2<sup>18</sup> blocks of 64 bytes per node), computed by the program:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a0d1eef3c8fd68c0cced4144024ed90dcfcd08b1.svg" alt="Memory and directory size in Figure 8-6" loading="lazy" /><p class="chu-thich">🧮 Memory and directory size in Figure 8-6</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const NODE_BITS = 8, BLOCK_BITS = 18, OFF_BITS = 6;
const tachDiaChi = (a) =&gt; ({ nut: (a &gt;&gt;&gt; (BLOCK_BITS + OFF_BITS)) &amp; 0xff, khoi: (a &gt;&gt;&gt; OFF_BITS) &amp; ((1 &lt;&lt; BLOCK_BITS) - 1), lech: a &amp; ((1 &lt;&lt; OFF_BITS) - 1) });
const A = ((36 &lt;&lt; 24) | (4 &lt;&lt; 6) | 8) &gt;&gt;&gt; 0;                       // 0x24000108
const THU_MUC_36 = [[0, null], [0, null], [1, 82], [0, null], [0, null]];   // (hợp lệ?, nút đang giữ) — Hình 8-6(c)</code></pre></details>
<p>About 1.8% of memory goes to the directory — acceptable — but remember this entry holds only <em>one</em> holder per block; a real design must also remember all sharers of a read-only block, and that is where the cost explodes. (The book says so too: the scheme, as drawn, is "just" the idea.)</p>
<p>➕ The same <em>home node + directory</em> idea appears far from hardware: in a sharded key–value store (Redis Cluster, Cassandra) every key has a home shard computed by hashing, and clients ask that shard — no broadcast. In a distributed cache the "directory" is the hash ring.</p>
<p class="meo">🧠 Bus ⇒ coherence by <em>broadcast</em> (snooping). Many nodes ⇒ coherence by <em>asking the home node</em> (directory). Same goal, scalable method.</p>`,
        `<p class="y-chinh">🎯 Hình 8-6(a) — một máy CC-NUMA <strong>dựa trên thư mục (directory-based)</strong> với <strong>256 nút</strong>: mỗi nút có một CPU, bộ nhớ cục bộ trên bus cục bộ, và một <strong>thư mục</strong> ghi lại khối nào trong bộ nhớ <em>của chính nó</em> đang được cache ở đâu đó. Các nút nối với nhau bằng mạng liên kết.</p>
<p>Có bus thì đồng bộ cache dễ: ai cũng nghe được. Với 256 nút và không có bus chung, không ai nghe được tất cả. Câu trả lời của sách là <strong>thư mục (directory)</strong>. Mỗi khối bộ nhớ (một dòng cache) có một <em>nút nhà (home node)</em> — nút có RAM chứa nó — và nút nhà giữ một mục nhỏ cho mỗi khối ghi "ai đang cache một bản". Để đọc hay ghi một từ, CPU gửi thông điệp tới nút nhà của địa chỉ đó; nút nhà xem thư mục rồi hoặc trả lời từ RAM của mình, hoặc bảo bên đang giữ chuyển khối lại. Vậy một thao tác đồng bộ tốn <strong>vài thông điệp điểm–điểm</strong>, không bao giờ là phát quảng bá tới 255 nút.</p>
<p>Sổ sách đó tốn bao nhiêu? Với số liệu của sách (256 nút, mỗi nút 2<sup>18</sup> khối 64 byte), chương trình tính:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/aabfc957097035fcc783ddfd7f81352c938a9eb7.svg" alt="Cỡ bộ nhớ và thư mục trong Hình 8-6" loading="lazy" /><p class="chu-thich">🧮 Cỡ bộ nhớ và thư mục trong Hình 8-6</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const NODE_BITS = 8, BLOCK_BITS = 18, OFF_BITS = 6;
const tachDiaChi = (a) =&gt; ({ nut: (a &gt;&gt;&gt; (BLOCK_BITS + OFF_BITS)) &amp; 0xff, khoi: (a &gt;&gt;&gt; OFF_BITS) &amp; ((1 &lt;&lt; BLOCK_BITS) - 1), lech: a &amp; ((1 &lt;&lt; OFF_BITS) - 1) });
const A = ((36 &lt;&lt; 24) | (4 &lt;&lt; 6) | 8) &gt;&gt;&gt; 0;                       // 0x24000108
const THU_MUC_36 = [[0, null], [0, null], [1, 82], [0, null], [0, null]];   // (hợp lệ?, nút đang giữ) — Hình 8-6(c)</code></pre></details>
<p>Khoảng 1,8% bộ nhớ dành cho thư mục — chấp nhận được — nhưng nhớ rằng mục này chỉ chứa <em>một</em> bên giữ cho mỗi khối; thiết kế thật còn phải nhớ mọi bên chia sẻ của một khối chỉ đọc, và đó là chỗ chi phí bùng nổ. (Sách cũng nói vậy: sơ đồ như được vẽ chỉ là "ý tưởng".)</p>
<p>➕ Ý tưởng <em>nút nhà + thư mục</em> này còn xuất hiện xa phần cứng: trong kho khoá–giá trị phân mảnh (Redis Cluster, Cassandra) mỗi khoá có một shard nhà tính bằng băm, và client hỏi thẳng shard đó — không phát quảng bá. Ở cache phân tán, "thư mục" chính là vòng băm.</p>
<p class="meo">🧠 Bus ⇒ đồng bộ bằng <em>phát quảng bá</em> (nghe lén). Nhiều nút ⇒ đồng bộ bằng <em>hỏi nút nhà</em> (thư mục). Cùng mục tiêu, phương pháp mở rộng được.</p>`],
      [9, 'NUMA Multiprocessors (3)',
        `<p class="y-chinh">🎯 Figure 8-6(b)(c) — a 32-bit address in this machine is cut into <strong>8 bits of node</strong>, <strong>18 bits of block</strong> and <strong>6 bits of offset</strong>; the node field says which node's memory holds the word, and the block number is the index into <em>that node's directory</em> (c).</p>
<p>Let a CPU on node 20 execute a <code>LOAD</code> from address <code>0x24000108</code>. The hardware cuts the address: node = 36, block = 4, offset = 8. The program does the cutting, so you can check it:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/26b1e43d0859874d2454a016a3e2df27b845d370.svg" alt="The 32-bit address split into node, block and offset" loading="lazy" /><p class="chu-thich">🧮 The 32-bit address split into node, block and offset</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const NODE_BITS = 8, BLOCK_BITS = 18, OFF_BITS = 6;
const tachDiaChi = (a) =&gt; ({ nut: (a &gt;&gt;&gt; (BLOCK_BITS + OFF_BITS)) &amp; 0xff, khoi: (a &gt;&gt;&gt; OFF_BITS) &amp; ((1 &lt;&lt; BLOCK_BITS) - 1), lech: a &amp; ((1 &lt;&lt; OFF_BITS) - 1) });
const A = ((36 &lt;&lt; 24) | (4 &lt;&lt; 6) | 8) &gt;&gt;&gt; 0;                       // 0x24000108
const THU_MUC_36 = [[0, null], [0, null], [1, 82], [0, null], [0, null]];   // (hợp lệ?, nút đang giữ) — Hình 8-6(c)</code></pre></details>
<p>Then the story of the book, drawn with the directory of node 36 (entries 0–4; entry 2 says "cached at node 82"):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/596e044b9511f46b93ffd47d3c29a68c2e93def9.svg" alt="Directory at node 36 and two LOADs" loading="lazy" /><p class="chu-thich">🧮 Directory at node 36 and two LOADs</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const NODE_BITS = 8, BLOCK_BITS = 18, OFF_BITS = 6;
const tachDiaChi = (a) =&gt; ({ nut: (a &gt;&gt;&gt; (BLOCK_BITS + OFF_BITS)) &amp; 0xff, khoi: (a &gt;&gt;&gt; OFF_BITS) &amp; ((1 &lt;&lt; BLOCK_BITS) - 1), lech: a &amp; ((1 &lt;&lt; OFF_BITS) - 1) });
const A = ((36 &lt;&lt; 24) | (4 &lt;&lt; 6) | 8) &gt;&gt;&gt; 0;                       // 0x24000108
const THU_MUC_36 = [[0, null], [0, null], [1, 82], [0, null], [0, null]];   // (hợp lệ?, nút đang giữ) — Hình 8-6(c)</code></pre></details>
<p>Case 1: block 4 is cached nowhere (<em>valid</em> = 0), so node 36 reads it from its own RAM, sends it to node 20 and records "node 20 has it". Case 2: block 2 is cached at node 82; node 36 asks node 82 to forward it (if node 82 modified it, the new data is written back first), and updates the entry. In both cases the requester only ever talks to <strong>one</strong> node, the home.</p>
<p>The cost of a NUMA access is therefore <em>one to three message hops</em> instead of one memory read — slower, but still a LOAD instruction to the programmer. This is the key difference from the next family: here the <em>hardware</em> makes remote memory look like local memory; in a multicomputer the <em>software</em> must send messages.</p>
<p class="pitfall">⚠️ A frequent FE-style mix-up: in a directory scheme the node number inside the address chooses the <em>home</em> node, not the CPU that is asking. The offset (6 bits = 64 bytes) is inside the block and is not used by the directory.</p>`,
        `<p class="y-chinh">🎯 Hình 8-6(b)(c) — địa chỉ 32 bit của máy này được cắt thành <strong>8 bit nút</strong>, <strong>18 bit khối</strong> và <strong>6 bit độ lệch</strong>; trường nút cho biết bộ nhớ của nút nào chứa từ đó, còn số khối là chỉ số vào <em>thư mục của nút đó</em> (c).</p>
<p>Cho một CPU ở nút 20 chạy <code>LOAD</code> từ địa chỉ <code>0x24000108</code>. Phần cứng cắt địa chỉ: nút = 36, khối = 4, độ lệch = 8. Chương trình làm việc cắt, nên bạn kiểm được:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e4df6b5ecbd6b94c0c965495bbbf5e469518aa33.svg" alt="Địa chỉ 32 bit tách thành nút, khối và độ lệch" loading="lazy" /><p class="chu-thich">🧮 Địa chỉ 32 bit tách thành nút, khối và độ lệch</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const NODE_BITS = 8, BLOCK_BITS = 18, OFF_BITS = 6;
const tachDiaChi = (a) =&gt; ({ nut: (a &gt;&gt;&gt; (BLOCK_BITS + OFF_BITS)) &amp; 0xff, khoi: (a &gt;&gt;&gt; OFF_BITS) &amp; ((1 &lt;&lt; BLOCK_BITS) - 1), lech: a &amp; ((1 &lt;&lt; OFF_BITS) - 1) });
const A = ((36 &lt;&lt; 24) | (4 &lt;&lt; 6) | 8) &gt;&gt;&gt; 0;                       // 0x24000108
const THU_MUC_36 = [[0, null], [0, null], [1, 82], [0, null], [0, null]];   // (hợp lệ?, nút đang giữ) — Hình 8-6(c)</code></pre></details>
<p>Rồi câu chuyện của sách, vẽ cùng thư mục của nút 36 (mục 0–4; mục 2 ghi "cache ở nút 82"):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7a0138e800e5b0229eed29b6633d581d7cb72de4.svg" alt="Thư mục tại nút 36 và hai lệnh LOAD" loading="lazy" /><p class="chu-thich">🧮 Thư mục tại nút 36 và hai lệnh LOAD</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const NODE_BITS = 8, BLOCK_BITS = 18, OFF_BITS = 6;
const tachDiaChi = (a) =&gt; ({ nut: (a &gt;&gt;&gt; (BLOCK_BITS + OFF_BITS)) &amp; 0xff, khoi: (a &gt;&gt;&gt; OFF_BITS) &amp; ((1 &lt;&lt; BLOCK_BITS) - 1), lech: a &amp; ((1 &lt;&lt; OFF_BITS) - 1) });
const A = ((36 &lt;&lt; 24) | (4 &lt;&lt; 6) | 8) &gt;&gt;&gt; 0;                       // 0x24000108
const THU_MUC_36 = [[0, null], [0, null], [1, 82], [0, null], [0, null]];   // (hợp lệ?, nút đang giữ) — Hình 8-6(c)</code></pre></details>
<p>Trường hợp 1: khối 4 chưa được cache ở đâu (<em>valid</em> = 0), nên nút 36 đọc nó từ RAM của mình, gửi cho nút 20 và ghi "nút 20 đang giữ". Trường hợp 2: khối 2 đang cache ở nút 82; nút 36 nhờ nút 82 chuyển tiếp (nếu nút 82 đã sửa nó thì dữ liệu mới được ghi trả về trước), rồi cập nhật mục. Cả hai trường hợp, bên xin chỉ nói chuyện với <strong>một</strong> nút, nút nhà.</p>
<p>Chi phí một lần truy cập NUMA vì thế là <em>một tới ba bước thông điệp</em> thay vì một lần đọc bộ nhớ — chậm hơn, nhưng với lập trình viên vẫn là một lệnh LOAD. Đây là khác biệt mấu chốt với họ máy kế tiếp: ở đây <em>phần cứng</em> làm bộ nhớ ở xa trông như bộ nhớ cục bộ; ở multicomputer thì <em>phần mềm</em> phải gửi thông điệp.</p>
<p class="pitfall">⚠️ Một nhầm lẫn kiểu FE hay gặp: trong sơ đồ thư mục, số nút nằm trong địa chỉ chọn nút <em>nhà</em>, không phải CPU đang xin. Độ lệch (6 bit = 64 byte) nằm trong khối và không được thư mục dùng.</p>`],
      [10, 'Multiprocessor Operating System Types: Each CPU Has Its Own Operating System',
        `<p class="y-chinh">🎯 Figure 8-7 — the simplest multiprocessor OS: <strong>each CPU has its own private OS</strong>. Memory is split into four fixed partitions, one per CPU; each CPU runs its own copy of the OS (the code is shared read-only, the data are private), and each CPU serves its own processes.</p>
<p>This is the easiest design: take a single-CPU OS, run four copies, give each a quarter of the memory. Nothing in the kernel needs to know about the other CPUs. It is what you get if you put four separate computers in one box. The book lists the flaws: (1) when a process makes a system call it is handled <em>by the CPU it runs on</em>, with that CPU's private tables — fine; but (2) <strong>no load balancing</strong>: if CPU 1 has 20 processes and CPU 3 is idle, nothing moves a process across; (3) <strong>no shared pages</strong>: a process on CPU 1 cannot share a memory page with one on CPU 2, and one CPU may be short of memory while another has plenty, because each CPU's allocation is private; (4) the <strong>file-system cache</strong> (buffer cache) becomes inconsistent: CPU 1 may hold a modified copy of a disk block that CPU 2 reads from disk in its older form. The last point alone killed the design for general use.</p>
<p>Where it is still used: <em>static partitioning</em> in special systems. A <strong>virtual machine</strong> host splits a big machine into guests that each run their own OS on their own share of CPUs and memory (Chapter 7, hypervisors); embedded SoCs run Linux on some cores and a small real-time OS on others (AMP, asymmetric multiprocessing). A <strong>container</strong> limited with <code>--cpus</code> or cpusets is a softer form, but containers share <em>one</em> kernel, so they are not this design.</p>
<p class="meo">🧠 Own OS per CPU = <strong>no sharing, no problems, no sharing benefits either</strong>.</p>
<p class="pitfall">⚠️ FE-style: "each CPU has its own OS" is the design with the <em>buffer-cache inconsistency</em> and <em>no process sharing</em>. Do not mix it up with SMP (slide 12), where there is ONE OS copy.</p>`,
        `<p class="y-chinh">🎯 Hình 8-7 — HĐH đa xử lý đơn giản nhất: <strong>mỗi CPU có HĐH riêng của mình</strong>. Bộ nhớ chia thành bốn phân vùng cố định, mỗi CPU một phân vùng; mỗi CPU chạy một bản HĐH của riêng nó (mã dùng chung chỉ đọc, dữ liệu thì riêng), và phục vụ các tiến trình của chính nó.</p>
<p>Đây là thiết kế dễ nhất: lấy một HĐH một CPU, chạy bốn bản, cho mỗi bản một phần tư bộ nhớ. Không chỗ nào trong nhân cần biết về CPU khác. Nó là thứ bạn có nếu nhét bốn máy tính riêng vào một cái hộp. Sách liệt kê các khuyết điểm: (1) khi tiến trình gọi hệ thống, <em>CPU nó đang chạy</em> xử lý với các bảng riêng của CPU đó — ổn; nhưng (2) <strong>không cân bằng tải</strong>: nếu CPU 1 có 20 tiến trình và CPU 3 rảnh, chẳng gì chuyển tiến trình sang; (3) <strong>không chia sẻ trang</strong>: tiến trình trên CPU 1 không chia sẻ được một trang nhớ với tiến trình trên CPU 2, và một CPU có thể thiếu bộ nhớ trong khi CPU khác dư, vì mỗi CPU cấp phát riêng; (4) <strong>bộ đệm hệ thống tệp (buffer cache)</strong> trở nên không nhất quán: CPU 1 có thể giữ một bản đã sửa của một khối đĩa trong khi CPU 2 đọc từ đĩa bản cũ hơn. Riêng điểm cuối đã giết thiết kế này cho dùng đại trà.</p>
<p>Nó vẫn được dùng ở đâu: <em>phân vùng tĩnh</em> trong các hệ thống đặc biệt. Máy chủ <strong>máy ảo (virtual machine)</strong> chia một máy lớn thành các guest, mỗi guest chạy HĐH riêng trên phần CPU và bộ nhớ riêng (Chương 7, hypervisor); SoC nhúng chạy Linux trên vài nhân và một HĐH thời gian thực nhỏ trên các nhân khác (AMP, đa xử lý bất đối xứng). <strong>Container</strong> bị giới hạn bằng <code>--cpus</code> hay cpuset là dạng mềm hơn, nhưng các container dùng chung <em>một</em> nhân, nên chúng không phải thiết kế này.</p>
<p class="meo">🧠 Mỗi CPU một HĐH = <strong>không chia sẻ, không rắc rối, cũng không có lợi ích của chia sẻ</strong>.</p>
<p class="pitfall">⚠️ Kiểu FE: "mỗi CPU có HĐH riêng" là thiết kế có <em>buffer cache không nhất quán</em> và <em>không chia sẻ tiến trình</em>. Đừng lẫn với SMP (slide 12), nơi chỉ có MỘT bản HĐH.</p>`],
      [11, 'Master-Slave Multiprocessors',
        `<p class="y-chinh">🎯 Figure 8-8 — <strong>master–slave</strong>: one CPU (the master) runs the OS; the other CPUs (slaves) run only user processes. All system calls are redirected to the master. One copy of the OS data structures sits in memory, so processes <em>can</em> be balanced and pages shared.</p>
<p>Repair the weaknesses of slide 10 by having a <em>single</em> OS on a single CPU. Now there is one set of tables, one ready queue: the master hands a ready process to whichever slave is idle, so there is perfect load balancing; pages can be shared; and the buffer cache is single. Data structures need no locks, because only the master touches them.</p>
<p>The weakness appears as the number of CPUs grows: <strong>the master is a bottleneck</strong>. A slave that makes a system call must send it to the master and wait. In a workload where user processes make few system calls (number-crunching) that is fine; with 20 CPUs and a program that does I/O constantly, the master saturates and the other 19 sit idle waiting. By Amdahl's law (slide 2) the master <em>is</em> the serial fraction.</p>
<p>When is it still sensible? When the machine is small and the work is computation-heavy. Historical examples are early two-CPU systems; a modern echo is the <em>main thread / worker threads</em> pattern inside an application — Node.js's single event loop with a pool of workers (libuv's thread pool) is a master–slave design: the event loop is the master that all callbacks pass through, the pool does the heavy blocking calls.</p>
<div class="callout">🧭 On a real server: if you start four Node.js processes on a 4-core machine, nothing in the OS is master–slave — the kernel is SMP (next slide) and treats all four processes as equals. The master–slave pattern lives <em>inside</em> your application: one thread accepting connections (master), many handling them (slaves) — and, exactly as the book predicts, the accepting thread is the first thing to saturate.</div>
<p class="meo">🧠 Master–slave: <strong>balanced and consistent, but the master is a bottleneck</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình 8-8 — <strong>chủ–thợ (master–slave)</strong>: một CPU (master) chạy HĐH; các CPU khác (slave) chỉ chạy tiến trình người dùng. Mọi lời gọi hệ thống được chuyển cho master. Chỉ có một bản cấu trúc dữ liệu của HĐH trong bộ nhớ, nên tiến trình <em>có thể</em> được cân bằng và trang được chia sẻ.</p>
<p>Chữa các điểm yếu của slide 10 bằng cách chỉ có <em>một</em> HĐH trên một CPU. Giờ có một bộ bảng, một hàng đợi sẵn sàng: master giao tiến trình sẵn sàng cho slave nào đang rảnh nên cân bằng tải hoàn hảo; trang chia sẻ được; và buffer cache chỉ có một. Cấu trúc dữ liệu không cần khoá, vì chỉ master đụng vào chúng.</p>
<p>Điểm yếu lộ ra khi số CPU tăng: <strong>master là nút cổ chai</strong>. Một slave gọi hệ thống phải gửi nó cho master và chờ. Với khối lượng việc mà tiến trình người dùng ít gọi hệ thống (tính toán thuần) thì ổn; với 20 CPU và một chương trình I/O liên tục, master bão hoà và 19 CPU kia ngồi chờ. Theo định luật Amdahl (slide 2), master <em>chính là</em> phần tuần tự.</p>
<p>Khi nào vẫn hợp lý? Khi máy nhỏ và việc nặng về tính toán. Ví dụ lịch sử là các hệ hai CPU đầu tiên; tiếng vang hiện đại là mẫu <em>luồng chính / luồng thợ</em> bên trong một ứng dụng — vòng lặp sự kiện đơn của Node.js cùng một pool thợ (thread pool của libuv) là thiết kế chủ–thợ: vòng lặp sự kiện là master mà mọi callback đi qua, pool làm các lời gọi chặn nặng.</p>
<div class="callout">🧭 Trên server thật: nếu bạn khởi động bốn tiến trình Node.js trên máy 4 nhân thì không có gì trong HĐH là chủ–thợ — nhân là SMP (slide kế) và coi cả bốn tiến trình ngang hàng. Mẫu chủ–thợ sống <em>bên trong</em> ứng dụng của bạn: một luồng nhận kết nối (master), nhiều luồng xử lý (slave) — và đúng như sách dự đoán, luồng nhận kết nối là thứ bão hoà đầu tiên.</div>
<p class="meo">🧠 Chủ–thợ: <strong>cân bằng và nhất quán, nhưng master là nút cổ chai</strong>.</p>`],
      [12, 'Symmetric Multiprocessors',
        `<p class="y-chinh">🎯 Figure 8-9 — <strong>SMP (Symmetric MultiProcessor)</strong>: ONE copy of the OS in memory, and <strong>any CPU can run it</strong>. When a CPU makes a system call it runs the kernel code itself. Because several CPUs may be inside the kernel at once, the kernel's tables are protected by <strong>locks</strong>.</p>
<p>SMP removes the master bottleneck but creates a harder problem: two CPUs may execute kernel code at the same instant and touch the same table — for example both want to remove a process from the ready queue. The book's answer: protect the tables with <strong>mutexes</strong>. The first approach is <em>one big lock</em> for the whole kernel ("big kernel lock", BKL); it is simple but turns SMP into master–slave in disguise: only one CPU is in the kernel at a time. The better approach splits the kernel into <strong>independent critical regions</strong>, each with its own lock — the process table, the ready queue, the buffer cache — so CPUs that need different tables do not wait for each other. The new danger is <strong>deadlock</strong>: CPU 1 holds table A and wants table B while CPU 2 holds B and wants A. The book's cure is the one of Chapter 6: give every lock a number and always acquire in increasing order.</p>
<p>History proves the point. Linux 2.0 (1996) first supported SMP with exactly one big kernel lock; the lock was shrunk over fifteen years and finally <strong>removed in Linux 2.6.39 (May 2011)</strong> (LWN, <em>lwn.net/Articles/443506</em>). Today the Linux scheduler keeps a <strong>run queue per CPU</strong> with its own lock, so that CPUs do not contend for one global queue, and a periodic load balancer moves threads between queues. Windows NT has been SMP from the start.</p>
<p>All three designs are visible in a simple experiment: which CPU is each thread of one program running on right now? In SMP the kernel's answer is "any of them":</p>
<div class="out"># Space sharing in miniature: taskset decides WHICH CPUs a program may use (its affinity mask)<br>
$ gcc -O0 -pthread _ghim-cpu.c -o ghim-cpu<br>
$ echo "--- free (no restriction)"; ./ghim-cpu<br>
--- free (no restriction)<br>
threads per CPU: cpu1=2 cpu2=1 cpu3=1 cpu4=1 cpu6=1 cpu7=1 cpu8=1<br>
distinct CPUs used: 7<br>
$ echo "--- pinned to CPU 3 (1):"; taskset -c 3 ./ghim-cpu<br>
--- pinned to CPU 3 (1):<br>
threads per CPU: cpu3=8<br>
distinct CPUs used: 1<br>
$ echo "--- pinned to CPUs 0-1 (2):"; taskset -c 0-1 ./ghim-cpu<br>
--- pinned to CPUs 0-1 (2):<br>
threads per CPU: cpu0=3 cpu1=5<br>
distinct CPUs used: 2<br>
# The mask is a property of the process, visible in /proc<br>
$ taskset -c 2,4 bash -c 'grep Cpus_allowed_list /proc/self/status'<br>
Cpus_allowed_list:	2,4</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The first run (no restriction) spreads 8 busy threads over many CPUs: the one kernel schedules them anywhere. The other runs use <code>taskset</code>, which sets the <em>affinity mask</em> — we will use this in slide 16.</p>
<div class="callout">🧭 On a real server: <code>top</code> and <code>htop</code> press <code>1</code> to show every CPU; <code>mpstat -P ALL 1</code> (package sysstat) prints per-CPU utilisation. If one CPU is at 100% while others sleep, you have a <em>single-threaded bottleneck</em> (a Node.js process, or one PostgreSQL backend running a heavy query) — a symptom of Amdahl's serial part, not of a weak server.</div>
<p class="pitfall">⚠️ FE7#5 / FE11#4 / FE16#6: the OS "that runs on systems with any CPU (multi-processor, multi-core, multi-chip)" is the <strong>Multiprocessor OS</strong> (Chapter 1 classification). FE8#4 / FE13#4 / FE14#6: the main <em>advantage</em> of a multiprocessor system is <strong>increased throughput</strong> (more work per unit time) — not lower latency of a single job, which Amdahl limits.</p>`,
        `<p class="y-chinh">🎯 Hình 8-9 — <strong>SMP (Symmetric MultiProcessor — đa xử lý đối xứng)</strong>: MỘT bản HĐH trong bộ nhớ, và <strong>CPU nào cũng chạy được nó</strong>. Khi một CPU gọi hệ thống, nó tự chạy mã nhân. Vì nhiều CPU có thể cùng ở trong nhân, các bảng của nhân được bảo vệ bằng <strong>khoá</strong>.</p>
<p>SMP bỏ nút cổ chai master nhưng sinh ra bài toán khó hơn: hai CPU có thể chạy mã nhân cùng một khoảnh khắc và đụng vào cùng một bảng — ví dụ cả hai cùng muốn lấy một tiến trình ra khỏi hàng đợi sẵn sàng. Câu trả lời của sách: bảo vệ các bảng bằng <strong>mutex</strong>. Cách đầu là <em>một khoá lớn</em> cho cả nhân ("big kernel lock", BKL); đơn giản nhưng biến SMP thành chủ–thợ trá hình: mỗi lúc chỉ một CPU ở trong nhân. Cách tốt hơn là chia nhân thành các <strong>vùng găng độc lập</strong>, mỗi vùng một khoá riêng — bảng tiến trình, hàng đợi sẵn sàng, buffer cache — để CPU cần bảng khác nhau không chờ nhau. Mối nguy mới là <strong>bế tắc</strong>: CPU 1 giữ bảng A và muốn bảng B trong khi CPU 2 giữ B và muốn A. Thuốc chữa của sách là thuốc ở Chương 6: đánh số mọi khoá và luôn lấy theo thứ tự tăng dần.</p>
<p>Lịch sử chứng minh điều này. Linux 2.0 (1996) hỗ trợ SMP lần đầu chỉ bằng đúng một khoá nhân lớn; khoá được thu nhỏ dần suốt mười lăm năm và cuối cùng <strong>bị gỡ ở Linux 2.6.39 (tháng 5/2011)</strong> (LWN, <em>lwn.net/Articles/443506</em>). Ngày nay bộ lập lịch Linux giữ một <strong>hàng đợi chạy (run queue) cho mỗi CPU</strong> với khoá riêng, để các CPU không tranh một hàng đợi toàn cục, và một bộ cân bằng tải định kỳ chuyển luồng giữa các hàng đợi. Windows NT là SMP ngay từ đầu.</p>
<p>Cả ba thiết kế hiện ra trong một thí nghiệm đơn giản: mỗi luồng của một chương trình đang chạy trên CPU nào? Ở SMP câu trả lời của nhân là "bất kỳ CPU nào":</p>
<div class="out"># Chia không gian thu nhỏ: taskset quyết định chương trình được dùng CPU NÀO (mặt nạ affinity)<br>
$ gcc -O0 -pthread _ghim-cpu.c -o ghim-cpu<br>
$ echo "--- free (no restriction)"; ./ghim-cpu<br>
--- free (no restriction)<br>
threads per CPU: cpu1=2 cpu2=1 cpu3=1 cpu4=1 cpu6=1 cpu7=1 cpu8=1<br>
distinct CPUs used: 7<br>
$ echo "--- pinned to CPU 3 (1):"; taskset -c 3 ./ghim-cpu<br>
--- pinned to CPU 3 (1):<br>
threads per CPU: cpu3=8<br>
distinct CPUs used: 1<br>
$ echo "--- pinned to CPUs 0-1 (2):"; taskset -c 0-1 ./ghim-cpu<br>
--- pinned to CPUs 0-1 (2):<br>
threads per CPU: cpu0=3 cpu1=5<br>
distinct CPUs used: 2<br>
# Mặt nạ là thuộc tính của tiến trình, xem được trong /proc<br>
$ taskset -c 2,4 bash -c 'grep Cpus_allowed_list /proc/self/status'<br>
Cpus_allowed_list:	2,4</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Lượt chạy đầu (không giới hạn) rải 8 luồng bận ra nhiều CPU: một nhân duy nhất xếp chúng ở bất cứ đâu. Các lượt còn lại dùng <code>taskset</code>, lệnh đặt <em>mặt nạ affinity</em> — ta sẽ dùng ở slide 16.</p>
<div class="callout">🧭 Trên server thật: <code>top</code> và <code>htop</code> bấm <code>1</code> để xem từng CPU; <code>mpstat -P ALL 1</code> (gói sysstat) in mức dùng theo từng CPU. Nếu một CPU 100% trong khi các CPU khác ngủ, bạn có một <em>nút cổ chai đơn luồng</em> (một tiến trình Node.js, hay một backend PostgreSQL đang chạy truy vấn nặng) — triệu chứng của phần tuần tự trong Amdahl, không phải server yếu.</div>
<p class="pitfall">⚠️ FE7#5 / FE11#4 / FE16#6: HĐH "chạy trên hệ thống có CPU bất kỳ (đa bộ xử lý, đa nhân, đa chip)" là <strong>Multiprocessor OS</strong> (phân loại ở Chương 1). FE8#4 / FE13#4 / FE14#6: <em>ưu điểm</em> chính của hệ đa xử lý là <strong>tăng thông lượng (throughput)</strong> (nhiều việc hơn mỗi đơn vị thời gian) — không phải giảm độ trễ của một việc đơn lẻ, thứ Amdahl giới hạn.</p>`],
      [13, 'Multiprocessor Synchronization (1)',
        `<p class="y-chinh">🎯 Figure 8-10 — on a multiprocessor, disabling interrupts no longer gives mutual exclusion (it stops only <em>this</em> CPU), and <strong>TSL</strong> (Test and Set Lock) works <strong>only if the instruction locks the memory bus</strong> for both its read and its write. If the bus is not locked, two CPUs can both read 0 and both write 1 — and both think they own the lock.</p>
<p>Chapter 2 solved mutual exclusion on one CPU by disabling interrupts or by TSL. On several CPUs the first trick fails: disabling interrupts on CPU 1 does nothing to CPU 2. TSL reads a word and writes 1 in one indivisible step — but "indivisible" must hold for <em>every CPU</em>, so the hardware must keep other CPUs off the memory word between the read and the write (the book: by locking the bus, or by having the cache of one CPU own the line exclusively). The four steps of the figure show what happens without that guarantee:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/7c92f94aaea489b6207fb9eba5e0e45433c74c83.svg" alt="Figure 8-10 as a sequence: without a locked bus both CPUs get the lock" loading="lazy" /><p class="chu-thich">🧩 Figure 8-10 as a sequence: without a locked bus both CPUs get the lock</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 8-10: TSL on a multiprocessor — if the bus is NOT locked, two CPUs both "take" the lock
title Figure 8-10 — TSL without locking the memory bus (word 1000 starts at 0)
participant "CPU 1" as C1
participant "Memory bus + word 1000" as M
participant "CPU 2" as C2
C1 -&gt; M : 1. read word 1000 → gets 0
C2 -&gt; M : 2. read word 1000 → gets 0  (the bus was free in between!)
C1 -&gt; M : 3. write 1 to word 1000
C2 -&gt; M : 4. write 1 to word 1000
note over C1, C2 #FEE2E2 : both CPUs read 0, so BOTH believe they own the lock\\n= two threads inside the critical region
== the fix: TSL locks the BUS for both steps (or uses an atomic cache-line operation) ==
C1 -&gt; M : 1. LOCK bus: read 1000 (0) + write 1 — indivisible
C2 -&gt; M : 2. read 1000 → gets 1: the lock is taken, try again
note over C1, C2 #DCFCE7 : on x86: LOCK XCHG / LOCK CMPXCHG;  on ARM64: LDXR/STXR or LSE (SWP, CAS)
@enduml</code></pre></details>
<p>Real instructions: x86 has <code>LOCK XCHG</code> and <code>LOCK CMPXCHG</code>; ARM64 has load-exclusive/store-exclusive pairs (<code>LDXR/STXR</code>) and, since ARMv8.1, single atomic instructions (<code>SWP</code>, <code>CAS</code>, <code>LDADD</code>). C11 wraps them as <code>atomic_exchange</code> and friends; GCC's <code>__atomic_exchange_n</code> is what the course programs use.</p>
<p>The difference between "almost a lock" and a lock is visible on real hardware. Below, a "lock" that first <em>looks</em> at a flag and then <em>sets</em> it (two separate steps — exactly the flaw of Figure 8-10, only in software). Four threads count to 2,000,000 together:</p>
<pre><code class="language-c">// A "lock" that checks and sets in two steps is NOT a lock: on several CPUs two threads walk in together
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

#define THREADS 4
#define LOOPS   500000
volatile int taken = 0;                        // plain flag, no atomic instruction
long counter = 0;
pthread_barrier_t start;

static void *work(void *arg) {
    pthread_barrier_wait(&amp;start);
    for (int i = 0; i &lt; LOOPS; i++) {
        while (taken) ;                        // step 1: look — the lock seems free
        taken = 1;                             // step 2: take it (another CPU may have done step 1 meanwhile!)
        counter++;
        taken = 0;
    }
    return NULL;
}

int main(void) {
    pthread_t t[THREADS];
    pthread_barrier_init(&amp;start, NULL, THREADS);
    for (int i = 0; i &lt; THREADS; i++) pthread_create(&amp;t[i], NULL, work, NULL);
    for (int i = 0; i &lt; THREADS; i++) pthread_join(t[i], NULL);
    printf("expected = %d\\n", THREADS * LOOPS);
    printf("total    = %ld\\n", counter);
    printf("lost     = %ld updates\\n", (long)THREADS * LOOPS - counter);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread khoa-hong.c -o khoa-hong &amp;&amp; ./khoa-hong<br>
expected = 2000000<br>
total &nbsp;&nbsp;&nbsp;= 1896090<br>
lost &nbsp;&nbsp;&nbsp;&nbsp;= 103910 updates</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Updates are lost: the counter ends below 2,000,000 because two threads walked into the "critical region" at the same time (this is a measured run — the exact number changes from run to run, but on several CPUs it is essentially never 2,000,000). Replace the two steps by one atomic exchange and the loss disappears — we run that in the next slide.</p>
<p>➕ A spin lock built from TSL <em>busy-waits</em>: the waiting CPU burns cycles. On a multiprocessor that can be the right choice, because switching to another thread (saving registers, flushing the TLB, polluting the cache) costs time too. The book's rule: <strong>spin if the expected wait is shorter than a context switch; otherwise block</strong>. On a single CPU spinning is pure waste — the lock holder cannot run while you spin (lesson 2.B's program <code>quay-hay-nhuong.c</code> measured exactly that: 647 ms spinning versus 134 ms yielding on one CPU).</p>
<p class="pitfall">⚠️ FE20#50: "a <em>hardware</em> solution to the critical region problem" is <strong>TSL</strong> (semaphore and shared memory are software/abstractions). On a multiprocessor the hardware part includes the bus lock — a point the textbook, not the FE, makes.</p>`,
        `<p class="y-chinh">🎯 Hình 8-10 — trên đa xử lý, tắt ngắt không còn cho loại trừ tương hỗ (nó chỉ dừng <em>CPU này</em>), và <strong>TSL</strong> (Test and Set Lock) chỉ chạy đúng <strong>nếu lệnh khoá bus bộ nhớ</strong> cho cả lần đọc và lần ghi. Nếu bus không bị khoá, hai CPU có thể cùng đọc 0 và cùng ghi 1 — và cả hai tưởng mình đang giữ khoá.</p>
<p>Chương 2 giải loại trừ tương hỗ trên một CPU bằng tắt ngắt hoặc TSL. Trên nhiều CPU mẹo thứ nhất hỏng: tắt ngắt ở CPU 1 chẳng ảnh hưởng gì tới CPU 2. TSL đọc một từ và ghi 1 trong một bước không chia cắt được — nhưng "không chia cắt được" phải đúng với <em>mọi CPU</em>, nên phần cứng phải giữ các CPU khác khỏi ô nhớ đó giữa lần đọc và lần ghi (sách: bằng cách khoá bus, hoặc để cache của một CPU độc chiếm dòng). Bốn bước của hình cho thấy chuyện gì xảy ra khi thiếu bảo đảm đó:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/7c92f94aaea489b6207fb9eba5e0e45433c74c83.svg" alt="Hình 8-10 dạng tuần tự: bus không khoá thì cả hai CPU đều lấy được khoá" loading="lazy" /><p class="chu-thich">🧩 Hình 8-10 dạng tuần tự: bus không khoá thì cả hai CPU đều lấy được khoá</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 8-10: TSL trên máy nhiều CPU — nếu bus KHÔNG bị khoá, hai CPU đều "lấy được" khoá
title Figure 8-10 — TSL without locking the memory bus (word 1000 starts at 0)
participant "CPU 1" as C1
participant "Memory bus + word 1000" as M
participant "CPU 2" as C2
C1 -&gt; M : 1. read word 1000 → gets 0
C2 -&gt; M : 2. read word 1000 → gets 0  (the bus was free in between!)
C1 -&gt; M : 3. write 1 to word 1000
C2 -&gt; M : 4. write 1 to word 1000
note over C1, C2 #FEE2E2 : both CPUs read 0, so BOTH believe they own the lock\\n= two threads inside the critical region
== the fix: TSL locks the BUS for both steps (or uses an atomic cache-line operation) ==
C1 -&gt; M : 1. LOCK bus: read 1000 (0) + write 1 — indivisible
C2 -&gt; M : 2. read 1000 → gets 1: the lock is taken, try again
note over C1, C2 #DCFCE7 : on x86: LOCK XCHG / LOCK CMPXCHG;  on ARM64: LDXR/STXR or LSE (SWP, CAS)
@enduml</code></pre></details>
<p>Lệnh thật: x86 có <code>LOCK XCHG</code> và <code>LOCK CMPXCHG</code>; ARM64 có cặp load-exclusive/store-exclusive (<code>LDXR/STXR</code>) và, từ ARMv8.1, các lệnh nguyên tử đơn (<code>SWP</code>, <code>CAS</code>, <code>LDADD</code>). C11 bọc chúng thành <code>atomic_exchange</code> và họ hàng; <code>__atomic_exchange_n</code> của GCC là thứ các chương trình trong môn dùng.</p>
<p>Khác biệt giữa "gần như là khoá" và khoá hiện ra trên phần cứng thật. Dưới đây là một "khoá" trước hết <em>nhìn</em> cờ rồi mới <em>đặt</em> cờ (hai bước riêng — đúng lỗi của Hình 8-10, chỉ khác là ở phần mềm). Bốn luồng cùng đếm tới 2.000.000:</p>
<pre><code class="language-c">// "Khoá" kiểm tra rồi mới đặt (hai bước) KHÔNG phải khoá: trên nhiều CPU hai luồng cùng bước vào
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

#define THREADS 4
#define LOOPS   500000
volatile int taken = 0;                        // cờ thường, không có lệnh nguyên tử
long counter = 0;
pthread_barrier_t start;

static void *work(void *arg) {
    pthread_barrier_wait(&amp;start);
    for (int i = 0; i &lt; LOOPS; i++) {
        while (taken) ;                        // bước 1: nhìn — khoá có vẻ rảnh
        taken = 1;                             // bước 2: lấy (CPU khác có thể đã xong bước 1 trong lúc này!)
        counter++;
        taken = 0;
    }
    return NULL;
}

int main(void) {
    pthread_t t[THREADS];
    pthread_barrier_init(&amp;start, NULL, THREADS);
    for (int i = 0; i &lt; THREADS; i++) pthread_create(&amp;t[i], NULL, work, NULL);
    for (int i = 0; i &lt; THREADS; i++) pthread_join(t[i], NULL);
    printf("expected = %d\\n", THREADS * LOOPS);
    printf("total    = %ld\\n", counter);
    printf("lost     = %ld updates\\n", (long)THREADS * LOOPS - counter);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread khoa-hong.c -o khoa-hong &amp;&amp; ./khoa-hong<br>
expected = 2000000<br>
total &nbsp;&nbsp;&nbsp;= 1896090<br>
lost &nbsp;&nbsp;&nbsp;&nbsp;= 103910 updates</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Cập nhật bị mất: biến đếm kết thúc dưới 2.000.000 vì hai luồng cùng bước vào "vùng găng" một lúc (đây là một lần chạy đo thật — con số chính xác đổi theo từng lần chạy, nhưng trên nhiều CPU gần như không bao giờ đạt 2.000.000). Thay hai bước bằng một lệnh đổi chỗ nguyên tử là hết mất mát — ta chạy ở slide kế.</p>
<p>➕ Khoá quay xây từ TSL <em>chờ bận</em>: CPU đang chờ đốt chu kỳ. Trên đa xử lý đó có thể là lựa chọn đúng, vì chuyển sang luồng khác (lưu thanh ghi, xả TLB, làm bẩn cache) cũng tốn thời gian. Luật của sách: <strong>quay nếu thời gian chờ dự kiến ngắn hơn một lần chuyển ngữ cảnh; ngược lại thì chặn (block)</strong>. Trên một CPU thì quay là lãng phí thuần tuý — kẻ giữ khoá không chạy được trong lúc bạn quay (chương trình <code>quay-hay-nhuong.c</code> của bài 2.B đã đo đúng điều đó: 647 ms khi quay so với 134 ms khi nhường trên một CPU).</p>
<p class="pitfall">⚠️ FE20#50: "giải pháp <em>phần cứng</em> cho bài toán vùng găng" là <strong>TSL</strong> (semaphore và bộ nhớ chung là phần mềm/trừu tượng). Trên đa xử lý, phần cứng còn gồm cả khoá bus — điểm mà sách giáo khoa chứ không phải FE nêu ra.</p>`],
      [14, 'Multiprocessor Synchronization (2)',
        `<p class="y-chinh">🎯 Figure 8-11 — a spin lock that every CPU hammers with TSL makes the cache line of the lock <strong>bounce between caches</strong> ("cache thrashing"). The cure: spin on a <strong>read</strong> first (it stays in your own cache), or give every waiting CPU its <strong>own private lock</strong> to spin on, so the only traffic is the hand-over.</p>
<p>TSL does a <em>write</em> every time it tries, even when the lock is already taken. Writing a cache line needs <em>exclusive</em> ownership (MESI state M, slide 3), so with four CPUs spinning the single line holding the lock is yanked from cache to cache on every attempt — the bus (or the interconnect) is flooded and even the CPU that holds the lock slows down. Two classic fixes:</p>
<p><strong>(1) Test-and-test-and-set (TTAS):</strong> spin on an ordinary <em>read</em> of the lock word — the line stays in <em>Shared</em> state in every waiter's cache, no bus traffic — and only when the read shows "free" try the TSL. <strong>(2) Private locks (the book's Figure 8-11):</strong> a CPU that wants the lock joins a queue and spins on its <em>own</em> private word in its own cache line; the CPU that releases the lock writes only the next waiter's word. This is the idea of the <em>queue locks</em> (MCS, Mellor-Crummey and Scott, 1991) used in the Linux kernel's <code>qspinlock</code>. The measured experiment below tries three ways to wait for one lock — plain TSL spinning, TTAS spinning, and a blocking <code>pthread_mutex</code>:</p>
<pre><code class="language-c">// Figure 8-10/8-11 on a real multi-core: 4 threads fight for ONE lock, three ways to wait
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;time.h&gt;

#define THREADS 4
#define LOOPS   400000
volatile int lock_word = 0;                    // 0 = free, 1 = taken
pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
pthread_barrier_t start;
long counter = 0;
int kind;                                      // 0 = TAS spin, 1 = TTAS spin, 2 = mutex

static void lock(void) {
    if (kind == 2) { pthread_mutex_lock(&amp;mu); return; }
    for (;;) {
        if (kind == 1)                                    // TTAS: first only READ (the line stays shared in every cache)
            while (lock_word) ;
        if (!__atomic_exchange_n(&amp;lock_word, 1, __ATOMIC_ACQUIRE)) return;   // TSL: one atomic read-modify-write
    }
}
static void unlock(void) {
    if (kind == 2) pthread_mutex_unlock(&amp;mu); else __atomic_store_n(&amp;lock_word, 0, __ATOMIC_RELEASE);
}
static void *work(void *arg) {
    pthread_barrier_wait(&amp;start);
    for (int i = 0; i &lt; LOOPS; i++) { lock(); counter++; unlock(); }
    return NULL;
}
static double ms(struct timespec a, struct timespec b) { return (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6; }

int main(void) {
    const char *name[] = {"tas  ", "ttas ", "mutex"};
    for (kind = 0; kind &lt; 3; kind++) {
        pthread_t t[THREADS]; struct timespec a, b;
        counter = 0;
        pthread_barrier_init(&amp;start, NULL, THREADS + 1);
        for (int i = 0; i &lt; THREADS; i++) pthread_create(&amp;t[i], NULL, work, NULL);
        pthread_barrier_wait(&amp;start);
        clock_gettime(CLOCK_MONOTONIC, &amp;a);
        for (int i = 0; i &lt; THREADS; i++) pthread_join(t[i], NULL);
        clock_gettime(CLOCK_MONOTONIC, &amp;b);
        printf("%s: counter = %ld, time %.0f ms\\n", name[kind], counter, ms(a, b));
        pthread_barrier_destroy(&amp;start);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread khoa-quay.c -o khoa-quay &amp;&amp; ./khoa-quay<br>
tas &nbsp;: counter = 1600000, time 30 ms<br>
ttas : counter = 1600000, time 38 ms<br>
mutex: counter = 1600000, time 51 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>All three give exactly 1,600,000 — they are <em>correct</em>. The times are the lesson, with an honest warning: this cached run was one execution inside a virtual machine whose 10 CPUs are shared with the host, and the order of the three times changes between runs (we saw all three orders). With only 4 threads and a critical section of one increment, the differences are small and noisy; they grow with more CPUs and longer critical sections, which is exactly where the book's two cures matter. <strong>Never decide "spin vs mutex" from one measurement.</strong></p>
<p>The strongest cure is to <strong>not share</strong>. Four threads each add to their own counter in their own cache line and the program adds them up at the end — this is the idea of Figure 8-11 pushed to its limit:</p>
<pre><code class="language-c">// Figure 8-11's idea in two lines: ONE hot lock versus one private counter per thread, added up at the end
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;time.h&gt;

#define THREADS 4
#define LOOPS   5000000
pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
long shared_counter = 0;
struct { long v; char pad[120]; } mine[THREADS];         // private, one cache line each
pthread_barrier_t start;
int per_thread;

static void *work(void *arg) {
    long id = (long)arg;
    pthread_barrier_wait(&amp;start);
    for (int i = 0; i &lt; LOOPS; i++) {
        if (per_thread) mine[id].v++;                    // no lock, no sharing
        else { pthread_mutex_lock(&amp;mu); shared_counter++; pthread_mutex_unlock(&amp;mu); }
    }
    return NULL;
}
int main(void) {
    for (per_thread = 0; per_thread &lt; 2; per_thread++) {
        pthread_t t[THREADS]; struct timespec a, b; long total = 0;
        shared_counter = 0; for (int i = 0; i &lt; THREADS; i++) mine[i].v = 0;
        pthread_barrier_init(&amp;start, NULL, THREADS + 1);
        for (long i = 0; i &lt; THREADS; i++) pthread_create(&amp;t[i], NULL, work, (void *)i);
        pthread_barrier_wait(&amp;start);
        clock_gettime(CLOCK_MONOTONIC, &amp;a);
        for (int i = 0; i &lt; THREADS; i++) pthread_join(t[i], NULL);
        clock_gettime(CLOCK_MONOTONIC, &amp;b);
        if (per_thread) for (int i = 0; i &lt; THREADS; i++) total += mine[i].v; else total = shared_counter;
        printf("%s: counter = %ld, time %.0f ms\\n", per_thread ? "per-thread" : "one lock  ", total,
               (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6);
        pthread_barrier_destroy(&amp;start);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread chia-nho-khoa.c -o chia-nho-khoa &amp;&amp; ./chia-nho-khoa<br>
one lock &nbsp;: counter = 20000000, time 457 ms<br>
per-thread: counter = 20000000, time 41 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Same final count (20,000,000), but the lock-free per-thread version took about a tenth of the time. This is why Java has <code>LongAdder</code> (per-thread cells summed on demand) next to <code>AtomicLong</code>, why Linux has per-CPU counters, and why a metrics library (Prometheus client, Micrometer) keeps per-thread tallies.</p>
<div class="callout">🧭 On a real server: a hot <code>synchronized</code> block, a <code>ConcurrentHashMap</code> segment or a single Redis key updated from 64 threads is exactly this problem. Symptoms: CPU usage climbs but throughput stays flat, <code>perf top</code> shows time in lock/atomic functions. Fixes in order: shorten the critical section, shard the lock (stripes), keep per-thread state and merge later.</div>
<p class="pitfall">⚠️ "Lock-free" is not "wait-free" and does not mean "no cache traffic": an atomic increment of a variable shared by 64 CPUs still bounces its cache line. Sharing, not locking, is the cost.</p>`,
        `<p class="y-chinh">🎯 Hình 8-11 — một khoá quay mà mọi CPU cùng đập TSL làm dòng cache chứa khoá <strong>nảy qua lại giữa các cache</strong> ("cache thrashing"). Thuốc chữa: quay trên một lệnh <strong>đọc</strong> trước (nó nằm trong cache của chính bạn), hoặc cho mỗi CPU đang chờ <strong>một khoá riêng</strong> để quay, để lưu lượng duy nhất là lúc bàn giao.</p>
<p>TSL <em>ghi</em> mỗi lần thử, kể cả khi khoá đã có người giữ. Ghi vào một dòng cache cần quyền sở hữu <em>độc quyền</em> (trạng thái M của MESI, slide 3), nên với bốn CPU đang quay, dòng duy nhất chứa khoá bị giật từ cache này sang cache khác ở mỗi lần thử — bus (hay mạng liên kết) bị ngập và ngay cả CPU đang giữ khoá cũng chậm đi. Hai cách chữa kinh điển:</p>
<p><strong>(1) Test-and-test-and-set (TTAS):</strong> quay trên lệnh <em>đọc</em> thường của từ khoá — dòng nằm ở trạng thái <em>Shared</em> trong cache của mọi bên chờ, không có lưu lượng bus — và chỉ khi lần đọc thấy "rảnh" mới thử TSL. <strong>(2) Khoá riêng (Hình 8-11 của sách):</strong> CPU muốn khoá xếp vào một hàng và quay trên từ riêng của <em>chính nó</em> trong dòng cache riêng; CPU nhả khoá chỉ ghi vào từ của bên chờ kế tiếp. Đây là ý tưởng của các <em>khoá hàng đợi</em> (MCS, Mellor-Crummey và Scott, 1991) dùng trong <code>qspinlock</code> của nhân Linux. Thí nghiệm đo thật dưới đây thử ba cách chờ một khoá — quay TSL thuần, quay TTAS, và <code>pthread_mutex</code> chặn:</p>
<pre><code class="language-c">// Hình 8-10/8-11 trên máy nhiều nhân thật: 4 luồng tranh MỘT khoá, ba cách chờ
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;time.h&gt;

#define THREADS 4
#define LOOPS   400000
volatile int lock_word = 0;                    // 0 = rảnh, 1 = đang giữ
pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
pthread_barrier_t start;
long counter = 0;
int kind;                                      // 0 = quay TAS, 1 = quay TTAS, 2 = mutex

static void lock(void) {
    if (kind == 2) { pthread_mutex_lock(&amp;mu); return; }
    for (;;) {
        if (kind == 1)                                    // TTAS: trước hết chỉ ĐỌC (dòng cache được chia sẻ ở mọi cache)
            while (lock_word) ;
        if (!__atomic_exchange_n(&amp;lock_word, 1, __ATOMIC_ACQUIRE)) return;   // TSL: một lệnh đọc-sửa-ghi nguyên tử
    }
}
static void unlock(void) {
    if (kind == 2) pthread_mutex_unlock(&amp;mu); else __atomic_store_n(&amp;lock_word, 0, __ATOMIC_RELEASE);
}
static void *work(void *arg) {
    pthread_barrier_wait(&amp;start);
    for (int i = 0; i &lt; LOOPS; i++) { lock(); counter++; unlock(); }
    return NULL;
}
static double ms(struct timespec a, struct timespec b) { return (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6; }

int main(void) {
    const char *name[] = {"tas  ", "ttas ", "mutex"};
    for (kind = 0; kind &lt; 3; kind++) {
        pthread_t t[THREADS]; struct timespec a, b;
        counter = 0;
        pthread_barrier_init(&amp;start, NULL, THREADS + 1);
        for (int i = 0; i &lt; THREADS; i++) pthread_create(&amp;t[i], NULL, work, NULL);
        pthread_barrier_wait(&amp;start);
        clock_gettime(CLOCK_MONOTONIC, &amp;a);
        for (int i = 0; i &lt; THREADS; i++) pthread_join(t[i], NULL);
        clock_gettime(CLOCK_MONOTONIC, &amp;b);
        printf("%s: counter = %ld, time %.0f ms\\n", name[kind], counter, ms(a, b));
        pthread_barrier_destroy(&amp;start);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread khoa-quay.c -o khoa-quay &amp;&amp; ./khoa-quay<br>
tas &nbsp;: counter = 1600000, time 30 ms<br>
ttas : counter = 1600000, time 38 ms<br>
mutex: counter = 1600000, time 51 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Cả ba đều ra đúng 1.600.000 — chúng <em>đúng</em>. Thời gian mới là bài học, kèm một cảnh báo trung thực: lần chạy được lưu này là một lần thực thi trong máy ảo có 10 CPU dùng chung với máy chủ, và thứ tự ba thời gian đổi giữa các lần chạy (ta đã thấy cả ba thứ tự). Với chỉ 4 luồng và vùng găng chỉ một phép tăng, khác biệt nhỏ và nhiễu; chúng lớn lên khi có nhiều CPU hơn và vùng găng dài hơn, đúng chỗ hai thuốc chữa của sách có ý nghĩa. <strong>Đừng bao giờ quyết "quay hay mutex" từ một lần đo.</strong></p>
<p>Thuốc mạnh nhất là <strong>đừng chia sẻ</strong>. Bốn luồng mỗi luồng cộng vào biến đếm riêng của mình trong dòng cache riêng và chương trình cộng chúng lại ở cuối — đây là ý tưởng của Hình 8-11 đẩy tới cực hạn:</p>
<pre><code class="language-c">// Ý của Hình 8-11 trong hai dòng: MỘT khoá nóng so với mỗi luồng một biến đếm riêng, cộng lại ở cuối
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;time.h&gt;

#define THREADS 4
#define LOOPS   5000000
pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
long shared_counter = 0;
struct { long v; char pad[120]; } mine[THREADS];         // riêng, mỗi biến một dòng cache
pthread_barrier_t start;
int per_thread;

static void *work(void *arg) {
    long id = (long)arg;
    pthread_barrier_wait(&amp;start);
    for (int i = 0; i &lt; LOOPS; i++) {
        if (per_thread) mine[id].v++;                    // không khoá, không chia sẻ
        else { pthread_mutex_lock(&amp;mu); shared_counter++; pthread_mutex_unlock(&amp;mu); }
    }
    return NULL;
}
int main(void) {
    for (per_thread = 0; per_thread &lt; 2; per_thread++) {
        pthread_t t[THREADS]; struct timespec a, b; long total = 0;
        shared_counter = 0; for (int i = 0; i &lt; THREADS; i++) mine[i].v = 0;
        pthread_barrier_init(&amp;start, NULL, THREADS + 1);
        for (long i = 0; i &lt; THREADS; i++) pthread_create(&amp;t[i], NULL, work, (void *)i);
        pthread_barrier_wait(&amp;start);
        clock_gettime(CLOCK_MONOTONIC, &amp;a);
        for (int i = 0; i &lt; THREADS; i++) pthread_join(t[i], NULL);
        clock_gettime(CLOCK_MONOTONIC, &amp;b);
        if (per_thread) for (int i = 0; i &lt; THREADS; i++) total += mine[i].v; else total = shared_counter;
        printf("%s: counter = %ld, time %.0f ms\\n", per_thread ? "per-thread" : "one lock  ", total,
               (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6);
        pthread_barrier_destroy(&amp;start);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread chia-nho-khoa.c -o chia-nho-khoa &amp;&amp; ./chia-nho-khoa<br>
one lock &nbsp;: counter = 20000000, time 457 ms<br>
per-thread: counter = 20000000, time 41 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Cùng kết quả cuối (20.000.000), nhưng bản mỗi luồng một biến, không khoá, chạy mất khoảng một phần mười thời gian. Vì thế Java có <code>LongAdder</code> (các ô theo luồng, cộng khi cần) bên cạnh <code>AtomicLong</code>, Linux có biến đếm theo từng CPU, và thư viện metrics (Prometheus client, Micrometer) giữ số đếm theo từng luồng.</p>
<div class="callout">🧭 Trên server thật: một khối <code>synchronized</code> nóng, một segment của <code>ConcurrentHashMap</code> hay một khoá Redis cập nhật từ 64 luồng chính là bài toán này. Triệu chứng: mức dùng CPU tăng nhưng thông lượng đứng yên, <code>perf top</code> cho thấy thời gian ở các hàm khoá/nguyên tử. Cách chữa theo thứ tự: rút ngắn vùng găng, chẻ khoá (stripes), giữ trạng thái theo luồng rồi gộp sau.</div>
<p class="pitfall">⚠️ "Lock-free" không phải "wait-free" và không có nghĩa "không có lưu lượng cache": một phép tăng nguyên tử trên biến mà 64 CPU dùng chung vẫn làm dòng cache của nó nảy qua lại. Cái đắt là việc chia sẻ, không phải việc khoá.</p>`],
      [15, 'Time Sharing',
        `<p class="y-chinh">🎯 Figure 8-12 — the simplest multiprocessor scheduler: <strong>time sharing</strong> with a <strong>single data structure</strong> (priority lists of ready threads) shared by all CPUs. Any idle CPU takes the first thread of the highest-priority non-empty list; when a quantum ends or a thread blocks, it goes back. Threads of one process are scattered with no relation to each other.</p>
<p>Scheduling on one CPU answers "<em>which</em> thread runs next?" On several CPUs it also answers "<em>on which CPU?</em>" — a new dimension, and the book walks through three answers. The first is the obvious one: keep <em>one</em> ready queue (or priority array) for the whole machine and let every CPU pull from it. It balances load automatically — a CPU never idles while a thread waits — and needs no new idea. Its costs: (1) the queue is shared, so access needs a <strong>lock</strong>, and with many CPUs that lock becomes a hot spot (slides 13–14); (2) a thread that blocks for I/O and returns later may be given a <em>different</em> CPU than before — its working set in the old CPU's cache is lost. A cheap refinement is <strong>affinity scheduling</strong>: try to run a thread on the CPU it used last (its cache may still be warm); the book also describes <strong>two-level</strong> scheduling, where a thread is first assigned to a CPU and each CPU then schedules its own threads.</p>
<p>Run the single-queue algorithm: 4 CPUs, 7 threads from three jobs (A has 3 threads, B 2, C 2; each thread needs 6 ticks), quantum 2, one global FIFO queue:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/489d58796ca3be7b55cc09f36748a438ecfa9879.svg" alt="Time sharing on 4 CPUs with ONE ready queue" loading="lazy" /><p class="chu-thich">🧮 Time sharing on 4 CPUs with ONE ready queue</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const A = (v, k, c) =&gt; Array.from({ length: k }, (_, i) =&gt; ({ ten: &#96;&#36;{v}&#36;{i}&#96;, viec: v, chay: c }));
const LUONG = [...A('A', 3, 6), ...A('B', 2, 6), ...A('C', 2, 6)];
const VIEC = [{ ten: 'A', luong: 4, chay: 6 }, { ten: 'B', luong: 3, chay: 4 }, { ten: 'C', luong: 4, chay: 5 }, { ten: 'D', luong: 2, chay: 3 }, { ten: 'E', luong: 3, chay: 2 }];
const BANG = [{ ten: 'A', n: 6 }, { ten: 'B', n: 3 }, { ten: 'C', n: 3 }, { ten: 'D', n: 5 }, { ten: 'E', n: 7 }];</code></pre></details>
<p>No CPU is ever left idle while work waits (good!), but look at job A: its three threads ran at the same instant only during the very first quantum (the program counts it: 2 of 13 ticks). If A's threads need to talk to each other, they mostly run <em>apart</em> — slide 17 shows the damage.</p>
<p>➕ Linux today keeps a <strong>run queue per CPU</strong> instead of one global queue (the global lock was the problem), and a <em>load balancer</em> periodically pulls threads from busy CPUs to idle ones, preferring to migrate within the same cache or NUMA domain first (kernel docs: <code>docs.kernel.org/scheduler/sched-domains.html</code>). The per-thread decision "who runs next on this CPU" was the CFS algorithm from Linux 2.6.23 (2007), replaced by <strong>EEVDF</strong> in Linux 6.6 (merged 2023). Idle CPUs <em>steal</em> work — receiver-initiated load balancing (slide 32). The same work-stealing idea is inside Java's Fork/Join pool; here it is on a real 10-CPU machine, summing a function over a billion numbers (one thread versus a pool sized to the CPUs):</p>
<pre><code class="language-java">// Fork/Join: the JVM's own "scheduler for many cores" — split a big job, run the halves on a pool sized to the cores
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

public class ChiaDeTri {
    static class SumTask extends RecursiveTask&lt;Long&gt; {
        final long lo, hi;
        SumTask(long lo, long hi) { this.lo = lo; this.hi = hi; }
        @Override protected Long compute() {
            if (hi - lo &lt;= 1_000_000) {                         // small enough: do it here
                long s = 0; for (long i = lo; i &lt; hi; i++) s += mix(i); return s;
            }
            long mid = (lo + hi) &gt;&gt;&gt; 1;
            SumTask left = new SumTask(lo, mid), right = new SumTask(mid, hi);
            left.fork();                                        // hand the left half to the pool (another core may steal it)
            return right.compute() + left.join();               // do the right half myself, then wait for the left
        }
    }
    static long mix(long x) {                               // a CPU-bound function: no memory traffic at all
        x ^= x &gt;&gt;&gt; 33; x *= 0xff51afd7ed558ccdL; x ^= x &gt;&gt;&gt; 33; x *= 0xc4ceb9fe1a85ec53L; x ^= x &gt;&gt;&gt; 33;
        return x &amp; 7;
    }
    public static void main(String[] args) {
        int cores = Runtime.getRuntime().availableProcessors();
        System.out.println("cores: " + cores + ", common pool parallelism: " + ForkJoinPool.commonPool().getParallelism());
        final long N = 1_000_000_000L;
        long t0 = System.nanoTime(); long seq = 0;
        for (long i = 0; i &lt; N; i++) seq += mix(i);
        long t1 = System.nanoTime();
        long par = new ForkJoinPool(cores).invoke(new SumTask(0, N));
        long t2 = System.nanoTime();
        System.out.println("sums equal: " + (seq == par) + " (" + par + ")");
        System.out.printf("one thread: %d ms, fork/join on %d cores: %d ms%n", (t1 - t0) / 1_000_000, cores, (t2 - t1) / 1_000_000);
    }
}</code></pre>
<div class="out">$ javac ChiaDeTri.java &amp;&amp; java ChiaDeTri<br>
cores: 10, common pool parallelism: 9<br>
sums equal: true (3499927866)<br>
one thread: 1533 ms, fork/join on 10 cores: 353 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The result is correct (the sums are equal) and the pool is clearly faster; it is not 10× faster, because the 10 "CPUs" of a virtual machine share host cores and run at different speeds, and because splitting and joining cost something — Amdahl's law again.</p>
<p class="pitfall">⚠️ Do not read "time sharing" in Figure 8-12 as the Chapter 2 meaning ("give each user a slice of one CPU"). Here it means <em>CPUs are shared among threads over time</em>, with no thought for which threads belong together.</p>`,
        `<p class="y-chinh">🎯 Hình 8-12 — bộ lập lịch đa xử lý đơn giản nhất: <strong>chia giờ (time sharing)</strong> với <strong>một cấu trúc dữ liệu duy nhất</strong> (các danh sách ưu tiên của luồng sẵn sàng) dùng chung cho mọi CPU. CPU rảnh nào cũng lấy luồng đầu danh sách ưu tiên cao nhất không rỗng; hết lượng tử hay luồng bị chặn thì nó quay về. Các luồng của một tiến trình bị rải ra không liên quan gì tới nhau.</p>
<p>Lập lịch trên một CPU trả lời "<em>luồng nào</em> chạy tiếp?" Trên nhiều CPU nó còn trả lời "<em>trên CPU nào?</em>" — một chiều mới, và sách đi qua ba câu trả lời. Câu đầu là câu hiển nhiên: giữ <em>một</em> hàng đợi sẵn sàng (hay mảng ưu tiên) cho cả máy và để mọi CPU lấy từ đó. Nó tự cân bằng tải — CPU không bao giờ rảnh khi có luồng đang chờ — và không cần ý tưởng mới. Cái giá: (1) hàng đợi dùng chung nên truy cập cần <strong>khoá</strong>, và với nhiều CPU khoá đó thành điểm nóng (slide 13–14); (2) luồng bị chặn vì I/O rồi quay lại có thể được cấp CPU <em>khác</em> trước — tập làm việc của nó trong cache CPU cũ mất. Một cải tiến rẻ là <strong>lập lịch theo ái lực (affinity scheduling)</strong>: cố chạy luồng trên CPU nó dùng lần trước (cache có thể còn ấm); sách còn mô tả lập lịch <strong>hai mức</strong>, trong đó luồng được gán cho một CPU trước rồi mỗi CPU tự lập lịch cho các luồng của nó.</p>
<p>Chạy thuật toán một hàng đợi: 4 CPU, 7 luồng của ba việc (A có 3 luồng, B 2, C 2; mỗi luồng cần 6 tick), lượng tử 2, một hàng đợi FIFO toàn cục:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b65c55bb81732d7f5dffd58d6255aaed9aa62737.svg" alt="Chia giờ trên 4 CPU với MỘT hàng đợi sẵn sàng" loading="lazy" /><p class="chu-thich">🧮 Chia giờ trên 4 CPU với MỘT hàng đợi sẵn sàng</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const A = (v, k, c) =&gt; Array.from({ length: k }, (_, i) =&gt; ({ ten: &#96;&#36;{v}&#36;{i}&#96;, viec: v, chay: c }));
const LUONG = [...A('A', 3, 6), ...A('B', 2, 6), ...A('C', 2, 6)];
const VIEC = [{ ten: 'A', luong: 4, chay: 6 }, { ten: 'B', luong: 3, chay: 4 }, { ten: 'C', luong: 4, chay: 5 }, { ten: 'D', luong: 2, chay: 3 }, { ten: 'E', luong: 3, chay: 2 }];
const BANG = [{ ten: 'A', n: 6 }, { ten: 'B', n: 3 }, { ten: 'C', n: 3 }, { ten: 'D', n: 5 }, { ten: 'E', n: 7 }];</code></pre></details>
<p>Không CPU nào bị bỏ rảnh khi còn việc chờ (tốt!), nhưng nhìn việc A: ba luồng của nó chỉ chạy cùng một khoảnh khắc trong lượng tử đầu tiên (chương trình đếm: 2 trên 13 tick). Nếu các luồng của A cần nói chuyện với nhau thì phần lớn thời gian chúng chạy <em>lệch nhau</em> — slide 17 cho thấy tác hại.</p>
<p>➕ Linux ngày nay giữ <strong>một hàng đợi chạy cho mỗi CPU</strong> thay vì một hàng đợi toàn cục (khoá toàn cục chính là vấn đề), và một <em>bộ cân bằng tải</em> định kỳ kéo luồng từ CPU bận sang CPU rảnh, ưu tiên di chuyển trong cùng miền cache hay NUMA trước (tài liệu nhân: <code>docs.kernel.org/scheduler/sched-domains.html</code>). Quyết định "ai chạy tiếp trên CPU này" là thuật toán CFS từ Linux 2.6.23 (2007), được thay bằng <strong>EEVDF</strong> ở Linux 6.6 (hợp nhất năm 2023). CPU rảnh <em>ăn cắp</em> việc — cân bằng tải do bên nhận khởi xướng (slide 32). Chính ý tưởng ăn cắp việc đó nằm trong pool Fork/Join của Java; đây là nó trên một máy 10 CPU thật, cộng một hàm trên một tỉ số (một luồng so với pool cỡ bằng số CPU):</p>
<pre><code class="language-java">// Fork/Join: "bộ lập lịch nhiều nhân" của JVM — chia việc lớn, chạy các nửa trên một pool cỡ bằng số nhân
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

public class ChiaDeTri {
    static class SumTask extends RecursiveTask&lt;Long&gt; {
        final long lo, hi;
        SumTask(long lo, long hi) { this.lo = lo; this.hi = hi; }
        @Override protected Long compute() {
            if (hi - lo &lt;= 1_000_000) {                         // đủ nhỏ: làm ngay tại chỗ
                long s = 0; for (long i = lo; i &lt; hi; i++) s += mix(i); return s;
            }
            long mid = (lo + hi) &gt;&gt;&gt; 1;
            SumTask left = new SumTask(lo, mid), right = new SumTask(mid, hi);
            left.fork();                                        // giao nửa trái cho pool (nhân khác có thể "cướp" nó)
            return right.compute() + left.join();               // tự làm nửa phải, rồi chờ nửa trái
        }
    }
    static long mix(long x) {                               // hàm tốn CPU: không đụng bộ nhớ chút nào
        x ^= x &gt;&gt;&gt; 33; x *= 0xff51afd7ed558ccdL; x ^= x &gt;&gt;&gt; 33; x *= 0xc4ceb9fe1a85ec53L; x ^= x &gt;&gt;&gt; 33;
        return x &amp; 7;
    }
    public static void main(String[] args) {
        int cores = Runtime.getRuntime().availableProcessors();
        System.out.println("cores: " + cores + ", common pool parallelism: " + ForkJoinPool.commonPool().getParallelism());
        final long N = 1_000_000_000L;
        long t0 = System.nanoTime(); long seq = 0;
        for (long i = 0; i &lt; N; i++) seq += mix(i);
        long t1 = System.nanoTime();
        long par = new ForkJoinPool(cores).invoke(new SumTask(0, N));
        long t2 = System.nanoTime();
        System.out.println("sums equal: " + (seq == par) + " (" + par + ")");
        System.out.printf("one thread: %d ms, fork/join on %d cores: %d ms%n", (t1 - t0) / 1_000_000, cores, (t2 - t1) / 1_000_000);
    }
}</code></pre>
<div class="out">$ javac ChiaDeTri.java &amp;&amp; java ChiaDeTri<br>
cores: 10, common pool parallelism: 9<br>
sums equal: true (3499927866)<br>
one thread: 1533 ms, fork/join on 10 cores: 353 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Kết quả đúng (hai tổng bằng nhau) và pool rõ ràng nhanh hơn; không nhanh gấp 10 lần, vì 10 "CPU" của máy ảo dùng chung nhân với máy chủ và chạy với tốc độ khác nhau, và vì chia rồi gộp cũng tốn — lại là định luật Amdahl.</p>
<p class="pitfall">⚠️ Đừng đọc "time sharing" ở Hình 8-12 theo nghĩa Chương 2 ("cho mỗi người dùng một lát của một CPU"). Ở đây nó nghĩa là <em>các CPU được chia cho các luồng theo thời gian</em>, mà không để ý luồng nào thuộc cùng nhóm.</p>`],
      [16, 'Space Sharing',
        `<p class="y-chinh">🎯 Figure 8-13 — <strong>space sharing</strong>: instead of sharing every CPU in time, split the CPUs into <strong>partitions</strong> and give each program (with several threads) a partition of its own, kept until it finishes. The figure shows 32 CPUs in partitions of 8, 6, 4 and 12 CPUs, with two CPUs unassigned.</p>
<p>If the threads of a job need to work together, give them their own CPUs and do not take them away. Within a partition there is no time sharing: one thread per CPU, so there is no context switching at all and no cache pollution from strangers. When a program ends, its CPUs return to the pool; a new program that asks for <em>n</em> CPUs starts when <em>n</em> are free — otherwise it waits. The OS may also let a program <em>grow or shrink</em> its partition, a "dynamic" variant the book mentions.</p>
<p>The weakness: <strong>idle CPUs</strong>. A job that asked for 4 CPUs but is waiting for the disk holds 4 idle CPUs that another job could use; and a big job at the head of the queue blocks smaller ones behind it even though some CPUs are free. Here are eight CPUs and five jobs wanting 4, 3, 4, 2 and 3 CPUs, in strict first-come-first-served order:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1a8d547b29b4429e6d66a46c0841c68695d77c5b.svg" alt="Space sharing on 8 CPUs: partitions and wasted CPU-ticks" loading="lazy" /><p class="chu-thich">🧮 Space sharing on 8 CPUs: partitions and wasted CPU-ticks</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const A = (v, k, c) =&gt; Array.from({ length: k }, (_, i) =&gt; ({ ten: &#96;&#36;{v}&#36;{i}&#96;, viec: v, chay: c }));
const LUONG = [...A('A', 3, 6), ...A('B', 2, 6), ...A('C', 2, 6)];
const VIEC = [{ ten: 'A', luong: 4, chay: 6 }, { ten: 'B', luong: 3, chay: 4 }, { ten: 'C', luong: 4, chay: 5 }, { ten: 'D', luong: 2, chay: 3 }, { ten: 'E', luong: 3, chay: 2 }];
const BANG = [{ ten: 'A', n: 6 }, { ten: 'B', n: 3 }, { ten: 'C', n: 3 }, { ten: 'D', n: 5 }, { ten: 'E', n: 7 }];</code></pre></details>
<p>Job C (4 CPUs) cannot start at tick 0 because only one CPU is free, and strict FIFO forbids letting job D jump ahead; the program counts 10 CPU-ticks wasted while jobs waited. Real batch schedulers fix this with <em>backfilling</em> — let a small later job use the hole if it will not delay the one in front.</p>
<p>➕ You can <em>do</em> space sharing on your own laptop. <code>taskset</code> sets which CPUs a process may use; run the program of slide 12 again and look at lines two and three:</p>
<div class="out"># Space sharing in miniature: taskset decides WHICH CPUs a program may use (its affinity mask)<br>
$ gcc -O0 -pthread _ghim-cpu.c -o ghim-cpu<br>
$ echo "--- free (no restriction)"; ./ghim-cpu<br>
--- free (no restriction)<br>
threads per CPU: cpu1=2 cpu2=1 cpu3=1 cpu4=1 cpu6=1 cpu7=1 cpu8=1<br>
distinct CPUs used: 7<br>
$ echo "--- pinned to CPU 3 (1):"; taskset -c 3 ./ghim-cpu<br>
--- pinned to CPU 3 (1):<br>
threads per CPU: cpu3=8<br>
distinct CPUs used: 1<br>
$ echo "--- pinned to CPUs 0-1 (2):"; taskset -c 0-1 ./ghim-cpu<br>
--- pinned to CPUs 0-1 (2):<br>
threads per CPU: cpu0=3 cpu1=5<br>
distinct CPUs used: 2<br>
# The mask is a property of the process, visible in /proc<br>
$ taskset -c 2,4 bash -c 'grep Cpus_allowed_list /proc/self/status'<br>
Cpus_allowed_list:	2,4</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Pinned to CPU 3, all 8 threads share that single CPU; pinned to CPUs 0–1, they share two. The <code>Cpus_allowed_list</code> line is the same mask the kernel stores for every process (<code>man 2 sched_setaffinity</code>); the number of distinct CPUs used changes exactly as the mask changes.</p>
<div class="callout">🧭 On a real server: Docker's <code>--cpuset-cpus=0-3</code> and Kubernetes' <code>static</code> CPU manager policy (a pod with integer CPU requests equal to limits gets <em>exclusive</em> cores) are space sharing; <code>--cpus=2</code> or a CPU limit is the weaker <em>quota</em> form (cgroup <code>cpu.max</code> = time sharing with a ceiling). Latency-sensitive services (trading, real-time audio, a database's WAL writer) are pinned; throughput services share. HPC clusters (Slurm) allocate whole nodes or cores to a job — space sharing at data-centre scale.</div>`,
        `<p class="y-chinh">🎯 Hình 8-13 — <strong>chia không gian (space sharing)</strong>: thay vì chia mọi CPU theo thời gian, chia các CPU thành <strong>phân vùng (partition)</strong> và cho mỗi chương trình (nhiều luồng) một phân vùng riêng, giữ tới khi nó xong. Hình cho thấy 32 CPU chia thành các phân vùng 8, 6, 4 và 12 CPU, còn hai CPU chưa gán.</p>
<p>Nếu các luồng của một việc cần làm chung thì hãy cho chúng CPU riêng và đừng lấy đi. Trong một phân vùng không có chia giờ: mỗi CPU một luồng, nên hoàn toàn không có chuyển ngữ cảnh và không có cache bị người lạ làm bẩn. Khi chương trình kết thúc, CPU của nó về lại kho; chương trình mới xin <em>n</em> CPU sẽ bắt đầu khi có đủ <em>n</em> CPU rảnh — nếu không thì chờ. HĐH cũng có thể để chương trình <em>nở ra hay co lại</em> phân vùng của nó, một biến thể "động" mà sách nhắc tới.</p>
<p>Điểm yếu: <strong>CPU rảnh</strong>. Một việc xin 4 CPU nhưng đang chờ đĩa giữ 4 CPU rảnh mà việc khác có thể dùng; và một việc lớn ở đầu hàng chặn các việc nhỏ phía sau dù vẫn có vài CPU rảnh. Đây là tám CPU và năm việc muốn 4, 3, 4, 2 và 3 CPU, theo thứ tự đến trước phục vụ trước nghiêm ngặt:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ddd638034af04179ca7614a4c587e22ca11c39fc.svg" alt="Chia không gian trên 8 CPU: các phân vùng và CPU·tick bị phí" loading="lazy" /><p class="chu-thich">🧮 Chia không gian trên 8 CPU: các phân vùng và CPU·tick bị phí</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const A = (v, k, c) =&gt; Array.from({ length: k }, (_, i) =&gt; ({ ten: &#96;&#36;{v}&#36;{i}&#96;, viec: v, chay: c }));
const LUONG = [...A('A', 3, 6), ...A('B', 2, 6), ...A('C', 2, 6)];
const VIEC = [{ ten: 'A', luong: 4, chay: 6 }, { ten: 'B', luong: 3, chay: 4 }, { ten: 'C', luong: 4, chay: 5 }, { ten: 'D', luong: 2, chay: 3 }, { ten: 'E', luong: 3, chay: 2 }];
const BANG = [{ ten: 'A', n: 6 }, { ten: 'B', n: 3 }, { ten: 'C', n: 3 }, { ten: 'D', n: 5 }, { ten: 'E', n: 7 }];</code></pre></details>
<p>Việc C (4 CPU) không bắt đầu được ở tick 0 vì chỉ còn một CPU rảnh, và FIFO nghiêm ngặt cấm cho việc D chen lên trước; chương trình đếm được 10 CPU·tick bị phí trong lúc các việc chờ. Bộ lập lịch lô thật chữa bằng <em>backfilling</em> — cho một việc nhỏ đến sau dùng cái lỗ nếu nó không làm chậm việc đứng trước.</p>
<p>➕ Bạn <em>làm</em> được chia không gian ngay trên laptop. <code>taskset</code> đặt các CPU mà một tiến trình được dùng; chạy lại chương trình của slide 12 và nhìn dòng hai và ba:</p>
<div class="out"># Chia không gian thu nhỏ: taskset quyết định chương trình được dùng CPU NÀO (mặt nạ affinity)<br>
$ gcc -O0 -pthread _ghim-cpu.c -o ghim-cpu<br>
$ echo "--- free (no restriction)"; ./ghim-cpu<br>
--- free (no restriction)<br>
threads per CPU: cpu1=2 cpu2=1 cpu3=1 cpu4=1 cpu6=1 cpu7=1 cpu8=1<br>
distinct CPUs used: 7<br>
$ echo "--- pinned to CPU 3 (1):"; taskset -c 3 ./ghim-cpu<br>
--- pinned to CPU 3 (1):<br>
threads per CPU: cpu3=8<br>
distinct CPUs used: 1<br>
$ echo "--- pinned to CPUs 0-1 (2):"; taskset -c 0-1 ./ghim-cpu<br>
--- pinned to CPUs 0-1 (2):<br>
threads per CPU: cpu0=3 cpu1=5<br>
distinct CPUs used: 2<br>
# Mặt nạ là thuộc tính của tiến trình, xem được trong /proc<br>
$ taskset -c 2,4 bash -c 'grep Cpus_allowed_list /proc/self/status'<br>
Cpus_allowed_list:	2,4</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Ghim vào CPU 3, cả 8 luồng chia nhau CPU duy nhất đó; ghim vào CPU 0–1, chúng chia nhau hai CPU. Dòng <code>Cpus_allowed_list</code> là cùng mặt nạ mà nhân lưu cho mọi tiến trình (<code>man 2 sched_setaffinity</code>); số CPU khác nhau được dùng đổi đúng theo mặt nạ.</p>
<div class="callout">🧭 Trên server thật: <code>--cpuset-cpus=0-3</code> của Docker và chính sách CPU manager <code>static</code> của Kubernetes (pod có yêu cầu CPU nguyên bằng giới hạn được cấp nhân <em>độc quyền</em>) là chia không gian; <code>--cpus=2</code> hay một giới hạn CPU là dạng <em>hạn ngạch</em> yếu hơn (cgroup <code>cpu.max</code> = chia giờ có trần). Dịch vụ nhạy độ trễ (giao dịch chứng khoán, âm thanh thời gian thực, luồng ghi WAL của CSDL) được ghim; dịch vụ thông lượng thì chia sẻ. Cụm HPC (Slurm) cấp cả node hoặc cả nhân cho một việc — chia không gian ở quy mô trung tâm dữ liệu.</div>`],
      [17, 'Gang Scheduling (1)',
        `<p class="y-chinh">🎯 Figure 8-14 — the problem gang scheduling solves: two threads A₀ and A₁ of the <em>same</em> job talk to each other, but plain time sharing runs them <strong>out of phase</strong>. A₀ sends a request in its time slice, but A₁ is not running; A₁ answers a whole slice later, and A₀ only sees the reply one more slice after that.</p>
<p>Some programs are made of threads that exchange messages or wait on each other's results all the time (a parallel simulation, a pipeline, a client–server pair on one machine). Under time sharing with independent queues, nothing aligns their time slices. In the figure the slice is 100 ms. Thread A₀ (CPU 0) runs in 0–100 ms and sends request 1; A₁ (CPU 1) is not scheduled until 100 ms; it answers then; A₀ runs again at 200 ms, sees the reply, sends request 2... <strong>One request/reply round takes two full slices = 200 ms</strong>, although the actual work is a few microseconds. Here is the figure rebuilt, with the number of completed rounds counted in 600 ms:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9460ac3ce78f1f719daba8aa6120ccc23ee7334f.svg" alt="Out of phase: only 3 request/reply rounds in 600 ms" loading="lazy" /><p class="chu-thich">🧮 Out of phase: only 3 request/reply rounds in 600 ms</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const A = (v, k, c) =&gt; Array.from({ length: k }, (_, i) =&gt; ({ ten: &#96;&#36;{v}&#36;{i}&#96;, viec: v, chay: c }));
const LUONG = [...A('A', 3, 6), ...A('B', 2, 6), ...A('C', 2, 6)];
const VIEC = [{ ten: 'A', luong: 4, chay: 6 }, { ten: 'B', luong: 3, chay: 4 }, { ten: 'C', luong: 4, chay: 5 }, { ten: 'D', luong: 2, chay: 3 }, { ten: 'E', luong: 3, chay: 2 }];
const BANG = [{ ten: 'A', n: 6 }, { ten: 'B', n: 3 }, { ten: 'C', n: 3 }, { ten: 'D', n: 5 }, { ten: 'E', n: 7 }];</code></pre></details>
<p>Each side needs just 1 ms of CPU per round, so the machine is almost entirely idle <em>waiting for the other thread to be scheduled</em>; the CPUs look busy in the Gantt chart, but the real progress is 3 rounds. The cost is a pure scheduling artefact, not a hardware limit.</p>
<p>The same effect appears with locks: if A₀ holds a lock and its time slice ends while A₁ (on another CPU) spins for the lock, A₁ burns its whole slice waiting for a thread that is not even running — this is the real-world name <strong>lock-holder preemption</strong>, a notorious problem for virtual machines whose vCPUs get descheduled by the hypervisor.</p>
<p class="meo">🧠 The lesson: for threads that <em>talk to each other</em>, "being scheduled" is not enough — they must be scheduled <em>at the same time</em>.</p>`,
        `<p class="y-chinh">🎯 Hình 8-14 — vấn đề mà gang scheduling giải quyết: hai luồng A₀ và A₁ của <em>cùng</em> một việc nói chuyện với nhau, nhưng chia giờ thường chạy chúng <strong>lệch pha</strong>. A₀ gửi yêu cầu trong lát thời gian của nó, nhưng A₁ không đang chạy; A₁ trả lời sau cả một lát, và A₀ chỉ thấy đáp án sau thêm một lát nữa.</p>
<p>Một số chương trình gồm các luồng liên tục trao đổi thông điệp hay chờ kết quả của nhau (mô phỏng song song, pipeline, cặp client–server trên một máy). Với chia giờ và các hàng đợi độc lập, không gì căn thẳng các lát thời gian của chúng. Trong hình lát là 100 ms. Luồng A₀ (CPU 0) chạy trong 0–100 ms và gửi yêu cầu 1; A₁ (CPU 1) không được xếp lịch tới 100 ms; nó trả lời lúc đó; A₀ chạy lại ở 200 ms, thấy đáp án, gửi yêu cầu 2... <strong>Một vòng hỏi–đáp tốn hai lát đầy đủ = 200 ms</strong>, dù công việc thật chỉ vài micro giây. Đây là hình dựng lại, với số vòng hoàn tất đếm trong 600 ms:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7e8f7732d38243736fde9d9fe204c626e99d4c9b.svg" alt="Lệch pha: chỉ 3 vòng hỏi–đáp trong 600 ms" loading="lazy" /><p class="chu-thich">🧮 Lệch pha: chỉ 3 vòng hỏi–đáp trong 600 ms</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const A = (v, k, c) =&gt; Array.from({ length: k }, (_, i) =&gt; ({ ten: &#96;&#36;{v}&#36;{i}&#96;, viec: v, chay: c }));
const LUONG = [...A('A', 3, 6), ...A('B', 2, 6), ...A('C', 2, 6)];
const VIEC = [{ ten: 'A', luong: 4, chay: 6 }, { ten: 'B', luong: 3, chay: 4 }, { ten: 'C', luong: 4, chay: 5 }, { ten: 'D', luong: 2, chay: 3 }, { ten: 'E', luong: 3, chay: 2 }];
const BANG = [{ ten: 'A', n: 6 }, { ten: 'B', n: 3 }, { ten: 'C', n: 3 }, { ten: 'D', n: 5 }, { ten: 'E', n: 7 }];</code></pre></details>
<p>Mỗi bên chỉ cần 1 ms CPU cho mỗi vòng, nên máy gần như rảnh hoàn toàn <em>để chờ luồng kia được xếp lịch</em>; các CPU trông bận trong biểu đồ Gantt, nhưng tiến độ thật là 3 vòng. Cái giá là một hiện tượng thuần của lập lịch, không phải giới hạn phần cứng.</p>
<p>Hiệu ứng tương tự xuất hiện với khoá: nếu A₀ giữ khoá và lát thời gian của nó hết trong khi A₁ (trên CPU khác) quay chờ khoá, A₁ đốt cả lát để chờ một luồng thậm chí không đang chạy — tên ngoài đời là <strong>lock-holder preemption</strong>, một vấn đề khét tiếng với máy ảo có vCPU bị hypervisor tước CPU.</p>
<p class="meo">🧠 Bài học: với các luồng <em>nói chuyện với nhau</em>, "được xếp lịch" chưa đủ — chúng phải được xếp lịch <em>cùng lúc</em>.</p>`],
      [18, 'Gang Scheduling (2)',
        `<p class="y-chinh">🎯 <strong>Gang scheduling</strong> has three parts: (1) groups of related threads are scheduled as a unit — a <strong>gang</strong>; (2) all members of a gang run at once, each on a different CPU; (3) all members start and end their time slices together.</p>
<p>Rule 1 says the scheduler's unit is no longer a thread but a group (a process's threads, or the threads of one parallel job). Rule 2 gives the alignment: when the gang is running, every one of its threads is on a CPU. Rule 3 keeps it aligned: time slices are synchronised across CPUs, so the whole machine switches from gang A to gang B at the same instant — all CPUs change threads together. The result for Figure 8-14's pair: A₀ and A₁ now run in the <em>same</em> 100 ms slice. A request and its reply fit inside it. Same CPUs, same 50% share of the machine for job A:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d06a56a154a1df25814cd13b72c4889710011b2d.svg" alt="Gang scheduling: 150 request/reply rounds in 600 ms" loading="lazy" /><p class="chu-thich">🧮 Gang scheduling: 150 request/reply rounds in 600 ms</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const A = (v, k, c) =&gt; Array.from({ length: k }, (_, i) =&gt; ({ ten: &#96;&#36;{v}&#36;{i}&#96;, viec: v, chay: c }));
const LUONG = [...A('A', 3, 6), ...A('B', 2, 6), ...A('C', 2, 6)];
const VIEC = [{ ten: 'A', luong: 4, chay: 6 }, { ten: 'B', luong: 3, chay: 4 }, { ten: 'C', luong: 4, chay: 5 }, { ten: 'D', luong: 2, chay: 3 }, { ten: 'E', luong: 3, chay: 2 }];
const BANG = [{ ten: 'A', n: 6 }, { ten: 'B', n: 3 }, { ten: 'C', n: 3 }, { ten: 'D', n: 5 }, { ten: 'E', n: 7 }];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/80eab36e6f74c41c08fd153c22610a9caa5d358b.svg" alt="Same CPUs, same share, 50 times more rounds" loading="lazy" /><p class="chu-thich">🧮 Same CPUs, same share, 50 times more rounds</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const A = (v, k, c) =&gt; Array.from({ length: k }, (_, i) =&gt; ({ ten: &#96;&#36;{v}&#36;{i}&#96;, viec: v, chay: c }));
const LUONG = [...A('A', 3, 6), ...A('B', 2, 6), ...A('C', 2, 6)];
const VIEC = [{ ten: 'A', luong: 4, chay: 6 }, { ten: 'B', luong: 3, chay: 4 }, { ten: 'C', luong: 4, chay: 5 }, { ten: 'D', luong: 2, chay: 3 }, { ten: 'E', luong: 3, chay: 2 }];
const BANG = [{ ten: 'A', n: 6 }, { ten: 'B', n: 3 }, { ten: 'C', n: 3 }, { ten: 'D', n: 5 }, { ten: 'E', n: 7 }];</code></pre></details>
<p>Only the <em>schedule</em> changed: 3 rounds become 150. (In the model each side needs 1 ms of CPU per round, so a 100 ms slice fits 50 rounds, and job A owns 3 slices of 6: 3 × 50 = 150.)</p>
<p>The price of gang scheduling: <strong>fragmentation</strong> and loss of flexibility. A gang of 3 threads cannot use a hole of 2 CPUs; threads that block (waiting for I/O) leave their CPUs idle for the rest of the slice because the others in the gang may be waiting for them; and it is hard to implement over a per-CPU run queue. That is why gangs are used where the benefit is large — parallel scientific codes, virtual machines (a hypervisor <em>co-schedules</em> all vCPUs of a guest — VMware ESX's "co-scheduling" is the well-known case) — and not by a general Linux desktop.</p>
<div class="callout">🧭 On a real server: <strong>Kubernetes</strong> does not gang-schedule by default — a distributed ML training job of 8 pods may get 7 pods placed and wait forever for the 8th, holding GPUs idle (the "partial deployment" deadlock). Projects such as Volcano and Kueue add <em>gang</em> (all-or-nothing) admission for exactly this reason; the Slurm HPC scheduler has a "gang" mode for time-slicing parallel jobs. Same principle, new name: <em>all members start together or none starts.</em></div>`,
        `<p class="y-chinh">🎯 <strong>Gang scheduling</strong> có ba phần: (1) nhóm các luồng liên quan được xếp lịch như một đơn vị — một <strong>băng (gang)</strong>; (2) mọi thành viên của băng chạy cùng một lúc, mỗi luồng trên một CPU khác nhau; (3) mọi thành viên bắt đầu và kết thúc lát thời gian của mình cùng nhau.</p>
<p>Luật 1 nói đơn vị của bộ lập lịch không còn là luồng mà là một nhóm (các luồng của một tiến trình, hay các luồng của một việc song song). Luật 2 cho sự thẳng hàng: khi băng đang chạy, mọi luồng của nó đều đang ở trên một CPU. Luật 3 giữ cho nó thẳng hàng: các lát thời gian được đồng bộ trên các CPU, nên cả máy chuyển từ băng A sang băng B cùng một khoảnh khắc — mọi CPU đổi luồng cùng nhau. Kết quả với cặp ở Hình 8-14: A₀ và A₁ giờ chạy trong <em>cùng</em> lát 100 ms. Một yêu cầu và đáp án của nó nằm gọn trong đó. Cùng CPU, cùng phần 50% của máy cho việc A:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6f187f1f7a34efc115e720d4afb972a73f2a115c.svg" alt="Gang scheduling: 150 vòng hỏi–đáp trong 600 ms" loading="lazy" /><p class="chu-thich">🧮 Gang scheduling: 150 vòng hỏi–đáp trong 600 ms</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const A = (v, k, c) =&gt; Array.from({ length: k }, (_, i) =&gt; ({ ten: &#96;&#36;{v}&#36;{i}&#96;, viec: v, chay: c }));
const LUONG = [...A('A', 3, 6), ...A('B', 2, 6), ...A('C', 2, 6)];
const VIEC = [{ ten: 'A', luong: 4, chay: 6 }, { ten: 'B', luong: 3, chay: 4 }, { ten: 'C', luong: 4, chay: 5 }, { ten: 'D', luong: 2, chay: 3 }, { ten: 'E', luong: 3, chay: 2 }];
const BANG = [{ ten: 'A', n: 6 }, { ten: 'B', n: 3 }, { ten: 'C', n: 3 }, { ten: 'D', n: 5 }, { ten: 'E', n: 7 }];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8788d65320849c9190ab20d208f52b9e35e3e1b2.svg" alt="Cùng CPU, cùng phần, nhiều gấp 50 lần số vòng" loading="lazy" /><p class="chu-thich">🧮 Cùng CPU, cùng phần, nhiều gấp 50 lần số vòng</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const A = (v, k, c) =&gt; Array.from({ length: k }, (_, i) =&gt; ({ ten: &#96;&#36;{v}&#36;{i}&#96;, viec: v, chay: c }));
const LUONG = [...A('A', 3, 6), ...A('B', 2, 6), ...A('C', 2, 6)];
const VIEC = [{ ten: 'A', luong: 4, chay: 6 }, { ten: 'B', luong: 3, chay: 4 }, { ten: 'C', luong: 4, chay: 5 }, { ten: 'D', luong: 2, chay: 3 }, { ten: 'E', luong: 3, chay: 2 }];
const BANG = [{ ten: 'A', n: 6 }, { ten: 'B', n: 3 }, { ten: 'C', n: 3 }, { ten: 'D', n: 5 }, { ten: 'E', n: 7 }];</code></pre></details>
<p>Chỉ <em>lịch</em> đổi: 3 vòng thành 150. (Trong mô hình mỗi bên cần 1 ms CPU mỗi vòng, nên một lát 100 ms chứa 50 vòng, và việc A sở hữu 3 lát trên 6: 3 × 50 = 150.)</p>
<p>Cái giá của gang scheduling: <strong>phân mảnh</strong> và mất linh hoạt. Một băng 3 luồng không dùng được một lỗ 2 CPU; luồng bị chặn (chờ I/O) để CPU của nó rảnh hết phần còn lại của lát vì các thành viên khác trong băng có thể đang chờ nó; và khó cài trên nền hàng đợi chạy theo từng CPU. Vì vậy băng được dùng ở nơi lợi ích lớn — mã khoa học song song, máy ảo (hypervisor <em>đồng lập lịch (co-schedule)</em> mọi vCPU của một guest — "co-scheduling" của VMware ESX là ví dụ nổi tiếng) — và không phải bởi một máy Linux desktop thông thường.</p>
<div class="callout">🧭 Trên server thật: <strong>Kubernetes</strong> mặc định không gang-schedule — một việc huấn luyện ML phân tán gồm 8 pod có thể được đặt 7 pod rồi chờ mãi pod thứ 8, giữ GPU nằm không (bế tắc "triển khai một phần"). Các dự án như Volcano và Kueue thêm cơ chế nhận việc kiểu <em>gang</em> (được cả hoặc không được gì) đúng vì lý do đó; bộ lập lịch HPC Slurm có chế độ "gang" để chia lát thời gian cho các việc song song. Cùng nguyên lý, tên mới: <em>mọi thành viên cùng bắt đầu hoặc không ai bắt đầu.</em></div>`],
      [19, 'Gang Scheduling (3)',
        `<p class="y-chinh">🎯 Figure 8-15 — a <strong>gang-scheduling table</strong>: rows are time slots, columns are CPUs; each cell says which thread runs. Five jobs A (6 threads), B (3), C (3), D (5), E (7) on 6 CPUs fill 4 slots, and the scheduler cycles through the slots round-robin.</p>
<p>The scheduler builds this table like packing suitcases. Slot 0: gang A takes all 6 CPUs. Slot 1: B (3 threads) does not fill the slot, so C (3 threads) joins it — six CPUs, two gangs. Slot 2: D needs 5 of 6, leaving one hole. Gang E has 7 threads but the machine has only 6 CPUs, so it cannot fit even in an empty slot: it is split (E₀ fills the hole in slot 2, E₁–E₆ take slot 3). The rule used by the program is "put the gang in the current slot if it fits, otherwise open a new slot; a gang bigger than the machine is spread over consecutive slots":</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/73cef907bf80ba32855011afe05c4aa293bf1ecd.svg" alt="The gang-scheduling table of Figure 8-15" loading="lazy" /><p class="chu-thich">🧮 The gang-scheduling table of Figure 8-15</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const A = (v, k, c) =&gt; Array.from({ length: k }, (_, i) =&gt; ({ ten: &#96;&#36;{v}&#36;{i}&#96;, viec: v, chay: c }));
const LUONG = [...A('A', 3, 6), ...A('B', 2, 6), ...A('C', 2, 6)];
const VIEC = [{ ten: 'A', luong: 4, chay: 6 }, { ten: 'B', luong: 3, chay: 4 }, { ten: 'C', luong: 4, chay: 5 }, { ten: 'D', luong: 2, chay: 3 }, { ten: 'E', luong: 3, chay: 2 }];
const BANG = [{ ten: 'A', n: 6 }, { ten: 'B', n: 3 }, { ten: 'C', n: 3 }, { ten: 'D', n: 5 }, { ten: 'E', n: 7 }];</code></pre></details>
<p>Every CPU is busy in every slot here (the total of 6 + 6 + 6 + 6 = 24 thread-slots of 24), and the book repeats the table in slots 4–7 to show "time slots round-robin": slot 4 = slot 0 again. Real tables rarely fill so well — a gang of 4 next to a gang of 3 on 6 CPUs wastes 2 CPUs in each slot, and the <em>packing</em> problem (bin packing) is NP-hard in general, so schedulers use heuristics.</p>
<p>Compare the three ideas of §8.1.6 in one table:</p>
<table>
<thead><tr><th>Scheme</th><th>Idea</th><th>Strength</th><th>Weakness</th></tr></thead>
<tbody>
<tr><td>Time sharing (slide 15)</td><td>one ready queue for all CPUs</td><td>no idle CPU while work waits; simple</td><td>threads of one job scattered; queue lock; cache lost</td></tr>
<tr><td>Space sharing (slide 16)</td><td>each job owns CPUs until done</td><td>no switching; threads together; good cache use</td><td>idle CPUs, waiting for enough CPUs</td></tr>
<tr><td>Gang scheduling (slides 17–19)</td><td>whole job runs in the same slice</td><td>threads that talk to each other make progress</td><td>fragmentation; blocked threads waste the slice</td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ Exam wording: "<em>all members of a gang run at once on different CPUs</em>" and "<em>start and end their time slices together</em>" are the defining sentences; if a question says threads are given CPUs <em>permanently</em> it means space sharing.</p>
<p class="meo">🧠 Backend rule of thumb: threads that wait for each other constantly (lock ping-pong, a request/reply pair on one box) want to be <em>together</em>; independent workers (a stateless web pool) do not care where they run.</p>`,
        `<p class="y-chinh">🎯 Hình 8-15 — một <strong>bảng gang scheduling</strong>: hàng là các khe thời gian, cột là các CPU; mỗi ô ghi luồng nào chạy. Năm việc A (6 luồng), B (3), C (3), D (5), E (7) trên 6 CPU lấp đầy 4 khe, và bộ lập lịch xoay vòng qua các khe.</p>
<p>Bộ lập lịch dựng bảng này như xếp vali. Khe 0: băng A lấy cả 6 CPU. Khe 1: B (3 luồng) chưa đầy khe, nên C (3 luồng) vào cùng — sáu CPU, hai băng. Khe 2: D cần 5 trên 6, để lại một lỗ. Băng E có 7 luồng mà máy chỉ có 6 CPU, nên nó không vừa dù khe trống: nó bị tách (E₀ lấp lỗ ở khe 2, E₁–E₆ chiếm khe 3). Luật chương trình dùng là "đặt băng vào khe hiện tại nếu vừa, không thì mở khe mới; băng lớn hơn cả máy thì rải qua các khe liên tiếp":</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6f89d6fd532b0f01d9eeb65539a2f6a87731b6ff.svg" alt="Bảng gang scheduling của Hình 8-15" loading="lazy" /><p class="chu-thich">🧮 Bảng gang scheduling của Hình 8-15</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const A = (v, k, c) =&gt; Array.from({ length: k }, (_, i) =&gt; ({ ten: &#96;&#36;{v}&#36;{i}&#96;, viec: v, chay: c }));
const LUONG = [...A('A', 3, 6), ...A('B', 2, 6), ...A('C', 2, 6)];
const VIEC = [{ ten: 'A', luong: 4, chay: 6 }, { ten: 'B', luong: 3, chay: 4 }, { ten: 'C', luong: 4, chay: 5 }, { ten: 'D', luong: 2, chay: 3 }, { ten: 'E', luong: 3, chay: 2 }];
const BANG = [{ ten: 'A', n: 6 }, { ten: 'B', n: 3 }, { ten: 'C', n: 3 }, { ten: 'D', n: 5 }, { ten: 'E', n: 7 }];</code></pre></details>
<p>Ở đây mọi CPU đều bận trong mọi khe (tổng 6 + 6 + 6 + 6 = 24 ô luồng trên 24), và sách lặp lại bảng ở khe 4–7 để cho thấy "khe thời gian xoay vòng": khe 4 = lại khe 0. Bảng thật hiếm khi đầy đến vậy — một băng 4 cạnh một băng 3 trên 6 CPU phí 2 CPU ở mỗi khe, và bài toán <em>đóng gói</em> (bin packing) nói chung là NP-khó, nên bộ lập lịch dùng heuristic.</p>
<p>So ba ý tưởng của §8.1.6 trong một bảng:</p>
<table>
<thead><tr><th>Cách</th><th>Ý tưởng</th><th>Điểm mạnh</th><th>Điểm yếu</th></tr></thead>
<tbody>
<tr><td>Chia giờ (slide 15)</td><td>một hàng đợi sẵn sàng cho mọi CPU</td><td>không CPU rảnh khi còn việc chờ; đơn giản</td><td>luồng của một việc bị rải; khoá hàng đợi; mất cache</td></tr>
<tr><td>Chia không gian (slide 16)</td><td>mỗi việc sở hữu CPU tới khi xong</td><td>không chuyển; luồng ở cùng nhau; dùng cache tốt</td><td>CPU rảnh, chờ đủ CPU</td></tr>
<tr><td>Gang scheduling (slide 17–19)</td><td>cả việc chạy trong cùng lát</td><td>các luồng nói chuyện với nhau tiến triển được</td><td>phân mảnh; luồng bị chặn phí lát</td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ Cách hỏi thi: "<em>mọi thành viên của băng chạy cùng lúc trên các CPU khác nhau</em>" và "<em>bắt đầu và kết thúc lát thời gian cùng nhau</em>" là các câu định nghĩa; nếu câu hỏi nói luồng được cấp CPU <em>vĩnh viễn</em> thì đó là chia không gian.</p>
<p class="meo">🧠 Quy tắc ngón tay cái cho backend: các luồng liên tục chờ nhau (khoá qua lại, cặp request/reply trên một máy) muốn ở <em>cùng nhau</em>; các thợ độc lập (pool web không trạng thái) không quan tâm chạy ở đâu.</p>`],
    ]),
    books([
      ['mos4', 'Chapter 8, sections 8.1.1–8.1.6, Figures 8-1 to 8-15', 'Chương 8, mục 8.1.1–8.1.6, Hình 8-1 tới 8-15'],
      ['ostep', 'Chapter 10 "Multiprocessor Scheduling (Advanced)" and Chapter 28 "Locks" (spin locks, test-and-set, queue locks)', 'Chương 10 "Multiprocessor Scheduling (Advanced)" và Chương 28 "Locks" (khoá quay, test-and-set, khoá hàng đợi)'],
      ['kernelDocs', 'docs.kernel.org/scheduler/sched-domains.html (scheduling domains, load balancing) and docs.kernel.org/admin-guide/numastat.html', 'docs.kernel.org/scheduler/sched-domains.html (miền lập lịch, cân bằng tải) và docs.kernel.org/admin-guide/numastat.html'],
      ['man7', 'sched_setaffinity(2), sched_getcpu(3), taskset(1), numactl(8), cpuset(7)', 'sched_setaffinity(2), sched_getcpu(3), taskset(1), numactl(8), cpuset(7)'],
    ]),
  ].join('\n'),
};

/* ───────── 8.B — 📑 Slide by slide · Multicomputers and distributed systems: RPC, DSM, load balancing, middleware (slides 20–50) ───────── */
const L_osg8_2 = {
  title: '8.B — 📑 Slide by slide · Multicomputers and distributed systems: RPC, DSM, load balancing, middleware (slides 20–50)|||8.B — 📑 Học theo từng slide · Đa máy tính và hệ phân tán: RPC, DSM, cân bằng tải, middleware (slide 20–50)',
  slug: 'osg202-slide-osg8-2',
  type: 'VIDEO',
  description: 'Giảng đủ 31 slide cuối của Chương 8 (mục 8.2 và 8.3): các kiểu mạng liên kết (vòng, lưới, torus, siêu khối — đường kính và bisection do chương trình đo), store-and-forward so với cut-through, card mạng, gọi chặn và không chặn (bộ đệm nhân 65536 byte đo thật), RPC dựng từ số 0 bằng Node.js, bộ nhớ chia sẻ phân tán bằng lỗi trang (chương trình C hai tiến trình tự dựng), false sharing, đồ thị gán tiến trình, cân bằng tải do bên gửi và bên nhận khởi xướng, rồi hệ phân tán: middleware, Ethernet và Internet, dịch vụ mạng, header gói tin dựng tay, Web từng bước, hệ tệp phân tán và ngữ nghĩa chia sẻ tệp, CORBA so với gRPC, không gian tuple Linda và publish/subscribe — kèm các chỗ slide đã cũ hoặc sai.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.B · deck "Chapter 8 · Multiple Processor Systems", slides 20–50</span>
<h2>Many computers, no shared memory: send messages, and live with the network</h2>
<p class="lead">Lesson 8.A ended where hardware stops scaling: a bus, a crossbar and even a NUMA directory cannot connect ten thousand CPUs. The way out is to give every CPU its <em>own</em> memory and let them cooperate only by sending <strong>messages</strong>. This second half follows the book from the rack to the planet: §8.2 <strong>multicomputers</strong> (a room full of machines on a fast private network — a cluster, a supercomputer, a data-centre rack), then §8.3 <strong>distributed systems</strong> (complete computers on the Internet, hidden behind software called <em>middleware</em>). Everything you do as a backend engineer — a REST call, a message queue, a microservice — lives in this lesson.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>20–22</td><td>8.2.1–8.2.2 Interconnect and network interface</td><td>compare ring, grid, torus, hypercube; explain store-and-forward vs cut-through and the network card</td></tr>
<tr><td>23–25</td><td>8.2.3 Low-level communication software</td><td>explain blocking vs non-blocking send, and the 5 steps of a remote procedure call</td></tr>
<tr><td>26–30</td><td>8.2.4 Distributed shared memory</td><td>explain how page faults can fake shared memory, and why false sharing hurts</td></tr>
<tr><td>31–32</td><td>8.2.5–8.2.6 Scheduling, load balancing</td><td>assign processes to nodes by graph cut; compare sender- and receiver-initiated balancing</td></tr>
<tr><td>33–38</td><td>8.3.1–8.3.2 Distributed systems, network</td><td>place middleware; describe Ethernet, the Internet, six network services and protocol headers</td></tr>
<tr><td>39–50</td><td>8.3.3–8.3.4 Middleware</td><td>compare document-, file-system-, object-, and coordination-based middleware</td></tr>
</tbody>
</table>
<div class="callout">Some slides carry the age of their 2015 edition (Windows/Pentium/SPARC examples, CORBA, a 2013 web address). Where a slide is outdated or wrong, the lesson says so and gives the modern fact with a source or a measurement; the notes at the top of the source file list them.</div>`,
    `<span class="eyebrow">Chương 8 · Bài 8.B · deck "Chapter 8 · Multiple Processor Systems", slide 20–50</span>
<h2>Nhiều máy tính, không bộ nhớ chung: gửi thông điệp, và sống chung với mạng</h2>
<p class="lead">Bài 8.A dừng ở chỗ phần cứng không mở rộng nổi: bus, crossbar và cả thư mục NUMA đều không nối nổi mười nghìn CPU. Lối thoát là cho mỗi CPU bộ nhớ <em>riêng</em> của nó và để chúng hợp tác chỉ bằng cách gửi <strong>thông điệp (message)</strong>. Nửa sau này đi theo sách từ cái tủ rack tới cả hành tinh: §8.2 <strong>đa máy tính (multicomputer)</strong> (một căn phòng đầy máy trên mạng riêng nhanh — một cluster, một siêu máy tính, một tủ rack trung tâm dữ liệu), rồi §8.3 <strong>hệ phân tán (distributed system)</strong> (các máy tính nguyên vẹn trên Internet, được che sau phần mềm gọi là <em>middleware</em>). Mọi thứ bạn làm với tư cách kỹ sư backend — một lời gọi REST, một hàng đợi thông điệp, một microservice — nằm trong bài này.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>20–22</td><td>8.2.1–8.2.2 Mạng liên kết và giao diện mạng</td><td>so vòng, lưới, torus, siêu khối; giải thích store-and-forward so với cut-through và card mạng</td></tr>
<tr><td>23–25</td><td>8.2.3 Phần mềm giao tiếp mức thấp</td><td>giải thích gửi chặn và không chặn, và 5 bước của một lời gọi thủ tục từ xa</td></tr>
<tr><td>26–30</td><td>8.2.4 Bộ nhớ chia sẻ phân tán</td><td>giải thích lỗi trang có thể giả bộ nhớ chung thế nào, và vì sao false sharing gây hại</td></tr>
<tr><td>31–32</td><td>8.2.5–8.2.6 Lập lịch, cân bằng tải</td><td>gán tiến trình vào nút bằng lát cắt đồ thị; so cân bằng do bên gửi và bên nhận khởi xướng</td></tr>
<tr><td>33–38</td><td>8.3.1–8.3.2 Hệ phân tán, mạng</td><td>đặt middleware; mô tả Ethernet, Internet, sáu dịch vụ mạng và header gói tin</td></tr>
<tr><td>39–50</td><td>8.3.3–8.3.4 Middleware</td><td>so middleware dựa trên tài liệu, hệ tệp, đối tượng và điều phối</td></tr>
</tbody>
</table>
<div class="callout">Vài slide mang tuổi của bản 2015 (ví dụ Windows/Pentium/SPARC, CORBA, một địa chỉ web năm 2013). Chỗ nào slide đã cũ hoặc sai, bài nói thẳng và đưa sự thật hiện đại kèm nguồn hoặc số đo; các ghi chú ở đầu tệp nguồn liệt kê chúng.</div>`),
    walkHead('osg8', 20, 50),
    walk('osg8', [
      [20, 'Interconnection Technology (1)',
        `<p class="y-chinh">🎯 Figure 8-16 — six <strong>interconnect topologies</strong> for a multicomputer: (a) a single switch, (b) a ring, (c) a grid (mesh), (d) a double torus, (e) a cube, (f) a 4-dimensional hypercube. A good topology has few links per node, a small <strong>diameter</strong> (worst-case number of hops) and a large <strong>bisection width</strong> (links that must be cut to split the machine in two halves — the bandwidth of the narrowest cut).</p>
<p>A multicomputer is a set of nodes (CPU + RAM + network card, no shared memory). How you wire them decides latency and cost. A <strong>single switch</strong> (a) is the cheapest to understand — every node has one link — but the switch itself is a crossbar that grows with n². A <strong>ring</strong> (b) uses two links per node, but a message may travel half-way round. A <strong>grid</strong> (c) uses up to four links; a <strong>torus</strong> (d) adds wrap-around links so the edges are not "far". A <strong>hypercube</strong> (e, f) has nodes numbered with <em>k</em> bits and a link between nodes whose numbers differ in one bit: 2<sup>k</sup> nodes, <em>k</em> links per node, diameter <em>k</em>. The 4D hypercube of (f) is two cubes with matching corners joined.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/cd3843ca7e2f864e413d6a91f900bea51c686904.svg" alt="The six topologies of Figure 8-16 redrawn" loading="lazy" /><p class="chu-thich">🧮 The six topologies of Figure 8-16 redrawn</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CAC_KIEU = [
  ['sao', 16, 'single switch', 'một công tắc'], ['vong', 16, 'ring', 'vòng'], ['luoi', [4, 4], 'grid (mesh)', 'lưới'],
  ['torus', [4, 4], 'double torus', 'torus kép'], ['lapphuong', 4, '4D hypercube', 'siêu khối 4D'],
];</code></pre></details>
<p>Do not trust a table from a book — measure. The program below builds a 16-machine version of each topology and computes the numbers by breadth-first search and by brute-force over every way to split the machines in two equal halves:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/17d6d3a742a2f41b3f60b88190bd244a21a1783b.svg" alt="Links, degree, diameter and bisection width of 16-node networks" loading="lazy" /><p class="chu-thich">🧮 Links, degree, diameter and bisection width of 16-node networks</p></div>
<table>
<thead><tr><th>Topology (16 machines)</th><th>Links</th><th>Max links per machine</th><th>Diameter (hops)</th><th>Bisection width (links)</th></tr></thead>
<tbody>
<tr><td>single switch</td><td>16</td><td>1</td><td>2</td><td>8</td></tr>
<tr><td>ring</td><td>16</td><td>2</td><td>8</td><td>2</td></tr>
<tr><td>grid (mesh)</td><td>24</td><td>4</td><td>6</td><td>4</td></tr>
<tr><td>double torus</td><td>32</td><td>4</td><td>4</td><td>8</td></tr>
<tr><td>4D hypercube</td><td>32</td><td>4</td><td>4</td><td>8</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CAC_KIEU = [
  ['sao', 16, 'single switch', 'một công tắc'], ['vong', 16, 'ring', 'vòng'], ['luoi', [4, 4], 'grid (mesh)', 'lưới'],
  ['torus', [4, 4], 'double torus', 'torus kép'], ['lapphuong', 4, '4D hypercube', 'siêu khối 4D'],
];</code></pre></details>
<p>Read it as the engineers do: the <strong>ring</strong> is cheapest (16 links) but its diameter is 8 hops and cutting just 2 links splits it; the <strong>torus</strong> and the <strong>hypercube</strong> both have diameter 4 and bisection 8, but the hypercube needs 4 links on each node however many nodes there are, while the torus has a fixed small degree — at 1024 nodes a 32×32 torus has diameter 32 against the hypercube's 10, and the hypercube's wiring grows with log n. The single switch has diameter 2 and a bisection of 8, but only because the one switch carries all the traffic.</p>
<p>➕ Modern machines: the GPUs inside one server are linked by <strong>NVLink</strong> through <strong>NVSwitch</strong> (a switch topology); supercomputers use <em>fat trees</em> and <em>dragonfly</em> networks; a data-centre uses a <em>leaf–spine</em> network (every top-of-rack switch linked to every spine switch — a small crossbar of switches). The book's six are the vocabulary; real machines combine them.</p>
<p class="pitfall">⚠️ "Hypercube" is not a 3D object you can build: the 4D one is drawn here as a 3D projection. Count the 16 corners and 32 edges in the table to check the drawing: a k-cube has <code>2^k</code> nodes and <code>k·2^(k−1)</code> links (k = 4: 16 and 32).</p>`,
        `<p class="y-chinh">🎯 Hình 8-16 — sáu <strong>kiểu mạng liên kết (interconnect topology)</strong> cho một multicomputer: (a) một công tắc, (b) vòng, (c) lưới (mesh), (d) torus kép, (e) khối lập phương, (f) siêu khối 4 chiều. Một cấu trúc tốt có ít liên kết mỗi nút, <strong>đường kính (diameter)</strong> nhỏ (số bước đi tối đa) và <strong>bisection width</strong> lớn (số liên kết phải cắt để chia máy làm hai nửa — băng thông của lát cắt hẹp nhất).</p>
<p>Multicomputer là một tập nút (CPU + RAM + card mạng, không bộ nhớ chung). Cách nối dây quyết định độ trễ và chi phí. <strong>Một công tắc</strong> (a) dễ hiểu và rẻ nhất — mỗi nút một liên kết — nhưng bản thân công tắc là một crossbar tăng theo n². <strong>Vòng</strong> (b) dùng hai liên kết mỗi nút, nhưng thông điệp có thể phải đi nửa vòng. <strong>Lưới</strong> (c) dùng tới bốn liên kết; <strong>torus</strong> (d) thêm liên kết quấn vòng để các mép không bị "xa". <strong>Siêu khối (hypercube)</strong> (e, f) có các nút đánh số <em>k</em> bit và một liên kết giữa các nút có số khác nhau đúng một bit: 2<sup>k</sup> nút, <em>k</em> liên kết mỗi nút, đường kính <em>k</em>. Siêu khối 4D ở (f) là hai khối lập phương nối các đỉnh tương ứng.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/0642b59ecaf8bec722a8c3db45aa4ef382ad945a.svg" alt="Sáu kiểu mạng của Hình 8-16 vẽ lại" loading="lazy" /><p class="chu-thich">🧮 Sáu kiểu mạng của Hình 8-16 vẽ lại</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CAC_KIEU = [
  ['sao', 16, 'single switch', 'một công tắc'], ['vong', 16, 'ring', 'vòng'], ['luoi', [4, 4], 'grid (mesh)', 'lưới'],
  ['torus', [4, 4], 'double torus', 'torus kép'], ['lapphuong', 4, '4D hypercube', 'siêu khối 4D'],
];</code></pre></details>
<p>Đừng tin một bảng trong sách — hãy đo. Chương trình dưới đây dựng bản 16 máy của từng kiểu và tính các con số bằng duyệt theo chiều rộng và bằng vét cạn mọi cách chia các máy làm hai nửa bằng nhau:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a2646fb54c46fe8008a607d52deb0354b93dc5b1.svg" alt="Số liên kết, bậc, đường kính và bisection width của mạng 16 nút" loading="lazy" /><p class="chu-thich">🧮 Số liên kết, bậc, đường kính và bisection width của mạng 16 nút</p></div>
<table>
<thead><tr><th>Kiểu mạng (16 máy)</th><th>Số liên kết</th><th>Liên kết tối đa/máy</th><th>Đường kính (số bước)</th><th>Bisection width (liên kết)</th></tr></thead>
<tbody>
<tr><td>một công tắc</td><td>16</td><td>1</td><td>2</td><td>8</td></tr>
<tr><td>vòng</td><td>16</td><td>2</td><td>8</td><td>2</td></tr>
<tr><td>lưới</td><td>24</td><td>4</td><td>6</td><td>4</td></tr>
<tr><td>torus kép</td><td>32</td><td>4</td><td>4</td><td>8</td></tr>
<tr><td>siêu khối 4D</td><td>32</td><td>4</td><td>4</td><td>8</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CAC_KIEU = [
  ['sao', 16, 'single switch', 'một công tắc'], ['vong', 16, 'ring', 'vòng'], ['luoi', [4, 4], 'grid (mesh)', 'lưới'],
  ['torus', [4, 4], 'double torus', 'torus kép'], ['lapphuong', 4, '4D hypercube', 'siêu khối 4D'],
];</code></pre></details>
<p>Đọc nó như dân kỹ thuật: <strong>vòng</strong> rẻ nhất (16 liên kết) nhưng đường kính 8 bước và chỉ cần cắt 2 liên kết là nó đứt đôi; <strong>torus</strong> và <strong>siêu khối</strong> đều có đường kính 4 và bisection 8, nhưng siêu khối cần 4 liên kết ở mỗi nút dù có bao nhiêu nút, còn torus có bậc nhỏ cố định — ở 1024 nút, torus 32×32 có đường kính 32 so với 10 của siêu khối, và dây của siêu khối tăng theo log n. Một công tắc có đường kính 2 và bisection 8, nhưng chỉ vì một công tắc đó chở toàn bộ lưu lượng.</p>
<p>➕ Máy hiện đại: các GPU trong một server nối bằng <strong>NVLink</strong> qua <strong>NVSwitch</strong> (cấu trúc công tắc); siêu máy tính dùng mạng <em>fat tree</em> và <em>dragonfly</em>; trung tâm dữ liệu dùng mạng <em>leaf–spine</em> (mỗi switch đầu tủ nối với mọi switch spine — một crossbar nhỏ của các switch). Sáu kiểu của sách là vốn từ; máy thật kết hợp chúng.</p>
<p class="pitfall">⚠️ "Siêu khối" không phải vật 3D bạn dựng được: bản 4D ở đây được vẽ dưới dạng hình chiếu 3D. Đếm 16 đỉnh và 32 cạnh trong bảng để kiểm hình: k-khối có <code>2^k</code> nút và <code>k·2^(k−1)</code> liên kết (k = 4: 16 và 32).</p>`],
      [21, 'Interconnection Technology (2)',
        `<p class="y-chinh">🎯 Figure 8-17 — <strong>store-and-forward packet switching</strong>: a packet is sent from CPU 1 to CPU 2 through several four-port switches; each switch receives the <em>entire</em> packet, stores it, and only then forwards it to the next link. The alternatives are <strong>circuit switching</strong> (reserve the whole path first) and <strong>cut-through / wormhole routing</strong> (forward the front of the packet before the rest has arrived).</p>
<p>Store-and-forward is easy and robust: a switch can check the packet for errors before passing it on, and needs buffer space for one full packet. The cost is latency: the total time grows with <em>hops × packet time</em>. Cut-through splits the packet into small pieces (<em>flits</em>) and starts forwarding the first piece as soon as the address is read — the packet "flows like a worm" through the network, and the total time is about <em>packet time + hops × one flit time</em>. Measure the difference on four links with a 4-unit packet:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9dccf46da78327e627ddeb37c328955fb5836aca.svg" alt="Store-and-forward: each link carries the whole packet in turn — 16 units" loading="lazy" /><p class="chu-thich">🧮 Store-and-forward: each link carries the whole packet in turn — 16 units</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CAC_KIEU = [
  ['sao', 16, 'single switch', 'một công tắc'], ['vong', 16, 'ring', 'vòng'], ['luoi', [4, 4], 'grid (mesh)', 'lưới'],
  ['torus', [4, 4], 'double torus', 'torus kép'], ['lapphuong', 4, '4D hypercube', 'siêu khối 4D'],
];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9783436ab0abd8a60620b31b68cab3400ccf4a9c.svg" alt="Cut-through: flits overlap on the links — 7 units" loading="lazy" /><p class="chu-thich">🧮 Cut-through: flits overlap on the links — 7 units</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CAC_KIEU = [
  ['sao', 16, 'single switch', 'một công tắc'], ['vong', 16, 'ring', 'vòng'], ['luoi', [4, 4], 'grid (mesh)', 'lưới'],
  ['torus', [4, 4], 'double torus', 'torus kép'], ['lapphuong', 4, '4D hypercube', 'siêu khối 4D'],
];</code></pre></details>
<p>The formula: store-and-forward = <code>hops × T</code> = 4 × 4 = 16; cut-through = <code>T + (hops − 1) × t_flit</code> = 4 + 3 × 1 = 7. For a long path or a long packet the gap is large. The price of cut-through: a switch cannot check the whole packet first, and a blocked head blocks everything behind it — the reason some systems add <em>virtual channels</em>.</p>
<p>➕ The Internet itself is store-and-forward (each router receives a whole packet), but a modern Ethernet switch can start forwarding after reading the destination address (cut-through mode) to cut microseconds off — important for high-frequency trading and for RDMA/InfiniBand fabrics in clusters.</p>
<div class="callout">🧭 On a real server: this is why a 1 KB request over 4 router hops is not "4 times the transmission time" in practice — transmission delay is dwarfed by propagation (light in fibre moves about 200,000 km/s, so 1,000 km costs ~5 ms one way) and queueing. The two numbers a backend engineer feels are <strong>bandwidth</strong> (how much per second) and <strong>round-trip time</strong> (how long a question takes to be answered).</div>`,
        `<p class="y-chinh">🎯 Hình 8-17 — <strong>chuyển mạch gói kiểu store-and-forward</strong>: một gói được gửi từ CPU 1 tới CPU 2 qua vài switch bốn cổng; mỗi switch nhận <em>cả</em> gói, lưu lại, rồi mới chuyển tiếp sang liên kết kế. Các lựa chọn khác là <strong>chuyển mạch kênh (circuit switching)</strong> (giữ chỗ cả đường trước) và <strong>định tuyến cut-through / wormhole</strong> (chuyển phần đầu gói đi trước khi phần còn lại tới).</p>
<p>Store-and-forward dễ và bền: switch kiểm được lỗi của gói trước khi chuyển tiếp, và chỉ cần bộ đệm cho một gói đầy đủ. Cái giá là độ trễ: tổng thời gian tăng theo <em>số bước × thời gian một gói</em>. Cut-through chẻ gói thành các mảnh nhỏ (<em>flit</em>) và bắt đầu chuyển mảnh đầu ngay khi đọc xong địa chỉ — gói "chảy như con sâu" qua mạng, và tổng thời gian khoảng <em>thời gian một gói + số bước × thời gian một flit</em>. Đo khác biệt trên bốn liên kết với gói 4 đơn vị:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7109db52c9ce148823880b476229d356e491ca8c.svg" alt="Store-and-forward: mỗi liên kết lần lượt chở cả gói — 16 đơn vị" loading="lazy" /><p class="chu-thich">🧮 Store-and-forward: mỗi liên kết lần lượt chở cả gói — 16 đơn vị</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CAC_KIEU = [
  ['sao', 16, 'single switch', 'một công tắc'], ['vong', 16, 'ring', 'vòng'], ['luoi', [4, 4], 'grid (mesh)', 'lưới'],
  ['torus', [4, 4], 'double torus', 'torus kép'], ['lapphuong', 4, '4D hypercube', 'siêu khối 4D'],
];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b895d53946facfd747edb4e22e71c0864d86c896.svg" alt="Cut-through: các flit chồng lên nhau trên các liên kết — 7 đơn vị" loading="lazy" /><p class="chu-thich">🧮 Cut-through: các flit chồng lên nhau trên các liên kết — 7 đơn vị</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CAC_KIEU = [
  ['sao', 16, 'single switch', 'một công tắc'], ['vong', 16, 'ring', 'vòng'], ['luoi', [4, 4], 'grid (mesh)', 'lưới'],
  ['torus', [4, 4], 'double torus', 'torus kép'], ['lapphuong', 4, '4D hypercube', 'siêu khối 4D'],
];</code></pre></details>
<p>Công thức: store-and-forward = <code>số bước × T</code> = 4 × 4 = 16; cut-through = <code>T + (số bước − 1) × t_flit</code> = 4 + 3 × 1 = 7. Với đường dài hay gói dài, chênh lệch lớn. Cái giá của cut-through: switch không kiểm được cả gói trước, và một đầu gói bị chặn sẽ chặn mọi thứ phía sau — lý do một số hệ thống thêm <em>kênh ảo (virtual channel)</em>.</p>
<p>➕ Bản thân Internet là store-and-forward (mỗi router nhận cả gói), nhưng một switch Ethernet hiện đại có thể bắt đầu chuyển tiếp sau khi đọc địa chỉ đích (chế độ cut-through) để bớt vài micro giây — quan trọng với giao dịch tần suất cao và với mạng RDMA/InfiniBand trong cluster.</p>
<div class="callout">🧭 Trên server thật: đó là lý do một yêu cầu 1 KB qua 4 chặng router trong thực tế không phải "4 lần thời gian truyền" — độ trễ truyền bị lấn át bởi độ trễ lan truyền (ánh sáng trong sợi quang đi khoảng 200.000 km/s, nên 1.000 km tốn ~5 ms một chiều) và xếp hàng. Hai con số kỹ sư backend cảm nhận được là <strong>băng thông</strong> (bao nhiêu mỗi giây) và <strong>thời gian khứ hồi (round-trip time)</strong> (một câu hỏi mất bao lâu để có trả lời).</div>`],
      [22, 'Network Interfaces',
        `<p class="y-chinh">🎯 Figure 8-18 — in a multicomputer every node has a <strong>network interface board</strong> plugged into its bus; it has its own RAM (and sometimes its own CPU). To send, the OS copies the message from user memory to the board's RAM; the board sends it through the switch; the receiving board puts it in its RAM; the receiving OS copies it into the receiver's memory.</p>
<p>The figure numbers five steps of a transfer between two user programs: (1) the sender's data are copied from user space into the interface board's RAM, (2) the board is told to send, (3) the packet crosses the switch, (4) the receiving board stores it, (5) it is copied up into the receiving program. Each <strong>copy</strong> is paid in CPU time and memory bandwidth — and with a fast network the copies, not the wire, become the bottleneck. The book's remedies: let the board read the user's buffer directly (DMA, Chapter 5), put a CPU on the board (a <em>smart NIC</em>) and avoid the extra kernel copy.</p>
<p>That battle was won in two stages. First, <strong>DMA + zero-copy</strong> (the <code>sendfile</code> of lesson 5.A: the kernel never copies file data into user space). Second, <strong>kernel bypass</strong>: RDMA network cards (InfiniBand, RoCE) let a program on machine A read or write memory on machine B without the CPU of B being involved at all — the closest real hardware gets to the "distributed shared memory" of slide 26. See what your OS shows of the network card — the "board" of the figure:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--network=bridge</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># The network interface of this machine: the "card" of Figures 8-18 and 8-28 as the OS shows it<br>
$ ip -br link | grep -E '^(lo|eth0)'<br>
lo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UNKNOWN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00:00:00:00 &lt;LOOPBACK,UP,LOWER_UP&gt;<br>
eth0@if667 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a2:42:09:53:0d:3f &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt;<br>
$ ip -br addr | grep -E '^(lo|eth0)'<br>
lo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UNKNOWN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;127.0.0.1/8 ::1/128<br>
eth0@if667 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;172.17.0.5/16<br>
# The route table: where do packets for other machines go? ("default via" = the router of Figure 8-29)<br>
$ ip route<br>
default via 172.17.0.1 dev eth0<br>
172.17.0.0/16 dev eth0 proto kernel scope link src 172.17.0.5<br>
# Counters kept by the driver: how many frames and bytes crossed the card<br>
$ ip -s link show eth0 | head -4<br>
11: eth0@if667: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 65535 qdisc noqueue state UP mode DEFAULT group default<br>
&nbsp;&nbsp;&nbsp;&nbsp;link/ether a2:42:09:53:0d:3f brd ff:ff:ff:ff:ff:ff link-netnsid 0<br>
&nbsp;&nbsp;&nbsp;&nbsp;RX: &nbsp;bytes packets errors dropped &nbsp;missed &nbsp;&nbsp;mcast<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;152 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
# Sockets in LISTEN state: which TCP ports does this machine serve? (none: nothing runs here)<br>
$ ss -tln<br>
State Recv-Q Send-Q Local Address:Port Peer Address:PortProcess</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>This is a container (<code>--network=bridge</code> for this one program, everything else in the lesson runs without network): it has one virtual card <code>eth0</code> plus the loopback <code>lo</code>; <code>ip route</code> shows a <code>default via</code> line — the first router of the Internet part of this lesson; the RX/TX counters are kept by the driver. IP and MAC addresses are masked in the comparison because they change at every run; the cached output above is one real run. The listing at the end shows <em>no</em> listening TCP port: nothing serves anything yet.</p>
<p class="pitfall">⚠️ The "copies" of the figure are <em>not</em> a Linux bug: they exist in every OS unless the program asks for zero-copy or DMA directly into its buffer. A Node.js <code>socket.write()</code> already costs one copy into the kernel's socket buffer.</p>`,
        `<p class="y-chinh">🎯 Hình 8-18 — trong multicomputer, mỗi nút có một <strong>bo giao diện mạng (network interface board)</strong> cắm vào bus của nó; bo có RAM riêng (đôi khi cả CPU riêng). Để gửi, HĐH chép thông điệp từ bộ nhớ người dùng vào RAM của bo; bo gửi nó qua switch; bo nhận đặt nó vào RAM của mình; HĐH bên nhận chép nó vào bộ nhớ của bên nhận.</p>
<p>Hình đánh số năm bước của một lần chuyển giữa hai chương trình người dùng: (1) dữ liệu của bên gửi được chép từ không gian người dùng vào RAM của bo giao diện, (2) bo được báo gửi, (3) gói qua switch, (4) bo nhận lưu nó, (5) nó được chép lên chương trình nhận. Mỗi lần <strong>sao chép</strong> tốn thời gian CPU và băng thông bộ nhớ — và với mạng nhanh, chính các lần sao chép chứ không phải dây dẫn trở thành nút cổ chai. Cách chữa của sách: để bo đọc thẳng bộ đệm của người dùng (DMA, Chương 5), đặt một CPU lên bo (<em>smart NIC</em>) và tránh lần sao chép thừa trong nhân.</p>
<p>Cuộc chiến đó thắng qua hai giai đoạn. Một, <strong>DMA + zero-copy</strong> (<code>sendfile</code> ở bài 5.A: nhân không bao giờ chép dữ liệu tệp vào không gian người dùng). Hai, <strong>kernel bypass</strong>: card mạng RDMA (InfiniBand, RoCE) cho một chương trình trên máy A đọc hay ghi bộ nhớ trên máy B mà CPU của B hoàn toàn không tham gia — thứ gần nhất phần cứng thật tới "bộ nhớ chia sẻ phân tán" ở slide 26. Xem HĐH của bạn hiện gì về card mạng — "bo" của hình:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--network=bridge</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Giao diện mạng của máy này: "card" của Hình 8-18 và 8-28 như HĐH hiện ra<br>
$ ip -br link | grep -E '^(lo|eth0)'<br>
lo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UNKNOWN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00:00:00:00 &lt;LOOPBACK,UP,LOWER_UP&gt;<br>
eth0@if667 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a2:42:09:53:0d:3f &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt;<br>
$ ip -br addr | grep -E '^(lo|eth0)'<br>
lo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UNKNOWN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;127.0.0.1/8 ::1/128<br>
eth0@if667 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;172.17.0.5/16<br>
# Bảng định tuyến: gói gửi máy khác đi đâu? ("default via" = router của Hình 8-29)<br>
$ ip route<br>
default via 172.17.0.1 dev eth0<br>
172.17.0.0/16 dev eth0 proto kernel scope link src 172.17.0.5<br>
# Bộ đếm do driver giữ: bao nhiêu khung và byte đã đi qua card<br>
$ ip -s link show eth0 | head -4<br>
11: eth0@if667: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 65535 qdisc noqueue state UP mode DEFAULT group default<br>
&nbsp;&nbsp;&nbsp;&nbsp;link/ether a2:42:09:53:0d:3f brd ff:ff:ff:ff:ff:ff link-netnsid 0<br>
&nbsp;&nbsp;&nbsp;&nbsp;RX: &nbsp;bytes packets errors dropped &nbsp;missed &nbsp;&nbsp;mcast<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;152 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
# Socket đang NGHE: máy này phục vụ cổng TCP nào? (không có: chẳng gì chạy ở đây)<br>
$ ss -tln<br>
State Recv-Q Send-Q Local Address:Port Peer Address:PortProcess</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Đây là một container (<code>--network=bridge</code> riêng cho chương trình này, mọi thứ khác trong bài chạy không có mạng): nó có một card ảo <code>eth0</code> cùng loopback <code>lo</code>; <code>ip route</code> hiện dòng <code>default via</code> — router đầu tiên của phần Internet trong bài này; các bộ đếm RX/TX do driver giữ. Địa chỉ IP và MAC bị che khi so sánh vì mỗi lần chạy đổi; output lưu ở trên là một lần chạy thật. Danh sách cuối cho thấy <em>không</em> có cổng TCP nào đang nghe: chưa có gì phục vụ gì cả.</p>
<p class="pitfall">⚠️ Các "lần sao chép" của hình <em>không</em> phải lỗi của Linux: chúng có ở mọi HĐH trừ khi chương trình xin zero-copy hay DMA thẳng vào bộ đệm của mình. Một <code>socket.write()</code> của Node.js đã tốn một lần chép vào bộ đệm socket của nhân.</p>`],
      [23, 'Blocking versus Nonblocking Calls (1)',
        `<p class="y-chinh">🎯 Figure 8-19 — (a) a <strong>blocking send</strong>: the sender traps into the kernel and is blocked until the whole message has been sent; (b) a <strong>nonblocking send</strong>: the call returns as soon as the message has been <em>copied to a kernel buffer</em>, and the sender runs on while the message is on its way.</p>
<p>Programs communicate through two primitives, <code>send</code> and <code>receive</code>. The question of this slide is <em>when does <code>send</code> return?</em> With a <strong>blocking</strong> call the answer is "when it is safe to reuse the buffer" — simple, but the program waits for the slow network. With a <strong>nonblocking</strong> call it returns at once — the program can compute during transmission — but then <em>who owns the buffer?</em> The book's next slide lists the options; the starting point is the kernel buffer in the figure.</p>
<p>You can see that kernel buffer. A pipe is a message channel between two processes; its kernel buffer is a fixed size. The program below fills it with a <strong>nonblocking</strong> sender while nobody reads, then does the same with a <strong>blocking</strong> sender:</p>
<pre><code class="language-c">// Figure 8-19: a NONBLOCKING send returns at once; the kernel buffer is where the message waits
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;signal.h&gt;

static void on_alarm(int s) { (void)s; const char m[] = "blocking send: still stuck after 1 second -&gt; the sender was blocked\\n"; write(1, m, sizeof m - 1); _exit(0); }

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);                            // the alarm handler exits without flushing
    int fd[2];
    pipe(fd);                                                    // fd[1] = send end, nobody reads fd[0]
    printf("kernel buffer of the pipe: %d bytes\\n", fcntl(fd[1], F_GETPIPE_SZ));
    fcntl(fd[1], F_SETFL, O_NONBLOCK);                           // nonblocking send
    char chunk[4096]; memset(chunk, 'x', sizeof chunk);
    long total = 0;
    for (;;) {
        ssize_t n = write(fd[1], chunk, sizeof chunk);
        if (n &lt; 0) { printf("accepted %ld bytes, then write() failed: %s (EAGAIN)\\n", total, strerror(errno)); break; }
        total += n;
    }
    // Now the same send, BLOCKING: the kernel buffer is full and nobody reads, so the sender sleeps
    fcntl(fd[1], F_SETFL, 0);
    signal(SIGALRM, on_alarm); alarm(1);
    write(fd[1], chunk, sizeof chunk);
    printf("not reached\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread thong-diep.c -o thong-diep &amp;&amp; ./thong-diep<br>
kernel buffer of the pipe: 65536 bytes<br>
accepted 65536 bytes, then write() failed: Resource temporarily unavailable (EAGAIN)<br>
blocking send: still stuck after 1 second -&gt; the sender was blocked</div>
<p>The kernel holds exactly 65,536 bytes for this pipe (16 pages — the default on Linux, <code>man 7 pipe</code>). The nonblocking <code>write</code> keeps being accepted until that buffer is full and then returns the error <code>EAGAIN</code> ("try again later") immediately — the program stays in control. The blocking <code>write</code> against a full buffer simply <em>sleeps</em>: after one second our alarm fired and proved the sender had been stuck all along. Same semantics as the book's figure: blocking = wait; nonblocking = the kernel buffer takes the message, and when the buffer is full you must handle it yourself.</p>
<div class="callout">🧭 On a real server: Node.js is entirely built on nonblocking sends: when <code>socket.write()</code> returns <code>false</code> the kernel buffer (and Node's own) is full — that is "backpressure", and a server that ignores it buffers unbounded data in RAM until it is killed by the OOM killer (lesson 3). Java NIO <code>SocketChannel.write</code> in non-blocking mode returns the number of bytes accepted — possibly zero. <code>epoll</code> then tells you when the buffer has room again.</div>
<p class="pitfall">⚠️ FE6#36 / FE8#36 / FE11#37 / FE14#39 / FE15#37: "<em>blocking</em> refers to the process of <strong>stopping a process until an I/O operation is completed</strong>" — the same word, the same meaning, as in this slide's blocking send.</p>`,
        `<p class="y-chinh">🎯 Hình 8-19 — (a) <strong>gửi chặn (blocking send)</strong>: bên gửi bẫy vào nhân và bị chặn tới khi cả thông điệp đã được gửi đi; (b) <strong>gửi không chặn (nonblocking send)</strong>: lời gọi trả về ngay khi thông điệp đã được <em>chép vào bộ đệm nhân</em>, và bên gửi chạy tiếp trong lúc thông điệp đang trên đường.</p>
<p>Chương trình giao tiếp qua hai nguyên thủy, <code>send</code> và <code>receive</code>. Câu hỏi của slide này là <em><code>send</code> trả về khi nào?</em> Với lời gọi <strong>chặn</strong>, đáp án là "khi đã an toàn để dùng lại bộ đệm" — đơn giản, nhưng chương trình chờ mạng chậm. Với lời gọi <strong>không chặn</strong> nó trả về ngay — chương trình tính toán được trong lúc truyền — nhưng khi đó <em>ai sở hữu bộ đệm?</em> Slide kế của sách liệt kê các phương án; điểm khởi đầu là bộ đệm nhân trong hình.</p>
<p>Bạn thấy được bộ đệm nhân đó. Pipe là một kênh thông điệp giữa hai tiến trình; bộ đệm nhân của nó có cỡ cố định. Chương trình dưới đây làm đầy nó bằng bên gửi <strong>không chặn</strong> trong khi không ai đọc, rồi làm y vậy với bên gửi <strong>chặn</strong>:</p>
<pre><code class="language-c">// Hình 8-19: lời gọi gửi KHÔNG CHẶN trả về ngay; bộ đệm của nhân là nơi thông điệp chờ
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;signal.h&gt;

static void on_alarm(int s) { (void)s; const char m[] = "blocking send: still stuck after 1 second -&gt; the sender was blocked\\n"; write(1, m, sizeof m - 1); _exit(0); }

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);                            // bộ xử lý báo thức thoát mà không xả bộ đệm
    int fd[2];
    pipe(fd);                                                    // fd[1] = đầu gửi, không ai đọc fd[0]
    printf("kernel buffer of the pipe: %d bytes\\n", fcntl(fd[1], F_GETPIPE_SZ));
    fcntl(fd[1], F_SETFL, O_NONBLOCK);                           // gửi không chặn
    char chunk[4096]; memset(chunk, 'x', sizeof chunk);
    long total = 0;
    for (;;) {
        ssize_t n = write(fd[1], chunk, sizeof chunk);
        if (n &lt; 0) { printf("accepted %ld bytes, then write() failed: %s (EAGAIN)\\n", total, strerror(errno)); break; }
        total += n;
    }
    // Giờ cũng lời gửi đó nhưng CHẶN: bộ đệm nhân đầy và không ai đọc nên bên gửi ngủ
    fcntl(fd[1], F_SETFL, 0);
    signal(SIGALRM, on_alarm); alarm(1);
    write(fd[1], chunk, sizeof chunk);
    printf("not reached\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread thong-diep.c -o thong-diep &amp;&amp; ./thong-diep<br>
kernel buffer of the pipe: 65536 bytes<br>
accepted 65536 bytes, then write() failed: Resource temporarily unavailable (EAGAIN)<br>
blocking send: still stuck after 1 second -&gt; the sender was blocked</div>
<p>Nhân giữ đúng 65.536 byte cho pipe này (16 trang — mặc định của Linux, <code>man 7 pipe</code>). <code>write</code> không chặn được nhận cho tới khi bộ đệm đầy rồi trả lỗi <code>EAGAIN</code> ("thử lại sau") ngay lập tức — chương trình vẫn nắm quyền. <code>write</code> chặn vào bộ đệm đầy thì đơn giản <em>ngủ</em>: sau một giây báo thức của ta nổ và chứng minh bên gửi đã bị kẹt suốt. Cùng ngữ nghĩa với hình của sách: chặn = chờ; không chặn = bộ đệm nhân nhận thông điệp, và khi bộ đệm đầy thì bạn phải tự xử lý.</p>
<div class="callout">🧭 Trên server thật: Node.js được xây hoàn toàn trên gửi không chặn: khi <code>socket.write()</code> trả <code>false</code> thì bộ đệm nhân (và của riêng Node) đã đầy — đó là "backpressure", và một server phớt lờ nó sẽ đệm dữ liệu vô hạn trong RAM cho tới khi bị OOM killer giết (bài 3). <code>SocketChannel.write</code> của Java NIO ở chế độ không chặn trả số byte được nhận — có thể bằng không. <code>epoll</code> rồi báo cho bạn khi bộ đệm lại có chỗ.</div>
<p class="pitfall">⚠️ FE6#36 / FE8#36 / FE11#37 / FE14#39 / FE15#37: "<em>blocking</em> là <strong>quá trình dừng một tiến trình cho tới khi một thao tác I/O hoàn tất</strong>" — cùng từ, cùng nghĩa, như gửi chặn ở slide này.</p>`],
      [24, 'Blocking versus Nonblocking Calls (2)',
        `<p class="y-chinh">🎯 Four choices on the sending side: (1) <strong>blocking send</strong> — the CPU sits idle during transmission; (2) <strong>nonblocking send with copy</strong> — the CPU wastes time on the extra copy into a kernel buffer; (3) <strong>nonblocking send with interrupt</strong> — efficient but makes programming difficult; (4) <strong>copy on write</strong> — an extra copy is probably needed eventually.</p>
<p>Each choice answers the same worry — "the sender must not change the buffer while the message is still being sent" — at a different price. (1) Blocking removes the worry by making the sender wait; the price is idle CPU time (the book counts it against wasting a fast CPU). (2) Copying into the kernel's own buffer removes the worry — the program may reuse its memory at once — and costs CPU time and memory bandwidth for the copy: this is exactly what the pipe of slide 23 did. (3) Let the sender continue and <em>interrupt</em> it (a signal, a callback) when the buffer is free: no waste, but the program is now an event machine with race conditions between the main flow and the interrupt — "difficult to program". (4) Mark the buffer <em>copy-on-write</em>: send directly, and only if the program writes to the buffer while the message is on the wire does the OS copy the page first (Chapter 3). If the program does not touch the buffer, nothing is copied; if it does, the copy happens anyway.</p>
<p>The same four-way tradeoff has modern names. (1) is plain <code>write()</code> on a blocking socket; (2) is every default socket; (3) is <code>io_uring</code> (Linux 5.1+) or <code>aio</code>: you submit a send and are told later when it completed; (4) is <code>MSG_ZEROCOPY</code> on Linux (kernel 4.14+): the kernel pins the pages, and notifies you through the socket's error queue when you may reuse the buffer — it only pays off for large sends, because pinning and notifying cost too.</p>
<p>The <em>receive</em> side has the same pair: a blocking <code>receive</code> sleeps until a message arrives; a nonblocking one returns "nothing yet", and you either <em>poll</em> (check periodically) or are <em>interrupted</em>. A third form the book mentions, the <strong>pop-up thread</strong>, creates a new thread for each arriving message — that is how a thread-per-request web server (Tomcat's classic model) works, and why a flood of requests becomes a flood of threads.</p>
<div class="callout">🧭 On a real server: the choice between "one thread per connection with blocking I/O" (Spring MVC on Tomcat, classic Java servers) and "few threads with nonblocking I/O and an event loop" (Node.js, Netty, Spring WebFlux) is exactly choices (1)/(pop-up thread) versus (3). The first is simple to write and costs memory per thread; the second scales to tens of thousands of idle connections and costs programming complexity (callbacks, promises, back-pressure). Java 21's virtual threads give the simple style at the event loop's cost.</div>
<p class="meo">🧠 Blocking = simple + idle CPU. Nonblocking = busy CPU + hard programming. Zero-copy = fastest + only for big messages.</p>`,
        `<p class="y-chinh">🎯 Bốn lựa chọn ở phía gửi: (1) <strong>gửi chặn</strong> — CPU ngồi rảnh trong lúc truyền; (2) <strong>gửi không chặn có sao chép</strong> — CPU phí thời gian cho lần chép thừa vào bộ đệm nhân; (3) <strong>gửi không chặn với ngắt</strong> — hiệu quả nhưng lập trình khó; (4) <strong>sao chép khi ghi (copy on write)</strong> — nhiều khả năng rốt cuộc vẫn cần một lần chép thừa.</p>
<p>Mỗi lựa chọn trả lời cùng một mối lo — "bên gửi không được đổi bộ đệm khi thông điệp còn đang được gửi" — với một cái giá khác nhau. (1) Chặn gỡ mối lo bằng cách bắt bên gửi chờ; cái giá là CPU rảnh (sách tính đó là lãng phí một CPU nhanh). (2) Chép vào bộ đệm riêng của nhân gỡ mối lo — chương trình dùng lại bộ nhớ ngay — và tốn thời gian CPU cùng băng thông bộ nhớ cho lần chép: đúng là điều pipe ở slide 23 đã làm. (3) Cho bên gửi chạy tiếp và <em>ngắt</em> nó (một tín hiệu, một callback) khi bộ đệm đã rảnh: không phí, nhưng chương trình giờ là cỗ máy sự kiện có race condition giữa luồng chính và ngắt — "khó lập trình". (4) Đánh dấu bộ đệm <em>copy-on-write</em>: gửi thẳng, và chỉ nếu chương trình ghi vào bộ đệm lúc thông điệp còn trên dây thì HĐH mới chép trang trước (Chương 3). Nếu chương trình không đụng bộ đệm thì không chép gì; nếu có thì lần chép vẫn xảy ra.</p>
<p>Cùng sự đánh đổi bốn chiều đó có tên hiện đại. (1) là <code>write()</code> thường trên socket chặn; (2) là mọi socket mặc định; (3) là <code>io_uring</code> (Linux 5.1+) hay <code>aio</code>: bạn nộp một lệnh gửi và sau đó được báo khi nó xong; (4) là <code>MSG_ZEROCOPY</code> trên Linux (nhân 4.14+): nhân ghim các trang, và báo cho bạn qua hàng đợi lỗi của socket khi bạn được dùng lại bộ đệm — chỉ có lợi với lượt gửi lớn, vì ghim và báo cũng tốn.</p>
<p>Phía <em>nhận</em> có cùng một cặp: <code>receive</code> chặn ngủ tới khi có thông điệp; loại không chặn trả "chưa có gì", và bạn hoặc <em>hỏi vòng (poll)</em> (kiểm định kỳ) hoặc bị <em>ngắt</em>. Dạng thứ ba sách nhắc, <strong>luồng bật lên (pop-up thread)</strong>, tạo một luồng mới cho mỗi thông điệp tới — đó là cách một web server mỗi yêu cầu một luồng (mô hình cổ điển của Tomcat) hoạt động, và vì sao một lũ yêu cầu thành một lũ luồng.</p>
<div class="callout">🧭 Trên server thật: lựa chọn giữa "một luồng cho mỗi kết nối với I/O chặn" (Spring MVC trên Tomcat, server Java cổ điển) và "ít luồng với I/O không chặn và vòng lặp sự kiện" (Node.js, Netty, Spring WebFlux) chính là lựa chọn (1)/(luồng bật lên) so với (3). Loại đầu dễ viết và tốn bộ nhớ mỗi luồng; loại sau mở rộng tới hàng chục nghìn kết nối rảnh và tốn độ phức tạp lập trình (callback, promise, back-pressure). Luồng ảo (virtual thread) của Java 21 cho kiểu viết đơn giản với chi phí của vòng lặp sự kiện.</div>
<p class="meo">🧠 Chặn = đơn giản + CPU rảnh. Không chặn = CPU bận + lập trình khó. Zero-copy = nhanh nhất + chỉ cho thông điệp lớn.</p>`],
      [25, 'Remote Procedure Call',
        `<p class="y-chinh">🎯 Figure 8-20 — <strong>Remote Procedure Call (RPC)</strong> makes a call to a procedure on another machine look like an ordinary call. The caller calls a local <strong>client stub</strong>; the stub <em>marshals</em> (packs) the parameters into a message and sends it; on the server a <strong>server stub</strong> unpacks it and calls the real procedure; the result travels back the same way.</p>
<p>The idea (Birrell and Nelson, 1984) is to hide the network behind the oldest abstraction of all, the procedure call. The five steps of the figure: (1) the client calls the stub as if it were the procedure; (2) the stub packs the name and parameters into a message and asks the OS to send it; (3) the OS carries the message to the server's machine; (4) the server's OS hands it to the server stub; (5) the server stub unpacks the parameters and calls the real procedure — then the result returns by the same path in reverse.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/cf20b435b55a970cda3616605792b3bcc90b49d8.svg" alt="Figure 8-20 as a sequence diagram" loading="lazy" /><p class="chu-thich">🧩 Figure 8-20 as a sequence diagram</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 8-20: the path of ONE remote procedure call
title Figure 8-20 — one remote procedure call, there and back
participant "Client code" as CC
participant "Client stub" as CS
participant "Client OS / network" as CO
participant "Server OS / network" as SO
participant "Server stub" as SS
participant "Server procedure" as SP
CC -&gt; CS : 1. add(2, 3)  — looks like a local call
CS -&gt; CS : 2. marshal: pack name + parameters\\ninto one message
CS -&gt; CO : 2. system call: send
CO -&gt; SO : 3. the message crosses the network
SO -&gt; SS : 4. deliver to the server stub
SS -&gt; SS : 5. unmarshal the parameters
SS -&gt; SP : 5. call add(2, 3) for real
SP --&gt; SS : return 5
SS --&gt; SO : pack the result, send
SO --&gt; CO : the reply crosses the network
CO --&gt; CS : deliver
CS --&gt; CC : return 5  — as if nothing happened
note over CC, SP #FEF9C3 : the client code never sees a socket.\\nWhat it CANNOT hide: latency (100,000x a local call), the server being down,\\nthe network losing the request or the reply (did it run once? twice? never?).
@enduml</code></pre></details>
<p>To prove it is not magic, here are those stubs written from scratch in about forty lines of Node.js, with a real TCP socket on this machine. A JavaScript <code>Proxy</code> plays the client stub (any method name becomes a message); the server stub reads one JSON line, calls the real function and writes the answer:</p>
<pre><code class="language-javascript">// Figure 8-20: a remote procedure call, built from scratch in ~40 lines (client stub, server stub, real TCP socket)
import net from 'node:net';

// ---- the SERVER: the real procedures + the server stub (unpack, call, pack)
const procedures = {
  add: (a, b) =&gt; a + b,
  stock: (sku) =&gt; ({ sku, left: sku === 'A1' ? 7 : 0 }),
  boom: () =&gt; { throw new Error('out of stock'); },
};
const server = net.createServer((sock) =&gt; {
  let buf = '';
  sock.on('data', (chunk) =&gt; {
    buf += chunk;
    let i;
    while ((i = buf.indexOf('\\n')) &gt;= 0) {                      // one request per line
      const req = JSON.parse(buf.slice(0, i)); buf = buf.slice(i + 1);
      console.log(&#96;  [server stub] step 4-5: unpacked &#36;{JSON.stringify(req)}, calling the real procedure&#96;);
      let res;
      try { res = { id: req.id, ok: procedures[req.method](...req.args) }; }
      catch (e) { res = { id: req.id, err: e.message }; }
      sock.write(JSON.stringify(res) + '\\n');                   // step 6: pack the result and send it back
    }
  });
});
await new Promise((r) =&gt; server.listen(0, '127.0.0.1', r));
const { port } = server.address();

// ---- the CLIENT: the stub makes a remote call look like a local one
const sock = net.connect(port, '127.0.0.1');
await new Promise((r) =&gt; sock.once('connect', r));
let nextId = 1; const waiting = new Map(); let rbuf = '';
sock.on('data', (chunk) =&gt; {
  rbuf += chunk; let i;
  while ((i = rbuf.indexOf('\\n')) &gt;= 0) { const r = JSON.parse(rbuf.slice(0, i)); rbuf = rbuf.slice(i + 1); waiting.get(r.id)(r); }
});
const remote = new Proxy({}, { get: (_, method) =&gt; (...args) =&gt; new Promise((resolve, reject) =&gt; {
  const id = nextId++;
  console.log(&#96;  [client stub] step 1-2: pack &#36;{method}(&#36;{args.map((a) =&gt; JSON.stringify(a)).join(', ')}) as a message, send it&#96;);
  waiting.set(id, (r) =&gt; ('ok' in r ? resolve(r.ok) : reject(new Error(r.err))));
  sock.write(JSON.stringify({ id, method, args }) + '\\n');
}) });

console.log('call 1: remote.add(2, 3)');
console.log('  result:', await remote.add(2, 3));
console.log('call 2: remote.stock("A1")  (a result that is an object: it is copied, not shared)');
console.log('  result:', await remote.stock('A1'));
console.log('call 3: remote.boom()  (the server failed: the client sees an ERROR, not a crash)');
try { await remote.boom(); } catch (e) { console.log('  error:', e.message); }

// What a local call can never do: the other side vanishes
server.close(); sock.destroy();
const t0 = performance.now();
await new Promise((resolve) =&gt; { const c = net.connect(port, '127.0.0.1'); c.on('error', (e) =&gt; { console.log('call 4: server is gone -&gt;', e.code, '(a local call cannot fail like this)'); resolve(); }); });
console.log(&#96;  (the failure was detected after &#36;{(performance.now() - t0).toFixed(1)} ms)&#96;);</code></pre>
<div class="out">$ node rpc.js<br>
call 1: remote.add(2, 3)<br>
&nbsp;&nbsp;[client stub] step 1-2: pack add(2, 3) as a message, send it<br>
&nbsp;&nbsp;[server stub] step 4-5: unpacked {"id":1,"method":"add","args":[2,3]}, calling the real procedure<br>
&nbsp;&nbsp;result: 5<br>
call 2: remote.stock("A1") &nbsp;(a result that is an object: it is copied, not shared)<br>
&nbsp;&nbsp;[client stub] step 1-2: pack stock("A1") as a message, send it<br>
&nbsp;&nbsp;[server stub] step 4-5: unpacked {"id":2,"method":"stock","args":["A1"]}, calling the real procedure<br>
&nbsp;&nbsp;result: { sku: 'A1', left: 7 }<br>
call 3: remote.boom() &nbsp;(the server failed: the client sees an ERROR, not a crash)<br>
&nbsp;&nbsp;[client stub] step 1-2: pack boom() as a message, send it<br>
&nbsp;&nbsp;[server stub] step 4-5: unpacked {"id":3,"method":"boom","args":[]}, calling the real procedure<br>
&nbsp;&nbsp;error: out of stock<br>
call 4: server is gone -&gt; ECONNREFUSED (a local call cannot fail like this)<br>
&nbsp;&nbsp;(the failure was detected after 0.9 ms)</div>
<p>Calls 1–2 behave like local calls (note that the object in call 2 arrives as a <em>copy</em>). Call 3 shows the first lie of RPC: the server's exception had to be turned into an error message and re-thrown on the client. Call 4 is the lie that cannot be hidden: <strong>the other side can vanish</strong>. A local call never fails with "connection refused".</p>
<p>The book lists the problems that make RPC <em>not quite</em> transparent: <strong>pointer parameters</strong> (an address in the client means nothing in the server — the stub must copy what it points to, so the callee works on a copy); <strong>weakly typed languages</strong> (a stub cannot know how long an array is, or what <code>printf</code>'s arguments are); <strong>global variables</strong> cannot be shared; and <strong>failure</strong> — if no reply comes back, did the procedure run zero times, once or twice? <em>At-most-once</em> and <em>at-least-once</em> semantics are the choices, and the remedy for the second is an <strong>idempotent</strong> operation, one that can safely run twice.</p>
<div class="callout">🧭 On a real server: <strong>gRPC</strong> (Google, open source since 2015) is the modern RPC: you describe the procedures in a <code>.proto</code> file, a code generator writes the client and server stubs in Java, Go, Python, Node…, and messages travel over HTTP/2 in a compact binary format. A <strong>REST</strong> call is RPC in disguise: <code>POST /orders</code> is a procedure call whose stub is <code>fetch()</code> or <code>RestTemplate</code>. The book's problems are your daily bugs: a payment request that timed out — did the charge happen? That is why payment APIs (Stripe, PayPal) accept an <em>idempotency key</em>: send the same request twice, get charged once.</div>
<p class="pitfall">⚠️ "RPC hides the network" is true for syntax and false for behaviour. Latency is 10<sup>4</sup>–10<sup>5</sup> times a local call (slide 33 measures it), and partial failure exists. Designs that ignore this are the "distributed monolith".</p>`,
        `<p class="y-chinh">🎯 Hình 8-20 — <strong>Remote Procedure Call (RPC — gọi thủ tục từ xa)</strong> làm lời gọi một thủ tục trên máy khác trông như lời gọi thường. Bên gọi gọi một <strong>client stub</strong> cục bộ; stub <em>marshal</em> (đóng gói) các tham số vào một thông điệp và gửi đi; trên server, một <strong>server stub</strong> mở gói rồi gọi thủ tục thật; kết quả đi ngược lại theo cùng đường.</p>
<p>Ý tưởng (Birrell và Nelson, 1984) là giấu mạng sau trừu tượng cổ nhất, lời gọi thủ tục. Năm bước của hình: (1) client gọi stub như thể nó là thủ tục; (2) stub đóng gói tên và tham số vào một thông điệp và nhờ HĐH gửi đi; (3) HĐH chở thông điệp tới máy của server; (4) HĐH của server giao nó cho server stub; (5) server stub mở gói tham số và gọi thủ tục thật — rồi kết quả quay về theo đường ngược lại.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/cf20b435b55a970cda3616605792b3bcc90b49d8.svg" alt="Hình 8-20 dạng sơ đồ tuần tự" loading="lazy" /><p class="chu-thich">🧩 Hình 8-20 dạng sơ đồ tuần tự</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 8-20: đường đi của MỘT lời gọi thủ tục từ xa
title Figure 8-20 — one remote procedure call, there and back
participant "Client code" as CC
participant "Client stub" as CS
participant "Client OS / network" as CO
participant "Server OS / network" as SO
participant "Server stub" as SS
participant "Server procedure" as SP
CC -&gt; CS : 1. add(2, 3)  — looks like a local call
CS -&gt; CS : 2. marshal: pack name + parameters\\ninto one message
CS -&gt; CO : 2. system call: send
CO -&gt; SO : 3. the message crosses the network
SO -&gt; SS : 4. deliver to the server stub
SS -&gt; SS : 5. unmarshal the parameters
SS -&gt; SP : 5. call add(2, 3) for real
SP --&gt; SS : return 5
SS --&gt; SO : pack the result, send
SO --&gt; CO : the reply crosses the network
CO --&gt; CS : deliver
CS --&gt; CC : return 5  — as if nothing happened
note over CC, SP #FEF9C3 : the client code never sees a socket.\\nWhat it CANNOT hide: latency (100,000x a local call), the server being down,\\nthe network losing the request or the reply (did it run once? twice? never?).
@enduml</code></pre></details>
<p>Để chứng minh nó không phải ma thuật, đây là các stub đó viết từ số 0 trong khoảng bốn mươi dòng Node.js, với một socket TCP thật trên máy này. Một <code>Proxy</code> của JavaScript đóng vai client stub (tên phương thức nào cũng thành một thông điệp); server stub đọc một dòng JSON, gọi hàm thật và ghi câu trả lời:</p>
<pre><code class="language-javascript">// Hình 8-20: một lời gọi thủ tục từ xa, dựng từ số 0 trong ~40 dòng (client stub, server stub, socket TCP thật)
import net from 'node:net';

// ---- MÁY CHỦ: các thủ tục thật + server stub (mở gói, gọi, đóng gói)
const procedures = {
  add: (a, b) =&gt; a + b,
  stock: (sku) =&gt; ({ sku, left: sku === 'A1' ? 7 : 0 }),
  boom: () =&gt; { throw new Error('out of stock'); },
};
const server = net.createServer((sock) =&gt; {
  let buf = '';
  sock.on('data', (chunk) =&gt; {
    buf += chunk;
    let i;
    while ((i = buf.indexOf('\\n')) &gt;= 0) {                      // mỗi dòng một yêu cầu
      const req = JSON.parse(buf.slice(0, i)); buf = buf.slice(i + 1);
      console.log(&#96;  [server stub] step 4-5: unpacked &#36;{JSON.stringify(req)}, calling the real procedure&#96;);
      let res;
      try { res = { id: req.id, ok: procedures[req.method](...req.args) }; }
      catch (e) { res = { id: req.id, err: e.message }; }
      sock.write(JSON.stringify(res) + '\\n');                   // bước 6: đóng gói kết quả và gửi về
    }
  });
});
await new Promise((r) =&gt; server.listen(0, '127.0.0.1', r));
const { port } = server.address();

// ---- MÁY KHÁCH: stub làm lời gọi từ xa trông như lời gọi cục bộ
const sock = net.connect(port, '127.0.0.1');
await new Promise((r) =&gt; sock.once('connect', r));
let nextId = 1; const waiting = new Map(); let rbuf = '';
sock.on('data', (chunk) =&gt; {
  rbuf += chunk; let i;
  while ((i = rbuf.indexOf('\\n')) &gt;= 0) { const r = JSON.parse(rbuf.slice(0, i)); rbuf = rbuf.slice(i + 1); waiting.get(r.id)(r); }
});
const remote = new Proxy({}, { get: (_, method) =&gt; (...args) =&gt; new Promise((resolve, reject) =&gt; {
  const id = nextId++;
  console.log(&#96;  [client stub] step 1-2: pack &#36;{method}(&#36;{args.map((a) =&gt; JSON.stringify(a)).join(', ')}) as a message, send it&#96;);
  waiting.set(id, (r) =&gt; ('ok' in r ? resolve(r.ok) : reject(new Error(r.err))));
  sock.write(JSON.stringify({ id, method, args }) + '\\n');
}) });

console.log('call 1: remote.add(2, 3)');
console.log('  result:', await remote.add(2, 3));
console.log('call 2: remote.stock("A1")  (a result that is an object: it is copied, not shared)');
console.log('  result:', await remote.stock('A1'));
console.log('call 3: remote.boom()  (the server failed: the client sees an ERROR, not a crash)');
try { await remote.boom(); } catch (e) { console.log('  error:', e.message); }

// Điều lời gọi cục bộ không bao giờ gặp: bên kia biến mất
server.close(); sock.destroy();
const t0 = performance.now();
await new Promise((resolve) =&gt; { const c = net.connect(port, '127.0.0.1'); c.on('error', (e) =&gt; { console.log('call 4: server is gone -&gt;', e.code, '(a local call cannot fail like this)'); resolve(); }); });
console.log(&#96;  (the failure was detected after &#36;{(performance.now() - t0).toFixed(1)} ms)&#96;);</code></pre>
<div class="out">$ node rpc.js<br>
call 1: remote.add(2, 3)<br>
&nbsp;&nbsp;[client stub] step 1-2: pack add(2, 3) as a message, send it<br>
&nbsp;&nbsp;[server stub] step 4-5: unpacked {"id":1,"method":"add","args":[2,3]}, calling the real procedure<br>
&nbsp;&nbsp;result: 5<br>
call 2: remote.stock("A1") &nbsp;(a result that is an object: it is copied, not shared)<br>
&nbsp;&nbsp;[client stub] step 1-2: pack stock("A1") as a message, send it<br>
&nbsp;&nbsp;[server stub] step 4-5: unpacked {"id":2,"method":"stock","args":["A1"]}, calling the real procedure<br>
&nbsp;&nbsp;result: { sku: 'A1', left: 7 }<br>
call 3: remote.boom() &nbsp;(the server failed: the client sees an ERROR, not a crash)<br>
&nbsp;&nbsp;[client stub] step 1-2: pack boom() as a message, send it<br>
&nbsp;&nbsp;[server stub] step 4-5: unpacked {"id":3,"method":"boom","args":[]}, calling the real procedure<br>
&nbsp;&nbsp;error: out of stock<br>
call 4: server is gone -&gt; ECONNREFUSED (a local call cannot fail like this)<br>
&nbsp;&nbsp;(the failure was detected after 0.9 ms)</div>
<p>Lời gọi 1–2 hành xử như lời gọi cục bộ (để ý đối tượng ở lời gọi 2 tới nơi như một <em>bản sao</em>). Lời gọi 3 cho thấy lời nói dối đầu tiên của RPC: ngoại lệ của server phải được đổi thành một thông điệp lỗi rồi ném lại ở client. Lời gọi 4 là lời nói dối không giấu được: <strong>bên kia có thể biến mất</strong>. Một lời gọi cục bộ không bao giờ lỗi "connection refused".</p>
<p>Sách liệt kê các vấn đề làm RPC <em>không hẳn</em> trong suốt: <strong>tham số con trỏ</strong> (một địa chỉ ở client vô nghĩa ở server — stub phải chép thứ nó trỏ tới, nên bên được gọi làm việc trên bản sao); <strong>ngôn ngữ kiểu yếu</strong> (stub không biết mảng dài bao nhiêu, hay đối số của <code>printf</code> là gì); <strong>biến toàn cục</strong> không chia sẻ được; và <strong>thất bại</strong> — nếu không có trả lời về, thủ tục đã chạy không lần nào, một lần hay hai lần? <em>At-most-once</em> và <em>at-least-once</em> là các lựa chọn, và thuốc chữa cho loại sau là thao tác <strong>luỹ đẳng (idempotent)</strong>, tức chạy hai lần vẫn an toàn.</p>
<div class="callout">🧭 Trên server thật: <strong>gRPC</strong> (Google, mã nguồn mở từ 2015) là RPC hiện đại: bạn mô tả các thủ tục trong tệp <code>.proto</code>, bộ sinh mã viết client và server stub bằng Java, Go, Python, Node…, và thông điệp đi qua HTTP/2 ở dạng nhị phân gọn. Một lời gọi <strong>REST</strong> là RPC trá hình: <code>POST /orders</code> là lời gọi thủ tục mà stub của nó là <code>fetch()</code> hay <code>RestTemplate</code>. Các vấn đề của sách là lỗi hằng ngày của bạn: một yêu cầu thanh toán hết thời gian chờ — tiền đã bị trừ chưa? Vì thế các API thanh toán (Stripe, PayPal) nhận một <em>khoá luỹ đẳng (idempotency key)</em>: gửi cùng yêu cầu hai lần, chỉ bị trừ một lần.</div>
<p class="pitfall">⚠️ "RPC giấu mạng" đúng về cú pháp và sai về hành vi. Độ trễ gấp 10<sup>4</sup>–10<sup>5</sup> lần một lời gọi cục bộ (slide 33 đo nó), và thất bại một phần là có thật. Thiết kế phớt lờ điều này là "monolith phân tán".</p>`],
      [26, 'Distributed Shared Memory (1)',
        `<p class="y-chinh">🎯 Figure 8-21 — <strong>Distributed Shared Memory (DSM)</strong> gives programmers the comfortable illusion of shared memory on a machine that has none. It can be built at three layers: (a) in the <strong>hardware</strong> (the NUMA directory of slides 8–9), (b) in the <strong>operating system</strong> (page faults move pages between machines — slides 27–30), or (c) in <strong>user-level software</strong> (a run-time library or language system).</p>
<p>Message passing (slides 23–25) is powerful but awkward: programmers must decide who sends what to whom. Shared memory is how people already think: "put the value in a variable, the other thread reads it". DSM tries to offer shared memory on top of message passing. The three layers trade <em>transparency</em> against <em>cost</em>: hardware is the fastest and the most expensive (slide 8's directory); the OS layer is transparent to every program (they just see a big address space) but pays a page fault and a network round trip for a miss; the library layer needs the programmer's cooperation (for instance declare which variables are shared) but can be smart — move whole objects, not whole pages.</p>
<p>The OS-layer version is the most instructive, because the mechanism you already know — <strong>virtual memory</strong> — is all it needs. Remember Chapter 3: a page that is not present causes a page fault; the kernel's handler finds the page (on disk) and maps it. In DSM the handler finds the page <em>on another machine</em>, fetches it over the network, maps it, and restarts the instruction. The program never knows. Modern Linux even gives user programs this power: <code>userfaultfd(2)</code> lets a program handle the page faults of a memory region itself — it is how QEMU's <em>post-copy live migration</em> pulls the memory of a moving virtual machine across the network on demand.</p>
<p class="meo">🧠 DSM = <em>virtual memory where "the disk" is another computer's RAM</em>.</p>
<p>The next slides show the idea as the book draws it, then <em>run</em> it: a real miniature DSM of two processes (two "machines") that faults, fetches and invalidates pages.</p>
<p class="pitfall">⚠️ DSM has been a research idea since the 1980s (Ivy, Munin, TreadMarks) and almost never reached production systems as a general mechanism — the reasons are slide 30. What survives are its parts: userfaultfd migration, RDMA-based remote memory, and distributed caches (Redis, Hazelcast) that are shared memory <em>by explicit API</em>, not by illusion.</p>`,
        `<p class="y-chinh">🎯 Hình 8-21 — <strong>Bộ nhớ chia sẻ phân tán (Distributed Shared Memory — DSM)</strong> cho lập trình viên ảo giác dễ chịu về bộ nhớ chung trên một máy không có nó. Có thể xây ở ba tầng: (a) trong <strong>phần cứng</strong> (thư mục NUMA ở slide 8–9), (b) trong <strong>hệ điều hành</strong> (lỗi trang chuyển trang giữa các máy — slide 27–30), hoặc (c) trong <strong>phần mềm mức người dùng</strong> (một thư viện chạy hay hệ ngôn ngữ).</p>
<p>Truyền thông điệp (slide 23–25) mạnh nhưng vụng: lập trình viên phải quyết ai gửi gì cho ai. Bộ nhớ chung là cách người ta vốn đã nghĩ: "đặt giá trị vào một biến, luồng kia đọc". DSM cố cung cấp bộ nhớ chung phía trên truyền thông điệp. Ba tầng đánh đổi <em>độ trong suốt</em> với <em>chi phí</em>: phần cứng nhanh nhất và đắt nhất (thư mục ở slide 8); tầng HĐH trong suốt với mọi chương trình (chúng chỉ thấy một không gian địa chỉ lớn) nhưng trả một lỗi trang và một vòng đi-về qua mạng cho mỗi lần trượt; tầng thư viện cần lập trình viên hợp tác (ví dụ khai báo biến nào được chia sẻ) nhưng có thể khôn — chuyển cả đối tượng, không phải cả trang.</p>
<p>Bản ở tầng HĐH là bản đáng học nhất, vì cơ chế bạn đã biết — <strong>bộ nhớ ảo</strong> — là tất cả những gì nó cần. Nhớ Chương 3: trang không có mặt gây lỗi trang; bộ xử lý của nhân tìm trang (trên đĩa) và ánh xạ nó. Ở DSM, bộ xử lý tìm trang <em>trên một máy khác</em>, kéo nó qua mạng, ánh xạ, rồi chạy lại lệnh. Chương trình không bao giờ biết. Linux hiện đại còn trao sức mạnh này cho chương trình người dùng: <code>userfaultfd(2)</code> cho một chương trình tự xử lý lỗi trang của một vùng nhớ — đó là cách <em>di chuyển trực tiếp post-copy</em> của QEMU kéo bộ nhớ của một máy ảo đang di chuyển qua mạng theo yêu cầu.</p>
<p class="meo">🧠 DSM = <em>bộ nhớ ảo mà "cái đĩa" là RAM của một máy tính khác</em>.</p>
<p>Các slide sau cho thấy ý tưởng như sách vẽ, rồi <em>chạy</em> nó: một DSM thu nhỏ thật gồm hai tiến trình (hai "máy") gây lỗi, kéo và vô hiệu các trang.</p>
<p class="pitfall">⚠️ DSM là ý tưởng nghiên cứu từ thập niên 1980 (Ivy, Munin, TreadMarks) và hầu như chưa bao giờ vào hệ thống sản xuất như một cơ chế tổng quát — lý do ở slide 30. Cái còn sống là các bộ phận của nó: di chuyển userfaultfd, bộ nhớ từ xa dựa trên RDMA, và cache phân tán (Redis, Hazelcast) là bộ nhớ chung <em>bằng API tường minh</em>, không bằng ảo giác.</p>`],
      [27, 'Distributed Shared Memory (2)',
        `<p class="y-chinh">🎯 Figure 8-22(a) — a globally shared virtual address space of <strong>16 pages</strong> is spread over four machines: CPU 0 holds pages 0, 2, 5, 9; CPU 1 holds 1, 3, 6, 8, 10; CPU 2 holds 4, 7, 11, 12, 14; CPU 3 holds 13, 15. Each page lives in the RAM of exactly one machine; the network joins them.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8f543d720ee3ac5d17ff1fdc9052a392a99f9f58.svg" alt="Figure 8-22(a) redrawn from the model" loading="lazy" /><p class="chu-thich">🧮 Figure 8-22(a) redrawn from the model</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const NHAN_BAN = { chuyen: false, 'nhan-ban': true };</code></pre></details>
<p>When a program on CPU 0 touches page 10, the MMU finds no mapping for it (it is not in CPU 0's RAM) and raises a <strong>page fault</strong>. The DSM handler asks "who has page 10?" (the book describes a central <em>manager</em> or a hash of the page number to find the owner), asks CPU 1 for it, and CPU 1 sends 4 KB across the network. The handler maps the page into CPU 0's address space and returns; the faulting instruction runs again and succeeds. What the program experienced is a slow memory read.</p>
<p>The next block is <em>not</em> a simulation of the idea — it is the idea itself in about 100 lines of C. Two processes play "node 0" and "node 1", each maps its own copy of the shared region, and <strong>page protection is the state</strong>: <code>PROT_NONE</code> = Invalid (no copy here), <code>PROT_READ</code> = Shared (a read-only copy), <code>PROT_READ|PROT_WRITE</code> = Modified (the only valid copy). A <code>SIGSEGV</code> handler plays the page-fault handler: it asks the other process over a socket, installs the page and returns. A helper thread in each process answers the other's requests. Watch scenario 0 first — it replays Figure 8-22:</p>
<pre><code class="language-c">// A miniature Distributed Shared Memory (Figures 8-21c, 8-22, 8-23): two PROCESSES = two "machines"
// The trick is the real one: page protection = state. PROT_NONE = INVALID, PROT_READ = SHARED, PROT_READ|PROT_WRITE = MODIFIED
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;stdarg.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;
#include &lt;ucontext.h&gt;
#include &lt;sys/mman.h&gt;
#include &lt;sys/socket.h&gt;
#include &lt;sys/wait.h&gt;
#ifdef __aarch64__
#include &lt;asm/sigcontext.h&gt;
#endif

#define RW (PROT_READ | PROT_WRITE)
enum { REQ_READ = 1, REQ_WRITE = 2 };
static long PG;
static char *region;
static int me, ask_fd, serve_fd, faults;
static int st[2];                                              // this node's state for each of the 2 pages
static const char *nm(int p) { return p == PROT_NONE ? "INVALID" : p == PROT_READ ? "SHARED" : "MODIFIED"; }

static void say(const char *fmt, ...) {
    char buf[200]; va_list ap; va_start(ap, fmt); int n = vsnprintf(buf, sizeof buf, fmt, ap); va_end(ap);
    write(1, buf, n);
}
static int read_full(int fd, char *p, long n) { long got = 0; while (got &lt; n) { long r = read(fd, p + got, n - got); if (r &lt;= 0) return (int)got; got += r; } return (int)got; }

static int fault_is_write(void *ctx) {                          // was the faulting instruction a store?
#if defined(__x86_64__)
    return (((ucontext_t *)ctx)-&gt;uc_mcontext.gregs[REG_ERR] &amp; 2) != 0;
#elif defined(__aarch64__)
    ucontext_t *uc = ctx; struct _aarch64_ctx *h = (struct _aarch64_ctx *)uc-&gt;uc_mcontext.__reserved;
    while (h-&gt;magic) { if (h-&gt;magic == ESR_MAGIC) return (int)((((struct esr_context *)h)-&gt;esr &gt;&gt; 6) &amp; 1); h = (struct _aarch64_ctx *)((char *)h + h-&gt;size); }
    return 0;
#else
    return 0;
#endif
}

// The fault handler IS the DSM client: ask the other node, install the page, return -&gt; the CPU re-runs the instruction
static void on_fault(int sig, siginfo_t *si, void *ctx) {
    (void)sig;
    int p = (int)(((char *)si-&gt;si_addr - region) / PG), wr = fault_is_write(ctx);
    char req[3] = { wr ? REQ_WRITE : REQ_READ, (char)p, st[p] != PROT_NONE };   // third byte: "I already hold a copy"
    faults++;
    say("node %d: FAULT on page %d (%s, page is %s) -&gt; asks node %d\\n", me, p, wr ? "write" : "read", nm(st[p]), 1 - me);
    write(ask_fd, req, 3);
    mprotect(region + p * PG, PG, RW);
    if (!req[2]) read_full(ask_fd, region + p * PG, PG); else { char k; read(ask_fd, &amp;k, 1); }
    st[p] = wr ? RW : PROT_READ;
    mprotect(region + p * PG, PG, st[p]);
    say("node %d: page %d is now %s\\n", me, p, nm(st[p]));
}

static void *server(void *arg) {                                // answers the OTHER node's requests
    (void)arg; char req[3];
    while (read_full(serve_fd, req, 3) == 3) {
        int p = req[1]; char *pg = region + p * PG;
        if (req[0] == REQ_READ) {
            if (st[p] == RW) { mprotect(pg, PG, PROT_READ); st[p] = PROT_READ; }         // owner keeps a READ copy: replication
            say("node %d: gives a copy of page %d to node %d, keeps it %s\\n", me, p, 1 - me, nm(st[p]));
        } else say("node %d: gives page %d to node %d and drops its own copy\\n", me, p, 1 - me);
        char *copy = NULL;                                                                   // snapshot first: the page may become unreadable below
        if (!req[2]) { copy = malloc(PG); memcpy(copy, pg, PG); }
        if (req[0] == REQ_WRITE) { mprotect(pg, PG, PROT_NONE); st[p] = PROT_NONE; }          // drop OUR copy BEFORE replying, or this node could still touch it after the requester went on
        if (!req[2]) { write(serve_fd, copy, PG); free(copy); } else write(serve_fd, "k", 1);
    }
    return NULL;
}

struct step { int node, write, page, off; };
static void run(int sc, const struct step *s, int n, int own0, int own1, const char *title) {
    int ask[2], tok0[2], tok1[2];
    socketpair(AF_UNIX, SOCK_STREAM, 0, ask); pipe(tok0); pipe(tok1);   // tok0: node0 -&gt; node1, tok1: node1 -&gt; node0
    int ask2[2]; socketpair(AF_UNIX, SOCK_STREAM, 0, ask2);
    printf("\\n== scenario %d: %s\\n", sc, title);
    pid_t pid = fork(); me = pid == 0;
    region = mmap(NULL, 2 * PG, RW, MAP_ANONYMOUS | MAP_PRIVATE, -1, 0);
    ask_fd = me ? ask2[0] : ask[0]; serve_fd = me ? ask[1] : ask2[1];     // node0 asks on ask[0], node1 serves on ask[1]; and vice versa
    int mine[2] = { own0, own1 };                                         // who owns page 0 / page 1 at the start
    for (int p = 0; p &lt; 2; p++) { st[p] = mine[p] == me ? RW : PROT_NONE; if (mine[p] == me) strcpy(region + p * PG, "page data"); mprotect(region + p * PG, PG, st[p]); }
    struct sigaction sa; memset(&amp;sa, 0, sizeof sa); sa.sa_sigaction = on_fault; sa.sa_flags = SA_SIGINFO; sigaction(SIGSEGV, &amp;sa, NULL);
    pthread_t th; pthread_create(&amp;th, NULL, server, NULL);
    faults = 0;
    int in = me ? tok0[0] : tok1[0], out = me ? tok1[1] : tok0[1]; char t = 't';
    for (int i = 0; i &lt; n; i++) {
        if (s[i].node == me) {
            volatile char *a = region + s[i].page * PG + s[i].off;
            if (s[i].write) { say("node %d: writes page %d, byte %d\\n", me, s[i].page, s[i].off); *a = (char)('A' + s[i].node); }
            else { char v = *a; say("node %d: reads page %d, byte %d = '%c'\\n", me, s[i].page, s[i].off, v); }
            write(out, &amp;t, 1);
        } else read(in, &amp;t, 1);
    }
    if (me) { char c = (char)faults; write(tok1[1], &amp;c, 1); _exit(0); }
    char c1 = 0; read(tok1[0], &amp;c1, 1);
    printf("scenario %d: total faults = %d for %d %s\\n", sc, faults + c1, n, sc == 0 ? "accesses" : "writes");
    wait(NULL);
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    PG = sysconf(_SC_PAGESIZE);
    printf("page size = %ld bytes; two nodes, two pages\\n", PG);
    // 0: Figure 8-22: node 1 owns page 0. Reading replicates it, writing moves it
    struct step s0[] = { {0,0,0,0}, {0,0,0,0}, {1,0,0,0}, {0,1,0,0}, {1,0,0,0} };
    run(0, s0, 5, 1, 1, "node 1 owns page 0: read (replicate), read again, write (move), read back");
    // 1: Figure 8-23: A and B are unrelated variables but live on the SAME page
    struct step s1[] = { {0,1,0,0}, {1,1,0,1}, {0,1,0,0}, {1,1,0,1}, {0,1,0,0}, {1,1,0,1} };
    run(1, s1, 6, 0, 0, "false sharing: A (node 0) and B (node 1) on the same page");
    // 2: the same six writes, A and B on separate pages, each owned by its writer
    struct step s2[] = { {0,1,0,0}, {1,1,1,0}, {0,1,0,0}, {1,1,1,0}, {0,1,0,0}, {1,1,1,0} };
    run(2, s2, 6, 0, 1, "the same writes, A and B on separate pages");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dsm-mini.c -o dsm-mini &amp;&amp; ./dsm-mini<br>
page size = 4096 bytes; two nodes, two pages<br>
<br>
== scenario 0: node 1 owns page 0: read (replicate), read again, write (move), read back<br>
node 0: FAULT on page 0 (read, page is INVALID) -&gt; asks node 1<br>
node 1: gives a copy of page 0 to node 0, keeps it SHARED<br>
node 0: page 0 is now SHARED<br>
node 0: reads page 0, byte 0 = 'p'<br>
node 0: reads page 0, byte 0 = 'p'<br>
node 1: reads page 0, byte 0 = 'p'<br>
node 0: writes page 0, byte 0<br>
node 0: FAULT on page 0 (write, page is SHARED) -&gt; asks node 1<br>
node 1: gives page 0 to node 0 and drops its own copy<br>
node 0: page 0 is now MODIFIED<br>
node 1: FAULT on page 0 (read, page is INVALID) -&gt; asks node 0<br>
node 0: gives a copy of page 0 to node 1, keeps it SHARED<br>
node 1: page 0 is now SHARED<br>
node 1: reads page 0, byte 0 = 'A'<br>
scenario 0: total faults = 3 for 5 accesses<br>
<br>
== scenario 1: false sharing: A (node 0) and B (node 1) on the same page<br>
node 0: writes page 0, byte 0<br>
node 1: writes page 0, byte 1<br>
node 1: FAULT on page 0 (write, page is INVALID) -&gt; asks node 0<br>
node 0: gives page 0 to node 1 and drops its own copy<br>
node 1: page 0 is now MODIFIED<br>
node 0: writes page 0, byte 0<br>
node 0: FAULT on page 0 (write, page is INVALID) -&gt; asks node 1<br>
node 1: gives page 0 to node 0 and drops its own copy<br>
node 0: page 0 is now MODIFIED<br>
node 1: writes page 0, byte 1<br>
node 1: FAULT on page 0 (write, page is INVALID) -&gt; asks node 0<br>
node 0: gives page 0 to node 1 and drops its own copy<br>
node 1: page 0 is now MODIFIED<br>
node 0: writes page 0, byte 0<br>
node 0: FAULT on page 0 (write, page is INVALID) -&gt; asks node 1<br>
node 1: gives page 0 to node 0 and drops its own copy<br>
node 0: page 0 is now MODIFIED<br>
node 1: writes page 0, byte 1<br>
node 1: FAULT on page 0 (write, page is INVALID) -&gt; asks node 0<br>
node 0: gives page 0 to node 1 and drops its own copy<br>
node 1: page 0 is now MODIFIED<br>
scenario 1: total faults = 5 for 6 writes<br>
<br>
== scenario 2: the same writes, A and B on separate pages<br>
node 0: writes page 0, byte 0<br>
node 1: writes page 1, byte 0<br>
node 0: writes page 0, byte 0<br>
node 1: writes page 1, byte 0<br>
node 0: writes page 0, byte 0<br>
node 1: writes page 1, byte 0<br>
scenario 2: total faults = 0 for 6 writes</div>
<p>Read the first scenario slowly. <strong>Node 0 reads page 0</strong> — never seen before (INVALID) — so a fault is raised, node 1 gives a copy and keeps its own, and now both hold it SHARED: <em>replication</em> (the situation of Figure 8-22c, next slide but one). The second read of node 0 costs nothing — no fault, no message: after the first miss the data are local. <strong>Node 0 writes</strong>: it holds a read-only copy so the write faults; node 1 must drop its copy (INVALID) and node 0 becomes the single MODIFIED owner — the page has <em>moved</em> (Figure 8-22b). When node 1 reads again, it faults and gets a copy back. The rules are the cache-coherence states of slide 3 (MESI) applied to pages and run in software.</p>
<p>➕ This program uses signals and <code>mprotect</code> only — no special kernel support. On x86 it learns whether the fault was a read or a write from the saved registers (<code>REG_ERR</code>), on ARM64 (this container) from the <em>ESR</em> register saved in the signal context, which is why the code has both branches. The page size is printed by the program: <code>sysconf(_SC_PAGESIZE)</code> = 4096 here, but Linux on some ARM64 machines (Apple's Asahi, some servers) uses 16 KB or 64 KB pages — the "unit of sharing" changes with it (slide 30).</p>
<p class="pitfall">⚠️ The book draws page <em>moves</em> between machines but not the <em>cost</em>: each fault above is two messages and a 4 KB transfer — at the time of an Ethernet round trip, thousands of times the cost of a local access (slide 33 measures this ratio).</p>`,
        `<p class="y-chinh">🎯 Hình 8-22(a) — một không gian địa chỉ ảo dùng chung toàn cục gồm <strong>16 trang</strong> được rải trên bốn máy: CPU 0 giữ trang 0, 2, 5, 9; CPU 1 giữ 1, 3, 6, 8, 10; CPU 2 giữ 4, 7, 11, 12, 14; CPU 3 giữ 13, 15. Mỗi trang sống trong RAM của đúng một máy; mạng nối chúng.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9a9d2f4ca319b53fcd14db478a0676acfb466572.svg" alt="Hình 8-22(a) vẽ lại từ mô hình" loading="lazy" /><p class="chu-thich">🧮 Hình 8-22(a) vẽ lại từ mô hình</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const NHAN_BAN = { chuyen: false, 'nhan-ban': true };</code></pre></details>
<p>Khi một chương trình trên CPU 0 đụng vào trang 10, MMU không thấy ánh xạ cho nó (nó không nằm trong RAM của CPU 0) và phát sinh <strong>lỗi trang</strong>. Bộ xử lý DSM hỏi "ai giữ trang 10?" (sách mô tả một <em>người quản lý</em> trung tâm hoặc băm số trang để tìm chủ), xin CPU 1, và CPU 1 gửi 4 KB qua mạng. Bộ xử lý ánh xạ trang vào không gian địa chỉ của CPU 0 rồi quay về; lệnh gây lỗi chạy lại và thành công. Chương trình trải nghiệm một lần đọc bộ nhớ chậm.</p>
<p>Khối kế tiếp <em>không</em> phải mô phỏng của ý tưởng — nó là chính ý tưởng trong khoảng 100 dòng C. Hai tiến trình đóng vai "nút 0" và "nút 1", mỗi bên ánh xạ bản riêng của vùng chung, và <strong>quyền bảo vệ trang chính là trạng thái</strong>: <code>PROT_NONE</code> = Invalid (không có bản ở đây), <code>PROT_READ</code> = Shared (bản chỉ đọc), <code>PROT_READ|PROT_WRITE</code> = Modified (bản hợp lệ duy nhất). Bộ xử lý <code>SIGSEGV</code> đóng vai bộ xử lý lỗi trang: nó hỏi tiến trình kia qua socket, nạp trang rồi quay về. Một luồng phụ trong mỗi tiến trình trả lời yêu cầu của bên kia. Xem kịch bản 0 trước — nó phát lại Hình 8-22:</p>
<pre><code class="language-c">// Một Bộ nhớ chia sẻ phân tán thu nhỏ (Hình 8-21c, 8-22, 8-23): hai TIẾN TRÌNH = hai "máy"
// Mẹo là thật: quyền của trang = trạng thái. PROT_NONE = INVALID, PROT_READ = SHARED, PROT_READ|PROT_WRITE = MODIFIED
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;stdarg.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;
#include &lt;ucontext.h&gt;
#include &lt;sys/mman.h&gt;
#include &lt;sys/socket.h&gt;
#include &lt;sys/wait.h&gt;
#ifdef __aarch64__
#include &lt;asm/sigcontext.h&gt;
#endif

#define RW (PROT_READ | PROT_WRITE)
enum { REQ_READ = 1, REQ_WRITE = 2 };
static long PG;
static char *region;
static int me, ask_fd, serve_fd, faults;
static int st[2];                                              // trạng thái của node này với từng trong 2 trang
static const char *nm(int p) { return p == PROT_NONE ? "INVALID" : p == PROT_READ ? "SHARED" : "MODIFIED"; }

static void say(const char *fmt, ...) {
    char buf[200]; va_list ap; va_start(ap, fmt); int n = vsnprintf(buf, sizeof buf, fmt, ap); va_end(ap);
    write(1, buf, n);
}
static int read_full(int fd, char *p, long n) { long got = 0; while (got &lt; n) { long r = read(fd, p + got, n - got); if (r &lt;= 0) return (int)got; got += r; } return (int)got; }

static int fault_is_write(void *ctx) {                          // lệnh gây lỗi là lệnh ghi?
#if defined(__x86_64__)
    return (((ucontext_t *)ctx)-&gt;uc_mcontext.gregs[REG_ERR] &amp; 2) != 0;
#elif defined(__aarch64__)
    ucontext_t *uc = ctx; struct _aarch64_ctx *h = (struct _aarch64_ctx *)uc-&gt;uc_mcontext.__reserved;
    while (h-&gt;magic) { if (h-&gt;magic == ESR_MAGIC) return (int)((((struct esr_context *)h)-&gt;esr &gt;&gt; 6) &amp; 1); h = (struct _aarch64_ctx *)((char *)h + h-&gt;size); }
    return 0;
#else
    return 0;
#endif
}

// Bộ xử lý lỗi CHÍNH LÀ client DSM: hỏi node kia, nạp trang, quay về -&gt; CPU chạy lại lệnh
static void on_fault(int sig, siginfo_t *si, void *ctx) {
    (void)sig;
    int p = (int)(((char *)si-&gt;si_addr - region) / PG), wr = fault_is_write(ctx);
    char req[3] = { wr ? REQ_WRITE : REQ_READ, (char)p, st[p] != PROT_NONE };   // byte thứ ba: "tôi đã có một bản"
    faults++;
    say("node %d: FAULT on page %d (%s, page is %s) -&gt; asks node %d\\n", me, p, wr ? "write" : "read", nm(st[p]), 1 - me);
    write(ask_fd, req, 3);
    mprotect(region + p * PG, PG, RW);
    if (!req[2]) read_full(ask_fd, region + p * PG, PG); else { char k; read(ask_fd, &amp;k, 1); }
    st[p] = wr ? RW : PROT_READ;
    mprotect(region + p * PG, PG, st[p]);
    say("node %d: page %d is now %s\\n", me, p, nm(st[p]));
}

static void *server(void *arg) {                                // trả lời yêu cầu của node KIA
    (void)arg; char req[3];
    while (read_full(serve_fd, req, 3) == 3) {
        int p = req[1]; char *pg = region + p * PG;
        if (req[0] == REQ_READ) {
            if (st[p] == RW) { mprotect(pg, PG, PROT_READ); st[p] = PROT_READ; }         // chủ giữ lại một bản ĐỌC: nhân bản
            say("node %d: gives a copy of page %d to node %d, keeps it %s\\n", me, p, 1 - me, nm(st[p]));
        } else say("node %d: gives page %d to node %d and drops its own copy\\n", me, p, 1 - me);
        char *copy = NULL;                                                                   // chụp trước: trang sắp thành không đọc được ở dưới
        if (!req[2]) { copy = malloc(PG); memcpy(copy, pg, PG); }
        if (req[0] == REQ_WRITE) { mprotect(pg, PG, PROT_NONE); st[p] = PROT_NONE; }          // bỏ bản của TA TRƯỚC khi trả lời, nếu không node này còn đụng được nó sau khi bên xin đã đi tiếp
        if (!req[2]) { write(serve_fd, copy, PG); free(copy); } else write(serve_fd, "k", 1);
    }
    return NULL;
}

struct step { int node, write, page, off; };
static void run(int sc, const struct step *s, int n, int own0, int own1, const char *title) {
    int ask[2], tok0[2], tok1[2];
    socketpair(AF_UNIX, SOCK_STREAM, 0, ask); pipe(tok0); pipe(tok1);   // tok0: node0 -&gt; node1, tok1: node1 -&gt; node0
    int ask2[2]; socketpair(AF_UNIX, SOCK_STREAM, 0, ask2);
    printf("\\n== scenario %d: %s\\n", sc, title);
    pid_t pid = fork(); me = pid == 0;
    region = mmap(NULL, 2 * PG, RW, MAP_ANONYMOUS | MAP_PRIVATE, -1, 0);
    ask_fd = me ? ask2[0] : ask[0]; serve_fd = me ? ask[1] : ask2[1];     // node0 asks on ask[0], node1 serves on ask[1]; and vice versa
    int mine[2] = { own0, own1 };                                         // ai sở hữu trang 0 / trang 1 lúc đầu
    for (int p = 0; p &lt; 2; p++) { st[p] = mine[p] == me ? RW : PROT_NONE; if (mine[p] == me) strcpy(region + p * PG, "page data"); mprotect(region + p * PG, PG, st[p]); }
    struct sigaction sa; memset(&amp;sa, 0, sizeof sa); sa.sa_sigaction = on_fault; sa.sa_flags = SA_SIGINFO; sigaction(SIGSEGV, &amp;sa, NULL);
    pthread_t th; pthread_create(&amp;th, NULL, server, NULL);
    faults = 0;
    int in = me ? tok0[0] : tok1[0], out = me ? tok1[1] : tok0[1]; char t = 't';
    for (int i = 0; i &lt; n; i++) {
        if (s[i].node == me) {
            volatile char *a = region + s[i].page * PG + s[i].off;
            if (s[i].write) { say("node %d: writes page %d, byte %d\\n", me, s[i].page, s[i].off); *a = (char)('A' + s[i].node); }
            else { char v = *a; say("node %d: reads page %d, byte %d = '%c'\\n", me, s[i].page, s[i].off, v); }
            write(out, &amp;t, 1);
        } else read(in, &amp;t, 1);
    }
    if (me) { char c = (char)faults; write(tok1[1], &amp;c, 1); _exit(0); }
    char c1 = 0; read(tok1[0], &amp;c1, 1);
    printf("scenario %d: total faults = %d for %d %s\\n", sc, faults + c1, n, sc == 0 ? "accesses" : "writes");
    wait(NULL);
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    PG = sysconf(_SC_PAGESIZE);
    printf("page size = %ld bytes; two nodes, two pages\\n", PG);
    // 0: Hình 8-22: node 1 sở hữu trang 0. Đọc thì nhân bản, ghi thì di chuyển
    struct step s0[] = { {0,0,0,0}, {0,0,0,0}, {1,0,0,0}, {0,1,0,0}, {1,0,0,0} };
    run(0, s0, 5, 1, 1, "node 1 owns page 0: read (replicate), read again, write (move), read back");
    // 1: Hình 8-23: A và B là hai biến không liên quan nhưng nằm trên CÙNG một trang
    struct step s1[] = { {0,1,0,0}, {1,1,0,1}, {0,1,0,0}, {1,1,0,1}, {0,1,0,0}, {1,1,0,1} };
    run(1, s1, 6, 0, 0, "false sharing: A (node 0) and B (node 1) on the same page");
    // 2: cũng sáu lệnh ghi đó, A và B ở hai trang riêng, mỗi trang thuộc người ghi nó
    struct step s2[] = { {0,1,0,0}, {1,1,1,0}, {0,1,0,0}, {1,1,1,0}, {0,1,0,0}, {1,1,1,0} };
    run(2, s2, 6, 0, 1, "the same writes, A and B on separate pages");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dsm-mini.c -o dsm-mini &amp;&amp; ./dsm-mini<br>
page size = 4096 bytes; two nodes, two pages<br>
<br>
== scenario 0: node 1 owns page 0: read (replicate), read again, write (move), read back<br>
node 0: FAULT on page 0 (read, page is INVALID) -&gt; asks node 1<br>
node 1: gives a copy of page 0 to node 0, keeps it SHARED<br>
node 0: page 0 is now SHARED<br>
node 0: reads page 0, byte 0 = 'p'<br>
node 0: reads page 0, byte 0 = 'p'<br>
node 1: reads page 0, byte 0 = 'p'<br>
node 0: writes page 0, byte 0<br>
node 0: FAULT on page 0 (write, page is SHARED) -&gt; asks node 1<br>
node 1: gives page 0 to node 0 and drops its own copy<br>
node 0: page 0 is now MODIFIED<br>
node 1: FAULT on page 0 (read, page is INVALID) -&gt; asks node 0<br>
node 0: gives a copy of page 0 to node 1, keeps it SHARED<br>
node 1: page 0 is now SHARED<br>
node 1: reads page 0, byte 0 = 'A'<br>
scenario 0: total faults = 3 for 5 accesses<br>
<br>
== scenario 1: false sharing: A (node 0) and B (node 1) on the same page<br>
node 0: writes page 0, byte 0<br>
node 1: writes page 0, byte 1<br>
node 1: FAULT on page 0 (write, page is INVALID) -&gt; asks node 0<br>
node 0: gives page 0 to node 1 and drops its own copy<br>
node 1: page 0 is now MODIFIED<br>
node 0: writes page 0, byte 0<br>
node 0: FAULT on page 0 (write, page is INVALID) -&gt; asks node 1<br>
node 1: gives page 0 to node 0 and drops its own copy<br>
node 0: page 0 is now MODIFIED<br>
node 1: writes page 0, byte 1<br>
node 1: FAULT on page 0 (write, page is INVALID) -&gt; asks node 0<br>
node 0: gives page 0 to node 1 and drops its own copy<br>
node 1: page 0 is now MODIFIED<br>
node 0: writes page 0, byte 0<br>
node 0: FAULT on page 0 (write, page is INVALID) -&gt; asks node 1<br>
node 1: gives page 0 to node 0 and drops its own copy<br>
node 0: page 0 is now MODIFIED<br>
node 1: writes page 0, byte 1<br>
node 1: FAULT on page 0 (write, page is INVALID) -&gt; asks node 0<br>
node 0: gives page 0 to node 1 and drops its own copy<br>
node 1: page 0 is now MODIFIED<br>
scenario 1: total faults = 5 for 6 writes<br>
<br>
== scenario 2: the same writes, A and B on separate pages<br>
node 0: writes page 0, byte 0<br>
node 1: writes page 1, byte 0<br>
node 0: writes page 0, byte 0<br>
node 1: writes page 1, byte 0<br>
node 0: writes page 0, byte 0<br>
node 1: writes page 1, byte 0<br>
scenario 2: total faults = 0 for 6 writes</div>
<p>Đọc kịch bản đầu thật chậm. <strong>Nút 0 đọc trang 0</strong> — chưa từng thấy (INVALID) — nên phát sinh lỗi, nút 1 đưa một bản và giữ bản của mình, và giờ cả hai cùng giữ SHARED: <em>nhân bản</em> (tình huống của Hình 8-22c, cách một slide). Lần đọc thứ hai của nút 0 không tốn gì — không lỗi, không thông điệp: sau lần trượt đầu, dữ liệu đã ở cục bộ. <strong>Nút 0 ghi</strong>: nó giữ bản chỉ đọc nên lệnh ghi gây lỗi; nút 1 phải bỏ bản của mình (INVALID) và nút 0 thành chủ MODIFIED duy nhất — trang đã <em>di chuyển</em> (Hình 8-22b). Khi nút 1 đọc lại, nó gây lỗi và được đưa bản về. Các luật chính là các trạng thái đồng bộ cache ở slide 3 (MESI) áp cho trang và chạy bằng phần mềm.</p>
<p>➕ Chương trình này chỉ dùng tín hiệu và <code>mprotect</code> — không cần hỗ trợ đặc biệt của nhân. Trên x86 nó biết lỗi là đọc hay ghi từ thanh ghi được lưu (<code>REG_ERR</code>), trên ARM64 (container này) từ thanh ghi <em>ESR</em> lưu trong ngữ cảnh tín hiệu, nên mã có cả hai nhánh. Cỡ trang do chương trình in: <code>sysconf(_SC_PAGESIZE)</code> = 4096 ở đây, nhưng Linux trên vài máy ARM64 (Asahi của Apple, vài server) dùng trang 16 KB hay 64 KB — "đơn vị chia sẻ" đổi theo (slide 30).</p>
<p class="pitfall">⚠️ Sách vẽ trang <em>di chuyển</em> giữa các máy nhưng không vẽ <em>chi phí</em>: mỗi lỗi ở trên là hai thông điệp và một lần truyền 4 KB — với thời gian của một vòng đi-về Ethernet, gấp hàng nghìn lần một truy cập cục bộ (slide 33 đo tỉ lệ này).</p>`],
      [28, 'Distributed Shared Memory (3)',
        `<p class="y-chinh">🎯 Figure 8-22(b) — the situation after the page is referenced from another machine and <strong>moved there</strong>: page 10 now lives in the RAM of CPU 0 and has <em>left</em> CPU 1. Only one copy exists, so the data stay consistent without any extra work.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/99c17b656f8c2866f3e88871ec9578c5f359da80.svg" alt="Page 10 moves from CPU 1 to CPU 0 — two network messages" loading="lazy" /><p class="chu-thich">🧮 Page 10 moves from CPU 1 to CPU 0 — two network messages</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const NHAN_BAN = { chuyen: false, 'nhan-ban': true };</code></pre></details>
<p>⚠️ <strong>The slide's caption is wrong.</strong> It says "after <em>CPU 1</em> references page 10 and the page is moved there", but in part (a) of the figure page 10 is <em>already</em> on CPU 1 (slide 27) — CPU 1 touching it would cause nothing — and in the picture of (b) page 10 appears in the box of <strong>CPU 0</strong> while CPU 1 has lost it (1, 3, 6, 8 remain). The consistent reading is "CPU <strong>0</strong> references page 10 and the page is moved there" (the text of the book, as we recall it, says the same; we could not check the printed page, so treat this as our reading of the figure, which the simulation reproduces exactly). Our model uses that reading.</p>
<p><strong>Migration</strong> is the simplest policy: a page lives on exactly one machine, and whoever touches it takes it. It is correct (no stale copies — there is only one) and cheap when one machine uses the page for a long time ("locality"). It is terrible when two machines use the page alternately: the page <em>ping-pongs</em> across the network — the subject of slide 30. A <em>write</em> must always use migration or invalidation, because two writable copies cannot be kept equal cheaply.</p>
<p>In the real program of slide 27, scenario 0 step "node 0 writes" was exactly this move: node 1 gave the page away and dropped its copy (INVALID), node 0 became the single MODIFIED owner. The state names differ — the book says "moved", the program says "MODIFIED" — the mechanism is the same.</p>
<p class="meo">🧠 Migration = one copy, always consistent, only good when one machine at a time uses the page.</p>`,
        `<p class="y-chinh">🎯 Hình 8-22(b) — tình huống sau khi trang được tham chiếu từ một máy khác và <strong>di chuyển tới đó</strong>: trang 10 giờ sống trong RAM của CPU 0 và đã <em>rời</em> CPU 1. Chỉ còn một bản, nên dữ liệu nhất quán mà không phải làm thêm gì.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d773671fa4d97cc303aba85782ac4a76388a9d2b.svg" alt="Trang 10 di chuyển từ CPU 1 sang CPU 0 — hai thông điệp mạng" loading="lazy" /><p class="chu-thich">🧮 Trang 10 di chuyển từ CPU 1 sang CPU 0 — hai thông điệp mạng</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const NHAN_BAN = { chuyen: false, 'nhan-ban': true };</code></pre></details>
<p>⚠️ <strong>Chú thích của slide sai.</strong> Nó nói "sau khi <em>CPU 1</em> tham chiếu trang 10 và trang được chuyển tới đó", nhưng ở phần (a) của hình trang 10 <em>đã</em> ở CPU 1 rồi (slide 27) — CPU 1 đụng vào nó thì chẳng gây gì — và trong hình (b) trang 10 xuất hiện trong ô của <strong>CPU 0</strong> còn CPU 1 đã mất nó (còn 1, 3, 6, 8). Cách đọc nhất quán là "CPU <strong>0</strong> tham chiếu trang 10 và trang được chuyển tới đó" (văn bản của sách, theo trí nhớ của chúng tôi, nói như vậy; chúng tôi không kiểm được trang in, nên coi đây là cách đọc hình của chúng tôi, mà mô phỏng tái hiện đúng từng ô). Mô hình của ta dùng cách đọc đó.</p>
<p><strong>Di chuyển (migration)</strong> là chính sách đơn giản nhất: một trang sống ở đúng một máy, và ai đụng vào thì lấy nó. Nó đúng (không có bản cũ — chỉ có một) và rẻ khi một máy dùng trang trong thời gian dài ("tính cục bộ"). Nó tệ khi hai máy dùng trang luân phiên: trang <em>bị ném qua lại (ping-pong)</em> trên mạng — chủ đề của slide 30. Một lệnh <em>ghi</em> luôn phải dùng di chuyển hay vô hiệu hoá, vì hai bản ghi được không giữ bằng nhau rẻ được.</p>
<p>Trong chương trình thật ở slide 27, bước "nút 0 ghi" của kịch bản 0 chính là sự di chuyển này: nút 1 đưa trang đi và bỏ bản của mình (INVALID), nút 0 thành chủ MODIFIED duy nhất. Tên trạng thái khác — sách nói "chuyển", chương trình nói "MODIFIED" — cơ chế thì giống.</p>
<p class="meo">🧠 Di chuyển = một bản, luôn nhất quán, chỉ tốt khi mỗi lúc một máy dùng trang.</p>`],
      [29, 'Distributed Shared Memory (4)',
        `<p class="y-chinh">🎯 Figure 8-22(c) — if page 10 is <strong>read-only</strong>, it can be <strong>replicated</strong>: CPU 0 and CPU 1 both keep a copy. Reads on both machines are now local and free; nothing is invalidated because nothing is written.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7689fcc4429d1cb78025c0d07ce3c00877966a3c.svg" alt="Page 10 replicated: CPU 0 and CPU 1 both hold it" loading="lazy" /><p class="chu-thich">🧮 Page 10 replicated: CPU 0 and CPU 1 both hold it</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const NHAN_BAN = { chuyen: false, 'nhan-ban': true };</code></pre></details>
<p>Replication fixes migration's weakness for the very common case of data that is read much more than written (program code, lookup tables, configuration). Two machines can read the same page at the same time, with no further traffic after the first fault. The price comes at the first <em>write</em> to a replicated page: all other copies must be <strong>invalidated</strong> (or updated) before the write proceeds — one message per copy and a wait. The replicated page then becomes a single-owner page again. This is the same <em>read-shared, write-exclusive</em> rule as MESI on slide 3 and exactly what our C program does in scenario 0 ("node 0 writes" after both shared the page: node 1 drops its copy).</p>
<p>Which is better, migrate or replicate? It depends on the access pattern: <em>read-mostly</em> pages should replicate, <em>write-hot</em> pages should migrate (or better, stay put and be accessed remotely). The book mentions that the OS cannot know the pattern in advance — the real systems either guess from history, or ask the programmer for hints (Munin let programmers label variables "read-only", "migratory", "write-shared").</p>
<p>➕ The same rule governs <strong>caching on the web</strong>. A CDN replicates read-only files to every edge location; the first request is a miss, the next ones are local; when you <em>publish a new version</em> you must purge or expire every copy — "there are only two hard things in computer science: cache invalidation and naming things". In a backend: a Redis cache in front of PostgreSQL is a replicated read-mostly copy; the write path is where it gets complicated (write-through, cache-aside, TTL).</p>
<div class="callout">🧭 On a real server: every read replica of a PostgreSQL primary is "replication" in this slide's sense, and <em>replication lag</em> is the window in which a reader sees an obsolete value (slide 45's problem again). A feature that must read its own write immediately (a user posts a comment, reloads) is sent to the primary, or the app waits until the replica has caught up — the "read-your-writes" guarantee.</div>
<p class="pitfall">⚠️ Do not assume "replicated = always the same". Replication gives <em>fast reads</em>; keeping the copies equal is what writes cost. The book's last words on this figure: "if page 10 is read only".</p>`,
        `<p class="y-chinh">🎯 Hình 8-22(c) — nếu trang 10 <strong>chỉ đọc</strong>, nó có thể được <strong>nhân bản (replicate)</strong>: CPU 0 và CPU 1 cùng giữ một bản. Việc đọc trên cả hai máy giờ là cục bộ và miễn phí; không có gì bị vô hiệu vì không có gì được ghi.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a4b3e1b9399bb57d98e55d94f535004719a06f5f.svg" alt="Trang 10 được nhân bản: CPU 0 và CPU 1 cùng giữ" loading="lazy" /><p class="chu-thich">🧮 Trang 10 được nhân bản: CPU 0 và CPU 1 cùng giữ</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const NHAN_BAN = { chuyen: false, 'nhan-ban': true };</code></pre></details>
<p>Nhân bản chữa điểm yếu của di chuyển cho trường hợp rất phổ biến: dữ liệu đọc nhiều hơn ghi nhiều (mã chương trình, bảng tra, cấu hình). Hai máy đọc cùng một trang cùng lúc, không thêm lưu lượng sau lỗi đầu tiên. Cái giá tới ở lần <em>ghi</em> đầu tiên vào trang đã nhân bản: mọi bản khác phải bị <strong>vô hiệu</strong> (hoặc cập nhật) trước khi lệnh ghi tiếp tục — một thông điệp cho mỗi bản và một lần chờ. Trang nhân bản rồi lại thành trang một chủ. Đây là cùng luật <em>chia sẻ khi đọc, độc quyền khi ghi</em> như MESI ở slide 3 và đúng là điều chương trình C của ta làm ở kịch bản 0 ("nút 0 ghi" sau khi cả hai chia sẻ trang: nút 1 bỏ bản của mình).</p>
<p>Di chuyển hay nhân bản tốt hơn? Tuỳ kiểu truy cập: trang <em>đọc nhiều</em> nên nhân bản, trang <em>ghi nóng</em> nên di chuyển (hoặc tốt hơn, đứng yên và được truy cập từ xa). Sách nhắc HĐH không biết trước kiểu truy cập — hệ thật hoặc đoán từ lịch sử, hoặc xin gợi ý từ lập trình viên (Munin cho lập trình viên gắn nhãn biến "read-only", "migratory", "write-shared").</p>
<p>➕ Cùng luật này chi phối <strong>cache trên web</strong>. CDN nhân bản tệp chỉ đọc tới mọi điểm biên; yêu cầu đầu là trượt, các yêu cầu sau là cục bộ; khi bạn <em>phát hành phiên bản mới</em> phải xoá hoặc cho hết hạn mọi bản — "trong khoa học máy tính chỉ có hai việc khó: vô hiệu cache và đặt tên". Trong backend: một cache Redis phía trước PostgreSQL là bản sao đọc nhiều; đường ghi mới là chỗ phức tạp (write-through, cache-aside, TTL).</p>
<div class="callout">🧭 Trên server thật: mỗi read replica của một PostgreSQL primary là "nhân bản" theo nghĩa của slide này, và <em>độ trễ nhân bản (replication lag)</em> là khoảng thời gian một người đọc thấy giá trị lỗi thời (lại bài toán của slide 45). Một tính năng phải đọc thấy ngay thứ vừa ghi (người dùng đăng bình luận, tải lại trang) được gửi tới primary, hoặc ứng dụng chờ replica bắt kịp — bảo đảm "read-your-writes".</div>
<p class="pitfall">⚠️ Đừng cho rằng "nhân bản = luôn giống nhau". Nhân bản cho <em>đọc nhanh</em>; giữ các bản bằng nhau là cái giá của việc ghi. Lời cuối của sách về hình này: "nếu trang 10 chỉ đọc".</p>`],
      [30, 'False Sharing',
        `<p class="y-chinh">🎯 Figure 8-23 — <strong>false sharing</strong>: variables A and B are completely unrelated, but they sit on the <strong>same page</strong>; CPU 1 uses only A and CPU 2 uses only B — and yet the page shuttles back and forth between the two machines as if they were fighting over one variable.</p>
<p>The unit of sharing in page-based DSM is the whole page (4 KB), not the variable. Two machines that each write <em>their own</em> variable on the same page force the page to move on every write: CPU 1 writes A → CPU 2 loses the page; CPU 2 writes B → CPU 1 loses it... The messages are "true" cost for a "false" dependency. The book's remedies: <strong>smaller units</strong> (but then more page-table overhead and more messages for big objects) or compiler/programmer help to <strong>place unrelated variables on different pages</strong> — which wastes memory. The real program of slide 27 ran exactly this in its scenarios 1 and 2 (look at its output again): the same six writes cost 5 page transfers when A and B share a page and <strong>zero</strong> when they live on separate pages. The model repeats it for 1, 10 and 100 rounds:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f88d0249c1cd38a0de0d13cb9f969a9b5829ca2b.svg" alt="Page faults for alternating writes: same page versus separate pages" loading="lazy" /><p class="chu-thich">🧮 Page faults for alternating writes: same page versus separate pages</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const NHAN_BAN = { chuyen: false, 'nhan-ban': true };</code></pre></details>
<p>For 100 rounds it is 199 transfers versus none — and each transfer is a network round trip with 4 KB of data. The cost grows with the <em>number of writes</em>, not with the amount of useful data exchanged. That is why false sharing is the standard argument against page-granularity DSM.</p>
<p>And the same disease exists at <strong>cache-line size inside one machine</strong> — in your multi-core CPU right now, with MESI (slide 3) instead of page faults. Two threads increment two <em>different</em> counters in the same 64-byte line (possibly 128 bytes on Apple M-series chips) and the line bounces between the cores' caches:</p>
<pre><code class="language-c">// False sharing (Figure 8-23 at cache-line scale): two threads, two DIFFERENT counters
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;sched.h&gt;
#include &lt;pthread.h&gt;
#include &lt;time.h&gt;

#define LOOPS 25000000L
struct { volatile long v; char pad[120]; } slot[2];      // two counters 128 bytes apart
volatile long adj[2];                                    // two counters in the SAME cache line
struct { volatile long v; char pad[56]; } slot64[2];     // 64 bytes apart
pthread_barrier_t start;
static int pin_cpu[2];                                  // the two CPUs the threads are pinned to (taskset-style affinity)
static void pin_me(int id) {                            // without pinning, both threads may land on the SAME virtual CPU and share nothing
    cpu_set_t s; CPU_ZERO(&amp;s); CPU_SET(pin_cpu[id], &amp;s); pthread_setaffinity_np(pthread_self(), sizeof s, &amp;s);
}
static void pick_cpus(void) {
    cpu_set_t a; sched_getaffinity(0, sizeof a, &amp;a); int n = 0;
    for (int c = 0; c &lt; CPU_SETSIZE &amp;&amp; n &lt; 2; c++) if (CPU_ISSET(c, &amp;a)) pin_cpu[n++] = c;
}

volatile long *cell[2];
static void *work(void *arg) {
    volatile long *p = cell[(long)arg];
    pin_me((int)(long)arg);
    pthread_barrier_wait(&amp;start);
    for (long i = 0; i &lt; LOOPS; i++) (*p)++;             // each thread touches ONLY its own variable
    return NULL;
}
static double run1(volatile long *a, volatile long *b) {
    pthread_t t[2]; struct timespec s, e;
    *a = 0; *b = 0; cell[0] = a; cell[1] = b;
    pthread_barrier_init(&amp;start, NULL, 3);
    pthread_create(&amp;t[0], NULL, work, (void *)0); pthread_create(&amp;t[1], NULL, work, (void *)1);
    pthread_barrier_wait(&amp;start);
    clock_gettime(CLOCK_MONOTONIC, &amp;s);
    pthread_join(t[0], NULL); pthread_join(t[1], NULL);
    clock_gettime(CLOCK_MONOTONIC, &amp;e);
    pthread_barrier_destroy(&amp;start);
    return (e.tv_sec - s.tv_sec) * 1e3 + (e.tv_nsec - s.tv_nsec) / 1e6;
}
static double run(volatile long *a, volatile long *b) {          // best of 7: the minimum is the least disturbed by the rest of the machine
    double best = run1(a, b);
    for (int i = 0; i &lt; 6; i++) { double t = run1(a, b); if (t &lt; best) best = t; }
    return best;
}
int main(void) {
    pick_cpus();
    printf("adjacent   : %p and %p, best of 7: %.0f ms\\n", (void *)&amp;adj[0], (void *)&amp;adj[1], run(&amp;adj[0], &amp;adj[1]));
    printf("padded 64  : %p and %p, best of 7: %.0f ms\\n", (void *)&amp;slot64[0].v, (void *)&amp;slot64[1].v, run(&amp;slot64[0].v, &amp;slot64[1].v));
    printf("padded 128 : %p and %p, best of 7: %.0f ms\\n", (void *)&amp;slot[0].v, (void *)&amp;slot[1].v, run(&amp;slot[0].v, &amp;slot[1].v));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread chia-se-gia.c -o chia-se-gia &amp;&amp; ./chia-se-gia<br>
adjacent &nbsp;&nbsp;: 0xaaaaaef60188 and 0xaaaaaef60190, best of 7: 75 ms<br>
padded 64 &nbsp;: 0xaaaaaef60198 and 0xaaaaaef601d8, best of 7: 62 ms<br>
padded 128 : 0xaaaaaef60088 and 0xaaaaaef60108, best of 7: 58 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>"adjacent" puts the counters 8 bytes apart (same line); "padded 64" and "padded 128" move them 64 and 128 bytes apart. Each thread is pinned to its own CPU (the affinity of slide 16 — without pinning the two threads can land on the same virtual CPU, and then nothing is shared at all), and every figure is the best of 7 runs. In the cached run: adjacent <strong>75 ms</strong>, padded 64 <strong>62 ms</strong>, padded 128 <strong>58 ms</strong> — padding removed roughly a quarter of the time. The gap is modest because this loop is slow for other reasons (<code>-O0</code>, a read-modify-write in memory) and because a virtual machine on an Apple M-series chip is not a typical x86 server; there the gap is often several times. In every run we made the order was the same (adjacent slowest, 128 never slower than 64), but the digits moved by tens of percent with the load of the host — which is why the program prints the best of seven and why you should never decide from one measurement. M-series chips are generally reported to use 128-byte cache lines, so the folk rule "pad to 64" may fall short there: measure on your machine (exercise 5 of lesson 8.C does).</p>
<div class="callout">🧭 On a real server: Java's <code>@Contended</code> annotation (inside the JDK, e.g. in <code>LongAdder</code>'s cells and <code>ConcurrentHashMap</code>'s counters) pads fields to separate cache lines for exactly this reason; the Linux kernel marks per-CPU structures <code>____cacheline_aligned_in_smp</code>. In a Node.js app the same disease appears one level up: many workers updating counters in one <code>SharedArrayBuffer</code>.</div>
<p class="pitfall">⚠️ False sharing is <em>silent</em>: the program is correct and just slow. Profilers see it as "cache misses" or "time in a loop that touches only private data". Think of it whenever adding threads makes things slower.</p>`,
        `<p class="y-chinh">🎯 Hình 8-23 — <strong>chia sẻ giả (false sharing)</strong>: biến A và B hoàn toàn không liên quan, nhưng nằm trên <strong>cùng một trang</strong>; CPU 1 chỉ dùng A và CPU 2 chỉ dùng B — vậy mà trang bị chuyển qua lại giữa hai máy như thể chúng đang tranh một biến.</p>
<p>Đơn vị chia sẻ trong DSM theo trang là cả trang (4 KB), không phải biến. Hai máy mỗi bên ghi biến <em>của mình</em> trên cùng một trang buộc trang phải chuyển ở mỗi lần ghi: CPU 1 ghi A → CPU 2 mất trang; CPU 2 ghi B → CPU 1 mất nó... Các thông điệp là chi phí "thật" cho một sự phụ thuộc "giả". Cách chữa của sách: <strong>đơn vị nhỏ hơn</strong> (nhưng khi đó tốn thêm bảng trang và thêm thông điệp cho đối tượng lớn) hoặc nhờ trình biên dịch/lập trình viên <strong>đặt các biến không liên quan lên các trang khác nhau</strong> — tốn bộ nhớ. Chương trình thật ở slide 27 đã chạy đúng việc này ở kịch bản 1 và 2 (nhìn lại output của nó): cùng sáu lệnh ghi tốn 5 lần chuyển trang khi A và B chung trang và <strong>không lần nào</strong> khi chúng ở hai trang riêng. Mô hình lặp lại cho 1, 10 và 100 vòng:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d9540ec0374a4bc81fced1fc4a01e237f699fefe.svg" alt="Số lỗi trang khi ghi xen kẽ: chung trang so với hai trang riêng" loading="lazy" /><p class="chu-thich">🧮 Số lỗi trang khi ghi xen kẽ: chung trang so với hai trang riêng</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const NHAN_BAN = { chuyen: false, 'nhan-ban': true };</code></pre></details>
<p>Với 100 vòng là 199 lần chuyển so với không lần nào — và mỗi lần chuyển là một vòng đi-về mạng với 4 KB dữ liệu. Chi phí tăng theo <em>số lệnh ghi</em>, không theo lượng dữ liệu hữu ích được trao đổi. Đó là lý do false sharing là lập luận chuẩn chống lại DSM theo cỡ trang.</p>
<p>Và cùng căn bệnh này tồn tại ở <strong>cỡ dòng cache bên trong một máy</strong> — trong CPU nhiều nhân của bạn ngay lúc này, với MESI (slide 3) thay cho lỗi trang. Hai luồng tăng hai biến đếm <em>khác nhau</em> trong cùng một dòng 64 byte (có thể 128 byte trên chip Apple dòng M) và dòng nảy qua lại giữa cache của các nhân:</p>
<pre><code class="language-c">// Chia sẻ giả (Hình 8-23 ở cỡ dòng cache): hai luồng, hai biến đếm KHÁC NHAU
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;sched.h&gt;
#include &lt;pthread.h&gt;
#include &lt;time.h&gt;

#define LOOPS 25000000L
struct { volatile long v; char pad[120]; } slot[2];      // hai biến đếm cách nhau 128 byte
volatile long adj[2];                                    // hai biến đếm trong CÙNG một dòng cache
struct { volatile long v; char pad[56]; } slot64[2];     // cách nhau 64 byte
pthread_barrier_t start;
static int pin_cpu[2];                                  // hai CPU mà các luồng được ghim vào (affinity kiểu taskset)
static void pin_me(int id) {                            // không ghim thì cả hai luồng có thể rơi vào CÙNG một CPU ảo và không chia sẻ gì
    cpu_set_t s; CPU_ZERO(&amp;s); CPU_SET(pin_cpu[id], &amp;s); pthread_setaffinity_np(pthread_self(), sizeof s, &amp;s);
}
static void pick_cpus(void) {
    cpu_set_t a; sched_getaffinity(0, sizeof a, &amp;a); int n = 0;
    for (int c = 0; c &lt; CPU_SETSIZE &amp;&amp; n &lt; 2; c++) if (CPU_ISSET(c, &amp;a)) pin_cpu[n++] = c;
}

volatile long *cell[2];
static void *work(void *arg) {
    volatile long *p = cell[(long)arg];
    pin_me((int)(long)arg);
    pthread_barrier_wait(&amp;start);
    for (long i = 0; i &lt; LOOPS; i++) (*p)++;             // mỗi luồng chỉ đụng biến CỦA MÌNH
    return NULL;
}
static double run1(volatile long *a, volatile long *b) {
    pthread_t t[2]; struct timespec s, e;
    *a = 0; *b = 0; cell[0] = a; cell[1] = b;
    pthread_barrier_init(&amp;start, NULL, 3);
    pthread_create(&amp;t[0], NULL, work, (void *)0); pthread_create(&amp;t[1], NULL, work, (void *)1);
    pthread_barrier_wait(&amp;start);
    clock_gettime(CLOCK_MONOTONIC, &amp;s);
    pthread_join(t[0], NULL); pthread_join(t[1], NULL);
    clock_gettime(CLOCK_MONOTONIC, &amp;e);
    pthread_barrier_destroy(&amp;start);
    return (e.tv_sec - s.tv_sec) * 1e3 + (e.tv_nsec - s.tv_nsec) / 1e6;
}
static double run(volatile long *a, volatile long *b) {          // tốt nhất trong 3 lần: giá trị nhỏ nhất ít bị phần còn lại của máy làm nhiễu nhất
    double best = run1(a, b);
    for (int i = 0; i &lt; 6; i++) { double t = run1(a, b); if (t &lt; best) best = t; }
    return best;
}
int main(void) {
    pick_cpus();
    printf("adjacent   : %p and %p, best of 7: %.0f ms\\n", (void *)&amp;adj[0], (void *)&amp;adj[1], run(&amp;adj[0], &amp;adj[1]));
    printf("padded 64  : %p and %p, best of 7: %.0f ms\\n", (void *)&amp;slot64[0].v, (void *)&amp;slot64[1].v, run(&amp;slot64[0].v, &amp;slot64[1].v));
    printf("padded 128 : %p and %p, best of 7: %.0f ms\\n", (void *)&amp;slot[0].v, (void *)&amp;slot[1].v, run(&amp;slot[0].v, &amp;slot[1].v));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread chia-se-gia.c -o chia-se-gia &amp;&amp; ./chia-se-gia<br>
adjacent &nbsp;&nbsp;: 0xaaaaaef60188 and 0xaaaaaef60190, best of 7: 75 ms<br>
padded 64 &nbsp;: 0xaaaaaef60198 and 0xaaaaaef601d8, best of 7: 62 ms<br>
padded 128 : 0xaaaaaef60088 and 0xaaaaaef60108, best of 7: 58 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>"adjacent" đặt hai biến đếm cách nhau 8 byte (cùng dòng); "padded 64" và "padded 128" dời chúng 64 và 128 byte. Mỗi luồng được ghim vào CPU riêng của nó (affinity của slide 16 — không ghim thì hai luồng có thể rơi vào cùng một CPU ảo, và khi đó chẳng có gì được chia sẻ), và mọi con số là tốt nhất trong 7 lần chạy. Trong lần chạy được lưu: adjacent <strong>75 ms</strong>, padded 64 <strong>62 ms</strong>, padded 128 <strong>58 ms</strong> — việc đệm bớt đi khoảng một phần tư thời gian. Khoảng cách vừa phải vì vòng lặp này chậm vì các lý do khác (<code>-O0</code>, một phép đọc-sửa-ghi trong bộ nhớ) và vì một máy ảo trên chip Apple dòng M không phải server x86 điển hình; trên đó khoảng cách thường là vài lần. Ở mọi lần chạy của chúng tôi thứ tự đều như nhau (adjacent chậm nhất, 128 không bao giờ chậm hơn 64), nhưng các chữ số xê dịch hàng chục phần trăm theo tải của máy chủ — vì thế chương trình in giá trị tốt nhất trong bảy lần và vì thế bạn không bao giờ nên quyết định từ một lần đo. Chip dòng M thường được báo là dùng dòng cache 128 byte, nên quy tắc dân gian "đệm tới 64" có thể thiếu ở đó: hãy đo trên máy của bạn (bài 5 của bài 8.C làm việc đó).</p>
<div class="callout">🧭 Trên server thật: chú thích <code>@Contended</code> của Java (bên trong JDK, ví dụ trong các ô của <code>LongAdder</code> và bộ đếm của <code>ConcurrentHashMap</code>) đệm các trường sang các dòng cache khác nhau đúng vì lý do này; nhân Linux đánh dấu các cấu trúc theo từng CPU là <code>____cacheline_aligned_in_smp</code>. Trong ứng dụng Node.js cùng căn bệnh đó xuất hiện ở tầng trên: nhiều worker cập nhật bộ đếm trong một <code>SharedArrayBuffer</code>.</div>
<p class="pitfall">⚠️ False sharing là <em>im lặng</em>: chương trình đúng chỉ là chậm. Công cụ đo thấy nó như "trượt cache" hoặc "thời gian trong vòng lặp chỉ đụng dữ liệu riêng". Hãy nghĩ tới nó mỗi khi thêm luồng làm mọi thứ chậm đi.</p>`],
      [31, 'Graph-Theoretic Deterministic Algorithm',
        `<p class="y-chinh">🎯 Figure 8-24 — a <strong>graph-theoretic deterministic algorithm</strong> for placing processes on nodes: draw the processes as vertices and the traffic between each pair as a <strong>weighted edge</strong>; assign the vertices to nodes (CPUs) so that the <strong>total weight of the edges that cross between nodes</strong> — the network traffic — is as small as possible, within each node's capacity.</p>
<p>When the processes of a program and their communication are known in advance ("deterministic"), placement becomes a graph-partitioning problem. The figure shows the same nine processes A–I placed two ways on three nodes; the numbers on the edges are traffic (say messages per second). The sum of the cut edges is what the network carries: <strong>30</strong> units for the left allocation and <strong>28</strong> for the right one (the program below recomputes both from the edges read off the slide, and gets exactly the book's totals):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/17f6453794634408eb60e70ef110151197676ce9.svg" alt="Left allocation: nodes AEG, BFH, CDI — 30 units cross the network" loading="lazy" /><p class="chu-thich">🧮 Left allocation: nodes AEG, BFH, CDI — 30 units cross the network</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const VITRI = { A: [0, 0], B: [2, 0], C: [3.2, 0], D: [5, 0], E: [0.9, 1], F: [2.1, 1], G: [0, 2], H: [2.2, 2], I: [5, 2] };   // đọc từ ảnh slide 31</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ce962207a2a64bcb8dcb3dec40343abf23db2d08.svg" alt="Right allocation: nodes AEG, BCFH, DI — 28 units" loading="lazy" /><p class="chu-thich">🧮 Right allocation: nodes AEG, BCFH, DI — 28 units</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const VITRI = { A: [0, 0], B: [2, 0], C: [3.2, 0], D: [5, 0], E: [0.9, 1], F: [2.1, 1], G: [0, 2], H: [2.2, 2], I: [5, 2] };   // đọc từ ảnh slide 31</code></pre></details>
<p>The right allocation is better by traffic, but it puts 4, 3 and 2 processes on the nodes — if nodes have equal speed, node 2 does twice the work of node 3. Are these two the best? With only 9 processes we can check <em>every</em> assignment (3<sup>9</sup> = 19,683 possibilities; the program keeps those that use all three nodes). With the stricter rule of exactly three processes per node the best cut is far below the book's:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5b1bdc6aaba875beac8b0980ad0706890570028d.svg" alt="Brute-force optimum with exactly 3 processes per node: 23 units" loading="lazy" /><p class="chu-thich">🧮 Brute-force optimum with exactly 3 processes per node: 23 units</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const VITRI = { A: [0, 0], B: [2, 0], C: [3.2, 0], D: [5, 0], E: [0.9, 1], F: [2.1, 1], G: [0, 2], H: [2.2, 2], I: [5, 2] };   // đọc từ ảnh slide 31</code></pre></details>
<p>And if a node may hold up to four processes, the optimum falls to <strong>11</strong> units — by putting the lonely process B on a node by itself (<code>{A,E,G,H} {B} {C,D,F,I}</code>, found by the same search; this solution is unbalanced and shows the trade-off between traffic and load). Both the book's allocations are therefore <em>valid but far from optimal</em> — they illustrate the method, not the best answer.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ffd284674f3c371e7644db34cb77523b9cd14799.svg" alt="Optimum with at most 4 processes per node: 11 units" loading="lazy" /><p class="chu-thich">🧮 Optimum with at most 4 processes per node: 11 units</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const VITRI = { A: [0, 0], B: [2, 0], C: [3.2, 0], D: [5, 0], E: [0.9, 1], F: [2.1, 1], G: [0, 2], H: [2.2, 2], I: [5, 2] };   // đọc từ ảnh slide 31</code></pre></details>
<p>Real graphs have thousands of vertices, where brute force is impossible (graph partitioning is NP-hard) and tools use heuristics: <strong>METIS</strong> partitions graphs for parallel simulations and databases; Spark and Flink try to place tasks next to their data to cut the network; Kubernetes' pod <em>affinity</em> rules ("these two pods on the same node/rack") are the same idea written as constraints.</p>
<p class="pitfall">⚠️ The algorithm needs the traffic matrix <em>in advance</em>; most real systems do not have it — the reason for the dynamic load balancing of the next slide. And it minimises traffic only; it ignores that a node with 4 processes works harder than one with 2.</p>`,
        `<p class="y-chinh">🎯 Hình 8-24 — một <strong>thuật toán xác định theo đồ thị</strong> để đặt tiến trình vào các nút: vẽ các tiến trình thành đỉnh và lưu lượng giữa mỗi cặp thành <strong>cạnh có trọng số</strong>; gán các đỉnh vào các nút (CPU) sao cho <strong>tổng trọng số các cạnh băng qua giữa các nút</strong> — lưu lượng mạng — nhỏ nhất có thể, trong giới hạn sức chứa của mỗi nút.</p>
<p>Khi các tiến trình của một chương trình và việc giao tiếp của chúng được biết trước ("xác định"), việc đặt chỗ thành bài toán chia đồ thị. Hình cho thấy cùng chín tiến trình A–I đặt hai cách trên ba nút; các số trên cạnh là lưu lượng (giả sử số thông điệp mỗi giây). Tổng các cạnh bị cắt là thứ mạng phải chở: <strong>30</strong> đơn vị cho cách gán bên trái và <strong>28</strong> cho bên phải (chương trình dưới đây tính lại cả hai từ các cạnh đọc ra khỏi slide, và ra đúng tổng của sách):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9213684e1ce1d213d3e0c7e21fae90a75139dc23.svg" alt="Cách gán bên trái: các nút AEG, BFH, CDI — 30 đơn vị qua mạng" loading="lazy" /><p class="chu-thich">🧮 Cách gán bên trái: các nút AEG, BFH, CDI — 30 đơn vị qua mạng</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const VITRI = { A: [0, 0], B: [2, 0], C: [3.2, 0], D: [5, 0], E: [0.9, 1], F: [2.1, 1], G: [0, 2], H: [2.2, 2], I: [5, 2] };   // đọc từ ảnh slide 31</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/40ab365aa115f2e291577652be0b73c893a6f116.svg" alt="Cách gán bên phải: các nút AEG, BCFH, DI — 28 đơn vị" loading="lazy" /><p class="chu-thich">🧮 Cách gán bên phải: các nút AEG, BCFH, DI — 28 đơn vị</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const VITRI = { A: [0, 0], B: [2, 0], C: [3.2, 0], D: [5, 0], E: [0.9, 1], F: [2.1, 1], G: [0, 2], H: [2.2, 2], I: [5, 2] };   // đọc từ ảnh slide 31</code></pre></details>
<p>Cách gán bên phải tốt hơn về lưu lượng, nhưng nó đặt 4, 3 và 2 tiến trình lên các nút — nếu các nút tốc độ bằng nhau thì nút 2 làm gấp đôi việc của nút 3. Hai cách này có phải tốt nhất? Chỉ có 9 tiến trình nên ta kiểm được <em>mọi</em> cách gán (3<sup>9</sup> = 19.683 khả năng; chương trình giữ các cách dùng đủ ba nút). Với luật chặt hơn là đúng ba tiến trình mỗi nút, lát cắt tốt nhất thấp hơn nhiều so với của sách:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5c1bfa7679b0a70ab2571b0b1d0cde7b6e8789dd.svg" alt="Tối ưu vét cạn với đúng 3 tiến trình mỗi nút: 23 đơn vị" loading="lazy" /><p class="chu-thich">🧮 Tối ưu vét cạn với đúng 3 tiến trình mỗi nút: 23 đơn vị</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const VITRI = { A: [0, 0], B: [2, 0], C: [3.2, 0], D: [5, 0], E: [0.9, 1], F: [2.1, 1], G: [0, 2], H: [2.2, 2], I: [5, 2] };   // đọc từ ảnh slide 31</code></pre></details>
<p>Và nếu một nút được chứa tới bốn tiến trình, tối ưu rơi xuống <strong>11</strong> đơn vị — bằng cách đặt tiến trình lẻ loi B một mình trên một nút (<code>{A,E,G,H} {B} {C,D,F,I}</code>, tìm bằng cùng phép tìm kiếm; lời giải này mất cân bằng và cho thấy sự đánh đổi giữa lưu lượng và tải). Cả hai cách gán của sách vì thế là <em>hợp lệ nhưng xa tối ưu</em> — chúng minh hoạ phương pháp, không phải đáp án tốt nhất.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8123b9e1c2d9aaf139956cda135ed646c8a82a3f.svg" alt="Tối ưu với tối đa 4 tiến trình mỗi nút: 11 đơn vị" loading="lazy" /><p class="chu-thich">🧮 Tối ưu với tối đa 4 tiến trình mỗi nút: 11 đơn vị</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const VITRI = { A: [0, 0], B: [2, 0], C: [3.2, 0], D: [5, 0], E: [0.9, 1], F: [2.1, 1], G: [0, 2], H: [2.2, 2], I: [5, 2] };   // đọc từ ảnh slide 31</code></pre></details>
<p>Đồ thị thật có hàng nghìn đỉnh, nơi vét cạn bất khả thi (chia đồ thị là NP-khó) và công cụ dùng heuristic: <strong>METIS</strong> chia đồ thị cho mô phỏng song song và cơ sở dữ liệu; Spark và Flink cố đặt tác vụ cạnh dữ liệu của chúng để giảm mạng; luật <em>affinity</em> của pod trong Kubernetes ("hai pod này cùng node/rack") là cùng ý tưởng viết thành ràng buộc.</p>
<p class="pitfall">⚠️ Thuật toán cần ma trận lưu lượng <em>biết trước</em>; hầu hết hệ thật không có — lý do của cân bằng tải động ở slide sau. Và nó chỉ cực tiểu lưu lượng; nó bỏ qua việc một nút 4 tiến trình làm nặng hơn nút 2.</p>`],
      [32, 'Sender-Initiated Distributed Heuristic Algorithm',
        `<p class="y-chinh">🎯 Figure 8-25 — <strong>distributed heuristic load balancing</strong> when nothing is known in advance: (a) <strong>sender-initiated</strong> — an <em>overloaded</em> node that creates a new process picks another node (at random) and asks "are you lightly loaded?"; if yes it hands the process over, if no it tries another node, up to a probe limit; (b) <strong>receiver-initiated</strong> — an <em>idle</em> node asks other nodes "do you have work for me?".</p>
<p>No central scheduler, no advance knowledge: every node decides from its own load and a few probes. In <strong>sender-initiated</strong> balancing the busy node does the searching. It works well when the system is <em>lightly loaded</em>: most nodes are idle, so the first probe usually succeeds. When the whole system is <em>heavily loaded</em>, every probe finds another overloaded node: the busy nodes waste effort and flood the network with useless probes — at worst the balancing traffic itself is what slows the system. In <strong>receiver-initiated</strong> balancing the idle node does the searching. When the system is heavily loaded a probe almost always finds work, and nodes that are idle are exactly those that can afford to spend time on searching; when the system is lightly loaded, idle nodes probe constantly and find nothing. The book concludes: the best policy depends on the load — use sender-initiated under light load and receiver-initiated under heavy load.</p>
<p>Here is a deterministic toy model (8 nodes, node 0 gets more work than the others, each node serves 1 job per tick, up to 3 probes per search, messages counted: 2 per probe, 1 per migrated job). Light load first:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f084edd9a91be722ac1d56c80c42f2e7c6abfb88.svg" alt="Light load (41% busy): sender-initiated needs 1.6 messages per tick, receiver-initiated 30.7" loading="lazy" /><p class="chu-thich">🧮 Light load (41% busy): sender-initiated needs 1.6 messages per tick, receiver-initiated 30.7</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHE = [['khong', 'no balancing', 'không cân bằng'], ['gui', 'sender-initiated (overloaded node asks)', 'sender-initiated (nút quá tải đi hỏi)'], ['nhan', 'receiver-initiated (idle node asks)', 'receiver-initiated (nút rảnh đi hỏi)']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b98f1fc6539809e5e0968aed3f9093cb54ff4fc3.svg" alt="Heavy load (97% busy): the order flips — 11.9 against 4.4 messages per tick" loading="lazy" /><p class="chu-thich">🧮 Heavy load (97% busy): the order flips — 11.9 against 4.4 messages per tick</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHE = [['khong', 'no balancing', 'không cân bằng'], ['gui', 'sender-initiated (overloaded node asks)', 'sender-initiated (nút quá tải đi hỏi)'], ['nhan', 'receiver-initiated (idle node asks)', 'receiver-initiated (nút rảnh đi hỏi)']];</code></pre></details>
<p>The model reproduces the book's conclusion qualitatively: at light load almost every sender-initiated probe succeeds (98% in the model) so it costs 1.6 messages per tick, while the idle nodes of the receiver-initiated policy probe all the time and almost never succeed (4%), costing 30.7 messages per tick — 19 times more. At heavy load the traffic reverses: the busy senders flood the network with 11.9 messages per tick and only 19% of their probes find a taker, while the receivers spend 4.4. Both policies crush the "no balancing" queue (around 4–12 jobs on average per node in the unbalanced run versus about 1 balanced — the data of the charts). It is a toy, so do not quote the numbers; keep the shape.</p>
<p>You use both policies every day without naming them. <strong>Work stealing</strong> — an idle thread takes jobs from a busy thread's queue — is receiver-initiated: the Fork/Join pool of slide 15, Go's goroutine scheduler and Linux's idle load balancer all do it. <strong>Round-robin distribution</strong> by a front-end (nginx, a Kubernetes Service) is a central scheduler instead. Here is Node's <code>cluster</code> module: the primary process accepts connections and deals them out round-robin to four workers (<em>one OS process per core</em>, one shared port):</p>
<pre><code class="language-javascript">// Node's cluster module: one process per core, ONE listening port shared by all
import cluster from 'node:cluster';
import http from 'node:http';
import os from 'node:os';

if (cluster.isPrimary) {
  const n = 4;                                          // in production: os.availableParallelism() = number of cores
  console.log(&#96;primary: &#36;{os.availableParallelism()} cores on this machine, forking &#36;{n} workers&#96;);
  const ready = []; const served = {};
  for (let i = 0; i &lt; n; i++) {
    const w = cluster.fork();
    w.on('message', (m) =&gt; { if (m === 'up') ready.push(w.id); });
    w.on('exit', () =&gt; {});
  }
  const timer = setInterval(async () =&gt; {
    if (ready.length &lt; n) return;
    clearInterval(timer);
    console.log(&#96;workers: &#36;{ready.length} up, all listening on the same port&#96;);
    const port = 8123;
    for (let i = 0; i &lt; 40; i++) {                      // 40 separate connections (Connection: close)
      const body = await new Promise((resolve) =&gt; http.get({ port, agent: false, headers: { Connection: 'close' } }, (r) =&gt; { let s = ''; r.on('data', (d) =&gt; (s += d)); r.on('end', () =&gt; resolve(s)); }));
      served[body] = (served[body] || 0) + 1;
    }
    const total = Object.values(served).reduce((a, b) =&gt; a + b, 0);
    console.log(&#96;served: &#36;{total} requests, per worker: &#36;{Object.keys(served).sort().map((k) =&gt; &#96;&#36;{k}=&#36;{served[k]}&#96;).join(' ')}&#96;);
    for (const id in cluster.workers) cluster.workers[id].kill();
    process.exit(0);
  }, 20);
} else {
  http.createServer((q, r) =&gt; r.end(&#96;w&#36;{cluster.worker.id}&#96;)).listen(8123, () =&gt; process.send('up'));
}</code></pre>
<div class="out">$ node cum-nhan.js<br>
primary: 10 cores on this machine, forking 4 workers<br>
workers: 4 up, all listening on the same port<br>
served: 40 requests, per worker: w1=10 w2=10 w3=10 w4=10</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>40 requests are served by four workers, 10 each. That is "a master hands the work to workers" (the master–slave of slide 11) used for load balancing.</p>
<div class="callout">🧭 On a real server: nginx's <code>least_conn</code> and "power of two random choices" (probe two random servers, choose the less loaded) are sender-initiated policies with a probe limit; Kubernetes' scheduler is central; a Kafka consumer group lets idle consumers pick up partitions (receiver-style). When all backends are overloaded, retrying on another server (a "retry storm") is the sender-initiated failure mode of this slide: use backoff and a retry budget.</div>`,
        `<p class="y-chinh">🎯 Hình 8-25 — <strong>cân bằng tải heuristic phân tán</strong> khi không biết gì trước: (a) <strong>do bên gửi khởi xướng (sender-initiated)</strong> — một nút <em>quá tải</em> khi tạo tiến trình mới chọn một nút khác (ngẫu nhiên) và hỏi "bạn đang nhẹ tải không?"; nếu có thì giao tiến trình, nếu không thì thử nút khác, tới giới hạn số lần hỏi; (b) <strong>do bên nhận khởi xướng (receiver-initiated)</strong> — một nút <em>rảnh</em> hỏi các nút khác "bạn có việc cho tôi không?".</p>
<p>Không có bộ lập lịch trung tâm, không biết trước: mỗi nút quyết định từ tải của mình và vài lần hỏi. Ở cân bằng <strong>do bên gửi khởi xướng</strong>, nút bận đi tìm. Nó chạy tốt khi hệ thống <em>nhẹ tải</em>: hầu hết nút rảnh nên lần hỏi đầu thường thành công. Khi cả hệ thống <em>nặng tải</em>, lần hỏi nào cũng gặp một nút quá tải khác: các nút bận phí công và làm ngập mạng bằng các lần hỏi vô ích — tệ nhất thì chính lưu lượng cân bằng làm chậm hệ thống. Ở cân bằng <strong>do bên nhận khởi xướng</strong>, nút rảnh đi tìm. Khi hệ thống nặng tải, lần hỏi gần như luôn tìm được việc, và nút rảnh đúng là nút có khả năng bỏ thời gian đi tìm; khi hệ thống nhẹ tải, các nút rảnh hỏi liên tục mà chẳng tìm được gì. Sách kết luận: chính sách tốt nhất tuỳ tải — dùng bên-gửi khi nhẹ tải và bên-nhận khi nặng tải.</p>
<p>Đây là mô hình đồ chơi tất định (8 nút, nút 0 nhận nhiều việc hơn các nút khác, mỗi nút phục vụ 1 việc mỗi tick, tối đa 3 lần hỏi mỗi lượt tìm, đếm thông điệp: 2 cho mỗi lần hỏi, 1 cho mỗi việc di chuyển). Tải nhẹ trước:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f7d7f1b7514f87636f780e85723b40bb1a16c234.svg" alt="Tải nhẹ (bận 41%): bên-gửi cần 1,6 thông điệp mỗi tick, bên-nhận 30,7" loading="lazy" /><p class="chu-thich">🧮 Tải nhẹ (bận 41%): bên-gửi cần 1,6 thông điệp mỗi tick, bên-nhận 30,7</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHE = [['khong', 'no balancing', 'không cân bằng'], ['gui', 'sender-initiated (overloaded node asks)', 'sender-initiated (nút quá tải đi hỏi)'], ['nhan', 'receiver-initiated (idle node asks)', 'receiver-initiated (nút rảnh đi hỏi)']];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c564c21e671b0bfd87a4aa96cabba8906c137d3b.svg" alt="Tải nặng (bận 97%): thứ tự đảo lại — 11,9 so với 4,4 thông điệp mỗi tick" loading="lazy" /><p class="chu-thich">🧮 Tải nặng (bận 97%): thứ tự đảo lại — 11,9 so với 4,4 thông điệp mỗi tick</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHE = [['khong', 'no balancing', 'không cân bằng'], ['gui', 'sender-initiated (overloaded node asks)', 'sender-initiated (nút quá tải đi hỏi)'], ['nhan', 'receiver-initiated (idle node asks)', 'receiver-initiated (nút rảnh đi hỏi)']];</code></pre></details>
<p>Mô hình tái hiện kết luận của sách về mặt định tính: ở tải nhẹ gần như mọi lần hỏi của bên-gửi thành công (98% trong mô hình) nên tốn 1,6 thông điệp mỗi tick, còn các nút rảnh của chính sách bên-nhận hỏi suốt và gần như không bao giờ thành công (4%), tốn 30,7 thông điệp mỗi tick — gấp 19 lần. Ở tải nặng lưu lượng đảo chiều: các bên gửi bận làm ngập mạng với 11,9 thông điệp mỗi tick và chỉ 19% lần hỏi tìm được người nhận, trong khi các bên nhận tốn 4,4. Cả hai chính sách đều đè bẹp hàng đợi "không cân bằng" (khoảng 4–12 việc trung bình mỗi nút khi không cân bằng so với khoảng 1 khi cân bằng — dữ liệu của các biểu đồ). Đây là đồ chơi, nên đừng trích con số; hãy giữ hình dạng.</p>
<p>Bạn dùng cả hai chính sách mỗi ngày mà không gọi tên. <strong>Ăn cắp việc (work stealing)</strong> — luồng rảnh lấy việc từ hàng đợi của luồng bận — là bên-nhận khởi xướng: pool Fork/Join ở slide 15, bộ lập lịch goroutine của Go và bộ cân bằng tải khi rảnh của Linux đều làm vậy. <strong>Chia vòng tròn (round-robin)</strong> bởi một front-end (nginx, một Service của Kubernetes) lại là bộ lập lịch trung tâm. Đây là mô-đun <code>cluster</code> của Node: tiến trình chính nhận kết nối và chia chúng vòng tròn cho bốn worker (<em>mỗi nhân một tiến trình HĐH</em>, một cổng dùng chung):</p>
<pre><code class="language-javascript">// Mô-đun cluster của Node: mỗi nhân một tiến trình, MỘT cổng nghe dùng chung
import cluster from 'node:cluster';
import http from 'node:http';
import os from 'node:os';

if (cluster.isPrimary) {
  const n = 4;                                          // trên production: os.availableParallelism() = số nhân
  console.log(&#96;primary: &#36;{os.availableParallelism()} cores on this machine, forking &#36;{n} workers&#96;);
  const ready = []; const served = {};
  for (let i = 0; i &lt; n; i++) {
    const w = cluster.fork();
    w.on('message', (m) =&gt; { if (m === 'up') ready.push(w.id); });
    w.on('exit', () =&gt; {});
  }
  const timer = setInterval(async () =&gt; {
    if (ready.length &lt; n) return;
    clearInterval(timer);
    console.log(&#96;workers: &#36;{ready.length} up, all listening on the same port&#96;);
    const port = 8123;
    for (let i = 0; i &lt; 40; i++) {                      // 40 kết nối riêng (Connection: close)
      const body = await new Promise((resolve) =&gt; http.get({ port, agent: false, headers: { Connection: 'close' } }, (r) =&gt; { let s = ''; r.on('data', (d) =&gt; (s += d)); r.on('end', () =&gt; resolve(s)); }));
      served[body] = (served[body] || 0) + 1;
    }
    const total = Object.values(served).reduce((a, b) =&gt; a + b, 0);
    console.log(&#96;served: &#36;{total} requests, per worker: &#36;{Object.keys(served).sort().map((k) =&gt; &#96;&#36;{k}=&#36;{served[k]}&#96;).join(' ')}&#96;);
    for (const id in cluster.workers) cluster.workers[id].kill();
    process.exit(0);
  }, 20);
} else {
  http.createServer((q, r) =&gt; r.end(&#96;w&#36;{cluster.worker.id}&#96;)).listen(8123, () =&gt; process.send('up'));
}</code></pre>
<div class="out">$ node cum-nhan.js<br>
primary: 10 cores on this machine, forking 4 workers<br>
workers: 4 up, all listening on the same port<br>
served: 40 requests, per worker: w1=10 w2=10 w3=10 w4=10</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>40 yêu cầu được bốn worker phục vụ, mỗi worker 10. Đó là "một master giao việc cho các thợ" (chủ–thợ của slide 11) dùng để cân bằng tải.</p>
<div class="callout">🧭 Trên server thật: <code>least_conn</code> của nginx và "power of two random choices" (hỏi hai server ngẫu nhiên, chọn cái nhẹ tải hơn) là các chính sách bên-gửi có giới hạn số lần hỏi; bộ lập lịch Kubernetes là trung tâm; nhóm consumer của Kafka cho consumer rảnh nhận partition (kiểu bên-nhận). Khi mọi backend đều quá tải, thử lại trên server khác ("retry storm") là chế độ hỏng kiểu bên-gửi của slide này: hãy dùng backoff và một ngân sách thử lại.</div>`],
      [33, 'Distributed Systems (1)',
        `<p class="y-chinh">🎯 Figure 8-26 compares the three kinds of multiple-CPU systems on seven rows. In a <strong>distributed system</strong> each node is a <em>complete computer</em> (CPU, RAM, disk, peripherals), the nodes may be anywhere in the world, they talk over an ordinary network, may run <em>different operating systems</em>, each has its own file system, and they belong to <em>many organisations</em>.</p>
<table>
<thead><tr><th>Item</th><th>Multiprocessor</th><th>Multicomputer</th><th>Distributed system</th></tr></thead>
<tbody>
<tr><td>Node configuration</td><td>CPU</td><td>CPU, RAM, net interface</td><td>complete computer</td></tr>
<tr><td>Node peripherals</td><td>all shared</td><td>shared, exc. maybe disk</td><td>full set per node</td></tr>
<tr><td>Location</td><td>same rack</td><td>same room</td><td>possibly worldwide</td></tr>
<tr><td>Internode communication</td><td>shared RAM</td><td>dedicated interconnect</td><td>traditional network</td></tr>
<tr><td>Operating systems</td><td>one, shared</td><td>multiple, same</td><td>possibly all different</td></tr>
<tr><td>File systems</td><td>one, shared</td><td>one, shared</td><td>each node has own</td></tr>
<tr><td>Administration</td><td>one organization</td><td>one organization</td><td>many organizations</td></tr>
</tbody>
</table>
<p>Read the table as a slider that moves from <em>tightly coupled</em> to <em>loosely coupled</em>. The more loosely coupled, the more independent the parts (good: they can be bought, run, upgraded and fail separately) and the harder they are to program as one machine. A distributed system is what a backend engineer builds: a web shop of ten services, each in its own container, on cloud machines of a data centre in another country.</p>
<p>The gap between the columns is measurable. Memory is the multiprocessor's way of communicating; a network round trip is the distributed system's. Here are both on the <em>same</em> machine — so there is no cable and no router, just the operating system's network code (loopback):</p>
<pre><code class="language-javascript">// One memory access versus one network round trip: how many orders of magnitude apart?
import net from 'node:net';
const N = 1 &lt;&lt; 23;                                     // 8M entries x 4 bytes = 32 MiB, bigger than the CPU caches
const next = new Uint32Array(N);
for (let i = 0; i &lt; N; i++) next[i] = i;
let seed = 12345;                                      // fixed pseudo-random shuffle (Sattolo: one big cycle)
for (let i = N - 1; i &gt; 0; i--) { seed = (Math.imul(seed, 1103515245) + 12345) &gt;&gt;&gt; 0; const j = seed % i; const t = next[i]; next[i] = next[j]; next[j] = t; }
let p = 0; const hops = 5_000_000;
const t0 = process.hrtime.bigint();
for (let i = 0; i &lt; hops; i++) p = next[p];             // every load depends on the previous one: pure latency
const memNs = Number(process.hrtime.bigint() - t0) / hops;
console.log(&#96;memory read (random, 32 MiB): &#36;{memNs.toFixed(0)} ns   [check &#36;{p &gt;= 0}]&#96;);

const srv = net.createServer((s) =&gt; s.on('data', (d) =&gt; s.write(d)));   // echo server on the same machine
await new Promise((r) =&gt; srv.listen(0, '127.0.0.1', r));
const c = net.connect(srv.address().port, '127.0.0.1'); c.setNoDelay(true);
await new Promise((r) =&gt; c.once('connect', r));
const rounds = 20000;
const t1 = process.hrtime.bigint();
for (let i = 0; i &lt; rounds; i++) { c.write('x'); await new Promise((r) =&gt; c.once('data', r)); }
const netNs = Number(process.hrtime.bigint() - t1) / rounds;
console.log(&#96;localhost TCP round trip:     &#36;{(netNs / 1000).toFixed(1)} us&#96;);
console.log(&#96;network is &#36;{(netNs / memNs).toFixed(0)}x slower than memory, and this is the SAME machine (no cable) = &#36;{Math.round(netNs / memNs)}x&#96;);
c.destroy(); srv.close();</code></pre>
<div class="out">$ node do-tre.js<br>
memory read (random, 32 MiB): 126 ns &nbsp;&nbsp;[check true]<br>
localhost TCP round trip: &nbsp;&nbsp;&nbsp;&nbsp;13.1 us<br>
network is 104x slower than memory, and this is the SAME machine (no cable) = 104x</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>A random memory read (every load depends on the previous one, over a 32 MiB array larger than the caches) takes about 126 ns; a TCP round trip to a process on the same machine takes about 13 µs — roughly <strong>100 times slower</strong> before a single metre of wire. Over a real network of 0.5 ms (same data-centre) it is 4,000 times, over 50 ms (between continents) 400,000 times. That is the "factor of a thousand per step" of slide 2 in numbers, and the reason chatty designs (an N+1 pattern of service calls) are slow however fast the servers are.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/91f726d302fe97ae3c15eef6eecbad4886707090.svg" alt="A web shop as a multicomputer: the same ideas on a real backend" loading="lazy" /><p class="chu-thich">🧩 A web shop as a multicomputer: the same ideas on a real backend</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Microservices = a multicomputer: separate machines, no shared memory, RPC / messages between them
title A web shop as a multicomputer (Figure 8-1b on a real backend)
node "Load balancer\\n(nginx)" as LB
node "API gateway" as GW
node "orders service\\n(Spring Boot)" as ORD
node "payment service\\n(Node.js)" as PAY
node "stock service\\n(Spring Boot)" as STK
database "orders DB\\n(PostgreSQL)" as DB1
database "stock DB\\n(PostgreSQL)" as DB2
queue "message broker\\n(RabbitMQ / Kafka)" as MQ
node "email service" as MAIL
LB --&gt; GW : HTTPS
GW --&gt; ORD : REST (RPC in disguise)
ORD --&gt; PAY : gRPC (a REAL RPC with stubs)
ORD --&gt; STK : gRPC
ORD --&gt; DB1
STK --&gt; DB2
ORD ..&gt; MQ : publish "order.created"
MQ ..&gt; MAIL : subscribe "order.*"
note bottom of MQ : publish/subscribe (Figure 8-38):\\nthe order service does not know\\nwho listens, or whether they are up
note right of DB1 : each service owns its data:\\nno shared memory ⇒ no cache coherence,\\nbut also no transaction across services
@enduml</code></pre></details>
<div class="callout">🧭 On a real server: <strong>microservices</strong> are the distributed-system column of this table chosen on purpose — separate processes, separate databases, separate deployments, a network between them. The benefits (teams deploy independently, one service can fail or scale alone) are the "loosely coupled" side of the table; the cost is every remote call of this lesson. A monolith that makes a method call pays 100 ns; split it into two services and that call costs 100,000 ns or more, may fail, and may be retried.</div>
<p class="pitfall">⚠️ The fallacies of distributed computing (Deutsch and others, 1990s) start with "the network is reliable" and "latency is zero". The table's last row, "many organisations", is the one that makes security and trust the hardest part.</p>`,
        `<p class="y-chinh">🎯 Hình 8-26 so sánh ba loại hệ nhiều CPU trên bảy hàng. Trong một <strong>hệ phân tán</strong> mỗi nút là một <em>máy tính hoàn chỉnh</em> (CPU, RAM, đĩa, thiết bị ngoại vi), các nút có thể ở bất cứ đâu trên thế giới, nói chuyện qua mạng thông thường, có thể chạy <em>các hệ điều hành khác nhau</em>, mỗi nút có hệ tệp riêng, và thuộc về <em>nhiều tổ chức</em>.</p>
<table>
<thead><tr><th>Mục</th><th>Multiprocessor</th><th>Multicomputer</th><th>Hệ phân tán</th></tr></thead>
<tbody>
<tr><td>Cấu hình nút</td><td>CPU</td><td>CPU, RAM, giao diện mạng</td><td>máy tính hoàn chỉnh</td></tr>
<tr><td>Thiết bị ngoại vi của nút</td><td>dùng chung hết</td><td>dùng chung, trừ có thể đĩa</td><td>cả bộ cho mỗi nút</td></tr>
<tr><td>Vị trí</td><td>cùng một rack</td><td>cùng một phòng</td><td>có thể khắp thế giới</td></tr>
<tr><td>Giao tiếp giữa các nút</td><td>RAM chung</td><td>mạng liên kết riêng</td><td>mạng truyền thống</td></tr>
<tr><td>Hệ điều hành</td><td>một, dùng chung</td><td>nhiều, giống nhau</td><td>có thể khác nhau hết</td></tr>
<tr><td>Hệ tệp</td><td>một, dùng chung</td><td>một, dùng chung</td><td>mỗi nút có riêng</td></tr>
<tr><td>Quản trị</td><td>một tổ chức</td><td>một tổ chức</td><td>nhiều tổ chức</td></tr>
</tbody>
</table>
<p>Đọc bảng như một thanh trượt từ <em>gắn kết chặt</em> tới <em>gắn kết lỏng</em>. Càng lỏng thì các phần càng độc lập (tốt: có thể mua, chạy, nâng cấp và hỏng riêng) và càng khó lập trình như một máy. Hệ phân tán là thứ kỹ sư backend xây: một cửa hàng web gồm mười service, mỗi service trong một container, trên các máy đám mây của một trung tâm dữ liệu ở nước khác.</p>
<p>Khoảng cách giữa các cột đo được. Bộ nhớ là cách giao tiếp của multiprocessor; vòng đi-về qua mạng là của hệ phân tán. Đây là cả hai trên <em>cùng một</em> máy — nên không có cáp, không có router, chỉ có mã mạng của hệ điều hành (loopback):</p>
<pre><code class="language-javascript">// Một lần truy cập bộ nhớ so với một vòng đi-về qua mạng: cách nhau bao nhiêu bậc độ lớn?
import net from 'node:net';
const N = 1 &lt;&lt; 23;                                     // 8M phần tử x 4 byte = 32 MiB, lớn hơn cache của CPU
const next = new Uint32Array(N);
for (let i = 0; i &lt; N; i++) next[i] = i;
let seed = 12345;                                      // xáo trộn giả ngẫu nhiên cố định (Sattolo: một chu trình lớn)
for (let i = N - 1; i &gt; 0; i--) { seed = (Math.imul(seed, 1103515245) + 12345) &gt;&gt;&gt; 0; const j = seed % i; const t = next[i]; next[i] = next[j]; next[j] = t; }
let p = 0; const hops = 5_000_000;
const t0 = process.hrtime.bigint();
for (let i = 0; i &lt; hops; i++) p = next[p];             // mỗi lần đọc phụ thuộc lần trước: thuần độ trễ
const memNs = Number(process.hrtime.bigint() - t0) / hops;
console.log(&#96;memory read (random, 32 MiB): &#36;{memNs.toFixed(0)} ns   [check &#36;{p &gt;= 0}]&#96;);

const srv = net.createServer((s) =&gt; s.on('data', (d) =&gt; s.write(d)));   // máy chủ echo trên cùng máy
await new Promise((r) =&gt; srv.listen(0, '127.0.0.1', r));
const c = net.connect(srv.address().port, '127.0.0.1'); c.setNoDelay(true);
await new Promise((r) =&gt; c.once('connect', r));
const rounds = 20000;
const t1 = process.hrtime.bigint();
for (let i = 0; i &lt; rounds; i++) { c.write('x'); await new Promise((r) =&gt; c.once('data', r)); }
const netNs = Number(process.hrtime.bigint() - t1) / rounds;
console.log(&#96;localhost TCP round trip:     &#36;{(netNs / 1000).toFixed(1)} us&#96;);
console.log(&#96;network is &#36;{(netNs / memNs).toFixed(0)}x slower than memory, and this is the SAME machine (no cable) = &#36;{Math.round(netNs / memNs)}x&#96;);
c.destroy(); srv.close();</code></pre>
<div class="out">$ node do-tre.js<br>
memory read (random, 32 MiB): 126 ns &nbsp;&nbsp;[check true]<br>
localhost TCP round trip: &nbsp;&nbsp;&nbsp;&nbsp;13.1 us<br>
network is 104x slower than memory, and this is the SAME machine (no cable) = 104x</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Một lần đọc bộ nhớ ngẫu nhiên (mỗi lần đọc phụ thuộc lần trước, trên mảng 32 MiB lớn hơn cache) mất khoảng 126 ns; một vòng đi-về TCP tới một tiến trình trên cùng máy mất khoảng 13 µs — chậm gấp khoảng <strong>100 lần</strong> trước khi có một mét dây nào. Qua mạng thật 0,5 ms (cùng trung tâm dữ liệu) là 4.000 lần, qua 50 ms (giữa các châu lục) là 400.000 lần. Đó là "hệ số một nghìn mỗi bước" của slide 2 bằng con số, và là lý do các thiết kế lắm lời (mẫu N+1 lời gọi service) chậm dù server nhanh đến đâu.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/91f726d302fe97ae3c15eef6eecbad4886707090.svg" alt="Một cửa hàng web như một multicomputer: cùng các ý tưởng trên một backend thật" loading="lazy" /><p class="chu-thich">🧩 Một cửa hàng web như một multicomputer: cùng các ý tưởng trên một backend thật</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Microservices = một multicomputer: các máy riêng, không chia sẻ bộ nhớ, giữa chúng là RPC / thông điệp
title A web shop as a multicomputer (Figure 8-1b on a real backend)
node "Load balancer\\n(nginx)" as LB
node "API gateway" as GW
node "orders service\\n(Spring Boot)" as ORD
node "payment service\\n(Node.js)" as PAY
node "stock service\\n(Spring Boot)" as STK
database "orders DB\\n(PostgreSQL)" as DB1
database "stock DB\\n(PostgreSQL)" as DB2
queue "message broker\\n(RabbitMQ / Kafka)" as MQ
node "email service" as MAIL
LB --&gt; GW : HTTPS
GW --&gt; ORD : REST (RPC in disguise)
ORD --&gt; PAY : gRPC (a REAL RPC with stubs)
ORD --&gt; STK : gRPC
ORD --&gt; DB1
STK --&gt; DB2
ORD ..&gt; MQ : publish "order.created"
MQ ..&gt; MAIL : subscribe "order.*"
note bottom of MQ : publish/subscribe (Figure 8-38):\\nthe order service does not know\\nwho listens, or whether they are up
note right of DB1 : each service owns its data:\\nno shared memory ⇒ no cache coherence,\\nbut also no transaction across services
@enduml</code></pre></details>
<div class="callout">🧭 Trên server thật: <strong>microservices</strong> là cột hệ phân tán của bảng này được chọn có chủ ý — tiến trình riêng, cơ sở dữ liệu riêng, triển khai riêng, một mạng ở giữa. Lợi ích (các nhóm triển khai độc lập, một service hỏng hay mở rộng riêng) là phía "gắn kết lỏng" của bảng; cái giá là mỗi lời gọi từ xa của bài này. Một monolith gọi phương thức tốn 100 ns; tách thành hai service thì lời gọi đó tốn 100.000 ns hoặc hơn, có thể lỗi, và có thể bị thử lại.</div>
<p class="pitfall">⚠️ Các ngộ nhận của tính toán phân tán (Deutsch và cộng sự, thập niên 1990) bắt đầu bằng "mạng đáng tin" và "độ trễ bằng không". Hàng cuối của bảng, "nhiều tổ chức", là hàng khiến bảo mật và niềm tin thành phần khó nhất.</p>`],
      [34, 'Distributed Systems (2)',
        `<p class="y-chinh">🎯 Figure 8-27 — <strong>middleware</strong> is a layer of software that sits <strong>between the applications and the operating systems</strong> of the nodes, giving all applications a common base: whichever OS and processor each node has (the figure shows Windows/Pentium, Linux/Pentium, Solaris/SPARC and Mac OS/Macintosh), the application sees the same abstractions.</p>
<p>A distributed system's nodes are different machines with different operating systems, but a programmer wants to write <em>one</em> program. Middleware makes the difference disappear: it offers a uniform model — documents, files, objects, tuples, messages — on every node, in the same way that an operating system offers files and processes on top of different disks. Its job is to hide <em>heterogeneity</em> (different OS, hardware, languages) and to give <em>transparency</em> (location, failure, replication). The next slides show the book's four models: <strong>document-based</strong> (the Web), <strong>file-system-based</strong>, <strong>object-based</strong> (CORBA) and <strong>coordination-based</strong> (Linda, publish/subscribe).</p>
<p>The figure is dated: Solaris on SPARC and PowerPC Macs are museum pieces. Redraw it for a 2026 backend: the four boxes would be <em>Linux on x86-64</em>, <em>Linux on ARM64</em> (AWS Graviton, Apple silicon), <em>Windows</em> and <em>macOS on ARM64</em>; the layer in the middle might be <strong>the Java Virtual Machine</strong>, <strong>Node.js</strong>, <strong>containers</strong> (Docker/OCI images hide the distribution of the host), <strong>Kubernetes</strong> (a common API to schedule, name and discover services over any cloud), <strong>gRPC / HTTP</strong> (a common way to call across languages) and <strong>message brokers</strong>. The idea of the figure is more alive than ever; only the example boxes aged.</p>
<p>Notice how much of this course is middleware thinking: a JVM class compiled once runs on Windows and Linux; a Docker image built on a Mac runs on a Linux server — <em>after we checked the architecture inside</em> (a classic failure: an image built against the wrong C library builds green and then crashes at start — "a green build does not mean the image runs").</p>
<div class="out"># How many processors does THIS machine have, and does it have NUMA nodes?<br>
$ echo "CPUs online: $(nproc) &nbsp;(list: $(cat /sys/devices/system/cpu/online))"<br>
CPUs online: 10 &nbsp;(list: 0-9)<br>
$ lscpu | grep -E "^(Architecture|CPU\\(s\\)|Thread\\(s\\) per core|Core\\(s\\) per|Socket|Model name)"<br>
Architecture: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;aarch64<br>
CPU(s): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
Model name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
Thread(s) per core: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Core(s) per cluster: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
Socket(s): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
# On a NUMA server this directory has node0, node1, ...; a laptop or a small VM has one node or none<br>
$ if [ -d /sys/devices/system/node ]; then echo "NUMA nodes: $(ls -d /sys/devices/system/node/node* | wc -l)"; else echo "NUMA nodes: none exposed (no /sys/devices/system/node)"; fi<br>
NUMA nodes: none exposed (no /sys/devices/system/node)<br>
# Cache coherence works on whole cache LINES; how big is one line here?<br>
$ cat /sys/devices/system/cpu/cpu0/cache/index0/coherency_line_size 2&gt;/dev/null || echo "(sysfs does not report the line size in this VM)"<br>
(sysfs does not report the line size in this VM)<br>
# All CPUs see ONE address space: the same /proc/meminfo, whichever CPU runs the command<br>
$ taskset -c 0 grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
$ taskset -c 5 grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The program above (run on slide 3) shows <code>aarch64</code>. The same image on a PC would be <code>x86_64</code>; middleware (Docker's multi-arch images, a JVM) is what lets one source/artifact serve both.</p>
<div class="callout">🧭 On a real server: when you choose a base image (<code>eclipse-temurin:21</code> instead of installing Java by hand; <code>node:22-alpine</code> vs <code>node:22-bookworm</code>), you pick the middleware layer of Figure 8-27. The musl/glibc difference between those two Node images is the classic way a "portable" layer is not portable enough — a native Prisma or sharp binary built for one libc does not start on the other.</div>
<p class="meo">🧠 Middleware = <em>"the operating system of the distributed system"</em> — not part of any node's OS, yet what applications really program against.</p>`,
        `<p class="y-chinh">🎯 Hình 8-27 — <strong>middleware</strong> là một tầng phần mềm nằm <strong>giữa các ứng dụng và hệ điều hành</strong> của các nút, cho mọi ứng dụng một nền chung: dù mỗi nút có HĐH và bộ xử lý nào (hình cho thấy Windows/Pentium, Linux/Pentium, Solaris/SPARC và Mac OS/Macintosh), ứng dụng vẫn thấy cùng các trừu tượng.</p>
<p>Các nút của hệ phân tán là những máy khác nhau với hệ điều hành khác nhau, nhưng lập trình viên muốn viết <em>một</em> chương trình. Middleware làm khác biệt biến mất: nó cung cấp một mô hình thống nhất — tài liệu, tệp, đối tượng, tuple, thông điệp — trên mọi nút, như HĐH cung cấp tệp và tiến trình trên các đĩa khác nhau. Việc của nó là giấu <em>tính không đồng nhất</em> (HĐH, phần cứng, ngôn ngữ khác nhau) và cho <em>tính trong suốt</em> (vị trí, lỗi, nhân bản). Các slide sau cho thấy bốn mô hình của sách: <strong>dựa trên tài liệu</strong> (Web), <strong>dựa trên hệ tệp</strong>, <strong>dựa trên đối tượng</strong> (CORBA) và <strong>dựa trên điều phối</strong> (Linda, publish/subscribe).</p>
<p>Hình đã cũ: Solaris trên SPARC và máy Mac PowerPC là đồ bảo tàng. Vẽ lại cho một backend năm 2026: bốn ô sẽ là <em>Linux trên x86-64</em>, <em>Linux trên ARM64</em> (AWS Graviton, Apple silicon), <em>Windows</em> và <em>macOS trên ARM64</em>; tầng ở giữa có thể là <strong>Máy ảo Java (JVM)</strong>, <strong>Node.js</strong>, <strong>container</strong> (ảnh Docker/OCI giấu sự khác biệt của máy chủ), <strong>Kubernetes</strong> (một API chung để xếp lịch, đặt tên và khám phá service trên bất kỳ đám mây nào), <strong>gRPC / HTTP</strong> (cách gọi chung xuyên ngôn ngữ) và <strong>message broker</strong>. Ý tưởng của hình còn sống hơn bao giờ hết; chỉ các ô ví dụ đã già.</p>
<p>Để ý bao nhiêu phần của môn này là tư duy middleware: một lớp Java biên dịch một lần chạy trên Windows và Linux; một ảnh Docker dựng trên Mac chạy trên server Linux — <em>sau khi ta kiểm kiến trúc bên trong</em> (một lỗi kinh điển: ảnh dựng với sai thư viện C vẫn dựng xanh rồi sập lúc khởi động — "dựng xanh không có nghĩa ảnh chạy được").</p>
<div class="out"># Máy NÀY có bao nhiêu bộ xử lý, và có node NUMA không?<br>
$ echo "CPUs online: $(nproc) &nbsp;(list: $(cat /sys/devices/system/cpu/online))"<br>
CPUs online: 10 &nbsp;(list: 0-9)<br>
$ lscpu | grep -E "^(Architecture|CPU\\(s\\)|Thread\\(s\\) per core|Core\\(s\\) per|Socket|Model name)"<br>
Architecture: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;aarch64<br>
CPU(s): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
Model name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
Thread(s) per core: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Core(s) per cluster: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
Socket(s): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
# Trên server NUMA thư mục này có node0, node1, ...; laptop hay VM nhỏ có một node hoặc không có<br>
$ if [ -d /sys/devices/system/node ]; then echo "NUMA nodes: $(ls -d /sys/devices/system/node/node* | wc -l)"; else echo "NUMA nodes: none exposed (no /sys/devices/system/node)"; fi<br>
NUMA nodes: none exposed (no /sys/devices/system/node)<br>
# Đồng bộ cache làm việc theo cả DÒNG cache; một dòng ở đây dài bao nhiêu?<br>
$ cat /sys/devices/system/cpu/cpu0/cache/index0/coherency_line_size 2&gt;/dev/null || echo "(sysfs does not report the line size in this VM)"<br>
(sysfs does not report the line size in this VM)<br>
# Mọi CPU thấy MỘT không gian địa chỉ: cùng /proc/meminfo, dù CPU nào chạy lệnh<br>
$ taskset -c 0 grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
$ taskset -c 5 grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Chương trình trên (đã chạy ở slide 3) cho thấy <code>aarch64</code>. Cùng ảnh đó trên PC sẽ là <code>x86_64</code>; middleware (ảnh Docker đa kiến trúc, JVM) là thứ cho một mã nguồn/artifact phục vụ cả hai.</p>
<div class="callout">🧭 Trên server thật: khi bạn chọn ảnh nền (<code>eclipse-temurin:21</code> thay vì tự cài Java; <code>node:22-alpine</code> so với <code>node:22-bookworm</code>), bạn chọn tầng middleware của Hình 8-27. Khác biệt musl/glibc giữa hai ảnh Node đó là cách kinh điển để một tầng "khả chuyển" chưa đủ khả chuyển — một binary gốc của Prisma hay sharp dựng cho một libc không khởi động được trên libc kia.</div>
<p class="meo">🧠 Middleware = <em>"hệ điều hành của hệ phân tán"</em> — không thuộc HĐH của nút nào, nhưng là thứ ứng dụng thật sự lập trình trên đó.</p>`],
      [35, 'Network Hardware: Ethernet',
        `<p class="y-chinh">🎯 Figure 8-28 — <strong>Ethernet</strong>: (a) <strong>classic Ethernet</strong>, where all computers hang on one shared cable (the "vampire tap" clamps into the coaxial cable) and must take turns; (b) <strong>switched Ethernet</strong>, where every computer has its own cable to a <strong>switch</strong> that forwards frames only to the port of the destination.</p>
<p>Ethernet (Robert Metcalfe, Xerox PARC, 1973–76) was a shared bus: every frame was heard by every machine, and a machine wanting to send first listened to the cable; if two sent at once the signals collided, both noticed (<em>collision detection</em>), waited a random time (<em>binary exponential back-off</em>) and tried again — the CSMA/CD protocol. Classic Ethernet worked at 10 Mbit/s and its total throughput was shared. A switch (b) learns which MAC address lives behind which port and sends each frame only there: many conversations can run at the same time on full-speed links, there are no collisions, and each link can run full duplex. That is why the shared cable and the <code>vampire tap</code> of the picture belong to a museum while the <em>name</em> and the <em>frame format</em> survived.</p>
<p>The slide's speeds are history. Modern Ethernet: 1 Gbit/s on every laptop, 10/25 Gbit/s on servers, 100 Gbit/s on the data-centre spine, <strong>400 Gbit/s</strong> standardised as IEEE 802.3bs (approved 6 December 2017) and <strong>800 Gbit/s</strong> in IEEE 802.3df (approved February 2024). Look at the "card" of your machine and its counters — the program of slide 22 printed them. The frame itself (14-byte header: destination MAC, source MAC, type) is built byte by byte on slide 38.</p>
<p>➕ Where the ideas went. Wi-Fi is "wireless Ethernet" that kept CSMA but with collision <em>avoidance</em> (CSMA/CA) because a radio cannot listen while it talks; the shared-medium problem is still alive in every Wi-Fi network. In a data centre, <em>every server connects to a top-of-rack switch</em> — switched Ethernet at scale — and your two microservices on different racks communicate through two or three such switches (the leaf–spine network of slide 20).</p>
<p class="pitfall">⚠️ A <strong>switch</strong> forwards frames by MAC address inside one network; a <strong>router</strong> forwards packets by IP address between networks (next slide). A home "router" box is both, plus Wi-Fi and a firewall.</p>`,
        `<p class="y-chinh">🎯 Hình 8-28 — <strong>Ethernet</strong>: (a) <strong>Ethernet cổ điển</strong>, nơi mọi máy tính treo trên một sợi cáp chung (chiếc "vampire tap" kẹp vào cáp đồng trục) và phải lần lượt thay phiên; (b) <strong>Ethernet chuyển mạch</strong>, nơi mỗi máy tính có cáp riêng tới một <strong>switch</strong> chỉ chuyển khung tới cổng của đích.</p>
<p>Ethernet (Robert Metcalfe, Xerox PARC, 1973–76) từng là một bus chung: mọi khung đều được mọi máy nghe thấy, và máy muốn gửi trước hết nghe cáp; nếu hai máy gửi cùng lúc thì tín hiệu va nhau, cả hai nhận ra (<em>phát hiện va chạm</em>), chờ một thời gian ngẫu nhiên (<em>lùi mũ nhị phân</em>) rồi thử lại — giao thức CSMA/CD. Ethernet cổ điển chạy 10 Mbit/s và tổng thông lượng được chia chung. Một switch (b) học xem địa chỉ MAC nào nằm sau cổng nào và chỉ gửi mỗi khung tới đó: nhiều cuộc hội thoại chạy cùng lúc trên các liên kết tốc độ đầy đủ, không có va chạm, và mỗi liên kết chạy song công. Vì thế cáp chung và <code>vampire tap</code> trong hình thuộc bảo tàng trong khi <em>cái tên</em> và <em>khuôn dạng khung</em> vẫn sống.</p>
<p>Tốc độ trên slide là lịch sử. Ethernet hiện đại: 1 Gbit/s trên mọi laptop, 10/25 Gbit/s trên server, 100 Gbit/s ở xương sống trung tâm dữ liệu, <strong>400 Gbit/s</strong> được chuẩn hoá bởi IEEE 802.3bs (phê duyệt 6/12/2017) và <strong>800 Gbit/s</strong> ở IEEE 802.3df (phê duyệt tháng 2/2024). Hãy nhìn "card" của máy bạn và các bộ đếm của nó — chương trình ở slide 22 đã in chúng. Bản thân khung (header 14 byte: MAC đích, MAC nguồn, kiểu) được dựng từng byte ở slide 38.</p>
<p>➕ Các ý tưởng đã đi đâu. Wi-Fi là "Ethernet không dây" giữ CSMA nhưng với <em>tránh</em> va chạm (CSMA/CA) vì radio không nghe được khi đang phát; bài toán môi trường chung vẫn sống trong mọi mạng Wi-Fi. Trong trung tâm dữ liệu, <em>mỗi server nối vào một switch đầu tủ</em> — Ethernet chuyển mạch ở quy mô lớn — và hai microservice của bạn ở hai rack khác nhau giao tiếp qua hai hay ba switch như vậy (mạng leaf–spine ở slide 20).</p>
<p class="pitfall">⚠️ <strong>Switch</strong> chuyển khung theo địa chỉ MAC trong một mạng; <strong>router</strong> chuyển gói theo địa chỉ IP giữa các mạng (slide kế). Cái hộp "router" ở nhà là cả hai, cộng Wi-Fi và tường lửa.</p>`],
      [36, 'The Internet',
        `<p class="y-chinh">🎯 Figure 8-29 — a portion of the <strong>Internet</strong>: hosts on local Ethernets, joined by <strong>routers</strong>, to regional networks, to the high-bandwidth fibre <strong>backbone</strong>; home users reach it through an ISP over ADSL (or cable, or fibre). The Internet is a <em>network of networks</em>.</p>
<p>No one owns the Internet. Thousands of independent networks — Autonomous Systems (AS) run by ISPs, universities, clouds, companies — agree to exchange packets using one protocol family, <strong>IP</strong>. A packet from your laptop goes through the Wi-Fi to your home router, to your ISP, perhaps to a larger carrier, across a backbone, down to a data centre and its switches, to the server — typically 10–20 <em>hops</em>. At each hop a <strong>router</strong> reads the destination IP address, looks it up in a <em>routing table</em> and forwards the packet to the next router — store-and-forward again (slide 21). Routers learn the tables from each other with routing protocols (BGP between networks). There is no central map and no guaranteed path: each packet may take a different route, and routers may drop packets when overloaded (<em>best effort</em>).</p>
<p>This is what the course container showed on slide 22: <code>default via 172.17.0.1</code> is the "first router"; every address not on the local network goes to it. The picture's ADSL is obsolete in most countries (fibre to the home, 4G/5G); the structure — access, regional, backbone — is the same, with big clouds (and CDNs) now placed <em>at the edge</em>, close to users.</p>
<div class="callout">🧭 On a real server: three numbers decide the experience of a web request. <strong>DNS lookup</strong> (a name to an IP: 1 round trip, often cached), <strong>TCP/TLS setup</strong> (1–3 round trips before the first byte of the request), and the <strong>request itself</strong> (1 round trip). From Vietnam to a server in Singapore the physical minimum round trip is about 2 × 1,500 km ÷ 200,000 km/s ≈ 15 ms; to a US data centre, about 150–200 ms in practice — why CDNs, regional deployments and HTTP keep-alive/HTTP/2 exist. Reduce <em>round trips</em>, not bytes.</div>
<p class="pitfall">⚠️ "The Internet = the Web" is wrong: the Web (HTTP) is one application on the Internet; email (SMTP), SSH, DNS, game traffic and your Kubernetes control plane are others.</p>`,
        `<p class="y-chinh">🎯 Hình 8-29 — một phần của <strong>Internet</strong>: các máy (host) trên Ethernet cục bộ, nối bằng <strong>router</strong> tới các mạng vùng, tới <strong>xương sống (backbone)</strong> sợi quang băng thông cao; người dùng gia đình tới được nó qua một ISP bằng ADSL (hoặc cáp, hoặc sợi quang). Internet là một <em>mạng của các mạng</em>.</p>
<p>Không ai sở hữu Internet. Hàng nghìn mạng độc lập — các Hệ tự trị (Autonomous System, AS) do ISP, trường đại học, đám mây, công ty điều hành — đồng ý trao đổi gói bằng một họ giao thức, <strong>IP</strong>. Một gói từ laptop của bạn đi qua Wi-Fi tới router nhà, tới ISP, có thể tới một nhà mạng lớn hơn, băng qua xương sống, xuống một trung tâm dữ liệu và các switch của nó, tới server — thường 10–20 <em>chặng (hop)</em>. Ở mỗi chặng một <strong>router</strong> đọc địa chỉ IP đích, tra trong <em>bảng định tuyến</em> và chuyển gói tới router kế — lại store-and-forward (slide 21). Các router học bảng từ nhau bằng giao thức định tuyến (BGP giữa các mạng). Không có bản đồ trung tâm và không có đường đi được đảm bảo: mỗi gói có thể đi đường khác nhau, và router có thể bỏ gói khi quá tải (<em>best effort</em>).</p>
<p>Đây là điều container của môn đã cho thấy ở slide 22: <code>default via 172.17.0.1</code> là "router đầu tiên"; mọi địa chỉ không thuộc mạng cục bộ đều đi tới nó. ADSL trong hình đã lỗi thời ở hầu hết các nước (cáp quang tới nhà, 4G/5G); cấu trúc — truy cập, vùng, xương sống — vẫn thế, với các đám mây lớn (và CDN) nay đặt <em>ở biên</em>, gần người dùng.</p>
<div class="callout">🧭 Trên server thật: ba con số quyết định trải nghiệm của một yêu cầu web. <strong>Tra DNS</strong> (tên ra IP: 1 vòng đi-về, thường được cache), <strong>thiết lập TCP/TLS</strong> (1–3 vòng đi-về trước byte đầu tiên của yêu cầu), và <strong>chính yêu cầu</strong> (1 vòng đi-về). Từ Việt Nam tới server ở Singapore, vòng đi-về tối thiểu theo vật lý khoảng 2 × 1.500 km ÷ 200.000 km/s ≈ 15 ms; tới một trung tâm dữ liệu ở Mỹ, trong thực tế khoảng 150–200 ms — lý do CDN, triển khai theo vùng và HTTP keep-alive/HTTP/2 tồn tại. Hãy giảm <em>số vòng đi-về</em>, không phải số byte.</div>
<p class="pitfall">⚠️ "Internet = Web" là sai: Web (HTTP) là một ứng dụng trên Internet; email (SMTP), SSH, DNS, lưu lượng game và control plane Kubernetes của bạn là những ứng dụng khác.</p>`],
      [37, 'Network Services',
        `<p class="y-chinh">🎯 Figure 8-30 — <strong>six types of network service</strong>, in two families. <strong>Connection-oriented</strong> (set up, use, tear down): <em>reliable message stream</em> (sequence of pages of a book), <em>reliable byte stream</em> (remote login), <em>unreliable connection</em> (digitised voice). <strong>Connectionless</strong>: <em>unreliable datagram</em> (network test packets), <em>acknowledged datagram</em> (registered mail), <em>request-reply</em> (database query).</p>
<p>The six are the combinations of three questions: Is there a <em>connection</em> (a conversation with state) or are messages independent? Is delivery <em>reliable</em> (lost data are resent, order is kept) or best effort? Are the units <em>messages</em> (boundaries kept) or a <em>byte stream</em> (boundaries lost)? Digitised voice is the surprising entry: an <em>unreliable connection</em> — in a phone call it is better to lose a few milliseconds of sound than to wait for a retransmission that arrives too late.</p>
<p>Map them to what you use. <strong>TCP</strong> = reliable byte stream (HTTP, SSH, PostgreSQL's wire protocol, Redis). <strong>UDP</strong> = unreliable datagram (DNS queries, video calls, games, QUIC underneath HTTP/3). <strong>HTTP request–response</strong> = request-reply (carried on TCP). <strong>SCTP</strong> is the reliable <em>message</em> stream (rarely used outside telecom). Seeing the two main ones on the loopback interface, the difference of "message boundaries" is easy to measure: three sends of six letters each, once as UDP datagrams and once as three TCP writes:</p>
<pre><code class="language-javascript">// Figure 8-30: a datagram service keeps message BOUNDARIES; a byte-stream service does not
import dgram from 'node:dgram';
import net from 'node:net';

const udpIn = dgram.createSocket('udp4'); const got = [];
udpIn.on('message', (m) =&gt; got.push(m.toString()));
await new Promise((r) =&gt; udpIn.bind(0, '127.0.0.1', r));
const udpOut = dgram.createSocket('udp4');
for (const m of ['AAAAAA', 'BBBBBB', 'CCCCCC']) udpOut.send(m, udpIn.address().port, '127.0.0.1');   // 3 sends
await new Promise((r) =&gt; setTimeout(r, 100));
console.log(&#96;UDP: receiver got &#36;{got.length} messages: &#36;{JSON.stringify(got)}&#96;);

const chunks = [];
const srv = net.createServer((s) =&gt; s.on('data', (d) =&gt; chunks.push(d.toString())));
await new Promise((r) =&gt; srv.listen(0, '127.0.0.1', r));
const c = net.connect(srv.address().port, '127.0.0.1');
await new Promise((r) =&gt; c.once('connect', r));
c.setNoDelay(false);
for (const m of ['AAAAAA', 'BBBBBB', 'CCCCCC']) c.write(m);                                          // also 3 writes
await new Promise((r) =&gt; setTimeout(r, 100));
console.log(&#96;TCP: receiver got &#36;{chunks.join('').length} bytes in &#36;{chunks.length} read event(s): &#36;{JSON.stringify(chunks)}  &lt;- the 3 writes are NOT 3 messages&#96;);
c.destroy(); srv.close(); udpIn.close(); udpOut.close();</code></pre>
<div class="out">$ node luong-vs-goi.js<br>
UDP: receiver got 3 messages: ["AAAAAA","BBBBBB","CCCCCC"]<br>
TCP: receiver got 18 bytes in 1 read event(s): ["AAAAAABBBBBBCCCCCC"] &nbsp;&lt;- the 3 writes are NOT 3 messages</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>UDP delivers three separate messages — the receiver's <code>message</code> event fires once per datagram. TCP delivers 18 bytes as <em>one</em> read event ("AAAAAABBBBBBCCCCCC"): the three writes became one stream, and the receiver cannot tell where one message ended. (In a cached run TCP coalesced them; another run might split them differently — you must not rely on the boundaries.) So every protocol on TCP has to mark its own message boundaries: HTTP uses <code>Content-Length</code> or chunk sizes; our RPC of slide 25 used "one JSON per line"; PostgreSQL puts a length in every message.</p>
<p>The other axis, reliability, is paid for in round trips and waiting: TCP numbers every byte, acknowledges, retransmits and slows down when it detects loss; UDP does none of that and leaves it to the application — which is exactly what QUIC (HTTP/3) rebuilt on top of UDP with TLS and multiplexed streams.</p>
<p class="meo">🧠 When someone says "we use TCP so we do not lose messages", ask: <em>what is a message in a byte stream?</em> TCP keeps the bytes in order, not your message boundaries.</p>
<p class="pitfall">⚠️ "Reliable" in TCP means "delivered in order or the connection reports failure" — not "the other side processed it". An acknowledged byte may still sit unread in the receiver's kernel buffer when the receiver process crashes.</p>`,
        `<p class="y-chinh">🎯 Hình 8-30 — <strong>sáu loại dịch vụ mạng</strong>, trong hai họ. <strong>Hướng kết nối (connection-oriented)</strong> (thiết lập, dùng, huỷ): <em>dòng thông điệp tin cậy</em> (dãy các trang của một cuốn sách), <em>dòng byte tin cậy</em> (đăng nhập từ xa), <em>kết nối không tin cậy</em> (giọng nói số hoá). <strong>Không kết nối (connectionless)</strong>: <em>datagram không tin cậy</em> (gói thử mạng), <em>datagram có xác nhận</em> (thư bảo đảm), <em>yêu cầu–trả lời</em> (truy vấn cơ sở dữ liệu).</p>
<p>Sáu loại là các tổ hợp của ba câu hỏi: Có <em>kết nối</em> (một cuộc hội thoại có trạng thái) hay các thông điệp độc lập? Việc chuyển có <em>tin cậy</em> (dữ liệu mất được gửi lại, giữ thứ tự) hay cố hết sức? Đơn vị là <em>thông điệp</em> (giữ ranh giới) hay <em>dòng byte</em> (mất ranh giới)? Giọng nói số hoá là mục gây ngạc nhiên: một <em>kết nối không tin cậy</em> — trong cuộc gọi điện, mất vài mili giây âm thanh còn hơn chờ một lần gửi lại tới quá trễ.</p>
<p>Ánh xạ chúng sang thứ bạn dùng. <strong>TCP</strong> = dòng byte tin cậy (HTTP, SSH, giao thức dây của PostgreSQL, Redis). <strong>UDP</strong> = datagram không tin cậy (truy vấn DNS, gọi video, game, QUIC bên dưới HTTP/3). <strong>HTTP yêu cầu–phản hồi</strong> = yêu cầu–trả lời (chở trên TCP). <strong>SCTP</strong> là dòng <em>thông điệp</em> tin cậy (hiếm dùng ngoài viễn thông). Nhìn hai loại chính trên giao diện loopback, khác biệt về "ranh giới thông điệp" đo được dễ dàng: ba lần gửi sáu chữ cái, một lần bằng datagram UDP và một lần bằng ba lệnh ghi TCP:</p>
<pre><code class="language-javascript">// Hình 8-30: dịch vụ datagram giữ RANH GIỚI thông điệp; dịch vụ dòng byte thì không
import dgram from 'node:dgram';
import net from 'node:net';

const udpIn = dgram.createSocket('udp4'); const got = [];
udpIn.on('message', (m) =&gt; got.push(m.toString()));
await new Promise((r) =&gt; udpIn.bind(0, '127.0.0.1', r));
const udpOut = dgram.createSocket('udp4');
for (const m of ['AAAAAA', 'BBBBBB', 'CCCCCC']) udpOut.send(m, udpIn.address().port, '127.0.0.1');   // 3 lần gửi
await new Promise((r) =&gt; setTimeout(r, 100));
console.log(&#96;UDP: receiver got &#36;{got.length} messages: &#36;{JSON.stringify(got)}&#96;);

const chunks = [];
const srv = net.createServer((s) =&gt; s.on('data', (d) =&gt; chunks.push(d.toString())));
await new Promise((r) =&gt; srv.listen(0, '127.0.0.1', r));
const c = net.connect(srv.address().port, '127.0.0.1');
await new Promise((r) =&gt; c.once('connect', r));
c.setNoDelay(false);
for (const m of ['AAAAAA', 'BBBBBB', 'CCCCCC']) c.write(m);                                          // cũng 3 lần ghi
await new Promise((r) =&gt; setTimeout(r, 100));
console.log(&#96;TCP: receiver got &#36;{chunks.join('').length} bytes in &#36;{chunks.length} read event(s): &#36;{JSON.stringify(chunks)}  &lt;- the 3 writes are NOT 3 messages&#96;);
c.destroy(); srv.close(); udpIn.close(); udpOut.close();</code></pre>
<div class="out">$ node luong-vs-goi.js<br>
UDP: receiver got 3 messages: ["AAAAAA","BBBBBB","CCCCCC"]<br>
TCP: receiver got 18 bytes in 1 read event(s): ["AAAAAABBBBBBCCCCCC"] &nbsp;&lt;- the 3 writes are NOT 3 messages</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>UDP giao ba thông điệp riêng — sự kiện <code>message</code> của bên nhận nổ một lần cho mỗi datagram. TCP giao 18 byte trong <em>một</em> sự kiện đọc ("AAAAAABBBBBBCCCCCC"): ba lệnh ghi thành một dòng, và bên nhận không biết một thông điệp kết thúc ở đâu. (Trong lần chạy được lưu TCP gộp chúng; lần chạy khác có thể tách khác — bạn không được dựa vào ranh giới.) Vì vậy mọi giao thức trên TCP phải tự đánh dấu ranh giới thông điệp: HTTP dùng <code>Content-Length</code> hoặc cỡ chunk; RPC của ta ở slide 25 dùng "mỗi dòng một JSON"; PostgreSQL ghi một độ dài vào mỗi thông điệp.</p>
<p>Trục kia, độ tin cậy, trả bằng số vòng đi-về và thời gian chờ: TCP đánh số mọi byte, xác nhận, gửi lại và chậm lại khi phát hiện mất gói; UDP không làm gì thế và để ứng dụng tự lo — đúng là thứ QUIC (HTTP/3) dựng lại trên UDP cùng TLS và các luồng ghép kênh.</p>
<p class="meo">🧠 Khi ai đó nói "ta dùng TCP nên không mất thông điệp", hãy hỏi: <em>thông điệp là gì trong một dòng byte?</em> TCP giữ các byte đúng thứ tự, không giữ ranh giới thông điệp của bạn.</p>
<p class="pitfall">⚠️ "Tin cậy" trong TCP nghĩa là "chuyển đúng thứ tự hoặc kết nối báo lỗi" — không phải "bên kia đã xử lý nó". Một byte đã được xác nhận vẫn có thể nằm chưa đọc trong bộ đệm nhân của bên nhận khi tiến trình nhận sập.</p>`],
      [38, 'Network Protocols',
        `<p class="y-chinh">🎯 Figure 8-31 — <strong>accumulation of packet headers</strong>: a message on a host gets a <strong>TCP header</strong> (ports, sequence numbers), then an <strong>IP header</strong> (source and destination address), then an <strong>Ethernet header</strong> (MAC addresses) as it goes down the layers; each router along the way strips and rebuilds the lowest header, but leaves the IP and TCP headers.</p>
<p>A protocol is an agreement about the format and order of messages. Layered protocols let each layer solve one problem: Ethernet gets a frame to the next machine on the <em>same cable/switch</em>; IP gets a packet <em>across networks</em>; TCP gets a reliable stream <em>between two programs</em> (it adds port numbers to name the program); the application protocol (HTTP) gives meaning to the bytes. Going down, every layer <strong>wraps</strong> the data of the layer above with its own header — like putting a letter in an envelope, then in a larger envelope with another address.</p>
<p>Here is a real frame built byte by byte, in 25 lines of Node.js — a 5-byte message "hello" from 10.0.0.1:51000 to 10.0.0.2:80 — and checked by recomputing the IP header checksum (the sum of the header's 16-bit words must verify to 0xffff):</p>
<pre><code class="language-javascript">// Figure 8-31: build the headers by hand — Ethernet + IPv4 + TCP around a 5-byte message
const msg = Buffer.from('hello');
const tcp = Buffer.alloc(20); tcp.writeUInt16BE(51000, 0); tcp.writeUInt16BE(80, 2); tcp.writeUInt32BE(1, 4); tcp.writeUInt32BE(1, 8); tcp[12] = 5 &lt;&lt; 4; tcp[13] = 0x18; tcp.writeUInt16BE(65535, 14);   // src port, dst port 80, seq, ack, header 5 words, PSH+ACK, window
const ip = Buffer.alloc(20); ip[0] = 0x45; ip.writeUInt16BE(20 + 20 + msg.length, 2); ip[8] = 64; ip[9] = 6; ip.set([10, 0, 0, 1], 12); ip.set([10, 0, 0, 2], 16);   // version 4 + 5 words, total length, TTL 64, protocol 6 = TCP
let sum = 0; for (let i = 0; i &lt; 20; i += 2) sum += ip.readUInt16BE(i); while (sum &gt; 0xffff) sum = (sum &amp; 0xffff) + (sum &gt;&gt; 16); ip.writeUInt16BE(~sum &amp; 0xffff, 10);   // header checksum
const eth = Buffer.alloc(14); eth.set([0x02, 0, 0, 0, 0, 2], 0); eth.set([0x02, 0, 0, 0, 0, 1], 6); eth.writeUInt16BE(0x0800, 12);   // dst MAC, src MAC, type 0x0800 = IPv4
const frame = Buffer.concat([eth, ip, tcp, msg]);
const hex = (b) =&gt; [...b].map((x) =&gt; x.toString(16).padStart(2, '0')).join(' ');
console.log(&#96;message           : &#36;{msg.length} bytes   &#36;{hex(msg)}&#96;);
console.log(&#96;+ TCP header      : &#36;{tcp.length} bytes  &#36;{hex(tcp)}&#96;);
console.log(&#96;+ IP header       : &#36;{ip.length} bytes  &#36;{hex(ip)}&#96;);
console.log(&#96;+ Ethernet header : &#36;{eth.length} bytes  &#36;{hex(eth)}&#96;);
console.log(&#96;frame on the wire : &#36;{frame.length} bytes  (&#36;{frame.length - msg.length} bytes of headers for &#36;{msg.length} bytes of data = &#36;{((frame.length - msg.length) / frame.length * 100).toFixed(0)}% overhead)&#96;);
// verify: the IP checksum over the finished header must sum to 0xffff
let chk = 0; for (let i = 0; i &lt; 20; i += 2) chk += ip.readUInt16BE(i); while (chk &gt; 0xffff) chk = (chk &amp; 0xffff) + (chk &gt;&gt; 16);
console.log('IP checksum verifies:', chk === 0xffff);</code></pre>
<div class="out">$ node goi-tin.js<br>
message &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 5 bytes &nbsp;&nbsp;68 65 6c 6c 6f<br>
+ TCP header &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 20 bytes &nbsp;c7 38 00 50 00 00 00 01 00 00 00 01 50 18 ff ff 00 00 00 00<br>
+ IP header &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 20 bytes &nbsp;45 00 00 2d 00 00 00 00 40 06 66 c9 0a 00 00 01 0a 00 00 02<br>
+ Ethernet header : 14 bytes &nbsp;02 00 00 00 00 02 02 00 00 00 00 01 08 00<br>
frame on the wire : 59 bytes &nbsp;(54 bytes of headers for 5 bytes of data = 92% overhead)<br>
IP checksum verifies: true</div>
<p>Read the bytes: the Ethernet header is <code>02 00 00 00 00 02</code> (destination MAC), <code>02 00 00 00 00 01</code> (source MAC), <code>08 00</code> (type = IPv4). The IP header begins <code>45</code> (version 4, header length 5 words = 20 bytes), has total length <code>00 2d</code> (45 = 20 + 20 + 5), TTL <code>40</code> (64), protocol <code>06</code> (TCP), then source <code>0a 00 00 01</code> and destination <code>0a 00 00 02</code> — the dotted addresses are just these four bytes. The TCP header starts with the ports <code>c7 38</code> (51000) and <code>00 50</code> (<strong>80</strong>), then sequence number, acknowledgement number, header length <code>50</code> (5 words), flags <code>18</code> (PSH + ACK), window <code>ff ff</code>. Result: 54 bytes of headers for 5 bytes of data — 92% overhead. For a 1,460-byte payload the overhead is 3.6% — which is why tiny messages are inefficient and servers batch or buffer.</p>
<p>When the packet crosses a router the Ethernet header (14 bytes) is thrown away and replaced for the next link, the IP TTL is decremented and the checksum recalculated; the IP and TCP headers stay. A packet cannot be larger than the link's <strong>MTU</strong> (1,500 bytes of payload on standard Ethernet): large data are cut in pieces and reassembled by TCP at the far end.</p>
<div class="callout">🧭 On a real server: <code>tcpdump -i eth0 -nn port 80 -X</code> or Wireshark show exactly this stack on a live connection. A TLS-encrypted HTTPS connection adds a <em>fifth</em> envelope between TCP and HTTP. Many "slow API" problems are really about round trips at these layers: a 3-way handshake (1 round trip) plus TLS (1–2) before any HTTP byte.</div>
<p class="pitfall">⚠️ The figure shows <em>accumulation</em>; the reverse happens on receipt: each layer removes its own header and hands the rest up. Mixing up the order (Ethernet outermost, TCP innermost before the message) is the usual exam slip.</p>`,
        `<p class="y-chinh">🎯 Hình 8-31 — <strong>tích luỹ các header gói tin</strong>: một thông điệp trên host nhận một <strong>header TCP</strong> (cổng, số thứ tự), rồi một <strong>header IP</strong> (địa chỉ nguồn và đích), rồi một <strong>header Ethernet</strong> (địa chỉ MAC) khi đi xuống các tầng; mỗi router dọc đường bóc và dựng lại header thấp nhất, nhưng giữ nguyên header IP và TCP.</p>
<p>Giao thức là một thoả thuận về khuôn dạng và thứ tự các thông điệp. Giao thức phân tầng cho mỗi tầng giải một bài toán: Ethernet đưa một khung tới máy kế tiếp trên <em>cùng cáp/switch</em>; IP đưa một gói <em>xuyên các mạng</em>; TCP đưa một dòng tin cậy <em>giữa hai chương trình</em> (nó thêm số cổng để gọi tên chương trình); giao thức ứng dụng (HTTP) cho các byte ý nghĩa. Đi xuống, mỗi tầng <strong>bọc</strong> dữ liệu của tầng trên bằng header của mình — như bỏ một lá thư vào phong bì, rồi vào một phong bì lớn hơn với địa chỉ khác.</p>
<p>Đây là một khung thật dựng từng byte, trong 25 dòng Node.js — một thông điệp 5 byte "hello" từ 10.0.0.1:51000 tới 10.0.0.2:80 — và được kiểm bằng cách tính lại tổng kiểm của header IP (tổng các từ 16 bit của header phải ra 0xffff):</p>
<pre><code class="language-javascript">// Hình 8-31: tự dựng các header — Ethernet + IPv4 + TCP bọc quanh thông điệp 5 byte
const msg = Buffer.from('hello');
const tcp = Buffer.alloc(20); tcp.writeUInt16BE(51000, 0); tcp.writeUInt16BE(80, 2); tcp.writeUInt32BE(1, 4); tcp.writeUInt32BE(1, 8); tcp[12] = 5 &lt;&lt; 4; tcp[13] = 0x18; tcp.writeUInt16BE(65535, 14);   // src port, dst port 80, seq, ack, header 5 words, PSH+ACK, window
const ip = Buffer.alloc(20); ip[0] = 0x45; ip.writeUInt16BE(20 + 20 + msg.length, 2); ip[8] = 64; ip[9] = 6; ip.set([10, 0, 0, 1], 12); ip.set([10, 0, 0, 2], 16);   // version 4 + 5 words, total length, TTL 64, protocol 6 = TCP
let sum = 0; for (let i = 0; i &lt; 20; i += 2) sum += ip.readUInt16BE(i); while (sum &gt; 0xffff) sum = (sum &amp; 0xffff) + (sum &gt;&gt; 16); ip.writeUInt16BE(~sum &amp; 0xffff, 10);   // tổng kiểm header
const eth = Buffer.alloc(14); eth.set([0x02, 0, 0, 0, 0, 2], 0); eth.set([0x02, 0, 0, 0, 0, 1], 6); eth.writeUInt16BE(0x0800, 12);   // dst MAC, src MAC, type 0x0800 = IPv4
const frame = Buffer.concat([eth, ip, tcp, msg]);
const hex = (b) =&gt; [...b].map((x) =&gt; x.toString(16).padStart(2, '0')).join(' ');
console.log(&#96;message           : &#36;{msg.length} bytes   &#36;{hex(msg)}&#96;);
console.log(&#96;+ TCP header      : &#36;{tcp.length} bytes  &#36;{hex(tcp)}&#96;);
console.log(&#96;+ IP header       : &#36;{ip.length} bytes  &#36;{hex(ip)}&#96;);
console.log(&#96;+ Ethernet header : &#36;{eth.length} bytes  &#36;{hex(eth)}&#96;);
console.log(&#96;frame on the wire : &#36;{frame.length} bytes  (&#36;{frame.length - msg.length} bytes of headers for &#36;{msg.length} bytes of data = &#36;{((frame.length - msg.length) / frame.length * 100).toFixed(0)}% overhead)&#96;);
// kiểm: tổng kiểm IP trên header hoàn chỉnh phải cộng ra 0xffff
let chk = 0; for (let i = 0; i &lt; 20; i += 2) chk += ip.readUInt16BE(i); while (chk &gt; 0xffff) chk = (chk &amp; 0xffff) + (chk &gt;&gt; 16);
console.log('IP checksum verifies:', chk === 0xffff);</code></pre>
<div class="out">$ node goi-tin.js<br>
message &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 5 bytes &nbsp;&nbsp;68 65 6c 6c 6f<br>
+ TCP header &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 20 bytes &nbsp;c7 38 00 50 00 00 00 01 00 00 00 01 50 18 ff ff 00 00 00 00<br>
+ IP header &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 20 bytes &nbsp;45 00 00 2d 00 00 00 00 40 06 66 c9 0a 00 00 01 0a 00 00 02<br>
+ Ethernet header : 14 bytes &nbsp;02 00 00 00 00 02 02 00 00 00 00 01 08 00<br>
frame on the wire : 59 bytes &nbsp;(54 bytes of headers for 5 bytes of data = 92% overhead)<br>
IP checksum verifies: true</div>
<p>Đọc các byte: header Ethernet là <code>02 00 00 00 00 02</code> (MAC đích), <code>02 00 00 00 00 01</code> (MAC nguồn), <code>08 00</code> (kiểu = IPv4). Header IP bắt đầu bằng <code>45</code> (phiên bản 4, độ dài header 5 từ = 20 byte), có tổng độ dài <code>00 2d</code> (45 = 20 + 20 + 5), TTL <code>40</code> (64), giao thức <code>06</code> (TCP), rồi nguồn <code>0a 00 00 01</code> và đích <code>0a 00 00 02</code> — địa chỉ dạng chấm chỉ là bốn byte này. Header TCP bắt đầu bằng các cổng <code>c7 38</code> (51000) và <code>00 50</code> (<strong>80</strong>), rồi số thứ tự, số xác nhận, độ dài header <code>50</code> (5 từ), cờ <code>18</code> (PSH + ACK), cửa sổ <code>ff ff</code>. Kết quả: 54 byte header cho 5 byte dữ liệu — phụ phí 92%. Với tải 1.460 byte, phụ phí là 3,6% — vì thế thông điệp quá nhỏ kém hiệu quả và server gộp hay đệm.</p>
<p>Khi gói đi qua router, header Ethernet (14 byte) bị bỏ và thay mới cho liên kết kế, TTL của IP giảm một và tổng kiểm được tính lại; header IP và TCP giữ nguyên. Một gói không thể lớn hơn <strong>MTU</strong> của liên kết (1.500 byte tải trên Ethernet chuẩn): dữ liệu lớn được cắt mảnh và TCP ghép lại ở đầu xa.</p>
<div class="callout">🧭 Trên server thật: <code>tcpdump -i eth0 -nn port 80 -X</code> hay Wireshark cho thấy đúng ngăn xếp này trên một kết nối sống. Một kết nối HTTPS mã hoá bằng TLS thêm phong bì thứ <em>năm</em> giữa TCP và HTTP. Nhiều vấn đề "API chậm" thực ra là về số vòng đi-về ở các tầng này: bắt tay 3 bước (1 vòng) cộng TLS (1–2) trước khi có byte HTTP nào.</div>
<p class="pitfall">⚠️ Hình cho thấy <em>tích luỹ</em>; điều ngược lại xảy ra khi nhận: mỗi tầng gỡ header của mình và đưa phần còn lại lên. Lẫn thứ tự (Ethernet ngoài cùng, TCP trong cùng trước thông điệp) là lỗi thi quen thuộc.</p>`],
      [39, 'Document-Based Middleware (1)',
        `<p class="y-chinh">🎯 Figure 8-32 — <strong>document-based middleware</strong>, the best known of all: the <strong>World Wide Web</strong>. To users it is a vast set of <em>documents</em> (pages) that point to each other with <em>hyperlinks</em> — "a big directed graph of documents". Behind it is a distributed system of millions of servers that the user never sees.</p>
<p>The Web began at CERN in 1989–91 (Tim Berners-Lee) as a way to link documents across different computers; the three inventions are the <strong>URL</strong> (a global name for a document: <code>http://www.example.org/path/page.html</code>), <strong>HTTP</strong> (the request–reply protocol to fetch it) and <strong>HTML</strong> (the format with the links). That is middleware in the exact sense of slide 34: the user and the browser see only documents, links and a name; whether the server runs Linux or Windows, Apache or nginx, in Hanoi or Frankfurt, is invisible. Figure 8-32 draws a university site: a root page links to faculty pages, which link to department pages, which link back — a <em>graph</em>, not a tree, because links go anywhere.</p>
<p>A page may be a stored file (<em>static</em>) or built when requested by a program (<em>dynamic</em>: PHP, Java, Node.js code generating HTML from a database) — the browser cannot tell. Modern sites increasingly send a small HTML shell plus JavaScript that fetches <em>data</em> (JSON) from APIs and builds the page in the browser (a single-page application) — the Web turned from a graph of documents into a platform for programs, but the middleware (URL + HTTP) is the same.</p>
<div class="callout">🧭 On a real server: this very site, cuongthai.com, is such a system: a Next.js frontend produces pages, an Express backend serves <code>/api/v1/…</code>, nginx in front distributes requests, and all of them talk HTTP. A common check for "is the route really mounted?" — <code>curl -s -o /dev/null -w "%{http_code}"</code> giving 401 (exists, needs login) / 200 / 404 (not mounted) — is an HTTP request–reply by hand, which the next slide does literally.</div>
<p class="meo">🧠 The Web is a distributed system whose middleware is <em>URL + HTTP + HTML</em>; the rest is servers.</p>`,
        `<p class="y-chinh">🎯 Hình 8-32 — <strong>middleware dựa trên tài liệu</strong>, loại nổi tiếng nhất: <strong>World Wide Web</strong>. Với người dùng nó là một tập rộng lớn các <em>tài liệu</em> (trang) trỏ tới nhau bằng <em>siêu liên kết (hyperlink)</em> — "một đồ thị có hướng khổng lồ các tài liệu". Phía sau là một hệ phân tán gồm hàng triệu server mà người dùng không bao giờ thấy.</p>
<p>Web bắt đầu ở CERN năm 1989–91 (Tim Berners-Lee) như một cách liên kết tài liệu xuyên các máy tính khác nhau; ba phát minh là <strong>URL</strong> (tên toàn cầu của một tài liệu: <code>http://www.example.org/path/page.html</code>), <strong>HTTP</strong> (giao thức yêu cầu–trả lời để lấy nó) và <strong>HTML</strong> (khuôn dạng có các liên kết). Đó là middleware đúng nghĩa của slide 34: người dùng và trình duyệt chỉ thấy tài liệu, liên kết và một cái tên; server chạy Linux hay Windows, Apache hay nginx, ở Hà Nội hay Frankfurt là vô hình. Hình 8-32 vẽ một site trường đại học: một trang gốc liên kết tới các trang khoa, liên kết tới các trang bộ môn, rồi liên kết ngược lại — một <em>đồ thị</em>, không phải cây, vì liên kết đi đâu cũng được.</p>
<p>Một trang có thể là tệp lưu sẵn (<em>tĩnh</em>) hoặc được một chương trình dựng khi có yêu cầu (<em>động</em>: PHP, Java, mã Node.js sinh HTML từ cơ sở dữ liệu) — trình duyệt không phân biệt được. Các site hiện đại ngày càng gửi một khung HTML nhỏ cộng JavaScript lấy <em>dữ liệu</em> (JSON) từ các API và dựng trang trong trình duyệt (ứng dụng một trang) — Web đã đổi từ đồ thị tài liệu thành nền tảng cho chương trình, nhưng middleware (URL + HTTP) vẫn như cũ.</p>
<div class="callout">🧭 Trên server thật: chính site cuongthai.com này là một hệ như vậy: frontend Next.js tạo trang, backend Express phục vụ <code>/api/v1/…</code>, nginx phía trước phân phối yêu cầu, và tất cả nói HTTP. Một phép kiểm thường dùng cho "route đã thật sự được gắn chưa?" — <code>curl -s -o /dev/null -w "%{http_code}"</code> cho 401 (có, cần đăng nhập) / 200 / 404 (chưa gắn) — là một yêu cầu–trả lời HTTP làm bằng tay, điều slide kế làm đúng nghĩa đen.</div>
<p class="meo">🧠 Web là hệ phân tán mà middleware là <em>URL + HTTP + HTML</em>; phần còn lại là các server.</p>`],
      [40, 'Document-Based Middleware (2)',
        `<p class="y-chinh">🎯 To get the page <code>http://www.minix3.org/getting-started/index.html</code> the browser: (1) asks <strong>DNS</strong> for the IP address of <code>www.minix3.org</code>; (2) DNS replies with an IP address (the slide shows 66.147.238.215); (3) the browser makes a <strong>TCP connection</strong> to port 80 on that address; (4) it sends a <strong>request</strong> for the file <code>getting-started/index.html</code>.</p>
<p>Four steps, four protocols, and every one of them is a message exchange of this lesson. <strong>DNS</strong> (Domain Name System) is a distributed database mapping names to addresses; a lookup is a request–reply (usually UDP). <strong>TCP</strong> connects <em>two programs</em>: the IP address names the machine, the <strong>port</strong> (80 = HTTP, 443 = HTTPS) names the program on it. The <strong>request</strong> is a few lines of text. We can do all four steps by hand against a small server on this machine (port 80 is allowed because the container runs as root; DNS is answered from <code>/etc/hosts</code> so no network is needed):</p>
<pre><code class="language-javascript">// Slides 40-41: the Web browser's eight steps, done by hand against a server on this machine
import http from 'node:http';
import net from 'node:net';
import dns from 'node:dns/promises';

const server = http.createServer((req, res) =&gt; {
  console.log(&#96;  [server] step 5: got "&#36;{req.method} &#36;{req.url}" from the TCP connection, sends the file&#96;);
  res.setHeader('Connection', 'close');
  res.end('&lt;html&gt;&lt;body&gt;&lt;h1&gt;Getting started&lt;/h1&gt;&lt;img src="/logo.png"&gt;&lt;/body&gt;&lt;/html&gt;');
});
await new Promise((r) =&gt; server.listen(80, '127.0.0.1', r));
const port = server.address().port;   // 80, the HTTP port (the container runs as root)

const host = 'localhost';
console.log(&#96;step 1-2: ask DNS for the IP address of "&#36;{host}"&#96;);
const { address } = await dns.lookup(host, { family: 4 });
console.log(&#96;  DNS (here /etc/hosts) replies with &#36;{address}&#96;);
console.log(&#96;step 3: make a TCP connection to port &#36;{port} on &#36;{address}&#96;);
const sock = net.connect(port, address);
await new Promise((r) =&gt; sock.once('connect', r));
console.log(&#96;  connected: this side uses a random "ephemeral" port (&gt; 1023), the far side is &#36;{sock.remoteAddress}:&#36;{sock.remotePort}&#96;);
console.log('step 4: send a request asking for the file getting-started/index.html');
const request = &#96;GET /getting-started/index.html HTTP/1.1\\r\\nHost: &#36;{host}\\r\\nConnection: close\\r\\n\\r\\n&#96;;
console.log(request.replace(/\\r\\n/g, '\\\\r\\\\n\\n').trimEnd());
sock.write(request);
let reply = ''; sock.on('data', (d) =&gt; { reply += d; });
await new Promise((r) =&gt; sock.once('close', r));
console.log('step 5-6: the server replied, and the browser displays the text:');
console.log(reply.replace(/\\r\\n/g, '\\\\r\\\\n\\n').trimEnd());
console.log('step 7: the page has an &lt;img&gt;: the browser opens ANOTHER request for it (many pages = many requests)');
console.log('step 8: the TCP connection is released (the server sent "Connection: close")');
server.close();</code></pre>
<div class="out">$ node http-8-buoc.js<br>
step 1-2: ask DNS for the IP address of "localhost"<br>
&nbsp;&nbsp;DNS (here /etc/hosts) replies with 127.0.0.1<br>
step 3: make a TCP connection to port 80 on 127.0.0.1<br>
&nbsp;&nbsp;connected: this side uses a random "ephemeral" port (&gt; 1023), the far side is 127.0.0.1:80<br>
step 4: send a request asking for the file getting-started/index.html<br>
GET /getting-started/index.html HTTP/1.1\\r\\n<br>
Host: localhost\\r\\n<br>
Connection: close\\r\\n<br>
\\r\\n<br>
&nbsp;&nbsp;[server] step 5: got "GET /getting-started/index.html" from the TCP connection, sends the file<br>
step 5-6: the server replied, and the browser displays the text:<br>
HTTP/1.1 200 OK\\r\\n<br>
Connection: close\\r\\n<br>
Date: Sun, 25 Oct 2026 19:45:06 GMT\\r\\n<br>
Content-Length: 71\\r\\n<br>
\\r\\n<br>
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Getting started&lt;/h1&gt;&lt;img src="/logo.png"&gt;&lt;/body&gt;&lt;/html&gt;<br>
step 7: the page has an &lt;img&gt;: the browser opens ANOTHER request for it (many pages = many requests)<br>
step 8: the TCP connection is released (the server sent "Connection: close")</div>
<p>The request the browser would send is just text: a <em>request line</em> (<code>GET /getting-started/index.html HTTP/1.1</code>), headers (<code>Host:</code> tells the server which site you want — many sites share one IP address; <code>Connection: close</code>), and an empty line (<code>\\r\\n\\r\\n</code>) ending the headers. The reply begins <code>HTTP/1.1 200 OK</code> — the status line — then headers, a blank line and the body, whose size is given by <code>Content-Length: 71</code>, which is how a TCP <em>byte stream</em> (slide 37) is cut into messages. (The <code>Date</code> header changes at each run, so the lesson check masks it.)</p>
<p>The slide's IP address (66.147.238.215) is the address of that site in 2013–2015 and is only an example; DNS names are exactly meant to <em>not</em> be remembered, and IP addresses change when sites move. Do not try to type it. (We could not check today's address from the offline course container, and it does not matter for the idea.)</p>
<p class="pitfall">⚠️ <code>localhost</code>/<code>127.0.0.1</code> never leaves the machine — it exercises the TCP stack but not the network card (slide 33 measured exactly that). That is why "it works on localhost" says nothing about latency or firewalls.</p>`,
        `<p class="y-chinh">🎯 Để lấy trang <code>http://www.minix3.org/getting-started/index.html</code> trình duyệt: (1) hỏi <strong>DNS</strong> địa chỉ IP của <code>www.minix3.org</code>; (2) DNS trả lời một địa chỉ IP (slide ghi 66.147.238.215); (3) trình duyệt tạo một <strong>kết nối TCP</strong> tới cổng 80 của địa chỉ đó; (4) gửi một <strong>yêu cầu</strong> lấy tệp <code>getting-started/index.html</code>.</p>
<p>Bốn bước, bốn giao thức, và mỗi bước đều là một trao đổi thông điệp của bài này. <strong>DNS</strong> (Domain Name System) là một cơ sở dữ liệu phân tán ánh xạ tên sang địa chỉ; một lần tra là một yêu cầu–trả lời (thường qua UDP). <strong>TCP</strong> nối <em>hai chương trình</em>: địa chỉ IP gọi tên máy, <strong>cổng (port)</strong> (80 = HTTP, 443 = HTTPS) gọi tên chương trình trên đó. <strong>Yêu cầu</strong> là vài dòng văn bản. Ta làm đủ cả bốn bước bằng tay với một server nhỏ trên máy này (cổng 80 được phép vì container chạy bằng root; DNS được trả lời từ <code>/etc/hosts</code> nên không cần mạng):</p>
<pre><code class="language-javascript">// Slide 40-41: tám bước của trình duyệt Web, làm bằng tay với một máy chủ trên máy này
import http from 'node:http';
import net from 'node:net';
import dns from 'node:dns/promises';

const server = http.createServer((req, res) =&gt; {
  console.log(&#96;  [server] step 5: got "&#36;{req.method} &#36;{req.url}" from the TCP connection, sends the file&#96;);
  res.setHeader('Connection', 'close');
  res.end('&lt;html&gt;&lt;body&gt;&lt;h1&gt;Getting started&lt;/h1&gt;&lt;img src="/logo.png"&gt;&lt;/body&gt;&lt;/html&gt;');
});
await new Promise((r) =&gt; server.listen(80, '127.0.0.1', r));
const port = server.address().port;   // 80, cổng HTTP (container chạy bằng root)

const host = 'localhost';
console.log(&#96;step 1-2: ask DNS for the IP address of "&#36;{host}"&#96;);
const { address } = await dns.lookup(host, { family: 4 });
console.log(&#96;  DNS (here /etc/hosts) replies with &#36;{address}&#96;);
console.log(&#96;step 3: make a TCP connection to port &#36;{port} on &#36;{address}&#96;);
const sock = net.connect(port, address);
await new Promise((r) =&gt; sock.once('connect', r));
console.log(&#96;  connected: this side uses a random "ephemeral" port (&gt; 1023), the far side is &#36;{sock.remoteAddress}:&#36;{sock.remotePort}&#96;);
console.log('step 4: send a request asking for the file getting-started/index.html');
const request = &#96;GET /getting-started/index.html HTTP/1.1\\r\\nHost: &#36;{host}\\r\\nConnection: close\\r\\n\\r\\n&#96;;
console.log(request.replace(/\\r\\n/g, '\\\\r\\\\n\\n').trimEnd());
sock.write(request);
let reply = ''; sock.on('data', (d) =&gt; { reply += d; });
await new Promise((r) =&gt; sock.once('close', r));
console.log('step 5-6: the server replied, and the browser displays the text:');
console.log(reply.replace(/\\r\\n/g, '\\\\r\\\\n\\n').trimEnd());
console.log('step 7: the page has an &lt;img&gt;: the browser opens ANOTHER request for it (many pages = many requests)');
console.log('step 8: the TCP connection is released (the server sent "Connection: close")');
server.close();</code></pre>
<div class="out">$ node http-8-buoc.js<br>
step 1-2: ask DNS for the IP address of "localhost"<br>
&nbsp;&nbsp;DNS (here /etc/hosts) replies with 127.0.0.1<br>
step 3: make a TCP connection to port 80 on 127.0.0.1<br>
&nbsp;&nbsp;connected: this side uses a random "ephemeral" port (&gt; 1023), the far side is 127.0.0.1:80<br>
step 4: send a request asking for the file getting-started/index.html<br>
GET /getting-started/index.html HTTP/1.1\\r\\n<br>
Host: localhost\\r\\n<br>
Connection: close\\r\\n<br>
\\r\\n<br>
&nbsp;&nbsp;[server] step 5: got "GET /getting-started/index.html" from the TCP connection, sends the file<br>
step 5-6: the server replied, and the browser displays the text:<br>
HTTP/1.1 200 OK\\r\\n<br>
Connection: close\\r\\n<br>
Date: Sun, 25 Oct 2026 19:45:06 GMT\\r\\n<br>
Content-Length: 71\\r\\n<br>
\\r\\n<br>
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Getting started&lt;/h1&gt;&lt;img src="/logo.png"&gt;&lt;/body&gt;&lt;/html&gt;<br>
step 7: the page has an &lt;img&gt;: the browser opens ANOTHER request for it (many pages = many requests)<br>
step 8: the TCP connection is released (the server sent "Connection: close")</div>
<p>Yêu cầu mà trình duyệt gửi chỉ là văn bản: một <em>dòng yêu cầu</em> (<code>GET /getting-started/index.html HTTP/1.1</code>), các header (<code>Host:</code> cho server biết bạn muốn site nào — nhiều site dùng chung một địa chỉ IP; <code>Connection: close</code>), và một dòng trống (<code>\\r\\n\\r\\n</code>) kết thúc header. Phản hồi bắt đầu bằng <code>HTTP/1.1 200 OK</code> — dòng trạng thái — rồi các header, dòng trống và phần thân, có cỡ cho bởi <code>Content-Length: 71</code>, chính là cách một <em>dòng byte</em> TCP (slide 37) được cắt thành thông điệp. (Header <code>Date</code> đổi mỗi lần chạy, nên phép kiểm của bài che nó.)</p>
<p>Địa chỉ IP trên slide (66.147.238.215) là địa chỉ của site đó vào năm 2013–2015 và chỉ là ví dụ; tên DNS được tạo ra đúng để <em>không</em> phải nhớ, và địa chỉ IP đổi khi site chuyển chỗ. Đừng thử gõ nó. (Chúng tôi không kiểm được địa chỉ hôm nay từ container môn học không có mạng, và nó không ảnh hưởng ý tưởng.)</p>
<p class="pitfall">⚠️ <code>localhost</code>/<code>127.0.0.1</code> không bao giờ rời khỏi máy — nó thử ngăn xếp TCP chứ không thử card mạng (slide 33 đã đo đúng điều đó). Vì thế "chạy được trên localhost" không nói gì về độ trễ hay tường lửa.</p>`],
      [41, 'Document-Based Middleware (3)',
        `<p class="y-chinh">🎯 The remaining steps: (5) the server sends the file; (6) the browser displays all the text; (7) it also fetches and displays all <strong>images</strong> on the page; (8) the TCP connection is released. <strong>Slide error:</strong> the four items are all numbered "5." on the slide; the book's numbering is 5, 6, 7, 8.</p>
<p>Step 7 is where the Web gets expensive: the page of step 5 is HTML, but its text mentions an <code>&lt;img&gt;</code>, a stylesheet and three scripts; each is another URL, another request. A page with 80 resources was a problem in the HTTP/1.0 era, when step 3 (a TCP connection) and step 8 (releasing it) happened <em>for every resource</em>. History of the fixes — each reduces round trips, the cost of slide 36:</p>
<table>
<thead><tr><th>Version</th><th>Idea</th><th>Effect on the 8 steps</th></tr></thead>
<tbody>
<tr><td>HTTP/1.0 (1996)</td><td>one TCP connection per request</td><td>steps 3 and 8 repeated for every image</td></tr>
<tr><td>HTTP/1.1 (1997)</td><td>persistent connections (keep-alive) are the default, requests may be pipelined</td><td>step 3 once per page, but requests on one connection still wait in line</td></tr>
<tr><td>HTTP/2 (RFC 9113, June 2022 current text; first RFC 7540, 2015)</td><td>many requests multiplexed over ONE connection, header compression</td><td>one connection carries all images in parallel streams</td></tr>
<tr><td>HTTP/3 (RFC 9114, June 2022)</td><td>HTTP over QUIC (UDP): streams are independent, TLS 1.3 built in</td><td>a lost packet delays only its own stream; faster connection setup</td></tr>
</tbody>
</table>
<p>(RFC numbers and dates were checked on rfc-editor.org and datatracker.ietf.org on 26/10/2026. TCP itself — the base of steps 3 and 8 — was re-issued as <strong>RFC 9293</strong>, August 2022, replacing RFC 793 of 1981.) In our little program the server sent <code>Connection: close</code>, the HTTP/1.0 behaviour: one request, then the TCP connection ends (step 8). Browsers today open one connection, keep it, and reuse it for dozens of requests; your Node.js <code>http.Agent</code> with <code>keepAlive: true</code> and the connection pool of a database driver do the same for the same reason — <em>avoid paying steps 1–3 again</em>.</p>
<div class="callout">🧭 On a real server: <code>curl -sI -w "%{time_namelookup} %{time_connect} %{time_appconnect} %{time_starttransfer} %{time_total}\\n" https://example.org</code> prints the time of each stage (DNS, TCP, TLS, first byte, total) — the timeline of these eight steps measured on a real request. Reading it is the fastest way to know whether a slow page is slow because of the network, the TLS handshake or the application.</div>
<p class="pitfall">⚠️ Keep-alive is not a security or correctness feature; it is a latency feature. The book's step 8, "the TCP connection is released", is still correct: by whom and when is a policy (idle timeouts of nginx or the load balancer — a source of mysterious "connection reset" after long idle).</p>`,
        `<p class="y-chinh">🎯 Các bước còn lại: (5) server gửi tệp; (6) trình duyệt hiển thị toàn bộ văn bản; (7) nó còn lấy và hiển thị mọi <strong>hình ảnh</strong> trên trang; (8) kết nối TCP được giải phóng. <strong>Lỗi của slide:</strong> bốn mục đều được đánh số "5." trên slide; số thứ tự trong sách là 5, 6, 7, 8.</p>
<p>Bước 7 là chỗ Web trở nên đắt: trang ở bước 5 là HTML, nhưng văn bản của nó nhắc tới một <code>&lt;img&gt;</code>, một stylesheet và ba script; mỗi thứ là một URL khác, một yêu cầu khác. Một trang có 80 tài nguyên từng là vấn đề thời HTTP/1.0, khi bước 3 (một kết nối TCP) và bước 8 (giải phóng nó) xảy ra <em>cho mỗi tài nguyên</em>. Lịch sử các cách chữa — mỗi cách giảm số vòng đi-về, cái giá của slide 36:</p>
<table>
<thead><tr><th>Phiên bản</th><th>Ý tưởng</th><th>Tác động lên 8 bước</th></tr></thead>
<tbody>
<tr><td>HTTP/1.0 (1996)</td><td>một kết nối TCP cho mỗi yêu cầu</td><td>bước 3 và 8 lặp cho mỗi hình</td></tr>
<tr><td>HTTP/1.1 (1997)</td><td>kết nối bền (keep-alive) là mặc định, yêu cầu có thể pipeline</td><td>bước 3 một lần cho mỗi trang, nhưng các yêu cầu trên một kết nối vẫn xếp hàng chờ</td></tr>
<tr><td>HTTP/2 (RFC 9113, bản hiện hành 6/2022; RFC đầu 7540, 2015)</td><td>nhiều yêu cầu ghép kênh trên MỘT kết nối, nén header</td><td>một kết nối chở mọi hình trong các luồng song song</td></tr>
<tr><td>HTTP/3 (RFC 9114, 6/2022)</td><td>HTTP trên QUIC (UDP): các luồng độc lập, TLS 1.3 tích hợp</td><td>gói mất chỉ làm chậm luồng của nó; thiết lập kết nối nhanh hơn</td></tr>
</tbody>
</table>
<p>(Số RFC và ngày được kiểm trên rfc-editor.org và datatracker.ietf.org ngày 26/10/2026. Bản thân TCP — nền của bước 3 và 8 — được ban hành lại thành <strong>RFC 9293</strong>, tháng 8/2022, thay RFC 793 năm 1981.) Trong chương trình nhỏ của ta server gửi <code>Connection: close</code>, hành vi của HTTP/1.0: một yêu cầu rồi kết nối TCP kết thúc (bước 8). Trình duyệt ngày nay mở một kết nối, giữ nó và dùng lại cho hàng chục yêu cầu; <code>http.Agent</code> của Node.js với <code>keepAlive: true</code> và connection pool của driver cơ sở dữ liệu làm đúng như vậy vì cùng lý do — <em>tránh trả lại bước 1–3</em>.</p>
<div class="callout">🧭 Trên server thật: <code>curl -sI -w "%{time_namelookup} %{time_connect} %{time_appconnect} %{time_starttransfer} %{time_total}\\n" https://example.org</code> in thời gian từng giai đoạn (DNS, TCP, TLS, byte đầu, tổng) — dòng thời gian của tám bước này đo trên một yêu cầu thật. Đọc nó là cách nhanh nhất để biết một trang chậm là vì mạng, bắt tay TLS hay ứng dụng.</div>
<p class="pitfall">⚠️ Keep-alive không phải tính năng bảo mật hay đúng đắn; nó là tính năng độ trễ. Bước 8 của sách, "kết nối TCP được giải phóng", vẫn đúng: do ai và khi nào là một chính sách (timeout rảnh của nginx hay của load balancer — nguồn gốc của các lỗi "connection reset" bí ẩn sau thời gian rảnh dài).</p>`],
      [42, 'File-System-Based Middleware: Transfer Model',
        `<p class="y-chinh">🎯 Figure 8-33 — two models for a <strong>distributed file system</strong>: (a) the <strong>upload/download model</strong>: the client fetches the whole file, works on it locally, and sends it back when done; (b) the <strong>remote access model</strong>: the file stays on the server and the client sends individual requests (read this block, write that block) and gets replies.</p>
<p>Document-based middleware (the Web) hides a distributed system behind <em>pages</em>; file-system-based middleware hides it behind <em>files</em> — programs keep using <code>open</code>, <code>read</code>, <code>write</code> and never know the file is across the network. Which model? <strong>Upload/download</strong> (a): simple, and after the transfer all accesses are local and fast; but a big file with a one-byte change is moved twice in full, and the client needs enough disk. <strong>Remote access</strong> (b): only the needed parts travel and no disk is needed at the client, but every access costs a network round trip unless the client <em>caches</em> — and caching brings back the consistency problem of slide 45.</p>
<p>Both are alive. Upload/download is how <strong>object stores</strong> (Amazon S3, Cloudflare R2 — the storage of this project) work: you <code>PUT</code> the whole object and <code>GET</code> the whole object; there is no "change byte 100". Git (<code>clone</code>/<code>push</code>) and <code>rsync</code> are variants. Remote access is <strong>NFS</strong> (Linux/Unix network file system) and <strong>SMB/CIFS</strong> (Windows file sharing): a mounted network directory looks like a local one. A cloud <em>block volume</em> (EBS) is even lower-level remote access: individual disk blocks over the network (lesson 5).</p>
<div class="callout">🧭 On a real server: moving user uploads from the web server's local disk to R2/S3 is exactly choosing model (a) for scale: any server can serve any file, and the application servers become stateless (identical, replaceable). The price is that you cannot append to or edit part of an object — and that each access is an HTTP round trip (slide 33), so you serve hot files via a CDN. A PostgreSQL data directory on NFS, by contrast, is widely discouraged unless mounted very carefully (hard, synchronous mounts): database files need (b)'s fine-grained, consistent, locked access, and NFS's default caching and locking semantics are not what the database assumes.</div>
<p class="meo">🧠 Whole-file transfer = simple, local speed, wasteful for small changes. Remote access = precise, but every access is a message.</p>`,
        `<p class="y-chinh">🎯 Hình 8-33 — hai mô hình cho một <strong>hệ tệp phân tán</strong>: (a) <strong>mô hình tải lên/tải xuống (upload/download)</strong>: client lấy cả tệp, làm việc trên nó cục bộ, rồi gửi trả khi xong; (b) <strong>mô hình truy cập từ xa (remote access)</strong>: tệp ở yên trên server và client gửi từng yêu cầu (đọc khối này, ghi khối kia) và nhận phản hồi.</p>
<p>Middleware dựa trên tài liệu (Web) giấu hệ phân tán sau các <em>trang</em>; middleware dựa trên hệ tệp giấu nó sau các <em>tệp</em> — chương trình vẫn dùng <code>open</code>, <code>read</code>, <code>write</code> và không bao giờ biết tệp ở bên kia mạng. Mô hình nào? <strong>Upload/download</strong> (a): đơn giản, và sau khi chuyển, mọi truy cập là cục bộ và nhanh; nhưng một tệp lớn đổi một byte vẫn bị chuyển đủ hai lần, và client cần đủ đĩa. <strong>Truy cập từ xa</strong> (b): chỉ phần cần thiết đi qua và client không cần đĩa, nhưng mỗi truy cập tốn một vòng đi-về mạng trừ khi client <em>cache</em> — và cache đem lại bài toán nhất quán của slide 45.</p>
<p>Cả hai đều còn sống. Upload/download là cách các <strong>kho đối tượng (object store)</strong> (Amazon S3, Cloudflare R2 — kho lưu trữ của dự án này) hoạt động: bạn <code>PUT</code> cả đối tượng và <code>GET</code> cả đối tượng; không có "sửa byte 100". Git (<code>clone</code>/<code>push</code>) và <code>rsync</code> là các biến thể. Truy cập từ xa là <strong>NFS</strong> (hệ tệp mạng của Linux/Unix) và <strong>SMB/CIFS</strong> (chia sẻ tệp Windows): một thư mục mạng được gắn trông như thư mục cục bộ. Một <em>block volume</em> đám mây (EBS) còn là truy cập từ xa mức thấp hơn: từng khối đĩa qua mạng (bài 5).</p>
<div class="callout">🧭 Trên server thật: chuyển tệp người dùng tải lên từ đĩa cục bộ của web server sang R2/S3 chính là chọn mô hình (a) để mở rộng: server nào cũng phục vụ được tệp nào, và các server ứng dụng thành không trạng thái (giống hệt, thay thế được). Cái giá là bạn không nối thêm hay sửa một phần của đối tượng — và mỗi truy cập là một vòng đi-về HTTP (slide 33), nên bạn phục vụ tệp nóng qua CDN. Ngược lại, thư mục dữ liệu PostgreSQL đặt trên NFS bị khuyến cáo mạnh trừ khi gắn rất cẩn thận (hard, đồng bộ): tệp cơ sở dữ liệu cần truy cập mịn, nhất quán, có khoá của (b), mà cache và ngữ nghĩa khoá mặc định của NFS không phải thứ cơ sở dữ liệu giả định.</div>
<p class="meo">🧠 Chuyển cả tệp = đơn giản, tốc độ cục bộ, phí khi chỉ đổi ít. Truy cập từ xa = chính xác, nhưng mỗi truy cập là một thông điệp.</p>`],
      [43, 'The Directory Hierarchy',
        `<p class="y-chinh">🎯 Figure 8-34 — (a) two <strong>file servers</strong>, each with its own directory tree (server 1: A with B and C; server 2: D with E and F); (b) a system in which <strong>all clients have the same view</strong> of the file system; (c) a system in which <strong>different clients may have different views</strong>.</p>
<p>Two machines each hold a tree of directories (squares) and files (circles). How do clients <em>glue the trees together</em> into one hierarchy? In design (b) there is a single, global tree — every client sees the same names for the same files; moving to another desk or machine changes nothing. In design (c) each client builds its own tree by <em>mounting</em> servers where it pleases: client 1 may attach server 2's directory D beside A, client 2 may attach it under C. Then the path <code>/A/C/E</code> means a file on one client and does not exist on another — the price of flexibility.</p>
<p>You do (c) on every Linux machine every day: <code>mount</code> attaches a file system (a local disk, an NFS export, a container volume) at a directory of the existing tree. The program below builds the figure with real mounts in private mount namespaces (so the two "clients" really see different trees on one machine, and the servers are never touched):</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Figure 8-34: two "file servers" and clients that see them differently — done with bind mounts in private mount namespaces<br>
$ echo "file server 1:"; find /srv/s1 | sort | sed 's|/srv/s1||'<br>
file server 1:<br>
<br>
/A<br>
/A/B<br>
/A/B/x1<br>
/A/C<br>
$ echo "file server 2:"; find /srv/s2 | sort | sed 's|/srv/s2||'<br>
file server 2:<br>
<br>
/D<br>
/D/E<br>
/D/E/y1<br>
/D/F<br>
# (b) every client has the SAME view: root = A (from server 1) + D (from server 2) side by side<br>
$ unshare -m bash -c 'mkdir -p /v1/A /v1/D; mount --bind /srv/s1/A /v1/A; mount --bind /srv/s2/D /v1/D; echo "client view (b):"; find /v1 | sort | sed "s|/v1||"'<br>
client view (b):<br>
<br>
/A<br>
/A/B<br>
/A/B/x1<br>
/A/C<br>
/D<br>
/D/E<br>
/D/E/y1<br>
/D/F<br>
# (c) a client with a DIFFERENT view: server 2 mounted under A/C<br>
$ unshare -m bash -c 'mkdir -p /v2/A; mount --bind /srv/s1/A /v2/A; mount --bind /srv/s2/D /v2/A/C; echo "client view (c):"; find /v2 | sort | sed "s|/v2||"'<br>
client view (c):<br>
<br>
/A<br>
/A/B<br>
/A/B/x1<br>
/A/C<br>
/A/C/E<br>
/A/C/E/y1<br>
/A/C/F<br>
# The servers themselves were never changed<br>
$ echo "server 1 still has: $(ls /srv/s1/A | tr '\\n' ' ')"<br>
server 1 still has: B C</div>
<p>Client view (b) shows both servers side by side under the root, as in the figure; client view (c) shows server 2's tree grafted <em>under</em> A/C — the directories <code>E</code> and <code>F</code> appear inside <code>/A/C</code>, a place that existed only as an empty directory before. Finally "server 1 still has: B C" proves the server was not changed: a view is a property of the client's mount table, not of the file.</p>
<p>The same trade-off exists in your Docker/Kubernetes world: <code>-v /host/data:/data</code> is a bind mount into one container's private tree — a per-"client" view, exactly (c); a Kubernetes PersistentVolume mounts the same network volume in several pods at a path chosen by each pod.</p>
<p class="pitfall">⚠️ A common slip: the "same view" of (b) does not mean "same machine"; it means the <em>names</em> are the same on every client. NFS home directories mounted at <code>/home</code> on every lab machine are design (b): you log in anywhere and find <code>/home/you</code>.</p>`,
        `<p class="y-chinh">🎯 Hình 8-34 — (a) hai <strong>file server</strong>, mỗi cái có cây thư mục riêng (server 1: A với B và C; server 2: D với E và F); (b) một hệ trong đó <strong>mọi client có cùng góc nhìn</strong> về hệ tệp; (c) một hệ trong đó <strong>các client khác nhau có thể có góc nhìn khác nhau</strong>.</p>
<p>Hai máy mỗi máy giữ một cây thư mục (hình vuông) và tệp (hình tròn). Các client <em>dán các cây lại</em> thành một thứ bậc thế nào? Ở thiết kế (b) có một cây toàn cục duy nhất — mọi client thấy cùng tên cho cùng tệp; chuyển sang bàn khác hay máy khác không đổi gì. Ở thiết kế (c) mỗi client dựng cây riêng bằng cách <em>gắn (mount)</em> các server vào chỗ nó thích: client 1 có thể gắn thư mục D của server 2 cạnh A, client 2 có thể gắn nó dưới C. Khi đó đường dẫn <code>/A/C/E</code> nghĩa là một tệp ở client này và không tồn tại ở client kia — cái giá của sự linh hoạt.</p>
<p>Bạn làm (c) trên mọi máy Linux mỗi ngày: <code>mount</code> gắn một hệ tệp (đĩa cục bộ, một NFS export, một volume container) vào một thư mục của cây hiện có. Chương trình dưới đây dựng hình bằng các mount thật trong mount namespace riêng (nên hai "client" thật sự thấy hai cây khác nhau trên một máy, và các server không bị đụng tới):</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Hình 8-34: hai "file server" và các client nhìn chúng khác nhau — làm bằng bind mount trong mount namespace riêng<br>
$ echo "file server 1:"; find /srv/s1 | sort | sed 's|/srv/s1||'<br>
file server 1:<br>
<br>
/A<br>
/A/B<br>
/A/B/x1<br>
/A/C<br>
$ echo "file server 2:"; find /srv/s2 | sort | sed 's|/srv/s2||'<br>
file server 2:<br>
<br>
/D<br>
/D/E<br>
/D/E/y1<br>
/D/F<br>
# (b) mọi client có CÙNG một góc nhìn: gốc = A (từ server 1) + D (từ server 2) cạnh nhau<br>
$ unshare -m bash -c 'mkdir -p /v1/A /v1/D; mount --bind /srv/s1/A /v1/A; mount --bind /srv/s2/D /v1/D; echo "client view (b):"; find /v1 | sort | sed "s|/v1||"'<br>
client view (b):<br>
<br>
/A<br>
/A/B<br>
/A/B/x1<br>
/A/C<br>
/D<br>
/D/E<br>
/D/E/y1<br>
/D/F<br>
# (c) một client có góc nhìn KHÁC: server 2 gắn dưới A/C<br>
$ unshare -m bash -c 'mkdir -p /v2/A; mount --bind /srv/s1/A /v2/A; mount --bind /srv/s2/D /v2/A/C; echo "client view (c):"; find /v2 | sort | sed "s|/v2||"'<br>
client view (c):<br>
<br>
/A<br>
/A/B<br>
/A/B/x1<br>
/A/C<br>
/A/C/E<br>
/A/C/E/y1<br>
/A/C/F<br>
# Bản thân các server không hề bị đổi<br>
$ echo "server 1 still has: $(ls /srv/s1/A | tr '\\n' ' ')"<br>
server 1 still has: B C</div>
<p>Góc nhìn client (b) cho thấy hai server cạnh nhau dưới gốc, như trong hình; góc nhìn client (c) cho thấy cây của server 2 được ghép <em>dưới</em> A/C — các thư mục <code>E</code> và <code>F</code> hiện ra trong <code>/A/C</code>, nơi trước đó chỉ là một thư mục rỗng. Cuối cùng "server 1 still has: B C" chứng minh server không bị đổi: góc nhìn là thuộc tính của bảng mount của client, không phải của tệp.</p>
<p>Cùng đánh đổi đó có trong thế giới Docker/Kubernetes của bạn: <code>-v /host/data:/data</code> là một bind mount vào cây riêng của một container — góc nhìn theo từng "client", đúng (c); một PersistentVolume của Kubernetes gắn cùng một volume mạng vào nhiều pod ở đường dẫn do mỗi pod chọn.</p>
<p class="pitfall">⚠️ Một lỗi hay gặp: "cùng góc nhìn" của (b) không có nghĩa "cùng máy"; nó nghĩa là các <em>tên</em> giống nhau trên mọi client. Thư mục home NFS được gắn ở <code>/home</code> trên mọi máy phòng lab là thiết kế (b): bạn đăng nhập ở đâu cũng thấy <code>/home/you</code>.</p>`],
      [44, 'Naming Transparency',
        `<p class="y-chinh">🎯 Three common approaches to file and directory naming in a distributed system: (1) <strong>machine + path</strong> naming, such as <code>/machine/path</code> or <code>machine:path</code>; (2) <strong>mounting</strong> remote file systems onto the local file hierarchy; (3) a <strong>single name space</strong> that looks the same on all machines.</p>
<p>The book's key word is <strong>transparency</strong>. In approach (1) the <em>location</em> is part of the name (<code>server1:/data/report.txt</code>, <code>\\\\server\\share\\file</code>, <code>s3://bucket/key</code>, an URL): simple and honest, but if the file moves to another server every program that knows the old name breaks — the name is <em>not location transparent</em>. (2) Mounting (slide 43) hides the machine in the mount table: programs say <code>/mnt/data/report.txt</code> and do not know the server; but different clients may name the same file differently, and the file's name is still tied to <em>where it is mounted</em>. (3) A single global name space (what the book calls the ideal) gives every file one name everywhere and lets the system move files freely — <em>location independence</em>.</p>
<p>The book distinguishes the two properties: <strong>location transparency</strong> (the path does not reveal <em>where</em> the file is stored) versus <strong>location independence</strong> (the file can <em>move</em> without its name changing). A path <code>/home/you/file</code> on NFS has the first but not the second if the server's name is encoded in the mount table (you must edit it to move the share); the Web's URLs fail both (the host name is in the name), which is why a changed domain breaks links and why <em>permalinks</em>, redirects (HTTP 301) and DNS are the middleware's patches.</p>
<p>Look for the three approaches in a modern backend: (1) is a connection string <code>postgres://db1.internal:5432/shop</code> or an S3 URL — location in the name; (2) is a Docker volume or a Kubernetes <code>PersistentVolumeClaim</code> mounted at <code>/var/lib/postgresql</code> — the pod does not know which disk it is; (3) is <strong>service discovery</strong> — <code>http://orders/</code> inside a Kubernetes cluster is resolved by cluster DNS to <em>some</em> healthy pod, and pods can be rescheduled to other machines without any client changing its configuration. That last one is the closest ordinary engineers get to the book's ideal single name space.</p>
<p class="meo">🧠 Do not embed an IP address or a machine name in anything meant to outlive one deployment: use a name that a directory (DNS, discovery) resolves — one level of indirection solves most naming problems.</p>
<div class="callout">🧭 On a real server: this is the reason for environment variables like <code>DATABASE_URL</code> and for the rule "never hard-code the host". It is also why moving a database to a new machine is "change one DNS record or one environment variable", not "find every program that mentions the old IP".</div>`,
        `<p class="y-chinh">🎯 Ba cách tiếp cận phổ biến để đặt tên tệp và thư mục trong hệ phân tán: (1) đặt tên <strong>máy + đường dẫn</strong>, như <code>/machine/path</code> hay <code>machine:path</code>; (2) <strong>gắn (mount)</strong> các hệ tệp từ xa vào cây tệp cục bộ; (3) một <strong>không gian tên duy nhất</strong> trông giống nhau trên mọi máy.</p>
<p>Từ khoá của sách là <strong>tính trong suốt (transparency)</strong>. Ở cách (1) <em>vị trí</em> là một phần của tên (<code>server1:/data/report.txt</code>, <code>\\\\server\\share\\file</code>, <code>s3://bucket/key</code>, một URL): đơn giản và thẳng thắn, nhưng nếu tệp chuyển sang server khác thì mọi chương trình biết tên cũ đều hỏng — tên <em>không trong suốt về vị trí</em>. (2) Mount (slide 43) giấu máy trong bảng mount: chương trình nói <code>/mnt/data/report.txt</code> và không biết server; nhưng các client khác nhau có thể gọi cùng một tệp bằng tên khác nhau, và tên tệp vẫn gắn với <em>nơi nó được mount</em>. (3) Một không gian tên toàn cục duy nhất (cái sách gọi là lý tưởng) cho mỗi tệp một tên ở mọi nơi và để hệ thống chuyển tệp tự do — <em>độc lập về vị trí</em>.</p>
<p>Sách phân biệt hai tính chất: <strong>trong suốt về vị trí (location transparency)</strong> (đường dẫn không lộ tệp được lưu <em>ở đâu</em>) và <strong>độc lập về vị trí (location independence)</strong> (tệp có thể <em>di chuyển</em> mà tên không đổi). Đường dẫn <code>/home/you/file</code> trên NFS có tính chất đầu nhưng không có tính chất sau nếu tên server được mã hoá trong bảng mount (bạn phải sửa nó để chuyển share); URL của Web trượt cả hai (tên máy chủ nằm trong tên), vì thế đổi tên miền làm gãy liên kết và vì sao <em>permalink</em>, chuyển hướng (HTTP 301) và DNS là các miếng vá của middleware.</p>
<p>Tìm ba cách tiếp cận đó trong một backend hiện đại: (1) là chuỗi kết nối <code>postgres://db1.internal:5432/shop</code> hay một URL S3 — vị trí nằm trong tên; (2) là một Docker volume hay <code>PersistentVolumeClaim</code> của Kubernetes được mount tại <code>/var/lib/postgresql</code> — pod không biết nó là đĩa nào; (3) là <strong>khám phá dịch vụ (service discovery)</strong> — <code>http://orders/</code> bên trong một cluster Kubernetes được DNS của cluster phân giải thành <em>một</em> pod khoẻ nào đó, và pod có thể được xếp lại sang máy khác mà không client nào đổi cấu hình. Cái cuối là thứ gần nhất mà kỹ sư bình thường tới được với không gian tên duy nhất lý tưởng của sách.</p>
<p class="meo">🧠 Đừng nhúng địa chỉ IP hay tên máy vào bất cứ thứ gì có ý định sống lâu hơn một lần triển khai: dùng một cái tên mà một thư mục (DNS, khám phá dịch vụ) phân giải — một tầng gián tiếp giải được hầu hết bài toán đặt tên.</p>
<div class="callout">🧭 Trên server thật: đó là lý do của các biến môi trường như <code>DATABASE_URL</code> và quy tắc "đừng bao giờ ghi cứng host". Cũng là lý do chuyển một cơ sở dữ liệu sang máy mới là "đổi một bản ghi DNS hay một biến môi trường", không phải "tìm mọi chương trình nhắc tới IP cũ".</div>`],
      [45, 'Semantics of File Sharing',
        `<p class="y-chinh">🎯 Figure 8-35 — what does a <code>read</code> return when a file is shared? (a) <strong>one machine</strong>: process A writes "c" to the file "ab", then process B reads and gets "abc" — <strong>sequential consistency</strong>: every read sees the effect of every earlier write. (b) in a <strong>distributed system with caching</strong>: client 1 writes "c" at the file server, but client 2 had cached the old file and reads "ab" — an <strong>obsolete value</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/c63bc20f9250fc9003e07e63891e8333cdd2d7bf.svg" alt="Figure 8-35(b) as a sequence: client 2's cache answers with the old value" loading="lazy" /><p class="chu-thich">🧩 Figure 8-35(b) as a sequence: client 2's cache answers with the old value</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 8-35(b): a client that caches reads an obsolete value
title Figure 8-35(b) — file "ab" shared by two clients, one of them caches
participant "Client 1" as C1
participant "File server" as S
participant "Client 2\\n(with a cache)" as C2
C2 -&gt; S : read the file
S --&gt; C2 : "ab"   (client 2 keeps a copy in its cache)
C1 -&gt; S : write "c" at the end
S -&gt; S : the file is now "abc"
C2 -&gt; C2 : read again → answered from its OWN cache
note right of C2 #FEE2E2 : returns "ab" — an OBSOLETE value.\\nOn one machine this cannot happen:\\nthe read always sees "abc" (sequential consistency).
== fixes, each with a price ==
C2 -&gt; S : validate the cache first (NFS: "has it changed?")  — one round trip per read
S --&gt; C2 : yes, changed → send the file again
@enduml</code></pre></details>
<p>On one computer there is one copy of the file's data in the kernel's buffer cache, shared by all processes, so a write by anybody is immediately visible to everybody — the "UNIX semantics". Put a network and <em>caches</em> in between and there are several copies; the file server's, and one in each client. A write at one place does not instantly reach the others. We can run both halves: first the real thing on one machine (two <em>processes</em>, one file), then a tiny model of a caching client:</p>
<pre><code class="language-javascript">// Figure 8-35: what does a READ return when a file is shared? One machine versus a client that caches
import { writeFileSync, appendFileSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

// (a) one machine: two PROCESSES, one file. A appends "c", then B reads: B always sees "abc"
writeFileSync('/tmp/f', 'ab');
spawnSync('node', ['-e', "require('fs').appendFileSync('/tmp/f','c')"]);                       // process A
const b = spawnSync('node', ['-e', "console.log(require('fs').readFileSync('/tmp/f','utf8'))"]); // process B
console.log('(a) one machine, B reads after A wrote "c":', JSON.stringify(b.stdout.toString().trim()), '  &lt;- sequential consistency');

// (b) a file server and two clients; client 2 CACHES what it read. A tiny model of NFS-style caching
class Server { data = 'ab'; read() { return this.data; } write(d) { this.data = d; } }
class Client {
  constructor(srv, policy) { this.srv = srv; this.policy = policy; this.cache = null; this.session = null; }
  read() {
    if (this.policy === 'validate') return this.srv.read();                       // ask the server every time
    if (this.policy === 'session') { if (this.session === null) this.session = this.srv.read(); return this.session; }   // snapshot at open()
    if (this.cache === null) this.cache = this.srv.read();                        // cache with no check
    return this.cache;
  }
  write(d) { this.srv.write(d); }
}
for (const policy of ['cache-no-check', 'validate', 'session']) {
  const srv = new Server(); const c1 = new Client(srv, policy), c2 = new Client(srv, policy);
  console.log(&#96;(b) policy "&#36;{policy}": client 2 reads&#96;, JSON.stringify(c2.read()), '(first read, now cached)');
  c1.write('abc');                                                                  // client 1 writes "c" at the server
  console.log(&#96;    client 1 wrote "abc"; client 2 reads again -&gt;&#96;, JSON.stringify(c2.read()), policy === 'validate' ? '(fresh, but one server round trip per read)' : '(OBSOLETE value)');
}
console.log('real file on the server now:', JSON.stringify(readFileSync('/tmp/f', 'utf8')));</code></pre>
<div class="out">$ node ngu-nghia-tep.js<br>
(a) one machine, B reads after A wrote "c": "abc" &nbsp;&nbsp;&lt;- sequential consistency<br>
(b) policy "cache-no-check": client 2 reads "ab" (first read, now cached)<br>
&nbsp;&nbsp;&nbsp;&nbsp;client 1 wrote "abc"; client 2 reads again -&gt; "ab" (OBSOLETE value)<br>
(b) policy "validate": client 2 reads "ab" (first read, now cached)<br>
&nbsp;&nbsp;&nbsp;&nbsp;client 1 wrote "abc"; client 2 reads again -&gt; "abc" (fresh, but one server round trip per read)<br>
(b) policy "session": client 2 reads "ab" (first read, now cached)<br>
&nbsp;&nbsp;&nbsp;&nbsp;client 1 wrote "abc"; client 2 reads again -&gt; "ab" (OBSOLETE value)<br>
real file on the server now: "abc"</div>
<p>Part (a): the file written by one process is read by another as "abc" at once — the single machine's guarantee. Part (b), three client policies: <strong>cache-no-check</strong> serves client 2's old copy — the obsolete value of the figure; <strong>validate</strong> asks the server on every read and is always fresh but costs a round trip each time (NFS does a cheaper version of this: it checks attributes every few seconds); <strong>session semantics</strong> takes a snapshot when the file is opened and shows <em>changes only after close and reopen</em> — in this model, client 2's snapshot stays "ab" until it reopens. The book lists four ways out: <strong>UNIX semantics</strong> (every write is visible immediately — expensive: it needs no client caching or heavy invalidation), <strong>session semantics</strong> (changes visible when the file is closed), <strong>immutable files</strong> (a file cannot be modified; "changes" create a new version — no stale value is possible), and <strong>transactions</strong> (open/close as begin/commit; atomic and isolated). Each trades freshness against cost and complexity.</p>
<p>The modern forms are everywhere. <strong>NFS</strong> uses <em>close-to-open</em> consistency: when a client opens a file it checks with the server for changes, and when it closes a file it flushes its writes (<code>man 5 nfs</code>) — a session-semantics cousin. Object stores (S3) are <em>immutable objects</em>: you replace a whole object. A web <strong>HTTP cache</strong> with <code>Cache-Control: max-age=60</code> deliberately serves possibly-stale pages for a minute; <code>ETag</code> + <code>If-None-Match</code> is "validate" and costs one small round trip. A <strong>read replica</strong> of a database is the same issue as slide 29.</p>
<div class="callout">🧭 On a real server: "I saved, I reloaded, I see the old value" is the bug report for exactly this slide — an HTTP cache, a CDN, a Redis cache with a TTL, or a read replica that has not caught up. First question to ask: <em>which semantics did we choose?</em> A good API says it (fresh: read the primary; eventually consistent: replicas and caches), and the client that must read its own write is routed so that it can.</div>
<p class="pitfall">⚠️ "Eventually consistent" is not "inconsistent": it means that if writes stop, all copies converge. What it does not promise is <em>when</em>. In Figure 8-35(b), client 2 stays obsolete until its cache is invalidated or expires.</p>`,
        `<p class="y-chinh">🎯 Hình 8-35 — lệnh <code>read</code> trả về gì khi tệp được chia sẻ? (a) <strong>một máy</strong>: tiến trình A ghi "c" vào tệp "ab", rồi tiến trình B đọc và nhận "abc" — <strong>nhất quán tuần tự (sequential consistency)</strong>: mọi lần đọc thấy tác động của mọi lần ghi trước đó. (b) trong <strong>hệ phân tán có cache</strong>: client 1 ghi "c" tại file server, nhưng client 2 đã cache tệp cũ và đọc được "ab" — một <strong>giá trị lỗi thời</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/c63bc20f9250fc9003e07e63891e8333cdd2d7bf.svg" alt="Hình 8-35(b) dạng tuần tự: cache của client 2 trả lời bằng giá trị cũ" loading="lazy" /><p class="chu-thich">🧩 Hình 8-35(b) dạng tuần tự: cache của client 2 trả lời bằng giá trị cũ</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 8-35(b): client có cache đọc phải giá trị cũ
title Figure 8-35(b) — file "ab" shared by two clients, one of them caches
participant "Client 1" as C1
participant "File server" as S
participant "Client 2\\n(with a cache)" as C2
C2 -&gt; S : read the file
S --&gt; C2 : "ab"   (client 2 keeps a copy in its cache)
C1 -&gt; S : write "c" at the end
S -&gt; S : the file is now "abc"
C2 -&gt; C2 : read again → answered from its OWN cache
note right of C2 #FEE2E2 : returns "ab" — an OBSOLETE value.\\nOn one machine this cannot happen:\\nthe read always sees "abc" (sequential consistency).
== fixes, each with a price ==
C2 -&gt; S : validate the cache first (NFS: "has it changed?")  — one round trip per read
S --&gt; C2 : yes, changed → send the file again
@enduml</code></pre></details>
<p>Trên một máy tính chỉ có một bản dữ liệu của tệp trong buffer cache của nhân, mọi tiến trình dùng chung, nên một lệnh ghi của bất kỳ ai lập tức hiện ra với mọi người — "ngữ nghĩa UNIX". Đặt mạng và <em>cache</em> vào giữa thì có nhiều bản; bản của file server và một bản ở mỗi client. Một lệnh ghi ở một nơi không tới ngay các nơi khác. Ta chạy được cả hai nửa: trước hết cái thật trên một máy (hai <em>tiến trình</em>, một tệp), rồi một mô hình nhỏ của client có cache:</p>
<pre><code class="language-javascript">// Hình 8-35: lệnh ĐỌC trả về gì khi tệp được chia sẻ? Một máy so với một client có cache
import { writeFileSync, appendFileSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

// (a) một máy: hai TIẾN TRÌNH, một tệp. A nối "c", rồi B đọc: B luôn thấy "abc"
writeFileSync('/tmp/f', 'ab');
spawnSync('node', ['-e', "require('fs').appendFileSync('/tmp/f','c')"]);                       // tiến trình A
const b = spawnSync('node', ['-e', "console.log(require('fs').readFileSync('/tmp/f','utf8'))"]); // tiến trình B
console.log('(a) one machine, B reads after A wrote "c":', JSON.stringify(b.stdout.toString().trim()), '  &lt;- sequential consistency');

// (b) một file server và hai client; client 2 CACHE cái nó đã đọc. Mô hình nhỏ của cache kiểu NFS
class Server { data = 'ab'; read() { return this.data; } write(d) { this.data = d; } }
class Client {
  constructor(srv, policy) { this.srv = srv; this.policy = policy; this.cache = null; this.session = null; }
  read() {
    if (this.policy === 'validate') return this.srv.read();                       // hỏi server mọi lần
    if (this.policy === 'session') { if (this.session === null) this.session = this.srv.read(); return this.session; }   // ảnh chụp lúc open()
    if (this.cache === null) this.cache = this.srv.read();                        // cache không kiểm tra
    return this.cache;
  }
  write(d) { this.srv.write(d); }
}
for (const policy of ['cache-no-check', 'validate', 'session']) {
  const srv = new Server(); const c1 = new Client(srv, policy), c2 = new Client(srv, policy);
  console.log(&#96;(b) policy "&#36;{policy}": client 2 reads&#96;, JSON.stringify(c2.read()), '(first read, now cached)');
  c1.write('abc');                                                                  // client 1 ghi "c" lên server
  console.log(&#96;    client 1 wrote "abc"; client 2 reads again -&gt;&#96;, JSON.stringify(c2.read()), policy === 'validate' ? '(fresh, but one server round trip per read)' : '(OBSOLETE value)');
}
console.log('real file on the server now:', JSON.stringify(readFileSync('/tmp/f', 'utf8')));</code></pre>
<div class="out">$ node ngu-nghia-tep.js<br>
(a) one machine, B reads after A wrote "c": "abc" &nbsp;&nbsp;&lt;- sequential consistency<br>
(b) policy "cache-no-check": client 2 reads "ab" (first read, now cached)<br>
&nbsp;&nbsp;&nbsp;&nbsp;client 1 wrote "abc"; client 2 reads again -&gt; "ab" (OBSOLETE value)<br>
(b) policy "validate": client 2 reads "ab" (first read, now cached)<br>
&nbsp;&nbsp;&nbsp;&nbsp;client 1 wrote "abc"; client 2 reads again -&gt; "abc" (fresh, but one server round trip per read)<br>
(b) policy "session": client 2 reads "ab" (first read, now cached)<br>
&nbsp;&nbsp;&nbsp;&nbsp;client 1 wrote "abc"; client 2 reads again -&gt; "ab" (OBSOLETE value)<br>
real file on the server now: "abc"</div>
<p>Phần (a): tệp do một tiến trình ghi được tiến trình khác đọc là "abc" ngay — bảo đảm của một máy. Phần (b), ba chính sách của client: <strong>cache-no-check</strong> trả bản cũ của client 2 — giá trị lỗi thời của hình; <strong>validate</strong> hỏi server ở mỗi lần đọc và luôn mới nhưng tốn một vòng đi-về mỗi lần (NFS làm một bản rẻ hơn: kiểm thuộc tính mỗi vài giây); <strong>ngữ nghĩa phiên (session semantics)</strong> chụp ảnh khi tệp được mở và chỉ cho thấy <em>thay đổi sau khi đóng và mở lại</em> — trong mô hình này ảnh chụp của client 2 vẫn là "ab" cho tới khi nó mở lại. Sách liệt kê bốn lối ra: <strong>ngữ nghĩa UNIX</strong> (mỗi lệnh ghi hiện ngay — đắt: cần không cache ở client hay vô hiệu hoá nặng nề), <strong>ngữ nghĩa phiên</strong> (thay đổi hiện khi tệp được đóng), <strong>tệp bất biến (immutable)</strong> (tệp không sửa được; "thay đổi" tạo phiên bản mới — không thể có giá trị lỗi thời), và <strong>giao dịch (transaction)</strong> (open/close như begin/commit; nguyên tử và cô lập). Mỗi cách đánh đổi độ mới với chi phí và độ phức tạp.</p>
<p>Các dạng hiện đại có khắp nơi. <strong>NFS</strong> dùng nhất quán <em>close-to-open</em>: khi client mở tệp nó hỏi server có thay đổi không, và khi đóng tệp nó xả các lệnh ghi (<code>man 5 nfs</code>) — họ hàng của ngữ nghĩa phiên. Kho đối tượng (S3) là <em>đối tượng bất biến</em>: bạn thay cả đối tượng. Một <strong>cache HTTP</strong> với <code>Cache-Control: max-age=60</code> cố ý phục vụ trang có thể đã cũ trong một phút; <code>ETag</code> + <code>If-None-Match</code> là "validate" và tốn một vòng đi-về nhỏ. <strong>Read replica</strong> của cơ sở dữ liệu là cùng vấn đề với slide 29.</p>
<div class="callout">🧭 Trên server thật: "tôi lưu rồi, tải lại, vẫn thấy giá trị cũ" là báo cáo lỗi của đúng slide này — một cache HTTP, một CDN, một cache Redis có TTL, hay một read replica chưa bắt kịp. Câu hỏi đầu tiên: <em>ta đã chọn ngữ nghĩa nào?</em> Một API tốt nói rõ điều đó (mới: đọc primary; nhất quán sau cùng: replica và cache), và client phải đọc thấy thứ mình vừa ghi được định tuyến để làm được.</div>
<p class="pitfall">⚠️ "Eventually consistent" (nhất quán sau cùng) không phải "không nhất quán": nó nghĩa là nếu việc ghi dừng thì mọi bản hội tụ. Điều nó không hứa là <em>khi nào</em>. Ở Hình 8-35(b), client 2 vẫn lỗi thời cho tới khi cache của nó bị vô hiệu hay hết hạn.</p>`],
      [46, 'Object-Based Middleware',
        `<p class="y-chinh">🎯 Figure 8-36 — <strong>object-based middleware</strong> (CORBA): everything is an <strong>object</strong> that offers methods; a client calls a method of a <em>remote</em> object through a <strong>client stub</strong>; the <strong>ORB</strong> (Object Request Broker) in each machine finds the object and carries the call over the <strong>IIOP</strong> protocol to the server's ORB, which hands it through an <strong>object adapter</strong> and a <strong>skeleton</strong> to the server object.</p>
<p>The model: a distributed system is a collection of objects (each has data and methods) that can live on different machines; the middleware's promise is that <code>account.deposit(100)</code> looks identical whether the <code>account</code> object is in the same process or on another continent. <strong>CORBA</strong> (Common Object Request Broker Architecture, from the OMG consortium, early 1990s) standardised it for any language and OS: interfaces are written in an <strong>IDL</strong> (Interface Definition Language), compiled into <em>stubs</em> (client side) and <em>skeletons</em> (server side), and the ORBs speak IIOP across vendors. If this sounds like slide 25's RPC with objects, it is: object-based middleware is RPC plus <em>object references</em> and <em>naming/lifecycle services</em>.</p>
<p><strong>Where it went.</strong> CORBA shaped the 1990s and then faded; the book's figure is a historical one. The reasons are common to many such standards: the specification was huge and complex, interoperability between ORBs of different vendors was poor in practice, firewalls blocked its dynamic ports, and by the 2000s developers preferred plain HTTP with XML (SOAP) and then JSON (REST). Its <em>ideas</em> survive almost unchanged: a language-neutral interface description compiled to stubs is exactly what <strong>gRPC</strong> does with Protocol Buffers (<code>.proto</code> = IDL; <code>protoc</code> = IDL compiler; generated client/server code = stub/skeleton), and Java's <em>RMI</em>, .NET's <em>WCF</em> and Thrift are cousins. gRPC was open-sourced by Google in 2015 and became a Cloud Native Computing Foundation project in 2017 (TechCrunch and RedMonk reports of March 2017); it runs over HTTP/2, and so passes the firewalls that stopped CORBA.</p>
<p>The recurring lesson: <em>a remote object that looks like a local one hides cost and failure</em> (slide 25). Fowler's "first law of distributed object design" is "do not distribute your objects" — a remote call per getter is a performance disaster. That is why API design coarsens the interface: one call that returns the whole order, not ten calls for its fields.</p>
<div class="callout">🧭 On a real server: when you define <code>service OrderService { rpc Create (OrderRequest) returns (OrderReply); }</code> in a <code>.proto</code> file and generate Java and Node code from it, you are doing what Figure 8-36 draws: IDL → stub/skeleton → a wire protocol. REST with an OpenAPI spec generating client SDKs is the same pipeline with HTTP verbs. Choose by the book's own criteria: interoperability, tooling, and how much the team can afford to learn.</div>
<p class="pitfall">⚠️ Exam wording: in CORBA the <strong>ORB</strong> is the middleware core that locates objects and transports calls; the <strong>stub</strong> sits at the client, the <strong>skeleton</strong> (and the <strong>object adapter</strong>) at the server; <strong>IIOP</strong> is the wire protocol between ORBs.</p>`,
        `<p class="y-chinh">🎯 Hình 8-36 — <strong>middleware dựa trên đối tượng</strong> (CORBA): mọi thứ là một <strong>đối tượng</strong> cung cấp các phương thức; client gọi một phương thức của một đối tượng <em>ở xa</em> qua một <strong>client stub</strong>; <strong>ORB</strong> (Object Request Broker) ở mỗi máy tìm đối tượng và chở lời gọi qua giao thức <strong>IIOP</strong> tới ORB của server, nơi nó được đưa qua một <strong>object adapter</strong> và một <strong>skeleton</strong> tới đối tượng ở server.</p>
<p>Mô hình: một hệ phân tán là một tập đối tượng (mỗi đối tượng có dữ liệu và phương thức) có thể sống trên các máy khác nhau; lời hứa của middleware là <code>account.deposit(100)</code> trông giống hệt dù đối tượng <code>account</code> ở cùng tiến trình hay ở châu lục khác. <strong>CORBA</strong> (Common Object Request Broker Architecture, của liên minh OMG, đầu thập niên 1990) chuẩn hoá nó cho mọi ngôn ngữ và HĐH: giao diện được viết bằng <strong>IDL</strong> (Interface Definition Language), biên dịch thành <em>stub</em> (phía client) và <em>skeleton</em> (phía server), và các ORB nói IIOP xuyên các nhà cung cấp. Nếu nghe giống RPC của slide 25 kèm đối tượng thì đúng vậy: middleware dựa trên đối tượng là RPC cộng <em>tham chiếu đối tượng</em> và <em>dịch vụ đặt tên/vòng đời</em>.</p>
<p><strong>Nó đã đi đâu.</strong> CORBA định hình thập niên 1990 rồi mờ dần; hình của sách là một hình lịch sử. Lý do chung với nhiều chuẩn như vậy: đặc tả khổng lồ và phức tạp, tương tác giữa các ORB của nhà cung cấp khác nhau kém trong thực tế, tường lửa chặn các cổng động của nó, và tới thập niên 2000 lập trình viên chuộng HTTP thuần với XML (SOAP) rồi JSON (REST). Nhưng các <em>ý tưởng</em> của nó sống gần như nguyên vẹn: một mô tả giao diện trung lập ngôn ngữ biên dịch thành stub chính là điều <strong>gRPC</strong> làm với Protocol Buffers (<code>.proto</code> = IDL; <code>protoc</code> = bộ biên dịch IDL; mã client/server sinh ra = stub/skeleton), và <em>RMI</em> của Java, <em>WCF</em> của .NET và Thrift là họ hàng. gRPC được Google mở mã nguồn năm 2015 và trở thành một dự án của Cloud Native Computing Foundation năm 2017 (các bản tin của TechCrunch và RedMonk tháng 3/2017); nó chạy trên HTTP/2, nên qua được các tường lửa đã chặn CORBA.</p>
<p>Bài học lặp lại: <em>một đối tượng ở xa trông như cục bộ giấu chi phí và lỗi</em> (slide 25). "Luật đầu tiên của thiết kế đối tượng phân tán" của Fowler là "đừng phân tán các đối tượng của bạn" — một lời gọi từ xa cho mỗi getter là thảm hoạ hiệu năng. Vì thế thiết kế API làm thô giao diện: một lời gọi trả về cả đơn hàng, không phải mười lời gọi cho các trường của nó.</p>
<div class="callout">🧭 Trên server thật: khi bạn định nghĩa <code>service OrderService { rpc Create (OrderRequest) returns (OrderReply); }</code> trong một tệp <code>.proto</code> và sinh mã Java và Node từ đó, bạn đang làm đúng điều Hình 8-36 vẽ: IDL → stub/skeleton → một giao thức dây. REST với đặc tả OpenAPI sinh SDK cho client là cùng đường ống với động từ HTTP. Chọn theo chính tiêu chí của sách: khả năng tương tác, công cụ, và nhóm có thể chi bao nhiêu để học.</div>
<p class="pitfall">⚠️ Cách hỏi thi: trong CORBA, <strong>ORB</strong> là lõi middleware tìm đối tượng và chở lời gọi; <strong>stub</strong> ở client, <strong>skeleton</strong> (và <strong>object adapter</strong>) ở server; <strong>IIOP</strong> là giao thức dây giữa các ORB.</p>`],
      [47, 'Coordination-Based Middleware (1)',
        `<p class="y-chinh">🎯 Figure 8-37 — <strong>coordination-based middleware</strong> (Linda): processes do not call each other; they communicate through a shared <strong>tuple space</strong> — a bag of <strong>tuples</strong> (ordered, typed lists of fields) such as <code>("abc", 2, 5)</code>, <code>("matrix-1", 1, 6, 3.14)</code> and <code>("family", "is-sister", "Stephany", "Roberta")</code>. A process <code>out</code>-puts a tuple, <code>rd</code>-reads one that matches a template, or <code>in</code>-takes (reads and removes) one.</p>
<p>Linda (David Gelernter, Yale, 1985) rests on one idea: <strong>decouple processes in space and time</strong>. A producer does not know who consumes its tuples; a consumer need not exist when the tuple is produced. The primitives are four: <code>out(t)</code> adds a tuple; <code>in(template)</code> blocks until a matching tuple exists, then <em>removes</em> and returns it; <code>rd(template)</code> is the same without removing; <code>eval</code> starts a new process. To "send a task to whoever is free" you <code>out("job", 42)</code>; every worker loops on <code>in("job", ?x)</code>, and the tuple space acts as a work queue with automatic load balancing (receiver-initiated, slide 32!) — nobody has addressed anyone.</p>
<p>The next slide gives the matching rules. First, run it — a 30-line tuple space in Node.js that uses exactly the three tuples of the figure:</p>
<pre><code class="language-javascript">// Figures 8-37 and the three matching rules of slide 48: a Linda tuple space in 30 lines
class TupleSpace {
  tuples = []; waiting = [];
  out(...t) {                                            // put a tuple in; wake up anyone waiting for it
    this.tuples.push(t); console.log('out ', JSON.stringify(t));
    this.waiting = this.waiting.filter((w) =&gt; !this.#try(w));
  }
  rd(...tpl) { return new Promise((res) =&gt; { const w = { tpl, take: false, res }; if (!this.#try(w)) this.waiting.push(w); }); }   // read, leave it
  in(...tpl) { return new Promise((res) =&gt; { const w = { tpl, take: true, res }; if (!this.#try(w)) this.waiting.push(w); }); }     // read and REMOVE
  #try(w) {
    const i = this.tuples.findIndex((t) =&gt; match(w.tpl, t)); if (i &lt; 0) return false;
    const t = this.tuples[i]; if (w.take) this.tuples.splice(i, 1); w.res(t); return true;
  }
}
// rule 1: same number of fields; rule 2: types of corresponding fields equal; rule 3: constants equal (a TYPE as a template field = "any value of that type")
const kind = (x) =&gt; (typeof x === 'function' ? x.name.toLowerCase() : typeof x);
function match(tpl, t) {
  if (tpl.length !== t.length) return false;
  return tpl.every((f, i) =&gt; (typeof f === 'function' ? typeof t[i] === f.name.toLowerCase() : f === t[i]) &amp;&amp; (typeof f === 'function' || kind(f) === kind(t[i])));
}
const ts = new TupleSpace();
ts.out('abc', 2, 5); ts.out('matrix-1', 1, 6, 3.14); ts.out('family', 'is-sister', 'Stephany', 'Roberta');   // the three tuples of Figure 8-37
console.log('rd  ("abc", Number, Number)       -&gt;', JSON.stringify(await ts.rd('abc', Number, Number)));
console.log('rd  ("abc", Number)               -&gt; (2 fields vs 3: rule 1 fails, waits) ...');
const pending = ts.rd('abc', Number);                     // never matches, so it stays pending
console.log('rd  ("family", "is-sister", String, String) -&gt;', JSON.stringify(await ts.rd('family', 'is-sister', String, String)));
console.log('rd  ("abc", String, Number)       -&gt; (2 is a number, not a string: rule 2 fails) ...');
let done = false; ts.rd('abc', String, Number).then(() =&gt; { done = true; });
// a worker blocks on in(): the producer that comes later wakes it up (decoupled in time)
const worker = ts.in('job', Number).then((t) =&gt; console.log('worker got job number', t[1], 'and removed it from the space'));
ts.out('job', 42);
await worker;
console.log('tuples left in the space:', ts.tuples.length, '| the two impossible reads still waiting:', ts.waiting.length, '| done =', done);
void pending;</code></pre>
<div class="out">$ node bo-tuple.js<br>
out &nbsp;["abc",2,5]<br>
out &nbsp;["matrix-1",1,6,3.14]<br>
out &nbsp;["family","is-sister","Stephany","Roberta"]<br>
rd &nbsp;("abc", Number, Number) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ["abc",2,5]<br>
rd &nbsp;("abc", Number) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; (2 fields vs 3: rule 1 fails, waits) ...<br>
rd &nbsp;("family", "is-sister", String, String) -&gt; ["family","is-sister","Stephany","Roberta"]<br>
rd &nbsp;("abc", String, Number) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; (2 is a number, not a string: rule 2 fails) ...<br>
out &nbsp;["job",42]<br>
worker got job number 42 and removed it from the space<br>
tuples left in the space: 3 | the two impossible reads still waiting: 2 | done = false</div>
<p>Look at what happened in order. Three tuples were put in (<code>out</code>). The read <code>("abc", Number, Number)</code> found <code>("abc", 2, 5)</code> and left it in place. A read with a template of only two fields could not match anything, so it waits; and the worker <code>in("job", Number)</code> blocked until the producer, <em>later</em>, put <code>("job", 42)</code> — then it got it and the tuple vanished from the space. At the end the space still holds the 3 original tuples (reads do not remove), and two reads are still waiting for matches that will never come — the "decoupling" has a price: a consumer waiting for something nobody produces waits forever.</p>
<p>➕ Tuple spaces were commercial products too: JavaSpaces (Sun, 1999, part of Jini) and GigaSpaces. Linda's descendants are inside the infrastructure of today's systems: <strong>Apache ZooKeeper</strong> and <strong>etcd</strong> are "coordination services" (a small shared store with watches that Kubernetes, Kafka and HBase use to elect leaders and share configuration), and a <strong>job queue</strong> (Celery, BullMQ, SQS) is the <code>out</code>/<code>in</code> pair with durability added.</p>
<p class="meo">🧠 Linda in one line: <em>"write to a shared board, read by pattern — nobody addresses anybody."</em></p>`,
        `<p class="y-chinh">🎯 Hình 8-37 — <strong>middleware dựa trên điều phối (coordination-based)</strong> (Linda): các tiến trình không gọi nhau; chúng giao tiếp qua một <strong>không gian tuple (tuple space)</strong> dùng chung — một cái túi các <strong>tuple</strong> (danh sách có thứ tự, có kiểu, của các trường) như <code>("abc", 2, 5)</code>, <code>("matrix-1", 1, 6, 3.14)</code> và <code>("family", "is-sister", "Stephany", "Roberta")</code>. Một tiến trình <code>out</code> (đặt) một tuple, <code>rd</code> (đọc) một tuple khớp với mẫu, hoặc <code>in</code> (lấy: đọc và xoá) một tuple.</p>
<p>Linda (David Gelernter, Yale, 1985) dựa trên một ý: <strong>tách rời các tiến trình về không gian và thời gian</strong>. Nhà sản xuất không biết ai tiêu thụ tuple của mình; người tiêu thụ không cần tồn tại lúc tuple được tạo. Có bốn nguyên thủy: <code>out(t)</code> thêm một tuple; <code>in(mẫu)</code> chặn tới khi có tuple khớp, rồi <em>xoá</em> và trả nó; <code>rd(mẫu)</code> như vậy nhưng không xoá; <code>eval</code> khởi động một tiến trình mới. Để "gửi một việc cho ai đang rảnh" bạn <code>out("job", 42)</code>; mọi worker lặp <code>in("job", ?x)</code>, và không gian tuple đóng vai hàng đợi việc với cân bằng tải tự động (do bên nhận khởi xướng, slide 32!) — không ai gọi địa chỉ ai.</p>
<p>Slide kế cho các luật khớp. Trước hết, chạy nó — một không gian tuple 30 dòng bằng Node.js dùng đúng ba tuple của hình:</p>
<pre><code class="language-javascript">// Hình 8-37 và ba luật khớp của slide 48: một không gian tuple Linda trong 30 dòng
class TupleSpace {
  tuples = []; waiting = [];
  out(...t) {                                            // bỏ một tuple vào; đánh thức ai đang chờ nó
    this.tuples.push(t); console.log('out ', JSON.stringify(t));
    this.waiting = this.waiting.filter((w) =&gt; !this.#try(w));
  }
  rd(...tpl) { return new Promise((res) =&gt; { const w = { tpl, take: false, res }; if (!this.#try(w)) this.waiting.push(w); }); }   // đọc, để nguyên
  in(...tpl) { return new Promise((res) =&gt; { const w = { tpl, take: true, res }; if (!this.#try(w)) this.waiting.push(w); }); }     // đọc và XOÁ
  #try(w) {
    const i = this.tuples.findIndex((t) =&gt; match(w.tpl, t)); if (i &lt; 0) return false;
    const t = this.tuples[i]; if (w.take) this.tuples.splice(i, 1); w.res(t); return true;
  }
}
// luật 1: cùng số trường; luật 2: kiểu các trường tương ứng bằng nhau; luật 3: hằng bằng nhau (một KIỂU ở vị trí mẫu = "giá trị bất kỳ của kiểu đó")
const kind = (x) =&gt; (typeof x === 'function' ? x.name.toLowerCase() : typeof x);
function match(tpl, t) {
  if (tpl.length !== t.length) return false;
  return tpl.every((f, i) =&gt; (typeof f === 'function' ? typeof t[i] === f.name.toLowerCase() : f === t[i]) &amp;&amp; (typeof f === 'function' || kind(f) === kind(t[i])));
}
const ts = new TupleSpace();
ts.out('abc', 2, 5); ts.out('matrix-1', 1, 6, 3.14); ts.out('family', 'is-sister', 'Stephany', 'Roberta');   // ba tuple của Hình 8-37
console.log('rd  ("abc", Number, Number)       -&gt;', JSON.stringify(await ts.rd('abc', Number, Number)));
console.log('rd  ("abc", Number)               -&gt; (2 fields vs 3: rule 1 fails, waits) ...');
const pending = ts.rd('abc', Number);                     // không bao giờ khớp nên cứ chờ
console.log('rd  ("family", "is-sister", String, String) -&gt;', JSON.stringify(await ts.rd('family', 'is-sister', String, String)));
console.log('rd  ("abc", String, Number)       -&gt; (2 is a number, not a string: rule 2 fails) ...');
let done = false; ts.rd('abc', String, Number).then(() =&gt; { done = true; });
// một worker chặn ở in(): nhà sản xuất tới sau sẽ đánh thức nó (tách rời về thời gian)
const worker = ts.in('job', Number).then((t) =&gt; console.log('worker got job number', t[1], 'and removed it from the space'));
ts.out('job', 42);
await worker;
console.log('tuples left in the space:', ts.tuples.length, '| the two impossible reads still waiting:', ts.waiting.length, '| done =', done);
void pending;</code></pre>
<div class="out">$ node bo-tuple.js<br>
out &nbsp;["abc",2,5]<br>
out &nbsp;["matrix-1",1,6,3.14]<br>
out &nbsp;["family","is-sister","Stephany","Roberta"]<br>
rd &nbsp;("abc", Number, Number) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ["abc",2,5]<br>
rd &nbsp;("abc", Number) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; (2 fields vs 3: rule 1 fails, waits) ...<br>
rd &nbsp;("family", "is-sister", String, String) -&gt; ["family","is-sister","Stephany","Roberta"]<br>
rd &nbsp;("abc", String, Number) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; (2 is a number, not a string: rule 2 fails) ...<br>
out &nbsp;["job",42]<br>
worker got job number 42 and removed it from the space<br>
tuples left in the space: 3 | the two impossible reads still waiting: 2 | done = false</div>
<p>Nhìn chuyện xảy ra theo thứ tự. Ba tuple được đặt vào (<code>out</code>). Lệnh đọc <code>("abc", Number, Number)</code> tìm thấy <code>("abc", 2, 5)</code> và để nguyên. Một lệnh đọc với mẫu chỉ hai trường không khớp được gì nên chờ; và worker <code>in("job", Number)</code> bị chặn tới khi nhà sản xuất, <em>về sau</em>, đặt <code>("job", 42)</code> — khi đó nó nhận được và tuple biến khỏi không gian. Cuối cùng không gian vẫn còn 3 tuple ban đầu (đọc không xoá), và hai lệnh đọc vẫn đang chờ các khớp sẽ không bao giờ tới — "tách rời" có cái giá: người tiêu thụ chờ thứ không ai sản xuất sẽ chờ mãi.</p>
<p>➕ Không gian tuple cũng từng là sản phẩm thương mại: JavaSpaces (Sun, 1999, một phần của Jini) và GigaSpaces. Hậu duệ của Linda nằm trong hạ tầng của các hệ thống ngày nay: <strong>Apache ZooKeeper</strong> và <strong>etcd</strong> là "dịch vụ điều phối" (một kho dùng chung nhỏ với cơ chế theo dõi mà Kubernetes, Kafka và HBase dùng để bầu leader và chia sẻ cấu hình), và một <strong>hàng đợi việc</strong> (Celery, BullMQ, SQS) là cặp <code>out</code>/<code>in</code> thêm tính bền.</p>
<p class="meo">🧠 Linda trong một dòng: <em>"ghi lên một tấm bảng chung, đọc theo mẫu — không ai gọi địa chỉ ai."</em></p>`],
      [48, 'Coordination-Based Middleware (2)',
        `<p class="y-chinh">🎯 A template <strong>matches</strong> a tuple if all three conditions hold: (1) the template and the tuple have the <strong>same number of fields</strong>; (2) the <strong>types</strong> of corresponding fields are equal; (3) each <strong>constant or variable</strong> in the template matches its tuple field.</p>
<p>Take the tuples of Figure 8-37 and test three templates (the program of the last slide printed these results). <code>("abc", ?int, ?int)</code>: 3 fields vs 3 ✓; types string, int, int vs string, int, int ✓; constant <code>"abc"</code> equals the first field ✓, the two variables accept any int ✓ — <strong>matches</strong> <code>("abc", 2, 5)</code>, and binds the variables to 2 and 5. <code>("abc", ?int)</code>: 2 fields vs 3 ✗ — rule 1 fails. <code>("abc", ?string, ?int)</code>: the second field of the tuple is the <em>number</em> 2, the template asks for a string ✗ — rule 2 fails. Rule 3 is the only one that looks at <em>values</em>: <code>("abc", 7, ?int)</code> has the right shape but the constant 7 ≠ 2 ✗.</p>
<p>This is <strong>associative addressing</strong>: you find data by <em>what it looks like</em>, not by <em>where it is</em> or <em>who sent it</em> — the same idea as SQL's <code>WHERE</code> and as a database query. Compare the three ways to find data in a distributed system: by <em>address</em> (an IP or a pointer — slide 44's first approach), by <em>name</em> (DNS, a key), and by <em>content</em> (a pattern, a query). Content-based addressing is the most flexible and the most costly — somebody must search.</p>
<p>The design gives Linda its good and bad properties. Good: processes can be written, started, stopped, replaced and scaled without knowing each other (a worker that dies simply stops taking <code>in("job", ?)</code>). Bad: the space is a bottleneck and single point of failure unless it is itself distributed; matching can be slow; and there is no <em>timeout</em> in the basic model (which is why real systems add leases/expiry: ZooKeeper's ephemeral nodes disappear when the client's session dies).</p>
<p class="pitfall">⚠️ Do not confuse the match rules with equality: types must match even if values would be "equal" in a loose language (the number 2 does not match the string "2"). A typical exam check: "which template matches <code>("matrix-1", 1, 6, 3.14)</code>?" — count fields first (4), then types (string, int, int, float), then constants.</p>`,
        `<p class="y-chinh">🎯 Một mẫu <strong>khớp (match)</strong> với một tuple nếu cả ba điều kiện đúng: (1) mẫu và tuple có <strong>cùng số trường</strong>; (2) <strong>kiểu</strong> của các trường tương ứng bằng nhau; (3) mỗi <strong>hằng hay biến</strong> trong mẫu khớp với trường của tuple.</p>
<p>Lấy các tuple của Hình 8-37 và thử ba mẫu (chương trình ở slide trước đã in các kết quả này). <code>("abc", ?int, ?int)</code>: 3 trường so với 3 ✓; kiểu string, int, int so với string, int, int ✓; hằng <code>"abc"</code> bằng trường đầu ✓, hai biến nhận mọi int ✓ — <strong>khớp</strong> <code>("abc", 2, 5)</code>, và gán các biến bằng 2 và 5. <code>("abc", ?int)</code>: 2 trường so với 3 ✗ — luật 1 sai. <code>("abc", ?string, ?int)</code>: trường thứ hai của tuple là <em>số</em> 2, mẫu đòi chuỗi ✗ — luật 2 sai. Luật 3 là luật duy nhất nhìn vào <em>giá trị</em>: <code>("abc", 7, ?int)</code> có đúng hình dạng nhưng hằng 7 ≠ 2 ✗.</p>
<p>Đây là <strong>định địa chỉ kết hợp (associative addressing)</strong>: bạn tìm dữ liệu theo <em>nó trông thế nào</em>, không theo <em>nó ở đâu</em> hay <em>ai gửi</em> — cùng ý với <code>WHERE</code> của SQL và với truy vấn cơ sở dữ liệu. So ba cách tìm dữ liệu trong hệ phân tán: theo <em>địa chỉ</em> (một IP hay con trỏ — cách tiếp cận đầu của slide 44), theo <em>tên</em> (DNS, một khoá), và theo <em>nội dung</em> (một mẫu, một truy vấn). Định địa chỉ theo nội dung linh hoạt nhất và tốn nhất — ai đó phải tìm kiếm.</p>
<p>Thiết kế cho Linda các tính chất tốt và xấu. Tốt: tiến trình có thể được viết, khởi động, dừng, thay thế và mở rộng mà không biết nhau (một worker chết đơn giản là thôi lấy <code>in("job", ?)</code>). Xấu: không gian là nút cổ chai và điểm hỏng đơn trừ khi bản thân nó được phân tán; việc khớp có thể chậm; và mô hình cơ bản không có <em>timeout</em> (vì thế các hệ thật thêm lease/hết hạn: các nút tạm của ZooKeeper biến mất khi phiên của client chết).</p>
<p class="pitfall">⚠️ Đừng lẫn luật khớp với bằng nhau: kiểu phải khớp dù giá trị sẽ "bằng" trong một ngôn ngữ lỏng (số 2 không khớp chuỗi "2"). Một phép kiểm thi điển hình: "mẫu nào khớp <code>("matrix-1", 1, 6, 3.14)</code>?" — đếm trường trước (4), rồi kiểu (string, int, int, float), rồi các hằng.</p>`],
      [49, 'Publish/Subscribe',
        `<p class="y-chinh">🎯 Figure 8-38 — the <strong>publish/subscribe</strong> architecture: <strong>producers</strong> publish information items (tagged with a <em>subject</em>), <strong>consumers</strong> subscribe to the subjects they care about, and a network of <strong>information routers</strong> (with a <strong>daemon</strong> on each LAN) forwards each published item only to the nodes that have subscribers — across LANs and a WAN, with no direct link between producer and consumer.</p>
<p>Pub/sub is Linda's decoupling with <em>push</em> instead of <em>pull</em>: the consumers do not poll a space; the system delivers to whoever subscribed. A producer publishes <code>("stock.IBM", 125.30)</code>; every consumer subscribed to <code>stock.IBM</code> (or <code>stock.*</code>) gets it. Three kinds of decoupling make it powerful — <em>space</em> (they do not know each other), <em>time</em> (with a broker that stores messages, the consumer may be offline), <em>synchronisation</em> (publishing is non-blocking). The cost is the reverse: no idea who received it, no automatic reply, and failure modes that are hard to see (a subscriber can be down for an hour; a message can be delivered twice).</p>
<p>A tiny broker in Node.js, with the topic matching used by real systems (<code>*</code> = one word, <code>#</code> = the rest), shows all of it. Watch the very first line: a message published before anyone subscribed is <em>dropped</em>:</p>
<pre><code class="language-javascript">// Figure 8-38 in 30 lines: producers and consumers that never know each other, only TOPICS
class Broker {                                            // the "information router"
  subs = [];
  subscribe(pattern, name, fn) { this.subs.push({ pattern, name, fn }); console.log(&#96;subscribe: &#36;{name} wants "&#36;{pattern}"&#96;); }
  publish(topic, msg) {
    const hit = this.subs.filter((s) =&gt; matches(s.pattern, topic));
    console.log(&#96;publish  "&#36;{topic}" &#36;{JSON.stringify(msg)} -&gt; &#36;{hit.length ? hit.map((s) =&gt; s.name).join(', ') : '(nobody listening, the message is dropped)'}&#96;);
    hit.forEach((s) =&gt; s.fn(topic, msg));
  }
}
const matches = (pattern, topic) =&gt; new RegExp('^' + pattern.split('.').map((p) =&gt; (p === '*' ? '[^.]+' : p === '#' ? '.+' : p)).join('\\\\.') + '$').test(topic);   // "*" = one word, "#" = the rest
const bus = new Broker();
bus.publish('order.created', { id: 1 });                  // nobody has subscribed yet
bus.subscribe('order.created', 'email-service', (t, m) =&gt; console.log(&#96;   email-service: send mail for order &#36;{m.id}&#96;));
bus.subscribe('order.*', 'audit-log', (t, m) =&gt; console.log(&#96;   audit-log: &#36;{t} #&#36;{m.id}&#96;));
bus.subscribe('#', 'metrics', () =&gt; {});
bus.publish('order.created', { id: 2 });                  // three consumers, one publish, the producer knows none
bus.publish('order.paid', { id: 2 });
bus.publish('stock.low', { sku: 'A1' });</code></pre>
<div class="out">$ node pub-sub.js<br>
publish &nbsp;"order.created" {"id":1} -&gt; (nobody listening, the message is dropped)<br>
subscribe: email-service wants "order.created"<br>
subscribe: audit-log wants "order.*"<br>
subscribe: metrics wants "#"<br>
publish &nbsp;"order.created" {"id":2} -&gt; email-service, audit-log, metrics<br>
&nbsp;&nbsp;&nbsp;email-service: send mail for order 2<br>
&nbsp;&nbsp;&nbsp;audit-log: order.created #2<br>
publish &nbsp;"order.paid" {"id":2} -&gt; audit-log, metrics<br>
&nbsp;&nbsp;&nbsp;audit-log: order.paid #2<br>
publish &nbsp;"stock.low" {"sku":"A1"} -&gt; metrics</div>
<p>Then three subscribers (an email service, an audit log, a metrics collector) receive the next <code>order.created</code> — the publisher called <code>publish</code> <em>once</em> and has no list of them. <code>order.paid</code> reaches only the two subscribers whose patterns match; <code>stock.low</code> only the catch-all <code>#</code>. Adding a fourth consumer (say, a fraud checker) needs no change to the order service — the property that lets teams evolve services independently. This is also the right picture for the web shop of slide 33.</p>
<p>Real brokers: <strong>RabbitMQ</strong> (topics with exactly these <code>*</code> and <code>#</code> patterns), <strong>Apache Kafka</strong> (a durable, replayable <em>log</em> per topic; consumers pull and remember their position), <strong>Redis Pub/Sub</strong> (fire-and-forget: a subscriber that is offline misses the message, like our first publish), <strong>NATS</strong>, Google Pub/Sub, AWS SNS/SQS, and <strong>MQTT</strong> for IoT devices. Pick by the guarantee you need: <em>at most once</em> (may lose), <em>at least once</em> (may duplicate — so make consumers idempotent, slide 25), <em>exactly once</em> (expensive, usually "effectively once" through idempotency).</p>
<div class="callout">🧭 On a real server: an order service that publishes <code>order.created</code> to a broker and returns at once is faster and more resilient than one that calls email, stock and analytics services in sequence — if the email service is down the order still succeeds, and the message waits in the broker. The price you must accept: <em>eventual</em> consistency (the stock is updated a little later) and the need for idempotent consumers and a dead-letter queue for poison messages.</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/91f726d302fe97ae3c15eef6eecbad4886707090.svg" alt="The same picture from slide 33: the order service publishes, the email service subscribes" loading="lazy" /><p class="chu-thich">🧩 The same picture from slide 33: the order service publishes, the email service subscribes</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Microservices = a multicomputer: separate machines, no shared memory, RPC / messages between them
title A web shop as a multicomputer (Figure 8-1b on a real backend)
node "Load balancer\\n(nginx)" as LB
node "API gateway" as GW
node "orders service\\n(Spring Boot)" as ORD
node "payment service\\n(Node.js)" as PAY
node "stock service\\n(Spring Boot)" as STK
database "orders DB\\n(PostgreSQL)" as DB1
database "stock DB\\n(PostgreSQL)" as DB2
queue "message broker\\n(RabbitMQ / Kafka)" as MQ
node "email service" as MAIL
LB --&gt; GW : HTTPS
GW --&gt; ORD : REST (RPC in disguise)
ORD --&gt; PAY : gRPC (a REAL RPC with stubs)
ORD --&gt; STK : gRPC
ORD --&gt; DB1
STK --&gt; DB2
ORD ..&gt; MQ : publish "order.created"
MQ ..&gt; MAIL : subscribe "order.*"
note bottom of MQ : publish/subscribe (Figure 8-38):\\nthe order service does not know\\nwho listens, or whether they are up
note right of DB1 : each service owns its data:\\nno shared memory ⇒ no cache coherence,\\nbut also no transaction across services
@enduml</code></pre></details>
<p class="pitfall">⚠️ Publish/subscribe is not "reliable messaging" by itself. Whether a message survives a broker restart, is redelivered, or arrives in order depends on the product and its configuration — read the delivery guarantees before relying on them.</p>`,
        `<p class="y-chinh">🎯 Hình 8-38 — kiến trúc <strong>publish/subscribe</strong>: các <strong>nhà sản xuất (producer)</strong> xuất bản các mục thông tin (gắn một <em>chủ đề</em>), các <strong>người tiêu thụ (consumer)</strong> đăng ký các chủ đề họ quan tâm, và một mạng các <strong>bộ định tuyến thông tin</strong> (với một <strong>daemon</strong> trên mỗi LAN) chuyển mỗi mục đã xuất bản chỉ tới các nút có người đăng ký — xuyên các LAN và một WAN, không có liên kết trực tiếp giữa producer và consumer.</p>
<p>Pub/sub là sự tách rời của Linda với <em>đẩy (push)</em> thay vì <em>kéo (pull)</em>: người tiêu thụ không hỏi vòng một không gian; hệ thống giao cho ai đã đăng ký. Một producer xuất bản <code>("stock.IBM", 125.30)</code>; mọi consumer đã đăng ký <code>stock.IBM</code> (hay <code>stock.*</code>) nhận được. Ba kiểu tách rời làm nó mạnh — <em>không gian</em> (chúng không biết nhau), <em>thời gian</em> (với một broker lưu thông điệp, consumer có thể đang offline), <em>đồng bộ</em> (xuất bản không chặn). Cái giá là ngược lại: không biết ai đã nhận, không có trả lời tự động, và các chế độ lỗi khó thấy (một subscriber có thể sập một giờ; một thông điệp có thể bị giao hai lần).</p>
<p>Một broker nhỏ bằng Node.js, với cách khớp chủ đề mà các hệ thật dùng (<code>*</code> = một từ, <code>#</code> = phần còn lại), cho thấy tất cả. Nhìn dòng đầu tiên: một thông điệp xuất bản trước khi có ai đăng ký thì bị <em>bỏ</em>:</p>
<pre><code class="language-javascript">// Hình 8-38 trong 30 dòng: nhà sản xuất và người tiêu dùng không biết nhau, chỉ biết CHỦ ĐỀ
class Broker {                                            // "bộ định tuyến thông tin"
  subs = [];
  subscribe(pattern, name, fn) { this.subs.push({ pattern, name, fn }); console.log(&#96;subscribe: &#36;{name} wants "&#36;{pattern}"&#96;); }
  publish(topic, msg) {
    const hit = this.subs.filter((s) =&gt; matches(s.pattern, topic));
    console.log(&#96;publish  "&#36;{topic}" &#36;{JSON.stringify(msg)} -&gt; &#36;{hit.length ? hit.map((s) =&gt; s.name).join(', ') : '(nobody listening, the message is dropped)'}&#96;);
    hit.forEach((s) =&gt; s.fn(topic, msg));
  }
}
const matches = (pattern, topic) =&gt; new RegExp('^' + pattern.split('.').map((p) =&gt; (p === '*' ? '[^.]+' : p === '#' ? '.+' : p)).join('\\\\.') + '$').test(topic);   // "*" = một từ, "#" = phần còn lại
const bus = new Broker();
bus.publish('order.created', { id: 1 });                  // chưa ai đăng ký
bus.subscribe('order.created', 'email-service', (t, m) =&gt; console.log(&#96;   email-service: send mail for order &#36;{m.id}&#96;));
bus.subscribe('order.*', 'audit-log', (t, m) =&gt; console.log(&#96;   audit-log: &#36;{t} #&#36;{m.id}&#96;));
bus.subscribe('#', 'metrics', () =&gt; {});
bus.publish('order.created', { id: 2 });                  // ba consumer, một lần publish, producer không biết ai
bus.publish('order.paid', { id: 2 });
bus.publish('stock.low', { sku: 'A1' });</code></pre>
<div class="out">$ node pub-sub.js<br>
publish &nbsp;"order.created" {"id":1} -&gt; (nobody listening, the message is dropped)<br>
subscribe: email-service wants "order.created"<br>
subscribe: audit-log wants "order.*"<br>
subscribe: metrics wants "#"<br>
publish &nbsp;"order.created" {"id":2} -&gt; email-service, audit-log, metrics<br>
&nbsp;&nbsp;&nbsp;email-service: send mail for order 2<br>
&nbsp;&nbsp;&nbsp;audit-log: order.created #2<br>
publish &nbsp;"order.paid" {"id":2} -&gt; audit-log, metrics<br>
&nbsp;&nbsp;&nbsp;audit-log: order.paid #2<br>
publish &nbsp;"stock.low" {"sku":"A1"} -&gt; metrics</div>
<p>Rồi ba subscriber (một service email, một nhật ký kiểm toán, một bộ thu metrics) nhận <code>order.created</code> kế tiếp — nhà xuất bản gọi <code>publish</code> <em>một lần</em> và không có danh sách của chúng. <code>order.paid</code> chỉ tới hai subscriber có mẫu khớp; <code>stock.low</code> chỉ tới mẫu bắt-tất-cả <code>#</code>. Thêm consumer thứ tư (chẳng hạn bộ kiểm tra gian lận) không cần đổi gì ở service đơn hàng — tính chất cho phép các nhóm phát triển service độc lập. Đây cũng là bức tranh đúng cho cửa hàng web ở slide 33.</p>
<p>Broker thật: <strong>RabbitMQ</strong> (topic với đúng các mẫu <code>*</code> và <code>#</code> này), <strong>Apache Kafka</strong> (một <em>nhật ký</em> bền, phát lại được cho mỗi topic; consumer kéo và nhớ vị trí của mình), <strong>Redis Pub/Sub</strong> (bắn rồi quên: subscriber đang offline bỏ lỡ thông điệp, như lần publish đầu của ta), <strong>NATS</strong>, Google Pub/Sub, AWS SNS/SQS, và <strong>MQTT</strong> cho thiết bị IoT. Chọn theo bảo đảm bạn cần: <em>at most once</em> (có thể mất), <em>at least once</em> (có thể lặp — nên làm consumer luỹ đẳng, slide 25), <em>exactly once</em> (đắt, thường là "hiệu quả một lần" nhờ luỹ đẳng).</p>
<div class="callout">🧭 Trên server thật: một service đơn hàng xuất bản <code>order.created</code> lên broker rồi trả về ngay thì nhanh và bền hơn một service gọi tuần tự các service email, kho và phân tích — nếu service email sập đơn vẫn thành công, và thông điệp chờ trong broker. Cái giá phải chấp nhận: nhất quán <em>sau cùng</em> (kho được cập nhật hơi muộn) và nhu cầu consumer luỹ đẳng cùng một hàng đợi thư chết (dead-letter queue) cho thông điệp độc hại.</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/91f726d302fe97ae3c15eef6eecbad4886707090.svg" alt="Cùng bức tranh ở slide 33: service đơn hàng xuất bản, service email đăng ký" loading="lazy" /><p class="chu-thich">🧩 Cùng bức tranh ở slide 33: service đơn hàng xuất bản, service email đăng ký</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Microservices = một multicomputer: các máy riêng, không chia sẻ bộ nhớ, giữa chúng là RPC / thông điệp
title A web shop as a multicomputer (Figure 8-1b on a real backend)
node "Load balancer\\n(nginx)" as LB
node "API gateway" as GW
node "orders service\\n(Spring Boot)" as ORD
node "payment service\\n(Node.js)" as PAY
node "stock service\\n(Spring Boot)" as STK
database "orders DB\\n(PostgreSQL)" as DB1
database "stock DB\\n(PostgreSQL)" as DB2
queue "message broker\\n(RabbitMQ / Kafka)" as MQ
node "email service" as MAIL
LB --&gt; GW : HTTPS
GW --&gt; ORD : REST (RPC in disguise)
ORD --&gt; PAY : gRPC (a REAL RPC with stubs)
ORD --&gt; STK : gRPC
ORD --&gt; DB1
STK --&gt; DB2
ORD ..&gt; MQ : publish "order.created"
MQ ..&gt; MAIL : subscribe "order.*"
note bottom of MQ : publish/subscribe (Figure 8-38):\\nthe order service does not know\\nwho listens, or whether they are up
note right of DB1 : each service owns its data:\\nno shared memory ⇒ no cache coherence,\\nbut also no transaction across services
@enduml</code></pre></details>
<p class="pitfall">⚠️ Publish/subscribe tự nó không phải "nhắn tin tin cậy". Thông điệp có sống sót qua lần khởi động lại broker, được giao lại, hay tới đúng thứ tự hay không là tuỳ sản phẩm và cấu hình — hãy đọc các bảo đảm giao nhận trước khi dựa vào chúng.</p>`],
      [50, 'End',
        `<p class="y-chinh">🎯 End of Chapter 8. The whole chapter is one long answer to <em>"what do the CPUs share?"</em> — and each answer sets the price of a system.</p>
<table>
<thead><tr><th>What is shared</th><th>System</th><th>How CPUs cooperate</th><th>What it costs</th><th>Where you meet it</th></tr></thead>
<tbody>
<tr><td>everything (memory)</td><td>multiprocessor: UMA / NUMA, SMP</td><td>LOAD/STORE + locks</td><td>cache coherence, lock contention, Amdahl</td><td>your laptop, a 64-core database server</td></tr>
<tr><td>nothing, fast private network</td><td>multicomputer</td><td>messages: send/receive, RPC, DSM</td><td>copies, latency (µs), partial failure</td><td>clusters, HPC, a Kubernetes cluster in one data centre</td></tr>
<tr><td>nothing, Internet</td><td>distributed system + middleware</td><td>documents, files, objects, tuples, publish/subscribe</td><td>latency (ms), unreliable, many owners</td><td>the Web, microservices, cloud</td></tr>
</tbody>
</table>
<p><strong>Five ideas to take away.</strong> (1) <em>Amdahl:</em> the serial part — locks, one hot row, one coordinator — limits speed-up, not the number of cores. (2) <em>Coherence has a unit:</em> the cache line (64/128 B) or the page (4 KB); false sharing is paying for sharing you do not need. (3) <em>Scheduling many CPUs</em> is a choice between flexibility (time sharing), isolation (space sharing) and togetherness (gang). (4) <em>RPC hides syntax, not latency or failure</em> — design for retries, idempotency and timeouts. (5) <em>Middleware = the OS of the distributed system</em>; pick the model (document, file, object, tuple/pub-sub) by what must be decoupled.</p>
<p class="meo">🧠 Interview-ready answers in one breath. <strong>UMA vs NUMA?</strong> UMA: every CPU reaches all memory in the same time (bus/crossbar); NUMA: one address space but local memory is faster than remote — place threads and data together. <strong>Spin lock vs mutex?</strong> Spin if the wait is shorter than a context switch and you have spare cores; otherwise block. <strong>What is false sharing?</strong> Unrelated variables in one cache line make cores fight over it. <strong>Why does a REST call differ from a method call?</strong> ~10⁵× the latency, can fail halfway, parameters are copies. <strong>Why microservices need idempotency?</strong> A timeout does not say whether the request ran, so retries must be safe.</p>
<p>Next: lesson 8.C (practice, glossary, summary) and the chapter quiz — computed exercises (Amdahl, gang table, omega, graph cut), Linux practice (<code>taskset</code>, false sharing, cluster) and ten quiz questions with explanations.</p>`,
        `<p class="y-chinh">🎯 Hết Chương 8. Cả chương là một câu trả lời dài cho <em>"các CPU dùng chung cái gì?"</em> — và mỗi câu trả lời đặt giá cho một hệ thống.</p>
<table>
<thead><tr><th>Dùng chung gì</th><th>Hệ thống</th><th>Các CPU hợp tác thế nào</th><th>Cái giá</th><th>Gặp ở đâu</th></tr></thead>
<tbody>
<tr><td>mọi thứ (bộ nhớ)</td><td>multiprocessor: UMA / NUMA, SMP</td><td>LOAD/STORE + khoá</td><td>đồng bộ cache, tranh khoá, Amdahl</td><td>laptop của bạn, server CSDL 64 nhân</td></tr>
<tr><td>không gì, mạng riêng nhanh</td><td>multicomputer</td><td>thông điệp: send/receive, RPC, DSM</td><td>sao chép, độ trễ (µs), thất bại một phần</td><td>cluster, HPC, cluster Kubernetes trong một trung tâm dữ liệu</td></tr>
<tr><td>không gì, Internet</td><td>hệ phân tán + middleware</td><td>tài liệu, tệp, đối tượng, tuple, publish/subscribe</td><td>độ trễ (ms), không tin cậy, nhiều chủ</td><td>Web, microservices, đám mây</td></tr>
</tbody>
</table>
<p><strong>Năm ý mang về.</strong> (1) <em>Amdahl:</em> phần tuần tự — khoá, một dòng nóng, một bộ điều phối — giới hạn tăng tốc, không phải số nhân. (2) <em>Đồng bộ có một đơn vị:</em> dòng cache (64/128 B) hay trang (4 KB); false sharing là trả tiền cho việc chia sẻ bạn không cần. (3) <em>Lập lịch nhiều CPU</em> là lựa chọn giữa linh hoạt (chia giờ), cô lập (chia không gian) và ở cùng nhau (gang). (4) <em>RPC giấu cú pháp, không giấu độ trễ hay lỗi</em> — hãy thiết kế cho thử lại, luỹ đẳng và timeout. (5) <em>Middleware = HĐH của hệ phân tán</em>; chọn mô hình (tài liệu, tệp, đối tượng, tuple/pub-sub) theo thứ cần được tách rời.</p>
<p class="meo">🧠 Câu trả lời phỏng vấn trong một hơi. <strong>UMA so với NUMA?</strong> UMA: mọi CPU với tới mọi bộ nhớ trong cùng thời gian (bus/crossbar); NUMA: một không gian địa chỉ nhưng bộ nhớ cục bộ nhanh hơn ở xa — hãy đặt luồng và dữ liệu cùng nhau. <strong>Khoá quay so với mutex?</strong> Quay nếu thời gian chờ ngắn hơn một lần chuyển ngữ cảnh và còn nhân dư; ngược lại thì chặn. <strong>False sharing là gì?</strong> Các biến không liên quan nằm chung một dòng cache làm các nhân tranh nhau nó. <strong>Vì sao một lời gọi REST khác lời gọi phương thức?</strong> Độ trễ gấp ~10⁵ lần, có thể hỏng giữa chừng, tham số là bản sao. <strong>Vì sao microservices cần luỹ đẳng?</strong> Hết thời gian chờ không cho biết yêu cầu đã chạy chưa, nên thử lại phải an toàn.</p>
<p>Tiếp theo: bài 8.C (thực hành, thuật ngữ, tóm tắt) và quiz chương — bài tập tính (Amdahl, bảng gang, omega, lát cắt đồ thị), thực hành Linux (<code>taskset</code>, false sharing, cluster) và mười câu quiz có giải thích.</p>`],
    ]),
    books([
      ['mos4', 'Chapter 8, sections 8.2–8.3 (multicomputers, distributed systems, middleware), Figures 8-16 to 8-38', 'Chương 8, mục 8.2–8.3 (đa máy tính, hệ phân tán, middleware), Hình 8-16 tới 8-38'],
      ['ostep', "Chapter 48 \"Distributed Systems Intro\" and Chapter 49 \"Sun's Network File System (NFS)\" (remote access, caching, close-to-open)", "Chương 48 \"Distributed Systems Intro\" và Chương 49 \"Sun's Network File System (NFS)\" (truy cập từ xa, cache, close-to-open)"],
      ['man7', 'pipe(7) for the 65,536-byte buffer, nfs(5) for close-to-open consistency, userfaultfd(2), sched_setaffinity(2), socket(7), tcp(7), udp(7)', 'pipe(7) cho bộ đệm 65.536 byte, nfs(5) cho nhất quán close-to-open, userfaultfd(2), sched_setaffinity(2), socket(7), tcp(7), udp(7)'],
      ['posix', 'POSIX sockets (send, recv, O_NONBLOCK)', 'POSIX socket (send, recv, O_NONBLOCK)'],
    ]),
  ].join('\n'),
};

/* ───────── 8.C — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 8: Amdahl, gang, omega, topologies, false sharing, retries ───────── */
const L_on_ch8 = {
  title: '8.C — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 8: Amdahl, gang, omega, topologies, false sharing, retries|||8.C — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Chương 8: Amdahl, gang, omega, mạng liên kết, false sharing, thử lại',
  slug: 'osg202-on-ch8',
  type: 'VIDEO',
  description: '7 bài tập Chương 8 có lời giải chạy thật: định luật Amdahl trên số liệu mới (kể cả một yêu cầu backend có 20 ms tuần tự), đóng bảng gang scheduling và so luật của sách với first-fit decreasing, định tuyến trong mạng omega 16×16 và đếm công tắc, đo đường kính của vòng, lưới, torus và siêu khối 64 nút, tìm khoảng cách tối thiểu để hai biến đếm không tranh một dòng cache, thử lại một RPC bị mất câu trả lời có và không có khoá luỹ đẳng, và đo hạn ngạch CPU của cgroup (thứ docker --cpus đặt); kèm bảng thuật ngữ Anh–Việt và tóm tắt chương.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.C · Practice &amp; review</span>
<h2>Seven exercises: many CPUs, computed and run</h2>
<p class="lead">Chapter 8 has no calculation questions in the real FE bank — but the ideas it teaches are exactly what a backend engineer computes when sizing a server (how many cores are worth buying?), choosing a lock, deciding how to retry a call. Exercises 1–4 are calculations on new data, each answer produced by a program or the simulator; exercises 5–7 are Linux practice on the real kernel of the course container. Try each first (the time is a target), then open the solution. A reminder from 8.A: timing results come from <em>one run on a shared virtual machine</em> — believe the pattern, not the digits.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>1</td><td>Amdahl's law: speed-up, the needed parallel fraction, the serial part of a request</td><td>8.A slide 2</td></tr>
<tr><td>2</td><td>packing a gang-scheduling table: the book's rule versus the best packing</td><td>8.A slides 17–19</td></tr>
<tr><td>3</td><td>routing in a 16 × 16 omega network and counting its switches</td><td>8.A slides 4–6</td></tr>
<tr><td>4</td><td>diameter and links of ring, grid, torus and hypercube with 64 nodes</td><td>8.B slide 20</td></tr>
<tr><td>5</td><td>the smallest distance that ends false sharing on this machine</td><td>8.A slide 14, 8.B slide 30</td></tr>
<tr><td>6</td><td>a lost RPC reply: retry without and with an idempotency key</td><td>8.B slide 25</td></tr>
<tr><td>7</td><td>a CPU quota (docker --cpus) measured in a cgroup</td><td>8.A slide 16</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 8 · Bài 8.C · Thực hành &amp; ôn tập</span>
<h2>Bảy bài tập: nhiều CPU, tính ra và chạy thật</h2>
<p class="lead">Chương 8 không có câu tính toán nào trong ngân hàng FE thật — nhưng các ý tưởng nó dạy đúng là thứ kỹ sư backend tính khi định cỡ một server (mua bao nhiêu nhân thì đáng?), chọn một khoá, quyết định thử lại một lời gọi ra sao. Bài 1–4 là các phép tính trên dữ liệu mới, đáp án nào cũng do một chương trình hay bộ mô phỏng tạo ra; bài 5–7 là thực hành Linux trên nhân thật của container môn học. Tự làm từng bài trước (thời gian ghi kèm là mục tiêu), rồi mới mở lời giải. Nhắc lại từ 8.A: kết quả thời gian là từ <em>một lần chạy trên máy ảo dùng chung</em> — hãy tin vào hình mẫu, đừng tin vào từng chữ số.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>1</td><td>định luật Amdahl: tăng tốc, phần song song cần có, phần tuần tự của một yêu cầu</td><td>8.A slide 2</td></tr>
<tr><td>2</td><td>đóng bảng gang scheduling: luật của sách so với cách xếp tốt nhất</td><td>8.A slide 17–19</td></tr>
<tr><td>3</td><td>định tuyến trong mạng omega 16 × 16 và đếm công tắc</td><td>8.A slide 4–6</td></tr>
<tr><td>4</td><td>đường kính và số liên kết của vòng, lưới, torus và siêu khối 64 nút</td><td>8.B slide 20</td></tr>
<tr><td>5</td><td>khoảng cách nhỏ nhất để hết false sharing trên máy này</td><td>8.A slide 14, 8.B slide 30</td></tr>
<tr><td>6</td><td>một câu trả lời RPC bị mất: thử lại không có và có khoá luỹ đẳng</td><td>8.B slide 25</td></tr>
<tr><td>7</td><td>hạn ngạch CPU (docker --cpus) đo trong một cgroup</td><td>8.A slide 16</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — Amdahl's law on new numbers (20 min)</h3>
<p>(a) A job is 80% parallel. What speed-up on 4 cores, on 16 cores, and in the limit? (b) What fraction must be parallel to reach a 6× speed-up on 8 cores? What do 8 cores give at 90%? (c) A web request takes 100 ms: 20 ms of it is serial (it holds one database lock), 80 ms can be split across workers. Latency and speed-up with 1, 2, 4, 8, 64 workers — and what is the best possible? (d) If every request holds that lock for 20 ms, what is the maximum number of requests per second, whatever the number of CPUs?</p>
<details><summary>Solution — computed by a program</summary>
<pre><code class="language-javascript">// Amdahl's law, computed: speed-up = 1 / ((1 - p) + p / n)
const s = (p, n) =&gt; 1 / ((1 - p) + p / n);
const f = (x) =&gt; +x.toFixed(2);
// (a) p = 0.8 on 4, 16 and infinitely many cores
console.log(&#96;(a) p = 80%: 4 cores &#36;{f(s(0.8, 4))}x, 16 cores &#36;{f(s(0.8, 16))}x, limit &#36;{f(1 / (1 - 0.8))}x&#96;);
// (b) which p gives a 6x speed-up on 8 cores?  1/6 = (1-p) + p/8  =&gt;  p = (1 - 1/6) / (1 - 1/8)
const p6 = (1 - 1 / 6) / (1 - 1 / 8);
console.log(&#96;(b) 6x on 8 cores needs p = &#36;{f(p6 * 100)}% parallel (check: &#36;{f(s(p6, 8))}x); at p = 90% 8 cores give only &#36;{f(s(0.9, 8))}x&#96;);
// (c) a request: 20 ms is serial (one database lock), 80 ms can be split across workers
for (const n of [1, 2, 4, 8, 64]) { const t = 20 + 80 / n; console.log(&#96;(c) &#36;{String(n).padStart(2)} workers: latency &#36;{f(t)} ms  speed-up &#36;{f(100 / t)}x&#96;); }
console.log(&#96;(c) the best possible latency is 20 ms: speed-up never exceeds &#36;{f(100 / 20)}x, however many workers&#96;);
// (d) throughput view: the serial part is the ONLY thing that limits requests/second when requests overlap
console.log(&#96;(d) with 20 ms of exclusive lock time per request: at most &#36;{1000 / 20} requests/s through that lock, whatever the CPUs&#96;);</code></pre>
<div class="out">$ node amdahl.js<br>
(a) p = 80%: 4 cores 2.5x, 16 cores 4x, limit 5x<br>
(b) 6x on 8 cores needs p = 95.24% parallel (check: 6x); at p = 90% 8 cores give only 4.71x<br>
(c) &nbsp;1 workers: latency 100 ms &nbsp;speed-up 1x<br>
(c) &nbsp;2 workers: latency 60 ms &nbsp;speed-up 1.67x<br>
(c) &nbsp;4 workers: latency 40 ms &nbsp;speed-up 2.5x<br>
(c) &nbsp;8 workers: latency 30 ms &nbsp;speed-up 3.33x<br>
(c) 64 workers: latency 21.25 ms &nbsp;speed-up 4.71x<br>
(c) the best possible latency is 20 ms: speed-up never exceeds 5x, however many workers<br>
(d) with 20 ms of exclusive lock time per request: at most 50 requests/s through that lock, whatever the CPUs</div>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e393e45ed75e4b51cd3b26280bdb29a8d92f78f4.svg" alt="The curves behind (a): p = 50%, 90%, 95%, 99%" loading="lazy" /><p class="chu-thich">🧮 The curves behind (a): p = 50%, 90%, 95%, 99%</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const tangToc = (p, n) =&gt; 1 / ((1 - p) + p / n);
const NHAN = [1, 2, 4, 8, 16, 32, 64];
const P = [[0.5, '#94A3B8'], [0.9, '#4338CA'], [0.95, '#15803D'], [0.99, '#B91C1C']];</code></pre></details>
<ul>
<li>(a) <code>1 / ((1 − 0.8) + 0.8 / n)</code>: <strong>2.5×</strong> on 4 cores, <strong>4×</strong> on 16 cores, and the limit is 1 / 0.2 = <strong>5×</strong> — the 20% serial part caps the machine no matter how large it is.</li>
<li>(b) Solve 1/6 = (1 − p) + p/8 ⇒ p = (1 − 1/6) / (1 − 1/8) = <strong>95.24%</strong>. At p = 90% eight cores give only <strong>4.71×</strong>.</li>
<li>(c) latency = 20 + 80/n: 100, 60, 40, 30 and 21.25 ms; speed-up 1, 1.67, 2.5, 3.33, 4.71. Best possible latency 20 ms ⇒ speed-up never exceeds <strong>5×</strong> — going from 8 to 64 workers (8× the hardware) improves latency by 30 → 21 ms.</li>
<li>(d) A lock held 20 ms lets 1000 / 20 = <strong>50 requests/s</strong> through, however many CPUs wait behind it. This is the serial part seen as <em>throughput</em>, and the reason to shorten critical sections or shard the lock (8.A slide 14) before buying cores.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 1 — định luật Amdahl trên số liệu mới (20 phút)</h3>
<p>(a) Một việc song song 80%. Tăng tốc trên 4 nhân, trên 16 nhân, và ở giới hạn là bao nhiêu? (b) Phần song song phải là bao nhiêu để đạt tăng tốc 6 lần trên 8 nhân? 8 nhân cho bao nhiêu ở mức 90%? (c) Một yêu cầu web mất 100 ms: 20 ms là tuần tự (nó giữ một khoá cơ sở dữ liệu), 80 ms chia được cho các worker. Độ trễ và tăng tốc với 1, 2, 4, 8, 64 worker — và tốt nhất có thể là bao nhiêu? (d) Nếu mỗi yêu cầu giữ khoá đó 20 ms thì tối đa bao nhiêu yêu cầu mỗi giây, bất kể số CPU?</p>
<details><summary>Lời giải — chương trình tính</summary>
<pre><code class="language-javascript">// Định luật Amdahl, tính ra: tăng tốc = 1 / ((1 - p) + p / n)
const s = (p, n) =&gt; 1 / ((1 - p) + p / n);
const f = (x) =&gt; +x.toFixed(2);
// (a) p = 0.8 trên 4, 16 và vô hạn nhân
console.log(&#96;(a) p = 80%: 4 cores &#36;{f(s(0.8, 4))}x, 16 cores &#36;{f(s(0.8, 16))}x, limit &#36;{f(1 / (1 - 0.8))}x&#96;);
// (b) p nào cho tăng tốc 6 lần trên 8 nhân?
const p6 = (1 - 1 / 6) / (1 - 1 / 8);
console.log(&#96;(b) 6x on 8 cores needs p = &#36;{f(p6 * 100)}% parallel (check: &#36;{f(s(p6, 8))}x); at p = 90% 8 cores give only &#36;{f(s(0.9, 8))}x&#96;);
// (c) một yêu cầu: 20 ms tuần tự (một khoá CSDL), 80 ms chia được cho các worker
for (const n of [1, 2, 4, 8, 64]) { const t = 20 + 80 / n; console.log(&#96;(c) &#36;{String(n).padStart(2)} workers: latency &#36;{f(t)} ms  speed-up &#36;{f(100 / t)}x&#96;); }
console.log(&#96;(c) the best possible latency is 20 ms: speed-up never exceeds &#36;{f(100 / 20)}x, however many workers&#96;);
// (d) góc nhìn thông lượng: khi các yêu cầu chồng nhau, phần tuần tự là thứ DUY NHẤT giới hạn số yêu cầu/giây
console.log(&#96;(d) with 20 ms of exclusive lock time per request: at most &#36;{1000 / 20} requests/s through that lock, whatever the CPUs&#96;);</code></pre>
<div class="out">$ node amdahl.js<br>
(a) p = 80%: 4 cores 2.5x, 16 cores 4x, limit 5x<br>
(b) 6x on 8 cores needs p = 95.24% parallel (check: 6x); at p = 90% 8 cores give only 4.71x<br>
(c) &nbsp;1 workers: latency 100 ms &nbsp;speed-up 1x<br>
(c) &nbsp;2 workers: latency 60 ms &nbsp;speed-up 1.67x<br>
(c) &nbsp;4 workers: latency 40 ms &nbsp;speed-up 2.5x<br>
(c) &nbsp;8 workers: latency 30 ms &nbsp;speed-up 3.33x<br>
(c) 64 workers: latency 21.25 ms &nbsp;speed-up 4.71x<br>
(c) the best possible latency is 20 ms: speed-up never exceeds 5x, however many workers<br>
(d) with 20 ms of exclusive lock time per request: at most 50 requests/s through that lock, whatever the CPUs</div>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d285c2261db90c8c078ccc995f186d7ff797878a.svg" alt="Các đường cong phía sau (a): p = 50%, 90%, 95%, 99%" loading="lazy" /><p class="chu-thich">🧮 Các đường cong phía sau (a): p = 50%, 90%, 95%, 99%</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const tangToc = (p, n) =&gt; 1 / ((1 - p) + p / n);
const NHAN = [1, 2, 4, 8, 16, 32, 64];
const P = [[0.5, '#94A3B8'], [0.9, '#4338CA'], [0.95, '#15803D'], [0.99, '#B91C1C']];</code></pre></details>
<ul>
<li>(a) <code>1 / ((1 − 0,8) + 0,8 / n)</code>: <strong>2,5×</strong> trên 4 nhân, <strong>4×</strong> trên 16 nhân, và giới hạn là 1 / 0,2 = <strong>5×</strong> — 20% phần tuần tự chặn trần cái máy dù nó lớn tới đâu.</li>
<li>(b) Giải 1/6 = (1 − p) + p/8 ⇒ p = (1 − 1/6) / (1 − 1/8) = <strong>95,24%</strong>. Ở p = 90% tám nhân chỉ cho <strong>4,71×</strong>.</li>
<li>(c) độ trễ = 20 + 80/n: 100, 60, 40, 30 và 21,25 ms; tăng tốc 1; 1,67; 2,5; 3,33; 4,71. Độ trễ tốt nhất 20 ms ⇒ tăng tốc không bao giờ vượt <strong>5×</strong> — đi từ 8 lên 64 worker (phần cứng gấp 8) chỉ cải thiện độ trễ từ 30 xuống 21 ms.</li>
<li>(d) Một khoá giữ 20 ms cho qua 1000 / 20 = <strong>50 yêu cầu/giây</strong>, dù có bao nhiêu CPU xếp hàng phía sau. Đây là phần tuần tự nhìn dưới dạng <em>thông lượng</em>, và là lý do rút ngắn vùng găng hay chẻ khoá (8.A slide 14) trước khi mua thêm nhân.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 2 — pack a gang-scheduling table (20 min)</h3>
<p>A machine has 6 CPUs. Six jobs need 4, 3, 2, 3, 2 and 2 threads (A–F), and each must run with all its threads at once. (a) Using the book's rule — a gang goes into the <em>current</em> slot if it fits, otherwise a new slot opens — how many slots does the table need, in the order A, B, C, D, E, F? (b) What is the lower bound from the total number of threads? (c) Find a better packing and say how many slots it needs. (d) What is the CPU utilisation of each table?</p>
<details><summary>Solution — computed by the simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/bacdb327952ba44235c97e61f2fc4c999c495d7d.svg" alt="The book's rule: 4 slots" loading="lazy" /><p class="chu-thich">🧮 The book's rule: 4 slots</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BAI = { cpus: 6, bang: [{ ten: 'A', n: 4 }, { ten: 'B', n: 3 }, { ten: 'C', n: 2 }, { ten: 'D', n: 3 }, { ten: 'E', n: 2 }, { ten: 'F', n: 2 }] };
const QUIZ = { cpus: 4, bang: [{ ten: 'A', n: 3 }, { ten: 'B', n: 2 }, { ten: 'C', n: 2 }, { ten: 'D', n: 1 }] };</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ed1704019cfa5f0ae4b9e4441721cddda062e80c.svg" alt="First-fit decreasing: 3 slots" loading="lazy" /><p class="chu-thich">🧮 First-fit decreasing: 3 slots</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BAI = { cpus: 6, bang: [{ ten: 'A', n: 4 }, { ten: 'B', n: 3 }, { ten: 'C', n: 2 }, { ten: 'D', n: 3 }, { ten: 'E', n: 2 }, { ten: 'F', n: 2 }] };
const QUIZ = { cpus: 4, bang: [{ ten: 'A', n: 3 }, { ten: 'B', n: 2 }, { ten: 'C', n: 2 }, { ten: 'D', n: 1 }] };</code></pre></details>
<ul>
<li>(a) A (4) fills slot 0 with two CPUs empty; B (3) does not fit there (4 + 3 &gt; 6) and opens slot 1; C (2) joins B (5 of 6); D (3) does not fit (5 + 3 &gt; 6) and opens slot 2; E (2) joins D; F (2) does not fit (5 + 2 &gt; 6) and opens slot 3 ⇒ <strong>4 slots</strong>.</li>
<li>(b) 4 + 3 + 2 + 3 + 2 + 2 = 16 threads on 6 CPUs ⇒ at least ⌈16 / 6⌉ = <strong>3 slots</strong>.</li>
<li>(c) Put the biggest gangs first and each into the <em>first slot with room</em> (first-fit decreasing): A (4) + C (2) = 6; B (3) + D (3) = 6; E (2) + F (2) = 4 ⇒ <strong>3 slots</strong>, equal to the lower bound, so it is optimal here. Packing gangs is the bin-packing problem — NP-hard in general, so real schedulers use heuristics like this one.</li>
<li>(d) 16 / (4 × 6) = <strong>67%</strong> for the book's order; 16 / (3 × 6) = <strong>89%</strong> for first-fit decreasing — the same jobs, a better schedule, 22 points more of the machine used. (The first-fit rule needs to know all gangs in advance; online schedulers cannot always do it.)</li>
</ul>
</details>`,
    `<h3>🧪 Bài 2 — đóng một bảng gang scheduling (20 phút)</h3>
<p>Một máy có 6 CPU. Sáu việc cần 4, 3, 2, 3, 2 và 2 luồng (A–F), và mỗi việc phải chạy với mọi luồng cùng lúc. (a) Dùng luật của sách — băng vào khe <em>hiện tại</em> nếu vừa, không thì mở khe mới — bảng cần bao nhiêu khe, theo thứ tự A, B, C, D, E, F? (b) Cận dưới từ tổng số luồng là bao nhiêu? (c) Tìm một cách xếp tốt hơn và cho biết nó cần bao nhiêu khe. (d) Mức dùng CPU của từng bảng là bao nhiêu?</p>
<details><summary>Lời giải — bộ mô phỏng tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/32d30f033ae079561e2da7a37edeb8d6febeecb2.svg" alt="Luật của sách: 4 khe" loading="lazy" /><p class="chu-thich">🧮 Luật của sách: 4 khe</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BAI = { cpus: 6, bang: [{ ten: 'A', n: 4 }, { ten: 'B', n: 3 }, { ten: 'C', n: 2 }, { ten: 'D', n: 3 }, { ten: 'E', n: 2 }, { ten: 'F', n: 2 }] };
const QUIZ = { cpus: 4, bang: [{ ten: 'A', n: 3 }, { ten: 'B', n: 2 }, { ten: 'C', n: 2 }, { ten: 'D', n: 1 }] };</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/bb2f694929e1b6db8fe96d098f3f1a99550370a0.svg" alt="First-fit decreasing: 3 khe" loading="lazy" /><p class="chu-thich">🧮 First-fit decreasing: 3 khe</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BAI = { cpus: 6, bang: [{ ten: 'A', n: 4 }, { ten: 'B', n: 3 }, { ten: 'C', n: 2 }, { ten: 'D', n: 3 }, { ten: 'E', n: 2 }, { ten: 'F', n: 2 }] };
const QUIZ = { cpus: 4, bang: [{ ten: 'A', n: 3 }, { ten: 'B', n: 2 }, { ten: 'C', n: 2 }, { ten: 'D', n: 1 }] };</code></pre></details>
<ul>
<li>(a) A (4) lấp khe 0 còn hai CPU trống; B (3) không vừa (4 + 3 &gt; 6) và mở khe 1; C (2) vào cùng B (5 trên 6); D (3) không vừa (5 + 3 &gt; 6) và mở khe 2; E (2) vào cùng D; F (2) không vừa (5 + 2 &gt; 6) và mở khe 3 ⇒ <strong>4 khe</strong>.</li>
<li>(b) 4 + 3 + 2 + 3 + 2 + 2 = 16 luồng trên 6 CPU ⇒ ít nhất ⌈16 / 6⌉ = <strong>3 khe</strong>.</li>
<li>(c) Đặt các băng lớn trước và mỗi băng vào <em>khe đầu tiên còn chỗ</em> (first-fit decreasing): A (4) + C (2) = 6; B (3) + D (3) = 6; E (2) + F (2) = 4 ⇒ <strong>3 khe</strong>, bằng cận dưới, nên ở đây là tối ưu. Xếp các băng là bài toán đóng gói (bin packing) — nói chung NP-khó, nên bộ lập lịch thật dùng heuristic như thế này.</li>
<li>(d) 16 / (4 × 6) = <strong>67%</strong> cho thứ tự của sách; 16 / (3 × 6) = <strong>89%</strong> cho first-fit decreasing — cùng các việc, một lịch tốt hơn, dùng thêm 22 điểm phần trăm của máy. (Luật first-fit cần biết trước mọi băng; bộ lập lịch trực tuyến không phải lúc nào cũng làm được.)</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 3 — route through a 16 × 16 omega network (15 min)</h3>
<p>An omega network joins 16 CPUs to 16 memories. (a) How many stages and how many 2 × 2 switches does it have, and how many crosspoints does that make, against a 16 × 16 crossbar? (b) CPU 0101 (= 5) sends a message to memory 1100 (= 12). Which switch does it use in each stage, and which output?</p>
<details><summary>Solution — computed by the simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/26092c075cc5f499913b36cbe937278425d52f20.svg" alt="The hardware count for n = 16" loading="lazy" /><p class="chu-thich">🧮 The hardware count for n = 16</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const K = 4, NGUON = 5, DICH = 12;</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/02b56f7964f819314023e19157c5a3b85f3f8097.svg" alt="CPU 0101 → memory 1100" loading="lazy" /><p class="chu-thich">🧮 CPU 0101 → memory 1100</p></div>
<p>stage 1: line in 1010 → switch 5, bit 1 → line out 1011<br>stage 2: line in 0111 → switch 3, bit 1 → line out 0111<br>stage 3: line in 1110 → switch 7, bit 0 → line out 1110<br>stage 4: line in 1101 → switch 6, bit 0 → line out 1100</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const K = 4, NGUON = 5, DICH = 12;</code></pre></details>
<ul>
<li>(a) log₂ 16 = <strong>4 stages</strong>, each with 16 / 2 = 8 switches ⇒ <strong>32 switches</strong> = 128 crosspoints (4 per switch), against 16 × 16 = <strong>256</strong> for the crossbar — half. (At n = 1,024 the ratio is 20,480 against 1,048,576.)</li>
<li>(b) The message enters stage 1 on the line number of the CPU rotated left by one bit (0101 → 1010 = 10 → switch 5); the first destination bit (1) chooses the lower output. After every stage the line number is rotated again. The program prints the path: <strong>switch 5 → 3 → 7 → 6</strong>, using the destination bits 1, 1, 0, 0 from the left, and it arrives at line 1100 = memory 12 (the program throws an error if any route fails to arrive).</li>
</ul>
</details>`,
    `<h3>🧪 Bài 3 — định tuyến qua mạng omega 16 × 16 (15 phút)</h3>
<p>Một mạng omega nối 16 CPU với 16 bộ nhớ. (a) Nó có bao nhiêu tầng và bao nhiêu công tắc 2 × 2, vậy là bao nhiêu điểm nối, so với crossbar 16 × 16? (b) CPU 0101 (= 5) gửi thông điệp tới bộ nhớ 1100 (= 12). Nó dùng công tắc nào ở mỗi tầng, và ngõ ra nào?</p>
<details><summary>Lời giải — bộ mô phỏng tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b5acdc8497473fcffd138a6d0183dbf2ea166e43.svg" alt="Số phần cứng cho n = 16" loading="lazy" /><p class="chu-thich">🧮 Số phần cứng cho n = 16</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const K = 4, NGUON = 5, DICH = 12;</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d1f744c5ff2f5bfab77216779585d71f45e56e52.svg" alt="CPU 0101 → bộ nhớ 1100" loading="lazy" /><p class="chu-thich">🧮 CPU 0101 → bộ nhớ 1100</p></div>
<p>tầng 1: đường vào 1010 → công tắc 5, bit 1 → đường ra 1011<br>tầng 2: đường vào 0111 → công tắc 3, bit 1 → đường ra 0111<br>tầng 3: đường vào 1110 → công tắc 7, bit 0 → đường ra 1110<br>tầng 4: đường vào 1101 → công tắc 6, bit 0 → đường ra 1100</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const K = 4, NGUON = 5, DICH = 12;</code></pre></details>
<ul>
<li>(a) log₂ 16 = <strong>4 tầng</strong>, mỗi tầng 16 / 2 = 8 công tắc ⇒ <strong>32 công tắc</strong> = 128 điểm nối (4 mỗi công tắc), so với 16 × 16 = <strong>256</strong> của crossbar — một nửa. (Ở n = 1.024 tỉ lệ là 20.480 so với 1.048.576.)</li>
<li>(b) Thông điệp vào tầng 1 trên đường có số bằng số của CPU xoay trái một bit (0101 → 1010 = 10 → công tắc 5); bit đích đầu tiên (1) chọn ngõ ra dưới. Sau mỗi tầng số đường lại được xoay. Chương trình in đường đi: <strong>công tắc 5 → 3 → 7 → 6</strong>, dùng các bit đích 1, 1, 0, 0 từ trái, và nó tới đường 1100 = bộ nhớ 12 (chương trình ném lỗi nếu có đường nào không tới nơi).</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 4 — which network for 64 nodes? (15 min)</h3>
<p>Build a ring, an 8 × 8 grid, an 8 × 8 torus and a 6-dimensional hypercube, each with 64 nodes. For each, count the links, the largest number of links on one node, and the <em>diameter</em> (the greatest number of hops between two nodes). Which has the smallest diameter for the number of links per node? Check the formulas: ring <code>n/2</code>, grid <code>2(√n − 1)</code>, torus <code>√n</code>, hypercube <code>log₂ n</code>.</p>
<details><summary>Solution — measured by breadth-first search</summary>
<pre><code class="language-javascript">// Interconnect topologies with 64 nodes, measured by breadth-first search
const mk = (n, edge) =&gt; { const g = Array.from({ length: n }, () =&gt; []); for (const [a, b] of edge) { g[a].push(b); g[b].push(a); } return g; };
const ring = (n) =&gt; mk(n, Array.from({ length: n }, (_, i) =&gt; [i, (i + 1) % n]));
const grid = (r, c, wrap) =&gt; { const e = []; for (let i = 0; i &lt; r; i++) for (let j = 0; j &lt; c; j++) { const id = i * c + j;
  if (j + 1 &lt; c) e.push([id, id + 1]); else if (wrap) e.push([id, i * c]);
  if (i + 1 &lt; r) e.push([id, id + c]); else if (wrap) e.push([id, j]); } return mk(r * c, e); };
const cube = (k) =&gt; { const e = []; for (let i = 0; i &lt; 1 &lt;&lt; k; i++) for (let b = 0; b &lt; k; b++) if (!((i &gt;&gt; b) &amp; 1)) e.push([i, i | (1 &lt;&lt; b)]); return mk(1 &lt;&lt; k, e); };
function diameter(g) { let d = 0; for (let s = 0; s &lt; g.length; s++) { const dist = Array(g.length).fill(-1); dist[s] = 0; const q = [s];
  while (q.length) { const u = q.shift(); for (const v of g[u]) if (dist[v] &lt; 0) { dist[v] = dist[u] + 1; q.push(v); } } d = Math.max(d, ...dist); } return d; }
for (const [name, g] of [['ring', ring(64)], ['8x8 grid', grid(8, 8, false)], ['8x8 torus', grid(8, 8, true)], ['6-D hypercube', cube(6)]])
  console.log(&#96;&#36;{name.padEnd(14)} nodes &#36;{g.length}  links &#36;{g.reduce((s, x) =&gt; s + x.length, 0) / 2}  links per node (max) &#36;{Math.max(...g.map((x) =&gt; x.length))}  diameter &#36;{diameter(g)}&#96;);</code></pre>
<div class="out">$ node topo.js<br>
ring &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nodes 64 &nbsp;links 64 &nbsp;links per node (max) 2 &nbsp;diameter 32<br>
8x8 grid &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nodes 64 &nbsp;links 112 &nbsp;links per node (max) 4 &nbsp;diameter 14<br>
8x8 torus &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nodes 64 &nbsp;links 128 &nbsp;links per node (max) 4 &nbsp;diameter 8<br>
6-D hypercube &nbsp;nodes 64 &nbsp;links 192 &nbsp;links per node (max) 6 &nbsp;diameter 6</div>
<ul>
<li>ring: 64 links, 2 per node, diameter <strong>32</strong> = 64 / 2 ✔; grid 8 × 8: 112 links, ≤ 4 per node, diameter <strong>14</strong> = 2 × (8 − 1) ✔; torus 8 × 8: 128 links, 4 per node, diameter <strong>8</strong> = 2 × (8 / 2) ✔ (the formula √n = 8); hypercube 6-D: 192 links, 6 per node, diameter <strong>6</strong> = log₂ 64 ✔.</li>
<li>The torus has four links per node whatever its size and diameter √n; the hypercube has the smallest diameter (6) but its degree grows with log₂ n — at 1,024 nodes it needs 10 links on each node, a 32 × 32 torus still 4 (with diameter 32). The ring is the cheapest and the slowest. Choose by what you can wire: this is the trade-off of 8.B slide 20.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 4 — mạng nào cho 64 nút? (15 phút)</h3>
<p>Dựng một vòng, một lưới 8 × 8, một torus 8 × 8 và một siêu khối 6 chiều, mỗi mạng 64 nút. Với mỗi mạng, đếm số liên kết, số liên kết nhiều nhất trên một nút, và <em>đường kính</em> (số bước lớn nhất giữa hai nút). Mạng nào có đường kính nhỏ nhất so với số liên kết mỗi nút? Kiểm công thức: vòng <code>n/2</code>, lưới <code>2(√n − 1)</code>, torus <code>√n</code>, siêu khối <code>log₂ n</code>.</p>
<details><summary>Lời giải — đo bằng duyệt theo chiều rộng</summary>
<pre><code class="language-javascript">// Các mạng liên kết 64 nút, đo bằng duyệt theo chiều rộng
const mk = (n, edge) =&gt; { const g = Array.from({ length: n }, () =&gt; []); for (const [a, b] of edge) { g[a].push(b); g[b].push(a); } return g; };
const ring = (n) =&gt; mk(n, Array.from({ length: n }, (_, i) =&gt; [i, (i + 1) % n]));
const grid = (r, c, wrap) =&gt; { const e = []; for (let i = 0; i &lt; r; i++) for (let j = 0; j &lt; c; j++) { const id = i * c + j;
  if (j + 1 &lt; c) e.push([id, id + 1]); else if (wrap) e.push([id, i * c]);
  if (i + 1 &lt; r) e.push([id, id + c]); else if (wrap) e.push([id, j]); } return mk(r * c, e); };
const cube = (k) =&gt; { const e = []; for (let i = 0; i &lt; 1 &lt;&lt; k; i++) for (let b = 0; b &lt; k; b++) if (!((i &gt;&gt; b) &amp; 1)) e.push([i, i | (1 &lt;&lt; b)]); return mk(1 &lt;&lt; k, e); };
function diameter(g) { let d = 0; for (let s = 0; s &lt; g.length; s++) { const dist = Array(g.length).fill(-1); dist[s] = 0; const q = [s];
  while (q.length) { const u = q.shift(); for (const v of g[u]) if (dist[v] &lt; 0) { dist[v] = dist[u] + 1; q.push(v); } } d = Math.max(d, ...dist); } return d; }
for (const [name, g] of [['ring', ring(64)], ['8x8 grid', grid(8, 8, false)], ['8x8 torus', grid(8, 8, true)], ['6-D hypercube', cube(6)]])
  console.log(&#96;&#36;{name.padEnd(14)} nodes &#36;{g.length}  links &#36;{g.reduce((s, x) =&gt; s + x.length, 0) / 2}  links per node (max) &#36;{Math.max(...g.map((x) =&gt; x.length))}  diameter &#36;{diameter(g)}&#96;);</code></pre>
<div class="out">$ node topo.js<br>
ring &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nodes 64 &nbsp;links 64 &nbsp;links per node (max) 2 &nbsp;diameter 32<br>
8x8 grid &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nodes 64 &nbsp;links 112 &nbsp;links per node (max) 4 &nbsp;diameter 14<br>
8x8 torus &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nodes 64 &nbsp;links 128 &nbsp;links per node (max) 4 &nbsp;diameter 8<br>
6-D hypercube &nbsp;nodes 64 &nbsp;links 192 &nbsp;links per node (max) 6 &nbsp;diameter 6</div>
<ul>
<li>vòng: 64 liên kết, 2 mỗi nút, đường kính <strong>32</strong> = 64 / 2 ✔; lưới 8 × 8: 112 liên kết, ≤ 4 mỗi nút, đường kính <strong>14</strong> = 2 × (8 − 1) ✔; torus 8 × 8: 128 liên kết, 4 mỗi nút, đường kính <strong>8</strong> = 2 × (8 / 2) ✔ (công thức √n = 8); siêu khối 6 chiều: 192 liên kết, 6 mỗi nút, đường kính <strong>6</strong> = log₂ 64 ✔.</li>
<li>Torus có bốn liên kết mỗi nút dù cỡ nào và đường kính √n; siêu khối có đường kính nhỏ nhất (6) nhưng bậc tăng theo log₂ n — ở 1.024 nút nó cần 10 liên kết trên mỗi nút, còn torus 32 × 32 vẫn 4 (với đường kính 32). Vòng rẻ nhất và chậm nhất. Chọn theo thứ bạn đi dây được: đó là đánh đổi của 8.B slide 20.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 5 — how far apart must two counters be? (20 min)</h3>
<p>Two threads each increment <em>their own</em> counter 20 million times, each pinned to its own CPU. The counters sit 8, 16, 32, 64, 128 and 256 bytes apart in one buffer. Predict, then measure: at which distance does the time stop improving? Is "pad to 64 bytes" enough on this machine?</p>
<details><summary>Solution — run for real (one run on a shared machine)</summary>
<pre><code class="language-c">// Exercise: how far apart must two counters be so that two cores stop fighting over a cache line?
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;sched.h&gt;
#include &lt;pthread.h&gt;
#include &lt;time.h&gt;
#include &lt;stdlib.h&gt;

#define LOOPS 20000000L
static char *buf;
static volatile long *cell[2];
static pthread_barrier_t start;
static int pin_cpu[2];                                  // the two CPUs the threads are pinned to (taskset-style affinity)
static void pin_me(int id) {                            // without pinning, both threads may land on the SAME virtual CPU and share nothing
    cpu_set_t s; CPU_ZERO(&amp;s); CPU_SET(pin_cpu[id], &amp;s); pthread_setaffinity_np(pthread_self(), sizeof s, &amp;s);
}
static void pick_cpus(void) {
    cpu_set_t a; sched_getaffinity(0, sizeof a, &amp;a); int n = 0;
    for (int c = 0; c &lt; CPU_SETSIZE &amp;&amp; n &lt; 2; c++) if (CPU_ISSET(c, &amp;a)) pin_cpu[n++] = c;
}

static void *work(void *arg) {
    volatile long *p = cell[(long)arg];
    pin_me((int)(long)arg);
    pthread_barrier_wait(&amp;start);
    for (long i = 0; i &lt; LOOPS; i++) (*p)++;
    return NULL;
}
int main(void) {
    pick_cpus();
    int gaps[] = {8, 16, 32, 64, 128, 256};
    buf = aligned_alloc(4096, 4096);
    for (int g = 0; g &lt; 6; g++) {
      double best = 1e9;
      for (int rep = 0; rep &lt; 7; rep++) {                                   // best of 7
        pthread_t t[2]; struct timespec a, b;
        cell[0] = (volatile long *)buf; cell[1] = (volatile long *)(buf + gaps[g]);
        *cell[0] = *cell[1] = 0;
        pthread_barrier_init(&amp;start, NULL, 3);
        pthread_create(&amp;t[0], NULL, work, (void *)0); pthread_create(&amp;t[1], NULL, work, (void *)1);
        pthread_barrier_wait(&amp;start);
        clock_gettime(CLOCK_MONOTONIC, &amp;a);
        pthread_join(t[0], NULL); pthread_join(t[1], NULL);
        clock_gettime(CLOCK_MONOTONIC, &amp;b);
        pthread_barrier_destroy(&amp;start);
        double ms = (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6;
        if (ms &lt; best) best = ms;
      }
      printf("offset %3d B : best of 7: %.0f ms\\n", gaps[g], best);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread cach-dong.c -o cach-dong &amp;&amp; ./cach-dong<br>
offset &nbsp;&nbsp;8 B : best of 7: 55 ms<br>
offset &nbsp;16 B : best of 7: 53 ms<br>
offset &nbsp;32 B : best of 7: 59 ms<br>
offset &nbsp;64 B : best of 7: 46 ms<br>
offset 128 B : best of 7: 44 ms<br>
offset 256 B : best of 7: 45 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Each figure is the best of 7 runs. In the cached run, 8, 16 and 32 bytes apart cost <strong>53–59 ms</strong> and from <strong>64 bytes on the time falls to 44–46 ms</strong> and stays flat at 128 and 256. So here the two counters shared a cache line until they were 64 bytes apart: the line is 64 bytes <em>or</em> the chip moves 128-byte pairs and the 64-byte step is hidden by noise — one table cannot tell, and an earlier run of a similar program on the same machine showed the last drop only at 128 bytes (M-series chips are generally reported to use 128-byte lines). The practical lesson: <em>measure on the machine you deploy to</em>, and when in doubt pad to 128. The gain is modest (about 20%) because the loop itself is slow (<code>-O0</code>, a memory increment); with a tighter loop the gap on x86 is often several times. The check the lesson makes is only structural (six offsets measured, 256 bytes not much worse than 8): on a machine shared with other programs a single run can blur the effect — repeat it and read the shape, not the digits.</p>
<div class="callout">🧭 Backend: never hard-code "64". Java's <code>@Contended</code> pads to <code>-XX:ContendedPaddingWidth</code> (default 128 bytes) exactly because some CPUs have 128-byte lines or prefetch line pairs; the Linux kernel's <code>L1_CACHE_BYTES</code> is set per architecture.</div>
</details>`,
    `<h3>🧪 Bài 5 — hai biến đếm phải cách nhau bao xa? (20 phút)</h3>
<p>Hai luồng mỗi luồng tăng biến đếm <em>của riêng nó</em> 60 triệu lần. Các biến đếm nằm cách nhau 8, 16, 32, 64, 128 và 256 byte trong một bộ đệm. Dự đoán, rồi đo: ở khoảng cách nào thời gian thôi cải thiện? "Đệm tới 64 byte" có đủ trên máy này không?</p>
<details><summary>Lời giải — chạy thật (một lần chạy trên máy dùng chung)</summary>
<pre><code class="language-c">// Bài tập: hai biến đếm phải cách nhau bao xa để hai nhân thôi tranh một dòng cache?
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;sched.h&gt;
#include &lt;pthread.h&gt;
#include &lt;time.h&gt;
#include &lt;stdlib.h&gt;

#define LOOPS 20000000L
static char *buf;
static volatile long *cell[2];
static pthread_barrier_t start;
static int pin_cpu[2];                                  // hai CPU mà các luồng được ghim vào (affinity kiểu taskset)
static void pin_me(int id) {                            // không ghim thì cả hai luồng có thể rơi vào CÙNG một CPU ảo và không chia sẻ gì
    cpu_set_t s; CPU_ZERO(&amp;s); CPU_SET(pin_cpu[id], &amp;s); pthread_setaffinity_np(pthread_self(), sizeof s, &amp;s);
}
static void pick_cpus(void) {
    cpu_set_t a; sched_getaffinity(0, sizeof a, &amp;a); int n = 0;
    for (int c = 0; c &lt; CPU_SETSIZE &amp;&amp; n &lt; 2; c++) if (CPU_ISSET(c, &amp;a)) pin_cpu[n++] = c;
}

static void *work(void *arg) {
    volatile long *p = cell[(long)arg];
    pin_me((int)(long)arg);
    pthread_barrier_wait(&amp;start);
    for (long i = 0; i &lt; LOOPS; i++) (*p)++;
    return NULL;
}
int main(void) {
    pick_cpus();
    int gaps[] = {8, 16, 32, 64, 128, 256};
    buf = aligned_alloc(4096, 4096);
    for (int g = 0; g &lt; 6; g++) {
      double best = 1e9;
      for (int rep = 0; rep &lt; 7; rep++) {                                   // tốt nhất trong 3 lần
        pthread_t t[2]; struct timespec a, b;
        cell[0] = (volatile long *)buf; cell[1] = (volatile long *)(buf + gaps[g]);
        *cell[0] = *cell[1] = 0;
        pthread_barrier_init(&amp;start, NULL, 3);
        pthread_create(&amp;t[0], NULL, work, (void *)0); pthread_create(&amp;t[1], NULL, work, (void *)1);
        pthread_barrier_wait(&amp;start);
        clock_gettime(CLOCK_MONOTONIC, &amp;a);
        pthread_join(t[0], NULL); pthread_join(t[1], NULL);
        clock_gettime(CLOCK_MONOTONIC, &amp;b);
        pthread_barrier_destroy(&amp;start);
        double ms = (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6;
        if (ms &lt; best) best = ms;
      }
      printf("offset %3d B : best of 7: %.0f ms\\n", gaps[g], best);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread cach-dong.c -o cach-dong &amp;&amp; ./cach-dong<br>
offset &nbsp;&nbsp;8 B : best of 7: 55 ms<br>
offset &nbsp;16 B : best of 7: 53 ms<br>
offset &nbsp;32 B : best of 7: 59 ms<br>
offset &nbsp;64 B : best of 7: 46 ms<br>
offset 128 B : best of 7: 44 ms<br>
offset 256 B : best of 7: 45 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Mỗi con số là tốt nhất trong 7 lần chạy. Trong lần chạy được lưu, cách nhau 8, 16 và 32 byte tốn <strong>53–59 ms</strong> và từ <strong>64 byte trở đi thời gian giảm còn 44–46 ms</strong> rồi đứng yên ở 128 và 256. Vậy ở đây hai biến đếm chung một dòng cache cho tới khi cách nhau 64 byte: dòng dài 64 byte <em>hoặc</em> chip chuyển theo cặp 128 byte và bước 64 byte bị nhiễu che mất — một bảng không phân biệt được, và một lần chạy trước của chương trình tương tự trên cùng máy cho thấy lần giảm cuối chỉ ở 128 byte (chip dòng M thường được báo là dùng dòng 128 byte). Bài học thực tế: <em>đo trên máy bạn triển khai</em>, và khi phân vân thì đệm 128. Mức lợi vừa phải (khoảng 20%) vì bản thân vòng lặp chậm (<code>-O0</code>, một phép tăng trong bộ nhớ); với vòng lặp chặt hơn thì khoảng cách trên x86 thường là vài lần. Phép kiểm của bài chỉ mang tính cấu trúc (đo đủ sáu khoảng cách, 256 byte không tệ hơn nhiều so với 8): trên máy dùng chung với chương trình khác, một lần chạy đơn lẻ có thể làm mờ hiệu ứng — hãy chạy lặp và đọc hình dạng, đừng đọc chữ số.</p>
<div class="callout">🧭 Backend: đừng bao giờ ghi cứng "64". <code>@Contended</code> của Java đệm theo <code>-XX:ContendedPaddingWidth</code> (mặc định 128 byte) đúng vì một số CPU có dòng 128 byte hay nạp trước cặp dòng; <code>L1_CACHE_BYTES</code> của nhân Linux được đặt theo từng kiến trúc.</div>
</details>`),
    bi(`<h3>🧪 Exercise 6 — the reply that never arrived (20 min)</h3>
<p>A payment server charges the customer and then crashes <em>before</em> sending the reply, on every first attempt. The client retries until it gets a reply. (a) Charge Ann 100 with a plain retry: how much is she charged? (b) Charge Bob 100 sending the same <code>key</code> on every attempt, with a server that remembers keys: how much is Bob charged? (c) Which delivery guarantee does each client give — at-most-once or at-least-once? (d) Why can a client never tell "the server ran it" from "the server did not"?</p>
<details><summary>Solution — run for real over a TCP socket</summary>
<pre><code class="language-javascript">// A reply that gets lost: did the server run the request once or twice?
import net from 'node:net';

const charged = new Map();                 // customer -&gt; total charged
const seenKeys = new Set();                // idempotency keys already processed
let calls = 0;
const server = net.createServer((sock) =&gt; {
  let buf = '';
  sock.on('data', (d) =&gt; {
    buf += d; let i;
    while ((i = buf.indexOf('\\n')) &gt;= 0) {
      const req = JSON.parse(buf.slice(0, i)); buf = buf.slice(i + 1); calls++;
      const dup = req.key &amp;&amp; seenKeys.has(req.key);
      if (!dup) { charged.set(req.who, (charged.get(req.who) || 0) + req.amount); if (req.key) seenKeys.add(req.key); }
      if (calls % 2 === 1) { sock.destroy(); return; }   // the server did the work, then "crashed" before replying: every FIRST attempt loses its reply
      sock.write(JSON.stringify({ ok: true, dup }) + '\\n');
    }
  });
});
await new Promise((r) =&gt; server.listen(0, '127.0.0.1', r));
const port = server.address().port;
function call(req) {
  return new Promise((resolve, reject) =&gt; {
    const c = net.connect(port, '127.0.0.1'); let b = '';
    c.on('data', (d) =&gt; { b += d; if (b.includes('\\n')) { c.destroy(); resolve(JSON.parse(b)); } });
    c.on('close', () =&gt; { if (!b.includes('\\n')) reject(new Error('connection closed, no reply')); });
    c.write(JSON.stringify(req) + '\\n');
  });
}
async function withRetry(req) {            // at-least-once: retry until a reply arrives
  for (let attempt = 1; ; attempt++) {
    try { const r = await call(req); return { attempt, ...r }; } catch (e) { console.log(&#96;   attempt &#36;{attempt}: &#36;{e.message} -&gt; retry&#96;); }
  }
}
console.log('1) naive retry, no key: charge Ann 100');
console.log('   result:', JSON.stringify(await withRetry({ who: 'Ann', amount: 100 })));
console.log('   Ann was charged', charged.get('Ann'), '(she owed 100)');
console.log('2) retry WITH an idempotency key: charge Bob 100');
const key = 'order-7731-payment';
console.log('   result:', JSON.stringify(await withRetry({ who: 'Bob', amount: 100, key })));
console.log('   Bob was charged', charged.get('Bob'), '(he owed 100)');
server.close();</code></pre>
<div class="out">$ node thu-lai.js<br>
1) naive retry, no key: charge Ann 100<br>
&nbsp;&nbsp;&nbsp;attempt 1: connection closed, no reply -&gt; retry<br>
&nbsp;&nbsp;&nbsp;result: {"attempt":2,"ok":true}<br>
&nbsp;&nbsp;&nbsp;Ann was charged 200 (she owed 100)<br>
2) retry WITH an idempotency key: charge Bob 100<br>
&nbsp;&nbsp;&nbsp;attempt 1: connection closed, no reply -&gt; retry<br>
&nbsp;&nbsp;&nbsp;result: {"attempt":2,"ok":true,"dup":true}<br>
&nbsp;&nbsp;&nbsp;Bob was charged 100 (he owed 100)</div>
<ul>
<li>(a) Attempt 1 charged Ann 100 and the reply was lost; attempt 2 charged her again ⇒ <strong>200</strong> for a bill of 100. Retrying makes the call <em>at-least-once</em>, and a non-idempotent operation (add 100) executed twice is wrong.</li>
<li>(b) The first attempt records the key and charges 100; the second finds the key already seen ("dup": true), charges nothing and returns the answer ⇒ Bob pays <strong>100</strong>. The operation became <em>idempotent</em>: running it twice has the effect of running it once.</li>
<li>(c) A client that never retries is <em>at-most-once</em> (it may lose the request, never duplicates it); the retrying client is <em>at-least-once</em>; "exactly once" is built from at-least-once plus an idempotent server, as in (b).</li>
<li>(d) The only evidence the client has is the <em>absence</em> of a reply, and "no reply" is what it sees if the request never arrived, if the server crashed before working, if it crashed after working (this program), or if only the reply was lost. These cases are indistinguishable from outside — the central problem of remote calls (8.B slide 25).</li>
</ul>
<div class="callout">🧭 Backend: Stripe's <code>Idempotency-Key</code> header, a database unique constraint on an order id, and the "processed message ids" table of a queue consumer are the same idea. Use it for every operation that moves money or sends an email.</div>
</details>`,
    `<h3>🧪 Bài 6 — câu trả lời không bao giờ tới (20 phút)</h3>
<p>Một server thanh toán trừ tiền khách rồi sập <em>trước khi</em> gửi trả lời, ở mọi lần thử đầu. Client thử lại tới khi nhận được trả lời. (a) Trừ Ann 100 bằng thử lại thường: cô bị trừ bao nhiêu? (b) Trừ Bob 100 gửi cùng một <code>key</code> ở mọi lần thử, với server nhớ các khoá: Bob bị trừ bao nhiêu? (c) Mỗi client cho bảo đảm giao nhận nào — at-most-once hay at-least-once? (d) Vì sao client không bao giờ phân biệt được "server đã chạy" với "server chưa chạy"?</p>
<details><summary>Lời giải — chạy thật qua socket TCP</summary>
<pre><code class="language-javascript">// Một câu trả lời bị mất: server đã chạy yêu cầu một lần hay hai lần?
import net from 'node:net';

const charged = new Map();                 // khách -&gt; tổng đã trừ
const seenKeys = new Set();                // các khoá luỹ đẳng đã xử lý
let calls = 0;
const server = net.createServer((sock) =&gt; {
  let buf = '';
  sock.on('data', (d) =&gt; {
    buf += d; let i;
    while ((i = buf.indexOf('\\n')) &gt;= 0) {
      const req = JSON.parse(buf.slice(0, i)); buf = buf.slice(i + 1); calls++;
      const dup = req.key &amp;&amp; seenKeys.has(req.key);
      if (!dup) { charged.set(req.who, (charged.get(req.who) || 0) + req.amount); if (req.key) seenKeys.add(req.key); }
      if (calls % 2 === 1) { sock.destroy(); return; }   // server làm xong rồi "sập" trước khi trả lời: mọi lần thử ĐẦU mất câu trả lời
      sock.write(JSON.stringify({ ok: true, dup }) + '\\n');
    }
  });
});
await new Promise((r) =&gt; server.listen(0, '127.0.0.1', r));
const port = server.address().port;
function call(req) {
  return new Promise((resolve, reject) =&gt; {
    const c = net.connect(port, '127.0.0.1'); let b = '';
    c.on('data', (d) =&gt; { b += d; if (b.includes('\\n')) { c.destroy(); resolve(JSON.parse(b)); } });
    c.on('close', () =&gt; { if (!b.includes('\\n')) reject(new Error('connection closed, no reply')); });
    c.write(JSON.stringify(req) + '\\n');
  });
}
async function withRetry(req) {            // at-least-once: thử lại tới khi có trả lời
  for (let attempt = 1; ; attempt++) {
    try { const r = await call(req); return { attempt, ...r }; } catch (e) { console.log(&#96;   attempt &#36;{attempt}: &#36;{e.message} -&gt; retry&#96;); }
  }
}
console.log('1) naive retry, no key: charge Ann 100');
console.log('   result:', JSON.stringify(await withRetry({ who: 'Ann', amount: 100 })));
console.log('   Ann was charged', charged.get('Ann'), '(she owed 100)');
console.log('2) retry WITH an idempotency key: charge Bob 100');
const key = 'order-7731-payment';
console.log('   result:', JSON.stringify(await withRetry({ who: 'Bob', amount: 100, key })));
console.log('   Bob was charged', charged.get('Bob'), '(he owed 100)');
server.close();</code></pre>
<div class="out">$ node thu-lai.js<br>
1) naive retry, no key: charge Ann 100<br>
&nbsp;&nbsp;&nbsp;attempt 1: connection closed, no reply -&gt; retry<br>
&nbsp;&nbsp;&nbsp;result: {"attempt":2,"ok":true}<br>
&nbsp;&nbsp;&nbsp;Ann was charged 200 (she owed 100)<br>
2) retry WITH an idempotency key: charge Bob 100<br>
&nbsp;&nbsp;&nbsp;attempt 1: connection closed, no reply -&gt; retry<br>
&nbsp;&nbsp;&nbsp;result: {"attempt":2,"ok":true,"dup":true}<br>
&nbsp;&nbsp;&nbsp;Bob was charged 100 (he owed 100)</div>
<ul>
<li>(a) Lần thử 1 trừ Ann 100 và câu trả lời bị mất; lần thử 2 trừ cô lần nữa ⇒ <strong>200</strong> cho hoá đơn 100. Thử lại làm lời gọi thành <em>at-least-once</em>, và một thao tác không luỹ đẳng (cộng 100) chạy hai lần là sai.</li>
<li>(b) Lần thử đầu ghi lại khoá và trừ 100; lần thứ hai thấy khoá đã có ("dup": true), không trừ gì và trả đáp án ⇒ Bob trả <strong>100</strong>. Thao tác đã thành <em>luỹ đẳng</em>: chạy hai lần có tác dụng như chạy một lần.</li>
<li>(c) Client không bao giờ thử lại là <em>at-most-once</em> (có thể mất yêu cầu, không bao giờ lặp); client có thử lại là <em>at-least-once</em>; "exactly once" được dựng từ at-least-once cộng một server luỹ đẳng, như ở (b).</li>
<li>(d) Bằng chứng duy nhất client có là <em>sự vắng mặt</em> của câu trả lời, và "không có trả lời" là thứ nó thấy nếu yêu cầu không bao giờ tới, nếu server sập trước khi làm, nếu sập sau khi làm (chương trình này), hay nếu chỉ câu trả lời bị mất. Các trường hợp này không phân biệt được từ bên ngoài — bài toán trung tâm của lời gọi từ xa (8.B slide 25).</li>
</ul>
<div class="callout">🧭 Backend: header <code>Idempotency-Key</code> của Stripe, ràng buộc unique trong cơ sở dữ liệu trên mã đơn hàng, và bảng "id thông điệp đã xử lý" của một consumer hàng đợi là cùng một ý. Hãy dùng nó cho mọi thao tác chuyển tiền hay gửi email.</div>
</details>`),
    bi(`<h3>🧪 Exercise 7 — a CPU quota is time sharing with a ceiling (15 min)</h3>
<p><code>docker run --cpus=0.5</code> does not give a container half of a core's <em>speed</em>. (a) Make a cgroup with <code>cpu.max = 50000 100000</code> (50 ms of CPU per 100 ms period) and run a busy loop in it: how much CPU does it get, and does the kernel pause it? (b) Is that "time sharing" or "space sharing" in the sense of 8.A? (c) What would give the container <em>exclusive</em> cores instead?</p>
<details><summary>Solution — run for real (<code>--privileged</code> to create a cgroup)</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># A CPU QUOTA (what &#96;docker run --cpus=0.5&#96; sets) is time sharing with a ceiling: the busy loop is paused when its budget is used up<br>
$ echo "50000 100000" &gt; /sys/fs/cgroup/demo/cpu.max<br>
$ echo "cpu.max = $(cat /sys/fs/cgroup/demo/cpu.max) &nbsp;&nbsp;(50 ms of CPU in every 100 ms = half a CPU)"<br>
cpu.max = 50000 100000 &nbsp;&nbsp;(50 ms of CPU in every 100 ms = half a CPU)<br>
# One busy loop for about 1-2 seconds inside the group (bash's SECONDS has a whole-second granularity, so we count in scheduler periods)<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/demo/cgroup.procs; end=$((SECONDS+2)); while [ $SECONDS -lt $end ]; do :; done'<br>
$ U=$(awk '/usage_usec/ {print $2}' /sys/fs/cgroup/demo/cpu.stat); P=$(awk '/nr_periods/ {print $2}' /sys/fs/cgroup/demo/cpu.stat)<br>
$ echo "CPU time used: $((U/1000)) ms over $P periods of 100 ms -&gt; usage = $((U/(P*1000)))% of one CPU"<br>
CPU time used: 599 ms over 11 periods of 100 ms -&gt; usage = 54% of one CPU<br>
$ grep -E "nr_periods|nr_throttled" /sys/fs/cgroup/demo/cpu.stat<br>
nr_periods 11<br>
nr_throttled 11</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<ul>
<li>(a) About <strong>50%</strong> of one CPU (the run measured 54% over 11 periods): the loop used its 50 ms budget at the start of every period and was then <em>throttled</em> for the rest of it — <code>nr_throttled</code> equals <code>nr_periods</code>, every period ended with a pause. The loop itself ran at full core speed whenever it ran.</li>
<li>(b) <strong>Time sharing with a ceiling</strong>: the loop can run on any CPU of the machine, but only for a limited share of time (a bandwidth limit). Space sharing would restrict <em>which</em> CPUs it may use.</li>
<li>(c) A <strong>cpuset</strong> (<code>docker run --cpuset-cpus=2,3</code>, or the <code>static</code> CPU-manager policy of Kubernetes for integer requests = limits) pins the container to chosen cores — the affinity mask of 8.A slide 16 — and nothing else is scheduled there if you also keep other work off them. A quota is flexible and wastes nothing; a cpuset is predictable and can leave cores idle.</li>
</ul>
<div class="callout">🧭 Backend: a Java or Node.js process in a container with a CPU limit of 0.5 may see 16 cores (the host's) and size its thread pool for 16 — the JVM reads the cgroup limit since JDK 10 (<code>-XX:ActiveProcessorCount</code> overrides), Node's <code>os.availableParallelism()</code> may not. A latency spike every 100 ms in a throttled service is usually this quota: look at <code>cpu.stat</code> for <code>nr_throttled</code>.</div>
</details>`,
    `<h3>🧪 Bài 7 — hạn ngạch CPU là chia giờ có trần (15 phút)</h3>
<p><code>docker run --cpus=0.5</code> không cho container một nửa <em>tốc độ</em> của một nhân. (a) Tạo một cgroup với <code>cpu.max = 50000 100000</code> (50 ms CPU mỗi chu kỳ 100 ms) và chạy một vòng lặp bận trong đó: nó được bao nhiêu CPU, và nhân có dừng nó không? (b) Đó là "chia giờ" hay "chia không gian" theo nghĩa của 8.A? (c) Cái gì cho container nhân <em>độc quyền</em> thay vào đó?</p>
<details><summary>Lời giải — chạy thật (<code>--privileged</code> để tạo cgroup)</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># HẠN NGẠCH CPU (thứ &#96;docker run --cpus=0.5&#96; đặt) là chia giờ có trần: vòng lặp bận bị dừng khi hết ngân sách<br>
$ echo "50000 100000" &gt; /sys/fs/cgroup/demo/cpu.max<br>
$ echo "cpu.max = $(cat /sys/fs/cgroup/demo/cpu.max) &nbsp;&nbsp;(50 ms of CPU in every 100 ms = half a CPU)"<br>
cpu.max = 50000 100000 &nbsp;&nbsp;(50 ms of CPU in every 100 ms = half a CPU)<br>
# Một vòng lặp bận khoảng 1-2 giây bên trong nhóm (SECONDS của bash tính theo giây nguyên, nên ta đếm theo chu kỳ của bộ lập lịch)<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/demo/cgroup.procs; end=$((SECONDS+2)); while [ $SECONDS -lt $end ]; do :; done'<br>
$ U=$(awk '/usage_usec/ {print $2}' /sys/fs/cgroup/demo/cpu.stat); P=$(awk '/nr_periods/ {print $2}' /sys/fs/cgroup/demo/cpu.stat)<br>
$ echo "CPU time used: $((U/1000)) ms over $P periods of 100 ms -&gt; usage = $((U/(P*1000)))% of one CPU"<br>
CPU time used: 599 ms over 11 periods of 100 ms -&gt; usage = 54% of one CPU<br>
$ grep -E "nr_periods|nr_throttled" /sys/fs/cgroup/demo/cpu.stat<br>
nr_periods 11<br>
nr_throttled 11</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<ul>
<li>(a) Khoảng <strong>50%</strong> của một CPU (lần chạy đo được 54% trên 11 chu kỳ): vòng lặp dùng hết ngân sách 50 ms ở đầu mỗi chu kỳ rồi bị <em>kìm (throttle)</em> trong phần còn lại — <code>nr_throttled</code> bằng <code>nr_periods</code>, chu kỳ nào cũng kết thúc bằng một lần dừng. Bản thân vòng lặp chạy ở tốc độ nhân đầy đủ mỗi khi nó chạy.</li>
<li>(b) <strong>Chia giờ có trần</strong>: vòng lặp chạy được trên CPU nào của máy, nhưng chỉ trong một phần thời gian có hạn (giới hạn băng thông). Chia không gian sẽ hạn chế <em>những CPU nào</em> nó được dùng.</li>
<li>(c) Một <strong>cpuset</strong> (<code>docker run --cpuset-cpus=2,3</code>, hay chính sách CPU-manager <code>static</code> của Kubernetes cho yêu cầu nguyên = giới hạn) ghim container vào các nhân được chọn — mặt nạ affinity của 8.A slide 16 — và không gì khác được xếp lịch ở đó nếu bạn cũng giữ việc khác tránh xa chúng. Hạn ngạch linh hoạt và không phí gì; cpuset dự đoán được và có thể để nhân rảnh.</li>
</ul>
<div class="callout">🧭 Backend: một tiến trình Java hay Node.js trong container có giới hạn CPU 0,5 có thể thấy 16 nhân (của máy chủ) và định cỡ thread pool cho 16 — JVM đọc giới hạn cgroup từ JDK 10 (<code>-XX:ActiveProcessorCount</code> ghi đè), còn <code>os.availableParallelism()</code> của Node có thể không. Một đỉnh độ trễ mỗi 100 ms ở một service bị kìm thường chính là hạn ngạch này: hãy xem <code>nr_throttled</code> trong <code>cpu.stat</code>.</div>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>multiprocessor</strong></td><td>đa xử lý</td><td>A computer with several CPUs sharing one memory and one address space.</td></tr>
<tr><td><strong>multicomputer</strong></td><td>đa máy tính</td><td>Many CPU + RAM nodes joined by a fast network, no shared memory; they cooperate by messages.</td></tr>
<tr><td><strong>distributed system</strong></td><td>hệ phân tán</td><td>Complete computers, possibly worldwide, hidden behind middleware so that they look like one system.</td></tr>
<tr><td><strong>UMA / NUMA</strong></td><td>truy cập bộ nhớ đồng đều / không đồng đều</td><td>Uniform: every CPU reads any word in the same time; non-uniform: one address space but remote memory is slower.</td></tr>
<tr><td><strong>cache coherence / MESI</strong></td><td>đồng bộ cache / MESI</td><td>A hardware protocol that keeps copies of a cache line in several CPU caches consistent (Modified, Exclusive, Shared, Invalid).</td></tr>
<tr><td><strong>crossbar / omega network</strong></td><td>công tắc chéo / mạng omega</td><td>An n × n grid of crosspoints (n² switches, no blocking) versus log₂ n stages of 2 × 2 switches ((n/2)·log₂ n, can block).</td></tr>
<tr><td><strong>SMP / master–slave</strong></td><td>đa xử lý đối xứng / chủ–thợ</td><td>One OS copy that any CPU can run (kernel tables locked) versus one master CPU running the OS for all.</td></tr>
<tr><td><strong>spin lock / TTAS</strong></td><td>khoá quay / TTAS</td><td>A lock whose waiter loops (busy-waits); TTAS spins on a read first to avoid hammering the cache line with writes.</td></tr>
<tr><td><strong>false sharing</strong></td><td>chia sẻ giả</td><td>Unrelated variables in the same cache line (or page) make CPUs fight over it although they never share data.</td></tr>
<tr><td><strong>time sharing / space sharing / gang scheduling</strong></td><td>chia giờ / chia không gian / gang scheduling</td><td>One shared ready queue; CPUs partitioned among jobs; all threads of a job run together in the same slot.</td></tr>
<tr><td><strong>Amdahl's law</strong></td><td>định luật Amdahl</td><td>Speed-up = 1 / ((1 − p) + p / n): the serial part (1 − p) limits what n CPUs can achieve.</td></tr>
<tr><td><strong>interconnect topology / diameter / bisection width</strong></td><td>cấu trúc mạng liên kết / đường kính / bisection width</td><td>How nodes are wired; the worst-case hop count; the links cut to halve the machine.</td></tr>
<tr><td><strong>store-and-forward / cut-through</strong></td><td>lưu rồi chuyển / chuyển xuyên</td><td>A switch receives the whole packet before forwarding it, versus forwarding the head before the tail has arrived.</td></tr>
<tr><td><strong>blocking / nonblocking send</strong></td><td>gửi chặn / gửi không chặn</td><td>send returns when the message is safely sent, versus returns at once (kernel buffer takes it, EAGAIN if full).</td></tr>
<tr><td><strong>RPC / stub / marshaling</strong></td><td>gọi thủ tục từ xa / stub / đóng gói tham số</td><td>A call to a procedure on another machine through a client stub that packs parameters into a message and a server stub that unpacks them.</td></tr>
<tr><td><strong>idempotent operation</strong></td><td>thao tác luỹ đẳng</td><td>An operation whose repeated execution has the same effect as one execution — makes retries safe.</td></tr>
<tr><td><strong>distributed shared memory (DSM)</strong></td><td>bộ nhớ chia sẻ phân tán</td><td>Shared memory simulated on message passing, e.g. with page faults that fetch pages from other machines.</td></tr>
<tr><td><strong>load balancing (sender- / receiver-initiated)</strong></td><td>cân bằng tải (bên gửi / bên nhận khởi xướng)</td><td>An overloaded node looks for a free node, or an idle node looks for work.</td></tr>
<tr><td><strong>middleware</strong></td><td>middleware</td><td>Software between applications and the OS of every node that gives a common model (documents, files, objects, tuples, messages).</td></tr>
<tr><td><strong>tuple space / publish–subscribe</strong></td><td>không gian tuple / xuất bản–đăng ký</td><td>Processes coordinate through a shared bag of tuples, or through topics a broker routes from producers to subscribers.</td></tr>
<tr><td><strong>sequential consistency / session semantics</strong></td><td>nhất quán tuần tự / ngữ nghĩa phiên</td><td>Every read sees every earlier write (one machine) versus changes become visible when the file is closed.</td></tr>
<tr><td><strong>CPU quota / cpuset</strong></td><td>hạn ngạch CPU / cpuset</td><td>A time budget per period (time sharing with a ceiling) versus a set of cores a process may use (space sharing).</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>multiprocessor</strong></td><td>đa xử lý</td><td>Máy tính có nhiều CPU dùng chung một bộ nhớ và một không gian địa chỉ.</td></tr>
<tr><td><strong>multicomputer</strong></td><td>đa máy tính</td><td>Nhiều nút CPU + RAM nối bằng mạng nhanh, không bộ nhớ chung; chúng hợp tác bằng thông điệp.</td></tr>
<tr><td><strong>distributed system</strong></td><td>hệ phân tán</td><td>Các máy tính nguyên vẹn, có thể khắp thế giới, được che sau middleware để trông như một hệ thống.</td></tr>
<tr><td><strong>UMA / NUMA</strong></td><td>truy cập bộ nhớ đồng đều / không đồng đều</td><td>Đồng đều: mọi CPU đọc từ nào cũng cùng thời gian; không đồng đều: một không gian địa chỉ nhưng bộ nhớ ở xa chậm hơn.</td></tr>
<tr><td><strong>cache coherence / MESI</strong></td><td>đồng bộ cache / MESI</td><td>Giao thức phần cứng giữ các bản sao của một dòng cache trong nhiều cache CPU nhất quán (Modified, Exclusive, Shared, Invalid).</td></tr>
<tr><td><strong>crossbar / omega network</strong></td><td>công tắc chéo / mạng omega</td><td>Lưới n × n các điểm nối (n² công tắc, không chặn) so với log₂ n tầng công tắc 2 × 2 ((n/2)·log₂ n, có thể bị chặn).</td></tr>
<tr><td><strong>SMP / master–slave</strong></td><td>đa xử lý đối xứng / chủ–thợ</td><td>Một bản HĐH mà CPU nào cũng chạy được (bảng nhân có khoá) so với một CPU chủ chạy HĐH cho tất cả.</td></tr>
<tr><td><strong>spin lock / TTAS</strong></td><td>khoá quay / TTAS</td><td>Khoá mà bên chờ lặp vòng (chờ bận); TTAS quay trên một lệnh đọc trước để không đập dòng cache bằng lệnh ghi.</td></tr>
<tr><td><strong>false sharing</strong></td><td>chia sẻ giả</td><td>Các biến không liên quan nằm chung một dòng cache (hay trang) làm các CPU tranh nhau dù chúng không chia sẻ dữ liệu.</td></tr>
<tr><td><strong>time sharing / space sharing / gang scheduling</strong></td><td>chia giờ / chia không gian / gang scheduling</td><td>Một hàng đợi sẵn sàng chung; CPU được chia thành phân vùng cho các việc; mọi luồng của một việc chạy cùng nhau trong một khe.</td></tr>
<tr><td><strong>Amdahl's law</strong></td><td>định luật Amdahl</td><td>Tăng tốc = 1 / ((1 − p) + p / n): phần tuần tự (1 − p) giới hạn những gì n CPU làm được.</td></tr>
<tr><td><strong>interconnect topology / diameter / bisection width</strong></td><td>cấu trúc mạng liên kết / đường kính / bisection width</td><td>Cách đi dây các nút; số bước tối đa; số liên kết bị cắt để chia đôi máy.</td></tr>
<tr><td><strong>store-and-forward / cut-through</strong></td><td>lưu rồi chuyển / chuyển xuyên</td><td>Switch nhận cả gói rồi mới chuyển, so với chuyển phần đầu trước khi phần đuôi tới.</td></tr>
<tr><td><strong>blocking / nonblocking send</strong></td><td>gửi chặn / gửi không chặn</td><td>send trả về khi thông điệp đã gửi an toàn, so với trả về ngay (bộ đệm nhân nhận nó, EAGAIN nếu đầy).</td></tr>
<tr><td><strong>RPC / stub / marshaling</strong></td><td>gọi thủ tục từ xa / stub / đóng gói tham số</td><td>Lời gọi thủ tục trên máy khác qua client stub đóng gói tham số thành thông điệp và server stub mở gói.</td></tr>
<tr><td><strong>idempotent operation</strong></td><td>thao tác luỹ đẳng</td><td>Thao tác mà chạy lặp có tác dụng như chạy một lần — làm việc thử lại an toàn.</td></tr>
<tr><td><strong>distributed shared memory (DSM)</strong></td><td>bộ nhớ chia sẻ phân tán</td><td>Bộ nhớ chung được mô phỏng trên truyền thông điệp, ví dụ bằng lỗi trang kéo trang từ máy khác.</td></tr>
<tr><td><strong>load balancing (sender- / receiver-initiated)</strong></td><td>cân bằng tải (bên gửi / bên nhận khởi xướng)</td><td>Nút quá tải đi tìm nút rảnh, hoặc nút rảnh đi tìm việc.</td></tr>
<tr><td><strong>middleware</strong></td><td>middleware</td><td>Phần mềm giữa ứng dụng và HĐH của mọi nút, cho một mô hình chung (tài liệu, tệp, đối tượng, tuple, thông điệp).</td></tr>
<tr><td><strong>tuple space / publish–subscribe</strong></td><td>không gian tuple / xuất bản–đăng ký</td><td>Các tiến trình điều phối qua một túi tuple dùng chung, hoặc qua các chủ đề mà một broker định tuyến từ producer tới subscriber.</td></tr>
<tr><td><strong>sequential consistency / session semantics</strong></td><td>nhất quán tuần tự / ngữ nghĩa phiên</td><td>Mọi lần đọc thấy mọi lần ghi trước đó (một máy) so với thay đổi hiện ra khi tệp được đóng.</td></tr>
<tr><td><strong>CPU quota / cpuset</strong></td><td>hạn ngạch CPU / cpuset</td><td>Một ngân sách thời gian mỗi chu kỳ (chia giờ có trần) so với tập nhân mà tiến trình được dùng (chia không gian).</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 8</h2>
<ol>
<li>Three ways to use many CPUs, by what they <strong>share</strong>: a <strong>multiprocessor</strong> shares memory (≈ ns), a <strong>multicomputer</strong> shares only a fast network (≈ µs, messages), a <strong>distributed system</strong> shares the Internet (≈ ms, many owners). Each step costs about 1000× in delay and buys scale.</li>
<li>Shared-memory hardware: a <strong>bus</strong> with caches needs <strong>cache coherence</strong> (MESI, working on lines); a <strong>crossbar</strong> (n² crosspoints) never blocks; an <strong>omega network</strong> ((n/2)·log₂ n switches) is cheaper but can block (8! = 40,320 pairings, only 2¹² = 4096 pass). <strong>UMA</strong> = same time to all memory; <strong>NUMA</strong> = one address space, remote slower; <strong>CC-NUMA with directories</strong> asks the home node instead of broadcasting.</li>
<li>Multiprocessor OS: own OS per CPU (no balancing, inconsistent buffer cache), <strong>master–slave</strong> (master bottleneck), <strong>SMP</strong> (one OS, any CPU, kernel tables locked — big lock then fine-grained locks, order the locks to avoid deadlock; Linux's BKL lasted until 2.6.39). Advantage of multiprocessors: <strong>throughput</strong>.</li>
<li><strong>TSL</strong> must lock the memory bus (or own the line) to work across CPUs; spin if the wait is shorter than a context switch; spinning on TSL thrashes the cache — use <strong>TTAS</strong>, <strong>queue locks</strong> or, best, <strong>don't share</strong> (per-thread counters). <strong>False sharing</strong> (same line or page) is silent slowness: pad to the real line size (64 B on most x86, possibly 128 B on Apple M — measure).</li>
<li>Scheduling many CPUs: <strong>time sharing</strong> (one queue, easy, scatters threads), <strong>space sharing</strong> (own CPUs, wastes idle ones — taskset, cpuset), <strong>gang scheduling</strong> (a whole job together in a slot; the table is a bin-packing problem). Amdahl: speed-up = 1 / ((1 − p) + p/n).</li>
<li>Multicomputers: topologies (ring, grid, torus, hypercube: compare <strong>diameter</strong> and <strong>bisection width</strong>), <strong>store-and-forward</strong> versus <strong>cut-through</strong>, network interface copies; <strong>blocking</strong> vs <strong>nonblocking</strong> send (the kernel buffer: 65,536 bytes for a pipe); <strong>RPC</strong> hides syntax but not latency, partial failure or pointer-passing — retries need <strong>idempotency</strong>.</li>
<li><strong>DSM</strong> fakes shared memory with page faults (migrate or replicate pages); its enemy is <strong>false sharing</strong>. Placement: graph cuts (Figure 8-24: 30 and 28 — brute force finds 23 or 11), <strong>sender-initiated</strong> (good at light load) versus <strong>receiver-initiated</strong> (good at heavy load) balancing; work stealing and Node cluster are the everyday versions.</li>
<li>Distributed systems: <strong>middleware</strong> hides heterogeneity. Models: <strong>document</strong> (Web: DNS → TCP → HTTP; keep-alive, HTTP/2/3), <strong>file system</strong> (upload/download vs remote access; naming transparency; sharing semantics: sequential, session, immutable, transactions), <strong>object</strong> (CORBA → gRPC), <strong>coordination</strong> (Linda tuples; publish/subscribe). Network: switched Ethernet, the Internet, six services (TCP = reliable byte stream, UDP = datagram), headers wrap in layers (Ethernet 14 + IP 20 + TCP 20).</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 8</h2>
<ol>
<li>Ba cách dùng nhiều CPU, theo thứ chúng <strong>dùng chung</strong>: <strong>multiprocessor</strong> dùng chung bộ nhớ (≈ ns), <strong>multicomputer</strong> chỉ dùng chung một mạng nhanh (≈ µs, thông điệp), <strong>hệ phân tán</strong> dùng chung Internet (≈ ms, nhiều chủ). Mỗi bước tốn khoảng 1000 lần độ trễ và mua thêm quy mô.</li>
<li>Phần cứng chia sẻ bộ nhớ: một <strong>bus</strong> có cache cần <strong>đồng bộ cache</strong> (MESI, làm việc theo dòng); <strong>crossbar</strong> (n² điểm nối) không bao giờ chặn; <strong>mạng omega</strong> ((n/2)·log₂ n công tắc) rẻ hơn nhưng có thể chặn (8! = 40.320 cách ghép, chỉ 2¹² = 4096 cách đi qua). <strong>UMA</strong> = cùng thời gian tới mọi bộ nhớ; <strong>NUMA</strong> = một không gian địa chỉ, ở xa chậm hơn; <strong>CC-NUMA có thư mục</strong> hỏi nút nhà thay vì phát quảng bá.</li>
<li>HĐH đa xử lý: mỗi CPU một HĐH (không cân bằng, buffer cache không nhất quán), <strong>chủ–thợ</strong> (master là nút cổ chai), <strong>SMP</strong> (một HĐH, CPU nào cũng chạy, bảng nhân có khoá — khoá lớn rồi khoá mịn, đánh thứ tự khoá để tránh bế tắc; BKL của Linux tồn tại tới 2.6.39). Ưu điểm của đa xử lý: <strong>thông lượng</strong>.</li>
<li><strong>TSL</strong> phải khoá bus bộ nhớ (hoặc độc chiếm dòng) mới chạy được giữa các CPU; quay nếu thời gian chờ ngắn hơn một lần chuyển ngữ cảnh; quay trên TSL làm cache thrashing — dùng <strong>TTAS</strong>, <strong>khoá hàng đợi</strong> hay tốt nhất là <strong>đừng chia sẻ</strong> (biến đếm theo luồng). <strong>False sharing</strong> (cùng dòng hay trang) là chậm trong im lặng: đệm theo cỡ dòng thật (64 B trên hầu hết x86, có thể 128 B trên Apple M — hãy đo).</li>
<li>Lập lịch nhiều CPU: <strong>chia giờ</strong> (một hàng đợi, dễ, làm luồng bị rải), <strong>chia không gian</strong> (CPU riêng, phí CPU rảnh — taskset, cpuset), <strong>gang scheduling</strong> (cả một việc cùng nhau trong một khe; bảng là bài toán đóng gói). Amdahl: tăng tốc = 1 / ((1 − p) + p/n).</li>
<li>Multicomputer: cấu trúc mạng (vòng, lưới, torus, siêu khối: so <strong>đường kính</strong> và <strong>bisection width</strong>), <strong>store-and-forward</strong> so với <strong>cut-through</strong>, các lần sao chép ở giao diện mạng; gửi <strong>chặn</strong> so với <strong>không chặn</strong> (bộ đệm nhân: 65.536 byte cho một pipe); <strong>RPC</strong> giấu cú pháp nhưng không giấu độ trễ, thất bại một phần hay việc truyền con trỏ — thử lại cần <strong>luỹ đẳng</strong>.</li>
<li><strong>DSM</strong> giả bộ nhớ chung bằng lỗi trang (di chuyển hay nhân bản trang); kẻ thù của nó là <strong>false sharing</strong>. Đặt chỗ: lát cắt đồ thị (Hình 8-24: 30 và 28 — vét cạn tìm được 23 hoặc 11), cân bằng <strong>do bên gửi khởi xướng</strong> (tốt khi nhẹ tải) so với <strong>do bên nhận khởi xướng</strong> (tốt khi nặng tải); ăn cắp việc và Node cluster là phiên bản hằng ngày.</li>
<li>Hệ phân tán: <strong>middleware</strong> giấu tính không đồng nhất. Các mô hình: <strong>tài liệu</strong> (Web: DNS → TCP → HTTP; keep-alive, HTTP/2/3), <strong>hệ tệp</strong> (upload/download so với truy cập từ xa; trong suốt về tên; ngữ nghĩa chia sẻ: tuần tự, phiên, bất biến, giao dịch), <strong>đối tượng</strong> (CORBA → gRPC), <strong>điều phối</strong> (tuple Linda; publish/subscribe). Mạng: Ethernet chuyển mạch, Internet, sáu dịch vụ (TCP = dòng byte tin cậy, UDP = datagram), header bọc theo tầng (Ethernet 14 + IP 20 + TCP 20).</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-ch8) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) Many popular operating systems, including Windows and Linux, run on multiprocessors. What are the main advantages of multiprocessor systems?|||(Dạng câu FE) Nhiều hệ điều hành phổ biến, gồm Windows và Linux, chạy trên máy đa xử lý. Ưu điểm chính của hệ thống đa xử lý là gì?',
      options: ['Increase throughput|||Tăng thông lượng', 'Decrease throughput|||Giảm thông lượng', 'Low-speed communication|||Giao tiếp tốc độ thấp', 'Reduced reliability|||Giảm độ tin cậy'],
      correctIndex: 0,
      points: 1,
      explanation: "More CPUs finish more jobs per unit of time — <em>throughput</em> goes up (FE8#4, FE13#4, FE14#6; the question bank is right). The other three are the opposite of an advantage: communication through shared memory is fast, and with a good design a failing CPU need not stop the machine. Note that one single job does not necessarily finish sooner — Amdahl's law (lesson 8.A, slide 2) limits that.|||Nhiều CPU hơn thì xong nhiều việc hơn trong một đơn vị thời gian — <em>thông lượng</em> tăng (FE8#4, FE13#4, FE14#6; ngân hàng câu hỏi đúng). Ba phương án kia đều là ngược của ưu điểm: giao tiếp qua bộ nhớ chung rất nhanh, và với thiết kế tốt một CPU hỏng không nhất thiết làm dừng cả máy. Lưu ý một việc đơn lẻ không nhất thiết xong sớm hơn — định luật Amdahl (bài 8.A, slide 2) giới hạn điều đó." },
    { id: 'q2',
      question: '(FE question type) Which operating system runs on systems with any CPU configuration — multi-processor, multi-core or multi-chip?|||(Dạng câu FE) Hệ điều hành nào chạy trên hệ thống có cấu hình CPU bất kỳ — đa bộ xử lý, đa nhân hay đa chip?',
      options: ['Embedded OS|||Embedded OS', 'Multiprocessor OS|||Multiprocessor OS', 'PC OS|||PC OS', 'Server OS|||Server OS'],
      correctIndex: 1,
      points: 1,
      explanation: 'In the chapter-1 classification of operating systems, the one defined by "any number of CPUs" is the <em>multiprocessor</em> OS (FE7#5, FE11#4, FE16#6; the bank is right). In practice every server and PC OS is one today — Linux and Windows are SMP — but the <em>definition</em> asked here is the multiprocessor one. Lesson 8.A, slide 12.|||Trong cách phân loại HĐH ở chương 1, loại được định nghĩa bằng "số CPU bất kỳ" là HĐH <em>đa xử lý (multiprocessor)</em> (FE7#5, FE11#4, FE16#6; ngân hàng đúng). Trên thực tế mọi HĐH server và PC ngày nay đều là loại đó — Linux và Windows là SMP — nhưng <em>định nghĩa</em> được hỏi ở đây là của multiprocessor. Bài 8.A, slide 12.' },
    { id: 'q3',
      question: '(FE question type) A crossbar switch connects 16 CPUs to 16 memories with one crosspoint for every CPU–memory pair. How many crosspoints does it need?|||(Dạng câu FE) Một công tắc chéo (crossbar) nối 16 CPU với 16 bộ nhớ, mỗi cặp CPU–bộ nhớ có một điểm nối. Nó cần bao nhiêu điểm nối?',
      options: ['16|||16', '32|||32', '256|||256', '4096|||4096'],
      correctIndex: 2,
      points: 1,
      explanation: 'Output of the real program: an n × n crossbar has n² crosspoints, 16 × 16 = 256. 16 would be a bus (one connection per CPU), 32 is "16 + 16" (adding instead of multiplying), 4096 = 16³ is a made-up distractor. The n² growth is why 1,024 CPUs would need 1,048,576 crosspoints (lesson 8.A, slide 4).|||Output của chương trình thật: crossbar n × n có n² điểm nối, 16 × 16 = 256. 16 là bus (mỗi CPU một kết nối), 32 là "16 + 16" (cộng thay vì nhân), 4096 = 16³ là phương án nhiễu bịa ra. Tăng theo n² là lý do 1.024 CPU cần tới 1.048.576 điểm nối (bài 8.A, slide 4).' },
    { id: 'q4',
      question: '(FE question type) An omega switching network joins 64 CPUs to 64 memories using 2 × 2 switches. How many switches does it contain?|||(Dạng câu FE) Một mạng chuyển mạch omega nối 64 CPU với 64 bộ nhớ bằng các công tắc 2 × 2. Nó chứa bao nhiêu công tắc?',
      options: ['64|||64', '192|||192', '384|||384', '4096|||4096'],
      correctIndex: 1,
      points: 1,
      explanation: "Output of the real program: log₂ 64 = 6 stages, each with 64 / 2 = 32 switches, so (n / 2) · log₂ n = 32 × 6 = 192. 384 forgets to halve (64 × 6); 64 counts only one stage's worth of lines; 4096 = 64² is the crossbar's crosspoint count. Lesson 8.A, slide 5.|||Output của chương trình thật: log₂ 64 = 6 tầng, mỗi tầng 64 / 2 = 32 công tắc, nên (n / 2) · log₂ n = 32 × 6 = 192. 384 quên chia đôi (64 × 6); 64 chỉ đếm số đường của một tầng; 4096 = 64² là số điểm nối của crossbar. Bài 8.A, slide 5." },
    { id: 'q5',
      question: "(FE question type) 90% of a program can run in parallel and 10% is strictly serial. What speed-up does Amdahl's law give on 10 cores?|||(Dạng câu FE) 90% một chương trình chạy song song được và 10% bắt buộc tuần tự. Định luật Amdahl cho tăng tốc bao nhiêu trên 10 nhân?",
      options: ['10x|||10x', '9x|||9x', '1.9x|||1.9x', '5.3x|||5.3x'],
      correctIndex: 3,
      points: 1,
      explanation: 'Output of the real program: speed-up = 1 / ((1 − 0.9) + 0.9 / 10) = 1 / (0.1 + 0.09) = 5.26 ≈ 5.3×. 10× would need 100% parallel work; 9× takes p × n and forgets the serial part; 1.9× is far too low (two cores alone already give about 1.8×). The limit with infinitely many cores is 1 / 0.1 = 10×. Lesson 8.A, slide 2.|||Output của chương trình thật: tăng tốc = 1 / ((1 − 0,9) + 0,9 / 10) = 1 / (0,1 + 0,09) = 5,26 ≈ 5,3×. 10× cần 100% việc song song; 9× lấy p × n và quên phần tuần tự; 1,9× thấp quá mức (chỉ 2 nhân đã cho khoảng 1,8 lần). Giới hạn với vô hạn nhân là 1 / 0,1 = 10×. Bài 8.A, slide 2.' },
    { id: 'q6',
      question: '(FE question type) A 4-CPU machine uses gang scheduling. Four jobs need 3, 2, 2 and 1 threads (A, B, C, D), and every gang must run in one time slot with all of its threads at once. What is the smallest number of time slots that holds all four gangs?|||(Dạng câu FE) Một máy 4 CPU dùng gang scheduling. Bốn việc cần 3, 2, 2 và 1 luồng (A, B, C, D), và mỗi băng phải chạy trong một khe thời gian với mọi luồng cùng lúc. Số khe thời gian ít nhất chứa đủ bốn băng là bao nhiêu?',
      options: ['1|||1', '3|||3', '2|||2', '4|||4'],
      correctIndex: 2,
      points: 1,
      explanation: 'Computed by the simulator: 3 + 2 + 2 + 1 = 8 threads on 4 CPUs, so at least 8 / 4 = 2 slots; packing A (3) with D (1) in one slot and B (2) with C (2) in the other achieves it. 3 is what you get by placing the gangs in the given order, each only in the current slot (A | B + C | D) — a worse packing of the same jobs. 1 cannot hold 8 threads on 4 CPUs, and 4 is one slot per gang. Lesson 8.A, slide 19; lesson 8.C, exercise 2.|||Bộ mô phỏng tính: 3 + 2 + 2 + 1 = 8 luồng trên 4 CPU, nên ít nhất 8 / 4 = 2 khe; xếp A (3) cùng D (1) vào một khe và B (2) cùng C (2) vào khe kia là đạt được. 3 là kết quả khi đặt các băng theo thứ tự đã cho, mỗi băng chỉ vào khe hiện tại (A | B + C | D) — một cách xếp tệ hơn cho cùng các việc. 1 không chứa nổi 8 luồng trên 4 CPU, và 4 là mỗi băng một khe. Bài 8.A, slide 19; bài 8.C, bài tập 2.' },
    { id: 'q7',
      question: '(FE question type) Which statement describes a NUMA multiprocessor?|||(Dạng câu FE) Phát biểu nào mô tả một máy đa xử lý NUMA?',
      options: ['There is one address space, but access to remote memory is slower than access to local memory|||Có một không gian địa chỉ, nhưng truy cập bộ nhớ ở xa chậm hơn truy cập bộ nhớ cục bộ', 'Every CPU has its own address space and the CPUs exchange messages|||Mỗi CPU có không gian địa chỉ riêng và các CPU trao đổi thông điệp', 'Remote memory can only be reached with send and receive calls|||Bộ nhớ ở xa chỉ truy cập được bằng lời gọi send và receive', 'Every memory word takes the same time to read for every CPU|||Mọi ô nhớ đều mất cùng thời gian đọc đối với mọi CPU'],
      correctIndex: 0,
      points: 1,
      explanation: 'The three NUMA properties: a single address space visible to all CPUs, remote memory reached with ordinary LOAD and STORE, remote memory slower than local. Option B and C describe a multicomputer (message passing, no shared address space); option D is the definition of UMA — the "U" that NUMA gives up. Lesson 8.A, slides 7–9.|||Ba tính chất của NUMA: một không gian địa chỉ mọi CPU đều thấy, bộ nhớ ở xa được truy cập bằng LOAD và STORE bình thường, bộ nhớ ở xa chậm hơn bộ nhớ cục bộ. Phương án B và C mô tả multicomputer (truyền thông điệp, không có không gian địa chỉ chung); phương án D là định nghĩa của UMA — chữ "U" mà NUMA bỏ đi. Bài 8.A, slide 7–9.' },
    { id: 'q8',
      question: '(FE question type) Figure 8-24 shows nine processes A–I placed on three nodes. The edge weights are network traffic. For the right-hand allocation, nodes {A, E, G}, {B, C, F, H} and {D, I}, what is the total traffic that crosses between nodes?|||(Dạng câu FE) Hình 8-24 cho chín tiến trình A–I đặt trên ba nút. Trọng số cạnh là lưu lượng mạng. Với cách gán bên phải, các nút {A, E, G}, {B, C, F, H} và {D, I}, tổng lưu lượng đi qua giữa các nút là bao nhiêu?',
      options: ['30|||30', '23|||23', '11|||11', '28|||28'],
      correctIndex: 3,
      points: 1,
      explanation: "Computed by the simulator from the 16 edges of the figure: the cut edges of this allocation add up to 28 (the book's number; the left allocation gives 30). 23 and 11 are the best values a brute-force search finds under stricter or looser limits on processes per node — better than the book's examples, so they cannot be \"the right-hand allocation\". Lesson 8.B, slide 31.|||Bộ mô phỏng tính từ 16 cạnh của hình: các cạnh bị cắt của cách gán này cộng lại là 28 (con số của sách; cách gán bên trái cho 30). 23 và 11 là các giá trị tốt nhất mà phép tìm vét cạn thấy với giới hạn chặt hơn hoặc lỏng hơn về số tiến trình mỗi nút — tốt hơn ví dụ của sách, nên không thể là \"cách gán bên phải\". Bài 8.B, slide 31." },
    { id: 'q9',
      question: '(FE question type) A sender uses a nonblocking send on a pipe whose kernel buffer is full because nobody is reading. What happens?|||(Dạng câu FE) Một bên gửi dùng gửi không chặn trên một pipe có bộ đệm nhân đã đầy vì không ai đọc. Chuyện gì xảy ra?',
      options: ['The call returns at once with an error (EAGAIN, "try again later")|||Lời gọi trả về ngay với một lỗi (EAGAIN, "thử lại sau")', 'The sender sleeps until a reader frees some space|||Bên gửi ngủ tới khi có người đọc giải phóng chỗ', 'The oldest bytes in the buffer are overwritten|||Các byte cũ nhất trong bộ đệm bị ghi đè', 'The kernel enlarges the buffer without limit|||Nhân nới rộng bộ đệm không giới hạn'],
      correctIndex: 0,
      points: 1,
      explanation: 'Real run in lesson 8.B, slide 23: a pipe holds exactly 65,536 bytes; the nonblocking write was accepted until the buffer was full and then returned −1 with EAGAIN immediately. Sleeping until space appears (B) is what the <em>blocking</em> write does — the same program showed it stuck after one second. C and D do not happen: a kernel buffer is bounded and never drops data silently, which is why backpressure exists.|||Chạy thật ở bài 8.B, slide 23: một pipe chứa đúng 65.536 byte; lệnh ghi không chặn được nhận cho tới khi bộ đệm đầy rồi trả −1 với EAGAIN ngay lập tức. Ngủ chờ tới khi có chỗ (B) là việc của lệnh ghi <em>chặn</em> — cùng chương trình đó cho thấy nó bị kẹt sau một giây. C và D không xảy ra: bộ đệm nhân có giới hạn và không bao giờ lặng lẽ bỏ dữ liệu, đó là lý do backpressure tồn tại.' },
    { id: 'q10',
      question: '(FE question type) A client sends the RPC "charge Ann 100" and the reply is lost, so it times out. Which design makes retrying the request SAFE?|||(Dạng câu FE) Một client gửi RPC "trừ Ann 100" và câu trả lời bị mất nên hết thời gian chờ. Thiết kế nào làm việc THỬ LẠI yêu cầu trở nên AN TOÀN?',
      options: ['Retry with a freshly generated request each time|||Thử lại bằng một yêu cầu mới sinh ra mỗi lần', 'Send an idempotency key so the server can recognise a repeated request|||Gửi một khoá luỹ đẳng để server nhận ra yêu cầu bị lặp', 'Switch from TCP to UDP so that nothing is resent|||Đổi từ TCP sang UDP để không có gì bị gửi lại', 'Wait forever instead of using a timeout|||Chờ mãi thay vì dùng timeout'],
      correctIndex: 1,
      points: 1,
      explanation: 'A timeout does not say whether the server ran the request (maybe it processed it and only the reply was lost). With the same idempotency key on every retry the server recognises the duplicate and does not charge twice — in lesson 8.C, exercise 6, the naive retry charged Ann 200 for a 100 bill while the keyed retry charged Bob exactly 100. A fresh request each time (A) is the double-charge bug; UDP (C) loses more, not less; waiting forever (D) just hangs the caller. Lesson 8.B, slide 25.|||Hết thời gian chờ không cho biết server đã chạy yêu cầu chưa (có thể nó đã xử lý và chỉ câu trả lời bị mất). Với cùng một khoá luỹ đẳng ở mọi lần thử lại, server nhận ra bản lặp và không trừ tiền hai lần — ở bài 8.C, bài tập 6, lần thử lại ngây thơ đã trừ Ann 200 cho hoá đơn 100 trong khi lần thử lại có khoá trừ Bob đúng 100. Một yêu cầu mới mỗi lần (A) là lỗi trừ tiền hai lần; UDP (C) mất nhiều hơn chứ không ít hơn; chờ mãi (D) chỉ làm bên gọi treo. Bài 8.B, slide 25.' },
  ],
};

const QUIZ_LESSON = {
  title: 'Chapter 8 Quiz|||Quiz chương 8',
  slug: 'osg202-quiz-ch8',
  type: 'QUIZ',
  description: '10 câu ôn Chương 8 (hệ thống nhiều bộ xử lý) theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ; câu tính toán có đáp án kiểm bằng chương trình hoặc bộ mô phỏng chạy thật: ưu điểm của hệ đa xử lý và HĐH đa xử lý, số điểm nối của crossbar, số công tắc của mạng omega, định luật Amdahl, số khe ít nhất của bảng gang scheduling, tính chất NUMA, lưu lượng mạng của một cách gán tiến trình, gửi không chặn vào pipe đầy và thử lại RPC an toàn bằng khoá luỹ đẳng.',
  quiz: QUIZ,
};

export default {
  slides: [L_osg8_1, L_osg8_2],
  practice: L_on_ch8,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 8 (hệ thống nhiều bộ xử lý) theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ; câu tính toán có đáp án kiểm bằng chương trình hoặc bộ mô phỏng chạy thật: ưu điểm của hệ đa xử lý và HĐH đa xử lý, số điểm nối của crossbar, số công tắc của mạng omega, định luật Amdahl, số khe ít nhất của bảng gang scheduling, tính chất NUMA, lưu lượng mạng của một cách gán tiến trình, gửi không chặn vào pipe đầy và thử lại RPC an toàn bằng khoá luỹ đẳng.',
  quizLesson: QUIZ_LESSON,
  lessons: [L_osg8_1, L_osg8_2, L_on_ch8, QUIZ_LESSON],
};
