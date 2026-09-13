/**
 * NWC303 — Network Connectivity (Kết nối mạng máy tính). Ngành An toàn thông
 * tin FPTU, Kỳ 3. Khung 8 chương theo giáo trình chuẩn quốc tế:
 * Kurose &amp; Ross "Computer Networking: A Top-Down Approach", Tanenbaum
 * "Computer Networks", Cisco CCNA, RFC. Song ngữ VI+EN + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('nwc303-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Kurose & Ross, Tanenbaum), CCNA, RFC, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">NWC303 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Network Connectivity</strong> — layered models, the application/transport/network/link layers, routing, LAN switching and basic security — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for NWC303 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://gaia.cs.umass.edu/kurose_ross/index.php" target="_blank" rel="noopener"><em>Computer Networking: A Top-Down Approach</em> — Kurose &amp; Ross</a> (companion site with free slides)</li>
<li><a href="https://en.wikipedia.org/wiki/Computer_Networks_(Tanenbaum_book)" target="_blank" rel="noopener"><em>Computer Networks</em> — Tanenbaum &amp; Wetherall</a></li>
<li><a href="https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html" target="_blank" rel="noopener">Cisco CCNA</a> — industry certification track</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.rfc-editor.org/" target="_blank" rel="noopener">RFC Editor</a> — the actual Internet standards (HTTP, TCP, IP, DNS)</li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP" target="_blank" rel="noopener">MDN — HTTP</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@PracticalNetworking" target="_blank" rel="noopener">Practical Networking</a> — clear networking fundamentals</li>
<li><a href="https://www.youtube.com/@NetworkChuck" target="_blank" rel="noopener">NetworkChuck</a> — CCNA-oriented, hands-on</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.wireshark.org/" target="_blank" rel="noopener">Wireshark</a> — capture and inspect real packets</li>
<li><a href="https://www.netacad.com/courses/packet-tracer" target="_blank" rel="noopener">Cisco Packet Tracer</a> — simulate networks &amp; devices</li>
<li><a href="https://www.gns3.com/" target="_blank" rel="noopener">GNS3</a> — network emulation with real OS images</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the layered model (OSI vs TCP/IP), encapsulation, and how HTTP/DNS ride on TCP/UDP.</li>
<li><strong>Addressing</strong> — IPv4/IPv6, subnet masks &amp; CIDR, NAT; practise subnetting by hand.</li>
<li><strong>Go deeper</strong> — routing (RIP/OSPF/BGP), Ethernet switching, ARP and VLANs.</li>
<li><strong>Job-ready</strong> — build topologies in Packet Tracer and read live packets in Wireshark.</li>
</ol></div>`,
    `<span class="eyebrow">NWC303 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Kết nối mạng máy tính</strong> — mô hình phân tầng, các tầng ứng dụng/giao vận/mạng/liên kết, định tuyến, chuyển mạch LAN và an ninh cơ bản — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của NWC303 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://gaia.cs.umass.edu/kurose_ross/index.php" target="_blank" rel="noopener"><em>Computer Networking: A Top-Down Approach</em> — Kurose &amp; Ross</a> (trang kèm slide miễn phí)</li>
<li><a href="https://en.wikipedia.org/wiki/Computer_Networks_(Tanenbaum_book)" target="_blank" rel="noopener"><em>Computer Networks</em> — Tanenbaum &amp; Wetherall</a></li>
<li><a href="https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html" target="_blank" rel="noopener">Cisco CCNA</a> — lộ trình chứng chỉ nghề</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.rfc-editor.org/" target="_blank" rel="noopener">RFC Editor</a> — chuẩn Internet gốc (HTTP, TCP, IP, DNS)</li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP" target="_blank" rel="noopener">MDN — HTTP</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@PracticalNetworking" target="_blank" rel="noopener">Practical Networking</a> — nền tảng mạng giảng rõ ràng</li>
<li><a href="https://www.youtube.com/@NetworkChuck" target="_blank" rel="noopener">NetworkChuck</a> — hướng CCNA, thực hành</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.wireshark.org/" target="_blank" rel="noopener">Wireshark</a> — bắt và soi gói tin thật</li>
<li><a href="https://www.netacad.com/courses/packet-tracer" target="_blank" rel="noopener">Cisco Packet Tracer</a> — mô phỏng mạng &amp; thiết bị</li>
<li><a href="https://www.gns3.com/" target="_blank" rel="noopener">GNS3</a> — giả lập mạng với ảnh OS thật</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — mô hình phân tầng (OSI vs TCP/IP), đóng gói, và cách HTTP/DNS chạy trên TCP/UDP.</li>
<li><strong>Địa chỉ</strong> — IPv4/IPv6, subnet mask &amp; CIDR, NAT; luyện chia subnet bằng tay.</li>
<li><strong>Đào sâu</strong> — định tuyến (RIP/OSPF/BGP), chuyển mạch Ethernet, ARP và VLAN.</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng topo trong Packet Tracer và đọc gói tin thật trong Wireshark.</li>
</ol></div>`,
  ]]);

const intro = doc('nwc303-0-1-overview', 'Course overview: Network Connectivity|||Tổng quan: Kết nối mạng máy tính',
  'Mạng máy tính là gì; vì sao dùng mô hình phân tầng; lộ trình 4 bước: mô hình & tầng → địa chỉ IP → định tuyến & LAN → an ninh mạng.',
  [[
    `<span class="eyebrow">NWC303 · Lesson 0.1 · Overview</span>
<h2>Network Connectivity</h2>
<p class="lead">This course explains <strong>how computers talk to each other</strong> — from two machines on a cable to the global Internet. You will learn the <strong>layered model</strong> that organises all networking, follow a message down through the layers, and see how addressing, routing and switching move a packet from source to destination.</p>
<h3>Why layers?</h3>
<p>Networking is too complex for one big program. We split it into <strong>layers</strong>, each with one job and a clean interface to the layer above and below. A web browser does not care about copper or fibre; the wire does not care about HTTP. That separation — the core idea of the <strong>OSI</strong> and <strong>TCP/IP</strong> models — is what lets the Internet scale.</p>
<h3>Roadmap</h3>
<p>Layered models &amp; encapsulation → application layer (HTTP, DNS) → transport (TCP/UDP) → network &amp; IP addressing → routing → link layer &amp; LAN switching → devices &amp; infrastructure → basic security. Bilingual, with worked examples and a quiz per chapter.</p>
<div class="callout"><span class="badge">Top-down</span> Following Kurose &amp; Ross, we start from apps you already use (the web, email) and work down to the wire — the layer you touch daily first.</div>`,
    `<span class="eyebrow">NWC303 · Bài 0.1 · Tổng quan</span>
<h2>Kết nối mạng máy tính</h2>
<p class="lead">Môn này giải thích <strong>máy tính nói chuyện với nhau thế nào</strong> — từ hai máy nối bằng dây cáp đến Internet toàn cầu. Bạn sẽ học <strong>mô hình phân tầng</strong> tổ chức toàn bộ mạng, đi theo một thông điệp xuống qua các tầng, và thấy cách địa chỉ, định tuyến, chuyển mạch đưa gói tin từ nguồn tới đích.</p>
<h3>Vì sao phân tầng?</h3>
<p>Mạng quá phức tạp cho một chương trình duy nhất. Ta chia thành các <strong>tầng</strong>, mỗi tầng một việc và một giao diện gọn với tầng trên và tầng dưới. Trình duyệt web không quan tâm dây đồng hay cáp quang; sợi cáp không quan tâm HTTP. Sự tách bạch đó — ý tưởng cốt lõi của mô hình <strong>OSI</strong> và <strong>TCP/IP</strong> — là thứ giúp Internet mở rộng được.</p>
<h3>Lộ trình</h3>
<p>Mô hình phân tầng &amp; đóng gói → tầng ứng dụng (HTTP, DNS) → tầng giao vận (TCP/UDP) → tầng mạng &amp; địa chỉ IP → định tuyến → tầng liên kết &amp; chuyển mạch LAN → thiết bị &amp; hạ tầng → an ninh cơ bản. Song ngữ, có ví dụ mẫu và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Từ trên xuống</span> Theo Kurose &amp; Ross, ta bắt đầu từ ứng dụng bạn đã dùng (web, email) rồi đi xuống dây — tầng bạn chạm hằng ngày trước tiên.</div>`,
  ]]);

const c1 = doc('nwc303-1-1-layers', '1.1 — Networks & layered models|||1.1 — Tổng quan mạng & mô hình phân tầng',
  'Internet là mạng của các mạng; chuyển mạch gói; OSI 7 tầng vs TCP/IP; đóng gói (encapsulation) và tên đơn vị dữ liệu mỗi tầng.',
  [[
    `<span class="eyebrow">NWC303 · Chapter 1 · Lesson 1.1</span>
<h2>Networks &amp; layered models</h2>
<h3>What the Internet is</h3>
<p>The Internet is a <strong>network of networks</strong>: end systems (hosts, phones, servers) connected by <strong>links</strong> and <strong>packet switches</strong> (routers, switches). Data is chopped into <strong>packets</strong> that are forwarded hop by hop — this is <strong>packet switching</strong>, and it is why one link can be shared by many conversations.</p>
<h3>OSI vs TCP/IP</h3>
<ul>
<li><strong>OSI (7 layers):</strong> Physical, Data Link, Network, Transport, Session, Presentation, Application — a teaching reference model.</li>
<li><strong>TCP/IP (the model we actually run):</strong> Link, Network (IP), Transport (TCP/UDP), Application — OSI collapsed to what the Internet uses.</li>
</ul>
<h3>Encapsulation</h3>
<p>As data goes <em>down</em> the stack, each layer wraps it with a <strong>header</strong>; on the way <em>up</em> the receiver strips them off. The data unit gets a different name at each layer.</p>
<pre><code>App data
 + Transport header  -> Segment   (TCP/UDP)
 + Network header    -> Datagram  (IP packet)
 + Link header/trailer -> Frame   (Ethernet)
 -> bits on the wire
</code></pre>
<div class="callout"><span class="badge">One rule to remember</span> Each layer talks only to its peer layer on the other host. Headers are added and removed in strict last-in-first-out order.</div>`,
    `<span class="eyebrow">NWC303 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan mạng &amp; mô hình phân tầng</h2>
<h3>Internet là gì</h3>
<p>Internet là <strong>mạng của các mạng</strong>: các hệ thống đầu cuối (máy chủ, điện thoại, máy tính) nối với nhau bằng <strong>đường truyền</strong> và <strong>bộ chuyển mạch gói</strong> (router, switch). Dữ liệu được cắt thành <strong>gói tin (packet)</strong> chuyển tiếp từng chặng — đó là <strong>chuyển mạch gói</strong>, và là lý do một đường truyền phục vụ được nhiều cuộc trao đổi.</p>
<h3>OSI vs TCP/IP</h3>
<ul>
<li><strong>OSI (7 tầng):</strong> Vật lý, Liên kết dữ liệu, Mạng, Giao vận, Phiên, Trình diễn, Ứng dụng — mô hình tham chiếu để dạy.</li>
<li><strong>TCP/IP (mô hình thực chạy):</strong> Liên kết, Mạng (IP), Giao vận (TCP/UDP), Ứng dụng — OSI rút gọn về đúng thứ Internet dùng.</li>
</ul>
<h3>Đóng gói (encapsulation)</h3>
<p>Khi dữ liệu đi <em>xuống</em> ngăn xếp, mỗi tầng bọc thêm một <strong>header</strong>; đi <em>lên</em> thì bên nhận bóc dần ra. Đơn vị dữ liệu có tên khác nhau ở mỗi tầng.</p>
<pre><code>Dữ liệu ứng dụng
 + header giao vận  -> Segment   (TCP/UDP)
 + header mạng      -> Datagram  (gói IP)
 + header/trailer liên kết -> Frame (Ethernet)
 -> bit trên dây
</code></pre>
<div class="callout"><span class="badge">Một quy tắc cần nhớ</span> Mỗi tầng chỉ nói chuyện với tầng ngang hàng ở máy bên kia. Header được thêm rồi bóc theo đúng thứ tự vào-sau-ra-trước.</div>`,
  ]]);

const c1q = quiz('nwc303-quiz-1', 'Quiz 1 — Layered models|||Quiz 1 — Mô hình phân tầng', [
  { id: 'q1', question: 'Mô hình OSI có mấy tầng?', options: ['4', '5', '7', '10'], correctIndex: 2, explanation: 'OSI có 7 tầng: Vật lý, Liên kết, Mạng, Giao vận, Phiên, Trình diễn, Ứng dụng.' },
  { id: 'q2', question: 'Ở tầng giao vận, đơn vị dữ liệu (PDU) gọi là gì?|||At the transport layer, the data unit (PDU) is called?', options: ['Frame', 'Segment', 'Datagram (gói IP)|||Datagram (IP packet)', 'Bit'], correctIndex: 1, explanation: 'Giao vận = Segment; Mạng = Datagram/packet; Liên kết = Frame.' },
  { id: 'q3', question: 'Đóng gói (encapsulation) là gì?|||What is encapsulation?', options: ['Mã hoá dữ liệu|||Encrypting the data', 'Mỗi tầng thêm header khi dữ liệu đi xuống ngăn xếp|||Each layer adds a header as data goes down the stack', 'Nén gói tin|||Compressing the packet', 'Chia mạng thành subnet|||Splitting the network into subnets'], correctIndex: 1, explanation: 'Đi xuống thì mỗi tầng bọc thêm header; đi lên thì bóc ra.' },
]);

const c2 = doc('nwc303-2-1-application', '2.1 — The application layer|||2.1 — Tầng ứng dụng',
  'HTTP (request/response, không trạng thái, cổng 80/443), DNS (tên → IP), SMTP (email), FTP; mô hình client-server vs P2P.',
  [[
    `<span class="eyebrow">NWC303 · Chapter 2 · Lesson 2.1</span>
<h2>The application layer</h2>
<h3>HTTP — the web</h3>
<p><strong>HTTP</strong> is a simple <strong>request/response</strong> protocol: the client asks, the server answers. It is <strong>stateless</strong> (each request stands alone) and runs on TCP port <strong>80</strong>, or <strong>443</strong> for HTTPS.</p>
<pre><code>GET /index.html HTTP/1.1
Host: example.com

HTTP/1.1 200 OK
Content-Type: text/html
...body...
</code></pre>
<h3>DNS — the phone book</h3>
<p><strong>DNS</strong> translates a human name (example.com) into an IP address. It is a <strong>distributed hierarchy</strong> (root → .com → example.com) and usually rides on UDP port <strong>53</strong> for speed.</p>
<h3>Other app protocols</h3>
<ul>
<li><strong>SMTP</strong> — sends email between mail servers.</li>
<li><strong>FTP</strong> — transfers files.</li>
</ul>
<h3>Client-server vs P2P</h3>
<ul>
<li><strong>Client-server:</strong> an always-on server answers many clients (the web, email).</li>
<li><strong>P2P:</strong> peers talk directly, each both client and server (BitTorrent) — scales with users, no central server.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> The application layer defines the <em>messages</em>; it hands them to the transport layer to actually deliver.</div>`,
    `<span class="eyebrow">NWC303 · Chương 2 · Bài 2.1</span>
<h2>Tầng ứng dụng</h2>
<h3>HTTP — web</h3>
<p><strong>HTTP</strong> là giao thức <strong>yêu cầu/phản hồi</strong> đơn giản: client hỏi, server trả lời. Nó <strong>không trạng thái</strong> (mỗi yêu cầu độc lập) và chạy trên TCP cổng <strong>80</strong>, hoặc <strong>443</strong> cho HTTPS.</p>
<pre><code>GET /index.html HTTP/1.1
Host: example.com

HTTP/1.1 200 OK
Content-Type: text/html
...thân...
</code></pre>
<h3>DNS — danh bạ</h3>
<p><strong>DNS</strong> dịch tên người đọc (example.com) thành địa chỉ IP. Nó là <strong>cây phân cấp phân tán</strong> (gốc → .com → example.com) và thường chạy trên UDP cổng <strong>53</strong> cho nhanh.</p>
<h3>Giao thức ứng dụng khác</h3>
<ul>
<li><strong>SMTP</strong> — gửi email giữa các máy chủ thư.</li>
<li><strong>FTP</strong> — truyền tệp.</li>
</ul>
<h3>Client-server vs P2P</h3>
<ul>
<li><strong>Client-server:</strong> một server luôn bật phục vụ nhiều client (web, email).</li>
<li><strong>P2P:</strong> các máy nói trực tiếp, mỗi máy vừa client vừa server (BitTorrent) — mở rộng theo số người dùng, không cần máy chủ trung tâm.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Tầng ứng dụng định nghĩa <em>thông điệp</em>; nó giao cho tầng giao vận lo việc chuyển đi thật.</div>`,
  ]]);

const c2q = quiz('nwc303-quiz-2', 'Quiz 2 — Application layer|||Quiz 2 — Tầng ứng dụng', [
  { id: 'q1', question: 'Giao thức nào dịch tên miền thành địa chỉ IP?|||Which protocol translates a domain name into an IP address?', options: ['HTTP', 'DNS', 'SMTP', 'FTP'], correctIndex: 1, explanation: 'DNS ánh xạ tên (example.com) sang IP; thường dùng UDP cổng 53.' },
  { id: 'q2', question: 'HTTP dùng cổng TCP nào cho HTTPS?|||Which TCP port does HTTP use for HTTPS?', options: ['21', '25', '53', '443'], correctIndex: 3, explanation: 'HTTP dùng 80; HTTPS dùng 443. FTP 21, SMTP 25, DNS 53.' },
  { id: 'q3', question: '"Không trạng thái" (stateless) của HTTP nghĩa là?|||HTTP being "stateless" means?', options: ['Không cần mạng|||No network needed', 'Mỗi yêu cầu độc lập, server không tự nhớ yêu cầu trước|||Each request stands alone; the server keeps no memory of prior ones', 'Không dùng TCP|||It does not use TCP', 'Luôn mã hoá|||It is always encrypted'], correctIndex: 1, explanation: 'Mỗi request HTTP độc lập; trạng thái phải nhờ cookie/session.' },
]);

const c3 = doc('nwc303-3-1-transport', '3.1 — The transport layer|||3.1 — Tầng giao vận',
  'TCP vs UDP; cổng (port) & socket; bắt tay 3 bước; kiểm soát luồng (flow control) và kiểm soát tắc nghẽn (congestion control).',
  [[
    `<span class="eyebrow">NWC303 · Chapter 3 · Lesson 3.1</span>
<h2>The transport layer</h2>
<h3>TCP vs UDP</h3>
<ul>
<li><strong>TCP</strong> — reliable, connection-oriented, ordered. It guarantees delivery with acknowledgements and retransmission. Used by the web, email, file transfer.</li>
<li><strong>UDP</strong> — connectionless, no guarantees, minimal overhead. Fast, good for live video, games, DNS, where a lost packet is better than a late one.</li>
</ul>
<h3>Ports &amp; sockets</h3>
<p>An IP address finds the <em>host</em>; a <strong>port</strong> number finds the right <em>process</em> on it. The pair (IP address + port) is a <strong>socket</strong> — that is how the OS multiplexes many connections onto one machine.</p>
<h3>The 3-way handshake</h3>
<pre><code>Client            Server
  --- SYN ---------&gt;
  &lt;-- SYN-ACK ------
  --- ACK ---------&gt;
  (connection established)
</code></pre>
<h3>Flow vs congestion control</h3>
<ul>
<li><strong>Flow control</strong> — do not overwhelm the <em>receiver</em> (a sliding window sized to its buffer).</li>
<li><strong>Congestion control</strong> — do not overwhelm the <em>network</em> (slow down when packets are lost).</li>
</ul>
<div class="callout"><span class="badge">Choose the tool</span> Need every byte, in order? TCP. Need it fast and can tolerate loss? UDP.</div>`,
    `<span class="eyebrow">NWC303 · Chương 3 · Bài 3.1</span>
<h2>Tầng giao vận</h2>
<h3>TCP vs UDP</h3>
<ul>
<li><strong>TCP</strong> — tin cậy, hướng kết nối, đúng thứ tự. Bảo đảm giao nhận nhờ báo nhận (ACK) và truyền lại. Web, email, truyền tệp dùng nó.</li>
<li><strong>UDP</strong> — phi kết nối, không bảo đảm, ít phụ phí. Nhanh, hợp video trực tiếp, game, DNS — nơi mất một gói còn hơn nhận trễ.</li>
</ul>
<h3>Cổng (port) &amp; socket</h3>
<p>Địa chỉ IP tìm ra <em>máy</em>; số <strong>cổng (port)</strong> tìm ra đúng <em>tiến trình</em> trên máy đó. Cặp (địa chỉ IP + cổng) là một <strong>socket</strong> — cách hệ điều hành ghép nhiều kết nối vào một máy.</p>
<h3>Bắt tay 3 bước</h3>
<pre><code>Client            Server
  --- SYN ---------&gt;
  &lt;-- SYN-ACK ------
  --- ACK ---------&gt;
  (kết nối thiết lập)
</code></pre>
<h3>Kiểm soát luồng vs tắc nghẽn</h3>
<ul>
<li><strong>Kiểm soát luồng</strong> — đừng làm ngập <em>bên nhận</em> (cửa sổ trượt vừa với bộ đệm của nó).</li>
<li><strong>Kiểm soát tắc nghẽn</strong> — đừng làm ngập <em>mạng</em> (chậm lại khi có gói bị mất).</li>
</ul>
<div class="callout"><span class="badge">Chọn công cụ</span> Cần đủ mọi byte, đúng thứ tự? Chọn TCP. Cần nhanh và chịu được mất gói? Chọn UDP.</div>`,
  ]]);

const c3q = quiz('nwc303-quiz-3', 'Quiz 3 — Transport layer|||Quiz 3 — Tầng giao vận', [
  { id: 'q1', question: 'Giao thức nào tin cậy, hướng kết nối, dùng bắt tay 3 bước?|||Which protocol is reliable, connection-oriented and uses a 3-way handshake?', options: ['UDP', 'TCP', 'IP', 'ARP'], correctIndex: 1, explanation: 'TCP tin cậy, có ACK/truyền lại và bắt tay SYN, SYN-ACK, ACK.' },
  { id: 'q2', question: 'Bắt tay 3 bước của TCP theo thứ tự nào?|||What is the order of the TCP 3-way handshake?', options: ['ACK, SYN, SYN-ACK', 'SYN, SYN-ACK, ACK', 'SYN, ACK, FIN', 'FIN, ACK, SYN'], correctIndex: 1, explanation: 'Client gửi SYN, server trả SYN-ACK, client gửi ACK.' },
  { id: 'q3', question: 'Kiểm soát tắc nghẽn (congestion control) nhằm bảo vệ ai?|||What does congestion control protect?', options: ['Bên nhận|||The receiver', 'Mạng (không làm ngập đường truyền)|||The network (avoid flooding the links)', 'Ổ cứng|||The disk', 'Địa chỉ IP|||The IP address'], correctIndex: 1, explanation: 'Kiểm soát luồng bảo vệ bên nhận; kiểm soát tắc nghẽn bảo vệ mạng.' },
]);

const c4 = doc('nwc303-4-1-network-ip', '4.1 — The network layer & IP|||4.1 — Tầng mạng & IP',
  'IPv4/IPv6, cấu trúc địa chỉ IP (phần mạng/host), subnet mask & ký hiệu CIDR, chia subnet, địa chỉ riêng và NAT.',
  [[
    `<span class="eyebrow">NWC303 · Chapter 4 · Lesson 4.1</span>
<h2>The network layer &amp; IP</h2>
<h3>IPv4 and IPv6</h3>
<ul>
<li><strong>IPv4</strong> — 32-bit address, written as four decimals (192.168.1.10). About 4.3 billion addresses — now exhausted.</li>
<li><strong>IPv6</strong> — 128-bit address in hex groups (2001:db8::1). Vastly more addresses; the long-term fix.</li>
</ul>
<h3>Network vs host, subnet mask, CIDR</h3>
<p>An IP address splits into a <strong>network part</strong> and a <strong>host part</strong>. The <strong>subnet mask</strong> says where the split is; <strong>CIDR</strong> writes it as a slash count (/24 = the first 24 bits are network).</p>
<pre><code>IP:   192.168.1.10  /24
Mask: 255.255.255.0
Net:  192.168.1.0        (network address)
Hosts: 192.168.1.1 - 192.168.1.254
Bcast: 192.168.1.255     (broadcast)
</code></pre>
<h3>Private addresses &amp; NAT</h3>
<p>Ranges like <strong>192.168.x.x</strong> and <strong>10.x.x.x</strong> are <strong>private</strong> — reused inside every home/office and not routable on the Internet. <strong>NAT</strong> (Network Address Translation) on the router rewrites these to one public IP on the way out, stretching the scarce IPv4 space.</p>
<div class="callout"><span class="badge">The network layer job</span> Give every host a global address (IP) and move a datagram from any network to any other — best-effort, no guarantees (that is TCP&#39;s job above).</div>`,
    `<span class="eyebrow">NWC303 · Chương 4 · Bài 4.1</span>
<h2>Tầng mạng &amp; IP</h2>
<h3>IPv4 và IPv6</h3>
<ul>
<li><strong>IPv4</strong> — địa chỉ 32 bit, viết thành bốn số thập phân (192.168.1.10). Khoảng 4,3 tỷ địa chỉ — nay đã cạn.</li>
<li><strong>IPv6</strong> — địa chỉ 128 bit dạng các nhóm hex (2001:db8::1). Số địa chỉ khổng lồ; là lời giải lâu dài.</li>
</ul>
<h3>Mạng vs host, subnet mask, CIDR</h3>
<p>Một địa chỉ IP chia thành <strong>phần mạng</strong> và <strong>phần host</strong>. <strong>Subnet mask</strong> chỉ ra ranh giới chia; <strong>CIDR</strong> viết gọn bằng số sau dấu gạch chéo (/24 = 24 bit đầu là phần mạng).</p>
<pre><code>IP:   192.168.1.10  /24
Mask: 255.255.255.0
Net:  192.168.1.0        (địa chỉ mạng)
Host: 192.168.1.1 - 192.168.1.254
Bcast: 192.168.1.255     (quảng bá)
</code></pre>
<h3>Địa chỉ riêng &amp; NAT</h3>
<p>Các dải như <strong>192.168.x.x</strong> và <strong>10.x.x.x</strong> là <strong>riêng (private)</strong> — dùng lại trong mọi nhà/văn phòng, không định tuyến được trên Internet. <strong>NAT</strong> (biên dịch địa chỉ mạng) ở router viết lại chúng thành một IP công cộng khi ra ngoài, kéo dài không gian IPv4 khan hiếm.</p>
<div class="callout"><span class="badge">Việc của tầng mạng</span> Cấp cho mỗi host một địa chỉ toàn cục (IP) và chuyển một datagram từ mạng bất kỳ tới mạng bất kỳ — nỗ lực tối đa, không bảo đảm (bảo đảm là việc của TCP ở trên).</div>`,
  ]]);

const c4q = quiz('nwc303-quiz-4', 'Quiz 4 — Network layer & IP|||Quiz 4 — Tầng mạng & IP', [
  { id: 'q1', question: 'Địa chỉ IPv4 dài bao nhiêu bit?|||How many bits is an IPv4 address?', options: ['16', '32', '64', '128'], correctIndex: 1, explanation: 'IPv4 dài 32 bit; IPv6 dài 128 bit.' },
  { id: 'q2', question: 'Ký hiệu CIDR /24 tương đương subnet mask nào?|||CIDR /24 equals which subnet mask?', options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'], correctIndex: 2, explanation: '/24 = 24 bit mạng = 255.255.255.0, còn 254 host dùng được.' },
  { id: 'q3', question: 'NAT dùng để làm gì?|||What is NAT used for?', options: ['Mã hoá gói tin|||Encrypt packets', 'Dịch địa chỉ riêng sang một IP công cộng|||Translate private addresses to one public IP', 'Định tuyến giữa các AS|||Route between autonomous systems', 'Dịch tên miền|||Resolve domain names'], correctIndex: 1, explanation: 'NAT viết lại IP riêng thành IP công cộng, tiết kiệm địa chỉ IPv4.' },
]);

const c5 = doc('nwc303-5-1-routing', '5.1 — Routing|||5.1 — Định tuyến',
  'Router và bảng chuyển tiếp; thuật toán distance-vector (Bellman-Ford) vs link-state (Dijkstra); giao thức RIP, OSPF, BGP.',
  [[
    `<span class="eyebrow">NWC303 · Chapter 5 · Lesson 5.1</span>
<h2>Routing</h2>
<h3>What a router does</h3>
<p>A <strong>router</strong> joins networks and forwards each packet toward its destination using a <strong>forwarding table</strong> (destination network → next hop). <strong>Routing</strong> is how that table is built and kept up to date.</p>
<h3>Two families of algorithm</h3>
<ul>
<li><strong>Distance-vector</strong> (Bellman-Ford) — each router tells its neighbours its whole table; routes are chosen by hop count. Simple, slower to converge. Example: <strong>RIP</strong>.</li>
<li><strong>Link-state</strong> (Dijkstra) — each router floods a map of its own links to everyone, then each computes shortest paths. Faster, scales better. Example: <strong>OSPF</strong>.</li>
</ul>
<h3>Inside vs between networks</h3>
<pre><code>RIP  / OSPF -> INSIDE one organisation (intra-domain)
BGP         -> BETWEEN organisations / ISPs (inter-domain)
</code></pre>
<p><strong>BGP</strong> is the routing protocol of the Internet backbone — it stitches together tens of thousands of <strong>autonomous systems</strong> (independently run networks).</p>
<div class="callout"><span class="badge">Forwarding vs routing</span> Forwarding is the fast, per-packet lookup; routing is the slower background process that fills the table.</div>`,
    `<span class="eyebrow">NWC303 · Chương 5 · Bài 5.1</span>
<h2>Định tuyến</h2>
<h3>Router làm gì</h3>
<p>Một <strong>router</strong> nối các mạng và chuyển tiếp từng gói về phía đích nhờ <strong>bảng chuyển tiếp</strong> (mạng đích → chặng kế tiếp). <strong>Định tuyến</strong> là cách bảng đó được dựng và cập nhật.</p>
<h3>Hai họ thuật toán</h3>
<ul>
<li><strong>Distance-vector</strong> (Bellman-Ford) — mỗi router báo cả bảng của mình cho hàng xóm; chọn đường theo số chặng. Đơn giản, hội tụ chậm. Ví dụ: <strong>RIP</strong>.</li>
<li><strong>Link-state</strong> (Dijkstra) — mỗi router loan bản đồ các liên kết của chính nó cho mọi router, rồi ai nấy tự tính đường ngắn nhất. Nhanh hơn, mở rộng tốt hơn. Ví dụ: <strong>OSPF</strong>.</li>
</ul>
<h3>Trong vs giữa các mạng</h3>
<pre><code>RIP  / OSPF -> TRONG một tổ chức (nội miền)
BGP         -> GIỮA các tổ chức / ISP (liên miền)
</code></pre>
<p><strong>BGP</strong> là giao thức định tuyến của xương sống Internet — nó khâu hàng chục nghìn <strong>hệ tự trị (autonomous system)</strong> (các mạng vận hành độc lập) lại với nhau.</p>
<div class="callout"><span class="badge">Chuyển tiếp vs định tuyến</span> Chuyển tiếp là tra cứu nhanh theo từng gói; định tuyến là tiến trình nền chậm hơn để điền bảng.</div>`,
  ]]);

const c5q = quiz('nwc303-quiz-5', 'Quiz 5 — Routing|||Quiz 5 — Định tuyến', [
  { id: 'q1', question: 'Giao thức nào định tuyến GIỮA các hệ tự trị (xương sống Internet)?|||Which protocol routes BETWEEN autonomous systems (the Internet backbone)?', options: ['RIP', 'OSPF', 'BGP', 'ARP'], correctIndex: 2, explanation: 'BGP là giao thức liên miền; RIP/OSPF là nội miền.' },
  { id: 'q2', question: 'OSPF thuộc họ thuật toán nào?|||OSPF belongs to which algorithm family?', options: ['Distance-vector', 'Link-state', 'Bắt tay 3 bước|||3-way handshake', 'Chuyển mạch gói|||Packet switching'], correctIndex: 1, explanation: 'OSPF là link-state (Dijkstra); RIP là distance-vector.' },
  { id: 'q3', question: 'Bảng chuyển tiếp (forwarding table) của router ánh xạ gì?|||A router forwarding table maps what?', options: ['Tên miền → IP|||Domain name → IP', 'Mạng đích → chặng kế tiếp|||Destination network → next hop', 'IP → MAC', 'Cổng → tiến trình|||Port → process'], correctIndex: 1, explanation: 'Bảng chuyển tiếp: mạng đích ánh xạ tới chặng kế tiếp (next hop).' },
]);

const c6 = doc('nwc303-6-1-link-lan', '6.1 — Link layer & LAN|||6.1 — Tầng liên kết & LAN',
  'Ethernet & frame, địa chỉ MAC, switch vs hub, ARP (IP → MAC), VLAN.',
  [[
    `<span class="eyebrow">NWC303 · Chapter 6 · Lesson 6.1</span>
<h2>Link layer &amp; LAN</h2>
<h3>Ethernet &amp; MAC addresses</h3>
<p>Inside a <strong>LAN</strong>, hosts talk with <strong>Ethernet frames</strong>. Every network card has a globally unique <strong>MAC address</strong> — a 48-bit hardware address (aa:bb:cc:dd:ee:ff). While an IP address can change, the MAC is burned in.</p>
<h3>Switch vs hub</h3>
<ul>
<li><strong>Hub</strong> — dumb; repeats every bit to every port (one shared collision domain).</li>
<li><strong>Switch</strong> — smart; <em>learns</em> which MAC is on which port and forwards a frame only to the right port.</li>
</ul>
<h3>ARP — IP to MAC</h3>
<p>To send inside a LAN a host needs the destination MAC, but it only knows the IP. <strong>ARP</strong> resolves one to the other.</p>
<pre><code>Host A -> 192.168.1.5 (same LAN)
 ARP request (broadcast): who has 192.168.1.5 ?
 ARP reply: 192.168.1.5 is at aa:bb:cc:dd:ee:ff
 A now frames the packet to that MAC
</code></pre>
<h3>VLAN</h3>
<p>A <strong>VLAN</strong> splits one physical switch into several logical LANs — separating, say, staff and guest traffic for security, without extra hardware.</p>
<div class="callout"><span class="badge">L2 vs L3</span> Switches move frames by MAC inside a LAN (layer 2); routers move packets by IP between networks (layer 3).</div>`,
    `<span class="eyebrow">NWC303 · Chương 6 · Bài 6.1</span>
<h2>Tầng liên kết &amp; LAN</h2>
<h3>Ethernet &amp; địa chỉ MAC</h3>
<p>Trong một <strong>LAN</strong>, các host trao đổi bằng <strong>khung Ethernet (frame)</strong>. Mỗi card mạng có một <strong>địa chỉ MAC</strong> duy nhất toàn cầu — địa chỉ phần cứng 48 bit (aa:bb:cc:dd:ee:ff). IP có thể đổi, còn MAC gắn cứng.</p>
<h3>Switch vs hub</h3>
<ul>
<li><strong>Hub</strong> — ngờ nghệch; lặp mọi bit ra mọi cổng (một miền đụng độ chung).</li>
<li><strong>Switch</strong> — thông minh; <em>học</em> MAC nào ở cổng nào và chỉ chuyển frame tới đúng cổng.</li>
</ul>
<h3>ARP — IP sang MAC</h3>
<p>Để gửi trong LAN, host cần MAC đích nhưng chỉ biết IP. <strong>ARP</strong> chuyển IP thành MAC.</p>
<pre><code>Host A -> 192.168.1.5 (cùng LAN)
 ARP request (quảng bá): ai giữ 192.168.1.5 ?
 ARP reply: 192.168.1.5 ở aa:bb:cc:dd:ee:ff
 A đóng frame gói tin tới MAC đó
</code></pre>
<h3>VLAN</h3>
<p>Một <strong>VLAN</strong> chia một switch vật lý thành nhiều LAN logic — tách, ví dụ, lưu lượng nhân viên và khách để tăng an toàn, mà không cần thêm phần cứng.</p>
<div class="callout"><span class="badge">L2 vs L3</span> Switch chuyển frame theo MAC trong LAN (tầng 2); router chuyển gói theo IP giữa các mạng (tầng 3).</div>`,
  ]]);

const c6q = quiz('nwc303-quiz-6', 'Quiz 6 — Link layer & LAN|||Quiz 6 — Tầng liên kết & LAN', [
  { id: 'q1', question: 'Giao thức ARP làm gì?|||What does ARP do?', options: ['Dịch tên miền sang IP|||Resolve a domain name to an IP', 'Ánh xạ địa chỉ IP sang địa chỉ MAC|||Map an IP address to a MAC address', 'Định tuyến giữa các mạng|||Route between networks', 'Mã hoá frame|||Encrypt frames'], correctIndex: 1, explanation: 'ARP tìm MAC từ IP trong cùng một LAN.' },
  { id: 'q2', question: 'Địa chỉ MAC dài bao nhiêu bit?|||How many bits is a MAC address?', options: ['32', '48', '64', '128'], correctIndex: 1, explanation: 'MAC là địa chỉ phần cứng 48 bit, gắn cứng trên card mạng.' },
  { id: 'q3', question: 'Khác biệt chính giữa switch và hub?|||Main difference between a switch and a hub?', options: ['Switch chỉ chuyển frame tới đúng cổng nhờ học bảng MAC|||A switch forwards a frame only to the right port using a learned MAC table', 'Switch chậm hơn hub|||A switch is slower than a hub', 'Hub định tuyến theo IP|||A hub routes by IP', 'Không có khác biệt|||There is no difference'], correctIndex: 0, explanation: 'Switch học MAC và chuyển đúng cổng; hub lặp mọi bit ra mọi cổng.' },
]);

const c7 = doc('nwc303-7-1-devices-infra', '7.1 — Devices & network infrastructure|||7.1 — Thiết bị & hạ tầng mạng',
  'Hub/switch/router theo tầng; các topology (star, bus, ring, mesh); môi trường truyền (cáp xoắn, cáp quang, WiFi); thiết kế mạng phân cấp.',
  [[
    `<span class="eyebrow">NWC303 · Chapter 7 · Lesson 7.1</span>
<h2>Devices &amp; network infrastructure</h2>
<h3>Devices by layer</h3>
<pre><code>Hub    (L1) - repeats bits to all ports (one collision domain)
Switch (L2) - forwards frames by MAC (learns a table)
Router (L3) - forwards packets by IP, joins networks
</code></pre>
<h3>Topologies</h3>
<ul>
<li><strong>Star</strong> — every host to a central switch (today&#39;s norm; easy to manage).</li>
<li><strong>Bus / Ring</strong> — older shared-media layouts.</li>
<li><strong>Mesh</strong> — many redundant links; resilient but costly (used in backbones).</li>
</ul>
<h3>Transmission media</h3>
<ul>
<li><strong>Twisted pair</strong> (copper, Cat5e/Cat6) — cheap, short runs.</li>
<li><strong>Fibre optic</strong> — light in glass; huge bandwidth, long distance.</li>
<li><strong>Wireless</strong> (WiFi, 802.11) — convenient, shared radio medium.</li>
</ul>
<h3>Hierarchical design</h3>
<p>Enterprise networks are built in tiers — <strong>access</strong> (users plug in), <strong>distribution</strong> (aggregate &amp; apply policy), <strong>core</strong> (fast backbone). This keeps large networks manageable and scalable.</p>
<div class="callout"><span class="badge">Right device, right layer</span> If two hosts are on the same IP subnet, a switch is enough; crossing subnets needs a router.</div>`,
    `<span class="eyebrow">NWC303 · Chương 7 · Bài 7.1</span>
<h2>Thiết bị &amp; hạ tầng mạng</h2>
<h3>Thiết bị theo tầng</h3>
<pre><code>Hub    (L1) - lặp bit ra mọi cổng (một miền đụng độ)
Switch (L2) - chuyển frame theo MAC (học bảng)
Router (L3) - chuyển gói theo IP, nối các mạng
</code></pre>
<h3>Các topology</h3>
<ul>
<li><strong>Sao (star)</strong> — mọi host về một switch trung tâm (chuẩn ngày nay; dễ quản lý).</li>
<li><strong>Bus / Vòng (ring)</strong> — kiểu chia sẻ môi trường cũ.</li>
<li><strong>Lưới (mesh)</strong> — nhiều liên kết dự phòng; bền nhưng tốn kém (dùng ở xương sống).</li>
</ul>
<h3>Môi trường truyền</h3>
<ul>
<li><strong>Cáp xoắn đôi</strong> (đồng, Cat5e/Cat6) — rẻ, cự ly ngắn.</li>
<li><strong>Cáp quang</strong> — ánh sáng trong thuỷ tinh; băng thông lớn, đi xa.</li>
<li><strong>Không dây</strong> (WiFi, 802.11) — tiện, môi trường vô tuyến dùng chung.</li>
</ul>
<h3>Thiết kế phân cấp</h3>
<p>Mạng doanh nghiệp dựng theo tầng — <strong>truy nhập (access)</strong> (người dùng cắm vào), <strong>phân phối (distribution)</strong> (gom &amp; áp chính sách), <strong>lõi (core)</strong> (xương sống tốc độ cao). Nhờ vậy mạng lớn vẫn quản lý và mở rộng được.</p>
<div class="callout"><span class="badge">Đúng thiết bị, đúng tầng</span> Hai host cùng một subnet IP thì một switch là đủ; vượt subnet phải có router.</div>`,
  ]]);

const c7q = quiz('nwc303-quiz-7', 'Quiz 7 — Devices & infrastructure|||Quiz 7 — Thiết bị & hạ tầng', [
  { id: 'q1', question: 'Thiết bị nào hoạt động ở tầng 3 (mạng) và nối các mạng khác nhau?|||Which device works at layer 3 (network) and joins different networks?', options: ['Hub', 'Switch', 'Router', 'Cáp quang|||Fibre cable'], correctIndex: 2, explanation: 'Router (L3) chuyển gói theo IP giữa các mạng; switch (L2) trong LAN.' },
  { id: 'q2', question: 'Môi trường truyền nào có băng thông lớn và đi xa nhất?|||Which medium offers the highest bandwidth over long distances?', options: ['Cáp xoắn đôi|||Twisted pair', 'Cáp quang|||Fibre optic', 'WiFi', 'Cáp đồng trục|||Coaxial'], correctIndex: 1, explanation: 'Cáp quang truyền ánh sáng, băng thông lớn và cự ly dài nhất.' },
  { id: 'q3', question: 'Topology phổ biến nhất trong LAN hiện đại là?|||The most common topology in modern LANs is?', options: ['Bus', 'Vòng (ring)|||Ring', 'Sao (star) quanh switch|||Star around a switch', 'Lưới đầy đủ|||Full mesh'], correctIndex: 2, explanation: 'LAN hiện đại dùng topology sao: mọi host nối về switch trung tâm.' },
]);

const c8 = doc('nwc303-8-1-security', '8.1 — Basic network security|||8.1 — An ninh mạng cơ bản',
  'Bộ ba CIA; tường lửa (firewall); VPN; tấn công phổ biến (DoS/DDoS, MITM, giả mạo, nghe lén); TLS/HTTPS.',
  [[
    `<span class="eyebrow">NWC303 · Chapter 8 · Lesson 8.1</span>
<h2>Basic network security</h2>
<h3>The CIA triad</h3>
<p>Security aims at three goals: <strong>Confidentiality</strong> (only the right people read it), <strong>Integrity</strong> (it is not altered), <strong>Availability</strong> (it is there when needed).</p>
<h3>Firewalls &amp; VPNs</h3>
<ul>
<li><strong>Firewall</strong> — filters traffic by rules (allow/deny by IP, port, state). A <em>stateful</em> firewall tracks connections, not just single packets.</li>
<li><strong>VPN</strong> — builds an encrypted <strong>tunnel</strong> across the public Internet, so a remote user appears to be on the internal network safely.</li>
</ul>
<h3>Common attacks</h3>
<ul>
<li><strong>DoS / DDoS</strong> — flood a service so it cannot serve real users.</li>
<li><strong>Man-in-the-middle (MITM)</strong> — sit between two parties and read/alter traffic.</li>
<li><strong>Spoofing</strong> — forge a source address (IP/MAC).</li>
<li><strong>Sniffing</strong> — passively capture traffic on a shared medium.</li>
</ul>
<h3>TLS / HTTPS</h3>
<pre><code>Client hello -> supported ciphers
Server hello -> certificate (public key)
Key exchange -> shared session key
=> encrypted application data (HTTPS)
</code></pre>
<p><strong>TLS</strong> gives confidentiality (encryption), integrity (tamper detection) and authentication (certificates) — turning HTTP into <strong>HTTPS</strong>.</p>
<div class="callout"><span class="badge">Defence in depth</span> No single control is enough — layer firewalls, encryption, authentication and monitoring together.</div>`,
    `<span class="eyebrow">NWC303 · Chương 8 · Bài 8.1</span>
<h2>An ninh mạng cơ bản</h2>
<h3>Bộ ba CIA</h3>
<p>An ninh nhắm ba mục tiêu: <strong>Bí mật (Confidentiality)</strong> (chỉ đúng người đọc được), <strong>Toàn vẹn (Integrity)</strong> (không bị sửa), <strong>Sẵn sàng (Availability)</strong> (luôn có khi cần).</p>
<h3>Tường lửa &amp; VPN</h3>
<ul>
<li><strong>Tường lửa (firewall)</strong> — lọc lưu lượng theo luật (cho/chặn theo IP, cổng, trạng thái). Firewall <em>có trạng thái</em> theo dõi cả kết nối, không chỉ từng gói.</li>
<li><strong>VPN</strong> — dựng một <strong>đường hầm</strong> mã hoá xuyên Internet công cộng, để người dùng từ xa như đang ở trong mạng nội bộ một cách an toàn.</li>
</ul>
<h3>Tấn công phổ biến</h3>
<ul>
<li><strong>DoS / DDoS</strong> — làm ngập dịch vụ để nó không phục vụ được người thật.</li>
<li><strong>Người đứng giữa (MITM)</strong> — chen vào giữa hai bên để đọc/sửa lưu lượng.</li>
<li><strong>Giả mạo (spoofing)</strong> — mạo địa chỉ nguồn (IP/MAC).</li>
<li><strong>Nghe lén (sniffing)</strong> — bắt lưu lượng thụ động trên môi trường dùng chung.</li>
</ul>
<h3>TLS / HTTPS</h3>
<pre><code>Client hello -> bộ mã hỗ trợ
Server hello -> chứng chỉ (khoá công khai)
Trao khoá    -> khoá phiên dùng chung
=> dữ liệu ứng dụng đã mã hoá (HTTPS)
</code></pre>
<p><strong>TLS</strong> cho bí mật (mã hoá), toàn vẹn (phát hiện sửa đổi) và xác thực (chứng chỉ) — biến HTTP thành <strong>HTTPS</strong>.</p>
<div class="callout"><span class="badge">Phòng thủ theo lớp</span> Không lớp nào đủ một mình — chồng tường lửa, mã hoá, xác thực và giám sát lại với nhau.</div>`,
  ]]);

const c8q = quiz('nwc303-quiz-8', 'Quiz 8 — Network security|||Quiz 8 — An ninh mạng', [
  { id: 'q1', question: 'Bộ ba CIA trong an ninh gồm?|||The CIA triad in security is?', options: ['Cache, Index, Access', 'Bí mật, Toàn vẹn, Sẵn sàng|||Confidentiality, Integrity, Availability', 'Client, IP, Address', 'Control, Input, Audit'], correctIndex: 1, explanation: 'CIA = Confidentiality, Integrity, Availability (Bí mật, Toàn vẹn, Sẵn sàng).' },
  { id: 'q2', question: 'VPN cung cấp điều gì?|||What does a VPN provide?', options: ['Một đường hầm mã hoá qua Internet công cộng|||An encrypted tunnel across the public Internet', 'Định tuyến nhanh hơn|||Faster routing', 'Nhiều địa chỉ IP hơn|||More IP addresses', 'Dịch tên miền|||Domain name resolution'], correctIndex: 0, explanation: 'VPN tạo đường hầm mã hoá để truy cập mạng nội bộ an toàn từ xa.' },
  { id: 'q3', question: 'TLS biến HTTP thành gì và cung cấp gì?|||TLS turns HTTP into what, and provides what?', options: ['FTP; nén dữ liệu|||FTP; data compression', 'HTTPS; mã hoá, toàn vẹn và xác thực|||HTTPS; encryption, integrity and authentication', 'DNS; phân giải tên|||DNS; name resolution', 'UDP; tốc độ|||UDP; speed'], correctIndex: 1, explanation: 'TLS cho bí mật, toàn vẹn, xác thực (chứng chỉ) — HTTP trở thành HTTPS.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'NWC303',
    slug: 'nwc303-network-connectivity',
    title: 'Network Connectivity',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/NWC303.webp',
    shortDescription: 'How computer networks connect — layered models (OSI/TCP-IP), application (HTTP, DNS), transport (TCP/UDP), IP addressing & subnets, routing (OSPF/BGP), Ethernet switching & basic security (firewall, VPN, TLS). Bilingual with quizzes.|||Cách mạng máy tính kết nối — mô hình phân tầng (OSI/TCP-IP), tầng ứng dụng (HTTP, DNS), giao vận (TCP/UDP), địa chỉ IP & subnet, định tuyến (OSPF/BGP), Ethernet & an ninh cơ bản (firewall, VPN, TLS). Song ngữ, có quiz.',
    description: 'Môn <strong>NWC303 — Network Connectivity (Kết nối mạng máy tính)</strong> thuộc khung ngành An toàn thông tin, kỳ 3. Từ <strong>mô hình phân tầng</strong> (OSI vs TCP/IP, đóng gói) → <strong>tầng ứng dụng</strong> (HTTP, DNS, SMTP, client-server/P2P) → <strong>tầng giao vận</strong> (TCP/UDP, cổng, bắt tay 3 bước, kiểm soát luồng/tắc nghẽn) → <strong>tầng mạng &amp; IP</strong> (IPv4/IPv6, subnet/CIDR, NAT) → <strong>định tuyến</strong> (RIP/OSPF/BGP) → <strong>tầng liên kết &amp; LAN</strong> (Ethernet, MAC, switch, ARP, VLAN) → <strong>thiết bị &amp; hạ tầng</strong> → <strong>an ninh mạng cơ bản</strong> (firewall, VPN, TLS/HTTPS). Bám giáo trình chuẩn (Kurose &amp; Ross, Tanenbaum, CCNA), song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Mô hình OSI/TCP-IP &amp; đóng gói; HTTP, DNS, SMTP, client-server vs P2P; TCP vs UDP, cổng &amp; socket, bắt tay 3 bước, kiểm soát luồng/tắc nghẽn; IPv4/IPv6, subnet mask &amp; CIDR, NAT; định tuyến distance-vector/link-state, RIP/OSPF/BGP; Ethernet, địa chỉ MAC, switch vs hub, ARP, VLAN; thiết bị &amp; topology &amp; môi trường truyền; CIA, firewall, VPN, tấn công phổ biến, TLS/HTTPS.',
    requirements: 'Kiến thức tin học cơ bản; biết dùng máy tính và Internet. Nên cài Wireshark và Cisco Packet Tracer để thực hành. Xem điều kiện tiên quyết trong khung ngành An toàn thông tin trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, CCNA, RFC, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mạng máy tính, vì sao phân tầng, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Mô hình phân tầng|||Chapter 1 — Layered models', description: 'Internet, OSI vs TCP/IP, đóng gói.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tầng ứng dụng|||Chapter 2 — Application layer', description: 'HTTP, DNS, SMTP, client-server/P2P.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tầng giao vận|||Chapter 3 — Transport layer', description: 'TCP/UDP, cổng, bắt tay 3 bước, kiểm soát luồng/tắc nghẽn.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tầng mạng & IP|||Chapter 4 — Network layer & IP', description: 'IPv4/IPv6, subnet/CIDR, NAT.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Định tuyến|||Chapter 5 — Routing', description: 'Distance-vector/link-state, RIP/OSPF/BGP.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Tầng liên kết & LAN|||Chapter 6 — Link layer & LAN', description: 'Ethernet, MAC, switch, ARP, VLAN.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thiết bị & hạ tầng|||Chapter 7 — Devices & infrastructure', description: 'Hub/switch/router, topology, cáp/WiFi, thiết kế.', lessons: [c7, c7q] },
    { title: 'Chương 8 — An ninh mạng cơ bản|||Chapter 8 — Basic network security', description: 'CIA, firewall, VPN, tấn công, TLS/HTTPS.', lessons: [c8, c8q] },
  ],
};
