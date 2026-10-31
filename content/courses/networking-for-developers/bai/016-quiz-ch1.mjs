/** Chương 1 · Quiz — 10 câu tình huống, đáp án rải đều (A×2 · B×3 · C×2 · D×3), dữ liệu từ output thật của lab. */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Chapter 1: layers and packets|||Quiz — Chương 1: các tầng và gói tin',
  slug: 'netdev-1-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: byte và thứ tự byte, các tầng L2–L7, đọc hex một frame thật, MTU/MSS, ARP và cache cũ, cổng, socket, 127.0.0.1 với 0.0.0.0.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Quiz — layers and packets</h2>
<p class="lead">Ten situations taken from the lab. Most can be answered by reading an output the way you learned in this chapter.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read a byte in hex and a 2-byte number in network byte order.</li>
<li>I can name the four TCP/IP layers, where each runs, and what L2/L4/L7 devices read.</li>
<li>I can find the MACs, IPs and ports inside a hex dump and explain 14 + 20 + 32 + 83.</li>
<li>I can explain MTU 1500 → MSS 1460 → 1448, and the segmentation-offload trap.</li>
<li>I can explain ARP for the next hop, a stale ARP cache, and 127.0.0.1 vs 0.0.0.0.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Quiz</span>
<h2>Quiz — các tầng và gói tin</h2>
<p class="lead">Mười tình huống lấy từ phòng lab. Phần lớn trả lời được bằng cách đọc output theo đúng cách chương này đã dạy.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được một byte ở dạng hex và một số 2 byte theo thứ tự byte của mạng.</li>
<li>Tôi kể được bốn tầng TCP/IP, mỗi tầng chạy ở đâu, và thiết bị L2/L4/L7 đọc gì.</li>
<li>Tôi tìm được MAC, IP và cổng trong một hex dump và giải thích được 14 + 20 + 32 + 83.</li>
<li>Tôi giải thích được MTU 1500 → MSS 1460 → 1448, và bẫy segmentation offload.</li>
<li>Tôi giải thích được ARP cho chặng kế, cache ARP cũ, và 127.0.0.1 với 0.0.0.0.</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('In a captured TCP header the destination port bytes are <code>01 bb</code>. Which port is it?', 'Trong header TCP bắt được, hai byte cổng đích là <code>01 bb</code>. Đó là cổng nào?'),
        options: o([['47873', '47873'], ['443', '443'], ['187', '187'], ['80', '80']]),
        correctIndex: 1, points: 1,
        explanation: ex('Ports travel big-endian: 0x01 × 256 + 0xbb = 256 + 187 = 443 (HTTPS). 47873 = 0xbb01 is what you get by reading the bytes little-endian — the mistake htons() exists to prevent.', 'Cổng đi theo big-endian: 0x01 × 256 + 0xbb = 256 + 187 = 443 (HTTPS). 47873 = 0xbb01 là kết quả khi đọc ngược kiểu little-endian — đúng cái lỗi mà htons() sinh ra để tránh.'),
      },
      {
        question: q('A server sends the JSON <code>{"name":"Nguyễn"}</code> and sets <code>Content-Length</code> to the string’s character count, 17. What happens?', 'Một máy chủ gửi JSON <code>{"name":"Nguyễn"}</code> và đặt <code>Content-Length</code> bằng số ký tự của chuỗi, 17. Chuyện gì xảy ra?'),
        options: o([['Nothing — HTTP counts characters', 'Không sao — HTTP đếm ký tự'], ['The client receives broken JSON: the body is really 19 bytes', 'Client nhận JSON hỏng: phần thân thật ra dài 19 byte'], ['The connection is refused', 'Kết nối bị từ chối'], ['nginx returns 502', 'nginx trả 502']]),
        correctIndex: 1, points: 1,
        explanation: ex('Content-Length counts bytes. In UTF-8 “ễ” is 3 bytes, so the body is 17 − 1 + 3 = 19 bytes; a client trusting 17 stops 2 bytes early and gets truncated JSON. Nothing at TCP or proxy level fails — that is why the bug is sneaky.', 'Content-Length đếm byte. Trong UTF-8 chữ “ễ” tốn 3 byte, nên phần thân dài 17 − 1 + 3 = 19 byte; client tin con số 17 sẽ dừng sớm 2 byte và nhận JSON bị cụt. Không có gì hỏng ở tầng TCP hay proxy — vì thế lỗi này rất khó thấy.'),
      },
      {
        question: q('Your team wants requests for <code>/api/*</code> to go to one server and everything else to another. Which device can do it?', 'Nhóm muốn request <code>/api/*</code> tới một máy chủ, còn lại tới máy khác. Thiết bị nào làm được?'),
        options: o([['An L2 switch', 'Một switch L2'], ['A router', 'Một router'], ['An L4 load balancer', 'Một bộ cân bằng tải L4'], ['An L7 proxy such as nginx', 'Một proxy L7 như nginx']]),
        correctIndex: 3, points: 1,
        explanation: ex('The path /api is inside the HTTP request, so only a device that reads layer 7 can route on it. An L4 balancer sees addresses and ports but not the URL; a router reads up to IP; a switch only reads MACs.', 'Đường dẫn /api nằm trong request HTTP, nên chỉ thiết bị đọc tới tầng 7 mới định tuyến theo nó được. Bộ cân bằng L4 thấy địa chỉ và cổng nhưng không thấy URL; router đọc tới IP; switch chỉ đọc MAC.'),
      },
      {
        question: q('The lab’s GET frame is 149 bytes: Ethernet 14, IPv4 20, TCP 32, data 83. Why is the TCP header 32 bytes, not 20?', 'Frame GET của lab dài 149 byte: Ethernet 14, IPv4 20, TCP 32, dữ liệu 83. Vì sao header TCP dài 32 byte chứ không phải 20?'),
        options: o([['12 bytes of options: two NOPs and timestamps', '12 byte tuỳ chọn: hai NOP và timestamp'], ['TCP always reserves 12 bytes for the checksum', 'TCP luôn dành 12 byte cho checksum'], ['The HTTP headers are counted as TCP', 'Header HTTP bị tính vào TCP'], ['The Ethernet trailer is included', 'Có tính cả phần đuôi Ethernet']]),
        correctIndex: 0, points: 1,
        explanation: ex('The basic TCP header is 20 bytes; Linux adds the timestamp option (10 bytes) padded with two NOPs to a 4-byte boundary: 32. HTTP headers are TCP payload (they are in the 83 bytes), and the checksum is a 2-byte field.', 'Header TCP cơ bản dài 20 byte; Linux thêm tuỳ chọn timestamp (10 byte) đệm thêm hai NOP cho tròn bội 4: 32. Header HTTP là phần tải của TCP (nằm trong 83 byte), còn checksum chỉ là một trường 2 byte.'),
      },
      {
        question: q('On a busy server, tshark shows a single outgoing TCP “packet” of 23 000 bytes. The MTU is 1500. Most likely?', 'Trên một máy chủ đang tải nặng, tshark hiện một “gói” TCP đi ra dài 23 000 byte. MTU là 1500. Khả năng cao nhất là gì?'),
        options: o([['The MTU is misconfigured to 23 000', 'MTU bị cấu hình sai thành 23 000'], ['IP fragmentation is happening', 'Đang xảy ra phân mảnh IP'], ['Segmentation offload: the card cuts it into MSS-sized segments after the capture point', 'Segmentation offload: card cắt nó thành các segment cỡ MSS sau điểm bắt gói'], ['The packet is corrupted', 'Gói bị hỏng']]),
        correctIndex: 2, points: 1,
        explanation: ex('With TSO/GSO the kernel hands one large chunk to the driver or card, which segments it just before transmission; tcpdump captures before that. In the lab, the 3 991-byte response appeared as one 4 057-byte frame until offload was turned off, then as 1514 + 1514 + 1161.', 'Với TSO/GSO, nhân giao một khối lớn cho driver hoặc card, nó cắt thành segment ngay trước khi phát; tcpdump bắt gói trước bước đó. Trong lab, câu trả lời 3 991 byte hiện thành một frame 4 057 byte cho tới khi tắt offload, sau đó là 1514 + 1514 + 1161.'),
      },
      {
        question: q('The lab client (10.10.1.10/24) pings 10.10.2.10 with an empty ARP cache. Which ARP request does it send?', 'Máy khách của lab (10.10.1.10/24) ping 10.10.2.10 khi cache ARP trống. Nó gửi request ARP nào?'),
        options: o([['who-has 10.10.2.10', 'who-has 10.10.2.10'], ['who-has 10.10.2.254', 'who-has 10.10.2.254'], ['None — IP routing does not need ARP', 'Không gửi — định tuyến IP không cần ARP'], ['who-has 10.10.1.254', 'who-has 10.10.1.254']]),
        correctIndex: 3, points: 1,
        explanation: ex('10.10.2.10 is not on the client’s /24, so the route says “via 10.10.1.254”: the frame goes to the router, and ARP asks for the router’s address on the client’s own link. 10.10.2.254 is the router’s other leg, unreachable by ARP from the LAN.', '10.10.2.10 không thuộc /24 của máy khách, nên tuyến nói “via 10.10.1.254”: frame gửi tới router, và ARP hỏi địa chỉ của router trên chính đường truyền của máy khách. 10.10.2.254 là chân bên kia của router, ARP từ LAN không với tới được.'),
      },
      {
        question: q('A failed server is replaced by a new one with the same IP. For about 9 seconds clients on the same LAN cannot reach it. What fixes this instantly next time?', 'Một máy chủ hỏng được thay bằng máy mới cùng IP. Khoảng 9 giây các máy cùng LAN không tới được nó. Lần sau, cách nào sửa ngay lập tức?'),
        options: o([['The new server sends a gratuitous ARP when it comes up', 'Máy mới gửi một gratuitous ARP khi vừa lên'], ['Lowering the DNS TTL', 'Hạ TTL của DNS'], ['Restarting nginx on the new server', 'Khởi động lại nginx trên máy mới'], ['Increasing the MTU', 'Tăng MTU']]),
        correctIndex: 0, points: 1,
        explanation: ex('Neighbours still map the IP to the old MAC until their entry goes DELAY → PROBE → FAILED (≈9 s in our run). A gratuitous ARP announces the new MAC and updates caches at once — failover tools do exactly this. DNS is not involved: the IP did not change.', 'Các máy hàng xóm vẫn gắn IP với MAC cũ cho tới khi mục ARP đi DELAY → PROBE → FAILED (≈9 giây trong lần chạy của ta). Gratuitous ARP thông báo MAC mới và cập nhật cache ngay — công cụ chuyển dự phòng làm đúng việc này. DNS không liên quan: IP có đổi đâu.'),
      },
      {
        question: q('Comparing the same request captured on both sides of the router, which field is identical?', 'So sánh cùng một request bắt ở hai phía router, trường nào giống hệt nhau?'),
        options: o([['Source MAC', 'MAC nguồn'], ['IP TTL', 'TTL của IP'], ['Destination IP', 'IP đích'], ['IP header checksum', 'Checksum header IP']]),
        correctIndex: 2, points: 1,
        explanation: ex('The router builds a new frame (new source and destination MACs), lowers the TTL 64 → 63, and therefore recomputes the IP checksum. The IP addresses and ports stay end to end — without NAT, which Chapter 2 introduces.', 'Router dựng frame mới (MAC nguồn và đích mới), giảm TTL 64 → 63, vì thế phải tính lại checksum IP. Địa chỉ IP và cổng giữ nguyên từ đầu tới cuối — khi không có NAT, thứ Chương 2 sẽ dạy.'),
      },
      {
        question: q('<code>ss -tanp</code> on the web server shows one <code>LISTEN 0.0.0.0:80</code> and three <code>ESTAB 10.10.2.10:80</code> lines. How does the kernel know which socket a new data segment belongs to?', '<code>ss -tanp</code> trên máy web hiện một dòng <code>LISTEN 0.0.0.0:80</code> và ba dòng <code>ESTAB 10.10.2.10:80</code>. Nhân biết một segment dữ liệu mới thuộc socket nào bằng cách nào?'),
        options: o([['By the destination port alone', 'Chỉ bằng cổng đích'], ['By the full 4-tuple: local IP:port and remote IP:port', 'Bằng cả bộ 4: IP:cổng phía mình và IP:cổng phía bên kia'], ['By the source MAC address', 'Bằng địa chỉ MAC nguồn'], ['Round-robin between the three', 'Chia vòng tròn giữa ba socket']]),
        correctIndex: 1, points: 1,
        explanation: ex('All four sockets share local port 80, so the port alone cannot decide. The kernel matches the exact local and remote address and port; only a SYN that matches no connection goes to the listener; otherwise it answers RST.', 'Cả bốn socket chung cổng 80 phía mình, nên chỉ cổng thì không quyết được. Nhân khớp chính xác địa chỉ và cổng hai đầu; chỉ gói SYN không khớp kết nối nào mới tới socket nghe; ngoài ra nó trả lời RST.'),
      },
      {
        question: q('<code>ss -tlnp</code> on the API machine shows <code>LISTEN 127.0.0.1:4000</code>. From another machine, <code>nc -v 10.10.2.20 4000</code> prints…', '<code>ss -tlnp</code> trên máy API hiện <code>LISTEN 127.0.0.1:4000</code>. Từ một máy khác, <code>nc -v 10.10.2.20 4000</code> in ra…'),
        options: o([['Connection timed out', 'Connection timed out'], ['A successful connection', 'Kết nối thành công'], ['Could not resolve host', 'Could not resolve host'], ['Connection refused', 'Connection refused']]),
        correctIndex: 3, points: 1,
        explanation: ex('The socket only listens on the loopback address, so nothing listens on 10.10.2.20:4000; the kernel answers the SYN with RST and nc reports “Connection refused” immediately — exactly the lab output. A timeout would need a firewall that drops packets.', 'Socket chỉ nghe trên địa chỉ loopback, nên không có gì nghe ở 10.10.2.20:4000; nhân trả lời gói SYN bằng RST và nc báo “Connection refused” ngay lập tức — đúng output trong lab. Muốn hết giờ chờ thì phải có tường lửa vứt gói.'),
      },
    ],
  },
};
