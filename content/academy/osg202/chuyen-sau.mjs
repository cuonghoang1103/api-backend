/**
 * OSG202 · ⭐ Chuyên sâu — Hệ điều hành trong backend thật (slide tự dựng).
 * Deck TỰ DỰNG (không phải slide trường): cs1 (28 slide), cs3 (28 slide), cs6 (28 slide).
 * Mỗi deck: bài 📑 theo slide → bài 🧪 bài tập → quiz.
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs — sửa nguồn rồi chạy lại, đừng sửa tay.
 */

import { registerDeck, walk, walkHead, books, bi } from './_slides.mjs';

registerDeck('cs1', { code: '⭐ CS.1', en: '⭐ Advanced 1 — Linux process model in practice', vi: '⭐ Chuyên sâu 1 — Mô hình tiến trình Linux trong thực tế', total: 28, w: 1280, h: 720 });
registerDeck('cs3', { code: '⭐ CS.3', en: '⭐ Advanced 3 — Threads in backend: thread pool vs event loop', vi: '⭐ Chuyên sâu 3 — Luồng trong backend: thread pool vs event loop', total: 28, w: 1280, h: 720 });
registerDeck('cs6', { code: '⭐ CS.6', en: '⭐ Advanced 6 — Containers = namespaces + cgroups', vi: '⭐ Chuyên sâu 6 — Container = namespace + cgroup', total: 28, w: 1280, h: 720 });

/* ───────── ⭐ CS.1 — 📑 Slide by slide · Linux processes (1/2): process tree, /proc, fork–exec–wait, exit codes, zombies (slides 1–13) ───────── */
const L_cs1_1 = {
  title: '⭐ CS.1 — 📑 Slide by slide · Linux processes (1/2): process tree, /proc, fork–exec–wait, exit codes, zombies (slides 1–13)|||⭐ CS.1 — 📑 Học theo từng slide · Tiến trình Linux (1/2): cây tiến trình, /proc, fork–exec–wait, mã thoát, zombie (slide 1–13)',
  slug: 'osg202-slide-cs1-1',
  type: 'VIDEO',
  description: 'Phần tự thêm ngoài giáo trình (⭐, không thi FE): giảng 13 slide đầu của deck tự dựng "Linux process model in practice" — tiến trình qua ví dụ nhà bếp, chương trình khác tiến trình khác luồng, cây tiến trình với ps và pstree, nhìn vào bên trong một tiến trình đang chạy qua /proc (status, cmdline, environ, exe, cwd) kèm cảnh báo bảo mật, fork – exec – wait bằng C chạy thật, mã thoát 0, 1, 2, 126, 127, chỉ còn 8 bit, 128 + N (130, 137, 139, 143) và cái tiến trình cha thật sự nhận, zombie thật không giết nổi bằng kill -9, gặt con bằng handler SIGCHLD, tiến trình mồ côi được PID 1 nhận nuôi, và bẫy thật của container: Node làm PID 1 để zombie chất đống, sửa bằng một init 30 dòng (việc tini và docker --init làm) — mọi lệnh chạy thật trên Linux.',
  content: [
    bi(`<span class="eyebrow">⭐ Advanced 1 · Lesson CS.1 (part 1 of 2) · deck "Linux process model in practice", slides 1–13</span>
<h2>The process model you meet on every Linux server: who starts whom, how a program really starts, and what its exit code tells you</h2>
<p class="lead">This section is <strong>not</strong> in the OSG202 syllabus and is <strong>not</strong> examined in the FE — it is the bridge from the textbook to the work of a backend developer. Lessons 2.A–2.C taught you what a process is (a program in execution, with states and a PCB), and lesson 10.A showed how Linux implements it. Here we take the same ideas onto a real Linux machine — the one your Node.js or Spring Boot service runs on, usually inside Docker — and ask the questions you will actually face: which process started which? what is this process doing and with which settings? why did my container exit with code 137? why does <code>ps</code> show hundreds of <code>&lt;defunct&gt;</code> processes? The deck was built for this section (28 slides, in English); this first part covers slides 1–13, and part 2 covers signals, graceful shutdown and PID 1 in containers.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>Picture and definitions</td><td>explain process, program, thread, PID, PPID, PID 1 with an everyday picture</td></tr>
<tr><td>5–6</td><td>Process tree and /proc</td><td>read <code>ps -ef --forest</code> and <code>pstree</code>, look inside any process through <code>/proc/&lt;pid&gt;</code></td></tr>
<tr><td>7–8</td><td>fork → exec → wait</td><td>write and explain the three calls in C, run for real</td></tr>
<tr><td>9–10</td><td>Exit codes</td><td>decode 0, 1, 2, 126, 127, the 8-bit wrap and 128 + N (130, 137, 139, 143)</td></tr>
<tr><td>11–12</td><td>Zombies and orphans</td><td>create both on purpose, then reap with <code>wait</code> / <code>SIGCHLD</code></td></tr>
<tr><td>13</td><td>PID 1 in a container</td><td>see zombies pile up under a Node PID 1 and fix it with an init</td></tr>
</tbody>
</table>
<div class="callout">How to study it: open the slide image, read the explanation, then run the same commands yourself (WSL, a Linux VM or <code>docker run -it debian:12</code>). Every terminal block below is the real output of the program shown, run in a Debian 12 container (<code>osg202-lab</code>, ARM64 — on an x86-64 laptop the PIDs differ and nothing else changes). The slide images were made earlier on the same software, so their PIDs differ from the blocks; the lesson always explains the block.</div>`,
    `<span class="eyebrow">⭐ Chuyên sâu 1 · Bài CS.1 (phần 1/2) · deck "Linux process model in practice", slide 1–13</span>
<h2>Mô hình tiến trình bạn gặp trên mọi server Linux: ai khởi động ai, một chương trình thật sự bắt đầu thế nào, và mã thoát của nó nói gì</h2>
<p class="lead">Phần này <strong>không</strong> nằm trong đề cương OSG202 và <strong>không</strong> thi FE — nó là cây cầu từ giáo trình sang công việc của một dev backend. Bài 2.A–2.C dạy bạn tiến trình (process) là gì (một chương trình đang chạy, có trạng thái và PCB), bài 10.A cho thấy Linux hiện thực nó thế nào. Ở đây ta mang chính những ý đó lên một máy Linux thật — chính cái máy dịch vụ Node.js hay Spring Boot của bạn chạy trên, thường là bên trong Docker — và hỏi những câu bạn sẽ thật sự gặp: tiến trình nào khởi động tiến trình nào? tiến trình này đang làm gì, với cấu hình nào? sao container của tôi thoát với mã 137? sao <code>ps</code> hiện hàng trăm tiến trình <code>&lt;defunct&gt;</code>? Bộ slide được dựng riêng cho phần này (28 slide, tiếng Anh); phần 1 này giảng slide 1–13, phần 2 giảng tín hiệu (signal), tắt êm (graceful shutdown) và PID 1 trong container.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>Hình ảnh và định nghĩa</td><td>giải thích tiến trình, chương trình, luồng, PID, PPID, PID 1 bằng một hình ảnh đời thường</td></tr>
<tr><td>5–6</td><td>Cây tiến trình và /proc</td><td>đọc <code>ps -ef --forest</code> và <code>pstree</code>, nhìn vào bên trong mọi tiến trình qua <code>/proc/&lt;pid&gt;</code></td></tr>
<tr><td>7–8</td><td>fork → exec → wait</td><td>viết và giải thích ba lời gọi bằng C, chạy thật</td></tr>
<tr><td>9–10</td><td>Mã thoát</td><td>giải mã 0, 1, 2, 126, 127, chuyện chỉ còn 8 bit và 128 + N (130, 137, 139, 143)</td></tr>
<tr><td>11–12</td><td>Zombie và mồ côi</td><td>cố ý tạo cả hai, rồi gặt bằng <code>wait</code> / <code>SIGCHLD</code></td></tr>
<tr><td>13</td><td>PID 1 trong container</td><td>thấy zombie chất đống dưới một PID 1 là Node và sửa bằng một init</td></tr>
</tbody>
</table>
<div class="callout">Cách học: mở ảnh slide, đọc phần giảng, rồi tự chạy lại đúng các lệnh đó (WSL, máy ảo Linux hoặc <code>docker run -it debian:12</code>). Mọi khối terminal bên dưới là output thật của chính chương trình được hiện, chạy trong container Debian 12 (<code>osg202-lab</code>, ARM64 — trên laptop x86-64 số PID khác, ngoài ra không gì khác). Ảnh slide được làm trước đó trên cùng phần mềm nên PID trong ảnh khác trong khối; bài luôn giảng theo khối.</div>`),
    walkHead('cs1', 1, 13),
    walk('cs1', [
      [1, 'Linux process model in practice',
        `<p class="y-chinh">🎯 The cover: <strong>Linux process model in practice</strong> — process tree, fork / exec / wait, exit codes, signals, graceful shutdown and PID 1 in containers. Six words that explain most "my server did something strange" stories.</p>
<p>Every program that ever runs on a Linux server — your Node.js API, the JVM of a Spring Boot service, PostgreSQL, nginx, the <code>bash</code> you type into — is a <strong>process</strong>. A process is born from another process (its parent), runs, receives messages from the kernel called <strong>signals</strong>, and finally ends with a small number, its <strong>exit code</strong>, which its parent collects. That is the whole life cycle, and this deck follows it in order: who starts whom (slides 5–8), how the end is reported (9–13), how a process is asked to stop (14–19), and why all of this goes wrong in a different way when the process is the first one in a container (20–24).</p>
<p>➕ Why a backend developer needs this, with three questions you will be asked in your first job: "the container exited with 137 — what happened?" (answer: something sent SIGKILL — slide 10), "deploys cause a burst of 502 errors" (the app does not shut down gracefully — slide 17), "<code>docker stop</code> takes ten seconds every time" (the app is PID 1 and ignores SIGTERM — slide 20). None of these is visible in your source code; all of them are visible with three commands — <code>ps</code>, <code>cat /proc/…</code> and <code>echo $?</code> — which is why this deck runs everything for real.</p>
<p>🧭 On a real server: this very website runs in Docker on a VPS, and its history contains exactly these stories — a build killed with exit code 137, containers left behind after a restart race, a shutdown timer that can never fire (slide 25). You will be able to read each of them by the end.</p>
<p>➕ A little history, because it explains the shape of the API. <code>fork</code>, <code>exec</code> and <code>wait</code> date from the first years of Unix at Bell Labs (around 1970–1971, Ken Thompson and Dennis Ritchie); Ritchie later wrote that the idea of fork came from the Berkeley GENIE time-sharing system, and that splitting "create a process" from "run a program" made the shell almost trivial to write. Signals arrived in the same early versions as a crude way for the kernel and the terminal to interrupt a program. Fifty years later Linux, macOS and every container runtime still use the same model — which is why a 1970s idea decides how your 2026 Kubernetes pod shuts down.</p>
<p>What is "real" in this deck: every terminal block in this lesson is the output of a program run in the course container. The slide images were captured on the deck-building machine with the same software versions, so PIDs and a few line orders differ; three topics needed tools the course container does not have (Spring Boot, timing <code>docker stop</code>, <code>systemd-analyze</code>) and are explained from those runs.</p>`,
        `<p class="y-chinh">🎯 Trang bìa: <strong>Mô hình tiến trình Linux trong thực tế</strong> — cây tiến trình, fork / exec / wait, mã thoát, tín hiệu, tắt êm và PID 1 trong container. Sáu cụm từ giải thích phần lớn các câu chuyện "server của tôi tự nhiên làm điều lạ".</p>
<p>Mọi chương trình từng chạy trên một server Linux — API Node.js của bạn, JVM của một dịch vụ Spring Boot, PostgreSQL, nginx, chính cái <code>bash</code> bạn đang gõ — đều là một <strong>tiến trình</strong> (process). Một tiến trình được sinh ra từ một tiến trình khác (cha của nó — parent), chạy, nhận những thông điệp ngắn từ nhân gọi là <strong>tín hiệu</strong> (signal), và cuối cùng kết thúc với một con số nhỏ, <strong>mã thoát</strong> (exit code) của nó, mà tiến trình cha thu về. Đó là toàn bộ vòng đời, và bộ slide đi theo đúng thứ tự ấy: ai khởi động ai (slide 5–8), kết thúc được báo thế nào (9–13), làm sao yêu cầu một tiến trình dừng (14–19), và vì sao mọi thứ hỏng theo một kiểu khác hẳn khi tiến trình là tiến trình đầu tiên trong container (20–24).</p>
<p>➕ Vì sao dev backend cần phần này — ba câu hỏi bạn sẽ bị hỏi ngay trong công việc đầu tiên: "container thoát với mã 137 — chuyện gì xảy ra?" (đáp: có thứ gì đó gửi SIGKILL — slide 10), "cứ deploy là có một loạt lỗi 502" (ứng dụng không tắt êm — slide 17), "<code>docker stop</code> lần nào cũng mất mười giây" (ứng dụng là PID 1 và lờ SIGTERM — slide 20). Không cái nào nhìn thấy trong mã nguồn của bạn; cái nào cũng nhìn thấy bằng ba lệnh — <code>ps</code>, <code>cat /proc/…</code> và <code>echo $?</code> — vì vậy bộ slide này chạy thật mọi thứ.</p>
<p>🧭 Trên server thật: chính website này chạy bằng Docker trên một VPS, và lịch sử của nó có đúng những câu chuyện này — một lần build bị giết với mã thoát 137, container bị bỏ lại sau một cuộc đua khi khởi động lại, một hẹn giờ tắt máy không bao giờ kịp chạy (slide 25). Học xong bạn sẽ đọc được từng câu chuyện.</p>
<p>➕ Một chút lịch sử, vì nó giải thích hình dáng của API. <code>fork</code>, <code>exec</code> và <code>wait</code> có từ những năm đầu của Unix ở Bell Labs (khoảng 1970–1971, Ken Thompson và Dennis Ritchie); về sau Ritchie viết rằng ý tưởng fork đến từ hệ chia sẻ thời gian GENIE của Berkeley, và việc tách "tạo tiến trình" khỏi "chạy chương trình" khiến viết shell trở nên gần như đơn giản. Tín hiệu xuất hiện trong cùng các phiên bản đầu đó như một cách thô sơ để nhân và terminal ngắt một chương trình. Năm mươi năm sau, Linux, macOS và mọi runtime container vẫn dùng đúng mô hình ấy — vì vậy một ý tưởng của thập niên 1970 quyết định cách pod Kubernetes năm 2026 của bạn tắt máy.</p>
<p>Cái gì là "thật" trong bộ slide này: mọi khối terminal trong bài là output của một chương trình chạy trong container của môn học. Ảnh slide được chụp trên máy dựng bộ slide với cùng phiên bản phần mềm, nên PID và vài thứ tự dòng khác đi; ba chủ đề cần công cụ mà container của môn học không có (Spring Boot, bấm giờ <code>docker stop</code>, <code>systemd-analyze</code>) và được giải thích dựa trên các lần chạy đó.</p>`],
      [2, 'What you will get from this lesson',
        `<p class="y-chinh">🎯 Six outcomes: read a process tree and <code>/proc</code>; explain fork → exec → wait; decode any exit code including 128 + N; create and fix zombies and orphans; handle signals and shut down gracefully in bash, C, Node.js, Java and Spring Boot; explain — and fix with one flag — why a container takes 10 s to stop.</p>
<p>The blue box on the slide states the deal of this section: the school slides (lessons 2.A–2.C, 10.A) taught <em>what</em> a process is; this deck shows what you meet on a real Linux server and in Docker. Each outcome is tied to something you can check with a command, not just a definition — you will know you have learned slide 10 when you can look at <code>Exited (137)</code> in <code>docker ps -a</code> and say who sent which signal.</p>
<p>➕ Where each outcome comes back later in the course: <code>/proc/&lt;pid&gt;/fd</code> and the file-descriptor table are the start of CS.2; thread pools and the event loop (CS.3) are threads <em>inside</em> the processes of this deck; the OOM killer of CS.5 is one more sender of SIGKILL and exit code 137; namespaces and cgroups (CS.6) are what make "PID 1 in a container" possible — slide 13 already uses a PID namespace to rebuild a container by hand.</p>
<p>A word about the versions: the outputs were produced on Debian 12 with kernel 7.0, Node.js 22.23, Java 21.0.12 and Spring Boot 4.1.2. The behaviour shown is stable across years of Linux (fork, wait and signals are older than you are); the version numbers matter only for the defaults of Spring Boot and Docker, which the slides name explicitly.</p>
<p class="meo">🧠 Keep a terminal open next to this page. Reading about signals is like reading about swimming; sending your first <code>kill -TERM</code> and watching a handler run is what makes it stick.</p>
<p>➕ Before you start — a two-minute self-test. Decide true or false, then check the slide in brackets: (a) <code>kill</code> always kills a process (false — slide 14). (b) A process that exited still appears in <code>ps</code> until its parent waits (true — slide 11). (c) Exit code 137 means the container ran out of memory (not necessarily — slide 10). (d) <code>docker stop</code> sends SIGKILL immediately (false — SIGTERM, then SIGKILL after a grace period, slide 17). (e) A Node app with <code>process.on('SIGTERM')</code> always shuts down gracefully in Docker (false — depends on who is PID 1, slides 20–22). If you got all five, skim to slide 13; if not, this deck is exactly for you.</p>
<p>➕ Prerequisites and the path through the section: you need the shell basics of lesson 10.A (or the Linux &amp; Bash course) and enough C to read a <code>for</code> loop and a <code>printf</code>; every program is short and commented in both languages. The eight decks are meant in order — CS.1 processes, CS.2 file descriptors, CS.3 threads and the event loop, CS.4 epoll, CS.5 memory, CS.6 containers, CS.7 performance tools, CS.8 interview and capstone lab — and each ends with exercises whose solutions were run for real, then a 10-question quiz.</p>`,
        `<p class="y-chinh">🎯 Sáu kết quả: đọc được cây tiến trình và <code>/proc</code>; giải thích fork → exec → wait; giải mã mọi mã thoát kể cả 128 + N; tạo và sửa zombie, tiến trình mồ côi (orphan); xử lý tín hiệu và tắt êm trong bash, C, Node.js, Java và Spring Boot; giải thích — và sửa bằng một cờ — vì sao container mất 10 giây mới dừng.</p>
<p>Ô xanh trên slide nói rõ giao kèo của phần này: slide của trường (bài 2.A–2.C, 10.A) dạy tiến trình <em>là gì</em>; bộ slide này cho thấy bạn gặp gì trên một server Linux thật và trong Docker. Mỗi kết quả gắn với một thứ kiểm được bằng lệnh, không chỉ là một định nghĩa — bạn biết mình đã học xong slide 10 khi nhìn thấy <code>Exited (137)</code> trong <code>docker ps -a</code> và nói được ai đã gửi tín hiệu nào.</p>
<p>➕ Mỗi kết quả còn quay lại ở đâu trong môn: <code>/proc/&lt;pid&gt;/fd</code> và bảng mô tả tệp (file descriptor) là điểm bắt đầu của CS.2; thread pool và event loop (CS.3) là các luồng <em>bên trong</em> những tiến trình của bộ slide này; OOM killer của CS.5 là thêm một kẻ gửi SIGKILL và mã thoát 137; namespace và cgroup (CS.6) là thứ làm nên "PID 1 trong container" — slide 13 đã dùng một PID namespace để tự tay dựng lại một container.</p>
<p>Một lời về phiên bản: output được tạo trên Debian 12 với nhân 7.0, Node.js 22.23, Java 21.0.12 và Spring Boot 4.1.2. Hành vi được trình bày ổn định qua nhiều năm Linux (fork, wait và tín hiệu còn nhiều tuổi hơn bạn); số phiên bản chỉ quan trọng với giá trị mặc định của Spring Boot và Docker, và slide gọi tên chúng rõ ràng.</p>
<p class="meo">🧠 Mở sẵn một terminal cạnh trang này. Đọc về tín hiệu giống như đọc về bơi lội; tự gửi lệnh <code>kill -TERM</code> đầu tiên và nhìn một handler chạy mới làm bạn nhớ lâu.</p>
<p>➕ Trước khi bắt đầu — tự kiểm tra hai phút. Chọn đúng hay sai, rồi xem slide trong ngoặc: (a) <code>kill</code> luôn giết tiến trình (sai — slide 14). (b) Một tiến trình đã thoát vẫn hiện trong <code>ps</code> cho tới khi cha của nó gọi wait (đúng — slide 11). (c) Mã thoát 137 nghĩa là container hết bộ nhớ (chưa chắc — slide 10). (d) <code>docker stop</code> gửi SIGKILL ngay lập tức (sai — SIGTERM trước, SIGKILL sau thời gian ân hạn, slide 17). (e) Ứng dụng Node có <code>process.on('SIGTERM')</code> luôn tắt êm trong Docker (sai — còn tuỳ ai là PID 1, slide 20–22). Đúng cả năm thì đọc lướt tới slide 13; chưa thì bộ slide này dành đúng cho bạn.</p>
<p>➕ Kiến thức cần có và lộ trình qua phần này: bạn cần phần shell cơ bản của bài 10.A (hoặc khoá Linux &amp; Bash) và đủ C để đọc một vòng <code>for</code> và một lệnh <code>printf</code>; mọi chương trình đều ngắn và có chú thích hai thứ tiếng. Tám bộ slide nên học theo thứ tự — CS.1 tiến trình, CS.2 file descriptor, CS.3 luồng và event loop, CS.4 epoll, CS.5 bộ nhớ, CS.6 container, CS.7 công cụ đo hiệu năng, CS.8 phỏng vấn và lab tổng hợp — và mỗi bộ kết thúc bằng bài tập có lời giải đã chạy thật, rồi một quiz 10 câu.</p>`],
      [3, 'First, a picture: a restaurant kitchen',
        `<p class="y-chinh">🎯 An everyday picture first, definitions after: a head chef (parent process) clones herself into a helper (<code>fork()</code>), hands the helper a new recipe card (<code>exec()</code>), waits for the dish and reads the report (<code>wait()</code> → exit code). A finished helper whose report nobody reads is a <strong>zombie</strong>; helpers whose chef left are adopted by the manager (<strong>orphan</strong> → PID 1). The fire alarm is <strong>SIGTERM</strong>; the power cut is <strong>SIGKILL</strong>.</p>
<p>Read the table row by row, because each row is one slide later on. The strange part is row two: in Linux a new process is not created "empty" — the parent makes an exact copy of itself, and the copy then <em>replaces</em> its own program with a new one. It sounds wasteful (why copy, then throw away?) but it gives the copy a moment, between the two steps, to rearrange its own surroundings: change folder, redirect its output to a file, drop privileges. Every <code>cmd &gt; out.txt</code> you have typed in a shell relies on that moment (slide 8).</p>
<p>The last two rows are the difference between a polite and an impolite stop. On a fire alarm a good cook finishes plating the dish in hand and switches the stoves off before leaving — a process that receives SIGTERM can run a <em>handler</em> and clean up. A power cut gives no chance at all — SIGKILL cannot be caught, and whatever was half done stays half done (a lock file, a half-written upload, an open database transaction).</p>
<p>➕ Where the picture breaks: a real chef can refuse the fire alarm and keep cooking; a process can also ignore SIGTERM — and in a container that is exactly the bug of slide 20. And the "manager" is not a person but a process: PID 1, which on a normal server is <code>systemd</code> and in a container is whatever program you start.</p>
<p class="meo">🧠 Five words to remember the whole lesson: <em>clone, recipe, report, zombie, alarm</em> — fork, exec, wait/exit code, zombie, SIGTERM.</p>
<p>➕ Two more rows the table leaves out. <strong>Threads</strong> are several cooks working at the <em>same</em> counter with the same ingredients — fast to coordinate, but they can bump into each other (race conditions, CS.3); <strong>processes</strong> are separate kitchens — nothing shared unless you build a pass-through window (a pipe or a socket, CS.2). And <strong>the restaurant manager</strong> who adopts orphaned helpers and must sign their final reports is a real job with real duties: if the manager never signs, the reports pile up on the desk (zombies under a bad PID 1, slide 13). Try the picture on your own project: in a Node API behind nginx in Docker, who is the head chef, who are the helpers, who is the manager?</p>`,
        `<p class="y-chinh">🎯 Hình ảnh đời thường trước, định nghĩa sau: bếp trưởng (tiến trình cha) tự nhân bản thành một phụ bếp (<code>fork()</code>), đưa cho phụ bếp một thẻ công thức mới (<code>exec()</code>), chờ món ăn và đọc bản báo cáo (<code>wait()</code> → mã thoát). Phụ bếp đã xong việc mà không ai đọc báo cáo là một <strong>zombie</strong>; phụ bếp có bếp trưởng bỏ đi thì được quản lý nhận về (<strong>mồ côi</strong> — orphan → PID 1). Chuông báo cháy là <strong>SIGTERM</strong>; cúp điện là <strong>SIGKILL</strong>.</p>
<p>Đọc bảng từng dòng, vì mỗi dòng sẽ là một slide về sau. Chỗ lạ nằm ở dòng hai: trong Linux một tiến trình mới không được tạo ra "trống trơn" — cha tạo một bản sao y hệt chính mình, rồi bản sao đó <em>thay</em> chương trình của nó bằng một chương trình mới. Nghe có vẻ phí (sao chép rồi vứt đi để làm gì?) nhưng nó cho bản sao một khoảnh khắc, giữa hai bước, để tự sắp xếp lại môi trường của mình: đổi thư mục, chuyển hướng (redirect) output vào tệp, bỏ bớt quyền. Mọi lần bạn gõ <code>cmd &gt; out.txt</code> trong shell đều dựa vào khoảnh khắc ấy (slide 8).</p>
<p>Hai dòng cuối là khác biệt giữa dừng lịch sự và dừng bất lịch sự. Khi chuông báo cháy reo, một đầu bếp giỏi bày nốt đĩa đang làm và tắt bếp rồi mới rời đi — tiến trình nhận SIGTERM có thể chạy một <em>handler</em> (hàm xử lý tín hiệu) và dọn dẹp. Cúp điện thì không có cơ hội nào — SIGKILL không bắt được, việc gì đang dở thì nằm dở (một tệp khoá, một lần tải lên ghi được nửa, một giao dịch cơ sở dữ liệu còn mở).</p>
<p>➕ Chỗ hình ảnh không khớp: một đầu bếp thật có thể lờ chuông báo cháy mà nấu tiếp; một tiến trình cũng có thể lờ SIGTERM — và trong container đó chính là lỗi của slide 20. Còn "quản lý" không phải là người mà là một tiến trình: PID 1, trên server bình thường là <code>systemd</code>, trong container là bất kỳ chương trình nào bạn khởi động.</p>
<p class="meo">🧠 Năm chữ để nhớ cả bài: <em>nhân bản, công thức, báo cáo, zombie, chuông</em> — fork, exec, wait/mã thoát, zombie, SIGTERM.</p>
<p>➕ Hai dòng nữa mà bảng bỏ ngoài. <strong>Luồng</strong> là nhiều đầu bếp làm việc ở <em>cùng</em> một bàn bếp với cùng nguyên liệu — phối hợp nhanh, nhưng có thể va vào nhau (tranh chấp — race condition, CS.3); <strong>tiến trình</strong> là các căn bếp tách biệt — không dùng chung gì trừ khi bạn trổ một ô cửa chuyển món (một ống — pipe — hay một socket, CS.2). Còn <strong>người quản lý nhà hàng</strong> nhận nuôi các phụ bếp mồ côi và phải ký báo cáo cuối của họ là một việc thật với bổn phận thật: nếu quản lý không bao giờ ký, báo cáo chất đống trên bàn (zombie dưới một PID 1 tồi, slide 13). Thử áp hình ảnh này vào dự án của bạn: với một API Node đứng sau nginx trong Docker, ai là bếp trưởng, ai là phụ bếp, ai là quản lý?</p>`],
      [4, 'Program, process, thread — the definitions',
        `<p class="y-chinh">🎯 A <strong>program</strong> is a file on disk; a <strong>process</strong> is a running instance of it, with its own virtual memory, open files (file descriptors), a state and a number — the <strong>PID</strong>; a <strong>thread</strong> is a worker inside a process that shares its memory. Every process also records its parent's number, the <strong>PPID</strong>, and the first process of the system is <strong>PID 1</strong>.</p>
<p>The diagram makes the difference visible: one file, <code>/usr/local/bin/node</code>, started three times, gives three processes — PID 9 running <code>app.js</code>, PID 31 running <code>worker.js</code>, PID 52 running <code>app.js</code> again. They share nothing but the file they were loaded from: a variable changed in PID 9 does not change in PID 52, a crash of one does not kill the others. That separation is the main service an OS gives (lesson 2.A: "the process model"), and it is why a production server runs several copies of the same app — PM2 cluster mode, several containers behind nginx, several pods in Kubernetes.</p>
<p>Threads are the opposite: they live <em>inside</em> one process and share its memory. The surprising line of the slide is "Node shows 7 even for single-threaded JS": your JavaScript runs on one thread, but the Node process also holds V8's helper threads (the garbage collector, the compiler) and — once used — libuv's thread pool of four. Slide 5 shows the seven threads for real; CS.3 explains each one.</p>
<p>➕ Three numbers worth knowing by heart: PID 1 is the ancestor of every process; a PPID of 0 means "started by the kernel itself" (only PID 1 and the kernel threads under PID 2 have it); on Linux a thread also has its own number (TID) taken from the same counter as PIDs — that is why <code>pstree</code> shows numbers in braces for threads. The kernel calls both "tasks".</p>
<p class="pitfall">⚠️ FE wording (FE2#6): "A process that creates another process is called the <strong>parent process</strong>" — not the root process, not the init process. Init is only the parent of the first generation and of orphans.</p>
<p>➕ Proof that processes of the same program share nothing: one global variable, three children that each write a different value into it, and the parent looking afterwards:</p>
<pre><code class="language-c">// Slide 4: one program, several processes — the same variable at the SAME virtual address holds DIFFERENT values
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int counter = 0;                                     // one global variable

int main(void) {
    for (int i = 1; i &lt;= 3; i++) {
        if (fork() == 0) {                           // each child: its own copy
            counter = i * 100;
            printf("child  %d: &amp;counter = %p, counter = %d\\n", getpid(), (void *)&amp;counter, counter);
            return 0;
        }
        wait(NULL);                                  // one child at a time: same order every run
    }
    printf("parent %d: &amp;counter = %p, counter = %d  (unchanged)\\n", getpid(), (void *)&amp;counter, counter);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ban-sao-rieng.c -o ban-sao-rieng &amp;&amp; ./ban-sao-rieng<br>
child &nbsp;13: &amp;counter = 0xaaaad2050054, counter = 100<br>
child &nbsp;14: &amp;counter = 0xaaaad2050054, counter = 200<br>
child &nbsp;15: &amp;counter = 0xaaaad2050054, counter = 300<br>
parent 12: &amp;counter = 0xaaaad2050054, counter = 0 &nbsp;(unchanged)</div>
<p>All four processes print the <strong>same address</strong> for <code>counter</code> and yet see <strong>different values</strong> — and the parent still sees 0. The address is a <em>virtual</em> address: each process has its own page table, so the same number points to different physical memory in each (lesson 3.A; CS.5 measures it). That is the isolation the slide talks about, made visible.</p>`,
        `<p class="y-chinh">🎯 <strong>Chương trình</strong> (program) là một tệp trên đĩa; <strong>tiến trình</strong> (process) là một lần chạy của nó, có bộ nhớ ảo riêng, các tệp đang mở (file descriptor), một trạng thái và một con số — <strong>PID</strong> (process ID, mã tiến trình); <strong>luồng</strong> (thread) là một "công nhân" bên trong tiến trình, dùng chung bộ nhớ của nó. Mỗi tiến trình còn ghi số của cha nó, <strong>PPID</strong> (parent PID), và tiến trình đầu tiên của hệ thống là <strong>PID 1</strong>.</p>
<p>Sơ đồ làm khác biệt hiện ra: một tệp, <code>/usr/local/bin/node</code>, khởi động ba lần, cho ba tiến trình — PID 9 chạy <code>app.js</code>, PID 31 chạy <code>worker.js</code>, PID 52 chạy lại <code>app.js</code>. Chúng không dùng chung gì ngoài cái tệp chúng được nạp từ đó: một biến đổi trong PID 9 không đổi trong PID 52, một tiến trình sập không kéo các tiến trình kia sập theo. Sự tách biệt đó là dịch vụ chính mà hệ điều hành cung cấp (bài 2.A: "mô hình tiến trình"), và là lý do một server production chạy nhiều bản của cùng một ứng dụng — chế độ cluster của PM2, nhiều container sau nginx, nhiều pod trong Kubernetes.</p>
<p>Luồng thì ngược lại: chúng sống <em>bên trong</em> một tiến trình và dùng chung bộ nhớ của nó. Dòng gây bất ngờ trên slide là "Node hiện 7 luồng dù JavaScript đơn luồng": JavaScript của bạn chạy trên một luồng, nhưng tiến trình Node còn giữ các luồng phụ của V8 (bộ dọn rác — garbage collector, trình biên dịch) và — khi đã dùng tới — thread pool bốn luồng của libuv. Slide 5 cho thấy bảy luồng thật; CS.3 giải thích từng cái.</p>
<p>➕ Ba con số nên thuộc: PID 1 là tổ tiên của mọi tiến trình; PPID bằng 0 nghĩa là "do chính nhân khởi động" (chỉ PID 1 và các luồng nhân dưới PID 2 có); trên Linux một luồng cũng có số riêng (TID) lấy từ cùng bộ đếm với PID — vì thế <code>pstree</code> hiện số trong ngoặc nhọn cho các luồng. Nhân gọi chung cả hai là "task".</p>
<p class="pitfall">⚠️ Cách hỏi của FE (FE2#6): "Tiến trình tạo ra một tiến trình khác được gọi là <strong>parent process</strong>" (tiến trình cha) — không phải root process, không phải init process. Init chỉ là cha của thế hệ đầu tiên và của các tiến trình mồ côi.</p>
<p>➕ Bằng chứng rằng các tiến trình của cùng một chương trình không dùng chung gì: một biến toàn cục, ba tiến trình con mỗi con ghi vào đó một giá trị khác, và tiến trình cha nhìn lại sau đó:</p>
<pre><code class="language-c">// Slide 4: một chương trình, nhiều tiến trình — cùng một biến ở CÙNG địa chỉ ảo mà giữ giá trị KHÁC nhau
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int counter = 0;                                     // một biến toàn cục

int main(void) {
    for (int i = 1; i &lt;= 3; i++) {
        if (fork() == 0) {                           // mỗi con: một bản sao riêng
            counter = i * 100;
            printf("child  %d: &amp;counter = %p, counter = %d\\n", getpid(), (void *)&amp;counter, counter);
            return 0;
        }
        wait(NULL);                                  // từng con một: thứ tự giống nhau mọi lần chạy
    }
    printf("parent %d: &amp;counter = %p, counter = %d  (unchanged)\\n", getpid(), (void *)&amp;counter, counter);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ban-sao-rieng.c -o ban-sao-rieng &amp;&amp; ./ban-sao-rieng<br>
child &nbsp;13: &amp;counter = 0xaaaad2050054, counter = 100<br>
child &nbsp;14: &amp;counter = 0xaaaad2050054, counter = 200<br>
child &nbsp;15: &amp;counter = 0xaaaad2050054, counter = 300<br>
parent 12: &amp;counter = 0xaaaad2050054, counter = 0 &nbsp;(unchanged)</div>
<p>Cả bốn tiến trình in <strong>cùng một địa chỉ</strong> cho <code>counter</code> mà lại thấy <strong>giá trị khác nhau</strong> — và cha vẫn thấy 0. Địa chỉ đó là địa chỉ <em>ảo</em> (virtual address): mỗi tiến trình có bảng trang (page table) riêng, nên cùng một con số trỏ tới vùng bộ nhớ vật lý khác nhau trong mỗi tiến trình (bài 3.A; CS.5 đo thật). Đó chính là sự tách biệt mà slide nói tới, được làm cho nhìn thấy.</p>`],
      [5, 'The process tree: every process has a parent',
        `<p class="y-chinh">🎯 Every process has exactly one parent, recorded as its <strong>PPID</strong>; follow the PPIDs upwards and you always reach <strong>PID 1</strong>. <code>ps -ef --forest</code> and <code>pstree -p</code> draw the family tree; names in <code>{braces}</code> in <code>pstree</code> are threads, not processes.</p>
<p>The slide shows a tree captured while the deck was being made; here is the same experiment run again in the course container. A tiny Node.js "server" is started in the background, then a subshell that starts two <code>sleep</code> processes and waits for them, and then we look:</p>
<div class="out"># Slide 5: a small "server" and a few children, seen as a tree<br>
$ echo "require('http').createServer((q, r) =&gt; r.end('ok')).listen(3000)" &gt; app.js<br>
$ PORT=3000 APP_ENV=demo node app.js &amp; N=$!<br>
$ ( sleep 300 &amp; sleep 300 &amp; wait ) &amp; sleep 0.5<br>
$ ps -eo pid,ppid,stat,cmd --forest<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT CMD<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 Ss &nbsp;&nbsp;bash /usr/local/bin/phien cay-tien-trinh.sh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Sl &nbsp;&nbsp;node app.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 S &nbsp;&nbsp;&nbsp;bash /usr/local/bin/phien cay-tien-trinh.sh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 S &nbsp;&nbsp;&nbsp;&nbsp;\\_ sleep 300<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 S &nbsp;&nbsp;&nbsp;&nbsp;\\_ sleep 300<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 R &nbsp;&nbsp;&nbsp;ps -eo pid,ppid,stat,cmd --forest<br>
$ pstree -p 1<br>
bash(1)-+-bash(13)-+-sleep(15)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#96;-sleep(16)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-node(10)-+-{node}(17)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(18)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(19)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(20)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(21)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#96;-{node}(22)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#96;-pstree(28)</div>
<p>How to read it, column by column. <strong>PID</strong> is the process number, handed out in increasing order (that is why the PIDs are small: the container was created a second ago, and PID 1 is the <code>bash</code> that runs this session). <strong>PPID</strong> is the parent: <code>node</code> and the subshell both have PPID 1, because the session's shell started them; the two <code>sleep</code>s have the subshell as their parent, and <code>--forest</code> draws that with <code>\\_</code>. <strong>STAT</strong> is the state letter of lesson 2.A's process-state diagram in Linux spelling: <code>S</code> sleeping (waiting for an event — here a network connection or a timer), <code>R</code> running (only <code>ps</code> itself, which is the one using the CPU while it takes the picture), and the extra letters <code>s</code> (session leader) and <code>l</code> (multi-threaded). Notice that <code>ps</code> appears in its own picture: it is a process like any other, child of the shell.</p>
<p>In the <code>pstree</code> drawing the six <code>{node}(…)</code> entries are the threads of PID <code>node</code> (seven threads in total, counting the main one). They have their own numbers taken from the same counter as PIDs — Linux calls processes and threads both "tasks" and only marks threads as sharing memory with their group leader (lesson 10.A, slide 15, the <code>clone</code> call).</p>
<p>➕ On a VM or a laptop the root of the tree is <strong>systemd</strong>, with dozens of services under it (<code>sshd</code>, <code>dockerd</code>, <code>postgres</code>…); your login shell sits several levels down: systemd → sshd → sshd (your session) → bash. In a container the root is the program in <code>CMD</code>/<code>ENTRYPOINT</code> — this one tiny difference drives slides 13 and 20. Useful variations: <code>ps -o pid,ppid,stat,etime,cmd -p 10</code> (one process, with elapsed time), <code>pstree -ps 15</code> (the ancestry of one process up to PID 1), <code>ps -eLf</code> (one line per thread), <code>pgrep -a node</code> (find by name).</p>
<p>🧭 On a real server: "which process started this?" is the first question when something unknown eats your CPU. <code>pstree -ps &lt;pid&gt;</code> answers it in one line — a <code>node</code> under <code>pm2</code>, a <code>java</code> under <code>containerd-shim</code> (a container), a <code>python</code> under <code>cron</code> (a scheduled job somebody forgot).</p>
<p class="meo">🧠 PPID chain = family tree; <code>--forest</code> and <code>pstree</code> just draw it. If the tree looks flat (everything under PID 1), its parents have died and the processes were adopted — slide 12.</p>`,
        `<p class="y-chinh">🎯 Mỗi tiến trình có đúng một cha, ghi trong cột <strong>PPID</strong>; lần theo PPID lên trên bạn luôn tới <strong>PID 1</strong>. <code>ps -ef --forest</code> và <code>pstree -p</code> vẽ ra cây gia phả; các tên trong <code>{ngoặc nhọn}</code> của <code>pstree</code> là luồng (thread), không phải tiến trình.</p>
<p>Slide cho thấy một cây chụp lúc dựng bộ slide; đây là cùng thí nghiệm đó chạy lại trong container của môn học. Một "server" Node.js nhỏ được khởi động ở chế độ nền (background), rồi một subshell khởi động hai tiến trình <code>sleep</code> và chờ chúng, rồi ta nhìn:</p>
<div class="out"># Slide 5: một "server" nhỏ và vài tiến trình con, nhìn dạng cây<br>
$ echo "require('http').createServer((q, r) =&gt; r.end('ok')).listen(3000)" &gt; app.js<br>
$ PORT=3000 APP_ENV=demo node app.js &amp; N=$!<br>
$ ( sleep 300 &amp; sleep 300 &amp; wait ) &amp; sleep 0.5<br>
$ ps -eo pid,ppid,stat,cmd --forest<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT CMD<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 Ss &nbsp;&nbsp;bash /usr/local/bin/phien cay-tien-trinh.sh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Sl &nbsp;&nbsp;node app.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 S &nbsp;&nbsp;&nbsp;bash /usr/local/bin/phien cay-tien-trinh.sh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 S &nbsp;&nbsp;&nbsp;&nbsp;\\_ sleep 300<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 S &nbsp;&nbsp;&nbsp;&nbsp;\\_ sleep 300<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 R &nbsp;&nbsp;&nbsp;ps -eo pid,ppid,stat,cmd --forest<br>
$ pstree -p 1<br>
bash(1)-+-bash(13)-+-sleep(15)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#96;-sleep(16)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-node(10)-+-{node}(17)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(18)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(19)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(20)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(21)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#96;-{node}(22)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#96;-pstree(28)</div>
<p>Cách đọc, từng cột. <strong>PID</strong> là số tiến trình, cấp theo thứ tự tăng dần (vì thế các PID đều nhỏ: container mới được tạo một giây trước, và PID 1 là <code>bash</code> chạy phiên này). <strong>PPID</strong> là cha: <code>node</code> và subshell đều có PPID 1, vì shell của phiên khởi động chúng; hai <code>sleep</code> có cha là subshell, và <code>--forest</code> vẽ quan hệ đó bằng <code>\\_</code>. <strong>STAT</strong> là chữ cái trạng thái của sơ đồ trạng thái tiến trình ở bài 2.A theo cách viết của Linux: <code>S</code> đang ngủ (sleeping — chờ một sự kiện, ở đây là một kết nối mạng hay một bộ hẹn giờ), <code>R</code> đang chạy (running — chỉ có chính <code>ps</code>, tiến trình đang dùng CPU lúc chụp ảnh), và các chữ phụ <code>s</code> (trưởng phiên — session leader) và <code>l</code> (nhiều luồng). Để ý <code>ps</code> xuất hiện trong chính bức ảnh của nó: nó cũng là một tiến trình như mọi tiến trình khác, con của shell.</p>
<p>Trong hình vẽ của <code>pstree</code>, sáu mục <code>{node}(…)</code> là các luồng của tiến trình <code>node</code> (tổng cộng bảy luồng, tính cả luồng chính). Chúng có số riêng lấy từ cùng bộ đếm với PID — Linux gọi cả tiến trình lẫn luồng là "task" và chỉ đánh dấu luồng là dùng chung bộ nhớ với trưởng nhóm của nó (bài 10.A, slide 15, lời gọi <code>clone</code>).</p>
<p>➕ Trên máy ảo hay laptop, gốc của cây là <strong>systemd</strong>, dưới nó là hàng chục dịch vụ (<code>sshd</code>, <code>dockerd</code>, <code>postgres</code>…); shell đăng nhập của bạn nằm sâu vài tầng: systemd → sshd → sshd (phiên của bạn) → bash. Trong container gốc là chương trình trong <code>CMD</code>/<code>ENTRYPOINT</code> — chính khác biệt nhỏ này dẫn tới slide 13 và 20. Vài biến thể hữu ích: <code>ps -o pid,ppid,stat,etime,cmd -p 10</code> (một tiến trình, kèm thời gian đã chạy), <code>pstree -ps 15</code> (dòng tổ tiên của một tiến trình tới tận PID 1), <code>ps -eLf</code> (mỗi luồng một dòng), <code>pgrep -a node</code> (tìm theo tên).</p>
<p>🧭 Trên server thật: "tiến trình này do ai khởi động?" là câu hỏi đầu tiên khi một thứ lạ ngốn CPU của bạn. <code>pstree -ps &lt;pid&gt;</code> trả lời trong một dòng — một <code>node</code> dưới <code>pm2</code>, một <code>java</code> dưới <code>containerd-shim</code> (tức là trong container), một <code>python</code> dưới <code>cron</code> (một tác vụ định kỳ ai đó đã quên).</p>
<p class="meo">🧠 Chuỗi PPID = cây gia phả; <code>--forest</code> và <code>pstree</code> chỉ vẽ nó ra. Nếu cây trông phẳng (mọi thứ nằm thẳng dưới PID 1), cha của chúng đã chết và chúng được nhận nuôi — slide 12.</p>`],
      [6, '/proc/pid: look inside a running process',
        `<p class="y-chinh">🎯 <code>/proc/&lt;pid&gt;/</code> is a window into a running process, generated by the kernel when you read it: <strong>status</strong> (state, parent, memory, threads), <strong>cmdline</strong> and <strong>environ</strong> (arguments and environment, separated by <code>\\0</code>), <strong>exe</strong> and <strong>cwd</strong> (which binary, which folder), <strong>fd/</strong> (open files). The security box: anyone can read your command line; the environment is readable by the same user and root.</p>
<p>Nothing under <code>/proc</code> is stored on disk — <code>ls -l</code> shows size 0 for most files — the kernel builds the text at the moment you <code>cat</code> it, from its own data structures (the process descriptor of lesson 10.A, slides 13–14). Run for real, with a Node "server" started with an environment variable that should be secret:</p>
<div class="out"># Slide 6: look inside a running process through /proc<br>
$ echo "require('http').createServer((q, r) =&gt; r.end('ok')).listen(3000)" &gt; app.js<br>
$ PORT=3000 DB_PASSWORD=s3cret node --max-old-space-size=256 app.js &amp; N=$!; sleep 0.5<br>
$ grep -E '^(Name|State|Pid|PPid|Uid|Threads|VmRSS)' /proc/$N/status<br>
Name:	node<br>
State:	S (sleeping)<br>
Pid:	11<br>
PPid:	1<br>
Uid:	0	0	0	0<br>
VmRSS:	 &nbsp;&nbsp;45384 kB<br>
Threads:	7<br>
$ tr '\\0' ' ' &lt; /proc/$N/cmdline; echo<br>
node --max-old-space-size=256 app.js<br>
$ tr '\\0' '\\n' &lt; /proc/$N/environ | grep -E '^(PORT|DB_PASSWORD)='<br>
PORT=3000<br>
DB_PASSWORD=s3cret<br>
$ readlink /proc/$N/exe /proc/$N/cwd<br>
/usr/local/bin/node<br>
/w<br>
$ ls /proc/$N/fd | wc -l<br>
19<br>
# now another user (sv, uid 1000) looks at the same root process: the command line is public, the environment is not<br>
$ runuser -u sv -- sh -c "id -un; tr '\\0' ' ' &lt; /proc/$N/cmdline; echo"<br>
sv<br>
node --max-old-space-size=256 app.js<br>
$ runuser -u sv -- cat /proc/$N/environ<br>
cat: /proc/11/environ: Permission denied<br>
$ runuser -u sv -- ps -o user,pid,args -p $N<br>
USER &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PID COMMAND<br>
root &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 node --max-old-space-size=256 app.js<br>
$ kill $N</div>
<p>Line by line: <code>status</code> gives the state (<code>S</code>, waiting for connections), the parent, the owner (<code>Uid</code> four times: real, effective, saved, filesystem — all root here), the memory actually in RAM (<strong>VmRSS</strong>, about 45 MB for an empty Node — CS.5 explains RSS vs virtual size) and 7 threads. <code>cmdline</code> is the exact argument vector — note that <code>--max-old-space-size=256</code> sits <em>before</em> <code>app.js</code>, so it is a flag for Node, not for your script. <code>environ</code> shows the variables the process was <em>started</em> with — including the "secret". <code>exe</code> is the real binary even if the file was replaced later (it still points to the old inode, marked "(deleted)" — a classic sign that a service was not restarted after an upgrade). <code>fd/</code> has 19 entries: stdin/stdout/stderr, the listening socket, and the internal pipes and epoll descriptor of libuv (CS.2 and CS.4).</p>
<p>Then the important part: another user, <code>sv</code>, looks at the same root-owned process. The command line is readable — it is what <code>ps</code> shows to everybody — but <code>environ</code> says <strong>Permission denied</strong>. That is the rule of the slide: <em>cmdline is public, environ is private to the same user (and root)</em>.</p>
<p>➕ Two practical consequences. (1) Never put a password on a command line (<code>mysql -pS3cret</code>, <code>curl -u user:pass</code>, <code>node app.js --db-password=…</code>): every user on the machine, and every monitoring agent, can read it with <code>ps</code>. Use an environment variable or a file with mode 600. (2) Environment variables are not "safe" either — any process running as the same user, a crash dump, <code>docker inspect</code>, or a debug endpoint that prints <code>process.env</code> exposes them. Treat them as "not in the source code", not as "secret". (3) <code>environ</code> shows the environment <em>at start</em>: a Node app that sets <code>process.env.X</code> later does not change this file.</p>
<p class="pitfall">⚠️ <code>tr '\\0' ' '</code> is needed because arguments are separated by NUL bytes; <code>cat /proc/&lt;pid&gt;/cmdline</code> prints them glued together (<code>node--max-old-space-size=256app.js</code>) and people conclude the flag was never passed.</p>`,
        `<p class="y-chinh">🎯 <code>/proc/&lt;pid&gt;/</code> là một cửa sổ nhìn vào tiến trình đang chạy, do nhân sinh ra lúc bạn đọc: <strong>status</strong> (trạng thái, cha, bộ nhớ, số luồng), <strong>cmdline</strong> và <strong>environ</strong> (đối số và biến môi trường, ngăn cách bằng <code>\\0</code>), <strong>exe</strong> và <strong>cwd</strong> (tệp chương trình nào, thư mục nào), <strong>fd/</strong> (các tệp đang mở). Ô bảo mật: ai cũng đọc được dòng lệnh của bạn; biến môi trường thì chỉ cùng người dùng và root đọc được.</p>
<p>Không có gì dưới <code>/proc</code> được lưu trên đĩa — <code>ls -l</code> báo kích thước 0 cho hầu hết các tệp — nhân dựng văn bản ngay lúc bạn <code>cat</code>, từ chính cấu trúc dữ liệu của nó (bộ mô tả tiến trình — process descriptor — ở bài 10.A, slide 13–14). Chạy thật, với một "server" Node khởi động kèm một biến môi trường lẽ ra phải bí mật:</p>
<div class="out"># Slide 6: nhìn vào bên trong một tiến trình đang chạy qua /proc<br>
$ echo "require('http').createServer((q, r) =&gt; r.end('ok')).listen(3000)" &gt; app.js<br>
$ PORT=3000 DB_PASSWORD=s3cret node --max-old-space-size=256 app.js &amp; N=$!; sleep 0.5<br>
$ grep -E '^(Name|State|Pid|PPid|Uid|Threads|VmRSS)' /proc/$N/status<br>
Name:	node<br>
State:	S (sleeping)<br>
Pid:	11<br>
PPid:	1<br>
Uid:	0	0	0	0<br>
VmRSS:	 &nbsp;&nbsp;45384 kB<br>
Threads:	7<br>
$ tr '\\0' ' ' &lt; /proc/$N/cmdline; echo<br>
node --max-old-space-size=256 app.js<br>
$ tr '\\0' '\\n' &lt; /proc/$N/environ | grep -E '^(PORT|DB_PASSWORD)='<br>
PORT=3000<br>
DB_PASSWORD=s3cret<br>
$ readlink /proc/$N/exe /proc/$N/cwd<br>
/usr/local/bin/node<br>
/w<br>
$ ls /proc/$N/fd | wc -l<br>
19<br>
# giờ một người dùng khác (sv, uid 1000) nhìn cùng tiến trình của root: dòng lệnh là công khai, biến môi trường thì không<br>
$ runuser -u sv -- sh -c "id -un; tr '\\0' ' ' &lt; /proc/$N/cmdline; echo"<br>
sv<br>
node --max-old-space-size=256 app.js<br>
$ runuser -u sv -- cat /proc/$N/environ<br>
cat: /proc/11/environ: Permission denied<br>
$ runuser -u sv -- ps -o user,pid,args -p $N<br>
USER &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PID COMMAND<br>
root &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 node --max-old-space-size=256 app.js<br>
$ kill $N</div>
<p>Từng dòng: <code>status</code> cho trạng thái (<code>S</code>, đang chờ kết nối), cha, người sở hữu (<code>Uid</code> bốn lần: thực, hiệu lực, đã lưu, hệ tệp — ở đây đều là root), bộ nhớ thật sự đang nằm trong RAM (<strong>VmRSS</strong> — resident set size, khoảng 45 MB cho một Node trống; CS.5 giải thích RSS khác kích thước ảo thế nào) và 7 luồng. <code>cmdline</code> là đúng vector đối số — để ý <code>--max-old-space-size=256</code> đứng <em>trước</em> <code>app.js</code>, nên nó là cờ cho Node, không phải cho script của bạn. <code>environ</code> cho thấy các biến mà tiến trình <em>được khởi động</em> cùng — kể cả "bí mật". <code>exe</code> là tệp thực thi thật, kể cả khi tệp đã bị thay sau đó (nó vẫn trỏ tới inode cũ, gắn nhãn "(deleted)" — dấu hiệu kinh điển của một dịch vụ chưa được khởi động lại sau khi nâng cấp). <code>fd/</code> có 19 mục: stdin/stdout/stderr, socket đang lắng nghe, và các ống (pipe) nội bộ cùng mô tả epoll của libuv (CS.2 và CS.4).</p>
<p>Rồi tới phần quan trọng: một người dùng khác, <code>sv</code>, nhìn vào cùng tiến trình của root. Dòng lệnh đọc được — nó chính là thứ <code>ps</code> hiện cho tất cả mọi người — nhưng <code>environ</code> báo <strong>Permission denied</strong> (không có quyền). Đó là luật của slide: <em>cmdline là công khai, environ là riêng của cùng người dùng (và root)</em>.</p>
<p>➕ Ba hệ quả thực tế. (1) Đừng bao giờ đặt mật khẩu trên dòng lệnh (<code>mysql -pS3cret</code>, <code>curl -u user:pass</code>, <code>node app.js --db-password=…</code>): mọi người dùng trên máy, và mọi agent giám sát, đọc được bằng <code>ps</code>. Dùng biến môi trường hoặc một tệp có quyền 600. (2) Biến môi trường cũng không "an toàn" — mọi tiến trình chạy cùng người dùng, một bản dump khi sập, <code>docker inspect</code>, hay một endpoint gỡ lỗi in <code>process.env</code> đều làm lộ chúng. Hãy coi chúng là "không nằm trong mã nguồn", không phải là "bí mật". (3) <code>environ</code> cho thấy môi trường <em>lúc khởi động</em>: ứng dụng Node đặt <code>process.env.X</code> về sau không làm đổi tệp này.</p>
<p class="pitfall">⚠️ Cần <code>tr '\\0' ' '</code> vì các đối số được ngăn bằng byte NUL; <code>cat /proc/&lt;pid&gt;/cmdline</code> in chúng dính liền nhau (<code>node--max-old-space-size=256app.js</code>) và người ta kết luận nhầm là cờ chưa bao giờ được truyền.</p>`],
      [7, 'How a new program starts: fork → exec → wait',
        `<p class="y-chinh">🎯 Starting a program on Unix is three system calls: <strong>fork()</strong> copies the caller and returns <em>twice</em> — 0 in the child, the child's PID in the parent; <strong>exec()</strong> replaces the program inside the child (same PID) and returns only on failure; <strong>wait()/waitpid()</strong> makes the parent sleep until a child ends, then hands it the exit status.</p>
<p>Read the timeline on the slide from left to right, with the real PIDs of the deck's run (13 = parent, 14 = child). At <code>fork()</code> the blue line splits: from that instant there are two processes running the <em>same</em> program at the <em>same</em> line, with copies of the same variables. The only way each can tell who it is: the return value. The parent gets 14 (so it can wait for that child later); the child gets 0 (it can ask for its parent with <code>getppid()</code>). The child then calls <code>execvp("ls")</code>: the orange line turns green — still PID 14, but the program inside is now <code>ls</code>, with fresh memory, and the old code is gone, which is why "exec returns only on failure" (there is nothing left to return to). <code>ls</code> fails to find the path and calls <code>exit(2)</code>. Meanwhile the parent sat in <code>waitpid(14)</code>, blocked, using 0 % CPU; the exit wakes it up with status 2.</p>
<p>➕ Why two calls instead of one "spawn"? Because the gap between them is where a shell does its work: in <code>ls &gt; out.txt</code>, the child — still running the shell's code — opens <code>out.txt</code>, moves it onto descriptor 1 with <code>dup2</code>, and only then calls exec; <code>ls</code> never knows its output goes to a file. The same gap is used to change directory, set limits (<code>ulimit</code>), drop privileges, or join a namespace — <code>docker run</code> and <code>unshare</code> do exactly this before exec'ing your program. Modern runtimes often use <code>posix_spawn</code> or <code>vfork</code>/<code>clone</code> to skip the copy (lesson 10.A, slide 15: three ways to <code>clone</code>), but the model — create, replace, wait — is the same. And the copy is cheap: thanks to <strong>copy-on-write</strong>, fork copies page tables, not the memory itself (lesson 10.B).</p>
<p>🧭 On a real server: Node's <code>child_process.spawn/exec</code>, Java's <code>ProcessBuilder</code> (slide 19 uses it for real), Python's <code>subprocess</code>, PHP-FPM's worker pool, PostgreSQL's one-process-per-connection, nginx's master/worker — all of them are fork + exec + wait underneath. When a Node API "shells out" to ImageMagick or <code>git</code> on every request, each request pays for a whole new process.</p>
<p class="pitfall">⚠️ FE1#30 and FE3#50: "In UNIX systems, what is the primary purpose of system calls like fork() and exec()?" — <strong>to create and execute new processes</strong>. Also remember the classic trap: fork returns <em>twice</em>, exec returns <em>zero times</em> when it succeeds.</p>`,
        `<p class="y-chinh">🎯 Khởi động một chương trình trên Unix là ba lời gọi hệ thống (system call): <strong>fork()</strong> sao chép tiến trình gọi nó và trả về <em>hai lần</em> — 0 trong tiến trình con, PID của con trong tiến trình cha; <strong>exec()</strong> thay chương trình bên trong tiến trình con (giữ nguyên PID) và chỉ trả về khi thất bại; <strong>wait()/waitpid()</strong> cho cha ngủ tới khi một con kết thúc, rồi trao cho cha trạng thái thoát (exit status).</p>
<p>Đọc dòng thời gian trên slide từ trái sang phải, với PID thật trong lần chạy của bộ slide (13 = cha, 14 = con). Tại <code>fork()</code> đường xanh tách đôi: từ khoảnh khắc đó có hai tiến trình chạy <em>cùng</em> một chương trình ở <em>cùng</em> một dòng lệnh, với bản sao của cùng các biến. Cách duy nhất để mỗi bên biết mình là ai: giá trị trả về. Cha nhận 14 (để sau này chờ đúng đứa con đó); con nhận 0 (nó có thể hỏi cha mình bằng <code>getppid()</code>). Rồi con gọi <code>execvp("ls")</code>: đường cam chuyển sang xanh lá — vẫn là PID 14, nhưng chương trình bên trong giờ là <code>ls</code>, với bộ nhớ mới tinh, còn mã cũ biến mất, vì thế "exec chỉ trả về khi thất bại" (chẳng còn chỗ nào để trả về). <code>ls</code> không tìm thấy đường dẫn và gọi <code>exit(2)</code>. Trong lúc đó cha nằm trong <code>waitpid(14)</code>, bị chặn (blocked), dùng 0 % CPU; lần thoát của con đánh thức nó dậy với trạng thái 2.</p>
<p>➕ Sao lại là hai lời gọi thay vì một lệnh "spawn"? Vì khoảng hở giữa chúng là nơi shell làm việc: trong <code>ls &gt; out.txt</code>, tiến trình con — vẫn đang chạy mã của shell — mở <code>out.txt</code>, chuyển nó sang mô tả số 1 bằng <code>dup2</code>, rồi mới gọi exec; <code>ls</code> không hề biết output của nó đi vào tệp. Cũng khoảng hở đó được dùng để đổi thư mục, đặt giới hạn (<code>ulimit</code>), bỏ bớt quyền, hay gia nhập một namespace — <code>docker run</code> và <code>unshare</code> làm đúng như vậy trước khi exec chương trình của bạn. Các runtime hiện đại hay dùng <code>posix_spawn</code> hoặc <code>vfork</code>/<code>clone</code> để bỏ qua bước sao chép (bài 10.A, slide 15: ba cách dùng <code>clone</code>), nhưng mô hình — tạo, thay, chờ — vẫn vậy. Và việc sao chép rẻ: nhờ <strong>copy-on-write</strong> (chép khi ghi), fork chỉ chép bảng trang, không chép bản thân bộ nhớ (bài 10.B).</p>
<p>🧭 Trên server thật: <code>child_process.spawn/exec</code> của Node, <code>ProcessBuilder</code> của Java (slide 19 dùng thật), <code>subprocess</code> của Python, pool worker của PHP-FPM, mô hình mỗi kết nối một tiến trình của PostgreSQL, master/worker của nginx — bên dưới tất cả đều là fork + exec + wait. Khi một API Node "gọi ra shell" chạy ImageMagick hay <code>git</code> cho mỗi request, mỗi request trả giá bằng cả một tiến trình mới.</p>
<p class="pitfall">⚠️ FE1#30 và FE3#50: "Trong hệ thống UNIX, mục đích chính của các lời gọi hệ thống như fork() và exec() là gì?" — <strong>để tạo và thực thi tiến trình mới</strong> (to create and execute new processes). Nhớ thêm cái bẫy kinh điển: fork trả về <em>hai lần</em>, exec khi thành công trả về <em>không lần nào</em>.</p>`],
      [8, 'fork / exec / wait in C — run for real',
        `<p class="y-chinh">🎯 The three calls in fourteen lines of C, run for real: the parent prints, flushes, forks; the child prints and execs <code>ls</code> on a missing path; the parent waits and reads <code>WEXITSTATUS = 2</code>. The note under the slide: your shell, Node's <code>child_process.spawn</code>, Java's <code>ProcessBuilder</code> and Python's <code>subprocess</code> all do exactly this.</p>
<pre><code class="language-c">// Slides 7-8: fork copies, exec replaces, wait collects the exit code
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    printf("parent: pid=%d ppid=%d\\n", getpid(), getppid());
    fflush(stdout);                          // empty the buffer BEFORE fork
    pid_t pid = fork();                      // 1 process in, 2 processes out
    if (pid &lt; 0) { perror("fork"); return 1; }
    if (pid == 0) {                          // ---- child
        printf("child : pid=%d ppid=%d  fork() returned 0\\n", getpid(), getppid());
        fflush(stdout);
        char *argv[] = { "ls", "-1", "/nope", NULL };
        execvp("ls", argv);                  // becomes ls, same PID
        perror("execvp");                    // only reached if exec failed
        _exit(127);
    }
    int status;
    waitpid(pid, &amp;status, 0);                // block until the child ends
    printf("parent: fork() returned %d (the child's pid)\\n", pid);
    if (WIFEXITED(status))
        printf("parent: child %d exited, status=%d\\n", pid, WEXITSTATUS(status));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread fork-exec-wait.c -o fork-exec-wait &amp;&amp; ./fork-exec-wait<br>
parent: pid=11 ppid=1<br>
child : pid=12 ppid=11 &nbsp;fork() returned 0<br>
ls: cannot access '/nope': No such file or directory<br>
parent: fork() returned 12 (the child's pid)<br>
parent: child 12 exited, status=2</div>
<p>Follow the PIDs: the program itself is 12 (its parent is PID 1, the shell of the session), the child is 13 and reports parent 12, the line <code>ls: cannot access …</code> is printed by PID 13 <em>after</em> exec — it is <code>ls</code> talking, not our program — and the parent learns two facts from <code>waitpid</code>: the child exited normally (<code>WIFEXITED</code>) with status 2 (<code>WEXITSTATUS</code>). Code 2 is <code>ls</code>'s own convention for "serious trouble, e.g. cannot access a command-line argument" (its man page lists 0, 1 and 2) — slide 9 collects such conventions.</p>
<p>Three details that make the program correct, each worth a mark in a lab:</p>
<ul>
<li><strong><code>fflush(stdout)</code> before <code>fork()</code></strong>. When output goes to a pipe or a file (as here, and in every container log), <code>printf</code> keeps text in a buffer inside the process. fork copies that buffer, so un-flushed text would be printed <em>twice</em> — once by each process. On a terminal the bug hides, because stdout is line-buffered there. CS.2 runs this bug for real.</li>
<li><strong><code>_exit(127)</code> after <code>execvp</code></strong>, not <code>exit</code> and not falling through. If exec fails (typo in the program name), the child must die immediately with the shell's "command not found" code; using <code>exit()</code> would flush the copied buffers again, and falling through would make the child continue running the parent's code — two parents.</li>
<li><strong>The parent prints <em>after</em> <code>waitpid</code></strong>. Here it does so on purpose, so the output is in the same order on every run. Printing right after fork would race with the child: on a multi-core machine the two lines can come in either order — the slide's image (made in a terminal) happened to show the parent first.</li>
</ul>
<p>➕ The macros of <code>&lt;sys/wait.h&gt;</code> decode the integer <code>status</code>: <code>WIFEXITED</code>/<code>WEXITSTATUS</code> for a normal exit, <code>WIFSIGNALED</code>/<code>WTERMSIG</code> for a death by signal, <code>WIFSTOPPED</code> for a stopped child (used by job control, slide 23). Slide 10 runs all of them.</p>
<p class="meo">🧠 The pattern to memorise: <code>pid = fork(); if (pid == 0) { exec…; _exit(127); } waitpid(pid, &amp;st, 0);</code> — child branch first, it never falls through.</p>`,
        `<p class="y-chinh">🎯 Ba lời gọi trong mười bốn dòng C, chạy thật: cha in, xả bộ đệm (flush), fork; con in rồi exec <code>ls</code> trên một đường dẫn không tồn tại; cha chờ và đọc được <code>WEXITSTATUS = 2</code>. Dòng chú thích dưới slide: shell của bạn, <code>child_process.spawn</code> của Node, <code>ProcessBuilder</code> của Java và <code>subprocess</code> của Python đều làm đúng như vậy.</p>
<pre><code class="language-c">// Slide 7-8: fork sao chép, exec thay chương trình, wait nhận mã thoát
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    printf("parent: pid=%d ppid=%d\\n", getpid(), getppid());
    fflush(stdout);                          // xả bộ đệm TRƯỚC khi fork
    pid_t pid = fork();                      // 1 tiến trình vào, 2 tiến trình ra
    if (pid &lt; 0) { perror("fork"); return 1; }
    if (pid == 0) {                          // ---- con
        printf("child : pid=%d ppid=%d  fork() returned 0\\n", getpid(), getppid());
        fflush(stdout);
        char *argv[] = { "ls", "-1", "/nope", NULL };
        execvp("ls", argv);                  // trở thành ls, giữ nguyên PID
        perror("execvp");                    // chỉ tới đây khi exec thất bại
        _exit(127);
    }
    int status;
    waitpid(pid, &amp;status, 0);                // chặn tới khi con kết thúc
    printf("parent: fork() returned %d (the child's pid)\\n", pid);
    if (WIFEXITED(status))
        printf("parent: child %d exited, status=%d\\n", pid, WEXITSTATUS(status));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread fork-exec-wait.c -o fork-exec-wait &amp;&amp; ./fork-exec-wait<br>
parent: pid=11 ppid=1<br>
child : pid=12 ppid=11 &nbsp;fork() returned 0<br>
ls: cannot access '/nope': No such file or directory<br>
parent: fork() returned 12 (the child's pid)<br>
parent: child 12 exited, status=2</div>
<p>Lần theo PID: chính chương trình là 12 (cha của nó là PID 1, shell của phiên), con là 13 và báo cha là 12, dòng <code>ls: cannot access …</code> do PID 13 in <em>sau</em> exec — đó là <code>ls</code> đang nói, không phải chương trình của ta — và cha biết được hai sự thật từ <code>waitpid</code>: con thoát bình thường (<code>WIFEXITED</code>) với trạng thái 2 (<code>WEXITSTATUS</code>). Mã 2 là quy ước riêng của <code>ls</code> cho "rắc rối nghiêm trọng, ví dụ không truy cập được một đối số dòng lệnh" (trang man của nó liệt kê 0, 1 và 2) — slide 9 gom các quy ước như vậy.</p>
<p>Ba chi tiết làm chương trình đúng, mỗi cái đáng một điểm trong bài lab:</p>
<ul>
<li><strong><code>fflush(stdout)</code> trước <code>fork()</code></strong>. Khi output đi vào ống (pipe) hay tệp (như ở đây, và trong mọi log container), <code>printf</code> giữ chữ trong một bộ đệm (buffer) bên trong tiến trình. fork sao chép luôn bộ đệm đó, nên chữ chưa được xả sẽ bị in <em>hai lần</em> — mỗi tiến trình in một lần. Trên terminal lỗi này bị che, vì stdout ở đó được đệm theo dòng. CS.2 chạy thật lỗi này.</li>
<li><strong><code>_exit(127)</code> sau <code>execvp</code></strong>, không phải <code>exit</code> và không để rơi xuống dưới. Nếu exec thất bại (gõ sai tên chương trình), con phải chết ngay với mã "command not found" của shell; dùng <code>exit()</code> sẽ xả lại các bộ đệm đã sao chép, còn để rơi xuống dưới sẽ làm con chạy tiếp mã của cha — thành hai ông bố.</li>
<li><strong>Cha in <em>sau</em> <code>waitpid</code></strong>. Ở đây làm vậy có chủ ý, để output có cùng thứ tự ở mọi lần chạy. In ngay sau fork sẽ tranh chấp (race) với con: trên máy nhiều nhân hai dòng có thể ra theo thứ tự bất kỳ — ảnh của slide (chụp trong terminal) tình cờ cho thấy cha in trước.</li>
</ul>
<p>➕ Các macro của <code>&lt;sys/wait.h&gt;</code> giải mã số nguyên <code>status</code>: <code>WIFEXITED</code>/<code>WEXITSTATUS</code> cho lần thoát bình thường, <code>WIFSIGNALED</code>/<code>WTERMSIG</code> cho cái chết do tín hiệu, <code>WIFSTOPPED</code> cho con bị dừng tạm (dùng trong điều khiển job — job control, slide 23). Slide 10 chạy thật tất cả.</p>
<p class="meo">🧠 Mẫu cần thuộc: <code>pid = fork(); if (pid == 0) { exec…; _exit(127); } waitpid(pid, &amp;st, 0);</code> — nhánh con viết trước, và nó không bao giờ được rơi xuống dưới.</p>`],
      [9, 'Exit codes: one byte that says how it ended',
        `<p class="y-chinh">🎯 The exit code is one byte: <strong>0</strong> = success (the only "OK"), <strong>1</strong> = general error, <strong>2</strong> = misuse / serious trouble, <strong>126</strong> = found but not executable, <strong>127</strong> = command not found, <strong>128 + N</strong> = killed by signal N. Only 8 bits survive, so <code>exit 300</code> becomes <strong>44</strong>; keep your own codes in 1–125.</p>
<p>The runner reproduces every row of the slide's table:</p>
<div class="out"># Slides 9-10: exit codes 0, 1, 2, 126, 127, the 8-bit wrap, and 128+N<br>
$ true; echo "exit code $?"<br>
exit code 0<br>
$ false; echo "exit code $?"<br>
exit code 1<br>
$ ls /nope; echo "exit code $?"<br>
ls: cannot access '/nope': No such file or directory<br>
exit code 2<br>
$ printf 'echo hi\\n' &gt; script.sh; ./script.sh; echo "exit code $?"<br>
bash: ./script.sh: Permission denied<br>
exit code 126<br>
$ nosuchcmd; echo "exit code $?"<br>
bash: nosuchcmd: command not found<br>
exit code 127<br>
$ bash -c 'exit 300'; echo "exit code $?"<br>
exit code 44<br>
# killed by a signal: 128 + signal number<br>
$ sleep 30 &amp; P=$!; kill -TERM $P; wait $P; echo "SIGTERM -&gt; exit code $?"<br>
SIGTERM -&gt; exit code 143<br>
$ sleep 30 &amp; P=$!; kill -KILL $P; wait $P; echo "SIGKILL -&gt; exit code $?"<br>
bash: &nbsp;&nbsp;&nbsp;28 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 30<br>
SIGKILL -&gt; exit code 137<br>
# trap inside the trap: a script's background job IGNORES SIGINT (job control off)<br>
$ sleep 1 &amp; P=$!; grep SigIgn /proc/$P/status; kill -INT $P; wait $P; echo "SIGINT -&gt; exit code $? (sleep finished normally)"<br>
SigIgn:	0000000000000006<br>
SIGINT -&gt; exit code 0 (sleep finished normally)<br>
# ...unless the signal arrives before the child has finished starting (a race)<br>
$ sleep 1 &amp; P=$!; kill -INT $P; wait $P; echo "SIGINT sent at once -&gt; exit code $?"<br>
SIGINT sent at once -&gt; exit code 130</div>
<p>Where each number comes from. <strong>0 / 1</strong>: <code>true</code> and <code>false</code> exist only to return them — every <code>if</code>, <code>&amp;&amp;</code>, <code>||</code> and CI step in the world tests "is it 0?". <strong>2</strong>: <code>ls</code>'s own convention for "cannot access a command-line argument" — beyond 0 and 1, codes are a program's private language (its man page, section EXIT STATUS). <strong>126</strong>: the shell found <code>./script.sh</code> but the file has no <code>x</code> permission — the classic "I forgot <code>chmod +x</code> on the entrypoint" of a Docker image. <strong>127</strong>: nothing with that name in <code>PATH</code> — in a container that usually means "the binary is not installed in <em>this</em> image" (you used <code>curl</code> in a healthcheck of an image without curl — exactly the trap noted in this project's history for the frontend container). <strong>44</strong>: 300 mod 256 — the kernel keeps only the low 8 bits of the value passed to <code>exit()</code>.</p>
<p>The last block shows a trap inside the trap. A background job of a non-interactive shell (a script, a CI step, this session) is started with <strong>SIGINT and SIGQUIT ignored</strong> — the <code>SigIgn</code> mask <code>…0006</code> has bits 2 and 3 set — so <code>kill -INT</code> does nothing and <code>sleep</code> ends normally with 0. That is POSIX: Ctrl+C typed at a script must not kill the jobs it started in the background. But when the signal is sent the very instant after <code>&amp;</code>, it can arrive before the forked child has set the "ignore" — and the child dies with 130. Same script, different timing, different exit code: the slide's image was made with that instant kill and shows 130. Race conditions are not only about threads.</p>
<p>➕ Who reads exit codes in real life: <code>set -e</code> in bash (stop at the first non-zero), CI pipelines (a red step = a non-zero code), Docker (<code>docker ps -a</code> shows <code>Exited (N)</code>; <code>restart: on-failure</code> restarts only when N ≠ 0), Kubernetes (<code>kubectl describe pod</code> → "Last State: Terminated, Exit Code"), systemd (<code>Restart=on-failure</code>, slide 24). In Node, <code>process.exitCode = 3</code> or <code>process.exit(3)</code>; an uncaught exception exits with 1; in Java, <code>System.exit(3)</code>; an uncaught exception in <code>main</code> exits with 1.</p>
<p class="meo">🧠 Ranges to remember: 0 ok · 1–125 the program's own errors · 126/127 the shell could not run it · 128+ a signal killed it.</p>`,
        `<p class="y-chinh">🎯 Mã thoát là một byte: <strong>0</strong> = thành công ("OK" duy nhất), <strong>1</strong> = lỗi chung, <strong>2</strong> = dùng sai / rắc rối nghiêm trọng, <strong>126</strong> = tìm thấy nhưng không thực thi được, <strong>127</strong> = không tìm thấy lệnh, <strong>128 + N</strong> = bị tín hiệu N giết. Chỉ 8 bit sống sót, nên <code>exit 300</code> thành <strong>44</strong>; mã riêng của bạn hãy giữ trong khoảng 1–125.</p>
<p>Runner tái hiện mọi dòng trong bảng của slide:</p>
<div class="out"># Slide 9-10: mã thoát 0, 1, 2, 126, 127, chỉ 8 bit, và 128+N<br>
$ true; echo "exit code $?"<br>
exit code 0<br>
$ false; echo "exit code $?"<br>
exit code 1<br>
$ ls /nope; echo "exit code $?"<br>
ls: cannot access '/nope': No such file or directory<br>
exit code 2<br>
$ printf 'echo hi\\n' &gt; script.sh; ./script.sh; echo "exit code $?"<br>
bash: ./script.sh: Permission denied<br>
exit code 126<br>
$ nosuchcmd; echo "exit code $?"<br>
bash: nosuchcmd: command not found<br>
exit code 127<br>
$ bash -c 'exit 300'; echo "exit code $?"<br>
exit code 44<br>
# bị tín hiệu giết: 128 + số hiệu tín hiệu<br>
$ sleep 30 &amp; P=$!; kill -TERM $P; wait $P; echo "SIGTERM -&gt; exit code $?"<br>
SIGTERM -&gt; exit code 143<br>
$ sleep 30 &amp; P=$!; kill -KILL $P; wait $P; echo "SIGKILL -&gt; exit code $?"<br>
bash: &nbsp;&nbsp;&nbsp;28 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 30<br>
SIGKILL -&gt; exit code 137<br>
# bẫy trong bẫy: tiến trình nền của script BỎ QUA SIGINT (không bật job control)<br>
$ sleep 1 &amp; P=$!; grep SigIgn /proc/$P/status; kill -INT $P; wait $P; echo "SIGINT -&gt; exit code $? (sleep finished normally)"<br>
SigIgn:	0000000000000006<br>
SIGINT -&gt; exit code 0 (sleep finished normally)<br>
# ...trừ khi tín hiệu tới trước khi con khởi động xong (một cuộc đua)<br>
$ sleep 1 &amp; P=$!; kill -INT $P; wait $P; echo "SIGINT sent at once -&gt; exit code $?"<br>
SIGINT sent at once -&gt; exit code 130</div>
<p>Mỗi con số đến từ đâu. <strong>0 / 1</strong>: <code>true</code> và <code>false</code> tồn tại chỉ để trả về chúng — mọi <code>if</code>, <code>&amp;&amp;</code>, <code>||</code> và mọi bước CI trên đời đều kiểm "có bằng 0 không?". <strong>2</strong>: quy ước riêng của <code>ls</code> cho "không truy cập được một đối số dòng lệnh" — ngoài 0 và 1, mã thoát là ngôn ngữ riêng của từng chương trình (trang man của nó, mục EXIT STATUS). <strong>126</strong>: shell tìm thấy <code>./script.sh</code> nhưng tệp không có quyền <code>x</code> — kinh điển "quên <code>chmod +x</code> cho entrypoint" của một image Docker. <strong>127</strong>: không có gì tên đó trong <code>PATH</code> — trong container điều đó thường nghĩa là "chương trình chưa được cài trong <em>image này</em>" (bạn dùng <code>curl</code> trong healthcheck của một image không có curl — đúng cái bẫy ghi trong lịch sử dự án này với container frontend). <strong>44</strong>: 300 mod 256 — nhân chỉ giữ 8 bit thấp của giá trị truyền cho <code>exit()</code>.</p>
<p>Khối cuối cho thấy một cái bẫy bên trong cái bẫy. Tiến trình nền (background job) của một shell không tương tác (một script, một bước CI, chính phiên này) được khởi động với <strong>SIGINT và SIGQUIT bị bỏ qua</strong> — mặt nạ <code>SigIgn</code> <code>…0006</code> có bit 2 và 3 bật — nên <code>kill -INT</code> không làm gì và <code>sleep</code> kết thúc bình thường với 0. Đó là quy định của POSIX: Ctrl+C gõ vào một script không được giết các job nó đã khởi động ở chế độ nền. Nhưng khi tín hiệu được gửi ngay tức khắc sau <code>&amp;</code>, nó có thể tới trước khi tiến trình con vừa fork kịp đặt chế độ "bỏ qua" — và con chết với 130. Cùng một script, khác thời điểm, khác mã thoát: ảnh của slide được làm với kiểu gửi ngay tức khắc đó nên hiện 130. Tranh chấp (race condition) không chỉ có ở luồng.</p>
<p>➕ Ngoài đời ai đọc mã thoát: <code>set -e</code> trong bash (dừng ở lệnh khác 0 đầu tiên), pipeline CI (bước đỏ = mã khác 0), Docker (<code>docker ps -a</code> hiện <code>Exited (N)</code>; <code>restart: on-failure</code> chỉ khởi động lại khi N ≠ 0), Kubernetes (<code>kubectl describe pod</code> → "Last State: Terminated, Exit Code"), systemd (<code>Restart=on-failure</code>, slide 24). Trong Node: <code>process.exitCode = 3</code> hoặc <code>process.exit(3)</code>; một ngoại lệ không bắt (uncaught exception) thoát với 1; trong Java: <code>System.exit(3)</code>; ngoại lệ không bắt trong <code>main</code> thoát với 1.</p>
<p class="meo">🧠 Các khoảng cần nhớ: 0 ổn · 1–125 lỗi riêng của chương trình · 126/127 shell không chạy được nó · 128+ một tín hiệu đã giết nó.</p>`],
      [10, '128 + N: the process was killed by signal N',
        `<p class="y-chinh">🎯 When a signal kills a process, shells, Docker and Kubernetes show <strong>128 + N</strong>: <strong>130</strong> = 128 + 2 (SIGINT, Ctrl+C), <strong>137</strong> = 128 + 9 (SIGKILL: the OOM killer, a stop timeout, <code>kill -9</code>), <strong>139</strong> = 128 + 11 (SIGSEGV, a crash), <strong>143</strong> = 128 + 15 (SIGTERM, a normal stop without a handler). The kernel itself never stores "137".</p>
<p>The C program below forks four children and ends each one differently — one calls <code>exit(3)</code>, three are killed by SIGTERM, SIGKILL and SIGSEGV — then decodes what <code>waitpid</code> really returns:</p>
<pre><code class="language-c">// What the PARENT really receives: "exited with N" or "killed by signal N" — the 137 is invented by the shell
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static void report(const char *what, int st) {
    if (WIFEXITED(st))   printf("%-22s WIFEXITED   status=%d\\n", what, WEXITSTATUS(st));
    if (WIFSIGNALED(st)) printf("%-22s WIFSIGNALED signal=%d (%s) -&gt; a shell shows %d\\n",
                                what, WTERMSIG(st), strsignal(WTERMSIG(st)), 128 + WTERMSIG(st));
}
int main(void) {
    int sigs[] = { 0, SIGTERM, SIGKILL, SIGSEGV };
    const char *name[] = { "child called exit(3)", "kill(child, SIGTERM)", "kill(child, SIGKILL)", "kill(child, SIGSEGV)" };
    for (int i = 0; i &lt; 4; i++) {
        pid_t p = fork();
        if (p == 0) { if (sigs[i] == 0) _exit(3); pause(); }   // child: exit(3) or wait for a signal
        if (sigs[i]) { usleep(100000); kill(p, sigs[i]); }
        int st; waitpid(p, &amp;st, 0);
        report(name[i], st);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread trang-thai-wait.c -o trang-thai-wait &amp;&amp; ./trang-thai-wait<br>
child called exit(3) &nbsp;&nbsp;WIFEXITED &nbsp;&nbsp;status=3<br>
kill(child, SIGTERM) &nbsp;&nbsp;WIFSIGNALED signal=15 (Terminated) -&gt; a shell shows 143<br>
kill(child, SIGKILL) &nbsp;&nbsp;WIFSIGNALED signal=9 (Killed) -&gt; a shell shows 137<br>
kill(child, SIGSEGV) &nbsp;&nbsp;WIFSIGNALED signal=11 (Segmentation fault) -&gt; a shell shows 139</div>
<p>This is the point of the blue box on the slide. The status word the kernel gives the parent has <em>two different shapes</em>: "exited normally with code 3" (<code>WIFEXITED</code>) or "terminated by signal 9" (<code>WIFSIGNALED</code>, <code>WTERMSIG</code>). There is no 137 in it. A shell must squeeze both shapes into the single number <code>$?</code>, so it uses the convention 128 + signal, which can never collide with a normal code as long as programs keep their own codes below 128. Docker copies the shell's convention into <code>State.ExitCode</code>; Kubernetes copies Docker's. So "exit code 137" in a pod means "the container's main process was killed by signal 9" — and then you ask who sent it.</p>
<p>The two rows at the top of the slide come from the shell, killing a background <code>sleep</code> (the same ones run in the previous block): 143 for TERM, 137 for KILL, and only for KILL does bash print the line <code>Killed</code> — it reports every signal death except the polite ones (SIGTERM, and SIGINT/SIGPIPE in some cases), which is why the slide's terminal shows a <code>Killed</code> line and no <code>Terminated</code> line.</p>
<p>➕ The table "who sends it" is the useful part for a backend developer. <strong>137</strong> has three common senders: the <strong>OOM killer</strong> when the container passes its memory limit (<code>docker inspect -f '&#123;&#123;.State.OOMKilled&#125;&#125;'</code> says true — CS.5 makes it happen), the <strong>stop timeout</strong> when a process ignored SIGTERM (slide 21), and a human or a script running <code>kill -9</code>. <strong>143</strong> after a deploy is normal — the old container received SIGTERM and had no handler (with a handler that exits cleanly you get 0). <strong>139</strong> means a native crash: a bad pointer in a C extension, a broken native module after a Node upgrade. <strong>134</strong> (128 + 6, SIGABRT) is the other crash code: an <code>assert</code> or glibc detecting memory corruption.</p>
<p class="pitfall">⚠️ "137 = out of memory" is the most common wrong answer in incident chats. 137 only says SIGKILL; check <code>OOMKilled</code> and the kernel log (<code>dmesg | grep -i oom</code>) before blaming memory.</p>`,
        `<p class="y-chinh">🎯 Khi một tín hiệu giết tiến trình, shell, Docker và Kubernetes hiện <strong>128 + N</strong>: <strong>130</strong> = 128 + 2 (SIGINT, Ctrl+C), <strong>137</strong> = 128 + 9 (SIGKILL: OOM killer, hết hạn chờ khi dừng, <code>kill -9</code>), <strong>139</strong> = 128 + 11 (SIGSEGV, sập do truy cập bộ nhớ sai), <strong>143</strong> = 128 + 15 (SIGTERM, dừng bình thường khi không có handler). Bản thân nhân không bao giờ lưu "137".</p>
<p>Chương trình C dưới đây fork bốn con và cho mỗi con kết thúc một kiểu — một con gọi <code>exit(3)</code>, ba con bị giết bằng SIGTERM, SIGKILL và SIGSEGV — rồi giải mã đúng thứ <code>waitpid</code> trả về:</p>
<pre><code class="language-c">// Tiến trình CHA thật sự nhận gì: "thoát với N" hay "bị tín hiệu N giết" — con số 137 là do shell tự tính
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static void report(const char *what, int st) {
    if (WIFEXITED(st))   printf("%-22s WIFEXITED   status=%d\\n", what, WEXITSTATUS(st));
    if (WIFSIGNALED(st)) printf("%-22s WIFSIGNALED signal=%d (%s) -&gt; a shell shows %d\\n",
                                what, WTERMSIG(st), strsignal(WTERMSIG(st)), 128 + WTERMSIG(st));
}
int main(void) {
    int sigs[] = { 0, SIGTERM, SIGKILL, SIGSEGV };
    const char *name[] = { "child called exit(3)", "kill(child, SIGTERM)", "kill(child, SIGKILL)", "kill(child, SIGSEGV)" };
    for (int i = 0; i &lt; 4; i++) {
        pid_t p = fork();
        if (p == 0) { if (sigs[i] == 0) _exit(3); pause(); }   // con: exit(3) hoặc chờ tín hiệu
        if (sigs[i]) { usleep(100000); kill(p, sigs[i]); }
        int st; waitpid(p, &amp;st, 0);
        report(name[i], st);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread trang-thai-wait.c -o trang-thai-wait &amp;&amp; ./trang-thai-wait<br>
child called exit(3) &nbsp;&nbsp;WIFEXITED &nbsp;&nbsp;status=3<br>
kill(child, SIGTERM) &nbsp;&nbsp;WIFSIGNALED signal=15 (Terminated) -&gt; a shell shows 143<br>
kill(child, SIGKILL) &nbsp;&nbsp;WIFSIGNALED signal=9 (Killed) -&gt; a shell shows 137<br>
kill(child, SIGSEGV) &nbsp;&nbsp;WIFSIGNALED signal=11 (Segmentation fault) -&gt; a shell shows 139</div>
<p>Đây là ý của ô xanh trên slide. Từ trạng thái nhân đưa cho cha có <em>hai hình dạng khác nhau</em>: "thoát bình thường với mã 3" (<code>WIFEXITED</code>) hoặc "bị kết thúc bởi tín hiệu 9" (<code>WIFSIGNALED</code>, <code>WTERMSIG</code>). Không có số 137 nào trong đó. Shell phải ép cả hai hình dạng vào một số duy nhất <code>$?</code>, nên nó dùng quy ước 128 + số tín hiệu, không bao giờ trùng một mã bình thường chừng nào các chương trình giữ mã riêng dưới 128. Docker chép quy ước của shell vào <code>State.ExitCode</code>; Kubernetes chép của Docker. Vì vậy "exit code 137" ở một pod nghĩa là "tiến trình chính của container bị tín hiệu 9 giết" — và rồi bạn hỏi ai đã gửi nó.</p>
<p>Hai dòng trên cùng của slide đến từ shell, giết một <code>sleep</code> chạy nền (chính các dòng đã chạy ở khối trước): 143 cho TERM, 137 cho KILL, và chỉ với KILL bash mới in dòng <code>Killed</code> — nó báo mọi cái chết do tín hiệu trừ những tín hiệu lịch sự (SIGTERM, và trong vài trường hợp SIGINT/SIGPIPE), vì thế terminal của slide có dòng <code>Killed</code> mà không có dòng <code>Terminated</code>.</p>
<p>➕ Bảng "ai gửi nó" là phần hữu ích cho dev backend. <strong>137</strong> có ba kẻ gửi hay gặp: <strong>OOM killer</strong> khi container vượt giới hạn bộ nhớ (<code>docker inspect -f '&#123;&#123;.State.OOMKilled&#125;&#125;'</code> báo true — CS.5 làm cho nó xảy ra), <strong>hết hạn chờ khi dừng</strong> (stop timeout) khi tiến trình lờ SIGTERM (slide 21), và một người hay một script chạy <code>kill -9</code>. <strong>143</strong> sau một lần deploy là bình thường — container cũ nhận SIGTERM và không có handler (có handler thoát sạch thì bạn được 0). <strong>139</strong> nghĩa là sập ở mã máy: con trỏ sai trong một extension C, một native module hỏng sau khi nâng cấp Node. <strong>134</strong> (128 + 6, SIGABRT) là mã sập còn lại: một <code>assert</code> hoặc glibc phát hiện bộ nhớ bị hỏng.</p>
<p class="pitfall">⚠️ "137 = hết bộ nhớ" là câu trả lời sai phổ biến nhất trong các cuộc chat xử lý sự cố. 137 chỉ nói là SIGKILL; hãy kiểm <code>OOMKilled</code> và log của nhân (<code>dmesg | grep -i oom</code>) trước khi đổ lỗi cho bộ nhớ.</p>`],
      [11, 'Zombies: finished, but nobody read the report',
        `<p class="y-chinh">🎯 A <strong>zombie</strong> (state <code>Z</code>, shown as <code>&lt;defunct&gt;</code>) is a process that has already exited but whose parent has not yet called <code>wait()</code>. It uses no CPU and no memory — only a slot in the process table with its PID and exit status. <code>kill -9</code> does nothing: it is already dead. The danger is quantity: thousands of zombies use up PIDs, and then <code>fork</code> fails with "Resource temporarily unavailable".</p>
<p>The state diagram on the slide, drawn again with every state letter <code>ps</code> can show:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/68dfe2fb6b63dfc8d1ce5db27b1112d33a2e960e.svg" alt="The life of a Linux process as ps shows it — and the two ways a zombie leaves the table" loading="lazy" /><p class="chu-thich">🧩 The life of a Linux process as ps shows it — and the two ways a zombie leaves the table</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' The life of a Linux process as ps shows it: R/S/D/T/Z, who moves it, and the two ways a zombie disappears
hide empty description
[*] --&gt; Running : fork() by the parent\\n(exec() keeps the same PID)
state "R  running / runnable" as Running #DCFCE7
state "S  sleeping (interruptible)\\nwaiting: socket, timer, wait()" as S #F0F9FF
state "D  uninterruptible\\nwaiting for disk / NFS" as D #FEF3C7
state "T  stopped\\nSIGSTOP, Ctrl+Z (SIGTSTP)" as T #E5E7EB
state "Z  zombie &lt;defunct&gt;\\nonly PID + exit status left" as Z #FEE2E2
Running --&gt; S : blocks on I/O
S --&gt; Running : event arrives / signal
Running --&gt; D : disk I/O
D --&gt; Running : I/O done
Running --&gt; T : SIGSTOP / SIGTSTP
T --&gt; Running : SIGCONT (fg, bg)
Running --&gt; Z : exit() / killed by a signal\\n(kernel sends SIGCHLD to the parent)
Z --&gt; [*] : parent calls wait() / waitpid()
Z --&gt; Z : parent never waits:\\nstays forever (kill -9 does nothing)
note bottom of Z
  parent dies first -&gt;
  re-parented to PID 1 (or a subreaper),
  which must wait() for it
end note
@enduml</code></pre></details>
<p>Why does Linux keep a dead process at all? Because of slide 7: the parent has a right to learn how its child ended. When a process exits, the kernel frees its memory, closes its files and releases everything else at once — but it must keep the exit status somewhere until the parent asks for it with <code>wait</code>. That leftover entry is the zombie; it is the "report nobody has read" of the kitchen picture. As soon as the parent waits, the entry disappears and the PID can be reused. Run for real — a parent forks three children that exit immediately, and never waits:</p>
<div class="out"># Slides 11-12: three real zombies, kill -9 does nothing, then the SIGCHLD fix<br>
$ ./zombie &amp; Z=$!; sleep 0.5<br>
parent 16: 3 children finished, I never call wait()<br>
$ ps -o pid,ppid,stat,cmd --ppid $Z<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT CMD<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;18 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 Z &nbsp;&nbsp;&nbsp;[zombie] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 Z &nbsp;&nbsp;&nbsp;[zombie] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 Z &nbsp;&nbsp;&nbsp;[zombie] &lt;defunct&gt;<br>
$ kill -9 $(ps -o pid= --ppid $Z | head -1); sleep 0.2<br>
$ ps -o pid,ppid,stat,cmd --ppid $Z | sed -n 2p<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;18 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 Z &nbsp;&nbsp;&nbsp;[zombie] &lt;defunct&gt;<br>
$ wait $Z<br>
# the same program with a SIGCHLD handler<br>
$ ./zombie fix &amp; Z=$!; sleep 0.5<br>
parent 38: 3 children finished, I never call wait()<br>
$ ps -o pid,ppid,stat,cmd --ppid $Z || echo "(no children left: all reaped)"<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT CMD<br>
(no children left: all reaped)<br>
$ wait $Z</div>
<p>Three lines with <code>Z</code> and <code>[zombie] &lt;defunct&gt;</code>: the name in brackets because the command line is gone (it lived in the freed memory). The <code>kill -9</code> on the first zombie changes nothing — the same line, same state — because there is no process left to receive a signal. The parent then finishes, the shell reaps it, and its three zombies are inherited and reaped too (slide 12). The second run uses a <code>SIGCHLD</code> handler and leaves nothing behind.</p>
<p>➕ How many zombies is "a problem"? Each costs a few kilobytes of kernel memory — irrelevant — but each holds a PID. The PID space is limited by <code>/proc/sys/kernel/pid_max</code> (4,194,304 on 64-bit systems by default) and, much more often in practice, by the <strong>pids</strong> cgroup limit of a container (<code>docker run --pids-limit</code>, Kubernetes pod PID limits, CS.6). A container limited to a few hundred PIDs with a zombie leak dies with <code>fork: Resource temporarily unavailable</code> (EAGAIN) — in Node you see <code>spawn EAGAIN</code>, in Java <code>OutOfMemoryError: unable to create native thread</code>, because threads use the same counter.</p>
<p class="pitfall">⚠️ "To remove zombies, kill them" is wrong. You remove a zombie by making its <strong>parent</strong> call <code>wait</code>, or by killing the parent so that the zombie is inherited by PID 1 — which then reaps it, if PID 1 does its job (slide 13).</p>`,
        `<p class="y-chinh">🎯 <strong>Zombie</strong> (trạng thái <code>Z</code>, hiện là <code>&lt;defunct&gt;</code>) là một tiến trình đã thoát xong nhưng cha nó chưa gọi <code>wait()</code>. Nó không dùng CPU và không dùng bộ nhớ — chỉ chiếm một ô trong bảng tiến trình, chứa PID và trạng thái thoát. <code>kill -9</code> không có tác dụng: nó đã chết rồi. Nguy hiểm nằm ở số lượng: hàng nghìn zombie dùng hết PID, và lúc đó <code>fork</code> thất bại với "Resource temporarily unavailable".</p>
<p>Sơ đồ trạng thái trên slide, vẽ lại với mọi chữ cái trạng thái mà <code>ps</code> có thể hiện:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/68dfe2fb6b63dfc8d1ce5db27b1112d33a2e960e.svg" alt="Đời một tiến trình Linux như ps hiện — và hai cách một zombie rời khỏi bảng" loading="lazy" /><p class="chu-thich">🧩 Đời một tiến trình Linux như ps hiện — và hai cách một zombie rời khỏi bảng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Đời một tiến trình Linux như ps hiện: R/S/D/T/Z, ai đẩy nó đi, và hai cách một zombie biến mất
hide empty description
[*] --&gt; Running : fork() by the parent\\n(exec() keeps the same PID)
state "R  running / runnable" as Running #DCFCE7
state "S  sleeping (interruptible)\\nwaiting: socket, timer, wait()" as S #F0F9FF
state "D  uninterruptible\\nwaiting for disk / NFS" as D #FEF3C7
state "T  stopped\\nSIGSTOP, Ctrl+Z (SIGTSTP)" as T #E5E7EB
state "Z  zombie &lt;defunct&gt;\\nonly PID + exit status left" as Z #FEE2E2
Running --&gt; S : blocks on I/O
S --&gt; Running : event arrives / signal
Running --&gt; D : disk I/O
D --&gt; Running : I/O done
Running --&gt; T : SIGSTOP / SIGTSTP
T --&gt; Running : SIGCONT (fg, bg)
Running --&gt; Z : exit() / killed by a signal\\n(kernel sends SIGCHLD to the parent)
Z --&gt; [*] : parent calls wait() / waitpid()
Z --&gt; Z : parent never waits:\\nstays forever (kill -9 does nothing)
note bottom of Z
  parent dies first -&gt;
  re-parented to PID 1 (or a subreaper),
  which must wait() for it
end note
@enduml</code></pre></details>
<p>Sao Linux lại giữ một tiến trình đã chết? Vì slide 7: cha có quyền biết con mình kết thúc thế nào. Khi một tiến trình thoát, nhân giải phóng bộ nhớ, đóng các tệp và trả lại mọi thứ khác ngay — nhưng nó phải giữ trạng thái thoát ở đâu đó cho tới khi cha hỏi bằng <code>wait</code>. Mục còn sót lại đó là zombie; nó là "bản báo cáo không ai đọc" trong hình ảnh nhà bếp. Ngay khi cha gọi wait, mục đó biến mất và PID có thể được dùng lại. Chạy thật — cha fork ba con thoát ngay lập tức, và không bao giờ wait:</p>
<div class="out"># Slide 11-12: ba zombie thật, kill -9 vô tác dụng, rồi cách sửa bằng SIGCHLD<br>
$ ./zombie &amp; Z=$!; sleep 0.5<br>
parent 16: 3 children finished, I never call wait()<br>
$ ps -o pid,ppid,stat,cmd --ppid $Z<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT CMD<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;18 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 Z &nbsp;&nbsp;&nbsp;[zombie] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 Z &nbsp;&nbsp;&nbsp;[zombie] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 Z &nbsp;&nbsp;&nbsp;[zombie] &lt;defunct&gt;<br>
$ kill -9 $(ps -o pid= --ppid $Z | head -1); sleep 0.2<br>
$ ps -o pid,ppid,stat,cmd --ppid $Z | sed -n 2p<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;18 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 Z &nbsp;&nbsp;&nbsp;[zombie] &lt;defunct&gt;<br>
$ wait $Z<br>
# cùng chương trình đó, có handler SIGCHLD<br>
$ ./zombie fix &amp; Z=$!; sleep 0.5<br>
parent 38: 3 children finished, I never call wait()<br>
$ ps -o pid,ppid,stat,cmd --ppid $Z || echo "(no children left: all reaped)"<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT CMD<br>
(no children left: all reaped)<br>
$ wait $Z</div>
<p>Ba dòng có <code>Z</code> và <code>[zombie] &lt;defunct&gt;</code>: tên nằm trong ngoặc vuông vì dòng lệnh đã mất (nó nằm trong vùng bộ nhớ đã được giải phóng). Lệnh <code>kill -9</code> với zombie đầu tiên không thay đổi gì — vẫn dòng đó, vẫn trạng thái đó — vì không còn tiến trình nào để nhận tín hiệu. Sau đó cha chạy xong, shell gặt nó (reap — thu dọn), và ba zombie của nó cũng được thừa kế và gặt luôn (slide 12). Lần chạy thứ hai dùng một handler <code>SIGCHLD</code> và không để lại gì.</p>
<p>➕ Bao nhiêu zombie thì là "có vấn đề"? Mỗi cái tốn vài kilobyte bộ nhớ nhân — không đáng kể — nhưng mỗi cái giữ một PID. Không gian PID bị giới hạn bởi <code>/proc/sys/kernel/pid_max</code> (mặc định 4.194.304 trên hệ 64 bit) và, ngoài đời thường gặp hơn nhiều, bởi giới hạn cgroup <strong>pids</strong> của container (<code>docker run --pids-limit</code>, giới hạn PID của pod Kubernetes, CS.6). Một container giới hạn vài trăm PID mà rò rỉ zombie sẽ chết với <code>fork: Resource temporarily unavailable</code> (EAGAIN) — trong Node bạn thấy <code>spawn EAGAIN</code>, trong Java <code>OutOfMemoryError: unable to create native thread</code>, vì luồng dùng chung bộ đếm.</p>
<p class="pitfall">⚠️ "Muốn xoá zombie thì giết nó" là sai. Bạn xoá zombie bằng cách làm cho <strong>cha</strong> của nó gọi <code>wait</code>, hoặc giết cha để zombie được PID 1 thừa kế — PID 1 khi đó sẽ gặt nó, nếu PID 1 làm đúng việc của mình (slide 13).</p>`],
      [12, 'Fixing zombies, and what happens to orphans',
        `<p class="y-chinh">🎯 Fix: reap every finished child — in a <strong>SIGCHLD</strong> handler, loop <code>waitpid(-1, NULL, WNOHANG)</code> until it returns 0 or −1. An <strong>orphan</strong> is the opposite case — the parent dies first — and it is re-parented to <strong>PID 1</strong> (or to a "subreaper"), which from then on is responsible for reaping it.</p>
<p>The handler of the previous run, the piece that made the zombies disappear:</p>
<pre class="trich"><code class="language-c">static void on_sigchld(int sig) {           // reap EVERY finished child
    (void)sig;
    while (waitpid(-1, NULL, WNOHANG) &gt; 0) { }
}</code></pre>
<p>Each detail matters. <strong>SIGCHLD</strong> is the signal the kernel sends to a parent whenever one of its children exits (or stops/continues — the <code>SA_NOCLDSTOP</code> flag turns those two off). <strong><code>-1</code></strong> means "any child", because the handler does not know which one ended. <strong>The loop</strong> is necessary because signals are not queued: if three children exit while one SIGCHLD is pending, the handler runs <em>once</em> — a single <code>waitpid</code> would reap one and leave two zombies. <strong><code>WNOHANG</code></strong> makes <code>waitpid</code> return 0 instead of blocking when no more children have finished, so the handler never hangs. And <code>SA_RESTART</code> makes slow calls interrupted by the signal (<code>read</code>, <code>accept</code>) restart instead of failing with <code>EINTR</code>.</p>
<p>The other side of the slide — an orphan, run for real. A process forks a child and exits without waiting; the child looks for its parent before and after:</p>
<pre><code class="language-c">// Slide 12: the parent dies first; the orphan is re-parented to PID 1
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    if (fork() == 0) {                          // the middle process
        if (fork() == 0) {                      // the grandchild
            printf("child  %d: my parent is %d\\n", getpid(), getppid());
            fflush(stdout);
            sleep(1);                           // meanwhile its parent exits
            printf("child  %d: my parent is now %d  (adopted)\\n", getpid(), getppid());
            return 0;
        }
        usleep(200000);
        printf("parent %d: exiting without waiting for my child\\n", getpid());
        return 0;
    }
    wait(NULL);                                 // main waits for the middle process only
    sleep(2);                                   // give the orphan time to print
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread mo-coi.c -o mo-coi &amp;&amp; ./mo-coi<br>
child &nbsp;13: my parent is 12<br>
parent 12: exiting without waiting for my child<br>
child &nbsp;13: my parent is now 1 &nbsp;(adopted)</div>
<p>"My parent is 12", then "my parent is now 1 (adopted)": when a process dies, the kernel walks through its children and gives each one a new parent — the nearest ancestor that declared itself a <strong>subreaper</strong> with <code>prctl(PR_SET_CHILD_SUBREAPER)</code>, otherwise the <strong>init</strong> process of the PID namespace (<code>man 7 pid_namespaces</code>). Here PID 1 is the session's <code>bash</code>, which waits for any child, so the orphan is reaped when it ends.</p>
<p>➕ Two more fixes you will see in real code: <code>signal(SIGCHLD, SIG_IGN)</code> (or <code>SA_NOCLDWAIT</code>) tells the kernel "I will never wait; do not keep zombies" — children are reaped automatically (exercise 3 runs it); and the "double fork" of old daemons — fork, fork again, let the middle process exit at once — so the grandchild becomes an orphan of init and never a zombie of the program. Subreapers are used by real supervisors: <code>systemd --user</code>, <code>tini -s</code>, the container shims of containerd and Docker.</p>
<p class="meo">🧠 Zombie = child dead, parent alive and not waiting. Orphan = parent dead, child alive. A zombie whose parent then dies is both — and only PID 1 can clean it.</p>`,
        `<p class="y-chinh">🎯 Cách sửa: gặt mọi con đã kết thúc — trong một handler <strong>SIGCHLD</strong>, lặp <code>waitpid(-1, NULL, WNOHANG)</code> cho tới khi nó trả 0 hoặc −1. <strong>Tiến trình mồ côi</strong> (orphan) là trường hợp ngược lại — cha chết trước — và nó được giao lại cho <strong>PID 1</strong> (hoặc cho một "subreaper" — tiến trình nhận nuôi thay), từ đó trở đi PID 1 chịu trách nhiệm gặt nó.</p>
<p>Handler của lần chạy trước, chính đoạn làm các zombie biến mất:</p>
<pre class="trich"><code class="language-c">static void on_sigchld(int sig) {           // gặt MỌI con đã kết thúc
    (void)sig;
    while (waitpid(-1, NULL, WNOHANG) &gt; 0) { }
}</code></pre>
<p>Từng chi tiết đều có lý do. <strong>SIGCHLD</strong> là tín hiệu nhân gửi cho tiến trình cha mỗi khi một con của nó thoát (hoặc bị dừng/chạy tiếp — cờ <code>SA_NOCLDSTOP</code> tắt hai trường hợp này). <strong><code>-1</code></strong> nghĩa là "con nào cũng được", vì handler không biết con nào vừa kết thúc. <strong>Vòng lặp</strong> là bắt buộc vì tín hiệu không xếp hàng: nếu ba con thoát trong lúc một SIGCHLD đang chờ xử lý, handler chỉ chạy <em>một lần</em> — một lần <code>waitpid</code> duy nhất sẽ gặt một con và để lại hai zombie. <strong><code>WNOHANG</code></strong> khiến <code>waitpid</code> trả 0 thay vì chặn khi không còn con nào đã kết thúc, nên handler không bao giờ bị treo. Còn <code>SA_RESTART</code> làm các lời gọi chậm bị tín hiệu cắt ngang (<code>read</code>, <code>accept</code>) tự chạy lại thay vì thất bại với <code>EINTR</code>.</p>
<p>Nửa còn lại của slide — một tiến trình mồ côi, chạy thật. Một tiến trình fork một con rồi thoát mà không chờ; đứa con hỏi cha mình trước và sau:</p>
<pre><code class="language-c">// Slide 12: cha chết trước; đứa con mồ côi được nhận về PID 1
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    if (fork() == 0) {                          // tiến trình ở giữa
        if (fork() == 0) {                      // tiến trình cháu
            printf("child  %d: my parent is %d\\n", getpid(), getppid());
            fflush(stdout);
            sleep(1);                           // trong lúc đó cha nó thoát
            printf("child  %d: my parent is now %d  (adopted)\\n", getpid(), getppid());
            return 0;
        }
        usleep(200000);
        printf("parent %d: exiting without waiting for my child\\n", getpid());
        return 0;
    }
    wait(NULL);                                 // main chỉ chờ tiến trình ở giữa
    sleep(2);                                   // cho đứa mồ côi kịp in
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread mo-coi.c -o mo-coi &amp;&amp; ./mo-coi<br>
child &nbsp;13: my parent is 12<br>
parent 12: exiting without waiting for my child<br>
child &nbsp;13: my parent is now 1 &nbsp;(adopted)</div>
<p>"Cha tôi là 12", rồi "cha tôi giờ là 1 (được nhận nuôi)": khi một tiến trình chết, nhân duyệt qua các con của nó và giao cho mỗi con một cha mới — tổ tiên gần nhất đã tự khai là <strong>subreaper</strong> bằng <code>prctl(PR_SET_CHILD_SUBREAPER)</code>, nếu không có thì là tiến trình <strong>init</strong> của PID namespace đó (<code>man 7 pid_namespaces</code>). Ở đây PID 1 là <code>bash</code> của phiên, vốn chờ mọi con, nên đứa mồ côi được gặt khi nó kết thúc.</p>
<p>➕ Thêm hai cách sửa bạn sẽ gặp trong mã thật: <code>signal(SIGCHLD, SIG_IGN)</code> (hoặc <code>SA_NOCLDWAIT</code>) báo nhân "tôi sẽ không bao giờ wait; đừng giữ zombie" — con được gặt tự động (bài tập 3 chạy thật); và "fork hai lần" (double fork) của các daemon thời xưa — fork, fork thêm lần nữa, cho tiến trình ở giữa thoát ngay — để tiến trình cháu thành mồ côi của init và không bao giờ là zombie của chương trình. Subreaper được các bộ giám sát thật dùng: <code>systemd --user</code>, <code>tini -s</code>, các shim container của containerd và Docker.</p>
<p class="meo">🧠 Zombie = con chết, cha còn sống mà không chờ. Mồ côi = cha chết, con còn sống. Một zombie mà sau đó cha nó cũng chết thì là cả hai — và chỉ PID 1 dọn được nó.</p>`],
      [13, 'Real trap: zombies pile up under a Node PID 1',
        `<p class="y-chinh">🎯 In a container, PID 1 is your app. Orphans land on it — and Node.js (libuv) only waits for the children <em>it spawned itself</em>, so adopted orphans stay <code>Z</code> forever. Seen in production with headless Chrome/Puppeteer, PDF converters and shell scripts. Fix: a real init as PID 1 — <code>docker run --init</code> (tini).</p>
<p>A container is, among other things, a new <strong>PID namespace</strong>: inside it, numbering starts again at 1 (CS.6). <code>unshare --pid --fork --mount-proc</code> creates exactly that without Docker, so we can rebuild the slide's experiment inside the course container. The Node program shells out five times; each shell starts a background <code>sleep</code> and exits at once, so every <code>sleep</code> becomes an orphan:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_ADMIN</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 13: a new PID namespace makes &#96;node&#96; PID 1 — exactly like &#96;docker run image node app.js&#96;<br>
$ unshare --pid --fork --mount-proc node _pid1-zombie.js<br>
node is pid 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT CMD<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 Sl &nbsp;&nbsp;node _pid1-zombie.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Z &nbsp;&nbsp;&nbsp;[sleep] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Z &nbsp;&nbsp;&nbsp;[sleep] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Z &nbsp;&nbsp;&nbsp;[sleep] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Z &nbsp;&nbsp;&nbsp;[sleep] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Z &nbsp;&nbsp;&nbsp;[sleep] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;23 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 S &nbsp;&nbsp;&nbsp;/bin/sh -c ps -eo pid,ppid,stat,cmd<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;23 R &nbsp;&nbsp;&nbsp;ps -eo pid,ppid,stat,cmd<br>
# the same app behind a real init (what &#96;docker run --init&#96; gives you)<br>
$ unshare --pid --fork --mount-proc ./mini-init node _pid1-zombie.js<br>
mini-init: reaped orphan 11<br>
mini-init: reaped orphan 14<br>
mini-init: reaped orphan 17<br>
mini-init: reaped orphan 20<br>
mini-init: reaped orphan 23<br>
node is pid 2<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT CMD<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 S &nbsp;&nbsp;&nbsp;./mini-init node _pid1-zombie.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Sl &nbsp;&nbsp;node _pid1-zombie.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 S &nbsp;&nbsp;&nbsp;/bin/sh -c ps -eo pid,ppid,stat,cmd<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24 R &nbsp;&nbsp;&nbsp;ps -eo pid,ppid,stat,cmd</div>
<p>First run: <code>node is pid 1</code>, and five <code>[sleep] &lt;defunct&gt;</code> with PPID 1 — Node is now the parent of the orphans and never waits for them. Why not? libuv reaps children by calling <code>waitpid</code> for the PIDs of the <code>ChildProcess</code> objects it created; an adopted orphan has no such object, so nobody ever asks for its status. Bash, systemd and tini do <code>wait(-1)</code> — "any child" — which is exactly the duty of an init. Second run: the same Node program behind <code>mini-init</code>, a 30-line C program written for this lesson that does what tini does: it starts the app as its child, forwards SIGTERM/SIGINT to it, and reaps <em>every</em> child. The five orphans are reaped as soon as they end (<code>reaped orphan …</code>), Node is PID 2, and the process table is clean:</p>
<pre><code class="language-c">// mini-init: what tini / docker --init do, in 30 lines — start the app as a child, FORWARD SIGTERM/SIGINT to it, REAP every child, exit with the app's status
#include &lt;stdio.h&gt;
#include &lt;errno.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static pid_t app;
static void forward(int sig) { if (app &gt; 0) kill(app, sig); }   // PID 1 HAS a handler, so the kernel delivers TERM to it

int main(int argc, char **argv) {
    if (argc &lt; 2) { fprintf(stderr, "usage: mini-init program [args...]\\n"); return 2; }
    struct sigaction sa = { .sa_handler = forward };
    sigemptyset(&amp;sa.sa_mask);
    sigaction(SIGTERM, &amp;sa, NULL);
    sigaction(SIGINT, &amp;sa, NULL);
    app = fork();
    if (app == 0) {                      // exec resets caught signals to default in the app
        execvp(argv[1], argv + 1);
        perror("mini-init: exec");
        _exit(127);
    }
    int st, code = 0;
    for (;;) {
        pid_t p = wait(&amp;st);             // ANY child: the app or an adopted orphan
        if (p &lt; 0) { if (errno == EINTR) continue; break; }      // ECHILD: nobody left
        if (p == app) code = WIFEXITED(st) ? WEXITSTATUS(st) : 128 + WTERMSIG(st);
        else fprintf(stderr, "mini-init: reaped orphan %d\\n", p);
    }
    return code;
}</code></pre>
<p>➕ Why it matters beyond tidiness: every request of a typical "generate a PDF" endpoint starts Chrome, Chrome starts a dozen helper processes, and some of them outlive their parent during a crash — under a Node PID 1, each request can leak zombies until the container's PID limit is reached and every <code>spawn</code> fails with <code>EAGAIN</code>. The same happens to a Java service that runs <code>ProcessBuilder</code> with shell scripts that background things. tini (17 kB, by Thomas Orozco) became so standard that Docker ships it as <code>docker-init</code> behind <code>--init</code> (and Compose as <code>init: true</code>).</p>
<p>🧭 On a real server: cuongthai.com's backend image uses exactly this fix — <code>ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/fix-uploads-perms.sh"]</code> — with a comment in the Dockerfile saying tini "forwards signals and reaps zombies". Slide 22 explains the second half of that line.</p>
<p class="pitfall">⚠️ "My app does not spawn processes, so I don't need an init" — your app may not, but a library might (image tools, git, headless browsers), and the init also fixes the signal problem of slide 20. Adding <code>--init</code> costs nothing.</p>`,
        `<p class="y-chinh">🎯 Trong container, PID 1 là ứng dụng của bạn. Các tiến trình mồ côi rơi về nó — mà Node.js (libuv) chỉ chờ những con <em>do chính nó sinh ra</em>, nên các đứa mồ côi được nhận về nằm <code>Z</code> mãi mãi. Đã gặp trên production với Chrome không giao diện/Puppeteer, công cụ chuyển PDF và script shell. Cách sửa: một init thật làm PID 1 — <code>docker run --init</code> (tini).</p>
<p>Container, ngoài những thứ khác, là một <strong>PID namespace</strong> mới: bên trong nó, việc đánh số bắt đầu lại từ 1 (CS.6). <code>unshare --pid --fork --mount-proc</code> tạo đúng thứ đó mà không cần Docker, nên ta dựng lại thí nghiệm của slide ngay trong container của môn học. Chương trình Node gọi shell năm lần; mỗi shell khởi động một <code>sleep</code> chạy nền rồi thoát ngay, nên mỗi <code>sleep</code> thành một đứa mồ côi:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_ADMIN</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 13: một PID namespace mới biến &#96;node&#96; thành PID 1 — y như &#96;docker run image node app.js&#96;<br>
$ unshare --pid --fork --mount-proc node _pid1-zombie.js<br>
node is pid 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT CMD<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 Sl &nbsp;&nbsp;node _pid1-zombie.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Z &nbsp;&nbsp;&nbsp;[sleep] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Z &nbsp;&nbsp;&nbsp;[sleep] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Z &nbsp;&nbsp;&nbsp;[sleep] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Z &nbsp;&nbsp;&nbsp;[sleep] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Z &nbsp;&nbsp;&nbsp;[sleep] &lt;defunct&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;23 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 S &nbsp;&nbsp;&nbsp;/bin/sh -c ps -eo pid,ppid,stat,cmd<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;23 R &nbsp;&nbsp;&nbsp;ps -eo pid,ppid,stat,cmd<br>
# cùng app đó sau một init thật (thứ &#96;docker run --init&#96; cho bạn)<br>
$ unshare --pid --fork --mount-proc ./mini-init node _pid1-zombie.js<br>
mini-init: reaped orphan 11<br>
mini-init: reaped orphan 14<br>
mini-init: reaped orphan 17<br>
mini-init: reaped orphan 20<br>
mini-init: reaped orphan 23<br>
node is pid 2<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT CMD<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 S &nbsp;&nbsp;&nbsp;./mini-init node _pid1-zombie.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Sl &nbsp;&nbsp;node _pid1-zombie.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 S &nbsp;&nbsp;&nbsp;/bin/sh -c ps -eo pid,ppid,stat,cmd<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24 R &nbsp;&nbsp;&nbsp;ps -eo pid,ppid,stat,cmd</div>
<p>Lần chạy đầu: <code>node is pid 1</code>, và năm dòng <code>[sleep] &lt;defunct&gt;</code> có PPID 1 — Node giờ là cha của các đứa mồ côi và không bao giờ chờ chúng. Vì sao? libuv gặt con bằng cách gọi <code>waitpid</code> cho đúng PID của các đối tượng <code>ChildProcess</code> mà nó đã tạo; một đứa mồ côi được nhận về không có đối tượng nào như thế, nên không ai hỏi trạng thái của nó. Bash, systemd và tini thì gọi <code>wait(-1)</code> — "con nào cũng được" — đó đúng là bổn phận của một init. Lần chạy thứ hai: cùng chương trình Node đứng sau <code>mini-init</code>, một chương trình C 30 dòng viết cho bài này, làm đúng việc của tini: khởi động ứng dụng làm con của nó, chuyển tiếp SIGTERM/SIGINT cho nó, và gặt <em>mọi</em> con. Năm đứa mồ côi được gặt ngay khi chúng kết thúc (<code>reaped orphan …</code>), Node là PID 2, và bảng tiến trình sạch:</p>
<pre><code class="language-c">// mini-init: việc tini / docker --init làm, gói trong 30 dòng — chạy app làm con, CHUYỂN TIẾP SIGTERM/SIGINT cho nó, GẶT mọi con, thoát với mã của app
#include &lt;stdio.h&gt;
#include &lt;errno.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static pid_t app;
static void forward(int sig) { if (app &gt; 0) kill(app, sig); }   // PID 1 CÓ handler nên nhân giao TERM cho nó

int main(int argc, char **argv) {
    if (argc &lt; 2) { fprintf(stderr, "usage: mini-init program [args...]\\n"); return 2; }
    struct sigaction sa = { .sa_handler = forward };
    sigemptyset(&amp;sa.sa_mask);
    sigaction(SIGTERM, &amp;sa, NULL);
    sigaction(SIGINT, &amp;sa, NULL);
    app = fork();
    if (app == 0) {                      // exec đưa tín hiệu đã bắt về mặc định trong app
        execvp(argv[1], argv + 1);
        perror("mini-init: exec");
        _exit(127);
    }
    int st, code = 0;
    for (;;) {
        pid_t p = wait(&amp;st);             // BẤT KỲ con nào: app hoặc đứa mồ côi được nhận
        if (p &lt; 0) { if (errno == EINTR) continue; break; }      // ECHILD: không còn ai
        if (p == app) code = WIFEXITED(st) ? WEXITSTATUS(st) : 128 + WTERMSIG(st);
        else fprintf(stderr, "mini-init: reaped orphan %d\\n", p);
    }
    return code;
}</code></pre>
<p>➕ Vì sao chuyện này quan trọng hơn cả sự gọn gàng: mỗi request của một endpoint "tạo PDF" điển hình khởi động Chrome, Chrome khởi động hàng chục tiến trình phụ, và vài cái sống lâu hơn cha của chúng khi có sự cố — dưới một PID 1 là Node, mỗi request có thể rò rỉ zombie cho tới khi chạm giới hạn PID của container và mọi lần <code>spawn</code> thất bại với <code>EAGAIN</code>. Một dịch vụ Java chạy <code>ProcessBuilder</code> với script shell có chạy nền cũng gặp y hệt. tini (17 kB, của Thomas Orozco) trở nên chuẩn tới mức Docker đóng gói sẵn nó thành <code>docker-init</code> sau cờ <code>--init</code> (và Compose là <code>init: true</code>).</p>
<p>🧭 Trên server thật: image backend của cuongthai.com dùng đúng cách sửa này — <code>ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/fix-uploads-perms.sh"]</code> — kèm một chú thích trong Dockerfile nói tini "chuyển tiếp tín hiệu và gặt zombie". Slide 22 giải thích nửa sau của dòng đó.</p>
<p class="pitfall">⚠️ "Ứng dụng của tôi không sinh tiến trình nên không cần init" — ứng dụng của bạn có thể không, nhưng một thư viện thì có thể (công cụ ảnh, git, trình duyệt không giao diện), và init còn sửa luôn vấn đề tín hiệu ở slide 20. Thêm <code>--init</code> chẳng tốn gì.</p>`],
    ]),
    books([
      ['man7', 'fork(2), execve(2), wait(2), _exit(2), proc(5) (status, cmdline, environ, exe, cwd, fd), pid_namespaces(7) (init, orphans, PR_SET_CHILD_SUBREAPER), prctl(2), unshare(1), ps(1), pstree(1)', 'fork(2), execve(2), wait(2), _exit(2), proc(5) (status, cmdline, environ, exe, cwd, fd), pid_namespaces(7) (init, mồ côi, PR_SET_CHILD_SUBREAPER), prctl(2), unshare(1), ps(1), pstree(1)'],
      ['posix', 'System Interfaces: fork, exec, wait/waitpid (WIFEXITED, WIFSIGNALED), _exit; Shell and Utilities §2.8.2 Exit Status for Commands (126, 127, greater than 128) and §2.11 Signals and Error Handling (asynchronous lists ignore SIGINT/SIGQUIT)', 'System Interfaces: fork, exec, wait/waitpid (WIFEXITED, WIFSIGNALED), _exit; Shell and Utilities §2.8.2 Exit Status for Commands (126, 127, lớn hơn 128) và §2.11 Signals and Error Handling (danh sách chạy nền bỏ qua SIGINT/SIGQUIT)'],
      ['mos4', 'Chapter 2, section 2.1 (processes, creation, termination, hierarchies, states) and Chapter 10, section 10.3 (processes in Linux, fork/exec, PID, the process table) — the school lessons 2.A and 10.A', 'Chương 2, mục 2.1 (tiến trình, tạo, kết thúc, phân cấp, trạng thái) và Chương 10, mục 10.3 (tiến trình trong Linux, fork/exec, PID, bảng tiến trình) — bài trường 2.A và 10.A'],
      ['ostep', 'Chapter 5 "Interlude: Process API" (fork, wait, exec, why the API is designed this way)', 'Chương 5 "Interlude: Process API" (fork, wait, exec, vì sao API được thiết kế như vậy)'],
    ]),
  ].join('\n'),
};

/* ───────── ⭐ CS.1 — 📑 Slide by slide · Linux processes (2/2): signals, graceful shutdown, PID 1 in containers, systemd (slides 14–28) ───────── */
const L_cs1_2 = {
  title: '⭐ CS.1 — 📑 Slide by slide · Linux processes (2/2): signals, graceful shutdown, PID 1 in containers, systemd (slides 14–28)|||⭐ CS.1 — 📑 Học theo từng slide · Tiến trình Linux (2/2): tín hiệu, tắt êm, PID 1 trong container, systemd (slide 14–28)',
  slug: 'osg202-slide-cs1-2',
  type: 'VIDEO',
  description: 'Phần tự thêm ngoài giáo trình (⭐, không thi FE): giảng slide 14–28 của deck tự dựng "Linux process model in practice" — bảng tín hiệu và ai gửi chúng ngoài đời (kể cả SIGQUIT xin JVM thread dump), bắt tín hiệu bằng trap trong bash, handler C chỉ bật cờ và vì sao SIGKILL/SIGSTOP không bắt được, tắt êm (graceful shutdown) đo thật trong Node.js với một request đang chạy dở, shutdown hook của JVM và graceful mặc định của Spring Boot 4.1.2, quy tắc của nhân với PID 1 trong một PID namespace (Node làm PID 1 lờ SIGTERM, sh nuốt tín hiệu, npm start không chuyển cho app, một init 30 dòng chuyển tiếp đúng), bẫy Dockerfile dạng shell, job control và nohup, tệp unit systemd, sự cố thật của chính website này, câu hỏi phỏng vấn, tự kiểm và tóm tắt — mọi lệnh chạy thật trên Linux.',
  content: [
    bi(`<span class="eyebrow">⭐ Advanced 1 · Lesson CS.1 (part 2 of 2) · deck "Linux process model in practice", slides 14–28</span>
<h2>Asking a process to stop: signals, graceful shutdown, and why the first process of a container behaves differently</h2>
<p class="lead">Part 1 followed a process from fork to its exit code. Part 2 is about the end that you do <em>not</em> choose: the kernel, a terminal, Docker, Kubernetes or systemd decides that your process must stop, and tells it with a <strong>signal</strong>. Whether that stop is clean — requests finished, transactions committed, files closed — or brutal — users see errors on every deploy — depends on a few lines of code and one detail of container set-up. Everything is run for real: signal handlers in bash, C, Node.js and Java; a Node server measured while a request is in flight; and the kernel's special rule for PID 1, rebuilt with a PID namespace inside the course container.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>14–16</td><td>Signals</td><td>name the signals a server receives, who sends them, and catch them in bash and C</td></tr>
<tr><td>17–19</td><td>Graceful shutdown</td><td>implement and measure it in Node.js, Java and Spring Boot</td></tr>
<tr><td>20–22</td><td>PID 1 in a container</td><td>explain why <code>docker stop</code> waits 10 s, and fix a Dockerfile</td></tr>
<tr><td>23–24</td><td>Jobs and services</td><td>use <code>&amp;</code>, <code>jobs</code>, <code>nohup</code>, and know why a server belongs to systemd or Docker</td></tr>
<tr><td>25–28</td><td>Real server, interview, review</td><td>read real incidents, answer six interview questions, check yourself</td></tr>
</tbody>
</table>
<div class="callout">Three things on the slides cannot run in the course container (it has no network, no Docker inside Docker, no systemd): Spring Boot (slide 19), timing <code>docker stop</code> (slide 21) and <code>systemd-analyze</code> (slide 24). They were run for real on the machine that built the deck, and the slide images show those outputs; here the lesson explains them and reproduces the kernel part of each with programs that do run here.</div>`,
    `<span class="eyebrow">⭐ Chuyên sâu 1 · Bài CS.1 (phần 2/2) · deck "Linux process model in practice", slide 14–28</span>
<h2>Yêu cầu một tiến trình dừng lại: tín hiệu, tắt êm, và vì sao tiến trình đầu tiên của container cư xử khác</h2>
<p class="lead">Phần 1 theo một tiến trình từ lúc fork tới mã thoát của nó. Phần 2 nói về cái kết mà bạn <em>không</em> chọn: nhân, một terminal, Docker, Kubernetes hay systemd quyết định tiến trình của bạn phải dừng, và báo cho nó bằng một <strong>tín hiệu</strong> (signal). Cuộc dừng đó sạch sẽ — request làm xong, giao dịch được commit, tệp được đóng — hay tàn bạo — người dùng thấy lỗi mỗi lần deploy — phụ thuộc vào vài dòng mã và một chi tiết khi dựng container. Mọi thứ đều chạy thật: handler tín hiệu trong bash, C, Node.js và Java; một server Node được đo trong lúc có một request đang chạy dở; và quy tắc đặc biệt của nhân cho PID 1, dựng lại bằng một PID namespace ngay trong container của môn học.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>14–16</td><td>Tín hiệu</td><td>kể tên các tín hiệu một server nhận, ai gửi chúng, và bắt chúng trong bash và C</td></tr>
<tr><td>17–19</td><td>Tắt êm</td><td>hiện thực và đo tắt êm trong Node.js, Java và Spring Boot</td></tr>
<tr><td>20–22</td><td>PID 1 trong container</td><td>giải thích vì sao <code>docker stop</code> chờ 10 giây, và sửa một Dockerfile</td></tr>
<tr><td>23–24</td><td>Job và dịch vụ</td><td>dùng <code>&amp;</code>, <code>jobs</code>, <code>nohup</code>, và biết vì sao một server thuộc về systemd hoặc Docker</td></tr>
<tr><td>25–28</td><td>Server thật, phỏng vấn, ôn tập</td><td>đọc các sự cố thật, trả lời sáu câu phỏng vấn, tự kiểm tra</td></tr>
</tbody>
</table>
<div class="callout">Ba thứ trên slide không chạy được trong container của môn học (không có mạng, không có Docker trong Docker, không có systemd): Spring Boot (slide 19), đo thời gian <code>docker stop</code> (slide 21) và <code>systemd-analyze</code> (slide 24). Chúng đã được chạy thật trên máy dựng bộ slide, và ảnh slide hiện đúng output đó; ở đây bài giảng giải thích chúng và tái hiện phần thuộc về nhân của từng cái bằng các chương trình chạy được ở đây.</div>`),
    walkHead('cs1', 14, 28),
    walk('cs1', [
      [14, 'Signals: short messages from the kernel',
        `<p class="y-chinh">🎯 A <strong>signal</strong> is a tiny asynchronous message — just a number — delivered to a process by the kernel. Each has a default action (terminate, core dump, ignore, stop, continue) that a process can replace with a <strong>handler</strong>, except <strong>SIGKILL</strong> and <strong>SIGSTOP</strong>, which can never be caught, blocked or ignored. The server signals to know: SIGTERM 15, SIGINT 2, SIGHUP 1, SIGQUIT 3, SIGCHLD 17, SIGKILL 9.</p>
<p>The list on the slide is <code>kill -l</code>; run it again, then ask bash to translate numbers — and an exit status — back into names, and finally send SIGQUIT to a sleeping JVM:</p>
<div class="out"># Slide 14: the signal list, an exit status turned back into a signal name, and SIGQUIT asking a JVM for a thread dump<br>
$ kill -l | head -4<br>
&nbsp;1) SIGHUP	 2) SIGINT	 3) SIGQUIT	 4) SIGILL	 5) SIGTRAP<br>
&nbsp;6) SIGABRT	 7) SIGBUS	 8) SIGFPE	 9) SIGKILL	10) SIGUSR1<br>
11) SIGSEGV	12) SIGUSR2	13) SIGPIPE	14) SIGALRM	15) SIGTERM<br>
16) SIGSTKFLT	17) SIGCHLD	18) SIGCONT	19) SIGSTOP	20) SIGTSTP<br>
$ kill -l 9; kill -l 15; kill -l 143<br>
KILL<br>
TERM<br>
TERM<br>
$ java _Ngu &gt; dump.txt 2&gt;&amp;1 &amp; J=$!; sleep 1.5<br>
$ kill -QUIT $J; sleep 0.5<br>
$ grep -m1 'Full thread dump' dump.txt | cut -c1-60; echo "threads in the dump: $(grep -c '^"' dump.txt)"<br>
Full thread dump OpenJDK 64-Bit Server VM (21.0.12.1+1-LTS m<br>
threads in the dump: 17<br>
$ grep -m1 -A1 '^"main"' dump.txt | sed -E 's/ \\[[0-9]+\\].*//'<br>
"main" #1<br>
&nbsp;&nbsp;&nbsp;java.lang.Thread.State: TIMED_WAITING (sleeping)<br>
$ kill -0 $J &amp;&amp; echo "the JVM is still running after SIGQUIT"<br>
the JVM is still running after SIGQUIT<br>
$ kill -TERM $J; wait $J; echo "exit code $?"<br>
exit code 143</div>
<p><code>kill -l 143</code> answers <code>TERM</code>: bash knows the 128 + N convention of slide 10 and undoes it — the fastest way to decode an unfamiliar exit code. The JVM block shows that "default action" depends on the program: for most programs SIGQUIT means "terminate and dump core", but the JVM installs a handler that prints a <strong>thread dump</strong> (every thread with its state and stack — 12 threads for an idle JVM, including the garbage collector, the JIT compilers and the signal dispatcher) and keeps running. This is how you diagnose a Spring Boot service that "hangs": <code>kill -3 &lt;pid&gt;</code> (or <code>jstack</code>, <code>jcmd &lt;pid&gt; Thread.print</code>) and read what the threads are waiting for — CS.3 uses it to find a deadlock.</p>
<p>Reading the table of the slide as a backend developer:</p>
<ul>
<li><strong>SIGTERM</strong> — "please stop". Default: terminate. Sent by <code>kill</code> without options, <code>docker stop</code>, <code>systemctl stop</code>, Kubernetes when it deletes a pod, every deploy. <em>Catch it and clean up</em> — slides 17–19.</li>
<li><strong>SIGINT</strong> — Ctrl+C in a terminal. Node and Java treat it like SIGTERM by default; your dev server stops on it.</li>
<li><strong>SIGHUP</strong> — "hang up": originally the modem line dropped; today the terminal or SSH session closed (slide 23). Daemons without a terminal reuse it by convention as "reload your configuration": <code>nginx -s reload</code> sends SIGHUP to the nginx master.</li>
<li><strong>SIGQUIT</strong> — Ctrl+\\ ; core dump by default, thread dump in the JVM.</li>
<li><strong>SIGCHLD</strong> — "one of your children changed state", default: ignored (the zombie fix of slide 12 catches it).</li>
<li><strong>SIGKILL / SIGSTOP</strong> — handled by the kernel itself; the process is not even told. The stop timeout of Docker, Kubernetes and systemd and the OOM killer all end with SIGKILL.</li>
</ul>
<p>➕ Signals also come from the hardware, through the kernel: SIGSEGV (bad memory access, 139), SIGFPE (integer division by zero), SIGBUS, SIGILL. And from the program's own I/O: SIGPIPE when writing to a pipe or socket whose reader has gone (exit 141 — lesson 10.A slide 10 runs <code>yes | head -1</code>); Node and Java ignore SIGPIPE and report <code>EPIPE</code> as an error instead. SIGUSR1/SIGUSR2 are free for applications (Node uses SIGUSR1 to start the inspector).</p>
<p class="pitfall">⚠️ <code>kill</code> does not mean kill: it means "send a signal", SIGTERM by default. <code>kill -9</code> is the one that kills, and it is the last resort, not the first.</p>`,
        `<p class="y-chinh">🎯 <strong>Tín hiệu</strong> (signal) là một thông điệp bất đồng bộ cực nhỏ — chỉ là một con số — được nhân giao cho tiến trình. Mỗi tín hiệu có một hành động mặc định (kết thúc, kết thúc kèm core dump, bỏ qua, dừng tạm, chạy tiếp) mà tiến trình có thể thay bằng một <strong>handler</strong> (hàm xử lý), trừ <strong>SIGKILL</strong> và <strong>SIGSTOP</strong>, không bao giờ bắt, chặn hay bỏ qua được. Các tín hiệu server cần biết: SIGTERM 15, SIGINT 2, SIGHUP 1, SIGQUIT 3, SIGCHLD 17, SIGKILL 9.</p>
<p>Danh sách trên slide là <code>kill -l</code>; chạy lại nó, rồi nhờ bash dịch số — và một mã thoát — ngược thành tên, cuối cùng gửi SIGQUIT cho một JVM đang ngủ:</p>
<div class="out"># Slide 14: danh sách tín hiệu, một mã thoát đổi ngược thành tên tín hiệu, và SIGQUIT xin JVM một bản thread dump<br>
$ kill -l | head -4<br>
&nbsp;1) SIGHUP	 2) SIGINT	 3) SIGQUIT	 4) SIGILL	 5) SIGTRAP<br>
&nbsp;6) SIGABRT	 7) SIGBUS	 8) SIGFPE	 9) SIGKILL	10) SIGUSR1<br>
11) SIGSEGV	12) SIGUSR2	13) SIGPIPE	14) SIGALRM	15) SIGTERM<br>
16) SIGSTKFLT	17) SIGCHLD	18) SIGCONT	19) SIGSTOP	20) SIGTSTP<br>
$ kill -l 9; kill -l 15; kill -l 143<br>
KILL<br>
TERM<br>
TERM<br>
$ java _Ngu &gt; dump.txt 2&gt;&amp;1 &amp; J=$!; sleep 1.5<br>
$ kill -QUIT $J; sleep 0.5<br>
$ grep -m1 'Full thread dump' dump.txt | cut -c1-60; echo "threads in the dump: $(grep -c '^"' dump.txt)"<br>
Full thread dump OpenJDK 64-Bit Server VM (21.0.12.1+1-LTS m<br>
threads in the dump: 17<br>
$ grep -m1 -A1 '^"main"' dump.txt | sed -E 's/ \\[[0-9]+\\].*//'<br>
"main" #1<br>
&nbsp;&nbsp;&nbsp;java.lang.Thread.State: TIMED_WAITING (sleeping)<br>
$ kill -0 $J &amp;&amp; echo "the JVM is still running after SIGQUIT"<br>
the JVM is still running after SIGQUIT<br>
$ kill -TERM $J; wait $J; echo "exit code $?"<br>
exit code 143</div>
<p><code>kill -l 143</code> trả lời <code>TERM</code>: bash biết quy ước 128 + N của slide 10 và đảo ngược nó — cách nhanh nhất để giải mã một mã thoát lạ. Khối JVM cho thấy "hành động mặc định" phụ thuộc vào chương trình: với hầu hết chương trình, SIGQUIT nghĩa là "kết thúc và ghi core dump", nhưng JVM cài một handler in ra <strong>thread dump</strong> (mọi luồng cùng trạng thái và ngăn xếp của nó — 12 luồng cho một JVM đang rảnh, gồm bộ dọn rác, các trình biên dịch JIT và luồng phân phát tín hiệu) rồi chạy tiếp. Đây là cách chẩn đoán một dịch vụ Spring Boot "bị treo": <code>kill -3 &lt;pid&gt;</code> (hoặc <code>jstack</code>, <code>jcmd &lt;pid&gt; Thread.print</code>) rồi đọc xem các luồng đang chờ cái gì — CS.3 dùng nó để tìm một deadlock.</p>
<p>Đọc bảng trên slide bằng con mắt dev backend:</p>
<ul>
<li><strong>SIGTERM</strong> — "làm ơn dừng lại". Mặc định: kết thúc. Do <code>kill</code> không kèm tuỳ chọn, <code>docker stop</code>, <code>systemctl stop</code>, Kubernetes khi xoá một pod, và mọi lần deploy gửi tới. <em>Hãy bắt nó và dọn dẹp</em> — slide 17–19.</li>
<li><strong>SIGINT</strong> — Ctrl+C trong terminal. Node và Java mặc định xử lý nó như SIGTERM; server dev của bạn dừng khi nhận nó.</li>
<li><strong>SIGHUP</strong> — "gác máy" (hang up): ban đầu là đường modem bị ngắt; ngày nay là terminal hoặc phiên SSH bị đóng (slide 23). Các daemon không có terminal dùng lại nó theo quy ước để "nạp lại cấu hình": <code>nginx -s reload</code> gửi SIGHUP cho tiến trình master của nginx.</li>
<li><strong>SIGQUIT</strong> — Ctrl+\\ ; mặc định ghi core dump, trong JVM là in thread dump.</li>
<li><strong>SIGCHLD</strong> — "một đứa con của bạn vừa đổi trạng thái", mặc định: bỏ qua (cách sửa zombie ở slide 12 bắt nó).</li>
<li><strong>SIGKILL / SIGSTOP</strong> — do chính nhân xử lý; tiến trình thậm chí không được báo. Hạn chờ khi dừng của Docker, Kubernetes, systemd và OOM killer đều kết thúc bằng SIGKILL.</li>
</ul>
<p>➕ Tín hiệu còn đến từ phần cứng, qua nhân: SIGSEGV (truy cập bộ nhớ sai, 139), SIGFPE (chia số nguyên cho 0), SIGBUS, SIGILL. Và từ chính I/O của chương trình: SIGPIPE khi ghi vào một ống hay socket mà đầu đọc đã đi mất (thoát 141 — bài 10.A slide 10 chạy <code>yes | head -1</code>); Node và Java bỏ qua SIGPIPE và báo lỗi <code>EPIPE</code> thay vào đó. SIGUSR1/SIGUSR2 để trống cho ứng dụng tự dùng (Node dùng SIGUSR1 để bật inspector).</p>
<p class="pitfall">⚠️ <code>kill</code> không có nghĩa là giết: nó nghĩa là "gửi một tín hiệu", mặc định SIGTERM. <code>kill -9</code> mới là cái giết, và nó là biện pháp cuối cùng, không phải đầu tiên.</p>`],
      [15, 'Catching a signal in bash: trap',
        `<p class="y-chinh">🎯 In bash, <code>trap 'commands' SIGNAL</code> installs a handler: here SIGHUP reloads, SIGTERM and SIGINT run <code>cleanup</code> (remove the lock file, exit 0). <code>kill -9</code> skips every trap — the worker dies with 137 and the stale lock file stays. Lesson of the slide: always send SIGTERM first.</p>
<p>The worker script of the slide (<code>_worker.sh</code>), unchanged:</p>
<pre><code class="language-bash">#!/bin/bash
cleanup() { echo "worker: got $1 -&gt; removing worker.lock, bye"; rm -f worker.lock; exit 0; }
trap 'cleanup SIGTERM' TERM
trap 'cleanup SIGINT'  INT
trap 'echo "worker: SIGHUP -&gt; reload config (keep running)"' HUP
touch worker.lock
echo "worker: started, lock created"
while true; do sleep 0.1; done</code></pre>
<p>and the session that drives it — send SIGHUP, then SIGTERM, then start a second worker and send SIGKILL:</p>
<div class="out"># Slide 15: trap in bash — HUP reloads, TERM cleans up; kill -9 skips every trap<br>
$ ./_worker.sh &amp; W=$!; sleep 0.5<br>
worker: started, lock created<br>
$ kill -HUP $W; sleep 0.5<br>
worker: SIGHUP -&gt; reload config (keep running)<br>
$ kill -TERM $W; wait $W; echo "exit code $?"<br>
worker: got SIGTERM -&gt; removing worker.lock, bye<br>
exit code 0<br>
$ ls worker.lock<br>
ls: cannot access 'worker.lock': No such file or directory<br>
$ ./_worker.sh &amp; W=$!; sleep 0.5<br>
worker: started, lock created<br>
$ kill -9 $W; wait $W; echo "exit code $? (trap never ran)"<br>
bash: &nbsp;&nbsp;&nbsp;36 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./_worker.sh<br>
exit code 137 (trap never ran)<br>
$ ls worker.lock<br>
worker.lock</div>
<p>SIGHUP runs the third trap: the worker prints "reload config" and keeps running — this is the reload pattern of nginx, PostgreSQL (<code>pg_ctl reload</code>) and many daemons. SIGTERM runs <code>cleanup</code>: the lock is removed and the script exits with <strong>0</strong>, because the handler chose the exit code — a clean shutdown is not an error. Against <code>kill -9</code> the script has no say at all: bash reports <code>Killed</code>, the exit code is <strong>137</strong>, and <code>ls</code> still finds <code>worker.lock</code>. The next start of a worker that refuses to run while a lock exists would now fail, until a human deletes the file — exactly why "<code>kill -9</code> first" causes the incidents the slide's red box lists: stale lock files, half-written files, open transactions that the database keeps until they time out.</p>
<p>➕ Four details of bash traps worth knowing. (1) A trap runs only <em>between</em> commands: if the script is inside a long foreground command (<code>sleep 300</code>), bash waits for it to finish before running the trap — the worker here sleeps in 0.1 s slices for that reason; in longer scripts, start the long command in the background and <code>wait</code> for it, because <code>wait</code> <em>is</em> interrupted by a trapped signal. (2) <code>trap … EXIT</code> runs on every exit — normal end, <code>exit</code>, or a trapped signal — the best place for cleanup (exercise 6). (3) A script in a Docker <code>ENTRYPOINT</code> that traps SIGTERM still has to stop its children itself. (4) <code>trap - TERM</code> restores the default; <code>trap '' TERM</code> ignores the signal (do not do that in a server).</p>
<p class="meo">🧠 Order of escalation every ops runbook uses: SIGTERM, wait 10–30 s, then SIGKILL — exactly what <code>docker stop</code> and Kubernetes automate.</p>`,
        `<p class="y-chinh">🎯 Trong bash, <code>trap 'các lệnh' TÍN_HIỆU</code> cài một handler: ở đây SIGHUP nạp lại cấu hình, SIGTERM và SIGINT chạy <code>cleanup</code> (xoá tệp khoá, thoát 0). <code>kill -9</code> bỏ qua mọi trap — worker chết với 137 và tệp khoá cũ nằm lại. Bài học của slide: luôn gửi SIGTERM trước.</p>
<p>Script worker của slide (<code>_worker.sh</code>), giữ nguyên:</p>
<pre><code class="language-bash">#!/bin/bash
cleanup() { echo "worker: got $1 -&gt; removing worker.lock, bye"; rm -f worker.lock; exit 0; }
trap 'cleanup SIGTERM' TERM
trap 'cleanup SIGINT'  INT
trap 'echo "worker: SIGHUP -&gt; reload config (keep running)"' HUP
touch worker.lock
echo "worker: started, lock created"
while true; do sleep 0.1; done</code></pre>
<p>và phiên điều khiển nó — gửi SIGHUP, rồi SIGTERM, rồi khởi động worker thứ hai và gửi SIGKILL:</p>
<div class="out"># Slide 15: trap trong bash — HUP nạp lại, TERM dọn dẹp; kill -9 bỏ qua mọi trap<br>
$ ./_worker.sh &amp; W=$!; sleep 0.5<br>
worker: started, lock created<br>
$ kill -HUP $W; sleep 0.5<br>
worker: SIGHUP -&gt; reload config (keep running)<br>
$ kill -TERM $W; wait $W; echo "exit code $?"<br>
worker: got SIGTERM -&gt; removing worker.lock, bye<br>
exit code 0<br>
$ ls worker.lock<br>
ls: cannot access 'worker.lock': No such file or directory<br>
$ ./_worker.sh &amp; W=$!; sleep 0.5<br>
worker: started, lock created<br>
$ kill -9 $W; wait $W; echo "exit code $? (trap never ran)"<br>
bash: &nbsp;&nbsp;&nbsp;36 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./_worker.sh<br>
exit code 137 (trap never ran)<br>
$ ls worker.lock<br>
worker.lock</div>
<p>SIGHUP chạy trap thứ ba: worker in "reload config" và chạy tiếp — đây là mẫu nạp lại cấu hình của nginx, PostgreSQL (<code>pg_ctl reload</code>) và nhiều daemon. SIGTERM chạy <code>cleanup</code>: tệp khoá bị xoá và script thoát với <strong>0</strong>, vì chính handler chọn mã thoát — tắt máy sạch sẽ không phải là lỗi. Trước <code>kill -9</code> thì script không có tiếng nói nào: bash báo <code>Killed</code>, mã thoát là <strong>137</strong>, và <code>ls</code> vẫn tìm thấy <code>worker.lock</code>. Lần khởi động tiếp theo của một worker vốn từ chối chạy khi còn tệp khoá giờ sẽ thất bại, cho tới khi có người xoá tay tệp đó — đúng lý do "<code>kill -9</code> trước tiên" gây ra các sự cố liệt kê trong ô đỏ của slide: tệp khoá cũ, tệp ghi dở, giao dịch còn mở mà cơ sở dữ liệu giữ cho tới khi hết hạn.</p>
<p>➕ Bốn chi tiết của trap trong bash nên biết. (1) Trap chỉ chạy <em>giữa</em> các lệnh: nếu script đang ở trong một lệnh tiền cảnh dài (<code>sleep 300</code>), bash chờ nó xong rồi mới chạy trap — worker ở đây ngủ từng lát 0,1 giây chính vì vậy; trong script dài hơn, hãy chạy lệnh dài ở chế độ nền rồi <code>wait</code> nó, vì <code>wait</code> <em>bị</em> một tín hiệu có trap cắt ngang. (2) <code>trap … EXIT</code> chạy ở mọi lần thoát — kết thúc bình thường, <code>exit</code>, hay một tín hiệu có trap — chỗ tốt nhất để dọn dẹp (bài tập 6). (3) Một script trong <code>ENTRYPOINT</code> của Docker có trap SIGTERM vẫn phải tự dừng các tiến trình con của nó. (4) <code>trap - TERM</code> trả về mặc định; <code>trap '' TERM</code> bỏ qua tín hiệu (đừng làm thế với một server).</p>
<p class="meo">🧠 Thứ tự leo thang mà mọi sổ tay vận hành dùng: SIGTERM, chờ 10–30 giây, rồi SIGKILL — đúng thứ <code>docker stop</code> và Kubernetes tự động hoá.</p>`],
      [16, 'A signal handler in C — and the one rule',
        `<p class="y-chinh">🎯 In C, <code>sigaction()</code> installs a handler. The kernel refuses SIGKILL and SIGSTOP (<code>EINVAL</code>, "Invalid argument"). <strong>The one rule</strong> (<code>man 7 signal-safety</code>): a handler can interrupt your code anywhere — even inside <code>malloc</code> or <code>printf</code> — so it only <strong>sets a flag</strong> of type <code>volatile sig_atomic_t</code>; the main loop sees the flag and does the real cleanup.</p>
<pre><code class="language-c">// Slide 16: a C signal handler that only sets a flag; SIGKILL and SIGSTOP cannot be caught
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;
static volatile sig_atomic_t stop = 0;                // the handler only sets a flag
static void on_term(int sig) { (void)sig; stop = 1; }

static int server(void) {
    struct sigaction sa = { .sa_handler = on_term };
    sigemptyset(&amp;sa.sa_mask);
    sigaction(SIGTERM, &amp;sa, NULL);
    sigaction(SIGINT,  &amp;sa, NULL);
    if (sigaction(SIGKILL, &amp;sa, NULL) == -1) printf("server: sigaction(SIGKILL): %s\\n", strerror(errno));
    if (sigaction(SIGSTOP, &amp;sa, NULL) == -1) printf("server: sigaction(SIGSTOP): %s\\n", strerror(errno));
    printf("server %d: running, waiting for SIGTERM\\n", getpid());
    fflush(stdout);
    while (!stop) usleep(10000);                      // "serve requests"
    printf("server: SIGTERM seen -&gt; finish work, close DB, flush logs\\n");
    return 0;                                         // clean exit
}
int main(void) {
    pid_t p = fork();
    if (p == 0) return server();
    usleep(300000);
    printf("main: kill(%d, SIGTERM)\\n", p);
    fflush(stdout);
    kill(p, SIGTERM);
    int st;
    waitpid(p, &amp;st, 0);
    printf("main: server exited normally=%d, status=%d\\n", WIFEXITED(st), WEXITSTATUS(st));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread xu-ly-tin-hieu.c -o xu-ly-tin-hieu &amp;&amp; ./xu-ly-tin-hieu<br>
server: sigaction(SIGKILL): Invalid argument<br>
server: sigaction(SIGSTOP): Invalid argument<br>
server 13: running, waiting for SIGTERM<br>
main: kill(13, SIGTERM)<br>
server: SIGTERM seen -&gt; finish work, close DB, flush logs<br>
main: server exited normally=1, status=0</div>
<p>The program forks itself: the child is the "server", the parent plays the role of <code>docker stop</code>. Read the output from the top. The server first tries to install the same handler for SIGKILL and SIGSTOP and the kernel answers <code>Invalid argument</code> twice — there is no way, even for root, to catch them; that guarantee is what lets an administrator always stop a runaway process. Then the server loops "serving requests"; the parent sends SIGTERM; the handler runs — one assignment, <code>stop = 1</code> — and returns; the loop sees the flag, prints its cleanup line and returns 0. The parent learns "exited normally, status 0": SIGTERM caught and handled is not a death by signal.</p>
<p>Why such a strict rule? A signal is delivered <em>between any two machine instructions</em> of the main program. If the main program is halfway through <code>malloc</code> (holding glibc's heap lock) and the handler calls <code>printf</code>, which calls <code>malloc</code>, the handler waits forever for a lock its own thread holds — a deadlock in a single thread. If the handler changes a linked list that the main program is in the middle of updating, the list is corrupted. So POSIX defines a short list of <strong>async-signal-safe</strong> functions (<code>write</code>, <code>_exit</code>, <code>kill</code>, <code>waitpid</code>… — <code>printf</code> and <code>malloc</code> are not on it), and <code>volatile sig_atomic_t</code> guarantees that the flag is read fresh on every loop and written in one indivisible step. The <code>waitpid</code> loop of slide 12 is allowed in a handler for that reason.</p>
<p>➕ Modern alternatives keep the same idea — "turn the signal into an ordinary event" — without a flag: <code>signalfd()</code> (read signals from a file descriptor in your epoll loop, CS.4), the "self-pipe trick" (the handler writes one byte to a pipe), or a dedicated thread blocked in <code>sigwait()</code>. This is exactly what the runtimes do for you: Node's libuv catches the signal with a tiny handler that writes to a pipe, and your <code>process.on('SIGTERM')</code> callback runs later, on the event loop; the JVM has a "Signal Dispatcher" thread (you saw it in the thread dump of slide 14) that starts the shutdown hooks on normal threads.</p>
<p class="pitfall">⚠️ <code>printf</code> inside a handler "works" in every small test and deadlocks once in a million in production. In C, set a flag; in Node and Java, the runtime already moved you out of the handler.</p>`,
        `<p class="y-chinh">🎯 Trong C, <code>sigaction()</code> cài một handler. Nhân từ chối SIGKILL và SIGSTOP (<code>EINVAL</code>, "Invalid argument" — đối số không hợp lệ). <strong>Quy tắc duy nhất</strong> (<code>man 7 signal-safety</code>): handler có thể cắt ngang mã của bạn ở bất kỳ đâu — kể cả bên trong <code>malloc</code> hay <code>printf</code> — nên nó chỉ <strong>bật một cờ</strong> kiểu <code>volatile sig_atomic_t</code>; vòng lặp chính thấy cờ rồi làm việc dọn dẹp thật sự.</p>
<pre><code class="language-c">// Slide 16: handler C chỉ bật một cờ; SIGKILL và SIGSTOP không bắt được
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;
static volatile sig_atomic_t stop = 0;                // handler chỉ bật một cờ
static void on_term(int sig) { (void)sig; stop = 1; }

static int server(void) {
    struct sigaction sa = { .sa_handler = on_term };
    sigemptyset(&amp;sa.sa_mask);
    sigaction(SIGTERM, &amp;sa, NULL);
    sigaction(SIGINT,  &amp;sa, NULL);
    if (sigaction(SIGKILL, &amp;sa, NULL) == -1) printf("server: sigaction(SIGKILL): %s\\n", strerror(errno));
    if (sigaction(SIGSTOP, &amp;sa, NULL) == -1) printf("server: sigaction(SIGSTOP): %s\\n", strerror(errno));
    printf("server %d: running, waiting for SIGTERM\\n", getpid());
    fflush(stdout);
    while (!stop) usleep(10000);                      // "phục vụ request"
    printf("server: SIGTERM seen -&gt; finish work, close DB, flush logs\\n");
    return 0;                                         // thoát sạch
}
int main(void) {
    pid_t p = fork();
    if (p == 0) return server();
    usleep(300000);
    printf("main: kill(%d, SIGTERM)\\n", p);
    fflush(stdout);
    kill(p, SIGTERM);
    int st;
    waitpid(p, &amp;st, 0);
    printf("main: server exited normally=%d, status=%d\\n", WIFEXITED(st), WEXITSTATUS(st));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread xu-ly-tin-hieu.c -o xu-ly-tin-hieu &amp;&amp; ./xu-ly-tin-hieu<br>
server: sigaction(SIGKILL): Invalid argument<br>
server: sigaction(SIGSTOP): Invalid argument<br>
server 13: running, waiting for SIGTERM<br>
main: kill(13, SIGTERM)<br>
server: SIGTERM seen -&gt; finish work, close DB, flush logs<br>
main: server exited normally=1, status=0</div>
<p>Chương trình tự fork: con là "server", cha đóng vai <code>docker stop</code>. Đọc output từ trên xuống. Server trước hết thử cài cùng handler cho SIGKILL và SIGSTOP và nhân trả lời <code>Invalid argument</code> hai lần — không có cách nào, kể cả với root, để bắt chúng; chính sự bảo đảm đó cho phép người quản trị luôn dừng được một tiến trình chạy mất kiểm soát. Rồi server lặp "phục vụ request"; cha gửi SIGTERM; handler chạy — đúng một phép gán, <code>stop = 1</code> — rồi trả về; vòng lặp thấy cờ, in dòng dọn dẹp và trả về 0. Cha biết được "thoát bình thường, trạng thái 0": SIGTERM được bắt và xử lý thì không phải là chết do tín hiệu.</p>
<p>Sao quy tắc lại khắt khe vậy? Tín hiệu được giao <em>giữa hai lệnh máy bất kỳ</em> của chương trình chính. Nếu chương trình chính đang ở giữa <code>malloc</code> (đang giữ khoá heap của glibc) và handler gọi <code>printf</code>, mà <code>printf</code> lại gọi <code>malloc</code>, handler sẽ chờ mãi một khoá do chính luồng của nó đang giữ — một deadlock chỉ trong một luồng. Nếu handler sửa một danh sách liên kết mà chương trình chính đang cập nhật dở, danh sách bị hỏng. Vì vậy POSIX định nghĩa một danh sách ngắn các hàm <strong>async-signal-safe</strong> (an toàn khi gọi từ handler: <code>write</code>, <code>_exit</code>, <code>kill</code>, <code>waitpid</code>… — <code>printf</code> và <code>malloc</code> không có trong đó), còn <code>volatile sig_atomic_t</code> bảo đảm cờ được đọc mới ở mỗi vòng lặp và được ghi trong một bước không chia cắt. Vòng <code>waitpid</code> ở slide 12 được phép đặt trong handler chính vì lý do đó.</p>
<p>➕ Các cách hiện đại giữ nguyên ý tưởng — "biến tín hiệu thành một sự kiện bình thường" — mà không cần cờ: <code>signalfd()</code> (đọc tín hiệu từ một file descriptor trong vòng epoll của bạn, CS.4), "mẹo ống tự ghi" (self-pipe trick — handler ghi một byte vào một ống), hoặc một luồng riêng chặn trong <code>sigwait()</code>. Đó chính là thứ các runtime làm sẵn cho bạn: libuv của Node bắt tín hiệu bằng một handler tí hon ghi vào một ống, và callback <code>process.on('SIGTERM')</code> của bạn chạy sau đó, trên event loop; JVM có luồng "Signal Dispatcher" (bạn đã thấy nó trong thread dump ở slide 14) khởi chạy các shutdown hook trên các luồng bình thường.</p>
<p class="pitfall">⚠️ <code>printf</code> bên trong handler "chạy được" trong mọi bài thử nhỏ và deadlock một lần trong một triệu trên production. Trong C, hãy bật cờ; trong Node và Java, runtime đã đưa bạn ra khỏi handler rồi.</p>`],
      [17, 'Graceful shutdown: what stop nicely means',
        `<p class="y-chinh">🎯 Graceful shutdown is four steps after SIGTERM: <strong>1 · stop accepting</strong> (close the listening socket), <strong>2 · drain</strong> (finish in-flight requests), <strong>3 · clean up</strong> (DB pool, queues, logs), <strong>4 · exit 0</strong> — all before a deadline, after which the orchestrator sends SIGKILL (exit 137): <strong>Docker 10 s · Kubernetes 30 s · systemd 90 s</strong>. Your app's own safety timer must be shorter.</p>
<p>The same story as a sequence diagram, with the load balancer in it — the part the timeline on the slide only mentions:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/6c50d07654d585d0da413160d23b9861d0e8e418.svg" alt="Graceful shutdown during a deploy: who does what between SIGTERM and SIGKILL" loading="lazy" /><p class="chu-thich">🧩 Graceful shutdown during a deploy: who does what between SIGTERM and SIGKILL</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Graceful shutdown during a deploy: who does what between SIGTERM and SIGKILL
skinparam sequenceMessageAlign center
participant "Orchestrator\\n(Docker / Kubernetes / systemd)" as O
participant "Load balancer\\n(nginx / Service)" as LB
participant "Your app\\n(Node / Spring)" as A
database "PostgreSQL" as DB
O -&gt; LB : take the old instance out\\n(K8s: endpoint removed; preStop sleep helps)
O -&gt; A : SIGTERM (t = 0)
activate A
A -&gt; A : 1. stop accepting\\n(close the listening socket)
note over LB, A : no NEW requests reach the old instance
A -&gt; DB : 2. finish in-flight requests\\n(commit or roll back)
DB --&gt; A : done
A -&gt; DB : 3. close the connection pool
A -&gt; A : flush logs, queues, metrics
A --&gt; O : 4. exit 0 (before the deadline)
deactivate A
note over O, A
  deadline: Docker 10 s, Kubernetes 30 s, systemd 90 s
  -&gt; if the app is still running: SIGKILL, exit code 137
  your own safety timer must be SHORTER than this deadline
end note
@enduml</code></pre></details>
<p>Why each step, in order. <strong>Stop accepting first</strong>, so that no new work starts that you would have to abandon; in Node this is <code>server.close()</code>, in Tomcat the connector is paused. <strong>Drain</strong>: a request that has already begun — a payment, an upload, a long report — is allowed to finish, so the user gets a real answer instead of "connection reset". <strong>Clean up</strong>: commit or roll back what is open, return connections to PostgreSQL (otherwise the server keeps "idle" sessions until its timeout, and a burst of deploys can exhaust <code>max_connections</code>), flush buffered logs and metrics, stop consuming from a queue so that unacknowledged messages are redelivered to another instance. <strong>Exit 0</strong>: the orchestrator records a clean stop and moves on.</p>
<p>Every <strong>deploy</strong> is a shutdown of the old version. Without these steps, each release produces a small burst of errors — 502 from nginx, "socket hang up" in clients — that nobody can reproduce, because it only happens during the few seconds of a rollout. The card row on the slide lists the knobs: Docker <code>docker stop -t 30</code>, <code>--stop-timeout</code> and Compose <code>stop_grace_period</code>; Kubernetes <code>terminationGracePeriodSeconds</code> (30 by default) and a <code>preStop</code> sleep, which gives the endpoint controller time to remove the pod from the Service <em>before</em> the app stops accepting — otherwise the load balancer may still send a few requests to a closed socket; systemd <code>KillSignal=</code> and <code>TimeoutStopSec=</code> (90 s by default, from <code>DefaultTimeoutStopSec</code>), after which it sends SIGKILL to every process of the service's cgroup.</p>
<p>➕ The rule in red on the slide — "your app's own timer must be SHORTER" — exists because the app's timer is your last chance to log what was still running and exit in a controlled way. If the orchestrator's deadline is shorter, SIGKILL arrives first, your timer never fires, and you lose exactly the information you needed. Slide 25 shows this mismatch in this very website.</p>
<p class="meo">🧠 Remember the order with four verbs: <em>refuse, finish, close, leave</em>.</p>`,
        `<p class="y-chinh">🎯 Tắt êm (graceful shutdown) là bốn bước sau SIGTERM: <strong>1 · ngừng nhận</strong> (đóng socket đang lắng nghe), <strong>2 · làm nốt</strong> (drain — hoàn thành các request đang chạy dở), <strong>3 · dọn dẹp</strong> (pool kết nối DB, hàng đợi, log), <strong>4 · thoát 0</strong> — tất cả trước một hạn chót, quá hạn thì bộ điều phối (orchestrator) gửi SIGKILL (mã 137): <strong>Docker 10 giây · Kubernetes 30 giây · systemd 90 giây</strong>. Hẹn giờ an toàn của chính ứng dụng phải ngắn hơn.</p>
<p>Cùng câu chuyện đó dưới dạng sơ đồ tuần tự, có thêm bộ cân bằng tải — phần mà dòng thời gian trên slide chỉ nhắc tới:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/6c50d07654d585d0da413160d23b9861d0e8e418.svg" alt="Tắt êm khi deploy: ai làm gì giữa SIGTERM và SIGKILL" loading="lazy" /><p class="chu-thich">🧩 Tắt êm khi deploy: ai làm gì giữa SIGTERM và SIGKILL</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Tắt êm khi deploy: ai làm gì giữa SIGTERM và SIGKILL
skinparam sequenceMessageAlign center
participant "Orchestrator\\n(Docker / Kubernetes / systemd)" as O
participant "Load balancer\\n(nginx / Service)" as LB
participant "Your app\\n(Node / Spring)" as A
database "PostgreSQL" as DB
O -&gt; LB : take the old instance out\\n(K8s: endpoint removed; preStop sleep helps)
O -&gt; A : SIGTERM (t = 0)
activate A
A -&gt; A : 1. stop accepting\\n(close the listening socket)
note over LB, A : no NEW requests reach the old instance
A -&gt; DB : 2. finish in-flight requests\\n(commit or roll back)
DB --&gt; A : done
A -&gt; DB : 3. close the connection pool
A -&gt; A : flush logs, queues, metrics
A --&gt; O : 4. exit 0 (before the deadline)
deactivate A
note over O, A
  deadline: Docker 10 s, Kubernetes 30 s, systemd 90 s
  -&gt; if the app is still running: SIGKILL, exit code 137
  your own safety timer must be SHORTER than this deadline
end note
@enduml</code></pre></details>
<p>Vì sao từng bước, theo thứ tự. <strong>Ngừng nhận trước tiên</strong>, để không có việc mới nào bắt đầu mà bạn sẽ phải bỏ dở; trong Node là <code>server.close()</code>, trong Tomcat là tạm dừng connector. <strong>Làm nốt</strong>: một request đã bắt đầu — một lần thanh toán, một lần tải lên, một báo cáo dài — được phép chạy xong, để người dùng nhận câu trả lời thật thay vì "connection reset". <strong>Dọn dẹp</strong>: commit hoặc rollback những gì đang mở, trả kết nối về cho PostgreSQL (nếu không, server giữ các phiên "idle" cho tới khi hết hạn, và một loạt deploy liên tiếp có thể làm cạn <code>max_connections</code>), xả log và số đo đang đệm, ngừng nhận việc từ hàng đợi để các thông điệp chưa xác nhận được giao lại cho bản khác. <strong>Thoát 0</strong>: bộ điều phối ghi nhận một lần dừng sạch và đi tiếp.</p>
<p>Mỗi lần <strong>deploy</strong> là một lần tắt phiên bản cũ. Thiếu các bước này, mỗi lần phát hành sinh ra một loạt lỗi nhỏ — 502 từ nginx, "socket hang up" ở client — mà không ai tái hiện được, vì nó chỉ xảy ra trong vài giây của đợt triển khai. Hàng thẻ trên slide liệt kê các nút vặn: Docker <code>docker stop -t 30</code>, <code>--stop-timeout</code> và <code>stop_grace_period</code> của Compose; Kubernetes <code>terminationGracePeriodSeconds</code> (mặc định 30) và một lệnh <code>preStop</code> sleep, cho bộ điều khiển endpoint thời gian gỡ pod khỏi Service <em>trước</em> khi ứng dụng ngừng nhận — nếu không bộ cân bằng tải có thể vẫn gửi vài request tới một socket đã đóng; systemd <code>KillSignal=</code> và <code>TimeoutStopSec=</code> (mặc định 90 giây, từ <code>DefaultTimeoutStopSec</code>), quá hạn nó gửi SIGKILL cho mọi tiến trình trong cgroup của dịch vụ.</p>
<p>➕ Quy tắc màu đỏ trên slide — "hẹn giờ của chính ứng dụng phải NGẮN HƠN" — tồn tại vì hẹn giờ của ứng dụng là cơ hội cuối cùng để ghi log những gì còn đang chạy và thoát một cách có kiểm soát. Nếu hạn chót của bộ điều phối ngắn hơn, SIGKILL tới trước, hẹn giờ của bạn không bao giờ chạy, và bạn mất đúng thông tin mình cần. Slide 25 cho thấy sự lệch này ở chính website này.</p>
<p class="meo">🧠 Nhớ thứ tự bằng bốn động từ: <em>từ chối, làm nốt, đóng lại, rời đi</em>.</p>`],
      [18, 'Graceful shutdown in Node.js — measured',
        `<p class="y-chinh">🎯 Measured: a request that takes a while is in flight when SIGTERM arrives. <strong>Naive</strong> (no handler): the in-flight request gets an error, new connections are refused, exit code 143. <strong>Graceful</strong> (<code>process.on('SIGTERM')</code> + <code>server.close(callback)</code>): new connections are refused, the in-flight order completes, the process exits 0.</p>
<p>The slide shows a run with two <code>curl</code> clients against a 2-second request. The course container has no <code>curl</code>, so the same experiment is written as one Node program: the parent forks the server as a child process (slide 7 again), sends a 1-second request, sends SIGTERM 0.2 s later, tries a new request, and prints what happened — once without and once with the handler:</p>
<pre><code class="language-javascript">// Slide 18: graceful shutdown in Node — a slow request is in flight when SIGTERM arrives
const { fork } = require('child_process');
const http = require('http');

if (process.argv[2] === 'server') {                     // ---- the server (child process)
  const server = http.createServer((req, res) =&gt; setTimeout(() =&gt; res.end(&#96;done &#36;{req.url}&#96;), 1000));
  server.listen(0, () =&gt; process.send(server.address().port));
  if (process.env.GRACEFUL) {
    process.on('SIGTERM', () =&gt; {
      console.log('  server: SIGTERM -&gt; stop accepting, finish in-flight requests');
      server.close(() =&gt; {                              // runs after the last request
        console.log('  server: last request done -&gt; close DB pool, exit 0');
        process.exit(0);
      });
      setTimeout(() =&gt; process.exit(1), 10_000).unref(); // safety net, shorter than the orchestrator's deadline
    });
  }
  return;
}

// ---- the test (parent): start the server, send a 1-second request, SIGTERM it 0.2 s later
const get = (port, path) =&gt; new Promise((ok) =&gt; http.get({ port, path, agent: false }, (r) =&gt; {
  let b = ''; r.on('data', (d) =&gt; (b += d)); r.on('end', () =&gt; ok(b));
}).on('error', (e) =&gt; ok(&#96;error &#36;{e.code}&#96;)));
const wait = (ms) =&gt; new Promise((ok) =&gt; setTimeout(ok, ms));

(async () =&gt; {
  for (const mode of ['naive', 'graceful']) {
    console.log(&#96;=== &#36;{mode} ===&#96;);
    const child = fork(__filename, ['server'], { env: { ...process.env, GRACEFUL: mode === 'graceful' ? '1' : '' } });
    const exited = new Promise((ok) =&gt; child.once('exit', (code, sig) =&gt; ok(code ?? 128 + require('os').constants.signals[sig])));
    const port = await new Promise((ok) =&gt; child.once('message', ok));
    const inflight = get(port, '/order-42');           // takes 1 s
    await wait(200);
    console.log('  test: SIGTERM sent while /order-42 is in flight');
    child.kill('SIGTERM');
    await wait(100);
    const fresh = await get(port, '/new');
    const old = await inflight;
    const code = await exited;
    console.log(&#96;  test: new request  -&gt; &#36;{fresh}&#96;);
    console.log(&#96;  test: in-flight    -&gt; &#36;{old}&#96;);
    console.log(&#96;  test: server exit code &#36;{code}&#96;);
  }
})();</code></pre>
<div class="out">$ node tat-em.js<br>
=== naive ===<br>
&nbsp;&nbsp;test: SIGTERM sent while /order-42 is in flight<br>
&nbsp;&nbsp;test: new request &nbsp;-&gt; error ECONNREFUSED<br>
&nbsp;&nbsp;test: in-flight &nbsp;&nbsp;&nbsp;-&gt; error ECONNRESET<br>
&nbsp;&nbsp;test: server exit code 143<br>
=== graceful ===<br>
&nbsp;&nbsp;test: SIGTERM sent while /order-42 is in flight<br>
&nbsp;&nbsp;server: SIGTERM -&gt; stop accepting, finish in-flight requests<br>
&nbsp;&nbsp;server: last request done -&gt; close DB pool, exit 0<br>
&nbsp;&nbsp;test: new request &nbsp;-&gt; error ECONNREFUSED<br>
&nbsp;&nbsp;test: in-flight &nbsp;&nbsp;&nbsp;-&gt; done /order-42<br>
&nbsp;&nbsp;test: server exit code 0</div>
<p>The two runs differ only in the handler. Naive: Node's default action for SIGTERM is "terminate", so the process dies with the request half done — the client sees <code>ECONNRESET</code> (the TCP connection was reset: the "socket hang up" / 502 of a deploy), the new request gets <code>ECONNREFUSED</code> (nobody listening any more), and the exit code is 128 + 15. Graceful: the handler logs, calls <code>server.close()</code> — which closes the listening socket at once (the new request is refused, exactly as in the naive case: that is step 1, not a bug) but keeps open connections alive — the in-flight request completes with <code>done /order-42</code>, and only then does the callback of <code>close</code> run, close the pool and call <code>process.exit(0)</code>.</p>
<p>The handler, the only part that changed:</p>
<pre class="trich"><code class="language-javascript">if (process.env.GRACEFUL) {
  process.on('SIGTERM', () =&gt; {
    console.log('  server: SIGTERM -&gt; stop accepting, finish in-flight requests');
    server.close(() =&gt; {                              // runs after the last request
      console.log('  server: last request done -&gt; close DB pool, exit 0');
      process.exit(0);
    });
    setTimeout(() =&gt; process.exit(1), 10_000).unref(); // safety net, shorter than the orchestrator's deadline
  });
}</code></pre>
<p>➕ Three production details. (1) <strong>Keep-alive connections</strong>: <code>server.close()</code> waits for every open connection, and an idle keep-alive socket can stay open for a long time; since Node 19 <code>close()</code> also closes idle connections, and <code>server.closeIdleConnections()</code> / <code>closeAllConnections()</code> exist for older code — this test uses <code>agent: false</code> so that each request has its own connection. (2) <strong>The safety timer</strong> (<code>setTimeout(…, 10_000).unref()</code>) guarantees an exit even if a connection never ends; <code>unref()</code> stops the timer itself from keeping the process alive. It must be shorter than the orchestrator's deadline (slide 25). (3) Frameworks wrap all this: Fastify's <code>close()</code>, NestJS's <code>enableShutdownHooks()</code>, <code>@godaddy/terminus</code> for Express; Prisma needs <code>$disconnect()</code> in the cleanup step.</p>
<p class="pitfall">⚠️ <code>process.on('SIGTERM', () => process.exit(0))</code> is not graceful — it turns 143 into 0 and still cuts every in-flight request. The work is in <code>server.close</code> and waiting for its callback.</p>`,
        `<p class="y-chinh">🎯 Đo thật: một request mất một lúc mới xong đang chạy dở thì SIGTERM tới. <strong>Ngây thơ</strong> (không có handler): request đang chạy nhận lỗi, kết nối mới bị từ chối, mã thoát 143. <strong>Tắt êm</strong> (<code>process.on('SIGTERM')</code> + <code>server.close(callback)</code>): kết nối mới bị từ chối, đơn hàng đang xử lý được làm xong, tiến trình thoát 0.</p>
<p>Slide cho thấy một lần chạy với hai client <code>curl</code> và một request 2 giây. Container của môn học không có <code>curl</code>, nên cùng thí nghiệm được viết thành một chương trình Node: cha fork server thành một tiến trình con (lại là slide 7), gửi một request 1 giây, 0,2 giây sau gửi SIGTERM, thử thêm một request mới, rồi in ra chuyện gì đã xảy ra — một lần không có và một lần có handler:</p>
<pre><code class="language-javascript">// Slide 18: tắt êm trong Node — một request chậm đang chạy dở thì SIGTERM tới
const { fork } = require('child_process');
const http = require('http');

if (process.argv[2] === 'server') {                     // ---- server (tiến trình con)
  const server = http.createServer((req, res) =&gt; setTimeout(() =&gt; res.end(&#96;done &#36;{req.url}&#96;), 1000));
  server.listen(0, () =&gt; process.send(server.address().port));
  if (process.env.GRACEFUL) {
    process.on('SIGTERM', () =&gt; {
      console.log('  server: SIGTERM -&gt; stop accepting, finish in-flight requests');
      server.close(() =&gt; {                              // chạy sau request cuối cùng
        console.log('  server: last request done -&gt; close DB pool, exit 0');
        process.exit(0);
      });
      setTimeout(() =&gt; process.exit(1), 10_000).unref(); // lưới an toàn, ngắn hơn hạn của bộ điều phối
    });
  }
  return;
}

// ---- phần thử (cha): chạy server, gửi request 1 giây, 0,2 giây sau gửi SIGTERM
const get = (port, path) =&gt; new Promise((ok) =&gt; http.get({ port, path, agent: false }, (r) =&gt; {
  let b = ''; r.on('data', (d) =&gt; (b += d)); r.on('end', () =&gt; ok(b));
}).on('error', (e) =&gt; ok(&#96;error &#36;{e.code}&#96;)));
const wait = (ms) =&gt; new Promise((ok) =&gt; setTimeout(ok, ms));

(async () =&gt; {
  for (const mode of ['naive', 'graceful']) {
    console.log(&#96;=== &#36;{mode} ===&#96;);
    const child = fork(__filename, ['server'], { env: { ...process.env, GRACEFUL: mode === 'graceful' ? '1' : '' } });
    const exited = new Promise((ok) =&gt; child.once('exit', (code, sig) =&gt; ok(code ?? 128 + require('os').constants.signals[sig])));
    const port = await new Promise((ok) =&gt; child.once('message', ok));
    const inflight = get(port, '/order-42');           // mất 1 giây
    await wait(200);
    console.log('  test: SIGTERM sent while /order-42 is in flight');
    child.kill('SIGTERM');
    await wait(100);
    const fresh = await get(port, '/new');
    const old = await inflight;
    const code = await exited;
    console.log(&#96;  test: new request  -&gt; &#36;{fresh}&#96;);
    console.log(&#96;  test: in-flight    -&gt; &#36;{old}&#96;);
    console.log(&#96;  test: server exit code &#36;{code}&#96;);
  }
})();</code></pre>
<div class="out">$ node tat-em.js<br>
=== naive ===<br>
&nbsp;&nbsp;test: SIGTERM sent while /order-42 is in flight<br>
&nbsp;&nbsp;test: new request &nbsp;-&gt; error ECONNREFUSED<br>
&nbsp;&nbsp;test: in-flight &nbsp;&nbsp;&nbsp;-&gt; error ECONNRESET<br>
&nbsp;&nbsp;test: server exit code 143<br>
=== graceful ===<br>
&nbsp;&nbsp;test: SIGTERM sent while /order-42 is in flight<br>
&nbsp;&nbsp;server: SIGTERM -&gt; stop accepting, finish in-flight requests<br>
&nbsp;&nbsp;server: last request done -&gt; close DB pool, exit 0<br>
&nbsp;&nbsp;test: new request &nbsp;-&gt; error ECONNREFUSED<br>
&nbsp;&nbsp;test: in-flight &nbsp;&nbsp;&nbsp;-&gt; done /order-42<br>
&nbsp;&nbsp;test: server exit code 0</div>
<p>Hai lần chạy chỉ khác nhau ở handler. Ngây thơ: hành động mặc định của Node với SIGTERM là "kết thúc", nên tiến trình chết khi request mới làm được nửa chừng — client thấy <code>ECONNRESET</code> (kết nối TCP bị reset: chính là "socket hang up" / 502 của một lần deploy), request mới nhận <code>ECONNREFUSED</code> (không còn ai lắng nghe), và mã thoát là 128 + 15. Tắt êm: handler ghi log, gọi <code>server.close()</code> — lệnh này đóng ngay socket lắng nghe (request mới bị từ chối, y như trường hợp ngây thơ: đó là bước 1, không phải lỗi) nhưng giữ các kết nối đang mở — request đang chạy xong với <code>done /order-42</code>, và chỉ khi đó callback của <code>close</code> mới chạy, đóng pool và gọi <code>process.exit(0)</code>.</p>
<p>Handler, phần duy nhất thay đổi:</p>
<pre class="trich"><code class="language-javascript">if (process.env.GRACEFUL) {
  process.on('SIGTERM', () =&gt; {
    console.log('  server: SIGTERM -&gt; stop accepting, finish in-flight requests');
    server.close(() =&gt; {                              // chạy sau request cuối cùng
      console.log('  server: last request done -&gt; close DB pool, exit 0');
      process.exit(0);
    });
    setTimeout(() =&gt; process.exit(1), 10_000).unref(); // lưới an toàn, ngắn hơn hạn của bộ điều phối
  });
}</code></pre>
<p>➕ Ba chi tiết production. (1) <strong>Kết nối keep-alive</strong>: <code>server.close()</code> chờ mọi kết nối đang mở, và một socket keep-alive đang rảnh có thể mở rất lâu; từ Node 19 <code>close()</code> đóng luôn các kết nối rảnh, còn <code>server.closeIdleConnections()</code> / <code>closeAllConnections()</code> có sẵn cho mã cũ — bài thử này dùng <code>agent: false</code> để mỗi request có kết nối riêng. (2) <strong>Hẹn giờ an toàn</strong> (<code>setTimeout(…, 10_000).unref()</code>) bảo đảm tiến trình luôn thoát kể cả khi một kết nối không bao giờ kết thúc; <code>unref()</code> khiến chính hẹn giờ đó không giữ tiến trình sống. Nó phải ngắn hơn hạn chót của bộ điều phối (slide 25). (3) Các framework gói sẵn tất cả: <code>close()</code> của Fastify, <code>enableShutdownHooks()</code> của NestJS, <code>@godaddy/terminus</code> cho Express; Prisma cần <code>$disconnect()</code> trong bước dọn dẹp.</p>
<p class="pitfall">⚠️ <code>process.on('SIGTERM', () => process.exit(0))</code> không phải là tắt êm — nó đổi 143 thành 0 mà vẫn cắt mọi request đang chạy. Công việc nằm ở <code>server.close</code> và việc chờ callback của nó.</p>`],
      [19, 'Java hooks · Spring Boot graceful by default',
        `<p class="y-chinh">🎯 The JVM runs <strong>shutdown hooks</strong> (<code>Runtime.addShutdownHook</code>) on SIGTERM, SIGINT and <code>System.exit</code>, then still exits with <strong>143</strong> after a signal — that is normal. On SIGKILL no hook runs (137). Spring Boot 4.1.2 shuts down <strong>gracefully by default</strong> (<code>server.shutdown=graceful</code>, <code>spring.lifecycle.timeout-per-shutdown-phase=30s</code>).</p>
<p>The left half of the slide, run for real. The program starts a copy of itself as a worker with <code>ProcessBuilder</code> (fork + exec from Java), then stops it twice: <code>Process.destroy()</code>, which on Linux sends SIGTERM, and <code>destroyForcibly()</code>, which sends SIGKILL:</p>
<pre><code class="language-java">// Slide 19: a JVM shutdown hook runs on SIGTERM (Process.destroy) but not on SIGKILL (destroyForcibly)
import java.nio.file.Files;
import java.nio.file.Path;

public class TatMay {
    static final Path READY = Path.of("ready");

    public static void main(String[] args) throws Exception {
        if (args.length &gt; 0) { worker(); return; }
        for (String how : new String[] { "destroy", "destroyForcibly" }) {
            // inheritIO: the worker prints straight to our terminal (destroy() would close a pipe we read from)
            Files.deleteIfExists(READY);
            Process p = new ProcessBuilder("java", "-cp", ".", "TatMay", "worker").inheritIO().start();
            while (!Files.exists(READY)) Thread.sleep(50);              // wait until the hook is installed
            if (how.equals("destroy")) p.destroy(); else p.destroyForcibly();   // SIGTERM / SIGKILL on Linux
            System.out.println("main: " + how + "() -&gt; exit code " + p.waitFor());
        }
    }

    static void worker() throws Exception {
        Runtime.getRuntime().addShutdownHook(new Thread(() -&gt; {
            System.out.println("  worker hook: SIGTERM -&gt; stop taking jobs, finish the current one, close the pool");
            System.out.flush();
        }));
        System.out.println("  worker " + ProcessHandle.current().pid() + ": running jobs");
        System.out.flush();
        Files.createFile(READY);                                    // tell main: ready
        while (true) Thread.sleep(100);                             // "process jobs"
    }
}</code></pre>
<div class="out">$ javac TatMay.java &amp;&amp; java TatMay<br>
&nbsp;&nbsp;worker 49: running jobs<br>
&nbsp;&nbsp;worker hook: SIGTERM -&gt; stop taking jobs, finish the current one, close the pool<br>
main: destroy() -&gt; exit code 143<br>
&nbsp;&nbsp;worker 70: running jobs<br>
main: destroyForcibly() -&gt; exit code 137</div>
<p>With SIGTERM the hook prints its line and the exit code is <strong>143</strong>. This surprises people coming from Node: the hook ran and finished, so why not 0? Because the JVM was <em>terminated by a signal</em> — the hook is a cleanup that runs on the way out, not a decision to exit normally — and the launcher reports 128 + 15. Orchestrators know this: Docker, Kubernetes and systemd treat 143 after a stop request as a normal stop (systemd's <code>SuccessExitStatus=143</code> is a common line in Java unit files). With SIGKILL the hook does not run and the code is 137. The hook itself:</p>
<pre class="trich"><code class="language-java">static void worker() throws Exception {
    Runtime.getRuntime().addShutdownHook(new Thread(() -&gt; {
        System.out.println("  worker hook: SIGTERM -&gt; stop taking jobs, finish the current one, close the pool");
        System.out.flush();
    }));
    System.out.println("  worker " + ProcessHandle.current().pid() + ": running jobs");
    System.out.flush();
    Files.createFile(READY);                                    // tell main: ready
    while (true) Thread.sleep(100);                             // "process jobs"
}</code></pre>
<p><strong>Spring Boot</strong> (right half of the slide; cannot run in the course container, which has no network to download dependencies). While the deck was made, a minimal Spring Boot 4.1.2 app with a 3-second endpoint was started, the endpoint called, and SIGTERM sent 0.5 s later. The log showed <code>Commencing graceful shutdown. Waiting for active requests to complete</code>, then <code>Graceful shutdown complete</code> 2.5 s later, the request answered <code>done /slow</code>, and the JVM exited 143. With <code>server.shutdown=immediate</code> the same request received <code>curl: (52) Empty reply from server</code> and the JVM stopped in 0.1 s. The defaults were read from the metadata inside the built jar: <code>server.shutdown</code> = <code>graceful</code> and <code>timeout-per-shutdown-phase</code> = <code>30s</code>, matching the Spring documentation ("Graceful shutdown is enabled by default with all three embedded web servers").</p>
<p>➕ How Spring does it: Boot registers a JVM shutdown hook; on SIGTERM it closes the <code>ApplicationContext</code> in phases — first the web server stops accepting (Tomcat pauses its connectors) and waits for active requests up to the phase timeout, then <code>@PreDestroy</code> methods and <code>DisposableBean</code>s run, connection pools (HikariCP) close, and so on. Two traps: the phase timeout (30 s) must fit inside Kubernetes' 30-s grace period together with everything else — raise <code>terminationGracePeriodSeconds</code> or lower the timeout; and versions older than Spring Boot 3.4 had <code>immediate</code> as the default, so old projects need the property set explicitly.</p>
<p class="meo">🧠 Java exit codes after <code>docker stop</code>: 143 = stopped politely (hooks ran), 137 = killed (hooks did not run). Both can be "fine"; only 137 deserves a question.</p>`,
        `<p class="y-chinh">🎯 JVM chạy các <strong>shutdown hook</strong> (<code>Runtime.addShutdownHook</code>) khi nhận SIGTERM, SIGINT và khi gọi <code>System.exit</code>, rồi sau một tín hiệu vẫn thoát với <strong>143</strong> — điều đó bình thường. Với SIGKILL không hook nào chạy (137). Spring Boot 4.1.2 tắt <strong>êm theo mặc định</strong> (<code>server.shutdown=graceful</code>, <code>spring.lifecycle.timeout-per-shutdown-phase=30s</code>).</p>
<p>Nửa trái của slide, chạy thật. Chương trình khởi động một bản sao của chính nó làm worker bằng <code>ProcessBuilder</code> (fork + exec từ Java), rồi dừng nó hai lần: <code>Process.destroy()</code>, trên Linux gửi SIGTERM, và <code>destroyForcibly()</code>, gửi SIGKILL:</p>
<pre><code class="language-java">// Slide 19: shutdown hook của JVM chạy khi nhận SIGTERM (Process.destroy) nhưng không chạy khi nhận SIGKILL (destroyForcibly)
import java.nio.file.Files;
import java.nio.file.Path;

public class TatMay {
    static final Path READY = Path.of("ready");

    public static void main(String[] args) throws Exception {
        if (args.length &gt; 0) { worker(); return; }
        for (String how : new String[] { "destroy", "destroyForcibly" }) {
            // inheritIO: worker in thẳng ra terminal của ta (destroy() sẽ đóng ống nếu ta đọc qua ống)
            Files.deleteIfExists(READY);
            Process p = new ProcessBuilder("java", "-cp", ".", "TatMay", "worker").inheritIO().start();
            while (!Files.exists(READY)) Thread.sleep(50);              // chờ tới khi hook đã được cài
            if (how.equals("destroy")) p.destroy(); else p.destroyForcibly();   // SIGTERM / SIGKILL trên Linux
            System.out.println("main: " + how + "() -&gt; exit code " + p.waitFor());
        }
    }

    static void worker() throws Exception {
        Runtime.getRuntime().addShutdownHook(new Thread(() -&gt; {
            System.out.println("  worker hook: SIGTERM -&gt; stop taking jobs, finish the current one, close the pool");
            System.out.flush();
        }));
        System.out.println("  worker " + ProcessHandle.current().pid() + ": running jobs");
        System.out.flush();
        Files.createFile(READY);                                    // báo cho main: đã sẵn sàng
        while (true) Thread.sleep(100);                             // "xử lý việc"
    }
}</code></pre>
<div class="out">$ javac TatMay.java &amp;&amp; java TatMay<br>
&nbsp;&nbsp;worker 49: running jobs<br>
&nbsp;&nbsp;worker hook: SIGTERM -&gt; stop taking jobs, finish the current one, close the pool<br>
main: destroy() -&gt; exit code 143<br>
&nbsp;&nbsp;worker 70: running jobs<br>
main: destroyForcibly() -&gt; exit code 137</div>
<p>Với SIGTERM, hook in dòng của nó và mã thoát là <strong>143</strong>. Điều này làm người quen Node ngạc nhiên: hook đã chạy xong, sao không phải 0? Vì JVM đã <em>bị kết thúc bởi một tín hiệu</em> — hook là phần dọn dẹp chạy trên đường ra, không phải quyết định thoát bình thường — và trình khởi chạy báo 128 + 15. Các bộ điều phối biết điều này: Docker, Kubernetes và systemd coi 143 sau một yêu cầu dừng là một lần dừng bình thường (dòng <code>SuccessExitStatus=143</code> của systemd rất hay gặp trong tệp unit cho Java). Với SIGKILL hook không chạy và mã là 137. Bản thân hook:</p>
<pre class="trich"><code class="language-java">static void worker() throws Exception {
    Runtime.getRuntime().addShutdownHook(new Thread(() -&gt; {
        System.out.println("  worker hook: SIGTERM -&gt; stop taking jobs, finish the current one, close the pool");
        System.out.flush();
    }));
    System.out.println("  worker " + ProcessHandle.current().pid() + ": running jobs");
    System.out.flush();
    Files.createFile(READY);                                    // báo cho main: đã sẵn sàng
    while (true) Thread.sleep(100);                             // "xử lý việc"
}</code></pre>
<p><strong>Spring Boot</strong> (nửa phải của slide; không chạy được trong container của môn học vì không có mạng để tải thư viện). Lúc làm bộ slide, một ứng dụng Spring Boot 4.1.2 tối giản có một endpoint 3 giây được khởi động, endpoint được gọi, và SIGTERM được gửi 0,5 giây sau đó. Log hiện <code>Commencing graceful shutdown. Waiting for active requests to complete</code>, rồi <code>Graceful shutdown complete</code> 2,5 giây sau, request trả về <code>done /slow</code>, và JVM thoát 143. Với <code>server.shutdown=immediate</code> cùng request đó nhận <code>curl: (52) Empty reply from server</code> và JVM dừng trong 0,1 giây. Giá trị mặc định được đọc từ metadata bên trong tệp jar đã build: <code>server.shutdown</code> = <code>graceful</code> và <code>timeout-per-shutdown-phase</code> = <code>30s</code>, khớp tài liệu của Spring ("Graceful shutdown is enabled by default with all three embedded web servers").</p>
<p>➕ Spring làm thế nào: Boot đăng ký một shutdown hook của JVM; khi nhận SIGTERM nó đóng <code>ApplicationContext</code> theo từng pha — trước hết web server ngừng nhận (Tomcat tạm dừng connector) và chờ các request đang chạy tối đa bằng thời hạn của pha, sau đó các phương thức <code>@PreDestroy</code> và các <code>DisposableBean</code> chạy, pool kết nối (HikariCP) đóng, vân vân. Hai cái bẫy: thời hạn của pha (30 giây) phải lọt vừa trong 30 giây ân hạn của Kubernetes cùng mọi thứ khác — hãy tăng <code>terminationGracePeriodSeconds</code> hoặc giảm thời hạn; và các phiên bản trước Spring Boot 3.4 mặc định là <code>immediate</code>, nên dự án cũ cần đặt thuộc tính này một cách tường minh.</p>
<p class="meo">🧠 Mã thoát Java sau <code>docker stop</code>: 143 = dừng lịch sự (hook đã chạy), 137 = bị giết (hook không chạy). Cả hai đều có thể "ổn"; chỉ 137 mới đáng đặt câu hỏi.</p>`],
      [20, 'PID 1 in a container: the signal never arrives',
        `<p class="y-chinh">🎯 The kernel rule (<code>man 7 pid_namespaces</code>): "Only signals for which the <em>init</em> process has established a signal handler can be sent to the <em>init</em> process." A signal whose action is the default, sent to PID 1, is simply <strong>dropped</strong> — SIGTERM does not kill PID 1. With the shell form <code>CMD node app.js</code>, PID 1 is <code>/bin/sh -c</code>, which drops the signal and never forwards it; with <code>--init</code>, tini is PID 1, forwards it, and the app stops in 0.1 s.</p>
<p>The two rows of the slide as a sequence diagram:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/c0927b96965f03b0f77c6d85f262aab54a943693.svg" alt="docker stop against two containers: shell form (sh is PID 1) and --init (tini is PID 1)" loading="lazy" /><p class="chu-thich">🧩 docker stop against two containers: shell form (sh is PID 1) and --init (tini is PID 1)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' docker stop against two containers: shell form (sh is PID 1) and --init (tini is PID 1)
skinparam sequenceMessageAlign center
participant "docker stop\\n(Docker engine)" as D
box "container A: CMD node app.js (shell form)" #FEF2F2
participant "PID 1\\nsh -c" as SH
participant "node app.js\\n(has a SIGTERM handler)" as N1
end box
box "container B: docker run --init" #F0FDF4
participant "PID 1\\ntini" as T
participant "node app.js" as N2
end box
== shell form ==
D -&gt; SH : SIGTERM
note over SH : PID 1 with NO handler:\\nthe kernel DROPS the signal
D -&gt; D : wait 10 s (grace period)
D -&gt; SH : SIGKILL (cannot be blocked)
SH -&gt; N1 : (namespace dies: every process gets SIGKILL)
note over N1 : handler never ran;\\nin-flight requests cut;\\nexit code 137
== --init ==
D -&gt; T : SIGTERM
T -&gt; N2 : forwards SIGTERM
N2 -&gt; N2 : handler: stop accepting,\\ndrain, close pools
N2 --&gt; T : exits (0, or 143 without a handler)
T --&gt; D : exits with the app's code\\n(about 0.1 s, no SIGKILL)
@enduml</code></pre></details>
<p>Why does the kernel protect PID 1 like that? On a normal machine PID 1 is <code>init</code>/systemd, and if PID 1 dies the kernel panics — the whole system goes down. So the kernel refuses to let a stray <code>kill</code> terminate init by default action; init must <em>opt in</em> by installing a handler for every signal it wants. Containers inherited this rule: in a new PID namespace the first process is "init" for everything inside it, and the rule applies to signals sent from inside the namespace and — for every signal except SIGKILL and SIGSTOP — from the parent namespace too. That is why <code>docker stop</code> (which sends SIGTERM from outside) can be ignored, while the SIGKILL it sends 10 s later always works. And when PID 1 dies, the kernel sends SIGKILL to every other process in the namespace: the whole container ends at once, whatever the other processes were doing.</p>
<p>Now the three common set-ups, using that rule:</p>
<ul>
<li><strong>Exec form, the app is PID 1</strong> (<code>CMD ["node", "app.js"]</code>): the app receives SIGTERM only if it has a handler. Your own <code>process.on('SIGTERM')</code> or Spring's hook counts — then it works. Without one, the signal is dropped (slide 21 shows that Node's built-in handler does not save you).</li>
<li><strong>Shell form</strong> (<code>CMD node app.js</code>): Docker runs <code>/bin/sh -c "node app.js"</code>; on Debian <code>sh</code> is dash, which stays as PID 1 with node as its child. dash has no handler, so SIGTERM is dropped, and dash would not forward it anyway. Node's handler never runs; after the grace period, SIGKILL ends everything — 137, requests cut.</li>
<li><strong><code>--init</code> / tini</strong>: a tiny init is PID 1 and does both jobs an app is not designed for — it <em>forwards</em> SIGTERM to the app (which is no longer PID 1, so normal rules apply: no handler means it dies with 143; a handler means a graceful exit) and it <em>reaps</em> orphans (slide 13).</li>
</ul>
<p>➕ Lesson 10.A (slide 5) already showed the shell-form problem outside a container: a SIGTERM sent to <code>sh -c 'sleep 20; echo done'</code> kills sh and leaves sleep running. Inside a container it is worse, because sh is PID 1 and does not even die.</p>
<p class="pitfall">⚠️ "<code>docker stop</code> sends SIGTERM to the app" is only true when the app is PID 1 with a handler, or behind an init that forwards. In every other set-up the app never hears about it.</p>`,
        `<p class="y-chinh">🎯 Quy tắc của nhân (<code>man 7 pid_namespaces</code>): "Chỉ những tín hiệu mà tiến trình <em>init</em> đã cài handler mới gửi được tới tiến trình <em>init</em>." Một tín hiệu có hành động mặc định gửi tới PID 1 đơn giản là bị <strong>vứt bỏ</strong> — SIGTERM không giết được PID 1. Với dạng shell <code>CMD node app.js</code>, PID 1 là <code>/bin/sh -c</code>, nó vứt tín hiệu và không bao giờ chuyển tiếp; với <code>--init</code>, tini là PID 1, chuyển tiếp tín hiệu, và ứng dụng dừng trong 0,1 giây.</p>
<p>Hai hàng của slide dưới dạng sơ đồ tuần tự:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/c0927b96965f03b0f77c6d85f262aab54a943693.svg" alt="docker stop với hai container: dạng shell (sh là PID 1) và --init (tini là PID 1)" loading="lazy" /><p class="chu-thich">🧩 docker stop với hai container: dạng shell (sh là PID 1) và --init (tini là PID 1)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' docker stop với hai container: dạng shell (sh là PID 1) và --init (tini là PID 1)
skinparam sequenceMessageAlign center
participant "docker stop\\n(Docker engine)" as D
box "container A: CMD node app.js (shell form)" #FEF2F2
participant "PID 1\\nsh -c" as SH
participant "node app.js\\n(has a SIGTERM handler)" as N1
end box
box "container B: docker run --init" #F0FDF4
participant "PID 1\\ntini" as T
participant "node app.js" as N2
end box
== shell form ==
D -&gt; SH : SIGTERM
note over SH : PID 1 with NO handler:\\nthe kernel DROPS the signal
D -&gt; D : wait 10 s (grace period)
D -&gt; SH : SIGKILL (cannot be blocked)
SH -&gt; N1 : (namespace dies: every process gets SIGKILL)
note over N1 : handler never ran;\\nin-flight requests cut;\\nexit code 137
== --init ==
D -&gt; T : SIGTERM
T -&gt; N2 : forwards SIGTERM
N2 -&gt; N2 : handler: stop accepting,\\ndrain, close pools
N2 --&gt; T : exits (0, or 143 without a handler)
T --&gt; D : exits with the app's code\\n(about 0.1 s, no SIGKILL)
@enduml</code></pre></details>
<p>Vì sao nhân bảo vệ PID 1 như vậy? Trên một máy bình thường PID 1 là <code>init</code>/systemd, và nếu PID 1 chết thì nhân panic — cả hệ thống sập. Nên nhân không cho một lệnh <code>kill</code> lạc chỗ kết liễu init bằng hành động mặc định; init phải <em>tự chọn</em> bằng cách cài handler cho từng tín hiệu nó muốn nhận. Container thừa hưởng quy tắc này: trong một PID namespace mới, tiến trình đầu tiên là "init" của mọi thứ bên trong, và quy tắc áp dụng cho tín hiệu gửi từ bên trong namespace và — với mọi tín hiệu trừ SIGKILL và SIGSTOP — từ namespace cha nữa. Vì thế <code>docker stop</code> (gửi SIGTERM từ bên ngoài) có thể bị lờ đi, còn SIGKILL nó gửi 10 giây sau thì luôn có tác dụng. Và khi PID 1 chết, nhân gửi SIGKILL cho mọi tiến trình khác trong namespace: cả container kết thúc ngay lập tức, các tiến trình khác đang làm gì cũng mặc.</p>
<p>Giờ là ba cách dựng thường gặp, dùng quy tắc trên:</p>
<ul>
<li><strong>Dạng exec, ứng dụng là PID 1</strong> (<code>CMD ["node", "app.js"]</code>): ứng dụng chỉ nhận SIGTERM nếu nó có handler. <code>process.on('SIGTERM')</code> của bạn hay hook của Spring đều tính — khi đó chạy đúng. Không có thì tín hiệu bị vứt (slide 21 cho thấy handler có sẵn của Node không cứu được bạn).</li>
<li><strong>Dạng shell</strong> (<code>CMD node app.js</code>): Docker chạy <code>/bin/sh -c "node app.js"</code>; trên Debian <code>sh</code> là dash, nó ở lại làm PID 1 với node là con. dash không có handler, nên SIGTERM bị vứt, mà dash cũng chẳng chuyển tiếp nó. Handler của Node không bao giờ chạy; hết thời gian ân hạn, SIGKILL kết thúc tất cả — 137, request bị cắt.</li>
<li><strong><code>--init</code> / tini</strong>: một init tí hon làm PID 1 và làm cả hai việc mà ứng dụng không được thiết kế để làm — nó <em>chuyển tiếp</em> SIGTERM cho ứng dụng (lúc này không còn là PID 1, nên quy tắc thường áp dụng: không có handler thì chết với 143; có handler thì thoát êm) và nó <em>gặt</em> các tiến trình mồ côi (slide 13).</li>
</ul>
<p>➕ Bài 10.A (slide 5) đã cho thấy vấn đề của dạng shell ngoài container: một SIGTERM gửi tới <code>sh -c 'sleep 20; echo done'</code> giết sh và để sleep chạy tiếp. Trong container còn tệ hơn, vì sh là PID 1 và thậm chí không chết.</p>
<p class="pitfall">⚠️ "<code>docker stop</code> gửi SIGTERM cho ứng dụng" chỉ đúng khi ứng dụng là PID 1 có handler, hoặc đứng sau một init biết chuyển tiếp. Trong mọi cách dựng khác ứng dụng không bao giờ nghe thấy nó.</p>`],
      [21, 'Measured: how long does docker stop take?',
        `<p class="y-chinh">🎯 Six ways to start the same Node app, each stopped with <code>docker stop</code> (grace period pinned to the documented 10 s): exec form without handler 10.1 s / exit 137; <code>--init</code> 0.1 s / 143; exec form with a SIGTERM handler 0.1 s / 0; shell form with a handler in the app 10.2 s / 137 (handler never ran); <code>sh -c "exec node app"</code> 0.1 s / 0; <code>npm start</code> 0.7 s / exit 1 (handler never ran).</p>
<p>The slide's table was measured on the machine that built the deck (Docker Desktop 29.8.0, <code>docker run --stop-timeout 10</code>, the time between <code>docker stop</code> and its return, and <code>State.ExitCode</code>). The course container cannot run Docker, but what decides each row is the kernel, and that part can be reproduced: <code>unshare</code> creates a new PID namespace (what Docker does), the command inside becomes its PID 1, and the session sends SIGTERM to it from outside — exactly what <code>docker stop</code> does:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_ADMIN</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slides 20-21: send SIGTERM to the PID 1 of a namespace — like &#96;docker stop&#96; does — in five set-ups<br>
# p1 U = the namespace's PID 1 seen from outside (the child of unshare); alive P = still running?<br>
$ p1() { ps -o pid= --ppid $1 | tr -d ' '; }; alive() { kill -0 $1 2&gt;/dev/null &amp;&amp; echo "STILL RUNNING" || echo "gone"; }<br>
# A. node is PID 1, no handler of its own<br>
$ unshare -pf --mount-proc node _app.js 2&gt;/dev/null &amp; U=$!; sleep 1; P=$(p1 $U); ps -o args= -p $P<br>
node _app.js<br>
$ grep SigCgt /proc/$P/status<br>
SigCgt:	0000000100004602<br>
$ kill -TERM $P; sleep 1; echo "1 s after SIGTERM: $(alive $P)"; grep SigCgt /proc/$P/status<br>
1 s after SIGTERM: STILL RUNNING<br>
SigCgt:	0000000100000602<br>
$ kill -KILL $P; wait $U 2&gt;/dev/null; echo "after SIGKILL: $(alive $P)"<br>
after SIGKILL: gone<br>
# B. node is PID 1 and handles SIGTERM<br>
$ HANDLE=1 unshare -pf --mount-proc node _app.js &amp; U=$!; sleep 1; P=$(p1 $U)<br>
$ kill -TERM $P; wait $U; echo "exit code $?"<br>
app: SIGTERM -&gt; close server, exit 0<br>
exit code 0<br>
# C. shell form: sh is PID 1, node (with a handler!) is its child<br>
$ HANDLE=1 unshare -pf --mount-proc sh -c 'node _app.js; echo bye' 2&gt;/dev/null &amp; U=$!; sleep 1; P=$(p1 $U); ps -o args= -p $P<br>
sh -c node _app.js; echo bye<br>
$ kill -TERM $P; sleep 1; echo "1 s after SIGTERM: $(alive $P)"<br>
1 s after SIGTERM: STILL RUNNING<br>
$ kill -KILL $P; wait $U 2&gt;/dev/null; echo "after SIGKILL: $(alive $P)"<br>
after SIGKILL: gone<br>
# D. npm start is PID 1<br>
$ HANDLE=1 npm_config_update_notifier=false unshare -pf --mount-proc npm start --silent &amp; U=$!; sleep 2; P=$(p1 $U); ps -o args= -p $P<br>
npm start<br>
$ kill -TERM $P; wait $U; echo "exit code $?"<br>
exit code 1<br>
# E. a real init is PID 1 (mini-init = what tini does), node WITHOUT a handler<br>
$ unshare -pf --mount-proc ./mini-init node _app.js &amp; U=$!; sleep 1; P=$(p1 $U); ps -o args= -p $P<br>
./mini-init node _app.js<br>
$ kill -TERM $P; wait $U; echo "exit code $?"<br>
exit code 143</div>
<p><strong>A — Node as PID 1, no handler of its own.</strong> Before the signal, <code>SigCgt</code> (the mask of caught signals) is <code>…4602</code>: bit <code>0x4000</code> — signal 15 — is set, so Node <em>does</em> catch SIGTERM. Yet one second after SIGTERM it is still running, and the bit has vanished (<code>…0602</code>). The reason is in Node's source (<code>src/node.cc</code>): at start-up Node installs a handler <code>SignalExit</code> for SIGINT and SIGTERM with the "reset" flag (<code>SA_RESETHAND</code>); the handler restores the terminal and calls <code>raise(signo)</code> to die with the same signal. The reset puts SIGTERM back to its default action, the re-raised signal is sent to PID 1 with default action — and the kernel drops it. Only SIGKILL ends it: on Docker, after 10 s, with 137.</p>
<p><strong>B — Node as PID 1 with <code>process.on('SIGTERM')</code></strong>: a real handler, so the signal is delivered, the app logs and exits 0 at once. <strong>C — shell form</strong>: <code>sh -c 'node _app.js; echo bye'</code> is PID 1; node has a handler but is not PID 1 and is never told; still running after 1 s. <strong>D — <code>npm start</code></strong>: npm does handle SIGTERM — it passes it to its child, which is <code>sh -c "node _app.js"</code> (npm runs scripts through a shell); sh dies, npm exits 1, the namespace collapses and node is killed without its handler running (no "app: SIGTERM" line). <strong>E — mini-init</strong> (what tini does) is PID 1; it forwards SIGTERM to node, which is not PID 1 and has no handler, so it dies normally; mini-init exits with the app's 143.</p>
<p>➕ The footnote of the slide is a lesson in measuring: without <code>--stop-timeout</code>, that Docker Desktop sent SIGKILL about 3.0 s after SIGTERM (seen with <code>docker events</code>), although the Docker documentation says the default is 10 s for Linux containers. On a Linux server with Docker Engine you get the documented 10 s. When a number matters, measure it on the system you run.</p>
<p class="meo">🧠 Look at <code>SigCgt</code> in <code>/proc/1/status</code> inside any container: if bit 0x4000 is missing, <code>docker stop</code> will wait the full grace period.</p>`,
        `<p class="y-chinh">🎯 Sáu cách khởi động cùng một ứng dụng Node, mỗi cách dừng bằng <code>docker stop</code> (thời gian ân hạn ghim đúng mức 10 giây theo tài liệu): dạng exec không có handler 10,1 giây / mã 137; <code>--init</code> 0,1 giây / 143; dạng exec có handler SIGTERM 0,1 giây / 0; dạng shell với handler trong ứng dụng 10,2 giây / 137 (handler không bao giờ chạy); <code>sh -c "exec node app"</code> 0,1 giây / 0; <code>npm start</code> 0,7 giây / mã 1 (handler không bao giờ chạy).</p>
<p>Bảng của slide được đo trên máy dựng bộ slide (Docker Desktop 29.8.0, <code>docker run --stop-timeout 10</code>, thời gian từ lúc gọi <code>docker stop</code> tới lúc nó trả về, và <code>State.ExitCode</code>). Container của môn học không chạy được Docker, nhưng thứ quyết định từng dòng là nhân, và phần đó tái hiện được: <code>unshare</code> tạo một PID namespace mới (việc Docker làm), lệnh bên trong thành PID 1 của nó, và phiên gửi SIGTERM tới nó từ bên ngoài — đúng như <code>docker stop</code>:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_ADMIN</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 20-21: gửi SIGTERM cho PID 1 của một namespace — như &#96;docker stop&#96; làm — trong năm cách dựng<br>
# p1 U = PID 1 của namespace nhìn từ ngoài (con của unshare); alive P = còn chạy không?<br>
$ p1() { ps -o pid= --ppid $1 | tr -d ' '; }; alive() { kill -0 $1 2&gt;/dev/null &amp;&amp; echo "STILL RUNNING" || echo "gone"; }<br>
# A. node là PID 1, không tự bắt tín hiệu<br>
$ unshare -pf --mount-proc node _app.js 2&gt;/dev/null &amp; U=$!; sleep 1; P=$(p1 $U); ps -o args= -p $P<br>
node _app.js<br>
$ grep SigCgt /proc/$P/status<br>
SigCgt:	0000000100004602<br>
$ kill -TERM $P; sleep 1; echo "1 s after SIGTERM: $(alive $P)"; grep SigCgt /proc/$P/status<br>
1 s after SIGTERM: STILL RUNNING<br>
SigCgt:	0000000100000602<br>
$ kill -KILL $P; wait $U 2&gt;/dev/null; echo "after SIGKILL: $(alive $P)"<br>
after SIGKILL: gone<br>
# B. node là PID 1 và tự xử lý SIGTERM<br>
$ HANDLE=1 unshare -pf --mount-proc node _app.js &amp; U=$!; sleep 1; P=$(p1 $U)<br>
$ kill -TERM $P; wait $U; echo "exit code $?"<br>
app: SIGTERM -&gt; close server, exit 0<br>
exit code 0<br>
# C. dạng shell: sh là PID 1, node (có handler!) là con của nó<br>
$ HANDLE=1 unshare -pf --mount-proc sh -c 'node _app.js; echo bye' 2&gt;/dev/null &amp; U=$!; sleep 1; P=$(p1 $U); ps -o args= -p $P<br>
sh -c node _app.js; echo bye<br>
$ kill -TERM $P; sleep 1; echo "1 s after SIGTERM: $(alive $P)"<br>
1 s after SIGTERM: STILL RUNNING<br>
$ kill -KILL $P; wait $U 2&gt;/dev/null; echo "after SIGKILL: $(alive $P)"<br>
after SIGKILL: gone<br>
# D. npm start là PID 1<br>
$ HANDLE=1 npm_config_update_notifier=false unshare -pf --mount-proc npm start --silent &amp; U=$!; sleep 2; P=$(p1 $U); ps -o args= -p $P<br>
npm start<br>
$ kill -TERM $P; wait $U; echo "exit code $?"<br>
exit code 1<br>
# E. một init thật là PID 1 (mini-init = việc tini làm), node KHÔNG có handler<br>
$ unshare -pf --mount-proc ./mini-init node _app.js &amp; U=$!; sleep 1; P=$(p1 $U); ps -o args= -p $P<br>
./mini-init node _app.js<br>
$ kill -TERM $P; wait $U; echo "exit code $?"<br>
exit code 143</div>
<p><strong>A — Node là PID 1, không có handler riêng.</strong> Trước tín hiệu, <code>SigCgt</code> (mặt nạ các tín hiệu đang được bắt) là <code>…4602</code>: bit <code>0x4000</code> — tín hiệu 15 — đang bật, nghĩa là Node <em>có</em> bắt SIGTERM. Vậy mà một giây sau SIGTERM nó vẫn chạy, và bit đó đã biến mất (<code>…0602</code>). Lý do nằm trong mã nguồn Node (<code>src/node.cc</code>): lúc khởi động Node cài một handler <code>SignalExit</code> cho SIGINT và SIGTERM kèm cờ "đặt lại" (<code>SA_RESETHAND</code>); handler khôi phục terminal rồi gọi <code>raise(signo)</code> để chết bằng đúng tín hiệu đó. Cờ đặt lại đưa SIGTERM về hành động mặc định, tín hiệu được gửi lại tới PID 1 với hành động mặc định — và nhân vứt nó. Chỉ SIGKILL kết thúc được nó: trên Docker là sau 10 giây, với 137.</p>
<p><strong>B — Node là PID 1 có <code>process.on('SIGTERM')</code></strong>: một handler thật, nên tín hiệu được giao, ứng dụng ghi log và thoát 0 ngay. <strong>C — dạng shell</strong>: <code>sh -c 'node _app.js; echo bye'</code> là PID 1; node có handler nhưng không phải PID 1 và không bao giờ được báo; sau 1 giây vẫn chạy. <strong>D — <code>npm start</code></strong>: npm có xử lý SIGTERM — nó chuyển cho con của nó, mà con đó là <code>sh -c "node _app.js"</code> (npm chạy script qua shell); sh chết, npm thoát 1, namespace sụp và node bị giết mà handler không chạy (không có dòng "app: SIGTERM"). <strong>E — mini-init</strong> (việc tini làm) là PID 1; nó chuyển SIGTERM cho node, node không phải PID 1 và không có handler nên chết bình thường; mini-init thoát với mã 143 của ứng dụng.</p>
<p>➕ Chú thích cuối slide là một bài học về đo đạc: không có <code>--stop-timeout</code>, Docker Desktop đó gửi SIGKILL khoảng 3,0 giây sau SIGTERM (thấy bằng <code>docker events</code>), dù tài liệu Docker ghi mặc định là 10 giây với container Linux. Trên một server Linux chạy Docker Engine bạn có đúng 10 giây như tài liệu. Khi một con số quan trọng, hãy đo nó trên chính hệ thống bạn chạy.</p>
<p class="meo">🧠 Xem <code>SigCgt</code> trong <code>/proc/1/status</code> bên trong bất kỳ container nào: nếu bit 0x4000 vắng mặt, <code>docker stop</code> sẽ chờ hết thời gian ân hạn.</p>`],
      [22, 'Trap: Dockerfiles that ignore SIGTERM',
        `<p class="y-chinh">🎯 Wrong: shell form <code>CMD node dist/index.js</code>, <code>CMD ["npm", "start"]</code>, an entrypoint script that runs the app without <code>exec</code> — every <code>docker stop</code> waits the full timeout, then SIGKILL cuts requests (137) and orphans become zombies. Right: a real init as PID 1 plus the exec form — <code>ENTRYPOINT ["/usr/bin/tini", "--", "/entry.sh"]</code>, <code>CMD ["node", "dist/index.js"]</code>, and <code>exec "$@"</code> at the end of the script — or simply <code>docker run --init</code> / Compose <code>init: true</code>; plus a SIGTERM handler in the app.</p>
<p>Each wrong line is one row of slide 21. The left column, read again with the rule of slide 20 in mind: in the <strong>shell form</strong> PID 1 is <code>sh</code>; with <strong><code>npm start</code></strong> PID 1 is npm, whose child is a shell, whose child is node — two layers between Docker and your handler; with an <strong>entrypoint script</strong> (very common, to run migrations or fix permissions first), the script's <code>bash</code> stays PID 1 while node runs as its child. The right column fixes the two problems separately: <strong>tini</strong> (or <code>--init</code>) is PID 1 — forwards signals, reaps orphans; <strong><code>exec "$@"</code></strong> makes the entrypoint script <em>replace itself</em> with the command (slide 7: exec keeps the PID), so node takes the script's place directly under tini instead of hiding behind a shell. Exercise 5 runs both versions of such a script and measures the difference.</p>
<p>The note "this is exactly cuongthai.com's <code>Dockerfile.backend</code>" is literal — the last lines of the backend image of this website:</p>
<pre><code class="language-dockerfile"># Fix host-mounted upload directory ownership BEFORE we drop to the
# non-root nodejs user. tini is a tiny init that forwards signals
# and reaps zombies; using it as PID 1 means Ctrl-C in dev still
# cleanly stops the Node process.
ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/fix-uploads-perms.sh"]
# Run as non-root
USER nodejs

CMD ["node", "dist/index.js"]</code></pre>
<p>and <code>fix-uploads-perms.sh</code> ends with the line that makes the chain work: <code>exec "$@"</code> — the script checks the upload folder, then becomes <code>node dist/index.js</code>. The process tree inside that container is therefore <code>tini (PID 1) → node</code>, and <code>docker stop</code> reaches the <code>shutdown()</code> handler in <code>src/index.ts</code>.</p>
<p>➕ Other ways to get the same result: Node's official images include no init, so use <code>--init</code> or install <code>tini</code>/<code>dumb-init</code>; Kubernetes has no <code>--init</code> flag, so put tini in the image or enable <code>shareProcessNamespace</code> (the pause container then reaps zombies); for PM2 in a container use <code>pm2-runtime</code>, which forwards signals. Check any image in ten seconds: <code>docker exec &lt;c&gt; ps -o pid,args -p 1</code> and <code>grep SigCgt /proc/1/status</code>.</p>
<p class="pitfall">⚠️ <code>STOPSIGNAL</code> and a longer <code>stop_grace_period</code> do not fix a shell-form CMD — they only change which signal is dropped and how long Docker waits before SIGKILL.</p>`,
        `<p class="y-chinh">🎯 Sai: dạng shell <code>CMD node dist/index.js</code>, <code>CMD ["npm", "start"]</code>, một script entrypoint chạy ứng dụng mà không có <code>exec</code> — mỗi lần <code>docker stop</code> đều chờ hết hạn, rồi SIGKILL cắt request (137) và các tiến trình mồ côi thành zombie. Đúng: một init thật làm PID 1 cùng dạng exec — <code>ENTRYPOINT ["/usr/bin/tini", "--", "/entry.sh"]</code>, <code>CMD ["node", "dist/index.js"]</code>, và <code>exec "$@"</code> ở cuối script — hoặc đơn giản <code>docker run --init</code> / <code>init: true</code> của Compose; cộng thêm một handler SIGTERM trong ứng dụng.</p>
<p>Mỗi dòng sai là một hàng của slide 21. Đọc lại cột trái với quy tắc của slide 20 trong đầu: ở <strong>dạng shell</strong> PID 1 là <code>sh</code>; với <strong><code>npm start</code></strong> PID 1 là npm, con của nó là một shell, con của shell là node — hai lớp nằm giữa Docker và handler của bạn; với một <strong>script entrypoint</strong> (rất phổ biến, để chạy migration hay sửa quyền trước), <code>bash</code> của script ở lại làm PID 1 còn node chạy làm con của nó. Cột phải sửa riêng từng vấn đề: <strong>tini</strong> (hoặc <code>--init</code>) là PID 1 — chuyển tiếp tín hiệu, gặt mồ côi; <strong><code>exec "$@"</code></strong> làm script entrypoint <em>tự thay mình</em> bằng lệnh được truyền vào (slide 7: exec giữ nguyên PID), nên node đứng thẳng vào chỗ của script ngay dưới tini thay vì nấp sau một shell. Bài tập 5 chạy cả hai phiên bản của một script như vậy và đo sự khác biệt.</p>
<p>Ghi chú "đây chính là <code>Dockerfile.backend</code> của cuongthai.com" là đúng theo nghĩa đen — mấy dòng cuối của image backend của website này:</p>
<pre><code class="language-dockerfile"># Fix host-mounted upload directory ownership BEFORE we drop to the
# non-root nodejs user. tini is a tiny init that forwards signals
# and reaps zombies; using it as PID 1 means Ctrl-C in dev still
# cleanly stops the Node process.
ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/fix-uploads-perms.sh"]
# Run as non-root
USER nodejs

CMD ["node", "dist/index.js"]</code></pre>
<p>còn <code>fix-uploads-perms.sh</code> kết thúc bằng đúng dòng làm cả chuỗi chạy: <code>exec "$@"</code> — script kiểm thư mục upload, rồi trở thành <code>node dist/index.js</code>. Cây tiến trình bên trong container đó vì vậy là <code>tini (PID 1) → node</code>, và <code>docker stop</code> tới được handler <code>shutdown()</code> trong <code>src/index.ts</code>.</p>
<p>➕ Những cách khác để có cùng kết quả: image Node chính thức không kèm init, nên dùng <code>--init</code> hoặc cài <code>tini</code>/<code>dumb-init</code>; Kubernetes không có cờ <code>--init</code>, nên đặt tini vào image hoặc bật <code>shareProcessNamespace</code> (khi đó container pause gặt zombie); dùng PM2 trong container thì chạy <code>pm2-runtime</code>, nó biết chuyển tiếp tín hiệu. Kiểm tra bất kỳ image nào trong mười giây: <code>docker exec &lt;c&gt; ps -o pid,args -p 1</code> và <code>grep SigCgt /proc/1/status</code>.</p>
<p class="pitfall">⚠️ <code>STOPSIGNAL</code> và một <code>stop_grace_period</code> dài hơn không sửa được CMD dạng shell — chúng chỉ đổi tín hiệu nào bị vứt và Docker chờ bao lâu trước khi SIGKILL.</p>`],
      [23, 'Job control: and, jobs, Ctrl+Z, nohup',
        `<p class="y-chinh">🎯 <code>&amp;</code> starts a job in the background; <code>jobs -l</code> lists them; Ctrl+Z (SIGTSTP) or <code>kill -STOP %1</code> pauses one (state <code>T</code>); <code>bg</code>/<code>fg</code> or <code>kill -CONT</code> resumes it. Closing an SSH session sends <strong>SIGHUP</strong> to your jobs — that is why <code>node app.js &amp;</code> "dies when I log out". <code>nohup</code> makes a command ignore SIGHUP; but a <strong>server</strong> belongs to systemd or Docker, not to your terminal.</p>
<div class="out"># Slide 23: job control (&amp;, jobs, STOP/CONT) and why nohup survives SIGHUP<br>
$ set -m<br>
$ sleep 600 &amp;<br>
$ sleep 700 &amp;<br>
$ jobs -l<br>
[1]- &nbsp;&nbsp;&nbsp;11 Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 600 &amp;<br>
[2]+ &nbsp;&nbsp;&nbsp;14 Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 700 &amp;<br>
$ kill -STOP %1; sleep 0.2; jobs -l<br>
[1]+ &nbsp;&nbsp;&nbsp;11 Stopped (signal) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 600<br>
[2]- &nbsp;&nbsp;&nbsp;14 Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 700 &amp;<br>
$ ps -o pid,stat,cmd -p $(jobs -p %1),$(jobs -p %2)<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID STAT CMD<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 T &nbsp;&nbsp;&nbsp;sleep 600<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 S &nbsp;&nbsp;&nbsp;sleep 700<br>
$ kill -CONT %1; sleep 0.2; ps -o pid,stat,cmd -p $(jobs -p %1)<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID STAT CMD<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 S &nbsp;&nbsp;&nbsp;sleep 600<br>
$ kill %1 %2; sleep 0.2; jobs<br>
[1]+ &nbsp;Terminated &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 600<br>
[2]- &nbsp;Terminated &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 700<br>
# the terminal closes -&gt; the shell sends SIGHUP to its jobs<br>
$ sleep 800 &amp; A=$!<br>
$ nohup sleep 900 &gt; /dev/null 2&gt;&amp;1 &amp; B=$!<br>
$ grep SigIgn /proc/$A/status /proc/$B/status<br>
/proc/35/status:SigIgn:	0000000000000000<br>
/proc/38/status:SigIgn:	0000000000000001<br>
$ kill -HUP $A $B; sleep 0.3<br>
bash: &nbsp;&nbsp;&nbsp;35 Hangup &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 800<br>
$ wait $A; echo "plain sleep -&gt; exit code $? (128 + 1 = SIGHUP)"<br>
plain sleep -&gt; exit code 129 (128 + 1 = SIGHUP)<br>
$ ps -o pid,stat,cmd -p $B<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID STAT CMD<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;38 S &nbsp;&nbsp;&nbsp;sleep 900<br>
$ kill $B</div>
<p>Read it in two halves. <strong>Job control</strong> (<code>set -m</code> turns it on in a script; an interactive shell has it on): two background jobs, numbered <code>[1]</code> and <code>[2]</code> — <code>%1</code> means "job 1" anywhere a PID is accepted. <code>kill -STOP %1</code> is what Ctrl+Z does to a foreground job (Ctrl+Z sends SIGTSTP, which a program may catch; SIGSTOP cannot be caught): <code>jobs</code> says "Stopped (signal)" and <code>ps</code> shows state <code>T</code> — the process is frozen, not dead, keeps its memory and its open files. <code>kill -CONT</code> (what <code>bg</code> sends) brings it back to <code>S</code>. <code>kill %1 %2</code> sends SIGTERM to both, reported as "Terminated". Note the <code>+</code> and <code>-</code>: the current and previous job, used by a bare <code>fg</code>.</p>
<p><strong>SIGHUP and nohup</strong>: the only difference between the two sleeps is the <code>SigIgn</code> mask — <code>…0001</code> (signal 1 ignored) for the one started with <code>nohup</code>. When the "terminal closes" (simulated by <code>kill -HUP</code>), the plain sleep dies with 129 = 128 + 1, the nohup'ed one keeps running. Compare with slide 9: in the session without job control the background sleep had SIGINT and SIGQUIT ignored (<code>…0006</code>); with <code>set -m</code> they are not (<code>…0000</code>), because with job control Ctrl+C is delivered only to the foreground job anyway.</p>
<p>➕ When SSH disconnects, the kernel sends SIGHUP to the session leader (your login shell), and bash then sends SIGHUP to its jobs (and, with <code>shopt -s huponexit</code>, even on a normal <code>exit</code>). <code>disown</code> removes a job from the shell's list so it is not sent SIGHUP; <code>setsid</code> starts a command in a new session with no terminal; <code>tmux</code>/<code>screen</code> keep a whole terminal alive on the server. These are fine for a one-off task — a long migration, a backup copy. For a service they all miss what systemd and Docker give: restart on crash, start on boot, logs with rotation, resource limits, and a proper SIGTERM on shutdown. systemd-logind can also be configured (<code>KillUserProcesses=yes</code>) to kill everything a user left behind at logout — your <code>nohup</code> then dies anyway.</p>
<p class="pitfall">⚠️ "I started the API with <code>nohup node app.js &amp;</code> and it disappeared after the server rebooted" — of course: nothing starts it again. That job is systemd's (slide 24) or Docker's (<code>restart: unless-stopped</code>).</p>`,
        `<p class="y-chinh">🎯 <code>&amp;</code> chạy một job ở chế độ nền; <code>jobs -l</code> liệt kê chúng; Ctrl+Z (SIGTSTP) hoặc <code>kill -STOP %1</code> tạm dừng một job (trạng thái <code>T</code>); <code>bg</code>/<code>fg</code> hoặc <code>kill -CONT</code> cho nó chạy tiếp. Đóng một phiên SSH sẽ gửi <strong>SIGHUP</strong> cho các job của bạn — vì thế <code>node app.js &amp;</code> "chết khi tôi đăng xuất". <code>nohup</code> làm một lệnh bỏ qua SIGHUP; nhưng một <strong>server</strong> thuộc về systemd hoặc Docker, không thuộc về terminal của bạn.</p>
<div class="out"># Slide 23: điều khiển job (&amp;, jobs, STOP/CONT) và vì sao nohup sống sót qua SIGHUP<br>
$ set -m<br>
$ sleep 600 &amp;<br>
$ sleep 700 &amp;<br>
$ jobs -l<br>
[1]- &nbsp;&nbsp;&nbsp;11 Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 600 &amp;<br>
[2]+ &nbsp;&nbsp;&nbsp;14 Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 700 &amp;<br>
$ kill -STOP %1; sleep 0.2; jobs -l<br>
[1]+ &nbsp;&nbsp;&nbsp;11 Stopped (signal) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 600<br>
[2]- &nbsp;&nbsp;&nbsp;14 Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 700 &amp;<br>
$ ps -o pid,stat,cmd -p $(jobs -p %1),$(jobs -p %2)<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID STAT CMD<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 T &nbsp;&nbsp;&nbsp;sleep 600<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 S &nbsp;&nbsp;&nbsp;sleep 700<br>
$ kill -CONT %1; sleep 0.2; ps -o pid,stat,cmd -p $(jobs -p %1)<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID STAT CMD<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 S &nbsp;&nbsp;&nbsp;sleep 600<br>
$ kill %1 %2; sleep 0.2; jobs<br>
[1]+ &nbsp;Terminated &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 600<br>
[2]- &nbsp;Terminated &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 700<br>
# đóng terminal -&gt; shell gửi SIGHUP cho các job của nó<br>
$ sleep 800 &amp; A=$!<br>
$ nohup sleep 900 &gt; /dev/null 2&gt;&amp;1 &amp; B=$!<br>
$ grep SigIgn /proc/$A/status /proc/$B/status<br>
/proc/35/status:SigIgn:	0000000000000000<br>
/proc/38/status:SigIgn:	0000000000000001<br>
$ kill -HUP $A $B; sleep 0.3<br>
bash: &nbsp;&nbsp;&nbsp;35 Hangup &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 800<br>
$ wait $A; echo "plain sleep -&gt; exit code $? (128 + 1 = SIGHUP)"<br>
plain sleep -&gt; exit code 129 (128 + 1 = SIGHUP)<br>
$ ps -o pid,stat,cmd -p $B<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID STAT CMD<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;38 S &nbsp;&nbsp;&nbsp;sleep 900<br>
$ kill $B</div>
<p>Đọc theo hai nửa. <strong>Điều khiển job</strong> (job control — <code>set -m</code> bật nó trong script; shell tương tác thì bật sẵn): hai job chạy nền, đánh số <code>[1]</code> và <code>[2]</code> — <code>%1</code> nghĩa là "job 1" ở mọi chỗ nhận một PID. <code>kill -STOP %1</code> là việc Ctrl+Z làm với một job tiền cảnh (Ctrl+Z gửi SIGTSTP, chương trình có thể bắt được; SIGSTOP thì không bắt được): <code>jobs</code> báo "Stopped (signal)" và <code>ps</code> hiện trạng thái <code>T</code> — tiến trình bị đóng băng, không chết, vẫn giữ bộ nhớ và các tệp đang mở. <code>kill -CONT</code> (thứ <code>bg</code> gửi) đưa nó về <code>S</code>. <code>kill %1 %2</code> gửi SIGTERM cho cả hai, được báo là "Terminated". Để ý dấu <code>+</code> và <code>-</code>: job hiện tại và job trước đó, dùng bởi lệnh <code>fg</code> không đối số.</p>
<p><strong>SIGHUP và nohup</strong>: khác biệt duy nhất giữa hai lệnh sleep là mặt nạ <code>SigIgn</code> — <code>…0001</code> (bỏ qua tín hiệu 1) cho cái khởi động bằng <code>nohup</code>. Khi "terminal đóng" (giả lập bằng <code>kill -HUP</code>), sleep thường chết với 129 = 128 + 1, sleep chạy bằng nohup vẫn chạy. So với slide 9: trong phiên không có job control, sleep chạy nền bị bỏ qua SIGINT và SIGQUIT (<code>…0006</code>); có <code>set -m</code> thì không (<code>…0000</code>), vì khi có job control Ctrl+C vốn chỉ được giao cho job tiền cảnh.</p>
<p>➕ Khi SSH mất kết nối, nhân gửi SIGHUP cho trưởng phiên (shell đăng nhập của bạn), rồi bash gửi SIGHUP cho các job của nó (và, với <code>shopt -s huponexit</code>, cả khi <code>exit</code> bình thường). <code>disown</code> gỡ một job khỏi danh sách của shell để nó không bị gửi SIGHUP; <code>setsid</code> chạy một lệnh trong một phiên mới không có terminal; <code>tmux</code>/<code>screen</code> giữ cả một terminal sống trên server. Những cách đó ổn cho việc một lần — một migration dài, một lần chép bản sao lưu. Với một dịch vụ, chúng đều thiếu thứ systemd và Docker cho: khởi động lại khi sập, khởi động cùng máy, log có xoay vòng, giới hạn tài nguyên, và một SIGTERM đúng cách khi tắt. systemd-logind còn có thể được cấu hình (<code>KillUserProcesses=yes</code>) để giết mọi thứ người dùng để lại khi đăng xuất — khi đó <code>nohup</code> của bạn vẫn chết.</p>
<p class="pitfall">⚠️ "Tôi chạy API bằng <code>nohup node app.js &amp;</code> và nó biến mất sau khi server khởi động lại" — tất nhiên: không có gì khởi động lại nó. Việc đó là của systemd (slide 24) hoặc Docker (<code>restart: unless-stopped</code>).</p>`],
      [24, 'Daemons the right way: a systemd unit',
        `<p class="y-chinh">🎯 On a VM without Docker, a service is a <strong>systemd unit</strong>: <code>ExecStart</code> runs the app (systemd forks and execs it — no shell), <code>Restart=on-failure</code> restarts it after a non-zero exit or a death by signal, <code>KillSignal=SIGTERM</code> + <code>TimeoutStopSec=30</code> define the graceful stop (default 90 s), and <code>systemctl stop</code> signals the <strong>whole cgroup</strong>, so no child is left behind. Even <code>systemd-analyze verify</code> exits 0 on a typo: the bad line is ignored with a warning.</p>
<p>The unit file of the slide, for a Node API of the CT Shop project:</p>
<pre><code class="language-ini">[Unit]
Description=CT Shop API (Node.js)
After=network-online.target postgresql.service
Wants=network-online.target

[Service]
Type=simple
User=deployer
WorkingDirectory=/srv/ctshop
EnvironmentFile=/srv/ctshop/.env
ExecStart=/usr/bin/node dist/server.js
Restart=on-failure
RestartSec=2
KillSignal=SIGTERM
TimeoutStopSec=30

[Install]
WantedBy=multi-user.target</code></pre>
<p>Each line maps to a slide of this deck. <code>ExecStart</code> is fork + exec (slide 7) — with an absolute path and no shell in between, so node is the main process and receives the signal (the opposite of the Dockerfile trap of slide 22). <code>EnvironmentFile</code> puts secrets in the environment, not on the command line (slide 6). <code>Restart=on-failure</code> reads the exit code (slides 9–10): restart after 1, 137 or a crash, but not after a clean <code>exit 0</code>. <code>KillSignal</code>/<code>TimeoutStopSec</code> are the graceful-shutdown deadline of slide 17. And because systemd puts every service in its own <strong>cgroup</strong> (CS.6), <code>systemctl stop</code> can find and signal every process the service ever started — even double-forked daemons and orphans — which neither a shell nor a PID file can do.</p>
<p>The right half of the slide was run on Debian 12 with systemd 252 while the deck was built (the course container has no systemd). <code>systemd-analyze verify</code> on this file printed nothing and exited 0. With one letter removed — <code>Restart=on-failur</code> — it printed <code>Failed to parse service restart specifier, ignoring: on-failur</code> and <strong>still exited 0</strong>: systemd ignores the line and the service silently gets the default <code>Restart=no</code>. The first crash in production then leaves the API down. The defaults were read from <code>/etc/systemd/system.conf</code>: <code>DefaultTimeoutStopSec=90s</code>, <code>DefaultRestartSec=100ms</code>.</p>
<p>➕ Everyday commands: <code>systemctl daemon-reload</code> after editing, <code>systemctl enable --now ctshop-api</code>, <code>systemctl status ctshop-api</code> (shows the main PID, the cgroup tree and the last log lines), <code>journalctl -u ctshop-api -f</code>, <code>systemctl kill -s HUP ctshop-api</code>. For Java add <code>SuccessExitStatus=143</code> so that a stop is not counted as a failure (slide 19). <code>LimitNOFILE=</code> (CS.2) and <code>MemoryMax=</code> (CS.5) go here too. Lesson 10.A, slide 19 explains how systemd boots the machine.</p>
<p class="pitfall">⚠️ <code>ExecStart=npm start</code> or <code>ExecStart=/bin/bash -c "cd … &amp;&amp; node …"</code> brings back the extra layers of slide 22 — systemd signals the cgroup so the stop still works, but the main PID is the wrong process and exit codes come from the wrapper.</p>`,
        `<p class="y-chinh">🎯 Trên một máy ảo không có Docker, một dịch vụ là một <strong>unit của systemd</strong>: <code>ExecStart</code> chạy ứng dụng (systemd fork và exec nó — không có shell), <code>Restart=on-failure</code> khởi động lại sau một lần thoát khác 0 hoặc chết do tín hiệu, <code>KillSignal=SIGTERM</code> + <code>TimeoutStopSec=30</code> định nghĩa cách tắt êm (mặc định 90 giây), và <code>systemctl stop</code> gửi tín hiệu cho <strong>cả cgroup</strong>, nên không tiến trình con nào bị bỏ lại. Ngay cả <code>systemd-analyze verify</code> cũng thoát 0 khi gặp lỗi gõ: dòng sai bị bỏ qua kèm một cảnh báo.</p>
<p>Tệp unit của slide, cho một API Node của dự án CT Shop:</p>
<pre><code class="language-ini">[Unit]
Description=CT Shop API (Node.js)
After=network-online.target postgresql.service
Wants=network-online.target

[Service]
Type=simple
User=deployer
WorkingDirectory=/srv/ctshop
EnvironmentFile=/srv/ctshop/.env
ExecStart=/usr/bin/node dist/server.js
Restart=on-failure
RestartSec=2
KillSignal=SIGTERM
TimeoutStopSec=30

[Install]
WantedBy=multi-user.target</code></pre>
<p>Mỗi dòng ứng với một slide của bộ này. <code>ExecStart</code> là fork + exec (slide 7) — với đường dẫn tuyệt đối và không có shell chen giữa, nên node là tiến trình chính và nhận tín hiệu (ngược với bẫy Dockerfile ở slide 22). <code>EnvironmentFile</code> đưa bí mật vào biến môi trường, không đặt trên dòng lệnh (slide 6). <code>Restart=on-failure</code> đọc mã thoát (slide 9–10): khởi động lại sau 1, 137 hay một lần sập, nhưng không sau một <code>exit 0</code> sạch sẽ. <code>KillSignal</code>/<code>TimeoutStopSec</code> là hạn chót tắt êm của slide 17. Và vì systemd đặt mỗi dịch vụ vào một <strong>cgroup</strong> riêng (CS.6), <code>systemctl stop</code> tìm và gửi tín hiệu được cho mọi tiến trình dịch vụ từng khởi động — kể cả daemon fork hai lần và các tiến trình mồ côi — điều mà cả shell lẫn tệp PID đều không làm được.</p>
<p>Nửa phải của slide được chạy trên Debian 12 với systemd 252 lúc dựng bộ slide (container của môn học không có systemd). <code>systemd-analyze verify</code> với tệp này không in gì và thoát 0. Bớt một chữ cái — <code>Restart=on-failur</code> — nó in <code>Failed to parse service restart specifier, ignoring: on-failur</code> và <strong>vẫn thoát 0</strong>: systemd bỏ qua dòng đó và dịch vụ âm thầm nhận giá trị mặc định <code>Restart=no</code>. Lần sập đầu tiên trên production sẽ để API nằm chết luôn. Giá trị mặc định đọc từ <code>/etc/systemd/system.conf</code>: <code>DefaultTimeoutStopSec=90s</code>, <code>DefaultRestartSec=100ms</code>.</p>
<p>➕ Các lệnh hằng ngày: <code>systemctl daemon-reload</code> sau khi sửa, <code>systemctl enable --now ctshop-api</code>, <code>systemctl status ctshop-api</code> (hiện PID chính, cây cgroup và mấy dòng log cuối), <code>journalctl -u ctshop-api -f</code>, <code>systemctl kill -s HUP ctshop-api</code>. Với Java thêm <code>SuccessExitStatus=143</code> để một lần dừng không bị tính là thất bại (slide 19). <code>LimitNOFILE=</code> (CS.2) và <code>MemoryMax=</code> (CS.5) cũng đặt ở đây. Bài 10.A, slide 19 giải thích systemd khởi động máy thế nào.</p>
<p class="pitfall">⚠️ <code>ExecStart=npm start</code> hay <code>ExecStart=/bin/bash -c "cd … &amp;&amp; node …"</code> mang trở lại các lớp thừa của slide 22 — systemd gửi tín hiệu cho cả cgroup nên việc dừng vẫn chạy, nhưng PID chính là sai tiến trình và mã thoát đến từ lớp bọc.</p>`],
      [25, '🧭 On a real server / in this project',
        `<p class="y-chinh">🎯 This website's backend does the right things — <code>tini</code> → <code>fix-uploads-perms.sh</code> → <code>exec "$@"</code> → <code>node dist/index.js</code>, and a <code>shutdown()</code> handler (<code>server.close()</code> → <code>prisma.$disconnect()</code> → flush Sentry → exit 0, forced exit after 30 s) — with <strong>one mismatch</strong>: <code>docker-compose.yml</code> sets no <code>stop_grace_period</code> for the backend, so Docker waits 10 s and the 30-s safety timer can never fire. Plus two real incidents with exit code 137.</p>
<p><strong>The mismatch</strong>, found while preparing this deck by reading the files of the project. The shutdown code, simplified:</p>
<pre><code class="language-typescript">const shutdown = async (signal: string): Promise&lt;void&gt; =&gt; {
  logger.info('shutdown signal received', { signal });
  server.close(async () =&gt; {             // 1. stop accepting, 2. wait for in-flight requests
    await prisma.$disconnect();          // 3. close the database pool
    await flushSentry(2000);             //    flush error reports
    process.exit(0);                     // 4. exit 0
  });
  setTimeout(() =&gt; {                     // safety net
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30_000);
};
process.on('SIGTERM', () =&gt; shutdown('SIGTERM'));</code></pre>
<p>Every piece of slides 17–18 is there. But Docker gives a container <strong>10 s</strong> unless told otherwise, and the backend service in Compose has no <code>stop_grace_period</code> (only the nginx service sets one). So a request that takes longer than 10 s during a deploy is cut by SIGKILL, the container exits 137, and the log line "Could not close connections in time" — the one message that would explain it — is never written. Two possible fixes, each one line: <code>stop_grace_period: 35s</code> on the backend service (deadline longer than the app's timer), or a safety timer below 10 s. The finding was reported to the project owner; it is a good example of the rule "the orchestrator's deadline and the app's timer must agree".</p>
<p><strong>Two incidents from the project's history (July 2026)</strong>: (1) two image builds ran in parallel on the 6 GB VPS, the kernel's OOM killer chose <code>next build</code> and it ended with <strong>exit 137</strong>; the fix was to build the images one after the other. (2) During a deploy, a race between two workflows recreating the backend container left it <strong>Exited (137)</strong> with orphan containers around it; it was recovered with <code>docker start</code>, and deploys were moved to a single script. Both times "137" was the first clue, and the question was the one of slide 10: <em>who</em> sent SIGKILL?</p>
<p>➕ The three-step checklist on the slide, to keep: read the exit code (<code>docker ps -a</code>, <code>kubectl describe pod</code>); for 137 ask who sent SIGKILL (<code>docker inspect -f '&#123;&#123;.State.OOMKilled&#125;&#125;'</code>, <code>dmesg | grep -i oom</code> — CS.5); 143 or 0 is a normal stop; 127 means a binary missing in the image.</p>`,
        `<p class="y-chinh">🎯 Backend của website này làm đúng — <code>tini</code> → <code>fix-uploads-perms.sh</code> → <code>exec "$@"</code> → <code>node dist/index.js</code>, và một handler <code>shutdown()</code> (<code>server.close()</code> → <code>prisma.$disconnect()</code> → xả Sentry → thoát 0, ép thoát sau 30 giây) — với <strong>một chỗ lệch</strong>: <code>docker-compose.yml</code> không đặt <code>stop_grace_period</code> cho backend, nên Docker chờ 10 giây và hẹn giờ an toàn 30 giây không bao giờ kịp chạy. Kèm hai sự cố thật có mã thoát 137.</p>
<p><strong>Chỗ lệch</strong>, phát hiện khi chuẩn bị bộ slide này bằng cách đọc các tệp của dự án. Mã tắt máy, rút gọn:</p>
<pre><code class="language-typescript">const shutdown = async (signal: string): Promise&lt;void&gt; =&gt; {
  logger.info('shutdown signal received', { signal });
  server.close(async () =&gt; {             // 1. ngừng nhận, 2. chờ request đang chạy
    await prisma.$disconnect();          // 3. đóng pool kết nối cơ sở dữ liệu
    await flushSentry(2000);             //    xả báo cáo lỗi
    process.exit(0);                     // 4. thoát 0
  });
  setTimeout(() =&gt; {                     // lưới an toàn
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30_000);
};
process.on('SIGTERM', () =&gt; shutdown('SIGTERM'));</code></pre>
<p>Mọi mảnh của slide 17–18 đều có mặt. Nhưng Docker cho một container <strong>10 giây</strong> nếu không được dặn khác, và dịch vụ backend trong Compose không có <code>stop_grace_period</code> (chỉ dịch vụ nginx có đặt). Vì vậy một request dài hơn 10 giây trong lúc deploy sẽ bị SIGKILL cắt, container thoát 137, và dòng log "Could not close connections in time" — thông điệp duy nhất giải thích được chuyện đó — không bao giờ được ghi. Hai cách sửa, mỗi cách một dòng: <code>stop_grace_period: 35s</code> cho dịch vụ backend (hạn chót dài hơn hẹn giờ của ứng dụng), hoặc một hẹn giờ an toàn dưới 10 giây. Phát hiện này đã được báo cho chủ dự án; nó là ví dụ tốt cho quy tắc "hạn chót của bộ điều phối và hẹn giờ của ứng dụng phải khớp nhau".</p>
<p><strong>Hai sự cố trong lịch sử dự án (tháng 7/2026)</strong>: (1) hai lần build image chạy song song trên VPS 6 GB, OOM killer của nhân chọn <code>next build</code> và nó kết thúc với <strong>mã thoát 137</strong>; cách sửa là build các image lần lượt từng cái. (2) Trong một lần deploy, cuộc đua giữa hai workflow cùng tạo lại container backend để nó nằm ở <strong>Exited (137)</strong> với các container mồ côi xung quanh; nó được cứu bằng <code>docker start</code>, và việc deploy được dồn về một script duy nhất. Cả hai lần "137" là manh mối đầu tiên, và câu hỏi chính là câu của slide 10: <em>ai</em> đã gửi SIGKILL?</p>
<p>➕ Danh sách ba bước trên slide, nên giữ lại: đọc mã thoát (<code>docker ps -a</code>, <code>kubectl describe pod</code>); với 137 hỏi ai đã gửi SIGKILL (<code>docker inspect -f '&#123;&#123;.State.OOMKilled&#125;&#125;'</code>, <code>dmesg | grep -i oom</code> — CS.5); 143 hoặc 0 là dừng bình thường; 127 nghĩa là thiếu chương trình trong image.</p>`],
      [26, '🎤 Interview questions you will be asked',
        `<p class="y-chinh">🎯 Six questions that come up in backend interviews, with short model answers: fork vs exec; what is a zombie; 137 vs 143; SIGTERM vs SIGKILL; why a container takes 10 s to stop; how to shut down gracefully.</p>
<p>The cards give the 20-second answer. Interviewers usually follow up — here are the follow-ups and what a strong answer adds:</p>
<ul>
<li><strong>fork() vs exec()?</strong> Follow-up: "Why two calls?" — the gap lets the child redirect files, change directory, drop privileges before the new program starts (slide 7). "Is fork expensive?" — copy-on-write: it copies page tables, not memory; the cost grows with the size of the address space, which is why big JVMs use <code>posix_spawn</code>.</li>
<li><strong>What is a zombie?</strong> Follow-up: "Your container shows 500 &lt;defunct&gt; processes, what do you do?" — find their parent with <code>ps -o ppid</code>; if it is PID 1 and an app, add <code>--init</code>; if it is a worker, fix its <code>wait</code>/<code>SIGCHLD</code> handling; killing zombies does nothing (slides 11–13).</li>
<li><strong>Exit 137 vs 143?</strong> Follow-up: "Is 137 always out of memory?" — no: any SIGKILL; check <code>OOMKilled</code>, <code>dmesg</code>, the stop timeout (slide 10).</li>
<li><strong>SIGTERM vs SIGKILL?</strong> Follow-up: "Why can't SIGKILL be caught?" — so that an administrator can always stop any process; the kernel handles it without running user code (slide 16).</li>
<li><strong>Why does my container take 10 s to stop?</strong> Follow-up: "How do you prove it?" — <code>ps -o pid,args -p 1</code> and <code>grep SigCgt /proc/1/status</code> inside the container (slide 21); fix with exec form, <code>--init</code>, a handler.</li>
<li><strong>How do you shut down gracefully?</strong> Follow-up: "And in Kubernetes?" — readiness/endpoints removal plus a <code>preStop</code> sleep so the load balancer stops sending first, <code>terminationGracePeriodSeconds</code> longer than the app's drain timeout, Spring's <code>timeout-per-shutdown-phase</code> inside it (slides 17–19).</li>
</ul>
<p>➕ Three more questions in the same family, worth preparing: "What is PID 1 and what is special about it?" (slide 20: signals with default action are dropped, it must reap orphans, its death kills the namespace); "What does <code>nohup</code> do?" (ignores SIGHUP — slide 23); "How would you run a Node app as a service on a VM?" (a systemd unit with <code>Restart=on-failure</code>, not <code>nohup … &amp;</code> — slide 24). CS.8 collects 40 OS interview questions.</p>
<p class="meo">🧠 Answer pattern that impresses: definition in one sentence → the command that proves it → the production story. "A zombie is … — you see it as <code>Z</code> in <code>ps</code> — we had them under a Node PID 1 until we added tini."</p>`,
        `<p class="y-chinh">🎯 Sáu câu hay gặp trong phỏng vấn backend, kèm câu trả lời mẫu ngắn: fork khác exec; zombie là gì; 137 khác 143; SIGTERM khác SIGKILL; vì sao container mất 10 giây mới dừng; tắt êm thế nào.</p>
<p>Các thẻ cho câu trả lời 20 giây. Người phỏng vấn thường hỏi tiếp — đây là các câu hỏi tiếp theo và điều một câu trả lời mạnh nói thêm:</p>
<ul>
<li><strong>fork() khác exec()?</strong> Hỏi tiếp: "Sao lại là hai lời gọi?" — khoảng hở cho phép tiến trình con chuyển hướng tệp, đổi thư mục, bỏ quyền trước khi chương trình mới bắt đầu (slide 7). "fork có tốn không?" — copy-on-write: nó chép bảng trang, không chép bộ nhớ; chi phí tăng theo kích thước không gian địa chỉ, vì vậy các JVM lớn dùng <code>posix_spawn</code>.</li>
<li><strong>Zombie là gì?</strong> Hỏi tiếp: "Container của bạn có 500 tiến trình &lt;defunct&gt;, bạn làm gì?" — tìm cha của chúng bằng <code>ps -o ppid</code>; nếu cha là PID 1 và là một ứng dụng thì thêm <code>--init</code>; nếu là một worker thì sửa phần <code>wait</code>/xử lý <code>SIGCHLD</code> của nó; giết zombie chẳng có tác dụng gì (slide 11–13).</li>
<li><strong>Mã 137 khác 143?</strong> Hỏi tiếp: "137 có phải luôn là hết bộ nhớ?" — không: là SIGKILL bất kỳ; kiểm <code>OOMKilled</code>, <code>dmesg</code>, hạn chờ khi dừng (slide 10).</li>
<li><strong>SIGTERM khác SIGKILL?</strong> Hỏi tiếp: "Sao SIGKILL không bắt được?" — để người quản trị luôn dừng được mọi tiến trình; nhân tự xử lý nó mà không chạy mã người dùng (slide 16).</li>
<li><strong>Sao container của tôi mất 10 giây mới dừng?</strong> Hỏi tiếp: "Chứng minh thế nào?" — <code>ps -o pid,args -p 1</code> và <code>grep SigCgt /proc/1/status</code> bên trong container (slide 21); sửa bằng dạng exec, <code>--init</code>, một handler.</li>
<li><strong>Tắt êm thế nào?</strong> Hỏi tiếp: "Còn trong Kubernetes?" — gỡ readiness/endpoint cộng một lệnh <code>preStop</code> sleep để bộ cân bằng tải ngừng gửi trước, <code>terminationGracePeriodSeconds</code> dài hơn thời gian chờ request của ứng dụng, <code>timeout-per-shutdown-phase</code> của Spring nằm gọn bên trong (slide 17–19).</li>
</ul>
<p>➕ Thêm ba câu cùng họ, nên chuẩn bị: "PID 1 là gì và có gì đặc biệt?" (slide 20: tín hiệu có hành động mặc định bị vứt, nó phải gặt mồ côi, nó chết thì cả namespace chết theo); "<code>nohup</code> làm gì?" (bỏ qua SIGHUP — slide 23); "Bạn chạy một ứng dụng Node như một dịch vụ trên máy ảo thế nào?" (một unit systemd với <code>Restart=on-failure</code>, không phải <code>nohup … &amp;</code> — slide 24). CS.8 gom 40 câu phỏng vấn HĐH.</p>
<p class="meo">🧠 Mẫu trả lời gây ấn tượng: định nghĩa một câu → lệnh chứng minh nó → câu chuyện production. "Zombie là … — bạn thấy nó là <code>Z</code> trong <code>ps</code> — bọn em từng có chúng dưới một PID 1 là Node cho tới khi thêm tini."</p>`],
      [27, 'Check yourself',
        `<p class="y-chinh">🎯 Three questions that mix the whole deck: (1) a pod with exit code 137 and <code>OOMKilled: false</code> — what else sent SIGKILL? (2) 300 zombies with PPID 1 in your container — what is PID 1, and which flag fixes it? (3) <code>CMD npm start</code> plus <code>process.on('SIGTERM')</code> — does the handler run on <code>docker stop</code>?</p>
<p>Answer each one yourself before opening the explanation; each points to the slide where you can check.</p>
<details><summary>1 · Exit 137, OOMKilled false</summary>
<p>SIGKILL without the OOM killer: the <strong>stop timeout</strong> expired after SIGTERM — <code>docker stop</code> after 10 s, Kubernetes after <code>terminationGracePeriodSeconds</code> (30 s), for example during a rolling update or a node drain — or a person/script ran <code>kill -9</code>. Kubernetes also kills a container whose <strong>liveness probe</strong> keeps failing (SIGTERM, then SIGKILL after the grace period). Check the events (<code>kubectl describe pod</code>) for "Killing" and probe failures. Slides 10, 17, 21.</p>
</details>
<details><summary>2 · 300 zombies with PPID 1</summary>
<p>PID 1 is your application (Node, Java, Python…), which does not call <code>wait(-1)</code> for children it did not spawn; the zombies are orphans adopted by it — often helpers of a headless browser or a shell script started in the background. Fix: <code>docker run --init</code> (Compose <code>init: true</code>) or tini as <code>ENTRYPOINT</code>. Slides 12–13 (run for real with <code>unshare</code>).</p>
</details>
<details><summary>3 · CMD npm start + a SIGTERM handler</summary>
<p>No. Measured on slide 21 (row F) and rebuilt in the runner (case D): PID 1 is npm, npm passes SIGTERM to the <code>sh</code> it runs the script with, sh dies, npm exits 1, and when PID 1 exits the kernel SIGKILLs the rest of the namespace — node never runs its handler. Use <code>CMD ["node", "dist/index.js"]</code> (and <code>--init</code>). Slides 21–22.</p>
</details>
<p>➕ A fourth one to try at home: write a two-line Dockerfile for a Node app, start it, run <code>docker exec &lt;c&gt; cat /proc/1/status | grep -E 'Name|SigCgt'</code>, then time <code>docker stop</code>. Change one thing (exec form, <code>--init</code>, a handler) and time it again — you will reproduce the table of slide 21 yourself.</p>
<details><summary>4 · Exit code 126 in CI, only after the repository was cloned on Windows</summary>
<p>126 = found but not executable (slide 9). A file's executable bit is stored by git; editing or committing from a Windows checkout can lose it (<code>core.fileMode</code>), so <code>./deploy.sh</code> fails with "Permission denied". Fix with <code>git update-index --chmod=+x deploy.sh</code>, or call it as <code>bash deploy.sh</code>.</p>
</details>
<details><summary>5 · A C server prints "shutting down" with printf inside its SIGTERM handler and hangs once in a while</summary>
<p><code>printf</code> is not async-signal-safe: if the signal arrives while the main code is inside <code>printf</code>/<code>malloc</code>, the handler waits for a lock its own thread holds (slide 16). Set a <code>volatile sig_atomic_t</code> flag in the handler and print from the main loop — or use <code>write(2)</code> in the handler.</p>
</details>`,
        `<p class="y-chinh">🎯 Ba câu trộn cả bộ slide: (1) một pod có mã thoát 137 và <code>OOMKilled: false</code> — còn gì khác đã gửi SIGKILL? (2) 300 zombie có PPID 1 trong container của bạn — PID 1 là gì, và cờ nào sửa được? (3) <code>CMD npm start</code> cộng <code>process.on('SIGTERM')</code> — handler có chạy khi <code>docker stop</code> không?</p>
<p>Tự trả lời từng câu trước khi mở phần giải thích; mỗi câu chỉ tới slide để bạn tự kiểm.</p>
<details><summary>1 · Mã 137, OOMKilled false</summary>
<p>SIGKILL mà không phải do OOM killer: <strong>hạn chờ khi dừng</strong> đã hết sau SIGTERM — <code>docker stop</code> sau 10 giây, Kubernetes sau <code>terminationGracePeriodSeconds</code> (30 giây), chẳng hạn trong một lần cập nhật cuốn chiếu (rolling update) hay khi rút một node — hoặc một người/script đã chạy <code>kill -9</code>. Kubernetes còn giết một container có <strong>liveness probe</strong> thất bại liên tục (SIGTERM, rồi SIGKILL sau thời gian ân hạn). Xem các sự kiện (<code>kubectl describe pod</code>) tìm "Killing" và lỗi probe. Slide 10, 17, 21.</p>
</details>
<details><summary>2 · 300 zombie có PPID 1</summary>
<p>PID 1 là ứng dụng của bạn (Node, Java, Python…), vốn không gọi <code>wait(-1)</code> cho những con nó không tự sinh ra; các zombie là những đứa mồ côi nó nhận về — thường là tiến trình phụ của một trình duyệt không giao diện hoặc một script shell chạy nền. Sửa: <code>docker run --init</code> (<code>init: true</code> của Compose) hoặc tini làm <code>ENTRYPOINT</code>. Slide 12–13 (chạy thật bằng <code>unshare</code>).</p>
</details>
<details><summary>3 · CMD npm start + handler SIGTERM</summary>
<p>Không. Đo ở slide 21 (hàng F) và dựng lại trong runner (trường hợp D): PID 1 là npm, npm chuyển SIGTERM cho <code>sh</code> mà nó dùng để chạy script, sh chết, npm thoát 1, và khi PID 1 thoát nhân SIGKILL phần còn lại của namespace — node không bao giờ chạy handler của nó. Dùng <code>CMD ["node", "dist/index.js"]</code> (và <code>--init</code>). Slide 21–22.</p>
</details>
<p>➕ Câu thứ tư để tự làm ở nhà: viết một Dockerfile hai dòng cho một ứng dụng Node, chạy nó, gõ <code>docker exec &lt;c&gt; cat /proc/1/status | grep -E 'Name|SigCgt'</code>, rồi bấm giờ <code>docker stop</code>. Đổi một thứ (dạng exec, <code>--init</code>, một handler) và bấm giờ lại — bạn sẽ tự tái hiện bảng của slide 21.</p>
<details><summary>4 · Mã thoát 126 trên CI, chỉ sau khi repository được clone trên Windows</summary>
<p>126 = tìm thấy nhưng không thực thi được (slide 9). Bit thực thi của một tệp được git lưu; sửa hay commit từ một bản checkout trên Windows có thể làm mất nó (<code>core.fileMode</code>), nên <code>./deploy.sh</code> thất bại với "Permission denied". Sửa bằng <code>git update-index --chmod=+x deploy.sh</code>, hoặc gọi nó bằng <code>bash deploy.sh</code>.</p>
</details>
<details><summary>5 · Một server C in "shutting down" bằng printf bên trong handler SIGTERM và thỉnh thoảng bị treo</summary>
<p><code>printf</code> không an toàn khi gọi từ handler (không async-signal-safe): nếu tín hiệu tới lúc mã chính đang ở trong <code>printf</code>/<code>malloc</code>, handler chờ một khoá do chính luồng của nó đang giữ (slide 16). Bật một cờ <code>volatile sig_atomic_t</code> trong handler và in từ vòng lặp chính — hoặc dùng <code>write(2)</code> trong handler.</p>
</details>`],
      [28, 'Summary',
        `<p class="y-chinh">🎯 Every process has a parent (<code>ps -ef --forest</code>, <code>pstree</code>, <code>/proc/&lt;pid&gt;</code>); <strong>fork</strong> copies, <strong>exec</strong> replaces, <strong>wait</strong> collects the exit code; 0 ok · 126/127 not executable / not found · <strong>128 + N</strong> killed by signal N; a zombie is not reaped, an orphan is adopted by PID 1, which must reap; SIGTERM → clean up and exit before the deadline, SIGKILL cannot be caught; in Docker: <strong>exec form + tini/--init + a SIGTERM handler</strong>.</p>
<p>If you remember one picture, keep the kitchen of slide 3 — and if you remember one command, keep <code>cat /proc/1/status</code> inside a container: it tells you who PID 1 is and, through <code>SigCgt</code>, whether <code>docker stop</code> will be polite or will wait for SIGKILL.</p>
<p>Next, in <strong>CS.2 — File descriptors &amp; I/O plumbing</strong>, we open <code>/proc/&lt;pid&gt;/fd</code> — the 19 entries you saw on slide 6 — and follow them into pipes, sockets, "Too many open files" and why PostgreSQL needs <code>fsync</code>. Before that, do the exercises of this section (lesson "CS.1 — 🧪 Practice") and the 10-question quiz.</p>
<p>➕ The deck on one page — commands to keep in your notes:</p>
<table>
<thead><tr><th>Command</th><th>Answers</th><th>Slide</th></tr></thead>
<tbody>
<tr><td><code>ps -eo pid,ppid,stat,cmd --forest</code> · <code>pstree -ps PID</code></td><td>who started whom, in which state</td><td>5</td></tr>
<tr><td><code>cat /proc/PID/status</code> · <code>tr '\\0' ' ' &lt; /proc/PID/cmdline</code></td><td>state, memory, threads, owner, real command line</td><td>6</td></tr>
<tr><td><code>echo $?</code> · <code>kill -l 143</code></td><td>how did the last command end, which signal is that code</td><td>9–10, 14</td></tr>
<tr><td><code>ps -o pid,ppid,stat,cmd --ppid PID</code></td><td>does this process leave zombies behind</td><td>11–12</td></tr>
<tr><td><code>kill -TERM PID</code>, wait, then <code>kill -KILL PID</code></td><td>stop politely, then by force</td><td>15–17</td></tr>
<tr><td><code>kill -3 JAVA_PID</code> · <code>jcmd PID Thread.print</code></td><td>what are the JVM's threads doing</td><td>14</td></tr>
<tr><td><code>grep SigCgt /proc/1/status</code> (in a container)</td><td>will <code>docker stop</code> be polite</td><td>20–21</td></tr>
<tr><td><code>docker ps -a</code> · <code>docker inspect -f '&#123;&#123;.State.OOMKilled&#125;&#125;' C</code></td><td>why did the container exit</td><td>10, 25</td></tr>
<tr><td><code>systemctl status S</code> · <code>journalctl -u S -f</code></td><td>main PID, cgroup and logs of a service</td><td>24</td></tr>
</tbody>
</table>
<p>➕ A plan for the week after this lesson: (1) run <code>pstree -p</code> and <code>cat /proc/1/status</code> on every machine and container you work with, and write down who PID 1 is; (2) open the Dockerfile of your own project and check the last two lines against slide 22; (3) add a SIGTERM handler with <code>server.close()</code> to one Node service, or check <code>server.shutdown</code> in one Spring Boot project, and measure a deploy with a slow request in flight like slide 18 did; (4) compare your orchestrator's stop deadline with your app's own timer (slide 25). Four small checks that remove a whole class of production incidents.</p>`,
        `<p class="y-chinh">🎯 Mọi tiến trình đều có cha (<code>ps -ef --forest</code>, <code>pstree</code>, <code>/proc/&lt;pid&gt;</code>); <strong>fork</strong> sao chép, <strong>exec</strong> thay chương trình, <strong>wait</strong> thu mã thoát; 0 ổn · 126/127 không thực thi được / không tìm thấy · <strong>128 + N</strong> bị tín hiệu N giết; zombie là chưa được gặt, mồ côi được PID 1 nhận nuôi và PID 1 phải gặt; SIGTERM → dọn dẹp và thoát trước hạn chót, SIGKILL không bắt được; trong Docker: <strong>dạng exec + tini/--init + một handler SIGTERM</strong>.</p>
<p>Nếu chỉ nhớ một hình ảnh, hãy giữ căn bếp của slide 3 — và nếu chỉ nhớ một lệnh, hãy giữ <code>cat /proc/1/status</code> bên trong container: nó cho bạn biết PID 1 là ai và, qua <code>SigCgt</code>, <code>docker stop</code> sẽ lịch sự hay sẽ phải chờ SIGKILL.</p>
<p>Tiếp theo, trong <strong>CS.2 — File descriptor và đường ống I/O</strong>, ta mở <code>/proc/&lt;pid&gt;/fd</code> — 19 mục bạn đã thấy ở slide 6 — và lần theo chúng tới ống (pipe), socket, lỗi "Too many open files" và lý do PostgreSQL cần <code>fsync</code>. Trước đó, hãy làm các bài tập của phần này (bài "CS.1 — 🧪 Thực hành") và quiz 10 câu.</p>
<p>➕ Cả bộ slide trong một trang — các lệnh nên chép vào sổ tay:</p>
<table>
<thead><tr><th>Lệnh</th><th>Trả lời câu hỏi</th><th>Slide</th></tr></thead>
<tbody>
<tr><td><code>ps -eo pid,ppid,stat,cmd --forest</code> · <code>pstree -ps PID</code></td><td>ai khởi động ai, đang ở trạng thái nào</td><td>5</td></tr>
<tr><td><code>cat /proc/PID/status</code> · <code>tr '\\0' ' ' &lt; /proc/PID/cmdline</code></td><td>trạng thái, bộ nhớ, số luồng, chủ sở hữu, dòng lệnh thật</td><td>6</td></tr>
<tr><td><code>echo $?</code> · <code>kill -l 143</code></td><td>lệnh vừa rồi kết thúc thế nào, mã đó là tín hiệu nào</td><td>9–10, 14</td></tr>
<tr><td><code>ps -o pid,ppid,stat,cmd --ppid PID</code></td><td>tiến trình này có để lại zombie không</td><td>11–12</td></tr>
<tr><td><code>kill -TERM PID</code>, chờ, rồi <code>kill -KILL PID</code></td><td>dừng lịch sự, rồi mới dùng vũ lực</td><td>15–17</td></tr>
<tr><td><code>kill -3 JAVA_PID</code> · <code>jcmd PID Thread.print</code></td><td>các luồng của JVM đang làm gì</td><td>14</td></tr>
<tr><td><code>grep SigCgt /proc/1/status</code> (trong container)</td><td><code>docker stop</code> có lịch sự không</td><td>20–21</td></tr>
<tr><td><code>docker ps -a</code> · <code>docker inspect -f '&#123;&#123;.State.OOMKilled&#125;&#125;' C</code></td><td>vì sao container thoát</td><td>10, 25</td></tr>
<tr><td><code>systemctl status S</code> · <code>journalctl -u S -f</code></td><td>PID chính, cgroup và log của một dịch vụ</td><td>24</td></tr>
</tbody>
</table>
<p>➕ Kế hoạch cho tuần sau bài học: (1) chạy <code>pstree -p</code> và <code>cat /proc/1/status</code> trên mọi máy và container bạn đang làm việc, và ghi lại PID 1 là ai; (2) mở Dockerfile của chính dự án bạn và đối chiếu hai dòng cuối với slide 22; (3) thêm một handler SIGTERM có <code>server.close()</code> vào một dịch vụ Node, hoặc kiểm <code>server.shutdown</code> trong một dự án Spring Boot, và đo một lần deploy khi có request chậm đang chạy như slide 18 đã làm; (4) so hạn chót dừng của bộ điều phối với hẹn giờ của chính ứng dụng (slide 25). Bốn lần kiểm nhỏ gỡ bỏ cả một lớp sự cố production.</p>`],
    ]),
    books([
      ['man7', "signal(7), signal-safety(7), sigaction(2), kill(2), pid_namespaces(7) (signals to init, SIGKILL from an ancestor namespace, init's death), unshare(1), nohup(1), bash(1) (trap, job control, huponexit), systemd.service(5), systemd.kill(5), systemd-system.conf(5)", 'signal(7), signal-safety(7), sigaction(2), kill(2), pid_namespaces(7) (tín hiệu tới init, SIGKILL từ namespace tổ tiên, init chết), unshare(1), nohup(1), bash(1) (trap, job control, huponexit), systemd.service(5), systemd.kill(5), systemd-system.conf(5)'],
      ['posix', 'System Interfaces: sigaction, kill, signal.h (async-signal-safe functions); Shell and Utilities: trap, kill, jobs, nohup', 'System Interfaces: sigaction, kill, signal.h (các hàm async-signal-safe); Shell and Utilities: trap, kill, jobs, nohup'],
      ['mos4', 'Chapter 10, section 10.3 (signals in Linux, Figures 10-5 and 10-6) and section 10.3.7 (booting, init) — the school lesson 10.A', 'Chương 10, mục 10.3 (tín hiệu trong Linux, Hình 10-5 và 10-6) và mục 10.3.7 (khởi động, init) — bài trường 10.A'],
      ['ostep', 'Chapter 5 "Interlude: Process API" (signals, kill, the shell)', 'Chương 5 "Interlude: Process API" (tín hiệu, kill, shell)'],
    ]),
  ].join('\n'),
};

/* ───────── ⭐ CS.1 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Linux processes: exit codes, fork, zombies, graceful workers, entrypoints ───────── */
const L_x_cs1_on = {
  title: '⭐ CS.1 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Linux processes: exit codes, fork, zombies, graceful workers, entrypoints|||⭐ CS.1 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Tiến trình Linux: mã thoát, fork, zombie, worker tắt êm, entrypoint',
  slug: 'osg202-cs1-on',
  type: 'VIDEO',
  description: 'Sáu bài tập có lời giải chạy thật cho phần ⭐ CS.1 (tự thêm, không thi FE): tạo và giải mã tám mã thoát thật (0, 1, 127, 134, 139, 141, 143, 137), đếm số tiến trình của năm mẫu fork bằng một chương trình đếm qua ống, gặt con tự động bằng SIGCHLD = SIG_IGN và cái giá phải trả, viết một worker hàng đợi Node.js tắt êm khi đang làm dở việc, so script entrypoint của Docker có và không có exec "$@" khi làm PID 1, dọn thư mục tạm bằng trap EXIT và thấy SIGKILL bỏ qua nó — kèm bảng thuật ngữ Anh–Việt và tóm tắt.',
  content: [
    bi(`<span class="eyebrow">⭐ Advanced 1 · Lesson CS.1 · Practice &amp; review</span>
<h2>Six exercises: the Linux process model, computed and run</h2>
<p class="lead">Each exercise is a situation you meet on a real server or in an interview. Try it first on paper or in your own terminal (the time in brackets is a target, not a limit), then open the solution: every solution is a program run for real in the course container, with its real output. Exercises 1–3 drill the mechanics (exit codes, fork, reaping); 4–6 are backend tasks (a worker that stops gracefully, a Docker entrypoint, a script that always cleans up).</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>1</td><td>produce and decode eight real exit codes</td><td>CS.1 slides 9–10, 14</td></tr>
<tr><td>2</td><td>count processes created by fork patterns</td><td>CS.1 slides 7–8</td></tr>
<tr><td>3</td><td>reap children automatically with SIG_IGN, and its price</td><td>CS.1 slides 11–12</td></tr>
<tr><td>4</td><td>a queue worker that shuts down gracefully</td><td>CS.1 slides 17–18</td></tr>
<tr><td>5</td><td>Docker entrypoint script with and without exec</td><td>CS.1 slides 20–22</td></tr>
<tr><td>6</td><td>trap EXIT for cleanup, and what SIGKILL does to it</td><td>CS.1 slide 15</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">⭐ Chuyên sâu 1 · Bài CS.1 · Thực hành &amp; ôn tập</span>
<h2>Sáu bài tập: mô hình tiến trình Linux, tính ra và chạy thật</h2>
<p class="lead">Mỗi bài là một tình huống bạn gặp trên server thật hoặc trong phỏng vấn. Hãy tự làm trước trên giấy hoặc trong terminal của bạn (thời gian trong ngoặc là mục tiêu, không phải giới hạn), rồi mới mở lời giải: mọi lời giải là một chương trình chạy thật trong container của môn học, kèm output thật. Bài 1–3 luyện cơ chế (mã thoát, fork, gặt con); bài 4–6 là việc của dev backend (worker tắt êm, entrypoint của Docker, script luôn dọn dẹp).</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Bài học</th></tr></thead>
<tbody>
<tr><td>1</td><td>tạo và giải mã tám mã thoát thật</td><td>CS.1 slide 9–10, 14</td></tr>
<tr><td>2</td><td>đếm số tiến trình do các mẫu fork tạo ra</td><td>CS.1 slide 7–8</td></tr>
<tr><td>3</td><td>tự động gặt con bằng SIG_IGN, và cái giá của nó</td><td>CS.1 slide 11–12</td></tr>
<tr><td>4</td><td>worker hàng đợi tắt êm</td><td>CS.1 slide 17–18</td></tr>
<tr><td>5</td><td>script entrypoint của Docker có và không có exec</td><td>CS.1 slide 20–22</td></tr>
<tr><td>6</td><td>trap EXIT để dọn dẹp, và SIGKILL làm gì với nó</td><td>CS.1 slide 15</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — decode the exit codes of a bad night (10 min)</h3>
<p>Your on-call log shows these exit codes for eight different jobs: <strong>0, 1, 127, 134, 139, 141, 143, 137</strong>. For each one write: (a) did the program end by itself or was it killed by a signal? (b) if killed, which signal, and who usually sends it? (c) the first command you would run to investigate. Then reproduce every code yourself in a shell, without writing any C.</p>
<details><summary>Solution — every code produced for real, then decoded with kill -l</summary>
<div class="out"># Exercise 1: produce each exit code for real, then decode it with kill -l<br>
$ true; a=$?; false; b=$?; nosuchcmd 2&gt;/dev/null; c=$?<br>
$ sh -c 'kill -ABRT $$'; d=$?<br>
bash: &nbsp;&nbsp;&nbsp;12 Aborted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sh -c 'kill -ABRT $$'<br>
$ sh -c 'kill -SEGV $$'; e=$?<br>
bash: &nbsp;&nbsp;&nbsp;15 Segmentation fault &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sh -c 'kill -SEGV $$'<br>
$ yes | head -1 &gt; /dev/null; f=&#36;{PIPESTATUS[0]}<br>
$ sh -c 'kill -TERM $$'; g=$?<br>
Terminated<br>
$ sh -c 'kill -KILL $$'; h=$?<br>
bash: &nbsp;&nbsp;&nbsp;25 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sh -c 'kill -KILL $$'<br>
$ for code in $a $b $c $d $e $f $g $h; do if [ $code -gt 128 ]; then echo "$code = 128 + $((code-128)) -&gt; killed by SIG$(kill -l $code)"; else echo "$code = exit($code) from the program or the shell"; fi; done<br>
0 = exit(0) from the program or the shell<br>
1 = exit(1) from the program or the shell<br>
127 = exit(127) from the program or the shell<br>
134 = 128 + 6 -&gt; killed by SIGABRT<br>
139 = 128 + 11 -&gt; killed by SIGSEGV<br>
141 = 128 + 13 -&gt; killed by SIGPIPE<br>
143 = 128 + 15 -&gt; killed by SIGTERM<br>
137 = 128 + 9 -&gt; killed by SIGKILL</div>
<ul>
<li><strong>0, 1, 127</strong> — ended by itself: success, a general error, "command not found" (a binary missing in the image or a typo in <code>PATH</code>; check with <code>command -v</code>).</li>
<li><strong>134 = SIGABRT</strong> — the program aborted itself: a failed <code>assert</code>, glibc detecting heap corruption, a C++ <code>std::terminate</code>. Look for a core dump or the last log lines.</li>
<li><strong>139 = SIGSEGV</strong> — a crash in native code; check native modules / extensions, run with a debugger or AddressSanitizer.</li>
<li><strong>141 = SIGPIPE</strong> — wrote to a pipe whose reader had gone (<code>yes | head -1</code>); usually harmless in shell pipelines, and why <code>set -o pipefail</code> scripts sometimes fail "for no reason".</li>
<li><strong>143 = SIGTERM</strong> — a normal stop request without a handler (a deploy, <code>docker stop</code>).</li>
<li><strong>137 = SIGKILL</strong> — OOM killer, stop timeout or <code>kill -9</code>: check <code>OOMKilled</code>, <code>dmesg</code>, the orchestrator's events.</li>
</ul>
<p>Note how each case was produced: <code>sh -c 'kill -SIG $$'</code> makes a shell send the signal to <em>itself</em> — the parent bash then reports it exactly like a real crash (<code>Aborted</code>, <code>Segmentation fault</code>, <code>Killed</code>). <code>kill -l 139</code> turns the number back into the name — the fastest decoder there is.</p>
</details>`,
    `<h3>🧪 Bài 1 — giải mã các mã thoát của một đêm tồi tệ (10 phút)</h3>
<p>Nhật ký trực sự cố của bạn ghi các mã thoát sau cho tám job khác nhau: <strong>0, 1, 127, 134, 139, 141, 143, 137</strong>. Với mỗi mã hãy viết: (a) chương trình tự kết thúc hay bị một tín hiệu giết? (b) nếu bị giết thì tín hiệu nào, và thường ai gửi nó? (c) lệnh đầu tiên bạn chạy để điều tra. Sau đó tự tái hiện mọi mã trong shell, không viết dòng C nào.</p>
<details><summary>Lời giải — mọi mã được tạo thật, rồi giải bằng kill -l</summary>
<div class="out"># Bài 1: tạo thật từng mã thoát, rồi giải mã bằng kill -l<br>
$ true; a=$?; false; b=$?; nosuchcmd 2&gt;/dev/null; c=$?<br>
$ sh -c 'kill -ABRT $$'; d=$?<br>
bash: &nbsp;&nbsp;&nbsp;12 Aborted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sh -c 'kill -ABRT $$'<br>
$ sh -c 'kill -SEGV $$'; e=$?<br>
bash: &nbsp;&nbsp;&nbsp;15 Segmentation fault &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sh -c 'kill -SEGV $$'<br>
$ yes | head -1 &gt; /dev/null; f=&#36;{PIPESTATUS[0]}<br>
$ sh -c 'kill -TERM $$'; g=$?<br>
Terminated<br>
$ sh -c 'kill -KILL $$'; h=$?<br>
bash: &nbsp;&nbsp;&nbsp;25 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sh -c 'kill -KILL $$'<br>
$ for code in $a $b $c $d $e $f $g $h; do if [ $code -gt 128 ]; then echo "$code = 128 + $((code-128)) -&gt; killed by SIG$(kill -l $code)"; else echo "$code = exit($code) from the program or the shell"; fi; done<br>
0 = exit(0) from the program or the shell<br>
1 = exit(1) from the program or the shell<br>
127 = exit(127) from the program or the shell<br>
134 = 128 + 6 -&gt; killed by SIGABRT<br>
139 = 128 + 11 -&gt; killed by SIGSEGV<br>
141 = 128 + 13 -&gt; killed by SIGPIPE<br>
143 = 128 + 15 -&gt; killed by SIGTERM<br>
137 = 128 + 9 -&gt; killed by SIGKILL</div>
<ul>
<li><strong>0, 1, 127</strong> — tự kết thúc: thành công, lỗi chung, "không tìm thấy lệnh" (thiếu chương trình trong image hoặc gõ sai <code>PATH</code>; kiểm bằng <code>command -v</code>).</li>
<li><strong>134 = SIGABRT</strong> — chương trình tự huỷ: một <code>assert</code> thất bại, glibc phát hiện heap bị hỏng, <code>std::terminate</code> của C++. Tìm core dump hoặc mấy dòng log cuối.</li>
<li><strong>139 = SIGSEGV</strong> — sập trong mã máy; kiểm các native module / extension, chạy với trình gỡ lỗi hoặc AddressSanitizer.</li>
<li><strong>141 = SIGPIPE</strong> — ghi vào một ống mà đầu đọc đã đi mất (<code>yes | head -1</code>); trong pipeline shell thường vô hại, và là lý do các script có <code>set -o pipefail</code> đôi khi thất bại "không rõ vì sao".</li>
<li><strong>143 = SIGTERM</strong> — một yêu cầu dừng bình thường khi không có handler (một lần deploy, <code>docker stop</code>).</li>
<li><strong>137 = SIGKILL</strong> — OOM killer, hết hạn chờ khi dừng hoặc <code>kill -9</code>: kiểm <code>OOMKilled</code>, <code>dmesg</code>, các sự kiện của bộ điều phối.</li>
</ul>
<p>Để ý cách từng trường hợp được tạo: <code>sh -c 'kill -SIG $$'</code> khiến một shell tự gửi tín hiệu cho <em>chính nó</em> — bash cha sau đó báo y như một lần sập thật (<code>Aborted</code>, <code>Segmentation fault</code>, <code>Killed</code>). <code>kill -l 139</code> đổi con số ngược thành tên — bộ giải mã nhanh nhất có thể.</p>
</details>`),
    bi(`<h3>🧪 Exercise 2 — how many processes? (15 min)</h3>
<p>For each fragment, how many processes (counting the original) reach the line after it? (a) <code>fork(); fork(); fork();</code> (b) <code>fork() &amp;&amp; fork();</code> (c) <code>fork() || fork();</code> (d) <code>if (fork() &amp;&amp; fork()) fork();</code> (e) <code>for (i = 0; i &lt; 2; i++) { fork(); fork(); }</code>. Draw the tree for (d) before you look.</p>
<details><summary>Solution — counted for real: every process writes one byte into a pipe</summary>
<pre><code class="language-c">// Exercise 2: how many processes run the line after each fork pattern? Counted for real through a pipe
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static void a(void) { fork(); fork(); fork(); }
static void b(void) { (void)(fork() &amp;&amp; fork()); }
static void c(void) { (void)(fork() || fork()); }
static void d(void) { if (fork() &amp;&amp; fork()) fork(); }
static void e(void) { for (int i = 0; i &lt; 2; i++) { fork(); fork(); } }

static int count(void (*f)(void)) {
    int fd[2];
    pipe(fd);
    pid_t h = fork();
    if (h == 0) {                                   // harness: every process that reaches the end writes one byte
        close(fd[0]);
        f();
        write(fd[1], "x", 1);
        while (wait(NULL) &gt; 0) { }                  // reap own children
        _exit(0);
    }
    close(fd[1]);
    int n = 0; char ch;
    while (read(fd[0], &amp;ch, 1) == 1) n++;           // EOF when every copy of fd[1] is closed
    waitpid(h, NULL, 0);
    close(fd[0]);
    return n;
}

int main(void) {
    printf("a) fork(); fork(); fork();             -&gt; %d processes\\n", count(a));
    printf("b) fork() &amp;&amp; fork();                   -&gt; %d processes\\n", count(b));
    printf("c) fork() || fork();                   -&gt; %d processes\\n", count(c));
    printf("d) if (fork() &amp;&amp; fork()) fork();       -&gt; %d processes\\n", count(d));
    printf("e) for (i = 0; i &lt; 2; i++) { fork(); fork(); } -&gt; %d processes\\n", count(e));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bai2-dem-fork.c -o bai2-dem-fork &amp;&amp; ./bai2-dem-fork<br>
a) fork(); fork(); fork(); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 8 processes<br>
b) fork() &amp;&amp; fork(); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 3 processes<br>
c) fork() || fork(); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 3 processes<br>
d) if (fork() &amp;&amp; fork()) fork(); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 4 processes<br>
e) for (i = 0; i &lt; 2; i++) { fork(); fork(); } -&gt; 16 processes</div>
<p>The counting trick: a harness process creates a pipe, runs the fragment, and <em>every</em> process that reaches the end writes one byte; the reader counts bytes until EOF, which arrives only when every copy of the write end — inherited through every fork — has been closed. No guessing, no interleaved output.</p>
<ul>
<li><strong>(a) 8</strong>: each <code>fork()</code> doubles the processes: 2 × 2 × 2.</li>
<li><strong>(b) 3</strong>: the first fork creates a child that sees 0, so <code>&amp;&amp;</code> short-circuits in the child; only the parent forks again. Parent + child 1 + child 2.</li>
<li><strong>(c) 3</strong>: the mirror image — the parent sees a non-zero PID, <code>||</code> short-circuits in the parent; only the first child (which saw 0) forks again.</li>
<li><strong>(d) 4</strong>: parent forks c1 (c1 stops: condition false), forks c2 (c2 stops), and since both returned non-zero, forks c3. Parent, c1, c2, c3.</li>
<li><strong>(e) 16</strong>: four forks executed by everybody alive: 2⁴.</li>
</ul>
<p>The rule for (a) and (e): <em>n</em> unconditional forks in sequence give 2<sup>n</sup> processes. Interview variant: "how many times is 'hi' printed?" — the same count, unless <code>printf</code> without <code>\\n</code> sits in the buffer before the fork (CS.2).</p>
</details>`,
    `<h3>🧪 Bài 2 — bao nhiêu tiến trình? (15 phút)</h3>
<p>Với mỗi đoạn mã, có bao nhiêu tiến trình (tính cả tiến trình ban đầu) chạy tới dòng ngay sau nó? (a) <code>fork(); fork(); fork();</code> (b) <code>fork() &amp;&amp; fork();</code> (c) <code>fork() || fork();</code> (d) <code>if (fork() &amp;&amp; fork()) fork();</code> (e) <code>for (i = 0; i &lt; 2; i++) { fork(); fork(); }</code>. Vẽ cây cho (d) trước khi xem.</p>
<details><summary>Lời giải — đếm thật: mỗi tiến trình ghi một byte vào một ống</summary>
<pre><code class="language-c">// Bài 2: bao nhiêu tiến trình chạy dòng sau mỗi mẫu fork? Đếm thật qua một ống
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static void a(void) { fork(); fork(); fork(); }
static void b(void) { (void)(fork() &amp;&amp; fork()); }
static void c(void) { (void)(fork() || fork()); }
static void d(void) { if (fork() &amp;&amp; fork()) fork(); }
static void e(void) { for (int i = 0; i &lt; 2; i++) { fork(); fork(); } }

static int count(void (*f)(void)) {
    int fd[2];
    pipe(fd);
    pid_t h = fork();
    if (h == 0) {                                   // khung thử: mỗi tiến trình chạy tới cuối ghi một byte
        close(fd[0]);
        f();
        write(fd[1], "x", 1);
        while (wait(NULL) &gt; 0) { }                  // gặt con của chính mình
        _exit(0);
    }
    close(fd[1]);
    int n = 0; char ch;
    while (read(fd[0], &amp;ch, 1) == 1) n++;           // EOF khi mọi bản sao của fd[1] đều đóng
    waitpid(h, NULL, 0);
    close(fd[0]);
    return n;
}

int main(void) {
    printf("a) fork(); fork(); fork();             -&gt; %d processes\\n", count(a));
    printf("b) fork() &amp;&amp; fork();                   -&gt; %d processes\\n", count(b));
    printf("c) fork() || fork();                   -&gt; %d processes\\n", count(c));
    printf("d) if (fork() &amp;&amp; fork()) fork();       -&gt; %d processes\\n", count(d));
    printf("e) for (i = 0; i &lt; 2; i++) { fork(); fork(); } -&gt; %d processes\\n", count(e));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bai2-dem-fork.c -o bai2-dem-fork &amp;&amp; ./bai2-dem-fork<br>
a) fork(); fork(); fork(); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 8 processes<br>
b) fork() &amp;&amp; fork(); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 3 processes<br>
c) fork() || fork(); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 3 processes<br>
d) if (fork() &amp;&amp; fork()) fork(); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 4 processes<br>
e) for (i = 0; i &lt; 2; i++) { fork(); fork(); } -&gt; 16 processes</div>
<p>Mẹo đếm: một tiến trình khung thử tạo một ống (pipe), chạy đoạn mã, và <em>mọi</em> tiến trình chạy tới cuối ghi một byte; đầu đọc đếm byte cho tới EOF, mà EOF chỉ tới khi mọi bản sao của đầu ghi — được thừa kế qua từng lần fork — đều đã đóng. Không đoán mò, không bị output xen lẫn.</p>
<ul>
<li><strong>(a) 8</strong>: mỗi <code>fork()</code> nhân đôi số tiến trình: 2 × 2 × 2.</li>
<li><strong>(b) 3</strong>: lần fork đầu tạo một con thấy giá trị 0, nên <code>&amp;&amp;</code> dừng sớm (short-circuit) ở con; chỉ cha fork thêm. Cha + con 1 + con 2.</li>
<li><strong>(c) 3</strong>: ảnh soi gương — cha thấy một PID khác 0, <code>||</code> dừng sớm ở cha; chỉ con thứ nhất (thấy 0) fork thêm.</li>
<li><strong>(d) 4</strong>: cha fork c1 (c1 dừng: điều kiện sai), fork c2 (c2 dừng), và vì cả hai lần đều trả khác 0 nên fork c3. Cha, c1, c2, c3.</li>
<li><strong>(e) 16</strong>: bốn lần fork được thực hiện bởi mọi tiến trình còn sống: 2⁴.</li>
</ul>
<p>Quy tắc cho (a) và (e): <em>n</em> lần fork vô điều kiện nối tiếp nhau cho 2<sup>n</sup> tiến trình. Biến thể phỏng vấn: "'hi' được in bao nhiêu lần?" — cùng con số, trừ khi <code>printf</code> không có <code>\\n</code> nằm trong bộ đệm trước lúc fork (CS.2).</p>
</details>`),
    bi(`<h3>🧪 Exercise 3 — let the kernel reap: SIG_IGN and its price (10 min)</h3>
<p>A colleague says: "instead of a SIGCHLD handler, just write <code>signal(SIGCHLD, SIG_IGN)</code>". (a) Will zombies appear? (b) What does <code>wait()</code> return afterwards? (c) What information do you lose, and when is that acceptable?</p>
<details><summary>Solution — run for real: three children exit with code 7</summary>
<pre><code class="language-c">// Exercise 3: signal(SIGCHLD, SIG_IGN) — the kernel reaps children automatically, and wait() has nothing left to collect
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;errno.h&gt;
#include &lt;string.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    signal(SIGCHLD, SIG_IGN);                     // "I will never wait: do not keep zombies"
    for (int i = 0; i &lt; 3; i++)
        if (fork() == 0) _exit(7);
    sleep(1);
    char cmd[64];
    snprintf(cmd, sizeof cmd, "ps -o pid,stat,cmd --ppid %d | grep -c \\"[d]efunct\\"", getpid());
    printf("zombies under me: "); fflush(stdout);
    system(cmd);                                  // runs sh, which counts
    pid_t r = wait(NULL);
    printf("wait() -&gt; %d, errno = %s  (the exit codes 7 are lost)\\n", r, strerror(errno));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bai3-sig-ign.c -o bai3-sig-ign &amp;&amp; ./bai3-sig-ign<br>
zombies under me: 0<br>
wait() -&gt; -1, errno = No child processes &nbsp;(the exit codes 7 are lost)</div>
<ul>
<li>(a) <strong>No zombies</strong>: setting SIGCHLD's disposition to <code>SIG_IGN</code> tells the kernel the parent will never wait, so children are discarded the moment they exit (POSIX and <code>man 2 wait</code>, NOTES).</li>
<li>(b) <code>wait()</code> returns <strong>−1 with <code>ECHILD</code></strong> ("No child processes") — there is nothing left to collect.</li>
<li>(c) You lose the <strong>exit status</strong> of every child (the 7s are gone). Acceptable for fire-and-forget helpers (send an e-mail, warm a cache); not acceptable when you must know whether the child succeeded — then use the handler of slide 12. Note that it also affects libraries in the same process that spawn children and want their exit codes.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 3 — để nhân tự gặt: SIG_IGN và cái giá của nó (10 phút)</h3>
<p>Một đồng nghiệp nói: "thay vì viết handler SIGCHLD, cứ viết <code>signal(SIGCHLD, SIG_IGN)</code>". (a) Có zombie xuất hiện không? (b) Sau đó <code>wait()</code> trả về gì? (c) Bạn mất thông tin gì, và khi nào chấp nhận được?</p>
<details><summary>Lời giải — chạy thật: ba con thoát với mã 7</summary>
<pre><code class="language-c">// Bài 3: signal(SIGCHLD, SIG_IGN) — nhân tự gặt con, và wait() không còn gì để thu
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;errno.h&gt;
#include &lt;string.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    signal(SIGCHLD, SIG_IGN);                     // "tôi sẽ không bao giờ wait: đừng giữ zombie"
    for (int i = 0; i &lt; 3; i++)
        if (fork() == 0) _exit(7);
    sleep(1);
    char cmd[64];
    snprintf(cmd, sizeof cmd, "ps -o pid,stat,cmd --ppid %d | grep -c \\"[d]efunct\\"", getpid());
    printf("zombies under me: "); fflush(stdout);
    system(cmd);                                  // chạy sh để đếm
    pid_t r = wait(NULL);
    printf("wait() -&gt; %d, errno = %s  (the exit codes 7 are lost)\\n", r, strerror(errno));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bai3-sig-ign.c -o bai3-sig-ign &amp;&amp; ./bai3-sig-ign<br>
zombies under me: 0<br>
wait() -&gt; -1, errno = No child processes &nbsp;(the exit codes 7 are lost)</div>
<ul>
<li>(a) <strong>Không có zombie</strong>: đặt hành động của SIGCHLD là <code>SIG_IGN</code> báo cho nhân biết cha sẽ không bao giờ wait, nên các con bị xoá ngay khi chúng thoát (POSIX và <code>man 2 wait</code>, mục NOTES).</li>
<li>(b) <code>wait()</code> trả <strong>−1 với <code>ECHILD</code></strong> ("No child processes" — không có tiến trình con) — không còn gì để thu.</li>
<li>(c) Bạn mất <strong>trạng thái thoát</strong> của mọi con (mấy số 7 đã biến mất). Chấp nhận được với các tác vụ phụ "bắn rồi quên" (gửi e-mail, làm nóng cache); không chấp nhận được khi bạn phải biết con có thành công không — khi đó dùng handler của slide 12. Lưu ý nó còn ảnh hưởng các thư viện trong cùng tiến trình có sinh con và cần mã thoát của chúng.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 4 — a queue worker that stops gracefully (20 min)</h3>
<p>A Node.js worker takes jobs from a queue; each job takes 300 ms. Write it so that on SIGTERM it (1) finishes the job in hand, (2) takes no new job, (3) reports how many were done and how many are left for the next instance, (4) exits 0. Test it by sending SIGTERM while job 3 is running.</p>
<details><summary>Solution — run for real: the test sends SIGTERM when the worker reports "started job 3"</summary>
<pre><code class="language-javascript">// Exercise 4: a queue worker that stops gracefully: finish the job in hand, start no new one, exit 0
const { fork } = require('child_process');

if (process.argv[2] === 'worker') {
  const jobs = Array.from({ length: 10 }, (_, i) =&gt; i + 1);
  let stopping = false, done = 0;
  process.on('SIGTERM', () =&gt; { stopping = true; console.log('  worker: SIGTERM -&gt; no new jobs, finishing the current one'); });
  (async () =&gt; {
    for (const id of jobs) {
      if (stopping) break;                           // checked BEFORE taking a job
      process.send({ started: id });
      await new Promise((ok) =&gt; setTimeout(ok, 300)); // "process the job"
      done++;
      console.log(&#96;  worker: job &#36;{id} done&#96;);
    }
    console.log(&#96;  worker: processed &#36;{done}, left &#36;{jobs.length - done} in the queue for the next instance, exit 0&#96;);
    process.exit(0);
  })();
  return;
}

const w = fork(__filename, ['worker']);
w.on('message', (m) =&gt; { if (m.started === 3) { console.log('test: SIGTERM while job 3 is running'); w.kill('SIGTERM'); } });
w.on('exit', (code, sig) =&gt; console.log(&#96;test: worker exit code &#36;{code ?? 'signal ' + sig}&#96;));</code></pre>
<div class="out">$ node bai4-hang-doi.js<br>
&nbsp;&nbsp;worker: job 1 done<br>
&nbsp;&nbsp;worker: job 2 done<br>
test: SIGTERM while job 3 is running<br>
&nbsp;&nbsp;worker: SIGTERM -&gt; no new jobs, finishing the current one<br>
&nbsp;&nbsp;worker: job 3 done<br>
&nbsp;&nbsp;worker: processed 3, left 7 in the queue for the next instance, exit 0<br>
test: worker exit code 0</div>
<p>The key line is <code>if (stopping) break;</code> placed <strong>before</strong> a job is taken: the handler only sets a flag (slide 16's rule, in JavaScript), and the loop decides when it is safe to stop. Job 3 completes, jobs 4–10 stay in the queue. The test sends SIGTERM when the worker <em>reports</em> that job 3 started (an IPC message), not after a fixed delay — so the result is the same on a slow and a fast machine.</p>
<p>➕ In a real queue (RabbitMQ, SQS, BullMQ) "left in the queue" happens by itself if the worker acknowledges a message only after finishing it: unacknowledged messages are redelivered to another consumer. Stop consuming first (<code>channel.cancel</code>, <code>worker.close()</code>), then finish the current job, then close the connection.</p>
</details>`,
    `<h3>🧪 Bài 4 — worker hàng đợi tắt êm (20 phút)</h3>
<p>Một worker Node.js lấy việc từ một hàng đợi; mỗi việc mất 300 ms. Viết nó sao cho khi nhận SIGTERM nó (1) làm xong việc đang cầm, (2) không nhận việc mới, (3) báo đã làm bao nhiêu việc và còn bao nhiêu để lại cho bản kế tiếp, (4) thoát 0. Thử bằng cách gửi SIGTERM khi việc 3 đang chạy.</p>
<details><summary>Lời giải — chạy thật: phần thử gửi SIGTERM khi worker báo "đã bắt đầu việc 3"</summary>
<pre><code class="language-javascript">// Bài 4: worker hàng đợi tắt êm: làm xong việc đang cầm, không nhận việc mới, thoát 0
const { fork } = require('child_process');

if (process.argv[2] === 'worker') {
  const jobs = Array.from({ length: 10 }, (_, i) =&gt; i + 1);
  let stopping = false, done = 0;
  process.on('SIGTERM', () =&gt; { stopping = true; console.log('  worker: SIGTERM -&gt; no new jobs, finishing the current one'); });
  (async () =&gt; {
    for (const id of jobs) {
      if (stopping) break;                           // kiểm TRƯỚC khi nhận việc
      process.send({ started: id });
      await new Promise((ok) =&gt; setTimeout(ok, 300)); // "xử lý việc"
      done++;
      console.log(&#96;  worker: job &#36;{id} done&#96;);
    }
    console.log(&#96;  worker: processed &#36;{done}, left &#36;{jobs.length - done} in the queue for the next instance, exit 0&#96;);
    process.exit(0);
  })();
  return;
}

const w = fork(__filename, ['worker']);
w.on('message', (m) =&gt; { if (m.started === 3) { console.log('test: SIGTERM while job 3 is running'); w.kill('SIGTERM'); } });
w.on('exit', (code, sig) =&gt; console.log(&#96;test: worker exit code &#36;{code ?? 'signal ' + sig}&#96;));</code></pre>
<div class="out">$ node bai4-hang-doi.js<br>
&nbsp;&nbsp;worker: job 1 done<br>
&nbsp;&nbsp;worker: job 2 done<br>
test: SIGTERM while job 3 is running<br>
&nbsp;&nbsp;worker: SIGTERM -&gt; no new jobs, finishing the current one<br>
&nbsp;&nbsp;worker: job 3 done<br>
&nbsp;&nbsp;worker: processed 3, left 7 in the queue for the next instance, exit 0<br>
test: worker exit code 0</div>
<p>Dòng then chốt là <code>if (stopping) break;</code> đặt <strong>trước</strong> khi nhận một việc: handler chỉ bật cờ (quy tắc của slide 16, viết bằng JavaScript), còn vòng lặp quyết định khi nào dừng là an toàn. Việc 3 được làm xong, việc 4–10 nằm lại trong hàng đợi. Phần thử gửi SIGTERM khi worker <em>báo</em> rằng việc 3 đã bắt đầu (một thông điệp IPC), không phải sau một khoảng chờ cố định — nên kết quả giống nhau trên máy chậm lẫn máy nhanh.</p>
<p>➕ Với một hàng đợi thật (RabbitMQ, SQS, BullMQ), "nằm lại trong hàng đợi" tự xảy ra nếu worker chỉ xác nhận (acknowledge) thông điệp sau khi làm xong: thông điệp chưa xác nhận được giao lại cho một consumer khác. Ngừng nhận trước (<code>channel.cancel</code>, <code>worker.close()</code>), rồi làm xong việc hiện tại, rồi mới đóng kết nối.</p>
</details>`),
    bi(`<h3>🧪 Exercise 5 — the entrypoint script that eats SIGTERM (15 min)</h3>
<p>An image uses <code>ENTRYPOINT ["/entry.sh"]</code>; the script runs migrations, then the app. The app has a SIGTERM handler, yet every <code>docker stop</code> waits 10 s and ends with 137. (a) Explain why. (b) Fix the script with one word. (c) Prove both versions as PID 1 of a new PID namespace.</p>
<details><summary>Solution — run for real with unshare (the two scripts differ in one line)</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_ADMIN</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 5: an entrypoint script with and without &#96;exec "$@"&#96;, as PID 1 of a new PID namespace<br>
$ p1() { ps -o pid= --ppid $1 | tr -d ' '; }; alive() { kill -0 $1 2&gt;/dev/null &amp;&amp; echo "STILL RUNNING" || echo "gone"; }<br>
# without exec: bash stays PID 1, node (with a handler) is its child<br>
$ HANDLE=1 unshare -pf --mount-proc ./_entry-sai.sh 2&gt;/dev/null &amp; U=$!; sleep 1; P=$(p1 $U); ps -o args= -p $P<br>
entry: migrations done<br>
/bin/bash ./_entry-sai.sh<br>
$ kill -TERM $P; sleep 1; echo "1 s after SIGTERM: $(alive $P)"<br>
1 s after SIGTERM: STILL RUNNING<br>
$ kill -KILL $P; wait $U 2&gt;/dev/null; echo "after SIGKILL: $(alive $P)"<br>
after SIGKILL: gone<br>
# with exec: the script turns into node, which is PID 1 and has a handler<br>
$ HANDLE=1 unshare -pf --mount-proc ./_entry-dung.sh node _app.js &amp; U=$!; sleep 1; P=$(p1 $U); ps -o args= -p $P<br>
entry: migrations done<br>
node _app.js<br>
$ kill -TERM $P; wait $U; echo "exit code $?"<br>
app: SIGTERM -&gt; close server, exit 0<br>
exit code 0</div>
<p>(a) Without <code>exec</code>, <code>bash ./_entry-sai.sh</code> stays <strong>PID 1</strong> and runs node as its child. bash has no handler for SIGTERM, so the kernel drops the signal (slide 20) — the line "1 s after SIGTERM: STILL RUNNING" — and bash would not forward it anyway; only SIGKILL ends the namespace, and node's handler never runs. (b) The last line becomes <code>exec "$@"</code> (and the image passes the command in <code>CMD ["node", "_app.js"]</code>): the shell <em>replaces itself</em> with node, keeping PID 1. (c) Second run: PID 1 is <code>node _app.js</code>, the handler runs, exit code 0. Add tini/<code>--init</code> as well to reap orphans (slide 13); cuongthai.com's backend does both.</p>
</details>`,
    `<h3>🧪 Bài 5 — script entrypoint nuốt mất SIGTERM (15 phút)</h3>
<p>Một image dùng <code>ENTRYPOINT ["/entry.sh"]</code>; script chạy migration rồi chạy ứng dụng. Ứng dụng có handler SIGTERM, vậy mà lần nào <code>docker stop</code> cũng chờ 10 giây và kết thúc với 137. (a) Giải thích vì sao. (b) Sửa script bằng một từ. (c) Chứng minh cả hai phiên bản khi làm PID 1 của một PID namespace mới.</p>
<details><summary>Lời giải — chạy thật bằng unshare (hai script chỉ khác nhau một dòng)</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_ADMIN</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 5: script entrypoint có và không có &#96;exec "$@"&#96;, làm PID 1 của một PID namespace mới<br>
$ p1() { ps -o pid= --ppid $1 | tr -d ' '; }; alive() { kill -0 $1 2&gt;/dev/null &amp;&amp; echo "STILL RUNNING" || echo "gone"; }<br>
# không có exec: bash ở lại làm PID 1, node (có handler) là con<br>
$ HANDLE=1 unshare -pf --mount-proc ./_entry-sai.sh 2&gt;/dev/null &amp; U=$!; sleep 1; P=$(p1 $U); ps -o args= -p $P<br>
entry: migrations done<br>
/bin/bash ./_entry-sai.sh<br>
$ kill -TERM $P; sleep 1; echo "1 s after SIGTERM: $(alive $P)"<br>
1 s after SIGTERM: STILL RUNNING<br>
$ kill -KILL $P; wait $U 2&gt;/dev/null; echo "after SIGKILL: $(alive $P)"<br>
after SIGKILL: gone<br>
# có exec: script biến thành node, node là PID 1 và có handler<br>
$ HANDLE=1 unshare -pf --mount-proc ./_entry-dung.sh node _app.js &amp; U=$!; sleep 1; P=$(p1 $U); ps -o args= -p $P<br>
entry: migrations done<br>
node _app.js<br>
$ kill -TERM $P; wait $U; echo "exit code $?"<br>
app: SIGTERM -&gt; close server, exit 0<br>
exit code 0</div>
<p>(a) Không có <code>exec</code>, <code>bash ./_entry-sai.sh</code> ở lại làm <strong>PID 1</strong> và chạy node làm con. bash không có handler cho SIGTERM, nên nhân vứt tín hiệu (slide 20) — dòng "1 s after SIGTERM: STILL RUNNING" — mà bash cũng không chuyển tiếp nó; chỉ SIGKILL kết thúc được namespace, và handler của node không bao giờ chạy. (b) Dòng cuối thành <code>exec "$@"</code> (và image truyền lệnh qua <code>CMD ["node", "_app.js"]</code>): shell <em>tự thay mình</em> bằng node, giữ nguyên PID 1. (c) Lần chạy thứ hai: PID 1 là <code>node _app.js</code>, handler chạy, mã thoát 0. Thêm tini/<code>--init</code> nữa để gặt mồ côi (slide 13); backend của cuongthai.com làm cả hai.</p>
</details>`),
    bi(`<h3>🧪 Exercise 6 — a script that always cleans up (10 min)</h3>
<p>A backup script creates a temporary folder and must delete it however it ends. Use <code>trap … EXIT</code>. Show what happens on (1) a normal end, (2) SIGTERM, (3) SIGKILL. Why does the script start its long command in the background and <code>wait</code> for it?</p>
<details><summary>Solution — run for real</summary>
<div class="out"># Exercise 6: trap EXIT cleans a temporary folder on a normal end and on SIGTERM — but never on SIGKILL<br>
$ cat &gt; job.sh &lt;&lt;'J'<br>
&gt; #!/bin/bash<br>
&gt; T=$(mktemp -d); echo "$T" &gt; last-tmp<br>
&gt; trap 'rm -rf "$T"; echo "job: cleaned $T"' EXIT<br>
&gt; trap 'exit 143' TERM<br>
&gt; echo "job: working in $T"; sleep "&#36;{1:-0}" &amp; wait<br>
&gt; J<br>
$ chmod +x job.sh<br>
$ ./job.sh 0; echo "exit code $?; folder left: $(ls -d $(cat last-tmp) 2&gt;/dev/null || echo none)"<br>
job: working in /tmp/tmp.6aZvOBpkBe<br>
job: cleaned /tmp/tmp.6aZvOBpkBe<br>
exit code 0; folder left: none<br>
$ ./job.sh 30 &amp; J=$!; sleep 0.5; kill -TERM $J; wait $J; echo "exit code $?; folder left: $(ls -d $(cat last-tmp) 2&gt;/dev/null || echo none)"<br>
job: working in /tmp/tmp.MvkmmfCIcH<br>
job: cleaned /tmp/tmp.MvkmmfCIcH<br>
exit code 143; folder left: none<br>
$ ./job.sh 30 &amp; J=$!; sleep 0.5; kill -KILL $J; wait $J; echo "exit code $?; folder left: $(ls -d $(cat last-tmp) 2&gt;/dev/null || echo none)"<br>
job: working in /tmp/tmp.W4rLRKkF1P<br>
bash: &nbsp;&nbsp;&nbsp;34 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./job.sh 30<br>
exit code 137; folder left: /tmp/tmp.W4rLRKkF1P</div>
<p>The EXIT trap runs on a normal end (exit code 0) and when the TERM trap calls <code>exit 143</code> — the folder is gone both times. With SIGKILL nothing runs: exit code 137, and the folder is still there — every <code>kill -9</code> leaks one temporary folder. The <code>sleep … &amp; wait</code> pattern matters: bash runs a trap only between commands, but <code>wait</code> is interrupted by a trapped signal, so the script reacts to SIGTERM at once instead of after 30 s. In real scripts, also keep temporary files under one folder (so one <code>rm -rf</code> cleans all) and use <code>mktemp</code>, never a fixed name.</p>
</details>`,
    `<h3>🧪 Bài 6 — một script lúc nào cũng dọn dẹp (10 phút)</h3>
<p>Một script sao lưu tạo một thư mục tạm và phải xoá nó dù kết thúc kiểu gì. Dùng <code>trap … EXIT</code>. Cho thấy chuyện gì xảy ra khi (1) kết thúc bình thường, (2) nhận SIGTERM, (3) nhận SIGKILL. Vì sao script chạy lệnh dài ở chế độ nền rồi <code>wait</code> nó?</p>
<details><summary>Lời giải — chạy thật</summary>
<div class="out"># Bài 6: trap EXIT dọn thư mục tạm khi kết thúc bình thường và khi nhận SIGTERM — nhưng không bao giờ khi nhận SIGKILL<br>
$ cat &gt; job.sh &lt;&lt;'J'<br>
&gt; #!/bin/bash<br>
&gt; T=$(mktemp -d); echo "$T" &gt; last-tmp<br>
&gt; trap 'rm -rf "$T"; echo "job: cleaned $T"' EXIT<br>
&gt; trap 'exit 143' TERM<br>
&gt; echo "job: working in $T"; sleep "&#36;{1:-0}" &amp; wait<br>
&gt; J<br>
$ chmod +x job.sh<br>
$ ./job.sh 0; echo "exit code $?; folder left: $(ls -d $(cat last-tmp) 2&gt;/dev/null || echo none)"<br>
job: working in /tmp/tmp.6aZvOBpkBe<br>
job: cleaned /tmp/tmp.6aZvOBpkBe<br>
exit code 0; folder left: none<br>
$ ./job.sh 30 &amp; J=$!; sleep 0.5; kill -TERM $J; wait $J; echo "exit code $?; folder left: $(ls -d $(cat last-tmp) 2&gt;/dev/null || echo none)"<br>
job: working in /tmp/tmp.MvkmmfCIcH<br>
job: cleaned /tmp/tmp.MvkmmfCIcH<br>
exit code 143; folder left: none<br>
$ ./job.sh 30 &amp; J=$!; sleep 0.5; kill -KILL $J; wait $J; echo "exit code $?; folder left: $(ls -d $(cat last-tmp) 2&gt;/dev/null || echo none)"<br>
job: working in /tmp/tmp.W4rLRKkF1P<br>
bash: &nbsp;&nbsp;&nbsp;34 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./job.sh 30<br>
exit code 137; folder left: /tmp/tmp.W4rLRKkF1P</div>
<p>Trap EXIT chạy khi kết thúc bình thường (mã 0) và khi trap TERM gọi <code>exit 143</code> — cả hai lần thư mục đều biến mất. Với SIGKILL không có gì chạy: mã 137, và thư mục vẫn còn đó — mỗi lần <code>kill -9</code> rò rỉ một thư mục tạm. Mẫu <code>sleep … &amp; wait</code> quan trọng: bash chỉ chạy trap giữa các lệnh, nhưng <code>wait</code> bị một tín hiệu có trap cắt ngang, nên script phản ứng với SIGTERM ngay lập tức thay vì sau 30 giây. Trong script thật, hãy gom tệp tạm vào một thư mục (để một lệnh <code>rm -rf</code> dọn hết) và dùng <code>mktemp</code>, đừng bao giờ dùng tên cố định.</p>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>process</strong></td><td>tiến trình</td><td>A running instance of a program, with its own virtual memory, open files, state and PID.</td></tr>
<tr><td><strong>PID / PPID</strong></td><td>mã tiến trình / mã tiến trình cha</td><td>The number of a process and the number of its parent; follow PPIDs up and you reach PID 1.</td></tr>
<tr><td><strong>PID 1 (init)</strong></td><td>tiến trình đầu tiên (init)</td><td>The first process of a PID namespace: adopts orphans, must reap them, and receives only signals it has handlers for.</td></tr>
<tr><td><strong>fork()</strong></td><td>fork() — tạo bản sao</td><td>Copies the calling process; returns 0 in the child and the child's PID in the parent.</td></tr>
<tr><td><strong>exec()</strong></td><td>exec() — thay chương trình</td><td>Replaces the program inside the current process, keeping its PID; returns only on failure.</td></tr>
<tr><td><strong>wait() / waitpid()</strong></td><td>chờ tiến trình con</td><td>Blocks until a child ends and returns its status; WNOHANG makes it return at once.</td></tr>
<tr><td><strong>exit code / exit status</strong></td><td>mã thoát</td><td>One byte reported when a process ends: 0 success, 126/127 shell errors, 128 + N killed by signal N.</td></tr>
<tr><td><strong>zombie (defunct)</strong></td><td>tiến trình xác sống</td><td>A process that has exited but whose parent has not waited for it; only its PID and status remain.</td></tr>
<tr><td><strong>orphan</strong></td><td>tiến trình mồ côi</td><td>A process whose parent died first; it is re-parented to PID 1 or to a subreaper.</td></tr>
<tr><td><strong>reap</strong></td><td>gặt (thu dọn) tiến trình con</td><td>Calling wait/waitpid for a finished child so that its zombie entry disappears.</td></tr>
<tr><td><strong>signal</strong></td><td>tín hiệu</td><td>A small asynchronous message from the kernel to a process, identified by a number.</td></tr>
<tr><td><strong>signal handler</strong></td><td>hàm xử lý tín hiệu</td><td>A function run when a signal arrives; must only do async-signal-safe work, ideally set a flag.</td></tr>
<tr><td><strong>SIGTERM / SIGKILL</strong></td><td>tín hiệu dừng / tín hiệu giết</td><td>SIGTERM (15) asks a process to stop and can be caught; SIGKILL (9) kills it and can never be caught.</td></tr>
<tr><td><strong>SIGCHLD</strong></td><td>tín hiệu con đổi trạng thái</td><td>Sent to a parent when a child exits or stops; the usual place to reap children.</td></tr>
<tr><td><strong>graceful shutdown</strong></td><td>tắt êm</td><td>Stop accepting, finish in-flight work, clean up, exit 0 — before the orchestrator's deadline.</td></tr>
<tr><td><strong>grace period</strong></td><td>thời gian ân hạn</td><td>Time between SIGTERM and SIGKILL: Docker 10 s, Kubernetes 30 s, systemd 90 s by default.</td></tr>
<tr><td><strong>shell form / exec form</strong></td><td>dạng shell / dạng exec</td><td>CMD node app.js runs /bin/sh -c (sh is PID 1); CMD ["node","app.js"] runs node directly.</td></tr>
<tr><td><strong>tini / --init</strong></td><td>init tí hon</td><td>A minimal init used as PID 1 in containers: forwards signals to the app and reaps zombies.</td></tr>
<tr><td><strong>job control</strong></td><td>điều khiển job</td><td>Shell features to run, pause (Ctrl+Z, SIGTSTP) and resume (bg, fg, SIGCONT) jobs.</td></tr>
<tr><td><strong>nohup / SIGHUP</strong></td><td>bỏ qua tín hiệu gác máy</td><td>SIGHUP is sent when the terminal closes; nohup starts a command with SIGHUP ignored.</td></tr>
<tr><td><strong>systemd unit</strong></td><td>tệp đơn vị dịch vụ systemd</td><td>A small file describing a service: ExecStart, Restart, KillSignal, TimeoutStopSec, limits.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>process</strong></td><td>tiến trình</td><td>Một lần chạy của chương trình, có bộ nhớ ảo, tệp đang mở, trạng thái và PID riêng.</td></tr>
<tr><td><strong>PID / PPID</strong></td><td>mã tiến trình / mã tiến trình cha</td><td>Số của một tiến trình và số của cha nó; lần theo PPID lên trên sẽ tới PID 1.</td></tr>
<tr><td><strong>PID 1 (init)</strong></td><td>tiến trình đầu tiên (init)</td><td>Tiến trình đầu tiên của một PID namespace: nhận nuôi mồ côi, phải gặt chúng, và chỉ nhận những tín hiệu nó có handler.</td></tr>
<tr><td><strong>fork()</strong></td><td>fork() — tạo bản sao</td><td>Sao chép tiến trình gọi; trả 0 trong con và PID của con trong cha.</td></tr>
<tr><td><strong>exec()</strong></td><td>exec() — thay chương trình</td><td>Thay chương trình bên trong tiến trình hiện tại, giữ PID; chỉ trả về khi thất bại.</td></tr>
<tr><td><strong>wait() / waitpid()</strong></td><td>chờ tiến trình con</td><td>Chặn tới khi một con kết thúc và trả trạng thái của nó; WNOHANG khiến nó trả về ngay.</td></tr>
<tr><td><strong>exit code / exit status</strong></td><td>mã thoát</td><td>Một byte được báo khi tiến trình kết thúc: 0 thành công, 126/127 lỗi của shell, 128 + N bị tín hiệu N giết.</td></tr>
<tr><td><strong>zombie (defunct)</strong></td><td>tiến trình xác sống</td><td>Tiến trình đã thoát nhưng cha chưa wait; chỉ còn PID và trạng thái thoát.</td></tr>
<tr><td><strong>orphan</strong></td><td>tiến trình mồ côi</td><td>Tiến trình có cha chết trước; nó được giao lại cho PID 1 hoặc cho một subreaper.</td></tr>
<tr><td><strong>reap</strong></td><td>gặt (thu dọn) tiến trình con</td><td>Gọi wait/waitpid cho một con đã kết thúc để mục zombie của nó biến mất.</td></tr>
<tr><td><strong>signal</strong></td><td>tín hiệu</td><td>Thông điệp bất đồng bộ nhỏ từ nhân tới tiến trình, định danh bằng một con số.</td></tr>
<tr><td><strong>signal handler</strong></td><td>hàm xử lý tín hiệu</td><td>Hàm chạy khi tín hiệu tới; chỉ được làm việc an toàn với tín hiệu, tốt nhất là bật một cờ.</td></tr>
<tr><td><strong>SIGTERM / SIGKILL</strong></td><td>tín hiệu dừng / tín hiệu giết</td><td>SIGTERM (15) yêu cầu dừng và bắt được; SIGKILL (9) giết ngay và không bao giờ bắt được.</td></tr>
<tr><td><strong>SIGCHLD</strong></td><td>tín hiệu con đổi trạng thái</td><td>Gửi cho cha khi một con thoát hoặc dừng; chỗ thường dùng để gặt con.</td></tr>
<tr><td><strong>graceful shutdown</strong></td><td>tắt êm</td><td>Ngừng nhận, làm nốt việc đang chạy, dọn dẹp, thoát 0 — trước hạn chót của bộ điều phối.</td></tr>
<tr><td><strong>grace period</strong></td><td>thời gian ân hạn</td><td>Khoảng giữa SIGTERM và SIGKILL: mặc định Docker 10 giây, Kubernetes 30 giây, systemd 90 giây.</td></tr>
<tr><td><strong>shell form / exec form</strong></td><td>dạng shell / dạng exec</td><td>CMD node app.js chạy /bin/sh -c (sh là PID 1); CMD ["node","app.js"] chạy thẳng node.</td></tr>
<tr><td><strong>tini / --init</strong></td><td>init tí hon</td><td>Một init tối giản làm PID 1 trong container: chuyển tiếp tín hiệu cho app và gặt zombie.</td></tr>
<tr><td><strong>job control</strong></td><td>điều khiển job</td><td>Tính năng của shell để chạy, tạm dừng (Ctrl+Z, SIGTSTP) và cho chạy tiếp (bg, fg, SIGCONT) các job.</td></tr>
<tr><td><strong>nohup / SIGHUP</strong></td><td>bỏ qua tín hiệu gác máy</td><td>SIGHUP được gửi khi terminal đóng; nohup chạy lệnh với SIGHUP bị bỏ qua.</td></tr>
<tr><td><strong>systemd unit</strong></td><td>tệp đơn vị dịch vụ systemd</td><td>Tệp nhỏ mô tả một dịch vụ: ExecStart, Restart, KillSignal, TimeoutStopSec, giới hạn.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 CS.1 summary</h2>
<ul>
<li>Every process has a parent (PPID) and the chain ends at <strong>PID 1</strong>; <code>ps -ef --forest</code>, <code>pstree</code> and <code>/proc/&lt;pid&gt;</code> show who, what, with which settings — the command line is public, the environment is not.</li>
<li><strong>fork</strong> copies (returns twice), <strong>exec</strong> replaces (same PID, returns only on failure), <strong>wait</strong> collects the exit status; n unconditional forks make 2<sup>n</sup> processes.</li>
<li>Exit codes: 0 ok · 1–125 the program's own · 126/127 the shell could not run it · <strong>128 + N</strong> killed by signal N (130, 134, 137, 139, 141, 143); the kernel stores "killed by signal", shells and Docker show 128 + N.</li>
<li>A <strong>zombie</strong> is an unreaped child — reap with a SIGCHLD handler looping <code>waitpid(-1, …, WNOHANG)</code>, or SIG_IGN if you never need the status; an <strong>orphan</strong> is adopted by PID 1, which must reap it.</li>
<li>Signals: SIGTERM asks, SIGKILL forces and cannot be caught; handlers only set flags; <strong>graceful shutdown</strong> = refuse, finish, close, leave — before the deadline, with your own timer shorter than it.</li>
<li>In containers: PID 1 receives only signals it handles — use the <strong>exec form</strong>, <code>exec "$@"</code> in entrypoints, <strong>tini / --init</strong>, and a SIGTERM handler; a server belongs to Docker or systemd, never to <code>nohup … &amp;</code>.</li>
</ul>`,
    `<h2>📌 Tóm tắt CS.1</h2>
<ul>
<li>Mọi tiến trình đều có cha (PPID) và chuỗi kết thúc ở <strong>PID 1</strong>; <code>ps -ef --forest</code>, <code>pstree</code> và <code>/proc/&lt;pid&gt;</code> cho thấy ai, làm gì, với cấu hình nào — dòng lệnh là công khai, biến môi trường thì không.</li>
<li><strong>fork</strong> sao chép (trả về hai lần), <strong>exec</strong> thay chương trình (giữ PID, chỉ trả về khi thất bại), <strong>wait</strong> thu trạng thái thoát; n lần fork vô điều kiện tạo 2<sup>n</sup> tiến trình.</li>
<li>Mã thoát: 0 ổn · 1–125 của chính chương trình · 126/127 shell không chạy được nó · <strong>128 + N</strong> bị tín hiệu N giết (130, 134, 137, 139, 141, 143); nhân lưu "bị tín hiệu giết", shell và Docker hiện 128 + N.</li>
<li><strong>Zombie</strong> là con chưa được gặt — gặt bằng handler SIGCHLD lặp <code>waitpid(-1, …, WNOHANG)</code>, hoặc SIG_IGN nếu không bao giờ cần mã thoát; <strong>mồ côi</strong> được PID 1 nhận nuôi và PID 1 phải gặt nó.</li>
<li>Tín hiệu: SIGTERM yêu cầu, SIGKILL cưỡng ép và không bắt được; handler chỉ bật cờ; <strong>tắt êm</strong> = từ chối, làm nốt, đóng lại, rời đi — trước hạn chót, với hẹn giờ của chính bạn ngắn hơn nó.</li>
<li>Trong container: PID 1 chỉ nhận những tín hiệu nó có handler — dùng <strong>dạng exec</strong>, <code>exec "$@"</code> trong entrypoint, <strong>tini / --init</strong>, và một handler SIGTERM; server thuộc về Docker hoặc systemd, không bao giờ thuộc về <code>nohup … &amp;</code>.</li>
</ul>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-cs1) — 10 câu ───────── */
const QUIZ_CS1 = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'How many processes (counting the original one) reach the line after: if (fork() && fork()) fork();|||Có bao nhiêu tiến trình (tính cả tiến trình ban đầu) chạy tới dòng ngay sau: if (fork() && fork()) fork();',
      options: ['3|||3', '8|||8', '4|||4', '6|||6'],
      correctIndex: 2,
      points: 1,
      explanation: 'Counted for real through a pipe: the parent forks c1, which sees 0 so the && stops in c1; the parent forks c2, which also stops; both calls returned non-zero in the parent, so it forks c3. Parent + c1 + c2 + c3 = 4. Eight would be three unconditional forks (2 × 2 × 2). Lesson CS.1, slides 7–8; practice exercise 2.|||Đếm thật qua một ống: cha fork c1, c1 thấy 0 nên && dừng ở c1; cha fork c2, c2 cũng dừng; ở cha cả hai lời gọi đều trả khác 0, nên cha fork c3. Cha + c1 + c2 + c3 = 4. Tám là trường hợp ba lần fork vô điều kiện (2 × 2 × 2). Bài CS.1, slide 7–8; bài tập 2.' },
    { id: 'q2',
      question: 'A child process is killed by SIGSEGV (signal 11). Which exit status does the shell (and Docker) show for it?|||Một tiến trình con bị SIGSEGV (tín hiệu 11) giết. Shell (và Docker) hiện mã thoát nào cho nó?',
      options: ['139|||139', '11|||11', '1|||1', '255|||255'],
      correctIndex: 0,
      points: 1,
      explanation: 'The kernel tells the parent "terminated by signal 11" (WIFSIGNALED, WTERMSIG = 11); shells and Docker squeeze that into one number as 128 + 11 = 139 so it never collides with a normal exit code below 128. Lesson CS.1, slide 10.|||Nhân báo cho cha "bị tín hiệu 11 kết thúc" (WIFSIGNALED, WTERMSIG = 11); shell và Docker ép nó vào một con số là 128 + 11 = 139 để không bao giờ trùng một mã thoát bình thường dưới 128. Bài CS.1, slide 10.' },
    { id: 'q3',
      question: 'After a deploy, the old container shows "Exited (143)". Which signal ended its main process?|||Sau một lần deploy, container cũ hiện "Exited (143)". Tín hiệu nào đã kết thúc tiến trình chính của nó?',
      options: ['SIGKILL|||SIGKILL', 'SIGINT|||SIGINT', 'SIGHUP|||SIGHUP', 'SIGTERM|||SIGTERM'],
      correctIndex: 3,
      points: 1,
      explanation: '143 − 128 = 15 = SIGTERM (bash: kill -l 143 prints TERM). It is the normal stop request of docker stop when the app has no handler that exits by itself; with a graceful handler the code would be 0. 137 would be SIGKILL, 130 SIGINT, 129 SIGHUP. Lesson CS.1, slides 10 and 14.|||143 − 128 = 15 = SIGTERM (bash: kill -l 143 in ra TERM). Đó là yêu cầu dừng bình thường của docker stop khi ứng dụng không có handler tự thoát; có handler tắt êm thì mã sẽ là 0. 137 là SIGKILL, 130 là SIGINT, 129 là SIGHUP. Bài CS.1, slide 10 và 14.' },
    { id: 'q4',
      question: 'ps shows a process in state Z (defunct) whose parent is a long-running worker. What actually removes it?|||ps hiện một tiến trình ở trạng thái Z (defunct) có cha là một worker chạy lâu. Điều gì thật sự xoá được nó?',
      options: ["kill -9 on the zombie's PID|||kill -9 vào PID của zombie", 'the parent calling wait()/waitpid() for it, or the parent dying so that PID 1 reaps it|||cha gọi wait()/waitpid() cho nó, hoặc cha chết để PID 1 gặt nó', 'restarting the zombie with kill -CONT|||khởi động lại zombie bằng kill -CONT', 'nothing: zombies disappear after 60 seconds|||không gì cả: zombie tự biến mất sau 60 giây'],
      correctIndex: 1,
      points: 1,
      explanation: 'A zombie has already exited — only its process-table entry with the exit status remains, kept for the parent. Signals do nothing (run for real: kill -9 leaves the same Z line). It disappears when the parent waits for it, or when the parent dies and the zombie is inherited by PID 1 (or a subreaper), which reaps it. Lesson CS.1, slides 11–12.|||Zombie đã thoát rồi — chỉ còn mục trong bảng tiến trình chứa trạng thái thoát, giữ lại cho cha. Tín hiệu không làm gì (chạy thật: kill -9 để nguyên dòng Z). Nó biến mất khi cha wait nó, hoặc khi cha chết và zombie được PID 1 (hoặc một subreaper) thừa kế và gặt. Bài CS.1, slide 11–12.' },
    { id: 'q5',
      question: "A container runs CMD [\"node\", \"app.js\"] and the app has NO process.on('SIGTERM'). Why does docker stop wait the whole grace period?|||Một container chạy CMD [\"node\", \"app.js\"] và ứng dụng KHÔNG có process.on('SIGTERM'). Vì sao docker stop chờ hết thời gian ân hạn?",
      options: ['node is PID 1, and the kernel drops signals whose action is the default when they are sent to PID 1|||node là PID 1, và nhân vứt các tín hiệu có hành động mặc định khi chúng được gửi tới PID 1', 'Docker sends SIGHUP first, which Node ignores|||Docker gửi SIGHUP trước, mà Node bỏ qua', 'Node blocks every signal while the event loop is busy|||Node chặn mọi tín hiệu khi event loop đang bận', 'the exec form starts node through /bin/sh -c|||dạng exec khởi động node qua /bin/sh -c'],
      correctIndex: 0,
      points: 1,
      explanation: "pid_namespaces(7): only signals for which init has a handler can be sent to it. Node's built-in SIGTERM handler resets itself (SA_RESETHAND) and re-raises the signal with the default action — which the kernel drops for PID 1 (measured: SigCgt bit 0x4000 disappears and the process keeps running). Only SIGKILL after the grace period ends it, with 137. The exec form does NOT use a shell. Lesson CS.1, slides 20–21.|||pid_namespaces(7): chỉ tín hiệu mà init có handler mới gửi được tới nó. Handler SIGTERM có sẵn của Node tự đặt lại (SA_RESETHAND) và gửi lại tín hiệu với hành động mặc định — mà nhân vứt đi với PID 1 (đo thật: bit 0x4000 của SigCgt biến mất và tiến trình vẫn chạy). Chỉ SIGKILL sau thời gian ân hạn mới kết thúc nó, với 137. Dạng exec KHÔNG dùng shell. Bài CS.1, slide 20–21." },
    { id: 'q6',
      question: 'Which order of steps is a correct graceful shutdown of an HTTP service after SIGTERM?|||Thứ tự nào là một lần tắt êm đúng cho dịch vụ HTTP sau khi nhận SIGTERM?',
      options: ['close the DB pool, finish in-flight requests, stop accepting, exit 0|||đóng pool DB, làm nốt request đang chạy, ngừng nhận, thoát 0', 'exit 0 immediately, the load balancer retries the requests|||thoát 0 ngay, bộ cân bằng tải sẽ gửi lại request', 'stop accepting, finish in-flight requests, close the DB pool, exit 0|||ngừng nhận, làm nốt request đang chạy, đóng pool DB, thoát 0', 'finish in-flight requests, keep accepting until the deadline, then exit|||làm nốt request đang chạy, vẫn nhận tiếp tới hạn chót, rồi thoát'],
      correctIndex: 2,
      points: 1,
      explanation: "Refuse, finish, close, leave: stop accepting first so no new work starts; let started requests complete (they still need the database); then close pools and flush logs; exit 0 before the orchestrator's deadline. Closing the pool first breaks the requests still running; exiting at once cuts them (measured: ECONNRESET in the naive Node server). Lesson CS.1, slides 17–18.|||Từ chối, làm nốt, đóng lại, rời đi: ngừng nhận trước để không có việc mới bắt đầu; để các request đã bắt đầu chạy xong (chúng còn cần cơ sở dữ liệu); rồi đóng pool và xả log; thoát 0 trước hạn chót của bộ điều phối. Đóng pool trước làm hỏng các request còn đang chạy; thoát ngay thì cắt chúng (đo thật: ECONNRESET ở server Node ngây thơ). Bài CS.1, slide 17–18." },
    { id: 'q7',
      question: 'What does nohup do to the command it starts?|||nohup làm gì với lệnh mà nó khởi động?',
      options: ['runs it with higher priority|||chạy nó với độ ưu tiên cao hơn', 'restarts it automatically when it crashes|||tự khởi động lại nó khi nó sập', 'makes it a child of PID 1|||biến nó thành con của PID 1', 'starts it with SIGHUP ignored, so closing the terminal does not kill it|||khởi động nó với SIGHUP bị bỏ qua, nên đóng terminal không giết được nó'],
      correctIndex: 3,
      points: 1,
      explanation: "Measured: the nohup'ed sleep has SigIgn …0001 (signal 1 ignored) and survives kill -HUP, while a plain background sleep dies with 129. nohup does not restart anything and does not survive a reboot — a service belongs to systemd (Restart=on-failure) or Docker. Lesson CS.1, slides 23–24.|||Đo thật: sleep chạy bằng nohup có SigIgn …0001 (bỏ qua tín hiệu 1) và sống sót qua kill -HUP, còn một sleep chạy nền bình thường chết với 129. nohup không khởi động lại gì và không sống qua một lần khởi động lại máy — một dịch vụ thuộc về systemd (Restart=on-failure) hoặc Docker. Bài CS.1, slide 23–24." },
    { id: 'q8',
      question: 'Why can a program never install a handler for SIGKILL?|||Vì sao một chương trình không bao giờ cài được handler cho SIGKILL?',
      options: ['because SIGKILL is only sent by the OOM killer|||vì SIGKILL chỉ do OOM killer gửi', 'so that an administrator can always stop any process; sigaction() refuses it with EINVAL|||để người quản trị luôn dừng được mọi tiến trình; sigaction() từ chối với EINVAL', 'because handlers only work for signals numbered above 10|||vì handler chỉ dùng được cho tín hiệu có số lớn hơn 10', 'it can, but only as root|||cài được, nhưng chỉ khi chạy bằng root'],
      correctIndex: 1,
      points: 1,
      explanation: 'SIGKILL and SIGSTOP are handled by the kernel itself and can never be caught, blocked or ignored — even by root. Run for real: sigaction(SIGKILL) and sigaction(SIGSTOP) both return "Invalid argument". That guarantee is what lets docker stop, Kubernetes and systemd always end a process after the grace period — and why no cleanup runs on kill -9. Lesson CS.1, slides 14–16.|||SIGKILL và SIGSTOP do chính nhân xử lý và không bao giờ bắt, chặn hay bỏ qua được — kể cả với root. Chạy thật: sigaction(SIGKILL) và sigaction(SIGSTOP) đều trả "Invalid argument". Sự bảo đảm đó cho phép docker stop, Kubernetes và systemd luôn kết thúc được tiến trình sau thời gian ân hạn — và là lý do không có việc dọn dẹp nào chạy khi kill -9. Bài CS.1, slide 14–16.' },
    { id: 'q9',
      question: 'In Spring Boot 4.1 with no shutdown property set, what happens to a request in progress when the JVM receives SIGTERM?|||Trong Spring Boot 4.1 không đặt thuộc tính tắt máy nào, chuyện gì xảy ra với một request đang chạy khi JVM nhận SIGTERM?',
      options: ['it completes: graceful shutdown is the default, with a 30-second timeout per phase|||nó chạy xong: tắt êm là mặc định, mỗi pha chờ tối đa 30 giây', 'it is cut immediately: server.shutdown defaults to immediate|||nó bị cắt ngay: server.shutdown mặc định là immediate', 'the JVM ignores SIGTERM until the request ends, then exits 0|||JVM bỏ qua SIGTERM tới khi request xong, rồi thoát 0', 'Spring Boot converts SIGTERM into SIGKILL|||Spring Boot đổi SIGTERM thành SIGKILL'],
      correctIndex: 0,
      points: 1,
      explanation: 'Since Spring Boot 3.4, server.shutdown defaults to graceful (read from the metadata of a 4.1.2 jar: graceful, timeout-per-shutdown-phase 30s). Measured when building the deck: "Commencing graceful shutdown. Waiting for active requests to complete", the 3-second request answered, the JVM exited 143 (hooks ran; a signal death is still reported as 128 + 15). With server.shutdown=immediate the request got an empty reply. Lesson CS.1, slide 19.|||Từ Spring Boot 3.4, server.shutdown mặc định là graceful (đọc từ metadata của jar 4.1.2: graceful, timeout-per-shutdown-phase 30s). Đo lúc dựng bộ slide: "Commencing graceful shutdown. Waiting for active requests to complete", request 3 giây được trả lời, JVM thoát 143 (hook đã chạy; chết do tín hiệu vẫn được báo là 128 + 15). Với server.shutdown=immediate request nhận câu trả lời rỗng. Bài CS.1, slide 19.' },
    { id: 'q10',
      question: "A Dockerfile ends with CMD [\"npm\", \"start\"] and the Node app has process.on('SIGTERM', …). What happens on docker stop?|||Một Dockerfile kết thúc bằng CMD [\"npm\", \"start\"] và ứng dụng Node có process.on('SIGTERM', …). Chuyện gì xảy ra khi docker stop?",
      options: ['the handler runs, because npm forwards SIGTERM directly to node|||handler chạy, vì npm chuyển SIGTERM thẳng cho node', 'npm ignores SIGTERM, so Docker waits 10 s and the handler runs after SIGKILL|||npm bỏ qua SIGTERM, nên Docker chờ 10 giây và handler chạy sau SIGKILL', 'npm passes SIGTERM to the sh that runs the script, sh dies, npm exits 1 and node is killed without its handler running|||npm chuyển SIGTERM cho sh đang chạy script, sh chết, npm thoát 1 và node bị giết mà handler không chạy', 'the container keeps running forever|||container chạy mãi mãi'],
      correctIndex: 2,
      points: 1,
      explanation: 'Measured with docker stop (0.7 s, exit 1, handler did not run) and rebuilt with unshare (case D): PID 1 is npm, its child is sh -c "node app.js", npm signals sh, sh dies, npm exits 1; when PID 1 exits the kernel SIGKILLs the rest of the namespace. Use CMD ["node", "dist/index.js"] plus --init. A handler can never run after SIGKILL. Lesson CS.1, slides 21–22.|||Đo bằng docker stop (0,7 giây, mã 1, handler không chạy) và dựng lại bằng unshare (trường hợp D): PID 1 là npm, con của nó là sh -c "node app.js", npm gửi tín hiệu cho sh, sh chết, npm thoát 1; khi PID 1 thoát nhân SIGKILL phần còn lại của namespace. Dùng CMD ["node", "dist/index.js"] cùng --init. Handler không bao giờ chạy được sau SIGKILL. Bài CS.1, slide 21–22.' },
  ],
};

const QL_cs1 = {
  title: '⭐ CS.1 Quiz — Linux process model|||⭐ Quiz CS.1 — Mô hình tiến trình Linux',
  slug: 'osg202-quiz-cs1',
  type: 'QUIZ',
  description: '10 câu ôn phần ⭐ CS.1 (tự thêm, không thi FE), mỗi câu có giải thích song ngữ, ba câu có đáp án kiểm bằng chương trình chạy thật: đếm tiến trình của một mẫu fork, mã thoát của một lần sập SIGSEGV, tín hiệu ứng với mã 143, cách xoá zombie, vì sao PID 1 trong container lờ SIGTERM, thứ tự tắt êm, nohup, vì sao SIGKILL không bắt được, mặc định tắt êm của Spring Boot và CMD npm start trong Docker.',
  quiz: QUIZ_CS1,
};

/* ───────── ⭐ CS.3 — 📑 Slide by slide · Threads in backend (1): thread-per-request, pool size, virtual threads (slides 1–13) ───────── */
const L_cs3_1 = {
  title: '⭐ CS.3 — 📑 Slide by slide · Threads in backend (1): thread-per-request, pool size, virtual threads (slides 1–13)|||⭐ CS.3 — 📑 Học theo từng slide · Luồng trong backend (1): mỗi request một luồng, cỡ pool, luồng ảo (slide 1–13)',
  slug: 'osg202-slide-cs3-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–13 của deck tự dựng ⭐ Chuyên sâu 3 (ngoài giáo trình, không thi FE): mô hình mỗi request một luồng của Tomcat/Spring MVC với pool 200 luồng, đo thật 300 và 600 request chờ 1 giây (đợt 200), mỗi luồng Java là một task Linux, công thức Goetz và định luật Little để chọn cỡ pool, đo thật việc CPU-bound và IO-bound trên một CPU khớp với bộ mô phỏng, luồng ảo Java 21 (JEP 444) chạy 10.000 tác vụ trong 1 giây thay vì 50 giây, giới hạn pids làm luồng platform sập, và các bẫy khi bật luồng ảo (pinning, pool DB, đừng gom luồng ảo vào pool).',
  content: [
    bi(`<span class="eyebrow">⭐ Advanced 3 · Lesson CS.3 (part 1) · self-made deck "Threads in backend", slides 1–13</span>
<h2>How does one server answer a thousand users at once? Part 1: threads, pools and Java 21 virtual threads</h2>
<p class="lead">Lessons 2.A–2.C taught you what a thread is, how the OS schedules it and why shared data needs locks. Every backend framework is built on exactly those ideas — but with a design decision on top: <strong>how many threads, and who waits where?</strong> Spring MVC on Tomcat gives every HTTP request its own thread from a pool of 200. Node.js runs all your JavaScript on <em>one</em> thread and lets the kernel do the waiting. Java 21 brings <em>virtual threads</em>, which keep the simple "one thread per request" code but make waiting almost free. This first part covers the Java side: the thread-per-request model (slides 5–8), how to size a pool (9–10) and virtual threads (11–13). Part 2 covers the event loop, blocking it, races, deadlocks and the database.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>goals, a restaurant analogy, six words</td><td>explain thread pool, blocking call, CPU-bound vs IO-bound, event loop, virtual thread in plain words</td></tr>
<tr><td>5–8</td><td>thread-per-request (Tomcat / Spring MVC)</td><td>read Tomcat's thread names, predict "waves of 200", show that a Java thread is a Linux task</td></tr>
<tr><td>9–10</td><td>pool sizing</td><td>apply Goetz's formula and Little's law, and check them with a measurement</td></tr>
<tr><td>11–13</td><td>Java 21 virtual threads</td><td>explain mounting and unmounting, measure 10,000 waits, avoid pinning and pool traps</td></tr>
</tbody>
</table>
<div class="callout">⭐ This section is <strong>outside the OSG202 syllabus</strong> and is not examined in the FE. It exists because the user of this course is heading for backend work (Java Spring Boot, Node.js, PostgreSQL, Docker) and job interviews, where these questions come up every time. Every number below was measured on a real Linux container, and every program is shown with its real output. The machine was busy while measuring, so read the <strong>shape</strong> of the numbers (waves, knees, ratios), not the last digit.</div>`,
    `<span class="eyebrow">⭐ Chuyên sâu 3 · Bài CS.3 (phần 1) · deck tự dựng "Threads in backend", slide 1–13</span>
<h2>Một server trả lời một nghìn người cùng lúc bằng cách nào? Phần 1: luồng, pool và luồng ảo Java 21</h2>
<p class="lead">Bài 2.A–2.C đã dạy bạn luồng (thread) là gì, HĐH lập lịch cho nó thế nào và vì sao dữ liệu dùng chung cần khoá. Mọi framework backend đều xây trên đúng những ý đó — nhưng thêm một quyết định thiết kế: <strong>dùng bao nhiêu luồng, và ai đứng chờ ở đâu?</strong> Spring MVC chạy trên Tomcat cho mỗi request HTTP một luồng riêng lấy từ một pool 200 luồng. Node.js chạy toàn bộ JavaScript của bạn trên <em>một</em> luồng và để nhân (kernel) lo việc chờ. Java 21 đem tới <em>luồng ảo</em> (virtual thread), giữ kiểu viết "mỗi request một luồng" đơn giản nhưng làm cho việc chờ gần như miễn phí. Phần 1 này nói phía Java: mô hình mỗi request một luồng (slide 5–8), chọn cỡ pool (9–10) và luồng ảo (11–13). Phần 2 nói về event loop, chuyện làm nó bị chặn, tranh chấp, bế tắc và cơ sở dữ liệu.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>mục tiêu, ví dụ nhà hàng, sáu từ khoá</td><td>giải thích bằng lời thường thread pool, lời gọi chặn, CPU-bound vs IO-bound, event loop, luồng ảo</td></tr>
<tr><td>5–8</td><td>mỗi request một luồng (Tomcat / Spring MVC)</td><td>đọc tên luồng của Tomcat, đoán trước "từng đợt 200", chứng minh mỗi luồng Java là một task Linux</td></tr>
<tr><td>9–10</td><td>chọn cỡ pool</td><td>áp công thức Goetz và định luật Little, rồi kiểm bằng phép đo</td></tr>
<tr><td>11–13</td><td>luồng ảo Java 21</td><td>giải thích gắn/tháo (mount/unmount), đo 10.000 lần chờ, tránh bẫy pinning và bẫy pool</td></tr>
</tbody>
</table>
<div class="callout">⭐ Phần này <strong>nằm ngoài giáo trình OSG202</strong> và không thi FE. Nó có mặt vì người học khoá này hướng tới làm backend (Java Spring Boot, Node.js, PostgreSQL, Docker) và đi phỏng vấn, nơi những câu hỏi này lần nào cũng xuất hiện. Mọi con số dưới đây đều đo trên một container Linux thật, mọi chương trình đều đi kèm output thật của nó. Lúc đo máy đang bận, nên hãy đọc <strong>hình dạng</strong> của các con số (từng đợt, điểm gãy, tỉ lệ), đừng đọc chữ số cuối.</div>`),
    walkHead('cs3', 1, 13),
    walk('cs3', [
      [1, 'Threads in backend: thread pool vs event loop',
        `<p class="y-chinh">🎯 This deck answers one practical question: <strong>when a thousand users hit your API at the same moment, which thread runs whose code, and who is waiting where?</strong> Three answers exist in real backends — a pool of OS threads (Tomcat, Spring MVC), one event loop (Node.js), and virtual threads (Java 21) — and each one fails in its own typical way.</p>
<p>Why this matters more than it looks: most "the server is slow" or "the server hangs" incidents are not caused by slow code. They are caused by the <em>threading model</em>: every worker thread is stuck waiting for the database, a single CPU-heavy request freezes the only JavaScript thread, two transfers lock two accounts in opposite order, or two requests read the same stock and both write it back. You will meet each of these on these slides — and each one is reproduced with a real program you can run.</p>
<p>➕ How this links to the school part of the course: a <strong>thread</strong> (lesson 2.B) is one flow of execution inside a process, with its own registers and stack but sharing memory with its siblings; the scheduler (lesson 2.D) decides which thread gets a CPU core; a <strong>race condition</strong> and <strong>mutual exclusion</strong> (lesson 2.C) explain why <code>count++</code> breaks; and <strong>deadlock</strong> is Chapter 6. Here we use all of them at once, in Java and Node.js code that looks like what you will write at work.</p>
<p>The cover says "every number on these slides was measured on real Linux". The deck was measured on 25/10/2026 (Docker on an Apple M1 Max, Linux 7.0 kernel, while other jobs were running); this page runs the same experiments again in the course's own container and shows the new real output next to each slide. When the two runs differ in the last digits, that is normal — timing on a shared machine is noisy — and the lesson says which property must stay true.</p>
<p class="meo">🧠 One sentence for the whole deck: <em>a thread that waits still costs a thread; the three models differ only in what a waiting request costs and in what you must never do on the thread that serves everybody.</em></p>`,
        `<p class="y-chinh">🎯 Bộ slide này trả lời một câu hỏi thực tế: <strong>khi một nghìn người dùng gọi API của bạn cùng một lúc, luồng nào chạy code của ai, và ai đang đứng chờ ở đâu?</strong> Backend thật có ba câu trả lời — một pool luồng của HĐH (Tomcat, Spring MVC), một event loop (Node.js), và luồng ảo (Java 21) — và mỗi kiểu hỏng theo một cách đặc trưng của nó.</p>
<p>Vì sao chuyện này quan trọng hơn vẻ ngoài: phần lớn sự cố "server chậm" hay "server treo" không do code chạy chậm. Chúng do <em>mô hình luồng</em> gây ra: mọi luồng làm việc đều kẹt chờ cơ sở dữ liệu, một request nặng CPU làm đứng luồng JavaScript duy nhất, hai lần chuyển tiền khoá hai tài khoản theo thứ tự ngược nhau, hay hai request cùng đọc một con số tồn kho rồi cùng ghi đè. Bạn sẽ gặp từng chuyện đó trong các slide này — và mỗi chuyện đều được dựng lại bằng một chương trình thật chạy được.</p>
<p>➕ Phần này nối với phần giáo trình của trường thế nào: <strong>luồng (thread)</strong> (bài 2.B) là một dòng thực thi trong một tiến trình, có thanh ghi và ngăn xếp (stack) riêng nhưng dùng chung bộ nhớ với các luồng anh em; bộ lập lịch (scheduler, bài 2.D) quyết định luồng nào được một lõi CPU; <strong>tranh chấp (race condition)</strong> và <strong>loại trừ lẫn nhau (mutual exclusion)</strong> (bài 2.C) giải thích vì sao <code>count++</code> hỏng; còn <strong>bế tắc (deadlock)</strong> là Chương 6. Ở đây ta dùng tất cả cùng lúc, trên code Java và Node.js giống hệt thứ bạn sẽ viết khi đi làm.</p>
<p>Trang bìa ghi "mọi con số trên các slide đều đo trên Linux thật". Deck được đo ngày 25/10/2026 (Docker trên Apple M1 Max, nhân Linux 7.0, trong lúc các việc khác đang chạy); trang này chạy lại cùng các thí nghiệm trong container riêng của khoá học và đặt output thật mới cạnh từng slide. Khi hai lần chạy khác nhau ở mấy chữ số cuối, đó là bình thường — đo thời gian trên một máy dùng chung luôn nhiễu — và bài sẽ nói rõ tính chất nào bắt buộc phải giữ nguyên.</p>
<p class="meo">🧠 Cả bộ slide trong một câu: <em>một luồng đứng chờ vẫn tốn một luồng; ba mô hình chỉ khác nhau ở chỗ một request đang chờ tốn bao nhiêu, và ở việc gì tuyệt đối không được làm trên luồng đang phục vụ mọi người.</em></p>`],
      [2, 'What you will get from this lesson',
        `<p class="y-chinh">🎯 Five outcomes: see thread-per-request for real (Tomcat's pool of 200), size a pool for CPU-bound vs IO-bound work, measure what Java 21 virtual threads buy you (10,000 waits: 50 s → 1 s), draw Node's event loop with its phases and queues, and find and fix the four classic bugs — a blocked event loop, a race, a deadlock and a lost update in the database.</p>
<p>Each outcome is something an interviewer can test with one question and something a production incident can test without asking. "How many threads does Tomcat use?" (200 by default, plus 10 kept warm). "Why is my Node API slow only when somebody exports a report?" (CPU work on the event loop). "Why did the stock go from 10 to 9 after two purchases?" (lost update). "What do you look for in a thread dump when the app hangs at 0 % CPU?" (a lock cycle). By the end of the deck you can answer all four with a measurement, not a guess.</p>
<p>The "Builds on" box points back to the school lessons. If any word on this slide is new, revise it first: <strong>process vs thread</strong> and the thread's private stack (lesson 2.B, slides 17–30), <strong>race condition / critical region / mutex</strong> (lesson 2.C), and the <strong>four deadlock conditions</strong> (lesson 6.A). Those lessons teach the concept with C and pthreads; this deck shows the same concept in the languages of your future job.</p>
<p>➕ What is deliberately <em>not</em> here: the kernel side of waiting for the network — how one thread can watch ten thousand sockets with <code>epoll</code> — is the next deck, CS.4. In this deck we only need to know that "the kernel tells the event loop when data is ready", and we treat it as a black box.</p>
<p class="meo">🧠 Study tip: after each "Measured" slide, close the page and predict the number before you look at the output. Being able to predict "3 waves of 200 ⇒ about 3 seconds" is the real skill; reading it afterwards is easy.</p>`,
        `<p class="y-chinh">🎯 Năm kết quả: thấy tận mắt mô hình mỗi request một luồng (pool 200 của Tomcat), chọn cỡ pool cho việc CPU-bound và IO-bound, đo xem luồng ảo Java 21 đem lại gì (10.000 lần chờ: 50 s → 1 s), vẽ được event loop của Node với các pha và hàng đợi, và tìm rồi sửa bốn lỗi kinh điển — event loop bị chặn, tranh chấp (race), bế tắc (deadlock) và cập nhật bị mất (lost update) trong cơ sở dữ liệu.</p>
<p>Mỗi kết quả đều là thứ người phỏng vấn kiểm được bằng một câu hỏi, và là thứ một sự cố trên production kiểm bạn mà chẳng cần hỏi. "Tomcat dùng bao nhiêu luồng?" (mặc định 200, cộng 10 luồng luôn để sẵn). "Vì sao API Node của tôi chỉ chậm khi có người xuất báo cáo?" (việc nặng CPU nằm trên event loop). "Vì sao tồn kho từ 10 chỉ xuống 9 sau hai lần mua?" (lost update). "Khi app treo mà CPU 0 %, bạn tìm gì trong thread dump?" (một vòng khoá). Hết bộ slide, bạn trả lời cả bốn câu bằng phép đo chứ không bằng đoán.</p>
<p>Ô "Builds on" chỉ về các bài của trường. Nếu có từ nào trên slide còn lạ, hãy ôn trước: <strong>tiến trình vs luồng</strong> và ngăn xếp riêng của luồng (bài 2.B, slide 17–30), <strong>tranh chấp / miền găng (critical region) / mutex</strong> (bài 2.C), và <strong>bốn điều kiện bế tắc</strong> (bài 6.A). Các bài đó dạy khái niệm bằng C và pthread; bộ slide này cho thấy cùng khái niệm đó trong những ngôn ngữ bạn sẽ dùng khi đi làm.</p>
<p>➕ Thứ cố ý <em>không</em> có ở đây: phía nhân của việc chờ mạng — một luồng theo dõi mười nghìn socket bằng <code>epoll</code> ra sao — là deck kế tiếp, CS.4. Trong deck này ta chỉ cần biết "nhân báo cho event loop khi dữ liệu đã sẵn sàng" và coi nó là hộp đen.</p>
<p class="meo">🧠 Mẹo học: sau mỗi slide "Measured", hãy che trang lại và đoán con số trước khi nhìn output. Đoán được "3 đợt 200 ⇒ khoảng 3 giây" mới là kỹ năng thật; đọc kết quả sau đó thì dễ.</p>`],
      [3, 'Start with a restaurant',
        `<p class="y-chinh">🎯 Before any definition, two restaurants that both feed 1,000 guests. <strong>Restaurant A</strong> gives every table its own waiter, who stays at the table until the meal is over — even while the kitchen cooks for ten minutes. <strong>Restaurant B</strong> has one very fast waiter who takes an order, hands it to the kitchen, and walks on; a bell tells him when a dish is ready.</p>
<p>Restaurant A is easy to manage: each waiter only thinks about one table, from greeting to bill, in order. Its weakness is cost: the waiters spend most of their time <em>standing and waiting</em>, and when all 200 waiters are busy, guest number 201 waits at the door even though the kitchen is half idle. That is <strong>thread-per-request</strong>: Tomcat's 200 worker threads, each blocked in a database call most of the time.</p>
<p>Restaurant B needs only one waiter, because he never waits — he reacts to events ("table 3 wants to order", "the soup is ready"). But the model has one golden rule, written in red on the slide: <strong>the waiter must never start cooking himself</strong>. If he spends five minutes on a dish, every table in the restaurant waits five minutes. That is Node.js: the waiter is the <strong>event loop</strong>, the kitchen with its four cooks is the <strong>libuv thread pool</strong> plus the kernel, and "cooking" is any CPU-heavy JavaScript.</p>
<p>➕ Where virtual threads fit (slide 11): Restaurant A again, but the waiters are holograms. A hologram waiter costs almost nothing while he stands at a table, so you can project one per table — a thousand, a million — and keep A's simple "one waiter, one table, in order" style. Only when he actually <em>does</em> something does he need one of the few real bodies (a CPU core).</p>
<p class="meo">🧠 Keep the three pictures: <em>many real waiters</em> (platform threads), <em>one fast waiter + kitchen</em> (event loop + pool), <em>holograms on a few bodies</em> (virtual threads). Every slide after this is one of them, measured.</p>`,
        `<p class="y-chinh">🎯 Trước mọi định nghĩa, hai nhà hàng cùng phục vụ 1.000 khách. <strong>Nhà hàng A</strong> cho mỗi bàn một bồi bàn riêng, đứng ở bàn đó tới khi ăn xong — kể cả lúc bếp nấu mất mười phút. <strong>Nhà hàng B</strong> có một bồi bàn rất nhanh: nhận món, đưa vào bếp rồi đi tiếp; một cái chuông báo cho anh ta khi món đã xong.</p>
<p>Nhà hàng A dễ quản lý: mỗi bồi bàn chỉ lo một bàn, từ chào khách tới tính tiền, theo đúng thứ tự. Điểm yếu là chi phí: bồi bàn dành phần lớn thời gian để <em>đứng chờ</em>, và khi cả 200 bồi bàn đều bận thì vị khách thứ 201 phải đứng ở cửa, dù bếp đang rảnh một nửa. Đó là mô hình <strong>mỗi request một luồng (thread-per-request)</strong>: 200 luồng làm việc của Tomcat, phần lớn thời gian bị chặn trong một lời gọi cơ sở dữ liệu.</p>
<p>Nhà hàng B chỉ cần một bồi bàn, vì anh ta không bao giờ đứng chờ — anh ta phản ứng theo sự kiện ("bàn 3 muốn gọi món", "súp xong rồi"). Nhưng mô hình này có một luật vàng, viết màu đỏ trên slide: <strong>bồi bàn không bao giờ được tự vào bếp nấu</strong>. Nếu anh ta mất năm phút cho một món, mọi bàn trong nhà hàng chờ năm phút. Đó là Node.js: bồi bàn là <strong>event loop</strong> (vòng lặp sự kiện), bếp với bốn đầu bếp là <strong>thread pool của libuv</strong> cùng với nhân, và "nấu" là mọi đoạn JavaScript nặng CPU.</p>
<p>➕ Luồng ảo nằm ở đâu (slide 11): lại là nhà hàng A, nhưng bồi bàn là ảnh ba chiều (hologram). Một bồi bàn hologram đứng ở bàn gần như không tốn gì, nên bạn chiếu một người cho mỗi bàn — một nghìn, một triệu — và giữ nguyên kiểu "một bồi bàn, một bàn, theo thứ tự" đơn giản của A. Chỉ khi anh ta thật sự <em>làm</em> việc gì đó mới cần một trong số ít thân xác thật (một lõi CPU).</p>
<p class="meo">🧠 Giữ ba hình ảnh: <em>nhiều bồi bàn thật</em> (luồng platform), <em>một bồi bàn nhanh + bếp</em> (event loop + pool), <em>hologram trên vài thân xác</em> (luồng ảo). Mọi slide sau đây là một trong ba hình đó, được đo bằng số.</p>`],
      [4, 'Six words we need',
        `<p class="y-chinh">🎯 Six words carry the whole deck. A <strong>thread</strong> is one line of execution inside a process; a <strong>thread pool</strong> is a fixed team of reusable threads with a job queue; a <strong>blocking call</strong> makes a thread stop and wait; work is <strong>CPU-bound</strong> or <strong>IO-bound</strong>; an <strong>event loop</strong> is one thread that never waits; a <strong>virtual thread</strong> is a thread managed by the JVM instead of the OS.</p>
<ul>
<li><strong>Thread.</strong> Threads of one process share the heap, the open files and the code, but each has its own stack and registers (lesson 2.B). On Linux the kernel does not even have a separate "thread" object: every thread is a <em>task</em> with its own TID, created by <code>clone()</code> with flags that share memory. Slide 8 shows this with <code>ps -L</code>.</li>
<li><strong>Thread pool.</strong> Creating an OS thread costs a system call, a stack (about 2 MB reserved by the JVM on this machine) and kernel bookkeeping. A pool creates N threads once and gives each incoming job to a free one; jobs that find no free thread wait in a queue. Tomcat, <code>ExecutorService</code>, HikariCP (a pool of database connections) and libuv all use this pattern.</li>
<li><strong>Blocking call.</strong> <code>Thread.sleep</code>, a JDBC query, <code>InputStream.read</code>, <code>fs.readFileSync</code>: the thread goes into state S (sleeping) in the kernel. It uses <em>no CPU</em>, but it keeps its stack and its place in the pool.</li>
<li><strong>CPU-bound vs IO-bound.</strong> CPU-bound work keeps a core busy the whole time (hashing a password, resizing an image, parsing a 50 MB JSON). IO-bound work mostly waits (database, HTTP, disk). A typical web request is 5–20 % CPU and 80–95 % waiting.</li>
<li><strong>Event loop.</strong> A single thread runs short callbacks one after another; whenever it would have to wait, it registers interest ("call me when this socket has data") and moves on.</li>
<li><strong>Virtual thread.</strong> JDK 21 (JEP 444): a <code>java.lang.Thread</code> whose stack lives on the Java heap while it waits, so blocking costs a small object instead of an OS thread.</li>
</ul>
<p class="meo">🧠 Two questions classify any design: <em>what does a waiting request occupy?</em> (an OS thread / a callback / a heap object) and <em>where does CPU work run?</em> (any pool thread / the one loop thread — careful! / a carrier thread).</p>`,
        `<p class="y-chinh">🎯 Sáu từ gánh cả bộ slide. <strong>Luồng (thread)</strong> là một dòng thực thi trong một tiến trình; <strong>thread pool</strong> (bể luồng) là một đội luồng cố định dùng lại được, kèm một hàng đợi việc; <strong>lời gọi chặn (blocking call)</strong> làm luồng dừng lại chờ; một việc là <strong>CPU-bound</strong> (nặng tính toán) hoặc <strong>IO-bound</strong> (nặng chờ vào/ra); <strong>event loop</strong> là một luồng không bao giờ đứng chờ; <strong>luồng ảo (virtual thread)</strong> là luồng do JVM quản lý thay vì HĐH.</p>
<ul>
<li><strong>Luồng.</strong> Các luồng của một tiến trình dùng chung heap, các tệp đang mở và mã chương trình, nhưng mỗi luồng có ngăn xếp và thanh ghi riêng (bài 2.B). Trên Linux, nhân thậm chí không có đối tượng "luồng" riêng: mỗi luồng là một <em>task</em> có TID riêng, sinh ra bằng <code>clone()</code> với các cờ dùng chung bộ nhớ. Slide 8 cho thấy điều đó bằng <code>ps -L</code>.</li>
<li><strong>Thread pool.</strong> Tạo một luồng HĐH tốn một lời gọi hệ thống, một ngăn xếp (JVM giữ chỗ khoảng 2 MB trên máy này) và sổ sách của nhân. Pool tạo sẵn N luồng một lần rồi giao mỗi việc mới cho một luồng rảnh; việc nào không gặp luồng rảnh thì xếp hàng. Tomcat, <code>ExecutorService</code>, HikariCP (pool kết nối cơ sở dữ liệu) và libuv đều dùng mẫu này.</li>
<li><strong>Lời gọi chặn.</strong> <code>Thread.sleep</code>, một câu truy vấn JDBC, <code>InputStream.read</code>, <code>fs.readFileSync</code>: luồng chuyển sang trạng thái S (ngủ) trong nhân. Nó <em>không dùng CPU</em>, nhưng vẫn giữ ngăn xếp và giữ chỗ của nó trong pool.</li>
<li><strong>CPU-bound vs IO-bound.</strong> Việc CPU-bound giữ một lõi bận suốt (băm mật khẩu, đổi cỡ ảnh, phân tích một tệp JSON 50 MB). Việc IO-bound phần lớn là chờ (cơ sở dữ liệu, HTTP, đĩa). Một request web điển hình chỉ 5–20 % là CPU, 80–95 % là chờ.</li>
<li><strong>Event loop.</strong> Một luồng duy nhất chạy lần lượt các callback (hàm gọi lại) ngắn; hễ sắp phải chờ, nó đăng ký mối quan tâm ("gọi tôi khi socket này có dữ liệu") rồi đi tiếp.</li>
<li><strong>Luồng ảo.</strong> JDK 21 (JEP 444): một <code>java.lang.Thread</code> mà ngăn xếp nằm trên heap Java trong lúc nó chờ, nên chặn chỉ tốn một đối tượng nhỏ thay vì một luồng HĐH.</li>
</ul>
<p class="meo">🧠 Hai câu hỏi phân loại mọi thiết kế: <em>một request đang chờ chiếm cái gì?</em> (một luồng HĐH / một callback / một đối tượng trên heap) và <em>việc CPU chạy ở đâu?</em> (bất kỳ luồng nào trong pool / trên đúng một luồng của loop — cẩn thận! / trên một luồng carrier).</p>`],
      [5, 'Model 1: thread-per-request (Tomcat / Spring MVC)',
        `<p class="y-chinh">🎯 In Spring MVC every HTTP request is served by <strong>one worker thread</strong> from Tomcat's pool, from the first byte to the response. Your controller runs on it top to bottom; when it calls the database, that thread simply waits. Defaults (printed by Spring Boot 4.1.2 itself on slide 6): at most <strong>200</strong> worker threads, 10 kept alive when idle, a kernel accept queue of <strong>100</strong>, up to 8,192 open connections.</p>
<p>Follow the picture from left to right. A client opens a TCP connection; the kernel completes the handshake and parks the connection in the socket's <strong>accept queue</strong> (the <code>backlog</code> argument of <code>listen()</code>, which Tomcat sets from <code>server.tomcat.accept-count</code>). Tomcat's <strong>Acceptor</strong> thread calls <code>accept()</code>, and its <strong>NIO poller</strong> watches all open connections with <code>epoll</code> (deck CS.4). When a full request has arrived, the poller hands it to a free <strong>worker thread</strong> named <code>http-nio-8080-exec-N</code>, which runs filters, the dispatcher and your <code>@GetMapping</code> method.</p>
<p>So "NIO" in the thread name does not mean your code is non-blocking. Only the waiting for the <em>request bytes</em> is non-blocking; once your controller runs, it blocks normally — on JDBC, on <code>RestTemplate</code>, on file I/O — and the worker thread is occupied for the whole time. With 200 workers and requests that each wait 1 s on the database, the server can finish at most about 200 requests per second, however fast the CPU is (Little's law, slide 9).</p>
<p>When all 200 are busy, new requests are read but wait for a worker; when even the 8,192 connections or the accept queue are full, the kernel starts dropping new connection attempts and the client retries after about a second (slide 25 measures this).</p>
<p>🧭 On a real server: this is why a slow database turns into a "dead" Spring app. Each slow query keeps one worker; after 200 of them, even <code>/actuator/health</code> cannot get a thread, the load balancer marks the instance unhealthy and restarts it — although the app itself is fine. A thread dump then shows 200 threads in the same JDBC call.</p>
<p class="meo">🧠 Thread-per-request in one line: <em>simple code, but a waiting request holds a real OS thread — so the pool size is your concurrency limit.</em></p>`,
        `<p class="y-chinh">🎯 Trong Spring MVC mỗi request HTTP được phục vụ bởi <strong>một luồng làm việc (worker thread)</strong> trong pool của Tomcat, từ byte đầu tiên tới lúc trả lời. Controller của bạn chạy trên luồng đó từ trên xuống dưới; khi nó gọi cơ sở dữ liệu, luồng đó cứ thế đứng chờ. Mặc định (chính Spring Boot 4.1.2 in ra ở slide 6): tối đa <strong>200</strong> luồng làm việc, 10 luồng giữ sẵn khi rảnh, hàng đợi accept của nhân là <strong>100</strong>, tối đa 8.192 kết nối đang mở.</p>
<p>Đi theo hình từ trái sang phải. Client mở một kết nối TCP; nhân hoàn tất bắt tay rồi đặt kết nối vào <strong>hàng đợi accept</strong> của socket (tham số <code>backlog</code> của <code>listen()</code>, Tomcat lấy từ <code>server.tomcat.accept-count</code>). Luồng <strong>Acceptor</strong> của Tomcat gọi <code>accept()</code>, còn <strong>NIO poller</strong> của nó theo dõi mọi kết nối đang mở bằng <code>epoll</code> (deck CS.4). Khi một request đã tới đủ, poller giao nó cho một <strong>luồng làm việc</strong> rảnh tên <code>http-nio-8080-exec-N</code>, luồng này chạy các filter, dispatcher và phương thức <code>@GetMapping</code> của bạn.</p>
<p>Vậy chữ "NIO" trong tên luồng không có nghĩa là code của bạn không chặn. Chỉ phần chờ <em>các byte của request</em> là không chặn; khi controller chạy, nó chặn bình thường — trên JDBC, trên <code>RestTemplate</code>, trên I/O tệp — và luồng làm việc bị chiếm suốt thời gian đó. Với 200 luồng và mỗi request chờ cơ sở dữ liệu 1 s, server làm xong tối đa khoảng 200 request mỗi giây, CPU nhanh tới đâu cũng vậy (định luật Little, slide 9).</p>
<p>Khi cả 200 đều bận, request mới vẫn được đọc nhưng phải chờ luồng; khi đến cả 8.192 kết nối hay hàng đợi accept cũng đầy, nhân bắt đầu bỏ các lần xin kết nối mới và client thử lại sau khoảng một giây (slide 25 đo chuyện này).</p>
<p>🧭 Trên server thật: đây là lý do một cơ sở dữ liệu chậm biến app Spring thành "chết". Mỗi câu truy vấn chậm giữ một luồng; sau 200 câu như vậy, đến <code>/actuator/health</code> cũng không có luồng để chạy, bộ cân bằng tải (load balancer) đánh dấu máy hỏng rồi khởi động lại — dù bản thân app không có lỗi gì. Một thread dump lúc đó cho thấy 200 luồng nằm trong cùng một lời gọi JDBC.</p>
<p class="meo">🧠 Mỗi request một luồng trong một dòng: <em>code đơn giản, nhưng một request đang chờ giữ một luồng HĐH thật — nên cỡ pool chính là giới hạn đồng thời của bạn.</em></p>`],
      [6, 'Real run: Spring Boot 4.1.2 — which thread serves me?',
        `<p class="y-chinh">🎯 The slide is a real Spring Boot 4.1.2 run: the app prints its own defaults (<code>threads.max=200 min-spare=10 accept-count=100 max-connections=8192</code>), three <code>curl /who</code> calls are served by three different threads <code>http-nio-8080-exec-2/3/4</code>, <code>jstack</code> counts <strong>10</strong> worker threads when idle and <strong>200</strong> after a burst — never more.</p>
<p>Read the two endpoints. <code>/who</code> returns the name of the current thread and whether it is virtual. <code>/slow</code> sleeps 1 second — a stand-in for "a database query that takes 1 s"; during that second the thread does nothing, exactly like a thread blocked in JDBC. In Spring Boot 4 the Tomcat settings moved into their own class, <code>TomcatServerProperties</code> (module <code>spring-boot-tomcat</code>); in 3.x they lived under <code>ServerProperties.getTomcat()</code>. The property names did not change.</p>
<p>The idle count of 10 is <code>min-spare</code>: Tomcat keeps 10 threads ready so the first requests do not pay for thread creation. Under load the executor grows thread by thread up to <code>threads.max</code>; after the burst the extra threads stay alive for a while (an idle timeout of 60 s) and then die.</p>
<p>➕ The Spring app needs Maven and the internet to download Spring, which the course runner does not allow (<code>--network none</code>). So below, the same mechanism runs with the JDK's own <code>com.sun.net.httpserver.HttpServer</code>: a fixed pool of 200 platform threads named <code>http-exec-N</code>, a <code>/slow</code> handler that sleeps 1 s, and a client in the same program that fires 300 and then 600 requests at the same moment with <code>HttpClient.sendAsync</code>. Afterwards the server is restarted with <code>Executors.newVirtualThreadPerTaskExecutor()</code> — the same switch that <code>spring.threads.virtual.enabled=true</code> makes inside Tomcat.</p>
<pre><code class="language-java">// Slides 5–7: thread-per-request with a pool of 200 (like Tomcat) vs one virtual thread per request — JDK HttpServer, no Spring
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class HttpPool {
    static HttpServer start(ExecutorService ex) throws Exception {
        HttpServer s = HttpServer.create(new InetSocketAddress("127.0.0.1", 8080), 1000);  // backlog 1000: no SYN drops here
        s.createContext("/slow", h -&gt; {                     // pretend: a 1-second DB call
            try { Thread.sleep(1000); } catch (InterruptedException e) { }
            Thread t = Thread.currentThread();               // virtual threads have no name ⇒ use the id
            byte[] b = (t.isVirtual() ? "virtual-" + t.threadId() : t.getName()).getBytes();
            h.sendResponseHeaders(200, b.length); h.getResponseBody().write(b); h.close();
        });
        s.setExecutor(ex); s.start(); return s;
    }

    static void burst(int n) throws Exception {          // n requests AT THE SAME TIME, one client process
        var http = HttpClient.newBuilder().version(HttpClient.Version.HTTP_1_1).build();
        var req = HttpRequest.newBuilder(URI.create("http://127.0.0.1:8080/slow")).build();
        long t0 = System.nanoTime();
        var names = ConcurrentHashMap.&lt;String&gt;newKeySet();
        List&lt;CompletableFuture&lt;Long&gt;&gt; fs = new ArrayList&lt;&gt;();
        for (int i = 0; i &lt; n; i++) {
            long s = System.nanoTime();
            fs.add(http.sendAsync(req, HttpResponse.BodyHandlers.ofString())
                .thenApply(r -&gt; { names.add(r.body()); return (System.nanoTime() - s) / 1_000_000; }));
        }
        long[] ms = fs.stream().mapToLong(CompletableFuture::join).sorted().toArray();
        System.out.printf("  %d requests: wall %.1f s | p50 %d ms, max %d ms | distinct server threads %d%n",
            n, (System.nanoTime() - t0) / 1e9, ms[n / 2], ms[n - 1], names.size());
    }

    public static void main(String[] a) throws Exception {
        AtomicInteger k = new AtomicInteger();
        ExecutorService pool = Executors.newFixedThreadPool(200, r -&gt; new Thread(r, "http-exec-" + k.incrementAndGet()));
        System.out.println("platform: fixed pool of 200 threads");
        HttpServer s = start(pool);
        burst(300); burst(600);
        s.stop(0); pool.shutdownNow();
        System.out.println("virtual: one virtual thread per request");
        s = start(Executors.newVirtualThreadPerTaskExecutor());
        burst(300); burst(600);
        s.stop(0);
    }
}</code></pre>
<div class="out">$ javac HttpPool.java &amp;&amp; java HttpPool<br>
platform: fixed pool of 200 threads<br>
&nbsp;&nbsp;300 requests: wall 2.4 s | p50 1351 ms, max 2305 ms | distinct server threads 200<br>
&nbsp;&nbsp;600 requests: wall 3.1 s | p50 2017 ms, max 3043 ms | distinct server threads 200<br>
virtual: one virtual thread per request<br>
&nbsp;&nbsp;300 requests: wall 1.0 s | p50 1019 ms, max 1026 ms | distinct server threads 300<br>
&nbsp;&nbsp;600 requests: wall 1.1 s | p50 1022 ms, max 1037 ms | distinct server threads 600</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Read the platform lines: with 300 requests only 200 distinct server threads ever served them, and the median answer took longer than 1 s because 100 requests had to wait for the first wave. With 600 requests the median is about 2 s and the slowest about 3 s — <strong>three waves of 200</strong>. With virtual threads every request got its own thread (300 and 600 distinct ids) and both bursts finished in just over 1 s.</p>
<p class="meo">🧠 To check which model a running Spring app uses, look at the thread names in a thread dump: <code>http-nio-8080-exec-*</code> = platform pool; <code>tomcat-handler-*</code> with <code>virtual=true</code> = virtual threads.</p>`,
        `<p class="y-chinh">🎯 Slide là một lần chạy Spring Boot 4.1.2 thật: app tự in các giá trị mặc định của nó (<code>threads.max=200 min-spare=10 accept-count=100 max-connections=8192</code>), ba lần <code>curl /who</code> được ba luồng khác nhau <code>http-nio-8080-exec-2/3/4</code> phục vụ, <code>jstack</code> đếm được <strong>10</strong> luồng làm việc lúc rảnh và <strong>200</strong> sau một đợt dồn dập — không bao giờ hơn.</p>
<p>Đọc hai endpoint. <code>/who</code> trả về tên luồng hiện tại và nó có phải luồng ảo không. <code>/slow</code> ngủ 1 giây — đóng vai "một câu truy vấn cơ sở dữ liệu mất 1 s"; trong giây đó luồng không làm gì, y như một luồng bị chặn trong JDBC. Ở Spring Boot 4, các thiết lập của Tomcat chuyển sang lớp riêng <code>TomcatServerProperties</code> (module <code>spring-boot-tomcat</code>); ở bản 3.x chúng nằm dưới <code>ServerProperties.getTomcat()</code>. Tên thuộc tính thì không đổi.</p>
<p>Con số 10 lúc rảnh là <code>min-spare</code>: Tomcat giữ sẵn 10 luồng để những request đầu tiên không phải trả giá tạo luồng. Khi tải lên, executor tăng từng luồng một tới <code>threads.max</code>; sau đợt dồn, các luồng dư còn sống thêm một lúc (hết hạn rảnh 60 s) rồi mới chết.</p>
<p>➕ App Spring cần Maven và mạng internet để tải Spring, mà bộ chạy của khoá học không cho (<code>--network none</code>). Nên dưới đây cùng cơ chế đó chạy bằng <code>com.sun.net.httpserver.HttpServer</code> có sẵn trong JDK: một pool cố định 200 luồng platform tên <code>http-exec-N</code>, một handler <code>/slow</code> ngủ 1 s, và một client trong cùng chương trình bắn 300 rồi 600 request cùng một lúc bằng <code>HttpClient.sendAsync</code>. Sau đó server được dựng lại với <code>Executors.newVirtualThreadPerTaskExecutor()</code> — đúng cái công tắc mà <code>spring.threads.virtual.enabled=true</code> bật bên trong Tomcat.</p>
<pre><code class="language-java">// Slide 5–7: mỗi request một luồng, pool 200 (như Tomcat) vs mỗi request một luồng ảo — HttpServer của JDK, không cần Spring
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class HttpPool {
    static HttpServer start(ExecutorService ex) throws Exception {
        HttpServer s = HttpServer.create(new InetSocketAddress("127.0.0.1", 8080), 1000);  // backlog 1000: không rơi SYN
        s.createContext("/slow", h -&gt; {                     // giả làm một lần gọi DB mất 1 giây
            try { Thread.sleep(1000); } catch (InterruptedException e) { }
            Thread t = Thread.currentThread();               // luồng ảo không có tên ⇒ dùng id
            byte[] b = (t.isVirtual() ? "virtual-" + t.threadId() : t.getName()).getBytes();
            h.sendResponseHeaders(200, b.length); h.getResponseBody().write(b); h.close();
        });
        s.setExecutor(ex); s.start(); return s;
    }

    static void burst(int n) throws Exception {          // n request CÙNG LÚC từ một client
        var http = HttpClient.newBuilder().version(HttpClient.Version.HTTP_1_1).build();
        var req = HttpRequest.newBuilder(URI.create("http://127.0.0.1:8080/slow")).build();
        long t0 = System.nanoTime();
        var names = ConcurrentHashMap.&lt;String&gt;newKeySet();
        List&lt;CompletableFuture&lt;Long&gt;&gt; fs = new ArrayList&lt;&gt;();
        for (int i = 0; i &lt; n; i++) {
            long s = System.nanoTime();
            fs.add(http.sendAsync(req, HttpResponse.BodyHandlers.ofString())
                .thenApply(r -&gt; { names.add(r.body()); return (System.nanoTime() - s) / 1_000_000; }));
        }
        long[] ms = fs.stream().mapToLong(CompletableFuture::join).sorted().toArray();
        System.out.printf("  %d requests: wall %.1f s | p50 %d ms, max %d ms | distinct server threads %d%n",
            n, (System.nanoTime() - t0) / 1e9, ms[n / 2], ms[n - 1], names.size());
    }

    public static void main(String[] a) throws Exception {
        AtomicInteger k = new AtomicInteger();
        ExecutorService pool = Executors.newFixedThreadPool(200, r -&gt; new Thread(r, "http-exec-" + k.incrementAndGet()));
        System.out.println("platform: fixed pool of 200 threads");
        HttpServer s = start(pool);
        burst(300); burst(600);
        s.stop(0); pool.shutdownNow();
        System.out.println("virtual: one virtual thread per request");
        s = start(Executors.newVirtualThreadPerTaskExecutor());
        burst(300); burst(600);
        s.stop(0);
    }
}</code></pre>
<div class="out">$ javac HttpPool.java &amp;&amp; java HttpPool<br>
platform: fixed pool of 200 threads<br>
&nbsp;&nbsp;300 requests: wall 2.4 s | p50 1351 ms, max 2305 ms | distinct server threads 200<br>
&nbsp;&nbsp;600 requests: wall 3.1 s | p50 2017 ms, max 3043 ms | distinct server threads 200<br>
virtual: one virtual thread per request<br>
&nbsp;&nbsp;300 requests: wall 1.0 s | p50 1019 ms, max 1026 ms | distinct server threads 300<br>
&nbsp;&nbsp;600 requests: wall 1.1 s | p50 1022 ms, max 1037 ms | distinct server threads 600</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Đọc các dòng platform: với 300 request chỉ có 200 luồng server khác nhau phục vụ, và trung vị (median, p50) lâu hơn 1 s vì 100 request phải chờ đợt đầu. Với 600 request, trung vị khoảng 2 s và chậm nhất khoảng 3 s — <strong>ba đợt 200</strong>. Với luồng ảo, mỗi request có luồng riêng (300 và 600 id khác nhau) và cả hai đợt xong chỉ hơn 1 s một chút.</p>
<p class="meo">🧠 Muốn biết một app Spring đang chạy dùng mô hình nào, nhìn tên luồng trong thread dump: <code>http-nio-8080-exec-*</code> = pool luồng platform; <code>tomcat-handler-*</code> kèm <code>virtual=true</code> = luồng ảo.</p>`],
      [7, 'Measured: 600 requests, each waiting 1 s',
        `<p class="y-chinh">🎯 600 requests ÷ 200 threads = <strong>3 waves</strong>: in the slide's Spring run the median answer took 2.05 s and the last 3.08 s, while the CPU did almost nothing — threads, not CPU, were the limit. With <code>spring.threads.virtual.enabled=true</code> the median dropped to 1.08 s: every request waited its 1 s at the same time.</p>
<p>Why waves? The first 200 requests take all 200 threads at t ≈ 0 and release them at t ≈ 1 s; requests 201–400 get those threads at 1 s and finish at 2 s; requests 401–600 finish at 3 s. Each request still does only 1 s of "work" — the extra time is pure <strong>queueing</strong>. The run on slide 6 above shows the same shape in the course container: p50 ≈ 2 s and max ≈ 3 s for platform threads, p50 just over 1 s for virtual threads.</p>
<p>The same effect on a smaller scale, computed by the simulator: six requests, each doing 10 ms of CPU, then waiting 40 ms for the database, then 10 ms of CPU; a pool of only 2 platform threads. Each thread holds its request during the wait (the dashed "waits" boxes), so requests 3–6 queue.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fed6c0c6aec18ddb3ee71b983f4ea50388aea5c2.svg" alt="Thread-per-request with 2 threads: each thread stands idle during its request's DB wait, so the requests run in 3 waves" loading="lazy" /><p class="chu-thich">🧮 Thread-per-request with 2 threads: each thread stands idle during its request's DB wait, so the requests run in 3 waves</p></div>
<p>Computed: R1 60 ms · R2 60 ms · R3 120 ms · R4 120 ms · R5 180 ms · R6 180 ms — average <strong>120 ms</strong>, last <strong>180 ms</strong>.</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const yeuCau = (cpuDau = {}) =&gt; Array.from({ length: 6 }, (_, i) =&gt; ({
  ten: &#96;R&#36;{i + 1}&#96;, pha: [{ cpu: cpuDau[i] ?? 1 }, { wait: 4 }, { cpu: 1 }],   // CPU 10 ms → wait 40 ms → CPU 10 ms
}));
const KICH_BAN = {
  pool2: { yc: yeuCau(), cho: 2, loi: 2, giu: true },           // 2 platform threads, each held for the whole request
  loop: { yc: yeuCau(), cho: 1, loi: 1, giu: false },           // 1 event-loop thread, waits handled by the kernel
  chan: { yc: yeuCau({ 2: 6 }), cho: 1, loi: 1, giu: false },   // R3 burns 60 ms of CPU on the loop thread
  vt2: { yc: yeuCau(), cho: 2, loi: 2, giu: false },            // virtual threads on 2 carriers
};</code></pre></details>
<p>The same six requests with one virtual thread each, on 2 carrier threads: a waiting request gives its carrier back, so the second CPU slice of every request can start as soon as its wait ends.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c47ad97357b4a4785a584e7f1afeb2bba4fedf6d.svg" alt="Virtual threads on 2 carriers: waits overlap, the last request finishes at 80 ms instead of 180 ms" loading="lazy" /><p class="chu-thich">🧮 Virtual threads on 2 carriers: waits overlap, the last request finishes at 80 ms instead of 180 ms</p></div>
<p>Computed: R1 60 ms · R2 60 ms · R3 70 ms · R4 70 ms · R5 80 ms · R6 80 ms — average <strong>70 ms</strong>, last <strong>80 ms</strong>.</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const yeuCau = (cpuDau = {}) =&gt; Array.from({ length: 6 }, (_, i) =&gt; ({
  ten: &#96;R&#36;{i + 1}&#96;, pha: [{ cpu: cpuDau[i] ?? 1 }, { wait: 4 }, { cpu: 1 }],   // CPU 10 ms → wait 40 ms → CPU 10 ms
}));
const KICH_BAN = {
  pool2: { yc: yeuCau(), cho: 2, loi: 2, giu: true },           // 2 platform threads, each held for the whole request
  loop: { yc: yeuCau(), cho: 1, loi: 1, giu: false },           // 1 event-loop thread, waits handled by the kernel
  chan: { yc: yeuCau({ 2: 6 }), cho: 1, loi: 1, giu: false },   // R3 burns 60 ms of CPU on the loop thread
  vt2: { yc: yeuCau(), cho: 2, loi: 2, giu: false },            // virtual threads on 2 carriers
};</code></pre></details>
<p>➕ The slide's virtual-thread box also says "a few needed ~2 s". That tail is <em>not</em> caused by threads: 600 connections arrived in one burst and the kernel's accept queue holds only 100 — slide 25 measures the dropped SYNs. The course run above uses a backlog of 1,000 and has no such tail.</p>
<p class="meo">🧠 Rule of thumb: <em>time ≈ ceil(requests ÷ threads) × time per request</em> when every request just waits. If the answer is bigger than your timeout, you need more threads, virtual threads, or less waiting.</p>`,
        `<p class="y-chinh">🎯 600 request ÷ 200 luồng = <strong>3 đợt</strong>: trong lần chạy Spring trên slide, trung vị là 2,05 s và chậm nhất 3,08 s, trong khi CPU gần như không làm gì — giới hạn là luồng, không phải CPU. Bật <code>spring.threads.virtual.enabled=true</code> thì trung vị tụt xuống 1,08 s: mọi request chờ 1 s của nó cùng một lúc.</p>
<p>Vì sao từng đợt? 200 request đầu lấy hết 200 luồng lúc t ≈ 0 và trả lại lúc t ≈ 1 s; request 201–400 nhận các luồng đó lúc 1 s và xong lúc 2 s; request 401–600 xong lúc 3 s. Mỗi request vẫn chỉ "làm việc" 1 s — phần thời gian dôi ra hoàn toàn là <strong>xếp hàng (queueing)</strong>. Lần chạy ở slide 6 phía trên cho cùng hình dạng trong container của khoá học: p50 ≈ 2 s và max ≈ 3 s với luồng platform, p50 chỉ hơn 1 s với luồng ảo.</p>
<p>Cùng hiện tượng ở cỡ nhỏ, do bộ mô phỏng tính: sáu request, mỗi cái làm 10 ms CPU, rồi chờ cơ sở dữ liệu 40 ms, rồi thêm 10 ms CPU; pool chỉ có 2 luồng platform. Mỗi luồng giữ request của nó suốt lúc chờ (các ô nét đứt "waits"), nên request 3–6 phải xếp hàng.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c8b8666d56b132818e0cdc8deeaad990e58311a8.svg" alt="Mỗi request một luồng với 2 luồng: mỗi luồng đứng không trong lúc request của nó chờ DB, nên các request chạy thành 3 đợt" loading="lazy" /><p class="chu-thich">🧮 Mỗi request một luồng với 2 luồng: mỗi luồng đứng không trong lúc request của nó chờ DB, nên các request chạy thành 3 đợt</p></div>
<p>Máy tính ra: R1 60 ms · R2 60 ms · R3 120 ms · R4 120 ms · R5 180 ms · R6 180 ms — trung bình <strong>120 ms</strong>, cuối cùng <strong>180 ms</strong>.</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const yeuCau = (cpuDau = {}) =&gt; Array.from({ length: 6 }, (_, i) =&gt; ({
  ten: &#96;R&#36;{i + 1}&#96;, pha: [{ cpu: cpuDau[i] ?? 1 }, { wait: 4 }, { cpu: 1 }],   // CPU 10 ms → wait 40 ms → CPU 10 ms
}));
const KICH_BAN = {
  pool2: { yc: yeuCau(), cho: 2, loi: 2, giu: true },           // 2 platform threads, each held for the whole request
  loop: { yc: yeuCau(), cho: 1, loi: 1, giu: false },           // 1 event-loop thread, waits handled by the kernel
  chan: { yc: yeuCau({ 2: 6 }), cho: 1, loi: 1, giu: false },   // R3 burns 60 ms of CPU on the loop thread
  vt2: { yc: yeuCau(), cho: 2, loi: 2, giu: false },            // virtual threads on 2 carriers
};</code></pre></details>
<p>Cũng sáu request đó, mỗi cái một luồng ảo, trên 2 luồng carrier: request đang chờ trả carrier lại, nên lát CPU thứ hai của mỗi request bắt đầu được ngay khi phần chờ của nó kết thúc.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7ba0d8a0c3241f7bbd3f01ef19f55bf40c9e68c8.svg" alt="Luồng ảo trên 2 carrier: các lần chờ chồng lên nhau, request cuối xong lúc 80 ms thay vì 180 ms" loading="lazy" /><p class="chu-thich">🧮 Luồng ảo trên 2 carrier: các lần chờ chồng lên nhau, request cuối xong lúc 80 ms thay vì 180 ms</p></div>
<p>Máy tính ra: R1 60 ms · R2 60 ms · R3 70 ms · R4 70 ms · R5 80 ms · R6 80 ms — trung bình <strong>70 ms</strong>, cuối cùng <strong>80 ms</strong>.</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const yeuCau = (cpuDau = {}) =&gt; Array.from({ length: 6 }, (_, i) =&gt; ({
  ten: &#96;R&#36;{i + 1}&#96;, pha: [{ cpu: cpuDau[i] ?? 1 }, { wait: 4 }, { cpu: 1 }],   // CPU 10 ms → wait 40 ms → CPU 10 ms
}));
const KICH_BAN = {
  pool2: { yc: yeuCau(), cho: 2, loi: 2, giu: true },           // 2 platform threads, each held for the whole request
  loop: { yc: yeuCau(), cho: 1, loi: 1, giu: false },           // 1 event-loop thread, waits handled by the kernel
  chan: { yc: yeuCau({ 2: 6 }), cho: 1, loi: 1, giu: false },   // R3 burns 60 ms of CPU on the loop thread
  vt2: { yc: yeuCau(), cho: 2, loi: 2, giu: false },            // virtual threads on 2 carriers
};</code></pre></details>
<p>➕ Ô luồng ảo trên slide còn ghi "vài request cần ~2 s". Phần đuôi đó <em>không</em> do luồng: 600 kết nối tới cùng một lúc mà hàng đợi accept của nhân chỉ chứa 100 — slide 25 đo các gói SYN bị bỏ. Lần chạy của khoá học phía trên dùng backlog 1.000 nên không có đuôi đó.</p>
<p class="meo">🧠 Quy tắc nhẩm: <em>thời gian ≈ trần(số request ÷ số luồng) × thời gian mỗi request</em> khi mọi request chỉ đứng chờ. Nếu kết quả lớn hơn hạn chờ (timeout) của bạn, bạn cần thêm luồng, dùng luồng ảo, hoặc bớt chờ.</p>`],
      [8, 'A Java thread IS a Linux thread',
        `<p class="y-chinh">🎯 A Java platform thread is exactly one Linux task. <code>ls /proc/&lt;pid&gt;/task</code> lists one directory per thread, <code>ps -L</code> shows each with its own LWP (thread id) and state, and the name you pass to <code>new Thread(…, "transfer-A-to-B")</code> even becomes the Linux thread name. Each one reserves a stack (the JVM's log says <code>stacksize: 2040k</code>), and the kernel limits how many tasks you may have.</p>
<p>This is the <strong>one-to-one model</strong> of lesson 2.B: every user thread has its own kernel thread, so the kernel schedules Java threads directly on CPU cores, a thread blocked in a system call does not stop the others, and two threads really run in parallel on two cores. The price is that each thread is a kernel object with a kernel stack, a scheduler entry and (in Java) a large user stack reserved in virtual memory.</p>
<p>The run below starts the deadlock program of slide 21 (two threads stuck forever), then looks at it from the outside. The JVM process already has around twenty tasks — <code>main</code>, the JIT compilers, garbage-collector threads, signal handling — plus our two named threads. Both are in state <code>S</code> (sleeping, waiting for a lock) with 0 % CPU: a hung Java app looks idle, not busy.</p>
<div class="out"># Slides 8 and 22: a real deadlock, seen by jstack and by ps (each Java thread is a Linux task)<br>
$ java Deadlock &amp; sleep 3<br>
T1 (A-&gt;B) locked A, waiting for B<br>
T2 (B-&gt;A) locked B, waiting for A<br>
$ P=$(pgrep -x java); ls /proc/$P/task | wc -l<br>
20<br>
$ ps -L -o pid,lwp,stat,pcpu,comm -p $P | grep -E 'LWP|transfer'<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;&nbsp;LWP STAT %CPU COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;34 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;53 Sl &nbsp;&nbsp;&nbsp;0.0 transfer-A-to-B<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;34 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;54 Sl &nbsp;&nbsp;&nbsp;0.0 transfer-B-to-A<br>
$ jstack $P | sed -n '/Found one Java-level deadlock/,/Found 1 deadlock/p' | grep -v '^\\s*at \\|^\\s*- \\|Lambda\\|^$'<br>
Found one Java-level deadlock:<br>
=============================<br>
"transfer-A-to-B":<br>
&nbsp;&nbsp;waiting to lock monitor 0x0000ffff4c0107c0 (object 0x000000008bb13808, a java.lang.Object),<br>
&nbsp;&nbsp;which is held by "transfer-B-to-A"<br>
"transfer-B-to-A":<br>
&nbsp;&nbsp;waiting to lock monitor 0x0000ffff40032480 (object 0x000000008bb137f8, a java.lang.Object),<br>
&nbsp;&nbsp;which is held by "transfer-A-to-B"<br>
Java stack information for the threads listed above:<br>
===================================================<br>
"transfer-A-to-B":<br>
"transfer-B-to-A":<br>
Found 1 deadlock.<br>
$ kill -9 %1</div>
<p>The <code>STAT</code> column <code>Sl</code> means: S = interruptible sleep, l = multi-threaded process. The <code>jstack</code> part is explained on slide 21.</p>
<p>➕ Where the limit comes from: <code>ulimit -u</code> (max user processes, which counts threads) and, inside a container, the cgroup file <code>pids.max</code> (<code>docker run --pids-limit</code>; deck CS.6). Slide 12 runs Java with <code>pids.max = 50</code> and watches platform threads fail.</p>
<p>🧭 On a real server: <code>top -H -p &lt;pid&gt;</code> shows the CPU use of each Java thread; take the busiest TID, convert it to hexadecimal, and search for <code>nid=0x…</code> in a <code>jstack</code> dump to find which Java code is burning the CPU. That trick only works because Java threads are Linux tasks.</p>
<p class="meo">🧠 Remember the chain: <em>Java platform thread = pthread = Linux task = one entry in <code>/proc/&lt;pid&gt;/task</code></em>. Virtual threads (slide 11) break this chain on purpose.</p>`,
        `<p class="y-chinh">🎯 Một luồng platform của Java chính là một task Linux. <code>ls /proc/&lt;pid&gt;/task</code> liệt kê mỗi luồng một thư mục, <code>ps -L</code> cho thấy mỗi luồng có LWP (mã luồng) và trạng thái riêng, và cái tên bạn truyền vào <code>new Thread(…, "transfer-A-to-B")</code> còn trở thành tên luồng của Linux. Mỗi luồng giữ chỗ một ngăn xếp (nhật ký JVM ghi <code>stacksize: 2040k</code>), và nhân giới hạn số task bạn được có.</p>
<p>Đây là <strong>mô hình một–một (one-to-one)</strong> của bài 2.B: mỗi luồng người dùng có luồng nhân riêng, nên nhân lập lịch luồng Java thẳng lên các lõi CPU, một luồng bị chặn trong lời gọi hệ thống không làm các luồng khác dừng, và hai luồng thật sự chạy song song trên hai lõi. Cái giá là mỗi luồng là một đối tượng của nhân, có ngăn xếp nhân, một mục trong bộ lập lịch và (với Java) một ngăn xếp người dùng lớn được giữ chỗ trong bộ nhớ ảo.</p>
<p>Lần chạy dưới đây khởi động chương trình bế tắc của slide 21 (hai luồng kẹt mãi mãi), rồi nhìn nó từ bên ngoài. Tiến trình JVM vốn đã có khoảng hai mươi task — <code>main</code>, các trình biên dịch JIT, các luồng thu gom rác (GC), xử lý tín hiệu — cộng thêm hai luồng có tên của ta. Cả hai đang ở trạng thái <code>S</code> (ngủ, chờ khoá) với 0 % CPU: một app Java bị treo trông như đang rảnh, chứ không bận.</p>
<div class="out"># Slide 8 và 22: một bế tắc thật, nhìn bằng jstack và bằng ps (mỗi luồng Java là một task Linux)<br>
$ java Deadlock &amp; sleep 3<br>
T1 (A-&gt;B) locked A, waiting for B<br>
T2 (B-&gt;A) locked B, waiting for A<br>
$ P=$(pgrep -x java); ls /proc/$P/task | wc -l<br>
20<br>
$ ps -L -o pid,lwp,stat,pcpu,comm -p $P | grep -E 'LWP|transfer'<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;&nbsp;LWP STAT %CPU COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;34 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;53 Sl &nbsp;&nbsp;&nbsp;0.0 transfer-A-to-B<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;34 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;54 Sl &nbsp;&nbsp;&nbsp;0.0 transfer-B-to-A<br>
$ jstack $P | sed -n '/Found one Java-level deadlock/,/Found 1 deadlock/p' | grep -v '^\\s*at \\|^\\s*- \\|Lambda\\|^$'<br>
Found one Java-level deadlock:<br>
=============================<br>
"transfer-A-to-B":<br>
&nbsp;&nbsp;waiting to lock monitor 0x0000ffff4c0107c0 (object 0x000000008bb13808, a java.lang.Object),<br>
&nbsp;&nbsp;which is held by "transfer-B-to-A"<br>
"transfer-B-to-A":<br>
&nbsp;&nbsp;waiting to lock monitor 0x0000ffff40032480 (object 0x000000008bb137f8, a java.lang.Object),<br>
&nbsp;&nbsp;which is held by "transfer-A-to-B"<br>
Java stack information for the threads listed above:<br>
===================================================<br>
"transfer-A-to-B":<br>
"transfer-B-to-A":<br>
Found 1 deadlock.<br>
$ kill -9 %1</div>
<p>Cột <code>STAT</code> giá trị <code>Sl</code> nghĩa là: S = ngủ ngắt được (interruptible sleep), l = tiến trình nhiều luồng. Phần <code>jstack</code> được giải thích ở slide 21.</p>
<p>➕ Giới hạn đến từ đâu: <code>ulimit -u</code> (số tiến trình tối đa của người dùng, tính cả luồng) và, trong container, tệp cgroup <code>pids.max</code> (<code>docker run --pids-limit</code>; deck CS.6). Slide 12 chạy Java với <code>pids.max = 50</code> và xem luồng platform sập.</p>
<p>🧭 Trên server thật: <code>top -H -p &lt;pid&gt;</code> cho thấy mức dùng CPU của từng luồng Java; lấy TID bận nhất, đổi sang hệ mười sáu, rồi tìm <code>nid=0x…</code> trong bản <code>jstack</code> để biết đoạn code Java nào đang đốt CPU. Mẹo đó dùng được chỉ vì luồng Java là task Linux.</p>
<p class="meo">🧠 Nhớ chuỗi: <em>luồng platform Java = pthread = task Linux = một mục trong <code>/proc/&lt;pid&gt;/task</code></em>. Luồng ảo (slide 11) cố ý phá chuỗi này.</p>`],
      [9, 'Sizing a pool: how many threads?',
        `<p class="y-chinh">🎯 Two formulas size a pool. <strong>Goetz</strong> (<em>Java Concurrency in Practice</em>, §8.2): <code>N = Ncpu × Ucpu × (1 + W/C)</code> — W is the time a task waits, C the time it computes, U the CPU share you want to use. <strong>Little's law</strong> (any queue): <code>busy threads = arrival rate × time per request</code> — 500 req/s × 0.4 s = 200 threads busy at once.</p>
<p>The code on the slide is the standard Java way to run many jobs on a bounded pool: <code>Executors.newFixedThreadPool(40)</code> creates 40 threads and an unbounded queue; <code>submit</code> returns a <code>Future</code>; <code>f.get()</code> waits for each result. Since Java 19 <code>ExecutorService</code> is <code>AutoCloseable</code>, so <code>pool.close()</code> (or try-with-resources) means "shut down, then wait for every job" — the old pair <code>shutdown()</code> + <code>awaitTermination()</code> in one call.</p>
<p>Where Goetz's formula comes from: a thread that computes for C ms and then waits W ms keeps one core busy only C/(C+W) of the time. To keep N<sub>cpu</sub> cores busy you need N<sub>cpu</sub> × (C+W)/C = N<sub>cpu</sub> × (1 + W/C) threads. Two extreme cases follow directly:</p>
<ul>
<li><strong>CPU-bound</strong> (W ≈ 0): N ≈ number of cores. More threads cannot make the cores faster; they only add context switches and cache misses. That is why <code>ForkJoinPool.commonPool()</code> and parallel streams default to <code>availableProcessors() − 1</code> workers.</li>
<li><strong>IO-bound</strong> (W ≫ C): many more threads than cores. A task with 10 ms of CPU and 90 ms of waiting needs 1 + 90/10 = 10 threads per core.</li>
</ul>
<p>Little's law answers the other question — how many threads <em>will</em> be busy under a given load. If your API receives 500 requests per second and each holds a thread for 0.4 s, on average 200 threads are busy: exactly Tomcat's default maximum, so any slowdown of the database (0.4 s → 0.6 s) means 300 needed threads and a growing queue.</p>
<p class="pitfall">⚠️ The formulas give a <strong>starting point</strong>, not an answer: W and C change with load, and the database behind the pool has its own limit — HikariCP's default pool is 10 connections, so 200 Tomcat threads that all need the database still run 10 at a time. Always measure (next slide).</p>
<p class="meo">🧠 Ask "what is my scarce resource?" — cores (CPU-bound: threads ≈ cores), threads (IO-bound: threads ≈ cores × (1 + W/C)), or something behind them (DB connections, an API's rate limit).</p>`,
        `<p class="y-chinh">🎯 Hai công thức để chọn cỡ pool. <strong>Goetz</strong> (<em>Java Concurrency in Practice</em>, §8.2): <code>N = Ncpu × Ucpu × (1 + W/C)</code> — W là thời gian một tác vụ chờ, C là thời gian nó tính, U là tỉ lệ CPU bạn muốn dùng. <strong>Định luật Little (Little's law)</strong> (đúng với mọi hàng đợi): <code>số luồng bận = tốc độ request tới × thời gian mỗi request</code> — 500 req/s × 0,4 s = 200 luồng bận cùng lúc.</p>
<p>Code trên slide là cách chuẩn của Java để chạy nhiều việc trên một pool có giới hạn: <code>Executors.newFixedThreadPool(40)</code> tạo 40 luồng và một hàng đợi không giới hạn; <code>submit</code> trả về một <code>Future</code>; <code>f.get()</code> chờ kết quả từng việc. Từ Java 19, <code>ExecutorService</code> là <code>AutoCloseable</code>, nên <code>pool.close()</code> (hoặc try-with-resources) nghĩa là "tắt pool, rồi chờ mọi việc xong" — gộp cặp cũ <code>shutdown()</code> + <code>awaitTermination()</code> làm một.</p>
<p>Công thức Goetz từ đâu ra: một luồng tính C ms rồi chờ W ms chỉ giữ một lõi bận C/(C+W) thời gian. Muốn giữ N<sub>cpu</sub> lõi bận cần N<sub>cpu</sub> × (C+W)/C = N<sub>cpu</sub> × (1 + W/C) luồng. Hai trường hợp cực suy ra ngay:</p>
<ul>
<li><strong>CPU-bound</strong> (W ≈ 0): N ≈ số lõi. Thêm luồng không làm lõi nhanh hơn; nó chỉ thêm chuyển ngữ cảnh (context switch) và trượt cache. Vì vậy <code>ForkJoinPool.commonPool()</code> và parallel stream mặc định dùng <code>availableProcessors() − 1</code> luồng.</li>
<li><strong>IO-bound</strong> (W ≫ C): cần nhiều luồng hơn số lõi rất nhiều. Một tác vụ 10 ms CPU và 90 ms chờ cần 1 + 90/10 = 10 luồng cho mỗi lõi.</li>
</ul>
<p>Định luật Little trả lời câu hỏi ngược lại — dưới một mức tải cho trước, <em>sẽ</em> có bao nhiêu luồng bận. Nếu API nhận 500 request mỗi giây và mỗi request giữ một luồng 0,4 s, trung bình có 200 luồng bận: đúng bằng mức tối đa mặc định của Tomcat, nên chỉ cần cơ sở dữ liệu chậm đi một chút (0,4 s → 0,6 s) là cần 300 luồng và hàng đợi bắt đầu dài ra.</p>
<p class="pitfall">⚠️ Các công thức cho <strong>điểm xuất phát</strong>, không cho đáp án: W và C đổi theo tải, và cơ sở dữ liệu phía sau pool có giới hạn riêng — pool mặc định của HikariCP là 10 kết nối, nên 200 luồng Tomcat cùng cần cơ sở dữ liệu thì vẫn chỉ chạy được 10 luồng một lúc. Luôn đo (slide sau).</p>
<p class="meo">🧠 Hãy hỏi "tài nguyên khan hiếm của tôi là gì?" — lõi CPU (CPU-bound: số luồng ≈ số lõi), luồng (IO-bound: số luồng ≈ số lõi × (1 + W/C)), hay một thứ đứng sau chúng (kết nối DB, giới hạn tốc độ của một API).</p>`],
      [10, 'Measured: the formula finds the knee',
        `<p class="y-chinh">🎯 The slide's bar charts (4 CPUs): CPU-bound work is fastest at <strong>4 threads = 4 cores</strong>; IO-bound work (10 ms CPU + 90 ms wait) gets <strong>8.6× faster</strong> from 4 to 40 threads — exactly Goetz's 4 × (1 + 90/10) = 40 — and then stops improving because the CPUs are full.</p>
<p>Below, the same program runs in the course container limited to <strong>one CPU</strong> (<code>docker run --cpus=1</code>), so the predictions become very simple: CPU-bound — 1 thread is as good as it gets; IO-bound — Goetz says 1 × (1 + 90/10) = <strong>10</strong> threads. To make "10 ms of CPU" real CPU time (and not 10 ms of wall-clock time, which a throttled thread could spend descheduled), the IO task spins on <code>ThreadMXBean.getCurrentThreadCpuTime()</code>.</p>
<pre><code class="language-java">// Slides 9–10: how many threads? CPU-bound vs IO-bound work on ONE CPU (container --cpus=1)
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadMXBean;
import java.util.*;
import java.util.concurrent.*;

public class PoolSizing {
    static long cpuWork(int n) {                       // pure CPU: count primes below n
        long c = 0;
        for (int i = 2; i &lt; n; i++) { boolean p = true;
            for (int j = 2; (long) j * j &lt;= i; j++) if (i % j == 0) { p = false; break; }
            if (p) c++; }
        return c;
    }
    static final ThreadMXBean MX = ManagementFactory.getThreadMXBean();
    static void ioWork() {                             // "a DB call": 10 ms of CPU TIME + 90 ms of waiting
        long end = MX.getCurrentThreadCpuTime() + 10_000_000; while (MX.getCurrentThreadCpuTime() &lt; end) { }
        try { Thread.sleep(90); } catch (InterruptedException e) { }
    }
    static double once(int threads, int tasks, Runnable job) throws Exception {
        try (ExecutorService pool = Executors.newFixedThreadPool(threads)) {
            long t0 = System.nanoTime();
            List&lt;Future&lt;?&gt;&gt; fs = new ArrayList&lt;&gt;();
            for (int i = 0; i &lt; tasks; i++) fs.add(pool.submit(job));
            for (Future&lt;?&gt; f : fs) f.get();
            return (System.nanoTime() - t0) / 1e9;
        }
    }
    static double best(int threads, int tasks, Runnable job) throws Exception {  // best of 2 runs
        return Math.min(once(threads, tasks, job), once(threads, tasks, job));
    }

    public static void main(String[] a) throws Exception {
        int cpus = Runtime.getRuntime().availableProcessors();
        System.out.println("availableProcessors = " + cpus);
        once(cpus, 8, () -&gt; cpuWork(1_500_000));          // warm up the JIT
        System.out.println("CPU-bound: 8 tasks (count primes)");
        for (int t : new int[] { 1, 2, 4, 8 })
            System.out.printf("  pool %2d -&gt; %.2f s%n", t, best(t, 8, () -&gt; cpuWork(1_500_000)));
        System.out.println("IO-bound: 40 tasks x (10 ms CPU + 90 ms wait)   Goetz: " + cpus + " x (1 + 90/10) = " + cpus * 10);
        for (int t : new int[] { 1, 2, 5, 10, 20, 40 })
            System.out.printf("  pool %2d -&gt; %.2f s%n", t, best(t, 40, PoolSizing::ioWork));
    }
}</code></pre>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cpus=1</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out">$ javac PoolSizing.java &amp;&amp; java PoolSizing<br>
availableProcessors = 1<br>
CPU-bound: 8 tasks (count primes)<br>
&nbsp;&nbsp;pool &nbsp;1 -&gt; 1.00 s<br>
&nbsp;&nbsp;pool &nbsp;2 -&gt; 1.00 s<br>
&nbsp;&nbsp;pool &nbsp;4 -&gt; 1.03 s<br>
&nbsp;&nbsp;pool &nbsp;8 -&gt; 1.28 s<br>
IO-bound: 40 tasks x (10 ms CPU + 90 ms wait) &nbsp;&nbsp;Goetz: 1 x (1 + 90/10) = 10<br>
&nbsp;&nbsp;pool &nbsp;1 -&gt; 4.01 s<br>
&nbsp;&nbsp;pool &nbsp;2 -&gt; 2.01 s<br>
&nbsp;&nbsp;pool &nbsp;5 -&gt; 0.81 s<br>
&nbsp;&nbsp;pool 10 -&gt; 0.42 s<br>
&nbsp;&nbsp;pool 20 -&gt; 0.41 s<br>
&nbsp;&nbsp;pool 40 -&gt; 0.49 s</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Read the output against the predictions. CPU-bound: 1, 2, 4 and 8 threads all take about the same time — one CPU is one CPU, the extra threads only take turns. IO-bound: 1 thread needs 40 × 100 ms ≈ 4 s; 2 threads halve it; at <strong>10 threads</strong> the time drops below half a second and then hardly moves, because 40 tasks × 10 ms of CPU = 0.4 s of CPU is the floor no number of threads can beat.</p>
<p>The simulator computes the same experiment from the model alone (40 tasks, one CPU, a FIFO queue, each thread held for the whole task): 4.00, 2.01, 0.84, 0.49, 0.49, 0.49 s for pools of 1, 2, 5, 10, 20, 40 — within a few hundredths of a second of the real run (the real CPU slices were a little shorter than the model's whole 10 ms units). That match is the point: a model this simple is good enough to size a pool before you measure.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c9518a21dcb9884a9b080b738e8465cf34613eb7.svg" alt="40 IO-bound tasks on 1 CPU: the curve flattens exactly at Goetz's 10 threads, just above the 0.4 s CPU floor" loading="lazy" /><p class="chu-thich">🧮 40 IO-bound tasks on 1 CPU: the curve flattens exactly at Goetz's 10 threads, just above the 0.4 s CPU floor</p></div>
<table><thead><tr><th>pool</th><th>model</th></tr></thead><tbody><tr><td>1</td><td>4 s</td></tr><tr><td>2</td><td>2.01 s</td></tr><tr><td>5</td><td>0.84 s</td></tr><tr><td>10</td><td>0.49 s</td></tr><tr><td>20</td><td>0.49 s</td></tr><tr><td>40</td><td>0.49 s</td></tr></tbody></table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TASKS = 40, C = 1, W = 9, CORES = 1;              // 1 unit = 10 ms: 10 ms CPU, 90 ms wait, one CPU
const makespan = (p) =&gt; {
  const yc = Array.from({ length: TASKS }, (_, i) =&gt; ({ ten: &#96;T&#36;{i}&#96;, pha: [{ cpu: C }, { wait: W }] }));
  return Math.max(...lichYeuCau({ yeuCau: yc, cho: p, loi: CORES, giu: true }).xong) / 100;   // → seconds
};
const goetz = CORES * (1 + W / C);</code></pre></details>
<p>➕ Why not just use 1,000 threads "to be safe"? On this tiny example 40 threads cost nothing extra, but in a real server every platform thread is ~1–2 MB of reserved stack, a kernel task and a scheduler entry; and above the knee more threads only increase contention (on locks, on the DB pool, on CPU caches). Virtual threads (next slide) change the cost side of this trade-off, not the CPU side.</p>
<p class="meo">🧠 The shape to remember: <em>a steep fall, a knee at Ncpu × (1 + W/C), then a flat line at the CPU floor</em>. Measure two points on either side of the knee and you know your pool size.</p>`,
        `<p class="y-chinh">🎯 Biểu đồ cột trên slide (4 CPU): việc CPU-bound nhanh nhất ở <strong>4 luồng = 4 lõi</strong>; việc IO-bound (10 ms CPU + 90 ms chờ) <strong>nhanh hơn 8,6 lần</strong> khi đi từ 4 lên 40 luồng — đúng con số Goetz 4 × (1 + 90/10) = 40 — rồi thôi không nhanh thêm vì CPU đã đầy.</p>
<p>Dưới đây cùng chương trình đó chạy trong container của khoá học, bị giới hạn còn <strong>một CPU</strong> (<code>docker run --cpus=1</code>), nên dự đoán trở nên rất đơn giản: CPU-bound — 1 luồng là tốt nhất có thể; IO-bound — Goetz nói 1 × (1 + 90/10) = <strong>10</strong> luồng. Để "10 ms CPU" là thời gian CPU thật (chứ không phải 10 ms đồng hồ treo tường, khoảng mà một luồng bị bóp CPU có thể ngồi chờ không được chạy), tác vụ IO quay vòng theo <code>ThreadMXBean.getCurrentThreadCpuTime()</code>.</p>
<pre><code class="language-java">// Slide 9–10: bao nhiêu luồng? Việc CPU-bound vs IO-bound trên MỘT CPU (container --cpus=1)
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadMXBean;
import java.util.*;
import java.util.concurrent.*;

public class PoolSizing {
    static long cpuWork(int n) {                       // CPU thuần: đếm số nguyên tố dưới n
        long c = 0;
        for (int i = 2; i &lt; n; i++) { boolean p = true;
            for (int j = 2; (long) j * j &lt;= i; j++) if (i % j == 0) { p = false; break; }
            if (p) c++; }
        return c;
    }
    static final ThreadMXBean MX = ManagementFactory.getThreadMXBean();
    static void ioWork() {                             // "một lần gọi DB": 10 ms THỜI GIAN CPU + 90 ms chờ
        long end = MX.getCurrentThreadCpuTime() + 10_000_000; while (MX.getCurrentThreadCpuTime() &lt; end) { }
        try { Thread.sleep(90); } catch (InterruptedException e) { }
    }
    static double once(int threads, int tasks, Runnable job) throws Exception {
        try (ExecutorService pool = Executors.newFixedThreadPool(threads)) {
            long t0 = System.nanoTime();
            List&lt;Future&lt;?&gt;&gt; fs = new ArrayList&lt;&gt;();
            for (int i = 0; i &lt; tasks; i++) fs.add(pool.submit(job));
            for (Future&lt;?&gt; f : fs) f.get();
            return (System.nanoTime() - t0) / 1e9;
        }
    }
    static double best(int threads, int tasks, Runnable job) throws Exception {  // tốt nhất của 2 lần
        return Math.min(once(threads, tasks, job), once(threads, tasks, job));
    }

    public static void main(String[] a) throws Exception {
        int cpus = Runtime.getRuntime().availableProcessors();
        System.out.println("availableProcessors = " + cpus);
        once(cpus, 8, () -&gt; cpuWork(1_500_000));          // khởi động JIT
        System.out.println("CPU-bound: 8 tasks (count primes)");
        for (int t : new int[] { 1, 2, 4, 8 })
            System.out.printf("  pool %2d -&gt; %.2f s%n", t, best(t, 8, () -&gt; cpuWork(1_500_000)));
        System.out.println("IO-bound: 40 tasks x (10 ms CPU + 90 ms wait)   Goetz: " + cpus + " x (1 + 90/10) = " + cpus * 10);
        for (int t : new int[] { 1, 2, 5, 10, 20, 40 })
            System.out.printf("  pool %2d -&gt; %.2f s%n", t, best(t, 40, PoolSizing::ioWork));
    }
}</code></pre>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cpus=1</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out">$ javac PoolSizing.java &amp;&amp; java PoolSizing<br>
availableProcessors = 1<br>
CPU-bound: 8 tasks (count primes)<br>
&nbsp;&nbsp;pool &nbsp;1 -&gt; 1.00 s<br>
&nbsp;&nbsp;pool &nbsp;2 -&gt; 1.00 s<br>
&nbsp;&nbsp;pool &nbsp;4 -&gt; 1.03 s<br>
&nbsp;&nbsp;pool &nbsp;8 -&gt; 1.28 s<br>
IO-bound: 40 tasks x (10 ms CPU + 90 ms wait) &nbsp;&nbsp;Goetz: 1 x (1 + 90/10) = 10<br>
&nbsp;&nbsp;pool &nbsp;1 -&gt; 4.01 s<br>
&nbsp;&nbsp;pool &nbsp;2 -&gt; 2.01 s<br>
&nbsp;&nbsp;pool &nbsp;5 -&gt; 0.81 s<br>
&nbsp;&nbsp;pool 10 -&gt; 0.42 s<br>
&nbsp;&nbsp;pool 20 -&gt; 0.41 s<br>
&nbsp;&nbsp;pool 40 -&gt; 0.49 s</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Đọc output đối chiếu dự đoán. CPU-bound: 1, 2, 4 và 8 luồng đều mất xấp xỉ cùng thời gian — một CPU vẫn là một CPU, luồng thêm chỉ thay phiên nhau. IO-bound: 1 luồng cần 40 × 100 ms ≈ 4 s; 2 luồng giảm một nửa; tới <strong>10 luồng</strong> thời gian tụt xuống dưới nửa giây rồi gần như đứng yên, vì 40 tác vụ × 10 ms CPU = 0,4 s CPU là cái sàn mà không số luồng nào vượt qua được.</p>
<p>Bộ mô phỏng tính cùng thí nghiệm đó chỉ từ mô hình (40 tác vụ, một CPU, hàng đợi FIFO, mỗi luồng giữ suốt tác vụ): 4,00, 2,01, 0,84, 0,49, 0,49, 0,49 s cho pool 1, 2, 5, 10, 20, 40 — lệch lần chạy thật chỉ vài phần trăm giây (lát CPU thật ngắn hơn đơn vị 10 ms tròn của mô hình một chút). Sự khớp đó chính là ý chính: một mô hình đơn giản như vậy đã đủ để chọn cỡ pool trước khi đo.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5918cbcd0fe136fb86fe2b22133c0382e6d70fd0.svg" alt="40 tác vụ IO-bound trên 1 CPU: đường cong phẳng lại đúng ở 10 luồng của Goetz, ngay trên sàn CPU 0,4 s" loading="lazy" /><p class="chu-thich">🧮 40 tác vụ IO-bound trên 1 CPU: đường cong phẳng lại đúng ở 10 luồng của Goetz, ngay trên sàn CPU 0,4 s</p></div>
<table><thead><tr><th>pool</th><th>mô hình</th></tr></thead><tbody><tr><td>1</td><td>4 s</td></tr><tr><td>2</td><td>2.01 s</td></tr><tr><td>5</td><td>0.84 s</td></tr><tr><td>10</td><td>0.49 s</td></tr><tr><td>20</td><td>0.49 s</td></tr><tr><td>40</td><td>0.49 s</td></tr></tbody></table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TASKS = 40, C = 1, W = 9, CORES = 1;              // 1 unit = 10 ms: 10 ms CPU, 90 ms wait, one CPU
const makespan = (p) =&gt; {
  const yc = Array.from({ length: TASKS }, (_, i) =&gt; ({ ten: &#96;T&#36;{i}&#96;, pha: [{ cpu: C }, { wait: W }] }));
  return Math.max(...lichYeuCau({ yeuCau: yc, cho: p, loi: CORES, giu: true }).xong) / 100;   // → seconds
};
const goetz = CORES * (1 + W / C);</code></pre></details>
<p>➕ Sao không dùng luôn 1.000 luồng "cho chắc"? Trong ví dụ nhỏ này 40 luồng chẳng tốn thêm gì, nhưng trên server thật mỗi luồng platform là ~1–2 MB ngăn xếp giữ chỗ, một task của nhân và một mục trong bộ lập lịch; và vượt qua điểm gãy, thêm luồng chỉ làm tăng tranh giành (trên khoá, trên pool DB, trên cache CPU). Luồng ảo (slide sau) đổi phía chi phí của sự đánh đổi này, không đổi phía CPU.</p>
<p class="meo">🧠 Hình dạng cần nhớ: <em>dốc xuống mạnh, gãy ở Ncpu × (1 + W/C), rồi nằm ngang ở sàn CPU</em>. Đo hai điểm ở hai bên điểm gãy là bạn biết cỡ pool của mình.</p>`],
      [11, 'Java 21 virtual threads: how they work',
        `<p class="y-chinh">🎯 A <strong>virtual thread</strong> (JEP 444, final in Java 21) is an ordinary <code>java.lang.Thread</code> that the JVM runs on a small pool of real OS threads called <strong>carriers</strong> (a <code>ForkJoinPool</code> with about one carrier per core). When a virtual thread makes a blocking call, the JVM <strong>unmounts</strong> it — copies its stack frames to the heap — and the carrier picks up another virtual thread. When the I/O completes, the virtual thread is mounted again, on any free carrier.</p>
<p>Look at the picture: eighteen virtual threads, only four of them <em>running</em> (mounted on carriers 1–4); the other fourteen are <em>parked</em> ("zz") — waiting for a database, an HTTP response or a sleep — and hold no OS thread at all, just a few hundred bytes to a few kilobytes of heap. That is why a million virtual threads are fine while a million platform threads are impossible: the cost of a <em>waiting</em> thread moved from "an OS thread with a 2 MB stack" to "a small object the garbage collector knows about".</p>
<p>The JDK made this work by rewriting the blocking parts of its own library — sockets, <code>Thread.sleep</code>, locks from <code>java.util.concurrent</code>, <code>BlockingQueue</code> — so that, on a virtual thread, "block" means "park and unmount" instead of "make a blocking system call". For network I/O the JDK uses a poller thread with <code>epoll</code> underneath (deck CS.4), which is the event-loop idea hidden inside the JVM. Your code does not change: you write the same top-to-bottom blocking style as on slide 6.</p>
<ul>
<li>Create one: <code>Thread.ofVirtual().start(task)</code>, <code>Thread.startVirtualThread(task)</code> or <code>Executors.newVirtualThreadPerTaskExecutor()</code>.</li>
<li><code>Thread.currentThread().isVirtual()</code> tells you; virtual threads have no name by default and are always daemon threads.</li>
<li>Some calls still block the carrier (file I/O on Linux, and on Java 21 waiting inside <code>synchronized</code>) — the JVM may then add a temporary carrier, but the safe rule is in slide 13.</li>
</ul>
<p class="meo">🧠 Virtual threads <em>make waiting cheap; they do not make computing faster</em>. A CPU-bound task on a virtual thread runs at exactly the same speed — and still needs a real core.</p>`,
        `<p class="y-chinh">🎯 <strong>Luồng ảo (virtual thread)</strong> (JEP 444, chính thức từ Java 21) là một <code>java.lang.Thread</code> bình thường mà JVM cho chạy trên một nhóm nhỏ luồng HĐH thật gọi là <strong>carrier</strong> (một <code>ForkJoinPool</code>, khoảng một carrier cho mỗi lõi). Khi luồng ảo gọi một lời gọi chặn, JVM <strong>tháo (unmount)</strong> nó — chép các khung ngăn xếp (stack frame) của nó ra heap — và carrier nhận một luồng ảo khác. Khi I/O xong, luồng ảo được <strong>gắn (mount)</strong> lại, trên bất kỳ carrier nào đang rảnh.</p>
<p>Nhìn hình: mười tám luồng ảo, chỉ bốn cái đang <em>chạy</em> (gắn trên carrier 1–4); mười bốn cái còn lại đang <em>đỗ (parked)</em> ("zz") — chờ cơ sở dữ liệu, chờ phản hồi HTTP hay đang ngủ — và không giữ luồng HĐH nào, chỉ vài trăm byte tới vài kilobyte trên heap. Vì vậy một triệu luồng ảo là bình thường, còn một triệu luồng platform là bất khả: chi phí của một luồng <em>đang chờ</em> đã chuyển từ "một luồng HĐH với ngăn xếp 2 MB" sang "một đối tượng nhỏ mà bộ thu gom rác quản lý".</p>
<p>JDK làm được điều này bằng cách viết lại các phần chặn trong chính thư viện của nó — socket, <code>Thread.sleep</code>, khoá của <code>java.util.concurrent</code>, <code>BlockingQueue</code> — để trên luồng ảo, "chặn" nghĩa là "đỗ rồi tháo" thay vì "gọi một lời gọi hệ thống chặn". Với I/O mạng, JDK dùng một luồng poller với <code>epoll</code> bên dưới (deck CS.4) — chính là ý tưởng event loop được giấu bên trong JVM. Code của bạn không đổi: bạn vẫn viết kiểu chặn từ trên xuống như ở slide 6.</p>
<ul>
<li>Tạo luồng ảo: <code>Thread.ofVirtual().start(task)</code>, <code>Thread.startVirtualThread(task)</code> hoặc <code>Executors.newVirtualThreadPerTaskExecutor()</code>.</li>
<li><code>Thread.currentThread().isVirtual()</code> cho biết; luồng ảo mặc định không có tên và luôn là luồng daemon.</li>
<li>Một số lời gọi vẫn chặn cả carrier (I/O tệp trên Linux, và trên Java 21 là chờ bên trong <code>synchronized</code>) — khi đó JVM có thể thêm tạm một carrier, nhưng luật an toàn nằm ở slide 13.</li>
</ul>
<p class="meo">🧠 Luồng ảo <em>làm việc chờ trở nên rẻ; nó không làm việc tính nhanh hơn</em>. Một tác vụ CPU-bound trên luồng ảo chạy đúng bằng tốc độ cũ — và vẫn cần một lõi thật.</p>`],
      [12, 'Measured: 10,000 tasks that each wait 1 s',
        `<p class="y-chinh">🎯 The example from JEP 444 itself: 10,000 tasks, each <code>Thread.sleep(1 s)</code>. A fixed pool of 200 threads needs about <strong>50 s</strong> (50 waves); one platform thread per task needs a few seconds (creating 10,000 OS threads is slow); one <strong>virtual thread</strong> per task needs about <strong>1 s</strong> — and 100,000 virtual threads only about 1.5 s.</p>
<p>The program runs the same 10,000 sleeps with three executors and then 100,000 sleeps on virtual threads; <code>try (ex)</code> closes each executor, which waits for all its tasks, so the time printed is "until the last task finished".</p>
<pre><code class="language-java">// Slides 11–12: 10,000 tasks that each wait 1 s — the example of JEP 444, three executors
import java.time.Duration;
import java.util.concurrent.*;
import java.util.stream.IntStream;

public class VirtualThreads {
    static void run(String name, ExecutorService ex, int n) {
        long t0 = System.nanoTime();
        try (ex) {                                           // close() waits for every task
            IntStream.range(0, n).forEach(i -&gt; ex.submit(() -&gt; { Thread.sleep(Duration.ofSeconds(1)); return i; }));
        }
        System.out.printf("%-26s %,7d tasks -&gt; %6.2f s%n", name, n, (System.nanoTime() - t0) / 1e9);
    }
    public static void main(String[] a) {
        run("fixed pool, 200 threads", Executors.newFixedThreadPool(200), 10_000);
        run("1 platform thread / task", Executors.newThreadPerTaskExecutor(Thread.ofPlatform().factory()), 10_000);
        run("1 virtual thread / task", Executors.newVirtualThreadPerTaskExecutor(), 10_000);
        run("1 virtual thread / task", Executors.newVirtualThreadPerTaskExecutor(), 100_000);
    }
}</code></pre>
<div class="out">$ javac VirtualThreads.java &amp;&amp; java VirtualThreads<br>
fixed pool, 200 threads &nbsp;&nbsp;&nbsp;&nbsp;10,000 tasks -&gt; &nbsp;50.20 s<br>
1 platform thread / task &nbsp;&nbsp;&nbsp;10,000 tasks -&gt; &nbsp;&nbsp;4.11 s<br>
1 virtual thread / task &nbsp;&nbsp;&nbsp;&nbsp;10,000 tasks -&gt; &nbsp;&nbsp;1.05 s<br>
1 virtual thread / task &nbsp;&nbsp;&nbsp;100,000 tasks -&gt; &nbsp;&nbsp;1.52 s</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Why each number: <strong>fixed pool of 200</strong> — 10,000 ÷ 200 = 50 waves of 1 s, the same arithmetic as slide 7. <strong>Platform thread per task</strong> — no queue, but each task must create, start and later destroy a real thread: a <code>clone()</code> system call, a 2 MB stack mapping, scheduler work. At 10,000 threads those costs add seconds and peak memory. <strong>Virtual thread per task</strong> — creation is an allocation on the heap; sleeping unmounts it; so all 10,000 sleeps really overlap, and the total is the 1 s of sleep plus a little overhead.</p>
<p>The bottom of the slide is the second lesson: platform threads are a <em>limited kernel resource</em>. The next run limits the container to 50 tasks (<code>--pids-limit=50</code>, the cgroup file <code>pids.max</code>), then tries 1,000 platform threads and 10,000 virtual threads.</p>
<pre><code class="language-java">// Slide 12: the container may hold only 50 tasks (cgroup pids.max) — 1,000 platform threads vs 10,000 virtual threads
import java.time.Duration;
import java.util.*;

public class GioiHanLuong {
    public static void main(String[] a) throws Exception {
        System.out.println("pids.max = " + new String(java.nio.file.Files.readAllBytes(java.nio.file.Path.of("/sys/fs/cgroup/pids.max"))).trim());
        List&lt;Thread&gt; ts = new ArrayList&lt;&gt;();
        try {
            for (int i = 0; i &lt; 1000; i++) ts.add(Thread.ofPlatform().start(() -&gt; sleep(2)));
            System.out.println("1000 platform threads started");
        } catch (Throwable e) {
            System.out.println("created " + ts.size() + " platform threads, then: " + e);
        }
        for (Thread t : ts) t.join();
        ts.clear();
        for (int i = 0; i &lt; 10_000; i++) ts.add(Thread.ofVirtual().start(() -&gt; sleep(1)));
        for (Thread t : ts) t.join();
        System.out.println("10000 virtual threads started and finished");
    }
    static void sleep(int s) { try { Thread.sleep(Duration.ofSeconds(s)); } catch (InterruptedException e) { } }
}</code></pre>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--pids-limit=50</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out">$ javac GioiHanLuong.java &amp;&amp; java GioiHanLuong<br>
pids.max = 50<br>
[0.098s][warning][os,thread] Failed to start thread "Unknown thread" - pthread_create failed (EAGAIN) for attributes: stacksize: 2040k, guardsize: 4k, detached.<br>
[0.098s][warning][os,thread] Failed to start the native thread for java.lang.Thread "Thread-31"<br>
created 31 platform threads, then: java.lang.OutOfMemoryError: unable to create native thread: possibly out of memory or process/resource limits reached<br>
10000 virtual threads started and finished</div>
<p>The JVM itself already uses about 20 of the 50 tasks, so after roughly 30 platform threads <code>pthread_create</code> fails with <code>EAGAIN</code> and Java throws <code>OutOfMemoryError: unable to create native thread</code> — a misleading name: memory is fine, the task limit is not. The 10,000 virtual threads run on a handful of carriers and never come near the limit.</p>
<p>🧭 On a real server: "unable to create native thread" in a log almost always means <code>ulimit -u</code> or the container's pids limit (Kubernetes and Docker set one), or a thread leak — a code path that keeps calling <code>new Thread</code> or creates a new <code>ExecutorService</code> per request and never shuts it down. Count with <code>ls /proc/&lt;pid&gt;/task | wc -l</code> over time.</p>
<p class="meo">🧠 Three numbers to remember from this slide: <em>50 s (queueing), seconds (thread creation), 1 s (only the real wait)</em>.</p>`,
        `<p class="y-chinh">🎯 Chính ví dụ của JEP 444: 10.000 tác vụ, mỗi cái <code>Thread.sleep(1 s)</code>. Một pool cố định 200 luồng cần khoảng <strong>50 s</strong> (50 đợt); mỗi tác vụ một luồng platform cần vài giây (tạo 10.000 luồng HĐH rất chậm); mỗi tác vụ một <strong>luồng ảo</strong> cần khoảng <strong>1 s</strong> — và 100.000 luồng ảo chỉ khoảng 1,5 s.</p>
<p>Chương trình chạy cùng 10.000 lần ngủ với ba kiểu executor, rồi 100.000 lần ngủ trên luồng ảo; <code>try (ex)</code> đóng từng executor, tức là chờ mọi tác vụ của nó, nên thời gian in ra là "tới khi tác vụ cuối cùng xong".</p>
<pre><code class="language-java">// Slide 11–12: 10.000 tác vụ, mỗi cái chờ 1 giây — ví dụ của JEP 444, ba kiểu executor
import java.time.Duration;
import java.util.concurrent.*;
import java.util.stream.IntStream;

public class VirtualThreads {
    static void run(String name, ExecutorService ex, int n) {
        long t0 = System.nanoTime();
        try (ex) {                                           // close() chờ mọi tác vụ xong
            IntStream.range(0, n).forEach(i -&gt; ex.submit(() -&gt; { Thread.sleep(Duration.ofSeconds(1)); return i; }));
        }
        System.out.printf("%-26s %,7d tasks -&gt; %6.2f s%n", name, n, (System.nanoTime() - t0) / 1e9);
    }
    public static void main(String[] a) {
        run("fixed pool, 200 threads", Executors.newFixedThreadPool(200), 10_000);
        run("1 platform thread / task", Executors.newThreadPerTaskExecutor(Thread.ofPlatform().factory()), 10_000);
        run("1 virtual thread / task", Executors.newVirtualThreadPerTaskExecutor(), 10_000);
        run("1 virtual thread / task", Executors.newVirtualThreadPerTaskExecutor(), 100_000);
    }
}</code></pre>
<div class="out">$ javac VirtualThreads.java &amp;&amp; java VirtualThreads<br>
fixed pool, 200 threads &nbsp;&nbsp;&nbsp;&nbsp;10,000 tasks -&gt; &nbsp;50.20 s<br>
1 platform thread / task &nbsp;&nbsp;&nbsp;10,000 tasks -&gt; &nbsp;&nbsp;4.11 s<br>
1 virtual thread / task &nbsp;&nbsp;&nbsp;&nbsp;10,000 tasks -&gt; &nbsp;&nbsp;1.05 s<br>
1 virtual thread / task &nbsp;&nbsp;&nbsp;100,000 tasks -&gt; &nbsp;&nbsp;1.52 s</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Vì sao ra từng con số: <strong>pool cố định 200</strong> — 10.000 ÷ 200 = 50 đợt 1 s, cùng phép tính với slide 7. <strong>Mỗi tác vụ một luồng platform</strong> — không có hàng đợi, nhưng mỗi tác vụ phải tạo, khởi động rồi huỷ một luồng thật: một lời gọi hệ thống <code>clone()</code>, một vùng ngăn xếp 2 MB, việc của bộ lập lịch. Với 10.000 luồng, các chi phí đó cộng thêm vài giây và đẩy bộ nhớ lúc cao điểm lên. <strong>Mỗi tác vụ một luồng ảo</strong> — tạo luồng chỉ là một lần cấp phát trên heap; ngủ thì nó được tháo ra; nên cả 10.000 lần ngủ thật sự chồng lên nhau, và tổng thời gian là 1 s ngủ cộng một chút chi phí.</p>
<p>Phần cuối slide là bài học thứ hai: luồng platform là <em>tài nguyên có hạn của nhân</em>. Lần chạy sau giới hạn container còn 50 task (<code>--pids-limit=50</code>, tệp cgroup <code>pids.max</code>), rồi thử 1.000 luồng platform và 10.000 luồng ảo.</p>
<pre><code class="language-java">// Slide 12: container chỉ được giữ 50 task (pids.max của cgroup) — 1.000 luồng platform vs 10.000 luồng ảo
import java.time.Duration;
import java.util.*;

public class GioiHanLuong {
    public static void main(String[] a) throws Exception {
        System.out.println("pids.max = " + new String(java.nio.file.Files.readAllBytes(java.nio.file.Path.of("/sys/fs/cgroup/pids.max"))).trim());
        List&lt;Thread&gt; ts = new ArrayList&lt;&gt;();
        try {
            for (int i = 0; i &lt; 1000; i++) ts.add(Thread.ofPlatform().start(() -&gt; sleep(2)));
            System.out.println("1000 platform threads started");
        } catch (Throwable e) {
            System.out.println("created " + ts.size() + " platform threads, then: " + e);
        }
        for (Thread t : ts) t.join();
        ts.clear();
        for (int i = 0; i &lt; 10_000; i++) ts.add(Thread.ofVirtual().start(() -&gt; sleep(1)));
        for (Thread t : ts) t.join();
        System.out.println("10000 virtual threads started and finished");
    }
    static void sleep(int s) { try { Thread.sleep(Duration.ofSeconds(s)); } catch (InterruptedException e) { } }
}</code></pre>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--pids-limit=50</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out">$ javac GioiHanLuong.java &amp;&amp; java GioiHanLuong<br>
pids.max = 50<br>
[0.098s][warning][os,thread] Failed to start thread "Unknown thread" - pthread_create failed (EAGAIN) for attributes: stacksize: 2040k, guardsize: 4k, detached.<br>
[0.098s][warning][os,thread] Failed to start the native thread for java.lang.Thread "Thread-31"<br>
created 31 platform threads, then: java.lang.OutOfMemoryError: unable to create native thread: possibly out of memory or process/resource limits reached<br>
10000 virtual threads started and finished</div>
<p>Bản thân JVM đã dùng khoảng 20 trong 50 task, nên sau chừng 30 luồng platform, <code>pthread_create</code> thất bại với <code>EAGAIN</code> và Java ném <code>OutOfMemoryError: unable to create native thread</code> — một cái tên dễ hiểu lầm: bộ nhớ vẫn ổn, cái hết là giới hạn task. 10.000 luồng ảo chạy trên vài carrier nên không bao giờ chạm giới hạn.</p>
<p>🧭 Trên server thật: "unable to create native thread" trong log gần như luôn nghĩa là <code>ulimit -u</code> hoặc giới hạn pids của container (Kubernetes và Docker đều đặt), hoặc rò luồng — một nhánh code cứ gọi <code>new Thread</code> hay tạo một <code>ExecutorService</code> mới cho mỗi request mà không bao giờ tắt. Đếm theo thời gian bằng <code>ls /proc/&lt;pid&gt;/task | wc -l</code>.</p>
<p class="meo">🧠 Ba con số cần nhớ của slide này: <em>50 s (xếp hàng), vài giây (tạo luồng), 1 s (chỉ còn phần chờ thật)</em>.</p>`],
      [13, 'Virtual threads: traps before you switch them on',
        `<p class="y-chinh">🎯 Four mistakes and their fixes. Virtual threads do <strong>not</strong> speed up CPU-bound work; blocking inside <code>synchronized</code> <strong>pins</strong> the carrier on Java 21; putting virtual threads into a pool of 200 brings the old limit back; and 10,000 virtual threads still share the same small <strong>DB connection pool</strong>. In Spring Boot 3.2+ and 4 the switch is one property, <code>spring.threads.virtual.enabled=true</code>.</p>
<ul>
<li><strong>"Faster code".</strong> A virtual thread computing a hash runs on a carrier exactly like a platform thread would. With 8 carriers, 8 CPU-heavy virtual threads occupy all carriers and every other virtual thread waits. Keep CPU-heavy work on a small fixed pool sized to the cores (slide 9).</li>
<li><strong>Pinning.</strong> On Java 21–23, a virtual thread that blocks while holding a monitor (<code>synchronized</code> block or method) cannot unmount: it stays <em>pinned</em> to its carrier, which then sits idle. A few pinned threads on an 8-carrier pool can stall the whole application. Fix on Java 21: use <code>java.util.concurrent.locks.ReentrantLock</code> around blocking calls, and run with <code>-Djdk.tracePinnedThreads=full</code> (21–23) to find pins. <strong>JDK 24</strong> (JEP 491, "Synchronize Virtual Threads without Pinning") removed pinning for <code>synchronized</code>; native frames and class initialisers can still pin.</li>
<li><strong>Pooling virtual threads.</strong> <code>Executors.newFixedThreadPool(200, Thread.ofVirtual().factory())</code> creates 200 virtual threads and a queue — the same 50-wave behaviour as slide 12. Virtual threads are cheap; create one per task.</li>
<li><strong>The real scarce resource.</strong> 10,000 requests on virtual threads that all query PostgreSQL through HikariCP (default <code>maximumPoolSize</code> 10) means 9,990 of them wait for a connection — now in Hikari's queue instead of Tomcat's. Limit what is really scarce: the DB pool, or a <code>Semaphore</code> in front of a rate-limited API.</li>
</ul>
<p>➕ Two more practical notes: <code>ThreadLocal</code> still works, but a cache stored in a <code>ThreadLocal</code> is now created per request (millions of copies) instead of per pool thread; and thread dumps of virtual threads come from <code>jcmd &lt;pid&gt; Thread.dump_to_file -format=json file.json</code>, because the classic <code>jstack</code> lists only platform threads.</p>
<p class="meo">🧠 Decision rule: <em>IO-bound request handling → virtual threads; CPU-bound work → a fixed pool of ≈ cores; and always cap the resource behind the threads.</em></p>`,
        `<p class="y-chinh">🎯 Bốn sai lầm và cách sửa. Luồng ảo <strong>không</strong> làm việc CPU-bound nhanh hơn; chặn bên trong <code>synchronized</code> làm <strong>ghim (pin)</strong> carrier trên Java 21; nhét luồng ảo vào một pool 200 là đem giới hạn cũ trở lại; và 10.000 luồng ảo vẫn dùng chung một <strong>pool kết nối DB</strong> nhỏ xíu. Ở Spring Boot 3.2+ và 4, công tắc chỉ là một thuộc tính: <code>spring.threads.virtual.enabled=true</code>.</p>
<ul>
<li><strong>"Code nhanh hơn".</strong> Một luồng ảo đang tính một hàm băm chạy trên carrier y như một luồng platform. Với 8 carrier, 8 luồng ảo nặng CPU chiếm hết carrier và mọi luồng ảo khác phải chờ. Hãy để việc nặng CPU trên một pool cố định nhỏ cỡ bằng số lõi (slide 9).</li>
<li><strong>Ghim (pinning).</strong> Trên Java 21–23, một luồng ảo bị chặn trong lúc giữ monitor (khối hoặc phương thức <code>synchronized</code>) không tháo ra được: nó bị <em>ghim</em> vào carrier, và carrier đó đứng không. Vài luồng bị ghim trên một pool 8 carrier có thể làm cả ứng dụng đứng. Cách sửa trên Java 21: dùng <code>java.util.concurrent.locks.ReentrantLock</code> bọc các lời gọi chặn, và chạy với <code>-Djdk.tracePinnedThreads=full</code> (21–23) để tìm chỗ bị ghim. <strong>JDK 24</strong> (JEP 491, "Synchronize Virtual Threads without Pinning") đã bỏ việc ghim với <code>synchronized</code>; khung native và bộ khởi tạo lớp vẫn có thể ghim.</li>
<li><strong>Gom luồng ảo vào pool.</strong> <code>Executors.newFixedThreadPool(200, Thread.ofVirtual().factory())</code> tạo 200 luồng ảo và một hàng đợi — lại đúng kiểu 50 đợt của slide 12. Luồng ảo rẻ; hãy tạo mỗi tác vụ một cái.</li>
<li><strong>Tài nguyên khan hiếm thật.</strong> 10.000 request trên luồng ảo cùng truy vấn PostgreSQL qua HikariCP (mặc định <code>maximumPoolSize</code> 10) nghĩa là 9.990 request chờ kết nối — giờ xếp hàng ở Hikari thay vì ở Tomcat. Hãy giới hạn thứ thật sự khan hiếm: pool DB, hoặc một <code>Semaphore</code> đứng trước một API bị giới hạn tốc độ.</li>
</ul>
<p>➕ Thêm hai lưu ý thực tế: <code>ThreadLocal</code> vẫn chạy, nhưng một bộ đệm đặt trong <code>ThreadLocal</code> giờ bị tạo cho mỗi request (hàng triệu bản) thay vì cho mỗi luồng của pool; và thread dump của luồng ảo lấy bằng <code>jcmd &lt;pid&gt; Thread.dump_to_file -format=json file.json</code>, vì <code>jstack</code> cổ điển chỉ liệt kê luồng platform.</p>
<p class="meo">🧠 Luật quyết định: <em>xử lý request IO-bound → luồng ảo; việc CPU-bound → pool cố định ≈ số lõi; và luôn chặn trần tài nguyên đứng sau các luồng.</em></p>`],
    ]),
    books([
      ['ostep', 'Chapters 26–27 (threads, the thread API) and 33 "Event-based Concurrency (Advanced)" — the select/poll loop and why blocking calls break it', 'Chương 26–27 (luồng, API luồng) và 33 "Event-based Concurrency (Advanced)" — vòng lặp select/poll và vì sao lời gọi chặn phá hỏng nó'],
      ['mos4', 'Chapter 2, sections 2.2 (threads: the one-to-one model, user-space vs kernel threads) and 2.4 (scheduling) — the school concepts behind this deck', 'Chương 2, mục 2.2 (luồng: mô hình một–một, luồng không gian người dùng vs luồng nhân) và 2.4 (lập lịch) — khái niệm của trường đứng sau bộ slide này'],
      ['man7', 'pthread_create(3) (EAGAIN when the thread limit is reached), clone(2) (threads share memory with CLONE_VM), proc(5) (/proc/pid/task), listen(2) (backlog)', 'pthread_create(3) (EAGAIN khi chạm giới hạn luồng), clone(2) (luồng dùng chung bộ nhớ với CLONE_VM), proc(5) (/proc/pid/task), listen(2) (backlog)'],
      ['kernelDocs', 'Documentation/admin-guide/cgroup-v2.rst — the pids controller (pids.max) that limits threads in a container', 'Documentation/admin-guide/cgroup-v2.rst — bộ điều khiển pids (pids.max) giới hạn số luồng trong container'],
    ]),
  ].join('\n'),
};

/* ───────── ⭐ CS.3 — 📑 Slide by slide · Threads in backend (2): event loop, libuv pool, races, deadlocks (slides 14–28) ───────── */
const L_cs3_2 = {
  title: '⭐ CS.3 — 📑 Slide by slide · Threads in backend (2): event loop, libuv pool, races, deadlocks (slides 14–28)|||⭐ CS.3 — 📑 Học theo từng slide · Luồng trong backend (2): event loop, pool libuv, tranh chấp, bế tắc (slide 14–28)',
  slug: 'osg202-slide-cs3-2',
  type: 'VIDEO',
  description: 'Giảng từng slide 14–28 của deck tự dựng ⭐ Chuyên sâu 3 (ngoài giáo trình, không thi FE): một tiến trình Node có bao nhiêu luồng thật, sáu pha của event loop chạy từng bước bằng bộ mô phỏng, thứ tự in thật của nextTick, promise, setTimeout và setImmediate, thread pool 4 luồng của libuv đo bằng pbkdf2, một request nặng CPU làm đứng cả server và cách chuyển sang worker_threads, tranh chấp count++ trong Java, bế tắc thật nhìn bằng jstack, cập nhật bị mất trong cơ sở dữ liệu, bảng chọn mô hình, hai sự cố thật (đăng nhập băm mật khẩu trên event loop của chính web này, hàng đợi accept tràn), câu hỏi phỏng vấn và tự kiểm tra.',
  content: [
    bi(`<span class="eyebrow">⭐ Advanced 3 · Lesson CS.3 (part 2) · self-made deck "Threads in backend", slides 14–28</span>
<h2>One thread for everybody: the Node.js event loop — and the bugs every threading model shares</h2>
<p class="lead">Part 1 showed the Java answer to "many users at once": many threads, then cheap virtual threads. Part 2 starts with the opposite answer, Node.js: your JavaScript runs on <em>one</em> thread, an event loop with six phases, while the kernel and a small libuv thread pool do the waiting (slides 14–17). That design is fast and simple until somebody does CPU work on the loop (18–19). Then the deck turns to the bugs that every model shares — a race on a counter, a deadlock between two locks, a lost update in the database (20–22) — and ends with a comparison, two incidents from real servers, interview questions and a self-check (23–28).</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>14–16</td><td>Node threads, the six phases, micro- vs macrotasks</td><td>count a Node process's threads and predict the printing order of nextTick, promises, timers and setImmediate</td></tr>
<tr><td>17</td><td>the libuv thread pool</td><td>say which APIs use the pool of 4 and see the "two waves" of pbkdf2</td></tr>
<tr><td>18–19</td><td>blocking the event loop</td><td>measure a frozen server and fix it with worker_threads</td></tr>
<tr><td>20–22</td><td>race, deadlock, lost update</td><td>reproduce each one, read the evidence (counts, jstack, stock) and apply the fix</td></tr>
<tr><td>23–28</td><td>comparison, real incidents, interview, self-check</td><td>choose a model, diagnose the two incidents and answer the usual questions</td></tr>
</tbody>
</table>
<div class="callout">⭐ Outside the OSG202 syllabus, not examined in the FE. Programs run in the course's Linux container; timing results are one real run on a busy machine, so the lesson always states which ratio or pattern must hold.</div>`,
    `<span class="eyebrow">⭐ Chuyên sâu 3 · Bài CS.3 (phần 2) · deck tự dựng "Threads in backend", slide 14–28</span>
<h2>Một luồng cho tất cả: event loop của Node.js — và những lỗi mà mọi mô hình luồng đều có</h2>
<p class="lead">Phần 1 cho thấy câu trả lời của Java cho bài toán "nhiều người dùng cùng lúc": nhiều luồng, rồi luồng ảo rẻ. Phần 2 bắt đầu bằng câu trả lời ngược lại, Node.js: JavaScript của bạn chạy trên <em>một</em> luồng, một event loop có sáu pha, còn nhân (kernel) và một thread pool nhỏ của libuv lo việc chờ (slide 14–17). Thiết kế đó nhanh và gọn cho tới khi có người làm việc nặng CPU trên loop (18–19). Sau đó bộ slide quay sang những lỗi mà mô hình nào cũng có — tranh chấp trên một biến đếm, bế tắc giữa hai khoá, cập nhật bị mất trong cơ sở dữ liệu (20–22) — và kết thúc bằng bảng so sánh, hai sự cố từ server thật, câu hỏi phỏng vấn và phần tự kiểm tra (23–28).</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>14–16</td><td>luồng của Node, sáu pha, micro- vs macrotask</td><td>đếm luồng của một tiến trình Node và đoán trước thứ tự in của nextTick, promise, timer và setImmediate</td></tr>
<tr><td>17</td><td>thread pool của libuv</td><td>nói được API nào dùng pool 4 luồng và thấy "hai đợt" của pbkdf2</td></tr>
<tr><td>18–19</td><td>chặn event loop</td><td>đo một server bị đứng và sửa bằng worker_threads</td></tr>
<tr><td>20–22</td><td>tranh chấp, bế tắc, lost update</td><td>dựng lại từng lỗi, đọc bằng chứng (số đếm, jstack, tồn kho) và áp cách sửa</td></tr>
<tr><td>23–28</td><td>so sánh, sự cố thật, phỏng vấn, tự kiểm tra</td><td>chọn mô hình, chẩn đoán hai sự cố và trả lời các câu hỏi quen thuộc</td></tr>
</tbody>
</table>
<div class="callout">⭐ Ngoài giáo trình OSG202, không thi FE. Các chương trình chạy trong container Linux của khoá học; kết quả đo thời gian là một lần chạy thật trên một máy đang bận, nên bài luôn nói rõ tỉ lệ hay quy luật nào bắt buộc phải đúng.</div>`),
    walkHead('cs3', 14, 28),
    walk('cs3', [
      [14, 'Model 2: Node.js — “single-threaded”?',
        `<p class="y-chinh">🎯 "Node.js is single-threaded" is half true: <strong>your JavaScript</strong> runs on one thread, the event loop. The <em>process</em> has more: right after start a Node 22 process has 7 Linux threads, and after the first file-system call 11 — the four extra ones are the <strong>libuv thread pool</strong> (<code>libuv-worker</code>), created on first use. Sockets never use that pool: waiting for the network is done by the kernel through <code>epoll</code>.</p>
<p>The picture splits the process into three parts. On the left, the <strong>main thread</strong> runs the event loop and every line of your JavaScript — your route handlers, your <code>await</code> continuations, your JSON parsing — <em>one callback at a time</em>. In the middle, two helpers do the waiting: the <strong>kernel's epoll</strong> for sockets and timers ("wake me when this connection has data"), which needs no extra thread at all; and the <strong>libuv thread pool</strong> for things the kernel cannot do asynchronously in a portable way — file-system calls, <code>dns.lookup</code>, CPU-heavy crypto and zlib. On the right, threads you never touch: V8's background workers for garbage collection and the optimising compiler.</p>
<p>The run counts the real threads by reading <code>/proc/self/task/*/comm</code> from inside Node:</p>
<div class="out"># Slide 14: "Node is single-threaded"? Count the threads of the process<br>
$ node _dem-luong.js<br>
at start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 7 threads -&gt; DelayedTaskSche x1, node x6<br>
after fs.readFile: 11 threads -&gt; DelayedTaskSche x1, libuv-worker x4, node x6<br>
$ UV_THREADPOOL_SIZE=8 node _dem-luong.js<br>
at start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 7 threads -&gt; DelayedTaskSche x1, node x6<br>
after fs.readFile: 15 threads -&gt; DelayedTaskSche x1, libuv-worker x8, node x6<br>
# V8's own worker threads: --v8-pool-size (default 4)<br>
$ node --v8-pool-size=2 _dem-luong.js<br>
at start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 5 threads -&gt; DelayedTaskSche x1, node x4<br>
after fs.readFile: 9 threads -&gt; DelayedTaskSche x1, libuv-worker x4, node x4</div>
<p>Read it line by line. At start: 6 threads named <code>node</code> (the main thread, four V8 platform workers and one internal helper) plus <code>DelayedTaskScheduler</code>. After <code>fs.readFile</code>: four <code>libuv-worker</code> threads appear. With <code>UV_THREADPOOL_SIZE=8</code> there are eight. With <code>--v8-pool-size=2</code> two of the <code>node</code> threads disappear — proof that those are V8's own workers, not yours.</p>
<p>➕ From the libuv documentation: the pool's default size is 4, it can be changed with the environment variable <code>UV_THREADPOOL_SIZE</code> at start-up (the pool is created on first use, so setting it later from inside the program is too late), and the absolute maximum is 1024. libuv uses it for all file-system operations and for <code>getaddrinfo</code>/<code>getnameinfo</code>.</p>
<p class="meo">🧠 One sentence: <em>Node = one JavaScript thread + the kernel for network waits + 4 helper threads for files, DNS lookups and crypto</em>. All the parallelism you get without worker_threads is in the last two parts.</p>`,
        `<p class="y-chinh">🎯 "Node.js đơn luồng" chỉ đúng một nửa: <strong>JavaScript của bạn</strong> chạy trên một luồng, chính là event loop. Còn <em>tiến trình</em> thì có nhiều hơn: vừa khởi động, một tiến trình Node 22 có 7 luồng Linux, và sau lời gọi hệ thống tệp đầu tiên là 11 — bốn luồng thêm vào là <strong>thread pool của libuv</strong> (<code>libuv-worker</code>), được tạo ở lần dùng đầu tiên. Socket không bao giờ dùng pool đó: việc chờ mạng do nhân lo qua <code>epoll</code>.</p>
<p>Hình chia tiến trình thành ba phần. Bên trái, <strong>luồng chính</strong> chạy event loop và từng dòng JavaScript của bạn — các handler của route, phần tiếp theo sau mỗi <code>await</code>, việc phân tích JSON — <em>mỗi lần một callback</em>. Ở giữa, hai trợ thủ lo phần chờ: <strong>epoll của nhân</strong> cho socket và timer ("đánh thức tôi khi kết nối này có dữ liệu"), hoàn toàn không cần thêm luồng; và <strong>thread pool của libuv</strong> cho những thứ nhân không làm bất đồng bộ được một cách di động (portable) — lời gọi hệ thống tệp, <code>dns.lookup</code>, mật mã và nén zlib nặng CPU. Bên phải là những luồng bạn không bao giờ đụng tới: các luồng nền của V8 cho thu gom rác và trình biên dịch tối ưu.</p>
<p>Lần chạy dưới đây đếm luồng thật bằng cách đọc <code>/proc/self/task/*/comm</code> từ bên trong Node:</p>
<div class="out"># Slide 14: "Node đơn luồng"? Đếm luồng của tiến trình<br>
$ node _dem-luong.js<br>
at start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 7 threads -&gt; DelayedTaskSche x1, node x6<br>
after fs.readFile: 11 threads -&gt; DelayedTaskSche x1, libuv-worker x4, node x6<br>
$ UV_THREADPOOL_SIZE=8 node _dem-luong.js<br>
at start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 7 threads -&gt; DelayedTaskSche x1, node x6<br>
after fs.readFile: 15 threads -&gt; DelayedTaskSche x1, libuv-worker x8, node x6<br>
# Luồng phụ của chính V8: --v8-pool-size (mặc định 4)<br>
$ node --v8-pool-size=2 _dem-luong.js<br>
at start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 5 threads -&gt; DelayedTaskSche x1, node x4<br>
after fs.readFile: 9 threads -&gt; DelayedTaskSche x1, libuv-worker x4, node x4</div>
<p>Đọc từng dòng. Lúc khởi động: 6 luồng tên <code>node</code> (luồng chính, bốn luồng nền của V8 và một luồng phụ nội bộ) cộng <code>DelayedTaskScheduler</code>. Sau <code>fs.readFile</code>: bốn luồng <code>libuv-worker</code> xuất hiện. Với <code>UV_THREADPOOL_SIZE=8</code> thì có tám. Với <code>--v8-pool-size=2</code>, hai luồng <code>node</code> biến mất — bằng chứng đó là luồng riêng của V8, không phải của bạn.</p>
<p>➕ Theo tài liệu libuv: pool mặc định có 4 luồng, đổi được bằng biến môi trường <code>UV_THREADPOOL_SIZE</code> lúc khởi động (pool được tạo ở lần dùng đầu, nên đặt muộn từ bên trong chương trình là đã trễ), và tối đa tuyệt đối là 1024. libuv dùng nó cho mọi thao tác hệ thống tệp và cho <code>getaddrinfo</code>/<code>getnameinfo</code>.</p>
<p class="meo">🧠 Một câu: <em>Node = một luồng JavaScript + nhân lo phần chờ mạng + 4 luồng phụ cho tệp, tra DNS và mật mã</em>. Mọi sự song song bạn có được khi không dùng worker_threads nằm ở hai phần sau.</p>`],
      [15, 'The event loop: 6 phases in one turn',
        `<p class="y-chinh">🎯 One turn of the event loop visits six phases in order: <strong>1 timers</strong> (expired <code>setTimeout</code>/<code>setInterval</code> callbacks), 2 pending callbacks (some deferred TCP errors), 3 idle/prepare (internal), <strong>4 poll</strong> (I/O results; the loop waits here when there is nothing else to do), <strong>5 check</strong> (<code>setImmediate</code> callbacks), 6 close callbacks (<code>socket.on('close')</code>). After <em>every</em> callback, Node empties the <code>process.nextTick</code> queue and then the microtask queue (promises, <code>await</code> continuations, <code>queueMicrotask</code>).</p>
<p>Each phase has its own queue of callbacks. When the loop enters a phase it runs the callbacks queued there (with a limit, so one phase cannot starve the others), then moves to the next phase. The poll phase is special: it retrieves new I/O events from the kernel and runs their callbacks; if the check queue is empty and no timer is due, the loop <em>blocks in poll</em> — inside <code>epoll_wait</code> — until something happens or the next timer is due. A Node server at rest spends almost all its time there, at 0 % CPU.</p>
<p>Two words from the slide's box: a <strong>macrotask</strong> is any callback that lives in one of the phase queues (a timer, an I/O completion, an immediate, a close); a <strong>microtask</strong> is a promise job or a <code>queueMicrotask</code> callback. <code>process.nextTick</code> is not technically part of the event loop at all — the Node documentation says its queue is processed "after the current operation completes, regardless of the current phase" — and it runs even before promise microtasks.</p>
<p>➕ The simulator replays the phases for the program of the next slide. Each column is one callback, in the order Node runs it; the row is where it came from. Here the loop reached the timers phase <em>after</em> the 1 ms of <code>setTimeout(…, 0)</code> had passed:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4c1378820c2b8aa77deb17f4c4336f1613e41c4c.svg" alt="Main module, slow start: sync code, nextTick, two microtasks, then the timer (phase 1), then setImmediate (phase 5)" loading="lazy" /><p class="chu-thich">🧮 Main module, slow start: sync code, nextTick, two microtasks, then the timer (phase 1), then setImmediate (phase 5)</p></div>
<ol><li><code>start</code> — main script → <code>sync: start</code></li><li><code>end</code> — main script → <code>sync: end</code></li><li><code>tick</code> — process.nextTick → <code>nextTick</code></li><li><code>then</code> — microtasks → <code>microtask: promise.then</code></li><li><code>qMicro</code> — microtasks → <code>microtask: queueMicrotask</code></li><li><code>timeout</code> — 1 timers → <code>macrotask: setTimeout 0</code></li><li><code>immed</code> — 5 check → <code>macrotask: setImmediate</code></li></ol>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const PHA = ['main', 'tick', 'micro', 'timers', 'poll', 'check'];
function chay(kichBan, batDau) {
  const buoc = [];                                    // [{ pha, nhan, in }]
  const tick = [], micro = [], timers = [], imm = [], io = [];
  let gio = 0, pha = 'main';
  const api = {
    log: (nhan, s) =&gt; buoc.push({ pha, nhan, in: s }),
    setTimeout: (f) =&gt; timers.push({ chin: gio + 1, f }),        // setTimeout(f, 0) is really 1 ms
    setImmediate: (f) =&gt; imm.push(f),
    then: (f) =&gt; micro.push(f), queueMicrotask: (f) =&gt; micro.push(f),
    nextTick: (f) =&gt; tick.push(f),
    readFile: (f) =&gt; io.push(f),                                  // completes in the first poll phase
  };
  const goi = (p, f) =&gt; { pha = p; f(api); xa(); };
  const xa = () =&gt; {                                              // drain nextTick, then microtasks, until both empty
    while (tick.length || micro.length) {
      while (tick.length) { pha = 'tick'; tick.shift()(api); }
      while (micro.length &amp;&amp; !tick.length) { pha = 'micro'; micro.shift()(api); }
    }
  };
  goi('main', kichBan);
  gio = batDau;                                                   // ms elapsed when the loop first reaches "timers"
  for (let vong = 0; vong &lt; 10 &amp;&amp; (timers.length || imm.length || io.length); vong++) {
    for (const tm of timers.filter((x) =&gt; x.chin &lt;= gio)) { timers.splice(timers.indexOf(tm), 1); goi('timers', tm.f); }
    for (const f of io.splice(0)) goi('poll', f);
    for (const f of imm.splice(0)) goi('check', f);               // only the ones queued before this check phase
    gio += 1;                                                     // the poll phase waited for the next timer
  }
  return buoc;
}
const KB = {
  a: (api) =&gt; {
    api.log('start', 'sync: start');
    api.setTimeout((a) =&gt; a.log('timeout', 'macrotask: setTimeout 0'));
    api.setImmediate((a) =&gt; a.log('immed', 'macrotask: setImmediate'));
    api.then((a) =&gt; a.log('then', 'microtask: promise.then'));
    api.queueMicrotask((a) =&gt; a.log('qMicro', 'microtask: queueMicrotask'));
    api.nextTick((a) =&gt; a.log('tick', 'nextTick'));
    api.log('end', 'sync: end');
  },
  b: (api) =&gt; {
    api.setTimeout((a) =&gt; { a.log('T1', 'timer 1'); a.then((b) =&gt; b.log('p1', '  promise inside timer 1')); });
    api.setTimeout((a) =&gt; { a.log('T2', 'timer 2'); a.then((b) =&gt; b.log('p2', '  promise inside timer 2')); });
  },
  c: (api) =&gt; api.readFile((a) =&gt; {
    a.log('read', '(readFile callback)');
    a.setTimeout((b) =&gt; b.log('timeout', 'setTimeout 0'));
    a.setImmediate((b) =&gt; b.log('immed', 'setImmediate'));
  }),
};</code></pre></details>
<p class="pitfall">⚠️ Recursive <code>process.nextTick</code> (or a promise chain that keeps scheduling promises) starves the loop: the queue never empties, so the loop never reaches the poll phase and no I/O is handled. The Node documentation recommends <code>setImmediate</code> for "do this later" because it always yields to I/O first.</p>
<p class="meo">🧠 Memorise the order as <em>T-P-I-P-C-C</em> and the rule "after every callback: ticks, then promises". The three phases you meet daily are <strong>timers</strong>, <strong>poll</strong> and <strong>check</strong>.</p>`,
        `<p class="y-chinh">🎯 Một vòng của event loop đi qua sáu pha theo thứ tự: <strong>1 timers</strong> (callback của <code>setTimeout</code>/<code>setInterval</code> đã tới hạn), 2 pending callbacks (một số lỗi TCP bị hoãn), 3 idle/prepare (nội bộ), <strong>4 poll</strong> (kết quả I/O; loop đứng chờ ở đây khi không còn việc gì khác), <strong>5 check</strong> (callback của <code>setImmediate</code>), 6 close callbacks (<code>socket.on('close')</code>). Sau <em>mỗi</em> callback, Node xả sạch hàng <code>process.nextTick</code> rồi tới hàng microtask (promise, phần tiếp sau <code>await</code>, <code>queueMicrotask</code>).</p>
<p>Mỗi pha có hàng đợi callback riêng. Khi loop vào một pha, nó chạy các callback đang chờ ở đó (có giới hạn, để một pha không bỏ đói các pha khác), rồi sang pha tiếp theo. Pha poll đặc biệt: nó lấy các sự kiện I/O mới từ nhân và chạy callback của chúng; nếu hàng check rỗng và chưa timer nào tới hạn, loop <em>chặn ở poll</em> — bên trong <code>epoll_wait</code> — tới khi có chuyện gì xảy ra hoặc timer kế tiếp tới hạn. Một server Node lúc rảnh dành gần như toàn bộ thời gian ở đó, với 0 % CPU.</p>
<p>Hai từ trong ô của slide: <strong>macrotask</strong> là mọi callback nằm trong một hàng đợi của pha (timer, I/O xong, immediate, close); <strong>microtask</strong> là một việc của promise hoặc callback của <code>queueMicrotask</code>. <code>process.nextTick</code> về kỹ thuật không thuộc event loop — tài liệu Node nói hàng của nó được xử lý "sau khi thao tác hiện tại xong, bất kể đang ở pha nào" — và nó chạy trước cả microtask của promise.</p>
<p>➕ Bộ mô phỏng diễn lại các pha cho chương trình của slide sau. Mỗi cột là một callback, theo thứ tự Node chạy; hàng cho biết nó đến từ đâu. Ở đây loop chạm pha timers <em>sau khi</em> 1 ms của <code>setTimeout(…, 0)</code> đã trôi qua:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9ca78a81f2e83652ab2df8aa17f0b1477c20c052.svg" alt="Module chính, khởi động chậm: code đồng bộ, nextTick, hai microtask, rồi timer (pha 1), rồi setImmediate (pha 5)" loading="lazy" /><p class="chu-thich">🧮 Module chính, khởi động chậm: code đồng bộ, nextTick, hai microtask, rồi timer (pha 1), rồi setImmediate (pha 5)</p></div>
<ol><li><code>start</code> — code đồng bộ → <code>sync: start</code></li><li><code>end</code> — code đồng bộ → <code>sync: end</code></li><li><code>tick</code> — process.nextTick → <code>nextTick</code></li><li><code>then</code> — microtask → <code>microtask: promise.then</code></li><li><code>qMicro</code> — microtask → <code>microtask: queueMicrotask</code></li><li><code>timeout</code> — 1 timers → <code>macrotask: setTimeout 0</code></li><li><code>immed</code> — 5 check → <code>macrotask: setImmediate</code></li></ol>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const PHA = ['main', 'tick', 'micro', 'timers', 'poll', 'check'];
function chay(kichBan, batDau) {
  const buoc = [];                                    // [{ pha, nhan, in }]
  const tick = [], micro = [], timers = [], imm = [], io = [];
  let gio = 0, pha = 'main';
  const api = {
    log: (nhan, s) =&gt; buoc.push({ pha, nhan, in: s }),
    setTimeout: (f) =&gt; timers.push({ chin: gio + 1, f }),        // setTimeout(f, 0) is really 1 ms
    setImmediate: (f) =&gt; imm.push(f),
    then: (f) =&gt; micro.push(f), queueMicrotask: (f) =&gt; micro.push(f),
    nextTick: (f) =&gt; tick.push(f),
    readFile: (f) =&gt; io.push(f),                                  // completes in the first poll phase
  };
  const goi = (p, f) =&gt; { pha = p; f(api); xa(); };
  const xa = () =&gt; {                                              // drain nextTick, then microtasks, until both empty
    while (tick.length || micro.length) {
      while (tick.length) { pha = 'tick'; tick.shift()(api); }
      while (micro.length &amp;&amp; !tick.length) { pha = 'micro'; micro.shift()(api); }
    }
  };
  goi('main', kichBan);
  gio = batDau;                                                   // ms elapsed when the loop first reaches "timers"
  for (let vong = 0; vong &lt; 10 &amp;&amp; (timers.length || imm.length || io.length); vong++) {
    for (const tm of timers.filter((x) =&gt; x.chin &lt;= gio)) { timers.splice(timers.indexOf(tm), 1); goi('timers', tm.f); }
    for (const f of io.splice(0)) goi('poll', f);
    for (const f of imm.splice(0)) goi('check', f);               // only the ones queued before this check phase
    gio += 1;                                                     // the poll phase waited for the next timer
  }
  return buoc;
}
const KB = {
  a: (api) =&gt; {
    api.log('start', 'sync: start');
    api.setTimeout((a) =&gt; a.log('timeout', 'macrotask: setTimeout 0'));
    api.setImmediate((a) =&gt; a.log('immed', 'macrotask: setImmediate'));
    api.then((a) =&gt; a.log('then', 'microtask: promise.then'));
    api.queueMicrotask((a) =&gt; a.log('qMicro', 'microtask: queueMicrotask'));
    api.nextTick((a) =&gt; a.log('tick', 'nextTick'));
    api.log('end', 'sync: end');
  },
  b: (api) =&gt; {
    api.setTimeout((a) =&gt; { a.log('T1', 'timer 1'); a.then((b) =&gt; b.log('p1', '  promise inside timer 1')); });
    api.setTimeout((a) =&gt; { a.log('T2', 'timer 2'); a.then((b) =&gt; b.log('p2', '  promise inside timer 2')); });
  },
  c: (api) =&gt; api.readFile((a) =&gt; {
    a.log('read', '(readFile callback)');
    a.setTimeout((b) =&gt; b.log('timeout', 'setTimeout 0'));
    a.setImmediate((b) =&gt; b.log('immed', 'setImmediate'));
  }),
};</code></pre></details>
<p class="pitfall">⚠️ Gọi <code>process.nextTick</code> đệ quy (hoặc một chuỗi promise cứ hẹn thêm promise) sẽ bỏ đói loop: hàng không bao giờ rỗng, nên loop không bao giờ tới pha poll và không I/O nào được xử lý. Tài liệu Node khuyên dùng <code>setImmediate</code> cho việc "để lát nữa làm", vì nó luôn nhường I/O trước.</p>
<p class="meo">🧠 Thuộc thứ tự <em>T-P-I-P-C-C</em> và luật "sau mỗi callback: tick, rồi promise". Ba pha bạn gặp hằng ngày là <strong>timers</strong>, <strong>poll</strong> và <strong>check</strong>.</p>`],
      [16, 'Microtask vs macrotask: the real printing order',
        `<p class="y-chinh">🎯 The real order: <strong>synchronous code → <code>process.nextTick</code> → promise microtasks → macrotasks by phase</strong>. In the main module, <code>setTimeout(f, 0)</code> versus <code>setImmediate(g)</code> is <strong>random</strong> (it depends on whether 1 ms has passed when the loop starts); inside an I/O callback <code>setImmediate</code> always wins. And microtasks run <em>between</em> two timer callbacks, not after all of them.</p>
<p>The program has three parts, run as <code>node _thu-tu.js A|B|C</code>. Part A schedules one of everything from the main module. Part B schedules two timers, each of which schedules a promise. Part C calls <code>fs.readFile</code> and, inside its callback, schedules a timeout and an immediate. Then part A and part C are each run 200 times to count which macrotask wins:</p>
<div class="out"># Slide 16: the real printing order — sync, nextTick, promises, then macrotasks<br>
$ node _thu-tu.js A<br>
sync: start<br>
sync: end<br>
nextTick<br>
microtask: promise.then<br>
microtask: queueMicrotask<br>
macrotask: setTimeout 0<br>
macrotask: setImmediate<br>
$ node _thu-tu.js B<br>
timer 1<br>
&nbsp;&nbsp;promise inside timer 1<br>
timer 2<br>
&nbsp;&nbsp;promise inside timer 2<br>
$ node _thu-tu.js C<br>
setImmediate<br>
setTimeout 0<br>
# A run 200 times: which macrotask comes first?<br>
$ for i in $(seq 200); do node _thu-tu.js A | grep macrotask | head -1; done | sort | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;120 macrotask: setImmediate<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;80 macrotask: setTimeout 0<br>
# C run 200 times: inside an I/O callback<br>
$ for i in $(seq 200); do node _thu-tu.js C | head -1; done | sort | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;200 setImmediate</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p><strong>Part A.</strong> "sync: start" and "sync: end" first — the whole main module is one synchronous callback. Then the nextTick queue, then the two microtasks in the order they were queued (<code>then</code> before <code>queueMicrotask</code>). Only then the loop starts — and the race between the two macrotasks shows in the counts: sometimes the 1 ms timer is already due when the loop first checks the timers phase (timeout first), sometimes not (the loop goes on to poll and check, so immediate first). In this run each order happened many times.</p>
<p><strong>Part B.</strong> "timer 1", then "promise inside timer 1", then "timer 2": since Node 11 the microtask queue is drained after <em>each</em> timer callback, exactly like in browsers. (Node 10 and older ran both timers first — a classic interview trick question.)</p>
<p><strong>Part C.</strong> 200 out of 200: inside an I/O callback we are in the poll phase; the next phase is check, so the immediate runs before the loop wraps round to timers. The simulator shows both cases of part A and part C step by step:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/15e380e3d78ab6aeb1311f00b8064a5fc62304d2.svg" alt="Main module, fast start: the timer is not yet due at the first timers phase, so setImmediate (check) runs first" loading="lazy" /><p class="chu-thich">🧮 Main module, fast start: the timer is not yet due at the first timers phase, so setImmediate (check) runs first</p></div>
<ol><li><code>start</code> — main script → <code>sync: start</code></li><li><code>end</code> — main script → <code>sync: end</code></li><li><code>tick</code> — process.nextTick → <code>nextTick</code></li><li><code>then</code> — microtasks → <code>microtask: promise.then</code></li><li><code>qMicro</code> — microtasks → <code>microtask: queueMicrotask</code></li><li><code>immed</code> — 5 check → <code>macrotask: setImmediate</code></li><li><code>timeout</code> — 1 timers → <code>macrotask: setTimeout 0</code></li></ol>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const PHA = ['main', 'tick', 'micro', 'timers', 'poll', 'check'];
function chay(kichBan, batDau) {
  const buoc = [];                                    // [{ pha, nhan, in }]
  const tick = [], micro = [], timers = [], imm = [], io = [];
  let gio = 0, pha = 'main';
  const api = {
    log: (nhan, s) =&gt; buoc.push({ pha, nhan, in: s }),
    setTimeout: (f) =&gt; timers.push({ chin: gio + 1, f }),        // setTimeout(f, 0) is really 1 ms
    setImmediate: (f) =&gt; imm.push(f),
    then: (f) =&gt; micro.push(f), queueMicrotask: (f) =&gt; micro.push(f),
    nextTick: (f) =&gt; tick.push(f),
    readFile: (f) =&gt; io.push(f),                                  // completes in the first poll phase
  };
  const goi = (p, f) =&gt; { pha = p; f(api); xa(); };
  const xa = () =&gt; {                                              // drain nextTick, then microtasks, until both empty
    while (tick.length || micro.length) {
      while (tick.length) { pha = 'tick'; tick.shift()(api); }
      while (micro.length &amp;&amp; !tick.length) { pha = 'micro'; micro.shift()(api); }
    }
  };
  goi('main', kichBan);
  gio = batDau;                                                   // ms elapsed when the loop first reaches "timers"
  for (let vong = 0; vong &lt; 10 &amp;&amp; (timers.length || imm.length || io.length); vong++) {
    for (const tm of timers.filter((x) =&gt; x.chin &lt;= gio)) { timers.splice(timers.indexOf(tm), 1); goi('timers', tm.f); }
    for (const f of io.splice(0)) goi('poll', f);
    for (const f of imm.splice(0)) goi('check', f);               // only the ones queued before this check phase
    gio += 1;                                                     // the poll phase waited for the next timer
  }
  return buoc;
}
const KB = {
  a: (api) =&gt; {
    api.log('start', 'sync: start');
    api.setTimeout((a) =&gt; a.log('timeout', 'macrotask: setTimeout 0'));
    api.setImmediate((a) =&gt; a.log('immed', 'macrotask: setImmediate'));
    api.then((a) =&gt; a.log('then', 'microtask: promise.then'));
    api.queueMicrotask((a) =&gt; a.log('qMicro', 'microtask: queueMicrotask'));
    api.nextTick((a) =&gt; a.log('tick', 'nextTick'));
    api.log('end', 'sync: end');
  },
  b: (api) =&gt; {
    api.setTimeout((a) =&gt; { a.log('T1', 'timer 1'); a.then((b) =&gt; b.log('p1', '  promise inside timer 1')); });
    api.setTimeout((a) =&gt; { a.log('T2', 'timer 2'); a.then((b) =&gt; b.log('p2', '  promise inside timer 2')); });
  },
  c: (api) =&gt; api.readFile((a) =&gt; {
    a.log('read', '(readFile callback)');
    a.setTimeout((b) =&gt; b.log('timeout', 'setTimeout 0'));
    a.setImmediate((b) =&gt; b.log('immed', 'setImmediate'));
  }),
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/287e923fb10c1ce32ff1939378ab9399edb90231.svg" alt="Inside an I/O callback (poll): check comes next, so setImmediate always runs before the timer" loading="lazy" /><p class="chu-thich">🧮 Inside an I/O callback (poll): check comes next, so setImmediate always runs before the timer</p></div>
<ol><li><code>read</code> — 4 poll (I/O) → <code>(readFile callback)</code></li><li><code>immed</code> — 5 check → <code>setImmediate</code></li><li><code>timeout</code> — 1 timers → <code>setTimeout 0</code></li></ol>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const PHA = ['main', 'tick', 'micro', 'timers', 'poll', 'check'];
function chay(kichBan, batDau) {
  const buoc = [];                                    // [{ pha, nhan, in }]
  const tick = [], micro = [], timers = [], imm = [], io = [];
  let gio = 0, pha = 'main';
  const api = {
    log: (nhan, s) =&gt; buoc.push({ pha, nhan, in: s }),
    setTimeout: (f) =&gt; timers.push({ chin: gio + 1, f }),        // setTimeout(f, 0) is really 1 ms
    setImmediate: (f) =&gt; imm.push(f),
    then: (f) =&gt; micro.push(f), queueMicrotask: (f) =&gt; micro.push(f),
    nextTick: (f) =&gt; tick.push(f),
    readFile: (f) =&gt; io.push(f),                                  // completes in the first poll phase
  };
  const goi = (p, f) =&gt; { pha = p; f(api); xa(); };
  const xa = () =&gt; {                                              // drain nextTick, then microtasks, until both empty
    while (tick.length || micro.length) {
      while (tick.length) { pha = 'tick'; tick.shift()(api); }
      while (micro.length &amp;&amp; !tick.length) { pha = 'micro'; micro.shift()(api); }
    }
  };
  goi('main', kichBan);
  gio = batDau;                                                   // ms elapsed when the loop first reaches "timers"
  for (let vong = 0; vong &lt; 10 &amp;&amp; (timers.length || imm.length || io.length); vong++) {
    for (const tm of timers.filter((x) =&gt; x.chin &lt;= gio)) { timers.splice(timers.indexOf(tm), 1); goi('timers', tm.f); }
    for (const f of io.splice(0)) goi('poll', f);
    for (const f of imm.splice(0)) goi('check', f);               // only the ones queued before this check phase
    gio += 1;                                                     // the poll phase waited for the next timer
  }
  return buoc;
}
const KB = {
  a: (api) =&gt; {
    api.log('start', 'sync: start');
    api.setTimeout((a) =&gt; a.log('timeout', 'macrotask: setTimeout 0'));
    api.setImmediate((a) =&gt; a.log('immed', 'macrotask: setImmediate'));
    api.then((a) =&gt; a.log('then', 'microtask: promise.then'));
    api.queueMicrotask((a) =&gt; a.log('qMicro', 'microtask: queueMicrotask'));
    api.nextTick((a) =&gt; a.log('tick', 'nextTick'));
    api.log('end', 'sync: end');
  },
  b: (api) =&gt; {
    api.setTimeout((a) =&gt; { a.log('T1', 'timer 1'); a.then((b) =&gt; b.log('p1', '  promise inside timer 1')); });
    api.setTimeout((a) =&gt; { a.log('T2', 'timer 2'); a.then((b) =&gt; b.log('p2', '  promise inside timer 2')); });
  },
  c: (api) =&gt; api.readFile((a) =&gt; {
    a.log('read', '(readFile callback)');
    a.setTimeout((b) =&gt; b.log('timeout', 'setTimeout 0'));
    a.setImmediate((b) =&gt; b.log('immed', 'setImmediate'));
  }),
};</code></pre></details>
<p class="meo">🧠 Interview answer in one breath: <em>sync, nextTick, promises, then timers, poll, check — setTimeout 0 vs setImmediate is random in the main module and setImmediate-first inside I/O; microtasks drain after every single callback.</em></p>`,
        `<p class="y-chinh">🎯 Thứ tự thật: <strong>code đồng bộ → <code>process.nextTick</code> → microtask của promise → macrotask theo pha</strong>. Ở module chính, <code>setTimeout(f, 0)</code> so với <code>setImmediate(g)</code> là <strong>ngẫu nhiên</strong> (tuỳ lúc loop bắt đầu đã qua 1 ms hay chưa); bên trong một callback I/O thì <code>setImmediate</code> luôn thắng. Và microtask chạy <em>xen giữa</em> hai callback timer, chứ không chờ tới sau tất cả.</p>
<p>Chương trình có ba phần, chạy bằng <code>node _thu-tu.js A|B|C</code>. Phần A hẹn mỗi loại một cái từ module chính. Phần B hẹn hai timer, mỗi timer lại hẹn một promise. Phần C gọi <code>fs.readFile</code> và, bên trong callback của nó, hẹn một timeout và một immediate. Sau đó phần A và phần C mỗi phần chạy 200 lần để đếm macrotask nào thắng:</p>
<div class="out"># Slide 16: thứ tự in thật — đồng bộ, nextTick, promise, rồi macrotask<br>
$ node _thu-tu.js A<br>
sync: start<br>
sync: end<br>
nextTick<br>
microtask: promise.then<br>
microtask: queueMicrotask<br>
macrotask: setTimeout 0<br>
macrotask: setImmediate<br>
$ node _thu-tu.js B<br>
timer 1<br>
&nbsp;&nbsp;promise inside timer 1<br>
timer 2<br>
&nbsp;&nbsp;promise inside timer 2<br>
$ node _thu-tu.js C<br>
setImmediate<br>
setTimeout 0<br>
# Chạy A 200 lần: macrotask nào in trước?<br>
$ for i in $(seq 200); do node _thu-tu.js A | grep macrotask | head -1; done | sort | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;120 macrotask: setImmediate<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;80 macrotask: setTimeout 0<br>
# Chạy C 200 lần: bên trong callback I/O<br>
$ for i in $(seq 200); do node _thu-tu.js C | head -1; done | sort | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;200 setImmediate</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p><strong>Phần A.</strong> "sync: start" và "sync: end" trước — cả module chính là một callback đồng bộ. Rồi tới hàng nextTick, rồi hai microtask theo đúng thứ tự xếp hàng (<code>then</code> trước <code>queueMicrotask</code>). Chỉ sau đó loop mới bắt đầu — và cuộc đua giữa hai macrotask hiện ra trong số đếm: có lúc timer 1 ms đã tới hạn khi loop kiểm pha timers lần đầu (timeout trước), có lúc chưa (loop đi tiếp tới poll và check, nên immediate trước). Trong lần chạy này, thứ tự nào cũng xảy ra nhiều lần.</p>
<p><strong>Phần B.</strong> "timer 1", rồi "promise inside timer 1", rồi "timer 2": từ Node 11, hàng microtask được xả sau <em>từng</em> callback timer, y như trình duyệt. (Node 10 trở về trước chạy cả hai timer trước — một câu hỏi bẫy kinh điển khi phỏng vấn.)</p>
<p><strong>Phần C.</strong> 200 trên 200: bên trong callback I/O ta đang ở pha poll; pha kế tiếp là check, nên immediate chạy trước khi loop vòng lại pha timers. Bộ mô phỏng cho thấy cả hai trường hợp của phần A và phần C từng bước:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ad840743b1f6fe36b00d2f6fbb2d30fb01775f0a.svg" alt="Module chính, khởi động nhanh: timer chưa tới hạn ở pha timers đầu tiên, nên setImmediate (check) chạy trước" loading="lazy" /><p class="chu-thich">🧮 Module chính, khởi động nhanh: timer chưa tới hạn ở pha timers đầu tiên, nên setImmediate (check) chạy trước</p></div>
<ol><li><code>start</code> — code đồng bộ → <code>sync: start</code></li><li><code>end</code> — code đồng bộ → <code>sync: end</code></li><li><code>tick</code> — process.nextTick → <code>nextTick</code></li><li><code>then</code> — microtask → <code>microtask: promise.then</code></li><li><code>qMicro</code> — microtask → <code>microtask: queueMicrotask</code></li><li><code>immed</code> — 5 check → <code>macrotask: setImmediate</code></li><li><code>timeout</code> — 1 timers → <code>macrotask: setTimeout 0</code></li></ol>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const PHA = ['main', 'tick', 'micro', 'timers', 'poll', 'check'];
function chay(kichBan, batDau) {
  const buoc = [];                                    // [{ pha, nhan, in }]
  const tick = [], micro = [], timers = [], imm = [], io = [];
  let gio = 0, pha = 'main';
  const api = {
    log: (nhan, s) =&gt; buoc.push({ pha, nhan, in: s }),
    setTimeout: (f) =&gt; timers.push({ chin: gio + 1, f }),        // setTimeout(f, 0) is really 1 ms
    setImmediate: (f) =&gt; imm.push(f),
    then: (f) =&gt; micro.push(f), queueMicrotask: (f) =&gt; micro.push(f),
    nextTick: (f) =&gt; tick.push(f),
    readFile: (f) =&gt; io.push(f),                                  // completes in the first poll phase
  };
  const goi = (p, f) =&gt; { pha = p; f(api); xa(); };
  const xa = () =&gt; {                                              // drain nextTick, then microtasks, until both empty
    while (tick.length || micro.length) {
      while (tick.length) { pha = 'tick'; tick.shift()(api); }
      while (micro.length &amp;&amp; !tick.length) { pha = 'micro'; micro.shift()(api); }
    }
  };
  goi('main', kichBan);
  gio = batDau;                                                   // ms elapsed when the loop first reaches "timers"
  for (let vong = 0; vong &lt; 10 &amp;&amp; (timers.length || imm.length || io.length); vong++) {
    for (const tm of timers.filter((x) =&gt; x.chin &lt;= gio)) { timers.splice(timers.indexOf(tm), 1); goi('timers', tm.f); }
    for (const f of io.splice(0)) goi('poll', f);
    for (const f of imm.splice(0)) goi('check', f);               // only the ones queued before this check phase
    gio += 1;                                                     // the poll phase waited for the next timer
  }
  return buoc;
}
const KB = {
  a: (api) =&gt; {
    api.log('start', 'sync: start');
    api.setTimeout((a) =&gt; a.log('timeout', 'macrotask: setTimeout 0'));
    api.setImmediate((a) =&gt; a.log('immed', 'macrotask: setImmediate'));
    api.then((a) =&gt; a.log('then', 'microtask: promise.then'));
    api.queueMicrotask((a) =&gt; a.log('qMicro', 'microtask: queueMicrotask'));
    api.nextTick((a) =&gt; a.log('tick', 'nextTick'));
    api.log('end', 'sync: end');
  },
  b: (api) =&gt; {
    api.setTimeout((a) =&gt; { a.log('T1', 'timer 1'); a.then((b) =&gt; b.log('p1', '  promise inside timer 1')); });
    api.setTimeout((a) =&gt; { a.log('T2', 'timer 2'); a.then((b) =&gt; b.log('p2', '  promise inside timer 2')); });
  },
  c: (api) =&gt; api.readFile((a) =&gt; {
    a.log('read', '(readFile callback)');
    a.setTimeout((b) =&gt; b.log('timeout', 'setTimeout 0'));
    a.setImmediate((b) =&gt; b.log('immed', 'setImmediate'));
  }),
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/75e79a50d0fbd3233fba5a6ea5d394dab7285e14.svg" alt="Bên trong callback I/O (poll): check đến ngay sau, nên setImmediate luôn chạy trước timer" loading="lazy" /><p class="chu-thich">🧮 Bên trong callback I/O (poll): check đến ngay sau, nên setImmediate luôn chạy trước timer</p></div>
<ol><li><code>read</code> — 4 poll (I/O) → <code>(readFile callback)</code></li><li><code>immed</code> — 5 check → <code>setImmediate</code></li><li><code>timeout</code> — 1 timers → <code>setTimeout 0</code></li></ol>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const PHA = ['main', 'tick', 'micro', 'timers', 'poll', 'check'];
function chay(kichBan, batDau) {
  const buoc = [];                                    // [{ pha, nhan, in }]
  const tick = [], micro = [], timers = [], imm = [], io = [];
  let gio = 0, pha = 'main';
  const api = {
    log: (nhan, s) =&gt; buoc.push({ pha, nhan, in: s }),
    setTimeout: (f) =&gt; timers.push({ chin: gio + 1, f }),        // setTimeout(f, 0) is really 1 ms
    setImmediate: (f) =&gt; imm.push(f),
    then: (f) =&gt; micro.push(f), queueMicrotask: (f) =&gt; micro.push(f),
    nextTick: (f) =&gt; tick.push(f),
    readFile: (f) =&gt; io.push(f),                                  // completes in the first poll phase
  };
  const goi = (p, f) =&gt; { pha = p; f(api); xa(); };
  const xa = () =&gt; {                                              // drain nextTick, then microtasks, until both empty
    while (tick.length || micro.length) {
      while (tick.length) { pha = 'tick'; tick.shift()(api); }
      while (micro.length &amp;&amp; !tick.length) { pha = 'micro'; micro.shift()(api); }
    }
  };
  goi('main', kichBan);
  gio = batDau;                                                   // ms elapsed when the loop first reaches "timers"
  for (let vong = 0; vong &lt; 10 &amp;&amp; (timers.length || imm.length || io.length); vong++) {
    for (const tm of timers.filter((x) =&gt; x.chin &lt;= gio)) { timers.splice(timers.indexOf(tm), 1); goi('timers', tm.f); }
    for (const f of io.splice(0)) goi('poll', f);
    for (const f of imm.splice(0)) goi('check', f);               // only the ones queued before this check phase
    gio += 1;                                                     // the poll phase waited for the next timer
  }
  return buoc;
}
const KB = {
  a: (api) =&gt; {
    api.log('start', 'sync: start');
    api.setTimeout((a) =&gt; a.log('timeout', 'macrotask: setTimeout 0'));
    api.setImmediate((a) =&gt; a.log('immed', 'macrotask: setImmediate'));
    api.then((a) =&gt; a.log('then', 'microtask: promise.then'));
    api.queueMicrotask((a) =&gt; a.log('qMicro', 'microtask: queueMicrotask'));
    api.nextTick((a) =&gt; a.log('tick', 'nextTick'));
    api.log('end', 'sync: end');
  },
  b: (api) =&gt; {
    api.setTimeout((a) =&gt; { a.log('T1', 'timer 1'); a.then((b) =&gt; b.log('p1', '  promise inside timer 1')); });
    api.setTimeout((a) =&gt; { a.log('T2', 'timer 2'); a.then((b) =&gt; b.log('p2', '  promise inside timer 2')); });
  },
  c: (api) =&gt; api.readFile((a) =&gt; {
    a.log('read', '(readFile callback)');
    a.setTimeout((b) =&gt; b.log('timeout', 'setTimeout 0'));
    a.setImmediate((b) =&gt; b.log('immed', 'setImmediate'));
  }),
};</code></pre></details>
<p class="meo">🧠 Câu trả lời phỏng vấn trong một hơi: <em>đồng bộ, nextTick, promise, rồi timers, poll, check — setTimeout 0 vs setImmediate ngẫu nhiên ở module chính và setImmediate trước khi ở trong I/O; microtask được xả sau từng callback một.</em></p>`],
      [17, 'Measured: 8 × crypto.pbkdf2 with a pool of 4 vs 8',
        `<p class="y-chinh">🎯 <code>crypto.pbkdf2</code> (asynchronous) runs on the libuv thread pool. Eight jobs on the default pool of <strong>4</strong> finish in <strong>two waves</strong>: four together, then the next four, because jobs 5–8 wait in the pool's queue. With <code>UV_THREADPOOL_SIZE=8</code> on a machine with at least 8 free cores they finish in <strong>one wave</strong>.</p>
<p>PBKDF2 is a deliberately slow password hash: here 300,000 rounds of SHA-512, about 170–190 ms of pure CPU for one job on this machine. Node's documentation ("Don't Block the Event Loop") lists what goes to the pool: all asynchronous <code>fs</code> APIs except file watching, <code>dns.lookup</code>, the asynchronous crypto APIs (<code>pbkdf2</code>, <code>scrypt</code>, <code>randomBytes</code>, <code>randomFill</code>, <code>generateKeyPair</code>) and all asynchronous <code>zlib</code> APIs. Network sockets, timers and <code>dns.resolve*</code> do <em>not</em> use it.</p>
<p>The program starts N jobs at once and prints when each one finished:</p>
<div class="out"># Slides 17–18: 8 x crypto.pbkdf2 — the libuv pool has 4 threads by default<br>
$ nproc<br>
10<br>
$ node _pbkdf2.js 1<br>
UV_THREADPOOL_SIZE=(unset) &nbsp;1 jobs done at (ms): 164<br>
$ UV_THREADPOOL_SIZE=4 node _pbkdf2.js 8<br>
UV_THREADPOOL_SIZE=4 &nbsp;8 jobs done at (ms): 164 165 168 168 326 327 330 334<br>
$ UV_THREADPOOL_SIZE=8 node _pbkdf2.js 8<br>
UV_THREADPOOL_SIZE=8 &nbsp;8 jobs done at (ms): 176 177 195 206 209 215 227 233</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Read the pool-of-4 line: the first four finish close to one job's time, and the fifth one at roughly <em>twice</em> that — the gap is the queue. The pool-of-8 line has all eight finishing close together, a little slower than one job alone because eight cores compete for memory bandwidth and the container shares the machine with other work (<code>nproc</code> shows the 10 CPUs Docker gives it). The slide shows the same two shapes from the 25/10 measurement (388 ms vs 296 ms).</p>
<p>🧭 Why a backend developer cares: the pool is shared by <em>everything</em> on the list. Four slow password hashes (or four big gzip responses, or four <code>dns.lookup</code> calls to a slow DNS server) occupy the whole pool, and meanwhile even a tiny <code>fs.readFile</code> of a template has to wait. Raising <code>UV_THREADPOOL_SIZE</code> (for example to the number of cores) is a common and cheap fix — set it in the start command or the Docker <code>ENV</code>, not in code that runs after the first pool use.</p>
<p class="pitfall">⚠️ More pool threads than cores does not make CPU work faster (slide 9 again); it only helps when pool jobs <em>wait</em> (slow disks, slow DNS).</p>
<p class="meo">🧠 "Two waves" = a queue in front of a pool. You will see the same shape with Tomcat (slide 7), with HikariCP and with any bounded executor.</p>`,
        `<p class="y-chinh">🎯 <code>crypto.pbkdf2</code> (bất đồng bộ) chạy trên thread pool của libuv. Tám việc trên pool mặc định <strong>4</strong> luồng xong thành <strong>hai đợt</strong>: bốn cái cùng lúc, rồi bốn cái tiếp, vì việc 5–8 phải chờ trong hàng đợi của pool. Với <code>UV_THREADPOOL_SIZE=8</code> trên một máy có ít nhất 8 lõi rảnh, chúng xong trong <strong>một đợt</strong>.</p>
<p>PBKDF2 là một hàm băm mật khẩu cố ý chậm: ở đây 300.000 vòng SHA-512, khoảng 170–190 ms CPU thuần cho một việc trên máy này. Tài liệu Node ("Don't Block the Event Loop") liệt kê những gì đi vào pool: mọi API <code>fs</code> bất đồng bộ trừ theo dõi tệp, <code>dns.lookup</code>, các API mật mã bất đồng bộ (<code>pbkdf2</code>, <code>scrypt</code>, <code>randomBytes</code>, <code>randomFill</code>, <code>generateKeyPair</code>) và mọi API <code>zlib</code> bất đồng bộ. Socket mạng, timer và <code>dns.resolve*</code> thì <em>không</em> dùng nó.</p>
<p>Chương trình khởi động N việc cùng lúc và in ra lúc mỗi việc xong:</p>
<div class="out"># Slide 17–18: 8 lần crypto.pbkdf2 — pool của libuv mặc định có 4 luồng<br>
$ nproc<br>
10<br>
$ node _pbkdf2.js 1<br>
UV_THREADPOOL_SIZE=(unset) &nbsp;1 jobs done at (ms): 164<br>
$ UV_THREADPOOL_SIZE=4 node _pbkdf2.js 8<br>
UV_THREADPOOL_SIZE=4 &nbsp;8 jobs done at (ms): 164 165 168 168 326 327 330 334<br>
$ UV_THREADPOOL_SIZE=8 node _pbkdf2.js 8<br>
UV_THREADPOOL_SIZE=8 &nbsp;8 jobs done at (ms): 176 177 195 206 209 215 227 233</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Đọc dòng pool 4: bốn việc đầu xong gần bằng thời gian một việc, còn việc thứ năm xong ở khoảng <em>gấp đôi</em> — khoảng cách đó là hàng đợi. Dòng pool 8 có cả tám việc xong sát nhau, chậm hơn một việc chạy riêng một chút vì tám lõi giành nhau băng thông bộ nhớ và container dùng chung máy với việc khác (<code>nproc</code> cho thấy 10 CPU Docker cấp). Slide cho thấy cùng hai hình dạng đó từ lần đo 25/10 (388 ms vs 296 ms).</p>
<p>🧭 Vì sao dev backend cần biết: pool được <em>mọi thứ</em> trong danh sách dùng chung. Bốn lần băm mật khẩu chậm (hoặc bốn response gzip lớn, hoặc bốn lần <code>dns.lookup</code> tới một DNS chậm) chiếm cả pool, và trong lúc đó đến một lần <code>fs.readFile</code> đọc template nhỏ xíu cũng phải chờ. Tăng <code>UV_THREADPOOL_SIZE</code> (ví dụ bằng số lõi) là cách sửa phổ biến và rẻ — đặt trong lệnh khởi động hoặc <code>ENV</code> của Docker, đừng đặt trong code chạy sau lần dùng pool đầu tiên.</p>
<p class="pitfall">⚠️ Nhiều luồng pool hơn số lõi không làm việc CPU nhanh hơn (lại slide 9); nó chỉ có ích khi các việc của pool <em>chờ</em> (đĩa chậm, DNS chậm).</p>
<p class="meo">🧠 "Hai đợt" = có hàng đợi đứng trước một pool. Bạn sẽ gặp lại hình dạng đó ở Tomcat (slide 7), ở HikariCP và ở mọi executor có giới hạn.</p>`],
      [18, 'Blocking the event loop: one request freezes all',
        `<p class="y-chinh">🎯 A handler that burns 2 s of CPU <strong>on the main thread</strong> freezes the whole server: every <code>/ping</code> sent during those 2 seconds waits until the busy loop ends, then all of them are answered at once. The event-loop delay histogram reports a maximum of about <strong>2,000 ms</strong>.</p>
<p>The server has three routes: <code>/ping</code> answers immediately; <code>/block</code> spins in a <code>while</code> loop for 2 s and then answers; <code>/lag</code> reports the maximum event-loop delay measured by <code>perf_hooks.monitorEventLoopDelay</code> (a timer that records how late it fires — if the loop is busy, the timer fires late). The client sends <code>/ping</code> every 250 ms for 4 s and, at 0.5 s, one <code>/block</code>.</p>
<div class="out"># Slides 19–20: one CPU-heavy request on the main thread freezes every other user; a worker thread does not<br>
$ node _server.js &amp; sleep 1<br>
server listening on :3000<br>
$ node _client.mjs /block<br>
&nbsp;&nbsp;47 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;3 ms<br>
&nbsp;293 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;3 ms<br>
&nbsp;543 ms &nbsp;-&gt; GET /block<br>
2547 ms &nbsp;&lt;- /block answered after 2003 ms: blocked the loop for 2 s<br>
2548 ms &nbsp;/ping took 2004 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2551 ms &nbsp;/ping took 1761 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2552 ms &nbsp;/ping took 1511 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2552 ms &nbsp;/ping took 1261 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2554 ms &nbsp;/ping took 1014 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2555 ms &nbsp;/ping took &nbsp;765 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2555 ms &nbsp;/ping took &nbsp;512 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2556 ms &nbsp;/ping took &nbsp;265 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2556 ms &nbsp;/ping took &nbsp;&nbsp;15 ms<br>
2795 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;3 ms<br>
3044 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;1 ms<br>
3293 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
3542 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
3793 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
event-loop delay: max 2005.9 ms<br>
$ node _client.mjs /block-worker<br>
&nbsp;&nbsp;39 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
&nbsp;291 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;4 ms<br>
&nbsp;536 ms &nbsp;-&gt; GET /block-worker<br>
&nbsp;540 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;3 ms<br>
&nbsp;789 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
1039 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
1290 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
1538 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
1788 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
2040 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
2286 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;1 ms<br>
2537 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;1 ms<br>
2583 ms &nbsp;&lt;- /block-worker answered after 2047 ms: worker burned CPU for 2 s<br>
2789 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;1 ms<br>
3038 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;1 ms<br>
3287 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;1 ms<br>
3539 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
3787 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
event-loop delay: max 19.6 ms<br>
$ kill %1</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Read the first client run (<code>/block</code>). Before 0.5 s each ping takes 2–3 ms. Then the server enters <code>burnCpu</code>. The pings sent at 0.75, 1.0, 1.25 … 2.5 s arrive at the socket and wait — the kernel has the bytes, but the only JavaScript thread is busy, so the poll phase never runs. When the loop finishes at about 2.55 s, all waiting pings are answered within a few milliseconds; their measured times (2004, 1761, 1511 … 265 ms) are exactly "how long before the end of the block they were sent". The histogram agrees: maximum delay ≈ 2 s. (The second client run, with <code>/block-worker</code>, is the fix on the next slide.)</p>
<p>The simulator draws the same thing with six small requests: R3 needs 60 ms of CPU instead of 10. The database waits of the others still finish on time (the kernel keeps working), but their second CPU slices cannot start until R3 lets go of the loop:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/838707a85e3f5c98212d257d8434352303caf1ae.svg" alt="Event loop with one CPU-heavy request: everything after R3 is pushed back by 50 ms" loading="lazy" /><p class="chu-thich">🧮 Event loop with one CPU-heavy request: everything after R3 is pushed back by 50 ms</p></div>
<p>Computed: R1 120 ms · R2 130 ms · R3 140 ms · R4 150 ms · R5 160 ms · R6 170 ms — average <strong>145 ms</strong>, last <strong>170 ms</strong>.</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const yeuCau = (cpuDau = {}) =&gt; Array.from({ length: 6 }, (_, i) =&gt; ({
  ten: &#96;R&#36;{i + 1}&#96;, pha: [{ cpu: cpuDau[i] ?? 1 }, { wait: 4 }, { cpu: 1 }],   // CPU 10 ms → wait 40 ms → CPU 10 ms
}));
const KICH_BAN = {
  pool2: { yc: yeuCau(), cho: 2, loi: 2, giu: true },           // 2 platform threads, each held for the whole request
  loop: { yc: yeuCau(), cho: 1, loi: 1, giu: false },           // 1 event-loop thread, waits handled by the kernel
  chan: { yc: yeuCau({ 2: 6 }), cho: 1, loi: 1, giu: false },   // R3 burns 60 ms of CPU on the loop thread
  vt2: { yc: yeuCau(), cho: 2, loi: 2, giu: false },            // virtual threads on 2 carriers
};</code></pre></details>
<p>Compare with the healthy loop: the same six requests with 10 ms each finish by 120 ms.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f7e63f07ade99c72a773d2958168142f2095f812.svg" alt="A healthy event loop: one thread runs every CPU slice while the kernel holds all six DB waits at once" loading="lazy" /><p class="chu-thich">🧮 A healthy event loop: one thread runs every CPU slice while the kernel holds all six DB waits at once</p></div>
<p>Computed: R1 70 ms · R2 80 ms · R3 90 ms · R4 100 ms · R5 110 ms · R6 120 ms — average <strong>95 ms</strong>, last <strong>120 ms</strong>.</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const yeuCau = (cpuDau = {}) =&gt; Array.from({ length: 6 }, (_, i) =&gt; ({
  ten: &#96;R&#36;{i + 1}&#96;, pha: [{ cpu: cpuDau[i] ?? 1 }, { wait: 4 }, { cpu: 1 }],   // CPU 10 ms → wait 40 ms → CPU 10 ms
}));
const KICH_BAN = {
  pool2: { yc: yeuCau(), cho: 2, loi: 2, giu: true },           // 2 platform threads, each held for the whole request
  loop: { yc: yeuCau(), cho: 1, loi: 1, giu: false },           // 1 event-loop thread, waits handled by the kernel
  chan: { yc: yeuCau({ 2: 6 }), cho: 1, loi: 1, giu: false },   // R3 burns 60 ms of CPU on the loop thread
  vt2: { yc: yeuCau(), cho: 2, loi: 2, giu: false },            // virtual threads on 2 carriers
};</code></pre></details>
<p class="pitfall">⚠️ Usual suspects on the main thread: <code>*Sync</code> APIs (<code>fs.readFileSync</code>, <code>crypto.pbkdf2Sync</code>, <code>bcrypt.hashSync</code>), <code>JSON.parse</code>/<code>JSON.stringify</code> of very large objects, a regular expression with catastrophic backtracking, sorting or looping over 100,000 rows, image or PDF processing in JavaScript.</p>
<p class="meo">🧠 The event loop's golden rule: <em>every callback must be short</em>. "Short" means milliseconds — a 2-second callback is a 2-second outage for every user.</p>`,
        `<p class="y-chinh">🎯 Một handler đốt 2 s CPU <strong>trên luồng chính</strong> làm đứng cả server: mọi <code>/ping</code> gửi tới trong 2 giây đó phải chờ tới khi vòng lặp bận kết thúc, rồi tất cả được trả lời cùng một lúc. Biểu đồ độ trễ của event loop báo mức tối đa khoảng <strong>2.000 ms</strong>.</p>
<p>Server có ba route: <code>/ping</code> trả lời ngay; <code>/block</code> quay vòng <code>while</code> trong 2 s rồi mới trả lời; <code>/lag</code> báo độ trễ event loop lớn nhất đo bằng <code>perf_hooks.monitorEventLoopDelay</code> (một timer ghi lại nó nổ muộn bao lâu — loop bận thì timer nổ muộn). Client gửi <code>/ping</code> mỗi 250 ms trong 4 s và, ở mốc 0,5 s, gửi một <code>/block</code>.</p>
<div class="out"># Slide 19–20: một request nặng CPU trên luồng chính làm đứng mọi người dùng khác; worker thread thì không<br>
$ node _server.js &amp; sleep 1<br>
server listening on :3000<br>
$ node _client.mjs /block<br>
&nbsp;&nbsp;47 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;3 ms<br>
&nbsp;293 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;3 ms<br>
&nbsp;543 ms &nbsp;-&gt; GET /block<br>
2547 ms &nbsp;&lt;- /block answered after 2003 ms: blocked the loop for 2 s<br>
2548 ms &nbsp;/ping took 2004 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2551 ms &nbsp;/ping took 1761 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2552 ms &nbsp;/ping took 1511 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2552 ms &nbsp;/ping took 1261 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2554 ms &nbsp;/ping took 1014 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2555 ms &nbsp;/ping took &nbsp;765 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2555 ms &nbsp;/ping took &nbsp;512 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2556 ms &nbsp;/ping took &nbsp;265 ms &nbsp;&nbsp;&lt;-- STUCK<br>
2556 ms &nbsp;/ping took &nbsp;&nbsp;15 ms<br>
2795 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;3 ms<br>
3044 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;1 ms<br>
3293 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
3542 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
3793 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
event-loop delay: max 2005.9 ms<br>
$ node _client.mjs /block-worker<br>
&nbsp;&nbsp;39 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
&nbsp;291 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;4 ms<br>
&nbsp;536 ms &nbsp;-&gt; GET /block-worker<br>
&nbsp;540 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;3 ms<br>
&nbsp;789 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
1039 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
1290 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
1538 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
1788 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
2040 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
2286 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;1 ms<br>
2537 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;1 ms<br>
2583 ms &nbsp;&lt;- /block-worker answered after 2047 ms: worker burned CPU for 2 s<br>
2789 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;1 ms<br>
3038 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;1 ms<br>
3287 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;1 ms<br>
3539 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
3787 ms &nbsp;/ping took &nbsp;&nbsp;&nbsp;2 ms<br>
event-loop delay: max 19.6 ms<br>
$ kill %1</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Đọc lần chạy client thứ nhất (<code>/block</code>). Trước 0,5 s mỗi ping mất 2–3 ms. Rồi server vào <code>burnCpu</code>. Các ping gửi lúc 0,75, 1,0, 1,25 … 2,5 s tới được socket và nằm chờ — nhân đã có các byte, nhưng luồng JavaScript duy nhất đang bận, nên pha poll không bao giờ chạy. Khi vòng lặp xong lúc khoảng 2,55 s, mọi ping đang chờ được trả lời trong vài mili giây; thời gian đo được của chúng (2004, 1761, 1511 … 265 ms) đúng bằng "chúng được gửi trước lúc hết chặn bao lâu". Biểu đồ trễ đồng ý: trễ tối đa ≈ 2 s. (Lần chạy client thứ hai, với <code>/block-worker</code>, là cách sửa ở slide sau.)</p>
<p>Bộ mô phỏng vẽ cùng chuyện đó với sáu request nhỏ: R3 cần 60 ms CPU thay vì 10. Phần chờ cơ sở dữ liệu của các request khác vẫn xong đúng hạn (nhân vẫn làm việc), nhưng lát CPU thứ hai của chúng không bắt đầu được cho tới khi R3 nhả loop ra:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e4a9f9239b9916c339937587126eea7115a0ce74.svg" alt="Event loop có một request nặng CPU: mọi thứ sau R3 bị đẩy lùi 50 ms" loading="lazy" /><p class="chu-thich">🧮 Event loop có một request nặng CPU: mọi thứ sau R3 bị đẩy lùi 50 ms</p></div>
<p>Máy tính ra: R1 120 ms · R2 130 ms · R3 140 ms · R4 150 ms · R5 160 ms · R6 170 ms — trung bình <strong>145 ms</strong>, cuối cùng <strong>170 ms</strong>.</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const yeuCau = (cpuDau = {}) =&gt; Array.from({ length: 6 }, (_, i) =&gt; ({
  ten: &#96;R&#36;{i + 1}&#96;, pha: [{ cpu: cpuDau[i] ?? 1 }, { wait: 4 }, { cpu: 1 }],   // CPU 10 ms → wait 40 ms → CPU 10 ms
}));
const KICH_BAN = {
  pool2: { yc: yeuCau(), cho: 2, loi: 2, giu: true },           // 2 platform threads, each held for the whole request
  loop: { yc: yeuCau(), cho: 1, loi: 1, giu: false },           // 1 event-loop thread, waits handled by the kernel
  chan: { yc: yeuCau({ 2: 6 }), cho: 1, loi: 1, giu: false },   // R3 burns 60 ms of CPU on the loop thread
  vt2: { yc: yeuCau(), cho: 2, loi: 2, giu: false },            // virtual threads on 2 carriers
};</code></pre></details>
<p>So với một loop khoẻ mạnh: cũng sáu request đó, mỗi cái 10 ms, xong trước 120 ms.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/591f31ea7129e8970108a84259d1164ec5812ace.svg" alt="Một event loop khoẻ mạnh: một luồng chạy mọi lát CPU trong khi nhân giữ hộ cả sáu lần chờ DB cùng lúc" loading="lazy" /><p class="chu-thich">🧮 Một event loop khoẻ mạnh: một luồng chạy mọi lát CPU trong khi nhân giữ hộ cả sáu lần chờ DB cùng lúc</p></div>
<p>Máy tính ra: R1 70 ms · R2 80 ms · R3 90 ms · R4 100 ms · R5 110 ms · R6 120 ms — trung bình <strong>95 ms</strong>, cuối cùng <strong>120 ms</strong>.</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const yeuCau = (cpuDau = {}) =&gt; Array.from({ length: 6 }, (_, i) =&gt; ({
  ten: &#96;R&#36;{i + 1}&#96;, pha: [{ cpu: cpuDau[i] ?? 1 }, { wait: 4 }, { cpu: 1 }],   // CPU 10 ms → wait 40 ms → CPU 10 ms
}));
const KICH_BAN = {
  pool2: { yc: yeuCau(), cho: 2, loi: 2, giu: true },           // 2 platform threads, each held for the whole request
  loop: { yc: yeuCau(), cho: 1, loi: 1, giu: false },           // 1 event-loop thread, waits handled by the kernel
  chan: { yc: yeuCau({ 2: 6 }), cho: 1, loi: 1, giu: false },   // R3 burns 60 ms of CPU on the loop thread
  vt2: { yc: yeuCau(), cho: 2, loi: 2, giu: false },            // virtual threads on 2 carriers
};</code></pre></details>
<p class="pitfall">⚠️ Nghi phạm quen mặt trên luồng chính: các API <code>*Sync</code> (<code>fs.readFileSync</code>, <code>crypto.pbkdf2Sync</code>, <code>bcrypt.hashSync</code>), <code>JSON.parse</code>/<code>JSON.stringify</code> trên đối tượng rất lớn, một biểu thức chính quy (regex) bị quay lui thảm hoạ (catastrophic backtracking), sắp xếp hay duyệt 100.000 dòng, xử lý ảnh hay PDF bằng JavaScript.</p>
<p class="meo">🧠 Luật vàng của event loop: <em>mọi callback phải ngắn</em>. "Ngắn" nghĩa là vài mili giây — một callback 2 giây là 2 giây sập dịch vụ với mọi người dùng.</p>`],
      [19, 'The fix: move CPU work off the main thread',
        `<p class="y-chinh">🎯 Same 2 s of CPU, but inside a <strong><code>worker_threads</code> Worker</strong>: the work still takes 2 s, yet every <code>/ping</code> during that time is answered in 1–5 ms, and the maximum event-loop delay drops from about <strong>2,000 ms to about 20 ms</strong>. Other users are no longer frozen.</p>
<p>A <code>Worker</code> is a real OS thread with its <em>own</em> V8 instance and its own event loop; it shares nothing with the main thread except what you explicitly pass (messages copied with <code>postMessage</code>, or a <code>SharedArrayBuffer</code>). In the server, <code>/block-worker</code> starts a worker that runs the same <code>burnCpu(2000)</code> and posts "ok" when done; the main thread just registers a <code>once('message')</code> callback and goes back to the loop. Look at the second client run on the previous slide's output: every ping between 0.54 s and 2.54 s took a few milliseconds, the <code>/block-worker</code> request itself answered after about 2 s, and <code>/lag</code> reported a maximum delay of about 20 ms.</p>
<p>Other ways to keep CPU work off the loop, from smallest to largest:</p>
<ul>
<li><strong>Use the asynchronous API</strong> when one exists: <code>crypto.pbkdf2</code> instead of <code>pbkdf2Sync</code>, <code>fs.promises.readFile</code> instead of <code>readFileSync</code> — they run on the libuv pool (slide 17).</li>
<li><strong>Split the work</strong> into small chunks and yield between them with <code>setImmediate</code>, so other callbacks can run in between (total time grows, latency for others stays low).</li>
<li><strong>A worker pool</strong> (a fixed number of workers reused, e.g. the <code>piscina</code> library) — creating a worker per request costs tens of milliseconds and memory.</li>
<li><strong>A job queue and a separate worker process</strong> (BullMQ on Redis, a cron job): the API only enqueues "generate report 42" and returns <code>202 Accepted</code>.</li>
</ul>
<p class="meo">🧠 The fix never makes the work itself faster; it moves it to a place where it does not stop <em>other</em> requests. That is exactly the restaurant rule: the waiter hands the cooking to the kitchen.</p>`,
        `<p class="y-chinh">🎯 Vẫn 2 s CPU đó, nhưng đặt trong một <strong>Worker của <code>worker_threads</code></strong>: công việc vẫn mất 2 s, nhưng mọi <code>/ping</code> trong khoảng đó được trả lời trong 1–5 ms, và độ trễ event loop tối đa tụt từ khoảng <strong>2.000 ms xuống khoảng 20 ms</strong>. Người dùng khác không còn bị đứng.</p>
<p>Một <code>Worker</code> là một luồng HĐH thật với phiên bản V8 <em>riêng</em> và event loop riêng; nó không dùng chung gì với luồng chính ngoài những thứ bạn chủ động trao (thông điệp được chép qua <code>postMessage</code>, hoặc một <code>SharedArrayBuffer</code>). Trong server, <code>/block-worker</code> khởi động một worker chạy cùng <code>burnCpu(2000)</code> và gửi "ok" khi xong; luồng chính chỉ đăng ký một callback <code>once('message')</code> rồi quay lại loop. Nhìn lần chạy client thứ hai trong output của slide trước: mọi ping từ 0,54 s tới 2,54 s đều mất vài mili giây, chính request <code>/block-worker</code> được trả lời sau khoảng 2 s, và <code>/lag</code> báo trễ tối đa khoảng 20 ms.</p>
<p>Những cách khác để giữ việc CPU ngoài loop, từ nhỏ tới lớn:</p>
<ul>
<li><strong>Dùng API bất đồng bộ</strong> khi có: <code>crypto.pbkdf2</code> thay cho <code>pbkdf2Sync</code>, <code>fs.promises.readFile</code> thay cho <code>readFileSync</code> — chúng chạy trên pool của libuv (slide 17).</li>
<li><strong>Chia nhỏ công việc</strong> thành từng mẩu và nhường loop giữa các mẩu bằng <code>setImmediate</code>, để callback khác chen vào chạy (tổng thời gian tăng, nhưng độ trễ của người khác vẫn thấp).</li>
<li><strong>Một pool worker</strong> (một số worker cố định dùng lại, ví dụ thư viện <code>piscina</code>) — tạo một worker cho mỗi request tốn vài chục mili giây và bộ nhớ.</li>
<li><strong>Một hàng đợi việc và một tiến trình worker riêng</strong> (BullMQ trên Redis, một cron job): API chỉ xếp hàng "tạo báo cáo 42" rồi trả <code>202 Accepted</code>.</li>
</ul>
<p class="meo">🧠 Cách sửa không bao giờ làm bản thân công việc nhanh hơn; nó chuyển công việc tới chỗ không làm dừng các request <em>khác</em>. Đó chính là luật của nhà hàng: bồi bàn đưa việc nấu cho bếp.</p>`],
      [20, 'Race condition: count++ is three steps',
        `<p class="y-chinh">🎯 <code>count++</code> is <strong>read – add – write</strong>, three steps. Two threads that both read 5, both compute 6 and both write 6 lose one increment. Two threads × 1,000,000 increments ended far below 2,000,000; the same loop with <code>synchronized</code> or <code>AtomicInteger</code> gives exactly 2,000,000 every time.</p>
<p>This is the race condition of lesson 2.C (Figure 2-21, the spooler directory), now in Java. On ARM64 (this container) or x86-64 the JIT compiles <code>count++</code> on a field into a load, an add and a store — separate machine instructions. Between the load and the store the other thread, running on another core at the same time, can do its own load. The table on the slide shows the bad interleaving step by step: both threads see 5, both write 6, and one "+1" disappears without any error message.</p>
<p>The program follows the rule from the course's runner notes: the two threads wait at a <code>CyclicBarrier</code> — a common starting line — so they really run at the same time even on a busy machine (otherwise one thread could finish before the other starts and no update would be lost).</p>
<pre><code class="language-java">// Slide 21: count++ is read–add–write; two threads lose updates, a lock or a CAS does not
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.atomic.AtomicInteger;

public class Race {
    static volatile int count = 0;            // shared, no lock (volatile only stops the JIT from merging the loop — still a race)
    static int safe = 0;
    static final Object lock = new Object();
    static final AtomicInteger atomic = new AtomicInteger();

    static void twoThreads(Runnable body) throws Exception {
        CyclicBarrier start = new CyclicBarrier(2);          // common starting line
        Runnable r = () -&gt; { try { start.await(); } catch (Exception e) { } body.run(); };
        Thread t1 = new Thread(r), t2 = new Thread(r);
        t1.start(); t2.start(); t1.join(); t2.join();
    }

    public static void main(String[] a) throws Exception {
        for (int round = 1; round &lt;= 3; round++) {
            count = 0; safe = 0; atomic.set(0);
            twoThreads(() -&gt; { for (int i = 0; i &lt; 1_000_000; i++) count++; });                          // RACE
            twoThreads(() -&gt; { for (int i = 0; i &lt; 1_000_000; i++) synchronized (lock) { safe++; } });     // lock
            twoThreads(() -&gt; { for (int i = 0; i &lt; 1_000_000; i++) atomic.incrementAndGet(); });          // CPU compare-and-swap
            System.out.printf("round %d: expected 2000000 | count++ = %d | synchronized = %d | AtomicInteger = %d%n",
                round, count, safe, atomic.get());
        }
    }
}</code></pre>
<div class="out">$ javac Race.java &amp;&amp; java Race<br>
round 1: expected 2000000 | count++ = 1169190 | synchronized = 2000000 | AtomicInteger = 2000000<br>
round 2: expected 2000000 | count++ = 1631285 | synchronized = 2000000 | AtomicInteger = 2000000<br>
round 3: expected 2000000 | count++ = 1261809 | synchronized = 2000000 | AtomicInteger = 2000000</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Read the three columns. <code>count++</code>: a different wrong number each round — hundreds of thousands of increments lost. <code>synchronized (lock) { safe++; }</code>: exactly 2,000,000; the lock makes the three steps a <strong>critical region</strong> that only one thread may be inside. <code>atomic.incrementAndGet()</code>: exactly 2,000,000 without a lock; the CPU executes a <strong>compare-and-swap</strong> (on ARM64 an <code>LDADD</code> or an exclusive load/store pair) that does read-add-write as one indivisible step.</p>
<p>Why the field is <code>volatile</code>: without it, the JIT may keep <code>count</code> in a register for the whole loop and write it once at the end — the race would still exist, but it would hide (one earlier run without <code>volatile</code> printed exactly 2,000,000 in two of three rounds). <code>volatile</code> forces every read and write to go to memory, which makes the race visible. It does <strong>not</strong> make <code>++</code> atomic — a classic interview trap.</p>
<p>🧭 In backend code the shared "counter" is usually not a field but a cache map, a static <code>SimpleDateFormat</code>, a singleton Spring bean with a mutable field, or a <code>HashMap</code> touched by request threads. Spring beans are singletons: any instance field you write from a controller is shared by all 200 request threads.</p>
<p class="meo">🧠 Three fixes, three costs: <em>a lock</em> (simple, serialises), <em>an atomic</em> (fast for one variable), <em>no sharing</em> (local variables, immutable objects, one owner thread) — the last one is the best.</p>`,
        `<p class="y-chinh">🎯 <code>count++</code> là <strong>đọc – cộng – ghi</strong>, ba bước. Hai luồng cùng đọc 5, cùng tính ra 6 và cùng ghi 6 thì mất một lần cộng. Hai luồng × 1.000.000 lần cộng ra kết quả thấp hơn 2.000.000 rất xa; cùng vòng lặp đó với <code>synchronized</code> hay <code>AtomicInteger</code> thì lần nào cũng đúng 2.000.000.</p>
<p>Đây là tranh chấp (race condition) của bài 2.C (Hình 2-21, thư mục spooler), giờ viết bằng Java. Trên ARM64 (container này) hay x86-64, JIT dịch <code>count++</code> trên một trường thành một lệnh nạp (load), một lệnh cộng và một lệnh lưu (store) — các lệnh máy riêng rẽ. Giữa lúc nạp và lúc lưu, luồng kia, đang chạy trên một lõi khác cùng lúc, có thể làm lệnh nạp của nó. Bảng trên slide cho thấy cách xen kẽ xấu từng bước: cả hai luồng thấy 5, cả hai ghi 6, và một lần "+1" biến mất mà không có thông báo lỗi nào.</p>
<p>Chương trình làm đúng luật trong ghi chú của bộ chạy khoá học: hai luồng chờ ở một <code>CyclicBarrier</code> — một vạch xuất phát chung — để chúng thật sự chạy cùng lúc ngay cả trên máy bận (nếu không, một luồng có thể chạy xong trước khi luồng kia bắt đầu và chẳng lần cộng nào bị mất).</p>
<pre><code class="language-java">// Slide 21: count++ là đọc–cộng–ghi; hai luồng làm mất lượt cộng, khoá hay CAS thì không
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.atomic.AtomicInteger;

public class Race {
    static volatile int count = 0;            // dùng chung, không khoá (volatile chỉ để JIT không gộp vòng lặp — VẪN tranh chấp)
    static int safe = 0;
    static final Object lock = new Object();
    static final AtomicInteger atomic = new AtomicInteger();

    static void twoThreads(Runnable body) throws Exception {
        CyclicBarrier start = new CyclicBarrier(2);          // vạch xuất phát chung
        Runnable r = () -&gt; { try { start.await(); } catch (Exception e) { } body.run(); };
        Thread t1 = new Thread(r), t2 = new Thread(r);
        t1.start(); t2.start(); t1.join(); t2.join();
    }

    public static void main(String[] a) throws Exception {
        for (int round = 1; round &lt;= 3; round++) {
            count = 0; safe = 0; atomic.set(0);
            twoThreads(() -&gt; { for (int i = 0; i &lt; 1_000_000; i++) count++; });                          // RACE
            twoThreads(() -&gt; { for (int i = 0; i &lt; 1_000_000; i++) synchronized (lock) { safe++; } });     // khoá
            twoThreads(() -&gt; { for (int i = 0; i &lt; 1_000_000; i++) atomic.incrementAndGet(); });          // CAS của CPU
            System.out.printf("round %d: expected 2000000 | count++ = %d | synchronized = %d | AtomicInteger = %d%n",
                round, count, safe, atomic.get());
        }
    }
}</code></pre>
<div class="out">$ javac Race.java &amp;&amp; java Race<br>
round 1: expected 2000000 | count++ = 1169190 | synchronized = 2000000 | AtomicInteger = 2000000<br>
round 2: expected 2000000 | count++ = 1631285 | synchronized = 2000000 | AtomicInteger = 2000000<br>
round 3: expected 2000000 | count++ = 1261809 | synchronized = 2000000 | AtomicInteger = 2000000</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Đọc ba cột. <code>count++</code>: mỗi vòng một con số sai khác nhau — mất hàng trăm nghìn lần cộng. <code>synchronized (lock) { safe++; }</code>: đúng 2.000.000; khoá biến ba bước thành một <strong>miền găng (critical region)</strong> chỉ một luồng được ở trong. <code>atomic.incrementAndGet()</code>: đúng 2.000.000 mà không cần khoá; CPU chạy một lệnh <strong>so-sánh-và-hoán-đổi (compare-and-swap, CAS)</strong> (trên ARM64 là <code>LDADD</code> hoặc một cặp nạp/lưu độc quyền) làm trọn đọc–cộng–ghi như một bước không chia cắt được.</p>
<p>Vì sao trường là <code>volatile</code>: thiếu nó, JIT có thể giữ <code>count</code> trong thanh ghi suốt vòng lặp rồi ghi một lần ở cuối — tranh chấp vẫn còn, nhưng bị giấu đi (một lần chạy trước đó không có <code>volatile</code> in ra đúng 2.000.000 ở hai trong ba vòng). <code>volatile</code> buộc mọi lần đọc và ghi phải đi ra bộ nhớ, làm tranh chấp lộ ra. Nó <strong>không</strong> làm <code>++</code> thành nguyên tử (atomic) — một bẫy phỏng vấn kinh điển.</p>
<p>🧭 Trong code backend, "biến đếm" dùng chung thường không phải một trường mà là một map làm cache, một <code>SimpleDateFormat</code> tĩnh, một bean Spring singleton có trường thay đổi được, hay một <code>HashMap</code> bị các luồng request đụng vào. Bean Spring là singleton: mọi trường thể hiện (instance field) bạn ghi từ controller đều bị cả 200 luồng request dùng chung.</p>
<p class="meo">🧠 Ba cách sửa, ba cái giá: <em>khoá</em> (đơn giản, tuần tự hoá), <em>biến nguyên tử</em> (nhanh cho một biến), <em>không chia sẻ</em> (biến cục bộ, đối tượng bất biến, một luồng sở hữu) — cách cuối là tốt nhất.</p>`],
      [21, 'Deadlock: two threads wait for each other forever',
        `<p class="y-chinh">🎯 T1 transfers A→B: it locks A, then wants B. T2 transfers B→A: it locks B, then wants A. Each holds what the other needs — a <strong>cycle</strong>, so nobody can ever move. <code>jstack</code> finds it for you: "<strong>Found one Java-level deadlock</strong>", with the two threads, the monitor each waits for and who holds it. On the server it looks like hanging requests at <strong>0 % CPU</strong>.</p>
<p>All four Coffman conditions of lesson 6.A are present: <code>synchronized</code> monitors are exclusive (mutual exclusion); each thread keeps its first lock while asking for the second (hold and wait); Java never takes a monitor away from a thread (no preemption); and T1 → B → T2 → A → T1 is a circular wait. The <code>Thread.sleep(100)</code> between the two locks only makes the bad timing certain — without it the deadlock is rare, which is worse: it happens once a week in production.</p>
<p>The run (also used on slide 8) starts the program, waits 3 s, then asks the JVM for a thread dump and keeps only the deadlock report:</p>
<div class="out"># Slides 8 and 22: a real deadlock, seen by jstack and by ps (each Java thread is a Linux task)<br>
$ java Deadlock &amp; sleep 3<br>
T1 (A-&gt;B) locked A, waiting for B<br>
T2 (B-&gt;A) locked B, waiting for A<br>
$ P=$(pgrep -x java); ls /proc/$P/task | wc -l<br>
20<br>
$ ps -L -o pid,lwp,stat,pcpu,comm -p $P | grep -E 'LWP|transfer'<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;&nbsp;LWP STAT %CPU COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;34 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;53 Sl &nbsp;&nbsp;&nbsp;0.0 transfer-A-to-B<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;34 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;54 Sl &nbsp;&nbsp;&nbsp;0.0 transfer-B-to-A<br>
$ jstack $P | sed -n '/Found one Java-level deadlock/,/Found 1 deadlock/p' | grep -v '^\\s*at \\|^\\s*- \\|Lambda\\|^$'<br>
Found one Java-level deadlock:<br>
=============================<br>
"transfer-A-to-B":<br>
&nbsp;&nbsp;waiting to lock monitor 0x0000ffff4c0107c0 (object 0x000000008bb13808, a java.lang.Object),<br>
&nbsp;&nbsp;which is held by "transfer-B-to-A"<br>
"transfer-B-to-A":<br>
&nbsp;&nbsp;waiting to lock monitor 0x0000ffff40032480 (object 0x000000008bb137f8, a java.lang.Object),<br>
&nbsp;&nbsp;which is held by "transfer-A-to-B"<br>
Java stack information for the threads listed above:<br>
===================================================<br>
"transfer-A-to-B":<br>
"transfer-B-to-A":<br>
Found 1 deadlock.<br>
$ kill -9 %1</div>
<p>How to read the report: <code>"transfer-A-to-B": waiting to lock monitor … (object …8, a java.lang.Object), which is held by "transfer-B-to-A"</code> — and the reverse for the other thread. The JVM builds the "waits-for" graph of lesson 6.A (threads → monitors → owners) and finds the cycle; that is why you should <strong>name your threads</strong> — "Thread-7" tells you nothing at 3 a.m. In the full dump each thread is in state <code>BLOCKED (on object monitor)</code> and the stack lines show the exact source line of each <code>synchronized</code>.</p>
<p>Fixes, in order of preference: one global <strong>lock order</strong> (always lock the account with the smaller id first — this breaks circular wait); <code>ReentrantLock.tryLock(timeout)</code> and back off on failure (breaks hold-and-wait); or avoid holding two locks at all (move the transfer into one database transaction and let the database order the row locks).</p>
<p>🧭 On a real server: <code>jstack &lt;pid&gt;</code> (or <code>jcmd &lt;pid&gt; Thread.print</code>, or <code>kill -3 &lt;pid&gt;</code> which prints the dump to the app's stdout — useful in a container) is the first command when a JVM hangs. Take two or three dumps a few seconds apart: threads that stay in the same <code>BLOCKED</code> line are the stuck ones.</p>
<p class="meo">🧠 Hang + 0 % CPU ⇒ think <em>lock cycle or waiting for a resource</em>; hang + 100 % CPU ⇒ think <em>infinite loop or GC</em>. One thread dump tells the two apart.</p>`,
        `<p class="y-chinh">🎯 T1 chuyển tiền A→B: nó khoá A, rồi cần B. T2 chuyển B→A: nó khoá B, rồi cần A. Mỗi bên giữ đúng thứ bên kia cần — một <strong>vòng tròn</strong>, nên không ai đi tiếp được nữa. <code>jstack</code> tìm hộ bạn: "<strong>Found one Java-level deadlock</strong>", kèm hai luồng, monitor mỗi luồng đang chờ và ai đang giữ nó. Trên server, nó trông như các request treo mà <strong>CPU 0 %</strong>.</p>
<p>Cả bốn điều kiện Coffman của bài 6.A đều có mặt: monitor <code>synchronized</code> là độc quyền (loại trừ lẫn nhau); mỗi luồng giữ khoá thứ nhất trong lúc xin khoá thứ hai (giữ và chờ); Java không bao giờ giật monitor khỏi một luồng (không trưng dụng); và T1 → B → T2 → A → T1 là chờ vòng tròn. Lệnh <code>Thread.sleep(100)</code> giữa hai lần khoá chỉ để thời điểm xấu chắc chắn xảy ra — thiếu nó, bế tắc hiếm gặp, mà như thế còn tệ hơn: nó xảy ra mỗi tuần một lần trên production.</p>
<p>Lần chạy (cũng dùng ở slide 8) khởi động chương trình, chờ 3 s, rồi xin JVM một bản thread dump và chỉ giữ phần báo cáo bế tắc:</p>
<div class="out"># Slide 8 và 22: một bế tắc thật, nhìn bằng jstack và bằng ps (mỗi luồng Java là một task Linux)<br>
$ java Deadlock &amp; sleep 3<br>
T1 (A-&gt;B) locked A, waiting for B<br>
T2 (B-&gt;A) locked B, waiting for A<br>
$ P=$(pgrep -x java); ls /proc/$P/task | wc -l<br>
20<br>
$ ps -L -o pid,lwp,stat,pcpu,comm -p $P | grep -E 'LWP|transfer'<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;&nbsp;LWP STAT %CPU COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;34 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;53 Sl &nbsp;&nbsp;&nbsp;0.0 transfer-A-to-B<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;34 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;54 Sl &nbsp;&nbsp;&nbsp;0.0 transfer-B-to-A<br>
$ jstack $P | sed -n '/Found one Java-level deadlock/,/Found 1 deadlock/p' | grep -v '^\\s*at \\|^\\s*- \\|Lambda\\|^$'<br>
Found one Java-level deadlock:<br>
=============================<br>
"transfer-A-to-B":<br>
&nbsp;&nbsp;waiting to lock monitor 0x0000ffff4c0107c0 (object 0x000000008bb13808, a java.lang.Object),<br>
&nbsp;&nbsp;which is held by "transfer-B-to-A"<br>
"transfer-B-to-A":<br>
&nbsp;&nbsp;waiting to lock monitor 0x0000ffff40032480 (object 0x000000008bb137f8, a java.lang.Object),<br>
&nbsp;&nbsp;which is held by "transfer-A-to-B"<br>
Java stack information for the threads listed above:<br>
===================================================<br>
"transfer-A-to-B":<br>
"transfer-B-to-A":<br>
Found 1 deadlock.<br>
$ kill -9 %1</div>
<p>Cách đọc báo cáo: <code>"transfer-A-to-B": waiting to lock monitor … (object …8, a java.lang.Object), which is held by "transfer-B-to-A"</code> — và ngược lại với luồng kia. JVM dựng đồ thị "ai chờ ai" của bài 6.A (luồng → monitor → chủ) và tìm ra vòng tròn; đó là lý do nên <strong>đặt tên cho luồng</strong> — "Thread-7" chẳng nói gì với bạn lúc 3 giờ sáng. Trong bản dump đầy đủ, mỗi luồng ở trạng thái <code>BLOCKED (on object monitor)</code> và các dòng ngăn xếp chỉ đúng dòng mã nguồn của từng <code>synchronized</code>.</p>
<p>Cách sửa, theo thứ tự nên chọn: một <strong>thứ tự khoá</strong> chung (luôn khoá tài khoản có id nhỏ hơn trước — phá điều kiện chờ vòng tròn); <code>ReentrantLock.tryLock(timeout)</code> và lùi lại khi thất bại (phá giữ-và-chờ); hoặc đừng giữ hai khoá cùng lúc (đưa việc chuyển tiền vào một giao dịch cơ sở dữ liệu và để cơ sở dữ liệu sắp thứ tự khoá dòng).</p>
<p>🧭 Trên server thật: <code>jstack &lt;pid&gt;</code> (hoặc <code>jcmd &lt;pid&gt; Thread.print</code>, hoặc <code>kill -3 &lt;pid&gt;</code> in bản dump ra stdout của app — tiện trong container) là lệnh đầu tiên khi một JVM treo. Chụp hai, ba bản dump cách nhau vài giây: luồng nào vẫn nằm ở cùng một dòng <code>BLOCKED</code> chính là luồng bị kẹt.</p>
<p class="meo">🧠 Treo + CPU 0 % ⇒ nghĩ tới <em>vòng khoá hoặc chờ tài nguyên</em>; treo + CPU 100 % ⇒ nghĩ tới <em>vòng lặp vô hạn hoặc GC</em>. Một bản thread dump phân biệt được hai trường hợp.</p>`],
      [22, 'The same race in the database: lost update',
        `<p class="y-chinh">🎯 Two "buy" requests run <code>SELECT stock</code> (both see 10), think for a moment, then both write <code>stock = 10 − 1</code>: the final stock is <strong>9 instead of 8</strong> — a <strong>lost update</strong>. Java locks cannot help, because the two requests may run on two servers. Fix it in the database: one atomic statement <code>UPDATE item SET stock = stock − 1 WHERE id = 1 AND stock &gt; 0</code>, or lock the row with <code>SELECT … FOR UPDATE</code>, or detect conflicts with a <code>version</code> column.</p>
<p>The slide shows the run on PostgreSQL 17.11 with two <code>psql</code> sessions. PostgreSQL's default isolation level, READ COMMITTED, allows this: each transaction reads the committed value 10, and each <code>UPDATE … SET stock = 9</code> is a legal write of a constant. The database did exactly what it was told; the bug is the read-modify-write split across two statements with application logic in between — the same three steps as <code>count++</code>, one level higher.</p>
<p>The course container has no PostgreSQL, so here is the same race with a file as the "table" and a shell script as the "request": read the stock, sleep 0.5 s (the app "thinks"), write stock − 1. Then the same two buyers again, but each wrapped in <code>flock stock.lock</code> — an exclusive lock around the whole read-modify-write, which is what <code>SELECT … FOR UPDATE</code> does to a row.</p>
<div class="out"># Slide 23: the lost update — two buyers read the same stock and both write stock - 1; flock = SELECT ... FOR UPDATE<br>
$ echo 10 &gt; stock<br>
$ ./_mua.sh A &amp; ./_mua.sh B &amp; wait<br>
A read 10, wrote 9<br>
B read 10, wrote 9<br>
$ cat stock<br>
9<br>
# with a lock around read-modify-write (the shell's version of SELECT ... FOR UPDATE)<br>
$ echo 10 &gt; stock<br>
$ flock stock.lock ./_mua.sh A &amp; flock stock.lock ./_mua.sh B &amp; wait<br>
A read 10, wrote 9<br>
B read 9, wrote 8<br>
$ cat stock<br>
8</div>
<p>Without the lock: both read 10, both wrote 9, final 9. With the lock: the second buyer waited for the first to finish, read <strong>9</strong> and wrote 8 — exactly the PostgreSQL <code>FOR UPDATE</code> line on the slide ("B waited and read 9 ⇒ final 8").</p>
<ul>
<li><strong>Atomic UPDATE</strong> — the database does the read-modify-write inside one statement while holding the row lock; also add <code>AND stock &gt; 0</code> and check "1 row updated" to refuse overselling.</li>
<li><strong><code>SELECT … FOR UPDATE</code></strong> (pessimistic) — when the app really must read, decide, then write; keep the transaction short.</li>
<li><strong>Optimistic locking</strong> — a <code>version</code> column (JPA <code>@Version</code>): <code>UPDATE … SET stock = 9, version = 6 WHERE id = 1 AND version = 5</code>; 0 rows updated ⇒ somebody else won, retry.</li>
</ul>
<p class="meo">🧠 Any "read, then write what you computed" across two statements is a race unless something locks or checks. MVCC, isolation levels and row locks are taught in full in cuongthai.com/courses/postgresql, Chapter 11.</p>`,
        `<p class="y-chinh">🎯 Hai request "mua hàng" chạy <code>SELECT stock</code> (cả hai thấy 10), nghĩ một chút, rồi cùng ghi <code>stock = 10 − 1</code>: tồn kho cuối cùng là <strong>9 thay vì 8</strong> — một <strong>cập nhật bị mất (lost update)</strong>. Khoá của Java không cứu được, vì hai request có thể chạy trên hai server khác nhau. Hãy sửa ngay trong cơ sở dữ liệu: một câu lệnh nguyên tử <code>UPDATE item SET stock = stock − 1 WHERE id = 1 AND stock &gt; 0</code>, hoặc khoá dòng bằng <code>SELECT … FOR UPDATE</code>, hoặc phát hiện xung đột bằng một cột <code>version</code>.</p>
<p>Slide cho thấy lần chạy trên PostgreSQL 17.11 với hai phiên <code>psql</code>. Mức cô lập (isolation level) mặc định của PostgreSQL là READ COMMITTED, cho phép chuyện này: mỗi giao dịch đọc giá trị đã commit là 10, và mỗi câu <code>UPDATE … SET stock = 9</code> là một lần ghi hằng số hợp lệ. Cơ sở dữ liệu làm đúng y lời được bảo; lỗi nằm ở chỗ đọc–sửa–ghi bị tách ra hai câu lệnh với logic của ứng dụng chen giữa — đúng ba bước của <code>count++</code>, chỉ ở tầng cao hơn.</p>
<p>Container của khoá học không có PostgreSQL, nên đây là cùng cuộc tranh chấp với một tệp đóng vai "bảng" và một script shell đóng vai "request": đọc tồn kho, ngủ 0,5 s (app "suy nghĩ"), ghi tồn − 1. Rồi lại đúng hai người mua đó, nhưng mỗi người được bọc trong <code>flock stock.lock</code> — một khoá độc quyền bao trọn đọc–sửa–ghi, đúng việc <code>SELECT … FOR UPDATE</code> làm với một dòng.</p>
<div class="out"># Slide 23: cập nhật bị mất — hai người mua đọc cùng tồn kho và cùng ghi tồn - 1; flock = SELECT ... FOR UPDATE<br>
$ echo 10 &gt; stock<br>
$ ./_mua.sh A &amp; ./_mua.sh B &amp; wait<br>
A read 10, wrote 9<br>
B read 10, wrote 9<br>
$ cat stock<br>
9<br>
# có khoá bọc đọc–sửa–ghi (phiên bản shell của SELECT ... FOR UPDATE)<br>
$ echo 10 &gt; stock<br>
$ flock stock.lock ./_mua.sh A &amp; flock stock.lock ./_mua.sh B &amp; wait<br>
A read 10, wrote 9<br>
B read 9, wrote 8<br>
$ cat stock<br>
8</div>
<p>Không khoá: cả hai đọc 10, cả hai ghi 9, cuối cùng 9. Có khoá: người mua thứ hai chờ người thứ nhất xong, đọc được <strong>9</strong> và ghi 8 — đúng như dòng <code>FOR UPDATE</code> của PostgreSQL trên slide ("B chờ rồi đọc 9 ⇒ cuối cùng 8").</p>
<ul>
<li><strong>UPDATE nguyên tử</strong> — cơ sở dữ liệu làm đọc–sửa–ghi bên trong một câu lệnh trong lúc giữ khoá dòng; thêm cả <code>AND stock &gt; 0</code> và kiểm "1 dòng được cập nhật" để không bán quá số hàng.</li>
<li><strong><code>SELECT … FOR UPDATE</code></strong> (bi quan) — khi app thật sự phải đọc, quyết định, rồi mới ghi; giữ giao dịch thật ngắn.</li>
<li><strong>Khoá lạc quan (optimistic locking)</strong> — một cột <code>version</code> (JPA <code>@Version</code>): <code>UPDATE … SET stock = 9, version = 6 WHERE id = 1 AND version = 5</code>; 0 dòng được cập nhật ⇒ có người khác thắng trước, thử lại.</li>
</ul>
<p class="meo">🧠 Mọi kiểu "đọc, rồi ghi thứ mình đã tính" trải trên hai câu lệnh đều là tranh chấp, trừ khi có thứ gì khoá hoặc kiểm. MVCC, mức cô lập và khoá dòng được dạy trọn ở cuongthai.com/courses/postgresql, Chương 11.</p>`],
      [23, 'Which model when?',
        `<p class="y-chinh">🎯 The comparison table in one line per row: platform threads give simple blocking code but a waiting request costs an OS thread (~2 MB stack) and the pool size (200) is the first limit; virtual threads keep the simple code, a waiting request costs a small heap object, and the first limits become the DB pool, memory and pinning; the event loop needs async code, a waiting request costs only a callback and a socket, and the first limit is CPU work on the main thread.</p>
<table>
<thead><tr><th>Question</th><th>Thread-per-request (platform)</th><th>Virtual threads (Java 21+)</th><th>Event loop (Node.js)</th></tr></thead>
<tbody>
<tr><td>How many concurrent waiting requests before trouble?</td><td>about the pool size (200 by default)</td><td>tens of thousands and more</td><td>tens of thousands and more</td></tr>
<tr><td>Where does a 50 ms CPU task hurt?</td><td>only its own request</td><td>its own request (and a carrier for 50 ms)</td><td>every request on the process</td></tr>
<tr><td>Debugging a hang</td><td>jstack: every request is a named thread</td><td>jcmd Thread.dump_to_file (JSON)</td><td>event-loop delay, --cpu-prof, clinic</td></tr>
<tr><td>Using all cores</td><td>automatic</td><td>automatic</td><td>one process per core (cluster, PM2, containers) or workers</td></tr>
<tr><td>Typical stack</td><td>Spring MVC (default)</td><td>Spring MVC + spring.threads.virtual.enabled</td><td>Express, NestJS, Fastify</td></tr>
</tbody>
</table>
<p>The bottom box of the slide is the deeper point: <strong>all three models end up in the same kernel</strong>. Threads of every kind become Linux tasks scheduled on cores (virtual threads via their carriers, Node via its main thread and workers), and "waiting for the network without a thread" is always <code>epoll</code> underneath — inside Tomcat's NIO poller, inside the JDK's virtual-thread poller, inside libuv. That is the subject of deck CS.4.</p>
<p>➕ What the choice depends on in practice: the team's language (Java team → Spring; JavaScript/TypeScript team → Node), the kind of work (mostly waiting on databases and APIs — all three are fine; heavy CPU per request — Java with a fixed pool, or Node with worker threads or a separate service), and operational habits (one Node process uses one core for JavaScript, so you run several processes behind a load balancer; one JVM uses all cores but needs heap tuning). The slide's "Typical" row is where you will meet each model at work.</p>
<p class="meo">🧠 There is no "fastest model" — there is a <em>cost per waiting request</em> and a <em>failure mode</em>. Know both for the stack you are using: Tomcat ⇒ pool exhaustion; virtual threads ⇒ DB pool and pinning; Node ⇒ blocked loop.</p>`,
        `<p class="y-chinh">🎯 Bảng so sánh, mỗi hàng một dòng: luồng platform cho code chặn đơn giản nhưng một request đang chờ tốn một luồng HĐH (~2 MB ngăn xếp) và cỡ pool (200) là giới hạn chạm đầu tiên; luồng ảo giữ code đơn giản, một request đang chờ tốn một đối tượng nhỏ trên heap, và giới hạn đầu tiên chuyển thành pool DB, bộ nhớ và pinning; event loop cần code bất đồng bộ, một request đang chờ chỉ tốn một callback và một socket, và giới hạn đầu tiên là việc CPU trên luồng chính.</p>
<table>
<thead><tr><th>Câu hỏi</th><th>Mỗi request một luồng (platform)</th><th>Luồng ảo (Java 21+)</th><th>Event loop (Node.js)</th></tr></thead>
<tbody>
<tr><td>Bao nhiêu request đang chờ cùng lúc thì bắt đầu có chuyện?</td><td>khoảng cỡ pool (mặc định 200)</td><td>hàng chục nghìn trở lên</td><td>hàng chục nghìn trở lên</td></tr>
<tr><td>Một việc CPU 50 ms gây hại ở đâu?</td><td>chỉ request của nó</td><td>request của nó (và một carrier trong 50 ms)</td><td>mọi request của tiến trình</td></tr>
<tr><td>Gỡ lỗi khi treo</td><td>jstack: mỗi request là một luồng có tên</td><td>jcmd Thread.dump_to_file (JSON)</td><td>độ trễ event loop, --cpu-prof, clinic</td></tr>
<tr><td>Dùng hết các lõi</td><td>tự động</td><td>tự động</td><td>mỗi lõi một tiến trình (cluster, PM2, container) hoặc worker</td></tr>
<tr><td>Bộ công nghệ điển hình</td><td>Spring MVC (mặc định)</td><td>Spring MVC + spring.threads.virtual.enabled</td><td>Express, NestJS, Fastify</td></tr>
</tbody>
</table>
<p>Ô cuối slide là ý sâu hơn: <strong>cả ba mô hình đều đi về cùng một nhân</strong>. Luồng loại nào cũng thành task Linux được lập lịch lên các lõi (luồng ảo qua carrier của nó, Node qua luồng chính và worker), và "chờ mạng mà không tốn luồng" bên dưới luôn là <code>epoll</code> — trong NIO poller của Tomcat, trong poller luồng ảo của JDK, trong libuv. Đó là chủ đề của deck CS.4.</p>
<p>➕ Thực tế việc chọn phụ thuộc vào: ngôn ngữ của nhóm (nhóm Java → Spring; nhóm JavaScript/TypeScript → Node), loại công việc (chủ yếu chờ cơ sở dữ liệu và API — cả ba đều ổn; mỗi request nặng CPU — Java với pool cố định, hoặc Node với worker thread hay một dịch vụ riêng), và thói quen vận hành (một tiến trình Node chỉ dùng một lõi cho JavaScript, nên bạn chạy nhiều tiến trình sau một bộ cân bằng tải; một JVM dùng mọi lõi nhưng cần chỉnh heap). Hàng "điển hình" trên slide là nơi bạn sẽ gặp từng mô hình khi đi làm.</p>
<p class="meo">🧠 Không có "mô hình nhanh nhất" — chỉ có <em>chi phí cho mỗi request đang chờ</em> và <em>kiểu hỏng</em>. Hãy biết cả hai cho bộ công nghệ bạn đang dùng: Tomcat ⇒ cạn pool; luồng ảo ⇒ pool DB và pinning; Node ⇒ loop bị chặn.</p>`],
      [24, '🧭 In our project: login runs on the event loop',
        `<p class="y-chinh">🎯 The backend of cuongthai.com (Node.js, <code>src/services/auth.service.ts</code>) hashes passwords with <strong>bcryptjs 2.4.3</strong>, a pure-JavaScript library, at cost 12. Measured with the same version and cost: one <code>compare</code> is about 0.8 s of CPU <strong>on the main thread</strong>; eight logins at once take about 8× as long (one core), and every other request feels event-loop stalls of up to about 0.86 s. <code>await</code> does not mean "another thread".</p>
<p>Why <code>await bcrypt.compare(…)</code> still hurts: bcryptjs's asynchronous API splits the work into slices and yields between them with <code>setImmediate</code>/<code>nextTick</code>, so the loop is not frozen for the whole 0.8 s — but every slice runs on the one JavaScript thread, so the CPU time is the same, other requests wait for the slices, and eight concurrent logins share a single core. The slide's numbers (measured with the real library: 853 ms for <code>compareSync</code> with an 855 ms stall, 817 ms for <code>await compare</code> with a 208 ms longest stall, 6,214 ms for eight at once with an 861 ms stall) show both effects.</p>
<p>The course container has no internet for <code>npm install bcryptjs</code>, so the run below shows the same phenomenon with Node's built-in PBKDF2: eight hashes with <code>pbkdf2Sync</code> on the main thread, then eight with the asynchronous <code>pbkdf2</code>, which runs in C++ on the libuv pool. A 1 ms heartbeat timer records the longest gap in the event loop:</p>
<pre><code class="language-javascript">// Slide 25: hashing a password ON the event loop (sync) vs on the libuv pool (async) — how long is everybody else frozen?
const crypto = require('node:crypto');

async function measure(label, fn) {
  let last = performance.now(), maxGap = 0;              // a 1 ms "heartbeat" timer records the longest gap
  const probe = setInterval(() =&gt; { const n = performance.now(); maxGap = Math.max(maxGap, n - last); last = n; }, 1);
  await new Promise((r) =&gt; setTimeout(r, 20));
  const t0 = performance.now(); await fn(); const ms = performance.now() - t0;
  await new Promise((r) =&gt; setTimeout(r, 20));
  clearInterval(probe);
  console.log(&#96;&#36;{label.padEnd(30)} &#36;{ms.toFixed(0).padStart(5)} ms   longest event-loop stall &#36;{maxGap.toFixed(0).padStart(4)} ms&#96;);
}
const ITER = 600_000;
const syncHash = () =&gt; crypto.pbkdf2Sync('pw', 'salt', ITER, 64, 'sha512');
const asyncHash = () =&gt; new Promise((ok) =&gt; crypto.pbkdf2('pw', 'salt', ITER, 64, 'sha512', ok));
(async () =&gt; {
  await measure('8 x pbkdf2Sync (main thread)', async () =&gt; { for (let i = 0; i &lt; 8; i++) syncHash(); });
  await measure('8 x pbkdf2 async (libuv pool)', () =&gt; Promise.all(Array.from({ length: 8 }, asyncHash)));
})();</code></pre>
<div class="out">$ node hash-loop.js<br>
8 x pbkdf2Sync (main thread) &nbsp;&nbsp;&nbsp;2910 ms &nbsp;&nbsp;longest event-loop stall 2910 ms<br>
8 x pbkdf2 async (libuv pool) &nbsp;&nbsp;&nbsp;806 ms &nbsp;&nbsp;longest event-loop stall &nbsp;&nbsp;&nbsp;9 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Read it: the synchronous version froze the loop for the <em>entire</em> time of all eight hashes (the longest stall equals the total time). The asynchronous version finished faster — four pool threads in parallel — and the loop's longest gap was a few milliseconds: other requests would not have noticed.</p>
<ul>
<li><strong>Native bcrypt or argon2</strong> (<code>bcrypt</code>, <code>argon2</code> packages): the hashing runs in C/C++ on the libuv pool, like <code>crypto.pbkdf2</code> above — the loop stays free, four logins hash in parallel (raise <code>UV_THREADPOOL_SIZE</code> for more).</li>
<li><strong>A worker</strong> (<code>worker_threads</code> or a pool such as piscina) if a pure-JS library must stay.</li>
<li><strong>Rate-limit the login route</strong> — a slow hash is deliberately expensive, so attackers can use it to burn your CPU.</li>
</ul>
<p class="pitfall">⚠️ Do not "fix" it by lowering the cost factor: cost 12 is what makes stolen hashes slow to crack. Move the work, do not weaken it — and measure on the real server before and after, because the absolute milliseconds on a VPS differ from a laptop.</p>
<p class="meo">🧠 Ask of every library you <code>await</code>: <em>where does its CPU work run?</em> On the main thread (pure JS), on the libuv pool (native addon), or in another process?</p>`,
        `<p class="y-chinh">🎯 Backend của cuongthai.com (Node.js, <code>src/services/auth.service.ts</code>) băm mật khẩu bằng <strong>bcryptjs 2.4.3</strong>, một thư viện JavaScript thuần, với cost 12. Đo với đúng phiên bản và cost đó: một lần <code>compare</code> tốn khoảng 0,8 s CPU <strong>trên luồng chính</strong>; tám lần đăng nhập cùng lúc mất khoảng gấp 8 (một lõi), và mọi request khác cảm nhận những lần event loop bị đứng tới khoảng 0,86 s. <code>await</code> không có nghĩa là "một luồng khác".</p>
<p>Vì sao <code>await bcrypt.compare(…)</code> vẫn gây hại: API bất đồng bộ của bcryptjs chia việc thành từng lát và nhường loop giữa các lát bằng <code>setImmediate</code>/<code>nextTick</code>, nên loop không bị đứng trọn 0,8 s — nhưng mọi lát đều chạy trên luồng JavaScript duy nhất, nên thời gian CPU vẫn vậy, request khác phải chờ các lát, và tám lần đăng nhập đồng thời dùng chung một lõi. Số trên slide (đo bằng thư viện thật: 853 ms cho <code>compareSync</code> với lần đứng 855 ms, 817 ms cho <code>await compare</code> với lần đứng dài nhất 208 ms, 6.214 ms cho tám lần cùng lúc với lần đứng 861 ms) cho thấy cả hai tác động.</p>
<p>Container của khoá học không có internet để <code>npm install bcryptjs</code>, nên lần chạy dưới đây cho thấy cùng hiện tượng bằng PBKDF2 có sẵn của Node: tám lần băm bằng <code>pbkdf2Sync</code> trên luồng chính, rồi tám lần bằng <code>pbkdf2</code> bất đồng bộ, chạy bằng C++ trên pool của libuv. Một timer "nhịp tim" 1 ms ghi lại khoảng hở dài nhất của event loop:</p>
<pre><code class="language-javascript">// Slide 25: băm mật khẩu TRÊN event loop (sync) vs trên pool của libuv (async) — mọi người khác bị đứng bao lâu?
const crypto = require('node:crypto');

async function measure(label, fn) {
  let last = performance.now(), maxGap = 0;              // bộ nhịp 1 ms ghi khoảng hở dài nhất
  const probe = setInterval(() =&gt; { const n = performance.now(); maxGap = Math.max(maxGap, n - last); last = n; }, 1);
  await new Promise((r) =&gt; setTimeout(r, 20));
  const t0 = performance.now(); await fn(); const ms = performance.now() - t0;
  await new Promise((r) =&gt; setTimeout(r, 20));
  clearInterval(probe);
  console.log(&#96;&#36;{label.padEnd(30)} &#36;{ms.toFixed(0).padStart(5)} ms   longest event-loop stall &#36;{maxGap.toFixed(0).padStart(4)} ms&#96;);
}
const ITER = 600_000;
const syncHash = () =&gt; crypto.pbkdf2Sync('pw', 'salt', ITER, 64, 'sha512');
const asyncHash = () =&gt; new Promise((ok) =&gt; crypto.pbkdf2('pw', 'salt', ITER, 64, 'sha512', ok));
(async () =&gt; {
  await measure('8 x pbkdf2Sync (main thread)', async () =&gt; { for (let i = 0; i &lt; 8; i++) syncHash(); });
  await measure('8 x pbkdf2 async (libuv pool)', () =&gt; Promise.all(Array.from({ length: 8 }, asyncHash)));
})();</code></pre>
<div class="out">$ node hash-loop.js<br>
8 x pbkdf2Sync (main thread) &nbsp;&nbsp;&nbsp;2910 ms &nbsp;&nbsp;longest event-loop stall 2910 ms<br>
8 x pbkdf2 async (libuv pool) &nbsp;&nbsp;&nbsp;806 ms &nbsp;&nbsp;longest event-loop stall &nbsp;&nbsp;&nbsp;9 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Đọc: bản đồng bộ làm đứng loop <em>suốt</em> thời gian của cả tám lần băm (lần đứng dài nhất bằng tổng thời gian). Bản bất đồng bộ xong nhanh hơn — bốn luồng pool chạy song song — và khoảng hở dài nhất của loop chỉ vài mili giây: request khác sẽ không nhận ra.</p>
<ul>
<li><strong>bcrypt hoặc argon2 bản native</strong> (gói <code>bcrypt</code>, <code>argon2</code>): việc băm chạy bằng C/C++ trên pool của libuv, như <code>crypto.pbkdf2</code> ở trên — loop vẫn rảnh, bốn lần đăng nhập băm song song (tăng <code>UV_THREADPOOL_SIZE</code> nếu cần nhiều hơn).</li>
<li><strong>Một worker</strong> (<code>worker_threads</code> hoặc một pool như piscina) nếu buộc phải giữ thư viện JS thuần.</li>
<li><strong>Giới hạn tốc độ route đăng nhập</strong> — hàm băm chậm cố ý đắt, nên kẻ tấn công có thể lợi dụng nó để đốt CPU của bạn.</li>
</ul>
<p class="pitfall">⚠️ Đừng "sửa" bằng cách hạ cost: cost 12 chính là thứ làm cho các bản băm bị đánh cắp khó bẻ. Hãy chuyển công việc đi chỗ khác, đừng làm nó yếu đi — và đo trên server thật trước và sau, vì số mili giây tuyệt đối trên VPS khác với laptop.</p>
<p class="meo">🧠 Với mọi thư viện bạn <code>await</code>, hãy hỏi: <em>việc CPU của nó chạy ở đâu?</em> Trên luồng chính (JS thuần), trên pool của libuv (addon native), hay ở một tiến trình khác?</p>`],
      [25, '🧭 On a real server: the accept queue overflows',
        `<p class="y-chinh">🎯 With virtual threads and Tomcat's default <code>accept-count=100</code>, a burst of 600 connections made a few requests take about <strong>2 s instead of 1 s</strong>, and the kernel counter <code>TcpExt ListenOverflows</code> grew by <strong>+204</strong>. With <code>accept-count=1000</code>: no tail (max ≈ 1.1 s) and <strong>+0</strong> overflows. Not an error message anywhere — just a mysterious "+1 s" for some users.</p>
<p>What happens in the kernel: when a client's SYN arrives, the kernel completes the TCP handshake and puts the new connection into the listening socket's <strong>accept queue</strong>, whose length is the <code>backlog</code> passed to <code>listen()</code> (capped by <code>net.core.somaxconn</code>, 4096 in this container). The application takes connections from that queue with <code>accept()</code>. If 600 connections arrive within a millisecond and the queue holds 100, the rest cannot be queued; Linux then drops the handshake, counts it in <code>ListenOverflows</code>/<code>ListenDrops</code>, and the client — which does not get a reply — retransmits its SYN after the initial retransmission timeout of about <strong>1 second</strong>. The connection then succeeds, one second late.</p>
<p>That explains the slide's numbers: the median stays at about 1.08 s (most connections fit), but the maximum jumps to 2.07–2.09 s (the retried ones), and only when the burst is larger than the backlog. The second block of output, with a backlog of 1,000, has neither the tail nor any new overflow — the proof that the backlog, not the threads, caused it. The course's own run on slide 6 uses a backlog of 1,000 for this reason.</p>
<p>How to see it on a server: <code>nstat -az TcpExtListenOverflows TcpExtListenDrops</code> or <code>netstat -s | grep -i listen</code>; <code>ss -lnt</code> shows, for each listening socket, <code>Recv-Q</code> (connections waiting right now) and <code>Send-Q</code> (the backlog). Fixes: raise the backlog (<code>server.tomcat.accept-count</code>, the <code>backlog</code> option of Node's <code>server.listen</code>, nginx's <code>listen … backlog=</code>) together with <code>net.core.somaxconn</code>, and accept faster.</p>
<p>🧭 The "classic hang" box on the slide is a different, very common pattern (not measured here): the database gets slow, all 200 Tomcat threads wait on it, even <code>/health</code> cannot get a thread, and the load balancer restarts a healthy app. A thread dump showing 200 threads in the same JDBC call, plus a full HikariCP pool, is the signature.</p>
<p class="meo">🧠 A latency tail of almost exactly <em>+1 s</em> (or +3 s on older systems) smells of a dropped SYN; check the listen counters before you blame the code.</p>`,
        `<p class="y-chinh">🎯 Với luồng ảo và <code>accept-count=100</code> mặc định của Tomcat, một đợt 600 kết nối làm vài request mất khoảng <strong>2 s thay vì 1 s</strong>, và bộ đếm của nhân <code>TcpExt ListenOverflows</code> tăng <strong>+204</strong>. Với <code>accept-count=1000</code>: không có đuôi (max ≈ 1,1 s) và <strong>+0</strong> lần tràn. Không có thông báo lỗi ở đâu cả — chỉ là một khoản "+1 s" bí ẩn với một số người dùng.</p>
<p>Chuyện gì xảy ra trong nhân: khi gói SYN của client tới, nhân hoàn tất bắt tay TCP rồi đặt kết nối mới vào <strong>hàng đợi accept</strong> của socket đang nghe, độ dài của nó là <code>backlog</code> truyền cho <code>listen()</code> (bị chặn trần bởi <code>net.core.somaxconn</code>, 4096 trong container này). Ứng dụng lấy kết nối khỏi hàng đợi đó bằng <code>accept()</code>. Nếu 600 kết nối tới trong một mili giây mà hàng đợi chứa 100, phần còn lại không xếp vào được; Linux khi đó bỏ cuộc bắt tay, đếm vào <code>ListenOverflows</code>/<code>ListenDrops</code>, còn client — không nhận được trả lời — gửi lại SYN sau thời gian chờ gửi lại ban đầu khoảng <strong>1 giây</strong>. Kết nối sau đó thành công, trễ một giây.</p>
<p>Điều đó giải thích các con số trên slide: trung vị vẫn khoảng 1,08 s (phần lớn kết nối vừa hàng đợi), nhưng max nhảy lên 2,07–2,09 s (những kết nối phải gửi lại), và chỉ khi đợt dồn lớn hơn backlog. Khối output thứ hai, với backlog 1.000, không có đuôi lẫn lần tràn mới nào — bằng chứng thủ phạm là backlog chứ không phải luồng. Lần chạy riêng của khoá học ở slide 6 dùng backlog 1.000 cũng vì lý do này.</p>
<p>Cách nhìn thấy trên server: <code>nstat -az TcpExtListenOverflows TcpExtListenDrops</code> hoặc <code>netstat -s | grep -i listen</code>; <code>ss -lnt</code> cho thấy, với mỗi socket đang nghe, <code>Recv-Q</code> (kết nối đang chờ ngay lúc đó) và <code>Send-Q</code> (backlog). Cách sửa: tăng backlog (<code>server.tomcat.accept-count</code>, tuỳ chọn <code>backlog</code> của <code>server.listen</code> trong Node, <code>listen … backlog=</code> của nginx) cùng với <code>net.core.somaxconn</code>, và accept nhanh hơn.</p>
<p>🧭 Ô "classic hang" trên slide là một kiểu khác, rất phổ biến (không đo ở đây): cơ sở dữ liệu chậm đi, cả 200 luồng Tomcat chờ nó, đến <code>/health</code> cũng không có luồng để chạy, và bộ cân bằng tải khởi động lại một app vốn khoẻ. Dấu hiệu nhận ra: thread dump có 200 luồng nằm cùng một lời gọi JDBC, cộng với pool HikariCP đã đầy.</p>
<p class="meo">🧠 Một cái đuôi độ trễ gần đúng <em>+1 s</em> (hoặc +3 s trên hệ thống cũ) là mùi của gói SYN bị bỏ; hãy xem bộ đếm listen trước khi đổ lỗi cho code.</p>`],
      [26, '🎤 Interview questions you will hear',
        `<p class="y-chinh">🎯 Six questions that come up in almost every backend interview, with the short answer from the slide. Practise saying each answer aloud in under 30 seconds, then add one fact you measured in this deck — interviewers remember candidates who quote a real number.</p>
<ul>
<li><strong>Process vs thread?</strong> Threads of a process share its memory and open files; processes are isolated from each other. On Linux both are tasks created by <code>clone()</code>; threads just share more. (Measured: a Java thread shows up in <code>/proc/&lt;pid&gt;/task</code>, slide 8.)</li>
<li><strong>How does Node handle many users with one thread?</strong> Non-blocking I/O: the event loop asks the kernel (epoll) to report ready sockets and runs short callbacks; file, DNS-lookup and crypto work goes to the libuv pool of 4. The rule: never block the loop. (Measured: one 2 s handler made every ping wait up to 2 s.)</li>
<li><strong>nextTick vs Promise vs setTimeout vs setImmediate?</strong> Synchronous code, then <code>process.nextTick</code>, then promise microtasks, then macrotasks by phase: timers, poll, check. setTimeout 0 vs setImmediate is non-deterministic in the main module and setImmediate-first inside I/O callbacks.</li>
<li><strong>How big should a thread pool be?</strong> CPU-bound ≈ number of cores; IO-bound ≈ cores × (1 + W/C) (Goetz); check with Little's law (busy threads = throughput × latency); then measure. (Measured: the knee at exactly 10 threads on 1 CPU.)</li>
<li><strong>What are virtual threads, and when not to use them?</strong> JVM-managed threads that unmount from carrier OS threads while blocking, so a waiting request is cheap. Not for CPU-bound work; on Java 21 beware pinning in <code>synchronized</code>; the DB pool is still the limit; never pool them.</li>
<li><strong>How do you find a deadlock in production?</strong> A thread dump (<code>jstack</code>, <code>jcmd Thread.print</code>, <code>kill -3</code>): the JVM reports "Found one Java-level deadlock". Prevent it with one global lock order or <code>tryLock</code> with a timeout.</li>
</ul>
<p>➕ Likely follow-ups: "what is a context switch and what does it cost?" (saving and loading registers, switching address space for processes, cold caches — microseconds), "mutex vs semaphore?" (ownership and counting; lesson 2.C), "is <code>volatile</code> enough for a counter?" (no — slide 20), "why does <code>ConcurrentHashMap</code> exist?" (a <code>HashMap</code> is not safe under concurrent writes), "how do you scale Node to all cores?" (several processes or worker threads).</p>
<p class="meo">🧠 Structure every answer as <em>definition → mechanism → what goes wrong → how you would see it</em>. The last part is what separates "read about it" from "has run it".</p>`,
        `<p class="y-chinh">🎯 Sáu câu hỏi xuất hiện trong gần như mọi buổi phỏng vấn backend, kèm câu trả lời ngắn trên slide. Hãy tập nói to từng câu trả lời trong dưới 30 giây, rồi thêm một sự thật bạn đã đo trong deck này — người phỏng vấn nhớ những ứng viên trích được một con số thật.</p>
<ul>
<li><strong>Tiến trình vs luồng?</strong> Các luồng của một tiến trình dùng chung bộ nhớ và các tệp đang mở của nó; các tiến trình cách ly với nhau. Trên Linux cả hai đều là task sinh ra bằng <code>clone()</code>; luồng chỉ dùng chung nhiều hơn. (Đã đo: một luồng Java hiện ra trong <code>/proc/&lt;pid&gt;/task</code>, slide 8.)</li>
<li><strong>Node phục vụ nhiều người dùng bằng một luồng thế nào?</strong> I/O không chặn: event loop nhờ nhân (epoll) báo các socket đã sẵn sàng và chạy các callback ngắn; việc tệp, tra DNS và mật mã đi vào pool 4 luồng của libuv. Luật: không bao giờ chặn loop. (Đã đo: một handler 2 s làm mọi ping chờ tới 2 s.)</li>
<li><strong>nextTick vs Promise vs setTimeout vs setImmediate?</strong> Code đồng bộ, rồi <code>process.nextTick</code>, rồi microtask của promise, rồi macrotask theo pha: timers, poll, check. setTimeout 0 vs setImmediate không tất định ở module chính và setImmediate đi trước khi ở trong callback I/O.</li>
<li><strong>Thread pool nên to cỡ nào?</strong> CPU-bound ≈ số lõi; IO-bound ≈ số lõi × (1 + W/C) (Goetz); kiểm bằng định luật Little (số luồng bận = thông lượng × độ trễ); rồi đo. (Đã đo: điểm gãy đúng 10 luồng trên 1 CPU.)</li>
<li><strong>Luồng ảo là gì, khi nào không nên dùng?</strong> Luồng do JVM quản lý, được tháo khỏi luồng HĐH carrier trong lúc chặn, nên một request đang chờ rất rẻ. Không dùng cho việc CPU-bound; trên Java 21 coi chừng pinning trong <code>synchronized</code>; pool DB vẫn là giới hạn; không bao giờ gom chúng vào pool.</li>
<li><strong>Tìm bế tắc trên production thế nào?</strong> Một bản thread dump (<code>jstack</code>, <code>jcmd Thread.print</code>, <code>kill -3</code>): JVM báo "Found one Java-level deadlock". Ngăn bằng một thứ tự khoá chung hoặc <code>tryLock</code> có hạn chờ.</li>
</ul>
<p>➕ Câu hỏi đào sâu hay gặp: "chuyển ngữ cảnh (context switch) là gì và tốn gì?" (lưu và nạp thanh ghi, đổi không gian địa chỉ nếu là tiến trình, cache bị nguội — cỡ micro giây), "mutex vs semaphore?" (quyền sở hữu và bộ đếm; bài 2.C), "<code>volatile</code> có đủ cho một biến đếm không?" (không — slide 20), "vì sao có <code>ConcurrentHashMap</code>?" (<code>HashMap</code> không an toàn khi bị ghi đồng thời), "làm sao cho Node dùng hết các lõi?" (nhiều tiến trình hoặc worker thread).</p>
<p class="meo">🧠 Dựng mọi câu trả lời theo khung <em>định nghĩa → cơ chế → hỏng thế nào → nhìn thấy nó bằng cách nào</em>. Phần cuối là thứ phân biệt "đã đọc về nó" với "đã chạy nó".</p>`],
      [27, 'Self-check',
        `<p class="y-chinh">🎯 Three questions, answers on the slide. (1) Spring MVC, default pool, 600 requests each waiting 1 s for the DB: about <strong>3 s</strong> until the last answer (3 waves of 200, measured 3.08 s), and <code>spring.threads.virtual.enabled=true</code> brings the median to about 1.1 s. (2) Inside an <code>fs.readFile</code> callback, <code>setImmediate</code> prints before <code>setTimeout(f, 0)</code> — always. (3) <code>SELECT stock</code> then <code>UPDATE … SET stock = :old − 1</code> from two requests is a <strong>lost update</strong> (10 → 9 instead of 8); fix with <code>SET stock = stock − 1</code> in one statement or with <code>SELECT … FOR UPDATE</code>.</p>
<p>Before you look at the answers, work them out the way the deck taught you. For question 1, use the rule from slide 7: time ≈ ceil(600 ÷ 200) × 1 s. Then ask what changes the denominator — more threads, or threads that cost nothing while they wait. For question 2, locate yourself in the loop: an I/O callback runs in phase 4 (poll); which phase comes next, and which queue does each call add to? For question 3, write the two sessions as a timeline (read, read, write, write) and see which write is overwritten.</p>
<p>➕ Three extra questions to test yourself, with answers in the deck: (a) Your Node server has <code>UV_THREADPOOL_SIZE</code> unset and eight users upload files at once while four <code>crypto.scrypt</code> calls are running — why are the uploads slow? (slide 17: the pool of 4 is full.) (b) A Java service on virtual threads hangs with 0 % CPU and its logs show <code>synchronized</code> around an HTTP call — what do you suspect on Java 21, and what changed in JDK 24? (slide 13: pinning; JEP 491.) (c) Two threads each loop <code>count++</code> a million times on a <code>volatile int</code>; can the result be exactly 2,000,000? (Yes, sometimes — if they happen not to overlap — which is why the program used a barrier; but it is never guaranteed.)</p>
<p class="meo">🧠 If you could answer all six without looking, you are ready for the 🧪 exercises of lesson CS.3 and the quiz. If not, the slide number next to each answer tells you where to go back to.</p>`,
        `<p class="y-chinh">🎯 Ba câu hỏi, đáp án có trên slide. (1) Spring MVC, pool mặc định, 600 request mỗi cái chờ DB 1 s: khoảng <strong>3 s</strong> tới câu trả lời cuối (3 đợt 200, đo được 3,08 s), và <code>spring.threads.virtual.enabled=true</code> kéo trung vị về khoảng 1,1 s. (2) Bên trong callback của <code>fs.readFile</code>, <code>setImmediate</code> in trước <code>setTimeout(f, 0)</code> — luôn luôn. (3) <code>SELECT stock</code> rồi <code>UPDATE … SET stock = :old − 1</code> từ hai request là một <strong>lost update</strong> (10 → 9 thay vì 8); sửa bằng <code>SET stock = stock − 1</code> trong một câu lệnh hoặc bằng <code>SELECT … FOR UPDATE</code>.</p>
<p>Trước khi nhìn đáp án, hãy tự giải theo cách bộ slide đã dạy. Câu 1, dùng quy tắc ở slide 7: thời gian ≈ trần(600 ÷ 200) × 1 s. Rồi hỏi cái gì đổi được mẫu số — thêm luồng, hay có những luồng không tốn gì khi chờ. Câu 2, xác định mình đang ở đâu trong loop: callback I/O chạy ở pha 4 (poll); pha nào đến tiếp theo, và mỗi lời gọi thêm vào hàng đợi nào? Câu 3, viết hai phiên thành một dòng thời gian (đọc, đọc, ghi, ghi) và xem lần ghi nào bị ghi đè.</p>
<p>➕ Ba câu thêm để tự kiểm tra, đáp án nằm trong deck: (a) Server Node của bạn không đặt <code>UV_THREADPOOL_SIZE</code>, tám người dùng tải tệp lên cùng lúc trong khi bốn lời gọi <code>crypto.scrypt</code> đang chạy — vì sao tải lên chậm? (slide 17: pool 4 luồng đã đầy.) (b) Một dịch vụ Java chạy luồng ảo bị treo với CPU 0 % và log cho thấy <code>synchronized</code> bọc quanh một lời gọi HTTP — bạn nghi gì trên Java 21, và JDK 24 đã đổi gì? (slide 13: pinning; JEP 491.) (c) Hai luồng mỗi luồng lặp <code>count++</code> một triệu lần trên một <code>volatile int</code>; kết quả có thể đúng 2.000.000 không? (Có, đôi khi — nếu tình cờ chúng không chạy chồng lên nhau — vì thế chương trình mới dùng vạch xuất phát chung; nhưng không bao giờ được bảo đảm.)</p>
<p class="meo">🧠 Nếu trả lời được cả sáu câu mà không nhìn, bạn đã sẵn sàng cho phần 🧪 bài tập của CS.3 và bài quiz. Nếu chưa, số slide cạnh mỗi đáp án cho biết cần quay lại đâu.</p>`],
      [28, 'Summary and what is next',
        `<p class="y-chinh">🎯 Five lines to keep: thread-per-request is simple but a waiting request holds an OS thread (Tomcat caps at 200); pool size ≈ cores for CPU-bound and ≈ cores × (1 + W/C) for IO-bound, then measure; virtual threads give blocking code event-loop-like scale (50 s → 1 s for 10,000 waits); Node is one JavaScript thread + epoll + a libuv pool of 4, microtasks before macrotasks, never block the loop; shared data needs atomic steps — locks or atomics in Java, one SQL statement or <code>FOR UPDATE</code> in the database.</p>
<p>Put the deck together as one story. Every model must answer "what does a waiting request occupy?" Platform threads answer "a whole OS thread", so the pool runs out and requests come in waves. Virtual threads answer "a small heap object", so waiting is free and the limits move to the database pool and to pinning. The event loop answers "a callback", so waiting is free but every millisecond of CPU on the loop is stolen from everybody. And in every model, when two flows of execution share data — a counter, two accounts, a row in a table — you need an atomic step or a lock, and you must avoid cycles of locks.</p>
<p>What you can now do on a real server: read thread names and states (<code>ps -L</code>, <code>/proc/&lt;pid&gt;/task</code>, <code>jstack</code>), count Node's threads, measure event-loop delay, size a pool from a formula and check it, spot a lost update in SQL, and explain a "+1 s" tail by the accept queue. Practice them in the 🧪 lesson CS.3 (exercises with real runs) and test yourself with the CS.3 quiz.</p>
<p>➕ Next deck, <strong>CS.4 — Async I/O &amp; epoll</strong>: the black box of this deck opened. How can one thread watch 10,000 sockets? The five I/O models, why <code>select</code> and <code>poll</code> do not scale, an echo server in C written with <code>epoll_create1</code>/<code>epoll_ctl</code>/<code>epoll_wait</code>, level- vs edge-triggered events, and <code>strace</code> showing Node itself calling <code>epoll_wait</code>.</p>
<p class="meo">🧠 The deck in one sentence, again: <em>a thread that waits still costs a thread — choose the model whose waiting is cheap, keep CPU work where it cannot block others, and make every shared update atomic.</em></p>`,
        `<p class="y-chinh">🎯 Năm dòng cần giữ: mỗi request một luồng thì đơn giản nhưng một request đang chờ giữ một luồng HĐH (Tomcat chặn trần ở 200); cỡ pool ≈ số lõi cho việc CPU-bound và ≈ số lõi × (1 + W/C) cho việc IO-bound, rồi đo; luồng ảo cho code chặn quy mô kiểu event loop (50 s → 1 s cho 10.000 lần chờ); Node là một luồng JavaScript + epoll + pool 4 luồng của libuv, microtask trước macrotask, không bao giờ chặn loop; dữ liệu dùng chung cần bước nguyên tử — khoá hay biến atomic trong Java, một câu SQL hay <code>FOR UPDATE</code> trong cơ sở dữ liệu.</p>
<p>Ghép cả deck thành một câu chuyện. Mô hình nào cũng phải trả lời "một request đang chờ chiếm cái gì?". Luồng platform trả lời "cả một luồng HĐH", nên pool cạn và request đến từng đợt. Luồng ảo trả lời "một đối tượng nhỏ trên heap", nên chờ là miễn phí và giới hạn chuyển sang pool cơ sở dữ liệu và chuyện pinning. Event loop trả lời "một callback", nên chờ là miễn phí nhưng mỗi mili giây CPU trên loop bị lấy đi của tất cả mọi người. Và ở mô hình nào cũng vậy, khi hai dòng thực thi dùng chung dữ liệu — một biến đếm, hai tài khoản, một dòng trong bảng — bạn cần một bước nguyên tử hoặc một khoá, và phải tránh vòng khoá.</p>
<p>Những việc giờ bạn làm được trên server thật: đọc tên và trạng thái luồng (<code>ps -L</code>, <code>/proc/&lt;pid&gt;/task</code>, <code>jstack</code>), đếm luồng của Node, đo độ trễ event loop, chọn cỡ pool từ công thức rồi kiểm lại, nhận ra lost update trong SQL, và giải thích một cái đuôi "+1 s" bằng hàng đợi accept. Luyện chúng ở bài 🧪 CS.3 (bài tập có lời giải chạy thật) và tự kiểm tra bằng quiz CS.3.</p>
<p>➕ Deck kế tiếp, <strong>CS.4 — I/O bất đồng bộ &amp; epoll</strong>: mở chiếc hộp đen của deck này. Một luồng theo dõi 10.000 socket bằng cách nào? Năm mô hình I/O, vì sao <code>select</code> và <code>poll</code> không mở rộng được, một echo server viết bằng C với <code>epoll_create1</code>/<code>epoll_ctl</code>/<code>epoll_wait</code>, sự kiện kích theo mức (level-triggered) vs theo sườn (edge-triggered), và <code>strace</code> cho thấy chính Node gọi <code>epoll_wait</code>.</p>
<p class="meo">🧠 Cả deck trong một câu, lần nữa: <em>một luồng đứng chờ vẫn tốn một luồng — hãy chọn mô hình mà việc chờ rẻ, đặt việc CPU ở chỗ không chặn được người khác, và làm mọi cập nhật dùng chung thành nguyên tử.</em></p>`],
    ]),
    books([
      ['ostep', 'Chapter 33 "Event-based Concurrency (Advanced)" (the event loop, why blocking calls break it, asynchronous I/O) and Chapter 32 "Common Concurrency Problems" (atomicity violations and deadlock bugs)', 'Chương 33 "Event-based Concurrency (Advanced)" (event loop, vì sao lời gọi chặn phá nó, I/O bất đồng bộ) và Chương 32 "Common Concurrency Problems" (lỗi vi phạm tính nguyên tử và lỗi bế tắc)'],
      ['mos4', 'Chapter 2, section 2.3 (race conditions, critical regions, mutual exclusion) and Chapter 6 (deadlocks: the four conditions, ordering resources) — the school concepts behind slides 20–22', 'Chương 2, mục 2.3 (tranh chấp, miền găng, loại trừ lẫn nhau) và Chương 6 (bế tắc: bốn điều kiện, sắp thứ tự tài nguyên) — khái niệm của trường đứng sau slide 20–22'],
      ['man7', 'epoll(7) (what the event loop and the NIO poller wait on), listen(2) (backlog and somaxconn), tcp(7) (SYN retries), flock(2) (the lock used for the lost-update demo), proc(5) (/proc/self/task)', 'epoll(7) (thứ event loop và NIO poller đứng chờ), listen(2) (backlog và somaxconn), tcp(7) (gửi lại SYN), flock(2) (khoá dùng trong ví dụ lost update), proc(5) (/proc/self/task)'],
    ]),
  ].join('\n'),
};

/* ───────── ⭐ CS.3 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Threads in backend: pool size, event loop, races, deadlocks ───────── */
const L_x_cs3_on = {
  title: '⭐ CS.3 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Threads in backend: pool size, event loop, races, deadlocks|||⭐ CS.3 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Luồng trong backend: cỡ pool, event loop, tranh chấp, bế tắc',
  slug: 'osg202-cs3-on',
  type: 'VIDEO',
  description: '6 bài tập ⭐ Chuyên sâu 3 có lời giải chạy thật trên Linux: chọn cỡ pool bằng định luật Little và công thức Goetz rồi phát hiện một hệ thống quá tải CPU mà không cỡ pool nào cứu được, đoán thứ tự in của nextTick, promise, setTimeout và setImmediate trong một callback I/O, chia nhỏ một vòng lặp nặng CPU để event loop không bị đứng, sửa tranh chấp trên số dư tài khoản bằng synchronized và AtomicLong, chống bế tắc khi chuyển tiền hai chiều bằng thứ tự khoá theo id, và đo hiện tượng pinning của luồng ảo Java 21 khi ngủ bên trong synchronized; kèm bảng thuật ngữ Anh–Việt và tóm tắt.',
  content: [
    bi(`<span class="eyebrow">⭐ Advanced 3 · Lesson CS.3 · Practice &amp; review</span>
<h2>Six exercises: threads, pools and the event loop, computed and run</h2>
<p class="lead">The deck showed each idea once; here you apply it to new numbers and new code. Exercise 1 is arithmetic that an interviewer will ask on a whiteboard; exercise 2 is the classic "what does this print?"; exercises 3–6 are real bugs with real fixes, each run in the course's Linux container. Try each one first within the suggested time, then open the solution. Timing results (exercises 3, 4 and 6) are one real run on a busy machine — the solution says which ratio must hold, not which exact number.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Deck slides</th></tr></thead>
<tbody>
<tr><td>1</td><td>size a pool with Little and Goetz, and see when no pool can help</td><td>9–10</td></tr>
<tr><td>2</td><td>predict nextTick / promise / timer / immediate order</td><td>15–16</td></tr>
<tr><td>3</td><td>keep the event loop responsive by chunking CPU work</td><td>18–19</td></tr>
<tr><td>4</td><td>fix a race on a shared balance</td><td>20</td></tr>
<tr><td>5</td><td>prevent a deadlock with a global lock order</td><td>21</td></tr>
<tr><td>6</td><td>measure pinning of Java 21 virtual threads</td><td>11–13</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">⭐ Chuyên sâu 3 · Bài CS.3 · Thực hành &amp; ôn tập</span>
<h2>Sáu bài tập: luồng, pool và event loop, tính ra và chạy thật</h2>
<p class="lead">Bộ slide đã cho thấy mỗi ý một lần; ở đây bạn áp chúng vào số mới và code mới. Bài 1 là phép tính mà người phỏng vấn sẽ hỏi trên bảng trắng; bài 2 là câu kinh điển "đoạn này in ra gì?"; bài 3–6 là lỗi thật với cách sửa thật, mỗi bài chạy trong container Linux của khoá học. Hãy tự làm từng bài trong thời gian gợi ý, rồi mới mở lời giải. Kết quả đo thời gian (bài 3, 4 và 6) là một lần chạy thật trên máy đang bận — lời giải nói tỉ lệ nào phải đúng, chứ không nói con số chính xác.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide của deck</th></tr></thead>
<tbody>
<tr><td>1</td><td>chọn cỡ pool bằng Little và Goetz, và thấy khi nào không pool nào cứu được</td><td>9–10</td></tr>
<tr><td>2</td><td>đoán thứ tự nextTick / promise / timer / immediate</td><td>15–16</td></tr>
<tr><td>3</td><td>giữ event loop phản hồi nhanh bằng cách chia nhỏ việc CPU</td><td>18–19</td></tr>
<tr><td>4</td><td>sửa tranh chấp trên một số dư dùng chung</td><td>20</td></tr>
<tr><td>5</td><td>ngăn bế tắc bằng một thứ tự khoá chung</td><td>21</td></tr>
<tr><td>6</td><td>đo hiện tượng pinning của luồng ảo Java 21</td><td>11–13</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — how many threads, and is the CPU enough? (15 min)</h3>
<p>Three services, each request = some CPU time + some time waiting for the database. For each: (a) with Little's law, how many threads are busy on average? (b) With Goetz's formula (U = 1), how many threads keep every core busy? (c) How many cores of CPU does the load need — and can <em>any</em> pool size make the service keep up?</p>
<p>A: 300 req/s, 20 ms CPU + 180 ms DB, 4 cores. B: 100 req/s, same request, 4 cores. C: 50 req/s, 150 ms CPU + 50 ms DB, 8 cores.</p>
<details><summary>Solution — checked by a program</summary>
<pre><code class="language-javascript">// Exercise 1 — size a pool with Little's law and Goetz's formula, and check whether the CPU can keep up
const cases = [
  { name: 'A: 300 req/s, 20 ms CPU + 180 ms DB, 4 cores', rate: 300, cpu: 0.020, wait: 0.180, cores: 4 },
  { name: 'B: 100 req/s, 20 ms CPU + 180 ms DB, 4 cores', rate: 100, cpu: 0.020, wait: 0.180, cores: 4 },
  { name: 'C: 50 req/s, 150 ms CPU + 50 ms DB, 8 cores', rate: 50, cpu: 0.150, wait: 0.050, cores: 8 },
];
for (const c of cases) {
  const busy = c.rate * (c.cpu + c.wait);                 // Little: L = lambda × W
  const goetz = c.cores * (1 + c.wait / c.cpu);           // threads that keep every core busy
  const cpuNeed = c.rate * c.cpu;                         // core-seconds of CPU needed per second
  console.log(c.name);
  console.log(&#96;  Little: busy threads = &#36;{c.rate} × &#36;{(c.cpu + c.wait).toFixed(3)} s = &#36;{busy.toFixed(1)}&#96;);
  console.log(&#96;  Goetz:  &#36;{c.cores} × (1 + &#36;{c.wait * 1000}/&#36;{c.cpu * 1000}) = &#36;{goetz.toFixed(1)} threads&#96;);
  console.log(&#96;  CPU needed = &#36;{c.rate} × &#36;{c.cpu * 1000} ms = &#36;{cpuNeed.toFixed(1)} cores of &#36;{c.cores} -&gt; &#36;{cpuNeed &gt; c.cores ? 'OVERLOADED: no pool size can help' : &#96;utilisation &#36;{(100 * cpuNeed / c.cores).toFixed(0)} %&#96;}&#96;);
}</code></pre>
<div class="out">$ node bai-kich-thuoc.js<br>
A: 300 req/s, 20 ms CPU + 180 ms DB, 4 cores<br>
&nbsp;&nbsp;Little: busy threads = 300 × 0.200 s = 60.0<br>
&nbsp;&nbsp;Goetz: &nbsp;4 × (1 + 180/20) = 40.0 threads<br>
&nbsp;&nbsp;CPU needed = 300 × 20 ms = 6.0 cores of 4 -&gt; OVERLOADED: no pool size can help<br>
B: 100 req/s, 20 ms CPU + 180 ms DB, 4 cores<br>
&nbsp;&nbsp;Little: busy threads = 100 × 0.200 s = 20.0<br>
&nbsp;&nbsp;Goetz: &nbsp;4 × (1 + 180/20) = 40.0 threads<br>
&nbsp;&nbsp;CPU needed = 100 × 20 ms = 2.0 cores of 4 -&gt; utilisation 50 %<br>
C: 50 req/s, 150 ms CPU + 50 ms DB, 8 cores<br>
&nbsp;&nbsp;Little: busy threads = 50 × 0.200 s = 10.0<br>
&nbsp;&nbsp;Goetz: &nbsp;8 × (1 + 50/150) = 10.7 threads<br>
&nbsp;&nbsp;CPU needed = 50 × 150 ms = 7.5 cores of 8 -&gt; utilisation 94 %</div>
<ul>
<li><strong>A.</strong> Little: 300 × 0.2 s = 60 busy threads; Goetz: 4 × (1 + 180/20) = 40 threads. But the load needs 300 × 20 ms = <strong>6 cores of CPU per second on a 4-core machine</strong>: the queue grows forever whatever the pool size. More threads only make it worse (more memory, more context switches). Fix: more cores / more instances, or less CPU per request (caching, cheaper serialisation).</li>
<li><strong>B.</strong> 20 busy threads on average, CPU at 50 %; a pool of 40 (Goetz) leaves room for bursts — and Tomcat's default 200 is plenty.</li>
<li><strong>C.</strong> CPU-heavy: Goetz says 8 × (1 + 50/150) ≈ 11 threads, Little says 10 are busy, and the CPU is at 94 % — any burst will queue. A pool of 200 here would just make 200 threads fight over 8 cores.</li>
</ul>
<p class="meo">🧠 Always do step (c) first: if <em>rate × CPU per request</em> is larger than the number of cores, stop tuning the pool.</p>
</details>`,
    `<h3>🧪 Bài 1 — bao nhiêu luồng, và CPU có đủ không? (15 phút)</h3>
<p>Ba dịch vụ, mỗi request = một ít thời gian CPU + một ít thời gian chờ cơ sở dữ liệu. Với mỗi dịch vụ: (a) theo định luật Little, trung bình có bao nhiêu luồng bận? (b) theo công thức Goetz (U = 1), bao nhiêu luồng giữ được mọi lõi bận? (c) tải này cần bao nhiêu lõi CPU — và có cỡ pool <em>nào</em> giúp dịch vụ theo kịp không?</p>
<p>A: 300 req/s, 20 ms CPU + 180 ms DB, 4 lõi. B: 100 req/s, cùng loại request, 4 lõi. C: 50 req/s, 150 ms CPU + 50 ms DB, 8 lõi.</p>
<details><summary>Lời giải — được chương trình kiểm</summary>
<pre><code class="language-javascript">// Bài 1 — chọn cỡ pool bằng định luật Little và công thức Goetz, rồi kiểm CPU có theo kịp không
const cases = [
  { name: 'A: 300 req/s, 20 ms CPU + 180 ms DB, 4 cores', rate: 300, cpu: 0.020, wait: 0.180, cores: 4 },
  { name: 'B: 100 req/s, 20 ms CPU + 180 ms DB, 4 cores', rate: 100, cpu: 0.020, wait: 0.180, cores: 4 },
  { name: 'C: 50 req/s, 150 ms CPU + 50 ms DB, 8 cores', rate: 50, cpu: 0.150, wait: 0.050, cores: 8 },
];
for (const c of cases) {
  const busy = c.rate * (c.cpu + c.wait);                 // Little: L = lambda × W
  const goetz = c.cores * (1 + c.wait / c.cpu);           // threads that keep every core busy
  const cpuNeed = c.rate * c.cpu;                         // core-seconds of CPU needed per second
  console.log(c.name);
  console.log(&#96;  Little: busy threads = &#36;{c.rate} × &#36;{(c.cpu + c.wait).toFixed(3)} s = &#36;{busy.toFixed(1)}&#96;);
  console.log(&#96;  Goetz:  &#36;{c.cores} × (1 + &#36;{c.wait * 1000}/&#36;{c.cpu * 1000}) = &#36;{goetz.toFixed(1)} threads&#96;);
  console.log(&#96;  CPU needed = &#36;{c.rate} × &#36;{c.cpu * 1000} ms = &#36;{cpuNeed.toFixed(1)} cores of &#36;{c.cores} -&gt; &#36;{cpuNeed &gt; c.cores ? 'OVERLOADED: no pool size can help' : &#96;utilisation &#36;{(100 * cpuNeed / c.cores).toFixed(0)} %&#96;}&#96;);
}</code></pre>
<div class="out">$ node bai-kich-thuoc.js<br>
A: 300 req/s, 20 ms CPU + 180 ms DB, 4 cores<br>
&nbsp;&nbsp;Little: busy threads = 300 × 0.200 s = 60.0<br>
&nbsp;&nbsp;Goetz: &nbsp;4 × (1 + 180/20) = 40.0 threads<br>
&nbsp;&nbsp;CPU needed = 300 × 20 ms = 6.0 cores of 4 -&gt; OVERLOADED: no pool size can help<br>
B: 100 req/s, 20 ms CPU + 180 ms DB, 4 cores<br>
&nbsp;&nbsp;Little: busy threads = 100 × 0.200 s = 20.0<br>
&nbsp;&nbsp;Goetz: &nbsp;4 × (1 + 180/20) = 40.0 threads<br>
&nbsp;&nbsp;CPU needed = 100 × 20 ms = 2.0 cores of 4 -&gt; utilisation 50 %<br>
C: 50 req/s, 150 ms CPU + 50 ms DB, 8 cores<br>
&nbsp;&nbsp;Little: busy threads = 50 × 0.200 s = 10.0<br>
&nbsp;&nbsp;Goetz: &nbsp;8 × (1 + 50/150) = 10.7 threads<br>
&nbsp;&nbsp;CPU needed = 50 × 150 ms = 7.5 cores of 8 -&gt; utilisation 94 %</div>
<ul>
<li><strong>A.</strong> Little: 300 × 0,2 s = 60 luồng bận; Goetz: 4 × (1 + 180/20) = 40 luồng. Nhưng tải cần 300 × 20 ms = <strong>6 lõi CPU mỗi giây trên một máy 4 lõi</strong>: hàng đợi dài mãi dù pool cỡ nào. Thêm luồng chỉ tệ hơn (thêm bộ nhớ, thêm chuyển ngữ cảnh). Cách sửa: thêm lõi / thêm máy, hoặc bớt CPU cho mỗi request (cache, tuần tự hoá rẻ hơn).</li>
<li><strong>B.</strong> Trung bình 20 luồng bận, CPU 50 %; pool 40 (Goetz) còn dư chỗ cho lúc dồn — và mức 200 mặc định của Tomcat là thừa đủ.</li>
<li><strong>C.</strong> Nặng CPU: Goetz cho 8 × (1 + 50/150) ≈ 11 luồng, Little cho 10 luồng bận, và CPU ở mức 94 % — mọi đợt dồn sẽ phải xếp hàng. Một pool 200 ở đây chỉ làm 200 luồng tranh nhau 8 lõi.</li>
</ul>
<p class="meo">🧠 Luôn làm bước (c) trước: nếu <em>tốc độ request × CPU mỗi request</em> lớn hơn số lõi, thôi đừng chỉnh pool nữa.</p>
</details>`),
    bi(`<h3>🧪 Exercise 2 — what does this print? (15 min)</h3>
<p>Everything starts inside an <code>fs.readFile</code> callback (poll phase), so the order is the same on every run. Write down the ten lines in order, then run it.</p>
<pre><code class="language-javascript">// Exercise 2 — predict the order, then run. Everything starts inside an I/O callback, so the order is deterministic
const fs = require('node:fs');
const log = console.log;
fs.readFile(__filename, () =&gt; {
  log('1 io callback');
  setTimeout(() =&gt; {
    log('2 timeout');
    process.nextTick(() =&gt; log('3 nextTick inside timeout'));
    setImmediate(() =&gt; log('4 immediate inside timeout'));
  }, 0);
  setImmediate(() =&gt; {
    log('5 immediate');
    Promise.resolve().then(() =&gt; log('6 promise inside immediate'));
    process.nextTick(() =&gt; log('7 nextTick inside immediate'));
  });
  Promise.resolve().then(() =&gt; {
    log('8 promise');
    process.nextTick(() =&gt; log('9 nextTick inside promise'));
  });
  process.nextTick(() =&gt; log('10 nextTick'));
});</code></pre>
<details><summary>Solution — run in the container</summary>
<div class="out">$ node bai-thu-tu.js<br>
1 io callback<br>
10 nextTick<br>
8 promise<br>
9 nextTick inside promise<br>
5 immediate<br>
7 nextTick inside immediate<br>
6 promise inside immediate<br>
2 timeout<br>
3 nextTick inside timeout<br>
4 immediate inside timeout</div>
<ul>
<li><code>1</code> is the I/O callback itself. When it returns, Node drains <strong>nextTick</strong> first (<code>10</code>), then <strong>promises</strong> (<code>8</code>); <code>8</code> schedules a nextTick (<code>9</code>), which runs before the loop moves on — the tick queue is checked again after every microtask batch.</li>
<li>From poll the loop goes to <strong>check</strong>: <code>5</code>; after it, its own nextTick (<code>7</code>) runs <em>before</em> its promise (<code>6</code>).</li>
<li>Then the loop wraps round to <strong>timers</strong>: <code>2</code>, its nextTick <code>3</code>; the immediate it scheduled (<code>4</code>) waits for the next check phase.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 2 — đoạn này in ra gì? (15 phút)</h3>
<p>Mọi thứ bắt đầu bên trong một callback của <code>fs.readFile</code> (pha poll), nên lần chạy nào thứ tự cũng như nhau. Hãy viết ra mười dòng theo thứ tự, rồi mới chạy.</p>
<pre><code class="language-javascript">// Bài 2 — đoán thứ tự rồi chạy. Mọi thứ bắt đầu trong một callback I/O nên thứ tự là tất định
const fs = require('node:fs');
const log = console.log;
fs.readFile(__filename, () =&gt; {
  log('1 io callback');
  setTimeout(() =&gt; {
    log('2 timeout');
    process.nextTick(() =&gt; log('3 nextTick inside timeout'));
    setImmediate(() =&gt; log('4 immediate inside timeout'));
  }, 0);
  setImmediate(() =&gt; {
    log('5 immediate');
    Promise.resolve().then(() =&gt; log('6 promise inside immediate'));
    process.nextTick(() =&gt; log('7 nextTick inside immediate'));
  });
  Promise.resolve().then(() =&gt; {
    log('8 promise');
    process.nextTick(() =&gt; log('9 nextTick inside promise'));
  });
  process.nextTick(() =&gt; log('10 nextTick'));
});</code></pre>
<details><summary>Lời giải — chạy trong container</summary>
<div class="out">$ node bai-thu-tu.js<br>
1 io callback<br>
10 nextTick<br>
8 promise<br>
9 nextTick inside promise<br>
5 immediate<br>
7 nextTick inside immediate<br>
6 promise inside immediate<br>
2 timeout<br>
3 nextTick inside timeout<br>
4 immediate inside timeout</div>
<ul>
<li><code>1</code> là chính callback I/O. Khi nó trả về, Node xả <strong>nextTick</strong> trước (<code>10</code>), rồi <strong>promise</strong> (<code>8</code>); <code>8</code> hẹn một nextTick (<code>9</code>), và nó chạy trước khi loop đi tiếp — hàng tick được kiểm lại sau mỗi lượt microtask.</li>
<li>Từ poll, loop sang <strong>check</strong>: <code>5</code>; sau nó, nextTick của chính nó (<code>7</code>) chạy <em>trước</em> promise của nó (<code>6</code>).</li>
<li>Rồi loop vòng lại <strong>timers</strong>: <code>2</code>, nextTick của nó <code>3</code>; immediate mà nó hẹn (<code>4</code>) phải chờ pha check lần sau.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 3 — don't freeze the loop: split the work (20 min)</h3>
<p>A route sums 200 million numbers in one <code>for</code> loop. Rewrite it so that it yields to the event loop every 500,000 steps with <code>setImmediate</code> and returns a <code>Promise</code>. Measure both versions with a 1 ms heartbeat timer: total time and the longest gap of the event loop. Which one is better for <em>other</em> users, and what does it cost?</p>
<details><summary>Solution — one real run</summary>
<pre><code class="language-javascript">// Exercise 3 — the same 200 million-step sum done in one piece vs in chunks that yield with setImmediate
function sumAll(n) { let s = 0; for (let i = 0; i &lt; n; i++) s += i % 7; return s; }
function sumChunked(n, chunk = 500_000) {               // yield to the loop every &#96;chunk&#96; steps
  return new Promise((done) =&gt; {
    let i = 0, s = 0;
    (function step() {
      const end = Math.min(n, i + chunk);
      for (; i &lt; end; i++) s += i % 7;
      if (i &lt; n) setImmediate(step); else done(s);
    })();
  });
}
async function measure(label, fn) {
  let last = performance.now(), maxGap = 0;
  const probe = setInterval(() =&gt; { const t = performance.now(); maxGap = Math.max(maxGap, t - last); last = t; }, 1);
  await new Promise((r) =&gt; setTimeout(r, 20));
  const t0 = performance.now(); const s = await fn(); const ms = performance.now() - t0;
  await new Promise((r) =&gt; setTimeout(r, 20));
  clearInterval(probe);
  console.log(&#96;&#36;{label.padEnd(12)} sum=&#36;{s}  &#36;{ms.toFixed(0).padStart(4)} ms   longest stall &#36;{maxGap.toFixed(0).padStart(4)} ms&#96;);
}
(async () =&gt; {
  const N = 200_000_000;
  await measure('one piece', async () =&gt; sumAll(N));
  await measure('chunked', () =&gt; sumChunked(N));
})();</code></pre>
<div class="out">$ node bai-chia-nho.js<br>
one piece &nbsp;&nbsp;&nbsp;sum=599999994 &nbsp;&nbsp;451 ms &nbsp;&nbsp;longest stall &nbsp;456 ms<br>
chunked &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum=599999994 &nbsp;&nbsp;927 ms &nbsp;&nbsp;longest stall &nbsp;&nbsp;20 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<ul>
<li>Same result (the sums are equal). The one-piece version froze the loop for its <strong>whole</strong> duration (longest stall ≈ total time). The chunked version's longest stall is a few tens of milliseconds at most — a ping arriving during the work waits for at most one chunk.</li>
<li>The price: the chunked version took longer in total (more function calls, and other callbacks run in between). That is the right trade on a server: one slow request instead of everybody slow.</li>
<li>Better still, move it off the main thread entirely (a worker, slide 19) — chunking keeps fairness, but the work still uses the one JavaScript thread.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 3 — đừng làm đứng loop: chia nhỏ công việc (20 phút)</h3>
<p>Một route cộng 200 triệu số trong một vòng <code>for</code>. Hãy viết lại để cứ 500.000 bước thì nhường event loop bằng <code>setImmediate</code> và trả về một <code>Promise</code>. Đo cả hai phiên bản bằng một timer "nhịp tim" 1 ms: tổng thời gian và khoảng hở dài nhất của event loop. Bản nào tốt hơn cho người dùng <em>khác</em>, và cái giá là gì?</p>
<details><summary>Lời giải — một lần chạy thật</summary>
<pre><code class="language-javascript">// Bài 3 — cùng phép cộng 200 triệu bước làm một mạch vs chia khúc có nhường loop bằng setImmediate
function sumAll(n) { let s = 0; for (let i = 0; i &lt; n; i++) s += i % 7; return s; }
function sumChunked(n, chunk = 500_000) {               // cứ &#96;chunk&#96; bước thì nhường loop
  return new Promise((done) =&gt; {
    let i = 0, s = 0;
    (function step() {
      const end = Math.min(n, i + chunk);
      for (; i &lt; end; i++) s += i % 7;
      if (i &lt; n) setImmediate(step); else done(s);
    })();
  });
}
async function measure(label, fn) {
  let last = performance.now(), maxGap = 0;
  const probe = setInterval(() =&gt; { const t = performance.now(); maxGap = Math.max(maxGap, t - last); last = t; }, 1);
  await new Promise((r) =&gt; setTimeout(r, 20));
  const t0 = performance.now(); const s = await fn(); const ms = performance.now() - t0;
  await new Promise((r) =&gt; setTimeout(r, 20));
  clearInterval(probe);
  console.log(&#96;&#36;{label.padEnd(12)} sum=&#36;{s}  &#36;{ms.toFixed(0).padStart(4)} ms   longest stall &#36;{maxGap.toFixed(0).padStart(4)} ms&#96;);
}
(async () =&gt; {
  const N = 200_000_000;
  await measure('one piece', async () =&gt; sumAll(N));
  await measure('chunked', () =&gt; sumChunked(N));
})();</code></pre>
<div class="out">$ node bai-chia-nho.js<br>
one piece &nbsp;&nbsp;&nbsp;sum=599999994 &nbsp;&nbsp;451 ms &nbsp;&nbsp;longest stall &nbsp;456 ms<br>
chunked &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum=599999994 &nbsp;&nbsp;927 ms &nbsp;&nbsp;longest stall &nbsp;&nbsp;20 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<ul>
<li>Cùng kết quả (hai tổng bằng nhau). Bản làm một mạch làm đứng loop <strong>suốt</strong> thời gian chạy (lần đứng dài nhất ≈ tổng thời gian). Lần đứng dài nhất của bản chia khúc chỉ cỡ vài chục mili giây — một ping tới giữa chừng chỉ phải chờ tối đa một khúc.</li>
<li>Cái giá: bản chia khúc tốn tổng thời gian lâu hơn (nhiều lời gọi hàm hơn, và các callback khác chen vào giữa). Trên server đó là đánh đổi đúng: một request chậm thay vì mọi người cùng chậm.</li>
<li>Tốt hơn nữa là chuyển hẳn ra khỏi luồng chính (một worker, slide 19) — chia khúc giữ được công bằng, nhưng công việc vẫn dùng luồng JavaScript duy nhất.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 4 — a balance that should be zero (20 min)</h3>
<p>Four threads each deposit 1 and withdraw 1, 250,000 times, on one shared account. The final balance must be 0. Write three versions — a plain <code>volatile long</code> field, <code>synchronized</code> methods, and <code>AtomicLong</code> — start the four threads at a common <code>CyclicBarrier</code>, and print the three balances. Explain the wrong one.</p>
<details><summary>Solution — one real run</summary>
<pre><code class="language-java">// Exercise 4 — 4 threads deposit 1 and withdraw 1, 250,000 times each: the balance must end at 0
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.atomic.AtomicLong;

public class BaiTaiKhoan {
    interface Account { void add(long x); long get(); }
    static class Unsafe implements Account { volatile long b; public void add(long x) { b += x; } public long get() { return b; } }
    static class Locked implements Account { long b; public synchronized void add(long x) { b += x; } public synchronized long get() { return b; } }
    static class Atomic implements Account { final AtomicLong b = new AtomicLong(); public void add(long x) { b.addAndGet(x); } public long get() { return b.get(); } }

    static long run(Account a) throws Exception {
        CyclicBarrier start = new CyclicBarrier(4);           // common starting line
        Thread[] ts = new Thread[4];
        for (int k = 0; k &lt; 4; k++) {
            ts[k] = new Thread(() -&gt; {
                try { start.await(); } catch (Exception e) { }
                for (int i = 0; i &lt; 250_000; i++) { a.add(1); a.add(-1); }
            });
            ts[k].start();
        }
        for (Thread t : ts) t.join();
        return a.get();
    }
    public static void main(String[] args) throws Exception {
        System.out.println("unsafe       balance = " + run(new Unsafe()));
        System.out.println("synchronized balance = " + run(new Locked()));
        System.out.println("AtomicLong   balance = " + run(new Atomic()));
    }
}</code></pre>
<div class="out">$ javac BaiTaiKhoan.java &amp;&amp; java BaiTaiKhoan<br>
unsafe &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance = 4024<br>
synchronized balance = 0<br>
AtomicLong &nbsp;&nbsp;balance = 0</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<ul>
<li><strong>unsafe</strong>: not 0 (the exact value changes every run — it can even be negative). <code>b += x</code> is read–add–write; two threads interleave and one update overwrites the other, in either direction.</li>
<li><strong>synchronized</strong>: 0 — only one thread at a time is inside <code>add</code>; <code>get</code> is synchronized too, so it sees the latest value.</li>
<li><strong>AtomicLong</strong>: 0 — <code>addAndGet</code> is a single atomic CPU operation. For a counter that many threads increment and few read, <code>LongAdder</code> is even faster (it spreads the writes over cells).</li>
</ul>
</details>`,
    `<h3>🧪 Bài 4 — một số dư lẽ ra phải bằng 0 (20 phút)</h3>
<p>Bốn luồng, mỗi luồng gửi 1 rồi rút 1, 250.000 lần, trên cùng một tài khoản. Số dư cuối phải bằng 0. Viết ba phiên bản — một trường <code>volatile long</code> trơn, các phương thức <code>synchronized</code>, và <code>AtomicLong</code> — cho bốn luồng xuất phát ở một <code>CyclicBarrier</code> chung, rồi in ba số dư. Giải thích bản sai.</p>
<details><summary>Lời giải — một lần chạy thật</summary>
<pre><code class="language-java">// Bài 4 — 4 luồng mỗi luồng gửi 1 rồi rút 1, 250.000 lần: số dư cuối phải là 0
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.atomic.AtomicLong;

public class BaiTaiKhoan {
    interface Account { void add(long x); long get(); }
    static class Unsafe implements Account { volatile long b; public void add(long x) { b += x; } public long get() { return b; } }
    static class Locked implements Account { long b; public synchronized void add(long x) { b += x; } public synchronized long get() { return b; } }
    static class Atomic implements Account { final AtomicLong b = new AtomicLong(); public void add(long x) { b.addAndGet(x); } public long get() { return b.get(); } }

    static long run(Account a) throws Exception {
        CyclicBarrier start = new CyclicBarrier(4);           // vạch xuất phát chung
        Thread[] ts = new Thread[4];
        for (int k = 0; k &lt; 4; k++) {
            ts[k] = new Thread(() -&gt; {
                try { start.await(); } catch (Exception e) { }
                for (int i = 0; i &lt; 250_000; i++) { a.add(1); a.add(-1); }
            });
            ts[k].start();
        }
        for (Thread t : ts) t.join();
        return a.get();
    }
    public static void main(String[] args) throws Exception {
        System.out.println("unsafe       balance = " + run(new Unsafe()));
        System.out.println("synchronized balance = " + run(new Locked()));
        System.out.println("AtomicLong   balance = " + run(new Atomic()));
    }
}</code></pre>
<div class="out">$ javac BaiTaiKhoan.java &amp;&amp; java BaiTaiKhoan<br>
unsafe &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance = 4024<br>
synchronized balance = 0<br>
AtomicLong &nbsp;&nbsp;balance = 0</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<ul>
<li><strong>unsafe</strong>: khác 0 (giá trị chính xác đổi theo mỗi lần chạy — có thể âm). <code>b += x</code> là đọc–cộng–ghi; hai luồng chen nhau và một lần cập nhật ghi đè lần kia, theo chiều nào cũng có.</li>
<li><strong>synchronized</strong>: 0 — mỗi lúc chỉ một luồng ở trong <code>add</code>; <code>get</code> cũng synchronized nên thấy giá trị mới nhất.</li>
<li><strong>AtomicLong</strong>: 0 — <code>addAndGet</code> là một thao tác CPU nguyên tử. Với một biến đếm bị nhiều luồng cộng mà ít khi đọc, <code>LongAdder</code> còn nhanh hơn (nó rải các lần ghi ra nhiều ô).</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 5 — transfers in both directions without a deadlock (20 min)</h3>
<p>Thread 1 transfers 1 from A to B, 200,000 times; thread 2 transfers 1 from B to A, 200,000 times. Each transfer must lock both accounts. The deck's version (lock <code>from</code>, then <code>to</code>) deadlocks. Change only the <code>transfer</code> method so it can never deadlock, then show that all 400,000 transfers finish and the total money is unchanged.</p>
<details><summary>Solution — run in the container</summary>
<pre><code class="language-java">// Exercise 5 — transfers in BOTH directions between two accounts, but every transfer locks the smaller id first
public class BaiThuTuKhoa {
    static class Account { final int id; long balance; Account(int id, long b) { this.id = id; this.balance = b; } }

    static void transfer(Account from, Account to, long amount) {
        Account first = from.id &lt; to.id ? from : to;          // one global order: by id
        Account second = first == from ? to : from;
        synchronized (first) {
            synchronized (second) { from.balance -= amount; to.balance += amount; }
        }
    }
    public static void main(String[] args) throws Exception {
        Account a = new Account(1, 1_000), b = new Account(2, 1_000);
        Thread t1 = new Thread(() -&gt; { for (int i = 0; i &lt; 200_000; i++) transfer(a, b, 1); }, "A-to-B");
        Thread t2 = new Thread(() -&gt; { for (int i = 0; i &lt; 200_000; i++) transfer(b, a, 1); }, "B-to-A");
        t1.start(); t2.start(); t1.join(); t2.join();
        System.out.println("400000 transfers finished, no deadlock");
        System.out.println("A = " + a.balance + ", B = " + b.balance + ", total = " + (a.balance + b.balance));
    }
}</code></pre>
<div class="out">$ javac BaiThuTuKhoa.java &amp;&amp; java BaiThuTuKhoa<br>
400000 transfers finished, no deadlock<br>
A = 1000, B = 1000, total = 2000</div>
<ul>
<li>Lock the account with the <strong>smaller id first</strong>, whatever the direction. Both threads now try A before B, so no thread can hold B while waiting for A: the circular-wait condition is gone (Chapter 6, "attacking circular wait").</li>
<li>Both locks are still held during the update, so the transfer stays atomic: the total stays 2,000.</li>
<li>In SQL the same rule is "update the rows in id order" (<code>ORDER BY id … FOR UPDATE</code>); databases still detect deadlocks, but ordered locking makes them rare.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 5 — chuyển tiền hai chiều mà không bế tắc (20 phút)</h3>
<p>Luồng 1 chuyển 1 từ A sang B, 200.000 lần; luồng 2 chuyển 1 từ B sang A, 200.000 lần. Mỗi lần chuyển phải khoá cả hai tài khoản. Phiên bản trong deck (khoá <code>from</code> rồi <code>to</code>) bị bế tắc. Chỉ sửa phương thức <code>transfer</code> để nó không bao giờ bế tắc, rồi cho thấy cả 400.000 lần chuyển đều xong và tổng tiền không đổi.</p>
<details><summary>Lời giải — chạy trong container</summary>
<pre><code class="language-java">// Bài 5 — chuyển tiền CẢ HAI chiều giữa hai tài khoản, nhưng mọi lần chuyển đều khoá id nhỏ hơn trước
public class BaiThuTuKhoa {
    static class Account { final int id; long balance; Account(int id, long b) { this.id = id; this.balance = b; } }

    static void transfer(Account from, Account to, long amount) {
        Account first = from.id &lt; to.id ? from : to;          // một thứ tự chung: theo id
        Account second = first == from ? to : from;
        synchronized (first) {
            synchronized (second) { from.balance -= amount; to.balance += amount; }
        }
    }
    public static void main(String[] args) throws Exception {
        Account a = new Account(1, 1_000), b = new Account(2, 1_000);
        Thread t1 = new Thread(() -&gt; { for (int i = 0; i &lt; 200_000; i++) transfer(a, b, 1); }, "A-to-B");
        Thread t2 = new Thread(() -&gt; { for (int i = 0; i &lt; 200_000; i++) transfer(b, a, 1); }, "B-to-A");
        t1.start(); t2.start(); t1.join(); t2.join();
        System.out.println("400000 transfers finished, no deadlock");
        System.out.println("A = " + a.balance + ", B = " + b.balance + ", total = " + (a.balance + b.balance));
    }
}</code></pre>
<div class="out">$ javac BaiThuTuKhoa.java &amp;&amp; java BaiThuTuKhoa<br>
400000 transfers finished, no deadlock<br>
A = 1000, B = 1000, total = 2000</div>
<ul>
<li>Khoá tài khoản có <strong>id nhỏ hơn trước</strong>, bất kể chiều chuyển. Giờ cả hai luồng đều thử A trước B, nên không luồng nào giữ B trong lúc chờ A: điều kiện chờ vòng tròn biến mất (Chương 6, "tấn công điều kiện chờ vòng tròn").</li>
<li>Cả hai khoá vẫn được giữ trong lúc cập nhật, nên việc chuyển vẫn nguyên tử: tổng vẫn là 2.000.</li>
<li>Trong SQL, cùng luật đó là "cập nhật các dòng theo thứ tự id" (<code>ORDER BY id … FOR UPDATE</code>); cơ sở dữ liệu vẫn phát hiện bế tắc, nhưng khoá có thứ tự khiến chúng hiếm gặp.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 6 — catch pinning on Java 21 (20 min)</h3>
<p>Run 20 virtual threads that each sleep 100 ms while holding a lock, with only 2 carrier threads (<code>-Djdk.virtualThreadScheduler.parallelism=2</code>). Version 1 uses <code>synchronized</code>, version 2 uses <code>ReentrantLock</code>. Predict both times before running: what would they be if every sleep unmounted its virtual thread, and what if every sleep blocked its carrier?</p>
<details><summary>Solution — one real run (Temurin 21)</summary>
<pre><code class="language-java">// Exercise 6 — Java 21 pinning: 20 virtual threads each sleep 100 ms while holding a lock, on only 2 carriers
import java.util.concurrent.*;
import java.util.concurrent.locks.ReentrantLock;

public class BaiPinning {
    static void sleep100() { try { Thread.sleep(100); } catch (InterruptedException e) { } }
    static double run(String name, Runnable task) throws Exception {
        long t0 = System.nanoTime();
        try (var ex = Executors.newVirtualThreadPerTaskExecutor()) { for (int i = 0; i &lt; 20; i++) ex.submit(task); }
        double s = (System.nanoTime() - t0) / 1e9;
        System.out.printf("%-28s 20 tasks -&gt; %.2f s%n", name, s);
        return s;
    }
    public static void main(String[] a) throws Exception {
        System.out.println("java " + System.getProperty("java.version") + ", carriers = " + System.getProperty("jdk.virtualThreadScheduler.parallelism"));
        run("synchronized + sleep", () -&gt; { Object lock = new Object(); synchronized (lock) { sleep100(); } });   // pinned
        run("ReentrantLock + sleep", () -&gt; { ReentrantLock l = new ReentrantLock(); l.lock(); try { sleep100(); } finally { l.unlock(); } });
    }
}</code></pre>
<div class="out">$ javac BaiPinning.java &amp;&amp; java -Djdk.virtualThreadScheduler.parallelism=2 BaiPinning<br>
java 21.0.12.1, carriers = 2<br>
synchronized + sleep &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 tasks -&gt; 1.08 s<br>
ReentrantLock + sleep &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 tasks -&gt; 0.10 s</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<ul>
<li><strong>ReentrantLock</strong>: about 0.1 s — each sleeping virtual thread unmounts, so all 20 sleeps overlap on 2 carriers.</li>
<li><strong>synchronized</strong>: about 1 s = 20 tasks ÷ 2 carriers × 100 ms. Sleeping inside a monitor <strong>pins</strong> the virtual thread to its carrier on Java 21, so only 2 sleeps run at a time — exactly like a platform pool of 2.</li>
<li>Find pins with <code>-Djdk.tracePinnedThreads=full</code> (Java 21–23) or the JFR event <code>jdk.VirtualThreadPinned</code>. On <strong>JDK 24+</strong> (JEP 491) the <code>synchronized</code> version is as fast as the other.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 6 — bắt quả tang pinning trên Java 21 (20 phút)</h3>
<p>Chạy 20 luồng ảo, mỗi luồng ngủ 100 ms trong lúc giữ một khoá, chỉ với 2 luồng carrier (<code>-Djdk.virtualThreadScheduler.parallelism=2</code>). Bản 1 dùng <code>synchronized</code>, bản 2 dùng <code>ReentrantLock</code>. Đoán trước cả hai thời gian: sẽ là bao nhiêu nếu mọi lần ngủ đều tháo luồng ảo ra, và bao nhiêu nếu mọi lần ngủ đều chặn carrier của nó?</p>
<details><summary>Lời giải — một lần chạy thật (Temurin 21)</summary>
<pre><code class="language-java">// Bài 6 — pinning của Java 21: 20 luồng ảo, mỗi luồng ngủ 100 ms trong lúc giữ khoá, chỉ có 2 carrier
import java.util.concurrent.*;
import java.util.concurrent.locks.ReentrantLock;

public class BaiPinning {
    static void sleep100() { try { Thread.sleep(100); } catch (InterruptedException e) { } }
    static double run(String name, Runnable task) throws Exception {
        long t0 = System.nanoTime();
        try (var ex = Executors.newVirtualThreadPerTaskExecutor()) { for (int i = 0; i &lt; 20; i++) ex.submit(task); }
        double s = (System.nanoTime() - t0) / 1e9;
        System.out.printf("%-28s 20 tasks -&gt; %.2f s%n", name, s);
        return s;
    }
    public static void main(String[] a) throws Exception {
        System.out.println("java " + System.getProperty("java.version") + ", carriers = " + System.getProperty("jdk.virtualThreadScheduler.parallelism"));
        run("synchronized + sleep", () -&gt; { Object lock = new Object(); synchronized (lock) { sleep100(); } });   // bị ghim
        run("ReentrantLock + sleep", () -&gt; { ReentrantLock l = new ReentrantLock(); l.lock(); try { sleep100(); } finally { l.unlock(); } });
    }
}</code></pre>
<div class="out">$ javac BaiPinning.java &amp;&amp; java -Djdk.virtualThreadScheduler.parallelism=2 BaiPinning<br>
java 21.0.12.1, carriers = 2<br>
synchronized + sleep &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 tasks -&gt; 1.08 s<br>
ReentrantLock + sleep &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 tasks -&gt; 0.10 s</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<ul>
<li><strong>ReentrantLock</strong>: khoảng 0,1 s — mỗi luồng ảo đang ngủ được tháo ra, nên cả 20 lần ngủ chồng lên nhau trên 2 carrier.</li>
<li><strong>synchronized</strong>: khoảng 1 s = 20 tác vụ ÷ 2 carrier × 100 ms. Ngủ bên trong một monitor <strong>ghim</strong> luồng ảo vào carrier của nó trên Java 21, nên mỗi lúc chỉ 2 lần ngủ chạy — y hệt một pool platform 2 luồng.</li>
<li>Tìm chỗ bị ghim bằng <code>-Djdk.tracePinnedThreads=full</code> (Java 21–23) hoặc sự kiện JFR <code>jdk.VirtualThreadPinned</code>. Trên <strong>JDK 24+</strong> (JEP 491), bản <code>synchronized</code> nhanh ngang bản kia.</li>
</ul>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>thread / task (Linux)</strong></td><td>luồng / task (Linux)</td><td>One flow of execution in a process; on Linux every thread is a kernel task with its own TID in /proc/PID/task.</td></tr>
<tr><td><strong>thread pool / executor</strong></td><td>bể luồng / executor</td><td>A fixed team of reusable threads plus a job queue (ExecutorService, Tomcat, libuv).</td></tr>
<tr><td><strong>thread-per-request</strong></td><td>mỗi request một luồng</td><td>Each HTTP request runs on one worker thread from start to end; a waiting request holds that thread.</td></tr>
<tr><td><strong>blocking call</strong></td><td>lời gọi chặn</td><td>A call that puts the thread to sleep until something happens (DB query, socket read, sleep).</td></tr>
<tr><td><strong>CPU-bound / IO-bound</strong></td><td>nặng tính toán / nặng chờ I/O</td><td>Work that keeps a core busy versus work that mostly waits for the network or disk.</td></tr>
<tr><td><strong>Little's law</strong></td><td>định luật Little</td><td>Items in a system = arrival rate × time each item spends there (busy threads = req/s × seconds).</td></tr>
<tr><td><strong>Goetz's formula</strong></td><td>công thức Goetz</td><td>Threads to keep every core busy = cores × utilisation × (1 + wait/compute).</td></tr>
<tr><td><strong>virtual thread / carrier</strong></td><td>luồng ảo / luồng mang</td><td>A JVM-managed thread (Java 21) that runs on a few OS carrier threads and unmounts while it blocks.</td></tr>
<tr><td><strong>pinning</strong></td><td>ghim</td><td>A virtual thread that cannot unmount (Java 21: blocking inside synchronized), so it blocks its carrier.</td></tr>
<tr><td><strong>event loop</strong></td><td>vòng lặp sự kiện</td><td>One thread that runs short callbacks in phases and never waits itself; the kernel reports ready I/O.</td></tr>
<tr><td><strong>macrotask / microtask</strong></td><td>macrotask / microtask</td><td>A callback in an event-loop phase (timer, I/O, immediate) versus a promise job, drained after every callback.</td></tr>
<tr><td><strong>process.nextTick / setImmediate</strong></td><td>process.nextTick / setImmediate</td><td>Run before any promise, after the current operation / run in the check phase of the loop.</td></tr>
<tr><td><strong>libuv thread pool</strong></td><td>thread pool của libuv</td><td>Node's helper threads (default 4, UV_THREADPOOL_SIZE) for fs, dns.lookup, crypto and zlib.</td></tr>
<tr><td><strong>worker_threads</strong></td><td>luồng worker</td><td>Node threads with their own V8 and event loop, for CPU work off the main thread.</td></tr>
<tr><td><strong>event-loop delay</strong></td><td>độ trễ event loop</td><td>How late a timer fires because the loop was busy; monitorEventLoopDelay measures it.</td></tr>
<tr><td><strong>race condition / atomic</strong></td><td>tranh chấp / nguyên tử</td><td>A result that depends on thread timing; an operation that happens as one indivisible step.</td></tr>
<tr><td><strong>compare-and-swap (CAS)</strong></td><td>so sánh và hoán đổi</td><td>A CPU instruction that writes only if the value is still the expected one (AtomicInteger, AtomicLong).</td></tr>
<tr><td><strong>deadlock / lock ordering</strong></td><td>bế tắc / thứ tự khoá</td><td>Threads waiting for each other in a cycle; prevented by always acquiring locks in one global order.</td></tr>
<tr><td><strong>thread dump (jstack)</strong></td><td>bản chụp luồng</td><td>The state and stack of every JVM thread; reports Java-level deadlocks.</td></tr>
<tr><td><strong>lost update</strong></td><td>cập nhật bị mất</td><td>Two transactions read the same value and both write a result computed from it; one write is lost.</td></tr>
<tr><td><strong>SELECT … FOR UPDATE / optimistic locking</strong></td><td>khoá dòng bi quan / khoá lạc quan</td><td>Lock the row while you read-modify-write / detect a concurrent change with a version column and retry.</td></tr>
<tr><td><strong>accept queue / backlog</strong></td><td>hàng đợi accept / backlog</td><td>Completed connections waiting for accept(); when full, new SYNs are dropped and retried after ~1 s.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>thread / task (Linux)</strong></td><td>luồng / task (Linux)</td><td>Một dòng thực thi trong tiến trình; trên Linux mỗi luồng là một task của nhân có TID riêng trong /proc/PID/task.</td></tr>
<tr><td><strong>thread pool / executor</strong></td><td>bể luồng / executor</td><td>Một đội luồng dùng lại được cố định cộng một hàng đợi việc (ExecutorService, Tomcat, libuv).</td></tr>
<tr><td><strong>thread-per-request</strong></td><td>mỗi request một luồng</td><td>Mỗi request HTTP chạy trên một luồng làm việc từ đầu tới cuối; request đang chờ giữ luôn luồng đó.</td></tr>
<tr><td><strong>blocking call</strong></td><td>lời gọi chặn</td><td>Lời gọi đặt luồng vào giấc ngủ tới khi có chuyện xảy ra (truy vấn DB, đọc socket, sleep).</td></tr>
<tr><td><strong>CPU-bound / IO-bound</strong></td><td>nặng tính toán / nặng chờ I/O</td><td>Việc giữ một lõi bận suốt so với việc phần lớn thời gian chờ mạng hay đĩa.</td></tr>
<tr><td><strong>Little's law</strong></td><td>định luật Little</td><td>Số phần tử trong hệ thống = tốc độ tới × thời gian mỗi phần tử ở trong đó (luồng bận = req/s × giây).</td></tr>
<tr><td><strong>Goetz's formula</strong></td><td>công thức Goetz</td><td>Số luồng giữ mọi lõi bận = số lõi × tỉ lệ dùng × (1 + chờ/tính).</td></tr>
<tr><td><strong>virtual thread / carrier</strong></td><td>luồng ảo / luồng mang</td><td>Luồng do JVM quản lý (Java 21) chạy trên vài luồng HĐH làm carrier và được tháo ra khi bị chặn.</td></tr>
<tr><td><strong>pinning</strong></td><td>ghim</td><td>Luồng ảo không tháo ra được (Java 21: chặn bên trong synchronized), nên chặn luôn carrier của nó.</td></tr>
<tr><td><strong>event loop</strong></td><td>vòng lặp sự kiện</td><td>Một luồng chạy các callback ngắn theo pha và không tự đứng chờ; nhân báo I/O nào đã sẵn sàng.</td></tr>
<tr><td><strong>macrotask / microtask</strong></td><td>macrotask / microtask</td><td>Callback trong một pha của event loop (timer, I/O, immediate) so với việc của promise, được xả sau mỗi callback.</td></tr>
<tr><td><strong>process.nextTick / setImmediate</strong></td><td>process.nextTick / setImmediate</td><td>Chạy trước mọi promise, ngay sau thao tác hiện tại / chạy ở pha check của loop.</td></tr>
<tr><td><strong>libuv thread pool</strong></td><td>thread pool của libuv</td><td>Các luồng phụ của Node (mặc định 4, UV_THREADPOOL_SIZE) cho fs, dns.lookup, crypto và zlib.</td></tr>
<tr><td><strong>worker_threads</strong></td><td>luồng worker</td><td>Luồng của Node có V8 và event loop riêng, để làm việc CPU ngoài luồng chính.</td></tr>
<tr><td><strong>event-loop delay</strong></td><td>độ trễ event loop</td><td>Một timer nổ muộn bao lâu vì loop đang bận; monitorEventLoopDelay đo nó.</td></tr>
<tr><td><strong>race condition / atomic</strong></td><td>tranh chấp / nguyên tử</td><td>Kết quả phụ thuộc thời điểm chạy của các luồng; thao tác diễn ra như một bước không chia cắt.</td></tr>
<tr><td><strong>compare-and-swap (CAS)</strong></td><td>so sánh và hoán đổi</td><td>Lệnh CPU chỉ ghi nếu giá trị vẫn đúng như mong đợi (AtomicInteger, AtomicLong).</td></tr>
<tr><td><strong>deadlock / lock ordering</strong></td><td>bế tắc / thứ tự khoá</td><td>Các luồng chờ nhau thành vòng tròn; ngăn bằng cách luôn lấy khoá theo một thứ tự chung.</td></tr>
<tr><td><strong>thread dump (jstack)</strong></td><td>bản chụp luồng</td><td>Trạng thái và ngăn xếp của mọi luồng JVM; báo bế tắc mức Java.</td></tr>
<tr><td><strong>lost update</strong></td><td>cập nhật bị mất</td><td>Hai giao dịch đọc cùng một giá trị rồi cùng ghi kết quả tính từ nó; một lần ghi bị mất.</td></tr>
<tr><td><strong>SELECT … FOR UPDATE / optimistic locking</strong></td><td>khoá dòng bi quan / khoá lạc quan</td><td>Khoá dòng trong lúc đọc–sửa–ghi / phát hiện thay đổi đồng thời bằng cột version rồi thử lại.</td></tr>
<tr><td><strong>accept queue / backlog</strong></td><td>hàng đợi accept / backlog</td><td>Các kết nối đã bắt tay xong chờ accept(); đầy thì SYN mới bị bỏ và client thử lại sau ~1 s.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — threads in backend</h2>
<ol>
<li><strong>Thread-per-request</strong> (Spring MVC on Tomcat): one worker thread per request, max 200 by default; a waiting request holds an OS thread, so requests beyond the pool come in <strong>waves</strong>.</li>
<li>A Java platform thread <strong>is</strong> a Linux task (<code>/proc/&lt;pid&gt;/task</code>, <code>ps -L</code>), with a ~2 MB stack and a kernel limit (<code>ulimit -u</code>, <code>pids.max</code>) — "unable to create native thread" means the limit, not the memory.</li>
<li>Pool size: CPU-bound ≈ cores; IO-bound ≈ cores × (1 + W/C) (Goetz); busy threads = rate × latency (Little). First check that rate × CPU per request fits in the cores.</li>
<li><strong>Virtual threads</strong> (Java 21): one per task, unmount while blocking — 10,000 one-second waits in ~1 s. Not faster for CPU work; on Java 21 avoid blocking inside <code>synchronized</code> (pinning; fixed in JDK 24); never pool them; the DB pool is still the limit.</li>
<li><strong>Node.js</strong>: one JavaScript thread; six phases (timers, pending, idle, <strong>poll</strong>, <strong>check</strong>, close); after every callback nextTick then promises; network waits in epoll, fs/dns.lookup/crypto/zlib on the libuv pool of 4 (<code>UV_THREADPOOL_SIZE</code>).</li>
<li><strong>Never block the event loop</strong>: one 2 s CPU handler = a 2 s outage for everybody. Use async APIs, chunk with <code>setImmediate</code>, <code>worker_threads</code>, or a job queue.</li>
<li>Shared data needs atomic steps: <code>synchronized</code>/locks or <code>AtomicLong</code> in Java (<code>volatile</code> is not enough); one SQL statement, <code>SELECT … FOR UPDATE</code> or a version column in the database.</li>
<li>Deadlock = a cycle of locks; find it with <code>jstack</code> ("Found one Java-level deadlock", threads BLOCKED, 0 % CPU), prevent it with one global lock order or <code>tryLock</code> with a timeout.</li>
</ol>`,
    `<h2>📌 Tóm tắt — luồng trong backend</h2>
<ol>
<li><strong>Mỗi request một luồng</strong> (Spring MVC trên Tomcat): mỗi request một luồng làm việc, mặc định tối đa 200; request đang chờ giữ một luồng HĐH, nên request vượt quá pool tới thành <strong>từng đợt</strong>.</li>
<li>Một luồng platform Java <strong>chính là</strong> một task Linux (<code>/proc/&lt;pid&gt;/task</code>, <code>ps -L</code>), với ngăn xếp ~2 MB và một giới hạn của nhân (<code>ulimit -u</code>, <code>pids.max</code>) — "unable to create native thread" nghĩa là chạm giới hạn, không phải hết bộ nhớ.</li>
<li>Cỡ pool: CPU-bound ≈ số lõi; IO-bound ≈ số lõi × (1 + W/C) (Goetz); luồng bận = tốc độ × độ trễ (Little). Trước hết kiểm tốc độ × CPU mỗi request có vừa số lõi không.</li>
<li><strong>Luồng ảo</strong> (Java 21): mỗi tác vụ một cái, được tháo ra khi bị chặn — 10.000 lần chờ một giây xong trong ~1 s. Không nhanh hơn cho việc CPU; trên Java 21 tránh chặn bên trong <code>synchronized</code> (pinning; JDK 24 đã sửa); không gom vào pool; pool DB vẫn là giới hạn.</li>
<li><strong>Node.js</strong>: một luồng JavaScript; sáu pha (timers, pending, idle, <strong>poll</strong>, <strong>check</strong>, close); sau mỗi callback là nextTick rồi promise; chờ mạng nằm ở epoll, fs/dns.lookup/crypto/zlib nằm ở pool 4 luồng của libuv (<code>UV_THREADPOOL_SIZE</code>).</li>
<li><strong>Không bao giờ chặn event loop</strong>: một handler CPU 2 s = 2 s sập dịch vụ với mọi người. Dùng API bất đồng bộ, chia khúc bằng <code>setImmediate</code>, <code>worker_threads</code>, hoặc hàng đợi việc.</li>
<li>Dữ liệu dùng chung cần bước nguyên tử: <code>synchronized</code>/khoá hoặc <code>AtomicLong</code> trong Java (<code>volatile</code> là chưa đủ); một câu SQL, <code>SELECT … FOR UPDATE</code> hoặc cột version trong cơ sở dữ liệu.</li>
<li>Bế tắc = một vòng khoá; tìm bằng <code>jstack</code> ("Found one Java-level deadlock", luồng BLOCKED, CPU 0 %), ngăn bằng một thứ tự khoá chung hoặc <code>tryLock</code> có hạn chờ.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-cs3) — 10 câu ───────── */
const QUIZ_CS3 = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'A Spring MVC app runs on Tomcat with the default pool (max 200 worker threads). 600 requests arrive at the same moment and each waits 1 s for the database (almost no CPU). About when does the LAST one get its answer?|||Một app Spring MVC chạy trên Tomcat với pool mặc định (tối đa 200 luồng làm việc). 600 request tới cùng lúc và mỗi request chờ cơ sở dữ liệu 1 s (gần như không dùng CPU). Khoảng bao lâu thì request CUỐI CÙNG nhận được trả lời?',
      options: ['About 1 s — 600 is less than max-connections 8192|||Khoảng 1 s — 600 nhỏ hơn max-connections 8192', 'About 2 s|||Khoảng 2 s', 'About 3 s — three waves of 200|||Khoảng 3 s — ba đợt 200', 'About 6 s — 600 ÷ 100 (accept-count)|||Khoảng 6 s — 600 ÷ 100 (accept-count)'],
      correctIndex: 2,
      points: 1,
      explanation: 'Each request holds one worker thread for its whole 1 s wait. 200 requests run in each wave: 1–200 finish at ~1 s, 201–400 at ~2 s, 401–600 at ~3 s (measured on slide 7: last answer 3.08 s; the course run shows p50 ≈ 2 s, max ≈ 3 s). max-connections only limits open connections, not running requests; accept-count is the kernel queue for connections not yet accepted. With spring.threads.virtual.enabled=true the median drops to about 1.1 s. Deck CS.3, slides 5–7.|||Mỗi request giữ một luồng làm việc suốt 1 s chờ. Mỗi đợt chạy 200 request: 1–200 xong ở ~1 s, 201–400 ở ~2 s, 401–600 ở ~3 s (đo ở slide 7: câu trả lời cuối lúc 3,08 s; lần chạy của khoá học cho p50 ≈ 2 s, max ≈ 3 s). max-connections chỉ giới hạn số kết nối đang mở, không phải số request đang chạy; accept-count là hàng đợi của nhân cho các kết nối chưa được accept. Bật spring.threads.virtual.enabled=true thì trung vị tụt còn khoảng 1,1 s. Deck CS.3, slide 5–7.' },
    { id: 'q2',
      question: '40 tasks, each needs 10 ms of CPU and then waits 90 ms (IO), run on a fixed pool of 5 platform threads on a machine with ONE CPU. Each thread keeps its task for the whole 100 ms. How many seconds until all 40 are done (model, FIFO queue)?|||40 tác vụ, mỗi cái cần 10 ms CPU rồi chờ 90 ms (IO), chạy trên một pool cố định 5 luồng platform trên máy có MỘT CPU. Mỗi luồng giữ tác vụ của nó suốt 100 ms. Bao nhiêu giây thì cả 40 tác vụ xong (mô hình, hàng đợi FIFO)?',
      options: ['0.84|||0,84', '0.4|||0,4', '4|||4', '0.49|||0,49'],
      correctIndex: 0,
      points: 1,
      explanation: 'Computed by the simulator: 40 tasks ÷ 5 threads = 8 rounds of 100 ms ≈ 0.8 s, plus a little CPU queueing at the start of each round (5 tasks want the one CPU at once) ⇒ 0.84 s. 4 s is a pool of 1; 0.49 s is the Goetz pool of 1 × (1 + 90/10) = 10 threads; 0.4 s is the CPU floor (40 × 10 ms) that no pool can beat. The real run (PoolSizing.java, --cpus=1) measured about 0.8 s for 5 threads. Deck CS.3, slides 9–10.|||Bộ mô phỏng tính: 40 tác vụ ÷ 5 luồng = 8 lượt 100 ms ≈ 0,8 s, cộng một chút xếp hàng CPU đầu mỗi lượt (5 tác vụ cùng muốn một CPU) ⇒ 0,84 s. 4 s là pool 1 luồng; 0,49 s là pool Goetz 1 × (1 + 90/10) = 10 luồng; 0,4 s là sàn CPU (40 × 10 ms) mà không pool nào vượt được. Lần chạy thật (PoolSizing.java, --cpus=1) đo được khoảng 0,8 s với 5 luồng. Deck CS.3, slide 9–10.' },
    { id: 'q3',
      question: "Inside the callback of fs.readFile, a program calls setTimeout(() => log('setTimeout 0'), 0) and then setImmediate(() => log('setImmediate')). What is printed, in order?|||Bên trong callback của fs.readFile, chương trình gọi setTimeout(() => log('setTimeout 0'), 0) rồi setImmediate(() => log('setImmediate')). In ra gì, theo thứ tự?",
      options: ['setTimeout 0 | setImmediate|||setTimeout 0 | setImmediate', 'random — it depends on how fast the machine is|||ngẫu nhiên — tuỳ máy nhanh hay chậm', 'setTimeout 0 only (setImmediate is dropped inside I/O)|||chỉ setTimeout 0 (setImmediate bị bỏ trong I/O)', 'setImmediate | setTimeout 0|||setImmediate | setTimeout 0'],
      correctIndex: 3,
      points: 1,
      explanation: 'An I/O callback runs in the poll phase; the next phase is check, where setImmediate runs, and only then does the loop wrap round to timers. The Node documentation says so, the simulator replays it, and the real run printed setImmediate first 200 times out of 200. "Random" is the answer only in the MAIN module, where it depends on whether 1 ms has passed when the loop first checks the timers (the real run: 120 vs 80). Deck CS.3, slides 15–16.|||Callback I/O chạy ở pha poll; pha kế tiếp là check, nơi setImmediate chạy, và chỉ sau đó loop mới vòng lại pha timers. Tài liệu Node nói vậy, bộ mô phỏng diễn lại, và lần chạy thật in setImmediate trước 200 trên 200 lần. "Ngẫu nhiên" chỉ đúng ở module CHÍNH, nơi nó tuỳ việc lúc loop kiểm timers lần đầu đã qua 1 ms hay chưa (lần chạy thật: 120 vs 80). Deck CS.3, slide 15–16.' },
    { id: 'q4',
      question: 'Which pair of Node.js calls runs on the libuv thread pool (default 4 threads)?|||Cặp lời gọi Node.js nào chạy trên thread pool của libuv (mặc định 4 luồng)?',
      options: ['http.createServer request handling and socket.write|||xử lý request của http.createServer và socket.write', 'fs.readFile and crypto.pbkdf2|||fs.readFile và crypto.pbkdf2', 'setTimeout and setImmediate|||setTimeout và setImmediate', 'Promise.then and process.nextTick|||Promise.then và process.nextTick'],
      correctIndex: 1,
      points: 1,
      explanation: 'libuv uses its pool for all file-system operations and for getaddrinfo (dns.lookup); Node also sends asynchronous crypto (pbkdf2, scrypt, randomBytes) and zlib there. Sockets are watched by the kernel with epoll — no pool thread; timers and immediates are event-loop phases; promises and nextTick are queues drained on the main thread. The real run showed 8 pbkdf2 jobs finishing in two waves with a pool of 4, and the thread count jumping from 7 to 11 (libuv-worker × 4) after the first fs call. Deck CS.3, slides 14 and 17.|||libuv dùng pool cho mọi thao tác hệ thống tệp và cho getaddrinfo (dns.lookup); Node cũng đẩy mật mã bất đồng bộ (pbkdf2, scrypt, randomBytes) và zlib vào đó. Socket được nhân theo dõi bằng epoll — không tốn luồng pool; timer và immediate là các pha của event loop; promise và nextTick là các hàng đợi được xả trên luồng chính. Lần chạy thật cho thấy 8 việc pbkdf2 xong thành hai đợt với pool 4, và số luồng nhảy từ 7 lên 11 (libuv-worker × 4) sau lời gọi fs đầu tiên. Deck CS.3, slide 14 và 17.' },
    { id: 'q5',
      question: 'Two timers are scheduled with setTimeout(…, 0). Each one, when it runs, logs "timer N" and schedules Promise.resolve().then(() => log("promise inside timer N")). What does Node 22 print?|||Hai timer được hẹn bằng setTimeout(…, 0). Mỗi timer khi chạy in "timer N" và hẹn Promise.resolve().then(() => log("promise inside timer N")). Node 22 in ra gì?',
      options: ['timer 1 | promise inside timer 1 | timer 2 | promise inside timer 2|||timer 1 | promise inside timer 1 | timer 2 | promise inside timer 2', 'timer 1 | timer 2 | promise inside timer 1 | promise inside timer 2|||timer 1 | timer 2 | promise inside timer 1 | promise inside timer 2', 'promise inside timer 1 | promise inside timer 2 | timer 1 | timer 2|||promise inside timer 1 | promise inside timer 2 | timer 1 | timer 2', 'timer 2 | timer 1 | promise inside timer 2 | promise inside timer 1|||timer 2 | timer 1 | promise inside timer 2 | promise inside timer 1'],
      correctIndex: 0,
      points: 1,
      explanation: 'Since Node 11 the microtask queue is drained after EVERY callback, also between two callbacks of the same phase — like browsers. So the promise created by timer 1 runs before timer 2. Option b is what Node 10 and older printed (both timers first), a common outdated interview answer. The simulator and the real run (thu-tu.sh, part B) give option a. Deck CS.3, slide 16.|||Từ Node 11, hàng microtask được xả sau MỖI callback, kể cả giữa hai callback của cùng một pha — giống trình duyệt. Nên promise do timer 1 tạo chạy trước timer 2. Phương án b là thứ Node 10 trở về trước in ra (cả hai timer trước), một câu trả lời phỏng vấn đã lỗi thời hay gặp. Bộ mô phỏng và lần chạy thật (thu-tu.sh, phần B) cho phương án a. Deck CS.3, slide 16.' },
    { id: 'q6',
      question: 'A team moves its Spring Boot service to Java 21 virtual threads (spring.threads.virtual.enabled=true). Which endpoint will gain the LEAST?|||Một nhóm chuyển dịch vụ Spring Boot sang luồng ảo Java 21 (spring.threads.virtual.enabled=true). Endpoint nào được lợi ÍT NHẤT?',
      options: ['one that calls three slow external HTTP APIs in a row|||một endpoint gọi lần lượt ba API HTTP bên ngoài chậm', 'one that runs a 500 ms SQL report query|||một endpoint chạy câu SQL báo cáo mất 500 ms', 'one that resizes an uploaded image in pure Java (all CPU)|||một endpoint đổi cỡ ảnh tải lên bằng Java thuần (toàn CPU)', 'one that waits 2 s for a message from a queue|||một endpoint chờ 2 s để nhận thông điệp từ hàng đợi'],
      correctIndex: 2,
      points: 1,
      explanation: 'Virtual threads make WAITING cheap: a blocked virtual thread unmounts and frees its carrier, so thousands of waiting requests cost only heap objects (10,000 one-second waits took ~1 s instead of 50 s). They do not make computing faster — image resizing still needs a real core for the same time, and many such requests at once just occupy all carriers. Keep CPU-heavy work on a fixed pool sized to the cores. Deck CS.3, slides 11–13.|||Luồng ảo làm cho việc CHỜ trở nên rẻ: luồng ảo bị chặn được tháo ra và trả carrier, nên hàng nghìn request đang chờ chỉ tốn các đối tượng trên heap (10.000 lần chờ một giây mất ~1 s thay vì 50 s). Chúng không làm việc tính nhanh hơn — đổi cỡ ảnh vẫn cần một lõi thật trong đúng chừng ấy thời gian, và nhiều request như vậy cùng lúc chỉ chiếm hết các carrier. Hãy để việc nặng CPU trên một pool cố định cỡ bằng số lõi. Deck CS.3, slide 11–13.' },
    { id: 'q7',
      question: 'On Java 21, a service on virtual threads hangs under load with low CPU. In the code, an HTTP call is made inside a synchronized block. What is the most likely cause?|||Trên Java 21, một dịch vụ chạy luồng ảo bị treo khi tải cao, CPU thấp. Trong code, một lời gọi HTTP nằm bên trong một khối synchronized. Nguyên nhân khả dĩ nhất là gì?',
      options: ['Virtual threads cannot make HTTP calls|||Luồng ảo không gọi HTTP được', 'The garbage collector cannot collect virtual threads|||Bộ thu gom rác không thu được luồng ảo', 'synchronized is not allowed on virtual threads and throws an exception|||synchronized bị cấm trên luồng ảo và ném ngoại lệ', 'Blocking inside synchronized pins each virtual thread to its carrier, so the few carriers are all blocked|||Chặn bên trong synchronized ghim mỗi luồng ảo vào carrier của nó, nên vài carrier đều bị chặn hết'],
      correctIndex: 3,
      points: 1,
      explanation: 'On Java 21–23 a virtual thread that blocks while holding a monitor cannot unmount; it stays pinned and its carrier OS thread waits too. With about one carrier per core, a handful of pinned requests stalls everything — the exercise run showed 20 sleeps on 2 carriers taking ~1 s with synchronized versus ~0.1 s with ReentrantLock. Fix: ReentrantLock around blocking calls, find pins with -Djdk.tracePinnedThreads=full; JDK 24 (JEP 491) removed this pinning. Deck CS.3, slide 13; exercise 6.|||Trên Java 21–23, luồng ảo bị chặn trong lúc giữ monitor không tháo ra được; nó bị ghim và luồng HĐH carrier của nó cũng chờ theo. Với khoảng một carrier mỗi lõi, chỉ vài request bị ghim là mọi thứ đứng — lần chạy ở bài tập 6 cho 20 lần ngủ trên 2 carrier mất ~1 s với synchronized so với ~0,1 s với ReentrantLock. Cách sửa: ReentrantLock bọc lời gọi chặn, tìm chỗ ghim bằng -Djdk.tracePinnedThreads=full; JDK 24 (JEP 491) đã bỏ việc ghim này. Deck CS.3, slide 13; bài tập 6.' },
    { id: 'q8',
      question: 'Two threads start together and each executes count++ 1,000,000 times on a field declared static volatile int count. What can the final value be?|||Hai luồng xuất phát cùng lúc và mỗi luồng chạy count++ 1.000.000 lần trên một trường khai báo static volatile int count. Giá trị cuối có thể là bao nhiêu?',
      options: ['Always exactly 2,000,000 — volatile makes ++ atomic|||Luôn đúng 2.000.000 — volatile làm ++ thành nguyên tử', 'Usually less than 2,000,000, different on every run|||Thường nhỏ hơn 2.000.000, mỗi lần chạy một khác', 'Always exactly 1,000,000|||Luôn đúng 1.000.000', 'More than 2,000,000, because writes are duplicated|||Lớn hơn 2.000.000, vì các lần ghi bị nhân đôi'],
      correctIndex: 1,
      points: 1,
      explanation: 'volatile only guarantees visibility (every read and write goes to memory); count++ is still three steps — read, add, write — so two threads can read the same value and one increment is lost. The real runs ended at 1,169,190, 1,631,285 and 1,261,809. It can never exceed 2,000,000 (each thread adds at most its own million) and it is not stuck at exactly 1,000,000. synchronized or AtomicInteger give exactly 2,000,000. Deck CS.3, slide 20.|||volatile chỉ bảo đảm tính nhìn thấy (mọi lần đọc ghi đi ra bộ nhớ); count++ vẫn là ba bước — đọc, cộng, ghi — nên hai luồng có thể đọc cùng một giá trị và một lần cộng bị mất. Các lần chạy thật ra 1.169.190, 1.631.285 và 1.261.809. Nó không bao giờ vượt 2.000.000 (mỗi luồng cộng tối đa một triệu của mình) và cũng không kẹt đúng 1.000.000. synchronized hoặc AtomicInteger cho đúng 2.000.000. Deck CS.3, slide 20.' },
    { id: 'q9',
      question: 'An order service reads the stock (SELECT stock FROM item WHERE id = 1), computes stock - 1 in Java, then writes it back with UPDATE item SET stock = ? WHERE id = 1. Two orders at once sometimes leave the stock 1 too high. Which single SQL statement fixes it best?|||Một dịch vụ đặt hàng đọc tồn kho (SELECT stock FROM item WHERE id = 1), tính stock - 1 bằng Java, rồi ghi lại bằng UPDATE item SET stock = ? WHERE id = 1. Hai đơn cùng lúc thỉnh thoảng làm tồn kho dư 1. Câu SQL đơn nào sửa tốt nhất?',
      options: ['UPDATE item SET stock = stock - 1 WHERE id = 1 AND stock > 0|||UPDATE item SET stock = stock - 1 WHERE id = 1 AND stock > 0', 'SELECT stock FROM item WHERE id = 1 executed twice to double-check|||Chạy SELECT stock FROM item WHERE id = 1 hai lần để kiểm lại', 'SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED|||SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED', 'Wrap the Java method in synchronized|||Bọc phương thức Java trong synchronized'],
      correctIndex: 0,
      points: 1,
      explanation: 'The bug is a lost update: both transactions read 10 and both write 9. Letting the database do read-modify-write inside ONE statement makes it atomic under the row lock, and AND stock > 0 also prevents overselling (check that 1 row was updated). Reading twice changes nothing; READ UNCOMMITTED does not exist as a weaker mode in PostgreSQL (it behaves like READ COMMITTED) and would not help; synchronized only protects one JVM — two app servers still race. SELECT … FOR UPDATE or a version column also work. Deck CS.3, slide 22.|||Lỗi là lost update: cả hai giao dịch đọc 10 và cùng ghi 9. Để cơ sở dữ liệu tự đọc–sửa–ghi trong MỘT câu lệnh thì nó nguyên tử dưới khoá dòng, và AND stock > 0 còn chặn bán quá (kiểm có đúng 1 dòng được cập nhật). Đọc hai lần không đổi gì; READ UNCOMMITTED trong PostgreSQL không phải chế độ yếu hơn (nó chạy như READ COMMITTED) và cũng không giúp; synchronized chỉ bảo vệ trong một JVM — hai server app vẫn tranh nhau. SELECT … FOR UPDATE hoặc cột version cũng được. Deck CS.3, slide 22.' },
    { id: 'q10',
      question: 'Six requests arrive at t = 0. Each needs 10 ms CPU, then waits 40 ms for the database, then 10 ms CPU. They run thread-per-request on a pool of 2 platform threads (a thread is held during the wait). In units of 10 ms, when does the last request finish?|||Sáu request tới lúc t = 0. Mỗi cái cần 10 ms CPU, rồi chờ cơ sở dữ liệu 40 ms, rồi 10 ms CPU. Chúng chạy theo kiểu mỗi request một luồng trên pool 2 luồng platform (luồng bị giữ trong lúc chờ). Tính theo đơn vị 10 ms, request cuối xong lúc nào?',
      options: ['6|||6', '12|||12', '18|||18', '36|||36'],
      correctIndex: 2,
      points: 1,
      explanation: 'Computed by the simulator: each request occupies a thread for 1 + 4 + 1 = 6 units; 2 threads ⇒ 3 waves: R1–R2 finish at 6, R3–R4 at 12, R5–R6 at 18 (180 ms). 6 would need six threads (or virtual threads, which finish all six by 8 units on 2 carriers); 12 is what one event loop achieves, because only the CPU slices need the thread; 36 would mean everything ran one after another. Deck CS.3, slides 7 and 18.|||Bộ mô phỏng tính: mỗi request chiếm một luồng 1 + 4 + 1 = 6 đơn vị; 2 luồng ⇒ 3 đợt: R1–R2 xong lúc 6, R3–R4 lúc 12, R5–R6 lúc 18 (180 ms). 6 cần sáu luồng (hoặc luồng ảo, xong cả sáu trước 8 đơn vị trên 2 carrier); 12 là thứ một event loop đạt được, vì chỉ các lát CPU mới cần luồng; 36 nghĩa là mọi thứ chạy nối đuôi nhau. Deck CS.3, slide 7 và 18.' },
  ],
};

const QL_cs3 = {
  title: '⭐ CS.3 Quiz — Threads in backend: thread pool vs event loop|||⭐ Quiz CS.3 — Luồng trong backend: thread pool và event loop',
  slug: 'osg202-quiz-cs3',
  type: 'QUIZ',
  description: '10 câu ôn ⭐ Chuyên sâu 3 (ngoài giáo trình, không thi FE), mỗi câu có giải thích song ngữ, các câu tính toán và câu "in ra gì" có đáp án kiểm bằng bộ mô phỏng: thời gian của 600 request chờ trên pool 200 luồng, cỡ pool cho việc IO-bound trên một CPU, thứ tự setTimeout và setImmediate trong callback I/O, API nào dùng thread pool của libuv, microtask chạy xen giữa hai timer, khi nào luồng ảo không giúp gì, pinning trên Java 21, volatile và count++, sửa lost update trong SQL, và dòng thời gian của pool hai luồng.',
  quiz: QUIZ_CS3,
};

/* ───────── ⭐ CS.6 — 📑 Slide by slide · Containers (1/2): container vs VM, one process two PIDs, the 8 namespaces, nsenter (slides 1–11) ───────── */
const L_cs6_1 = {
  title: '⭐ CS.6 — 📑 Slide by slide · Containers (1/2): container vs VM, one process two PIDs, the 8 namespaces, nsenter (slides 1–11)|||⭐ CS.6 — 📑 Học theo từng slide · Container (1/2): khác VM, một tiến trình hai PID, 8 namespace, nsenter (slide 1–11)',
  slug: 'osg202-slide-cs6-1',
  type: 'VIDEO',
  description: 'Phần tự thêm ngoài giáo trình (⭐, không thi FE): giảng 11 slide đầu của deck tự dựng "Containers = namespaces + cgroups" — hình ảnh nhà riêng và căn hộ chung cư, chứng minh container dùng chung nhân với máy chủ (uname -r), một tiến trình có hai số PID (NSpid trong /proc), công thức bốn món của container (namespace, cgroup, root filesystem, capability + seccomp) và chuỗi docker → containerd → runc → nhân, bảng 8 loại namespace, tự tạo PID namespace bằng unshare và vì sao cần --fork và --mount-proc, namespace UTS, mạng, IPC, mount, xem và bước vào một hộp bằng lsns và nsenter (thứ docker exec làm), và user namespace — nền của container rootless — mọi lệnh chạy thật trên Linux.',
  content: [
    bi(`<span class="eyebrow">⭐ Advanced 6 · Lesson CS.6 (part 1 of 2) · deck "Containers = namespaces + cgroups", slides 1–11</span>
<h2>What a container really is: one ordinary process, a different view of the system, and a budget — no virtual machine anywhere</h2>
<p class="lead">This section is <strong>not</strong> in the OSG202 syllabus and is <strong>not</strong> examined in the FE — it is the bridge from the textbook to the work of a backend developer. Chapter 1 (lesson N1.A) showed you virtual machines and hypervisors; lessons 2.A–2.C taught processes; lesson 10.A showed how Linux implements them. Here we answer the question every backend developer meets on day one: <em>what is a Docker container, really?</em> The short answer is the title of the deck — a container is a normal Linux process wrapped in <strong>namespaces</strong> (what it can see) and <strong>cgroups</strong> (how much it can use). This first part takes namespaces apart one by one and rebuilds each of them with a single command; part 2 does the same for cgroups, image layers, capabilities and seccomp, and ends with a working container in about 30 lines of bash.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>Picture</td><td>explain container vs virtual machine with the flats-in-one-building picture</td></tr>
<tr><td>4–5</td><td>Proof</td><td>show that containers share the host kernel and that a container is a host process with two PIDs</td></tr>
<tr><td>6</td><td>The recipe</td><td>name the four kernel features behind every container and the chain docker → containerd → runc → kernel</td></tr>
<tr><td>7</td><td>Namespaces</td><td>list the 8 namespace types and read <code>/proc/&lt;pid&gt;/ns</code></td></tr>
<tr><td>8–9</td><td>Hands-on</td><td>create PID, UTS, network, IPC and mount namespaces with <code>unshare</code></td></tr>
<tr><td>10</td><td>Look inside</td><td>find a box with <code>lsns</code> and step into it with <code>nsenter</code> — what <code>docker exec</code> does</td></tr>
<tr><td>11</td><td>User namespace</td><td>become "root" as an ordinary user and explain rootless containers</td></tr>
</tbody>
</table>
<div class="callout">How to study it: open the slide image, read the explanation, then run the same commands yourself in a Linux machine where you are root — WSL, a Linux VM, or <code>docker run --rm -it --privileged debian:12</code> (namespaces need <code>CAP_SYS_ADMIN</code>; inside an ordinary container Docker forbids it on purpose — slide 20). Every terminal block below is the real output of the program shown, run in the course container <code>osg202-lab</code> (Debian 12, ARM64, Linux 7.0.12). The course runner has no Docker inside and no network, so where the slide used <code>docker</code> itself we rebuild the same thing with the kernel features Docker uses — the slide images keep the original Docker measurements, and the lesson says where the two differ.</div>`,
    `<span class="eyebrow">⭐ Chuyên sâu 6 · Bài CS.6 (phần 1/2) · deck "Containers = namespaces + cgroups", slide 1–11</span>
<h2>Container thật sự là gì: một tiến trình bình thường, một góc nhìn khác về hệ thống, và một ngân sách — không có máy ảo nào cả</h2>
<p class="lead">Phần này <strong>không</strong> nằm trong đề cương OSG202 và <strong>không</strong> thi FE — nó là cây cầu từ giáo trình sang công việc của một dev backend. Chương 1 (bài N1.A) cho bạn thấy máy ảo (virtual machine) và hypervisor; bài 2.A–2.C dạy tiến trình; bài 10.A cho thấy Linux hiện thực chúng ra sao. Ở đây ta trả lời câu hỏi mọi dev backend gặp ngay ngày đầu đi làm: <em>container của Docker thật ra là gì?</em> Câu trả lời ngắn chính là tên deck — container là một tiến trình Linux bình thường được bọc trong <strong>namespace</strong> (vùng tên — quyết định nó nhìn thấy gì) và <strong>cgroup</strong> (nhóm điều khiển — quyết định nó được dùng bao nhiêu). Phần 1 này tháo rời từng loại namespace và dựng lại mỗi cái bằng đúng một lệnh; phần 2 làm y như vậy với cgroup, các lớp image, capability và seccomp, rồi kết thúc bằng một container chạy được viết trong khoảng 30 dòng bash.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>Hình ảnh</td><td>giải thích container khác máy ảo bằng hình ảnh căn hộ trong một toà nhà</td></tr>
<tr><td>4–5</td><td>Chứng minh</td><td>cho thấy container dùng chung nhân của máy chủ và container là một tiến trình của máy chủ mang hai số PID</td></tr>
<tr><td>6</td><td>Công thức</td><td>kể tên bốn tính năng nhân đứng sau mọi container và chuỗi docker → containerd → runc → nhân</td></tr>
<tr><td>7</td><td>Namespace</td><td>liệt kê 8 loại namespace và đọc <code>/proc/&lt;pid&gt;/ns</code></td></tr>
<tr><td>8–9</td><td>Thực hành</td><td>tạo namespace PID, UTS, mạng, IPC và mount bằng <code>unshare</code></td></tr>
<tr><td>10</td><td>Nhìn vào trong</td><td>tìm một "hộp" bằng <code>lsns</code> và bước vào nó bằng <code>nsenter</code> — việc <code>docker exec</code> làm</td></tr>
<tr><td>11</td><td>User namespace</td><td>thành "root" khi chỉ là người dùng thường, và giải thích container rootless</td></tr>
</tbody>
</table>
<div class="callout">Cách học: mở ảnh slide, đọc phần giảng, rồi tự chạy lại đúng các lệnh đó trên một máy Linux mà bạn là root — WSL, máy ảo Linux, hoặc <code>docker run --rm -it --privileged debian:12</code> (tạo namespace cần <code>CAP_SYS_ADMIN</code>; trong một container bình thường Docker cố ý cấm việc này — slide 20). Mọi khối terminal bên dưới là output thật của đúng chương trình được hiện, chạy trong container của môn học <code>osg202-lab</code> (Debian 12, ARM64, Linux 7.0.12). Bộ chạy của môn không có Docker bên trong và không có mạng, nên chỗ nào slide dùng chính <code>docker</code> thì ta dựng lại đúng thứ đó bằng các tính năng nhân mà Docker dùng — ảnh slide giữ số đo Docker gốc, và bài nói rõ chỗ hai bên khác nhau.</div>`),
    walkHead('cs6', 1, 11),
    walk('cs6', [
      [1, 'Containers = namespaces + cgroups',
        `<p class="y-chinh">🎯 The cover states the whole lesson in one line: <strong>a container = namespaces + cgroups</strong>. "What <code>docker run</code> really asks the Linux kernel to do — measured on a real kernel (7.0, cgroup v2)." There is no container object inside Linux; there are only features of the kernel that Docker combines.</p>
<p>Most people learn Docker as a tool: write a Dockerfile, <code>docker build</code>, <code>docker run</code>, and the application "runs in a container". That is enough until something goes wrong — a container exits with code <strong>137</strong>, a Java service in Kubernetes is killed although "the heap is only 300 MB", a build on a small server dies half-way, <code>strace</code> refuses to attach, a fork-happy library makes every new request fail with <code>EAGAIN</code>. None of these can be explained with "a container is a lightweight virtual machine". All of them become obvious once you know the two kernel features in the title.</p>
<p><strong>Namespaces</strong> change what a process can <em>see</em>: its own process numbers starting at 1, its own hostname, its own network interfaces, its own mount table, its own user IDs. <strong>Cgroups</strong> (control groups) change how much it can <em>use</em>: memory, CPU time, number of processes, disk bandwidth. Docker, Podman, containerd, Kubernetes, systemd-nspawn and LXC all build containers from the same few features; they differ in packaging, not in the kernel mechanism.</p>
<p>➕ A little history. Namespaces grew piece by piece inside Linux: the mount namespace first (Linux 2.4.19, 2002 — the flag is still called <code>CLONE_NEWNS</code>, "new namespace", because nobody expected there would be others), then UTS, IPC, network and PID (2.6.19–2.6.24, 2006–2008), the user namespace finished in Linux 3.8 (2013), cgroup namespaces in 4.6 and time namespaces in 5.6 (2020). Cgroups were contributed by Google engineers (Paul Menage, Rohit Seth) in Linux 2.6.24 (2008); version 2, one unified tree, became usable in 4.5 (2016) and is the default on every modern distribution. Docker (2013) did not invent any of it — its success was a convenient image format and a simple command line on top.</p>
<p>🧭 On a real server: this very website runs as Docker containers on a 6 GB VPS. Slide 25 tells the story of a build killed with exit code 137 on that machine, twice — and by then you will be able to say exactly which file in <code>/sys/fs/cgroup</code> decided it.</p>`,
        `<p class="y-chinh">🎯 Trang bìa nói cả bài học trong một dòng: <strong>container = namespace + cgroup</strong>. "Điều <code>docker run</code> thật sự yêu cầu nhân Linux làm — đo trên một nhân thật (7.0, cgroup v2)." Bên trong Linux không có đối tượng nào tên là container; chỉ có các tính năng của nhân (kernel) mà Docker ghép lại với nhau.</p>
<p>Đa số người học Docker như học một công cụ: viết Dockerfile, <code>docker build</code>, <code>docker run</code>, và ứng dụng "chạy trong container". Như thế là đủ cho tới khi có chuyện — container thoát với mã <strong>137</strong>, một dịch vụ Java trên Kubernetes bị giết dù "heap chỉ có 300 MB", một lần build trên server nhỏ chết giữa chừng, <code>strace</code> không chịu gắn vào tiến trình, một thư viện hay fork khiến mọi request mới thất bại với <code>EAGAIN</code>. Không chuyện nào giải thích được bằng câu "container là một máy ảo nhẹ". Chuyện nào cũng trở nên hiển nhiên khi bạn biết hai tính năng nhân ở tên bài.</p>
<p><strong>Namespace</strong> (vùng tên) đổi thứ một tiến trình <em>nhìn thấy</em>: số tiến trình riêng bắt đầu từ 1, hostname riêng, card mạng riêng, bảng mount riêng, mã người dùng riêng. <strong>Cgroup</strong> (control group — nhóm điều khiển) đổi lượng tài nguyên nó được <em>dùng</em>: bộ nhớ, thời gian CPU, số tiến trình, băng thông đĩa. Docker, Podman, containerd, Kubernetes, systemd-nspawn và LXC đều dựng container từ cùng vài tính năng đó; chúng khác nhau ở cách đóng gói, không khác ở cơ chế trong nhân.</p>
<p>➕ Một chút lịch sử. Namespace lớn dần từng mảnh trong Linux: mount namespace có trước tiên (Linux 2.4.19, năm 2002 — cờ của nó tới giờ vẫn tên <code>CLONE_NEWNS</code>, "namespace mới", vì hồi đó không ai nghĩ sẽ còn loại khác), rồi UTS, IPC, mạng và PID (2.6.19–2.6.24, 2006–2008), user namespace hoàn thiện ở Linux 3.8 (2013), cgroup namespace ở 4.6 và time namespace ở 5.6 (2020). Cgroup do các kỹ sư Google (Paul Menage, Rohit Seth) đóng góp vào Linux 2.6.24 (2008); phiên bản 2 — một cây thống nhất — dùng được từ 4.5 (2016) và là mặc định trên mọi bản phân phối hiện đại. Docker (2013) không phát minh ra cái nào trong số đó — thành công của nó là một định dạng image tiện lợi và một dòng lệnh đơn giản đặt lên trên.</p>
<p>🧭 Trên server thật: chính trang web này chạy dưới dạng các container Docker trên một VPS 6 GB. Slide 25 kể chuyện một lần build bị giết với mã thoát 137 trên đúng máy đó, hai lần liền — và tới lúc ấy bạn sẽ nói được chính xác tệp nào trong <code>/sys/fs/cgroup</code> đã quyết định chuyện đó.</p>`],
      [2, 'Learning goals',
        `<p class="y-chinh">🎯 Six goals, each tied to a command you will run: prove a container is not a VM, create namespaces with <code>unshare</code>, set cgroup limits by writing files, read what <code>docker run</code> writes, understand layers / capabilities / seccomp / rootless, and build a tiny container yourself.</p>
<p>Read the list as a map of the deck. Goal 1 is slides 3–5: one command (<code>uname -r</code>) and one file (<code>/proc/&lt;pid&gt;/status</code>, line <code>NSpid</code>) are enough to show that a container shares the host kernel and is just a host process. Goal 2 is slides 7–11: the eight namespace types, each created by hand, then inspected from outside with <code>lsns</code> and entered with <code>nsenter</code>. Goal 3 is slides 12–15: cgroup v2 is a file system; you limit a group of processes by writing a number into a file, and you will watch the kernel stop a fork bomb, kill a memory hog with exit code 137 and throttle a CPU loop.</p>
<p>Goal 4 (slides 16–17) closes the circle: the flags <code>--memory</code>, <code>--cpus</code> and <code>--pids-limit</code> are nothing more than those same files, written by Docker before your program starts — so you can verify any limit from inside a container with <code>cat</code>. Goal 5 (slides 18–20) covers the other three ingredients: image layers stacked by <strong>overlayfs</strong>, the <strong>capabilities</strong> that make "root in a container" much weaker than real root, and the <strong>seccomp</strong> filter that blocks dangerous system calls. Goal 6 (slides 21–23) puts it all together in a script of about thirty lines that really runs.</p>
<p>➕ What you need first: the process model of CS.1 (PID, PPID, PID 1, exit code 128 + N — especially <strong>137 = SIGKILL</strong>), basic shell (pipes, <code>&amp;</code>, <code>$(...)</code>), and the idea of a system call from lesson 1.D. You do <strong>not</strong> need to know Kubernetes; everything here sits below it, which is exactly why it transfers to any container platform you will meet.</p>
<p class="meo">🧠 Tip: keep one terminal open as root (WSL or <code>docker run --rm -it --privileged debian:12</code>, then <code>apt-get update &amp;&amp; apt-get install -y procps iproute2 strace libcap2-bin gcc</code>) and type every command of the deck as you read. Namespaces and cgroups are learned with the fingers, not by reading.</p>`,
        `<p class="y-chinh">🎯 Sáu mục tiêu, mỗi cái gắn với một lệnh bạn sẽ chạy: chứng minh container không phải máy ảo, tạo namespace bằng <code>unshare</code>, đặt giới hạn cgroup bằng cách ghi tệp, đọc xem <code>docker run</code> ghi gì, hiểu lớp image / capability / seccomp / rootless, và tự dựng một container tí hon.</p>
<p>Hãy đọc danh sách như tấm bản đồ của deck. Mục tiêu 1 là slide 3–5: một lệnh (<code>uname -r</code>) và một tệp (<code>/proc/&lt;pid&gt;/status</code>, dòng <code>NSpid</code>) là đủ để thấy container dùng chung nhân với máy chủ và chỉ là một tiến trình của máy chủ. Mục tiêu 2 là slide 7–11: tám loại namespace, mỗi loại tự tay tạo ra, rồi xem từ bên ngoài bằng <code>lsns</code> và bước vào bằng <code>nsenter</code>. Mục tiêu 3 là slide 12–15: cgroup v2 là một hệ thống tệp; bạn giới hạn một nhóm tiến trình bằng cách ghi một con số vào một tệp, và bạn sẽ xem nhân chặn một fork bomb, giết một chương trình ngốn bộ nhớ với mã thoát 137 và hãm (throttle) một vòng lặp đốt CPU.</p>
<p>Mục tiêu 4 (slide 16–17) khép vòng: các cờ <code>--memory</code>, <code>--cpus</code> và <code>--pids-limit</code> chẳng là gì khác ngoài đúng những tệp đó, được Docker ghi trước khi chương trình của bạn khởi động — nên bạn kiểm được mọi giới hạn ngay từ bên trong container bằng <code>cat</code>. Mục tiêu 5 (slide 18–20) bàn ba nguyên liệu còn lại: các lớp image chồng lên nhau bằng <strong>overlayfs</strong>, các <strong>capability</strong> (năng lực đặc quyền) khiến "root trong container" yếu hơn root thật rất nhiều, và bộ lọc <strong>seccomp</strong> chặn các lời gọi hệ thống (system call) nguy hiểm. Mục tiêu 6 (slide 21–23) ráp tất cả lại trong một script khoảng ba mươi dòng chạy được thật.</p>
<p>➕ Cần biết trước: mô hình tiến trình của CS.1 (PID, PPID, PID 1, mã thoát 128 + N — nhất là <strong>137 = SIGKILL</strong>), shell cơ bản (ống dẫn, <code>&amp;</code>, <code>$(...)</code>), và khái niệm lời gọi hệ thống ở bài 1.D. Bạn <strong>không</strong> cần biết Kubernetes; mọi thứ ở đây nằm bên dưới nó, và chính vì thế kiến thức này dùng được cho mọi nền tảng container bạn sẽ gặp.</p>
<p class="meo">🧠 Mẹo: mở sẵn một terminal với quyền root (WSL hoặc <code>docker run --rm -it --privileged debian:12</code>, rồi <code>apt-get update &amp;&amp; apt-get install -y procps iproute2 strace libcap2-bin gcc</code>) và gõ lại mọi lệnh của deck trong lúc đọc. Namespace và cgroup học bằng ngón tay, không học bằng mắt.</p>`],
      [3, 'Everyday picture: houses vs flats in one building',
        `<p class="y-chinh">🎯 Virtual machines are <strong>separate houses</strong>: each has its own foundation (its own kernel). Containers are <strong>flats in one building</strong>: each flat has its own door number and mailbox (namespaces = what you see) and its own meter and breaker (cgroups = how much you use), but all stand on <strong>one shared foundation — one Linux kernel</strong>.</p>
<p>Walk through the picture slowly, because each detail maps to a kernel feature. A house (left) has its own foundation, plumbing and wiring: in computing terms, a virtual machine boots its <em>own</em> operating system kernel on virtual hardware provided by a hypervisor. That gives strong walls — a fire in one house rarely reaches the next — but every house needs a whole foundation, so it is heavy (gigabytes, a boot that takes seconds or minutes).</p>
<p>A flat (right) feels private: <strong>its own door number</strong> — inside the flat, the first room is "room 1" even though the building numbers it 401; that is the <strong>PID namespace</strong>, where your app is PID 1 while the host calls it 48028. <strong>Its own mailbox</strong> — letters addressed to "flat 3" never reach "flat 2"; that is the <strong>network namespace</strong>, with its own IP address and ports, so two containers can both listen on port 8080. <strong>Its own meter and breaker</strong> — use too much electricity and only your breaker trips, not the building's; that is a <strong>cgroup</strong>: too much memory and only your container is OOM-killed. But the foundation, the water main and the elevator shafts are <strong>shared</strong>: one kernel schedules every process of every flat, and a crack in the foundation (a kernel bug) is everybody's problem.</p>
<p>➕ Where the picture breaks, so you do not over-trust it: in a real building the walls are physical; in Linux the "walls" are checks inside the kernel, and their strength depends on configuration — capabilities and seccomp (slides 19–20) decide how thick they are, and <code>--privileged</code> removes most of them. Also, unlike flats, containers can share a namespace on purpose (Kubernetes puts all containers of a pod in one network namespace — they talk over <code>localhost</code>).</p>
<p class="pitfall">⚠️ Exam-style trap from Chapter 1: a hypervisor of type 1 or 2 runs <em>guest kernels</em>; a container engine never does. If a question says "each container runs its own kernel", it is describing a VM (or a special sandbox such as Kata Containers or gVisor), not a normal container.</p>`,
        `<p class="y-chinh">🎯 Máy ảo là <strong>những ngôi nhà riêng</strong>: mỗi nhà có móng riêng (nhân riêng). Container là <strong>các căn hộ trong một toà nhà</strong>: mỗi căn có số cửa và hộp thư riêng (namespace = thứ bạn nhìn thấy) và đồng hồ điện, cầu dao riêng (cgroup = lượng bạn được dùng), nhưng tất cả đứng trên <strong>một cái móng chung — một nhân Linux</strong>.</p>
<p>Hãy đi qua bức hình thật chậm, vì mỗi chi tiết ứng với một tính năng của nhân. Một ngôi nhà (bên trái) có móng, đường nước, đường điện riêng: nói theo ngôn ngữ máy tính, một máy ảo khởi động nhân hệ điều hành <em>của riêng nó</em> trên phần cứng ảo do hypervisor cung cấp. Như thế tường rất chắc — cháy một nhà hiếm khi lan sang nhà bên — nhưng nhà nào cũng cần nguyên một cái móng, nên nó nặng (hàng GB, khởi động mất vài giây tới vài phút).</p>
<p>Một căn hộ (bên phải) có cảm giác riêng tư: <strong>số cửa riêng</strong> — bên trong căn hộ, phòng đầu tiên là "phòng 1" dù toà nhà đánh số nó là 401; đó là <strong>PID namespace</strong>, nơi ứng dụng của bạn là PID 1 trong khi máy chủ gọi nó là 48028. <strong>Hộp thư riêng</strong> — thư gửi "căn 3" không bao giờ tới "căn 2"; đó là <strong>network namespace</strong> (vùng tên mạng), với địa chỉ IP và cổng riêng, nên hai container cùng lắng nghe cổng 8080 được. <strong>Đồng hồ điện và cầu dao riêng</strong> — dùng quá nhiều điện thì chỉ cầu dao nhà bạn nhảy, không phải cả toà; đó là <strong>cgroup</strong>: dùng quá nhiều bộ nhớ thì chỉ container của bạn bị OOM-kill. Nhưng cái móng, đường ống nước chính và giếng thang máy là <strong>dùng chung</strong>: một nhân lập lịch cho mọi tiến trình của mọi căn hộ, và một vết nứt ở móng (một lỗi của nhân) là chuyện của tất cả mọi người.</p>
<p>➕ Chỗ bức hình không còn đúng, để bạn đừng tin nó quá: trong toà nhà thật, tường là vật lý; trong Linux "tường" là những lần kiểm tra bên trong nhân, và độ chắc của chúng tuỳ vào cấu hình — capability và seccomp (slide 19–20) quyết định tường dày bao nhiêu, còn <code>--privileged</code> dỡ gần hết. Ngoài ra, khác với căn hộ, container có thể cố ý dùng chung một namespace (Kubernetes đặt mọi container của một pod vào cùng một network namespace — chúng nói chuyện với nhau qua <code>localhost</code>).</p>
<p class="pitfall">⚠️ Bẫy kiểu đề thi từ Chương 1: hypervisor loại 1 hay loại 2 đều chạy <em>nhân khách</em> (guest kernel); engine container thì không bao giờ. Nếu một câu hỏi nói "mỗi container chạy nhân riêng của nó", nó đang tả một máy ảo (hoặc một loại sandbox đặc biệt như Kata Containers hay gVisor), không phải container bình thường.</p>`],
      [4, 'A container is not a VM: they share one kernel',
        `<p class="y-chinh">🎯 The left picture stacks the layers: a VM has <em>guest kernel + libs + app</em> on a hypervisor; a container has only <em>libs + app</em> on <strong>one shared Linux kernel</strong>. The terminal proves it: Debian and Alpine containers report the same kernel, <code>7.0.12-linuxkit</code>. macOS has no Linux kernel, so Docker Desktop runs one Linux VM and every container shares <em>its</em> kernel.</p>
<p>Look at what each column must carry. In the VM column every app brings a complete operating system: a kernel, drivers, an init system, libraries. In the container column the boxes stop at "libs": an image such as <code>debian:12</code> or <code>alpine</code> contains only user-space files — a shell, a C library, a package manager, your program — and nothing that boots. When the container starts, its first process is your program, started directly by the host kernel.</p>
<p>The slide's measurement was made on a Mac: <code>uname -sr</code> there prints <code>Darwin 27.0.0</code> (the macOS kernel), while both containers print <code>7.0.12-linuxkit</code>. That is the kernel of the small Linux virtual machine that Docker Desktop starts in the background on macOS and Windows — so on those systems there <em>is</em> one VM, but only one, shared by all containers. Here is the same check inside the course container (also on that Linux kernel):</p>
<div class="out"># Slides 4 and 7: which kernel, which cgroup version, and the namespaces of this shell<br>
$ uname -r<br>
7.0.12-linuxkit<br>
$ stat -fc %T /sys/fs/cgroup<br>
cgroup2fs<br>
$ cat /proc/self/cgroup<br>
0::/<br>
$ ls -l /proc/self/ns | awk 'NR&gt;1{print $9, $10, $11}'<br>
cgroup -&gt; cgroup:[4026533714]<br>
ipc -&gt; ipc:[4026533696]<br>
mnt -&gt; mnt:[4026533657]<br>
net -&gt; net:[4026533715]<br>
pid -&gt; pid:[4026533713]<br>
pid_for_children -&gt; pid:[4026533713]<br>
time -&gt; time:[4026533911]<br>
time_for_children -&gt; time:[4026533911]<br>
user -&gt; user:[4026531837]<br>
uts -&gt; uts:[4026533691]</div>
<p>Read the four answers. <code>uname -r</code> is a system call that asks the <em>kernel</em> for its version — no file of the image is involved, which is why every image gives the same answer. <code>stat -fc %T /sys/fs/cgroup</code> prints <code>cgroup2fs</code>: this kernel uses <strong>cgroup v2</strong> (one unified tree; v1 would show <code>tmpfs</code> with many sub-mounts). <code>cat /proc/self/cgroup</code> prints <code>0::/</code>: this shell sits at the root of the cgroup tree <em>it can see</em> — Docker gave the container its own cgroup namespace, so its cgroup looks like <code>/</code> (slide 16). The last command lists the eight namespaces of the shell; we come back to them on slide 7.</p>
<p>➕ Consequences you will feel at work: a container image built for Linux cannot run Windows binaries (it would need a Windows kernel); a kernel feature missing on the host (for example a new <code>io_uring</code> operation) is missing in every container; and kernel tuning such as <code>vm.swappiness</code> or <code>net.core.somaxconn</code> is set on the host and shared, apart from the few settings that belong to a namespace (most <code>net.*</code> values are per network namespace).</p>
<p class="pitfall">⚠️ "My container runs Ubuntu 22.04, so it has Ubuntu's kernel" — no: it has Ubuntu's <em>user space</em>. <code>cat /etc/os-release</code> says Ubuntu, <code>uname -r</code> says whatever the host runs. Mixing the two up is the classic cause of "it works on my machine" with kernel-dependent software (eBPF tools, file-system features, WireGuard).</p>`,
        `<p class="y-chinh">🎯 Hình bên trái xếp chồng các tầng: một máy ảo có <em>nhân khách + thư viện + app</em> trên hypervisor; một container chỉ có <em>thư viện + app</em> trên <strong>một nhân Linux dùng chung</strong>. Terminal chứng minh điều đó: container Debian và Alpine báo cùng một nhân, <code>7.0.12-linuxkit</code>. macOS không có nhân Linux, nên Docker Desktop chạy một máy ảo Linux và mọi container dùng chung nhân <em>của nó</em>.</p>
<p>Hãy nhìn xem mỗi cột phải mang theo những gì. Ở cột máy ảo, mỗi app mang nguyên một hệ điều hành: nhân, driver, hệ thống init, thư viện. Ở cột container, các ô dừng ở "libs": một image như <code>debian:12</code> hay <code>alpine</code> chỉ chứa các tệp của không gian người dùng (user space) — một shell, một thư viện C, một trình quản lý gói, chương trình của bạn — và không có gì để khởi động (boot) cả. Khi container chạy, tiến trình đầu tiên của nó chính là chương trình của bạn, do nhân của máy chủ khởi động trực tiếp.</p>
<p>Số đo trên slide làm trên máy Mac: <code>uname -sr</code> ở đó in <code>Darwin 27.0.0</code> (nhân của macOS), còn cả hai container in <code>7.0.12-linuxkit</code>. Đó là nhân của cái máy ảo Linux nhỏ mà Docker Desktop chạy ngầm trên macOS và Windows — nên trên các hệ đó <em>có</em> một máy ảo, nhưng chỉ một, dùng chung cho mọi container. Đây là cùng phép kiểm đó bên trong container của môn học (cũng trên nhân Linux ấy):</p>
<div class="out"># Slide 4 và 7: nhân nào, cgroup bản mấy, và các namespace của shell này<br>
$ uname -r<br>
7.0.12-linuxkit<br>
$ stat -fc %T /sys/fs/cgroup<br>
cgroup2fs<br>
$ cat /proc/self/cgroup<br>
0::/<br>
$ ls -l /proc/self/ns | awk 'NR&gt;1{print $9, $10, $11}'<br>
cgroup -&gt; cgroup:[4026533714]<br>
ipc -&gt; ipc:[4026533696]<br>
mnt -&gt; mnt:[4026533657]<br>
net -&gt; net:[4026533715]<br>
pid -&gt; pid:[4026533713]<br>
pid_for_children -&gt; pid:[4026533713]<br>
time -&gt; time:[4026533911]<br>
time_for_children -&gt; time:[4026533911]<br>
user -&gt; user:[4026531837]<br>
uts -&gt; uts:[4026533691]</div>
<p>Đọc bốn câu trả lời. <code>uname -r</code> là một lời gọi hệ thống hỏi <em>nhân</em> phiên bản của nó — không tệp nào của image dính vào, vì thế mọi image đều trả lời giống nhau. <code>stat -fc %T /sys/fs/cgroup</code> in <code>cgroup2fs</code>: nhân này dùng <strong>cgroup v2</strong> (một cây thống nhất; v1 sẽ hiện <code>tmpfs</code> với nhiều điểm mount con). <code>cat /proc/self/cgroup</code> in <code>0::/</code>: shell này nằm ở gốc của cây cgroup <em>mà nó nhìn thấy</em> — Docker đã cho container một cgroup namespace riêng, nên cgroup của nó trông như <code>/</code> (slide 16). Lệnh cuối liệt kê tám namespace của shell; ta quay lại chúng ở slide 7.</p>
<p>➕ Hệ quả bạn sẽ gặp khi đi làm: một image container dựng cho Linux không chạy được tệp thực thi Windows (cần nhân Windows); một tính năng nhân thiếu trên máy chủ (ví dụ một thao tác <code>io_uring</code> mới) thì thiếu trong mọi container; và các tinh chỉnh nhân như <code>vm.swappiness</code> hay <code>net.core.somaxconn</code> đặt trên máy chủ và dùng chung, trừ vài thiết lập thuộc về một namespace (đa số giá trị <code>net.*</code> là riêng cho từng network namespace).</p>
<p class="pitfall">⚠️ "Container của tôi chạy Ubuntu 22.04 nên nó có nhân của Ubuntu" — không: nó có <em>không gian người dùng</em> của Ubuntu. <code>cat /etc/os-release</code> nói Ubuntu, còn <code>uname -r</code> nói máy chủ đang chạy nhân gì. Nhầm hai thứ này là nguyên nhân kinh điển của "máy tôi chạy được" với phần mềm phụ thuộc nhân (công cụ eBPF, tính năng hệ thống tệp, WireGuard).</p>`],
      [5, 'Proof: a container is just a process on the host',
        `<p class="y-chinh">🎯 Start a container running <code>sleep 1000</code>: inside, <code>ps</code> shows <code>sleep</code> as <strong>PID 1</strong>; on the host, <code>docker inspect</code> and <code>ps</code> with <code>--pid=host</code> show the <em>same</em> process as <strong>PID 48028</strong>, whose parent is <code>containerd-shim</code>. One process, two numbers — no guest OS boots.</p>
<p>The slide's terminal (measured with Docker Desktop) has four steps. <code>docker exec osg-cs6-web ps</code> runs <code>ps</code> inside the container: it sees only two processes, <code>sleep</code> as PID 1 and <code>ps</code> itself. <code>docker inspect -f '&#123;&#123;.State.Pid&#125;&#125;'</code> asks Docker which host PID that container's main process has: 48028. Then a second container started with <code>--pid=host</code> (it shares the host's PID namespace, so it sees everything) lists the host's process table: there is <code>48028 sleep 1000</code>, child of 48005 <code>containerd-shim-runc-v2</code>. The picture on the right draws it: the kernel keeps <strong>a PID for every namespace level</strong> the process belongs to.</p>
<p>The course runner has no Docker inside, so we rebuild exactly the same situation with the kernel feature Docker uses — <code>unshare --pid --fork --mount-proc</code> creates a new PID namespace and starts <code>sleep</code> as its first process:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_ADMIN</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 5: one process, two PIDs — a "container" made with unshare, seen from inside and from outside<br>
$ unshare --pid --fork --mount-proc sleep 300 &amp;<br>
$ P=$(pgrep -x sleep); echo "outside, sleep is PID $P"<br>
outside, sleep is PID 13<br>
$ ps -o pid,ppid,comm -p $P,$(ps -o ppid= -p $P | tr -d " ")<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 unshare<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 sleep<br>
$ grep NSpid /proc/$P/status<br>
NSpid:	13	1<br>
$ nsenter -t $P -p -m ps -o pid,ppid,comm<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 ps</div>
<p>Read it top to bottom. From outside, <code>sleep</code> is PID 11 and its parent is PID 8, <code>unshare</code> — the process that created the namespace and stays behind as the parent, exactly the job <code>containerd-shim</code> does for a Docker container. The line <code>NSpid: 11 1</code> in <code>/proc/11/status</code> is the kernel itself listing the two numbers: 11 in the outer namespace, 1 in the inner one (with nested namespaces there would be more columns). Finally <code>nsenter -t 11 -p -m ps</code> runs <code>ps</code> <em>inside</em> that namespace: there, <code>sleep</code> is PID 1 and the world contains only two processes. (The PPID shows 0 for both because their real parents live outside the namespace and are invisible from inside.)</p>
<p>➕ Why this matters in practice: everything you know about processes applies to containers unchanged. On a Linux server you can <code>ps</code>, <code>top</code>, <code>kill</code>, <code>strace</code> or <code>perf</code> a container's process from the host; a container's CPU and memory show up in the host's <code>top</code>; and the container ends when its PID 1 ends — the same rule as in CS.1 (slide 13 there: when PID 1 of a namespace dies, the kernel kills every other process in it).</p>
<p class="meo">🧠 Remember the sentence for interviews: "A container is a process (or a tree of processes) that the kernel shows a different view of the system and limits in resources." If you can add "and on a Linux host you can see it with ps", you have just shown you understand it, not only use it.</p>`,
        `<p class="y-chinh">🎯 Chạy một container với lệnh <code>sleep 1000</code>: bên trong, <code>ps</code> hiện <code>sleep</code> là <strong>PID 1</strong>; trên máy chủ, <code>docker inspect</code> và <code>ps</code> với <code>--pid=host</code> hiện <em>cùng</em> tiến trình đó là <strong>PID 48028</strong>, có cha là <code>containerd-shim</code>. Một tiến trình, hai con số — không hệ điều hành khách nào khởi động cả.</p>
<p>Terminal trên slide (đo với Docker Desktop) có bốn bước. <code>docker exec osg-cs6-web ps</code> chạy <code>ps</code> bên trong container: nó chỉ thấy hai tiến trình, <code>sleep</code> là PID 1 và chính <code>ps</code>. <code>docker inspect -f '&#123;&#123;.State.Pid&#125;&#125;'</code> hỏi Docker tiến trình chính của container đó mang PID nào trên máy chủ: 48028. Rồi một container thứ hai chạy với <code>--pid=host</code> (nó dùng chung PID namespace của máy chủ nên thấy hết) liệt kê bảng tiến trình của máy chủ: có <code>48028 sleep 1000</code>, con của 48005 <code>containerd-shim-runc-v2</code>. Hình bên phải vẽ lại điều đó: nhân giữ <strong>một số PID cho mỗi tầng namespace</strong> mà tiến trình thuộc về.</p>
<p>Bộ chạy của môn học không có Docker bên trong, nên ta dựng lại đúng tình huống đó bằng tính năng nhân mà Docker dùng — <code>unshare --pid --fork --mount-proc</code> tạo một PID namespace mới và khởi động <code>sleep</code> làm tiến trình đầu tiên của nó:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_ADMIN</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 5: một tiến trình, hai PID — một "container" dựng bằng unshare, nhìn từ trong và từ ngoài<br>
$ unshare --pid --fork --mount-proc sleep 300 &amp;<br>
$ P=$(pgrep -x sleep); echo "outside, sleep is PID $P"<br>
outside, sleep is PID 13<br>
$ ps -o pid,ppid,comm -p $P,$(ps -o ppid= -p $P | tr -d " ")<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 unshare<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 sleep<br>
$ grep NSpid /proc/$P/status<br>
NSpid:	13	1<br>
$ nsenter -t $P -p -m ps -o pid,ppid,comm<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 ps</div>
<p>Đọc từ trên xuống. Từ bên ngoài, <code>sleep</code> là PID 11 và cha của nó là PID 8, <code>unshare</code> — tiến trình đã tạo namespace và ở lại làm cha, đúng công việc <code>containerd-shim</code> làm cho một container Docker. Dòng <code>NSpid: 11 1</code> trong <code>/proc/11/status</code> là chính nhân liệt kê hai con số: 11 ở namespace ngoài, 1 ở namespace trong (namespace lồng nhau thì sẽ có thêm cột). Cuối cùng <code>nsenter -t 11 -p -m ps</code> chạy <code>ps</code> <em>bên trong</em> namespace đó: ở đó, <code>sleep</code> là PID 1 và thế giới chỉ có hai tiến trình. (Cột PPID hiện 0 cho cả hai vì cha thật của chúng ở ngoài namespace nên từ bên trong không nhìn thấy.)</p>
<p>➕ Vì sao điều này quan trọng trong thực tế: mọi điều bạn biết về tiến trình đều áp dụng nguyên vẹn cho container. Trên một server Linux, từ máy chủ bạn <code>ps</code>, <code>top</code>, <code>kill</code>, <code>strace</code> hay <code>perf</code> được tiến trình của container; CPU và bộ nhớ của container hiện trong <code>top</code> của máy chủ; và container kết thúc khi PID 1 của nó kết thúc — đúng luật ở CS.1 (slide 13 bên đó: khi PID 1 của một namespace chết, nhân giết mọi tiến trình khác trong đó).</p>
<p class="meo">🧠 Nhớ câu này cho phỏng vấn: "Container là một tiến trình (hoặc một cây tiến trình) được nhân cho nhìn hệ thống theo một góc khác và bị giới hạn tài nguyên." Nếu nói thêm được "và trên máy chủ Linux bạn thấy nó bằng ps", bạn vừa cho thấy mình hiểu nó, không chỉ biết dùng nó.</p>`],
      [6, 'The recipe: four kernel features around one process',
        `<p class="y-chinh">🎯 Four ingredients around one ordinary process: ① <strong>namespaces</strong> — what it can see; ② <strong>cgroups</strong> — how much it can use; ③ a <strong>root filesystem</strong> — which files are "/" (image layers via overlayfs); ④ <strong>capabilities + seccomp</strong> — what it may do. There is no "container" object in the kernel; Docker, Podman, containerd and Kubernetes only combine these.</p>
<p>The definition at the bottom of the slide is worth learning word for word: <em>container = a process + namespaces + cgroups + a root filesystem + reduced privileges</em>. Each ingredient answers a different question, and each can be used alone. A process in a new namespace but no cgroup is isolated but unlimited; a process in a cgroup without namespaces is limited but sees the whole machine — that is exactly how systemd runs ordinary services (every service is a cgroup, nothing more). The root filesystem is a directory that becomes "/" for the process (<code>pivot_root</code> or <code>chroot</code>); image layers are just a clever way of building that directory. Capabilities and seccomp are the thickness of the walls.</p>
<p>Who does what when you type <code>docker run</code>? The sequence below follows one command down to the kernel:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/22641bf494a91906ee3f25c8f765d61153b675bd.svg" alt="docker run, followed down to the kernel: dockerd and containerd prepare, runc asks the kernel for cgroups, namespaces, a new root, fewer privileges — then execs your program" loading="lazy" /><p class="chu-thich">🧩 docker run, followed down to the kernel: dockerd and containerd prepare, runc asks the kernel for cgroups, namespaces, a new root, fewer privileges — then execs your program</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' What really happens on docker run --memory 64m --cpus 0.5 --pids-limit 50 node:22 node app.js
skinparam sequenceMessageAlign center
actor "you" as U
participant "docker CLI" as C
participant "dockerd" as D
participant "containerd\\n+ containerd-shim" as S
participant "runc" as R
participant "Linux kernel" as K
U -&gt; C : docker run --memory 64m ...
C -&gt; D : REST API: create + start
D -&gt; S : image layers -&gt; overlay mount\\n(lowerdir = image, upperdir = new, empty)
S -&gt; R : runc create (config.json = OCI spec)
R -&gt; K : mkdir /sys/fs/cgroup/.../&lt;ID&gt;\\nwrite memory.max, cpu.max, pids.max
R -&gt; K : clone(CLONE_NEWPID | NEWNS | NEWNET\\n| NEWUTS | NEWIPC | NEWCGROUP)
R -&gt; K : pivot_root(overlay) · mount /proc, /dev, /sys
R -&gt; K : drop capabilities (keep 14) · load seccomp filter
R -&gt; K : execve("node", ["node", "app.js"])
note over K
  from here on there is no "container" program running:
  just node, PID 1 in its namespaces, inside its cgroup.
  runc exits; containerd-shim stays as the parent
  (keeps stdout/stderr, collects the exit code).
end note
K --&gt; S : SIGCHLD when node exits (e.g. 137 after an OOM kill)
S --&gt; D : exit code + OOMKilled flag
@enduml</code></pre></details>
<p>Read the arrows that reach the kernel; they are the four ingredients in order. runc creates the cgroup directory and writes the limits (②); it calls <code>clone</code> with the <code>CLONE_NEW*</code> flags (①); it switches the root to the overlay mount with <code>pivot_root</code> and mounts <code>/proc</code>, <code>/dev</code>, <code>/sys</code> (③); it drops capabilities and loads the seccomp filter (④); and finally it calls <code>execve</code> on your program. From that moment no "container software" is running: runc exits, and the only Docker-related process left is <code>containerd-shim</code>, the parent that holds stdout/stderr and collects the exit code — that is why it appeared on slide 5.</p>
<p>➕ This chain is standardised: the <strong>OCI runtime specification</strong> (Open Container Initiative, 2015) defines the <code>config.json</code> that runc reads — a JSON list of namespaces, cgroup limits, mounts, capabilities and seccomp rules. Kubernetes talks to containerd or CRI-O, which talk to runc (or crun, or gVisor's runsc, or Kata) — swap the runtime and the same image runs with different walls. Part 2 rebuilds this whole sequence by hand (slides 21–23).</p>
<p class="pitfall">⚠️ "Docker is the container" — no. If dockerd is restarted, running containers keep running (with <code>live-restore</code>), because the processes belong to the kernel and to containerd-shim, not to the docker daemon. Conversely, killing <code>containerd-shim</code> or the app process ends the container whatever Docker thinks.</p>`,
        `<p class="y-chinh">🎯 Bốn nguyên liệu bao quanh một tiến trình bình thường: ① <strong>namespace</strong> — nó nhìn thấy gì; ② <strong>cgroup</strong> — nó được dùng bao nhiêu; ③ một <strong>hệ thống tệp gốc</strong> (root filesystem) — tệp nào là "/" (các lớp image qua overlayfs); ④ <strong>capability + seccomp</strong> — nó được phép làm gì. Trong nhân không có đối tượng "container"; Docker, Podman, containerd và Kubernetes chỉ ghép các thứ này lại.</p>
<p>Định nghĩa ở cuối slide đáng học thuộc từng chữ: <em>container = một tiến trình + namespace + cgroup + một hệ thống tệp gốc + đặc quyền bị cắt bớt</em>. Mỗi nguyên liệu trả lời một câu hỏi khác nhau, và mỗi cái dùng riêng được. Một tiến trình trong namespace mới nhưng không có cgroup thì bị cách ly nhưng không bị giới hạn; một tiến trình trong cgroup mà không có namespace thì bị giới hạn nhưng nhìn thấy cả máy — đó chính xác là cách systemd chạy các dịch vụ thường (mỗi dịch vụ là một cgroup, không hơn). Hệ thống tệp gốc là một thư mục trở thành "/" của tiến trình (<code>pivot_root</code> hoặc <code>chroot</code>); các lớp image chỉ là một cách khéo léo để dựng thư mục đó. Capability và seccomp là độ dày của bức tường.</p>
<p>Ai làm gì khi bạn gõ <code>docker run</code>? Sơ đồ tuần tự dưới đây đi theo một lệnh xuống tận nhân:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/22641bf494a91906ee3f25c8f765d61153b675bd.svg" alt="docker run, lần theo xuống tới nhân: dockerd và containerd chuẩn bị, runc xin nhân cgroup, namespace, gốc mới, bớt đặc quyền — rồi exec chương trình của bạn" loading="lazy" /><p class="chu-thich">🧩 docker run, lần theo xuống tới nhân: dockerd và containerd chuẩn bị, runc xin nhân cgroup, namespace, gốc mới, bớt đặc quyền — rồi exec chương trình của bạn</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Điều thật sự xảy ra khi docker run --memory 64m --cpus 0.5 --pids-limit 50 node:22 node app.js
skinparam sequenceMessageAlign center
actor "you" as U
participant "docker CLI" as C
participant "dockerd" as D
participant "containerd\\n+ containerd-shim" as S
participant "runc" as R
participant "Linux kernel" as K
U -&gt; C : docker run --memory 64m ...
C -&gt; D : REST API: create + start
D -&gt; S : image layers -&gt; overlay mount\\n(lowerdir = image, upperdir = new, empty)
S -&gt; R : runc create (config.json = OCI spec)
R -&gt; K : mkdir /sys/fs/cgroup/.../&lt;ID&gt;\\nwrite memory.max, cpu.max, pids.max
R -&gt; K : clone(CLONE_NEWPID | NEWNS | NEWNET\\n| NEWUTS | NEWIPC | NEWCGROUP)
R -&gt; K : pivot_root(overlay) · mount /proc, /dev, /sys
R -&gt; K : drop capabilities (keep 14) · load seccomp filter
R -&gt; K : execve("node", ["node", "app.js"])
note over K
  from here on there is no "container" program running:
  just node, PID 1 in its namespaces, inside its cgroup.
  runc exits; containerd-shim stays as the parent
  (keeps stdout/stderr, collects the exit code).
end note
K --&gt; S : SIGCHLD when node exits (e.g. 137 after an OOM kill)
S --&gt; D : exit code + OOMKilled flag
@enduml</code></pre></details>
<p>Đọc các mũi tên chạm tới nhân; chúng là bốn nguyên liệu theo thứ tự. runc tạo thư mục cgroup và ghi các giới hạn (②); nó gọi <code>clone</code> với các cờ <code>CLONE_NEW*</code> (①); nó đổi gốc sang điểm mount overlay bằng <code>pivot_root</code> và mount <code>/proc</code>, <code>/dev</code>, <code>/sys</code> (③); nó bỏ bớt capability và nạp bộ lọc seccomp (④); và cuối cùng nó gọi <code>execve</code> chương trình của bạn. Từ lúc đó không còn "phần mềm container" nào đang chạy: runc thoát, và tiến trình duy nhất còn lại dính tới Docker là <code>containerd-shim</code>, ông cha giữ stdout/stderr và thu mã thoát — vì thế nó mới hiện ra ở slide 5.</p>
<p>➕ Chuỗi này đã được chuẩn hoá: <strong>đặc tả OCI runtime</strong> (Open Container Initiative, 2015) định nghĩa tệp <code>config.json</code> mà runc đọc — một danh sách JSON các namespace, giới hạn cgroup, điểm mount, capability và luật seccomp. Kubernetes nói chuyện với containerd hoặc CRI-O, chúng lại nói chuyện với runc (hoặc crun, hoặc runsc của gVisor, hoặc Kata) — đổi runtime là cùng một image chạy với những bức tường khác. Phần 2 dựng lại toàn bộ chuỗi này bằng tay (slide 21–23).</p>
<p class="pitfall">⚠️ "Docker chính là container" — không. Nếu dockerd khởi động lại, các container đang chạy vẫn chạy tiếp (khi bật <code>live-restore</code>), vì các tiến trình thuộc về nhân và containerd-shim, không thuộc về daemon docker. Ngược lại, giết <code>containerd-shim</code> hoặc tiến trình app là container kết thúc, Docker nghĩ gì cũng mặc.</p>`],
      [7, 'Namespaces: 8 kinds, each hides one thing',
        `<p class="y-chinh">🎯 Linux has <strong>8 namespace types</strong>: pid, mnt, net, uts, ipc, user, cgroup, time — each hides one part of the system. Every process points to exactly one namespace of each kind, visible as links in <code>/proc/&lt;pid&gt;/ns/</code>; <strong>the same number means the same namespace</strong>.</p>
<p>The table on the slide (from man7.org <em>namespaces(7)</em>; the "Linux" column is the version in which <code>/proc/PID/ns/&lt;type&gt;</code> appeared) is the whole list. <strong>pid</strong> isolates process numbers — you become PID 1 (slide 8). <strong>mnt</strong> isolates the mount table — you get your own "/", which is how the image becomes your root filesystem. <strong>net</strong> isolates network devices, IP addresses, routing tables, firewall rules and port numbers — two containers can both bind port 8080. <strong>uts</strong> isolates the hostname (UTS = "UNIX Time-sharing System", the name of the old <code>struct utsname</code> that <code>uname</code> returns). <strong>ipc</strong> isolates System V IPC objects and POSIX message queues — shared memory of one container is invisible to another. <strong>user</strong> isolates user and group IDs: uid 0 inside can be an ordinary uid outside (slide 11). <strong>cgroup</strong> isolates which cgroup looks like "/" (slide 16). <strong>time</strong> (Linux 5.6) gives a container its own boot and monotonic clocks, mostly for checkpoint/restore — Docker does not use it by default.</p>
<p>Every process has one namespace of each type; the kernel shows them as symbolic links whose target names the type and an inode number. The listing at the end of the slide 4 run above is one of them: <code>cgroup:[4026533644]</code>, <code>pid:[4026533643]</code>… Two processes are in the same namespace exactly when the numbers match. Note <code>user -&gt; user:[4026531837]</code> — a small, fixed number: that is the host's initial user namespace, which Docker does not change by default (so root in a normal container <em>is</em> uid 0 for the kernel — slide 19 explains what still protects the host). The <code>pid_for_children</code> and <code>time_for_children</code> entries exist because these two namespaces can only be changed for children: a process never changes its own PID.</p>
<p>➕ Three system calls do everything: <code>clone(CLONE_NEW…)</code> creates a child in new namespaces (what runc and <code>unshare --fork</code> do), <code>unshare(CLONE_NEW…)</code> moves the caller into new namespaces, and <code>setns(fd)</code> joins an existing one through a file descriptor opened on <code>/proc/&lt;pid&gt;/ns/&lt;type&gt;</code> (what <code>nsenter</code> and <code>docker exec</code> do — slide 10). A namespace lives as long as something references it: a process inside it, an open fd, or a bind mount of the <code>ns</code> file (this is how <code>ip netns add</code> keeps a network namespace with no process).</p>
<p class="meo">🧠 Mnemonic for the eight: <strong>"P-M-N-U-I-U-C-T"</strong> — <em>Please Mount Network, Unix Is Usually Container Tech</em>. More useful than the mnemonic: one sentence per type saying what <em>you</em> would lose without it (no pid ns: your app sees every host process; no net ns: two apps fight over port 8080; no mnt ns: no image at all).</p>`,
        `<p class="y-chinh">🎯 Linux có <strong>8 loại namespace</strong>: pid, mnt, net, uts, ipc, user, cgroup, time — mỗi loại giấu một phần của hệ thống. Mỗi tiến trình trỏ tới đúng một namespace của mỗi loại, thấy được dưới dạng các liên kết trong <code>/proc/&lt;pid&gt;/ns/</code>; <strong>cùng số nghĩa là cùng namespace</strong>.</p>
<p>Bảng trên slide (lấy từ man7.org <em>namespaces(7)</em>; cột "Linux" là phiên bản xuất hiện <code>/proc/PID/ns/&lt;loại&gt;</code>) là toàn bộ danh sách. <strong>pid</strong> cách ly số tiến trình — bạn thành PID 1 (slide 8). <strong>mnt</strong> cách ly bảng mount — bạn có "/" riêng, chính là cách image trở thành hệ thống tệp gốc của bạn. <strong>net</strong> cách ly thiết bị mạng, địa chỉ IP, bảng định tuyến, luật tường lửa và số cổng — hai container cùng bind cổng 8080 được. <strong>uts</strong> cách ly hostname (UTS = "UNIX Time-sharing System", tên của <code>struct utsname</code> cũ mà <code>uname</code> trả về). <strong>ipc</strong> cách ly các đối tượng IPC System V và hàng đợi thông điệp POSIX — bộ nhớ dùng chung của container này vô hình với container khác. <strong>user</strong> cách ly mã người dùng và nhóm: uid 0 bên trong có thể là một uid thường bên ngoài (slide 11). <strong>cgroup</strong> cách ly việc cgroup nào trông như "/" (slide 16). <strong>time</strong> (Linux 5.6) cho container đồng hồ boot và đồng hồ đơn điệu (monotonic) riêng, chủ yếu cho checkpoint/restore — Docker mặc định không dùng.</p>
<p>Mỗi tiến trình có một namespace của mỗi loại; nhân hiện chúng dưới dạng liên kết tượng trưng (symbolic link) mà đích ghi tên loại và một số inode. Danh sách ở cuối lần chạy của slide 4 phía trên chính là chúng: <code>cgroup:[4026533644]</code>, <code>pid:[4026533643]</code>… Hai tiến trình ở cùng một namespace khi và chỉ khi các số trùng nhau. Để ý <code>user -&gt; user:[4026531837]</code> — một số nhỏ, cố định: đó là user namespace ban đầu của máy chủ, mặc định Docker không đổi nó (nên root trong một container bình thường <em>là</em> uid 0 đối với nhân — slide 19 giải thích thứ gì vẫn bảo vệ máy chủ). Các mục <code>pid_for_children</code> và <code>time_for_children</code> tồn tại vì hai namespace này chỉ đổi được cho tiến trình con: một tiến trình không bao giờ đổi PID của chính nó.</p>
<p>➕ Ba lời gọi hệ thống làm mọi việc: <code>clone(CLONE_NEW…)</code> tạo một tiến trình con trong namespace mới (việc runc và <code>unshare --fork</code> làm), <code>unshare(CLONE_NEW…)</code> chuyển chính tiến trình gọi sang namespace mới, và <code>setns(fd)</code> gia nhập một namespace có sẵn qua một mô tả tệp (file descriptor) mở trên <code>/proc/&lt;pid&gt;/ns/&lt;loại&gt;</code> (việc <code>nsenter</code> và <code>docker exec</code> làm — slide 10). Một namespace sống chừng nào còn thứ gì tham chiếu tới nó: một tiến trình bên trong, một fd đang mở, hoặc một bind mount của tệp <code>ns</code> (đó là cách <code>ip netns add</code> giữ một network namespace không có tiến trình nào).</p>
<p class="meo">🧠 Cách nhớ tám loại: <strong>"P-M-N-U-I-U-C-T"</strong>. Hữu ích hơn câu thần chú: mỗi loại một câu nói <em>bạn</em> sẽ mất gì nếu không có nó (không có pid ns: app thấy mọi tiến trình của máy chủ; không có net ns: hai app tranh nhau cổng 8080; không có mnt ns: chẳng có image nào cả).</p>`],
      [8, 'PID namespace: become PID 1 with one command',
        `<p class="y-chinh">🎯 <code>unshare --pid --fork --mount-proc bash</code> — and <code>echo $$</code> prints <strong>1</strong>, <code>ps -ef</code> shows only two processes. <code>--pid</code> creates the namespace for the children, <code>--fork</code> makes the child (not unshare) PID 1, <code>--mount-proc</code> mounts a fresh <code>/proc</code>. PID 1 is special: when it dies, every process in the namespace dies; it ignores signals it has no handler for.</p>
<p>The slide shows the working command. The course runner reproduces it, then removes each flag in turn, because the failures teach more than the success:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_ADMIN</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 8: the three flags of unshare, each one removed in turn<br>
$ unshare --pid --fork --mount-proc bash -c 'echo "inside: my PID is $$"; ps -ef; exit'<br>
inside: my PID is 1<br>
UID &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID &nbsp;C STIME TTY &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TIME CMD<br>
root &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;0 09:07 ? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00 bash -c echo "inside: my PID is $$"; ps -ef; exit<br>
root &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;0 09:07 ? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00 ps -ef<br>
# without --mount-proc: /proc still belongs to the OLD namespace — it shows its PIDs, and ps breaks<br>
$ unshare --pid --fork bash -c 'echo "my PID is $$, /proc/self says $(readlink /proc/self)"; ps -e | wc -l'<br>
my PID is 1, /proc/self says 16<br>
fatal library error, lookup self<br>
0<br>
# without --fork: unshare itself stays outside; the FIRST child becomes PID 1 and dies at once<br>
$ unshare --pid bash -c 'ls / &gt; /dev/null; echo "first child: ok"; ls / &gt; /dev/null; echo "second child?"'<br>
first child: ok<br>
bash: fork: Cannot allocate memory</div>
<p><strong>First block — all three flags.</strong> The shell inside says its PID is 1, and <code>ps -ef</code> lists only itself (PID 1, PPID 0) and <code>ps</code> (PID 2). This is precisely the view an application has as the main process of a container. The <code>; exit</code> at the end matters: without it, bash would <code>exec</code> <code>ps</code> as its last command and <code>ps</code> would itself become PID 1 — a small detail that also explains why the "shell form" of a Dockerfile behaves differently (CS.1, slide 22).</p>
<p><strong>Second block — no <code>--mount-proc</code>.</strong> The shell's PID is still 1, but <code>/proc/self</code> resolves to <strong>16</strong>: <code>/proc</code> is a file system that belongs to the PID namespace that <em>mounted</em> it, and nobody mounted one for the new namespace, so the old <code>/proc</code> still shows the old namespace's numbers. <code>ps</code> reads <code>/proc</code>, finds that "self" does not match the process asking, and gives up with <code>fatal library error, lookup self</code>. (On some versions ps instead lists every process of the outer namespace — equally wrong.) That is why runc mounts a new <code>/proc</code> inside every container.</p>
<p><strong>Third block — no <code>--fork</code>.</strong> <code>unshare(CLONE_NEWPID)</code> never moves the caller itself (a process cannot change its own PID); it only decides where the caller's <em>children</em> will live. So bash runs outside, and its <em>first</em> child (<code>ls</code>) becomes PID 1 of the new namespace. When that child exits, PID 1 of the namespace is dead, the namespace can never get another init, and every later <code>fork</code> into it fails: <code>bash: fork: Cannot allocate memory</code> — a confusing message (ENOMEM) for "this PID namespace has no init any more". <code>--fork</code> avoids it by making the long-lived child the init.</p>
<p>➕ The PID 1 rules from CS.1 now have their real cause: the kernel treats the first process of <em>every</em> PID namespace as that namespace's init. It adopts orphans, it must reap zombies, the kernel delivers to it only signals it has a handler for (so <code>docker stop</code>'s SIGTERM can be ignored), and when it exits the kernel sends SIGKILL to every other process in the namespace. Container = new PID namespace ⇒ your app inherits all of init's duties. That is what <code>tini</code>/<code>docker run --init</code> fixes.</p>
<p class="pitfall">⚠️ Seeing PID 1 inside does not mean the host thinks so. Logs or metrics that record "pid 1" from inside a container are useless on the host; use <code>NSpid</code> from <code>/proc/&lt;pid&gt;/status</code> (slide 5) to translate between the two views.</p>`,
        `<p class="y-chinh">🎯 <code>unshare --pid --fork --mount-proc bash</code> — và <code>echo $$</code> in ra <strong>1</strong>, <code>ps -ef</code> chỉ còn hai tiến trình. <code>--pid</code> tạo namespace cho các tiến trình con, <code>--fork</code> khiến tiến trình con (không phải unshare) thành PID 1, <code>--mount-proc</code> mount một <code>/proc</code> mới. PID 1 là đặc biệt: khi nó chết, mọi tiến trình trong namespace chết theo; nó lờ đi những tín hiệu nó không có handler.</p>
<p>Slide hiện lệnh chạy đúng. Bộ chạy của môn học tái hiện nó, rồi lần lượt bỏ từng cờ, vì các thất bại dạy được nhiều hơn thành công:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_ADMIN</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 8: ba cờ của unshare, lần lượt bỏ từng cờ<br>
$ unshare --pid --fork --mount-proc bash -c 'echo "inside: my PID is $$"; ps -ef; exit'<br>
inside: my PID is 1<br>
UID &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID &nbsp;C STIME TTY &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TIME CMD<br>
root &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;0 09:07 ? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00 bash -c echo "inside: my PID is $$"; ps -ef; exit<br>
root &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;0 09:07 ? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00 ps -ef<br>
# không có --mount-proc: /proc vẫn thuộc namespace CŨ — nó hiện PID cũ, và ps hỏng<br>
$ unshare --pid --fork bash -c 'echo "my PID is $$, /proc/self says $(readlink /proc/self)"; ps -e | wc -l'<br>
my PID is 1, /proc/self says 16<br>
fatal library error, lookup self<br>
0<br>
# không có --fork: chính unshare ở ngoài; đứa con ĐẦU TIÊN thành PID 1 và chết ngay<br>
$ unshare --pid bash -c 'ls / &gt; /dev/null; echo "first child: ok"; ls / &gt; /dev/null; echo "second child?"'<br>
first child: ok<br>
bash: fork: Cannot allocate memory</div>
<p><strong>Khối đầu — đủ ba cờ.</strong> Shell bên trong nói PID của nó là 1, và <code>ps -ef</code> chỉ liệt kê chính nó (PID 1, PPID 0) và <code>ps</code> (PID 2). Đây chính xác là góc nhìn của một ứng dụng khi là tiến trình chính của container. Chữ <code>; exit</code> ở cuối là quan trọng: thiếu nó, bash sẽ <code>exec</code> luôn <code>ps</code> vì là lệnh cuối, và <code>ps</code> tự thành PID 1 — một chi tiết nhỏ nhưng cũng giải thích vì sao "dạng shell" của Dockerfile cư xử khác (CS.1, slide 22).</p>
<p><strong>Khối hai — thiếu <code>--mount-proc</code>.</strong> PID của shell vẫn là 1, nhưng <code>/proc/self</code> lại trỏ tới <strong>16</strong>: <code>/proc</code> là một hệ thống tệp thuộc về PID namespace đã <em>mount</em> nó, mà chưa ai mount một cái cho namespace mới, nên <code>/proc</code> cũ vẫn hiện số của namespace cũ. <code>ps</code> đọc <code>/proc</code>, thấy "self" không khớp với tiến trình đang hỏi, và bỏ cuộc với <code>fatal library error, lookup self</code>. (Ở vài phiên bản ps lại liệt kê mọi tiến trình của namespace ngoài — sai y như vậy.) Vì thế runc mount một <code>/proc</code> mới bên trong mọi container.</p>
<p><strong>Khối ba — thiếu <code>--fork</code>.</strong> <code>unshare(CLONE_NEWPID)</code> không bao giờ chuyển chính tiến trình gọi (một tiến trình không đổi được PID của mình); nó chỉ quyết định nơi các <em>con</em> của tiến trình gọi sẽ sống. Nên bash chạy ở ngoài, và đứa con <em>đầu tiên</em> của nó (<code>ls</code>) thành PID 1 của namespace mới. Khi đứa con đó thoát, PID 1 của namespace đã chết, namespace không bao giờ có được init khác, và mọi lần <code>fork</code> sau vào đó đều thất bại: <code>bash: fork: Cannot allocate memory</code> — một thông báo dễ gây hiểu lầm (ENOMEM) cho ý "PID namespace này không còn init nữa". <code>--fork</code> tránh chuyện đó bằng cách cho đứa con sống lâu làm init.</p>
<p>➕ Các luật về PID 1 ở CS.1 giờ có nguyên nhân thật: nhân coi tiến trình đầu tiên của <em>mọi</em> PID namespace là init của namespace đó. Nó nhận nuôi mồ côi, nó phải gặt zombie, nhân chỉ giao cho nó những tín hiệu nó có handler (nên SIGTERM của <code>docker stop</code> có thể bị lờ đi), và khi nó thoát nhân gửi SIGKILL tới mọi tiến trình khác trong namespace. Container = PID namespace mới ⇒ ứng dụng của bạn thừa kế mọi nghĩa vụ của init. Đó là thứ <code>tini</code>/<code>docker run --init</code> sửa.</p>
<p class="pitfall">⚠️ Bên trong thấy PID 1 không có nghĩa máy chủ cũng nghĩ thế. Log hay số liệu ghi "pid 1" từ bên trong container là vô dụng trên máy chủ; dùng <code>NSpid</code> trong <code>/proc/&lt;pid&gt;/status</code> (slide 5) để quy đổi giữa hai góc nhìn.</p>`],
      [9, 'UTS, network, IPC and mount namespaces — all real',
        `<p class="y-chinh">🎯 Four more namespaces, one command each: <code>unshare --uts</code> → own hostname; <code>unshare --net</code> → a brand-new network stack with only a <strong>DOWN loopback</strong>; <code>unshare --ipc</code> → no message queues of the host; <code>unshare --mount</code> → a tmpfs mounted inside is invisible outside. Docker then adds a <strong>veth pair</strong> wired to the <code>docker0</code> bridge.</p>
<p>The same four experiments in the course container:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_ADMIN</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 9: four more namespaces, each in one command<br>
$ unshare --uts bash -c 'hostname box-42; echo "inside: $(hostname)"'<br>
inside: box-42<br>
$ echo "outside: $(hostname)"<br>
outside: osg-lab<br>
$ unshare --net ip -br link | grep -v @NONE<br>
lo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DOWN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00:00:00:00 &lt;LOOPBACK&gt;<br>
$ ip -br link | grep -v @NONE<br>
lo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UNKNOWN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00:00:00:00 &lt;LOOPBACK,UP,LOWER_UP&gt;<br>
$ ipcmk -Q &gt; /dev/null; ipcs -q | sed '/^$/d'<br>
------ Message Queues --------<br>
key &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;msqid &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;owner &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;perms &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;used-bytes &nbsp;&nbsp;messages<br>
0x993858b1 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;644 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
$ unshare --ipc ipcs -q | sed '/^$/d'<br>
------ Message Queues --------<br>
key &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;msqid &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;owner &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;perms &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;used-bytes &nbsp;&nbsp;messages<br>
$ unshare --mount bash -c 'mount -t tmpfs none /mnt; touch /mnt/secret; echo "inside: $(ls /mnt)"'<br>
inside: secret<br>
$ echo "outside: [$(ls /mnt)]"<br>
outside: []</div>
<p><strong>UTS.</strong> Inside, <code>hostname box-42</code> succeeds and the shell reports <code>box-42</code>; outside, the container keeps <code>osg-lab</code> (the runner's hostname — in the slide image it is a Docker container ID, <code>70ebc2f98610</code>, which is Docker's default hostname). Changing the hostname is privileged (<code>CAP_SYS_ADMIN</code>); in a namespace the privilege only affects that namespace. <strong>Network.</strong> A new network namespace has exactly one interface, <code>lo</code>, and even that is <code>DOWN</code>: no address, no route, no way out. Outside, <code>lo</code> is up. (The course runner uses <code>--network none</code>, so it has no <code>eth0</code>; in the slide image a normal Docker container shows <code>eth0@if193 UP 172.17.0.7/16</code>. The filter <code>grep -v @NONE</code> only hides the tunnel stubs this kernel creates in every namespace.)</p>
<p>How does a Docker container get from "only loopback" to <code>eth0</code>? Docker creates a <strong>veth pair</strong> — two virtual interfaces joined like the ends of a cable — moves one end into the container's namespace (renamed <code>eth0</code>) and plugs the other end into the <code>docker0</code> bridge on the host; then it assigns an IP from <code>172.17.0.0/16</code> and adds NAT rules for <code>-p 8080:80</code>. The suffix <code>@if193</code> is the interface number of the other end on the host. Kubernetes does the same with a CNI plugin.</p>
<p><strong>IPC.</strong> <code>ipcmk -Q</code> creates a System V message queue (key <code>0x28f10c07</code>, owner root); <code>ipcs -q</code> outside lists it, <code>unshare --ipc ipcs -q</code> sees an empty table. PostgreSQL used System V shared memory for its buffers until version 9.3 — two PostgreSQL containers on one host never collide because each has its own IPC namespace. <strong>Mount.</strong> Inside a new mount namespace we mount a tmpfs on <code>/mnt</code> and create <code>secret</code>; outside, <code>/mnt</code> is empty. Mounts made inside a container never appear on the host (unless propagation is set to shared on purpose). This is the namespace that lets every container have a different "/" built from its image.</p>
<p>➕ Kubernetes in one sentence with this vocabulary: all containers of a pod share the <strong>net</strong> and <strong>ipc</strong> namespaces (same IP, talk over <code>localhost</code>, share memory), but each has its own <strong>mnt</strong> namespace (own image) and, by default, its own <strong>pid</strong> namespace. A "sidecar" is simply a second process in the same network namespace.</p>
<p class="pitfall">⚠️ <code>docker run --network host</code> and <code>--pid host</code> mean "do not create that namespace — share the host's". Useful for debugging tools; dangerous for applications: with <code>--network host</code> the container's ports are host ports and its firewall rules are the host's.</p>`,
        `<p class="y-chinh">🎯 Thêm bốn namespace, mỗi cái một lệnh: <code>unshare --uts</code> → hostname riêng; <code>unshare --net</code> → một ngăn xếp mạng hoàn toàn mới, chỉ có <strong>loopback đang DOWN</strong>; <code>unshare --ipc</code> → không thấy hàng đợi thông điệp của máy chủ; <code>unshare --mount</code> → một tmpfs mount bên trong thì bên ngoài không thấy. Sau đó Docker thêm một <strong>cặp veth</strong> nối vào bridge <code>docker0</code>.</p>
<p>Cùng bốn thí nghiệm trong container của môn học:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_ADMIN</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 9: thêm bốn namespace, mỗi cái một lệnh<br>
$ unshare --uts bash -c 'hostname box-42; echo "inside: $(hostname)"'<br>
inside: box-42<br>
$ echo "outside: $(hostname)"<br>
outside: osg-lab<br>
$ unshare --net ip -br link | grep -v @NONE<br>
lo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DOWN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00:00:00:00 &lt;LOOPBACK&gt;<br>
$ ip -br link | grep -v @NONE<br>
lo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UNKNOWN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00:00:00:00 &lt;LOOPBACK,UP,LOWER_UP&gt;<br>
$ ipcmk -Q &gt; /dev/null; ipcs -q | sed '/^$/d'<br>
------ Message Queues --------<br>
key &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;msqid &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;owner &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;perms &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;used-bytes &nbsp;&nbsp;messages<br>
0x993858b1 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;644 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
$ unshare --ipc ipcs -q | sed '/^$/d'<br>
------ Message Queues --------<br>
key &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;msqid &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;owner &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;perms &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;used-bytes &nbsp;&nbsp;messages<br>
$ unshare --mount bash -c 'mount -t tmpfs none /mnt; touch /mnt/secret; echo "inside: $(ls /mnt)"'<br>
inside: secret<br>
$ echo "outside: [$(ls /mnt)]"<br>
outside: []</div>
<p><strong>UTS.</strong> Bên trong, <code>hostname box-42</code> thành công và shell báo <code>box-42</code>; bên ngoài container vẫn giữ <code>osg-lab</code> (hostname của bộ chạy — trong ảnh slide nó là một ID container Docker, <code>70ebc2f98610</code>, hostname mặc định của Docker). Đổi hostname là việc cần đặc quyền (<code>CAP_SYS_ADMIN</code>); trong một namespace, đặc quyền đó chỉ tác động tới namespace đó. <strong>Mạng.</strong> Một network namespace mới có đúng một giao diện, <code>lo</code>, và ngay cả nó cũng đang <code>DOWN</code>: không địa chỉ, không tuyến đường, không lối ra. Bên ngoài, <code>lo</code> đang bật. (Bộ chạy của môn dùng <code>--network none</code> nên không có <code>eth0</code>; trong ảnh slide một container Docker bình thường hiện <code>eth0@if193 UP 172.17.0.7/16</code>. Bộ lọc <code>grep -v @NONE</code> chỉ giấu các giao diện đường hầm rỗng mà nhân này tạo trong mọi namespace.)</p>
<p>Làm sao một container Docker đi từ "chỉ có loopback" tới có <code>eth0</code>? Docker tạo một <strong>cặp veth</strong> (virtual ethernet) — hai giao diện ảo nối với nhau như hai đầu một sợi cáp — chuyển một đầu vào namespace của container (đổi tên thành <code>eth0</code>) và cắm đầu kia vào bridge <code>docker0</code> trên máy chủ; rồi gán một IP trong dải <code>172.17.0.0/16</code> và thêm luật NAT cho <code>-p 8080:80</code>. Hậu tố <code>@if193</code> là số hiệu giao diện của đầu kia trên máy chủ. Kubernetes làm y như thế bằng một plugin CNI.</p>
<p><strong>IPC.</strong> <code>ipcmk -Q</code> tạo một hàng đợi thông điệp System V (khoá <code>0x28f10c07</code>, chủ là root); <code>ipcs -q</code> bên ngoài liệt kê được nó, còn <code>unshare --ipc ipcs -q</code> thấy bảng trống. PostgreSQL dùng bộ nhớ chia sẻ System V cho bộ đệm của nó tới tận bản 9.3 — hai container PostgreSQL trên một máy không bao giờ va nhau vì mỗi cái có IPC namespace riêng. <strong>Mount.</strong> Bên trong một mount namespace mới ta mount một tmpfs vào <code>/mnt</code> và tạo tệp <code>secret</code>; bên ngoài, <code>/mnt</code> trống trơn. Những gì mount bên trong container không bao giờ hiện trên máy chủ (trừ khi cố ý đặt chế độ lan truyền — propagation — là shared). Đây là namespace cho phép mỗi container có một "/" khác nhau dựng từ image của nó.</p>
<p>➕ Kubernetes trong một câu với bộ từ vựng này: mọi container của một pod dùng chung namespace <strong>net</strong> và <strong>ipc</strong> (cùng IP, nói chuyện qua <code>localhost</code>, chia sẻ bộ nhớ), nhưng mỗi cái có namespace <strong>mnt</strong> riêng (image riêng) và mặc định có namespace <strong>pid</strong> riêng. Một "sidecar" đơn giản là một tiến trình thứ hai trong cùng network namespace.</p>
<p class="pitfall">⚠️ <code>docker run --network host</code> và <code>--pid host</code> nghĩa là "đừng tạo namespace đó — dùng chung của máy chủ". Hữu ích cho công cụ gỡ lỗi; nguy hiểm cho ứng dụng: với <code>--network host</code>, cổng của container chính là cổng của máy chủ và luật tường lửa của nó là của máy chủ.</p>`],
      [10, 'lsns and nsenter: see a box from outside, step into it',
        `<p class="y-chinh">🎯 Start a "box" (new pid + uts + mnt namespaces, hostname <code>box-7</code>) in the background; <code>lsns -p PID</code> shows which of its namespaces are new and which are shared; <code>nsenter -t PID -p -u -m</code> joins them (system call <code>setns</code>) and sees <code>box-7</code> and a process table where <code>sleep</code> is PID 1. <strong><code>docker exec</code> is exactly this</strong>: a new process <code>setns()</code>-ed into the container's namespaces and cgroup.</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_ADMIN</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 10: start a "box" in the background, list its namespaces, then step into it<br>
$ unshare --pid --uts --mount --fork --mount-proc bash -c 'hostname box-7; exec sleep 300' &amp;<br>
$ B=$(pgrep -x sleep); echo "the box's PID 1 is PID $B outside"<br>
the box's PID 1 is PID 11 outside<br>
$ lsns -l -p $B -o TYPE,NS,NPROCS,PID,COMMAND | LC_ALL=C sort<br>
TYPE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NS NPROCS PID COMMAND<br>
cgroup 4026533510 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;1 bash /usr/local/bin/phien ns-lsns-nsenter.sh<br>
ipc &nbsp;&nbsp;&nbsp;4026533378 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;1 bash /usr/local/bin/phien ns-lsns-nsenter.sh<br>
mnt &nbsp;&nbsp;&nbsp;4026533630 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;8 unshare --pid --uts --mount --fork --mount-proc bash -c hostname box-7; exec sleep 300<br>
net &nbsp;&nbsp;&nbsp;4026533639 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;1 bash /usr/local/bin/phien ns-lsns-nsenter.sh<br>
pid &nbsp;&nbsp;&nbsp;4026533638 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;11 sleep 300<br>
time &nbsp;&nbsp;4026533847 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;1 bash /usr/local/bin/phien ns-lsns-nsenter.sh<br>
user &nbsp;&nbsp;4026531837 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;1 bash /usr/local/bin/phien ns-lsns-nsenter.sh<br>
uts &nbsp;&nbsp;&nbsp;4026533631 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;8 unshare --pid --uts --mount --fork --mount-proc bash -c hostname box-7; exec sleep 300<br>
$ readlink /proc/$$/ns/uts /proc/$B/ns/uts<br>
uts:[4026533377]<br>
uts:[4026533631]<br>
$ nsenter -t $B -p -u -m bash -c 'hostname; ps -ef'<br>
box-7<br>
UID &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID &nbsp;C STIME TTY &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TIME CMD<br>
root &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;0 09:20 ? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00 sleep 300<br>
root &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;0 09:20 ? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00 ps -ef</div>
<p>Read <code>lsns</code> column by column. <strong>TYPE</strong> and <strong>NS</strong> are the type and the inode number you saw in <code>/proc/PID/ns</code>. <strong>NPROCS</strong> counts processes in that namespace, <strong>PID</strong> and <strong>COMMAND</strong> show the lowest-numbered process in it. Five rows (cgroup, ipc, net, time, user) belong to the session's shell, PID 1, with 5 processes: the box shares them, because we did not ask for new ones. Three rows are new: <strong>mnt</strong> and <strong>uts</strong>, owned by <code>unshare</code> (PID 8) — it called <code>unshare()</code> for itself, then forked — and <strong>pid</strong>, which contains exactly one process, <code>sleep</code> (PID 11 outside), the box's init. (The slide image was made with the default tree view of <code>lsns</code>; the runner uses <code>-l</code> and sorts by type so that the order is stable.) <code>readlink</code> confirms it in one line: two different <code>uts:[…]</code> numbers.</p>
<p>Then <code>nsenter -t 11 -p -u -m bash -c 'hostname; ps -ef'</code>: <code>-t 11</code> names the target process, and the letters pick which of its namespaces to join — <code>-p</code> pid, <code>-u</code> uts, <code>-m</code> mount (others: <code>-n</code> net, <code>-i</code> ipc, <code>-U</code> user, <code>-C</code> cgroup, <code>-a</code> all). For each one, nsenter opens <code>/proc/11/ns/&lt;type&gt;</code> and calls <code>setns()</code>; for the pid namespace it then forks, because (as on slide 8) only children move. The result: hostname <code>box-7</code>, and <code>ps</code> sees <code>sleep</code> as PID 1 and itself as PID 3 — both with PPID 0, because their parents live outside.</p>
<p>➕ That is all <code>docker exec -it web bash</code> is: containerd starts a new process, joins it to every namespace of the container's PID 1 and to its cgroup, applies the same capabilities and seccomp, and runs <code>bash</code>. Nothing like SSH is involved, which is why <code>docker exec</code> works in images without any server inside — and why <strong>the image must contain the program you exec</strong>: a "distroless" image has no <code>bash</code>, so <code>docker exec … bash</code> fails, while <code>nsenter -t &lt;host pid&gt; -n ss -tlnp</code> from the host still works, using the host's <code>ss</code> inside the container's network namespace. Kubernetes' <code>kubectl debug</code> with an ephemeral container uses the same trick.</p>
<p class="meo">🧠 Debug recipe for a running container on a Linux server: <code>PID=$(docker inspect -f '&#123;&#123;.State.Pid&#125;&#125;' web)</code>, then <code>nsenter -t $PID -n ss -tlnp</code> (its listening ports), <code>nsenter -t $PID -n ip addr</code> (its IP), <code>nsenter -t $PID -m cat /etc/resolv.conf</code> (its DNS). All with host tools, nothing installed in the image.</p>`,
        `<p class="y-chinh">🎯 Chạy một "hộp" (namespace pid + uts + mnt mới, hostname <code>box-7</code>) ở chế độ nền; <code>lsns -p PID</code> cho thấy namespace nào của nó là mới và namespace nào dùng chung; <code>nsenter -t PID -p -u -m</code> gia nhập chúng (lời gọi hệ thống <code>setns</code>) và thấy <code>box-7</code> cùng một bảng tiến trình trong đó <code>sleep</code> là PID 1. <strong><code>docker exec</code> chính là thế</strong>: một tiến trình mới được <code>setns()</code> vào các namespace và cgroup của container.</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_ADMIN</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 10: chạy một "hộp" ở nền, liệt kê namespace của nó, rồi bước vào<br>
$ unshare --pid --uts --mount --fork --mount-proc bash -c 'hostname box-7; exec sleep 300' &amp;<br>
$ B=$(pgrep -x sleep); echo "the box's PID 1 is PID $B outside"<br>
the box's PID 1 is PID 11 outside<br>
$ lsns -l -p $B -o TYPE,NS,NPROCS,PID,COMMAND | LC_ALL=C sort<br>
TYPE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NS NPROCS PID COMMAND<br>
cgroup 4026533510 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;1 bash /usr/local/bin/phien ns-lsns-nsenter.sh<br>
ipc &nbsp;&nbsp;&nbsp;4026533378 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;1 bash /usr/local/bin/phien ns-lsns-nsenter.sh<br>
mnt &nbsp;&nbsp;&nbsp;4026533630 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;8 unshare --pid --uts --mount --fork --mount-proc bash -c hostname box-7; exec sleep 300<br>
net &nbsp;&nbsp;&nbsp;4026533639 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;1 bash /usr/local/bin/phien ns-lsns-nsenter.sh<br>
pid &nbsp;&nbsp;&nbsp;4026533638 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;11 sleep 300<br>
time &nbsp;&nbsp;4026533847 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;1 bash /usr/local/bin/phien ns-lsns-nsenter.sh<br>
user &nbsp;&nbsp;4026531837 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;1 bash /usr/local/bin/phien ns-lsns-nsenter.sh<br>
uts &nbsp;&nbsp;&nbsp;4026533631 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;8 unshare --pid --uts --mount --fork --mount-proc bash -c hostname box-7; exec sleep 300<br>
$ readlink /proc/$$/ns/uts /proc/$B/ns/uts<br>
uts:[4026533377]<br>
uts:[4026533631]<br>
$ nsenter -t $B -p -u -m bash -c 'hostname; ps -ef'<br>
box-7<br>
UID &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID &nbsp;C STIME TTY &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TIME CMD<br>
root &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;0 09:20 ? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00 sleep 300<br>
root &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;0 09:20 ? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00 ps -ef</div>
<p>Đọc <code>lsns</code> theo từng cột. <strong>TYPE</strong> và <strong>NS</strong> là loại và số inode bạn đã thấy trong <code>/proc/PID/ns</code>. <strong>NPROCS</strong> đếm số tiến trình trong namespace đó, <strong>PID</strong> và <strong>COMMAND</strong> hiện tiến trình có số nhỏ nhất trong nó. Năm hàng (cgroup, ipc, net, time, user) thuộc về shell của phiên, PID 1, với 5 tiến trình: hộp dùng chung chúng, vì ta không xin cái mới. Ba hàng là mới: <strong>mnt</strong> và <strong>uts</strong>, do <code>unshare</code> (PID 8) giữ — nó gọi <code>unshare()</code> cho chính mình rồi mới fork — và <strong>pid</strong>, chứa đúng một tiến trình, <code>sleep</code> (PID 11 ở ngoài), init của hộp. (Ảnh slide làm với chế độ cây mặc định của <code>lsns</code>; bộ chạy dùng <code>-l</code> và sắp xếp theo loại để thứ tự ổn định.) <code>readlink</code> xác nhận trong một dòng: hai số <code>uts:[…]</code> khác nhau.</p>
<p>Rồi <code>nsenter -t 11 -p -u -m bash -c 'hostname; ps -ef'</code>: <code>-t 11</code> chỉ định tiến trình đích, và các chữ cái chọn namespace nào của nó để gia nhập — <code>-p</code> pid, <code>-u</code> uts, <code>-m</code> mount (còn lại: <code>-n</code> net, <code>-i</code> ipc, <code>-U</code> user, <code>-C</code> cgroup, <code>-a</code> tất cả). Với mỗi cái, nsenter mở <code>/proc/11/ns/&lt;loại&gt;</code> và gọi <code>setns()</code>; với pid namespace nó còn phải fork, vì (như slide 8) chỉ con mới chuyển được. Kết quả: hostname <code>box-7</code>, và <code>ps</code> thấy <code>sleep</code> là PID 1 còn chính nó là PID 3 — cả hai có PPID 0, vì cha của chúng ở bên ngoài.</p>
<p>➕ <code>docker exec -it web bash</code> chỉ có vậy: containerd khởi động một tiến trình mới, cho nó gia nhập mọi namespace của PID 1 trong container và cgroup của nó, áp cùng capability và seccomp, rồi chạy <code>bash</code>. Không có gì giống SSH ở đây, nên <code>docker exec</code> chạy được với image không có server nào bên trong — và vì thế <strong>image phải chứa chương trình bạn exec</strong>: một image "distroless" không có <code>bash</code>, nên <code>docker exec … bash</code> thất bại, trong khi <code>nsenter -t &lt;pid máy chủ&gt; -n ss -tlnp</code> từ máy chủ vẫn chạy, dùng <code>ss</code> của máy chủ bên trong network namespace của container. <code>kubectl debug</code> với ephemeral container của Kubernetes dùng cùng mánh đó.</p>
<p class="meo">🧠 Công thức gỡ lỗi một container đang chạy trên server Linux: <code>PID=$(docker inspect -f '&#123;&#123;.State.Pid&#125;&#125;' web)</code>, rồi <code>nsenter -t $PID -n ss -tlnp</code> (các cổng nó đang nghe), <code>nsenter -t $PID -n ip addr</code> (IP của nó), <code>nsenter -t $PID -m cat /etc/resolv.conf</code> (DNS của nó). Toàn công cụ của máy chủ, không cài gì vào image.</p>`],
      [11, 'User namespace: root inside, nobody outside',
        `<p class="y-chinh">🎯 An <strong>unprivileged</strong> user creates a user namespace and becomes <strong>uid 0</strong> inside it; <code>/proc/self/uid_map</code> says "inside 0 = outside 1000, one id". The file it creates belongs to the ordinary user on the real system, and the fake root still cannot read <code>/etc/shadow</code>. This is the basis of <strong>rootless</strong> Docker and Podman: an escape lands as your normal user, not as host root.</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 11: an ordinary user (sv, uid 1000) becomes "root" inside a user namespace<br>
# --privileged only so that Docker's seccomp filter does not block unshare(CLONE_NEWUSER) — see slide 20<br>
$ setpriv --reuid=1000 --regid=1000 --clear-groups id<br>
uid=1000(sv) gid=1000(sv) groups=1000(sv)<br>
$ setpriv --reuid=1000 --regid=1000 --clear-groups unshare --user --map-root-user bash -c 'id; cat /proc/self/uid_map; touch made-in-ns'<br>
uid=0(root) gid=0(root) groups=0(root)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
$ ls -l made-in-ns<br>
-rw-r--r-- 1 sv sv 0 Oct 26 09:07 made-in-ns<br>
# "root" in the namespace has no power over things the real user does not own<br>
$ setpriv --reuid=1000 --regid=1000 --clear-groups unshare --user --map-root-user bash -c 'id -u; cat /etc/shadow'<br>
0<br>
cat: /etc/shadow: Permission denied</div>
<p>Step by step. <code>setpriv --reuid=1000 …</code> runs commands as the image's ordinary user <code>sv</code> (uid 1000) — <code>id</code> proves it. The same user then runs <code>unshare --user --map-root-user</code>: no sudo, no capability needed (creating a user namespace has been unprivileged since Linux 3.8). Inside, <code>id</code> says <code>uid=0(root)</code>. The map line has three numbers: <strong>first id inside</strong> (0), <strong>first id outside</strong> (1000), <strong>how many ids</strong> (1). Every permission check the kernel makes on files and processes translates through this table. The touched file <code>made-in-ns</code> therefore belongs to <code>sv</code> on disk — the kernel writes the <em>outside</em> id. And the last command shows the limit: the namespace's root reads <code>/etc/shadow</code> (owned by the real root, mode 640) with the rights of uid 1000 — <code>Permission denied</code>. (The slide image did the same with user <code>nobody</code>, uid 65534.)</p>
<p>So what is the "root" good for? Inside its own namespaces it holds capabilities for objects <em>owned by that user namespace</em>: it may create other namespaces, mount a tmpfs or overlay inside its mount namespace, set a hostname in its UTS namespace, configure interfaces in its network namespace, bind ports below 1024 there — everything a container runtime needs — but nothing that the real uid 1000 could not damage anyway. (Why <code>--privileged</code> in this run? Only because Docker's default seccomp profile blocks <code>unshare(CLONE_NEWUSER)</code> inside a container; slide 20 measures that exact block.)</p>
<p>➕ <strong>Rootless containers</strong> build on this: rootless Docker (<code>dockerd-rootless.sh</code>) and Podman run the whole engine as your user inside a user namespace whose map is larger — a range of subordinate ids from <code>/etc/subuid</code> (for example 100000–165535) so that images with several users still work. Costs, as on the slide: ports below 1024 need <code>net.ipv4.ip_unprivileged_port_start</code> or a capability; networking goes through user-space helpers (slirp4netns or pasta), slower than a bridge; some storage options require a recent kernel (overlay in a user namespace since 5.11). Separately, normal (rootful) Docker can map container root to an unprivileged range with <code>userns-remap</code>, and Kubernetes has pod user namespaces (<code>hostUsers: false</code>).</p>
<p class="pitfall">⚠️ "uid 0 in the container, so it is root on the host" is true for <em>default</em> Docker — the container shares the host's user namespace (slide 7: <code>user:[4026531837]</code>), and only capabilities and seccomp limit it. It becomes false only with rootless mode, userns-remap or Kubernetes user namespaces. Know which one your platform uses before you say "root in a container is safe".</p>`,
        `<p class="y-chinh">🎯 Một người dùng <strong>không có đặc quyền</strong> tạo một user namespace và thành <strong>uid 0</strong> bên trong nó; <code>/proc/self/uid_map</code> ghi "bên trong 0 = bên ngoài 1000, một mã". Tệp nó tạo ra thuộc về người dùng thường trên hệ thống thật, và ông root giả vẫn không đọc được <code>/etc/shadow</code>. Đây là nền của Docker và Podman <strong>rootless</strong>: thoát ra khỏi container thì rơi vào quyền người dùng thường của bạn, không phải root của máy chủ.</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 11: một người dùng thường (sv, uid 1000) thành "root" trong một user namespace<br>
# --privileged chỉ để bộ lọc seccomp của Docker không chặn unshare(CLONE_NEWUSER) — xem slide 20<br>
$ setpriv --reuid=1000 --regid=1000 --clear-groups id<br>
uid=1000(sv) gid=1000(sv) groups=1000(sv)<br>
$ setpriv --reuid=1000 --regid=1000 --clear-groups unshare --user --map-root-user bash -c 'id; cat /proc/self/uid_map; touch made-in-ns'<br>
uid=0(root) gid=0(root) groups=0(root)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
$ ls -l made-in-ns<br>
-rw-r--r-- 1 sv sv 0 Oct 26 09:07 made-in-ns<br>
# "root" trong namespace không có quyền với thứ người dùng thật không sở hữu<br>
$ setpriv --reuid=1000 --regid=1000 --clear-groups unshare --user --map-root-user bash -c 'id -u; cat /etc/shadow'<br>
0<br>
cat: /etc/shadow: Permission denied</div>
<p>Từng bước một. <code>setpriv --reuid=1000 …</code> chạy lệnh dưới tên người dùng thường của image là <code>sv</code> (uid 1000) — <code>id</code> chứng minh điều đó. Chính người dùng ấy sau đó chạy <code>unshare --user --map-root-user</code>: không sudo, không cần capability nào (tạo user namespace không cần đặc quyền từ Linux 3.8). Bên trong, <code>id</code> nói <code>uid=0(root)</code>. Dòng ánh xạ có ba số: <strong>mã đầu tiên bên trong</strong> (0), <strong>mã đầu tiên bên ngoài</strong> (1000), <strong>bao nhiêu mã</strong> (1). Mọi lần kiểm quyền của nhân trên tệp và tiến trình đều quy đổi qua bảng này. Vì thế tệp <code>made-in-ns</code> vừa tạo thuộc về <code>sv</code> trên đĩa — nhân ghi mã <em>bên ngoài</em>. Và lệnh cuối cho thấy giới hạn: root của namespace đọc <code>/etc/shadow</code> (của root thật, quyền 640) với quyền của uid 1000 — <code>Permission denied</code>. (Ảnh slide làm cùng việc đó với người dùng <code>nobody</code>, uid 65534.)</p>
<p>Vậy ông "root" này dùng được vào việc gì? Trong các namespace của chính nó, nó giữ capability đối với những đối tượng <em>thuộc về user namespace đó</em>: nó được tạo namespace khác, mount tmpfs hay overlay trong mount namespace của nó, đặt hostname trong UTS namespace của nó, cấu hình giao diện trong network namespace của nó, bind cổng dưới 1024 ở đó — mọi thứ một runtime container cần — nhưng không làm được gì mà uid 1000 thật vốn không phá được. (Sao lần chạy này cần <code>--privileged</code>? Chỉ vì hồ sơ seccomp mặc định của Docker chặn <code>unshare(CLONE_NEWUSER)</code> bên trong container; slide 20 đo đúng chỗ chặn đó.)</p>
<p>➕ <strong>Container rootless</strong> xây trên nền này: Docker rootless (<code>dockerd-rootless.sh</code>) và Podman chạy cả engine dưới tên người dùng của bạn trong một user namespace có bảng ánh xạ lớn hơn — một dải mã phụ trong <code>/etc/subuid</code> (ví dụ 100000–165535) để image có nhiều người dùng vẫn chạy được. Cái giá, như trên slide: cổng dưới 1024 cần <code>net.ipv4.ip_unprivileged_port_start</code> hoặc một capability; mạng đi qua bộ trợ giúp chạy ở không gian người dùng (slirp4netns hoặc pasta), chậm hơn bridge; vài lựa chọn lưu trữ cần nhân mới (overlay trong user namespace từ 5.11). Ngoài ra, Docker thường (rootful) có thể ánh xạ root của container sang một dải không đặc quyền bằng <code>userns-remap</code>, và Kubernetes có user namespace cho pod (<code>hostUsers: false</code>).</p>
<p class="pitfall">⚠️ "uid 0 trong container, vậy là root trên máy chủ" là ĐÚNG với Docker <em>mặc định</em> — container dùng chung user namespace của máy chủ (slide 7: <code>user:[4026531837]</code>), chỉ có capability và seccomp giới hạn nó. Câu đó chỉ thành sai khi dùng chế độ rootless, userns-remap hoặc user namespace của Kubernetes. Hãy biết nền tảng của bạn dùng cái nào trước khi nói "root trong container là an toàn".</p>`],
    ]),
    books([
      ['man7', 'namespaces(7), pid_namespaces(7), user_namespaces(7), network_namespaces(7), mount_namespaces(7), uts_namespaces(7), ipc_namespaces(7), unshare(1), unshare(2), nsenter(1), setns(2), clone(2), lsns(8), proc(5) (NSpid, /proc/pid/ns), veth(4)', 'namespaces(7), pid_namespaces(7), user_namespaces(7), network_namespaces(7), mount_namespaces(7), uts_namespaces(7), ipc_namespaces(7), unshare(1), unshare(2), nsenter(1), setns(2), clone(2), lsns(8), proc(5) (NSpid, /proc/pid/ns), veth(4)'],
      ['kernelDocs', 'Documentation/admin-guide/namespaces/ (compatibility list, resource control) and the OCI runtime specification (github.com/opencontainers/runtime-spec, config.json: namespaces, linux.resources, mounts, process.capabilities, linux.seccomp)', 'Documentation/admin-guide/namespaces/ (danh sách tương thích, kiểm soát tài nguyên) và đặc tả OCI runtime (github.com/opencontainers/runtime-spec, config.json: namespaces, linux.resources, mounts, process.capabilities, linux.seccomp)'],
      ['mos4', 'Chapter 1, section 1.7.5 (virtual machines) and Chapter 7 (virtualization and the cloud, 7.1–7.3: hypervisors type 1 and 2) — the school lesson N1.A; Chapter 10, section 10.3 (processes in Linux)', 'Chương 1, mục 1.7.5 (máy ảo) và Chương 7 (ảo hoá và đám mây, 7.1–7.3: hypervisor loại 1 và 2) — bài trường N1.A; Chương 10, mục 10.3 (tiến trình trong Linux)'],
      ['ostep', 'Appendix "Virtual Machine Monitors" (what a hypervisor must do — compare with what a container runtime does not)', 'Phụ lục "Virtual Machine Monitors" (một hypervisor phải làm gì — so với những gì runtime container không làm)'],
    ]),
  ].join('\n'),
};

/* ───────── ⭐ CS.6 — 📑 Slide by slide · Containers (2/2): cgroup v2, OOM 137, overlayfs, capabilities, a tiny container (slides 12–28) ───────── */
const L_cs6_2 = {
  title: '⭐ CS.6 — 📑 Slide by slide · Containers (2/2): cgroup v2, OOM 137, overlayfs, capabilities, a tiny container (slides 12–28)|||⭐ CS.6 — 📑 Học theo từng slide · Container (2/2): cgroup v2, OOM 137, overlayfs, capability, container tí hon (slide 12–28)',
  slug: 'osg202-slide-cs6-2',
  type: 'VIDEO',
  description: 'Phần tự thêm ngoài giáo trình (⭐, không thi FE): giảng slide 12–28 của deck tự dựng "Containers = namespaces + cgroups" — cgroup v2 là một hệ thống tệp và luật không có tiến trình bên trong, pids.max chặn một fork bomb thật (EAGAIN, pids.events, cgroup.kill), memory.max và OOM-kill chỉ trong cgroup với mã thoát 137 và memory.events, cpu.max là hạn ngạch theo chu kỳ (mô phỏng + đo thật nr_throttled), docker run --memory --cpus --pids-limit ghi gì vào /sys/fs/cgroup và bất ngờ về swap gấp đôi, lớp image bằng overlayfs (copy-up, whiteout), capability khiến root trong container không phải root đầy đủ, seccomp và khi nào strace thật sự cần SYS_PTRACE, tự dựng container tí hon khoảng 30 dòng bash, các bẫy (free -m, JVM, Node trong container), sự cố exit 137 thật của cuongthai.com và câu hỏi phỏng vấn — mọi lệnh chạy thật.',
  content: [
    bi(`<span class="eyebrow">⭐ Advanced 6 · Lesson CS.6 (part 2 of 2) · deck "Containers = namespaces + cgroups", slides 12–28</span>
<h2>Limits you can read and write as files, image layers, the powers root loses in a container — and a container you build yourself</h2>
<p class="lead">Part 1 showed what a container can <em>see</em>. This part is about what it can <em>use</em> and <em>do</em>. Cgroup v2 turns "this service may use 64 MB, half a CPU and 50 processes" into three numbers written into three files, and the kernel enforces them: a fork bomb meets <code>EAGAIN</code>, a memory hog is OOM-killed with exit code 137, a CPU loop is paused at the end of every period. Then we read exactly what <code>docker run</code> writes into those files, look at the layers of an image, the capabilities and the seccomp filter that make root inside a container much weaker than real root — and finish with a working container in about thirty lines of bash. Everything ends where a backend developer meets it: the deploy of this website killed with 137, and the interview questions.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>12–15</td><td>cgroup v2</td><td>create cgroups, set <code>pids.max</code>, <code>memory.max</code>, <code>cpu.max</code> and read <code>*.events</code> / <code>cpu.stat</code></td></tr>
<tr><td>16–17</td><td>docker run flags</td><td>predict and check the files written by <code>--memory --cpus --pids-limit</code>; explain the swap surprise</td></tr>
<tr><td>18</td><td>overlayfs</td><td>explain image layers, copy-up and whiteouts</td></tr>
<tr><td>19–20</td><td>Privileges</td><td>read capabilities, explain <code>--privileged</code>, seccomp and when strace needs <code>SYS_PTRACE</code></td></tr>
<tr><td>21–23</td><td>Build it</td><td>write and run a container with <code>unshare</code> + <code>chroot</code> + cgroup v2</td></tr>
<tr><td>24–28</td><td>Work</td><td>avoid the traps, diagnose an exit 137, answer interview questions</td></tr>
</tbody>
</table>
<div class="callout">The cgroup experiments need write access to <code>/sys/fs/cgroup</code>, so the course runner starts them with <code>--privileged</code> (in a normal container that tree is read-only on purpose). Docker gives each container its own <strong>cgroup namespace</strong>, so the course container sees its own cgroup as the root <code>/</code> of the tree and can create children under it without touching anything else on the machine. To check what <code>docker run --memory …</code> writes, the runner is itself started with those flags and simply reads the files — the most direct proof there is.</div>`,
    `<span class="eyebrow">⭐ Chuyên sâu 6 · Bài CS.6 (phần 2/2) · deck "Containers = namespaces + cgroups", slide 12–28</span>
<h2>Giới hạn đọc và ghi được như tệp, các lớp image, những quyền root mất đi trong container — và một container bạn tự dựng</h2>
<p class="lead">Phần 1 cho thấy container <em>nhìn thấy</em> gì. Phần này nói về những gì nó được <em>dùng</em> và được <em>làm</em>. Cgroup v2 biến câu "dịch vụ này được dùng 64 MB, nửa CPU và 50 tiến trình" thành ba con số ghi vào ba tệp, và nhân thực thi chúng: một fork bomb gặp <code>EAGAIN</code>, một chương trình ngốn bộ nhớ bị OOM-kill với mã thoát 137, một vòng lặp đốt CPU bị tạm dừng ở cuối mỗi chu kỳ. Rồi ta đọc chính xác <code>docker run</code> ghi gì vào các tệp đó, xem các lớp của một image, các capability và bộ lọc seccomp khiến root trong container yếu hơn root thật rất nhiều — và kết thúc bằng một container chạy được trong khoảng ba mươi dòng bash. Mọi thứ khép lại ở nơi dev backend gặp nó: lần deploy của chính trang web này bị giết với mã 137, và các câu hỏi phỏng vấn.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>12–15</td><td>cgroup v2</td><td>tạo cgroup, đặt <code>pids.max</code>, <code>memory.max</code>, <code>cpu.max</code> và đọc <code>*.events</code> / <code>cpu.stat</code></td></tr>
<tr><td>16–17</td><td>Cờ docker run</td><td>đoán trước và kiểm các tệp mà <code>--memory --cpus --pids-limit</code> ghi; giải thích bất ngờ về swap</td></tr>
<tr><td>18</td><td>overlayfs</td><td>giải thích lớp image, copy-up và whiteout</td></tr>
<tr><td>19–20</td><td>Đặc quyền</td><td>đọc capability, giải thích <code>--privileged</code>, seccomp và khi nào strace cần <code>SYS_PTRACE</code></td></tr>
<tr><td>21–23</td><td>Tự dựng</td><td>viết và chạy một container bằng <code>unshare</code> + <code>chroot</code> + cgroup v2</td></tr>
<tr><td>24–28</td><td>Đi làm</td><td>tránh bẫy, chẩn đoán exit 137, trả lời câu hỏi phỏng vấn</td></tr>
</tbody>
</table>
<div class="callout">Các thí nghiệm cgroup cần quyền ghi vào <code>/sys/fs/cgroup</code>, nên bộ chạy của môn khởi động chúng với <code>--privileged</code> (trong container bình thường cây đó cố ý chỉ đọc). Docker cho mỗi container một <strong>cgroup namespace</strong> riêng, nên container của môn học thấy cgroup của chính nó là gốc <code>/</code> của cây và tạo được cgroup con bên dưới mà không đụng tới thứ gì khác trên máy. Để kiểm <code>docker run --memory …</code> ghi gì, chính bộ chạy được khởi động với các cờ đó rồi đơn giản là đọc các tệp — bằng chứng trực tiếp nhất có được.</div>`),
    walkHead('cs6', 12, 28),
    walk('cs6', [
      [12, 'cgroup v2: the meter and the breaker',
        `<p class="y-chinh">🎯 A <strong>cgroup</strong> (control group) is a group of processes with a resource budget. In v2 there is <strong>one tree</strong>, mounted at <code>/sys/fs/cgroup</code>; <strong>a cgroup is a directory and its files are the knobs</strong>: <code>*.max</code> = the limit you write, <code>*.current</code> = usage now, <code>*.events</code> = how often the limit bit. Rule: a cgroup that distributes resources to children holds no processes itself.</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 12: cgroup v2 is a file system — a cgroup is a directory, its files are the knobs<br>
$ cd /sys/fs/cgroup<br>
$ cat /proc/self/cgroup<br>
0::/<br>
$ cat cgroup.controllers<br>
cpuset cpu io memory hugetlb pids rdma<br>
# rule "no internal processes": first move every process into a leaf, then enable controllers for children<br>
$ mkdir init; for p in $(cat cgroup.procs); do echo $p &gt; init/cgroup.procs 2&gt;/dev/null; done<br>
$ cat /proc/self/cgroup<br>
0::/init<br>
$ echo "+cpu +memory +pids" &gt; cgroup.subtree_control<br>
$ mkdir demo; ls demo | grep -E '^(memory|pids|cpu)\\.(max|current|events|stat)$' | paste -sd' '<br>
cpu.max cpu.stat memory.current memory.events memory.max memory.stat pids.current pids.events pids.max<br>
$ cat demo/memory.max demo/pids.max demo/cpu.max<br>
max<br>
max<br>
max 100000</div>
<p>Line by line. <code>cat /proc/self/cgroup</code> prints <code>0::/</code> — in v2 there is a single line, "hierarchy 0, no controller list, path". The path <code>/</code> is relative to our cgroup namespace (the course container's own cgroup). <code>cgroup.controllers</code> lists the controllers available here: <code>cpuset cpu io memory hugetlb pids rdma</code>. A controller is the part of the kernel that enforces one kind of resource; listed here means "may be enabled for children".</p>
<p>Then the rule the slide calls "no internal processes": a non-root cgroup may hand out <em>memory, cpu, io</em> to child cgroups only if it has no processes of its own (otherwise the kernel could not say how the parent's budget is split between its processes and its children). So we first create a leaf <code>init/</code> and move every process into it — <code>/proc/self/cgroup</code> now says <code>0::/init</code> — and only then does <code>echo "+cpu +memory +pids" &gt; cgroup.subtree_control</code> succeed. From that moment every new directory gets the interface files of those controllers automatically: <code>mkdir demo</code> created <code>cpu.max</code>, <code>cpu.stat</code>, <code>memory.current</code>, <code>memory.events</code>, <code>memory.max</code>, <code>memory.stat</code>, <code>pids.current</code>, <code>pids.events</code>, <code>pids.max</code> (and more, filtered out here). Fresh limits are "no limit": <code>max</code>, <code>max</code>, <code>max 100000</code>. To put a process into a cgroup you write its PID into <code>cgroup.procs</code>; its future children start there too.</p>
<p>➕ You already live inside this tree. On a systemd machine every service is a cgroup: <code>/sys/fs/cgroup/system.slice/postgresql.service/</code>, and <code>systemctl status</code> prints it on its <code>CGroup:</code> line; <code>systemd-cgls</code> draws the tree, <code>systemd-cgtop</code> shows usage per cgroup. Docker puts each container in <code>…/docker-&lt;ID&gt;.scope</code> (systemd driver) or <code>/sys/fs/cgroup/docker/&lt;ID&gt;</code> (cgroupfs driver, Docker Desktop — slide 16); Kubernetes uses <code>kubepods.slice/…/pod&lt;UID&gt;/…</code>. Version 1 had a <em>separate</em> tree per controller (<code>/sys/fs/cgroup/memory/…</code>, <code>/sys/fs/cgroup/cpu/…</code>), file names such as <code>memory.limit_in_bytes</code>, and no such rule — if you read an old blog post, check which version it describes.</p>
<p class="meo">🧠 Every limit in this deck can be checked with <code>cat</code>, and every limit hit leaves a trace in an <code>*.events</code> file that survives the process. When a service misbehaves, read <code>memory.events</code>, <code>pids.events</code> and <code>cpu.stat</code> of its cgroup before guessing.</p>`,
        `<p class="y-chinh">🎯 Một <strong>cgroup</strong> (control group — nhóm điều khiển) là một nhóm tiến trình có ngân sách tài nguyên. Ở v2 chỉ có <strong>một cây</strong>, mount tại <code>/sys/fs/cgroup</code>; <strong>một cgroup là một thư mục và các tệp của nó là núm vặn</strong>: <code>*.max</code> = giới hạn bạn ghi, <code>*.current</code> = mức dùng hiện tại, <code>*.events</code> = số lần chạm giới hạn. Luật: một cgroup đang chia tài nguyên cho các con thì bản thân không chứa tiến trình nào.</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 12: cgroup v2 là một hệ thống tệp — một cgroup là một thư mục, các tệp là núm vặn<br>
$ cd /sys/fs/cgroup<br>
$ cat /proc/self/cgroup<br>
0::/<br>
$ cat cgroup.controllers<br>
cpuset cpu io memory hugetlb pids rdma<br>
# luật "không có tiến trình bên trong": dời mọi tiến trình vào một lá, rồi mới bật controller cho con<br>
$ mkdir init; for p in $(cat cgroup.procs); do echo $p &gt; init/cgroup.procs 2&gt;/dev/null; done<br>
$ cat /proc/self/cgroup<br>
0::/init<br>
$ echo "+cpu +memory +pids" &gt; cgroup.subtree_control<br>
$ mkdir demo; ls demo | grep -E '^(memory|pids|cpu)\\.(max|current|events|stat)$' | paste -sd' '<br>
cpu.max cpu.stat memory.current memory.events memory.max memory.stat pids.current pids.events pids.max<br>
$ cat demo/memory.max demo/pids.max demo/cpu.max<br>
max<br>
max<br>
max 100000</div>
<p>Từng dòng một. <code>cat /proc/self/cgroup</code> in <code>0::/</code> — ở v2 chỉ có một dòng, "cây số 0, không có danh sách controller, đường dẫn". Đường dẫn <code>/</code> là tương đối với cgroup namespace của ta (cgroup riêng của container môn học). <code>cgroup.controllers</code> liệt kê các controller có ở đây: <code>cpuset cpu io memory hugetlb pids rdma</code>. Controller (bộ điều khiển) là phần của nhân thực thi một loại tài nguyên; có tên ở đây nghĩa là "được phép bật cho các con".</p>
<p>Rồi tới luật mà slide gọi là "không có tiến trình bên trong" (no internal processes): một cgroup không phải gốc chỉ được chia <em>memory, cpu, io</em> cho các cgroup con nếu bản thân nó không có tiến trình nào (nếu không, nhân không biết ngân sách của cha chia giữa tiến trình của nó và các con ra sao). Vì thế đầu tiên ta tạo một lá <code>init/</code> và dời mọi tiến trình vào đó — <code>/proc/self/cgroup</code> giờ nói <code>0::/init</code> — rồi mới thành công với <code>echo "+cpu +memory +pids" &gt; cgroup.subtree_control</code>. Từ lúc đó mọi thư mục mới tự có các tệp giao diện của những controller ấy: <code>mkdir demo</code> đã tạo ra <code>cpu.max</code>, <code>cpu.stat</code>, <code>memory.current</code>, <code>memory.events</code>, <code>memory.max</code>, <code>memory.stat</code>, <code>pids.current</code>, <code>pids.events</code>, <code>pids.max</code> (và nhiều tệp khác đã lọc bớt). Giới hạn mới tạo là "không giới hạn": <code>max</code>, <code>max</code>, <code>max 100000</code>. Muốn đưa một tiến trình vào cgroup thì ghi PID của nó vào <code>cgroup.procs</code>; các con sinh ra sau của nó cũng bắt đầu ở đó.</p>
<p>➕ Bạn vốn đang sống trong cây này. Trên máy có systemd, mỗi dịch vụ là một cgroup: <code>/sys/fs/cgroup/system.slice/postgresql.service/</code>, và <code>systemctl status</code> in nó ra ở dòng <code>CGroup:</code>; <code>systemd-cgls</code> vẽ cây, <code>systemd-cgtop</code> hiện mức dùng theo từng cgroup. Docker đặt mỗi container trong <code>…/docker-&lt;ID&gt;.scope</code> (driver systemd) hoặc <code>/sys/fs/cgroup/docker/&lt;ID&gt;</code> (driver cgroupfs, Docker Desktop — slide 16); Kubernetes dùng <code>kubepods.slice/…/pod&lt;UID&gt;/…</code>. Phiên bản 1 có một cây <em>riêng</em> cho mỗi controller (<code>/sys/fs/cgroup/memory/…</code>, <code>/sys/fs/cgroup/cpu/…</code>), tên tệp kiểu <code>memory.limit_in_bytes</code>, và không có luật trên — đọc một bài blog cũ thì hãy xem nó tả phiên bản nào.</p>
<p class="meo">🧠 Mọi giới hạn trong deck này đều kiểm được bằng <code>cat</code>, và mọi lần chạm giới hạn đều để lại dấu vết trong một tệp <code>*.events</code> sống lâu hơn tiến trình. Khi một dịch vụ hành xử lạ, hãy đọc <code>memory.events</code>, <code>pids.events</code> và <code>cpu.stat</code> của cgroup nó trước khi đoán.</p>`],
      [13, 'pids.max: a fork bomb hits a wall',
        `<p class="y-chinh">🎯 Write <code>20</code> into <code>pids.max</code>: inside that cgroup, <code>fork()</code> fails with <strong>EAGAIN</strong> ("Resource temporarily unavailable") as soon as 20 tasks exist; <code>pids.events</code> counts the refusals; a real bash fork bomb is held at 20 while the rest of the machine works normally; <code>cgroup.kill</code> ends every process of the group at once.</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 13: pids.max = 20, then a C program and a real bash fork bomb inside that cgroup<br>
$ mkdir /sys/fs/cgroup/bomb; echo 20 &gt; /sys/fs/cgroup/bomb/pids.max<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/bomb/cgroup.procs; exec ./forkcount'<br>
fork #20 failed: Resource temporarily unavailable (errno 11 = EAGAIN)<br>
$ cat /sys/fs/cgroup/bomb/pids.events<br>
max 1<br>
# the classic fork bomb :(){ :|:&amp; };: — inside the cgroup, for 3 seconds<br>
$ ( echo $BASHPID &gt; /sys/fs/cgroup/bomb/cgroup.procs; exec bash -c ':(){ :|:&amp; };:' ) 2&gt; bomb.err &amp;<br>
$ cat /sys/fs/cgroup/bomb/pids.current /sys/fs/cgroup/bomb/pids.events<br>
20<br>
max 41<br>
$ sort bomb.err | uniq -c | sort -rn | head -1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;40 environment: fork: retry: Resource temporarily unavailable<br>
$ echo "outside the cgroup a new process still starts: $(date +%Y | wc -c) bytes from date"<br>
outside the cgroup a new process still starts: 5 bytes from date<br>
$ echo 1 &gt; /sys/fs/cgroup/bomb/cgroup.kill; sleep 0.5; cat /sys/fs/cgroup/bomb/pids.current<br>
0</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p><strong>The C program.</strong> <code>forkcount</code> forks children that only <code>pause()</code>, counting, until <code>fork()</code> returns -1. It fails on attempt <strong>#20</strong>: the program itself plus 19 children are 20 tasks, and the 20th child would be the 21st. <code>errno</code> is 11, <code>EAGAIN</code> — the same error a process gets when it hits the per-user <code>ulimit -u</code>, which is why the message sounds temporary. <code>pids.events</code> then says <code>max 1</code>: one refusal so far. <strong>The fork bomb.</strong> <code>:(){ :|:&amp; };:</code> defines a function named <code>:</code> that starts two copies of itself in the background, forever. Without a limit it fills the whole process table of the machine within seconds and nobody can even open a shell to stop it. Here, after three seconds: <code>pids.current = 20</code> — it can never pass the limit — and <code>pids.events</code> counts dozens of refused forks; bash reports each refusal as <code>fork: retry: Resource temporarily unavailable</code> (bash retries a failed fork a few times before giving up). Meanwhile a process outside the cgroup (<code>date</code>) starts normally.</p>
<p>Stopping a fork bomb used to be an art (kill the processes faster than they multiply, or <code>kill -STOP</code> them first). With cgroup v2 it is one write: <code>echo 1 &gt; cgroup.kill</code> (Linux 5.14+) sends SIGKILL to every process in the cgroup and its descendants, atomically, so none can escape by forking — <code>pids.current</code> drops to 0. <code>docker kill</code>, <code>systemctl kill</code> and the kubelet use the same idea.</p>
<p>➕ <code>pids.max</code> counts <strong>tasks</strong> — threads as well as processes, because for the Linux kernel a thread is a task like any other. That turns it into a trap for thread-heavy runtimes: a Java service with a 200-thread Tomcat pool, GC and JIT threads needs well over 200 pids; practice exercise 2 starts a JVM in <code>--pids-limit 50</code> and gets <code>OutOfMemoryError: unable to create native thread</code> after about 30 threads — an "out of memory" error with plenty of free memory. Docker sets no pids limit by default; Kubernetes has a per-pod limit configured on the kubelet (<code>podPidsLimit</code>).</p>
<p class="pitfall">⚠️ <code>EAGAIN</code> from <code>fork()</code>/<code>pthread_create()</code> in a container is almost never a lack of memory: check <code>pids.current</code> against <code>pids.max</code> and <code>pids.events</code> first, then <code>ulimit -u</code> and <code>/proc/sys/kernel/threads-max</code>.</p>`,
        `<p class="y-chinh">🎯 Ghi <code>20</code> vào <code>pids.max</code>: trong cgroup đó, <code>fork()</code> thất bại với <strong>EAGAIN</strong> ("Resource temporarily unavailable") ngay khi đã có 20 tác vụ; <code>pids.events</code> đếm số lần từ chối; một fork bomb bash thật bị giữ ở 20 trong khi phần còn lại của máy vẫn chạy bình thường; <code>cgroup.kill</code> kết thúc mọi tiến trình của nhóm trong một lần.</p>
<p>(Fork bomb — "bom fork": chương trình tự nhân bản liên tục cho tới khi làm tê liệt máy.)</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 13: pids.max = 20, rồi một chương trình C và một fork bomb bash thật trong cgroup đó<br>
$ mkdir /sys/fs/cgroup/bomb; echo 20 &gt; /sys/fs/cgroup/bomb/pids.max<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/bomb/cgroup.procs; exec ./forkcount'<br>
fork #20 failed: Resource temporarily unavailable (errno 11 = EAGAIN)<br>
$ cat /sys/fs/cgroup/bomb/pids.events<br>
max 1<br>
# fork bomb kinh điển :(){ :|:&amp; };: — trong cgroup, trong 3 giây<br>
$ ( echo $BASHPID &gt; /sys/fs/cgroup/bomb/cgroup.procs; exec bash -c ':(){ :|:&amp; };:' ) 2&gt; bomb.err &amp;<br>
$ cat /sys/fs/cgroup/bomb/pids.current /sys/fs/cgroup/bomb/pids.events<br>
20<br>
max 41<br>
$ sort bomb.err | uniq -c | sort -rn | head -1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;40 environment: fork: retry: Resource temporarily unavailable<br>
$ echo "outside the cgroup a new process still starts: $(date +%Y | wc -c) bytes from date"<br>
outside the cgroup a new process still starts: 5 bytes from date<br>
$ echo 1 &gt; /sys/fs/cgroup/bomb/cgroup.kill; sleep 0.5; cat /sys/fs/cgroup/bomb/pids.current<br>
0</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p><strong>Chương trình C.</strong> <code>forkcount</code> fork ra các con chỉ biết <code>pause()</code>, vừa fork vừa đếm, tới khi <code>fork()</code> trả về -1. Nó thất bại ở lần thử <strong>#20</strong>: bản thân chương trình cộng 19 con là 20 tác vụ, và đứa con thứ 20 sẽ là tác vụ thứ 21. <code>errno</code> là 11, <code>EAGAIN</code> — cùng lỗi một tiến trình nhận khi chạm <code>ulimit -u</code> của người dùng, vì thế thông báo nghe như chuyện tạm thời. <code>pids.events</code> sau đó ghi <code>max 1</code>: tới giờ có một lần từ chối. <strong>Fork bomb.</strong> <code>:(){ :|:&amp; };:</code> định nghĩa một hàm tên là <code>:</code> khởi động hai bản sao của chính nó ở chế độ nền, mãi mãi. Không có giới hạn, nó lấp đầy cả bảng tiến trình của máy trong vài giây và không ai mở nổi một shell để dừng nó. Ở đây, sau ba giây: <code>pids.current = 20</code> — nó không bao giờ vượt được giới hạn — và <code>pids.events</code> đếm hàng chục lần fork bị từ chối; bash báo mỗi lần như thế là <code>fork: retry: Resource temporarily unavailable</code> (bash thử lại một lần fork thất bại vài lần rồi mới bỏ cuộc). Trong lúc đó một tiến trình ngoài cgroup (<code>date</code>) vẫn khởi động bình thường.</p>
<p>Dừng một fork bomb từng là cả một nghệ thuật (giết tiến trình nhanh hơn tốc độ chúng sinh sôi, hoặc <code>kill -STOP</code> chúng trước). Với cgroup v2 chỉ cần một lần ghi: <code>echo 1 &gt; cgroup.kill</code> (Linux 5.14+) gửi SIGKILL tới mọi tiến trình trong cgroup và các cgroup con, một cách nguyên tử (atomic), nên không đứa nào trốn được bằng cách fork — <code>pids.current</code> rơi về 0. <code>docker kill</code>, <code>systemctl kill</code> và kubelet dùng cùng ý tưởng.</p>
<p>➕ <code>pids.max</code> đếm <strong>tác vụ</strong> (task) — luồng cũng như tiến trình, vì với nhân Linux một luồng là một task như mọi task khác. Điều này thành cái bẫy cho runtime nhiều luồng: một dịch vụ Java có pool Tomcat 200 luồng, thêm luồng GC và JIT, cần hơn 200 pid nhiều; bài thực hành 2 chạy một JVM trong <code>--pids-limit 50</code> và nhận <code>OutOfMemoryError: unable to create native thread</code> sau khoảng 30 luồng — một lỗi "hết bộ nhớ" trong khi bộ nhớ còn dư thừa. Docker mặc định không đặt giới hạn pid; Kubernetes có giới hạn theo pod cấu hình ở kubelet (<code>podPidsLimit</code>).</p>
<p class="pitfall">⚠️ <code>EAGAIN</code> từ <code>fork()</code>/<code>pthread_create()</code> trong container hầu như không bao giờ là thiếu bộ nhớ: kiểm <code>pids.current</code> so với <code>pids.max</code> và <code>pids.events</code> trước, rồi tới <code>ulimit -u</code> và <code>/proc/sys/kernel/threads-max</code>.</p>`],
      [14, 'memory.max: OOM kill inside the cgroup → exit 137',
        `<p class="y-chinh">🎯 <code>memory.max = 50M</code> and no swap: a program that allocates and <em>touches</em> 10 MiB at a time is killed by the <strong>OOM killer only inside this cgroup</strong> — SIGKILL, so the shell reports <strong>128 + 9 = 137</strong>. <code>memory.events</code> keeps the evidence (<code>oom 1</code>, <code>oom_kill 1</code>) and the kernel log names the victim.</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 14: memory.max = 50M and no swap — the program is OOM-killed inside the cgroup only<br>
$ mkdir /sys/fs/cgroup/mem; echo 50M &gt; /sys/fs/cgroup/mem/memory.max; echo 0 &gt; /sys/fs/cgroup/mem/memory.swap.max<br>
$ cat /sys/fs/cgroup/mem/memory.max<br>
52428800<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/mem/cgroup.procs; exec ./eat' | tail -2; echo "exit code: &#36;{PIPESTATUS[0]}"<br>
allocated 30 MiB<br>
allocated 40 MiB<br>
exit code: 137<br>
$ grep -E '^(max|oom|oom_kill) ' /sys/fs/cgroup/mem/memory.events<br>
max 39<br>
oom 1<br>
oom_kill 1<br>
$ dmesg | grep -o 'Memory cgroup out of memory: Killed process [0-9]* (eat).*' | tail -1<br>
Memory cgroup out of memory: Killed process 87926 (eat) total-vm:53424kB, anon-rss:51032kB, file-rss:1184kB, shmem-rss:0kB, UID:0 pgtables:140kB oom_score_adj:0</div>
<p>The program <code>eat</code> calls <code>malloc(10 MiB)</code> and then <code>memset</code> on it. The <code>memset</code> is essential: <code>malloc</code> alone only reserves virtual address space (Linux overcommits — CS.5), and memory is charged to the cgroup only when a page is actually touched. It prints after each 10 MiB; the last line is <code>allocated 40 MiB</code>, the next 10 MiB would cross 50 MiB, and the process ends with exit status <strong>137</strong>. Nothing in the program failed: <code>malloc</code> never returned NULL. The kernel simply killed it.</p>
<p>What happened inside, in order (kernel documentation, <em>cgroup-v2</em>): when usage reaches <code>memory.max</code>, the kernel first tries to <strong>reclaim</strong> memory charged to this cgroup — drop clean page cache, write dirty pages, swap out anonymous pages if swap is allowed (it is not: <code>memory.swap.max = 0</code>). Each such hit is counted in the <code>max</code> field of <code>memory.events</code> (49 here). When reclaim cannot free enough, it invokes the <strong>OOM killer restricted to this cgroup</strong> (<code>oom 1</code>), which picks the biggest process inside — here the only one — and sends SIGKILL (<code>oom_kill 1</code>). The kernel log line <code>Memory cgroup out of memory: Killed process … (eat) total-vm:53424kB, anon-rss:51040kB</code> is the same message you will see with <code>dmesg</code> or <code>journalctl -k</code> on a server, and the earlier lines of that report contain <code>oom_memcg=/…/mem</code>: which cgroup ran out. Processes outside the cgroup are never chosen.</p>
<p>➕ Two neighbours of <code>memory.max</code> worth knowing: <code>memory.high</code> is a <em>soft</em> limit — above it the kernel throttles the cgroup and reclaims aggressively but does not kill (good for "slow down before you die"); <code>memory.current</code> is what the cgroup uses now, and it <strong>includes page cache</strong> charged to it — a container that reads large files looks "full" while most of it is reclaimable (<code>memory.stat</code> splits <code>anon</code> from <code>file</code>). That is why <code>docker stats</code> subtracts inactive file cache and why "memory usage 99%" is not always an alarm.</p>
<p class="pitfall">⚠️ A process killed by SIGKILL gets no chance to log anything — no stack trace, no "out of memory" message from Node or Java. The application log just stops. The evidence is outside the process: exit code 137, <code>memory.events</code>, <code>dmesg</code>, and Docker's <code>OOMKilled</code> flag (slide 17). Look there first.</p>`,
        `<p class="y-chinh">🎯 <code>memory.max = 50M</code> và không swap: một chương trình xin và <em>chạm vào</em> từng 10 MiB bị <strong>OOM killer giết chỉ trong cgroup này</strong> — SIGKILL, nên shell báo <strong>128 + 9 = 137</strong>. <code>memory.events</code> giữ lại bằng chứng (<code>oom 1</code>, <code>oom_kill 1</code>) và log của nhân ghi tên nạn nhân.</p>
<p>(OOM — out of memory, hết bộ nhớ; OOM killer là bộ phận của nhân chọn và giết tiến trình khi bộ nhớ cạn.)</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 14: memory.max = 50M và không swap — chương trình bị OOM-kill chỉ trong cgroup đó<br>
$ mkdir /sys/fs/cgroup/mem; echo 50M &gt; /sys/fs/cgroup/mem/memory.max; echo 0 &gt; /sys/fs/cgroup/mem/memory.swap.max<br>
$ cat /sys/fs/cgroup/mem/memory.max<br>
52428800<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/mem/cgroup.procs; exec ./eat' | tail -2; echo "exit code: &#36;{PIPESTATUS[0]}"<br>
allocated 30 MiB<br>
allocated 40 MiB<br>
exit code: 137<br>
$ grep -E '^(max|oom|oom_kill) ' /sys/fs/cgroup/mem/memory.events<br>
max 39<br>
oom 1<br>
oom_kill 1<br>
$ dmesg | grep -o 'Memory cgroup out of memory: Killed process [0-9]* (eat).*' | tail -1<br>
Memory cgroup out of memory: Killed process 87926 (eat) total-vm:53424kB, anon-rss:51032kB, file-rss:1184kB, shmem-rss:0kB, UID:0 pgtables:140kB oom_score_adj:0</div>
<p>Chương trình <code>eat</code> gọi <code>malloc(10 MiB)</code> rồi <code>memset</code> lên vùng đó. <code>memset</code> là bắt buộc: chỉ <code>malloc</code> thì mới giữ chỗ trong không gian địa chỉ ảo (Linux cho cấp phát vượt — overcommit — CS.5), và bộ nhớ chỉ bị tính vào cgroup khi một trang thật sự được chạm tới. Nó in ra sau mỗi 10 MiB; dòng cuối là <code>allocated 40 MiB</code>, 10 MiB tiếp theo sẽ vượt 50 MiB, và tiến trình kết thúc với trạng thái <strong>137</strong>. Không có gì trong chương trình thất bại: <code>malloc</code> chưa bao giờ trả NULL. Nhân đơn giản là giết nó.</p>
<p>Chuyện xảy ra bên trong, theo thứ tự (tài liệu nhân, <em>cgroup-v2</em>): khi mức dùng chạm <code>memory.max</code>, nhân trước hết cố <strong>thu hồi</strong> (reclaim) bộ nhớ đang tính cho cgroup này — bỏ page cache sạch, ghi các trang bẩn ra đĩa, đẩy trang ẩn danh ra swap nếu được phép (ở đây không: <code>memory.swap.max = 0</code>). Mỗi lần chạm như vậy được đếm ở trường <code>max</code> của <code>memory.events</code> (ở đây 49). Khi thu hồi không giải phóng đủ, nó gọi <strong>OOM killer giới hạn trong cgroup này</strong> (<code>oom 1</code>), cái này chọn tiến trình lớn nhất bên trong — ở đây là tiến trình duy nhất — và gửi SIGKILL (<code>oom_kill 1</code>). Dòng log của nhân <code>Memory cgroup out of memory: Killed process … (eat) total-vm:53424kB, anon-rss:51040kB</code> chính là thông báo bạn sẽ thấy bằng <code>dmesg</code> hoặc <code>journalctl -k</code> trên server, và các dòng phía trên của báo cáo đó có <code>oom_memcg=/…/mem</code>: cgroup nào đã cạn. Tiến trình ngoài cgroup không bao giờ bị chọn.</p>
<p>➕ Hai người hàng xóm của <code>memory.max</code> nên biết: <code>memory.high</code> là giới hạn <em>mềm</em> — vượt nó thì nhân hãm cgroup lại và thu hồi mạnh tay nhưng không giết (hợp với kiểu "chậm lại trước khi chết"); <code>memory.current</code> là lượng cgroup đang dùng, và nó <strong>tính cả page cache</strong> được quy cho cgroup — một container đọc tệp lớn trông như "đầy" trong khi phần lớn thu hồi được (<code>memory.stat</code> tách <code>anon</code> khỏi <code>file</code>). Vì thế <code>docker stats</code> trừ đi file cache không hoạt động, và "dùng 99% bộ nhớ" không phải lúc nào cũng là báo động.</p>
<p class="pitfall">⚠️ Tiến trình bị SIGKILL không có cơ hội ghi log gì — không stack trace, không thông báo "out of memory" từ Node hay Java. Log của ứng dụng chỉ đơn giản là dừng lại. Bằng chứng nằm ngoài tiến trình: mã thoát 137, <code>memory.events</code>, <code>dmesg</code>, và cờ <code>OOMKilled</code> của Docker (slide 17). Hãy nhìn ở đó trước.</p>`],
      [15, 'cpu.max: a quota per period, not a “slower CPU”',
        `<p class="y-chinh">🎯 <code>cpu.max = "20000 100000"</code> means: at most <strong>20 000 µs of CPU in every 100 000 µs period</strong>. The process runs at full speed, uses its quota, is <strong>throttled</strong> until the next period, and repeats. Measured: the same 3-second busy loop gets 3.00 s of CPU unlimited and ~0.62 s limited, with <code>nr_throttled</code> ≈ 31.</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 15: the same busy loop for 3 seconds in two cgroups: no limit, and cpu.max = 20000 100000<br>
$ mkdir fast slow; echo "20000 100000" &gt; slow/cpu.max; cat fast/cpu.max slow/cpu.max<br>
max 100000<br>
20000 100000<br>
$ for g in fast slow; do bash -c "echo \\$\\$ &gt; $g/cgroup.procs; exec timeout 3 sh -c 'while :; do :; done'"; done<br>
$ for g in fast slow; do echo "$g $(grep -E '^(usage_usec|nr_throttled)' $g/cpu.stat | tr '\\n' ' ')"; done<br>
fast usage_usec 2980782 nr_throttled 0<br>
slow usage_usec 620803 nr_throttled 31</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Two sibling cgroups run the same shell loop <code>while :; do :; done</code> for three seconds of wall-clock time (<code>timeout 3</code>). <code>fast</code> has the default <code>max 100000</code> (no quota) and burns about <strong>2.98 s</strong> of CPU — one full core for three seconds. <code>slow</code> has <code>20000 100000</code> and gets about <strong>0.62 s</strong>: 20 % of three seconds is 0.6 s, plus a small amount at the edges. <code>nr_throttled 31</code>: the group ran out of quota in 31 periods — three seconds are 30 periods of 100 ms, and it was throttled in practically every one of them. This is the mechanism called <strong>CFS bandwidth control</strong> (the Completely Fair Scheduler of lesson 2.D, extended with a quota). Phase A on the Mac measured the same 0.62 s.</p>
<p>The important consequence is for <em>latency</em>, not throughput. The simulation below follows five requests that each need 30 ms of CPU, one after another, under the same quota:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/985dc3369d98ef113146ae3f41c6e5dffe170a99.svg" alt="cpu.max 20000 100000: each 30 ms request needs two or three periods, wall time 110–190 ms" loading="lazy" /><p class="chu-thich">🧮 cpu.max 20000 100000: each 30 ms request needs two or three periods, wall time 110–190 ms</p></div>
<p>Computed wall time of each request: R1 <strong>110 ms</strong> · R2 <strong>110 ms</strong> · R3 <strong>190 ms</strong> · R4 <strong>110 ms</strong> · R5 <strong>190 ms</strong> — all five done at <strong>710 ms</strong> (CPU actually used: 150 ms).</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHU_KY = 10;                       // 100 ms = 10 units of 10 ms
const QUOTA = { q20: 2, q50: 5, max: Infinity };
export function moPhong(quota, soReq = 5, canCpu = 3) {
  const chay = [], cho = [], xong = [];
  let t = 0, conQuota = quota, dauChuKy = 0;
  for (let r = 0; r &lt; soReq; r++) {
    let can = canCpu; const batDau = t;
    while (can &gt; 0) {
      if (t &gt;= dauChuKy + CHU_KY) { dauChuKy += CHU_KY * Math.floor((t - dauChuKy) / CHU_KY); conQuota = quota; }
      if (conQuota &lt;= 0) {                                   // throttled until the next period starts
        const tiep = dauChuKy + CHU_KY; cho.push({ tu: t, den: tiep }); t = tiep; dauChuKy = tiep; conQuota = quota; continue;
      }
      const lat = Math.min(can, conQuota, dauChuKy + CHU_KY - t);
      chay.push({ tu: t, den: t + lat, req: r }); t += lat; can -= lat; conQuota -= lat;
    }
    xong.push({ req: r, tu: batDau, den: t });
  }
  return { chay, cho, xong };
}</code></pre></details>
<p>Request R1 runs 20 ms, the quota is gone, it waits 80 ms for the next period, runs its last 10 ms: <strong>110 ms</strong> of wall time for 30 ms of work. R3 is unlucky — it starts when only a little quota is left and needs three periods: <strong>190 ms</strong>. Practice exercise 3 measures this for real (91 to 197 ms per request). That is the classic production surprise: CPU usage of the container shows "only 20 %", yet p99 latency is terrible — because the limit is reached in bursts within each 100 ms. Look at <code>nr_throttled</code> and <code>throttled_usec</code> in <code>cpu.stat</code>, not at average CPU.</p>
<p>➕ cgroup v2 has a second, softer CPU knob: <code>cpu.weight</code> (1–10000, default 100) — a <em>share</em> that only matters when CPUs are busy: weight 200 gets twice the CPU of weight 100 under contention and costs nothing when the machine is idle. Kubernetes maps a pod's CPU <strong>request</strong> to <code>cpu.weight</code> and its CPU <strong>limit</strong> to <code>cpu.max</code>; that is why many teams set requests but no CPU limits for latency-sensitive services. Multi-threaded processes consume quota from all their threads: <code>--cpus 2</code> (<code>200000 100000</code>) lets 4 threads run 50 ms each per period, then all four wait.</p>
<p class="pitfall">⚠️ <code>--cpus 0.5</code> does not give you "half of a slower CPU"; it gives you a full-speed CPU for half the time, in 100 ms slices. A JVM or Node process that does a 300 ms garbage collection inside such a container is paused for the rest of each period — plan limits around peak bursts, not averages.</p>`,
        `<p class="y-chinh">🎯 <code>cpu.max = "20000 100000"</code> nghĩa là: nhiều nhất <strong>20 000 µs CPU trong mỗi chu kỳ 100 000 µs</strong>. Tiến trình chạy hết tốc lực, dùng hết hạn ngạch (quota), bị <strong>hãm</strong> (throttled) tới chu kỳ sau, rồi lặp lại. Đo thật: cùng một vòng lặp bận 3 giây nhận 3,00 s CPU khi không giới hạn và ~0,62 s khi bị giới hạn, với <code>nr_throttled</code> ≈ 31.</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 15: cùng một vòng lặp bận 3 giây trong hai cgroup: không giới hạn, và cpu.max = 20000 100000<br>
$ mkdir fast slow; echo "20000 100000" &gt; slow/cpu.max; cat fast/cpu.max slow/cpu.max<br>
max 100000<br>
20000 100000<br>
$ for g in fast slow; do bash -c "echo \\$\\$ &gt; $g/cgroup.procs; exec timeout 3 sh -c 'while :; do :; done'"; done<br>
$ for g in fast slow; do echo "$g $(grep -E '^(usage_usec|nr_throttled)' $g/cpu.stat | tr '\\n' ' ')"; done<br>
fast usage_usec 2980782 nr_throttled 0<br>
slow usage_usec 620803 nr_throttled 31</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Hai cgroup anh em chạy cùng một vòng lặp shell <code>while :; do :; done</code> trong ba giây thời gian thực (<code>timeout 3</code>). <code>fast</code> giữ mặc định <code>max 100000</code> (không hạn ngạch) và đốt khoảng <strong>2,98 s</strong> CPU — trọn một lõi trong ba giây. <code>slow</code> có <code>20000 100000</code> và nhận khoảng <strong>0,62 s</strong>: 20 % của ba giây là 0,6 s, cộng một chút ở hai đầu. <code>nr_throttled 31</code>: nhóm hết hạn ngạch trong 31 chu kỳ — ba giây là 30 chu kỳ 100 ms, và nó bị hãm gần như trong mọi chu kỳ. Cơ chế này tên là <strong>CFS bandwidth control</strong> (bộ lập lịch Completely Fair Scheduler của bài 2.D, mở rộng thêm hạn ngạch). Pha A trên máy Mac đo được cùng con số 0,62 s.</p>
<p>Hệ quả quan trọng nằm ở <em>độ trễ</em> (latency), không phải thông lượng. Mô phỏng dưới đây theo năm request, mỗi cái cần 30 ms CPU, nối đuôi nhau, cùng hạn ngạch đó:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/999e8eec7f6942b0655443b1487ddfc331bcba9d.svg" alt="cpu.max 20000 100000: mỗi request 30 ms cần hai hoặc ba chu kỳ, thời gian tường 110–190 ms" loading="lazy" /><p class="chu-thich">🧮 cpu.max 20000 100000: mỗi request 30 ms cần hai hoặc ba chu kỳ, thời gian tường 110–190 ms</p></div>
<p>Máy tính ra thời gian tường của từng request: R1 <strong>110 ms</strong> · R2 <strong>110 ms</strong> · R3 <strong>190 ms</strong> · R4 <strong>110 ms</strong> · R5 <strong>190 ms</strong> — xong cả năm lúc <strong>710 ms</strong> (CPU thật sự dùng: 150 ms).</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHU_KY = 10;                       // 100 ms = 10 units of 10 ms
const QUOTA = { q20: 2, q50: 5, max: Infinity };
export function moPhong(quota, soReq = 5, canCpu = 3) {
  const chay = [], cho = [], xong = [];
  let t = 0, conQuota = quota, dauChuKy = 0;
  for (let r = 0; r &lt; soReq; r++) {
    let can = canCpu; const batDau = t;
    while (can &gt; 0) {
      if (t &gt;= dauChuKy + CHU_KY) { dauChuKy += CHU_KY * Math.floor((t - dauChuKy) / CHU_KY); conQuota = quota; }
      if (conQuota &lt;= 0) {                                   // throttled until the next period starts
        const tiep = dauChuKy + CHU_KY; cho.push({ tu: t, den: tiep }); t = tiep; dauChuKy = tiep; conQuota = quota; continue;
      }
      const lat = Math.min(can, conQuota, dauChuKy + CHU_KY - t);
      chay.push({ tu: t, den: t + lat, req: r }); t += lat; can -= lat; conQuota -= lat;
    }
    xong.push({ req: r, tu: batDau, den: t });
  }
  return { chay, cho, xong };
}</code></pre></details>
<p>Request R1 chạy 20 ms, hết hạn ngạch, chờ 80 ms tới chu kỳ sau, chạy nốt 10 ms: <strong>110 ms</strong> thời gian tường (wall time — thời gian đồng hồ trên tường) cho 30 ms công việc. R3 kém may — nó bắt đầu khi hạn ngạch chỉ còn chút ít và cần ba chu kỳ: <strong>190 ms</strong>. Bài thực hành 3 đo thật chuyện này (91 tới 197 ms mỗi request). Đó là bất ngờ kinh điển trên production: CPU của container hiện "chỉ 20 %", vậy mà độ trễ p99 tệ hại — vì giới hạn bị chạm theo từng đợt bên trong mỗi 100 ms. Hãy nhìn <code>nr_throttled</code> và <code>throttled_usec</code> trong <code>cpu.stat</code>, đừng nhìn CPU trung bình.</p>
<p>➕ cgroup v2 còn một núm CPU thứ hai, mềm hơn: <code>cpu.weight</code> (1–10000, mặc định 100) — một <em>tỉ phần</em> chỉ có tác dụng khi CPU bận: trọng số 200 nhận gấp đôi CPU của trọng số 100 khi tranh chấp, và chẳng tốn gì khi máy rảnh. Kubernetes ánh xạ CPU <strong>request</strong> của pod sang <code>cpu.weight</code> và CPU <strong>limit</strong> sang <code>cpu.max</code>; đó là lý do nhiều đội đặt request mà không đặt CPU limit cho dịch vụ nhạy độ trễ. Tiến trình nhiều luồng tiêu hạn ngạch từ mọi luồng của nó: <code>--cpus 2</code> (<code>200000 100000</code>) cho 4 luồng mỗi luồng chạy 50 ms mỗi chu kỳ, rồi cả bốn cùng chờ.</p>
<p class="pitfall">⚠️ <code>--cpus 0.5</code> không cho bạn "một nửa của một CPU chậm hơn"; nó cho một CPU tốc độ đầy đủ trong một nửa thời gian, theo từng lát 100 ms. Một tiến trình JVM hay Node dọn rác (GC) 300 ms trong container như thế sẽ bị dừng phần còn lại của mỗi chu kỳ — hãy đặt giới hạn theo đỉnh đột biến, không theo trung bình.</p>`],
      [16, 'What docker run writes into /sys/fs/cgroup',
        `<p class="y-chinh">🎯 <code>docker run --memory 64m --cpus 0.5 --pids-limit 50</code> writes <code>memory.max = 67108864</code>, <code>memory.swap.max = 67108864</code>, <code>cpu.max = 50000 100000</code>, <code>pids.max = 50</code> into the container's cgroup — and that is all. Without flags every file says <code>max</code>. Inside, the container sees its own cgroup as <code>/</code>; on the host it is <code>/sys/fs/cgroup/docker/&lt;ID&gt;</code> (cgroupfs driver) or <code>…/docker-&lt;ID&gt;.scope</code> (systemd).</p>
<p>The course runner is itself a Docker container, so the proof is direct: this run was started <em>with</em> <code>--memory=64m --cpus=0.5 --pids-limit=50</code> and only reads the files.</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--memory=64m --cpus=0.5 --pids-limit=50</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 16: this container was started with --memory 64m --cpus 0.5 --pids-limit 50 — read what Docker wrote<br>
$ cd /sys/fs/cgroup<br>
$ cat /proc/self/cgroup<br>
0::/<br>
$ for f in memory.max memory.swap.max cpu.max pids.max; do printf '%-16s %s\\n' $f "$(cat $f)"; done<br>
memory.max &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;67108864<br>
memory.swap.max &nbsp;67108864<br>
cpu.max &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50000 100000<br>
pids.max &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50<br>
$ echo $(( $(cat memory.max) / 1024 / 1024 )) MiB<br>
64 MiB<br>
# Docker does not "watch" the container — after writing these files it is the kernel that enforces them</div>
<p>And a container started with no flags:</p>
<div class="out"># Slide 16: the same files in a container started WITHOUT limits<br>
$ cd /sys/fs/cgroup<br>
$ for f in memory.max memory.swap.max cpu.max pids.max; do printf '%-16s %s\\n' $f "$(cat $f)"; done<br>
memory.max &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max<br>
memory.swap.max &nbsp;max<br>
cpu.max &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max 100000<br>
pids.max &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max</div>
<p>The translation table on the slide, checked number by number: <code>--memory 64m</code> → <code>memory.max</code> = 64 × 1024 × 1024 = <strong>67108864</strong> bytes (the run divides it back: 64 MiB). <code>--memory-swap</code> was not given → Docker allows the same amount <em>again</em> as swap, so <code>memory.swap.max</code> = <strong>67108864</strong> (in v2, <code>memory.swap.max</code> counts swap only; Docker's <code>--memory-swap</code> means RAM + swap, so it writes the difference — slide 17 shows what that costs). <code>--cpus 0.5</code> → <code>cpu.max = 50000 100000</code>: half of each 100 ms period. <code>--pids-limit 50</code> → <code>pids.max = 50</code>. And (Phase A, on the Mac) <code>--cpuset-cpus 0,1</code> → <code>cpuset.cpus = 0-1</code>, the kernel's own spelling.</p>
<p>From the host (Phase A: a privileged helper container with <code>--cgroupns=host --pid=host</code>), the same numbers sit in <code>/sys/fs/cgroup/docker/&lt;ID&gt;/</code>, and <code>cgroup.procs</code> there lists the host PID of the container's process (53667). On a Linux server with systemd you find them at <code>/sys/fs/cgroup/system.slice/docker-&lt;ID&gt;.scope/</code>. The last comment of the run is the key idea: <strong>Docker does not watch your container</strong>. It writes the files once (or again on <code>docker update --memory …</code>) and the kernel enforces them from then on — which is also why the limits keep working if dockerd crashes.</p>
<p>➕ The same simulation as slide 15 with Docker's <code>--cpus 0.5</code>: half of every period, so a 30 ms request either fits (30 ms) or straddles a boundary (80 ms):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c78c6a354bb38b860d2f4561471b8a3b689d3c1a.svg" alt="cpu.max 50000 100000 (--cpus 0.5): requests take 30 ms or 80 ms depending on where the period boundary falls" loading="lazy" /><p class="chu-thich">🧮 cpu.max 50000 100000 (--cpus 0.5): requests take 30 ms or 80 ms depending on where the period boundary falls</p></div>
<p>Computed wall time of each request: R1 <strong>30 ms</strong> · R2 <strong>80 ms</strong> · R3 <strong>30 ms</strong> · R4 <strong>80 ms</strong> · R5 <strong>30 ms</strong> — all five done at <strong>250 ms</strong> (CPU actually used: 150 ms).</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHU_KY = 10;                       // 100 ms = 10 units of 10 ms
const QUOTA = { q20: 2, q50: 5, max: Infinity };
export function moPhong(quota, soReq = 5, canCpu = 3) {
  const chay = [], cho = [], xong = [];
  let t = 0, conQuota = quota, dauChuKy = 0;
  for (let r = 0; r &lt; soReq; r++) {
    let can = canCpu; const batDau = t;
    while (can &gt; 0) {
      if (t &gt;= dauChuKy + CHU_KY) { dauChuKy += CHU_KY * Math.floor((t - dauChuKy) / CHU_KY); conQuota = quota; }
      if (conQuota &lt;= 0) {                                   // throttled until the next period starts
        const tiep = dauChuKy + CHU_KY; cho.push({ tu: t, den: tiep }); t = tiep; dauChuKy = tiep; conQuota = quota; continue;
      }
      const lat = Math.min(can, conQuota, dauChuKy + CHU_KY - t);
      chay.push({ tu: t, den: t + lat, req: r }); t += lat; can -= lat; conQuota -= lat;
    }
    xong.push({ req: r, tu: batDau, den: t });
  }
  return { chay, cho, xong };
}</code></pre></details>
<p class="meo">🧠 Inside any container, the four-line check <code>cd /sys/fs/cgroup; cat memory.max memory.swap.max cpu.max pids.max</code> answers "what limits did I really get?" — no access to the host, no orchestrator dashboard needed. In Kubernetes it shows exactly what the pod spec's <code>resources.limits</code> became.</p>`,
        `<p class="y-chinh">🎯 <code>docker run --memory 64m --cpus 0.5 --pids-limit 50</code> ghi <code>memory.max = 67108864</code>, <code>memory.swap.max = 67108864</code>, <code>cpu.max = 50000 100000</code>, <code>pids.max = 50</code> vào cgroup của container — và chỉ có vậy. Không có cờ thì mọi tệp ghi <code>max</code>. Bên trong, container thấy cgroup của mình là <code>/</code>; trên máy chủ nó là <code>/sys/fs/cgroup/docker/&lt;ID&gt;</code> (driver cgroupfs) hoặc <code>…/docker-&lt;ID&gt;.scope</code> (systemd).</p>
<p>Bộ chạy của môn học bản thân là một container Docker, nên bằng chứng rất trực tiếp: lần chạy này được khởi động <em>với</em> <code>--memory=64m --cpus=0.5 --pids-limit=50</code> và chỉ việc đọc các tệp.</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--memory=64m --cpus=0.5 --pids-limit=50</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 16: container này chạy với --memory 64m --cpus 0.5 --pids-limit 50 — đọc xem Docker đã ghi gì<br>
$ cd /sys/fs/cgroup<br>
$ cat /proc/self/cgroup<br>
0::/<br>
$ for f in memory.max memory.swap.max cpu.max pids.max; do printf '%-16s %s\\n' $f "$(cat $f)"; done<br>
memory.max &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;67108864<br>
memory.swap.max &nbsp;67108864<br>
cpu.max &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50000 100000<br>
pids.max &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50<br>
$ echo $(( $(cat memory.max) / 1024 / 1024 )) MiB<br>
64 MiB<br>
# Docker không "canh" container — ghi xong các tệp này thì chính nhân thực thi chúng</div>
<p>Và một container khởi động không có cờ nào:</p>
<div class="out"># Slide 16: cùng các tệp đó trong một container chạy KHÔNG giới hạn<br>
$ cd /sys/fs/cgroup<br>
$ for f in memory.max memory.swap.max cpu.max pids.max; do printf '%-16s %s\\n' $f "$(cat $f)"; done<br>
memory.max &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max<br>
memory.swap.max &nbsp;max<br>
cpu.max &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max 100000<br>
pids.max &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max</div>
<p>Bảng quy đổi trên slide, kiểm từng con số: <code>--memory 64m</code> → <code>memory.max</code> = 64 × 1024 × 1024 = <strong>67108864</strong> byte (lần chạy chia ngược lại: 64 MiB). Không có <code>--memory-swap</code> → Docker cho thêm <em>một lượng bằng thế nữa</em> làm swap, nên <code>memory.swap.max</code> = <strong>67108864</strong> (ở v2, <code>memory.swap.max</code> chỉ tính swap; còn <code>--memory-swap</code> của Docker nghĩa là RAM + swap, nên nó ghi phần chênh lệch — slide 17 cho thấy cái giá của việc đó). <code>--cpus 0.5</code> → <code>cpu.max = 50000 100000</code>: một nửa mỗi chu kỳ 100 ms. <code>--pids-limit 50</code> → <code>pids.max = 50</code>. Và (Pha A, trên máy Mac) <code>--cpuset-cpus 0,1</code> → <code>cpuset.cpus = 0-1</code>, cách viết của chính nhân.</p>
<p>Từ máy chủ (Pha A: một container trợ giúp có đặc quyền với <code>--cgroupns=host --pid=host</code>), cùng những con số đó nằm trong <code>/sys/fs/cgroup/docker/&lt;ID&gt;/</code>, và <code>cgroup.procs</code> ở đó liệt kê PID trên máy chủ của tiến trình trong container (53667). Trên server Linux có systemd bạn tìm chúng ở <code>/sys/fs/cgroup/system.slice/docker-&lt;ID&gt;.scope/</code>. Dòng chú thích cuối của lần chạy là ý chính: <strong>Docker không canh container của bạn</strong>. Nó ghi các tệp một lần (hoặc ghi lại khi <code>docker update --memory …</code>) và từ đó nhân thực thi — cũng vì thế các giới hạn vẫn tác dụng nếu dockerd sập.</p>
<p>➕ Cùng mô phỏng như slide 15 với <code>--cpus 0.5</code> của Docker: một nửa mỗi chu kỳ, nên một request 30 ms hoặc lọt vừa (30 ms) hoặc vắt qua ranh giới chu kỳ (80 ms):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/2f4cfe4e9975e73f1c32d1523539b4b3a93cc365.svg" alt="cpu.max 50000 100000 (--cpus 0.5): request mất 30 ms hoặc 80 ms tuỳ ranh giới chu kỳ rơi vào đâu" loading="lazy" /><p class="chu-thich">🧮 cpu.max 50000 100000 (--cpus 0.5): request mất 30 ms hoặc 80 ms tuỳ ranh giới chu kỳ rơi vào đâu</p></div>
<p>Máy tính ra thời gian tường của từng request: R1 <strong>30 ms</strong> · R2 <strong>80 ms</strong> · R3 <strong>30 ms</strong> · R4 <strong>80 ms</strong> · R5 <strong>30 ms</strong> — xong cả năm lúc <strong>250 ms</strong> (CPU thật sự dùng: 150 ms).</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHU_KY = 10;                       // 100 ms = 10 units of 10 ms
const QUOTA = { q20: 2, q50: 5, max: Infinity };
export function moPhong(quota, soReq = 5, canCpu = 3) {
  const chay = [], cho = [], xong = [];
  let t = 0, conQuota = quota, dauChuKy = 0;
  for (let r = 0; r &lt; soReq; r++) {
    let can = canCpu; const batDau = t;
    while (can &gt; 0) {
      if (t &gt;= dauChuKy + CHU_KY) { dauChuKy += CHU_KY * Math.floor((t - dauChuKy) / CHU_KY); conQuota = quota; }
      if (conQuota &lt;= 0) {                                   // throttled until the next period starts
        const tiep = dauChuKy + CHU_KY; cho.push({ tu: t, den: tiep }); t = tiep; dauChuKy = tiep; conQuota = quota; continue;
      }
      const lat = Math.min(can, conQuota, dauChuKy + CHU_KY - t);
      chay.push({ tu: t, den: t + lat, req: r }); t += lat; can -= lat; conQuota -= lat;
    }
    xong.push({ req: r, tu: batDau, den: t });
  }
  return { chay, cho, xong };
}</code></pre></details>
<p class="meo">🧠 Bên trong bất kỳ container nào, phép kiểm bốn tệp <code>cd /sys/fs/cgroup; cat memory.max memory.swap.max cpu.max pids.max</code> trả lời câu "rốt cuộc tôi được giới hạn gì?" — không cần quyền vào máy chủ, không cần bảng điều khiển của orchestrator. Trên Kubernetes nó cho thấy chính xác <code>resources.limits</code> trong spec của pod đã thành ra cái gì.</p>`],
      [17, 'docker --memory: exit 137 and the swap surprise',
        `<p class="y-chinh">🎯 With only <code>--memory 64m</code> the program reached <strong>120 MiB</strong> before the OOM kill — Docker also allowed 64 MiB of swap. With <code>--memory 64m --memory-swap 64m</code> (RAM + swap total = 64 MiB, so <code>memory.swap.max = 0</code>) it stops at 60 MiB. Either way: exit <strong>137</strong>, <code>OOMKilled: true</code>. Diagnose with <code>docker inspect</code>, <code>memory.events</code>, <code>dmesg</code>.</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--memory=64m</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 17: --memory 64m only — how far does the program get before the OOM kill?<br>
$ cat /sys/fs/cgroup/memory.max /sys/fs/cgroup/memory.swap.max<br>
67108864<br>
67108864<br>
$ ./eat | tail -1; echo "exit code: &#36;{PIPESTATUS[0]}"<br>
allocated 120 MiB<br>
exit code: 137<br>
$ grep -E '^oom_kill ' /sys/fs/cgroup/memory.events<br>
oom_kill 1</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--memory=64m --memory-swap=64m</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 17: --memory 64m --memory-swap 64m — RAM + swap together may not exceed 64 MiB<br>
$ cat /sys/fs/cgroup/memory.max /sys/fs/cgroup/memory.swap.max<br>
67108864<br>
0<br>
$ ./eat | tail -1; echo "exit code: &#36;{PIPESTATUS[0]}"<br>
allocated 60 MiB<br>
exit code: 137</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Same program, same <code>--memory 64m</code>, two different results. In the first container <code>memory.swap.max</code> is 67108864, so when RAM usage reaches 64 MiB the kernel swaps older anonymous pages out and lets the program continue until RAM <em>and</em> swap are both full: the last line printed is <strong>120 MiB</strong> (64 RAM + up to 64 swap, minus what the shell and C library use). In the second, <code>--memory-swap 64m</code> says "RAM plus swap may not exceed 64 MiB", so Docker writes <code>memory.swap.max = 0</code> and the program dies at <strong>60 MiB</strong>. Both runs are 🎲 samples: the exact last line can move by 10 MiB depending on timing, and the check only requires &gt; 70 MiB and &lt; 64 MiB respectively.</p>
<p>The rule is from Docker's documentation (<em>Resource constraints</em>): if <code>--memory-swap</code> is not set and <code>--memory</code> is, the container may use as much swap as its memory limit, provided the host has swap at all. Docker Desktop's VM has swap; many cloud servers have none, so the same image behaves differently on the laptop and on the server — another reason to set both flags explicitly. Kubernetes nodes traditionally run with swap disabled, so there the first case cannot happen.</p>
<p>How Docker reports the kill (Phase A, on the Mac): <code>docker inspect -f '&#123;&#123;.State.OOMKilled&#125;&#125; &#123;&#123;.State.ExitCode&#125;&#125;' osg-cs6-oom</code> printed <code>true 137</code>, and <code>docker ps -a</code> shows <code>Exited (137)</code>. <code>OOMKilled</code> comes from the cgroup's <code>memory.events</code> (the line <code>oom_kill 1</code> in the first run above), read by containerd when the process exits. Kubernetes shows the same thing as <code>Last State: Terminated, Reason: OOMKilled, Exit Code: 137</code>.</p>
<p>➕ Why swap in a container is usually worse than a clean kill: a service that swaps keeps answering health checks but each request touches pages on disk, so latency goes from milliseconds to seconds while nothing restarts it. A clean OOM kill is visible (137), restarts in seconds and pages someone. That is why production guides recommend <code>--memory-swap</code> = <code>--memory</code> (or swap off) for latency-sensitive services, with the memory limit sized from measured peak RSS plus headroom.</p>
<p class="pitfall">⚠️ <code>137</code> does not always mean OOM: any SIGKILL gives 137 — <code>docker kill</code>, a stop timeout after SIGTERM (CS.1, slide 21), the kubelet killing a pod that failed its liveness probe. Check <code>OOMKilled</code>; if it is <code>false</code>, look for who sent the signal.</p>`,
        `<p class="y-chinh">🎯 Chỉ có <code>--memory 64m</code> thì chương trình đi tới <strong>120 MiB</strong> mới bị OOM-kill — Docker cho thêm 64 MiB swap. Với <code>--memory 64m --memory-swap 64m</code> (RAM + swap tổng cộng = 64 MiB, nên <code>memory.swap.max = 0</code>) nó dừng ở 60 MiB. Cách nào cũng: thoát <strong>137</strong>, <code>OOMKilled: true</code>. Chẩn đoán bằng <code>docker inspect</code>, <code>memory.events</code>, <code>dmesg</code>.</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--memory=64m</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 17: chỉ --memory 64m — chương trình đi được bao xa trước khi bị OOM-kill?<br>
$ cat /sys/fs/cgroup/memory.max /sys/fs/cgroup/memory.swap.max<br>
67108864<br>
67108864<br>
$ ./eat | tail -1; echo "exit code: &#36;{PIPESTATUS[0]}"<br>
allocated 120 MiB<br>
exit code: 137<br>
$ grep -E '^oom_kill ' /sys/fs/cgroup/memory.events<br>
oom_kill 1</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--memory=64m --memory-swap=64m</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 17: --memory 64m --memory-swap 64m — RAM + swap cộng lại không quá 64 MiB<br>
$ cat /sys/fs/cgroup/memory.max /sys/fs/cgroup/memory.swap.max<br>
67108864<br>
0<br>
$ ./eat | tail -1; echo "exit code: &#36;{PIPESTATUS[0]}"<br>
allocated 60 MiB<br>
exit code: 137</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Cùng chương trình, cùng <code>--memory 64m</code>, hai kết quả khác nhau. Ở container thứ nhất <code>memory.swap.max</code> là 67108864, nên khi RAM chạm 64 MiB nhân đẩy các trang ẩn danh cũ ra swap và để chương trình chạy tiếp tới khi RAM <em>và</em> swap đều đầy: dòng cuối in ra là <strong>120 MiB</strong> (64 RAM + tới 64 swap, trừ phần shell và thư viện C dùng). Ở container thứ hai, <code>--memory-swap 64m</code> nói "RAM cộng swap không được quá 64 MiB", nên Docker ghi <code>memory.swap.max = 0</code> và chương trình chết ở <strong>60 MiB</strong>. Cả hai lần chạy đều là 🎲 mẫu: dòng cuối chính xác có thể xê dịch 10 MiB tuỳ thời điểm, và phép kiểm chỉ đòi lần lượt &gt; 70 MiB và &lt; 64 MiB.</p>
<p>Luật này lấy từ tài liệu Docker (<em>Resource constraints</em>): nếu không đặt <code>--memory-swap</code> mà có đặt <code>--memory</code>, container được dùng lượng swap bằng giới hạn bộ nhớ của nó, với điều kiện máy chủ có swap. Máy ảo của Docker Desktop có swap; nhiều server trên cloud thì không, nên cùng một image cư xử khác nhau trên laptop và trên server — thêm một lý do để đặt rõ cả hai cờ. Các node Kubernetes theo truyền thống tắt swap, nên ở đó trường hợp thứ nhất không xảy ra.</p>
<p>Docker báo vụ giết thế nào (Pha A, trên máy Mac): <code>docker inspect -f '&#123;&#123;.State.OOMKilled&#125;&#125; &#123;&#123;.State.ExitCode&#125;&#125;' osg-cs6-oom</code> in ra <code>true 137</code>, và <code>docker ps -a</code> hiện <code>Exited (137)</code>. <code>OOMKilled</code> lấy từ <code>memory.events</code> của cgroup (dòng <code>oom_kill 1</code> ở lần chạy thứ nhất phía trên), containerd đọc khi tiến trình thoát. Kubernetes hiện cùng thứ đó là <code>Last State: Terminated, Reason: OOMKilled, Exit Code: 137</code>.</p>
<p>➕ Vì sao swap trong container thường tệ hơn một lần bị giết gọn: một dịch vụ đang swap vẫn trả lời health check, nhưng mỗi request chạm vào các trang nằm trên đĩa, nên độ trễ đi từ mili giây lên vài giây trong khi chẳng có gì khởi động lại nó. Một lần OOM-kill gọn gàng thì nhìn thấy được (137), khởi động lại trong vài giây và báo động cho người trực. Vì thế các hướng dẫn production khuyên đặt <code>--memory-swap</code> = <code>--memory</code> (hoặc tắt swap) cho dịch vụ nhạy độ trễ, với giới hạn bộ nhớ tính từ RSS đỉnh đo được cộng phần dư.</p>
<p class="pitfall">⚠️ <code>137</code> không phải lúc nào cũng là OOM: mọi SIGKILL đều ra 137 — <code>docker kill</code>, hết hạn chờ sau SIGTERM (CS.1, slide 21), kubelet giết một pod trượt liveness probe. Hãy kiểm <code>OOMKilled</code>; nếu nó là <code>false</code> thì đi tìm ai đã gửi tín hiệu.</p>`],
      [18, 'Image layers = overlayfs: read-only + writable',
        `<p class="y-chinh">🎯 An image is a stack of <strong>read-only layers</strong> (lowerdir); each container adds one thin <strong>writable layer</strong> (upperdir); <strong>overlayfs</strong> merges them into the "/" you see. Read: the top-most copy wins. Write: <strong>copy-up</strong> into upperdir. Delete: a <strong>whiteout</strong> (char device 0,0) hides the lower file. Ten containers from one image share the same lower layers on disk.</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 18: build an overlay by hand — two read-only layers, one writable layer<br>
$ mount | grep ' on / ' | grep -o 'type overlay'<br>
type overlay<br>
$ mount | grep ' on / ' | grep -o 'lowerdir=[^,]*' | tr ':' '\\n' | wc -l<br>
10<br>
# upperdir may not live on an overlay itself, so the lab works on a tmpfs<br>
$ mount -t overlay overlay -o lowerdir=img2:img1,upperdir=up,workdir=work merged<br>
$ ls merged; cat merged/app.conf<br>
app.conf<br>
os-release<br>
from layer 2<br>
$ echo hi &gt; merged/new.txt; rm merged/os-release<br>
$ ls -l up | tail -n +2<br>
-rw-r--r-- 1 root root &nbsp;&nbsp;&nbsp;3 Oct 26 09:08 new.txt<br>
c--------- 2 root root 0, 0 Oct 26 09:08 os-release<br>
$ ls img1<br>
app.conf<br>
os-release<br>
$ echo changed &gt;&gt; merged/app.conf; cat up/app.conf; cat img2/app.conf<br>
from layer 2<br>
changed<br>
from layer 2</div>
<p>First, the course container's own root: <code>type overlay</code>, with <strong>10</strong> lowerdirs — the image <code>osg202-lab</code> has 9 layers (one per Dockerfile instruction that changes files), plus one small "init" layer Docker adds with <code>/etc/hosts</code>, <code>/etc/resolv.conf</code> and <code>/etc/hostname</code>. (Phase A on the Mac: the 2-layer image <code>osg-cs6-tools</code> gave 3 lowerdirs, Alpine 1 + 1 = 2 — the same rule.) Then we build an overlay by hand on a tmpfs (an upperdir may not itself live on an overlay — trying it on <code>/tmp</code> fails with "wrong fs type"). <code>img1</code> plays the base layer with <code>app.conf</code> and <code>os-release</code>; <code>img2</code> is a later layer that changes <code>app.conf</code>; <code>lowerdir=img2:img1</code> lists layers top first.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/417337e2649d85522ab0a06e1d4eaef015e3aa46.svg" alt="right after mount: the upper layer is empty, merged shows app.conf from img2 (top-most copy wins) and os-release from img1" loading="lazy" /><p class="chu-thich">🧮 right after mount: the upper layer is empty, merged shows app.conf from img2 (top-most copy wins) and os-release from img1</p></div>
<p>Lookup goes from the top down; the first layer that has the name wins: <code>app.conf</code> ← img2 · <code>os-release</code> ← img1.</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const LOWER = [                                    // index 0 = top-most lower layer (lowerdir=img2:img1)
  { ten: 'img2', tep: { 'app.conf': 'from layer 2' } },
  { ten: 'img1', tep: { 'app.conf': 'from layer 1', 'os-release': 'base os' } },
];
const THAO_TAC = [
  { lam: 'ghi', ten: 'new.txt', noi: 'hi' },
  { lam: 'xoa', ten: 'os-release' },
  { lam: 'noi', ten: 'app.conf', noi: 'changed' },
];
const WHITEOUT = Symbol('whiteout');
export function tra(upper, ten) {                  // look a name up from the top down
  if (ten in upper) return upper[ten] === WHITEOUT ? null : { tu: 'upper', nd: upper[ten] };
  for (const l of LOWER) if (ten in l.tep) return { tu: l.ten, nd: l.tep[ten] };
  return null;
}
export function chay(n) {
  const upper = {};
  for (const op of THAO_TAC.slice(0, n)) {
    const cu = tra(upper, op.ten);
    if (op.lam === 'ghi') upper[op.ten] = op.noi;
    else if (op.lam === 'xoa') upper[op.ten] = WHITEOUT;            // the lower file cannot be deleted: hide it
    else if (op.lam === 'noi') upper[op.ten] = (cu ? cu.nd + '\\n' : '') + op.noi;   // copy-up, then modify the copy
  }
  const ten = [...new Set([...Object.keys(upper), ...LOWER.flatMap((l) =&gt; Object.keys(l.tep))])].sort();
  const merged = ten.map((x) =&gt; [x, tra(upper, x)]).filter(([, v]) =&gt; v);
  return { upper, merged };
}</code></pre></details>
<p>The three operations, matching the output: <strong>write</strong> <code>new.txt</code> → it is created in <code>up/</code> only. <strong>Delete</strong> <code>os-release</code> → the file in <code>img1</code> cannot be touched (lower layers are read-only), so overlayfs creates in <code>up/</code> a <strong>character device with numbers 0, 0</strong> — the whiteout, <code>c--------- … 0, 0 os-release</code> — and from then on lookups stop there; <code>ls img1</code> shows the original is still present. <strong>Modify</strong> <code>app.conf</code> → overlayfs first copies the whole file from the top lower layer into <code>up/</code> (<em>copy-up</em>), then appends: <code>up/app.conf</code> contains "from layer 2" + "changed", while <code>img2/app.conf</code> still says "from layer 2".</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/192b3604d2d6cf23610af0568f9f5a2ee11d9473.svg" alt="after write, delete, append: merged shows only upper files; upperdir holds new.txt, the whiteout for os-release and the copied-up app.conf" loading="lazy" /><p class="chu-thich">🧮 after write, delete, append: merged shows only upper files; upperdir holds new.txt, the whiteout for os-release and the copied-up app.conf</p></div>
<p>Lookup goes from the top down; the first layer that has the name wins: <code>app.conf</code> ← upper · <code>new.txt</code> ← upper.</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const LOWER = [                                    // index 0 = top-most lower layer (lowerdir=img2:img1)
  { ten: 'img2', tep: { 'app.conf': 'from layer 2' } },
  { ten: 'img1', tep: { 'app.conf': 'from layer 1', 'os-release': 'base os' } },
];
const THAO_TAC = [
  { lam: 'ghi', ten: 'new.txt', noi: 'hi' },
  { lam: 'xoa', ten: 'os-release' },
  { lam: 'noi', ten: 'app.conf', noi: 'changed' },
];
const WHITEOUT = Symbol('whiteout');
export function tra(upper, ten) {                  // look a name up from the top down
  if (ten in upper) return upper[ten] === WHITEOUT ? null : { tu: 'upper', nd: upper[ten] };
  for (const l of LOWER) if (ten in l.tep) return { tu: l.ten, nd: l.tep[ten] };
  return null;
}
export function chay(n) {
  const upper = {};
  for (const op of THAO_TAC.slice(0, n)) {
    const cu = tra(upper, op.ten);
    if (op.lam === 'ghi') upper[op.ten] = op.noi;
    else if (op.lam === 'xoa') upper[op.ten] = WHITEOUT;            // the lower file cannot be deleted: hide it
    else if (op.lam === 'noi') upper[op.ten] = (cu ? cu.nd + '\\n' : '') + op.noi;   // copy-up, then modify the copy
  }
  const ten = [...new Set([...Object.keys(upper), ...LOWER.flatMap((l) =&gt; Object.keys(l.tep))])].sort();
  const merged = ten.map((x) =&gt; [x, tra(upper, x)]).filter(([, v]) =&gt; v);
  return { upper, merged };
}</code></pre></details>
<p>➕ What this means for Dockerfiles and for running containers. (1) <code>RUN rm big.tar</code> in a later layer does <em>not</em> make the image smaller — the file still sits in the earlier layer, only hidden by a whiteout (practice exercise 5 measures it: 20 MB below, 0 bytes above). Delete in the same <code>RUN</code> that created it, or use a multi-stage build. (2) Copy-up copies the <em>whole</em> file the first time it is modified: appending one line to a 2 GB log or database file that came from the image costs a 2 GB copy — databases and logs belong on a volume, which is a plain bind mount outside the overlay. (3) The upper layer is deleted with the container (<code>docker rm</code>): anything written there is lost on every redeploy.</p>
<p class="pitfall">⚠️ "My image is 1.2 GB so ten containers need 12 GB" — no: the lower layers are shared and stored once; each container costs only its upper layer (often a few kilobytes) plus its memory. <code>docker system df -v</code> shows "shared size" vs "unique size".</p>`,
        `<p class="y-chinh">🎯 Một image là một chồng <strong>lớp chỉ đọc</strong> (lowerdir); mỗi container thêm một <strong>lớp ghi được</strong> mỏng (upperdir); <strong>overlayfs</strong> trộn chúng thành "/" mà bạn thấy. Đọc: bản ở lớp cao nhất thắng. Ghi: <strong>copy-up</strong> (chép lên) vào upperdir. Xoá: một <strong>whiteout</strong> (thiết bị ký tự 0,0) che tệp ở lớp dưới. Mười container từ một image dùng chung các lớp dưới trên đĩa.</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 18: tự dựng một overlay — hai lớp chỉ đọc, một lớp ghi được<br>
$ mount | grep ' on / ' | grep -o 'type overlay'<br>
type overlay<br>
$ mount | grep ' on / ' | grep -o 'lowerdir=[^,]*' | tr ':' '\\n' | wc -l<br>
10<br>
# upperdir không được nằm trên chính một overlay, nên bài làm trên tmpfs<br>
$ mount -t overlay overlay -o lowerdir=img2:img1,upperdir=up,workdir=work merged<br>
$ ls merged; cat merged/app.conf<br>
app.conf<br>
os-release<br>
from layer 2<br>
$ echo hi &gt; merged/new.txt; rm merged/os-release<br>
$ ls -l up | tail -n +2<br>
-rw-r--r-- 1 root root &nbsp;&nbsp;&nbsp;3 Oct 26 09:08 new.txt<br>
c--------- 2 root root 0, 0 Oct 26 09:08 os-release<br>
$ ls img1<br>
app.conf<br>
os-release<br>
$ echo changed &gt;&gt; merged/app.conf; cat up/app.conf; cat img2/app.conf<br>
from layer 2<br>
changed<br>
from layer 2</div>
<p>Đầu tiên, chính gốc của container môn học: <code>type overlay</code>, với <strong>10</strong> lowerdir — image <code>osg202-lab</code> có 9 lớp (mỗi lệnh Dockerfile làm đổi tệp sinh một lớp), cộng một lớp "init" nhỏ do Docker thêm, chứa <code>/etc/hosts</code>, <code>/etc/resolv.conf</code> và <code>/etc/hostname</code>. (Pha A trên máy Mac: image 2 lớp <code>osg-cs6-tools</code> cho 3 lowerdir, Alpine 1 + 1 = 2 — cùng một luật.) Rồi ta tự dựng một overlay trên tmpfs (upperdir không được nằm trên chính một overlay — thử trên <code>/tmp</code> sẽ hỏng với "wrong fs type"). <code>img1</code> đóng vai lớp gốc có <code>app.conf</code> và <code>os-release</code>; <code>img2</code> là một lớp sau đổi <code>app.conf</code>; <code>lowerdir=img2:img1</code> liệt kê các lớp, lớp trên ghi trước.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c3f6833bc10d31191dc5d5188f4f28ad9214c7f4.svg" alt="ngay sau khi mount: lớp trên rỗng, merged hiện app.conf của img2 (bản ở lớp cao nhất thắng) và os-release của img1" loading="lazy" /><p class="chu-thich">🧮 ngay sau khi mount: lớp trên rỗng, merged hiện app.conf của img2 (bản ở lớp cao nhất thắng) và os-release của img1</p></div>
<p>Tra từ trên xuống; lớp đầu tiên có tên đó thắng: <code>app.conf</code> ← img2 · <code>os-release</code> ← img1.</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const LOWER = [                                    // index 0 = top-most lower layer (lowerdir=img2:img1)
  { ten: 'img2', tep: { 'app.conf': 'from layer 2' } },
  { ten: 'img1', tep: { 'app.conf': 'from layer 1', 'os-release': 'base os' } },
];
const THAO_TAC = [
  { lam: 'ghi', ten: 'new.txt', noi: 'hi' },
  { lam: 'xoa', ten: 'os-release' },
  { lam: 'noi', ten: 'app.conf', noi: 'changed' },
];
const WHITEOUT = Symbol('whiteout');
export function tra(upper, ten) {                  // look a name up from the top down
  if (ten in upper) return upper[ten] === WHITEOUT ? null : { tu: 'upper', nd: upper[ten] };
  for (const l of LOWER) if (ten in l.tep) return { tu: l.ten, nd: l.tep[ten] };
  return null;
}
export function chay(n) {
  const upper = {};
  for (const op of THAO_TAC.slice(0, n)) {
    const cu = tra(upper, op.ten);
    if (op.lam === 'ghi') upper[op.ten] = op.noi;
    else if (op.lam === 'xoa') upper[op.ten] = WHITEOUT;            // the lower file cannot be deleted: hide it
    else if (op.lam === 'noi') upper[op.ten] = (cu ? cu.nd + '\\n' : '') + op.noi;   // copy-up, then modify the copy
  }
  const ten = [...new Set([...Object.keys(upper), ...LOWER.flatMap((l) =&gt; Object.keys(l.tep))])].sort();
  const merged = ten.map((x) =&gt; [x, tra(upper, x)]).filter(([, v]) =&gt; v);
  return { upper, merged };
}</code></pre></details>
<p>Ba thao tác, khớp với output: <strong>ghi</strong> <code>new.txt</code> → nó chỉ được tạo trong <code>up/</code>. <strong>Xoá</strong> <code>os-release</code> → tệp trong <code>img1</code> không được đụng tới (lớp dưới chỉ đọc), nên overlayfs tạo trong <code>up/</code> một <strong>thiết bị ký tự mang số 0, 0</strong> — whiteout, <code>c--------- … 0, 0 os-release</code> — và từ đó mọi lần tra tên dừng ở đây; <code>ls img1</code> cho thấy bản gốc vẫn còn nguyên. <strong>Sửa</strong> <code>app.conf</code> → overlayfs trước hết chép cả tệp từ lớp dưới cao nhất lên <code>up/</code> (<em>copy-up</em>), rồi mới nối thêm: <code>up/app.conf</code> chứa "from layer 2" + "changed", trong khi <code>img2/app.conf</code> vẫn ghi "from layer 2".</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5bbca09ad03ee61459504e777830ac27580ee8d2.svg" alt="sau ghi, xoá, nối thêm: merged chỉ còn tệp của lớp trên; upperdir giữ new.txt, whiteout của os-release và app.conf đã copy-up" loading="lazy" /><p class="chu-thich">🧮 sau ghi, xoá, nối thêm: merged chỉ còn tệp của lớp trên; upperdir giữ new.txt, whiteout của os-release và app.conf đã copy-up</p></div>
<p>Tra từ trên xuống; lớp đầu tiên có tên đó thắng: <code>app.conf</code> ← upper · <code>new.txt</code> ← upper.</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const LOWER = [                                    // index 0 = top-most lower layer (lowerdir=img2:img1)
  { ten: 'img2', tep: { 'app.conf': 'from layer 2' } },
  { ten: 'img1', tep: { 'app.conf': 'from layer 1', 'os-release': 'base os' } },
];
const THAO_TAC = [
  { lam: 'ghi', ten: 'new.txt', noi: 'hi' },
  { lam: 'xoa', ten: 'os-release' },
  { lam: 'noi', ten: 'app.conf', noi: 'changed' },
];
const WHITEOUT = Symbol('whiteout');
export function tra(upper, ten) {                  // look a name up from the top down
  if (ten in upper) return upper[ten] === WHITEOUT ? null : { tu: 'upper', nd: upper[ten] };
  for (const l of LOWER) if (ten in l.tep) return { tu: l.ten, nd: l.tep[ten] };
  return null;
}
export function chay(n) {
  const upper = {};
  for (const op of THAO_TAC.slice(0, n)) {
    const cu = tra(upper, op.ten);
    if (op.lam === 'ghi') upper[op.ten] = op.noi;
    else if (op.lam === 'xoa') upper[op.ten] = WHITEOUT;            // the lower file cannot be deleted: hide it
    else if (op.lam === 'noi') upper[op.ten] = (cu ? cu.nd + '\\n' : '') + op.noi;   // copy-up, then modify the copy
  }
  const ten = [...new Set([...Object.keys(upper), ...LOWER.flatMap((l) =&gt; Object.keys(l.tep))])].sort();
  const merged = ten.map((x) =&gt; [x, tra(upper, x)]).filter(([, v]) =&gt; v);
  return { upper, merged };
}</code></pre></details>
<p>➕ Ý nghĩa với Dockerfile và với container đang chạy. (1) <code>RUN rm big.tar</code> ở một lớp sau <em>không</em> làm image nhỏ đi — tệp vẫn nằm ở lớp trước, chỉ bị whiteout che (bài thực hành 5 đo điều đó: 20 MB ở dưới, 0 byte ở trên). Hãy xoá ngay trong cùng lệnh <code>RUN</code> đã tạo ra nó, hoặc dùng multi-stage build. (2) Copy-up chép <em>cả</em> tệp ở lần sửa đầu tiên: nối một dòng vào một tệp log hay cơ sở dữ liệu 2 GB đến từ image là tốn một lần chép 2 GB — cơ sở dữ liệu và log thuộc về volume, tức một bind mount bình thường nằm ngoài overlay. (3) Lớp trên bị xoá cùng container (<code>docker rm</code>): mọi thứ ghi vào đó mất sạch sau mỗi lần deploy lại.</p>
<p class="pitfall">⚠️ "Image của tôi 1,2 GB nên mười container cần 12 GB" — không: các lớp dưới dùng chung và chỉ lưu một lần; mỗi container chỉ tốn lớp trên của nó (thường vài KB) cộng bộ nhớ RAM. <code>docker system df -v</code> hiện "shared size" so với "unique size".</p>`],
      [19, 'Capabilities: root in a container is not full root',
        `<p class="y-chinh">🎯 Linux splits root's power into <strong>~41 capabilities</strong>; a default Docker container keeps <strong>14</strong> (<code>CapEff: 00000000a80425fb</code>). Missing ones — <code>SYS_ADMIN</code> (mount, hostname…), <code>NET_ADMIN</code>, <code>SYS_PTRACE</code>, <code>SYS_MODULE</code> — make uid 0 inside fail with "must be root" or "Operation not permitted". <code>--privileged</code> = all 41 caps + no seccomp: only for labs.</p>
<div class="out"># Slide 19: root in a default container — which capabilities, and what they forbid<br>
$ id -u<br>
0<br>
$ grep -E '^(CapEff|CapBnd|Seccomp|NoNewPrivs):' /proc/self/status<br>
CapEff:	00000000a80425fb<br>
CapBnd:	00000000a80425fb<br>
NoNewPrivs:	0<br>
Seccomp:	2<br>
$ capsh --decode=$(awk '/^CapEff/{print $2}' /proc/self/status) | cut -d= -f2 | tr ',' '\\n' | paste -sd' ' | fold -s -w 90<br>
cap_chown cap_dac_override cap_fowner cap_fsetid cap_kill cap_setgid cap_setuid<br>
cap_setpcap cap_net_bind_service cap_net_raw cap_sys_chroot cap_mknod cap_audit_write<br>
cap_setfcap<br>
$ hostname test<br>
hostname: you must be root to change the host name<br>
$ ip link set lo down<br>
RTNETLINK answers: Operation not permitted<br>
$ chown nobody /tmp &amp;&amp; echo "chown: allowed (CAP_CHOWN is kept)"<br>
chown: allowed (CAP_CHOWN is kept)</div>
<p>The shell is uid 0, yet <code>hostname test</code> fails — with a misleading message, "you must be root": the tool sees EPERM and guesses the reason. The real reason is the capability check in the kernel: <code>sethostname()</code> requires <code>CAP_SYS_ADMIN</code>, and it is not in the list. The same for <code>ip link set lo down</code> (<code>CAP_NET_ADMIN</code>: <code>RTNETLINK answers: Operation not permitted</code>). Meanwhile <code>chown</code> works, because <code>CAP_CHOWN</code> is one of the 14 kept. <code>CapEff</code> is the effective set as a 64-bit mask; <code>capsh --decode</code> turns it into names. <code>CapBnd</code> (bounding set) is the ceiling no program in the container can ever exceed, even a setuid one. <code>NoNewPrivs: 0</code> and <code>Seccomp: 2</code> (a filter is loaded) are the next slide.</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=NET_ADMIN</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 19: the same ip command with exactly one capability added<br>
$ capsh --decode=$(awk '/^CapEff/{print $2}' /proc/self/status) | tr ',' '\\n' | grep -c cap_<br>
15<br>
$ ip link set lo down &amp;&amp; ip -br link show lo<br>
lo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DOWN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00:00:00:00 &lt;LOOPBACK&gt;<br>
$ hostname test<br>
hostname: you must be root to change the host name</div>
<p>Add exactly one capability with <code>--cap-add NET_ADMIN</code>: the set grows to 15, the same <code>ip link set lo down</code> now succeeds, and <code>hostname</code> still fails — capabilities are independent switches. (Phase A showed the opposite direction with <code>ping</code>: <code>--cap-drop NET_RAW</code> made <code>exec /usr/bin/ping: operation not permitted</code>, because the <code>ping</code> binary carries a file capability <code>cap_net_raw</code> that can no longer be granted; the course image has no ping.)</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 19: --privileged = every capability and no seccomp filter<br>
$ grep -E '^(CapEff|Seccomp):' /proc/self/status<br>
CapEff:	000001ffffffffff<br>
Seccomp:	0<br>
$ capsh --decode=$(awk '/^CapEff/{print $2}' /proc/self/status) | tr ',' '\\n' | grep -c cap_<br>
41<br>
$ hostname test &amp;&amp; hostname<br>
test</div>
<p><code>--privileged</code>: <code>CapEff: 000001ffffffffff</code> = bits 0–40 = all <strong>41</strong> capabilities of this kernel, and <code>Seccomp: 0</code> — no filter. It also exposes host devices under <code>/dev</code> and leaves <code>/sys</code> writable. A privileged container can load kernel modules, mount the host's disks and escape trivially; that is why this course uses it only for the lab runs that need it, and why "add <code>--privileged</code> to fix a permission error" is the worst fix in Docker.</p>
<p>➕ Good practice for real services: run as a non-root <code>USER</code> in the Dockerfile; <code>--cap-drop ALL</code> and add back only what you need (a web server binding port 80 needs only <code>NET_BIND_SERVICE</code>); add <code>--security-opt no-new-privileges</code> so setuid binaries cannot raise privileges; Kubernetes expresses the same with <code>securityContext.capabilities</code>, <code>runAsNonRoot</code> and <code>allowPrivilegeEscalation: false</code>.</p>
<p class="pitfall">⚠️ Reading the default list, note what IS kept: <code>CAP_DAC_OVERRIDE</code> (root ignores file permissions), <code>CAP_SETUID</code>, <code>CAP_NET_RAW</code> (raw packets, ARP spoofing on the bridge). "Root in a container" is weaker than host root, not harmless.</p>`,
        `<p class="y-chinh">🎯 Linux chia quyền lực của root thành <strong>~41 capability</strong> (năng lực đặc quyền); một container Docker mặc định giữ <strong>14</strong> (<code>CapEff: 00000000a80425fb</code>). Thiếu những cái như <code>SYS_ADMIN</code> (mount, hostname…), <code>NET_ADMIN</code>, <code>SYS_PTRACE</code>, <code>SYS_MODULE</code> khiến uid 0 bên trong thất bại với "must be root" hay "Operation not permitted". <code>--privileged</code> = đủ 41 capability + không seccomp: chỉ dùng cho bài lab.</p>
<div class="out"># Slide 19: root trong một container mặc định — những capability nào, và chúng cấm gì<br>
$ id -u<br>
0<br>
$ grep -E '^(CapEff|CapBnd|Seccomp|NoNewPrivs):' /proc/self/status<br>
CapEff:	00000000a80425fb<br>
CapBnd:	00000000a80425fb<br>
NoNewPrivs:	0<br>
Seccomp:	2<br>
$ capsh --decode=$(awk '/^CapEff/{print $2}' /proc/self/status) | cut -d= -f2 | tr ',' '\\n' | paste -sd' ' | fold -s -w 90<br>
cap_chown cap_dac_override cap_fowner cap_fsetid cap_kill cap_setgid cap_setuid<br>
cap_setpcap cap_net_bind_service cap_net_raw cap_sys_chroot cap_mknod cap_audit_write<br>
cap_setfcap<br>
$ hostname test<br>
hostname: you must be root to change the host name<br>
$ ip link set lo down<br>
RTNETLINK answers: Operation not permitted<br>
$ chown nobody /tmp &amp;&amp; echo "chown: allowed (CAP_CHOWN is kept)"<br>
chown: allowed (CAP_CHOWN is kept)</div>
<p>Shell là uid 0, vậy mà <code>hostname test</code> thất bại — với một thông báo gây hiểu lầm, "you must be root": công cụ nhận EPERM rồi đoán lý do. Lý do thật là phép kiểm capability trong nhân: <code>sethostname()</code> đòi <code>CAP_SYS_ADMIN</code>, mà nó không có trong danh sách. Tương tự với <code>ip link set lo down</code> (<code>CAP_NET_ADMIN</code>: <code>RTNETLINK answers: Operation not permitted</code>). Trong khi đó <code>chown</code> chạy được, vì <code>CAP_CHOWN</code> là một trong 14 cái được giữ. <code>CapEff</code> là tập hiệu lực (effective) dưới dạng mặt nạ 64 bit; <code>capsh --decode</code> đổi nó thành tên. <code>CapBnd</code> (bounding set — tập giới hạn) là trần mà không chương trình nào trong container vượt được, kể cả chương trình setuid. <code>NoNewPrivs: 0</code> và <code>Seccomp: 2</code> (đã nạp một bộ lọc) là chuyện của slide sau.</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=NET_ADMIN</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 19: cùng lệnh ip đó khi thêm đúng một capability<br>
$ capsh --decode=$(awk '/^CapEff/{print $2}' /proc/self/status) | tr ',' '\\n' | grep -c cap_<br>
15<br>
$ ip link set lo down &amp;&amp; ip -br link show lo<br>
lo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DOWN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00:00:00:00 &lt;LOOPBACK&gt;<br>
$ hostname test<br>
hostname: you must be root to change the host name</div>
<p>Thêm đúng một capability bằng <code>--cap-add NET_ADMIN</code>: tập tăng lên 15, cùng lệnh <code>ip link set lo down</code> giờ thành công, còn <code>hostname</code> vẫn thất bại — các capability là những công tắc độc lập. (Pha A cho thấy chiều ngược lại với <code>ping</code>: <code>--cap-drop NET_RAW</code> làm ra <code>exec /usr/bin/ping: operation not permitted</code>, vì tệp <code>ping</code> mang file capability <code>cap_net_raw</code> mà giờ không thể cấp được nữa; image của môn học không có ping.)</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 19: --privileged = mọi capability và không bộ lọc seccomp<br>
$ grep -E '^(CapEff|Seccomp):' /proc/self/status<br>
CapEff:	000001ffffffffff<br>
Seccomp:	0<br>
$ capsh --decode=$(awk '/^CapEff/{print $2}' /proc/self/status) | tr ',' '\\n' | grep -c cap_<br>
41<br>
$ hostname test &amp;&amp; hostname<br>
test</div>
<p><code>--privileged</code>: <code>CapEff: 000001ffffffffff</code> = các bit 0–40 = đủ <strong>41</strong> capability của nhân này, và <code>Seccomp: 0</code> — không bộ lọc. Nó còn lộ thiết bị của máy chủ trong <code>/dev</code> và để <code>/sys</code> ghi được. Một container privileged nạp được module nhân, mount được ổ đĩa của máy chủ và thoát ra dễ như chơi; vì thế môn này chỉ dùng nó cho các lần chạy lab cần đến, và "thêm <code>--privileged</code> để sửa lỗi quyền" là cách sửa tệ nhất trong Docker.</p>
<p>➕ Thực hành tốt cho dịch vụ thật: chạy bằng <code>USER</code> không phải root trong Dockerfile; <code>--cap-drop ALL</code> rồi chỉ thêm lại thứ cần (một web server bind cổng 80 chỉ cần <code>NET_BIND_SERVICE</code>); thêm <code>--security-opt no-new-privileges</code> để chương trình setuid không nâng được đặc quyền; Kubernetes diễn đạt cùng ý bằng <code>securityContext.capabilities</code>, <code>runAsNonRoot</code> và <code>allowPrivilegeEscalation: false</code>.</p>
<p class="pitfall">⚠️ Khi đọc danh sách mặc định, để ý cái ĐƯỢC giữ: <code>CAP_DAC_OVERRIDE</code> (root bỏ qua quyền tệp), <code>CAP_SETUID</code>, <code>CAP_NET_RAW</code> (gói tin thô, giả mạo ARP trên bridge). "Root trong container" yếu hơn root của máy chủ, chứ không vô hại.</p>`],
      [20, 'seccomp, and when strace really needs SYS_PTRACE',
        `<p class="y-chinh">🎯 <strong>seccomp</strong> is a system-call filter loaded into the process (<code>Seccomp: 2</code>). Docker's default profile allows a list and blocks around 44 calls; here it alone blocks <code>unshare(CLONE_NEWUSER)</code> (EPERM) which works with <code>seccomp=unconfined</code>. <code>strace</code> = <code>ptrace()</code>: allowed since kernel 4.8, but attaching to a process with <strong>other credentials</strong> needs <code>CAP_SYS_PTRACE</code>; on Ubuntu hosts Yama <code>ptrace_scope=1</code> adds "only your children".</p>
<div class="out"># Slide 20: Docker's default seccomp filter — Seccomp: 2 — refuses a user namespace even though the kernel would allow it<br>
$ grep '^Seccomp:' /proc/self/status<br>
Seccomp:	2<br>
$ unshare --user --map-root-user id<br>
unshare: unshare failed: Operation not permitted<br>
$ strace -f -e trace=unshare unshare --user true 2&gt;&amp;1 | head -2<br>
unshare(CLONE_NEWUSER) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= -1 EPERM (Operation not permitted)<br>
unshare: unshare failed: Operation not permitted</div>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--security-opt=seccomp=unconfined</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 20: the same command with the filter switched off<br>
$ grep '^Seccomp:' /proc/self/status<br>
Seccomp:	0<br>
$ unshare --user --map-root-user id<br>
uid=0(root) gid=0(root) groups=0(root)</div>
<p>The first run is a default container: <code>Seccomp: 2</code> means "filter mode" — a small BPF program, installed by runc just before <code>execve</code>, inspects every system call number and argument and decides allow / return an error / kill. <code>unshare --user</code> fails, and <code>strace</code> shows exactly where: <code>unshare(CLONE_NEWUSER) = -1 EPERM</code>. The kernel itself would allow it (user namespaces are unprivileged — slide 11); the second run, with <code>--security-opt seccomp=unconfined</code> and nothing else changed, gets <code>uid=0(root)</code>. So the filter, not the capability set, is the wall here. Docker blocks it because new user namespaces expose a lot of kernel code to unprivileged users and have been the starting point of several container escapes. (Docker's documentation table lists <code>unshare --user</code> as an exception — measured on Docker 29.8, both on the Mac in Phase A and in this runner, the call is refused; trust the measurement and check your own version.)</p>
<p>Docker's default profile (docs.docker.com, <em>Seccomp security profiles</em>) blocks among others <code>mount</code>, <code>umount</code>, <code>reboot</code>, <code>kexec_load</code>, <code>init_module</code>, <code>bpf</code>, <code>keyctl</code>, <code>add_key</code>, <code>open_by_handle_at</code> (used by the 2014 "Shocker" escape) and clock changes. Kubernetes did not apply any seccomp profile by default for years; today you opt in with <code>seccompProfile: RuntimeDefault</code> in the pod's security context.</p>
<div class="out"># Slide 20: root traces a root process (fine) and a process of another user (refused without CAP_SYS_PTRACE)<br>
$ sleep 30 &amp;<br>
$ P=$(jobs -p %1); timeout 1 strace -p $P 2&gt;&amp;1 | head -1<br>
strace: Process 9 attached<br>
$ setpriv --reuid=1000 --regid=1000 --clear-groups sleep 30 &amp;<br>
$ P=$(jobs -p %1); ps -o user=,pid=,comm= -p $P; timeout 1 strace -p $P 2&gt;&amp;1 | head -1<br>
sv &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22 sleep<br>
strace: attach: ptrace(PTRACE_SEIZE, 22): Operation not permitted</div>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_PTRACE</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 20: the same attach with --cap-add SYS_PTRACE<br>
$ setpriv --reuid=1000 --regid=1000 --clear-groups sleep 30 &amp;<br>
$ P=$(jobs -p %1); timeout 1 strace -p $P 2&gt;&amp;1 | head -1<br>
strace: Process 9 attached</div>
<p>Now the old belief "strace in Docker needs <code>--cap-add SYS_PTRACE</code>". Measured: root in a default container attaches to another root process without problem — <code>strace: Process 9 attached</code>. Attaching to a process running as user <code>sv</code> fails: <code>ptrace(PTRACE_SEIZE, 22): Operation not permitted</code>. The kernel's rule (<code>ptrace(2)</code>, access mode checks): the tracer must have the same uid/gid as the target, or hold <code>CAP_SYS_PTRACE</code>. Root in a container lacks that capability, so a different uid is enough to block it — and that is exactly the production case, because good images run the app as a non-root <code>USER</code> while <code>docker exec</code> gives you root. With <code>--cap-add SYS_PTRACE</code> the attach works. Where the belief comes from: before kernel 4.8 Docker's seccomp profile blocked <code>ptrace</code> completely; and on Ubuntu hosts the Yama security module with <code>ptrace_scope = 1</code> allows attaching only to your own descendants unless you hold <code>CAP_SYS_PTRACE</code> — and a process started by <code>docker exec</code> is never a parent of the container's PID 1. This kernel (Docker Desktop) has no Yama, so we could not reproduce that part; read <code>/proc/sys/kernel/yama/ptrace_scope</code> on your server.</p>
<p class="pitfall">⚠️ Debugging a production container: prefer <code>nsenter -t &lt;pid&gt; -p -n</code> + strace <em>from the host</em>, or a short-lived debug container sharing the PID namespace (<code>docker run --pid container:web --cap-add SYS_PTRACE …</code>, <code>kubectl debug --profile=general</code>) instead of adding <code>SYS_PTRACE</code> to the application container permanently.</p>`,
        `<p class="y-chinh">🎯 <strong>seccomp</strong> là một bộ lọc lời gọi hệ thống nạp vào tiến trình (<code>Seccomp: 2</code>). Hồ sơ mặc định của Docker cho phép một danh sách và chặn khoảng 44 lời gọi; ở đây chỉ riêng nó đã chặn <code>unshare(CLONE_NEWUSER)</code> (EPERM), lệnh chạy được khi <code>seccomp=unconfined</code>. <code>strace</code> = <code>ptrace()</code>: được phép từ nhân 4.8, nhưng gắn vào một tiến trình mang <strong>danh tính khác</strong> cần <code>CAP_SYS_PTRACE</code>; trên máy chủ Ubuntu, Yama <code>ptrace_scope=1</code> thêm luật "chỉ con của bạn".</p>
<div class="out"># Slide 20: bộ lọc seccomp mặc định của Docker — Seccomp: 2 — từ chối user namespace dù nhân cho phép<br>
$ grep '^Seccomp:' /proc/self/status<br>
Seccomp:	2<br>
$ unshare --user --map-root-user id<br>
unshare: unshare failed: Operation not permitted<br>
$ strace -f -e trace=unshare unshare --user true 2&gt;&amp;1 | head -2<br>
unshare(CLONE_NEWUSER) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= -1 EPERM (Operation not permitted)<br>
unshare: unshare failed: Operation not permitted</div>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--security-opt=seccomp=unconfined</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 20: cùng lệnh đó khi tắt bộ lọc<br>
$ grep '^Seccomp:' /proc/self/status<br>
Seccomp:	0<br>
$ unshare --user --map-root-user id<br>
uid=0(root) gid=0(root) groups=0(root)</div>
<p>Lần chạy thứ nhất là một container mặc định: <code>Seccomp: 2</code> nghĩa là "chế độ lọc" — một chương trình BPF nhỏ, runc cài vào ngay trước <code>execve</code>, soi số hiệu và đối số của mọi lời gọi hệ thống rồi quyết định cho phép / trả lỗi / giết. <code>unshare --user</code> thất bại, và <code>strace</code> chỉ đúng chỗ: <code>unshare(CLONE_NEWUSER) = -1 EPERM</code>. Bản thân nhân sẽ cho phép (user namespace không cần đặc quyền — slide 11); lần chạy thứ hai, với <code>--security-opt seccomp=unconfined</code> và không đổi gì khác, nhận <code>uid=0(root)</code>. Vậy bức tường ở đây là bộ lọc, không phải tập capability. Docker chặn nó vì user namespace mới phơi nhiều mã của nhân ra cho người dùng không đặc quyền và từng là điểm xuất phát của vài vụ thoát khỏi container. (Bảng trong tài liệu Docker ghi <code>unshare --user</code> là ngoại lệ — đo thật trên Docker 29.8, cả trên máy Mac ở Pha A lẫn trong bộ chạy này, lời gọi bị từ chối; hãy tin số đo và kiểm phiên bản của chính bạn.)</p>
<p>Hồ sơ mặc định của Docker (docs.docker.com, <em>Seccomp security profiles</em>) chặn, trong số nhiều cái khác, <code>mount</code>, <code>umount</code>, <code>reboot</code>, <code>kexec_load</code>, <code>init_module</code>, <code>bpf</code>, <code>keyctl</code>, <code>add_key</code>, <code>open_by_handle_at</code> (từng được vụ thoát "Shocker" năm 2014 dùng) và các lệnh đổi đồng hồ. Kubernetes nhiều năm liền mặc định không áp hồ sơ seccomp nào; ngày nay bạn tự bật bằng <code>seccompProfile: RuntimeDefault</code> trong security context của pod.</p>
<div class="out"># Slide 20: root theo dõi một tiến trình của root (được) và của người dùng khác (bị từ chối nếu thiếu CAP_SYS_PTRACE)<br>
$ sleep 30 &amp;<br>
$ P=$(jobs -p %1); timeout 1 strace -p $P 2&gt;&amp;1 | head -1<br>
strace: Process 9 attached<br>
$ setpriv --reuid=1000 --regid=1000 --clear-groups sleep 30 &amp;<br>
$ P=$(jobs -p %1); ps -o user=,pid=,comm= -p $P; timeout 1 strace -p $P 2&gt;&amp;1 | head -1<br>
sv &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22 sleep<br>
strace: attach: ptrace(PTRACE_SEIZE, 22): Operation not permitted</div>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_PTRACE</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 20: cùng lần gắn vào đó khi có --cap-add SYS_PTRACE<br>
$ setpriv --reuid=1000 --regid=1000 --clear-groups sleep 30 &amp;<br>
$ P=$(jobs -p %1); timeout 1 strace -p $P 2&gt;&amp;1 | head -1<br>
strace: Process 9 attached</div>
<p>Giờ tới niềm tin cũ "strace trong Docker cần <code>--cap-add SYS_PTRACE</code>". Đo thật: root trong container mặc định gắn vào một tiến trình root khác không vấn đề gì — <code>strace: Process 9 attached</code>. Gắn vào một tiến trình chạy bằng người dùng <code>sv</code> thì thất bại: <code>ptrace(PTRACE_SEIZE, 22): Operation not permitted</code>. Luật của nhân (<code>ptrace(2)</code>, kiểm tra chế độ truy cập): bên theo dõi phải cùng uid/gid với tiến trình đích, hoặc giữ <code>CAP_SYS_PTRACE</code>. Root trong container thiếu capability đó, nên chỉ cần khác uid là bị chặn — và đó chính là tình huống production, vì image tốt chạy app bằng một <code>USER</code> không phải root trong khi <code>docker exec</code> cho bạn root. Có <code>--cap-add SYS_PTRACE</code> thì gắn được. Niềm tin kia đến từ đâu: trước nhân 4.8 hồ sơ seccomp của Docker chặn hẳn <code>ptrace</code>; và trên máy chủ Ubuntu, mô-đun bảo mật Yama với <code>ptrace_scope = 1</code> chỉ cho gắn vào hậu duệ của chính bạn trừ khi có <code>CAP_SYS_PTRACE</code> — mà tiến trình do <code>docker exec</code> khởi động không bao giờ là cha của PID 1 trong container. Nhân này (Docker Desktop) không có Yama nên ta không tái hiện được phần đó; hãy đọc <code>/proc/sys/kernel/yama/ptrace_scope</code> trên server của bạn.</p>
<p class="pitfall">⚠️ Gỡ lỗi một container production: ưu tiên <code>nsenter -t &lt;pid&gt; -p -n</code> + strace <em>từ máy chủ</em>, hoặc một container gỡ lỗi sống ngắn dùng chung PID namespace (<code>docker run --pid container:web --cap-add SYS_PTRACE …</code>, <code>kubectl debug --profile=general</code>) thay vì gắn vĩnh viễn <code>SYS_PTRACE</code> cho container ứng dụng.</p>`],
      [21, 'Tiny container (1/2): the root filesystem',
        `<p class="y-chinh">🎯 Build it yourself, part 1: a container image is, in the end, <strong>just a directory tree</strong>. The slide fills it with one static <code>busybox</code> (one binary acting as <code>sh</code>, <code>ps</code>, <code>ls</code>… by its name) and makes <code>/dev/null</code> by hand with <code>mknod</code> (character device 1,3).</p>
<p>The script on the slides, <code>tiny-container.sh</code>, has four steps; this slide is step 1. The course image has no <code>busybox</code>, so the runner's version builds the same directory the other classic way — copy each program <em>and every shared library it needs</em>, found with <code>ldd</code>:</p>
<pre class="trich"><code class="language-bash"># 1) root filesystem: copy a few programs AND the libraries they need (ldd)
if [ ! -x "$ROOT/bin/bash" ]; then
  mkdir -p "$ROOT"/{bin,dev,proc,sys,tmp,etc}
  for p in bash sh ls cat ps hostname id mount sleep ip seq; do
    b=$(command -v $p); cp "$b" "$ROOT/bin/"
    for l in $(ldd "$b" | grep -o '/[^ ]*'); do cp --parents -n "$l" "$ROOT"; done
  done
  echo "root:x:0:0::/:/bin/sh" &gt; "$ROOT/etc/passwd"
  mknod -m 666 "$ROOT/dev/null" c 1 3
fi</code></pre>
<p>Line by line. <code>mkdir -p "$ROOT"/{bin,dev,proc,sys,tmp,etc}</code> creates the skeleton every Linux program expects: <code>/proc</code> and <code>/sys</code> as empty mount points (filled at start-up), <code>/tmp</code> for scratch files, <code>/etc</code> for configuration. The loop copies eleven programs; for each, <code>ldd</code> prints the libraries the dynamic loader would load (<code>libc.so.6</code>, <code>libtinfo.so.6</code> for bash, <code>libproc2.so.0</code> for ps, the loader <code>ld-linux-aarch64.so.1</code> itself…) and <code>cp --parents</code> copies each one to the same path under <code>$ROOT</code>. Without them, <code>chroot</code> would fail with the famous, confusing <code>No such file or directory</code> — the program exists, its loader does not. <code>/etc/passwd</code> gets one line so <code>id</code> can name uid 0. Finally <code>mknod -m 666 "$ROOT/dev/null" c 1 3</code>: <code>/dev/null</code> is not a regular file but a <strong>character device</strong> with major number 1 and minor 3, implemented inside the kernel; shells redirect to it all the time (a background job's stdin, for instance), so without it simple commands break — the first run of this lab, made on the bind-mounted <code>/w</code> folder (a folder of the Mac, which refuses device files), printed <code>cannot open /dev/null</code> for every <code>&amp;</code>; the final version works on a tmpfs.</p>
<p>The result in the run of slide 23: <code>du -sh rootfs</code> = <strong>12M</strong> for eleven programs and their libraries — the same order of size as <code>alpine</code> (about 8 MB), and tiny compared with a VM disk. That is the whole "image": no kernel, no init system, no package manager unless you put one there.</p>
<p>➕ Real image formats add only bookkeeping on top of this idea: an OCI image is a list of tar archives (layers) plus a JSON config (entrypoint, environment, user, exposed ports). <code>docker export</code> of any container gives you exactly such a directory tree as a tar; <code>docker image save</code> gives the layers separately. "Distroless" and <code>scratch</code> images push the idea to the end: <code>FROM scratch</code> + one static Go binary is a valid image with one file.</p>
<p class="meo">🧠 Try at home: <code>docker export $(docker create alpine) | tar -t | head</code> lists the files of the Alpine image — open the tar and you will find nothing but an ordinary Linux directory tree.</p>`,
        `<p class="y-chinh">🎯 Tự dựng, phần 1: rốt cuộc một image container <strong>chỉ là một cây thư mục</strong>. Slide lấp nó bằng một tệp <code>busybox</code> tĩnh (một chương trình đóng vai <code>sh</code>, <code>ps</code>, <code>ls</code>… tuỳ theo tên được gọi) và tự tạo <code>/dev/null</code> bằng <code>mknod</code> (thiết bị ký tự 1,3).</p>
<p>Script trên slide, <code>tiny-container.sh</code>, có bốn bước; slide này là bước 1. Image của môn học không có <code>busybox</code>, nên bản của bộ chạy dựng cùng thư mục đó theo cách kinh điển còn lại — chép từng chương trình <em>và mọi thư viện dùng chung (shared library) nó cần</em>, tìm bằng <code>ldd</code>:</p>
<pre class="trich"><code class="language-bash"># 1) root filesystem: copy a few programs AND the libraries they need (ldd)
if [ ! -x "$ROOT/bin/bash" ]; then
  mkdir -p "$ROOT"/{bin,dev,proc,sys,tmp,etc}
  for p in bash sh ls cat ps hostname id mount sleep ip seq; do
    b=$(command -v $p); cp "$b" "$ROOT/bin/"
    for l in $(ldd "$b" | grep -o '/[^ ]*'); do cp --parents -n "$l" "$ROOT"; done
  done
  echo "root:x:0:0::/:/bin/sh" &gt; "$ROOT/etc/passwd"
  mknod -m 666 "$ROOT/dev/null" c 1 3
fi</code></pre>
<p>Từng dòng một. <code>mkdir -p "$ROOT"/{bin,dev,proc,sys,tmp,etc}</code> tạo bộ khung mà mọi chương trình Linux chờ đợi: <code>/proc</code> và <code>/sys</code> là các điểm mount rỗng (lấp vào lúc khởi động), <code>/tmp</code> cho tệp nháp, <code>/etc</code> cho cấu hình. Vòng lặp chép mười một chương trình; với mỗi cái, <code>ldd</code> in ra các thư viện mà bộ nạp động (dynamic loader) sẽ nạp (<code>libc.so.6</code>, <code>libtinfo.so.6</code> cho bash, <code>libproc2.so.0</code> cho ps, chính bộ nạp <code>ld-linux-aarch64.so.1</code>…) và <code>cp --parents</code> chép mỗi cái vào đúng đường dẫn đó bên dưới <code>$ROOT</code>. Thiếu chúng, <code>chroot</code> sẽ hỏng với thông báo nổi tiếng và khó hiểu <code>No such file or directory</code> — chương trình có đó, bộ nạp của nó thì không. <code>/etc/passwd</code> có một dòng để <code>id</code> gọi được tên uid 0. Cuối cùng <code>mknod -m 666 "$ROOT/dev/null" c 1 3</code>: <code>/dev/null</code> không phải tệp thường mà là một <strong>thiết bị ký tự</strong> (character device) có số chính (major) 1 và số phụ (minor) 3, hiện thực ngay trong nhân; shell chuyển hướng vào nó suốt (ví dụ stdin của một job chạy nền), nên thiếu nó thì những lệnh đơn giản cũng hỏng — lần chạy đầu tiên của bài lab này, làm trên thư mục <code>/w</code> gắn từ máy Mac (từ chối tệp thiết bị), in ra <code>cannot open /dev/null</code> cho mọi dấu <code>&amp;</code>; bản cuối làm trên tmpfs.</p>
<p>Kết quả trong lần chạy ở slide 23: <code>du -sh rootfs</code> = <strong>12M</strong> cho mười một chương trình cùng thư viện của chúng — cùng cỡ với <code>alpine</code> (khoảng 8 MB), và tí hon so với ổ đĩa của một máy ảo. Đó là toàn bộ "image": không nhân, không hệ thống init, không trình quản lý gói trừ khi bạn tự bỏ vào.</p>
<p>➕ Các định dạng image thật chỉ thêm phần sổ sách lên ý tưởng này: một image OCI là một danh sách các tệp tar (các lớp) cộng một cấu hình JSON (entrypoint, biến môi trường, người dùng, cổng mở). <code>docker export</code> một container bất kỳ cho bạn đúng một cây thư mục như thế dưới dạng tar; <code>docker image save</code> cho các lớp riêng rẽ. Image "distroless" và <code>scratch</code> đẩy ý tưởng tới tận cùng: <code>FROM scratch</code> + một tệp Go tĩnh là một image hợp lệ chỉ có một tệp.</p>
<p class="meo">🧠 Thử ở nhà: <code>docker export $(docker create alpine) | tar -t | head</code> liệt kê các tệp của image Alpine — mở tệp tar ra bạn sẽ chẳng thấy gì ngoài một cây thư mục Linux bình thường.</p>`],
      [22, 'Tiny container (2/2): limits + namespaces',
        `<p class="y-chinh">🎯 Part 2 of the script follows the same order as runc (slide 6): <strong>mkdir a cgroup and write limits</strong> (32 MB, no swap, 20 tasks, half a CPU) → move itself into it → <strong>unshare</strong> six new namespaces → <strong>chroot</strong> into the rootfs → <code>sh</code> as PID 1 mounts <code>/proc</code>, sets the hostname → <strong>exec</strong> your command → clean up.</p>
<pre class="trich"><code class="language-bash"># 2) limits: 32 MB RAM, no swap, 20 tasks, half a CPU
C=/sys/fs/cgroup; CG=$C/tiny-$$
echo "+memory +pids +cpu" &gt; $C/cgroup.subtree_control || :
mkdir $CG
echo 32M &gt; $CG/memory.max;  echo 0 &gt; $CG/memory.swap.max
echo 20  &gt; $CG/pids.max;    echo "50000 100000" &gt; $CG/cpu.max
echo $$  &gt; $CG/cgroup.procs        # me + all my children</code></pre>
<p><strong>Step 2 — limits.</strong> One cgroup per run, named after the script's PID (<code>tiny-$$</code>). The first <code>echo</code> enables the three controllers for children of the root (it may already be enabled — <code>|| :</code> ignores the error). Then four writes are the whole resource policy, exactly the files of slides 13–15: <code>memory.max</code> 32M, <code>memory.swap.max</code> 0 (no swap surprise — slide 17), <code>pids.max</code> 20, <code>cpu.max</code> "50000 100000". The last line is the trick that makes it a container rather than a single process: the script writes <strong>its own PID</strong> into <code>cgroup.procs</code>, so everything it starts afterwards — unshare, chroot, the shell, every child of the shell — is born inside the cgroup and can never leave it (only a privileged process outside could move it).</p>
<pre class="trich"><code class="language-bash"># 3) new PID, mount, UTS, IPC, net, cgroup namespaces
set +e
unshare --pid --mount --uts --ipc --net --cgroup --fork \\
  chroot "$ROOT" /bin/sh -c \\
  'mount -t proc proc /proc; hostname tiny; exec "$@"' sh "$@"
rc=$?
# 4) clean up: leave the cgroup, delete it
echo $$ &gt; $C/init/cgroup.procs || echo $$ &gt; $C/cgroup.procs
rmdir $CG; exit $rc</code></pre>
<p><strong>Step 3 — namespaces and the new root.</strong> <code>unshare</code> asks for six new namespaces — pid, mount, uts, ipc, net, cgroup — and <code>--fork</code> so the child becomes PID 1 (slide 8). That child runs <code>chroot "$ROOT" /bin/sh -c '…'</code>: from now on "/" is the rootfs directory, and <code>/bin/sh</code> is the copied shell. The little inline script is what runc and an init do for a real container: <code>mount -t proc proc /proc</code> gives the new PID namespace its own <code>/proc</code> (without it, <code>ps</code> breaks — slide 8), <code>hostname tiny</code> works because the UTS namespace is private, and <code>exec "$@"</code> <em>replaces</em> the shell by your command, so your program becomes PID 1 — the container's main process — just like the exec form of a Dockerfile's <code>CMD</code>. <code>set +e</code> keeps the script alive when the command fails, so step 4 always runs.</p>
<p><strong>Step 4 — clean-up.</strong> The script moves itself back out (into <code>init/</code> in the course container, or the root cgroup on a normal host) and removes the now-empty cgroup directory with <code>rmdir</code> — a cgroup can be removed only when no process is left in it. It exits with the command's exit code, so <code>137</code> after an OOM kill reaches whoever called it, as with <code>docker run</code>.</p>
<p>➕ What real runtimes do on top: <code>pivot_root</code> instead of <code>chroot</code> (chroot can be escaped by a root process with <code>CAP_SYS_CHROOT</code>; pivot_root swaps the mount root and unmounts the old one), dropping capabilities and loading seccomp (slides 19–20), a veth pair for networking (slide 9), the overlay mount of the image layers (slide 18), and a user namespace in rootless mode (slide 11). Each is a few more lines — the shape of the program stays the same.</p>
<p class="pitfall">⚠️ This script is for learning. Do not run untrusted code in it: <code>chroot</code> + all 41 capabilities (it runs as real root) means the "container" can remount, load modules, or simply <code>chroot</code> back out.</p>`,
        `<p class="y-chinh">🎯 Phần 2 của script đi đúng thứ tự như runc (slide 6): <strong>tạo thư mục cgroup và ghi giới hạn</strong> (32 MB, không swap, 20 tác vụ, nửa CPU) → tự dời mình vào đó → <strong>unshare</strong> sáu namespace mới → <strong>chroot</strong> vào rootfs → <code>sh</code> làm PID 1 mount <code>/proc</code>, đặt hostname → <strong>exec</strong> lệnh của bạn → dọn dẹp.</p>
<pre class="trich"><code class="language-bash"># 2) limits: 32 MB RAM, no swap, 20 tasks, half a CPU
C=/sys/fs/cgroup; CG=$C/tiny-$$
echo "+memory +pids +cpu" &gt; $C/cgroup.subtree_control || :
mkdir $CG
echo 32M &gt; $CG/memory.max;  echo 0 &gt; $CG/memory.swap.max
echo 20  &gt; $CG/pids.max;    echo "50000 100000" &gt; $CG/cpu.max
echo $$  &gt; $CG/cgroup.procs        # me + all my children</code></pre>
<p><strong>Bước 2 — giới hạn.</strong> Mỗi lần chạy một cgroup, đặt tên theo PID của script (<code>tiny-$$</code>). Lệnh <code>echo</code> đầu tiên bật ba controller cho các con của gốc (có thể đã bật sẵn — <code>|| :</code> bỏ qua lỗi). Rồi bốn lần ghi là toàn bộ chính sách tài nguyên, đúng các tệp của slide 13–15: <code>memory.max</code> 32M, <code>memory.swap.max</code> 0 (không có bất ngờ về swap — slide 17), <code>pids.max</code> 20, <code>cpu.max</code> "50000 100000". Dòng cuối là mánh biến nó thành một container thay vì một tiến trình đơn lẻ: script ghi <strong>chính PID của nó</strong> vào <code>cgroup.procs</code>, nên mọi thứ nó khởi động sau đó — unshare, chroot, shell, mọi con của shell — đều sinh ra bên trong cgroup và không bao giờ rời đi được (chỉ một tiến trình có đặc quyền ở bên ngoài mới dời được nó).</p>
<pre class="trich"><code class="language-bash"># 3) new PID, mount, UTS, IPC, net, cgroup namespaces
set +e
unshare --pid --mount --uts --ipc --net --cgroup --fork \\
  chroot "$ROOT" /bin/sh -c \\
  'mount -t proc proc /proc; hostname tiny; exec "$@"' sh "$@"
rc=$?
# 4) clean up: leave the cgroup, delete it
echo $$ &gt; $C/init/cgroup.procs || echo $$ &gt; $C/cgroup.procs
rmdir $CG; exit $rc</code></pre>
<p><strong>Bước 3 — namespace và gốc mới.</strong> <code>unshare</code> xin sáu namespace mới — pid, mount, uts, ipc, net, cgroup — kèm <code>--fork</code> để con thành PID 1 (slide 8). Đứa con đó chạy <code>chroot "$ROOT" /bin/sh -c '…'</code>: từ đây "/" là thư mục rootfs, và <code>/bin/sh</code> là shell đã chép vào. Đoạn script nhỏ viết liền là việc runc và một init làm cho container thật: <code>mount -t proc proc /proc</code> cho PID namespace mới một <code>/proc</code> riêng (thiếu nó, <code>ps</code> hỏng — slide 8), <code>hostname tiny</code> chạy được vì UTS namespace là riêng, và <code>exec "$@"</code> <em>thay</em> shell bằng lệnh của bạn, nên chương trình của bạn thành PID 1 — tiến trình chính của container — y như dạng exec của <code>CMD</code> trong Dockerfile. <code>set +e</code> giữ script sống khi lệnh thất bại, để bước 4 lúc nào cũng chạy.</p>
<p><strong>Bước 4 — dọn dẹp.</strong> Script tự dời ra ngoài (vào <code>init/</code> trong container của môn học, hoặc cgroup gốc trên một máy chủ bình thường) và xoá thư mục cgroup giờ đã rỗng bằng <code>rmdir</code> — một cgroup chỉ xoá được khi không còn tiến trình nào bên trong. Nó thoát với mã thoát của lệnh, nên <code>137</code> sau một lần OOM-kill tới được tay người gọi, như với <code>docker run</code>.</p>
<p>➕ Những gì runtime thật làm thêm: <code>pivot_root</code> thay cho <code>chroot</code> (một tiến trình root có <code>CAP_SYS_CHROOT</code> thoát được khỏi chroot; pivot_root đổi gốc của bảng mount rồi gỡ gốc cũ), bỏ bớt capability và nạp seccomp (slide 19–20), một cặp veth cho mạng (slide 9), điểm mount overlay của các lớp image (slide 18), và một user namespace ở chế độ rootless (slide 11). Mỗi thứ thêm vài dòng — hình dạng chương trình vẫn y nguyên.</p>
<p class="pitfall">⚠️ Script này để học. Đừng chạy mã không tin cậy trong nó: <code>chroot</code> + đủ 41 capability (nó chạy bằng root thật) nghĩa là "container" có thể mount lại, nạp module, hay đơn giản là <code>chroot</code> ngược ra ngoài.</p>`],
      [23, 'The tiny container runs — every line is real output',
        `<p class="y-chinh">🎯 The tiny container works: own hostname <code>tiny</code>, its own process table where <code>sh</code> is PID 1, an empty network (only a DOWN loopback), its own cgroup root with exactly the limits written, a loop of 30 background jobs stopped at the 20-task limit, and a memory hog killed with 137 — while outside, nothing changed and nothing is left behind.</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slides 21–23: the tiny container, run for real (rootfs made with ldd — the course image has no busybox)<br>
# the lab works on a tmpfs: the bind-mounted /w (a folder of the Mac) refuses device files such as /dev/null<br>
$ ./tiny rootfs sh -c 'hostname; id; ls /'<br>
tiny<br>
uid=0(root) gid=0 groups=0<br>
bin<br>
dev<br>
etc<br>
lib<br>
proc<br>
sys<br>
tmp<br>
$ du -sh rootfs | cut -f1<br>
12M<br>
$ ./tiny rootfs sh -c 'sleep 5 &amp; sleep 0.3; ps -o pid,ppid,comm; kill $!'<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 sh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ps<br>
$ ./tiny rootfs ip -br link | grep -v @NONE<br>
lo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DOWN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00:00:00:00 &lt;LOOPBACK&gt;<br>
$ ./tiny rootfs sh -c 'cat /proc/self/cgroup; mount -t cgroup2 none /sys; cat /sys/memory.max /sys/pids.max /sys/cpu.max'<br>
0::/<br>
33554432<br>
20<br>
50000 100000<br>
$ ./tiny rootfs sh -c 'for i in $(seq 30); do sleep 2 &amp; echo $i &gt; /tmp/n; done; wait'<br>
sh: 0: Cannot fork<br>
$ ./tiny rootfs cat /tmp/n<br>
17<br>
$ ./tiny rootfs sh -c 'eat; echo eat exit=$?' | tail -3<br>
Killed<br>
allocated 20 MiB<br>
allocated 30 MiB<br>
eat exit=137<br>
$ hostname; ls /sys/fs/cgroup | grep -c tiny<br>
osg-lab<br>
0</div>
<p>Command by command. <strong>Identity:</strong> <code>hostname</code> prints <code>tiny</code>, <code>id</code> says uid 0, and <code>ls /</code> shows only the skeleton we built (plus <code>lib</code> with the copied libraries) — the course container's own files are invisible. <strong>Size:</strong> 12M. <strong>Processes:</strong> inside, <code>sh</code> is PID 1 with PPID 0, <code>sleep</code> is its child PID 4 and <code>ps</code> PID 6 — the gaps are the short-lived processes of <code>mount</code> and <code>hostname</code> at start-up. <strong>Network:</strong> only <code>lo</code>, DOWN. <strong>Cgroup:</strong> <code>/proc/self/cgroup</code> says <code>0::/</code> — thanks to the new cgroup namespace, the container cannot even see where it sits on the host; mounting <code>cgroup2</code> on <code>/sys</code> and reading the files returns exactly what step 2 wrote: 33554432 (32 MiB), 20, <code>50000 100000</code>.</p>
<p><strong>pids.max at work.</strong> The loop tries to start 30 background <code>sleep</code>s; dash (the copied <code>sh</code>) reports <code>Cannot fork</code> and the last number written to <code>/tmp/n</code> is <strong>17</strong>: 17 sleeps + the script + <code>unshare</code> + <code>sh</code> = 20 tasks = <code>pids.max</code>. (The slide image, made with busybox, shows the same "can't fork" and the same 17.) <strong>memory.max at work.</strong> The static <code>eat</code> program reaches 30 MiB and the next 10 MiB crosses 32 MiB with no swap: <code>Killed</code>, and the shell inside reports <code>eat exit=137</code>. <strong>Outside:</strong> the hostname is still <code>osg-lab</code> and no <code>tiny-*</code> cgroup remains — step 4 cleaned up after every run.</p>
<p>➕ Compare with the four ingredients of slide 6: ① namespaces — six of them, ② cgroups — four limits, ③ root filesystem — the copied tree, ④ privileges — <em>not done</em> (that is what our script lacks against a real runtime). Everything Docker adds on top is convenience and safety: images with layers instead of a hand-made directory, networking, logging, restart policies, a registry, and an API. Understanding the bottom layer is what lets you debug the top.</p>
<p class="meo">🧠 Extend it as an exercise: add <code>--user --map-root-user</code> to the <code>unshare</code> line and run the script as an ordinary user (on a host whose seccomp allows it) — you have just built a rootless container. Or replace <code>chroot</code> with <code>pivot_root</code> and see what else must be mounted first.</p>`,
        `<p class="y-chinh">🎯 Container tí hon chạy được: hostname riêng <code>tiny</code>, bảng tiến trình riêng trong đó <code>sh</code> là PID 1, mạng trống (chỉ một loopback đang DOWN), gốc cgroup riêng với đúng các giới hạn đã ghi, một vòng lặp 30 job nền bị chặn ở giới hạn 20 tác vụ, và một chương trình ngốn bộ nhớ bị giết với mã 137 — trong khi bên ngoài không gì thay đổi và không gì bị bỏ sót lại.</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 21–23: container tí hon, chạy thật (rootfs dựng bằng ldd — ảnh của môn không có busybox)<br>
# bài làm trên tmpfs: /w gắn từ thư mục của máy Mac từ chối tệp thiết bị như /dev/null<br>
$ ./tiny rootfs sh -c 'hostname; id; ls /'<br>
tiny<br>
uid=0(root) gid=0 groups=0<br>
bin<br>
dev<br>
etc<br>
lib<br>
proc<br>
sys<br>
tmp<br>
$ du -sh rootfs | cut -f1<br>
12M<br>
$ ./tiny rootfs sh -c 'sleep 5 &amp; sleep 0.3; ps -o pid,ppid,comm; kill $!'<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 sh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ps<br>
$ ./tiny rootfs ip -br link | grep -v @NONE<br>
lo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DOWN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00:00:00:00:00:00 &lt;LOOPBACK&gt;<br>
$ ./tiny rootfs sh -c 'cat /proc/self/cgroup; mount -t cgroup2 none /sys; cat /sys/memory.max /sys/pids.max /sys/cpu.max'<br>
0::/<br>
33554432<br>
20<br>
50000 100000<br>
$ ./tiny rootfs sh -c 'for i in $(seq 30); do sleep 2 &amp; echo $i &gt; /tmp/n; done; wait'<br>
sh: 0: Cannot fork<br>
$ ./tiny rootfs cat /tmp/n<br>
17<br>
$ ./tiny rootfs sh -c 'eat; echo eat exit=$?' | tail -3<br>
Killed<br>
allocated 20 MiB<br>
allocated 30 MiB<br>
eat exit=137<br>
$ hostname; ls /sys/fs/cgroup | grep -c tiny<br>
osg-lab<br>
0</div>
<p>Từng lệnh một. <strong>Danh tính:</strong> <code>hostname</code> in <code>tiny</code>, <code>id</code> nói uid 0, và <code>ls /</code> chỉ hiện bộ khung ta đã dựng (thêm <code>lib</code> chứa các thư viện đã chép) — tệp của chính container môn học thì vô hình. <strong>Kích thước:</strong> 12M. <strong>Tiến trình:</strong> bên trong, <code>sh</code> là PID 1 với PPID 0, <code>sleep</code> là con của nó với PID 4 và <code>ps</code> PID 6 — các số bị nhảy là những tiến trình sống ngắn của <code>mount</code> và <code>hostname</code> lúc khởi động. <strong>Mạng:</strong> chỉ có <code>lo</code>, DOWN. <strong>Cgroup:</strong> <code>/proc/self/cgroup</code> nói <code>0::/</code> — nhờ cgroup namespace mới, container còn không thấy được mình nằm ở đâu trên máy chủ; mount <code>cgroup2</code> vào <code>/sys</code> rồi đọc các tệp thì nhận đúng thứ bước 2 đã ghi: 33554432 (32 MiB), 20, <code>50000 100000</code>.</p>
<p><strong>pids.max làm việc.</strong> Vòng lặp cố khởi động 30 <code>sleep</code> chạy nền; dash (cái <code>sh</code> đã chép) báo <code>Cannot fork</code> và số cuối cùng ghi vào <code>/tmp/n</code> là <strong>17</strong>: 17 sleep + script + <code>unshare</code> + <code>sh</code> = 20 tác vụ = <code>pids.max</code>. (Ảnh slide, làm bằng busybox, hiện cùng "can't fork" và cùng con số 17.) <strong>memory.max làm việc.</strong> Chương trình tĩnh <code>eat</code> đi tới 30 MiB và 10 MiB tiếp theo vượt 32 MiB khi không có swap: <code>Killed</code>, và shell bên trong báo <code>eat exit=137</code>. <strong>Bên ngoài:</strong> hostname vẫn là <code>osg-lab</code> và không còn cgroup <code>tiny-*</code> nào — bước 4 đã dọn sau mỗi lần chạy.</p>
<p>➕ So với bốn nguyên liệu ở slide 6: ① namespace — sáu cái, ② cgroup — bốn giới hạn, ③ hệ thống tệp gốc — cây thư mục đã chép, ④ đặc quyền — <em>chưa làm</em> (đó là thứ script của ta còn thiếu so với một runtime thật). Mọi thứ Docker thêm lên trên là tiện lợi và an toàn: image có lớp thay cho thư mục tự dựng, mạng, ghi log, chính sách khởi động lại, registry, và một API. Hiểu tầng dưới cùng là thứ giúp bạn gỡ lỗi được tầng trên.</p>
<p class="meo">🧠 Mở rộng thành bài tập: thêm <code>--user --map-root-user</code> vào dòng <code>unshare</code> rồi chạy script bằng người dùng thường (trên máy mà seccomp cho phép) — bạn vừa dựng một container rootless. Hoặc thay <code>chroot</code> bằng <code>pivot_root</code> và xem còn phải mount gì trước.</p>`],
      [24, 'Traps',
        `<p class="y-chinh">🎯 Five beliefs that cause real incidents: "a container is a VM-grade security boundary", "permission denied? add <code>--privileged</code>", "<code>free -m</code> / <code>os.totalmem()</code> show my limit", "<code>--memory 512m</code> means never more than 512 MB", "<code>--cpus 1</code> means a slower CPU". Each has a measured correction in this deck.</p>
<p><strong>1. VM-grade boundary.</strong> All containers share one kernel (slides 3–5); one kernel bug reachable through an allowed system call is an escape for every container on the host. Keep the default seccomp profile (slide 20), drop capabilities, run as non-root or rootless (slides 11, 19); use a VM or a sandbox runtime (gVisor, Kata, Firecracker) when you run code you do not trust. <strong>2. <code>--privileged</code>.</strong> It removes almost every wall (41 capabilities, no seccomp, host devices — slide 19). Find the one capability or device the program really needs and grant only that.</p>
<p><strong>3. What a program "sees" inside a container.</strong> This is the trap that hurts JVM and Node services most; measured in a container with <code>--memory 128m</code>:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--memory=128m</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 24 · exercise 6: what does a program "see" inside a container limited to 128 MiB?<br>
$ free -m | awk 'NR==1 || NR==2 {print $1, $2}'<br>
total used<br>
Mem: 7934<br>
$ grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
$ cat /sys/fs/cgroup/memory.max<br>
134217728<br>
$ node -e 'const os = require("os"); console.log("os.totalmem() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=", os.totalmem()); console.log("process.constrainedMemory() =", process.constrainedMemory())'<br>
os.totalmem() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 8319504384<br>
process.constrainedMemory() = 134217728<br>
$ java -XX:+PrintFlagsFinal -version 2&gt;/dev/null | grep -E ' MaxHeapSize | MaxRAMPercentage | UseContainerSupport '<br>
&nbsp;&nbsp;&nbsp;size_t MaxHeapSize &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 67108864 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{product} {ergonomic}<br>
&nbsp;&nbsp;&nbsp;double MaxRAMPercentage &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 25.000000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{product} {default}<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bool UseContainerSupport &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{product} {default}</div>
<p><code>free -m</code> and <code>/proc/meminfo</code> print <strong>7934 MiB / 8124516 kB</strong> — the memory of the whole VM — because <code>/proc/meminfo</code> is not namespaced. The truth is <code>/sys/fs/cgroup/memory.max</code> = 134217728 (128 MiB). Node's <code>os.totalmem()</code> repeats the host value (8.3 GB); <code>process.constrainedMemory()</code> (Node 19.6+ / 18.15+) reads the cgroup and returns 134217728 — use it, or set <code>--max-old-space-size</code> explicitly (CS.5). The JVM is container-aware (<code>UseContainerSupport = true</code> since JDK 10): <code>MaxHeapSize = 67108864</code>, i.e. 64 MiB. Note it is <strong>50 %</strong>, not the 25 % of <code>MaxRAMPercentage</code>: for small memory (below roughly 250 MB) the JVM uses <code>MinRAMPercentage</code>, default 50 %. Either way, heap is not the whole process — metaspace, thread stacks, direct buffers and the JIT live outside it, so a JVM with heap = limit is killed with 137. Set <code>-XX:MaxRAMPercentage=60–75</code> and measure.</p>
<p><strong>4. <code>--memory 512m</code> is a hard ceiling.</strong> Only if <code>--memory-swap</code> is also 512m — otherwise another 512 MB of swap is allowed (slide 17). <strong>5. <code>--cpus 1</code> = slower CPU.</strong> It is a full-speed CPU for 100 ms of each 100 ms period <em>summed over all threads</em>: four threads exhaust it in 25 ms and wait (slide 15). Watch <code>nr_throttled</code>.</p>
<p class="pitfall">⚠️ One more, very common in tutorials: "the container is idle, so it uses no memory". Page cache from files it read is charged to its cgroup and counted in <code>memory.current</code>; it is reclaimable, so read <code>memory.stat</code> (anon vs file) before you raise a limit.</p>`,
        `<p class="y-chinh">🎯 Năm niềm tin gây ra sự cố thật: "container là bức tường bảo mật ngang máy ảo", "lỗi quyền à? thêm <code>--privileged</code>", "<code>free -m</code> / <code>os.totalmem()</code> cho thấy giới hạn của tôi", "<code>--memory 512m</code> nghĩa là không bao giờ quá 512 MB", "<code>--cpus 1</code> nghĩa là một CPU chậm hơn". Mỗi cái đều có một lời đính chính được đo thật trong deck này.</p>
<p><strong>1. Bức tường ngang máy ảo.</strong> Mọi container dùng chung một nhân (slide 3–5); một lỗi nhân chạm được qua một lời gọi hệ thống được phép là một lối thoát cho mọi container trên máy. Giữ hồ sơ seccomp mặc định (slide 20), bỏ bớt capability, chạy không phải root hoặc rootless (slide 11, 19); dùng máy ảo hoặc runtime hộp cát (gVisor, Kata, Firecracker) khi chạy mã bạn không tin. <strong>2. <code>--privileged</code>.</strong> Nó dỡ gần như mọi bức tường (41 capability, không seccomp, thiết bị của máy chủ — slide 19). Hãy tìm đúng một capability hay thiết bị mà chương trình thật sự cần và chỉ cấp cái đó.</p>
<p><strong>3. Chương trình "thấy" gì trong container.</strong> Đây là cái bẫy làm đau các dịch vụ JVM và Node nhất; đo trong một container có <code>--memory 128m</code>:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--memory=128m</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 24 · bài 6: một chương trình "thấy" gì bên trong container bị giới hạn 128 MiB?<br>
$ free -m | awk 'NR==1 || NR==2 {print $1, $2}'<br>
total used<br>
Mem: 7934<br>
$ grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
$ cat /sys/fs/cgroup/memory.max<br>
134217728<br>
$ node -e 'const os = require("os"); console.log("os.totalmem() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=", os.totalmem()); console.log("process.constrainedMemory() =", process.constrainedMemory())'<br>
os.totalmem() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 8319504384<br>
process.constrainedMemory() = 134217728<br>
$ java -XX:+PrintFlagsFinal -version 2&gt;/dev/null | grep -E ' MaxHeapSize | MaxRAMPercentage | UseContainerSupport '<br>
&nbsp;&nbsp;&nbsp;size_t MaxHeapSize &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 67108864 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{product} {ergonomic}<br>
&nbsp;&nbsp;&nbsp;double MaxRAMPercentage &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 25.000000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{product} {default}<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bool UseContainerSupport &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{product} {default}</div>
<p><code>free -m</code> và <code>/proc/meminfo</code> in <strong>7934 MiB / 8124516 kB</strong> — bộ nhớ của cả máy ảo — vì <code>/proc/meminfo</code> không được namespace hoá. Sự thật là <code>/sys/fs/cgroup/memory.max</code> = 134217728 (128 MiB). <code>os.totalmem()</code> của Node lặp lại giá trị của máy chủ (8,3 GB); <code>process.constrainedMemory()</code> (Node 19.6+ / 18.15+) đọc cgroup và trả 134217728 — hãy dùng nó, hoặc đặt rõ <code>--max-old-space-size</code> (CS.5). JVM biết mình ở trong container (<code>UseContainerSupport = true</code> từ JDK 10): <code>MaxHeapSize = 67108864</code>, tức 64 MiB. Để ý đó là <strong>50 %</strong>, không phải 25 % của <code>MaxRAMPercentage</code>: với bộ nhớ nhỏ (dưới khoảng 250 MB) JVM dùng <code>MinRAMPercentage</code>, mặc định 50 %. Dù thế nào, heap không phải toàn bộ tiến trình — metaspace, ngăn xếp của các luồng, bộ đệm trực tiếp (direct buffer) và JIT nằm ngoài nó, nên một JVM có heap = giới hạn sẽ bị giết với 137. Hãy đặt <code>-XX:MaxRAMPercentage=60–75</code> và đo.</p>
<p><strong>4. <code>--memory 512m</code> là trần cứng.</strong> Chỉ khi <code>--memory-swap</code> cũng là 512m — nếu không thì còn được thêm 512 MB swap (slide 17). <strong>5. <code>--cpus 1</code> = CPU chậm hơn.</strong> Nó là một CPU tốc độ đầy đủ trong 100 ms của mỗi chu kỳ 100 ms, <em>cộng trên mọi luồng</em>: bốn luồng tiêu hết trong 25 ms rồi chờ (slide 15). Hãy theo dõi <code>nr_throttled</code>.</p>
<p class="pitfall">⚠️ Thêm một cái nữa, rất hay gặp trong các bài hướng dẫn: "container đang rảnh nên không dùng bộ nhớ". Page cache của các tệp nó đã đọc được tính vào cgroup của nó và đếm trong <code>memory.current</code>; phần đó thu hồi được, nên hãy đọc <code>memory.stat</code> (anon so với file) trước khi nâng giới hạn.</p>`],
      [25, '🧭 On the real server: cuongthai.com deploy, exit 137',
        `<p class="y-chinh">🎯 2026-07-06: on the 6 GB VPS of this website, with the live stack running, backend and frontend images were built <strong>in parallel</strong> with a cold cache and the kernel OOM-killed <code>next build</code> — <strong>exit 137</strong>. 2026-07-07: <code>docker compose up --build</code> started both builds in parallel again, same kill. Fix: build one image at a time, never <code>up --build</code>; later, build on a 31 GB home machine and let the VPS only pull.</p>
<p>The bar chart is an illustration (the lengths were not measured), but the mechanism is exactly this deck. A VPS has one Linux kernel and 6 GB of RAM shared by everything: PostgreSQL, the backend, the frontend, nginx — and, during a deploy, the build itself, which runs as ordinary processes inside BuildKit containers. A cold <code>next build</code> of a large Next.js app easily needs a few gigabytes at its peak; the backend's TypeScript build and <code>npm ci</code> another one. In parallel, the sum crosses what is free, the kernel has nothing left to reclaim, and the OOM killer chooses the biggest process on the machine: <code>next build</code>. SIGKILL, exit 137, a failed deploy — with no error in the build log, because a killed process writes nothing (slide 14).</p>
<p>The fix is written as a comment in the repository's <code>deploy.sh</code>, Step 2a: "The VPS has 6GB RAM shared with the live stack. When the build cache is cold (it is pruned at the end of every deploy), building backend and frontend in parallel peaks above available RAM and the kernel kills <code>next build</code> (exit 137, seen 2026-07-06). Building sequentially keeps the peak to one image at a time; with a warm cache each build is a fast no-op." And Step 2b warns not to pass <code>--build</code> to <code>up</code>: "compose bake treats it as a fresh parallel build of BOTH images (observed 2026-07-07 — it re-ran next build alongside the backend export and the kernel OOM-killed it, exit 137)". The longer-term fix (project notes, "Deploy hygiene"): the build moved to <code>deploy-nha.sh</code> on a home machine with 12 cores and 31 GB, the VPS only pulls the finished images — which also removed a 7.6 GB build cache from the disk that holds PostgreSQL.</p>
<p>How to read such an incident with the tools of this deck: (1) <strong>137 = 128 + 9</strong> — something sent SIGKILL. (2) Was it the OOM killer? <code>dmesg -T | grep -i "out of memory"</code> or <code>journalctl -k</code> on the host names the victim and the cgroup (<code>oom_memcg=…</code>); for a container, <code>docker inspect … OOMKilled</code>. (3) <em>Which</em> limit? If <code>oom_memcg</code> is the container's cgroup, its <code>memory.max</code> was too small; if it is the root (no limit), the <strong>whole machine</strong> ran out — the case here, where no container had a limit and the build simply exhausted the host. (4) Fix the cause: fewer things at the same time, more memory where the work runs, or limits that make the <em>right</em> thing fail first.</p>
<p>➕ A cheaper safety net you can add on such a server: give the build containers a memory limit (BuildKit honours <code>--memory</code> per build step in some setups, or run the build inside a container with <code>--memory</code>), and give PostgreSQL protection with <code>oom_score_adj</code> or a cgroup <code>memory.low</code>, so that if the machine runs out, the build dies — not the database.</p>
<p class="pitfall">⚠️ "Add swap and the problem is solved" — swap would have let the parallel build finish, very slowly, while PostgreSQL and the live API slowed down with it. For a production server, a clean, explained kill of the build is the better outcome; avoiding the overload is better still.</p>`,
        `<p class="y-chinh">🎯 06/07/2026: trên VPS 6 GB của chính trang web này, khi các dịch vụ đang chạy, image backend và frontend được build <strong>song song</strong> với bộ đệm nguội và nhân OOM-kill <code>next build</code> — <strong>exit 137</strong>. 07/07/2026: <code>docker compose up --build</code> lại khởi động hai lần build song song, bị giết y như vậy. Cách sửa: build từng image một, không bao giờ <code>up --build</code>; về sau, build trên một máy ở nhà 31 GB và để VPS chỉ việc kéo image về.</p>
<p>Biểu đồ cột chỉ là minh hoạ (độ dài các cột không đo), nhưng cơ chế thì đúng là deck này. Một VPS có một nhân Linux và 6 GB RAM dùng chung cho mọi thứ: PostgreSQL, backend, frontend, nginx — và, trong lúc deploy, chính quá trình build, chạy như các tiến trình bình thường bên trong container của BuildKit. Một lần <code>next build</code> nguội của một app Next.js lớn dễ cần vài GB ở đỉnh; bản build TypeScript và <code>npm ci</code> của backend thêm một GB nữa. Chạy song song, tổng vượt phần còn trống, nhân hết thứ để thu hồi, và OOM killer chọn tiến trình lớn nhất trên máy: <code>next build</code>. SIGKILL, mã 137, một lần deploy thất bại — mà log build chẳng có lỗi nào, vì tiến trình bị giết không ghi được gì (slide 14).</p>
<p>Cách sửa được ghi thành chú thích trong <code>deploy.sh</code> của repo, Bước 2a: "VPS có 6GB RAM dùng chung với các dịch vụ đang chạy. Khi bộ đệm build nguội (nó bị dọn cuối mỗi lần deploy), build backend và frontend song song đẩy đỉnh vượt RAM còn trống và nhân giết <code>next build</code> (exit 137, gặp 2026-07-06). Build tuần tự giữ đỉnh ở mức một image mỗi lúc; khi bộ đệm ấm mỗi lần build gần như không tốn gì." Và Bước 2b cảnh báo đừng truyền <code>--build</code> cho <code>up</code>: "compose bake coi nó là một lần build song song mới cho CẢ HAI image (thấy 2026-07-07 — nó chạy lại next build cùng lúc với bước export của backend và nhân OOM-kill nó, exit 137)". Cách sửa lâu dài (ghi chú dự án, mục "Deploy hygiene"): việc build chuyển sang <code>deploy-nha.sh</code> trên một máy ở nhà 12 nhân và 31 GB, VPS chỉ kéo image đã xong — đồng thời bỏ được 7,6 GB bộ đệm build nằm trên chính cái đĩa chứa PostgreSQL.</p>
<p>Đọc một sự cố như thế bằng bộ công cụ của deck này: (1) <strong>137 = 128 + 9</strong> — có thứ gì đó đã gửi SIGKILL. (2) Có phải OOM killer không? <code>dmesg -T | grep -i "out of memory"</code> hoặc <code>journalctl -k</code> trên máy chủ ghi tên nạn nhân và cgroup (<code>oom_memcg=…</code>); với container thì <code>docker inspect … OOMKilled</code>. (3) Giới hạn <em>nào</em>? Nếu <code>oom_memcg</code> là cgroup của container thì <code>memory.max</code> của nó quá nhỏ; nếu là gốc (không giới hạn) thì <strong>cả máy</strong> đã cạn — đúng trường hợp ở đây, khi không container nào có giới hạn và quá trình build đơn giản là vắt kiệt máy chủ. (4) Sửa nguyên nhân: ít việc chạy cùng lúc hơn, nhiều bộ nhớ hơn ở nơi làm việc nặng, hoặc đặt giới hạn để thứ <em>đúng</em> thất bại trước.</p>
<p>➕ Một lưới an toàn rẻ hơn bạn thêm được trên server như thế: cho container build một giới hạn bộ nhớ (chạy build bên trong một container có <code>--memory</code>), và bảo vệ PostgreSQL bằng <code>oom_score_adj</code> hoặc <code>memory.low</code> của cgroup, để nếu máy cạn bộ nhớ thì bản build chết — không phải cơ sở dữ liệu.</p>
<p class="pitfall">⚠️ "Thêm swap là xong" — swap sẽ để bản build song song chạy xong, rất chậm, trong khi PostgreSQL và API đang chạy chậm theo. Với server production, một lần giết bản build rõ ràng, giải thích được là kết cục tốt hơn; tránh được quá tải thì còn tốt hơn nữa.</p>`],
      [26, '🎤 Interview questions',
        `<p class="y-chinh">🎯 Six questions that come up in backend and DevOps interviews, with short model answers: container vs VM; namespaces vs cgroups; "exit 137 — what happened?"; why PID 1 is special; how image layers save disk; whether root in a container is dangerous.</p>
<p><strong>Container vs virtual machine?</strong> A VM runs its own kernel on virtual hardware from a hypervisor; a container is a host process isolated by namespaces and limited by cgroups, sharing the host kernel — so it starts in milliseconds and has no boot, but its isolation is only as strong as the shared kernel. <em>Follow-up:</em> "Can a Linux container run on Windows?" — only inside a Linux VM (WSL 2 / Docker Desktop), exactly as slide 4 measured on macOS. <strong>Namespaces vs cgroups?</strong> Namespaces limit what a process can <em>see</em> (pid, mnt, net, uts, ipc, user, cgroup, time); cgroups limit how much it can <em>use</em> (memory, CPU, pids, io). <em>Follow-up:</em> "Name the namespace that lets two containers use port 8080" — net.</p>
<p><strong>"Your container exits with 137. What happened?"</strong> 128 + 9: SIGKILL. Most often the OOM killer — check <code>docker inspect … OOMKilled</code> / <code>kubectl describe pod</code> (Reason: OOMKilled), <code>memory.events</code>, <code>dmesg</code>; otherwise a stop timeout after SIGTERM or a failed liveness probe. Then compare peak RSS (heap + native) with <code>memory.max</code>. <em>Follow-up:</em> "and 143?" — SIGTERM without a handler. <strong>Why is PID 1 special?</strong> It is the init of its PID namespace: it adopts orphans and must reap them, the kernel delivers to it only signals it has handlers for, and when it exits every other process of the namespace is killed — hence exec-form <code>CMD</code>, <code>exec "$@"</code> in entrypoints and <code>tini</code>/<code>--init</code>.</p>
<p><strong>How do image layers save disk?</strong> overlayfs stacks shared read-only lower layers and adds one thin writable upper layer per container; writes copy-up the file, deletions create whiteouts — so ten containers of a 1 GB image store the image once. <em>Follow-up:</em> "Why didn't <code>RUN rm</code> shrink my image?" — the file is still in the earlier layer. <strong>Is root in a container dangerous?</strong> Less than host root — a default container keeps 14 of ~41 capabilities and has a seccomp filter — but in default Docker it is still uid 0 on the shared kernel; prefer a non-root <code>USER</code>, <code>--cap-drop ALL</code>, <code>no-new-privileges</code>, rootless mode or user namespaces, and never <code>--privileged</code> for applications.</p>
<p>➕ Questions that separate a strong answer: "How would you find a container's process from the host and look at its sockets?" (<code>docker inspect</code> → PID → <code>nsenter -t PID -n ss -tlnp</code>, slide 10). "Why is my service slow although CPU usage is only 30 %?" (CFS throttling: <code>cpu.stat nr_throttled</code>, slide 15). "Why does Java report <code>unable to create native thread</code> with free memory?" (<code>pids.max</code> counts threads, slide 13). Each of these has a command you ran in this lesson — say the command.</p>
<p class="meo">🧠 Answer shape that works: one-sentence definition → the mechanism (the file or system call) → one real consequence. "Cgroups limit resources; for memory the kernel reads <code>memory.max</code> and OOM-kills inside the group, so the pod exits with 137 and <code>memory.events</code> shows <code>oom_kill</code>."</p>`,
        `<p class="y-chinh">🎯 Sáu câu hay gặp trong phỏng vấn backend và DevOps, kèm đáp án mẫu ngắn: container khác máy ảo; namespace khác cgroup; "exit 137 — chuyện gì đã xảy ra?"; vì sao PID 1 đặc biệt; lớp image tiết kiệm đĩa thế nào; root trong container có nguy hiểm không.</p>
<p><strong>Container khác máy ảo thế nào?</strong> Máy ảo chạy nhân riêng trên phần cứng ảo do hypervisor cấp; container là một tiến trình của máy chủ được cách ly bằng namespace và giới hạn bằng cgroup, dùng chung nhân của máy chủ — nên nó khởi động trong vài mili giây và không có bước boot, nhưng độ cách ly chỉ chắc bằng cái nhân dùng chung. <em>Hỏi đào sâu:</em> "Container Linux chạy được trên Windows không?" — chỉ bên trong một máy ảo Linux (WSL 2 / Docker Desktop), đúng như slide 4 đo trên macOS. <strong>Namespace khác cgroup thế nào?</strong> Namespace giới hạn thứ tiến trình <em>nhìn thấy</em> (pid, mnt, net, uts, ipc, user, cgroup, time); cgroup giới hạn lượng nó được <em>dùng</em> (bộ nhớ, CPU, pid, io). <em>Hỏi đào sâu:</em> "Namespace nào cho hai container cùng dùng cổng 8080?" — net.</p>
<p><strong>"Container của bạn thoát với 137. Chuyện gì đã xảy ra?"</strong> 128 + 9: SIGKILL. Thường nhất là OOM killer — kiểm <code>docker inspect … OOMKilled</code> / <code>kubectl describe pod</code> (Reason: OOMKilled), <code>memory.events</code>, <code>dmesg</code>; nếu không thì là hết hạn chờ sau SIGTERM hoặc trượt liveness probe. Rồi so RSS đỉnh (heap + native) với <code>memory.max</code>. <em>Hỏi đào sâu:</em> "còn 143?" — SIGTERM mà không có handler. <strong>Vì sao PID 1 đặc biệt?</strong> Nó là init của PID namespace: nó nhận nuôi mồ côi và phải gặt chúng, nhân chỉ giao cho nó những tín hiệu nó có handler, và khi nó thoát thì mọi tiến trình khác trong namespace bị giết — nên mới cần <code>CMD</code> dạng exec, <code>exec "$@"</code> trong entrypoint và <code>tini</code>/<code>--init</code>.</p>
<p><strong>Lớp image tiết kiệm đĩa thế nào?</strong> overlayfs chồng các lớp dưới chỉ đọc dùng chung và thêm một lớp trên ghi được mỏng cho mỗi container; ghi thì copy-up tệp, xoá thì tạo whiteout — nên mười container của một image 1 GB chỉ lưu image một lần. <em>Hỏi đào sâu:</em> "Sao <code>RUN rm</code> không làm image tôi nhỏ đi?" — tệp vẫn nằm ở lớp trước. <strong>Root trong container có nguy hiểm không?</strong> Ít hơn root của máy chủ — container mặc định giữ 14 trên ~41 capability và có bộ lọc seccomp — nhưng với Docker mặc định nó vẫn là uid 0 trên cái nhân dùng chung; hãy ưu tiên <code>USER</code> không phải root, <code>--cap-drop ALL</code>, <code>no-new-privileges</code>, chế độ rootless hoặc user namespace, và không bao giờ <code>--privileged</code> cho ứng dụng.</p>
<p>➕ Những câu phân biệt một câu trả lời mạnh: "Làm sao tìm tiến trình của một container từ máy chủ và xem socket của nó?" (<code>docker inspect</code> → PID → <code>nsenter -t PID -n ss -tlnp</code>, slide 10). "Sao dịch vụ của tôi chậm dù CPU chỉ dùng 30 %?" (CFS throttling: <code>cpu.stat nr_throttled</code>, slide 15). "Sao Java báo <code>unable to create native thread</code> khi bộ nhớ còn trống?" (<code>pids.max</code> đếm cả luồng, slide 13). Câu nào cũng có một lệnh bạn đã chạy trong bài này — hãy nói ra lệnh đó.</p>
<p class="meo">🧠 Khuôn trả lời hiệu quả: định nghĩa một câu → cơ chế (tệp hay lời gọi hệ thống) → một hệ quả thật. "Cgroup giới hạn tài nguyên; với bộ nhớ, nhân đọc <code>memory.max</code> và OOM-kill bên trong nhóm, nên pod thoát với 137 và <code>memory.events</code> hiện <code>oom_kill</code>."</p>`],
      [27, 'Check yourself',
        `<p class="y-chinh">🎯 Three questions: why do <code>docker run alpine uname -r</code> and <code>docker run ubuntu uname -r</code> print the same thing; what <code>fork()</code> returns in a cgroup with <code>pids.max = 10</code> during a fork bomb, and what happens to the rest of the machine; why a container with <code>--memory 64m</code> used 120 MiB, and which flag fixes it.</p>
<p>Try to answer before reading the box on the slide. Then check yourself against the reasoning, not just the words:</p>
<p><strong>1.</strong> <code>uname -r</code> asks the kernel, and both containers run on the same host kernel; the images only bring user-space files (slide 4). If your answer mentioned "the image of Alpine contains a kernel", reread slides 3–4. <strong>2.</strong> Once 10 tasks exist in the cgroup, <code>fork()</code> returns -1 with <code>errno = EAGAIN</code> ("Resource temporarily unavailable"); <code>pids.events</code> counts each refusal; processes outside the cgroup are not affected, and <code>echo 1 &gt; cgroup.kill</code> ends the bomb (slide 13). Remember that threads count too. <strong>3.</strong> Without <code>--memory-swap</code>, Docker allows swap equal to <code>--memory</code> — <code>memory.swap.max = 67108864</code> — so RAM + swap reached about 120 MiB before the OOM kill; <code>--memory-swap 64m</code> makes RAM + swap = 64 MiB, <code>memory.swap.max = 0</code> (slides 16–17).</p>
<p>➕ Two extra questions for those who want more: (a) A shell inside <code>unshare --pid</code> (no <code>--fork</code>) runs <code>ls</code> twice; the second fails with "Cannot allocate memory". Why? — the first child became PID 1 of the new namespace and exited; a PID namespace whose init has died accepts no new processes (slide 8). (b) A container's <code>cpu.max</code> is <code>25000 100000</code>; a request needs 40 ms of CPU starting at the beginning of a period. What is its wall time in the simple model? — 25 ms, wait 75, 15 ms: 115 ms.</p>
<p class="meo">🧠 If you missed one, run its experiment again with one change of your own — another number in <code>pids.max</code>, another <code>--memory-swap</code> — and predict the output before pressing Enter. Prediction then measurement is the fastest way to make this knowledge stick.</p>`,
        `<p class="y-chinh">🎯 Ba câu hỏi: vì sao <code>docker run alpine uname -r</code> và <code>docker run ubuntu uname -r</code> in ra giống nhau; <code>fork()</code> trả về gì trong một cgroup có <code>pids.max = 10</code> khi đang chạy fork bomb, và phần còn lại của máy ra sao; vì sao một container có <code>--memory 64m</code> lại dùng tới 120 MiB, và cờ nào sửa được.</p>
<p>Hãy tự trả lời trước khi đọc ô đáp án trên slide. Rồi tự chấm theo lập luận, không chỉ theo chữ:</p>
<p><strong>1.</strong> <code>uname -r</code> hỏi nhân, và cả hai container chạy trên cùng nhân của máy chủ; image chỉ mang tệp của không gian người dùng (slide 4). Nếu câu trả lời của bạn có ý "image Alpine chứa một nhân", hãy đọc lại slide 3–4. <strong>2.</strong> Khi trong cgroup đã có 10 tác vụ, <code>fork()</code> trả -1 với <code>errno = EAGAIN</code> ("Resource temporarily unavailable"); <code>pids.events</code> đếm mỗi lần từ chối; tiến trình ngoài cgroup không bị ảnh hưởng, và <code>echo 1 &gt; cgroup.kill</code> kết liễu quả bom (slide 13). Nhớ rằng luồng cũng được đếm. <strong>3.</strong> Không có <code>--memory-swap</code>, Docker cho swap bằng <code>--memory</code> — <code>memory.swap.max = 67108864</code> — nên RAM + swap lên tới khoảng 120 MiB rồi mới bị OOM-kill; <code>--memory-swap 64m</code> khiến RAM + swap = 64 MiB, <code>memory.swap.max = 0</code> (slide 16–17).</p>
<p>➕ Hai câu thêm cho ai muốn nhiều hơn: (a) Một shell bên trong <code>unshare --pid</code> (không <code>--fork</code>) chạy <code>ls</code> hai lần; lần hai thất bại với "Cannot allocate memory". Vì sao? — đứa con đầu tiên đã thành PID 1 của namespace mới rồi thoát; một PID namespace có init đã chết không nhận thêm tiến trình nào (slide 8). (b) <code>cpu.max</code> của một container là <code>25000 100000</code>; một request cần 40 ms CPU, bắt đầu đúng đầu chu kỳ. Thời gian tường của nó trong mô hình đơn giản là bao nhiêu? — 25 ms, chờ 75, 15 ms: 115 ms.</p>
<p class="meo">🧠 Sai câu nào thì chạy lại thí nghiệm của câu đó với một thay đổi của riêng bạn — một con số khác trong <code>pids.max</code>, một <code>--memory-swap</code> khác — và đoán output trước khi nhấn Enter. Đoán trước rồi đo là cách nhanh nhất để kiến thức này bám chắc.</p>`],
      [28, 'Summary',
        `<p class="y-chinh">🎯 Container = <strong>process</strong> + <strong>namespaces</strong> (see) + <strong>cgroups</strong> (use) + <strong>rootfs</strong> (overlayfs) + <strong>caps/seccomp</strong> (do). One shared kernel — on a Mac, inside one Linux VM. cgroup v2 limits are files: <code>memory.max</code> → OOM 137, <code>pids.max</code> → EAGAIN, <code>cpu.max</code> → throttled. <code>docker exec</code> = nsenter; <code>--privileged</code> = no walls. Next: CS.7 — performance &amp; debugging toolkit.</p>
<p>What to keep from the whole deck, in the order you will need it at work. When a container misbehaves, it is a <strong>process</strong>: find it from the host (<code>docker inspect</code> → PID, <code>NSpid</code>), look inside with <code>nsenter</code>, use the ordinary tools of CS.1. When it dies, read the <strong>exit code</strong> (137 = SIGKILL) and the <strong>cgroup files</strong> (<code>memory.events</code>, <code>pids.events</code>, <code>cpu.stat</code>) before reading application logs. When it is slow, suspect <strong>throttling</strong> before suspecting code. When you write a Dockerfile, remember <strong>layers</strong> (delete in the same step, keep data on volumes) and <strong>privileges</strong> (non-root, minimal capabilities, default seccomp).</p>
<p>And keep the one idea that explains all of them: Docker does not run your app — the kernel does, with a different view and a budget. Every flag of <code>docker run</code> you will ever meet maps to one of these features: <code>-p</code>, <code>--network</code> → net namespace; <code>-v</code> → mount namespace; <code>--hostname</code> → UTS; <code>--pid</code> → PID; <code>--userns</code> → user; <code>--memory</code>, <code>--cpus</code>, <code>--pids-limit</code>, <code>--cpuset-cpus</code> → cgroup files; <code>--cap-add/--cap-drop</code>, <code>--security-opt</code>, <code>--privileged</code> → capabilities and seccomp; <code>--init</code> → a real PID 1. If you can name the feature behind a flag, you can predict and verify what it does.</p>
<p>➕ Where to go next: CS.7 turns the same habits into a toolkit — <code>top</code>, <code>vmstat</code>, <code>pidstat</code>, <code>strace -c</code>, <code>perf</code> and the USE method — and shows which of them need extra privileges in a container; CS.5 goes deeper into memory (RSS, page cache, overcommit, the OOM score) that this deck used as a black box; the course <code>/courses/docker</code> covers images, Compose and registries from the user's side, and <code>/courses/linux-bash</code> the shell skills used in every run here.</p>
<p class="meo">🧠 A one-week plan: (1) on your own machine, <code>cat /sys/fs/cgroup/memory.max</code> in every container you run; (2) set <code>--memory</code> and <code>--memory-swap</code> to the same value in your project's compose file and measure peak memory with <code>docker stats</code>; (3) add <code>--cap-drop ALL</code> and see what, if anything, breaks; (4) rebuild the tiny container from memory.</p>`,
        `<p class="y-chinh">🎯 Container = <strong>tiến trình</strong> + <strong>namespace</strong> (nhìn) + <strong>cgroup</strong> (dùng) + <strong>rootfs</strong> (overlayfs) + <strong>capability/seccomp</strong> (làm). Một nhân dùng chung — trên Mac thì nằm trong một máy ảo Linux. Giới hạn cgroup v2 là các tệp: <code>memory.max</code> → OOM 137, <code>pids.max</code> → EAGAIN, <code>cpu.max</code> → bị hãm. <code>docker exec</code> = nsenter; <code>--privileged</code> = không còn tường. Tiếp theo: CS.7 — bộ công cụ đo hiệu năng và gỡ lỗi.</p>
<p>Những gì cần giữ lại từ cả deck, theo thứ tự bạn sẽ cần khi đi làm. Khi một container hành xử lạ, nó là một <strong>tiến trình</strong>: tìm nó từ máy chủ (<code>docker inspect</code> → PID, <code>NSpid</code>), nhìn vào trong bằng <code>nsenter</code>, dùng các công cụ thường của CS.1. Khi nó chết, đọc <strong>mã thoát</strong> (137 = SIGKILL) và các <strong>tệp cgroup</strong> (<code>memory.events</code>, <code>pids.events</code>, <code>cpu.stat</code>) trước khi đọc log ứng dụng. Khi nó chậm, nghi <strong>bị hãm CPU</strong> trước khi nghi mã nguồn. Khi viết Dockerfile, nhớ <strong>các lớp</strong> (xoá trong cùng bước, giữ dữ liệu trên volume) và <strong>đặc quyền</strong> (không chạy root, capability tối thiểu, giữ seccomp mặc định).</p>
<p>Và giữ lại một ý giải thích được tất cả: Docker không chạy ứng dụng của bạn — nhân chạy nó, với một góc nhìn khác và một ngân sách. Mọi cờ của <code>docker run</code> bạn từng gặp đều ứng với một trong các tính năng này: <code>-p</code>, <code>--network</code> → net namespace; <code>-v</code> → mount namespace; <code>--hostname</code> → UTS; <code>--pid</code> → PID; <code>--userns</code> → user; <code>--memory</code>, <code>--cpus</code>, <code>--pids-limit</code>, <code>--cpuset-cpus</code> → các tệp cgroup; <code>--cap-add/--cap-drop</code>, <code>--security-opt</code>, <code>--privileged</code> → capability và seccomp; <code>--init</code> → một PID 1 thật. Nói được tính năng đứng sau một cờ là đoán trước và kiểm chứng được cờ đó làm gì.</p>
<p>➕ Đi tiếp đâu: CS.7 biến cùng những thói quen này thành một bộ công cụ — <code>top</code>, <code>vmstat</code>, <code>pidstat</code>, <code>strace -c</code>, <code>perf</code> và phương pháp USE — và cho thấy cái nào cần thêm đặc quyền trong container; CS.5 đi sâu vào bộ nhớ (RSS, page cache, overcommit, điểm OOM) mà deck này coi như hộp đen; khoá <code>/courses/docker</code> bàn image, Compose và registry từ phía người dùng, còn <code>/courses/linux-bash</code> dạy các kỹ năng shell dùng trong mọi lần chạy ở đây.</p>
<p class="meo">🧠 Kế hoạch một tuần: (1) trên máy của bạn, <code>cat /sys/fs/cgroup/memory.max</code> trong mọi container bạn chạy; (2) đặt <code>--memory</code> và <code>--memory-swap</code> bằng nhau trong tệp compose của dự án và đo bộ nhớ đỉnh bằng <code>docker stats</code>; (3) thêm <code>--cap-drop ALL</code> và xem có gì hỏng không; (4) tự dựng lại container tí hon mà không nhìn bài.</p>`],
    ]),
    books([
      ['man7', 'cgroups(7), cgroup_namespaces(7), capabilities(7), seccomp(2), ptrace(2) (ptrace access mode checking), chroot(2), pivot_root(2), mknod(2), unshare(1), ld.so(8), ldd(1), proc(5) (/proc/meminfo, CapEff, Seccomp, NoNewPrivs)', 'cgroups(7), cgroup_namespaces(7), capabilities(7), seccomp(2), ptrace(2) (kiểm tra chế độ truy cập ptrace), chroot(2), pivot_root(2), mknod(2), unshare(1), ld.so(8), ldd(1), proc(5) (/proc/meminfo, CapEff, Seccomp, NoNewPrivs)'],
      ['kernelDocs', 'Documentation/admin-guide/cgroup-v2.rst (memory.max, memory.high, memory.events, memory.swap.max, pids.max, pids.events, cpu.max, cpu.weight, cpu.stat, cgroup.kill, the no-internal-process constraint), Documentation/filesystems/overlayfs.rst (whiteouts, copy-up), Documentation/admin-guide/LSM/Yama.rst (ptrace_scope); docs.docker.com: Resource constraints (--memory-swap), Seccomp security profiles, Runtime privilege and Linux capabilities', 'Documentation/admin-guide/cgroup-v2.rst (memory.max, memory.high, memory.events, memory.swap.max, pids.max, pids.events, cpu.max, cpu.weight, cpu.stat, cgroup.kill, luật không có tiến trình bên trong), Documentation/filesystems/overlayfs.rst (whiteout, copy-up), Documentation/admin-guide/LSM/Yama.rst (ptrace_scope); docs.docker.com: Resource constraints (--memory-swap), Seccomp security profiles, Runtime privilege and Linux capabilities'],
      ['mos4', 'Chapter 7 (virtualization and the cloud, 7.1–7.3) and Chapter 9 (security: 9.3 controlling access to resources, protection domains and capabilities) — the school lessons N1.A and 9.x', 'Chương 7 (ảo hoá và đám mây, 7.1–7.3) và Chương 9 (bảo mật: 9.3 kiểm soát truy cập tài nguyên, miền bảo vệ và capability) — bài trường N1.A và 9.x'],
      ['ostep', 'Chapter 9 "Scheduling: Proportional Share" (the idea behind cpu.weight) and Chapter 39 "Interlude: Files and Directories" (devices, mknod, mount)', 'Chương 9 "Scheduling: Proportional Share" (ý tưởng đứng sau cpu.weight) và Chương 39 "Interlude: Files and Directories" (thiết bị, mknod, mount)'],
    ]),
  ].join('\n'),
};

/* ───────── ⭐ CS.6 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Containers: namespaces, pids.max, CPU throttling, docker flags, layers ───────── */
const L_x_cs6_on = {
  title: '⭐ CS.6 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Containers: namespaces, pids.max, CPU throttling, docker flags, layers|||⭐ CS.6 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Container: namespace, pids.max, hãm CPU, cờ docker, lớp image',
  slug: 'osg202-cs6-on',
  type: 'VIDEO',
  description: 'Sáu bài tập có lời giải chạy thật cho phần ⭐ CS.6 (tự thêm, không thi FE): so sánh namespace của hai tiến trình qua /proc/PID/ns, một dịch vụ Java gặp pids.max và lỗi unable to create native thread, đo độ trễ của request 30 ms dưới cpu.max, đoán trước và kiểm các tệp cgroup do docker run --memory --cpus --pids-limit ghi, chứng minh RUN rm không làm image nhỏ đi bằng overlayfs, và xem free, Node và JVM thấy gì bên trong một container 128 MiB — kèm bảng thuật ngữ và tóm tắt',
  content: [
    bi(`<span class="eyebrow">⭐ Advanced 6 · Lesson CS.6 · Practice &amp; review</span>
<h2>Six exercises: containers taken apart and measured</h2>
<p class="lead">Each exercise is a question you will meet on a real server, in a code review or in an interview. Try it first — on paper, or in a root shell of your own (WSL, a Linux VM, or <code>docker run --rm -it --privileged debian:12</code>) — then open the solution: every solution is a program run for real in the course container, with its real output. Exercises 1 and 4 train reading the kernel's files; 2, 3 and 6 are production surprises (threads, latency, memory seen from inside); 5 is about Dockerfiles. The time in brackets is a target, not a limit.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>1</td><td>tell which namespaces two processes share</td><td>CS.6 slides 7–10</td></tr>
<tr><td>2</td><td>explain a Java "unable to create native thread" under a pids limit</td><td>CS.6 slide 13</td></tr>
<tr><td>3</td><td>measure what cpu.max does to request latency</td><td>CS.6 slide 15</td></tr>
<tr><td>4</td><td>predict the cgroup files of a docker run command</td><td>CS.6 slides 16–17</td></tr>
<tr><td>5</td><td>prove that a later RUN rm does not shrink an image</td><td>CS.6 slide 18</td></tr>
<tr><td>6</td><td>read limits from inside a container (free, Node, JVM)</td><td>CS.6 slide 24</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">⭐ Chuyên sâu 6 · Bài CS.6 · Thực hành &amp; ôn tập</span>
<h2>Sáu bài tập: tháo rời container và đo đạc</h2>
<p class="lead">Mỗi bài là một câu hỏi bạn sẽ gặp trên server thật, khi review code hay trong phỏng vấn. Hãy tự làm trước — trên giấy, hoặc trong một shell root của riêng bạn (WSL, máy ảo Linux, hoặc <code>docker run --rm -it --privileged debian:12</code>) — rồi mới mở lời giải: mọi lời giải là một chương trình chạy thật trong container của môn học, kèm output thật. Bài 1 và 4 luyện đọc các tệp của nhân; bài 2, 3 và 6 là những bất ngờ trên production (luồng, độ trễ, bộ nhớ nhìn từ bên trong); bài 5 nói về Dockerfile. Thời gian trong ngoặc là mục tiêu, không phải giới hạn.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Bài học</th></tr></thead>
<tbody>
<tr><td>1</td><td>biết hai tiến trình dùng chung namespace nào</td><td>CS.6 slide 7–10</td></tr>
<tr><td>2</td><td>giải thích lỗi Java "unable to create native thread" khi bị giới hạn pid</td><td>CS.6 slide 13</td></tr>
<tr><td>3</td><td>đo cpu.max ảnh hưởng thế nào tới độ trễ request</td><td>CS.6 slide 15</td></tr>
<tr><td>4</td><td>đoán trước các tệp cgroup của một lệnh docker run</td><td>CS.6 slide 16–17</td></tr>
<tr><td>5</td><td>chứng minh RUN rm ở lớp sau không làm image nhỏ đi</td><td>CS.6 slide 18</td></tr>
<tr><td>6</td><td>đọc giới hạn từ bên trong container (free, Node, JVM)</td><td>CS.6 slide 24</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — which namespaces does the box share with me? (10 min)</h3>
<p>You start a "box" with <code>unshare --uts --net --fork sleep 300 &amp;</code>. Without running <code>lsns</code>, write a loop that compares, for each of the eight namespace types, the namespace of your shell with the namespace of the box's <code>sleep</code>, and prints <code>shared</code> or <code>NEW</code>. Predict the result first. Bonus: which of the eight would differ for a normal <code>docker run</code> container, compared with the host?</p>
<details><summary>Solution — compare the links in /proc/PID/ns</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_ADMIN</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 1: which namespaces does the "box" share with my shell?<br>
$ unshare --uts --net --fork sleep 300 &amp;<br>
$ B=$(pgrep -x sleep)<br>
$ for t in pid mnt net uts ipc user cgroup time; do [ "$(readlink /proc/$$/ns/$t)" = "$(readlink /proc/$B/ns/$t)" ] &amp;&amp; echo "$t: shared" || echo "$t: NEW"; done<br>
pid: shared<br>
mnt: shared<br>
net: NEW<br>
uts: NEW<br>
ipc: shared<br>
user: shared<br>
cgroup: shared<br>
time: shared</div>
<p>Two processes are in the same namespace exactly when <code>readlink /proc/&lt;pid&gt;/ns/&lt;type&gt;</code> returns the same <code>type:[inode]</code> (slide 7). We asked only for <code>--uts</code> and <code>--net</code>, so exactly <strong>net</strong> and <strong>uts</strong> are NEW; pid, mnt, ipc, user, cgroup and time are shared. <code>--fork</code> does not create a PID namespace by itself — it only matters together with <code>--pid</code>. Bonus: a default Docker container gets new <strong>pid, mnt, net, uts, ipc</strong> and (with cgroup v2) <strong>cgroup</strong> namespaces, but shares the host's <strong>user</strong> and <strong>time</strong> namespaces — which is why root in a default container is uid 0 for the kernel (slide 11).</p>
</details>`,
    `<h3>🧪 Bài 1 — hộp dùng chung namespace nào với tôi? (10 phút)</h3>
<p>Bạn chạy một "hộp" bằng <code>unshare --uts --net --fork sleep 300 &amp;</code>. Không dùng <code>lsns</code>, hãy viết một vòng lặp so sánh, với mỗi loại trong tám loại namespace, namespace của shell bạn với namespace của tiến trình <code>sleep</code> trong hộp, rồi in <code>shared</code> hoặc <code>NEW</code>. Hãy đoán kết quả trước. Thêm: so với máy chủ, loại nào trong tám loại sẽ khác đối với một container <code>docker run</code> bình thường?</p>
<details><summary>Lời giải — so các liên kết trong /proc/PID/ns</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_ADMIN</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 1: "hộp" dùng chung namespace nào với shell của tôi?<br>
$ unshare --uts --net --fork sleep 300 &amp;<br>
$ B=$(pgrep -x sleep)<br>
$ for t in pid mnt net uts ipc user cgroup time; do [ "$(readlink /proc/$$/ns/$t)" = "$(readlink /proc/$B/ns/$t)" ] &amp;&amp; echo "$t: shared" || echo "$t: NEW"; done<br>
pid: shared<br>
mnt: shared<br>
net: NEW<br>
uts: NEW<br>
ipc: shared<br>
user: shared<br>
cgroup: shared<br>
time: shared</div>
<p>Hai tiến trình ở cùng một namespace khi và chỉ khi <code>readlink /proc/&lt;pid&gt;/ns/&lt;loại&gt;</code> trả về cùng <code>loại:[inode]</code> (slide 7). Ta chỉ xin <code>--uts</code> và <code>--net</code>, nên đúng <strong>net</strong> và <strong>uts</strong> là MỚI; pid, mnt, ipc, user, cgroup và time dùng chung. <code>--fork</code> tự nó không tạo PID namespace — nó chỉ có ý nghĩa đi cùng <code>--pid</code>. Câu thêm: một container Docker mặc định có namespace <strong>pid, mnt, net, uts, ipc</strong> và (với cgroup v2) <strong>cgroup</strong> mới, nhưng dùng chung namespace <strong>user</strong> và <strong>time</strong> của máy chủ — vì thế root trong container mặc định là uid 0 đối với nhân (slide 11).</p>
</details>`),
    bi(`<h3>🧪 Exercise 2 — "unable to create native thread" with plenty of memory (15 min)</h3>
<p>A Spring Boot service runs fine on your laptop and fails in a container started with <code>--pids-limit 50</code>: <code>java.lang.OutOfMemoryError: unable to create native thread</code>, although memory is far from full. Write a tiny Java program that starts sleeping threads until the JVM cannot create one more, run it under <code>--pids-limit 50</code>, and explain the number you get. Then say what you would change in production.</p>
<details><summary>Solution — a JVM meets pids.max (🎲 one real run)</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--pids-limit=50</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 2: pids.max counts THREADS, not only processes — a Java service in --pids-limit 50<br>
$ cat /sys/fs/cgroup/pids.max<br>
50<br>
$ java -Xss256k _NhieuLuong<br>
[0.043s][warning][os,thread] Failed to start thread "Unknown thread" - pthread_create failed (EAGAIN) for attributes: stacksize: 256k, guardsize: 4k, detached.<br>
[0.043s][warning][os,thread] Failed to start the native thread for java.lang.Thread "Thread-31"<br>
started 31 threads, then: java.lang.OutOfMemoryError: unable to create native thread: possibly out of memory or process/resource limits reached<br>
live threads in the JVM: 32 (+ JVM's own: GC, JIT, …)<br>
$ cat /sys/fs/cgroup/pids.events<br>
max 4</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The JVM managed to start about <strong>31</strong> threads of our program before <code>pthread_create</code> failed with <strong>EAGAIN</strong> — the HotSpot warning says so literally — and Java reports it as an <code>OutOfMemoryError</code>, a misleading name: no heap or RAM ran out. Why 31 and not 50? <code>pids.max</code> counts <strong>tasks</strong>, and for Linux every thread is a task (slide 13); before <code>main</code> even runs, the JVM has its own threads — the main thread, GC worker threads, JIT compiler threads, signal dispatcher, finalizer, reference handler, common-cleaner — and the shell of the session counts too. 50 − (those) ≈ 31. <code>pids.events</code> shows how many times the limit refused a new task. The output order (warnings first) and the exact count vary between runs — that is why this is a 🎲 sample.</p>
<p>In production: size the pids limit for <em>threads</em>, not processes — a Tomcat pool of 200 plus GC/JIT and the database pool already needs ~250; watch <code>pids.current</code>; and for Java 21, consider virtual threads (CS.3), which run thousands of tasks on a handful of carrier threads and do not consume one pid each.</p>
</details>`,
    `<h3>🧪 Bài 2 — "unable to create native thread" khi bộ nhớ còn thừa (15 phút)</h3>
<p>Một dịch vụ Spring Boot chạy tốt trên laptop nhưng hỏng trong container chạy với <code>--pids-limit 50</code>: <code>java.lang.OutOfMemoryError: unable to create native thread</code>, trong khi bộ nhớ còn xa mới đầy. Hãy viết một chương trình Java nhỏ khởi động các luồng ngủ cho tới khi JVM không tạo thêm được, chạy nó dưới <code>--pids-limit 50</code>, và giải thích con số bạn nhận được. Rồi nói bạn sẽ đổi gì trên production.</p>
<details><summary>Lời giải — một JVM gặp pids.max (🎲 một lần chạy thật)</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--pids-limit=50</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 2: pids.max đếm cả LUỒNG, không chỉ tiến trình — một dịch vụ Java trong --pids-limit 50<br>
$ cat /sys/fs/cgroup/pids.max<br>
50<br>
$ java -Xss256k _NhieuLuong<br>
[0.043s][warning][os,thread] Failed to start thread "Unknown thread" - pthread_create failed (EAGAIN) for attributes: stacksize: 256k, guardsize: 4k, detached.<br>
[0.043s][warning][os,thread] Failed to start the native thread for java.lang.Thread "Thread-31"<br>
started 31 threads, then: java.lang.OutOfMemoryError: unable to create native thread: possibly out of memory or process/resource limits reached<br>
live threads in the JVM: 32 (+ JVM's own: GC, JIT, …)<br>
$ cat /sys/fs/cgroup/pids.events<br>
max 4</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>JVM khởi động được khoảng <strong>31</strong> luồng của chương trình ta rồi <code>pthread_create</code> thất bại với <strong>EAGAIN</strong> — cảnh báo của HotSpot nói thẳng như thế — và Java báo nó là <code>OutOfMemoryError</code>, một cái tên gây hiểu lầm: không heap hay RAM nào hết cả. Sao lại 31 mà không phải 50? <code>pids.max</code> đếm <strong>tác vụ</strong>, và với Linux mỗi luồng là một tác vụ (slide 13); trước khi <code>main</code> kịp chạy, JVM đã có các luồng của riêng nó — luồng chính, các luồng làm việc của GC, luồng biên dịch JIT, signal dispatcher, finalizer, reference handler, common-cleaner — và shell của phiên cũng được đếm. 50 − (chừng ấy) ≈ 31. <code>pids.events</code> cho biết giới hạn đã từ chối bao nhiêu tác vụ mới. Thứ tự output (cảnh báo in trước) và con số chính xác thay đổi giữa các lần chạy — vì thế đây là 🎲 mẫu.</p>
<p>Trên production: đặt giới hạn pid theo <em>luồng</em>, không theo tiến trình — một pool Tomcat 200 cộng GC/JIT và pool kết nối cơ sở dữ liệu đã cần khoảng 250; theo dõi <code>pids.current</code>; và với Java 21, cân nhắc luồng ảo (virtual thread — CS.3), chạy hàng nghìn tác vụ trên một nhúm luồng carrier và không tốn mỗi cái một pid.</p>
</details>`),
    bi(`<h3>🧪 Exercise 3 — what cpu.max does to latency (15 min)</h3>
<p>Your API container has <code>cpu.max = "20000 100000"</code> (in Kubernetes terms, a CPU limit of 200m). Each request needs 30 ms of pure CPU. Predict the wall-clock time of five back-to-back requests with and without the limit, then measure it with a C program that burns exactly 30 ms of CPU per "request" (<code>clock_gettime(CLOCK_PROCESS_CPUTIME_ID)</code>) and prints the wall time. Which counter in <code>cpu.stat</code> proves the cause?</p>
<details><summary>Solution — five 30 ms requests, unlimited and limited (🎲 one real run)</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 3: the same 30 ms requests with no CPU limit and with cpu.max = 20000 100000<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/fast/cgroup.procs; exec ./yeucau' | tee fast.txt<br>
request 1: cpu 30 ms, wall 30 ms<br>
request 2: cpu 30 ms, wall 30 ms<br>
request 3: cpu 30 ms, wall 30 ms<br>
request 4: cpu 30 ms, wall 30 ms<br>
request 5: cpu 30 ms, wall 30 ms<br>
$ echo "max wall $(grep -o 'wall [0-9]*' fast.txt | cut -d' ' -f2 | sort -n | tail -1) ms (no limit)"<br>
max wall 30 ms (no limit)<br>
$ echo "cpu.max = $(cat /sys/fs/cgroup/slow/cpu.max)"<br>
cpu.max = 20000 100000<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/slow/cgroup.procs; exec ./yeucau'<br>
request 1: cpu 30 ms, wall 112 ms<br>
request 2: cpu 30 ms, wall 184 ms<br>
request 3: cpu 30 ms, wall 110 ms<br>
request 4: cpu 30 ms, wall 190 ms<br>
request 5: cpu 30 ms, wall 114 ms<br>
$ grep nr_throttled /sys/fs/cgroup/slow/cpu.stat<br>
nr_throttled 7</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Without a limit each request takes its 30 ms of CPU and 30 ms of wall time. With 20 ms per 100 ms period, no request can finish inside one period: it runs 20 ms, is throttled until the next period, runs again — measured <strong>91 to 197 ms</strong> per request, 3 to 6.5 times slower, with <code>nr_throttled</code> counting the periods in which the quota ran out. The spread depends on where in the period each request starts, exactly as the simulation of slide 15 shows (110 ms when it starts at a period boundary, 190 ms when little quota is left). The average CPU usage of this container would show "20 %" — the latency only shows in <code>cpu.stat</code> (<code>nr_throttled</code>, <code>throttled_usec</code>) and in your p99. Fixes: a larger quota, no CPU limit with a CPU request (weight) instead, or less CPU per request.</p>
</details>`,
    `<h3>🧪 Bài 3 — cpu.max làm gì với độ trễ (15 phút)</h3>
<p>Container API của bạn có <code>cpu.max = "20000 100000"</code> (theo cách nói Kubernetes là CPU limit 200m). Mỗi request cần 30 ms CPU thuần. Hãy đoán thời gian tường của năm request nối đuôi nhau khi có và không có giới hạn, rồi đo bằng một chương trình C đốt đúng 30 ms CPU cho mỗi "request" (<code>clock_gettime(CLOCK_PROCESS_CPUTIME_ID)</code>) và in thời gian tường. Bộ đếm nào trong <code>cpu.stat</code> chứng minh nguyên nhân?</p>
<details><summary>Lời giải — năm request 30 ms, không giới hạn và có giới hạn (🎲 một lần chạy thật)</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 3: cùng các request 30 ms khi không giới hạn CPU và khi cpu.max = 20000 100000<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/fast/cgroup.procs; exec ./yeucau' | tee fast.txt<br>
request 1: cpu 30 ms, wall 30 ms<br>
request 2: cpu 30 ms, wall 30 ms<br>
request 3: cpu 30 ms, wall 30 ms<br>
request 4: cpu 30 ms, wall 30 ms<br>
request 5: cpu 30 ms, wall 30 ms<br>
$ echo "max wall $(grep -o 'wall [0-9]*' fast.txt | cut -d' ' -f2 | sort -n | tail -1) ms (no limit)"<br>
max wall 30 ms (no limit)<br>
$ echo "cpu.max = $(cat /sys/fs/cgroup/slow/cpu.max)"<br>
cpu.max = 20000 100000<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/slow/cgroup.procs; exec ./yeucau'<br>
request 1: cpu 30 ms, wall 112 ms<br>
request 2: cpu 30 ms, wall 184 ms<br>
request 3: cpu 30 ms, wall 110 ms<br>
request 4: cpu 30 ms, wall 190 ms<br>
request 5: cpu 30 ms, wall 114 ms<br>
$ grep nr_throttled /sys/fs/cgroup/slow/cpu.stat<br>
nr_throttled 7</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Không giới hạn thì mỗi request tốn 30 ms CPU và 30 ms thời gian tường. Với 20 ms mỗi chu kỳ 100 ms, không request nào xong được trong một chu kỳ: nó chạy 20 ms, bị hãm tới chu kỳ sau, chạy tiếp — đo được <strong>91 tới 197 ms</strong> mỗi request, chậm hơn 3 tới 6,5 lần, với <code>nr_throttled</code> đếm số chu kỳ hết hạn ngạch. Độ dao động tuỳ mỗi request bắt đầu ở đâu trong chu kỳ, đúng như mô phỏng ở slide 15 cho thấy (110 ms khi bắt đầu đúng ranh giới chu kỳ, 190 ms khi hạn ngạch chỉ còn ít). CPU trung bình của container này sẽ hiện "20 %" — độ trễ chỉ lộ ra trong <code>cpu.stat</code> (<code>nr_throttled</code>, <code>throttled_usec</code>) và trong p99 của bạn. Cách sửa: hạn ngạch lớn hơn, bỏ CPU limit và dùng CPU request (trọng số) thay vào, hoặc giảm CPU mỗi request.</p>
</details>`),
    bi(`<h3>🧪 Exercise 4 — predict the cgroup files of a docker run (10 min)</h3>
<p>Without running anything, write down the four values that <code>docker run --memory 256m --cpus 1.5 --pids-limit 100 …</code> puts into <code>memory.max</code>, <code>memory.swap.max</code>, <code>cpu.max</code> and <code>pids.max</code>. Then check them from inside such a container. What would change with <code>--memory-swap 256m</code>?</p>
<details><summary>Solution — read the files Docker wrote</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--memory=256m --cpus=1.5 --pids-limit=100</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 4: check your prediction — docker run --memory 256m --cpus 1.5 --pids-limit 100<br>
$ cd /sys/fs/cgroup<br>
$ cat memory.max memory.swap.max cpu.max pids.max<br>
268435456<br>
268435456<br>
150000 100000<br>
100<br>
$ echo "256 MiB = $((256 * 1024 * 1024)) bytes; 1.5 CPU = $((150000)) us per 100000 us"<br>
256 MiB = 268435456 bytes; 1.5 CPU = 150000 us per 100000 us</div>
<p>256 MiB = 256 × 1024 × 1024 = <strong>268435456</strong> bytes in <code>memory.max</code>. <code>memory.swap.max</code> is also <strong>268435456</strong>: without <code>--memory-swap</code>, Docker allows as much swap as memory (slide 17). <code>--cpus 1.5</code> becomes <strong><code>150000 100000</code></strong> — one and a half CPUs' worth of time in every 100 ms period, usable by several threads in parallel. <code>pids.max</code> is <strong>100</strong>. With <code>--memory-swap 256m</code>, RAM + swap together may not exceed 256 MiB, so <code>memory.swap.max</code> becomes <strong>0</strong> and the OOM kill comes at the RAM limit.</p>
</details>`,
    `<h3>🧪 Bài 4 — đoán trước các tệp cgroup của một lệnh docker run (10 phút)</h3>
<p>Không chạy gì cả, hãy viết ra bốn giá trị mà <code>docker run --memory 256m --cpus 1.5 --pids-limit 100 …</code> đặt vào <code>memory.max</code>, <code>memory.swap.max</code>, <code>cpu.max</code> và <code>pids.max</code>. Rồi kiểm chúng từ bên trong một container như vậy. Thêm <code>--memory-swap 256m</code> thì cái gì đổi?</p>
<details><summary>Lời giải — đọc các tệp Docker đã ghi</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--memory=256m --cpus=1.5 --pids-limit=100</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 4: kiểm dự đoán của bạn — docker run --memory 256m --cpus 1.5 --pids-limit 100<br>
$ cd /sys/fs/cgroup<br>
$ cat memory.max memory.swap.max cpu.max pids.max<br>
268435456<br>
268435456<br>
150000 100000<br>
100<br>
$ echo "256 MiB = $((256 * 1024 * 1024)) bytes; 1.5 CPU = $((150000)) us per 100000 us"<br>
256 MiB = 268435456 bytes; 1.5 CPU = 150000 us per 100000 us</div>
<p>256 MiB = 256 × 1024 × 1024 = <strong>268435456</strong> byte trong <code>memory.max</code>. <code>memory.swap.max</code> cũng là <strong>268435456</strong>: không có <code>--memory-swap</code>, Docker cho swap bằng bộ nhớ (slide 17). <code>--cpus 1.5</code> thành <strong><code>150000 100000</code></strong> — thời gian của một CPU rưỡi trong mỗi chu kỳ 100 ms, nhiều luồng dùng song song được. <code>pids.max</code> là <strong>100</strong>. Với <code>--memory-swap 256m</code>, RAM + swap cộng lại không được quá 256 MiB, nên <code>memory.swap.max</code> thành <strong>0</strong> và OOM-kill xảy ra ngay ở giới hạn RAM.</p>
</details>`),
    bi(`<h3>🧪 Exercise 5 — why "RUN rm" did not shrink the image (10 min)</h3>
<p>A teammate's Dockerfile downloads a 20 MB archive in one <code>RUN</code> and deletes it in the next <code>RUN</code>, expecting the image to stay small. Reproduce the situation with overlayfs by hand: a lower layer with a 20 MB file, an upper layer, delete the file through the merged view, then measure both layers. What is in the upper layer, and how should the Dockerfile be written?</p>
<details><summary>Solution — the bytes stay in the lower layer</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 5: "RUN rm" in a later layer does not make an image smaller — measured with overlayfs<br>
$ head -c 20M /dev/zero &gt; base/node_modules.tar; du -sh base | cut -f1<br>
20M<br>
$ mount -t overlay overlay -o lowerdir=base,upperdir=up,workdir=work merged<br>
$ rm merged/node_modules.tar; ls merged | wc -l<br>
0<br>
$ ls -l up | tail -n +2<br>
c--------- 2 root root 0, 0 Oct 26 09:10 node_modules.tar<br>
$ du -sh base up | tr '\\t' ' '<br>
20M base<br>
0 up</div>
<p>After <code>rm</code>, the merged view is empty (<code>ls merged | wc -l</code> = 0), but <code>du</code> shows the lower layer still holds <strong>20M</strong> and the upper layer <strong>0</strong>: the only thing the delete created is a <strong>whiteout</strong> — the character device <code>c--------- 0, 0 node_modules.tar</code> — that hides the file (slide 18). An image is the sum of its layers, so the 20 MB are still downloaded and stored. Write the download, use and delete in <strong>one</strong> <code>RUN</code> (<code>RUN curl … &amp;&amp; tar x … &amp;&amp; rm …</code>), or build in a separate stage and <code>COPY --from=build</code> only the result (multi-stage build). <code>docker history &lt;image&gt;</code> shows the size of every layer — the place to find such leftovers.</p>
</details>`,
    `<h3>🧪 Bài 5 — vì sao "RUN rm" không làm image nhỏ đi (10 phút)</h3>
<p>Dockerfile của một đồng đội tải một tệp nén 20 MB trong một <code>RUN</code> và xoá nó ở <code>RUN</code> kế tiếp, mong image vẫn nhỏ. Hãy tái hiện tình huống bằng overlayfs tự dựng: một lớp dưới có tệp 20 MB, một lớp trên, xoá tệp qua góc nhìn merged, rồi đo cả hai lớp. Lớp trên chứa gì, và nên viết Dockerfile thế nào?</p>
<details><summary>Lời giải — các byte vẫn nằm ở lớp dưới</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 5: "RUN rm" ở lớp sau không làm image nhỏ đi — đo bằng overlayfs<br>
$ head -c 20M /dev/zero &gt; base/node_modules.tar; du -sh base | cut -f1<br>
20M<br>
$ mount -t overlay overlay -o lowerdir=base,upperdir=up,workdir=work merged<br>
$ rm merged/node_modules.tar; ls merged | wc -l<br>
0<br>
$ ls -l up | tail -n +2<br>
c--------- 2 root root 0, 0 Oct 26 09:10 node_modules.tar<br>
$ du -sh base up | tr '\\t' ' '<br>
20M base<br>
0 up</div>
<p>Sau <code>rm</code>, góc nhìn merged trống (<code>ls merged | wc -l</code> = 0), nhưng <code>du</code> cho thấy lớp dưới vẫn giữ <strong>20M</strong> và lớp trên <strong>0</strong>: thứ duy nhất lệnh xoá tạo ra là một <strong>whiteout</strong> — thiết bị ký tự <code>c--------- 0, 0 node_modules.tar</code> — che tệp đi (slide 18). Một image là tổng các lớp của nó, nên 20 MB vẫn bị tải về và lưu trữ. Hãy viết tải về, dùng và xoá trong <strong>một</strong> <code>RUN</code> (<code>RUN curl … &amp;&amp; tar x … &amp;&amp; rm …</code>), hoặc build ở một stage riêng rồi <code>COPY --from=build</code> chỉ phần kết quả (multi-stage build). <code>docker history &lt;image&gt;</code> hiện kích thước từng lớp — chỗ để tìm những thứ sót lại kiểu này.</p>
</details>`),
    bi(`<h3>🧪 Exercise 6 — what does my program see inside a 128 MiB container? (15 min)</h3>
<p>In a container started with <code>--memory 128m</code>, run <code>free -m</code>, read <code>/proc/meminfo</code> and <code>/sys/fs/cgroup/memory.max</code>, ask Node for <code>os.totalmem()</code> and <code>process.constrainedMemory()</code>, and ask the JVM for its maximum heap. Which numbers are right, which are the host's, and what does this mean for a Node or Java service?</p>
<details><summary>Solution — four tools, two different answers</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--memory=128m</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 24 · exercise 6: what does a program "see" inside a container limited to 128 MiB?<br>
$ free -m | awk 'NR==1 || NR==2 {print $1, $2}'<br>
total used<br>
Mem: 7934<br>
$ grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
$ cat /sys/fs/cgroup/memory.max<br>
134217728<br>
$ node -e 'const os = require("os"); console.log("os.totalmem() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=", os.totalmem()); console.log("process.constrainedMemory() =", process.constrainedMemory())'<br>
os.totalmem() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 8319504384<br>
process.constrainedMemory() = 134217728<br>
$ java -XX:+PrintFlagsFinal -version 2&gt;/dev/null | grep -E ' MaxHeapSize | MaxRAMPercentage | UseContainerSupport '<br>
&nbsp;&nbsp;&nbsp;size_t MaxHeapSize &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 67108864 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{product} {ergonomic}<br>
&nbsp;&nbsp;&nbsp;double MaxRAMPercentage &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 25.000000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{product} {default}<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bool UseContainerSupport &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{product} {default}</div>
<p><code>free</code> and <code>/proc/meminfo</code> show the <strong>whole machine</strong> (7934 MiB here — the Docker VM), because <code>/proc/meminfo</code> is not namespaced; Node's <code>os.totalmem()</code> reads the same source (8.3 GB). The container's real limit is <code>memory.max = 134217728</code> (128 MiB), and Node's <code>process.constrainedMemory()</code> returns exactly that. The JVM reads the cgroup too (<code>UseContainerSupport = true</code>) and sizes its heap at <strong>64 MiB</strong>, i.e. 50 % — for small memory it applies <code>MinRAMPercentage</code> (default 50) instead of <code>MaxRAMPercentage</code> (25). For services: size the heap from the cgroup limit, leave room for non-heap memory (Node: <code>--max-old-space-size</code> about 70–75 % of the limit; Java: <code>-XX:MaxRAMPercentage=60–75</code>), and never trust <code>free</code> inside a container (slide 24, CS.5).</p>
</details>`,
    `<h3>🧪 Bài 6 — chương trình của tôi thấy gì trong một container 128 MiB? (15 phút)</h3>
<p>Trong một container chạy với <code>--memory 128m</code>, hãy chạy <code>free -m</code>, đọc <code>/proc/meminfo</code> và <code>/sys/fs/cgroup/memory.max</code>, hỏi Node <code>os.totalmem()</code> và <code>process.constrainedMemory()</code>, và hỏi JVM heap tối đa của nó. Con số nào đúng, con số nào là của máy chủ, và điều đó có nghĩa gì với một dịch vụ Node hay Java?</p>
<details><summary>Lời giải — bốn công cụ, hai câu trả lời khác nhau</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--memory=128m</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 24 · bài 6: một chương trình "thấy" gì bên trong container bị giới hạn 128 MiB?<br>
$ free -m | awk 'NR==1 || NR==2 {print $1, $2}'<br>
total used<br>
Mem: 7934<br>
$ grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
$ cat /sys/fs/cgroup/memory.max<br>
134217728<br>
$ node -e 'const os = require("os"); console.log("os.totalmem() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=", os.totalmem()); console.log("process.constrainedMemory() =", process.constrainedMemory())'<br>
os.totalmem() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 8319504384<br>
process.constrainedMemory() = 134217728<br>
$ java -XX:+PrintFlagsFinal -version 2&gt;/dev/null | grep -E ' MaxHeapSize | MaxRAMPercentage | UseContainerSupport '<br>
&nbsp;&nbsp;&nbsp;size_t MaxHeapSize &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 67108864 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{product} {ergonomic}<br>
&nbsp;&nbsp;&nbsp;double MaxRAMPercentage &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 25.000000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{product} {default}<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bool UseContainerSupport &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{product} {default}</div>
<p><code>free</code> và <code>/proc/meminfo</code> hiện <strong>cả máy</strong> (ở đây 7934 MiB — máy ảo của Docker), vì <code>/proc/meminfo</code> không được namespace hoá; <code>os.totalmem()</code> của Node đọc cùng nguồn đó (8,3 GB). Giới hạn thật của container là <code>memory.max = 134217728</code> (128 MiB), và <code>process.constrainedMemory()</code> của Node trả đúng con số đó. JVM cũng đọc cgroup (<code>UseContainerSupport = true</code>) và đặt heap <strong>64 MiB</strong>, tức 50 % — với bộ nhớ nhỏ nó áp <code>MinRAMPercentage</code> (mặc định 50) thay cho <code>MaxRAMPercentage</code> (25). Với dịch vụ: đặt kích thước heap theo giới hạn cgroup, chừa chỗ cho bộ nhớ ngoài heap (Node: <code>--max-old-space-size</code> khoảng 70–75 % giới hạn; Java: <code>-XX:MaxRAMPercentage=60–75</code>), và đừng bao giờ tin <code>free</code> bên trong container (slide 24, CS.5).</p>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>container</strong></td><td>container</td><td>A process (tree) isolated by namespaces, limited by cgroups, with its own root filesystem and reduced privileges, sharing the host kernel.</td></tr>
<tr><td><strong>virtual machine</strong></td><td>máy ảo</td><td>A guest operating system with its own kernel running on virtual hardware provided by a hypervisor.</td></tr>
<tr><td><strong>namespace</strong></td><td>vùng tên</td><td>A kernel feature that gives a process its own view of one resource: pid, mnt, net, uts, ipc, user, cgroup or time.</td></tr>
<tr><td><strong>unshare / nsenter</strong></td><td>tạo / gia nhập namespace</td><td>unshare runs a program in new namespaces; nsenter joins the namespaces of an existing process (setns), like docker exec.</td></tr>
<tr><td><strong>user namespace / rootless</strong></td><td>vùng tên người dùng / không cần root</td><td>Maps uid 0 inside to an ordinary uid outside; rootless Docker and Podman run whole engines this way.</td></tr>
<tr><td><strong>cgroup (control group)</strong></td><td>nhóm điều khiển</td><td>A group of processes with resource limits, managed as a directory under /sys/fs/cgroup in cgroup v2.</td></tr>
<tr><td><strong>memory.max / OOM killer</strong></td><td>trần bộ nhớ / bộ giết khi hết bộ nhớ</td><td>Above memory.max the kernel reclaims, then SIGKILLs a process in the cgroup: exit code 137, oom_kill in memory.events.</td></tr>
<tr><td><strong>pids.max</strong></td><td>trần số tác vụ</td><td>Maximum number of tasks (processes and threads) in a cgroup; fork and pthread_create fail with EAGAIN beyond it.</td></tr>
<tr><td><strong>cpu.max / throttling</strong></td><td>hạn ngạch CPU / bị hãm</td><td>"quota period" in microseconds; once the quota is used, the group waits for the next period (nr_throttled in cpu.stat).</td></tr>
<tr><td><strong>overlayfs</strong></td><td>hệ thống tệp chồng lớp</td><td>Merges read-only lower layers and one writable upper layer into one view; the base of Docker image layers.</td></tr>
<tr><td><strong>copy-up / whiteout</strong></td><td>chép lên / tệp che</td><td>Modifying a lower file copies it into the upper layer first; deleting it creates a char device 0,0 that hides it.</td></tr>
<tr><td><strong>capability</strong></td><td>năng lực đặc quyền</td><td>One slice of root's power (CAP_SYS_ADMIN, CAP_NET_ADMIN…); a default container keeps 14 of about 41.</td></tr>
<tr><td><strong>seccomp</strong></td><td>bộ lọc lời gọi hệ thống</td><td>A BPF filter that allows, refuses or kills on each system call; Docker's default profile blocks about 44 calls.</td></tr>
<tr><td><strong>--privileged</strong></td><td>chế độ đặc quyền toàn phần</td><td>All capabilities, no seccomp, host devices visible: for labs only, never for applications.</td></tr>
<tr><td><strong>runc / OCI runtime</strong></td><td>trình chạy container chuẩn OCI</td><td>The low-level program that reads config.json and asks the kernel for cgroups, namespaces, root and privileges, then execs the app.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>container</strong></td><td>container</td><td>Một tiến trình (hoặc cây tiến trình) được cách ly bằng namespace, giới hạn bằng cgroup, có hệ thống tệp gốc riêng và đặc quyền bị cắt bớt, dùng chung nhân của máy chủ.</td></tr>
<tr><td><strong>virtual machine</strong></td><td>máy ảo</td><td>Một hệ điều hành khách có nhân riêng chạy trên phần cứng ảo do hypervisor cung cấp.</td></tr>
<tr><td><strong>namespace</strong></td><td>vùng tên</td><td>Tính năng nhân cho tiến trình một góc nhìn riêng về một loại tài nguyên: pid, mnt, net, uts, ipc, user, cgroup hoặc time.</td></tr>
<tr><td><strong>unshare / nsenter</strong></td><td>tạo / gia nhập namespace</td><td>unshare chạy chương trình trong namespace mới; nsenter gia nhập namespace của một tiến trình có sẵn (setns), giống docker exec.</td></tr>
<tr><td><strong>user namespace / rootless</strong></td><td>vùng tên người dùng / không cần root</td><td>Ánh xạ uid 0 bên trong sang một uid thường bên ngoài; Docker rootless và Podman chạy cả engine theo cách này.</td></tr>
<tr><td><strong>cgroup (control group)</strong></td><td>nhóm điều khiển</td><td>Một nhóm tiến trình có giới hạn tài nguyên, quản lý như một thư mục dưới /sys/fs/cgroup ở cgroup v2.</td></tr>
<tr><td><strong>memory.max / OOM killer</strong></td><td>trần bộ nhớ / bộ giết khi hết bộ nhớ</td><td>Vượt memory.max thì nhân thu hồi, rồi SIGKILL một tiến trình trong cgroup: mã thoát 137, oom_kill trong memory.events.</td></tr>
<tr><td><strong>pids.max</strong></td><td>trần số tác vụ</td><td>Số tác vụ (tiến trình và luồng) tối đa trong cgroup; vượt nó thì fork và pthread_create thất bại với EAGAIN.</td></tr>
<tr><td><strong>cpu.max / throttling</strong></td><td>hạn ngạch CPU / bị hãm</td><td>"hạn ngạch chu kỳ" tính bằng micro giây; dùng hết hạn ngạch thì nhóm chờ tới chu kỳ sau (nr_throttled trong cpu.stat).</td></tr>
<tr><td><strong>overlayfs</strong></td><td>hệ thống tệp chồng lớp</td><td>Trộn các lớp dưới chỉ đọc và một lớp trên ghi được thành một góc nhìn; nền của các lớp image Docker.</td></tr>
<tr><td><strong>copy-up / whiteout</strong></td><td>chép lên / tệp che</td><td>Sửa tệp ở lớp dưới thì nó được chép lên lớp trên trước; xoá nó thì tạo một thiết bị ký tự 0,0 để che đi.</td></tr>
<tr><td><strong>capability</strong></td><td>năng lực đặc quyền</td><td>Một phần quyền lực của root (CAP_SYS_ADMIN, CAP_NET_ADMIN…); container mặc định giữ 14 trên khoảng 41.</td></tr>
<tr><td><strong>seccomp</strong></td><td>bộ lọc lời gọi hệ thống</td><td>Bộ lọc BPF cho phép, từ chối hoặc giết theo từng lời gọi hệ thống; hồ sơ mặc định của Docker chặn khoảng 44 lời gọi.</td></tr>
<tr><td><strong>--privileged</strong></td><td>chế độ đặc quyền toàn phần</td><td>Đủ mọi capability, không seccomp, thấy thiết bị của máy chủ: chỉ dùng cho lab, không bao giờ cho ứng dụng.</td></tr>
<tr><td><strong>runc / OCI runtime</strong></td><td>trình chạy container chuẩn OCI</td><td>Chương trình tầng thấp đọc config.json và xin nhân cgroup, namespace, gốc và đặc quyền, rồi exec ứng dụng.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 CS.6 summary</h2>
<ul>
<li>A container is <strong>not a VM</strong>: it is an ordinary host process (two PIDs: <code>NSpid</code>) sharing the host kernel — <code>uname -r</code> is the same in every image; on a Mac there is one Linux VM underneath.</li>
<li>Recipe: <strong>namespaces</strong> (see) + <strong>cgroups</strong> (use) + <strong>root filesystem</strong> (overlayfs layers) + <strong>capabilities/seccomp</strong> (do); runc asks the kernel for each, then <code>execve</code>s your app.</li>
<li>8 namespaces — pid, mnt, net, uts, ipc, user, cgroup, time — visible in <code>/proc/PID/ns</code>; <code>unshare</code> creates, <code>lsns</code> lists, <code>nsenter</code> joins (= <code>docker exec</code>); a user namespace makes "root inside, nobody outside" (rootless).</li>
<li>cgroup v2 limits are <strong>files</strong>: <code>pids.max</code> → EAGAIN (threads count!), <code>memory.max</code> → OOM kill <strong>137</strong> (<code>memory.events</code>), <code>cpu.max</code> → throttling and latency (<code>nr_throttled</code>).</li>
<li><code>docker run --memory --cpus --pids-limit</code> only writes those files; without <code>--memory-swap</code> you also get the same amount of swap; read the limits from inside with <code>cat /sys/fs/cgroup/…</code>, never with <code>free</code>.</li>
<li>Layers are shared and read-only; <code>RUN rm</code> leaves a whiteout, not free space. Root in a container keeps 14 capabilities and a seccomp filter — <code>--privileged</code> removes the walls; strace on another uid needs <code>SYS_PTRACE</code>.</li>
</ul>`,
    `<h2>📌 Tóm tắt CS.6</h2>
<ul>
<li>Container <strong>không phải máy ảo</strong>: nó là một tiến trình bình thường của máy chủ (hai PID: <code>NSpid</code>) dùng chung nhân với máy chủ — <code>uname -r</code> giống nhau ở mọi image; trên Mac có một máy ảo Linux ở bên dưới.</li>
<li>Công thức: <strong>namespace</strong> (nhìn) + <strong>cgroup</strong> (dùng) + <strong>hệ thống tệp gốc</strong> (các lớp overlayfs) + <strong>capability/seccomp</strong> (làm); runc xin nhân từng thứ, rồi <code>execve</code> ứng dụng của bạn.</li>
<li>8 namespace — pid, mnt, net, uts, ipc, user, cgroup, time — thấy trong <code>/proc/PID/ns</code>; <code>unshare</code> tạo, <code>lsns</code> liệt kê, <code>nsenter</code> gia nhập (= <code>docker exec</code>); user namespace cho "root bên trong, người thường bên ngoài" (rootless).</li>
<li>Giới hạn cgroup v2 là <strong>tệp</strong>: <code>pids.max</code> → EAGAIN (luồng cũng tính!), <code>memory.max</code> → OOM-kill <strong>137</strong> (<code>memory.events</code>), <code>cpu.max</code> → bị hãm và tăng độ trễ (<code>nr_throttled</code>).</li>
<li><code>docker run --memory --cpus --pids-limit</code> chỉ ghi các tệp đó; không có <code>--memory-swap</code> thì còn được thêm chừng ấy swap; đọc giới hạn từ bên trong bằng <code>cat /sys/fs/cgroup/…</code>, đừng bao giờ bằng <code>free</code>.</li>
<li>Các lớp image dùng chung và chỉ đọc; <code>RUN rm</code> để lại whiteout, không giải phóng chỗ. Root trong container giữ 14 capability và một bộ lọc seccomp — <code>--privileged</code> dỡ hết tường; strace một uid khác cần <code>SYS_PTRACE</code>.</li>
</ul>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-cs6) — 10 câu ───────── */
const QUIZ_CS6 = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'Inside a container built from the alpine image on an Ubuntu 24.04 server, what does uname -r print?|||Bên trong một container dựng từ image alpine trên một server Ubuntu 24.04, uname -r in ra gì?',
      options: ['The kernel version of the Ubuntu host|||Phiên bản nhân của máy chủ Ubuntu', 'The kernel version that ships inside the alpine image|||Phiên bản nhân đi kèm trong image alpine', 'Nothing — containers have no kernel, so the command fails|||Không gì cả — container không có nhân nên lệnh thất bại', 'The version of the Docker engine|||Phiên bản của Docker engine'],
      correctIndex: 0,
      points: 1,
      explanation: 'uname is a system call answered by the running kernel, and every container on a host shares that one kernel; an image contains only user-space files (shell, libraries, your program), never a kernel that boots. Measured in the lesson: Debian and Alpine containers both printed 7.0.12-linuxkit. Lesson CS.6, slides 3–4.|||uname là một lời gọi hệ thống do nhân đang chạy trả lời, và mọi container trên một máy chủ dùng chung đúng một nhân đó; image chỉ chứa tệp của không gian người dùng (shell, thư viện, chương trình của bạn), không bao giờ có nhân để khởi động. Đo trong bài: container Debian và Alpine đều in 7.0.12-linuxkit. Bài CS.6, slide 3–4.' },
    { id: 'q2',
      question: 'Two containers on the same host both listen on port 8080 without any conflict. Which namespace makes that possible?|||Hai container trên cùng một máy chủ cùng lắng nghe cổng 8080 mà không xung đột. Namespace nào làm được điều đó?',
      options: ['pid|||pid', 'net|||net', 'uts|||uts', 'ipc|||ipc'],
      correctIndex: 1,
      points: 1,
      explanation: 'The network namespace gives each container its own interfaces, IP addresses, routing table and port space, so port 8080 in one is unrelated to port 8080 in the other; Docker connects them to the docker0 bridge with a veth pair. pid isolates process numbers, uts the hostname, ipc System V IPC and message queues. Lesson CS.6, slides 7 and 9.|||Network namespace cho mỗi container giao diện, địa chỉ IP, bảng định tuyến và không gian cổng riêng, nên cổng 8080 ở container này chẳng liên quan gì tới cổng 8080 ở container kia; Docker nối chúng vào bridge docker0 bằng một cặp veth. pid cách ly số tiến trình, uts cách ly hostname, ipc cách ly IPC System V và hàng đợi thông điệp. Bài CS.6, slide 7 và 9.' },
    { id: 'q3',
      question: 'A container is started with docker run --cpus 1.5. What does /sys/fs/cgroup/cpu.max contain inside it?|||Một container chạy với docker run --cpus 1.5. Bên trong nó, /sys/fs/cgroup/cpu.max chứa gì?',
      options: ['1.5|||1.5', 'max 150000|||max 150000', '150000 100000|||150000 100000', '1500 1000|||1500 1000'],
      correctIndex: 2,
      points: 1,
      explanation: "Read for real inside a container started with --cpus=1.5. cpu.max holds \"quota period\" in microseconds: 150 000 µs of CPU time in every 100 000 µs period, i.e. one and a half CPUs' worth that several threads can use in parallel. Once the quota is used up, the whole group is throttled until the next period. Lesson CS.6, slides 15–16; practice exercise 4.|||Đọc thật bên trong một container chạy với --cpus=1.5. cpu.max chứa \"hạn ngạch chu kỳ\" tính bằng micro giây: 150 000 µs thời gian CPU trong mỗi chu kỳ 100 000 µs, tức lượng của một CPU rưỡi mà nhiều luồng dùng song song được. Dùng hết hạn ngạch thì cả nhóm bị hãm tới chu kỳ sau. Bài CS.6, slide 15–16; bài thực hành 4." },
    { id: 'q4',
      question: "A pod restarts with Exit Code 137 and Reason OOMKilled. Inside the container's cgroup, which file records that the kernel ran the OOM killer?|||Một pod khởi động lại với Exit Code 137 và Reason OOMKilled. Trong cgroup của container, tệp nào ghi lại rằng nhân đã chạy OOM killer?",
      options: ['cpu.stat|||cpu.stat', 'pids.events|||pids.events', 'cgroup.procs|||cgroup.procs', 'memory.events|||memory.events'],
      correctIndex: 3,
      points: 1,
      explanation: "memory.events counts how often usage hit memory.max (max), how often the OOM killer was invoked (oom) and how many processes it killed (oom_kill) — and it survives the killed process, so it is evidence after the fact; Docker's OOMKilled flag is derived from it. The kill itself is a SIGKILL, hence 137 = 128 + 9. pids.events counts refused forks, cpu.stat CPU time and throttling. Lesson CS.6, slides 14 and 17.|||memory.events đếm số lần mức dùng chạm memory.max (max), số lần OOM killer được gọi (oom) và số tiến trình nó đã giết (oom_kill) — và nó sống lâu hơn tiến trình bị giết, nên là bằng chứng sau sự cố; cờ OOMKilled của Docker lấy từ đó. Bản thân vụ giết là SIGKILL, nên 137 = 128 + 9. pids.events đếm số lần fork bị từ chối, cpu.stat là thời gian CPU và việc bị hãm. Bài CS.6, slide 14 và 17." },
    { id: 'q5',
      question: 'A Java service in a container with --pids-limit 50 fails with OutOfMemoryError: unable to create native thread, although memory is mostly free. What is the cause?|||Một dịch vụ Java trong container có --pids-limit 50 hỏng với OutOfMemoryError: unable to create native thread, dù bộ nhớ còn trống gần hết. Nguyên nhân là gì?',
      options: ["pids.max counts threads too, so the JVM's own threads plus the application's reach 50 and pthread_create fails with EAGAIN|||pids.max đếm cả luồng, nên luồng riêng của JVM cộng luồng của ứng dụng chạm 50 và pthread_create thất bại với EAGAIN", 'The Java heap is full and the garbage collector cannot free space|||Heap Java đầy và bộ dọn rác không giải phóng được chỗ', 'The container has no swap, so the JVM cannot reserve thread stacks|||Container không có swap nên JVM không giữ được ngăn xếp cho luồng', "The JVM is not container-aware and reads the host's memory size|||JVM không biết mình trong container và đọc dung lượng bộ nhớ của máy chủ"],
      correctIndex: 0,
      points: 1,
      explanation: 'For the Linux kernel a thread is a task like a process, and pids.max limits tasks. In the practice run the JVM started about 31 threads of the program before pthread_create returned EAGAIN — its own GC, JIT and housekeeping threads used the rest — and Java reports that failure under the misleading name OutOfMemoryError. The JVM is container-aware since JDK 10, and heap or swap have nothing to do with it. Lesson CS.6, slide 13; practice exercise 2.|||Với nhân Linux, một luồng là một tác vụ như tiến trình, và pids.max giới hạn tác vụ. Trong lần chạy ở bài thực hành, JVM khởi động được khoảng 31 luồng của chương trình rồi pthread_create trả EAGAIN — các luồng GC, JIT và việc vặt của chính JVM dùng phần còn lại — và Java báo lỗi đó dưới cái tên gây hiểu lầm OutOfMemoryError. JVM biết mình ở trong container từ JDK 10, còn heap hay swap không dính gì ở đây. Bài CS.6, slide 13; bài thực hành 2.' },
    { id: 'q6',
      question: 'A container is started with --memory 256m and no --memory-swap. What does /sys/fs/cgroup/memory.swap.max contain?|||Một container chạy với --memory 256m và không có --memory-swap. /sys/fs/cgroup/memory.swap.max chứa gì?',
      options: ['0|||0', '268435456|||268435456', 'max|||max', '536870912|||536870912'],
      correctIndex: 1,
      points: 1,
      explanation: 'Read for real inside a container started with --memory=256m. Without --memory-swap, Docker lets the container use as much swap as its memory limit; in cgroup v2 memory.swap.max counts swap only, so it holds 256 MiB = 268435456 bytes and RAM + swap can reach about 512 MiB before the OOM kill. --memory-swap 256m (RAM + swap total) would write 0. Lesson CS.6, slides 16–17.|||Đọc thật bên trong một container chạy với --memory=256m. Không có --memory-swap, Docker cho container dùng lượng swap bằng giới hạn bộ nhớ; ở cgroup v2 memory.swap.max chỉ tính swap, nên nó chứa 256 MiB = 268435456 byte và RAM + swap có thể lên tới khoảng 512 MiB trước khi bị OOM-kill. --memory-swap 256m (tổng RAM + swap) sẽ ghi 0. Bài CS.6, slide 16–17.' },
    { id: 'q7',
      question: 'In a shell started with unshare --pid bash (no --fork), the first ls works but the second fails with "fork: Cannot allocate memory". Why?|||Trong một shell chạy bằng unshare --pid bash (không có --fork), lệnh ls đầu tiên chạy được nhưng lần thứ hai thất bại với "fork: Cannot allocate memory". Vì sao?',
      options: ['The new namespace has a memory limit of zero until --mount-proc is given|||Namespace mới có giới hạn bộ nhớ bằng 0 cho tới khi có --mount-proc', 'bash itself became PID 1 and refuses to fork more than once|||Chính bash đã thành PID 1 và từ chối fork quá một lần', 'The first ls became PID 1 of the new namespace and exited; a PID namespace whose init has died accepts no new processes|||Lệnh ls đầu tiên thành PID 1 của namespace mới rồi thoát; một PID namespace có init đã chết không nhận thêm tiến trình nào', 'The kernel allows only one process per PID namespace|||Nhân chỉ cho phép một tiến trình trong mỗi PID namespace'],
      correctIndex: 2,
      points: 1,
      explanation: 'unshare(CLONE_NEWPID) never moves the caller (a process cannot change its PID), only its future children; so bash stays outside and its first child becomes PID 1 — the init — of the new namespace. When that child exits, the namespace has no init and every later fork into it fails (the kernel reports ENOMEM). --fork makes a long-lived child the init. Measured in the lesson. Lesson CS.6, slide 8.|||unshare(CLONE_NEWPID) không bao giờ chuyển tiến trình gọi (một tiến trình không đổi được PID của mình), chỉ chuyển các con sau này của nó; nên bash ở lại bên ngoài và đứa con đầu tiên của nó thành PID 1 — init — của namespace mới. Khi đứa con đó thoát, namespace không còn init và mọi lần fork vào đó đều thất bại (nhân báo ENOMEM). --fork cho một đứa con sống lâu làm init. Đo thật trong bài. Bài CS.6, slide 8.' },
    { id: 'q8',
      question: 'A Dockerfile downloads a 20 MB archive in one RUN and deletes it with RUN rm in the next instruction. What happens to the image size?|||Một Dockerfile tải tệp nén 20 MB trong một lệnh RUN và xoá nó bằng RUN rm ở lệnh kế tiếp. Kích thước image thay đổi ra sao?',
      options: ['It shrinks by 20 MB, because the file is gone|||Nó nhỏ đi 20 MB, vì tệp đã mất', 'It shrinks by 20 MB only after docker image prune|||Nó chỉ nhỏ đi 20 MB sau khi chạy docker image prune', 'It grows by 40 MB, because deletion copies the file up first|||Nó lớn thêm 40 MB, vì lệnh xoá phải chép tệp lên trước', 'It does not shrink: the 20 MB stay in the earlier layer and the later layer only adds a whiteout|||Nó không nhỏ đi: 20 MB vẫn nằm ở lớp trước và lớp sau chỉ thêm một whiteout'],
      correctIndex: 3,
      points: 1,
      explanation: 'Image layers are read-only overlayfs lower layers; deleting a lower file creates a whiteout (a character device 0,0) in the layer above, which hides the file but frees nothing. Measured in practice exercise 5: lower layer 20M, upper layer 0 plus the whiteout. Download, use and delete in one RUN, or use a multi-stage build. Copy-up happens on modification, not on deletion. Lesson CS.6, slide 18.|||Các lớp image là lớp dưới chỉ đọc của overlayfs; xoá một tệp ở lớp dưới tạo ra một whiteout (thiết bị ký tự 0,0) ở lớp trên, che tệp đi nhưng không giải phóng gì. Đo trong bài thực hành 5: lớp dưới 20M, lớp trên 0 cộng một whiteout. Hãy tải, dùng và xoá trong một RUN, hoặc dùng multi-stage build. Copy-up xảy ra khi sửa, không phải khi xoá. Bài CS.6, slide 18.' },
    { id: 'q9',
      question: 'In a default Docker container, running as uid 0, hostname test fails with "you must be root to change the host name". What is the real reason?|||Trong một container Docker mặc định, chạy với uid 0, lệnh hostname test thất bại với "you must be root to change the host name". Lý do thật là gì?',
      options: ['The container lacks CAP_SYS_ADMIN, which sethostname() requires|||Container thiếu CAP_SYS_ADMIN, thứ mà sethostname() đòi hỏi', 'The container does not have its own UTS namespace|||Container không có UTS namespace riêng', 'The seccomp profile kills every process that calls sethostname()|||Hồ sơ seccomp giết mọi tiến trình gọi sethostname()', 'uid 0 inside a container is mapped to nobody on the host|||uid 0 trong container được ánh xạ sang nobody trên máy chủ'],
      correctIndex: 0,
      points: 1,
      explanation: "Root's power is split into capabilities and a default container keeps 14 of them — CAP_SYS_ADMIN is not among them, so sethostname() returns EPERM and the tool guesses \"must be root\". The container does have its own UTS namespace (with --privileged or --cap-add SYS_ADMIN the same command works and changes only the container's name), seccomp does not kill here, and default Docker does not remap uid 0. Lesson CS.6, slide 19.|||Quyền lực của root được chia thành các capability và một container mặc định giữ 14 cái — CAP_SYS_ADMIN không nằm trong đó, nên sethostname() trả EPERM và công cụ đoán là \"must be root\". Container có UTS namespace riêng (với --privileged hoặc --cap-add SYS_ADMIN cùng lệnh đó chạy được và chỉ đổi tên của container), seccomp không giết ở đây, và Docker mặc định không ánh xạ lại uid 0. Bài CS.6, slide 19." },
    { id: 'q10',
      question: 'A cgroup has cpu.max = "20000 100000". A request needing 30 ms of CPU starts exactly at the beginning of a period, with nothing else running in the cgroup. In the simple model of CFS bandwidth control, what is its wall-clock time?|||Một cgroup có cpu.max = "20000 100000". Một request cần 30 ms CPU bắt đầu đúng đầu một chu kỳ, trong cgroup không có gì khác chạy. Theo mô hình đơn giản của CFS bandwidth control, thời gian tường của nó là bao nhiêu?',
      options: ['30 ms|||30 ms', '150 ms|||150 ms', '110 ms|||110 ms', '50 ms|||50 ms'],
      correctIndex: 2,
      points: 1,
      explanation: 'Computed by the simulation of slide 15: the request runs 20 ms, the quota is used up, it is throttled for the remaining 80 ms of the period, then runs its last 10 ms in the next period: 20 + 80 + 10 = 110 ms of wall time for 30 ms of CPU. The real measurement in practice exercise 3 gave 91–197 ms depending on where in the period each request started. Lesson CS.6, slide 15.|||Mô phỏng ở slide 15 tính ra: request chạy 20 ms, hết hạn ngạch, bị hãm 80 ms còn lại của chu kỳ, rồi chạy 10 ms cuối trong chu kỳ sau: 20 + 80 + 10 = 110 ms thời gian tường cho 30 ms CPU. Đo thật ở bài thực hành 3 ra 91–197 ms tuỳ mỗi request bắt đầu ở đâu trong chu kỳ. Bài CS.6, slide 15.' },
  ],
};

const QL_cs6 = {
  title: '⭐ CS.6 Quiz — Containers = namespaces + cgroups|||⭐ Quiz CS.6 — Container = namespace + cgroup',
  slug: 'osg202-quiz-cs6',
  type: 'QUIZ',
  description: '10 câu ôn phần ⭐ CS.6 (tự thêm, không thi FE), mỗi câu có giải thích song ngữ, ba câu có đáp án kiểm bằng chạy thật hoặc mô phỏng: container dùng nhân nào, namespace nào cho hai container cùng cổng 8080, cờ --cpus 1.5 ghi gì vào cpu.max, đọc gì khi bị OOMKilled, vì sao Java báo unable to create native thread dưới pids.max, memory.swap.max khi thiếu --memory-swap, unshare --pid thiếu --fork, RUN rm và kích thước image, root trong container không đổi được hostname, và độ trễ của một request dưới cpu.max',
  quiz: QUIZ_CS6,
};

export default {
  lessons: [L_cs1_1, L_cs1_2, L_x_cs1_on, QL_cs1, L_cs3_1, L_cs3_2, L_x_cs3_on, QL_cs3, L_cs6_1, L_cs6_2, L_x_cs6_on, QL_cs6],
};
