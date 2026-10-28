/**
 * Operating Systems for Developers — Chương 10: Các mô hình I/O (soạn 28/10/2026 theo _HOP-DONG.md).
 * Chủ kênh: "server phải xử lí hàng nghìn yêu cầu cùng lúc". Output CHẠY THẬT trong ảnh phụ `os-lab-ch10`
 * (= os-lab + nginx-light 1.28.3, liburing 2.14, wrk — lab/code/ch10/Dockerfile.ch10):
 *   lab/code/ch10/c101-socket.sh       → lab/out/c101-socket       (vòng đời socket, hàng chờ accept, backlog mặc định, giá kết nối)
 *   lab/code/ch10/c102-mo-hinh.sh      → lab/out/c102-mo-hinh      (5 mô hình của Stevens: chặn, không chặn, poll, SIGIO, aio/io_uring)
 *   lab/code/ch10/c103-epoll.sh        → lab/out/c103-epoll        (FD_SETSIZE, giá select/poll/epoll theo N, /proc fdinfo, LT/ET, ONESHOT)
 *   lab/code/ch10/c104-c10k.sh         → lab/out/c104-c10k         (thread-per-connection vs epoll ở 1k/5k/10k, tai.c tự viết)
 *   lab/code/ch10/c104-pids|mem|fd.sh  → lab/out/c104-pids|mem|fd  (ba bức tường: --pids-limit 1000, --memory 192m, ulimit -n 1024)
 *   lab/code/ch10/c105-runtime.sh      → lab/out/c105-runtime      (Node, asyncio, Java NIO, Netty 4.2.19, Go 1.27.3, nginx: strace + tải)
 *   lab/code/ch10/c106-dia.sh          → lab/out/c106-dia          (đĩa ghìm 50 MB/s: page cache, pool libuv, Go chặn luồng OS)
 *   lab/code/ch10/c107-uring.sh        → lab/out/c107-uring        (seccomp=unconfined: io_uring, SQPOLL, echo-uring, libuv, sendfile)
 *   lab/code/ch10/c108-backpressure.sh → lab/out/c108-backpressure (SO_SNDBUF, backpressure Node, slowloris, hạn chờ connect/keepalive)
 * Máy đo: Docker Desktop trên Apple Silicon (arm64, 10 lõi, 7,7 GB cho VM, nhân 7.0.12-linuxkit), Ubuntu 26.04, Node 22.23.4
 * (libuv 1.51.0), Python 3.14.4, Temurin 21.0.12, Go 1.27.3 (go.dev, sha256 khớp), Netty 4.2.19.Final (Maven Central, sha1 khớp).
 * Máy tạo tải chạy CÙNG container với máy chủ (loopback) — số đo để SO SÁNH, không phải để quảng cáo.
 * Ranh giới: fd và bảng file mở ở Ch9 (9.2); EMFILE/ss/TIME_WAIT ở Ch2 (2.5); event loop vs pool Spring ở Ch3 (3.5);
 * EAGAIN/EINTR/EPIPE ở 11.5; Nagle ở 11.3; sendfile/copy_file_range ở 11.4; seccomp ở 11.7.
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần; ${ của bash → \${; \n trong chữ → \\n.
 */
import { run, src, card, kv } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G101 from './giang/os-10-1.mjs';
import G102 from './giang/os-10-2.mjs';
import G103 from './giang/os-10-3.mjs';
import G104 from './giang/os-10-4.mjs';
import G105 from './giang/os-10-5.mjs';
import G106 from './giang/os-10-6.mjs';
import G107 from './giang/os-10-7.mjs';
import G108 from './giang/os-10-8.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const OS = (slug) => '/courses/operating-systems-for-developers/learn?lessonSlug=' + slug;
const OSG = (slug) => '/courses/operating-systems/learn?lessonSlug=' + slug;

export default {
  title: 'Chapter 10 — I/O models|||Chương 10 — Các mô hình I/O',
  description: 'Chờ dữ liệu mà không phí CPU — vì sao nginx và Node ôm được hàng nghìn kết nối, đo thật: một kết nối là một fd và hai hàng chờ (backlog đầy thì SYN bị bỏ, client treo 1–3 s), giá ~3 KB nhân mỗi socket; năm mô hình I/O của Stevens bằng code (chặn, không chặn 4,87 triệu lần hỏi/giây, poll, SIGIO, POSIX aio là luồng trá hình, io_uring); select/poll/epoll (FD_SETSIZE abort 134, 0,7 µs vs 676 µs ở 10.000 fd), level vs edge, EPOLLONESHOT, máy chủ echo epoll; C10K đo ở 1k/5k/10k (10.000 luồng: +156 MiB stack nhân, p99 322 ms vs 0,38 ms; pids/bộ nhớ/fd là ba bức tường); Node, asyncio, Java NIO, Netty, Go, nginx đều trên epoll; đọc file trong event loop (pool libuv 4 luồng làm dns.lookup chờ 0,9 s); io_uring (bị seccomp của Docker chặn, đo trung thực) và sendfile; backpressure, SO_SNDBUF, slowloris và các hạn chờ — kết bằng checklist cho máy chủ xử lý hàng nghìn yêu cầu.',
  lessons: [
    /* ───────────────────────── 10.1 — Một kết nối là một fd ───────────────────────── */
    {
      title: '10.1 — A connection is a file descriptor: sockets, the accept queue, the cost|||10.1 — Một kết nối là một file descriptor: socket, hàng chờ accept, chi phí',
      slug: 'os-10-1-fd',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vòng đời một kết nối theo từng syscall (socket, bind, listen, accept, read, write, close) của một máy chủ echo chặn; socket nghe vs socket kết nối trong /proc và ss; "đã kết nối" chưa phải "đã được accept"; hàng chờ accept đầy: backlog 4 nhận 5, kết nối thứ 6 treo vì SYN bị bỏ, ListenOverflows; backlog mặc định đo thật (Python 5, Java 50, Node 511, nginx 511, somaxconn 4096); 10.000 kết nối nằm im tốn ~3 KB bộ nhớ nhân mỗi socket.',
      content: `${G101}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>A connection is a file descriptor</h2>
<p class="lead">This chapter answers one question the owner of this site asked: <strong>how does one server handle thousands of requests at the same time without wasting CPU?</strong> Before comparing threads, epoll and io_uring, we need to know what the kernel actually keeps for one connection. This lesson answers: <strong>what is a connection to the kernel, where does a client wait before your code ever sees it, and what do ten thousand idle connections cost?</strong> File descriptors themselves (the fd table, dup, fork) were <a href="${OS('os-9-5-fd')}">lesson 9.2</a>, and "too many open files" was <a href="${OS('os-2-5-mang-fd')}">lesson 2.5</a> — here we look at the network side.</p>

<h3>The life of a connection, call by call</h3>
<p>The smallest possible TCP server: one thread, one client at a time. It echoes back whatever it reads.</p>
${src('ch10/echo1.c', 'c')}
${run('c101-socket', 'gcc -O2 -Wall -o echo1 echo1.c')}
<p>We start it under <code>strace</code>, send one line with <code>nc</code>, and read the trace from the first <code>socket()</code>:</p>
${run('c101-socket', 'strace -qq -e trace=socket', 3)}
<p>Read it as a story. <code>socket()</code> returns <strong>fd 3</strong> — a socket is a file descriptor like any other. <code>bind</code> gives it the address 0.0.0.0:7000 and <code>listen(3, 128)</code> turns it into a <strong>listening socket</strong>: it will never carry data, it only collects new connections. <code>accept(3, …)</code> hands out a <strong>new fd 4</strong> for the client; <code>read(4, …)</code> and <code>write(4, …)</code> move the bytes; <code>read</code> returning 0 means the client closed; <code>close(4)</code> gives the fd back. The last line is unfinished — <code>accept(3, NULL, NULL</code> with no result — because the server is asleep inside <code>accept</code>, waiting for the next client.</p>

<h3>One listening socket, one fd per client</h3>
<p>Now a first client connects and stays connected for three seconds. Look at the server's fd table and at <code>ss</code>:</p>
${run('c101-socket', 'E=$(pgrep -x echo1)', 3)}
<p><code>socket:[2059022]</code> is the listening socket, <code>socket:[2059028]</code> the connection; the number is the socket's inode, the same kind of number a file has (<a href="${OS('os-9-1-inode')}">lesson 9.1</a>). <code>ss -tnp</code> joins the two views: the ESTAB connection 127.0.0.1:7000 ↔ 127.0.0.1:35450 belongs to <code>echo1</code>, fd 4. A server with 10,000 clients has 10,001 such fds — that is why the fd limit matters for servers.</p>

<h3>"Connected" is not "accepted"</h3>
<p>While the first client is still connected, a second one sends a line:</p>
${run('c101-socket', "printf 'second", 2)}
<p>The second client got no answer — <code>timeout</code> killed it after one second (exit 124). Yet its TCP connection <em>succeeded</em>: the kernel completed the handshake on its own and put the connection in the <strong>accept queue</strong> of the listening socket. For a LISTEN socket, <code>ss</code> shows that queue: <code>Recv-Q 1</code> = one connection waiting to be accepted, <code>Send-Q 128</code> = the maximum (the backlog we passed to <code>listen</code>). Our server is stuck in <code>read()</code> for client 1, so client 2 waits in the queue — and its "second" sits in the kernel's receive buffer. This is the core problem of a blocking, one-at-a-time server, and the rest of the chapter is about solving it.</p>

<div class="pitfall co-tieu-de">
<p><strong>"The port answers, so the service is healthy."</strong> A TCP check (a load balancer's port probe, <code>nc -z</code>, Docker's <code>HEALTHCHECK</code> that only connects) succeeds as soon as the kernel finishes the handshake — even when your process is frozen, its event loop is blocked or every worker thread is busy. The connection just waits in the accept queue. Health checks must ask the application something (an HTTP <code>/health</code> that returns 200 within a deadline), otherwise a stuck server stays "green".</p>
</div>

<h3>When the accept queue is full</h3>
<p>What if the application never accepts? <code>noaccept</code> listens with a backlog of 4 and then sleeps forever; <code>dial</code> opens 8 connections in a row, each with a 1.5-second limit:</p>
${src('ch10/noaccept.c', 'c')}
${run('c101-socket', './noaccept 4', 4)}
<p>Five connections succeed instantly — Linux lets the queue grow to <em>backlog + 1</em> — and connections 6, 7 and 8 hang. They do not get an error: when the accept queue is full, the kernel <strong>silently drops the client's SYN</strong>, and the client retransmits it after 1 s, 3 s, 7 s… So under overload your users do not see "connection refused", they see requests that take one, three or seven seconds longer, at random. <code>ss</code> shows the full queue (<code>Recv-Q 5</code>, <code>Send-Q 4</code>), and the kernel counts the drops in <code>TcpExtListenOverflows</code> and <code>TcpExtListenDrops</code> (10 here, for three waiting clients and their retries). On a production server, these counters growing (<code>nstat -az | grep Listen</code>) means: <strong>your application is not calling accept fast enough</strong> — a blocked event loop, all threads busy — or the backlog is too small for bursts.</p>
${lab('threadpool', 'overload', 'en', 'Read the queue in this lab as the accept queue: when requests arrive faster than workers finish them, the queue fills, waiting time explodes, and new arrivals are dropped — exactly what the SYN drops above look like from the client.', { tour: 'threadpool-start' })}

<h3>The backlog your runtime actually uses</h3>
<p>Four servers started with their <em>default</em> settings, then one <code>ss</code>:</p>
${run('c101-socket', 'ss -ltnp')}
${run('c101-socket', 'cat /proc/sys/net/core/somaxconn')}
<table>
<tr><th>Server (default)</th><th>Backlog measured</th><th>Where to change it</th></tr>
<tr><td>Python <code>http.server</code> / <code>socketserver</code></td><td>5</td><td><code>request_queue_size</code> class attribute</td></tr>
<tr><td>Java <code>new ServerSocket(port)</code></td><td>50</td><td><code>new ServerSocket(port, backlog)</code>; Tomcat/Spring Boot: <code>server.tomcat.accept-count</code></td></tr>
<tr><td>Node <code>server.listen(port)</code></td><td>511</td><td><code>listen({ port, backlog })</code></td></tr>
<tr><td>nginx <code>listen 8080</code></td><td>511</td><td><code>listen 8080 backlog=4096;</code></td></tr>
<tr><td>the kernel's ceiling</td><td>somaxconn = 4096</td><td>any larger value is silently capped</td></tr>
</table>
<p>A Python dev server queues 5 clients; a burst of 50 simultaneous requests turns into SYN retransmissions. That is one reason development servers are not production servers.</p>

<h3>What ten thousand idle connections cost</h3>
<p>Now an epoll server (lesson 10.3 explains it) and our own load generator <code>tai</code> holding 10,000 idle connections. Before and after, the kernel's socket counters and slab memory (kernel object caches):</p>
${run('c101-socket', './echo-epoll 7000', 4)}
${run('c101-socket', './xem.sh $S')}
<p>20,000 sockets (both ends live in this lab), and the kernel's slab grew from 425,552 kB to 490,848 kB: about <strong>64 MiB for 20,000 sockets, ≈ 3 KB each</strong> (approximate — the Docker VM runs other things too). <code>TCP mem</code> did not move: idle connections hold no data, so their send/receive buffers are empty and cost nothing yet (lesson 10.8 fills them). The server process holds 10,005 fds and 41.6 MiB RSS — that is <em>our</em> choice of a 4 KiB buffer per connection, not the kernel's. Keep these two numbers: ~3 KB in the kernel per idle socket, plus whatever your runtime allocates per connection. Lesson 10.4 shows what a thread per connection adds on top.</p>

<div class="pitfall co-tieu-de">
<p><strong>Raising the backlog to hide a slow accept loop.</strong> A full accept queue is a symptom. If the event loop is blocked for 500 ms by a synchronous call (<a href="${OS('os-3-5-event-loop')}">lesson 3.5</a>), a backlog of 65,535 only means more clients wait longer before timing out. Fix the cause first (why is accept slow?), then size the backlog for bursts — and remember it is capped by <code>net.core.somaxconn</code>.</p>
</div>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> after a deploy, an API's port check is green, but under load some requests take exactly 1 or 3 seconds longer than usual. <code>ss -lnt</code> on the server shows <code>Recv-Q</code> equal to <code>Send-Q</code> on the API port.</p>
<ol>
<li>In the lab, build <code>noaccept.c</code> and <code>dial.c</code>; run <code>./noaccept 4 &amp;</code> then <code>./dial 7100 8 1500</code>. Note which connections hang.</li>
<li>Read <code>ss -ltn '( sport = :7100 )'</code> and <code>nstat -az TcpExtListenOverflows</code> before and after a second <code>dial</code>.</li>
<li>Change the backlog to 16 and repeat: how many connect instantly now?</li>
<li>Explain in two sentences why users saw 1 s and 3 s delays rather than errors.</li>
</ol>
<p><strong>Done when:</strong> you can read <code>Recv-Q</code>/<code>Send-Q</code> of a LISTEN socket, show <code>ListenOverflows</code> growing, and state the fix order: make accept fast again first, size the backlog second.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['socket', 'A kernel object for network communication, used through a file descriptor (read/write/close work on it).'],
  ['listening socket', 'A socket after listen(): it never carries data, it only collects new connections.'],
  ['accept queue (backlog)', 'Connections whose handshake is complete but which accept() has not taken yet; its maximum is the backlog.'],
  ['somaxconn', 'Kernel ceiling for any backlog (4096 here); larger values are silently capped.'],
  ['SYN drop', 'When the accept queue is full the kernel ignores the SYN; the client retries after 1 s, 3 s, 7 s…'],
  ['Recv-Q / Send-Q (LISTEN)', 'For a listening socket in ss: current length / maximum of the accept queue.'],
  ['ListenOverflows', 'Kernel counter of connections dropped because the accept queue was full (nstat).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A connection is an fd: one listening socket per port, plus one new fd from <code>accept()</code> per client.</li>
<li>The kernel finishes the TCP handshake by itself; finished connections wait in the accept queue until your code calls <code>accept()</code>.</li>
<li>A full queue drops SYNs silently: clients see 1 s / 3 s delays, the kernel counts <code>ListenOverflows</code>.</li>
<li>Default backlogs differ a lot (Python 5, Java 50, Node and nginx 511) and are capped by <code>somaxconn</code>.</li>
<li>An idle connection costs about 3 KB of kernel memory plus what your runtime allocates per connection; buffers cost only when data waits.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/listen.2.html', '📄', 'man 2 listen', 'The backlog argument, somaxconn, and what happens when the queue is full.', 'Open')}
${L('https://man7.org/linux/man-pages/man7/tcp.7.html', '📄', 'man 7 tcp', 'TCP sysctls and socket options: tcp_syn_retries, tcp_wmem, keepalive and more.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Một kết nối là một file descriptor</h2>
<p class="lead">Chương này trả lời đúng một câu chủ trang hỏi: <strong>làm sao một máy chủ xử lý hàng nghìn yêu cầu cùng lúc mà không phí CPU?</strong> Trước khi so luồng, epoll và io_uring, ta cần biết nhân thật sự giữ gì cho một kết nối. Bài này trả lời: <strong>với nhân, một kết nối là gì, client chờ ở đâu trước khi code của bạn kịp thấy nó, và mười nghìn kết nối nằm im tốn bao nhiêu?</strong> Bản thân file descriptor (bảng fd, dup, fork) là <a href="${OS('os-9-5-fd')}">bài 9.2</a>, còn "too many open files" là <a href="${OS('os-2-5-mang-fd')}">bài 2.5</a> — ở đây ta nhìn phía mạng.</p>

<h3>Vòng đời một kết nối, từng lời gọi một</h3>
<p>Máy chủ TCP nhỏ nhất có thể: một luồng, mỗi lúc một khách. Nó đọc gì thì gửi lại nấy.</p>
${src('ch10/echo1.c', 'c')}
${run('c101-socket', 'gcc -O2 -Wall -o echo1 echo1.c')}
<p>Ta chạy nó dưới <code>strace</code>, gửi một dòng bằng <code>nc</code>, rồi đọc dấu vết từ lời gọi <code>socket()</code> đầu tiên:</p>
${run('c101-socket', 'strace -qq -e trace=socket', 3)}
<p>Đọc như một câu chuyện. <code>socket()</code> trả về <strong>fd 3</strong> — socket là một file descriptor như mọi fd khác. <code>bind</code> gắn cho nó địa chỉ 0.0.0.0:7000 và <code>listen(3, 128)</code> biến nó thành <strong>socket nghe</strong>: nó không bao giờ chở dữ liệu, nó chỉ gom các kết nối mới. <code>accept(3, …)</code> trao ra một <strong>fd 4 mới</strong> cho khách; <code>read(4, …)</code> và <code>write(4, …)</code> chuyển các byte; <code>read</code> trả 0 nghĩa là khách đã đóng; <code>close(4)</code> trả fd lại. Dòng cuối dở dang — <code>accept(3, NULL, NULL</code> chưa có kết quả — vì máy chủ đang ngủ bên trong <code>accept</code>, chờ khách kế tiếp.</p>

<h3>Một socket nghe, mỗi khách một fd</h3>
<p>Giờ khách thứ nhất kết nối và giữ kết nối ba giây. Nhìn bảng fd của máy chủ và <code>ss</code>:</p>
${run('c101-socket', 'E=$(pgrep -x echo1)', 3)}
<p><code>socket:[2059022]</code> là socket nghe, <code>socket:[2059028]</code> là kết nối; con số là inode của socket, cùng loại số mà một file có (<a href="${OS('os-9-1-inode')}">bài 9.1</a>). <code>ss -tnp</code> ghép hai góc nhìn: kết nối ESTAB 127.0.0.1:7000 ↔ 127.0.0.1:35450 thuộc về <code>echo1</code>, fd 4. Một máy chủ có 10.000 khách thì có 10.001 fd như thế — vì vậy giới hạn fd quan trọng với máy chủ.</p>

<h3>"Đã kết nối" chưa phải "đã được accept"</h3>
<p>Trong lúc khách thứ nhất còn kết nối, khách thứ hai gửi một dòng:</p>
${run('c101-socket', "printf 'second", 2)}
<p>Khách thứ hai không nhận được trả lời — <code>timeout</code> giết nó sau một giây (exit 124). Vậy mà kết nối TCP của nó đã <em>thành công</em>: nhân tự làm xong bắt tay ba bước và đặt kết nối vào <strong>hàng chờ accept</strong> của socket nghe. Với socket LISTEN, <code>ss</code> hiện hàng chờ đó: <code>Recv-Q 1</code> = một kết nối đang chờ được accept, <code>Send-Q 128</code> = mức tối đa (backlog ta truyền cho <code>listen</code>). Máy chủ của ta đang kẹt trong <code>read()</code> cho khách 1, nên khách 2 chờ trong hàng — và chữ "second" của nó nằm trong bộ đệm nhận của nhân. Đây là vấn đề cốt lõi của máy chủ chặn, phục vụ từng khách một, và phần còn lại của chương là để giải nó.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Cổng trả lời, vậy dịch vụ khoẻ."</strong> Một phép kiểm TCP (dò cổng của load balancer, <code>nc -z</code>, <code>HEALTHCHECK</code> của Docker chỉ kết nối) thành công ngay khi nhân bắt tay xong — kể cả khi tiến trình của bạn đứng hình, event loop bị chặn hay mọi luồng worker đều bận. Kết nối chỉ việc nằm chờ trong hàng accept. Health check phải hỏi chính ứng dụng (một HTTP <code>/health</code> trả 200 trong hạn chờ), không thì máy chủ kẹt vẫn "xanh".</p>
</div>

<h3>Khi hàng chờ accept đầy</h3>
<p>Nếu ứng dụng không bao giờ accept thì sao? <code>noaccept</code> nghe với backlog 4 rồi ngủ mãi; <code>dial</code> mở 8 kết nối liên tiếp, mỗi kết nối chờ tối đa 1,5 giây:</p>
${src('ch10/noaccept.c', 'c')}
${run('c101-socket', './noaccept 4', 4)}
<p>Năm kết nối thành công ngay — Linux cho hàng dài tới <em>backlog + 1</em> — còn kết nối 6, 7, 8 treo. Chúng không nhận lỗi: khi hàng chờ accept đầy, nhân <strong>lặng lẽ bỏ gói SYN</strong> của khách, và khách gửi lại SYN sau 1 s, 3 s, 7 s… Nên khi quá tải, người dùng của bạn không thấy "connection refused", họ thấy request chậm thêm một, ba hay bảy giây, ngẫu nhiên. <code>ss</code> hiện hàng đã đầy (<code>Recv-Q 5</code>, <code>Send-Q 4</code>), và nhân đếm các lần bỏ vào <code>TcpExtListenOverflows</code> và <code>TcpExtListenDrops</code> (ở đây là 10, cho ba khách đang chờ và các lần thử lại của họ). Trên máy chủ thật, các bộ đếm này tăng (<code>nstat -az | grep Listen</code>) nghĩa là: <strong>ứng dụng của bạn không gọi accept kịp</strong> — event loop bị chặn, mọi luồng đều bận — hoặc backlog quá nhỏ cho những đợt dồn dập.</p>
${lab('threadpool', 'overload', 'vi', 'Đọc hàng đợi trong phòng lab này như hàng chờ accept: khi request tới nhanh hơn worker làm xong, hàng đầy, thời gian chờ bùng lên, và người tới sau bị bỏ — đúng thứ mà việc bỏ SYN ở trên trông như từ phía client.', { tour: 'threadpool-start' })}

<h3>Backlog mà runtime của bạn thật sự dùng</h3>
<p>Bốn máy chủ chạy với cấu hình <em>mặc định</em>, rồi một lệnh <code>ss</code>:</p>
${run('c101-socket', 'ss -ltnp')}
${run('c101-socket', 'cat /proc/sys/net/core/somaxconn')}
<table>
<tr><th>Máy chủ (mặc định)</th><th>Backlog đo được</th><th>Đổi ở đâu</th></tr>
<tr><td>Python <code>http.server</code> / <code>socketserver</code></td><td>5</td><td>thuộc tính lớp <code>request_queue_size</code></td></tr>
<tr><td>Java <code>new ServerSocket(port)</code></td><td>50</td><td><code>new ServerSocket(port, backlog)</code>; Tomcat/Spring Boot: <code>server.tomcat.accept-count</code></td></tr>
<tr><td>Node <code>server.listen(port)</code></td><td>511</td><td><code>listen({ port, backlog })</code></td></tr>
<tr><td>nginx <code>listen 8080</code></td><td>511</td><td><code>listen 8080 backlog=4096;</code></td></tr>
<tr><td>trần của nhân</td><td>somaxconn = 4096</td><td>giá trị lớn hơn bị cắt lặng lẽ</td></tr>
</table>
<p>Một máy chủ dev Python chỉ xếp hàng 5 khách; một đợt 50 request cùng lúc biến thành những lần gửi lại SYN. Đó là một lý do máy chủ dev không phải máy chủ production.</p>

<h3>Mười nghìn kết nối nằm im tốn bao nhiêu</h3>
<p>Giờ là một máy chủ epoll (bài 10.3 giải thích nó) và máy tạo tải tự viết <code>tai</code> giữ 10.000 kết nối im lặng. Trước và sau: bộ đếm socket của nhân và bộ nhớ slab (bộ đệm đối tượng của nhân):</p>
${run('c101-socket', './echo-epoll 7000', 4)}
${run('c101-socket', './xem.sh $S')}
<p>20.000 socket (cả hai đầu đều nằm trong lab này), và slab của nhân tăng từ 425.552 kB lên 490.848 kB: khoảng <strong>64 MiB cho 20.000 socket, ≈ 3 KB mỗi cái</strong> (gần đúng — VM của Docker còn chạy việc khác). <code>TCP mem</code> không nhúc nhích: kết nối im lặng không giữ dữ liệu, nên bộ đệm gửi/nhận rỗng và chưa tốn gì (bài 10.8 sẽ làm đầy chúng). Tiến trình máy chủ giữ 10.005 fd và RSS 41,6 MiB — đó là lựa chọn của <em>chúng ta</em> (bộ đệm 4 KiB mỗi kết nối), không phải của nhân. Nhớ hai con số này: ~3 KB trong nhân cho mỗi socket nằm im, cộng với thứ runtime của bạn cấp cho mỗi kết nối. Bài 10.4 cho thấy mỗi kết nối một luồng cộng thêm bao nhiêu.</p>

<div class="pitfall co-tieu-de">
<p><strong>Tăng backlog để che một vòng accept chậm.</strong> Hàng chờ accept đầy là triệu chứng. Nếu event loop bị một lời gọi đồng bộ chặn 500 ms (<a href="${OS('os-3-5-event-loop')}">bài 3.5</a>), backlog 65.535 chỉ có nghĩa là nhiều khách hơn chờ lâu hơn rồi hết hạn. Sửa nguyên nhân trước (vì sao accept chậm?), rồi mới chỉnh backlog cho những đợt dồn — và nhớ nó bị <code>net.core.somaxconn</code> chặn trần.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> sau một lần deploy, phép kiểm cổng của API vẫn xanh, nhưng khi tải cao vài request chậm thêm đúng 1 hoặc 3 giây. <code>ss -lnt</code> trên máy chủ cho thấy <code>Recv-Q</code> bằng <code>Send-Q</code> ở cổng API.</p>
<ol>
<li>Trong lab, biên dịch <code>noaccept.c</code> và <code>dial.c</code>; chạy <code>./noaccept 4 &amp;</code> rồi <code>./dial 7100 8 1500</code>. Ghi lại kết nối nào treo.</li>
<li>Đọc <code>ss -ltn '( sport = :7100 )'</code> và <code>nstat -az TcpExtListenOverflows</code> trước và sau một lần <code>dial</code> nữa.</li>
<li>Đổi backlog thành 16 rồi làm lại: bây giờ bao nhiêu kết nối thành công ngay?</li>
<li>Giải thích trong hai câu vì sao người dùng thấy chậm 1 s và 3 s chứ không thấy lỗi.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đọc được <code>Recv-Q</code>/<code>Send-Q</code> của socket LISTEN, cho thấy <code>ListenOverflows</code> tăng, và nói được thứ tự sửa: làm accept nhanh trở lại trước, chỉnh backlog sau.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['socket', 'Đối tượng của nhân để giao tiếp mạng, dùng qua một file descriptor (read/write/close đều dùng được).'],
  ['listening socket (socket nghe)', 'Socket sau listen(): không bao giờ chở dữ liệu, chỉ gom các kết nối mới.'],
  ['accept queue / backlog (hàng chờ accept)', 'Các kết nối đã bắt tay xong nhưng accept() chưa lấy; mức tối đa là backlog.'],
  ['somaxconn', 'Trần của nhân cho mọi backlog (ở đây 4096); giá trị lớn hơn bị cắt lặng lẽ.'],
  ['SYN drop (bỏ SYN)', 'Hàng chờ accept đầy thì nhân phớt lờ SYN; khách thử lại sau 1 s, 3 s, 7 s…'],
  ['Recv-Q / Send-Q (với LISTEN)', 'Với socket nghe trong ss: độ dài hiện tại / mức tối đa của hàng chờ accept.'],
  ['ListenOverflows', 'Bộ đếm của nhân: số kết nối bị bỏ vì hàng chờ accept đầy (xem bằng nstat).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một kết nối là một fd: mỗi cổng một socket nghe, cộng mỗi khách một fd mới từ <code>accept()</code>.</li>
<li>Nhân tự làm xong bắt tay TCP; kết nối đã xong nằm chờ trong hàng accept tới khi code của bạn gọi <code>accept()</code>.</li>
<li>Hàng đầy thì SYN bị bỏ lặng lẽ: khách thấy chậm 1 s / 3 s, nhân đếm <code>ListenOverflows</code>.</li>
<li>Backlog mặc định rất khác nhau (Python 5, Java 50, Node và nginx 511) và bị <code>somaxconn</code> chặn trần.</li>
<li>Một kết nối nằm im tốn khoảng 3 KB bộ nhớ nhân cộng thứ runtime cấp cho mỗi kết nối; bộ đệm chỉ tốn khi có dữ liệu đang chờ.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/listen.2.html', '📄', 'man 2 listen', 'Đối số backlog, somaxconn, và chuyện gì xảy ra khi hàng chờ đầy.', 'Mở')}
${L('https://man7.org/linux/man-pages/man7/tcp.7.html', '📄', 'man 7 tcp', 'Tham số nhân và tuỳ chọn socket của TCP: tcp_syn_retries, tcp_wmem, keepalive…', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 10.2 — Năm mô hình I/O ───────────────────────── */
    {
      title: '10.2 — Five ways to wait for data: the I/O models of Stevens in real code|||10.2 — Năm cách chờ dữ liệu: các mô hình I/O của Stevens bằng code thật',
      slug: 'os-10-2-blocking',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cùng một ống dẫn, dữ liệu tới sau 1 giây, chờ theo năm cách và đo: chặn (ngủ trong anon_pipe_read, 1 lời gọi), không chặn (4,87 triệu lần EAGAIN, đốt trọn một lõi), dồn kênh poll (ngủ, 2 lời gọi, một lần chờ cho nhiều fd), theo tín hiệu SIGIO (O_ASYNC, rt_sigsuspend), bất đồng bộ (POSIX aio của glibc thật ra là một luồng phụ gọi read chặn; io_uring bị seccomp của Docker trả EPERM); hai giai đoạn chờ và chép của Stevens; "async" trong tên thư viện không có nghĩa nhân làm async.',
      content: `${G102}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Five ways to wait for data</h2>
<p class="lead">A server spends almost all of its life <em>waiting</em>: for a client to send, for a database to answer, for a disk. W. Richard Stevens' <em>UNIX Network Programming</em> (vol. 1, §6.2) sorts every way of waiting into <strong>five I/O models</strong>, and splits every input operation into two phases: <strong>(1) waiting for the data to be ready</strong> and <strong>(2) copying it from the kernel into your buffer</strong>. This lesson runs all five on the same problem and measures the answer to one question: <strong>while the data has not arrived, what is your thread doing — and how much CPU does the waiting cost?</strong> (OSG202 covers the hardware side — polling, interrupts, DMA — in <a href="${OSG('osg202-5-1-io')}">lesson 5.1</a>.)</p>

<h3>The experiment</h3>
<p>Every program below gets the read end of a pipe; a child process writes <code>"hello\\n"</code> into it after exactly one second. Each program waits in its own way and then reports how long it waited, how much CPU it used, and how many calls it made. A helper script, <code>peek.sh</code>, looks at the program after 0.5 s — in the middle of the wait — and prints each thread's state and <code>wchan</code>, the kernel function it is sleeping in.</p>
${src('ch10/cho.h', 'c')}

<h3>Model 1 — blocking I/O</h3>
${src('ch10/m1-block.c', 'c')}
${run('c102-mo-hinh', './m1-block &')}
<p>The thread is in state <code>S</code> (sleeping) inside <code>anon_pipe_read</code>: the kernel put it on the pipe's wait queue and will wake it when the writer writes. One call, no CPU, and both phases happen inside that one <code>read()</code>. This is the model of almost every "normal" program — a JDBC query, Python <code>requests.get</code>, a Spring MVC controller. It is perfectly efficient for <em>one</em> thing to wait for. The problem is that a thread can sleep on only one thing at a time: to wait for 10,000 clients this way you need 10,000 threads (lesson 10.4 measures that).</p>

<h3>Model 2 — non-blocking I/O</h3>
${src('ch10/m2-nonblock.c', 'c')}
${run('c102-mo-hinh', './m2-nonblock &')}
<p>With <code>O_NONBLOCK</code>, <code>read()</code> on an empty pipe returns −1 with <code>EAGAIN</code> immediately ("not now", <a href="${OS('os-11-6-errno-tin-hieu')}">lesson 11.5</a>). If you simply ask again, you get <strong>4.87 million calls in one second</strong> and <strong>about 1 second of CPU</strong> (254 ms user + 750 ms sys) — one full core burned to wait for six bytes. The thread is in state <code>R</code> (running) the whole time. Under strace the loop is slowed so much that it manages only about 24,000 calls, and the <code>errors</code> column shows every one of them failed:</p>
${run('c102-mo-hinh', 'strace -c -qq ./m2-nonblock')}
<p>Non-blocking mode is not useless — it is half of every event loop. It just must never be used alone: you need a way to <em>sleep until</em> a descriptor is ready. That is model 3.</p>

<div class="pitfall co-tieu-de">
<p><strong>A "waiting" process that uses 100% CPU.</strong> A worker that polls a non-blocking socket, a queue or a flag in a loop (<code>while (!ready) {}</code>, a <code>setImmediate</code> loop that re-checks, a Python <code>while True: try: sock.recv() except BlockingIOError: pass</code>) shows up as one core at 100% while "nothing happens". <code>strace -c -p PID</code> gives it away: millions of calls, almost all errors, all <code>EAGAIN</code>. Replace the loop with a real wait (poll/epoll, a blocking call, a condition variable).</p>
</div>

<h3>Model 3 — I/O multiplexing (select, poll, epoll)</h3>
${src('ch10/m3-poll.c', 'c')}
${run('c102-mo-hinh', './m3-poll &')}
<p>The thread sleeps in <code>poll_schedule_timeout</code> — inside <code>poll()</code>, not inside <code>read()</code>. When <code>poll</code> returns, the data is ready and the <code>read()</code> only copies it (phase 2) without waiting. Two calls instead of one, no CPU. The point is the array: one <code>poll()</code> can watch <strong>thousands of descriptors</strong> and return the ones that are ready. One thread, one wait, many connections — this is the model under nginx, Node/libuv, Netty, Go's runtime, Python asyncio and Redis. Lesson 10.3 compares <code>select</code>, <code>poll</code> and <code>epoll</code>.</p>
${lab('eventloop', 'block', 'en', 'An event loop is model 3 in a loop: wait for whatever is ready, run its callback, repeat. Put a model-1 call (a blocking read, a long computation) inside a callback and every other connection waits behind it.', { tour: 'eventloop-block' })}

<h3>Model 4 — signal-driven I/O</h3>
${src('ch10/m4-sigio.c', 'c')}
${run('c102-mo-hinh', './m4-sigio &')}
${run('c102-mo-hinh', 'strace -qq -o sigio.txt')}
<p><code>F_SETOWN</code> tells the kernel which process to notify and <code>O_ASYNC</code> (shown by strace as <code>FASYNC</code>) asks for a <code>SIGIO</code> when the descriptor becomes ready. The thread is free in the meantime — here it chooses to sleep in <code>rt_sigsuspend</code>. When the data arrives the kernel sends <code>SIGIO</code> (<code>si_code=SI_KERNEL</code>), the handler sets a flag, the suspend returns <code>EINTR</code>, and <code>read()</code> copies the data. (The <code>SIGCHLD</code> is the writer child exiting.) Stevens notes this model fits UDP but not TCP: a TCP socket raises <code>SIGIO</code> for many different conditions, and one signal does not say which of your thousands of sockets is ready. You will rarely meet it in server code — but it shows that "notify me" is possible without a dedicated waiting thread.</p>

<h3>Model 5 — asynchronous I/O</h3>
<p>The first four models all end with <em>your</em> thread calling <code>read()</code> to copy the data. In the asynchronous model you hand the kernel a buffer and say "read into this and tell me when it is <strong>done</strong>". POSIX has had an API for that for decades:</p>
${src('ch10/m5-aio.c', 'c')}
${run('c102-mo-hinh', './m5-aio &')}
<p>Two threads! The main thread waits in a futex (inside <code>aio_suspend</code>) — and a <strong>second thread</strong> sleeps in <code>anon_pipe_read</code>. strace shows where it came from:</p>
${run('c102-mo-hinh', 'strace -f -qq -o aio.txt')}
<p><code>aio_read()</code> created a thread (<code>clone3</code> got <code>ENOSYS</code> from Docker's seccomp profile and glibc fell back to <code>clone</code> — the same story as <a href="${OS('os-11-4-seccomp')}">lesson 11.7</a>), and that thread (95) does an ordinary blocking <code>read(3, …)</code>. glibc's POSIX AIO is <strong>a thread pool in disguise</strong>: asynchronous for you, blocking for the kernel. Linux's real asynchronous interface is <strong>io_uring</strong>:</p>
${src('ch10/m5-uring.c', 'c')}
${run('c102-mo-hinh', './m5-uring')}
${run('c102-mo-hinh', 'strace -qq -e trace=io_uring_setup')}
<p>In the lab container it does not even start: <code>io_uring_setup</code> returns <code>EPERM</code>, because Docker's default seccomp profile does not allow the io_uring system calls (lesson 10.7 shows the profile and why). In a throwaway container started with <code>--security-opt seccomp=unconfined</code>, the same binary runs — and there is only one thread, asleep in <code>io_cqring_wait</code>, the "wait for a completion" of the ring:</p>
${run('c107-uring', './m5-uring &')}
<p>When <code>io_uring_wait_cqe</code> returns, the six bytes are <em>already in the buffer</em>: the kernel did both phases. That is the difference between a <strong>readiness</strong> model ("this fd can be read now", models 3 and 4) and a <strong>completion</strong> model ("your read is finished", model 5).</p>

<h3>The five models side by side (measured)</h3>
<table>
<tr><th>Model</th><th>Phase 1: while waiting</th><th>Phase 2: copy</th><th>Calls / CPU here</th><th>Where you meet it</th></tr>
<tr><td>1 blocking</td><td>thread sleeps in read()</td><td>same read()</td><td>1 / ~0</td><td>JDBC, requests, a Spring MVC thread</td></tr>
<tr><td>2 non-blocking</td><td>thread spins on EAGAIN</td><td>read()</td><td>4.87 M / ~1 s</td><td>never alone — always with model 3</td></tr>
<tr><td>3 multiplexing</td><td>sleeps in poll/epoll for MANY fds</td><td>read()</td><td>2 / ~0</td><td>nginx, Node, Netty, Go, asyncio, Redis</td></tr>
<tr><td>4 signal-driven</td><td>free until SIGIO</td><td>read()</td><td>2 + a signal / ~0</td><td>rare (some UDP code)</td></tr>
<tr><td>5 asynchronous</td><td>free; kernel waits</td><td>kernel copies</td><td>2 / ~0</td><td>io_uring (Linux), IOCP (Windows); glibc aio = threads</td></tr>
</table>

<div class="pitfall co-tieu-de">
<p><strong>Trusting the word "async" in an API name.</strong> <code>aio_read</code> above, Node's <code>fs.readFile</code> (lesson 10.6), Java's <code>AsynchronousFileChannel</code> on Linux and many "async" database drivers give you an asynchronous <em>interface</em> on top of threads doing blocking calls. That is fine — but it means a limited pool, queueing and memory per pending operation. Check what really happens with <code>strace -f</code> and <code>/proc/PID/task/*/wchan</code>, exactly like <code>peek.sh</code> did.</p>
</div>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate's message consumer shows 100% CPU in <code>top</code> even at night, when no messages arrive. Their code "just checks the socket in a loop".</p>
<ol>
<li>Build and run <code>m2-nonblock</code>; confirm the CPU with its report and with <code>top</code> in a second terminal.</li>
<li>Attach <code>strace -c -p PID</code> for one second to a longer-running version (make the child sleep 10 s): what does the <code>errors</code> column say?</li>
<li>Change the program to call <code>poll()</code> before <code>read()</code> (like <code>m3-poll.c</code>) and measure again.</li>
<li>Use <code>peek.sh</code> on both versions: compare state (<code>R</code> vs <code>S</code>) and <code>wchan</code>.</li>
</ol>
<p><strong>Done when:</strong> the fixed version uses ~0 ms of CPU while waiting, <code>peek.sh</code> shows it sleeping in <code>poll_schedule_timeout</code>, and you can explain the difference between phase 1 and phase 2.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['blocking I/O', 'The call sleeps until it can complete; one thread can wait for only one thing.'],
  ['non-blocking I/O (O_NONBLOCK)', 'The call returns at once; EAGAIN means "not now, try later".'],
  ['I/O multiplexing', 'One call (select/poll/epoll) sleeps until ANY of many descriptors is ready.'],
  ['signal-driven I/O (O_ASYNC, SIGIO)', 'The kernel sends a signal when a descriptor becomes ready.'],
  ['asynchronous I/O', 'You submit the whole operation; the kernel tells you when it is finished (io_uring, IOCP).'],
  ['readiness vs completion', '"You can read now" (epoll) vs "your read is done, data is in your buffer" (io_uring).'],
  ['wchan', '/proc/PID/task/TID/wchan: the kernel function a sleeping thread waits in.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Every input has two phases: wait for data, then copy it; the five models differ in who waits and who copies.</li>
<li>Blocking is efficient for one wait but needs one thread per thing you wait for.</li>
<li>Non-blocking alone is a busy loop: 4.87 million calls and a full core per second here.</li>
<li>Multiplexing (poll/epoll) lets one thread sleep on thousands of descriptors — the basis of every event loop.</li>
<li>True asynchronous I/O on Linux is io_uring; glibc's POSIX AIO is a helper thread doing a blocking read.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/poll.2.html', '📄', 'man 2 poll', 'Waiting for one of many file descriptors to become ready.', 'Open')}
${L('https://man7.org/linux/man-pages/man7/aio.7.html', '📄', 'man 7 aio', 'POSIX asynchronous I/O — and the note that glibc implements it in user space with threads.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Năm cách chờ dữ liệu</h2>
<p class="lead">Một máy chủ dành gần như cả đời để <em>chờ</em>: chờ client gửi, chờ CSDL trả lời, chờ đĩa. Cuốn <em>UNIX Network Programming</em> của W. Richard Stevens (tập 1, §6.2) xếp mọi cách chờ vào <strong>năm mô hình I/O</strong>, và tách mỗi thao tác nhập thành hai giai đoạn: <strong>(1) chờ dữ liệu sẵn sàng</strong> và <strong>(2) chép nó từ nhân vào bộ đệm của bạn</strong>. Bài này chạy cả năm trên cùng một bài toán và đo câu trả lời cho một câu hỏi: <strong>trong lúc dữ liệu chưa tới, luồng của bạn đang làm gì — và việc chờ tốn bao nhiêu CPU?</strong> (OSG202 dạy phía phần cứng — hỏi vòng, ngắt, DMA — ở <a href="${OSG('osg202-5-1-io')}">bài 5.1</a>.)</p>

<h3>Thí nghiệm</h3>
<p>Mỗi chương trình dưới đây nhận đầu đọc của một ống dẫn; một tiến trình con ghi <code>"hello\\n"</code> vào đó sau đúng một giây. Mỗi chương trình chờ theo cách riêng rồi báo: chờ bao lâu, tốn bao nhiêu CPU, gọi bao nhiêu lần. Một script phụ, <code>peek.sh</code>, nhìn vào chương trình sau 0,5 s — giữa lúc đang chờ — và in trạng thái từng luồng cùng <code>wchan</code>, hàm của nhân mà luồng đang ngủ trong đó.</p>
${src('ch10/cho.h', 'c')}

<h3>Mô hình 1 — I/O chặn</h3>
${src('ch10/m1-block.c', 'c')}
${run('c102-mo-hinh', './m1-block &')}
<p>Luồng ở trạng thái <code>S</code> (ngủ) bên trong <code>anon_pipe_read</code>: nhân đặt nó vào hàng chờ của ống dẫn và sẽ đánh thức khi bên ghi ghi. Một lời gọi, không tốn CPU, và cả hai giai đoạn xảy ra trong đúng một <code>read()</code>. Đây là mô hình của gần như mọi chương trình "bình thường" — một truy vấn JDBC, <code>requests.get</code> của Python, một controller Spring MVC. Nó hoàn toàn hiệu quả khi chỉ có <em>một</em> thứ để chờ. Vấn đề là một luồng chỉ ngủ được trên một thứ một lúc: muốn chờ 10.000 khách theo cách này bạn cần 10.000 luồng (bài 10.4 đo việc đó).</p>

<h3>Mô hình 2 — I/O không chặn</h3>
${src('ch10/m2-nonblock.c', 'c')}
${run('c102-mo-hinh', './m2-nonblock &')}
<p>Với <code>O_NONBLOCK</code>, <code>read()</code> trên ống rỗng trả −1 kèm <code>EAGAIN</code> ngay lập tức ("chưa phải lúc", <a href="${OS('os-11-6-errno-tin-hieu')}">bài 11.5</a>). Nếu cứ thế hỏi lại, bạn được <strong>4,87 triệu lời gọi trong một giây</strong> và <strong>khoảng 1 giây CPU</strong> (254 ms user + 750 ms sys) — đốt trọn một lõi để chờ sáu byte. Luồng ở trạng thái <code>R</code> (đang chạy) suốt thời gian đó. Dưới strace vòng lặp bị làm chậm tới mức chỉ được khoảng 24.000 lời gọi, và cột <code>errors</code> cho thấy tất cả đều thất bại:</p>
${run('c102-mo-hinh', 'strace -c -qq ./m2-nonblock')}
<p>Chế độ không chặn không vô dụng — nó là một nửa của mọi event loop. Chỉ là không bao giờ được dùng một mình: bạn cần một cách để <em>ngủ cho tới khi</em> một descriptor sẵn sàng. Đó là mô hình 3.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một tiến trình "đang chờ" mà ăn 100% CPU.</strong> Một worker hỏi vòng một socket không chặn, một hàng đợi hay một cờ trong vòng lặp (<code>while (!ready) {}</code>, vòng <code>setImmediate</code> tự kiểm lại, Python <code>while True: try: sock.recv() except BlockingIOError: pass</code>) hiện ra là một lõi 100% trong lúc "chẳng có gì xảy ra". <code>strace -c -p PID</code> tố cáo ngay: hàng triệu lời gọi, gần như toàn lỗi, toàn <code>EAGAIN</code>. Thay vòng lặp bằng một lần chờ thật (poll/epoll, một lời gọi chặn, một biến điều kiện).</p>
</div>

<h3>Mô hình 3 — dồn kênh I/O (select, poll, epoll)</h3>
${src('ch10/m3-poll.c', 'c')}
${run('c102-mo-hinh', './m3-poll &')}
<p>Luồng ngủ trong <code>poll_schedule_timeout</code> — bên trong <code>poll()</code>, không phải trong <code>read()</code>. Khi <code>poll</code> trả về, dữ liệu đã sẵn sàng và <code>read()</code> chỉ còn chép (giai đoạn 2), không phải chờ. Hai lời gọi thay vì một, không tốn CPU. Điểm mấu chốt là cái mảng: một lần <code>poll()</code> theo dõi được <strong>hàng nghìn descriptor</strong> và trả về những cái đã sẵn sàng. Một luồng, một lần chờ, nhiều kết nối — đó là mô hình bên dưới nginx, Node/libuv, Netty, runtime của Go, asyncio của Python và Redis. Bài 10.3 so <code>select</code>, <code>poll</code> và <code>epoll</code>.</p>
${lab('eventloop', 'block', 'vi', 'Event loop chính là mô hình 3 đặt trong một vòng lặp: chờ cái nào sẵn sàng, chạy callback của nó, lặp lại. Đặt một lời gọi kiểu mô hình 1 (read chặn, một phép tính dài) vào một callback là mọi kết nối khác phải chờ sau nó.', { tour: 'eventloop-block' })}

<h3>Mô hình 4 — I/O theo tín hiệu</h3>
${src('ch10/m4-sigio.c', 'c')}
${run('c102-mo-hinh', './m4-sigio &')}
${run('c102-mo-hinh', 'strace -qq -o sigio.txt')}
<p><code>F_SETOWN</code> cho nhân biết báo cho tiến trình nào, còn <code>O_ASYNC</code> (strace in là <code>FASYNC</code>) xin một <code>SIGIO</code> khi descriptor sẵn sàng. Trong lúc đó luồng được tự do — ở đây nó chọn ngủ trong <code>rt_sigsuspend</code>. Khi dữ liệu tới, nhân gửi <code>SIGIO</code> (<code>si_code=SI_KERNEL</code>), hàm xử lý bật cờ, lần suspend trả về <code>EINTR</code>, và <code>read()</code> chép dữ liệu. (<code>SIGCHLD</code> là tiến trình con ghi xong rồi thoát.) Stevens lưu ý mô hình này hợp với UDP nhưng không hợp với TCP: một socket TCP bắn <code>SIGIO</code> cho rất nhiều tình huống khác nhau, và một tín hiệu không nói được socket nào trong hàng nghìn socket của bạn đã sẵn sàng. Bạn sẽ hiếm khi gặp nó trong code máy chủ — nhưng nó cho thấy "báo tôi khi xong" là làm được mà không cần một luồng ngồi chờ riêng.</p>

<h3>Mô hình 5 — I/O bất đồng bộ</h3>
<p>Bốn mô hình đầu đều kết thúc bằng việc luồng <em>của bạn</em> gọi <code>read()</code> để chép dữ liệu. Ở mô hình bất đồng bộ, bạn đưa nhân một bộ đệm và nói "đọc vào đây rồi báo khi <strong>xong</strong>". POSIX có API cho việc đó từ hàng chục năm:</p>
${src('ch10/m5-aio.c', 'c')}
${run('c102-mo-hinh', './m5-aio &')}
<p>Hai luồng! Luồng chính chờ trong một futex (bên trong <code>aio_suspend</code>) — và một <strong>luồng thứ hai</strong> ngủ trong <code>anon_pipe_read</code>. strace cho thấy nó từ đâu ra:</p>
${run('c102-mo-hinh', 'strace -f -qq -o aio.txt')}
<p><code>aio_read()</code> tạo một luồng (<code>clone3</code> nhận <code>ENOSYS</code> từ hồ sơ seccomp của Docker và glibc lùi về <code>clone</code> — đúng chuyện ở <a href="${OS('os-11-4-seccomp')}">bài 11.7</a>), và luồng đó (95) gọi một <code>read(3, …)</code> chặn bình thường. POSIX AIO của glibc là <strong>một thread pool trá hình</strong>: bất đồng bộ với bạn, chặn với nhân. Giao diện bất đồng bộ thật của Linux là <strong>io_uring</strong>:</p>
${src('ch10/m5-uring.c', 'c')}
${run('c102-mo-hinh', './m5-uring')}
${run('c102-mo-hinh', 'strace -qq -e trace=io_uring_setup')}
<p>Trong container lab nó còn không khởi động được: <code>io_uring_setup</code> trả <code>EPERM</code>, vì hồ sơ seccomp mặc định của Docker không cho các lời gọi io_uring (bài 10.7 cho xem hồ sơ và lý do). Trong một container vứt đi chạy với <code>--security-opt seccomp=unconfined</code>, cùng tệp nhị phân đó chạy được — và chỉ có một luồng, ngủ trong <code>io_cqring_wait</code>, tức "chờ một kết quả hoàn tất" của vòng:</p>
${run('c107-uring', './m5-uring &')}
<p>Khi <code>io_uring_wait_cqe</code> trả về, sáu byte <em>đã nằm sẵn trong bộ đệm</em>: nhân làm cả hai giai đoạn. Đó là khác biệt giữa mô hình <strong>sẵn sàng</strong> ("fd này đọc được rồi", mô hình 3 và 4) và mô hình <strong>hoàn tất</strong> ("lần đọc của bạn xong rồi", mô hình 5).</p>

<h3>Năm mô hình đặt cạnh nhau (đo thật)</h3>
<table>
<tr><th>Mô hình</th><th>Giai đoạn 1: lúc chờ</th><th>Giai đoạn 2: chép</th><th>Lời gọi / CPU ở đây</th><th>Gặp ở đâu</th></tr>
<tr><td>1 chặn</td><td>luồng ngủ trong read()</td><td>chính read() đó</td><td>1 / ~0</td><td>JDBC, requests, một luồng Spring MVC</td></tr>
<tr><td>2 không chặn</td><td>luồng quay vòng trên EAGAIN</td><td>read()</td><td>4,87 triệu / ~1 s</td><td>không bao giờ dùng một mình — luôn đi với mô hình 3</td></tr>
<tr><td>3 dồn kênh</td><td>ngủ trong poll/epoll cho NHIỀU fd</td><td>read()</td><td>2 / ~0</td><td>nginx, Node, Netty, Go, asyncio, Redis</td></tr>
<tr><td>4 theo tín hiệu</td><td>tự do tới khi có SIGIO</td><td>read()</td><td>2 + một tín hiệu / ~0</td><td>hiếm (vài code UDP)</td></tr>
<tr><td>5 bất đồng bộ</td><td>tự do; nhân chờ</td><td>nhân chép</td><td>2 / ~0</td><td>io_uring (Linux), IOCP (Windows); aio của glibc = luồng</td></tr>
</table>

<div class="pitfall co-tieu-de">
<p><strong>Tin vào chữ "async" trong tên API.</strong> <code>aio_read</code> ở trên, <code>fs.readFile</code> của Node (bài 10.6), <code>AsynchronousFileChannel</code> của Java trên Linux và nhiều driver CSDL "async" cho bạn một <em>giao diện</em> bất đồng bộ đặt trên các luồng gọi lời gọi chặn. Như thế không sai — nhưng nó có nghĩa là một pool có hạn, hàng đợi, và bộ nhớ cho mỗi thao tác đang treo. Kiểm thứ thật sự xảy ra bằng <code>strace -f</code> và <code>/proc/PID/task/*/wchan</code>, đúng như <code>peek.sh</code> đã làm.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> consumer nhận tin nhắn của một bạn cùng nhóm hiện 100% CPU trong <code>top</code> kể cả ban đêm, khi không có tin nào tới. Code của bạn ấy "chỉ kiểm socket trong một vòng lặp".</p>
<ol>
<li>Biên dịch và chạy <code>m2-nonblock</code>; xác nhận mức CPU bằng báo cáo của nó và bằng <code>top</code> ở terminal thứ hai.</li>
<li>Gắn <code>strace -c -p PID</code> trong một giây vào một bản chạy lâu hơn (cho tiến trình con ngủ 10 s): cột <code>errors</code> nói gì?</li>
<li>Sửa chương trình để gọi <code>poll()</code> trước <code>read()</code> (như <code>m3-poll.c</code>) rồi đo lại.</li>
<li>Dùng <code>peek.sh</code> cho cả hai bản: so trạng thái (<code>R</code> vs <code>S</code>) và <code>wchan</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bản đã sửa tốn ~0 ms CPU lúc chờ, <code>peek.sh</code> cho thấy nó ngủ trong <code>poll_schedule_timeout</code>, và bạn giải thích được khác biệt giữa giai đoạn 1 và giai đoạn 2.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['blocking I/O (I/O chặn)', 'Lời gọi ngủ cho tới khi làm xong được; một luồng chỉ chờ được một thứ.'],
  ['non-blocking I/O, O_NONBLOCK (I/O không chặn)', 'Lời gọi trả về ngay; EAGAIN nghĩa là "chưa phải lúc, thử lại sau".'],
  ['I/O multiplexing (dồn kênh I/O)', 'Một lời gọi (select/poll/epoll) ngủ cho tới khi BẤT KỲ descriptor nào trong rất nhiều cái sẵn sàng.'],
  ['signal-driven I/O, O_ASYNC, SIGIO (I/O theo tín hiệu)', 'Nhân gửi một tín hiệu khi descriptor sẵn sàng.'],
  ['asynchronous I/O (I/O bất đồng bộ)', 'Bạn nộp cả thao tác; nhân báo khi đã làm xong (io_uring, IOCP).'],
  ['readiness vs completion (sẵn sàng vs hoàn tất)', '"Giờ đọc được rồi" (epoll) vs "lần đọc của bạn xong, dữ liệu nằm trong bộ đệm" (io_uring).'],
  ['wchan', '/proc/PID/task/TID/wchan: hàm của nhân mà một luồng đang ngủ chờ trong đó.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi thao tác nhập có hai giai đoạn: chờ dữ liệu, rồi chép nó; năm mô hình khác nhau ở chỗ ai chờ và ai chép.</li>
<li>Chặn thì hiệu quả cho một lần chờ nhưng cần mỗi thứ phải chờ một luồng.</li>
<li>Không chặn mà dùng một mình là vòng quay bận: 4,87 triệu lời gọi và trọn một lõi mỗi giây ở đây.</li>
<li>Dồn kênh (poll/epoll) cho một luồng ngủ trên hàng nghìn descriptor — nền móng của mọi event loop.</li>
<li>I/O bất đồng bộ thật trên Linux là io_uring; POSIX AIO của glibc là một luồng phụ làm read chặn.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/poll.2.html', '📄', 'man 2 poll', 'Chờ một trong nhiều file descriptor sẵn sàng.', 'Mở')}
${L('https://man7.org/linux/man-pages/man7/aio.7.html', '📄', 'man 7 aio', 'POSIX I/O bất đồng bộ — và ghi chú rằng glibc làm nó ở không gian người dùng bằng luồng.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 10.3 — select, poll, epoll ───────────────────────── */
    {
      title: '10.3 — select, poll, epoll: why one scales, level vs edge, EPOLLONESHOT|||10.3 — select, poll, epoll: vì sao một cái mở rộng được, level vs edge, EPOLLONESHOT',
      slug: 'os-10-3-epoll',
      type: 'LESSON',
      isFreePreview: true,
      description: 'select là mảng bit cố định 1024 (FD_SET fd 1102 ⇒ glibc abort, exit 134); giá MỘT lần thức khi theo dõi N fd: select/poll 1,3 → 6,7 → 64 → 676 µs, epoll đứng yên 0,7 µs; danh sách quan tâm của epoll đọc được trong /proc/PID/fdinfo, danh sách sẵn sàng do callback của nhân nạp; máy chủ echo epoll 60 dòng và dấu vết strace của một khách; level-triggered báo 3 lần, edge-triggered báo 1 lần và để 6 byte nằm lại mãi; 4 luồng chung một epoll: LT đánh thức cả 4, ET cho 2 luồng cùng xử lý một kết nối, EPOLLONESHOT chỉ một.',
      content: `${G103}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>select, poll, epoll</h2>
<p class="lead">Model 3 — one thread sleeping on many descriptors — needs a system call that can wait for many fds. Linux has three: <code>select</code> (4.2BSD, 1983), <code>poll</code> (System V Release 3, 1987) and <code>epoll</code> (Linux 2.5.44, 2002). When Dan Kegel wrote "The C10K problem" in 1999, the first two were the reason ten thousand connections were hard. This lesson measures <strong>why only epoll scales, what the kernel keeps inside an epoll instance, and which two flags — edge-triggered and EPOLLONESHOT — break servers that use them carelessly</strong>. Then we read a complete epoll echo server line by line.</p>

<h3>select: a fixed array of 1,024 bits</h3>
${src('ch10/sel1024.c', 'c')}
${run('c103-epoll', 'gcc -O2 -o sel1024 sel1024.c')}
<p><code>fd_set</code> is a bit array of exactly <code>FD_SETSIZE</code> = 1024 bits (128 bytes). It is indexed by the fd <em>number</em>, not by how many fds you watch: a busy server whose newest socket is fd 1102 cannot put it in a <code>select</code> at all. <code>FD_SET(1102, …)</code> writes past the end of the array. Ubuntu builds with <code>_FORTIFY_SOURCE</code>, so glibc catches it and aborts the process (SIGABRT, exit 134); without fortify, the write silently corrupts the stack. Any library that still uses <code>select()</code> internally is a time bomb in a process with many open files.</p>

<h3>The cost of one wake-up: O(N) vs O(1)</h3>
<p><code>pollbench</code> watches N idle eventfds plus one that keeps becoming ready, and measures how long one "wait → wake → handle" round takes:</p>
${src('ch10/pollbench.c', 'c')}
${run('c103-epoll', 'gcc -O2 -Wall -o pollbench pollbench.c')}
<p><code>select</code> and <code>poll</code> grow linearly: 1.3 µs at 10 fds, 6.7 µs at 100, 64 µs at 1,000, <strong>676 µs at 10,000</strong>. Every call copies the whole list into the kernel, the kernel checks every descriptor and registers the thread on every wait queue, then the program scans the whole list again to find the one that fired. <strong>epoll stays at 0.7 µs</strong> no matter how many fds it watches. At 10,000 connections, <code>poll</code> limits one core to about 1,500 wake-ups per second spent on bookkeeping alone — that was C10K in 1999.</p>

<h3>Inside an epoll instance: two lists</h3>
<p>epoll splits the work. <code>epoll_create1()</code> makes an epoll instance (itself an fd). <code>epoll_ctl(ADD/MOD/DEL)</code> edits its <strong>interest list</strong> once per fd — not on every wait. When data arrives on a socket, a kernel callback appends that socket to the instance's <strong>ready list</strong>, and <code>epoll_wait</code> returns only what is on the ready list. Our echo server with three clients connected:</p>
${run('c103-epoll', './echo-epoll 7000 &', 4)}
<p>fd 4 is <code>anon_inode:[eventpoll]</code> — the epoll instance. Its <code>fdinfo</code> lists the interest list: one <code>tfd</code> line per watched descriptor — the listening socket 3 and the clients 5, 6, 7. <code>events: 19</code> is hexadecimal: 0x1 <code>EPOLLIN</code> + 0x8 <code>EPOLLERR</code> + 0x10 <code>EPOLLHUP</code> (the kernel always adds the last two). The ready list is not printed anywhere; it exists only for the instant between an event and <code>epoll_wait</code> collecting it.</p>
${lab('eventloop', 'order', 'en', 'The "poll" phase of an event loop is epoll_wait: the loop sleeps there until the kernel puts something on the ready list, then runs the callbacks of exactly those descriptors.', { tour: 'eventloop-order' })}

<h3>A tiny epoll echo server</h3>
${src('ch10/echo-epoll.c', 'c')}
<p>Sixty lines, one thread, any number of clients. Here is one client, call by call (attached with <code>strace -p</code>):</p>
${run('c103-epoll', 'strace -qq -p $S', 3)}
<p><code>epoll_pwait</code> returns the listening socket (<code>data=0x3</code>); the server accepts in a loop until <code>EAGAIN</code> (there may be several clients waiting — never accept just one per wake-up); <code>epoll_ctl(ADD, 8)</code> puts the new client on the interest list; the next wait returns fd 8; <code>read</code>/<code>write</code> echo "hi"; a read of 0 means the client left; <code>close(8)</code> also removes it from the interest list. The thread then sleeps again in <code>epoll_pwait</code>. (glibc's <code>epoll_wait</code> is implemented with the <code>epoll_pwait</code> system call, which is why strace shows that name.) Lesson 10.4 loads this server with 10,000 clients.</p>

<h3>Level-triggered vs edge-triggered</h3>
<p>epoll can report readiness in two ways. <strong>Level-triggered</strong> (default): "this fd is readable" — reported on <em>every</em> wait while unread data remains. <strong>Edge-triggered</strong> (<code>EPOLLET</code>): "this fd <em>became</em> readable" — reported once per arrival. The client sends 10 bytes once; the server reads only 4 bytes per wake-up:</p>
${src('ch10/trigger.c', 'c')}
${run('c103-epoll', 'gcc -O2 -Wall -o trigger trigger.c')}
<p>Level-triggered wakes the server three times (4 + 4 + 2) — sloppy code still works. Edge-triggered wakes it <strong>once</strong>; the other 6 bytes stay in the socket and <code>epoll_wait</code> times out, because no <em>new</em> data arrived. A real server would wait forever: a connection that "hangs with half a request". The rule for edge-triggered is in <code>man 7 epoll</code>: use non-blocking fds and <strong>read (or write) until EAGAIN</strong> on every event — the <code>et-drain</code> run. In lesson 10.5 you will see who chose what: libuv, Python asyncio, Java NIO and Netty 4.2 register level-triggered; nginx and Go register edge-triggered.</p>

<div class="pitfall co-tieu-de">
<p><strong>Edge-triggered "for performance" without draining.</strong> ET saves a few wake-ups, but every handler must loop until <code>EAGAIN</code> — including <code>accept</code> (several clients can be queued behind one event) and <code>write</code>. Forgetting it in one path gives connections that hang only under load, when two packets happen to arrive together. If you are not sure, use level-triggered; libuv, Netty 4.2 and Java NIO do.</p>
</div>

<h3>Many threads, one epoll: EPOLLONESHOT</h3>
<p>Some servers run several threads on one epoll instance (a thread pool for handlers). Four threads wait; one connection receives part 1 of a request at 0 ms and part 2 at 50 ms; handling takes 100 ms:</p>
${src('ch10/oneshot.c', 'c')}
${run('c103-epoll', 'gcc -O2 -Wall -pthread -o oneshot oneshot.c')}
<p><strong>Level-triggered</strong>: all four threads wake for the same event (the data is still unread, so each wait reports it again) — three of them find nothing (<code>EAGAIN</code>): wasted wake-ups. <strong>Edge-triggered</strong>: one thread wakes, but part 2 is a new edge, so at 50 ms a <em>second</em> thread takes the same connection while the first is still handling it — two threads reading one socket means interleaved data and races on its state. <strong><code>EPOLLONESHOT</code></strong>: after one event the fd is disabled until the handler re-arms it with <code>EPOLL_CTL_MOD</code>, so exactly one thread owns the connection at a time. (For the opposite problem — many threads or processes waiting on one <em>listening</em> socket — Linux 4.5 added <code>EPOLLEXCLUSIVE</code>; nginx's workers use it, as the trace in lesson 10.5 shows.)</p>
${lab('eventloop', 'race', 'en', 'Even with ONE thread, two handlers of the same resource can interleave across an await — the single-threaded cousin of the edge-triggered problem above. Watch alice and bob buy the last seat.')}

<div class="pitfall co-tieu-de">
<p><strong>close() did not remove the fd from epoll.</strong> epoll registers the <em>open file description</em>, not the fd number (<code>man 7 epoll</code>, questions 6 and 7). If the socket was <code>dup</code>ed, or inherited by a child after <code>fork</code>, <code>close(fd)</code> leaves the registration alive and epoll keeps reporting events for a number you no longer own. When descriptors can be shared, call <code>epoll_ctl(EPOLL_CTL_DEL)</code> before <code>close</code>, and open sockets with <code>SOCK_CLOEXEC</code> (as libuv's <code>accept4(…, SOCK_CLOEXEC|SOCK_NONBLOCK)</code> does).</p>
</div>

<h3>Other systems</h3>
<p>BSD and macOS have <strong>kqueue</strong> (<code>kevent</code>, FreeBSD 4.1, 2000) — the same idea with a more general event model; Windows has <strong>IOCP</strong>, a completion model like io_uring. libuv, Netty, Go and Java NIO hide the difference behind one API, which is why your Node code runs on a Mac (kqueue) and on the VPS (epoll) unchanged.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate rewrote the team's chat gateway with edge-triggered epoll "for speed". Since then, a few connections per hour hang with half a message, never at low load.</p>
<ol>
<li>Run <code>./trigger et</code> and <code>./trigger et-drain</code>; explain the difference in one sentence.</li>
<li>Change <code>echo-epoll.c</code> to <code>EPOLLIN | EPOLLET</code> and read only 4 bytes per event; send a 10-byte line with <code>nc</code> and watch the echo stop.</li>
<li>Fix it by reading until <code>EAGAIN</code>; verify with <code>strace -p</code> that one <code>epoll_pwait</code> is now followed by reads ending in <code>EAGAIN</code>.</li>
<li>Bonus: start two clients at once and check that your <code>accept4</code> loop also runs until <code>EAGAIN</code>.</li>
</ol>
<p><strong>Done when:</strong> the edge-triggered server echoes every byte of a 10-byte message read 4 bytes at a time, and you can say which runtimes in lesson 10.5 use ET and which use LT.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['select / FD_SETSIZE', 'Waits on a fixed 1024-bit array indexed by fd number; fds ≥ 1024 cannot be used.'],
  ['poll', 'Waits on an array of any size, but copies and scans all N entries on every call — O(N).'],
  ['epoll instance', 'A kernel object (itself an fd) holding an interest list and a ready list; epoll_wait is O(ready).'],
  ['interest list', 'The fds registered with epoll_ctl(ADD); visible as tfd lines in /proc/PID/fdinfo.'],
  ['ready list', 'Fds the kernel marked ready via callbacks; epoll_wait returns from it.'],
  ['level-triggered / edge-triggered', 'Report "is readable" on every wait / report "became readable" once per arrival (EPOLLET).'],
  ['EPOLLONESHOT', 'Disable the fd after one event until EPOLL_CTL_MOD re-arms it; one thread owns it at a time.'],
  ['EPOLLEXCLUSIVE', 'Wake only one of the waiters sharing a listening socket (no thundering herd).'],
])}

<h3>📌 Summary</h3>
<ul>
<li><code>select</code> cannot handle fd numbers ≥ 1024 at all; <code>FD_SET(1102)</code> aborted the process.</li>
<li><code>select</code>/<code>poll</code> cost grows with N (676 µs per wake-up at 10,000 fds); epoll stays at ~0.7 µs.</li>
<li>epoll = interest list (edited once with epoll_ctl) + ready list (filled by the kernel); you can read the interest list in <code>/proc/PID/fdinfo</code>.</li>
<li>Edge-triggered requires non-blocking fds and draining until EAGAIN, or data is stranded.</li>
<li>With several threads on one epoll, use EPOLLONESHOT for connections and EPOLLEXCLUSIVE for listening sockets.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/epoll.7.html', '📄', 'man 7 epoll', 'Interest and ready lists, level vs edge triggered, and the Q&amp;A about close() and dup().', 'Open')}
${L('https://man7.org/linux/man-pages/man2/select.2.html', '📄', 'man 2 select', 'FD_SETSIZE and why new code should use poll or epoll.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>select, poll, epoll</h2>
<p class="lead">Mô hình 3 — một luồng ngủ trên nhiều descriptor — cần một lời gọi hệ thống chờ được nhiều fd. Linux có ba: <code>select</code> (4.2BSD, 1983), <code>poll</code> (System V Release 3, 1987) và <code>epoll</code> (Linux 2.5.44, 2002). Khi Dan Kegel viết "The C10K problem" năm 1999, hai cái đầu chính là lý do mười nghìn kết nối khó. Bài này đo <strong>vì sao chỉ epoll mở rộng được, nhân giữ gì bên trong một thực thể epoll, và hai cờ nào — edge-triggered và EPOLLONESHOT — làm hỏng máy chủ nếu dùng ẩu</strong>. Rồi ta đọc từng dòng một máy chủ echo epoll hoàn chỉnh.</p>

<h3>select: một mảng cố định 1.024 bit</h3>
${src('ch10/sel1024.c', 'c')}
${run('c103-epoll', 'gcc -O2 -o sel1024 sel1024.c')}
<p><code>fd_set</code> là một mảng bit đúng <code>FD_SETSIZE</code> = 1024 bit (128 byte). Nó đánh chỉ số bằng <em>số hiệu</em> fd, không phải bằng số fd bạn theo dõi: một máy chủ bận rộn có socket mới nhất là fd 1102 thì không thể đưa nó vào <code>select</code> được. <code>FD_SET(1102, …)</code> ghi ra ngoài mảng. Ubuntu biên dịch với <code>_FORTIFY_SOURCE</code>, nên glibc bắt được và giết tiến trình (SIGABRT, exit 134); không có fortify, lần ghi đó lặng lẽ phá stack. Thư viện nào bên trong còn dùng <code>select()</code> là một quả bom hẹn giờ trong tiến trình mở nhiều file.</p>

<h3>Giá của một lần thức: O(N) vs O(1)</h3>
<p><code>pollbench</code> theo dõi N eventfd nằm im cộng một cái liên tục sẵn sàng, và đo một vòng "chờ → thức → xử lý" mất bao lâu:</p>
${src('ch10/pollbench.c', 'c')}
${run('c103-epoll', 'gcc -O2 -Wall -o pollbench pollbench.c')}
<p><code>select</code> và <code>poll</code> tăng tuyến tính: 1,3 µs ở 10 fd, 6,7 µs ở 100, 64 µs ở 1.000, <strong>676 µs ở 10.000</strong>. Mỗi lần gọi đều chép cả danh sách vào nhân, nhân kiểm từng descriptor và đăng ký luồng vào từng hàng chờ, rồi chương trình duyệt lại cả danh sách để tìm cái đã kêu. <strong>epoll đứng yên 0,7 µs</strong> dù theo dõi bao nhiêu fd. Ở 10.000 kết nối, <code>poll</code> giới hạn một lõi ở khoảng 1.500 lần thức mỗi giây chỉ cho việc sổ sách — đó là C10K năm 1999.</p>

<h3>Bên trong một thực thể epoll: hai danh sách</h3>
<p>epoll chia việc ra. <code>epoll_create1()</code> tạo một thực thể epoll (bản thân nó là một fd). <code>epoll_ctl(ADD/MOD/DEL)</code> sửa <strong>danh sách quan tâm</strong> của nó mỗi fd một lần — không phải mỗi lần chờ. Khi dữ liệu tới một socket, một callback của nhân nối socket đó vào <strong>danh sách sẵn sàng</strong> của thực thể, và <code>epoll_wait</code> chỉ trả về những gì nằm trên danh sách sẵn sàng. Máy chủ echo của ta khi có ba khách đang kết nối:</p>
${run('c103-epoll', './echo-epoll 7000 &', 4)}
<p>fd 4 là <code>anon_inode:[eventpoll]</code> — thực thể epoll. <code>fdinfo</code> của nó liệt kê danh sách quan tâm: mỗi descriptor được theo dõi một dòng <code>tfd</code> — socket nghe 3 và các khách 5, 6, 7. <code>events: 19</code> là số hệ 16: 0x1 <code>EPOLLIN</code> + 0x8 <code>EPOLLERR</code> + 0x10 <code>EPOLLHUP</code> (nhân luôn tự thêm hai cái sau). Danh sách sẵn sàng thì không in ra ở đâu cả; nó chỉ tồn tại trong khoảnh khắc giữa một sự kiện và lúc <code>epoll_wait</code> nhặt nó.</p>
${lab('eventloop', 'order', 'vi', 'Pha "poll" của event loop chính là epoll_wait: vòng lặp ngủ ở đó tới khi nhân đặt thứ gì đó lên danh sách sẵn sàng, rồi chạy callback của đúng những descriptor đó.', { tour: 'eventloop-order' })}

<h3>Một máy chủ echo epoll tí hon</h3>
${src('ch10/echo-epoll.c', 'c')}
<p>Sáu mươi dòng, một luồng, bao nhiêu khách cũng được. Đây là một khách, từng lời gọi (gắn bằng <code>strace -p</code>):</p>
${run('c103-epoll', 'strace -qq -p $S', 3)}
<p><code>epoll_pwait</code> trả về socket nghe (<code>data=0x3</code>); máy chủ accept trong vòng lặp tới khi <code>EAGAIN</code> (có thể có nhiều khách đang chờ — đừng bao giờ mỗi lần thức chỉ accept một); <code>epoll_ctl(ADD, 8)</code> đưa khách mới vào danh sách quan tâm; lần chờ kế tiếp trả về fd 8; <code>read</code>/<code>write</code> dội lại "hi"; read trả 0 nghĩa là khách đã đi; <code>close(8)</code> cũng gỡ nó khỏi danh sách quan tâm. Rồi luồng lại ngủ trong <code>epoll_pwait</code>. (<code>epoll_wait</code> của glibc được làm bằng lời gọi hệ thống <code>epoll_pwait</code>, vì thế strace hiện tên đó.) Bài 10.4 dồn 10.000 khách vào máy chủ này.</p>

<h3>Level-triggered vs edge-triggered</h3>
<p>epoll báo "sẵn sàng" theo hai kiểu. <strong>Level-triggered</strong> (theo mức, mặc định): "fd này đọc được" — báo ở <em>mọi</em> lần chờ chừng nào còn dữ liệu chưa đọc. <strong>Edge-triggered</strong> (theo sườn, <code>EPOLLET</code>): "fd này <em>vừa trở nên</em> đọc được" — báo một lần cho mỗi lần dữ liệu tới. Khách gửi 10 byte một lần; máy chủ mỗi lần thức chỉ đọc 4 byte:</p>
${src('ch10/trigger.c', 'c')}
${run('c103-epoll', 'gcc -O2 -Wall -o trigger trigger.c')}
<p>Level-triggered đánh thức máy chủ ba lần (4 + 4 + 2) — code cẩu thả vẫn chạy. Edge-triggered đánh thức <strong>một lần</strong>; 6 byte còn lại nằm trong socket và <code>epoll_wait</code> hết hạn, vì không có dữ liệu <em>mới</em> tới. Một máy chủ thật sẽ chờ mãi: một kết nối "treo với nửa request". Luật cho edge-triggered nằm trong <code>man 7 epoll</code>: dùng fd không chặn và <strong>đọc (hoặc ghi) tới khi EAGAIN</strong> ở mỗi sự kiện — đúng lượt chạy <code>et-drain</code>. Ở bài 10.5 bạn sẽ thấy ai chọn gì: libuv, asyncio của Python, Java NIO và Netty 4.2 đăng ký level-triggered; nginx và Go đăng ký edge-triggered.</p>

<div class="pitfall co-tieu-de">
<p><strong>Edge-triggered "cho nhanh" mà không vét cạn.</strong> ET tiết kiệm vài lần thức, nhưng mọi hàm xử lý phải lặp tới <code>EAGAIN</code> — kể cả <code>accept</code> (nhiều khách có thể xếp hàng sau một sự kiện) và <code>write</code>. Quên ở một nhánh là có những kết nối chỉ treo khi tải cao, lúc hai gói tình cờ tới cùng nhau. Không chắc thì dùng level-triggered; libuv, Netty 4.2 và Java NIO đều dùng.</p>
</div>

<h3>Nhiều luồng, một epoll: EPOLLONESHOT</h3>
<p>Có máy chủ chạy nhiều luồng trên một thực thể epoll (một thread pool cho các hàm xử lý). Bốn luồng cùng chờ; một kết nối nhận phần 1 của request lúc 0 ms và phần 2 lúc 50 ms; xử lý mất 100 ms:</p>
${src('ch10/oneshot.c', 'c')}
${run('c103-epoll', 'gcc -O2 -Wall -pthread -o oneshot oneshot.c')}
<p><strong>Level-triggered</strong>: cả bốn luồng thức dậy vì cùng một sự kiện (dữ liệu vẫn chưa được đọc, nên mỗi lần chờ lại báo nó) — ba luồng không lấy được gì (<code>EAGAIN</code>): thức dậy vô ích. <strong>Edge-triggered</strong>: một luồng thức, nhưng phần 2 là một sườn mới, nên lúc 50 ms một luồng <em>thứ hai</em> nhận cùng kết nối trong khi luồng đầu còn đang xử lý — hai luồng cùng đọc một socket là dữ liệu bị xé lẫn và tranh chấp trạng thái. <strong><code>EPOLLONESHOT</code></strong>: sau một sự kiện, fd bị tắt cho tới khi hàm xử lý "lên dây cót" lại bằng <code>EPOLL_CTL_MOD</code>, nên mỗi lúc chỉ đúng một luồng sở hữu kết nối. (Với vấn đề ngược lại — nhiều luồng hay tiến trình cùng chờ một socket <em>nghe</em> — Linux 4.5 thêm <code>EPOLLEXCLUSIVE</code>; các worker của nginx dùng nó, như dấu vết ở bài 10.5 cho thấy.)</p>
${lab('eventloop', 'race', 'vi', 'Kể cả với MỘT luồng, hai hàm xử lý cùng một tài nguyên vẫn đan xen được qua một await — người anh em đơn luồng của vấn đề edge-triggered ở trên. Xem alice và bob cùng mua chiếc ghế cuối.')}

<div class="pitfall co-tieu-de">
<p><strong>close() không gỡ fd khỏi epoll.</strong> epoll đăng ký <em>mô tả file mở</em>, không phải số fd (<code>man 7 epoll</code>, câu hỏi 6 và 7). Nếu socket đã bị <code>dup</code>, hoặc được tiến trình con kế thừa sau <code>fork</code>, thì <code>close(fd)</code> để lại bản đăng ký và epoll tiếp tục báo sự kiện cho một con số bạn không còn sở hữu. Khi descriptor có thể bị dùng chung, gọi <code>epoll_ctl(EPOLL_CTL_DEL)</code> trước <code>close</code>, và mở socket với <code>SOCK_CLOEXEC</code> (như <code>accept4(…, SOCK_CLOEXEC|SOCK_NONBLOCK)</code> của libuv).</p>
</div>

<h3>Các hệ khác</h3>
<p>BSD và macOS có <strong>kqueue</strong> (<code>kevent</code>, FreeBSD 4.1, năm 2000) — cùng ý tưởng với mô hình sự kiện tổng quát hơn; Windows có <strong>IOCP</strong>, một mô hình hoàn tất giống io_uring. libuv, Netty, Go và Java NIO giấu khác biệt sau một API, vì thế code Node của bạn chạy y nguyên trên Mac (kqueue) và trên VPS (epoll).</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một bạn cùng nhóm viết lại cổng chat của nhóm bằng epoll edge-triggered "cho nhanh". Từ đó mỗi giờ có vài kết nối treo với nửa tin nhắn, không bao giờ xảy ra lúc tải thấp.</p>
<ol>
<li>Chạy <code>./trigger et</code> và <code>./trigger et-drain</code>; giải thích khác biệt trong một câu.</li>
<li>Sửa <code>echo-epoll.c</code> sang <code>EPOLLIN | EPOLLET</code> và mỗi sự kiện chỉ đọc 4 byte; gửi một dòng 10 byte bằng <code>nc</code> và xem echo dừng lại.</li>
<li>Sửa bằng cách đọc tới <code>EAGAIN</code>; kiểm bằng <code>strace -p</code> rằng giờ sau một <code>epoll_pwait</code> là các lần read kết thúc bằng <code>EAGAIN</code>.</li>
<li>Thêm: mở hai khách cùng lúc và kiểm rằng vòng <code>accept4</code> của bạn cũng chạy tới <code>EAGAIN</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> máy chủ edge-triggered dội lại đủ mọi byte của tin 10 byte dù mỗi lần chỉ đọc 4 byte, và bạn nói được runtime nào ở bài 10.5 dùng ET, runtime nào dùng LT.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['select / FD_SETSIZE', 'Chờ trên một mảng cố định 1024 bit đánh số theo số fd; fd ≥ 1024 không dùng được.'],
  ['poll', 'Chờ trên một mảng cỡ bất kỳ, nhưng mỗi lần gọi chép và duyệt cả N phần tử — O(N).'],
  ['epoll instance (thực thể epoll)', 'Đối tượng của nhân (bản thân là một fd) giữ danh sách quan tâm và danh sách sẵn sàng; epoll_wait là O(số sẵn sàng).'],
  ['interest list (danh sách quan tâm)', 'Các fd đã đăng ký bằng epoll_ctl(ADD); thấy được thành dòng tfd trong /proc/PID/fdinfo.'],
  ['ready list (danh sách sẵn sàng)', 'Các fd nhân đánh dấu sẵn sàng qua callback; epoll_wait lấy từ đây.'],
  ['level-triggered / edge-triggered (theo mức / theo sườn)', 'Báo "đọc được" ở mọi lần chờ / báo "vừa trở nên đọc được" một lần mỗi lần dữ liệu tới (EPOLLET).'],
  ['EPOLLONESHOT', 'Tắt fd sau một sự kiện cho tới khi EPOLL_CTL_MOD bật lại; mỗi lúc một luồng sở hữu.'],
  ['EPOLLEXCLUSIVE', 'Chỉ đánh thức một trong các bên cùng chờ một socket nghe (tránh "bầy đàn thức giấc").'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>select</code> hoàn toàn không xử lý được số fd ≥ 1024; <code>FD_SET(1102)</code> làm tiến trình bị abort.</li>
<li>Giá <code>select</code>/<code>poll</code> tăng theo N (676 µs mỗi lần thức ở 10.000 fd); epoll đứng yên ~0,7 µs.</li>
<li>epoll = danh sách quan tâm (sửa một lần bằng epoll_ctl) + danh sách sẵn sàng (nhân nạp); đọc được danh sách quan tâm trong <code>/proc/PID/fdinfo</code>.</li>
<li>Edge-triggered bắt buộc fd không chặn và vét tới EAGAIN, không thì dữ liệu bị bỏ lại.</li>
<li>Nhiều luồng trên một epoll: dùng EPOLLONESHOT cho kết nối và EPOLLEXCLUSIVE cho socket nghe.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/epoll.7.html', '📄', 'man 7 epoll', 'Danh sách quan tâm và sẵn sàng, level vs edge triggered, và phần hỏi đáp về close() và dup().', 'Mở')}
${L('https://man7.org/linux/man-pages/man2/select.2.html', '📄', 'man 2 select', 'FD_SETSIZE và vì sao code mới nên dùng poll hoặc epoll.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 10.4 — C10K đo thật ───────────────────────── */
    {
      title: '10.4 — C10K, measured: a thread per connection vs one epoll loop at 1k–10k|||10.4 — C10K đo thật: mỗi kết nối một luồng vs một vòng epoll ở 1k–10k',
      slug: 'os-10-5-c10k',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Máy tạo tải tai.c tự viết (một luồng epoll, đo độ trễ vòng) bắn 1k/5k/10k kết nối vào echo-thread (mỗi kết nối một luồng) và echo-epoll (một luồng): 10.000 luồng tốn RSS 122 MiB + 156 MiB stack nhân không hiện trong RSS, CPU gấp 2,5 lần và chuyển ngữ cảnh gấp 5 lần; ở 5.000 kết nối × 10 tin/giây p99 của luồng đã lên 24,5 ms, ở 10.000 thì sập (p50 95 ms, p99 322 ms) còn epoll giữ p99 0,38 ms; định luật Little: 10.000 kết nối chỉ có ~1 việc đang chạy; ba bức tường: --pids-limit 1000 (pthread_create EAGAIN ở kết nối 997), --memory 192m (OOM 137 ở ~4.600 kết nối), ulimit -n 1024 (accept EMFILE + level-triggered = vòng quay 100% CPU).',
      content: `${G104}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>C10K, measured</h2>
<p class="lead">In 1999 Dan Kegel asked how one web server could serve ten thousand clients at once — the "C10K problem". Two designs compete: <strong>one thread per connection</strong> (each thread blocks in <code>read()</code>, model 1) and <strong>one event loop</strong> (one thread, epoll, model 3). This lesson stops arguing and measures both at 1,000, 5,000 and 10,000 connections: <strong>memory, threads, CPU, context switches and latency — and the three limits that kill a thread-per-connection server long before the CPU does.</strong></p>

<h3>The two servers and the load generator</h3>
<p><code>echo-epoll</code> is the 60-line server from lesson 10.3. <code>echo-thread</code> does the same with a thread per connection:</p>
${src('ch10/echo-thread.c', 'c')}
<p>The load generator <code>tai</code> is written for this lab: one thread with epoll opens N connections, sends a 64-byte message on each one at a fixed rate (spread evenly in time), waits for the echo and records the round trip. It also reports "late sends" — when it falls behind its own schedule — and its own CPU, so we know when the <em>client</em> is the bottleneck. Everything runs in one container on 10 cores, over loopback.</p>
${src('ch10/tai.c', 'c')}
<p>Each measurement starts a fresh server, runs <code>tai</code> for 4 seconds, and at second 3 photographs the server (threads, fds, RSS, CPU, context switches) and the change in the machine's <code>KernelStack</code>:</p>
${src('ch10/c10k.sh', 'bash')}

<h3>Round 1 — a chat app: each connection sends once a second</h3>
${run('c104-c10k', './c10k.sh echo-thread 1000 1000')}
${run('c104-c10k', './c10k.sh echo-epoll 1000 1000')}
${run('c104-c10k', './c10k.sh echo-thread 10000 1000')}
${run('c104-c10k', './c10k.sh echo-epoll 10000 1000')}
<p>At this load <strong>both models answer in under a millisecond at p50</strong> — one message per second per client is easy for 10 cores. The difference is in what it costs to be ready:</p>
<table>
<tr><th>10,000 connections, 1 msg/s each</th><th>thread per connection</th><th>epoll loop</th></tr>
<tr><td>threads</td><td>10,001</td><td>1</td></tr>
<tr><td>RSS (user memory)</td><td>122.6 MiB</td><td>40.9 MiB (our 4 KiB buffer per connection)</td></tr>
<tr><td>kernel stacks (not in RSS!)</td><td>+156 MiB</td><td>+0</td></tr>
<tr><td>CPU used in 3 s</td><td>1.02 s</td><td>0.41 s</td></tr>
<tr><td>context switches</td><td>32,136</td><td>5,956</td></tr>
</table>
<p>Every thread has a <strong>16 KiB kernel stack</strong> on this arm64 kernel (10,000 × 16 KiB = 156 MiB), which <code>ps</code> and <code>docker stats</code>' RSS-style numbers do not show but the memory cgroup <em>does</em> charge. Every thread also has its user stack (8 MiB reserved, only the touched pages count: ~12 KiB each here) and a <code>task_struct</code>. Five thousand connections fall exactly in between (63 MiB RSS + 78 MiB kernel stacks vs 21 MiB).</p>

<h3>Round 2 — busier: each connection sends 10 times a second</h3>
${run('c104-c10k', './c10k.sh echo-thread 5000 100')}
${run('c104-c10k', './c10k.sh echo-epoll 5000 100')}
${run('c104-c10k', './c10k.sh echo-thread 10000 100')}
${run('c104-c10k', './c10k.sh echo-epoll 10000 100', 1, { drop: /^# / })}
<p>At 1,000 connections × 10 msg/s both are fine. At 5,000 (50,000 msg/s) the thread server's median is still 0.05 ms, but it pays almost three times the CPU (2.72 s vs 0.96 s) and three times the context switches, and its tail grows: <strong>p99 24.5 ms vs 0.23 ms</strong>. At <strong>10,000 × 10 msg/s</strong> the thread server falls over: <strong>p50 95 ms, p99 322 ms</strong>, and even the load generator gets starved (61,800 late sends) because ten thousand runnable threads fight for ten cores, each wake-up costing a context switch (<a href="${OS('os-3-3-context-switch')}">lesson 3.3</a>). The epoll server handles the same 100,000 msg/s with <strong>p99 0.38 ms</strong> on one thread, using 1.33 s of CPU. The exact numbers move between runs (in our repeated runs the thread server's p99 at this load ranged from about 140 to 320 ms); the gap of three orders of magnitude is what repeats.</p>
${lab('threadpool', 'mm1', 'en', 'Little’s law, L = λ × W: 10,000 connections sending 10,000 messages per second with W = 0.1 ms means only about ONE message is being worked on at any moment. A thread per connection pays for 10,000 sleeping threads to do the work of one.')}
<p>That is the real lesson of C10K: <strong>connections are not concurrency</strong>. Most connections are idle most of the time; what you need resources for is the work in progress (Little's law, L = λW). A thread per connection ties a whole thread to each idle connection; an event loop only spends memory on a socket and a small buffer.</p>

<h3>Three walls you hit before the CPU</h3>
<p><strong>Wall 1 — the task limit.</strong> Containers and orchestrators often cap the number of processes + threads (<code>--pids-limit</code>, Kubernetes <code>podPidsLimit</code>, systemd <code>TasksMax</code>). With 1,000:</p>
${run('c104-pids', 'cat /sys/fs/cgroup/pids.max', 4)}
${run('c104-pids', './echo-epoll 7000', 2)}
<p>At connection 997 <code>pthread_create</code> failed with <code>EAGAIN</code> ("Resource temporarily unavailable") and the server closed the next 2,004 connections — the same error message a Java service prints as <code>OutOfMemoryError: unable to create native thread</code>. The epoll server served all 3,000 under the same limit.</p>
<p><strong>Wall 2 — the memory limit</strong>, kernel stacks included. A 192 MiB container:</p>
${run('c104-mem', './echo-thread 7001', 4)}
${run('c104-mem', './echo-epoll 7000', 3)}
<p>The thread server was <strong>killed by the OOM killer at about 4,600 connections</strong> (exit 137, <code>oom_kill 1</code> — <a href="${OS('os-8-4-exit137')}">lesson 8.4</a>) while its RSS was still far below 192 MiB: the kernel stacks did it. The epoll server then held 10,000 connections in the same container.</p>
<p><strong>Wall 3 — the fd limit.</strong> With <code>ulimit -n 1024</code> and 2,000 clients, the epoll server does not crash. It does something worse:</p>
${run('c104-fd', 'ulimit -Sn 1024', 5)}
<p>1.97 seconds of CPU in 2 seconds: <strong>100% of a core, doing nothing</strong>. <code>accept4</code> fails with <code>EMFILE</code>, the pending connection stays in the accept queue, so the level-triggered listening socket is ready again immediately — 9,359 failed accepts per second (under strace). Meanwhile the clients already connected are still served. Real event loops handle this explicitly: libuv keeps a spare fd open and, on <code>EMFILE</code>, closes it, accepts and immediately closes pending connections, then reopens the spare; nginx stops watching its listening sockets for a moment and logs <code>accept4() failed (24: Too many open files)</code>. And raise the limit: Docker gives 1,048,576 here, but systemd services and many hosts start at 1,024 (<a href="${OS('os-2-5-mang-fd')}">lesson 2.5</a>).</p>

<div class="pitfall co-tieu-de">
<p><strong>Reading RSS to size a thread-per-connection server.</strong> RSS said 122 MiB for 10,000 threads; the cgroup charged that <em>plus</em> 156 MiB of kernel stacks, plus page tables and task structs. That is how a container with a "comfortable" 192 MiB limit died with exit 137 at 4,600 connections. Size thread-heavy services by the cgroup's <code>memory.current</code>, not by RSS, and test with the number of connections you expect at peak.</p>
</div>

<h3>So is thread-per-connection wrong?</h3>
<p>No — it is simpler code, and below a few thousand concurrent connections it measured just as fast. Spring MVC on Tomcat (200 threads by default) is perfectly fine for an API whose requests are short. It fails when connections are <em>long-lived and mostly idle</em> — WebSockets, Server-Sent Events, long polling, slow mobile clients — or when the thread count is capped. Modern runtimes offer a third way that keeps the blocking code style: <strong>virtual threads</strong> (Java 21, <a href="${OS('os-3-1-luong')}">lesson 3.1</a>) and <strong>goroutines</strong> park cheap user-space threads and let the runtime wait on epoll for them. Lesson 10.5 shows Go doing exactly that.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the team's notification service keeps one Server-Sent Events connection per logged-in user. It works in testing; in production, at about 1,000 users, new users get disconnected and the logs say "unable to create native thread". The container has <code>pids: 1024</code>.</p>
<ol>
<li>Reproduce with <code>docker run --pids-limit 1000 …</code>, <code>echo-thread</code> and <code>./tai 7001 3000 2 1000</code>; find the connection number where <code>pthread_create</code> fails.</li>
<li>Run the same load against <code>echo-epoll</code> and compare <code>./xem.sh</code> output.</li>
<li>In a container with <code>--memory 192m</code>, find roughly how many connections each server survives; read <code>memory.events</code>.</li>
<li>Write a one-paragraph recommendation: raise the limits, move the SSE endpoint to an event loop, or use virtual threads — with the numbers you measured.</li>
</ol>
<p><strong>Done when:</strong> your recommendation quotes at least three measured numbers (threads, kernel stack MiB, the failing connection count) and explains why connections ≠ concurrency.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['C10K', 'Dan Kegel’s 1999 question: serving 10,000 simultaneous clients on one machine.'],
  ['thread per connection', 'Each client gets a thread that blocks in read(); simple, but every idle client costs a thread.'],
  ['event loop', 'One thread waits on epoll for all clients and runs a handler for whichever is ready.'],
  ['kernel stack', 'Per-thread stack inside the kernel (16 KiB here); charged to the cgroup, invisible in RSS.'],
  ['pids limit', 'Cgroup cap on processes + threads (pids.max); pthread_create fails with EAGAIN when reached.'],
  ['Little’s law', 'L = λ × W: work in progress = arrival rate × time per item; independent of connection count.'],
  ['EMFILE busy loop', 'accept fails at the fd limit, the connection stays queued, level-triggered epoll wakes forever.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>At low rates both models gave sub-millisecond latency; the thread model paid 3× user memory plus 16 KiB of kernel stack per thread (156 MiB at 10,000).</li>
<li>Under load the thread model’s tail grew first (p99 24.5 ms at 5,000 × 10 msg/s) and collapsed at 10,000 × 10 msg/s (p99 322 ms) while one epoll thread kept p99 at 0.38 ms.</li>
<li>Connections are not concurrency: by Little’s law only ~1 message was in progress at a time.</li>
<li>Thread-per-connection hits three walls first: the pids limit (EAGAIN at 997), memory limits (OOM 137 at ~4,600) and, for everyone, the fd limit.</li>
<li>An event loop must handle EMFILE explicitly, or level-triggered accept spins at 100% CPU.</li>
</ul>
${L('http://www.kegel.com/c10k.html', '📄', 'The C10K problem (Dan Kegel)', 'The 1999 page that named the problem and compared the I/O strategies.', 'Open')}
${L('https://docs.kernel.org/admin-guide/cgroup-v2.html', '📄', 'Control Group v2 (kernel.org)', 'pids.max, memory.max, memory.events — the limits used in this lesson.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>C10K, đo thật</h2>
<p class="lead">Năm 1999 Dan Kegel hỏi làm sao một máy chủ web phục vụ được mười nghìn khách cùng lúc — "bài toán C10K". Hai thiết kế cạnh tranh: <strong>mỗi kết nối một luồng</strong> (mỗi luồng chặn trong <code>read()</code>, mô hình 1) và <strong>một event loop</strong> (một luồng, epoll, mô hình 3). Bài này thôi tranh cãi và đo cả hai ở 1.000, 5.000 và 10.000 kết nối: <strong>bộ nhớ, số luồng, CPU, chuyển ngữ cảnh và độ trễ — và ba giới hạn giết máy chủ mỗi-kết-nối-một-luồng từ lâu trước khi CPU kịp cạn.</strong></p>

<h3>Hai máy chủ và máy tạo tải</h3>
<p><code>echo-epoll</code> là máy chủ 60 dòng ở bài 10.3. <code>echo-thread</code> làm y vậy nhưng mỗi kết nối một luồng:</p>
${src('ch10/echo-thread.c', 'c')}
<p>Máy tạo tải <code>tai</code> viết riêng cho lab này: một luồng dùng epoll mở N kết nối, gửi một tin 64 byte trên mỗi kết nối với nhịp cố định (rải đều theo thời gian), chờ máy chủ dội lại và ghi độ trễ vòng. Nó cũng báo "late sends" — khi chính nó tụt khỏi lịch — và CPU của chính nó, để ta biết khi nào <em>bên khách</em> mới là nút cổ chai. Tất cả chạy trong một container trên 10 lõi, qua loopback.</p>
${src('ch10/tai.c', 'c')}
<p>Mỗi phép đo chạy một máy chủ mới, chạy <code>tai</code> 4 giây, và ở giây thứ 3 chụp máy chủ (luồng, fd, RSS, CPU, chuyển ngữ cảnh) cùng mức tăng <code>KernelStack</code> của máy:</p>
${src('ch10/c10k.sh', 'bash')}

<h3>Vòng 1 — một ứng dụng chat: mỗi kết nối gửi mỗi giây một lần</h3>
${run('c104-c10k', './c10k.sh echo-thread 1000 1000')}
${run('c104-c10k', './c10k.sh echo-epoll 1000 1000')}
${run('c104-c10k', './c10k.sh echo-thread 10000 1000')}
${run('c104-c10k', './c10k.sh echo-epoll 10000 1000')}
<p>Ở mức tải này <strong>cả hai mô hình trả lời dưới một mili giây ở p50</strong> — mỗi khách một tin mỗi giây là nhẹ với 10 lõi. Khác biệt nằm ở cái giá để luôn sẵn sàng:</p>
<table>
<tr><th>10.000 kết nối, mỗi kết nối 1 tin/giây</th><th>mỗi kết nối một luồng</th><th>vòng epoll</th></tr>
<tr><td>số luồng</td><td>10.001</td><td>1</td></tr>
<tr><td>RSS (bộ nhớ người dùng)</td><td>122,6 MiB</td><td>40,9 MiB (bộ đệm 4 KiB mỗi kết nối của ta)</td></tr>
<tr><td>stack nhân (không có trong RSS!)</td><td>+156 MiB</td><td>+0</td></tr>
<tr><td>CPU tiêu trong 3 s</td><td>1,02 s</td><td>0,41 s</td></tr>
<tr><td>chuyển ngữ cảnh</td><td>32.136</td><td>5.956</td></tr>
</table>
<p>Mỗi luồng có một <strong>stack nhân 16 KiB</strong> trên nhân arm64 này (10.000 × 16 KiB = 156 MiB) — <code>ps</code> và các con số kiểu RSS của <code>docker stats</code> không hiện, nhưng cgroup bộ nhớ <em>có</em> tính. Mỗi luồng còn có stack người dùng (giữ chỗ 8 MiB, chỉ tính các trang đã đụng tới: ~12 KiB mỗi luồng ở đây) và một <code>task_struct</code>. Năm nghìn kết nối nằm đúng ở giữa (RSS 63 MiB + 78 MiB stack nhân so với 21 MiB).</p>

<h3>Vòng 2 — bận hơn: mỗi kết nối gửi 10 lần mỗi giây</h3>
${run('c104-c10k', './c10k.sh echo-thread 5000 100')}
${run('c104-c10k', './c10k.sh echo-epoll 5000 100')}
${run('c104-c10k', './c10k.sh echo-thread 10000 100')}
${run('c104-c10k', './c10k.sh echo-epoll 10000 100', 1, { drop: /^# / })}
<p>Ở 1.000 kết nối × 10 tin/giây cả hai đều ổn. Ở 5.000 (50.000 tin/giây) trung vị của máy chủ luồng vẫn 0,05 ms, nhưng nó trả gần gấp ba CPU (2,72 s so với 0,96 s) và gấp ba số chuyển ngữ cảnh, và phần đuôi của nó dài ra: <strong>p99 24,5 ms so với 0,23 ms</strong>. Ở <strong>10.000 × 10 tin/giây</strong> máy chủ luồng gục: <strong>p50 95 ms, p99 322 ms</strong>, và đến cả máy tạo tải cũng bị bỏ đói (61.800 lần gửi trễ) vì mười nghìn luồng sẵn sàng chạy giành nhau mười lõi, mỗi lần thức tốn một lần chuyển ngữ cảnh (<a href="${OS('os-3-3-context-switch')}">bài 3.3</a>). Máy chủ epoll xử lý đúng 100.000 tin/giây đó với <strong>p99 0,38 ms</strong> trên một luồng, tốn 1,33 s CPU. Con số chính xác xê dịch giữa các lần chạy (trong các lần chạy lặp của chúng tôi, p99 của máy chủ luồng ở mức tải này dao động khoảng 140 tới 320 ms); khoảng cách ba bậc độ lớn mới là thứ lặp lại.</p>
${lab('threadpool', 'mm1', 'vi', 'Định luật Little, L = λ × W: 10.000 kết nối gửi 10.000 tin mỗi giây với W = 0,1 ms nghĩa là mỗi thời điểm chỉ có khoảng MỘT tin đang được xử lý. Mỗi kết nối một luồng là trả tiền cho 10.000 luồng ngủ để làm việc của một luồng.')}
<p>Đó mới là bài học thật của C10K: <strong>kết nối không phải là đồng thời</strong>. Phần lớn kết nối nằm im phần lớn thời gian; thứ bạn cần tài nguyên là phần việc đang dở (định luật Little, L = λW). Mỗi kết nối một luồng là buộc cả một luồng vào mỗi kết nối đang ngủ; event loop chỉ tốn bộ nhớ cho một socket và một bộ đệm nhỏ.</p>

<h3>Ba bức tường bạn đụng phải trước CPU</h3>
<p><strong>Bức tường 1 — giới hạn số tác vụ.</strong> Container và bộ điều phối thường chặn số tiến trình + luồng (<code>--pids-limit</code>, <code>podPidsLimit</code> của Kubernetes, <code>TasksMax</code> của systemd). Với 1.000:</p>
${run('c104-pids', 'cat /sys/fs/cgroup/pids.max', 4)}
${run('c104-pids', './echo-epoll 7000', 2)}
<p>Ở kết nối 997, <code>pthread_create</code> thất bại với <code>EAGAIN</code> ("Resource temporarily unavailable") và máy chủ đóng 2.004 kết nối tiếp theo — đúng thông báo mà một dịch vụ Java in thành <code>OutOfMemoryError: unable to create native thread</code>. Máy chủ epoll phục vụ đủ 3.000 dưới cùng giới hạn.</p>
<p><strong>Bức tường 2 — giới hạn bộ nhớ</strong>, tính cả stack nhân. Một container 192 MiB:</p>
${run('c104-mem', './echo-thread 7001', 4)}
${run('c104-mem', './echo-epoll 7000', 3)}
<p>Máy chủ luồng <strong>bị OOM killer giết ở khoảng 4.600 kết nối</strong> (exit 137, <code>oom_kill 1</code> — <a href="${OS('os-8-4-exit137')}">bài 8.4</a>) trong khi RSS của nó còn xa mới tới 192 MiB: thủ phạm là stack nhân. Sau đó máy chủ epoll giữ 10.000 kết nối trong cùng container.</p>
<p><strong>Bức tường 3 — giới hạn fd.</strong> Với <code>ulimit -n 1024</code> và 2.000 khách, máy chủ epoll không sập. Nó làm một việc tệ hơn:</p>
${run('c104-fd', 'ulimit -Sn 1024', 5)}
<p>1,97 giây CPU trong 2 giây: <strong>trọn 100% một lõi, không làm gì cả</strong>. <code>accept4</code> thất bại với <code>EMFILE</code>, kết nối đang chờ vẫn nằm trong hàng accept, nên socket nghe level-triggered lập tức sẵn sàng lại — 9.359 lần accept hỏng mỗi giây (dưới strace). Trong lúc đó các khách đã kết nối vẫn được phục vụ. Event loop thật xử lý việc này một cách tường minh: libuv giữ sẵn một fd dự phòng, gặp <code>EMFILE</code> thì đóng nó, accept rồi đóng ngay các kết nối đang chờ, rồi mở lại fd dự phòng; nginx tạm ngừng theo dõi socket nghe một lúc và ghi log <code>accept4() failed (24: Too many open files)</code>. Và nâng giới hạn lên: Docker cho 1.048.576 ở đây, nhưng dịch vụ systemd và nhiều máy khởi đầu ở 1.024 (<a href="${OS('os-2-5-mang-fd')}">bài 2.5</a>).</p>

<div class="pitfall co-tieu-de">
<p><strong>Đọc RSS để định cỡ máy chủ mỗi-kết-nối-một-luồng.</strong> RSS nói 122 MiB cho 10.000 luồng; cgroup tính chừng đó <em>cộng</em> 156 MiB stack nhân, cộng bảng trang và task struct. Đó là cách một container có giới hạn 192 MiB "thoải mái" chết với exit 137 ở 4.600 kết nối. Định cỡ dịch vụ nhiều luồng bằng <code>memory.current</code> của cgroup, không phải bằng RSS, và thử với đúng số kết nối bạn chờ đợi lúc cao điểm.</p>
</div>

<h3>Vậy mỗi kết nối một luồng là sai?</h3>
<p>Không — code đơn giản hơn, và dưới vài nghìn kết nối đồng thời nó đo được nhanh ngang ngửa. Spring MVC trên Tomcat (mặc định 200 luồng) hoàn toàn ổn cho một API có request ngắn. Nó hỏng khi kết nối <em>sống lâu và phần lớn nằm im</em> — WebSocket, Server-Sent Events, long polling, khách di động chậm — hoặc khi số luồng bị chặn trần. Runtime hiện đại có lối thứ ba giữ nguyên lối viết code chặn: <strong>virtual thread</strong> (Java 21, <a href="${OS('os-3-1-luong')}">bài 3.1</a>) và <strong>goroutine</strong> cho các luồng người dùng rẻ tiền "đỗ" lại và để runtime chờ epoll thay cho chúng. Bài 10.5 cho thấy Go làm đúng như vậy.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> dịch vụ thông báo của nhóm giữ một kết nối Server-Sent Events cho mỗi người dùng đang đăng nhập. Lúc thử nghiệm thì chạy; trên production, khoảng 1.000 người dùng là người mới bị ngắt kết nối và log ghi "unable to create native thread". Container có <code>pids: 1024</code>.</p>
<ol>
<li>Tái hiện bằng <code>docker run --pids-limit 1000 …</code>, <code>echo-thread</code> và <code>./tai 7001 3000 2 1000</code>; tìm số kết nối mà <code>pthread_create</code> thất bại.</li>
<li>Chạy cùng tải vào <code>echo-epoll</code> và so output <code>./xem.sh</code>.</li>
<li>Trong container <code>--memory 192m</code>, tìm xem mỗi máy chủ sống được khoảng bao nhiêu kết nối; đọc <code>memory.events</code>.</li>
<li>Viết một đoạn đề xuất: nâng giới hạn, chuyển endpoint SSE sang event loop, hay dùng virtual thread — kèm các con số bạn đo được.</li>
</ol>
<p><strong>Đạt khi:</strong> đề xuất của bạn dẫn ít nhất ba con số đo được (số luồng, MiB stack nhân, số kết nối lúc hỏng) và giải thích vì sao kết nối ≠ đồng thời.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['C10K', 'Câu hỏi năm 1999 của Dan Kegel: phục vụ 10.000 khách cùng lúc trên một máy.'],
  ['thread per connection (mỗi kết nối một luồng)', 'Mỗi khách một luồng chặn trong read(); đơn giản, nhưng khách nằm im nào cũng tốn một luồng.'],
  ['event loop (vòng lặp sự kiện)', 'Một luồng chờ epoll cho mọi khách và chạy hàm xử lý cho khách nào sẵn sàng.'],
  ['kernel stack (stack nhân)', 'Stack riêng của mỗi luồng bên trong nhân (16 KiB ở đây); cgroup có tính, RSS không hiện.'],
  ['pids limit (giới hạn số tác vụ)', 'Trần của cgroup cho tiến trình + luồng (pids.max); chạm trần thì pthread_create trả EAGAIN.'],
  ['Little’s law (định luật Little)', 'L = λ × W: việc đang dở = tốc độ tới × thời gian mỗi việc; không phụ thuộc số kết nối.'],
  ['EMFILE busy loop (vòng quay EMFILE)', 'accept hỏng ở giới hạn fd, kết nối vẫn nằm hàng, epoll level-triggered đánh thức mãi.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ở tốc độ thấp cả hai mô hình cho độ trễ dưới mili giây; mô hình luồng trả gấp 3 bộ nhớ người dùng cộng 16 KiB stack nhân mỗi luồng (156 MiB ở 10.000).</li>
<li>Dưới tải, phần đuôi của mô hình luồng dài ra trước (p99 24,5 ms ở 5.000 × 10 tin/giây) rồi sập ở 10.000 × 10 tin/giây (p99 322 ms) trong khi một luồng epoll giữ p99 0,38 ms.</li>
<li>Kết nối không phải đồng thời: theo định luật Little mỗi lúc chỉ ~1 tin đang được xử lý.</li>
<li>Mỗi kết nối một luồng đụng ba bức tường trước: giới hạn pids (EAGAIN ở 997), giới hạn bộ nhớ (OOM 137 ở ~4.600) và, với mọi người, giới hạn fd.</li>
<li>Event loop phải xử lý EMFILE tường minh, không thì accept level-triggered quay 100% CPU.</li>
</ul>
${L('http://www.kegel.com/c10k.html', '📄', 'The C10K problem (Dan Kegel)', 'Trang năm 1999 đặt tên cho bài toán và so các chiến lược I/O.', 'Mở')}
${L('https://docs.kernel.org/admin-guide/cgroup-v2.html', '📄', 'Control Group v2 (kernel.org)', 'pids.max, memory.max, memory.events — các giới hạn dùng trong bài.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 10.5 — Runtime trên epoll ───────────────────────── */
    {
      title: '10.5 — Node, nginx, Netty, Go, asyncio: the same epoll underneath|||10.5 — Node, nginx, Netty, Go, asyncio: cùng một epoll bên dưới',
      slug: 'os-10-6-runtime',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Sáu máy chủ echo/HTTP viết bằng Node (libuv 1.51), Python asyncio, Java NIO, Netty 4.2 transport epoll gốc, Go 1.27 và nginx 1.28: strace một khách cho thấy cùng chuỗi epoll_pwait → accept4 → epoll_ctl(ADD) → read/write → DEL; ai dùng level- hay edge-triggered, nginx dùng EPOLLEXCLUSIVE; mỗi tiến trình thật có bao nhiêu luồng; cùng một tải 2.000 kết nối × 10 tin/giây: luồng, RSS, CPU, p99 của từng runtime (không phải bảng xếp hạng ngôn ngữ); io.Copy của Go chọn splice và tốn 3 fd mỗi kết nối.',
      content: `${G105}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>The same epoll underneath</h2>
<p class="lead">You will probably never call <code>epoll_wait</code> yourself. You write <code>app.get(…)</code> in Express, <code>async def</code> in FastAPI, a Netty handler, a Go <code>http.HandleFunc</code>, or an nginx config. This lesson takes six real servers apart with <code>strace</code> and asks: <strong>is it really the same epoll loop from lesson 10.3 underneath each of them — and what does each runtime add on top, in threads, memory and latency, under the same load?</strong> (Lesson 3.5 compared Node's event loop with Spring's thread pool at the application level; here we look one layer down.)</p>

<h3>Six servers</h3>
<p>Echo servers in Node, Python asyncio, Java NIO (plain JDK <code>Selector</code>), Netty 4.2 with its native epoll transport, and Go; plus nginx serving HTTP. The source is short — that is the point of these runtimes:</p>
${src('ch10/echo.js', 'javascript')}
${src('ch10/echo_async.py', 'python')}
${src('ch10/echo.go', 'go')}
<p>(<code>EchoNio.java</code> is the selector loop of lesson 10.3 written in Java; <code>EchoNetty.java</code> is twenty lines of Netty bootstrap — both are in <code>lab/code/ch10</code>.)</p>
${run('c105-runtime', 'node --version')}
${run('c105-runtime', 'node echo.js 7301', 7)}

<h3>One client, traced in each runtime</h3>
<p>Each server is warmed up with a few requests (so the JVM has loaded its classes), then <code>strace -f -p</code> follows all its threads while one client sends "hi":</p>
<p><strong>Node (libuv)</strong></p>
${run('c105-runtime', 'strace -f -qq -e signal=none -e $T -p $NODE')}
<p><strong>Python asyncio</strong></p>
${run('c105-runtime', 'strace -f -qq -e signal=none -e $T -p $PY')}
<p><strong>Java NIO</strong></p>
${run('c105-runtime', 'strace -f -qq -e signal=none -e $T -p $NIO')}
<p><strong>Netty 4.2, native epoll transport</strong></p>
${run('c105-runtime', 'strace -f -qq -e signal=none -e $T -p $NETTY')}
<p><strong>Go</strong></p>
${run('c105-runtime', 'strace -f -qq -e signal=none -e $T -p $GO')}
<p>It is the same skeleton every time: <strong>wait in epoll → accept → register the new socket (<code>EPOLL_CTL_ADD</code>) → wait → read → write → read 0 → unregister</strong>. The differences are details you can now read: Node and Python call epoll again with timeout 0 after each callback (draining whatever else is ready before sleeping); Python uses <code>recvfrom</code>/<code>sendto</code> (what <code>socket.recv</code> compiles to); Java NIO accepts with a plain <code>accept</code> and sets non-blocking separately; Netty waits in <code>epoll_pwait2</code> with a 1-second timeout (its loop wakes up to run scheduled tasks), and registers <code>EPOLLRDHUP</code> to learn early that a peer closed. Go is the interesting one: the socket is registered <strong>once</strong> with <code>EPOLLIN|EPOLLOUT|EPOLLRDHUP|EPOLLET</code> — edge-triggered for both directions — and the <code>read</code>/<code>write</code> happen on <em>another OS thread</em> (1052) than the one that waited (1076). Your goroutine called <code>c.Read()</code>, which looked blocking; the runtime parked the goroutine, waited in epoll for it, and resumed it on whatever thread was free. That is how Go keeps blocking-style code with event-loop costs.</p>
<p><strong>nginx</strong> was started under strace from the beginning:</p>
${run('c105-runtime', 'curl -s http://127.0.0.1:8080/hello')}
<p>Both workers (1104 and 1105) add the same listening socket fd 4 to their own epoll with <strong><code>EPOLLEXCLUSIVE</code></strong>, so a new connection wakes only one of them (lesson 10.3). The worker that accepted then <em>removes and re-adds</em> the listening socket (<code>DEL</code> then <code>ADD</code>) — nginx's way to move itself to the back of the wait queue so that the next connection goes to the other worker. Client sockets are registered edge-triggered (<code>EPOLLET</code>). The timeouts in <code>epoll_pwait</code> are nginx's own timers: 60,000 ms while waiting for the request headers (<code>client_header_timeout</code>) and 75,000 ms on the idle keep-alive connection (<code>keepalive_timeout</code>) — lesson 10.8 is about those.</p>
<table>
<tr><th>Runtime (lab version)</th><th>Wait call</th><th>Trigger</th><th>Who waits</th><th>Your code looks like</th></tr>
<tr><td>Node 22.23 / libuv 1.51</td><td>epoll_pwait</td><td>level</td><td>1 loop thread</td><td>callbacks, promises</td></tr>
<tr><td>Python 3.14 asyncio</td><td>epoll_pwait (EpollSelector)</td><td>level</td><td>1 loop thread</td><td>async / await</td></tr>
<tr><td>Java 21 NIO</td><td>epoll_pwait (EPollSelectorImpl)</td><td>level</td><td>1 thread per Selector</td><td>selector loop</td></tr>
<tr><td>Netty 4.2.19 native</td><td>epoll_pwait2 (JNI)</td><td>level</td><td>N event loops (2 here)</td><td>handlers</td></tr>
<tr><td>Go 1.27</td><td>epoll_pwait (netpoller)</td><td>edge</td><td>runtime threads</td><td>blocking-style goroutines</td></tr>
<tr><td>nginx 1.28</td><td>epoll_pwait per worker</td><td>edge (+EXCLUSIVE listen)</td><td>1 thread per worker</td><td>configuration</td></tr>
</table>

<h3>How many threads does an "event loop" process have?</h3>
${run('c105-runtime', 'for p in $NODE $PY $NIO $NETTY $GO', 1, { drop: /^# / })}
<p>"Single-threaded" Node has 7 threads: the loop thread plus V8's helpers (platform workers for garbage collection and compilation, a delayed-task scheduler); its libuv pool has not started yet (lesson 10.6 shows when it does). asyncio has a second thread, <code>asyncio_0</code>: the default executor, started because <code>start_server</code> resolves the address with <code>getaddrinfo</code> in a thread. The JVM has 18 threads before Netty adds its two <code>multiThreadIoEventLoop</code> threads — G1 GC, C1/C2 compilers, the reference handler and more. Go has 5 OS threads for any number of goroutines. One event loop does not mean one thread; it means <strong>one thread per loop waits for all the sockets</strong>.</p>
${lab('eventloop', 'offload', 'en', 'In every runtime above, the loop thread must only wait and dispatch. Heavy work goes elsewhere — a worker thread, a pool, another process — exactly what this preset shows.')}

<h3>Same load for everyone</h3>
<p>2,000 connections, each sending 64 bytes ten times per second — 20,000 messages per second for 3 seconds — measured with the <code>tai</code> generator of lesson 10.4. <code>do-tai.sh</code> prints the server's threads, fds and RSS halfway, the CPU it used during the run, and the round-trip latency:</p>
${run('c105-runtime', './do-tai.sh node 7301', 6)}
<p>All six handled the load with a median under 0.15 ms. The differences are in the cost and the tail:</p>
<ul>
<li><strong>Memory</strong> follows the runtime, not the model: Go 22 MiB, Python 37 MiB, Node 74 MiB, Java NIO 80 MiB, Netty 166 MiB (a JVM starts with a heap, JIT code and class metadata; Netty adds pooled buffers).</li>
<li><strong>Python's tail</strong> is the longest (p99 23 ms): one interpreter thread handles each batch of ready sockets in Python code, so the last socket of a large batch waits.</li>
<li><strong>Go used the most CPU</strong> (4.39 s). Its syscall profile below is dominated by <code>futex</code>, <code>nanosleep</code> and <code>sched_yield</code>: idle runtime threads spinning briefly to look for work before sleeping, which buys latency with CPU on a 10-core machine (<code>GOMAXPROCS</code> limits it).</li>
<li><strong><code>io.Copy</code> is not a plain loop.</strong> The <code>go-copy</code> server has <em>three</em> fds per connection: for TCP-to-TCP copies Go chooses <code>splice(2)</code> through a pipe. Zero-copy is a win for large transfers; for 64-byte messages it costs a pipe per connection and more syscalls.</li>
</ul>
${run('c105-runtime', 'strace -f -qq -c -p $GOC')}
${run('c105-runtime', './tai 8080 2000 3 0')}
<p>nginx's two workers held 2,000 idle connections with one thread each and 13.7 MiB RSS each. These numbers are for <em>this</em> load on <em>this</em> machine; they show where costs come from, not which language is "fastest".</p>

<div class="pitfall co-tieu-de">
<p><strong>Blocking the loop thread in a non-blocking runtime.</strong> Every runtime above has exactly one thread (per loop) that waits in epoll. A synchronous call on it — <code>fs.readFileSync</code>, <code>bcrypt.hashSync</code>, <code>time.sleep</code> in an <code>async def</code>, a JDBC call inside a Netty handler — stops <em>every</em> connection of that loop, just like the blocking server of lesson 10.1. Python warns about it with <code>PYTHONASYNCIODEBUG=1</code> ("Executing … took 0.2 seconds"), Netty with <code>BlockHound</code>, Node with <code>--trace-sync-io</code>. Go is the exception that proves the rule: its runtime moves other goroutines to other threads.</p>
</div>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your team argues whether to write a new real-time service in Node, Go or Spring WebFlux (Netty). Instead of arguing, you measure.</p>
<ol>
<li>Start two of the echo servers in the lab (with Go and Netty mounted as in the script header) and trace one client in each with <code>strace -f -p</code>.</li>
<li>For each: which syscall waits, level or edge triggered, which thread does the read?</li>
<li>Load both with <code>./do-tai.sh</code> at 2,000 and then 5,000 connections; record threads, RSS, CPU and p99.</li>
<li>Add a 20 ms synchronous sleep in the handler of one of them and measure again — what happens to p99?</li>
</ol>
<p><strong>Done when:</strong> you have a small table of measured numbers for two runtimes, and one sentence each on how the loop waits and what blocks it.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['libuv', 'The C library under Node: one loop per thread, epoll/kqueue/IOCP, plus a thread pool for file and DNS work.'],
  ['selector (Java NIO)', 'The JDK’s readiness API; on Linux it is EPollSelectorImpl over epoll.'],
  ['Netty native transport', 'Netty’s own JNI binding to epoll (EpollIoHandler), bypassing the JDK selector.'],
  ['Go netpoller', 'The part of Go’s runtime that waits on epoll for parked goroutines and resumes them.'],
  ['EPOLLRDHUP', 'Event for "peer closed its writing side": learn about a closed connection without a read.'],
  ['splice(2)', 'Move data between a pipe and another fd inside the kernel; what io.Copy uses for TCP-to-TCP.'],
  ['loop thread', 'The single thread per event loop that waits in epoll; blocking it stalls all its connections.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Node, asyncio, Java NIO, Netty, Go and nginx all run the same epoll skeleton: wait → accept → ADD → read/write → DEL.</li>
<li>Most register level-triggered; Go and nginx use edge-triggered, and nginx shares listening sockets with EPOLLEXCLUSIVE.</li>
<li>Go keeps blocking-style code by parking goroutines on the netpoller; reads happen on whichever OS thread is free.</li>
<li>"Single-threaded" runtimes still have many threads; what is single is the thread that waits.</li>
<li>Under the same load, costs differ by runtime (RSS 22–166 MiB, Python’s longer tail, Go’s spinning CPU), not by I/O model.</li>
</ul>
${L('https://docs.libuv.org/en/v1.x/design.html', '📄', 'libuv design overview', 'One loop per thread, platform pollers, and the thread pool for files and DNS.', 'Open')}
${L('https://netty.io/wiki/native-transports.html', '📄', 'Netty native transports', 'Netty’s own JNI transports (epoll, kqueue) and how they differ from the JDK selector.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Cùng một epoll bên dưới</h2>
<p class="lead">Có lẽ bạn sẽ không bao giờ tự gọi <code>epoll_wait</code>. Bạn viết <code>app.get(…)</code> trong Express, <code>async def</code> trong FastAPI, một handler Netty, một <code>http.HandleFunc</code> của Go, hay một file cấu hình nginx. Bài này mổ sáu máy chủ thật bằng <code>strace</code> và hỏi: <strong>bên dưới mỗi cái có thật là đúng vòng epoll của bài 10.3 không — và mỗi runtime thêm gì lên trên, về luồng, bộ nhớ và độ trễ, dưới cùng một tải?</strong> (Bài 3.5 so event loop của Node với thread pool của Spring ở tầng ứng dụng; ở đây ta nhìn xuống một tầng.)</p>

<h3>Sáu máy chủ</h3>
<p>Máy chủ echo bằng Node, Python asyncio, Java NIO (<code>Selector</code> thuần của JDK), Netty 4.2 với transport epoll gốc, và Go; cộng nginx phục vụ HTTP. Mã nguồn ngắn — đó chính là ý nghĩa của các runtime này:</p>
${src('ch10/echo.js', 'javascript')}
${src('ch10/echo_async.py', 'python')}
${src('ch10/echo.go', 'go')}
<p>(<code>EchoNio.java</code> là vòng selector của bài 10.3 viết bằng Java; <code>EchoNetty.java</code> là hai mươi dòng khởi tạo Netty — cả hai nằm trong <code>lab/code/ch10</code>.)</p>
${run('c105-runtime', 'node --version')}
${run('c105-runtime', 'node echo.js 7301', 7)}

<h3>Một khách, dò trong từng runtime</h3>
<p>Mỗi máy chủ được "hâm nóng" bằng vài request (để JVM nạp xong các lớp), rồi <code>strace -f -p</code> theo mọi luồng của nó trong lúc một khách gửi "hi":</p>
<p><strong>Node (libuv)</strong></p>
${run('c105-runtime', 'strace -f -qq -e signal=none -e $T -p $NODE')}
<p><strong>Python asyncio</strong></p>
${run('c105-runtime', 'strace -f -qq -e signal=none -e $T -p $PY')}
<p><strong>Java NIO</strong></p>
${run('c105-runtime', 'strace -f -qq -e signal=none -e $T -p $NIO')}
<p><strong>Netty 4.2, transport epoll gốc</strong></p>
${run('c105-runtime', 'strace -f -qq -e signal=none -e $T -p $NETTY')}
<p><strong>Go</strong></p>
${run('c105-runtime', 'strace -f -qq -e signal=none -e $T -p $GO')}
<p>Lần nào cũng cùng một bộ khung: <strong>chờ trong epoll → accept → đăng ký socket mới (<code>EPOLL_CTL_ADD</code>) → chờ → read → write → read 0 → huỷ đăng ký</strong>. Khác biệt là các chi tiết mà giờ bạn đọc được: Node và Python gọi lại epoll với hạn chờ 0 sau mỗi callback (vét nốt những gì đã sẵn sàng trước khi ngủ); Python dùng <code>recvfrom</code>/<code>sendto</code> (thứ <code>socket.recv</code> biên dịch thành); Java NIO accept bằng <code>accept</code> thường rồi đặt chế độ không chặn riêng; Netty chờ trong <code>epoll_pwait2</code> với hạn chờ 1 giây (vòng của nó thức dậy để chạy các tác vụ hẹn giờ), và đăng ký <code>EPOLLRDHUP</code> để biết sớm khi bên kia đóng. Go là cái thú vị: socket được đăng ký <strong>một lần</strong> với <code>EPOLLIN|EPOLLOUT|EPOLLRDHUP|EPOLLET</code> — edge-triggered cho cả hai chiều — và <code>read</code>/<code>write</code> chạy trên <em>một luồng OS khác</em> (1052) với luồng đã chờ (1076). Goroutine của bạn gọi <code>c.Read()</code>, trông như chặn; runtime cho goroutine "đỗ" lại, chờ epoll thay nó, rồi cho nó chạy tiếp trên luồng nào đang rảnh. Đó là cách Go giữ lối viết code chặn mà vẫn tốn chi phí như event loop.</p>
<p><strong>nginx</strong> được chạy dưới strace ngay từ đầu:</p>
${run('c105-runtime', 'curl -s http://127.0.0.1:8080/hello')}
<p>Cả hai worker (1104 và 1105) đưa cùng socket nghe fd 4 vào epoll riêng của mình với <strong><code>EPOLLEXCLUSIVE</code></strong>, nên một kết nối mới chỉ đánh thức một trong hai (bài 10.3). Worker đã accept sau đó <em>gỡ ra rồi thêm lại</em> socket nghe (<code>DEL</code> rồi <code>ADD</code>) — cách nginx tự dời mình ra cuối hàng chờ để kết nối kế tiếp về worker kia. Socket của khách được đăng ký edge-triggered (<code>EPOLLET</code>). Hạn chờ trong <code>epoll_pwait</code> là bộ hẹn giờ của chính nginx: 60.000 ms khi chờ header của request (<code>client_header_timeout</code>) và 75.000 ms trên kết nối keep-alive đang rảnh (<code>keepalive_timeout</code>) — bài 10.8 nói về chúng.</p>
<table>
<tr><th>Runtime (bản trong lab)</th><th>Lời gọi chờ</th><th>Kiểu báo</th><th>Ai chờ</th><th>Code của bạn trông như</th></tr>
<tr><td>Node 22.23 / libuv 1.51</td><td>epoll_pwait</td><td>level</td><td>1 luồng vòng lặp</td><td>callback, promise</td></tr>
<tr><td>Python 3.14 asyncio</td><td>epoll_pwait (EpollSelector)</td><td>level</td><td>1 luồng vòng lặp</td><td>async / await</td></tr>
<tr><td>Java 21 NIO</td><td>epoll_pwait (EPollSelectorImpl)</td><td>level</td><td>mỗi Selector 1 luồng</td><td>vòng selector</td></tr>
<tr><td>Netty 4.2.19 gốc</td><td>epoll_pwait2 (JNI)</td><td>level</td><td>N event loop (ở đây 2)</td><td>handler</td></tr>
<tr><td>Go 1.27</td><td>epoll_pwait (netpoller)</td><td>edge</td><td>các luồng runtime</td><td>goroutine viết kiểu chặn</td></tr>
<tr><td>nginx 1.28</td><td>epoll_pwait mỗi worker</td><td>edge (+EXCLUSIVE cho socket nghe)</td><td>mỗi worker 1 luồng</td><td>file cấu hình</td></tr>
</table>

<h3>Một tiến trình "event loop" có bao nhiêu luồng?</h3>
${run('c105-runtime', 'for p in $NODE $PY $NIO $NETTY $GO', 1, { drop: /^# / })}
<p>Node "đơn luồng" có 7 luồng: luồng vòng lặp cộng các luồng phụ của V8 (worker của nền tảng cho dọn rác và biên dịch, một bộ hẹn tác vụ trễ); pool libuv của nó còn chưa khởi động (bài 10.6 cho thấy khi nào). asyncio có luồng thứ hai, <code>asyncio_0</code>: executor mặc định, khởi động vì <code>start_server</code> phân giải địa chỉ bằng <code>getaddrinfo</code> trong một luồng. JVM có 18 luồng trước khi Netty thêm hai luồng <code>multiThreadIoEventLoop</code> — G1 GC, trình biên dịch C1/C2, reference handler và nhiều nữa. Go có 5 luồng OS cho bao nhiêu goroutine cũng được. Một event loop không có nghĩa là một luồng; nó có nghĩa là <strong>mỗi vòng lặp một luồng chờ cho mọi socket</strong>.</p>
${lab('eventloop', 'offload', 'vi', 'Ở mọi runtime trên, luồng vòng lặp chỉ được chờ và phân phát. Việc nặng phải đi chỗ khác — một luồng worker, một pool, một tiến trình khác — đúng như preset này cho thấy.')}

<h3>Cùng một tải cho tất cả</h3>
<p>2.000 kết nối, mỗi kết nối gửi 64 byte mười lần mỗi giây — 20.000 tin mỗi giây trong 3 giây — đo bằng máy tạo tải <code>tai</code> của bài 10.4. <code>do-tai.sh</code> in số luồng, fd và RSS của máy chủ giữa chừng, CPU nó tiêu trong lượt đo, và độ trễ vòng:</p>
${run('c105-runtime', './do-tai.sh node 7301', 6)}
<p>Cả sáu đều chịu được tải với trung vị dưới 0,15 ms. Khác biệt nằm ở chi phí và ở phần đuôi:</p>
<ul>
<li><strong>Bộ nhớ</strong> theo runtime, không theo mô hình: Go 22 MiB, Python 37 MiB, Node 74 MiB, Java NIO 80 MiB, Netty 166 MiB (một JVM khởi đầu với heap, mã JIT và metadata của lớp; Netty thêm các bộ đệm dùng lại).</li>
<li><strong>Đuôi của Python</strong> dài nhất (p99 23 ms): một luồng thông dịch xử lý mỗi mẻ socket sẵn sàng bằng code Python, nên socket cuối của một mẻ lớn phải chờ.</li>
<li><strong>Go tốn nhiều CPU nhất</strong> (4,39 s). Hồ sơ syscall bên dưới bị <code>futex</code>, <code>nanosleep</code> và <code>sched_yield</code> chiếm phần lớn: các luồng runtime đang rảnh quay một chút để tìm việc trước khi ngủ, đổi CPU lấy độ trễ trên một máy 10 lõi (<code>GOMAXPROCS</code> giới hạn được).</li>
<li><strong><code>io.Copy</code> không phải một vòng lặp thường.</strong> Máy chủ <code>go-copy</code> có <em>ba</em> fd mỗi kết nối: khi chép TCP sang TCP, Go chọn <code>splice(2)</code> qua một ống dẫn. Không-chép (zero-copy) có lợi cho lượng dữ liệu lớn; với tin 64 byte nó tốn mỗi kết nối một ống dẫn và thêm syscall.</li>
</ul>
${run('c105-runtime', 'strace -f -qq -c -p $GOC')}
${run('c105-runtime', './tai 8080 2000 3 0')}
<p>Hai worker của nginx giữ 2.000 kết nối nằm im, mỗi worker một luồng và 13,7 MiB RSS. Các con số này là của <em>tải này</em> trên <em>máy này</em>; chúng cho thấy chi phí đến từ đâu, không phải ngôn ngữ nào "nhanh nhất".</p>

<div class="pitfall co-tieu-de">
<p><strong>Chặn luồng vòng lặp trong một runtime không chặn.</strong> Mỗi runtime trên có đúng một luồng (mỗi vòng lặp) chờ trong epoll. Một lời gọi đồng bộ trên luồng đó — <code>fs.readFileSync</code>, <code>bcrypt.hashSync</code>, <code>time.sleep</code> trong một <code>async def</code>, một lời gọi JDBC trong handler Netty — làm dừng <em>mọi</em> kết nối của vòng lặp đó, y như máy chủ chặn ở bài 10.1. Python cảnh báo bằng <code>PYTHONASYNCIODEBUG=1</code> ("Executing … took 0.2 seconds"), Netty bằng <code>BlockHound</code>, Node bằng <code>--trace-sync-io</code>. Go là ngoại lệ chứng minh quy tắc: runtime của nó dời các goroutine khác sang luồng khác.</p>
</div>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> nhóm bạn tranh cãi nên viết một dịch vụ thời gian thực mới bằng Node, Go hay Spring WebFlux (Netty). Thay vì cãi, bạn đo.</p>
<ol>
<li>Chạy hai trong các máy chủ echo trong lab (gắn Go và Netty như đầu kịch bản) và dò một khách trong mỗi cái bằng <code>strace -f -p</code>.</li>
<li>Với mỗi cái: syscall nào chờ, level hay edge triggered, luồng nào làm read?</li>
<li>Bắn tải cả hai bằng <code>./do-tai.sh</code> ở 2.000 rồi 5.000 kết nối; ghi số luồng, RSS, CPU và p99.</li>
<li>Thêm một lần ngủ đồng bộ 20 ms vào handler của một cái rồi đo lại — p99 ra sao?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một bảng nhỏ các con số đo được cho hai runtime, và mỗi runtime một câu nói vòng lặp chờ thế nào và cái gì chặn nó.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['libuv', 'Thư viện C dưới Node: mỗi luồng một vòng lặp, epoll/kqueue/IOCP, cộng một thread pool cho việc file và DNS.'],
  ['selector (Java NIO)', 'API "sẵn sàng" của JDK; trên Linux là EPollSelectorImpl chạy trên epoll.'],
  ['Netty native transport (transport gốc của Netty)', 'Ràng buộc JNI riêng của Netty tới epoll (EpollIoHandler), bỏ qua selector của JDK.'],
  ['Go netpoller', 'Phần runtime của Go chờ epoll cho các goroutine đang đỗ và cho chúng chạy tiếp.'],
  ['EPOLLRDHUP', 'Sự kiện "bên kia đã đóng chiều ghi": biết kết nối đã đóng mà không cần read.'],
  ['splice(2)', 'Chuyển dữ liệu giữa một ống dẫn và fd khác ngay trong nhân; thứ io.Copy dùng cho TCP sang TCP.'],
  ['loop thread (luồng vòng lặp)', 'Luồng duy nhất của mỗi event loop chờ trong epoll; chặn nó là treo mọi kết nối của nó.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Node, asyncio, Java NIO, Netty, Go và nginx đều chạy cùng một bộ khung epoll: chờ → accept → ADD → read/write → DEL.</li>
<li>Phần lớn đăng ký level-triggered; Go và nginx dùng edge-triggered, và nginx chia socket nghe bằng EPOLLEXCLUSIVE.</li>
<li>Go giữ lối viết code chặn bằng cách cho goroutine đỗ trên netpoller; lần read chạy trên luồng OS nào đang rảnh.</li>
<li>Runtime "đơn luồng" vẫn có nhiều luồng; cái "đơn" là luồng đứng chờ.</li>
<li>Dưới cùng một tải, chi phí khác nhau theo runtime (RSS 22–166 MiB, đuôi dài hơn của Python, CPU quay vòng của Go), không theo mô hình I/O.</li>
</ul>
${L('https://docs.libuv.org/en/v1.x/design.html', '📄', 'libuv design overview', 'Mỗi luồng một vòng lặp, bộ chờ của từng nền tảng, và thread pool cho file và DNS.', 'Mở')}
${L('https://netty.io/wiki/native-transports.html', '📄', 'Netty native transports', 'Các transport JNI riêng của Netty (epoll, kqueue) và chúng khác selector của JDK ra sao.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 10.6 — Đĩa vs mạng trong event loop ───────────────────────── */
    {
      title: '10.6 — Disk I/O in an event loop: why file reads go to a thread pool|||10.6 — I/O đĩa trong event loop: vì sao đọc file phải sang thread pool',
      slug: 'os-10-7-dia-mang',
      type: 'LESSON',
      isFreePreview: true,
      description: 'epoll từ chối file thường (EPERM) còn poll luôn báo "sẵn sàng"; trúng/trượt page cache đo trên đĩa ghìm 50 MB/s (4 KiB ngẫu nhiên 0,7 µs vs 21,8 µs; 64 MiB 0,002 s vs 1,30 s); Node đẩy việc file sang pool libuv 4 luồng (khởi động lười: 7 → 11 luồng, eventfd đánh thức vòng lặp); 16 request đọc 16 file lạnh: readFileSync chặn vòng lặp 1,26 s, readFile giữ vòng lặp rảnh nhưng dns.lookup chờ 0,94 s và fs.stat 0,48 s vì xếp hàng sau các khúc 512 KiB, UV_THREADPOOL_SIZE=64 đưa về 3 ms; io_uring của libuv bị seccomp chặn; Go đọc file giữ cả luồng OS (4 → 38 luồng).',
      content: `${G106}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.6</span>
<h2>Disk I/O in an event loop</h2>
<p class="lead">An event loop is built on one promise: the loop thread only sleeps in epoll, and epoll tells it what is ready. Network sockets keep that promise. Files do not. This lesson measures <strong>why epoll cannot wait for a disk, what Node does instead, and how a slow disk can make your <em>DNS lookups</em> — and so your outgoing API calls — slow</strong>. To see real disk effects, this lab's disk is throttled to 50 MB/s (<code>--device-read-bps</code>), like a small VPS or a network volume that has used up its burst credits; Docker Desktop's own disk sits on a fast SSD with the Mac's cache behind it.</p>

<h3>epoll refuses regular files, poll says "always ready"</h3>
${src('ch10/filepoll.c', 'c')}
${run('c106-dia', 'cat /sys/fs/cgroup/io.max', 2)}
<p><code>epoll_ctl(ADD)</code> on a regular file fails with <code>EPERM</code>, and <code>poll</code> reports it readable immediately — by definition (POSIX says regular files always poll as ready), <code>O_NONBLOCK</code> is ignored for them. Readiness is meaningless for a disk: the data is "ready" in the sense that nothing outside the machine has to send it, but reading it may still take 1 µs or 100 ms. No readiness API can keep a file read off the loop thread.</p>

<h3>1 µs or 22 µs — or 1.3 seconds: the page cache decides</h3>
${run('c106-dia', './evict /tmp/data; ./incache', 6)}
<p><code>evict</code> drops one file from the page cache (<code>posix_fadvise(DONTNEED)</code>, no privileges needed), <code>incache</code> counts how much of it is cached (<code>mincore</code>). Random 4 KiB reads: <strong>p50 21.8 µs from disk, 0.7 µs from the page cache</strong> — 31×. Sequential 64 MiB: <strong>1.30 s cold, 0.002 s warm</strong>. The same <code>read()</code> call, and the program cannot know in advance which one it will get (<a href="${OS('os-8-1-page-cache')}">lesson 8.1</a> covers the page cache, <a href="${OS('os-9-2-fsync')}">lesson 9.3</a> its write side).</p>
${lab('latency', 'default', 'en', 'Place the two reads on the ladder: a page-cache hit is a memory copy (around 1 µs), a miss is a trip to the SSD (tens of µs) — or, on a throttled or network disk, milliseconds.', { tour: 'latency-start' })}

<h3>What Node does: a thread pool</h3>
${src('ch10/threads.js', 'javascript')}
${run('c106-dia', 'node threads.js')}
${run('c106-dia', 'strace -f -qq -e trace=openat,read')}
<p>The first <code>fs.readFile</code> starts libuv's <strong>thread pool</strong>: 7 → 11 threads (4 pool threads, the default). The trace shows the division of labour: thread 944 opens the file, thread 946 reads <code>"oslab\\n"</code> — both pool threads — while the main thread 937 only reads 8 bytes from fd 16 each time. fd 16 is an <strong>eventfd</strong> registered in the loop's epoll: when a pool thread finishes a task it writes to the eventfd, epoll wakes the loop, and the loop runs your callback. Lesson 11.2 saw the same split. So the loop never blocks on the disk — but the pool can.</p>

<h3>The experiment: 16 requests read 16 cold files</h3>
${src('ch10/loop-lag.js', 'javascript')}
<p>While 16 "requests" read 16 cold 4 MiB files, the script measures the worst delay of four things every 20 ms: the event loop itself (a 10 ms timer), a TCP echo over loopback (pure network), <code>dns.lookup('localhost')</code> and <code>fs.stat('/etc/hosts')</code> (a cached file):</p>
${run('c106-dia', 'node loop-lag.js sync')}
${run('c106-dia', 'node loop-lag.js async')}
${run('c106-dia', 'UV_THREADPOOL_SIZE=64 node loop-lag.js async')}
<p><strong>readFileSync</strong> froze the loop for <strong>1,256 ms</strong>: no timer, no network, nothing ran (the other columns are small only because the probes could not even be sent while the loop was frozen). <strong>readFile</strong> kept the loop free (16 ms) and the network echo fast (3 ms) — yet <strong><code>dns.lookup</code> waited 944 ms and <code>fs.stat</code> 479 ms</strong> for work that takes microseconds. Why? Both run on the same 4-thread pool. <code>fs.readFile</code> reads in 512 KiB chunks (Node's <code>kReadFileBufferLength</code>; strace shows <code>read(…, 524288)</code>), each chunk a separate pool task, and the pool is a FIFO queue: a stat or a lookup waits behind every chunk queued before it, each one slowed by the 50 MB/s disk. With <strong><code>UV_THREADPOOL_SIZE=64</code></strong> both drop to 3 ms. The disk is not faster — all files still finish at about 1.44 s — but small tasks no longer queue behind big reads.</p>
${lab('eventloop', 'pool', 'en', 'This preset is the experiment above in slow motion: a cheap readFile waits for a free pool thread behind long pbkdf2 jobs; change UV_THREADPOOL_SIZE and watch the queue disappear.', { tour: 'eventloop-start' })}
<p>Which Node APIs use the pool? All of <code>fs</code> (except <code>fs.watch</code>), <code>dns.lookup</code> — which <code>http.get('https://api.example.com')</code> calls for every new connection to a host name — the asynchronous <code>crypto</code> functions (<code>pbkdf2</code>, <code>scrypt</code>, <code>randomBytes</code>, as measured in <a href="${OS('os-3-5-event-loop')}">lesson 3.5</a>) and asynchronous <code>zlib</code>. So an endpoint that reads many files can make <em>unrelated</em> outgoing HTTP calls slow. Fixes, in order: serve static files from nginx or a CDN; cache hot files in memory; stream large files instead of <code>readFile</code>; keep outgoing connections alive (fewer lookups) or use <code>dns.resolve*</code>, which talks to the DNS server over the network instead of using the pool; and set <code>UV_THREADPOOL_SIZE</code> (an environment variable, read once when the pool starts) to a size you have measured.</p>

<h3>What about io_uring in libuv?</h3>
${run('c106-dia', 'UV_USE_IO_URING=1 strace')}
<p>libuv has an io_uring backend, but in Docker's default profile every <code>io_uring_setup</code> returns <code>EPERM</code> and libuv silently falls back to the pool — your app never knows. Lesson 10.7 runs the same Node with io_uring allowed: in this libuv version it still reads files on the pool.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Just make the pool bigger."</strong> 64 threads fixed the queueing here because the disk was throttled by bandwidth, not by seeks. On a real spinning disk or a busy network volume, 64 parallel reads can make every read slower. A bigger pool also costs memory (each thread has a stack) and does not help CPU-bound pool work beyond the number of cores. Measure with your disk and your mix of tasks; prefer removing file reads from the request path (cache, CDN, nginx) to enlarging the pool.</p>
</div>

<h3>Other runtimes have the same problem</h3>
${src('ch10/gofile.go', 'go')}
${run('c106-dia', './evict /tmp/small*; ./gofile')}
<p>Go's netpoller only handles network fds. A goroutine reading a cold file makes a real blocking <code>read</code>, and the runtime hands that thread's work to a new OS thread so other goroutines keep running: <strong>4 threads became 38</strong> for 32 file reads. Java 21's virtual threads behave the same way: JEP 444 says file operations capture the carrier thread and the scheduler compensates by "temporarily expanding the parallelism". Python's asyncio has no asynchronous file API at all: <code>asyncio.to_thread</code> or <code>loop.run_in_executor</code> (libraries like <code>aiofiles</code> do exactly that). nginx serves static files with <code>sendfile</code> from the page cache (lesson 10.7) and can use <code>aio threads</code> for large cold files. Everywhere, <strong>disk I/O in an event-driven server means threads</strong> — unless the kernel offers a real asynchronous interface.</p>

<div class="pitfall co-tieu-de">
<p><strong><code>readFileSync</code> in a request handler.</strong> It is fine at startup (reading a config once). In a request path it blocks the loop for every user — 1,256 ms here for 64 MiB on a slow disk, and it looks harmless on a laptop where everything is in the page cache. Search your code for <code>Sync(</code> in handlers, and run with <code>node --trace-sync-io</code> to print a stack trace for every synchronous I/O after startup.</p>
</div>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> since the team added PDF export (it reads templates and fonts from disk), calls from the same Node service to the payment provider sometimes take a second longer. The payment provider says its API is fast.</p>
<ol>
<li>Run <code>loop-lag.js async</code> in a container with <code>--device-read-bps /dev/vda:50mb</code> and confirm <code>dns.lookup</code> is slow while the event loop is fine.</li>
<li>Add a probe that calls <code>http.get</code> to a host name served locally (map it in <code>/etc/hosts</code>) and measure its latency the same way.</li>
<li>Try three fixes one at a time: <code>UV_THREADPOOL_SIZE=16</code>, caching the files in memory after the first read, and an HTTP agent with <code>keepAlive: true</code>.</li>
<li>Write down which fix removed the delay and why.</li>
</ol>
<p><strong>Done when:</strong> you can show the outgoing call’s delay comes from the pool queue (not the network), and you have a measured before/after for at least two fixes.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['page cache hit / miss', 'Data already in RAM (a memory copy, ~1 µs) vs read from the device (µs to ms).'],
  ['regular-file readiness', 'Files always poll as ready and ignore O_NONBLOCK; epoll refuses them (EPERM).'],
  ['libuv thread pool', '4 threads by default, started lazily; runs fs, dns.lookup, async crypto and zlib.'],
  ['UV_THREADPOOL_SIZE', 'Environment variable read when the pool starts; sets the number of pool threads.'],
  ['dns.lookup vs dns.resolve', 'lookup = getaddrinfo on the pool (honours /etc/hosts); resolve = network DNS query, no pool.'],
  ['eventfd', 'A counter fd; pool threads write to it so epoll wakes the loop to run completed callbacks.'],
  ['posix_fadvise / mincore', 'Tell the kernel to drop a file from cache / ask how much of it is cached.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Regular files are always "ready": epoll rejects them and O_NONBLOCK does nothing, so readiness cannot help with disks.</li>
<li>Whether a read takes 1 µs or a second depends on the page cache, which the program cannot predict.</li>
<li>Node sends file work to a 4-thread pool; the loop stays free, but pool tasks queue: dns.lookup waited 944 ms behind file chunks.</li>
<li>A larger pool removes the queueing (3 ms) without making the disk faster; removing file reads from the request path is better.</li>
<li>Go, Java virtual threads and Python asyncio also use extra OS threads for files; only a real async kernel interface avoids that.</li>
</ul>
${L('https://docs.libuv.org/en/v1.x/threadpool.html', '📄', 'libuv — Thread pool work scheduling', 'Which work runs on the pool, its default size and UV_THREADPOOL_SIZE.', 'Open')}
${L('https://nodejs.org/api/dns.html', '📄', 'Node.js — dns (Implementation considerations)', 'Why dns.lookup uses the thread pool and dns.resolve does not.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.6</span>
<h2>I/O đĩa trong event loop</h2>
<p class="lead">Event loop dựng trên một lời hứa: luồng vòng lặp chỉ ngủ trong epoll, và epoll báo cho nó cái gì đã sẵn sàng. Socket mạng giữ lời hứa đó. File thì không. Bài này đo <strong>vì sao epoll không chờ được đĩa, Node làm gì thay vào đó, và vì sao một ổ đĩa chậm có thể làm <em>tra cứu DNS</em> — và kéo theo các lời gọi API ra ngoài — của bạn chậm theo</strong>. Để thấy được hiệu ứng đĩa thật, đĩa của lab này bị ghìm ở 50 MB/s (<code>--device-read-bps</code>), như một VPS nhỏ hay một ổ mạng đã tiêu hết "burst"; đĩa gốc của Docker Desktop nằm trên SSD nhanh với bộ đệm của máy Mac phía sau.</p>

<h3>epoll từ chối file thường, poll nói "luôn sẵn sàng"</h3>
${src('ch10/filepoll.c', 'c')}
${run('c106-dia', 'cat /sys/fs/cgroup/io.max', 2)}
<p><code>epoll_ctl(ADD)</code> trên một file thường thất bại với <code>EPERM</code>, còn <code>poll</code> báo đọc được ngay — theo định nghĩa (POSIX quy định file thường luôn poll ra sẵn sàng), và <code>O_NONBLOCK</code> bị bỏ qua với chúng. "Sẵn sàng" vô nghĩa với đĩa: dữ liệu "sẵn sàng" theo nghĩa không có gì bên ngoài máy phải gửi nó tới, nhưng đọc nó vẫn có thể mất 1 µs hoặc 100 ms. Không API "sẵn sàng" nào giữ được một lần đọc file ra khỏi luồng vòng lặp.</p>

<h3>1 µs hay 22 µs — hay 1,3 giây: page cache quyết định</h3>
${run('c106-dia', './evict /tmp/data; ./incache', 6)}
<p><code>evict</code> đẩy một file ra khỏi page cache (<code>posix_fadvise(DONTNEED)</code>, không cần quyền), <code>incache</code> đếm bao nhiêu phần của nó đang nằm trong cache (<code>mincore</code>). Đọc ngẫu nhiên 4 KiB: <strong>p50 21,8 µs từ đĩa, 0,7 µs từ page cache</strong> — 31 lần. Đọc tuần tự 64 MiB: <strong>1,30 s khi lạnh, 0,002 s khi nóng</strong>. Cùng một lời gọi <code>read()</code>, và chương trình không thể biết trước mình sẽ gặp trường hợp nào (<a href="${OS('os-8-1-page-cache')}">bài 8.1</a> nói về page cache, <a href="${OS('os-9-2-fsync')}">bài 9.3</a> nói phía ghi của nó).</p>
${lab('latency', 'default', 'vi', 'Đặt hai lần đọc lên thang: trúng page cache là một lần chép bộ nhớ (khoảng 1 µs), trượt là một chuyến tới SSD (vài chục µs) — hoặc, trên đĩa bị ghìm hay đĩa mạng, tính bằng mili giây.', { tour: 'latency-start' })}

<h3>Node làm gì: một thread pool</h3>
${src('ch10/threads.js', 'javascript')}
${run('c106-dia', 'node threads.js')}
${run('c106-dia', 'strace -f -qq -e trace=openat,read')}
<p>Lần <code>fs.readFile</code> đầu tiên khởi động <strong>thread pool</strong> của libuv: 7 → 11 luồng (4 luồng pool, mặc định). Dấu vết cho thấy chia việc: luồng 944 mở file, luồng 946 đọc <code>"oslab\\n"</code> — cả hai là luồng pool — còn luồng chính 937 mỗi lần chỉ đọc 8 byte từ fd 16. fd 16 là một <strong>eventfd</strong> đăng ký trong epoll của vòng lặp: khi luồng pool làm xong một việc, nó ghi vào eventfd, epoll đánh thức vòng lặp, và vòng lặp chạy callback của bạn. Bài 11.2 đã thấy đúng cách chia này. Vậy vòng lặp không bao giờ bị đĩa chặn — nhưng pool thì có.</p>

<h3>Thí nghiệm: 16 request đọc 16 file lạnh</h3>
${src('ch10/loop-lag.js', 'javascript')}
<p>Trong lúc 16 "request" đọc 16 file lạnh 4 MiB, script đo độ trễ tệ nhất của bốn thứ mỗi 20 ms: chính event loop (một bộ hẹn 10 ms), một echo TCP qua loopback (mạng thuần), <code>dns.lookup('localhost')</code> và <code>fs.stat('/etc/hosts')</code> (một file đã nằm trong cache):</p>
${run('c106-dia', 'node loop-lag.js sync')}
${run('c106-dia', 'node loop-lag.js async')}
${run('c106-dia', 'UV_THREADPOOL_SIZE=64 node loop-lag.js async')}
<p><strong>readFileSync</strong> làm đông cứng vòng lặp <strong>1.256 ms</strong>: không bộ hẹn nào, không mạng, không gì chạy được (các cột khác nhỏ chỉ vì trong lúc vòng lặp đông cứng, các phép thử còn không gửi đi được). <strong>readFile</strong> giữ vòng lặp rảnh (16 ms) và echo mạng nhanh (3 ms) — vậy mà <strong><code>dns.lookup</code> chờ 944 ms và <code>fs.stat</code> chờ 479 ms</strong> cho những việc chỉ mất vài micro giây. Vì sao? Cả hai chạy trên cùng pool 4 luồng. <code>fs.readFile</code> đọc theo khúc 512 KiB (<code>kReadFileBufferLength</code> của Node; strace cho thấy <code>read(…, 524288)</code>), mỗi khúc là một việc riêng của pool, và pool là một hàng đợi FIFO: một lần stat hay một lần tra cứu phải chờ sau mọi khúc xếp hàng trước nó, khúc nào cũng bị đĩa 50 MB/s làm chậm. Với <strong><code>UV_THREADPOOL_SIZE=64</code></strong> cả hai tụt về 3 ms. Đĩa không nhanh hơn — mọi file vẫn xong ở khoảng 1,44 s — nhưng việc nhỏ không còn phải xếp sau việc đọc lớn.</p>
${lab('eventloop', 'pool', 'vi', 'Preset này là thí nghiệm ở trên chiếu chậm: một readFile rẻ phải chờ luồng pool rảnh sau những việc pbkdf2 dài; đổi UV_THREADPOOL_SIZE và xem hàng đợi biến mất.', { tour: 'eventloop-start' })}
<p>API nào của Node dùng pool? Toàn bộ <code>fs</code> (trừ <code>fs.watch</code>), <code>dns.lookup</code> — thứ <code>http.get('https://api.example.com')</code> gọi cho mỗi kết nối mới tới một tên máy — các hàm <code>crypto</code> bất đồng bộ (<code>pbkdf2</code>, <code>scrypt</code>, <code>randomBytes</code>, như đã đo ở <a href="${OS('os-3-5-event-loop')}">bài 3.5</a>) và <code>zlib</code> bất đồng bộ. Vậy một endpoint đọc nhiều file có thể làm chậm những lời gọi HTTP ra ngoài <em>chẳng liên quan gì</em>. Cách sửa, theo thứ tự: phục vụ file tĩnh bằng nginx hoặc CDN; cache file hay dùng trong bộ nhớ; stream file lớn thay vì <code>readFile</code>; giữ kết nối ra ngoài sống lâu (ít lần tra cứu hơn) hoặc dùng <code>dns.resolve*</code>, vốn hỏi máy chủ DNS qua mạng thay vì dùng pool; và đặt <code>UV_THREADPOOL_SIZE</code> (biến môi trường, chỉ được đọc một lần khi pool khởi động) bằng một cỡ bạn đã đo.</p>

<h3>Còn io_uring trong libuv thì sao?</h3>
${run('c106-dia', 'UV_USE_IO_URING=1 strace')}
<p>libuv có một nhánh io_uring, nhưng trong hồ sơ mặc định của Docker mọi <code>io_uring_setup</code> đều trả <code>EPERM</code> và libuv lặng lẽ lùi về pool — ứng dụng của bạn không bao giờ biết. Bài 10.7 chạy cùng Node đó khi io_uring được cho phép: ở phiên bản libuv này nó vẫn đọc file trên pool.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Cứ tăng pool lên."</strong> 64 luồng sửa được hàng đợi ở đây vì đĩa bị ghìm theo băng thông, không phải theo thời gian tìm. Trên một ổ đĩa quay thật hay một ổ mạng đang bận, 64 lần đọc song song có thể làm mọi lần đọc chậm hơn. Pool lớn hơn cũng tốn bộ nhớ (mỗi luồng một stack) và không giúp việc nặng CPU trong pool vượt quá số lõi. Đo với đĩa của bạn và với tổ hợp việc của bạn; ưu tiên gỡ việc đọc file khỏi đường đi của request (cache, CDN, nginx) hơn là phình pool.</p>
</div>

<h3>Runtime khác cũng gặp đúng vấn đề này</h3>
${src('ch10/gofile.go', 'go')}
${run('c106-dia', './evict /tmp/small*; ./gofile')}
<p>Netpoller của Go chỉ lo fd mạng. Một goroutine đọc file lạnh là một lần <code>read</code> chặn thật, và runtime trao phần việc của luồng đó cho một luồng OS mới để các goroutine khác chạy tiếp: <strong>4 luồng thành 38</strong> cho 32 lần đọc file. Virtual thread của Java 21 cũng vậy: JEP 444 nói thao tác file "chiếm" luồng mang (carrier) và bộ lập lịch bù lại bằng cách "tạm thời mở rộng mức song song". asyncio của Python thì không có API file bất đồng bộ nào: dùng <code>asyncio.to_thread</code> hoặc <code>loop.run_in_executor</code> (thư viện như <code>aiofiles</code> làm đúng như thế). nginx phục vụ file tĩnh bằng <code>sendfile</code> từ page cache (bài 10.7) và có thể dùng <code>aio threads</code> cho file lớn chưa vào cache. Ở mọi nơi, <strong>I/O đĩa trong máy chủ hướng sự kiện nghĩa là luồng</strong> — trừ khi nhân có một giao diện bất đồng bộ thật.</p>

<div class="pitfall co-tieu-de">
<p><strong><code>readFileSync</code> trong một handler request.</strong> Lúc khởi động thì không sao (đọc cấu hình một lần). Trên đường đi của request nó chặn vòng lặp cho mọi người dùng — 1.256 ms ở đây cho 64 MiB trên đĩa chậm, và trông vô hại trên laptop nơi mọi thứ đã nằm trong page cache. Tìm <code>Sync(</code> trong các handler, và chạy với <code>node --trace-sync-io</code> để in stack trace cho mọi I/O đồng bộ sau lúc khởi động.</p>
</div>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> từ khi nhóm thêm tính năng xuất PDF (đọc mẫu và phông chữ từ đĩa), các lời gọi từ cùng dịch vụ Node sang nhà cung cấp thanh toán thỉnh thoảng chậm thêm một giây. Bên thanh toán nói API của họ nhanh.</p>
<ol>
<li>Chạy <code>loop-lag.js async</code> trong container có <code>--device-read-bps /dev/vda:50mb</code> và xác nhận <code>dns.lookup</code> chậm trong khi event loop vẫn ổn.</li>
<li>Thêm một phép thử gọi <code>http.get</code> tới một tên máy phục vụ cục bộ (khai trong <code>/etc/hosts</code>) và đo độ trễ của nó theo cùng cách.</li>
<li>Thử ba cách sửa, mỗi lần một cách: <code>UV_THREADPOOL_SIZE=16</code>, cache file trong bộ nhớ sau lần đọc đầu, và một HTTP agent có <code>keepAlive: true</code>.</li>
<li>Ghi lại cách nào xoá được độ trễ và vì sao.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn cho thấy được độ trễ của lời gọi ra ngoài đến từ hàng đợi của pool (không phải từ mạng), và có số đo trước/sau cho ít nhất hai cách sửa.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['page cache hit / miss (trúng / trượt page cache)', 'Dữ liệu đã nằm trong RAM (một lần chép bộ nhớ, ~1 µs) vs phải đọc từ thiết bị (µs tới ms).'],
  ['regular-file readiness ("sẵn sàng" của file thường)', 'File luôn poll ra sẵn sàng và bỏ qua O_NONBLOCK; epoll từ chối chúng (EPERM).'],
  ['libuv thread pool', 'Mặc định 4 luồng, khởi động lười; chạy fs, dns.lookup, crypto và zlib bất đồng bộ.'],
  ['UV_THREADPOOL_SIZE', 'Biến môi trường được đọc khi pool khởi động; đặt số luồng của pool.'],
  ['dns.lookup vs dns.resolve', 'lookup = getaddrinfo trên pool (tôn trọng /etc/hosts); resolve = hỏi DNS qua mạng, không dùng pool.'],
  ['eventfd', 'Một fd bộ đếm; luồng pool ghi vào nó để epoll đánh thức vòng lặp chạy các callback đã xong.'],
  ['posix_fadvise / mincore', 'Bảo nhân đẩy một file khỏi cache / hỏi bao nhiêu phần của nó đang trong cache.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>File thường luôn "sẵn sàng": epoll từ chối chúng và O_NONBLOCK vô tác dụng, nên cơ chế "sẵn sàng" không giúp được gì với đĩa.</li>
<li>Một lần đọc mất 1 µs hay một giây tuỳ page cache, thứ chương trình không đoán trước được.</li>
<li>Node đẩy việc file sang pool 4 luồng; vòng lặp rảnh, nhưng việc trong pool xếp hàng: dns.lookup chờ 944 ms sau các khúc file.</li>
<li>Pool lớn hơn xoá được hàng đợi (3 ms) mà không làm đĩa nhanh hơn; gỡ việc đọc file khỏi đường đi request thì tốt hơn.</li>
<li>Go, virtual thread của Java và asyncio của Python cũng dùng thêm luồng OS cho file; chỉ một giao diện bất đồng bộ thật của nhân mới tránh được.</li>
</ul>
${L('https://docs.libuv.org/en/v1.x/threadpool.html', '📄', 'libuv — Thread pool work scheduling', 'Việc nào chạy trên pool, cỡ mặc định và UV_THREADPOOL_SIZE.', 'Mở')}
${L('https://nodejs.org/api/dns.html', '📄', 'Node.js — dns (Implementation considerations)', 'Vì sao dns.lookup dùng thread pool còn dns.resolve thì không.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 10.7 — io_uring và sendfile ───────────────────────── */
    {
      title: '10.7 — io_uring: shared rings, blocked by Docker, measured — and sendfile|||10.7 — io_uring: vòng đệm chung, bị Docker chặn, đo thật — và sendfile',
      slug: 'os-10-4-io-uring',
      type: 'LESSON',
      isFreePreview: true,
      description: 'io_uring (Linux 5.1, 2019): hàng đợi nộp và hàng đợi kết quả nằm trong bộ nhớ chung với nhân; hồ sơ seccomp mặc định của Docker (từ 25.0) không cho io_uring_* ⇒ EPERM, và lý do (60% lỗ hổng nhân trong kCTF của Google 2022); trong container unconfined: 64 lần đọc = 1 io_uring_enter thay vì 64 pread, nhưng với dữ liệu đã trong cache pread vẫn rẻ hơn (0,60 vs 1,64 µs); SQPOLL quay vòng: 0 lời gọi nhân đổi bằng ~3 lõi bận; máy chủ echo io_uring: 0,64 lời gọi nhân mỗi tin vs 2,6 của epoll, độ trễ ngang nhau; libuv 1.51 chỉ dùng io_uring để gộp epoll_ctl; sendfile của nginx: 1 lời gọi cho 1 MiB vs 64 cặp pread/writev.',
      content: `${G107}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.7</span>
<h2>io_uring</h2>
<p class="lead">Lesson 10.2 ended with model 5: you hand the kernel a whole operation and it tells you when it is <em>done</em>. On Linux that is <strong>io_uring</strong>, added by Jens Axboe in Linux 5.1 (2019). It promises fewer system calls and real asynchronous file I/O — and it is blocked in every default Docker container. This lesson asks: <strong>how does it work, what does it really gain on this machine, what does it cost, and why do Docker and Google turn it off?</strong> Everything here runs in a throwaway container started with <code>--security-opt seccomp=unconfined</code>; never run your application that way.</p>

<h3>Two rings shared with the kernel</h3>
<p>An io_uring instance is two circular queues in memory shared between your process and the kernel (set up by <code>io_uring_setup</code> and <code>mmap</code>). You write <strong>submission queue entries</strong> (SQEs: "read 4 KiB from fd 5 at offset X into this buffer, tag 17") into the <strong>SQ</strong> ring; the kernel writes <strong>completion queue entries</strong> (CQEs: "tag 17 finished, result 4096") into the <strong>CQ</strong> ring. One <code>io_uring_enter</code> call can submit a hundred SQEs and wait for completions. With <code>IORING_SETUP_SQPOLL</code> a kernel thread watches the SQ ring itself, so submitting needs no system call at all. <code>liburing</code> wraps the details (<code>io_uring_get_sqe</code>, <code>io_uring_prep_read</code>, <code>io_uring_submit</code>, <code>io_uring_wait_cqe</code>) — you already saw it in <code>m5-uring.c</code>.</p>

<h3>Why your container says EPERM</h3>
${run('c107-uring', 'grep Seccomp: /proc/self/status', 2)}
<p>Inside this lab container seccomp is off (<code>Seccomp: 0</code>) and the kernel allows io_uring (<code>io_uring_disabled = 0</code>). Docker's default profile, read from its source repository, denies every system call not on its list with <code>errno 1</code> = <code>EPERM</code>, and <strong>no <code>io_uring_*</code> call is on the list</strong> — they were removed in November 2023 (moby PR #46762, shipped in Docker 25.0). That is the <code>EPERM</code> that <code>m5-uring</code> (lesson 10.2) and Node (lesson 10.6) got. The reason is security, not performance: operations submitted through the ring are not individual system calls, so seccomp filters cannot see them, and io_uring has had a long series of kernel vulnerabilities. Google reported in 2023 that <strong>60% of the exploits submitted to its kCTF kernel bug bounty in 2022 used io_uring</strong>, and restricted it on ChromeOS, Android and its production servers. Since Linux 6.6 a host can switch it off globally with <code>sysctl kernel.io_uring_disabled</code>. (Seccomp itself is <a href="${OS('os-11-4-seccomp')}">lesson 11.7</a>.)</p>

<h3>Fewer system calls — measured</h3>
${src('ch10/ubatch.c', 'c')}
<p>The same work four ways — 2,000 batches of 64 random 4 KiB reads from a file already in the page cache — then the number of system calls for 100 batches (6,400 reads):</p>
${run('c107-uring', 'gcc -O2 -Wall -o ubatch ubatch.c -luring')}
${run('c107-uring', 'strace -f -qq -c -o pr.txt', 4)}
<p>The syscall counts are exactly the promise: <strong>6,400 <code>pread64</code> calls vs 100 <code>io_uring_enter</code></strong> (one per batch of 64), and with SQPOLL plus spinning on the completion ring, <strong>a single call</strong> for all 6,400 reads. (Under strace, which makes every call expensive, pread became 52 µs per read and io_uring 1.3–2.9 µs.) But the time without strace tells the other half: for data already in memory, plain <code>pread</code> was the cheapest (<strong>0.60 µs</strong> per read vs 1.37–1.64 µs). A cached read is a memory copy; io_uring adds bookkeeping per operation, and here every read was handed to a kernel worker thread:</p>
${run('c107-uring', './ubatch /tmp/data sqspin 20000')}
<p>The zero-syscall mode kept <strong>three cores busy</strong>: our thread spinning on the completion ring (100%), the kernel's SQ polling thread <code>iou-sqp</code> (100%) and a kernel worker <code>iou-wrk</code> (87%) doing the actual copies — whether a buffered read can complete inline depends on the filesystem, and on this one (Docker's overlayfs) it was not. Zero system calls is not zero cost; it moves the cost to threads you do not see in your own process list.</p>
${lab('latency', 'default', 'en', 'Keep the scale in mind: a syscall round trip is ~0.2 µs here and a cached 4 KiB read ~0.6 µs. io_uring saves crossings, which matters most when each crossing is expensive or there are millions of them.')}

<h3>An echo server with no epoll and no read()</h3>
${src('ch10/echo-uring.c', 'c')}
<p>This is the completion model end to end: one <em>multishot</em> accept request keeps producing new connections; for each connection the server posts a <code>recv</code>, and when its completion arrives the data is <em>already in the buffer</em>, so it posts a <code>send</code>, and so on. Counting kernel crossings for the same 4,000 echoes (200 connections × 10 messages/s × 2 s):</p>
${run('c107-uring', './echo-uring 7400 &', 3)}
${run('c107-uring', './do-tai.sh epoll 7000 $E 2000', 4)}
<p><strong>epoll: 10,565 system calls</strong> (4,000 <code>write</code> + 4,002 <code>read</code> + 2,162 <code>epoll_pwait</code> + accept/ctl) = 2.6 per message. <strong>io_uring: 2,559 <code>io_uring_enter</code></strong> = 0.64 per message, four times fewer. Latency and CPU at 2,000 and 10,000 connections are within run-to-run noise of each other (in our repeated runs the order of the p99s changed). On loopback with 64-byte messages, a system call is cheap enough that saving three quarters of them barely shows; the gain grows when crossings are expensive (CPU-vulnerability mitigations, virtual machines) or at far higher message rates.</p>

<h3>Who uses io_uring today</h3>
${run('c107-uring', "strace -f -qq -e trace=io_uring_setup,io_uring_enter -o uv0.txt")}
${run('c107-uring', 'UV_USE_IO_URING=1 strace', 3)}
<p>Even without any option, Node's libuv 1.51 creates small rings — its ChangeLog says it "always use[s] io_uring for epoll batching", i.e. to submit many <code>epoll_ctl</code> changes in one call. With <code>UV_USE_IO_URING=1</code> the file is still opened by a pool thread (284), and the experiment of lesson 10.6 shows the same 900 ms <code>dns.lookup</code> delay: in this version, file reads stay on the thread pool. Elsewhere: PostgreSQL 18 can issue asynchronous reads with <code>io_method = io_uring</code>; Netty 4.2 ships an io_uring transport next to its epoll one; Rust has tokio-uring and glommio; databases and storage engines (ScyllaDB, TigerBeetle) use it directly. Typical web stacks still run on epoll — and in Docker they must, unless someone loosens the profile.</p>

<div class="pitfall co-tieu-de">
<p><strong>Disabling seccomp in production to "enable io_uring".</strong> <code>--security-opt seccomp=unconfined</code> removes the filter for <em>all</em> 300-odd system calls, not just io_uring — the whole point of lesson 11.7. If you truly need io_uring, write a custom profile that adds only <code>io_uring_setup</code>, <code>io_uring_enter</code> and <code>io_uring_register</code>, keep the kernel patched, and measure first: on this machine it reduced system calls by 4× but did not reduce latency.</p>
</div>

<h3>Zero-copy without io_uring: sendfile</h3>
<p>nginx serving a 1 MiB file, traced from start, with <code>sendfile on</code> and then <code>off</code>:</p>
${run('c107-uring', 'curl -s -o /dev/null', 1)}
${run('c107-uring', "sed 's/sendfile on;/sendfile off;/'", 2)}
<p>With <code>sendfile on</code>: one <code>writev</code> for the headers and <strong>one <code>sendfile</code> call that moves the whole 1,048,576 bytes from the file to the socket inside the kernel</strong> — the data never enters nginx's memory. With it off: <strong>64 calls</strong>, 32 <code>pread64</code> of 32 KiB into a buffer and 32 <code>writev</code> back out — every byte copied into user space and back. That is why nginx (or a CDN) should serve static files, not your Node or Java process. Lesson 11.4 measured <code>sendfile</code> and <code>copy_file_range</code> for files (<a href="${OS('os-11-5-chi-phi')}">lesson 11.4</a>).</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a colleague read that "io_uring makes servers 2× faster" and wants to add <code>seccomp=unconfined</code> to the team's <code>docker-compose.yml</code>.</p>
<ol>
<li>In a throwaway unconfined container, run <code>ubatch</code> in all four modes and count system calls with <code>strace -c</code>.</li>
<li>Run <code>echo-uring</code> and <code>echo-epoll</code> under the same <code>do-tai.sh</code> load twice each; note p99 and CPU.</li>
<li>Read Docker's default profile (as in the script) and list which io_uring calls you would have to allow.</li>
<li>Write a three-line reply: what io_uring gave on your measurements, what it costs, and what you recommend for the compose file.</li>
</ol>
<p><strong>Done when:</strong> your reply quotes the syscall reduction and the latency difference you measured, and recommends a custom profile (or nothing) instead of <code>unconfined</code>.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['io_uring', 'Linux’s completion-based I/O interface (5.1, 2019): submission and completion rings shared with the kernel.'],
  ['SQE / CQE', 'Submission queue entry (one requested operation) / completion queue entry (its result, matched by user_data).'],
  ['io_uring_enter', 'The system call that submits SQEs and/or waits for CQEs; one call can cover many operations.'],
  ['SQPOLL', 'A kernel thread (iou-sqp) polls the SQ ring so submission needs no system call — at the cost of a busy core.'],
  ['multishot accept', 'One request that keeps producing a completion per new connection.'],
  ['kernel.io_uring_disabled', 'Sysctl (Linux 6.6+) to disable io_uring for everyone or for unprivileged users.'],
  ['sendfile', 'Copy from a file to a socket inside the kernel, without passing through user memory.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>io_uring = shared submission/completion rings; you submit whole operations and collect their results.</li>
<li>Docker’s default seccomp profile has denied io_uring since 25.0 (EPERM), for security reasons backed by its vulnerability history.</li>
<li>It cut system calls 64× (reads) and 4× (echo server), but cached pread was still cheaper and echo latency did not improve here.</li>
<li>"Zero syscalls" with SQPOLL cost about three busy cores: the cost moves to kernel threads.</li>
<li>For static files, <code>sendfile</code> already gives zero-copy: one call for 1 MiB instead of 64.</li>
</ul>
${L('https://kernel.dk/io_uring.pdf', '📄', 'Efficient IO with io_uring (Jens Axboe)', 'The design document by io_uring’s author: rings, SQEs, CQEs, SQPOLL.', 'Open')}
${L('https://security.googleblog.com/2023/06/learnings-from-kctf-vrps-42-linux.html', '📄', 'Google Security Blog — Learnings from kCTF VRP’s 42 Linux kernel exploits', 'Why Google restricted io_uring: 60% of submitted exploits used it.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.7</span>
<h2>io_uring</h2>
<p class="lead">Bài 10.2 kết thúc với mô hình 5: bạn trao cho nhân cả một thao tác và nó báo khi đã <em>xong</em>. Trên Linux đó là <strong>io_uring</strong>, do Jens Axboe đưa vào Linux 5.1 (2019). Nó hứa ít lời gọi hệ thống hơn và I/O file bất đồng bộ thật — và nó bị chặn trong mọi container Docker mặc định. Bài này hỏi: <strong>nó hoạt động ra sao, trên máy này nó thật sự được gì, tốn gì, và vì sao Docker và Google tắt nó đi?</strong> Mọi thứ ở đây chạy trong một container vứt đi khởi động với <code>--security-opt seccomp=unconfined</code>; đừng bao giờ chạy ứng dụng của bạn như vậy.</p>

<h3>Hai vòng đệm dùng chung với nhân</h3>
<p>Một thực thể io_uring là hai hàng đợi vòng nằm trong bộ nhớ dùng chung giữa tiến trình của bạn và nhân (dựng bằng <code>io_uring_setup</code> và <code>mmap</code>). Bạn ghi các <strong>mục nộp</strong> (SQE: "đọc 4 KiB từ fd 5 ở vị trí X vào bộ đệm này, nhãn 17") vào vòng <strong>SQ</strong>; nhân ghi các <strong>mục kết quả</strong> (CQE: "nhãn 17 xong, kết quả 4096") vào vòng <strong>CQ</strong>. Một lời gọi <code>io_uring_enter</code> có thể nộp cả trăm SQE và chờ kết quả. Với <code>IORING_SETUP_SQPOLL</code>, một luồng của nhân tự canh vòng SQ, nên nộp việc không cần lời gọi hệ thống nào. <code>liburing</code> gói các chi tiết (<code>io_uring_get_sqe</code>, <code>io_uring_prep_read</code>, <code>io_uring_submit</code>, <code>io_uring_wait_cqe</code>) — bạn đã thấy nó trong <code>m5-uring.c</code>.</p>

<h3>Vì sao container của bạn nói EPERM</h3>
${run('c107-uring', 'grep Seccomp: /proc/self/status', 2)}
<p>Trong container lab này seccomp đã tắt (<code>Seccomp: 0</code>) và nhân cho phép io_uring (<code>io_uring_disabled = 0</code>). Hồ sơ mặc định của Docker, đọc từ kho mã nguồn của nó, từ chối mọi lời gọi hệ thống không có trong danh sách bằng <code>errno 1</code> = <code>EPERM</code>, và <strong>không có lời gọi <code>io_uring_*</code> nào trong danh sách</strong> — chúng bị gỡ ra tháng 11/2023 (moby PR #46762, có trong Docker 25.0). Đó chính là <code>EPERM</code> mà <code>m5-uring</code> (bài 10.2) và Node (bài 10.6) nhận. Lý do là bảo mật, không phải hiệu năng: các thao tác nộp qua vòng đệm không phải là từng lời gọi hệ thống riêng, nên bộ lọc seccomp không thấy chúng, và io_uring đã có một chuỗi dài lỗ hổng nhân. Google báo cáo năm 2023 rằng <strong>60% các bản khai thác gửi tới chương trình săn lỗi nhân kCTF của họ trong năm 2022 dùng io_uring</strong>, và đã hạn chế nó trên ChromeOS, Android và máy chủ production của họ. Từ Linux 6.6 một máy có thể tắt nó toàn cục bằng <code>sysctl kernel.io_uring_disabled</code>. (Bản thân seccomp là <a href="${OS('os-11-4-seccomp')}">bài 11.7</a>.)</p>

<h3>Ít lời gọi hệ thống hơn — đo thật</h3>
${src('ch10/ubatch.c', 'c')}
<p>Cùng một việc theo bốn cách — 2.000 mẻ, mỗi mẻ 64 lần đọc 4 KiB ngẫu nhiên từ một file đã nằm trong page cache — rồi đếm số lời gọi hệ thống cho 100 mẻ (6.400 lần đọc):</p>
${run('c107-uring', 'gcc -O2 -Wall -o ubatch ubatch.c -luring')}
${run('c107-uring', 'strace -f -qq -c -o pr.txt', 4)}
<p>Số lời gọi đúng như lời hứa: <strong>6.400 lần <code>pread64</code> so với 100 lần <code>io_uring_enter</code></strong> (mỗi mẻ 64 một lần), và với SQPOLL cộng quay vòng trên vòng kết quả, <strong>chỉ một lời gọi</strong> cho cả 6.400 lần đọc. (Dưới strace, thứ làm mọi lời gọi đắt lên, pread thành 52 µs mỗi lần đọc còn io_uring 1,3–2,9 µs.) Nhưng thời gian khi không có strace kể nửa kia: với dữ liệu đã trong bộ nhớ, <code>pread</code> thường là rẻ nhất (<strong>0,60 µs</strong> mỗi lần đọc so với 1,37–1,64 µs). Một lần đọc trúng cache là một lần chép bộ nhớ; io_uring thêm sổ sách cho mỗi thao tác, và ở đây mọi lần đọc đều được giao cho một luồng worker của nhân:</p>
${run('c107-uring', './ubatch /tmp/data sqspin 20000')}
<p>Chế độ không-lời-gọi giữ <strong>ba lõi bận</strong>: luồng của ta quay vòng trên vòng kết quả (100%), luồng canh SQ của nhân <code>iou-sqp</code> (100%) và một worker của nhân <code>iou-wrk</code> (87%) làm phần chép thật — một lần đọc có đệm có xong ngay tại chỗ được hay không tuỳ hệ thống file, và trên cái này (overlayfs của Docker) thì không. Không lời gọi hệ thống không có nghĩa là không tốn gì; chi phí chỉ dời sang những luồng bạn không thấy trong danh sách tiến trình của mình.</p>
${lab('latency', 'default', 'vi', 'Nhớ thang đo: một vòng syscall ở đây ~0,2 µs và một lần đọc 4 KiB trúng cache ~0,6 µs. io_uring tiết kiệm số lần băng qua, điều đáng giá nhất khi mỗi lần băng qua đắt hoặc có hàng triệu lần.')}

<h3>Một máy chủ echo không epoll, không read()</h3>
${src('ch10/echo-uring.c', 'c')}
<p>Đây là mô hình hoàn tất từ đầu tới cuối: một yêu cầu accept <em>multishot</em> liên tục sinh ra kết nối mới; với mỗi kết nối, máy chủ nộp một <code>recv</code>, và khi kết quả của nó tới thì dữ liệu <em>đã nằm sẵn trong bộ đệm</em>, nên nó nộp một <code>send</code>, cứ thế. Đếm số lần băng qua nhân cho cùng 4.000 lần echo (200 kết nối × 10 tin/giây × 2 giây):</p>
${run('c107-uring', './echo-uring 7400 &', 3)}
${run('c107-uring', './do-tai.sh epoll 7000 $E 2000', 4)}
<p><strong>epoll: 10.565 lời gọi hệ thống</strong> (4.000 <code>write</code> + 4.002 <code>read</code> + 2.162 <code>epoll_pwait</code> + accept/ctl) = 2,6 lời gọi mỗi tin. <strong>io_uring: 2.559 lần <code>io_uring_enter</code></strong> = 0,64 mỗi tin, ít hơn bốn lần. Độ trễ và CPU ở 2.000 và 10.000 kết nối nằm trong mức nhiễu giữa các lần chạy (trong các lần chạy lặp của chúng tôi thứ tự p99 có đổi chỗ). Trên loopback với tin 64 byte, một lời gọi hệ thống đủ rẻ để bớt ba phần tư số đó gần như không thấy; lợi ích lớn dần khi mỗi lần băng qua đắt (các bản vá lỗ hổng CPU, máy ảo) hoặc ở tốc độ tin cao hơn nhiều.</p>

<h3>Ai đang dùng io_uring</h3>
${run('c107-uring', "strace -f -qq -e trace=io_uring_setup,io_uring_enter -o uv0.txt")}
${run('c107-uring', 'UV_USE_IO_URING=1 strace', 3)}
<p>Không cần tuỳ chọn nào, libuv 1.51 của Node vẫn tạo vài vòng nhỏ — ChangeLog của nó ghi "always use io_uring for epoll batching", tức dùng để nộp nhiều thay đổi <code>epoll_ctl</code> trong một lần gọi. Với <code>UV_USE_IO_URING=1</code> file vẫn được một luồng pool (284) mở, và thí nghiệm của bài 10.6 cho thấy đúng độ trễ 900 ms của <code>dns.lookup</code>: ở phiên bản này, việc đọc file vẫn nằm trên thread pool. Ở chỗ khác: PostgreSQL 18 có thể đọc bất đồng bộ với <code>io_method = io_uring</code>; Netty 4.2 có transport io_uring bên cạnh transport epoll; Rust có tokio-uring và glommio; các CSDL và engine lưu trữ (ScyllaDB, TigerBeetle) dùng nó trực tiếp. Các stack web thông thường vẫn chạy trên epoll — và trong Docker thì bắt buộc vậy, trừ khi ai đó nới hồ sơ ra.</p>

<div class="pitfall co-tieu-de">
<p><strong>Tắt seccomp trên production để "bật io_uring".</strong> <code>--security-opt seccomp=unconfined</code> gỡ bộ lọc cho <em>cả</em> hơn 300 lời gọi hệ thống, không riêng io_uring — đúng điều bài 11.7 nói. Nếu thật sự cần io_uring, hãy viết một hồ sơ riêng chỉ thêm <code>io_uring_setup</code>, <code>io_uring_enter</code> và <code>io_uring_register</code>, giữ nhân luôn được vá, và đo trước: trên máy này nó giảm số lời gọi hệ thống 4 lần nhưng không giảm độ trễ.</p>
</div>

<h3>Không-chép mà không cần io_uring: sendfile</h3>
<p>nginx phục vụ một file 1 MiB, dò từ lúc khởi động, với <code>sendfile on</code> rồi <code>off</code>:</p>
${run('c107-uring', 'curl -s -o /dev/null', 1)}
${run('c107-uring', "sed 's/sendfile on;/sendfile off;/'", 2)}
<p>Với <code>sendfile on</code>: một <code>writev</code> cho header và <strong>một lời gọi <code>sendfile</code> chuyển trọn 1.048.576 byte từ file sang socket ngay trong nhân</strong> — dữ liệu không bao giờ đi vào bộ nhớ của nginx. Khi tắt: <strong>64 lời gọi</strong>, 32 lần <code>pread64</code> 32 KiB vào bộ đệm và 32 lần <code>writev</code> trả ra — từng byte bị chép lên không gian người dùng rồi chép ngược xuống. Đó là lý do nên để nginx (hoặc CDN) phục vụ file tĩnh, không phải tiến trình Node hay Java của bạn. <code>sendfile</code> và <code>copy_file_range</code> cho file đã được đo ở <a href="${OS('os-11-5-chi-phi')}">bài 11.4</a>.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một đồng nghiệp đọc được rằng "io_uring làm máy chủ nhanh gấp đôi" và muốn thêm <code>seccomp=unconfined</code> vào <code>docker-compose.yml</code> của nhóm.</p>
<ol>
<li>Trong một container unconfined vứt đi, chạy <code>ubatch</code> ở cả bốn chế độ và đếm lời gọi hệ thống bằng <code>strace -c</code>.</li>
<li>Chạy <code>echo-uring</code> và <code>echo-epoll</code> dưới cùng tải <code>do-tai.sh</code>, mỗi cái hai lần; ghi p99 và CPU.</li>
<li>Đọc hồ sơ mặc định của Docker (như trong kịch bản) và liệt kê những lời gọi io_uring bạn sẽ phải cho phép.</li>
<li>Viết ba dòng trả lời: io_uring đem lại gì theo số đo của bạn, tốn gì, và bạn đề xuất gì cho file compose.</li>
</ol>
<p><strong>Đạt khi:</strong> câu trả lời dẫn mức giảm lời gọi hệ thống và chênh lệch độ trễ bạn đo được, và đề xuất một hồ sơ riêng (hoặc không làm gì) thay vì <code>unconfined</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['io_uring', 'Giao diện I/O kiểu hoàn tất của Linux (5.1, 2019): vòng nộp và vòng kết quả dùng chung với nhân.'],
  ['SQE / CQE', 'Mục nộp (một thao tác được yêu cầu) / mục kết quả (kết quả của nó, khớp bằng user_data).'],
  ['io_uring_enter', 'Lời gọi hệ thống nộp SQE và/hoặc chờ CQE; một lời gọi phủ được nhiều thao tác.'],
  ['SQPOLL', 'Một luồng nhân (iou-sqp) canh vòng SQ nên nộp việc không cần lời gọi hệ thống — đổi bằng một lõi bận.'],
  ['multishot accept', 'Một yêu cầu liên tục sinh một kết quả cho mỗi kết nối mới.'],
  ['kernel.io_uring_disabled', 'Tham số nhân (Linux 6.6+) để tắt io_uring cho mọi người hoặc cho người dùng không đặc quyền.'],
  ['sendfile', 'Chép từ một file sang một socket ngay trong nhân, không đi qua bộ nhớ người dùng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>io_uring = vòng nộp/vòng kết quả dùng chung; bạn nộp trọn thao tác và thu kết quả về.</li>
<li>Hồ sơ seccomp mặc định của Docker từ chối io_uring từ bản 25.0 (EPERM), vì lý do bảo mật có lịch sử lỗ hổng làm chứng.</li>
<li>Nó giảm lời gọi hệ thống 64 lần (đọc) và 4 lần (máy chủ echo), nhưng pread trúng cache vẫn rẻ hơn và độ trễ echo không tốt lên ở đây.</li>
<li>"Không lời gọi hệ thống" với SQPOLL tốn khoảng ba lõi bận: chi phí dời sang luồng của nhân.</li>
<li>Với file tĩnh, <code>sendfile</code> đã cho không-chép sẵn: một lời gọi cho 1 MiB thay vì 64.</li>
</ul>
${L('https://kernel.dk/io_uring.pdf', '📄', 'Efficient IO with io_uring (Jens Axboe)', 'Tài liệu thiết kế của chính tác giả io_uring: vòng đệm, SQE, CQE, SQPOLL.', 'Mở')}
${L('https://security.googleblog.com/2023/06/learnings-from-kctf-vrps-42-linux.html', '📄', 'Google Security Blog — Learnings from kCTF VRP’s 42 Linux kernel exploits', 'Vì sao Google hạn chế io_uring: 60% bản khai thác được gửi tới dùng nó.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 10.8 — Backpressure, khách chậm, hạn chờ ───────────────────────── */
    {
      title: '10.8 — Backpressure, slow clients, timeouts: a checklist for thousands of requests|||10.8 — Backpressure, khách chậm, hạn chờ: checklist cho hàng nghìn yêu cầu',
      slug: 'os-10-8-backpressure',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bộ đệm socket đo thật: SO_SNDBUF mặc định 16 KiB tự lớn tới 2,6 MB, write không chặn nhận 2.625.024 byte rồi EAGAIN, đặt tay 4096 ⇒ nhân báo 8192 và tắt tự điều chỉnh; Node ghi 256 MiB cho khách đọc 1 MiB/s: mặc kệ write() ⇒ 253 MiB dồn trong tiến trình, RSS 315 MiB; tôn trọng false/drain ⇒ 0 MiB, RSS 50 MiB; slowloris 8 kết nối chặn pool 8 luồng: không hạn chờ và hạn chờ "im lặng" SO_RCVTIMEO đều thua (curl exit 28), hạn chờ TỔNG cứu được; Node 1.000 kết nối chậm vẫn trả lời 3 ms nhưng headersTimeout chỉ được kiểm mỗi 30 s; connect treo 7,2 s với tcp_syn_retries=2 (mặc định 6 ≈ 127 s), keepalive 2 giờ; checklist cho máy chủ hàng nghìn yêu cầu.',
      content: `${G108}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.8</span>
<h2>Backpressure, slow clients and timeouts</h2>
<p class="lead">An epoll loop can hold ten thousand connections. It cannot make clients read faster, and it cannot make a stuck peer answer. The last lesson of the chapter is about the two things that decide whether a server that handles thousands of requests stays alive in production: <strong>where data waits when one side is slower than the other (buffers and backpressure), and how long you are willing to wait for anyone (timeouts)</strong>. It ends with the checklist this whole chapter was building towards — the answer to "my server must handle thousands of requests at the same time".</p>

<h3>Socket buffers: how much the kernel will hold for you</h3>
<p>A server that never reads; a client that writes 64 KiB at a time, non-blocking, until the kernel says <code>EAGAIN</code>:</p>
${src('ch10/sndbuf.c', 'c')}
${run('c108-backpressure', 'cat /proc/sys/net/ipv4/tcp_wmem', 3)}
<p>The send buffer starts at the middle value of <code>tcp_wmem</code> (16 KiB) and the kernel's <strong>autotuning</strong> grows it as data queues — here to 2.6 MB. The client's non-blocking <code>write</code> accepted <strong>2,625,024 bytes</strong> before <code>EAGAIN</code>; <code>ss -m</code> shows where they are: about 2.5 MB in the client's send queue (<code>Send-Q</code>), about 110 KB in the server's receive queue (<code>Recv-Q</code>), which nobody reads. Setting <code>SO_SNDBUF</code> yourself to 4,096 gives <strong>8,192</strong> (the kernel doubles the value to leave room for its own bookkeeping, <code>man 7 socket</code>) and <strong>switches autotuning off</strong> for that socket: only 80 KB fit before <code>EAGAIN</code>. That is the bottom of backpressure: when the peer is slow, buffers fill, and then <code>write</code> says "not now".</p>

<div class="pitfall co-tieu-de">
<p><strong>Copying <code>SO_SNDBUF</code>/<code>SO_RCVBUF</code> values from a blog.</strong> Setting them disables the kernel's autotuning for that socket, which usually makes throughput worse on fast or long-distance links. Unless you have measured a problem, leave them alone and tune <code>net.ipv4.tcp_wmem</code>/<code>tcp_rmem</code> limits instead, if anything.</p>
</div>

<h3>Backpressure in your code: Node, 256 MiB, one slow client</h3>
<p>A Node server sends 256 MiB (4,096 chunks of 64 KiB) to a client that reads about 1 MiB per second, like a phone on a bad network:</p>
${src('ch10/flood.js', 'javascript')}
${run('c108-backpressure', 'node flood.js ignore', 2)}
<p><strong>Ignoring <code>write()</code>'s return value</strong>: all 4,096 chunks were "written" in the first second — into Node's own queue. 253 MiB wait inside the process (<code>writableLength</code>), RSS 315 MiB, for <em>one</em> slow client. A hundred such clients and the process is killed with exit 137. <strong>Respecting it</strong> — stop when <code>write()</code> returns <code>false</code> (the socket's <code>highWaterMark</code>, 64 KiB, is exceeded) and continue on <code>'drain'</code>: nothing piles up in Node, RSS stays at 50 MiB, and the server writes at the client's pace (about 15 chunks a second). <code>stream.pipeline()</code> and <code>.pipe()</code> do this for you; so did <code>s.pipe(s)</code> in <code>echo.js</code>, <code>await writer.drain()</code> in <code>echo_async.py</code>, and the "stop reading until the client drains" branch in <code>echo-epoll.c</code>. Backpressure is one rule applied at every layer: <strong>when the next stage is full, stop pulling from the previous one</strong>.</p>

<h3>Slow clients and the timeout that actually helps</h3>
<p>A classic thread-pool HTTP server — 8 worker threads reading request headers with blocking <code>read()</code> — and a client that opens 8 connections and sends one header line per second, never finishing (a "slowloris"; run it only against your own lab server):</p>
${src('ch10/pool-http.c', 'c')}
${run('c108-backpressure', './pool-http none', 4)}
${run('c108-backpressure', './pool-http idle', 4)}
${run('c108-backpressure', './pool-http deadline', 4)}
<p>Without a timeout, 8 slow connections hold all 8 threads and a normal request gets nothing in 4 seconds (<code>curl</code> exit 28 = timeout). With an <strong>idle timeout</strong> (<code>SO_RCVTIMEO</code> 2 s per <code>read</code>) nothing changes: the attacker sends a byte every second, so no single <code>read</code> ever waits 2 seconds. Only a <strong>total deadline</strong> for the headers — 2 seconds from accept, however the bytes trickle in — frees the threads: the normal request is served after 1.0 s and all 8 slow connections are closed. This is why servers have <em>header</em> and <em>request</em> timeouts, not just idle ones (nginx: <code>client_header_timeout</code>, the 60,000 ms you saw in lesson 10.5's trace).</p>
${lab('threadpool', 'timeout', 'en', 'What happens to a pool when requests that will time out keep occupying workers: goodput collapses. Try "drop expired requests" and a bounded queue — the deadline in pool-http deadline is the same idea.')}
<p>An event loop is not held by slow clients in the same way:</p>
${src('ch10/slow-node.js', 'javascript')}
${run('c108-backpressure', 'node slow-node.js', 4)}
${run('c108-backpressure', 'CHECK=500 node slow-node.js', 2)}
<p>With 1,000 slowloris connections open, Node answered a normal request in 3 ms — the loop only spends memory and an fd per slow connection. But look at the timeouts: <code>headersTimeout</code> was set to 2 seconds, and after 8 seconds all <strong>1,000 slow connections were still open</strong>. Node enforces <code>headersTimeout</code> and <code>requestTimeout</code> from a periodic check that runs every <code>connectionsCheckingInterval</code> — 30 seconds by default. With the interval at 500 ms, the slow connection was closed after about 3 seconds. A timeout is only as precise as the timer that enforces it; read the docs of your server for <em>how</em>, not just <em>whether</em>, it applies a limit.</p>

<h3>Timeouts you inherit from the kernel</h3>
${run('c108-backpressure', 'cat /proc/sys/net/ipv4/tcp_syn_retries', 4)}
<p><strong>Connect.</strong> To a host that never answers (the "database is down and its IP drops packets" case of <a href="${OS('os-11-2-strace-ltrace')}">lesson 11.3</a>), <code>connect()</code> waits for the kernel's SYN retries: with <code>tcp_syn_retries = 2</code> (set only for this container) that took <strong>7.2 s</strong> (1 + 2 + 4); with the Linux default of 6 it is about <strong>127 seconds</strong> (<code>man 7 tcp</code>). With an explicit 1-second connect timeout: 1.04 s. <strong>Dead peers.</strong> TCP keepalive is off unless the application enables it, and with the defaults (7,200 s idle, then 9 probes 75 s apart) a vanished peer is noticed after <strong>more than two hours</strong>. Database drivers and HTTP clients therefore set their own connect, read and idle timeouts — make sure yours are set, and shorter than your users' patience.</p>

<div class="pitfall co-tieu-de">
<p><strong>Keep-alive timeouts in the wrong order (the random 502).</strong> Node's <code>keepAliveTimeout</code> defaults to 5 s (printed above). A load balancer or nginx upstream that keeps idle connections to Node for 60 s can send a new request on a connection at the exact moment Node closes it, and the user gets a 502. Rule: <strong>the server's keep-alive timeout must be longer than the idle timeout of the proxy in front of it</strong>. Check every hop: browser → CDN → nginx → app → database.</p>
</div>

<h3>Checklist: a server that must handle thousands of requests at the same time</h3>
<table>
<tr><th>Question</th><th>What this chapter measured</th><th>What to do</th></tr>
<tr><td>Which I/O model do I run?</td><td>Node, asyncio, Netty, Go, nginx all wait on epoll (10.5)</td><td>Event loop: never block the loop thread. Thread per request: size the pool by Little’s law; use virtual threads/goroutines for long-lived connections (10.4).</td></tr>
<tr><td>Are connections cheap enough?</td><td>~3 KB kernel per idle socket (10.1) vs +16 KiB kernel stack per thread (10.4)</td><td>Long-lived, mostly idle connections (WebSocket, SSE) belong on an event loop.</td></tr>
<tr><td>Will a limit stop me first?</td><td>pids 1000 → EAGAIN at 997; 192 MiB → OOM at ~4,600; ulimit 1024 → 100% CPU spin (10.4)</td><td>Raise LimitNOFILE/ulimit -n, TasksMax/pids, memory (measure memory.current, not RSS), somaxconn/backlog (10.1).</td></tr>
<tr><td>What happens in a burst?</td><td>full accept queue → silent SYN drops, 1–3 s delays (10.1)</td><td>Accept fast; size backlog for bursts; watch nstat ListenOverflows.</td></tr>
<tr><td>Does anything block the loop or the pool?</td><td>readFileSync froze the loop 1.26 s; pool queue made dns.lookup wait 0.94 s (10.6)</td><td>No Sync calls in handlers; static files via nginx/CDN; measure event-loop lag; size UV_THREADPOOL_SIZE.</td></tr>
<tr><td>Is there backpressure everywhere?</td><td>ignoring write() kept 253 MiB in RAM for one client (10.8)</td><td>pipe/pipeline, drain(), bounded queues; reject early (429/503) instead of queueing forever.</td></tr>
<tr><td>Does every wait have a deadline?</td><td>idle timeout lost to slowloris; Node checked headersTimeout every 30 s; connect ≈ 127 s (10.8)</td><td>Connect, header, request, idle and upstream timeouts; total deadlines; keep-alive longer than the proxy’s.</td></tr>
<tr><td>Who faces slow clients?</td><td>nginx: 2,000 idle connections, 1 thread and 14 MiB per worker (10.5)</td><td>Put nginx in front: it buffers slow clients and serves static files with sendfile (10.7).</td></tr>
<tr><td>Am I measuring the right thing?</td><td>light load looked fine for both; at 10 msg/s per connection the thread server’s p99 was 24.5 ms at 5,000 and 322 ms at 10,000 (10.4)</td><td>Load-test with realistic connection counts and slow clients, watch p99, threads, fds, ListenOverflows — not just requests/s.</td></tr>
</table>
${lab('threadpool', 'healthy', 'en', 'A healthy system for comparison: arrivals below capacity, short queue, flat latency. Every row of the checklist is about staying in this picture when load, slow clients or failures push you out of it.', { tour: 'threadpool-start' })}

<h3>🧪 Practice (35 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the team's Node API sits behind nginx. Under a load test with many mobile clients it slowly grows to 1.5 GB and is restarted with exit 137; users also report occasional 502s.</p>
<ol>
<li>Run <code>flood.js ignore</code> and <code>flood.js respect</code> with <code>slow.py</code> and record RSS and <code>writableLength</code>; find in your API code any <code>res.write</code>/<code>socket.write</code> that ignores the return value.</li>
<li>Run <code>slowloris.py</code> against <code>slow-node.js</code> with the default and with a 1-second <code>connectionsCheckingInterval</code>; note when slow connections are closed.</li>
<li>Write down the keep-alive and idle timeouts of every hop (nginx <code>keepalive_timeout</code> towards the app, Node <code>keepAliveTimeout</code>, <code>headersTimeout</code>) and check the order rule.</li>
<li>Go through the checklist table and mark each row green/red for your project, with the command you used to check it.</li>
</ol>
<p><strong>Done when:</strong> you have measured before/after numbers for the backpressure fix, a corrected timeout order, and a filled-in checklist with one command or setting per row.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['backpressure', 'A slow consumer slows the producer: when the next stage is full, stop sending/reading instead of buffering forever.'],
  ['SO_SNDBUF / autotuning', 'Socket send buffer; the kernel grows it automatically unless you set it (then it is doubled and fixed).'],
  ['highWaterMark / drain', 'Node stream threshold: write() returns false above it; the drain event says you may write again.'],
  ['slowloris', 'Clients that send a request very slowly to hold server resources; defeated by total deadlines, not idle timeouts.'],
  ['idle timeout vs deadline', 'Max wait between two bytes vs max time for the whole header/request.'],
  ['tcp_syn_retries', 'How many times connect() resends SYN; default 6 ≈ 127 s before ETIMEDOUT.'],
  ['TCP keepalive', 'Probes on an idle connection to detect a dead peer; off by default, 2+ hours with default timings.'],
  ['keep-alive timeout order', 'Each server’s idle keep-alive must outlast the proxy in front of it, or requests race a closing connection (502).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Kernel buffers absorb some speed difference (2.6 MB here); after that write() says EAGAIN — the signal to stop.</li>
<li>Ignoring that signal moves the queue into your process: 253 MiB for one slow client; respecting it kept RSS flat.</li>
<li>Slow clients defeat idle timeouts; only total header/request deadlines free the workers.</li>
<li>Know how your server enforces timeouts (Node checks every 30 s) and what the kernel does by default (connect ≈ 127 s, keepalive 2 h).</li>
<li>Thousands of concurrent requests = event loop or cheap threads, raised limits, backpressure, deadlines everywhere, nginx in front, and load tests with realistic connections.</li>
</ul>
${L('https://nodejs.org/api/http.html', '📄', 'Node.js — http (server.headersTimeout, requestTimeout, keepAliveTimeout)', 'The timeout options of Node’s HTTP server and connectionsCheckingInterval.', 'Open')}
${L('https://man7.org/linux/man-pages/man7/socket.7.html', '📄', 'man 7 socket', 'SO_SNDBUF, SO_RCVBUF (doubled by the kernel), SO_RCVTIMEO, SO_KEEPALIVE.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.8</span>
<h2>Backpressure, khách chậm và hạn chờ</h2>
<p class="lead">Một vòng epoll ôm được mười nghìn kết nối. Nó không làm khách đọc nhanh hơn được, và không bắt được một bên đang kẹt phải trả lời. Bài cuối của chương nói về hai điều quyết định một máy chủ xử lý hàng nghìn yêu cầu có sống nổi trên production không: <strong>dữ liệu chờ ở đâu khi một bên chậm hơn bên kia (bộ đệm và backpressure), và bạn sẵn lòng chờ bất kỳ ai bao lâu (hạn chờ)</strong>. Bài kết bằng checklist mà cả chương đã dựng dần — câu trả lời cho "server phải xử lí hàng nghìn yêu cầu cùng lúc".</p>

<h3>Bộ đệm socket: nhân giữ hộ bạn được bao nhiêu</h3>
<p>Một máy chủ không bao giờ đọc; một khách ghi mỗi lần 64 KiB, không chặn, tới khi nhân nói <code>EAGAIN</code>:</p>
${src('ch10/sndbuf.c', 'c')}
${run('c108-backpressure', 'cat /proc/sys/net/ipv4/tcp_wmem', 3)}
<p>Bộ đệm gửi bắt đầu ở giá trị giữa của <code>tcp_wmem</code> (16 KiB) và cơ chế <strong>tự điều chỉnh</strong> (autotuning) của nhân nới nó ra khi dữ liệu dồn lại — ở đây tới 2,6 MB. Lần <code>write</code> không chặn của khách nhận <strong>2.625.024 byte</strong> rồi mới <code>EAGAIN</code>; <code>ss -m</code> cho thấy chúng nằm đâu: khoảng 2,5 MB trong hàng gửi của khách (<code>Send-Q</code>), khoảng 110 KB trong hàng nhận của máy chủ (<code>Recv-Q</code>), nơi không ai đọc. Tự đặt <code>SO_SNDBUF</code> = 4.096 thì được <strong>8.192</strong> (nhân nhân đôi giá trị để chừa chỗ cho sổ sách của chính nó, <code>man 7 socket</code>) và <strong>tắt tự điều chỉnh</strong> cho socket đó: chỉ 80 KB lọt vào trước khi <code>EAGAIN</code>. Đó là tầng đáy của backpressure: khi bên kia chậm, bộ đệm đầy, rồi <code>write</code> nói "chưa phải lúc".</p>

<div class="pitfall co-tieu-de">
<p><strong>Chép giá trị <code>SO_SNDBUF</code>/<code>SO_RCVBUF</code> từ một bài blog.</strong> Đặt chúng là tắt tự điều chỉnh của nhân cho socket đó, thường làm thông lượng tệ đi trên đường truyền nhanh hoặc xa. Trừ khi đã đo được vấn đề, hãy để yên chúng, và nếu có chỉnh thì chỉnh giới hạn <code>net.ipv4.tcp_wmem</code>/<code>tcp_rmem</code>.</p>
</div>

<h3>Backpressure trong code của bạn: Node, 256 MiB, một khách chậm</h3>
<p>Một máy chủ Node gửi 256 MiB (4.096 khúc 64 KiB) cho một khách đọc khoảng 1 MiB mỗi giây, như một điện thoại trên mạng kém:</p>
${src('ch10/flood.js', 'javascript')}
${run('c108-backpressure', 'node flood.js ignore', 2)}
<p><strong>Mặc kệ giá trị trả về của <code>write()</code></strong>: cả 4.096 khúc được "ghi" ngay trong giây đầu — vào hàng đợi của chính Node. 253 MiB nằm chờ trong tiến trình (<code>writableLength</code>), RSS 315 MiB, cho <em>một</em> khách chậm. Một trăm khách như vậy là tiến trình bị giết với exit 137. <strong>Tôn trọng nó</strong> — dừng khi <code>write()</code> trả <code>false</code> (vượt <code>highWaterMark</code> của socket, 64 KiB) và chạy tiếp ở sự kiện <code>'drain'</code>: không gì dồn lại trong Node, RSS giữ 50 MiB, và máy chủ ghi theo nhịp của khách (khoảng 15 khúc mỗi giây). <code>stream.pipeline()</code> và <code>.pipe()</code> làm việc này giùm bạn; <code>s.pipe(s)</code> trong <code>echo.js</code>, <code>await writer.drain()</code> trong <code>echo_async.py</code>, và nhánh "ngừng đọc tới khi khách nhận hết" trong <code>echo-epoll.c</code> cũng vậy. Backpressure là một quy tắc áp ở mọi tầng: <strong>khi tầng sau đầy, ngừng kéo từ tầng trước</strong>.</p>

<h3>Khách chậm và loại hạn chờ thật sự có ích</h3>
<p>Một máy chủ HTTP kiểu thread pool cổ điển — 8 luồng worker đọc header của request bằng <code>read()</code> chặn — và một khách mở 8 kết nối, mỗi giây gửi một dòng header, không bao giờ xong (một "slowloris"; chỉ chạy vào máy chủ lab của chính bạn):</p>
${src('ch10/pool-http.c', 'c')}
${run('c108-backpressure', './pool-http none', 4)}
${run('c108-backpressure', './pool-http idle', 4)}
${run('c108-backpressure', './pool-http deadline', 4)}
<p>Không có hạn chờ, 8 kết nối chậm giữ cả 8 luồng và một request bình thường không nhận được gì trong 4 giây (<code>curl</code> exit 28 = hết hạn). Với <strong>hạn chờ im lặng</strong> (<code>SO_RCVTIMEO</code> 2 s cho mỗi <code>read</code>) chẳng gì thay đổi: kẻ tấn công gửi một byte mỗi giây, nên không lần <code>read</code> nào phải chờ tới 2 giây. Chỉ có <strong>hạn chờ tổng</strong> cho phần header — 2 giây kể từ lúc accept, byte có nhỏ giọt thế nào cũng vậy — mới giải phóng được các luồng: request bình thường được phục vụ sau 1,0 s và cả 8 kết nối chậm bị đóng. Đó là lý do máy chủ có hạn chờ <em>header</em> và hạn chờ <em>request</em>, không chỉ hạn chờ im lặng (nginx: <code>client_header_timeout</code>, con số 60.000 ms bạn thấy trong dấu vết ở bài 10.5).</p>
${lab('threadpool', 'timeout', 'vi', 'Chuyện gì xảy ra với một pool khi những request rồi sẽ hết hạn cứ chiếm worker: lượng việc hữu ích sụp đổ. Thử "bỏ request quá hạn" và hàng đợi có giới hạn — hạn chờ tổng của pool-http deadline là cùng ý tưởng.')}
<p>Event loop không bị khách chậm giữ chân theo cách đó:</p>
${src('ch10/slow-node.js', 'javascript')}
${run('c108-backpressure', 'node slow-node.js', 4)}
${run('c108-backpressure', 'CHECK=500 node slow-node.js', 2)}
<p>Với 1.000 kết nối slowloris đang mở, Node trả lời một request bình thường trong 3 ms — vòng lặp chỉ tốn bộ nhớ và một fd cho mỗi kết nối chậm. Nhưng nhìn hạn chờ: <code>headersTimeout</code> đặt 2 giây, vậy mà sau 8 giây <strong>cả 1.000 kết nối chậm vẫn mở</strong>. Node áp <code>headersTimeout</code> và <code>requestTimeout</code> bằng một lần kiểm định kỳ chạy mỗi <code>connectionsCheckingInterval</code> — mặc định 30 giây. Đặt khoảng đó 500 ms thì kết nối chậm bị đóng sau khoảng 3 giây. Một hạn chờ chỉ chính xác bằng bộ hẹn giờ thực thi nó; đọc tài liệu của máy chủ để biết nó áp giới hạn <em>thế nào</em>, chứ không chỉ <em>có hay không</em>.</p>

<h3>Những hạn chờ bạn thừa hưởng từ nhân</h3>
${run('c108-backpressure', 'cat /proc/sys/net/ipv4/tcp_syn_retries', 4)}
<p><strong>Connect.</strong> Tới một máy không bao giờ trả lời (trường hợp "CSDL sập và IP của nó nuốt gói" ở <a href="${OS('os-11-2-strace-ltrace')}">bài 11.3</a>), <code>connect()</code> chờ theo số lần gửi lại SYN của nhân: với <code>tcp_syn_retries = 2</code> (chỉ đặt cho container này) mất <strong>7,2 s</strong> (1 + 2 + 4); với mặc định 6 của Linux là khoảng <strong>127 giây</strong> (<code>man 7 tcp</code>). Với hạn chờ connect 1 giây đặt tường minh: 1,04 s. <strong>Bên kia đã chết.</strong> TCP keepalive tắt trừ khi ứng dụng bật nó, và với mặc định (rảnh 7.200 s, rồi 9 lần dò cách nhau 75 s) một bên biến mất chỉ bị phát hiện sau <strong>hơn hai giờ</strong>. Vì thế driver CSDL và HTTP client tự đặt hạn chờ connect, đọc và rảnh của riêng chúng — hãy chắc chắn của bạn đã được đặt, và ngắn hơn sự kiên nhẫn của người dùng.</p>

<div class="pitfall co-tieu-de">
<p><strong>Hạn chờ keep-alive sai thứ tự (lỗi 502 ngẫu nhiên).</strong> <code>keepAliveTimeout</code> của Node mặc định 5 s (in ở trên). Một load balancer hay upstream của nginx giữ kết nối rảnh tới Node trong 60 s có thể gửi request mới trên một kết nối đúng lúc Node đóng nó, và người dùng nhận 502. Quy tắc: <strong>hạn chờ keep-alive của máy chủ phải dài hơn hạn chờ rảnh của proxy đứng trước nó</strong>. Kiểm từng chặng: trình duyệt → CDN → nginx → ứng dụng → CSDL.</p>
</div>

<h3>Checklist: máy chủ phải xử lý hàng nghìn yêu cầu cùng lúc</h3>
<table>
<tr><th>Câu hỏi</th><th>Chương này đã đo được gì</th><th>Làm gì</th></tr>
<tr><td>Mình đang chạy mô hình I/O nào?</td><td>Node, asyncio, Netty, Go, nginx đều chờ trên epoll (10.5)</td><td>Event loop: không bao giờ chặn luồng vòng lặp. Mỗi request một luồng: định cỡ pool theo định luật Little; dùng virtual thread/goroutine cho kết nối sống lâu (10.4).</td></tr>
<tr><td>Kết nối có đủ rẻ không?</td><td>~3 KB nhân mỗi socket nằm im (10.1) vs +16 KiB stack nhân mỗi luồng (10.4)</td><td>Kết nối sống lâu, phần lớn nằm im (WebSocket, SSE) nên đặt trên event loop.</td></tr>
<tr><td>Giới hạn nào sẽ chặn mình trước?</td><td>pids 1000 → EAGAIN ở 997; 192 MiB → OOM ở ~4.600; ulimit 1024 → quay 100% CPU (10.4)</td><td>Nâng LimitNOFILE/ulimit -n, TasksMax/pids, bộ nhớ (đo memory.current, không phải RSS), somaxconn/backlog (10.1).</td></tr>
<tr><td>Một đợt dồn dập thì sao?</td><td>hàng chờ accept đầy → bỏ SYN lặng lẽ, chậm 1–3 s (10.1)</td><td>Accept nhanh; backlog đủ cho đợt dồn; theo dõi nstat ListenOverflows.</td></tr>
<tr><td>Có gì chặn vòng lặp hay pool không?</td><td>readFileSync đóng băng vòng lặp 1,26 s; hàng đợi pool làm dns.lookup chờ 0,94 s (10.6)</td><td>Không gọi Sync trong handler; file tĩnh qua nginx/CDN; đo độ trễ event loop; định cỡ UV_THREADPOOL_SIZE.</td></tr>
<tr><td>Backpressure có ở mọi nơi không?</td><td>mặc kệ write() giữ 253 MiB trong RAM cho một khách (10.8)</td><td>pipe/pipeline, drain(), hàng đợi có giới hạn; từ chối sớm (429/503) thay vì xếp hàng mãi.</td></tr>
<tr><td>Mọi lần chờ đều có hạn chót chưa?</td><td>hạn chờ im lặng thua slowloris; Node kiểm headersTimeout mỗi 30 s; connect ≈ 127 s (10.8)</td><td>Hạn chờ connect, header, request, rảnh và upstream; hạn chót tổng; keep-alive dài hơn của proxy.</td></tr>
<tr><td>Ai đối mặt với khách chậm?</td><td>nginx: 2.000 kết nối nằm im, mỗi worker 1 luồng và 14 MiB (10.5)</td><td>Đặt nginx phía trước: nó đệm cho khách chậm và phục vụ file tĩnh bằng sendfile (10.7).</td></tr>
<tr><td>Mình có đang đo đúng thứ không?</td><td>tải nhẹ thì cả hai trông ổn; ở 10 tin/giây mỗi kết nối, p99 của máy chủ luồng là 24,5 ms ở 5.000 và 322 ms ở 10.000 (10.4)</td><td>Thử tải với số kết nối thật và khách chậm, theo dõi p99, số luồng, fd, ListenOverflows — không chỉ request/giây.</td></tr>
</table>
${lab('threadpool', 'healthy', 'vi', 'Một hệ khoẻ để so sánh: lượng tới dưới sức chứa, hàng đợi ngắn, độ trễ phẳng. Mỗi dòng của checklist là để ở lại trong bức tranh này khi tải, khách chậm hay sự cố đẩy bạn ra khỏi nó.', { tour: 'threadpool-start' })}

<h3>🧪 Thực hành (35 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> API Node của nhóm đứng sau nginx. Dưới một bài thử tải với nhiều khách di động, nó phình dần tới 1,5 GB rồi bị khởi động lại với exit 137; người dùng còn báo thỉnh thoảng gặp 502.</p>
<ol>
<li>Chạy <code>flood.js ignore</code> và <code>flood.js respect</code> với <code>slow.py</code>, ghi RSS và <code>writableLength</code>; tìm trong code API mọi <code>res.write</code>/<code>socket.write</code> mặc kệ giá trị trả về.</li>
<li>Chạy <code>slowloris.py</code> vào <code>slow-node.js</code> với mặc định và với <code>connectionsCheckingInterval</code> 1 giây; ghi lại lúc kết nối chậm bị đóng.</li>
<li>Ghi hạn chờ keep-alive và hạn chờ rảnh của từng chặng (<code>keepalive_timeout</code> của nginx về phía ứng dụng, <code>keepAliveTimeout</code>, <code>headersTimeout</code> của Node) và kiểm quy tắc thứ tự.</li>
<li>Đi qua bảng checklist và đánh dấu xanh/đỏ từng dòng cho dự án của bạn, kèm lệnh bạn đã dùng để kiểm.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có số đo trước/sau cho bản sửa backpressure, một thứ tự hạn chờ đã sửa đúng, và một checklist điền đủ, mỗi dòng một lệnh hoặc một thiết lập.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['backpressure (áp lực ngược)', 'Bên tiêu thụ chậm làm bên sản xuất chậm lại: khi tầng sau đầy, ngừng gửi/đọc thay vì đệm mãi.'],
  ['SO_SNDBUF / autotuning (tự điều chỉnh)', 'Bộ đệm gửi của socket; nhân tự nới nó ra trừ khi bạn đặt tay (khi đó bị nhân đôi và cố định).'],
  ['highWaterMark / drain', 'Ngưỡng của stream Node: vượt ngưỡng thì write() trả false; sự kiện drain báo được ghi tiếp.'],
  ['slowloris', 'Khách gửi request cực chậm để giữ tài nguyên máy chủ; thua hạn chờ tổng, không thua hạn chờ im lặng.'],
  ['idle timeout vs deadline (hạn chờ im lặng vs hạn chót)', 'Thời gian tối đa giữa hai byte vs thời gian tối đa cho cả header/request.'],
  ['tcp_syn_retries', 'Số lần connect() gửi lại SYN; mặc định 6 ≈ 127 s trước khi ETIMEDOUT.'],
  ['TCP keepalive', 'Gói dò trên kết nối rảnh để phát hiện bên kia đã chết; mặc định tắt, hơn 2 giờ với thông số mặc định.'],
  ['keep-alive timeout order (thứ tự hạn chờ keep-alive)', 'Hạn chờ keep-alive của mỗi máy chủ phải dài hơn của proxy đứng trước, không thì request đua với kết nối đang đóng (502).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bộ đệm của nhân hấp thụ được một phần chênh lệch tốc độ (2,6 MB ở đây); sau đó write() nói EAGAIN — tín hiệu để dừng.</li>
<li>Mặc kệ tín hiệu đó là dời hàng đợi vào tiến trình của bạn: 253 MiB cho một khách chậm; tôn trọng nó thì RSS phẳng.</li>
<li>Khách chậm đánh bại hạn chờ im lặng; chỉ hạn chót tổng cho header/request mới giải phóng được worker.</li>
<li>Biết máy chủ của bạn áp hạn chờ thế nào (Node kiểm mỗi 30 s) và nhân mặc định làm gì (connect ≈ 127 s, keepalive 2 giờ).</li>
<li>Hàng nghìn yêu cầu đồng thời = event loop hoặc luồng rẻ, giới hạn đã nâng, backpressure, hạn chót ở mọi nơi, nginx đứng trước, và thử tải với số kết nối thật.</li>
</ul>
${L('https://nodejs.org/api/http.html', '📄', 'Node.js — http (server.headersTimeout, requestTimeout, keepAliveTimeout)', 'Các tuỳ chọn hạn chờ của máy chủ HTTP Node và connectionsCheckingInterval.', 'Mở')}
${L('https://man7.org/linux/man-pages/man7/socket.7.html', '📄', 'man 7 socket', 'SO_SNDBUF, SO_RCVBUF (bị nhân nhân đôi), SO_RCVTIMEO, SO_KEEPALIVE.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 10.9 — Kiểm tra Chương 10 ───────────────────────── */
    {
      title: '10.9 — Chapter 10 check|||10.9 — Kiểm tra Chương 10',
      slug: 'os-10-9-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về các mô hình I/O: hàng chờ accept đầy, vòng quay EAGAIN, select với fd 1102, poll vs epoll ở 10.000 fd, edge-triggered bỏ sót dữ liệu, stack nhân và OOM 137, pool libuv làm dns.lookup chậm, io_uring bị seccomp chặn, backpressure trong Node, và slowloris với hạn chờ im lặng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Check</span>
<h2>Chapter 10 check: waiting for data without wasting the machine</h2>
<p class="lead">Ten situations built on the outputs of this chapter. Each one asks what a measurement means — an <code>ss</code> line, a strace count, a latency jump, an exit code — the skill you need when a server that should handle thousands of requests does not.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain the accept queue and read Recv-Q/Send-Q of a LISTEN socket.</li>
<li>I can name the five I/O models, say what the thread does while waiting in each, and recognise a busy-polling loop.</li>
<li>I can explain why epoll scales and when edge-triggered or EPOLLONESHOT is needed.</li>
<li>I can compare thread-per-connection and an event loop with numbers, and list the limits each one hits.</li>
<li>I can find what blocks an event loop or its thread pool, apply backpressure, and choose timeouts that actually fire.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Kiểm tra Chương 10: chờ dữ liệu mà không phí cả cái máy</h2>
<p class="lead">Mười tình huống dựng trên output của chương này. Mỗi câu hỏi một số đo có nghĩa là gì — một dòng <code>ss</code>, một bảng đếm strace, một cú nhảy độ trễ, một mã thoát — đúng kỹ năng bạn cần khi một máy chủ lẽ ra xử lý được hàng nghìn yêu cầu lại không làm được.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được hàng chờ accept và đọc được Recv-Q/Send-Q của socket LISTEN.</li>
<li>Tôi kể được năm mô hình I/O, nói được luồng làm gì lúc chờ ở mỗi mô hình, và nhận ra một vòng hỏi vòng bận.</li>
<li>Tôi giải thích được vì sao epoll mở rộng được và khi nào cần edge-triggered hay EPOLLONESHOT.</li>
<li>Tôi so được mỗi-kết-nối-một-luồng với event loop bằng con số, và kể được giới hạn mỗi bên sẽ đụng.</li>
<li>Tôi tìm được thứ chặn event loop hay thread pool của nó, áp được backpressure, và chọn được hạn chờ thật sự có tác dụng.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: 'During a traffic spike, <code>ss -lnt</code> on the API server shows <code>LISTEN 512 511 0.0.0.0:3000</code> and users report requests that take exactly 1 or 3 seconds longer. The health check (a TCP connect) is green. What is happening?|||Trong một đợt tăng tải, <code>ss -lnt</code> trên máy chủ API hiện <code>LISTEN 512 511 0.0.0.0:3000</code> và người dùng báo request chậm thêm đúng 1 hoặc 3 giây. Health check (một lần connect TCP) vẫn xanh. Chuyện gì đang xảy ra?',
            options: ['The kernel has run out of socket memory and is delaying every packet|||Nhân hết bộ nhớ socket và đang làm chậm mọi gói tin', 'The accept queue is full: the app is not calling accept() fast enough, new SYNs are dropped and clients retransmit after 1 s and 3 s|||Hàng chờ accept đầy: ứng dụng không gọi accept() kịp, SYN mới bị bỏ và khách gửi lại sau 1 s và 3 s', '512 clients have sent data that the application has not read yet|||512 khách đã gửi dữ liệu mà ứng dụng chưa đọc', 'Linux ignores the backlog value, so the number is meaningless|||Linux bỏ qua giá trị backlog, nên con số này vô nghĩa'],
            correctIndex: 1, points: 1,
            explanation: 'EN: For a LISTEN socket, ss shows the accept queue: Recv-Q = connections waiting for accept(), Send-Q = the backlog. 512 = backlog + 1 is a full queue, exactly like backlog 4 → 5 in lesson 10.1. The kernel then drops SYNs silently and clients retry after 1 s, 3 s, 7 s; nstat would show ListenOverflows growing. Answer C is the meaning of Recv-Q for an ESTABLISHED socket, not a listening one. The TCP health check stays green because the handshake does not need the application.|||VI: Với socket LISTEN, ss hiện hàng chờ accept: Recv-Q = số kết nối chờ accept(), Send-Q = backlog. 512 = backlog + 1 là hàng đã đầy, y như backlog 4 → 5 ở bài 10.1. Khi đó nhân bỏ SYN lặng lẽ và khách thử lại sau 1 s, 3 s, 7 s; nstat sẽ cho thấy ListenOverflows tăng. Đáp án C là nghĩa của Recv-Q với socket ESTABLISHED, không phải socket nghe. Health check TCP vẫn xanh vì bắt tay không cần tới ứng dụng.' },
          { question: 'A message consumer uses 100% of one core at night when no messages arrive. <code>strace -c -p PID</code> for one second shows about 4.8 million <code>read</code> calls, almost all in the errors column. Which I/O model is it using, and what is the fix?|||Một consumer nhận tin ăn 100% một lõi vào ban đêm khi không có tin nào tới. <code>strace -c -p PID</code> trong một giây cho thấy khoảng 4,8 triệu lời gọi <code>read</code>, gần như tất cả nằm ở cột errors. Nó đang dùng mô hình I/O nào, và sửa thế nào?',
            options: ['Blocking I/O; switch the socket to O_NONBLOCK|||I/O chặn; chuyển socket sang O_NONBLOCK', 'Asynchronous I/O; the kernel is retrying the read for it|||I/O bất đồng bộ; nhân đang thử đọc lại giùm nó', 'Signal-driven I/O; too many SIGIO signals arrive|||I/O theo tín hiệu; quá nhiều SIGIO đang tới', 'Non-blocking I/O used alone (busy polling on EAGAIN); wait for readiness with poll/epoll (or block) before reading|||I/O không chặn dùng một mình (hỏi vòng bận trên EAGAIN); chờ sẵn sàng bằng poll/epoll (hoặc chặn) trước khi đọc'],
            correctIndex: 3, points: 1,
            explanation: 'EN: This is m2-nonblock from lesson 10.2: 4.87 million EAGAIN reads and about one second of CPU per second, state R. Non-blocking mode is only half of an event loop; the other half is sleeping in poll/epoll until the fd is ready (m3-poll: 2 calls, ~0 CPU). Answer A is backwards: switching to O_NONBLOCK is what created the busy loop.|||VI: Đây chính là m2-nonblock ở bài 10.2: 4,87 triệu lần read trả EAGAIN và khoảng một giây CPU mỗi giây, trạng thái R. Chế độ không chặn chỉ là một nửa của event loop; nửa kia là ngủ trong poll/epoll tới khi fd sẵn sàng (m3-poll: 2 lời gọi, ~0 CPU). Đáp án A ngược: chuyển sang O_NONBLOCK chính là thứ tạo ra vòng quay bận.' },
          { question: 'A legacy library waits with <code>select()</code>. In a process that already has about 1,100 open connections it dies with <code>*** bit out of range 0 - FD_SETSIZE on fd_set ***: terminated</code> and exit code 134. <code>ulimit -n</code> is 1048576. Why?|||Một thư viện cũ chờ bằng <code>select()</code>. Trong một tiến trình đã có khoảng 1.100 kết nối mở, nó chết với <code>*** bit out of range 0 - FD_SETSIZE on fd_set ***: terminated</code> và mã thoát 134. <code>ulimit -n</code> là 1048576. Vì sao?',
            options: ['fd_set is a fixed 1024-bit array indexed by fd number; FD_SET on an fd ≥ 1024 writes past it, and glibc’s fortify check aborts the process (SIGABRT = 134)|||fd_set là mảng cố định 1024 bit đánh số theo số fd; FD_SET với fd ≥ 1024 ghi ra ngoài mảng, và phép kiểm fortify của glibc giết tiến trình (SIGABRT = 134)', 'select() allows at most 1,024 calls per second|||select() chỉ cho tối đa 1.024 lần gọi mỗi giây', 'The process reached its open-file limit (EMFILE)|||Tiến trình đã chạm giới hạn số file mở (EMFILE)', 'select() does not support sockets, only pipes and terminals|||select() không hỗ trợ socket, chỉ ống dẫn và terminal'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Lesson 10.3 reproduced it exactly: FD_SETSIZE = 1024, sizeof(fd_set) = 128 bytes, FD_SET(1102) → abort, exit 134. The limit is on the fd NUMBER, not on how many fds you watch, so raising ulimit cannot help — and with the limit at 1,048,576, EMFILE (answer C) is impossible here and would be an error code, not an abort. Fix: replace select with poll or epoll.|||VI: Bài 10.3 tái hiện y hệt: FD_SETSIZE = 1024, sizeof(fd_set) = 128 byte, FD_SET(1102) → abort, exit 134. Giới hạn nằm ở SỐ HIỆU fd, không phải số fd được theo dõi, nên nâng ulimit không giúp gì — và với giới hạn 1.048.576 thì EMFILE (đáp án C) không thể xảy ra ở đây, và nếu có thì là một mã lỗi chứ không phải abort. Sửa: thay select bằng poll hoặc epoll.' },
          { question: 'In <code>pollbench</code>, one wake-up costs 64 µs with poll and 0.72 µs with epoll at 1,000 fds, and 676 µs vs 0.72 µs at 10,000 fds. What explains it?|||Trong <code>pollbench</code>, một lần thức tốn 64 µs với poll và 0,72 µs với epoll ở 1.000 fd, còn ở 10.000 fd là 676 µs so với 0,72 µs. Điều gì giải thích được?',
            options: ['epoll uses several kernel threads to check the fds in parallel|||epoll dùng nhiều luồng nhân để kiểm các fd song song', 'epoll skips error checking on idle descriptors|||epoll bỏ qua kiểm lỗi trên các descriptor nằm im', 'poll copies and scans all N entries on every call; epoll keeps the interest list in the kernel and returns only what callbacks put on the ready list|||poll chép và duyệt cả N phần tử mỗi lần gọi; epoll giữ danh sách quan tâm trong nhân và chỉ trả về những gì callback đặt lên danh sách sẵn sàng', 'poll runs in user space while epoll runs in the kernel|||poll chạy ở không gian người dùng còn epoll chạy trong nhân'],
            correctIndex: 2, points: 1,
            explanation: 'EN: poll is O(N) per call: copy the array in, register on every wait queue, check every fd, copy back, then the program scans N results. epoll registers each fd once (epoll_ctl) and its cost per wait depends on the number of READY fds, so it stays flat. You can even see the interest list as tfd lines in /proc/PID/fdinfo. Both are system calls, so answer D is wrong.|||VI: poll là O(N) mỗi lần gọi: chép mảng vào, đăng ký vào mọi hàng chờ, kiểm từng fd, chép ra, rồi chương trình duyệt N kết quả. epoll đăng ký mỗi fd một lần (epoll_ctl) và chi phí mỗi lần chờ phụ thuộc số fd SẴN SÀNG, nên đứng yên. Bạn còn thấy được danh sách quan tâm thành các dòng tfd trong /proc/PID/fdinfo. Cả hai đều là lời gọi hệ thống, nên đáp án D sai.' },
          { question: 'A server registers sockets with <code>EPOLLIN | EPOLLET</code> and reads at most 4 bytes per event. A client sends 10 bytes in one write and then waits for an answer. What happens?|||Một máy chủ đăng ký socket với <code>EPOLLIN | EPOLLET</code> và mỗi sự kiện đọc tối đa 4 byte. Một khách gửi 10 byte trong một lần write rồi chờ trả lời. Chuyện gì xảy ra?',
            options: ['Three wake-ups (4 + 4 + 2) and the whole message is read|||Ba lần thức (4 + 4 + 2) và đọc được cả tin', 'One wake-up; the other 6 bytes stay in the socket and epoll_wait does not report it again until new data arrives — the connection hangs; ET handlers must read until EAGAIN|||Một lần thức; 6 byte còn lại nằm trong socket và epoll_wait không báo lại cho tới khi có dữ liệu mới — kết nối treo; handler ET phải đọc tới EAGAIN', 'epoll_wait returns -1 EAGAIN|||epoll_wait trả -1 EAGAIN', 'The kernel discards the 6 unread bytes|||Nhân vứt 6 byte chưa đọc'],
            correctIndex: 1, points: 1,
            explanation: 'EN: trigger.c measured it: [et] wake-up 1: read 4 bytes, then "timeout after 500 ms, 6 bytes still unread"; [et-drain] reads 10 bytes then EAGAIN. Answer A is what LEVEL-triggered does. Nothing is discarded: the data waits in the receive buffer, but edge-triggered only reports transitions.|||VI: trigger.c đã đo: [et] lần thức 1: đọc 4 byte, rồi "timeout after 500 ms, 6 bytes still unread"; [et-drain] đọc 10 byte rồi EAGAIN. Đáp án A là hành vi của LEVEL-triggered. Không gì bị vứt: dữ liệu nằm chờ trong bộ đệm nhận, nhưng edge-triggered chỉ báo khi có chuyển trạng thái.' },
          { question: 'A thread-per-connection server shows RSS 122 MiB with 10,000 connections on a big machine. In a container with <code>--memory 192m</code> it is killed (exit 137, <code>oom_kill 1</code>) at about 4,600 connections. Why, if RSS was far below 192 MiB?|||Một máy chủ mỗi-kết-nối-một-luồng hiện RSS 122 MiB với 10.000 kết nối trên máy lớn. Trong container <code>--memory 192m</code> nó bị giết (exit 137, <code>oom_kill 1</code>) ở khoảng 4.600 kết nối. Vì sao, khi RSS còn xa mới tới 192 MiB?',
            options: ['Each thread also has a kernel stack (16 KiB here, +156 MiB at 10,000 threads) that the memory cgroup charges but RSS does not show|||Mỗi luồng còn có một stack nhân (16 KiB ở đây, +156 MiB ở 10.000 luồng) mà cgroup bộ nhớ tính nhưng RSS không hiện', 'ps measures RSS wrongly inside containers|||ps đo RSS sai bên trong container', 'The send and receive buffers of the idle connections filled memory|||Bộ đệm gửi và nhận của các kết nối nằm im làm đầy bộ nhớ', 'The epoll instance grew with the number of connections|||Thực thể epoll phình theo số kết nối'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Lesson 10.4 measured KernelStack +156 MiB for 10,000 threads; together with ~12 KiB of user stack per thread and task structs, 4,600 threads exceed 192 MiB. Answer C is the tempting one, but lesson 10.1 showed TCP mem did not move for idle connections — empty buffers cost nothing. The thread server does not even use epoll (D); the epoll server held 10,000 connections in the same 192 MiB.|||VI: Bài 10.4 đo KernelStack +156 MiB cho 10.000 luồng; cộng ~12 KiB stack người dùng mỗi luồng và task struct, 4.600 luồng vượt 192 MiB. Đáp án C hấp dẫn, nhưng bài 10.1 cho thấy TCP mem không nhúc nhích với kết nối nằm im — bộ đệm rỗng không tốn gì. Máy chủ luồng còn không dùng epoll (D); máy chủ epoll giữ 10.000 kết nối trong cùng 192 MiB.' },
          { question: 'A Node API: event-loop lag stays under 20 ms, but while an export endpoint reads many files from a slow disk, outgoing HTTPS calls to a partner API become about a second slower. The partner says its API is fast. Most likely cause?|||Một API Node: độ trễ event loop luôn dưới 20 ms, nhưng trong lúc một endpoint xuất file đọc nhiều file từ đĩa chậm, các lời gọi HTTPS ra API đối tác chậm thêm khoảng một giây. Đối tác nói API của họ nhanh. Nguyên nhân khả dĩ nhất?',
            options: ['The partner’s DNS server is slow|||Máy chủ DNS của đối tác chậm', 'The event loop is blocked by readFileSync|||Event loop bị readFileSync chặn', 'Nagle’s algorithm delays the small TLS records|||Thuật toán Nagle làm chậm các bản ghi TLS nhỏ', 'dns.lookup for each new connection runs on the same 4-thread libuv pool as fs.readFile, and queues behind the 512 KiB file chunks|||dns.lookup cho mỗi kết nối mới chạy trên cùng pool libuv 4 luồng với fs.readFile, và xếp hàng sau các khúc file 512 KiB'],
            correctIndex: 3, points: 1,
            explanation: 'EN: loop-lag.js measured exactly this: async readFile kept the loop at 16 ms, but dns.lookup waited 944 ms and fs.stat 479 ms; UV_THREADPOOL_SIZE=64 brought both to 3 ms. Answer B would show a large event-loop lag (readFileSync froze it 1,256 ms). Fixes: serve/cache the files, keep-alive agents (fewer lookups), dns.resolve, a measured pool size.|||VI: loop-lag.js đã đo đúng chuyện này: readFile bất đồng bộ giữ vòng lặp ở 16 ms, nhưng dns.lookup chờ 944 ms và fs.stat 479 ms; UV_THREADPOOL_SIZE=64 đưa cả hai về 3 ms. Đáp án B sẽ làm độ trễ event loop lớn (readFileSync làm nó đông cứng 1.256 ms). Cách sửa: phục vụ/cache file, agent keep-alive (ít lần tra cứu), dns.resolve, cỡ pool đã đo.' },
          { question: 'Your C service built with liburing works on your laptop but in <code>docker run</code> it logs <code>io_uring_queue_init: Operation not permitted</code>. The host kernel is 7.0 and <code>kernel.io_uring_disabled = 0</code>. Why, and what should you do?|||Dịch vụ C dùng liburing của bạn chạy trên laptop, nhưng trong <code>docker run</code> nó ghi <code>io_uring_queue_init: Operation not permitted</code>. Nhân máy chủ là 7.0 và <code>kernel.io_uring_disabled = 0</code>. Vì sao, và nên làm gì?',
            options: ['The kernel is too old for io_uring; upgrade it|||Nhân quá cũ cho io_uring; nâng cấp nhân', 'io_uring needs root; run the container with --privileged|||io_uring cần root; chạy container với --privileged', 'Docker’s default seccomp profile (since 25.0) does not allow io_uring_* and returns EPERM; fall back to epoll, or if really needed use a custom profile that adds only the io_uring calls — never seccomp=unconfined|||Hồ sơ seccomp mặc định của Docker (từ 25.0) không cho io_uring_* và trả EPERM; lùi về epoll, hoặc nếu thật cần thì dùng hồ sơ riêng chỉ thêm các lời gọi io_uring — không bao giờ seccomp=unconfined', 'liburing has a bug with the arm64 architecture|||liburing có lỗi với kiến trúc arm64'],
            correctIndex: 2, points: 1,
            explanation: 'EN: Lesson 10.7 read moby’s default.json: default action ERRNO 1 (EPERM) and no io_uring syscall in the allow list (removed by PR #46762, Docker 25.0), for security reasons — 60% of Google’s kCTF kernel exploits in 2022 used io_uring. The same binary ran in a seccomp=unconfined throwaway container, so A and D are wrong; --privileged (B) would work but removes far more protection than needed.|||VI: Bài 10.7 đọc default.json của moby: hành động mặc định ERRNO 1 (EPERM) và không có syscall io_uring nào trong danh sách cho phép (gỡ bởi PR #46762, Docker 25.0), vì lý do bảo mật — 60% bản khai thác nhân kCTF của Google năm 2022 dùng io_uring. Cùng tệp nhị phân chạy được trong container vứt đi seccomp=unconfined, nên A và D sai; --privileged (B) chạy được nhưng gỡ bỏ nhiều lớp bảo vệ hơn hẳn mức cần.' },
          { question: 'A Node server sends 256 MiB to one client that reads 1 MiB/s. Version 1 ignores <code>write()</code>’s return value: after one second <code>writableLength</code> is 253 MiB and RSS 315 MiB. Version 2 stops when <code>write()</code> returns false and resumes on <code>drain</code>: RSS 50 MiB. Where were the 253 MiB in version 1?|||Một máy chủ Node gửi 256 MiB cho một khách đọc 1 MiB/s. Bản 1 mặc kệ giá trị trả về của <code>write()</code>: sau một giây <code>writableLength</code> là 253 MiB và RSS 315 MiB. Bản 2 dừng khi <code>write()</code> trả false và chạy tiếp ở <code>drain</code>: RSS 50 MiB. 253 MiB ở bản 1 nằm đâu?',
            options: ['In Node’s own write queue inside the process: the kernel socket buffer was full, so without backpressure the data piled up in user memory|||Trong hàng đợi ghi của chính Node bên trong tiến trình: bộ đệm socket của nhân đã đầy, nên không có backpressure thì dữ liệu dồn đống trong bộ nhớ người dùng', 'In the kernel send buffer, which autotuning grew to 256 MiB|||Trong bộ đệm gửi của nhân, được tự điều chỉnh nới tới 256 MiB', 'In a V8 memory leak unrelated to the socket|||Trong một chỗ rò bộ nhớ của V8 chẳng liên quan tới socket', 'In extra threads Node created for the slow client|||Trong các luồng phụ Node tạo cho khách chậm'],
            correctIndex: 0, points: 1,
            explanation: 'EN: The kernel holds only a few MB per socket — sndbuf.c measured 2.6 MB before EAGAIN, and tcp_wmem caps autotuning at 4 MiB — so B is impossible. Everything beyond that waits in the writable stream’s buffer (writableLength). Respecting false/drain (or using pipe/pipeline) moves the waiting back to the producer.|||VI: Nhân chỉ giữ vài MB mỗi socket — sndbuf.c đo được 2,6 MB trước khi EAGAIN, và tcp_wmem chặn trần tự điều chỉnh ở 4 MiB — nên B không thể xảy ra. Mọi thứ vượt mức đó nằm chờ trong bộ đệm của writable stream (writableLength). Tôn trọng false/drain (hoặc dùng pipe/pipeline) đẩy việc chờ ngược về bên sản xuất.' },
          { question: 'A thread-pool server (8 workers) sets <code>SO_RCVTIMEO</code> = 2 s on every socket. A slow client opens 8 connections and sends one header line per second, never finishing. Normal requests still time out. Why, and what fixes it?|||Một máy chủ thread pool (8 worker) đặt <code>SO_RCVTIMEO</code> = 2 s trên mọi socket. Một khách chậm mở 8 kết nối, mỗi giây gửi một dòng header, không bao giờ xong. Request bình thường vẫn hết hạn. Vì sao, và cái gì sửa được?',
            options: ['SO_RCVTIMEO has no effect on blocking sockets|||SO_RCVTIMEO không có tác dụng với socket chặn', 'It is an idle timeout per read: a byte every second resets it, so it never fires; a total deadline for the headers (or an event loop/nginx in front) frees the workers|||Đó là hạn chờ im lặng cho từng lần read: mỗi giây một byte là đặt lại nó, nên nó không bao giờ nổ; một hạn chót tổng cho header (hoặc event loop/nginx đứng trước) mới giải phóng worker', 'The slow client uses UDP, which ignores timeouts|||Khách chậm dùng UDP, thứ bỏ qua mọi hạn chờ', 'The pool simply needs 16 threads instead of 8|||Pool chỉ cần 16 luồng thay vì 8'],
            correctIndex: 1, points: 1,
            explanation: 'EN: pool-http measured all three: none and idle both left the normal request with HTTP 000 after 4 s (curl exit 28); deadline served it after 1.0 s and closed all 8 slow connections. More threads (D) only raises the number of slow connections an attacker needs. That is why servers have header/request timeouts — and why you should know how they are enforced (Node checks them every connectionsCheckingInterval, 30 s by default).|||VI: pool-http đã đo cả ba: none và idle đều để request bình thường nhận HTTP 000 sau 4 s (curl exit 28); deadline phục vụ nó sau 1,0 s và đóng cả 8 kết nối chậm. Thêm luồng (D) chỉ tăng số kết nối chậm kẻ tấn công cần mở. Đó là lý do máy chủ có hạn chờ header/request — và vì sao bạn nên biết chúng được thực thi thế nào (Node kiểm chúng mỗi connectionsCheckingInterval, mặc định 30 s).' },
        ],
      },
    },
  ],
};
