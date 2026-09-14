/**
 * CDM201 — Crowd Management. Khung 8 chương song ngữ VI+EN, khối Quản trị
 * Kinh doanh (BBA), FPTU, Kỳ 4. Trích dẫn (KHÔNG upload PDF): G. Keith Still
 * "Introduction to Crowd Science"; UK HSE / The Events Industry Forum "The
 * Event Safety Guide" (Purple Guide); John J. Fruin "Pedestrian Planning and
 * Design". Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ lồng nhau.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cdm201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình quốc tế (Purple Guide, G. Keith Still, Fruin), tài liệu chính thức miễn phí, YouTube, công cụ mô phỏng, lộ trình tự học.',
  [[
    `<span class="eyebrow">CDM201 · Materials</span>
<h2>Crowd Management — resource hub</h2>
<p class="lead">Everything to learn event &amp; venue crowd management — crowd science, risk assessment, site design, security coordination, emergency evacuation and technology — in one place. This course is built on real industry references, not a single textbook.</p>
<h3>📘 Core references (cited throughout this course)</h3>
<ul>
<li><a href="https://www.gkstill.com/" target="_blank" rel="noopener">G. Keith Still — Crowd Science &amp; Crowd Risk Analysis</a> — the academic foundation for "crowd dynamics" thinking used in this course.</li>
<li><a href="https://www.thepurpleguide.co.uk/" target="_blank" rel="noopener">The Purple Guide (The Event Safety Guide)</a> — originally published by the UK Health and Safety Executive (HSE), now maintained by The Events Industry Forum; the industry-standard event safety manual.</li>
<li><a href="https://www.hse.gov.uk/entertainment/event-safety/crowd-management.htm" target="_blank" rel="noopener">HSE — Crowd management at events</a> — the regulator's own free guidance page.</li>
<li>John J. Fruin, <em>Pedestrian Planning and Design</em> (1971) — the origin of "Level of Service" density/flow thinking still used in venue design today.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.gov.uk/government/publications/how-to-run-safe-events-during-the-coronavirus-pandemic" target="_blank" rel="noopener">UK Government — event safety guidance hub</a></li>
<li><a href="https://www.iavm.org/" target="_blank" rel="noopener">International Association of Venue Managers (IAVM)</a> — professional body, guidance &amp; case studies for venue/event managers.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@FEMA" target="_blank" rel="noopener">FEMA</a> — official US emergency management training content, incl. evacuation &amp; mass-gathering safety.</li>
<li><a href="https://www.youtube.com/@NFPA" target="_blank" rel="noopener">NFPA (National Fire Protection Association)</a> — egress, life-safety &amp; assembly-occupancy explainers.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.bentley.com/software/massmotion/" target="_blank" rel="noopener">MassMotion (Bentley Systems)</a> — agent-based pedestrian &amp; crowd simulation used by real stadiums/transit hubs.</li>
<li><a href="https://www.vadere.org/" target="_blank" rel="noopener">Vadere</a> — free, open-source pedestrian dynamics simulator for coursework/experiments.</li>
<li><a href="https://www.thepurpleguide.co.uk/" target="_blank" rel="noopener">The Purple Guide</a> — also doubles as a ready-made risk-assessment/checklist template.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — crowd science basics: what density, flow and "crowd crush" actually mean.</li>
<li><strong>Practice</strong> — work through a Purple Guide-style risk assessment for a small, familiar venue.</li>
<li><strong>Go deeper</strong> — site design, stakeholder/security coordination, live monitoring.</li>
<li><strong>Job-ready</strong> — emergency planning, technology, and the real incidents every event manager should know cold.</li>
</ol></div>`,
    `<span class="eyebrow">CDM201 · Tài liệu</span>
<h2>Trung tâm tài liệu quản lý đám đông</h2>
<p class="lead">Mọi thứ để học quản lý đám đông sự kiện &amp; địa điểm — khoa học đám đông, đánh giá rủi ro, thiết kế không gian, phối hợp an ninh, giám sát trực tiếp và công nghệ — gom về một chỗ. Môn này dựng trên nhiều nguồn tham khảo thực tế của ngành, không chỉ một giáo trình.</p>
<h3>📘 Nguồn tham khảo chính (được trích dẫn trong môn)</h3>
<ul>
<li><a href="https://www.gkstill.com/" target="_blank" rel="noopener">G. Keith Still — Crowd Science &amp; Crowd Risk Analysis</a> — nền học thuật cho tư duy "động lực học đám đông" dùng trong môn này.</li>
<li><a href="https://www.thepurpleguide.co.uk/" target="_blank" rel="noopener">The Purple Guide (The Event Safety Guide)</a> — ban đầu do HSE (Anh) xuất bản, nay do The Events Industry Forum duy trì; cẩm nang an toàn sự kiện chuẩn ngành.</li>
<li><a href="https://www.hse.gov.uk/entertainment/event-safety/crowd-management.htm" target="_blank" rel="noopener">HSE — Crowd management at events</a> — trang hướng dẫn miễn phí chính thức của cơ quan quản lý.</li>
<li>John J. Fruin, <em>Pedestrian Planning and Design</em> (1971) — nguồn gốc cách nghĩ "cấp độ dịch vụ" (Level of Service) theo mật độ/lưu lượng vẫn dùng trong thiết kế địa điểm ngày nay.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.gov.uk/government/publications/how-to-run-safe-events-during-the-coronavirus-pandemic" target="_blank" rel="noopener">UK Government — trung tâm hướng dẫn an toàn sự kiện</a></li>
<li><a href="https://www.iavm.org/" target="_blank" rel="noopener">International Association of Venue Managers (IAVM)</a> — hiệp hội nghề, hướng dẫn &amp; case study cho người quản lý địa điểm/sự kiện.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@FEMA" target="_blank" rel="noopener">FEMA</a> — nội dung đào tạo ứng phó khẩn cấp chính thức của Mỹ, gồm sơ tán &amp; an toàn tập hợp đông người.</li>
<li><a href="https://www.youtube.com/@NFPA" target="_blank" rel="noopener">NFPA (National Fire Protection Association)</a> — giải thích về thoát hiểm, an toàn sinh mạng &amp; khu vực tập hợp đông người.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.bentley.com/software/massmotion/" target="_blank" rel="noopener">MassMotion (Bentley Systems)</a> — mô phỏng đám đông/người đi bộ theo tác tử, được các sân vận động/đầu mối giao thông thật dùng.</li>
<li><a href="https://www.vadere.org/" target="_blank" rel="noopener">Vadere</a> — công cụ mô phỏng động lực học người đi bộ mã nguồn mở, miễn phí, dùng để thực hành.</li>
<li><a href="https://www.thepurpleguide.co.uk/" target="_blank" rel="noopener">The Purple Guide</a> — cũng là mẫu checklist/đánh giá rủi ro có sẵn để dùng ngay.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — khoa học đám đông cơ bản: mật độ, lưu lượng và "chen lấn sụp đổ" thực chất là gì.</li>
<li><strong>Luyện tập</strong> — làm thử một bản đánh giá rủi ro kiểu Purple Guide cho một địa điểm quen thuộc, quy mô nhỏ.</li>
<li><strong>Đào sâu</strong> — thiết kế không gian, phối hợp các bên liên quan/an ninh, giám sát trực tiếp.</li>
<li><strong>Sẵn sàng đi làm</strong> — lập kế hoạch khẩn cấp, công nghệ, và các sự cố thực tế mà người quản lý sự kiện nào cũng phải biết.</li>
</ol></div>`,
  ]]);

const intro = doc('cdm201-0-1-overview', 'Course overview: Crowd Management|||Tổng quan: Quản lý đám đông',
  'Đám đông là gì, vì sao cần quản lý (sự kiện, du lịch, khách sạn); khác biệt quản lý chủ động vs kiểm soát phản ứng; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">CDM201 · Lesson 0.1 · Overview</span>
<h2>Crowd Management</h2>
<p class="lead">This course prepares you to plan, run and secure events, venues, and hospitality/tourism spaces where large numbers of people gather — concerts, festivals, sports events, theme parks, transit hubs, hotel lobbies during peak check-in. <strong>Crowd management</strong> is proactive planning; <strong>crowd control</strong> is reactive handling once a problem has already started — this course is mostly about the first, because good planning makes the second rarely necessary.</p>
<h3>Why it matters</h3>
<ul>
<li>Crowd crushes and stampedes have killed hundreds of people at events that looked "just crowded" the night before — not chaos, but a predictable engineering/planning failure.</li>
<li>Every event, venue and hospitality manager is legally and ethically responsible for the safety of the crowd they invite in.</li>
<li>Good crowd management is also good business: smoother flow, shorter waits, and a safer, more enjoyable guest experience.</li>
</ul>
<h3>Roadmap</h3>
<p>Crowd science fundamentals → density &amp; flow dynamics → risk assessment → space &amp; flow design → security/stakeholder coordination → live/on-site management → emergency response &amp; evacuation → technology &amp; real incident case studies. Bilingual, grounded in the Purple Guide, G. Keith Still's crowd science, and Fruin's pedestrian design work.</p>`,
    `<span class="eyebrow">CDM201 · Bài 0.1 · Tổng quan</span>
<h2>Quản lý đám đông</h2>
<p class="lead">Môn này chuẩn bị cho bạn lập kế hoạch, vận hành và bảo đảm an toàn cho các sự kiện, địa điểm, và không gian du lịch/khách sạn nơi đông người tập trung — hoà nhạc, lễ hội, sự kiện thể thao, công viên giải trí, đầu mối giao thông, sảnh khách sạn giờ cao điểm check-in. <strong>Quản lý đám đông (crowd management)</strong> là lập kế hoạch chủ động; <strong>kiểm soát đám đông (crowd control)</strong> là xử lý phản ứng khi vấn đề đã xảy ra — môn này tập trung vào cái đầu tiên, vì lập kế hoạch tốt khiến cái thứ hai hiếm khi cần dùng.</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li>Chen lấn/sụp đổ đám đông đã giết hàng trăm người tại các sự kiện mà tối trước đó "chỉ là đông" — không phải hỗn loạn, mà là một lỗi kỹ thuật/kế hoạch có thể dự đoán được.</li>
<li>Mọi người quản lý sự kiện, địa điểm và khách sạn đều có trách nhiệm pháp lý và đạo đức với an toàn của đám đông mà họ mời vào.</li>
<li>Quản lý đám đông tốt cũng là kinh doanh tốt: luồng di chuyển trơn hơn, chờ đợi ngắn hơn, trải nghiệm khách hàng an toàn và thoải mái hơn.</li>
</ul>
<h3>Lộ trình</h3>
<p>Nền tảng khoa học đám đông → động lực học mật độ &amp; luồng di chuyển → đánh giá rủi ro → thiết kế không gian &amp; luồng di chuyển → phối hợp an ninh/các bên liên quan → quản lý trực tiếp tại sự kiện → ứng phó khẩn cấp &amp; sơ tán → công nghệ &amp; bài học sự cố thực tế. Song ngữ, bám theo Purple Guide, khoa học đám đông của G. Keith Still, và công trình thiết kế người đi bộ của Fruin.</p>`,
  ]]);

const c1 = doc('cdm201-1-1-crowd-science', '1.1 — Crowd management overview & crowd science|||1.1 — Tổng quan quản lý đám đông & khoa học đám đông',
  'Định nghĩa quản lý đám đông; khoa học đám đông (G. Keith Still); các loại đám đông; vì sao đa số thảm hoạ không do hoảng loạn.',
  [[
    `<span class="eyebrow">CDM201 · Chapter 1 · Lesson 1.1</span>
<h2>Crowd management overview &amp; crowd science</h2>
<h3>What is crowd management?</h3>
<p><strong>Crowd management</strong> is the planning, organizing and directing of the movement and behavior of people in a space so the event stays safe and enjoyable. It is proactive — designed in <em>before</em> doors open. <strong>Crowd control</strong>, by contrast, is the reactive handling of a crowd once it is already behaving in a way that threatens safety.</p>
<h3>Crowd science (G. Keith Still)</h3>
<p>Modern crowd management borrows from fluid dynamics: a crowd can be modeled as a flow with a <strong>density</strong> (people per m²), a <strong>speed</strong>, and a <strong>direction</strong>. The central, counter-intuitive insight from crowd science: most crowd disasters are <em>not</em> caused by panic or aggressive stampeding. They are caused by <strong>progressive crowd collapse</strong> — density building past a safe threshold until people can no longer control their own movement, and a single stumble cascades through a non-compressible mass.</p>
<h3>Types of crowds</h3>
<ul>
<li><strong>Ambulatory / moving crowd</strong> — people walking through, e.g. queuing to enter or exit.</li>
<li><strong>Spectator crowd</strong> — seated or standing to watch, e.g. a stadium audience.</li>
<li><strong>Fighting crowd</strong> — competing for a scarce resource (a sale, a front-row spot) — can turn aggressive.</li>
<li><strong>Escaping crowd</strong> — trying to flee a perceived danger — low probability, high consequence.</li>
<li><strong>Cavalcade / procession</strong> — a crowd moving together along a route, e.g. a parade.</li>
</ul>
<div class="callout"><span class="badge">Key mindset shift</span> Treat a crowd as a physical system with predictable dynamics, not a mass of individuals whose behavior can't be planned for. That shift is the whole discipline.</div>`,
    `<span class="eyebrow">CDM201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan quản lý đám đông &amp; khoa học đám đông</h2>
<h3>Quản lý đám đông là gì?</h3>
<p><strong>Quản lý đám đông (crowd management)</strong> là việc lập kế hoạch, tổ chức và định hướng chuyển động, hành vi của con người trong một không gian để sự kiện an toàn và thú vị. Đây là hoạt động chủ động — được thiết kế <em>trước</em> khi mở cửa. Ngược lại, <strong>kiểm soát đám đông (crowd control)</strong> là xử lý phản ứng khi đám đông đã có dấu hiệu đe doạ an toàn.</p>
<h3>Khoa học đám đông (G. Keith Still)</h3>
<p>Quản lý đám đông hiện đại vay mượn từ động lực học chất lưu: có thể mô hình hoá một đám đông như một dòng chảy có <strong>mật độ</strong> (người/m²), <strong>tốc độ</strong>, và <strong>hướng di chuyển</strong>. Điểm mấu chốt, hơi phản trực giác, từ khoa học đám đông: đa số thảm hoạ đám đông <em>không</em> do hoảng loạn hay chen lấn hung hãn gây ra. Chúng do <strong>sụp đổ đám đông tiến triển</strong> — mật độ tăng vượt ngưỡng an toàn đến mức con người không còn tự kiểm soát được chuyển động của mình, và một cú vấp ngã đơn lẻ dội domino qua cả khối người không thể co lại.</p>
<h3>Các loại đám đông</h3>
<ul>
<li><strong>Đám đông di chuyển (ambulatory)</strong> — người đi qua, vd xếp hàng vào/ra.</li>
<li><strong>Đám đông khán giả (spectator)</strong> — ngồi/đứng xem, vd khán giả sân vận động.</li>
<li><strong>Đám đông tranh giành (fighting)</strong> — cạnh tranh một nguồn tài nguyên hiếm (chỗ bán hàng, vị trí hàng đầu) — dễ trở nên hung hãn.</li>
<li><strong>Đám đông tháo chạy (escaping)</strong> — cố thoát khỏi nguy hiểm được cảm nhận — xác suất thấp, hậu quả cao.</li>
<li><strong>Đoàn diễu hành (cavalcade/procession)</strong> — đám đông di chuyển cùng nhau theo một lộ trình, vd diễu hành.</li>
</ul>
<div class="callout"><span class="badge">Thay đổi tư duy chính</span> Xem đám đông như một hệ vật lý có động lực học dự đoán được, không phải một khối cá nhân không thể lập kế hoạch cho. Đó chính là cả môn học này.</div>`,
  ]]);

const c1q = quiz('cdm201-quiz-1', 'Quiz 1 — Crowd science|||Quiz 1 — Khoa học đám đông', [
  { id: 'q1', question: 'Quản lý đám đông (crowd management) khác kiểm soát đám đông (crowd control) ở điểm nào?', options: ['Không có khác biệt, hai tên gọi một việc', 'Quản lý là chủ động lập kế hoạch trước; kiểm soát là xử lý phản ứng khi vấn đề đã xảy ra', 'Quản lý chỉ áp dụng cho sự kiện thể thao', 'Kiểm soát luôn tốt hơn quản lý'], correctIndex: 1, explanation: 'Crowd management = lập kế hoạch chủ động trước; crowd control = phản ứng sau khi sự cố đã bắt đầu.' },
  { id: 'q2', question: 'Theo khoa học đám đông của G. Keith Still, nguyên nhân phổ biến nhất gây thảm hoạ đám đông là gì?', options: ['Hoảng loạn tập thể ngẫu nhiên', 'Sụp đổ đám đông tiến triển do mật độ vượt ngưỡng an toàn', 'Thời tiết xấu', 'Thiếu âm nhạc giải trí'], correctIndex: 1, explanation: 'Đa số thảm hoạ do "progressive crowd collapse" — mật độ quá cao khiến một cú vấp dội domino, không cần hoảng loạn.' },
  { id: 'q3', question: 'Một hàng người xếp hàng chờ vào cổng sự kiện thuộc loại đám đông nào?', options: ['Đám đông tranh giành (fighting)', 'Đám đông di chuyển (ambulatory/moving)', 'Đám đông tháo chạy (escaping)', 'Đoàn diễu hành (cavalcade)'], correctIndex: 1, explanation: 'Xếp hàng vào/ra là ví dụ điển hình của đám đông di chuyển (ambulatory).' },
]);

const c2 = doc('cdm201-2-1-density-flow', '2.1 — Crowd dynamics & density|||2.1 — Động lực học đám đông & mật độ',
  'Mật độ (người/m²), tốc độ vs mật độ, lưu lượng (flow); ngưỡng cảnh báo "crowd crush"; sụp đổ đám đông tiến triển.',
  [[
    `<span class="eyebrow">CDM201 · Chapter 2 · Lesson 2.1</span>
<h2>Crowd dynamics &amp; density</h2>
<h3>Density, speed, flow</h3>
<p><strong>Density (D)</strong> = number of people ÷ area (persons/m²). As density rises, average walking <strong>speed falls</strong> — people have less room to step. <strong>Flow</strong> (people passing a point per unit time, per unit width) rises with density at first, then <strong>collapses</strong> once density gets too high and people can no longer move independently.</p>
<pre><code>Density  ->  Speed        ->  Flow
Low         fast, free        low (few people passing)
Medium      slower, jostling  peak (best throughput)
Very high   near-zero         collapses (crush risk)
</code></pre>
<h3>The industry warning threshold</h3>
<p>A widely used benchmark in event safety literature (building on Fruin's Level-of-Service concept): density around <strong>4 people per m²</strong> is where a crowd stops being individually mobile and starts behaving as a single, non-compressible mass — the point where planners should already be intervening, not the point where a crisis is confirmed.</p>
<h3>Crowd crush / progressive crowd collapse</h3>
<p>A crush does not require panic. At sustained high density, one person losing balance can push into neighbors who cannot step back — the fall (and the pressure) propagates through the crowd like a wave. This mechanism, documented by G. Keith Still's analysis of multiple real disasters, is why "the crowd wasn't panicking" is not evidence that a crowd was safe.</p>
<div class="callout"><span class="badge">Design implication</span> Monitor density continuously and act well BEFORE it approaches the danger threshold — by the time a crush starts, no on-site intervention can stop it fast enough.</div>`,
    `<span class="eyebrow">CDM201 · Chương 2 · Bài 2.1</span>
<h2>Động lực học đám đông &amp; mật độ</h2>
<h3>Mật độ, tốc độ, lưu lượng</h3>
<p><strong>Mật độ (D)</strong> = số người ÷ diện tích (người/m²). Khi mật độ tăng, <strong>tốc độ đi bộ trung bình giảm</strong> — người có ít không gian bước hơn. <strong>Lưu lượng (flow)</strong> (số người qua một điểm trong một đơn vị thời gian, trên một đơn vị chiều rộng) tăng theo mật độ ở giai đoạn đầu, rồi <strong>sụp đổ</strong> khi mật độ quá cao và người không còn di chuyển độc lập được nữa.</p>
<pre><code>Mật độ    ->  Tốc độ           ->  Lưu lượng
Thấp          nhanh, tự do          thấp (ít người qua)
Trung bình    chậm hơn, chen chúc   đỉnh (thông lượng tốt nhất)
Rất cao       gần như bằng 0        sụp đổ (nguy cơ chen lấn)
</code></pre>
<h3>Ngưỡng cảnh báo của ngành</h3>
<p>Một ngưỡng thường được dùng trong tài liệu an toàn sự kiện (dựa trên khái niệm cấp độ dịch vụ của Fruin): mật độ khoảng <strong>4 người/m²</strong> là điểm mà đám đông không còn tự di chuyển độc lập được nữa và bắt đầu hành xử như một khối không thể co lại — đây là điểm mà người lập kế hoạch nên ĐÃ can thiệp, không phải điểm xác nhận khủng hoảng.</p>
<h3>Chen lấn/sụp đổ đám đông tiến triển</h3>
<p>Chen lấn không cần hoảng loạn. Ở mật độ cao kéo dài, một người mất thăng bằng có thể đẩy vào người bên cạnh mà không ai lùi lại được — cú ngã (và áp lực) truyền qua đám đông như một làn sóng. Cơ chế này, được G. Keith Still ghi lại qua nhiều thảm hoạ thật, là lý do "đám đông không hoảng loạn" không phải bằng chứng đám đông đang an toàn.</p>
<div class="callout"><span class="badge">Ý nghĩa cho thiết kế</span> Theo dõi mật độ liên tục và hành động RẤT SỚM trước khi tới ngưỡng nguy hiểm — khi chen lấn đã bắt đầu, không có can thiệp tại chỗ nào đủ nhanh để chặn lại.</div>`,
  ]]);

const c2q = quiz('cdm201-quiz-2', 'Quiz 2 — Density & flow|||Quiz 2 — Mật độ & luồng di chuyển', [
  { id: 'q1', question: 'Khi mật độ đám đông tăng lên, tốc độ di chuyển trung bình sẽ?', options: ['Tăng theo', 'Không đổi', 'Giảm dần', 'Chỉ giảm nếu có nhạc lớn'], correctIndex: 2, explanation: 'Mật độ cao hơn nghĩa là ít không gian bước hơn nên tốc độ trung bình giảm.' },
  { id: 'q2', question: 'Ngưỡng mật độ thường được ngành sự kiện dùng để cảnh báo nguy cơ "crowd crush" là khoảng?', options: ['0,5 người/m²', '1 người/m²', '4 người/m²', '10 người/m²'], correctIndex: 2, explanation: 'Khoảng 4 người/m² là mốc cảnh báo phổ biến — đám đông bắt đầu hành xử như một khối không thể co lại.' },
  { id: 'q3', question: '"Sụp đổ đám đông tiến triển" có thể xảy ra ngay cả khi đám đông KHÔNG hoảng loạn — đúng hay sai, và vì sao?', options: ['Sai, luôn cần hoảng loạn mới sụp đổ', 'Đúng, vì mật độ quá cao khiến một cú ngã dội domino cả khối, không cần hoảng loạn', 'Sai, chỉ xảy ra khi có bạo lực', 'Đúng, nhưng chỉ ở trong nhà'], correctIndex: 1, explanation: 'Cơ chế sụp đổ tiến triển là vật lý (mật độ + không thể co lại), không phụ thuộc trạng thái tâm lý hoảng loạn.' },
]);

const c3 = doc('cdm201-3-1-risk-assessment', '3.1 — Event risk assessment|||3.1 — Đánh giá rủi ro sự kiện',
  'Quy trình 5 bước theo Purple Guide/HSE; ma trận rủi ro (khả năng × hậu quả); Event Safety Plan; đánh giá là tài liệu sống.',
  [[
    `<span class="eyebrow">CDM201 · Chapter 3 · Lesson 3.1</span>
<h2>Event risk assessment</h2>
<h3>The risk assessment process (per the Purple Guide / HSE)</h3>
<ol>
<li><strong>Identify hazards</strong> — crowd density/pinch points, weather, temporary structures, fire, medical emergencies, hostile threats.</li>
<li><strong>Identify who is at risk</strong> — attendees, staff, performers, nearby residents.</li>
<li><strong>Evaluate the risk</strong> — likelihood × severity for each hazard.</li>
<li><strong>Record findings &amp; control measures</strong> — what reduces each risk, and who owns that action.</li>
<li><strong>Review &amp; update</strong> — before, during and after the event, as conditions change.</li>
</ol>
<h3>Risk matrix</h3>
<pre><code>              Low severity   Medium severity   High severity
Rare risk       Low             Low              Medium
Possible risk   Low             Medium           High
Likely risk     Medium          High             Critical
</code></pre>
<h3>The Event Safety Plan (ESP)</h3>
<p>All findings feed a single owned document covering the crowd management plan, medical plan, traffic management plan, communications plan and contingency/emergency plan — accountable to a named <strong>Event Safety Officer</strong>.</p>
<div class="callout"><span class="badge">Not a one-off form</span> A risk assessment is a <strong>living document</strong>: capacity, weather, layout and even ticket sales can change it right up to the day of the event.</div>`,
    `<span class="eyebrow">CDM201 · Chương 3 · Bài 3.1</span>
<h2>Đánh giá rủi ro sự kiện</h2>
<h3>Quy trình đánh giá rủi ro (theo Purple Guide / HSE)</h3>
<ol>
<li><strong>Xác định mối nguy</strong> — mật độ đám đông/điểm nghẽn, thời tiết, kết cấu tạm, cháy, cấp cứu y tế, mối đe doạ thù địch.</li>
<li><strong>Xác định ai chịu rủi ro</strong> — khách tham dự, nhân viên, người biểu diễn, cư dân xung quanh.</li>
<li><strong>Đánh giá mức rủi ro</strong> — khả năng xảy ra × mức độ hậu quả cho từng mối nguy.</li>
<li><strong>Ghi nhận kết quả &amp; biện pháp kiểm soát</strong> — điều gì giảm được từng rủi ro, và ai chịu trách nhiệm hành động đó.</li>
<li><strong>Rà soát &amp; cập nhật</strong> — trước, trong và sau sự kiện, khi điều kiện thay đổi.</li>
</ol>
<h3>Ma trận rủi ro</h3>
<pre><code>              Hậu quả thấp   Hậu quả trung bình   Hậu quả cao
Hiếm khi         Thấp            Thấp               Trung bình
Có thể xảy ra    Thấp            Trung bình         Cao
Dễ xảy ra        Trung bình      Cao                Nghiêm trọng
</code></pre>
<h3>Kế hoạch an toàn sự kiện (ESP)</h3>
<p>Mọi kết quả đánh giá đổ vào một tài liệu chủ gồm kế hoạch quản lý đám đông, kế hoạch y tế, kế hoạch giao thông, kế hoạch truyền thông và kế hoạch dự phòng/khẩn cấp — chịu trách nhiệm bởi một <strong>Event Safety Officer</strong> được chỉ định rõ.</p>
<div class="callout"><span class="badge">Không phải làm một lần</span> Đánh giá rủi ro là <strong>tài liệu sống</strong>: sức chứa, thời tiết, bố cục và cả lượng vé bán ra có thể làm nó thay đổi cho tới sát ngày sự kiện.</div>`,
  ]]);

const c3q = quiz('cdm201-quiz-3', 'Quiz 3 — Risk assessment|||Quiz 3 — Đánh giá rủi ro', [
  { id: 'q1', question: 'Trong đánh giá rủi ro, "mức rủi ro" của một mối nguy thường được xác định bằng?', options: ['Số lượng nhân viên an ninh', 'Khả năng xảy ra × mức độ hậu quả', 'Giá vé sự kiện', 'Số lượng camera CCTV'], correctIndex: 1, explanation: 'Mức rủi ro = likelihood (khả năng) × severity (hậu quả), theo quy trình chuẩn của Purple Guide/HSE.' },
  { id: 'q2', question: 'Theo Purple Guide, ai chịu trách nhiệm tổng thể về an toàn tại một sự kiện?', options: ['Ban nhạc/nghệ sĩ chính', 'Event Safety Officer được chỉ định rõ trách nhiệm', 'Toàn bộ khán giả cùng chịu', 'Không cần chỉ định cụ thể ai'], correctIndex: 1, explanation: 'Kế hoạch an toàn sự kiện phải có một Event Safety Officer chịu trách nhiệm tổng thể, không để trách nhiệm mơ hồ.' },
  { id: 'q3', question: 'Đánh giá rủi ro sự kiện nên được xem là loại tài liệu nào?', options: ['Tài liệu cố định, chỉ làm một lần trước sự kiện', 'Tài liệu sống, cập nhật liên tục khi điều kiện thực tế thay đổi', 'Tài liệu chỉ cần khi có sự cố xảy ra', 'Việc riêng của đội an ninh, không liên quan ban tổ chức'], correctIndex: 1, explanation: 'Rủi ro thay đổi theo thời tiết, sức chứa, bố cục... nên đánh giá phải được cập nhật liên tục, không chỉ làm một lần.' },
]);

const c4 = doc('cdm201-4-1-space-design', '4.1 — Event planning & space design|||4.1 — Lập kế hoạch & thiết kế không gian',
  'Sức chứa quyết định bởi điểm nghẽn hẹp nhất; nguyên tắc thiết kế lối vào/ra; hàng rào định tuyến không tạo ngõ cụt.',
  [[
    `<span class="eyebrow">CDM201 · Chapter 4 · Lesson 4.1</span>
<h2>Event planning &amp; space design</h2>
<h3>Capacity is decided by the pinch point, not the floor area</h3>
<p>A venue's real, safe capacity is set by its most restrictive <strong>pinch point</strong> — the narrowest door, staircase, or ticket-check lane — not by the open square meters of the main floor. Capacity must be calculated so the whole crowd can exit within the venue's target evacuation time.</p>
<h3>Ingress/egress design principles</h3>
<ul>
<li><strong>Separate entry and exit flows</strong> wherever possible — crossing flows create friction and slow everyone down.</li>
<li><strong>Design exit flow-rate ≥ expected peak demand</strong> — more/wider exits than the "average" moment needs, sized for the worst moment.</li>
<li><strong>Never create dead-ends</strong> — every barrier or lane must lead somewhere safe.</li>
</ul>
<pre><code>Street  -> [funnel]  -> multiple lanes -> ticket check -> venue floor
                (barriers guide flow; never a dead end)
</code></pre>
<div class="callout"><span class="badge">The weakest link rule</span> One undersized gate can undo an otherwise well-designed venue — capacity planning always starts from the narrowest point, not the average one.</div>`,
    `<span class="eyebrow">CDM201 · Chương 4 · Bài 4.1</span>
<h2>Lập kế hoạch &amp; thiết kế không gian</h2>
<h3>Sức chứa quyết định bởi điểm nghẽn, không phải diện tích sàn</h3>
<p>Sức chứa thực và an toàn của một địa điểm được quyết định bởi <strong>điểm nghẽn (pinch point)</strong> hạn chế nhất — cửa hẹp nhất, cầu thang, hay làn soát vé — không phải diện tích mở của sàn chính. Sức chứa phải được tính để toàn bộ đám đông có thể thoát ra trong thời gian sơ tán mục tiêu của địa điểm.</p>
<h3>Nguyên tắc thiết kế lối vào/ra</h3>
<ul>
<li><strong>Tách luồng vào và luồng ra</strong> khi có thể — luồng cắt chéo tạo ma sát và làm chậm tất cả mọi người.</li>
<li><strong>Lưu lượng lối ra ≥ nhu cầu đỉnh dự kiến</strong> — số lối/độ rộng phải đủ cho thời điểm xấu nhất, không chỉ thời điểm "trung bình".</li>
<li><strong>Không bao giờ tạo ngõ cụt</strong> — mọi hàng rào hay làn đi phải dẫn tới nơi an toàn.</li>
</ul>
<pre><code>Đường phố -> [phễu lọc] -> nhiều làn -> soát vé -> sàn sự kiện
                (hàng rào định hướng luồng; không bao giờ ngõ cụt)
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc điểm yếu nhất</span> Một cổng thiết kế quá hẹp có thể phá hỏng cả một địa điểm được thiết kế tốt — lập kế hoạch sức chứa luôn bắt đầu từ điểm hẹp nhất, không phải điểm trung bình.</div>`,
  ]]);

const c4q = quiz('cdm201-quiz-4', 'Quiz 4 — Space design|||Quiz 4 — Thiết kế không gian', [
  { id: 'q1', question: 'Sức chứa thực tế của một khu vực sự kiện thường bị quyết định bởi điều gì?', options: ['Tổng diện tích sàn', 'Điểm nghẽn (lối vào/ra) hạn chế nhất', 'Số lượng loa PA', 'Giá vé bán ra'], correctIndex: 1, explanation: 'Điểm nghẽn hẹp nhất quyết định lưu lượng thoát thực tế, không phải diện tích mở của sàn.' },
  { id: 'q2', question: 'Nguyên tắc quan trọng nhất khi thiết kế hàng rào định tuyến (crowd barrier) là gì?', options: ['Càng nhiều hàng rào càng an toàn', 'Không bao giờ tạo ngõ cụt — luôn có đường dẫn tới nơi an toàn', 'Hàng rào phải cùng một màu', 'Hàng rào chỉ cần ở lối vào'], correctIndex: 1, explanation: 'Một hàng rào dẫn vào ngõ cụt có thể biến thành cái bẫy khi đám đông cần thoát.' },
  { id: 'q3', question: 'Vì sao nên tách luồng lối vào và lối ra khi có thể?', options: ['Để trang trí đẹp hơn', 'Để tránh luồng người cắt chéo nhau gây tắc nghẽn và va chạm', 'Vì luật bắt buộc ở mọi quốc gia', 'Không có lý do kỹ thuật, chỉ là thói quen'], correctIndex: 1, explanation: 'Luồng cắt chéo tạo ma sát, làm chậm cả hai chiều và tăng rủi ro chen lấn.' },
]);

const c5 = doc('cdm201-5-1-security-coordination', '5.1 — Security, safety & stakeholder coordination|||5.1 — An ninh, an toàn & phối hợp lực lượng',
  'Vai trò các bên liên quan; mô hình chỉ huy Gold-Silver-Bronze; kiểm soát ra vào; phối hợp hỏng nhất ở điểm nối giữa các đơn vị.',
  [[
    `<span class="eyebrow">CDM201 · Chapter 5 · Lesson 5.1</span>
<h2>Security, safety &amp; stakeholder coordination</h2>
<h3>Who's at the table</h3>
<ul>
<li><strong>Event organizer</strong> — overall accountability.</li>
<li><strong>Private security/stewards</strong> — crowd stewarding, bag checks, day-to-day presence.</li>
<li><strong>Police</strong> — public order, law enforcement powers.</li>
<li><strong>Medical/ambulance (EMS)</strong> and <strong>fire service</strong>.</li>
<li><strong>Local authority</strong> — licensing, permits.</li>
</ul>
<h3>Command structure (Gold–Silver–Bronze)</h3>
<pre><code>Gold   (strategic, usually off-site)  — overall decisions, resources
  |
Silver (tactical, on-site coordinator) — coordinates all zones live
  |
Bronze (operational, frontline teams)  — one per zone/gate/stage
</code></pre>
<h3>Access control</h3>
<p>Ticket/wristband checks, bag searches, a prohibited-items list, and accreditation zones for staff, media and VIPs all sit under one coordinated plan, not separate teams improvising independently.</p>
<div class="callout"><span class="badge">Where it really fails</span> Coordination breaks down most often at the <strong>joints between agencies</strong>, not inside any one team. A shared radio channel and a single incident log matter more than any individual team's skill.</div>`,
    `<span class="eyebrow">CDM201 · Chương 5 · Bài 5.1</span>
<h2>An ninh, an toàn &amp; phối hợp lực lượng</h2>
<h3>Ai tham gia phối hợp</h3>
<ul>
<li><strong>Ban tổ chức sự kiện</strong> — chịu trách nhiệm tổng thể.</li>
<li><strong>An ninh tư nhân/steward</strong> — quản lý đám đông hằng ngày, soát túi.</li>
<li><strong>Cảnh sát</strong> — trật tự công cộng, quyền lực thực thi pháp luật.</li>
<li><strong>Y tế/cấp cứu (EMS)</strong> và <strong>lực lượng cứu hỏa</strong>.</li>
<li><strong>Chính quyền địa phương</strong> — cấp phép, giấy phép.</li>
</ul>
<h3>Mô hình chỉ huy Gold–Silver–Bronze</h3>
<pre><code>Gold   (chiến lược, thường ở ngoài hiện trường) — quyết định tổng thể, nguồn lực
  |
Silver (chiến thuật, điều phối tại hiện trường)  — điều phối mọi khu vực theo thời gian thực
  |
Bronze (thực thi, các đội tuyến đầu)             — một đội cho mỗi khu vực/cổng/sân khấu
</code></pre>
<h3>Kiểm soát ra vào</h3>
<p>Soát vé/vòng tay, kiểm tra túi, danh sách vật cấm, và khu vực phân quyền theo thẻ cho nhân viên, truyền thông và VIP đều nằm trong một kế hoạch được điều phối, không phải từng đội tự ứng biến riêng lẻ.</p>
<div class="callout"><span class="badge">Nơi thường hỏng nhất</span> Phối hợp thường đổ vỡ ở <strong>điểm nối giữa các đơn vị</strong>, không phải trong nội bộ một đội. Một kênh radio chung và một nhật ký sự cố duy nhất quan trọng hơn kỹ năng của bất kỳ đội riêng lẻ nào.</div>`,
  ]]);

const c5q = quiz('cdm201-quiz-5', 'Quiz 5 — Security coordination|||Quiz 5 — Phối hợp an ninh', [
  { id: 'q1', question: 'Trong mô hình chỉ huy Gold-Silver-Bronze, cấp "Silver" đóng vai trò gì?', options: ['Quyết định chiến lược ngoài hiện trường', 'Điều phối chiến thuật tại hiện trường, giữa Gold và Bronze', 'Chỉ làm nhiệm vụ soát vé', 'Không có vai trò cụ thể'], correctIndex: 1, explanation: 'Silver là cấp điều phối chiến thuật tại hiện trường, nối giữa quyết định chiến lược (Gold) và thực thi tuyến đầu (Bronze).' },
  { id: 'q2', question: 'Vì sao cần một kênh liên lạc/nhật ký sự cố CHUNG giữa an ninh, y tế, cảnh sát?', options: ['Vì luật yêu cầu ở mọi trường hợp', 'Vì phối hợp thường hỏng nhất ở điểm nối giữa các đơn vị, không phải trong nội bộ từng đơn vị', 'Để tiết kiệm chi phí thiết bị', 'Không cần thiết nếu mỗi đội đều giỏi'], correctIndex: 1, explanation: 'Sự cố nghiêm trọng thường xảy ra vì thông tin không truyền được giữa các đơn vị, chứ không phải vì một đơn vị yếu kém.' },
  { id: 'q3', question: 'Kiểm soát ra vào (access control) tại sự kiện thường bao gồm những gì?', options: ['Chỉ soát vé, không cần gì khác', 'Soát vé/vòng tay, kiểm tra túi, danh sách vật cấm, phân vùng theo thẻ', 'Chỉ áp dụng cho khu VIP', 'Chỉ cần biển báo, không cần kiểm tra'], correctIndex: 1, explanation: 'Access control là một kế hoạch phối hợp gồm nhiều lớp kiểm soát, không chỉ soát vé đơn lẻ.' },
]);

const c6 = doc('cdm201-6-1-live-management', '6.1 — Managing the live event|||6.1 — Quản lý trong sự kiện',
  'Giám sát trực tiếp (CCTV, điểm quan sát); truyền thông với khán giả; chỉ số cảnh báo sớm; can thiệp sớm và nhàm chán.',
  [[
    `<span class="eyebrow">CDM201 · Chapter 6 · Lesson 6.1</span>
<h2>Managing the live event</h2>
<h3>Real-time monitoring</h3>
<p>CCTV covering entrances and pinch points, elevated observation points, and stewards with radios all feed a running picture of crowd density that must be updated <em>throughout</em> the event, not just checked once at the door.</p>
<h3>Communicating with the crowd</h3>
<p>PA announcements, signage and digital screens work best when instructions are <strong>calm, clear and repeated</strong> — volume alone rarely reduces confusion, and panicked-sounding announcements can make things worse.</p>
<h3>Early warning indicators</h3>
<ul>
<li>Density rising past the planned threshold at a specific point.</li>
<li>A queue backing up instead of clearing.</li>
<li>A change in crowd noise or mood.</li>
<li>Steward reports from the ground, before anything shows up on camera.</li>
</ul>
<div class="callout"><span class="badge">Boring intervention wins</span> The best crowd managers act early and undramatically — closing a gate ten minutes early beats any emergency response that comes after a crush has already started.</div>`,
    `<span class="eyebrow">CDM201 · Chương 6 · Bài 6.1</span>
<h2>Quản lý trong sự kiện</h2>
<h3>Giám sát theo thời gian thực</h3>
<p>CCTV bao quát lối vào và điểm nghẽn, các điểm quan sát trên cao, và steward cầm radio đều nuôi một bức tranh mật độ đám đông liên tục cập nhật <em>suốt</em> sự kiện, không chỉ kiểm tra một lần ở cổng.</p>
<h3>Truyền thông với khán giả</h3>
<p>Thông báo qua loa PA, biển hiệu và màn hình số hiệu quả nhất khi hướng dẫn <strong>bình tĩnh, rõ ràng và được lặp lại</strong> — chỉ tăng âm lượng hiếm khi giảm bối rối, và thông báo nghe hoảng loạn có thể làm mọi thứ tệ hơn.</p>
<h3>Chỉ số cảnh báo sớm</h3>
<ul>
<li>Mật độ tăng vượt ngưỡng kế hoạch tại một điểm cụ thể.</li>
<li>Hàng chờ dồn lại thay vì giải tán.</li>
<li>Âm thanh hoặc tâm trạng đám đông thay đổi.</li>
<li>Báo cáo từ steward tại hiện trường, trước khi camera kịp thấy.</li>
</ul>
<div class="callout"><span class="badge">Can thiệp "nhàm chán" thắng</span> Người quản lý đám đông giỏi nhất hành động sớm và không ồn ào — đóng cổng sớm 10 phút tốt hơn bất kỳ ứng phó khẩn cấp nào sau khi chen lấn đã bắt đầu.</div>`,
  ]]);

const c6q = quiz('cdm201-quiz-6', 'Quiz 6 — Live management|||Quiz 6 — Quản lý trong sự kiện', [
  { id: 'q1', question: 'Chỉ số cảnh báo sớm nào hữu ích nhất để can thiệp TRƯỚC khi chen lấn nguy hiểm xảy ra?', options: ['Số lượng vé bán trước sự kiện', 'Mật độ tăng vượt kế hoạch hoặc hàng chờ dồn lại tại một điểm', 'Thời tiết đẹp', 'Số lượng nhân viên bán hàng'], correctIndex: 1, explanation: 'Mật độ vượt ngưỡng hoặc hàng chờ dồn lại là dấu hiệu sớm cần hành động ngay, trước khi có chen lấn thật.' },
  { id: 'q2', question: 'Khi truyền thông với khán giả trong sự kiện, nguyên tắc quan trọng nhất là gì?', options: ['Tăng âm lượng tối đa', 'Thông tin bình tĩnh, rõ ràng và lặp lại', 'Chỉ thông báo một lần duy nhất', 'Dùng thuật ngữ chuyên môn để chuyên nghiệp'], correctIndex: 1, explanation: 'Thông báo bình tĩnh, rõ ràng, lặp lại giảm bối rối hiệu quả hơn việc chỉ tăng âm lượng.' },
  { id: 'q3', question: '"Can thiệp sớm và nhàm chán" (ví dụ đóng cổng sớm 10 phút) được xem là tốt hơn điều gì?', options: ['Tốt hơn việc không làm gì cả', 'Tốt hơn phải xử lý ứng phó khẩn cấp sau khi sự cố đã xảy ra', 'Tốt hơn việc bán thêm vé', 'Không có gì để so sánh'], correctIndex: 1, explanation: 'Ngăn chặn sớm rẻ và an toàn hơn rất nhiều so với ứng phó khẩn cấp sau khi chen lấn đã bắt đầu.' },
]);

const c7 = doc('cdm201-7-1-emergency-evacuation', '7.1 — Emergency response & evacuation|||7.1 — Ứng phó khẩn cấp & sơ tán',
  'Thành phần kế hoạch khẩn cấp; sơ tán toàn phần vs theo giai đoạn vs invacuation; thời gian sơ tán mục tiêu phải được kiểm thử.',
  [[
    `<span class="eyebrow">CDM201 · Chapter 7 · Lesson 7.1</span>
<h2>Emergency response &amp; evacuation</h2>
<h3>Emergency plan components</h3>
<p>A workable plan names: who has the authority to trigger it, how the evacuate-vs-invacuate decision gets made, each role's responsibilities, muster/assembly points, and pre-written communication scripts so no one is improvising wording during a crisis.</p>
<h3>Evacuation strategies</h3>
<ul>
<li><strong>Full evacuation</strong> — clear the entire site; used for structural or fire threats that affect everyone.</li>
<li><strong>Phased/partial evacuation</strong> — clear only the affected zone first, common in stadiums, to avoid triggering mass panic everywhere at once.</li>
<li><strong>Invacuation (shelter-in-place)</strong> — keep people inside or in place when the outside is more dangerous, e.g. an external threat or severe weather.</li>
</ul>
<h3>Target evacuation time</h3>
<p>Venues are designed so the calculated evacuation time (people ÷ effective exit flow rate) stays under a target window — commonly a few minutes, depending on venue type per Purple Guide-style guidance. This number must be <strong>tested</strong>, never assumed.</p>
<div class="callout"><span class="badge">Time-critical, named owner</span> The decision to evacuate or invacuate belongs to a specific, trained decision-maker known in advance — ambiguity about who decides is itself a hazard.</div>`,
    `<span class="eyebrow">CDM201 · Chương 7 · Bài 7.1</span>
<h2>Ứng phó khẩn cấp &amp; sơ tán</h2>
<h3>Thành phần của kế hoạch khẩn cấp</h3>
<p>Một kế hoạch khả dụng phải ghi rõ: ai có thẩm quyền kích hoạt, quyết định sơ tán hay giữ tại chỗ (invacuation) được đưa ra thế nào, trách nhiệm của từng vai trò, điểm tập kết, và các kịch bản thông báo được viết sẵn để không ai phải ứng biến câu chữ giữa khủng hoảng.</p>
<h3>Chiến lược sơ tán</h3>
<ul>
<li><strong>Sơ tán toàn phần</strong> — dọn sạch toàn bộ địa điểm; dùng cho mối đe doạ kết cấu hoặc cháy ảnh hưởng tất cả mọi người.</li>
<li><strong>Sơ tán theo giai đoạn/từng phần</strong> — chỉ dọn khu vực bị ảnh hưởng trước, phổ biến ở sân vận động, để tránh gây hoảng loạn dồn toàn bộ đám đông ra cùng lúc.</li>
<li><strong>Invacuation (giữ tại chỗ)</strong> — giữ người ở trong/tại chỗ khi bên ngoài nguy hiểm hơn, vd mối đe doạ từ bên ngoài hoặc thời tiết cực đoan.</li>
</ul>
<h3>Thời gian sơ tán mục tiêu</h3>
<p>Địa điểm được thiết kế để thời gian sơ tán tính toán (số người ÷ lưu lượng thoát hiệu quả) nằm dưới một khung mục tiêu — thường vài phút, tuỳ loại địa điểm theo hướng dẫn kiểu Purple Guide. Con số này phải được <strong>kiểm thử thực tế</strong>, không bao giờ chỉ giả định.</p>
<div class="callout"><span class="badge">Cấp thiết về thời gian, có người chịu trách nhiệm</span> Quyết định sơ tán hay giữ tại chỗ thuộc về một người ra quyết định cụ thể, được huấn luyện và biết trước — sự mơ hồ về ai quyết định chính là một mối nguy.</div>`,
  ]]);

const c7q = quiz('cdm201-quiz-7', 'Quiz 7 — Emergency & evacuation|||Quiz 7 — Khẩn cấp & sơ tán', [
  { id: 'q1', question: '"Invacuation" (giữ người tại chỗ/trong nhà) được chọn khi nào?', options: ['Khi muốn tiết kiệm thời gian', 'Khi ở ngoài nguy hiểm hơn ở trong, vd mối đe doạ bên ngoài hoặc thời tiết cực đoan', 'Luôn được chọn thay cho sơ tán', 'Chỉ dùng cho sự kiện trong nhà'], correctIndex: 1, explanation: 'Invacuation phù hợp khi môi trường bên ngoài nguy hiểm hơn việc giữ người tại chỗ.' },
  { id: 'q2', question: 'Sơ tán theo giai đoạn (phased evacuation) khác sơ tán toàn phần ở điểm nào?', options: ['Không khác gì cả', 'Chỉ sơ tán khu vực bị ảnh hưởng trước, tránh dồn toàn bộ đám đông ra cùng lúc', 'Sơ tán theo giai đoạn nhanh hơn sơ tán toàn phần luôn luôn', 'Sơ tán theo giai đoạn không cần điểm tập kết'], correctIndex: 1, explanation: 'Phased evacuation ưu tiên khu vực nguy hiểm trước để tránh hoảng loạn lan rộng không cần thiết.' },
  { id: 'q3', question: 'Thời gian sơ tán mục tiêu của một địa điểm nên được xác định như thế nào?', options: ['Ước lượng cảm tính của ban tổ chức', 'Tính toán và kiểm thử thực tế dựa trên số người và lưu lượng thoát hiệu quả', 'Luôn cố định 5 phút cho mọi địa điểm', 'Không cần xác định trước, xử lý khi có sự cố'], correctIndex: 1, explanation: 'Thời gian sơ tán phải được tính toán và kiểm thử thực tế, không phải con số giả định hay cố định chung.' },
]);

const c8 = doc('cdm201-8-1-tech-case-studies', '8.1 — Technology & incident case studies|||8.1 — Công nghệ & bài học sự cố thực tế',
  'Đếm đám đông & mô phỏng (MassMotion/Vadere); Hillsborough 1989, Love Parade 2010, Itaewon 2022 — điểm chung: pinch point + thiếu người quyết định.',
  [[
    `<span class="eyebrow">CDM201 · Chapter 8 · Lesson 8.1</span>
<h2>Technology &amp; incident case studies</h2>
<h3>Technology in modern crowd management</h3>
<ul>
<li><strong>People counting</strong> — turnstile counters, CCTV with AI density estimation, Wi-Fi/Bluetooth device sensing, drone overwatch.</li>
<li><strong>Simulation</strong> — agent-based tools like MassMotion or the open-source Vadere model flow and bottlenecks <em>before</em> the event, testing "what if" scenarios on paper instead of on a live crowd.</li>
<li><strong>Real-time dashboards</strong> combining density readings, queue length, and steward reports for the Silver Commander to act on.</li>
</ul>
<h3>Case studies — the recurring lesson</h3>
<ul>
<li><strong>Hillsborough (1989, UK)</strong> — overcrowding in fenced stadium pens plus poor communication between police and stadium management → 97 deaths; led to the Taylor Report and modern UK stadium safety law.</li>
<li><strong>Love Parade, Duisburg (2010, Germany)</strong> — a single narrow tunnel as the only entry/exit for a huge crowd, with no capacity limit enforced → 21 deaths; a textbook pinch-point failure.</li>
<li><strong>Itaewon (2022, South Korea)</strong> — a narrow sloped alley, no official crowd management plan for an unticketed street gathering, density estimated well past 4 people/m² → 159 deaths; a reminder that free, unticketed public events need planning too.</li>
</ul>
<div class="callout"><span class="badge">The common thread</span> All three had an identified pinch point and no one accountable for closing it before density crossed the danger line. Technology helps you SEE the density in time — it is not a substitute for a plan and a named decision-maker.</div>`,
    `<span class="eyebrow">CDM201 · Chương 8 · Bài 8.1</span>
<h2>Công nghệ &amp; bài học sự cố thực tế</h2>
<h3>Công nghệ trong quản lý đám đông hiện đại</h3>
<ul>
<li><strong>Đếm đám đông</strong> — bộ đếm cổng xoay, CCTV với ước lượng mật độ bằng AI, cảm biến thiết bị qua Wi-Fi/Bluetooth, drone quan sát từ trên cao.</li>
<li><strong>Mô phỏng</strong> — công cụ theo tác tử như MassMotion hay Vadere mã nguồn mở, mô hình hoá luồng di chuyển và điểm nghẽn <em>trước</em> sự kiện, thử các kịch bản "nếu như" trên giấy thay vì trên đám đông thật.</li>
<li><strong>Bảng điều khiển thời gian thực</strong> kết hợp số liệu mật độ, độ dài hàng chờ, và báo cáo steward để Silver Commander hành động.</li>
</ul>
<h3>Case study — bài học lặp lại</h3>
<ul>
<li><strong>Hillsborough (1989, Anh)</strong> — quá tải trong các khu vực rào chắn sân vận động, cộng với liên lạc kém giữa cảnh sát và ban quản lý sân → 97 người chết; dẫn đến Báo cáo Taylor và luật an toàn sân vận động hiện đại của Anh.</li>
<li><strong>Love Parade, Duisburg (2010, Đức)</strong> — một đường hầm hẹp duy nhất là lối vào/ra cho một đám đông khổng lồ, không giới hạn sức chứa được thực thi → 21 người chết; một lỗi điểm nghẽn kinh điển.</li>
<li><strong>Itaewon (2022, Hàn Quốc)</strong> — một con hẻm dốc hẹp, không có kế hoạch quản lý đám đông chính thức cho một sự kiện đường phố không bán vé, mật độ ước tính vượt xa 4 người/m² → 159 người chết; nhắc rằng sự kiện công cộng miễn phí, không bán vé vẫn cần được lập kế hoạch.</li>
</ul>
<div class="callout"><span class="badge">Điểm chung</span> Cả ba đều có một điểm nghẽn đã biết trước và không ai chịu trách nhiệm đóng nó lại trước khi mật độ vượt ngưỡng nguy hiểm. Công nghệ giúp bạn NHÌN THẤY mật độ kịp thời — nó không thay thế được một kế hoạch và một người ra quyết định được chỉ định rõ.</div>`,
  ]]);

const c8q = quiz('cdm201-quiz-8', 'Quiz 8 — Technology & case studies|||Quiz 8 — Công nghệ & bài học sự cố', [
  { id: 'q1', question: 'Điểm chung của các thảm hoạ đám đông Hillsborough, Love Parade và Itaewon là gì?', options: ['Cả ba đều xảy ra ở sân vận động có bán vé', 'Đều có điểm nghẽn đã biết trước và thiếu người có thẩm quyền can thiệp kịp thời', 'Cả ba đều do thời tiết xấu gây ra', 'Cả ba đều không có đám đông đông thực sự'], correctIndex: 1, explanation: 'Cả ba sự cố đều có pinch point đã biết trước cộng với việc không ai can thiệp kịp thời trước khi mật độ vượt ngưỡng nguy hiểm.' },
  { id: 'q2', question: 'Công nghệ mô phỏng đám đông (như MassMotion/Vadere) được dùng để làm gì?', options: ['Thay thế hoàn toàn việc lập kế hoạch an toàn', 'Kiểm thử luồng di chuyển/điểm nghẽn TRƯỚC khi sự kiện diễn ra', 'Chỉ dùng để trang trí bài thuyết trình', 'Chỉ áp dụng được sau khi sự kiện kết thúc'], correctIndex: 1, explanation: 'Mô phỏng theo tác tử cho phép thử các kịch bản "nếu như" trước khi có đám đông thật, giúp phát hiện điểm nghẽn sớm.' },
  { id: 'q3', question: 'Sự cố Itaewon 2022 cho thấy điều gì về việc lập kế hoạch quản lý đám đông?', options: ['Chỉ địa điểm có bán vé mới cần kế hoạch quản lý đám đông', 'Sự kiện công cộng không bán vé/không chính thức cũng cần kế hoạch quản lý đám đông', 'Không cần lập kế hoạch nếu đám đông tự phát', 'Công nghệ CCTV là đủ để phòng ngừa mọi thảm hoạ'], correctIndex: 1, explanation: 'Itaewon là một sự kiện đường phố tự phát, không bán vé — cho thấy quản lý đám đông cần áp dụng rộng hơn chỉ các địa điểm chính thức.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CDM201',
    slug: 'cdm201-crowd-management',
    title: 'Crowd Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CDM201.webp',
    shortDescription: 'Event crowd management: crowd science, density & flow, risk assessment, space design, security coordination, live monitoring, emergency evacuation, tech & real incidents. Based on the HSE Purple Guide, G. Keith Still & Fruin.|||Quản lý đám đông sự kiện: khoa học đám đông, mật độ & luồng di chuyển, đánh giá rủi ro, thiết kế không gian, phối hợp an ninh, giám sát trực tiếp, ứng phó khẩn cấp, công nghệ & sự cố thực tế. Dựa trên Purple Guide, G. Keith Still & Fruin.',
    description: 'Môn <strong>CDM201 — Crowd Management</strong> (kỳ 4, khối Quản trị Kinh doanh) trang bị kỹ năng lập kế hoạch, vận hành và bảo đảm an toàn cho sự kiện, du lịch và khách sạn nơi đông người tập trung. Từ <strong>khoa học đám đông</strong> (G. Keith Still) → <strong>động lực học mật độ &amp; luồng di chuyển</strong> → <strong>đánh giá rủi ro</strong> (Purple Guide/HSE) → <strong>thiết kế không gian &amp; lối vào/ra</strong> → <strong>phối hợp an ninh &amp; các bên liên quan</strong> → <strong>quản lý trực tiếp tại sự kiện</strong> → <strong>ứng phó khẩn cấp &amp; sơ tán</strong> → <strong>công nghệ &amp; bài học từ các sự cố thực tế</strong> (Hillsborough, Love Parade, Itaewon). Song ngữ, có quiz mỗi chương.',
    whatYouLearn: 'Khoa học đám đông & các loại đám đông; mật độ/tốc độ/lưu lượng & ngưỡng "crowd crush"; quy trình đánh giá rủi ro & ma trận rủi ro; thiết kế lối vào/ra & sức chứa theo điểm nghẽn; mô hình chỉ huy Gold-Silver-Bronh & kiểm soát ra vào; giám sát trực tiếp & chỉ số cảnh báo sớm; chiến lược sơ tán/invacuation & thời gian sơ tán mục tiêu; công nghệ đếm/mô phỏng đám đông & bài học từ các sự cố thực tế.',
    requirements: 'Không yêu cầu kiến thức chuyên ngành trước. Phù hợp với sinh viên Quản trị Kinh doanh, Du lịch/Khách sạn, hoặc bất kỳ ai quan tâm tổ chức sự kiện an toàn.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Purple Guide, G. Keith Still, Fruin, tài liệu chính thức, YouTube, công cụ mô phỏng, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Quản lý đám đông là gì, vì sao quan trọng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & khoa học đám đông|||Chapter 1 — Overview & crowd science', description: 'Định nghĩa, khoa học đám đông, các loại đám đông.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Động lực học & mật độ|||Chapter 2 — Dynamics & density', description: 'Mật độ, tốc độ, lưu lượng, sụp đổ đám đông tiến triển.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đánh giá rủi ro sự kiện|||Chapter 3 — Event risk assessment', description: 'Quy trình 5 bước, ma trận rủi ro, Event Safety Plan.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Lập kế hoạch & thiết kế không gian|||Chapter 4 — Planning & space design', description: 'Sức chứa, điểm nghẽn, lối vào/ra, hàng rào định tuyến.', lessons: [c4, c4q] },
    { title: 'Chương 5 — An ninh & phối hợp lực lượng|||Chapter 5 — Security & coordination', description: 'Các bên liên quan, Gold-Silver-Bronze, kiểm soát ra vào.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quản lý trong sự kiện|||Chapter 6 — Managing the live event', description: 'Giám sát trực tiếp, truyền thông, cảnh báo sớm.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Ứng phó khẩn cấp & sơ tán|||Chapter 7 — Emergency response & evacuation', description: 'Kế hoạch khẩn cấp, sơ tán/invacuation, thời gian mục tiêu.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Công nghệ & bài học sự cố thực tế|||Chapter 8 — Technology & case studies', description: 'Đếm/mô phỏng đám đông, Hillsborough, Love Parade, Itaewon.', lessons: [c8, c8q] },
  ],
};
