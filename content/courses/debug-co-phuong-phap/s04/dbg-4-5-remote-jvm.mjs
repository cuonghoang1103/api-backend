/**
 * 4.5 — Debug JVM từ xa qua JDWP: container Docker và máy test (soạn 24/11/2026).
 * Output THẬT: container dbg-java (eclipse-temurin:21-jdk, Temurin 21.0.13.1) chạy jar LabFlow; address=5005 (JDK 9+) chỉ nghe 127.0.0.1 trong
 * container ⇒ "Connection reset" từ máy chủ; address=*:5005 + -p 127.0.0.1:45006:5005 ⇒ jdb attach được; JAVA_TOOL_OPTIONS; suspend=y treo chờ;
 * zsh báo "no matches found" khi không đặt nháy quanh address=*:5005. Góc hacker chạy THẬT vào container của chính mình: bắt tay JDWP-Handshake,
 * rồi print Runtime.exec("id") ⇒ uid=0(root). Sự cố có nguồn: Wiz Research 07/2025 (JDWP lộ ra Internet bị cài XMRig trong vài giờ), jdwp-shellifier (IOActive).
 * SSH tunnel: KHÔNG chạy được trên máy soạn (không có máy chủ SSH thử) — ghi rõ trong bài. Phiên: s45.txt, container.sh.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { CONTAINER } from './_ma-4.mjs';

const ma = (s, lang = 'java') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const OUT_MAC_DINH = `<div class="out">$ docker run -d --name dbg-java … -p 127.0.0.1:45006:5005 eclipse-temurin:21-jdk \\
    java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -jar /app/app.jar
$ docker logs dbg-java | head -1
Listening for transport dt_socket at address: 5005
$ jdb -attach 127.0.0.1:45006
java.net.SocketException: Connection reset                    ← the port is published, but nobody answers
$ docker exec dbg-java cat /proc/net/tcp | head -2
  sl  local_address rem_address   st …
   0: 0100007F:138D 00000000:0000 0A …                         ← 0100007F = 127.0.0.1, 138D = 5005, 0A = LISTEN
                                    ← since JDK 9, address=5005 means localhost:5005 — inside the container</div>`;

const OUT_ATTACH = `<div class="out">$ ./container.sh
$ docker logs dbg-java | head -1
Listening for transport dt_socket at address: 5005
$ docker port dbg-java
5005/tcp -&gt; 127.0.0.1:45006
8080/tcp -&gt; 127.0.0.1:48090
$ jdb -sourcepath src/main/java -attach 127.0.0.1:45006
&gt; stop at vn.labflow.service.HoaDonService:17
                                    # curl -s 127.0.0.1:48090/api/dat-cho/1/hoa-don
Breakpoint hit: "thread=http-nio-0.0.0.0-8080-exec-1", vn.labflow.service.HoaDonService.tinh(), line=17 bci=8
17        long tamTinh = d.getSoPhut() / 60 * giaGio;
exec-1[1] print d.getSoPhut()
 d.getSoPhut() = 90
exec-1[1] print java.lang.System.getProperty("java.version")
 java.lang.System.getProperty("java.version") = "21.0.13.1"          ← the container's JVM, not your JDK 25</div>`;

const OUT_JTO = `<div class="out">$ docker run --rm --network none \\
    -e JAVA_TOOL_OPTIONS='-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005' \\
    eclipse-temurin:21-jdk java -version
Picked up JAVA_TOOL_OPTIONS: -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
Listening for transport dt_socket at address: 5005
openjdk version "21.0.13.1" 2026-11-17 LTS

$ docker run --rm eclipse-temurin:21-jdk java -agentlib:jdwp=…,suspend=y,address=*:5005 -version     # in zsh, unquoted:
zsh: no matches found: -agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=*:5005
$ timeout 8 docker run --rm eclipse-temurin:21-jdk java '-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=*:5005' -version
Listening for transport dt_socket at address: 5005
                                    ← 8 s later: still nothing. suspend=y waits for a debugger before running main()</div>`;

const MA_COMPOSE = `<pre><code class="language-yaml"># compose.debug.yaml — used ONLY with:  docker compose -f compose.yaml -f compose.debug.yaml up
services:
  api:
    environment:
      JAVA_TOOL_OPTIONS: "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"
    ports:
      - "127.0.0.1:5005:5005"        # host side: loopback only</code></pre>`;

const MA_SSH = `<pre><code class="language-bash"># Test server: the JVM listens on ITS loopback only:  -agentlib:jdwp=…,address=127.0.0.1:5005
# Your laptop: forward local 5005 to the server's 127.0.0.1:5005 over SSH (encrypted, needs your SSH key)
ssh -N -L 5005:127.0.0.1:5005 ban@test-server.congty.vn
# IntelliJ Remote JVM Debug → host localhost, port 5005. Close the tunnel (Ctrl+C) when done.</code></pre>`;

const OUT_RCE = `<div class="out">$ python3 -c "import socket; s=socket.create_connection(('127.0.0.1',45006)); s.sendall(b'JDWP-Handshake'); print(repr(s.recv(64)))"
b'JDWP-Handshake'                   ← 14 bytes is all a scanner needs to know a JVM is debuggable here

$ jdb -attach 127.0.0.1:45006       # no password, no TLS, no user name: JDWP has none
&gt; stop at vn.labflow.service.HoaDonService:17       (any request will do)
exec-1[1] print java.lang.System.getenv("HOSTNAME")
 java.lang.System.getenv("HOSTNAME") = "ce5d32d48bda"
exec-1[1] print new java.lang.String(java.lang.Runtime.getRuntime().exec("id").getInputStream().readAllBytes())
 … = "uid=0(root) gid=0(root) groups=0(root)
"
exec-1[1] print new java.lang.String(java.lang.Runtime.getRuntime().exec("cat /etc/hostname").getInputStream().readAllBytes())
 … = "ce5d32d48bda
"                                   ← any command, as the user running the JVM (root in this image)</div>`;

const NGUON = [
  nguon('🧠', 'IntelliJ IDEA — Remote debug (Remote JVM Debug configuration)', 'Tạo cấu hình, sinh dòng -agentlib, chọn module để khớp mã nguồn.', 'https://www.jetbrains.com/help/idea/tutorial-remote-debug.html'),
  nguon('☕', 'Oracle — JDWP agent options (transport, server, suspend, address)', 'Từ JDK 9, address chỉ có cổng ⇒ chỉ nghe localhost; dùng *:cổng để nghe mọi giao diện.', 'https://docs.oracle.com/en/java/javase/25/docs/specs/jpda/conninv.html#oracle-vm-invocation-options'),
  nguon('🕵️', 'Wiz Research — Exposed JDWP Exploited in the Wild (07/2025)', 'Honeypot TeamCity có JDWP lộ ra bị khai thác trong vài giờ: dropper cài XMRig giả tên logrotate, cron giữ chỗ; hơn 6.000 IP quét JDWP trong 90 ngày (GreyNoise).', 'https://www.wiz.io/blog/exposed-jdwp-exploited-in-the-wild'),
  nguon('📰', 'The Hacker News — Exposed JDWP interfaces lead to crypto mining (07/2025)', 'Tóm tắt báo cáo Wiz, kèm botnet Hpingbot.', 'https://thehackernews.com/2025/07/alert-exposed-jdwp-interfaces-lead-to.html'),
  nguon('🛠️', 'IOActive — jdwp-shellifier', 'Công cụ công khai từ 2014: biến một cổng JDWP mở thành shell. Có từ lâu, nên quét tự động là chuyện thường.', 'https://github.com/IOActive/jdwp-shellifier'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-3-4-attach', title: 'Bài 3.4 — attach Node.js và cổng 9229', sub: 'Cùng bài học bảo mật ở phía Node: inspector mở = chạy mã tuỳ ý.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-13-2-hot-reload-debug', title: 'Docker 13.2 — debugger trong container', sub: 'Compose, volume, hot reload; bài này chỉ thêm phần JVM.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '4.5 — Remote JVM debugging over JDWP: Docker containers and test servers|||4.5 — Debug JVM từ xa qua JDWP: container Docker và máy test',
  slug: 'dbg-4-5-remote-jvm',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Giải nghĩa từng phần -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005; bẫy JDK 9+ (address=5005 chỉ nghe localhost trong container ⇒ Connection reset), bẫy zsh với dấu *, suspend=y treo chờ debugger; attach vào LabFlow trong Docker, JAVA_TOOL_OPTIONS và tệp compose chỉ dùng khi debug, cấu hình Remote JVM Debug của IntelliJ, đường hầm SSH tới máy test. Góc hacker chạy thật: bắt tay JDWP rồi chạy lệnh id ra root; Wiz 2025 — JDWP lộ ra Internet bị cài máy đào tiền ảo trong vài giờ. Không bao giờ trên production.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>The bug only happens on the test server — debug the JVM that is there</h2>
<p class="lead">"It works on my machine" usually means a different JDK, time zone, configuration or data on the server. When reproducing locally fails, you attach the debugger to the JVM that has the bug — in a container, or on the team's test server. The same feature, left on by mistake, is one of the easiest ways to lose a server. This lesson does both sides for real.</p>

<h3>An everyday picture: the spare key under the doormat</h3>
<p>A JDWP port is a key that opens every room of the house, with no lock of its own. Leaving it under the doormat while you are home fixing the plumbing is convenient. Leaving it there when you go on holiday — or on the street side of the fence — is how burglars get in, and they do check doormats systematically.</p>

<h3>1. The flag, word by word</h3>
${ma(`-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
#              │                   │        │         └ where to listen: host:port (* = all interfaces)
#              │                   │        └ y = wait for a debugger before main(); n = start normally
#              │                   └ y = the JVM listens, the debugger connects (n = the JVM connects out)
#              └ TCP socket`, 'bash')}
<p>Two traps measured on this machine:</p>
${OUT_MAC_DINH}
<p>Since JDK 9, <code>address=5005</code> means <code>localhost:5005</code>. That is a good default on a laptop, but inside a container "localhost" is the container itself, so Docker's port forwarding reaches nothing. In a container you need <code>address=*:5005</code> (or <code>0.0.0.0:5005</code>) — and then the protection must come from <em>publishing only on the host's loopback</em>:</p>
${ma(CONTAINER, 'bash')}
${OUT_ATTACH}

<h3>2. In IntelliJ: Remote JVM Debug</h3>
<p><em>Run → Edit Configurations → + → Remote JVM Debug.</em> Debugger mode "Attach to remote JVM", host <code>127.0.0.1</code>, port <code>45006</code>, and "Use module classpath" set to your module so the breakpoints match your source. IntelliJ shows the exact <code>-agentlib</code> line to paste into the server's start command. Click Debug: the Console shows "Connected to the target VM, address: '127.0.0.1:45006', transport: 'socket'". The source on your disk must be the same version as the jar running remotely — otherwise breakpoints land on the wrong lines (check the git commit or the image tag first).</p>

<h3>3. Turning it on without changing the image</h3>
${OUT_JTO}
<p><code>JAVA_TOOL_OPTIONS</code> is read by every JVM and announced with "Picked up…" — handy, and also a reason to grep for it when reviewing deployments. In Docker Compose, put it in a separate override file that is only used on purpose:</p>
${MA_COMPOSE}
<p>Use <code>suspend=y</code> only when the bug is at start-up (a bean that fails during context refresh): the JVM waits until you attach. Never on a server others use — if your laptop disconnects, the service simply never starts. Note the zsh trap above: <code>*</code> is a glob in zsh (macOS default shell); put the whole option in quotes.</p>

<h3>4. A test server: SSH tunnel, never an open port</h3>
<p>On a shared test server, keep JDWP on the server's loopback and reach it through SSH:</p>
${MA_SSH}
<p>(This command could not be run for this lesson — the authoring machine has no SSH test server. It is the standard <code>ssh -L</code> local forward; you will use it on your OJT project's servers.) The tunnel is encrypted and requires an SSH account, which JDWP itself never asks for.</p>

<h3>🕵️ Hacker corner — an open JDWP port = remote code execution</h3>
<p>JDWP has no authentication and no encryption. Anyone who can open a TCP connection to the port can do what your debugger can — including Evaluate. Done for real against our own container:</p>
${OUT_RCE}
<p><strong>Real incident: Wiz Research, July 2025.</strong> Wiz put a TeamCity server with JDWP exposed on the Internet as a honeypot; it was exploited within hours. The attackers scanned for the JDWP handshake, then ran a dropper that installed a modified XMRig cryptominer disguised as <code>logrotate</code>, killed competing miners and set up cron persistence. GreyNoise data showed more than 6,000 IPs scanning for JDWP in 90 days. Tools to do this have been public since 2014 (IOActive's <code>jdwp-shellifier</code>).</p>
<p><strong>Rules you can apply today:</strong></p>
<ol>
<li>Never on production. Production bugs: logs, metrics, thread dumps, a reproduction (chapter 10) — not a debugger that freezes threads for real users.</li>
<li>Containers: <code>address=*:5005</code> inside, <code>-p 127.0.0.1:…:5005</code> outside. Never <code>-p 5005:5005</code> — Docker publishes on every interface and its rules bypass many host firewalls.</li>
<li>Servers: listen on <code>127.0.0.1</code>, reach through <code>ssh -L</code>, close the tunnel when done.</li>
<li>Remove debug options from the start command after the session; review Dockerfiles, Compose files and <code>JAVA_TOOL_OPTIONS</code> for "jdwp".</li>
<li>Do not run the JVM as root in the image — it limits what the attacker gets (the Temurin image runs as root by default, as you saw).</li>
</ol>

<h3>Workplace situation</h3>
<p>Your bug only appears on the client's UAT server. You do not have SSH access there — and that is normal in outsourcing. Do not ask the client's admin to "open port 5005". Ask for logs at a specific level and time window, the exact build/commit deployed, and the configuration (without secrets); reproduce with the same JDK and time zone in a local container (lab 4.6 does exactly this). If a debug session is truly needed, request it in writing: time slot, internal network only, SSH tunnel, debug flag removed afterwards.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<ol>
<li>Run the container with <code>address=5005</code>, observe "Connection reset" and the listening address in <code>/proc/net/tcp</code>. Restart with <code>address=*:5005</code>.</li>
<li>Create a Remote JVM Debug configuration in IntelliJ, attach to 127.0.0.1:45006, stop in <code>tinh</code>, evaluate <code>System.getProperty("java.version")</code> and <code>java.time.ZoneId.systemDefault()</code>.</li>
<li>Write the <code>compose.debug.yaml</code> override for your own project.</li>
<li>Against your own container only: the handshake check and the <code>id</code> evaluation. Then run the container as a non-root user (<code>--user 1000</code>) and repeat.</li>
<li>Clean up: <code>docker rm -f dbg-java</code>.</li>
</ol>
<p><strong>Done when:</strong> you can attach to a JVM in a container with breakpoints matching your source, and you can explain in two sentences why 5005 must never be reachable from outside.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">-agentlib:jdwp</span><span class="v">Loads the JVM debug agent with transport, server, suspend, address.</span></div>
  <div class="kv"><span class="k">suspend=y</span><span class="v">The JVM waits for a debugger before running main().</span></div>
  <div class="kv"><span class="k">JAVA_TOOL_OPTIONS</span><span class="v">Environment variable whose options every JVM picks up.</span></div>
  <div class="kv"><span class="k">Remote JVM Debug</span><span class="v">IntelliJ configuration that attaches to a listening JVM.</span></div>
  <div class="kv"><span class="k">ssh -L</span><span class="v">Local port forward through an encrypted SSH connection.</span></div>
  <div class="kv"><span class="k">JDWP-Handshake</span><span class="v">The 14-byte greeting scanners use to find debuggable JVMs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>address=5005 is localhost-only since JDK 9; in a container use *:5005 and publish on 127.0.0.1.</li>
<li>suspend=y only for start-up bugs, never on shared servers.</li>
<li>Source on your disk must match the remote build.</li>
<li>Remote servers: SSH tunnel; production: never.</li>
<li>An open JDWP port is remote code execution — exploited in the wild within hours (Wiz, 2025).</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Lỗi chỉ xảy ra trên máy test — hãy debug đúng JVM ở đó</h2>
<p class="lead">"Máy em chạy được" thường có nghĩa là trên server khác JDK, khác múi giờ, khác cấu hình hoặc khác dữ liệu. Khi tái hiện ở máy mình không được, bạn gắn debugger vào chính JVM đang có lỗi — trong container, hoặc trên server test của nhóm. Cũng tính năng đó, nếu lỡ để bật, là một trong những cách dễ nhất để mất cả server. Bài này làm thật cả hai mặt.</p>

<h3>Liên tưởng đời thường: chìa khoá dự phòng dưới thảm chùi chân</h3>
<p>Cổng JDWP là chiếc chìa mở được mọi phòng trong nhà, và bản thân nó không có ổ khoá nào. Để dưới thảm khi bạn đang ở nhà sửa ống nước thì tiện. Để đó khi đi du lịch — hoặc đặt thảm ra phía ngoài hàng rào — là cách trộm vào nhà, và trộm thì kiểm thảm chùi chân rất có hệ thống.</p>

<h3>1. Cờ khởi động, từng chữ một</h3>
${ma(`-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
#              │                   │        │         └ nghe ở đâu: host:cổng (* = mọi giao diện mạng)
#              │                   │        └ y = chờ debugger rồi mới chạy main(); n = chạy bình thường
#              │                   └ y = JVM lắng nghe, debugger kết nối vào (n = JVM tự kết nối ra)
#              └ socket TCP`, 'bash')}
<p>Hai cái bẫy đo được trên máy này:</p>
${OUT_MAC_DINH}
<p>Từ JDK 9, <code>address=5005</code> nghĩa là <code>localhost:5005</code>. Trên laptop đó là mặc định tốt, nhưng trong container "localhost" là chính container, nên chuyển cổng của Docker chẳng tới được đâu. Trong container phải dùng <code>address=*:5005</code> (hoặc <code>0.0.0.0:5005</code>) — và khi đó lớp bảo vệ phải đến từ việc <em>chỉ publish trên loopback của máy chủ</em>:</p>
${ma(CONTAINER, 'bash')}
${OUT_ATTACH}

<h3>2. Trong IntelliJ: Remote JVM Debug</h3>
<p><em>Run → Edit Configurations → + → Remote JVM Debug.</em> Debugger mode "Attach to remote JVM", host <code>127.0.0.1</code>, port <code>45006</code>, và "Use module classpath" chọn module của bạn để breakpoint khớp mã nguồn. IntelliJ hiện sẵn dòng <code>-agentlib</code> để dán vào lệnh khởi động trên server. Bấm Debug: Console in "Connected to the target VM, address: '127.0.0.1:45006', transport: 'socket'". Mã nguồn trên đĩa của bạn phải cùng phiên bản với jar đang chạy ở xa — nếu không breakpoint sẽ rơi sai dòng (kiểm commit git hoặc tag image trước).</p>

<h3>3. Bật mà không phải sửa image</h3>
${OUT_JTO}
<p><code>JAVA_TOOL_OPTIONS</code> được mọi JVM đọc và báo bằng dòng "Picked up…" — tiện, và cũng là lý do phải grep nó khi review cấu hình deploy. Với Docker Compose, đặt nó trong một tệp override riêng, chỉ dùng khi chủ ý:</p>
${MA_COMPOSE}
<p>Chỉ dùng <code>suspend=y</code> khi lỗi xảy ra lúc khởi động (một bean hỏng trong lúc refresh context): JVM chờ tới khi bạn gắn vào. Không bao giờ dùng trên server người khác đang dùng — laptop bạn mất kết nối là dịch vụ không bao giờ lên. Chú ý bẫy zsh ở trên: <code>*</code> là ký tự glob trong zsh (shell mặc định của macOS); hãy đặt cả tuỳ chọn trong dấu nháy.</p>

<h3>4. Server test: đường hầm SSH, không bao giờ mở cổng</h3>
<p>Trên server test dùng chung, giữ JDWP ở loopback của server và đi tới nó qua SSH:</p>
${MA_SSH}
<p>(Lệnh này không chạy được khi soạn bài — máy soạn không có server SSH để thử. Đây là chuyển cổng cục bộ <code>ssh -L</code> chuẩn; bạn sẽ dùng nó trên server của dự án OJT.) Đường hầm được mã hoá và cần tài khoản SSH — thứ mà bản thân JDWP không bao giờ hỏi.</p>

<h3>🕵️ Góc hacker — cổng JDWP mở = chạy mã từ xa</h3>
<p>JDWP không có xác thực, không có mã hoá. Ai mở được kết nối TCP tới cổng đều làm được mọi việc debugger của bạn làm — kể cả Evaluate. Làm thật vào container của chính chúng ta:</p>
${OUT_RCE}
<p><strong>Sự cố thật: Wiz Research, tháng 7/2025.</strong> Wiz đặt một server TeamCity để lộ JDWP ra Internet làm bẫy; nó bị khai thác chỉ sau vài giờ. Kẻ tấn công quét tìm lời bắt tay JDWP, rồi chạy một dropper cài máy đào tiền ảo XMRig đã sửa, giả tên <code>logrotate</code>, giết các máy đào cạnh tranh và dùng cron để bám trụ. Dữ liệu GreyNoise cho thấy hơn 6.000 IP quét JDWP trong 90 ngày. Công cụ làm việc này đã công khai từ 2014 (<code>jdwp-shellifier</code> của IOActive).</p>
<p><strong>Quy tắc áp dụng được ngay hôm nay:</strong></p>
<ol>
<li>Không bao giờ trên production. Lỗi production: log, metric, thread dump, bản tái hiện (chương 10) — không phải một debugger làm đứng luồng của người dùng thật.</li>
<li>Container: <code>address=*:5005</code> bên trong, <code>-p 127.0.0.1:…:5005</code> bên ngoài. Không bao giờ <code>-p 5005:5005</code> — Docker publish trên mọi giao diện mạng và luật của nó đi vòng qua nhiều tường lửa máy chủ.</li>
<li>Server: nghe ở <code>127.0.0.1</code>, đi qua <code>ssh -L</code>, đóng đường hầm khi xong.</li>
<li>Gỡ tuỳ chọn debug khỏi lệnh khởi động sau phiên debug; khi review Dockerfile, tệp Compose và <code>JAVA_TOOL_OPTIONS</code> thì tìm chữ "jdwp".</li>
<li>Đừng chạy JVM bằng root trong image — nó giới hạn thứ kẻ tấn công lấy được (image Temurin mặc định chạy root, như bạn đã thấy).</li>
</ol>

<h3>Tình huống đi làm</h3>
<p>Lỗi của bạn chỉ xuất hiện trên server UAT của khách. Bạn không có quyền SSH vào đó — ở công ty outsourcing chuyện này bình thường. Đừng nhờ admin bên khách "mở cổng 5005". Hãy xin log ở mức và khoảng thời gian cụ thể, đúng bản build/commit đang deploy, và cấu hình (đã bỏ bí mật); tái hiện bằng cùng JDK và múi giờ trong container ở máy mình (lab 4.6 làm đúng việc này). Nếu thật sự cần một phiên debug, đề nghị bằng văn bản: khung giờ, chỉ mạng nội bộ, đường hầm SSH, gỡ cờ debug sau đó.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy container với <code>address=5005</code>, quan sát "Connection reset" và địa chỉ đang nghe trong <code>/proc/net/tcp</code>. Chạy lại với <code>address=*:5005</code>.</li>
<li>Tạo cấu hình Remote JVM Debug trong IntelliJ, gắn vào 127.0.0.1:45006, dừng trong <code>tinh</code>, evaluate <code>System.getProperty("java.version")</code> và <code>java.time.ZoneId.systemDefault()</code>.</li>
<li>Viết tệp override <code>compose.debug.yaml</code> cho dự án của chính bạn.</li>
<li>Chỉ với container của mình: kiểm bắt tay và evaluate lệnh <code>id</code>. Rồi chạy container bằng người dùng không phải root (<code>--user 1000</code>) và làm lại.</li>
<li>Dọn: <code>docker rm -f dbg-java</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gắn được vào JVM trong container với breakpoint khớp mã nguồn, và giải thích được trong hai câu vì sao cổng 5005 không bao giờ được với tới từ bên ngoài.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">-agentlib:jdwp</span><span class="v">Nạp agent debug của JVM với transport, server, suspend, address.</span></div>
  <div class="kv"><span class="k">suspend=y</span><span class="v">JVM chờ debugger rồi mới chạy main().</span></div>
  <div class="kv"><span class="k">JAVA_TOOL_OPTIONS</span><span class="v">Biến môi trường mà mọi JVM đều đọc tuỳ chọn từ đó.</span></div>
  <div class="kv"><span class="k">Remote JVM Debug</span><span class="v">Cấu hình IntelliJ để gắn vào một JVM đang lắng nghe.</span></div>
  <div class="kv"><span class="k">ssh -L</span><span class="v">Chuyển cổng cục bộ qua kết nối SSH đã mã hoá.</span></div>
  <div class="kv"><span class="k">JDWP-Handshake</span><span class="v">Lời chào 14 byte mà máy quét dùng để tìm JVM debug được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Từ JDK 9, address=5005 chỉ nghe localhost; trong container dùng *:5005 và publish trên 127.0.0.1.</li>
<li>suspend=y chỉ cho lỗi lúc khởi động, không bao giờ trên server dùng chung.</li>
<li>Mã nguồn trên đĩa phải khớp bản build ở xa.</li>
<li>Server ở xa: đường hầm SSH; production: không bao giờ.</li>
<li>Cổng JDWP mở là chạy mã từ xa — bị khai thác ngoài đời trong vài giờ (Wiz, 2025).</li>
</ul>
${NGUON}
</div>
`,
};
