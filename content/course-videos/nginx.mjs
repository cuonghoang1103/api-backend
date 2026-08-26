/**
 * Curated YouTube track for the "Nginx" course.
 * ─────────────────────────────────────────────────────────────────────────────
 * One entry per non-quiz lesson slug → the third-party lecture shown on the YT
 * pill of the learn page, until the Vietnamese/English recordings are made.
 *
 * ⚠️ CREDIT ĐỂ TRỐNG LÀ CỐ Ý — CHƯA XÁC MINH ĐƯỢC TỪ MÁY DỰNG.
 * Mọi id lấy từ kết quả tìm kiếm SỐNG (25/08/2026), kèm tiêu đề mong đợi ghi ở
 * chú thích cuối dòng. Máy dựng khoá bị chặn ra youtube.com nên KHÔNG gọi được
 * oEmbed ⇒ không đọc được tên kênh, không biết video có cho nhúng hay không.
 * verify coi credit rỗng là HỢP LỆ; --fix-credits điền đúng "Kênh — Tiêu đề".
 *
 * CHẠY HAI LỆNH NÀY THEO ĐÚNG THỨ TỰ:
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/nginx.mjs --fix-credits
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/nginx.mjs --apply
 *
 * Lệnh đầu in ra link nào đã chết (✗) — thay link đó rồi chạy lại. Lệnh sau sẽ
 * TỪ CHỐI --apply khi còn credit rỗng. Credit thật lệch hẳn tiêu đề mong đợi ở
 * chú thích cùng dòng ⇒ id trỏ nhầm video, báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'nginx',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Bài toán, và một bản chạy được ── */
    'nginx-0-1-bai-toan': { yt: 'JKxlsvZXG7c', credit: 'Fireship — NGINX Explained in 100 Seconds' },        // NGINX Explained in 100 Seconds
    'nginx-0-2-cai-va-chay': { yt: '9t9Mp0BGnyI', credit: 'freeCodeCamp.org — NGINX Tutorial for Beginners' },     // NGINX Tutorial for Beginners
    'nginx-0-3-cau-hinh-dau-tien': { yt: 'jjZ-0k10B-c', credit: 'Durgadas Kamath — Installation, Virtual Server , Location block basics | Nginx Tutorial #1' },// Installation, Virtual Server, Location block basics | Nginx Tutorial #1

    /* ── Chương 1 — Một request tìm tới khối server nào ── */
    'nginx-1-1-listen': { yt: 'LSSZNER0YOw', credit: 'Low Orbit Flux — NGINX Server Blocks - Virtual Hosts' },           // NGINX Server Blocks - Virtual Hosts
    'nginx-1-2-server-name': { yt: 'uWG8HygJHbw', credit: 'Programmers Lab — How To Set Up Nginx Server Blocks (Virtual Hosts) - Step-by-step' },      // How To Set Up Nginx Server Blocks (Virtual Hosts) - Step-by-step
    'nginx-1-3-may-chu-mac-dinh': { yt: 'o9VU-eCAp1g', credit: 'Roel Van de Paar — nginx ignoring server_name or whole virtual host' }, // nginx ignoring server_name or whole virtual host
    'nginx-1-4-host-la-dau-vao': { yt: 'x9ZF0V8cfn0', credit: 'Audiopedia — X-Forwarded-For' },  // X-Forwarded-For
    'nginx-1-5-bo-cuc-nhieu-site': { yt: 'GCznXfbfMq0', credit: 'Abstract programmer — How to host multiple websites on Nginx' },// How to host multiple websites on Nginx

    /* ── Chương 2 — Khối location nào thắng ── */
    'nginx-2-1-bon-loai-location': { yt: 'tEQToGW2q40', credit: 'dimzrio — Nginx Tutorials #4 - Location Block (Regular Expression)' },             // Nginx Tutorials #4 - Location Block (Regular Expression)
    'nginx-2-2-uri-duoc-chuan-hoa': { yt: '3q2xxMc7XEo', credit: 'Abdulrhman Gamal — Location blocks | nginx' },            // Location blocks | nginx
    'nginx-2-3-chon-khoi-chon-luon-chi-thi': { yt: 'H1L3ZM8RsPM', credit: 'Server Gyan — How to Use Location Block in Nginx | What is Use of Location Block in Nginx' },   // How to Use Location Block in Nginx | What is Use of Location Block in Nginx
    'nginx-2-4-root-va-alias': { yt: '8P2r0xSXk28', credit: 'Tony Teaches Tech — Nginx alias vs root... what\'s the difference?' },                 // Nginx alias vs root... what's the difference?
    'nginx-2-5-try-files-chuyen-huong-noi-bo': { yt: 'VPrBA2iZe1c', credit: 'Chris Fidao — The surprising ways Nginx try_files actually works' }, // The surprising ways Nginx try_files actually works

    /* ── Chương 3 — Reverse proxy: cái gì thật sự tới ứng dụng ── */
    'nginx-3-1-proxy-pass': { yt: 'KZOaO_s5LXI', credit: 'Davids Videos — nginx - managing reverse proxy using proxy_pass' },        // nginx - managing reverse proxy using proxy_pass
    'nginx-3-2-header-len-upstream': { yt: '4p1Zc8F29Lk', credit: 'Juriy Bura — Client IP in NGINX reverse proxy' },// Client IP in NGINX reverse proxy
    'nginx-3-3-dem-va-luong-chay': { yt: 'QbmOyr0HwnM', credit: 'Hussein Nasser — Nginx backend upstream timeouts Explained' },  // Nginx backend upstream timeouts Explained
    'nginx-3-4-timeout': { yt: 'BQY1l0rgDSQ', credit: 'Hussein Nasser — 6 NginX FrontEnd Timeouts Explained in Details' },            // 6 NginX FrontEnd Timeouts Explained in Details
    'nginx-3-5-websocket': { yt: 'zutCD7HMgwA', credit: 'Juriy Bura — Proxying WebSockets with NGINX' },          // Proxying WebSockets with NGINX

    /* ── Chương 4 — Tệp tĩnh: từ URI tới byte ── */
    'nginx-4-1-tu-uri-toi-byte': { yt: '7FpSPSlJj-0', credit: 'NeuralNine — NGINX Crash Course: Web Server, Reverse Proxy & Load Balancer' },            // NGINX Crash Course: Web Server, Reverse Proxy & Load Balancer
    'nginx-4-2-etag-va-bo-dem': { yt: 'rpJU4GEK-xI', credit: 'DevOpsCertification — Performance Optimization Using "Expires Headers" - Nginx - Cache Static Resources Using Nginx Config' },             // Performance Optimization Using "Expires Headers" - Nginx - Cache Static Resources
    'nginx-4-3-nen': { yt: 'ac839bB-Npg', credit: 'Abdulrhman Gamal — Gzip compression | Performance   | Nginx' },                        // Gzip compression | Performance | Nginx
    'nginx-4-4-sendfile-va-open-file-cache': { yt: 'I6dpN0geIb4', credit: 'ByteMonk — How NGINX Handles MILLIONS of Requests With Just 1 Process 🔥' },// How NGINX Handles MILLIONS of Requests With Just 1 Process
    'nginx-4-5-khoi-tinh-production': { yt: 'WMsqw68DhIg', credit: 'Tech Field Day — Advanced NGINX Config, Performance Improvements, Caching, Clustering' },       // Advanced NGINX Config, Performance Improvements, Caching, Clustering

    /* ── Chương 5 — Bộ đệm đặt trước ứng dụng ── */
    'nginx-5-1-bat-bo-dem': { yt: 'utdkGzmg1-Y', credit: 'Tony Teaches Tech — How to Configure Server-Level Cache on Nginx (basic example)' },           // How to Configure Server-Level Cache on Nginx (basic example)
    'nginx-5-2-cai-gi-duoc-cache': { yt: '8_-Dgf2hpTA', credit: 'Ahsan Nasir — NGINX: Content Caching with Reverse Proxy (Super FAST!) - Docker Beginner #10' },    // NGINX: Content Caching with Reverse Proxy (Super FAST!) - Docker Beginner #10
    'nginx-5-3-ai-quyet-dinh-thoi-han': { yt: '8f7TJdwm8LM', credit: 'Ryudith — How To Setting Proxy Cache In NGINX' },// How To Setting Proxy Cache In NGINX
    'nginx-5-4-con-giam-dap': { yt: 'CesxZqA1LDk', credit: 'TheTechDump — Cache Stampede / Thundering Herd Deep Dive: What Causes It and How to Fix It 🔥' },         // Cache Stampede / Thundering Herd Deep Dive: What Causes It and How to Fix It
    'nginx-5-5-phuc-vu-ban-cu': { yt: 'vxYsfb8dr90', credit: 'NGINX — Using NGINX for Advanced Caching and Throttling During Peak Events' },       // Using NGINX for Advanced Caching and Throttling

    /* ── Chương 6 — TLS và HTTP/2 ── */
    'nginx-6-1-chuoi-chung-chi': { yt: 'MVuJ5h2YQoQ', credit: 'Susan B. — HTTPS / SSL via “Let’s Encrypt” on a Nginx Web Server' },       // HTTPS / SSL via "Let's Encrypt" on a Nginx Web Server
    'nginx-6-2-giao-thuc-va-bo-ma': { yt: '06Kq50P01sI', credit: 'Hussein Nasser — Wiresharking TLS - What happens during TLS 1.2 and TLS 1.3 Handshake' },    // Wiresharking TLS - What happens during TLS 1.2 and TLS 1.3 Handshake
    'nginx-6-3-gia-cua-bat-tay': { yt: 'W1AwdyGNz6c', credit: 'programmerCave — From HTTP to HTTPS: Master the TLS Handshake in 10 Minutes | High-Performance Browser Networking' },       // From HTTP to HTTPS: Master the TLS Handshake in 10 Minutes
    'nginx-6-4-http2': { yt: 'beDiiWE8ESM', credit: 'Hussein Nasser — Where http2 hits its limit' },                 // Where http2 hits its limit
    'nginx-6-5-chuyen-huong-va-hsts': { yt: 'dAV3z2O7ghY', credit: 'Tony Teaches Tech — How to Enable HSTS for your Nginx and Apache Websites' },  // How to Enable HSTS for your Nginx and Apache Websites

    /* ── Chương 7 — Giới hạn: tốc độ, kết nối, kích thước ── */
    'nginx-7-1-limit-req': { yt: 'MrBpOzlDLXM', credit: 'Logan Lee — Nginx rate limiting' },          // Nginx rate limiting
    'nginx-7-2-khoa-gioi-han': { yt: 'FlJbXsUx5Wo', credit: 'F5 DevCentral Community — Advanced Rate Limiting with NGINX Plus Ingress Controller' },      // Advanced Rate Limiting with NGINX Plus Ingress Controller
    'nginx-7-3-limit-conn': { yt: 'GVtyccGECNk', credit: 'Coder In Boots — How to Limit the Request Rate in Nginx | Block DDoS attack | Prevent DDoS Attack | Prevent Botnets' },         // How to Limit the Request Rate in Nginx | Block DDoS attack
    'nginx-7-4-kich-thuoc-request': { yt: 'SMWvp4WcXBc', credit: 'Coder In Boots — How to control the Request Payload Size in Nginx | Client Max Body Size | Request Entity Too Large' }, // How to control the Request Payload Size in Nginx | Client Max Body Size
    'nginx-7-5-lop-phong-thu': { yt: 'gR4w9trH9pA', credit: 'Saturday Morning Productions — SaturdayMP Show #14: Rate Limiting with NGINX and Fail2Ban' },      // SaturdayMP Show #14: Rate Limiting with NGINX and Fail2Ban

    /* ── Chương 8 — Viết lại, ánh xạ, và chỉ thị nên tránh ── */
    'nginx-8-1-rewrite': { yt: '9_-l9tiPjug', credit: 'AnirbanIT — Nginx Tutorial Part 05-Rewrite Directive' },            // Nginx Tutorial Part 05-Rewrite Directive
    'nginx-8-2-if-la-quy-du': { yt: 'LM-3SWQiCNg', credit: 'Durgadas Kamath — Rewrite rules, Try Files and Logging | Nginx Tutorial #2' },       // Rewrite rules, Try Files and Logging | Nginx Tutorial #2
    'nginx-8-3-map': { yt: '6dwy3TQrYIE', credit: 'dimzrio — Nginx Tutorials #6 - Map Module (Redirect URL Based on User Agent)' },                // Nginx Tutorials #6 - Map Module (Redirect URL Based on User Agent)
    'nginx-8-4-return-error-page': { yt: '0yKLjVdgX9A', credit: 'dimzrio — Nginx Tutorials #5 - Redirect Url (Index, Error_page, Return, Rewrite and Try_files)' },  // Nginx Tutorials #5 - Redirect Url (Index, Error_page, Return, Rewrite and Try_files)
    'nginx-8-5-chuyen-doi-url': { yt: '9AGd9hnUnAg', credit: 'Joel\'s Learning — NGINX Rewrite and Redirect' },   // NGINX Rewrite and Redirect

    /* ── Chương 9 — Cân bằng tải qua nhiều backend ── */
    'nginx-9-1-khoi-upstream': { yt: 'wYjhS42mbWM', credit: 'CultureLinux — 🔀 NGINX: Proxy Pass + Load Balancer (Round Robin, IP Hash...)' },           // NGINX: Proxy Pass + Load Balancer (Round Robin, IP Hash...)
    'nginx-9-2-dinh-tuyen-dinh': { yt: 'F-LgiRxMsB0', credit: 'AK Coding — Load Balancing Algorithms Explained | Round Robin vs Least Connections vs IP Hash | System Design' },         // Load Balancing Algorithms Explained | Round Robin vs Least Connections vs IP Hash
    'nginx-9-3-khi-backend-chet': { yt: '7S1LM1pcXos', credit: 'Dispatch — Nginx Load Balancing from Scratch and Algorithms in action.' },        // Nginx Load Balancing from Scratch and Algorithms in action
    'nginx-9-4-tai-dung-ket-noi': { yt: 'ODxw1QWpdEM', credit: 'Alternative Degree — Nginx as a reverse proxy  - A closer look at Nginx worker processes and worker connections' },        // Nginx as a reverse proxy - A closer look at worker processes and worker connections
    'nginx-9-5-deploy-khong-rot-request': { yt: 'Ymu0lS5eIv4', credit: 'WittCode — Don\'t Restart Nginx' },// Don't Restart Nginx

    /* ── Chương 10 — Log, và nhìn thấy chuyện gì đang xảy ra ── */
    'nginx-10-1-log-mac-dinh-bo-sot': { yt: 'f2WKJpFWXx8', credit: 'WittCode — Nginx Access and Error Logs' },        // Nginx Access and Error Logs
    'nginx-10-2-log-json-escape': { yt: 't4fYEY6bf0c', credit: 'Coder In Boots — How to format Nginx Logs in JSON | Log Structure | JSON Export' },            // How to format Nginx Logs in JSON | Log Structure | JSON Export
    'nginx-10-3-khong-ghi-log-va-gia-cua-no': { yt: 'PsW-5GAguwc', credit: 'Cleavr — How to skip requests from being logged in the NGINX Access Log' },// How to skip requests from being logged in the NGINX Access Log
    'nginx-10-4-error-log-va-cac-muc': { yt: 'pkeXJQIBfIw', credit: 'Abdulrhman Gamal — Logging  | Nginx' },       // Logging | Nginx
    'nginx-10-5-stub-status': { yt: '6SsX1boShgk', credit: 'LinuxHelp — How to Monitor Nginx by using Stub Status Module on Ubuntu 21.04' },               // How to Monitor Nginx by using Stub Status Module on Ubuntu 21.04

    /* ── Chương 11 — Chẩn đoán: bắt Nginx khai ra nó đã làm gì ── */
    'nginx-11-1-bat-nginx-khai-ra': { yt: 'SeBaAq5YqlU', credit: 'medium guy — nginx custom logs and formats in docker environment in less than 10 mins' },              // nginx custom logs and formats in docker environment in less than 10 mins
    'nginx-11-2-nginx-t-chung-minh-gi': { yt: 'ZOiGHPG1unk', credit: 'Karani Geoffrey — Unknown log format "main" - Nginx' },          // Unknown log format "main" - Nginx
    'nginx-11-3-doc-cau-hinh-nguoi-khac-viet': { yt: 'A60X8Nq_w_w', credit: 'Liquid Web by Nexcess — How to Convert .htaccess Rules to NGINX Directives' },   // How to Convert .htaccess Rules to NGINX Directives
    'nginx-11-4-tu-ma-trang-thai-toi-nguyen-nhan': { yt: 'obRxID54H14', credit: 'Bobby Iliev — Fixing 502 Bad Gateway Nginx' },// Fixing 502 Bad Gateway Nginx
    'nginx-11-5-cau-hinh-production': { yt: 'YEdhuC2muOE', credit: 'NGINX — Performance-Tuning NGINX Open Source and NGINX Plus' },            // Performance-Tuning NGINX Open Source and NGINX Plus
  },
};
