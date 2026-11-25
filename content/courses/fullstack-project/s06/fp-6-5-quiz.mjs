/**
 * 6.5 — Kiểm tra Chương 6 (soạn 24/11/2026, agent fsp). BÀI THÊM (không có trong khung), slug mới fp-6-5-quiz.
 * 10 câu; đáp án dựa trên output chạy thật của bài 6.1–6.4 (Chrome 150, Vite 8.3.8, React 19.3, React Router 8.5.2).
 * Phân bố đáp án: A3 B2 C2 D3.
 */
export default {
  title: '6.5 — Chapter 6 quiz|||6.5 — Kiểm tra Chương 6',
  slug: 'fp-6-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: CORS chặn gì và không chặn gì, preflight, vì sao dùng proxy một origin, biến VITE_, StrictMode làm trùng danh sách, refresh chưa gộp làm F5 "đăng xuất", hai tab và phát hiện dùng lại, token hết hạn với ba request, hai requestSubmit() cùng tác vụ, và XSS khi token đã ở trong bộ nhớ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations taken from what actually happened when ChiaSe got its React frontend. Read every explanation, including for the questions you got right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain, with my own Network tab, what CORS blocked and what it did not.</li>
<li>I can reload my app in development and see exactly one refresh request.</li>
<li>I can open two tabs, reload both, and stay logged in — and explain why.</li>
<li>I can show that HTML typed into a comment is displayed as text.</li>
<li>My Checkpoint 6 passes 23/23 on a clean clone.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ chính những gì đã xảy ra khi ChiaSe có frontend React. Đọc mọi phần giải thích, kể cả câu bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được, bằng tab Network của chính mình, CORS đã chặn gì và không chặn gì.</li>
<li>Tôi tải lại app khi dev và thấy đúng một request refresh.</li>
<li>Tôi mở hai tab, tải lại cả hai, vẫn đăng nhập — và giải thích được vì sao.</li>
<li>Tôi chứng minh được HTML gõ vào bình luận hiện ra dạng chữ.</li>
<li>Checkpoint 6 của tôi đạt 23/23 trên clone sạch.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'The page on localhost:41811 fetched http://localhost:41815/api/posts. Chrome printed "blocked by CORS policy". What did the API log show?|||Trang ở localhost:41811 fetch http://localhost:41815/api/posts. Chrome in "blocked by CORS policy". Log của API cho thấy gì?',
        options: [
          'Two GET /api/posts with status 200 — the request was executed; the browser only refused to let the page read the response|||Hai GET /api/posts trạng thái 200 — request đã được thực thi; trình duyệt chỉ không cho trang đọc phản hồi',
          'Nothing — CORS stops the request before it leaves the browser|||Không có gì — CORS chặn request trước khi rời trình duyệt',
          'One OPTIONS answered 403|||Một OPTIONS bị trả 403',
          'One GET answered 401 because the cookie was missing|||Một GET bị trả 401 vì thiếu cookie',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Measured: the API log had GET /api/posts?limit=3 200 twice (StrictMode ran the effect twice). A simple GET is sent and executed; CORS only decides whether the page may read the answer. It protects users from other sites, not your server.|||VI: Đã đo: log API có GET /api/posts?limit=3 200 hai lần (StrictMode chạy effect hai lần). GET đơn giản vẫn được gửi và thực thi; CORS chỉ quyết định trang có được đọc câu trả lời không. Nó bảo vệ người dùng khỏi site khác, không bảo vệ máy chủ của bạn.',
      },
      {
        question: 'With cors({ origin, credentials: true }) enabled, the page called GET /api/me three times in parallel with an Authorization header. What appeared in the API log first?|||Bật cors({ origin, credentials: true }), trang gọi GET /api/me ba lần song song có header Authorization. Log API hiện gì trước?',
        options: [
          'Nothing special: GET requests never need a preflight|||Không có gì đặc biệt: GET không bao giờ cần preflight',
          'Three OPTIONS, one per request, always|||Ba OPTIONS, mỗi request một cái, luôn luôn',
          'Two OPTIONS /api/me 204 — Authorization makes it non-simple; parallel calls raced the preflight cache|||Hai OPTIONS /api/me 204 — Authorization làm nó thành request không đơn giản; các lời gọi song song chạy đua với bộ nhớ preflight',
          'One OPTIONS answered 405 because Express has no OPTIONS route|||Một OPTIONS bị 405 vì Express không có route OPTIONS',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Measured: OPTIONS /api/me 204 twice, then the three GETs; after a 6-second pause the next GET needed a new preflight (Chrome caches about 5 s without Access-Control-Max-Age). A custom header such as Authorization makes any method non-simple.|||VI: Đã đo: OPTIONS /api/me 204 hai lần, rồi ba GET; sau 6 giây nghỉ, GET tiếp theo lại cần preflight mới (Chrome nhớ khoảng 5 s khi không có Access-Control-Max-Age). Header riêng như Authorization làm mọi method thành không đơn giản.',
      },
      {
        question: 'Why does ChiaSe use Vite\'s proxy for /api in development instead of enabling CORS in the API?|||Vì sao khi dev ChiaSe dùng proxy /api của Vite thay vì bật CORS ở API?',
        options: [
          'CORS does not work on localhost|||CORS không chạy trên localhost',
          'Production will serve page and API from one origin through Nginx; the proxy gives development the same shape — no CORS code, no preflights, cookies as designed|||Production sẽ phục vụ trang và API cùng một origin qua Nginx; proxy cho môi trường dev đúng hình đó — không mã CORS, không preflight, cookie đúng thiết kế',
          'The proxy encrypts traffic between browser and API|||Proxy mã hoá đường truyền giữa trình duyệt và API',
          'The proxy hides the API from attackers|||Proxy giấu API khỏi kẻ tấn công',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Same origin in dev and prod: Vite forwards /api now, Nginx later (Chapter 11). The API keeps no CORS policy that could be misconfigured. CORS works on localhost (we measured it); it is just unnecessary here.|||VI: Cùng origin ở dev và production: Vite chuyển tiếp /api bây giờ, Nginx sau này (Chương 11). API không giữ chính sách CORS nào có thể bị cấu hình sai. CORS vẫn chạy trên localhost (ta đã đo); chỉ là không cần.',
      },
      {
        question: 'A teammate wants to put the API base URL and an analytics secret in VITE_API_URL and VITE_ANALYTICS_KEY. What is the problem?|||Một bạn cùng nhóm muốn để địa chỉ API và một khoá bí mật thống kê vào VITE_API_URL và VITE_ANALYTICS_KEY. Vấn đề là gì?',
        options: [
          'Vite cannot read variables with underscores|||Vite không đọc được biến có dấu gạch dưới',
          'They are only available in vite.config.ts|||Chúng chỉ dùng được trong vite.config.ts',
          'Nothing — .env.local is in .gitignore|||Không có gì — .env.local đã nằm trong .gitignore',
          'Every VITE_ variable used in code is embedded into the JavaScript sent to every visitor; secrets must never have that prefix|||Mọi biến VITE_ được dùng trong mã đều bị nhúng vào JavaScript gửi tới mọi người truy cập; bí mật không bao giờ được mang tiền tố đó',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: .gitignore keeps the file out of git, not out of the bundle. ChiaSe\'s proxy target is API_URL (no prefix), read only by vite.config.ts; Checkpoint 6 scans dist/ for the API\'s secrets.|||VI: .gitignore giữ tệp khỏi git, không giữ khỏi bundle. Đích proxy của ChiaSe là API_URL (không tiền tố), chỉ vite.config.ts đọc; Checkpoint 6 quét dist/ tìm bí mật của API.',
      },
      {
        question: 'The first feed loaded page one in useEffect and appended it: setItems(old => [...old, ...page.items]). In development the list showed 20 rows for 10 posts. Best fix?|||Feed đầu tiên tải trang một trong useEffect rồi nối thêm: setItems(cu => [...cu, ...trang.items]). Khi dev danh sách hiện 20 dòng cho 10 bài. Cách sửa tốt nhất?',
        options: [
          'Abort the request in the effect\'s cleanup (and merge by id as a safety net) so a repeated effect never appends twice|||Huỷ request trong phần dọn của effect (và gộp theo id làm lưới an toàn) để effect chạy lại không bao giờ nối hai lần',
          'Remove <StrictMode> from main.tsx|||Bỏ <StrictMode> khỏi main.tsx',
          'Use the index as key instead of the id|||Dùng chỉ số làm key thay cho id',
          'Move the fetch into the render function|||Chuyển fetch vào thân hàm render',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: StrictMode ran the effect twice to show it was not safe to repeat. With AbortController in the cleanup the first request is cancelled (net::ERR_ABORTED in the log) and never appends. Removing StrictMode hides the bug; index keys hide the warning and break identity.|||VI: StrictMode chạy effect hai lần để chỉ ra nó không an toàn khi lặp. Có AbortController trong phần dọn, request đầu bị huỷ (net::ERR_ABORTED trong log) và không bao giờ nối thêm. Bỏ StrictMode là giấu lỗi; dùng chỉ số làm key là giấu cảnh báo và phá danh tính.',
      },
      {
        question: 'Before merging refresh, every F5 in development showed the user as logged out. What did the database show for that session family?|||Khi chưa gộp refresh, mỗi lần F5 khi dev giao diện đều báo đã đăng xuất. CSDL cho thấy gì về họ phiên đó?',
        options: [
          'The whole family revoked: 0 live tokens|||Cả họ bị thu hồi: 0 token sống',
          'No rows: the cookie had been deleted|||Không có dòng nào: cookie đã bị xoá',
          'Still one live token — one of the two parallel refreshes won (200); the loser\'s 401 made the UI log out while the server session was alive|||Vẫn còn một token sống — một trong hai refresh song song đã thắng (200); cái thua (401) làm giao diện đăng xuất trong khi phiên trên máy chủ vẫn sống',
          'Two live tokens, one per refresh|||Hai token sống, mỗi refresh một cái',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Measured: refresh 401 + refresh 200 on every reload; refresh_tokens showed the family with 1 live of 3. The rotation\'s conditional update let exactly one win. The client had to merge its refreshes into one shared promise.|||VI: Đã đo: mỗi lần tải lại có refresh 401 + refresh 200; refresh_tokens cho thấy họ token còn 1 sống trên 3. Lệnh cập nhật có điều kiện của xoay vòng cho đúng một cái thắng. Client phải gộp các lần refresh thành một promise dùng chung.',
      },
      {
        question: 'Refresh was merged inside each tab. Two tabs reloaded at the same moment; on the second round BOTH tabs were logged out. Why?|||Refresh đã gộp trong từng tab. Hai tab tải lại cùng lúc; ở lượt thứ hai CẢ HAI tab bị đăng xuất. Vì sao?',
        options: [
          'Web Locks are not supported on localhost|||Web Locks không được hỗ trợ trên localhost',
          'The cookie\'s SameSite=Strict blocks the second tab|||SameSite=Strict của cookie chặn tab thứ hai',
          'The access token was shared between tabs and expired|||Access token dùng chung giữa các tab và đã hết hạn',
          'A tab sent an already-rotated refresh token; the server treated it as theft and revoked the family — fixed with navigator.locks so tabs refresh one at a time|||Một tab gửi refresh token đã bị xoay; máy chủ coi là bị đánh cắp và thu hồi cả họ — sửa bằng navigator.locks để các tab refresh lần lượt',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: The API logged "token đã dùng bị dùng lại — thu hồi họ …". Each tab has its own merge variable. With a named Web Lock, the second tab waits; by then the browser holds the new cookie. Result: 0/20 failures, 41 successful refreshes.|||VI: API ghi "token đã dùng bị dùng lại — thu hồi họ …". Mỗi tab có biến gộp riêng. Với khoá Web Lock có tên, tab thứ hai chờ; tới lượt thì trình duyệt đã giữ cookie mới. Kết quả: 0/20 lần hỏng, 41 lần refresh thành công.',
      },
      {
        question: 'Access tokens live 5 seconds. After 6 seconds the page sends three protected requests at once. What did the Network log show?|||Access token sống 5 giây. Sau 6 giây trang gửi ba request cần đăng nhập cùng lúc. Log mạng cho thấy gì?',
        options: [
          'Three 401 → three refreshes → three 200|||Ba 401 → ba refresh → ba 200',
          'Three 401 (TOKEN_HET_HAN) → one refresh → three retries, all 200|||Ba 401 (TOKEN_HET_HAN) → một refresh → ba lần thử lại, đều 200',
          'One 401, then the other two waited before being sent|||Một 401, hai cái còn lại chờ rồi mới gửi',
          'Three 401 and the user was sent to the login page|||Ba 401 và người dùng bị đưa về trang đăng nhập',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: The requests were already in flight when the first 401 arrived; each 401 with code TOKEN_HET_HAN called lamMoiToken(), which returned the same pending promise. One retry each — never a loop. Other 401 codes (wrong password) do not trigger refresh.|||VI: Các request đã bay khi 401 đầu tiên về; mỗi 401 mã TOKEN_HET_HAN gọi lamMoiToken() và nhận cùng một promise đang chờ. Mỗi request thử lại một lần — không bao giờ lặp. Mã 401 khác (sai mật khẩu) không kích hoạt refresh.',
      },
      {
        question: 'The post form disables its button while sending. Without the ref guard, what happened?|||Form đăng bài vô hiệu nút khi đang gửi. Bỏ phép chặn bằng ref thì chuyện gì xảy ra?',
        options: [
          'Double click: 1 post; form.requestSubmit() twice in the same task: 2 posts — both submits ran before React re-rendered the disabled button|||Bấm đúp: 1 bài; form.requestSubmit() hai lần trong cùng một tác vụ: 2 bài — cả hai submit chạy trước khi React render lại nút disabled',
          'Double click: 2 posts; requestSubmit twice: 2 posts|||Bấm đúp: 2 bài; requestSubmit hai lần: 2 bài',
          'Always 1 post: disabled is enough|||Luôn 1 bài: disabled là đủ',
          'Double click: 2 posts; requestSubmit twice: 1 post|||Bấm đúp: 2 bài; requestSubmit hai lần: 1 bài',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Measured both. React 19 commits updates of discrete events (click) before the next click, so the button is already disabled. Two requestSubmit() calls in one task both see disabled = false. A ref changes immediately — keep it, and make the server idempotent.|||VI: Đã đo cả hai. React 19 áp cập nhật của sự kiện rời rạc (click) trước cú click sau, nên nút đã bị vô hiệu. Hai lời gọi requestSubmit() trong một tác vụ đều thấy disabled = false. Ref đổi ngay lập tức — giữ nó, và làm server idempotent.',
      },
      {
        question: 'Access token in memory, refresh token in an httpOnly cookie. A comment is rendered with dangerouslySetInnerHTML and contains <img src=x onerror="…">. What could the injected code do, as measured?|||Access token trong bộ nhớ, refresh token trong cookie httpOnly. Một bình luận được hiện bằng dangerouslySetInnerHTML và chứa <img src=x onerror="…">. Mã chèn làm được gì, theo số đo?',
        options: [
          'Nothing — it cannot read the token or the cookie|||Không gì cả — nó không đọc được token lẫn cookie',
          'Read the refresh token from document.cookie|||Đọc refresh token từ document.cookie',
          'Only show an alert box|||Chỉ hiện được hộp alert',
          'Call /api/auth/refresh — the browser attaches the cookie — and receive a fresh access token, then act as the user while the page is open|||Gọi /api/auth/refresh — trình duyệt tự gắn cookie — và nhận một access token mới, rồi hành động thay người dùng khi trang còn mở',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Measured in Chrome: the console printed "XSS lấy được access token: eyJhbGci…" on each load. httpOnly prevents stealing the 30-day token, not abusing the session. The defence is rendering user content as text ({c.body}), plus sanitising and CSP if HTML is ever required.|||VI: Đo trong Chrome: console in "XSS lấy được access token: eyJhbGci…" mỗi lần tải. httpOnly ngăn lấy cắp token 30 ngày, không ngăn lạm dụng phiên. Phòng thủ là hiện nội dung người dùng dạng chữ ({c.body}), cộng làm sạch và CSP nếu buộc phải có HTML.',
      },
    ],
  },
};
