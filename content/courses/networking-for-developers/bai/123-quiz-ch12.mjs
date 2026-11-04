/** Chương 12 · Quiz — 10 câu phỏng vấn, đáp án rải đều (A×3 · B×2 · C×3 · D×2). Kiểm kiến thức mạng mức phỏng vấn. */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Chapter 12: Networking in interviews|||Quiz — Chương 12: Mạng trong phỏng vấn',
  slug: 'netdev-12-4-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu mức phỏng vấn: thứ tự URL→trang, bắt tay 3 bước (một RTT), TCP vs UDP (đánh đổi), HTTP/1.1 vs 2 vs 3 (mỗi bản sửa gì), TLS/DNS là vòng khứ hồi, phân loại mã 504/503/502, định vị trước khi đổ lỗi, chuỗi chứng chỉ (trung gian thiếu), và khi nào cần chứng chỉ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Quiz</span>
<h2>Quiz — Networking in interviews</h2>
<p class="lead">Ten interview-level questions. Each rewards the trade-off/measurement framing from this chapter, not a bare definition.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can walk the URL→page journey and name a measurement for each stage.</li>
<li>I can explain the 3-way handshake as one round trip, and why keep-alive matters.</li>
<li>I can frame TCP vs UDP and HTTP/1.1/2/3 as trade-offs (what each fixed).</li>
<li>I can diagnose a scenario by localising before blaming.</li>
<li>I can judge when a certification is (and is not) needed.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Quiz</span>
<h2>Quiz — Mạng trong phỏng vấn</h2>
<p class="lead">Mười câu mức phỏng vấn. Mỗi câu thưởng cách khung đánh-đổi/phép-đo của chương, không phải một định nghĩa trần.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đi được hành trình URL→trang và gọi tên một phép đo cho mỗi chặng.</li>
<li>Tôi giải thích được bắt tay 3 bước là một vòng khứ hồi, và vì sao keep-alive quan trọng.</li>
<li>Tôi khung được TCP vs UDP và HTTP/1.1/2/3 như đánh đổi (mỗi cái sửa gì).</li>
<li>Tôi chẩn đoán được một tình huống bằng cách định vị trước khi đổ lỗi.</li>
<li>Tôi đánh giá được khi nào một chứng chỉ (và không) cần.</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('"What happens when you type a URL and press Enter?" The strongest opening names…', '"Gõ một URL rồi Enter thì gì xảy ra?" Mở đầu mạnh nhất gọi tên…'),
        options: o([['the layers in order (DNS → TCP → TLS → HTTP → render) and which can be skipped', 'các tầng theo thứ tự (DNS → TCP → TLS → HTTP → render) và cái nào bỏ qua được'], ['the OSI model\'s seven layers by number', 'bảy tầng OSI theo số'], ['the HTML parser', 'bộ phân tích HTML'], ['the CPU registers', 'các thanh ghi CPU']]),
        correctIndex: 0, points: 1,
        explanation: ex('The strong answer walks DNS → TCP → TLS → HTTP → parse/render in order and flags what can be skipped (warm cache, keep-alive, CDN), ideally adding a measurement (curl -w stages). Reciting OSI by number, or jumping to the HTML parser or CPU, misses the request path the question is really about.', 'Câu trả lời mạnh đi DNS → TCP → TLS → HTTP → phân tích/render theo thứ tự và chỉ cái bỏ qua được (cache ấm, keep-alive, CDN), lý tưởng thêm một phép đo (các chặng curl -w). Đọc OSI theo số, hay nhảy tới bộ phân tích HTML hay CPU, bỏ lỡ đường request câu hỏi thật sự về.'),
      },
      {
        question: q('Why is the TCP 3-way handshake significant for performance?', 'Vì sao cú bắt tay TCP 3 bước quan trọng cho hiệu năng?'),
        options: o([['It encrypts the connection', 'Nó mã hoá kết nối'], ['It costs one round trip of latency before any request — which keep-alive and HTTP/2 avoid repeating', 'Nó tốn một vòng khứ hồi độ trễ trước bất kỳ yêu cầu nào — cái keep-alive và HTTP/2 tránh lặp lại'], ['It compresses headers', 'Nó nén header'], ['It picks a DNS server', 'Nó chọn một máy chủ DNS']]),
        correctIndex: 1, points: 1,
        explanation: ex('SYN/SYN-ACK/ACK establishes sequence numbers both ways and costs one RTT before data flows; reusing the connection (keep-alive) or multiplexing (HTTP/2) avoids paying it again. It does not encrypt (that is TLS), compress headers (HPACK), or pick a DNS server.', 'SYN/SYN-ACK/ACK thiết lập số thứ tự cả hai chiều và tốn một RTT trước khi dữ liệu chảy; dùng lại kết nối (keep-alive) hay ghép kênh (HTTP/2) tránh trả lại. Nó không mã hoá (đó là TLS), nén header (HPACK), hay chọn một máy chủ DNS.'),
      },
      {
        question: q('The best framing of "TCP vs UDP" in an interview is…', 'Khung tốt nhất của "TCP vs UDP" trong phỏng vấn là…'),
        options: o([['TCP is good, UDP is bad', 'TCP tốt, UDP xấu'], ['They are identical', 'Chúng giống hệt'], ['a trade-off: TCP gives reliability+order (at a handshake/HoL cost), UDP gives speed+control (QUIC builds reliability on it)', 'một đánh đổi: TCP cho tin cậy+thứ tự (với giá bắt tay/HoL), UDP cho tốc độ+kiểm soát (QUIC dựng tin cậy trên nó)'], ['UDP is only for email', 'UDP chỉ cho email']]),
        correctIndex: 2, points: 1,
        explanation: ex('Interviews reward the trade-off: TCP buys reliability and ordering at the cost of a handshake and head-of-line blocking; UDP is fast and unguaranteed, so you build what you need on top — which is exactly what QUIC/HTTP/3 does. "Good vs bad", "identical", or "email only" all miss it.', 'Phỏng vấn thưởng đánh đổi: TCP mua tin cậy và thứ tự với giá một cú bắt tay và nghẽn đầu hàng; UDP nhanh và không bảo đảm, nên bạn dựng cái cần lên trên — đúng điều QUIC/HTTP/3 làm. "Tốt vs xấu", "giống hệt", hay "chỉ email" đều trượt.'),
      },
      {
        question: q('What did HTTP/3 (over QUIC) fix that HTTP/2 could not?', 'HTTP/3 (trên QUIC) sửa gì mà HTTP/2 không thể?'),
        options: o([['It added multiplexing', 'Nó thêm ghép kênh'], ['It added keep-alive', 'Nó thêm keep-alive'], ['It added headers', 'Nó thêm header'], ['TCP head-of-line blocking — one lost packet no longer stalls every stream', 'Nghẽn đầu hàng tầng TCP — một gói mất không còn kẹt mọi stream']]),
        correctIndex: 3, points: 1,
        explanation: ex('HTTP/2 already multiplexes, but all its streams ride one TCP connection, so a single lost packet stalls them all (TCP head-of-line blocking). HTTP/3 runs over QUIC on UDP with per-stream ordering, removing that. Multiplexing was HTTP/2; keep-alive was HTTP/1.1; headers exist in all.', 'HTTP/2 đã ghép kênh, nhưng mọi stream của nó đi trên một kết nối TCP, nên một gói mất kẹt tất cả (nghẽn đầu hàng TCP). HTTP/3 chạy trên QUIC trên UDP với thứ tự theo-stream, bỏ điều đó. Ghép kênh là HTTP/2; keep-alive là HTTP/1.1; header có ở mọi bản.'),
      },
      {
        question: q('A page is slow only from one region. The first move is to…', 'Một trang chậm chỉ từ một vùng. Nước đầu là…'),
        options: o([['localise: compare curl -w / ping / mtr from that region vs others before blaming', 'định vị: so curl -w / ping / mtr từ vùng đó so với vùng khác trước khi đổ lỗi'], ['restart the database', 'khởi động lại cơ sở dữ liệu'], ['buy more bandwidth', 'mua thêm băng thông'], ['rewrite the frontend', 'viết lại frontend']]),
        correctIndex: 0, points: 1,
        explanation: ex('Localise before blaming: compare the timing across regions. A big time_connect only there is distance/path; high TTFB everywhere is the origin, not the region. Restarting the DB, buying bandwidth, or rewriting the frontend are guesses made before any measurement.', 'Định vị trước khi đổ lỗi: so thời gian giữa các vùng. Một time_connect lớn chỉ ở đó là khoảng cách/đường; TTFB cao mọi nơi là origin, không phải vùng. Khởi động lại DB, mua băng thông, hay viết lại frontend là các đoán trước bất kỳ phép đo nào.'),
      },
      {
        question: q('An endpoint returns 504 under evening load. What does that tell you?', 'Một điểm cuối trả 504 dưới tải buổi tối. Điều đó cho bạn biết gì?'),
        options: o([['the backend is missing', 'backend thiếu'], ['DNS failed', 'DNS hỏng'], ['the backend is up but too slow (exceeds the read timeout) — correlate TTFB with load', 'backend đang chạy nhưng quá chậm (vượt read timeout) — tương quan TTFB với tải'], ['the certificate expired', 'chứng chỉ hết hạn']]),
        correctIndex: 2, points: 1,
        explanation: ex('504 = the proxy got no answer within the read timeout: the backend is up but too slow. Under evening load that points at pool exhaustion or a slow query — correlate TTFB with concurrency. 503 would mean no healthy capacity, 502 a broken reply; DNS and the certificate are unrelated to a 504.', '504 = proxy không nhận trả lời trong read timeout: backend đang chạy nhưng quá chậm. Dưới tải buổi tối điều đó chỉ vào cạn pool hay một truy vấn chậm — tương quan TTFB với đồng thời. 503 sẽ nghĩa là không dung lượng khoẻ, 502 một trả lời hỏng; DNS và chứng chỉ không liên quan một 504.'),
      },
      {
        question: q('Only old Android devices get certificate errors; modern browsers are fine. The likely cause is…', 'Chỉ thiết bị Android cũ lỗi chứng chỉ; trình duyệt hiện đại ổn. Nguyên nhân có khả năng là…'),
        options: o([['the server is down', 'máy chủ down'], ['a trust/chain issue (e.g. a missing intermediate certificate, or an expired root in the old trust store)', 'một vấn đề tin cậy/chuỗi (vd một trung gian thiếu, hay một root hết hạn trong kho tin cậy cũ)'], ['the app crashed', 'app sập'], ['the DNS is wrong', 'DNS sai']]),
        correctIndex: 1, points: 1,
        explanation: ex('A subset of clients failing TLS is a trust problem, not a down server: a missing intermediate (modern clients fetch it, old ones do not) or an expired root in the old trust store. Inspect with openssl s_client. A down server, crashed app or wrong DNS would affect all clients, not only old ones.', 'Một tập con client hỏng TLS là một vấn đề tin cậy, không phải máy chủ down: một trung gian thiếu (client hiện đại lấy, cũ không) hay một root hết hạn trong kho tin cậy cũ. Soi bằng openssl s_client. Một máy chủ down, app sập hay DNS sai sẽ ảnh hưởng mọi client, không chỉ cũ.'),
      },
      {
        question: q('In a scenario round, the behaviour interviewers reward most is…', 'Trong một vòng tình huống, hành vi người phỏng vấn thưởng nhất là…'),
        options: o([['guessing the answer instantly', 'đoán câu trả lời ngay'], ['quoting RFC numbers', 'trích số RFC'], ['listing certifications', 'liệt kê chứng chỉ'], ['stating ordered hypotheses and the one measurement that confirms each (method over trivia)', 'nêu giả thuyết xếp thứ tự và một phép đo xác nhận mỗi cái (phương pháp hơn vặt vãnh)']]),
        correctIndex: 3, points: 1,
        explanation: ex('Scenario rounds grade method: ordered hypotheses across the layers, each with the one measurement that confirms or kills it, then a conclusion. Guessing looks lucky, quoting RFCs or listing certs is not diagnosis. Narrating the method is what passes.', 'Vòng tình huống chấm phương pháp: giả thuyết xếp thứ tự qua các tầng, mỗi cái với một phép đo xác nhận hay giết nó, rồi một kết luận. Đoán trông may, trích RFC hay liệt kê chứng chỉ không phải chẩn đoán. Kể phương pháp là cái qua.'),
      },
      {
        question: q('When does a software developer genuinely benefit from a CCNA?', 'Khi nào một lập trình viên phần mềm thật sự được lợi từ một CCNA?'),
        options: o([['always — every developer needs it', 'luôn — mọi lập trình viên cần nó'], ['never, under any circumstances', 'không bao giờ, trong mọi hoàn cảnh'], ['when moving into network-engineering / infra, or when an employer/contract requires it', 'khi chuyển sang kỹ thuật mạng / hạ tầng, hay khi một nhà tuyển dụng/hợp đồng đòi'], ['only to write frontend code', 'chỉ để viết mã frontend']]),
        correctIndex: 2, points: 1,
        explanation: ex('CCNA is a network-engineer credential; a developer benefits mainly when moving toward infra/NetDevOps or when a specific employer or contract requires it. It is not needed by every developer, nor useless in all cases, and it has nothing to do with frontend code.', 'CCNA là một chứng chỉ kỹ-sư-mạng; một lập trình viên được lợi chủ yếu khi chuyển sang hạ tầng/NetDevOps hay khi một nhà tuyển dụng hay hợp đồng cụ thể đòi. Nó không cần cho mọi lập trình viên, cũng không vô dụng mọi lúc, và không liên quan mã frontend.'),
      },
      {
        question: q('What separates a memorised answer from an experienced one in a networking interview?', 'Cái gì tách một câu trả lời thuộc lòng khỏi một câu có kinh nghiệm trong phỏng vấn mạng?'),
        options: o([['backing a claim with a concrete measurement (curl -w, a capture) and a trade-off', 'chống một khẳng định bằng một phép đo cụ thể (curl -w, một bản bắt) và một đánh đổi'], ['speaking faster', 'nói nhanh hơn'], ['a longer answer', 'một câu trả lời dài hơn'], ['more acronyms', 'nhiều từ viết tắt hơn']]),
        correctIndex: 0, points: 1,
        explanation: ex('Experience shows when a candidate backs a claim with a measurement they have actually run (curl -w stages, a captured handshake) and frames the trade-off, rather than reciting a definition. Speaking faster, padding length, or stacking acronyms do not demonstrate it.', 'Kinh nghiệm hiện khi một ứng viên chống một khẳng định bằng một phép đo họ thật sự đã chạy (các chặng curl -w, một cú bắt tay đã bắt) và khung đánh đổi, thay vì đọc một định nghĩa. Nói nhanh hơn, độn dài, hay chồng từ viết tắt không trình diễn nó.'),
      },
    ],
  },
};
