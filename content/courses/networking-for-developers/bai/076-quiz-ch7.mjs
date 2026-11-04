/** Chương 7 · Quiz — 10 câu tình huống, đáp án rải đều (A×3 · B×2 · C×3 · D×2), dữ liệu từ output thật của lab HTTP. */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Chapter 7: HTTP from 1.1 to 3|||Quiz — Chương 7: HTTP từ 1.1 tới 3',
  slug: 'netdev-7-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: HTTP/1.1 là văn bản, Host, keep-alive, chunked, giới hạn 6 kết nối, ALPN/ghép kênh HTTP/2, HPACK, server push chết, nghẽn đầu hàng TCP, Alt-Svc/HTTP/3, ETag/304, nén, CORS là luật trình duyệt, HSTS, X-Forwarded-For và sự cố 429.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Quiz — HTTP from 1.1 to 3</h2>
<p class="lead">Ten situations from the lab of this chapter. Most can be answered by reading a response, a header or a capture the way the lessons taught.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read an HTTP/1.1 message and explain keep-alive and chunked.</li>
<li>I can explain HTTP/2 multiplexing, HPACK, and why server push died.</li>
<li>I can explain HTTP/3’s upgrade (Alt-Svc) and what it fixes.</li>
<li>I can use caching, compression, CORS and HSTS headers.</li>
<li>I can find the real client IP behind a proxy and explain a 429 outage.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Quiz</span>
<h2>Quiz — HTTP từ 1.1 tới 3</h2>
<p class="lead">Mười tình huống từ phòng lab của chương. Phần lớn trả lời được bằng cách đọc một câu trả lời, một header hay một bản bắt gói theo đúng cách các bài đã dạy.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được một thông điệp HTTP/1.1 và giải thích keep-alive cùng chunked.</li>
<li>Tôi giải thích được ghép kênh HTTP/2, HPACK, và vì sao server push chết.</li>
<li>Tôi giải thích được cú nâng HTTP/3 (Alt-Svc) và nó sửa gì.</li>
<li>Tôi dùng được các header cache, nén, CORS và HSTS.</li>
<li>Tôi tìm được IP client thật sau một proxy và giải thích một sự cố 429.</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('In an HTTP/1.1 request typed by hand, what separates the headers from the body?', 'Trong một yêu cầu HTTP/1.1 gõ tay, cái gì tách header khỏi thân?'),
        options: o([['A blank line (CRLF CRLF)', 'Một dòng trống (CRLF CRLF)'], ['A null byte', 'Một byte null'], ['The Content-Length header', 'Header Content-Length'], ['A semicolon', 'Một dấu chấm phẩy']]),
        correctIndex: 0, points: 1,
        explanation: ex('Headers end at an empty line — \\r\\n\\r\\n — after which the body begins. Forget it and the server keeps waiting for more headers. Content-Length describes the body length but does not delimit the headers; there is no null byte or semicolon involved.', 'Header kết thúc ở một dòng trống — \\r\\n\\r\\n — sau đó thân bắt đầu. Quên nó thì máy chủ cứ chờ thêm header. Content-Length mô tả độ dài thân nhưng không phân định header; không có byte null hay dấu chấm phẩy nào.'),
      },
      {
        question: q('<code>curl -v</code> on two requests to one host prints “Reusing existing connection” on the second. What saved time?', '<code>curl -v</code> trên hai yêu cầu tới một host in “Reusing existing connection” ở cái thứ hai. Cái gì tiết kiệm thời gian?'),
        options: o([['Response caching', 'Cache câu trả lời'], ['Keep-alive: the second request skipped the TCP (and TLS) handshake', 'Keep-alive: yêu cầu thứ hai bỏ cú bắt tay TCP (và TLS)'], ['Compression', 'Nén'], ['HTTP/2 multiplexing', 'Ghép kênh HTTP/2']]),
        correctIndex: 1, points: 1,
        explanation: ex('HTTP/1.1 keeps the connection open by default, so the second request reuses it and skips the handshake(s) — the biggest 1.0→1.1 win. It is not caching (the body is fetched fresh), compression, or multiplexing (which is HTTP/2).', 'HTTP/1.1 giữ kết nối mở mặc định, nên yêu cầu thứ hai dùng lại nó và bỏ cú bắt tay — thắng lợi lớn nhất 1.0→1.1. Không phải cache (thân lấy mới), nén, hay ghép kênh (đó là HTTP/2).'),
      },
      {
        question: q('A response has no Content-Length but <code>Transfer-Encoding: chunked</code>. Why?', 'Một câu trả lời không có Content-Length mà <code>Transfer-Encoding: chunked</code>. Vì sao?'),
        options: o([['The response is compressed', 'Câu trả lời được nén'], ['The connection will close', 'Kết nối sẽ đóng'], ['The server is streaming and does not know the total size up front', 'Máy chủ đang phát dòng và chưa biết tổng cỡ ngay'], ['It is an error', 'Đó là một lỗi']]),
        correctIndex: 2, points: 1,
        explanation: ex('Chunked encoding is used when the server generates the body as it goes (streaming) and cannot send Content-Length up front; each chunk has a hex size line, ending with a zero chunk. It is unrelated to compression, is not an error, and does not require closing the connection.', 'Mã hoá chunked dùng khi máy chủ sinh thân dần (phát dòng) và không gửi Content-Length ngay được; mỗi khúc có một dòng kích thước hex, kết thúc bằng một khúc không. Không liên quan nén, không phải lỗi, và không cần đóng kết nối.'),
      },
      {
        question: q('A decrypted HTTP/2 capture shows three GETs with HEADERS frames on stream IDs 1, 3 and 5 over one TCP connection. What is this?', 'Một bản bắt gói HTTP/2 giải mã cho thấy ba GET với frame HEADERS trên stream id 1, 3 và 5 trên một kết nối TCP. Đây là gì?'),
        options: o([['Three separate connections', 'Ba kết nối riêng'], ['Server push', 'Server push'], ['A protocol error', 'Một lỗi giao thức'], ['Multiplexing: three requests interleaved as streams on one connection', 'Ghép kênh: ba yêu cầu xen nhau dưới dạng stream trên một kết nối']]),
        correctIndex: 3, points: 1,
        explanation: ex('HTTP/2 multiplexes: many requests ride one connection as independent streams (client-initiated streams are odd — 1, 3, 5). This removes the 6-connection limit. It is not three connections, not server push (that uses PUSH_PROMISE on a different stream), and not an error.', 'HTTP/2 ghép kênh: nhiều yêu cầu đi trên một kết nối dưới dạng stream độc lập (stream do client khởi tạo là số lẻ — 1, 3, 5). Điều này bỏ giới hạn 6 kết nối. Không phải ba kết nối, không phải server push (dùng PUSH_PROMISE trên một stream khác), và không phải lỗi.'),
      },
      {
        question: q('Why did browsers remove support for HTTP/2 server push?', 'Vì sao trình duyệt bỏ hỗ trợ HTTP/2 server push?'),
        options: o([['It was insecure', 'Nó không an toàn'], ['It only worked over HTTP/3', 'Nó chỉ chạy trên HTTP/3'], ['It over-pushed resources the browser had already cached, wasting bandwidth', 'Nó đẩy thừa tài nguyên trình duyệt đã cache, phí băng thông'], ['It was too slow', 'Nó quá chậm']]),
        correctIndex: 2, points: 1,
        explanation: ex('The server could not know what the client had cached, so push often re-sent resources the browser did not need, wasting bandwidth. Chrome removed it in 2022; the replacement is 103 Early Hints + preload, which lets the client decide. It was not a security or speed flaw per se, and it was an HTTP/2 feature.', 'Máy chủ không biết client đã cache gì, nên push thường gửi lại tài nguyên trình duyệt không cần, phí băng thông. Chrome bỏ nó năm 2022; thứ thay thế là 103 Early Hints + preload, để client quyết. Không phải lỗi bảo mật hay tốc độ tự thân, và nó là một tính năng HTTP/2.'),
      },
      {
        question: q('Over one HTTP/2 connection carrying many streams, one TCP packet is lost. What happens?', 'Trên một kết nối HTTP/2 mang nhiều stream, một gói TCP bị mất. Chuyện gì xảy ra?'),
        options: o([['Only the affected stream stalls', 'Chỉ stream bị ảnh hưởng kẹt'], ['All streams stall until TCP retransmits (TCP head-of-line blocking)', 'Mọi stream kẹt tới khi TCP truyền lại (nghẽn đầu hàng tầng TCP)'], ['The connection resets', 'Kết nối reset'], ['Nothing — HTTP/2 recovers per stream', 'Không gì — HTTP/2 phục hồi theo stream']]),
        correctIndex: 1, points: 1,
        explanation: ex('HTTP/2 multiplexes over one TCP connection, and TCP delivers its single stream in order, so a lost packet stalls every HTTP/2 stream behind it — TCP-layer head-of-line blocking. HTTP/2 removed HTTP-layer HoL but not this. HTTP/3 over QUIC fixes it by giving each stream independent ordering.', 'HTTP/2 ghép trên một kết nối TCP, và TCP giao luồng duy nhất của nó đúng thứ tự, nên một gói mất kẹt mọi stream HTTP/2 phía sau — nghẽn đầu hàng tầng TCP. HTTP/2 bỏ HoL tầng HTTP nhưng không bỏ cái này. HTTP/3 trên QUIC sửa bằng cách cho mỗi stream thứ tự độc lập.'),
      },
      {
        question: q('A response carries <code>alt-svc: h3=":443"</code>. What will a browser do?', 'Một câu trả lời mang <code>alt-svc: h3=":443"</code>. Trình duyệt sẽ làm gì?'),
        options: o([['Keep using the current TCP connection and try HTTP/3 on the next one', 'Tiếp tục dùng kết nối TCP hiện tại và thử HTTP/3 ở kết nối kế'], ['Immediately switch this request to HTTP/3', 'Chuyển ngay yêu cầu này sang HTTP/3'], ['Block HTTP/3', 'Chặn HTTP/3'], ['Downgrade to HTTP/1.1', 'Hạ xuống HTTP/1.1']]),
        correctIndex: 0, points: 1,
        explanation: ex('Alt-Svc advertises HTTP/3: the browser finishes on the current TCP/h2 connection, remembers the h3 offer, and tries QUIC on UDP 443 on a later connection — opt-in and reversible. It does not switch the current request, block anything, or downgrade.', 'Alt-Svc quảng cáo HTTP/3: trình duyệt hoàn tất trên kết nối TCP/h2 hiện tại, nhớ lời mời h3, và thử QUIC trên UDP 443 ở một kết nối sau — tự chọn và đảo ngược được. Nó không chuyển yêu cầu hiện tại, không chặn gì, không hạ cấp.'),
      },
      {
        question: q('A client re-requests a file with <code>If-None-Match: &lt;etag&gt;</code> and gets <code>304 Not Modified</code>. What did that save?', 'Một client hỏi lại một tệp với <code>If-None-Match: &lt;etag&gt;</code> và nhận <code>304 Not Modified</code>. Nó tiết kiệm gì?'),
        options: o([['The round trip', 'Vòng khứ hồi'], ['The DNS lookup', 'Lần tra DNS'], ['The TLS handshake', 'Cú bắt tay TLS'], ['The download of the body — the client reuses its cached copy', 'Lần tải thân — client dùng lại bản cache']]),
        correctIndex: 3, points: 1,
        explanation: ex('304 means the resource is unchanged, so the server sends no body and the client reuses its cache. It still costs the round trip (the revalidation request), and DNS/TLS are unrelated. Cache-Control: max-age avoids even the round trip while fresh.', '304 nghĩa là tài nguyên không đổi, nên máy chủ không gửi thân và client dùng lại cache. Nó vẫn tốn vòng khứ hồi (yêu cầu kiểm lại), và DNS/TLS không liên quan. Cache-Control: max-age tránh cả vòng khứ hồi khi còn tươi.'),
      },
      {
        question: q('A frontend gets a “CORS error” calling your API, but <code>curl</code> to the same API works fine. What is true?', 'Một frontend bị “lỗi CORS” khi gọi API của bạn, nhưng <code>curl</code> tới cùng API chạy tốt. Điều gì đúng?'),
        options: o([['The API is down', 'API sập'], ['CORS is a browser rule; fix it on the server by sending the right Access-Control-Allow-* headers', 'CORS là luật trình duyệt; sửa ở máy chủ bằng cách gửi đúng các header Access-Control-Allow-*'], ['curl is bypassing authentication', 'curl đang vượt xác thực'], ['The DNS is wrong', 'DNS sai']]),
        correctIndex: 1, points: 1,
        explanation: ex('CORS is enforced by the browser, not the server: the server runs the request either way (so curl, which ignores CORS, works), but the browser blocks JavaScript from reading the response unless the server sends matching Access-Control-Allow-* headers. The fix is on the server, not by disabling the client.', 'CORS do trình duyệt thi hành, không phải máy chủ: máy chủ chạy yêu cầu dù sao (nên curl, vốn bỏ qua CORS, chạy), nhưng trình duyệt chặn JavaScript đọc câu trả lời trừ khi máy chủ gửi các header Access-Control-Allow-* khớp. Sửa ở máy chủ, không phải tắt client.'),
      },
      {
        question: q('Behind a load balancer, a rate limiter returns 429 to every user during a spike, and logs show one IP for all. Cause?', 'Sau một bộ cân bằng tải, một bộ giới hạn tốc độ trả 429 cho mọi người dùng trong một đợt dồn, và log hiện một IP cho tất cả. Nguyên nhân?'),
        options: o([['The limiter keyed on the proxy’s IP (wrong X-Forwarded-For entry), which all users share', 'Bộ giới hạn khoá theo IP của proxy (mục X-Forwarded-For sai), thứ mọi người dùng chia sẻ'], ['The servers are overloaded', 'Máy chủ quá tải'], ['DNS failed', 'DNS hỏng'], ['The certificate expired', 'Chứng chỉ hết hạn']]),
        correctIndex: 0, points: 1,
        explanation: ex('Behind a proxy the app sees the proxy’s IP; if trust proxy is misconfigured the limiter keys on that shared IP, so one busy user trips the limit for everyone. Fix: set trust proxy to the number of front proxies (or read CF-Connecting-IP) so it keys on the real client IP, and test behind the real chain. It is not overload, DNS or a certificate.', 'Sau một proxy app thấy IP của proxy; nếu trust proxy cấu hình sai bộ giới hạn khoá theo IP dùng chung đó, nên một người dùng bận chạm giới hạn cho tất cả. Sửa: đặt trust proxy bằng số proxy trước (hoặc đọc CF-Connecting-IP) để khoá theo IP client thật, và thử sau chuỗi thật. Không phải quá tải, DNS hay chứng chỉ.'),
      },
    ],
  },
};
