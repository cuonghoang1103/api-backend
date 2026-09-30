/**
 * Mạng máy tính cho lập trình viên — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm C). Công khai như các khoá khung khác (bài chưa soạn hiện
 * "Đang soạn"); soạn chi tiết sau theo quy trình khoá Docker (content/courses/docker/_HOP-DONG.md). Xem _chung/khung.mjs.
 *
 * Ranh giới với khoá cũ: linux-bash Ch9 (ip/ss/dig/curl/SSH/tường lửa ở mức lệnh), self-hosting Ch6 (mạng nhà:
 * NAT, port forwarding, CGNAT, VLAN, DDNS), nginx Ch6/Ch9 (cấu hình TLS/HTTP2, cân bằng tải trong nginx),
 * web-foundations Ch6 (HTTP nhập môn). Khoá này dạy CƠ CHẾ giao thức bên dưới — mỗi chỗ chạm có bài "Nếu đã học …".
 * Không trùng network-security (Nhóm A — tường lửa, VPN, Zero Trust, tấn công mạng): ở đây chỉ nhắc và trỏ sang.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'cs-fundamentals', name: 'Nền tảng khoa học máy tính', icon: 'Cpu', sortOrder: 9 },
  course: {
    slug: 'networking-for-developers',
    title: 'Networking for Developers',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/networking-for-developers.png?v=1',
    shortDescription: 'Computer networking the way a developer meets it: IP and subnets, DNS in depth, TCP and UDP, QUIC, TLS, HTTP/1.1 to HTTP/3, CDNs, WebSocket and load balancers — measured with dig, curl, tcpdump and Wireshark on a real site.|||Mạng máy tính theo cách lập trình viên thật sự gặp: IP và subnet, DNS tới tận gốc, TCP và UDP, QUIC, TLS, HTTP/1.1 tới HTTP/3, CDN, WebSocket và cân bằng tải — đo bằng dig, curl, tcpdump và Wireshark trên một website thật.',
    description: 'Khoá mạng cho người viết phần mềm, không phải cho kỹ sư cấu hình router. Bắt đầu từ câu hỏi "gõ một địa chỉ rồi Enter thì chuyện gì xảy ra", đi qua từng tầng: địa chỉ IP, subnet, định tuyến và NAT; DNS từ resolver tới máy chủ gốc, TTL, các loại bản ghi và anycast; TCP (bắt tay, cửa sổ, kiểm soát tắc nghẽn, TIME_WAIT) và UDP; QUIC; TLS 1.3 và chứng chỉ; HTTP/1.1 → HTTP/2 → HTTP/3; CDN và cache; WebSocket/SSE; cân bằng tải L4/L7. Mọi khái niệm đều đo được bằng dig, curl -v, ss, tcpdump, Wireshark, mtr. Chương cuối chẩn đoán và tối ưu đường đi của một request thật qua Cloudflare → nginx → Docker → Express/Spring Boot → PostgreSQL, như cuongthai.com.',
    whatYouLearn: 'Giải thích trọn đường đi của một request web; đọc và chia subnet; truy vết DNS từ gốc bằng dig +trace và hiểu TTL; đọc một phiên TCP/TLS trong Wireshark; biết vì sao HTTP/2 và HTTP/3 nhanh hơn và khi nào không; cấu hình cache/CDN đúng; chọn WebSocket/SSE/polling; phân biệt cân bằng tải L4 và L7; chẩn đoán timeout, 502/504/524, lỗi DNS và lỗi chứng chỉ có phương pháp.',
    requirements: 'Biết dùng terminal cơ bản và đã viết một API web đơn giản. Nên học trước Nền tảng Web (web-foundations) và Linux & Bash; không cần kiến thức mạng trước.',
    documentsNote: 'Tài liệu chính: "Computer Networking: A Top-Down Approach" (Kurose & Ross) • "High Performance Browser Networking" (Ilya Grigorik, hpbn.co) • RFC 9293 (TCP), RFC 8446 (TLS 1.3), RFC 9000 (QUIC), RFC 9110/9113/9114 (HTTP) tại rfc-editor.org • developer.mozilla.org/docs/Web/HTTP • wireshark.org/docs • blog.cloudflare.com • Julia Evans — wizardzines.com (Networking!, DNS).',
  },
  sections: khung('netdev', [
    ['Section 0 — Why developers need networking', 'Mục 0 — Vì sao lập trình viên cần hiểu mạng', 'Mạng là gì bằng lời đời thường, nó từ đâu ra, và dựng phòng lab để đo mọi thứ.', [
      ['bat-dau-tai-day', 'Start here (1/2) — The network in everyday words, its history, and the outages that made headlines', 'Bắt đầu tại đây (1/2) — Mạng bằng lời đời thường, lịch sử, và những sự cố lên báo', 'Gói tin như bưu kiện, địa chỉ như số nhà · ARPANET 1969 → chuyển sang TCP/IP ngày 01/01/1983 → DNS 1983 → Web 1989–1991 · Sự cố Facebook 04/10/2021: rút tuyến BGP làm DNS của chính họ biến mất · Tấn công DDoS vào Dyn 21/10/2016 (botnet Mirai) làm nhiều trang lớn không phân giải được tên · Vì sao lỗi "mạng" thường là lỗi DNS, timeout hoặc chứng chỉ'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, and how to study it', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, và học thế nào', 'Tự chẩn đoán 502/504/524, DNS sai, chứng chỉ hết hạn thay vì đoán · Viết code mạng đúng: timeout, keep-alive, pool, retry · Nền cho backend, DevOps/SRE, bảo mật mạng · Khoá nên học trước/sau: web-foundations, linux-bash, nginx, network-security · Cách học: mỗi bài đều đo bằng lệnh thật, không học thuộc tầng OSI suông'],
      ['cai-dat', 'Your networking lab: tools and a test server', 'Phòng lab mạng: công cụ và một máy chủ thử', 'Cài dig, curl, mtr, tcpdump, Wireshark, nmap trên macOS/Linux · Docker Compose dựng 2 mạng ảo + nginx + một API · Bắt gói tin đầu tiên và mở trong Wireshark · Quy tắc: chỉ quét/bắt gói trên máy và mạng của chính mình'],
      ['go-dia-chi', 'What happens when you type a URL and press Enter', 'Chuyện gì xảy ra khi bạn gõ một địa chỉ rồi Enter', 'Phân giải tên → TCP → TLS → HTTP → render · Đo từng chặng bằng curl -w (time_namelookup, time_connect, time_appconnect, time_starttransfer) · Bản đồ cả khoá gắn vào từng chặng'],
    ]],
    ['Chapter 1 — Layers and packets', 'Chương 1 — Các tầng và gói tin', 'Mô hình tầng để suy nghĩ, không phải để học thuộc.', [
      ['osi-tcpip', 'OSI vs TCP/IP: the model that is actually used', 'OSI và TCP/IP: mô hình người ta thật sự dùng', 'Bảy tầng OSI vs bốn tầng TCP/IP · "L4", "L7" trong ngôn ngữ nghề nghĩa là gì · Tầng nào do ứng dụng của bạn quyết định'],
      ['dong-goi', 'Encapsulation: frames, packets, segments', 'Đóng gói: frame, packet, segment', 'Header lồng nhau · Đọc từng lớp header trong Wireshark · MTU 1500, MSS và phân mảnh'],
      ['ethernet-arp', 'Ethernet, MAC addresses and ARP', 'Ethernet, địa chỉ MAC và ARP', 'Switch học MAC · ARP hỏi "ai giữ IP này" · ip neigh · Vì sao đổi IP mà mạng vẫn nhớ máy cũ'],
      ['cong-socket', 'Ports and sockets: how one server serves many apps', 'Cổng và socket: một máy phục vụ nhiều ứng dụng thế nào', 'Bộ 5 (IP nguồn/đích, cổng nguồn/đích, giao thức) · Cổng tạm (ephemeral) · Nếu đã học linux-bash Ch9: ss -tlnp và 127.0.0.1 vs 0.0.0.0 — đi sâu vào socket ở mức nhân'],
    ]],
    ['Chapter 2 — IP addressing, routing and NAT', 'Chương 2 — Địa chỉ IP, định tuyến và NAT', 'Gói tin tìm đường đi thế nào.', [
      ['ipv4-cidr', 'IPv4, CIDR and subnetting by hand', 'IPv4, CIDR và chia subnet bằng tay', 'Nhị phân, mặt nạ mạng · /24, /16, /32 · Tính số host · Bài tập chia subnet cho lab LabFlow (web, DB, IoT)'],
      ['dinh-tuyen', 'Routing tables, gateways and traceroute', 'Bảng định tuyến, gateway và traceroute', 'ip route · Default gateway · TTL của IP giảm dần · traceroute/mtr đọc từng hop, vì sao có hop "* * *"'],
      ['nat', 'NAT, private ranges and Docker networks', 'NAT, dải IP riêng và mạng Docker', 'RFC 1918 · SNAT/DNAT · Docker bridge và -p là DNAT · Nếu đã học self-hosting Ch6: NAT ở router nhà — ở đây là NAT trong máy chủ'],
      ['ipv6', 'IPv6 for developers', 'IPv6 cho lập trình viên', 'Cú pháp và rút gọn · Dual-stack · Happy Eyeballs · Ứng dụng nghe [::] và lỗi chỉ xảy ra trên IPv6'],
      ['bgp-internet', 'How the Internet is stitched together: AS and BGP', 'Internet được nối lại thế nào: AS và BGP', 'Hệ tự trị, nhà mạng, điểm trao đổi (IXP) · BGP quảng bá tuyến · Sự cố Pakistan Telecom chặn YouTube 2008 (BGP hijack) · Sự cố Facebook 2021 nhìn từ BGP'],
    ]],
    ['Chapter 3 — DNS in depth', 'Chương 3 — DNS tới tận gốc', 'Hệ thống tên của Internet — nơi nhiều sự cố bắt đầu.', [
      ['phan-giai', 'Resolution: stub, recursive resolver, root, TLD, authoritative', 'Phân giải: stub, recursive resolver, root, TLD, authoritative', 'dig +trace từ gốc · 13 tên máy chủ gốc và anycast · /etc/resolv.conf, systemd-resolved · getent vs dig'],
      ['ban-ghi', 'Record types that developers touch', 'Các loại bản ghi lập trình viên đụng tới', 'A/AAAA/CNAME/MX/TXT/NS/SOA/CAA/SRV · CNAME ở apex và CNAME flattening · TXT cho xác minh tên miền · Trỏ khoá email-infrastructure cho SPF/DKIM/DMARC'],
      ['ttl-cache', 'TTL, caching and why DNS changes are slow', 'TTL, cache và vì sao đổi DNS lại chậm', 'Cache ở trình duyệt, OS, resolver · Negative caching (NXDOMAIN) · Hạ TTL trước khi chuyển máy chủ · Đo bằng dig lặp lại'],
      ['anycast-geodns', 'Anycast, GeoDNS and DNS-based load balancing', 'Anycast, GeoDNS và cân bằng tải bằng DNS', 'Một IP nhiều nơi · 1.1.1.1 và 8.8.8.8 · DNS round-robin và giới hạn của nó · Cloudflare proxy (đám mây cam) thay IP thật bằng IP của Cloudflare'],
      ['dns-an-toan', 'DNSSEC, DoH/DoT and DNS failure modes', 'DNSSEC, DoH/DoT và các kiểu hỏng của DNS', 'Chuỗi ký DNSSEC · DNS qua HTTPS/TLS · Hết hạn tên miền, sai NS, TTL quá dài · Chẩn đoán "máy này vào được, máy kia không"'],
    ]],
    ['Chapter 4 — TCP', 'Chương 4 — TCP', 'Giao thức tin cậy đứng sau gần như mọi request.', [
      ['bat-tay', 'The three-way handshake and connection teardown', 'Bắt tay ba bước và đóng kết nối', 'SYN, SYN-ACK, ACK trong Wireshark · FIN và RST · RTT và vì sao mỗi kết nối mới tốn tiền'],
      ['tin-cay', 'Reliability: sequence numbers, ACKs and retransmission', 'Độ tin cậy: số thứ tự, ACK và truyền lại', 'Sliding window · Truyền lại khi mất gói · Head-of-line blocking ở tầng TCP'],
      ['tac-nghen', 'Flow control and congestion control (Reno, CUBIC, BBR)', 'Kiểm soát luồng và kiểm soát tắc nghẽn (Reno, CUBIC, BBR)', 'Cửa sổ nhận · Slow start · Vì sao tải file lớn tăng tốc dần · sysctl net.ipv4.tcp_congestion_control'],
      ['trang-thai', 'Connection states, TIME_WAIT and port exhaustion', 'Trạng thái kết nối, TIME_WAIT và cạn cổng', 'ss -tan đọc trạng thái · TIME_WAIT sinh ra ở phía đóng trước · Cạn cổng tạm khi gọi API không có keep-alive · Backlog và SYN queue'],
      ['keepalive-pool', 'Keep-alive, connection pools and timeouts in your code', 'Keep-alive, pool kết nối và timeout trong code của bạn', 'HTTP agent của Node.js, HikariCP của Spring · Connect timeout vs read timeout · Nagle và TCP_NODELAY · Kết nối "chết lặng" sau NAT/firewall'],
    ]],
    ['Chapter 5 — UDP and QUIC', 'Chương 5 — UDP và QUIC', 'Khi không cần (hoặc không muốn) TCP.', [
      ['udp', 'UDP: fire and forget', 'UDP: gửi rồi quên', 'Không bắt tay, không thứ tự · DNS, VoIP, game, video trực tiếp · Tự lo mất gói'],
      ['quic', 'QUIC: transport rebuilt on UDP', 'QUIC: tầng vận chuyển dựng lại trên UDP', 'Từ Google (khoảng 2012) tới RFC 9000 (2021) · Bắt tay kèm TLS 1.3 · Nhiều luồng độc lập, hết head-of-line blocking · Connection migration khi đổi Wi-Fi sang 4G'],
      ['udp-thuc-te', 'UDP in practice: firewalls, NAT and when QUIC is blocked', 'UDP ngoài đời: tường lửa, NAT và khi QUIC bị chặn', 'Mạng công ty/trường chặn UDP 443 · Trình duyệt lùi về TCP · Đo bằng curl --http3'],
    ]],
    ['Chapter 6 — TLS and certificates', 'Chương 6 — TLS và chứng chỉ', 'Chữ S trong HTTPS, nhìn từ bên trong.', [
      ['tls-la-gi', 'What TLS guarantees, and its history from SSL to TLS 1.3', 'TLS bảo đảm điều gì, và lịch sử từ SSL tới TLS 1.3', 'Bí mật, toàn vẹn, xác thực · SSL 1995 → TLS 1.0 1999 → TLS 1.3 2018 (RFC 8446) · Heartbleed 2014 (lỗi OpenSSL) · Trỏ khoá applied-cryptography cho phần toán'],
      ['bat-tay-tls', 'The TLS 1.3 handshake, byte by byte', 'Bắt tay TLS 1.3, từng bước', 'ClientHello, SNI, ALPN · 1-RTT và 0-RTT · Đọc bằng openssl s_client và Wireshark (giải mã bằng SSLKEYLOGFILE)'],
      ['chung-chi', 'Certificates, chains and certificate authorities', 'Chứng chỉ, chuỗi tin cậy và CA', 'Leaf, intermediate, root · Let’s Encrypt (2015/2016) và ACME · Thiếu intermediate: chạy trên Chrome, hỏng trên Android cũ · Certificate Transparency'],
      ['loi-tls', 'Diagnosing TLS errors', 'Chẩn đoán lỗi TLS', 'Hết hạn, sai tên, tự ký, sai giờ hệ thống · Cloudflare Full vs Full (strict) · mTLS nhập môn · Nếu đã học nginx Ch6: cấu hình ssl_ — ở đây là cái gì xảy ra trên dây'],
    ]],
    ['Chapter 7 — HTTP from 1.1 to 3', 'Chương 7 — HTTP từ 1.1 tới 3', 'Ba thế hệ HTTP và vì sao mỗi thế hệ ra đời.', [
      ['http11', 'HTTP/1.1 on the wire', 'HTTP/1.1 trên dây', 'Nếu đã học web-foundations Ch6: method, mã trạng thái, header — ở đây đọc byte thật bằng nc/curl -v · Keep-alive, chunked · Giới hạn 6 kết nối/tên miền và các mẹo cũ (sprite, domain sharding)'],
      ['http2', 'HTTP/2: multiplexing, HPACK and why server push died', 'HTTP/2: ghép kênh, HPACK và vì sao server push bị bỏ', 'RFC 7540 (2015) → RFC 9113 · Nhiều luồng trên một kết nối · Nén header · Chrome gỡ server push (2022) · Head-of-line blocking vẫn còn ở TCP'],
      ['http3', 'HTTP/3 over QUIC', 'HTTP/3 trên QUIC', 'RFC 9114 (2022) · Alt-Svc để nâng cấp · Bật HTTP/3 trên Cloudflare · Đo trước/sau trên mạng di động'],
      ['header-quan-trong', 'Headers that change behaviour: caching, compression, CORS, security', 'Các header đổi hành vi: cache, nén, CORS, bảo mật', 'Cache-Control, ETag, Vary · gzip/brotli/zstd · CORS preflight nhìn từ mạng · HSTS · Trỏ web-security cho phần tấn công'],
      ['proxy-header', 'Proxies in the path: X-Forwarded-For, Host and the real client IP', 'Proxy trên đường đi: X-Forwarded-For, Host và IP thật của người dùng', 'Chuỗi Cloudflare → nginx → app · CF-Connecting-IP · trust proxy trong Express · Rate limit nhầm vì lấy sai IP (bài học 429 của chính cuongthai.com)'],
    ]],
    ['Chapter 8 — CDN and caching', 'Chương 8 — CDN và cache', 'Đưa nội dung lại gần người dùng.', [
      ['cdn', 'How a CDN works: edge, origin, PoP', 'CDN hoạt động thế nào: edge, origin, PoP', 'Anycast + cache ở biên · Cache hit/miss/expired trong header (cf-cache-status) · Akamai (1998) tới Cloudflare (2009/2010)'],
      ['cache-dung', 'Cache keys, TTL and invalidation done right', 'Khoá cache, TTL và xoá cache cho đúng', 'Tên file có mã băm = cache mãi mãi · stale-while-revalidate · Purge theo URL/tag · Cookie làm hỏng cache'],
      ['nginx-nuot-header', 'When your proxy overrides your cache headers', 'Khi proxy ghi đè header cache của bạn', 'Tầng nào thắng: app, nginx, CDN · Bài học thật: nginx dán no-store lên mọi response nên cache của Next.js không bao giờ có hiệu lực · Kiểm bằng curl -I ở từng tầng'],
      ['gioi-han-cdn', 'CDN limits: timeouts, body size and dynamic content', 'Giới hạn của CDN: timeout, kích thước và nội dung động', 'Cloudflare cắt request quá khoảng 100 giây (lỗi 524) · Việc dài chuyển sang chạy nền + hỏi lại · Upload lớn đi thẳng lên R2 bằng presigned URL'],
    ]],
    ['Chapter 9 — Real-time connections', 'Chương 9 — Kết nối thời gian thực', 'Giữ một đường dây mở giữa client và server.', [
      ['polling-sse', 'Polling, long polling and Server-Sent Events', 'Polling, long polling và Server-Sent Events', 'Chi phí mỗi cách · SSE qua proxy cần tắt buffering · Nếu đã học api-design Ch10: so sánh ở mức API — ở đây là cái gì xảy ra trên kết nối'],
      ['websocket', 'WebSocket: upgrade, frames and heartbeats', 'WebSocket: nâng cấp, frame và nhịp tim', 'Upgrade từ HTTP/1.1 · Ping/pong · Proxy và idle timeout cắt kết nối im lặng · Trỏ khoá socket-io'],
      ['mo-rong-ws', 'Scaling long-lived connections', 'Mở rộng kết nối sống lâu', 'Giới hạn file descriptor · Sticky session · Kết nối lại có lùi dần · Deploy mà không cắt đứt mọi người'],
      ['webrtc', 'WebRTC at a glance: NAT traversal with STUN and TURN', 'Lướt qua WebRTC: xuyên NAT bằng STUN và TURN', 'Ngang hàng qua NAT · ICE · Khi nào phải chuyển tiếp qua TURN · Ứng dụng gọi video'],
    ]],
    ['Chapter 10 — Load balancing and proxies', 'Chương 10 — Cân bằng tải và proxy', 'Chia request cho nhiều máy chủ.', [
      ['l4-l7', 'L4 vs L7 load balancing', 'Cân bằng tải L4 và L7', 'Chuyển tiếp kết nối vs hiểu HTTP · TLS kết thúc ở đâu · HAProxy, nginx, Envoy, cloud LB · Nếu đã học nginx Ch9: upstream — ở đây là bức tranh chung'],
      ['thuat-toan', 'Algorithms and health checks', 'Thuật toán chia và kiểm tra sức khoẻ', 'Round robin, least connections, consistent hashing · Health check chủ động/bị động · Rút máy ra êm (connection draining)'],
      ['reverse-forward', 'Reverse proxy, forward proxy and tunnels', 'Reverse proxy, forward proxy và đường hầm', 'Ai đứng trước ai · Cloudflare Tunnel, SSH tunnel · Bài học thật: mạng trường chặn cổng 22, mở SSH trên cổng 993'],
      ['ma-loi-gateway', 'Reading 502, 503, 504 and 524 correctly', 'Đọc đúng 502, 503, 504 và 524', 'Tầng nào sinh ra mã nào · Upstream chết, quá tải, quá chậm · Bài học thật: backend khởi động lại vô tận → 502 bảy phút'],
    ]],
    ['Chapter 11 — Tools and troubleshooting method', 'Chương 11 — Công cụ và phương pháp chẩn đoán', 'Từ triệu chứng tới nguyên nhân, không đoán mò.', [
      ['tcpdump', 'tcpdump: capture on a server without a GUI', 'tcpdump: bắt gói trên máy chủ không có giao diện', 'Bộ lọc BPF · Ghi ra .pcap rồi mở bằng Wireshark · Bắt trong container Docker (nsenter)'],
      ['wireshark', 'Wireshark: follow a stream, read a slow request', 'Wireshark: theo dõi một luồng, đọc một request chậm', 'Follow TCP stream · Biểu đồ I/O · Tìm truyền lại, cửa sổ zero, RST'],
      ['do-duong', 'Measuring the path: mtr, ping, iperf3 and curl -w', 'Đo đường đi: mtr, ping, iperf3 và curl -w', 'Mất gói ở hop nào là thật · Băng thông vs độ trễ · Mẫu curl -w dùng lại'],
      ['phuong-phap', 'A layered troubleshooting checklist', 'Bảng kiểm chẩn đoán theo tầng', 'DNS → định tuyến → cổng → TLS → HTTP → ứng dụng · "Máy tôi chạy được" · Sự cố mẫu: timeout gián đoạn do MTU, IPv6 hỏng một nửa'],
    ]],
    ['Chapter 12 — Networking in interviews', 'Chương 12 — Mạng trong phỏng vấn', 'Những câu hỏi mạng kinh điển và cách trả lời có cơ sở.', [
      ['cau-hoi', 'Classic questions and how to answer them', 'Câu hỏi kinh điển và cách trả lời', 'Gõ URL rồi Enter · TCP vs UDP · HTTP/2 vs HTTP/3 · DNS hoạt động thế nào · Trả lời bằng số đo, không bằng định nghĩa'],
      ['tinh-huong', 'Scenario rounds: diagnose from a symptom', 'Vòng tình huống: chẩn đoán từ một triệu chứng', '"Trang chậm chỉ ở một tỉnh" · "API timeout mỗi tối" · "Chỉ người dùng Android cũ lỗi chứng chỉ" · Trình bày giả thuyết → phép đo → kết luận'],
      ['chung-chi', 'Certifications worth knowing', 'Chứng chỉ nên biết', 'CompTIA Network+ · Cisco CCNA · Khi nào lập trình viên cần, khi nào không'],
    ]],
    ['Chapter 13 — Capstone: trace and tune a real request path', 'Chương 13 — Dự án cuối khoá: truy vết và tối ưu một đường đi request thật', 'Cloudflare → nginx → Docker → Express/Spring Boot → PostgreSQL/Redis → R2, đo từng chặng rồi làm nhanh hơn.', [
      ['dung-lab', 'Build the stack: Cloudflare, nginx, Docker, API, PostgreSQL, Redis', 'Dựng hệ thống: Cloudflare, nginx, Docker, API, PostgreSQL, Redis', 'Tên miền thật hoặc tên miền lab · Compose giống cuongthai.com/LabFlow · Chứng chỉ Let’s Encrypt · Bật HTTP/2 và HTTP/3'],
      ['do-duong-di', 'Measure every hop', 'Đo mọi chặng', 'curl -w từ nhiều mạng · tcpdump ở nginx và trong container · Bảng thời gian DNS/TCP/TLS/TTFB'],
      ['toi-uu', 'Optimise: keep-alive, cache, compression, CDN', 'Tối ưu: keep-alive, cache, nén, CDN', 'Keep-alive nginx → upstream · Cache tĩnh ở biên · Brotli · Ảnh lên R2 qua CDN · So sánh trước/sau'],
      ['co-y-lam-hong', 'Break it on purpose and diagnose', 'Cố tình làm hỏng rồi chẩn đoán', 'Sai bản ghi DNS · Chứng chỉ thiếu intermediate · Upstream chậm → 504 · Chặn UDP 443 · Viết báo cáo sự cố'],
      ['tong-ket', 'Review and interview story', 'Tổng kết và câu chuyện phỏng vấn', 'Checklist cả khoá · Kể dự án tối ưu đường đi request trong phỏng vấn'],
    ]],
  ]),
};
