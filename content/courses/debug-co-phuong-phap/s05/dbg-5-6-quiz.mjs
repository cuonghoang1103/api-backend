/**
 * 5.6 — Kiểm tra Chương 5 (soạn 24/11/2026). 10 câu; đáp án dựa trên output chạy thật của bài 5.1–5.5
 * (Chrome 150 headless + CDP, React 19.3, Vite 8.3, API node:http). Phân bố đáp án: A3 B2 C3 D2.
 */
export default {
  title: '5.6 — Chapter 5 quiz|||5.6 — Kiểm tra Chương 5',
  slug: 'dbg-5-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: đọc lỗi CORS preflight và AllowOriginMismatch, server trả 200 mà JS không đọc được, site và origin (localhost với 127.0.0.1), HttpOnly và document.cookie, DOM breakpoint tìm script xoá phần tử, Pause on caught exceptions dừng trong React, 304 trên dây còn fetch thấy 200, HAR chứa cookie phiên, service worker giữ bản cũ, prop 402 mà state 401.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, all taken from runs in this chapter. Read the explanation after submitting.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I find the first relevant error in a noisy Console and know which red lines are normal.</li>
<li>I can tell from Network whether a CORS failure happened at the preflight or at the response, and reproduce it with curl.</li>
<li>I use fetch, DOM and event-listener breakpoints, with the Ignore list, instead of guessing lines.</li>
<li>I read cookie warnings (SameSite, Secure, Path), and I know what HttpOnly and a HAR file mean for security.</li>
<li>I can clear a misbehaving service worker and compare a component's props with its state.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, đều lấy từ các lần chạy trong chương này. Đọc phần giải thích sau khi nộp.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tìm được lỗi đầu tiên có liên quan trong một Console đầy nhiễu và biết dòng đỏ nào là bình thường.</li>
<li>Nhìn Network tôi biết lỗi CORS xảy ra ở preflight hay ở response, và tái hiện được bằng curl.</li>
<li>Tôi dùng breakpoint fetch, DOM, event listener kèm Ignore list thay vì đoán dòng.</li>
<li>Tôi đọc được cảnh báo cookie (SameSite, Secure, Path), và biết HttpOnly và tệp HAR có ý nghĩa gì với bảo mật.</li>
<li>Tôi gỡ được một service worker làm bậy và so được props với state của một component.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A React page is blank. The Console shows: [vite] connecting… · "Download the React DevTools" · favicon.ico 404 · 401 /api/toi (twice) · Uncaught TypeError: Cannot read properties of undefined (reading \'map\') at App.jsx:13. What do you investigate first?|||Trang React trắng tinh. Console hiện: [vite] connecting… · "Download the React DevTools" · favicon.ico 404 · 401 /api/toi (hai lần) · Uncaught TypeError: Cannot read properties of undefined (reading \'map\') ở App.jsx:13. Bạn điều tra gì trước?',
        options: [
          'The 401 on /api/toi, because it is the first red line|||Lỗi 401 ở /api/toi, vì nó là dòng đỏ đầu tiên',
          'The missing favicon|||Cái favicon bị thiếu',
          'The Uncaught TypeError at App.jsx:13 — uncaught, in our file, and it unmounts the React root|||Lỗi Uncaught TypeError ở App.jsx:13 — không ai bắt, nằm trong tệp của mình, và nó gỡ cả root React',
          'The Vite connection message|||Dòng kết nối của Vite',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: 401 on "who am I" before login is the expected answer (twice because of Strict Mode); favicon and Vite lines are noise. The uncaught render error with no error boundary is what blanks the page — in lesson 5.1 the API had renamed lich to items.|||VI: 401 của "tôi là ai" trước khi đăng nhập là câu trả lời đúng mong đợi (hai lần do Strict Mode); favicon và dòng Vite là nhiễu. Lỗi render không ai bắt, không có error boundary mới là thứ làm trắng trang — ở bài 5.1 API đã đổi lich thành items.',
      },
      {
        question: 'Clicking Lưu shows in Network: OPTIONS /api/dat-cho 404, then POST /api/dat-cho (failed) "CORS error". The API log shows one OPTIONS and nothing else. What is true?|||Bấm Lưu, Network hiện: OPTIONS /api/dat-cho 404, rồi POST /api/dat-cho (failed) "CORS error". Log API chỉ có một dòng OPTIONS, không có gì khác. Điều nào đúng?',
        options: [
          'The preflight failed, so the browser never sent the POST; the API needs to answer OPTIONS with 2xx and the right Allow-* headers|||Preflight thất bại nên trình duyệt chưa hề gửi POST; API phải trả lời OPTIONS bằng 2xx và đúng các header Allow-*',
          'The POST reached the server and crashed it|||POST đã tới server và làm nó sập',
          'The fix is to add mode: "no-cors" to fetch|||Sửa bằng cách thêm mode: "no-cors" vào fetch',
          'CORS errors cannot be reproduced outside the browser, so the ticket is unfixable|||Lỗi CORS không tái hiện được ngoài trình duyệt nên ticket không sửa được',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: JSON POST cross-origin is not a simple request ⇒ preflight first. 404 ⇒ "does not have HTTP ok status" (PreflightInvalidStatus) ⇒ no POST. curl -X OPTIONS with Origin + Access-Control-Request-* reproduces it. "no-cors" gives an opaque response your code cannot read.|||VI: POST JSON khác origin không phải request đơn giản ⇒ preflight trước. 404 ⇒ "does not have HTTP ok status" (PreflightInvalidStatus) ⇒ không có POST. curl -X OPTIONS kèm Origin + Access-Control-Request-* tái hiện được. "no-cors" cho response mờ mà mã của bạn không đọc được.',
      },
      {
        question: 'The server log says GET /api/phong → 200, Postman gets the JSON, but the page shows CORS error AllowOriginMismatch. What explains it?|||Log server ghi GET /api/phong → 200, Postman nhận được JSON, nhưng trang báo lỗi CORS AllowOriginMismatch. Điều gì giải thích?',
        options: [
          'The server is lying in its log|||Server ghi log sai',
          'Postman uses a newer HTTP version|||Postman dùng phiên bản HTTP mới hơn',
          'The JSON is invalid|||JSON không hợp lệ',
          'The response\'s Access-Control-Allow-Origin names another origin (e.g. port 3000); the browser received the 200 but refuses to give it to page JavaScript|||Access-Control-Allow-Origin của response ghi origin khác (ví dụ cổng 3000); trình duyệt đã nhận 200 nhưng không chịu đưa cho JavaScript của trang',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: In lesson 5.2 the wire status was 200 while the fetch failed. CORS is enforced by the browser; Postman and curl ignore it. Compare Origin and Access-Control-Allow-Origin character by character.|||VI: Ở bài 5.2 mã trên dây là 200 trong khi fetch thất bại. CORS do trình duyệt thực thi; Postman và curl phớt lờ nó. So Origin với Access-Control-Allow-Origin từng ký tự.',
      },
      {
        question: 'Page http://localhost:41511 calls http://127.0.0.1:41510/api/dang-nhap, which answers 200 with Set-Cookie: sid=…; HttpOnly; SameSite=Lax. The next /api/toi is 401. Why?|||Trang http://localhost:41511 gọi http://127.0.0.1:41510/api/dang-nhap, nhận 200 kèm Set-Cookie: sid=…; HttpOnly; SameSite=Lax. Lần gọi /api/toi tiếp theo ra 401. Vì sao?',
        options: [
          'HttpOnly cookies are never sent with fetch|||Cookie HttpOnly không bao giờ được gửi kèm fetch',
          'localhost and 127.0.0.1 are different sites, so the Lax cookie is blocked from a cross-site fetch (DevTools: ⚠ SameSiteLax)|||localhost và 127.0.0.1 là hai site khác nhau, nên cookie Lax bị chặn ở fetch cross-site (DevTools: ⚠ SameSiteLax)',
          'The cookie expired immediately|||Cookie hết hạn ngay lập tức',
          'Port numbers are not allowed in cookies|||Cookie không cho phép số cổng',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Measured in 5.4 (config A): "blocked when saving: SameSiteLax". With a Vite proxy (same origin) the same Lax cookie works; SameSite=None needs Secure, otherwise SameSiteNoneInsecure.|||VI: Đo ở bài 5.4 (cấu hình A): "bị chặn khi lưu: SameSiteLax". Có proxy Vite (cùng origin) thì cùng cookie Lax chạy được; SameSite=None cần Secure, thiếu thì SameSiteNoneInsecure.',
      },
      {
        question: 'After logging in, Application › Cookies shows sid with HttpOnly ✓, yet document.cookie in the Console returns "". What does that mean?|||Sau khi đăng nhập, Application › Cookies có sid với HttpOnly ✓, nhưng gõ document.cookie trong Console ra "". Điều đó nghĩa là gì?',
        options: [
          'The cookie was not saved|||Cookie chưa được lưu',
          'The Console runs in another origin|||Console chạy ở origin khác',
          'It works as intended: HttpOnly hides the cookie from JavaScript, so an XSS script cannot steal the session — a token in localStorage would be readable|||Đúng như thiết kế: HttpOnly giấu cookie khỏi JavaScript, nên script XSS không lấy được phiên — token trong localStorage thì đọc được',
          'The browser will send the cookie only to HTTPS sites|||Trình duyệt sẽ chỉ gửi cookie tới trang HTTPS',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Config C in 5.4: cookie stored and sent, document.cookie = "". That is the point of HttpOnly. Secure (not HttpOnly) is the HTTPS-only flag.|||VI: Cấu hình C ở bài 5.4: cookie được lưu và gửi, document.cookie = "". Đó chính là mục đích của HttpOnly. Cờ chỉ-HTTPS là Secure chứ không phải HttpOnly.',
      },
      {
        question: 'A banner in index.html (outside React) disappears 1.5 s after load. Nothing in your code removes it. Fastest way to find the culprit?|||Một dải thông báo trong index.html (ngoài React) biến mất 1,5 giây sau khi tải. Mã của bạn không có chỗ nào xoá nó. Cách nhanh nhất tìm thủ phạm?',
        options: [
          'Elements → right-click the node → Break on → node removal, reload, read the call stack|||Elements → chuột phải nút đó → Break on → node removal, tải lại, đọc call stack',
          'Search the whole project for "remove("|||Tìm "remove(" trong cả dự án',
          'Add console.log in every component|||Thêm console.log vào mọi component',
          'A fetch breakpoint on the page URL|||Breakpoint fetch với URL của trang',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: In 5.3 the DOM breakpoint paused in donCho (widget-ho-tro.js:5): the third-party chat widget removed ".thong-bao" — a file not in your project, so searching your code finds nothing.|||VI: Ở bài 5.3 breakpoint DOM dừng ở donCho (widget-ho-tro.js:5): widget chat của bên thứ ba xoá ".thong-bao" — tệp không nằm trong dự án của bạn, nên tìm trong mã của mình không ra.',
      },
      {
        question: 'With "Pause on caught exceptions" on, a React app pauses many times in DetermineComponentFrameRoot inside react-dom before reaching your code. What helps most?|||Bật "Pause on caught exceptions", ứng dụng React dừng nhiều lần ở DetermineComponentFrameRoot trong react-dom trước khi tới mã của bạn. Cách nào giúp nhất?',
        options: [
          'Turn off source maps|||Tắt source map',
          'Add /node_modules/ to the Ignore list — React throws and catches errors on purpose in development; ignored frames do not pause|||Thêm /node_modules/ vào Ignore list — React cố ý ném và bắt lỗi ở dev; frame bị bỏ qua thì không dừng',
          'Use the production build of React while debugging|||Dùng bản production của React khi debug',
          'Switch to "Pause on uncaught" only and never use caught mode|||Chỉ dùng "Pause on uncaught", không bao giờ dùng chế độ caught',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Our run: 9 pauses without the Ignore list, 6 with it; the remaining ones were our crash and the swallowed 401 in api.js — exactly what caught mode is for.|||VI: Lần chạy của chúng tôi: 9 lần dừng khi không có Ignore list, 6 lần khi có; những lần còn lại là chỗ sập của mình và cái 401 bị nuốt trong api.js — đúng thứ chế độ caught sinh ra để tìm.',
      },
      {
        question: 'On reload, DevTools shows GET /api/phong with status 304, but your code logs res.status === 200. Which is right?|||Khi tải lại, DevTools hiện GET /api/phong mã 304, nhưng mã của bạn in res.status === 200. Cái nào đúng?',
        options: [
          'DevTools is wrong|||DevTools sai',
          'Your code is wrong|||Mã của bạn sai',
          'The server sent the body twice|||Server gửi body hai lần',
          'Both: the browser revalidated with If-None-Match, the server answered 304 without a body, and fetch hands your code the cached 200 response|||Cả hai: trình duyệt kiểm lại bằng If-None-Match, server trả 304 không có body, và fetch đưa cho mã của bạn response 200 đã cất',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 5.2: "200 (wire 304)". Disable cache removes If-None-Match and adds Cache-Control: no-cache / Pragma: no-cache.|||VI: Bài 5.2: "200 (dây 304)". Disable cache bỏ If-None-Match và thêm Cache-Control: no-cache / Pragma: no-cache.',
      },
      {
        question: 'Support asks a customer for a HAR file of a failed checkout. What is the main risk, and what do you do?|||Đội hỗ trợ xin khách tệp HAR của một lần thanh toán lỗi. Rủi ro chính là gì, và bạn làm gì?',
        options: [
          'HAR files are too big for email; compress them|||Tệp HAR quá lớn để gửi email; nén lại',
          'A HAR only contains timings, so there is no risk|||HAR chỉ chứa thời gian nên không có rủi ro',
          'It contains cookies/Authorization headers that let anyone replay the session (Okta 2023); ask the user to log out after recording, redact the file, share via the ticket system, delete after use|||Nó chứa cookie/header Authorization cho phép bất kỳ ai dùng lại phiên (vụ Okta 2023); dặn người dùng đăng xuất sau khi ghi, che tệp, gửi qua hệ thống ticket, xoá sau khi dùng',
          'HAR files can infect the computer that opens them|||Tệp HAR có thể lây virus cho máy mở nó',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: In 5.2 the sid copied from a HAR worked with curl from another client: {"ten":"SE1804"}. Okta\'s support system breach (October 2023) used exactly such tokens.|||VI: Ở bài 5.2 sid chép từ HAR dùng được bằng curl từ một client khác: {"ten":"SE1804"}. Vụ lộ hệ thống hỗ trợ của Okta (tháng 10/2023) dùng đúng loại token đó.',
      },
      {
        question: 'After a deploy, a user still sees version 1.0.0; curl to the server returns 1.1.0; Network shows the file "(from service worker)". Which is the right short-term action and long-term fix?|||Sau khi deploy, một người dùng vẫn thấy bản 1.0.0; curl tới server ra 1.1.0; Network hiện tệp "(from service worker)". Việc trước mắt và cách sửa lâu dài đúng là gì?',
        options: [
          'Now: Application › Service workers (Update on reload / Unregister) or Clear site data. Fix: versioned caches deleted on activate, never cache /api blindly, network-first for HTML and version files|||Trước mắt: Application › Service workers (Update on reload / Unregister) hoặc Clear site data. Lâu dài: bộ đệm có phiên bản và xoá khi activate, không cache /api bừa, HTML và tệp phiên bản lấy từ mạng trước',
          'Now: tick Disable cache in the user\'s DevTools. Fix: add Cache-Control: no-store to every response|||Trước mắt: tích Disable cache trong DevTools của người dùng. Lâu dài: thêm Cache-Control: no-store cho mọi response',
          'Now: restart the server. Fix: deploy twice|||Trước mắt: khởi động lại server. Lâu dài: deploy hai lần',
          'Nothing; service workers update themselves within a minute|||Không cần làm gì; service worker tự cập nhật trong vòng một phút',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: A service worker answers before the HTTP cache, so Disable cache does not help. Lesson 5.4 and Lab 5.5 measured it; even the fixed worker needs one more navigation before it takes over for existing users.|||VI: Service worker trả lời trước cả HTTP cache, nên Disable cache vô dụng. Bài 5.4 và Lab 5.5 đã đo; kể cả worker đã sửa cũng cần thêm một lần điều hướng mới thay được worker cũ ở người dùng hiện có.',
      },
    ],
  },
};
