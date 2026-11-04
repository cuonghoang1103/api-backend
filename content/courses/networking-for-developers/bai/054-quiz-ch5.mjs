/** Chương 5 · Quiz — 10 câu tình huống, đáp án rải đều (A×2 · B×3 · C×2 · D×3), dữ liệu từ output thật của lab UDP/QUIC. */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Chapter 5: UDP and QUIC|||Quiz — Chương 5: UDP và QUIC',
  slug: 'netdev-5-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: UDP không bắt tay, nỗ lực tối đa và mất gói, khi nào chọn UDP, socket UNCONN, QUIC = TCP+TLS trên UDP, 1-RTT, bỏ nghẽn đầu hàng, chuyển kết nối, khám phá Alt-Svc, đường lùi khi chặn UDP, vì sao không đọc QUIC bằng tcpdump.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Quiz — UDP and QUIC</h2>
<p class="lead">Ten situations from the lab of this chapter. Most can be answered by reading a capture, an <code>ss</code> line or a <code>curl</code> result the way the lessons taught.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read a UDP exchange and explain why it has no handshake or retransmission.</li>
<li>I can say when UDP beats TCP, and what the app must add.</li>
<li>I can explain what QUIC is, why it is 1-RTT, and how it removes head-of-line blocking.</li>
<li>I can identify HTTP/3 from the server side (UDP listener + Alt-Svc) and explain the fallback.</li>
<li>I can say why you read QUIC from logs, not tcpdump.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Quiz</span>
<h2>Quiz — UDP và QUIC</h2>
<p class="lead">Mười tình huống từ phòng lab của chương. Phần lớn trả lời được bằng cách đọc một bản bắt gói, một dòng <code>ss</code> hay một kết quả <code>curl</code> theo đúng cách các bài đã dạy.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được một trao đổi UDP và giải thích vì sao nó không bắt tay hay truyền lại.</li>
<li>Tôi nói được khi nào UDP thắng TCP, và ứng dụng phải thêm gì.</li>
<li>Tôi giải thích được QUIC là gì, vì sao 1-RTT, và nó bỏ nghẽn đầu hàng ra sao.</li>
<li>Tôi nhận ra HTTP/3 từ phía máy chủ (socket UDP + Alt-Svc) và giải thích đường lùi.</li>
<li>Tôi nói được vì sao đọc QUIC từ log, không phải tcpdump.</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('A tcpdump of a UDP request/response shows two datagrams and nothing else. What is missing compared to a TCP request?', 'Một tcpdump của một yêu cầu/đáp UDP cho thấy hai gói và không gì khác. Thiếu gì so với một yêu cầu TCP?'),
        options: o([['The handshake (SYN, SYN-ACK, ACK) and teardown — UDP has neither', 'Cú bắt tay (SYN, SYN-ACK, ACK) và cú đóng — UDP không có cái nào'], ['The IP header', 'Header IP'], ['The payload', 'Phần tải'], ['The port numbers', 'Số hiệu cổng']]),
        correctIndex: 0, points: 1,
        explanation: ex('UDP sends data in the first packet — there is no handshake and no FIN teardown. The IP header, payload and ports are all present (UDP has source/destination ports). The lab capture showed exactly two useful datagrams, no [S]/[S.]/[.].', 'UDP gửi dữ liệu trong gói đầu — không có bắt tay và không có cú đóng FIN. Header IP, phần tải và cổng đều có (UDP có cổng nguồn/đích). Bản bắt gói trong lab cho thấy đúng hai gói hữu ích, không [S]/[S.]/[.].'),
      },
      {
        question: q('You send 20 UDP datagrams through 30% loss; the server reports it received 12. What does the sender know about the 8 lost ones?', 'Bạn gửi 20 gói UDP qua 30% mất; máy chủ báo nhận 12. Bên gửi biết gì về 8 gói mất?'),
        options: o([['It retransmits them automatically', 'Nó tự truyền lại chúng'], ['Nothing — there is no ACK and no notification of loss', 'Không gì — không ACK và không báo mất'], ['It gets an error after a timeout', 'Nó nhận lỗi sau một timeout'], ['The OS buffers them for retry', 'Hệ điều hành đệm chúng để thử lại']]),
        correctIndex: 1, points: 1,
        explanation: ex('UDP is fire-and-forget: lost datagrams are simply gone, with no ACK, no retransmission and no error to the sender. If the app needs them, the app must detect and recover. The other options describe TCP, not UDP.', 'UDP là gửi-rồi-quên: gói mất đơn giản biến mất, không ACK, không truyền lại và không lỗi cho bên gửi. Nếu ứng dụng cần chúng, ứng dụng phải phát hiện và phục hồi. Các phương án khác mô tả TCP, không phải UDP.'),
      },
      {
        question: q('Which feature is the best fit for UDP rather than TCP?', 'Tính năng nào hợp UDP hơn TCP nhất?'),
        options: o([['Downloading a software update', 'Tải một bản cập nhật phần mềm'], ['A bank transfer', 'Một giao dịch chuyển khoản'], ['A live voice call', 'Một cuộc gọi thoại trực tiếp'], ['Submitting a web form', 'Gửi một biểu mẫu web']]),
        correctIndex: 2, points: 1,
        explanation: ex('A voice call is the classic case: a late packet is useless (the moment passed), so skip it and keep talking — fresh-but-lossy beats complete-but-late. Updates, transfers and form submissions all need every byte, in order: that is TCP.', 'Một cuộc gọi thoại là trường hợp kinh điển: một gói tới trễ là vô dụng (khoảnh khắc đã qua), nên bỏ nó và tiếp tục nói — tươi-mà-mất thắng đầy-đủ-mà-trễ. Cập nhật, chuyển khoản và gửi biểu mẫu đều cần mọi byte, đúng thứ tự: đó là TCP.'),
      },
      {
        question: q('<code>ss -ulnp</code> on a busy DNS server shows one socket in state UNCONN serving thousands of clients. Why no per-client state?', '<code>ss -ulnp</code> trên một máy chủ DNS bận cho thấy một socket ở trạng thái UNCONN phục vụ hàng nghìn client. Vì sao không có trạng thái theo client?'),
        options: o([['The server is misconfigured', 'Máy chủ cấu hình sai'], ['DNS caps connections at one', 'DNS giới hạn kết nối ở một'], ['It uses IPv6 only', 'Nó chỉ dùng IPv6'], ['UDP is connectionless: no handshake, so the kernel keeps no per-peer connection — one socket talks to all', 'UDP không kết nối: không bắt tay, nên nhân không giữ kết nối theo peer — một socket nói với tất cả']]),
        correctIndex: 3, points: 1,
        explanation: ex('A UDP socket is UNCONN from the moment it binds; with no handshake there is no connection to track, so one socket receives from and replies to any number of peers. That is why DNS and game servers scale from a single socket — and why there is never a TIME_WAIT.', 'Một socket UDP là UNCONN từ khi nó bind; không bắt tay nên không có kết nối để theo dõi, nên một socket nhận từ và trả lời bất kỳ số peer nào. Đó là lý do máy chủ DNS và game mở rộng từ một socket — và vì sao không bao giờ có TIME_WAIT.'),
      },
      {
        question: q('In one sentence, what is QUIC?', 'Trong một câu, QUIC là gì?'),
        options: o([['A faster DNS', 'Một DNS nhanh hơn'], ['TCP’s reliability + TLS 1.3, rebuilt as a user-space library on top of UDP', 'Tính tin cậy của TCP + TLS 1.3, dựng lại như một thư viện không gian người dùng trên UDP'], ['A replacement for IP', 'Thứ thay thế IP'], ['A compression algorithm', 'Một thuật toán nén']]),
        correctIndex: 1, points: 1,
        explanation: ex('QUIC rebuilds a reliable, ordered, encrypted connection (everything TCP + TLS give you) as a library over UDP, in user space — which lets it fix TCP’s limits and evolve fast. It is not DNS, not an IP replacement, and not compression.', 'QUIC dựng lại một kết nối đáng tin, có thứ tự, mã hoá (mọi thứ TCP + TLS cho bạn) như một thư viện trên UDP, ở không gian người dùng — cho phép nó sửa giới hạn của TCP và tiến hoá nhanh. Nó không phải DNS, không thay thế IP, không phải nén.'),
      },
      {
        question: q('Why can QUIC establish a secure connection in 1 RTT while classic HTTPS needs 2–3?', 'Vì sao QUIC thiết lập một kết nối an toàn trong 1 RTT còn HTTPS cổ điển cần 2–3?'),
        options: o([['QUIC skips encryption', 'QUIC bỏ mã hoá'], ['QUIC uses a faster CPU', 'QUIC dùng CPU nhanh hơn'], ['QUIC folds the TLS 1.3 handshake into its own, instead of a TCP handshake then a separate TLS handshake', 'QUIC gộp cú bắt tay TLS 1.3 vào cú bắt tay của nó, thay vì một cú bắt tay TCP rồi một cú bắt tay TLS riêng'], ['QUIC has no handshake at all', 'QUIC không có bắt tay nào']]),
        correctIndex: 2, points: 1,
        explanation: ex('Classic HTTPS does a TCP handshake (1 RTT) then a TLS handshake (another) before data. QUIC combines transport and TLS 1.3 into one handshake — 1-RTT, or 0-RTT on resumption. It still encrypts (more than TCP+TLS, in fact) and it does have a handshake.', 'HTTPS cổ điển làm một cú bắt tay TCP (1 RTT) rồi một cú bắt tay TLS (một nữa) trước dữ liệu. QUIC gộp vận chuyển và TLS 1.3 thành một cú bắt tay — 1-RTT, hoặc 0-RTT khi nối lại. Nó vẫn mã hoá (thật ra nhiều hơn TCP+TLS) và nó có bắt tay.'),
      },
      {
        question: q('Over HTTP/2 on one TCP connection, one lost packet stalls all requests. How does HTTP/3 over QUIC avoid this?', 'Trên HTTP/2 trên một kết nối TCP, một gói mất làm kẹt mọi yêu cầu. HTTP/3 trên QUIC tránh điều này thế nào?'),
        options: o([['Each request is its own QUIC stream with its own ordering, so a lost packet stalls only that stream', 'Mỗi yêu cầu là một luồng QUIC riêng với thứ tự riêng, nên một gói mất chỉ kẹt luồng đó'], ['QUIC never loses packets', 'QUIC không bao giờ mất gói'], ['QUIC opens one TCP connection per request', 'QUIC mở một kết nối TCP mỗi yêu cầu'], ['QUIC disables ordering entirely', 'QUIC tắt hẳn thứ tự']]),
        correctIndex: 0, points: 1,
        explanation: ex('QUIC moves ordering above loss recovery: each stream is ordered independently, so a lost packet only holds up its own stream while the others keep flowing. That is the fix for TCP-layer head-of-line blocking (lesson 4.2). QUIC still loses packets and still orders within a stream; it does not use TCP.', 'QUIC dời thứ tự lên trên phục hồi mất gói: mỗi luồng sắp thứ tự độc lập, nên một gói mất chỉ giữ lại luồng của nó trong khi các luồng khác vẫn chảy. Đó là cách sửa nghẽn đầu hàng tầng TCP (bài 4.2). QUIC vẫn mất gói và vẫn sắp thứ tự trong một luồng; nó không dùng TCP.'),
      },
      {
        question: q('You walk out of Wi-Fi onto 4G mid-download. Over TCP the download restarts; over HTTP/3 it continues. Why?', 'Bạn ra khỏi Wi-Fi sang 4G giữa chừng tải. Trên TCP lần tải dựng lại; trên HTTP/3 nó tiếp tục. Vì sao?'),
        options: o([['4G is faster', '4G nhanh hơn'], ['TCP compresses better', 'TCP nén tốt hơn'], ['HTTP/3 caches the file', 'HTTP/3 cache tệp'], ['A QUIC connection is identified by a Connection ID, not the IP:port 4-tuple, so it migrates when the address changes', 'Một kết nối QUIC được định danh bằng Connection ID, không phải bộ-4 IP:cổng, nên nó chuyển khi địa chỉ đổi']]),
        correctIndex: 3, points: 1,
        explanation: ex('A TCP connection is its 4-tuple; a changed IP destroys it. QUIC carries a Connection ID independent of IP:port, so the connection migrates and the download continues. Speed, compression and caching have nothing to do with surviving a network change.', 'Một kết nối TCP là bộ-4 của nó; một IP đổi phá huỷ nó. QUIC mang một Connection ID độc lập với IP:cổng, nên kết nối chuyển và lần tải tiếp tục. Tốc độ, nén và cache không liên quan gì tới việc sống sót qua một lần đổi mạng.'),
      },
      {
        question: q('A site’s HTTP/2 response includes <code>alt-svc: h3=":443"</code>. What does a browser do with it?', 'Câu trả lời HTTP/2 của một site có <code>alt-svc: h3=":443"</code>. Trình duyệt làm gì với nó?'),
        options: o([['Immediately drops the current connection', 'Bỏ ngay kết nối hiện tại'], ['Remembers the site offers HTTP/3 and tries QUIC on UDP 443 on a later connection', 'Nhớ site có HTTP/3 và thử QUIC trên UDP 443 ở một kết nối sau'], ['Blocks the site', 'Chặn site'], ['Switches to IPv6', 'Chuyển sang IPv6']]),
        correctIndex: 1, points: 1,
        explanation: ex('Alt-Svc is how HTTP/3 is discovered: the browser keeps using the current TCP/HTTP-2 connection, remembers the h3 advertisement, and tries QUIC next time. It does not drop the current connection, block anything, or change IP version.', 'Alt-Svc là cách HTTP/3 được khám phá: trình duyệt tiếp tục dùng kết nối TCP/HTTP-2 hiện tại, nhớ quảng cáo h3, và thử QUIC lần sau. Nó không bỏ kết nối hiện tại, không chặn gì, không đổi phiên bản IP.'),
      },
      {
        question: q('On the office network, blocking UDP 443 makes the dashboard slower but it still works, and the Protocol column shows h2. Diagnosis?', 'Trên mạng văn phòng, chặn UDP 443 làm bảng điều khiển chậm hơn nhưng vẫn chạy, và cột Protocol hiện h2. Chẩn đoán?'),
        options: o([['A code bug — redeploy', 'Một lỗi code — triển khai lại'], ['The server is down', 'Máy chủ sập'], ['The firewall drops QUIC (UDP 443), so HTTP/3 silently falls back to HTTP/2 — a network fix, not a code fix', 'Tường lửa vứt QUIC (UDP 443), nên HTTP/3 lặng lẽ lùi về HTTP/2 — sửa mạng, không phải sửa code'], ['DNS is misconfigured', 'DNS cấu hình sai']]),
        correctIndex: 2, points: 1,
        explanation: ex('h2 where you expect h3, slower but working, points straight at a firewall dropping UDP 443: the browser tries QUIC, times out, and silently uses HTTP/2 over the working TCP path. The fix is to open UDP 443 on that network, not to touch the code — exactly the lab’s blocked-QUIC result (still 200 over h2).', 'h2 nơi bạn mong h3, chậm hơn nhưng vẫn chạy, chỉ thẳng vào một tường lửa vứt UDP 443: trình duyệt thử QUIC, hết giờ, và lặng lẽ dùng HTTP/2 trên đường TCP đang chạy. Cách sửa là mở UDP 443 trên mạng đó, không đụng code — đúng kết quả chặn-QUIC của lab (vẫn 200 qua h2).'),
      },
    ],
  },
};
