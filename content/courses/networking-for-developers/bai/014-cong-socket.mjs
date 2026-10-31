/**
 * Chương 1 · 1.5 — Cổng và socket: một máy phục vụ nhiều ứng dụng thế nào (slug khung netdev-1-4-cong-socket).
 * Output thật: lab/out/c14-web, c14-client, c14-bind-api, c14-bind-client (.out.txt).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-01-5.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };

export default {
  title: '1.5 — Ports and sockets: how one server serves many apps and many clients|||1.5 — Cổng và socket: một máy phục vụ nhiều ứng dụng và nhiều khách thế nào',
  slug: 'netdev-1-4-cong-socket',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cổng chọn chương trình; cổng tạm của máy khách; socket được đặt tên bằng 5 giá trị; đọc ss -tlnp/-tanp; một socket nghe và nhiều kết nối cùng cổng 80; 127.0.0.1 khác 0.0.0.0; EADDRINUSE; docker -p; socket nằm ở đâu trong máy.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Ports and sockets: how one server serves many apps and many clients</h2>
<p class="lead">One VPS runs nginx, a Node API, PostgreSQL and SSH at the same time, and nginx alone may hold thousands of conversations — yet every byte reaches the right program and the right conversation. This lesson shows how, with real <code>ss</code> output, and explains the bug every student meets at least once: "the API works on my laptop, and refuses everyone else."</p>

<h3>A port picks the program</h3>
<p>The IP address gets a packet to the right <em>machine</em>; the <strong>port</strong> — a 16-bit number (0–65535) in the TCP or UDP header — gets it to the right <em>program</em> on that machine. You saw it in the bytes in lesson 1.3: <code>00 50</code> = port 80.</p>
<ul>
<li><strong>0–1023, well-known ports</strong> — 22 SSH, 53 DNS, 80 HTTP, 443 HTTPS. On a normal Linux host only root may bind them.</li>
<li><strong>1024–49151, registered ports</strong> — 3000 (Node dev servers), 5432 (PostgreSQL), 6379 (Redis), 8080.</li>
<li><strong>Ephemeral ports</strong> — the temporary source port the kernel gives a client for each connection. On Linux:</li>
</ul>
${run('c14-client', 'sysctl', 1)}
<p>That is 60999 − 32768 + 1 = 28 232 possible source ports per destination. Every <code>curl</code> you ran so far had one of them — the "port …" numbers above 32768 in earlier outputs.</p>

<h3>A socket is named by five values</h3>
<p>A <strong>socket</strong> is the kernel object a program uses to send and receive over the network. A connected TCP socket is identified by five values: <strong>protocol, local IP, local port, remote IP, remote port</strong>. Two kinds matter:</p>
<ul>
<li>A <strong>listening socket</strong> — created by <code>listen()</code> (what <code>app.listen(3000)</code> does underneath). It never carries data; it waits for new connections. Its remote side is a wildcard <code>*:*</code>.</li>
<li>A <strong>connected socket</strong> — created by <code>accept()</code> on the server for each new client, or by <code>connect()</code> on the client. It carries exactly one conversation; all five values are known.</li>
</ul>

<h3>Reading ss: who listens, who is connected</h3>
<p><code>ss</code> lists sockets. <code>-t</code> TCP, <code>-l</code> listening only, <code>-n</code> numbers instead of names, <code>-p</code> the owning process. On the web server:</p>
${run('c14-web', 'ss -tlnp', 1)}
<p>nginx listens on <code>0.0.0.0:80</code> — port 80 on every address of the machine. For a listening socket, <code>Send-Q</code> is the <strong>backlog</strong>: how many finished handshakes may queue up waiting for nginx to <code>accept()</code> them (511 here). The second line, <code>127.0.0.11</code>, is Docker's built-in DNS server that resolves container names — reading <code>ss</code> always tells you something about a machine.</p>
<p>Now we let <code>client</code> open two idle connections and <code>client2</code> one, and look again, this time at all states (<code>-a</code>):</p>
${run('c14-web', "ss -tanp", 2)}
<p>One listening socket and three established ones — <strong>all with local port 80</strong>. They differ only by the remote side: two from 10.10.1.10 with different ephemeral ports, one from 10.10.1.11. That is the whole trick: the kernel keeps conversations apart by the full set of addresses and ports, not by the port alone.</p>

<h3>How the kernel picks the socket for an incoming segment</h3>
<ol>
<li>Look for a <strong>connected</strong> socket whose four values (local IP:port, remote IP:port) match exactly. Found ⇒ the data goes into that socket's receive buffer.</li>
<li>No match and the segment is a <strong>SYN</strong> (a new connection) ⇒ the <strong>listening</strong> socket for that port takes it, the kernel completes the handshake and queues the new connection for <code>accept()</code>.</li>
<li>No match and nobody listens on that port ⇒ the kernel replies with <strong>RST</strong> (reset) ⇒ the client reports <em>connection refused</em>.</li>
</ol>
${net('socket', 'demux', 'en', 'Three clients, one port 80: watch each arriving segment matched to its socket, and a SYN become a new connection.', { tour: 'socket-demux' })}

<h3>The client side: a new port for every connection</h3>
${run('c14-client', 'ss -tanp', 1)}
<p>The same connections seen from the client: the remote port is 80 and the local port is ephemeral. Next to the two live connections (owned by the <code>sleep</code> processes holding them open) are many in <code>TIME-WAIT</code> — connections already closed that the kernel keeps remembering for 60 seconds, so that late packets of an old conversation cannot be confused with a new one (Chapter 4). Now three requests in a row:</p>
${run('c14-client', 'for i in 1 2 3', 1)}
<p>Look at <code>seenFrom</code>: the API saw a different source port each time. nginx opened a brand-new connection to the API for every request and closed it afterwards — no keep-alive between nginx and the API. Each of those costs a handshake and leaves a TIME-WAIT behind. Chapter 10 turns on upstream keep-alive and measures the difference.</p>

<h3>127.0.0.1 vs 0.0.0.0: who is allowed to connect?</h3>
<p>The address you pass to <code>listen()</code> decides which network cards accept connections. We start two tiny Node servers on the API machine — one bound to <code>127.0.0.1:4000</code>, one to <code>0.0.0.0:4001</code>:</p>
${run('c14-bind-api', 'ss -tlnp', 4)}
<p>On the API machine itself, port 4000 answers on 127.0.0.1 but not on the machine's own network address 10.10.2.20 (nc prints nothing and gives up); 4001 answers everywhere. From the client, across the network:</p>
${run('c14-bind-client', 'nc -w 1 10.10.2.20 4000', 3)}
<p><strong>127.0.0.1</strong> is the <em>loopback</em> address: a virtual card that only connects programs on the same machine — packets never leave it. <strong>0.0.0.0</strong> means "all my addresses". So a server bound to 127.0.0.1 is invisible to every other machine, and the kernel answers them with RST: <em>connection refused</em>.</p>
${net('socket', 'bind', 'en', 'Bind to 127.0.0.1, 0.0.0.0 or one address, then try connecting from the same host, another container and through docker -p.', { tour: 'socket-bind' })}
<div class="pitfall co-tieu-de">
<p><strong>"It works on my machine" — the API bound to 127.0.0.1.</strong> Many frameworks default to localhost in development (Vite, the Next.js dev server in some setups, Flask's <code>app.run()</code>, a hand-written <code>app.listen(3000, 'localhost')</code>). Everything works in your browser on the same laptop; your teammate's phone, the projector laptop on demo day, or nginx in another container gets <em>connection refused</em>. Check with <code>ss -tlnp</code>: if the local address is <code>127.0.0.1</code>, only that machine can connect. Listen on <code>0.0.0.0</code> (or the specific network address) when other machines must reach you — and then think about the firewall.</p>
</div>

<h3>EADDRINUSE: one listener per address and port</h3>
${run('c14-bind-api', 'node -e', 1)}
<p>A second listener on the same address and port is refused with <code>EADDRINUSE</code>. In real life the culprit is usually an old process: a second <code>npm run dev</code> in another terminal, a container still running, a crashed server that left a child behind. Find it with <code>ss -tlnp 'sport = :4001'</code> and stop it. Different addresses <em>are</em> allowed: 127.0.0.1:4000 and 10.10.2.20:4000 can be two listeners.</p>

<h3>Docker -p: a door from the host into the container</h3>
<ul>
<li>Inside a container the app must listen on <strong>0.0.0.0</strong>. If it listens on 127.0.0.1 it only hears the container itself, and <code>-p</code> (which forwards from the host to the container's network card) cannot reach it — another "it works inside, refused outside" bug.</li>
<li><code>-p 3000:3000</code> publishes the port on <strong>all</strong> host addresses: anyone who can reach the server can reach that port, and Docker's own documentation warns that its rules sit in front of firewall front-ends such as ufw.</li>
<li><code>-p 127.0.0.1:3000:3000</code> publishes it only to the host itself — exactly what you want when nginx on the host proxies to the container. A PostgreSQL started with <code>-p 5432:5432</code> on a VPS is reachable from the whole Internet.</li>
</ul>

<h3>Where a socket lives in the computer</h3>
<p>Your program never holds the socket itself — it holds a small integer, a <strong>file descriptor</strong>, that points to the socket object inside the kernel (the Operating Systems course covers fds in depth). The socket has a <strong>receive buffer</strong> and a <strong>send buffer</strong> in kernel RAM; <code>Recv-Q</code> and <code>Send-Q</code> in <code>ss</code> show how many bytes are waiting in them. The kernel's TCP/IP code moves bytes between those buffers and the network chip. When an application reads too slowly, its Recv-Q grows — a clue you will use in Chapter 4.</p>
${cauNoi('en', { ...NWC, bai: 'nwc204-13-1-tang-giao-van-va-so-hieu-cong', so: '13.1', ten: 'Layer 4 and port numbers', giong: 'port ranges, well-known ports, the socket pair', khac: 'NWC204 reads netstat output and Cisco material', them: 'ss on a real server with one listener and many connections, kernel demultiplexing, 127.0.0.1 vs 0.0.0.0, EADDRINUSE and docker -p — the bugs developers actually hit' })}
${L('/courses/operating-systems-for-developers/learn', '🧠', 'Operating Systems for Developers', 'File descriptors, the fd table and how sockets look from inside a process.', 'Open')}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> demo day. Your teammate's back end on <code>nfd-api</code> "works" (curl on that machine succeeds) but the front end on another machine gets "connection refused".</p>
<ol>
<li>On <code>nfd-api</code>, start <code>node -e "require('http').createServer((q,s)=&gt;s.end('ok\\n')).listen(5000,'127.0.0.1')" &amp;</code>. Show with <code>ss -tlnp</code> where it listens.</li>
<li>From <code>nfd-client</code>, run <code>nc -v -w 1 10.10.2.20 5000</code> and <code>curl -s 10.10.2.20:5000</code>. Write down the exact errors.</li>
<li>Fix the bind address, restart, and prove from the client that it works. What changed in <code>ss -tlnp</code>?</li>
<li>Start the fixed server a second time without stopping the first. Read the error, then find and stop the first process with <code>ss -tlnp 'sport = :5000'</code>.</li>
<li>Bonus: from <code>nfd-client</code>, hold one connection open (<code>exec 3&lt;&gt;/dev/tcp/10.10.2.20/5000; sleep 30 &amp;</code>) and find it in <code>ss -tanp</code> on both machines. Which four values do the two lines share?</li>
</ol>
<p><strong>Done when:</strong> you can show the 127.0.0.1 listener, the refused connection, the fixed 0.0.0.0 listener reachable from the client, and the EADDRINUSE you solved with ss.</p>
<details><summary>Solution</summary>
<p><code>ss -tlnp</code> shows <code>127.0.0.1:5000</code>; from the client nc says <code>Connection refused</code> and curl <code>(7) … Could not connect to server</code>. Change <code>'127.0.0.1'</code> to <code>'0.0.0.0'</code>: ss now shows <code>0.0.0.0:5000</code> and the client gets <code>ok</code>. A second start fails with <code>EADDRINUSE</code>; <code>ss -tlnp 'sport = :5000'</code> shows the owning <code>node</code> with its pid — <code>kill</code> it. In the bonus, the client shows local <code>10.10.1.10:N</code> → peer <code>10.10.2.20:5000</code>, the server shows local <code>10.10.2.20:5000</code> → peer <code>10.10.1.10:N</code>: the same four values, mirrored.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['port (cổng)', '16-bit number that picks the program on a machine.'],
    ['ephemeral port (cổng tạm)', 'Temporary source port the kernel gives a client; 32768–60999 on Linux.'],
    ['socket', 'Kernel object for network I/O; a connected TCP socket is named by protocol + local IP:port + remote IP:port.'],
    ['listening socket (socket đang nghe)', 'Waits for new connections; accept() turns each one into a connected socket.'],
    ['backlog', 'How many completed connections may wait to be accepted (Send-Q of a listener in ss).'],
    ['loopback / 127.0.0.1', 'Virtual interface reaching only programs on the same machine.'],
    ['0.0.0.0 (all addresses)', 'Bind address meaning "every address of this machine".'],
    ['EADDRINUSE', '"Address already in use": another socket already listens on that address and port.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>The IP picks the machine, the port picks the program; clients get ephemeral ports 32768–60999.</li>
<li>A connected socket is named by protocol + both ends; the kernel matches incoming segments on all four addresses/ports, then falls back to a listener, else RST.</li>
<li>One listening socket, many connected sockets on the same port — that is how nginx serves thousands of clients on :80.</li>
<li>127.0.0.1 = this machine only; 0.0.0.0 = every address — the root of "works on my machine, refused elsewhere".</li>
<li>ss -tlnp shows who listens where; ss -tanp shows every connection and its state; Recv-Q/Send-Q are the socket buffers.</li>
</ul>
${L('https://man7.org/linux/man-pages/man8/ss.8.html', '📄', 'man 8 ss', 'Every column and filter of ss.', 'Open')}
${L('https://man7.org/linux/man-pages/man7/socket.7.html', '📄', 'man 7 socket', 'The socket interface the kernel offers to programs.', 'Open')}
${L('https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml', '🌐', 'IANA — Service names and port numbers', 'The official registry of well-known and registered ports.', 'Open')}
${L('https://docs.docker.com/engine/network/packet-filtering-firewalls/', '🐳', 'Docker — Packet filtering and firewalls', 'Why published ports bypass ufw rules (section "Docker and ufw").', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Cổng và socket: một máy phục vụ nhiều ứng dụng và nhiều khách thế nào</h2>
<p class="lead">Một VPS chạy cùng lúc nginx, một API Node, PostgreSQL và SSH, và riêng nginx có thể giữ hàng nghìn cuộc nói chuyện — vậy mà byte nào cũng tới đúng chương trình và đúng cuộc nói chuyện. Bài này cho thấy cách đó, với output <code>ss</code> thật, và giải thích lỗi mà sinh viên nào cũng gặp ít nhất một lần: "API chạy trên laptop em, nhưng từ chối mọi người khác."</p>

<h3>Cổng chọn chương trình</h3>
<p>Địa chỉ IP đưa gói tới đúng <em>máy</em>; <strong>cổng (port)</strong> — một số 16 bit (0–65535) trong header TCP hoặc UDP — đưa gói tới đúng <em>chương trình</em> trên máy đó. Bạn đã thấy nó trong các byte ở bài 1.3: <code>00 50</code> = cổng 80.</p>
<ul>
<li><strong>0–1023, cổng quen thuộc (well-known)</strong> — 22 SSH, 53 DNS, 80 HTTP, 443 HTTPS. Trên một máy Linux bình thường chỉ root mới gắn được.</li>
<li><strong>1024–49151, cổng đăng ký (registered)</strong> — 3000 (máy chủ Node lúc phát triển), 5432 (PostgreSQL), 6379 (Redis), 8080.</li>
<li><strong>Cổng tạm (ephemeral)</strong> — cổng nguồn tạm thời mà nhân cấp cho máy khách ở mỗi kết nối. Trên Linux:</li>
</ul>
${run('c14-client', 'sysctl', 1)}
<p>Tức là 60999 − 32768 + 1 = 28 232 cổng nguồn khả dĩ cho mỗi đích. Mỗi lệnh <code>curl</code> bạn chạy tới giờ đều mang một cổng như vậy — chính các số "port …" lớn hơn 32768 trong những output trước.</p>

<h3>Socket được đặt tên bằng năm giá trị</h3>
<p><strong>Socket</strong> là đối tượng của nhân mà chương trình dùng để gửi và nhận qua mạng. Một socket TCP đã kết nối được nhận diện bằng năm giá trị: <strong>giao thức, IP phía mình, cổng phía mình, IP phía bên kia, cổng phía bên kia</strong>. Có hai loại cần biết:</p>
<ul>
<li><strong>Socket đang nghe (listening)</strong> — tạo bởi <code>listen()</code> (thứ <code>app.listen(3000)</code> làm bên dưới). Nó không bao giờ chở dữ liệu; nó chờ kết nối mới. Phía bên kia là ký tự đại diện <code>*:*</code>.</li>
<li><strong>Socket đã kết nối (connected)</strong> — tạo bởi <code>accept()</code> ở máy chủ cho mỗi khách mới, hoặc bởi <code>connect()</code> ở máy khách. Nó chở đúng một cuộc nói chuyện; cả năm giá trị đều đã biết.</li>
</ul>

<h3>Đọc ss: ai đang nghe, ai đang kết nối</h3>
<p><code>ss</code> liệt kê các socket. <code>-t</code> TCP, <code>-l</code> chỉ socket đang nghe, <code>-n</code> hiện số thay vì tên, <code>-p</code> tiến trình sở hữu. Trên máy chủ web:</p>
${run('c14-web', 'ss -tlnp', 1)}
<p>nginx nghe trên <code>0.0.0.0:80</code> — cổng 80 trên mọi địa chỉ của máy. Với socket đang nghe, <code>Send-Q</code> là <strong>backlog</strong>: bao nhiêu kết nối đã bắt tay xong được phép xếp hàng chờ nginx <code>accept()</code> (ở đây là 511). Dòng thứ hai, <code>127.0.0.11</code>, là máy chủ DNS cài sẵn của Docker để phân giải tên container — đọc <code>ss</code> lúc nào cũng cho bạn biết thêm điều gì đó về một cái máy.</p>
<p>Giờ cho <code>client</code> mở hai kết nối nhàn rỗi và <code>client2</code> một, rồi xem lại, lần này mọi trạng thái (<code>-a</code>):</p>
${run('c14-web', "ss -tanp", 2)}
<p>Một socket đang nghe và ba socket đã thiết lập — <strong>tất cả đều có cổng phía mình là 80</strong>. Chúng chỉ khác nhau ở phía bên kia: hai cái từ 10.10.1.10 với hai cổng tạm khác nhau, một cái từ 10.10.1.11. Toàn bộ bí quyết là đây: nhân tách các cuộc nói chuyện bằng cả bộ địa chỉ và cổng, không chỉ bằng cổng.</p>

<h3>Nhân chọn socket cho một segment đi tới thế nào</h3>
<ol>
<li>Tìm một socket <strong>đã kết nối</strong> có bốn giá trị (IP:cổng phía mình, IP:cổng phía bên kia) khớp chính xác. Thấy ⇒ dữ liệu vào bộ đệm nhận của socket đó.</li>
<li>Không khớp mà segment là <strong>SYN</strong> (kết nối mới) ⇒ socket <strong>đang nghe</strong> của cổng đó nhận, nhân hoàn tất bắt tay và xếp kết nối mới chờ <code>accept()</code>.</li>
<li>Không khớp và không ai nghe cổng đó ⇒ nhân trả lời bằng <strong>RST</strong> (reset) ⇒ máy khách báo <em>connection refused</em>.</li>
</ol>
${net('socket', 'demux', 'vi', 'Ba khách, một cổng 80: xem mỗi segment đi tới được ghép với đúng socket, và một gói SYN thành kết nối mới.', { tour: 'socket-demux' })}

<h3>Phía máy khách: mỗi kết nối một cổng mới</h3>
${run('c14-client', 'ss -tanp', 1)}
<p>Cùng các kết nối đó nhìn từ máy khách: cổng phía bên kia là 80 còn cổng phía mình là cổng tạm. Cạnh hai kết nối đang sống (của các tiến trình <code>sleep</code> đang giữ chúng mở) là nhiều kết nối <code>TIME-WAIT</code> — những kết nối đã đóng mà nhân còn nhớ thêm 60 giây, để các gói đến muộn của cuộc nói chuyện cũ không bị nhầm với cuộc mới (Chương 4). Giờ ba request liên tiếp:</p>
${run('c14-client', 'for i in 1 2 3', 1)}
<p>Nhìn <code>seenFrom</code>: lần nào API cũng thấy một cổng nguồn khác. nginx mở một kết nối hoàn toàn mới tới API cho mỗi request rồi đóng lại — giữa nginx và API không có keep-alive. Mỗi lần như vậy tốn một lần bắt tay và để lại một TIME-WAIT. Chương 10 bật keep-alive phía upstream và đo khác biệt.</p>

<h3>127.0.0.1 và 0.0.0.0: ai được phép kết nối?</h3>
<p>Địa chỉ bạn truyền cho <code>listen()</code> quyết định card mạng nào nhận kết nối. Ta chạy hai máy chủ Node tí hon trên máy API — một cái gắn vào <code>127.0.0.1:4000</code>, một cái vào <code>0.0.0.0:4001</code>:</p>
${run('c14-bind-api', 'ss -tlnp', 4)}
<p>Ngay trên máy API, cổng 4000 trả lời qua 127.0.0.1 nhưng không trả lời qua chính địa chỉ mạng 10.10.2.20 của máy (nc không in gì và bỏ cuộc); 4001 trả lời ở mọi nơi. Từ máy khách, qua mạng:</p>
${run('c14-bind-client', 'nc -w 1 10.10.2.20 4000', 3)}
<p><strong>127.0.0.1</strong> là địa chỉ <em>loopback</em> (vòng lặp nội bộ): một card ảo chỉ nối các chương trình trên cùng một máy — gói không bao giờ rời máy. <strong>0.0.0.0</strong> nghĩa là "mọi địa chỉ của tôi". Nên một máy chủ gắn vào 127.0.0.1 thì vô hình với mọi máy khác, và nhân trả lời chúng bằng RST: <em>connection refused</em>.</p>
${net('socket', 'bind', 'vi', 'Gắn vào 127.0.0.1, 0.0.0.0 hoặc một địa chỉ cụ thể, rồi thử kết nối từ chính máy đó, từ container khác và qua docker -p.', { tour: 'socket-bind' })}
<div class="pitfall co-tieu-de">
<p><strong>"Máy em chạy được mà" — API gắn vào 127.0.0.1.</strong> Nhiều framework mặc định nghe localhost khi phát triển (Vite, máy chủ dev của Next.js ở một số cấu hình, <code>app.run()</code> của Flask, một <code>app.listen(3000, 'localhost')</code> viết tay). Mọi thứ chạy ngon trên trình duyệt cùng laptop; điện thoại của bạn cùng nhóm, laptop nối máy chiếu hôm demo, hay nginx ở container khác thì nhận <em>connection refused</em>. Kiểm bằng <code>ss -tlnp</code>: nếu địa chỉ phía mình là <code>127.0.0.1</code> thì chỉ máy đó kết nối được. Nghe trên <code>0.0.0.0</code> (hoặc đúng địa chỉ mạng đó) khi máy khác cần tới được bạn — và lúc đó hãy nghĩ tới tường lửa.</p>
</div>

<h3>EADDRINUSE: mỗi địa chỉ và cổng chỉ một socket nghe</h3>
${run('c14-bind-api', 'node -e', 1)}
<p>Socket nghe thứ hai trên cùng địa chỉ và cổng bị từ chối với <code>EADDRINUSE</code>. Ngoài đời, thủ phạm thường là một tiến trình cũ: một lần <code>npm run dev</code> thứ hai ở terminal khác, một container vẫn đang chạy, một máy chủ đã sập nhưng để lại tiến trình con. Tìm nó bằng <code>ss -tlnp 'sport = :4001'</code> rồi dừng nó. Khác địa chỉ thì <em>được</em>: 127.0.0.1:4000 và 10.10.2.20:4000 có thể là hai socket nghe.</p>

<h3>Docker -p: một cánh cửa từ máy chủ vào container</h3>
<ul>
<li>Bên trong container, ứng dụng phải nghe trên <strong>0.0.0.0</strong>. Nghe trên 127.0.0.1 thì nó chỉ nghe được chính container, và <code>-p</code> (thứ chuyển tiếp từ máy chủ vào card mạng của container) không với tới được — thêm một lỗi "bên trong chạy, bên ngoài bị từ chối".</li>
<li><code>-p 3000:3000</code> mở cổng trên <strong>mọi</strong> địa chỉ của máy chủ: ai tới được máy chủ là tới được cổng đó, và chính tài liệu của Docker cảnh báo luật của nó nằm phía trước các công cụ tường lửa như ufw.</li>
<li><code>-p 127.0.0.1:3000:3000</code> chỉ mở cho chính máy chủ — đúng thứ bạn cần khi nginx trên máy chủ làm proxy vào container. Một PostgreSQL chạy với <code>-p 5432:5432</code> trên VPS là tới được từ cả Internet.</li>
</ul>

<h3>Socket nằm ở đâu trong máy tính</h3>
<p>Chương trình của bạn không bao giờ cầm chính socket — nó cầm một số nguyên nhỏ, <strong>file descriptor</strong>, trỏ tới đối tượng socket bên trong nhân (khoá Hệ điều hành dạy kỹ về fd). Socket có một <strong>bộ đệm nhận</strong> và một <strong>bộ đệm gửi</strong> trong RAM của nhân; <code>Recv-Q</code> và <code>Send-Q</code> trong <code>ss</code> cho biết bao nhiêu byte đang chờ trong đó. Mã TCP/IP của nhân chuyển byte giữa các bộ đệm đó và chip mạng. Khi một ứng dụng đọc quá chậm, Recv-Q của nó tăng dần — một manh mối bạn sẽ dùng ở Chương 4.</p>
${cauNoi('vi', { ...NWC, bai: 'nwc204-13-1-tang-giao-van-va-so-hieu-cong', so: '13.1', ten: 'Tầng 4 và số hiệu cổng', giong: 'các dải cổng, cổng quen thuộc, cặp socket', khac: 'NWC204 đọc output netstat và tài liệu Cisco', them: 'ss trên một máy chủ thật với một socket nghe và nhiều kết nối, cách nhân phân phối gói, 127.0.0.1 khác 0.0.0.0, EADDRINUSE và docker -p — những lỗi lập trình viên thật sự gặp' })}
${L('/courses/operating-systems-for-developers/learn', '🧠', 'Operating Systems for Developers', 'File descriptor, bảng fd và socket nhìn từ bên trong một tiến trình.', 'Mở')}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> hôm demo. Backend của bạn cùng nhóm trên <code>nfd-api</code> "chạy được" (curl ngay trên máy đó thành công) nhưng frontend ở máy khác nhận "connection refused".</p>
<ol>
<li>Trên <code>nfd-api</code>, chạy <code>node -e "require('http').createServer((q,s)=&gt;s.end('ok\\n')).listen(5000,'127.0.0.1')" &amp;</code>. Dùng <code>ss -tlnp</code> cho thấy nó đang nghe ở đâu.</li>
<li>Từ <code>nfd-client</code>, chạy <code>nc -v -w 1 10.10.2.20 5000</code> và <code>curl -s 10.10.2.20:5000</code>. Ghi lại chính xác các lỗi.</li>
<li>Sửa địa chỉ gắn, chạy lại, và chứng minh từ máy khách là đã chạy. <code>ss -tlnp</code> thay đổi gì?</li>
<li>Chạy máy chủ đã sửa lần thứ hai mà không dừng cái đầu. Đọc lỗi, rồi tìm và dừng tiến trình đầu bằng <code>ss -tlnp 'sport = :5000'</code>.</li>
<li>Thêm: từ <code>nfd-client</code>, giữ một kết nối mở (<code>exec 3&lt;&gt;/dev/tcp/10.10.2.20/5000; sleep 30 &amp;</code>) và tìm nó trong <code>ss -tanp</code> trên cả hai máy. Hai dòng đó chung bốn giá trị nào?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn cho thấy được socket nghe 127.0.0.1, kết nối bị từ chối, socket nghe 0.0.0.0 đã sửa và tới được từ máy khách, và lỗi EADDRINUSE bạn đã giải quyết bằng ss.</p>
<details><summary>Lời giải</summary>
<p><code>ss -tlnp</code> hiện <code>127.0.0.1:5000</code>; từ máy khách nc báo <code>Connection refused</code> còn curl báo <code>(7) … Could not connect to server</code>. Đổi <code>'127.0.0.1'</code> thành <code>'0.0.0.0'</code>: ss giờ hiện <code>0.0.0.0:5000</code> và máy khách nhận <code>ok</code>. Chạy lần hai lỗi <code>EADDRINUSE</code>; <code>ss -tlnp 'sport = :5000'</code> hiện tiến trình <code>node</code> sở hữu kèm pid — <code>kill</code> nó. Ở phần thêm, máy khách hiện phía mình <code>10.10.1.10:N</code> → phía bên kia <code>10.10.2.20:5000</code>, máy chủ hiện phía mình <code>10.10.2.20:5000</code> → phía bên kia <code>10.10.1.10:N</code>: cùng bốn giá trị, đảo chiều.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['port (cổng)', 'Số 16 bit chọn chương trình trên một máy.'],
    ['ephemeral port (cổng tạm)', 'Cổng nguồn tạm thời nhân cấp cho máy khách; 32768–60999 trên Linux.'],
    ['socket', 'Đối tượng của nhân cho việc vào ra mạng; socket TCP đã kết nối được đặt tên bằng giao thức + IP:cổng hai đầu.'],
    ['listening socket (socket đang nghe)', 'Chờ kết nối mới; accept() biến mỗi kết nối thành một socket đã kết nối.'],
    ['backlog (hàng chờ)', 'Số kết nối đã bắt tay xong được chờ để accept (Send-Q của socket nghe trong ss).'],
    ['loopback / 127.0.0.1 (vòng lặp nội bộ)', 'Card ảo chỉ tới được các chương trình trên cùng máy.'],
    ['0.0.0.0 (mọi địa chỉ)', 'Địa chỉ gắn nghĩa là "mọi địa chỉ của máy này".'],
    ['EADDRINUSE', '"Address already in use": đã có socket khác nghe trên đúng địa chỉ và cổng đó.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>IP chọn máy, cổng chọn chương trình; máy khách được cấp cổng tạm 32768–60999.</li>
<li>Socket đã kết nối được đặt tên bằng giao thức + hai đầu; nhân khớp segment đi tới bằng đủ bốn giá trị địa chỉ/cổng, rồi mới tới socket nghe, không có thì RST.</li>
<li>Một socket nghe, nhiều socket đã kết nối trên cùng cổng — đó là cách nginx phục vụ hàng nghìn khách ở cổng 80.</li>
<li>127.0.0.1 = chỉ máy này; 0.0.0.0 = mọi địa chỉ — gốc rễ của "máy em chạy, chỗ khác bị từ chối".</li>
<li>ss -tlnp cho thấy ai nghe ở đâu; ss -tanp cho thấy mọi kết nối và trạng thái; Recv-Q/Send-Q là bộ đệm của socket.</li>
</ul>
${L('https://man7.org/linux/man-pages/man8/ss.8.html', '📄', 'man 8 ss', 'Mọi cột và bộ lọc của ss.', 'Mở')}
${L('https://man7.org/linux/man-pages/man7/socket.7.html', '📄', 'man 7 socket', 'Giao diện socket mà nhân cung cấp cho chương trình.', 'Mở')}
${L('https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml', '🌐', 'IANA — Tên dịch vụ và số cổng', 'Sổ đăng ký chính thức các cổng quen thuộc và cổng đăng ký.', 'Mở')}
${L('https://docs.docker.com/engine/network/packet-filtering-firewalls/', '🐳', 'Docker — Lọc gói và tường lửa', 'Vì sao cổng đã publish đi vòng qua luật của ufw (mục "Docker and ufw").', 'Mở')}
</div>
`,
};
