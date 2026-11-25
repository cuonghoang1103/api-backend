/**
 * 1.5 — Kiểm tra Chương 1 (soạn 24/11/2026, agent fsp). BÀI THÊM (không có trong khung), slug mới fp-1-5-quiz.
 * 10 câu; đáp án dựa trên output chạy thật của bài 1.1–1.4 (PostgreSQL 18.7, create-vite 9.3.4, typescript-eslint 8.74.0, Express 5.3.0).
 * Phân bố đáp án: A2 B3 C3 D2.
 */
export default {
  title: '1.5 — Chapter 1 quiz|||1.5 — Kiểm tra Chương 1',
  slug: 'fp-1-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: tiêu chí chấp nhận vs Definition of Done, MoSCoW, đường không vui, khoá ghép của bảng thích, UUIDv7, lưu khoá ảnh, lỗi ERESOLVE, biến VITE_, npm run dev --workspaces, EADDRINUSE mà không ai LISTEN.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations taken from what actually happened while building ChiaSe's Chapter 1. Read every explanation, including for the questions you got right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write acceptance criteria as HTTP requests and status codes, including unhappy paths.</li>
<li>I can explain each constraint in the SQL draft and which test proves it.</li>
<li>I know what a peer-dependency conflict means and why --force is the wrong reflex.</li>
<li>I know which environment variables are public in a Vite app.</li>
<li>My Checkpoint 1 passes on a clean clone.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ chính những gì đã xảy ra khi dựng Chương 1 của ChiaSe. Đọc mọi phần giải thích, kể cả câu bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được tiêu chí chấp nhận dưới dạng request HTTP và mã trạng thái, có cả đường không vui.</li>
<li>Tôi giải thích được từng ràng buộc trong SQL nháp và phép thử nào chứng minh nó.</li>
<li>Tôi biết xung đột peer dependency nghĩa là gì và vì sao --force là phản xạ sai.</li>
<li>Tôi biết biến môi trường nào là công khai trong ứng dụng Vite.</li>
<li>Checkpoint 1 của tôi đạt trên bản clone sạch.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Which line is an acceptance criterion for story U4 ("author edits/deletes own posts"), rather than part of the Definition of Done?|||Dòng nào là tiêu chí chấp nhận của story U4 ("tác giả sửa/xoá bài của mình"), chứ không phải một mục của Definition of Done?',
        options: [
          'Another user sending PATCH /api/posts/:id gets 403 and the post is unchanged|||Người khác gửi PATCH /api/posts/:id nhận 403 và bài không đổi',
          'npm run check passes with no errors|||npm run check đạt, không lỗi',
          'The feature runs with docker compose up on a clean machine|||Tính năng chạy được bằng docker compose up trên máy sạch',
          'The change is committed and CI is green|||Thay đổi đã commit và CI xanh',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Acceptance criteria are specific to one story (this PATCH, this 403). The other three apply to every story — that is the Definition of Done.|||VI: Tiêu chí chấp nhận riêng cho một story (PATCH này, 403 này). Ba lựa chọn còn lại áp cho mọi story — đó là Definition of Done.',
      },
      {
        question: 'Under MoSCoW, where does "private messages between users" belong for ChiaSe v1, and why write it down at all?|||Theo MoSCoW, "nhắn tin riêng giữa người dùng" thuộc nhóm nào ở ChiaSe v1, và sao phải ghi nó ra?',
        options: [
          'Must — every social app has it|||Must — mạng xã hội nào cũng có',
          'Won\'t (this time) — written so nobody re-argues it mid-project|||Won\'t (lần này) — ghi ra để giữa dự án không ai cãi lại',
          'Should — it is important but can wait a week|||Should — quan trọng nhưng chờ được một tuần',
          'It should not be written anywhere until it is needed|||Không nên ghi ở đâu cho tới khi cần',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Messaging brings new privacy rules and flows; it was cut on purpose. Writing Won\'t items protects scope — an unwritten cut gets reopened every week.|||VI: Nhắn tin kéo theo luật riêng tư và luồng mới; nó bị cắt có chủ ý. Ghi rõ mục Won\'t để bảo vệ phạm vi — cắt mà không ghi thì tuần nào cũng bị mở lại.',
      },
      {
        question: 'In the SQL draft, a second INSERT of the same (user_id, post_id) into likes failed with "duplicate key value violates unique constraint likes_pkey". What does this prove?|||Trong SQL nháp, lần INSERT thứ hai cùng (user_id, post_id) vào likes bị lỗi "duplicate key value violates unique constraint likes_pkey". Điều đó chứng minh gì?',
        options: [
          'The test script has a bug|||Script thử bị lỗi',
          'Likes need their own id column|||Bảng likes cần cột id riêng',
          'The database itself guarantees one like per person per post, even if two requests race|||Chính CSDL đảm bảo mỗi người thích một bài một lần, kể cả khi hai request tranh nhau',
          'PostgreSQL does not support many-to-many relations|||PostgreSQL không hỗ trợ quan hệ nhiều-nhiều',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The composite primary key (user_id, post_id) is the rule. A test that must be refused and is refused proves the constraint exists. An extra id column without a unique pair would allow duplicates.|||VI: Khoá chính ghép (user_id, post_id) chính là luật. Phép thử phải bị từ chối và đã bị từ chối chứng minh ràng buộc tồn tại. Thêm cột id riêng mà không có cặp duy nhất thì sẽ cho phép trùng.',
      },
      {
        question: 'ChiaSe uses UUIDv7 primary keys. Which statement is TRUE?|||ChiaSe dùng khoá chính UUIDv7. Câu nào ĐÚNG?',
        options: [
          'UUIDv7 makes permission checks unnecessary because ids cannot be guessed|||UUIDv7 làm việc kiểm quyền không còn cần vì ID không đoán được',
          'UUIDv7 is fully random, like UUIDv4|||UUIDv7 hoàn toàn ngẫu nhiên, giống UUIDv4',
          'UUIDv7 hides when a row was created|||UUIDv7 giấu thời điểm dòng được tạo',
          'uuid_extract_timestamp(id) returned the creation time, so UUIDv7 reveals when a row was created|||uuid_extract_timestamp(id) trả ra thời điểm tạo, nên UUIDv7 để lộ lúc dòng được tạo',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: UUIDv7 starts with a millisecond timestamp (we printed it), then random bits — unguessable but time-revealing. It stops Parler-style enumeration, but never replaces checking who may see a row.|||VI: UUIDv7 bắt đầu bằng mốc thời gian mili giây (ta đã in ra), sau đó là bit ngẫu nhiên — không đoán được nhưng lộ thời điểm. Nó chặn kiểu dò ID của Parler, nhưng không bao giờ thay việc kiểm ai được xem dòng đó.',
      },
      {
        question: 'Why does the posts table store image_key (e.g. posts/2026/11/x.webp) instead of the full image URL?|||Vì sao bảng posts lưu image_key (vd posts/2026/11/x.webp) thay vì URL ảnh đầy đủ?',
        options: [
          'Keys are shorter, so queries are much faster|||Khoá ngắn hơn nên truy vấn nhanh hơn hẳn',
          'The storage domain or CDN can change; the key does not, and the URL is built in one function|||Tên miền kho hoặc CDN có thể đổi; khoá thì không, và URL được dựng trong một hàm',
          'PostgreSQL cannot store URLs|||PostgreSQL không lưu được URL',
          'Browsers cannot load images from full URLs|||Trình duyệt không tải được ảnh từ URL đầy đủ',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Moving from MinIO to R2 or adding a CDN would make every stored URL wrong. Storing the key keeps data valid; one function maps key → URL.|||VI: Chuyển từ MinIO sang R2 hay thêm CDN sẽ làm mọi URL đã lưu bị sai. Lưu khoá giữ dữ liệu đúng; một hàm duy nhất chuyển khoá → URL.',
      },
      {
        question: 'npm prints: ERESOLVE … Found: typescript@7.0.2 … peer typescript@">=4.8.4 <6.1.0" from typescript-eslint@8.74.0. What is the right reaction?|||npm in: ERESOLVE … Found: typescript@7.0.2 … peer typescript@">=4.8.4 <6.1.0" from typescript-eslint@8.74.0. Phản ứng đúng là gì?',
        options: [
          'Re-run with --force so the install succeeds|||Chạy lại với --force cho cài được',
          'Delete package-lock.json and try again|||Xoá package-lock.json rồi thử lại',
          'Understand the plugin does not support TS 7: use the template\'s linter (oxlint) or deliberately pin TypeScript 6.0.x and write down why|||Hiểu rằng plugin chưa hỗ trợ TS 7: dùng linter mẫu đã chọn (oxlint) hoặc cố ý ghim TypeScript 6.0.x và ghi lý do',
          'Downgrade Node.js to version 18|||Hạ Node.js xuống bản 18',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: A peer conflict states a real incompatibility. --force installs a combination the plugin authors say is unsupported. Deleting the lockfile does not change the peer range; Node version is unrelated.|||VI: Xung đột peer nói lên một sự không tương thích thật. --force cài một tổ hợp mà tác giả plugin nói là không hỗ trợ. Xoá lockfile không đổi được khoảng peer; phiên bản Node không liên quan.',
      },
      {
        question: 'A teammate adds VITE_JWT_SECRET=… to apps/web/.env.local "so the frontend can sign tokens". What is the problem?|||Một bạn cùng nhóm thêm VITE_JWT_SECRET=… vào apps/web/.env.local "để frontend tự ký token". Vấn đề là gì?',
        options: [
          'None, .env.local is git-ignored so it stays secret|||Không sao, .env.local bị git ignore nên vẫn bí mật',
          'Vite only reads variables named REACT_APP_*|||Vite chỉ đọc biến tên REACT_APP_*',
          'Variables cannot contain underscores|||Tên biến không được chứa dấu gạch dưới',
          'Every VITE_* variable is compiled into the JavaScript sent to browsers — anyone can read the secret in DevTools|||Mọi biến VITE_* bị biên dịch vào JavaScript gửi tới trình duyệt — ai cũng đọc được bí mật trong DevTools',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Being git-ignored keeps it out of the repository, not out of the bundle. Secrets live only on the server (apps/api/.env); the frontend never signs tokens.|||VI: Bị git ignore chỉ giữ nó ngoài repo, không giữ nó ngoài bundle. Bí mật chỉ nằm ở server (apps/api/.env); frontend không bao giờ tự ký token.',
      },
      {
        question: 'You run npm run dev --workspaces. The API starts, but localhost:41811 returns nothing. Why?|||Bạn chạy npm run dev --workspaces. API chạy, nhưng localhost:41811 không trả gì. Vì sao?',
        options: [
          'Workspaces run one after another; the API dev server never exits, so the web workspace never starts|||Các workspace chạy lần lượt; server dev của API không bao giờ kết thúc nên workspace web không bao giờ được chạy',
          'Vite needs root permissions for ports above 40000|||Vite cần quyền root cho cổng trên 40000',
          'The web app must be built before it can run in dev mode|||Ứng dụng web phải build trước mới chạy dev được',
          'npm workspaces do not support Vite|||npm workspaces không hỗ trợ Vite',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: We measured it: web 41811 → 000. Parallel long-running commands need a runner like concurrently.|||VI: Ta đã đo: web 41811 → 000. Các lệnh chạy lâu song song cần một công cụ như concurrently.',
      },
      {
        question: 'The API printed "đang nghe http://localhost:41810" and then the process exited with code 0. With err handled, it shows EADDRINUSE, yet ss -ltnp shows nobody listening on 41810. What was going on?|||API in "đang nghe http://localhost:41810" rồi tiến trình thoát với mã 0. Khi xử lý err, nó báo EADDRINUSE, nhưng ss -ltnp không thấy ai LISTEN ở 41810. Chuyện gì đã xảy ra?',
        options: [
          'tsx is broken and must be reinstalled|||tsx bị hỏng, phải cài lại',
          'An outgoing connection of another program was using 41810 as its temporary (ephemeral) local port; Express 5 passed the listen error to the callback, which the first version ignored|||Một kết nối đi ra của chương trình khác đang dùng 41810 làm cổng cục bộ tạm (ephemeral); Express 5 truyền lỗi listen vào callback, mà bản đầu bỏ qua',
          'Port numbers above 32767 are not allowed on Linux|||Linux không cho phép cổng trên 32767',
          'The .env file was committed to Git|||Tệp .env đã bị commit vào Git',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: ss -tanp showed ESTAB 192.168.0.x:41810 → …:443. Linux hands out ephemeral ports from 32768–60999. Fix: another PORT in .env (41815 passed), and never ignore an error parameter.|||VI: ss -tanp cho thấy ESTAB 192.168.0.x:41810 → …:443. Linux cấp cổng tạm trong khoảng 32768–60999. Cách sửa: đổi PORT trong .env (41815 đã đạt), và đừng bao giờ bỏ qua tham số lỗi.',
      },
      {
        question: 'Your checkpoint passes on your laptop. Which run is the real proof that the project works for others?|||Checkpoint đạt trên laptop của bạn. Lần chạy nào mới là bằng chứng thật rằng dự án chạy được cho người khác?',
        options: [
          'Running it a second time on the same folder|||Chạy lần hai trên cùng thư mục',
          'Running it with --force|||Chạy với --force',
          'A fresh git clone into a new folder, npm ci, then the checkpoint|||git clone mới sang thư mục mới, npm ci, rồi chạy checkpoint',
          'Asking a friend whether the screenshot looks right|||Hỏi bạn xem ảnh chụp màn hình trông có đúng không',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Only a clean clone exposes files that exist only on your machine (ignored, untracked, global installs). It is how CI, teammates and interviewers meet your repo.|||VI: Chỉ bản clone sạch mới lộ ra những tệp chỉ có trên máy bạn (bị ignore, chưa theo dõi, cài toàn cục). Đó là cách CI, đồng đội và nhà tuyển dụng gặp repo của bạn.',
      },
    ],
  },
};
