/**
 * ASI101 — Introduction to Automotive System (Nhập môn Hệ thống ô tô).
 * Ngành Kỹ thuật phần mềm ô tô (FPTU), Kỳ 1. Khung 8 chương song ngữ VI+EN:
 * tổng quan ô tô → động cơ → truyền động → khung gầm → điện-điện tử →
 * cảm biến & cơ cấu chấp hành → điều khiển & phần mềm nhúng → an toàn/ADAS/SDV.
 * Nguồn chuẩn: Bosch "Automotive Handbook", Halderman "Automotive Technology",
 * SAE International, tài liệu kỹ thuật hãng (Toyota/VinFast).
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ lồng; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('asi101-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Bosch, Halderman), SAE, tài liệu hãng (Toyota/VinFast), YouTube, công cụ; lộ trình 4 bước.',
  [[
    `<span class="eyebrow">ASI101 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>automotive systems</strong> — the whole vehicle from engine to chassis to the electronics and software that now define modern cars — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are trusted, mostly-free references.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for ASI101 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books &amp; standards</h3>
<ul>
<li><strong>Bosch — <em>Automotive Handbook</em></strong>: the industry reference for every vehicle subsystem.</li>
<li><strong>Halderman — <em>Automotive Technology</em></strong>: clear, hands-on coverage of engine, drivetrain, chassis and electrical.</li>
<li><a href="https://www.sae.org/" target="_blank" rel="noopener">SAE International</a> — standards &amp; the J3016 levels of driving automation.</li>
<li>Manufacturer technical documentation (Toyota, VinFast) for real system examples.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@engineeringexplained" target="_blank" rel="noopener">Engineering Explained</a> — how car systems work, with the physics.</li>
<li><a href="https://www.youtube.com/@LearnEngineering" target="_blank" rel="noopener">Learn Engineering</a> — animated engine, transmission &amp; EV explainers.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what a car is made of, how an engine and drivetrain move it.</li>
<li><strong>Practice</strong> — trace one real vehicle: engine type, gearbox, brakes, battery, ECUs.</li>
<li><strong>Go deeper</strong> — sensors, actuators, control loops and embedded software.</li>
<li><strong>Job-ready</strong> — read CAN traffic, understand ADAS &amp; the software-defined vehicle.</li>
</ol></div>`,
    `<span class="eyebrow">ASI101 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>hệ thống ô tô</strong> — cả chiếc xe từ động cơ, truyền động, khung gầm đến điện-điện tử và phần mềm định nghĩa xe hiện đại — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn tin cậy, phần lớn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ASI101 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách chuẩn &amp; tiêu chuẩn</h3>
<ul>
<li><strong>Bosch — <em>Automotive Handbook</em></strong>: sách tra cứu chuẩn của ngành cho mọi hệ thống trên xe.</li>
<li><strong>Halderman — <em>Automotive Technology</em></strong>: trình bày rõ ràng, thực hành về động cơ, truyền động, khung gầm và điện.</li>
<li><a href="https://www.sae.org/" target="_blank" rel="noopener">SAE International</a> — bộ tiêu chuẩn &amp; thang J3016 về cấp độ tự hành.</li>
<li>Tài liệu kỹ thuật hãng (Toyota, VinFast) để lấy ví dụ hệ thống thật.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@engineeringexplained" target="_blank" rel="noopener">Engineering Explained</a> — hệ thống ô tô hoạt động thế nào, kèm vật lý.</li>
<li><a href="https://www.youtube.com/@LearnEngineering" target="_blank" rel="noopener">Learn Engineering</a> — hoạt hình về động cơ, hộp số &amp; xe điện.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — ô tô gồm những gì, động cơ và truyền động làm xe chạy ra sao.</li>
<li><strong>Luyện tập</strong> — lần theo một chiếc xe thật: loại động cơ, hộp số, phanh, ắc quy, các ECU.</li>
<li><strong>Đào sâu</strong> — cảm biến, cơ cấu chấp hành, vòng điều khiển và phần mềm nhúng.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc lưu lượng CAN, hiểu ADAS &amp; xe định nghĩa bằng phần mềm.</li>
</ol></div>`,
  ]]);

const intro = doc('asi101-0-1-overview', 'Course overview: Automotive systems|||Tổng quan: Hệ thống ô tô',
  'Ô tô là hệ nhiều hệ thống ghép lại; vì sao kỹ sư phần mềm cần hiểu phần cơ khí-điện; lộ trình 8 chương: tổng quan → động cơ → truyền động → khung gầm → điện-điện tử → cảm biến → điều khiển/phần mềm → an toàn/ADAS/SDV.',
  [[
    `<span class="eyebrow">ASI101 · Lesson 0.1 · Overview</span>
<h2>Introduction to Automotive Systems</h2>
<p class="lead">A modern car is not one machine but <strong>many systems working together</strong> — an engine to make power, a drivetrain to deliver it to the wheels, a chassis to steer and stop, and a growing web of <strong>electronics and software</strong> that ties it all together.</p>
<h3>Why a software engineer studies this</h3>
<p>In the <strong>Automotive Software Engineering</strong> track you will write code that runs inside the car. To do that safely you must know <em>what</em> your code controls: an engine, a brake, a steering actuator, a battery. This course builds that mental map of the whole vehicle.</p>
<h3>Roadmap (8 chapters)</h3>
<p>Vehicle overview &amp; electrification → engine (ICE &amp; EV motor) → drivetrain → chassis (suspension, steering, brakes) → automotive electrical/electronic systems &amp; buses → sensors &amp; actuators → embedded control &amp; software → safety, ADAS &amp; autonomous / software-defined vehicles.</p>
<div class="callout"><span class="badge">Sources</span> Bosch <em>Automotive Handbook</em>, Halderman <em>Automotive Technology</em>, SAE International, and manufacturer docs (Toyota, VinFast).</div>`,
    `<span class="eyebrow">ASI101 · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn Hệ thống ô tô</h2>
<p class="lead">Ô tô hiện đại không phải một cỗ máy đơn mà là <strong>nhiều hệ thống phối hợp</strong> — động cơ sinh công, hệ truyền động đưa công tới bánh xe, khung gầm để lái và dừng, cùng mạng lưới <strong>điện tử và phần mềm</strong> ngày càng lớn gắn kết tất cả.</p>
<h3>Vì sao kỹ sư phần mềm phải học điều này</h3>
<p>Trong ngành <strong>Kỹ thuật phần mềm ô tô</strong>, bạn viết mã chạy bên trong xe. Để làm việc đó an toàn, bạn phải biết mã của mình điều khiển <em>cái gì</em>: một động cơ, một cái phanh, một cơ cấu lái, một khối pin. Môn này dựng bản đồ tư duy về cả chiếc xe.</p>
<h3>Lộ trình (8 chương)</h3>
<p>Tổng quan &amp; điện hoá → động cơ (đốt trong &amp; mô-tơ điện) → truyền động → khung gầm (treo, lái, phanh) → hệ điện-điện tử &amp; mạng → cảm biến &amp; cơ cấu chấp hành → điều khiển nhúng &amp; phần mềm → an toàn, ADAS &amp; xe tự hành / định nghĩa bằng phần mềm.</p>
<div class="callout"><span class="badge">Tài liệu</span> Bosch <em>Automotive Handbook</em>, Halderman <em>Automotive Technology</em>, SAE International và tài liệu hãng (Toyota, VinFast).</div>`,
  ]]);

const c1 = doc('asi101-1-1-tong-quan-oto', '1.1 — Vehicle overview & classification|||1.1 — Tổng quan & phân loại ô tô',
  'Cấu tạo tổng thể ô tô (thân/khung, động cơ, truyền động, khung gầm, điện); phân loại theo nhiên liệu/thân xe; xu hướng điện hoá & tự hành.',
  [[
    `<span class="eyebrow">ASI101 · Chapter 1 · Lesson 1.1</span>
<h2>Vehicle overview &amp; classification</h2>
<h3>The big building blocks</h3>
<ul>
<li><strong>Powertrain</strong> — the engine (or electric motor) that makes the power.</li>
<li><strong>Drivetrain</strong> — clutch, gearbox, driveshaft, differential: delivers power to the wheels.</li>
<li><strong>Chassis</strong> — suspension, steering and brakes that hold, guide and stop the car.</li>
<li><strong>Body</strong> — the structure protecting occupants (unibody vs body-on-frame).</li>
<li><strong>Electrical &amp; electronics</strong> — battery, wiring, ECUs and networks.</li>
</ul>
<h3>How cars are classified</h3>
<p>By <strong>propulsion</strong> (petrol, diesel, hybrid, battery-electric), by <strong>body style</strong> (sedan, SUV, hatchback, truck), and by <strong>drive layout</strong> (FWD, RWD, AWD).</p>
<h3>The two big trends</h3>
<p><strong>Electrification</strong> (ICE → hybrid → EV, e.g. VinFast VF series) and <strong>autonomy</strong> (more sensors, more software). Both shift value from mechanics toward <strong>software</strong> — the reason this degree exists.</p>
<div class="callout"><span class="badge">Real example</span> A Toyota Corolla (petrol, FWD, unibody) and a VinFast VF 8 (battery-electric, AWD) share the same block diagram — only the powertrain block differs.</div>`,
    `<span class="eyebrow">ASI101 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan &amp; phân loại ô tô</h2>
<h3>Các khối lớn cấu thành</h3>
<ul>
<li><strong>Hệ động lực (powertrain)</strong> — động cơ (hoặc mô-tơ điện) sinh ra công.</li>
<li><strong>Hệ truyền động (drivetrain)</strong> — ly hợp, hộp số, trục các-đăng, vi sai: đưa công tới bánh xe.</li>
<li><strong>Khung gầm (chassis)</strong> — hệ treo, lái và phanh giữ, dẫn hướng và dừng xe.</li>
<li><strong>Thân xe (body)</strong> — kết cấu bảo vệ người ngồi (liền khối vs thân-trên-khung).</li>
<li><strong>Điện &amp; điện tử</strong> — ắc quy, dây dẫn, các ECU và mạng.</li>
</ul>
<h3>Cách phân loại ô tô</h3>
<p>Theo <strong>nguồn động lực</strong> (xăng, diesel, hybrid, thuần điện), theo <strong>kiểu thân</strong> (sedan, SUV, hatchback, bán tải), và theo <strong>kiểu dẫn động</strong> (FWD, RWD, AWD).</p>
<h3>Hai xu hướng lớn</h3>
<p><strong>Điện hoá</strong> (đốt trong → hybrid → EV, vd dòng VinFast VF) và <strong>tự hành</strong> (thêm cảm biến, thêm phần mềm). Cả hai dịch giá trị từ cơ khí sang <strong>phần mềm</strong> — lý do ngành học này ra đời.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Toyota Corolla (xăng, FWD, thân liền khối) và VinFast VF 8 (thuần điện, AWD) chung một sơ đồ khối — chỉ khác ở khối hệ động lực.</div>`,
  ]]);

const c1q = quiz('asi101-quiz-1', 'Quiz 1 — Overview|||Quiz 1 — Tổng quan', [
  { id: 'q1', question: 'Hệ nào đưa công từ động cơ tới bánh xe?', options: ['Khung gầm (chassis)', 'Hệ truyền động (drivetrain)', 'Thân xe (body)', 'Hệ điện'], correctIndex: 1, explanation: 'Drivetrain gồm ly hợp, hộp số, trục, vi sai — truyền công tới bánh.' },
  { id: 'q2', question: 'FWD / RWD / AWD là cách phân loại theo?', options: ['Kiểu thân xe', 'Loại nhiên liệu', 'Kiểu dẫn động', 'Hãng sản xuất'], correctIndex: 2, explanation: 'FWD/RWD/AWD = dẫn động cầu trước/sau/hai cầu.' },
  { id: 'q3', question: 'Hai xu hướng lớn đẩy giá trị ô tô sang phần mềm là?', options: ['Điện hoá & tự hành', 'Sơn & nội thất', 'Lốp & phanh', 'Kính & gương'], correctIndex: 0, explanation: 'Điện hoá (EV) và tự hành (ADAS) làm phần mềm ngày càng quan trọng.' },
]);

const c2 = doc('asi101-2-1-dong-co', '2.1 — Engines: ICE & electric|||2.1 — Động cơ: đốt trong & điện',
  'Động cơ đốt trong xăng/diesel, chu trình 4 kỳ (nạp-nén-nổ-xả); khác biệt xăng vs diesel; mô-tơ điện EV & vì sao mô-men tức thời.',
  [[
    `<span class="eyebrow">ASI101 · Chapter 2 · Lesson 2.1</span>
<h2>Engines — internal combustion &amp; electric</h2>
<h3>The four-stroke cycle (ICE)</h3>
<pre><code>1. Intake      -> piston down, draws air (+ fuel)
2. Compression -> piston up, squeezes the mixture
3. Power       -> ignition, burning gas pushes piston down
4. Exhaust     -> piston up, pushes burnt gas out</code></pre>
<p>Only stroke 3 makes power; the flywheel carries the engine through the other three.</p>
<h3>Petrol vs diesel</h3>
<ul>
<li><strong>Petrol (spark ignition)</strong> — a spark plug lights a pre-mixed air/fuel charge.</li>
<li><strong>Diesel (compression ignition)</strong> — air is compressed so hard it gets hot enough to ignite injected fuel by itself; higher efficiency and torque.</li>
</ul>
<h3>The electric motor (EV)</h3>
<p>An EV replaces the whole cycle with an <strong>electric motor</strong>: electricity → magnetic field → rotation. It gives <strong>full torque from zero rpm</strong>, needs no gearbox of many ratios, and reverses to recover energy (regenerative braking).</p>
<div class="callout"><span class="badge">Real example</span> A Toyota diesel makes strong low-end torque for load; a VinFast EV motor makes near-instant torque the moment you press the pedal.</div>`,
    `<span class="eyebrow">ASI101 · Chương 2 · Bài 2.1</span>
<h2>Động cơ — đốt trong &amp; điện</h2>
<h3>Chu trình 4 kỳ (động cơ đốt trong)</h3>
<pre><code>1. Nạp   -> piston đi xuống, hút khí (+ nhiên liệu)
2. Nén   -> piston đi lên, ép hỗn hợp
3. Nổ    -> đánh lửa, khí cháy đẩy piston xuống
4. Xả    -> piston đi lên, đẩy khí cháy ra</code></pre>
<p>Chỉ kỳ 3 sinh công; bánh đà kéo động cơ qua ba kỳ còn lại.</p>
<h3>Xăng vs diesel</h3>
<ul>
<li><strong>Xăng (đánh lửa cưỡng bức)</strong> — bugi đốt hỗn hợp khí/nhiên liệu đã trộn sẵn.</li>
<li><strong>Diesel (tự cháy do nén)</strong> — khí bị nén rất mạnh nóng lên đủ để tự đốt nhiên liệu phun vào; hiệu suất và mô-men cao hơn.</li>
</ul>
<h3>Mô-tơ điện (EV)</h3>
<p>Xe điện thay cả chu trình bằng <strong>mô-tơ điện</strong>: điện → từ trường → quay. Nó cho <strong>mô-men đầy từ 0 vòng/phút</strong>, không cần hộp số nhiều cấp, và quay ngược để thu hồi năng lượng (phanh tái sinh).</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Động cơ diesel Toyota cho mô-men lớn ở vòng thấp để chở tải; mô-tơ EV VinFast cho mô-men gần như tức thì ngay khi đạp ga.</div>`,
  ]]);

const c2q = quiz('asi101-quiz-2', 'Quiz 2 — Engines|||Quiz 2 — Động cơ', [
  { id: 'q1', question: 'Thứ tự đúng của chu trình 4 kỳ là?', options: ['Nén → Nạp → Xả → Nổ', 'Nạp → Nén → Nổ → Xả', 'Nổ → Nạp → Nén → Xả', 'Xả → Nổ → Nén → Nạp'], correctIndex: 1, explanation: 'Nạp - Nén - Nổ - Xả; chỉ kỳ Nổ sinh công.' },
  { id: 'q2', question: 'Động cơ diesel đốt nhiên liệu nhờ?', options: ['Bugi đánh lửa', 'Nén khí đến nhiệt độ tự cháy', 'Nam châm', 'Tia laser'], correctIndex: 1, explanation: 'Diesel = tự cháy do nén (compression ignition), không dùng bugi.' },
  { id: 'q3', question: 'Ưu điểm nổi bật của mô-tơ điện so với động cơ đốt trong?', options: ['Cần hộp số nhiều cấp', 'Mô-men đầy ngay từ 0 vòng/phút', 'Không dùng điện', 'Chỉ chạy được lùi'], correctIndex: 1, explanation: 'Mô-tơ điện cho mô-men tức thì và có phanh tái sinh.' },
]);

const c3 = doc('asi101-3-1-truyen-dong', '3.1 — Drivetrain|||3.1 — Hệ truyền động',
  'Ly hợp (ngắt/nối công), hộp số (đổi tỉ số truyền: số sàn/tự động), trục & vi sai, dẫn động FWD/RWD/AWD.',
  [[
    `<span class="eyebrow">ASI101 · Chapter 3 · Lesson 3.1</span>
<h2>Drivetrain — from engine to wheels</h2>
<h3>The chain of parts</h3>
<pre><code>Engine -> Clutch -> Gearbox -> Driveshaft -> Differential -> Wheels</code></pre>
<ul>
<li><strong>Clutch</strong> — connects/disconnects the engine so you can change gears or stop without stalling.</li>
<li><strong>Gearbox (transmission)</strong> — trades speed for torque via <strong>gear ratios</strong>: low gears = high torque to start; high gears = high speed to cruise. Manual, automatic, CVT or dual-clutch.</li>
<li><strong>Differential</strong> — lets the two driven wheels turn at different speeds in a corner while still driving both.</li>
</ul>
<h3>Drive layouts</h3>
<ul>
<li><strong>FWD</strong> — front wheels drive; cheap, space-efficient.</li>
<li><strong>RWD</strong> — rear wheels drive; better balance for performance.</li>
<li><strong>AWD</strong> — all four; best traction, used by many SUVs and dual-motor EVs.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> Many EVs skip the multi-speed gearbox — one motor with a single reduction gear is enough because the motor already spins across a huge rpm range.</div>`,
    `<span class="eyebrow">ASI101 · Chương 3 · Bài 3.1</span>
<h2>Hệ truyền động — từ động cơ tới bánh xe</h2>
<h3>Chuỗi các bộ phận</h3>
<pre><code>Động cơ -> Ly hợp -> Hộp số -> Trục các-đăng -> Vi sai -> Bánh xe</code></pre>
<ul>
<li><strong>Ly hợp</strong> — nối/ngắt động cơ để sang số hoặc dừng mà không tắt máy.</li>
<li><strong>Hộp số</strong> — đánh đổi tốc độ lấy mô-men qua <strong>tỉ số truyền</strong>: số thấp = mô-men lớn để khởi hành; số cao = tốc độ cao để chạy đều. Loại số sàn, tự động, CVT hoặc ly hợp kép.</li>
<li><strong>Vi sai</strong> — cho hai bánh chủ động quay khác tốc độ khi vào cua mà vẫn dẫn động cả hai.</li>
</ul>
<h3>Kiểu dẫn động</h3>
<ul>
<li><strong>FWD</strong> — dẫn động cầu trước; rẻ, tiết kiệm không gian.</li>
<li><strong>RWD</strong> — dẫn động cầu sau; cân bằng tốt cho vận hành.</li>
<li><strong>AWD</strong> — cả bốn bánh; bám đường tốt nhất, nhiều SUV và EV hai mô-tơ dùng.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Nhiều xe điện bỏ hộp số nhiều cấp — một mô-tơ với một cấp giảm tốc là đủ vì mô-tơ đã quay trong dải vòng rất rộng.</div>`,
  ]]);

const c3q = quiz('asi101-quiz-3', 'Quiz 3 — Drivetrain|||Quiz 3 — Truyền động', [
  { id: 'q1', question: 'Bộ phận nào ngắt/nối động cơ khi sang số?', options: ['Vi sai', 'Ly hợp (clutch)', 'Trục các-đăng', 'Bánh đà'], correctIndex: 1, explanation: 'Ly hợp nối/ngắt công để đổi số hoặc dừng không tắt máy.' },
  { id: 'q2', question: 'Vi sai (differential) dùng để?', options: ['Tăng tốc độ tối đa', 'Cho hai bánh chủ động quay khác tốc khi vào cua', 'Lọc khí xả', 'Sạc pin'], correctIndex: 1, explanation: 'Vi sai cho hai bánh quay khác tốc khi vào cua mà vẫn dẫn động.' },
  { id: 'q3', question: 'Số thấp của hộp số cho ta?', options: ['Mô-men lớn để khởi hành', 'Tốc độ cao để chạy đường trường', 'Tiết kiệm nhiên liệu tối đa', 'Phanh mạnh hơn'], correctIndex: 0, explanation: 'Số thấp = tỉ số truyền lớn = mô-men cao để khởi hành.' },
]);

const c4 = doc('asi101-4-1-khung-gam', '4.1 — Chassis: suspension, steering & brakes|||4.1 — Khung gầm: treo, lái & phanh',
  'Hệ treo (giảm xóc, giữ bánh bám đường), hệ lái (rack & pinion, trợ lực điện), hệ phanh (đĩa/tang, ABS & EBD).',
  [[
    `<span class="eyebrow">ASI101 · Chapter 4 · Lesson 4.1</span>
<h2>Chassis — suspension, steering &amp; brakes</h2>
<h3>Suspension</h3>
<p>Springs and <strong>dampers (shock absorbers)</strong> keep the tyres pressed to the road and isolate the body from bumps. Good grip depends on keeping all four contact patches loaded.</p>
<h3>Steering</h3>
<p>A <strong>rack-and-pinion</strong> turns the steering-wheel rotation into side-to-side movement of the wheels. Modern cars add <strong>electric power steering (EPS)</strong> — a motor assists effort and is the hook that lets software steer for lane-keeping.</p>
<h3>Braking</h3>
<ul>
<li><strong>Disc/drum brakes</strong> — friction turns motion into heat to slow the car.</li>
<li><strong>ABS (Anti-lock Braking System)</strong> — senses a wheel about to lock and rapidly modulates pressure so the tyre keeps rolling and steerable.</li>
<li><strong>EBD (Electronic Brakeforce Distribution)</strong> — splits braking force front/rear by load for the shortest stable stop.</li>
</ul>
<div class="callout"><span class="badge">Software hook</span> ABS, EBD, EPS are already computer-controlled — the same actuators that ADAS and self-driving stacks reuse to steer and brake for you.</div>`,
    `<span class="eyebrow">ASI101 · Chương 4 · Bài 4.1</span>
<h2>Khung gầm — treo, lái &amp; phanh</h2>
<h3>Hệ treo</h3>
<p>Lò xo và <strong>giảm chấn (phuộc)</strong> giữ lốp ép xuống mặt đường và cách ly thân xe khỏi ổ gà. Bám đường tốt phụ thuộc vào việc giữ tải đều trên cả bốn vệt tiếp xúc.</p>
<h3>Hệ lái</h3>
<p><strong>Cơ cấu thanh răng - bánh răng (rack-and-pinion)</strong> biến chuyển động quay vô-lăng thành dịch chuyển ngang của bánh xe. Xe hiện đại thêm <strong>trợ lực lái điện (EPS)</strong> — một mô-tơ hỗ trợ lực và chính là điểm để phần mềm can thiệp lái giữ làn.</p>
<h3>Hệ phanh</h3>
<ul>
<li><strong>Phanh đĩa/tang trống</strong> — ma sát biến chuyển động thành nhiệt để giảm tốc.</li>
<li><strong>ABS (chống bó cứng phanh)</strong> — phát hiện bánh sắp bó và điều tiết áp lực rất nhanh để lốp còn lăn và còn lái được.</li>
<li><strong>EBD (phân phối lực phanh điện tử)</strong> — chia lực phanh trước/sau theo tải để dừng ngắn nhất mà vẫn ổn định.</li>
</ul>
<div class="callout"><span class="badge">Điểm cắm phần mềm</span> ABS, EBD, EPS đã do máy tính điều khiển — chính các cơ cấu này được ADAS và xe tự lái tái dùng để lái và phanh thay bạn.</div>`,
  ]]);

const c4q = quiz('asi101-quiz-4', 'Quiz 4 — Chassis|||Quiz 4 — Khung gầm', [
  { id: 'q1', question: 'Nhiệm vụ của giảm chấn (phuộc) trong hệ treo?', options: ['Sinh công', 'Giữ lốp bám đường & cách ly rung xóc', 'Sang số', 'Đánh lửa'], correctIndex: 1, explanation: 'Giảm chấn giữ lốp ép xuống đường và hấp thụ rung xóc.' },
  { id: 'q2', question: 'ABS giúp điều gì khi phanh gấp?', options: ['Tăng tốc', 'Chống bó cứng bánh để còn lái được', 'Tắt động cơ', 'Sạc pin'], correctIndex: 1, explanation: 'ABS điều tiết áp lực để bánh không bó cứng, giữ khả năng lái.' },
  { id: 'q3', question: 'Hệ nào cho phép phần mềm can thiệp lái để giữ làn?', options: ['Trợ lực lái điện (EPS)', 'Bình xăng', 'Bánh đà', 'Ống xả'], correctIndex: 0, explanation: 'EPS dùng mô-tơ hỗ trợ lái — điểm để ADAS lái tự động.' },
]);

const c5 = doc('asi101-5-1-dien-dien-tu', '5.1 — Automotive electrical & electronics|||5.1 — Hệ điện-điện tử ô tô',
  'Ắc quy & máy phát (cấp và nạp điện), hệ 12V/48V/cao áp EV, ECU, và mạng trong xe: CAN, LIN — vì sao dùng bus thay vì dây riêng.',
  [[
    `<span class="eyebrow">ASI101 · Chapter 5 · Lesson 5.1</span>
<h2>Automotive electrical &amp; electronic systems</h2>
<h3>Power supply</h3>
<ul>
<li><strong>Battery</strong> — stores energy; starts the car and runs electronics when the engine is off (high-voltage traction battery in an EV).</li>
<li><strong>Alternator/generator</strong> — recharges the battery and powers loads while running.</li>
</ul>
<h3>ECUs — computers on wheels</h3>
<p>An <strong>ECU (Electronic Control Unit)</strong> is a small computer for one job — engine, transmission, brakes, body. A modern car has dozens, so they must talk to each other.</p>
<h3>In-vehicle networks</h3>
<ul>
<li><strong>CAN (Controller Area Network)</strong> — the robust workhorse bus; many ECUs share two wires and messages are prioritised by ID.</li>
<li><strong>LIN</strong> — a cheap, slow single-wire bus for simple things (window, mirror).</li>
</ul>
<pre><code>Why a bus, not point-to-point wiring:
  50 ECUs, direct wires  -> a huge, heavy harness
  50 ECUs on one CAN bus -> two wires, any node hears any message</code></pre>
<div class="callout"><span class="badge">Real example</span> Press a door-lock button and a CAN message tells the body ECU to lock all doors — no dedicated wire from switch to each lock.</div>`,
    `<span class="eyebrow">ASI101 · Chương 5 · Bài 5.1</span>
<h2>Hệ điện-điện tử ô tô</h2>
<h3>Nguồn điện</h3>
<ul>
<li><strong>Ắc quy</strong> — trữ điện; khởi động xe và chạy điện tử khi tắt máy (khối pin cao áp trên xe điện).</li>
<li><strong>Máy phát</strong> — nạp lại ắc quy và cấp điện cho tải khi xe chạy.</li>
</ul>
<h3>ECU — những máy tính trên bánh xe</h3>
<p><strong>ECU (bộ điều khiển điện tử)</strong> là một máy tính nhỏ lo một việc — động cơ, hộp số, phanh, thân xe. Xe hiện đại có hàng chục ECU, nên chúng phải nói chuyện với nhau.</p>
<h3>Mạng trong xe</h3>
<ul>
<li><strong>CAN (mạng điều khiển vùng)</strong> — bus bền bỉ chủ lực; nhiều ECU dùng chung hai dây, thông điệp ưu tiên theo ID.</li>
<li><strong>LIN</strong> — bus một dây rẻ, chậm cho việc đơn giản (cửa kính, gương).</li>
</ul>
<pre><code>Vì sao dùng bus thay vì dây riêng:
  50 ECU, dây trực tiếp -> bó dây khổng lồ, nặng
  50 ECU trên một bus CAN -> hai dây, mọi nút nghe được mọi thông điệp</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Bấm nút khoá cửa, một thông điệp CAN báo ECU thân xe khoá tất cả cửa — không cần dây riêng từ nút tới từng ổ khoá.</div>`,
  ]]);

const c5q = quiz('asi101-quiz-5', 'Quiz 5 — Electrical|||Quiz 5 — Điện-điện tử', [
  { id: 'q1', question: 'ECU trong ô tô là gì?', options: ['Một loại lốp', 'Một máy tính nhỏ điều khiển một hệ', 'Bình nhiên liệu', 'Loại dầu nhớt'], correctIndex: 1, explanation: 'ECU = bộ điều khiển điện tử, một máy tính lo một chức năng.' },
  { id: 'q2', question: 'CAN bus giúp ích gì so với nối dây riêng từng cặp?', options: ['Nhiều ECU chia sẻ chung vài dây', 'Tăng công suất động cơ', 'Làm mát khoang máy', 'Tăng dung tích pin'], correctIndex: 0, explanation: 'CAN cho nhiều ECU dùng chung hai dây, giảm bó dây.' },
  { id: 'q3', question: 'Bộ phận nào nạp lại ắc quy khi xe đang chạy?', options: ['Máy phát (alternator)', 'Vi sai', 'Ly hợp', 'Cảm biến oxy'], correctIndex: 0, explanation: 'Máy phát nạp ắc quy và cấp điện cho tải khi động cơ chạy.' },
]);

const c6 = doc('asi101-6-1-cam-bien-chap-hanh', '6.1 — Sensors & actuators|||6.1 — Cảm biến & cơ cấu chấp hành',
  'Cảm biến (nhiệt, áp suất, vị trí, oxy/lambda) biến đại lượng vật lý thành tín hiệu; cơ cấu chấp hành (van, mô-tơ, kim phun) tác động ngược; vòng điều khiển kín.',
  [[
    `<span class="eyebrow">ASI101 · Chapter 6 · Lesson 6.1</span>
<h2>Sensors &amp; actuators</h2>
<h3>Sensors — the car's senses</h3>
<p>A <strong>sensor</strong> turns a physical quantity into an electrical signal the ECU can read:</p>
<ul>
<li><strong>Temperature</strong> — coolant, intake air.</li>
<li><strong>Pressure</strong> — manifold (MAP), tyre, oil.</li>
<li><strong>Position/speed</strong> — crankshaft, throttle, wheel speed (used by ABS).</li>
<li><strong>Oxygen (lambda)</strong> — how much oxygen is left in the exhaust, to trim the fuel mixture.</li>
</ul>
<h3>Actuators — the car's muscles</h3>
<p>An <strong>actuator</strong> turns an ECU command back into physical action: fuel injectors, throttle motor, ABS valves, cooling fan.</p>
<h3>The closed control loop</h3>
<pre><code>Sensor -> ECU (compare to target) -> Actuator -> effect
   ^                                                |
   +------------------- feedback -------------------+</code></pre>
<div class="callout"><span class="badge">Real example</span> The lambda sensor reads a lean mixture, the ECU commands the injector to add fuel, the sensor reads again — a feedback loop that keeps emissions low.</div>`,
    `<span class="eyebrow">ASI101 · Chương 6 · Bài 6.1</span>
<h2>Cảm biến &amp; cơ cấu chấp hành</h2>
<h3>Cảm biến — giác quan của xe</h3>
<p>Một <strong>cảm biến</strong> biến đại lượng vật lý thành tín hiệu điện để ECU đọc:</p>
<ul>
<li><strong>Nhiệt độ</strong> — nước làm mát, khí nạp.</li>
<li><strong>Áp suất</strong> — đường nạp (MAP), lốp, dầu.</li>
<li><strong>Vị trí/tốc độ</strong> — trục khuỷu, bướm ga, tốc độ bánh (ABS dùng).</li>
<li><strong>Oxy (lambda)</strong> — lượng oxy còn trong khí xả, để hiệu chỉnh hỗn hợp nhiên liệu.</li>
</ul>
<h3>Cơ cấu chấp hành — cơ bắp của xe</h3>
<p>Một <strong>cơ cấu chấp hành</strong> biến lệnh của ECU trở lại thành hành động vật lý: kim phun, mô-tơ bướm ga, van ABS, quạt làm mát.</p>
<h3>Vòng điều khiển kín</h3>
<pre><code>Cảm biến -> ECU (so với đích) -> Chấp hành -> tác động
   ^                                              |
   +------------------ hồi tiếp -------------------+</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Cảm biến lambda báo hỗn hợp nghèo, ECU lệnh kim phun thêm nhiên liệu, cảm biến đọc lại — một vòng hồi tiếp giữ khí thải sạch.</div>`,
  ]]);

const c6q = quiz('asi101-quiz-6', 'Quiz 6 — Sensors & actuators|||Quiz 6 — Cảm biến & chấp hành', [
  { id: 'q1', question: 'Cảm biến trong ô tô làm nhiệm vụ gì?', options: ['Biến đại lượng vật lý thành tín hiệu điện', 'Sinh công cơ học', 'Trữ nhiên liệu', 'Truyền công tới bánh'], correctIndex: 0, explanation: 'Cảm biến đọc nhiệt/áp/vị trí/oxy... chuyển thành tín hiệu cho ECU.' },
  { id: 'q2', question: 'Đâu là một cơ cấu chấp hành (actuator)?', options: ['Cảm biến nhiệt độ', 'Kim phun nhiên liệu', 'Cảm biến lambda', 'Cảm biến áp suất'], correctIndex: 1, explanation: 'Actuator biến lệnh ECU thành hành động: kim phun, van, mô-tơ.' },
  { id: 'q3', question: 'Vòng điều khiển kín gồm chuỗi?', options: ['Chấp hành → cảm biến → nhiên liệu', 'Cảm biến → ECU → chấp hành → hồi tiếp', 'ECU → ECU → ECU', 'Bánh xe → ly hợp → hộp số'], correctIndex: 1, explanation: 'Cảm biến đo → ECU so với đích → chấp hành tác động → đo lại (hồi tiếp).' },
]);

const c7 = doc('asi101-7-1-dieu-khien-phan-mem', '7.1 — Embedded control & software|||7.1 — Điều khiển & phần mềm nhúng',
  'ECU là hệ nhúng thời gian thực; phần mềm nhúng điều khiển động cơ (EMS) và thân xe; vòng đọc-tính-xuất, thời gian thực & an toàn; vì sao ngành cần kỹ sư phần mềm.',
  [[
    `<span class="eyebrow">ASI101 · Chapter 7 · Lesson 7.1</span>
<h2>Control systems &amp; embedded software</h2>
<h3>An ECU is an embedded computer</h3>
<p>Each ECU runs <strong>embedded software</strong> on a microcontroller: it reads sensors, computes, and drives actuators — over and over, on a fixed schedule, in <strong>real time</strong>.</p>
<pre><code>loop forever (every few milliseconds):
    read sensors
    compute control output (target vs actual)
    command actuators
    exchange messages on CAN</code></pre>
<h3>What the software controls</h3>
<ul>
<li><strong>Engine Management System (EMS)</strong> — how much fuel, when to spark, throttle position, for power + low emissions.</li>
<li><strong>Body &amp; comfort</strong> — lights, wipers, climate, locks, windows.</li>
</ul>
<h3>Real-time &amp; safety</h3>
<p>Automotive code must react <strong>on time, every time</strong> — a late brake command is a bug that hurts people. This is why the field uses standards (AUTOSAR, ISO 26262 functional safety) and why <strong>software quality is the whole point of this degree</strong>.</p>
<div class="callout"><span class="badge">Real example</span> The EMS re-decides fuel and spark hundreds of times per second — pure embedded software controlling a mechanical engine.</div>`,
    `<span class="eyebrow">ASI101 · Chương 7 · Bài 7.1</span>
<h2>Hệ điều khiển &amp; phần mềm nhúng</h2>
<h3>ECU là một máy tính nhúng</h3>
<p>Mỗi ECU chạy <strong>phần mềm nhúng</strong> trên vi điều khiển: đọc cảm biến, tính toán, rồi điều khiển cơ cấu chấp hành — lặp đi lặp lại, theo lịch cố định, trong <strong>thời gian thực</strong>.</p>
<pre><code>lặp mãi (mỗi vài mili-giây):
    đọc cảm biến
    tính đầu ra điều khiển (đích vs thực tế)
    ra lệnh cho chấp hành
    trao đổi thông điệp trên CAN</code></pre>
<h3>Phần mềm điều khiển những gì</h3>
<ul>
<li><strong>Hệ điều khiển động cơ (EMS)</strong> — phun bao nhiêu nhiên liệu, đánh lửa khi nào, vị trí bướm ga, để có công suất + khí thải thấp.</li>
<li><strong>Thân xe &amp; tiện nghi</strong> — đèn, gạt mưa, điều hoà, khoá, cửa kính.</li>
</ul>
<h3>Thời gian thực &amp; an toàn</h3>
<p>Mã ô tô phải phản ứng <strong>đúng lúc, mọi lúc</strong> — một lệnh phanh trễ là lỗi gây hại người. Vì vậy ngành dùng các chuẩn (AUTOSAR, an toàn chức năng ISO 26262) và vì thế <strong>chất lượng phần mềm chính là cốt lõi của ngành học này</strong>.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> EMS quyết định lại nhiên liệu và đánh lửa hàng trăm lần mỗi giây — thuần phần mềm nhúng điều khiển một động cơ cơ khí.</div>`,
  ]]);

const c7q = quiz('asi101-quiz-7', 'Quiz 7 — Embedded software|||Quiz 7 — Phần mềm nhúng', [
  { id: 'q1', question: 'Phần mềm nhúng trên ECU chạy theo kiểu?', options: ['Một lần rồi thôi', 'Vòng lặp thời gian thực: đọc-tính-xuất', 'Chỉ khi người dùng bấm nút', 'Ngẫu nhiên'], correctIndex: 1, explanation: 'ECU lặp: đọc cảm biến → tính → điều khiển chấp hành, theo thời gian thực.' },
  { id: 'q2', question: 'EMS (hệ điều khiển động cơ) quyết định điều gì?', options: ['Màu sơn xe', 'Lượng nhiên liệu & thời điểm đánh lửa', 'Áp suất lốp', 'Số ghế'], correctIndex: 1, explanation: 'EMS điều khiển phun nhiên liệu, đánh lửa, bướm ga cho công suất & khí thải.' },
  { id: 'q3', question: 'Vì sao mã ô tô đặc biệt coi trọng thời gian thực?', options: ['Để tiết kiệm điện', 'Lệnh trễ (vd phanh) có thể gây hại người', 'Để đẹp giao diện', 'Để in báo cáo'], correctIndex: 1, explanation: 'Phản ứng phải đúng lúc, mọi lúc — nên có chuẩn ISO 26262/AUTOSAR.' },
]);

const c8 = doc('asi101-8-1-an-toan-adas', '8.1 — Safety, ADAS & autonomous vehicles|||8.1 — An toàn, ADAS & xe tự hành',
  'An toàn chủ động/thụ động; ADAS (cảnh báo lệch làn, phanh khẩn cấp, ga thích ứng); 6 cấp tự hành SAE J3016 (L0-L5); xu hướng xe định nghĩa bằng phần mềm (SDV).',
  [[
    `<span class="eyebrow">ASI101 · Chapter 8 · Lesson 8.1</span>
<h2>Safety, ADAS &amp; autonomous vehicles</h2>
<h3>Passive vs active safety</h3>
<ul>
<li><strong>Passive</strong> — protects <em>after</em> a crash: crumple zones, seatbelts, airbags.</li>
<li><strong>Active</strong> — helps <em>avoid</em> the crash: ABS, stability control, and ADAS.</li>
</ul>
<h3>ADAS</h3>
<p><strong>Advanced Driver-Assistance Systems</strong> use cameras, radar and ultrasonic sensors plus software: lane-keeping, adaptive cruise control, automatic emergency braking, blind-spot monitoring. They reuse the EPS and brake actuators from Chapter 4.</p>
<h3>The six levels of automation (SAE J3016)</h3>
<pre><code>L0 no automation        L3 conditional (car drives, human on standby)
L1 assistance           L4 high (no human needed in an area)
L2 partial (hands-on)   L5 full (anywhere, anytime)</code></pre>
<h3>The software-defined vehicle (SDV)</h3>
<p>Cars increasingly ship features as <strong>software</strong>, updated over-the-air like a phone. Fewer, more powerful computers replace dozens of small ECUs, and <strong>most new value is code</strong> — exactly the future this degree prepares you for.</p>
<div class="callout"><span class="badge">Real example</span> A car that gains a better lane-keep or a new battery-charging curve from an over-the-air update is an SDV in action.</div>`,
    `<span class="eyebrow">ASI101 · Chương 8 · Bài 8.1</span>
<h2>An toàn, ADAS &amp; xe tự hành</h2>
<h3>An toàn thụ động vs chủ động</h3>
<ul>
<li><strong>Thụ động</strong> — bảo vệ <em>sau</em> va chạm: vùng hấp thụ xung lực, dây an toàn, túi khí.</li>
<li><strong>Chủ động</strong> — giúp <em>tránh</em> va chạm: ABS, cân bằng điện tử, và ADAS.</li>
</ul>
<h3>ADAS</h3>
<p><strong>Hệ hỗ trợ lái nâng cao</strong> dùng camera, radar, siêu âm cộng phần mềm: giữ làn, ga thích ứng, phanh khẩn cấp tự động, cảnh báo điểm mù. Chúng tái dùng cơ cấu EPS và phanh ở Chương 4.</p>
<h3>Sáu cấp độ tự hành (SAE J3016)</h3>
<pre><code>L0 không tự động        L3 có điều kiện (xe lái, người chờ tiếp quản)
L1 hỗ trợ               L4 cao (không cần người trong vùng định sẵn)
L2 một phần (giữ tay)   L5 hoàn toàn (mọi nơi, mọi lúc)</code></pre>
<h3>Xe định nghĩa bằng phần mềm (SDV)</h3>
<p>Ô tô ngày càng cấp tính năng dưới dạng <strong>phần mềm</strong>, cập nhật qua mạng (OTA) như điện thoại. Vài máy tính mạnh thay cho hàng chục ECU nhỏ, và <strong>phần giá trị mới chủ yếu là mã</strong> — đúng tương lai mà ngành học này chuẩn bị cho bạn.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Một chiếc xe được cập nhật OTA để giữ làn tốt hơn hay có đường sạc pin mới chính là SDV đang hoạt động.</div>`,
  ]]);

const c8q = quiz('asi101-quiz-8', 'Quiz 8 — Safety & ADAS|||Quiz 8 — An toàn & ADAS', [
  { id: 'q1', question: 'Túi khí và dây an toàn thuộc loại an toàn nào?', options: ['An toàn chủ động', 'An toàn thụ động', 'ADAS', 'Tự hành L5'], correctIndex: 1, explanation: 'An toàn thụ động bảo vệ sau va chạm; ADAS/ABS là chủ động.' },
  { id: 'q2', question: 'Thang SAE J3016 chia tự hành thành bao nhiêu cấp (L0-L5)?', options: ['3 cấp', '6 cấp', '10 cấp', '2 cấp'], correctIndex: 1, explanation: 'J3016 có 6 cấp: L0 đến L5 (L5 = tự hành hoàn toàn).' },
  { id: 'q3', question: 'Xe định nghĩa bằng phần mềm (SDV) đặc trưng bởi?', options: ['Cấp tính năng bằng phần mềm, cập nhật OTA', 'Không dùng điện', 'Không có ECU', 'Chỉ chạy bằng diesel'], correctIndex: 0, explanation: 'SDV: giá trị mới chủ yếu là mã, cập nhật qua mạng như điện thoại.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'ASI101',
    slug: 'asi101-introduction-to-automotive-system',
    title: 'Introduction to Automotive System',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ASI101.webp',
    shortDescription: 'The modern car as a system of systems — engine (ICE & EV), drivetrain, chassis (steering, ABS brakes), automotive electronics & CAN bus, sensors & actuators, embedded software, safety & ADAS. Bilingual, with real examples & quizzes.|||Ô tô hiện đại như một hệ nhiều hệ thống — động cơ (đốt trong & điện), truyền động, khung gầm (lái, phanh ABS), điện-điện tử & mạng CAN, cảm biến & chấp hành, phần mềm nhúng, an toàn & ADAS. Song ngữ, ví dụ thật & quiz.',
    description: 'Môn <strong>ASI101 — Introduction to Automotive System</strong> (Kỳ 1, ngành Kỹ thuật phần mềm ô tô) dựng bản đồ toàn bộ chiếc xe cho kỹ sư phần mềm. Từ <strong>tổng quan &amp; phân loại</strong> → <strong>động cơ</strong> (đốt trong 4 kỳ, mô-tơ EV) → <strong>hệ truyền động</strong> (ly hợp, hộp số, vi sai, FWD/RWD/AWD) → <strong>khung gầm</strong> (treo, lái, phanh ABS/EBD) → <strong>điện-điện tử &amp; mạng CAN/LIN</strong> → <strong>cảm biến &amp; cơ cấu chấp hành</strong> → <strong>điều khiển &amp; phần mềm nhúng</strong> → <strong>an toàn, ADAS &amp; xe định nghĩa bằng phần mềm (SDV)</strong>. Song ngữ VI+EN, bám nguồn chuẩn (Bosch, Halderman, SAE), có ví dụ hệ thống thật (Toyota, VinFast) và quiz mỗi chương.',
    whatYouLearn: 'Cấu tạo tổng thể ô tô & phân loại; chu trình 4 kỳ xăng/diesel và mô-tơ điện; ly hợp/hộp số/vi sai & dẫn động FWD/RWD/AWD; hệ treo, lái (EPS), phanh ABS/EBD; ắc quy/máy phát, ECU và mạng CAN/LIN; cảm biến (nhiệt/áp/vị trí/oxy) & cơ cấu chấp hành, vòng điều khiển kín; phần mềm nhúng thời gian thực (EMS), an toàn chức năng; an toàn chủ động/thụ động, ADAS, 6 cấp tự hành SAE J3016 và xu hướng SDV.',
    requirements: 'Kiến thức vật lý phổ thông (cơ, điện cơ bản). Không cần nền cơ khí — môn xây từ đầu và hướng tới góc nhìn của kỹ sư phần mềm.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide FLM, Bosch, Halderman, SAE, tài liệu hãng, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Ô tô là hệ nhiều hệ thống; vì sao kỹ sư phần mềm cần hiểu.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan ô tô|||Chapter 1 — Vehicle overview', description: 'Cấu tạo, phân loại, điện hoá & tự hành.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Động cơ|||Chapter 2 — Engines', description: 'Đốt trong 4 kỳ (xăng/diesel), mô-tơ điện EV.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Hệ truyền động|||Chapter 3 — Drivetrain', description: 'Ly hợp, hộp số, vi sai, FWD/RWD/AWD.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Khung gầm|||Chapter 4 — Chassis', description: 'Hệ treo, lái (EPS), phanh ABS/EBD.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Điện-điện tử|||Chapter 5 — Electrical & electronics', description: 'Ắc quy, máy phát, ECU, mạng CAN/LIN.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cảm biến & chấp hành|||Chapter 6 — Sensors & actuators', description: 'Cảm biến nhiệt/áp/vị trí/oxy, actuator, vòng điều khiển.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Điều khiển & phần mềm nhúng|||Chapter 7 — Embedded control & software', description: 'ECU nhúng thời gian thực, EMS, an toàn chức năng.', lessons: [c7, c7q] },
    { title: 'Chương 8 — An toàn, ADAS & tự hành|||Chapter 8 — Safety, ADAS & autonomy', description: 'An toàn chủ động/thụ động, ADAS, SAE J3016, SDV.', lessons: [c8, c8q] },
  ],
};
