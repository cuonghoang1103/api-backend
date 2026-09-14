/**
 * ERM301c — Entertainment and Event Risk Management. Giáo trình FLM
 * (syl): quản lý rủi ro sự kiện theo ISO 31000 — nhận diện, đánh giá (ma
 * trận), xử lý, an toàn đám đông, an ninh & bảo hiểm, kế hoạch khẩn cấp,
 * quản lý khủng hoảng & pháp lý. Trích: Silvers "Risk Management for
 * Events"; HSE "The Purple Guide"; Tarlow "Event Risk Management and
 * Safety"; ISO 31000. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('erm301c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách chính (kèm link), chuẩn ISO 31000, hướng dẫn chính thức HSE/quốc tế, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ERM301c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn event risk management — identification, assessment, treatment, crowd safety, security and crisis response — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are the reference texts and free, legal resources this course draws on.</p>
<h3>📗 Core reference books</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Risk+Management+for+Meetings+and+Events" target="_blank" rel="noopener">Julia Rutherford Silvers — <em>Risk Management for Meetings and Events</em></a> — the main framework this course follows: risk identification, assessment and treatment applied end-to-end to events.</li>
<li><a href="https://www.routledge.com/Event-Risk-Management-and-Safety/Tarlow/p/book/9780471401681" target="_blank" rel="noopener">Peter Tarlow — <em>Event Risk Management and Safety</em></a> — security, crowd behaviour and safety planning for events.</li>
</ul>
<h3>🌐 Official standards &amp; guidance (free)</h3>
<ul>
<li><a href="https://www.iso.org/standard/65694.html" target="_blank" rel="noopener">ISO 31000:2018 — Risk management — Guidelines</a> — the international risk-management standard referenced throughout this course.</li>
<li><a href="https://www.thepurpleguide.co.uk/" target="_blank" rel="noopener">HSE-endorsed — <em>The Purple Guide</em> (thepurpleguide.co.uk)</a> — the UK's de-facto standard for health, safety and welfare at events; free chapters online, including crowd management and medical planning.</li>
<li><a href="https://www.hse.gov.uk/event-safety/" target="_blank" rel="noopener">HSE (Health and Safety Executive) — Event safety</a> — official UK guidance on organiser duties and event safety planning.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@CrowdSafety" target="_blank" rel="noopener">Crowd Safety channels &amp; conference talks</a> — search "crowd management" and "event risk assessment" for case studies from real festivals and stadiums.</li>
<li><a href="https://www.youtube.com/results?search_query=event+risk+management+case+study" target="_blank" rel="noopener">Event risk management case studies</a> — post-incident reviews are the fastest way to see the theory fail (or hold) in practice.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>A blank <strong>risk register</strong> (spreadsheet: hazard, likelihood, impact, score, owner, mitigation, status) — the single most useful artifact in this course; build one for every event you plan.</li>
<li>A <strong>5×5 risk matrix</strong> template (likelihood × impact) — used in Chapter 3 to turn a long risk list into a short priority list.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — ISO 31000 process, the four risk categories, the 5×5 risk matrix, the four treatment options (avoid/reduce/transfer/accept).</li>
<li><strong>Practice</strong> — build a risk register for a real event (a school festival, a concert, a sports day) and score every entry on the matrix.</li>
<li><strong>Go deeper</strong> — crowd safety density limits, security &amp; insurance, emergency and evacuation plans.</li>
<li><strong>Job-ready</strong> — read a real event safety plan (many are published by universities/cities online) and a post-incident report; compare both against this course's checklists.</li>
</ol></div>`,
    `<span class="eyebrow">ERM301c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học quản lý rủi ro sự kiện — nhận diện, đánh giá, xử lý, an toàn đám đông, an ninh và ứng phó khủng hoảng — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là sách gốc và nguồn miễn phí, hợp pháp mà môn này dựa vào.</p>
<h3>📗 Sách tham khảo chính</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Risk+Management+for+Meetings+and+Events" target="_blank" rel="noopener">Julia Rutherford Silvers — <em>Risk Management for Meetings and Events</em></a> — khung chính môn này bám theo: nhận diện, đánh giá và xử lý rủi ro áp dụng xuyên suốt cho sự kiện.</li>
<li><a href="https://www.routledge.com/Event-Risk-Management-and-Safety/Tarlow/p/book/9780471401681" target="_blank" rel="noopener">Peter Tarlow — <em>Event Risk Management and Safety</em></a> — an ninh, hành vi đám đông và lập kế hoạch an toàn cho sự kiện.</li>
</ul>
<h3>🌐 Chuẩn &amp; hướng dẫn chính thức (miễn phí)</h3>
<ul>
<li><a href="https://www.iso.org/standard/65694.html" target="_blank" rel="noopener">ISO 31000:2018 — Quản lý rủi ro — Hướng dẫn</a> — chuẩn quản lý rủi ro quốc tế được dùng xuyên suốt môn học.</li>
<li><a href="https://www.thepurpleguide.co.uk/" target="_blank" rel="noopener">HSE công nhận — <em>The Purple Guide</em> (thepurpleguide.co.uk)</a> — chuẩn thực tế của Anh về an toàn, sức khoẻ và phúc lợi tại sự kiện; có chương miễn phí trực tuyến, gồm quản lý đám đông và kế hoạch y tế.</li>
<li><a href="https://www.hse.gov.uk/event-safety/" target="_blank" rel="noopener">HSE (Health and Safety Executive) — An toàn sự kiện</a> — hướng dẫn chính thức của Anh về trách nhiệm ban tổ chức và lập kế hoạch an toàn sự kiện.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@CrowdSafety" target="_blank" rel="noopener">Kênh &amp; hội thảo về an toàn đám đông</a> — tìm "crowd management" và "event risk assessment" để xem ca thực tế từ lễ hội và sân vận động.</li>
<li><a href="https://www.youtube.com/results?search_query=event+risk+management+case+study" target="_blank" rel="noopener">Ca thực tế quản lý rủi ro sự kiện</a> — báo cáo hậu sự cố là cách nhanh nhất để thấy lý thuyết đứng vững hay gãy trong thực tế.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><strong>Sổ đăng ký rủi ro (risk register)</strong> trống (bảng tính: hiểm hoạ, khả năng, tác động, điểm số, người phụ trách, biện pháp, trạng thái) — sản phẩm hữu ích nhất của môn này; dựng một bản cho mọi sự kiện bạn lên kế hoạch.</li>
<li>Mẫu <strong>ma trận rủi ro 5×5</strong> (khả năng × tác động) — dùng ở Chương 3 để biến danh sách rủi ro dài thành danh sách ưu tiên ngắn.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — quy trình ISO 31000, bốn nhóm rủi ro, ma trận rủi ro 5×5, bốn phương án xử lý (tránh/giảm/chuyển/chấp nhận).</li>
<li><strong>Luyện tập</strong> — dựng sổ đăng ký rủi ro cho một sự kiện thật (hội trại trường, buổi hoà nhạc, ngày hội thể thao) và chấm điểm từng mục trên ma trận.</li>
<li><strong>Đào sâu thực tế</strong> — giới hạn mật độ an toàn đám đông, an ninh &amp; bảo hiểm, kế hoạch khẩn cấp và sơ tán.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc một kế hoạch an toàn sự kiện thật (nhiều trường/thành phố công bố online) và một báo cáo hậu sự cố; đối chiếu với các checklist của môn này.</li>
</ol></div>`,
  ]]);

const intro = doc('erm301c-0-1-overview', 'Course overview: Entertainment & Event Risk Management|||Tổng quan: Quản lý rủi ro Giải trí & Sự kiện',
  'Vì sao sự kiện cần quản lý rủi ro riêng; quy trình ISO 31000; lộ trình môn: nhận diện → đánh giá (ma trận) → xử lý → an toàn đám đông → an ninh/bảo hiểm → khẩn cấp/sơ tán → khủng hoảng/pháp lý.',
  [[
    `<span class="eyebrow">ERM301c · Lesson 0.1 · Overview</span>
<h2>Entertainment &amp; Event Risk Management</h2>
<p class="lead">A concert, a festival, a sports final or a company gala all share one trait: a <strong>temporary crowd, in a temporary layout, under a hard deadline</strong>. That combination creates risk that a permanent venue rarely faces — and it is why events get their own discipline of risk management, built on the general <strong>ISO 31000</strong> standard but sharpened for crowds, weather, contractors and a show that must go on (or must stop) on schedule.</p>
<h3>The ISO 31000 risk process</h3>
<ul>
<li><strong>Establish context</strong> — the event, the venue, the audience, the objectives.</li>
<li><strong>Identify</strong> — what could go wrong, across every category (Chapter 2).</li>
<li><strong>Assess</strong> — how likely, how severe — the risk matrix (Chapter 3).</li>
<li><strong>Treat</strong> — avoid, reduce, transfer or accept each risk (Chapter 4).</li>
<li><strong>Monitor &amp; review</strong> — before, during and after the event; every incident feeds the next event's risk register.</li>
</ul>
<h3>Roadmap</h3>
<p>Overview &amp; ISO 31000 (this lesson) → risk identification (safety, financial, reputational, crowd) → risk assessment &amp; the risk matrix → treatment options → crowd safety &amp; medical planning → security, terrorism &amp; insurance → emergency &amp; evacuation planning → crisis management, legal &amp; compliance.</p>
<div class="callout"><span class="badge">Why events are different</span> A factory's risks are mostly stable year to year. An event's risk profile is rebuilt from near-zero every single time — new venue, new crowd size, new weather, new date — which is exactly why the process matters more than any single checklist.</div>`,
    `<span class="eyebrow">ERM301c · Bài 0.1 · Tổng quan</span>
<h2>Quản lý rủi ro Giải trí &amp; Sự kiện</h2>
<p class="lead">Một buổi hoà nhạc, một lễ hội, một trận chung kết thể thao hay một gala công ty đều có một điểm chung: <strong>đám đông tạm thời, bố trí tạm thời, dưới một hạn chót cứng</strong>. Sự kết hợp đó tạo ra rủi ro mà một địa điểm cố định hiếm khi gặp — và đó là lý do sự kiện có một môn quản lý rủi ro riêng, dựng trên chuẩn <strong>ISO 31000</strong> nói chung nhưng mài sắc cho đám đông, thời tiết, nhà thầu và một buổi diễn phải diễn ra (hoặc phải dừng) đúng giờ.</p>
<h3>Quy trình rủi ro ISO 31000</h3>
<ul>
<li><strong>Xác lập bối cảnh</strong> — sự kiện, địa điểm, khán giả, mục tiêu.</li>
<li><strong>Nhận diện</strong> — điều gì có thể sai, ở mọi nhóm rủi ro (Chương 2).</li>
<li><strong>Đánh giá</strong> — khả năng xảy ra, mức độ nghiêm trọng — ma trận rủi ro (Chương 3).</li>
<li><strong>Xử lý</strong> — tránh, giảm, chuyển hoặc chấp nhận từng rủi ro (Chương 4).</li>
<li><strong>Giám sát &amp; rà soát</strong> — trước, trong và sau sự kiện; mỗi sự cố nạp lại sổ rủi ro cho sự kiện kế tiếp.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; ISO 31000 (bài này) → nhận diện rủi ro (an toàn, tài chính, danh tiếng, đám đông) → đánh giá rủi ro &amp; ma trận → phương án xử lý → an toàn đám đông &amp; kế hoạch y tế → an ninh, khủng bố &amp; bảo hiểm → kế hoạch khẩn cấp &amp; sơ tán → quản lý khủng hoảng, pháp lý &amp; tuân thủ.</p>
<div class="callout"><span class="badge">Vì sao sự kiện khác biệt</span> Rủi ro của một nhà máy khá ổn định qua từng năm. Hồ sơ rủi ro của một sự kiện thì gần như dựng lại từ đầu mỗi lần — địa điểm mới, quy mô đám đông mới, thời tiết mới, ngày mới — và đó chính là lý do quy trình quan trọng hơn bất kỳ checklist đơn lẻ nào.</div>`,
  ]]);

const c1 = doc('erm301c-1-1-overview-iso31000', '1.1 — Event risk management overview & ISO 31000|||1.1 — Tổng quan quản lý rủi ro sự kiện & ISO 31000',
  'Định nghĩa rủi ro sự kiện; nguyên tắc & khung ISO 31000 (lãnh đạo, tích hợp, quy trình liên tục); vai trò của risk register; trách nhiệm của ban tổ chức.',
  [[
    `<span class="eyebrow">ERM301c · Chapter 1 · Lesson 1.1</span>
<h2>Event risk management overview &amp; ISO 31000</h2>
<h3>What "risk" means for an event</h3>
<p><strong>Risk</strong> is the effect of uncertainty on the event's objectives — not just "something bad happening", but anything that could push the outcome away from what was planned, good or bad. Event risk management is the disciplined process of finding those uncertainties early enough to do something about them, rather than discovering them live in front of an audience.</p>
<h3>ISO 31000 principles applied to events</h3>
<ul>
<li><strong>Leadership &amp; commitment</strong> — risk management is owned by the event director, not delegated to a single "safety officer" working alone.</li>
<li><strong>Integrated</strong> — risk is part of every planning decision (venue, ticketing, staging, vendors), not a separate document written at the end.</li>
<li><strong>Structured &amp; continual</strong> — the same identify → assess → treat → review cycle repeats at every planning milestone, not once.</li>
<li><strong>Best available information</strong> — past incident reports, weather data, crowd counts and vendor history all feed the process.</li>
</ul>
<h3>The risk register</h3>
<p>The single working document of this whole course is the <strong>risk register</strong>: every identified risk, its likelihood and impact score, the chosen treatment, the owner responsible, and its current status. It starts in Chapter 2 and gets scored (Chapter 3), treated (Chapter 4) and referenced in every later chapter.</p>
<pre><code>Risk register — minimum columns:
 ID | Risk description | Category | Likelihood | Impact | Score | Treatment | Owner | Status
</code></pre>
<div class="callout"><span class="badge">Who owns risk</span> Under ISO 31000, risk ownership sits with the person who makes the decision that creates the risk — the event director for the overall plan, but a named owner for each specific line in the register (e.g. the stage manager owns rigging risk).</div>`,
    `<span class="eyebrow">ERM301c · Chương 1 · Bài 1.1</span>
<h2>Tổng quan quản lý rủi ro sự kiện &amp; ISO 31000</h2>
<h3>"Rủi ro" nghĩa là gì với một sự kiện</h3>
<p><strong>Rủi ro</strong> là tác động của sự không chắc chắn lên mục tiêu của sự kiện — không chỉ là "có điều gì tồi tệ xảy ra", mà là bất cứ điều gì có thể đẩy kết quả lệch khỏi kế hoạch, tốt hoặc xấu. Quản lý rủi ro sự kiện là quy trình có kỷ luật để tìm ra những bất định đó đủ sớm để xử lý, thay vì phát hiện chúng ngay trước khán giả.</p>
<h3>Nguyên tắc ISO 31000 áp vào sự kiện</h3>
<ul>
<li><strong>Lãnh đạo &amp; cam kết</strong> — quản lý rủi ro do giám đốc sự kiện làm chủ, không giao hết cho một "cán bộ an toàn" làm một mình.</li>
<li><strong>Tích hợp</strong> — rủi ro là một phần của mọi quyết định lập kế hoạch (địa điểm, bán vé, dựng sân khấu, nhà thầu), không phải một tài liệu riêng viết sau cùng.</li>
<li><strong>Có cấu trúc &amp; liên tục</strong> — cùng vòng nhận diện → đánh giá → xử lý → rà soát lặp lại ở mọi cột mốc lập kế hoạch, không chỉ một lần.</li>
<li><strong>Thông tin tốt nhất sẵn có</strong> — báo cáo sự cố cũ, dữ liệu thời tiết, số liệu đám đông và lịch sử nhà thầu đều nạp vào quy trình.</li>
</ul>
<h3>Sổ đăng ký rủi ro (risk register)</h3>
<p>Tài liệu làm việc duy nhất của toàn môn học là <strong>sổ đăng ký rủi ro</strong>: mọi rủi ro đã nhận diện, điểm khả năng và tác động, phương án xử lý đã chọn, người phụ trách và trạng thái hiện tại. Nó bắt đầu ở Chương 2, được chấm điểm (Chương 3), xử lý (Chương 4) và được dùng lại ở mọi chương sau.</p>
<pre><code>Sổ đăng ký rủi ro — cột tối thiểu:
 ID | Mô tả rủi ro | Nhóm | Khả năng | Tác động | Điểm | Xử lý | Người phụ trách | Trạng thái
</code></pre>
<div class="callout"><span class="badge">Ai làm chủ rủi ro</span> Theo ISO 31000, quyền làm chủ rủi ro thuộc về người ra quyết định tạo ra rủi ro đó — giám đốc sự kiện cho kế hoạch tổng thể, nhưng mỗi dòng cụ thể trong sổ có một người phụ trách riêng (vd quản lý sân khấu làm chủ rủi ro giàn treo).</div>`,
  ]]);

const c1q = quiz('erm301c-quiz-1', 'Quiz 1 — Overview & ISO 31000|||Quiz 1 — Tổng quan & ISO 31000', [
  { id: 'q1', question: 'Theo ISO 31000, rủi ro được định nghĩa là gì?', options: ['Bất kỳ tổn thất tài chính', 'Tác động của sự không chắc chắn lên mục tiêu', 'Sai sót của nhân viên', 'Thời tiết xấu'], correctIndex: 1, explanation: 'ISO 31000 định nghĩa rủi ro là tác động của sự không chắc chắn lên mục tiêu — có thể tốt hoặc xấu.' },
  { id: 'q2', question: 'Tài liệu làm việc trung tâm để theo dõi rủi ro sự kiện xuyên suốt môn học là?', options: ['Hợp đồng nhà tài trợ', 'Sổ đăng ký rủi ro (risk register)', 'Kịch bản chương trình', 'Danh sách khách VIP'], correctIndex: 1, explanation: 'Risk register ghi mô tả, khả năng, tác động, điểm số, phương án xử lý và người phụ trách cho từng rủi ro.' },
  { id: 'q3', question: 'Theo nguyên tắc "tích hợp" của ISO 31000, rủi ro nên được xử lý khi nào?', options: ['Chỉ sau khi sự kiện kết thúc', 'Là một tài liệu riêng viết sau cùng', 'Là một phần của mọi quyết định lập kế hoạch', 'Chỉ khi có sự cố xảy ra'], correctIndex: 2, explanation: 'Rủi ro phải tích hợp vào mọi quyết định (địa điểm, bán vé, sân khấu, nhà thầu), không tách riêng ra làm sau.' },
]);

const c2 = doc('erm301c-2-1-risk-identification', '2.1 — Risk identification: safety, financial, reputational, crowd|||2.1 — Nhận diện rủi ro: an toàn, tài chính, danh tiếng, đám đông',
  'Bốn nhóm rủi ro sự kiện chính; kỹ thuật nhận diện (kiểm tra hiện trường, brainstorm, dữ liệu sự cố cũ); ví dụ theo từng nhóm.',
  [[
    `<span class="eyebrow">ERM301c · Chapter 2 · Lesson 2.1</span>
<h2>Risk identification: safety, financial, reputational, crowd</h2>
<p>Before anything can be scored or treated, it has to be <strong>found</strong>. Most serious event failures trace back to a risk nobody wrote down — not one that was written down and mismanaged. Identification works best when it is done category by category, so nothing gets skipped because it "isn't the obvious one".</p>
<h3>Four core categories</h3>
<ul>
<li><strong>Safety</strong> — structural failure (stages, rigging, temporary seating), fire, electrical faults, weather (lightning, high wind on structures), slips/trips, food safety.</li>
<li><strong>Financial</strong> — low ticket sales, sponsor withdrawal, cost overruns, vendor non-payment or bankruptcy, currency/exchange exposure for international acts, cancellation without insurance.</li>
<li><strong>Reputational</strong> — a bad guest experience going viral, an artist's controversial behaviour, a poorly handled complaint, comparison to a rival event, a sponsor's brand being embarrassed.</li>
<li><strong>Crowd</strong> — overcrowding at chokepoints, crowd surge/crush, queue rage, alcohol-related incidents, lost/separated children, a crowd reacting badly to a delay or cancellation.</li>
</ul>
<h3>How to actually find risks</h3>
<ol>
<li><strong>Site walk-through</strong> — walk the venue as if you were an attendee, a performer, and an ambulance crew; each role sees different hazards.</li>
<li><strong>Structured brainstorm</strong> — bring every department head (production, security, ticketing, F&amp;B, marketing) into one session; risks hide at the boundaries between departments.</li>
<li><strong>Historical data</strong> — incident reports from this event's past editions, or from comparable events, are the single best predictor of what will go wrong again.</li>
</ol>
<div class="callout"><span class="badge">Common trap</span> Teams over-identify safety risks (they are visible and dramatic) and under-identify financial and reputational risks (they are slow-moving and boring) — yet a cancelled event for financial reasons hurts just as much as an injury does, only later.</div>`,
    `<span class="eyebrow">ERM301c · Chương 2 · Bài 2.1</span>
<h2>Nhận diện rủi ro: an toàn, tài chính, danh tiếng, đám đông</h2>
<p>Trước khi chấm điểm hay xử lý được gì, rủi ro phải được <strong>tìm ra</strong> trước. Hầu hết thất bại nghiêm trọng của sự kiện bắt nguồn từ một rủi ro không ai viết ra — không phải từ một rủi ro đã viết ra nhưng xử lý dở. Nhận diện hiệu quả nhất khi làm theo từng nhóm, để không có gì bị bỏ sót vì "nghe không giống rủi ro rõ ràng".</p>
<h3>Bốn nhóm rủi ro chính</h3>
<ul>
<li><strong>An toàn</strong> — sập kết cấu (sân khấu, giàn treo, khán đài tạm), cháy, sự cố điện, thời tiết (sét, gió lớn lên kết cấu), trơn/vấp ngã, an toàn thực phẩm.</li>
<li><strong>Tài chính</strong> — bán vé thấp, nhà tài trợ rút lui, vượt chi phí, nhà thầu không thanh toán hoặc phá sản, rủi ro tỉ giá cho nghệ sĩ quốc tế, hủy sự kiện mà không có bảo hiểm.</li>
<li><strong>Danh tiếng</strong> — trải nghiệm khách tệ lan truyền, hành vi gây tranh cãi của nghệ sĩ, xử lý khiếu nại kém, bị so sánh với sự kiện đối thủ, thương hiệu nhà tài trợ bị bẽ mặt.</li>
<li><strong>Đám đông</strong> — quá tải tại điểm nghẽn, chèn ép/dồn ép đám đông, xếp hàng bức xúc, sự cố liên quan bia rượu, trẻ em lạc/tách nhóm, đám đông phản ứng xấu với việc trễ giờ hoặc hủy.</li>
</ul>
<h3>Cách thực sự tìm ra rủi ro</h3>
<ol>
<li><strong>Đi khảo sát hiện trường</strong> — đi qua địa điểm như một khách tham dự, một người biểu diễn, và một tổ cấp cứu; mỗi vai trò thấy hiểm hoạ khác nhau.</li>
<li><strong>Brainstorm có cấu trúc</strong> — mời mọi trưởng bộ phận (sản xuất, an ninh, bán vé, ẩm thực, marketing) vào một buổi họp; rủi ro thường ẩn ở ranh giới giữa các bộ phận.</li>
<li><strong>Dữ liệu lịch sử</strong> — báo cáo sự cố từ các kỳ trước của chính sự kiện này, hoặc từ sự kiện tương tự, là chỉ báo tốt nhất cho điều sẽ lại sai.</li>
</ol>
<div class="callout"><span class="badge">Bẫy thường gặp</span> Các nhóm hay nhận diện quá nhiều rủi ro an toàn (dễ thấy, kịch tính) và quá ít rủi ro tài chính/danh tiếng (diễn biến chậm, kém nổi bật) — nhưng một sự kiện bị hủy vì lý do tài chính gây tổn hại không kém một ca chấn thương, chỉ là đến muộn hơn.</div>`,
  ]]);

const c2q = quiz('erm301c-quiz-2', 'Quiz 2 — Risk identification|||Quiz 2 — Nhận diện rủi ro', [
  { id: 'q1', question: 'Chèn ép/dồn ép đám đông tại điểm nghẽn thuộc nhóm rủi ro nào?', options: ['Tài chính', 'Danh tiếng', 'Đám đông', 'Pháp lý'], correctIndex: 2, explanation: 'Quá tải và chèn ép tại điểm nghẽn là rủi ro nhóm đám đông (crowd).' },
  { id: 'q2', question: 'Nhà tài trợ rút lui giữa lúc chuẩn bị sự kiện thuộc nhóm rủi ro nào?', options: ['An toàn', 'Tài chính', 'Đám đông', 'Không phải rủi ro'], correctIndex: 1, explanation: 'Mất nguồn tài trợ ảnh hưởng trực tiếp đến ngân sách — rủi ro tài chính.' },
  { id: 'q3', question: 'Nguồn thông tin nào được xem là chỉ báo tốt nhất cho việc gì sẽ lại sai ở một sự kiện?', options: ['Dự báo thời tiết 3 tháng trước', 'Báo cáo sự cố của các kỳ trước / sự kiện tương tự', 'Ý kiến trên mạng xã hội', 'Số lượng vé đã bán'], correctIndex: 1, explanation: 'Dữ liệu lịch sử (báo cáo sự cố cũ) là chỉ báo mạnh nhất cho rủi ro lặp lại.' },
]);

const c3 = doc('erm301c-3-1-risk-assessment-matrix', '3.1 — Risk assessment & prioritization (risk matrix)|||3.1 — Đánh giá & ưu tiên rủi ro (ma trận rủi ro)',
  'Chấm điểm khả năng & tác động; ma trận rủi ro 5x5; điểm rủi ro = khả năng x tác động; sắp xếp thứ tự ưu tiên xử lý.',
  [[
    `<span class="eyebrow">ERM301c · Chapter 3 · Lesson 3.1</span>
<h2>Risk assessment &amp; prioritization</h2>
<p>A long risk list is not useful on its own — a small team cannot treat forty risks equally well in the time before doors open. <strong>Assessment</strong> turns the list into a priority order by scoring each risk on two axes: how <strong>likely</strong> it is, and how <strong>severe</strong> its impact would be if it happened.</p>
<h3>The 5x5 risk matrix</h3>
<p>Score likelihood 1 (rare) to 5 (almost certain), and impact 1 (negligible) to 5 (catastrophic). Multiply the two for a <strong>risk score</strong> from 1 to 25 — this is the standard tool from Silvers' framework and mirrors the ISO 31000 assessment step.</p>
<pre><code>Risk matrix (Likelihood x Impact = Score)
                 Impact 1   Impact 2   Impact 3   Impact 4   Impact 5
Likelihood 1        1          2          3          4          5
Likelihood 2        2          4          6          8         10
Likelihood 3        3          6          9         12         15
Likelihood 4        4          8         12         16         20
Likelihood 5        5         10         15         20         25

Bands:  1-4 Low  |  5-9 Medium  |  10-14 High  |  15-25 Extreme
</code></pre>
<h3>Worked example</h3>
<p>"Rain causes a slip on the wet stage ramp": likelihood 4 (rain is forecast, ramp is used constantly) x impact 3 (a fall could injure a crew member, not the whole crowd) = score 12, band <strong>High</strong> — this goes near the top of the treatment queue in Chapter 4, above lower-scoring risks even if they feel more dramatic.</p>
<div class="callout"><span class="badge">Score, don't guess in your head</span> Writing the two numbers down — instead of ranking risks by gut feeling — is what lets two different people (production and security) agree on what gets fixed first, using the same register.</div>`,
    `<span class="eyebrow">ERM301c · Chương 3 · Bài 3.1</span>
<h2>Đánh giá &amp; ưu tiên rủi ro</h2>
<p>Một danh sách rủi ro dài không có nhiều tác dụng tự nó — một nhóm nhỏ không thể xử lý ngang nhau bốn mươi rủi ro trong thời gian trước khi mở cổng. <strong>Đánh giá</strong> biến danh sách thành thứ tự ưu tiên bằng cách chấm điểm từng rủi ro trên hai trục: <strong>khả năng</strong> xảy ra, và <strong>mức độ nghiêm trọng</strong> nếu nó xảy ra.</p>
<h3>Ma trận rủi ro 5x5</h3>
<p>Chấm khả năng từ 1 (hiếm) đến 5 (gần như chắc chắn), và tác động từ 1 (không đáng kể) đến 5 (thảm khốc). Nhân hai số để ra <strong>điểm rủi ro</strong> từ 1 đến 25 — đây là công cụ chuẩn theo khung của Silvers và song hành với bước đánh giá trong ISO 31000.</p>
<pre><code>Ma trận rủi ro (Khả năng x Tác động = Điểm)
                 Tác động 1  Tác động 2  Tác động 3  Tác động 4  Tác động 5
Khả năng 1           1           2           3           4           5
Khả năng 2           2           4           6           8          10
Khả năng 3           3           6           9          12          15
Khả năng 4           4           8          12          16          20
Khả năng 5           5          10          15          20          25

Mức: 1-4 Thấp  |  5-9 Trung bình  |  10-14 Cao  |  15-25 Rất cao
</code></pre>
<h3>Ví dụ tính toán</h3>
<p>"Mưa làm trơn dốc dẫn lên sân khấu": khả năng 4 (có dự báo mưa, dốc được dùng liên tục) x tác động 3 (té ngã có thể làm bị thương một nhân viên đoàn, không phải cả đám đông) = điểm 12, mức <strong>Cao</strong> — rủi ro này lên gần đầu hàng đợi xử lý ở Chương 4, trên cả những rủi ro điểm thấp hơn dù nghe kịch tính hơn.</p>
<div class="callout"><span class="badge">Chấm điểm, đừng đoán trong đầu</span> Viết ra hai con số — thay vì xếp hạng rủi ro theo cảm tính — là điều giúp hai người khác nhau (sản xuất và an ninh) đồng thuận về việc gì cần sửa trước, dùng cùng một sổ đăng ký.</div>`,
  ]]);

const c3q = quiz('erm301c-quiz-3', 'Quiz 3 — Risk assessment & matrix|||Quiz 3 — Đánh giá & ma trận rủi ro', [
  { id: 'q1', question: 'Trong ma trận rủi ro 5x5, điểm rủi ro được tính bằng cách nào?', options: ['Khả năng + Tác động', 'Khả năng × Tác động', 'Khả năng − Tác động', 'Tác động / Khả năng'], correctIndex: 1, explanation: 'Điểm rủi ro = Khả năng × Tác động, cho ra thang 1-25.' },
  { id: 'q2', question: 'Một rủi ro có khả năng 4 và tác động 3 rơi vào mức nào?', options: ['Thấp', 'Trung bình', 'Cao', 'Rất cao'], correctIndex: 2, explanation: '4×3=12, nằm trong dải 10-14 = mức Cao.' },
  { id: 'q3', question: 'Lợi ích chính của việc viết điểm khả năng/tác động ra sổ đăng ký thay vì xếp hạng theo cảm tính là gì?', options: ['Giúp mua bảo hiểm rẻ hơn', 'Giúp các bộ phận khác nhau đồng thuận về thứ tự xử lý', 'Không cần rà soát lại', 'Thay được việc khảo sát hiện trường'], correctIndex: 1, explanation: 'Chấm điểm rõ ràng giúp các bên (sản xuất, an ninh...) thống nhất ưu tiên trên cùng dữ liệu.' },
]);

const c4 = doc('erm301c-4-1-risk-treatment', '4.1 — Risk treatment: avoid, reduce, transfer, accept|||4.1 — Xử lý rủi ro: tránh, giảm, chuyển, chấp nhận',
  'Bốn phương án xử lý rủi ro theo ISO 31000; chọn phương án theo điểm ma trận; ví dụ áp dụng cho từng nhóm rủi ro.',
  [[
    `<span class="eyebrow">ERM301c · Chapter 4 · Lesson 4.1</span>
<h2>Risk treatment: avoid, reduce, transfer, accept</h2>
<p>Once a risk has a score, it needs a decision. ISO 31000 groups every treatment into four options — the same four, whatever the risk category:</p>
<ul>
<li><strong>Avoid</strong> — remove the risk entirely by changing the plan (move an outdoor stage indoors ahead of a storm warning; drop a vendor with a bad safety record).</li>
<li><strong>Reduce (mitigate)</strong> — lower the likelihood or the impact, but the risk still exists (add barriers and stewards at a chokepoint; run a structural inspection before doors open).</li>
<li><strong>Transfer</strong> — move the financial consequence to someone else, typically insurance or a contract clause (event cancellation insurance; a rigging contractor's own liability cover).</li>
<li><strong>Accept</strong> — consciously decide to carry the risk as-is, because treating it would cost more than the risk is worth — but this must be a documented decision, not a risk that was simply never assessed.</li>
</ul>
<h3>Matching treatment to score</h3>
<pre><code>Score band -> typical treatment
 1-4   Low       -> Accept (monitor)
 5-9   Medium    -> Reduce
10-14  High      -> Reduce + Transfer (insurance/contract)
15-25  Extreme   -> Avoid, or Reduce heavily + Transfer; escalate to event director
</code></pre>
<p>This is a starting guide, not a rule: a Low-score risk with catastrophic (but rare) impact — like a lightning strike — can still justify an Avoid/Reduce plan (a weather monitoring &amp; hold protocol) because the impact side alone is unacceptable.</p>
<div class="callout"><span class="badge">Every treatment gets an owner and a deadline</span> A treatment decision with no named owner and no date in the register is not a treatment — it is a wish. This is the most common gap auditors find in real event risk registers.</div>`,
    `<span class="eyebrow">ERM301c · Chương 4 · Bài 4.1</span>
<h2>Xử lý rủi ro: tránh, giảm, chuyển, chấp nhận</h2>
<p>Khi một rủi ro đã có điểm số, nó cần một quyết định. ISO 31000 nhóm mọi cách xử lý vào bốn phương án — vẫn bốn phương án đó dù rủi ro thuộc nhóm nào:</p>
<ul>
<li><strong>Tránh</strong> — loại bỏ hoàn toàn rủi ro bằng cách đổi kế hoạch (chuyển sân khấu ngoài trời vào trong nhà trước cảnh báo bão; bỏ nhà thầu có lịch sử an toàn kém).</li>
<li><strong>Giảm (mitigate)</strong> — hạ khả năng hoặc tác động, nhưng rủi ro vẫn còn tồn tại (thêm rào chắn và nhân viên tại điểm nghẽn; kiểm định kết cấu trước khi mở cổng).</li>
<li><strong>Chuyển</strong> — chuyển hậu quả tài chính sang bên khác, thường qua bảo hiểm hoặc điều khoản hợp đồng (bảo hiểm hủy sự kiện; bảo hiểm trách nhiệm của chính nhà thầu giàn treo).</li>
<li><strong>Chấp nhận</strong> — chủ động quyết định giữ nguyên rủi ro, vì xử lý nó sẽ tốn hơn giá trị rủi ro đó — nhưng đây phải là một quyết định được ghi nhận, không phải một rủi ro chỉ đơn giản chưa từng được đánh giá.</li>
</ul>
<h3>Khớp phương án xử lý với điểm số</h3>
<pre><code>Dải điểm -> phương án thường dùng
 1-4   Thấp        -> Chấp nhận (theo dõi)
 5-9   Trung bình  -> Giảm
10-14  Cao         -> Giảm + Chuyển (bảo hiểm/hợp đồng)
15-25  Rất cao     -> Tránh, hoặc Giảm mạnh + Chuyển; báo lên giám đốc sự kiện
</code></pre>
<p>Đây là hướng dẫn khởi đầu, không phải luật cứng: một rủi ro điểm thấp nhưng tác động thảm khốc (dù hiếm) — như sét đánh — vẫn có thể cần kế hoạch Tránh/Giảm (quy trình theo dõi thời tiết &amp; tạm hoãn) vì riêng phía tác động đã không thể chấp nhận.</p>
<div class="callout"><span class="badge">Mọi phương án xử lý cần người phụ trách và hạn chót</span> Một quyết định xử lý không có người phụ trách và không có ngày trong sổ đăng ký không phải là xử lý — đó là một điều ước. Đây là lỗ hổng phổ biến nhất mà người kiểm tra tìm thấy trong sổ rủi ro sự kiện thật.</div>`,
  ]]);

const c4q = quiz('erm301c-quiz-4', 'Quiz 4 — Risk treatment|||Quiz 4 — Xử lý rủi ro', [
  { id: 'q1', question: 'Mua bảo hiểm hủy sự kiện thuộc phương án xử lý rủi ro nào?', options: ['Tránh', 'Giảm', 'Chuyển', 'Chấp nhận'], correctIndex: 2, explanation: 'Bảo hiểm chuyển hậu quả tài chính sang bên thứ ba — đây là phương án Chuyển.' },
  { id: 'q2', question: 'Điều kiện để "chấp nhận" một rủi ro được xem là hợp lệ theo ISO 31000?', options: ['Rủi ro chưa từng được đánh giá', 'Đó là một quyết định có ghi nhận, không phải bị bỏ quên', 'Chỉ áp dụng cho rủi ro tài chính', 'Không cần người phụ trách'], correctIndex: 1, explanation: 'Chấp nhận rủi ro phải là quyết định chủ động và được ghi lại, khác với việc rủi ro bị bỏ sót.' },
  { id: 'q3', question: 'Điều gì làm một quyết định xử lý rủi ro trong sổ đăng ký trở thành "một điều ước" chứ không phải một biện pháp thật?', options: ['Không có màu sắc trong bảng tính', 'Không có người phụ trách và hạn chót', 'Không nộp cho nhà tài trợ', 'Không dịch sang tiếng Anh'], correctIndex: 1, explanation: 'Thiếu người phụ trách (owner) và hạn chót (deadline) là dấu hiệu của một biện pháp chỉ tồn tại trên giấy.' },
]);

const c5 = doc('erm301c-5-1-crowd-safety-medical', '5.1 — Crowd safety & medical/health management|||5.1 — An toàn đám đông & quản lý y tế/sức khoẻ',
  'Mật độ đám đông & sức chứa an toàn (theo Purple Guide); chokepoint & dòng di chuyển; kế hoạch y tế theo quy mô sự kiện.',
  [[
    `<span class="eyebrow">ERM301c · Chapter 5 · Lesson 5.1</span>
<h2>Crowd safety &amp; medical/health management</h2>
<h3>Crowd density &amp; safe capacity</h3>
<p>The UK's <strong>Purple Guide</strong> is the reference most events use to set a venue's safe capacity: as a rule of thumb, standing crowds become uncomfortable above roughly <strong>2 people per square metre</strong>, and dangerous "crush" conditions can start above roughly <strong>4-5 people per square metre</strong>, especially where the crowd cannot move or disperse. Capacity is not one number for the whole site — it must be calculated separately for the tightest point: entrances, bars, toilets and the front-of-stage barrier.</p>
<h3>Chokepoints &amp; flow</h3>
<ul>
<li><strong>Chokepoint</strong> — any place the crowd narrows (a gate, a corridor, a single staircase). A venue's real capacity is set by its narrowest chokepoint, not its open field area.</li>
<li><strong>One-way flow</strong> — separating entry and exit routes, and between-stage flow lanes, prevents the two directions colliding and creating a stall point.</li>
<li><strong>Real-time monitoring</strong> — CCTV, spotter staff on elevated positions, and a live headcount at entry vs. exit let the control room see a build-up before it becomes a crush.</li>
</ul>
<h3>Medical planning</h3>
<p>Medical provision scales with expected attendance, crowd profile (age, alcohol, activity level) and event duration — from a single first-aider at a small community event, up to on-site ambulances, a treatment tent and a direct line to local hospitals for a multi-day festival. The plan must state response time targets and how a serious casualty is escalated to emergency services (linked to Chapter 7's emergency plan).</p>
<pre><code>Crowd safety checklist (excerpt)
[ ] Density calculated per chokepoint, not just overall site
[ ] Entry/exit routes separated, clearly signed
[ ] Spotter staff positioned with radio to control room
[ ] Medical cover scaled to headcount + alcohol/activity profile
[ ] Trigger point defined for "stop entry" if density limit is reached
</code></pre>
<div class="callout"><span class="badge">Density is a moving target</span> A safe density at the start of a show can become unsafe the moment the headline act starts — crowd management has to plan for the surge, not just the steady state.</div>`,
    `<span class="eyebrow">ERM301c · Chương 5 · Bài 5.1</span>
<h2>An toàn đám đông &amp; quản lý y tế/sức khoẻ</h2>
<h3>Mật độ đám đông &amp; sức chứa an toàn</h3>
<p><strong>Purple Guide</strong> của Anh là tài liệu tham chiếu phổ biến nhất để xác định sức chứa an toàn của địa điểm: theo nguyên tắc chung, đám đông đứng bắt đầu khó chịu ở khoảng <strong>2 người/m²</strong>, và tình trạng "chèn ép" nguy hiểm có thể bắt đầu từ khoảng <strong>4-5 người/m²</strong>, đặc biệt khi đám đông không thể di chuyển hoặc giải tán. Sức chứa không phải một con số chung cho cả khu vực — phải tính riêng cho điểm hẹp nhất: cổng vào, quầy bar, nhà vệ sinh và hàng rào trước sân khấu.</p>
<h3>Điểm nghẽn &amp; dòng di chuyển</h3>
<ul>
<li><strong>Điểm nghẽn (chokepoint)</strong> — bất kỳ nơi đám đông bị thu hẹp (cổng, hành lang, một cầu thang duy nhất). Sức chứa thật của địa điểm được quyết định bởi điểm nghẽn hẹp nhất, không phải diện tích khoảng trống.</li>
<li><strong>Dòng một chiều</strong> — tách lối vào và lối ra, cũng như luồng di chuyển giữa các khu sân khấu, tránh hai chiều va vào nhau tạo điểm nghẽn kép.</li>
<li><strong>Giám sát thời gian thực</strong> — camera an ninh, nhân viên quan sát ở vị trí cao, và đếm số lượng vào/ra theo thời gian thực giúp phòng điều hành thấy sự tích tụ trước khi nó thành chèn ép.</li>
</ul>
<h3>Kế hoạch y tế</h3>
<p>Nguồn lực y tế được tính theo lượng khách dự kiến, đặc điểm đám đông (tuổi, bia rượu, mức độ vận động) và thời gian sự kiện — từ một nhân viên cứu thương duy nhất ở sự kiện cộng đồng nhỏ, đến xe cứu thương tại chỗ, lều điều trị và đường dây trực tiếp với bệnh viện địa phương cho lễ hội nhiều ngày. Kế hoạch phải nêu rõ mục tiêu thời gian phản ứng và cách một ca nặng được chuyển lên dịch vụ cấp cứu (liên kết với kế hoạch khẩn cấp ở Chương 7).</p>
<pre><code>Checklist an toàn đám đông (trích)
[ ] Mật độ tính theo từng điểm nghẽn, không chỉ tổng khu vực
[ ] Lối vào/ra tách riêng, có chỉ dẫn rõ
[ ] Nhân viên quan sát có bộ đàm liên lạc phòng điều hành
[ ] Nguồn lực y tế tính theo số khách + đặc điểm bia rượu/vận động
[ ] Xác định trước điểm ngưỡng "dừng cho vào" khi đạt giới hạn mật độ
</code></pre>
<div class="callout"><span class="badge">Mật độ là mục tiêu di động</span> Mật độ an toàn ở đầu buổi diễn có thể trở thành không an toàn ngay khi tiết mục chính bắt đầu — quản lý đám đông phải lên kế hoạch cho cả cơn dồn (surge), không chỉ trạng thái ổn định.</div>`,
  ]]);

const c5q = quiz('erm301c-quiz-5', 'Quiz 5 — Crowd safety & medical|||Quiz 5 — An toàn đám đông & y tế', [
  { id: 'q1', question: 'Sức chứa an toàn của một địa điểm nên được tính dựa trên đâu?', options: ['Diện tích khoảng trống lớn nhất', 'Điểm nghẽn hẹp nhất', 'Số vé đã bán', 'Diện tích sân khấu'], correctIndex: 1, explanation: 'Điểm nghẽn hẹp nhất (cổng, cầu thang...) quyết định sức chứa thật, không phải diện tích mở.' },
  { id: 'q2', question: 'Vì sao lối vào và lối ra nên được tách riêng?', options: ['Để trang trí đẹp hơn', 'Để tránh hai dòng di chuyển va vào nhau tạo điểm nghẽn', 'Để tiết kiệm nhân viên', 'Không có lý do an toàn'], correctIndex: 1, explanation: 'Dòng một chiều tránh hai hướng di chuyển ngược nhau gây tắc nghẽn và chèn ép.' },
  { id: 'q3', question: 'Vì sao mật độ đám đông được gọi là "mục tiêu di động"?', options: ['Vì đám đông luôn di chuyển vòng tròn', 'Vì mật độ an toàn có thể đổi thành nguy hiểm khi có cơn dồn (vd tiết mục chính bắt đầu)', 'Vì mật độ không thể đo được', 'Vì chỉ áp dụng ban đêm'], correctIndex: 1, explanation: 'Quản lý đám đông phải tính cho cả tình huống dồn đột ngột (surge), không chỉ trạng thái ổn định.' },
]);

const c6 = doc('erm301c-6-1-security-terrorism-insurance', '6.1 — Security, terrorism & event insurance|||6.1 — An ninh, khủng bố & bảo hiểm sự kiện',
  'Lớp an ninh vật lý (kiểm soát vào, soát, bảo vệ); nguy cơ khủng bố & phương tiện tấn công có phương thức (VAA); các loại bảo hiểm sự kiện.',
  [[
    `<span class="eyebrow">ERM301c · Chapter 6 · Lesson 6.1</span>
<h2>Security, terrorism &amp; event insurance</h2>
<h3>Layers of physical security</h3>
<p>Tarlow's framework treats security as <strong>layers</strong> rather than a single checkpoint: perimeter (fencing, vehicle barriers), access control (ticket/ID checks, bag search), and internal security (roaming guards, CCTV coverage, a visible presence that deters trouble before it starts). Each layer should still work if another layer fails.</p>
<h3>Terrorism &amp; hostile vehicle risk</h3>
<p>Since large public gatherings became recognised targets, event security planning now routinely includes <strong>Hostile Vehicle Mitigation (HVM)</strong> — bollards, barriers or repurposed heavy vehicles blocking vehicle access to pedestrian crowd areas — plus staff trained to recognise suspicious behaviour and unattended items, and a clear liaison channel with local police for threat-level updates.</p>
<h3>Event insurance types</h3>
<ul>
<li><strong>Public liability</strong> — covers injury or property damage claims from attendees or the public.</li>
<li><strong>Cancellation/abandonment</strong> — covers lost revenue if the event is cancelled for a covered reason (severe weather, venue unavailability, an act's illness).</li>
<li><strong>Weather insurance</strong> — a specific payout triggered by defined weather conditions, common for outdoor events.</li>
<li><strong>Employer's liability &amp; contractor cover</strong> — required for staff and for any contractor working on site (e.g. rigging crews) — verify their own certificate before they start work.</li>
</ul>
<pre><code>Security & insurance checklist (excerpt)
[ ] Perimeter, access control and internal security layers all defined
[ ] Hostile vehicle mitigation in place for any pedestrian crowd area
[ ] Public liability + cancellation insurance both confirmed in writing
[ ] Every external contractor's insurance certificate checked before access
</code></pre>
<div class="callout"><span class="badge">Insurance is a transfer, not a fix</span> Insurance transfers the financial consequence of a risk — it does not lower the likelihood or the impact. It must sit alongside prevention (Chapter 4's "reduce"), never replace it.</div>`,
    `<span class="eyebrow">ERM301c · Chương 6 · Bài 6.1</span>
<h2>An ninh, khủng bố &amp; bảo hiểm sự kiện</h2>
<h3>Các lớp an ninh vật lý</h3>
<p>Khung của Tarlow xem an ninh là các <strong>lớp</strong> chồng lên nhau, không phải một điểm kiểm soát duy nhất: vòng ngoài (hàng rào, chắn xe), kiểm soát vào (soát vé/CMND, kiểm tra túi), và an ninh nội bộ (bảo vệ đi tuần, phủ camera, sự hiện diện dễ thấy để ngăn sự cố trước khi xảy ra). Mỗi lớp phải vẫn hoạt động nếu lớp khác thất bại.</p>
<h3>Nguy cơ khủng bố &amp; rủi ro phương tiện tấn công</h3>
<p>Từ khi các sự kiện tập trung đông người trở thành mục tiêu được nhận diện, kế hoạch an ninh sự kiện nay thường bao gồm <strong>giảm nhẹ phương tiện thù địch (HVM)</strong> — cọc chắn, rào chắn hoặc xe tải hạng nặng dùng để chặn xe tiếp cận khu vực đám đông đi bộ — cùng với nhân viên được huấn luyện nhận biết hành vi khả nghi và vật thể bị bỏ lại, và một kênh liên lạc rõ ràng với cảnh sát địa phương để cập nhật mức độ nguy cơ.</p>
<h3>Các loại bảo hiểm sự kiện</h3>
<ul>
<li><strong>Trách nhiệm công cộng (public liability)</strong> — bồi thường khiếu nại thương tích hoặc thiệt hại tài sản từ khách tham dự hoặc công chúng.</li>
<li><strong>Hủy/gián đoạn sự kiện</strong> — bồi thường doanh thu mất đi nếu sự kiện bị hủy vì lý do được bảo hiểm (thời tiết khắc nghiệt, mất địa điểm, nghệ sĩ bị ốm).</li>
<li><strong>Bảo hiểm thời tiết</strong> — chi trả cụ thể khi các điều kiện thời tiết đã định xảy ra, phổ biến với sự kiện ngoài trời.</li>
<li><strong>Trách nhiệm người sử dụng lao động &amp; bảo hiểm nhà thầu</strong> — bắt buộc cho nhân viên và cho mọi nhà thầu làm việc tại chỗ (vd đội giàn treo) — kiểm tra giấy chứng nhận của chính họ trước khi họ bắt đầu làm việc.</li>
</ul>
<pre><code>Checklist an ninh & bảo hiểm (trích)
[ ] Đủ ba lớp: vòng ngoài, kiểm soát vào, an ninh nội bộ
[ ] Có giảm nhẹ phương tiện thù địch cho khu vực đám đông đi bộ
[ ] Đã xác nhận bằng văn bản cả bảo hiểm trách nhiệm công cộng + hủy sự kiện
[ ] Đã kiểm tra giấy chứng nhận bảo hiểm của mọi nhà thầu ngoài trước khi vào</code></pre>
<div class="callout"><span class="badge">Bảo hiểm là chuyển giao, không phải khắc phục</span> Bảo hiểm chuyển hậu quả tài chính của rủi ro sang bên khác — nó không làm giảm khả năng hay tác động. Nó phải đi cùng với phòng ngừa (phương án "giảm" ở Chương 4), không thể thay thế phòng ngừa.</div>`,
  ]]);

const c6q = quiz('erm301c-quiz-6', 'Quiz 6 — Security & insurance|||Quiz 6 — An ninh & bảo hiểm', [
  { id: 'q1', question: 'Theo khung của Tarlow, an ninh sự kiện nên được tổ chức như thế nào?', options: ['Một điểm kiểm soát duy nhất ở cổng chính', 'Nhiều lớp chồng lên nhau (vòng ngoài, kiểm soát vào, nội bộ)', 'Chỉ cần camera, không cần bảo vệ', 'Chỉ áp dụng cho sự kiện có VIP'], correctIndex: 1, explanation: 'An ninh theo lớp giúp hệ thống vẫn hoạt động nếu một lớp thất bại.' },
  { id: 'q2', question: 'Giảm nhẹ phương tiện thù địch (HVM) nhằm mục đích gì?', options: ['Ngăn xe cộ tiếp cận khu vực đám đông đi bộ', 'Giảm giá vé', 'Tăng tốc soát vé', 'Chống mưa cho khán giả'], correctIndex: 0, explanation: 'HVM (cọc chắn, rào chắn, xe tải chặn) ngăn xe tiếp cận đám đông đi bộ, phòng nguy cơ tấn công bằng phương tiện.' },
  { id: 'q3', question: 'Vì sao bảo hiểm không thể thay thế các biện pháp phòng ngừa rủi ro?', options: ['Vì bảo hiểm chỉ chuyển hậu quả tài chính, không làm giảm khả năng/tác động', 'Vì bảo hiểm luôn đắt hơn phòng ngừa', 'Vì bảo hiểm chỉ áp dụng sau sự kiện', 'Vì luật cấm mua bảo hiểm sự kiện'], correctIndex: 0, explanation: 'Bảo hiểm là phương án "chuyển" — nó không hạ khả năng hay tác động như phương án "giảm".' },
]);

const c7 = doc('erm301c-7-1-emergency-evacuation', '7.1 — Emergency & evacuation planning|||7.1 — Kế hoạch khẩn cấp & sơ tán',
  'Cấu trúc chỉ huy sự cố (incident command); phân loại mức độ khẩn cấp; quy trình sơ tán/di chuyển tại chỗ; vai trò thông báo công chúng.',
  [[
    `<span class="eyebrow">ERM301c · Chapter 7 · Lesson 7.1</span>
<h2>Emergency &amp; evacuation planning</h2>
<h3>Incident command structure</h3>
<p>When something goes wrong live, decisions cannot wait for a committee — the event needs a pre-agreed <strong>incident command structure</strong>: one named person with the authority to call an evacuation, a defined chain of who reports to whom, and a control room that all departments (security, medical, production, PA/announcements) report into during an incident.</p>
<h3>Levels of emergency response</h3>
<ul>
<li><strong>Localised incident</strong> — handled by the nearest team (a medical call, a small fight) without stopping the show.</li>
<li><strong>Hold / pause</strong> — the show pauses, crowd stays in place, used when the danger is temporary (a lightning cell passing, a brief structural check).</li>
<li><strong>Evacuation / invacuation</strong> — the crowd is moved out of the danger area (evacuation) or moved to a safer indoor space (invacuation, e.g. for a severe weather cell) — the correct choice depends on whether outside or inside is safer for that specific hazard.</li>
</ul>
<h3>Evacuation planning essentials</h3>
<pre><code>Emergency & evacuation checklist (excerpt)
[ ] Named incident commander with clear authority to call each level
[ ] Evacuation routes marked, wide enough for full capacity, tested for chokepoints
[ ] Assembly points defined, away from the hazard and from emergency vehicle access
[ ] Public announcement scripts pre-written for hold / evacuate / invacuate
[ ] Local emergency services briefed on the plan before the event, not during it
</code></pre>
<div class="callout"><span class="badge">Rehearse the announcement, not just the route</span> A perfect evacuation route fails if the announcement causes panic instead of orderly movement — scripted, calm, repeated instructions matter as much as the physical exits.</div>`,
    `<span class="eyebrow">ERM301c · Chương 7 · Bài 7.1</span>
<h2>Kế hoạch khẩn cấp &amp; sơ tán</h2>
<h3>Cấu trúc chỉ huy sự cố</h3>
<p>Khi có sự cố xảy ra trực tiếp, quyết định không thể chờ một cuộc họp — sự kiện cần một <strong>cấu trúc chỉ huy sự cố</strong> đã thống nhất trước: một người được chỉ định có quyền ra lệnh sơ tán, một chuỗi báo cáo rõ ai báo cáo cho ai, và một phòng điều hành mà mọi bộ phận (an ninh, y tế, sản xuất, thông báo loa) báo cáo vào trong lúc có sự cố.</p>
<h3>Các mức độ ứng phó khẩn cấp</h3>
<ul>
<li><strong>Sự cố cục bộ</strong> — xử lý bởi nhóm gần nhất (một ca gọi y tế, một vụ xô xát nhỏ) mà không cần ngừng chương trình.</li>
<li><strong>Tạm ngưng / giữ chỗ (hold)</strong> — chương trình tạm dừng, đám đông giữ nguyên vị trí, dùng khi nguy hiểm chỉ là tạm thời (một ổ mây sét đi qua, kiểm tra kết cấu ngắn).</li>
<li><strong>Sơ tán / di chuyển vào trong (evacuation/invacuation)</strong> — đám đông được di chuyển ra khỏi khu vực nguy hiểm (sơ tán) hoặc di chuyển vào không gian an toàn hơn trong nhà (invacuation, vd cho một ổ thời tiết khắc nghiệt) — lựa chọn đúng phụ thuộc vào việc ngoài trời hay trong nhà an toàn hơn cho đúng loại hiểm hoạ đó.</li>
</ul>
<h3>Những điều cốt lõi khi lập kế hoạch sơ tán</h3>
<pre><code>Checklist khẩn cấp & sơ tán (trích)
[ ] Có chỉ huy sự cố được chỉ định, quyền hạn rõ ràng cho từng mức
[ ] Lối sơ tán được đánh dấu, đủ rộng cho toàn bộ sức chứa, đã kiểm tra điểm nghẽn
[ ] Điểm tập kết được xác định, xa hiểm hoạ và không cản đường xe cấp cứu
[ ] Có sẵn kịch bản thông báo cho giữ chỗ / sơ tán / di chuyển vào trong
[ ] Đã họp với lực lượng cứu hộ địa phương về kế hoạch TRƯỚC sự kiện, không phải trong lúc xảy ra</code></pre>
<div class="callout"><span class="badge">Diễn tập lời thông báo, không chỉ tuyến đường</span> Một tuyến sơ tán hoàn hảo vẫn thất bại nếu lời thông báo gây hoảng loạn thay vì di chuyển có trật tự — kịch bản, giọng điềm tĩnh, hướng dẫn lặp lại quan trọng không kém các lối thoát vật lý.</div>`,
  ]]);

const c7q = quiz('erm301c-quiz-7', 'Quiz 7 — Emergency & evacuation|||Quiz 7 — Khẩn cấp & sơ tán', [
  { id: 'q1', question: 'Vì sao sự kiện cần một cấu trúc chỉ huy sự cố được thống nhất TRƯỚC khi xảy ra sự cố?', options: ['Để phân chia lợi nhuận', 'Vì quyết định khẩn cấp không thể chờ một cuộc họp', 'Để giảm chi phí bảo hiểm', 'Chỉ để làm hồ sơ pháp lý'], correctIndex: 1, explanation: 'Khi sự cố xảy ra, cần người có quyền ra quyết định ngay, không có thời gian họp bàn.' },
  { id: 'q2', question: '"Invacuation" khác "evacuation" ở điểm nào?', options: ['Invacuation là di chuyển vào không gian an toàn trong nhà, evacuation là đưa ra khỏi khu vực nguy hiểm', 'Invacuation chỉ dùng cho VIP', 'Hai từ có nghĩa giống nhau hoàn toàn', 'Invacuation chỉ áp dụng ban đêm'], correctIndex: 0, explanation: 'Invacuation di chuyển đám đông vào nơi an toàn hơn (vd trong nhà khi có thời tiết khắc nghiệt); evacuation đưa ra khỏi khu vực nguy hiểm.' },
  { id: 'q3', question: 'Vì sao "diễn tập lời thông báo" được xem là quan trọng không kém tuyến đường sơ tán?', options: ['Vì loa là thiết bị đắt nhất', 'Vì thông báo gây hoảng loạn có thể làm hỏng cả một tuyến sơ tán tốt', 'Vì luật yêu cầu phải có MC', 'Vì khán giả thích nghe nhạc trong lúc sơ tán'], correctIndex: 1, explanation: 'Một tuyến đường tốt vẫn thất bại nếu thông báo gây hoảng loạn thay vì di chuyển có trật tự.' },
]);

const c8 = doc('erm301c-8-1-crisis-legal-compliance', '8.1 — Crisis management, legal & compliance|||8.1 — Quản lý khủng hoảng, pháp lý & tuân thủ',
  'Khủng hoảng khác sự cố khẩn cấp; truyền thông khủng hoảng; nghĩa vụ pháp lý của ban tổ chức (duty of care); rà soát hậu sự kiện.',
  [[
    `<span class="eyebrow">ERM301c · Chapter 8 · Lesson 8.1</span>
<h2>Crisis management, legal &amp; compliance</h2>
<h3>Crisis vs. emergency</h3>
<p>An <strong>emergency</strong> (Chapter 7) is a physical, on-site event demanding an immediate operational response. A <strong>crisis</strong> is broader and can outlast the event itself: reputational damage, media scrutiny, legal exposure and stakeholder confidence — it can follow a well-handled emergency (a fast evacuation still generates headlines) or arise without any physical incident at all (a leaked video, a discrimination complaint).</p>
<h3>Crisis communication basics</h3>
<ul>
<li><strong>One spokesperson</strong> — a single, briefed voice to media and social channels prevents contradicting statements.</li>
<li><strong>Speed with accuracy</strong> — the first statement should come fast, even if brief ("we are aware, we are responding, more information to follow") — silence is read as either negligence or a cover-up.</li>
<li><strong>Facts before speculation</strong> — never state a cause or a casualty count before it is confirmed by the incident commander/medical lead.</li>
</ul>
<h3>Legal duty of care &amp; compliance</h3>
<p>Organisers hold a <strong>duty of care</strong> to attendees, staff and contractors — a legal obligation to take reasonable steps to prevent foreseeable harm. This is why the risk register (Chapter 1) and the treatment decisions (Chapter 4) are not just good practice: in many jurisdictions they are the evidence an organiser used reasonable care if something does go wrong and is later investigated or litigated. Compliance also covers permits, licensing (alcohol, noise, public assembly), accessibility requirements, and any sector-specific regulation for the venue type.</p>
<h3>Post-event review</h3>
<pre><code>Post-event review checklist
[ ] Every incident during the event logged with time, response and outcome
[ ] Risk register updated: what was missed, what scored wrong, what worked
[ ] Debrief held with every department while memory is fresh
[ ] Lessons fed forward into next event's Chapter 2 identification stage
</code></pre>
<div class="callout"><span class="badge">The register never really closes</span> The final act of event risk management is feeding this event's outcomes back into the next event's risk identification — Chapter 1's continual ISO 31000 cycle, closing the loop.</div>`,
    `<span class="eyebrow">ERM301c · Chương 8 · Bài 8.1</span>
<h2>Quản lý khủng hoảng, pháp lý &amp; tuân thủ</h2>
<h3>Khủng hoảng khác sự cố khẩn cấp</h3>
<p>Một <strong>sự cố khẩn cấp</strong> (Chương 7) là một biến cố vật lý, tại chỗ, cần phản ứng vận hành ngay lập tức. Một <strong>khủng hoảng</strong> rộng hơn và có thể kéo dài hơn cả sự kiện: tổn hại danh tiếng, sự soi xét của truyền thông, rủi ro pháp lý và niềm tin của các bên liên quan — nó có thể xảy ra sau một sự cố đã xử lý tốt (sơ tán nhanh vẫn lên báo) hoặc phát sinh mà không có sự cố vật lý nào (một video lộ ra, một khiếu nại phân biệt đối xử).</p>
<h3>Nguyên tắc truyền thông khủng hoảng</h3>
<ul>
<li><strong>Một người phát ngôn</strong> — một tiếng nói duy nhất, đã được thông tin đầy đủ, cho báo chí và mạng xã hội để tránh phát ngôn mâu thuẫn.</li>
<li><strong>Nhanh nhưng chính xác</strong> — tuyên bố đầu tiên nên đến nhanh, dù ngắn ("chúng tôi đã biết, đang xử lý, sẽ cập nhật thêm") — sự im lặng bị hiểu là tắc trách hoặc che giấu.</li>
<li><strong>Sự thật trước suy đoán</strong> — không bao giờ nêu nguyên nhân hay số thương vong trước khi được chỉ huy sự cố/trưởng y tế xác nhận.</li>
</ul>
<h3>Nghĩa vụ pháp lý &amp; tuân thủ</h3>
<p>Ban tổ chức có <strong>nghĩa vụ chăm sóc (duty of care)</strong> với khách tham dự, nhân viên và nhà thầu — một nghĩa vụ pháp lý phải thực hiện các biện pháp hợp lý để ngăn tổn hại có thể dự đoán được. Đây là lý do sổ đăng ký rủi ro (Chương 1) và các quyết định xử lý (Chương 4) không chỉ là thực hành tốt: ở nhiều nơi, đó chính là bằng chứng cho thấy ban tổ chức đã hành động hợp lý nếu có sự cố xảy ra và sau đó bị điều tra hoặc khởi kiện. Tuân thủ còn bao gồm giấy phép, cấp phép (bia rượu, tiếng ồn, tụ họp công cộng), yêu cầu tiếp cận cho người khuyết tật, và quy định riêng theo loại địa điểm.</p>
<h3>Rà soát hậu sự kiện</h3>
<pre><code>Checklist rà soát hậu sự kiện
[ ] Mọi sự cố trong sự kiện được ghi lại đầy đủ thời gian, phản ứng và kết quả
[ ] Sổ đăng ký rủi ro được cập nhật: điều gì bị bỏ sót, điểm nào chấm sai, điều gì hiệu quả
[ ] Họp rút kinh nghiệm với mọi bộ phận khi ký ức còn mới
[ ] Bài học được đưa vào bước nhận diện rủi ro (Chương 2) của sự kiện kế tiếp</code></pre>
<div class="callout"><span class="badge">Sổ đăng ký không bao giờ thực sự đóng lại</span> Hành động cuối cùng của quản lý rủi ro sự kiện là đưa kết quả của sự kiện này trở lại bước nhận diện rủi ro của sự kiện kế tiếp — khép lại vòng liên tục của ISO 31000 từ Chương 1.</div>`,
  ]]);

const c8q = quiz('erm301c-quiz-8', 'Quiz 8 — Crisis, legal & compliance|||Quiz 8 — Khủng hoảng, pháp lý & tuân thủ', [
  { id: 'q1', question: 'Điểm khác biệt chính giữa "khủng hoảng" và "sự cố khẩn cấp" là gì?', options: ['Khủng hoảng luôn nhẹ hơn sự cố khẩn cấp', 'Khủng hoảng có thể kéo dài hơn sự kiện và xảy ra cả khi không có sự cố vật lý', 'Chúng là một khái niệm giống nhau', 'Khủng hoảng chỉ liên quan đến thời tiết'], correctIndex: 1, explanation: 'Khủng hoảng (danh tiếng, pháp lý, truyền thông) có thể phát sinh và kéo dài dù không có sự cố vật lý nào, khác sự cố khẩn cấp tại chỗ.' },
  { id: 'q2', question: 'Trong truyền thông khủng hoảng, vì sao nên có MỘT người phát ngôn duy nhất?', options: ['Để tiết kiệm chi phí PR', 'Để tránh các phát ngôn mâu thuẫn với báo chí/công chúng', 'Vì luật bắt buộc', 'Không có lý do cụ thể'], correctIndex: 1, explanation: 'Một tiếng nói thống nhất tránh việc các nguồn khác nhau đưa thông tin trái ngược.' },
  { id: 'q3', question: 'Sổ đăng ký rủi ro và các quyết định xử lý (Chương 1, 4) có vai trò gì về mặt pháp lý?', options: ['Không có vai trò pháp lý', 'Là bằng chứng cho thấy ban tổ chức đã thực hiện nghĩa vụ chăm sóc (duty of care) hợp lý', 'Chỉ dùng để báo cáo nhà tài trợ', 'Chỉ cần giữ trong 1 tuần sau sự kiện'], correctIndex: 1, explanation: 'Chúng có thể là bằng chứng cho thấy ban tổ chức đã có biện pháp hợp lý, quan trọng nếu bị điều tra/khởi kiện.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ERM301c',
    slug: 'erm301c-entertainment-and-event-risk-management',
    title: 'Entertainment and Event Risk Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ERM301c.webp',
    shortDescription: 'Managing risk for events & festivals — ISO 31000, risk identification (safety, financial, reputational, crowd), the risk matrix, treatment options, crowd safety, security & insurance, emergency planning, crisis & legal compliance.|||Quản lý rủi ro sự kiện & lễ hội — ISO 31000, nhận diện rủi ro (an toàn, tài chính, danh tiếng, đám đông), ma trận rủi ro, phương án xử lý, an toàn đám đông, an ninh & bảo hiểm, kế hoạch khẩn cấp, khủng hoảng & tuân thủ pháp lý.',
    description: 'Môn <strong>ERM301c — Entertainment and Event Risk Management</strong> (kỳ 5) dạy cách <strong>quản lý rủi ro cho sự kiện giải trí và lễ hội</strong> theo chuẩn <strong>ISO 31000</strong>. Từ <strong>tổng quan quy trình</strong> → <strong>nhận diện rủi ro</strong> (an toàn, tài chính, danh tiếng, đám đông) → <strong>đánh giá bằng ma trận rủi ro</strong> → <strong>xử lý</strong> (tránh/giảm/chuyển/chấp nhận) → <strong>an toàn đám đông &amp; y tế</strong> → <strong>an ninh, khủng bố &amp; bảo hiểm</strong> → <strong>kế hoạch khẩn cấp &amp; sơ tán</strong> → <strong>quản lý khủng hoảng, pháp lý &amp; tuân thủ</strong>. Trích dẫn Silvers, HSE Purple Guide, Tarlow và ISO 31000, song ngữ, có checklist và quiz mỗi chương.',
    whatYouLearn: 'Quy trình ISO 31000 (nhận diện-đánh giá-xử lý-giám sát); sổ đăng ký rủi ro; bốn nhóm rủi ro sự kiện; ma trận rủi ro 5x5 (khả năng x tác động); bốn phương án xử lý (tránh/giảm/chuyển/chấp nhận); mật độ & sức chứa an toàn đám đông; kế hoạch y tế; lớp an ninh vật lý & giảm nhẹ phương tiện thù địch; các loại bảo hiểm sự kiện; cấu trúc chỉ huy sự cố & sơ tán; truyền thông khủng hoảng; nghĩa vụ chăm sóc pháp lý & rà soát hậu sự kiện.',
    requirements: 'Không yêu cầu kiến thức chuyên ngành trước. Nên đọc trước một kế hoạch an toàn sự kiện thật (nhiều trường/thành phố công bố online) để đối chiếu với các checklist trong môn.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chính (Silvers, Tarlow), ISO 31000, Purple Guide/HSE, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao sự kiện cần quản lý rủi ro riêng; quy trình ISO 31000; lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & ISO 31000|||Chapter 1 — Overview & ISO 31000', description: 'Định nghĩa rủi ro sự kiện, nguyên tắc ISO 31000, risk register.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nhận diện rủi ro|||Chapter 2 — Risk identification', description: 'An toàn, tài chính, danh tiếng, đám đông.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đánh giá & ma trận rủi ro|||Chapter 3 — Risk assessment & matrix', description: 'Ma trận 5x5, điểm rủi ro, ưu tiên xử lý.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Xử lý rủi ro|||Chapter 4 — Risk treatment', description: 'Tránh, giảm, chuyển, chấp nhận.', lessons: [c4, c4q] },
    { title: 'Chương 5 — An toàn đám đông & y tế|||Chapter 5 — Crowd safety & medical', description: 'Mật độ, chokepoint, kế hoạch y tế.', lessons: [c5, c5q] },
    { title: 'Chương 6 — An ninh & bảo hiểm|||Chapter 6 — Security & insurance', description: 'Lớp an ninh, khủng bố, bảo hiểm sự kiện.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Kế hoạch khẩn cấp & sơ tán|||Chapter 7 — Emergency & evacuation', description: 'Chỉ huy sự cố, mức ứng phó, sơ tán.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Khủng hoảng, pháp lý & tuân thủ|||Chapter 8 — Crisis, legal & compliance', description: 'Truyền thông khủng hoảng, duty of care, rà soát hậu sự kiện.', lessons: [c8, c8q] },
  ],
};
