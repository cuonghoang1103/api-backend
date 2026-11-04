/** Chương 11 · Quiz — 10 câu tình huống, đáp án rải đều (A×3 · B×2 · C×3 · D×2), dữ liệu từ output thật của lab công cụ. */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Chapter 11: Tools and troubleshooting|||Quiz — Chương 11: Công cụ và chẩn đoán',
  slug: 'netdev-11-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: tcpdump + namespace container, bộ lọc BPF, -w/-r, follow stream của tshark, bộ lọc bắt vs hiển thị, retransmit/zero-window/RST, curl -w (TTFB), ping/mtr, iperf3, băng thông vs độ trễ, bảng kiểm theo tầng, nc -zv, openssl s_client.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Quiz — Tools and troubleshooting</h2>
<p class="lead">Ten situations from the chapter's tooling lab. Most can be answered by thinking about what a capture, a timing or a layer check would show.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can capture with tcpdump (incl. in a container) and read a .pcap.</li>
<li>I can follow a TCP stream and filter a capture to HTTP.</li>
<li>I can read curl -w stages, ping, mtr and iperf3.</li>
<li>I can tell bandwidth from latency.</li>
<li>I can walk the layered checklist and name the failing layer.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Quiz</span>
<h2>Quiz — Công cụ và chẩn đoán</h2>
<p class="lead">Mười tình huống từ phòng lab công cụ của chương. Phần lớn trả lời được bằng cách nghĩ một bản bắt, một phép đo thời gian hay một kiểm tầng sẽ cho thấy gì.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi bắt được với tcpdump (kể cả trong container) và đọc một .pcap.</li>
<li>Tôi theo được một luồng TCP và lọc một bản bắt xuống HTTP.</li>
<li>Tôi đọc được các chặng curl -w, ping, mtr và iperf3.</li>
<li>Tôi phân biệt được băng thông với độ trễ.</li>
<li>Tôi đi được bảng kiểm theo tầng và gọi tên tầng hỏng.</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('You run <code>tcpdump</code> on a Docker host and see none of your container\'s traffic. Why?', 'Bạn chạy <code>tcpdump</code> trên một host Docker và không thấy lưu lượng container của bạn. Vì sao?'),
        options: o([['The container has its own network namespace; capture inside it (nsenter -t PID -n)', 'Container có namespace mạng riêng; bắt bên trong nó (nsenter -t PID -n)'], ['tcpdump is broken', 'tcpdump hỏng'], ['Containers have no network', 'Container không có mạng'], ['You need root', 'Bạn cần root']]),
        correctIndex: 0, points: 1,
        explanation: ex('A container runs in its own network namespace, so its packets cross a virtual interface the host’s tcpdump may not see. Capture inside the namespace with nsenter -t PID -n tcpdump, or a sidecar with docker run --net container:name. The tool is not broken, containers do have networking, and root alone does not cross the namespace.', 'Một container chạy trong namespace mạng riêng, nên gói của nó vượt một giao diện ảo mà tcpdump của host có thể không thấy. Bắt bên trong namespace với nsenter -t PID -n tcpdump, hay một sidecar với docker run --net container:name. Công cụ không hỏng, container có mạng, và chỉ root không vượt namespace.'),
      },
      {
        question: q('What does <code>tcpdump -w cap.pcap</code> then <code>tcpdump -r cap.pcap</code> let you do?', '<code>tcpdump -w cap.pcap</code> rồi <code>tcpdump -r cap.pcap</code> cho bạn làm gì?'),
        options: o([['Encrypt the capture', 'Mã hoá bản bắt'], ['Capture fast on the server, then read/analyse the saved packets later (or in Wireshark)', 'Bắt nhanh trên máy chủ, rồi đọc/phân tích các gói đã lưu sau (hay trong Wireshark)'], ['Only count packets', 'Chỉ đếm gói'], ['Speed up the network', 'Tăng tốc mạng']]),
        correctIndex: 1, points: 1,
        explanation: ex('-w writes raw packets to a .pcap with minimal overhead on the server; -r reads them back (or you open the file in Wireshark). This separates capturing from analysing. It does not encrypt, merely count, or affect network speed.', '-w ghi các gói thô vào một .pcap với chi phí tối thiểu trên máy chủ; -r đọc chúng lại (hay bạn mở tệp trong Wireshark). Điều này tách bắt khỏi phân tích. Nó không mã hoá, chỉ đếm, hay ảnh hưởng tốc độ mạng.'),
      },
      {
        question: q('In a capture, you see a client SYN but never a SYN-ACK from the server. What does that suggest?', 'Trong một bản bắt, bạn thấy một SYN của client nhưng không bao giờ một SYN-ACK từ máy chủ. Điều đó gợi ý gì?'),
        options: o([['The response was cached', 'Câu trả lời được cache'], ['TLS failed', 'TLS hỏng'], ['Nothing is listening on that port, or a firewall is dropping it — a port/reachability problem', 'Không gì đang nghe trên cổng đó, hay một tường lửa đang bỏ — một vấn đề cổng/với-tới'], ['The app returned 500', 'App trả 500']]),
        correctIndex: 2, points: 1,
        explanation: ex('A SYN with no SYN-ACK means the server never accepted the connection: nothing is listening on that port, or a firewall silently dropped the SYN. It is a port/reachability problem, below TLS and HTTP. Caching, TLS and a 500 all require the connection to succeed first.', 'Một SYN không có SYN-ACK nghĩa là máy chủ không bao giờ chấp nhận kết nối: không gì đang nghe trên cổng đó, hay một tường lửa âm thầm bỏ SYN. Nó là một vấn đề cổng/với-tới, dưới TLS và HTTP. Cache, TLS và một 500 đều cần kết nối thành công trước.'),
      },
      {
        question: q('A request is slow. The capture shows a single 3 s gap with NO retransmissions, right before the response. Who is to blame?', 'Một yêu cầu chậm. Bản bắt cho thấy một khoảng trống đơn 3 giây KHÔNG truyền lại, ngay trước câu trả lời. Ai đáng trách?'),
        options: o([['The client', 'Client'], ['DNS', 'DNS'], ['Packet loss', 'Mất gói'], ['The server/app (it was thinking) — not the network', 'Máy chủ/app (nó đang nghĩ) — không phải mạng']]),
        correctIndex: 3, points: 1,
        explanation: ex('A single gap with no retransmissions, right before the response, is the server computing the answer — the app or database is slow, not the network. Scattered retransmissions across the transfer would indicate network loss. It is not the client, DNS (that is before connect), or loss (there are no retransmissions).', 'Một khoảng trống đơn không truyền lại, ngay trước câu trả lời, là máy chủ đang tính câu trả lời — app hay cơ sở dữ liệu chậm, không phải mạng. Truyền lại rải khắp cuộc truyền sẽ chỉ mất gói mạng. Không phải client, DNS (đó là trước connect), hay mất gói (không có truyền lại).'),
      },
      {
        question: q('In <code>curl -w</code>, a large <code>time_starttransfer</code> (TTFB) with a small <code>time_connect</code> points at…', 'Trong <code>curl -w</code>, một <code>time_starttransfer</code> (TTFB) lớn với một <code>time_connect</code> nhỏ chỉ vào…'),
        options: o([['The server being slow to produce the first byte (app/DB)', 'Máy chủ chậm tạo ra byte đầu (app/DB)'], ['DNS', 'DNS'], ['Bandwidth', 'Băng thông'], ['The TLS cert', 'Cert TLS']]),
        correctIndex: 0, points: 1,
        explanation: ex('time_connect being small means the network/TCP (and TLS) were fine; a large time_starttransfer (TTFB) is the gap from connected to first byte — the server’s thinking time, i.e. the app or database. DNS shows in time_namelookup, bandwidth is not a curl -w stage, and the cert shows in time_appconnect.', 'time_connect nhỏ nghĩa là mạng/TCP (và TLS) ổn; một time_starttransfer (TTFB) lớn là khoảng trống từ đã-nối tới byte đầu — thời gian máy chủ nghĩ, tức app hay cơ sở dữ liệu. DNS hiện ở time_namelookup, băng thông không phải một chặng curl -w, và cert hiện ở time_appconnect.'),
      },
      {
        question: q('A big file transfers slowly but <code>ping</code> RTT is low and loss is 0%. Which tool confirms the bottleneck?', 'Một tệp lớn truyền chậm nhưng RTT <code>ping</code> thấp và mất 0%. Công cụ nào xác nhận nút thắt?'),
        options: o([['ping again', 'ping lại'], ['dig', 'dig'], ['iperf3 — it measures bandwidth, which ping does not', 'iperf3 — nó đo băng thông, cái ping không đo'], ['openssl', 'openssl']]),
        correctIndex: 2, points: 1,
        explanation: ex('Low RTT and no loss rule out a latency/loss problem, so a slow large transfer is likely bandwidth — measure it with iperf3 (-s one side, -c the other). ping measures latency/loss, dig is DNS, openssl is TLS; none measures bandwidth.', 'RTT thấp và không mất loại một vấn đề độ trễ/mất, nên một cuộc truyền lớn chậm có khả năng là băng thông — đo nó với iperf3 (-s một bên, -c bên kia). ping đo độ trễ/mất, dig là DNS, openssl là TLS; không cái nào đo băng thông.'),
      },
      {
        question: q('A page makes 30 sequential round trips at 100 ms each. Will a bigger (higher-bandwidth) link make it fast?', 'Một trang làm 30 vòng khứ hồi tuần tự mỗi cái 100 ms. Một link lớn hơn (băng thông cao hơn) có làm nó nhanh không?'),
        options: o([['Yes, bandwidth fixes everything', 'Có, băng thông sửa mọi thứ'], ['No — it is latency × round trips (~3 s); fix it with fewer/closer round trips (keep-alive, HTTP/2, CDN)', 'Không — đó là độ trễ × vòng khứ hồi (~3 giây); sửa bằng ít/gần vòng khứ hồi hơn (keep-alive, HTTP/2, CDN)'], ['Yes, if you add more DNS', 'Có, nếu thêm DNS'], ['No, nothing can help', 'Không, không gì giúp được']]),
        correctIndex: 1, points: 1,
        explanation: ex('30 × 100 ms = 3 s is bounded by latency and the number of round trips, not bandwidth, so a fatter pipe does nothing. The fix is fewer or closer round trips: keep-alive (skip handshakes), HTTP/2 (one connection), a CDN (nearer edge). It is not bandwidth, not DNS, and it is fixable.', '30 × 100 ms = 3 giây bị chặn bởi độ trễ và số vòng khứ hồi, không phải băng thông, nên một ống béo hơn chẳng làm gì. Cách sửa là ít hay gần vòng khứ hồi hơn: keep-alive (bỏ bắt tay), HTTP/2 (một kết nối), một CDN (biên gần hơn). Không phải băng thông, không phải DNS, và sửa được.'),
      },
      {
        question: q('Using the layered checklist, which single command answers "is anything listening on the port?"', 'Dùng bảng kiểm theo tầng, lệnh đơn nào trả lời "có gì đang nghe trên cổng không?"'),
        options: o([['dig', 'dig'], ['ip route get', 'ip route get'], ['openssl s_client', 'openssl s_client'], ['nc -zv host port', 'nc -zv host port']]),
        correctIndex: 3, points: 1,
        explanation: ex('nc -zv host port tests the port layer: it reports "succeeded" if something is listening, or "refused/timeout" if not. dig is the DNS layer, ip route get is routing, openssl s_client is TLS. Each layer has its own one command.', 'nc -zv host port thử tầng cổng: nó báo "succeeded" nếu có gì đang nghe, hay "refused/timeout" nếu không. dig là tầng DNS, ip route get là định tuyến, openssl s_client là TLS. Mỗi tầng có một lệnh riêng.'),
      },
      {
        question: q('"It works on my machine but fails in production." What does the layered method say this is?', '"Chạy ở máy tôi nhưng hỏng trên production." Phương pháp theo tầng nói đây là gì?'),
        options: o([['Bad luck', 'Xui'], ['A compiler bug', 'Lỗi trình biên dịch'], ['A layer that differs between the two — run the same checklist both places and compare', 'Một tầng khác biệt giữa hai — chạy cùng bảng kiểm hai nơi và so'], ['Always DNS', 'Luôn là DNS']]),
        correctIndex: 2, points: 1,
        explanation: ex('"Works here, not there" is always some layer that differs between the environments — a resolver, a firewall rule, a cert, an env var, a proxy. Running the identical layer checklist in both places and comparing finds the first layer whose answer differs. It is not luck, a compiler bug, or always DNS.', '"Chạy đây, không chạy đó" luôn là một tầng nào đó khác biệt giữa các môi trường — một resolver, một luật tường lửa, một cert, một biến môi trường, một proxy. Chạy bảng kiểm tầng y hệt ở cả hai nơi và so tìm tầng đầu tiên có câu trả lời khác. Không phải xui, lỗi trình biên dịch, hay luôn là DNS.'),
      },
      {
        question: q('Small requests work but large ones hang; the layered checklist points below HTTP. The classic cause is…', 'Yêu cầu nhỏ chạy nhưng lớn treo; bảng kiểm theo tầng chỉ dưới HTTP. Nguyên nhân kinh điển là…'),
        options: o([['An MTU black hole — oversized packets dropped with path-MTU-discovery blocked', 'Một hố đen MTU — gói quá cỡ bị bỏ với path-MTU-discovery bị chặn'], ['A slow database', 'Một cơ sở dữ liệu chậm'], ['An expired cert', 'Một cert hết hạn'], ['A 404', 'Một 404']]),
        correctIndex: 0, points: 1,
        explanation: ex('Small requests fitting in one packet work while large ones (needing big packets) hang is the signature of an MTU black hole: oversized packets are dropped and path MTU discovery is blocked, so the sender never learns to shrink them. A slow DB or expired cert would affect all requests; a 404 is an HTTP answer, not a hang.', 'Yêu cầu nhỏ vừa một gói chạy trong khi lớn (cần gói to) treo là dấu hiệu của một hố đen MTU: gói quá cỡ bị bỏ và path MTU discovery bị chặn, nên bên gửi không bao giờ học thu nhỏ chúng. Một DB chậm hay cert hết hạn sẽ ảnh hưởng mọi yêu cầu; một 404 là một câu trả lời HTTP, không phải một lần treo.'),
      },
    ],
  },
};
