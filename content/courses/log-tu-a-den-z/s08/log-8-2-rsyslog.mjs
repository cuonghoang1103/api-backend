/**
 * 8.2 — Giao thức syslog và rsyslog (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s08/rsyslog'] — lab7 (Ubuntu 24.04, rsyslog 8.2312.0) gửi tới máy chủ log trung tâm lgz-logsrv
 * (container Ubuntu 24.04 chung mạng với máy ảo, lab7 thấy nó ở 10.0.2.2; cấu hình _demo/s08/logsrv/). Rocky 9 trong docker run --rm.
 * Nguồn: RFC 3164, RFC 5424, RFC 5425 (TLS, cổng 6514); rsyslog docs omfwd/omrelp/queues; Rainer Gerhards (2008)
 * "On the (un)reliability of plain tcp syslog"; MITRE ATT&CK T1562.006.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '8.2 — The syslog protocol and rsyslog: selectors, templates, remote forwarding over TCP/TLS, imjournal|||8.2 — Giao thức syslog và rsyslog: selector, template, chuyển log đi xa qua TCP/TLS, imjournal',
  slug: 'log-8-2-rsyslog',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dòng log đi từ ứng dụng tới /var/log và sang máy chủ log trung tâm như thế nào: /dev/log, journald ForwardToSyslog (Ubuntu) so với imjournal (Rocky). Đọc PRI <155> = facility × 8 + severity, viết selector (local3.warning, .=debug, stop), template JSON. Thí nghiệm thật: UDP mất 199 783/200 000 dòng khi máy nhận đơ, TCP thì chặn bên gửi; luật đặt sai thứ tự tệp làm log không đi; RFC 3164 làm lệch 7 giờ; máy nhận tắt — hàng đợi giữ lại và gửi bù; RELP; TLS 6514 với AppArmor chặn và kiểm tên chứng chỉ. Góc hacker: token rõ chữ trên đường truyền.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>syslog and rsyslog: from one line to a central log server</h2>
<p class="lead">syslog is two things: a <strong>message format</strong> (RFC 3164 from 2001, RFC 5424 from 2009) and the <strong>daemon</strong> that routes messages to files or other machines. On most Linux servers that daemon is rsyslog. In this lesson lab7 sends logs to a central log server (<code>lgz-logsrv</code>, reachable at 10.0.2.2) and we break the path on purpose: overload, wrong file order, wrong time zone, server down, TLS blocked.</p>

<h3>The everyday picture: the post office</h3>
<p>A letter has an envelope (who, when, how urgent) and contents. The post office sorts by the envelope only: "urgent letters from the accounting department go to box A". syslog's envelope is <code>&lt;PRI&gt;</code> + time + host + program; rsyslog is the sorting office; a remote log server is the archive in another city. UDP is a postcard thrown in the box: no receipt. TCP is a registered letter. TLS is a sealed envelope.</p>

<h3>Step 1 — how a line reaches rsyslog</h3>
${lenh('s08/rsyslog', 0)}
${lenh('s08/rsyslog', 1)}
${lenh('s08/rsyslog', 2)}
<p>On Ubuntu, <code>/dev/log</code> belongs to <strong>journald</strong>. Every program that calls <code>syslog()</code> talks to journald; journald stores it and, because of <code>ForwardToSyslog=yes</code> (a drop-in shipped by the distribution), passes a copy to the socket <code>/run/systemd/journal/syslog</code> that rsyslog's <code>imuxsock</code> reads. Rocky 9 does it the other way:</p>
${lenh('s08/rsyslog', 50)}
<p>On Rocky, rsyslog loads <code>imjournal</code> and <em>reads the journal files</em>. Same result, different failure modes: with imjournal, a corrupted journal or a big backlog delays text logs; with ForwardToSyslog, journald's rate limit (7.4) applies before rsyslog sees anything. Know which one you have before you debug "missing lines".</p>

<h3>Step 2 — PRI, facility, severity</h3>
<p>The number at the start of a raw syslog message is <code>PRI = facility × 8 + severity</code>. Facilities: <code>kern</code>=0, <code>user</code>=1, <code>daemon</code>=3, <code>auth</code>=4, <code>authpriv</code>=10, <code>cron</code>=9, <code>local0</code>…<code>local7</code>=16…23 (free for your applications). Severities: <code>emerg</code>=0 … <code>err</code>=3, <code>warning</code>=4, <code>notice</code>=5, <code>info</code>=6, <code>debug</code>=7. You will see <code>&lt;155&gt;</code> below: 155 = 19 × 8 + 3 = <strong>local3.err</strong>; <code>&lt;30&gt;</code> = 3 × 8 + 6 = <strong>daemon.info</strong>.</p>

<h3>Step 3 — selectors and templates: a config for the "shop" app</h3>
${lenh('s08/rsyslog', 3)}
${lenh('s08/rsyslog', 4)}
<p>Always validate with <code>rsyslogd -N1</code> before restarting: a typo otherwise means a daemon that starts with half its rules. Then send one line at each severity:</p>
${lenh('s08/rsyslog', 5)}
${lenh('s08/rsyslog', 6)}
${lenh('s08/rsyslog', 7)}
${lenh('s08/rsyslog', 8)}
${lenh('s08/rsyslog', 9)}
<p>Read the results against the rules: <code>local3.warning</code> means <em>warning or worse</em> (so err and crit too); <code>local3.=debug stop</code> drops debug completely; <code>stop</code> at the end keeps shop lines out of <code>/var/log/syslog</code> (count 0). The JSON file is ready for <code>jq</code> or a log shipper (Chapter 15). Note <code>"msg":" thu muc err"</code> starts with a space — the classic syslog message keeps the space after the colon; trim it in your template or parser. The program name and PID come from the tag:</p>
${lenh('s08/rsyslog', 10)}

<h3>Step 4 — send one line over the network, and read the wire</h3>
${lenh('s08/rsyslog', 11)}
<p><code>logger --server</code> sends a raw RFC 5424 message over UDP 514. tcpdump shows it <strong>in clear text</strong>: <code>&lt;155&gt;1 2026-11-24T05:11:14.597916+07:00 lab7 shop - - [timeQuality …] reset mat khau cho an@vd.vn token=GIA_TOKEN·VIDU_9f3c</code>. Anyone on the path reads the email address and the (fake) token. On the server, our template writes both the time the sender claimed and the time the server received it:</p>
${ma('text', 's08/logsrv/rsyslog.conf')}
${lenh('s08/rsyslog', 12)}

<h3>Step 5 — UDP vs TCP under load: count the missing lines</h3>
<p>A small script (<code>bom.py</code>) fires 200,000 numbered lines straight at the server. First with a healthy server:</p>
${lenh('s08/rsyslog', 13)}
${lenh('s08/rsyslog', 14)}
${lenh('s08/rsyslog', 15)}
<p>All arrived — on a quiet local link UDP often looks fine. Now freeze the server process (<code>kill -STOP</code>: it stays alive but stops reading, like a server stuck on a slow disk):</p>
${lenh('s08/rsyslog', 23)}
${lenh('s08/rsyslog', 24)}
${lenh('s08/rsyslog', 25)}
<p><strong>217 of 200,000.</strong> The rest overflowed the receive buffer and vanished. The sender was told nothing: it "sent 200000 lines in 0.30 s". Same test with TCP, server frozen for 5 seconds:</p>
${lenh('s08/rsyslog', 26)}
${lenh('s08/rsyslog', 27)}
${lenh('s08/rsyslog', 28)}
<p>Nothing lost — but look at the sender: <strong>5.05 s</strong> instead of 0.26 s. TCP pushed back and the sender <em>waited</em>. If your application wrote logs synchronously over TCP, it would have frozen for 5 seconds too. That is why rsyslog forwarding uses a <strong>queue</strong> between the app and the network (step 7).</p>

<h3>Step 6 — two traps when forwarding: file order and time zones</h3>
${lenh('s08/rsyslog', 16)}
${lenh('s08/rsyslog', 17)}
${lenh('s08/rsyslog', 18)}
<p>The <code>user</code> line arrived; the <code>local3</code> line did not. Why?</p>
${lenh('s08/rsyslog', 19)}
<p>Files in <code>rsyslog.d</code> are read in name order. <code>30-shop.conf</code> ends with <code>local3.* stop</code>, so by the time <code>90-gui-di.conf</code> is reached, local3 messages are already discarded. Rename to <code>20-</code>:</p>
${lenh('s08/rsyslog', 20)}
${lenh('s08/rsyslog', 21)}
<p>It arrives now — and shows the second trap. The server wrote <code>2026-11-24T05:11:25+00:00</code>, but the real moment was 05:11:25 <strong>+07:00</strong> (it received it at 22:11:25 UTC). The default forwarding format is old RFC 3164:</p>
${lenh('s08/rsyslog', 22)}
<p><code>&lt;30&gt;Nov 24 05:11:28 lab7 shop-api[424]: …</code> — no year, no zone, no sub-seconds. The server has to guess and uses its own zone (UTC): a 7-hour error in every forwarded line. Fix: forward with <code>template="RSYSLOG_SyslogProtocol23Format"</code> (RFC 5424), as all the next configs do.</p>

<h3>Step 7 — the server goes down: queue and retry</h3>
${lenh('s08/rsyslog', 29)}
${lenh('s08/rsyslog', 30)}
${lenh('s08/rsyslog', 31)}
${lenh('s08/rsyslog', 32)}
${lenh('s08/rsyslog', 33)}
${lenh('s08/rsyslog', 34)}
<p>While the server was down, rsyslog logged <code>action … suspended</code>, kept the three lines in its queue and delivered them when the server came back. Without <code>queue.*</code> and <code>action.resumeRetryCount="-1"</code>, those lines would have been dropped after a few retries. This run lost nothing, but plain TCP has no application-level acknowledgement: lines already handed to the kernel when the connection breaks can be lost without anyone noticing — rsyslog's author described exactly this in 2008 and wrote <strong>RELP</strong> to fix it:</p>
${lenh('s08/rsyslog', 35)}
${lenh('s08/rsyslog', 36)}
${lenh('s08/rsyslog', 37)}
${lenh('s08/rsyslog', 38)}
${lenh('s08/rsyslog', 39)}
${lenh('s08/rsyslog', 40)}
<p>RELP: the receiver confirms each message; the sender removes it from its queue only after the confirmation. The spool folder is empty because a <code>LinkedList</code> queue with a file name is <em>disk-assisted</em>: it stays in memory and writes to disk only when memory fills up or at shutdown (<code>saveOnShutdown</code>).</p>

<h3>Step 8 — TLS on port 6514, and two real errors on the way</h3>
${lenh('s08/rsyslog', 41)}
${lenh('s08/rsyslog', 42)}
${lenh('s08/rsyslog', 43)}
${lenh('s08/rsyslog', 44)}
<p>"Permission denied" as root? The kernel says why: <code>apparmor="DENIED" … profile="rsyslogd" name="/etc/rsyslog-tls/ca.pem"</code>. Ubuntu confines rsyslogd with AppArmor; a new folder for certificates is outside the profile. The fix is a local addition to the profile, not disabling AppArmor:</p>
${lenh('s08/rsyslog', 45)}
${lenh('s08/rsyslog', 46)}
${lenh('s08/rsyslog', 47)}
<p>22 packets captured, <strong>0 contain the token</strong> in clear text; the server got the line through the <code>tls</code> input. Now prove the client really checks who it talks to — change the allowed name:</p>
${lenh('s08/rsyslog', 48)}
${lenh('s08/rsyslog', 49)}
<p><code>peer name not authorized</code>: the certificate says <code>logsrv.lab</code>, we allowed only <code>logsrv.that</code>, so rsyslog refused. Encryption without name checking (<code>StreamDriverAuthMode="anon"</code>) protects against eavesdroppers but not against someone pretending to be your log server. (The warning "certificate file is not set" is about the <em>client's</em> own certificate — needed only if the server demands mutual TLS.)</p>

<h3>syslog-ng, in one paragraph</h3>
<p>syslog-ng is the other big syslog daemon (appliances, some distributions, many SIEM collectors). Same ideas, different words: <code>source</code> → <code>filter</code> → <code>destination</code>, joined by <code>log { }</code> blocks. If you can read an rsyslog rule as "which messages → which action", you can read syslog-ng.</p>

<h3>Hacker's corner: what a log pipeline leaks and accepts</h3>
<ul>
<li><strong>Leaks:</strong> step 4 — UDP/TCP syslog is plain text. Logs often contain emails, IPs, URLs with tokens, sometimes passwords (Chapter 16). On a shared network that is a data leak. Use TLS (RFC 5425, port 6514) or a VPN between sites.</li>
<li><strong>Accepts:</strong> the UDP input accepted our hand-made message from any process — the server cannot know who really sent it. An attacker can inject fake lines ("backup finished OK") or flood the server so real lines drop (step 5). TLS with client certificates and a firewall that only allows known senders reduce this.</li>
<li><strong>Silences:</strong> attackers who get root often stop or reconfigure the forwarder so the central server simply hears nothing — MITRE ATT&amp;CK <strong>T1562.006 Indicator Blocking</strong>. A central server must alert on "host X has sent nothing for 15 minutes" (Chapter 15).</li>
</ul>

<h3>Real-life situations</h3>
<ul>
<li><strong>Outsourcing ticket:</strong> "Client's SIEM receives nothing from our servers." Checklist in order: <code>rsyslogd -N1</code>; file order in <code>rsyslog.d</code> and any <code>stop</code>; <code>journalctl -u rsyslog</code> for <code>suspended</code>/TLS errors; <code>journalctl -k | grep DENIED</code> (AppArmor/SELinux); firewall; certificate name; then tcpdump on the port.</li>
<li><strong>"Times on the central server are 7 hours off":</strong> the sender uses RFC 3164. Switch to RFC 5424 template; never "fix" it by changing the server's zone.</li>
<li><strong>Router at home</strong> (Chapter 11): routers can only send UDP 514 RFC 3164 — accept them on a separate input/ruleset and write <code>timegenerated</code> next to the claimed time.</li>
</ul>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok"><ol>
<li>Write <code>/etc/rsyslog.d/25-myapp.conf</code>: <code>local5.info</code> and above to <code>/var/log/myapp.log</code>, <code>local5.err</code> and above also to <code>/var/log/myapp-err.log</code>, and keep local5 out of syslog. Validate with <code>rsyslogd -N1</code>, test with <code>logger -p local5.…</code>.</li>
<li>Compute the PRI for <code>auth.warning</code> and <code>local7.debug</code>, then check with <code>logger --server 127.0.0.1 --udp</code> + tcpdump on <code>lo</code>.</li>
<li>If you have a second VM: forward with UDP, freeze the receiver with <code>kill -STOP</code>, count what arrives. Then TCP with a queue.</li>
</ol>
<p><strong>Done when:</strong> your two files contain exactly the lines the rules promise, and you can explain from your own measurement why UDP lost lines and TCP made the sender wait.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['PRI', 'Number in &lt;…&gt; at the start of a syslog message: facility × 8 + severity.'],
  ['facility.severity', 'Selector: local3.warning = warning or worse; local3.=debug = debug only; * = all.'],
  ['stop', 'Discard the message — later rules (and later files) never see it.'],
  ['imuxsock · imjournal · imklog', 'Inputs: local socket (fed by journald on Ubuntu) · read journal files (Rocky) · kernel.'],
  ['omfwd · omrelp', 'Outputs to another machine: UDP/TCP(/TLS) · RELP with per-message acknowledgement.'],
  ['RFC 3164 · RFC 5424 · RFC 5425', 'Old format (no year/zone) · modern format · syslog over TLS (port 6514).'],
  ['timereported · timegenerated', 'Time the sender claims · time the receiver got it.'],
  ['disk-assisted queue', 'In-memory queue that spills to disk when full or on shutdown.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Ubuntu: app → journald → rsyslog (ForwardToSyslog); Rocky: rsyslog reads the journal (imjournal).</li>
<li>Rules run in file-name order; a <code>stop</code> earlier hides messages from later forwarding.</li>
<li>UDP drops silently under pressure (217/200,000 here); TCP blocks the sender — use a queue.</li>
<li>Forward in RFC 5424 or the receiver guesses the time zone.</li>
<li>Plain syslog is readable on the wire; TLS with name checking, and RELP when every line matters.</li>
</ul>
${nguon('📜', 'RFC 5424 — The Syslog Protocol', 'PRI, header, structured data', 'https://www.rfc-editor.org/rfc/rfc5424')}
${nguon('📜', 'RFC 5425 — TLS Transport Mapping for Syslog', 'Port 6514', 'https://www.rfc-editor.org/rfc/rfc5425')}
${nguon('📘', 'rsyslog — omfwd', 'Forwarding over UDP/TCP/TLS', 'https://www.rsyslog.com/doc/configuration/modules/omfwd.html')}
${nguon('📘', 'rsyslog — queues', 'In-memory, disk and disk-assisted queues', 'https://www.rsyslog.com/doc/concepts/queues.html')}
${nguon('✍️', 'Rainer Gerhards (2008) — On the (un)reliability of plain tcp syslog', 'Why RELP exists', 'https://rainer.gerhards.net/2008/04/on-unreliability-of-plain-tcp-syslog.html')}
${nguon('🛡', 'MITRE ATT&CK T1562.006', 'Impair Defenses: Indicator Blocking', 'https://attack.mitre.org/techniques/T1562/006/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-11-1-router-wifi', title: 'Lesson 11.1 — Router and Wi-Fi logs', sub: 'Send router logs to this rsyslog server' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>syslog và rsyslog: từ một dòng tới máy chủ log trung tâm</h2>
<p class="lead">syslog là hai thứ: một <strong>định dạng thông điệp</strong> (RFC 3164 năm 2001, RFC 5424 năm 2009) và một <strong>dịch vụ nền</strong> chuyển thông điệp vào tệp hoặc sang máy khác. Trên đa số máy chủ Linux, dịch vụ đó là rsyslog. Trong bài này lab7 gửi log tới một máy chủ log trung tâm (<code>lgz-logsrv</code>, địa chỉ 10.0.2.2) và ta cố tình làm hỏng đường đi: quá tải, sai thứ tự tệp, sai múi giờ, máy nhận tắt, TLS bị chặn.</p>

<h3>Liên tưởng đời thường: bưu điện</h3>
<p>Một lá thư có phong bì (ai gửi, lúc nào, gấp cỡ nào) và ruột thư. Bưu điện chỉ phân loại theo phong bì: "thư khẩn của phòng kế toán bỏ vào hộc A". Phong bì của syslog là <code>&lt;PRI&gt;</code> + giờ + máy + chương trình; rsyslog là phòng phân loại; máy chủ log ở xa là kho lưu trữ ở thành phố khác. UDP là bưu thiếp thả vào thùng: không biên nhận. TCP là thư bảo đảm. TLS là phong bì niêm phong.</p>

<h3>Bước 1 — một dòng đến được rsyslog bằng cách nào</h3>
${lenh('s08/rsyslog', 0)}
${lenh('s08/rsyslog', 1)}
${lenh('s08/rsyslog', 2)}
<p>Trên Ubuntu, <code>/dev/log</code> thuộc về <strong>journald</strong>. Mọi chương trình gọi <code>syslog()</code> đều nói chuyện với journald; journald lưu lại và, nhờ <code>ForwardToSyslog=yes</code> (một drop-in do bản phân phối cài sẵn), chuyển một bản sang socket <code>/run/systemd/journal/syslog</code> mà <code>imuxsock</code> của rsyslog đọc. Rocky 9 làm theo chiều ngược lại:</p>
${lenh('s08/rsyslog', 50)}
<p>Trên Rocky, rsyslog nạp <code>imjournal</code> và <em>đọc thẳng tệp journal</em>. Kết quả như nhau, cách hỏng khác nhau: với imjournal, journal hỏng hoặc tồn đọng lớn làm log văn bản tới chậm; với ForwardToSyslog, giới hạn tốc độ của journald (Bài 7.4) cắt bớt trước khi rsyslog kịp thấy. Biết máy mình kiểu nào trước khi gỡ lỗi "mất dòng".</p>

<h3>Bước 2 — PRI, facility, severity</h3>
<p>Con số ở đầu một thông điệp syslog thô là <code>PRI = facility × 8 + severity</code>. Facility: <code>kern</code>=0, <code>user</code>=1, <code>daemon</code>=3, <code>auth</code>=4, <code>authpriv</code>=10, <code>cron</code>=9, <code>local0</code>…<code>local7</code>=16…23 (để trống cho ứng dụng của bạn). Severity: <code>emerg</code>=0 … <code>err</code>=3, <code>warning</code>=4, <code>notice</code>=5, <code>info</code>=6, <code>debug</code>=7. Bên dưới bạn sẽ thấy <code>&lt;155&gt;</code>: 155 = 19 × 8 + 3 = <strong>local3.err</strong>; <code>&lt;30&gt;</code> = 3 × 8 + 6 = <strong>daemon.info</strong>.</p>

<h3>Bước 3 — selector và template: cấu hình cho ứng dụng "shop"</h3>
${lenh('s08/rsyslog', 3)}
${lenh('s08/rsyslog', 4)}
<p>Luôn kiểm bằng <code>rsyslogd -N1</code> trước khi khởi động lại: gõ sai một chữ mà không kiểm thì dịch vụ chạy với một nửa số luật. Rồi gửi mỗi mức một dòng:</p>
${lenh('s08/rsyslog', 5)}
${lenh('s08/rsyslog', 6)}
${lenh('s08/rsyslog', 7)}
${lenh('s08/rsyslog', 8)}
${lenh('s08/rsyslog', 9)}
<p>Đối chiếu kết quả với luật: <code>local3.warning</code> nghĩa là <em>warning trở lên</em> (nên có cả err và crit); <code>local3.=debug stop</code> bỏ hẳn debug; <code>stop</code> ở cuối giữ các dòng shop khỏi lọt vào <code>/var/log/syslog</code> (đếm được 0). Tệp JSON sẵn sàng cho <code>jq</code> hoặc bộ gom log (Chương 15). Để ý <code>"msg":" thu muc err"</code> bắt đầu bằng một dấu cách — syslog cổ điển giữ dấu cách sau dấu hai chấm; hãy cắt nó trong template hoặc bộ phân tích. Tên chương trình và PID lấy từ tag:</p>
${lenh('s08/rsyslog', 10)}

<h3>Bước 4 — gửi một dòng qua mạng, và đọc trên đường truyền</h3>
${lenh('s08/rsyslog', 11)}
<p><code>logger --server</code> gửi một thông điệp RFC 5424 thô qua UDP 514. tcpdump cho thấy nó <strong>rõ chữ</strong>: <code>&lt;155&gt;1 2026-11-24T05:11:14.597916+07:00 lab7 shop - - [timeQuality …] reset mat khau cho an@vd.vn token=GIA_TOKEN·VIDU_9f3c</code>. Ai đứng trên đường đi cũng đọc được địa chỉ email và token (giả). Ở máy nhận, template của ta ghi cả giờ bên gửi khai lẫn giờ máy nhận thực sự nhận được:</p>
${ma('text', 's08/logsrv/rsyslog.conf')}
${lenh('s08/rsyslog', 12)}

<h3>Bước 5 — UDP và TCP khi quá tải: đếm dòng mất</h3>
<p>Một script nhỏ (<code>bom.py</code>) bắn 200.000 dòng có đánh số thẳng vào máy nhận. Lần đầu, máy nhận khoẻ mạnh:</p>
${lenh('s08/rsyslog', 13)}
${lenh('s08/rsyslog', 14)}
${lenh('s08/rsyslog', 15)}
<p>Tới đủ — trên đường mạng cục bộ yên tĩnh, UDP thường trông vẫn ổn. Giờ làm đơ tiến trình máy nhận (<code>kill -STOP</code>: còn sống nhưng ngừng đọc, giống máy chủ kẹt vì đĩa chậm):</p>
${lenh('s08/rsyslog', 23)}
${lenh('s08/rsyslog', 24)}
${lenh('s08/rsyslog', 25)}
<p><strong>217 trên 200.000.</strong> Phần còn lại tràn bộ đệm nhận rồi biến mất. Bên gửi không được báo gì: nó "gửi 200000 dòng trong 0.30 s". Cùng phép thử với TCP, máy nhận đơ 5 giây:</p>
${lenh('s08/rsyslog', 26)}
${lenh('s08/rsyslog', 27)}
${lenh('s08/rsyslog', 28)}
<p>Không mất dòng nào — nhưng nhìn bên gửi: <strong>5.05 s</strong> thay vì 0.26 s. TCP đẩy ngược lại và bên gửi phải <em>chờ</em>. Nếu ứng dụng của bạn ghi log đồng bộ qua TCP, nó cũng đứng hình 5 giây. Vì thế rsyslog khi chuyển log đi luôn đặt một <strong>hàng đợi</strong> giữa ứng dụng và mạng (bước 7).</p>

<h3>Bước 6 — hai cái bẫy khi chuyển log đi: thứ tự tệp và múi giờ</h3>
${lenh('s08/rsyslog', 16)}
${lenh('s08/rsyslog', 17)}
${lenh('s08/rsyslog', 18)}
<p>Dòng <code>user</code> tới nơi; dòng <code>local3</code> thì không. Vì sao?</p>
${lenh('s08/rsyslog', 19)}
<p>Các tệp trong <code>rsyslog.d</code> được đọc theo thứ tự tên. <code>30-shop.conf</code> kết thúc bằng <code>local3.* stop</code>, nên khi tới <code>90-gui-di.conf</code> thì thông điệp local3 đã bị bỏ. Đổi tên thành <code>20-</code>:</p>
${lenh('s08/rsyslog', 20)}
${lenh('s08/rsyslog', 21)}
<p>Giờ thì tới — và lộ ra cái bẫy thứ hai. Máy nhận ghi <code>2026-11-24T05:11:25+00:00</code>, nhưng thời điểm thật là 05:11:25 <strong>+07:00</strong> (máy nhận nhận lúc 22:11:25 UTC). Định dạng chuyển đi mặc định là RFC 3164 cũ:</p>
${lenh('s08/rsyslog', 22)}
<p><code>&lt;30&gt;Nov 24 05:11:28 lab7 shop-api[424]: …</code> — không năm, không múi giờ, không phần lẻ giây. Máy nhận phải đoán và dùng múi giờ của chính nó (UTC): mỗi dòng chuyển tới lệch 7 tiếng. Cách sửa: chuyển đi với <code>template="RSYSLOG_SyslogProtocol23Format"</code> (RFC 5424), như mọi cấu hình tiếp theo.</p>

<h3>Bước 7 — máy nhận tắt: hàng đợi và thử lại</h3>
${lenh('s08/rsyslog', 29)}
${lenh('s08/rsyslog', 30)}
${lenh('s08/rsyslog', 31)}
${lenh('s08/rsyslog', 32)}
${lenh('s08/rsyslog', 33)}
${lenh('s08/rsyslog', 34)}
<p>Trong lúc máy nhận tắt, rsyslog ghi <code>action … suspended</code>, giữ ba dòng trong hàng đợi và gửi bù khi máy nhận sống lại. Không có <code>queue.*</code> và <code>action.resumeRetryCount="-1"</code>, ba dòng đó đã bị bỏ sau vài lần thử. Lần chạy này không mất gì, nhưng TCP thuần không có xác nhận ở tầng ứng dụng: các dòng đã giao cho nhân lúc kết nối đứt có thể mất mà không ai hay — tác giả rsyslog đã mô tả đúng chuyện này năm 2008 và viết ra <strong>RELP</strong> để sửa:</p>
${lenh('s08/rsyslog', 35)}
${lenh('s08/rsyslog', 36)}
${lenh('s08/rsyslog', 37)}
${lenh('s08/rsyslog', 38)}
${lenh('s08/rsyslog', 39)}
${lenh('s08/rsyslog', 40)}
<p>RELP: bên nhận xác nhận từng thông điệp; bên gửi chỉ xoá khỏi hàng đợi sau khi được xác nhận. Thư mục spool trống vì hàng đợi <code>LinkedList</code> có tên tệp là loại <em>có đĩa đỡ</em>: nó nằm trong RAM và chỉ ghi xuống đĩa khi RAM đầy hoặc lúc tắt (<code>saveOnShutdown</code>).</p>

<h3>Bước 8 — TLS cổng 6514, và hai lỗi thật trên đường</h3>
${lenh('s08/rsyslog', 41)}
${lenh('s08/rsyslog', 42)}
${lenh('s08/rsyslog', 43)}
${lenh('s08/rsyslog', 44)}
<p>Là root mà vẫn "Permission denied"? Nhân nói lý do: <code>apparmor="DENIED" … profile="rsyslogd" name="/etc/rsyslog-tls/ca.pem"</code>. Ubuntu nhốt rsyslogd bằng AppArmor; thư mục chứng chỉ mới nằm ngoài hồ sơ cho phép. Cách sửa là thêm một dòng cục bộ vào hồ sơ, không phải tắt AppArmor:</p>
${lenh('s08/rsyslog', 45)}
${lenh('s08/rsyslog', 46)}
${lenh('s08/rsyslog', 47)}
<p>Bắt được 22 gói, <strong>0 gói chứa token</strong> rõ chữ; máy nhận nhận dòng đó qua đầu vào <code>tls</code>. Giờ chứng minh bên gửi thật sự kiểm nó đang nói chuyện với ai — đổi tên được phép:</p>
${lenh('s08/rsyslog', 48)}
${lenh('s08/rsyslog', 49)}
<p><code>peer name not authorized</code>: chứng chỉ ghi <code>logsrv.lab</code>, ta chỉ cho phép <code>logsrv.that</code>, nên rsyslog từ chối. Mã hoá mà không kiểm tên (<code>StreamDriverAuthMode="anon"</code>) chống được kẻ nghe lén nhưng không chống được kẻ giả làm máy chủ log của bạn. (Cảnh báo "certificate file is not set" nói về chứng chỉ của chính <em>bên gửi</em> — chỉ cần khi máy nhận đòi TLS hai chiều.)</p>

<h3>syslog-ng, trong một đoạn</h3>
<p>syslog-ng là dịch vụ syslog lớn còn lại (thiết bị mạng, một số bản phân phối, nhiều bộ thu của SIEM). Ý tưởng giống hệt, từ ngữ khác: <code>source</code> → <code>filter</code> → <code>destination</code>, nối bằng các khối <code>log { }</code>. Đọc được một luật rsyslog theo kiểu "thông điệp nào → làm gì" thì đọc được syslog-ng.</p>

<h3>Góc hacker: đường ống log làm lộ gì và chấp nhận gì</h3>
<ul>
<li><strong>Làm lộ:</strong> bước 4 — syslog qua UDP/TCP là văn bản rõ. Log thường chứa email, IP, URL kèm token, đôi khi cả mật khẩu (Chương 16). Trên mạng dùng chung, đó là rò rỉ dữ liệu. Dùng TLS (RFC 5425, cổng 6514) hoặc VPN giữa các điểm.</li>
<li><strong>Chấp nhận:</strong> đầu vào UDP nhận thông điệp tự chế của ta từ bất kỳ tiến trình nào — máy nhận không thể biết ai thật sự gửi. Kẻ tấn công có thể chèn dòng giả ("sao lưu xong, ổn") hoặc dội ngập máy nhận để dòng thật rơi mất (bước 5). TLS có chứng chỉ bên gửi và tường lửa chỉ cho máy quen gửi sẽ giảm rủi ro này.</li>
<li><strong>Bịt miệng:</strong> kẻ có root thường dừng hoặc sửa bộ chuyển log để máy chủ trung tâm đơn giản là không nghe thấy gì — MITRE ATT&amp;CK <strong>T1562.006 Indicator Blocking</strong>. Máy chủ trung tâm phải cảnh báo khi "máy X im lặng 15 phút" (Chương 15).</li>
</ul>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Ticket ở công ty outsourcing:</strong> "SIEM của khách không nhận được gì từ máy chủ của mình." Thứ tự kiểm: <code>rsyslogd -N1</code>; thứ tự tệp trong <code>rsyslog.d</code> và mọi <code>stop</code>; <code>journalctl -u rsyslog</code> tìm <code>suspended</code> hoặc lỗi TLS; <code>journalctl -k | grep DENIED</code> (AppArmor/SELinux); tường lửa; tên trên chứng chỉ; cuối cùng tcpdump trên cổng đó.</li>
<li><strong>"Giờ trên máy chủ trung tâm lệch 7 tiếng":</strong> bên gửi dùng RFC 3164. Đổi sang template RFC 5424; đừng bao giờ "sửa" bằng cách đổi múi giờ máy nhận.</li>
<li><strong>Router ở nhà</strong> (Chương 11): router thường chỉ gửi được UDP 514 kiểu RFC 3164 — nhận chúng ở một input/ruleset riêng và ghi <code>timegenerated</code> cạnh giờ bên gửi khai.</li>
</ul>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
<li>Viết <code>/etc/rsyslog.d/25-myapp.conf</code>: <code>local5.info</code> trở lên vào <code>/var/log/myapp.log</code>, <code>local5.err</code> trở lên vào thêm <code>/var/log/myapp-err.log</code>, và giữ local5 khỏi syslog. Kiểm bằng <code>rsyslogd -N1</code>, thử bằng <code>logger -p local5.…</code>.</li>
<li>Tính PRI cho <code>auth.warning</code> và <code>local7.debug</code>, rồi kiểm bằng <code>logger --server 127.0.0.1 --udp</code> + tcpdump trên <code>lo</code>.</li>
<li>Nếu có máy ảo thứ hai: chuyển log bằng UDP, làm đơ máy nhận bằng <code>kill -STOP</code>, đếm số dòng tới. Rồi làm lại với TCP có hàng đợi.</li>
</ol>
<p><strong>Đạt khi:</strong> hai tệp của bạn chứa đúng những dòng mà luật hứa, và bạn giải thích được bằng chính số đo của mình vì sao UDP mất dòng còn TCP bắt bên gửi chờ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['PRI', 'Con số trong &lt;…&gt; ở đầu thông điệp syslog: facility × 8 + severity.'],
  ['facility.severity', 'Selector: local3.warning = warning trở lên; local3.=debug = chỉ debug; * = tất cả.'],
  ['stop', 'Bỏ thông điệp — luật sau (và tệp sau) không bao giờ thấy nó nữa.'],
  ['imuxsock · imjournal · imklog', 'Đầu vào: socket cục bộ (journald cấp trên Ubuntu) · đọc tệp journal (Rocky) · nhân.'],
  ['omfwd · omrelp', 'Đầu ra sang máy khác: UDP/TCP(/TLS) · RELP có xác nhận từng thông điệp.'],
  ['RFC 3164 · RFC 5424 · RFC 5425', 'Định dạng cũ (không năm/múi giờ) · định dạng hiện đại · syslog qua TLS (cổng 6514).'],
  ['timereported · timegenerated', 'Giờ bên gửi khai · giờ bên nhận nhận được.'],
  ['hàng đợi có đĩa đỡ', 'Hàng đợi trong RAM, tràn xuống đĩa khi đầy hoặc khi tắt.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ubuntu: ứng dụng → journald → rsyslog (ForwardToSyslog); Rocky: rsyslog đọc journal (imjournal).</li>
<li>Luật chạy theo thứ tự tên tệp; một <code>stop</code> đặt trước sẽ giấu thông điệp khỏi phần chuyển đi phía sau.</li>
<li>UDP rơi dòng âm thầm khi quá tải (217/200.000 ở đây); TCP chặn bên gửi — hãy dùng hàng đợi.</li>
<li>Chuyển đi bằng RFC 5424, không thì máy nhận phải đoán múi giờ.</li>
<li>syslog thuần đọc được trên đường truyền; dùng TLS có kiểm tên, và RELP khi từng dòng đều quan trọng.</li>
</ul>
${nguon('📜', 'RFC 5424 — The Syslog Protocol', 'PRI, phần đầu, dữ liệu có cấu trúc', 'https://www.rfc-editor.org/rfc/rfc5424')}
${nguon('📜', 'RFC 5425 — syslog qua TLS', 'Cổng 6514', 'https://www.rfc-editor.org/rfc/rfc5425')}
${nguon('📘', 'rsyslog — omfwd', 'Chuyển log qua UDP/TCP/TLS', 'https://www.rsyslog.com/doc/configuration/modules/omfwd.html')}
${nguon('📘', 'rsyslog — queues', 'Hàng đợi RAM, đĩa, có đĩa đỡ', 'https://www.rsyslog.com/doc/concepts/queues.html')}
${nguon('✍️', 'Rainer Gerhards (2008) — On the (un)reliability of plain tcp syslog', 'Vì sao có RELP', 'https://rainer.gerhards.net/2008/04/on-unreliability-of-plain-tcp-syslog.html')}
${nguon('🛡', 'MITRE ATT&CK T1562.006', 'Làm suy yếu phòng thủ: chặn chỉ dấu', 'https://attack.mitre.org/techniques/T1562/006/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-11-1-router-wifi', title: 'Bài 11.1 — Log router và Wi‑Fi', sub: 'Gửi log router về máy chủ rsyslog này' })}
</div>
`,
};
