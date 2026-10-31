/** Mục 0 · Quiz — 10 câu tình huống, đáp án rải đều (A×3 · B×2 · C×3 · D×2), số liệu lấy từ output thật của lab. */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Section 0: the network, the lab and the URL journey|||Quiz — Mục 0: mạng, phòng lab và hành trình một URL',
  slug: 'netdev-0-3-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống về các cặp dễ nhầm, sự cố thật, đọc thông báo lỗi, đọc curl -w và phòng lab.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>Quiz — the network, the lab and the URL journey</h2>
<p class="lead">Ten situations, not definitions. If you can answer them, you can name every stage of a request and read the first error message you meet.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can separate Internet/Web, IP/MAC, TCP/HTTP, bandwidth/latency.</li>
<li>I can say which layer broke in the Facebook 2021 and Dyn 2016 outages.</li>
<li>I can tell "could not resolve", "refused", "timed out" and "502" apart.</li>
<li>I can turn curl -w output into stage durations.</li>
<li>I can start the lab and capture a request inside a container.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Quiz</span>
<h2>Quiz — mạng, phòng lab và hành trình một URL</h2>
<p class="lead">Mười tình huống, không phải mười định nghĩa. Trả lời được là bạn gọi tên được mọi chặng của một request và đọc được thông báo lỗi đầu tiên mình gặp.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tách được Internet/Web, IP/MAC, TCP/HTTP, băng thông/độ trễ.</li>
<li>Tôi nói được tầng nào hỏng trong sự cố Facebook 2021 và Dyn 2016.</li>
<li>Tôi phân biệt được "could not resolve", "refused", "timed out" và "502".</li>
<li>Tôi đổi được output curl -w thành độ dài từng chặng.</li>
<li>Tôi khởi động được lab và bắt một request bên trong container.</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('curl prints <code>dns=0.003260 connect=0.011939 tls=0.026036 ttfb=0.069547</code>. How long did the TLS handshake take?', 'curl in <code>dns=0.003260 connect=0.011939 tls=0.026036 ttfb=0.069547</code>. Bắt tay TLS mất bao lâu?'),
        options: o([['26.0 ms', '26,0 ms'], ['69.5 ms', '69,5 ms'], ['14.1 ms', '14,1 ms'], ['8.7 ms', '8,7 ms']]),
        correctIndex: 2, points: 1,
        explanation: ex('curl -w values are moments since the start: TLS ended at 26.0 ms and started when TCP finished at 11.9 ms, so it took 26.0 − 11.9 = 14.1 ms. "26 ms" is the classic mistake of reading the cumulative value as a duration; 8.7 ms is the TCP stage.', 'Giá trị của curl -w là thời điểm tính từ đầu: TLS kết thúc lúc 26,0 ms và bắt đầu khi TCP xong lúc 11,9 ms, nên mất 26,0 − 11,9 = 14,1 ms. "26 ms" là lỗi kinh điển đọc giá trị cộng dồn thành độ dài; 8,7 ms là chặng TCP.'),
      },
      {
        question: q('On 4 October 2021 Facebook’s DNS servers were running, yet nobody could look up facebook.com. Why?', 'Ngày 4/10/2021 máy chủ DNS của Facebook vẫn chạy, nhưng không ai tra được facebook.com. Vì sao?'),
        options: o([['They withdrew their BGP routes, so no path led to them', 'Chúng rút các tuyến BGP, nên không còn đường nào dẫn tới chúng'], ['Their TLS certificate expired that morning', 'Chứng chỉ TLS của họ hết hạn sáng hôm đó'], ['A botnet flooded the DNS servers with traffic', 'Một botnet dội lưu lượng vào máy chủ DNS'], ['The domain name registration lapsed', 'Tên miền hết hạn đăng ký']]),
        correctIndex: 0, points: 1,
        explanation: ex('A maintenance command cut the backbone; the DNS servers, designed to stop announcing their routes when they lose the data centres, withdrew them from BGP. Alive but unreachable. The botnet option describes Dyn 2016, a different incident.', 'Một lệnh bảo trì cắt mạng lõi; máy chủ DNS được thiết kế để ngừng quảng bá tuyến khi mất liên lạc với trung tâm dữ liệu, nên rút chúng khỏi BGP. Còn sống nhưng không ai tới được. Phương án botnet là sự cố Dyn 2016, một vụ khác.'),
      },
      {
        question: q('A teammate’s script fails with <code>curl: (6) Could not resolve host: api.labflow.test</code>. Which layer do you check first?', 'Script của bạn cùng nhóm báo <code>curl: (6) Could not resolve host: api.labflow.test</code>. Bạn kiểm tầng nào trước?'),
        options: o([['TLS — the certificate chain', 'TLS — chuỗi chứng chỉ'], ['The API’s listening port', 'Cổng mà API đang nghe'], ['The router’s forwarding setting', 'Thiết lập chuyển tiếp của router'], ['DNS — the name never became an address', 'DNS — tên chưa bao giờ thành địa chỉ']]),
        correctIndex: 3, points: 1,
        explanation: ex('"Could not resolve host" (exit code 6) means curl never got an address, so nothing after DNS was even tried. Start with dig. A port problem would say "Could not connect / refused"; TLS problems mention certificates.', '"Could not resolve host" (mã 6) nghĩa là curl chưa bao giờ có địa chỉ, nên mọi thứ sau DNS còn chưa được thử. Bắt đầu bằng dig. Lỗi cổng sẽ báo "Could not connect / refused"; lỗi TLS nhắc tới chứng chỉ.'),
      },
      {
        question: q('Fetching two URLs of cuongthai.com in one curl command, the second shows <code>dns=0 connect=0 tls=0</code>. Why?', 'Lấy hai URL của cuongthai.com trong một lệnh curl, URL thứ hai có <code>dns=0 connect=0 tls=0</code>. Vì sao?'),
        options: o([['The server cached the page', 'Máy chủ đã cache trang'], ['It reused the connection opened for the first URL', 'Nó dùng lại kết nối đã mở cho URL đầu'], ['The second request went over UDP', 'Request thứ hai đi bằng UDP'], ['curl skipped the measurement for the second URL', 'curl bỏ qua việc đo cho URL thứ hai']]),
        correctIndex: 1, points: 1,
        explanation: ex('Same host ⇒ curl keeps the TCP + TLS connection alive and reuses it, so name lookup, connect and handshake cost nothing. This is keep-alive / connection pooling. A server-side cache would shorten the server stage, not the connection stages.', 'Cùng host ⇒ curl giữ kết nối TCP + TLS và dùng lại, nên tra tên, kết nối và bắt tay không tốn gì. Đó là keep-alive / pool kết nối. Cache phía máy chủ chỉ rút ngắn chặng máy chủ, không làm các chặng kết nối về không.'),
      },
      {
        question: q('Which of these uses the Internet but not the Web?', 'Cái nào dưới đây dùng Internet nhưng không dùng Web?'),
        options: o([['Opening cuongthai.com in Chrome', 'Mở cuongthai.com bằng Chrome'], ['A React app calling a REST API over HTTPS', 'Một app React gọi REST API qua HTTPS'], ['ssh into a VPS to restart nginx', 'ssh vào VPS để khởi động lại nginx'], ['Downloading a PDF with curl over HTTP', 'Tải một file PDF bằng curl qua HTTP']]),
        correctIndex: 2, points: 1,
        explanation: ex('The Web is HTTP pages and resources. SSH is its own protocol on TCP port 22 — it uses the Internet (IP, TCP) but has nothing to do with the Web. The REST API and curl downloads are HTTP, so they are Web traffic.', 'Web là các trang và tài nguyên qua HTTP. SSH là giao thức riêng trên TCP cổng 22 — dùng Internet (IP, TCP) nhưng chẳng liên quan gì tới Web. REST API và tải bằng curl đều là HTTP, nên là lưu lượng Web.'),
      },
      {
        question: q('In the lab, <code>nc -v 10.10.2.20 4999</code> fails instantly with "Connection refused", while <code>curl --max-time 3 http://10.10.9.9/</code> fails after 3 s. What does the difference tell you?', 'Trong lab, <code>nc -v 10.10.2.20 4999</code> lỗi ngay với "Connection refused", còn <code>curl --max-time 3 http://10.10.9.9/</code> lỗi sau 3 giây. Khác biệt đó nói gì?'),
        options: o([['10.10.2.20 answered (nothing listens on 4999); 10.10.9.9 never answered at all', '10.10.2.20 có trả lời (không ai nghe ở 4999); 10.10.9.9 không hề trả lời'], ['Both machines are down', 'Cả hai máy đều tắt'], ['nc is faster than curl', 'nc nhanh hơn curl'], ['Port 4999 is blocked by a firewall', 'Cổng 4999 bị tường lửa chặn']]),
        correctIndex: 0, points: 1,
        explanation: ex('A refusal is an answer: the machine is up and replied that no program listens on that port. A timeout is silence: no machine, no route, or a firewall dropping packets. A firewall that drops would make 4999 time out too, not refuse instantly.', 'Từ chối là một câu trả lời: máy đang chạy và đáp rằng không chương trình nào nghe ở cổng đó. Hết giờ là im lặng: không có máy, không có đường, hoặc tường lửa vứt gói. Tường lửa kiểu vứt gói sẽ làm 4999 cũng hết giờ chứ không từ chối ngay.'),
      },
      {
        question: q('Users get <code>502 Bad Gateway</code> from nginx. What does that status say?', 'Người dùng nhận <code>502 Bad Gateway</code> từ nginx. Mã đó nói gì?'),
        options: o([['DNS for the site is broken', 'DNS của trang bị hỏng'], ['The browser’s certificate store is outdated', 'Kho chứng chỉ của trình duyệt đã cũ'], ['The user’s Wi-Fi is too slow', 'Wi-Fi của người dùng quá chậm'], ['nginx is up, but the server behind it gave no valid answer', 'nginx còn sống, nhưng máy chủ phía sau không trả lời hợp lệ']]),
        correctIndex: 3, points: 1,
        explanation: ex('To return any status at all, the user reached nginx: DNS, TCP and TLS worked. 502 means nginx could not get a valid response from its upstream — a crashed or restarting app, or the wrong port (our /hong/ route). It is how this site’s 18 Aug 2026 incident was diagnosed.', 'Để nhận được bất kỳ mã nào, người dùng đã tới được nginx: DNS, TCP và TLS đều ổn. 502 nghĩa là nginx không lấy được câu trả lời hợp lệ từ phía sau — ứng dụng sập hoặc đang khởi động lại, hoặc sai cổng (đường /hong/ trong lab). Đó là cách sự cố 18/8/2026 của trang này được chẩn đoán.'),
      },
      {
        question: q('Why does each lab client run <code>ip route add 10.10.2.0/24 via 10.10.1.254</code> at start-up?', 'Vì sao mỗi máy khách trong lab chạy <code>ip route add 10.10.2.0/24 via 10.10.1.254</code> khi khởi động?'),
        options: o([['To give the client a second IP address', 'Để cấp cho máy khách địa chỉ IP thứ hai'], ['So packets for the server network are handed to the router', 'Để gói tới mạng máy chủ được giao cho router'], ['To turn the client into a router', 'Để biến máy khách thành router'], ['To make DNS lookups faster', 'Để tra DNS nhanh hơn']]),
        correctIndex: 1, points: 1,
        explanation: ex('A route says "to reach these addresses, go via that machine". 10.10.2.0/24 is not on the client’s own network, so without the route packets would go to Docker’s default gateway, which isolates the two networks. Turning a machine into a router is ip_forward=1, done on the router container.', 'Một tuyến nói "muốn tới dải địa chỉ này thì đi qua máy kia". 10.10.2.0/24 không thuộc mạng của máy khách, nên thiếu tuyến này gói sẽ đi tới cổng mặc định của Docker, nơi cô lập hai mạng. Biến một máy thành router là ip_forward=1, đặt trên container router.'),
      },
      {
        question: q('ping to a server shows about 8 ms. Roughly how long should the TCP connect stage take?', 'ping tới một máy chủ cho khoảng 8 ms. Chặng kết nối TCP nên mất chừng bao lâu?'),
        options: o([['About 24 ms — three packets, three trips', 'Khoảng 24 ms — ba gói, ba chuyến'], ['Under 1 ms — TCP is done locally', 'Dưới 1 ms — TCP làm cục bộ'], ['About 8 ms — one round trip', 'Khoảng 8 ms — một vòng đi-về'], ['About 4 ms — half a round trip', 'Khoảng 4 ms — nửa vòng đi-về']]),
        correctIndex: 2, points: 1,
        explanation: ex('The client sends SYN and waits for SYN-ACK: one round trip. Its final ACK goes out together with the first request, so the connect stage ≈ 1 RTT — measured 8.7 ms against a 7–10 ms ping. "Three packets = three trips" double-counts: packets in opposite directions overlap in one round trip.', 'Máy khách gửi SYN rồi chờ SYN-ACK: một vòng đi-về. ACK cuối đi cùng request đầu tiên, nên chặng kết nối ≈ 1 RTT — đo được 8,7 ms so với ping 7–10 ms. "Ba gói = ba chuyến" là đếm trùng: các gói đi hai chiều chồng lên nhau trong một vòng đi-về.'),
      },
      {
        question: q('On a Mac, <code>sudo tcpdump -i en0</code> shows none of the lab’s traffic between client and web. Why?', 'Trên máy Mac, <code>sudo tcpdump -i en0</code> không thấy chút lưu lượng nào giữa client và web của lab. Vì sao?'),
        options: o([['The lab’s networks are bridges inside Docker Desktop’s Linux VM', 'Các mạng của lab là bridge bên trong máy ảo Linux của Docker Desktop'], ['tcpdump on macOS cannot capture TCP', 'tcpdump trên macOS không bắt được TCP'], ['The lab encrypts everything with TLS', 'Lab mã hoá mọi thứ bằng TLS'], ['You must use Wireshark instead of tcpdump', 'Phải dùng Wireshark thay vì tcpdump']]),
        correctIndex: 0, points: 1,
        explanation: ex('On macOS and Windows the containers and their bridges live inside a hidden Linux VM; their packets never cross your Mac’s en0. Capture inside a container (or on the VM). The lab uses plain HTTP, so encryption is not the reason; Wireshark on en0 would see nothing either.', 'Trên macOS và Windows, container và các bridge sống trong một máy ảo Linux ẩn; gói của chúng không bao giờ đi qua en0 của máy Mac. Hãy bắt gói bên trong container (hoặc trong máy ảo). Lab dùng HTTP thường nên mã hoá không phải lý do; Wireshark trên en0 cũng chẳng thấy gì.'),
      },
    ],
  },
};
