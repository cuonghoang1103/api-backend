/**
 * OCC301 — Out-Car Connectivity (Kết nối ngoài xe / V2X & Connected Car).
 * Ngành Kỹ thuật phần mềm ô tô, kỳ 8, FPTU. Giáo trình chuẩn (trích dẫn):
 * 3GPP C-V2X; IEEE 802.11p/DSRC; ETSI ITS-G5; "Vehicular Networking"
 * (Sommer & Dressler); AWS/Azure IoT for connected vehicles; ISO 20078
 * (Extended Vehicle). Song ngữ + ví dụ + quiz.
 * ⚠️ KHÔNG backtick lồng/${; HTML "&"→&amp;, "<"→&lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('occ301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: chuẩn 3GPP/IEEE/ETSI, sách Vehicular Networking, whitepaper IoT xe kết nối, ISO 20078, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">OCC301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>out-car connectivity</strong> — telematics, cellular &amp; V2X, IoT protocols, OTA, HD maps, cybersecurity and fleet applications — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for OCC301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books &amp; standards</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Vehicular+Networking-p-9781118380154" target="_blank" rel="noopener"><em>Vehicular Networking</em> — Sommer &amp; Dressler</a></li>
<li><a href="https://www.3gpp.org/technologies/c-v2x" target="_blank" rel="noopener">3GPP C-V2X specifications</a></li>
<li><a href="https://www.etsi.org/technologies/automotive-intelligent-transport" target="_blank" rel="noopener">ETSI ITS-G5 / Intelligent Transport</a></li>
<li><a href="https://www.iso.org/standard/78576.html" target="_blank" rel="noopener">ISO 20078 — Extended Vehicle (ExVe) web services</a></li>
</ul>
<h3>🌐 Cloud / free documentation</h3>
<ul>
<li><a href="https://docs.aws.amazon.com/whitepapers/latest/connected-vehicle-solution/connected-vehicle-solution.html" target="_blank" rel="noopener">AWS — Connected Vehicle Solution whitepaper</a></li>
<li><a href="https://learn.microsoft.com/en-us/azure/iot/" target="_blank" rel="noopener">Azure IoT documentation for connected vehicles</a></li>
<li><a href="https://mqtt.org/" target="_blank" rel="noopener">MQTT.org — protocol spec &amp; tutorials</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@5GTechnologyWorld" target="_blank" rel="noopener">5G &amp; cellular technology explainers</a></li>
<li><a href="https://www.youtube.com/@AWSEventsChannel" target="_blank" rel="noopener">AWS Events — IoT &amp; connected vehicle talks</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://mosquitto.org/" target="_blank" rel="noopener">Eclipse Mosquitto</a> — open-source MQTT broker</li>
<li><a href="https://mqttx.app/" target="_blank" rel="noopener">MQTTX</a> — MQTT client for testing telemetry</li>
<li><a href="https://www.wireshark.org/" target="_blank" rel="noopener">Wireshark</a> — inspect V2X &amp; network packets</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — connected-car architecture, the TCU, and what data leaves the vehicle.</li>
<li><strong>Networks</strong> — cellular (4G/5G), C-V2X sidelink vs DSRC, and the V2X message set.</li>
<li><strong>Cloud</strong> — MQTT/CoAP telemetry into an IoT backend; OTA update pipelines.</li>
<li><strong>Job-ready</strong> — secure the link (PKI, misbehaviour detection), respect privacy, ship fleet features.</li>
</ol></div>`,
    `<span class="eyebrow">OCC301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>kết nối ngoài xe</strong> — telematics, mạng di động &amp; V2X, giao thức IoT, OTA, bản đồ HD, an ninh mạng và ứng dụng đội xe — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của OCC301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách &amp; tiêu chuẩn tham khảo</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Vehicular+Networking-p-9781118380154" target="_blank" rel="noopener"><em>Vehicular Networking</em> — Sommer &amp; Dressler</a></li>
<li><a href="https://www.3gpp.org/technologies/c-v2x" target="_blank" rel="noopener">Đặc tả C-V2X của 3GPP</a></li>
<li><a href="https://www.etsi.org/technologies/automotive-intelligent-transport" target="_blank" rel="noopener">ETSI ITS-G5 / Giao thông thông minh</a></li>
<li><a href="https://www.iso.org/standard/78576.html" target="_blank" rel="noopener">ISO 20078 — Dịch vụ web Extended Vehicle (ExVe)</a></li>
</ul>
<h3>🌐 Tài liệu đám mây / miễn phí</h3>
<ul>
<li><a href="https://docs.aws.amazon.com/whitepapers/latest/connected-vehicle-solution/connected-vehicle-solution.html" target="_blank" rel="noopener">AWS — Whitepaper giải pháp xe kết nối</a></li>
<li><a href="https://learn.microsoft.com/en-us/azure/iot/" target="_blank" rel="noopener">Tài liệu Azure IoT cho xe kết nối</a></li>
<li><a href="https://mqtt.org/" target="_blank" rel="noopener">MQTT.org — đặc tả giao thức &amp; hướng dẫn</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@5GTechnologyWorld" target="_blank" rel="noopener">Giải thích 5G &amp; công nghệ di động</a></li>
<li><a href="https://www.youtube.com/@AWSEventsChannel" target="_blank" rel="noopener">AWS Events — IoT &amp; xe kết nối</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://mosquitto.org/" target="_blank" rel="noopener">Eclipse Mosquitto</a> — broker MQTT mã nguồn mở</li>
<li><a href="https://mqttx.app/" target="_blank" rel="noopener">MQTTX</a> — client MQTT để thử telemetry</li>
<li><a href="https://www.wireshark.org/" target="_blank" rel="noopener">Wireshark</a> — soi gói V2X &amp; mạng</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — kiến trúc xe kết nối, bộ TCU, và dữ liệu nào rời khỏi xe.</li>
<li><strong>Mạng</strong> — di động (4G/5G), C-V2X sidelink vs DSRC, và bộ bản tin V2X.</li>
<li><strong>Đám mây</strong> — telemetry MQTT/CoAP vào backend IoT; pipeline cập nhật OTA.</li>
<li><strong>Sẵn sàng đi làm</strong> — bảo mật liên kết (PKI, phát hiện hành vi sai), tôn trọng riêng tư, làm tính năng đội xe.</li>
</ol></div>`,
  ]]);

const intro = doc('occ301-0-1-overview', 'Course overview: connected car & V2X|||Tổng quan: xe kết nối & V2X',
  'Kết nối ngoài xe là gì; vì sao xe cần nói chuyện với đám mây, hạ tầng và xe khác; lộ trình 8 chương: TCU → di động/C-V2X → V2X → IoT/đám mây → OTA → bản đồ HD → an ninh → ứng dụng.',
  [[
    `<span class="eyebrow">OCC301 · Lesson 0.1 · Overview</span>
<h2>Out-car connectivity</h2>
<p class="lead">A modern car is a <strong>node on a network</strong>. This course is about everything that happens <em>outside</em> the vehicle boundary: how a car talks to the <strong>cloud</strong>, to <strong>roadside infrastructure</strong>, to <strong>other vehicles</strong>, and to <strong>pedestrians</strong> — and how software engineers build, connect and secure those links.</p>
<h3>Why connectivity matters</h3>
<ul>
<li><strong>Safety</strong> — a car that knows about a crash around a blind corner can warn the driver before any sensor sees it.</li>
<li><strong>Software-defined vehicle</strong> — features and fixes arrive over the air (OTA), long after the car leaves the factory.</li>
<li><strong>Services</strong> — live traffic, HD maps, remote diagnostics, fleet management and pay-as-you-drive all depend on the vehicle being online.</li>
</ul>
<h3>Roadmap</h3>
<p>Telematics architecture &amp; the <strong>TCU</strong> → <strong>cellular</strong> (4G/5G) &amp; C-V2X → <strong>V2X</strong> (V2V/V2I/V2P), DSRC vs C-V2X → <strong>IoT protocols</strong> (MQTT/CoAP) &amp; cloud backends → <strong>OTA</strong> updates → <strong>HD maps</strong> &amp; positioning → <strong>cybersecurity</strong> &amp; privacy → real-world <strong>applications</strong>. Bilingual, with worked examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">OCC301 · Bài 0.1 · Tổng quan</span>
<h2>Kết nối ngoài xe</h2>
<p class="lead">Ô tô hiện đại là một <strong>nút trên mạng</strong>. Môn này nói về mọi thứ diễn ra <em>bên ngoài</em> ranh giới chiếc xe: xe nói chuyện với <strong>đám mây</strong>, với <strong>hạ tầng ven đường</strong>, với <strong>xe khác</strong> và với <strong>người đi bộ</strong> ra sao — và kỹ sư phần mềm dựng, kết nối, bảo mật các liên kết đó thế nào.</p>
<h3>Vì sao kết nối lại quan trọng</h3>
<ul>
<li><strong>An toàn</strong> — chiếc xe biết có va chạm sau khúc cua khuất có thể cảnh báo tài xế trước khi bất kỳ cảm biến nào thấy.</li>
<li><strong>Xe định nghĩa bằng phần mềm</strong> — tính năng và bản vá đến qua mạng (OTA), rất lâu sau khi xe rời nhà máy.</li>
<li><strong>Dịch vụ</strong> — giao thông trực tiếp, bản đồ HD, chẩn đoán từ xa, quản lý đội xe và trả tiền theo quãng lái đều cần xe đang online.</li>
</ul>
<h3>Lộ trình</h3>
<p>Kiến trúc telematics &amp; <strong>TCU</strong> → <strong>di động</strong> (4G/5G) &amp; C-V2X → <strong>V2X</strong> (V2V/V2I/V2P), DSRC vs C-V2X → <strong>giao thức IoT</strong> (MQTT/CoAP) &amp; backend đám mây → cập nhật <strong>OTA</strong> → <strong>bản đồ HD</strong> &amp; định vị → <strong>an ninh mạng</strong> &amp; riêng tư → <strong>ứng dụng</strong> thực tế. Song ngữ, có ví dụ và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('occ301-1-1-connected-car-tcu', '1.1 — Connected car & telematics (TCU)|||1.1 — Xe kết nối & telematics (TCU)',
  'Kiến trúc xe kết nối; bộ điều khiển telematics (TCU) — modem, GNSS, gateway; embedded/tethered/integrated; luồng dữ liệu xe → đám mây; eCall.',
  [[
    `<span class="eyebrow">OCC301 · Chapter 1 · Lesson 1.1</span>
<h2>Connected car &amp; telematics</h2>
<h3>The Telematics Control Unit (TCU)</h3>
<p>The <strong>TCU</strong> is the car's gateway to the outside world — the ECU that owns the external radios. It typically integrates:</p>
<ul>
<li>A <strong>cellular modem</strong> (4G/5G) with an embedded SIM (eSIM) for the data link.</li>
<li>A <strong>GNSS receiver</strong> (GPS/Galileo) for position &amp; time.</li>
<li>A short-range radio (Wi-Fi / Bluetooth) and often a <strong>V2X</strong> radio.</li>
<li>A <strong>secure gateway</strong> bridging the internal vehicle buses (CAN, Automotive Ethernet) to the outside — never a direct connection.</li>
</ul>
<h3>Three connectivity models</h3>
<ul>
<li><strong>Embedded</strong> — the car has its own modem &amp; SIM (most OEM telematics today).</li>
<li><strong>Tethered</strong> — the car uses a plugged-in phone's data.</li>
<li><strong>Integrated (smartphone projection)</strong> — Android Auto / CarPlay mirror the phone.</li>
</ul>
<h3>Data flow, north- and south-bound</h3>
<pre><code>[Sensors/ECUs] --CAN/Ethernet--&gt; [Gateway] --&gt; [TCU]
        |                                          |
        v                                          v cellular (TLS)
  in-vehicle domain                        [Cloud backend / OEM]
</code></pre>
<div class="callout"><span class="badge">eCall</span> In the EU, new cars must carry <strong>eCall</strong>: on a severe crash the TCU auto-dials 112 and sends a Minimum Set of Data (position, time, VIN, direction) — the original safety-critical connected-car feature.</div>`,
    `<span class="eyebrow">OCC301 · Chương 1 · Bài 1.1</span>
<h2>Xe kết nối &amp; telematics</h2>
<h3>Bộ điều khiển telematics (TCU)</h3>
<p><strong>TCU</strong> là cổng ra thế giới bên ngoài của xe — ECU nắm các radio đối ngoại. Nó thường tích hợp:</p>
<ul>
<li>Một <strong>modem di động</strong> (4G/5G) với SIM nhúng (eSIM) cho đường dữ liệu.</li>
<li>Một <strong>bộ thu GNSS</strong> (GPS/Galileo) cho vị trí &amp; thời gian.</li>
<li>Radio tầm ngắn (Wi-Fi / Bluetooth) và thường có radio <strong>V2X</strong>.</li>
<li>Một <strong>gateway bảo mật</strong> nối các bus nội bộ (CAN, Automotive Ethernet) ra ngoài — không bao giờ nối trực tiếp.</li>
</ul>
<h3>Ba mô hình kết nối</h3>
<ul>
<li><strong>Embedded (nhúng)</strong> — xe có modem &amp; SIM riêng (phổ biến nhất ở telematics OEM).</li>
<li><strong>Tethered (buộc dây)</strong> — xe dùng dữ liệu của điện thoại cắm vào.</li>
<li><strong>Integrated (chiếu điện thoại)</strong> — Android Auto / CarPlay phản chiếu điện thoại.</li>
</ul>
<h3>Luồng dữ liệu hai chiều</h3>
<pre><code>[Cảm biến/ECU] --CAN/Ethernet--&gt; [Gateway] --&gt; [TCU]
        |                                           |
        v                                           v di động (TLS)
  miền trong xe                            [Backend đám mây / OEM]
</code></pre>
<div class="callout"><span class="badge">eCall</span> Ở EU, xe mới bắt buộc có <strong>eCall</strong>: khi va chạm nặng, TCU tự gọi 112 và gửi Bộ dữ liệu tối thiểu (vị trí, thời gian, VIN, hướng) — tính năng xe kết nối an toàn đầu tiên.</div>`,
  ]]);

const c1q = quiz('occ301-quiz-1', 'Quiz 1 — Connected car & TCU|||Quiz 1 — Xe kết nối & TCU', [
  { id: 'q1', question: 'Bộ TCU (Telematics Control Unit) đóng vai trò gì trong xe?', options: ['Điều khiển động cơ', 'Cổng ra thế giới bên ngoài (modem, GNSS, gateway)', 'Phanh ABS', 'Hệ thống treo'], correctIndex: 1, explanation: 'TCU là gateway đối ngoại: chứa modem di động, GNSS và nối bus nội bộ ra ngoài.' },
  { id: 'q2', question: 'Mô hình kết nối "embedded" nghĩa là gì?', options: ['Xe dùng dữ liệu của điện thoại cắm vào', 'Xe có modem & SIM riêng', 'Chiếu màn hình điện thoại lên xe', 'Không có kết nối'], correctIndex: 1, explanation: 'Embedded: xe tự có modem và eSIM riêng, phổ biến nhất ở telematics OEM.' },
  { id: 'q3', question: 'Tính năng eCall ở EU làm gì khi va chạm nặng?', options: ['Tắt máy xe', 'Tự gọi 112 và gửi vị trí, thời gian, VIN', 'Mở khoá cửa', 'Sạc pin'], correctIndex: 1, explanation: 'eCall tự quay số khẩn cấp 112 và gửi Bộ dữ liệu tối thiểu gồm vị trí, thời gian, VIN, hướng.' },
]);

const c2 = doc('occ301-2-1-cellular-cv2x', '2.1 — Cellular networks & C-V2X|||2.1 — Mạng di động & C-V2X',
  'Mạng di động cho ô tô: 3G→4G LTE→5G NR; độ trễ & băng thông; network slicing & MEC; C-V2X (Uu qua trạm phát vs PC5 sidelink trực tiếp).',
  [[
    `<span class="eyebrow">OCC301 · Chapter 2 · Lesson 2.1</span>
<h2>Cellular networks &amp; C-V2X</h2>
<h3>From 4G to 5G</h3>
<p>Cars ride the same mobile networks as phones, but demand more of them. <strong>4G LTE</strong> gives broad coverage for telematics and infotainment. <strong>5G NR</strong> adds three regimes that matter for vehicles:</p>
<ul>
<li><strong>eMBB</strong> — high bandwidth for HD map downloads, video.</li>
<li><strong>URLLC</strong> — ultra-reliable, low-latency (target ~1 ms) for safety messaging.</li>
<li><strong>mMTC</strong> — massive machine-type comms for dense IoT/sensors.</li>
</ul>
<p><strong>MEC</strong> (multi-access edge computing) pushes compute close to the road so latency stays low; <strong>network slicing</strong> reserves a virtual slice with guaranteed quality for safety traffic.</p>
<h3>C-V2X: two interfaces</h3>
<p>Cellular-V2X (defined by <strong>3GPP</strong>, Rel-14 LTE-V2X → Rel-16 5G NR-V2X) has two radio interfaces:</p>
<ul>
<li><strong>Uu</strong> — through the base station (network-assisted), for cloud &amp; long-range services.</li>
<li><strong>PC5 (sidelink)</strong> — <em>direct</em> car-to-car / car-to-roadside, <strong>with no cellular network or SIM needed</strong>. This is the safety path.</li>
</ul>
<pre><code>Vehicle A  --PC5 sidelink (direct, ~ms)--&gt;  Vehicle B
Vehicle A  --Uu--&gt; [gNB base station] --&gt; [cloud/MEC]
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Safety-critical V2X does <strong>not</strong> depend on network coverage — PC5 sidelink works peer-to-peer even in a tunnel or dead zone.</div>`,
    `<span class="eyebrow">OCC301 · Chương 2 · Bài 2.1</span>
<h2>Mạng di động &amp; C-V2X</h2>
<h3>Từ 4G lên 5G</h3>
<p>Xe dùng chung mạng di động với điện thoại nhưng đòi hỏi nhiều hơn. <strong>4G LTE</strong> cho vùng phủ rộng phục vụ telematics và giải trí. <strong>5G NR</strong> thêm ba chế độ quan trọng với xe:</p>
<ul>
<li><strong>eMBB</strong> — băng thông cao để tải bản đồ HD, video.</li>
<li><strong>URLLC</strong> — siêu tin cậy, độ trễ cực thấp (mục tiêu ~1 ms) cho bản tin an toàn.</li>
<li><strong>mMTC</strong> — truyền thông kiểu máy quy mô lớn cho IoT/cảm biến dày đặc.</li>
</ul>
<p><strong>MEC</strong> (điện toán biên đa truy cập) đẩy tính toán về sát mặt đường để giữ độ trễ thấp; <strong>network slicing</strong> dành một lát ảo có chất lượng bảo đảm cho lưu lượng an toàn.</p>
<h3>C-V2X: hai giao diện</h3>
<p>Cellular-V2X (do <strong>3GPP</strong> định nghĩa, Rel-14 LTE-V2X → Rel-16 5G NR-V2X) có hai giao diện radio:</p>
<ul>
<li><strong>Uu</strong> — qua trạm phát (có mạng hỗ trợ), cho dịch vụ đám mây &amp; tầm xa.</li>
<li><strong>PC5 (sidelink)</strong> — <em>trực tiếp</em> xe-xe / xe-hạ tầng, <strong>không cần mạng di động hay SIM</strong>. Đây là đường an toàn.</li>
</ul>
<pre><code>Xe A  --PC5 sidelink (trực tiếp, ~ms)--&gt;  Xe B
Xe A  --Uu--&gt; [trạm gNB] --&gt; [đám mây/MEC]
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> V2X an toàn <strong>không</strong> phụ thuộc vùng phủ — PC5 sidelink chạy ngang hàng ngay cả trong hầm hay vùng chết sóng.</div>`,
  ]]);

const c2q = quiz('occ301-quiz-2', 'Quiz 2 — Cellular & C-V2X|||Quiz 2 — Di động & C-V2X', [
  { id: 'q1', question: 'Chế độ 5G nào nhắm tới độ trễ cực thấp cho bản tin an toàn?', options: ['eMBB', 'URLLC', 'mMTC', 'GNSS'], correctIndex: 1, explanation: 'URLLC (ultra-reliable low-latency) mục tiêu ~1 ms, dành cho truyền thông an toàn.' },
  { id: 'q2', question: 'Giao diện PC5 (sidelink) của C-V2X có đặc điểm gì?', options: ['Bắt buộc qua trạm phát và SIM', 'Truyền trực tiếp xe-xe, không cần mạng di động', 'Chỉ tải bản đồ HD', 'Chỉ dùng trong nhà máy'], correctIndex: 1, explanation: 'PC5 là sidelink truyền trực tiếp ngang hàng, chạy ngay cả khi không có phủ sóng.' },
  { id: 'q3', question: 'MEC (multi-access edge computing) giúp gì cho xe kết nối?', options: ['Tăng dung lượng pin', 'Đẩy tính toán về sát mặt đường để giảm độ trễ', 'Thay thế GPS', 'Nén ảnh'], correctIndex: 1, explanation: 'MEC đặt tính toán ở biên gần xe, giảm độ trễ so với đám mây tập trung.' },
]);

const c3 = doc('occ301-3-1-v2x-dsrc-cv2x', '3.1 — V2X: V2V/V2I/V2P & DSRC vs C-V2X|||3.1 — V2X: V2V/V2I/V2P & DSRC vs C-V2X',
  'Các loại V2X (V2V/V2I/V2P/V2N); bộ bản tin (BSM/CAM, DENM); hai công nghệ radio: DSRC/IEEE 802.11p/ITS-G5 vs C-V2X PC5; băng tần 5.9 GHz.',
  [[
    `<span class="eyebrow">OCC301 · Chapter 3 · Lesson 3.1</span>
<h2>V2X: the vehicle talks to everything</h2>
<h3>Flavours of V2X</h3>
<ul>
<li><strong>V2V</strong> — vehicle-to-vehicle (forward collision, blind-spot, emergency brake warnings).</li>
<li><strong>V2I</strong> — vehicle-to-infrastructure (traffic lights, road signs, work zones).</li>
<li><strong>V2P</strong> — vehicle-to-pedestrian (phones, bicycles, vulnerable road users).</li>
<li><strong>V2N</strong> — vehicle-to-network (cloud services over cellular).</li>
</ul>
<h3>The message set</h3>
<p>Cars broadcast a periodic <em>heartbeat</em> ~10 times a second and event alerts on demand:</p>
<ul>
<li><strong>BSM</strong> (US) / <strong>CAM</strong> (EU) — the awareness beacon: position, speed, heading, size.</li>
<li><strong>DENM</strong> (EU) — a decentralized <em>event</em> notification (hazard, hard braking).</li>
</ul>
<h3>Two radio technologies — one band</h3>
<p>Both compete in the <strong>5.9 GHz</strong> ITS band:</p>
<ul>
<li><strong>DSRC</strong> — based on <strong>IEEE 802.11p</strong> (EU profile: <strong>ETSI ITS-G5</strong>). Wi-Fi-derived, mature, ad-hoc, works today with no operator.</li>
<li><strong>C-V2X PC5</strong> — 3GPP sidelink. Better range/reliability in tests, and a clean upgrade path to 5G NR-V2X.</li>
</ul>
<div class="callout"><span class="badge">The trade-off</span> DSRC/ITS-G5 is proven and infrastructure-free; C-V2X evolves with cellular and shares hardware with the modem. Regions have picked different winners — a real interoperability headache.</div>`,
    `<span class="eyebrow">OCC301 · Chương 3 · Bài 3.1</span>
<h2>V2X: xe nói chuyện với mọi thứ</h2>
<h3>Các loại V2X</h3>
<ul>
<li><strong>V2V</strong> — xe-xe (cảnh báo va chạm phía trước, điểm mù, phanh khẩn cấp).</li>
<li><strong>V2I</strong> — xe-hạ tầng (đèn giao thông, biển báo, khu thi công).</li>
<li><strong>V2P</strong> — xe-người đi bộ (điện thoại, xe đạp, người dễ tổn thương).</li>
<li><strong>V2N</strong> — xe-mạng (dịch vụ đám mây qua di động).</li>
</ul>
<h3>Bộ bản tin</h3>
<p>Xe phát một <em>nhịp tim</em> định kỳ ~10 lần/giây và cảnh báo sự kiện khi cần:</p>
<ul>
<li><strong>BSM</strong> (Mỹ) / <strong>CAM</strong> (EU) — beacon nhận thức: vị trí, tốc độ, hướng, kích thước.</li>
<li><strong>DENM</strong> (EU) — thông báo <em>sự kiện</em> phi tập trung (nguy hiểm, phanh gấp).</li>
</ul>
<h3>Hai công nghệ radio — một băng tần</h3>
<p>Cả hai cạnh tranh trong băng ITS <strong>5.9 GHz</strong>:</p>
<ul>
<li><strong>DSRC</strong> — dựa trên <strong>IEEE 802.11p</strong> (bản EU: <strong>ETSI ITS-G5</strong>). Xuất phát từ Wi-Fi, trưởng thành, ad-hoc, chạy được ngay không cần nhà mạng.</li>
<li><strong>C-V2X PC5</strong> — sidelink của 3GPP. Tầm/độ tin cậy tốt hơn trong thử nghiệm, và có đường nâng cấp sạch lên 5G NR-V2X.</li>
</ul>
<div class="callout"><span class="badge">Đánh đổi</span> DSRC/ITS-G5 đã kiểm chứng và không cần hạ tầng; C-V2X tiến hoá cùng di động và dùng chung phần cứng với modem. Các khu vực chọn kẻ thắng khác nhau — một cơn đau đầu về tương tác thật sự.</div>`,
  ]]);

const c3q = quiz('occ301-quiz-3', 'Quiz 3 — V2X & radio|||Quiz 3 — V2X & radio', [
  { id: 'q1', question: 'Bản tin BSM/CAM trong V2X mang thông tin gì?', options: ['Nội dung nhạc đang phát', 'Vị trí, tốc độ, hướng, kích thước xe', 'Số dư tài khoản', 'Nhật ký lỗi động cơ'], correctIndex: 1, explanation: 'BSM (Mỹ)/CAM (EU) là beacon nhận thức phát định kỳ với vị trí, tốc độ, hướng, kích thước.' },
  { id: 'q2', question: 'DSRC dựa trên chuẩn radio nào?', options: ['IEEE 802.11p', 'Bluetooth 5.0', 'LoRaWAN', 'NFC'], correctIndex: 0, explanation: 'DSRC dựa trên IEEE 802.11p; bản EU tương ứng là ETSI ITS-G5.' },
  { id: 'q3', question: 'V2P (vehicle-to-pedestrian) nhắm tới đối tượng nào?', options: ['Đèn giao thông', 'Xe tải hạng nặng', 'Người đi bộ, xe đạp, người dễ tổn thương', 'Trạm phát 5G'], correctIndex: 2, explanation: 'V2P kết nối xe với người đi bộ và người tham gia giao thông dễ tổn thương (qua điện thoại, xe đạp).' },
]);

const c4 = doc('occ301-4-1-iot-mqtt-cloud', '4.1 — IoT protocols (MQTT, CoAP) & cloud|||4.1 — Giao thức IoT (MQTT, CoAP) & đám mây',
  'MQTT (publish/subscribe, topic, QoS, broker) vs CoAP (REST trên UDP); telemetry JSON; backend đám mây (device shadow, ingest, digital twin); ISO 20078.',
  [[
    `<span class="eyebrow">OCC301 · Chapter 4 · Lesson 4.1</span>
<h2>IoT protocols &amp; the cloud backend</h2>
<h3>MQTT — publish / subscribe</h3>
<p><strong>MQTT</strong> is the workhorse of vehicle telemetry: lightweight, over TCP, built for flaky links. A car <em>publishes</em> to a <strong>topic</strong>; the cloud <em>subscribes</em>. A <strong>broker</strong> routes messages. Three <strong>QoS</strong> levels trade reliability for cost (0 = at most once, 1 = at least once, 2 = exactly once).</p>
<pre><code>Topic:  vehicles/VIN123/telemetry
QoS:    1
Retain: false

# a subscriber gets every message on a topic filter
sub  vehicles/+/telemetry     # + = one level wildcard
sub  vehicles/VIN123/#        # # = multi-level wildcard
</code></pre>
<h3>A telemetry payload (JSON)</h3>
<pre><code>{
  "vin": "VIN123",
  "ts": 1731500000,
  "gps": { "lat": 21.0285, "lon": 105.8542 },
  "speed_kph": 54.2,
  "soc_pct": 78,
  "dtc": []
}
</code></pre>
<h3>CoAP — REST on UDP</h3>
<p><strong>CoAP</strong> mirrors HTTP verbs (GET/POST/PUT/DELETE) but runs over lightweight <strong>UDP</strong> with tiny headers — good for very constrained devices and request/response patterns rather than streaming.</p>
<h3>The cloud side</h3>
<p>An IoT backend (AWS IoT Core, Azure IoT Hub) ingests messages, keeps a <strong>device shadow / digital twin</strong> (last known state, desired state), and feeds analytics and apps. <strong>ISO 20078</strong> standardises OEM "Extended Vehicle" web APIs so third parties can read data with consent.</p>
<div class="callout"><span class="badge">Why pub/sub</span> A car with an intermittent connection can't hold open request/response sessions to many services — it publishes once, and any number of backend consumers get the data.</div>`,
    `<span class="eyebrow">OCC301 · Chương 4 · Bài 4.1</span>
<h2>Giao thức IoT &amp; backend đám mây</h2>
<h3>MQTT — publish / subscribe</h3>
<p><strong>MQTT</strong> là ngựa thồ của telemetry xe: nhẹ, chạy trên TCP, sinh ra cho đường truyền chập chờn. Xe <em>publish</em> lên một <strong>topic</strong>; đám mây <em>subscribe</em>. Một <strong>broker</strong> định tuyến bản tin. Ba mức <strong>QoS</strong> đánh đổi độ tin cậy lấy chi phí (0 = nhiều nhất một lần, 1 = ít nhất một lần, 2 = đúng một lần).</p>
<pre><code>Topic:  vehicles/VIN123/telemetry
QoS:    1
Retain: false

# subscriber nhận mọi bản tin khớp bộ lọc topic
sub  vehicles/+/telemetry     # + = ký tự đại diện một cấp
sub  vehicles/VIN123/#        # # = ký tự đại diện nhiều cấp
</code></pre>
<h3>Một gói telemetry (JSON)</h3>
<pre><code>{
  "vin": "VIN123",
  "ts": 1731500000,
  "gps": { "lat": 21.0285, "lon": 105.8542 },
  "speed_kph": 54.2,
  "soc_pct": 78,
  "dtc": []
}
</code></pre>
<h3>CoAP — REST trên UDP</h3>
<p><strong>CoAP</strong> mô phỏng các động từ HTTP (GET/POST/PUT/DELETE) nhưng chạy trên <strong>UDP</strong> nhẹ với header nhỏ xíu — hợp cho thiết bị rất hạn chế và mẫu yêu cầu/đáp ứng thay vì luồng liên tục.</p>
<h3>Phía đám mây</h3>
<p>Backend IoT (AWS IoT Core, Azure IoT Hub) thu nhận bản tin, giữ một <strong>device shadow / digital twin</strong> (trạng thái biết cuối, trạng thái mong muốn) và nuôi phân tích cùng ứng dụng. <strong>ISO 20078</strong> chuẩn hoá API web "Extended Vehicle" của OEM để bên thứ ba đọc dữ liệu khi có sự đồng ý.</p>
<div class="callout"><span class="badge">Vì sao pub/sub</span> Xe có kết nối gián đoạn không thể giữ phiên yêu cầu/đáp ứng với nhiều dịch vụ — nó publish một lần, và bao nhiêu consumer backend cũng nhận được dữ liệu.</div>`,
  ]]);

const c4q = quiz('occ301-quiz-4', 'Quiz 4 — IoT & cloud|||Quiz 4 — IoT & đám mây', [
  { id: 'q1', question: 'MQTT dùng mô hình truyền thông nào?', options: ['Yêu cầu/đáp ứng đồng bộ', 'Publish/subscribe qua broker', 'Broadcast không dây trực tiếp', 'Truyền file FTP'], correctIndex: 1, explanation: 'MQTT là publish/subscribe: xe publish lên topic, backend subscribe, broker định tuyến.' },
  { id: 'q2', question: 'MQTT QoS mức 2 bảo đảm điều gì?', options: ['Nhiều nhất một lần', 'Đúng một lần (exactly once)', 'Không bảo đảm gì', 'Chỉ chạy trên UDP'], correctIndex: 1, explanation: 'QoS 2 bảo đảm giao đúng một lần; QoS 0 nhiều nhất một lần, QoS 1 ít nhất một lần.' },
  { id: 'q3', question: 'Khác biệt chính của CoAP so với MQTT là gì?', options: ['CoAP là REST chạy trên UDP với header nhỏ', 'CoAP không dùng được cho IoT', 'CoAP nhanh hơn nhờ chạy trên vệ tinh', 'CoAP thay thế TLS'], correctIndex: 0, explanation: 'CoAP mô phỏng động từ HTTP nhưng chạy trên UDP nhẹ, hợp thiết bị hạn chế và mẫu request/response.' },
]);

const c5 = doc('occ301-5-1-ota-updates', '5.1 — Over-the-air (OTA) software updates|||5.1 — Cập nhật phần mềm qua mạng (OTA)',
  'FOTA vs SOTA; kiến trúc OTA (backend, campaign, download, cài đặt A/B); ký số & xác thực; rollback; an toàn khi cập nhật ECU; UNECE R156.',
  [[
    `<span class="eyebrow">OCC301 · Chapter 5 · Lesson 5.1</span>
<h2>Over-the-air software updates</h2>
<h3>FOTA vs SOTA</h3>
<ul>
<li><strong>FOTA</strong> — Firmware OTA: reflashing an ECU's firmware (e.g. the engine controller).</li>
<li><strong>SOTA</strong> — Software OTA: updating apps/services (infotainment, maps).</li>
</ul>
<h3>The pipeline</h3>
<pre><code>[OEM backend] --signed package--&gt; [TCU download]
   |                                    |
   campaign (which VINs, when)          verify signature
                                        |
                                        v
   install to INACTIVE bank (A/B) --&gt; verify --&gt; switch --&gt; boot
                                        |
                                        on failure --&gt; ROLL BACK to active bank
</code></pre>
<h3>Doing it safely</h3>
<ul>
<li><strong>Signed &amp; verified</strong> — the vehicle installs only packages signed by the OEM key; verify before and after write.</li>
<li><strong>A/B (dual-bank)</strong> — write to the inactive partition, then switch — the car is never left half-flashed.</li>
<li><strong>Rollback</strong> — if the new image fails to boot, fall back to the known-good bank.</li>
<li><strong>Conditions</strong> — many updates run only when parked, with enough battery, and with driver consent.</li>
</ul>
<div class="callout"><span class="badge">Regulation</span> <strong>UNECE R156</strong> requires a certified <em>Software Update Management System (SUMS)</em>: OEMs must track versions, prove integrity, and keep updates safe — OTA is a regulated safety process, not just a convenience.</div>`,
    `<span class="eyebrow">OCC301 · Chương 5 · Bài 5.1</span>
<h2>Cập nhật phần mềm qua mạng</h2>
<h3>FOTA vs SOTA</h3>
<ul>
<li><strong>FOTA</strong> — Firmware OTA: nạp lại firmware của một ECU (vd bộ điều khiển động cơ).</li>
<li><strong>SOTA</strong> — Software OTA: cập nhật ứng dụng/dịch vụ (giải trí, bản đồ).</li>
</ul>
<h3>Pipeline</h3>
<pre><code>[Backend OEM] --gói đã ký--&gt; [TCU tải về]
   |                              |
   chiến dịch (VIN nào, khi nào)  xác thực chữ ký
                                  |
                                  v
   cài vào bank KHÔNG hoạt động (A/B) --&gt; kiểm --&gt; chuyển --&gt; khởi động
                                  |
                                  nếu lỗi --&gt; QUAY LUI về bank đang chạy
</code></pre>
<h3>Làm sao cho an toàn</h3>
<ul>
<li><strong>Ký &amp; xác thực</strong> — xe chỉ cài gói được ký bằng khoá OEM; kiểm trước và sau khi ghi.</li>
<li><strong>A/B (hai bank)</strong> — ghi vào phân vùng không hoạt động rồi mới chuyển — xe không bao giờ bị nạp dở dang.</li>
<li><strong>Rollback</strong> — nếu ảnh mới không khởi động, quay về bank tốt đã biết.</li>
<li><strong>Điều kiện</strong> — nhiều bản chỉ chạy khi đỗ, đủ pin, và có sự đồng ý của tài xế.</li>
</ul>
<div class="callout"><span class="badge">Quy định</span> <strong>UNECE R156</strong> yêu cầu một <em>Hệ thống quản lý cập nhật phần mềm (SUMS)</em> được chứng nhận: OEM phải theo dõi phiên bản, chứng minh toàn vẹn và giữ cập nhật an toàn — OTA là quy trình an toàn có quản lý, không chỉ là tiện ích.</div>`,
  ]]);

const c5q = quiz('occ301-quiz-5', 'Quiz 5 — OTA updates|||Quiz 5 — Cập nhật OTA', [
  { id: 'q1', question: 'FOTA khác SOTA ở chỗ nào?', options: ['FOTA cập nhật firmware ECU, SOTA cập nhật ứng dụng/dịch vụ', 'FOTA chỉ chạy qua Wi-Fi', 'SOTA nhanh hơn FOTA', 'Chúng giống hệt nhau'], correctIndex: 0, explanation: 'FOTA = Firmware OTA (nạp lại firmware ECU); SOTA = Software OTA (ứng dụng, bản đồ...).' },
  { id: 'q2', question: 'Cơ chế A/B (dual-bank) trong OTA giúp gì?', options: ['Tăng gấp đôi tốc độ tải', 'Ghi vào phân vùng không hoạt động rồi mới chuyển, tránh nạp dở dang', 'Xoá dữ liệu người dùng', 'Bỏ qua bước ký số'], correctIndex: 1, explanation: 'Ghi ảnh mới vào bank không hoạt động, kiểm rồi chuyển; lỗi thì rollback về bank đang chạy.' },
  { id: 'q3', question: 'Trước khi cài, xe cần làm gì với gói cập nhật OTA?', options: ['Giải nén rồi cài ngay', 'Xác thực chữ ký của khoá OEM', 'Gửi lên mạng xã hội', 'Đổi tên tệp'], correctIndex: 1, explanation: 'Xe chỉ cài gói được ký bằng khoá OEM và xác thực chữ ký trước/sau khi ghi.' },
]);

const c6 = doc('occ301-6-1-positioning-hd-maps', '6.1 — Positioning, HD maps & telematics|||6.1 — Định vị, bản đồ HD & telematics',
  'GNSS & sai số; RTK/PPP, dead reckoning, sensor fusion; bản đồ HD (lớp, độ chính xác cm) & cập nhật động; dịch vụ telematics dựa vị trí.',
  [[
    `<span class="eyebrow">OCC301 · Chapter 6 · Lesson 6.1</span>
<h2>Positioning, HD maps &amp; telematics</h2>
<h3>Where is the car, exactly?</h3>
<p>Plain <strong>GNSS</strong> (GPS, Galileo, BeiDou) is accurate to a few metres — fine for navigation, not enough to keep a car in a lane. Precision comes from:</p>
<ul>
<li><strong>RTK / PPP</strong> — correction data (from base stations or satellites) pulls the fix down to <strong>centimetre</strong> level.</li>
<li><strong>Dead reckoning</strong> — wheel speed, IMU and steering keep position through tunnels where GNSS drops.</li>
<li><strong>Sensor fusion</strong> — combine GNSS + IMU + map matching in a filter (e.g. Kalman) for a smooth, robust position.</li>
</ul>
<h3>HD maps</h3>
<p>An <strong>HD map</strong> is far more than a road graph — it is a layered, centimetre-accurate model used by driver assistance:</p>
<ul>
<li>Lane geometry, markings, curvature and slope.</li>
<li>Signs, traffic lights, barriers as precise landmarks.</li>
<li>A dynamic layer for live hazards and roadworks, refreshed over the air.</li>
</ul>
<h3>Location-based telematics</h3>
<p>With position + connectivity you get live traffic, predictive routing, geofencing (fleets), usage-based insurance and stolen-vehicle recovery.</p>
<div class="callout"><span class="badge">Crowd-sourced maps</span> Connected cars are also map <em>sensors</em>: fleets report changes (a new sign, a closed lane) so the HD map's dynamic layer stays fresh far faster than survey vehicles alone could manage.</div>`,
    `<span class="eyebrow">OCC301 · Chương 6 · Bài 6.1</span>
<h2>Định vị, bản đồ HD &amp; telematics</h2>
<h3>Xe đang ở đâu, chính xác đến đâu?</h3>
<p><strong>GNSS</strong> thường (GPS, Galileo, BeiDou) chính xác vài mét — đủ cho dẫn đường, chưa đủ để giữ xe trong làn. Độ chính xác đến từ:</p>
<ul>
<li><strong>RTK / PPP</strong> — dữ liệu hiệu chỉnh (từ trạm gốc hoặc vệ tinh) kéo sai số xuống mức <strong>centimet</strong>.</li>
<li><strong>Dead reckoning</strong> — tốc độ bánh, IMU và góc lái giữ vị trí qua hầm nơi GNSS mất tín hiệu.</li>
<li><strong>Sensor fusion</strong> — kết hợp GNSS + IMU + khớp bản đồ trong bộ lọc (vd Kalman) cho vị trí mượt, vững.</li>
</ul>
<h3>Bản đồ HD</h3>
<p>Một <strong>bản đồ HD</strong> hơn xa một đồ thị đường — nó là mô hình nhiều lớp, chính xác centimet, dùng bởi hỗ trợ lái:</p>
<ul>
<li>Hình học làn, vạch kẻ, độ cong và độ dốc.</li>
<li>Biển báo, đèn tín hiệu, dải phân cách như mốc định vị chính xác.</li>
<li>Một lớp động cho nguy hiểm và thi công trực tiếp, làm mới qua mạng.</li>
</ul>
<h3>Telematics dựa vị trí</h3>
<p>Có vị trí + kết nối là có giao thông trực tiếp, định tuyến dự báo, geofencing (đội xe), bảo hiểm theo quãng lái và tìm xe bị trộm.</p>
<div class="callout"><span class="badge">Bản đồ cộng đồng</span> Xe kết nối cũng là <em>cảm biến</em> bản đồ: đội xe báo thay đổi (biển mới, làn đóng) để lớp động của bản đồ HD tươi mới nhanh hơn nhiều so với chỉ dùng xe khảo sát.</div>`,
  ]]);

const c6q = quiz('occ301-quiz-6', 'Quiz 6 — Positioning & HD maps|||Quiz 6 — Định vị & bản đồ HD', [
  { id: 'q1', question: 'Kỹ thuật nào kéo sai số định vị GNSS xuống mức centimet?', options: ['Nén JPEG', 'RTK / PPP (dữ liệu hiệu chỉnh)', 'Tăng công suất phát', 'Đổi băng tần Wi-Fi'], correctIndex: 1, explanation: 'RTK/PPP dùng dữ liệu hiệu chỉnh từ trạm gốc hoặc vệ tinh để đạt độ chính xác centimet.' },
  { id: 'q2', question: 'Dead reckoning giúp gì khi xe vào hầm mất tín hiệu GNSS?', options: ['Tắt định vị', 'Ước tính vị trí từ tốc độ bánh, IMU, góc lái', 'Gọi tổng đài', 'Tải lại bản đồ'], correctIndex: 1, explanation: 'Dead reckoning suy vị trí từ chuyển động (bánh xe, IMU, lái) khi GNSS gián đoạn.' },
  { id: 'q3', question: 'Điểm khác biệt của bản đồ HD so với bản đồ dẫn đường thường?', options: ['Chỉ có tên đường', 'Nhiều lớp, chính xác centimet, có lớp động cập nhật OTA', 'Chỉ dùng offline', 'Không có làn đường'], correctIndex: 1, explanation: 'Bản đồ HD mô hình hoá làn, mốc chính xác centimet và có lớp động làm mới qua mạng.' },
]);

const c7 = doc('occ301-7-1-security-privacy', '7.1 — Cybersecurity & data privacy|||7.1 — An ninh mạng & quyền riêng tư dữ liệu xe',
  'Bề mặt tấn công xe kết nối; V2X PKI & chứng chỉ giả danh (pseudonym); phát hiện hành vi sai; bảo mật TCU/gateway; UNECE R155 (CSMS); GDPR & riêng tư.',
  [[
    `<span class="eyebrow">OCC301 · Chapter 7 · Lesson 7.1</span>
<h2>Cybersecurity &amp; data privacy</h2>
<h3>An expanded attack surface</h3>
<p>Every radio is a door. A connected car can be attacked over cellular, V2X, Wi-Fi/Bluetooth, or a malicious OTA package — and the prize is the internal buses that move the car. Defence is layered: harden the <strong>TCU/gateway</strong>, isolate domains, authenticate every message.</p>
<h3>Trust in V2X: a PKI</h3>
<p>You can't trust a safety message from a stranger without proof. V2X uses a <strong>Public Key Infrastructure</strong>: each message is <strong>signed</strong>, and receivers check the certificate.</p>
<ul>
<li><strong>Pseudonym certificates</strong> — rotating short-lived IDs so a car is trusted <em>without</em> being trackable.</li>
<li><strong>Misbehaviour detection</strong> — flag and revoke a sender broadcasting implausible data (ghost cars, fake hazards).</li>
</ul>
<pre><code>Sender:   msg + signature(privKey) + pseudonym cert
Receiver: verify signature -&gt; check cert chain -&gt; plausibility check
          -&gt; if bad: drop &amp; report to misbehaviour authority
</code></pre>
<h3>Standards &amp; privacy</h3>
<ul>
<li><strong>UNECE R155</strong> — mandates a <em>Cyber Security Management System (CSMS)</em> across the vehicle lifecycle; <strong>ISO/SAE 21434</strong> is the engineering standard.</li>
<li><strong>Privacy</strong> — location and driving data are personal data. <strong>GDPR</strong> and data-minimisation apply: collect with consent, anonymise/pseudonymise, and be transparent about what leaves the car.</li>
</ul>
<div class="callout"><span class="badge">Privacy vs safety</span> V2X must broadcast position constantly to be useful, yet must not let anyone track an individual. Rotating pseudonyms are how the design squares that circle.</div>`,
    `<span class="eyebrow">OCC301 · Chương 7 · Bài 7.1</span>
<h2>An ninh mạng &amp; quyền riêng tư dữ liệu xe</h2>
<h3>Bề mặt tấn công mở rộng</h3>
<p>Mỗi radio là một cánh cửa. Xe kết nối có thể bị tấn công qua di động, V2X, Wi-Fi/Bluetooth, hoặc một gói OTA độc hại — và phần thưởng là các bus nội bộ điều khiển chiếc xe. Phòng thủ theo lớp: gia cố <strong>TCU/gateway</strong>, cô lập miền, xác thực mọi bản tin.</p>
<h3>Tin cậy trong V2X: một PKI</h3>
<p>Không thể tin bản tin an toàn từ người lạ mà không có bằng chứng. V2X dùng <strong>Hạ tầng khoá công khai (PKI)</strong>: mỗi bản tin được <strong>ký</strong>, bên nhận kiểm chứng chỉ.</p>
<ul>
<li><strong>Chứng chỉ giả danh (pseudonym)</strong> — ID ngắn hạn xoay vòng để xe được tin <em>mà không</em> bị theo dõi.</li>
<li><strong>Phát hiện hành vi sai</strong> — gắn cờ và thu hồi bên phát dữ liệu vô lý (xe ma, nguy hiểm giả).</li>
</ul>
<pre><code>Bên gửi:  bản tin + chữ ký(khoá bí mật) + chứng chỉ giả danh
Bên nhận: kiểm chữ ký -&gt; kiểm chuỗi chứng chỉ -&gt; kiểm tính hợp lý
          -&gt; nếu xấu: loại bỏ &amp; báo cho cơ quan quản lý hành vi
</code></pre>
<h3>Tiêu chuẩn &amp; riêng tư</h3>
<ul>
<li><strong>UNECE R155</strong> — bắt buộc một <em>Hệ thống quản lý an ninh mạng (CSMS)</em> suốt vòng đời xe; <strong>ISO/SAE 21434</strong> là tiêu chuẩn kỹ thuật.</li>
<li><strong>Riêng tư</strong> — dữ liệu vị trí và lái xe là dữ liệu cá nhân. <strong>GDPR</strong> và tối thiểu hoá dữ liệu áp dụng: thu thập khi có đồng ý, ẩn danh/giả danh, và minh bạch về thứ rời khỏi xe.</li>
</ul>
<div class="callout"><span class="badge">Riêng tư vs an toàn</span> V2X phải phát vị trí liên tục mới hữu ích, nhưng không được để ai theo dõi một cá nhân. Chứng chỉ giả danh xoay vòng là cách thiết kế giải bài toán đó.</div>`,
  ]]);

const c7q = quiz('occ301-quiz-7', 'Quiz 7 — Security & privacy|||Quiz 7 — An ninh & riêng tư', [
  { id: 'q1', question: 'Chứng chỉ giả danh (pseudonym certificate) trong V2X dùng để làm gì?', options: ['Tăng tốc độ mạng', 'Cho xe được tin cậy mà không bị theo dõi cá nhân', 'Mã hoá nhạc', 'Thay thế GPS'], correctIndex: 1, explanation: 'ID ngắn hạn xoay vòng cho phép xác thực bản tin mà không lộ danh tính bền vững của xe.' },
  { id: 'q2', question: 'UNECE R155 yêu cầu nhà sản xuất xe điều gì?', options: ['Một Hệ thống quản lý an ninh mạng (CSMS)', 'Sơn xe màu sáng', 'Tăng công suất động cơ', 'Bỏ hệ thống OTA'], correctIndex: 0, explanation: 'R155 bắt buộc CSMS suốt vòng đời xe; ISO/SAE 21434 là tiêu chuẩn kỹ thuật đi kèm.' },
  { id: 'q3', question: 'Bên nhận bản tin V2X làm gì để tin một bản tin an toàn?', options: ['Tin ngay không kiểm', 'Kiểm chữ ký, chuỗi chứng chỉ và tính hợp lý', 'Chỉ kiểm màu xe', 'Hỏi tài xế'], correctIndex: 1, explanation: 'Bên nhận xác thực chữ ký, kiểm chuỗi chứng chỉ và kiểm tính hợp lý; dữ liệu vô lý bị loại và báo cáo.' },
]);

const c8 = doc('occ301-8-1-applications-future', '8.1 — Applications & future standards|||8.1 — Ứng dụng & tiêu chuẩn tương lai',
  'Quản lý đội xe (telematics, geofencing, chẩn đoán từ xa); xe tự hành kết nối (đàn xe/platooning, cảm biến tập thể); tiêu chuẩn tương lai (5G NR-V2X, SDV, C-ITS).',
  [[
    `<span class="eyebrow">OCC301 · Chapter 8 · Lesson 8.1</span>
<h2>Applications &amp; future standards</h2>
<h3>Fleet management</h3>
<p>The biggest commercial payoff of connectivity. A fleet backend ingests telemetry from every vehicle and delivers:</p>
<ul>
<li><strong>Live tracking &amp; geofencing</strong> — where each vehicle is, alerts when it leaves a zone.</li>
<li><strong>Remote diagnostics &amp; predictive maintenance</strong> — read DTCs, predict failures before breakdown.</li>
<li><strong>Route &amp; fuel optimisation</strong>, driver-behaviour scoring, usage-based insurance.</li>
</ul>
<h3>Connected &amp; automated driving</h3>
<ul>
<li><strong>Platooning</strong> — trucks drive in a tight, V2V-linked convoy; the lead car brakes, the rest react in milliseconds, cutting drag and fuel.</li>
<li><strong>Collective perception</strong> — cars share what their sensors see, so each "sees" around corners and beyond its own range.</li>
<li><strong>Cloud/edge assistance</strong> — an MEC node coordinates an intersection or feeds an automated vehicle extra context.</li>
</ul>
<h3>Where it's heading</h3>
<ul>
<li><strong>5G NR-V2X</strong> (3GPP Rel-16+) — higher throughput and reliability for advanced driving use-cases.</li>
<li><strong>Software-defined vehicle (SDV)</strong> — features decoupled from hardware, delivered and monetised over the air.</li>
<li><strong>C-ITS</strong> deployments &amp; interoperability — getting DSRC and C-V2X ecosystems to cooperate across regions.</li>
</ul>
<div class="callout"><span class="badge">The through-line</span> Everything in this course converges here: a car that is a secure, addressable node — sensing, sharing and updating over the air — is the foundation of both connected services and automated driving.</div>`,
    `<span class="eyebrow">OCC301 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng &amp; tiêu chuẩn tương lai</h2>
<h3>Quản lý đội xe</h3>
<p>Phần thưởng thương mại lớn nhất của kết nối. Backend đội xe thu telemetry từ mọi xe và mang lại:</p>
<ul>
<li><strong>Theo dõi trực tiếp &amp; geofencing</strong> — mỗi xe ở đâu, cảnh báo khi rời khỏi vùng.</li>
<li><strong>Chẩn đoán từ xa &amp; bảo trì dự báo</strong> — đọc mã lỗi DTC, dự đoán hỏng hóc trước khi chết máy.</li>
<li><strong>Tối ưu tuyến &amp; nhiên liệu</strong>, chấm điểm hành vi tài xế, bảo hiểm theo quãng lái.</li>
</ul>
<h3>Xe tự hành kết nối</h3>
<ul>
<li><strong>Platooning (đàn xe)</strong> — xe tải chạy thành đoàn sát nhau, nối bằng V2V; xe đầu phanh, phần còn lại phản ứng trong mili-giây, giảm cản gió và nhiên liệu.</li>
<li><strong>Cảm nhận tập thể</strong> — các xe chia sẻ thứ cảm biến của chúng thấy, để mỗi xe "thấy" quanh khúc cua và vượt ngoài tầm của mình.</li>
<li><strong>Hỗ trợ đám mây/biên</strong> — một nút MEC điều phối giao lộ hoặc cấp thêm bối cảnh cho xe tự hành.</li>
</ul>
<h3>Hướng đi tương lai</h3>
<ul>
<li><strong>5G NR-V2X</strong> (3GPP Rel-16+) — thông lượng và độ tin cậy cao hơn cho các kịch bản lái nâng cao.</li>
<li><strong>Xe định nghĩa bằng phần mềm (SDV)</strong> — tính năng tách khỏi phần cứng, giao và thu tiền qua mạng.</li>
<li><strong>Triển khai C-ITS</strong> &amp; tương tác — cho hệ sinh thái DSRC và C-V2X hợp tác xuyên khu vực.</li>
</ul>
<div class="callout"><span class="badge">Sợi chỉ xuyên suốt</span> Mọi thứ trong môn này hội tụ ở đây: một chiếc xe là nút mạng bảo mật, có địa chỉ — cảm nhận, chia sẻ và cập nhật qua mạng — là nền của cả dịch vụ kết nối lẫn lái tự động.</div>`,
  ]]);

const c8q = quiz('occ301-quiz-8', 'Quiz 8 — Applications & future|||Quiz 8 — Ứng dụng & tương lai', [
  { id: 'q1', question: 'Platooning (đàn xe) dựa chủ yếu vào loại V2X nào?', options: ['V2N (xe-mạng)', 'V2V (xe-xe) để nối đoàn phản ứng nhanh', 'V2P (xe-người đi bộ)', 'Không dùng V2X'], correctIndex: 1, explanation: 'Platooning nối các xe bằng V2V để cả đoàn phản ứng trong mili-giây theo xe dẫn đầu.' },
  { id: 'q2', question: '"Cảm nhận tập thể" (collective perception) mang lại lợi ích gì?', options: ['Giảm giá xe', 'Các xe chia sẻ dữ liệu cảm biến để thấy vượt tầm và quanh khúc cua', 'Tăng dung lượng bình xăng', 'Thay thế phanh'], correctIndex: 1, explanation: 'Các xe chia sẻ nhận thức cảm biến, giúp mỗi xe "thấy" ngoài tầm quan sát trực tiếp của nó.' },
  { id: 'q3', question: 'Khái niệm "xe định nghĩa bằng phần mềm" (SDV) nghĩa là gì?', options: ['Xe không có phần cứng', 'Tính năng tách khỏi phần cứng, giao và cập nhật qua mạng (OTA)', 'Xe chỉ chạy trên đường ray', 'Xe không cần tài xế bắt buộc'], correctIndex: 1, explanation: 'SDV tách tính năng khỏi phần cứng, cho phép giao, cập nhật và thu tiền qua mạng suốt vòng đời xe.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'OCC301',
    slug: 'occ301-out-car-connectivity',
    title: 'Out-Car Connectivity',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/OCC301.webp',
    shortDescription: 'Connected-car & V2X engineering — telematics (TCU), 4G/5G & C-V2X, V2V/V2I/V2P, IoT protocols (MQTT/CoAP) & cloud, OTA updates, HD maps, cybersecurity & privacy, fleet management. Bilingual with examples & quizzes.|||Kỹ thuật xe kết nối & V2X — telematics (TCU), 4G/5G & C-V2X, V2V/V2I/V2P, giao thức IoT (MQTT/CoAP) & đám mây, OTA, bản đồ HD, an ninh & riêng tư, quản lý đội xe. Song ngữ, ví dụ & quiz.',
    description: 'Môn <strong>OCC301 — Out-Car Connectivity</strong> (Kết nối ngoài xe, kỳ 8, ngành Kỹ thuật phần mềm ô tô) học cách một chiếc xe nói chuyện với thế giới bên ngoài. Từ <strong>kiến trúc telematics &amp; TCU</strong> → <strong>mạng di động (4G/5G) &amp; C-V2X</strong> → <strong>V2X</strong> (V2V/V2I/V2P, DSRC vs C-V2X) → <strong>giao thức IoT</strong> (MQTT/CoAP) &amp; backend đám mây → <strong>cập nhật OTA</strong> → <strong>định vị, bản đồ HD &amp; telematics</strong> → <strong>an ninh mạng &amp; quyền riêng tư</strong> → <strong>ứng dụng</strong> (đội xe, xe tự hành kết nối, tiêu chuẩn tương lai). Bám giáo trình chuẩn (3GPP C-V2X, IEEE 802.11p/DSRC, ETSI ITS-G5, Sommer &amp; Dressler, ISO 20078), song ngữ, có ví dụ MQTT/JSON và quiz mỗi chương.',
    whatYouLearn: 'Kiến trúc xe kết nối &amp; TCU (modem, GNSS, gateway); 4G LTE vs 5G NR (eMBB/URLLC/mMTC, MEC, slicing); C-V2X (Uu vs PC5 sidelink); V2X V2V/V2I/V2P, bản tin BSM/CAM/DENM, DSRC/802.11p/ITS-G5 vs C-V2X; MQTT (pub/sub, topic, QoS) &amp; CoAP, telemetry JSON, IoT backend &amp; ISO 20078; OTA (FOTA/SOTA, A/B, ký số, rollback, UNECE R156); GNSS/RTK/dead reckoning, bản đồ HD; PKI &amp; pseudonym, phát hiện hành vi sai, UNECE R155/ISO 21434, GDPR; quản lý đội xe, platooning, cảm nhận tập thể, 5G NR-V2X &amp; SDV.',
    requirements: 'Đã học mạng máy tính cơ bản (TCP/IP), kiến trúc xe &amp; mạng trong xe (CAN/Ethernet) và lập trình cơ bản. Nên biết dùng một client MQTT (MQTTX) và đọc JSON.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Chuẩn 3GPP/IEEE/ETSI, sách, whitepaper IoT, ISO 20078, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Kết nối ngoài xe là gì, vì sao quan trọng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Xe kết nối & TCU|||Chapter 1 — Connected car & TCU', description: 'Kiến trúc telematics, TCU, mô hình kết nối, eCall.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Di động & C-V2X|||Chapter 2 — Cellular & C-V2X', description: '4G/5G, eMBB/URLLC/mMTC, MEC, Uu vs PC5.', lessons: [c2, c2q] },
    { title: 'Chương 3 — V2X & radio|||Chapter 3 — V2X & radio', description: 'V2V/V2I/V2P, BSM/CAM/DENM, DSRC vs C-V2X.', lessons: [c3, c3q] },
    { title: 'Chương 4 — IoT & đám mây|||Chapter 4 — IoT & cloud', description: 'MQTT, CoAP, telemetry JSON, backend IoT, ISO 20078.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Cập nhật OTA|||Chapter 5 — OTA updates', description: 'FOTA/SOTA, A/B, ký số, rollback, UNECE R156.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Định vị & bản đồ HD|||Chapter 6 — Positioning & HD maps', description: 'GNSS/RTK, dead reckoning, bản đồ HD, telematics vị trí.', lessons: [c6, c6q] },
    { title: 'Chương 7 — An ninh & riêng tư|||Chapter 7 — Security & privacy', description: 'PKI, pseudonym, hành vi sai, R155/21434, GDPR.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng & tương lai|||Chapter 8 — Applications & future', description: 'Đội xe, platooning, cảm nhận tập thể, 5G NR-V2X, SDV.', lessons: [c8, c8q] },
  ],
};
