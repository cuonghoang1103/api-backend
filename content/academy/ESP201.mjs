/**
 * ESP201 — Entertainment and Event Risk Management. Khối Quản trị Kinh doanh
 * (BBA), Kỳ 5. GÓC THƯƠNG MẠI: tài chính, pháp lý, hợp đồng, bảo hiểm, danh
 * tiếng, nhà tài trợ, force majeure — KHÔNG trùng ERM301c (an toàn/đám đông).
 * Giáo trình: Silvers "Risk Management for Meetings and Events"; ISO 31000;
 * Tum "Management of Event Operations"; tài liệu bảo hiểm sự kiện.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('esp201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (Silvers, Tum), ISO 31000, tài liệu bảo hiểm sự kiện, tổ chức ngành, công cụ ma trận rủi ro.',
  [[
    `<span class="eyebrow">ESP201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">This hub covers the <strong>commercial side</strong> of event risk — money, contracts, insurance and reputation. It does <em>not</em> cover crowd safety or physical/venue hazards; that side is taught in <strong>ERM301c</strong>.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><em>Risk Management for Meetings and Events</em> — Julia Rutherford Silvers (Routledge). The main reference for this course's risk-identification and treatment framework.</li>
<li><em>Management of Event Operations</em> — Julie Tum, Philippa Norton &amp; J. Mike Wright (Routledge). Operations chapters cover budgeting, contracting and supplier management.</li>
</ul>
<h3>📗 Standard &amp; official references</h3>
<ul>
<li><a href="https://www.iso.org/iso-31000-risk-management.html" target="_blank" rel="noopener">ISO 31000 — Risk management guidelines (iso.org)</a></li>
<li><a href="https://en.wikipedia.org/wiki/ISO_31000" target="_blank" rel="noopener">ISO 31000 — overview (Wikipedia)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Event_management" target="_blank" rel="noopener">Event management — overview (Wikipedia)</a></li>
</ul>
<h3>🌐 Industry organizations</h3>
<ul>
<li><a href="https://www.pcma.org/" target="_blank" rel="noopener">PCMA — Professional Convention Management Association</a></li>
<li><a href="https://ifea.com/" target="_blank" rel="noopener">IFEA — International Festivals &amp; Events Association</a></li>
<li><a href="https://www.iii.org/" target="_blank" rel="noopener">III — Insurance Information Institute</a> (event cancellation &amp; liability insurance basics)</li>
<li><a href="https://www.skiftmeetings.com/" target="_blank" rel="noopener">Skift Meetings</a> — meetings &amp; events industry news</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.pmi.org/" target="_blank" rel="noopener">PMI — Project Management Institute</a> — risk register &amp; risk-matrix templates transfer directly to event projects.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — ISO 31000 vocabulary (risk, likelihood, impact, treatment), the commercial risk categories in this course.</li>
<li><strong>Practice</strong> — build a risk register and a risk matrix for a real or hypothetical event.</li>
<li><strong>Go deeper</strong> — read one real event contract or insurance certificate; identify the clauses covered in Chapters 3–4.</li>
<li><strong>Job-ready</strong> — draft a one-page risk &amp; insurance brief for a sponsor or client.</li>
</ol></div>`,
    `<span class="eyebrow">ESP201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Trung tâm này bao trùm <strong>phía thương mại</strong> của rủi ro sự kiện — tiền, hợp đồng, bảo hiểm và danh tiếng. Môn này KHÔNG dạy an toàn đám đông hay hiểm hoạ vật lý/địa điểm; phần đó nằm ở <strong>ERM301c</strong>.</p>
<h3>📘 Giáo trình chính</h3>
<ul>
<li><em>Risk Management for Meetings and Events</em> — Julia Rutherford Silvers (Routledge). Nguồn chính cho khung nhận diện &amp; xử lý rủi ro của môn.</li>
<li><em>Management of Event Operations</em> — Julie Tum, Philippa Norton &amp; J. Mike Wright (Routledge). Các chương vận hành nói về ngân sách, ký hợp đồng và quản lý nhà cung cấp.</li>
</ul>
<h3>📗 Tiêu chuẩn &amp; tài liệu chính thức</h3>
<ul>
<li><a href="https://www.iso.org/iso-31000-risk-management.html" target="_blank" rel="noopener">ISO 31000 — Hướng dẫn quản lý rủi ro (iso.org)</a></li>
<li><a href="https://en.wikipedia.org/wiki/ISO_31000" target="_blank" rel="noopener">ISO 31000 — tổng quan (Wikipedia)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Event_management" target="_blank" rel="noopener">Quản lý sự kiện — tổng quan (Wikipedia)</a></li>
</ul>
<h3>🌐 Tổ chức ngành</h3>
<ul>
<li><a href="https://www.pcma.org/" target="_blank" rel="noopener">PCMA — Professional Convention Management Association</a></li>
<li><a href="https://ifea.com/" target="_blank" rel="noopener">IFEA — International Festivals &amp; Events Association</a></li>
<li><a href="https://www.iii.org/" target="_blank" rel="noopener">III — Insurance Information Institute</a> (kiến thức nền bảo hiểm huỷ sự kiện &amp; trách nhiệm)</li>
<li><a href="https://www.skiftmeetings.com/" target="_blank" rel="noopener">Skift Meetings</a> — tin ngành hội họp &amp; sự kiện</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.pmi.org/" target="_blank" rel="noopener">PMI — Project Management Institute</a> — mẫu sổ rủi ro &amp; ma trận rủi ro áp dụng thẳng cho dự án sự kiện.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — từ vựng ISO 31000 (rủi ro, khả năng xảy ra, mức độ ảnh hưởng, biện pháp xử lý), các nhóm rủi ro thương mại của môn.</li>
<li><strong>Luyện tập</strong> — dựng sổ rủi ro và ma trận rủi ro cho một sự kiện thật hoặc giả định.</li>
<li><strong>Đào sâu</strong> — đọc một hợp đồng sự kiện hoặc giấy chứng nhận bảo hiểm thật; nhận ra các điều khoản học ở Chương 3–4.</li>
<li><strong>Sẵn sàng đi làm</strong> — soạn bản tóm tắt rủi ro &amp; bảo hiểm một trang cho nhà tài trợ hoặc khách hàng.</li>
</ol></div>`,
  ]]);

const intro = doc('esp201-0-1-overview', 'Course overview: Commercial risk in entertainment & events|||Tổng quan: Rủi ro thương mại trong ngành sự kiện & giải trí',
  'Rủi ro thương mại (khác an toàn/đám đông của ERM301c): tài chính, pháp lý/hợp đồng, bảo hiểm, danh tiếng, nhà tài trợ, force majeure. Lộ trình 8 chương.',
  [[
    `<span class="eyebrow">ESP201 · Lesson 0.1 · Overview</span>
<h2>Entertainment &amp; Event Risk Management</h2>
<p class="lead">Producing an event — a concert, a conference, a festival, a product launch — is running a small, time-boxed business: money is committed months ahead of any revenue, contracts bind you to artists and vendors, and a single bad headline can outlast the event itself. This course builds the skills to see those risks coming and to structure a deal, a budget and a policy so they don't sink the show.</p>
<h3>Not this course's focus</h3>
<p>Crowd safety, venue capacity, fire egress and physical hazard management are covered in <strong>ERM301c</strong>. This course is deliberately the <strong>other half</strong>: the risks that show up on a balance sheet, in a contract clause, in a policy exclusion, or in a headline — not in a stampede.</p>
<h3>Roadmap — 8 chapters</h3>
<ul>
<li><strong>Ch.1</strong> Commercial risk overview &amp; ISO 31000 — the shared vocabulary and process.</li>
<li><strong>Ch.2</strong> Financial risk &amp; budgeting — cost overrun, revenue shortfall, break-even.</li>
<li><strong>Ch.3</strong> Contracts &amp; legal risk — artist riders, vendor and venue agreements.</li>
<li><strong>Ch.4</strong> Event insurance — liability, cancellation, weather/adverse-weather cover.</li>
<li><strong>Ch.5</strong> Reputational &amp; brand risk — before, during, after the event.</li>
<li><strong>Ch.6</strong> Sponsor &amp; partner risk — activation failure, exclusivity, payment.</li>
<li><strong>Ch.7</strong> Force majeure, cancellation/postponement &amp; compensation.</li>
<li><strong>Ch.8</strong> Integrated risk governance framework &amp; prevention planning.</li>
</ul>
<div class="callout"><span class="badge">One thread</span> Every chapter uses the same loop: identify → assess (likelihood × impact) → treat (avoid/reduce/transfer/accept) → monitor. Chapter 1 teaches the loop; Chapters 2–7 apply it to one risk domain each; Chapter 8 stitches it back into one governance framework.</div>`,
    `<span class="eyebrow">ESP201 · Bài 0.1 · Tổng quan</span>
<h2>Quản lý rủi ro Sự kiện & Giải trí</h2>
<p class="lead">Tổ chức một sự kiện — concert, hội nghị, lễ hội, ra mắt sản phẩm — thực chất là điều hành một doanh nghiệp nhỏ, có hạn thời gian: tiền phải chi ra nhiều tháng trước khi có doanh thu, hợp đồng ràng buộc bạn với nghệ sĩ và nhà cung cấp, và một tin xấu có thể sống lâu hơn cả sự kiện. Môn này xây kỹ năng thấy trước những rủi ro đó và cấu trúc deal, ngân sách, chính sách để chúng không nhấn chìm cả show.</p>
<h3>Không phải trọng tâm của môn này</h3>
<p>An toàn đám đông, sức chứa địa điểm, thoát hiểm cháy và quản lý hiểm hoạ vật lý được dạy ở <strong>ERM301c</strong>. Môn này chủ đích là <strong>nửa còn lại</strong>: những rủi ro hiện trên bảng cân đối, trong một điều khoản hợp đồng, trong một điểm loại trừ của hợp đồng bảo hiểm, hoặc trên một tin tít — không phải trong một vụ chen lấn.</p>
<h3>Lộ trình — 8 chương</h3>
<ul>
<li><strong>Ch.1</strong> Tổng quan rủi ro thương mại &amp; ISO 31000 — từ vựng và quy trình chung.</li>
<li><strong>Ch.2</strong> Rủi ro tài chính &amp; ngân sách — vượt chi, thiếu doanh thu, điểm hoà vốn.</li>
<li><strong>Ch.3</strong> Hợp đồng &amp; rủi ro pháp lý — rider nghệ sĩ, hợp đồng nhà cung cấp và địa điểm.</li>
<li><strong>Ch.4</strong> Bảo hiểm sự kiện — trách nhiệm, huỷ sự kiện, thời tiết bất lợi.</li>
<li><strong>Ch.5</strong> Rủi ro danh tiếng &amp; thương hiệu — trước, trong, sau sự kiện.</li>
<li><strong>Ch.6</strong> Rủi ro nhà tài trợ &amp; đối tác — activation hỏng, độc quyền, thanh toán.</li>
<li><strong>Ch.7</strong> Force majeure, huỷ/hoãn sự kiện &amp; bồi thường.</li>
<li><strong>Ch.8</strong> Khung quản trị rủi ro tích hợp &amp; lập kế hoạch phòng ngừa.</li>
</ul>
<div class="callout"><span class="badge">Một mạch xuyên suốt</span> Mỗi chương dùng cùng một vòng: nhận diện → đánh giá (khả năng × ảnh hưởng) → xử lý (tránh/giảm/chuyển giao/chấp nhận) → giám sát. Chương 1 dạy vòng này; Chương 2–7 áp dụng cho từng nhóm rủi ro; Chương 8 ráp lại thành một khung quản trị.</div>`,
  ]]);

const c1 = doc('esp201-1-1-overview-iso31000', '1.1 — Commercial risk overview & ISO 31000|||1.1 — Tổng quan rủi ro thương mại & ISO 31000',
  'Rủi ro thương mại sự kiện là gì (khác an toàn đám đông); vòng ISO 31000 (nhận diện-đánh giá-xử lý-giám sát); ma trận khả năng × ảnh hưởng.',
  [[
    `<span class="eyebrow">ESP201 · Chapter 1 · Lesson 1.1</span>
<h2>Commercial risk overview &amp; ISO 31000</h2>
<h3>What counts as "commercial" risk here</h3>
<ul>
<li><strong>Financial</strong> — cost overruns, low ticket/sponsor revenue, cash-flow timing.</li>
<li><strong>Legal/contractual</strong> — a talent, vendor or venue contract that doesn't protect you.</li>
<li><strong>Insurance</strong> — gaps in liability, cancellation or weather cover.</li>
<li><strong>Reputational</strong> — brand damage from a bad outcome, before it becomes a safety incident.</li>
<li><strong>Sponsor/partner</strong> — a partner's activation, exclusivity or payment risk.</li>
<li><strong>Force majeure</strong> — the event can't happen at all, for reasons no one controls.</li>
</ul>
<p>Physical/crowd safety (barricades, egress, medical stations) is a <em>different</em> risk domain, taught in ERM301c — this course assumes it is handled elsewhere and focuses on the money, the paper and the brand.</p>
<h3>The ISO 31000 risk management process</h3>
<pre><code>1. Establish context   -> what is the event, budget, audience, timeline?
2. Identify risks       -> list every "what could go wrong" (register)
3. Analyze              -> likelihood (1-5) x impact (1-5) = risk score
4. Evaluate             -> rank; decide which risks need action now
5. Treat                -> avoid / reduce / transfer (insure, contract) / accept
6. Monitor & review     -> update the register as the event approaches
</code></pre>
<h3>A simple risk matrix</h3>
<pre><code>              Impact: Low   Medium   High
Likelihood High        6      12      20   <- act now
Likelihood Med         3       6      12
Likelihood Low         1       3       6
</code></pre>
<div class="callout"><span class="badge">The register is the artifact</span> Every chapter after this one produces entries for ONE running document: the risk register (risk, likelihood, impact, owner, treatment, status). By Chapter 8 you'll have filled it for every domain in the course.</div>`,
    `<span class="eyebrow">ESP201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan rủi ro thương mại & ISO 31000</h2>
<h3>"Thương mại" ở đây gồm gì</h3>
<ul>
<li><strong>Tài chính</strong> — vượt chi phí, doanh thu vé/tài trợ thấp, lệch thời điểm dòng tiền.</li>
<li><strong>Pháp lý/hợp đồng</strong> — hợp đồng nghệ sĩ, nhà cung cấp hay địa điểm không bảo vệ bạn.</li>
<li><strong>Bảo hiểm</strong> — lỗ hổng trong bảo hiểm trách nhiệm, huỷ sự kiện hoặc thời tiết.</li>
<li><strong>Danh tiếng</strong> — thương hiệu bị tổn hại từ một kết quả xấu, trước khi nó thành sự cố an toàn.</li>
<li><strong>Nhà tài trợ/đối tác</strong> — rủi ro activation, độc quyền hoặc thanh toán của đối tác.</li>
<li><strong>Force majeure</strong> — sự kiện không thể diễn ra vì lý do không ai kiểm soát được.</li>
</ul>
<p>An toàn vật lý/đám đông (rào chắn, thoát hiểm, trạm y tế) là một nhóm rủi ro <em>khác</em>, dạy ở ERM301c — môn này coi phần đó đã có người xử lý riêng và tập trung vào tiền, giấy tờ và thương hiệu.</p>
<h3>Quy trình quản lý rủi ro ISO 31000</h3>
<pre><code>1. Xác lập bối cảnh    -> sự kiện gì, ngân sách, khán giả, mốc thời gian?
2. Nhận diện rủi ro     -> liệt kê mọi "cái gì có thể sai" (sổ rủi ro)
3. Phân tích            -> khả năng (1-5) x ảnh hưởng (1-5) = điểm rủi ro
4. Đánh giá             -> xếp hạng; quyết định rủi ro nào cần xử lý ngay
5. Xử lý                -> tránh / giảm / chuyển giao (bảo hiểm, hợp đồng) / chấp nhận
6. Giám sát & rà lại    -> cập nhật sổ rủi ro khi sự kiện tới gần
</code></pre>
<h3>Ma trận rủi ro đơn giản</h3>
<pre><code>            Ảnh hưởng: Thấp   Trung bình   Cao
Khả năng Cao          6        12          20   <- xử lý ngay
Khả năng T.bình        3         6         12
Khả năng Thấp          1         3          6
</code></pre>
<div class="callout"><span class="badge">Sổ rủi ro là sản phẩm cốt lõi</span> Mọi chương sau chương này đều thêm dòng vào MỘT tài liệu sống: sổ rủi ro (rủi ro, khả năng, ảnh hưởng, người phụ trách, biện pháp xử lý, trạng thái). Đến Chương 8 bạn sẽ điền đủ cho mọi nhóm rủi ro của môn.</div>`,
  ]]);

const c1q = quiz('esp201-quiz-1', 'Quiz 1 — Commercial risk overview & ISO 31000|||Quiz 1 — Tổng quan rủi ro thương mại & ISO 31000', [
  { id: 'q1', question: 'Môn ESP201 tập trung vào nhóm rủi ro nào của sự kiện?', options: ['An toàn đám đông và thoát hiểm', 'Tài chính, pháp lý, bảo hiểm, danh tiếng', 'Thiết kế ánh sáng và âm thanh', 'Sức chứa địa điểm'], correctIndex: 1, explanation: 'ESP201 là góc thương mại (tài chính/pháp lý/hợp đồng/bảo hiểm/danh tiếng); an toàn đám đông thuộc ERM301c.' },
  { id: 'q2', question: 'Theo ISO 31000, sau khi nhận diện và phân tích rủi ro, bước tiếp theo là?', options: ['Quên đi và tổ chức sự kiện', 'Đánh giá rồi xử lý (tránh/giảm/chuyển giao/chấp nhận)', 'Mua bảo hiểm cho mọi rủi ro không phân biệt', 'Chỉ giám sát, không cần xử lý'], correctIndex: 1, explanation: 'Quy trình: nhận diện → phân tích → đánh giá → xử lý → giám sát.' },
  { id: 'q3', question: 'Trong ma trận khả năng × ảnh hưởng, rủi ro "khả năng Cao, ảnh hưởng Cao" nên được?', options: ['Bỏ qua vì hiếm khi xảy ra', 'Xử lý ngay, ưu tiên cao nhất', 'Chỉ ghi vào sổ rủi ro, không hành động', 'Chuyển hết cho nhà tài trợ'], correctIndex: 1, explanation: 'Điểm rủi ro cao nhất (khả năng cao × ảnh hưởng cao) cần hành động ưu tiên trước.' },
]);

const c2 = doc('esp201-2-1-financial-risk-budget', '2.1 — Financial risk & budgeting|||2.1 — Rủi ro tài chính & ngân sách',
  'Vượt chi phí (cost overrun), thiếu doanh thu (revenue shortfall), điểm hoà vốn, quỹ dự phòng (contingency), dòng tiền theo mốc thời gian.',
  [[
    `<span class="eyebrow">ESP201 · Chapter 2 · Lesson 2.1</span>
<h2>Financial risk &amp; budgeting</h2>
<h3>The two failure modes</h3>
<ul>
<li><strong>Cost overrun</strong> — venue, talent, production or catering costs come in above budget (change orders, currency swings, supplier price increases).</li>
<li><strong>Revenue shortfall</strong> — ticket sales, sponsorship or F&amp;B revenue come in below forecast (weak demand, competing events, a sponsor pulling out late).</li>
</ul>
<h3>Break-even &amp; contingency</h3>
<pre><code>Break-even attendance = Fixed costs / (Ticket price - Variable cost per attendee)

Example: Fixed costs 400,000,000 VND
         Ticket price 500,000 VND, variable cost 100,000 VND/person
         Break-even = 400,000,000 / (500,000 - 100,000) = 1,000 attendees
</code></pre>
<p>A standard <strong>contingency reserve</strong> is 10-15% of the total budget, held back and not allocated to any line item — it absorbs the overruns you didn't specifically predict.</p>
<h3>Cash-flow timing risk</h3>
<p>Costs (deposits for venue and talent) are often due <em>months</em> before ticket revenue arrives. A budget that is "profitable on paper" can still fail if cash isn't available when a deposit is due — this is a liquidity risk, distinct from a profitability risk.</p>
<pre><code>Financial risk register (excerpt):
Risk                        Likelihood  Impact  Treatment
Talent fee increase          Medium      High    Fix fee in contract (Ch.3)
Ticket sales below forecast  Medium      High    Tiered pricing + early-bird cap
Vendor deposit due before
  ticket revenue arrives     High        Medium  Sponsor advance / credit line
</code></pre>
<div class="callout"><span class="badge">Budget as a risk tool</span> A line-item budget is not just an accounting document — every line is a place a cost overrun can happen, and the contingency line is where you've pre-decided how much of that you can absorb.</div>`,
    `<span class="eyebrow">ESP201 · Chương 2 · Bài 2.1</span>
<h2>Rủi ro tài chính &amp; ngân sách</h2>
<h3>Hai kiểu thất bại</h3>
<ul>
<li><strong>Vượt chi phí (cost overrun)</strong> — chi phí địa điểm, nghệ sĩ, sản xuất hay ẩm thực vượt ngân sách (yêu cầu thay đổi, biến động tỷ giá, nhà cung cấp tăng giá).</li>
<li><strong>Thiếu doanh thu (revenue shortfall)</strong> — doanh thu vé, tài trợ hay F&amp;B thấp hơn dự báo (nhu cầu yếu, sự kiện cạnh tranh, nhà tài trợ rút muộn).</li>
</ul>
<h3>Điểm hoà vốn &amp; quỹ dự phòng</h3>
<pre><code>Số khách hoà vốn = Chi phí cố định / (Giá vé - Chi phí biến đổi mỗi khách)

Ví dụ: Chi phí cố định 400,000,000 VND
       Giá vé 500,000 VND, chi phí biến đổi 100,000 VND/khách
       Hoà vốn = 400,000,000 / (500,000 - 100,000) = 1,000 khách
</code></pre>
<p><strong>Quỹ dự phòng (contingency reserve)</strong> tiêu chuẩn là 10-15% tổng ngân sách, giữ riêng không gán cho mục nào — dùng để hấp thụ những khoản vượt chi bạn không dự đoán được cụ thể.</p>
<h3>Rủi ro lệch thời điểm dòng tiền</h3>
<p>Chi phí (đặt cọc địa điểm và nghệ sĩ) thường phải trả <em>nhiều tháng</em> trước khi doanh thu vé về. Một ngân sách "có lời trên giấy" vẫn có thể thất bại nếu không có tiền mặt lúc phải đóng cọc — đây là rủi ro thanh khoản, khác với rủi ro lợi nhuận.</p>
<pre><code>Sổ rủi ro tài chính (trích):
Rủi ro                          Khả năng   Ảnh hưởng  Xử lý
Phí nghệ sĩ tăng                 T.bình      Cao       Cố định phí trong hợp đồng (Ch.3)
Doanh thu vé dưới dự báo          T.bình      Cao       Giá theo tầng + hạn mức early-bird
Cọc nhà cung cấp đến hạn trước
  khi có doanh thu vé              Cao        T.bình     Tạm ứng tài trợ / hạn mức tín dụng
</code></pre>
<div class="callout"><span class="badge">Ngân sách là công cụ rủi ro</span> Ngân sách theo dòng không chỉ là tài liệu kế toán — mỗi dòng là một nơi có thể vượt chi, và dòng dự phòng là nơi bạn đã quyết định trước sẽ hấp thụ được bao nhiêu.</div>`,
  ]]);

const c2q = quiz('esp201-quiz-2', 'Quiz 2 — Financial risk & budgeting|||Quiz 2 — Rủi ro tài chính & ngân sách', [
  { id: 'q1', question: 'Quỹ dự phòng (contingency reserve) tiêu chuẩn thường chiếm bao nhiêu % tổng ngân sách?', options: ['1-2%', '10-15%', '50%', '0%, không cần dự phòng'], correctIndex: 1, explanation: '10-15% tổng ngân sách là mức phổ biến, giữ riêng để hấp thụ vượt chi không dự đoán cụ thể.' },
  { id: 'q2', question: 'Rủi ro "phải đóng cọc địa điểm trước khi có doanh thu vé" thuộc loại rủi ro nào?', options: ['Rủi ro lợi nhuận', 'Rủi ro thanh khoản (lệch thời điểm dòng tiền)', 'Rủi ro danh tiếng', 'Rủi ro pháp lý'], correctIndex: 1, explanation: 'Đây là rủi ro thanh khoản: ngân sách có thể "lời trên giấy" nhưng vẫn thiếu tiền mặt đúng lúc.' },
  { id: 'q3', question: 'Điểm hoà vốn (break-even attendance) được tính bằng?', options: ['Chi phí cố định / (Giá vé − Chi phí biến đổi/khách)', 'Tổng doanh thu / Tổng chi phí', 'Giá vé × Số khách dự kiến', 'Chi phí biến đổi / Chi phí cố định'], correctIndex: 0, explanation: 'Break-even = Chi phí cố định chia cho biên góp mỗi khách (giá vé trừ chi phí biến đổi).' },
]);

const c3 = doc('esp201-3-1-contracts-legal-risk', '3.1 — Contracts & legal risk|||3.1 — Hợp đồng & rủi ro pháp lý',
  'Hợp đồng nghệ sĩ (rider, điều khoản huỷ), hợp đồng nhà cung cấp/địa điểm, điều khoản bồi thường (indemnification), bản quyền & giấy phép.',
  [[
    `<span class="eyebrow">ESP201 · Chapter 3 · Lesson 3.1</span>
<h2>Contracts &amp; legal risk</h2>
<h3>Why the contract IS the risk-management tool</h3>
<p>Every commercial risk you can't avoid, you can try to <strong>push onto the party best able to bear it</strong> — that push happens in the contract's wording. A verbal agreement or a one-page "deal memo" leaves every ambiguity to be resolved after something has already gone wrong.</p>
<h3>Artist / talent contracts</h3>
<ul>
<li><strong>Rider</strong> — technical (sound, stage, power) and hospitality (dressing room, catering) requirements; failing to meet it can be a breach.</li>
<li><strong>Cancellation clause</strong> — who can cancel, under what notice, and what deposit is forfeited or refunded.</li>
<li><strong>Force majeure clause</strong> — see Chapter 7; without one, "the venue flooded" is not automatically a legal excuse.</li>
<li><strong>Exclusivity / non-compete</strong> — can the artist play a competing show nearby before/after your date?</li>
</ul>
<h3>Vendor &amp; venue contracts</h3>
<ul>
<li><strong>Scope &amp; deliverables</strong> — exactly what is provided, by when, to what spec.</li>
<li><strong>Indemnification clause</strong> — which party compensates the other if a third party sues over that party's negligence.</li>
<li><strong>Insurance requirement clause</strong> — the contract itself can require the vendor to carry liability insurance and list you as "additional insured" (ties directly into Chapter 4).</li>
<li><strong>Payment schedule &amp; penalties</strong> — deposit, milestone payments, late-delivery penalties.</li>
</ul>
<pre><code>Contract risk checklist:
[ ] Scope of work is specific (not "production services" alone)
[ ] Cancellation/refund terms for BOTH sides
[ ] Force majeure clause defined (not left to default law)
[ ] Indemnification is mutual, not one-sided
[ ] Vendor must carry insurance + list organizer as additional insured
[ ] Payment milestones tied to deliverables, not just dates
</code></pre>
<div class="callout"><span class="badge">Read before you sign</span> The riskiest moment in event production is not the show — it's the month you sign contracts while nothing has "gone wrong" yet, so the terms feel unimportant. That's exactly when they must be right.</div>`,
    `<span class="eyebrow">ESP201 · Chương 3 · Bài 3.1</span>
<h2>Hợp đồng &amp; rủi ro pháp lý</h2>
<h3>Vì sao hợp đồng CHÍNH LÀ công cụ quản lý rủi ro</h3>
<p>Mọi rủi ro thương mại bạn không tránh được, bạn có thể cố <strong>đẩy sang bên có khả năng chịu tốt nhất</strong> — việc đẩy đó nằm trong câu chữ hợp đồng. Một thoả thuận miệng hay "deal memo" một trang để lại mọi mập mờ tới lúc có chuyện đã xảy ra rồi mới giải quyết.</p>
<h3>Hợp đồng nghệ sĩ / talent</h3>
<ul>
<li><strong>Rider</strong> — yêu cầu kỹ thuật (âm thanh, sân khấu, điện) và hậu trường (phòng thay đồ, ẩm thực); không đáp ứng có thể coi là vi phạm hợp đồng.</li>
<li><strong>Điều khoản huỷ</strong> — ai được huỷ, báo trước bao lâu, và tiền cọc mất hay được hoàn.</li>
<li><strong>Điều khoản force majeure</strong> — xem Chương 7; không có điều khoản này, "địa điểm bị ngập" không tự động là lý do pháp lý hợp lệ.</li>
<li><strong>Độc quyền / không cạnh tranh</strong> — nghệ sĩ có được diễn show cạnh tranh gần đó trước/sau ngày của bạn không?</li>
</ul>
<h3>Hợp đồng nhà cung cấp &amp; địa điểm</h3>
<ul>
<li><strong>Phạm vi &amp; sản phẩm giao</strong> — chính xác cung cấp gì, khi nào, theo tiêu chuẩn nào.</li>
<li><strong>Điều khoản bồi thường (indemnification)</strong> — bên nào đền bên kia nếu bên thứ ba khởi kiện do lỗi của bên đó.</li>
<li><strong>Điều khoản yêu cầu bảo hiểm</strong> — hợp đồng có thể buộc nhà cung cấp phải có bảo hiểm trách nhiệm và ghi bạn là "additional insured" (nối thẳng sang Chương 4).</li>
<li><strong>Lịch thanh toán &amp; phạt</strong> — tiền cọc, thanh toán theo cột mốc, phạt giao chậm.</li>
</ul>
<pre><code>Checklist rủi ro hợp đồng:
[ ] Phạm vi công việc cụ thể (không chỉ ghi "dịch vụ sản xuất")
[ ] Điều khoản huỷ/hoàn tiền cho CẢ HAI bên
[ ] Điều khoản force majeure được định nghĩa (không để luật mặc định)
[ ] Bồi thường là hai chiều, không nghiêng về một bên
[ ] Nhà cung cấp phải có bảo hiểm + ghi bên tổ chức là additional insured
[ ] Cột mốc thanh toán gắn với sản phẩm giao, không chỉ theo ngày
</code></pre>
<div class="callout"><span class="badge">Đọc kỹ trước khi ký</span> Thời điểm rủi ro nhất trong sản xuất sự kiện không phải là lúc diễn — mà là tháng bạn ký hợp đồng khi chưa có gì "xảy ra sai", nên các điều khoản có vẻ không quan trọng. Chính lúc đó chúng phải đúng.</div>`,
  ]]);

const c3q = quiz('esp201-quiz-3', 'Quiz 3 — Contracts & legal risk|||Quiz 3 — Hợp đồng & rủi ro pháp lý', [
  { id: 'q1', question: '"Rider" trong hợp đồng nghệ sĩ thường quy định điều gì?', options: ['Lịch phát hành vé', 'Yêu cầu kỹ thuật và hậu trường của nghệ sĩ', 'Mức thuế sự kiện', 'Số lượng khán giả tối đa'], correctIndex: 1, explanation: 'Rider gồm yêu cầu kỹ thuật (âm thanh, sân khấu, điện) và hậu trường (phòng thay đồ, ẩm thực).' },
  { id: 'q2', question: 'Điều khoản bồi thường (indemnification) trong hợp đồng nhà cung cấp dùng để?', options: ['Quy định giá vé', 'Xác định bên nào đền bên kia khi bên thứ ba khởi kiện do lỗi của một bên', 'Thay cho bảo hiểm', 'Chỉ áp dụng cho nghệ sĩ'], correctIndex: 1, explanation: 'Indemnification xác định trách nhiệm bồi thường khi có khiếu kiện từ bên thứ ba do lỗi của một bên trong hợp đồng.' },
  { id: 'q3', question: 'Vì sao hợp đồng nên yêu cầu nhà cung cấp có bảo hiểm và ghi bên tổ chức là "additional insured"?', options: ['Để giảm giá dịch vụ', 'Để chuyển một phần rủi ro trách nhiệm sang bảo hiểm của nhà cung cấp', 'Vì luật bắt buộc mọi hợp đồng phải có', 'Để thay thế hợp đồng bằng bảo hiểm'], correctIndex: 1, explanation: 'Đây là cách chuyển giao rủi ro (risk transfer) — nối trực tiếp với bảo hiểm sự kiện ở Chương 4.' },
]);

const c4 = doc('esp201-4-1-event-insurance', '4.1 — Event insurance|||4.1 — Bảo hiểm sự kiện',
  'Bảo hiểm trách nhiệm (general/liquor liability), bảo hiểm huỷ sự kiện (cancellation), bảo hiểm thời tiết bất lợi (adverse weather), điểm loại trừ (exclusions).',
  [[
    `<span class="eyebrow">ESP201 · Chapter 4 · Lesson 4.1</span>
<h2>Event insurance</h2>
<h3>Insurance is risk TRANSFER, not risk removal</h3>
<p>Insurance doesn't stop a bad thing from happening — it moves the <em>financial consequence</em> to an insurer, for a premium, up to a policy limit, minus a deductible, and subject to exclusions. Reading the exclusions matters as much as reading the coverage.</p>
<h3>Core policy types for events</h3>
<ul>
<li><strong>General liability</strong> — covers third-party bodily injury or property damage claims arising from the event (a guest slips, equipment damages the venue).</li>
<li><strong>Liquor liability</strong> — a separate policy (or endorsement) if alcohol is served; general liability often excludes alcohol-related claims by default.</li>
<li><strong>Event cancellation insurance</strong> — reimburses lost revenue/deposits if the event is cancelled, postponed, interrupted or relocated for a covered reason (illness of a headline act, venue becoming unusable, non-appearance).</li>
<li><strong>Adverse weather cover</strong> — a specific rider (often for outdoor events) triggered by defined weather thresholds (e.g. rainfall above X mm, wind above Y km/h) on the event date — it pays out on the trigger, independent of whether the event actually proceeded.</li>
</ul>
<h3>Reading a policy: the parts that matter</h3>
<pre><code>Policy element        What to check
Coverage limit         Is it enough for your venue's worst-case claim?
Deductible             What you pay first, before insurer pays
Exclusions             Named causes NOT covered (e.g. pandemic, terrorism,
                       "communicable disease" — common post-2020 exclusion)
Named perils vs.
  all-risk cancellation Named-peril = only listed causes trigger payout;
                       all-risk = broader, but usually costs more
Additional insured     Does it extend to your vendors/venue as required
                       by their contracts (Ch.3)?
</code></pre>
<div class="callout"><span class="badge">Buy insurance BEFORE the risk is known</span> Cancellation and weather cover must usually be bound well before the event and often exclude risks already "known" at purchase (e.g. a storm already forecast, a headliner already reportedly unwell) — insurance is for the unknown, not for damage control after the fact.</div>`,
    `<span class="eyebrow">ESP201 · Chương 4 · Bài 4.1</span>
<h2>Bảo hiểm sự kiện</h2>
<h3>Bảo hiểm là CHUYỂN GIAO rủi ro, không phải loại bỏ rủi ro</h3>
<p>Bảo hiểm không ngăn việc xấu xảy ra — nó chuyển <em>hậu quả tài chính</em> sang công ty bảo hiểm, đổi lấy phí bảo hiểm, trong hạn mức hợp đồng, sau khi trừ mức khấu trừ (deductible), và tuỳ theo các điểm loại trừ. Đọc điểm loại trừ quan trọng không kém đọc phạm vi bảo hiểm.</p>
<h3>Các loại bảo hiểm cốt lõi cho sự kiện</h3>
<ul>
<li><strong>Trách nhiệm chung (general liability)</strong> — chi trả khiếu kiện của bên thứ ba về thương tích hoặc thiệt hại tài sản phát sinh từ sự kiện (khách trượt ngã, thiết bị làm hỏng địa điểm).</li>
<li><strong>Trách nhiệm liên quan rượu bia (liquor liability)</strong> — một hợp đồng riêng (hoặc điều khoản bổ sung) nếu có phục vụ rượu; bảo hiểm trách nhiệm chung thường loại trừ khiếu kiện liên quan rượu theo mặc định.</li>
<li><strong>Bảo hiểm huỷ sự kiện</strong> — bồi thường doanh thu/tiền cọc mất nếu sự kiện bị huỷ, hoãn, gián đoạn hoặc phải đổi địa điểm vì lý do được bảo hiểm (nghệ sĩ chính ốm, địa điểm không thể sử dụng, không xuất hiện).</li>
<li><strong>Bảo hiểm thời tiết bất lợi</strong> — điều khoản riêng (thường cho sự kiện ngoài trời) kích hoạt theo ngưỡng thời tiết định trước (vd lượng mưa trên X mm, gió trên Y km/h) vào ngày sự kiện — chi trả khi đạt ngưỡng, bất kể sự kiện có diễn ra hay không.</li>
</ul>
<h3>Đọc hợp đồng bảo hiểm: những phần quan trọng</h3>
<pre><code>Thành phần hợp đồng      Cần kiểm
Hạn mức bồi thường        Đủ cho khiếu kiện xấu nhất tại địa điểm chưa?
Mức khấu trừ              Phần bạn trả trước, trước khi bảo hiểm trả
Điểm loại trừ             Nguyên nhân được NÊU RÕ KHÔNG được bảo hiểm
                          (vd đại dịch, khủng bố, "bệnh truyền nhiễm" —
                          loại trừ phổ biến sau 2020)
Nguyên nhân được nêu tên
  vs. mọi rủi ro (all-risk) Nêu tên = chỉ nguyên nhân trong danh sách
                          mới được trả; all-risk = rộng hơn nhưng
                          thường đắt hơn
Additional insured        Có mở rộng cho nhà cung cấp/địa điểm theo
                          yêu cầu hợp đồng của họ không (Ch.3)?
</code></pre>
<div class="callout"><span class="badge">Mua bảo hiểm TRƯỚC KHI rủi ro đã lộ rõ</span> Bảo hiểm huỷ sự kiện và thời tiết thường phải ký từ rất sớm và hay loại trừ rủi ro đã "biết trước" lúc mua (vd bão đã được dự báo, nghệ sĩ chính đã được đồn ốm) — bảo hiểm dành cho cái chưa biết, không phải để chữa cháy sau khi đã biết.</div>`,
  ]]);

const c4q = quiz('esp201-quiz-4', 'Quiz 4 — Event insurance|||Quiz 4 — Bảo hiểm sự kiện', [
  { id: 'q1', question: 'Bảo hiểm về bản chất làm gì với rủi ro?', options: ['Loại bỏ hoàn toàn rủi ro', 'Chuyển hậu quả tài chính sang công ty bảo hiểm, có hạn mức và loại trừ', 'Ngăn sự kiện xấu xảy ra', 'Thay thế hoàn toàn cho hợp đồng'], correctIndex: 1, explanation: 'Bảo hiểm là công cụ CHUYỂN GIAO rủi ro tài chính, không phải loại bỏ rủi ro.' },
  { id: 'q2', question: 'Bảo hiểm thời tiết bất lợi (adverse weather) cho sự kiện ngoài trời được kích hoạt khi nào?', options: ['Chỉ khi ban tổ chức chủ động huỷ sự kiện', 'Khi đạt ngưỡng thời tiết định trước (vd mưa/gió vượt mức), bất kể sự kiện có diễn ra', 'Chỉ khi có thương vong', 'Không bao giờ áp dụng cho sự kiện ngoài trời'], correctIndex: 1, explanation: 'Đây là bảo hiểm theo ngưỡng (parametric-style): trả tiền khi đạt ngưỡng thời tiết, độc lập với việc sự kiện có tiếp diễn hay không.' },
  { id: 'q3', question: 'Vì sao cần đọc kỹ "điểm loại trừ" (exclusions) trong hợp đồng bảo hiểm sự kiện?', options: ['Vì đó là phần không quan trọng', 'Vì đó là các nguyên nhân KHÔNG được bồi thường dù có vẻ liên quan', 'Vì luật yêu cầu phải đọc to trước khách', 'Vì điểm loại trừ luôn tăng phí bảo hiểm'], correctIndex: 1, explanation: 'Điểm loại trừ nêu rõ nguyên nhân không được chi trả (vd bệnh truyền nhiễm) — bỏ qua phần này dễ hiểu nhầm về phạm vi bảo hiểm thật.' },
]);

const c5 = doc('esp201-5-1-reputational-brand-risk', '5.1 — Reputational & brand risk|||5.1 — Rủi ro danh tiếng & thương hiệu',
  'Rủi ro danh tiếng trước/trong/sau sự kiện; khủng hoảng truyền thông; kế hoạch phát ngôn (holding statement); giám sát mạng xã hội.',
  [[
    `<span class="eyebrow">ESP201 · Chapter 5 · Lesson 5.1</span>
<h2>Reputational &amp; brand risk</h2>
<h3>Reputation risk has three timelines</h3>
<ul>
<li><strong>Before</strong> — a controversial sponsor, a lineup announcement that draws backlash, an artist with a public scandal.</li>
<li><strong>During</strong> — a technical failure, a visibly unequal experience for different ticket tiers, a moment caught on camera and shared.</li>
<li><strong>After</strong> — how refunds/complaints are handled, whether promises (line-up, production values) matched delivery.</li>
</ul>
<p>A financial loss and a reputational loss can be independent: an event can break even financially and still damage the brand for years (or vice versa) — treat them as two separate lines in the risk register, not one.</p>
<h3>Building a crisis communication plan</h3>
<pre><code>Crisis comms checklist:
[ ] Single spokesperson identified BEFORE the event
[ ] Holding statement drafted in advance (acknowledge, no speculation)
[ ] Escalation path: who decides to speak publicly, and how fast
[ ] Social media monitoring during the event (not just after)
[ ] Refund/complaint policy decided in advance, not improvised live
[ ] Legal review of any public statement before it is issued
</code></pre>
<h3>A holding statement, structurally</h3>
<p>A holding statement buys time without creating new legal or factual exposure: acknowledge what is known, state that it is being addressed, commit to an update — and say nothing about cause or blame until verified.</p>
<div class="callout"><span class="badge">Silence is also a choice</span> Not responding to a visible incident is itself a communications decision, usually the wrong one — audiences fill an information gap with the worst assumption available.</div>`,
    `<span class="eyebrow">ESP201 · Chương 5 · Bài 5.1</span>
<h2>Rủi ro danh tiếng &amp; thương hiệu</h2>
<h3>Rủi ro danh tiếng có ba mốc thời gian</h3>
<ul>
<li><strong>Trước</strong> — nhà tài trợ gây tranh cãi, công bố line-up gây phản ứng ngược, nghệ sĩ đang có scandal công khai.</li>
<li><strong>Trong lúc diễn ra</strong> — lỗi kỹ thuật, trải nghiệm rõ ràng bất bình đẳng giữa các hạng vé, một khoảnh khắc bị quay lại và lan truyền.</li>
<li><strong>Sau khi kết thúc</strong> — cách xử lý hoàn tiền/khiếu nại, việc lời hứa (line-up, chất lượng sản xuất) có khớp với thực tế không.</li>
</ul>
<p>Tổn thất tài chính và tổn thất danh tiếng có thể độc lập với nhau: một sự kiện có thể hoà vốn về tài chính nhưng vẫn hại thương hiệu nhiều năm (hoặc ngược lại) — coi đây là hai dòng riêng trong sổ rủi ro, không phải một.</p>
<h3>Xây kế hoạch truyền thông khủng hoảng</h3>
<pre><code>Checklist truyền thông khủng hoảng:
[ ] Đã xác định MỘT người phát ngôn TRƯỚC sự kiện
[ ] Đã soạn sẵn "holding statement" (ghi nhận, không suy đoán)
[ ] Có đường leo thang: ai quyết định phát ngôn công khai, nhanh thế nào
[ ] Giám sát mạng xã hội TRONG lúc sự kiện (không chỉ sau đó)
[ ] Chính sách hoàn tiền/khiếu nại quyết định trước, không bịa lúc trực tiếp
[ ] Rà pháp lý mọi phát ngôn công khai trước khi đưa ra
</code></pre>
<h3>Cấu trúc của một "holding statement"</h3>
<p>Holding statement mua thời gian mà không tạo thêm rủi ro pháp lý hay sự thật mới: ghi nhận điều đã biết, nói rằng đang xử lý, hứa sẽ cập nhật — và không nói gì về nguyên nhân hay lỗi cho tới khi xác minh được.</p>
<div class="callout"><span class="badge">Im lặng cũng là một lựa chọn</span> Không phản hồi một sự cố đã lộ ra chính nó là một quyết định truyền thông, thường là sai — công chúng lấp khoảng trống thông tin bằng giả định xấu nhất có thể.</div>`,
  ]]);

const c5q = quiz('esp201-quiz-5', 'Quiz 5 — Reputational & brand risk|||Quiz 5 — Rủi ro danh tiếng & thương hiệu', [
  { id: 'q1', question: 'Vì sao rủi ro tài chính và rủi ro danh tiếng nên được ghi thành hai dòng riêng trong sổ rủi ro?', options: ['Vì chúng luôn xảy ra cùng lúc', 'Vì một sự kiện có thể hoà vốn tài chính nhưng vẫn hại thương hiệu (hoặc ngược lại)', 'Vì luật yêu cầu tách riêng', 'Vì rủi ro danh tiếng không cần theo dõi'], correctIndex: 1, explanation: 'Hai loại tổn thất có thể độc lập với nhau, nên cần đánh giá và xử lý riêng.' },
  { id: 'q2', question: '"Holding statement" trong khủng hoảng truyền thông nên tránh điều gì?', options: ['Ghi nhận sự việc đã biết', 'Suy đoán nguyên nhân hoặc đổ lỗi khi chưa xác minh', 'Hứa sẽ cập nhật thêm', 'Có một người phát ngôn duy nhất'], correctIndex: 1, explanation: 'Holding statement chỉ ghi nhận và hứa cập nhật, không suy đoán nguyên nhân/lỗi trước khi xác minh.' },
  { id: 'q3', question: 'Không phản hồi công khai khi một sự cố đã lan truyền thường dẫn tới hậu quả gì?', options: ['Công chúng sẽ tự đợi thông tin chính thức', 'Công chúng lấp khoảng trống bằng giả định xấu nhất', 'Không có hậu quả gì vì im lặng luôn an toàn', 'Sự cố sẽ tự biến mất nhanh hơn'], correctIndex: 1, explanation: 'Im lặng là một quyết định truyền thông; nó thường bị lấp bằng những giả định tiêu cực nhất.' },
]);

const c6 = doc('esp201-6-1-sponsor-partner-risk', '6.1 — Sponsor & partner risk|||6.1 — Rủi ro nhà tài trợ & đối tác',
  'Rủi ro activation thất bại, xung đột độc quyền (category exclusivity), rủi ro thanh toán nhà tài trợ, đo lường ROI cam kết.',
  [[
    `<span class="eyebrow">ESP201 · Chapter 6 · Lesson 6.1</span>
<h2>Sponsor &amp; partner risk</h2>
<h3>Sponsorship is a two-way contract, not a gift</h3>
<p>A sponsor pays for defined deliverables (logo placement, stage time, activation space, data capture) in exchange for money or in-kind support. Every deliverable you promised but can't produce is a <strong>breach</strong>, not just a disappointment — and most sponsorship agreements have their own cancellation and refund clauses, mirroring Chapter 3.</p>
<h3>Common sponsor/partner risks</h3>
<ul>
<li><strong>Activation failure</strong> — the sponsor's on-site booth, sampling, or branded moment doesn't happen as promised (space, power, or scheduling conflict).</li>
<li><strong>Category exclusivity conflicts</strong> — you promised "official beverage sponsor" to one brand, then a competing brand appears via a different vendor or another sponsor's activation.</li>
<li><strong>Payment risk</strong> — a sponsor withdraws or delays payment after you've already spent against expected sponsorship revenue (a financial risk, Chapter 2, triggered by a partner decision).</li>
<li><strong>Reputational spillover</strong> — a sponsor's own controversy becomes associated with your event (links to Chapter 5).</li>
</ul>
<pre><code>Sponsor risk register (excerpt):
Risk                             Treatment
Exclusivity conflict              Written category-exclusivity clause +
                                   vendor contracts checked against it
Activation space double-booked    Site plan sign-off by sponsor before contract
Late/partial sponsor payment      Milestone-based payment tied to deliverables,
                                   deposit non-refundable
</code></pre>
<div class="callout"><span class="badge">Deliverables need an owner</span> Every sponsor promise in the contract should map to one person on the production team accountable for it — an unowned deliverable is where activation failures come from.</div>`,
    `<span class="eyebrow">ESP201 · Chương 6 · Bài 6.1</span>
<h2>Rủi ro nhà tài trợ &amp; đối tác</h2>
<h3>Tài trợ là hợp đồng hai chiều, không phải quà tặng</h3>
<p>Nhà tài trợ trả tiền cho các sản phẩm giao cụ thể (logo, thời gian trên sân khấu, không gian activation, thu thập dữ liệu) đổi lại tiền hoặc hỗ trợ hiện vật. Mỗi cam kết bạn đã hứa nhưng không thực hiện được là một <strong>vi phạm hợp đồng</strong>, không chỉ là sự thất vọng — và hầu hết hợp đồng tài trợ có điều khoản huỷ/hoàn tiền riêng, tương tự Chương 3.</p>
<h3>Rủi ro thường gặp với nhà tài trợ/đối tác</h3>
<ul>
<li><strong>Activation thất bại</strong> — gian hàng, khu trải nghiệm, hay khoảnh khắc thương hiệu của nhà tài trợ không diễn ra như hứa (thiếu không gian, điện, hoặc trùng lịch).</li>
<li><strong>Xung đột độc quyền theo ngành hàng</strong> — bạn hứa "nhà tài trợ đồ uống chính thức" cho một hãng, rồi hãng cạnh tranh xuất hiện qua nhà cung cấp khác hoặc activation của nhà tài trợ khác.</li>
<li><strong>Rủi ro thanh toán</strong> — nhà tài trợ rút hoặc trì hoãn thanh toán sau khi bạn đã chi dựa trên doanh thu tài trợ dự kiến (rủi ro tài chính ở Chương 2, do quyết định của đối tác gây ra).</li>
<li><strong>Lan tỏa danh tiếng ngược</strong> — tranh cãi của chính nhà tài trợ bị gắn liền với sự kiện của bạn (liên quan Chương 5).</li>
</ul>
<pre><code>Sổ rủi ro nhà tài trợ (trích):
Rủi ro                              Xử lý
Xung đột độc quyền                    Điều khoản độc quyền ngành hàng bằng
                                       văn bản + rà hợp đồng nhà cung cấp
Không gian activation bị trùng        Sponsor ký duyệt sơ đồ mặt bằng trước
                                       khi ký hợp đồng
Thanh toán trễ/thiếu của tài trợ      Thanh toán theo cột mốc gắn với sản
                                       phẩm giao, tiền cọc không hoàn lại
</code></pre>
<div class="callout"><span class="badge">Mỗi cam kết cần một người chịu trách nhiệm</span> Mọi lời hứa với nhà tài trợ trong hợp đồng nên gắn với một người cụ thể trong đội sản xuất chịu trách nhiệm — cam kết vô chủ chính là nơi activation thất bại bắt đầu.</div>`,
  ]]);

const c6q = quiz('esp201-quiz-6', 'Quiz 6 — Sponsor & partner risk|||Quiz 6 — Rủi ro nhà tài trợ & đối tác', [
  { id: 'q1', question: 'Không thực hiện được một sản phẩm giao đã hứa với nhà tài trợ được coi là?', options: ['Chuyện bình thường, không có hậu quả', 'Vi phạm hợp đồng tài trợ', 'Chỉ là vấn đề truyền thông, không liên quan hợp đồng', 'Trách nhiệm của nhà tài trợ, không phải ban tổ chức'], correctIndex: 1, explanation: 'Sponsorship là hợp đồng; không thực hiện cam kết là vi phạm hợp đồng, có thể kéo theo điều khoản huỷ/hoàn tiền.' },
  { id: 'q2', question: 'Xung đột "độc quyền ngành hàng" (category exclusivity) xảy ra khi nào?', options: ['Khi chỉ có một nhà tài trợ duy nhất', 'Khi một hãng cạnh tranh xuất hiện dù đã hứa độc quyền ngành hàng cho hãng khác', 'Khi nhà tài trợ trả tiền đúng hạn', 'Khi sự kiện không có nhà tài trợ nào'], correctIndex: 1, explanation: 'Đây là rủi ro khi lời hứa độc quyền bị phá vì một thương hiệu cạnh tranh lọt vào qua kênh khác (vendor, sponsor khác).' },
  { id: 'q3', question: 'Cách phòng ngừa "activation bị trùng không gian" hiệu quả nhất là?', options: ['Không lập sơ đồ mặt bằng', 'Cho nhà tài trợ ký duyệt sơ đồ mặt bằng trước khi ký hợp đồng', 'Chỉ thông báo miệng vào ngày sự kiện', 'Bỏ qua vì hiếm khi xảy ra'], correctIndex: 1, explanation: 'Ký duyệt sơ đồ mặt bằng trước hợp đồng giúp tránh trùng không gian activation giữa các nhà tài trợ.' },
]);

const c7 = doc('esp201-7-1-force-majeure-cancellation', '7.1 — Force majeure, cancellation/postponement & compensation|||7.1 — Force majeure, huỷ/hoãn sự kiện & bồi thường',
  'Định nghĩa force majeure trong hợp đồng, phân biệt huỷ vs hoãn, nghĩa vụ giảm thiểu thiệt hại (mitigation), thứ tự bồi thường các bên.',
  [[
    `<span class="eyebrow">ESP201 · Chapter 7 · Lesson 7.1</span>
<h2>Force majeure, cancellation/postponement &amp; compensation</h2>
<h3>Force majeure is defined by the contract, not by common sense</h3>
<p>"Force majeure" (superior force) excuses a party from performance for events beyond its reasonable control — but only for the events the <strong>contract actually lists</strong> (natural disaster, war, government order, pandemic, etc.). A cause not listed and not covered by default local law leaves the non-performing party in breach, full stop. This is why Chapter 3's checklist insists the clause be explicit.</p>
<h3>Cancellation vs. postponement</h3>
<ul>
<li><strong>Cancellation</strong> — the event will not happen at all; contracts typically address refunds, forfeited deposits, and whether talent/vendor fees are still owed in part.</li>
<li><strong>Postponement</strong> — the event moves to a new date; well-drafted contracts fix whether existing deposits, tickets and vendor bookings roll over automatically, and under what deadline a new date must be set.</li>
</ul>
<h3>The duty to mitigate</h3>
<p>Even under force majeure, most jurisdictions and most well-drafted contracts still expect the affected party to take reasonable steps to reduce the damage (rebooking a venue promptly, notifying ticket holders quickly, seeking a partial refund from upstream vendors) — a party that does nothing can lose the force majeure defense on the mitigation point alone.</p>
<pre><code>Compensation order when an event cancels (typical, contract-dependent):
1. Return/hold ticket revenue (often escrowed or holdable by law)
2. Settle with vendors/venue per their contract's cancellation terms
3. Claim event cancellation insurance for the resulting loss (Ch.4)
4. Absorb remainder via contingency reserve (Ch.2)
</code></pre>
<div class="callout"><span class="badge">Insurance and force majeure are linked, not the same</span> A force majeure clause changes who is in breach of the CONTRACT; cancellation insurance changes who bears the FINANCIAL loss. You need both — one without the other leaves a gap.</div>`,
    `<span class="eyebrow">ESP201 · Chương 7 · Bài 7.1</span>
<h2>Force majeure, huỷ/hoãn sự kiện &amp; bồi thường</h2>
<h3>Force majeure được định nghĩa bởi hợp đồng, không phải bởi lẽ thường</h3>
<p>"Force majeure" (bất khả kháng) miễn trừ nghĩa vụ thực hiện cho một bên vì sự kiện ngoài khả năng kiểm soát hợp lý — nhưng CHỈ với những sự kiện <strong>hợp đồng thực sự liệt kê</strong> (thiên tai, chiến tranh, lệnh của chính phủ, đại dịch, v.v.). Một nguyên nhân không được liệt kê và không được luật địa phương mặc định bảo vệ khiến bên không thực hiện được coi là vi phạm hợp đồng, đơn giản vậy. Đây là lý do checklist ở Chương 3 nhấn mạnh điều khoản này phải rõ ràng.</p>
<h3>Huỷ (cancellation) vs. hoãn (postponement)</h3>
<ul>
<li><strong>Huỷ</strong> — sự kiện sẽ không diễn ra nữa; hợp đồng thường quy định hoàn tiền, tiền cọc bị mất, và liệu phí nghệ sĩ/nhà cung cấp có còn phải trả một phần.</li>
<li><strong>Hoãn</strong> — sự kiện chuyển sang ngày khác; hợp đồng soạn kỹ sẽ quy định tiền cọc, vé và booking nhà cung cấp có tự động chuyển sang ngày mới không, và hạn phải chốt ngày mới là bao lâu.</li>
</ul>
<h3>Nghĩa vụ giảm thiểu thiệt hại (duty to mitigate)</h3>
<p>Ngay cả trong trường hợp force majeure, hầu hết pháp luật và hợp đồng soạn kỹ vẫn kỳ vọng bên bị ảnh hưởng có hành động hợp lý để giảm thiệt hại (đặt lại địa điểm nhanh chóng, thông báo người mua vé kịp thời, xin hoàn một phần từ nhà cung cấp phía trên) — bên không làm gì có thể mất luôn quyền viện dẫn force majeure chỉ vì điểm giảm thiểu này.</p>
<pre><code>Thứ tự bồi thường khi sự kiện bị huỷ (điển hình, tuỳ hợp đồng):
1. Hoàn/giữ doanh thu vé (thường bị luật yêu cầu ký quỹ/giữ riêng)
2. Thanh toán với nhà cung cấp/địa điểm theo điều khoản huỷ của họ
3. Yêu cầu bảo hiểm huỷ sự kiện cho phần thiệt hại còn lại (Ch.4)
4. Phần còn lại hấp thụ qua quỹ dự phòng (Ch.2)
</code></pre>
<div class="callout"><span class="badge">Bảo hiểm và force majeure liên quan nhưng KHÔNG giống nhau</span> Điều khoản force majeure thay đổi ai vi phạm HỢP ĐỒNG; bảo hiểm huỷ sự kiện thay đổi ai chịu THIỆT HẠI TÀI CHÍNH. Cần cả hai — thiếu một trong hai sẽ để lại lỗ hổng.</div>`,
  ]]);

const c7q = quiz('esp201-quiz-7', 'Quiz 7 — Force majeure & cancellation|||Quiz 7 — Force majeure & huỷ/hoãn sự kiện', [
  { id: 'q1', question: 'Một nguyên nhân KHÔNG được liệt kê trong điều khoản force majeure của hợp đồng thì thường được xử lý thế nào?', options: ['Vẫn tự động được miễn trừ vì "hợp lý"', 'Không được coi là force majeure, bên không thực hiện có thể bị coi là vi phạm hợp đồng', 'Luật quốc tế luôn bảo vệ mọi trường hợp', 'Không ảnh hưởng vì force majeure luôn áp dụng'], correctIndex: 1, explanation: 'Force majeure được định nghĩa bởi câu chữ hợp đồng; nguyên nhân không được liệt kê và không có luật mặc định bảo vệ thì không được miễn trừ.' },
  { id: 'q2', question: '"Nghĩa vụ giảm thiểu thiệt hại" (duty to mitigate) yêu cầu bên bị ảnh hưởng phải làm gì?', options: ['Không cần làm gì vì force majeure đã miễn trừ mọi trách nhiệm', 'Có hành động hợp lý để giảm thiệt hại, dù đang trong trường hợp force majeure', 'Chỉ áp dụng cho nhà tài trợ', 'Chỉ áp dụng nếu có bảo hiểm'], correctIndex: 1, explanation: 'Ngay cả khi có force majeure, bên bị ảnh hưởng vẫn phải hành động hợp lý để giảm thiệt hại, nếu không có thể mất quyền viện dẫn force majeure.' },
  { id: 'q3', question: 'Sự khác biệt chính giữa điều khoản force majeure và bảo hiểm huỷ sự kiện là gì?', options: ['Chúng hoàn toàn giống nhau', 'Force majeure quyết định ai vi phạm hợp đồng; bảo hiểm quyết định ai chịu thiệt hại tài chính', 'Bảo hiểm thay thế hoàn toàn cho force majeure', 'Force majeure chỉ áp dụng cho nghệ sĩ'], correctIndex: 1, explanation: 'Hai công cụ giải quyết hai câu hỏi khác nhau: vi phạm hợp đồng (force majeure) và ai chịu tổn thất tài chính (bảo hiểm).' },
]);

const c8 = doc('esp201-8-1-integrated-governance-framework', '8.1 — Integrated risk governance framework & prevention planning|||8.1 — Khung quản trị rủi ro tích hợp & lập kế hoạch phòng ngừa',
  'Ráp lại 7 nhóm rủi ro thành một sổ rủi ro/khung quản trị duy nhất; vai trò & trách nhiệm; lịch rà soát theo mốc thời gian sự kiện.',
  [[
    `<span class="eyebrow">ESP201 · Chapter 8 · Lesson 8.1</span>
<h2>Integrated risk governance framework &amp; prevention planning</h2>
<h3>One register, seven domains, one owner per risk</h3>
<p>By this chapter you have built risk-management content for financial, contractual, insurance, reputational, sponsor and force-majeure risk. Chapter 8's job is to stop treating them as seven separate homework assignments and merge them into <strong>one governance artifact</strong> that a real production team actually runs on.</p>
<h3>The integrated risk register</h3>
<pre><code>Domain          Risk                          L  I  Score  Owner        Treatment          Status
Financial       Ticket sales below forecast   3  4   12    Marketing    Tiered pricing      Open
Legal           Vendor contract missing        2  4    8    Legal/Ops    Add indemnif. clause Closed
                indemnification
Insurance       Cancellation gap for weather   2  5   10    Finance      Buy weather rider    Open
Reputational    Sponsor controversy spillover  2  3    6    Comms        Pre-approved holding Open
                                                                            statement
Sponsor         Category exclusivity conflict  2  4    8    Sponsorship  Written clause +      Closed
                                                                            vendor check
Force majeure   No postponement terms in        3  4   12    Legal/Ops    Add postponement      Open
                venue contract                                           clause
</code></pre>
<h3>Governance calendar — when each domain gets reviewed</h3>
<ul>
<li><strong>T-6 months</strong>: sign core contracts (Ch.3) with force-majeure and cancellation terms in place (Ch.7); lock budget and contingency (Ch.2).</li>
<li><strong>T-3 months</strong>: bind insurance (Ch.4) — cancellation/weather cover must be in place before risks become "known".</li>
<li><strong>T-1 month</strong>: finalize sponsor deliverables and exclusivity checks (Ch.6); pre-approve crisis comms holding statements (Ch.5).</li>
<li><strong>Event week</strong>: monitor the register daily; social monitoring active (Ch.5); financial actuals tracked against budget (Ch.2).</li>
<li><strong>Post-event</strong>: close out the register — what triggered, what didn't, what to change for next time.</li>
</ul>
<div class="callout"><span class="badge">The framework's real test</span> A risk register that sits unread from T-6 months until the event is not governance — it's paperwork. The register only earns its place if someone owns each row and someone reviews it on the calendar above.</div>`,
    `<span class="eyebrow">ESP201 · Chương 8 · Bài 8.1</span>
<h2>Khung quản trị rủi ro tích hợp &amp; lập kế hoạch phòng ngừa</h2>
<h3>Một sổ rủi ro, bảy nhóm, mỗi rủi ro một người chịu trách nhiệm</h3>
<p>Đến chương này bạn đã xây nội dung quản lý rủi ro cho tài chính, hợp đồng, bảo hiểm, danh tiếng, nhà tài trợ và force majeure. Việc của Chương 8 là dừng coi chúng là bảy bài tập riêng lẻ và ráp lại thành <strong>một tài liệu quản trị duy nhất</strong> mà một đội sản xuất thật sự dùng để vận hành.</p>
<h3>Sổ rủi ro tích hợp</h3>
<pre><code>Nhóm            Rủi ro                          KN  AH  Điểm  Phụ trách    Xử lý                Trạng thái
Tài chính       Doanh thu vé dưới dự báo         3   4   12   Marketing    Giá theo tầng         Mở
Pháp lý         Hợp đồng NCC thiếu điều khoản     2   4    8   Pháp lý/Ops  Thêm điều khoản        Đóng
                bồi thường                                                bồi thường
Bảo hiểm        Thiếu bảo hiểm huỷ do thời tiết   2   5   10   Tài chính    Mua thêm rider         Mở
                                                                           thời tiết
Danh tiếng      Lan toả tranh cãi từ nhà tài trợ  2   3    6   Truyền thông Holding statement      Mở
                                                                           duyệt trước
Nhà tài trợ     Xung đột độc quyền ngành hàng     2   4    8   Tài trợ      Điều khoản bằng văn    Đóng
                                                                           bản + rà nhà cung cấp
Force majeure   Hợp đồng địa điểm thiếu điều      3   4   12   Pháp lý/Ops  Thêm điều khoản hoãn   Mở
                khoản hoãn sự kiện
</code></pre>
<h3>Lịch quản trị — mỗi nhóm được rà lúc nào</h3>
<ul>
<li><strong>T-6 tháng</strong>: ký hợp đồng cốt lõi (Ch.3) đã có điều khoản force majeure và huỷ (Ch.7); chốt ngân sách và dự phòng (Ch.2).</li>
<li><strong>T-3 tháng</strong>: ký bảo hiểm (Ch.4) — bảo hiểm huỷ/thời tiết phải có trước khi rủi ro trở nên "đã biết".</li>
<li><strong>T-1 tháng</strong>: chốt sản phẩm giao cho nhà tài trợ và rà độc quyền (Ch.6); duyệt trước holding statement khủng hoảng truyền thông (Ch.5).</li>
<li><strong>Tuần sự kiện</strong>: giám sát sổ rủi ro hằng ngày; giám sát mạng xã hội hoạt động (Ch.5); theo dõi thực chi so với ngân sách (Ch.2).</li>
<li><strong>Sau sự kiện</strong>: chốt sổ rủi ro — rủi ro nào đã kích hoạt, cái nào không, cần đổi gì cho lần sau.</li>
</ul>
<div class="callout"><span class="badge">Bài kiểm tra thật của khung này</span> Một sổ rủi ro nằm im không ai đọc từ T-6 tháng tới lúc sự kiện diễn ra không phải là quản trị — đó chỉ là giấy tờ. Sổ rủi ro chỉ có giá trị khi mỗi dòng có người phụ trách và có người rà theo đúng lịch trên.</div>`,
  ]]);

const c8q = quiz('esp201-quiz-8', 'Quiz 8 — Integrated risk governance framework|||Quiz 8 — Khung quản trị rủi ro tích hợp', [
  { id: 'q1', question: 'Mục tiêu chính của "sổ rủi ro tích hợp" ở Chương 8 là gì?', options: ['Thay thế hoàn toàn bảo hiểm và hợp đồng', 'Ráp các nhóm rủi ro riêng lẻ (tài chính, pháp lý, bảo hiểm...) thành một tài liệu quản trị chung, có người phụ trách từng dòng', 'Chỉ dùng để báo cáo sau khi sự kiện kết thúc', 'Chỉ áp dụng cho rủi ro tài chính'], correctIndex: 1, explanation: 'Chương 8 gộp mọi nhóm rủi ro của môn vào một sổ rủi ro duy nhất, mỗi rủi ro gắn một người phụ trách và biện pháp xử lý.' },
  { id: 'q2', question: 'Theo lịch quản trị gợi ý, bảo hiểm huỷ sự kiện/thời tiết nên được ký vào giai đoạn nào?', options: ['Ngay trước ngày sự kiện', 'Khoảng T-3 tháng, trước khi rủi ro trở nên "đã biết"', 'Chỉ sau khi sự kiện kết thúc', 'Không cần thời điểm cụ thể'], correctIndex: 1, explanation: 'Bảo hiểm huỷ/thời tiết cần ký sớm (khoảng T-3 tháng) vì bảo hiểm thường loại trừ rủi ro đã biết trước lúc mua (xem Chương 4).' },
  { id: 'q3', question: 'Vì sao một sổ rủi ro "nằm im không ai đọc" bị coi là chỉ là giấy tờ, không phải quản trị thật?', options: ['Vì sổ rủi ro không cần cập nhật', 'Vì quản trị thật cần mỗi dòng có người phụ trách và được rà theo lịch, không chỉ được viết ra một lần', 'Vì sổ rủi ro chỉ cần lập sau khi sự kiện xong', 'Vì sổ rủi ro chỉ dành cho kiểm toán'], correctIndex: 1, explanation: 'Giá trị của sổ rủi ro nằm ở việc được sở hữu và rà soát định kỳ, không phải ở việc tồn tại trên giấy.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ESP201',
    slug: 'esp201-entertainment-and-event-risk-management',
    title: 'Entertainment and Event Risk Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ESP201.webp',
    shortDescription: 'Commercial risk in events: budgets & overruns, contracts (talent/vendor/venue), event insurance, reputational risk, sponsors, force majeure & cancellation. Not crowd safety (see ERM301c). Bilingual, worked examples & quizzes.|||Rủi ro thương mại của sự kiện: ngân sách & vượt chi, hợp đồng (nghệ sĩ/NCC/địa điểm), bảo hiểm sự kiện, rủi ro danh tiếng, nhà tài trợ, force majeure & huỷ sự kiện. Không phải an toàn đám đông (xem ERM301c). Song ngữ, ví dụ & quiz.',
    description: 'Môn <strong>ESP201 — Entertainment and Event Risk Management</strong> (kỳ 5, khối BBA) nhìn rủi ro sự kiện từ góc <strong>thương mại</strong>: <strong>tài chính &amp; ngân sách</strong> (vượt chi, thiếu doanh thu) → <strong>hợp đồng &amp; pháp lý</strong> (nghệ sĩ, nhà cung cấp, địa điểm) → <strong>bảo hiểm sự kiện</strong> (trách nhiệm, huỷ, thời tiết) → <strong>danh tiếng &amp; thương hiệu</strong> → <strong>nhà tài trợ &amp; đối tác</strong> → <strong>force majeure, huỷ/hoãn &amp; bồi thường</strong> → <strong>khung quản trị rủi ro tích hợp</strong>. Không trùng ERM301c (an toàn đám đông); bám khung ISO 31000 và giáo trình Silvers/Tum, song ngữ, có ví dụ tính toán, checklist và quiz mỗi chương.',
    whatYouLearn: 'Quy trình ISO 31000 (nhận diện-đánh giá-xử lý-giám sát) & ma trận rủi ro; điểm hoà vốn, quỹ dự phòng, rủi ro dòng tiền; điều khoản hợp đồng nghệ sĩ/NCC/địa điểm (rider, huỷ, bồi thường, force majeure); các loại bảo hiểm sự kiện (trách nhiệm, huỷ, thời tiết) và cách đọc điểm loại trừ; quản lý rủi ro danh tiếng & kế hoạch truyền thông khủng hoảng; rủi ro nhà tài trợ (activation, độc quyền, thanh toán); phân biệt huỷ/hoãn, nghĩa vụ giảm thiểu thiệt hại; dựng sổ rủi ro tích hợp theo lịch quản trị.',
    requirements: 'Kiến thức nền Quản trị Kinh doanh (tài chính doanh nghiệp, hợp đồng cơ bản) ở các kỳ trước. Không yêu cầu kiến thức về an toàn/vận hành hiện trường (học ở ERM301c).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Silvers, Tum, ISO 31000, tổ chức ngành, công cụ ma trận rủi ro.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Rủi ro thương mại vs an toàn đám đông; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & ISO 31000|||Chapter 1 — Overview & ISO 31000', description: 'Vòng nhận diện-đánh giá-xử lý-giám sát; ma trận rủi ro.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Rủi ro tài chính & ngân sách|||Chapter 2 — Financial risk & budgeting', description: 'Vượt chi, thiếu doanh thu, hoà vốn, dự phòng.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Hợp đồng & rủi ro pháp lý|||Chapter 3 — Contracts & legal risk', description: 'Rider nghệ sĩ, hợp đồng NCC/địa điểm, bồi thường.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Bảo hiểm sự kiện|||Chapter 4 — Event insurance', description: 'Trách nhiệm, huỷ sự kiện, thời tiết, điểm loại trừ.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Rủi ro danh tiếng & thương hiệu|||Chapter 5 — Reputational & brand risk', description: 'Trước/trong/sau; kế hoạch truyền thông khủng hoảng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Rủi ro nhà tài trợ & đối tác|||Chapter 6 — Sponsor & partner risk', description: 'Activation, độc quyền, thanh toán.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Force majeure, huỷ/hoãn & bồi thường|||Chapter 7 — Force majeure & cancellation', description: 'Định nghĩa hợp đồng, giảm thiểu thiệt hại, thứ tự bồi thường.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Khung quản trị tích hợp|||Chapter 8 — Integrated governance framework', description: 'Ráp 7 nhóm rủi ro thành một sổ rủi ro, lịch quản trị.', lessons: [c8, c8q] },
  ],
};
