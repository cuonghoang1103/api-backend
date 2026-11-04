/** Chương 9 · Quiz — 10 câu tình huống, đáp án rải đều (A×3 · B×2 · C×3 · D×2), dữ liệu từ output thật của lab thời gian thực. */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Chapter 9: Real-time connections|||Quiz — Chương 9: Kết nối thời gian thực',
  slug: 'netdev-9-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: polling vs long-polling vs SSE, đệm proxy nuốt SSE, EventSource tự nối lại, cú nâng 101 và Sec-WebSocket-Accept, frame/mặt nạ, nhịp tim ping/idle timeout, trần file descriptor, backoff + nhiễu/bầy đàn, STUN ánh xạ NAT, TURN, signalling.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Quiz — Real-time connections</h2>
<p class="lead">Ten situations from the chapter's real-time lab. Most can be answered by reading a header, a handshake or a measurement the way the lessons taught.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can choose between polling, long-polling, SSE and WebSocket by cost.</li>
<li>I can explain the 101 upgrade and the Sec-WebSocket-Accept handshake.</li>
<li>I know why an SSE stream freezes behind a buffering proxy.</li>
<li>I can size a real-time service by connections and plan reconnects.</li>
<li>I can explain STUN, ICE, TURN and whose job signalling is.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Quiz</span>
<h2>Quiz — Kết nối thời gian thực</h2>
<p class="lead">Mười tình huống từ phòng lab thời gian thực của chương. Phần lớn trả lời được bằng cách đọc một header, một cú bắt tay hay một phép đo theo đúng cách các bài đã dạy.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chọn được giữa polling, long-polling, SSE và WebSocket theo chi phí.</li>
<li>Tôi giải thích được cú nâng 101 và cú bắt tay Sec-WebSocket-Accept.</li>
<li>Tôi biết vì sao một dòng SSE đóng băng sau một proxy đệm.</li>
<li>Tôi đo được một dịch vụ thời gian thực theo kết nối và lập kế hoạch nối lại.</li>
<li>Tôi giải thích được STUN, ICE, TURN và signalling là việc của ai.</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('You need to show a one-way live build log in the browser. Which technique is the simplest fit?', 'Bạn cần hiện một build log trực tiếp một chiều trong trình duyệt. Kỹ thuật nào hợp đơn giản nhất?'),
        options: o([['SSE (EventSource) — one connection, server pushes events, auto-reconnect', 'SSE (EventSource) — một kết nối, máy chủ đẩy sự kiện, tự nối lại'], ['WebSocket', 'WebSocket'], ['Polling every 100 ms', 'Polling mỗi 100 ms'], ['WebRTC data channel', 'Kênh dữ liệu WebRTC']]),
        correctIndex: 0, points: 1,
        explanation: ex('A build log is one-way server→client, which is exactly what SSE does: one connection, pushed events, and free auto-reconnect via EventSource. WebSocket is two-way overkill, fast polling is wasteful, and WebRTC is for peer-to-peer media.', 'Một build log là một chiều máy-chủ→client, đúng cái SSE làm: một kết nối, sự kiện đẩy, và tự nối lại miễn phí qua EventSource. WebSocket là hai-chiều thừa, polling nhanh lãng phí, và WebRTC dành cho media ngang hàng.'),
      },
      {
        question: q('A long-poll request\'s <code>time_total</code> is ~2 s while the server\'s counter ticks every 2 s. What does that tell you?', '<code>time_total</code> của một yêu cầu long-poll là ~2 giây trong khi bộ đếm của máy chủ nhích mỗi 2 giây. Điều đó cho bạn biết gì?'),
        options: o([['The network is slow', 'Mạng chậm'], ['The server HELD the request until the next change, instead of answering immediately', 'Máy chủ GIỮ yêu cầu tới thay đổi kế, thay vì trả lời ngay'], ['The request timed out', 'Yêu cầu hết giờ'], ['The response was cached', 'Câu trả lời được cache']]),
        correctIndex: 1, points: 1,
        explanation: ex('Long-polling means the server does not answer until it has news. A time_total matching the tick interval shows the request waited for the next change rather than returning a duplicate immediately — the whole point, delivering news instantly with far fewer requests. It is not latency, a timeout or caching.', 'Long-polling nghĩa là máy chủ không trả lời tới khi có tin. time_total khớp khoảng nhịp cho thấy yêu cầu đã chờ thay đổi kế thay vì trả một bản trùng ngay — đúng mục đích, giao tin tức thì với ít yêu cầu hơn nhiều. Không phải độ trễ, timeout hay cache.'),
      },
      {
        question: q('Your SSE endpoint works locally but shows nothing in production behind nginx. Most likely cause?', 'Điểm cuối SSE của bạn chạy ở máy mà không hiện gì trên production sau nginx. Nguyên nhân có khả năng nhất?'),
        options: o([['The browser does not support SSE', 'Trình duyệt không hỗ trợ SSE'], ['The certificate expired', 'Chứng chỉ hết hạn'], ['nginx is buffering the stream; you need X-Accel-Buffering: no / proxy_buffering off', 'nginx đang đệm dòng; bạn cần X-Accel-Buffering: no / proxy_buffering off'], ['SSE requires HTTP/2', 'SSE cần HTTP/2']]),
        correctIndex: 2, points: 1,
        explanation: ex('An SSE response is a never-ending text/event-stream, and nginx buffers upstream responses by default, so it holds the events and the stream looks frozen. Sending X-Accel-Buffering: no (and proxy_buffering off) lets events flow — the number-one SSE "works on my machine" bug. It is not browser support, the certificate or HTTP/2.', 'Một câu trả lời SSE là một text/event-stream không kết thúc, và nginx đệm câu trả lời thượng nguồn mặc định, nên nó giữ các sự kiện và dòng trông đóng băng. Gửi X-Accel-Buffering: no (và proxy_buffering off) để sự kiện chảy — lỗi "chạy ở máy tôi" số một của SSE. Không phải hỗ trợ trình duyệt, chứng chỉ hay HTTP/2.'),
      },
      {
        question: q('A WebSocket handshake sends <code>Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==</code>. What must the server return?', 'Một cú bắt tay WebSocket gửi <code>Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==</code>. Máy chủ phải trả gì?'),
        options: o([['The same key echoed back', 'Chính khoá đó vọng lại'], ['A random value', 'Một giá trị ngẫu nhiên'], ['Nothing — the key is ignored', 'Không gì — khoá bị bỏ qua'], ['Sec-WebSocket-Accept = base64(SHA-1(key + fixed GUID)) = s3pPLMBiTxaQ9kYGzzhZRbK+xOo=', 'Sec-WebSocket-Accept = base64(SHA-1(key + GUID cố định)) = s3pPLMBiTxaQ9kYGzzhZRbK+xOo=']]),
        correctIndex: 3, points: 1,
        explanation: ex('The accept is base64(SHA-1(key + 258EAFA5-E914-47DA-95CA-C5AB0DC85B11)), a fixed GUID from RFC 6455, so this sample key deterministically yields s3pPLMBiTxaQ9kYGzzhZRbK+xOo=. It proves the server understood the upgrade (not a blind echo or random value), and a client that gets the wrong value must abort.', 'accept là base64(SHA-1(key + 258EAFA5-E914-47DA-95CA-C5AB0DC85B11)), một GUID cố định từ RFC 6455, nên khoá mẫu này tất định cho ra s3pPLMBiTxaQ9kYGzzhZRbK+xOo=. Nó chứng minh máy chủ hiểu cú nâng (không phải vọng mù hay giá trị ngẫu nhiên), và một client nhận giá trị sai phải huỷ.'),
      },
      {
        question: q('A WebSocket drops almost exactly every 60 seconds when the user is idle. Cause and fix?', 'Một WebSocket rớt gần như đúng mỗi 60 giây khi người dùng không hoạt động. Nguyên nhân và cách sửa?'),
        options: o([['A proxy/LB idle timeout closes the silent connection; send ping/pong heartbeats', 'Một idle timeout của proxy/LB đóng kết nối im; gửi nhịp tim ping/pong'], ['The server is out of memory', 'Máy chủ hết bộ nhớ'], ['The key expired', 'Khoá hết hạn'], ['The browser tab is throttled', 'Tab trình duyệt bị bóp']]),
        correctIndex: 0, points: 1,
        explanation: ex('An idle connection with no bytes looks dead to a proxy or load balancer, which closes it on an idle timeout (commonly ~60 s). The fix is a periodic ping (every 20–30 s) so the line is never idle, treating a missing pong as a dead peer, plus raising the proxy read timeout. It is not memory, a key or tab throttling.', 'Một kết nối im không byte trông như chết với một proxy hay cân bằng tải, nó đóng ở một idle timeout (thường ~60 giây). Cách sửa là một ping định kỳ (mỗi 20–30 giây) để đường dây không bao giờ im, coi một pong thiếu là một đối tác chết, cộng nâng timeout đọc của proxy. Không phải bộ nhớ, một khoá hay bóp tab.'),
      },
      {
        question: q('Why are WebSocket frames sent from the client to the server masked (XORed), while server→client frames are not?', 'Vì sao các frame WebSocket gửi từ client tới máy chủ bị che mặt nạ (XOR), còn frame máy-chủ→client thì không?'),
        options: o([['To compress the payload', 'Để nén payload'], ['A security rule so old proxies cannot be tricked into misreading client data', 'Một luật bảo mật để các proxy cũ không bị lừa đọc nhầm dữ liệu client'], ['To encrypt the message', 'Để mã hoá tin nhắn'], ['To mark the end of a message', 'Để đánh dấu kết thúc một tin nhắn']]),
        correctIndex: 1, points: 1,
        explanation: ex('Masking is a security measure in RFC 6455: client frames are XORed with a random key so a malicious payload cannot be crafted to look like a valid HTTP request to an old, WebSocket-unaware proxy on the path. It is not compression (that is permessage-deflate), not encryption (that is TLS/wss), and the FIN bit — not the mask — marks a message end.', 'Che mặt nạ là một biện pháp bảo mật trong RFC 6455: frame client bị XOR với một khoá ngẫu nhiên để một payload ác ý không thể được dựng để trông như một yêu cầu HTTP hợp lệ với một proxy cũ, không biết WebSocket, trên đường. Không phải nén (đó là permessage-deflate), không phải mã hoá (đó là TLS/wss), và bit FIN — không phải mặt nạ — đánh dấu kết thúc một tin nhắn.'),
      },
      {
        question: q('A real-time service handles 500 req/s in tests but falls over at a few thousand concurrent users. What is the binding limit?', 'Một dịch vụ thời gian thực xử lý 500 req/s trong test nhưng sập ở vài nghìn người dùng đồng thời. Giới hạn ràng buộc là gì?'),
        options: o([['CPU', 'CPU'], ['Request throughput', 'Thông lượng yêu cầu'], ['Open connections — each is a file descriptor + RAM, capped by ulimit -n', 'Kết nối mở — mỗi cái là một file descriptor + RAM, chặn bởi ulimit -n'], ['Disk I/O', 'I/O đĩa']]),
        correctIndex: 2, points: 1,
        explanation: ex('Long-lived connections stay open, and each is a file descriptor plus memory, so the service is sized by concurrent connections (ulimit -n × RAM × processes), not requests per second. Idle sockets use almost no CPU or disk. Raise the fd limit and add processes/servers; CPU, throughput and disk are not the ceiling here.', 'Kết nối sống lâu cứ mở, và mỗi cái là một file descriptor cộng bộ nhớ, nên dịch vụ được đo theo kết nối đồng thời (ulimit -n × RAM × tiến trình), không phải yêu cầu mỗi giây. Socket im dùng gần như không CPU hay đĩa. Nâng trần fd và thêm tiến trình/server; CPU, thông lượng và đĩa không phải trần ở đây.'),
      },
      {
        question: q('After a server restart, 10,000 clients all reconnect in the same instant and knock it over again. Best fix?', 'Sau một lần khởi động lại, 10.000 client cùng nối lại trong cùng một khoảnh khắc và lại quật nó xuống. Cách sửa tốt nhất?'),
        options: o([['Restart more often', 'Khởi động lại thường xuyên hơn'], ['Remove the reconnect logic', 'Bỏ logic nối lại'], ['Use one fixed reconnect delay for all clients', 'Dùng một độ trễ nối lại cố định cho mọi client'], ['Reconnect with exponential backoff + jitter so clients spread out', 'Nối lại với lùi dần cấp số nhân + nhiễu để client rải ra']]),
        correctIndex: 3, points: 1,
        explanation: ex('All clients dropping together and reconnecting together is a thundering herd. Exponential backoff spaces retries out (1s, 2s, 4s…) and jitter randomizes them so they do not all land on the same tick. A single fixed delay still makes them reconnect simultaneously; removing reconnect or restarting more often makes it worse.', 'Mọi client cùng rớt và cùng nối lại là một bầy đàn. Lùi dần cấp số nhân giãn các lần thử (1s, 2s, 4s…) và nhiễu ngẫu nhiên hoá chúng để chúng không cùng rơi một nhịp. Một độ trễ cố định vẫn làm chúng nối lại đồng thời; bỏ nối lại hay khởi động lại thường xuyên hơn làm tệ hơn.'),
      },
      {
        question: q('A STUN request returns a public mapping whose port differs from the client\'s local port. What does that difference represent?', 'Một yêu cầu STUN trả một ánh xạ công cộng có cổng khác cổng cục bộ của client. Khác biệt đó biểu thị gì?'),
        options: o([['A protocol error', 'Một lỗi giao thức'], ['Packet loss', 'Mất gói'], ['The NAT translating the client\'s private ip:port to a public one', 'NAT dịch ip:cổng riêng của client thành một cái công cộng'], ['TLS encryption', 'Mã hoá TLS']]),
        correctIndex: 2, points: 1,
        explanation: ex('STUN reports the ip:port the outside world sees. The public port differing from the local port is precisely the NAT performing its translation — which is why WebRTC needs STUN to learn the address a peer should advertise. It is not an error, packet loss or encryption.', 'STUN báo ip:cổng thế giới ngoài thấy. Cổng công cộng khác cổng cục bộ chính là NAT thực hiện dịch của nó — lý do WebRTC cần STUN để biết địa chỉ một bên nên quảng cáo. Không phải lỗi, mất gói hay mã hoá.'),
      },
      {
        question: q('In a WebRTC video call, which part must YOU build (it is not defined by WebRTC)?', 'Trong một cuộc gọi video WebRTC, phần nào BẠN phải dựng (nó không do WebRTC định nghĩa)?'),
        options: o([['Signalling — exchanging the SDP offer/answer and ICE candidates, usually over a WebSocket', 'Signalling — trao đổi lời mời/câu trả lời SDP và ứng viên ICE, thường qua một WebSocket'], ['The STUN protocol', 'Giao thức STUN'], ['The ICE candidate checks', 'Các kiểm ứng viên ICE'], ['The media codecs', 'Các codec media']]),
        correctIndex: 0, points: 1,
        explanation: ex('WebRTC handles STUN, ICE and the media/codecs via RTCPeerConnection, but it does not define how peers first find each other and exchange their SDP and ICE candidates — that is signalling, which you build, typically over a WebSocket. STUN, ICE checks and codecs are provided by WebRTC.', 'WebRTC xử lý STUN, ICE và media/codec qua RTCPeerConnection, nhưng nó không định nghĩa cách các bên lần đầu tìm nhau và trao đổi SDP cùng ứng viên ICE — đó là signalling, cái bạn dựng, thường qua một WebSocket. STUN, kiểm ICE và codec do WebRTC cung cấp.'),
      },
    ],
  },
};
