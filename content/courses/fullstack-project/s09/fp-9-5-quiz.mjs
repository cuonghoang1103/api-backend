/**
 * 9.5 — Kiểm tra Chương 9 (soạn 25/11/2026, phiên Mac tiếp quản agent fsp). BÀI THÊM (không có trong khung), slug mới fp-9-5-quiz.
 * 10 câu; đáp án dựa trên output chạy thật của bài 9.1–9.4 (Docker + compose trên máy nhà, cổng 41830).
 * Phân bố đáp án: A2 B3 C3 D2.
 */
const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

export default {
  title: '9.5 — Chapter 9 quiz|||9.5 — Kiểm tra Chương 9',
  slug: 'fp-9-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống từ chính lúc Docker hoá ChiaSe: ảnh 2,44 GB có .env bên trong, docker stop thoát mã 1, postinstall hỏng ở tầng deps, Prisma Studio lọt vào ảnh production, zod thiếu khi dựng web, tệp thiếu trả 200, WebSocket âm thầm kẹt polling, URL tải ảnh trỏ vào "kho", kẻ dò mật khẩu khoá luôn người khác sau Nginx, và trust proxy dư một lớp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations taken from what actually happened while ChiaSe was containerized. Read every explanation, including for the questions you got right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>From a clean clone I can run the whole app with <code>cp .env.example .env</code> + <code>docker compose up -d --build --wait</code>.</li>
<li>I can show that my API image has no <code>.env</code>, no source, no dev tools, and does not run as root.</li>
<li>I can explain why both <code>npm ci</code> steps are CACHED after a source-only change.</li>
<li>I can prove the login limiter counts the real user behind Nginx, and that a forged header does not help.</li>
<li>My Checkpoint 9 passes 20/20 (21/21 with Checkpoint 8).</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ chính những gì đã xảy ra khi Docker hoá ChiaSe. Đọc mọi phần giải thích, kể cả câu bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Từ một bản clone sạch tôi chạy được cả ứng dụng bằng <code>cp .env.example .env</code> + <code>docker compose up -d --build --wait</code>.</li>
<li>Tôi cho thấy được ảnh API không có <code>.env</code>, không mã nguồn, không công cụ dev, và không chạy bằng root.</li>
<li>Tôi giải thích được vì sao cả hai bước <code>npm ci</code> đều CACHED khi chỉ sửa mã nguồn.</li>
<li>Tôi chứng minh được bộ giới hạn đăng nhập đếm đúng người dùng thật sau Nginx, và header giả không giúp gì.</li>
<li>Checkpoint 9 của tôi đạt 20/20 (21/21 khi gọi cả Checkpoint 8).</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('The tutorial Dockerfile (FROM node:22-slim, COPY . ., RUN npm ci) built fine. Inside the image, apps/api/.env with the real JWT key was present. What is the most robust fix?|||Dockerfile "như tutorial" (FROM node:22-slim, COPY . ., RUN npm ci) dựng ổn. Trong ảnh có apps/api/.env chứa khoá JWT thật. Cách sửa chắc chắn nhất là gì?',
        ['Add RUN rm apps/api/.env at the end of the Dockerfile|||Thêm RUN rm apps/api/.env ở cuối Dockerfile',
         'List **/.env in .dockerignore so it never enters the build context, and give configuration at runtime|||Ghi **/.env vào .dockerignore để nó không bao giờ vào ngữ cảnh dựng, và đưa cấu hình lúc chạy',
         'Make the image private on the registry|||Để ảnh ở chế độ riêng tư trên registry',
         'Pass the key with ARG JWT_ACCESS_SECRET instead|||Truyền khoá bằng ARG JWT_ACCESS_SECRET thay thế'],
        1,
        'EN: rm in a later layer leaves the file in the earlier layer (anyone with the image can extract it); ARG values end up in the image history; "private" only narrows who can pull — Codecov 2021 lost a credential from its image-building process. What is never in the context can never be in an image.|||VI: rm ở tầng sau vẫn để tệp nằm ở tầng trước (ai có ảnh cũng lôi ra được); giá trị ARG nằm lại trong lịch sử ảnh; "riêng tư" chỉ thu hẹp ai kéo được — Codecov 2021 mất thông tin xác thực từ chính quy trình dựng ảnh. Thứ không bao giờ có trong ngữ cảnh thì không bao giờ có trong ảnh.'),
      q('With CMD ["npm", "start", "-w", "apps/api"], docker stop ends with "npm error signal SIGTERM" and ExitCode=1. Why?|||Với CMD ["npm", "start", "-w", "apps/api"], docker stop kết thúc bằng "npm error signal SIGTERM" và ExitCode=1. Vì sao?',
        ['npm is PID 1; it does not hand the shutdown to node cleanly and reports the signal as a failed script|||npm là PID 1; nó không trao việc tắt cho node một cách tử tế và báo tín hiệu thành script thất bại',
         'The API has no SIGTERM handler|||API không có hàm xử lý SIGTERM',
         'docker stop always exits with code 1|||docker stop luôn thoát mã 1',
         'Alpine images cannot receive signals|||Ảnh alpine không nhận được tín hiệu'],
        0,
        'EN: docker top showed three processes: npm, sh, node. The server.ts handler exists (Chapter 7) — with CMD ["node", "apps/api/dist/server.js"] the same image stops in 1.20 s with exit 0 and both shutdown log lines. And it was the slim image, not alpine.|||VI: docker top cho thấy ba tiến trình: npm, sh, node. Hàm xử lý trong server.ts có sẵn (Chương 7) — với CMD ["node", "apps/api/dist/server.js"] cùng ảnh đó tắt trong 1,20 s, mã 0, đủ hai dòng log. Và đó là ảnh slim, không phải alpine.'),
      q('In the deps stage (only package*.json copied), npm ci -w apps/api fails with "Could not find Prisma Schema". What happened?|||Ở tầng deps (mới chép package*.json), npm ci -w apps/api hỏng với "Could not find Prisma Schema". Chuyện gì xảy ra?',
        ['Prisma 7 does not support Docker|||Prisma 7 không hỗ trợ Docker',
         'DATABASE_URL is missing at build time|||Thiếu DATABASE_URL lúc dựng',
         'The postinstall script "prisma generate" ran before the schema was copied; use --ignore-scripts in deps and generate in the build stage|||Script postinstall "prisma generate" chạy trước khi schema được chép; dùng --ignore-scripts ở deps và generate ở tầng build',
         'The lockfile is out of date|||Lockfile đã cũ'],
        2,
        'EN: postinstall is convenient in dev and wrong in a cache-friendly Dockerfile, where the schema arrives one stage later. generate does not need a database (prisma.config.ts does not require DATABASE_URL for it, Chapter 2). argon2 and sharp did not need install scripts either: prebuilt binaries.|||VI: postinstall tiện lúc dev và sai trong một Dockerfile tối ưu cache, nơi schema tới muộn một tầng. generate không cần CSDL (prisma.config.ts không đòi DATABASE_URL cho bước này, Chương 2). argon2 và sharp cũng không cần script cài: có bản nhị phân dựng sẵn.'),
      q('The prod-deps stage uses npm ci --omit=dev, yet the image still contains the Prisma CLI, Prisma Studio and react-dom (864 MB). Why?|||Tầng prod-deps dùng npm ci --omit=dev, vậy mà ảnh vẫn có Prisma CLI, Prisma Studio và react-dom (864 MB). Vì sao?',
        ['--omit=dev is ignored when NODE_ENV is not set|||--omit=dev bị bỏ qua khi chưa đặt NODE_ENV',
         'npm caches devDependencies in /root/.npm|||npm cache devDependencies trong /root/.npm',
         'react-dom is a dependency of the API|||react-dom là dependency của API',
         'prisma is an optional peer of @prisma/client AND a devDependency, so the lockfile marks it devOptional, which --omit=dev keeps|||prisma vừa là peer tuỳ chọn của @prisma/client VỪA là devDependency, nên lockfile ghi devOptional — loại mà --omit=dev giữ lại'],
        3,
        'EN: npm explain prisma showed "peerOptional prisma@* from @prisma/client"; Studio pulled React as a peer. The fix deletes every devOptional package listed in the lockfile — a rule from data, not a hand-made list. Result: 176 MB of runtime dependencies, 0 dev tools.|||VI: npm explain prisma in ra "peerOptional prisma@* from @prisma/client"; Studio kéo React theo dạng peer. Cách sửa xoá mọi gói devOptional mà lockfile liệt kê — luật lấy từ dữ liệu, không phải danh sách viết tay. Kết quả: 176 MB thư viện chạy, 0 công cụ dev.'),
      q('Building the web image with npm ci -w apps/web fails: "../api/src/schemas/error.schema.ts: Cannot find module zod". It always worked on your laptop. Best fix?|||Dựng ảnh web với npm ci -w apps/web thì hỏng: "../api/src/schemas/error.schema.ts: Cannot find module zod". Trên máy bạn lúc nào cũng chạy. Cách sửa tốt nhất?',
        ['Copy the root node_modules into the image|||Chép node_modules ở gốc vào ảnh',
         'Declare zod (same exact version) as a devDependency of the web — it was only working because the API\'s zod was hoisted|||Khai zod (đúng phiên bản) là devDependency của web — trước đây chạy được chỉ nhờ zod của API được kéo lên gốc',
         'Turn off type checking in the Docker build|||Tắt kiểm kiểu trong bản dựng Docker',
         'Install with npm install instead of npm ci|||Cài bằng npm install thay cho npm ci'],
        1,
        'EN: npm ls zod showed it belongs only to api. The web imports the contract with import type, so zod never reaches the browser; tsc still needs its declarations. Docker starts from nothing, which makes it a detector for undeclared dependencies.|||VI: npm ls zod cho thấy nó chỉ thuộc api. Web import hợp đồng bằng import type nên zod không tới trình duyệt; tsc vẫn cần khai báo kiểu của nó. Docker bắt đầu từ số không, nên nó là máy dò phụ thuộc chưa khai.'),
      q('curl -I localhost:41830/khong-co.png returns 200 text/html. You add location ~ \\.[a-zA-Z0-9]+$ { try_files $uri =404; } and now every post image under /chiase/ is 404. Why?|||curl -I localhost:41830/khong-co.png trả 200 text/html. Bạn thêm location ~ \\.[a-zA-Z0-9]+$ { try_files $uri =404; } và giờ mọi ảnh bài viết dưới /chiase/ đều 404. Vì sao?',
        ['A matching regex location beats a plain prefix location; /chiase/ needs ^~|||Khối regex khớp thắng khối tiền tố thường; /chiase/ cần ^~',
         'MinIO refuses requests that come from Nginx|||MinIO từ chối request đến từ Nginx',
         'Nginx cannot proxy files with extensions|||Nginx không chuyển tiếp được tệp có đuôi',
         'try_files must always end with /index.html|||try_files luôn phải kết thúc bằng /index.html'],
        0,
        'EN: Order: exact (=), then longest prefix — if it is ^~ stop — then regex in file order, then the remembered prefix. Images end in .webp, so the regex won. The same rule then broke index.html caching (internal redirect to /index.html), fixed with location = /index.html.|||VI: Thứ tự: khớp chính xác (=), rồi tiền tố dài nhất — nếu có ^~ thì dừng — rồi regex theo thứ tự trong tệp, rồi tới tiền tố đã nhớ. Ảnh có đuôi .webp nên regex thắng. Cũng luật đó sau đó làm index.html mất no-cache (chuyển hướng nội bộ tới /index.html), sửa bằng location = /index.html.'),
      q('Without the two lines proxy_set_header Upgrade/Connection in location /socket.io/, what did the measurement show?|||Thiếu hai dòng proxy_set_header Upgrade/Connection trong location /socket.io/, phép đo cho thấy gì?',
        ['Socket.IO fails with connect_error|||Socket.IO hỏng với connect_error',
         'Nginx returns 426 Upgrade Required|||Nginx trả 426 Upgrade Required',
         'Connected over long-polling and stayed there, with no error at all|||Kết nối bằng long-polling và ở lại đó, không có lỗi nào',
         'The browser falls back to Server-Sent Events|||Trình duyệt tự chuyển sang Server-Sent Events'],
        2,
        'EN: "connect sau 31 ms, kiểu truyền: polling … sau 3 s: polling" versus an upgrade to websocket after 147 ms with the headers. Silent degradation: the app "works", each event costs a request, and multi-instance needs sticky sessions. Measure the transport.|||VI: "connect sau 31 ms, kiểu truyền: polling … sau 3 s: polling" so với nâng cấp lên websocket sau 147 ms khi đủ header. Suy giảm âm thầm: ứng dụng vẫn "chạy", mỗi sự kiện tốn một request, nhiều instance thì cần sticky session. Phải đo kiểu truyền.'),
      q('In compose, POST /api/uploads returns url = http://kho:9000/chiase/tmp/…; the PUT gives "Could not resolve host: kho". What is the correct fix?|||Trong compose, POST /api/uploads trả url = http://kho:9000/chiase/tmp/…; lệnh PUT báo "Could not resolve host: kho". Cách sửa đúng là gì?',
        ['Publish port 9000 of kho and add kho to the hosts file of every user|||Mở cổng 9000 của kho và thêm kho vào tệp hosts của mọi người dùng',
         'Upload through the API instead of presigned URLs|||Tải qua API thay vì URL ký sẵn',
         'Rewrite the host in the URL on the frontend before PUT|||Sửa host trong URL ở frontend trước khi PUT',
         'Sign with a public endpoint (S3_PUBLIC_ENDPOINT=http://localhost:41830) and let Nginx forward /chiase/ to kho with Host $http_host|||Ký bằng địa chỉ công khai (S3_PUBLIC_ENDPOINT=http://localhost:41830) và để Nginx chuyển /chiase/ sang kho với Host $http_host'],
        3,
        'EN: The signature covers the host, so rewriting it on the frontend gives 403 — so did $host (port dropped): SignatureDoesNotMatch. Uploading through the API throws away the design of Chapter 4. Also measured: Nginx\'s default 1 MB body limit returned 413 for a 3.6 MB photo until client_max_body_size 6m.|||VI: Chữ ký bao gồm host, nên sửa host ở frontend sẽ ra 403 — y như $host (mất cổng): SignatureDoesNotMatch. Tải qua API là vứt bỏ thiết kế của Chương 4. Cũng đo được: giới hạn thân 1 MB mặc định của Nginx trả 413 cho ảnh 3,6 MB tới khi đặt client_max_body_size 6m.'),
      q('Behind Nginx with trust proxy off, a bot makes 12 wrong logins from machine A. A real user on machine B logs in correctly for the first time. Result?|||Sau Nginx, trust proxy tắt, một con bot đăng nhập sai 12 lần từ máy A. Người dùng thật ở máy B đăng nhập đúng lần đầu tiên. Kết quả?',
        ['200 — the limiter counts per email|||200 — bộ giới hạn đếm theo email',
         '429 — every request has Nginx\'s IP, so A used up the budget for everyone|||429 — mọi request mang IP của Nginx, nên A đã tiêu hết lượt của tất cả mọi người',
         '401 — B\'s password is checked against A\'s attempts|||401 — mật khẩu của B bị so với các lần thử của A',
         '502 — Nginx blocks B|||502 — Nginx chặn B'],
        1,
        'EN: Measured: "429 QUA_NHIEU_LAN" for B. express-rate-limit had warned ERR_ERL_UNEXPECTED_X_FORWARDED_FOR in the API log. With TRUST_PROXY=1 B got 200 and A stayed limited.|||VI: Đo được: B nhận "429 QUA_NHIEU_LAN". express-rate-limit đã cảnh báo ERR_ERL_UNEXPECTED_X_FORWARDED_FOR trong log API. Với TRUST_PROXY=1, B nhận 200 còn A vẫn bị chặn.'),
      q('There is exactly one proxy (Nginx). Someone sets TRUST_PROXY=2 "to be safe". An attacker sends 200 wrong logins, each with a different fake X-Forwarded-For. What happens?|||Chỉ có đúng một proxy (Nginx). Ai đó đặt TRUST_PROXY=2 "cho chắc". Kẻ tấn công gửi 200 lần đăng nhập sai, mỗi lần một X-Forwarded-For giả khác nhau. Điều gì xảy ra?',
        ['Nginx removes the fake header, so nothing changes|||Nginx gỡ header giả nên không có gì thay đổi',
         'Express refuses to start|||Express từ chối khởi động',
         'All 200 attempts get 401 — never limited — because Express now trusts one client-written entry as the real IP|||Cả 200 lần đều nhận 401 — không bao giờ bị chặn — vì Express giờ tin một mục do người gửi viết là IP thật',
         'The first 10 get 401, the rest 429|||10 lần đầu 401, còn lại 429'],
        2,
        'EN: Measured "200 401". Nginx appends (proxy_add_x_forwarded_for), it does not strip what the client sent. Trust exactly the real number of hops; config.ts rejects "true". (Express refusing to start is what happens with TRUST_PROXY=true in ChiaSe, not with 2.)|||VI: Đo được "200 401". Nginx ghi THÊM (proxy_add_x_forwarded_for), không gỡ phần người gửi tự viết. Tin đúng số lớp thật; config.ts từ chối "true". (Từ chối khởi động là chuyện xảy ra với TRUST_PROXY=true trong ChiaSe, không phải với 2.)'),
    ],
  },
};
