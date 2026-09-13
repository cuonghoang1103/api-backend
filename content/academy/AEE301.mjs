/**
 * AEE301 — Automotive Electrical-Electronics Systems (Hệ thống điện-điện tử ô tô).
 * Ngành Kỹ thuật phần mềm ô tô FPTU, Kỳ 4. FULL KHUNG chất lượng — 8 chương.
 * Giáo trình chuẩn: Bosch "Automotive Electrics and Electronics"; Tom Denton
 * "Automotive Electrical and Electronic Systems"; SAE; tài liệu nhà sản xuất.
 * Song ngữ VI+EN, mỗi chương 1 DOCUMENT + 1 QUIZ 3 câu.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML;
 * "&"→"&amp;" trong content HTML; shortDescription "&" thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('aee301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Bosch, Tom Denton, SAE), tài liệu nhà sản xuất, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">AEE301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Automotive Electrical &amp; Electronic Systems</strong> — power nets, battery &amp; charging, starting &amp; ignition, sensors, ECUs, in-vehicle networks and EV/ADAS electrics — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are the standard textbooks and free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for AEE301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Standard reference books</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Bosch+Automotive+Electrics+and+Automotive+Electronics-p-9783658017835" target="_blank" rel="noopener">Bosch — <em>Automotive Electrics and Electronics</em></a> (systems, wiring, EMS, networks)</li>
<li><a href="https://www.routledge.com/Automotive-Electrical-and-Electronic-Systems/Denton/p/book/9780367273422" target="_blank" rel="noopener">Tom Denton — <em>Automotive Electrical and Electronic Systems</em></a></li>
<li><a href="https://www.sae.org/" target="_blank" rel="noopener">SAE International</a> — standards (J1939, OBD, functional safety)</li>
</ul>
<h3>🌐 Free documentation</h3>
<ul>
<li><a href="https://www.electude.com/" target="_blank" rel="noopener">Electude</a> — automotive e-learning simulations</li>
<li><a href="https://www.automotive-technology.co.uk/" target="_blank" rel="noopener">Automotive Technology (Tom Denton companion)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@EngineeringExplained" target="_blank" rel="noopener">Engineering Explained</a> — how car systems work</li>
<li><a href="https://www.youtube.com/@WeberAuto" target="_blank" rel="noopener">Weber Auto</a> — deep dives on EV &amp; automotive electrical</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — simulate 12V circuits, relays, dividers</li>
<li><a href="https://en.wikipedia.org/wiki/On-board_diagnostics" target="_blank" rel="noopener">OBD-II &amp; DTC reference</a> — diagnostics standard</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the 12V net, wiring diagrams, fuses &amp; relays, battery and charging.</li>
<li><strong>Practice</strong> — read a real wiring diagram; trace power, ground and control for one circuit (e.g. headlamp via relay).</li>
<li><strong>Go deeper</strong> — sensors &amp; actuators, ECU/engine management, and the CAN/LIN networks that tie them together.</li>
<li><strong>Job-ready</strong> — use OBD-II to read DTCs and live data, and understand EV high-voltage safety.</li>
</ol></div>`,
    `<span class="eyebrow">AEE301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Hệ thống điện &amp; điện tử ô tô</strong> — mạng điện, ắc quy &amp; sạc, khởi động &amp; đánh lửa, cảm biến, ECU, mạng trong xe và điện xe điện/ADAS — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là sách chuẩn và nguồn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của AEE301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách chuẩn tham khảo</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Bosch+Automotive+Electrics+and+Automotive+Electronics-p-9783658017835" target="_blank" rel="noopener">Bosch — <em>Automotive Electrics and Electronics</em></a> (hệ thống, dây dẫn, EMS, mạng)</li>
<li><a href="https://www.routledge.com/Automotive-Electrical-and-Electronic-Systems/Denton/p/book/9780367273422" target="_blank" rel="noopener">Tom Denton — <em>Automotive Electrical and Electronic Systems</em></a></li>
<li><a href="https://www.sae.org/" target="_blank" rel="noopener">SAE International</a> — tiêu chuẩn (J1939, OBD, an toàn chức năng)</li>
</ul>
<h3>🌐 Tài liệu miễn phí</h3>
<ul>
<li><a href="https://www.electude.com/" target="_blank" rel="noopener">Electude</a> — mô phỏng học nghề ô tô</li>
<li><a href="https://www.automotive-technology.co.uk/" target="_blank" rel="noopener">Automotive Technology (đi kèm sách Tom Denton)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@EngineeringExplained" target="_blank" rel="noopener">Engineering Explained</a> — hệ thống trên xe hoạt động thế nào</li>
<li><a href="https://www.youtube.com/@WeberAuto" target="_blank" rel="noopener">Weber Auto</a> — đào sâu điện ô tô &amp; xe điện</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — mô phỏng mạch 12V, rơ le, chia áp</li>
<li><a href="https://en.wikipedia.org/wiki/On-board_diagnostics" target="_blank" rel="noopener">Tham khảo OBD-II &amp; DTC</a> — chuẩn chẩn đoán</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — mạng 12V, sơ đồ mạch, cầu chì &amp; rơ le, ắc quy và hệ thống nạp.</li>
<li><strong>Luyện tập</strong> — đọc một sơ đồ mạch thật; lần theo nguồn, mát và điều khiển cho một mạch (vd đèn pha qua rơ le).</li>
<li><strong>Đào sâu</strong> — cảm biến &amp; cơ cấu chấp hành, ECU/quản lý động cơ, và mạng CAN/LIN nối chúng lại.</li>
<li><strong>Sẵn sàng đi làm</strong> — dùng OBD-II đọc mã lỗi DTC và dữ liệu trực tiếp, hiểu an toàn điện cao áp trên xe điện.</li>
</ol></div>`,
  ]]);

const intro = doc('aee301-0-1-overview', 'Course overview: Automotive electrical & electronic systems|||Tổng quan: Hệ thống điện & điện tử ô tô',
  'Điện ô tô làm gì; mạng 12V (mát chung = thân xe), nguồn–tải–điều khiển; lộ trình: mạng & ắc quy → khởi động/đánh lửa → chiếu sáng → cảm biến/ECU → mạng trong xe → điện xe điện & ADAS.',
  [[
    `<span class="eyebrow">AEE301 · Lesson 0.1 · Overview</span>
<h2>Automotive Electrical &amp; Electronic Systems</h2>
<p class="lead">A modern car is a network of <strong>electrical and electronic systems</strong> — from the humble headlamp circuit to dozens of computers talking over a data bus. This course builds that picture from the ground up, following the standard references (<strong>Bosch</strong>, <strong>Tom Denton</strong>, <strong>SAE</strong>) and real manufacturer systems.</p>
<h3>The core idea: source → load → control</h3>
<ul>
<li><strong>Source</strong> — the battery (12V) and, once running, the alternator supply power.</li>
<li><strong>Load</strong> — lamps, motors, injectors, heaters that do the work.</li>
<li><strong>Control</strong> — switches, relays and ECUs decide when a load turns on.</li>
</ul>
<p>A key automotive trick: the <strong>car body is the ground (negative) return</strong>, so most components need only one wire to power — current flows back through the chassis.</p>
<h3>Roadmap</h3>
<p>Power nets &amp; battery/charging → starting &amp; ignition → lighting &amp; body comfort → sensors &amp; actuators → ECUs &amp; engine management → in-vehicle networks (CAN/LIN, OBD) → EV &amp; ADAS electrics. Bilingual, with worked system examples and a quiz each chapter.</p>`,
    `<span class="eyebrow">AEE301 · Bài 0.1 · Tổng quan</span>
<h2>Hệ thống điện &amp; điện tử ô tô</h2>
<p class="lead">Một chiếc xe hiện đại là một mạng lưới <strong>các hệ thống điện và điện tử</strong> — từ mạch đèn pha giản dị đến hàng chục máy tính nói chuyện qua một đường bus dữ liệu. Môn này dựng bức tranh đó từ gốc, bám các tài liệu chuẩn (<strong>Bosch</strong>, <strong>Tom Denton</strong>, <strong>SAE</strong>) và hệ thống thật của nhà sản xuất.</p>
<h3>Ý tưởng lõi: nguồn → tải → điều khiển</h3>
<ul>
<li><strong>Nguồn</strong> — ắc quy (12V) và, khi xe nổ máy, máy phát cấp điện.</li>
<li><strong>Tải</strong> — đèn, mô tơ, kim phun, bộ sưởi làm việc thực tế.</li>
<li><strong>Điều khiển</strong> — công tắc, rơ le và ECU quyết định khi nào bật một tải.</li>
</ul>
<p>Một mẹo đặc trưng của ô tô: <strong>thân xe là mát (cực âm) chung</strong>, nên hầu hết linh kiện chỉ cần một dây tới nguồn — dòng chảy về qua khung xe.</p>
<h3>Lộ trình</h3>
<p>Mạng điện &amp; ắc quy/sạc → khởi động &amp; đánh lửa → chiếu sáng &amp; tiện nghi thân xe → cảm biến &amp; chấp hành → ECU &amp; quản lý động cơ → mạng trong xe (CAN/LIN, OBD) → điện xe điện &amp; ADAS. Song ngữ, có ví dụ hệ thống thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('aee301-1-1-power-net', '1.1 — Automotive power net, wiring, fuses & relays|||1.1 — Mạng điện ô tô, dây dẫn, cầu chì & rơ le',
  'Mạng 12V (và 48V mild-hybrid), mát thân xe; sơ đồ mạch & màu dây; tiết diện dây theo dòng; cầu chì bảo vệ; rơ le cho tải lớn.',
  [[
    `<span class="eyebrow">AEE301 · Chapter 1 · Lesson 1.1</span>
<h2>Power net, wiring, fuses &amp; relays</h2>
<h3>12V, 48V and the body ground</h3>
<p>Most cars run a <strong>12V DC</strong> net; many mild-hybrids add a <strong>48V</strong> net for the starter-generator and heavy loads (less current for the same power, so thinner wires). The <strong>negative terminal bonds to the chassis</strong>, which becomes the common ground return.</p>
<h3>Wiring &amp; diagrams</h3>
<ul>
<li><strong>Wire size</strong> — cross-section (mm²) is chosen for the current: too thin overheats and drops voltage.</li>
<li><strong>Colour codes</strong> — a wiring diagram identifies each wire by colour so it can be traced end to end.</li>
</ul>
<h3>Protection &amp; switching</h3>
<ul>
<li><strong>Fuse</strong> — a deliberate weak link; it melts on overcurrent to protect wiring from fire.</li>
<li><strong>Relay</strong> — a small control current energises a coil that closes a heavy-duty contact, so a low-current switch or ECU can drive a high-current load (headlamps, fuel pump).</li>
</ul>
<pre><code>Headlamp via relay:
  Switch/ECU -> relay coil (small current)
  Battery +  -> relay contact -> headlamp -> body ground
  (the heavy current never passes through the dash switch)
</code></pre>
<div class="callout"><span class="badge">Why relays matter</span> Relays let thin control wires and delicate ECU outputs command big loads safely — the backbone of automotive switching.</div>`,
    `<span class="eyebrow">AEE301 · Chương 1 · Bài 1.1</span>
<h2>Mạng điện, dây dẫn, cầu chì &amp; rơ le</h2>
<h3>12V, 48V và mát thân xe</h3>
<p>Hầu hết ô tô chạy mạng <strong>12V DC</strong>; nhiều xe mild-hybrid thêm mạng <strong>48V</strong> cho máy phát-khởi động và tải nặng (cùng công suất nhưng ít dòng hơn, nên dây nhỏ hơn). <strong>Cực âm nối vào khung xe</strong>, biến khung thành đường mát chung.</p>
<h3>Dây dẫn &amp; sơ đồ</h3>
<ul>
<li><strong>Tiết diện dây</strong> — chọn theo dòng (mm²): quá nhỏ thì nóng và sụt áp.</li>
<li><strong>Mã màu</strong> — sơ đồ mạch nhận diện mỗi dây theo màu để lần từ đầu đến cuối.</li>
</ul>
<h3>Bảo vệ &amp; đóng cắt</h3>
<ul>
<li><strong>Cầu chì</strong> — điểm yếu cố ý; nó chảy khi quá dòng để bảo vệ dây khỏi cháy.</li>
<li><strong>Rơ le</strong> — một dòng điều khiển nhỏ kích cuộn dây đóng một tiếp điểm chịu tải lớn, để một công tắc hay ECU dòng nhỏ điều khiển tải lớn (đèn pha, bơm xăng).</li>
</ul>
<pre><code>Đèn pha qua rơ le:
  Công tắc/ECU -> cuộn rơ le (dòng nhỏ)
  Ắc quy +     -> tiếp điểm rơ le -> đèn pha -> mát thân xe
  (dòng lớn không đi qua công tắc táp-lô)
</code></pre>
<div class="callout"><span class="badge">Vì sao cần rơ le</span> Rơ le cho dây điều khiển mỏng và đầu ra ECU mỏng manh điều khiển tải lớn an toàn — xương sống của đóng cắt trên ô tô.</div>`,
  ]]);

const c1q = quiz('aee301-quiz-1', 'Quiz 1 — Power net & wiring|||Quiz 1 — Mạng điện & dây dẫn', [
  { id: 'q1', question: 'Trên ô tô, đường mát (âm) chung thường là?', options: ['Một dây riêng tới ắc quy', 'Thân/khung xe', 'Cầu chì', 'Cuộn rơ le'], correctIndex: 1, explanation: 'Cực âm nối vào khung xe → thân xe là đường mát chung, linh kiện chỉ cần một dây nguồn.' },
  { id: 'q2', question: 'Cầu chì bảo vệ mạch bằng cách?', options: ['Khuếch đại dòng', 'Chảy đứt khi quá dòng', 'Đổi AC sang DC', 'Trữ điện'], correctIndex: 1, explanation: 'Cầu chì là điểm yếu cố ý, chảy khi quá dòng để bảo vệ dây khỏi cháy.' },
  { id: 'q3', question: 'Rơ le dùng để?', options: ['Cho dòng điều khiển nhỏ đóng/cắt tải lớn', 'Đo nhiệt độ', 'Lọc gợn nguồn', 'Tạo tia lửa'], correctIndex: 0, explanation: 'Dòng nhỏ kích cuộn, đóng tiếp điểm chịu tải lớn — công tắc/ECU không phải mang dòng lớn.' },
]);

const c2 = doc('aee301-2-1-battery-charging', '2.1 — Battery & charging system|||2.1 — Ắc quy & hệ thống nạp',
  'Ắc quy chì-axit (khởi động, dự trữ); máy phát alternator (AC → chỉnh lưu DC); bộ điều áp giữ ~14V; quản lý năng lượng trên xe điện/hybrid.',
  [[
    `<span class="eyebrow">AEE301 · Chapter 2 · Lesson 2.1</span>
<h2>Battery &amp; charging system</h2>
<h3>The battery</h3>
<p>A <strong>lead-acid battery</strong> stores chemical energy and delivers a large burst to crank the engine, then buffers the net. Its state is described by <strong>voltage</strong> (~12.6V rested, full) and <strong>capacity/CCA</strong> (cold-cranking amps).</p>
<h3>The alternator</h3>
<p>Once running, the engine drives the <strong>alternator</strong>, which generates <strong>three-phase AC</strong> and rectifies it to DC with a diode bridge. It recharges the battery and powers everything while the engine turns.</p>
<h3>Voltage regulation</h3>
<pre><code>Engine turns -> alternator makes AC
            -> rectifier (diodes) -> DC
            -> regulator holds ~13.8-14.4V
            -> battery recharged + loads powered
</code></pre>
<p>The <strong>regulator</strong> varies field current to keep output near 14V regardless of speed or load — too low undercharges, too high boils the battery.</p>
<h3>EV/hybrid energy management</h3>
<p>Electrified cars add a <strong>DC-DC converter</strong> that steps the high-voltage traction battery down to the 12V net, plus battery-management strategy that decides charge/discharge — the same source→control idea at higher power.</p>
<div class="callout"><span class="badge">Real system</span> A dashboard "battery" light usually means the charging circuit failed (broken belt or regulator), not a dead battery — the car runs on the battery alone until it is flat.</div>`,
    `<span class="eyebrow">AEE301 · Chương 2 · Bài 2.1</span>
<h2>Ắc quy &amp; hệ thống nạp</h2>
<h3>Ắc quy</h3>
<p>Một <strong>ắc quy chì-axit</strong> trữ năng lượng hoá học và phóng một dòng lớn để đề nổ động cơ, rồi làm đệm cho mạng điện. Trạng thái của nó mô tả bằng <strong>điện áp</strong> (~12,6V khi nghỉ, đầy) và <strong>dung lượng/CCA</strong> (dòng đề nguội).</p>
<h3>Máy phát (alternator)</h3>
<p>Khi máy nổ, động cơ kéo <strong>máy phát</strong>, sinh <strong>điện AC ba pha</strong> và chỉnh lưu thành DC bằng cầu diode. Nó nạp lại ắc quy và cấp điện cho mọi thứ trong lúc máy quay.</p>
<h3>Điều áp</h3>
<pre><code>Máy quay -> máy phát sinh AC
        -> chỉnh lưu (diode) -> DC
        -> bộ điều áp giữ ~13,8-14,4V
        -> ắc quy được nạp + cấp cho tải
</code></pre>
<p><strong>Bộ điều áp</strong> thay đổi dòng kích từ để giữ đầu ra quanh 14V bất kể tốc độ hay tải — thấp quá thì nạp thiếu, cao quá thì sôi ắc quy.</p>
<h3>Quản lý năng lượng xe điện/hybrid</h3>
<p>Xe điện hoá thêm một <strong>bộ chuyển DC-DC</strong> hạ ắc quy kéo cao áp xuống mạng 12V, cùng chiến lược quản lý pin quyết định nạp/xả — vẫn là ý nguồn→điều khiển nhưng ở công suất lớn hơn.</p>
<div class="callout"><span class="badge">Hệ thống thật</span> Đèn "ắc quy" trên táp-lô thường báo mạch nạp hỏng (đứt dây curoa hay điều áp), không phải ắc quy chết — xe chạy bằng ắc quy đến khi cạn.</div>`,
  ]]);

const c2q = quiz('aee301-quiz-2', 'Quiz 2 — Battery & charging|||Quiz 2 — Ắc quy & nạp', [
  { id: 'q1', question: 'Máy phát (alternator) sinh ra loại điện gì trước khi chỉnh lưu?', options: ['DC một chiều', 'AC ba pha', 'Xung số', 'Tín hiệu PWM'], correctIndex: 1, explanation: 'Máy phát sinh AC ba pha rồi cầu diode chỉnh lưu thành DC để nạp ắc quy.' },
  { id: 'q2', question: 'Bộ điều áp trên hệ thống nạp giữ điện áp quanh mức?', options: ['~5V', '~14V', '~48V', '~230V'], correctIndex: 1, explanation: 'Điều áp giữ ~13,8-14,4V để nạp đủ mà không làm sôi ắc quy.' },
  { id: 'q3', question: 'Trên xe điện, thiết bị hạ ắc quy cao áp xuống mạng 12V là?', options: ['Bộ chuyển DC-DC', 'Máy đề', 'Bugi', 'Cảm biến oxy'], correctIndex: 0, explanation: 'Bộ DC-DC hạ điện áp pin kéo xuống 12V cho các tải phụ tải thấp.' },
]);

const c3 = doc('aee301-3-1-starting-ignition', '3.1 — Starting & ignition systems|||3.1 — Hệ thống khởi động & đánh lửa',
  'Máy đề (starter motor + solenoid); hệ đánh lửa (bô-bin tăng áp, bugi tạo tia lửa); thời điểm đánh lửa (ignition timing) do ECU điều khiển.',
  [[
    `<span class="eyebrow">AEE301 · Chapter 3 · Lesson 3.1</span>
<h2>Starting &amp; ignition systems</h2>
<h3>The starter</h3>
<p>Turning the key energises a <strong>solenoid</strong> that (1) throws a pinion gear into the engine flywheel and (2) closes a heavy contact feeding the <strong>starter motor</strong> — a high-torque DC motor that cranks the engine until it fires. It draws hundreds of amps, so it is switched by a relay, not the key directly.</p>
<h3>The ignition (spark-ignition engines)</h3>
<p>A petrol engine needs a spark at the right instant. The <strong>ignition coil</strong> is a transformer: it stores energy in a low-voltage winding, then collapses the field to induce <strong>tens of kilovolts</strong> in the secondary, jumping the <strong>spark plug</strong> gap to ignite the mixture.</p>
<pre><code>Low voltage (12V) -> coil primary charges
Switch off suddenly -> field collapses
                    -> high voltage (~20-40 kV) in secondary
                    -> spark jumps the plug gap -> combustion
</code></pre>
<h3>Ignition timing</h3>
<p>The <strong>ECU sets the timing</strong> — sparking a few degrees before top-dead-centre — using crank/cam position and load. Too early (knock) or too late (weak power) both hurt; modern coil-on-plug systems time each cylinder individually.</p>
<div class="callout"><span class="badge">Note</span> Diesel and EV powertrains have no spark ignition — diesels compression-ignite, EVs have no combustion at all.</div>`,
    `<span class="eyebrow">AEE301 · Chương 3 · Bài 3.1</span>
<h2>Hệ thống khởi động &amp; đánh lửa</h2>
<h3>Máy đề</h3>
<p>Vặn chìa kích một <strong>rơ le đề (solenoid)</strong> mà (1) đẩy bánh răng vào bánh đà động cơ và (2) đóng một tiếp điểm lớn cấp điện cho <strong>mô tơ đề</strong> — một mô tơ DC mô-men lớn quay động cơ đến khi nổ. Nó rút hàng trăm ampe, nên được đóng qua rơ le chứ không qua chìa trực tiếp.</p>
<h3>Đánh lửa (động cơ xăng)</h3>
<p>Động cơ xăng cần tia lửa đúng thời điểm. <strong>Bô-bin đánh lửa</strong> là một biến áp: nó trữ năng lượng ở cuộn hạ áp, rồi sập từ trường để cảm ứng ra <strong>hàng chục kilovolt</strong> ở cuộn thứ cấp, phóng qua khe <strong>bugi</strong> để đốt hỗn hợp.</p>
<pre><code>Điện áp thấp (12V) -> cuộn sơ cấp bô-bin nạp
Ngắt đột ngột       -> từ trường sập
                    -> điện cao áp (~20-40 kV) ở thứ cấp
                    -> tia lửa phóng qua khe bugi -> cháy
</code></pre>
<h3>Thời điểm đánh lửa</h3>
<p><strong>ECU đặt thời điểm</strong> — đánh lửa vài độ trước điểm chết trên — dựa vào vị trí trục khuỷu/cam và tải. Sớm quá (kích nổ) hay muộn quá (yếu công suất) đều hại; hệ coil-on-plug hiện đại canh riêng từng xi-lanh.</p>
<div class="callout"><span class="badge">Lưu ý</span> Động cơ diesel và xe điện không có đánh lửa tia — diesel tự cháy do nén, xe điện không hề đốt cháy.</div>`,
  ]]);

const c3q = quiz('aee301-quiz-3', 'Quiz 3 — Starting & ignition|||Quiz 3 — Khởi động & đánh lửa', [
  { id: 'q1', question: 'Vì sao máy đề được đóng qua rơ le/solenoid chứ không qua chìa trực tiếp?', options: ['Vì nó rút dòng rất lớn (hàng trăm ampe)', 'Vì nó chạy AC', 'Vì nó cần cao áp', 'Vì nó là cảm biến'], correctIndex: 0, explanation: 'Mô tơ đề rút hàng trăm ampe; công tắc chìa không mang nổi dòng đó nên phải qua solenoid/rơ le.' },
  { id: 'q2', question: 'Bô-bin đánh lửa hoạt động như?', options: ['Một điện trở', 'Một biến áp tạo cao áp khi từ trường sập', 'Một tụ lọc', 'Một cảm biến áp suất'], correctIndex: 1, explanation: 'Bô-bin là biến áp: sập từ trường cuộn sơ cấp cảm ứng hàng chục kV ở thứ cấp để phóng tia lửa.' },
  { id: 'q3', question: 'Ai quyết định thời điểm đánh lửa trên xe hiện đại?', options: ['Bugi', 'Máy phát', 'ECU dựa vào vị trí trục & tải', 'Cầu chì'], correctIndex: 2, explanation: 'ECU canh thời điểm theo vị trí trục khuỷu/cam và tải, vài độ trước điểm chết trên.' },
]);

const c4 = doc('aee301-4-1-lighting-body', '4.1 — Lighting, comfort & body systems|||4.1 — Chiếu sáng, tiện nghi & hệ thân xe',
  'Đèn (pha/hậu/xi-nhan, LED); còi, gạt mưa (mô tơ), điều hoà HVAC; hệ thân xe (BCM) điều khiển khoá cửa, kính, gương qua mạng.',
  [[
    `<span class="eyebrow">AEE301 · Chapter 4 · Lesson 4.1</span>
<h2>Lighting, comfort &amp; body systems</h2>
<h3>Lighting</h3>
<p>Head, tail, brake and indicator lamps are safety-critical loads. Older bulbs are simple resistive loads; modern <strong>LED</strong> lighting needs a constant-current driver but lasts longer and draws less. Indicators flash via a timed circuit; a <strong>bulb-out</strong> is detected by monitoring current.</p>
<h3>Comfort loads</h3>
<ul>
<li><strong>Horn</strong> — an electromagnet vibrates a diaphragm; switched by a relay.</li>
<li><strong>Wipers</strong> — a DC motor with a park switch and intermittent timing.</li>
<li><strong>HVAC / air-con</strong> — blower motor, compressor clutch and flap actuators, controlled by a climate module.</li>
</ul>
<h3>Body control module (BCM)</h3>
<p>Instead of one wire per switch, a <strong>BCM</strong> reads inputs (door, light, lock switches) and drives outputs, sharing data with other modules over the vehicle network. This cuts wiring and enables features like auto-lights, central locking and one-touch windows.</p>
<pre><code>Door switch -> BCM input
BCM -> command over CAN
    -> interior light, lock actuator, chime
(one module replaces a bundle of direct wires)
</code></pre>
<div class="callout"><span class="badge">Trend</span> Body electronics keep moving from discrete relays to smart modules and software — the same physical loads, now commanded over a data bus.</div>`,
    `<span class="eyebrow">AEE301 · Chương 4 · Bài 4.1</span>
<h2>Chiếu sáng, tiện nghi &amp; hệ thân xe</h2>
<h3>Chiếu sáng</h3>
<p>Đèn pha, hậu, phanh và xi-nhan là các tải an toàn quan trọng. Bóng cũ là tải thuần trở đơn giản; đèn <strong>LED</strong> hiện đại cần mạch dòng không đổi nhưng bền hơn và tốn ít hơn. Xi-nhan nháy nhờ một mạch định thời; <strong>đứt bóng</strong> được phát hiện bằng cách theo dõi dòng.</p>
<h3>Tải tiện nghi</h3>
<ul>
<li><strong>Còi</strong> — nam châm điện rung một màng; đóng qua rơ le.</li>
<li><strong>Gạt mưa</strong> — mô tơ DC có công tắc về vị trí đỗ và định thời gián đoạn.</li>
<li><strong>Điều hoà HVAC</strong> — mô tơ quạt gió, ly hợp máy nén và cơ cấu cánh gió, do module điều hoà điều khiển.</li>
</ul>
<h3>Module điều khiển thân xe (BCM)</h3>
<p>Thay vì mỗi công tắc một dây, một <strong>BCM</strong> đọc đầu vào (công tắc cửa, đèn, khoá) và điều khiển đầu ra, chia sẻ dữ liệu với các module khác qua mạng xe. Việc này giảm dây và cho các tính năng như đèn tự động, khoá trung tâm, kính một chạm.</p>
<pre><code>Công tắc cửa -> đầu vào BCM
BCM -> lệnh qua CAN
    -> đèn nội thất, cơ cấu khoá, chuông
(một module thay cả bó dây trực tiếp)
</code></pre>
<div class="callout"><span class="badge">Xu hướng</span> Điện thân xe dịch dần từ rơ le rời sang module thông minh và phần mềm — vẫn tải vật lý ấy, nay được điều khiển qua bus dữ liệu.</div>`,
  ]]);

const c4q = quiz('aee301-quiz-4', 'Quiz 4 — Lighting & body|||Quiz 4 — Chiếu sáng & thân xe', [
  { id: 'q1', question: 'Đèn LED trên xe khác bóng sợi đốt cũ ở chỗ cần?', options: ['Mạch dòng không đổi (driver)', 'Một biến áp cao áp', 'Cầu diode ba pha', 'Bộ điều áp 48V'], correctIndex: 0, explanation: 'LED cần driver dòng không đổi; bù lại bền hơn và tốn ít điện hơn bóng thuần trở.' },
  { id: 'q2', question: 'BCM (module điều khiển thân xe) giúp giảm dây bằng cách?', options: ['Bỏ hết cầu chì', 'Đọc công tắc và điều khiển tải, chia sẻ dữ liệu qua mạng', 'Tăng điện áp lên 48V', 'Thay ắc quy bằng tụ'], correctIndex: 1, explanation: 'BCM gom đầu vào/đầu ra và trao đổi qua CAN, thay cho bó dây trực tiếp từng công tắc.' },
  { id: 'q3', question: 'Gạt mưa dùng cơ cấu nào để chuyển động?', options: ['Bugi', 'Mô tơ DC (có công tắc đỗ)', 'Cảm biến oxy', 'Bô-bin'], correctIndex: 1, explanation: 'Gạt mưa là mô tơ DC với công tắc về vị trí đỗ và định thời gián đoạn.' },
]);

const c5 = doc('aee301-5-1-sensors-actuators', '5.1 — Automotive sensors & actuators|||5.1 — Cảm biến & cơ cấu chấp hành ô tô',
  'Cảm biến: nhiệt (NTC), áp suất (MAP), vị trí (crank/cam, TPS), lưu lượng khí (MAF), oxy/lambda. Cơ cấu chấp hành: kim phun, van (EGR, ISC), mô tơ, cuộn dây.',
  [[
    `<span class="eyebrow">AEE301 · Chapter 5 · Lesson 5.1</span>
<h2>Sensors &amp; actuators</h2>
<p class="lead">The ECU cannot see or touch the engine — it works only through <strong>sensors</strong> (inputs that turn a physical quantity into a voltage) and <strong>actuators</strong> (outputs that turn a signal into motion or flow).</p>
<h3>Common sensors</h3>
<ul>
<li><strong>Temperature</strong> — an NTC thermistor whose resistance falls as it heats (coolant, intake air).</li>
<li><strong>Pressure</strong> — a MAP sensor reads manifold pressure to estimate load.</li>
<li><strong>Position/speed</strong> — crank &amp; cam sensors (Hall or inductive) give timing; the throttle-position sensor (TPS) reports pedal demand.</li>
<li><strong>Air flow</strong> — a MAF sensor measures intake air mass for fuelling.</li>
<li><strong>Oxygen / lambda</strong> — the exhaust O2 sensor lets the ECU trim the air-fuel ratio in a feedback loop.</li>
</ul>
<h3>Common actuators</h3>
<ul>
<li><strong>Injectors</strong> — solenoid valves pulsed open for a few milliseconds to meter fuel.</li>
<li><strong>Valves &amp; motors</strong> — EGR valve, idle-speed control, throttle motor, cooling fan.</li>
</ul>
<pre><code>Closed loop (air-fuel):
  O2 sensor -> ECU sees mixture rich/lean
           -> ECU adjusts injector pulse width
           -> mixture corrected -> repeat
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Sensor → ECU decision → actuator, closed with feedback: this loop is the heart of every electronically controlled system on the car.</div>`,
    `<span class="eyebrow">AEE301 · Chương 5 · Bài 5.1</span>
<h2>Cảm biến &amp; cơ cấu chấp hành</h2>
<p class="lead">ECU không tự nhìn hay chạm vào động cơ — nó chỉ làm việc qua <strong>cảm biến</strong> (đầu vào biến một đại lượng vật lý thành điện áp) và <strong>cơ cấu chấp hành</strong> (đầu ra biến tín hiệu thành chuyển động hay dòng chảy).</p>
<h3>Cảm biến thường gặp</h3>
<ul>
<li><strong>Nhiệt độ</strong> — nhiệt điện trở NTC, trở giảm khi nóng lên (nước làm mát, khí nạp).</li>
<li><strong>Áp suất</strong> — cảm biến MAP đọc áp suất đường ống nạp để ước lượng tải.</li>
<li><strong>Vị trí/tốc độ</strong> — cảm biến trục khuỷu &amp; cam (Hall hay cảm ứng) cho thời điểm; cảm biến bướm ga (TPS) báo mức đạp.</li>
<li><strong>Lưu lượng khí</strong> — cảm biến MAF đo khối lượng khí nạp để phun nhiên liệu.</li>
<li><strong>Oxy / lambda</strong> — cảm biến O2 ở ống xả cho ECU tinh chỉnh tỉ lệ nhiên liệu-không khí theo vòng hồi tiếp.</li>
</ul>
<h3>Cơ cấu chấp hành thường gặp</h3>
<ul>
<li><strong>Kim phun</strong> — van điện từ mở theo xung vài mili-giây để định lượng nhiên liệu.</li>
<li><strong>Van &amp; mô tơ</strong> — van EGR, điều khiển ga-răng-ti, mô tơ bướm ga, quạt làm mát.</li>
</ul>
<pre><code>Vòng kín (nhiên liệu-không khí):
  Cảm biến O2 -> ECU thấy hỗn hợp giàu/nghèo
             -> ECU chỉnh độ rộng xung kim phun
             -> hỗn hợp được sửa -> lặp lại
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Cảm biến → ECU quyết định → chấp hành, đóng vòng bằng hồi tiếp: vòng lặp này là trái tim của mọi hệ điều khiển điện tử trên xe.</div>`,
  ]]);

const c5q = quiz('aee301-quiz-5', 'Quiz 5 — Sensors & actuators|||Quiz 5 — Cảm biến & chấp hành', [
  { id: 'q1', question: 'Nhiệt điện trở NTC dùng đo nhiệt độ có đặc điểm?', options: ['Điện trở tăng khi nóng', 'Điện trở giảm khi nóng', 'Sinh ra AC', 'Tạo cao áp'], correctIndex: 1, explanation: 'NTC (hệ số nhiệt âm): trở giảm khi nhiệt tăng — dùng cho cảm biến nước làm mát, khí nạp.' },
  { id: 'q2', question: 'Cảm biến oxy (lambda) ở ống xả giúp ECU?', options: ['Đo tốc độ xe', 'Tinh chỉnh tỉ lệ nhiên liệu-không khí theo hồi tiếp', 'Đánh lửa', 'Nạp ắc quy'], correctIndex: 1, explanation: 'O2 cho biết hỗn hợp giàu/nghèo để ECU chỉnh độ rộng xung kim phun — vòng kín air-fuel.' },
  { id: 'q3', question: 'Kim phun nhiên liệu về bản chất là?', options: ['Một cảm biến áp suất', 'Một van điện từ mở theo xung', 'Một điện trở', 'Một biến áp'], correctIndex: 1, explanation: 'Kim phun là van solenoid, ECU mở theo xung vài mili-giây để định lượng nhiên liệu.' },
]);

const c6 = doc('aee301-6-1-ecu-ems', '6.1 — ECU & electronic control (engine management)|||6.1 — ECU & điều khiển điện tử (quản lý động cơ)',
  'ECU là máy tính nhúng (vi điều khiển + bản đồ/map); hệ quản lý động cơ EMS phối hợp phun xăng điện tử (EFI) và đánh lửa; bản đồ và vòng điều khiển.',
  [[
    `<span class="eyebrow">AEE301 · Chapter 6 · Lesson 6.1</span>
<h2>ECU &amp; engine management</h2>
<h3>What an ECU is</h3>
<p>An <strong>Electronic Control Unit (ECU)</strong> is an embedded computer: a microcontroller with inputs (sensor signals, conditioned by the ECU), stored <strong>maps/tables</strong> and output drivers for actuators. A car has many ECUs (engine, transmission, brakes, body); the engine one is often called the <strong>ECM/PCM</strong>.</p>
<h3>Engine management (EMS)</h3>
<p>The <strong>engine-management system</strong> reads load and speed, looks up the calibrated maps, and coordinates the two big jobs together:</p>
<ul>
<li><strong>EFI (electronic fuel injection)</strong> — how much fuel, and when, via injector pulse width.</li>
<li><strong>Ignition</strong> — the spark advance for that operating point.</li>
</ul>
<pre><code>Inputs: MAF/MAP, RPM, throttle, coolant temp, O2
   -> ECU looks up fuel &amp; timing maps
   -> outputs: injector pulse width + spark advance
   -> O2 feedback trims fuelling in real time
</code></pre>
<h3>Maps &amp; adaptation</h3>
<p>A <strong>map</strong> is a table of the right value (fuel, timing) for each load/RPM cell, set during calibration. The ECU also <strong>adapts</strong> — learning fuel trims and knock retard — so it stays correct as the engine ages.</p>
<div class="callout"><span class="badge">Software angle</span> For automotive software, the ECU is where control theory meets embedded code — safety-critical, real-time, and calibrated against physical maps.</div>`,
    `<span class="eyebrow">AEE301 · Chương 6 · Bài 6.1</span>
<h2>ECU &amp; quản lý động cơ</h2>
<h3>ECU là gì</h3>
<p>Một <strong>bộ điều khiển điện tử (ECU)</strong> là máy tính nhúng: một vi điều khiển với đầu vào (tín hiệu cảm biến, được ECU xử lý), các <strong>bản đồ/bảng</strong> lưu sẵn và mạch lái đầu ra cho cơ cấu chấp hành. Một chiếc xe có nhiều ECU (động cơ, hộp số, phanh, thân xe); cái của động cơ thường gọi là <strong>ECM/PCM</strong>.</p>
<h3>Quản lý động cơ (EMS)</h3>
<p><strong>Hệ quản lý động cơ</strong> đọc tải và tốc độ, tra bản đồ đã hiệu chỉnh, và phối hợp hai việc lớn cùng lúc:</p>
<ul>
<li><strong>EFI (phun xăng điện tử)</strong> — phun bao nhiêu, khi nào, qua độ rộng xung kim phun.</li>
<li><strong>Đánh lửa</strong> — góc đánh lửa sớm cho điểm vận hành đó.</li>
</ul>
<pre><code>Đầu vào: MAF/MAP, vòng tua, bướm ga, nhiệt nước, O2
   -> ECU tra bản đồ nhiên liệu &amp; thời điểm
   -> đầu ra: độ rộng xung kim phun + góc đánh lửa sớm
   -> hồi tiếp O2 tinh chỉnh nhiên liệu tức thời
</code></pre>
<h3>Bản đồ &amp; thích nghi</h3>
<p>Một <strong>bản đồ</strong> là bảng giá trị đúng (nhiên liệu, thời điểm) cho mỗi ô tải/vòng tua, đặt lúc hiệu chỉnh. ECU còn <strong>thích nghi</strong> — học fuel trim và lùi lửa khi kích nổ — để luôn đúng khi động cơ già đi.</p>
<div class="callout"><span class="badge">Góc phần mềm</span> Với phần mềm ô tô, ECU là nơi lý thuyết điều khiển gặp mã nhúng — an toàn quan trọng, thời gian thực, và hiệu chỉnh theo bản đồ vật lý.</div>`,
  ]]);

const c6q = quiz('aee301-quiz-6', 'Quiz 6 — ECU & engine management|||Quiz 6 — ECU & quản lý động cơ', [
  { id: 'q1', question: 'Về bản chất, một ECU ô tô là?', options: ['Một biến áp', 'Một máy tính nhúng (vi điều khiển + bản đồ)', 'Một ắc quy phụ', 'Một cầu chì thông minh'], correctIndex: 1, explanation: 'ECU là máy tính nhúng: vi điều khiển, đầu vào cảm biến, bản đồ lưu sẵn, mạch lái đầu ra.' },
  { id: 'q2', question: 'Hệ quản lý động cơ (EMS) phối hợp hai việc lớn nào?', options: ['Phun xăng (EFI) và đánh lửa', 'Sạc và đề', 'Đèn và còi', 'Khoá cửa và kính'], correctIndex: 0, explanation: 'EMS đọc tải/tốc độ rồi phối hợp phun nhiên liệu và thời điểm đánh lửa.' },
  { id: 'q3', question: '"Bản đồ" (map) trong ECU là?', options: ['Bản đồ GPS', 'Bảng giá trị nhiên liệu/thời điểm theo tải và vòng tua', 'Sơ đồ dây điện', 'Danh sách mã lỗi'], correctIndex: 1, explanation: 'Map là bảng tra giá trị đúng cho mỗi ô tải/RPM, đặt lúc hiệu chỉnh, ECU còn thích nghi thêm.' },
]);

const c7 = doc('aee301-7-1-in-vehicle-networks', '7.1 — In-vehicle networks & diagnostics|||7.1 — Mạng giao tiếp trong xe & chẩn đoán',
  'Vì sao cần bus: giảm dây, ECU nói chuyện với nhau. CAN (xương sống), LIN (rẻ, chậm), FlexRay (tốc độ cao), Automotive Ethernet (băng thông lớn); OBD-II & mã lỗi DTC.',
  [[
    `<span class="eyebrow">AEE301 · Chapter 7 · Lesson 7.1</span>
<h2>In-vehicle networks &amp; diagnostics</h2>
<h3>Why a bus?</h3>
<p>With dozens of ECUs, point-to-point wiring is impossible. A <strong>data bus</strong> lets modules share signals over a common pair of wires — one message (e.g. road speed) is read by everyone who needs it.</p>
<h3>The main networks</h3>
<ul>
<li><strong>CAN</strong> — the robust backbone; a two-wire differential bus, message-priority arbitration, used for powertrain and body.</li>
<li><strong>LIN</strong> — a cheap, slow single-wire sub-bus for simple things (a window switch, a rain sensor) hung off a CAN module.</li>
<li><strong>FlexRay</strong> — faster and time-triggered, for high-end chassis/safety control.</li>
<li><strong>Automotive Ethernet</strong> — high bandwidth for cameras, ADAS and infotainment.</li>
</ul>
<pre><code>CAN message = ID (priority) + data + CRC
Lower ID wins the bus if two send at once (arbitration)
Every node hears every frame; each keeps what it needs
</code></pre>
<h3>Diagnostics (OBD-II)</h3>
<p>The <strong>OBD-II</strong> port gives standard access to the networks. When an ECU detects a fault it stores a <strong>DTC</strong> (Diagnostic Trouble Code, e.g. P0301) and can freeze data; a scan tool reads codes and <strong>live data</strong> to guide repair.</p>
<div class="callout"><span class="badge">Software angle</span> To automotive software, the car is a distributed system: message IDs, timing, priorities and CRCs — exactly the concerns you meet in networking, now safety-critical.</div>`,
    `<span class="eyebrow">AEE301 · Chương 7 · Bài 7.1</span>
<h2>Mạng trong xe &amp; chẩn đoán</h2>
<h3>Vì sao cần bus?</h3>
<p>Với hàng chục ECU, đi dây điểm-tới-điểm là bất khả. Một <strong>bus dữ liệu</strong> cho các module chia sẻ tín hiệu qua một cặp dây chung — một bản tin (vd tốc độ xe) được mọi ai cần đọc.</p>
<h3>Các mạng chính</h3>
<ul>
<li><strong>CAN</strong> — xương sống bền bỉ; bus vi sai hai dây, phân xử theo ưu tiên bản tin, dùng cho hệ truyền động và thân xe.</li>
<li><strong>LIN</strong> — bus con một dây rẻ, chậm cho việc đơn giản (công tắc kính, cảm biến mưa) treo dưới một module CAN.</li>
<li><strong>FlexRay</strong> — nhanh hơn và kích theo thời gian, cho điều khiển khung gầm/an toàn cao cấp.</li>
<li><strong>Automotive Ethernet</strong> — băng thông lớn cho camera, ADAS và giải trí.</li>
</ul>
<pre><code>Bản tin CAN = ID (ưu tiên) + dữ liệu + CRC
ID nhỏ hơn thắng bus nếu hai bên cùng gửi (phân xử)
Mọi nút đều nghe mọi khung; mỗi nút giữ phần nó cần
</code></pre>
<h3>Chẩn đoán (OBD-II)</h3>
<p>Cổng <strong>OBD-II</strong> cho truy cập chuẩn vào các mạng. Khi một ECU phát hiện lỗi nó lưu một <strong>mã DTC</strong> (mã lỗi chẩn đoán, vd P0301) và có thể chụp dữ liệu; máy quét đọc mã và <strong>dữ liệu trực tiếp</strong> để định hướng sửa chữa.</p>
<div class="callout"><span class="badge">Góc phần mềm</span> Với phần mềm ô tô, chiếc xe là một hệ phân tán: ID bản tin, thời gian, ưu tiên và CRC — đúng những mối bận tâm trong mạng máy tính, nay mang tính an toàn.</div>`,
  ]]);

const c7q = quiz('aee301-quiz-7', 'Quiz 7 — In-vehicle networks|||Quiz 7 — Mạng trong xe', [
  { id: 'q1', question: 'Mạng xương sống bền bỉ nối các ECU hệ truyền động/thân xe là?', options: ['LIN', 'CAN', 'Wi-Fi', 'RS-232'], correctIndex: 1, explanation: 'CAN là bus vi sai hai dây, phân xử theo ưu tiên bản tin — xương sống mạng trên xe.' },
  { id: 'q2', question: 'LIN thường dùng cho?', options: ['Camera ADAS băng thông lớn', 'Việc đơn giản, rẻ, chậm (công tắc kính, cảm biến mưa)', 'Điều khiển khung gầm tốc độ cao', 'Nạp ắc quy'], correctIndex: 1, explanation: 'LIN là bus con một dây rẻ, chậm cho tải đơn giản, treo dưới một module CAN.' },
  { id: 'q3', question: 'Khi ECU phát hiện lỗi, nó lưu gì để máy quét OBD-II đọc?', options: ['Một bản đồ nhiên liệu', 'Một mã lỗi DTC', 'Một tệp log Wi-Fi', 'Một cầu chì'], correctIndex: 1, explanation: 'ECU lưu mã DTC (vd P0301) và có thể chụp dữ liệu; máy quét đọc mã + dữ liệu trực tiếp.' },
]);

const c8 = doc('aee301-8-1-ev-adas', '8.1 — EV electrics & ADAS|||8.1 — Hệ thống điện xe điện & ADAS',
  'Hệ truyền động điện (pin cao áp, inverter, mô tơ, phanh tái sinh); an toàn điện cao áp (cách ly, HVIL). ADAS: camera/radar/lidar/siêu âm → hợp nhất cảm biến → cảnh báo/can thiệp.',
  [[
    `<span class="eyebrow">AEE301 · Chapter 8 · Lesson 8.1</span>
<h2>EV electrics &amp; ADAS</h2>
<h3>The electric powertrain</h3>
<p>An EV replaces engine + fuel with a <strong>high-voltage battery</strong> (often 400-800V), an <strong>inverter</strong> that turns DC into three-phase AC, and a <strong>traction motor</strong>. <strong>Regenerative braking</strong> runs the motor as a generator to recover energy back into the battery.</p>
<h3>High-voltage safety</h3>
<ul>
<li><strong>Isolation</strong> — the HV system is isolated from the chassis; an isolation monitor watches for leakage.</li>
<li><strong>HVIL</strong> — a high-voltage interlock loop de-energises the system if a connector is opened.</li>
<li><strong>Orange cables</strong> and strict lock-out procedures mark HV — never treat it like 12V.</li>
</ul>
<h3>ADAS</h3>
<p><strong>Advanced Driver-Assistance Systems</strong> add perception: <strong>cameras</strong>, <strong>radar</strong>, <strong>lidar</strong> and <strong>ultrasonic</strong> sensors feed a compute unit that performs <strong>sensor fusion</strong>, then warns or acts (emergency braking, lane keeping, adaptive cruise).</p>
<pre><code>Cameras + radar + lidar + ultrasonic
   -> sensor fusion (one model of the scene)
   -> decision -> warn / brake / steer
   (high-bandwidth data -> Automotive Ethernet)
</code></pre>
<div class="callout"><span class="badge">Where it is heading</span> EV + ADAS is where automotive software lives now: high-voltage power electronics, real-time perception, and safety-critical networks — the whole course, applied.</div>`,
    `<span class="eyebrow">AEE301 · Chương 8 · Bài 8.1</span>
<h2>Hệ thống điện xe điện &amp; ADAS</h2>
<h3>Hệ truyền động điện</h3>
<p>Xe điện thay động cơ + nhiên liệu bằng một <strong>pin cao áp</strong> (thường 400-800V), một <strong>bộ nghịch lưu (inverter)</strong> biến DC thành AC ba pha, và một <strong>mô tơ kéo</strong>. <strong>Phanh tái sinh</strong> chạy mô tơ như máy phát để thu năng lượng về pin.</p>
<h3>An toàn điện cao áp</h3>
<ul>
<li><strong>Cách ly</strong> — hệ cao áp cách ly khỏi khung xe; một bộ giám sát cách ly canh rò điện.</li>
<li><strong>HVIL</strong> — vòng khoá liên động cao áp ngắt điện hệ thống nếu một đầu nối bị mở.</li>
<li><strong>Cáp màu cam</strong> và quy trình khoá nghiêm ngặt đánh dấu cao áp — đừng bao giờ coi nó như 12V.</li>
</ul>
<h3>ADAS</h3>
<p><strong>Hệ hỗ trợ lái nâng cao</strong> thêm khả năng cảm nhận: <strong>camera</strong>, <strong>radar</strong>, <strong>lidar</strong> và cảm biến <strong>siêu âm</strong> cấp cho một bộ tính toán thực hiện <strong>hợp nhất cảm biến</strong>, rồi cảnh báo hoặc can thiệp (phanh khẩn cấp, giữ làn, ga tự thích ứng).</p>
<pre><code>Camera + radar + lidar + siêu âm
   -> hợp nhất cảm biến (một mô hình khung cảnh)
   -> quyết định -> cảnh báo / phanh / lái
   (dữ liệu băng thông lớn -> Automotive Ethernet)
</code></pre>
<div class="callout"><span class="badge">Hướng đi</span> Xe điện + ADAS là nơi phần mềm ô tô đang sống: điện tử công suất cao áp, cảm nhận thời gian thực, và mạng an toàn — cả môn học, đem ra dùng.</div>`,
  ]]);

const c8q = quiz('aee301-quiz-8', 'Quiz 8 — EV & ADAS|||Quiz 8 — Xe điện & ADAS', [
  { id: 'q1', question: 'Trên xe điện, thiết bị biến DC của pin thành AC ba pha cho mô tơ là?', options: ['Bộ nghịch lưu (inverter)', 'Bugi', 'Cầu chì', 'Cảm biến MAP'], correctIndex: 0, explanation: 'Inverter chuyển DC pin cao áp thành AC ba pha điều khiển mô tơ kéo.' },
  { id: 'q2', question: 'Phanh tái sinh (regenerative braking) hoạt động bằng cách?', options: ['Đốt nhiên liệu thừa', 'Chạy mô tơ như máy phát để thu năng lượng về pin', 'Tăng áp lên 800V', 'Mở van EGR'], correctIndex: 1, explanation: 'Khi phanh, mô tơ chạy như máy phát, biến động năng thành điện nạp lại pin.' },
  { id: 'q3', question: 'Bước "hợp nhất cảm biến" (sensor fusion) trong ADAS làm gì?', options: ['Nạp ắc quy 12V', 'Gộp camera/radar/lidar/siêu âm thành một mô hình khung cảnh', 'Đánh lửa từng xi-lanh', 'Đọc mã DTC'], correctIndex: 1, explanation: 'Sensor fusion kết hợp nhiều cảm biến thành một mô hình thống nhất để quyết định cảnh báo/can thiệp.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'AEE301',
    slug: 'aee301-automotive-electrical-electronics-systems',
    title: 'Automotive Electrical-Electronics Systems',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/AEE301.webp',
    shortDescription: 'How a car\'s electrical & electronic systems work — 12V/48V nets, battery & charging, starting & ignition, lighting, sensors & actuators, ECUs & engine management, networks (CAN/LIN, OBD), EV & ADAS. Bilingual, real examples & quizzes.|||Hệ điện & điện tử ô tô hoạt động thế nào — mạng 12V/48V, ắc quy & sạc, khởi động & đánh lửa, chiếu sáng, cảm biến & chấp hành, ECU & quản lý động cơ, mạng trong xe (CAN/LIN, OBD), điện xe điện & ADAS. Song ngữ, ví dụ thật & quiz.',
    description: 'Môn <strong>AEE301 — Automotive Electrical-Electronics Systems</strong> (Kỳ 4, ngành Kỹ thuật phần mềm ô tô) giúp hiểu <strong>hệ thống điện &amp; điện tử ô tô hoạt động thế nào</strong>. Từ <strong>mạng điện &amp; ắc quy/sạc</strong> → <strong>khởi động &amp; đánh lửa</strong> → <strong>chiếu sáng &amp; thân xe</strong> → <strong>cảm biến &amp; cơ cấu chấp hành</strong> → <strong>ECU &amp; quản lý động cơ</strong> → <strong>mạng trong xe (CAN/LIN, OBD)</strong> → <strong>điện xe điện &amp; ADAS</strong>. Bám tài liệu chuẩn (Bosch, Tom Denton, SAE), song ngữ, có ví dụ hệ thống thật, quiz mỗi chương.',
    whatYouLearn: 'Mạng 12V/48V, mát thân xe, cầu chì &amp; rơ le; ắc quy &amp; máy phát/điều áp; máy đề &amp; đánh lửa (bô-bin, bugi, thời điểm); đèn, còi, gạt mưa, HVAC, BCM; cảm biến (nhiệt/áp/vị trí/MAF/O2) &amp; cơ cấu chấp hành (kim phun, van, mô tơ); ECU &amp; quản lý động cơ (EFI + đánh lửa, bản đồ); CAN/LIN/FlexRay/Ethernet &amp; chẩn đoán OBD-II/DTC; hệ điện xe điện (pin cao áp, inverter, phanh tái sinh, an toàn cao áp) &amp; ADAS (camera/radar/lidar, hợp nhất cảm biến).',
    requirements: 'Kiến thức điện cơ bản (áp/dòng/trở, định luật Ohm — xem ECI101). Không cần kinh nghiệm ô tô trước đó.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide FLM, sách chuẩn (Bosch, Tom Denton, SAE), tài liệu, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Điện ô tô, nguồn–tải–điều khiển, mát thân xe.', lessons: [intro] },
    { title: 'Chương 1 — Mạng điện, dây, cầu chì & rơ le|||Chapter 1 — Power net, wiring, fuses & relays', description: '12V/48V, sơ đồ mạch, bảo vệ & đóng cắt.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ắc quy & hệ thống nạp|||Chapter 2 — Battery & charging', description: 'Ắc quy, máy phát, điều áp, DC-DC.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Khởi động & đánh lửa|||Chapter 3 — Starting & ignition', description: 'Máy đề, bô-bin, bugi, thời điểm đánh lửa.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Chiếu sáng & thân xe|||Chapter 4 — Lighting & body', description: 'Đèn, còi, gạt mưa, HVAC, BCM.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Cảm biến & chấp hành|||Chapter 5 — Sensors & actuators', description: 'Cảm biến nhiệt/áp/vị trí/MAF/O2, kim phun, van.', lessons: [c5, c5q] },
    { title: 'Chương 6 — ECU & quản lý động cơ|||Chapter 6 — ECU & engine management', description: 'ECU, EMS, EFI, đánh lửa, bản đồ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Mạng trong xe & chẩn đoán|||Chapter 7 — Networks & diagnostics', description: 'CAN/LIN/FlexRay/Ethernet, OBD-II/DTC.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Điện xe điện & ADAS|||Chapter 8 — EV electrics & ADAS', description: 'Pin cao áp, inverter, an toàn HV, ADAS.', lessons: [c8, c8q] },
  ],
};
