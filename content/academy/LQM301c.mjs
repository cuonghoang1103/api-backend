/**
 * LQM301c — Lean and Quality Management. Giáo trình FLM (syl): triết lý Lean
 * (Toyota Production System, 8 lãng phí/muda), công cụ Lean (5S, Kaizen,
 * Kanban, VSM), JIT & dòng chảy liên tục, TQM, Six Sigma/DMAIC, 7 công cụ QC
 * & SPC, ISO 9001 và văn hoá cải tiến liên tục. Song ngữ + ví dụ + bài tập.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('lqm301c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền (Lean Thinking, The Toyota Way, Quality Management), tài liệu ISO 9001 chính thức, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">LQM301c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Lean thinking and quality management — waste elimination, Lean tools, JIT, TQM, Six Sigma and ISO 9001 — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for LQM301c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Lean_thinking" target="_blank" rel="noopener"><em>Lean Thinking</em> — Womack &amp; Jones</a> — the book that named the 5 Lean principles and the 8 wastes.</li>
<li><a href="https://en.wikipedia.org/wiki/The_Toyota_Way" target="_blank" rel="noopener"><em>The Toyota Way</em> — Jeffrey Liker</a> — the 14 management principles behind the Toyota Production System.</li>
<li><a href="https://en.wikipedia.org/wiki/Quality_management" target="_blank" rel="noopener"><em>Quality Management</em> — Goetsch &amp; Davis (overview)</a> — TQM, quality gurus, and quality-control tools.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.iso.org/standard/62085.html" target="_blank" rel="noopener">ISO 9001:2015 — official overview (iso.org)</a></li>
<li><a href="https://asq.org/quality-resources" target="_blank" rel="noopener">ASQ Quality Resources</a> — free guides on Six Sigma, SPC and the 7 QC tools</li>
<li><a href="https://www.lean.org/" target="_blank" rel="noopener">Lean Enterprise Institute</a> — Lean glossary &amp; case studies</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@leanenterpriseinstitute" target="_blank" rel="noopener">Lean Enterprise Institute</a> — Lean concepts explained with factory footage</li>
<li><a href="https://www.youtube.com/results?search_query=six+sigma+dmaic+tutorial" target="_blank" rel="noopener">Six Sigma / DMAIC tutorials</a> — worked examples of the improvement cycle</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://miro.com/templates/value-stream-mapping/" target="_blank" rel="noopener">Value Stream Mapping templates</a> — draw current/future-state maps online</li>
<li><a href="https://www.spcforexcel.com/" target="_blank" rel="noopener">SPC for Excel</a> — build control charts from real data</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — Lean history &amp; 5 principles, the 8 wastes (muda), 5S, Kaizen.</li>
<li><strong>Practice</strong> — draw a simple Value Stream Map and spot waste in a process you know.</li>
<li><strong>Go deeper</strong> — JIT/pull systems, TQM principles, Six Sigma DMAIC, the 7 QC tools and SPC.</li>
<li><strong>Job-ready</strong> — understand ISO 9001's PDCA structure and how Vietnamese factories apply Lean/Six Sigma.</li>
</ol></div>`,
    `<span class="eyebrow">LQM301c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học tư duy Lean &amp; quản trị chất lượng — loại bỏ lãng phí, công cụ Lean, JIT, TQM, Six Sigma và ISO 9001 — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của LQM301c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Lean_thinking" target="_blank" rel="noopener"><em>Lean Thinking</em> — Womack &amp; Jones</a> — cuốn sách đặt tên 5 nguyên lý Lean và 8 loại lãng phí.</li>
<li><a href="https://en.wikipedia.org/wiki/The_Toyota_Way" target="_blank" rel="noopener"><em>The Toyota Way</em> — Jeffrey Liker</a> — 14 nguyên tắc quản trị đằng sau Toyota Production System.</li>
<li><a href="https://en.wikipedia.org/wiki/Quality_management" target="_blank" rel="noopener"><em>Quality Management</em> — Goetsch &amp; Davis (tổng quan)</a> — TQM, các nhà tiên phong chất lượng, công cụ kiểm soát chất lượng.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.iso.org/standard/62085.html" target="_blank" rel="noopener">ISO 9001:2015 — tổng quan chính thức (iso.org)</a></li>
<li><a href="https://asq.org/quality-resources" target="_blank" rel="noopener">ASQ Quality Resources</a> — hướng dẫn miễn phí về Six Sigma, SPC và 7 công cụ QC</li>
<li><a href="https://www.lean.org/" target="_blank" rel="noopener">Lean Enterprise Institute</a> — từ điển Lean &amp; case study</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@leanenterpriseinstitute" target="_blank" rel="noopener">Lean Enterprise Institute</a> — giải thích khái niệm Lean kèm hình ảnh nhà máy thật</li>
<li><a href="https://www.youtube.com/results?search_query=six+sigma+dmaic+tutorial" target="_blank" rel="noopener">Hướng dẫn Six Sigma / DMAIC</a> — ví dụ áp dụng chu trình cải tiến</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://miro.com/templates/value-stream-mapping/" target="_blank" rel="noopener">Mẫu Value Stream Mapping</a> — vẽ bản đồ dòng giá trị hiện tại/tương lai online</li>
<li><a href="https://www.spcforexcel.com/" target="_blank" rel="noopener">SPC for Excel</a> — dựng biểu đồ kiểm soát từ dữ liệu thật</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — lịch sử Lean &amp; 5 nguyên lý, 8 loại lãng phí (muda), 5S, Kaizen.</li>
<li><strong>Luyện tập</strong> — vẽ một Value Stream Map đơn giản và tìm lãng phí trong một quy trình bạn biết.</li>
<li><strong>Đào sâu</strong> — hệ thống kéo/JIT, nguyên tắc TQM, Six Sigma DMAIC, 7 công cụ QC và SPC.</li>
<li><strong>Sẵn sàng đi làm</strong> — hiểu cấu trúc PDCA của ISO 9001 và cách nhà máy Việt Nam áp dụng Lean/Six Sigma.</li>
</ol></div>`,
  ]]);

const intro = doc('lqm301c-0-1-overview', 'Course overview: Lean and Quality Management|||Tổng quan: Quản trị Tinh gọn và Chất lượng',
  'Lean là gì, quản trị chất lượng là gì, vì sao hai môn đi cùng nhau; lộ trình: triết lý Lean → công cụ Lean → JIT → TQM → Six Sigma → công cụ QC/SPC → ISO 9001.',
  [[
    `<span class="eyebrow">LQM301c · Lesson 0.1 · Overview</span>
<h2>Lean and Quality Management</h2>
<p class="lead">This course teaches two ideas that grew up together in Japanese manufacturing and now run every efficient operation on earth: <strong>Lean</strong> (relentlessly removing waste so every step adds value for the customer) and <strong>quality management</strong> (building a system that reliably meets — or exceeds — customer expectations, instead of inspecting defects out at the end).</p>
<h3>Why they belong in one course</h3>
<p>Lean without quality just makes defects faster. Quality without Lean builds a perfect product too slowly and expensively to sell. Toyota's real breakthrough was fusing both: the <strong>Toyota Production System (TPS)</strong> is simultaneously a waste-elimination system and a quality system — a defective part is itself treated as the ultimate waste.</p>
<h3>Roadmap</h3>
<p>Lean philosophy &amp; the 8 wastes (muda) → Lean tools (5S, Kaizen, Kanban, Value Stream Mapping) → Just-in-Time &amp; continuous flow → Total Quality Management (TQM) → Six Sigma &amp; DMAIC → the 7 QC tools &amp; statistical process control (SPC) → ISO 9001 and a culture of continuous improvement, including how Vietnamese manufacturers apply all of this today.</p>
<div class="callout"><span class="badge">Core question of this course</span> For every activity in a process, ask: "would the customer pay extra for this step?" If not, it is waste — the target for elimination.</div>`,
    `<span class="eyebrow">LQM301c · Bài 0.1 · Tổng quan</span>
<h2>Quản trị Tinh gọn và Chất lượng</h2>
<p class="lead">Môn này dạy hai ý tưởng lớn lên cùng nhau trong ngành sản xuất Nhật Bản và nay vận hành mọi doanh nghiệp hiệu quả trên thế giới: <strong>Lean</strong> (loại bỏ triệt để lãng phí để mọi bước đều tạo giá trị cho khách hàng) và <strong>quản trị chất lượng</strong> (xây một hệ thống đáp ứng — hoặc vượt — kỳ vọng khách hàng một cách ổn định, thay vì kiểm tra bắt lỗi ở cuối chuyền).</p>
<h3>Vì sao đi cùng một môn</h3>
<p>Lean mà thiếu chất lượng chỉ làm ra lỗi nhanh hơn. Chất lượng mà thiếu Lean thì làm ra sản phẩm hoàn hảo nhưng quá chậm và quá đắt để bán được. Bước đột phá thật sự của Toyota là hợp nhất cả hai: <strong>Toyota Production System (TPS)</strong> vừa là hệ thống loại bỏ lãng phí, vừa là hệ thống chất lượng — một sản phẩm lỗi được xem là lãng phí tối hậu.</p>
<h3>Lộ trình</h3>
<p>Triết lý Lean &amp; 8 loại lãng phí (muda) → công cụ Lean (5S, Kaizen, Kanban, Value Stream Mapping) → Just-in-Time &amp; dòng chảy liên tục → Quản trị chất lượng toàn diện (TQM) → Six Sigma &amp; DMAIC → 7 công cụ kiểm soát chất lượng &amp; kiểm soát quy trình bằng thống kê (SPC) → ISO 9001 và văn hoá cải tiến liên tục, kèm cách doanh nghiệp Việt Nam áp dụng tất cả điều này.</p>
<div class="callout"><span class="badge">Câu hỏi lõi của môn</span> Với mỗi hoạt động trong quy trình, hãy hỏi: "khách hàng có trả thêm tiền cho bước này không?" Nếu không, đó là lãng phí — mục tiêu cần loại bỏ.</div>`,
  ]]);

const c1 = doc('lqm301c-1-1-lean-quality-overview', '1.1 — Origins of Lean & quality management|||1.1 — Nguồn gốc Lean & quản trị chất lượng',
  'Từ sản xuất hàng loạt của Ford đến Toyota Production System (TPS); "value" theo khách hàng định nghĩa; các nhà tiên phong chất lượng: Deming, Juran, Crosby.',
  [[
    `<span class="eyebrow">LQM301c · Chapter 1 · Lesson 1.1</span>
<h2>Origins of Lean &amp; quality management</h2>
<h3>From mass production to Toyota</h3>
<p>Henry Ford's assembly line (1913) made mass production cheap but rigid — one product, huge batches, huge inventory buffers. After WWII, Toyota (Taiichi Ohno, Shigeo Shingo) could not afford Ford's scale, so it built the <strong>Toyota Production System (TPS)</strong>: make many product variants, in small batches, with almost no inventory, by removing every step that did not add customer value. In the 1990s, Womack &amp; Jones's book <em>Lean Thinking</em> gave this system a name — <strong>Lean</strong> — and a 5-principle framework any industry could use.</p>
<h3>Value is defined by the customer, never the producer</h3>
<p>The starting point of Lean is <strong>value</strong>: a capability provided to a customer at the right time, at an appropriate price, as defined by the customer. A factory cannot decide internally that a step "adds value" — only the customer's willingness to pay for that step decides.</p>
<h3>The quality gurus</h3>
<ul>
<li><strong>W. Edwards Deming</strong> — quality is built by management, not inspected in; famous for the <strong>14 points</strong> and the <strong>PDCA cycle</strong> (Plan-Do-Check-Act).</li>
<li><strong>Joseph Juran</strong> — the <strong>Juran trilogy</strong> (quality planning, control, improvement) and the idea that most quality problems are management-controllable, not worker-caused.</li>
<li><strong>Philip Crosby</strong> — "quality is free": the cost of preventing defects is always lower than the cost of fixing them; coined <strong>zero defects</strong>.</li>
</ul>
<div class="callout"><span class="badge">Same root, two branches</span> Lean and TQM both grew from the same post-war Japanese factories that combined American statistical methods (Deming) with relentless waste reduction (Ohno) — this course studies both branches of that one tree.</div>`,
    `<span class="eyebrow">LQM301c · Chương 1 · Bài 1.1</span>
<h2>Nguồn gốc Lean &amp; quản trị chất lượng</h2>
<h3>Từ sản xuất hàng loạt của Ford đến Toyota</h3>
<p>Dây chuyền lắp ráp của Henry Ford (1913) làm sản xuất hàng loạt rẻ nhưng cứng nhắc — một sản phẩm, lô cực lớn, tồn kho đệm khổng lồ. Sau Thế chiến II, Toyota (Taiichi Ohno, Shigeo Shingo) không đủ nguồn lực để chạy theo quy mô của Ford, nên đã xây dựng <strong>Toyota Production System (TPS)</strong>: làm nhiều biến thể sản phẩm, theo lô nhỏ, gần như không tồn kho, bằng cách loại bỏ mọi bước không tạo giá trị cho khách hàng. Thập niên 1990, cuốn sách <em>Lean Thinking</em> của Womack &amp; Jones đặt tên cho hệ thống này là <strong>Lean</strong>, và đóng gói thành khung 5 nguyên lý mà mọi ngành đều dùng được.</p>
<h3>Giá trị do khách hàng định nghĩa, không phải người sản xuất</h3>
<p>Điểm khởi đầu của Lean là <strong>giá trị (value)</strong>: một năng lực được cung cấp cho khách hàng đúng thời điểm, đúng mức giá phù hợp, theo chính định nghĩa của khách hàng. Nhà máy không thể tự quyết định nội bộ rằng một bước "tạo giá trị" — chỉ có việc khách hàng sẵn sàng trả tiền cho bước đó mới quyết định.</p>
<h3>Các nhà tiên phong chất lượng</h3>
<ul>
<li><strong>W. Edwards Deming</strong> — chất lượng được XÂY bởi quản trị, không phải KIỂM ra; nổi tiếng với <strong>14 nguyên tắc</strong> và chu trình <strong>PDCA</strong> (Plan-Do-Check-Act).</li>
<li><strong>Joseph Juran</strong> — <strong>tam giác Juran</strong> (hoạch định, kiểm soát, cải tiến chất lượng) và quan điểm hầu hết vấn đề chất lượng do quản trị kiểm soát được, không do lỗi công nhân.</li>
<li><strong>Philip Crosby</strong> — "chất lượng là miễn phí": chi phí ngăn ngừa lỗi luôn thấp hơn chi phí sửa lỗi; đặt ra khái niệm <strong>zero defects</strong> (không lỗi).</li>
</ul>
<div class="callout"><span class="badge">Cùng gốc, hai nhánh</span> Lean và TQM cùng lớn lên từ những nhà máy Nhật thời sau chiến tranh, kết hợp phương pháp thống kê Mỹ (Deming) với việc giảm lãng phí triệt để (Ohno) — môn này học cả hai nhánh của một cái cây.</div>`,
  ]]);

const c1q = quiz('lqm301c-quiz-1', 'Quiz 1 — Origins|||Quiz 1 — Nguồn gốc', [
  { id: 'q1', question: 'Hệ thống nào là nền tảng ra đời của tư duy Lean?', options: ['Ford Assembly Line nguyên bản', 'Toyota Production System (TPS)', 'Six Sigma của Motorola', 'ISO 9001'], correctIndex: 1, explanation: 'TPS (Ohno, Shingo) là hệ thống Toyota xây sau WWII, được Womack/Jones đặt tên "Lean".' },
  { id: 'q2', question: 'Trong Lean, ai là người định nghĩa "giá trị" (value) của một bước trong quy trình?', options: ['Bộ phận sản xuất', 'Ban quản trị', 'Khách hàng', 'Bộ phận kiểm soát chất lượng'], correctIndex: 2, explanation: 'Value chỉ do khách hàng định nghĩa — họ có sẵn sàng trả tiền cho bước đó hay không.' },
  { id: 'q3', question: 'Ai gắn với câu nói "chất lượng là miễn phí" (quality is free)?', options: ['W. Edwards Deming', 'Joseph Juran', 'Philip Crosby', 'Taiichi Ohno'], correctIndex: 2, explanation: 'Philip Crosby: chi phí ngăn ngừa lỗi luôn thấp hơn chi phí sửa lỗi.' },
]);

const c2 = doc('lqm301c-2-1-principles-muda', '2.1 — 5 Lean principles & the 8 wastes (muda)|||2.1 — 5 nguyên lý Lean & 8 loại lãng phí (muda)',
  '5 nguyên lý Lean (Value, Value stream, Flow, Pull, Perfection); 8 loại lãng phí TIMWOODS; mura (bất ổn) và muri (quá tải).',
  [[
    `<span class="eyebrow">LQM301c · Chapter 2 · Lesson 2.1</span>
<h2>5 Lean principles &amp; the 8 wastes (muda)</h2>
<h3>The 5 principles (Womack &amp; Jones)</h3>
<ol>
<li><strong>Value</strong> — define value from the customer's point of view.</li>
<li><strong>Value stream</strong> — map every step a product goes through, end to end.</li>
<li><strong>Flow</strong> — make the value-adding steps happen in tight sequence, with no stops.</li>
<li><strong>Pull</strong> — produce only what the next step (or the customer) actually asks for, not what a forecast predicts.</li>
<li><strong>Perfection</strong> — keep repeating the cycle, driving waste toward zero; there is no finish line.</li>
</ol>
<h3>The 8 wastes — TIMWOODS</h3>
<pre><code>T — Transport      unnecessary movement of materials/products
I — Inventory      more stock than the next step needs right now
M — Motion         unnecessary movement of people/equipment
W — Waiting        idle time between steps
O — Overproduction making more/sooner than the customer ordered
O — Overprocessing doing more work than the customer values
D — Defects        rework, scrap, correction
S — Skills         underused people — ideas and skill not tapped
</code></pre>
<h3>Two cousins of muda: mura and muri</h3>
<p><strong>Mura</strong> (unevenness) — workload that swings wildly, forcing buffers and overtime. <strong>Muri</strong> (overburden) — pushing people or machines beyond a sustainable pace, which produces defects and breakdowns. Toyota treats all three — muda, mura, muri — as one connected problem: uneven demand (mura) creates overburden (muri), and overburden creates waste (muda).</p>
<div class="callout"><span class="badge">Memory hook</span> TIMWOODS spells easily, but the real skill is spotting waste on the shop floor (gemba) — not reciting the list.</div>`,
    `<span class="eyebrow">LQM301c · Chương 2 · Bài 2.1</span>
<h2>5 nguyên lý Lean &amp; 8 loại lãng phí (muda)</h2>
<h3>5 nguyên lý (Womack &amp; Jones)</h3>
<ol>
<li><strong>Giá trị (Value)</strong> — định nghĩa giá trị từ góc nhìn khách hàng.</li>
<li><strong>Dòng giá trị (Value stream)</strong> — vẽ toàn bộ các bước sản phẩm đi qua, từ đầu đến cuối.</li>
<li><strong>Dòng chảy (Flow)</strong> — để các bước tạo giá trị diễn ra liên tục, khít nhau, không dừng.</li>
<li><strong>Kéo (Pull)</strong> — chỉ sản xuất theo đúng yêu cầu thật của bước sau (hoặc khách hàng), không theo dự báo.</li>
<li><strong>Hoàn thiện (Perfection)</strong> — lặp lại chu trình liên tục, đưa lãng phí về gần 0; không có điểm kết thúc.</li>
</ol>
<h3>8 loại lãng phí — TIMWOODS</h3>
<pre><code>T — Transport (vận chuyển)     di chuyển vật liệu/sản phẩm không cần thiết
I — Inventory (tồn kho)        tồn nhiều hơn mức bước sau cần ngay
M — Motion (thao tác thừa)     di chuyển người/thiết bị không cần thiết
W — Waiting (chờ đợi)          thời gian rỗi giữa các bước
O — Overproduction (sản xuất dư) làm nhiều/sớm hơn khách đặt
O — Overprocessing (xử lý dư)  làm nhiều việc hơn mức khách coi là giá trị
D — Defects (lỗi)              làm lại, phế phẩm, sửa lỗi
S — Skills (bỏ sót năng lực)   nhân sự chưa được dùng đúng ý tưởng, kỹ năng
</code></pre>
<h3>Hai khái niệm liên quan: mura và muri</h3>
<p><strong>Mura</strong> (bất ổn) — khối lượng công việc dao động mạnh, buộc phải có bộ đệm và tăng ca. <strong>Muri</strong> (quá tải) — bắt người hoặc máy chạy vượt tốc độ bền vững, sinh ra lỗi và hỏng hóc. Toyota xem cả ba — muda, mura, muri — là một vấn đề liên kết: nhu cầu bất ổn (mura) tạo ra quá tải (muri), và quá tải tạo ra lãng phí (muda).</p>
<div class="callout"><span class="badge">Ghi nhớ</span> TIMWOODS dễ đọc, nhưng kỹ năng thật là NHÌN THẤY lãng phí ngay tại hiện trường (gemba) — không phải học thuộc danh sách.</div>`,
  ]]);

const c2q = quiz('lqm301c-quiz-2', 'Quiz 2 — Nguyên lý & muda|||Quiz 2 — Principles & muda', [
  { id: 'q1', question: 'Nguyên lý Lean nào nói "chỉ sản xuất theo đúng yêu cầu thật của bước sau"?', options: ['Value', 'Flow', 'Pull', 'Perfection'], correctIndex: 2, explanation: 'Pull: sản xuất theo tín hiệu nhu cầu thật, không theo dự báo đẩy vào.' },
  { id: 'q2', question: 'Trong TIMWOODS, chữ "O" thứ hai (Overprocessing) nghĩa là gì?', options: ['Sản xuất dư số lượng', 'Làm nhiều công việc hơn mức khách hàng coi là giá trị', 'Tồn kho quá nhiều', 'Di chuyển vật liệu thừa'], correctIndex: 1, explanation: 'Overprocessing là làm thừa công việc/chi tiết mà khách hàng không cần và không trả tiền cho.' },
  { id: 'q3', question: '"Muri" trong hệ thống Toyota nghĩa là gì?', options: ['Bất ổn về khối lượng công việc', 'Quá tải người hoặc máy vượt mức bền vững', 'Lãng phí do lỗi sản phẩm', 'Thời gian chờ giữa các bước'], correctIndex: 1, explanation: 'Muri = quá tải; khác mura (bất ổn) và muda (lãng phí), nhưng ba khái niệm liên kết chặt với nhau.' },
]);

const c3 = doc('lqm301c-3-1-lean-tools', '3.1 — Lean tools: 5S, Kaizen, Kanban, VSM|||3.1 — Công cụ Lean: 5S, Kaizen, Kanban, VSM',
  '5S (Sort/Set/Shine/Standardize/Sustain), Kaizen (cải tiến liên tục qua PDCA), Kanban (thẻ báo & giới hạn WIP), Value Stream Mapping (bản đồ dòng giá trị hiện tại/tương lai).',
  [[
    `<span class="eyebrow">LQM301c · Chapter 3 · Lesson 3.1</span>
<h2>Lean tools: 5S, Kaizen, Kanban, VSM</h2>
<h3>5S — organize the workplace</h3>
<pre><code>Seiri      Sort       remove what is not needed
Seiton     Set in order arrange what remains for easy access
Seiso      Shine      clean the area and equipment
Seiketsu   Standardize turn the first 3S into a repeatable standard
Shitsuke   Sustain    audit and maintain the discipline over time
</code></pre>
<h3>Kaizen — continuous improvement</h3>
<p><strong>Kaizen</strong> means "change for the better": small, frequent, employee-driven improvements rather than one giant redesign. It runs on the <strong>PDCA cycle</strong> (Plan a small change → Do it as a trial → Check the result → Act: adopt, adjust, or discard) — repeated endlessly, by everyone, everywhere.</p>
<h3>Kanban — a pull signal, not a computer system</h3>
<p><strong>Kanban</strong> (literally "signal card") authorizes production or movement of exactly one unit/batch only when downstream actually consumes one — this is what turns "push" scheduling into "pull". A <strong>Kanban board</strong> (To Do / Doing / Done) also enforces a <strong>WIP limit</strong> — a cap on how much work is in progress at once, which exposes bottlenecks instantly.</p>
<h3>Value Stream Mapping (VSM)</h3>
<p>A <strong>VSM</strong> draws every step (and every wait) a product goes through from raw material to customer, with real times for each — this is the <strong>current-state map</strong>. Waste jumps out visually (long queues, high inventory triangles). Teams then draw a <strong>future-state map</strong> with the waste removed, and the gap between the two becomes the improvement plan.</p>
<div class="callout"><span class="badge">Order matters</span> 5S usually comes first — you cannot see waste clearly in a disorganized, dirty area. VSM comes next, to see the whole flow before picking which waste to attack.</div>`,
    `<span class="eyebrow">LQM301c · Chương 3 · Bài 3.1</span>
<h2>Công cụ Lean: 5S, Kaizen, Kanban, VSM</h2>
<h3>5S — tổ chức nơi làm việc</h3>
<pre><code>Seiri      Sàng lọc     bỏ những gì không cần
Seiton     Sắp xếp      xếp phần còn lại để dễ lấy, dễ dùng
Seiso      Sạch sẽ      vệ sinh khu vực và thiết bị
Seiketsu   Săn sóc      biến 3S đầu thành tiêu chuẩn lặp lại được
Shitsuke   Sẵn sàng     kiểm tra và duy trì kỷ luật đó theo thời gian
</code></pre>
<h3>Kaizen — cải tiến liên tục</h3>
<p><strong>Kaizen</strong> nghĩa là "thay đổi để tốt hơn": những cải tiến nhỏ, thường xuyên, do chính người lao động đề xuất, thay vì một lần thiết kế lại khổng lồ. Nó chạy theo chu trình <strong>PDCA</strong> (Plan — lập kế hoạch một thay đổi nhỏ → Do — thử làm → Check — kiểm tra kết quả → Act — áp dụng, chỉnh sửa, hoặc bỏ) — lặp lại không ngừng, bởi tất cả mọi người, ở mọi nơi.</p>
<h3>Kanban — tín hiệu kéo, không phải phần mềm</h3>
<p><strong>Kanban</strong> (nghĩa gốc "thẻ báo hiệu") chỉ cho phép sản xuất hoặc di chuyển đúng một đơn vị/lô khi bước sau THẬT SỰ tiêu thụ một đơn vị — đây chính là điều biến lịch trình "đẩy" thành "kéo". Một <strong>bảng Kanban</strong> (Cần làm / Đang làm / Xong) cũng áp <strong>giới hạn WIP</strong> — mức trần công việc đang xử lý cùng lúc, giúp lộ ngay điểm nghẽn.</p>
<h3>Value Stream Mapping (VSM)</h3>
<p>Một <strong>VSM</strong> vẽ mọi bước (và mọi khoảng chờ) sản phẩm trải qua từ nguyên liệu đến khách hàng, kèm thời gian thật của từng bước — đây là <strong>bản đồ trạng thái hiện tại</strong>. Lãng phí hiện rõ bằng mắt (hàng chờ dài, tam giác tồn kho lớn). Nhóm sau đó vẽ <strong>bản đồ trạng thái tương lai</strong> đã loại bỏ lãng phí, và khoảng cách giữa hai bản đồ trở thành kế hoạch cải tiến.</p>
<div class="callout"><span class="badge">Thứ tự quan trọng</span> 5S thường làm trước — khó thấy rõ lãng phí trong một khu vực lộn xộn, dơ bẩn. VSM làm sau, để nhìn toàn bộ dòng chảy trước khi chọn lãng phí nào để tấn công.</div>`,
  ]]);

const c3q = quiz('lqm301c-quiz-3', 'Quiz 3 — Công cụ Lean|||Quiz 3 — Lean tools', [
  { id: 'q1', question: 'Trong 5S, "Seiketsu" (Standardize) nghĩa là gì?', options: ['Bỏ những gì không cần', 'Vệ sinh khu vực làm việc', 'Biến 3S đầu thành tiêu chuẩn lặp lại được', 'Kiểm tra duy trì kỷ luật theo thời gian'], correctIndex: 2, explanation: 'Seiketsu là bước biến Sort/Set/Shine thành một tiêu chuẩn có thể lặp lại; Shitsuke mới là duy trì.' },
  { id: 'q2', question: 'Kanban tạo ra hệ thống sản xuất kiểu gì?', options: ['Push — đẩy theo dự báo', 'Pull — kéo theo tiêu thụ thật', 'Batch cực lớn', 'Không liên quan tới tồn kho'], correctIndex: 1, explanation: 'Thẻ Kanban chỉ cho phép sản xuất/di chuyển khi bước sau thực sự tiêu thụ — đó là bản chất của "pull".' },
  { id: 'q3', question: 'Value Stream Mapping (VSM) dùng để làm gì?', options: ['Tính lương nhân viên', 'Vẽ toàn bộ các bước & thời gian một sản phẩm trải qua để lộ ra lãng phí', 'Kiểm tra chất lượng bằng thống kê', 'Chứng nhận ISO 9001'], correctIndex: 1, explanation: 'VSM vẽ bản đồ dòng giá trị hiện tại, so với bản đồ trạng thái tương lai để lập kế hoạch cải tiến.' },
]);

const c4 = doc('lqm301c-4-1-jit-flow', '4.1 — Just-in-Time & continuous flow|||4.1 — Just-in-Time & dòng chảy liên tục',
  'JIT (đúng thứ, đúng lúc, đúng số lượng), takt time, one-piece flow, Heijunka (san bằng sản xuất), Jidoka & Andon (tự động hoá có trí tuệ, dừng khi lỗi).',
  [[
    `<span class="eyebrow">LQM301c · Chapter 4 · Lesson 4.1</span>
<h2>Just-in-Time &amp; continuous flow</h2>
<h3>Just-in-Time (JIT)</h3>
<p><strong>JIT</strong> means producing and delivering the right item, in the right quantity, at exactly the right time — no earlier, no more. Doing this well eliminates the overproduction and inventory wastes from Chapter 2, but it requires a stable, predictable process — JIT amplifies any instability instead of hiding it behind a buffer.</p>
<h3>Takt time &amp; one-piece flow</h3>
<pre><code>Takt time = available production time / customer demand
Example: 480 min/day available, 240 units/day demanded
Takt time = 480 / 240 = 2 minutes per unit
</code></pre>
<p><strong>Takt time</strong> is the pace the customer is "pulling" at; every workstation is paced to it. <strong>One-piece flow</strong> moves a single unit at a time through each step (instead of large batches waiting to move together), which shrinks lead time dramatically and surfaces defects immediately.</p>
<h3>Heijunka — leveling production</h3>
<p><strong>Heijunka</strong> smooths both the volume and the mix of production over time, instead of making one big batch of product A then a big batch of product B. Leveling absorbs demand swings (mura) so JIT can run steadily.</p>
<h3>Jidoka &amp; Andon — automation with a brain</h3>
<p><strong>Jidoka</strong> gives machines and people the authority (and duty) to <strong>stop the line</strong> the instant a defect is detected, instead of letting it flow downstream. The <strong>Andon</strong> is the visual/audible signal (a cord, a light, a board) any worker pulls to raise that stop — turning quality into everyone's real-time responsibility, not a downstream inspector's job.</p>
<div class="callout"><span class="badge">Two pillars of TPS</span> Toyota describes its whole system on two pillars: <strong>JIT</strong> (the right amount, right time) and <strong>Jidoka</strong> (never pass on a defect). Everything in this chapter sits under one of the two.</div>`,
    `<span class="eyebrow">LQM301c · Chương 4 · Bài 4.1</span>
<h2>Just-in-Time &amp; dòng chảy liên tục</h2>
<h3>Just-in-Time (JIT)</h3>
<p><strong>JIT</strong> nghĩa là sản xuất và giao đúng thứ cần, đúng số lượng cần, đúng thời điểm cần — không sớm hơn, không nhiều hơn. Làm tốt điều này loại bỏ được lãng phí sản xuất dư và tồn kho ở Chương 2, nhưng đòi hỏi một quy trình ổn định, dự đoán được — JIT KHUẾCH ĐẠI mọi bất ổn thay vì che giấu nó sau một lớp đệm.</p>
<h3>Takt time &amp; one-piece flow</h3>
<pre><code>Takt time = thời gian sản xuất khả dụng / nhu cầu khách hàng
Ví dụ: 480 phút/ngày khả dụng, nhu cầu 240 đơn vị/ngày
Takt time = 480 / 240 = 2 phút/đơn vị
</code></pre>
<p><strong>Takt time</strong> là nhịp mà khách hàng đang "kéo"; mọi công đoạn được canh theo nhịp đó. <strong>One-piece flow</strong> di chuyển từng đơn vị một qua mỗi bước (thay vì lô lớn chờ nhau rồi mới di chuyển cùng), giúp giảm mạnh thời gian dẫn (lead time) và lộ lỗi ngay lập tức.</p>
<h3>Heijunka — san bằng sản xuất</h3>
<p><strong>Heijunka</strong> san đều cả sản lượng và tổ hợp sản phẩm theo thời gian, thay vì làm một lô lớn sản phẩm A rồi mới đến lô lớn sản phẩm B. San bằng giúp hấp thụ dao động nhu cầu (mura) để JIT chạy ổn định.</p>
<h3>Jidoka &amp; Andon — tự động hoá có trí tuệ</h3>
<p><strong>Jidoka</strong> cho máy và người quyền (và trách nhiệm) <strong>dừng chuyền ngay</strong> khi phát hiện lỗi, thay vì để lỗi trôi xuống bước sau. <strong>Andon</strong> là tín hiệu hình ảnh/âm thanh (dây kéo, đèn, bảng) mà bất kỳ công nhân nào cũng có thể kéo để báo dừng — biến chất lượng thành trách nhiệm thời gian thực của tất cả mọi người, không phải việc của người kiểm tra ở cuối chuyền.</p>
<div class="callout"><span class="badge">Hai trụ cột của TPS</span> Toyota mô tả toàn bộ hệ thống của mình trên hai trụ cột: <strong>JIT</strong> (đúng lượng, đúng lúc) và <strong>Jidoka</strong> (không bao giờ chuyển lỗi cho bước sau). Mọi thứ trong chương này thuộc về một trong hai trụ.</div>`,
  ]]);

const c4q = quiz('lqm301c-quiz-4', 'Quiz 4 — JIT & dòng chảy|||Quiz 4 — JIT & flow', [
  { id: 'q1', question: 'Takt time được tính bằng công thức nào?', options: ['Thời gian sản xuất khả dụng × nhu cầu khách hàng', 'Thời gian sản xuất khả dụng / nhu cầu khách hàng', 'Nhu cầu khách hàng / thời gian sản xuất khả dụng', 'Số lỗi / tổng sản lượng'], correctIndex: 1, explanation: 'Takt time = thời gian khả dụng chia cho nhu cầu — nhịp mà khách hàng đang "kéo".' },
  { id: 'q2', question: '"Jidoka" trong TPS thể hiện nguyên tắc nào?', options: ['Tăng tốc chuyền bất kể chất lượng', 'Cho máy/người quyền dừng chuyền ngay khi phát hiện lỗi', 'San bằng sản lượng theo thời gian', 'Giới hạn WIP trên bảng Kanban'], correctIndex: 1, explanation: 'Jidoka = tự động hoá có trí tuệ: không bao giờ để lỗi trôi xuống bước sau, dừng ngay để xử lý.' },
  { id: 'q3', question: 'Heijunka giải quyết chủ yếu vấn đề gì để JIT chạy ổn định?', options: ['Muda (lãng phí)', 'Mura (bất ổn khối lượng công việc)', 'Chi phí chất lượng', 'Chứng nhận ISO'], correctIndex: 1, explanation: 'Heijunka san đều sản lượng/tổ hợp sản phẩm để hấp thụ dao động nhu cầu (mura).' },
]);

const c5 = doc('lqm301c-5-1-tqm-overview', '5.1 — Total Quality Management (TQM) overview|||5.1 — Tổng quan Quản trị chất lượng toàn diện (TQM)',
  '8 nguyên tắc TQM, 14 điểm của Deming, chu trình PDCA, chi phí chất lượng (phòng ngừa/thẩm định/sai lỗi).',
  [[
    `<span class="eyebrow">LQM301c · Chapter 5 · Lesson 5.1</span>
<h2>Total Quality Management (TQM) overview</h2>
<h3>What TQM is</h3>
<p><strong>TQM</strong> is a management approach where every person, in every department, is responsible for quality — not just a separate QC department checking finished goods. Quality is built into the process from the start, driven by continuous improvement and hard data, not opinion.</p>
<h3>8 principles of TQM</h3>
<pre><code>1. Customer focus            everything starts from customer requirements
2. Leadership                management sets direction & provides resources
3. Involvement of people     everyone contributes, at every level
4. Process approach          manage activities as connected processes
5. System approach           manage interrelated processes as one system
6. Continual improvement     a permanent objective, never "finished"
7. Factual decision making   decide from data and analysis, not opinion
8. Mutually beneficial       supplier relationships built on trust, not price alone
</code></pre>
<h3>Deming's 14 points (selected)</h3>
<p>Create constancy of purpose; adopt a new philosophy; stop relying on inspection alone; end awarding business on price alone; improve constantly; institute training; drive out fear; break down barriers between departments; eliminate slogans without methods; remove numerical quotas.</p>
<h3>Cost of quality</h3>
<pre><code>Prevention cost   spend now to stop defects happening   (training, process design)
Appraisal cost    spend to find defects                 (inspection, testing)
Failure cost       spend because a defect happened        internal (scrap, rework)
                                                           external (returns, warranty, lost trust)
</code></pre>
<p>The core insight: money spent on <strong>prevention</strong> is always smaller than money lost to <strong>failure</strong> — this is Crosby's "quality is free" made numeric.</p>
<div class="callout"><span class="badge">PDCA runs it all</span> Every TQM principle above is executed through the same cycle Deming taught: Plan → Do → Check → Act, repeated forever.</div>`,
    `<span class="eyebrow">LQM301c · Chương 5 · Bài 5.1</span>
<h2>Tổng quan Quản trị chất lượng toàn diện (TQM)</h2>
<h3>TQM là gì</h3>
<p><strong>TQM</strong> là cách quản trị mà MỌI người, ở MỌI bộ phận, đều chịu trách nhiệm về chất lượng — không chỉ một bộ phận QC riêng kiểm hàng thành phẩm. Chất lượng được xây ngay từ đầu quy trình, dẫn dắt bởi cải tiến liên tục và dữ liệu thật, không phải cảm tính.</p>
<h3>8 nguyên tắc TQM</h3>
<pre><code>1. Hướng vào khách hàng      mọi thứ bắt đầu từ yêu cầu khách hàng
2. Vai trò lãnh đạo          quản trị đặt hướng đi & cấp nguồn lực
3. Sự tham gia của mọi người mỗi người đều góp phần, ở mọi cấp
4. Cách tiếp cận theo quy trình quản lý hoạt động như các quy trình liên kết
5. Cách tiếp cận hệ thống    quản lý các quy trình liên quan như một hệ thống
6. Cải tiến liên tục         mục tiêu vĩnh viễn, không bao giờ "xong"
7. Quyết định dựa trên dữ liệu quyết định từ dữ liệu và phân tích, không cảm tính
8. Hợp tác cùng có lợi       quan hệ nhà cung cấp xây trên tin cậy, không chỉ giá
</code></pre>
<h3>14 nguyên tắc của Deming (chọn lọc)</h3>
<p>Tạo sự bền vững về mục đích; chấp nhận triết lý mới; ngừng dựa hoàn toàn vào kiểm tra; ngừng chọn nhà cung cấp chỉ theo giá; cải tiến liên tục; đào tạo tại chỗ; xoá bỏ sợ hãi; phá bỏ rào cản giữa các bộ phận; loại bỏ slogan suông không kèm phương pháp; bỏ định mức số lượng cứng nhắc.</p>
<h3>Chi phí chất lượng</h3>
<pre><code>Chi phí phòng ngừa   chi trước để lỗi không xảy ra    (đào tạo, thiết kế quy trình)
Chi phí thẩm định    chi để phát hiện lỗi              (kiểm tra, thử nghiệm)
Chi phí sai lỗi       chi vì lỗi đã xảy ra               nội bộ (phế phẩm, làm lại)
                                                          bên ngoài (trả hàng, bảo hành, mất tín nhiệm)
</code></pre>
<p>Điểm cốt lõi: tiền chi cho <strong>phòng ngừa</strong> luôn nhỏ hơn tiền mất vì <strong>sai lỗi</strong> — đây chính là "chất lượng là miễn phí" của Crosby, được lượng hoá bằng số.</p>
<div class="callout"><span class="badge">PDCA vận hành tất cả</span> Mọi nguyên tắc TQM trên đều được thực hiện qua đúng một chu trình Deming dạy: Plan → Do → Check → Act, lặp lại mãi mãi.</div>`,
  ]]);

const c5q = quiz('lqm301c-quiz-5', 'Quiz 5 — TQM|||Quiz 5 — TQM', [
  { id: 'q1', question: 'Trong TQM, ai chịu trách nhiệm về chất lượng?', options: ['Chỉ bộ phận QC', 'Chỉ ban giám đốc', 'Mọi người, ở mọi bộ phận', 'Chỉ khách hàng phát hiện lỗi rồi báo lại'], correctIndex: 2, explanation: 'Nguyên tắc lõi của TQM: chất lượng là trách nhiệm của toàn bộ tổ chức, không riêng một bộ phận.' },
  { id: 'q2', question: 'Loại chi phí chất lượng nào xảy ra vì lỗi ĐÃ xảy ra và khách hàng đã nhận hàng lỗi?', options: ['Chi phí phòng ngừa', 'Chi phí thẩm định', 'Chi phí sai lỗi nội bộ', 'Chi phí sai lỗi bên ngoài'], correctIndex: 3, explanation: 'Chi phí sai lỗi bên ngoài: trả hàng, bảo hành, mất tín nhiệm — xảy ra sau khi khách hàng đã nhận sản phẩm lỗi.' },
  { id: 'q3', question: 'Chu trình nào vận hành xuyên suốt các nguyên tắc TQM theo Deming?', options: ['DMAIC', 'PDCA', 'TIMWOODS', 'Kanban'], correctIndex: 1, explanation: 'PDCA (Plan-Do-Check-Act) là chu trình cải tiến lặp lại mà Deming đưa vào TQM.' },
]);

const c6 = doc('lqm301c-6-1-six-sigma-dmaic', '6.1 — Six Sigma & the DMAIC cycle|||6.1 — Six Sigma & chu trình DMAIC',
  'Six Sigma (giảm biến động, 3.4 lỗi/triệu cơ hội), các đai (Green/Black/Master Black Belt), 5 bước DMAIC.',
  [[
    `<span class="eyebrow">LQM301c · Chapter 6 · Lesson 6.1</span>
<h2>Six Sigma &amp; the DMAIC cycle</h2>
<h3>What Six Sigma measures</h3>
<p><strong>Six Sigma</strong> is a data-driven method (born at Motorola, popularized by GE) to reduce <strong>variation</strong> in a process until it produces almost no defects. A process at "six sigma" quality produces about <strong>3.4 defects per million opportunities (DPMO)</strong> — an extremely tight, predictable process. The name comes from statistics: fitting 6 standard deviations (σ) between the process average and each specification limit.</p>
<h3>Roles — the "belts"</h3>
<pre><code>Yellow Belt         basic awareness, supports projects part-time
Green Belt          leads smaller improvement projects
Black Belt          leads major projects, trains Green Belts
Master Black Belt   coaches Black Belts, sets Six Sigma strategy company-wide
</code></pre>
<h3>DMAIC — the 5-step problem-solving cycle</h3>
<pre><code>Define   what problem, and what does the customer require?
Measure  collect real data on current performance
Analyze  find the root cause(s) using the data
Improve  design & test a solution that removes the root cause
Control  lock the gain in place so the process does not drift back
</code></pre>
<p>Unlike TQM's general PDCA, DMAIC is a strict, sequential, data-heavy method built specifically for solving one well-defined process problem end to end — a project, not a philosophy.</p>
<div class="callout"><span class="badge">Six Sigma needs Lean, and vice versa</span> Lean removes waste from the flow; Six Sigma removes variation from a specific process step. Combined as "Lean Six Sigma", they attack both problems at once.</div>`,
    `<span class="eyebrow">LQM301c · Chương 6 · Bài 6.1</span>
<h2>Six Sigma &amp; chu trình DMAIC</h2>
<h3>Six Sigma đo cái gì</h3>
<p><strong>Six Sigma</strong> là phương pháp dựa trên dữ liệu (ra đời ở Motorola, phổ biến rộng nhờ GE) để giảm <strong>biến động</strong> của quy trình đến mức gần như không còn lỗi. Một quy trình đạt chất lượng "six sigma" chỉ tạo ra khoảng <strong>3,4 lỗi trên một triệu cơ hội (DPMO)</strong> — một quy trình cực kỳ chặt và dự đoán được. Tên gọi bắt nguồn từ thống kê: đặt được 6 độ lệch chuẩn (σ) giữa giá trị trung bình quy trình và mỗi giới hạn kỹ thuật.</p>
<h3>Vai trò — hệ thống "đai"</h3>
<pre><code>Yellow Belt          hiểu cơ bản, hỗ trợ dự án bán thời gian
Green Belt           dẫn dắt các dự án cải tiến nhỏ hơn
Black Belt           dẫn dắt dự án lớn, đào tạo Green Belt
Master Black Belt    huấn luyện Black Belt, đặt chiến lược Six Sigma toàn công ty
</code></pre>
<h3>DMAIC — chu trình giải quyết vấn đề 5 bước</h3>
<pre><code>Define (Xác định)   vấn đề gì, khách hàng cần gì?
Measure (Đo lường)   thu thập dữ liệu thật về hiệu suất hiện tại
Analyze (Phân tích)  tìm nguyên nhân gốc bằng dữ liệu
Improve (Cải tiến)   thiết kế & thử giải pháp loại bỏ nguyên nhân gốc
Control (Kiểm soát)  giữ vững cải tiến để quy trình không trôi trở lại
</code></pre>
<p>Khác với PDCA tổng quát của TQM, DMAIC là phương pháp nghiêm ngặt, tuần tự, nặng dữ liệu, được xây riêng để giải quyết dứt điểm MỘT vấn đề quy trình cụ thể — một dự án, không phải một triết lý.</p>
<div class="callout"><span class="badge">Six Sigma cần Lean, và ngược lại</span> Lean loại bỏ lãng phí trong dòng chảy; Six Sigma loại bỏ biến động trong một bước quy trình cụ thể. Kết hợp thành "Lean Six Sigma", cả hai vấn đề được tấn công cùng lúc.</div>`,
  ]]);

const c6q = quiz('lqm301c-quiz-6', 'Quiz 6 — Six Sigma & DMAIC|||Quiz 6 — Six Sigma & DMAIC', [
  { id: 'q1', question: 'Một quy trình đạt chất lượng "Six Sigma" có khoảng bao nhiêu lỗi trên một triệu cơ hội (DPMO)?', options: ['3,4', '34', '340', '3.400'], correctIndex: 0, explanation: 'Six Sigma tương ứng khoảng 3,4 DPMO — mức biến động rất thấp.' },
  { id: 'q2', question: 'Bước nào của DMAIC diễn ra NGAY SAU "Measure"?', options: ['Define', 'Analyze', 'Improve', 'Control'], correctIndex: 1, explanation: 'Thứ tự DMAIC: Define → Measure → Analyze → Improve → Control.' },
  { id: 'q3', question: 'Vai trò nào huấn luyện Black Belt và đặt chiến lược Six Sigma toàn công ty?', options: ['Yellow Belt', 'Green Belt', 'Black Belt', 'Master Black Belt'], correctIndex: 3, explanation: 'Master Black Belt là cấp cao nhất, huấn luyện Black Belt và định hướng chiến lược.' },
]);

const c7 = doc('lqm301c-7-1-qc-tools-spc', '7.1 — The 7 QC tools & statistical process control|||7.1 — 7 công cụ kiểm soát chất lượng & SPC',
  '7 công cụ QC (check sheet, Pareto, biểu đồ xương cá, histogram, biểu đồ kiểm soát, scatter, lưu đồ); SPC, giới hạn kiểm soát UCL/LCL, biến động thường/đặc biệt.',
  [[
    `<span class="eyebrow">LQM301c · Chapter 7 · Lesson 7.1</span>
<h2>The 7 QC tools &amp; statistical process control</h2>
<h3>The 7 basic quality-control tools</h3>
<pre><code>1. Check sheet          simple tally of how often something occurs
2. Pareto chart         ranks causes; the "80/20 rule" — few causes drive most defects
3. Cause-and-effect     "fishbone"/Ishikawa diagram; branches out possible root causes
4. Histogram            shows the distribution/spread of measured data
5. Control chart        plots a process over time against control limits
6. Scatter diagram      tests whether two variables are related
7. Flowchart / stratification  maps the process, or splits data by source/category
</code></pre>
<h3>The Pareto principle in practice</h3>
<p>A Pareto chart typically shows that roughly <strong>80% of defects come from about 20% of causes</strong> — so a team fixes the tallest bars first, not every cause equally.</p>
<h3>Statistical Process Control (SPC)</h3>
<p><strong>SPC</strong> uses a <strong>control chart</strong> to watch a process over time: it plots the <strong>centerline</strong> (process average), plus an <strong>upper control limit (UCL)</strong> and <strong>lower control limit (LCL)</strong>, statistically derived from the process's own natural variation (not customer specification limits).</p>
<pre><code>Common-cause variation   normal, expected "noise"; process is IN control
Special-cause variation  an unusual signal (a point outside UCL/LCL, a run/trend);
                          process is OUT of control — investigate the specific cause
</code></pre>
<p>The critical distinction: fixing normal common-cause variation as if it were a special event only adds more variation (tampering); ignoring a real special-cause signal lets a real problem run uncontrolled.</p>
<div class="callout"><span class="badge">Data before opinion</span> All 7 QC tools exist to replace guessing with a picture of real data — this is TQM principle 7 (factual decision making) made into concrete tools.</div>`,
    `<span class="eyebrow">LQM301c · Chương 7 · Bài 7.1</span>
<h2>7 công cụ kiểm soát chất lượng &amp; SPC</h2>
<h3>7 công cụ QC cơ bản</h3>
<pre><code>1. Check sheet (phiếu kiểm)     đếm đơn giản số lần một sự việc xảy ra
2. Biểu đồ Pareto               xếp hạng nguyên nhân; "quy luật 80/20" — ít nguyên
                                  nhân gây ra hầu hết lỗi
3. Biểu đồ nhân quả             biểu đồ "xương cá"/Ishikawa; phân nhánh các nguyên
                                  nhân gốc có thể xảy ra
4. Histogram                    thể hiện phân bố/độ trải của dữ liệu đo được
5. Biểu đồ kiểm soát            vẽ quy trình theo thời gian, đối chiếu giới hạn kiểm soát
6. Biểu đồ phân tán (scatter)   kiểm tra hai biến có liên quan nhau không
7. Lưu đồ / phân lớp dữ liệu    vẽ bản đồ quy trình, hoặc tách dữ liệu theo nguồn/nhóm
</code></pre>
<h3>Nguyên lý Pareto trong thực tế</h3>
<p>Biểu đồ Pareto thường cho thấy khoảng <strong>80% lỗi đến từ khoảng 20% nguyên nhân</strong> — nên nhóm cải tiến nên sửa những cột cao nhất trước, không dàn đều mọi nguyên nhân.</p>
<h3>Kiểm soát quy trình bằng thống kê (SPC)</h3>
<p><strong>SPC</strong> dùng <strong>biểu đồ kiểm soát</strong> để theo dõi quy trình theo thời gian: vẽ <strong>đường tâm</strong> (trung bình quy trình), cùng <strong>giới hạn kiểm soát trên (UCL)</strong> và <strong>giới hạn kiểm soát dưới (LCL)</strong>, được tính từ chính biến động tự nhiên của quy trình (không phải giới hạn kỹ thuật của khách hàng).</p>
<pre><code>Biến động nguyên nhân thường  "nhiễu" bình thường, dự đoán được; quy trình
                                ĐANG trong kiểm soát
Biến động nguyên nhân đặc biệt tín hiệu bất thường (điểm vượt UCL/LCL, một xu hướng);
                                quy trình NGOÀI kiểm soát — cần điều tra nguyên nhân
</code></pre>
<p>Sự khác biệt quan trọng: sửa biến động thường như thể nó là một biến cố đặc biệt chỉ làm tăng thêm biến động (can thiệp sai/tampering); bỏ qua một tín hiệu đặc biệt thật sẽ để một vấn đề thật chạy không kiểm soát.</p>
<div class="callout"><span class="badge">Dữ liệu trước cảm tính</span> Cả 7 công cụ QC đều tồn tại để thay việc đoán bằng một hình ảnh dữ liệu thật — đây chính là nguyên tắc TQM số 7 (quyết định dựa trên dữ liệu) được cụ thể hoá thành công cụ.</div>`,
  ]]);

const c7q = quiz('lqm301c-quiz-7', 'Quiz 7 — 7 công cụ QC & SPC|||Quiz 7 — QC tools & SPC', [
  { id: 'q1', question: 'Biểu đồ nào áp dụng "quy luật 80/20" để tìm ra ít nguyên nhân gây ra hầu hết lỗi?', options: ['Histogram', 'Biểu đồ Pareto', 'Biểu đồ phân tán', 'Lưu đồ'], correctIndex: 1, explanation: 'Biểu đồ Pareto xếp hạng nguyên nhân theo mức đóng góp vào lỗi, thường lộ ra 20% nguyên nhân gây 80% lỗi.' },
  { id: 'q2', question: 'Trong biểu đồ kiểm soát (SPC), một điểm vượt ra ngoài UCL/LCL báo hiệu điều gì?', options: ['Biến động nguyên nhân thường, bỏ qua được', 'Biến động nguyên nhân đặc biệt — cần điều tra', 'Quy trình đạt Six Sigma', 'Cần thêm tồn kho đệm'], correctIndex: 1, explanation: 'Điểm ngoài giới hạn kiểm soát là dấu hiệu biến động đặc biệt — quy trình đang ngoài kiểm soát, cần tìm nguyên nhân cụ thể.' },
  { id: 'q3', question: 'Biểu đồ "xương cá" (fishbone/Ishikawa) dùng để làm gì?', options: ['Đếm số lần lỗi xảy ra', 'Phân nhánh các nguyên nhân gốc có thể của một vấn đề', 'Vẽ quy trình theo thời gian', 'Kiểm tra tương quan giữa hai biến'], correctIndex: 1, explanation: 'Biểu đồ nhân quả/Ishikawa tổ chức các nguyên nhân gốc tiềm năng thành các nhánh quanh một vấn đề trung tâm.' },
]);

const c8 = doc('lqm301c-8-1-iso9001-culture-vn', '8.1 — ISO 9001, continuous-improvement culture & Vietnam practice|||8.1 — ISO 9001, văn hoá cải tiến liên tục & thực tiễn Việt Nam',
  'ISO 9001 (hệ thống quản lý chất lượng theo PDCA), quy trình chứng nhận; văn hoá Kaizen & gemba; áp dụng Lean/Six Sigma tại doanh nghiệp Việt Nam (Toyota Việt Nam, dệt may, da giày).',
  [[
    `<span class="eyebrow">LQM301c · Chapter 8 · Lesson 8.1</span>
<h2>ISO 9001, continuous-improvement culture &amp; Vietnam practice</h2>
<h3>What ISO 9001 actually certifies</h3>
<p><strong>ISO 9001</strong> is an international standard for a <strong>Quality Management System (QMS)</strong> — it does not certify that a specific product is "good", it certifies that an organization has a documented, consistent, PDCA-driven system for meeting customer and regulatory requirements and continually improving. It is built entirely on the PDCA cycle: Plan (context, risk, objectives) → Do (operate the process) → Check (monitor, audit, measure) → Act (correct and improve).</p>
<h3>The certification path</h3>
<pre><code>1. Gap analysis      compare current practice against the standard's requirements
2. Documentation      write the QMS: policies, procedures, records
3. Implementation     run the QMS for a period, generate real records
4. Internal audit     the organization checks itself before the real audit
5. Certification audit an accredited external body verifies compliance
6. Surveillance audits periodic re-checks to keep the certificate valid
</code></pre>
<h3>Culture: Kaizen and gemba</h3>
<p>Tools alone do not sustain improvement — Toyota's deeper lesson is <strong>culture</strong>: <strong>gemba</strong> ("the real place") means managers go see the actual work, not just read reports; <strong>respect for people</strong> means the people doing the work are trusted to spot and fix problems, not just follow orders. Without this culture, 5S boards and Kanban cards decay back into old habits within months.</p>
<h3>Lean &amp; quality in Vietnam</h3>
<p><strong>Toyota Vietnam</strong> runs the same TPS principles (JIT, Jidoka, Kaizen) as its parent company, training local suppliers to the same standard. Vietnam's large <strong>garment and footwear</strong> export sector — under pressure from global buyers who audit for both efficiency and compliance — has widely adopted 5S, Kaizen and Lean layout redesign to compete on cost and lead time. Common local challenges: high staff turnover erodes trained Kaizen habits, and SME suppliers often adopt the visible tools (boards, tags) without the deeper PDCA discipline behind them.</p>
<div class="callout"><span class="badge">Closing the loop of the course</span> ISO 9001's PDCA, TQM's continuous improvement, Kaizen's small daily change, and Six Sigma's DMAIC are the same underlying idea, wearing four different names — never stop checking, and never stop acting on what you find.</div>`,
    `<span class="eyebrow">LQM301c · Chương 8 · Bài 8.1</span>
<h2>ISO 9001, văn hoá cải tiến liên tục &amp; thực tiễn Việt Nam</h2>
<h3>ISO 9001 thực ra chứng nhận cái gì</h3>
<p><strong>ISO 9001</strong> là tiêu chuẩn quốc tế cho <strong>Hệ thống Quản lý Chất lượng (QMS)</strong> — nó KHÔNG chứng nhận một sản phẩm cụ thể là "tốt", mà chứng nhận tổ chức có một hệ thống được ghi chép, nhất quán, vận hành theo PDCA để đáp ứng yêu cầu khách hàng/pháp lý và liên tục cải tiến. Nó được xây hoàn toàn trên chu trình PDCA: Plan (bối cảnh, rủi ro, mục tiêu) → Do (vận hành quy trình) → Check (giám sát, kiểm toán, đo lường) → Act (khắc phục và cải tiến).</p>
<h3>Con đường chứng nhận</h3>
<pre><code>1. Phân tích khoảng cách   so sánh thực tế hiện tại với yêu cầu tiêu chuẩn
2. Xây tài liệu            viết QMS: chính sách, quy trình, hồ sơ
3. Triển khai              vận hành QMS trong một thời gian, tạo hồ sơ thật
4. Kiểm toán nội bộ        tổ chức tự kiểm trước khi kiểm toán thật
5. Kiểm toán chứng nhận    một tổ chức bên ngoài được công nhận xác minh tuân thủ
6. Kiểm toán giám sát      kiểm tra định kỳ để giữ hiệu lực chứng nhận
</code></pre>
<h3>Văn hoá: Kaizen và gemba</h3>
<p>Công cụ một mình không giữ được cải tiến lâu dài — bài học sâu hơn của Toyota là <strong>văn hoá</strong>: <strong>gemba</strong> ("nơi thực tế diễn ra") nghĩa là quản lý phải đến tận nơi xem việc thật, không chỉ đọc báo cáo; <strong>tôn trọng con người</strong> nghĩa là chính người làm việc được tin tưởng để phát hiện và sửa vấn đề, không chỉ làm theo lệnh. Thiếu văn hoá này, bảng 5S và thẻ Kanban sẽ rơi lại về thói quen cũ chỉ sau vài tháng.</p>
<h3>Lean &amp; chất lượng tại Việt Nam</h3>
<p><strong>Toyota Việt Nam</strong> áp dụng đúng các nguyên tắc TPS (JIT, Jidoka, Kaizen) như công ty mẹ, và huấn luyện nhà cung cấp trong nước theo cùng chuẩn. Ngành <strong>dệt may và da giày</strong> xuất khẩu lớn của Việt Nam — dưới sức ép từ các nhà mua hàng toàn cầu kiểm toán cả hiệu quả và tuân thủ — đã áp dụng rộng rãi 5S, Kaizen và bố trí lại mặt bằng theo Lean để cạnh tranh về chi phí và thời gian giao hàng. Thách thức phổ biến ở địa phương: tỷ lệ nghỉ việc cao làm mòn thói quen Kaizen đã huấn luyện, và các nhà cung cấp SME thường chỉ áp dụng công cụ dễ thấy (bảng, thẻ) mà thiếu kỷ luật PDCA sâu bên dưới.</p>
<div class="callout"><span class="badge">Khép lại vòng tròn môn học</span> PDCA của ISO 9001, cải tiến liên tục của TQM, thay đổi nhỏ hằng ngày của Kaizen, và DMAIC của Six Sigma đều là một ý tưởng nền, mang bốn cái tên khác nhau — không bao giờ ngừng kiểm tra, và không bao giờ ngừng hành động theo điều mình phát hiện.</div>`,
  ]]);

const c8q = quiz('lqm301c-quiz-8', 'Quiz 8 — ISO 9001 & văn hoá cải tiến|||Quiz 8 — ISO 9001 & improvement culture', [
  { id: 'q1', question: 'ISO 9001 thực chất chứng nhận điều gì?', options: ['Một sản phẩm cụ thể đạt chất lượng cao', 'Tổ chức có hệ thống quản lý chất lượng vận hành theo PDCA', 'Nhà máy không có bất kỳ lỗi nào', 'Chi phí sản xuất thấp nhất trong ngành'], correctIndex: 1, explanation: 'ISO 9001 chứng nhận hệ thống quản lý (QMS), không chứng nhận trực tiếp một sản phẩm.' },
  { id: 'q2', question: '"Gemba" trong văn hoá Kaizen nghĩa là gì?', options: ['Bảng theo dõi KPI trên phần mềm', 'Nơi thực tế diễn ra công việc — quản lý phải đến tận nơi xem', 'Chứng nhận ISO cấp cao nhất', 'Một loại biểu đồ kiểm soát'], correctIndex: 1, explanation: 'Gemba nghĩa là "nơi thực tế" — quản lý cần đến hiện trường thay vì chỉ đọc báo cáo.' },
  { id: 'q3', question: 'Thách thức phổ biến khi doanh nghiệp Việt Nam áp dụng Lean được nêu trong bài là gì?', options: ['Thiếu nguyên liệu nhập khẩu', 'Tỷ lệ nghỉ việc cao làm mòn thói quen Kaizen; SME chỉ áp dụng công cụ bề mặt', 'Không có nhà máy nào áp dụng Lean', 'Chi phí chứng nhận ISO quá thấp'], correctIndex: 1, explanation: 'Bài nêu hai thách thức: nghỉ việc cao xoá mòn thói quen đã huấn luyện, và SME thường chỉ áp dụng bảng/thẻ mà thiếu kỷ luật PDCA sâu.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'LQM301c',
    slug: 'lqm301c-lean-and-quality-management',
    title: 'Lean and Quality Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/LQM301c.webp',
    shortDescription: 'Lean & quality management: eliminate waste, build quality in. Toyota origins, 8 wastes (muda), Lean tools (5S, Kaizen, Kanban, VSM), JIT, TQM, Six Sigma DMAIC, QC tools & SPC, ISO 9001. Bilingual, with Vietnam examples & quizzes.|||Lean & quản trị chất lượng: loại bỏ lãng phí, xây chất lượng từ đầu. Nguồn gốc Toyota, 8 lãng phí (muda), công cụ Lean (5S, Kaizen, Kanban, VSM), JIT, TQM, Six Sigma DMAIC, công cụ QC & SPC, ISO 9001. Song ngữ, có ví dụ VN và quiz.',
    description: 'Môn <strong>LQM301c — Lean and Quality Management</strong> (kỳ 5, khối Quản trị Kinh doanh) dạy cách <strong>loại bỏ lãng phí</strong> và <strong>xây chất lượng ngay từ đầu quy trình</strong>. Từ <strong>nguồn gốc Toyota Production System</strong> → <strong>5 nguyên lý Lean &amp; 8 loại lãng phí (muda)</strong> → <strong>công cụ Lean</strong> (5S, Kaizen, Kanban, Value Stream Mapping) → <strong>Just-in-Time &amp; dòng chảy liên tục</strong> → <strong>Quản trị chất lượng toàn diện (TQM)</strong> → <strong>Six Sigma &amp; DMAIC</strong> → <strong>7 công cụ kiểm soát chất lượng &amp; SPC</strong> → <strong>ISO 9001 và văn hoá cải tiến liên tục</strong>, kèm ví dụ thực tế tại doanh nghiệp Việt Nam. Bám giáo trình FLM (Lean Thinking, The Toyota Way, Quality Management), song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Nguồn gốc Lean & các nhà tiên phong chất lượng (Deming, Juran, Crosby); 5 nguyên lý Lean & 8 loại lãng phí TIMWOODS; mura/muri; 5S, Kaizen/PDCA, Kanban/WIP, Value Stream Mapping; JIT, takt time, one-piece flow, Heijunka, Jidoka & Andon; 8 nguyên tắc TQM, chi phí chất lượng; Six Sigma & DMAIC, hệ thống đai; 7 công cụ QC, SPC & giới hạn kiểm soát UCL/LCL; ISO 9001, văn hoá gemba & thực tiễn Lean tại Việt Nam.',
    requirements: 'Không yêu cầu kiến thức nền đặc biệt. Nên đã học qua các môn quản trị vận hành/nhập môn quản trị kinh doanh của khối BBA.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách nền, tài liệu ISO 9001, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Lean là gì, quản trị chất lượng là gì, vì sao đi cùng nhau.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan Lean & quản trị chất lượng|||Chapter 1 — Lean & quality overview', description: 'TPS, giá trị theo khách hàng, Deming/Juran/Crosby.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nguyên lý Lean & 8 loại lãng phí (muda)|||Chapter 2 — Lean principles & the 8 wastes', description: '5 nguyên lý Lean, TIMWOODS, mura/muri.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Công cụ Lean|||Chapter 3 — Lean tools', description: '5S, Kaizen, Kanban, Value Stream Mapping.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Just-in-Time & dòng chảy liên tục|||Chapter 4 — JIT & continuous flow', description: 'Takt time, one-piece flow, Heijunka, Jidoka, Andon.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tổng quan quản trị chất lượng toàn diện (TQM)|||Chapter 5 — TQM overview', description: '8 nguyên tắc TQM, 14 điểm Deming, chi phí chất lượng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Six Sigma & DMAIC|||Chapter 6 — Six Sigma & DMAIC', description: 'DPMO, hệ thống đai, 5 bước DMAIC.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Công cụ kiểm soát chất lượng & SPC|||Chapter 7 — QC tools & SPC', description: '7 công cụ QC, Pareto, biểu đồ kiểm soát, UCL/LCL.', lessons: [c7, c7q] },
    { title: 'Chương 8 — ISO 9001, văn hoá cải tiến liên tục & thực tiễn Việt Nam|||Chapter 8 — ISO 9001, culture & Vietnam practice', description: 'PDCA của ISO 9001, gemba, Lean tại doanh nghiệp Việt Nam.', lessons: [c8, c8q] },
  ],
};
