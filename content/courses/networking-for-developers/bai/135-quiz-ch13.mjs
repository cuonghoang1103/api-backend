/** Chương 13 · Quiz cuối khoá — 10 câu về phương pháp capstone + cả khoá, đáp án rải đều (A×3 · B×2 · C×3 · D×2). */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Chapter 13: Capstone & course review|||Quiz — Chương 13: Capstone & ôn cả khoá',
  slug: 'netdev-13-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu cuối khoá: baseline trước khi tinh chỉnh, nén co khoảng trống tải, cache sụp ttfb, một-thay-đổi-một-lúc, 504 vs 502, chẩn đoán theo tầng, các chặng curl -w, đo từ nhiều mạng, câu chuyện phỏng vấn bằng con số, và đường request là xương sống cả khoá.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Final quiz</span>
<h2>Quiz — Capstone &amp; course review</h2>
<p class="lead">Ten questions on the capstone method and the course as a whole. If you can answer these, you can build, measure, tune, break and explain a real request path.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I take a baseline before I tune anything, and prove gains as before/after.</li>
<li>I match each optimisation to the gap it targets, one change at a time.</li>
<li>I can read 504/502/refused and diagnose each to a layer.</li>
<li>I measure from several vantage points to separate path from server.</li>
<li>I can tell the whole thing as an interview story made of numbers and tools.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Quiz cuối</span>
<h2>Quiz — Capstone &amp; ôn cả khoá</h2>
<p class="lead">Mười câu về phương pháp capstone và cả khoá. Nếu trả lời được, bạn dựng, đo, tinh chỉnh, làm hỏng và giải thích được một đường request thật.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi lấy mốc nền trước khi tinh chỉnh bất cứ gì, và chứng minh cái lợi như trước/sau.</li>
<li>Tôi khớp mỗi tối ưu với khoảng trống nó nhắm, một thay đổi một lúc.</li>
<li>Tôi đọc được 504/502/refused và chẩn đoán mỗi cái tới một tầng.</li>
<li>Tôi đo từ vài điểm nhìn để tách đường khỏi máy chủ.</li>
<li>Tôi kể được cả thứ như một câu chuyện phỏng vấn làm từ con số và công cụ.</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('Before enabling any optimisation on the capstone stack, the first thing you must do is…', 'Trước khi bật bất kỳ tối ưu nào trên stack capstone, việc đầu bạn phải làm là…'),
        options: o([['record a baseline — measure every hop so later changes are a measured delta', 'ghi một mốc nền — đo mỗi chặng để thay đổi sau là một độ chênh đo được'], ['enable gzip', 'bật gzip'], ['restart nginx', 'khởi động lại nginx'], ['buy a CDN', 'mua một CDN']]),
        correctIndex: 0, points: 1,
        explanation: ex('You cannot improve what you did not measure. Record a baseline first so every optimisation is a provable before/after. Enabling gzip, restarting, or buying a CDN before the baseline gives you nothing to compare against.', 'Bạn không cải thiện được cái không đo. Ghi một mốc nền trước để mọi tối ưu là một trước/sau chứng minh được. Bật gzip, khởi động lại, hay mua một CDN trước mốc nền cho bạn không gì để so.'),
      },
      {
        question: q('On the capstone, gzip took a 67,092-byte response to 1,809 bytes. Which gap did that shrink?', 'Trên capstone, gzip đưa một câu trả lời 67.092 byte xuống 1.809 byte. Nó co khoảng trống nào?'),
        options: o([['the connect (handshake) time', 'thời gian connect (bắt tay)'], ['the download gap (total − ttfb)', 'khoảng trống tải (total − ttfb)'], ['DNS', 'DNS'], ['the TLS handshake', 'cú bắt tay TLS']]),
        correctIndex: 1, points: 1,
        explanation: ex('Compression reduces the number of bytes downloaded, shrinking the total-minus-ttfb (download) gap. It does not change the TCP handshake (connect), DNS, or the TLS handshake — those are separate stages of curl -w.', 'Nén giảm số byte tải, co khoảng trống total-trừ-ttfb (tải). Nó không đổi cú bắt tay TCP (connect), DNS, hay cú bắt tay TLS — đó là các chặng riêng của curl -w.'),
      },
      {
        question: q('Caching a slow (3 s) origin response turned the HIT into ~0.3 ms. Why was the win so large?', 'Cache một câu trả lời origin chậm (3 giây) biến HIT thành ~0,3 ms. Vì sao thắng lợi lớn vậy?'),
        options: o([['because DNS was cached', 'vì DNS được cache'], ['because the file was small', 'vì tệp nhỏ'], ['the HIT is served at the edge without touching the slow origin — it collapses the ttfb gap', 'HIT phục vụ ở biên không chạm origin chậm — nó làm sụp khoảng trống ttfb'], ['because gzip was on', 'vì gzip bật']]),
        correctIndex: 2, points: 1,
        explanation: ex('A cache HIT is served from the edge and never reaches the slow origin, so the entire 3-second TTFB disappears. The win is large precisely because the origin was slow; caching a fast response saves little. DNS, file size and gzip are not the reason.', 'Một HIT cache phục vụ từ biên và không bao giờ tới origin chậm, nên cả TTFB 3 giây biến mất. Thắng lợi lớn đúng vì origin chậm; cache một câu trả lời nhanh tiết kiệm ít. DNS, kích thước tệp và gzip không phải lý do.'),
      },
      {
        question: q('Why must you change only one knob at a time when tuning?', 'Vì sao bạn phải đổi chỉ một núm một lúc khi tinh chỉnh?'),
        options: o([['to save time', 'để tiết kiệm thời gian'], ['nginx requires it', 'nginx đòi vậy'], ['it looks professional', 'trông chuyên nghiệp'], ['otherwise you cannot attribute the gain (or notice a regression) — the before/after becomes meaningless', 'không thì bạn không gán được cái lợi (hay nhận ra một thụt lùi) — trước/sau thành vô nghĩa']]),
        correctIndex: 3, points: 1,
        explanation: ex('Changing several things at once means a faster page cannot be attributed to any one change, and a regression in one can be hidden by a gain in another. One change at a time keeps each before/after number meaningful and defensible. It is not about speed, nginx, or appearances.', 'Đổi nhiều thứ cùng lúc nghĩa là một trang nhanh hơn không gán được cho thay đổi nào, và một thụt lùi ở một cái có thể bị che bởi một cái lợi ở cái khác. Một thay đổi một lúc giữ mỗi con số trước/sau có nghĩa và bảo vệ được. Không phải về tốc độ, nginx, hay vẻ ngoài.'),
      },
      {
        question: q('On the capstone, /timeout returned 504 and /dead returned 502. What is the difference?', 'Trên capstone, /timeout trả 504 và /dead trả 502. Khác biệt là gì?'),
        options: o([['504 = the backend is up but too slow; 502 = the edge could not get a valid reply (dead/broken upstream)', '504 = backend đang chạy nhưng quá chậm; 502 = biên không nhận được trả lời hợp lệ (upstream chết/hỏng)'], ['they are the same', 'chúng giống nhau'], ['504 means DNS failed', '504 nghĩa là DNS hỏng'], ['502 means the certificate expired', '502 nghĩa là chứng chỉ hết hạn']]),
        correctIndex: 0, points: 1,
        explanation: ex('504 is a read timeout — the upstream is up but exceeded the edge timeout; 502 is a bad/absent upstream — the edge connected to nothing valid. Different backend states, different fixes. Neither is about DNS or the certificate, and they are not the same.', '504 là một read timeout — upstream đang chạy nhưng vượt timeout của biên; 502 là một upstream tồi/vắng — biên nối tới không gì hợp lệ. Trạng thái backend khác, cách sửa khác. Không cái nào về DNS hay chứng chỉ, và chúng không giống nhau.'),
      },
      {
        question: q('To pin a failure to the port layer during the break-it step, which command do you reach for?', 'Để ghim một lỗi vào tầng cổng trong bước làm-hỏng, bạn với tới lệnh nào?'),
        options: o([['dig', 'dig'], ['openssl s_client', 'openssl s_client'], ['nc -zv host port', 'nc -zv host port'], ['curl --compressed', 'curl --compressed']]),
        correctIndex: 2, points: 1,
        explanation: ex('nc -zv host port tests the port layer: succeeded (open) or refused/timeout. dig is the DNS layer, openssl s_client is the TLS layer, and curl --compressed tests compression, not the port. Each layer has its own one command.', 'nc -zv host port thử tầng cổng: succeeded (mở) hay refused/timeout. dig là tầng DNS, openssl s_client là tầng TLS, và curl --compressed thử nén, không phải cổng. Mỗi tầng có một lệnh riêng.'),
      },
      {
        question: q('Your baseline from one laptop shows a slow connect time. What is the risk of tuning the server on that alone?', 'Mốc nền từ một laptop cho thấy connect chậm. Rủi ro của việc tinh chỉnh máy chủ chỉ dựa trên đó là gì?'),
        options: o([['none — one measurement is enough', 'không — một phép đo là đủ'], ['the slowness may be on the path/your network, not the server — measure from several networks first', 'cái chậm có thể ở đường/mạng của bạn, không phải máy chủ — đo từ vài mạng trước'], ['the server will crash', 'máy chủ sẽ sập'], ['gzip will break', 'gzip sẽ hỏng']]),
        correctIndex: 1, points: 1,
        explanation: ex('A single vantage point can mislead: a slow connect may be your local network or a bad hop, not the server. Measure from several networks — if only one region is slow, it is a path problem no server tuning will fix. One measurement is not enough, and nothing crashes or breaks.', 'Một điểm nhìn đơn có thể đánh lừa: một connect chậm có thể là mạng cục bộ của bạn hay một hop tồi, không phải máy chủ. Đo từ vài mạng — nếu chỉ một vùng chậm, đó là một vấn đề đường không tinh chỉnh máy chủ nào sửa. Một phép đo không đủ, và không gì sập hay hỏng.'),
      },
      {
        question: q('Which interview answer demonstrates experience rather than study?', 'Câu trả lời phỏng vấn nào thể hiện kinh nghiệm hơn là học?'),
        options: o([['"I know a lot about caching and HTTP."', '"Tôi biết nhiều về cache và HTTP."'], ['"I made the API faster and more reliable."', '"Tôi làm API nhanh hơn và tin cậy hơn."'], ['"Networking is my strong suit."', '"Mạng là sở trường của tôi."'], ['"I measured with curl -w, cut a 67 KB response to 1.8 KB with gzip, and collapsed a 3 s call to sub-ms with an edge cache."', '"Tôi đo với curl -w, cắt một câu trả lời 67 KB xuống 1,8 KB với gzip, và làm sụp một lời gọi 3 s xuống dưới-ms với một cache biên."']]),
        correctIndex: 3, points: 1,
        explanation: ex('The strong answer carries numbers and tools in every clause — a measured 37× and a 3-second-to-sub-millisecond collapse — which cannot be faked. The others are adjectives ("faster", "strong suit", "I know a lot") that interviewers hear constantly and cannot verify.', 'Câu trả lời mạnh mang con số và công cụ trong mỗi mệnh đề — một 37× đo được và một sụp ba-giây-xuống-dưới-mili-giây — không thể giả. Các cái khác là tính từ ("nhanh hơn", "sở trường", "tôi biết nhiều") mà người phỏng vấn nghe liên tục và không kiểm được.'),
      },
      {
        question: q('Across the whole course, what is the single "spine" that every chapter is a hop on?', 'Qua cả khoá, "xương sống" duy nhất mà mỗi chương là một chặng trên đó là gì?'),
        options: o([['the OSI model diagram', 'sơ đồ mô hình OSI'], ['the Linux kernel', 'nhân Linux'], ['the request path: DNS → TCP → TLS → HTTP → CDN/LB → real-time', 'đường request: DNS → TCP → TLS → HTTP → CDN/LB → real-time'], ['the TCP state machine', 'máy trạng thái TCP']]),
        correctIndex: 2, points: 1,
        explanation: ex('The course is organised around one request path — DNS resolves, TCP/TLS connect and secure, HTTP requests, CDN/LB sit at the edge, real-time keeps a line open. Every chapter is a hop on it. The OSI diagram, the kernel and the TCP state machine are pieces, not the spine.', 'Khoá tổ chức quanh một đường request — DNS phân giải, TCP/TLS nối và bảo mật, HTTP yêu cầu, CDN/LB ở biên, real-time giữ một đường mở. Mỗi chương là một chặng trên đó. Sơ đồ OSI, nhân và máy trạng thái TCP là các mảnh, không phải xương sống.'),
      },
      {
        question: q('What makes the capstone\'s "break it on purpose" step valuable for production?', 'Cái gì làm bước "làm hỏng có chủ đích" của capstone giá trị cho production?'),
        options: o([['a failure you have induced and diagnosed becomes a known shape you read in seconds (and reveals missing alerts)', 'một lỗi bạn đã gây và chẩn đoán thành một dáng đã biết bạn đọc trong giây (và lộ ra cảnh báo thiếu)'], ['it damages the server so you buy a new one', 'nó làm hỏng máy chủ nên bạn mua một cái mới'], ['it is only for exams', 'nó chỉ để thi'], ['it replaces monitoring', 'nó thay giám sát']]),
        correctIndex: 0, points: 1,
        explanation: ex('Deliberately inducing a failure (chaos engineering in miniature) turns it from a scary unknown into a known shape you diagnose fast — and each one asks whether an alert/health-check/timeout would have caught it, revealing gaps to close before a real incident. It does not damage hardware, is not exam-only, and complements rather than replaces monitoring.', 'Cố ý gây một lỗi (chaos engineering thu nhỏ) biến nó từ một vô danh đáng sợ thành một dáng đã biết bạn chẩn đoán nhanh — và mỗi cái hỏi liệu một cảnh báo/kiểm-sức-khoẻ/timeout có bắt được nó, lộ ra lỗ hổng để bịt trước một sự cố thật. Nó không làm hỏng phần cứng, không chỉ để thi, và bổ sung chứ không thay giám sát.'),
      },
    ],
  },
};
