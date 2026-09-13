/**
 * EGA301 — E-Government and Public Administration (Chính phủ điện tử &
 * Hành chính công). Ngành Chuyển đổi số FPTU, Kỳ 5.
 * Khung 8 chương, song ngữ VI+EN. Nguồn chuẩn: UN E-Government Survey,
 * OECD Digital Government Framework, World Bank GovTech, Cổng DVC Quốc gia
 * VN, Đề án 06. Ví dụ thật: Estonia, Singapore, VNeID, Cổng DVC.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${}; & → &amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ega301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: khung chuẩn quốc tế (UN, OECD, World Bank), nền tảng VN (Cổng DVC Quốc gia, Đề án 06), lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">EGA301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study E-government and public administration — from the global standards (UN, OECD, World Bank) to the Vietnamese platforms (National Public Service Portal, Project 06) — in one place. Free, official, legal sources.</p>
<h3>🌐 Global frameworks</h3>
<ul>
<li><a href="https://publicadministration.un.org/egovkb/en-us/" target="_blank" rel="noopener">UN E-Government Survey / EGDI</a> — the biennial ranking of every country</li>
<li><a href="https://www.oecd.org/en/topics/digital-government.html" target="_blank" rel="noopener">OECD Digital Government Framework</a></li>
<li><a href="https://www.worldbank.org/en/programs/govtech" target="_blank" rel="noopener">World Bank GovTech</a></li>
</ul>
<h3>🇻🇳 Vietnam platforms &amp; policy</h3>
<ul>
<li><a href="https://dichvucong.gov.vn/" target="_blank" rel="noopener">Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)</a></li>
<li><a href="https://vneid.gov.vn/" target="_blank" rel="noopener">VNeID — định danh điện tử quốc gia</a></li>
<li>Đề án 06 (Quyết định 06/QĐ-TTg 2022) — phát triển dữ liệu dân cư, định danh &amp; xác thực điện tử</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Concepts</strong> — e-government vs e-governance vs digital government; maturity models.</li>
<li><strong>Services</strong> — G2C/G2B/G2G, the four levels of online public service.</li>
<li><strong>Foundations</strong> — national databases, digital ID, data sharing, security &amp; privacy.</li>
<li><strong>Job-ready</strong> — read a real portal (dichvucong.gov.vn), map a procedure, propose a redesign.</li>
</ol></div>`,
    `<span class="eyebrow">EGA301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Chính phủ điện tử &amp; hành chính công — từ chuẩn quốc tế (UN, OECD, World Bank) đến nền tảng Việt Nam (Cổng DVC Quốc gia, Đề án 06) — gom về một chỗ. Nguồn miễn phí, chính thức, hợp pháp.</p>
<h3>🌐 Khung chuẩn quốc tế</h3>
<ul>
<li><a href="https://publicadministration.un.org/egovkb/en-us/" target="_blank" rel="noopener">UN E-Government Survey / EGDI</a> — bảng xếp hạng hai năm một lần của mọi quốc gia</li>
<li><a href="https://www.oecd.org/en/topics/digital-government.html" target="_blank" rel="noopener">Khung Chính phủ số OECD</a></li>
<li><a href="https://www.worldbank.org/en/programs/govtech" target="_blank" rel="noopener">World Bank GovTech</a></li>
</ul>
<h3>🇻🇳 Nền tảng &amp; chính sách Việt Nam</h3>
<ul>
<li><a href="https://dichvucong.gov.vn/" target="_blank" rel="noopener">Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)</a></li>
<li><a href="https://vneid.gov.vn/" target="_blank" rel="noopener">VNeID — định danh điện tử quốc gia</a></li>
<li>Đề án 06 (Quyết định 06/QĐ-TTg 2022) — phát triển dữ liệu dân cư, định danh &amp; xác thực điện tử</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Khái niệm</strong> — e-government khác e-governance khác digital government; mô hình trưởng thành.</li>
<li><strong>Dịch vụ</strong> — G2C/G2B/G2G, bốn mức dịch vụ công trực tuyến.</li>
<li><strong>Nền tảng</strong> — cơ sở dữ liệu quốc gia, định danh số, chia sẻ dữ liệu, an ninh &amp; riêng tư.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc một cổng thật (dichvucong.gov.vn), vẽ lại một thủ tục, đề xuất cải tiến.</li>
</ol></div>`,
  ]]);

const intro = doc('ega301-0-1-overview', 'Course overview: E-Government &amp; Public Administration|||Tổng quan: Chính phủ điện tử &amp; Hành chính công',
  'CPĐT làm gì cho người dân và nhà nước; lộ trình: khái niệm & mức trưởng thành → mô hình dịch vụ → hạ tầng & định danh → số hoá quy trình → dữ liệu mở → an ninh/pháp lý → chính phủ số.',
  [[
    `<span class="eyebrow">EGA301 · Lesson 0.1 · Overview</span>
<h2>E-Government &amp; Public Administration</h2>
<p class="lead">This course explains <strong>how governments deliver services and govern in the digital age</strong> — the ideas behind online public services, national databases, digital identity, and open data, with the global standards (UN, OECD, World Bank) and real Vietnamese practice (the National Public Service Portal, VNeID, Project 06).</p>
<h3>Why it matters</h3>
<p>Every citizen and business touches the state — renewing an ID, paying tax, registering a company. <strong>E-government</strong> turns queues and paper into online, once-only, data-driven services. Done well it is faster, cheaper, and more transparent; done badly it just digitises the old bureaucracy.</p>
<h3>Roadmap</h3>
<p>Concepts &amp; maturity → service models (G2C/G2B/G2G, levels 1-4) → infrastructure &amp; national databases → digital ID &amp; authentication (VNeID) → process digitisation (BPR, one-stop shop) → open data &amp; e-participation → security, law &amp; privacy → digital government &amp; trends (AI, smart city, Project 06). Bilingual, with real cases from Estonia, Singapore and Vietnam.</p>`,
    `<span class="eyebrow">EGA301 · Bài 0.1 · Tổng quan</span>
<h2>Chính phủ điện tử &amp; Hành chính công</h2>
<p class="lead">Môn này giải thích <strong>cách nhà nước cung cấp dịch vụ và quản trị trong thời đại số</strong> — ý tưởng đằng sau dịch vụ công trực tuyến, cơ sở dữ liệu quốc gia, định danh số và dữ liệu mở, cùng chuẩn quốc tế (UN, OECD, World Bank) và thực tiễn Việt Nam (Cổng Dịch vụ công Quốc gia, VNeID, Đề án 06).</p>
<h3>Vì sao quan trọng</h3>
<p>Mọi người dân và doanh nghiệp đều phải làm việc với nhà nước — cấp lại căn cước, nộp thuế, đăng ký công ty. <strong>Chính phủ điện tử</strong> biến hàng chờ và giấy tờ thành dịch vụ trực tuyến, "một lần khai báo", dựa trên dữ liệu. Làm tốt thì nhanh, rẻ, minh bạch hơn; làm dở thì chỉ số hoá lại bộ máy quan liêu cũ.</p>
<h3>Lộ trình</h3>
<p>Khái niệm &amp; trưởng thành → mô hình dịch vụ (G2C/G2B/G2G, mức 1-4) → hạ tầng &amp; cơ sở dữ liệu quốc gia → định danh &amp; xác thực số (VNeID) → số hoá quy trình (BPR, một cửa) → dữ liệu mở &amp; e-participation → an ninh, pháp lý &amp; riêng tư → chính phủ số &amp; xu hướng (AI, đô thị thông minh, Đề án 06). Song ngữ, có ví dụ thật từ Estonia, Singapore và Việt Nam.</p>`,
  ]]);

const c1 = doc('ega301-1-1-what-is-egov', '1.1 — What is e-government?|||1.1 — Chính phủ điện tử là gì?',
  'E-government, e-governance, digital government; các mức trưởng thành (hiện diện → tương tác → giao dịch → chuyển đổi); chỉ số EGDI của UN.',
  [[
    `<span class="eyebrow">EGA301 · Chapter 1 · Lesson 1.1</span>
<h2>What is e-government?</h2>
<h3>Three terms, not one</h3>
<ul>
<li><strong>E-government</strong> — using ICT to deliver public <em>services</em> (a portal, an online form, an e-payment).</li>
<li><strong>E-governance</strong> — the broader use of ICT to <em>govern</em>: policy, participation, transparency, accountability. Governance is the "why"; government is the "what".</li>
<li><strong>Digital government</strong> — the modern stage where digital is the <em>default</em>: data-driven, platform-based, designed around the user, not just online copies of paper forms.</li>
</ul>
<h3>Maturity models</h3>
<p>Most models describe a ladder governments climb:</p>
<pre><code>1. Presence     -> information online (read-only)
2. Interaction  -> download forms, search, email
3. Transaction  -> complete a service end-to-end online + pay
4. Transformation -> joined-up, once-only, proactive services
</code></pre>
<div class="callout"><span class="badge">Measured worldwide</span> The <strong>UN E-Government Survey</strong> ranks every country by the <strong>EGDI</strong> — an average of online services, telecom infrastructure and human capital. Vietnam has been climbing this index as the National Public Service Portal matured.</div>`,
    `<span class="eyebrow">EGA301 · Chương 1 · Bài 1.1</span>
<h2>Chính phủ điện tử là gì?</h2>
<h3>Ba khái niệm, không phải một</h3>
<ul>
<li><strong>Chính phủ điện tử (e-government)</strong> — dùng CNTT để cung cấp <em>dịch vụ</em> công (một cổng, một biểu mẫu trực tuyến, một khoản thanh toán điện tử).</li>
<li><strong>Quản trị điện tử (e-governance)</strong> — dùng CNTT rộng hơn để <em>quản trị</em>: chính sách, sự tham gia, minh bạch, trách nhiệm giải trình. Quản trị là "tại sao"; chính phủ là "cái gì".</li>
<li><strong>Chính phủ số (digital government)</strong> — giai đoạn hiện đại khi số là <em>mặc định</em>: dựa trên dữ liệu, trên nền tảng, thiết kế quanh người dùng, chứ không chỉ là bản sao trực tuyến của giấy tờ.</li>
</ul>
<h3>Mô hình trưởng thành</h3>
<p>Hầu hết mô hình mô tả một chiếc thang nhà nước leo lên:</p>
<pre><code>1. Hiện diện      -> thông tin trực tuyến (chỉ đọc)
2. Tương tác      -> tải biểu mẫu, tìm kiếm, email
3. Giao dịch      -> hoàn tất dịch vụ trực tuyến + thanh toán
4. Chuyển đổi     -> liên thông, một lần khai, chủ động phục vụ
</code></pre>
<div class="callout"><span class="badge">Đo trên toàn cầu</span> <strong>UN E-Government Survey</strong> xếp hạng mọi quốc gia theo chỉ số <strong>EGDI</strong> — trung bình của dịch vụ trực tuyến, hạ tầng viễn thông và vốn con người. Việt Nam liên tục cải thiện chỉ số này khi Cổng Dịch vụ công Quốc gia trưởng thành.</div>`,
  ]]);

const c1q = quiz('ega301-quiz-1', 'Quiz 1 — What is e-government?|||Quiz 1 — CPĐT là gì?', [
  { id: 'q1', question: 'Sự khác nhau chính giữa "e-government" và "e-governance"?|||Main difference between e-government and e-governance?', options: ['Không có gì khác|||No difference', 'E-government là CUNG CẤP DỊCH VỤ; e-governance là QUẢN TRỊ (chính sách, tham gia, minh bạch)|||E-government is service delivery; e-governance is governing (policy, participation, transparency)', 'E-government chỉ dùng cho doanh nghiệp|||E-government is only for business', 'E-governance không dùng CNTT|||E-governance uses no ICT'], correctIndex: 1, explanation: 'E-government = dịch vụ; e-governance = quản trị rộng hơn.' },
  { id: 'q2', question: 'Mức trưởng thành nào cho phép hoàn tất dịch vụ và thanh toán trực tuyến?|||Which maturity level lets you complete a service and pay online?', options: ['Hiện diện (presence)|||Presence', 'Tương tác (interaction)|||Interaction', 'Giao dịch (transaction)|||Transaction', 'Không mức nào|||None'], correctIndex: 2, explanation: 'Mức giao dịch: làm trọn dịch vụ end-to-end và trả tiền online.' },
  { id: 'q3', question: 'UN E-Government Survey xếp hạng các nước bằng chỉ số nào?|||Which index does the UN E-Government Survey use to rank countries?', options: ['GDP', 'EGDI (dịch vụ trực tuyến + hạ tầng + vốn con người)|||EGDI (online services + infrastructure + human capital)', 'CPI', 'PISA'], correctIndex: 1, explanation: 'EGDI = trung bình 3 thành phần: dịch vụ, hạ tầng viễn thông, vốn con người.' },
]);

const c2 = doc('ega301-2-1-service-models', '2.1 — E-service models &amp; the four levels|||2.1 — Mô hình dịch vụ công &amp; bốn mức',
  'Quan hệ G2C/G2B/G2G/G2E; bốn mức dịch vụ công trực tuyến (1 thông tin, 2 tải mẫu, 3 nộp online, 4 thanh toán & trả kết quả điện tử).',
  [[
    `<span class="eyebrow">EGA301 · Chapter 2 · Lesson 2.1</span>
<h2>E-service models &amp; the four levels</h2>
<h3>Who talks to whom</h3>
<ul>
<li><strong>G2C</strong> — Government to Citizen (ID, tax, health, education records).</li>
<li><strong>G2B</strong> — Government to Business (company registration, licences, customs, e-invoicing).</li>
<li><strong>G2G</strong> — Government to Government (agencies sharing data with each other).</li>
<li><strong>G2E</strong> — Government to Employee (internal HR, payroll, workflow for civil servants).</li>
</ul>
<h3>The four levels of online public service (Vietnam)</h3>
<pre><code>Level 1 -> Information: procedure is described online
Level 2 -> Download: forms can be downloaded
Level 3 -> Submit online: fill &amp; send the application online
Level 4 -> Full: online payment + result returned electronically
</code></pre>
<p>Vietnam now promotes fully online public services (dịch vụ công trực tuyến toàn trình) — the equivalent of level 4 — where a citizen never has to visit an office.</p>
<div class="callout"><span class="badge">Example</span> Registering a motorbike, paying a traffic fine, or renewing a driving licence via <strong>dichvucong.gov.vn</strong> are G2C services climbing toward level 4.</div>`,
    `<span class="eyebrow">EGA301 · Chương 2 · Bài 2.1</span>
<h2>Mô hình dịch vụ công &amp; bốn mức</h2>
<h3>Ai làm việc với ai</h3>
<ul>
<li><strong>G2C</strong> — Chính phủ tới Người dân (căn cước, thuế, y tế, học bạ).</li>
<li><strong>G2B</strong> — Chính phủ tới Doanh nghiệp (đăng ký công ty, giấy phép, hải quan, hoá đơn điện tử).</li>
<li><strong>G2G</strong> — Chính phủ tới Chính phủ (các cơ quan chia sẻ dữ liệu cho nhau).</li>
<li><strong>G2E</strong> — Chính phủ tới Công chức (nhân sự nội bộ, lương, luồng công việc).</li>
</ul>
<h3>Bốn mức dịch vụ công trực tuyến (Việt Nam)</h3>
<pre><code>Mức 1 -> Thông tin: mô tả thủ tục trên mạng
Mức 2 -> Tải mẫu: tải được biểu mẫu về
Mức 3 -> Nộp online: điền &amp; gửi hồ sơ trực tuyến
Mức 4 -> Toàn trình: thanh toán online + trả kết quả điện tử
</code></pre>
<p>Việt Nam đang thúc đẩy dịch vụ công trực tuyến toàn trình — tương đương mức 4 — nơi người dân không cần đến cơ quan lần nào.</p>
<div class="callout"><span class="badge">Ví dụ</span> Đăng ký xe máy, nộp phạt giao thông, hay đổi giấy phép lái xe qua <strong>dichvucong.gov.vn</strong> là dịch vụ G2C đang tiến tới mức 4.</div>`,
  ]]);

const c2q = quiz('ega301-quiz-2', 'Quiz 2 — Service models|||Quiz 2 — Mô hình dịch vụ', [
  { id: 'q1', question: 'Đăng ký thành lập doanh nghiệp qua cổng nhà nước là loại quan hệ nào?|||Registering a company via a government portal is which relationship?', options: ['G2C', 'G2B', 'G2G', 'G2E'], correctIndex: 1, explanation: 'G2B: Chính phủ phục vụ Doanh nghiệp.' },
  { id: 'q2', question: 'Mức 4 (toàn trình) của dịch vụ công trực tuyến gồm điều gì?|||What defines level 4 (full) online public service?', options: ['Chỉ đăng thông tin thủ tục|||Only publishing procedure info', 'Chỉ cho tải biểu mẫu|||Only downloadable forms', 'Thanh toán trực tuyến VÀ trả kết quả điện tử|||Online payment AND electronic return of results', 'Chỉ nộp hồ sơ online|||Only online submission'], correctIndex: 2, explanation: 'Mức 4: nộp online + thanh toán + nhận kết quả điện tử, không cần đến cơ quan.' },
  { id: 'q3', question: 'Hai cơ quan nhà nước chia sẻ dữ liệu cho nhau là quan hệ?|||Two government agencies sharing data is which relationship?', options: ['G2C', 'G2B', 'G2G', 'B2B'], correctIndex: 2, explanation: 'G2G: Government to Government.' },
]);

const c3 = doc('ega301-3-1-infrastructure', '3.1 — Infrastructure &amp; platforms|||3.1 — Hạ tầng &amp; nền tảng CPĐT',
  'Cơ sở dữ liệu quốc gia (dân cư, doanh nghiệp, đất đai), định danh số, cổng DVC làm một cửa, nền tảng chia sẻ dữ liệu (NDXP/LGSP) theo mô hình once-only.',
  [[
    `<span class="eyebrow">EGA301 · Chapter 3 · Lesson 3.1</span>
<h2>Infrastructure &amp; platforms</h2>
<h3>The building blocks</h3>
<ul>
<li><strong>National databases</strong> — authoritative registers of people, businesses, land, vehicles. One trusted source per fact.</li>
<li><strong>Digital identity</strong> — a way to prove who you are online (see Chapter 4).</li>
<li><strong>Service portal</strong> — a single front door where all services live (dichvucong.gov.vn).</li>
<li><strong>Data-sharing platform</strong> — a backbone that lets agencies exchange data safely (Vietnam: NDXP; Estonia: X-Road).</li>
</ul>
<h3>The once-only principle</h3>
<p>A citizen should give each piece of information to the state <strong>only once</strong>. If the population database already holds your address, the tax office should read it — not ask you again. This needs databases plus a sharing backbone, not more forms.</p>
<pre><code>Old: citizen -> agency A (address)
     citizen -> agency B (address again)
Once-only: citizen -> A (address)
           B -> data platform -> A  (reads it)
</code></pre>
<div class="callout"><span class="badge">Estonia X-Road</span> Estonia connects hundreds of databases through <strong>X-Road</strong>, a secure data-exchange layer. Vietnam's equivalent backbone (NDXP/LGSP) plays the same role for once-only, joined-up services.</div>`,
    `<span class="eyebrow">EGA301 · Chương 3 · Bài 3.1</span>
<h2>Hạ tầng &amp; nền tảng</h2>
<h3>Các khối nền</h3>
<ul>
<li><strong>Cơ sở dữ liệu quốc gia</strong> — sổ đăng ký gốc về dân cư, doanh nghiệp, đất đai, phương tiện. Mỗi dữ kiện có một nguồn tin cậy.</li>
<li><strong>Định danh số</strong> — cách chứng minh bạn là ai trên mạng (xem Chương 4).</li>
<li><strong>Cổng dịch vụ</strong> — một cửa duy nhất chứa mọi dịch vụ (dichvucong.gov.vn).</li>
<li><strong>Nền tảng chia sẻ dữ liệu</strong> — trục cho các cơ quan trao đổi dữ liệu an toàn (VN: NDXP; Estonia: X-Road).</li>
</ul>
<h3>Nguyên tắc "một lần khai báo"</h3>
<p>Người dân chỉ cung cấp mỗi thông tin cho nhà nước <strong>một lần duy nhất</strong>. Nếu cơ sở dữ liệu dân cư đã có địa chỉ của bạn, cơ quan thuế nên đọc từ đó — chứ đừng hỏi lại. Điều này cần cơ sở dữ liệu cộng trục chia sẻ, không phải thêm biểu mẫu.</p>
<pre><code>Cũ: người dân -> cơ quan A (địa chỉ)
    người dân -> cơ quan B (lại địa chỉ)
Một lần khai: người dân -> A (địa chỉ)
              B -> nền tảng dữ liệu -> A  (đọc lại)
</code></pre>
<div class="callout"><span class="badge">X-Road của Estonia</span> Estonia nối hàng trăm cơ sở dữ liệu qua <strong>X-Road</strong>, một lớp trao đổi dữ liệu an toàn. Trục tương đương của Việt Nam (NDXP/LGSP) đóng đúng vai trò đó cho dịch vụ liên thông, một lần khai.</div>`,
  ]]);

const c3q = quiz('ega301-quiz-3', 'Quiz 3 — Infrastructure|||Quiz 3 — Hạ tầng', [
  { id: 'q1', question: 'Nguyên tắc "once-only" (một lần khai báo) nghĩa là?|||What does the once-only principle mean?', options: ['Chỉ được dùng dịch vụ một lần|||A service can be used only once', 'Người dân cung cấp mỗi thông tin cho nhà nước chỉ MỘT lần|||A citizen gives each piece of info to the state only once', 'Chỉ một cơ quan tồn tại|||Only one agency exists', 'Dữ liệu bị xoá sau một lần dùng|||Data is deleted after one use'], correctIndex: 1, explanation: 'Once-only: đã khai một nơi thì nơi khác đọc lại qua nền tảng chia sẻ.' },
  { id: 'q2', question: 'X-Road của Estonia là gì?|||What is Estonia X-Road?', options: ['Một cơ sở dữ liệu duy nhất|||A single database', 'Lớp trao đổi dữ liệu an toàn nối nhiều cơ sở dữ liệu|||A secure data-exchange layer linking many databases', 'Một loại thẻ căn cước|||A type of ID card', 'Một mạng đường bộ|||A road network'], correctIndex: 1, explanation: 'X-Road là trục trao đổi dữ liệu; VN tương đương NDXP/LGSP.' },
  { id: 'q3', question: 'Cổng Dịch vụ công Quốc gia đóng vai trò gì?|||What role does the National Public Service Portal play?', options: ['Trục chia sẻ dữ liệu nội bộ|||Internal data-sharing backbone', 'Một cửa duy nhất cho người dân tra và dùng dịch vụ|||A single front door for citizens to find and use services', 'Cơ sở dữ liệu dân cư|||The population database', 'Hệ thống lương công chức|||Civil-servant payroll'], correctIndex: 1, explanation: 'Cổng DVC là "một cửa" — front door tập trung mọi dịch vụ.' },
]);

const c4 = doc('ega301-4-1-digital-id', '4.1 — Digital identity &amp; authentication|||4.1 — Định danh &amp; xác thực số',
  'Định danh số (digital ID), VNeID, chữ ký số, eKYC; phân biệt định danh (bạn là ai) và xác thực (chứng minh điều đó); mức độ đảm bảo.',
  [[
    `<span class="eyebrow">EGA301 · Chapter 4 · Lesson 4.1</span>
<h2>Digital identity &amp; authentication</h2>
<h3>Two different questions</h3>
<ul>
<li><strong>Identification</strong> — <em>who are you?</em> (a unique identity: a citizen number, a VNeID account).</li>
<li><strong>Authentication</strong> — <em>prove it</em> (password, OTP, biometrics, a digital signature).</li>
</ul>
<h3>Key tools</h3>
<ul>
<li><strong>VNeID</strong> — Vietnam's national electronic identity app, tied to the population database, with assurance levels 1 and 2.</li>
<li><strong>Digital signature (chữ ký số)</strong> — cryptographically signs a document so it is legally valid and tamper-evident.</li>
<li><strong>eKYC</strong> — electronic Know Your Customer: verifying identity remotely with an ID document plus a face/liveness check, so a bank or service can onboard you without a branch visit.</li>
</ul>
<pre><code>Assurance:
 Level 1 -> self-declared, low trust
 Level 2 -> verified against the population DB + biometrics -> high trust
</code></pre>
<div class="callout"><span class="badge">Why identity is the keystone</span> Without trusted digital identity, online services cannot know who is on the other end — so no legally-binding transactions, no once-only data sharing. VNeID is the foundation Project 06 builds on.</div>`,
    `<span class="eyebrow">EGA301 · Chương 4 · Bài 4.1</span>
<h2>Định danh &amp; xác thực số</h2>
<h3>Hai câu hỏi khác nhau</h3>
<ul>
<li><strong>Định danh (identification)</strong> — <em>bạn là ai?</em> (một danh tính duy nhất: số định danh cá nhân, tài khoản VNeID).</li>
<li><strong>Xác thực (authentication)</strong> — <em>chứng minh điều đó</em> (mật khẩu, OTP, sinh trắc học, chữ ký số).</li>
</ul>
<h3>Công cụ chính</h3>
<ul>
<li><strong>VNeID</strong> — ứng dụng định danh điện tử quốc gia của Việt Nam, gắn với cơ sở dữ liệu dân cư, có mức 1 và mức 2.</li>
<li><strong>Chữ ký số</strong> — ký tài liệu bằng mật mã để có giá trị pháp lý và chống sửa đổi.</li>
<li><strong>eKYC</strong> — định danh khách hàng điện tử: xác minh từ xa bằng giấy tờ tuỳ thân cộng kiểm tra khuôn mặt/liveness, để ngân hàng hay dịch vụ mở tài khoản mà không cần tới quầy.</li>
</ul>
<pre><code>Mức đảm bảo:
 Mức 1 -> tự khai, tin cậy thấp
 Mức 2 -> đối chiếu CSDL dân cư + sinh trắc -> tin cậy cao
</code></pre>
<div class="callout"><span class="badge">Vì sao định danh là mấu chốt</span> Không có định danh số tin cậy thì dịch vụ trực tuyến không biết ai ở đầu bên kia — nên không có giao dịch pháp lý, không có chia sẻ dữ liệu một lần khai. VNeID là nền mà Đề án 06 xây lên.</div>`,
  ]]);

const c4q = quiz('ega301-quiz-4', 'Quiz 4 — Digital identity|||Quiz 4 — Định danh số', [
  { id: 'q1', question: 'Phân biệt "định danh" và "xác thực"?|||Difference between identification and authentication?', options: ['Giống nhau|||They are the same', 'Định danh = BẠN LÀ AI; xác thực = CHỨNG MINH điều đó|||Identification = who you are; authentication = proving it', 'Xác thực xảy ra trước định danh|||Authentication comes before identification', 'Định danh chỉ dùng mật khẩu|||Identification only uses passwords'], correctIndex: 1, explanation: 'Định danh nêu danh tính; xác thực chứng minh danh tính đó.' },
  { id: 'q2', question: 'eKYC là gì?|||What is eKYC?', options: ['Một loại chữ ký số|||A type of digital signature', 'Định danh khách hàng điện tử từ xa (giấy tờ + khuôn mặt/liveness)|||Remote electronic identity verification (document + face/liveness)', 'Một cơ sở dữ liệu quốc gia|||A national database', 'Một cổng dịch vụ công|||A public service portal'], correctIndex: 1, explanation: 'eKYC: xác minh danh tính từ xa, không cần tới quầy.' },
  { id: 'q3', question: 'Ở Việt Nam, ứng dụng định danh điện tử quốc gia gắn với CSDL dân cư là?|||Vietnam national electronic identity app tied to the population database?', options: ['VssID', 'VNeID', 'VNPT', 'Zalo'], correctIndex: 1, explanation: 'VNeID là nền định danh của Đề án 06.' },
]);

const c5 = doc('ega301-5-1-process-digitisation', '5.1 — Digitising administrative processes|||5.1 — Số hoá quy trình hành chính',
  'Tái thiết kế quy trình (BPR) trước khi số hoá; số hoá thủ tục hành chính; mô hình một cửa & một cửa điện tử liên thông.',
  [[
    `<span class="eyebrow">EGA301 · Chapter 5 · Lesson 5.1</span>
<h2>Digitising administrative processes</h2>
<h3>Redesign, do not just digitise</h3>
<p><strong>Business Process Reengineering (BPR)</strong> means rethinking a procedure before putting it online. Paving a cow-path — copying a 12-step paper flow into 12 online screens — keeps all the waste. The goal is fewer steps, fewer documents (because data is shared), and clear ownership.</p>
<h3>The one-stop shop</h3>
<ul>
<li><strong>One-stop shop (một cửa)</strong> — the citizen submits at one counter; agencies coordinate behind the scenes instead of sending the citizen from desk to desk.</li>
<li><strong>Electronic one-stop (một cửa điện tử)</strong> — the same idea online, with a case tracked by status and an SLA (deadline) for each step.</li>
<li><strong>Interconnected (liên thông)</strong> — several procedures chained: e.g. birth registration triggers health insurance and residence records automatically.</li>
</ul>
<pre><code>Before BPR: 12 steps, 5 documents, 3 offices, 15 days
After BPR:  4 steps, 1 form, 1 portal, 2 days
</code></pre>
<div class="callout"><span class="badge">Lesson</span> Technology amplifies the process it is given. A bad process digitised is a fast bad process — reengineer first, then build.</div>`,
    `<span class="eyebrow">EGA301 · Chương 5 · Bài 5.1</span>
<h2>Số hoá quy trình hành chính</h2>
<h3>Thiết kế lại, đừng chỉ số hoá</h3>
<p><strong>Tái thiết kế quy trình (BPR)</strong> là nghĩ lại một thủ tục trước khi đưa lên mạng. Bê nguyên luồng giấy 12 bước thành 12 màn hình online thì vẫn giữ nguyên lãng phí. Mục tiêu là ít bước hơn, ít giấy tờ hơn (vì dữ liệu được chia sẻ), và trách nhiệm rõ ràng.</p>
<h3>Mô hình một cửa</h3>
<ul>
<li><strong>Một cửa</strong> — người dân nộp ở một quầy; các cơ quan phối hợp phía sau thay vì đẩy người dân chạy hết bàn này sang bàn khác.</li>
<li><strong>Một cửa điện tử</strong> — vẫn ý đó nhưng trực tuyến, hồ sơ được theo dõi theo trạng thái và có thời hạn (SLA) cho từng bước.</li>
<li><strong>Liên thông</strong> — nhiều thủ tục nối nhau: ví dụ đăng ký khai sinh tự động kéo theo bảo hiểm y tế và hộ tịch.</li>
</ul>
<pre><code>Trước BPR: 12 bước, 5 giấy tờ, 3 cơ quan, 15 ngày
Sau BPR:   4 bước, 1 biểu mẫu, 1 cổng, 2 ngày
</code></pre>
<div class="callout"><span class="badge">Bài học</span> Công nghệ khuếch đại quy trình mà nó nhận. Số hoá một quy trình tồi thì được một quy trình tồi nhưng nhanh — hãy tái thiết kế trước, rồi mới xây.</div>`,
  ]]);

const c5q = quiz('ega301-quiz-5', 'Quiz 5 — Process digitisation|||Quiz 5 — Số hoá quy trình', [
  { id: 'q1', question: 'Vì sao nên làm BPR TRƯỚC khi số hoá một thủ tục?|||Why do BPR before digitising a procedure?', options: ['Để tốn nhiều bước hơn|||To add more steps', 'Vì số hoá một quy trình tồi chỉ tạo ra quy trình tồi nhưng nhanh|||Because digitising a bad process just makes it a fast bad process', 'Vì công nghệ luôn tự sửa quy trình|||Because tech always fixes the process itself', 'Không cần lý do|||No reason needed'], correctIndex: 1, explanation: 'Tái thiết kế trước để bỏ lãng phí, rồi mới xây hệ thống.' },
  { id: 'q2', question: 'Mô hình "một cửa" (one-stop shop) mang lại điều gì cho người dân?|||What does a one-stop shop give the citizen?', options: ['Phải đi qua nhiều cơ quan hơn|||Visiting more agencies', 'Nộp tại một điểm; cơ quan phối hợp phía sau|||Submit at one point; agencies coordinate behind the scenes', 'Không có thời hạn xử lý|||No processing deadline', 'Chỉ nhận hồ sơ giấy|||Only paper accepted'], correctIndex: 1, explanation: 'Một cửa: một điểm tiếp nhận, phối hợp nội bộ thay vì đẩy người dân đi.' },
  { id: 'q3', question: 'Thủ tục "liên thông" (interconnected) nghĩa là?|||What does an interconnected procedure mean?', options: ['Một thủ tục duy nhất, không liên quan gì|||A single unrelated procedure', 'Nhiều thủ tục nối nhau tự động (vd khai sinh kéo theo BHYT, hộ tịch)|||Several chained procedures triggering automatically (e.g. birth registration triggers insurance, residence)', 'Chỉ áp dụng cho doanh nghiệp|||Only for business', 'Xoá dữ liệu giữa các bước|||Deleting data between steps'], correctIndex: 1, explanation: 'Liên thông: một thủ tục kích hoạt các thủ tục liên quan.' },
]);

const c6 = doc('ega301-6-1-open-data', '6.1 — Open data &amp; transparency|||6.1 — Dữ liệu mở &amp; minh bạch',
  'Dữ liệu mở (open data), chính phủ mở (open government), sự tham gia của người dân (e-participation): thông tin, tham vấn, đồng quyết định.',
  [[
    `<span class="eyebrow">EGA301 · Chapter 6 · Lesson 6.1</span>
<h2>Open data &amp; transparency</h2>
<h3>Open data</h3>
<p><strong>Open data</strong> is public-sector data published so anyone can access, reuse and redistribute it — free, machine-readable, and openly licensed. Budgets, transport, weather, business registers. It fuels apps, research, journalism and accountability.</p>
<h3>Open government</h3>
<p><strong>Open government</strong> is the wider principle: <em>transparency</em> (citizens can see what the state does), <em>participation</em> (they can take part) and <em>accountability</em> (officials answer for decisions).</p>
<h3>E-participation — a ladder</h3>
<pre><code>1. E-information   -> government publishes; citizens read
2. E-consultation  -> government asks; citizens give feedback
3. E-decision      -> citizens co-decide (e-petitions, participatory budgeting)
</code></pre>
<div class="callout"><span class="badge">Example</span> Publishing draft laws online for public comment is e-consultation; an online petition portal that forces a formal response is e-decision. The UN Survey scores an <strong>E-Participation Index</strong> alongside EGDI.</div>`,
    `<span class="eyebrow">EGA301 · Chương 6 · Bài 6.1</span>
<h2>Dữ liệu mở &amp; minh bạch</h2>
<h3>Dữ liệu mở</h3>
<p><strong>Dữ liệu mở</strong> là dữ liệu khu vực công được công bố để ai cũng truy cập, tái sử dụng và phân phối lại — miễn phí, máy đọc được, giấy phép mở. Ngân sách, giao thông, thời tiết, sổ đăng ký doanh nghiệp. Nó nuôi ứng dụng, nghiên cứu, báo chí và trách nhiệm giải trình.</p>
<h3>Chính phủ mở</h3>
<p><strong>Chính phủ mở</strong> là nguyên tắc rộng hơn: <em>minh bạch</em> (người dân thấy nhà nước làm gì), <em>tham gia</em> (người dân dự phần) và <em>trách nhiệm giải trình</em> (quan chức chịu trách nhiệm cho quyết định).</p>
<h3>Sự tham gia điện tử — một chiếc thang</h3>
<pre><code>1. Cung cấp thông tin -> nhà nước công bố; dân đọc
2. Tham vấn           -> nhà nước hỏi; dân góp ý
3. Đồng quyết định    -> dân cùng quyết (kiến nghị điện tử, ngân sách có sự tham gia)
</code></pre>
<div class="callout"><span class="badge">Ví dụ</span> Đăng dự thảo luật để lấy ý kiến là tham vấn; một cổng kiến nghị buộc phải phản hồi chính thức là đồng quyết định. UN Survey chấm riêng một <strong>Chỉ số E-Participation</strong> bên cạnh EGDI.</div>`,
  ]]);

const c6q = quiz('ega301-quiz-6', 'Quiz 6 — Open data|||Quiz 6 — Dữ liệu mở', [
  { id: 'q1', question: 'Đặc điểm cốt lõi của "dữ liệu mở" (open data)?|||Core traits of open data?', options: ['Bí mật, chỉ cơ quan xem|||Secret, agency-only', 'Miễn phí, máy đọc được, giấy phép mở để ai cũng tái sử dụng|||Free, machine-readable, openly licensed for anyone to reuse', 'Chỉ ở dạng giấy|||Paper only', 'Phải trả phí bản quyền|||Requires royalty payment'], correctIndex: 1, explanation: 'Open data: mở, máy đọc, tái sử dụng tự do.' },
  { id: 'q2', question: 'Ba trụ cột của "chính phủ mở" là?|||The three pillars of open government?', options: ['Tốc độ, giá rẻ, tiện lợi|||Speed, cheapness, convenience', 'Minh bạch, tham gia, trách nhiệm giải trình|||Transparency, participation, accountability', 'Phần cứng, phần mềm, mạng|||Hardware, software, network', 'Thuế, phí, lệ phí|||Tax, fees, charges'], correctIndex: 1, explanation: 'Open government = minh bạch + tham gia + trách nhiệm giải trình.' },
  { id: 'q3', question: 'Đăng dự thảo luật để dân góp ý nằm ở mức nào của e-participation?|||Publishing a draft law for public feedback is which e-participation level?', options: ['Cung cấp thông tin (e-information)|||E-information', 'Tham vấn (e-consultation)|||E-consultation', 'Đồng quyết định (e-decision)|||E-decision', 'Không thuộc mức nào|||None'], correctIndex: 1, explanation: 'Hỏi ý kiến người dân = tham vấn (e-consultation).' },
]);

const c7 = doc('ega301-7-1-security-law-privacy', '7.1 — Security, law &amp; privacy|||7.1 — An ninh, pháp lý &amp; quyền riêng tư',
  'An toàn thông tin (CIA), khung pháp lý CPĐT, bảo vệ dữ liệu cá nhân (Nghị định 13/2023 của VN): đồng ý, quyền chủ thể, dữ liệu nhạy cảm.',
  [[
    `<span class="eyebrow">EGA301 · Chapter 7 · Lesson 7.1</span>
<h2>Security, law &amp; privacy</h2>
<h3>Information security (the CIA triad)</h3>
<ul>
<li><strong>Confidentiality</strong> — only authorised people see the data.</li>
<li><strong>Integrity</strong> — data is not altered without trace.</li>
<li><strong>Availability</strong> — services stay up when citizens need them.</li>
</ul>
<h3>Why the state is a bigger target</h3>
<p>Government holds the most sensitive data about everyone — health, criminal, tax, biometric. A breach is not a lost password; it can expose a whole population. So e-government needs strong access control, encryption, audit logs and incident response.</p>
<h3>Personal data protection in Vietnam</h3>
<p>Vietnam's <strong>Decree 13/2023/ND-CP (Nghị định 13)</strong> is the first comprehensive personal-data-protection rule. Core ideas:</p>
<ul>
<li><strong>Consent</strong> — data is processed with the person's informed consent, for a stated purpose.</li>
<li><strong>Data-subject rights</strong> — the right to know, access, correct, delete and object.</li>
<li><strong>Sensitive data</strong> — health, biometrics, political views get stricter protection.</li>
</ul>
<div class="callout"><span class="badge">Tension</span> E-government wants to <em>share</em> data for once-only services; privacy law wants to <em>limit</em> sharing. Good design reconciles them: share for a lawful purpose, with consent, logged and minimised.</div>`,
    `<span class="eyebrow">EGA301 · Chương 7 · Bài 7.1</span>
<h2>An ninh, pháp lý &amp; quyền riêng tư</h2>
<h3>An toàn thông tin (bộ ba CIA)</h3>
<ul>
<li><strong>Bảo mật (Confidentiality)</strong> — chỉ người được phép mới thấy dữ liệu.</li>
<li><strong>Toàn vẹn (Integrity)</strong> — dữ liệu không bị sửa mà không để lại dấu vết.</li>
<li><strong>Sẵn sàng (Availability)</strong> — dịch vụ luôn hoạt động khi người dân cần.</li>
</ul>
<h3>Vì sao nhà nước là mục tiêu lớn hơn</h3>
<p>Nhà nước giữ dữ liệu nhạy cảm nhất về mọi người — y tế, hình sự, thuế, sinh trắc. Một vụ lộ không chỉ là mất mật khẩu; nó có thể phơi bày cả một dân số. Vì thế CPĐT cần kiểm soát truy cập chặt, mã hoá, nhật ký kiểm toán và ứng phó sự cố.</p>
<h3>Bảo vệ dữ liệu cá nhân ở Việt Nam</h3>
<p><strong>Nghị định 13/2023/NĐ-CP</strong> là quy định toàn diện đầu tiên của Việt Nam về bảo vệ dữ liệu cá nhân. Ý chính:</p>
<ul>
<li><strong>Đồng ý (consent)</strong> — xử lý dữ liệu khi có sự đồng ý được thông báo, cho một mục đích rõ ràng.</li>
<li><strong>Quyền của chủ thể dữ liệu</strong> — quyền được biết, truy cập, chỉnh sửa, xoá và phản đối.</li>
<li><strong>Dữ liệu nhạy cảm</strong> — sức khoẻ, sinh trắc, quan điểm chính trị được bảo vệ chặt hơn.</li>
</ul>
<div class="callout"><span class="badge">Mâu thuẫn</span> CPĐT muốn <em>chia sẻ</em> dữ liệu để phục vụ một lần khai; luật riêng tư muốn <em>giới hạn</em> chia sẻ. Thiết kế tốt dung hoà: chia sẻ vì mục đích hợp pháp, có đồng ý, ghi log và tối thiểu hoá.</div>`,
  ]]);

const c7q = quiz('ega301-quiz-7', 'Quiz 7 — Security &amp; privacy|||Quiz 7 — An ninh &amp; riêng tư', [
  { id: 'q1', question: 'Bộ ba CIA trong an toàn thông tin gồm?|||The CIA triad in information security?', options: ['Chi phí, tốc độ, giao diện|||Cost, speed, interface', 'Bảo mật, Toàn vẹn, Sẵn sàng|||Confidentiality, Integrity, Availability', 'Giấy phép, luật, hợp đồng|||Licence, law, contract', 'Camera, còi, khoá|||Camera, alarm, lock'], correctIndex: 1, explanation: 'CIA = Confidentiality, Integrity, Availability.' },
  { id: 'q2', question: 'Nghị định 13/2023 (NĐ13) của Việt Nam điều chỉnh về?|||Vietnam Decree 13/2023 governs what?', options: ['Hoá đơn điện tử|||E-invoicing', 'Bảo vệ dữ liệu cá nhân (đồng ý, quyền chủ thể, dữ liệu nhạy cảm)|||Personal data protection (consent, data-subject rights, sensitive data)', 'Thuế thu nhập|||Income tax', 'Đăng ký doanh nghiệp|||Company registration'], correctIndex: 1, explanation: 'NĐ13 là quy định toàn diện đầu tiên về bảo vệ dữ liệu cá nhân.' },
  { id: 'q3', question: 'Vì sao dữ liệu chính phủ là mục tiêu nhạy cảm hơn?|||Why is government data a more sensitive target?', options: ['Vì nó ít dữ liệu|||Because it holds little data', 'Vì nó chứa dữ liệu nhạy cảm nhất về mọi người (y tế, sinh trắc, hình sự)|||Because it holds the most sensitive data about everyone (health, biometric, criminal)', 'Vì nó không được mã hoá bao giờ|||Because it is never encrypted', 'Vì nó luôn công khai|||Because it is always public'], correctIndex: 1, explanation: 'Một vụ lộ dữ liệu nhà nước có thể phơi bày cả một dân số.' },
]);

const c8 = doc('ega301-8-1-digital-government-trends', '8.1 — Digital government &amp; trends|||8.1 — Chính phủ số &amp; xu hướng',
  'Từ e-government sang digital government; AI trong hành chính, đô thị thông minh, Đề án 06 của VN; các thách thức (khoảng cách số, thay đổi tổ chức, tin cậy).',
  [[
    `<span class="eyebrow">EGA301 · Chapter 8 · Lesson 8.1</span>
<h2>Digital government &amp; trends</h2>
<h3>From e-government to digital government</h3>
<p>The frontier is not putting forms online — it is redesigning the state to be <strong>digital by design</strong>, <strong>data-driven</strong> and <strong>platform-based</strong>. Services become <em>proactive</em>: instead of you applying for a benefit, the state offers it because the data already shows you qualify.</p>
<h3>Trends</h3>
<ul>
<li><strong>AI in administration</strong> — chatbots for citizens, triage of applications, fraud detection. Powerful, but needs transparency and human oversight for high-stakes decisions.</li>
<li><strong>Smart city</strong> — sensors and data for traffic, energy, waste and safety (e.g. Singapore Smart Nation).</li>
<li><strong>Vietnam Project 06 (Đề án 06)</strong> — builds population data, VNeID and 25 essential public services into one integrated digital-government foundation.</li>
</ul>
<h3>Challenges</h3>
<pre><code>Digital divide  -> not everyone has skills/access
Change &amp; culture -> reorganising agencies is harder than the tech
Trust &amp; privacy -> citizens must trust how data is used
Interoperability -> legacy systems that do not talk to each other
</code></pre>
<div class="callout"><span class="badge">Takeaway</span> Digital government is 20% technology and 80% organisation, law and trust. The winning countries fix the process and the institutions, not just the website.</div>`,
    `<span class="eyebrow">EGA301 · Chương 8 · Bài 8.1</span>
<h2>Chính phủ số &amp; xu hướng</h2>
<h3>Từ chính phủ điện tử sang chính phủ số</h3>
<p>Ranh giới mới không phải là đưa biểu mẫu lên mạng — mà là thiết kế lại nhà nước để <strong>số hoá từ gốc</strong>, <strong>dựa trên dữ liệu</strong> và <strong>trên nền tảng</strong>. Dịch vụ trở nên <em>chủ động</em>: thay vì bạn đi xin trợ cấp, nhà nước tự đề nghị vì dữ liệu đã cho thấy bạn đủ điều kiện.</p>
<h3>Xu hướng</h3>
<ul>
<li><strong>AI trong hành chính</strong> — trợ lý ảo cho người dân, phân loại hồ sơ, phát hiện gian lận. Mạnh, nhưng cần minh bạch và giám sát của con người cho quyết định quan trọng.</li>
<li><strong>Đô thị thông minh</strong> — cảm biến và dữ liệu cho giao thông, năng lượng, rác thải, an toàn (vd Singapore Smart Nation).</li>
<li><strong>Đề án 06 của Việt Nam</strong> — xây dữ liệu dân cư, VNeID và 25 dịch vụ công thiết yếu thành một nền chính phủ số tích hợp.</li>
</ul>
<h3>Thách thức</h3>
<pre><code>Khoảng cách số  -> không phải ai cũng có kỹ năng/truy cập
Đổi mới &amp; văn hoá -> tổ chức lại cơ quan khó hơn công nghệ
Tin cậy &amp; riêng tư -> người dân phải tin cách dùng dữ liệu
Liên thông      -> hệ thống cũ không nói chuyện được với nhau
</code></pre>
<div class="callout"><span class="badge">Điều đọng lại</span> Chính phủ số là 20% công nghệ và 80% tổ chức, pháp lý và niềm tin. Nước thành công sửa quy trình và thể chế, không chỉ sửa trang web.</div>`,
  ]]);

const c8q = quiz('ega301-quiz-8', 'Quiz 8 — Digital government|||Quiz 8 — Chính phủ số', [
  { id: 'q1', question: 'Dịch vụ "chủ động" (proactive) của chính phủ số nghĩa là?|||What does a proactive digital-government service mean?', options: ['Người dân phải nộp đơn nhiều lần|||The citizen applies many times', 'Nhà nước tự đề nghị dịch vụ vì dữ liệu cho thấy người dân đủ điều kiện|||The state offers a service because data shows the citizen qualifies', 'Dịch vụ bị tắt vào ban đêm|||The service is off at night', 'Chỉ có ở dạng giấy|||Paper only'], correctIndex: 1, explanation: 'Chủ động: nhà nước đề nghị trước dựa trên dữ liệu, không đợi dân xin.' },
  { id: 'q2', question: 'Đề án 06 của Việt Nam tập trung xây nền gì?|||What foundation does Vietnam Project 06 build?', options: ['Chỉ hệ thống thuế|||Only the tax system', 'Dữ liệu dân cư, VNeID và các dịch vụ công thiết yếu tích hợp|||Population data, VNeID and integrated essential public services', 'Chỉ mạng viễn thông|||Only telecom networks', 'Chỉ camera giao thông|||Only traffic cameras'], correctIndex: 1, explanation: 'Đề án 06: dữ liệu dân cư + định danh VNeID + 25 dịch vụ công thiết yếu.' },
  { id: 'q3', question: 'Vì sao nói chính phủ số "20% công nghệ, 80% tổ chức"?|||Why is digital government called 20% technology, 80% organisation?', options: ['Vì công nghệ không quan trọng|||Because technology does not matter', 'Vì thách thức lớn nhất là tổ chức, pháp lý, văn hoá và niềm tin, không phải phần mềm|||Because the hardest part is organisation, law, culture and trust, not the software', 'Vì phần cứng chiếm 80% ngân sách|||Because hardware is 80% of the budget', 'Vì chỉ cần một trang web|||Because only a website is needed'], correctIndex: 1, explanation: 'Rào cản lớn nhất là thay đổi tổ chức, thể chế và niềm tin.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'EGA301',
    slug: 'ega301-e-government-and-public-administration',
    title: 'E-Government and Public Administration',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EGA301.webp',
    shortDescription: 'E-government & public administration — maturity models, online public services (G2C/G2B/G2G, levels 1-4), national databases, digital ID (VNeID), process digitisation, open data, data privacy & digital government. Bilingual, real VN & world cases.|||Chính phủ điện tử & hành chính công — mức trưởng thành, dịch vụ công trực tuyến (G2C/G2B/G2G, mức 1-4), CSDL quốc gia, định danh số (VNeID), số hoá thủ tục, dữ liệu mở, riêng tư & chính phủ số. Song ngữ, ví dụ VN & quốc tế.',
    description: 'Môn <strong>EGA301 — E-Government and Public Administration</strong> (ngành Chuyển đổi số, kỳ 5) giúp hiểu <strong>cách nhà nước cung cấp dịch vụ và quản trị trong thời đại số</strong>. Từ <strong>khái niệm &amp; mức trưởng thành</strong> (e-government, e-governance, digital government, EGDI) → <strong>mô hình dịch vụ</strong> (G2C/G2B/G2G, mức 1-4) → <strong>hạ tầng &amp; định danh số</strong> (CSDL quốc gia, VNeID, chia sẻ dữ liệu) → <strong>số hoá quy trình</strong> (BPR, một cửa điện tử) → <strong>dữ liệu mở &amp; minh bạch</strong> → <strong>an ninh, pháp lý &amp; riêng tư</strong> (NĐ13) → <strong>chính phủ số &amp; xu hướng</strong> (AI, đô thị thông minh, Đề án 06). Bám chuẩn quốc tế (UN, OECD, World Bank) và thực tiễn Việt Nam, song ngữ, quiz mỗi chương.',
    whatYouLearn: 'Phân biệt e-government / e-governance / digital government &amp; mức trưởng thành (EGDI); mô hình G2C/G2B/G2G/G2E và bốn mức dịch vụ công trực tuyến; cơ sở dữ liệu quốc gia, cổng DVC, nền tảng chia sẻ dữ liệu &amp; nguyên tắc một lần khai; định danh số, VNeID, chữ ký số, eKYC; tái thiết kế quy trình (BPR) &amp; một cửa điện tử; dữ liệu mở, chính phủ mở &amp; e-participation; an toàn thông tin (CIA) &amp; bảo vệ dữ liệu cá nhân (NĐ13); AI trong hành chính, đô thị thông minh &amp; Đề án 06.',
    requirements: 'Không cần tiên quyết kỹ thuật. Nên có tài khoản để xem thử Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn) và tham khảo UN E-Government Survey.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Khung chuẩn quốc tế (UN, OECD, World Bank), nền tảng VN, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'CPĐT làm gì, vì sao quan trọng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — CPĐT là gì|||Chapter 1 — What is e-government', description: 'e-gov/e-governance/digital gov, mức trưởng thành, EGDI.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mô hình dịch vụ|||Chapter 2 — Service models', description: 'G2C/G2B/G2G/G2E, bốn mức dịch vụ trực tuyến.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Hạ tầng & nền tảng|||Chapter 3 — Infrastructure', description: 'CSDL quốc gia, cổng DVC, chia sẻ dữ liệu, once-only.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Định danh & xác thực số|||Chapter 4 — Digital identity', description: 'Digital ID, VNeID, chữ ký số, eKYC.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Số hoá quy trình|||Chapter 5 — Process digitisation', description: 'BPR, số hoá thủ tục, một cửa điện tử.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Dữ liệu mở & minh bạch|||Chapter 6 — Open data', description: 'Open data, open government, e-participation.', lessons: [c6, c6q] },
    { title: 'Chương 7 — An ninh, pháp lý & riêng tư|||Chapter 7 — Security & privacy', description: 'CIA, khung pháp lý, bảo vệ dữ liệu cá nhân (NĐ13).', lessons: [c7, c7q] },
    { title: 'Chương 8 — Chính phủ số & xu hướng|||Chapter 8 — Digital government', description: 'AI, đô thị thông minh, Đề án 06, thách thức.', lessons: [c8, c8q] },
  ],
};
