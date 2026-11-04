/**
 * Chương 4 · Lab 4 — Mổ xẻ TCP của LabFlow (phần 4 dự án xuyên khoá). Lab cơ bản (compose.yml, project nfd).
 * Lời giải dùng output thật: lab/out/lab4-*.out.txt + các bản bắt gói c41/c42/c44/c45 của chương.
 */
import { run, whole, card, kv, details, code } from '../_ui.mjs';
import G from '../giang/nfd-lab-4.mjs';

const L = card;
const PHIEU = `# Lab 4 report — <your name>, <date>

## R1 One connection       — a labelled capture: handshake, data, four-way teardown
## R2 Handshake tax        — connect/ttfb for new vs keep-alive; round trips saved
## R3 Port exhaustion      — the exit code, the TIME_WAIT count, why it recovers
## R4 Incident A (hang)    — hang time with/without --connect-timeout; the fix
## R5 Incident B (40 ms)   — ms/transaction Nagle on vs TCP_NODELAY; the cause
## R6 Monitoring           — the checker and what it prints`;

export default {
  title: 'Lab 4 — Dissecting LabFlow’s TCP: read a connection, measure the tax, diagnose two incidents|||Lab 4 — Mổ xẻ TCP của LabFlow: đọc một kết nối, đo thuế, chẩn đoán hai sự cố',
  slug: 'netdev-4-6-lab-tcp-labflow',
  type: 'LESSON',
  isFreePreview: true,
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lab 4 · Course project part 4</span>
<h2>Lab 4 — Dissecting LabFlow’s TCP</h2>
<p class="lead">The LabFlow API is reported “slow and flaky”. A nightly batch job errors with <em>cannot assign requested address</em>; an internal RPC call adds a fixed ~40 ms; and a new dependency makes requests hang for two minutes when it is down. Your lead wants a one-page teardown that <em>reads</em> what TCP is doing instead of guessing. Everything is in Chapter 4.</p>

<h3>What you get</h3>
<ul>
<li>The base lab (<code>client → router → web → api</code>), with 25 ms of delay on the router so round trips are visible.</li>
<li>Two injected incidents: a dependency whose SYNs are dropped, and an RPC that splits its request into two small writes.</li>
<li>The chapter’s tools: <code>tcpdump</code>, <code>tshark</code>, <code>ss</code>, <code>iperf3</code>, <code>curl -w</code>, <code>nstat</code>.</li>
</ul>

<h3>Requirements</h3>
<ol>
<li><strong>R1 Read one connection.</strong> Capture a single <code>curl http://10.10.2.10/</code> and label every packet: SYN, SYN-ACK, ACK, the GET, the response, and the four-way FIN teardown. Name the 25 ms gap.</li>
<li><strong>R2 The handshake tax.</strong> Measure <code>connect</code> and <code>ttfb</code> for three new connections (<code>-H 'Connection: close'</code>) versus three requests on one keep-alive connection. State how many round trips keep-alive saved.</li>
<li><strong>R3 Port exhaustion.</strong> Reproduce the batch job’s failure: <code>curl --local-port 50010-50012</code> in a loop of four. Show the exit code of the fourth and explain why TIME_WAIT caused it and why the job recovers minutes later.</li>
<li><strong>R4 Incident A — the hang.</strong> Drop a dependency’s SYNs (<code>docker exec nfd-router iptables -A FORWARD -d 10.10.2.99 -j DROP</code>). Measure how long a request hangs with no timeout vs <code>--connect-timeout 2</code>. Give the fix and say why it is a connect timeout, not a read timeout.</li>
<li><strong>R5 Incident B — the 40 ms.</strong> Run <code>node nagle-cli.mjs</code> (a request split into two small writes). Compare ms/transaction with Nagle on vs <code>TCP_NODELAY</code>. Explain the stall and give two fixes.</li>
<li><strong>R6 Monitoring.</strong> Write a health script that would have flagged R3: an <code>ss -s</code> census, a TIME-WAIT count with a threshold, and the ephemeral-port range. Run it and show its output.</li>
</ol>

<h3>Report template</h3>
${code(PHIEU, 'markdown')}

<h3>Rubric — 10 points</h3>
<table>
<tr><th>Item</th><th>Pts</th><th>Full marks when</th></tr>
<tr><td>R1</td><td>2</td><td>every packet labelled; the 25 ms named as one round trip; the four FIN/ACK packets identified as the teardown</td></tr>
<tr><td>R2</td><td>1.5</td><td>connect/ttfb measured both ways; keep-alive shown saving the handshake round trip (num_connects 1 then 0)</td></tr>
<tr><td>R3</td><td>1.5</td><td>exit 45 on the 4th request; TIME_WAIT on the active closer explained; recovery as ports expire</td></tr>
<tr><td>R4</td><td>2</td><td>~133 s hang vs 2 s with a connect timeout; connect- vs read-timeout distinction; fix named</td></tr>
<tr><td>R5</td><td>2</td><td>≈57 ms vs ≈30 ms measured; Nagle × delayed-ACK explained; TCP_NODELAY or coalescing writes as fix</td></tr>
<tr><td>R6</td><td>1</td><td>a runnable checker printing OK/FAIL that would catch the exhaustion before it caused errors</td></tr>
</table>

<h3>Hints by level</h3>
<details><summary>Hints</summary>
<ul>
<li>R1: start <code>tcpdump -i eth0 -n -w /tmp/h.pcap 'tcp and host 10.10.2.10'</code>, run one curl, stop it, then <code>tcpdump -tt -nr /tmp/h.pcap</code>. Flags: <code>[S]</code>, <code>[S.]</code>, <code>[.]</code>, <code>[P.]</code>, <code>[F.]</code>.</li>
<li>R2: <code>curl -w '%{time_connect} %{time_starttransfer} %{num_connects}\\n'</code>. Separate requests each connect; several URLs in one curl reuse the connection.</li>
<li>R3: <code>for i in 1 2 3 4; do curl --local-port 50010-50012 ...; done</code> — read the exit code of the 4th (<code>%{exitcode}</code>).</li>
<li>R4: plain <code>curl http://10.10.2.99/</code> hangs for the kernel’s SYN-retransmit budget; add <code>--connect-timeout 2</code> and compare the wall-clock time.</li>
<li>R5: <code>node nagle-cli.mjs</code> prints ms/transaction for <code>NODELAY=false</code> then <code>true</code>; the difference is the delayed-ACK timer.</li>
<li>R6: everything you typed in R3 — <code>ss -s</code>, a TIME-WAIT count, <code>cat /proc/sys/net/ipv4/ip_local_port_range</code> — can be a line that prints OK or FAIL.</li>
</ul>
</details>

<h3>Solution (real output)</h3>
<p><strong>R1</strong> — one connection, start to finish. <code>[S]</code> SYN, <code>[S.]</code> SYN-ACK 25 ms later (one round trip), <code>[.]</code> ACK, <code>[P.]</code> GET and response, then <code>[F.] [.] [F.] [.]</code> — the four-way teardown:</p>
${run('c41-tay', 'tcpdump', 1, { max: 11 })}
<p><strong>R2</strong> — the handshake tax. New connections each pay ~26 ms of <code>connect</code>; keep-alive pays it once, then the next two requests are one round trip:</p>
${run('lab4-r2', 'for i', 1)}
${run('lab4-r2', 'curl -so /dev/null -w "  conn#', 1)}
<p>Keep-alive saved one round trip (the handshake) on every request after the first — <code>ttfb</code> fell from ~0.057 to ~0.026.</p>
<p><strong>R3</strong> — port exhaustion. Forcing three source ports, the fourth connection cannot bind one (exit 45) because all three are in TIME_WAIT:</p>
${run('c44-exhaust', 'for i', 1)}
<p>The client did the active close, so TIME_WAIT (and the locked ports) sit on the client; they expire after ~60 s, which is why the batch job “recovers on its own”. The real fix is a keep-alive pool.</p>
<p><strong>R4 — Incident A.</strong> With the dependency’s SYNs dropped, a request with no timeout hangs for the kernel’s full retransmit budget; a connect timeout turns it into a fast failure:</p>
${whole('lab4-r4')}
<p>It is a <em>connect</em> timeout because the failure is in the handshake (no SYN-ACK), not in waiting for a response. Fix: set a connect timeout (2–3 s) on the HTTP client so a dead dependency fails in seconds, not two minutes.</p>
<p><strong>R5 — Incident B.</strong> The RPC splits its request into two small writes. With Nagle on, each transaction waits on the delayed-ACK timer; <code>TCP_NODELAY</code> removes it:</p>
${run('c45-nodelay', 'node nagle', 1)}
<p>≈57 ms vs ≈30 ms — the ~40 ms Nagle × delayed-ACK stall. Fix: set <code>TCP_NODELAY</code> on the RPC socket, or coalesce the two writes into one (<code>write(header+body)</code>).</p>
<p><strong>R6 — monitoring.</strong> A small checker: census, a TIME-WAIT threshold, and the ephemeral range. Run from cron, alert on FAIL:</p>
${whole('lab4-r6')}
<p>During the batch-job incident the TIME-WAIT count would cross the threshold and the checker would print FAIL before users saw <em>cannot assign requested address</em>.</p>

<h3>Going further</h3>
<ul>
<li>Add <code>netem rate 20mbit delay 80ms</code> and sample <code>ss -ti</code> to watch <code>cwnd</code> climb through slow start (lesson 4.3).</li>
<li>Add <code>loss 3%</code> and read a fast retransmit + SACK in <code>tshark</code> (lesson 4.2).</li>
<li>Rewrite the batch job with a keep-alive agent (lesson 4.5) and show the port churn vanish.</li>
<li><strong>Course project:</strong> this TCP teardown becomes one hop of the whole-path capstone in Chapter 13 — keep your R1 capture and R6 checker.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Lab 4 · Dự án xuyên khoá phần 4</span>
<h2>Lab 4 — Mổ xẻ TCP của LabFlow</h2>
<p class="lead">API của LabFlow bị báo “chậm và chập chờn”. Một việc chạy lô ban đêm lỗi với <em>cannot assign requested address</em>; một lời gọi RPC nội bộ thêm cố định ~40 ms; và một phụ thuộc mới làm yêu cầu treo hai phút khi nó sập. Trưởng nhóm muốn một bản mổ xẻ một trang <em>đọc</em> xem TCP đang làm gì thay vì đoán. Mọi thứ đều có trong Chương 4.</p>

<h3>Bạn được gì</h3>
<ul>
<li>Lab cơ bản (<code>client → router → web → api</code>), thêm 25 ms trễ trên router để thấy các vòng khứ hồi.</li>
<li>Hai sự cố cài sẵn: một phụ thuộc bị vứt SYN, và một RPC tách yêu cầu làm hai lần ghi nhỏ.</li>
<li>Bộ công cụ của chương: <code>tcpdump</code>, <code>tshark</code>, <code>ss</code>, <code>iperf3</code>, <code>curl -w</code>, <code>nstat</code>.</li>
</ul>

<h3>Yêu cầu</h3>
<ol>
<li><strong>R1 Đọc một kết nối.</strong> Bắt một <code>curl http://10.10.2.10/</code> và đánh dấu mọi gói: SYN, SYN-ACK, ACK, GET, câu trả lời, và bốn bước FIN. Gọi tên khoảng 25 ms.</li>
<li><strong>R2 Thuế bắt tay.</strong> Đo <code>connect</code> và <code>ttfb</code> cho ba kết nối mới (<code>-H 'Connection: close'</code>) so với ba yêu cầu trên một kết nối keep-alive. Nói keep-alive tiết kiệm bao nhiêu vòng khứ hồi.</li>
<li><strong>R3 Cạn cổng.</strong> Dựng lại lỗi của việc lô: <code>curl --local-port 50010-50012</code> trong một vòng bốn. Cho thấy mã thoát của cái thứ tư và giải thích vì sao TIME_WAIT gây nó và vì sao việc tự khỏi vài phút sau.</li>
<li><strong>R4 Sự cố A — cú treo.</strong> Vứt SYN của một phụ thuộc (<code>docker exec nfd-router iptables -A FORWARD -d 10.10.2.99 -j DROP</code>). Đo một yêu cầu treo bao lâu khi không timeout so với <code>--connect-timeout 2</code>. Đưa cách sửa và nói vì sao đó là connect timeout, không phải read timeout.</li>
<li><strong>R5 Sự cố B — 40 ms.</strong> Chạy <code>node nagle-cli.mjs</code> (một yêu cầu tách làm hai lần ghi nhỏ). So ms/giao dịch với Nagle bật so với <code>TCP_NODELAY</code>. Giải thích cú kẹt và đưa hai cách sửa.</li>
<li><strong>R6 Giám sát.</strong> Viết một script sức khoẻ sẽ cảnh báo R3: điểm danh <code>ss -s</code>, đếm TIME-WAIT với một ngưỡng, và dải cổng tạm. Chạy nó và cho thấy output.</li>
</ol>

<h3>Mẫu báo cáo</h3>
${code(PHIEU, 'markdown')}

<h3>Thang điểm — 10 điểm</h3>
<table>
<tr><th>Mục</th><th>Điểm</th><th>Trọn điểm khi</th></tr>
<tr><td>R1</td><td>2</td><td>mọi gói có nhãn; 25 ms gọi là một vòng khứ hồi; bốn gói FIN/ACK nhận ra là phần đóng</td></tr>
<tr><td>R2</td><td>1.5</td><td>connect/ttfb đo cả hai chiều; keep-alive tiết kiệm vòng bắt tay (num_connects 1 rồi 0)</td></tr>
<tr><td>R3</td><td>1.5</td><td>exit 45 ở yêu cầu thứ 4; TIME_WAIT trên bên đóng chủ động giải thích; tự khỏi khi cổng hết hạn</td></tr>
<tr><td>R4</td><td>2</td><td>~133 s treo so với 2 s có connect timeout; phân biệt connect- với read-timeout; gọi tên cách sửa</td></tr>
<tr><td>R5</td><td>2</td><td>đo ≈57 ms so với ≈30 ms; giải thích Nagle × delayed-ACK; TCP_NODELAY hoặc gộp lần ghi làm cách sửa</td></tr>
<tr><td>R6</td><td>1</td><td>một bộ kiểm chạy được in OK/FAIL, sẽ bắt cạn cổng trước khi nó gây lỗi</td></tr>
</table>

<h3>Gợi ý theo bậc</h3>
<details><summary>Gợi ý</summary>
<ul>
<li>R1: chạy <code>tcpdump -i eth0 -n -w /tmp/h.pcap 'tcp and host 10.10.2.10'</code>, chạy một curl, dừng, rồi <code>tcpdump -tt -nr /tmp/h.pcap</code>. Cờ: <code>[S]</code>, <code>[S.]</code>, <code>[.]</code>, <code>[P.]</code>, <code>[F.]</code>.</li>
<li>R2: <code>curl -w '%{time_connect} %{time_starttransfer} %{num_connects}\\n'</code>. Các yêu cầu riêng mỗi cái kết nối; nhiều URL trong một curl dùng lại kết nối.</li>
<li>R3: <code>for i in 1 2 3 4; do curl --local-port 50010-50012 ...; done</code> — đọc mã thoát của cái thứ 4 (<code>%{exitcode}</code>).</li>
<li>R4: <code>curl http://10.10.2.99/</code> thường treo trọn ngân sách truyền lại SYN của nhân; thêm <code>--connect-timeout 2</code> và so thời gian đồng hồ.</li>
<li>R5: <code>node nagle-cli.mjs</code> in ms/giao dịch cho <code>NODELAY=false</code> rồi <code>true</code>; chênh lệch là bộ đếm delayed-ACK.</li>
<li>R6: mọi thứ bạn gõ ở R3 — <code>ss -s</code>, một bộ đếm TIME-WAIT, <code>cat /proc/sys/net/ipv4/ip_local_port_range</code> — có thể thành một dòng in OK hay FAIL.</li>
</ul>
</details>

<h3>Lời giải (output thật)</h3>
<p><strong>R1</strong> — một kết nối, đầu tới cuối. <code>[S]</code> SYN, <code>[S.]</code> SYN-ACK 25 ms sau (một vòng khứ hồi), <code>[.]</code> ACK, <code>[P.]</code> GET và câu trả lời, rồi <code>[F.] [.] [F.] [.]</code> — bốn bước đóng:</p>
${run('c41-tay', 'tcpdump', 1, { max: 11 })}
<p><strong>R2</strong> — thuế bắt tay. Kết nối mới mỗi cái trả ~26 ms <code>connect</code>; keep-alive trả một lần, rồi hai yêu cầu sau chỉ một vòng khứ hồi:</p>
${run('lab4-r2', 'for i', 1)}
${run('lab4-r2', 'curl -so /dev/null -w "  conn#', 1)}
<p>Keep-alive tiết kiệm một vòng khứ hồi (cú bắt tay) trên mọi yêu cầu sau cái đầu — <code>ttfb</code> tụt từ ~0,057 xuống ~0,026.</p>
<p><strong>R3</strong> — cạn cổng. Ép ba cổng nguồn, kết nối thứ tư không bind được (exit 45) vì cả ba đang trong TIME_WAIT:</p>
${run('c44-exhaust', 'for i', 1)}
<p>Client làm cú đóng chủ động, nên TIME_WAIT (và các cổng bị khoá) nằm ở client; chúng hết hạn sau ~60 s, đó là lý do việc lô “tự khỏi”. Cách sửa thật là một pool keep-alive.</p>
<p><strong>R4 — Sự cố A.</strong> Khi SYN của phụ thuộc bị vứt, một yêu cầu không timeout treo trọn ngân sách truyền lại của nhân; một connect timeout biến nó thành một cú hỏng nhanh:</p>
${whole('lab4-r4')}
<p>Đó là một <em>connect</em> timeout vì cú hỏng nằm ở cú bắt tay (không có SYN-ACK), không phải chờ một câu trả lời. Sửa: đặt connect timeout (2–3 s) trên HTTP client để một phụ thuộc đã chết hỏng trong vài giây, không phải hai phút.</p>
<p><strong>R5 — Sự cố B.</strong> RPC tách yêu cầu làm hai lần ghi nhỏ. Với Nagle bật, mỗi giao dịch chờ bộ đếm delayed-ACK; <code>TCP_NODELAY</code> bỏ nó:</p>
${run('c45-nodelay', 'node nagle', 1)}
<p>≈57 ms so với ≈30 ms — cú kẹt Nagle × delayed-ACK ~40 ms. Sửa: đặt <code>TCP_NODELAY</code> trên socket RPC, hoặc gộp hai lần ghi thành một (<code>write(header+body)</code>).</p>
<p><strong>R6 — giám sát.</strong> Một bộ kiểm nhỏ: điểm danh, một ngưỡng TIME-WAIT, và dải cổng tạm. Chạy từ cron, báo động khi FAIL:</p>
${whole('lab4-r6')}
<p>Trong sự cố việc lô, bộ đếm TIME-WAIT sẽ vượt ngưỡng và bộ kiểm in FAIL trước khi người dùng thấy <em>cannot assign requested address</em>.</p>

<h3>Đi xa hơn</h3>
<ul>
<li>Thêm <code>netem rate 20mbit delay 80ms</code> và chụp <code>ss -ti</code> để xem <code>cwnd</code> trèo qua slow start (bài 4.3).</li>
<li>Thêm <code>loss 3%</code> và đọc một truyền lại nhanh + SACK trong <code>tshark</code> (bài 4.2).</li>
<li>Viết lại việc lô với một agent keep-alive (bài 4.5) và cho thấy việc xoay vòng cổng biến mất.</li>
<li><strong>Dự án xuyên khoá:</strong> bản mổ xẻ TCP này thành một chặng của dự án cuối khoá cả-đường ở Chương 13 — giữ bản bắt gói R1 và bộ kiểm R6 của bạn.</li>
</ul>
</div>
`,
};
