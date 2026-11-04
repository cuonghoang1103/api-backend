/**
 * Chương 11 · 11.1 — tcpdump: bắt gói trên máy chủ không giao diện (slug khung netdev-11-1-tcpdump). Bài MỞ CHƯƠNG 11 (có khối 🎯).
 * Output thật: lab/out/c111-*.out.txt (dựng lại: bash lab/code/dung-output-ch11.sh).
 */
import { run, card, kv } from '../_ui.mjs';
import G from '../giang/nfd-11-1.mjs';

const L = card;

export default {
  title: '11.1 — tcpdump: capture on a server without a GUI|||11.1 — tcpdump: bắt gói trên máy chủ không giao diện',
  slug: 'netdev-11-1-tcpdump',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lỗi mạng khó chỉ thấy được Ở NƠI xảy ra — trên máy chủ, trong container, không giao diện. tcpdump bắt gói thật ở đó qua SSH, lọc bằng BPF (host/port/tcp) để pcap nhỏ và đọc được, lưu -w rồi mở Wireshark (hoặc đọc -r trên máy). Trong container: bắt trong namespace (nsenter -t PID -n). Đo thật: bắt một curl rồi đọc lại pcap thấy trọn bắt tay + GET + 200 + đóng. Đọc được: SYN không SYN-ACK = cổng; truyền lại = mất gói; RST = từ chối.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>tcpdump: capture on a server without a GUI</h2>
<p class="lead">Every chapter so far ended with "measure it." This chapter is the toolbox for doing exactly that when things go wrong — and it starts with the one tool that lets you see the truth no abstraction can hide: the actual packets. The catch is that the hardest bugs live on a server, often inside a container, reached only over SSH, with no Wireshark and no browser. <code>tcpdump</code> is how you capture packets <em>there</em>, filter them down to the conversation that matters, and carry them back for analysis. Learn it and "the connection is weird" becomes a statement you can prove.</p>

<div class="callout info">
<p><strong>🎯 Chapter 11 at a glance — what you will be able to do after it</strong></p>
<ul>
<li><strong>Capture packets on a headless server</strong> with <code>tcpdump</code>, using BPF filters, into a <code>.pcap</code> — including inside a container.</li>
<li><strong>Read a capture</strong> in Wireshark/tshark: follow a TCP stream, and spot a retransmit, a zero window or an RST.</li>
<li><strong>Measure the path</strong>: <code>curl -w</code> per-stage timing, <code>ping</code> for RTT, <code>mtr</code> for per-hop loss, <code>iperf3</code> for bandwidth.</li>
<li><strong>Diagnose by layers</strong>: a checklist from DNS → routing → port → TLS → HTTP → app, one command per layer.</li>
<li>Turn "it's slow / it's broken" into a <strong>measurement that names the layer</strong> — the method that ends guessing.</li>
</ul>
<p><strong>Why a developer needs this:</strong> "the request hangs", "it works locally but times out in prod", "intermittent resets", "slow only from one region", "is it DNS, the cert, or the app?" are all answerable once you can capture and measure. Everything is run on the base lab with real <code>tcpdump</code>, <code>tshark</code>, <code>mtr</code>, <code>iperf3</code> and <code>openssl</code>.</p>
</div>

<h3>Why capture on the server itself</h3>
<p>A timeout, a reset, a handshake that stalls — these are only visible <em>where they happen</em>. By the time an error reaches your browser, the interesting part (which side sent what, and when) is long gone. <code>tcpdump</code> runs on the box, over SSH, and records the packets as they cross the wire. The workflow is always: reproduce the problem where it occurs, capture the relevant packets with a <strong>filter</strong>, and save to a <code>.pcap</code> for analysis.</p>

<h3>A capture on the lab</h3>
<p>We captured one <code>curl</code> to the web server (<code>tcpdump -i eth0 -w cap.pcap "tcp port 80 and host 10.10.2.10"</code>) and read the file back:</p>
${run('c111-tcpdump', 'tcpdump -r', 1, { cut: 96, max: 9 })}
<p>The whole conversation is there in order: the <strong>handshake</strong> (<code>[S]</code> SYN, <code>[S.]</code> SYN-ACK, <code>[.]</code> ACK), the <code>GET / HTTP/1.1</code>, the server's <code>200 OK</code>, and the close (<code>[F.]</code> FIN). Everything you read as bytes in Chapters 4–7 is right here as packets — the TCP handshake, the HTTP request and response, the teardown.</p>

<h3>BPF filters: catch only what matters</h3>
${kv([
  ['host 10.10.2.10', 'Only traffic to/from that host.'],
  ['tcp port 80', 'Only TCP on port 80.'],
  ['host X and port 443', 'Combine with and / or / not.'],
  ['tcp[tcpflags] & tcp-syn != 0', 'Only SYN packets (handshake starts).'],
])}
<p>A busy server pushes thousands of packets a second; an unfiltered capture is a firehose you cannot read. A <strong>BPF filter</strong> (Berkeley Packet Filter) tells the kernel to hand you only the packets you care about, keeping the <code>.pcap</code> small and the analysis sane.</p>

<h3>Capture now, analyse later</h3>
<p>The <code>-w</code>/<code>-r</code> pair is the key habit: <code>-w cap.pcap</code> writes raw packets to a file (fast, minimal overhead on the server), and you either <code>scp</code> the file to your laptop and open it in <strong>Wireshark</strong> (next lesson) or read it back on the box with <code>tcpdump -r cap.pcap</code> when there is no GUI. Capture tight on the server; analyse richly elsewhere.</p>

<div class="pitfall co-tieu-de">
<p><strong>A container has its own network namespace — <code>tcpdump</code> on the host often sees nothing.</strong> When your service runs in Docker, its packets cross a virtual interface inside the container's own network namespace, so a <code>tcpdump</code> on the host's <code>eth0</code> may capture none of them (or only the bridge side). You have to capture <em>inside</em> the container's namespace: find its main PID (<code>docker inspect</code>) and run <code>nsenter -t &lt;pid&gt; -n tcpdump -i eth0 -w /tmp/cap.pcap …</code>, or start a capture sidecar with <code>docker run --net container:&lt;name&gt;</code>. This needs <code>NET_RAW</code> (and <code>NET_ADMIN</code> for <code>nsenter</code>), which our lab grants. Forgetting the namespace is the classic "I ran tcpdump and saw nothing" — the packets were real, just in a different namespace.</p>
</div>

<h3>What a capture already tells you</h3>
${kv([
  ['SYN with no SYN-ACK', 'Nothing listening, or a firewall dropping — a port problem.'],
  ['Repeated SYN / retransmits', 'Packet loss or an unreachable peer.'],
  ['RST', 'The peer actively refused or reset the connection.'],
  ['A long gap before data', 'The slow hop is between those two packets.'],
])}
<p>The packets do not lie. Before you even open Wireshark, the shape of the capture — what is present and what is missing — points at the layer. That is the raw material the next lesson turns into a diagnosis.</p>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a request to a service "just hangs," and you can only reach the box over SSH. Capture and read the evidence.</p>
<ol>
<li>Bring up the lab: <code>bash lab/code/dung-output-ch11.sh</code>.</li>
<li>On the client, capture a <code>curl</code> to the web server with a filter, write it to <code>/tmp/cap.pcap</code>, and read it back with <code>tcpdump -r</code>.</li>
<li>Identify the handshake (<code>[S]</code>, <code>[S.]</code>, <code>[.]</code>), the <code>GET</code>, the <code>200 OK</code> and the <code>[F.]</code>.</li>
<li>Say what you would conclude from each of: a SYN with no SYN-ACK; repeated SYNs; an RST.</li>
</ol>
<p><strong>Done when:</strong> you have a <code>.pcap</code> you captured and read back, you can point to the handshake and the HTTP exchange in it, and your readings are: SYN/no-SYN-ACK → port closed/filtered; repeated SYN → loss/unreachable; RST → refused/reset.</p>
<details><summary>Solution</summary>
<p>The capture shows, in order, <code>[S]</code> (client SYN), <code>[S.]</code> (server SYN-ACK), <code>[.]</code> (client ACK), then <code>GET / HTTP/1.1</code>, <code>200 OK</code>, and <code>[F.]</code> (FIN). A SYN with no SYN-ACK means nothing is listening or a firewall is dropping (a port problem); repeated SYNs mean packet loss or an unreachable peer; an RST means the peer refused or reset. In a container you would capture with <code>nsenter -t PID -n tcpdump …</code> because the container has its own namespace.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['tcpdump', 'A command-line packet capturer for headless servers.'],
  ['BPF filter', 'A capture expression (host/port/tcp) the kernel applies.'],
  ['.pcap', 'The saved capture file — open it in Wireshark.'],
  ['-w / -r', 'Write packets to a file / read a file back.'],
  ['network namespace', 'A container’s isolated network stack; capture inside it.'],
  ['nsenter', 'Enter another process’s namespace (e.g. a container’s) to capture.'],
  ['SYN / RST / FIN', 'TCP flags: start / reset / finish — visible in a capture.'],
])}

<h3>📌 Summary</h3>
<ul>
<li><strong>tcpdump</strong> captures the actual packets on the server/container where a bug lives — no GUI needed.</li>
<li>A <strong>BPF filter</strong> (<code>host</code>, <code>port</code>, <code>tcp</code>) keeps the capture small and readable.</li>
<li><code>-w cap.pcap</code> saves; open it in <strong>Wireshark</strong> later, or <code>-r</code> to read on the box.</li>
<li>Inside a container, capture in its namespace (<code>nsenter -t PID -n</code>) or the host sees nothing.</li>
<li>The capture shows the handshake, request, retransmits and resets — the raw truth to analyse next.</li>
</ul>
${L('https://www.tcpdump.org/manpages/tcpdump.1.html', '📄', 'tcpdump — manual', 'Options, BPF filter syntax, and reading/writing .pcap.', 'Open')}
${L('https://wizardzines.com/comics/tcpdump/', '📘', 'Julia Evans — tcpdump', 'A one-page visual cheat-sheet for everyday capturing.', 'Open')}
${L('https://www.wireshark.org/docs/wsug_html_chunked/ChapterCapture.html', '📘', 'Wireshark — capturing', 'Capture filters vs display filters, and .pcap handling.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>tcpdump: bắt gói trên máy chủ không giao diện</h2>
<p class="lead">Mọi chương tới giờ đều kết thúc bằng "đo nó đi." Chương này là hộp đồ nghề để làm đúng điều đó khi mọi thứ hỏng — và nó bắt đầu với công cụ duy nhất cho bạn thấy sự thật không trừu tượng nào che được: các gói thật. Cái khó là các lỗi khó nhất sống trên một máy chủ, thường trong một container, chỉ với tới qua SSH, không Wireshark và không trình duyệt. <code>tcpdump</code> là cách bạn bắt gói <em>ở đó</em>, lọc chúng xuống cuộc hội thoại quan trọng, và mang chúng về để phân tích. Học nó và "kết nối kỳ lạ" thành một câu bạn chứng minh được.</p>

<div class="callout info">
<p><strong>🎯 Chương 11 trong một khung — học xong bạn làm được gì</strong></p>
<ul>
<li><strong>Bắt gói trên một máy chủ không giao diện</strong> với <code>tcpdump</code>, dùng bộ lọc BPF, vào một <code>.pcap</code> — kể cả bên trong một container.</li>
<li><strong>Đọc một bản bắt</strong> trong Wireshark/tshark: theo một luồng TCP, và phát hiện một lần truyền lại, một cửa sổ không, hay một RST.</li>
<li><strong>Đo đường đi</strong>: <code>curl -w</code> thời gian từng chặng, <code>ping</code> cho RTT, <code>mtr</code> cho mất gói mỗi hop, <code>iperf3</code> cho băng thông.</li>
<li><strong>Chẩn đoán theo tầng</strong>: một bảng kiểm từ DNS → định tuyến → cổng → TLS → HTTP → app, mỗi tầng một lệnh.</li>
<li>Biến "nó chậm / nó hỏng" thành một <strong>phép đo gọi tên tầng</strong> — phương pháp chấm dứt đoán mò.</li>
</ul>
<p><strong>Vì sao lập trình viên cần:</strong> "yêu cầu treo", "chạy ở máy mà timeout trên prod", "reset gián đoạn", "chậm chỉ ở một vùng", "là DNS, chứng chỉ, hay app?" đều trả lời được một khi bạn bắt và đo được. Mọi thứ chạy trên lab cơ bản với <code>tcpdump</code>, <code>tshark</code>, <code>mtr</code>, <code>iperf3</code> và <code>openssl</code> thật.</p>
</div>

<h3>Vì sao bắt trên chính máy chủ</h3>
<p>Một timeout, một reset, một cú bắt tay kẹt — những cái này chỉ thấy được <em>ở nơi chúng xảy ra</em>. Tới lúc một lỗi đến trình duyệt của bạn, phần thú vị (bên nào gửi gì, và khi nào) đã mất từ lâu. <code>tcpdump</code> chạy trên máy, qua SSH, và ghi các gói khi chúng vượt dây. Quy trình luôn là: tái hiện vấn đề nơi nó xảy ra, bắt các gói liên quan với một <strong>bộ lọc</strong>, và lưu vào một <code>.pcap</code> để phân tích.</p>

<h3>Một bản bắt trên lab</h3>
<p>Ta bắt một <code>curl</code> tới máy chủ web (<code>tcpdump -i eth0 -w cap.pcap "tcp port 80 and host 10.10.2.10"</code>) và đọc tệp lại:</p>
${run('c111-tcpdump', 'tcpdump -r', 1, { cut: 96, max: 9 })}
<p>Cả cuộc hội thoại ở đó theo thứ tự: cú <strong>bắt tay</strong> (<code>[S]</code> SYN, <code>[S.]</code> SYN-ACK, <code>[.]</code> ACK), <code>GET / HTTP/1.1</code>, <code>200 OK</code> của máy chủ, và đóng (<code>[F.]</code> FIN). Mọi thứ bạn đọc dưới dạng byte ở Chương 4–7 ngay đây dưới dạng gói — cú bắt tay TCP, yêu cầu và câu trả lời HTTP, cú tháo.</p>

<h3>Bộ lọc BPF: chỉ bắt cái quan trọng</h3>
${kv([
  ['host 10.10.2.10', 'Chỉ lưu lượng tới/từ host đó.'],
  ['tcp port 80', 'Chỉ TCP trên cổng 80.'],
  ['host X and port 443', 'Kết hợp với and / or / not.'],
  ['tcp[tcpflags] & tcp-syn != 0', 'Chỉ các gói SYN (bắt đầu bắt tay).'],
])}
<p>Một máy chủ bận đẩy hàng nghìn gói mỗi giây; một bản bắt không lọc là một vòi rồng bạn không đọc được. Một <strong>bộ lọc BPF</strong> (Berkeley Packet Filter) bảo nhân chỉ trao bạn các gói bạn quan tâm, giữ <code>.pcap</code> nhỏ và phân tích tỉnh táo.</p>

<h3>Bắt ngay, phân tích sau</h3>
<p>Cặp <code>-w</code>/<code>-r</code> là thói quen then chốt: <code>-w cap.pcap</code> ghi các gói thô vào một tệp (nhanh, chi phí tối thiểu trên máy chủ), và bạn hoặc <code>scp</code> tệp về laptop và mở trong <strong>Wireshark</strong> (bài sau) hoặc đọc nó lại trên máy với <code>tcpdump -r cap.pcap</code> khi không có giao diện. Bắt gọn trên máy chủ; phân tích phong phú nơi khác.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một container có namespace mạng riêng — <code>tcpdump</code> trên host thường không thấy gì.</strong> Khi dịch vụ của bạn chạy trong Docker, gói của nó vượt một giao diện ảo trong namespace mạng riêng của container, nên một <code>tcpdump</code> trên <code>eth0</code> của host có thể không bắt được cái nào (hay chỉ phía bridge). Bạn phải bắt <em>bên trong</em> namespace của container: tìm PID chính của nó (<code>docker inspect</code>) và chạy <code>nsenter -t &lt;pid&gt; -n tcpdump -i eth0 -w /tmp/cap.pcap …</code>, hay khởi động một sidecar bắt gói với <code>docker run --net container:&lt;name&gt;</code>. Cái này cần <code>NET_RAW</code> (và <code>NET_ADMIN</code> cho <code>nsenter</code>), cái lab cấp. Quên namespace là "tôi chạy tcpdump và không thấy gì" kinh điển — các gói có thật, chỉ ở một namespace khác.</p>
</div>

<h3>Một bản bắt đã nói gì</h3>
${kv([
  ['SYN không có SYN-ACK', 'Không gì đang nghe, hay một tường lửa đang bỏ — một vấn đề cổng.'],
  ['SYN lặp lại / truyền lại', 'Mất gói hay một đối tác không với tới được.'],
  ['RST', 'Đối tác chủ động từ chối hay reset kết nối.'],
  ['Một khoảng trống dài trước dữ liệu', 'Chặng chậm nằm giữa hai gói đó.'],
])}
<p>Các gói không nói dối. Trước cả khi bạn mở Wireshark, dáng của bản bắt — cái gì có mặt và cái gì thiếu — chỉ vào tầng. Đó là nguyên liệu bài sau biến thành một chẩn đoán.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một yêu cầu tới một dịch vụ "cứ treo," và bạn chỉ với tới máy qua SSH. Bắt và đọc bằng chứng.</p>
<ol>
<li>Dựng lab: <code>bash lab/code/dung-output-ch11.sh</code>.</li>
<li>Trên client, bắt một <code>curl</code> tới máy chủ web với một bộ lọc, ghi nó vào <code>/tmp/cap.pcap</code>, và đọc nó lại với <code>tcpdump -r</code>.</li>
<li>Nhận ra cú bắt tay (<code>[S]</code>, <code>[S.]</code>, <code>[.]</code>), <code>GET</code>, <code>200 OK</code> và <code>[F.]</code>.</li>
<li>Nói bạn sẽ kết luận gì từ mỗi cái: một SYN không có SYN-ACK; các SYN lặp lại; một RST.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một <code>.pcap</code> bạn đã bắt và đọc lại, bạn chỉ được cú bắt tay và trao đổi HTTP trong nó, và cách đọc của bạn là: SYN/không-SYN-ACK → cổng đóng/bị lọc; SYN lặp lại → mất gói/không với tới; RST → từ chối/reset.</p>
<details><summary>Lời giải</summary>
<p>Bản bắt cho thấy, theo thứ tự, <code>[S]</code> (SYN client), <code>[S.]</code> (SYN-ACK máy chủ), <code>[.]</code> (ACK client), rồi <code>GET / HTTP/1.1</code>, <code>200 OK</code>, và <code>[F.]</code> (FIN). Một SYN không có SYN-ACK nghĩa là không gì đang nghe hay một tường lửa đang bỏ (một vấn đề cổng); các SYN lặp lại nghĩa là mất gói hay một đối tác không với tới; một RST nghĩa là đối tác từ chối hay reset. Trong một container bạn sẽ bắt với <code>nsenter -t PID -n tcpdump …</code> vì container có namespace riêng.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['tcpdump', 'Một bộ bắt gói dòng lệnh cho máy chủ không giao diện.'],
  ['Bộ lọc BPF', 'Một biểu thức bắt (host/port/tcp) nhân áp dụng.'],
  ['.pcap', 'Tệp bắt gói đã lưu — mở nó trong Wireshark.'],
  ['-w / -r', 'Ghi gói vào một tệp / đọc một tệp lại.'],
  ['namespace mạng', 'Ngăn xếp mạng cô lập của một container; bắt bên trong nó.'],
  ['nsenter', 'Vào namespace của một tiến trình khác (vd một container) để bắt.'],
  ['SYN / RST / FIN', 'Cờ TCP: bắt đầu / reset / kết thúc — thấy trong một bản bắt.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><strong>tcpdump</strong> bắt các gói thật trên máy chủ/container nơi một lỗi sống — không cần giao diện.</li>
<li>Một <strong>bộ lọc BPF</strong> (<code>host</code>, <code>port</code>, <code>tcp</code>) giữ bản bắt nhỏ và đọc được.</li>
<li><code>-w cap.pcap</code> lưu; mở nó trong <strong>Wireshark</strong> sau, hay <code>-r</code> để đọc trên máy.</li>
<li>Trong một container, bắt trong namespace của nó (<code>nsenter -t PID -n</code>) không thì host không thấy gì.</li>
<li>Bản bắt cho thấy cú bắt tay, yêu cầu, truyền lại và reset — sự thật thô để phân tích tiếp.</li>
</ul>
${L('https://www.tcpdump.org/manpages/tcpdump.1.html', '📄', 'tcpdump — sổ tay', 'Tuỳ chọn, cú pháp bộ lọc BPF, và đọc/ghi .pcap.', 'Mở')}
${L('https://wizardzines.com/comics/tcpdump/', '📘', 'Julia Evans — tcpdump', 'Một tờ mẹo trực quan một trang cho bắt gói hằng ngày.', 'Mở')}
${L('https://www.wireshark.org/docs/wsug_html_chunked/ChapterCapture.html', '📘', 'Wireshark — bắt gói', 'Bộ lọc bắt so với bộ lọc hiển thị, và xử lý .pcap.', 'Mở')}
</div>
`,
};
