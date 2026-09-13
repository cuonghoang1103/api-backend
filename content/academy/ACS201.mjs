/**
 * ACS201 — Automotive Communication Systems. Khung 8 chương song ngữ VI+EN,
 * ngành Kỹ thuật phần mềm ô tô, Kỳ 7. Bám giáo trình: Bosch "CAN Specification
 * 2.0", ISO 11898/11519, LIN 2.2, FlexRay 3.0, Automotive Ethernet (Matheus &
 * Koenigseder). Mỗi chương = 1 DOCUMENT song ngữ + 1 QUIZ 3 câu tiếng Việt.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ lồng nhau;
 * "&"→"&amp;", "<"→"&lt;" trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('acs201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), chuẩn (Bosch CAN, ISO 11898, LIN, FlexRay, Ethernet), công cụ, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">ACS201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Automotive Communication Systems</strong> — in-vehicle networks, CAN/CAN&nbsp;FD, LIN, FlexRay, Automotive Ethernet, diagnostics and cybersecurity — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ACS201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Standards &amp; reference books</h3>
<ul>
<li>Robert Bosch — <em>CAN Specification 2.0</em> (Part A &amp; B): <a href="https://www.bosch-semiconductors.com/ip-modules/can-ip-modules/can-protocol/" target="_blank" rel="noopener">bosch-semiconductors.com</a></li>
<li>ISO 11898 (CAN), ISO 11519 (low-speed CAN): <a href="https://www.iso.org/standard/63648.html" target="_blank" rel="noopener">iso.org</a></li>
<li>LIN Specification 2.2A &amp; FlexRay 3.0 — now maintained under ISO 17987 / ISO 17458</li>
<li>Kirsten Matheus &amp; Thomas Koenigseder — <em>Automotive Ethernet</em>: <a href="https://www.cambridge.org/9781107183221" target="_blank" rel="noopener">Cambridge University Press</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.can-cia.org/can-knowledge/" target="_blank" rel="noopener">CAN in Automation (CiA) — CAN knowledge base</a></li>
<li><a href="https://www.autosar.org/standards/classic-platform" target="_blank" rel="noopener">AUTOSAR — Classic Platform communication stack</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@CSSElectronics" target="_blank" rel="noopener">CSS Electronics</a> — CAN, CAN FD, OBD-II &amp; J1939 explained</li>
<li><a href="https://www.youtube.com/@VectorGroup" target="_blank" rel="noopener">Vector</a> — automotive bus systems &amp; tooling</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://python-can.readthedocs.io/" target="_blank" rel="noopener">python-can</a> — script and sniff CAN buses in Python</li>
<li><a href="https://github.com/linux-can/can-utils" target="_blank" rel="noopener">can-utils (SocketCAN)</a> — candump, cansend, cangen on Linux</li>
<li><a href="https://www.csselectronics.com/pages/dbc-editor-can-bus-database" target="_blank" rel="noopener">DBC editor</a> — decode raw CAN into signals</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — why cars need networks, network classes and OSI layering.</li>
<li><strong>Core bus</strong> — CAN physical layer, frame format, arbitration, error handling and CAN&nbsp;FD.</li>
<li><strong>The family</strong> — LIN (cheap), FlexRay (deterministic), Automotive Ethernet &amp; SOME/IP (high bandwidth).</li>
<li><strong>Job-ready</strong> — UDS/OBD-II diagnostics, gateways, and cybersecurity (SecOC, IDS) on the AUTOSAR stack.</li>
</ol></div>`,
    `<span class="eyebrow">ACS201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Hệ thống truyền thông trên ô tô</strong> — mạng trong xe, CAN/CAN&nbsp;FD, LIN, FlexRay, Automotive Ethernet, chẩn đoán và an ninh mạng — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ACS201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Chuẩn &amp; sách tham khảo</h3>
<ul>
<li>Robert Bosch — <em>CAN Specification 2.0</em> (Phần A &amp; B): <a href="https://www.bosch-semiconductors.com/ip-modules/can-ip-modules/can-protocol/" target="_blank" rel="noopener">bosch-semiconductors.com</a></li>
<li>ISO 11898 (CAN), ISO 11519 (CAN tốc độ thấp): <a href="https://www.iso.org/standard/63648.html" target="_blank" rel="noopener">iso.org</a></li>
<li>LIN Specification 2.2A &amp; FlexRay 3.0 — nay bảo trì dưới ISO 17987 / ISO 17458</li>
<li>Kirsten Matheus &amp; Thomas Koenigseder — <em>Automotive Ethernet</em>: <a href="https://www.cambridge.org/9781107183221" target="_blank" rel="noopener">Cambridge University Press</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.can-cia.org/can-knowledge/" target="_blank" rel="noopener">CAN in Automation (CiA) — kho kiến thức CAN</a></li>
<li><a href="https://www.autosar.org/standards/classic-platform" target="_blank" rel="noopener">AUTOSAR — communication stack nền Classic Platform</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@CSSElectronics" target="_blank" rel="noopener">CSS Electronics</a> — CAN, CAN FD, OBD-II &amp; J1939 giảng dễ hiểu</li>
<li><a href="https://www.youtube.com/@VectorGroup" target="_blank" rel="noopener">Vector</a> — các hệ bus ô tô &amp; công cụ</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://python-can.readthedocs.io/" target="_blank" rel="noopener">python-can</a> — lập trình và bắt gói CAN bằng Python</li>
<li><a href="https://github.com/linux-can/can-utils" target="_blank" rel="noopener">can-utils (SocketCAN)</a> — candump, cansend, cangen trên Linux</li>
<li><a href="https://www.csselectronics.com/pages/dbc-editor-can-bus-database" target="_blank" rel="noopener">DBC editor</a> — giải mã CAN thô ra tín hiệu</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — vì sao xe cần mạng, phân lớp mạng và mô hình OSI.</li>
<li><strong>Bus lõi</strong> — lớp vật lý CAN, khung dữ liệu, arbitration, xử lý lỗi và CAN&nbsp;FD.</li>
<li><strong>Cả họ nhà bus</strong> — LIN (rẻ), FlexRay (tất định), Automotive Ethernet &amp; SOME/IP (băng thông cao).</li>
<li><strong>Sẵn sàng đi làm</strong> — chẩn đoán UDS/OBD-II, gateway, và an ninh mạng (SecOC, IDS) trên stack AUTOSAR.</li>
</ol></div>`,
  ]]);

const intro = doc('acs201-0-1-overview', 'Course overview: Automotive communication systems|||Tổng quan: Hệ thống truyền thông trên ô tô',
  'Vì sao một chiếc xe hiện đại cần mạng nối 70-150 ECU; điểm — dây, băng thông, tất định, an ninh; lộ trình: CAN → LIN/FlexRay → Ethernet → chẩn đoán → an ninh.',
  [[
    `<span class="eyebrow">ACS201 · Lesson 0.1 · Overview</span>
<h2>Automotive Communication Systems</h2>
<p class="lead">A modern car is a <strong>distributed computer network on wheels</strong>. Between <strong>70 and 150 electronic control units (ECUs)</strong> — engine, brakes, airbags, doors, infotainment — must exchange data reliably, in real time, over cheap and rugged wiring. This course explains the <strong>bus systems</strong> that connect them.</p>
<h3>Why not just wire everything point-to-point?</h3>
<p>Early cars did. It exploded: a luxury car would need kilometres of copper and thousands of connectors. A shared <strong>bus</strong> — one pair of wires many nodes tap into — collapses that wiring, and lets any ECU broadcast a message every other ECU can read.</p>
<h3>The four forces that shape every choice</h3>
<ul>
<li><strong>Cost &amp; wiring</strong> — fewer wires, cheaper transceivers.</li>
<li><strong>Bandwidth</strong> — a door switch needs kbit/s; a camera needs Gbit/s.</li>
<li><strong>Determinism</strong> — brakes must react within a guaranteed time, every time.</li>
<li><strong>Safety &amp; security</strong> — a fault or an attacker must not take the car down.</li>
</ul>
<h3>Roadmap</h3>
<p>In-vehicle networks &amp; layering → <strong>CAN</strong> (the workhorse) → arbitration, errors &amp; CAN&nbsp;FD → <strong>LIN</strong> (low cost) → <strong>FlexRay</strong> (deterministic) → <strong>Automotive Ethernet</strong> &amp; SOME/IP → <strong>UDS/OBD-II</strong> diagnostics &amp; gateways → <strong>cybersecurity</strong> (SecOC, IDS) &amp; the AUTOSAR communication stack.</p>`,
    `<span class="eyebrow">ACS201 · Bài 0.1 · Tổng quan</span>
<h2>Hệ thống truyền thông trên ô tô</h2>
<p class="lead">Một chiếc xe hiện đại là <strong>một mạng máy tính phân tán chạy trên bốn bánh</strong>. Từ <strong>70 đến 150 bộ điều khiển điện tử (ECU)</strong> — động cơ, phanh, túi khí, cửa, giải trí — phải trao đổi dữ liệu tin cậy, thời gian thực, trên dây rẻ và bền. Môn này giải thích các <strong>hệ bus</strong> nối chúng lại.</p>
<h3>Sao không nối thẳng điểm-tới-điểm hết?</h3>
<p>Xe đời đầu làm vậy. Nó bùng nổ: một xe sang cần hàng cây số dây đồng và hàng nghìn đầu nối. Một <strong>bus</strong> dùng chung — một đôi dây nhiều nút cùng cắm vào — dẹp gọn mớ dây đó, và cho phép bất kỳ ECU nào phát một bản tin mà mọi ECU khác đọc được.</p>
<h3>Bốn sức ép định hình mọi lựa chọn</h3>
<ul>
<li><strong>Chi phí &amp; dây</strong> — ít dây hơn, transceiver rẻ hơn.</li>
<li><strong>Băng thông</strong> — công tắc cửa cần vài kbit/s; camera cần Gbit/s.</li>
<li><strong>Tính tất định</strong> — phanh phải phản ứng trong một thời gian bảo đảm, mọi lần.</li>
<li><strong>An toàn &amp; an ninh</strong> — một lỗi hay một kẻ tấn công không được hạ gục cả xe.</li>
</ul>
<h3>Lộ trình</h3>
<p>Mạng trong xe &amp; phân lớp → <strong>CAN</strong> (con ngựa thồ) → arbitration, lỗi &amp; CAN&nbsp;FD → <strong>LIN</strong> (chi phí thấp) → <strong>FlexRay</strong> (tất định) → <strong>Automotive Ethernet</strong> &amp; SOME/IP → chẩn đoán <strong>UDS/OBD-II</strong> &amp; gateway → <strong>an ninh mạng</strong> (SecOC, IDS) &amp; communication stack AUTOSAR.</p>`,
  ]]);

const c1 = doc('acs201-1-1-networks', '1.1 — In-vehicle networks & layering|||1.1 — Mạng trong xe & phân lớp',
  'Vì sao dùng bus; phân lớp mạng SAE A/B/C/D theo tốc độ; topology (bus/star); mô hình OSI rút gọn cho ô tô (physical/data-link/application).',
  [[
    `<span class="eyebrow">ACS201 · Chapter 1 · Lesson 1.1</span>
<h2>In-vehicle networks &amp; layering</h2>
<h3>Network classes (by speed)</h3>
<p>SAE groups in-vehicle networks into classes by data rate and cost:</p>
<ul>
<li><strong>Class A</strong> (&lt; 10 kbit/s) — simple body electronics (mirrors, seats). Typically <strong>LIN</strong>.</li>
<li><strong>Class B</strong> (10-125 kbit/s) — general body &amp; comfort. Low-speed CAN (ISO 11519).</li>
<li><strong>Class C</strong> (125 kbit/s-1 Mbit/s) — powertrain &amp; chassis, real-time control. High-speed CAN (ISO 11898).</li>
<li><strong>Class D</strong> (&gt; 1 Mbit/s) — multimedia, camera, backbone. FlexRay, MOST, <strong>Automotive Ethernet</strong>.</li>
</ul>
<h3>Topology</h3>
<p>CAN and LIN use a <strong>bus</strong> topology (all nodes on one line). FlexRay and Ethernet can use a <strong>star</strong> through a switch/active star for isolation and bandwidth. A <strong>gateway</strong> ECU bridges different buses.</p>
<h3>Layering — the OSI idea, simplified</h3>
<pre><code>OSI layer        Automotive example
-----------      ------------------------------
Application  ->  UDS, SOME/IP, J1939, signals
Data Link    ->  CAN frame, arbitration, CRC
Physical     ->  CAN_H / CAN_L differential pair
</code></pre>
<p>Most automotive buses define only the <strong>physical</strong> and <strong>data-link</strong> layers; higher-level protocols (UDS, SOME/IP) ride on top. Separating layers lets the same CAN wire carry many different application protocols.</p>
<div class="callout"><span class="badge">Key idea</span> Pick the bus by the job: kbit/s door switch → LIN; real-time engine control → CAN; a reversing camera → Ethernet.</div>`,
    `<span class="eyebrow">ACS201 · Chương 1 · Bài 1.1</span>
<h2>Mạng trong xe &amp; phân lớp</h2>
<h3>Phân lớp mạng (theo tốc độ)</h3>
<p>SAE chia mạng trong xe thành các lớp theo tốc độ và chi phí:</p>
<ul>
<li><strong>Lớp A</strong> (&lt; 10 kbit/s) — điện thân xe đơn giản (gương, ghế). Thường là <strong>LIN</strong>.</li>
<li><strong>Lớp B</strong> (10-125 kbit/s) — thân xe &amp; tiện nghi. CAN tốc độ thấp (ISO 11519).</li>
<li><strong>Lớp C</strong> (125 kbit/s-1 Mbit/s) — hệ truyền lực &amp; khung gầm, điều khiển thời gian thực. CAN tốc độ cao (ISO 11898).</li>
<li><strong>Lớp D</strong> (&gt; 1 Mbit/s) — đa phương tiện, camera, xương sống. FlexRay, MOST, <strong>Automotive Ethernet</strong>.</li>
</ul>
<h3>Topology (hình trạng)</h3>
<p>CAN và LIN dùng topology <strong>bus</strong> (mọi nút trên một đường). FlexRay và Ethernet có thể dùng <strong>star</strong> qua switch/active star để cách ly và tăng băng thông. Một ECU <strong>gateway</strong> làm cầu giữa các bus khác nhau.</p>
<h3>Phân lớp — ý tưởng OSI, rút gọn</h3>
<pre><code>Lớp OSI          Ví dụ trên ô tô
-----------      ------------------------------
Application  ->  UDS, SOME/IP, J1939, tín hiệu
Data Link    ->  khung CAN, arbitration, CRC
Physical     ->  đôi vi sai CAN_H / CAN_L
</code></pre>
<p>Hầu hết bus ô tô chỉ định nghĩa lớp <strong>vật lý</strong> và <strong>liên kết dữ liệu</strong>; giao thức bậc cao (UDS, SOME/IP) chạy đè lên. Tách lớp cho phép cùng một dây CAN mang nhiều giao thức ứng dụng khác nhau.</p>
<div class="callout"><span class="badge">Ý chính</span> Chọn bus theo việc: công tắc cửa kbit/s → LIN; điều khiển động cơ thời gian thực → CAN; camera lùi → Ethernet.</div>`,
  ]]);

const c1q = quiz('acs201-quiz-1', 'Quiz 1 — Networks & layering|||Quiz 1 — Mạng & phân lớp', [
  { id: 'q1', question: 'Vì sao ô tô dùng bus dùng chung thay vì nối thẳng điểm-tới-điểm?', options: ['Để chạy nhanh hơn CPU', 'Giảm khối lượng dây và đầu nối, cho ECU phát bản tin mọi nút đọc được', 'Để không cần phần mềm', 'Vì bus miễn phí'], correctIndex: 1, explanation: 'Bus dùng chung dẹp mớ dây khổng lồ và cho phép phát quảng bá tới mọi nút.' },
  { id: 'q2', question: 'Mạng lớp C (SAE) 125 kbit/s-1 Mbit/s điển hình dùng cho?', options: ['Gương, ghế (LIN)', 'Camera, đa phương tiện', 'Hệ truyền lực & khung gầm thời gian thực (CAN tốc độ cao)', 'Không dùng vào đâu'], correctIndex: 2, explanation: 'Lớp C là điều khiển thời gian thực powertrain/chassis, dùng CAN tốc độ cao (ISO 11898).' },
  { id: 'q3', question: 'Hầu hết bus ô tô (CAN, LIN) tự định nghĩa những lớp OSI nào?', options: ['Chỉ lớp Application', 'Lớp Physical và Data Link', 'Cả 7 lớp', 'Chỉ lớp Network'], correctIndex: 1, explanation: 'Chúng định nghĩa vật lý + liên kết dữ liệu; UDS/SOME/IP là bậc ứng dụng chạy đè lên.' },
]);

const c2 = doc('acs201-2-1-can-physical-frame', '2.1 — CAN bus: physical layer & data frame|||2.1 — CAN bus: lớp vật lý & khung dữ liệu',
  'Đôi vi sai CAN_H/CAN_L, bit dominant/recessive, điện trở đầu cuối 120Ω; khung dữ liệu chuẩn: SOF, ID 11-bit, DLC, tối đa 8 byte, CRC, ACK.',
  [[
    `<span class="eyebrow">ACS201 · Chapter 2 · Lesson 2.1</span>
<h2>CAN bus: physical layer &amp; data frame</h2>
<h3>The physical layer</h3>
<p>High-speed CAN (ISO 11898) uses a <strong>twisted differential pair</strong>, CAN_H and CAN_L, terminated by <strong>120&nbsp;Ω</strong> resistors at each end. Signalling is by voltage difference, which rejects noise:</p>
<ul>
<li><strong>Recessive bit (logic 1)</strong> — CAN_H ≈ CAN_L (≈ 2.5&nbsp;V each), difference ≈ 0&nbsp;V.</li>
<li><strong>Dominant bit (logic 0)</strong> — CAN_H ≈ 3.5&nbsp;V, CAN_L ≈ 1.5&nbsp;V, difference ≈ 2&nbsp;V.</li>
</ul>
<p>The names matter: if any node sends dominant while others send recessive, the <strong>dominant wins</strong> — the bus is a wired-AND. This single rule drives arbitration (next chapter).</p>
<h3>The standard data frame</h3>
<pre><code>| SOF | Identifier(11b) | RTR | Ctrl(DLC) | Data 0..8 B | CRC(15b) | ACK | EOF |
   |          |                        |                |
   v          v                        v                v
 start   message ID/priority      how many bytes    checksum
</code></pre>
<ul>
<li><strong>SOF</strong> — start of frame (1 dominant bit).</li>
<li><strong>Identifier</strong> — 11 bits (standard) or 29 bits (extended). It names the message and sets priority — <strong>not</strong> a node address. CAN is content-addressed: nodes filter by ID.</li>
<li><strong>DLC</strong> — data length code, 0 to 8 data bytes.</li>
<li><strong>CRC</strong> — 15-bit checksum for error detection.</li>
<li><strong>ACK</strong> — any node that received it correctly pulls this dominant.</li>
</ul>
<div class="callout"><span class="badge">Content, not address</span> A classic CAN message carries at most 8 bytes and is addressed by <em>what it is</em> (its ID), not <em>who</em> it is for. Every node hears every message and keeps the ones it cares about.</div>`,
    `<span class="eyebrow">ACS201 · Chương 2 · Bài 2.1</span>
<h2>CAN bus: lớp vật lý &amp; khung dữ liệu</h2>
<h3>Lớp vật lý</h3>
<p>CAN tốc độ cao (ISO 11898) dùng <strong>đôi dây xoắn vi sai</strong>, CAN_H và CAN_L, có <strong>điện trở đầu cuối 120&nbsp;Ω</strong> ở hai đầu. Tín hiệu là hiệu điện áp, nhờ đó khử nhiễu:</p>
<ul>
<li><strong>Bit recessive (logic 1)</strong> — CAN_H ≈ CAN_L (≈ 2.5&nbsp;V mỗi dây), hiệu ≈ 0&nbsp;V.</li>
<li><strong>Bit dominant (logic 0)</strong> — CAN_H ≈ 3.5&nbsp;V, CAN_L ≈ 1.5&nbsp;V, hiệu ≈ 2&nbsp;V.</li>
</ul>
<p>Tên gọi có dụng ý: nếu một nút phát dominant trong khi nút khác phát recessive, <strong>dominant thắng</strong> — bus là một cổng wired-AND. Đúng một quy tắc này chi phối arbitration (chương sau).</p>
<h3>Khung dữ liệu chuẩn</h3>
<pre><code>| SOF | Identifier(11b) | RTR | Ctrl(DLC) | Data 0..8 B | CRC(15b) | ACK | EOF |
   |          |                        |                |
   v          v                        v                v
 bat dau  ID/uu tien ban tin      bao nhieu byte    ma kiem tra
</code></pre>
<ul>
<li><strong>SOF</strong> — bắt đầu khung (1 bit dominant).</li>
<li><strong>Identifier</strong> — 11 bit (chuẩn) hoặc 29 bit (mở rộng). Nó đặt tên bản tin và định ưu tiên — <strong>không</strong> phải địa chỉ nút. CAN định địa theo nội dung: nút lọc theo ID.</li>
<li><strong>DLC</strong> — mã độ dài dữ liệu, 0 đến 8 byte.</li>
<li><strong>CRC</strong> — mã kiểm tra 15 bit để phát hiện lỗi.</li>
<li><strong>ACK</strong> — nút nào nhận đúng sẽ kéo bit này về dominant.</li>
</ul>
<div class="callout"><span class="badge">Nội dung, không phải địa chỉ</span> Một bản tin CAN cổ điển mang tối đa 8 byte và được định địa theo <em>nó là gì</em> (ID), không theo <em>gửi cho ai</em>. Mọi nút nghe mọi bản tin và giữ lại cái nó quan tâm.</div>`,
  ]]);

const c2q = quiz('acs201-quiz-2', 'Quiz 2 — CAN physical & frame|||Quiz 2 — CAN vật lý & khung', [
  { id: 'q1', question: 'Trên CAN tốc độ cao, bit "dominant" (logic 0) tương ứng?', options: ['CAN_H ≈ CAN_L, hiệu ≈ 0V', 'Hiệu điện áp CAN_H − CAN_L ≈ 2V', 'Không có điện', 'Chỉ dùng một dây'], correctIndex: 1, explanation: 'Dominant: CAN_H≈3.5V, CAN_L≈1.5V → hiệu ≈2V; recessive thì hiệu ≈0V.' },
  { id: 'q2', question: 'Một khung dữ liệu CAN cổ điển mang tối đa bao nhiêu byte dữ liệu?', options: ['4 byte', '8 byte', '64 byte', 'Không giới hạn'], correctIndex: 1, explanation: 'CAN cổ điển tối đa 8 byte (DLC 0..8); CAN FD mới lên tới 64 byte.' },
  { id: 'q3', question: 'Identifier trong khung CAN đóng vai trò gì?', options: ['Địa chỉ nút nhận', 'Tên bản tin và mức ưu tiên (định địa theo nội dung)', 'Số byte dữ liệu', 'Mã kiểm tra lỗi'], correctIndex: 1, explanation: 'ID đặt tên/ưu tiên bản tin, không phải địa chỉ nút — CAN định địa theo nội dung, nút lọc theo ID.' },
]);

const c3 = doc('acs201-3-1-arbitration-error-fd', '3.1 — CAN: arbitration, error handling & CAN FD|||3.1 — CAN: arbitration, xử lý lỗi & CAN FD',
  'Arbitration không phá hủy theo ID (bit dominant thắng); 5 cơ chế phát hiện lỗi + error/bit stuffing; error states; CAN FD: 64 byte, bit-rate switch.',
  [[
    `<span class="eyebrow">ACS201 · Chapter 3 · Lesson 3.1</span>
<h2>CAN: arbitration, error handling &amp; CAN FD</h2>
<h3>Non-destructive arbitration</h3>
<p>When several nodes start transmitting at once, they arbitrate <strong>bit by bit on the identifier</strong>. Each node watches the bus while sending: if it sent recessive (1) but reads dominant (0), it has lost and backs off. The winner never even notices — its message goes through with no delay and no corruption.</p>
<pre><code>Node A ID: 0 0 1 1 0 ...
Node B ID: 0 0 1 0 ...   <- sends dominant(0) where A sends recessive(1)
Bus:       0 0 1 0 ...   <- dominant wins; A backs off, B keeps going
</code></pre>
<p><strong>Lower ID = higher priority</strong> (more leading dominant bits). This gives CAN guaranteed priority ordering with no collisions lost.</p>
<h3>Error handling</h3>
<p>CAN has <strong>five error checks</strong>: bit monitoring, bit stuffing, CRC, form check, and ACK check. A node that detects an error sends an <strong>error frame</strong>, and every node discards the message — so a bad frame is destroyed everywhere at once. Two counters (TEC/REC) move a node through states:</p>
<pre><code>Error-active   -> normal, can flag errors
Error-passive  -> too many errors, flags quietly
Bus-off        -> disconnected to protect the bus
</code></pre>
<h3>CAN FD (Flexible Data-rate)</h3>
<p><strong>CAN FD</strong> keeps CAN arbitration but fixes its two limits: it carries up to <strong>64 data bytes</strong> (not 8), and it <strong>switches to a faster bit rate</strong> for the data phase (arbitration still slow so it stays fair). Same wires, far more throughput — the bridge toward Automotive Ethernet.</p>
<div class="callout"><span class="badge">Why it is elegant</span> Arbitration wastes nothing: the highest-priority message always wins on the first try, and no bandwidth is lost to collisions — unlike classic Ethernet CSMA/CD.</div>`,
    `<span class="eyebrow">ACS201 · Chương 3 · Bài 3.1</span>
<h2>CAN: arbitration, xử lý lỗi &amp; CAN FD</h2>
<h3>Arbitration không phá hủy</h3>
<p>Khi nhiều nút cùng bắt đầu phát, chúng tranh quyền <strong>từng bit trên identifier</strong>. Mỗi nút vừa phát vừa nghe bus: nếu nó phát recessive (1) mà đọc được dominant (0) thì nó đã thua và rút lui. Nút thắng thậm chí không nhận ra — bản tin của nó đi qua không trễ, không hỏng.</p>
<pre><code>Nut A ID: 0 0 1 1 0 ...
Nut B ID: 0 0 1 0 ...   <- phat dominant(0) cho khi A phat recessive(1)
Bus:      0 0 1 0 ...   <- dominant thang; A rut lui, B di tiep
</code></pre>
<p><strong>ID nhỏ hơn = ưu tiên cao hơn</strong> (nhiều bit dominant dẫn đầu hơn). Nhờ đó CAN bảo đảm thứ tự ưu tiên mà không mất bản tin nào do va chạm.</p>
<h3>Xử lý lỗi</h3>
<p>CAN có <strong>năm phép kiểm lỗi</strong>: giám sát bit, bit stuffing, CRC, kiểm dạng khung, kiểm ACK. Nút phát hiện lỗi sẽ gửi một <strong>error frame</strong>, và mọi nút bỏ bản tin đó — nên khung hỏng bị hủy đồng loạt ở khắp nơi. Hai bộ đếm (TEC/REC) đưa nút qua các trạng thái:</p>
<pre><code>Error-active   -> binh thuong, bao loi duoc
Error-passive  -> loi qua nhieu, bao loi lang le
Bus-off        -> tu ngat de bao ve bus
</code></pre>
<h3>CAN FD (Flexible Data-rate)</h3>
<p><strong>CAN FD</strong> giữ nguyên arbitration của CAN nhưng vá hai giới hạn: nó mang tới <strong>64 byte dữ liệu</strong> (không phải 8), và <strong>chuyển sang tốc độ bit nhanh hơn</strong> cho pha dữ liệu (pha arbitration vẫn chậm để giữ công bằng). Cùng bộ dây, thông lượng cao hơn nhiều — nhịp cầu tiến tới Automotive Ethernet.</p>
<div class="callout"><span class="badge">Vì sao tinh tế</span> Arbitration không phí gì: bản tin ưu tiên cao nhất luôn thắng ngay lần đầu, không mất băng thông vì va chạm — khác với Ethernet cổ điển CSMA/CD.</div>`,
  ]]);

const c3q = quiz('acs201-quiz-3', 'Quiz 3 — Arbitration/error/FD|||Quiz 3 — Arbitration/lỗi/FD', [
  { id: 'q1', question: 'Trong arbitration của CAN, bản tin nào thắng quyền truyền?', options: ['Bản tin gửi sau cùng', 'Bản tin có ID nhỏ hơn (nhiều bit dominant dẫn đầu)', 'Bản tin dài nhất', 'Bản tin của nút có địa chỉ cao nhất'], correctIndex: 1, explanation: 'ID nhỏ = ưu tiên cao; dominant thắng recessive nên nút thua tự rút, không phá hủy bản tin thắng.' },
  { id: 'q2', question: 'Khi bộ đếm lỗi quá cao, nút CAN chuyển sang trạng thái nào để bảo vệ bus?', options: ['Error-active', 'Bus-off (tự ngắt)', 'Recessive', 'Arbitration'], correctIndex: 1, explanation: 'TEC/REC cao → error-passive → bus-off: nút tự ngắt để không làm hỏng cả bus.' },
  { id: 'q3', question: 'CAN FD cải tiến gì so với CAN cổ điển?', options: ['Bỏ arbitration', 'Tối đa 64 byte dữ liệu và tốc độ bit nhanh hơn ở pha dữ liệu', 'Chỉ dùng 1 dây', 'Không cần CRC'], correctIndex: 1, explanation: 'CAN FD giữ arbitration nhưng nâng lên 64 byte và chuyển tốc độ bit cao hơn cho pha dữ liệu.' },
]);

const c4 = doc('acs201-4-1-lin', '4.1 — LIN bus|||4.1 — LIN bus',
  'LIN: 1 dây, master/slave, tối đa ~20 kbit/s, rẻ; lịch (schedule table) do master; khung: break, sync, PID, data, checksum; dùng cho cửa, gương, cảm biến mưa.',
  [[
    `<span class="eyebrow">ACS201 · Chapter 4 · Lesson 4.1</span>
<h2>LIN bus (Local Interconnect Network)</h2>
<p class="lead"><strong>LIN</strong> is the cheap counterpart to CAN. Where CAN is a multi-master real-time bus, LIN is a <strong>single-wire, single-master</strong> bus for slow, low-cost body functions — window switches, mirrors, rain sensors, seat motors — at up to about <strong>20 kbit/s</strong>.</p>
<h3>Master / slave, no arbitration</h3>
<p>LIN needs no arbitration because there is exactly <strong>one master</strong>. The master owns a <strong>schedule table</strong> and sends a <em>header</em>; the addressed <em>slave</em> answers with the data. Timing is deterministic by construction — the master decides who talks and when.</p>
<h3>The LIN frame</h3>
<pre><code>Header (from master)          Response (from a slave)
[ Break | Sync(0x55) | PID ]  [ Data 1..8 bytes | Checksum ]
   |         |         |
   v         v         v
 wake     baud      protected frame ID
</code></pre>
<ul>
<li><strong>Break</strong> — a long dominant that wakes and synchronises slaves.</li>
<li><strong>Sync</strong> — the fixed byte 0x55; slaves measure it to lock the master's baud rate (they can use cheap RC oscillators).</li>
<li><strong>PID</strong> — 6-bit frame ID + 2 parity bits; it names the frame, and the slave assigned to it replies.</li>
</ul>
<div class="callout"><span class="badge">Where it fits</span> A car may have one CAN backbone with several small LIN sub-buses hanging off body ECUs — LIN for the pennies-per-node edge, CAN for the real-time core.</div>`,
    `<span class="eyebrow">ACS201 · Chương 4 · Bài 4.1</span>
<h2>LIN bus (Local Interconnect Network)</h2>
<p class="lead"><strong>LIN</strong> là người anh em rẻ tiền của CAN. Nếu CAN là bus đa chủ thời gian thực, thì LIN là bus <strong>một dây, một master</strong> cho các chức năng thân xe chậm, giá rẻ — công tắc cửa kính, gương, cảm biến mưa, mô-tơ ghế — tốc độ tới khoảng <strong>20 kbit/s</strong>.</p>
<h3>Master / slave, không arbitration</h3>
<p>LIN không cần arbitration vì chỉ có đúng <strong>một master</strong>. Master nắm một <strong>bảng lịch (schedule table)</strong> và gửi <em>header</em>; <em>slave</em> được gọi tên trả lời bằng dữ liệu. Thời gian tất định ngay từ thiết kế — master quyết ai nói và nói lúc nào.</p>
<h3>Khung LIN</h3>
<pre><code>Header (tu master)            Response (tu slave)
[ Break | Sync(0x55) | PID ]  [ Data 1..8 byte | Checksum ]
   |         |         |
   v         v         v
 danh thuc baud      ID khung co parity
</code></pre>
<ul>
<li><strong>Break</strong> — một dominant dài đánh thức và đồng bộ các slave.</li>
<li><strong>Sync</strong> — byte cố định 0x55; slave đo nó để bắt đúng tốc độ baud của master (nhờ vậy dùng được dao động RC rẻ tiền).</li>
<li><strong>PID</strong> — ID khung 6 bit + 2 bit parity; nó đặt tên khung, và slave được gán khung đó sẽ trả lời.</li>
</ul>
<div class="callout"><span class="badge">Vị trí của LIN</span> Một chiếc xe có thể có một xương sống CAN với vài bus con LIN treo vào các ECU thân xe — LIN cho phần rìa rẻ từng xu mỗi nút, CAN cho lõi thời gian thực.</div>`,
  ]]);

const c4q = quiz('acs201-quiz-4', 'Quiz 4 — LIN|||Quiz 4 — LIN', [
  { id: 'q1', question: 'Vì sao LIN không cần cơ chế arbitration như CAN?', options: ['Vì LIN nhanh hơn CAN', 'Vì chỉ có đúng một master điều phối theo bảng lịch', 'Vì LIN không truyền dữ liệu', 'Vì LIN dùng cáp quang'], correctIndex: 1, explanation: 'LIN là bus một master; master nắm schedule table và quyết ai phát khi nào, nên không tranh chấp.' },
  { id: 'q2', question: 'Byte Sync 0x55 trong khung LIN dùng để làm gì?', options: ['Mã hóa dữ liệu', 'Cho slave đo và bắt đúng tốc độ baud của master', 'Kiểm tra lỗi CRC', 'Địa chỉ slave'], correctIndex: 1, explanation: 'Slave đo 0x55 để đồng bộ baud, nhờ đó dùng được dao động RC rẻ tiền.' },
  { id: 'q3', question: 'LIN thường được dùng cho loại chức năng nào?', options: ['Điều khiển phanh ABS thời gian thực', 'Camera độ phân giải cao', 'Chức năng thân xe chậm, rẻ (gương, công tắc cửa, cảm biến mưa)', 'Xương sống dữ liệu chính của xe'], correctIndex: 2, explanation: 'LIN nhắm phần rìa chậm, giá rẻ tới ~20 kbit/s; lõi thời gian thực vẫn dùng CAN.' },
]);

const c5 = doc('acs201-5-1-flexray', '5.1 — FlexRay|||5.1 — FlexRay',
  'FlexRay: tất định, tới 10 Mbit/s, 2 kênh dự phòng; TDMA — chu kỳ chia static (khe cố định) + dynamic segment; đồng bộ đồng hồ toàn cục; dùng cho x-by-wire.',
  [[
    `<span class="eyebrow">ACS201 · Chapter 5 · Lesson 5.1</span>
<h2>FlexRay</h2>
<p class="lead">CAN is priority-based, so a low-priority message can be delayed by busy traffic — fine for most things, not for <strong>x-by-wire</strong> (steer-by-wire, brake-by-wire) where a message must arrive at a <em>guaranteed instant</em>. <strong>FlexRay</strong> was built for that: deterministic, fast (up to <strong>10 Mbit/s</strong>), and optionally <strong>dual-channel redundant</strong>.</p>
<h3>Time-triggered instead of event-triggered</h3>
<p>FlexRay uses <strong>TDMA</strong> — a global clock all nodes agree on, and a repeating <strong>communication cycle</strong> split into slots:</p>
<pre><code>|<-------------- Communication cycle -------------->|
[  Static segment   ][ Dynamic segment ][ NIT ]
  fixed slots,          flexible slots     idle /
  one per message       (like mini-CAN)    clock sync
</code></pre>
<ul>
<li><strong>Static segment</strong> — pre-assigned time slots; each critical message has its own guaranteed slot, no contention. This is the deterministic part.</li>
<li><strong>Dynamic segment</strong> — event-driven slots for less critical, bursty data.</li>
<li><strong>Clock synchronisation</strong> — nodes continuously align their local clocks so everyone agrees when each slot begins.</li>
</ul>
<h3>Redundancy</h3>
<p>Two independent channels (A and B) can carry the same data. If one is cut or noisy, the other still delivers — a safety property CAN alone does not give.</p>
<div class="callout"><span class="badge">Trade-off</span> FlexRay guarantees timing but is more complex and costly to design and schedule than CAN. Automotive Ethernet has since taken over much of the high-bandwidth role.</div>`,
    `<span class="eyebrow">ACS201 · Chương 5 · Bài 5.1</span>
<h2>FlexRay</h2>
<p class="lead">CAN dựa trên ưu tiên, nên một bản tin ưu tiên thấp có thể bị trễ khi bus bận — ổn với hầu hết mọi thứ, nhưng không ổn cho <strong>x-by-wire</strong> (lái, phanh bằng điện) nơi bản tin phải đến vào một <em>thời điểm bảo đảm</em>. <strong>FlexRay</strong> sinh ra cho việc đó: tất định, nhanh (tới <strong>10 Mbit/s</strong>), và có thể <strong>hai kênh dự phòng</strong>.</p>
<h3>Kích hoạt theo thời gian, không theo sự kiện</h3>
<p>FlexRay dùng <strong>TDMA</strong> — một đồng hồ toàn cục mọi nút cùng thống nhất, và một <strong>chu kỳ truyền thông</strong> lặp lại chia thành các khe:</p>
<pre><code>|<-------------- Chu ky truyen thong ------------->|
[  Static segment   ][ Dynamic segment ][ NIT ]
  khe co dinh,          khe linh hoat      nghi /
  moi ban tin mot khe   (nhu mini-CAN)     dong bo dong ho
</code></pre>
<ul>
<li><strong>Static segment</strong> — khe thời gian gán trước; mỗi bản tin then chốt có khe riêng bảo đảm, không tranh chấp. Đây là phần tất định.</li>
<li><strong>Dynamic segment</strong> — khe theo sự kiện cho dữ liệu ít then chốt, dồn cục.</li>
<li><strong>Đồng bộ đồng hồ</strong> — các nút liên tục canh đồng hồ cục bộ để mọi nút cùng biết mỗi khe bắt đầu khi nào.</li>
</ul>
<h3>Dự phòng</h3>
<p>Hai kênh độc lập (A và B) có thể chở cùng dữ liệu. Nếu một kênh đứt hoặc nhiễu, kênh kia vẫn giao — thuộc tính an toàn mà riêng CAN không cho được.</p>
<div class="callout"><span class="badge">Đánh đổi</span> FlexRay bảo đảm thời gian nhưng phức tạp và tốn kém hơn CAN ở khâu thiết kế và lập lịch. Về sau Automotive Ethernet đã tiếp quản phần lớn vai trò băng thông cao.</div>`,
  ]]);

const c5q = quiz('acs201-quiz-5', 'Quiz 5 — FlexRay|||Quiz 5 — FlexRay', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi của FlexRay so với CAN là gì?', options: ['Rẻ hơn CAN', 'Tất định theo thời gian nhờ TDMA (khe thời gian gán trước)', 'Chỉ dùng một dây', 'Không có kiểm tra lỗi'], correctIndex: 1, explanation: 'FlexRay dùng TDMA với đồng hồ toàn cục và khe cố định, bảo đảm thời điểm đến — khác CAN theo ưu tiên.' },
  { id: 'q2', question: 'Phần nào của chu kỳ FlexRay cho khe cố định, không tranh chấp?', options: ['Dynamic segment', 'Static segment', 'NIT', 'Break'], correctIndex: 1, explanation: 'Static segment gán khe cố định cho từng bản tin then chốt; dynamic segment mới theo sự kiện.' },
  { id: 'q3', question: 'Vì sao FlexRay có thể dùng hai kênh (A và B)?', options: ['Để tăng số nút gấp đôi', 'Để dự phòng — kênh này hỏng thì kênh kia vẫn giao dữ liệu', 'Để giảm giá', 'Để bỏ đồng bộ đồng hồ'], correctIndex: 1, explanation: 'Hai kênh độc lập cho dự phòng an toàn, quan trọng với x-by-wire.' },
]);

const c6 = doc('acs201-6-1-ethernet-someip', '6.1 — Automotive Ethernet & SOME/IP|||6.1 — Automotive Ethernet & SOME/IP',
  '100BASE-T1/1000BASE-T1 một đôi dây; switch, VLAN; service-oriented SOME/IP (publish/subscribe, RPC) thay tín hiệu tĩnh; nền cho ADAS, camera, zonal.',
  [[
    `<span class="eyebrow">ACS201 · Chapter 6 · Lesson 6.1</span>
<h2>Automotive Ethernet &amp; SOME/IP</h2>
<h3>Ethernet, adapted for cars</h3>
<p>Cameras, radar, lidar and ADAS need <strong>hundreds of Mbit/s to Gbit/s</strong> — far beyond CAN. Office Ethernet needs 4 wires and heavy connectors; automotive Ethernet (<strong>100BASE-T1</strong>, <strong>1000BASE-T1</strong>) runs full-duplex over a <strong>single unshielded twisted pair</strong>, light and cheap enough for a car harness. Nodes connect through <strong>switches</strong>; <strong>VLANs</strong> and traffic shaping (TSN) keep critical traffic on time.</p>
<h3>From signals to services: SOME/IP</h3>
<p>Classic CAN broadcasts fixed <em>signals</em> whether anyone wants them or not. <strong>SOME/IP</strong> (Scalable service-Oriented MiddlewarE over IP) makes ECUs offer <strong>services</strong> instead:</p>
<ul>
<li><strong>Publish / subscribe</strong> — a client subscribes to an event group and receives updates only while it wants them.</li>
<li><strong>Remote procedure call (RPC)</strong> — a client calls a method on another ECU and gets a response, like a network API.</li>
<li><strong>Service discovery</strong> — ECUs announce and find services at runtime, so the network is not fully static.</li>
</ul>
<pre><code>Client                         Server ECU
  |  FindService  ------------>  |
  |  <----------  OfferService   |
  |  Subscribe(eventgroup) --->  |
  |  <---------- Event/Notify     |  (only while subscribed)
</code></pre>
<div class="callout"><span class="badge">Zonal architecture</span> High-bandwidth Ethernet backbones plus SOME/IP enable "zonal" designs — a few powerful zone controllers replace dozens of small ECUs, with CAN/LIN surviving at the edges.</div>`,
    `<span class="eyebrow">ACS201 · Chương 6 · Bài 6.1</span>
<h2>Automotive Ethernet &amp; SOME/IP</h2>
<h3>Ethernet, sửa lại cho ô tô</h3>
<p>Camera, radar, lidar và ADAS cần <strong>hàng trăm Mbit/s tới Gbit/s</strong> — vượt xa CAN. Ethernet văn phòng cần 4 dây và đầu nối nặng; Ethernet ô tô (<strong>100BASE-T1</strong>, <strong>1000BASE-T1</strong>) chạy song công trên <strong>một đôi dây xoắn không bọc chống nhiễu</strong>, đủ nhẹ và rẻ cho dây dẫn xe. Các nút nối qua <strong>switch</strong>; <strong>VLAN</strong> và định hình lưu lượng (TSN) giữ dữ liệu then chốt đúng giờ.</p>
<h3>Từ tín hiệu sang dịch vụ: SOME/IP</h3>
<p>CAN cổ điển phát các <em>tín hiệu</em> cố định dù có ai cần hay không. <strong>SOME/IP</strong> (Scalable service-Oriented MiddlewarE over IP) cho ECU cung cấp <strong>dịch vụ</strong> thay vì thế:</p>
<ul>
<li><strong>Publish / subscribe</strong> — client đăng ký một nhóm sự kiện và chỉ nhận cập nhật khi còn cần.</li>
<li><strong>Gọi thủ tục từ xa (RPC)</strong> — client gọi một phương thức trên ECU khác và nhận về kết quả, như một API mạng.</li>
<li><strong>Service discovery</strong> — ECU công bố và tìm dịch vụ lúc chạy, nên mạng không hoàn toàn tĩnh.</li>
</ul>
<pre><code>Client                         Server ECU
  |  FindService  ------------>  |
  |  <----------  OfferService   |
  |  Subscribe(eventgroup) --->  |
  |  <---------- Event/Notify     |  (chi khi con dang ky)
</code></pre>
<div class="callout"><span class="badge">Kiến trúc zonal</span> Xương sống Ethernet băng thông cao cộng SOME/IP mở ra thiết kế "zonal" — vài bộ điều khiển vùng mạnh thay cho hàng chục ECU nhỏ, CAN/LIN vẫn sống ở phần rìa.</div>`,
  ]]);

const c6q = quiz('acs201-quiz-6', 'Quiz 6 — Ethernet & SOME/IP|||Quiz 6 — Ethernet & SOME/IP', [
  { id: 'q1', question: 'Automotive Ethernet (100BASE-T1) khác Ethernet văn phòng ở chỗ nào?', options: ['Dùng cáp quang', 'Chạy song công trên một đôi dây xoắn (nhẹ, rẻ cho xe)', 'Chậm hơn CAN', 'Không cần switch'], correctIndex: 1, explanation: '100BASE-T1/1000BASE-T1 dùng một đôi dây xoắn thay vì 4 dây, phù hợp dây dẫn ô tô.' },
  { id: 'q2', question: 'SOME/IP thay đổi mô hình truyền thông thế nào so với tín hiệu CAN cố định?', options: ['Bỏ hẳn mạng', 'Hướng dịch vụ: publish/subscribe và gọi thủ tục từ xa (RPC)', 'Chỉ phát 8 byte một lần', 'Không cho phép nhiều client'], correctIndex: 1, explanation: 'SOME/IP là middleware hướng dịch vụ: subscribe sự kiện và RPC, khác kiểu phát tín hiệu tĩnh của CAN.' },
  { id: 'q3', question: 'Vì sao xe cần Ethernet băng thông cao?', options: ['Để tắt đèn nhanh hơn', 'Vì camera/radar/lidar/ADAS cần hàng trăm Mbit/s tới Gbit/s, vượt CAN', 'Vì Ethernet rẻ hơn LIN', 'Vì nó không cần phần mềm'], correctIndex: 1, explanation: 'Dữ liệu cảm biến ADAS vượt xa băng thông CAN nên cần Ethernet.' },
]);

const c7 = doc('acs201-7-1-uds-obd-gateway', '7.1 — Diagnostics UDS/OBD-II & gateway|||7.1 — Chẩn đoán UDS/OBD-II & gateway',
  'OBD-II (bắt buộc luật khí thải) đọc DTC; UDS (ISO 14229): dịch vụ theo SID, session/security access, đọc/ghi data, flash; gateway định tuyến & cách ly bus.',
  [[
    `<span class="eyebrow">ACS201 · Chapter 7 · Lesson 7.1</span>
<h2>Diagnostics (UDS / OBD-II) &amp; the gateway</h2>
<h3>OBD-II — the legally mandated window</h3>
<p><strong>OBD-II</strong> is the emissions-driven standard behind the connector under your dashboard. A scan tool asks for <strong>Diagnostic Trouble Codes (DTCs)</strong> and live data (RPM, coolant temp) using standard "PIDs". It is the minimum every car must expose.</p>
<h3>UDS — the full diagnostic protocol</h3>
<p><strong>UDS (ISO 14229)</strong> is the richer protocol used in service and production. It is request/response, keyed by a <strong>Service Identifier (SID)</strong>:</p>
<pre><code>Request:  22 F1 90         (SID 0x22 = ReadDataByIdentifier, DID 0xF190 = VIN)
Response: 62 F1 90 ...     (0x22 + 0x40 = 0x62 = positive response + data)
Negative: 7F 22 33         (0x7F = error, service 0x22, NRC 0x33 = securityAccessDenied)
</code></pre>
<ul>
<li><strong>DiagnosticSessionControl (0x10)</strong> — switch to programming/extended session.</li>
<li><strong>SecurityAccess (0x27)</strong> — a seed/key challenge before writing or flashing.</li>
<li><strong>ReadDataByIdentifier (0x22) / WriteDataByIdentifier (0x2E)</strong>.</li>
<li><strong>RoutineControl (0x31), RequestDownload (0x34)</strong> — used for reflashing firmware.</li>
</ul>
<h3>The gateway ECU</h3>
<p>A car has several buses (CAN, CAN&nbsp;FD, LIN, Ethernet). A <strong>gateway</strong> routes messages between them and to the diagnostic connector, translating IDs and rate-limiting traffic. It is also the natural place to <strong>isolate</strong> domains — the tester and infotainment should never reach the brakes directly.</p>
<div class="callout"><span class="badge">Security lives here</span> UDS SecurityAccess and the gateway's routing rules are the front line: any weakness here is where an attacker reaches safety-critical ECUs — the subject of the next chapter.</div>`,
    `<span class="eyebrow">ACS201 · Chương 7 · Bài 7.1</span>
<h2>Chẩn đoán (UDS / OBD-II) &amp; gateway</h2>
<h3>OBD-II — cửa sổ luật định bắt buộc</h3>
<p><strong>OBD-II</strong> là chuẩn ra đời vì luật khí thải, đứng sau đầu nối dưới táp-lô xe bạn. Máy đọc lỗi hỏi các <strong>Mã lỗi chẩn đoán (DTC)</strong> và dữ liệu trực tiếp (vòng tua, nhiệt nước làm mát) qua các "PID" chuẩn. Đây là mức tối thiểu mọi xe phải bộc lộ.</p>
<h3>UDS — giao thức chẩn đoán đầy đủ</h3>
<p><strong>UDS (ISO 14229)</strong> là giao thức giàu hơn dùng trong dịch vụ và sản xuất. Nó theo kiểu yêu cầu/đáp, khóa theo <strong>Service Identifier (SID)</strong>:</p>
<pre><code>Yeu cau:  22 F1 90         (SID 0x22 = ReadDataByIdentifier, DID 0xF190 = VIN)
Dap:      62 F1 90 ...     (0x22 + 0x40 = 0x62 = dap tich cuc + du lieu)
Am:       7F 22 33         (0x7F = loi, dich vu 0x22, NRC 0x33 = securityAccessDenied)
</code></pre>
<ul>
<li><strong>DiagnosticSessionControl (0x10)</strong> — chuyển sang phiên lập trình/mở rộng.</li>
<li><strong>SecurityAccess (0x27)</strong> — thử thách seed/key trước khi ghi hay flash.</li>
<li><strong>ReadDataByIdentifier (0x22) / WriteDataByIdentifier (0x2E)</strong>.</li>
<li><strong>RoutineControl (0x31), RequestDownload (0x34)</strong> — dùng để nạp lại firmware.</li>
</ul>
<h3>ECU gateway</h3>
<p>Một chiếc xe có nhiều bus (CAN, CAN&nbsp;FD, LIN, Ethernet). Một <strong>gateway</strong> định tuyến bản tin giữa chúng và tới đầu nối chẩn đoán, dịch ID và hạn chế lưu lượng. Nó cũng là nơi tự nhiên để <strong>cách ly</strong> các miền — máy chẩn đoán và giải trí không bao giờ được chạm thẳng vào phanh.</p>
<div class="callout"><span class="badge">An ninh nằm ở đây</span> UDS SecurityAccess và luật định tuyến của gateway là tuyến đầu: bất kỳ điểm yếu nào ở đây là nơi kẻ tấn công chạm tới ECU an toàn-then chốt — chủ đề chương sau.</div>`,
  ]]);

const c7q = quiz('acs201-quiz-7', 'Quiz 7 — Diagnostics & gateway|||Quiz 7 — Chẩn đoán & gateway', [
  { id: 'q1', question: 'OBD-II ra đời chủ yếu vì lý do gì?', options: ['Để tăng công suất động cơ', 'Vì yêu cầu luật kiểm soát khí thải (đọc DTC, dữ liệu trực tiếp)', 'Để chơi nhạc trong xe', 'Để sạc pin nhanh'], correctIndex: 1, explanation: 'OBD-II là chuẩn bắt buộc theo luật khí thải, bộc lộ DTC và dữ liệu qua PID chuẩn.' },
  { id: 'q2', question: 'Trong UDS, dịch vụ SecurityAccess (0x27) dùng để làm gì?', options: ['Đọc vòng tua máy', 'Thử thách seed/key để mở quyền trước khi ghi hoặc flash firmware', 'Định tuyến bản tin', 'Đo nhiệt độ'], correctIndex: 1, explanation: 'SecurityAccess (0x27) là bước seed/key mở khóa quyền ghi/flash, chặn thao tác trái phép.' },
  { id: 'q3', question: 'Vai trò của ECU gateway là gì?', options: ['Chỉ để sạc ắc-quy', 'Định tuyến bản tin giữa các bus và cách ly các miền (vd tách chẩn đoán khỏi phanh)', 'Thay cho động cơ', 'Phát Wi-Fi cho hành khách'], correctIndex: 1, explanation: 'Gateway nối các bus, dịch ID, hạn chế lưu lượng và cách ly miền an toàn-then chốt.' },
]);

const c8 = doc('acs201-8-1-security-secoc-autosar', '8.1 — Automotive cybersecurity & AUTOSAR comm stack|||8.1 — An ninh mạng ô tô & AUTOSAR comm stack',
  'CAN không có xác thực → giả mạo được; SecOC thêm MAC + freshness chống replay; IDS phát hiện bất thường; AUTOSAR PDU/COM/PduR/CanIf/CanTp xếp lớp truyền thông.',
  [[
    `<span class="eyebrow">ACS201 · Chapter 8 · Lesson 8.1</span>
<h2>Automotive cybersecurity &amp; the AUTOSAR comm stack</h2>
<h3>Why the classic bus is vulnerable</h3>
<p>Classic CAN was designed for a closed, trusted network: it has <strong>no authentication and no encryption</strong>. Any node can send any ID, and every node believes it. Once an attacker reaches the bus (via a compromised infotainment or OBD dongle) they can <strong>spoof</strong> a brake or steering message and <strong>replay</strong> a captured one.</p>
<h3>SecOC — Secure Onboard Communication</h3>
<p><strong>SecOC</strong> adds authenticity to individual messages without changing the wire:</p>
<ul>
<li><strong>MAC (Message Authentication Code)</strong> — a cryptographic tag computed from the payload and a shared secret key; a receiver recomputes it and rejects any message whose tag does not match. Spoofing fails without the key.</li>
<li><strong>Freshness value</strong> — a counter/timestamp folded into the MAC so a captured-and-replayed message is detected as stale.</li>
</ul>
<pre><code>Sent PDU:  [ payload | truncated-MAC | freshness ]
Receiver:  recompute MAC over (payload+freshness) with shared key
           match?  -> accept    mismatch/old? -> drop
</code></pre>
<h3>Intrusion Detection (IDS)</h3>
<p>An <strong>IDS</strong> watches the bus for anomalies — an ID arriving faster than its known period, an ECU sending an ID it never should, impossible value jumps — and raises an alert to a gateway or the backend.</p>
<h3>The AUTOSAR communication stack</h3>
<pre><code>Application (SWCs)
  RTE
  COM      <- pack/unpack signals into PDUs
  PduR     <- route PDUs (incl. SecOC, Tp)
  CanIf    <- CAN interface abstraction
  CanTp    <- segment long messages (UDS)
  CAN Driver / Transceiver
</code></pre>
<p>Layering means an app writes a <em>signal</em>; COM packs it into a PDU, PduR routes it (through SecOC if secured), and the driver puts it on the wire — the app never touches raw frames.</p>
<div class="callout"><span class="badge">Defence in depth</span> No single layer is enough: segment the network (gateway), authenticate messages (SecOC), watch for anomalies (IDS), and keep keys and firmware updates secure.</div>`,
    `<span class="eyebrow">ACS201 · Chương 8 · Bài 8.1</span>
<h2>An ninh mạng ô tô &amp; AUTOSAR comm stack</h2>
<h3>Vì sao bus cổ điển dễ bị tấn công</h3>
<p>CAN cổ điển thiết kế cho một mạng đóng, tin cậy: nó <strong>không xác thực và không mã hóa</strong>. Bất kỳ nút nào cũng gửi được bất kỳ ID nào, và mọi nút đều tin. Một khi kẻ tấn công chạm tới bus (qua hệ giải trí bị chiếm hoặc dongle OBD) chúng có thể <strong>giả mạo</strong> một bản tin phanh hay lái và <strong>phát lại (replay)</strong> một bản tin đã bắt được.</p>
<h3>SecOC — Secure Onboard Communication</h3>
<p><strong>SecOC</strong> thêm tính xác thực cho từng bản tin mà không đổi lớp vật lý:</p>
<ul>
<li><strong>MAC (Message Authentication Code)</strong> — một thẻ mật mã tính từ dữ liệu và một khóa bí mật dùng chung; bên nhận tính lại và loại mọi bản tin có thẻ không khớp. Không có khóa thì giả mạo thất bại.</li>
<li><strong>Giá trị freshness</strong> — một bộ đếm/timestamp gộp vào MAC để một bản tin bị bắt-rồi-phát-lại bị phát hiện là cũ.</li>
</ul>
<pre><code>PDU gui:  [ payload | MAC cat gon | freshness ]
Ben nhan: tinh lai MAC tren (payload+freshness) bang khoa chung
          khop?  -> nhan    lech/cu? -> bo
</code></pre>
<h3>Phát hiện xâm nhập (IDS)</h3>
<p>Một <strong>IDS</strong> theo dõi bus tìm bất thường — một ID tới nhanh hơn chu kỳ đã biết, một ECU gửi ID lẽ ra không được, giá trị nhảy bất khả — và báo động lên gateway hoặc backend.</p>
<h3>Communication stack của AUTOSAR</h3>
<pre><code>Application (SWCs)
  RTE
  COM      <- dong/mo goi tin hieu thanh PDU
  PduR     <- dinh tuyen PDU (gom SecOC, Tp)
  CanIf    <- truu tuong giao dien CAN
  CanTp    <- cat nho ban tin dai (UDS)
  CAN Driver / Transceiver
</code></pre>
<p>Phân lớp nghĩa là ứng dụng ghi một <em>tín hiệu</em>; COM đóng nó vào PDU, PduR định tuyến (qua SecOC nếu được bảo mật), và driver đặt lên dây — ứng dụng không bao giờ chạm khung thô.</p>
<div class="callout"><span class="badge">Phòng thủ nhiều lớp</span> Không lớp nào đủ một mình: chia mạng (gateway), xác thực bản tin (SecOC), canh bất thường (IDS), và giữ khóa cùng bản cập nhật firmware an toàn.</div>`,
  ]]);

const c8q = quiz('acs201-quiz-8', 'Quiz 8 — Cybersecurity & AUTOSAR|||Quiz 8 — An ninh & AUTOSAR', [
  { id: 'q1', question: 'Vì sao CAN cổ điển dễ bị giả mạo bản tin?', options: ['Vì nó quá chậm', 'Vì nó không có xác thực/mã hóa — mọi nút gửi được mọi ID và đều được tin', 'Vì dùng cáp quang', 'Vì có quá nhiều dây'], correctIndex: 1, explanation: 'CAN thiết kế cho mạng đóng tin cậy, không xác thực nên kẻ chạm được bus có thể giả mạo/replay.' },
  { id: 'q2', question: 'SecOC chống tấn công phát lại (replay) bằng cách nào?', options: ['Tăng tốc độ bus', 'Gộp giá trị freshness (bộ đếm/timestamp) vào MAC để phát hiện bản tin cũ', 'Xóa hết dữ liệu', 'Thêm dây thứ ba'], correctIndex: 1, explanation: 'Freshness value trong MAC khiến một bản tin cũ bị bắt-phát-lại bị nhận diện là lỗi thời.' },
  { id: 'q3', question: 'Trong AUTOSAR comm stack, lớp COM làm gì?', options: ['Đặt bit lên dây vật lý', 'Đóng/mở gói tín hiệu thành PDU cho ứng dụng', 'Cấp nguồn cho ECU', 'Đo nhiệt độ động cơ'], correctIndex: 1, explanation: 'COM pack/unpack signal thành PDU; PduR định tuyến, CanIf/CanTp/Driver lo phần dưới.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'ACS201',
    slug: 'acs201-automotive-communication-systems',
    title: 'Automotive Communication Systems',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ACS201.webp',
    shortDescription: 'In-vehicle networks — classes & OSI layering, CAN (physical, frames, arbitration, errors, CAN FD), LIN, FlexRay, Automotive Ethernet & SOME/IP, UDS/OBD-II diagnostics & gateways, cybersecurity (SecOC, IDS) & AUTOSAR stack. Bilingual, examples & quizzes.|||Mạng truyền thông trên ô tô — phân lớp & OSI, CAN (vật lý, khung, arbitration, lỗi, CAN FD), LIN, FlexRay, Automotive Ethernet & SOME/IP, chẩn đoán UDS/OBD-II & gateway, an ninh mạng (SecOC, IDS) & stack AUTOSAR. Song ngữ, ví dụ & quiz.',
    description: 'Môn <strong>ACS201 — Automotive Communication Systems</strong> (Hệ thống truyền thông trên ô tô, kỳ 7) dạy các <strong>hệ bus</strong> nối 70-150 ECU trong một chiếc xe. Từ <strong>mạng trong xe &amp; phân lớp</strong> → <strong>CAN</strong> (lớp vật lý, khung dữ liệu, arbitration, xử lý lỗi, CAN&nbsp;FD) → <strong>LIN</strong> (chi phí thấp) → <strong>FlexRay</strong> (tất định) → <strong>Automotive Ethernet &amp; SOME/IP</strong> → chẩn đoán <strong>UDS/OBD-II</strong> &amp; gateway → <strong>an ninh mạng</strong> (SecOC, IDS) &amp; communication stack AUTOSAR. Bám chuẩn Bosch CAN 2.0, ISO 11898, LIN 2.2, FlexRay 3.0 và Automotive Ethernet; song ngữ, có ví dụ khung dữ liệu &amp; quiz mỗi chương.',
    whatYouLearn: 'Phân lớp mạng SAE A/B/C/D &amp; mô hình OSI ô tô; CAN vật lý (vi sai, dominant/recessive, 120Ω) &amp; khung dữ liệu; arbitration không phá hủy, xử lý lỗi, error states, CAN FD; LIN (master/slave, schedule table, khung break/sync/PID); FlexRay (TDMA, static/dynamic segment, dự phòng); Automotive Ethernet (100/1000BASE-T1) &amp; SOME/IP (publish/subscribe, RPC); chẩn đoán OBD-II &amp; UDS (SID, SecurityAccess, flash) &amp; gateway; an ninh (SecOC MAC + freshness, IDS) &amp; AUTOSAR comm stack (COM/PduR/CanIf/CanTp).',
    requirements: 'Kiến thức cơ bản về điện tử số và lập trình C. Nên biết hệ nhị phân/hex. Xem điều kiện tiên quyết ngành Kỹ thuật phần mềm ô tô trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide FLM, chuẩn (Bosch CAN, ISO 11898, LIN, FlexRay, Ethernet), công cụ, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao xe cần mạng; bốn sức ép; lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Mạng trong xe & phân lớp|||Chapter 1 — In-vehicle networks & layering', description: 'Bus, phân lớp SAE, topology, OSI.', lessons: [c1, c1q] },
    { title: 'Chương 2 — CAN: vật lý & khung|||Chapter 2 — CAN: physical & frame', description: 'Vi sai, dominant/recessive, khung dữ liệu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — CAN: arbitration, lỗi & FD|||Chapter 3 — CAN: arbitration, errors & FD', description: 'Arbitration, xử lý lỗi, CAN FD.', lessons: [c3, c3q] },
    { title: 'Chương 4 — LIN bus|||Chapter 4 — LIN bus', description: 'Master/slave, schedule table, khung LIN.', lessons: [c4, c4q] },
    { title: 'Chương 5 — FlexRay|||Chapter 5 — FlexRay', description: 'TDMA, tất định, dự phòng hai kênh.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ethernet & SOME/IP|||Chapter 6 — Ethernet & SOME/IP', description: 'BASE-T1, switch, hướng dịch vụ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Chẩn đoán UDS/OBD-II & gateway|||Chapter 7 — UDS/OBD-II diagnostics & gateway', description: 'OBD-II, UDS SID, gateway.', lessons: [c7, c7q] },
    { title: 'Chương 8 — An ninh mạng & AUTOSAR|||Chapter 8 — Cybersecurity & AUTOSAR', description: 'SecOC, IDS, AUTOSAR comm stack.', lessons: [c8, c8q] },
  ],
};
