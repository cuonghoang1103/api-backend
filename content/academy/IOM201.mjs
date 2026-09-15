/**
 * IOM201 — International Operations Management. Giáo trình FLM (syl): Heizer/
 * Render "Operations Management"; Slack "Operations Management"; Dornier
 * "Global Operations and Logistics". 8 chương: tổng quan → chiến lược vận
 * hành → thiết kế sản phẩm/quy trình/bố trí → chuỗi cung ứng toàn cầu → chất
 * lượng (TQM/Six Sigma/ISO) → dự báo & hoạch định năng lực → tồn kho &
 * lean/JIT quốc tế → bền vững & Industry 4.0. Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('iom201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">IOM201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn International Operations Management — operations strategy, process &amp; layout design, global supply chains, quality, forecasting/capacity, inventory/lean and sustainability — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for IOM201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.mheducation.com/highered/product/operations-management-heizer-render.html" target="_blank" rel="noopener">Heizer &amp; Render — <em>Operations Management: Sustainability and Supply Chain Management</em></a></li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/operations-management/P200000006276" target="_blank" rel="noopener">Nigel Slack et al. — <em>Operations Management</em></a></li>
<li><a href="https://www.wiley.com/en-us/Global+Operations+and+Logistics%3A+Text+and+Cases-p-9780471617423" target="_blank" rel="noopener">Dornier et al. — <em>Global Operations and Logistics</em></a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.apics.org/" target="_blank" rel="noopener">ASCM/APICS — supply chain body of knowledge</a></li>
<li><a href="https://asq.org/quality-resources" target="_blank" rel="noopener">ASQ — quality resources (TQM, Six Sigma, ISO)</a></li>
<li><a href="https://www.iso.org/iso-9001-quality-management.html" target="_blank" rel="noopener">ISO — ISO 9001 quality management overview</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@LeanSixSigmaAcademy" target="_blank" rel="noopener">Lean Six Sigma Academy</a> — TQM/Six Sigma explained</li>
<li><a href="https://www.youtube.com/@wittraining" target="_blank" rel="noopener">Wit Training</a> — operations &amp; supply chain fundamentals</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>Excel/Google Sheets — dự báo (moving average, exponential smoothing), tính EOQ, biểu đồ kiểm soát</li>
<li><a href="https://www.tulip.co/resources/" target="_blank" rel="noopener">Process/layout diagram templates</a> — vẽ sơ đồ bố trí, sơ đồ chuỗi cung ứng</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — 10 quyết định vận hành, chiến lược cạnh tranh, thiết kế sản phẩm/quy trình/bố trí.</li>
<li><strong>Practice</strong> — bài tập EOQ, dự báo, hoạch định năng lực; đọc case chuỗi cung ứng toàn cầu.</li>
<li><strong>Go deeper</strong> — TQM/Six Sigma/ISO, lean/JIT, Industry 4.0.</li>
<li><strong>Job-ready</strong> — phân tích một chuỗi cung ứng thật (ví dụ hãng đa quốc gia) theo khung 8 chương.</li>
</ol></div>`,
    `<span class="eyebrow">IOM201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Quản trị vận hành quốc tế — chiến lược vận hành, thiết kế quy trình &amp; bố trí, chuỗi cung ứng toàn cầu, chất lượng, dự báo/hoạch định năng lực, tồn kho/lean và bền vững — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IOM201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.mheducation.com/highered/product/operations-management-heizer-render.html" target="_blank" rel="noopener">Heizer &amp; Render — <em>Operations Management: Sustainability and Supply Chain Management</em></a></li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/operations-management/P200000006276" target="_blank" rel="noopener">Nigel Slack và các tác giả — <em>Operations Management</em></a></li>
<li><a href="https://www.wiley.com/en-us/Global+Operations+and+Logistics%3A+Text+and+Cases-p-9780471617423" target="_blank" rel="noopener">Dornier và các tác giả — <em>Global Operations and Logistics</em></a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.apics.org/" target="_blank" rel="noopener">ASCM/APICS — kho kiến thức chuỗi cung ứng</a></li>
<li><a href="https://asq.org/quality-resources" target="_blank" rel="noopener">ASQ — tài liệu chất lượng (TQM, Six Sigma, ISO)</a></li>
<li><a href="https://www.iso.org/iso-9001-quality-management.html" target="_blank" rel="noopener">ISO — tổng quan ISO 9001</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@LeanSixSigmaAcademy" target="_blank" rel="noopener">Lean Six Sigma Academy</a> — giải thích TQM/Six Sigma</li>
<li><a href="https://www.youtube.com/@wittraining" target="_blank" rel="noopener">Wit Training</a> — nền tảng vận hành &amp; chuỗi cung ứng</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li>Excel/Google Sheets — dự báo (bình quân trượt, san mũ), tính EOQ, biểu đồ kiểm soát</li>
<li><a href="https://www.tulip.co/resources/" target="_blank" rel="noopener">Mẫu sơ đồ quy trình/bố trí</a> — vẽ sơ đồ bố trí, sơ đồ chuỗi cung ứng</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — 10 quyết định vận hành, chiến lược cạnh tranh, thiết kế sản phẩm/quy trình/bố trí.</li>
<li><strong>Luyện tập</strong> — bài tập EOQ, dự báo, hoạch định năng lực; đọc case chuỗi cung ứng toàn cầu.</li>
<li><strong>Đào sâu thực tế</strong> — TQM/Six Sigma/ISO, lean/JIT, Industry 4.0.</li>
<li><strong>Sẵn sàng đi làm</strong> — phân tích một chuỗi cung ứng thật (ví dụ hãng đa quốc gia) theo khung 8 chương.</li>
</ol></div>`,
  ]]);

const intro = doc('iom201-0-1-overview', 'Course overview: International Operations Management|||Tổng quan: Quản trị vận hành quốc tế',
  'Vận hành là gì; 10 quyết định vận hành (Heizer/Render); vì sao "quốc tế"; lộ trình 8 chương từ tổng quan đến bền vững & công nghệ.',
  [[
    `<span class="eyebrow">IOM201 · Lesson 0.1 · Overview</span>
<h2>International Operations Management</h2>
<p class="lead">This course helps you understand <strong>how organizations design, run and improve the processes that turn resources into goods and services across borders</strong> — the backbone of every multinational's competitiveness. You'll learn to make the classic <strong>10 operations decisions</strong> (Heizer &amp; Render) in a global context: what to make, how to design it, where to locate, how to source, and how to keep quality and cost under control when suppliers, factories and customers sit in different countries.</p>
<h3>Why "international"?</h3>
<ul>
<li><strong>Global sourcing &amp; offshoring</strong> — raw materials, components and even whole production steps cross borders to chase cost, quality or speed.</li>
<li><strong>Global customers</strong> — products must satisfy different regulations, tastes and logistics constraints in each market.</li>
<li><strong>Global competition</strong> — a firm's rivals are no longer only domestic; a slow or costly operation loses to a leaner one anywhere in the world.</li>
</ul>
<h3>The 10 strategic operations decisions</h3>
<pre><code>1. Goods &amp; service design      6. Human resources &amp; job design
2. Quality management            7. Supply chain management
3. Process &amp; capacity design    8. Inventory management
4. Location strategy             9. Scheduling
5. Layout strategy               10. Maintenance
</code></pre>
<h3>Roadmap</h3>
<p>Overview → operations strategy &amp; global competitiveness → product/process design &amp; layout → global supply chain management → quality (TQM/Six Sigma/ISO) → forecasting &amp; capacity planning → inventory &amp; lean/JIT → sustainability, Industry 4.0 &amp; practice. Bilingual, with worked examples and quizzes each chapter.</p>`,
    `<span class="eyebrow">IOM201 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị vận hành quốc tế</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>cách tổ chức thiết kế, điều hành và cải tiến các quy trình biến nguồn lực thành hàng hoá &amp; dịch vụ xuyên biên giới</strong> — nền tảng sức cạnh tranh của mọi công ty đa quốc gia. Bạn sẽ học ra <strong>10 quyết định vận hành</strong> kinh điển (Heizer &amp; Render) trong bối cảnh toàn cầu: làm gì, thiết kế thế nào, đặt ở đâu, nguồn hàng từ đâu, và giữ chất lượng &amp; chi phí ra sao khi nhà cung cấp, nhà máy và khách hàng nằm ở nhiều nước khác nhau.</p>
<h3>Vì sao "quốc tế"?</h3>
<ul>
<li><strong>Nguồn cung toàn cầu &amp; offshoring</strong> — nguyên liệu, linh kiện và cả từng bước sản xuất di chuyển qua biên giới để tìm chi phí, chất lượng hoặc tốc độ tốt hơn.</li>
<li><strong>Khách hàng toàn cầu</strong> — sản phẩm phải đáp ứng quy định, thị hiếu và ràng buộc logistics khác nhau ở mỗi thị trường.</li>
<li><strong>Cạnh tranh toàn cầu</strong> — đối thủ của một công ty không còn chỉ trong nước; vận hành chậm hoặc đắt sẽ thua một đối thủ tinh gọn hơn ở bất kỳ đâu trên thế giới.</li>
</ul>
<h3>10 quyết định vận hành chiến lược</h3>
<pre><code>1. Thiết kế sản phẩm &amp; dịch vụ    6. Nhân sự &amp; thiết kế công việc
2. Quản trị chất lượng             7. Quản trị chuỗi cung ứng
3. Thiết kế quy trình &amp; năng lực  8. Quản trị tồn kho
4. Chiến lược vị trí               9. Lập tiến độ
5. Chiến lược bố trí               10. Bảo trì
</code></pre>
<h3>Lộ trình</h3>
<p>Tổng quan → chiến lược vận hành &amp; năng lực cạnh tranh toàn cầu → thiết kế sản phẩm/quy trình &amp; bố trí → quản trị chuỗi cung ứng toàn cầu → chất lượng (TQM/Six Sigma/ISO) → dự báo &amp; hoạch định năng lực → tồn kho &amp; lean/JIT → bền vững, Industry 4.0 &amp; thực tiễn. Song ngữ, có ví dụ mẫu và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('iom201-1-1-overview-of-iom', '1.1 — Overview of international operations management|||1.1 — Tổng quan quản trị vận hành quốc tế',
  'Vận hành biến input thành output; khác biệt vận hành nội địa vs quốc tế; động lực toàn cầu hoá (chi phí, thị trường, nguồn lực, cạnh tranh); rào cản.',
  [[
    `<span class="eyebrow">IOM201 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of international operations management</h2>
<h3>What operations management does</h3>
<p><strong>Operations management (OM)</strong> is the set of activities that transform <strong>inputs</strong> (labor, materials, capital, information) into <strong>outputs</strong> (goods and services) that create value for customers. Every organization — factory, hospital, airline, bank — has an operations function, whether it calls it that or not.</p>
<pre><code>Inputs (land, labor, capital, info)
   -> TRANSFORMATION PROCESS (the operations system)
      -> Outputs (goods, services) -> Customer value
      &lt;- Feedback loop (quality, cost, speed data) -&gt;
</code></pre>
<h3>Domestic vs. international operations</h3>
<ul>
<li><strong>Domestic operations</strong> — one country, one currency, one regulatory regime, relatively uniform customer expectations.</li>
<li><strong>International operations</strong> — multiple countries: different currencies (exchange-rate risk), different laws/tariffs, different labor markets, different infrastructure, culture and customer tastes. Coordination becomes harder, but so does the opportunity: cheaper inputs, new markets, risk diversification.</li>
</ul>
<h3>Why firms globalize their operations (Heizer/Render's drivers)</h3>
<ol>
<li><strong>Reduce costs</strong> — cheaper labor, materials, taxes, or avoiding tariffs by producing locally.</li>
<li><strong>Improve the supply chain</strong> — locate near key suppliers or raw materials.</li>
<li><strong>Provide better goods and services</strong> — being near the customer improves speed and customization.</li>
<li><strong>Understand markets</strong> — a local presence teaches the firm about new customers and competitors.</li>
<li><strong>Learn to improve operations</strong> — exposure to different practices (e.g. lean in Japan) spreads know-how across the firm.</li>
<li><strong>Attract and retain global talent</strong>.</li>
</ol>
<div class="callout"><span class="badge">Trade-off</span> Going international multiplies opportunity AND complexity at the same time — the rest of this course is about managing that trade-off decision by decision.</div>`,
    `<span class="eyebrow">IOM201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan quản trị vận hành quốc tế</h2>
<h3>Quản trị vận hành làm gì</h3>
<p><strong>Quản trị vận hành (OM)</strong> là tập hợp hoạt động biến <strong>đầu vào</strong> (lao động, vật liệu, vốn, thông tin) thành <strong>đầu ra</strong> (hàng hoá, dịch vụ) tạo giá trị cho khách hàng. Mọi tổ chức — nhà máy, bệnh viện, hãng hàng không, ngân hàng — đều có chức năng vận hành, dù có gọi tên như vậy hay không.</p>
<pre><code>Đầu vào (đất, lao động, vốn, thông tin)
   -> QUY TRÌNH BIẾN ĐỔI (hệ thống vận hành)
      -> Đầu ra (hàng hoá, dịch vụ) -> Giá trị cho khách hàng
      &lt;- Vòng phản hồi (dữ liệu chất lượng, chi phí, tốc độ) -&gt;
</code></pre>
<h3>Vận hành nội địa vs. quốc tế</h3>
<ul>
<li><strong>Vận hành nội địa</strong> — một quốc gia, một đơn vị tiền tệ, một khung pháp lý, kỳ vọng khách hàng khá đồng nhất.</li>
<li><strong>Vận hành quốc tế</strong> — nhiều quốc gia: tiền tệ khác nhau (rủi ro tỷ giá), luật/thuế quan khác nhau, thị trường lao động khác nhau, hạ tầng, văn hoá và thị hiếu khách hàng khác nhau. Phối hợp khó hơn, nhưng cơ hội cũng lớn hơn: đầu vào rẻ hơn, thị trường mới, phân tán rủi ro.</li>
</ul>
<h3>Vì sao doanh nghiệp toàn cầu hoá vận hành (động lực theo Heizer/Render)</h3>
<ol>
<li><strong>Giảm chi phí</strong> — lao động, vật liệu, thuế rẻ hơn, hoặc tránh thuế quan bằng cách sản xuất tại chỗ.</li>
<li><strong>Cải thiện chuỗi cung ứng</strong> — đặt gần nhà cung cấp chính hoặc nguồn nguyên liệu.</li>
<li><strong>Cung cấp hàng hoá/dịch vụ tốt hơn</strong> — ở gần khách hàng giúp nhanh hơn và tuỳ biến tốt hơn.</li>
<li><strong>Hiểu thị trường</strong> — có mặt tại chỗ giúp công ty học về khách hàng và đối thủ mới.</li>
<li><strong>Học cách cải tiến vận hành</strong> — tiếp xúc thực tiễn khác nhau (vd lean ở Nhật) lan toả tri thức trong công ty.</li>
<li><strong>Thu hút &amp; giữ nhân tài toàn cầu</strong>.</li>
</ol>
<div class="callout"><span class="badge">Đánh đổi</span> Toàn cầu hoá nhân đôi cả cơ hội VÀ độ phức tạp cùng lúc — cả môn học này là cách quản lý sự đánh đổi đó, quyết định theo quyết định.</div>`,
  ]]);

const c1q = quiz('iom201-quiz-1', 'Quiz 1 — Overview of IOM|||Quiz 1 — Tổng quan quản trị vận hành quốc tế', [
  { id: 'q1', question: 'Quản trị vận hành (operations management) về bản chất là gì?', options: ['Chỉ quản lý tài chính doanh nghiệp', 'Biến đầu vào thành đầu ra tạo giá trị cho khách hàng', 'Chỉ là hoạt động marketing', 'Chỉ áp dụng cho nhà máy sản xuất'], correctIndex: 1, explanation: 'OM là quy trình biến đổi input (lao động, vật liệu, vốn, thông tin) thành output (hàng hoá/dịch vụ) có giá trị — áp dụng cho mọi loại tổ chức, không riêng nhà máy.' },
  { id: 'q2', question: 'Điểm khác biệt LỚN NHẤT giữa vận hành nội địa và vận hành quốc tế là gì?', options: ['Vận hành quốc tế không cần quản trị chất lượng', 'Vận hành quốc tế đối mặt nhiều tiền tệ, luật, hạ tầng và văn hoá khác nhau', 'Vận hành nội địa luôn rẻ hơn', 'Không có khác biệt đáng kể'], correctIndex: 1, explanation: 'Quốc tế hoá đưa thêm rủi ro tỷ giá, khác biệt pháp lý/thuế quan, hạ tầng và thị hiếu khách hàng theo từng nước — làm phối hợp phức tạp hơn nhiều.' },
  { id: 'q3', question: 'Theo Heizer/Render, đâu KHÔNG phải là động lực khiến doanh nghiệp toàn cầu hoá vận hành?', options: ['Giảm chi phí', 'Hiểu thị trường mới', 'Học cách cải tiến vận hành từ thực tiễn nước khác', 'Xoá bỏ hoàn toàn nhu cầu quản trị chất lượng'], correctIndex: 3, explanation: 'Sáu động lực chính là giảm chi phí, cải thiện chuỗi cung ứng, cung cấp hàng/dịch vụ tốt hơn, hiểu thị trường, học cải tiến vận hành, và thu hút nhân tài — không có động lực nào xoá bỏ nhu cầu quản trị chất lượng.' },
]);

const c2 = doc('iom201-2-1-operations-strategy', '2.1 — Operations strategy & global competitiveness|||2.1 — Chiến lược vận hành & năng lực cạnh tranh toàn cầu',
  'Ưu tiên cạnh tranh (chi phí, chất lượng, tốc độ, linh hoạt); order winner vs qualifier; chiến lược quốc tế/đa quốc gia/toàn cầu/xuyên quốc gia; hội nhập toàn cầu vs đáp ứng địa phương.',
  [[
    `<span class="eyebrow">IOM201 · Chapter 2 · Lesson 2.1</span>
<h2>Operations strategy &amp; global competitiveness</h2>
<h3>Competitive priorities</h3>
<p>Operations strategy translates corporate strategy into concrete choices about <strong>competitive priorities</strong>:</p>
<ul>
<li><strong>Cost</strong> — compete by being the low-cost producer.</li>
<li><strong>Quality</strong> — compete on consistency and performance.</li>
<li><strong>Speed / delivery</strong> — compete on lead time and reliability.</li>
<li><strong>Flexibility</strong> — compete on variety, customization, and volume changes.</li>
</ul>
<p>An <strong>order winner</strong> is the priority that actually wins the customer's business; an <strong>order qualifier</strong> is a priority the firm must merely meet to even be considered (e.g. a baseline safety standard). Confusing the two is a classic strategic mistake — over-investing in a qualifier while under-investing in the winner.</p>
<h3>Four international strategies (integration vs. responsiveness)</h3>
<p>Bartlett &amp; Ghoshal's framework maps strategy on two axes — <strong>cost reduction (global integration)</strong> vs. <strong>local responsiveness</strong>:</p>
<pre><code>              Low local responsiveness   High local responsiveness
High cost   |  GLOBAL strategy         |  TRANSNATIONAL strategy       |
 reduction  |  (standardize worldwide) |  (standardize AND adapt)      |
Low cost    |  INTERNATIONAL strategy  |  MULTIDOMESTIC/MULTINATIONAL |
 reduction  |  (export core product)  |  (adapt per country)          |
</code></pre>
<ul>
<li><strong>International</strong> — export/license a largely unchanged product; low investment, low risk.</li>
<li><strong>Multidomestic</strong> — adapt products/processes per country; high responsiveness, high cost.</li>
<li><strong>Global</strong> — standardized product built in a few efficient locations, shipped worldwide; high efficiency, low local fit.</li>
<li><strong>Transnational</strong> — pursue efficiency AND local fit simultaneously by combining global-scale resources with local flexibility — hardest to execute, but the most competitive when it works.</li>
</ul>
<div class="callout"><span class="badge">Location follows strategy</span> A cost-driven global strategy locates factories where costs are lowest and ships worldwide; a responsiveness-driven multidomestic strategy locates a facility inside each key market instead.</div>`,
    `<span class="eyebrow">IOM201 · Chương 2 · Bài 2.1</span>
<h2>Chiến lược vận hành &amp; năng lực cạnh tranh toàn cầu</h2>
<h3>Ưu tiên cạnh tranh</h3>
<p>Chiến lược vận hành chuyển chiến lược công ty thành các lựa chọn cụ thể về <strong>ưu tiên cạnh tranh</strong>:</p>
<ul>
<li><strong>Chi phí</strong> — cạnh tranh bằng việc là nhà sản xuất chi phí thấp nhất.</li>
<li><strong>Chất lượng</strong> — cạnh tranh bằng độ ổn định và hiệu năng.</li>
<li><strong>Tốc độ / giao hàng</strong> — cạnh tranh bằng thời gian và độ tin cậy giao hàng.</li>
<li><strong>Linh hoạt</strong> — cạnh tranh bằng đa dạng sản phẩm, tuỳ biến và thay đổi sản lượng.</li>
</ul>
<p><strong>Order winner</strong> là ưu tiên thực sự thắng được đơn hàng của khách; <strong>order qualifier</strong> là ưu tiên doanh nghiệp chỉ cần đạt ngưỡng để được xem xét (vd một chuẩn an toàn cơ bản). Nhầm lẫn hai khái niệm này là lỗi chiến lược kinh điển — đầu tư quá nhiều vào qualifier mà thiếu đầu tư vào order winner.</p>
<h3>Bốn chiến lược quốc tế (hội nhập toàn cầu vs. đáp ứng địa phương)</h3>
<p>Khung của Bartlett &amp; Ghoshal đặt chiến lược lên hai trục — <strong>giảm chi phí (hội nhập toàn cầu)</strong> vs. <strong>đáp ứng địa phương</strong>:</p>
<pre><code>              Đáp ứng địa phương THẤP    Đáp ứng địa phương CAO
Giảm chi phí|  Chiến lược TOÀN CẦU     |  Chiến lược XUYÊN QUỐC GIA    |
   CAO      |  (chuẩn hoá toàn cầu)    |  (vừa chuẩn hoá vừa tuỳ biến) |
Giảm chi phí|  Chiến lược QUỐC TẾ      |  Chiến lược ĐA QUỐC GIA        |
   THẤP     |  (xuất khẩu sản phẩm gốc)|  (tuỳ biến theo từng nước)    |
</code></pre>
<ul>
<li><strong>Quốc tế (international)</strong> — xuất khẩu/nhượng quyền sản phẩm gần như không đổi; đầu tư thấp, rủi ro thấp.</li>
<li><strong>Đa quốc gia (multidomestic)</strong> — tuỳ biến sản phẩm/quy trình theo từng nước; đáp ứng cao, chi phí cao.</li>
<li><strong>Toàn cầu (global)</strong> — sản phẩm chuẩn hoá, sản xuất tại vài địa điểm hiệu quả, xuất đi toàn thế giới; hiệu quả cao, phù hợp địa phương thấp.</li>
<li><strong>Xuyên quốc gia (transnational)</strong> — vừa theo đuổi hiệu quả VỪA phù hợp địa phương, kết hợp nguồn lực quy mô toàn cầu với linh hoạt tại chỗ — khó thực thi nhất, nhưng cạnh tranh nhất khi làm được.</li>
</ul>
<div class="callout"><span class="badge">Vị trí theo chiến lược</span> Chiến lược toàn cầu theo chi phí đặt nhà máy ở nơi chi phí thấp nhất rồi xuất đi khắp thế giới; chiến lược đa quốc gia theo đáp ứng lại đặt một cơ sở ngay trong mỗi thị trường chính.</div>`,
  ]]);

const c2q = quiz('iom201-quiz-2', 'Quiz 2 — Operations strategy & competitiveness|||Quiz 2 — Chiến lược vận hành & cạnh tranh', [
  { id: 'q1', question: 'Order winner khác order qualifier như thế nào?', options: ['Không khác gì, hai thuật ngữ đồng nghĩa', 'Order qualifier là ngưỡng phải đạt để được xét; order winner là yếu tố thực sự thắng đơn hàng', 'Order winner chỉ áp dụng cho vận hành nội địa', 'Order qualifier luôn quan trọng hơn order winner'], correctIndex: 1, explanation: 'Order qualifier là điều kiện cần (đạt ngưỡng tối thiểu); order winner là yếu tố quyết định khách hàng chọn mình thay vì đối thủ.' },
  { id: 'q2', question: 'Chiến lược nào vừa theo đuổi hiệu quả chi phí toàn cầu VỪA đáp ứng thị trường địa phương?', options: ['Chiến lược quốc tế (international)', 'Chiến lược đa quốc gia (multidomestic)', 'Chiến lược toàn cầu (global)', 'Chiến lược xuyên quốc gia (transnational)'], correctIndex: 3, explanation: 'Xuyên quốc gia là chiến lược khó nhất vì đồng thời theo đuổi cả giảm chi phí toàn cầu và đáp ứng địa phương cao.' },
  { id: 'q3', question: 'Một doanh nghiệp chuẩn hoá sản phẩm, sản xuất tập trung ở vài nơi chi phí thấp rồi xuất đi khắp thế giới, không tuỳ biến theo từng nước — đó là chiến lược gì?', options: ['Đa quốc gia (multidomestic)', 'Toàn cầu (global)', 'Xuyên quốc gia (transnational)', 'Không thuộc chiến lược nào'], correctIndex: 1, explanation: 'Chiến lược toàn cầu: chuẩn hoá cao, sản xuất tập trung nơi hiệu quả nhất, đáp ứng địa phương thấp.' },
]);

const c3 = doc('iom201-3-1-product-process-layout', '3.1 — Product, process design & facility layout|||3.1 — Thiết kế sản phẩm, quy trình & bố trí mặt bằng',
  'Thiết kế sản phẩm & DFM; ma trận sản phẩm-quy trình (job shop→line→continuous); các loại bố trí (theo quy trình, theo sản phẩm, vị trí cố định, tế bào).',
  [[
    `<span class="eyebrow">IOM201 · Chapter 3 · Lesson 3.1</span>
<h2>Product, process design &amp; facility layout</h2>
<h3>Product &amp; process design</h3>
<p>Good product design considers <strong>Design for Manufacturability (DFM)</strong> — fewer parts, standardized components, tolerances the factory can actually hit — because a product that is hard to make is expensive and slow everywhere it is produced. Process choice then follows volume and variety, captured in the <strong>product-process matrix</strong>:</p>
<pre><code>Low volume, high variety  ->  JOB SHOP        (custom furniture, print shop)
                          ->  BATCH           (bakery, textbook printing)
                          ->  ASSEMBLY LINE   (cars, appliances)
High volume, low variety  ->  CONTINUOUS FLOW (oil refining, chemicals)
</code></pre>
<p>Moving down the matrix trades <strong>flexibility for efficiency</strong> — a continuous-flow plant is extremely cheap per unit but nearly impossible to reconfigure for a different product.</p>
<h3>Facility layout types</h3>
<ul>
<li><strong>Process (functional) layout</strong> — machines grouped by function (all lathes together); high flexibility, used for low-volume/high-variety jobs, but material travels a lot.</li>
<li><strong>Product (line) layout</strong> — equipment arranged in the sequence the product is made; high efficiency, low flexibility — used for high-volume standardized products.</li>
<li><strong>Fixed-position layout</strong> — the product stays put and resources (workers, tools) come to it — used for large/immovable items (ships, buildings, aircraft assembly).</li>
<li><strong>Cellular layout</strong> — machines grouped into "cells" that each produce a family of similar parts, combining some efficiency of line layout with some flexibility of process layout.</li>
</ul>
<div class="callout"><span class="badge">International note</span> A global firm often runs different layouts in different plants for the same product family — a high-wage country plant may use flexible cells for small custom runs, while a low-wage plant runs a dedicated product line for the high-volume standard version.</div>`,
    `<span class="eyebrow">IOM201 · Chương 3 · Bài 3.1</span>
<h2>Thiết kế sản phẩm, quy trình &amp; bố trí mặt bằng</h2>
<h3>Thiết kế sản phẩm &amp; quy trình</h3>
<p>Thiết kế sản phẩm tốt cân nhắc <strong>Thiết kế để dễ sản xuất (DFM)</strong> — ít linh kiện hơn, chuẩn hoá bộ phận, sai số nhà máy thực sự đạt được — vì một sản phẩm khó làm sẽ đắt và chậm ở bất cứ nơi nào sản xuất nó. Việc chọn quy trình theo sản lượng và độ đa dạng, thể hiện qua <strong>ma trận sản phẩm-quy trình</strong>:</p>
<pre><code>Sản lượng thấp, đa dạng cao -> JOB SHOP (xưởng đơn lẻ) (nội thất đặt riêng, xưởng in)
                            -> LÔ (BATCH) (tiệm bánh, in sách giáo khoa)
                            -> DÂY CHUYỀN LẮP RÁP (ô tô, thiết bị gia dụng)
Sản lượng cao, đa dạng thấp -> DÒNG CHẢY LIÊN TỤC (lọc dầu, hoá chất)
</code></pre>
<p>Đi xuống ma trận là đánh đổi <strong>linh hoạt lấy hiệu quả</strong> — nhà máy dòng chảy liên tục rất rẻ trên mỗi đơn vị nhưng gần như không thể tái cấu hình cho sản phẩm khác.</p>
<h3>Các loại bố trí mặt bằng</h3>
<ul>
<li><strong>Bố trí theo quy trình (chức năng)</strong> — máy nhóm theo chức năng (mọi máy tiện để cùng nhau); linh hoạt cao, dùng cho sản lượng thấp/đa dạng cao, nhưng vật liệu di chuyển nhiều.</li>
<li><strong>Bố trí theo sản phẩm (dây chuyền)</strong> — thiết bị xếp theo trình tự sản xuất; hiệu quả cao, linh hoạt thấp — dùng cho sản phẩm chuẩn hoá sản lượng cao.</li>
<li><strong>Bố trí vị trí cố định</strong> — sản phẩm ở nguyên một chỗ, nguồn lực (thợ, công cụ) di chuyển đến nó — dùng cho vật lớn/không di chuyển được (tàu, công trình, lắp ráp máy bay).</li>
<li><strong>Bố trí tế bào (cellular)</strong> — máy nhóm thành "tế bào" mỗi tế bào làm một họ chi tiết tương tự, kết hợp phần hiệu quả của dây chuyền và phần linh hoạt của bố trí quy trình.</li>
</ul>
<div class="callout"><span class="badge">Góc nhìn quốc tế</span> Một doanh nghiệp toàn cầu thường chạy các bố trí khác nhau ở các nhà máy khác nhau cho cùng một họ sản phẩm — nhà máy ở nước lương cao có thể dùng tế bào linh hoạt cho lô nhỏ tuỳ biến, còn nhà máy ở nước lương thấp chạy dây chuyền chuyên biệt cho bản chuẩn sản lượng lớn.</div>`,
  ]]);

const c3q = quiz('iom201-quiz-3', 'Quiz 3 — Product, process & layout|||Quiz 3 — Sản phẩm, quy trình & bố trí', [
  { id: 'q1', question: 'Ma trận sản phẩm-quy trình cho thấy điều gì khi sản lượng tăng và độ đa dạng giảm?', options: ['Doanh nghiệp nên chuyển từ dây chuyền về job shop', 'Doanh nghiệp thường chuyển sang quy trình hiệu quả hơn nhưng kém linh hoạt hơn (vd dòng chảy liên tục)', 'Không có mối liên hệ nào', 'Chi phí trên mỗi đơn vị luôn tăng'], correctIndex: 1, explanation: 'Sản lượng cao + đa dạng thấp phù hợp quy trình hiệu quả (dây chuyền, dòng chảy liên tục) nhưng đánh đổi mất linh hoạt.' },
  { id: 'q2', question: 'Bố trí mặt bằng nào phù hợp để lắp ráp một con tàu hoặc một toà nhà?', options: ['Bố trí theo quy trình', 'Bố trí theo sản phẩm (dây chuyền)', 'Bố trí vị trí cố định', 'Bố trí tế bào'], correctIndex: 2, explanation: 'Vật quá lớn/không di chuyển được thì sản phẩm ở nguyên một chỗ, nguồn lực di chuyển đến — đó là bố trí vị trí cố định.' },
  { id: 'q3', question: 'DFM (Design for Manufacturability) hướng tới mục tiêu gì?', options: ['Tăng số linh kiện để sản phẩm bền hơn', 'Thiết kế sản phẩm sao cho DỄ và RẺ sản xuất (ít linh kiện, chuẩn hoá, sai số nhà máy đạt được)', 'Chỉ áp dụng cho thiết kế bao bì', 'Không liên quan đến chi phí sản xuất'], correctIndex: 1, explanation: 'DFM tối ưu thiết kế để việc sản xuất thực tế đơn giản, rẻ và ít lỗi hơn.' },
]);

const c4 = doc('iom201-4-1-global-supply-chain', '4.1 — Global supply chain management|||4.1 — Quản trị chuỗi cung ứng toàn cầu',
  'SCM là gì; nguồn cung toàn cầu & outsourcing vs tích hợp dọc; Incoterms; hiệu ứng bullwhip; quản trị rủi ro gián đoạn chuỗi cung ứng.',
  [[
    `<span class="eyebrow">IOM201 · Chapter 4 · Lesson 4.1</span>
<h2>Global supply chain management</h2>
<h3>What a supply chain is</h3>
<p>A <strong>supply chain</strong> is the network of suppliers, manufacturers, distributors and retailers that turns raw materials into a product in the customer's hands. <strong>Supply chain management (SCM)</strong> coordinates that network — flows of materials, information and money — to deliver the right product, at the right cost, at the right time.</p>
<h3>Outsourcing vs. vertical integration</h3>
<ul>
<li><strong>Vertical integration</strong> — the firm owns more stages itself (own factories, own logistics); more control, more capital tied up.</li>
<li><strong>Outsourcing / global sourcing</strong> — buy from specialized suppliers, often overseas, to access lower cost or better capability; less control, more coordination and quality-monitoring effort, and exposure to currency/tariff/political risk.</li>
</ul>
<h3>Incoterms — who owns the risk in transit</h3>
<p>International shipments use standardized <strong>Incoterms</strong> (International Commercial Terms) to fix exactly where the seller's responsibility ends and the buyer's begins — e.g. <strong>FOB</strong> (Free On Board — seller's responsibility ends once goods are loaded on the ship) vs. <strong>DDP</strong> (Delivered Duty Paid — seller is responsible all the way to the buyer's door, duties included).</p>
<h3>The bullwhip effect</h3>
<p>Small demand fluctuations at the retail end get <strong>amplified</strong> as each upstream stage (distributor, manufacturer, raw-material supplier) over-reacts and over-orders to protect itself — causing wild swings in inventory and production far larger than the original change in real demand. Longer international lead times make the bullwhip effect worse.</p>
<pre><code>Retail demand: small +10% blip
  -> Distributor orders +25% (buffer + lag)
    -> Manufacturer orders +50% (buffer + lag)
      -> Raw-material supplier sees +90% "demand" that never really existed
</code></pre>
<div class="callout"><span class="badge">Mitigation</span> Share real demand data across the chain (information sharing), shorten lead times, and use smaller/more frequent orders instead of large infrequent batches.</div>`,
    `<span class="eyebrow">IOM201 · Chương 4 · Bài 4.1</span>
<h2>Quản trị chuỗi cung ứng toàn cầu</h2>
<h3>Chuỗi cung ứng là gì</h3>
<p><strong>Chuỗi cung ứng</strong> là mạng lưới nhà cung cấp, nhà sản xuất, nhà phân phối và nhà bán lẻ biến nguyên liệu thô thành sản phẩm trong tay khách hàng. <strong>Quản trị chuỗi cung ứng (SCM)</strong> điều phối mạng lưới đó — luồng vật liệu, thông tin và tiền — để giao đúng sản phẩm, đúng chi phí, đúng thời điểm.</p>
<h3>Outsourcing vs. tích hợp dọc</h3>
<ul>
<li><strong>Tích hợp dọc</strong> — doanh nghiệp tự sở hữu nhiều khâu hơn (tự có nhà máy, tự có logistics); kiểm soát nhiều hơn, vốn bị chôn nhiều hơn.</li>
<li><strong>Outsourcing / nguồn cung toàn cầu</strong> — mua từ nhà cung cấp chuyên biệt, thường ở nước ngoài, để tiếp cận chi phí thấp hơn hoặc năng lực tốt hơn; kiểm soát ít hơn, tốn công phối hợp và giám sát chất lượng hơn, và chịu rủi ro tỷ giá/thuế quan/chính trị.</li>
</ul>
<h3>Incoterms — ai chịu rủi ro trong lúc vận chuyển</h3>
<p>Các lô hàng quốc tế dùng <strong>Incoterms</strong> (điều khoản thương mại quốc tế chuẩn hoá) để xác định chính xác trách nhiệm người bán kết thúc ở đâu và người mua bắt đầu ở đâu — vd <strong>FOB</strong> (Free On Board — trách nhiệm người bán hết khi hàng đã lên tàu) vs. <strong>DDP</strong> (Delivered Duty Paid — người bán chịu trách nhiệm tới tận cửa người mua, đã gồm thuế).</p>
<h3>Hiệu ứng bullwhip</h3>
<p>Những dao động nhỏ về nhu cầu ở khâu bán lẻ bị <strong>khuếch đại</strong> khi mỗi khâu ngược dòng (nhà phân phối, nhà sản xuất, nhà cung cấp nguyên liệu) phản ứng thái quá và đặt hàng quá mức để tự bảo vệ — gây dao động dữ dội về tồn kho và sản xuất lớn hơn nhiều so với thay đổi nhu cầu thật. Thời gian giao hàng quốc tế dài hơn càng làm hiệu ứng bullwhip nặng thêm.</p>
<pre><code>Nhu cầu bán lẻ: tăng nhẹ +10%
  -> Nhà phân phối đặt hàng +25% (dự trữ đệm + độ trễ)
    -> Nhà sản xuất đặt hàng +50% (dự trữ đệm + độ trễ)
      -> Nhà cung cấp nguyên liệu thấy "nhu cầu" +90% chưa từng thực sự tồn tại
</code></pre>
<div class="callout"><span class="badge">Cách giảm nhẹ</span> Chia sẻ dữ liệu nhu cầu thật xuyên chuỗi (chia sẻ thông tin), rút ngắn thời gian giao hàng, và đặt hàng nhỏ/thường xuyên hơn thay vì lô lớn/thưa.</div>`,
  ]]);

const c4q = quiz('iom201-quiz-4', 'Quiz 4 — Global supply chain|||Quiz 4 — Chuỗi cung ứng toàn cầu', [
  { id: 'q1', question: 'Hiệu ứng bullwhip trong chuỗi cung ứng nghĩa là gì?', options: ['Nhu cầu càng lên khâu ngược dòng càng ổn định hơn', 'Dao động nhu cầu nhỏ ở bán lẻ bị khuếch đại thành dao động lớn ở các khâu ngược dòng', 'Chỉ xảy ra khi chuỗi cung ứng hoàn toàn nội địa', 'Là tên gọi khác của tích hợp dọc'], correctIndex: 1, explanation: 'Mỗi khâu ngược dòng phản ứng thái quá với thay đổi nhu cầu, khiến dao động ngày càng lớn khi đi xa khỏi khách hàng cuối.' },
  { id: 'q2', question: 'Incoterm FOB (Free On Board) xác định điều gì?', options: ['Người mua chịu trách nhiệm ngay từ nhà máy người bán', 'Trách nhiệm người bán kết thúc khi hàng đã được xếp lên tàu', 'Người bán chịu trách nhiệm tới tận cửa người mua, gồm cả thuế', 'Không liên quan đến vận chuyển quốc tế'], correctIndex: 1, explanation: 'FOB: trách nhiệm/rủi ro chuyển từ người bán sang người mua ngay khi hàng được xếp lên tàu tại cảng đi.' },
  { id: 'q3', question: 'Outsourcing (nguồn cung toàn cầu) so với tích hợp dọc đánh đổi điều gì?', options: ['Không có đánh đổi nào', 'Giảm chi phí/kiểm soát vốn tự có, đổi lại giảm quyền kiểm soát và tăng rủi ro phối hợp/chính trị', 'Luôn rẻ hơn và an toàn hơn tích hợp dọc trong mọi trường hợp', 'Chỉ áp dụng được cho dịch vụ, không áp dụng cho sản xuất'], correctIndex: 1, explanation: 'Outsourcing giúp tiếp cận chi phí/năng lực tốt hơn nhưng làm giảm kiểm soát trực tiếp và tăng rủi ro phối hợp, tỷ giá, thuế quan, chính trị.' },
]);

const c5 = doc('iom201-5-1-quality-management', '5.1 — Quality management: TQM, Six Sigma & ISO|||5.1 — Quản trị chất lượng: TQM, Six Sigma & ISO',
  'TQM (cải tiến liên tục, hướng khách hàng); Six Sigma & chu trình DMAIC; hệ thống chuẩn ISO 9000; chi phí chất lượng; công cụ (Pareto, xương cá).',
  [[
    `<span class="eyebrow">IOM201 · Chapter 5 · Lesson 5.1</span>
<h2>Quality management: TQM, Six Sigma &amp; ISO</h2>
<h3>Total Quality Management (TQM)</h3>
<p><strong>TQM</strong> is a philosophy that quality is everyone's responsibility, driven by <strong>continuous improvement (kaizen)</strong>, employee empowerment, and a relentless focus on <strong>customer satisfaction</strong>. It treats quality as built into every process, not inspected in at the end.</p>
<h3>Six Sigma &amp; DMAIC</h3>
<p><strong>Six Sigma</strong> is a data-driven methodology aiming for near-zero defects (3.4 defects per million opportunities). Projects follow the <strong>DMAIC</strong> cycle:</p>
<pre><code>D - Define    the problem &amp; customer requirements
M - Measure   current process performance (data)
A - Analyze   root causes of defects
I - Improve   the process (redesign, eliminate root causes)
C - Control   sustain the gain (monitoring, control charts)
</code></pre>
<h3>ISO 9000 family</h3>
<p><strong>ISO 9001</strong> is the internationally recognized standard for a <strong>quality management system</strong> — it doesn't certify the product itself, but that the organization's processes are documented, consistent and continuously improved. For international operations, an ISO 9001 certificate is often a precondition to even bid for a global contract — a strong signal of reliability that crosses borders and languages.</p>
<h3>Cost of quality &amp; basic tools</h3>
<ul>
<li><strong>Prevention costs</strong> (cheapest) &lt; <strong>appraisal costs</strong> (inspection) &lt; <strong>internal failure costs</strong> (scrap, rework) &lt; <strong>external failure costs</strong> (warranty, recalls, reputation — most expensive, especially across a global customer base).</li>
<li><strong>Pareto chart</strong> — the 80/20 rule: a small number of causes usually explain most defects.</li>
<li><strong>Fishbone (Ishikawa) diagram</strong> — organizes potential root causes by category (Machine, Method, Material, Man, Measurement, Environment).</li>
</ul>
<div class="callout"><span class="badge">Why it matters internationally</span> A quality failure discovered after a product has already crossed several borders is far costlier to fix (recalls, re-shipping, reputational damage in multiple markets at once) — which is exactly why prevention is emphasized over inspection.</div>`,
    `<span class="eyebrow">IOM201 · Chương 5 · Bài 5.1</span>
<h2>Quản trị chất lượng: TQM, Six Sigma &amp; ISO</h2>
<h3>Quản trị chất lượng toàn diện (TQM)</h3>
<p><strong>TQM</strong> là triết lý coi chất lượng là trách nhiệm của mọi người, dựa trên <strong>cải tiến liên tục (kaizen)</strong>, trao quyền cho nhân viên, và tập trung không ngừng vào <strong>sự hài lòng của khách hàng</strong>. TQM coi chất lượng được xây vào từng quy trình, không phải kiểm tra ở cuối cùng.</p>
<h3>Six Sigma &amp; chu trình DMAIC</h3>
<p><strong>Six Sigma</strong> là phương pháp dựa trên dữ liệu, nhắm tới gần như không lỗi (3,4 lỗi trên một triệu cơ hội). Dự án đi theo chu trình <strong>DMAIC</strong>:</p>
<pre><code>D - Define (Xác định)  vấn đề & yêu cầu khách hàng
M - Measure (Đo)        hiệu năng quy trình hiện tại (dữ liệu)
A - Analyze (Phân tích) nguyên nhân gốc của lỗi
I - Improve (Cải tiến)  quy trình (thiết kế lại, loại bỏ nguyên nhân gốc)
C - Control (Kiểm soát) duy trì thành quả (giám sát, biểu đồ kiểm soát)
</code></pre>
<h3>Bộ chuẩn ISO 9000</h3>
<p><strong>ISO 9001</strong> là chuẩn quốc tế được công nhận cho <strong>hệ thống quản trị chất lượng</strong> — nó không chứng nhận sản phẩm, mà chứng nhận quy trình của tổ chức được ghi chép, nhất quán và liên tục cải tiến. Với vận hành quốc tế, chứng chỉ ISO 9001 thường là điều kiện tiên quyết để tham gia đấu thầu hợp đồng toàn cầu — một tín hiệu mạnh về độ tin cậy vượt qua biên giới và ngôn ngữ.</p>
<h3>Chi phí chất lượng &amp; công cụ cơ bản</h3>
<ul>
<li><strong>Chi phí phòng ngừa</strong> (rẻ nhất) &lt; <strong>chi phí thẩm định</strong> (kiểm tra) &lt; <strong>chi phí lỗi nội bộ</strong> (phế phẩm, làm lại) &lt; <strong>chi phí lỗi ngoài</strong> (bảo hành, thu hồi, tổn hại danh tiếng — đắt nhất, đặc biệt với khách hàng toàn cầu).</li>
<li><strong>Biểu đồ Pareto</strong> — quy tắc 80/20: một số ít nguyên nhân thường giải thích hầu hết lỗi.</li>
<li><strong>Sơ đồ xương cá (Ishikawa)</strong> — tổ chức nguyên nhân gốc tiềm ẩn theo nhóm (Máy, Phương pháp, Vật liệu, Con người, Đo lường, Môi trường).</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng ở tầm quốc tế</span> Một lỗi chất lượng phát hiện sau khi sản phẩm đã qua nhiều biên giới thì tốn kém hơn nhiều để sửa (thu hồi, vận chuyển lại, tổn hại danh tiếng ở nhiều thị trường cùng lúc) — đó chính là lý do phòng ngừa được ưu tiên hơn kiểm tra.</div>`,
  ]]);

const c5q = quiz('iom201-quiz-5', 'Quiz 5 — Quality management|||Quiz 5 — Quản trị chất lượng', [
  { id: 'q1', question: 'Chu trình DMAIC của Six Sigma gồm 5 bước theo thứ tự nào?', options: ['Design, Manage, Analyze, Improve, Control', 'Define, Measure, Analyze, Improve, Control', 'Define, Monitor, Act, Inspect, Close', 'Design, Measure, Assign, Implement, Certify'], correctIndex: 1, explanation: 'DMAIC = Define (xác định) → Measure (đo) → Analyze (phân tích) → Improve (cải tiến) → Control (kiểm soát).' },
  { id: 'q2', question: 'Chứng chỉ ISO 9001 chứng nhận điều gì?', options: ['Chứng nhận trực tiếp chất lượng của từng sản phẩm cụ thể', 'Chứng nhận hệ thống quản trị chất lượng của tổ chức được ghi chép, nhất quán và cải tiến liên tục', 'Chỉ áp dụng cho ngành thực phẩm', 'Thay thế hoàn toàn cho kiểm tra chất lượng sản phẩm'], correctIndex: 1, explanation: 'ISO 9001 chứng nhận quy trình/hệ thống quản trị chất lượng của tổ chức, không chứng nhận trực tiếp từng sản phẩm.' },
  { id: 'q3', question: 'Trong 4 nhóm chi phí chất lượng, nhóm nào thường ĐẮT NHẤT, đặc biệt với khách hàng toàn cầu?', options: ['Chi phí phòng ngừa', 'Chi phí thẩm định (kiểm tra)', 'Chi phí lỗi nội bộ', 'Chi phí lỗi ngoài (bảo hành, thu hồi, tổn hại danh tiếng)'], correctIndex: 3, explanation: 'Chi phí lỗi ngoài xảy ra sau khi sản phẩm đã đến tay khách hàng — thu hồi và tổn hại danh tiếng trên nhiều thị trường khiến nó đắt nhất.' },
]);

const c6 = doc('iom201-6-1-forecasting-capacity', '6.1 — Forecasting & capacity/resource planning|||6.1 — Dự báo & hoạch định năng lực/nguồn lực',
  'Phương pháp dự báo (định tính, chuỗi thời gian: bình quân trượt/san mũ, tương quan/hồi quy); đo sai số dự báo; hoạch định năng lực & tổng hợp (aggregate planning).',
  [[
    `<span class="eyebrow">IOM201 · Chapter 6 · Lesson 6.1</span>
<h2>Forecasting &amp; capacity/resource planning</h2>
<h3>Forecasting methods</h3>
<ul>
<li><strong>Qualitative</strong> — expert judgment, sales-force estimates, market surveys (Delphi method); used when little historical data exists (e.g. launching in a new country).</li>
<li><strong>Time series</strong> — project the future from historical patterns:
<ul>
<li><strong>Moving average</strong> — average of the last <em>n</em> periods; smooths noise but lags behind trend changes.</li>
<li><strong>Exponential smoothing</strong> — weights recent data more heavily (<code>Ft = α·At-1 + (1-α)·Ft-1</code>), reacts faster to recent changes than a simple moving average.</li>
</ul>
</li>
<li><strong>Causal / regression</strong> — model demand as a function of other variables (price, GDP, marketing spend) — useful when demand is driven by measurable external factors, common across international markets with different economic conditions.</li>
</ul>
<pre><code>Exponential smoothing example (α = 0.3):
 Actual last period (A) = 120 units, Forecast last period (F) = 110
 New forecast = 0.3 × 120 + 0.7 × 110 = 36 + 77 = 113 units
</code></pre>
<h3>Measuring forecast error</h3>
<p><strong>MAD</strong> (Mean Absolute Deviation) and <strong>MAPE</strong> (Mean Absolute Percentage Error) quantify how far off forecasts have been — used to choose between methods and to set safety stock.</p>
<h3>Capacity &amp; aggregate planning</h3>
<p><strong>Capacity planning</strong> decides how much output a facility can produce; internationally this includes choosing between building capacity in one large low-cost plant vs. several smaller plants near different markets. <strong>Aggregate planning</strong> then balances forecasted demand against available capacity over a medium-term horizon (usually 3-18 months) using three basic levers: <strong>vary the workforce</strong> (hire/lay off), <strong>vary output rate</strong> (overtime, subcontracting), or <strong>let inventory absorb the difference</strong> (build ahead of a demand peak).</p>
<div class="callout"><span class="badge">International wrinkle</span> Different countries in the network may face demand peaks at different times (seasonality, holidays) — a global aggregate plan can shift production between plants to smooth capacity use across the whole network, something a single-country plan cannot do.</div>`,
    `<span class="eyebrow">IOM201 · Chương 6 · Bài 6.1</span>
<h2>Dự báo &amp; hoạch định năng lực/nguồn lực</h2>
<h3>Phương pháp dự báo</h3>
<ul>
<li><strong>Định tính</strong> — ý kiến chuyên gia, ước lượng của bộ phận bán hàng, khảo sát thị trường (phương pháp Delphi); dùng khi ít dữ liệu lịch sử (vd bắt đầu vào một nước mới).</li>
<li><strong>Chuỗi thời gian</strong> — dự báo tương lai từ mô hình lịch sử:
<ul>
<li><strong>Bình quân trượt (moving average)</strong> — trung bình <em>n</em> kỳ gần nhất; làm mượt nhiễu nhưng phản ứng trễ với thay đổi xu hướng.</li>
<li><strong>San mũ (exponential smoothing)</strong> — trọng số dữ liệu gần đây cao hơn (<code>Ft = α·At-1 + (1-α)·Ft-1</code>), phản ứng nhanh hơn bình quân trượt đơn giản với thay đổi gần đây.</li>
</ul>
</li>
<li><strong>Nhân quả / hồi quy</strong> — mô hình hoá nhu cầu theo các biến khác (giá, GDP, chi marketing) — hữu ích khi nhu cầu bị chi phối bởi yếu tố ngoại sinh có thể đo được, phổ biến giữa các thị trường quốc tế có điều kiện kinh tế khác nhau.</li>
</ul>
<pre><code>Ví dụ san mũ (α = 0,3):
 Thực tế kỳ trước (A) = 120 đơn vị, Dự báo kỳ trước (F) = 110
 Dự báo mới = 0,3 × 120 + 0,7 × 110 = 36 + 77 = 113 đơn vị
</code></pre>
<h3>Đo sai số dự báo</h3>
<p><strong>MAD</strong> (độ lệch tuyệt đối trung bình) và <strong>MAPE</strong> (sai số phần trăm tuyệt đối trung bình) đo mức dự báo lệch bao xa — dùng để chọn giữa các phương pháp và đặt mức tồn kho an toàn.</p>
<h3>Hoạch định năng lực &amp; hoạch định tổng hợp</h3>
<p><strong>Hoạch định năng lực</strong> quyết định một cơ sở sản xuất được bao nhiêu; ở tầm quốc tế, việc này gồm chọn giữa xây một nhà máy lớn chi phí thấp duy nhất so với vài nhà máy nhỏ hơn gần các thị trường khác nhau. <strong>Hoạch định tổng hợp (aggregate planning)</strong> sau đó cân đối nhu cầu dự báo với năng lực có sẵn trong trung hạn (thường 3-18 tháng) bằng ba đòn bẩy cơ bản: <strong>thay đổi lực lượng lao động</strong> (tuyển/cắt giảm), <strong>thay đổi tốc độ sản xuất</strong> (làm thêm giờ, thuê ngoài), hoặc <strong>để tồn kho hấp thụ khác biệt</strong> (sản xuất trước đỉnh nhu cầu).</p>
<div class="callout"><span class="badge">Điểm khác biệt quốc tế</span> Các nước khác nhau trong mạng lưới có thể gặp đỉnh nhu cầu vào thời điểm khác nhau (tính mùa vụ, ngày lễ) — một kế hoạch tổng hợp toàn cầu có thể chuyển sản xuất giữa các nhà máy để làm mượt việc dùng năng lực trên cả mạng lưới, điều một kế hoạch một-quốc-gia không làm được.</div>`,
  ]]);

const c6q = quiz('iom201-quiz-6', 'Quiz 6 — Forecasting & capacity planning|||Quiz 6 — Dự báo & hoạch định năng lực', [
  { id: 'q1', question: 'Phương pháp san mũ (exponential smoothing) khác bình quân trượt (moving average) như thế nào?', options: ['San mũ luôn kém chính xác hơn', 'San mũ đặt trọng số cao hơn cho dữ liệu gần đây nên phản ứng nhanh hơn với thay đổi', 'Bình quân trượt không cần dữ liệu lịch sử', 'Hai phương pháp hoàn toàn giống nhau'], correctIndex: 1, explanation: 'San mũ dùng hệ số α để nhấn dữ liệu gần đây hơn, nên bắt kịp thay đổi xu hướng nhanh hơn bình quân trượt đơn giản.' },
  { id: 'q2', question: 'Ba đòn bẩy cơ bản của hoạch định tổng hợp (aggregate planning) là gì?', options: ['Chỉ có tăng giá bán', 'Thay đổi lực lượng lao động, thay đổi tốc độ sản xuất, dùng tồn kho hấp thụ khác biệt', 'Chỉ có mở nhà máy mới', 'Chỉ có giảm chất lượng sản phẩm'], correctIndex: 1, explanation: 'Ba đòn bẩy chính: tuyển/cắt lao động, làm thêm giờ/thuê ngoài (đổi tốc độ sản xuất), và để tồn kho hấp thụ chênh lệch cung-cầu.' },
  { id: 'q3', question: 'Vì sao dự báo định tính (qualitative) thường được dùng khi mở rộng vào một thị trường quốc tế mới?', options: ['Vì nó chính xác hơn phương pháp chuỗi thời gian trong mọi trường hợp', 'Vì ít hoặc chưa có dữ liệu lịch sử tại thị trường đó để dùng chuỗi thời gian', 'Vì không cần dữ liệu nào cả', 'Vì luật pháp bắt buộc'], correctIndex: 1, explanation: 'Thị trường mới thường thiếu dữ liệu lịch sử, nên phải dựa vào ý kiến chuyên gia/khảo sát thay vì mô hình chuỗi thời gian.' },
]);

const c7 = doc('iom201-7-1-inventory-lean-jit', '7.1 — Inventory management & international lean/JIT|||7.1 — Quản trị tồn kho & lean/JIT quốc tế',
  'Vai trò tồn kho, EOQ, tồn kho an toàn, phân loại ABC; nguyên lý JIT & Toyota Production System; kanban; thách thức lean khi chuỗi cung ứng xuyên biên giới.',
  [[
    `<span class="eyebrow">IOM201 · Chapter 7 · Lesson 7.1</span>
<h2>Inventory management &amp; international lean/JIT</h2>
<h3>Why hold inventory, and the EOQ trade-off</h3>
<p>Inventory buffers against demand uncertainty, supply delays, and lets a firm order in efficient batch sizes — but it ties up capital and can become obsolete. The <strong>Economic Order Quantity (EOQ)</strong> model finds the order size that minimizes total ordering + holding cost:</p>
<pre><code>EOQ = sqrt( (2 × D × S) / H )
  D = annual demand, S = cost per order, H = annual holding cost per unit

Example: D = 10,000 units/yr, S = $50/order, H = $2/unit/yr
  EOQ = sqrt((2 × 10,000 × 50) / 2) = sqrt(500,000) ≈ 707 units per order
</code></pre>
<p><strong>Safety stock</strong> is extra inventory held to cover demand/lead-time variability — and international lead times are longer and less predictable (customs, ocean freight delays), so safety stock is usually higher for globally sourced items. <strong>ABC analysis</strong> classifies inventory by value: A items (~20% of items, ~80% of value) get tight control; C items get loose, simple control.</p>
<h3>JIT &amp; the Toyota Production System</h3>
<p><strong>Just-In-Time (JIT)</strong> aims to receive/produce exactly what's needed, exactly when needed — minimizing inventory as a buffer that hides problems. The <strong>Toyota Production System</strong> pairs JIT with:</p>
<ul>
<li><strong>Kanban</strong> — visual signal cards that pull production only when the next stage actually consumes a part (a "pull" system, vs. push production based on forecasts).</li>
<li><strong>Kaizen</strong> — continuous small improvements by frontline workers.</li>
<li><strong>Jidoka</strong> — stop the line the instant a defect is found, rather than pass it downstream.</li>
</ul>
<div class="callout"><span class="badge">The international tension</span> JIT was designed for suppliers minutes away in Japan. Stretched across borders — with ocean freight, customs delays and currency risk — pure JIT becomes fragile (a port strike or a pandemic can halt a whole global line). International firms therefore often blend JIT with strategic buffer stock at key nodes, or dual-source critical parts across two countries.</div>`,
    `<span class="eyebrow">IOM201 · Chương 7 · Bài 7.1</span>
<h2>Quản trị tồn kho &amp; lean/JIT quốc tế</h2>
<h3>Vì sao giữ tồn kho, và đánh đổi EOQ</h3>
<p>Tồn kho là bộ đệm chống lại bất định về nhu cầu, chậm trễ cung ứng, và giúp doanh nghiệp đặt hàng theo lô hiệu quả — nhưng nó chôn vốn và có thể lỗi thời. Mô hình <strong>lượng đặt hàng kinh tế (EOQ)</strong> tìm cỡ lô đặt hàng tối thiểu hoá tổng chi phí đặt hàng + chi phí lưu kho:</p>
<pre><code>EOQ = sqrt( (2 × D × S) / H )
  D = nhu cầu năm, S = chi phí mỗi lần đặt, H = chi phí lưu kho/đơn vị/năm

Ví dụ: D = 10.000 đơn vị/năm, S = 50 USD/lần đặt, H = 2 USD/đơn vị/năm
  EOQ = sqrt((2 × 10.000 × 50) / 2) = sqrt(500.000) ≈ 707 đơn vị/lần đặt
</code></pre>
<p><strong>Tồn kho an toàn</strong> là lượng dư giữ để bù bất định nhu cầu/thời gian giao hàng — và thời gian giao hàng quốc tế dài hơn và khó dự đoán hơn (thủ tục hải quan, chậm vận tải biển), nên tồn kho an toàn thường cao hơn với hàng nguồn cung toàn cầu. <strong>Phân loại ABC</strong> chia tồn kho theo giá trị: nhóm A (~20% mặt hàng, ~80% giá trị) kiểm soát chặt; nhóm C kiểm soát đơn giản, lỏng hơn.</p>
<h3>JIT &amp; Hệ thống sản xuất Toyota</h3>
<p><strong>Just-In-Time (JIT)</strong> nhắm nhận/sản xuất đúng thứ cần, đúng lúc cần — giảm tối thiểu tồn kho vì tồn kho là bộ đệm che giấu vấn đề. <strong>Hệ thống sản xuất Toyota</strong> kết hợp JIT với:</p>
<ul>
<li><strong>Kanban</strong> — thẻ báo hiệu trực quan chỉ "kéo" sản xuất khi khâu sau thực sự tiêu thụ một chi tiết (hệ thống "kéo", đối lập hệ thống "đẩy" dựa trên dự báo).</li>
<li><strong>Kaizen</strong> — cải tiến nhỏ liên tục do người lao động trực tiếp thực hiện.</li>
<li><strong>Jidoka</strong> — dừng dây chuyền ngay khi phát hiện lỗi, thay vì để lỗi trôi xuống khâu sau.</li>
</ul>
<div class="callout"><span class="badge">Căng thẳng ở tầm quốc tế</span> JIT được thiết kế cho nhà cung cấp cách vài phút ở Nhật. Kéo giãn qua biên giới — với vận tải biển, chậm hải quan và rủi ro tỷ giá — JIT thuần túy trở nên mong manh (một cuộc đình công cảng hay đại dịch có thể dừng cả một dây chuyền toàn cầu). Vì vậy doanh nghiệp quốc tế thường kết hợp JIT với tồn kho đệm chiến lược tại các điểm then chốt, hoặc nguồn cung song song (dual-sourcing) linh kiện quan trọng từ hai nước.</div>`,
  ]]);

const c7q = quiz('iom201-quiz-7', 'Quiz 7 — Inventory & lean/JIT|||Quiz 7 — Tồn kho & lean/JIT', [
  { id: 'q1', question: 'Mô hình EOQ (lượng đặt hàng kinh tế) nhằm mục đích gì?', options: ['Tối đa hoá lượng tồn kho giữ trong kho', 'Tìm cỡ lô đặt hàng tối thiểu hoá tổng chi phí đặt hàng cộng chi phí lưu kho', 'Chỉ áp dụng cho hàng nhập khẩu', 'Loại bỏ hoàn toàn nhu cầu tồn kho an toàn'], correctIndex: 1, explanation: 'EOQ cân bằng chi phí đặt hàng (đặt ít lần, lô lớn) và chi phí lưu kho (đặt nhiều lần, lô nhỏ) để tối thiểu tổng chi phí.' },
  { id: 'q2', question: 'Trong hệ thống sản xuất Toyota, kanban là gì?', options: ['Một loại tồn kho an toàn cố định', 'Thẻ báo hiệu trực quan kéo sản xuất chỉ khi khâu sau thực sự tiêu thụ', 'Một phương pháp dự báo nhu cầu', 'Một chứng chỉ chất lượng quốc tế'], correctIndex: 1, explanation: 'Kanban là cơ chế "kéo" — tín hiệu trực quan cho phép sản xuất chỉ khi có tiêu thụ thật, tránh sản xuất dư theo dự báo.' },
  { id: 'q3', question: 'Vì sao JIT thuần túy trở nên mong manh khi chuỗi cung ứng kéo dài qua nhiều quốc gia?', options: ['Vì JIT chỉ áp dụng được cho dịch vụ, không áp dụng cho sản xuất', 'Vì thời gian giao hàng dài hơn, ít dự đoán được (hải quan, vận tải biển) khiến một gián đoạn nhỏ có thể dừng cả dây chuyền', 'Vì JIT làm tăng tồn kho quá mức', 'Vì JIT không tương thích với kanban'], correctIndex: 1, explanation: 'JIT được thiết kế cho khoảng cách gần; kéo giãn qua biên giới làm tăng độ bất định thời gian giao hàng, khiến hệ thống dễ vỡ trước gián đoạn (đình công cảng, đại dịch...).' },
]);

const c8 = doc('iom201-8-1-sustainable-ops-industry4', '8.1 — Sustainable operations, Industry 4.0 & practice|||8.1 — Vận hành bền vững, công nghệ (Industry 4.0) & thực tiễn',
  'Bền vững (triple bottom line), chuỗi cung ứng xanh; Industry 4.0 (IoT, tự động hoá, digital twin, AI trong vận hành); tổng hợp thực hành phân tích case toàn cầu.',
  [[
    `<span class="eyebrow">IOM201 · Chapter 8 · Lesson 8.1</span>
<h2>Sustainable operations, Industry 4.0 &amp; practice</h2>
<h3>Sustainability: the triple bottom line</h3>
<p>Modern international operations are judged on three fronts at once — the <strong>triple bottom line</strong>: <strong>People</strong> (labor conditions across every plant/supplier, everywhere in the world), <strong>Planet</strong> (carbon footprint, waste, resource use across the whole supply chain), and <strong>Profit</strong> (the business still has to be viable). A <strong>green supply chain</strong> extends this thinking to suppliers: sourcing responsibly, reducing packaging and transport emissions, and designing products for reuse/recycling.</p>
<h3>Industry 4.0 in global operations</h3>
<ul>
<li><strong>IoT (Internet of Things)</strong> sensors on machines and shipping containers give real-time visibility into a global supply chain — knowing exactly where a container is and the condition of its contents, anywhere in the world.</li>
<li><strong>Automation &amp; robotics</strong> reduce dependence on low-cost labor as a location driver — sometimes making <strong>reshoring</strong> (bringing production back closer to the customer) economically competitive again.</li>
<li><strong>Digital twins</strong> — virtual models of a factory or supply chain used to simulate disruptions (a port closure, a demand spike) before they happen in reality.</li>
<li><strong>AI-driven forecasting &amp; planning</strong> — machine-learning models that combine time-series, causal and external signals (weather, social trends, currency) far beyond what manual forecasting can do.</li>
</ul>
<h3>Putting it all together</h3>
<p>Across the 8 chapters, an international operations manager repeatedly answers the same core question in a global context: <strong>where to locate, how to design, how to source, how to control quality, how much capacity/inventory to hold, and how to keep the whole system efficient AND responsive AND sustainable</strong> — simultaneously, across multiple countries, currencies and cultures.</p>
<div class="callout"><span class="badge">Exam/case tip</span> When analyzing a real multinational's operations, walk the 10 decisions (Chapter 1) through the international lens of Chapters 2-8: strategy fit → design/layout → supply chain → quality → forecasting/capacity → inventory/lean → sustainability/technology. That structure covers almost any case question this course can ask.</div>`,
    `<span class="eyebrow">IOM201 · Chương 8 · Bài 8.1</span>
<h2>Vận hành bền vững, công nghệ (Industry 4.0) &amp; thực tiễn</h2>
<h3>Bền vững: bộ ba đáy (triple bottom line)</h3>
<p>Vận hành quốc tế hiện đại bị đánh giá trên ba mặt cùng lúc — <strong>bộ ba đáy</strong>: <strong>Con người</strong> (điều kiện lao động ở mọi nhà máy/nhà cung cấp, ở mọi nơi trên thế giới), <strong>Hành tinh</strong> (dấu chân carbon, chất thải, dùng tài nguyên trên toàn chuỗi cung ứng), và <strong>Lợi nhuận</strong> (doanh nghiệp vẫn phải khả thi về kinh doanh). <strong>Chuỗi cung ứng xanh</strong> mở rộng tư duy này tới nhà cung cấp: nguồn cung có trách nhiệm, giảm bao bì và khí thải vận chuyển, và thiết kế sản phẩm để tái sử dụng/tái chế.</p>
<h3>Industry 4.0 trong vận hành toàn cầu</h3>
<ul>
<li><strong>Cảm biến IoT (Internet of Things)</strong> trên máy móc và container vận chuyển cho khả năng theo dõi thời gian thực trên chuỗi cung ứng toàn cầu — biết chính xác container ở đâu và tình trạng hàng hoá bên trong, ở bất kỳ đâu trên thế giới.</li>
<li><strong>Tự động hoá &amp; robot</strong> giảm phụ thuộc vào lao động giá rẻ như một động lực chọn vị trí — đôi khi làm cho <strong>reshoring</strong> (đưa sản xuất về gần khách hàng hơn) lại có tính cạnh tranh kinh tế.</li>
<li><strong>Digital twin (bản sao số)</strong> — mô hình ảo của nhà máy hoặc chuỗi cung ứng, dùng để mô phỏng gián đoạn (đóng cảng, đỉnh nhu cầu) trước khi nó xảy ra thật.</li>
<li><strong>Dự báo &amp; hoạch định bằng AI</strong> — mô hình học máy kết hợp chuỗi thời gian, nhân quả và tín hiệu ngoại sinh (thời tiết, xu hướng xã hội, tỷ giá) vượt xa những gì dự báo thủ công làm được.</li>
</ul>
<h3>Tổng hợp lại</h3>
<p>Qua 8 chương, một nhà quản trị vận hành quốc tế liên tục trả lời cùng một câu hỏi gốc trong bối cảnh toàn cầu: <strong>đặt ở đâu, thiết kế thế nào, nguồn hàng ra sao, kiểm soát chất lượng thế nào, giữ bao nhiêu năng lực/tồn kho, và làm sao giữ cả hệ thống hiệu quả VÀ đáp ứng VÀ bền vững</strong> — đồng thời, trên nhiều quốc gia, tiền tệ và văn hoá.</p>
<div class="callout"><span class="badge">Gợi ý thi/case</span> Khi phân tích vận hành của một công ty đa quốc gia thật, đi qua 10 quyết định (Chương 1) qua lăng kính quốc tế của Chương 2-8: phù hợp chiến lược → thiết kế/bố trí → chuỗi cung ứng → chất lượng → dự báo/năng lực → tồn kho/lean → bền vững/công nghệ. Cấu trúc đó bao trùm gần như mọi câu hỏi case môn này có thể hỏi.</div>`,
  ]]);

const c8q = quiz('iom201-quiz-8', 'Quiz 8 — Sustainability & Industry 4.0|||Quiz 8 — Bền vững & Industry 4.0', [
  { id: 'q1', question: 'Bộ ba đáy (triple bottom line) trong vận hành bền vững gồm ba yếu tố nào?', options: ['Chi phí, chất lượng, tốc độ', 'Con người (People), Hành tinh (Planet), Lợi nhuận (Profit)', 'Vốn, lao động, công nghệ', 'Sản phẩm, quy trình, bố trí'], correctIndex: 1, explanation: 'Triple bottom line đánh giá doanh nghiệp trên ba mặt: xã hội (People), môi trường (Planet), kinh tế (Profit).' },
  { id: 'q2', question: 'Vì sao tự động hoá/robot có thể khiến "reshoring" (đưa sản xuất về gần khách hàng) trở nên khả thi hơn?', options: ['Vì robot luôn đắt hơn lao động thủ công ở mọi nơi', 'Vì tự động hoá giảm phụ thuộc vào lao động giá rẻ như một động lực chọn vị trí sản xuất', 'Vì reshoring bắt buộc theo luật quốc tế', 'Vì Industry 4.0 chỉ áp dụng được ở nước đang phát triển'], correctIndex: 1, explanation: 'Khi robot/tự động hoá làm giảm vai trò của chi phí lao động, lợi thế "lao động rẻ ở nước ngoài" giảm đi, mở đường cho sản xuất gần khách hàng hơn.' },
  { id: 'q3', question: 'Digital twin (bản sao số) trong vận hành toàn cầu dùng để làm gì?', options: ['Thay thế hoàn toàn nhân sự vận hành', 'Mô phỏng gián đoạn (đóng cảng, đỉnh nhu cầu) trên mô hình ảo trước khi nó xảy ra thật', 'Chỉ dùng để thiết kế logo công ty', 'Là một chứng chỉ chất lượng như ISO 9001'], correctIndex: 1, explanation: 'Digital twin là mô hình ảo của nhà máy/chuỗi cung ứng dùng để thử nghiệm kịch bản gián đoạn mà không cần chịu rủi ro thật.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'IOM201',
    slug: 'iom201-international-operation-management',
    title: 'International Operation Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IOM201.webp',
    shortDescription: 'International operations management — strategy, product/process design & layout, global supply chains, quality (TQM/Six Sigma/ISO), forecasting & capacity, inventory & lean/JIT, sustainability & Industry 4.0. Bilingual, with examples & quizzes.|||Quản trị vận hành quốc tế — chiến lược, thiết kế sản phẩm/quy trình & bố trí, chuỗi cung ứng toàn cầu, chất lượng (TQM/Six Sigma/ISO), dự báo & năng lực, tồn kho & lean/JIT, bền vững & Industry 4.0. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>IOM201 — International Operations Management</strong> (kỳ 3, khối Quản trị Kinh doanh) giúp hiểu cách doanh nghiệp <strong>thiết kế, điều hành và cải tiến vận hành xuyên biên giới</strong>. Từ <strong>tổng quan &amp; 10 quyết định vận hành</strong> → <strong>chiến lược vận hành &amp; năng lực cạnh tranh toàn cầu</strong> → <strong>thiết kế sản phẩm, quy trình &amp; bố trí</strong> → <strong>chuỗi cung ứng toàn cầu</strong> → <strong>chất lượng (TQM, Six Sigma, ISO)</strong> → <strong>dự báo &amp; hoạch định năng lực</strong> → <strong>tồn kho &amp; lean/JIT quốc tế</strong> → <strong>bền vững &amp; Industry 4.0</strong>. Bám giáo trình Heizer/Render, Slack và Dornier, song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: '10 quyết định vận hành; chiến lược quốc tế/đa quốc gia/toàn cầu/xuyên quốc gia, order winner/qualifier; ma trận sản phẩm-quy trình, các loại bố trí mặt bằng; SCM toàn cầu, Incoterms, hiệu ứng bullwhip; TQM, Six Sigma/DMAIC, ISO 9001, chi phí chất lượng; dự báo (bình quân trượt, san mũ, hồi quy), hoạch định năng lực & tổng hợp; EOQ, tồn kho an toàn, ABC, JIT/Toyota Production System/kanban; bền vững (triple bottom line), Industry 4.0.',
    requirements: 'Kiến thức nhập môn quản trị kinh doanh cơ bản. Nên biết Excel/Google Sheets để tính EOQ và dự báo.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Heizer/Render, Slack, Dornier & slide trên FLM, sách, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vận hành là gì, 10 quyết định, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan quản trị vận hành quốc tế|||Chapter 1 — Overview of IOM', description: 'Vận hành nội địa vs quốc tế, động lực toàn cầu hoá.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chiến lược vận hành & cạnh tranh toàn cầu|||Chapter 2 — Operations strategy & global competitiveness', description: 'Ưu tiên cạnh tranh, order winner/qualifier, 4 chiến lược quốc tế.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thiết kế sản phẩm, quy trình & bố trí|||Chapter 3 — Product, process design & layout', description: 'DFM, ma trận sản phẩm-quy trình, các loại bố trí mặt bằng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Quản trị chuỗi cung ứng toàn cầu|||Chapter 4 — Global supply chain management', description: 'Outsourcing vs tích hợp dọc, Incoterms, hiệu ứng bullwhip.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Quản trị chất lượng (TQM, Six Sigma, ISO)|||Chapter 5 — Quality management', description: 'TQM, DMAIC, ISO 9001, chi phí chất lượng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Dự báo & hoạch định năng lực|||Chapter 6 — Forecasting & capacity planning', description: 'Bình quân trượt, san mũ, hồi quy, aggregate planning.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tồn kho & lean/JIT quốc tế|||Chapter 7 — Inventory & international lean/JIT', description: 'EOQ, tồn kho an toàn, ABC, JIT/Toyota Production System.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Bền vững, Industry 4.0 & thực tiễn|||Chapter 8 — Sustainable operations & Industry 4.0', description: 'Triple bottom line, IoT, digital twin, tổng hợp thực hành.', lessons: [c8, c8q] },
  ],
};
