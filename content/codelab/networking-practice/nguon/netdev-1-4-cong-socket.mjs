/** Networking for Developers · 1.5 — Cổng và socket: đọc ss thật, 127.0.0.1 vs 0.0.0.0, EADDRINUSE, docker -p; tự viết maxNewConnPerSec / parseSsListen / demux. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, sauLenh, pre } from './_net.mjs';

const WEB_L = sauLenh('c14-web', 'ss -tlnp');
const WEB_A = sauLenh('c14-web', 'ss -tanp');
const CLI_A = sauLenh('c14-client', 'ss -tanp');
const API_L = sauLenh('c14-bind-api', 'ss -tlnp');
const RANGE = sauLenh('c14-client', 'sysctl')[0];

/* ── 1. Khái niệm ── */
const E1 = cs({
  ten: 'Sockets 1 — Ports, ranges and the five values', kho: 'EASY', phut: 8,
  en: `Real output from the lab:${pre(['$ sysctl net.ipv4.ip_local_port_range', RANGE, '', '# on the web server', '$ ss -tlnp', ...WEB_L])}`,
  vi: `Output thật trong lab:${pre(['$ sysctl net.ipv4.ip_local_port_range', RANGE, '', '# trên web server', '$ ss -tlnp', ...WEB_L])}`,
  cau: [
    q('c1', ['The IP address picks the machine. The port picks …', 'Địa chỉ IP chọn máy. Cổng chọn …'], ['the program on that machine', 'the network card of the machine', 'the router on the way there', 'the user logged in on it'], ['A port is a 16-bit number (0–65535) in the TCP/UDP header; the kernel uses it to hand the data to the right program.', 'Cổng là số 16 bit (0–65535) trong header TCP/UDP; kernel dùng nó để giao dữ liệu cho đúng chương trình.']),
    q('c2', ['curl\'s source port is "random" — where does it come from on Linux?', 'Cổng nguồn của curl "ngẫu nhiên" — trên Linux nó lấy từ đâu?'], ['The ephemeral range 32768–60999 set by ip_local_port_range', 'The well-known range 0–1023 reserved for system services', 'The registered range 1024–49151 listed by IANA', 'The port the server tells the client in its first answer'], ['The kernel picks a free port from net.ipv4.ip_local_port_range for each new connection: 60999 − 32768 + 1 = 28 232 ports.', 'Kernel chọn một cổng trống trong net.ipv4.ip_local_port_range cho mỗi kết nối mới: 60999 − 32768 + 1 = 28 232 cổng.']),
    q('c3', ['A connected TCP socket is identified by …', 'Một socket TCP đã kết nối được nhận diện bởi …'], ['protocol + local IP:port + remote IP:port', 'the local port alone, which is unique on the machine', 'the process id of the program that opened it', 'the MAC addresses of the two network cards'], ['Five values. That is how nginx holds thousands of connections all on local port 80: the remote side differs.', 'Năm giá trị. Nhờ thế nginx giữ hàng nghìn kết nối cùng cổng cục bộ 80: phía bên kia khác nhau.']),
    q('c4', ['nginx listens on 0.0.0.0:80 with Send-Q 511. For a listening socket that 511 is …', 'nginx nghe 0.0.0.0:80 với Send-Q 511. Với socket đang nghe, 511 là …'], ['the backlog: finished handshakes that may wait for accept()', 'the number of bytes waiting to be sent to the clients', 'the number of clients connected to nginx right now', 'the maximum size in KB of one HTTP response'], ['For a listener ss shows the backlog in Send-Q; for a connected socket Recv-Q/Send-Q are bytes waiting in its buffers.', 'Với socket đang nghe, ss hiện backlog ở cột Send-Q; với socket đã kết nối, Recv-Q/Send-Q là số byte chờ trong bộ đệm.']),
    q('c5', ['What is the second listener, 127.0.0.11:33409, with no process shown?', 'Socket nghe thứ hai, 127.0.0.11:33409, không hiện tiến trình, là gì?'], ['Docker\'s built-in DNS server that resolves container names', 'A hidden backdoor that nginx opened on a random port', 'The router container forwarding packets to the web server', 'A TIME-WAIT socket left over from an old connection'], ['Docker puts a small DNS resolver at 127.0.0.11 inside every container on a user-defined network. Reading ss always teaches you something about the machine.', 'Docker đặt một máy phân giải DNS nhỏ ở 127.0.0.11 trong mọi container thuộc mạng tự định nghĩa. Đọc ss luôn cho bạn biết thêm về máy.']),
  ],
  goiY: [['Well-known 0–1023, registered 1024–49151, ephemeral (Linux) 32768–60999.', 'Quen thuộc 0–1023, đăng ký 1024–49151, tạm (Linux) 32768–60999.'], ['A listener\'s remote side is a wildcard; a connection has both sides known.', 'Phía bên kia của socket nghe là ký tự đại diện; kết nối thì biết cả hai phía.']],
  loi: [['Believing one port can only carry one connection.', 'Tin rằng một cổng chỉ chở được một kết nối.'], ['Reading Send-Q of a listener as bytes waiting to be sent.', 'Đọc Send-Q của socket nghe thành số byte chờ gửi.']],
  tns: [tn('ephemeral port', 'cổng tạm'), tn('listening socket', 'socket đang nghe'), tn('backlog', 'hàng chờ accept')],
  kn: ['ports', 'sockets'],
});

/* ── 2. Đọc ss -tanp thật ── */
const LOAI = ['listening socket', 'connected (ESTAB)', 'closed, remembered (TIME-WAIT)'];
const AI = ['client 10.10.1.10', 'client2 10.10.1.11', 'any client (*)', 'web 10.10.2.10'];
const dong = (ds, bat) => { const d = ds.find((x) => x.includes(bat)); if (!d) throw new Error(`ss: không có ${bat}`); return d.replace(/\s+$/, ''); };
const hs = (d, k, r, p) => ({ o: { x: d }, a: { k, r, p: [p] } });
const E2 = cs({
  ten: 'Sockets 2 — Read ss -tanp on both ends', kho: 'MEDIUM', phut: 12, loai: 'table',
  en: `While client held two idle connections and client2 one, ss printed this on the web server and on the client (lab/out/c14-web, c14-client):${pre(['# web', ...WEB_A, '', '# client (first lines)', ...CLI_A.slice(0, 5)])}For each line: what kind of socket, who is on the other side, and which LOCAL port it uses.`,
  vi: `Trong lúc client giữ hai kết nối rảnh và client2 giữ một, ss in ra thế này trên web server và trên client (lab/out/c14-web, c14-client):${pre(['# web', ...WEB_A, '', '# client (vài dòng đầu)', ...CLI_A.slice(0, 5)])}Với mỗi dòng: loại socket nào, ai ở đầu bên kia, và nó dùng cổng CỤC BỘ nào.`,
  bang: [bang1('b1', ['Socket by socket', 'Từng socket'], [{ ma: 'x', ten: 'Line' }, { ma: 'k', ten: 'Kind', luaChon: LOAI }, { ma: 'r', ten: 'Other side', luaChon: AI }, { ma: 'p', ten: 'Local port' }], [
    hs(dong(WEB_A, 'LISTEN'), LOAI[0], AI[2], '80'),
    hs(dong(WEB_A, '10.10.1.11:38458'), LOAI[1], AI[1], '80'),
    hs(dong(WEB_A, '10.10.1.10:40042'), LOAI[1], AI[0], '80'),
    hs(dong(CLI_A, '10.10.1.10:40042'), LOAI[1], AI[3], '40042'),
    hs(dong(CLI_A, '10.10.1.10:40030'), LOAI[2], AI[3], '40030'),
  ], ['On the web server every socket has local port 80 — one listener plus one connected socket per conversation; they differ only by the remote side. On the client the same connection appears mirrored: local 10.10.1.10:40042, peer 10.10.2.10:80 — the same four values. TIME-WAIT lines are connections already closed that the kernel remembers for 60 s (Chapter 4). The trap: thinking the client\'s local port is 80.', 'Trên web server, socket nào cũng có cổng cục bộ 80 — một socket nghe cộng một socket kết nối cho mỗi cuộc hội thoại; chúng chỉ khác phía bên kia. Trên client, cùng kết nối đó hiện ra đối xứng: cục bộ 10.10.1.10:40042, đầu kia 10.10.2.10:80 — cùng bốn giá trị. Dòng TIME-WAIT là kết nối đã đóng mà kernel còn nhớ 60 s (Chương 4). Cái bẫy: nghĩ cổng cục bộ của client là 80.'])],
  goiY: [['"Local Address:Port" is this machine; "Peer Address:Port" is the other side.', '"Local Address:Port" là máy này; "Peer Address:Port" là phía bên kia.'], ['The number after the LAST colon of the local column is the local port.', 'Số sau dấu hai chấm CUỐI CÙNG của cột local là cổng cục bộ.']],
  loi: [['Reading the peer column as the local one.', 'Đọc cột peer thành cột local.'], ['Treating TIME-WAIT lines as live connections.', 'Coi dòng TIME-WAIT là kết nối còn sống.']],
  tns: [tn('ESTAB', 'đã thiết lập', 'Kết nối đang mở, chở dữ liệu được.'), tn('TIME-WAIT', 'chờ sau khi đóng'), tn('peer', 'đầu bên kia')],
  kn: ['ss', 'sockets'],
});

/* ── 3. Lỗi kinh điển ── */
const BC = sauLenh('c14-bind-client', 'nc -w 1 -v 10.10.2.20 4000')[0];
const EAU = sauLenh('c14-bind-api', 'node -e')[0];
const E3 = cs({
  ten: 'Sockets 3 — "Works on my machine", EADDRINUSE and docker -p', kho: 'MEDIUM', phut: 12,
  en: `On the API machine one server listens on 127.0.0.1:4000 and one on 0.0.0.0:4001 (lab/out/c14-bind-api, c14-bind-client):${pre(['# api', '$ ss -tlnp', ...API_L, '', '# client', '$ nc -w 1 -v 10.10.2.20 4000', BC, '$ nc -w 1 10.10.2.20 4001', 'hi from 0.0.0.0:4001', '', '# api again', '$ node -e "require(\'net\').createServer().listen(4001,\'0.0.0.0\').on(\'error\',e=>console.log(e.code, e.message))"', EAU])}`,
  vi: `Trên máy API, một server nghe 127.0.0.1:4000 và một server nghe 0.0.0.0:4001 (lab/out/c14-bind-api, c14-bind-client):${pre(['# api', '$ ss -tlnp', ...API_L, '', '# client', '$ nc -w 1 -v 10.10.2.20 4000', BC, '$ nc -w 1 10.10.2.20 4001', 'hi from 0.0.0.0:4001', '', '# lại máy api', '$ node -e "require(\'net\').createServer().listen(4001,\'0.0.0.0\').on(\'error\',e=>console.log(e.code, e.message))"', EAU])}`,
  cau: [
    q('c1', ['Why is 4000 refused from the client while 4001 answers?', 'Vì sao cổng 4000 bị từ chối từ client còn 4001 trả lời?'], ['127.0.0.1 is loopback: only programs on the same machine can connect', '127.0.0.1 is blocked by the router between the two networks', 'Port 4000 is reserved by the kernel for the root user only', 'nc can only open connections to ports above 4000'], ['A socket bound to 127.0.0.1 listens on the loopback card only; a SYN arriving on eth0 for 10.10.2.20:4000 finds no listener, so the kernel answers RST ⇒ refused.', 'Socket gắn 127.0.0.1 chỉ nghe trên card loopback; SYN đến eth0 cho 10.10.2.20:4000 không thấy ai nghe, nên kernel trả RST ⇒ refused.']),
    q('c2', ['The second node listen on 4001 failed with EADDRINUSE. Most likely in real life …', 'Lệnh node listen thứ hai trên 4001 lỗi EADDRINUSE. Ngoài đời, khả năng cao nhất là …'], ['an old process (a second npm run dev, a container) still holds the port', 'the firewall blocks port 4001 for new programs on this machine', 'the port is in TIME-WAIT because the client closed a connection', 'the kernel ran out of ephemeral ports for new listeners'], ['One listener per address and port. Find the owner with ss -tlnp \'sport = :4001\' and stop it. (127.0.0.1:4000 and 10.10.2.20:4000 could be two listeners: different addresses are allowed.)', 'Mỗi địa chỉ và cổng một socket nghe. Tìm chủ bằng ss -tlnp \'sport = :4001\' rồi dừng nó. (127.0.0.1:4000 và 10.10.2.20:4000 có thể là hai socket nghe: khác địa chỉ thì được.)']),
    q('c3', ['Inside a container your app listens on 127.0.0.1:3000 and you run docker run -p 3000:3000. From the host, curl localhost:3000 …', 'Trong container, app nghe 127.0.0.1:3000 và bạn chạy docker run -p 3000:3000. Từ máy host, curl localhost:3000 …'], ['fails: -p forwards to the container\'s card, where nothing listens', 'works: -p copies the 127.0.0.1 socket onto the host as well', 'works only after you also open port 3000 in the host firewall', 'fails because port 3000 is reserved on the host for Node'], ['-p forwards traffic to the container\'s network card. An app on the container\'s loopback only hears the container itself — another "works inside, refused outside" bug. Listen on 0.0.0.0 inside containers.', '-p chuyển lưu lượng tới card mạng của container. App nghe loopback của container chỉ nghe được chính container — thêm một lỗi "bên trong chạy, bên ngoài bị từ chối". Trong container hãy nghe 0.0.0.0.']),
    q('c4', ['On a VPS, PostgreSQL started with -p 5432:5432. Who can reach it?', 'Trên VPS, PostgreSQL chạy với -p 5432:5432. Ai tới được nó?'], ['Anyone on the Internet who can reach the server', 'Only programs running on the VPS itself', 'Only other containers on the same Docker network', 'Nobody until ufw is told to allow port 5432'], ['-p without an address publishes on all host addresses, and Docker\'s rules sit in front of firewall front-ends such as ufw. Use -p 127.0.0.1:5432:5432 when only the host needs it.', '-p không có địa chỉ là mở trên mọi địa chỉ của host, và luật của Docker đứng trước các giao diện tường lửa như ufw. Dùng -p 127.0.0.1:5432:5432 khi chỉ host cần.']),
    q('c5', ['The client ran curl /api/hello three times; the API saw seenFrom ports 59748, 59764, 59774. What does that show?', 'Client chạy curl /api/hello ba lần; API thấy seenFrom các cổng 59748, 59764, 59774. Điều đó cho thấy gì?'], ['nginx opened a new connection to the API for every request', 'the client reused one connection for all three requests', 'the API changed its own listening port after each request', 'the router rewrote the source port of every packet'], ['A new source port = a new connection: no keep-alive between nginx and the API in this lab (nginx before 1.29.7 — our lab runs 1.28.3 — proxies with HTTP/1.0 and Connection: close; reuse needs an upstream block with keepalive in any version). Each one costs a handshake and leaves a TIME-WAIT behind.', 'Cổng nguồn mới = kết nối mới: giữa nginx và API trong lab không có keep-alive (nginx trước 1.29.7 — lab chạy 1.28.3 — proxy bằng HTTP/1.0 và Connection: close; muốn dùng lại kết nối thì phiên bản nào cũng cần khối upstream có keepalive). Mỗi lần tốn một lần bắt tay và để lại một TIME-WAIT.']),
  ],
  goiY: [['Ask which address the listener is bound to, and which card the connection arrives on.', 'Hỏi socket nghe gắn vào địa chỉ nào, và kết nối đến qua card nào.'], ['A changing source port means a new connection each time.', 'Cổng nguồn đổi nghĩa là mỗi lần một kết nối mới.']],
  loi: [['Opening the firewall to fix a server bound to 127.0.0.1.', 'Mở tường lửa để sửa một server gắn vào 127.0.0.1.'], ['Publishing a database with -p 5432:5432 on a public server.', 'Mở cơ sở dữ liệu bằng -p 5432:5432 trên server công khai.']],
  tns: [tn('bind', 'gắn vào địa chỉ'), tn('EADDRINUSE', 'địa chỉ đang được dùng'), tn('publish (-p)', 'mở cổng container ra host')],
  kn: ['bind address', 'docker -p'],
});

/* ── 4. Tự viết: bao nhiêu kết nối mới mỗi giây? ── */
function maxNewConnPerSec(o) {
  var ports = o.hi - o.lo + 1;              // both ends of the range are usable: 60999 − 32768 + 1 = 28232
  return Math.floor(ports / o.timeWaitS);   // each closed connection keeps its port busy for timeWaitS seconds
}
const E4 = jsBai({
  ten: 'Sockets 4 — Write maxNewConnPerSec(o): the ephemeral-port ceiling', kho: 'MEDIUM', phut: 10,
  en: `<p>Every new connection from one client machine to the same server IP and port needs a free ephemeral port, and a closed connection keeps its port in TIME-WAIT for a while (60 s on Linux). So there is a ceiling on new connections per second — the reason connection reuse matters for a busy service that calls another one.</p>${pre(['$ sysctl net.ipv4.ip_local_port_range', RANGE])}<p>Write <code>maxNewConnPerSec({ lo, hi, timeWaitS })</code> = the number of usable ports in the range (both ends included) divided by <code>timeWaitS</code>, rounded <b>down</b> to a whole number. With the lab's range and 60 s it is <b>470</b>.</p>`,
  vi: `<p>Mỗi kết nối mới từ một máy client tới cùng IP và cổng server cần một cổng tạm còn trống, và kết nối đã đóng giữ cổng của nó ở TIME-WAIT một lúc (60 s trên Linux). Nên có một trần số kết nối mới mỗi giây — lý do việc dùng lại kết nối quan trọng với một dịch vụ bận gọi sang dịch vụ khác.</p>${pre(['$ sysctl net.ipv4.ip_local_port_range', RANGE])}<p>Viết <code>maxNewConnPerSec({ lo, hi, timeWaitS })</code> = số cổng dùng được trong khoảng (tính cả hai đầu) chia cho <code>timeWaitS</code>, làm tròn <b>xuống</b> thành số nguyên. Với khoảng của lab và 60 s, kết quả là <b>470</b>.</p>`,
  dauVao: ['o — { lo, hi, timeWaitS } (integers, lo ≤ hi, timeWaitS ≥ 1).', 'o — { lo, hi, timeWaitS } (số nguyên, lo ≤ hi, timeWaitS ≥ 1).'],
  dauRa: ['A whole number of connections per second.', 'Một số nguyên kết nối mỗi giây.'],
  goiY: [['How many integers are there from 3 to 5? Not 5 − 3.', 'Từ 3 tới 5 có bao nhiêu số nguyên? Không phải 5 − 3.'], ['Math.floor, not Math.round: 470.53 connections per second means 470 complete ones.', 'Math.floor, không phải Math.round: 470,53 kết nối mỗi giây nghĩa là 470 kết nối trọn vẹn.']],
  loi: [['Forgetting the + 1: the result looks right for 60 s (470) but is wrong for other values.', 'Quên + 1: kết quả trông đúng với 60 s (470) nhưng sai với giá trị khác.'], ['Rounding to the nearest instead of down.', 'Làm tròn gần nhất thay vì làm tròn xuống.']],
  gt: ['A port is free again only after its TIME-WAIT ends, so in steady state at most (number of ports ÷ TIME-WAIT seconds) new connections can start every second towards one destination IP and port. 28 232 ÷ 60 = 470.5 ⇒ 470. That is why services reuse connections (pools, keep-alive) instead of opening one per request — and why "Cannot assign requested address" appears under load when they do not.', 'Một cổng chỉ trống lại sau khi TIME-WAIT kết thúc, nên ở trạng thái ổn định mỗi giây chỉ mở được tối đa (số cổng ÷ số giây TIME-WAIT) kết nối mới tới một IP và cổng đích. 28 232 ÷ 60 = 470,5 ⇒ 470. Vì thế các dịch vụ dùng lại kết nối (pool, keep-alive) thay vì mở một kết nối cho mỗi request — và vì thế lỗi "Cannot assign requested address" xuất hiện khi tải cao mà không làm vậy.'],
  kn: ['ephemeral ports', 'TIME-WAIT'],
  tns: [tn('TIME-WAIT', 'trạng thái chờ sau khi đóng', 'Kernel nhớ kết nối đã đóng để gói trễ không lẫn vào kết nối mới.'), tn('port exhaustion', 'cạn cổng tạm')],
  dau: `/** o = { lo, hi, timeWaitS } ⇒ max new connections per second (a whole number) */
function maxNewConnPerSec(o) {
  // Write your solution here
  return (o.hi - o.lo) / o.timeWaitS;
}
`,
  giai: '// Reference solution\n' + nguon(maxNewConnPerSec),
  cases: [
    { goi: goi('maxNewConnPerSec', { lo: 32768, hi: 60999, timeWaitS: 60 }) },
    { goi: goi('maxNewConnPerSec', { lo: 32768, hi: 60999, timeWaitS: 30 }) },
    { goi: goi('maxNewConnPerSec', { lo: 1024, hi: 65535, timeWaitS: 60 }) },
    { goi: goi('maxNewConnPerSec', { lo: 32768, hi: 60999, timeWaitS: 4 }), an: true },
    { goi: goi('maxNewConnPerSec', { lo: 49152, hi: 65535, timeWaitS: 120 }), an: true },
    { goi: goi('maxNewConnPerSec', { lo: 60000, hi: 60000, timeWaitS: 60 }), an: true },
    { goi: goi('maxNewConnPerSec', { lo: 40000, hi: 40009, timeWaitS: 1 }), an: true },
  ],
});

/* ── 5. Tự viết: đọc ss -tlnp ── */
function parseSsListen(text) {
  var out = [];
  text.split('\n').forEach(function (line) {
    var w = line.trim().split(/\s+/);
    if (w[0] !== 'LISTEN') return;                 // skip the header and anything else
    var local = w[3];                              // State Recv-Q Send-Q Local Peer [Process]
    var i = local.lastIndexOf(':');                // the LAST colon: IPv6 addresses contain colons too
    var m = /users:\(\("([^"]+)"/.exec(line);      // the first process name, if ss could show one
    out.push({ addr: local.slice(0, i), port: Number(local.slice(i + 1)), process: m ? m[1] : null });
  });
  return out;
}
const SS2 = ['State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess',
  'LISTEN 0      511          0.0.0.0:80         0.0.0.0:*    users:(("nginx",pid=7,fd=6),("nginx",pid=6,fd=6))',
  'LISTEN 0      511             [::]:80            [::]:*    users:(("nginx",pid=7,fd=7),("nginx",pid=6,fd=7))',
  'LISTEN 0      128                *:22               *:*    users:(("sshd",pid=1,fd=3))',
  'LISTEN 0      244            [::1]:5432          [::]:*    users:(("postgres",pid=88,fd=6))',
  'LISTEN 0      4096   127.0.0.53%lo:53         0.0.0.0:*    users:(("systemd-resolve",pid=401,fd=14))'].join('\n');
const E5 = jsBai({
  ten: 'Sockets 5 — Write parseSsListen(text) from real ss -tlnp output', kho: 'MEDIUM', phut: 20,
  en: `<p>"Who listens where?" is the first question when something is refused. Write <code>parseSsListen(text)</code> that turns the output of <code>ss -tlnp</code> into <code>[{ addr, port, process }]</code>, in the order of the lines. Real output from the API machine (lab/out/c14-bind-api):</p>${pre(['$ ss -tlnp', ...API_L])}<ul>
<li>Use only lines whose state is <code>LISTEN</code> (skip the header).</li>
<li><code>addr</code> = the local address exactly as printed, without the port (<code>'127.0.0.1'</code>, <code>'0.0.0.0'</code>, <code>'[::]'</code>, <code>'*'</code>…); <code>port</code> = a number.</li>
<li><code>process</code> = the name inside the first <code>users:(("…"</code>, or <code>null</code> when the column is empty (Docker's DNS server has none).</li>
</ul><p>Hidden cases: the real web server and router outputs, and a <b>constructed</b> listing of a typical VPS (IPv6 <code>[::]:80</code>, <code>[::1]:5432</code>, <code>*:22</code>, nginx with two worker processes, <code>127.0.0.53%lo</code>).</p>`,
  vi: `<p>"Ai đang nghe ở đâu?" là câu hỏi đầu tiên khi bị từ chối kết nối. Viết <code>parseSsListen(text)</code> đổi output của <code>ss -tlnp</code> thành <code>[{ addr, port, process }]</code>, theo thứ tự các dòng. Output thật trên máy API (lab/out/c14-bind-api):</p>${pre(['$ ss -tlnp', ...API_L])}<ul>
<li>Chỉ dùng dòng có trạng thái <code>LISTEN</code> (bỏ dòng tiêu đề).</li>
<li><code>addr</code> = địa chỉ cục bộ đúng như in ra, bỏ phần cổng (<code>'127.0.0.1'</code>, <code>'0.0.0.0'</code>, <code>'[::]'</code>, <code>'*'</code>…); <code>port</code> = một số.</li>
<li><code>process</code> = tên bên trong <code>users:(("…"</code> đầu tiên, hoặc <code>null</code> khi cột đó trống (máy chủ DNS của Docker không có).</li>
</ul><p>Ca ẩn: output thật của web server và router, và một danh sách <b>dựng</b> của một VPS điển hình (IPv6 <code>[::]:80</code>, <code>[::1]:5432</code>, <code>*:22</code>, nginx có hai tiến trình worker, <code>127.0.0.53%lo</code>).</p>`,
  dauVao: ['text — the ss -tlnp output (lines separated by \\n).', 'text — output ss -tlnp (các dòng cách nhau bởi \\n).'],
  dauRa: ['[{ addr: string, port: number, process: string | null }]', '[{ addr: chuỗi, port: số, process: chuỗi | null }]'],
  goiY: [['Split each line on runs of spaces: the 4th word is "address:port".', 'Tách mỗi dòng theo cụm dấu cách: từ thứ 4 là "địa chỉ:cổng".'], ['Split at the LAST colon (lastIndexOf) — "[::]:80" has three. For the process use a regular expression on the whole line: /users:\\(\\("([^"]+)"/.', 'Tách ở dấu hai chấm CUỐI (lastIndexOf) — "[::]:80" có ba dấu. Với tiến trình, dùng biểu thức chính quy trên cả dòng: /users:\\(\\("([^"]+)"/.']],
  loi: [['local.split(":") — breaks every IPv6 address.', 'local.split(":") — làm hỏng mọi địa chỉ IPv6.'], ['Reading the process by column position: the Process column is missing on some lines, so the position shifts.', 'Đọc tiến trình theo vị trí cột: cột Process vắng ở vài dòng nên vị trí bị lệch.'], ['Returning the port as a string ("80").', 'Trả cổng dạng chuỗi ("80").']],
  gt: ['ss aligns columns with spaces, so splitting on runs of whitespace gives the fields; the header "Peer Address:PortProcess" is skipped because it does not start with LISTEN. The last colon separates the port in every address family, and the process is matched by its own pattern rather than by position, because ss leaves that column empty when it cannot see the owner. The output answers the demo-day question at once: 127.0.0.1:4000 is local-only, 0.0.0.0:4001 is reachable.', 'ss căn cột bằng dấu cách, nên tách theo cụm khoảng trắng là ra các trường; dòng tiêu đề "Peer Address:PortProcess" bị bỏ vì không bắt đầu bằng LISTEN. Dấu hai chấm cuối cùng tách cổng ở mọi họ địa chỉ, còn tiến trình được khớp bằng mẫu riêng chứ không theo vị trí, vì ss để trống cột đó khi không thấy chủ. Kết quả trả lời ngay câu hỏi ngày demo: 127.0.0.1:4000 chỉ nội bộ, 0.0.0.0:4001 thì tới được.'],
  kn: ['ss', 'parsing'],
  tns: [tn('ss', 'công cụ liệt kê socket'), tn('wildcard address', 'địa chỉ đại diện', '0.0.0.0, [::] hoặc * — mọi địa chỉ của máy.'), tn('worker process', 'tiến trình làm việc', 'nginx có một tiến trình chủ và nhiều worker dùng chung socket nghe.')],
  dau: `/** text: output of "ss -tlnp" ⇒ [{ addr, port, process }] */
function parseSsListen(text) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution\n' + nguon(parseSsListen),
  cases: [
    { goi: goi('parseSsListen', API_L.join('\n')), moTa: ['The real API machine (lab/out/c14-bind-api)', 'Máy API thật (lab/out/c14-bind-api)'] },
    { goi: goi('parseSsListen', ['State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess', 'LISTEN 0      511          0.0.0.0:3000      0.0.0.0:*    users:(("node",pid=6,fd=18))'].join('\n')) },
    { goi: goi('parseSsListen', WEB_L.join('\n')), an: true },
    { goi: goi('parseSsListen', sauLenh('lab1-r1-router', 'ss -tlnp').join('\n')), an: true },
    { goi: goi('parseSsListen', SS2), an: true },
    { goi: goi('parseSsListen', sauLenh('lab1-r6-api', 'ss -tlnp').join('\n')), an: true },
  ],
});

/* ── 6. Tự viết: kernel chọn socket nào ── */
function demux(seg, sockets) {
  var dst = seg.dst + ':' + seg.dport;
  var src = seg.src + ':' + seg.sport;
  // 1. A connected socket whose four values match exactly.
  for (var i = 0; i < sockets.length; i++) {
    var s = sockets[i];
    if (s.state === 'ESTAB' && s.local === dst && s.remote === src) return s.id;
  }
  // 2. No connection: only a SYN may start one. A listener on the exact address wins over 0.0.0.0.
  if (seg.syn) {
    var wild = null;
    for (var j = 0; j < sockets.length; j++) {
      var l = sockets[j];
      if (l.state !== 'LISTEN') continue;
      if (l.local === dst) return l.id;
      if (l.local === '0.0.0.0:' + seg.dport && !wild) wild = l.id;
    }
    if (wild) return wild;
  }
  // 3. Nobody owns this segment: the kernel answers with a reset ⇒ "connection refused" for a SYN.
  return 'RST';
}
const WEB_S = [
  { id: 'L80', state: 'LISTEN', local: '0.0.0.0:80', remote: '0.0.0.0:*' },
  { id: 'E1', state: 'ESTAB', local: '10.10.2.10:80', remote: '10.10.1.11:38458' },
  { id: 'E2', state: 'ESTAB', local: '10.10.2.10:80', remote: '10.10.1.10:40042' },
  { id: 'E3', state: 'ESTAB', local: '10.10.2.10:80', remote: '10.10.1.10:40034' },
  { id: 'DNS', state: 'LISTEN', local: '127.0.0.11:33409', remote: '0.0.0.0:*' },
];
const API_S = [
  { id: 'DNS', state: 'LISTEN', local: '127.0.0.11:41639', remote: '0.0.0.0:*' },
  { id: 'L4000', state: 'LISTEN', local: '127.0.0.1:4000', remote: '0.0.0.0:*' },
  { id: 'L4001', state: 'LISTEN', local: '0.0.0.0:4001', remote: '0.0.0.0:*' },
  { id: 'L3000', state: 'LISTEN', local: '0.0.0.0:3000', remote: '0.0.0.0:*' },
];
// DỰNG: hai socket nghe cùng cổng 8080 (một địa chỉ cụ thể, một 0.0.0.0), socket đại diện in TRƯỚC.
const MIX = [
  { id: 'W8080', state: 'LISTEN', local: '0.0.0.0:8080', remote: '0.0.0.0:*' },
  { id: 'X8080', state: 'LISTEN', local: '10.10.2.20:8080', remote: '0.0.0.0:*' },
  { id: 'C1', state: 'ESTAB', local: '10.10.2.20:8080', remote: '10.10.2.10:51515' },
];
const sg = (src, sport, dst, dport, syn) => ({ src, sport, dst, dport, syn });
const E6 = jsBai({
  ten: 'Sockets 6 — Write demux(seg, sockets): which socket gets this segment?', kho: 'HARD', phut: 25,
  en: `<p>One port, many conversations. The web server's sockets while three connections were open (lab/out/c14-web):</p>${pre(WEB_A)}<p>Write <code>demux(seg, sockets)</code> that does what the kernel does for an arriving TCP segment. <code>seg = { src, sport, dst, dport, syn }</code>; each socket is <code>{ id, state: 'LISTEN' | 'ESTAB', local: 'ip:port', remote: 'ip:port' }</code> written as ss prints them. Return the <code>id</code> of the socket that receives the segment, or <code>'RST'</code>:</p>
<ol>
<li>An <code>ESTAB</code> socket whose <code>local</code> is <code>dst:dport</code> and whose <code>remote</code> is <code>src:sport</code> ⇒ that socket (the data goes into its buffer).</li>
<li>Otherwise, if the segment is a <b>SYN</b>: a <code>LISTEN</code> socket on exactly <code>dst:dport</code> ⇒ that one; else a <code>LISTEN</code> socket on <code>0.0.0.0:dport</code> ⇒ that one (the handshake is completed and queued for <code>accept()</code>).</li>
<li>Otherwise ⇒ <code>'RST'</code> (for a SYN the client reports "connection refused"). A segment that is not a SYN can never be taken by a listener.</li>
</ol>
<p>Visible cases use the web server above. Hidden cases use the real API machine (127.0.0.1:4000 vs 0.0.0.0:4001 — the refused connection of the lesson) and a <b>constructed</b> table with two listeners on the same port, the wildcard one listed first.</p>`,
  vi: `<p>Một cổng, nhiều cuộc hội thoại. Các socket của web server khi có ba kết nối đang mở (lab/out/c14-web):</p>${pre(WEB_A)}<p>Viết <code>demux(seg, sockets)</code> làm đúng việc kernel làm với một segment TCP vừa đến. <code>seg = { src, sport, dst, dport, syn }</code>; mỗi socket là <code>{ id, state: 'LISTEN' | 'ESTAB', local: 'ip:port', remote: 'ip:port' }</code> viết như ss in. Trả <code>id</code> của socket nhận segment, hoặc <code>'RST'</code>:</p>
<ol>
<li>Socket <code>ESTAB</code> có <code>local</code> là <code>dst:dport</code> và <code>remote</code> là <code>src:sport</code> ⇒ socket đó (dữ liệu vào bộ đệm của nó).</li>
<li>Ngược lại, nếu segment là <b>SYN</b>: socket <code>LISTEN</code> đúng trên <code>dst:dport</code> ⇒ socket đó; không thì socket <code>LISTEN</code> trên <code>0.0.0.0:dport</code> ⇒ socket đó (bắt tay hoàn tất và xếp hàng chờ <code>accept()</code>).</li>
<li>Còn lại ⇒ <code>'RST'</code> (với SYN thì client báo "connection refused"). Segment không phải SYN không bao giờ được socket nghe nhận.</li>
</ol>
<p>Ca hiện dùng web server ở trên. Ca ẩn dùng máy API thật (127.0.0.1:4000 vs 0.0.0.0:4001 — kết nối bị từ chối trong bài) và một bảng <b>dựng</b> có hai socket nghe cùng cổng, socket đại diện in trước.</p>`,
  dauVao: ['seg — { src, sport, dst, dport, syn }; sockets — an array of { id, state, local, remote }.', 'seg — { src, sport, dst, dport, syn }; sockets — mảng { id, state, local, remote }.'],
  dauRa: ['A socket id (string) or \'RST\'.', 'Một id socket (chuỗi) hoặc \'RST\'.'],
  goiY: [['Build the two strings first: dst + ":" + dport and src + ":" + sport; then compare with ===.', 'Dựng hai chuỗi trước: dst + ":" + dport và src + ":" + sport; rồi so bằng ===.'], ['Do the exact-connection loop over ALL sockets before looking at listeners. Among listeners, remember the 0.0.0.0 one but keep looking for an exact address.', 'Chạy vòng tìm kết nối khớp đúng trên TẤT CẢ socket trước khi xét socket nghe. Trong các socket nghe, nhớ cái 0.0.0.0 nhưng tiếp tục tìm cái đúng địa chỉ.'], ['Check syn before giving anything to a listener.', 'Kiểm syn trước khi giao bất cứ thứ gì cho socket nghe.']],
  loi: [['Matching by local port only: every segment for :80 goes to the first socket in the list.', 'Chỉ khớp theo cổng cục bộ: mọi segment cho :80 đều vào socket đầu danh sách.'], ['Returning the listener for a non-SYN segment of an unknown connection (the kernel resets it).', 'Trả socket nghe cho segment không phải SYN của một kết nối lạ (kernel sẽ reset nó).'], ['Taking the first listener found: 0.0.0.0:8080 then beats 10.10.2.20:8080 just because it is listed first.', 'Lấy socket nghe gặp đầu tiên: 0.0.0.0:8080 khi đó thắng 10.10.2.20:8080 chỉ vì in trước.']],
  gt: ['The kernel keeps conversations apart by all four addresses and ports, so an existing connection is always found first, whatever the order of the table. Only a SYN is allowed to create a new connection, and the most specific listener wins — which is how 127.0.0.1:4000 and 10.10.2.20:4000 can coexist. A SYN to 10.10.2.20:4000 matches neither 127.0.0.1:4000 nor a wildcard, so the answer is a reset: exactly the "Connection refused" that nc printed from the client.', 'Kernel tách các cuộc hội thoại bằng đủ bốn địa chỉ và cổng, nên kết nối đã có luôn được tìm ra trước, bất kể thứ tự trong bảng. Chỉ SYN được tạo kết nối mới, và socket nghe cụ thể nhất thắng — nhờ thế 127.0.0.1:4000 và 10.10.2.20:4000 có thể cùng tồn tại. SYN tới 10.10.2.20:4000 không khớp 127.0.0.1:4000 lẫn socket đại diện nào, nên câu trả lời là reset: đúng cái "Connection refused" mà nc in ra ở client.'],
  kn: ['demultiplexing', 'sockets', 'RST'],
  tns: [tn('demultiplexing', 'phân kênh', 'Chọn đúng socket cho dữ liệu vừa đến.'), tn('4-tuple', 'bộ bốn', 'IP và cổng của cả hai đầu.'), tn('SYN', 'gói mở kết nối'), tn('RST', 'gói đặt lại kết nối')],
  dau: `/**
 * seg = { src, sport, dst, dport, syn }
 * sockets = [{ id, state: 'LISTEN' | 'ESTAB', local: 'ip:port', remote: 'ip:port' }]
 * Return the id of the socket that receives seg, or 'RST'.
 */
function demux(seg, sockets) {
  // Write your solution here
  return 'RST';
}
`,
  giai: '// Reference solution\n' + nguon(demux),
  cases: [
    { goi: goi('demux', sg('10.10.1.10', 40042, '10.10.2.10', 80, false), WEB_S) },
    { goi: goi('demux', sg('10.10.1.11', 38458, '10.10.2.10', 80, false), WEB_S) },
    { goi: goi('demux', sg('10.10.1.10', 41182, '10.10.2.10', 80, true), WEB_S) },
    { goi: goi('demux', sg('10.10.1.10', 41182, '10.10.2.10', 80, false), WEB_S) },
    { goi: goi('demux', sg('10.10.1.10', 40034, '10.10.2.10', 80, false), WEB_S), an: true },
    { goi: goi('demux', sg('10.10.1.11', 40042, '10.10.2.10', 80, false), WEB_S), an: true },
    { goi: goi('demux', sg('10.10.1.10', 41190, '10.10.2.10', 443, true), WEB_S), an: true },
    { goi: goi('demux', sg('10.10.2.10', 45000, '10.10.2.20', 4000, true), API_S), an: true },
    { goi: goi('demux', sg('127.0.0.1', 45001, '127.0.0.1', 4000, true), API_S), an: true },
    { goi: goi('demux', sg('10.10.2.10', 45002, '10.10.2.20', 4001, true), API_S), an: true },
    { goi: goi('demux', sg('10.10.2.10', 34220, '10.10.2.20', 3000, true), API_S), an: true },
    { goi: goi('demux', sg('10.10.2.10', 50000, '10.10.2.20', 8080, true), MIX), an: true },
    { goi: goi('demux', sg('127.0.0.1', 50001, '127.0.0.1', 8080, true), MIX), an: true },
    { goi: goi('demux', sg('10.10.2.10', 51515, '10.10.2.20', 8080, false), MIX), an: true },
  ],
});

export default doiDau({ slug: 'netdev-1-4-cong-socket', ten: '1.5 Ports and sockets', khoa: KHOA, baiHoc: 'netdev-1-4-cong-socket', de: [E1, E2, E3, E4, E5, E6] });
