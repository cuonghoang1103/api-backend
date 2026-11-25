/**
 * 11.5 — Bắt gói cho người đọc log (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s11/pcap'] — tcpdump 4.99 trên android-7f3a ghi c11.pcap (55 gói, 3 giây) khi nó gọi nginx 1.24 trên lab7 (200, 404), cổng 8081 đóng
 * trên router (RST), example.com qua HTTPS; đọc trên lab7 bằng capinfos/tcpdump -r/tshark 4.2.2; đối chiếu access.log. OUT['s11/bt-11-5'] = lời giải.
 * Nguồn sự cố: Firesheep (Eric Butler, 24/10/2010, codebutler.com — GET 200 ngày 24/11/2026).
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Packet captures for log readers: tcpdump -r, Wireshark display filters, follow stream, when a capture beats a log|||Bắt gói cho người đọc log: tcpdump -r, bộ lọc hiển thị của Wireshark, follow stream, khi nào gói tin hơn log',
  slug: 'log-11-5-goi-tin',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Log là lời khai của chương trình; gói tin là băng ghi hình của dây mạng. Chạy thật: bắt gói trên một thiết bị lúc nó gọi web (200 và 404), chạm cổng đóng (RST), hỏi DNS và mở HTTPS; rồi đọc tệp .pcap bằng tcpdump -r và tshark (Wireshark dòng lệnh): lọc http.response.code >= 400, dns, tcp.flags.reset, follow stream, bảng hội thoại; đặt cạnh access log của nginx để thấy cái gì log có, cái gì chỉ gói tin mới có — và HTTPS chỉ để lộ tên miền (SNI).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>When the log is not enough, look at the wire</h2>
<p class="lead">Every log line is a program's own statement about what happened. Sometimes the program never got the request (a firewall, a crash, a wrong port), sometimes it logged too little (no source port, no headers), sometimes two programs disagree. A packet capture is the independent witness: what actually crossed the network card. You do not need to become a Wireshark expert to use it — you need to open a <code>.pcap</code>, filter it, and put one request next to one log line. That is this lesson. (Capturing and protocol analysis in depth are in the Networking for Developers course.)</p>

<h3>The everyday picture: the dashcam</h3>
<p>After a traffic accident, both drivers tell their story (their logs). The dashcam does not argue: it shows who moved when. But a dashcam records everything, including private conversations in the car, and only covers what its lens sees. Packet captures are the same: decisive, heavy, sensitive, and limited to where you put them.</p>

<h3>Step 1 — capture on the right machine, for a short time</h3>
${lenh('s11/pcap', 0)}
<p>Three rules in that one command: capture where the traffic passes (here on the client itself — on a switched network you only see your own traffic plus broadcasts), filter out your own SSH session (<code>'not port 22'</code>), and stop automatically (<code>timeout 20</code>). <code>-w file.pcap</code> saves raw packets for later; <code>-s 0</code> keeps whole packets; <code>-n</code> avoids reverse DNS. "0 packets dropped by kernel" means the capture is complete. Capture only on networks you own or are authorised to capture on — in Vietnam as everywhere, capturing other people's traffic without permission is illegal (Lesson 0.2).</p>

<h3>Step 2 — read it back with tcpdump</h3>
${lenh('s11/pcap', 1)}
${lenh('s11/pcap', 2)}
<p>One HTTP request in eight lines: <code>[S]</code> SYN, <code>[S.]</code> SYN-ACK, <code>[.]</code> ACK — the three-way handshake; <code>[P.]</code> data ("length 76: HTTP: GET / HTTP/1.1"); the server's ACK; the response ("HTTP/1.1 200 OK", 862 bytes); the client's ACK; <code>[F.]</code> FIN, closing. The timestamps let you measure: request at .345729, response at .347891 — the server needed about 2 ms.</p>
${lenh('s11/pcap', 3)}
<p><code>tcp[tcpflags] &amp; tcp-rst != 0</code> is a capture-filter (BPF) expression. A <strong>RST</strong> from 192.168.56.1:8081 means "nobody listens here" — the router actively refused. A firewall that <em>drops</em> (like ufw) sends nothing, and the client times out instead. curl's exit code 7 ("failed to connect") looks the same for both in an application log; the capture tells them apart.</p>

<h3>Step 3 — tshark: Wireshark's display filters on the command line</h3>
${lenh('s11/pcap', 4)}
${lenh('s11/pcap', 5)}
${lenh('s11/pcap', 6)}
<p>Display filters (Wireshark syntax, <code>-Y</code>) understand protocols: <code>dns</code>, <code>http.response.code &gt;= 400</code>, <code>tcp.flags.reset == 1</code>, <code>ip.addr == 192.168.56.10</code>, combined with <code>&amp;&amp;</code>, <code>||</code>, <code>!</code>. <code>-T fields -e …</code> prints chosen fields as tab-separated text — a log you build yourself from the wire. <code>http.time</code> is the time between request and response: 2.2 ms for <code>/</code>, 1.1 ms for the 404. The same filters work in the Wireshark GUI's filter bar.</p>

<h3>Step 4 — follow one conversation, then put it next to the log</h3>
${lenh('s11/pcap', 7)}
${lenh('s11/pcap', 8)}
<p>"Follow TCP stream" reassembles a conversation: here the full request (method, URL with query string, Host, User-Agent, every header) and the full response (status, Server header — <code>nginx/1.24.0 (Ubuntu)</code>, a version disclosure). Compare with nginx's access log for the same request: client IP, time to the second, request line, status, bytes, referer, user agent. Matching is by <strong>time + client IP + request line</strong> (and source port if you log <code>$remote_port</code>). What only the capture had: all request headers, the source port, the exact millisecond timing, the TCP handshake. What only the log had: what the server decided internally (which upstream, how long the app took — Lesson 10.2), and it is still there next week, while captures are short.</p>

<h3>Step 5 — HTTPS: what you can still see</h3>
${lenh('s11/pcap', 9)}
${lenh('s11/pcap', 10)}
<p>For HTTPS the capture still shows <em>who</em> talked to <em>whom</em>, when and how much, and the <strong>SNI</strong> — the server name the client put in clear text in its TLS ClientHello (<code>example.com</code>). Everything after the handshake is "Application Data". So for encrypted traffic, captures answer "did the connection happen, to which name, how big, how long" — the content must come from the endpoints' logs (or TLS keys you own, e.g. <code>SSLKEYLOGFILE</code> in a browser you control). Encrypted Client Hello (ECH), being deployed by browsers and CDNs, hides even the SNI.</p>

<h3>When a capture beats a log</h3>
<table>
<thead><tr><th>Situation</th><th>Why the log cannot answer</th></tr></thead>
<tbody>
<tr><td>"The request never arrived" vs "the app ignored it"</td><td>If the app did not receive it, it cannot log it</td></tr>
<tr><td>Timeout vs refused</td><td>Applications report both as "cannot connect"; RST vs silence is visible on the wire</td></tr>
<tr><td>TLS handshake failure</td><td>Server logs often say only "handshake failed"; the capture shows versions, ciphers, alerts</td></tr>
<tr><td>Proxy rewrites headers</td><td>Each side logs its own view; capture on both sides to see the change</td></tr>
<tr><td>Slow network vs slow app</td><td>Handshake and retransmission times vs time-to-first-byte</td></tr>
</tbody>
</table>

<h3>🛡️ Attacker's corner: Firesheep (2010)</h3>
<p>In October 2010 Eric Butler released Firesheep, a Firefox extension that captured packets on open Wi‑Fi and showed, with one click, the session cookies of everyone nearby logged in to Facebook, Twitter and other sites that encrypted the login page but not the rest — then let you use them. His point: on an open network "cookies are basically shouted through the air". It pushed the big sites to HTTPS everywhere. Today the lesson for a log reader is two-sided: your own captures may contain session cookies and passwords of plain-HTTP apps (treat <code>.pcap</code> files as secrets — Chapter 16), and any internal service still on plain HTTP (a dev API, an old admin panel) is exactly as readable as in 2010 to anyone who can capture on that segment.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Capture filter vs display filter?" — BPF at capture time (<code>tcp port 80</code>) reduces what is saved; Wireshark display filter (<code>http.response.code &gt;= 500</code>) selects what is shown.</li>
<li>"A client says the server is down, the server log shows nothing. What do you do?" — capture on the server interface: SYN arriving? RST or nothing? Then firewall/listening socket.</li>
<li>"What can you see in HTTPS traffic without keys?" — IPs, ports, timing, sizes, SNI (unless ECH), certificate (TLS 1.2).</li>
<li>"Why should pcap files be handled carefully?" — they contain everything, including credentials and personal data.</li>
</ul>

<h3>Real-world situations</h3>
<ul>
<li><strong>Integration with a customer's API fails only from the office.</strong> A 20-second capture on your machine shows a RST after the ClientHello — a TLS-inspecting proxy in the office network — and ends a week of emails.</li>
<li><strong>At an outsourcing company</strong> you usually may not capture on shared networks; you may on your own laptop and on project servers you administer. Ask before you capture, and delete captures when done.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>From <code>c11.pcap</code>, list every DNS question (frame, name, type). Why two questions for one name?</li>
<li>List every connection attempt (SYN without ACK) with destination and port, counted.</li>
<li>Print time, URI and user agent of each HTTP request, and match each one to an access-log line.</li>
<li>On your own machine: capture 30 seconds while opening one HTTP-only page of your own (e.g. your Lab 10 nginx) and follow the stream.</li>
</ol>
<p><strong>Pass:</strong> the solutions below run on the lab capture.</p>
<details>
<summary><strong>Solution (open only after trying)</strong></summary>
${lenh('s11/bt-11-5', 0)}
${lenh('s11/bt-11-5', 1)}
${lenh('s11/bt-11-5', 2)}
<p>(1) <code>example.com</code> type 1 (A) and type 28 (AAAA): the resolver asks for IPv4 and IPv6 in parallel. (2) Two to lab7:80, one to the router:8081 (the RST), one to example.com:443. (3) 12:20:07.345 <code>/</code> and 12:20:07.360 <code>/khong-co?ma=abc</code>, both <code>curl/8.5.0</code> — the two access-log lines at 12:20:07 with the same paths and agent. (4) You see your own request and response headers in clear text.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['pcap', 'File of raw captured packets (tcpdump -w, Wireshark).'],
  ['Capture filter (BPF)', 'Filter applied while capturing: tcp port 80, host 10.0.0.1.'],
  ['Display filter', 'Wireshark/tshark protocol-aware filter: http.response.code >= 400.'],
  ['SYN / RST / FIN', 'TCP flags: open, refuse/abort, close.'],
  ['Follow TCP stream', 'Reassembled bytes of one TCP conversation.'],
  ['SNI', 'Server name sent in clear in the TLS ClientHello.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Capture where the traffic is, briefly, with a filter, only where you are allowed.</li>
<li>tcpdump -r for a quick look; tshark -Y and -T fields for questions.</li>
<li>Match capture to log by time + IP + request line.</li>
<li>RST vs silence, missing requests, TLS failures: captures answer what logs cannot.</li>
<li>HTTPS shows who, when, how much and the SNI — not the content.</li>
</ul>
${nguon('📘', 'Wireshark User’s Guide — Building display filter expressions', 'Fields, comparison operators, combining expressions', 'https://www.wireshark.org/docs/wsug_html_chunked/ChWorkBuildDisplayFilterSection.html')}
${nguon('🛡️', 'Eric Butler — Firesheep (24 Oct 2010)', 'Session hijacking on open Wi‑Fi', 'https://codebutler.com/2010/10/24/firesheep/')}
${lienKet({ khoa: 'networking-for-developers', bai: 'netdev-11-1-tcpdump', title: 'Networking for Developers 11.1 — tcpdump', sub: 'Capturing in depth: interfaces, filters, ring buffers', cta: 'Open' })}
${lienKet({ khoa: 'networking-for-developers', bai: 'netdev-11-2-wireshark', title: 'Networking for Developers 11.2 — Wireshark', sub: 'Protocol analysis in depth', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Khi log không đủ, nhìn xuống dây mạng</h2>
<p class="lead">Mỗi dòng log là lời khai của chính chương trình về chuyện đã xảy ra. Có lúc chương trình chẳng hề nhận được request (bị tường lửa chặn, sập, sai cổng), có lúc nó ghi quá ít (không có cổng nguồn, không có header), có lúc hai chương trình khai khác nhau. Một bản bắt gói là nhân chứng độc lập: thứ thực sự đã đi qua card mạng. Bạn không cần thành chuyên gia Wireshark để dùng nó — chỉ cần mở một tệp <code>.pcap</code>, lọc, và đặt một request cạnh một dòng log. Đó là toàn bộ bài này. (Bắt gói và phân tích giao thức chuyên sâu nằm ở khoá Networking for Developers.)</p>

<h3>Liên tưởng đời thường: camera hành trình</h3>
<p>Sau một vụ va chạm, hai tài xế đều kể chuyện của mình (log của họ). Camera hành trình thì không cãi: nó cho thấy ai di chuyển lúc nào. Nhưng camera ghi mọi thứ, cả những câu chuyện riêng trong xe, và chỉ thấy những gì ống kính hướng tới. Bắt gói cũng vậy: có sức quyết định, nặng, nhạy cảm, và chỉ giới hạn ở chỗ bạn đặt nó.</p>

<h3>Bước 1 — bắt đúng máy, trong thời gian ngắn</h3>
${lenh('s11/pcap', 0)}
<p>Ba quy tắc trong đúng một lệnh: bắt ở chỗ lưu lượng đi qua (ở đây ngay trên máy khách — trong mạng dùng switch bạn chỉ thấy lưu lượng của mình cộng gói broadcast), bỏ phiên SSH của chính mình (<code>'not port 22'</code>), và tự dừng (<code>timeout 20</code>). <code>-w tệp.pcap</code> lưu gói thô để đọc sau; <code>-s 0</code> giữ nguyên gói; <code>-n</code> để khỏi tra DNS ngược. "0 packets dropped by kernel" nghĩa là bản bắt đầy đủ. Chỉ bắt gói trên mạng của bạn hoặc nơi bạn được phép — ở Việt Nam cũng như mọi nơi, bắt lưu lượng của người khác khi không được phép là vi phạm pháp luật (Bài 0.2).</p>

<h3>Bước 2 — đọc lại bằng tcpdump</h3>
${lenh('s11/pcap', 1)}
${lenh('s11/pcap', 2)}
<p>Một request HTTP trong tám dòng: <code>[S]</code> SYN, <code>[S.]</code> SYN-ACK, <code>[.]</code> ACK — bắt tay ba bước; <code>[P.]</code> dữ liệu ("length 76: HTTP: GET / HTTP/1.1"); ACK của máy chủ; câu trả lời ("HTTP/1.1 200 OK", 862 byte); ACK của máy khách; <code>[F.]</code> FIN, đóng kết nối. Dấu thời gian cho phép đo: request lúc .345729, trả lời lúc .347891 — máy chủ mất chừng 2 ms.</p>
${lenh('s11/pcap', 3)}
<p><code>tcp[tcpflags] &amp; tcp-rst != 0</code> là biểu thức lọc lúc bắt (BPF). Một gói <strong>RST</strong> từ 192.168.56.1:8081 nghĩa là "không ai nghe ở đây" — router chủ động từ chối. Tường lửa kiểu <em>drop</em> (như ufw) thì chẳng gửi gì, và máy khách chờ đến hết giờ. Mã thoát 7 của curl ("failed to connect") trong log ứng dụng trông y như nhau cho cả hai trường hợp; bản bắt gói thì phân biệt được.</p>

<h3>Bước 3 — tshark: bộ lọc hiển thị của Wireshark trên dòng lệnh</h3>
${lenh('s11/pcap', 4)}
${lenh('s11/pcap', 5)}
${lenh('s11/pcap', 6)}
<p>Bộ lọc hiển thị (cú pháp Wireshark, <code>-Y</code>) hiểu giao thức: <code>dns</code>, <code>http.response.code &gt;= 400</code>, <code>tcp.flags.reset == 1</code>, <code>ip.addr == 192.168.56.10</code>, ghép bằng <code>&amp;&amp;</code>, <code>||</code>, <code>!</code>. <code>-T fields -e …</code> in các trường bạn chọn dưới dạng chữ cách nhau bằng tab — một cuốn log bạn tự dựng từ dây mạng. <code>http.time</code> là khoảng giữa request và response: 2,2 ms cho <code>/</code>, 1,1 ms cho trang 404. Cùng các bộ lọc này gõ được vào ô lọc của Wireshark có giao diện.</p>

<h3>Bước 4 — theo một cuộc hội thoại, rồi đặt cạnh log</h3>
${lenh('s11/pcap', 7)}
${lenh('s11/pcap', 8)}
<p>"Follow TCP stream" ráp lại một cuộc hội thoại: ở đây là trọn request (phương thức, URL kèm query string, Host, User-Agent, mọi header) và trọn response (mã trạng thái, header Server — <code>nginx/1.24.0 (Ubuntu)</code>, lộ phiên bản). So với access log của nginx cho cùng request: IP khách, thời gian tới giây, dòng request, mã trạng thái, số byte, referer, user agent. Ghép theo <strong>thời gian + IP khách + dòng request</strong> (và cổng nguồn nếu bạn ghi <code>$remote_port</code>). Chỉ bản bắt gói có: mọi header của request, cổng nguồn, thời gian tới mili giây, bắt tay TCP. Chỉ log có: những gì máy chủ quyết định bên trong (upstream nào, ứng dụng mất bao lâu — Bài 10.2), và nó vẫn còn đó tuần sau, còn bản bắt gói thì ngắn.</p>

<h3>Bước 5 — HTTPS: còn thấy được gì</h3>
${lenh('s11/pcap', 9)}
${lenh('s11/pcap', 10)}
<p>Với HTTPS, bản bắt gói vẫn cho thấy <em>ai</em> nói chuyện với <em>ai</em>, lúc nào, bao nhiêu, và <strong>SNI</strong> — tên máy chủ mà máy khách ghi rõ chữ trong ClientHello của TLS (<code>example.com</code>). Mọi thứ sau bắt tay là "Application Data". Vậy với lưu lượng mã hoá, bắt gói trả lời được "kết nối có xảy ra không, tới tên nào, lớn bao nhiêu, kéo dài bao lâu" — nội dung thì phải lấy từ log ở hai đầu (hoặc khoá TLS của chính bạn, ví dụ <code>SSLKEYLOGFILE</code> trong trình duyệt bạn kiểm soát). Encrypted Client Hello (ECH), đang được trình duyệt và CDN triển khai, giấu luôn cả SNI.</p>

<h3>Khi nào gói tin hơn log</h3>
<table>
<thead><tr><th>Tình huống</th><th>Vì sao log không trả lời được</th></tr></thead>
<tbody>
<tr><td>"Request không hề tới" hay "ứng dụng bỏ qua nó"</td><td>Ứng dụng không nhận được thì không thể ghi</td></tr>
<tr><td>Hết giờ hay bị từ chối</td><td>Ứng dụng báo cả hai là "không kết nối được"; RST hay im lặng thì thấy trên dây</td></tr>
<tr><td>Bắt tay TLS hỏng</td><td>Log máy chủ thường chỉ ghi "handshake failed"; bản bắt cho thấy phiên bản, bộ mã, cảnh báo</td></tr>
<tr><td>Proxy sửa header</td><td>Mỗi bên ghi góc nhìn của mình; bắt ở cả hai phía để thấy chỗ đổi</td></tr>
<tr><td>Mạng chậm hay ứng dụng chậm</td><td>Thời gian bắt tay và truyền lại so với thời gian tới byte đầu tiên</td></tr>
</tbody>
</table>

<h3>🛡️ Góc hacker: Firesheep (2010)</h3>
<p>Tháng 10/2010, Eric Butler phát hành Firesheep, một tiện ích Firefox bắt gói trên Wi‑Fi mở và chỉ bằng một cú nhấp đã hiện ra cookie phiên của mọi người xung quanh đang đăng nhập Facebook, Twitter và các trang chỉ mã hoá trang đăng nhập mà không mã hoá phần còn lại — rồi cho bạn dùng luôn cookie đó. Ý của anh: trên mạng mở "cookie gần như được hét lên giữa không trung". Nó đẩy các trang lớn chuyển sang HTTPS toàn bộ. Ngày nay bài học cho người đọc log có hai mặt: chính bản bắt gói của bạn có thể chứa cookie phiên và mật khẩu của các ứng dụng HTTP thường (hãy coi tệp <code>.pcap</code> là bí mật — Chương 16), và mọi dịch vụ nội bộ còn chạy HTTP thường (một API dev, một trang quản trị cũ) vẫn đọc được y như năm 2010 với bất kỳ ai bắt được gói trên đoạn mạng đó.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Bộ lọc lúc bắt khác bộ lọc hiển thị thế nào?" — BPF lúc bắt (<code>tcp port 80</code>) giảm thứ được lưu; bộ lọc hiển thị Wireshark (<code>http.response.code &gt;= 500</code>) chọn thứ được hiện.</li>
<li>"Khách nói máy chủ chết, log máy chủ không có gì. Bạn làm gì?" — bắt gói trên giao diện của máy chủ: SYN có tới không? RST hay im lặng? Rồi tới tường lửa/cổng đang nghe.</li>
<li>"Không có khoá, nhìn lưu lượng HTTPS thấy được gì?" — IP, cổng, thời gian, kích thước, SNI (trừ khi có ECH), chứng chỉ (TLS 1.2).</li>
<li>"Vì sao tệp pcap phải giữ cẩn thận?" — nó chứa tất cả, kể cả thông tin đăng nhập và dữ liệu cá nhân.</li>
</ul>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>Tích hợp với API của khách chỉ hỏng khi gọi từ văn phòng.</strong> 20 giây bắt gói trên máy bạn cho thấy một RST ngay sau ClientHello — một proxy soi TLS trong mạng văn phòng — và chấm dứt một tuần email qua lại.</li>
<li><strong>Ở công ty outsourcing</strong> thường bạn không được bắt gói trên mạng dùng chung; được làm trên laptop của mình và trên máy chủ dự án do bạn quản trị. Hỏi trước khi bắt, xoá bản bắt khi xong việc.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Từ <code>c11.pcap</code>, liệt kê mọi câu hỏi DNS (số khung, tên, loại). Vì sao một tên lại có hai câu hỏi?</li>
<li>Liệt kê mọi lần thử kết nối (SYN không có ACK) kèm đích và cổng, có đếm.</li>
<li>In thời gian, URI và user agent của từng request HTTP, rồi ghép mỗi cái với một dòng access log.</li>
<li>Trên máy của bạn: bắt 30 giây trong lúc mở một trang chỉ có HTTP của chính bạn (ví dụ nginx Lab 10) rồi follow stream.</li>
</ol>
<p><strong>Đạt khi:</strong> làm ra như lời giải chạy thật trên bản bắt của lab dưới đây.</p>
<details>
<summary><strong>Lời giải (chỉ mở sau khi đã thử)</strong></summary>
${lenh('s11/bt-11-5', 0)}
${lenh('s11/bt-11-5', 1)}
${lenh('s11/bt-11-5', 2)}
<p>(1) <code>example.com</code> loại 1 (A) và loại 28 (AAAA): bộ phân giải hỏi song song IPv4 và IPv6. (2) Hai lần tới lab7:80, một lần tới router:8081 (cái RST), một lần tới example.com:443. (3) 12:20:07.345 <code>/</code> và 12:20:07.360 <code>/khong-co?ma=abc</code>, đều <code>curl/8.5.0</code> — khớp hai dòng access log lúc 12:20:07 cùng đường dẫn và user agent. (4) Bạn thấy rõ chữ header request và response của chính mình.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['pcap', 'Tệp chứa gói tin thô đã bắt (tcpdump -w, Wireshark).'],
  ['Bộ lọc lúc bắt (BPF)', 'Lọc trong lúc bắt: tcp port 80, host 10.0.0.1.'],
  ['Bộ lọc hiển thị', 'Bộ lọc hiểu giao thức của Wireshark/tshark: http.response.code >= 400.'],
  ['SYN / RST / FIN', 'Cờ TCP: mở, từ chối/huỷ, đóng.'],
  ['Follow TCP stream', 'Các byte được ráp lại của một cuộc hội thoại TCP.'],
  ['SNI', 'Tên máy chủ gửi rõ chữ trong ClientHello của TLS.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bắt ở chỗ lưu lượng đi qua, trong thời gian ngắn, có bộ lọc, và chỉ ở nơi được phép.</li>
<li>tcpdump -r để xem nhanh; tshark -Y và -T fields để trả lời câu hỏi.</li>
<li>Ghép bản bắt với log theo thời gian + IP + dòng request.</li>
<li>RST hay im lặng, request mất tích, TLS hỏng: gói tin trả lời được thứ log không trả lời được.</li>
<li>HTTPS cho thấy ai, khi nào, bao nhiêu và SNI — không cho thấy nội dung.</li>
</ul>
${nguon('📘', 'Wireshark User’s Guide — Building display filter expressions', 'Trường, toán tử so sánh, ghép biểu thức', 'https://www.wireshark.org/docs/wsug_html_chunked/ChWorkBuildDisplayFilterSection.html')}
${nguon('🛡️', 'Eric Butler — Firesheep (24/10/2010)', 'Chiếm phiên trên Wi‑Fi mở', 'https://codebutler.com/2010/10/24/firesheep/')}
${lienKet({ khoa: 'networking-for-developers', bai: 'netdev-11-1-tcpdump', title: 'Networking for Developers 11.1 — tcpdump', sub: 'Bắt gói chuyên sâu: giao diện, bộ lọc, ghi vòng', cta: 'Mở bài' })}
${lienKet({ khoa: 'networking-for-developers', bai: 'netdev-11-2-wireshark', title: 'Networking for Developers 11.2 — Wireshark', sub: 'Phân tích giao thức chuyên sâu', cta: 'Mở bài' })}
</div>
`,
};
