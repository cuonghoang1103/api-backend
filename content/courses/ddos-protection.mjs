/**
 * DDoS & bảo vệ lưu lượng — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm A — Bảo mật 1). Công khai như các khoá khung khác (bài chưa soạn
 * hiện "Đang soạn"). Soạn chi tiết theo quy trình khoá Docker (content/courses/docker/_HOP-DONG.md). Xem _chung/khung.mjs.
 *
 * KHÔNG TRÙNG khoá cũ: nginx Ch7 (limit_req/limit_conn/kích thước request) và api-design 5.3 (rate limit ở tầng API)
 * đã dạy cơ chế — ở đây chỉ một bài "Nếu đã học" rồi đi sâu vào DDoS (nhiều nguồn, khoá giả mạo, tầng mạng, Cloudflare).
 * web-security 6.4 (ReDoS trong code của mình) chỉ được nhắc, không dạy lại.
 * AN TOÀN/PHÁP LÝ: mọi phép đo tải chỉ trên máy/tên miền của chính mình, trong lab tách biệt; không dạy dựng botnet,
 * không dùng dịch vụ "booter/stresser". Ảnh bìa: logo simple-icons cloudflare (người điều phối dựng).
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'security', name: 'Bảo mật', icon: 'Shield', sortOrder: 8 },
  course: {
    slug: 'ddos-protection',
    title: 'DDoS Protection & Traffic Defense',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/ddos-protection.png?v=4',
    shortDescription: 'DDoS from zero to expert: L3/L4/L7 attacks, botnets, amplification, Cloudflare WAF and rate limiting, hiding your origin, nginx and Redis limits, and a playbook for the day you are under attack.|||DDoS từ số 0 tới chuyên gia: tấn công L3/L4/L7, botnet, khuếch đại, Cloudflare WAF và rate limit, giấu IP gốc, giới hạn bằng nginx và Redis, và playbook cho ngày đang bị đánh.',
    description: 'Khoá DDoS cho người tự vận hành web (Cloudflare + nginx + VPS Ubuntu + Docker). Tấn công từ chối dịch vụ là gì và vì sao không "vá" được như một con bug; lịch sử từ SYN flood 1996, Mafiaboy 2000, Spamhaus 2013, Mirai 2016, GitHub memcached 2018 tới HTTP/2 Rapid Reset 2023; phân loại theo tầng mạng (L3/L4) và tầng ứng dụng (L7); botnet và khuếch đại phản xạ; anycast và trung tâm lọc; Cloudflare từ A tới Z (proxy, WAF, Rate Limiting, Bot Fight, Turnstile, Under Attack, cache); giấu và khoá IP gốc; phòng thủ nhiều lớp trên VPS (nftables, sysctl, nginx, rate limit trong app bằng Redis); chi phí và autoscale; đo tải hợp pháp trên lab của mình; playbook và diễn tập ngày bị đánh; dự án cuối khoá: gia cố một web giống cuongthai.com.',
    whatYouLearn: 'Nhận ra kiểu DDoS đang xảy ra từ log và số liệu; cấu hình Cloudflare (WAF managed/custom rules, Rate Limiting, Bot Fight, Turnstile, cache rules) cho một web thật; khoá VPS chỉ nhận lưu lượng từ Cloudflare và bật Authenticated Origin Pulls; dựng giới hạn nhiều lớp (nftables, nginx, Redis sliding window); ước lượng chi phí và điểm gãy bằng k6 trên chính hệ thống của mình; viết và diễn tập playbook khi đang bị tấn công.',
    requirements: 'Linux và dòng lệnh cơ bản, đã từng đưa một web lên VPS. Nên học trước: /courses/nginx (Ch7 giới hạn), /courses/deploy-vps, /courses/linux-bash; nên có /courses/redis và /courses/api-design (5.3 rate limit). Không cần kinh nghiệm bảo mật.',
    documentsNote: 'Tài liệu chính: developers.cloudflare.com (DDoS Protection, WAF, Rate limiting rules, Turnstile, Authenticated Origin Pulls) • blog.cloudflare.com + báo cáo DDoS theo quý của Cloudflare • nginx.org/en/docs (ngx_http_limit_req_module, ngx_http_limit_conn_module) • CISA "Understanding and Responding to DDoS Attacks" • RFC 4987 (TCP SYN flooding) • CVE-2023-44487 (HTTP/2 Rapid Reset) • k6.io/docs • wiki.nftables.org.',
  },
  sections: khung('ddos', [
    ['Section 0 — Why DDoS is different', 'Mục 0 — Vì sao DDoS khác mọi lỗ hổng', 'DDoS là gì, lịch sử và những cú đánh có tên, học xong làm được gì, và dựng lab đo tải an toàn.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What a DDoS is in everyday words, and the attacks that made history', 'Bắt đầu tại đây (1/2) — DDoS là gì bằng lời đời thường, và những cú đánh đi vào lịch sử', 'Cửa hàng bị một đám đông giả xếp kín lối vào · Panix 1996 (SYN flood), Mafiaboy 2000 (Yahoo, eBay, CNN) · Spamhaus 2013 (khuếch đại DNS ~300 Gbps) · Mirai 2016 (KrebsOnSecurity, OVH, Dyn) · GitHub 2018 (memcached 1,35 Tbps) · HTTP/2 Rapid Reset 2023 và các kỷ lục Cloudflare công bố · Vì sao DDoS không "vá" được mà chỉ "chịu" được'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, and how to study it', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, và học khoá này thế nào', 'Vai trò: SRE, kỹ sư mạng/edge, security engineer, người tự vận hành web · Bản đồ khoá: hiểu đòn → lớp phòng thủ → Cloudflare → VPS → diễn tập · Khoá nền: nginx, deploy-vps, linux-bash, redis · Quy tắc sắt: chỉ đo tải trên hệ thống của mình'],
      ['phap-ly', 'The law and the line you never cross', 'Pháp lý và lằn ranh không được bước qua', 'Luật An ninh mạng 2018 và BLHS 2015 (điều 285–289) — người soạn kiểm văn bản gốc · Dịch vụ "booter/stresser" là phạm pháp dù gọi là "test" · Được phép: máy của mình, tên miền của mình, có văn bản đồng ý · Đo tải trên Cloudflare phải theo điều khoản của họ'],
      ['cai-lab', 'Building a safe lab: a target VPS, a load machine, and dashboards', 'Dựng lab an toàn: VPS mục tiêu, máy phát tải và bảng số liệu', 'Docker Compose: nginx + Express + PostgreSQL + Redis · k6 và wrk trên một máy riêng · Prometheus + Grafana xem RPS/latency/CPU · Tên miền thử qua Cloudflare gói Free · Nút tắt khẩn cấp'],
    ]],
    ['Chapter 1 — How availability breaks', 'Chương 1 — Tính sẵn sàng vỡ ra như thế nào', 'Nền tảng: tài nguyên nào cạn trước, và cách đo điểm gãy.', [
      ['tai-nguyen', 'Every server runs out of something: bandwidth, packets, connections, CPU, memory', 'Máy chủ nào cũng cạn một thứ: băng thông, gói tin, kết nối, CPU, bộ nhớ', 'Gbps vs Mpps vs RPS · Bảng trạng thái kết nối · Worker pool và hàng đợi · Cái cạn trước quyết định cách phòng thủ'],
      ['dos-vs-ddos', 'DoS vs DDoS, volumetric vs protocol vs application', 'DoS vs DDoS, và ba nhóm: dung lượng, giao thức, ứng dụng', 'Một nguồn chặn được bằng IP, hàng nghìn nguồn thì không · Phân loại theo OWASP/Cloudflare · Đòn "lỡ tay" từ chính khách hàng (thundering herd) · Flash crowd hợp lệ trông y hệt tấn công'],
      ['bat-doi-xung', 'Asymmetry: why a cheap request can cost you a lot', 'Bất đối xứng: vì sao một request rẻ lại làm bạn tốn đắt', 'Request tìm kiếm không index · Xuất PDF, gọi LLM, gửi email · Trang không cache · Tìm endpoint đắt nhất của chính web mình'],
      ['do-diem-gay', 'Measuring your breaking point with k6 (on your own lab)', 'Đo điểm gãy bằng k6 (trên lab của mình)', 'Kịch bản ramping-arrival-rate · p95/p99 và tỉ lệ lỗi · Tìm tài nguyên bão hoà · Ghi con số làm mốc cho cả khoá'],
    ]],
    ['Chapter 2 — Network-layer attacks (L3/L4)', 'Chương 2 — Tấn công tầng mạng (L3/L4)', 'Lũ gói tin, SYN flood và vì sao VPS nhỏ không tự đỡ được.', [
      ['syn-flood', 'SYN flood and SYN cookies', 'SYN flood và SYN cookies', 'Bắt tay ba bước và hàng đợi nửa mở · net.ipv4.tcp_syncookies · tcp_max_syn_backlog · RFC 4987 · Xem bằng ss -s và tcpdump trên lab'],
      ['udp-icmp', 'UDP floods, ICMP floods and packet-rate attacks', 'UDP flood, ICMP flood và tấn công bằng số gói', 'Mpps giết card mạng trước băng thông · Gói nhỏ vs gói lớn · Phân mảnh IP · Vì sao nhà cung cấp VPS "null-route" IP của bạn'],
      ['spoofing', 'IP spoofing and why BCP38 matters', 'Giả IP nguồn và vì sao BCP38 quan trọng', 'Gói tin mang địa chỉ giả · BCP38/RFC 2827 lọc ở nhà mạng · Chặn theo IP vô nghĩa khi nguồn bị giả · Liên hệ tầng khuếch đại'],
      ['gioi-han-vps', 'What a single VPS can and cannot absorb', 'Một VPS chịu được gì và không chịu được gì', 'Đường truyền 1 Gbps đầy thì không phần mềm nào cứu · Chống DDoS của nhà cung cấp (mức cơ bản) · Tầng mạng phải chặn ở thượng nguồn · Quyết định: đưa lưu lượng qua proxy'],
    ]],
    ['Chapter 3 — Botnets and amplification', 'Chương 3 — Botnet và khuếch đại', 'Kẻ tấn công lấy đâu ra băng thông khổng lồ.', [
      ['botnet', 'Botnets: from IRC bots to Mirai and IoT', 'Botnet: từ bot IRC tới Mirai và IoT', 'Máy bị chiếm làm lính · Mirai quét Telnet với mật khẩu mặc định · Mã nguồn Mirai bị công bố và các biến thể · Botnet thuê theo giờ'],
      ['khuech-dai', 'Reflection and amplification: DNS, NTP, memcached, CLDAP', 'Phản xạ và khuếch đại: DNS, NTP, memcached, CLDAP', 'Hỏi nhỏ, trả lời to, gửi về nạn nhân · Hệ số khuếch đại (memcached lên tới hàng chục nghìn lần) · GitHub 2018 · Đừng để dịch vụ của mình thành bộ khuếch đại (memcached/Redis mở ra Internet)'],
      ['carpet', 'Carpet bombing and multi-vector attacks', 'Rải thảm và tấn công đa vector', 'Đánh cả dải IP thay vì một IP · Đổi vector giữa chừng · Kết hợp L3 + L7 · Vì sao phòng thủ phải tự động'],
      ['kinh-te', 'The economics: booter services, ransom DDoS and extortion notes', 'Kinh tế học: dịch vụ booter, DDoS tống tiền và thư đòi tiền', 'Chợ đen thuê DDoS · RDDoS: thư đe doạ trước khi đánh · Không trả tiền, báo cơ quan chức năng · Các chiến dịch triệt phá booter của cảnh sát quốc tế'],
    ]],
    ['Chapter 4 — Application-layer attacks (L7)', 'Chương 4 — Tấn công tầng ứng dụng (L7)', 'Request trông hợp lệ nhưng nhắm vào chỗ đắt nhất.', [
      ['http-flood', 'HTTP floods: GET, POST and cache-busting', 'HTTP flood: GET, POST và phá cache', 'Query string ngẫu nhiên để né cache · Nhắm endpoint tìm kiếm/đăng nhập · User-Agent giả · Nhận diện qua log nginx'],
      ['slowloris', 'Slow attacks: Slowloris and slow POST', 'Tấn công chậm: Slowloris và slow POST', 'Slowloris 2009 (RSnake) · Giữ kết nối mở bằng header nhỏ giọt · client_header_timeout/client_body_timeout · Vì sao proxy phía trước miễn nhiễm'],
      ['http2', 'HTTP/2 and HTTP/3 specific attacks: Rapid Reset and friends', 'Tấn công riêng của HTTP/2 và HTTP/3: Rapid Reset và đồng bọn', 'CVE-2023-44487: mở rồi huỷ stream liên tục · Kỷ lục hàng trăm triệu RPS · Vá nginx/Node · Giới hạn số stream đồng thời'],
      ['logic', 'Business-logic DoS: login, OTP, search, export, LLM calls', 'DoS logic nghiệp vụ: đăng nhập, OTP, tìm kiếm, xuất file, gọi LLM', 'bcrypt cố tình chậm thành vũ khí · Gửi OTP/email tốn tiền · Gọi AI tốn tiền theo token · Trần chi phí theo ngày (như budget.ts của web này) · Nhắc web-security 6.4 ReDoS'],
      ['bot-scraper', 'Bots that are not attacks: scrapers, AI crawlers, credential stuffers', 'Bot không phải tấn công: cào dữ liệu, crawler AI, nhồi tín vật', 'robots.txt không phải hàng rào · Crawler AI và băng thông · Nhồi tín vật: trỏ /courses/authentication Ch10 · Phân loại bot tốt/xấu'],
    ]],
    ['Chapter 5 — The defence stack: anycast, CDN and scrubbing', 'Chương 5 — Chồng phòng thủ: anycast, CDN và trung tâm lọc', 'Phòng thủ DDoS là chuyện hạ tầng trước khi là chuyện code.', [
      ['anycast', 'Anycast: one IP, hundreds of data centres', 'Anycast: một IP, hàng trăm trung tâm dữ liệu', 'BGP quảng bá cùng một prefix · Lưu lượng tấn công bị chia nhỏ theo địa lý · Vì sao dung lượng mạng là vũ khí · So với unicast của một VPS'],
      ['scrubbing', 'Scrubbing centres, BGP diversion and always-on vs on-demand', 'Trung tâm lọc, chuyển hướng BGP, luôn bật vs bật khi cần', 'Magic Transit/AWS Shield Advanced/Akamai Prolexic ở mức khái niệm · GRE tunnel trả sạch về · Thời gian phản ứng · Chi phí'],
      ['nhieu-lop', 'Defence in depth: edge, network, host, proxy, app, data', 'Phòng thủ nhiều lớp: biên, mạng, máy chủ, proxy, ứng dụng, dữ liệu', 'Mỗi lớp chặn một loại · Sơ đồ lớp cho cuongthai.com · Lớp nào sập thì lớp sau gánh · Tránh chặn trùng gây khó chẩn đoán'],
      ['so-sanh', 'Choosing a provider: Cloudflare, AWS Shield, Google Cloud Armor, Akamai, Fastly', 'Chọn nhà cung cấp: Cloudflare, AWS Shield, Google Cloud Armor, Akamai, Fastly', 'Gói miễn phí vs trả phí · Tính tiền theo lưu lượng sạch hay không · Khoá chặt vào nhà cung cấp · Bảng quyết định cho sinh viên/startup'],
    ]],
    ['Chapter 6 — Cloudflare in depth (1): proxy, DNS and caching', 'Chương 6 — Cloudflare chuyên sâu (1): proxy, DNS và cache', 'Đưa web ra sau Cloudflare đúng cách, và dùng cache làm lá chắn.', [
      ['proxy', 'Orange cloud: what proxying actually changes', 'Mây cam: bật proxy thực ra thay đổi gì', 'DNS trỏ về IP Cloudflare · TLS kết thúc ở biên · SSL mode Full (strict) · Bản ghi nào KHÔNG được proxy (mail, SSH) và chúng làm lộ IP gốc'],
      ['cache', 'Cache rules as a DDoS shield', 'Quy tắc cache như một tấm khiên chống DDoS', 'Cache Rules, Edge TTL, Cache Everything có kiểm soát · Bỏ query string rác · Tiered Cache · Nhắc bài học nginx nuốt Cache-Control của web này'],
      ['ddos-managed', 'Cloudflare DDoS managed rulesets: L3/4 and HTTP', 'Bộ luật DDoS được quản lý của Cloudflare: L3/4 và HTTP', 'Luôn bật và miễn phí · Độ nhạy và hành động · Ghi đè cho endpoint đặc biệt · Đọc Security Events'],
      ['analytics', 'Reading Cloudflare analytics and security events', 'Đọc số liệu và sự kiện bảo mật trên Cloudflare', 'Lọc theo ASN, quốc gia, đường dẫn, JA3/JA4 · Phân biệt flash crowd và tấn công · Xuất log (Logpush) ở mức khái niệm · GraphQL Analytics API'],
    ]],
    ['Chapter 7 — Cloudflare in depth (2): WAF, rate limiting and bots', 'Chương 7 — Cloudflare chuyên sâu (2): WAF, rate limit và bot', 'Luật tự viết, giới hạn tần suất ở biên và phân biệt người với máy.', [
      ['waf-managed', 'WAF managed rules and the OWASP core ruleset', 'WAF managed rules và bộ luật lõi OWASP', 'Bộ luật Cloudflare Managed · OWASP CRS và điểm bất thường · Dương tính giả và cách ngoại lệ · Log trước, chặn sau'],
      ['waf-custom', 'Custom rules: the expression language, and rules worth having', 'Custom rules: ngôn ngữ biểu thức, và những luật nên có', 'http.request.uri.path, ip.src.asnum, cf.threat_score · Chặn /wp-admin khi không dùng WordPress · Chỉ cho /admin từ quốc gia/IP của mình · Managed Challenge vs Block'],
      ['rate-limit', 'Rate limiting rules at the edge', 'Rate limiting rules ở biên', 'Đếm theo IP, header, cookie, ASN · Giới hạn đăng nhập, OTP, tìm kiếm · Thời gian phạt · Giới hạn gói Free và cách thiết kế quanh nó'],
      ['bot', 'Bot Fight Mode, Super Bot Fight Mode and verified bots', 'Bot Fight Mode, Super Bot Fight Mode và bot đã xác minh', 'Bot tốt (Googlebot) không bị chặn · Bot score ở gói trả phí · Chặn crawler AI · Khi bật Bot Fight làm hỏng API cho app di động'],
      ['turnstile', 'Turnstile and challenges without CAPTCHAs', 'Turnstile và thử thách không cần CAPTCHA', 'Turnstile 2022 · Nhúng widget + kiểm token ở server (siteverify) · Gắn vào đăng ký/đăng nhập/quên mật khẩu · Không dùng cho API máy gọi máy'],
      ['under-attack', 'Under Attack mode, and why it is a last resort', 'Under Attack mode, và vì sao nó là phương án cuối', 'Thử thách JavaScript cho mọi người · Làm hỏng API, webhook, app di động · Bật theo đường dẫn bằng Configuration Rules · Tắt khi nào'],
    ]],
    ['Chapter 8 — Hiding and locking down the origin', 'Chương 8 — Giấu và khoá chặt máy chủ gốc', 'Mọi lớp chắn ở biên vô nghĩa nếu kẻ tấn công biết IP thật.', [
      ['lo-ip', 'How origin IPs leak: DNS history, mail, subdomains, certificates', 'IP gốc lộ ra bằng cách nào: lịch sử DNS, mail, subdomain, chứng chỉ', 'Bản ghi A cũ trong lịch sử DNS · Header và bounce của mail · Certificate Transparency (crt.sh) · Webhook/SSRF gọi ra ngoài · Tự kiểm tên miền của mình'],
      ['firewall-cf', 'Firewall: accept 80/443 only from Cloudflare ranges', 'Tường lửa: chỉ nhận 80/443 từ dải IP Cloudflare', 'Tải danh sách IPv4/IPv6 chính thức · ufw/nftables set tự cập nhật · Cái bẫy Docker đi vòng qua ufw (nhắc deploy-vps 12.3) · Kiểm bằng curl thẳng vào IP'],
      ['aop', 'Authenticated Origin Pulls and mTLS to the origin', 'Authenticated Origin Pulls và mTLS tới máy gốc', 'nginx ssl_verify_client với chứng chỉ Cloudflare · Chứng chỉ riêng theo zone · Chặn cả người cũng dùng Cloudflare · Origin CA certificate'],
      ['tunnel', 'Cloudflare Tunnel: no open inbound ports at all', 'Cloudflare Tunnel: không mở cổng vào nào cả', 'cloudflared chạy trong Docker · So với firewall theo dải IP · Nhắc self-hosting 7.3 và đi sâu phần chịu tải · Khi tunnel là điểm hỏng đơn lẻ'],
      ['doi-ip', 'When the origin IP is already burned: rotating it safely', 'Khi IP gốc đã lộ: đổi IP an toàn', 'Snapshot → máy mới → IP mới · Không trỏ bản ghi nào không proxy vào IP mới · Kiểm lại toàn bộ đường lộ · Viết checklist'],
    ]],
    ['Chapter 9 — Host and proxy layer on the VPS', 'Chương 9 — Lớp máy chủ và proxy trên VPS', 'Khi lưu lượng đã tới máy: kernel, nftables và nginx.', [
      ['neu-da-hoc-nginx', 'If you took the Nginx course: limit_req and limit_conn in one page', 'Nếu đã học khoá Nginx: limit_req và limit_conn trong một trang', 'Ôn nhanh /courses/nginx Ch7 · Vì sao khoá theo $binary_remote_addr sai sau Cloudflare · real_ip_header CF-Connecting-IP + set_real_ip_from dải Cloudflare · Đi sâu: giới hạn theo từng nhóm đường dẫn'],
      ['sysctl', 'Kernel tuning for connection floods', 'Tinh chỉnh kernel cho lũ kết nối', 'somaxconn, tcp_max_syn_backlog, syncookies · conntrack và nf_conntrack_max · Đo trước khi chỉnh · Tham số không nên đụng'],
      ['nftables', 'nftables rate limits and connection caps', 'Giới hạn tần suất và số kết nối bằng nftables', 'meter/limit rate theo IP · ct count · Set động tự hết hạn · So với fail2ban/CrowdSec (nhắc self-hosting 11.2)'],
      ['nginx-sau', 'nginx beyond the basics: timeouts, buffers, keepalive and a 444', 'nginx vượt qua cơ bản: timeout, buffer, keepalive và mã 444', 'Timeout chống tấn công chậm · Giới hạn HTTP/2 stream · Trả 444 để cắt kết nối · Tách zone giới hạn cho /api/auth và /api/ai'],
      ['do-lai', 'Measuring the host layer on your lab', 'Đo lại lớp máy chủ trên lab của mình', 'So số liệu với mốc Chương 1 · Dương tính giả: khách hàng thật bị chặn · Ghi cấu hình thành file trong repo · Rollback nhanh'],
    ]],
    ['Chapter 10 — Application-level rate limiting', 'Chương 10 — Rate limit ở tầng ứng dụng', 'Giới hạn theo người dùng, theo chi phí, nhiều instance cùng lúc.', [
      ['neu-da-hoc-api', 'If you took API Design: what 5.3 covered, and what changes under attack', 'Nếu đã học API Design: 5.3 đã dạy gì, và điều gì đổi khi bị tấn công', 'Ôn /courses/api-design 5.3 (hạn mức, 429, Retry-After) · Khác biệt: kẻ tấn công không tôn trọng Retry-After · Khoá theo user, API key, tổ chức · Giới hạn theo chi phí thay vì theo số lượt'],
      ['thuat-toan', 'Algorithms: fixed window, sliding log, sliding window, token bucket, GCRA', 'Thuật toán: cửa sổ cố định, nhật ký trượt, cửa sổ trượt, token bucket, GCRA', 'Lỗi biên ở cửa sổ cố định · Độ chính xác vs bộ nhớ · Burst hợp lệ · Chọn thuật toán cho từng loại endpoint'],
      ['redis', 'Redis sliding window with Lua (Express and Spring Boot)', 'Cửa sổ trượt trên Redis bằng Lua (Express và Spring Boot)', 'ZADD/ZREMRANGEBYSCORE/ZCARD trong một script nguyên tử · express-rate-limit + rate-limit-redis · Bucket4j cho Spring Boot · Redis sập thì mở hay đóng cửa'],
      ['uu-tien', 'Load shedding, priorities and circuit breakers', 'Bỏ bớt tải, ưu tiên và cầu dao', 'Trả 503 sớm khi hàng đợi đầy · Người đăng nhập trước, khách sau · Tắt tính năng đắt khi quá tải · Circuit breaker với dịch vụ ngoài'],
      ['chi-phi', 'Cost caps for expensive features (email, SMS, LLM)', 'Trần chi phí cho tính năng đắt (email, SMS, LLM)', 'Hạn mức token/ngày theo người · Trần tiền mềm/cứng theo ngày · Cảnh báo khi đốt nhanh bất thường · Ví dụ thật: chốt chặn chi phí LLM của web này'],
    ]],
    ['Chapter 11 — Scale, cost and architecture', 'Chương 11 — Mở rộng, chi phí và kiến trúc', 'Khi nào mở rộng, ai trả tiền, và kiến trúc chịu đòn.', [
      ['autoscale', 'Autoscaling against DDoS: help or a bill?', 'Autoscale chống DDoS: cứu hay thành hoá đơn?', 'Scale L7 giúp được, L3/4 thì không · Trần số máy · "Denial of wallet" trên serverless · Cảnh báo ngân sách cloud'],
      ['tinh-hoa', 'Static-first and graceful degradation', 'Ưu tiên nội dung tĩnh và xuống cấp êm', 'Trang tĩnh/ISR phục vụ từ cache khi backend sập · Trang bảo trì phục vụ từ biên · Chế độ chỉ đọc · Tách tính năng đắt ra dịch vụ riêng'],
      ['egress', 'Bandwidth and egress costs: R2, S3 and CDN', 'Chi phí băng thông và egress: R2, S3 và CDN', 'Kẻ tấn công tải file lớn để đốt tiền · URL ký có hạn · R2 không tính egress · Giới hạn tải theo người dùng'],
      ['ha', 'Redundancy: multiple origins and failover', 'Dự phòng: nhiều máy gốc và chuyển đổi dự phòng', 'Load Balancing với health check ở mức khái niệm · Máy gốc thứ hai ở nhà cung cấp khác · DNS failover · Chi phí thật cho dự án nhỏ'],
    ]],
    ['Chapter 12 — Under attack: detection, playbook and drills', 'Chương 12 — Đang bị tấn công: phát hiện, playbook và diễn tập', 'Ngày xấu nhất, được chuẩn bị trước.', [
      ['phat-hien', 'Detection: the signals that say "this is an attack"', 'Phát hiện: tín hiệu nói "đây là tấn công"', 'RPS, tỉ lệ 4xx/5xx, số kết nối, băng thông · Cảnh báo từ Cloudflare (notifications) · Phân biệt với bug deploy hoặc flash crowd · Nhắc /courses/observability-monitoring Ch9'],
      ['playbook', 'Writing the DDoS playbook: first 5, 30 and 120 minutes', 'Viết playbook DDoS: 5, 30 và 120 phút đầu', 'Xác định tầng bị đánh · Bật luật đã soạn sẵn thay vì viết lúc hoảng · Ai làm gì · Liên lạc với người dùng qua trang trạng thái · Liên kết khoá /courses/incident-response'],
      ['dien-tap', 'Running a legal drill on your own lab', 'Diễn tập hợp pháp trên lab của mình', 'k6 mô phỏng HTTP flood từ nhiều máy của mình · Đo thời gian phát hiện và thời gian giảm thiểu · Không bao giờ nhắm hệ thống người khác · Điều khoản của nhà cung cấp trước khi đo'],
      ['sau-su-co', 'After the attack: evidence, reporting and postmortem', 'Sau cuộc tấn công: bằng chứng, báo cáo và postmortem', 'Lưu log và số liệu · Báo cơ quan chức năng khi bị tống tiền · Postmortem không đổ lỗi · Cập nhật luật và ngưỡng'],
    ]],
    ['Chapter 13 — Interviews and certifications', 'Chương 13 — Phỏng vấn và chứng chỉ', 'Kể được điều mình đã làm và trả lời có cơ sở.', [
      ['phong-van', 'DDoS questions in SRE, backend and security interviews', 'Câu hỏi DDoS trong phỏng vấn SRE, backend và bảo mật', 'Thiết kế rate limiter phân tán · "Web bị DDoS, bạn làm gì?" · SYN cookies hoạt động ra sao · Khuếch đại là gì'],
      ['system-design', 'DDoS in system design: where the edge goes on the diagram', 'DDoS trong system design: vẽ lớp biên ở đâu trên sơ đồ', 'CDN/WAF trước load balancer · Giới hạn ở nhiều lớp · Kịch bản quá tải · Trỏ /courses/api-design Ch11'],
      ['chung-chi', 'Certifications that touch this topic', 'Chứng chỉ có liên quan', 'CompTIA Security+ và Network+ · Cloudflare có chương trình đào tạo riêng (người soạn kiểm tên hiện hành) · AWS Certified Security – Specialty (phần Shield/WAF) · Chứng chỉ không thay được một lab đã làm thật'],
    ]],
    ['Chapter 14 — Capstone: hardening a site like cuongthai.com', 'Chương 14 — Dự án cuối khoá: gia cố một web giống cuongthai.com', 'Cloudflare + nginx + VPS + Docker + PostgreSQL, gia cố và diễn tập từ đầu tới cuối.', [
      ['kiem-ke', 'Inventory: endpoints, costs, and the current breaking point', 'Kiểm kê: endpoint, chi phí và điểm gãy hiện tại', 'Liệt kê endpoint đắt · Đo điểm gãy bằng k6 · Tìm mọi đường lộ IP gốc · Sơ đồ lớp phòng thủ hiện có'],
      ['gia-co', 'Hardening: edge rules, origin lock-down and app limits', 'Gia cố: luật ở biên, khoá máy gốc và giới hạn trong app', 'Cache Rules + WAF custom + Rate Limiting + Turnstile · Firewall chỉ nhận Cloudflare + Authenticated Origin Pulls · nginx zones + Redis sliding window · Trần chi phí'],
      ['dien-tap-cuoi', 'The final drill: attack your own lab and measure', 'Diễn tập cuối: tấn công lab của chính mình và đo', 'Ba kịch bản: HTTP flood, tấn công chậm, đốt endpoint đắt · So số liệu trước/sau · Dương tính giả · Ghi lại thời gian phát hiện'],
      ['bao-cao', 'Report, playbook and interview story', 'Báo cáo, playbook và câu chuyện phỏng vấn', 'Báo cáo một trang có số liệu · Playbook đã diễn tập · Checklist cả khoá · Kể dự án trong phỏng vấn'],
    ]],
  ]),
};
