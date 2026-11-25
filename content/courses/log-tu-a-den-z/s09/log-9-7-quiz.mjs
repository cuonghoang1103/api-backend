/**
 * 9.7 — Kiểm tra Chương 9 (soạn 24/11/2026, agent lgz). 8 câu; mọi đáp số dựa trên output thật OUT['s09/*'] (Lab 9, Chrome 150).
 * Phân bố đáp án: A ×2 (3, 7) · B ×2 (1, 5) · C ×2 (2, 6) · D ×2 (4, 8).
 */
export default {
  title: '9.7 — Chapter 9 quiz|||9.7 — Kiểm tra Chương 9',
  slug: 'log-9-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Tám câu: ai viết dòng Console, mức Verbose bị ẩn, lỗi CORS che lỗi 500, trạng thái -1 trong HAR, chế độ xuất HAR "sanitized" còn sót gì, đọc pha thời gian, nhiễu trong NetLog, và bài học log của vụ Okta 2023.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Console, Network, HAR, NetLog and front-end errors</h2>
<p class="lead">Eight questions built on the real output of Lab 9. For each one, ask: who wrote this line — my code, the browser, or the server?</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can tell lines written by my code from lines written by the browser.</li>
<li>I check the server log by request id before blaming CORS.</li>
<li>I filter HAR failures including status -1/0.</li>
<li>I know what Chrome's sanitised HAR export removes — and what it leaves.</li>
<li>I can say which timing phase points at the server.</li>
<li>I can separate NetLog noise from the error that ended a request.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Console, Network, HAR, NetLog và lỗi phía giao diện</h2>
<p class="lead">Tám câu dựa trên output thật của Lab 9. Với mỗi câu, tự hỏi: ai đã viết dòng này — mã của tôi, trình duyệt, hay máy chủ?</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi phân biệt được dòng do mã của tôi viết với dòng do trình duyệt viết.</li>
<li>Tôi xem log máy chủ theo request id trước khi đổ lỗi cho CORS.</li>
<li>Tôi lọc lỗi trong HAR kể cả trạng thái -1/0.</li>
<li>Tôi biết cách xuất HAR "sanitized" của Chrome bỏ gì — và để lại gì.</li>
<li>Tôi nói được pha thời gian nào chỉ về phía máy chủ.</li>
<li>Tôi tách được nhiễu trong NetLog khỏi lỗi đã kết thúc một request.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      {
        question: 'The Console shows "(network) Failed to load resource: the server responded with a status of 404 (Not Found) — logo-moi.png". Who wrote this line?|||Console hiện "(network) Failed to load resource: the server responded with a status of 404 (Not Found) — logo-moi.png". Ai đã viết dòng này?',
        options: [
          'Our app.js, with console.error|||app.js của ta, bằng console.error',
          'The browser itself, reporting a failed resource load|||Chính trình duyệt, báo một lần tải tài nguyên thất bại',
          'The web server, through a response header|||Máy chủ web, qua một header phản hồi',
          'The CSP report endpoint|||Điểm nhận báo cáo CSP',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lines tagged (network)/(security)/(javascript) are browser-written; our own lines carry a file:line like app.js:20. The image tag failed before any script ran.|||VI: Dòng gắn (network)/(security)/(javascript) là do trình duyệt viết; dòng của ta có tệp:dòng kiểu app.js:20. Thẻ ảnh hỏng trước khi script nào kịp chạy.',
      },
      {
        question: 'A teammate logs with console.debug("[boot] cấu hình", …) and says nothing appears in DevTools. Most likely reason?|||Đồng nghiệp log bằng console.debug("[boot] cấu hình", …) và nói DevTools không hiện gì. Lý do khả dĩ nhất?',
        options: [
          'console.debug only works in Node.js|||console.debug chỉ chạy trong Node.js',
          'The CSP blocked the message|||CSP đã chặn thông điệp',
          'console.debug is the Verbose level, hidden by "Default levels"|||console.debug là mức Verbose, bị "Default levels" ẩn đi',
          'The source map is missing|||Thiếu source map',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: DevTools has four levels; Verbose (console.debug) is off by default. In Lab 9 the [verbose] line was there all along.|||VI: DevTools có bốn mức; Verbose (console.debug) mặc định tắt. Ở Lab 9, dòng [verbose] vẫn luôn ở đó.',
      },
      {
        question: 'Console: "blocked by CORS policy: No \'Access-Control-Allow-Origin\' header" on /api/orders, a call that worked yesterday. What do you do first?|||Console: "blocked by CORS policy: No \'Access-Control-Allow-Origin\' header" ở /api/orders, lời gọi hôm qua vẫn chạy. Việc đầu tiên bạn làm?',
        options: [
          'Find that request in the server logs (access log, then app log by request id)|||Tìm request đó trong log máy chủ (access log, rồi log ứng dụng theo request id)',
          'Add Access-Control-Allow-Origin: * to every response|||Thêm Access-Control-Allow-Origin: * vào mọi phản hồi',
          'Install a CORS-disabling browser extension|||Cài extension tắt CORS cho trình duyệt',
          'Switch fetch to XMLHttpRequest|||Đổi fetch sang XMLHttpRequest',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: In Lab 9 the access log had 500 and the app log had TypeError … userId for the same rid — the error path forgot CORS headers. A wildcard would only hide the next bug.|||VI: Ở Lab 9, access log ghi 500 và log ứng dụng có TypeError … userId cho cùng rid — nhánh lỗi quên header CORS. Dùng dấu * chỉ giấu tiếp lỗi sau.',
      },
      {
        question: 'You filter a HAR with select(.response.status >= 400) and see 404, 401, 504. The user also complained about the order list. Why is it missing?|||Bạn lọc HAR bằng select(.response.status >= 400) và thấy 404, 401, 504. Người dùng còn phàn nàn danh sách đơn hàng. Vì sao nó không có?',
        options: [
          'Playwright does not record fetch requests|||Playwright không ghi request fetch',
          'The order request was sent from a service worker|||Request đơn hàng được gửi từ service worker',
          'jq cannot compare negative numbers|||jq không so sánh được số âm',
          'It has status -1 (no response reached the page, _failureText net::ERR_FAILED), so the filter needs "or .response.status <= 0"|||Nó có trạng thái -1 (không phản hồi nào tới trang, _failureText net::ERR_FAILED), nên bộ lọc cần thêm "or .response.status <= 0"',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: CORS-blocked and network-failed requests have no HTTP status in a HAR. Always include -1/0 and read _failureText.|||VI: Request bị CORS chặn hoặc lỗi mạng không có mã HTTP trong HAR. Luôn tính cả -1/0 và đọc _failureText.',
      },
      {
        question: 'Your tester exported the HAR with Chrome 130+ default "Export HAR (sanitized)". What can still be inside, as in Lab 9?|||Tester xuất HAR bằng chế độ mặc định "Export HAR (sanitized)" của Chrome 130+. Bên trong vẫn có thể còn gì, như ở Lab 9?',
        options: [
          'Nothing sensitive — that is what sanitized means|||Không còn gì nhạy cảm — sanitized nghĩa là vậy',
          'The password in the login POST body and tokens in the URL and in response bodies|||Mật khẩu trong thân POST đăng nhập và token trên URL lẫn trong thân phản hồi',
          'Only the Authorization header|||Chỉ còn header Authorization',
          'Only cookies|||Chỉ còn cookie',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: The sanitized export drops Cookie, Set-Cookie and Authorization headers only. After the same removal, tim-bi-mat.bash still found 2 JWTs, token= in a URL and the password.|||VI: Bản sanitized chỉ bỏ header Cookie, Set-Cookie và Authorization. Sau khi bỏ đúng chừng đó, tim-bi-mat.bash vẫn thấy 2 JWT, token= trên URL và mật khẩu.',
      },
      {
        question: '/api/report: Time 2004 ms, Waiting for server response 2002 ms, connection reused; access log rt=2.001. Where is the problem?|||/api/report: Time 2004 ms, Waiting for server response 2002 ms, dùng lại kết nối; access log rt=2.001. Vấn đề nằm ở đâu?',
        options: [
          'DNS resolution on the client|||Phân giải DNS ở máy khách',
          'The TLS handshake|||Bắt tay TLS',
          'On the server side: the API waited for a dependency (app log: upstream timed out calling report-svc)|||Ở phía máy chủ: API chờ một dịch vụ phụ thuộc (log ứng dụng: upstream timed out calling report-svc)',
          'Downloading a large response body|||Tải một thân phản hồi lớn',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Almost all time is TTFB on a reused connection and the server measured the same duration — backend work, here a 2 s gateway timeout to a 5 s service.|||VI: Gần như toàn bộ thời gian là TTFB trên kết nối dùng lại và máy chủ đo đúng con số đó — việc của backend, ở đây là cổng timeout 2 giây chờ một dịch vụ cần 5 giây.',
      },
      {
        question: 'A NetLog shows several ERR_ADDRESS_UNREACHABLE events on UDP sockets to [2001:4860:4860::8888]:443, while the failing site gives ERR_CERT_AUTHORITY_INVALID. How do you treat the first ones?|||Một NetLog có vài sự kiện ERR_ADDRESS_UNREACHABLE trên socket UDP tới [2001:4860:4860::8888]:443, còn trang hỏng thì ra ERR_CERT_AUTHORITY_INVALID. Bạn xử lý những dòng đầu thế nào?',
        options: [
          'As noise: Chrome probing for an IPv6 route; the real failure is the one that ends the URL_REQUEST|||Là nhiễu: Chrome thăm dò đường IPv6; lỗi thật là lỗi kết thúc URL_REQUEST',
          'As the cause: Google DNS is down|||Là nguyên nhân: DNS của Google đang sập',
          'As evidence of an attack|||Là bằng chứng bị tấn công',
          'As the reason the certificate is invalid|||Là lý do chứng chỉ không hợp lệ',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Count errors, then follow only the ones attached to the failed URL_REQUEST (URL_REQUEST → SSL_CONNECT_JOB → SOCKET → CERT_VERIFIER_JOB). ERR_ABORTED preconnects are noise too.|||VI: Đếm lỗi, rồi chỉ đi theo những lỗi gắn với URL_REQUEST hỏng (URL_REQUEST → SSL_CONNECT_JOB → SOCKET → CERT_VERIFIER_JOB). Các kết nối mở sẵn ERR_ABORTED cũng là nhiễu.',
      },
      {
        question: 'Why did Okta\'s first investigation in 2023 not find the attacker\'s file downloads, according to its own root-cause report?|||Theo báo cáo nguyên nhân gốc của chính Okta, vì sao cuộc điều tra ban đầu năm 2023 không thấy các lần tải tệp của kẻ tấn công?',
        options: [
          'The attacker deleted the logs|||Kẻ tấn công đã xoá log',
          'Logging was disabled on the support system|||Hệ thống hỗ trợ đã tắt ghi log',
          'The HAR files were encrypted|||Các tệp HAR đã được mã hoá',
          'Going straight to the Files tab produced a different log event type than opening an attachment, and the search looked at the other type|||Vào thẳng tab Files sinh ra một kiểu sự kiện log khác với mở tệp đính kèm, và cuộc tìm kiếm lại nhìn vào kiểu kia',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Only after BeyondTrust shared the attacker\'s IP (13/10/2023) did Okta find the downloads. Before concluding "nothing suspicious", list every event type an action can produce.|||VI: Chỉ khi BeyondTrust đưa IP của kẻ tấn công (13/10/2023), Okta mới tìm ra các lần tải. Trước khi kết luận "không có gì đáng ngờ", hãy liệt kê mọi kiểu sự kiện một hành động có thể sinh ra.',
      },
    ],
  },
};
