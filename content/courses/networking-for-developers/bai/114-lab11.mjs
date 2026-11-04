/**
 * Chương 11 · Lab 11 — Chẩn đoán một sự cố của LabFlow theo tầng (phần 11 dự án xuyên khoá).
 * Lời giải dùng output thật: lab/out/c111-*, c112-*, c113-*, c114-*.out.txt.
 */
import { run, card, kv, code } from '../_ui.mjs';
import G from '../giang/nfd-lab-11.mjs';

const L = card;
const PHIEU = `# Lab 11 report — <your name>, <date>

## R1 Capture  — tcpdump a request to .pcap; read back; handshake (S/S./.), GET, 200, FIN labelled
## R2 Analyse  — tshark the same pcap: -Y http (method/uri/status) + follow,tcp,ascii,0 (the request)
## R3 Measure  — curl -w (dns/connect/ttfb/total); ping (RTT/loss); mtr (per-hop); iperf3 (Mbit/s); latency vs bandwidth
## R4 Diagnose — DNS -> routing -> port -> TLS -> HTTP -> app, one command each, each answer read`;

export default {
  title: 'Lab 11 — Diagnosing a LabFlow incident by layers: capture, follow, measure, walk the checklist|||Lab 11 — Chẩn đoán một sự cố của LabFlow theo tầng: bắt, theo, đo, đi bảng kiểm',
  slug: 'netdev-11-5-lab-chan-doan',
  type: 'LESSON',
  isFreePreview: true,
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lab 11 · Course project part 11</span>
<h2>Lab 11 — Diagnosing a LabFlow incident by layers</h2>
<p class="lead">A LabFlow request is slow and flaky, and the usual argument has broken out: the backend team says it's the network, the network team says it's the app. This lab ends the argument the only way that works — with evidence. You will capture the actual packets, read the conversation, measure exactly where the time goes, and walk the layered checklist until one layer is proven to be the culprit (or every layer is proven clean). Everything is in Chapter 11.</p>

<h3>What you get</h3>
<ul>
<li><strong>web</strong> (nginx, <code>10.10.2.10:80</code>) — the service under investigation; a <strong>TLS endpoint</strong> (<code>:8443</code>) for the TLS layer.</li>
<li><strong>api</strong> (Node, <code>10.10.2.20:3000</code>) — the app layer (JSON) and an <code>iperf3</code> server; the <strong>router</strong> adds 20 ms for the path measurement.</li>
<li>Real <code>tcpdump</code>, <code>tshark</code>, <code>mtr</code>, <code>iperf3</code>, <code>openssl</code>. Bring it up with <code>bash lab/code/dung-output-ch11.sh</code>.</li>
</ul>

<h3>Requirements</h3>
<ol>
<li><strong>R1 Capture.</strong> <code>tcpdump</code> one request into a <code>.pcap</code>, read it back, and identify the handshake, <code>GET</code>, <code>200</code> and <code>FIN</code>.</li>
<li><strong>R2 Analyse.</strong> <code>tshark</code> the same pcap — filter to HTTP, and follow the TCP stream.</li>
<li><strong>R3 Measure.</strong> <code>curl -w</code> stages, <code>ping</code> RTT/loss, <code>mtr</code> per-hop, <code>iperf3</code> bandwidth; say which is latency and which is bandwidth.</li>
<li><strong>R4 Diagnose.</strong> Walk DNS → routing → port → TLS → HTTP → app, one command each, and read each answer.</li>
</ol>

<h3>Report template</h3>
${code(PHIEU, 'markdown')}

<h3>Rubric — 10 points</h3>
<table>
<tr><th>Item</th><th>Pts</th><th>Full marks when</th></tr>
<tr><td>R1</td><td>2.5</td><td>pcap captured + read back; handshake/<code>GET</code>/<code>200</code>/<code>FIN</code> identified</td></tr>
<tr><td>R2</td><td>2.5</td><td>HTTP filtered; one TCP stream followed</td></tr>
<tr><td>R3</td><td>2.5</td><td><code>curl -w</code> / <code>ping</code> / <code>mtr</code> / <code>iperf3</code> run; latency vs bandwidth stated</td></tr>
<tr><td>R4</td><td>2.5</td><td>all six layers checked with one command each, answers read</td></tr>
</table>

<h3>Hints by level</h3>
<details><summary>Hints</summary>
<ul>
<li>R1: <code>tcpdump -i eth0 -w /tmp/cap.pcap "tcp port 80 and host 10.10.2.10"</code> during a <code>curl</code>; then <code>tcpdump -r /tmp/cap.pcap</code>.</li>
<li>R2: <code>tshark -r /tmp/cap.pcap -Y http -T fields -e http.request.method -e http.request.uri -e http.response.code</code>; <code>-z follow,tcp,ascii,0</code>.</li>
<li>R3: the <code>curl -w</code> template; <code>ping -c 3</code>; <code>mtr --report --report-cycles 3</code>; <code>iperf3 -c 10.10.2.20</code>.</li>
<li>R4: <code>getent/dig</code> · <code>ip route get</code> · <code>nc -zv</code> · <code>openssl s_client</code> · <code>curl -I</code> · the app JSON.</li>
</ul>
</details>

<h3>Solution (real output)</h3>
<p><strong>R1</strong> — capture one request and read it back; the whole conversation is there — handshake (<code>[S]</code>, <code>[S.]</code>, <code>[.]</code>), <code>GET</code>, <code>200 OK</code>, <code>[F.]</code>:</p>
${run('c111-tcpdump', 'tcpdump -r', 1, { cut: 96, max: 9 })}
<p><strong>R2</strong> — <code>tshark</code> the same pcap: filter to HTTP, then follow the stream to read the request:</p>
${run('c112-tshark', 'tshark -r /tmp/cap.pcap -Y http', 1)}
${run('c112-tshark', 'tshark -r /tmp/cap.pcap -q', 1, { max: 12 })}
<p><strong>R3</strong> — measure the path: the <code>curl -w</code> stages, the RTT and loss, the per-hop <code>mtr</code>, and the <code>iperf3</code> bandwidth. RTT and the <code>curl -w</code> stages are <strong>latency</strong>; <code>iperf3</code> is <strong>bandwidth</strong>:</p>
${run('c113-path', 'curl', 1)}
${run('c113-path', 'ping', 1)}
${run('c113-path', 'mtr', 1, { cut: 96 })}
${run('c113-path', 'iperf3', 1)}
<p><strong>R4</strong> — walk the layers, one command each; here every layer is clean, so the request is healthy end to end:</p>
${run('c114-checklist', 'getent', 1)}
${run('c114-checklist', 'ip route get', 1)}
${run('c114-checklist', 'nc -zv', 1)}
${run('c114-checklist', 'openssl', 1)}
${run('c114-checklist', 'curl -sI', 1)}
${run('c114-checklist', 'curl -s http', 1)}
<p>DNS resolves, the route is via the router, port 80 is open (81 refused), the TLS cert is valid, HTTP is <code>200</code>, and the app returns JSON. Had any layer failed, you would have stopped there — the failing layer is the fix, and everything below it is proven good.</p>

<h3>Going further</h3>
<ul>
<li>Re-run the capture <em>through</em> the 20 ms router delay and find the gap in the timestamps — tie it to the <code>mtr</code> hop.</li>
<li>Point <code>openssl s_client</code> at an expired/wrong-name cert and watch the TLS layer fail the checklist.</li>
<li><strong>Course project:</strong> this toolbox is exactly what you use in the Chapter 13 capstone to measure and break the real request path — keep your checklist and your <code>curl -w</code> template.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Lab 11 · Dự án xuyên khoá phần 11</span>
<h2>Lab 11 — Chẩn đoán một sự cố của LabFlow theo tầng</h2>
<p class="lead">Một yêu cầu LabFlow chậm và chập chờn, và cuộc tranh cãi quen thuộc đã nổ ra: đội backend nói tại mạng, đội mạng nói tại app. Lab này chấm dứt tranh cãi theo cách duy nhất hiệu quả — bằng bằng chứng. Bạn sẽ bắt các gói thật, đọc cuộc hội thoại, đo chính xác thời gian đi đâu, và đi qua bảng kiểm theo tầng tới khi một tầng được chứng minh là thủ phạm (hay mọi tầng được chứng minh sạch). Mọi thứ đều có trong Chương 11.</p>

<h3>Bạn được gì</h3>
<ul>
<li><strong>web</strong> (nginx, <code>10.10.2.10:80</code>) — dịch vụ đang điều tra; một <strong>điểm cuối TLS</strong> (<code>:8443</code>) cho tầng TLS.</li>
<li><strong>api</strong> (Node, <code>10.10.2.20:3000</code>) — tầng app (JSON) và một máy chủ <code>iperf3</code>; <strong>router</strong> thêm 20 ms cho đo đường.</li>
<li><code>tcpdump</code>, <code>tshark</code>, <code>mtr</code>, <code>iperf3</code>, <code>openssl</code> thật. Dựng bằng <code>bash lab/code/dung-output-ch11.sh</code>.</li>
</ul>

<h3>Yêu cầu</h3>
<ol>
<li><strong>R1 Bắt.</strong> <code>tcpdump</code> một yêu cầu vào một <code>.pcap</code>, đọc lại, và nhận ra cú bắt tay, <code>GET</code>, <code>200</code> và <code>FIN</code>.</li>
<li><strong>R2 Phân tích.</strong> <code>tshark</code> cùng pcap — lọc xuống HTTP, và theo luồng TCP.</li>
<li><strong>R3 Đo.</strong> <code>curl -w</code> các chặng, <code>ping</code> RTT/mất, <code>mtr</code> mỗi hop, <code>iperf3</code> băng thông; nói cái nào là độ trễ và cái nào là băng thông.</li>
<li><strong>R4 Chẩn đoán.</strong> Đi qua DNS → định tuyến → cổng → TLS → HTTP → app, mỗi tầng một lệnh, và đọc mỗi câu trả lời.</li>
</ol>

<h3>Mẫu báo cáo</h3>
${code(PHIEU, 'markdown')}

<h3>Thang điểm — 10 điểm</h3>
<table>
<tr><th>Mục</th><th>Điểm</th><th>Trọn điểm khi</th></tr>
<tr><td>R1</td><td>2.5</td><td>pcap bắt + đọc lại; cú bắt tay/<code>GET</code>/<code>200</code>/<code>FIN</code> nhận ra</td></tr>
<tr><td>R2</td><td>2.5</td><td>HTTP lọc; một luồng TCP theo</td></tr>
<tr><td>R3</td><td>2.5</td><td><code>curl -w</code> / <code>ping</code> / <code>mtr</code> / <code>iperf3</code> chạy; độ trễ vs băng thông nói rõ</td></tr>
<tr><td>R4</td><td>2.5</td><td>cả sáu tầng kiểm với mỗi tầng một lệnh, các câu trả lời đọc</td></tr>
</table>

<h3>Gợi ý theo bậc</h3>
<details><summary>Gợi ý</summary>
<ul>
<li>R1: <code>tcpdump -i eth0 -w /tmp/cap.pcap "tcp port 80 and host 10.10.2.10"</code> trong một <code>curl</code>; rồi <code>tcpdump -r /tmp/cap.pcap</code>.</li>
<li>R2: <code>tshark -r /tmp/cap.pcap -Y http -T fields -e http.request.method -e http.request.uri -e http.response.code</code>; <code>-z follow,tcp,ascii,0</code>.</li>
<li>R3: khuôn <code>curl -w</code>; <code>ping -c 3</code>; <code>mtr --report --report-cycles 3</code>; <code>iperf3 -c 10.10.2.20</code>.</li>
<li>R4: <code>getent/dig</code> · <code>ip route get</code> · <code>nc -zv</code> · <code>openssl s_client</code> · <code>curl -I</code> · JSON app.</li>
</ul>
</details>

<h3>Lời giải (output thật)</h3>
<p><strong>R1</strong> — bắt một yêu cầu và đọc lại; cả cuộc hội thoại ở đó — cú bắt tay (<code>[S]</code>, <code>[S.]</code>, <code>[.]</code>), <code>GET</code>, <code>200 OK</code>, <code>[F.]</code>:</p>
${run('c111-tcpdump', 'tcpdump -r', 1, { cut: 96, max: 9 })}
<p><strong>R2</strong> — <code>tshark</code> cùng pcap: lọc xuống HTTP, rồi theo luồng để đọc yêu cầu:</p>
${run('c112-tshark', 'tshark -r /tmp/cap.pcap -Y http', 1)}
${run('c112-tshark', 'tshark -r /tmp/cap.pcap -q', 1, { max: 12 })}
<p><strong>R3</strong> — đo đường đi: các chặng <code>curl -w</code>, RTT và mất, <code>mtr</code> mỗi hop, và băng thông <code>iperf3</code>. RTT và các chặng <code>curl -w</code> là <strong>độ trễ</strong>; <code>iperf3</code> là <strong>băng thông</strong>:</p>
${run('c113-path', 'curl', 1)}
${run('c113-path', 'ping', 1)}
${run('c113-path', 'mtr', 1, { cut: 96 })}
${run('c113-path', 'iperf3', 1)}
<p><strong>R4</strong> — đi qua các tầng, mỗi tầng một lệnh; ở đây mọi tầng sạch, nên yêu cầu khoẻ đầu-cuối:</p>
${run('c114-checklist', 'getent', 1)}
${run('c114-checklist', 'ip route get', 1)}
${run('c114-checklist', 'nc -zv', 1)}
${run('c114-checklist', 'openssl', 1)}
${run('c114-checklist', 'curl -sI', 1)}
${run('c114-checklist', 'curl -s http', 1)}
<p>DNS phân giải, route qua router, cổng 80 mở (81 từ chối), cert TLS hợp lệ, HTTP là <code>200</code>, và app trả JSON. Nếu bất kỳ tầng nào hỏng, bạn đã dừng ở đó — tầng hỏng là cách sửa, và mọi thứ dưới nó đã chứng minh tốt.</p>

<h3>Đi xa hơn</h3>
<ul>
<li>Chạy lại bản bắt <em>qua</em> trễ router 20 ms và tìm khoảng trống trong các mốc thời gian — nối nó với hop <code>mtr</code>.</li>
<li>Trỏ <code>openssl s_client</code> vào một cert hết hạn/sai tên và nhìn tầng TLS rớt bảng kiểm.</li>
<li><strong>Dự án xuyên khoá:</strong> hộp đồ nghề này đúng là cái bạn dùng trong dự án Chương 13 để đo và làm hỏng đường-request thật — giữ bảng kiểm và khuôn <code>curl -w</code> của bạn.</li>
</ul>
</div>
`,
};
