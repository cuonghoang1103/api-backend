/** Chương 4 · Quiz — 10 câu tình huống, đáp án rải đều (A×3 · B×3 · C×2 · D×2), dữ liệu từ output thật của lab TCP. */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Chapter 4: TCP|||Quiz — Chương 4: TCP',
  slug: 'netdev-4-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: đọc bắt tay/đóng, connect vs ttfb, RST khác timeout, số thứ tự, SACK, nghẽn đầu hàng, slow start và cwnd, TIME_WAIT và cạn cổng, hàng đợi accept, Nagle × delayed-ACK, connect timeout.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Quiz — TCP</h2>
<p class="lead">Ten situations from the lab of this chapter. Most can be answered by reading a capture, an <code>ss</code> line or a <code>curl -w</code> result the way the lessons taught.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read a handshake and a teardown in tcpdump, and tell RST from a dropped SYN.</li>
<li>I can explain why a new connection costs a round trip and how keep-alive removes it.</li>
<li>I can describe retransmission, SACK and head-of-line blocking.</li>
<li>I can read slow start in <code>ss -ti</code>, and explain TIME_WAIT, port exhaustion and the accept queue.</li>
<li>I can tell a connect timeout from a read timeout, and recognise the Nagle stall.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Quiz</span>
<h2>Quiz — TCP</h2>
<p class="lead">Mười tình huống từ phòng lab của chương. Phần lớn trả lời được bằng cách đọc một bản bắt gói, một dòng <code>ss</code> hay một kết quả <code>curl -w</code> theo đúng cách các bài đã dạy.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được cú bắt tay và cú đóng trong tcpdump, và phân biệt RST với SYN bị vứt.</li>
<li>Tôi giải thích được vì sao kết nối mới tốn một vòng khứ hồi và keep-alive bỏ nó ra sao.</li>
<li>Tôi mô tả được truyền lại, SACK và nghẽn đầu hàng.</li>
<li>Tôi đọc được slow start trong <code>ss -ti</code>, và giải thích TIME_WAIT, cạn cổng và hàng đợi accept.</li>
<li>Tôi phân biệt được connect timeout với read timeout, và nhận ra cú kẹt Nagle.</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('A capture shows <code>[S]</code> then, 25 ms later, <code>[S.]</code>, then <code>[.]</code>, then <code>[P.] GET</code>. What is the 25 ms?', 'Một bản bắt gói cho thấy <code>[S]</code> rồi 25 ms sau là <code>[S.]</code>, rồi <code>[.]</code>, rồi <code>[P.] GET</code>. 25 ms là gì?'),
        options: o([['The server’s processing time', 'Thời gian xử lý của máy chủ'], ['The TLS handshake', 'Cú bắt tay TLS'], ['DNS resolution', 'Phân giải DNS'], ['One round trip: SYN out and SYN-ACK back', 'Một vòng khứ hồi: SYN đi và SYN-ACK về']]),
        correctIndex: 3, points: 1,
        explanation: ex('The gap between the SYN and the SYN-ACK is one round trip — here the 25 ms the router added to replies. Data (the GET) only flows after the third packet, so the first byte waits this round trip. There is no TLS on port 80, and DNS happened before any packet.', 'Khoảng cách giữa SYN và SYN-ACK là một vòng khứ hồi — ở đây là 25 ms router thêm vào chiều hồi đáp. Dữ liệu (GET) chỉ chảy sau gói thứ ba, nên byte đầu chờ vòng này. Không có TLS trên cổng 80, và DNS xảy ra trước mọi gói.'),
      },
      {
        question: q('Three separate requests each show <code>connect=0.026</code>, but three URLs in one <code>curl</code> show <code>num_connects=1</code> then <code>0,0</code> with <code>ttfb</code> dropping to ~0.027. Why?', 'Ba yêu cầu riêng mỗi cái <code>connect=0.026</code>, nhưng ba URL trong một <code>curl</code> cho <code>num_connects=1</code> rồi <code>0,0</code> với <code>ttfb</code> tụt còn ~0.027. Vì sao?'),
        options: o([['The server cached the response', 'Máy chủ đã cache câu trả lời'], ['Keep-alive reused the open connection, skipping the handshake for requests 2 and 3', 'Keep-alive dùng lại kết nối đang mở, bỏ cú bắt tay cho yêu cầu 2 và 3'], ['DNS was cached the second time', 'DNS được cache lần thứ hai'], ['The second requests used UDP', 'Các yêu cầu sau dùng UDP']]),
        correctIndex: 1, points: 1,
        explanation: ex('A single curl with several URLs keeps the connection alive, so only the first request pays the handshake round trip; the rest reuse it and drop to one round trip. It is not response caching (the body is served fresh) nor DNS (same host, already resolved).', 'Một curl với nhiều URL giữ kết nối sống, nên chỉ yêu cầu đầu trả vòng bắt tay; phần còn lại dùng lại và tụt còn một vòng. Không phải cache câu trả lời (thân vẫn phục vụ mới) cũng không phải DNS (cùng host, đã phân giải).'),
      },
      {
        question: q('Service A errors in 3 ms with “connection refused”; service B hangs ~2 minutes then errors. What does each mean?', 'Dịch vụ A lỗi trong 3 ms với “connection refused”; dịch vụ B treo ~2 phút rồi lỗi. Mỗi cái nghĩa là gì?'),
        options: o([['Both are DNS failures', 'Cả hai là lỗi DNS'], ['A is overloaded, B is fine', 'A quá tải, B ổn'], ['A got a RST (port closed / app down); B’s SYN was silently dropped (firewall/dead host), retransmitted, then timed out', 'A nhận RST (cổng đóng / app tắt); SYN của B bị vứt âm thầm (tường lửa/máy chết), truyền lại, rồi hết giờ'], ['Both are certificate errors', 'Cả hai là lỗi chứng chỉ']]),
        correctIndex: 2, points: 1,
        explanation: ex('A RST comes back instantly when a port is closed — exit 7, milliseconds. A dropped SYN gets no answer, so the kernel retransmits (1, 2, 4, 8 s…) and gives up after ~2 minutes — exit 28. The time to fail is the diagnosis: fast = refused, slow = blackholed.', 'Một RST quay về ngay khi cổng đóng — exit 7, vài mili giây. SYN bị vứt không có câu trả lời, nên nhân truyền lại (1, 2, 4, 8 s…) và bỏ cuộc sau ~2 phút — exit 28. Thời gian hỏng chính là chẩn đoán: nhanh = bị từ chối, chậm = bị hố đen.'),
      },
      {
        question: q('In a capture, the server’s data segment has <code>seq 390</code> and length 2896; the next server segment starts at <code>seq ?</code>', 'Trong một bản bắt gói, đoạn dữ liệu của máy chủ có <code>seq 390</code> dài 2896; đoạn kế của máy chủ bắt đầu ở <code>seq ?</code>'),
        options: o([['391', '391'], ['3286', '3286'], ['2896', '2896'], ['It restarts at 0', 'Bắt đầu lại từ 0']]),
        correctIndex: 1, points: 1,
        explanation: ex('A sequence number counts bytes: the next segment starts at 390 + 2896 = 3286. It does not increment by one (that counts packets) and does not reset. This is exactly what the lab capture of /big showed.', 'Số thứ tự đếm byte: đoạn kế bắt đầu ở 390 + 2896 = 3286. Nó không tăng một (đó là đếm gói) và không reset. Đây đúng là điều bản bắt gói /big trong lab cho thấy.'),
      },
      {
        question: q('Over one TCP connection carrying many HTTP/2 streams, one packet is lost. What happens to the other streams?', 'Trên một kết nối TCP mang nhiều luồng HTTP/2, một gói bị mất. Các luồng khác ra sao?'),
        options: o([['They are unaffected', 'Không bị ảnh hưởng'], ['They all stall until the lost packet is retransmitted (head-of-line blocking)', 'Tất cả kẹt tới khi gói mất được truyền lại (nghẽn đầu hàng)'], ['They switch to UDP', 'Chúng chuyển sang UDP'], ['The connection resets', 'Kết nối bị reset']]),
        correctIndex: 1, points: 1,
        explanation: ex('TCP delivers one ordered byte stream, so a gap holds back everything behind it — including data for other HTTP/2 streams that already arrived. That is TCP-layer head-of-line blocking, the problem QUIC/HTTP/3 fix by giving each stream its own ordering.', 'TCP giao một luồng byte có thứ tự, nên một lỗ hổng giữ lại mọi thứ phía sau — kể cả dữ liệu cho các luồng HTTP/2 khác đã tới. Đó là nghẽn đầu hàng tầng TCP, vấn đề QUIC/HTTP/3 sửa bằng cách cho mỗi luồng thứ tự riêng.'),
      },
      {
        question: q('<code>ss -ti</code> early in a transfer shows <code>cwnd:10</code>; a few round trips later <code>cwnd:133</code>, then <code>cwnd:1086</code>. What is happening?', '<code>ss -ti</code> đầu một lần truyền cho <code>cwnd:10</code>; vài vòng sau <code>cwnd:133</code>, rồi <code>cwnd:1086</code>. Chuyện gì xảy ra?'),
        options: o([['Slow start: the congestion window roughly doubles each round trip', 'Slow start: cửa sổ tắc nghẽn gần như gấp đôi mỗi vòng'], ['The receive window shrank', 'Cửa sổ nhận co lại'], ['Packet loss each round', 'Mất gói mỗi vòng'], ['The MSS changed', 'MSS thay đổi']]),
        correctIndex: 0, points: 1,
        explanation: ex('That exponential growth of cwnd per round trip is slow start probing for capacity. A short request finishes while still in slow start and never reaches full speed. Loss would cut cwnd, not grow it; rwnd and MSS are separate.', 'Sự tăng theo hàm mũ của cwnd mỗi vòng là slow start dò sức chứa. Một yêu cầu ngắn kết thúc khi còn slow start và không bao giờ đạt tốc độ tối đa. Mất gói sẽ cắt cwnd, không làm lớn; rwnd và MSS là chuyện riêng.'),
      },
      {
        question: q('A batch job opening a new connection per call starts failing with “cannot assign requested address”, then recovers minutes later. Cause?', 'Một việc chạy lô mở kết nối mới mỗi lần gọi bắt đầu hỏng với “cannot assign requested address”, rồi tự khỏi vài phút sau. Nguyên nhân?'),
        options: o([['DNS rate limiting', 'DNS bị giới hạn tốc độ'], ['The server crashed', 'Máy chủ sập'], ['Ephemeral port exhaustion: ports are all in TIME_WAIT until they expire', 'Cạn cổng tạm: các cổng đều trong TIME_WAIT tới khi hết hạn'], ['IPv6 was disabled', 'IPv6 bị tắt']]),
        correctIndex: 2, points: 1,
        explanation: ex('Each short connection the client actively closes sits in TIME_WAIT (~60 s), locking its source port to that destination. Churn enough and you run out — EADDRNOTAVAIL — until they expire. The fix is a keep-alive pool, not more DNS or a restart. In the lab, forcing 3 ports made the 4th fail with exit 45.', 'Mỗi kết nối ngắn client đóng chủ động nằm trong TIME_WAIT (~60 s), khoá cổng nguồn của nó với đích đó. Xoay vòng đủ nhiều thì hết — EADDRNOTAVAIL — tới khi chúng hết hạn. Cách sửa là một pool keep-alive, không phải thêm DNS hay khởi động lại. Trong lab, ép 3 cổng làm cái thứ 4 hỏng exit 45.'),
      },
      {
        question: q('Under load, <code>ss -ltn</code> shows the listening socket’s <code>Recv-Q</code> stuck at <code>Send-Q</code> (511), and clients time out although the process is alive. What is this?', 'Khi tải cao, <code>ss -ltn</code> cho thấy <code>Recv-Q</code> của socket nghe kẹt ở <code>Send-Q</code> (511), và client hết giờ dù tiến trình còn sống. Đây là gì?'),
        options: o([['A memory leak', 'Rò bộ nhớ'], ['TIME_WAIT exhaustion', 'Cạn TIME_WAIT'], ['The congestion window collapsed', 'Cửa sổ tắc nghẽn sụp'], ['The accept queue is full: the app accepts too slowly, so new SYNs are dropped', 'Hàng đợi accept đầy: ứng dụng accept quá chậm, nên SYN mới bị vứt']]),
        correctIndex: 3, points: 1,
        explanation: ex('Recv-Q at the Send-Q cap on a LISTEN socket means completed handshakes are waiting and the app is not calling accept() fast enough; past the cap, SYNs are dropped and clients time out. Raise somaxconn AND the app’s listen backlog, and speed up accept. It is not memory, TIME_WAIT, or cwnd.', 'Recv-Q ở trần Send-Q trên một socket LISTEN nghĩa là các cú bắt tay xong đang chờ và ứng dụng không gọi accept() đủ nhanh; quá trần, SYN bị vứt và client hết giờ. Nâng somaxconn VÀ backlog của listen, và làm accept nhanh hơn. Không phải bộ nhớ, TIME_WAIT hay cwnd.'),
      },
      {
        question: q('An RPC call that splits its request into two small writes measures 57 ms/transaction with Nagle on and 30 ms with <code>setNoDelay(true)</code>. What caused the extra time?', 'Một lời gọi RPC tách yêu cầu làm hai lần ghi nhỏ đo được 57 ms/giao dịch khi bật Nagle và 30 ms với <code>setNoDelay(true)</code>. Cái gì gây thêm thời gian?'),
        options: o([['TLS renegotiation', 'Thương lượng lại TLS'], ['Packet loss', 'Mất gói'], ['Slow start', 'Slow start'], ['Nagle holding the second write until the first is acked, plus the receiver’s delayed ACK', 'Nagle giữ lần ghi thứ hai tới khi lần đầu được báo nhận, cộng delayed ACK của bên nhận']]),
        correctIndex: 3, points: 1,
        explanation: ex('Nagle + delayed ACK on a write-write-read pattern adds a ~40 ms stall per transaction; TCP_NODELAY (or coalescing the two writes into one) removes it. It is not TLS, loss, or slow start — the difference is exactly the delayed-ACK timer.', 'Nagle + delayed ACK trên kiểu ghi-ghi-đọc thêm một cú kẹt ~40 ms mỗi giao dịch; TCP_NODELAY (hoặc gộp hai lần ghi thành một) bỏ nó. Không phải TLS, mất gói hay slow start — chênh lệch đúng bằng bộ đếm delayed-ACK.'),
      },
      {
        question: q('A WebSocket “works for a while then freezes” with no error, behind a corporate NAT. Most likely cause and fix?', 'Một WebSocket “chạy một lúc rồi đơ” không báo lỗi, sau một NAT công ty. Nguyên nhân và cách sửa khả dĩ nhất?'),
        options: o([['The NAT dropped the idle connection’s state silently; add TCP keepalive (minutes) or app-level pings', 'NAT vứt trạng thái kết nối rảnh âm thầm; thêm TCP keepalive (vài phút) hoặc ping ở mức ứng dụng'], ['The server ran out of RAM', 'Máy chủ hết RAM'], ['TLS certificate expired mid-connection', 'Chứng chỉ TLS hết hạn giữa kết nối'], ['The congestion window hit zero', 'Cửa sổ tắc nghẽn về 0']]),
        correctIndex: 0, points: 1,
        explanation: ex('A stateful NAT/firewall drops idle entries after minutes without telling either end, so the next write hangs. TCP keepalive defaults to 2 hours — too long — so set it low or send heartbeats. It is not RAM, TLS (that would error) or cwnd (which never silently freezes a connection).', 'Một NAT/tường lửa có trạng thái vứt mục rảnh sau vài phút mà không báo bên nào, nên lần ghi kế treo. TCP keepalive mặc định 2 giờ — quá dài — nên hạ nó hoặc gửi nhịp tim. Không phải RAM, TLS (sẽ báo lỗi) hay cwnd (không bao giờ đơ kết nối âm thầm).'),
      },
    ],
  },
};
