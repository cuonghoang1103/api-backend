/**
 * LOD213 — Housekeeping Operations. Khối Quản trị Kinh doanh (BBA), Kỳ 2.
 * Giáo trình tham khảo (trích dẫn, KHÔNG upload PDF): "Hotel Housekeeping
 * Operations and Management" (Raghubalan), "Managing Housekeeping
 * Operations" (AHLEI), tiêu chuẩn VTOS Việt Nam. Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('lod213-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (Raghubalan, AHLEI), tiêu chuẩn VTOS Việt Nam, tài liệu chính thức miễn phí, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">LOD213 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn hotel housekeeping operations — department role, room and public-area cleaning, laundry, linen and cost control — in one place. The full official slides live on <strong>FLM</strong>; below are the reference textbooks and free resources this course draws on.</p>
<h3>📘 Reference textbooks</h3>
<ul>
<li><em>Hotel Housekeeping Operations and Management</em> — K. Raghubalan &amp; Smritee Raghubalan (Oxford University Press). The standard Indian-subcontinent hospitality textbook for housekeeping; this course follows its chapter logic (organization → room care → public area → linen → safety).</li>
<li><em>Managing Housekeeping Operations</em> — American Hotel &amp; Lodging Educational Institute (AHLEI). North-American industry-certification textbook; strong on staffing, inventory control and sustainability.</li>
<li><strong>VTOS (Vietnam Tourism Occupational Skills Standards)</strong> — Housekeeping occupational standard, developed under the EU-funded ESRT project and adopted by the Vietnam National Administration of Tourism. Sets the room-cleaning sequence, linen-fold and safety checklists used by most Vietnamese hotels.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://vtcb.gov.vn" target="_blank" rel="noopener">VTCB — Vietnam Tourism Certification Board</a> — VTOS standards and occupational skill certificates.</li>
<li><a href="https://www.ahlei.org" target="_blank" rel="noopener">AHLEI — American Hotel &amp; Lodging Educational Institute</a> — housekeeping certification syllabus.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=hotel+housekeeping+training" target="_blank" rel="noopener">"Hotel housekeeping training"</a> — search term covering widely used bed-making, guest-room and public-area training clips from hospitality schools.</li>
<li><a href="https://www.youtube.com/results?search_query=housekeeping+room+inspection+checklist" target="_blank" rel="noopener">"Housekeeping room inspection checklist"</a> — supervisor inspection walk-throughs.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — housekeeping's role, department structure, key job titles (room attendant, supervisor, floor/executive housekeeper).</li>
<li><strong>Core skill</strong> — the guest-room cleaning sequence and bed-making, memorized as a checklist, then public area and laundry.</li>
<li><strong>Control layer</strong> — quality inspection scoring, linen par stock, chemical safety, cost per occupied room.</li>
<li><strong>Job-ready</strong> — coordinate with Front Office/F&amp;B/Engineering, and know current PMS-linked housekeeping apps and green-hotel practice.</li>
</ol></div>`,
    `<span class="eyebrow">LOD213 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học nghiệp vụ buồng phòng khách sạn — vai trò bộ phận, dọn phòng khách và khu công cộng, giặt là, quản lý đồ vải và chi phí — gom về một chỗ. Slide chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là các giáo trình tham khảo và nguồn miễn phí môn này bám theo.</p>
<h3>📘 Giáo trình tham khảo</h3>
<ul>
<li><em>Hotel Housekeeping Operations and Management</em> — K. Raghubalan &amp; Smritee Raghubalan (Oxford University Press). Giáo trình chuẩn về buồng phòng được dùng rộng rãi; môn này bám theo mạch chương của sách (cơ cấu tổ chức → chăm sóc phòng → khu công cộng → đồ vải → an toàn).</li>
<li><em>Managing Housekeeping Operations</em> — American Hotel &amp; Lodging Educational Institute (AHLEI). Giáo trình chứng chỉ ngành khách sạn Bắc Mỹ; mạnh về nhân sự, kiểm soát kho và phát triển bền vững.</li>
<li><strong>VTOS (Tiêu chuẩn kỹ năng nghề du lịch Việt Nam)</strong> — Bộ tiêu chuẩn nghề Buồng phòng, xây dựng trong dự án ESRT do EU tài trợ, được Tổng cục Du lịch Việt Nam áp dụng. Quy định quy trình dọn phòng, cách gấp đồ vải và checklist an toàn dùng ở đa số khách sạn Việt Nam.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://vtcb.gov.vn" target="_blank" rel="noopener">VTCB — Hội đồng cấp chứng chỉ nghiệp vụ du lịch Việt Nam</a> — tiêu chuẩn VTOS và chứng chỉ kỹ năng nghề.</li>
<li><a href="https://www.ahlei.org" target="_blank" rel="noopener">AHLEI — American Hotel &amp; Lodging Educational Institute</a> — chương trình chứng chỉ nghiệp vụ buồng phòng.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=hotel+housekeeping+training" target="_blank" rel="noopener">"Hotel housekeeping training"</a> — từ khoá gom các clip đào tạo làm giường, dọn phòng, khu công cộng từ các trường nghiệp vụ khách sạn.</li>
<li><a href="https://www.youtube.com/results?search_query=housekeeping+room+inspection+checklist" target="_blank" rel="noopener">"Housekeeping room inspection checklist"</a> — quy trình kiểm phòng của giám sát.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — vai trò bộ phận buồng, cơ cấu tổ chức, các vị trí chính (nhân viên buồng, giám sát, trưởng bộ phận buồng).</li>
<li><strong>Kỹ năng lõi</strong> — quy trình dọn phòng khách và làm giường, học thành checklist, rồi tới khu công cộng và giặt là.</li>
<li><strong>Lớp kiểm soát</strong> — thang điểm kiểm tra chất lượng, định mức đồ vải (par stock), an toàn hoá chất, chi phí trên mỗi phòng có khách.</li>
<li><strong>Sẵn sàng đi làm</strong> — phối hợp với Lễ tân/F&amp;B/Kỹ thuật, và biết các ứng dụng buồng phòng liên kết PMS cùng xu hướng khách sạn xanh hiện nay.</li>
</ol></div>`,
  ]]);

const intro = doc('lod213-0-1-overview', 'Course overview: Housekeeping Operations|||Tổng quan: Nghiệp vụ buồng phòng',
  'Vai trò bộ phận buồng phòng trong khách sạn; vì sao nó là "lời hứa hữu hình" của khách sạn; lộ trình 8 chương từ tổ chức đến công nghệ & xanh.',
  [[
    `<span class="eyebrow">LOD213 · Lesson 0.1 · Overview</span>
<h2>Housekeeping Operations</h2>
<p class="lead">Housekeeping is the department that turns a building into a hotel guests trust. This course follows <strong>Raghubalan's</strong> and <strong>AHLEI's</strong> housekeeping textbooks and the <strong>VTOS Vietnam</strong> occupational standard to build both the operational skill (how a room actually gets cleaned) and the management skill (how the department is organized, staffed, controlled and costed).</p>
<h3>Why housekeeping matters</h3>
<ul>
<li><strong>Largest labor cost, largest revenue-protecting function</strong> — a clean, well-maintained room is the core product a guest is paying for; a single dirty-room complaint can undo a hotel's entire marketing spend.</li>
<li><strong>Biggest department by headcount</strong> in most hotels — room attendants, public-area attendants, linen/laundry staff, supervisors.</li>
<li><strong>The department every other department depends on</strong> — Front Office cannot sell a room Housekeeping hasn't released as "clean and inspected."</li>
</ul>
<h3>Roadmap — 8 chapters</h3>
<p>Department role &amp; scope (Ch.1) → organization &amp; staffing (Ch.2) → guest-room cleaning procedure (Ch.3) → public area &amp; laundry (Ch.4) → equipment, chemicals &amp; safety (Ch.5) → quality control &amp; room standards (Ch.6) → linen, inventory &amp; cost control (Ch.7) → cross-department coordination, technology &amp; green trends (Ch.8).</p>
<div class="callout"><span class="badge">One idea to hold onto</span> Housekeeping does not just clean — it <strong>releases inventory</strong>. A hotel's entire revenue engine (Front Office selling rooms) is gated on how fast and how well Housekeeping turns a checked-out room into a sellable one.</div>`,
    `<span class="eyebrow">LOD213 · Bài 0.1 · Tổng quan</span>
<h2>Nghiệp vụ buồng phòng</h2>
<p class="lead">Bộ phận buồng phòng là bộ phận biến một toà nhà thành một khách sạn mà khách tin tưởng. Môn này bám theo giáo trình buồng phòng của <strong>Raghubalan</strong> và <strong>AHLEI</strong>, cùng tiêu chuẩn nghề <strong>VTOS Việt Nam</strong>, để xây cả kỹ năng vận hành (phòng được dọn thế nào) và kỹ năng quản lý (bộ phận được tổ chức, bố trí nhân sự, kiểm soát và tính chi phí thế nào).</p>
<h3>Vì sao buồng phòng quan trọng</h3>
<ul>
<li><strong>Chi phí nhân công lớn nhất, chức năng bảo vệ doanh thu lớn nhất</strong> — một phòng sạch, được chăm sóc tốt chính là sản phẩm cốt lõi khách đang trả tiền; một lời phàn nàn về phòng bẩn có thể xoá sạch cả chi phí marketing của khách sạn.</li>
<li><strong>Bộ phận đông nhân sự nhất</strong> ở hầu hết khách sạn — nhân viên buồng, nhân viên khu công cộng, nhân viên đồ vải/giặt là, giám sát.</li>
<li><strong>Bộ phận mọi bộ phận khác phụ thuộc vào</strong> — Lễ tân không thể bán một phòng mà Buồng phòng chưa "trả" ở trạng thái "sạch và đã kiểm".</li>
</ul>
<h3>Lộ trình — 8 chương</h3>
<p>Vai trò &amp; phạm vi bộ phận (Ch.1) → cơ cấu tổ chức &amp; nhân sự (Ch.2) → quy trình dọn phòng khách (Ch.3) → khu công cộng &amp; giặt là (Ch.4) → trang thiết bị, hoá chất &amp; an toàn (Ch.5) → kiểm soát chất lượng &amp; tiêu chuẩn phòng (Ch.6) → đồ vải, kho &amp; chi phí (Ch.7) → phối hợp liên bộ phận, công nghệ &amp; xu hướng xanh (Ch.8).</p>
<div class="callout"><span class="badge">Một ý cần nhớ</span> Buồng phòng không chỉ dọn dẹp — nó <strong>giải phóng hàng hoá bán được</strong>. Cả bộ máy doanh thu của khách sạn (Lễ tân bán phòng) phụ thuộc vào việc Buồng phòng biến phòng vừa trả thành phòng bán được nhanh và tốt đến đâu.</div>`,
  ]]);

const c1 = doc('lod213-1-1-role-scope', '1.1 — Housekeeping\'s role & scope|||1.1 — Vai trò & phạm vi bộ phận buồng phòng',
  'Định nghĩa housekeeping; phạm vi (phòng khách, khu công cộng, đồ vải/giặt là, hoa/cây cảnh); mục tiêu vệ sinh-an toàn-thẩm mỹ-hiệu quả chi phí.',
  [[
    `<span class="eyebrow">LOD213 · Chapter 1 · Lesson 1.1</span>
<h2>Housekeeping's role &amp; scope</h2>
<h3>Definition</h3>
<p><strong>Housekeeping</strong> is the hotel department responsible for cleanliness, maintenance-alertness, aesthetic upkeep and orderliness of guest rooms, public areas and back-of-house areas, plus control of linen and guest supplies.</p>
<h3>Scope — four working areas</h3>
<ul>
<li><strong>Guest rooms</strong> — cleaning, bed-making, restocking amenities, turndown service.</li>
<li><strong>Public areas</strong> — lobby, corridors, elevators, restrooms, back-of-house corridors and staff areas.</li>
<li><strong>Linen &amp; laundry</strong> — bed linen, towels, F&amp;B linen, uniforms; in-house or outsourced laundry.</li>
<li><strong>Flowers &amp; landscaping</strong> (in many hotels) — lobby floral arrangements, indoor plants.</li>
</ul>
<h3>Four objectives</h3>
<pre><code>1. Cleanliness   -> hygiene, no visible dirt/dust/stains
2. Safety        -> no hazard from chemicals, wet floors, faulty equipment
3. Aesthetics    -> consistent look/feel that matches the brand standard
4. Cost control  -> minimize linen/supply/labor cost per occupied room
</code></pre>
<div class="callout"><span class="badge">Guest room = revenue</span> Housekeeping is the only department whose daily output (a "ready" room) is literally the hotel's sellable inventory.</div>`,
    `<span class="eyebrow">LOD213 · Chương 1 · Bài 1.1</span>
<h2>Vai trò &amp; phạm vi bộ phận buồng phòng</h2>
<h3>Định nghĩa</h3>
<p><strong>Housekeeping (buồng phòng)</strong> là bộ phận khách sạn chịu trách nhiệm về vệ sinh, cảnh báo hư hỏng cần bảo trì, chăm sóc thẩm mỹ và sự gọn gàng của phòng khách, khu công cộng và khu vực hậu cần, cùng việc kiểm soát đồ vải và vật dụng khách.</p>
<h3>Phạm vi — bốn khu vực làm việc</h3>
<ul>
<li><strong>Phòng khách</strong> — dọn phòng, làm giường, bổ sung tiện nghi, dịch vụ trải giường tối (turndown).</li>
<li><strong>Khu công cộng</strong> — sảnh, hành lang, thang máy, nhà vệ sinh, hành lang hậu cần và khu nhân viên.</li>
<li><strong>Đồ vải &amp; giặt là</strong> — chăn ga gối, khăn, đồ vải F&amp;B, đồng phục; giặt tại chỗ hoặc thuê ngoài.</li>
<li><strong>Hoa &amp; cây cảnh</strong> (ở nhiều khách sạn) — cắm hoa sảnh, cây cảnh trong nhà.</li>
</ul>
<h3>Bốn mục tiêu</h3>
<pre><code>1. Vệ sinh     -> sạch, không bụi bẩn/vết dơ nhìn thấy
2. An toàn     -> không hiểm hoạ từ hoá chất, sàn ướt, thiết bị hỏng
3. Thẩm mỹ     -> vẻ ngoài/cảm nhận đồng nhất, đúng chuẩn thương hiệu
4. Kiểm soát chi phí -> tối ưu chi phí đồ vải/vật dụng/nhân công trên mỗi phòng có khách
</code></pre>
<div class="callout"><span class="badge">Phòng khách = doanh thu</span> Buồng phòng là bộ phận duy nhất mà sản phẩm hàng ngày (một phòng "sẵn sàng bán") chính là hàng hoá bán được của khách sạn.</div>`,
  ]]);

const c1q = quiz('lod213-quiz-1', 'Quiz 1 — Role & scope|||Quiz 1 — Vai trò & phạm vi', [
  { id: 'q1', question: 'Phạm vi công việc của bộ phận buồng phòng KHÔNG bao gồm?', options: ['Phòng khách', 'Khu công cộng', 'Đồ vải & giặt là', 'Đặt phòng qua OTA'], correctIndex: 3, explanation: 'Đặt phòng qua OTA thuộc Sales/Lễ tân, không thuộc buồng phòng.' },
  { id: 'q2', question: 'Vì sao nói "phòng khách là doanh thu" đối với buồng phòng?', options: ['Buồng phòng thu tiền phòng trực tiếp', 'Sản phẩm hàng ngày của buồng phòng chính là hàng hoá bán được của khách sạn', 'Buồng phòng định giá phòng', 'Buồng phòng quản lý OTA'], correctIndex: 1, explanation: 'Lễ tân chỉ bán được phòng khi Buồng phòng đã trả phòng ở trạng thái sạch, đã kiểm.' },
  { id: 'q3', question: 'Bốn mục tiêu của buồng phòng theo bài học là?', options: ['Vệ sinh, an toàn, thẩm mỹ, kiểm soát chi phí', 'Doanh thu, marketing, bán hàng, chăm sóc khách', 'Tuyển dụng, đào tạo, lương, thưởng', 'Đặt phòng, check-in, check-out, thanh toán'], correctIndex: 0, explanation: 'Bốn mục tiêu: cleanliness, safety, aesthetics, cost control.' },
]);

const c2 = doc('lod213-2-1-org-staffing', '2.1 — Organizational structure & staffing|||2.1 — Cơ cấu tổ chức & nhân sự bộ phận buồng',
  'Sơ đồ tổ chức từ Executive Housekeeper đến Room Attendant; ca làm việc; định mức phòng/ca (productivity standard).',
  [[
    `<span class="eyebrow">LOD213 · Chapter 2 · Lesson 2.1</span>
<h2>Organizational structure &amp; staffing</h2>
<h3>Typical hierarchy (large hotel)</h3>
<pre><code>Executive Housekeeper (Trưởng bộ phận buồng)
  -> Assistant Executive Housekeeper
     -> Floor Supervisor (Giám sát tầng)
        -> Room Attendant (Nhân viên buồng)
     -> Public Area Supervisor
        -> Public Area Attendant
     -> Linen/Laundry Supervisor
        -> Linen Room Attendant / Laundry Attendant
     -> Horticulturist / Florist (nếu có)
</code></pre>
<p>In a small hotel, one <strong>Housekeeping Supervisor</strong> may cover all of the above; in a large chain hotel, roles split further (e.g. a dedicated <strong>Linen Room Supervisor</strong> and <strong>Uniform Room Attendant</strong>).</p>
<h3>Shifts &amp; productivity standard</h3>
<ul>
<li>Most hotels run <strong>morning shift</strong> (bulk of room cleaning) and a smaller <strong>evening/turndown shift</strong>; public area often runs a light night shift too.</li>
<li><strong>Productivity standard:</strong> a common benchmark is <strong>14–16 rooms per room attendant per 8-hour shift</strong> for a standard room; luxury/suite properties set a lower number because service time per room is longer.</li>
</ul>
<div class="callout"><span class="badge">Span of control</span> A Floor Supervisor typically oversees 4–6 room attendants — enough people to inspect every room they clean within the shift.</div>`,
    `<span class="eyebrow">LOD213 · Chương 2 · Bài 2.1</span>
<h2>Cơ cấu tổ chức &amp; nhân sự bộ phận buồng</h2>
<h3>Sơ đồ điển hình (khách sạn lớn)</h3>
<pre><code>Trưởng bộ phận buồng (Executive Housekeeper)
  -> Phó bộ phận buồng (Assistant Executive Housekeeper)
     -> Giám sát tầng (Floor Supervisor)
        -> Nhân viên buồng (Room Attendant)
     -> Giám sát khu công cộng (Public Area Supervisor)
        -> Nhân viên khu công cộng (Public Area Attendant)
     -> Giám sát đồ vải/giặt là (Linen/Laundry Supervisor)
        -> Nhân viên phòng đồ vải / Nhân viên giặt là
     -> Nhân viên cắm hoa/chăm cây (nếu có)
</code></pre>
<p>Ở khách sạn nhỏ, một <strong>Giám sát buồng phòng</strong> có thể phụ trách toàn bộ các mảng trên; ở khách sạn chuỗi lớn, vai trò tách chi tiết hơn (vd một <strong>Giám sát phòng đồ vải</strong> và <strong>Nhân viên phòng đồng phục</strong> riêng biệt).</p>
<h3>Ca làm việc &amp; định mức năng suất</h3>
<ul>
<li>Đa số khách sạn chạy <strong>ca sáng</strong> (phần lớn việc dọn phòng) và một <strong>ca chiều/turndown</strong> nhỏ hơn; khu công cộng thường có thêm ca đêm nhẹ.</li>
<li><strong>Định mức năng suất:</strong> chuẩn phổ biến là <strong>14–16 phòng/nhân viên buồng/ca 8 giờ</strong> đối với phòng tiêu chuẩn; khách sạn hạng sang/suite đặt định mức thấp hơn vì thời gian phục vụ mỗi phòng dài hơn.</li>
</ul>
<div class="callout"><span class="badge">Tầm quản lý</span> Một Giám sát tầng thường quản 4–6 nhân viên buồng — vừa đủ để kiểm hết các phòng họ dọn trong ca.</div>`,
  ]]);

const c2q = quiz('lod213-quiz-2', 'Quiz 2 — Organization & staffing|||Quiz 2 — Cơ cấu & nhân sự', [
  { id: 'q1', question: 'Ai đứng đầu bộ phận buồng phòng ở khách sạn lớn?', options: ['Front Office Manager', 'Executive Housekeeper', 'F&B Manager', 'Chief Engineer'], correctIndex: 1, explanation: 'Executive Housekeeper (Trưởng bộ phận buồng) là vị trí cao nhất của bộ phận.' },
  { id: 'q2', question: 'Định mức năng suất thường gặp cho nhân viên buồng phòng tiêu chuẩn là?', options: ['1–2 phòng/ca', '14–16 phòng/ca 8 giờ', '50 phòng/ca', 'Không có định mức'], correctIndex: 1, explanation: 'Chuẩn phổ biến 14–16 phòng/ca 8 giờ với phòng tiêu chuẩn.' },
  { id: 'q3', question: 'Giám sát tầng (Floor Supervisor) trực tiếp quản lý ai?', options: ['Executive Housekeeper', 'Nhân viên buồng (Room Attendant)', 'Front Office Manager', 'Giám đốc khách sạn'], correctIndex: 1, explanation: 'Floor Supervisor giám sát và kiểm phòng do Room Attendant dọn.' },
]);

const c3 = doc('lod213-3-1-guest-room-cleaning', '3.1 — Guest-room cleaning procedure|||3.1 — Quy trình dọn phòng khách',
  'Trình tự vào phòng, dọn phòng theo VTOS (từ trên xuống, từ trong ra ngoài), kỹ thuật làm giường, phân loại trạng thái phòng.',
  [[
    `<span class="eyebrow">LOD213 · Chapter 3 · Lesson 3.1</span>
<h2>Guest-room cleaning procedure</h2>
<h3>Room status codes (front-desk ↔ housekeeping language)</h3>
<pre><code>VD (Vacant Dirty)      -> guest checked out, not yet cleaned
VC (Vacant Clean)      -> cleaned, ready to inspect/sell
OD (Occupied Dirty)    -> guest staying, needs servicing
OC (Occupied Clean)    -> guest staying, already serviced
OOO (Out of Order)     -> cannot be sold (maintenance issue)
</code></pre>
<h3>The VTOS-aligned cleaning sequence</h3>
<p>Two guiding rules: work <strong>top to bottom</strong> (dust falls down, not up) and <strong>inside to outside / clean to dirty</strong> (finish at the door so you don't re-contaminate cleaned areas).</p>
<pre><code>1. Knock, announce, enter; open curtains, turn on lights
2. Strip bed, collect trash & used amenities
3. Make the bed (see below)
4. Dust top-to-bottom: light fixtures -> furniture -> ledges
5. Clean bathroom: toilet -> sink/counter -> shower/tub -> floor
6. Restock amenities & linen
7. Vacuum/mop floor working backward toward the door
8. Final visual check; close door; update room status
</code></pre>
<h3>Bed-making, step by step</h3>
<ul>
<li>Strip &amp; check mattress protector; place bottom sheet, mitered ("hospital") corners pulled taut.</li>
<li>Top sheet + blanket/duvet, tucked or duvet-covered per brand standard.</li>
<li>Pillows fluffed, cases seam-side away from the door; bed runner/throw centered.</li>
</ul>
<div class="callout"><span class="badge">Why the sequence matters</span> Cleaning out of order (e.g. vacuuming before dusting) means you redo work — the sequence is what makes 14–16 rooms/shift possible.</div>`,
    `<span class="eyebrow">LOD213 · Chương 3 · Bài 3.1</span>
<h2>Quy trình dọn phòng khách</h2>
<h3>Mã trạng thái phòng (ngôn ngữ chung Lễ tân ↔ Buồng phòng)</h3>
<pre><code>VD (Vacant Dirty)   -> khách đã trả phòng, chưa dọn
VC (Vacant Clean)   -> đã dọn, sẵn sàng kiểm/bán
OD (Occupied Dirty) -> khách đang ở, cần dọn
OC (Occupied Clean) -> khách đang ở, đã dọn xong
OOO (Out of Order)  -> không bán được (đang chờ bảo trì)
</code></pre>
<h3>Trình tự dọn theo VTOS</h3>
<p>Hai nguyên tắc dẫn đường: dọn <strong>từ trên xuống</strong> (bụi rơi xuống, không bay lên) và <strong>từ trong ra ngoài / từ sạch đến bẩn</strong> (kết thúc ở cửa để không làm bẩn lại khu đã dọn).</p>
<pre><code>1. Gõ cửa, thông báo, vào phòng; mở màn, mở đèn
2. Tháo ga trải giường, thu gom rác & vật dụng đã dùng
3. Làm giường (xem bên dưới)
4. Lau bụi từ trên xuống: đèn -> đồ nội thất -> bệ/gờ
5. Dọn phòng tắm: bồn cầu -> bồn rửa/mặt bàn -> vòi sen/bồn tắm -> sàn
6. Bổ sung tiện nghi & đồ vải
7. Hút bụi/lau sàn, lùi dần ra cửa
8. Kiểm tra tổng thể; đóng cửa; cập nhật trạng thái phòng
</code></pre>
<h3>Làm giường, từng bước</h3>
<ul>
<li>Tháo ga &amp; kiểm tấm bảo vệ nệm; trải ga dưới, gấp góc "bệnh viện" (mitered corner) căng phẳng.</li>
<li>Ga trên + chăn/mền, gấp gọn hoặc lồng vỏ chăn theo chuẩn thương hiệu.</li>
<li>Gối vỗ phồng, đường may vỏ gối quay ra xa cửa; khăn trải/runner đặt giữa giường.</li>
</ul>
<div class="callout"><span class="badge">Vì sao trình tự quan trọng</span> Dọn sai thứ tự (vd hút bụi trước khi lau bụi) khiến phải làm lại — chính trình tự này giúp đạt được 14–16 phòng/ca.</div>`,
  ]]);

const c3q = quiz('lod213-quiz-3', 'Quiz 3 — Guest-room cleaning|||Quiz 3 — Dọn phòng khách', [
  { id: 'q1', question: 'Mã trạng thái phòng "VD" nghĩa là?', options: ['Khách đang ở, đã dọn', 'Khách đã trả phòng, chưa dọn', 'Không bán được, chờ bảo trì', 'Đã dọn, sẵn sàng bán'], correctIndex: 1, explanation: 'VD = Vacant Dirty: khách trả phòng, chưa dọn.' },
  { id: 'q2', question: 'Hai nguyên tắc trình tự dọn phòng theo VTOS là?', options: ['Nhanh nhất có thể, bỏ bước không cần', 'Từ trên xuống & từ trong ra ngoài', 'Từ ngoài vào trong & từ dưới lên', 'Dọn phòng tắm trước, dọn giường sau'], correctIndex: 1, explanation: 'Dọn từ trên xuống (bụi rơi xuống) và từ trong ra ngoài/sạch đến bẩn (kết ở cửa).' },
  { id: 'q3', question: 'Trong quy trình dọn phòng tắm, thứ tự đúng là?', options: ['Sàn -> bồn cầu -> bồn rửa -> vòi sen', 'Bồn cầu -> bồn rửa/mặt bàn -> vòi sen/bồn tắm -> sàn', 'Vòi sen -> sàn -> bồn cầu -> bồn rửa', 'Bồn rửa -> sàn -> bồn cầu -> vòi sen'], correctIndex: 1, explanation: 'Thứ tự: bồn cầu -> bồn rửa/mặt bàn -> vòi sen/bồn tắm -> sàn (kết ở sàn để không làm bẩn lại).' },
]);

const c4 = doc('lod213-4-1-public-area-laundry', '4.1 — Public areas & laundry|||4.1 — Khu vực công cộng & giặt là',
  'Phân vùng khu công cộng (sảnh, hành lang, khu vệ sinh, hậu cần); tần suất dọn; chu trình giặt là (thu-phân loại-giặt-sấy-là-gấp-trả).',
  [[
    `<span class="eyebrow">LOD213 · Chapter 4 · Lesson 4.1</span>
<h2>Public areas &amp; laundry</h2>
<h3>Public-area zones &amp; cleaning frequency</h3>
<ul>
<li><strong>High-traffic guest zones</strong> (lobby, elevator, restrooms) — spot-cleaned continuously, deep-cleaned nightly.</li>
<li><strong>Corridors &amp; guest floors</strong> — vacuumed/mopped daily, carpets shampooed on a rotation.</li>
<li><strong>Back-of-house</strong> (staff corridors, loading dock, offices) — lower frequency but still scheduled, not "whenever."</li>
</ul>
<h3>Laundry (linen) cycle</h3>
<pre><code>1. Collect  -> soiled linen bagged/color-tagged at source (guest floor, F&B)
2. Sort     -> by fabric, color, and soil level (heavy stains apart)
3. Wash     -> correct wash formula (temperature, chemical, cycle time)
4. Extract/Dry -> spin extraction then tumble dry or flatwork ironer
5. Finish   -> iron/press, fold to brand standard
6. Store & distribute -> linen room -> par stock per floor -> guest floor
</code></pre>
<h3>In-house vs. outsourced laundry</h3>
<p>Large hotels often run an <strong>in-house laundry (OPL — on-premise laundry)</strong> for control and turnaround speed; smaller hotels outsource to a commercial laundry, trading control for lower capital cost.</p>
<div class="callout"><span class="badge">Why sorting matters</span> Mixing a heavily stained item into a normal wash load can re-transfer soil onto clean linen — sorting by soil level is as important as sorting by color.</div>`,
    `<span class="eyebrow">LOD213 · Chương 4 · Bài 4.1</span>
<h2>Khu vực công cộng &amp; giặt là</h2>
<h3>Phân vùng khu công cộng &amp; tần suất dọn</h3>
<ul>
<li><strong>Khu vực khách lưu lượng cao</strong> (sảnh, thang máy, nhà vệ sinh) — lau chùi liên tục theo điểm, tổng vệ sinh mỗi đêm.</li>
<li><strong>Hành lang &amp; tầng khách</strong> — hút bụi/lau sàn hàng ngày, giặt thảm theo lịch xoay vòng.</li>
<li><strong>Khu hậu cần</strong> (hành lang nhân viên, khu bốc xếp, văn phòng) — tần suất thấp hơn nhưng vẫn theo lịch, không phải "khi nào tiện".</li>
</ul>
<h3>Chu trình giặt là (đồ vải)</h3>
<pre><code>1. Thu gom  -> đồ vải bẩn đóng túi/gắn thẻ màu tại nguồn (tầng khách, F&B)
2. Phân loại -> theo vải, màu, và mức độ bẩn (vết bẩn nặng để riêng)
3. Giặt     -> đúng công thức giặt (nhiệt độ, hoá chất, thời gian chu trình)
4. Vắt/Sấy  -> vắt ly tâm rồi sấy trống hoặc là cuộn (flatwork ironer)
5. Hoàn thiện -> ủi/là, gấp theo chuẩn thương hiệu
6. Lưu kho & phân phối -> phòng đồ vải -> định mức theo tầng -> tầng khách
</code></pre>
<h3>Giặt tại chỗ hay thuê ngoài</h3>
<p>Khách sạn lớn thường vận hành <strong>giặt là tại chỗ (OPL — on-premise laundry)</strong> để kiểm soát và quay vòng nhanh; khách sạn nhỏ thuê giặt là công nghiệp bên ngoài, đánh đổi quyền kiểm soát để giảm vốn đầu tư.</p>
<div class="callout"><span class="badge">Vì sao phân loại quan trọng</span> Trộn một món đồ dính vết bẩn nặng vào mẻ giặt bình thường có thể lây bẩn ngược lên đồ vải sạch — phân loại theo mức độ bẩn quan trọng không kém phân loại theo màu.</div>`,
  ]]);

const c4q = quiz('lod213-quiz-4', 'Quiz 4 — Public area & laundry|||Quiz 4 — Khu công cộng & giặt là', [
  { id: 'q1', question: 'Khu vực nào cần tổng vệ sinh mỗi đêm dù được lau điểm liên tục ban ngày?', options: ['Khu hậu cần', 'Sảnh, thang máy, nhà vệ sinh khách', 'Kho đồ vải', 'Văn phòng nhân sự'], correctIndex: 1, explanation: 'Khu lưu lượng khách cao được lau điểm liên tục và tổng vệ sinh mỗi đêm.' },
  { id: 'q2', question: 'Bước đầu tiên của chu trình giặt là là?', options: ['Giặt', 'Thu gom & phân loại', 'Sấy', 'Là/ủi'], correctIndex: 1, explanation: 'Chu trình bắt đầu bằng thu gom đồ vải bẩn rồi phân loại trước khi giặt.' },
  { id: 'q3', question: 'Vì sao phải phân loại đồ vải theo MỨC ĐỘ BẨN, không chỉ theo màu?', options: ['Để giặt nhanh hơn', 'Đồ dính vết bẩn nặng có thể lây bẩn ngược lên đồ sạch nếu giặt chung', 'Vì máy giặt yêu cầu', 'Không cần thiết'], correctIndex: 1, explanation: 'Vết bẩn nặng lẫn vào mẻ giặt thường có thể tái nhiễm bẩn lên đồ vải khác.' },
]);

const c5 = doc('lod213-5-1-equipment-chemicals-safety', '5.1 — Equipment, chemicals & workplace safety|||5.1 — Trang thiết bị, hoá chất & an toàn lao động',
  'Thiết bị cơ bản (xe đẩy, máy hút bụi, máy chà sàn); nhóm hoá chất tẩy rửa & mã màu; PPE và quy tắc an toàn hoá chất (MSDS).',
  [[
    `<span class="eyebrow">LOD213 · Chapter 5 · Lesson 5.1</span>
<h2>Equipment, chemicals &amp; workplace safety</h2>
<h3>Core equipment</h3>
<ul>
<li><strong>Room attendant's cart (trolley)</strong> — carries linen, amenities, chemicals; organized so the attendant rarely needs to leave the room mid-clean.</li>
<li><strong>Vacuum cleaner, floor scrubber/polisher</strong> — daily carpet/hard-floor care.</li>
<li><strong>Wet floor sign, caution cones</strong> — mandatory whenever a floor is being mopped/polished.</li>
</ul>
<h3>Chemical families &amp; color-coded cloths</h3>
<pre><code>Cloth color -> typical use
  Red     -> toilet / high-risk bathroom surfaces
  Yellow  -> sink, bathroom counter
  Blue    -> mirrors & glass
  Green   -> general room surfaces
</code></pre>
<p>Color-coding prevents <strong>cross-contamination</strong> — e.g. a toilet cloth must never touch a drinking glass or the room's minibar surface.</p>
<h3>Chemical safety</h3>
<ul>
<li><strong>Never mix chemicals</strong> (e.g. bleach + acid-based cleaner releases toxic gas) — always follow the label and the <strong>MSDS/SDS (Material Safety Data Sheet)</strong>.</li>
<li><strong>PPE (Personal Protective Equipment):</strong> gloves, and where required, mask/goggles.</li>
<li>Store chemicals in original labeled containers, locked when not in use; keep cleaning trolleys away from open flames/heat sources.</li>
</ul>
<div class="callout"><span class="badge">One rule that saves lives</span> If you can't identify a chemical or don't know how it reacts with another, don't mix it — check the SDS first.</div>`,
    `<span class="eyebrow">LOD213 · Chương 5 · Bài 5.1</span>
<h2>Trang thiết bị, hoá chất &amp; an toàn lao động</h2>
<h3>Thiết bị cơ bản</h3>
<ul>
<li><strong>Xe đẩy nhân viên buồng (trolley)</strong> — chở đồ vải, tiện nghi, hoá chất; sắp xếp sao cho nhân viên hiếm khi phải ra khỏi phòng giữa lúc dọn.</li>
<li><strong>Máy hút bụi, máy chà/đánh bóng sàn</strong> — chăm sóc thảm/sàn cứng hàng ngày.</li>
<li><strong>Bảng "sàn trơn ướt", nón cảnh báo</strong> — bắt buộc bất cứ khi nào lau/đánh bóng sàn.</li>
</ul>
<h3>Nhóm hoá chất &amp; khăn mã màu</h3>
<pre><code>Màu khăn -> việc dùng thông thường
  Đỏ     -> bồn cầu / bề mặt phòng tắm rủi ro cao
  Vàng   -> bồn rửa, mặt bàn phòng tắm
  Xanh dương -> gương & mặt kính
  Xanh lá   -> bề mặt chung trong phòng
</code></pre>
<p>Mã màu ngăn <strong>lây nhiễm chéo</strong> — vd khăn dùng cho bồn cầu tuyệt đối không được chạm vào ly uống nước hay mặt tủ minibar của phòng.</p>
<h3>An toàn hoá chất</h3>
<ul>
<li><strong>Không bao giờ trộn hoá chất</strong> (vd thuốc tẩy + chất tẩy gốc axit sinh khí độc) — luôn theo nhãn và <strong>MSDS/SDS (Phiếu an toàn hoá chất)</strong>.</li>
<li><strong>PPE (Thiết bị bảo hộ cá nhân):</strong> găng tay, và khi cần, khẩu trang/kính bảo hộ.</li>
<li>Lưu hoá chất trong bao bì gốc có nhãn, khoá khi không dùng; để xe đẩy vệ sinh xa lửa/nguồn nhiệt.</li>
</ul>
<div class="callout"><span class="badge">Một quy tắc cứu mạng</span> Nếu không xác định được hoá chất hoặc không biết nó phản ứng thế nào với chất khác, đừng trộn — kiểm tra SDS trước.</div>`,
  ]]);

const c5q = quiz('lod213-quiz-5', 'Quiz 5 — Equipment, chemicals & safety|||Quiz 5 — Thiết bị, hoá chất & an toàn', [
  { id: 'q1', question: 'Mã màu khăn giúp ngăn chặn điều gì?', options: ['Tiết kiệm chi phí khăn', 'Lây nhiễm chéo giữa các bề mặt (vd khăn bồn cầu chạm ly uống nước)', 'Làm khăn bền hơn', 'Không cần giặt khăn'], correctIndex: 1, explanation: 'Mã màu giúp mỗi khăn chỉ dùng cho một loại bề mặt, tránh lây nhiễm chéo.' },
  { id: 'q2', question: 'Trước khi dùng chung hai loại hoá chất, cần kiểm tra gì?', options: ['Giá tiền', 'MSDS/SDS (Phiếu an toàn hoá chất)', 'Màu hoá chất', 'Không cần kiểm tra'], correctIndex: 1, explanation: 'SDS/MSDS cho biết hoá chất có phản ứng nguy hiểm khi trộn hay không.' },
  { id: 'q3', question: 'Bảng "sàn trơn ướt" bắt buộc dùng khi nào?', options: ['Chỉ khi có khách phàn nàn', 'Bất cứ khi nào lau/đánh bóng sàn', 'Chỉ vào ban đêm', 'Không bắt buộc'], correctIndex: 1, explanation: 'Cảnh báo sàn ướt là bắt buộc mỗi khi sàn đang được lau hoặc đánh bóng, để tránh trượt ngã.' },
]);

const c6 = doc('lod213-6-1-quality-control-standards', '6.1 — Quality control & room standards|||6.1 — Kiểm soát chất lượng & tiêu chuẩn phòng',
  'Quy trình kiểm phòng (inspection) của giám sát; checklist theo thang điểm; xử lý phòng không đạt & phản hồi khách.',
  [[
    `<span class="eyebrow">LOD213 · Chapter 6 · Lesson 6.1</span>
<h2>Quality control &amp; room standards</h2>
<h3>The inspection step</h3>
<p>After a room attendant marks a room <strong>Vacant Clean (VC)</strong>, a supervisor <strong>inspects</strong> it before it becomes <strong>Vacant Inspected/Ready</strong> and is released to Front Office for sale. Inspection is what makes "clean" verifiable, not just claimed.</p>
<h3>Inspection checklist (sample scoring)</h3>
<pre><code>Area              Points  Common defects
Bed & linen         20    wrinkled sheet, missing pillow
Bathroom            25    hair in drain, water spots, low amenity stock
Dusting/surfaces    15    dust on ledges, smudged glass
Floor/carpet        15    stains, vacuum lines uneven
Amenities/minibar   15    missing item, wrong placement
Overall smell/AC     10    odor, AC not set to standard
                    ----
Total              100    pass threshold commonly 90+
</code></pre>
<h3>Handling a failed inspection</h3>
<ul>
<li><strong>Send back for re-work</strong> with the specific defect noted — never re-inspect blind, check the exact item flagged.</li>
<li>Recurrent defects on one attendant become a <strong>coaching/training</strong> issue, not just a room problem.</li>
<li>A defect discovered only <em>after</em> a guest checks in becomes a <strong>service recovery</strong> case (apology, compensation) — far costlier than catching it at inspection.</li>
</ul>
<div class="callout"><span class="badge">Inspect a sample, not zero</span> Even with 14–16 rooms/attendant, supervisors physically walk a meaningful sample of "clean" rooms — self-reported cleanliness alone is not quality control.</div>`,
    `<span class="eyebrow">LOD213 · Chương 6 · Bài 6.1</span>
<h2>Kiểm soát chất lượng &amp; tiêu chuẩn phòng</h2>
<h3>Bước kiểm phòng</h3>
<p>Sau khi nhân viên buồng đánh dấu phòng <strong>Vacant Clean (VC)</strong>, giám sát sẽ <strong>kiểm phòng (inspection)</strong> trước khi phòng chuyển thành <strong>Vacant Inspected/Ready</strong> và được trả cho Lễ tân để bán. Kiểm phòng là bước biến "sạch" thành điều kiểm chứng được, không chỉ là lời khai.</p>
<h3>Checklist kiểm phòng (thang điểm mẫu)</h3>
<pre><code>Khu vực              Điểm  Lỗi thường gặp
Giường & đồ vải        20   ga nhăn, thiếu gối
Phòng tắm              25   tóc trong cống, vết nước, thiếu tiện nghi
Bụi/mặt bàn            15   bụi trên gờ, kính lem
Sàn/thảm               15   vết bẩn, vết hút bụi không đều
Tiện nghi/minibar      15   thiếu món, đặt sai vị trí
Mùi tổng thể/điều hoà  10   có mùi, điều hoà không đúng chuẩn
                      ----
Tổng                 100   ngưỡng đạt thường là 90+
</code></pre>
<h3>Xử lý phòng không đạt kiểm</h3>
<ul>
<li><strong>Trả lại để làm lại</strong> kèm ghi rõ lỗi cụ thể — không kiểm lại một cách mù mờ, phải kiểm đúng điểm bị gắn cờ.</li>
<li>Lỗi lặp lại ở một nhân viên trở thành vấn đề <strong>huấn luyện/đào tạo</strong>, không chỉ là vấn đề của một phòng.</li>
<li>Lỗi chỉ phát hiện <em>sau khi</em> khách đã check-in trở thành ca <strong>khắc phục dịch vụ</strong> (xin lỗi, đền bù) — tốn kém hơn nhiều so với bắt lỗi lúc kiểm phòng.</li>
</ul>
<div class="callout"><span class="badge">Kiểm một mẫu, không phải zero</span> Dù đạt 14–16 phòng/nhân viên, giám sát vẫn đi kiểm thực tế một mẫu đáng kể các phòng "đã sạch" — tự báo cáo sạch không phải là kiểm soát chất lượng.</div>`,
  ]]);

const c6q = quiz('lod213-quiz-6', 'Quiz 6 — Quality control|||Quiz 6 — Kiểm soát chất lượng', [
  { id: 'q1', question: 'Vai trò của bước "kiểm phòng" (inspection) là gì?', options: ['Thay nhân viên buồng dọn lại toàn bộ', 'Biến "sạch" thành điều kiểm chứng được trước khi bán phòng', 'Chỉ để đếm số phòng', 'Không cần thiết nếu nhân viên buồng đã báo xong'], correctIndex: 1, explanation: 'Kiểm phòng xác nhận chất lượng thực tế trước khi phòng được trả cho Lễ tân bán.' },
  { id: 'q2', question: 'Lỗi phòng chỉ được phát hiện SAU khi khách đã check-in gọi là ca gì?', options: ['Ca huấn luyện', 'Ca khắc phục dịch vụ (service recovery)', 'Ca kiểm định kỳ', 'Ca bảo trì thường'], correctIndex: 1, explanation: 'Phát hiện sau check-in đòi hỏi xin lỗi/đền bù — chi phí cao hơn phát hiện lúc kiểm phòng.' },
  { id: 'q3', question: 'Vì sao giám sát vẫn kiểm một MẪU phòng thay vì tin hoàn toàn báo cáo của nhân viên buồng?', options: ['Vì không tin nhân viên nào cả', 'Tự báo cáo sạch không phải là kiểm soát chất lượng thực sự', 'Vì quy định bắt buộc kiểm 100%', 'Không có lý do cụ thể'], correctIndex: 1, explanation: 'Kiểm soát chất lượng cần xác minh thực tế, không chỉ dựa vào lời khai.' },
]);

const c7 = doc('lod213-7-1-linen-inventory-cost', '7.1 — Linen management, inventory & cost control|||7.1 — Quản lý đồ vải, kho & chi phí',
  'Định mức đồ vải (par stock); vòng đời đồ vải & tỉ lệ hao hụt; chi phí buồng phòng trên mỗi phòng có khách (cost per occupied room).',
  [[
    `<span class="eyebrow">LOD213 · Chapter 7 · Lesson 7.1</span>
<h2>Linen management, inventory &amp; cost control</h2>
<h3>Par stock — the core inventory formula</h3>
<p><strong>Par stock</strong> is the quantity of each linen item needed to keep operations running smoothly, expressed as a multiple of "one set per room."</p>
<pre><code>Par stock = rooms x sets-per-room x par level

Example: 200 rooms, 2 bed-sheet sets/room, par level = 3
  Par stock = 200 x 2 x 3 = 1,200 bed sheets

Where the 3 "pars" typically sit:
  Par 1 -> on the beds (in use)
  Par 2 -> in laundry / in transit
  Par 3 -> in the linen room (reserve)
</code></pre>
<p>A property running below its par level risks running out mid-shift; running well above it ties up cash in unused stock and shortens shelf life through storage damage.</p>
<h3>Cost control levers</h3>
<ul>
<li><strong>Cost per occupied room (CPOR)</strong> — total housekeeping cost (labor + supplies + linen replacement) ÷ occupied room-nights; the standard benchmark across properties.</li>
<li><strong>Linen life-cycle tracking</strong> — new stock is tagged and its wash-count monitored; worn linen is downgraded (e.g. bath towel → cleaning rag) before being discarded, not thrown out at first sign of wear.</li>
<li><strong>Guest-supply reorder point</strong> — set a minimum stock level per item that triggers a purchase order automatically.</li>
</ul>
<div class="callout"><span class="badge">Linen is capital, not a consumable</span> A hotel's linen inventory is a meaningful line on the balance sheet — losing or over-discarding it is a financial leak, not just a housekeeping inconvenience.</div>`,
    `<span class="eyebrow">LOD213 · Chương 7 · Bài 7.1</span>
<h2>Quản lý đồ vải, kho &amp; chi phí</h2>
<h3>Par stock — công thức định mức cốt lõi</h3>
<p><strong>Par stock</strong> là số lượng mỗi loại đồ vải cần có để vận hành trơn tru, tính theo một số lần của "một bộ mỗi phòng".</p>
<pre><code>Par stock = số phòng x số bộ/phòng x mức par

Ví dụ: 200 phòng, 2 bộ ga giường/phòng, mức par = 3
  Par stock = 200 x 2 x 3 = 1.200 bộ ga giường

Ba "par" thường nằm ở đâu:
  Par 1 -> đang trên giường (đang dùng)
  Par 2 -> đang giặt / đang vận chuyển
  Par 3 -> trong phòng đồ vải (dự trữ)
</code></pre>
<p>Một khách sạn vận hành dưới mức par có nguy cơ hết đồ giữa ca; vận hành cao hơn nhiều mức par thì chôn vốn vào hàng tồn không dùng và giảm tuổi thọ đồ vải do hư hại lúc lưu kho.</p>
<h3>Các đòn bẩy kiểm soát chi phí</h3>
<ul>
<li><strong>Chi phí trên mỗi phòng có khách (CPOR)</strong> — tổng chi phí buồng phòng (nhân công + vật dụng + thay đồ vải) chia cho số đêm phòng có khách; chuẩn đối chiếu phổ biến giữa các khách sạn.</li>
<li><strong>Theo dõi vòng đời đồ vải</strong> — đồ vải mới được gắn thẻ và theo dõi số lần giặt; đồ vải cũ được hạ cấp (vd khăn tắm → khăn lau dọn) trước khi bỏ đi, không vứt ngay khi thấy dấu hiệu cũ.</li>
<li><strong>Điểm đặt hàng lại vật dụng khách</strong> — đặt mức tồn tối thiểu cho mỗi món để tự động phát sinh đơn mua hàng.</li>
</ul>
<div class="callout"><span class="badge">Đồ vải là vốn, không phải hàng tiêu hao</span> Kho đồ vải của khách sạn là một mục đáng kể trên báo cáo tài chính — làm mất hoặc bỏ đồ vải quá sớm là rò vốn, không chỉ là bất tiện vận hành.</div>`,
  ]]);

const c7q = quiz('lod213-quiz-7', 'Quiz 7 — Linen, inventory & cost|||Quiz 7 — Đồ vải, kho & chi phí', [
  { id: 'q1', question: 'Với 100 phòng, 2 bộ ga/phòng, mức par = 3, par stock ga giường là bao nhiêu?', options: ['200', '300', '600', '900'], correctIndex: 2, explanation: 'Par stock = 100 x 2 x 3 = 600 bộ ga giường.' },
  { id: 'q2', question: 'Chỉ số CPOR (cost per occupied room) dùng để làm gì?', options: ['Đếm số phòng trống', 'Chuẩn đối chiếu chi phí buồng phòng trên mỗi phòng có khách', 'Tính giá bán phòng', 'Đo mức hài lòng khách'], correctIndex: 1, explanation: 'CPOR = tổng chi phí buồng phòng ÷ số đêm phòng có khách.' },
  { id: 'q3', question: 'Cách xử lý đúng với khăn tắm đã cũ mòn, còn dùng được?', options: ['Vứt ngay khi thấy dấu hiệu cũ', 'Hạ cấp thành khăn lau dọn trước khi bỏ hẳn', 'Trả lại nhà cung cấp', 'Tiếp tục dùng cho phòng khách không cần theo dõi'], correctIndex: 1, explanation: 'Đồ vải cũ nên được hạ cấp mục đích dùng trước khi loại bỏ hoàn toàn, tận dụng vòng đời còn lại.' },
]);

const c8 = doc('lod213-8-1-coordination-tech-green', '8.1 — Cross-department coordination, technology & green trends|||8.1 — Phối hợp liên bộ phận, công nghệ & xu hướng xanh',
  'Phối hợp Buồng phòng-Lễ tân-Kỹ thuật-F&B; ứng dụng buồng phòng liên kết PMS; thực hành khách sạn xanh (linen reuse, hoá chất sinh học).',
  [[
    `<span class="eyebrow">LOD213 · Chapter 8 · Lesson 8.1</span>
<h2>Cross-department coordination, technology &amp; green trends</h2>
<h3>Who Housekeeping talks to, and why</h3>
<ul>
<li><strong>Front Office</strong> — room status is a two-way live feed: Front Office needs "Vacant Inspected" rooms to sell; Housekeeping needs arrival/departure and special-request data (early check-in, late check-out) to prioritize which rooms to clean first.</li>
<li><strong>Engineering/Maintenance</strong> — Housekeeping is often the first to spot a maintenance issue (leaking tap, broken AC) and must log it immediately so the room can be flagged Out of Order rather than sold broken.</li>
<li><strong>F&amp;B</strong> — shares linen (tablecloths, napkins) and sometimes public-area cleaning boundaries (restaurant floor vs. lobby floor).</li>
</ul>
<h3>Technology</h3>
<pre><code>PMS-linked housekeeping app on room attendant's phone/tablet:
  - Real-time room status update (no more paper checklists relayed by radio)
  - Automatic task assignment & re-sequencing as guests check in/out
  - Maintenance issue photo + ticket, sent directly to Engineering
</code></pre>
<h3>Green / sustainable housekeeping</h3>
<ul>
<li><strong>Linen &amp; towel reuse programs</strong> — guest opts in (card on the bed/rack) to skip daily linen change, cutting water, energy and chemical use.</li>
<li><strong>Biodegradable/low-VOC chemicals</strong> and concentrate dosing systems to cut both environmental impact and chemical cost.</li>
<li><strong>Amenity refill dispensers</strong> instead of single-use mini bottles — reduces plastic waste, a common certification criterion (e.g. Green Key, EarthCheck).</li>
</ul>
<div class="callout"><span class="badge">Green is also cost control</span> Most green-housekeeping practices (linen reuse, concentrate dosing) reduce cost per occupied room at the same time they reduce environmental impact — they are not opposed goals here.</div>`,
    `<span class="eyebrow">LOD213 · Chương 8 · Bài 8.1</span>
<h2>Phối hợp liên bộ phận, công nghệ &amp; xu hướng xanh</h2>
<h3>Buồng phòng làm việc với ai, và vì sao</h3>
<ul>
<li><strong>Lễ tân</strong> — trạng thái phòng là luồng dữ liệu hai chiều liên tục: Lễ tân cần phòng "đã kiểm, sẵn sàng" để bán; Buồng phòng cần dữ liệu đến/đi và yêu cầu đặc biệt (check-in sớm, check-out muộn) để ưu tiên dọn phòng nào trước.</li>
<li><strong>Kỹ thuật/Bảo trì</strong> — Buồng phòng thường là bộ phận phát hiện sự cố bảo trì đầu tiên (vòi nước rò, điều hoà hỏng) và phải ghi nhận ngay để phòng được gắn cờ Out of Order thay vì bị bán trong tình trạng hỏng.</li>
<li><strong>F&amp;B</strong> — chia sẻ đồ vải (khăn trải bàn, khăn ăn) và đôi khi ranh giới dọn khu công cộng (sàn nhà hàng vs sàn sảnh).</li>
</ul>
<h3>Công nghệ</h3>
<pre><code>Ứng dụng buồng phòng liên kết PMS trên điện thoại/tablet nhân viên:
  - Cập nhật trạng thái phòng theo thời gian thực (không còn checklist giấy truyền qua bộ đàm)
  - Tự động giao & sắp lại việc khi khách check-in/check-out
  - Chụp ảnh sự cố bảo trì + tạo ticket, gửi thẳng tới Kỹ thuật
</code></pre>
<h3>Buồng phòng xanh / bền vững</h3>
<ul>
<li><strong>Chương trình tái sử dụng đồ vải/khăn</strong> — khách chọn tham gia (thẻ đặt trên giường/giá khăn) để bỏ qua thay đồ vải mỗi ngày, giảm nước, năng lượng và hoá chất.</li>
<li><strong>Hoá chất phân hủy sinh học/ít VOC</strong> và hệ thống pha đậm đặc (concentrate dosing) để giảm cả tác động môi trường và chi phí hoá chất.</li>
<li><strong>Bình chiết tiện nghi refill</strong> thay chai mini dùng một lần — giảm rác nhựa, một tiêu chí chứng nhận phổ biến (vd Green Key, EarthCheck).</li>
</ul>
<div class="callout"><span class="badge">Xanh cũng là kiểm soát chi phí</span> Đa số thực hành buồng phòng xanh (tái sử dụng đồ vải, pha đậm đặc) vừa giảm chi phí trên mỗi phòng có khách vừa giảm tác động môi trường — ở đây không phải mục tiêu đối nghịch.</div>`,
  ]]);

const c8q = quiz('lod213-quiz-8', 'Quiz 8 — Coordination, tech & green|||Quiz 8 — Phối hợp, công nghệ & xanh', [
  { id: 'q1', question: 'Vì sao Buồng phòng phải báo NGAY sự cố bảo trì phát hiện được cho Kỹ thuật?', options: ['Để tính lương thêm giờ', 'Để phòng được gắn Out of Order thay vì bị bán trong tình trạng hỏng', 'Không bắt buộc, báo khi nào tiện', 'Vì Kỹ thuật quản lý Buồng phòng'], correctIndex: 1, explanation: 'Báo trễ có thể khiến phòng hỏng bị bán cho khách, gây phàn nàn tốn kém hơn nhiều.' },
  { id: 'q2', question: 'Ứng dụng buồng phòng liên kết PMS mang lại lợi ích gì?', options: ['Thay hoàn toàn nhân viên buồng', 'Cập nhật trạng thái phòng thời gian thực & tự động giao việc', 'Chỉ dùng để tính lương', 'Không có lợi ích thực tế'], correctIndex: 1, explanation: 'Ứng dụng thay checklist giấy/bộ đàm bằng cập nhật thời gian thực và giao việc tự động.' },
  { id: 'q3', question: 'Vì sao chương trình tái sử dụng khăn/đồ vải vừa "xanh" vừa lợi cho chi phí?', options: ['Vì khách phải trả thêm phí', 'Vì giảm nước/năng lượng/hoá chất dùng, tức giảm cả chi phí lẫn tác động môi trường', 'Vì không ảnh hưởng gì tới chi phí', 'Vì tăng số lần giặt đồ vải'], correctIndex: 1, explanation: 'Giảm số lần giặt đồng thời giảm chi phí vận hành và tác động môi trường — hai mục tiêu cùng chiều.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'LOD213',
    slug: 'lod213-housekeeping-operations',
    title: 'Housekeeping Operations',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/LOD213.webp',
    shortDescription: 'Hotel housekeeping: department role & organization, room/public-area cleaning, laundry, equipment/chemical safety, quality standards, linen/cost control, cross-department coordination & green trends. Based on Raghubalan, AHLEI, VTOS Vietnam.|||Nghiệp vụ buồng phòng: vai trò & cơ cấu tổ chức, dọn phòng khách/khu công cộng, giặt là, an toàn thiết bị/hoá chất, tiêu chuẩn chất lượng, đồ vải/chi phí, phối hợp liên bộ phận & xu hướng xanh. Theo Raghubalan, AHLEI, VTOS Việt Nam.',
    description: 'Môn <strong>LOD213 — Housekeeping Operations</strong> (kỳ 2, khối Quản trị Kinh doanh) xây dựng cả kỹ năng vận hành và quản lý bộ phận buồng phòng khách sạn. Từ <strong>vai trò &amp; cơ cấu tổ chức</strong> → <strong>quy trình dọn phòng khách</strong> (VTOS) → <strong>khu công cộng &amp; giặt là</strong> → <strong>trang thiết bị, hoá chất &amp; an toàn</strong> → <strong>kiểm soát chất lượng</strong> → <strong>đồ vải, kho &amp; chi phí</strong> → <strong>phối hợp liên bộ phận, công nghệ &amp; xu hướng xanh</strong>. Bám giáo trình <em>Hotel Housekeeping Operations and Management</em> (Raghubalan), <em>Managing Housekeeping Operations</em> (AHLEI) và tiêu chuẩn VTOS Việt Nam. Song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Vai trò & phạm vi bộ phận buồng phòng; cơ cấu tổ chức, ca làm việc, định mức năng suất; mã trạng thái phòng & quy trình dọn phòng khách/làm giường theo VTOS; khu công cộng & chu trình giặt là; thiết bị, mã màu hoá chất, PPE & MSDS; kiểm phòng & thang điểm chất lượng; công thức par stock, CPOR & vòng đời đồ vải; phối hợp với Lễ tân/Kỹ thuật/F&B; ứng dụng buồng phòng liên kết PMS; thực hành khách sạn xanh.',
    requirements: 'Không yêu cầu kiến thức nền đặc biệt. Nên đã học hoặc đang học các môn nhập môn Quản trị Khách sạn/Du lịch trong khung chương trình.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Raghubalan/AHLEI, tiêu chuẩn VTOS, tài liệu chính thức, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vai trò buồng phòng, vì sao quan trọng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan bộ phận buồng phòng & vai trò|||Chapter 1 — Housekeeping\'s role & scope', description: 'Định nghĩa, phạm vi 4 khu vực, 4 mục tiêu.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cơ cấu tổ chức & nhân sự bộ phận buồng|||Chapter 2 — Organizational structure & staffing', description: 'Sơ đồ tổ chức, ca làm việc, định mức năng suất.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Quy trình dọn phòng khách|||Chapter 3 — Guest-room cleaning procedure', description: 'Mã trạng thái phòng, trình tự dọn VTOS, làm giường.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Khu vực công cộng & giặt là|||Chapter 4 — Public areas & laundry', description: 'Phân vùng & tần suất dọn, chu trình giặt là.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Trang thiết bị, hoá chất & an toàn lao động|||Chapter 5 — Equipment, chemicals & safety', description: 'Thiết bị, mã màu hoá chất, PPE, MSDS.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kiểm soát chất lượng & tiêu chuẩn phòng|||Chapter 6 — Quality control & room standards', description: 'Kiểm phòng, thang điểm, xử lý phòng không đạt.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Quản lý đồ vải, kho & chi phí|||Chapter 7 — Linen, inventory & cost control', description: 'Par stock, CPOR, vòng đời đồ vải.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Phối hợp liên bộ phận, công nghệ & xu hướng xanh|||Chapter 8 — Coordination, technology & green trends', description: 'Lễ tân/Kỹ thuật/F&B, app PMS, khách sạn xanh.', lessons: [c8, c8q] },
  ],
};
