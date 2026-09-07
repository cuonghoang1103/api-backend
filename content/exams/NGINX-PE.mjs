/**
 * Nginx — Practical Exam (PE): 5 câu thực hành, nộp .zip.
 *
 * Đề tự soạn, bám sát `content/courses/nginx/s00…s11`. Khác đề FE (50 câu trắc
 * nghiệm, đọc terminal), đề này bắt VIẾT hiện vật: một khối server đầu-cuối cho
 * một ứng dụng một trang cộng API, một bản vá cho cấu hình đã cài sẵn sáu lỗi,
 * một lớp TLS gia hạn được, một lớp bộ đệm sống sót khi backend chết, và một
 * lớp cân bằng tải kèm giới hạn với log máy đọc được.
 *
 * ⚠️ MỌI `sampleSolution` VÀ MỌI `expectedOutput` DƯỚI ĐÂY ĐÃ CHẠY THẬT trên
 * **nginx 1.27.5** (`nginx:1.27-alpine`, linux/arm64, Docker Engine 29.5.3),
 * với các upstream giả `app`, `app1`, `app2` (cũng là nginx, trả JSON echo) và
 * một chứng chỉ tự ký cho `shop.example.com`. Cách kiểm lại: dựng lại đúng bộ
 * upstream đó rồi chạy y nguyên các câu lệnh trong từng khối "kết quả mong đợi".
 *
 * ⚠️ `node scripts/exam-check.mjs ./content/exams/NGINX-PE.mjs` KHÔNG CHẠY được
 * lời giải của năm câu này, và điều đó là ĐÚNG chứ không phải một chỗ đề hỏng.
 *
 *   Bộ kiểm chỉ có `node` và `bash`. Nhãn `nginx` KHÔNG nằm trong tập
 *   `KHONG_CHAY_DUOC` của `scripts/exam-check.mjs` (tập đó hiện có `sql`,
 *   `dockerfile`, `yaml`…), nên nếu để mặc thì bộ kiểm sẽ ghi lời giải ra
 *   `answer.cjs`, đưa cho `node`, và nhận `SyntaxError` — một lỗi nói về công
 *   cụ chứ không nói về đề. Ở đây tôi KHÔNG sửa `scripts/exam-check.mjs` (file
 *   dùng chung, và người chủ đã dặn đừng đụng vào), mà khai `khongChayDuoc`
 *   cho từng câu — đúng cơ chế miễn trừ CÓ LÝ DO BẰNG CHỮ mà chính bộ kiểm
 *   dựng sẵn cho tình huống này, và đã dùng ở `DOCKER-PE.mjs` câu 4–5.
 *
 *   Kết quả: `0 lỗi · 0 cảnh báo`, kèm 5 dòng `ℹ` nói rõ vì sao không chạy.
 *
 *   Muốn bộ kiểm tự nhận ra nhãn này về sau thì thêm `'nginx'` vào tập
 *   `KHONG_CHAY_DUOC` — MỘT dòng, và đề này không đổi một ký tự nào.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NGINX-PE.mjs --apply
 */
import { B, c, codeQ } from './_lib/nginx-exam-kit.mjs';

/**
 * Rubric riêng cho từng câu: tổng `maxScore` đúng bằng `points` của câu (2,0),
 * và `weight === maxScore` ở mọi dòng, nên điểm từng tiêu chí cộng lại ra thẳng
 * điểm câu — không phải quy đổi.
 */
const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({
  id,
  criterion: B(en, vi),
  weight: maxScore,
  maxScore,
}));

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b></p>' +
  '<ol>' +
  '<li>Create five folders named <code>Q1 … Q5</code> on your own machine. Each question names the exact files it wants inside its folder and shows a <b>Starter</b> block — copy it in <b>verbatim</b> and write your answer only between the two <code>ĐỀ CHO SẴN</code> markers. The fixture files and the commands in the "expected output" block are part of the grading; changing them is how you fail a question you actually solved.</li>' +
  '<li><b>Only stock Nginx</b> — the official <code>nginx:1.27-alpine</code> image, no third-party modules, no Lua, nothing you have to compile. Every upstream in this exam is a stand-in you can run as another container.</li>' +
  '<li><b>Run everything before you submit.</b> Every question can be checked with the exact commands printed in its "expected output" block: load the config, start the container, <code>curl -I</code> the route, read the error log. A config that has only ever been read is not an answer, and <code>nginx -t</code> passing is not a check — it does not open a document root, follow a <code>try_files</code> chain, or notice that a regex above your block wins.</li>' +
  '<li>Zip the five folders into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Behaviour first — a config that will not load, or a route that answers the wrong status, cannot pass. But this is an Nginx exam, so the <b>shape</b> of the config is graded too: an <code>alias</code> whose location is missing its trailing slash, a child block that silently wipes the inherited header list, a limit placed where its phase never runs, a redirect that swallows the ACME challenge path, or a default server left pointing at your real application all cost marks <em>even when the site responds</em>. If in doubt, ask of every block: which request actually reaches this, and what did declaring this directive here take away from the block around it?</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Tạo năm thư mục tên <code>Q1 … Q5</code> trên máy của bạn. Mỗi câu ghi rõ những file nào phải nằm trong thư mục của nó và có một khối <b>Mã cho sẵn</b> — chép <b>nguyên văn</b> vào rồi chỉ viết lời giải ở vùng giữa hai mốc <code>ĐỀ CHO SẴN</code>. Phần file cho sẵn và các câu lệnh trong khối "kết quả mong đợi" là một phần của việc chấm; sửa chúng là cách trượt một câu mà bạn thật ra đã làm được.</li>' +
  '<li><b>Chỉ dùng Nginx bản gốc</b> — ảnh chính thức <code>nginx:1.27-alpine</code>, không module bên thứ ba, không Lua, không thứ gì phải biên dịch. Mọi upstream trong đề này đều là hàng thế chỗ mà bạn chạy được như một container khác.</li>' +
  '<li><b>Chạy thử mọi thứ trước khi nộp.</b> Mọi câu đều kiểm được bằng đúng những câu lệnh in trong khối "kết quả mong đợi" của nó: nạp cấu hình, khởi chạy container, <code>curl -I</code> vào tuyến, đọc error log. Một cấu hình mới chỉ được ĐỌC thì chưa phải một lời giải, và <code>nginx -t</code> qua được KHÔNG phải một phép kiểm — nó không mở thư mục gốc tài liệu, không đi theo một chuỗi <code>try_files</code>, và không nhận ra rằng một regex nằm trên khối của bạn đang thắng.</li>' +
  '<li>Nén năm thư mục thành <b>một file .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Hành vi trước — một cấu hình không nạp được, hay một tuyến trả sai mã trạng thái, thì không thể qua. Nhưng đây là bài thi Nginx, nên <b>hình dạng</b> của cấu hình cũng bị chấm: một <code>alias</code> mà location thiếu dấu gạch chéo cuối, một khối con âm thầm xoá sạch danh sách header kế thừa, một giới hạn đặt vào chỗ mà pha của nó không bao giờ chạy, một cú chuyển hướng nuốt luôn đường dẫn thử thách ACME, hay một máy chủ mặc định để trỏ vào chính ứng dụng thật của bạn đều bị trừ điểm <em>ngay cả khi trang web vẫn trả lời</em>. Lúc phân vân, hãy hỏi từng khối một: request nào THẬT SỰ tới được chỗ này, và việc khai chỉ thị này ở đây đã lấy mất cái gì của khối bao quanh nó?</p>' +
  '</div>';

/* ─────────────────────────── Câu 1 ─────────────────────────── */

const Q1_STARTER =
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Q1/site/index.html                 -> <h1>SPA</h1>\n' +
  '# Q1/site/assets/app.a1b2c3.css      -> body{}          (tên có băm nội dung)\n' +
  '# Q1/site/.env                       -> SECRET=xyz      (KHÔNG được phục vụ)\n' +
  '# Q1/certbot/.well-known/acme-challenge/testtoken -> TOKEN-OK\n' +
  '#\n' +
  '# Upstream: container tên `app` nghe cổng 8080, trả JSON echo gồm\n' +
  '#   path / host / xff / xfp / xri / proto / conn\n' +
  '# Nó KHÔNG tự cắt tiền tố: /api/users nó thấy nguyên là /api/users.\n' +
  '#\n' +
  '# Trong container: site  gắn ở /srv/site, certbot gắn ở /var/www/certbot\n' +
  '#\n' +
  '# Viết MỘT file: Q1/default.conf (nạp vào /etc/nginx/conf.d/default.conf)\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Kiểm bằng đúng các lệnh trong khối "kết quả mong đợi".\n';

const Q1_SOLUTION =
  '# Q1/default.conf\n' +
  '\n' +
  '# Máy chủ mặc định CÓ CHỦ ĐÍCH: mọi Host lạ (và mọi con quét IP) dừng ở đây,\n' +
  '# chứ không rơi vào khối thật bên dưới.\n' +
  'server {\n' +
  '    listen 80 default_server;\n' +
  '    server_name _;\n' +
  '    return 444;\n' +
  '}\n' +
  '\n' +
  'server {\n' +
  '    listen 80;\n' +
  '    server_name shop.example.com;\n' +
  '\n' +
  '    root /srv/site;\n' +
  '    index index.html;\n' +
  '    client_max_body_size 8m;\n' +
  '\n' +
  '    # ^~ để cú thử thách ACME không bao giờ bị một regex hay một cú lùi SPA\n' +
  '    # nuốt mất. Đây là thứ giữ cho việc gia hạn 90 ngày một lần còn chạy.\n' +
  '    location ^~ /.well-known/acme-challenge/ {\n' +
  '        root /var/www/certbot;\n' +
  '        default_type "text/plain";\n' +
  '        try_files $uri =404;\n' +
  '    }\n' +
  '\n' +
  '    # Tệp ẩn: chặn trước, và 404 chứ không 403 — 403 xác nhận nó có thật.\n' +
  '    location ~ /\\. { return 404; }\n' +
  '\n' +
  '    # Tài nguyên có băm trong tên thì bất biến: chỉ MỘT dòng Cache-Control.\n' +
  '    # Dùng `expires 1y` CỘNG add_header sẽ phát ra HAI dòng Cache-Control,\n' +
  '    # vì chúng tới từ hai module khác nhau và không hợp nhất.\n' +
  '    location ^~ /assets/ {\n' +
  '        add_header Cache-Control "public, max-age=31536000, immutable" always;\n' +
  '        access_log off;\n' +
  '        try_files $uri =404;\n' +
  '    }\n' +
  '\n' +
  '    # API: proxy_pass KHÔNG có phần URI nên /api/users đi lên nguyên vẹn.\n' +
  '    location /api/ {\n' +
  '        proxy_http_version 1.1;\n' +
  '        proxy_set_header Connection        "";\n' +
  '        proxy_set_header Host              $host;\n' +
  '        proxy_set_header X-Real-IP         $remote_addr;\n' +
  '        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;\n' +
  '        proxy_set_header X-Forwarded-Proto $scheme;\n' +
  '        proxy_pass http://app:8080;\n' +
  '    }\n' +
  '\n' +
  '    # SPA: mọi đường dẫn lạ rơi về index.html. index.html CÓ THẬT nên chuỗi\n' +
  '    # này kết thúc được — nếu nó thiếu thì cú lùi quay lại chính khối này và\n' +
  '    # Nginx trả 500 "rewrite or internal redirection cycle".\n' +
  '    location / {\n' +
  '        try_files $uri $uri/ /index.html;\n' +
  '    }\n' +
  '}\n';

const Q1_OUTPUT =
  '$ docker run -d --name edge --network nglab \\\n' +
  '    -v $PWD/default.conf:/etc/nginx/conf.d/default.conf:ro \\\n' +
  '    -v $PWD/site:/srv/site:ro -v $PWD/certbot:/var/www/certbot:ro \\\n' +
  '    nginx:1.27-alpine\n' +
  '$ docker exec edge nginx -t\n' +
  'nginx: configuration file /etc/nginx/nginx.conf test is successful\n' +
  '\n' +
  '# 1. SPA: đường dẫn lạ rơi về index.html\n' +
  '$ curl -s -H \'Host: shop.example.com\' http://edge/deep/route\n' +
  '<h1>SPA</h1>\n' +
  '\n' +
  '# 2. tài nguyên có băm: ĐÚNG MỘT dòng Cache-Control\n' +
  '$ curl -sI -H \'Host: shop.example.com\' http://edge/assets/app.a1b2c3.css | grep -ci cache-control\n' +
  '1\n' +
  '\n' +
  '# 3. thử thách ACME vẫn tới được trên HTTP trần\n' +
  '$ curl -s -H \'Host: shop.example.com\' http://edge/.well-known/acme-challenge/testtoken\n' +
  'TOKEN-OK\n' +
  '\n' +
  '# 4. tệp ẩn không phục vụ, và không xác nhận nó tồn tại\n' +
  '$ curl -s -o /dev/null -w \'%{http_code}\\n\' -H \'Host: shop.example.com\' http://edge/.env\n' +
  '404\n' +
  '\n' +
  '# 5. API giữ nguyên tiền tố và mang đủ bốn header\n' +
  '$ curl -s -H \'Host: shop.example.com\' http://edge/api/users\n' +
  '{"srv":"app","path":"/api/users","host":"shop.example.com","xff":"172.19.0.3",\n' +
  ' "xfp":"http","xri":"172.19.0.3","proto":"HTTP/1.1","conn":""}\n' +
  '\n' +
  '# 6. Host lạ dừng ở máy chủ mặc định. return 444 đóng kết nối không trả\n' +
  '#    response nào, nên curl thoát 52 và %{http_code} in ra 000.\n' +
  '$ curl -s -o /dev/null -w \'%{http_code}\\n\' -H \'Host: nope.test\' http://edge/\n' +
  '000\n';

/* ─────────────────────────── Câu 2 ─────────────────────────── */

const Q2_STARTER =
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Cấu hình HỎNG dưới đây `nginx -t` QUA SẠCH và container lên bình thường.\n' +
  '# Nó vẫn có SÁU lỗi. Tìm hết, rồi viết lại cả file cho đúng.\n' +
  '#\n' +
  '#   server {\n' +
  '#       listen 443 ssl http2;\n' +
  '#       server_name shop.example.com;\n' +
  '#       ssl_certificate     /etc/nginx/tls/fullchain.pem;\n' +
  '#       ssl_certificate_key /etc/nginx/tls/privkey.pem;\n' +
  '#\n' +
  '#       add_header X-Frame-Options        "DENY"        always;\n' +
  '#       add_header X-Content-Type-Options "nosniff"     always;\n' +
  '#       proxy_set_header Host              $host;\n' +
  '#       proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;\n' +
  '#       proxy_set_header X-Forwarded-Proto $scheme;\n' +
  '#\n' +
  '#       location /files { alias /srv/site/assets/; }\n' +
  '#\n' +
  '#       location /login {\n' +
  '#           limit_req zone=login burst=2 nodelay;\n' +
  '#           return 200 "login\\n";\n' +
  '#       }\n' +
  '#\n' +
  '#       location /api/ {\n' +
  '#           proxy_set_header X-Trace-Id $request_id;\n' +
  '#           proxy_pass http://app:8080/;\n' +
  '#       }\n' +
  '#\n' +
  '#       location /health { add_header X-Probe "ok" always; return 200 "ok\\n"; }\n' +
  '#   }\n' +
  '#\n' +
  '# Cho sẵn ở mức http: limit_req_zone $binary_remote_addr zone=login:10m rate=1r/m;\n' +
  '# Ứng dụng `app` mong nhận NGUYÊN tiền tố /api (nó tự định tuyến /api/...).\n' +
  '# /srv/site/.env chứa SECRET=xyz và nằm NGOÀI /srv/site/assets/.\n' +
  '#\n' +
  '# Viết MỘT file: Q2/default.conf — bản đã sửa, kèm chú thích nói rõ mỗi lỗi.\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Kiểm bằng đúng các lệnh trong khối "kết quả mong đợi".\n';

const Q2_SOLUTION =
  '# Q2/default.conf — bản đã sửa. Sáu lỗi, sáu chỗ chữa.\n' +
  '\n' +
  'server {\n' +
  '    # LỖI 1: `listen ... http2` đã lỗi thời từ 1.25.1 và nó gắn HTTP/2 vào cả\n' +
  '    # SOCKET NGHE, tức là bật luôn cho mọi server block khác trên cổng này.\n' +
  '    # Chỉ thị `http2` mới thì áp theo TỪNG server.\n' +
  '    listen 443 ssl;\n' +
  '    http2 on;\n' +
  '    server_name shop.example.com;\n' +
  '\n' +
  '    ssl_certificate     /etc/nginx/tls/fullchain.pem;\n' +
  '    ssl_certificate_key /etc/nginx/tls/privkey.pem;\n' +
  '    ssl_protocols TLSv1.2 TLSv1.3;\n' +
  '\n' +
  '    add_header X-Frame-Options        "DENY"    always;\n' +
  '    add_header X-Content-Type-Options "nosniff" always;\n' +
  '\n' +
  '    proxy_set_header Host              $host;\n' +
  '    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;\n' +
  '    proxy_set_header X-Forwarded-Proto $scheme;\n' +
  '\n' +
  '    # LỖI 2: `location /files` thiếu dấu gạch chéo cuối trong khi alias CÓ.\n' +
  '    # /files../.env khớp tiền tố, alias thay đúng sáu ký tự "/files", và\n' +
  '    # /srv/site/assets/../.env đọc được — rò rỉ thẳng tệp bí mật.\n' +
  '    location /files/ { alias /srv/site/assets/; }\n' +
  '\n' +
  '    # LỖI 3: `return` thuộc module rewrite, chạy ở pha TRƯỚC pha preaccess\n' +
  '    # nơi limit_req sống, nên bộ giới hạn KHÔNG BAO GIỜ được hỏi tới. Đổi\n' +
  '    # content handler sang thứ chạy ở pha content thì giới hạn mới có hiệu lực.\n' +
  '    # Thêm 429 để một giới hạn đang chạy tốt không trông giống một sự cố 503.\n' +
  '    location /login {\n' +
  '        limit_req zone=login burst=2 nodelay;\n' +
  '        limit_req_status 429;\n' +
  '        proxy_set_header Host              $host;\n' +
  '        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;\n' +
  '        proxy_set_header X-Forwarded-Proto $scheme;\n' +
  '        proxy_pass http://app:8080;\n' +
  '    }\n' +
  '\n' +
  '    location /api/ {\n' +
  '        # LỖI 4: một dòng proxy_set_header ở đây XOÁ SẠCH ba dòng kế thừa —\n' +
  '        # Host quay về $proxy_host, và cả hai header forwarded biến mất.\n' +
  '        # Phải khai lại đủ trong chính khối này.\n' +
  '        proxy_set_header Host              $host;\n' +
  '        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;\n' +
  '        proxy_set_header X-Forwarded-Proto $scheme;\n' +
  '        proxy_set_header X-Trace-Id        $request_id;\n' +
  '        # LỖI 5: dấu gạch chéo cuối trên proxy_pass THAY THẾ tiền tố đã khớp,\n' +
  '        # nên app nhận /users chứ không phải /api/users và trả 404. Bỏ nó đi.\n' +
  '        proxy_pass http://app:8080;\n' +
  '    }\n' +
  '\n' +
  '    # LỖI 6: add_header trong khối con VỨT cả danh sách kế thừa, nên /health\n' +
  '    # đi ra không có X-Frame-Options lẫn X-Content-Type-Options. Khai lại đủ.\n' +
  '    location /health {\n' +
  '        add_header X-Frame-Options        "DENY"    always;\n' +
  '        add_header X-Content-Type-Options "nosniff" always;\n' +
  '        add_header X-Probe                "ok"      always;\n' +
  '        return 200 "ok\\n";\n' +
  '    }\n' +
  '}\n';

const Q2_OUTPUT =
  '# ── BẢN HỎNG, chạy thật để lấy BẰNG CHỨNG sáu lỗi là có thật ───────────\n' +
  '$ docker exec edge2b nginx -t 2>&1 | grep -i deprecated | tail -1\n' +
  'nginx: [warn] the "listen ... http2" directive is deprecated, use the "http2"\n' +
  '       directive instead in /etc/nginx/conf.d/default.conf:2\n' +
  '$ curl -sk --path-as-is https://shop.example.com/files../.env\n' +
  'SECRET=xyz\n' +
  '$ for i in 1 2 3 4; do curl -sk -o /dev/null -w \'%{http_code} \' https://shop.example.com/login; done\n' +
  '200 200 200 200\n' +
  '$ curl -sk https://shop.example.com/api/users\n' +
  '{"srv":"app","path":"/users","host":"app:8080","xff":"","xfp":"", ...}\n' +
  '$ curl -skI https://shop.example.com/health | grep -i \'^x-\'\n' +
  'x-probe: ok\n' +
  '\n' +
  '# ── BẢN ĐÃ SỬA (upstream `app`, chứng chỉ ở /etc/nginx/tls/) ───────────\n' +
  '$ docker exec edge2 nginx -t 2>&1 | tail -1\n' +
  'nginx: configuration file /etc/nginx/nginx.conf test is successful\n' +
  '\n' +
  '# LỖI 1 — không còn dòng cảnh báo lỗi thời nào\n' +
  '$ docker exec edge2 nginx -t 2>&1 | grep -c deprecated\n' +
  '0\n' +
  '\n' +
  '# LỖI 2 — lỗ đi ngược thư mục đã bịt, mà /files/ vẫn phục vụ bình thường\n' +
  '$ curl -sk --path-as-is -o /dev/null -w \'%{http_code}\\n\' https://shop.example.com/files../.env\n' +
  '404\n' +
  '$ curl -sk https://shop.example.com/files/app.a1b2c3.css\n' +
  'body{}\n' +
  '\n' +
  '# LỖI 3 — giới hạn 1r/m burst=2 nodelay nay CÓ nổ: 1 + burst 2 qua, rồi 429\n' +
  '$ for i in 1 2 3 4; do curl -sk -o /dev/null -w \'%{http_code} \' https://shop.example.com/login; done\n' +
  '200 200 200 429\n' +
  '\n' +
  '# LỖI 4 + LỖI 5 — app thấy đủ tiền tố /api và đủ header đã khai lại\n' +
  '$ curl -sk https://shop.example.com/api/users\n' +
  '{"srv":"app","path":"/api/users","host":"shop.example.com","xff":"172.19.0.3",\n' +
  ' "xfp":"https","xri":"","proto":"HTTP/1.0","conn":"close"}\n' +
  '\n' +
  '# LỖI 6 — /health giữ lại cả hai header bảo mật, cộng header thăm dò\n' +
  '$ curl -skI https://shop.example.com/health | grep -i \'^x-\'\n' +
  'x-frame-options: DENY\n' +
  'x-content-type-options: nosniff\n' +
  'x-probe: ok\n';

/* ─────────────────────────── Câu 3 ─────────────────────────── */

const Q3_STARTER =
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Q3/tls/fullchain.pem  và  Q3/tls/privkey.pem   (gắn vào /etc/nginx/tls/)\n' +
  '# Q3/certbot/.well-known/acme-challenge/testtoken -> TOKEN-OK\n' +
  '#                                                 (gắn vào /var/www/certbot)\n' +
  '# Upstream: container `app` nghe 8080.\n' +
  '#\n' +
  '# Viết MỘT file: Q3/default.conf, cho tên miền shop.example.com, sao cho:\n' +
  '#   a) mọi thứ trên cổng 80 chuyển vĩnh viễn sang HTTPS…\n' +
  '#   b) …TRỪ đường dẫn thử thách ACME, phải phục vụ được trên HTTP TRẦN,\n' +
  '#      nếu không thì 90 ngày nữa việc gia hạn sẽ chết trong im lặng;\n' +
  '#   c) HTTPS chạy HTTP/2 khai theo TỪNG server (không dùng dạng lỗi thời);\n' +
  '#   d) chỉ TLSv1.2 và TLSv1.3;\n' +
  '#   e) có HSTS một năm kèm includeSubDomains, và KHÔNG có preload;\n' +
  '#   f) một khối mặc định cho cả hai cổng, để một Host lạ không bao giờ\n' +
  '#      chạm được vào ứng dụng thật.\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Kiểm bằng đúng các lệnh trong khối "kết quả mong đợi".\n';

const Q3_SOLUTION =
  '# Q3/default.conf\n' +
  '\n' +
  '# (f) Máy chủ mặc định cho CẢ HAI cổng. Không có nó thì khối đầu tiên của\n' +
  '# mỗi cổng lặng lẽ trở thành mặc định, và ứng dụng thật được công bố dưới\n' +
  '# mọi cái tên trỏ về máy này.\n' +
  'server {\n' +
  '    listen 80  default_server;\n' +
  '    listen 443 ssl default_server;\n' +
  '    http2 on;\n' +
  '    server_name _;\n' +
  '    ssl_certificate     /etc/nginx/tls/fullchain.pem;\n' +
  '    ssl_certificate_key /etc/nginx/tls/privkey.pem;\n' +
  '    ssl_protocols TLSv1.2 TLSv1.3;\n' +
  '    return 444;\n' +
  '}\n' +
  '\n' +
  '# (a)+(b) Cổng 80: thử thách ACME TRƯỚC, chuyển hướng SAU.\n' +
  'server {\n' +
  '    listen 80;\n' +
  '    server_name shop.example.com;\n' +
  '\n' +
  '    # ^~ để khối này thắng vòng tiền tố và chặn luôn mọi regex phía dưới.\n' +
  '    location ^~ /.well-known/acme-challenge/ {\n' +
  '        root /var/www/certbot;\n' +
  '        default_type "text/plain";\n' +
  '        try_files $uri =404;\n' +
  '    }\n' +
  '\n' +
  '    # $request_uri giữ nguyên chuỗi truy vấn; dùng $uri là mất nó.\n' +
  '    location / { return 301 https://$host$request_uri; }\n' +
  '}\n' +
  '\n' +
  '# (c)(d)(e) Cổng 443.\n' +
  'server {\n' +
  '    listen 443 ssl;\n' +
  '    http2 on;                       # theo TỪNG server, không phải theo socket\n' +
  '    server_name shop.example.com;\n' +
  '\n' +
  '    ssl_certificate     /etc/nginx/tls/fullchain.pem;\n' +
  '    ssl_certificate_key /etc/nginx/tls/privkey.pem;\n' +
  '    ssl_protocols       TLSv1.2 TLSv1.3;\n' +
  '    ssl_prefer_server_ciphers off;  # TLS 1.3: để client chọn AEAD nó chạy nhanh\n' +
  '    ssl_session_cache   shared:SSL:10m;\n' +
  '    ssl_session_timeout 1d;\n' +
  '    ssl_session_tickets off;\n' +
  '\n' +
  '    # KHÔNG preload: nó gần như không đảo ngược được. always để cả trang lỗi\n' +
  '    # cũng mang HSTS.\n' +
  '    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;\n' +
  '\n' +
  '    location / {\n' +
  '        proxy_http_version 1.1;\n' +
  '        proxy_set_header Connection        "";\n' +
  '        proxy_set_header Host              $host;\n' +
  '        proxy_set_header X-Real-IP         $remote_addr;\n' +
  '        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;\n' +
  '        proxy_set_header X-Forwarded-Proto $scheme;\n' +
  '        proxy_pass http://app:8080;\n' +
  '    }\n' +
  '}\n';

const Q3_OUTPUT =
  '$ docker exec edge3 nginx -t 2>&1 | tail -1\n' +
  'nginx: configuration file /etc/nginx/nginx.conf test is successful\n' +
  '\n' +
  '# (a) chuyển hướng vĩnh viễn, giữ nguyên cả chuỗi truy vấn\n' +
  '$ curl -s -o /dev/null -w \'%{http_code} %{redirect_url}\\n\' \\\n' +
  '    -H \'Host: shop.example.com\' \'http://edge3/x?a=1\'\n' +
  '301 https://shop.example.com/x?a=1\n' +
  '\n' +
  '# (b) thử thách ACME KHÔNG bị chuyển hướng\n' +
  '$ curl -s -H \'Host: shop.example.com\' \\\n' +
  '    http://edge3/.well-known/acme-challenge/testtoken\n' +
  'TOKEN-OK\n' +
  '\n' +
  '# (c)(d) HTTP/2 qua ALPN; TLS 1.2 vẫn được, TLS 1.1 thì không\n' +
  '$ curl -sk --http2 -o /dev/null -w \'%{http_version}\\n\' https://shop.example.com/\n' +
  '2\n' +
  '$ curl -sk --tlsv1.2 --tls-max 1.2 -o /dev/null -w \'%{http_code}\\n\' https://shop.example.com/\n' +
  '200\n' +
  '$ curl -sk --tlsv1.1 --tls-max 1.1 -o /dev/null -w \'%{http_code}\\n\' https://shop.example.com/\n' +
  '000\n' +
  '\n' +
  '# (e) HSTS đúng một năm, có includeSubDomains, KHÔNG preload\n' +
  '$ curl -skI https://shop.example.com/ | grep -i strict\n' +
  'strict-transport-security: max-age=31536000; includeSubDomains\n' +
  '\n' +
  '# ứng dụng nhận đủ header và thấy scheme THẬT là https\n' +
  '$ curl -sk https://shop.example.com/hello\n' +
  '{"srv":"app","path":"/hello","host":"shop.example.com","xff":"172.19.0.3",\n' +
  ' "xfp":"https","xri":"172.19.0.3","proto":"HTTP/1.1","conn":""}\n' +
  '\n' +
  '# (f) Host lạ dừng ở khối mặc định trên CẢ HAI cổng\n' +
  '$ curl -s  -o /dev/null -w \'%{http_code}\\n\' -H \'Host: nope.test\' http://edge3/\n' +
  '000\n' +
  '$ curl -sk -o /dev/null -w \'%{http_code}\\n\' https://nope.test/\n' +
  '000\n';

/* ─────────────────────────── Câu 4 ─────────────────────────── */

const Q4_STARTER =
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Upstream `app` nghe 8080 và có ba tuyến:\n' +
  '#   /public/...  -> 200, KHÔNG có header cache nào\n' +
  '#   /me          -> 200, CÓ header Set-Cookie\n' +
  '#   /down        -> 500\n' +
  '#\n' +
  '# Viết MỘT file: Q4/default.conf, sao cho:\n' +
  '#   a) có một vùng đệm trên đĩa tên `web`, 10m khoá, tối đa 200m dữ liệu,\n' +
  '#      dọn sau 10 phút không ai đụng;\n' +
  '#   b) chỉ 200 và 301 được lưu, 200 giữ 30 giây;\n' +
  '#   c) khoá bộ đệm phải tách được HAI tên miền dùng chung một upstream\n' +
  '#      (mặc định thì KHÔNG tách);\n' +
  '#   d) khi backend chết, khách vẫn nhận được bản cũ thay vì 502, và lượt\n' +
  '#      làm mới chạy NGOÀI đường đi của request;\n' +
  '#   e) hai mươi request cùng trượt một khoá thì chỉ MỘT đi lên upstream;\n' +
  '#   f) mọi response mang header X-Cache cho biết trạng thái;\n' +
  '#   g) request có cookie phiên (biến $http_cookie chứa `sid=`) thì BỎ QUA\n' +
  '#      bộ đệm — và tuyến /me không bao giờ được lưu.\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Kiểm bằng đúng các lệnh trong khối "kết quả mong đợi".\n';

const Q4_SOLUTION =
  '# Q4/default.conf\n' +
  '\n' +
  '# (a) Vùng đệm. levels tránh nhét hàng trăm nghìn tệp vào một thư mục.\n' +
  'proxy_cache_path /var/cache/nginx/web levels=1:2 keys_zone=web:10m\n' +
  '                 max_size=200m inactive=10m use_temp_path=off;\n' +
  '\n' +
  '# (g) Cờ bỏ qua: khác rỗng và khác "0" thì bỏ qua bộ đệm.\n' +
  'map $http_cookie $skip_cache {\n' +
  '    default        0;\n' +
  '    "~*sid="       1;\n' +
  '}\n' +
  '\n' +
  'server {\n' +
  '    listen 80 default_server;\n' +
  '\n' +
  '    # (f) Biến rỗng thì Nginx BỎ HẲN header, nên map cho nó một cái sàn để\n' +
  '    #     "không đi qua module cache" cũng nhìn thấy được.\n' +
  '    add_header X-Cache $upstream_cache_status always;\n' +
  '\n' +
  '    location / {\n' +
  '        proxy_cache web;\n' +
  '\n' +
  '        # (c) Mặc định là $scheme$proxy_host$request_uri — $proxy_host là\n' +
  '        # UPSTREAM, nên hai tên miền công khai dùng chung MỘT mục. $host mới\n' +
  '        # là thứ tách chúng ra.\n' +
  '        proxy_cache_key $scheme$host$request_uri;\n' +
  '\n' +
  '        # (b)\n' +
  '        proxy_cache_valid 200 30s;\n' +
  '        proxy_cache_valid 301 1h;\n' +
  '\n' +
  '        # (d) Hết hạn KHÔNG đồng nghĩa vô dụng.\n' +
  '        proxy_cache_use_stale error timeout updating\n' +
  '                              http_500 http_502 http_503 http_504;\n' +
  '        proxy_cache_background_update on;\n' +
  '\n' +
  '        # (e) Cơn giẫm đạp lúc bộ đệm nguội.\n' +
  '        proxy_cache_lock on;\n' +
  '        proxy_cache_lock_timeout 5s;\n' +
  '\n' +
  '        # (g) Cùng một cờ cho cả hai: bypass = không ĐỌC, no_cache = không GHI.\n' +
  '        # Thiếu no_cache thì một response riêng tư vẫn bị lưu cho người sau.\n' +
  '        proxy_cache_bypass $skip_cache;\n' +
  '        proxy_no_cache     $skip_cache;\n' +
  '\n' +
  '        proxy_http_version 1.1;\n' +
  '        proxy_set_header Connection        "";\n' +
  '        proxy_set_header Host              $host;\n' +
  '        proxy_set_header X-Real-IP         $remote_addr;\n' +
  '        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;\n' +
  '        proxy_set_header X-Forwarded-Proto $scheme;\n' +
  '        proxy_pass http://app:8080;\n' +
  '    }\n' +
  '}\n';

const Q4_OUTPUT =
  '$ docker exec edge4 nginx -t 2>&1 | tail -1\n' +
  'nginx: configuration file /etc/nginx/nginx.conf test is successful\n' +
  '\n' +
  '# (b)(f) trượt rồi trúng\n' +
  '$ curl -sI http://edge4/public/a | grep -i x-cache   # lần 1\n' +
  'X-Cache: MISS\n' +
  '$ curl -sI http://edge4/public/a | grep -i x-cache   # lần 2\n' +
  'X-Cache: HIT\n' +
  '\n' +
  '# (c) cùng một đường dẫn, hai Host khác nhau -> HAI mục, cả hai đều MISS\n' +
  '$ curl -sI -H \'Host: a.example.com\' http://edge4/public/b | grep -i x-cache\n' +
  'X-Cache: MISS\n' +
  '$ curl -sI -H \'Host: b.example.com\' http://edge4/public/b | grep -i x-cache\n' +
  'X-Cache: MISS\n' +
  '\n' +
  '# (g) cookie phiên: BỎ QUA lúc đọc, và KHÔNG ghi — lần sau vẫn còn là MISS\n' +
  '$ curl -sI -H \'Cookie: sid=abc\' http://edge4/public/c | grep -i x-cache\n' +
  'X-Cache: BYPASS\n' +
  '$ curl -sI http://edge4/public/c | grep -i x-cache\n' +
  'X-Cache: MISS\n' +
  '\n' +
  '# (g) upstream trả Set-Cookie -> không bao giờ được lưu, MISS mãi mãi\n' +
  '$ curl -sI http://edge4/me | grep -i x-cache\n' +
  'X-Cache: MISS\n' +
  '$ curl -sI http://edge4/me | grep -i x-cache\n' +
  'X-Cache: MISS\n' +
  '\n' +
  '# (d) chờ quá 30s cho mục hết hạn, DỪNG backend, rồi gọi lại\n' +
  '$ sleep 32 && docker stop app\n' +
  '$ curl -sI http://edge4/public/a | grep -i x-cache\n' +
  'X-Cache: STALE\n' +
  '$ curl -sI http://edge4/public/a | grep -i x-cache\n' +
  'X-Cache: UPDATING\n' +
  '$ curl -s -o /dev/null -w \'status=%{http_code}\\n\' http://edge4/public/a\n' +
  'status=200\n' +
  '$ docker start app && sleep 3\n' +
  '$ curl -sI http://edge4/public/a | grep -i x-cache\n' +
  'X-Cache: HIT\n';

/* ─────────────────────────── Câu 5 ─────────────────────────── */

const Q5_STARTER =
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Hai upstream `app1` và `app2`, cùng nghe 8080, mỗi cái trả JSON có\n' +
  '# trường "srv" bằng tên của chính nó. Cả hai đều có tuyến /down trả 500.\n' +
  '#\n' +
  '# Viết MỘT file: Q5/default.conf, sao cho:\n' +
  '#   a) một nhóm upstream cân bằng theo least_conn, app2 nặng gấp đôi,\n' +
  '#      và tái dùng kết nối lên upstream THẬT SỰ có hiệu lực;\n' +
  '#   b) một máy hỏng bị rút khỏi vòng quay sau 2 lần trượt trong 15 giây;\n' +
  '#   c) /api/ có giới hạn 5r/s, cho phép một cụm 10 request tức thì, và\n' +
  '#      trả 429 chứ không phải 503 khi vượt;\n' +
  '#   d) tối đa 20 kết nối đồng thời cho mỗi địa chỉ client;\n' +
  '#   e) access log dạng JSON MÁY ĐỌC ĐƯỢC, có $upstream_addr,\n' +
  '#      $upstream_response_time, $request_time; và KHÔNG ghi log các\n' +
  '#      response 2xx/3xx của /healthz;\n' +
  '#   f) /nginx_status bật stub_status, chỉ cho mạng nội bộ 172.16.0.0/12\n' +
  '#      và 127.0.0.1, chặn mọi nơi khác.\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Kiểm bằng đúng các lệnh trong khối "kết quả mong đợi".\n';

const Q5_SOLUTION =
  '# Q5/default.conf\n' +
  '\n' +
  '# (a) least_conn + trọng số. `keepalive` PHẢI đi kèm hai dòng ở location,\n' +
  '# nếu không Nginx nói HTTP/1.0 và gửi Connection: close, và cái hồ này\n' +
  '# không bao giờ được dùng tới.\n' +
  'upstream backend {\n' +
  '    least_conn;\n' +
  '    zone backend 64k;          # trạng thái dùng chung giữa các worker\n' +
  '    # (b) 2 lần trượt trong 15 giây thì rút khỏi vòng quay 15 giây.\n' +
  '    server app1:8080 max_fails=2 fail_timeout=15s;\n' +
  '    server app2:8080 max_fails=2 fail_timeout=15s weight=2;\n' +
  '    keepalive 32;\n' +
  '}\n' +
  '\n' +
  '# (c)(d)\n' +
  'limit_req_zone  $binary_remote_addr zone=api:10m rate=5r/s;\n' +
  'limit_conn_zone $binary_remote_addr zone=perip:10m;\n' +
  '\n' +
  '# (e) escape=json là bắt buộc: kiểu escape mặc định phát ra \\xNN, thứ JSON\n' +
  '# không định nghĩa, nên một user agent có dấu nháy làm hỏng cả dòng.\n' +
  '# $upstream_response_time để trong nháy vì nó RỖNG khi không có upstream.\n' +
  'log_format jsonlog escape=json\n' +
  '    \'{"t":"$time_iso8601","ip":"$remote_addr","host":"$host",\'\n' +
  '    \'"req":"$request","status":$status,"bytes":$body_bytes_sent,\'\n' +
  '    \'"rt":$request_time,"uaddr":"$upstream_addr",\'\n' +
  '    \'"urt":"$upstream_response_time","ua":"$http_user_agent"}\';\n' +
  '\n' +
  '# (e) if= BỎ QUA dòng log khi biến bằng 0 hoặc rỗng.\n' +
  'map $status $loggable { ~^[23]  0; default 1; }\n' +
  '\n' +
  'server {\n' +
  '    listen 80 default_server;\n' +
  '    access_log /dev/stdout jsonlog;\n' +
  '\n' +
  '    location = /healthz {\n' +
  '        access_log /dev/stdout jsonlog if=$loggable;\n' +
  '        return 200 "ok\\n";\n' +
  '    }\n' +
  '\n' +
  '    # (f) stub_status. deny all phải nằm SAU các dòng allow.\n' +
  '    location = /nginx_status {\n' +
  '        stub_status;\n' +
  '        access_log off;\n' +
  '        allow 127.0.0.1;\n' +
  '        allow 172.16.0.0/12;\n' +
  '        deny  all;\n' +
  '    }\n' +
  '\n' +
  '    location /api/ {\n' +
  '        # (c) burst=10 nodelay: một cụm 10 request được phục vụ NGAY, rồi mới\n' +
  '        # từ chối — đúng hình dạng cho một trình duyệt bắn song song.\n' +
  '        limit_req  zone=api burst=10 nodelay;\n' +
  '        limit_req_status 429;\n' +
  '        # (d)\n' +
  '        limit_conn perip 20;\n' +
  '        limit_conn_status 429;\n' +
  '\n' +
  '        # (a) hai dòng làm cho `keepalive 32` ở trên có tác dụng.\n' +
  '        proxy_http_version 1.1;\n' +
  '        proxy_set_header Connection        "";\n' +
  '        proxy_set_header Host              $host;\n' +
  '        proxy_set_header X-Real-IP         $remote_addr;\n' +
  '        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;\n' +
  '        proxy_set_header X-Forwarded-Proto $scheme;\n' +
  '        proxy_pass http://backend;\n' +
  '    }\n' +
  '}\n';

const Q5_OUTPUT =
  '$ docker exec edge5 nginx -t 2>&1 | tail -1\n' +
  'nginx: configuration file /etc/nginx/nginx.conf test is successful\n' +
  '\n' +
  '# (a) trọng số 1:2 — chín request chia 6 cho app2, 3 cho app1\n' +
  '$ for i in $(seq 1 9); do curl -s http://edge5/api/x; done   # trích trường "srv"\n' +
  'app2 app1 app2 app2 app1 app2 app2 app1 app2\n' +
  '\n' +
  '# và cái hồ keepalive THẬT SỰ được dùng: backend thấy HTTP/1.1, Connection rỗng\n' +
  '$ curl -s http://edge5/api/x\n' +
  '{"srv":"app2","path":"/api/x","host":"edge5","xff":"172.19.0.3","xfp":"http",\n' +
  ' "xri":"172.19.0.3","proto":"HTTP/1.1","conn":""}\n' +
  '\n' +
  '# (c) 5r/s burst=10 nodelay: 1 + 10 cái đầu qua ngay, phần còn lại 429\n' +
  '$ for i in $(seq 1 14); do curl -s -o /dev/null -w \'%{http_code} \' http://edge5/api/x; done\n' +
  '200 200 200 200 200 200 200 200 200 200 200 429 429 429\n' +
  '\n' +
  '# (e) /healthz trả 200 nên KHÔNG có dòng log nào\n' +
  '$ curl -s http://edge5/healthz >/dev/null; docker logs edge5 2>&1 | grep -c healthz\n' +
  '0\n' +
  '\n' +
  '# (e) và dòng log của /api/ là JSON hợp lệ mà python phân tích được\n' +
  '$ docker logs edge5 2>&1 | grep api/ok | tail -1\n' +
  '{"t":"2026-09-07T21:44:24+00:00","ip":"172.19.0.3","host":"edge5",\n' +
  ' "req":"GET /api/ok HTTP/1.1","status":200,"bytes":137,"rt":0.000,\n' +
  ' "uaddr":"172.19.0.23:8080","urt":"0.000","ua":"curl/8.12.1"}\n' +
  '\n' +
  '# (f) stub_status mở từ 172.19.x và ĐÓNG với 10.99.x\n' +
  '$ curl -s http://edge5/nginx_status\n' +
  'Active connections: 1\n' +
  'server accepts handled requests\n' +
  ' 29 29 29\n' +
  'Reading: 0 Writing: 1 Waiting: 0\n' +
  '$ curl -s -o /dev/null -w \'%{http_code}\\n\' http://10.99.0.2/nginx_status\n' +
  '403\n';

export default {
  course: { slug: 'nginx' },
  exams: [
    {
      kind: 'PE',
      // BẮT BUỘC: thiếu nó thì seeder ghi peType = null, và examBadgeLabel()
      // trong ExamPortalClient.tsx trả `PE·${e.peType}` ⇒ nhãn hiện "PE·null".
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Practical Exam — five Nginx configurations you have to run',
        'Thi thực hành — năm cấu hình Nginx bạn buộc phải chạy thật',
      ),
      description: B(
        'Five practical questions submitted as one .zip: an end-to-end edge for a single-page app plus an API, a repair of a configuration that passes nginx -t while carrying six real bugs, a TLS layer whose certificate can still be renewed in ninety days, a cache that keeps the site up while the backend is down, and a load-balancing layer with limits and a machine-readable access log.',
        'Năm câu thực hành nộp trong một file .zip: một lớp biên đầu-cuối cho ứng dụng một trang cộng API, một bản vá cho cấu hình qua được nginx -t mà vẫn mang sáu lỗi thật, một lớp TLS mà chứng chỉ chín mươi ngày nữa vẫn gia hạn được, một bộ đệm giữ cho trang web đứng vững trong lúc backend đã ngã, và một lớp cân bằng tải kèm giới hạn với access log máy đọc được.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        codeQ({
          points: 2,
          language: 'nginx',
          prompt: B(
            'Write the edge configuration for <code>shop.example.com</code>: a single-page app served from disk, hash-named build assets cached for a year with exactly ONE ' + c('Cache-Control') + ' line, an API proxied to <code>app:8080</code> keeping its <code>/api</code> prefix and carrying the client\'s real address, protocol and host, the ACME challenge path reachable over plain HTTP, dotfiles unreadable and not even confirmed to exist, and a deliberate default server so an unknown Host never touches the application.',
            'Viết cấu hình lớp biên cho <code>shop.example.com</code>: một ứng dụng một trang phục vụ từ đĩa, tài nguyên dựng có băm trong tên được cache một năm với ĐÚNG MỘT dòng ' + c('Cache-Control') + ', một API proxy tới <code>app:8080</code> giữ nguyên tiền tố <code>/api</code> và mang theo địa chỉ thật, giao thức thật và host thật của client, đường dẫn thử thách ACME với tới được qua HTTP trần, tệp ẩn không đọc được và thậm chí không được xác nhận là có tồn tại, và một máy chủ mặc định CÓ CHỦ ĐÍCH để một Host lạ không bao giờ chạm tới ứng dụng.',
          ),
          starterCode: Q1_STARTER,
          sampleSolution: Q1_SOLUTION,
          expectedOutput: Q1_OUTPUT,
          rubric: rubric([
            ['routing', 'The four routes land in the right blocks: the ACME path wins its prefix round with <code>^~</code> and is not swallowed by the SPA fallback, the assets block matches before the catch-all, and the SPA <code>try_files</code> chain terminates instead of looping into a 500.', 'Bốn tuyến rơi vào đúng khối: đường dẫn ACME thắng vòng tiền tố nhờ <code>^~</code> và không bị cú lùi SPA nuốt mất, khối tài nguyên khớp trước khối vơ-đũa, và chuỗi <code>try_files</code> của SPA KẾT THÚC được chứ không lặp thành 500.', 0.5],
            ['proxy', 'The API reaches the application with its prefix intact (no URI part on <code>proxy_pass</code>) and with <code>Host</code>, <code>X-Real-IP</code>, <code>X-Forwarded-For</code> and <code>X-Forwarded-Proto</code> all set in the block that proxies.', 'API tới được ứng dụng với tiền tố còn nguyên (không có phần URI trên <code>proxy_pass</code>) và có đủ <code>Host</code>, <code>X-Real-IP</code>, <code>X-Forwarded-For</code>, <code>X-Forwarded-Proto</code> đặt ngay trong khối có proxy.', 0.5],
            ['caching', 'Hash-named assets carry exactly one <code>Cache-Control</code> with a year and <code>immutable</code> — combining <code>expires</code> with <code>add_header</code> emits two headers from two modules and loses the mark.', 'Tài nguyên có băm mang ĐÚNG MỘT dòng <code>Cache-Control</code> với một năm và <code>immutable</code> — gộp <code>expires</code> với <code>add_header</code> sẽ phát ra hai dòng từ hai module khác nhau và mất điểm dòng này.', 0.5],
            ['exposure', 'Nothing is published that should not be: dotfiles answer 404 rather than 403, and a request with an unknown Host is stopped by a default server that was written on purpose rather than inherited by file position.', 'Không có gì bị công bố ngoài ý muốn: tệp ẩn trả 404 chứ không phải 403, và một request có Host lạ bị chặn bởi một máy chủ mặc định được VIẾT RA CÓ CHỦ ĐÍCH chứ không phải thừa hưởng theo vị trí trong tệp.', 0.5],
          ]),
        }),

        codeQ({
          points: 2,
          language: 'nginx',
          prompt: B(
            'The configuration in the starter block passes <code>nginx -t</code> and the container starts, yet it leaks a secret file, publishes a login endpoint whose rate limit never fires, sends the API a path with its <code>/api</code> prefix stripped off and none of the forwarded headers, and ships one route without its security headers. Find all six defects and rewrite the file correctly, with a comment naming each one.',
            'Cấu hình trong khối mã cho sẵn qua được <code>nginx -t</code> và container lên bình thường, vậy mà nó rò rỉ một tệp bí mật, công bố một endpoint đăng nhập mà giới hạn tần suất không bao giờ nổ, gửi lên API một đường dẫn đã bị cắt mất tiền tố <code>/api</code> và không mang theo header forwarded nào, và để một tuyến đi ra thiếu header bảo mật. Hãy tìm đủ sáu lỗi rồi viết lại cả tệp cho đúng, kèm chú thích gọi tên từng lỗi.',
          ),
          starterCode: Q2_STARTER,
          sampleSolution: Q2_SOLUTION,
          expectedOutput: Q2_OUTPUT,
          rubric: rubric([
            ['traversal', 'The <code>alias</code> traversal is closed by giving the location the trailing slash the alias already has, and the fix is demonstrated against the exact <code>/files../.env</code> request rather than asserted.', 'Lỗ đi ngược thư mục của <code>alias</code> được bịt bằng cách cho location đúng dấu gạch chéo cuối mà alias vốn đã có, và chỗ sửa được CHỨNG MINH bằng đúng request <code>/files../.env</code> chứ không phải chỉ khẳng định suông.', 0.5],
            ['phase', 'The rate limit is moved to a block whose content handler runs in the content phase, so the limiter is actually consulted; a limit sitting above a <code>return</code> scores nothing here.', 'Giới hạn tần suất được chuyển sang một khối có content handler chạy ở PHA CONTENT, để bộ giới hạn thật sự được hỏi tới; một giới hạn nằm trên một dòng <code>return</code> thì không được điểm ở dòng này.', 0.5],
            ['inheritance', 'Both wiped lists are restored in the blocks that wiped them: <code>/api/</code> re-declares the three proxy headers alongside its new one, and <code>/health</code> re-declares both security headers alongside its probe header.', 'Cả hai danh sách bị xoá đều được khôi phục ngay trong khối đã xoá chúng: <code>/api/</code> khai lại ba header proxy bên cạnh cái mới, và <code>/health</code> khai lại cả hai header bảo mật bên cạnh header thăm dò của nó.', 0.5],
            ['proxypath', 'The trailing slash is removed from <code>proxy_pass</code> so the application keeps its <code>/api</code> prefix, and the deprecated <code>listen ... http2</code> is replaced by the per-server <code>http2 on</code> directive.', 'Dấu gạch chéo cuối được bỏ khỏi <code>proxy_pass</code> để ứng dụng giữ được tiền tố <code>/api</code>, và dạng lỗi thời <code>listen ... http2</code> được thay bằng chỉ thị <code>http2 on</code> theo từng server.', 0.5],
          ]),
        }),

        codeQ({
          points: 2,
          language: 'nginx',
          prompt: B(
            'Write the TLS layer for <code>shop.example.com</code>. Everything on port 80 must redirect permanently to HTTPS <em>except</em> the ACME challenge path, which has to stay reachable over plain HTTP or the renewal will die silently in ninety days. HTTPS must run HTTP/2 declared per server rather than with the deprecated listen parameter, allow only TLS 1.2 and 1.3, send a one-year HSTS header with <code>includeSubDomains</code> and without <code>preload</code>, and a default server must cover both ports.',
            'Viết lớp TLS cho <code>shop.example.com</code>. Mọi thứ trên cổng 80 phải chuyển vĩnh viễn sang HTTPS <em>trừ</em> đường dẫn thử thách ACME, thứ buộc phải với tới được qua HTTP trần, nếu không thì chín mươi ngày nữa việc gia hạn sẽ chết trong im lặng. HTTPS phải chạy HTTP/2 khai theo TỪNG server chứ không dùng tham số listen đã lỗi thời, chỉ cho phép TLS 1.2 và 1.3, gửi header HSTS một năm kèm <code>includeSubDomains</code> và KHÔNG có <code>preload</code>, và một máy chủ mặc định phải phủ cả hai cổng.',
          ),
          starterCode: Q3_STARTER,
          sampleSolution: Q3_SOLUTION,
          expectedOutput: Q3_OUTPUT,
          rubric: rubric([
            ['acme', 'The challenge location is declared before the redirect and wins the prefix round (<code>^~</code>), so a real <code>curl</code> to the token path returns the token over plain HTTP instead of a 301.', 'Location thử thách được khai TRƯỚC cú chuyển hướng và thắng vòng tiền tố (<code>^~</code>), nên một lệnh <code>curl</code> thật vào đường dẫn token trả về đúng cái token qua HTTP trần chứ không phải một cú 301.', 0.5],
            ['redirect', 'The redirect is a 301 built from <code>$host</code> and <code>$request_uri</code> so the query string survives, and it lives in its own location rather than as a bare <code>return</code> that would also swallow the challenge.', 'Cú chuyển hướng là 301 dựng từ <code>$host</code> và <code>$request_uri</code> nên chuỗi truy vấn sống sót, và nó nằm trong location riêng chứ không phải một dòng <code>return</code> trơ vốn sẽ nuốt luôn cả cú thử thách.', 0.5],
            ['tls', 'HTTP/2 is enabled with the <code>http2</code> directive, <code>ssl_protocols</code> lists only 1.2 and 1.3, and the certificate and key load cleanly — <code>nginx -t</code> opens them, so a wrong path fails the test outright.', 'HTTP/2 bật bằng chỉ thị <code>http2</code>, <code>ssl_protocols</code> chỉ liệt kê 1.2 và 1.3, và cặp chứng chỉ/khoá nạp được sạch sẽ — <code>nginx -t</code> có MỞ chúng, nên một đường dẫn sai là hỏng phép kiểm ngay.', 0.5],
            ['hsts', 'HSTS is exactly one year with <code>includeSubDomains</code>, carries <code>always</code> so error responses keep it, omits <code>preload</code>, and a default server covers both 80 and 443 so an unknown Host reaches neither.', 'HSTS đúng một năm kèm <code>includeSubDomains</code>, có <code>always</code> để cả response lỗi cũng giữ được nó, KHÔNG có <code>preload</code>, và một máy chủ mặc định phủ cả 80 lẫn 443 để một Host lạ không tới được cái nào.', 0.5],
          ]),
        }),

        codeQ({
          points: 2,
          language: 'nginx',
          prompt: B(
            'Write a caching layer in front of <code>app:8080</code>. It must survive the backend going down by serving the expired copy instead of a 502, refresh it off the request path, collapse a cold-cache stampede into one upstream call, key entries so two hostnames sharing one upstream do not share one entry, expose the cache status on every response, and never store or serve a cached copy to a request that carries a session cookie.',
            'Viết một lớp bộ đệm đặt trước <code>app:8080</code>. Nó phải sống sót khi backend chết bằng cách phục vụ bản đã hết hạn thay vì một cú 502, làm mới bản đó NGOÀI đường đi của request, gom một cơn giẫm đạp lúc bộ đệm nguội thành MỘT lời gọi upstream, đặt khoá sao cho hai tên miền dùng chung một upstream không dùng chung một mục, phơi trạng thái bộ đệm ra ở mọi response, và không bao giờ lưu hay phục vụ bản đã cache cho một request mang cookie phiên.',
          ),
          starterCode: Q4_STARTER,
          sampleSolution: Q4_SOLUTION,
          expectedOutput: Q4_OUTPUT,
          rubric: rubric([
            ['zone', 'A <code>proxy_cache_path</code> declares the zone with a key size, a <code>max_size</code> and an <code>inactive</code> window, and <code>proxy_cache_valid</code> limits storage to the statuses the question named.', 'Một dòng <code>proxy_cache_path</code> khai vùng đệm kèm cỡ khoá, một <code>max_size</code> và một cửa sổ <code>inactive</code>, và <code>proxy_cache_valid</code> giới hạn việc lưu đúng những mã trạng thái mà đề nêu.', 0.5],
            ['key', 'The cache key uses <code>$host</code> rather than the default <code>$proxy_host</code>, and a measured pair of requests with two different Host headers shows two separate entries rather than one shared one.', 'Khoá bộ đệm dùng <code>$host</code> chứ không phải <code>$proxy_host</code> mặc định, và một cặp request đo thật với hai header Host khác nhau cho ra HAI mục riêng chứ không phải một mục dùng chung.', 0.5],
            ['resilience', '<code>proxy_cache_use_stale</code> plus <code>background_update</code> keep the site answering while the backend is stopped, and <code>proxy_cache_lock</code> is present so a cold key does not multiply into parallel upstream calls.', '<code>proxy_cache_use_stale</code> cộng <code>background_update</code> giữ cho trang vẫn trả lời trong lúc backend đã dừng, và có <code>proxy_cache_lock</code> để một khoá nguội không nhân lên thành nhiều lời gọi upstream song song.', 0.5],
            ['privacy', 'A session cookie sets a flag wired to BOTH <code>proxy_cache_bypass</code> and <code>proxy_no_cache</code> — bypass alone still writes the private response into the shared cache — and the status header is visible on every response.', 'Một cookie phiên bật một cờ nối vào CẢ HAI chỉ thị <code>proxy_cache_bypass</code> và <code>proxy_no_cache</code> — chỉ mỗi bypass thì response riêng tư VẪN bị ghi vào bộ đệm dùng chung — và header trạng thái nhìn thấy được ở mọi response.', 0.5],
          ]),
        }),

        codeQ({
          points: 2,
          language: 'nginx',
          prompt: B(
            'Write the load-balancing layer over <code>app1:8080</code> and <code>app2:8080</code>: least-connections with app2 weighted double, upstream keep-alive that actually takes effect, failure detection at two strikes in fifteen seconds, a 5r/s limit on <code>/api/</code> that lets a burst of ten through immediately and answers 429 rather than 503, a per-client connection cap, a JSON access log a machine can parse that skips successful health checks, and <code>stub_status</code> readable only from the internal network.',
            'Viết lớp cân bằng tải trên <code>app1:8080</code> và <code>app2:8080</code>: chọn theo ít-kết-nối-nhất với app2 nặng gấp đôi, keep-alive lên upstream THẬT SỰ có hiệu lực, phát hiện hỏng ở mức hai lần trượt trong mười lăm giây, một giới hạn 5r/s trên <code>/api/</code> cho một cụm mười request qua ngay và trả 429 chứ không phải 503, một trần kết nối cho mỗi client, một access log JSON mà máy phân tích được và bỏ qua các lượt kiểm sức khoẻ thành công, và <code>stub_status</code> chỉ đọc được từ mạng nội bộ.',
          ),
          starterCode: Q5_STARTER,
          sampleSolution: Q5_SOLUTION,
          expectedOutput: Q5_OUTPUT,
          rubric: rubric([
            ['upstream', 'The group uses <code>least_conn</code> with a weight on app2, sets <code>max_fails</code> and <code>fail_timeout</code>, and declares <code>keepalive</code> together with the <code>proxy_http_version 1.1</code> and empty <code>Connection</code> header that make the pool usable at all.', 'Nhóm dùng <code>least_conn</code> với trọng số trên app2, đặt <code>max_fails</code> và <code>fail_timeout</code>, và khai <code>keepalive</code> KÈM theo <code>proxy_http_version 1.1</code> với header <code>Connection</code> rỗng, hai thứ khiến cái hồ đó dùng được.', 0.5],
            ['limits', 'The rate limit uses <code>burst=10 nodelay</code> so a parallel burst is served immediately rather than queued, <code>limit_req_status 429</code> separates a working limit from an outage, and a <code>limit_conn</code> zone caps concurrency per client address.', 'Giới hạn tần suất dùng <code>burst=10 nodelay</code> để một cụm song song được phục vụ NGAY chứ không xếp hàng, <code>limit_req_status 429</code> tách một giới hạn đang chạy tốt khỏi một sự cố, và một zone <code>limit_conn</code> chặn số kết nối đồng thời theo địa chỉ client.', 0.5],
            ['logging', 'The log format carries <code>escape=json</code> and the three upstream and timing variables; <code>$upstream_response_time</code> is quoted because it is empty when there was no upstream, and successful health checks are dropped with an <code>if=</code> condition.', 'Định dạng log có <code>escape=json</code> và đủ ba biến về upstream với thời gian; <code>$upstream_response_time</code> được đặt trong nháy vì nó RỖNG khi không có upstream, và các lượt kiểm sức khoẻ thành công bị bỏ bằng một điều kiện <code>if=</code>.', 0.5],
            ['status', '<code>stub_status</code> is exposed on an exact-match location with <code>allow</code> rules before <code>deny all</code>, and its own logging turned off so a metrics scraper does not become the busiest line in the access log.', '<code>stub_status</code> được phơi ra trên một location khớp CHÍNH XÁC với các dòng <code>allow</code> đặt TRƯỚC <code>deny all</code>, và tắt log của chính nó để một bộ quét chỉ số không trở thành dòng đông nhất trong access log.', 0.5],
          ]),
        }),
      ],
    },
  ],
};
