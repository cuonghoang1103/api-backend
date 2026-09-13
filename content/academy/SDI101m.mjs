/**
 * SDI101m — Introduction to Semiconductor Devices. Nhập môn Linh kiện bán dẫn
 * (ngành Thiết kế vi mạch bán dẫn, FPTU, Kỳ 1). Giáo trình chuẩn quốc tế:
 * Neamen "Semiconductor Physics and Devices"; Sedra & Smith "Microelectronic
 * Circuits"; Streetman "Solid State Electronic Devices". Song ngữ + vật lý +
 * công thức/đặc tuyến (pre) + ví dụ + quiz. 8 chương.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→"&amp;" trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('sdi101m-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế (Neamen, Sedra & Smith, Streetman), nanoHUB, YouTube, công cụ mô phỏng, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">SDI101m · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Introduction to Semiconductor Devices</strong> — from crystal structure and energy bands to the PN junction, diodes, BJT/MOSFET transistors and CMOS ICs — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are trusted, mostly-free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for SDI101m are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (international standard)</h3>
<ul>
<li><strong>Neamen</strong> — <em>Semiconductor Physics and Devices</em> (the core reference for this course: bands, carriers, PN junction, BJT, MOSFET).</li>
<li><strong>Sedra &amp; Smith</strong> — <em>Microelectronic Circuits</em> (diode, BJT and MOSFET as circuit elements, characteristics &amp; biasing).</li>
<li><strong>Streetman &amp; Banerjee</strong> — <em>Solid State Electronic Devices</em> (device physics from the materials up).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://nanohub.org/" target="_blank" rel="noopener">nanoHUB</a> — free device simulation tools &amp; lectures (Purdue).</li>
<li><a href="https://en.wikipedia.org/wiki/Semiconductor_device" target="_blank" rel="noopener">Semiconductor device — overview</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@BenEater" target="_blank" rel="noopener">Ben Eater</a> — transistors &amp; digital logic from scratch.</li>
<li><a href="https://www.youtube.com/@Zetalytics" target="_blank" rel="noopener">Device physics explainers</a> — bands, junctions, MOSFETs.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://nanohub.org/" target="_blank" rel="noopener">nanoHUB</a> — run PN junction &amp; MOSFET simulators in the browser.</li>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — see diodes &amp; transistors in a live circuit.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — materials &amp; crystal structure, energy bands, intrinsic vs doped semiconductors.</li>
<li><strong>Carriers &amp; current</strong> — electrons/holes, n/p doping, drift &amp; diffusion, mobility &amp; resistivity.</li>
<li><strong>Devices</strong> — the PN junction, diodes, then BJT &amp; MOSFET transistors and their characteristics.</li>
<li><strong>From device to chip</strong> — CMOS, wafer fabrication and Moore scaling — the bridge into IC design.</li>
</ol></div>`,
    `<span class="eyebrow">SDI101m · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Nhập môn Linh kiện bán dẫn</strong> — từ cấu trúc tinh thể và dải năng lượng tới chuyển tiếp PN, diode, transistor BJT/MOSFET và IC CMOS — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn tin cậy, phần lớn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SDI101m có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (chuẩn quốc tế)</h3>
<ul>
<li><strong>Neamen</strong> — <em>Semiconductor Physics and Devices</em> (sách gốc của môn: dải năng lượng, hạt dẫn, chuyển tiếp PN, BJT, MOSFET).</li>
<li><strong>Sedra &amp; Smith</strong> — <em>Microelectronic Circuits</em> (diode, BJT và MOSFET như phần tử mạch, đặc tuyến &amp; phân cực).</li>
<li><strong>Streetman &amp; Banerjee</strong> — <em>Solid State Electronic Devices</em> (vật lý linh kiện từ vật liệu đi lên).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://nanohub.org/" target="_blank" rel="noopener">nanoHUB</a> — công cụ mô phỏng linh kiện &amp; bài giảng miễn phí (Purdue).</li>
<li><a href="https://en.wikipedia.org/wiki/Semiconductor_device" target="_blank" rel="noopener">Semiconductor device — tổng quan</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@BenEater" target="_blank" rel="noopener">Ben Eater</a> — transistor &amp; logic số từ gốc.</li>
<li><a href="https://www.youtube.com/@Zetalytics" target="_blank" rel="noopener">Kênh vật lý linh kiện</a> — dải năng lượng, chuyển tiếp, MOSFET.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://nanohub.org/" target="_blank" rel="noopener">nanoHUB</a> — chạy mô phỏng chuyển tiếp PN &amp; MOSFET trên trình duyệt.</li>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — xem diode &amp; transistor trong mạch động.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — vật liệu &amp; cấu trúc tinh thể, dải năng lượng, bán dẫn thuần và pha tạp.</li>
<li><strong>Hạt dẫn &amp; dòng điện</strong> — electron/lỗ trống, pha tạp n/p, dòng trôi &amp; khuếch tán, độ linh động &amp; điện trở suất.</li>
<li><strong>Linh kiện</strong> — chuyển tiếp PN, diode, rồi transistor BJT &amp; MOSFET cùng đặc tuyến của chúng.</li>
<li><strong>Từ linh kiện tới chip</strong> — CMOS, chế tạo wafer và định luật Moore — cầu nối vào thiết kế vi mạch.</li>
</ol></div>`,
  ]]);

const intro = doc('sdi101m-0-1-overview', 'Course overview: Semiconductor devices|||Tổng quan: Linh kiện bán dẫn',
  'Linh kiện bán dẫn là gì và vì sao là nền của vi mạch; lộ trình 8 chương: vật liệu → hạt dẫn → dòng điện → chuyển tiếp PN → diode → BJT → MOSFET → IC.',
  [[
    `<span class="eyebrow">SDI101m · Lesson 0.1 · Overview</span>
<h2>Introduction to Semiconductor Devices</h2>
<p class="lead">This course explains <strong>how the building blocks of every chip actually work</strong> — from the silicon crystal, through the electrons and holes that carry current, up to the <strong>diode, transistor</strong> and the CMOS integrated circuit. It is the physics foundation for the <strong>semiconductor IC design</strong> major.</p>
<h3>Why semiconductors?</h3>
<p>A <strong>semiconductor</strong> (silicon, germanium) sits between a conductor and an insulator. Its magic is that we can <em>control</em> its conductivity — by adding tiny amounts of impurities (<strong>doping</strong>) and by applying voltages. That control is what makes diodes, transistors and ultimately logic and memory possible.</p>
<h3>Roadmap (8 chapters)</h3>
<pre><code>Materials &amp; bands  -> Carriers &amp; doping -> Current (drift/diffusion)
      -> PN junction -> Diodes &amp; apps -> BJT -> MOSFET -> from device to IC
</code></pre>
<p>Each chapter builds on the last: you cannot understand a transistor without the PN junction, and you cannot understand the junction without carriers and doping.</p>
<div class="callout"><span class="badge">The big idea</span> Semiconductors let a <strong>small signal control a large one</strong> and let us <strong>switch billions of times a second</strong>. Every CPU, memory and sensor rests on the devices in this course.</div>`,
    `<span class="eyebrow">SDI101m · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn Linh kiện bán dẫn</h2>
<p class="lead">Môn này giải thích <strong>các khối dựng nên mọi con chip hoạt động thế nào</strong> — từ tinh thể silic, qua các electron và lỗ trống mang dòng, tới <strong>diode, transistor</strong> và mạch tích hợp CMOS. Đây là nền vật lý cho ngành <strong>Thiết kế vi mạch bán dẫn</strong>.</p>
<h3>Vì sao là bán dẫn?</h3>
<p>Một <strong>chất bán dẫn</strong> (silic, germani) nằm giữa chất dẫn điện và chất cách điện. Điều kỳ diệu là ta có thể <em>điều khiển</em> độ dẫn của nó — bằng cách thêm một lượng cực nhỏ tạp chất (<strong>pha tạp</strong>) và bằng cách đặt điện áp. Chính khả năng điều khiển đó làm nên diode, transistor và cuối cùng là logic và bộ nhớ.</p>
<h3>Lộ trình (8 chương)</h3>
<pre><code>Vật liệu &amp; dải  -> Hạt dẫn &amp; pha tạp -> Dòng điện (trôi/khuếch tán)
      -> Chuyển tiếp PN -> Diode &amp; ứng dụng -> BJT -> MOSFET -> từ linh kiện tới IC
</code></pre>
<p>Mỗi chương xây trên chương trước: không hiểu chuyển tiếp PN thì không hiểu transistor, và không hiểu hạt dẫn cùng pha tạp thì không hiểu chuyển tiếp.</p>
<div class="callout"><span class="badge">Ý tưởng lớn</span> Bán dẫn cho phép một <strong>tín hiệu nhỏ điều khiển tín hiệu lớn</strong> và cho phép <strong>chuyển mạch hàng tỉ lần mỗi giây</strong>. Mọi CPU, bộ nhớ và cảm biến đều dựa trên những linh kiện trong môn này.</div>`,
  ]]);

const c1 = doc('sdi101m-1-1-vat-lieu', '1.1 — Semiconductor materials & energy bands|||1.1 — Vật liệu bán dẫn & dải năng lượng',
  'Chất bán dẫn, Si/Ge, cấu trúc tinh thể (mạng kim cương), dải năng lượng (dải hoá trị/dẫn, khe cấm Eg), bán dẫn thuần vs pha tạp.',
  [[
    `<span class="eyebrow">SDI101m · Chapter 1 · Lesson 1.1</span>
<h2>Semiconductor materials &amp; energy bands</h2>
<h3>What is a semiconductor?</h3>
<p>Materials split by conductivity into <strong>conductors</strong> (metals), <strong>insulators</strong> (glass), and <strong>semiconductors</strong> in between. The key semiconductors are <strong>silicon (Si)</strong> and <strong>germanium (Ge)</strong>, both group-IV elements with 4 valence electrons. Si dominates because of its abundance, stable oxide (SiO₂) and good thermal behaviour.</p>
<h3>Crystal structure</h3>
<p>Si atoms bond covalently into a regular, repeating <strong>diamond crystal lattice</strong> — each atom shares electrons with 4 neighbours. This ordered structure is what gives the material its well-defined electronic properties.</p>
<h3>Energy bands &amp; the band gap</h3>
<ul>
<li><strong>Valence band</strong> — filled with the bonding electrons.</li>
<li><strong>Conduction band</strong> — where electrons are free to move and carry current.</li>
<li><strong>Band gap (Eg)</strong> — the forbidden energy gap between them.</li>
</ul>
<pre><code>Band gap (300 K):
  Conductor    Eg ~ 0     (bands overlap -> always conducts)
  Semiconductor Si  Eg = 1.12 eV
                Ge  Eg = 0.66 eV
  Insulator    Eg > 5 eV  (electrons can't cross)
</code></pre>
<h3>Intrinsic vs doped</h3>
<p>A pure crystal is an <strong>intrinsic</strong> semiconductor — few carriers, poor conductor at room temperature. Adding controlled impurities (<strong>doping</strong>) massively raises conductivity — that is the whole point, and the subject of Chapter 2.</p>
<div class="callout"><span class="badge">Key number</span> The <strong>band gap Eg</strong> decides everything: too small and heat frees carriers uncontrollably; too large and nothing conducts. Si's 1.12 eV is the sweet spot for electronics.</div>`,
    `<span class="eyebrow">SDI101m · Chương 1 · Bài 1.1</span>
<h2>Vật liệu bán dẫn &amp; dải năng lượng</h2>
<h3>Chất bán dẫn là gì?</h3>
<p>Vật liệu chia theo độ dẫn thành <strong>chất dẫn điện</strong> (kim loại), <strong>chất cách điện</strong> (thuỷ tinh), và <strong>chất bán dẫn</strong> ở giữa. Hai chất bán dẫn then chốt là <strong>silic (Si)</strong> và <strong>germani (Ge)</strong>, đều là nguyên tố nhóm IV với 4 electron hoá trị. Si chiếm ưu thế nhờ trữ lượng dồi dào, lớp oxit ổn định (SiO₂) và tính nhiệt tốt.</p>
<h3>Cấu trúc tinh thể</h3>
<p>Các nguyên tử Si liên kết cộng hoá trị thành một <strong>mạng tinh thể kiểu kim cương</strong> đều đặn, lặp lại — mỗi nguyên tử góp chung electron với 4 nguyên tử lân cận. Cấu trúc trật tự này cho vật liệu các tính chất điện tử xác định rõ.</p>
<h3>Dải năng lượng &amp; khe cấm</h3>
<ul>
<li><strong>Dải hoá trị</strong> — chứa các electron liên kết.</li>
<li><strong>Dải dẫn</strong> — nơi electron tự do di chuyển và mang dòng.</li>
<li><strong>Khe cấm (Eg)</strong> — khoảng năng lượng cấm giữa hai dải.</li>
</ul>
<pre><code>Khe cấm (300 K):
  Chất dẫn      Eg ~ 0     (hai dải chồng nhau -> luôn dẫn)
  Bán dẫn  Si   Eg = 1,12 eV
           Ge   Eg = 0,66 eV
  Cách điện    Eg > 5 eV  (electron không vượt được)
</code></pre>
<h3>Thuần vs pha tạp</h3>
<p>Tinh thể tinh khiết là bán dẫn <strong>thuần (intrinsic)</strong> — ít hạt dẫn, dẫn kém ở nhiệt độ phòng. Thêm tạp chất có kiểm soát (<strong>pha tạp</strong>) làm độ dẫn tăng vọt — đó là mấu chốt, và là nội dung Chương 2.</p>
<div class="callout"><span class="badge">Con số then chốt</span> <strong>Khe cấm Eg</strong> quyết định tất cả: quá nhỏ thì nhiệt giải phóng hạt dẫn mất kiểm soát; quá lớn thì không gì dẫn. 1,12 eV của Si là điểm vàng cho điện tử.</div>`,
  ]]);

const c1q = quiz('sdi101m-quiz-1', 'Quiz 1 — Materials & bands|||Quiz 1 — Vật liệu & dải năng lượng', [
  { id: 'q1', question: 'Chất bán dẫn phổ biến nhất trong công nghiệp vi mạch là?', options: ['Đồng (Cu)', 'Silic (Si)', 'Vàng (Au)', 'Thuỷ tinh'], correctIndex: 1, explanation: 'Si (nhóm IV, 4 electron hoá trị) phổ biến nhờ trữ lượng, oxit SiO₂ ổn định.' },
  { id: 'q2', question: 'Khe cấm (band gap Eg) là?', options: ['Khoảng năng lượng cấm giữa dải hoá trị và dải dẫn', 'Số electron hoá trị', 'Điện trở của tinh thể', 'Khoảng cách giữa hai nguyên tử'], correctIndex: 0, explanation: 'Eg là khe năng lượng giữa dải hoá trị và dải dẫn; Si ~1,12 eV.' },
  { id: 'q3', question: 'Bán dẫn thuần (intrinsic) ở nhiệt độ phòng dẫn điện thế nào?', options: ['Dẫn rất tốt như kim loại', 'Dẫn kém, ít hạt dẫn', 'Hoàn toàn cách điện', 'Dẫn một chiều'], correctIndex: 1, explanation: 'Tinh thể tinh khiết ít hạt dẫn; pha tạp mới làm độ dẫn tăng vọt.' },
]);

const c2 = doc('sdi101m-2-1-hat-dan', '2.1 — Carriers & doping|||2.1 — Hạt dẫn & pha tạp',
  'Electron & lỗ trống, bán dẫn loại n/p, tạp chất donor/acceptor, hạt dẫn đa số/thiểu số, nồng độ hạt dẫn (n·p = ni²).',
  [[
    `<span class="eyebrow">SDI101m · Chapter 2 · Lesson 2.1</span>
<h2>Carriers &amp; doping</h2>
<h3>Two kinds of carrier</h3>
<ul>
<li><strong>Electron</strong> — a free negative charge in the conduction band.</li>
<li><strong>Hole</strong> — the empty spot a departed electron leaves in the valence band; it behaves like a mobile <em>positive</em> charge.</li>
</ul>
<p>Both carry current. In an intrinsic semiconductor they always appear in pairs (n = p = n<sub>i</sub>, the intrinsic concentration).</p>
<h3>Doping: n-type and p-type</h3>
<ul>
<li><strong>n-type</strong> — add a group-V <strong>donor</strong> (P, As): it gives an extra electron. Electrons are the <strong>majority</strong> carriers, holes the minority.</li>
<li><strong>p-type</strong> — add a group-III <strong>acceptor</strong> (B): it creates a hole. Holes are the majority carriers, electrons the minority.</li>
</ul>
<pre><code>Mass-action law (equilibrium):
   n · p = ni²          (ni ~ 1.5e10 /cm³ for Si at 300 K)

n-type: n ~ ND  (donor conc.)  ->  p = ni² / ND  (small)
p-type: p ~ NA  (acceptor conc.) -> n = ni² / NA  (small)
</code></pre>
<div class="callout"><span class="badge">Why doping matters</span> A doping of 1 impurity per ~10⁷ Si atoms can raise conductivity by orders of magnitude — and, crucially, lets us build an <strong>n-region next to a p-region</strong>, which is the PN junction (Chapter 4).</div>`,
    `<span class="eyebrow">SDI101m · Chương 2 · Bài 2.1</span>
<h2>Hạt dẫn &amp; pha tạp</h2>
<h3>Hai loại hạt dẫn</h3>
<ul>
<li><strong>Electron</strong> — điện tích âm tự do trong dải dẫn.</li>
<li><strong>Lỗ trống (hole)</strong> — chỗ trống mà electron để lại trong dải hoá trị; nó hành xử như một điện tích <em>dương</em> di động.</li>
</ul>
<p>Cả hai đều mang dòng. Trong bán dẫn thuần chúng luôn sinh theo cặp (n = p = n<sub>i</sub>, nồng độ thuần).</p>
<h3>Pha tạp: loại n và loại p</h3>
<ul>
<li><strong>Loại n</strong> — thêm tạp <strong>donor</strong> nhóm V (P, As): cho thêm một electron. Electron là hạt dẫn <strong>đa số</strong>, lỗ trống là thiểu số.</li>
<li><strong>Loại p</strong> — thêm tạp <strong>acceptor</strong> nhóm III (B): tạo ra một lỗ trống. Lỗ trống là hạt dẫn đa số, electron là thiểu số.</li>
</ul>
<pre><code>Định luật tác dụng khối (cân bằng):
   n · p = ni²          (ni ~ 1,5e10 /cm³ với Si ở 300 K)

Loại n: n ~ ND  (nồng độ donor)   ->  p = ni² / ND  (nhỏ)
Loại p: p ~ NA  (nồng độ acceptor) -> n = ni² / NA  (nhỏ)
</code></pre>
<div class="callout"><span class="badge">Vì sao pha tạp quan trọng</span> Pha 1 tạp chất trên ~10⁷ nguyên tử Si có thể làm độ dẫn tăng nhiều bậc — và quan trọng hơn, cho phép dựng một <strong>vùng n cạnh vùng p</strong>, chính là chuyển tiếp PN (Chương 4).</div>`,
  ]]);

const c2q = quiz('sdi101m-quiz-2', 'Quiz 2 — Carriers & doping|||Quiz 2 — Hạt dẫn & pha tạp', [
  { id: 'q1', question: 'Trong bán dẫn loại n, hạt dẫn đa số là?', options: ['Lỗ trống', 'Electron', 'Ion donor', 'Proton'], correctIndex: 1, explanation: 'Donor nhóm V cho thêm electron → electron là hạt dẫn đa số.' },
  { id: 'q2', question: 'Tạp chất acceptor (vd Boron) tạo ra bán dẫn loại gì?', options: ['Loại n', 'Loại p', 'Thuần', 'Cách điện'], correctIndex: 1, explanation: 'Acceptor nhóm III tạo lỗ trống → bán dẫn loại p.' },
  { id: 'q3', question: 'Định luật tác dụng khối ở cân bằng nói?', options: ['n + p = ni', 'n · p = ni²', 'n = p luôn luôn', 'n · p = 0'], correctIndex: 1, explanation: 'n·p = ni² ở cân bằng nhiệt; pha tạp làm một loại tăng, loại kia giảm.' },
]);

const c3 = doc('sdi101m-3-1-dong-dien', '3.1 — Current in semiconductors|||3.1 — Dòng điện trong bán dẫn',
  'Dòng trôi (drift, do điện trường), dòng khuếch tán (diffusion, do gradient nồng độ), độ linh động μ, điện trở suất ρ.',
  [[
    `<span class="eyebrow">SDI101m · Chapter 3 · Lesson 3.1</span>
<h2>Current in semiconductors</h2>
<p>Two independent mechanisms move carriers and make current:</p>
<h3>1. Drift — driven by an electric field</h3>
<p>Apply an electric field E and carriers accelerate, reaching an average <strong>drift velocity</strong> v = μ·E, where <strong>μ (mobility)</strong> says how easily a carrier moves. Electrons are more mobile than holes.</p>
<h3>2. Diffusion — driven by a concentration gradient</h3>
<p>Carriers spread from where they are dense to where they are sparse — like a drop of ink in water. This needs <em>no</em> field, only an uneven concentration. Diffusion is essential to how the PN junction and transistors work.</p>
<pre><code>Drift current density:   J = q·(n·μn + p·μp)·E
Conductivity:            σ = q·(n·μn + p·μp)
Resistivity:             ρ = 1 / σ

Si mobility (approx, 300 K):  μn ~ 1350,  μp ~ 480  cm²/V·s
=> electrons drift faster than holes for the same field.
</code></pre>
<div class="callout"><span class="badge">Two engines</span> <strong>Drift</strong> answers to voltage; <strong>diffusion</strong> answers to concentration. Real devices use both at once — the diode current, for instance, is a diffusion current across the junction.</div>`,
    `<span class="eyebrow">SDI101m · Chương 3 · Bài 3.1</span>
<h2>Dòng điện trong bán dẫn</h2>
<p>Hai cơ chế độc lập làm hạt dẫn di chuyển và sinh dòng:</p>
<h3>1. Dòng trôi (drift) — do điện trường</h3>
<p>Đặt điện trường E, hạt dẫn tăng tốc và đạt <strong>vận tốc trôi</strong> trung bình v = μ·E, với <strong>μ (độ linh động)</strong> cho biết hạt dẫn di chuyển dễ đến đâu. Electron linh động hơn lỗ trống.</p>
<h3>2. Dòng khuếch tán (diffusion) — do gradient nồng độ</h3>
<p>Hạt dẫn lan từ nơi đậm đặc sang nơi thưa — như giọt mực trong nước. Cơ chế này <em>không</em> cần điện trường, chỉ cần nồng độ không đều. Khuếch tán là cốt lõi trong hoạt động của chuyển tiếp PN và transistor.</p>
<pre><code>Mật độ dòng trôi:   J = q·(n·μn + p·μp)·E
Độ dẫn:             σ = q·(n·μn + p·μp)
Điện trở suất:      ρ = 1 / σ

Độ linh động Si (xấp xỉ, 300 K):  μn ~ 1350,  μp ~ 480  cm²/V·s
=> electron trôi nhanh hơn lỗ trống với cùng một điện trường.
</code></pre>
<div class="callout"><span class="badge">Hai động cơ</span> <strong>Trôi</strong> đáp lại điện áp; <strong>khuếch tán</strong> đáp lại nồng độ. Linh kiện thật dùng cả hai cùng lúc — ví dụ dòng diode chính là dòng khuếch tán qua chuyển tiếp.</div>`,
  ]]);

const c3q = quiz('sdi101m-quiz-3', 'Quiz 3 — Current|||Quiz 3 — Dòng điện', [
  { id: 'q1', question: 'Dòng trôi (drift) sinh ra do?', options: ['Gradient nồng độ', 'Điện trường tác dụng lên hạt dẫn', 'Ánh sáng', 'Nhiệt độ thấp'], correctIndex: 1, explanation: 'Drift: điện trường E làm hạt dẫn trôi với v = μ·E.' },
  { id: 'q2', question: 'Dòng khuếch tán (diffusion) sinh ra do?', options: ['Điện trường', 'Chênh lệch (gradient) nồng độ hạt dẫn', 'Từ trường', 'Điện dung'], correctIndex: 1, explanation: 'Khuếch tán: hạt dẫn lan từ nơi đậm sang nơi thưa, không cần điện trường.' },
  { id: 'q3', question: 'Độ linh động μ của electron so với lỗ trống trong Si?', options: ['Nhỏ hơn', 'Bằng nhau', 'Lớn hơn (electron linh động hơn)', 'Bằng 0'], correctIndex: 2, explanation: 'μn ~ 1350 > μp ~ 480 cm²/V·s → electron trôi nhanh hơn.' },
]);

const c4 = doc('sdi101m-4-1-pn-junction', '4.1 — The PN junction|||4.1 — Chuyển tiếp PN',
  'Chuyển tiếp PN, vùng nghèo, điện trường & điện thế nội, phân cực thuận/nghịch, phương trình diode I-V (Shockley).',
  [[
    `<span class="eyebrow">SDI101m · Chapter 4 · Lesson 4.1</span>
<h2>The PN junction</h2>
<h3>What forms at the junction</h3>
<p>Put p-type next to n-type. Electrons and holes diffuse across and recombine, leaving behind fixed ionised dopants. This creates a <strong>depletion region</strong> — swept clean of mobile carriers — with a <strong>built-in electric field</strong> and a <strong>built-in potential (V<sub>bi</sub> ~ 0.7 V for Si)</strong> that opposes further diffusion. At equilibrium, drift and diffusion balance.</p>
<h3>Biasing the junction</h3>
<ul>
<li><strong>Forward bias</strong> (p to +, n to −): the applied voltage shrinks the barrier → current rises steeply once V exceeds ~0.7 V.</li>
<li><strong>Reverse bias</strong> (p to −, n to +): the barrier widens → only a tiny saturation current I<sub>S</sub> flows. This one-way behaviour is the <strong>diode</strong>.</li>
</ul>
<pre><code>Shockley diode equation:
   I = IS · ( e^(V / (n·VT)) − 1 )

   VT = kT/q ~ 0.026 V at 300 K  (thermal voltage)
   Forward: exponential rise.  Reverse: I ~ −IS (tiny).
</code></pre>
<div class="callout"><span class="badge">The first device</span> The PN junction is the <strong>atom of modern electronics</strong>: a diode is one junction; a BJT is two; a MOSFET controls junctions with a field. Master this and the rest follows.</div>`,
    `<span class="eyebrow">SDI101m · Chương 4 · Bài 4.1</span>
<h2>Chuyển tiếp PN</h2>
<h3>Điều gì hình thành tại chuyển tiếp</h3>
<p>Đặt loại p cạnh loại n. Electron và lỗ trống khuếch tán qua nhau và tái hợp, để lại các ion tạp cố định. Việc này tạo một <strong>vùng nghèo</strong> — sạch hạt dẫn di động — kèm một <strong>điện trường nội</strong> và một <strong>điện thế nội (V<sub>bi</sub> ~ 0,7 V với Si)</strong> chống lại khuếch tán tiếp. Ở cân bằng, dòng trôi và dòng khuếch tán bù nhau.</p>
<h3>Phân cực chuyển tiếp</h3>
<ul>
<li><strong>Phân cực thuận</strong> (p nối +, n nối −): điện áp làm mỏng rào thế → dòng tăng dốc khi V vượt ~0,7 V.</li>
<li><strong>Phân cực nghịch</strong> (p nối −, n nối +): rào thế dày thêm → chỉ có dòng bão hoà rất nhỏ I<sub>S</sub>. Tính một chiều này chính là <strong>diode</strong>.</li>
</ul>
<pre><code>Phương trình diode Shockley:
   I = IS · ( e^(V / (n·VT)) − 1 )

   VT = kT/q ~ 0,026 V ở 300 K  (điện áp nhiệt)
   Thuận: tăng theo hàm mũ.  Nghịch: I ~ −IS (rất nhỏ).
</code></pre>
<div class="callout"><span class="badge">Linh kiện đầu tiên</span> Chuyển tiếp PN là <strong>nguyên tử của điện tử hiện đại</strong>: diode là một chuyển tiếp; BJT là hai; MOSFET dùng điện trường điều khiển chuyển tiếp. Nắm chắc nó thì phần còn lại theo sau.</div>`,
  ]]);

const c4q = quiz('sdi101m-quiz-4', 'Quiz 4 — PN junction|||Quiz 4 — Chuyển tiếp PN', [
  { id: 'q1', question: 'Vùng nghèo (depletion region) trong chuyển tiếp PN là?', options: ['Vùng đầy hạt dẫn di động', 'Vùng bị quét sạch hạt dẫn di động, có điện trường nội', 'Vùng kim loại', 'Vùng cách điện tuyệt đối'], correctIndex: 1, explanation: 'Hạt dẫn khuếch tán qua và tái hợp, để lại ion cố định → vùng nghèo có điện trường nội.' },
  { id: 'q2', question: 'Diode dẫn dòng mạnh khi được phân cực thế nào?', options: ['Phân cực nghịch', 'Phân cực thuận (V vượt ~0,7 V)', 'Không phân cực', 'Chỉ với AC'], correctIndex: 1, explanation: 'Phân cực thuận làm mỏng rào thế → dòng tăng theo hàm mũ khi V > ~0,7 V.' },
  { id: 'q3', question: 'Phương trình Shockley mô tả diode: dòng phân cực nghịch xấp xỉ?', options: ['Tăng theo hàm mũ', 'Bằng dòng bão hoà nhỏ I_S', 'Bằng vô cùng', 'Bằng V/R'], correctIndex: 1, explanation: 'Nghịch: I ~ −I_S, chỉ một dòng bão hoà rất nhỏ.' },
]);

const c5 = doc('sdi101m-5-1-diode-ung-dung', '5.1 — Diodes & applications|||5.1 — Diode & ứng dụng',
  'Diode chỉnh lưu, diode Zener (ổn áp), LED, photodiode; mạch chỉnh lưu nửa chu kỳ/cầu, lọc bằng tụ.',
  [[
    `<span class="eyebrow">SDI101m · Chapter 5 · Lesson 5.1</span>
<h2>Diodes &amp; applications</h2>
<h3>A family of diodes</h3>
<ul>
<li><strong>Rectifier diode</strong> — conducts one way; turns AC into DC.</li>
<li><strong>Zener diode</strong> — deliberately operated in reverse breakdown at a fixed voltage → a simple <strong>voltage reference / regulator</strong>.</li>
<li><strong>LED</strong> — a forward-biased junction that emits light when electrons and holes recombine (colour set by the band gap).</li>
<li><strong>Photodiode</strong> — the reverse: light generates carriers → current. Used in sensors and solar cells.</li>
</ul>
<h3>Rectifier circuits</h3>
<pre><code>Half-wave:  1 diode  -> passes only one half of the AC wave
Full-bridge: 4 diodes -> uses both halves (smoother, efficient)
   AC -> rectifier -> pulsing DC -> C filter -> smoother DC
</code></pre>
<p>A capacitor after the rectifier smooths the pulses into near-steady DC — the front end of every power supply.</p>
<div class="callout"><span class="badge">One junction, many jobs</span> Change the doping, the geometry or the operating point and the same PN junction becomes a rectifier, a regulator, a light source or a light sensor.</div>`,
    `<span class="eyebrow">SDI101m · Chương 5 · Bài 5.1</span>
<h2>Diode &amp; ứng dụng</h2>
<h3>Một họ diode</h3>
<ul>
<li><strong>Diode chỉnh lưu</strong> — dẫn một chiều; biến AC thành DC.</li>
<li><strong>Diode Zener</strong> — cố ý làm việc ở vùng đánh thủng nghịch tại một điện áp cố định → một <strong>nguồn áp chuẩn / ổn áp</strong> đơn giản.</li>
<li><strong>LED</strong> — chuyển tiếp phân cực thuận phát ra ánh sáng khi electron và lỗ trống tái hợp (màu do khe cấm quyết định).</li>
<li><strong>Photodiode</strong> — chiều ngược lại: ánh sáng sinh hạt dẫn → dòng điện. Dùng trong cảm biến và pin mặt trời.</li>
</ul>
<h3>Mạch chỉnh lưu</h3>
<pre><code>Nửa chu kỳ:  1 diode  -> chỉ cho một nửa sóng AC qua
Cầu (4 diode):        -> dùng cả hai nửa (mượt hơn, hiệu quả)
   AC -> chỉnh lưu -> DC nhấp nhô -> lọc bằng tụ C -> DC mượt hơn
</code></pre>
<p>Một tụ sau chỉnh lưu làm phẳng các gợn thành DC gần như ổn định — tầng đầu của mọi bộ nguồn.</p>
<div class="callout"><span class="badge">Một chuyển tiếp, nhiều việc</span> Đổi pha tạp, hình học hoặc điểm làm việc thì cùng một chuyển tiếp PN thành diode chỉnh lưu, ổn áp, nguồn sáng hay cảm biến ánh sáng.</div>`,
  ]]);

const c5q = quiz('sdi101m-quiz-5', 'Quiz 5 — Diodes & apps|||Quiz 5 — Diode & ứng dụng', [
  { id: 'q1', question: 'Diode Zener thường được dùng làm gì?', options: ['Phát sáng', 'Ổn áp / nguồn áp chuẩn (làm việc ở đánh thủng nghịch)', 'Khuếch đại', 'Cảm biến ánh sáng'], correctIndex: 1, explanation: 'Zener làm việc ở vùng đánh thủng nghịch tại áp cố định → ổn áp.' },
  { id: 'q2', question: 'LED phát sáng nhờ cơ chế nào?', options: ['Điện trở toả nhiệt', 'Electron và lỗ trống tái hợp ở chuyển tiếp phân cực thuận', 'Ánh sáng tới sinh dòng', 'Đánh thủng nghịch'], correctIndex: 1, explanation: 'Tái hợp electron-lỗ trống ở chuyển tiếp thuận phát photon; màu do khe cấm.' },
  { id: 'q3', question: 'Trong mạch chỉnh lưu, tụ điện đặt sau chỉnh lưu để?', options: ['Tăng điện áp gấp đôi', 'Làm phẳng (lọc) DC nhấp nhô', 'Chặn dòng một chiều', 'Phát sáng'], correctIndex: 1, explanation: 'Tụ lọc làm phẳng gợn của DC nhấp nhô thành DC mượt hơn.' },
]);

const c6 = doc('sdi101m-6-1-bjt', '6.1 — The BJT transistor|||6.1 — Transistor BJT',
  'Cấu tạo NPN/PNP (E-B-C), nguyên lý, vùng làm việc (cut-off/active/saturation), khuếch đại (β), đặc tuyến ra.',
  [[
    `<span class="eyebrow">SDI101m · Chapter 6 · Lesson 6.1</span>
<h2>The Bipolar Junction Transistor (BJT)</h2>
<h3>Structure</h3>
<p>A BJT is a sandwich of three doped regions — <strong>NPN</strong> or <strong>PNP</strong> — giving three terminals: <strong>Emitter (E), Base (B), Collector (C)</strong> and two PN junctions. The base is thin and lightly doped; that is the key to how it works.</p>
<h3>How it works</h3>
<p>In an NPN with the base-emitter junction forward-biased and base-collector reverse-biased, electrons injected from the emitter mostly sweep across the thin base to the collector. A <strong>small base current I<sub>B</sub> controls a much larger collector current I<sub>C</sub></strong>.</p>
<pre><code>Current gain:   IC = β · IB     (β typically 50–300)
                IE = IB + IC

Operating regions:
  Cut-off     -> OFF      (both junctions reverse: IC ~ 0)
  Active      -> AMPLIFY  (BE forward, BC reverse: IC = β·IB)
  Saturation  -> ON       (both forward: acts like a closed switch)
</code></pre>
<h3>Output characteristics</h3>
<p>Plot I<sub>C</sub> vs V<sub>CE</sub> for several I<sub>B</sub>: current rises fast then flattens into the <strong>active region</strong>, where I<sub>C</sub> is set by I<sub>B</sub>, not V<sub>CE</sub> — the flat curves are the amplifier at work.</p>
<div class="callout"><span class="badge">Small controls large</span> The BJT is <strong>current-controlled</strong>: I<sub>B</sub> steers I<sub>C</sub>. It amplifies (active) or switches (cut-off ↔ saturation) — the same two jobs every transistor does.</div>`,
    `<span class="eyebrow">SDI101m · Chương 6 · Bài 6.1</span>
<h2>Transistor lưỡng cực (BJT)</h2>
<h3>Cấu tạo</h3>
<p>BJT là ba lớp pha tạp xếp lớp — <strong>NPN</strong> hoặc <strong>PNP</strong> — cho ba cực: <strong>Emitter (E), Base (B), Collector (C)</strong> và hai chuyển tiếp PN. Vùng base mỏng và pha tạp nhẹ; đó là mấu chốt cách nó hoạt động.</p>
<h3>Nguyên lý</h3>
<p>Với NPN, chuyển tiếp base-emitter phân cực thuận và base-collector phân cực nghịch, electron phun từ emitter phần lớn vượt qua base mỏng sang collector. Một <strong>dòng base nhỏ I<sub>B</sub> điều khiển dòng collector I<sub>C</sub> lớn hơn nhiều</strong>.</p>
<pre><code>Hệ số khuếch đại:   IC = β · IB     (β thường 50–300)
                    IE = IB + IC

Các vùng làm việc:
  Cut-off     -> TẮT       (cả hai chuyển tiếp nghịch: IC ~ 0)
  Active      -> KHUẾCH ĐẠI (BE thuận, BC nghịch: IC = β·IB)
  Saturation  -> BẬT       (cả hai thuận: như công tắc đóng)
</code></pre>
<h3>Đặc tuyến ra</h3>
<p>Vẽ I<sub>C</sub> theo V<sub>CE</sub> với vài giá trị I<sub>B</sub>: dòng tăng nhanh rồi phẳng ra ở <strong>vùng active</strong>, nơi I<sub>C</sub> do I<sub>B</sub> quyết định chứ không do V<sub>CE</sub> — các đường phẳng chính là mạch khuếch đại đang làm việc.</p>
<div class="callout"><span class="badge">Nhỏ điều khiển lớn</span> BJT được <strong>điều khiển bằng dòng</strong>: I<sub>B</sub> lái I<sub>C</sub>. Nó khuếch đại (active) hoặc chuyển mạch (cut-off ↔ saturation) — đúng hai việc mà mọi transistor đều làm.</div>`,
  ]]);

const c6q = quiz('sdi101m-quiz-6', 'Quiz 6 — BJT|||Quiz 6 — Transistor BJT', [
  { id: 'q1', question: 'Ba cực của một BJT là?', options: ['Gate, Source, Drain', 'Emitter, Base, Collector', 'Anode, Cathode, Gate', 'P, N, I'], correctIndex: 1, explanation: 'BJT có Emitter, Base, Collector và hai chuyển tiếp PN.' },
  { id: 'q2', question: 'Ở vùng active, quan hệ dòng của BJT là?', options: ['IB = β · IC', 'IC = β · IB', 'IC = 0', 'IC = IE − 2IB'], correctIndex: 1, explanation: 'Vùng active: dòng nhỏ IB điều khiển dòng lớn IC = β·IB.' },
  { id: 'q3', question: 'BJT hoạt động như công tắc ĐÓNG (dẫn hoàn toàn) ở vùng?', options: ['Cut-off', 'Active', 'Saturation', 'Breakdown'], correctIndex: 2, explanation: 'Saturation (cả hai chuyển tiếp thuận) → dẫn mạnh, như công tắc đóng.' },
]);

const c7 = doc('sdi101m-7-1-mosfet', '7.1 — The MOSFET transistor|||7.1 — Transistor MOSFET',
  'Cấu tạo MOS (Gate-oxide-bán dẫn), G-D-S, enhancement/depletion, điện áp ngưỡng Vth, kênh, vùng triode/saturation, đặc tuyến.',
  [[
    `<span class="eyebrow">SDI101m · Chapter 7 · Lesson 7.1</span>
<h2>The MOSFET transistor</h2>
<h3>MOS structure</h3>
<p>A <strong>MOSFET</strong> is built on the <strong>Metal–Oxide–Semiconductor</strong> stack: a <strong>Gate</strong> sits on a thin insulating <strong>oxide</strong> over the semiconductor, between the <strong>Source</strong> and <strong>Drain</strong>. Unlike the BJT, the gate draws almost no current — the MOSFET is <strong>voltage-controlled</strong>.</p>
<h3>How it works</h3>
<p>Raise the gate voltage past the <strong>threshold voltage V<sub>th</sub></strong> and it induces a conducting <strong>channel</strong> under the oxide, linking source and drain. Below V<sub>th</sub>, no channel → the device is OFF.</p>
<ul>
<li><strong>Enhancement mode</strong> — normally OFF; a gate voltage turns it ON (the workhorse of digital logic).</li>
<li><strong>Depletion mode</strong> — normally ON; a gate voltage turns it OFF.</li>
</ul>
<pre><code>NMOS (enhancement), VGS > Vth:
  Triode (linear):  VDS small  -> acts like a voltage-controlled resistor
  Saturation:       VDS >= VGS − Vth
     ID ~ (k/2)·(VGS − Vth)²   (current set by the gate)
Below threshold (VGS < Vth): OFF, ID ~ 0
</code></pre>
<div class="callout"><span class="badge">Why MOSFETs won</span> Voltage control, near-zero gate current and easy miniaturisation make the MOSFET the transistor of <strong>every modern digital IC</strong> — billions per chip.</div>`,
    `<span class="eyebrow">SDI101m · Chương 7 · Bài 7.1</span>
<h2>Transistor MOSFET</h2>
<h3>Cấu tạo MOS</h3>
<p>Một <strong>MOSFET</strong> dựng trên chồng lớp <strong>Kim loại–Oxit–Bán dẫn</strong>: một <strong>cực Gate</strong> nằm trên lớp <strong>oxit</strong> cách điện mỏng phủ trên bán dẫn, giữa <strong>Source</strong> và <strong>Drain</strong>. Khác BJT, gate gần như không lấy dòng — MOSFET được <strong>điều khiển bằng điện áp</strong>.</p>
<h3>Nguyên lý</h3>
<p>Tăng điện áp gate vượt <strong>điện áp ngưỡng V<sub>th</sub></strong> thì nó cảm ứng một <strong>kênh dẫn</strong> dưới lớp oxit, nối source với drain. Dưới V<sub>th</sub>, không có kênh → linh kiện TẮT.</p>
<ul>
<li><strong>Kiểu tăng cường (enhancement)</strong> — thường TẮT; đặt áp gate làm nó BẬT (chủ lực của logic số).</li>
<li><strong>Kiểu nghèo (depletion)</strong> — thường BẬT; đặt áp gate làm nó TẮT.</li>
</ul>
<pre><code>NMOS (tăng cường), VGS > Vth:
  Triode (tuyến tính):  VDS nhỏ  -> như điện trở điều khiển bằng áp
  Bão hoà (saturation): VDS >= VGS − Vth
     ID ~ (k/2)·(VGS − Vth)²   (dòng do gate quyết định)
Dưới ngưỡng (VGS < Vth): TẮT, ID ~ 0
</code></pre>
<div class="callout"><span class="badge">Vì sao MOSFET thắng</span> Điều khiển bằng áp, dòng gate gần như bằng 0 và dễ thu nhỏ khiến MOSFET là transistor của <strong>mọi IC số hiện đại</strong> — hàng tỉ con trên một chip.</div>`,
  ]]);

const c7q = quiz('sdi101m-quiz-7', 'Quiz 7 — MOSFET|||Quiz 7 — Transistor MOSFET', [
  { id: 'q1', question: 'MOSFET được điều khiển chủ yếu bằng?', options: ['Dòng gate lớn', 'Điện áp gate (gần như không lấy dòng)', 'Ánh sáng', 'Nhiệt độ'], correctIndex: 1, explanation: 'Gate nằm trên lớp oxit cách điện → điều khiển bằng áp, dòng gate ~ 0.' },
  { id: 'q2', question: 'Kênh dẫn của MOSFET tăng cường (NMOS) hình thành khi?', options: ['VGS < 0', 'VGS vượt điện áp ngưỡng Vth', 'VDS = 0', 'Không cần điện áp'], correctIndex: 1, explanation: 'VGS > Vth cảm ứng kênh nối source-drain; dưới Vth thì TẮT.' },
  { id: 'q3', question: 'MOSFET kiểu enhancement ở trạng thái nghỉ (chưa đặt áp gate)?', options: ['Thường BẬT (dẫn)', 'Thường TẮT (không dẫn)', 'Luôn khuếch đại', 'Đánh thủng'], correctIndex: 1, explanation: 'Enhancement thường TẮT; cần áp gate > Vth để BẬT — nền của logic số.' },
]);

const c8 = doc('sdi101m-8-1-ic', '8.1 — From devices to ICs|||8.1 — Từ linh kiện tới IC',
  'CMOS cơ bản (NMOS+PMOS), scaling & định luật Moore, quy trình chế tạo wafer tổng quan, vai trò linh kiện trong vi mạch.',
  [[
    `<span class="eyebrow">SDI101m · Chapter 8 · Lesson 8.1</span>
<h2>From devices to integrated circuits</h2>
<h3>CMOS — the basic building block</h3>
<p>Modern logic uses <strong>CMOS (Complementary MOS)</strong>: an NMOS and a PMOS transistor paired so that one is ON when the other is OFF. A CMOS inverter draws almost <strong>no static power</strong> — current flows mainly while switching. That efficiency is why CMOS powers essentially all digital chips.</p>
<h3>Scaling &amp; Moore's law</h3>
<p><strong>Moore's law</strong>: the number of transistors on a chip roughly <strong>doubles about every two years</strong>. Shrinking transistors makes them faster, cheaper and lower-power — the engine behind decades of computing progress (now pushed by 3D structures like FinFET/GAA as classic scaling slows).</p>
<h3>Wafer fabrication (overview)</h3>
<pre><code>Silicon wafer
  -> Oxidation (grow SiO2)
  -> Photolithography (pattern with light + photoresist)
  -> Doping (ion implantation / diffusion)
  -> Etching + thin-film deposition (metal interconnect)
  -> repeat many layers -> test -> dice -> package
</code></pre>
<div class="callout"><span class="badge">Where this course leads</span> Everything you learned — bands, carriers, the PN junction, BJT and MOSFET — comes together here: <strong>millions to billions of these devices on one piece of silicon</strong>. That is the doorway into IC design.</div>`,
    `<span class="eyebrow">SDI101m · Chương 8 · Bài 8.1</span>
<h2>Từ linh kiện tới mạch tích hợp</h2>
<h3>CMOS — khối dựng cơ bản</h3>
<p>Logic hiện đại dùng <strong>CMOS (MOS bù)</strong>: một NMOS và một PMOS ghép đôi sao cho con này BẬT thì con kia TẮT. Một cổng đảo CMOS gần như <strong>không tiêu tán công suất tĩnh</strong> — dòng chủ yếu chỉ chảy lúc chuyển mạch. Hiệu quả đó là lý do CMOS chiếm hầu hết mọi chip số.</p>
<h3>Thu nhỏ &amp; định luật Moore</h3>
<p><strong>Định luật Moore</strong>: số transistor trên một chip <strong>tăng gấp đôi khoảng mỗi hai năm</strong>. Thu nhỏ transistor làm chúng nhanh hơn, rẻ hơn và ít tốn điện hơn — động cơ của hàng chục năm tiến bộ tính toán (nay được đẩy tiếp bằng cấu trúc 3D như FinFET/GAA khi thu nhỏ kiểu cũ chậm lại).</p>
<h3>Chế tạo wafer (tổng quan)</h3>
<pre><code>Phiến silic (wafer)
  -> Oxy hoá (tạo lớp SiO2)
  -> Quang khắc (tạo hình bằng ánh sáng + chất cản quang)
  -> Pha tạp (cấy ion / khuếch tán)
  -> Ăn mòn + lắng màng mỏng (dây nối kim loại)
  -> lặp nhiều lớp -> kiểm tra -> cắt -> đóng gói
</code></pre>
<div class="callout"><span class="badge">Môn này dẫn tới đâu</span> Mọi thứ bạn đã học — dải năng lượng, hạt dẫn, chuyển tiếp PN, BJT và MOSFET — hội tụ ở đây: <strong>hàng triệu tới hàng tỉ linh kiện trên một mẩu silic</strong>. Đó là cánh cửa vào thiết kế vi mạch.</div>`,
  ]]);

const c8q = quiz('sdi101m-quiz-8', 'Quiz 8 — Devices to ICs|||Quiz 8 — Từ linh kiện tới IC', [
  { id: 'q1', question: 'Vì sao CMOS được dùng cho hầu hết chip số?', options: ['Vì nó khuếch đại mạnh nhất', 'Vì gần như không tiêu tán công suất tĩnh', 'Vì phát sáng', 'Vì chịu điện áp cao'], correctIndex: 1, explanation: 'CMOS (NMOS+PMOS bù) gần như không tốn công suất tĩnh, dòng chỉ chảy lúc chuyển mạch.' },
  { id: 'q2', question: 'Định luật Moore phát biểu?', options: ['Điện áp giảm một nửa mỗi năm', 'Số transistor trên chip tăng gấp đôi khoảng mỗi hai năm', 'Tốc độ ánh sáng là hằng số', 'Khe cấm không đổi'], correctIndex: 1, explanation: 'Moore: số transistor trên chip tăng gấp đôi ~mỗi hai năm nhờ thu nhỏ.' },
  { id: 'q3', question: 'Trong quy trình chế tạo wafer, bước tạo hình mạch bằng ánh sáng và chất cản quang gọi là?', options: ['Oxy hoá', 'Quang khắc (photolithography)', 'Đóng gói', 'Cấy ion'], correctIndex: 1, explanation: 'Quang khắc dùng ánh sáng + photoresist để in hình mẫu mạch lên wafer.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'SDI101m',
    slug: 'sdi101m-introduction-to-semiconductor-devices',
    title: 'Introduction to Semiconductor Devices',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SDI101m.webp',
    shortDescription: 'Semiconductor devices from first principles — crystals & energy bands, carriers & doping (n/p), drift/diffusion current, the PN junction, diodes (rectifier/Zener/LED/photodiode), BJT & MOSFET transistors, on to CMOS ICs & Moore scaling. Bilingual, with physics & worked examples.|||Linh kiện bán dẫn từ gốc — tinh thể & dải năng lượng, hạt dẫn & pha tạp, dòng trôi/khuếch tán, chuyển tiếp PN, diode, transistor BJT & MOSFET, tới IC CMOS & Moore. Song ngữ, có vật lý & ví dụ.',
    description: 'Môn <strong>SDI101m — Introduction to Semiconductor Devices</strong> (Nhập môn Linh kiện bán dẫn, kỳ 1, ngành Thiết kế vi mạch bán dẫn) giải thích <strong>các khối dựng nên mọi con chip hoạt động thế nào</strong>. Từ <strong>vật liệu &amp; dải năng lượng</strong> (Si/Ge, tinh thể, khe cấm) → <strong>hạt dẫn &amp; pha tạp</strong> (electron/lỗ trống, loại n/p) → <strong>dòng điện</strong> (trôi &amp; khuếch tán) → <strong>chuyển tiếp PN</strong> → <strong>diode</strong> (chỉnh lưu, Zener, LED, photodiode) → <strong>transistor BJT &amp; MOSFET</strong> → <strong>từ linh kiện tới IC CMOS</strong>. Bám giáo trình chuẩn quốc tế (Neamen; Sedra &amp; Smith; Streetman), song ngữ, có vật lý, công thức/đặc tuyến và ví dụ, quiz mỗi chương.',
    whatYouLearn: 'Chất bán dẫn Si/Ge, cấu trúc tinh thể &amp; dải năng lượng (khe cấm Eg); electron/lỗ trống, pha tạp donor/acceptor, loại n/p, n·p = ni²; dòng trôi &amp; khuếch tán, độ linh động &amp; điện trở suất; chuyển tiếp PN (vùng nghèo, phân cực thuận/nghịch, phương trình Shockley); diode chỉnh lưu/Zener/LED/photodiode &amp; mạch chỉnh lưu; transistor BJT (vùng cut-off/active/saturation, β); MOSFET (Vth, kênh, triode/bão hoà); CMOS, chế tạo wafer &amp; định luật Moore.',
    requirements: 'Toán/vật lý phổ thông (điện, nguyên tử cơ bản). Không cần kiến thức mạch trước. Nên dùng nanoHUB hoặc Falstad để mô phỏng chuyển tiếp PN &amp; transistor.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide FLM, sách chuẩn quốc tế, nanoHUB, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Linh kiện bán dẫn là gì, vì sao là nền vi mạch, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Vật liệu bán dẫn|||Chapter 1 — Semiconductor materials', description: 'Si/Ge, tinh thể, dải năng lượng, khe cấm, thuần/pha tạp.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hạt dẫn & pha tạp|||Chapter 2 — Carriers & doping', description: 'Electron/lỗ trống, loại n/p, donor/acceptor, nồng độ hạt dẫn.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Dòng điện trong bán dẫn|||Chapter 3 — Current', description: 'Dòng trôi, khuếch tán, độ linh động, điện trở suất.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Chuyển tiếp PN|||Chapter 4 — PN junction', description: 'Vùng nghèo, phân cực thuận/nghịch, diode I-V (Shockley).', lessons: [c4, c4q] },
    { title: 'Chương 5 — Diode & ứng dụng|||Chapter 5 — Diodes & apps', description: 'Chỉnh lưu, Zener, LED, photodiode, mạch chỉnh lưu.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Transistor BJT|||Chapter 6 — BJT', description: 'NPN/PNP, vùng làm việc, khuếch đại β, đặc tuyến.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Transistor MOSFET|||Chapter 7 — MOSFET', description: 'Cấu tạo MOS, enhancement/depletion, Vth, đặc tuyến.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Từ linh kiện tới IC|||Chapter 8 — Devices to ICs', description: 'CMOS, scaling/Moore, chế tạo wafer, vai trò trong vi mạch.', lessons: [c8, c8q] },
  ],
};
