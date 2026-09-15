/**
 * LEI201 — Law and Ethics in Business and Investment. Giáo trình FLM (khối
 * Quản trị Kinh doanh, kỳ 7): luật & đạo đức kinh doanh, khung pháp lý doanh
 * nghiệp VN, lý thuyết đạo đức, CSR/ESG, đạo đức đầu tư & chứng khoán, quản
 * trị công ty, hợp đồng/SHTT/tranh chấp, tuân thủ & chống tham nhũng. Song
 * ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('lei201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), văn bản luật chính thức, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">LEI201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study <strong>Law and Ethics in Business and Investment</strong> — Vietnamese corporate &amp; investment law, business ethics theory, CSR/ESG, capital-market conduct and corporate governance — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for LEI201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.google.com/search?q=Business+Ethics+Crane+Matten" target="_blank" rel="noopener"><em>Business Ethics</em> — Andrew Crane &amp; Dirk Matten</a></li>
<li><a href="https://www.cfainstitute.org/en/ethics-standards/codes/ethics-and-standards" target="_blank" rel="noopener">CFA Institute — Code of Ethics &amp; Standards of Professional Conduct</a></li>
</ul>
<h3>🌐 Official / free legal texts</h3>
<ul>
<li><a href="https://vanban.chinhphu.vn/" target="_blank" rel="noopener">Luật Doanh nghiệp 2020, Luật Đầu tư 2020, Luật Chứng khoán 2019 — Cổng thông tin Chính phủ</a></li>
<li><a href="https://thuvienphapluat.vn/" target="_blank" rel="noopener">Thư Viện Pháp Luật — searchable Vietnamese legal database</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — business ethics &amp; governance case discussions</li>
<li><a href="https://www.youtube.com/@cfainstitute" target="_blank" rel="noopener">CFA Institute</a> — investment ethics &amp; professional standards</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://dangkykinhdoanh.gov.vn/" target="_blank" rel="noopener">Cổng thông tin quốc gia về đăng ký doanh nghiệp</a> — look up real company filings</li>
<li><a href="https://www.ssc.gov.vn/" target="_blank" rel="noopener">Uỷ ban Chứng khoán Nhà nước (SSC)</a> — securities regulator, enforcement bulletins</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — law vs. ethics, business entity types (Luật Doanh nghiệp), core ethical theories.</li>
<li><strong>Practice</strong> — read a real enforcement bulletin from SSC and classify the violation.</li>
<li><strong>Go deeper</strong> — CSR/ESG, insider trading, corporate governance, IP &amp; contracts.</li>
<li><strong>Job-ready</strong> — apply the case-analysis framework (issue → stakeholders → law → ethics → decision) to a real news story.</li>
</ol></div>`,
    `<span class="eyebrow">LEI201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Luật và Đạo đức trong Kinh doanh và Đầu tư</strong> — luật doanh nghiệp &amp; đầu tư Việt Nam, lý thuyết đạo đức kinh doanh, CSR/ESG, đạo đức trên thị trường vốn và quản trị công ty — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của LEI201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.google.com/search?q=Business+Ethics+Crane+Matten" target="_blank" rel="noopener"><em>Business Ethics</em> — Andrew Crane &amp; Dirk Matten</a></li>
<li><a href="https://www.cfainstitute.org/en/ethics-standards/codes/ethics-and-standards" target="_blank" rel="noopener">CFA Institute — Code of Ethics &amp; Standards of Professional Conduct</a></li>
</ul>
<h3>🌐 Văn bản pháp luật chính thức / miễn phí</h3>
<ul>
<li><a href="https://vanban.chinhphu.vn/" target="_blank" rel="noopener">Luật Doanh nghiệp 2020, Luật Đầu tư 2020, Luật Chứng khoán 2019 — Cổng thông tin Chính phủ</a></li>
<li><a href="https://thuvienphapluat.vn/" target="_blank" rel="noopener">Thư Viện Pháp Luật — tra cứu văn bản luật Việt Nam</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — thảo luận tình huống đạo đức &amp; quản trị</li>
<li><a href="https://www.youtube.com/@cfainstitute" target="_blank" rel="noopener">CFA Institute</a> — đạo đức đầu tư &amp; chuẩn hành nghề</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://dangkykinhdoanh.gov.vn/" target="_blank" rel="noopener">Cổng thông tin quốc gia về đăng ký doanh nghiệp</a> — tra hồ sơ doanh nghiệp thật</li>
<li><a href="https://www.ssc.gov.vn/" target="_blank" rel="noopener">Uỷ ban Chứng khoán Nhà nước (SSC)</a> — cơ quan quản lý, bản tin xử phạt</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — luật khác đạo đức thế nào, loại hình doanh nghiệp (Luật Doanh nghiệp), các lý thuyết đạo đức cốt lõi.</li>
<li><strong>Luyện tập</strong> — đọc một bản tin xử phạt thật của SSC và phân loại hành vi vi phạm.</li>
<li><strong>Đào sâu</strong> — CSR/ESG, giao dịch nội gián, quản trị công ty, SHTT &amp; hợp đồng.</li>
<li><strong>Sẵn sàng đi làm</strong> — áp dụng khung phân tích tình huống (vấn đề → bên liên quan → luật → đạo đức → quyết định) vào một tin tức thật.</li>
</ol></div>`,
  ]]);

const intro = doc('lei201-0-1-overview', 'Course overview: Law and Ethics in Business and Investment|||Tổng quan: Luật và Đạo đức trong Kinh doanh và Đầu tư',
  'Luật và đạo đức khác nhau thế nào; vì sao doanh nghiệp cần cả hai; lộ trình 8 chương: khung pháp lý VN → lý thuyết đạo đức → CSR/ESG → đầu tư/chứng khoán → quản trị công ty → hợp đồng/SHTT → tuân thủ & tình huống thực tế.',
  [[
    `<span class="eyebrow">LEI201 · Lesson 0.1 · Overview</span>
<h2>Law and Ethics in Business and Investment</h2>
<p class="lead">This course helps you understand <strong>where the law ends and ethics begins</strong> in running a business or investing capital in Vietnam. You'll learn the legal framework governing companies and investment, the major ethical theories used to reason about business dilemmas, and how both intersect in real markets — from a startup's first registration to a listed company's disclosure duties.</p>
<h3>Law vs. ethics — not the same thing</h3>
<ul>
<li><strong>Law</strong> — the enforceable floor: rules backed by state sanctions (fines, contract voidance, criminal liability).</li>
<li><strong>Ethics</strong> — a wider ceiling: what is <em>right</em>, even when no law requires it (fair treatment, honesty, avoiding conflicts of interest).</li>
</ul>
<p>Something can be perfectly <strong>legal</strong> and still <strong>unethical</strong> (e.g. legal but predatory contract terms) — and that gap is exactly where reputations, and sometimes companies, are lost.</p>
<h3>Roadmap</h3>
<p>Vietnamese corporate &amp; investment law (Luật Doanh nghiệp, Luật Đầu tư) → ethical theories (Crane &amp; Matten) → CSR &amp; ESG → investment/securities-market ethics (Luật Chứng khoán, CFA Ethics) → corporate governance &amp; shareholder protection → contracts, IP &amp; dispute resolution → compliance, anti-corruption &amp; real-world case studies.</p>`,
    `<span class="eyebrow">LEI201 · Bài 0.1 · Tổng quan</span>
<h2>Luật và Đạo đức trong Kinh doanh và Đầu tư</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>ranh giới giữa luật và đạo đức</strong> khi vận hành doanh nghiệp hoặc đầu tư vốn tại Việt Nam. Bạn sẽ học khung pháp lý điều chỉnh doanh nghiệp và đầu tư, các lý thuyết đạo đức chính để suy luận về những tình huống khó xử trong kinh doanh, và cách hai thứ này giao nhau trên thị trường thật — từ lúc một startup đăng ký thành lập tới nghĩa vụ công bố thông tin của công ty niêm yết.</p>
<h3>Luật khác đạo đức thế nào</h3>
<ul>
<li><strong>Luật</strong> — sàn bắt buộc: quy tắc được nhà nước cưỡng chế (phạt tiền, vô hiệu hợp đồng, trách nhiệm hình sự).</li>
<li><strong>Đạo đức</strong> — trần rộng hơn: điều <em>đúng</em>, ngay cả khi không luật nào yêu cầu (đối xử công bằng, trung thực, tránh xung đột lợi ích).</li>
</ul>
<p>Một việc có thể hoàn toàn <strong>hợp pháp</strong> mà vẫn <strong>phi đạo đức</strong> (ví dụ điều khoản hợp đồng hợp pháp nhưng bóc lột) — và chính khoảng cách đó là nơi uy tín, thậm chí cả doanh nghiệp, bị mất.</p>
<h3>Lộ trình</h3>
<p>Luật doanh nghiệp &amp; đầu tư Việt Nam (Luật Doanh nghiệp, Luật Đầu tư) → lý thuyết đạo đức (Crane &amp; Matten) → CSR &amp; ESG → đạo đức đầu tư/chứng khoán (Luật Chứng khoán, CFA Ethics) → quản trị công ty &amp; bảo vệ cổ đông → hợp đồng, SHTT &amp; giải quyết tranh chấp → tuân thủ, chống tham nhũng &amp; tình huống thực tế.</p>`,
  ]]);

const c1 = doc('lei201-1-1-tong-quan', '1.1 — Overview: law & ethics in business|||1.1 — Tổng quan: luật & đạo đức trong kinh doanh',
  'Nguồn luật ảnh hưởng doanh nghiệp (hiến pháp, luật, nghị định, hợp đồng); vì sao đạo đức vượt quá tuân thủ pháp luật; mô hình "sàn pháp lý – trần đạo đức".',
  [[
    `<span class="eyebrow">LEI201 · Chapter 1 · Lesson 1.1</span>
<h2>Overview: law &amp; ethics in business</h2>
<h3>Where business rules come from</h3>
<ul>
<li><strong>Constitution &amp; statutes (luật)</strong> — passed by the National Assembly; the highest binding rules (e.g. Luật Doanh nghiệp, Luật Đầu tư, Luật Thương mại).</li>
<li><strong>Decrees &amp; circulars (nghị định, thông tư)</strong> — government/ministry rules that detail how a statute is applied.</li>
<li><strong>Contracts</strong> — private "law" between the parties who sign them, enforceable in court/arbitration as long as they don't violate a statute.</li>
</ul>
<h3>The floor-and-ceiling model</h3>
<pre><code>ETHICAL CEILING  - what a good actor SHOULD do (fair, honest, transparent)
                      up
     "grey zone"   - legal, but ethically questionable
                      up
LEGAL FLOOR      - what the law REQUIRES (minimum, enforced by the state)
</code></pre>
<p>Compliance departments watch the <strong>floor</strong>; ethics programs watch the <strong>gap above it</strong> — and that gap is where most reputational damage happens, because no law was technically broken.</p>
<div class="callout"><span class="badge">Why this course exists</span> A manager who only asks "is this legal?" will eventually make a decision that is legal, profitable, and still destroys the company's trust. This course trains the second question: "is this <em>right</em>?"</div>`,
    `<span class="eyebrow">LEI201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan: luật &amp; đạo đức trong kinh doanh</h2>
<h3>Quy tắc kinh doanh đến từ đâu</h3>
<ul>
<li><strong>Hiến pháp &amp; luật</strong> — do Quốc hội ban hành; quy tắc ràng buộc cao nhất (ví dụ Luật Doanh nghiệp, Luật Đầu tư, Luật Thương mại).</li>
<li><strong>Nghị định &amp; thông tư</strong> — quy tắc của chính phủ/bộ ngành, hướng dẫn chi tiết cách áp dụng luật.</li>
<li><strong>Hợp đồng</strong> — "luật" riêng giữa các bên ký kết, được toà án/trọng tài cưỡng chế thực hiện miễn là không vi phạm luật.</li>
</ul>
<h3>Mô hình sàn-trần</h3>
<pre><code>TRẦN ĐẠO ĐỨC  - điều một chủ thể tốt NÊN làm (công bằng, trung thực, minh bạch)
                     lên
   "vùng xám"  - hợp pháp, nhưng còn gây tranh cãi về đạo đức
                     lên
SÀN PHÁP LÝ  - điều luật YÊU CẦU (mức tối thiểu, nhà nước cưỡng chế)
</code></pre>
<p>Bộ phận tuân thủ canh giữ <strong>sàn</strong>; chương trình đạo đức canh giữ <strong>khoảng trống phía trên</strong> — và chính khoảng trống đó là nơi phần lớn thiệt hại uy tín xảy ra, vì về mặt kỹ thuật không luật nào bị vi phạm.</p>
<div class="callout"><span class="badge">Vì sao môn này tồn tại</span> Một quản lý chỉ hỏi "việc này hợp pháp không?" sớm muộn sẽ ra một quyết định hợp pháp, có lợi nhuận, và vẫn phá hỏng niềm tin của công ty. Môn này rèn câu hỏi thứ hai: "việc này có <em>đúng</em> không?"</div>`,
  ]]);

const c1q = quiz('lei201-quiz-1', 'Quiz 1 — Law & ethics overview|||Quiz 1 — Tổng quan luật & đạo đức', [
  { id: 'q1', question: '"Đạo đức" khác "pháp luật" ở điểm nào?', options: ['Đạo đức luôn nghiêm khắc hơn pháp luật', 'Đạo đức không bị nhà nước cưỡng chế nhưng có thể yêu cầu cao hơn mức luật quy định', 'Đạo đức chỉ áp dụng cho cá nhân, không áp dụng cho doanh nghiệp', 'Đạo đức và pháp luật luôn trùng khớp'], correctIndex: 1, explanation: 'Pháp luật là "sàn" được nhà nước cưỡng chế; đạo đức là "trần" cao hơn, không có chế tài nhà nước nhưng ảnh hưởng uy tín.' },
  { id: 'q2', question: 'Trong hệ thống nguồn luật Việt Nam, văn bản nào có giá trị pháp lý cao nhất trong nhóm dưới đây?', options: ['Thông tư', 'Nghị định', 'Luật (do Quốc hội ban hành)', 'Hợp đồng'], correctIndex: 2, explanation: 'Luật do Quốc hội ban hành có giá trị cao hơn nghị định, thông tư và hợp đồng.' },
  { id: 'q3', question: '"Vùng xám" (grey zone) trong mô hình sàn-trần là gì?', options: ['Hành vi vi phạm pháp luật rõ ràng', 'Hành vi hợp pháp nhưng còn gây tranh cãi về đạo đức', 'Hành vi không liên quan kinh doanh', 'Hành vi chỉ xảy ra ở công ty niêm yết'], correctIndex: 1, explanation: 'Vùng xám là hành vi không vi phạm luật (qua được "sàn") nhưng chưa đạt tới "trần" đạo đức mong đợi.' },
]);

const c2 = doc('lei201-2-1-khung-phap-ly', '2.1 — Vietnam\'s corporate & investment law framework|||2.1 — Khung pháp lý doanh nghiệp & đầu tư Việt Nam',
  'Luật Doanh nghiệp 2020: loại hình doanh nghiệp (TNHH, cổ phần, hợp danh, DNTN); Luật Đầu tư 2020: thủ tục đầu tư, ngành nghề có điều kiện, đầu tư nước ngoài.',
  [[
    `<span class="eyebrow">LEI201 · Chapter 2 · Lesson 2.1</span>
<h2>Vietnam's corporate &amp; investment law framework</h2>
<h3>Business entity types — Luật Doanh nghiệp 2020</h3>
<ul>
<li><strong>Limited liability company (Công ty TNHH)</strong> — 1–50 members, liability capped at capital contributed; no public share issuance.</li>
<li><strong>Joint-stock company (Công ty cổ phần)</strong> — at least 3 shareholders, capital divided into shares, the only form allowed to issue shares publicly / list on an exchange.</li>
<li><strong>Partnership (Công ty hợp danh)</strong> — at least 2 general partners with unlimited personal liability.</li>
<li><strong>Private/sole enterprise (Doanh nghiệp tư nhân)</strong> — one owner, unlimited personal liability, no separate legal personality from the owner.</li>
</ul>
<h3>Investment procedures — Luật Đầu tư 2020</h3>
<ul>
<li><strong>Conditional business lines (ngành nghề kinh doanh có điều kiện)</strong> — sectors requiring a license/permit beyond registration (banking, education, healthcare...).</li>
<li><strong>Investment registration certificate (Giấy chứng nhận đăng ký đầu tư)</strong> — required for foreign-invested projects and some domestic projects above a scale threshold, on top of the business registration certificate.</li>
<li><strong>Market access conditions for foreign investors</strong> — sector-specific caps/restrictions on foreign ownership (e.g. media, real estate near borders).</li>
</ul>
<pre><code>Setting up a company (typical path):
 1. Choose entity type (TNHH / co phan / hop danh / DNTN)
 2. (If foreign-invested) Investment registration certificate
 3. Business registration certificate (Giay CN dang ky doanh nghiep)
 4. Sector licenses if the business line is "conditional"
</code></pre>
<div class="callout"><span class="badge">Why the entity choice matters</span> Choosing "TNHH" over "cổ phần" isn't just paperwork — it decides whether the company can ever raise public capital, and how far personal liability extends if things go wrong.</div>`,
    `<span class="eyebrow">LEI201 · Chương 2 · Bài 2.1</span>
<h2>Khung pháp lý doanh nghiệp &amp; đầu tư Việt Nam</h2>
<h3>Loại hình doanh nghiệp — Luật Doanh nghiệp 2020</h3>
<ul>
<li><strong>Công ty TNHH</strong> — 1–50 thành viên, chịu trách nhiệm trong phạm vi vốn góp; không được phát hành cổ phần ra công chúng.</li>
<li><strong>Công ty cổ phần</strong> — ít nhất 3 cổ đông, vốn chia thành cổ phần, là loại hình DUY NHẤT được phép phát hành cổ phần ra công chúng / niêm yết.</li>
<li><strong>Công ty hợp danh</strong> — ít nhất 2 thành viên hợp danh, chịu trách nhiệm vô hạn bằng toàn bộ tài sản cá nhân.</li>
<li><strong>Doanh nghiệp tư nhân</strong> — một chủ sở hữu, chịu trách nhiệm vô hạn, không có tư cách pháp nhân tách biệt với chủ.</li>
</ul>
<h3>Thủ tục đầu tư — Luật Đầu tư 2020</h3>
<ul>
<li><strong>Ngành nghề kinh doanh có điều kiện</strong> — lĩnh vực cần giấy phép/chứng nhận riêng ngoài đăng ký kinh doanh (ngân hàng, giáo dục, y tế...).</li>
<li><strong>Giấy chứng nhận đăng ký đầu tư</strong> — bắt buộc với dự án có vốn nước ngoài và một số dự án trong nước vượt ngưỡng quy mô, ngoài Giấy chứng nhận đăng ký doanh nghiệp.</li>
<li><strong>Điều kiện tiếp cận thị trường cho nhà đầu tư nước ngoài</strong> — hạn mức/giới hạn sở hữu nước ngoài theo từng ngành (ví dụ truyền thông, bất động sản khu vực biên giới).</li>
</ul>
<pre><code>Thanh lap cong ty (duong di dien hinh):
 1. Chon loai hinh (TNHH / co phan / hop danh / DNTN)
 2. (Neu co von nuoc ngoai) Giay chung nhan dang ky dau tu
 3. Giay chung nhan dang ky doanh nghiep
 4. Giay phep nganh nghe neu la nganh "co dieu kien"
</code></pre>
<div class="callout"><span class="badge">Vì sao chọn loại hình quan trọng</span> Chọn "TNHH" thay vì "cổ phần" không chỉ là thủ tục giấy tờ — nó quyết định công ty có thể huy động vốn công chúng hay không, và trách nhiệm cá nhân kéo dài tới đâu nếu có sự cố.</div>`,
  ]]);

const c2q = quiz('lei201-quiz-2', 'Quiz 2 — Corporate & investment law|||Quiz 2 — Luật doanh nghiệp & đầu tư', [
  { id: 'q1', question: 'Loại hình doanh nghiệp nào là loại DUY NHẤT được phép phát hành cổ phần ra công chúng/niêm yết?', options: ['Công ty TNHH', 'Công ty cổ phần', 'Công ty hợp danh', 'Doanh nghiệp tư nhân'], correctIndex: 1, explanation: 'Chỉ công ty cổ phần có vốn chia thành cổ phần và được phép phát hành/niêm yết.' },
  { id: 'q2', question: 'Trách nhiệm của chủ doanh nghiệp tư nhân (DNTN) đối với nghĩa vụ tài chính của doanh nghiệp là?', options: ['Chỉ chịu trách nhiệm trong phạm vi vốn góp', 'Chịu trách nhiệm vô hạn bằng toàn bộ tài sản', 'Không chịu trách nhiệm gì', 'Chỉ chịu trách nhiệm nếu có hợp đồng riêng'], correctIndex: 1, explanation: 'DNTN không có tư cách pháp nhân tách biệt chủ sở hữu; chủ chịu trách nhiệm vô hạn.' },
  { id: 'q3', question: 'Theo Luật Đầu tư 2020, dự án có nhà đầu tư nước ngoài thường cần thêm giấy tờ nào ngoài Giấy CN đăng ký doanh nghiệp?', options: ['Giấy chứng nhận đăng ký đầu tư', 'Giấy phép lái xe', 'Hộ chiếu công vụ', 'Sổ đỏ đất đai'], correctIndex: 0, explanation: 'Giấy chứng nhận đăng ký đầu tư là yêu cầu riêng cho dự án có yếu tố nước ngoài / vượt ngưỡng quy định.' },
]);

const c3 = doc('lei201-3-1-ly-thuyet-dao-duc', '3.1 — Business ethics & normative theories|||3.1 — Đạo đức kinh doanh & các lý thuyết đạo đức',
  'Khung Crane & Matten: thuyết vị lợi (utilitarianism), thuyết nghĩa vụ (deontology/Kant), đạo đức đức hạnh (virtue ethics), thuyết các bên liên quan (stakeholder theory).',
  [[
    `<span class="eyebrow">LEI201 · Chapter 3 · Lesson 3.1</span>
<h2>Business ethics &amp; normative theories</h2>
<p>Following <strong>Crane &amp; Matten's <em>Business Ethics</em></strong>, four theories give managers different lenses for the same dilemma.</p>
<h3>The four lenses</h3>
<ul>
<li><strong>Utilitarianism (vị lợi)</strong> — the right action produces the greatest good for the greatest number; judged by <em>consequences</em>.</li>
<li><strong>Deontology (nghĩa vụ, Kant)</strong> — some actions are right or wrong <em>in themselves</em>, regardless of outcome (e.g. "never deceive," "keep promises").</li>
<li><strong>Virtue ethics (đức hạnh)</strong> — asks "what would a person of good character do?" — focuses on the actor's character, not a rule or a calculation.</li>
<li><strong>Stakeholder theory (các bên liên quan)</strong> — a firm owes obligations not only to shareholders but to employees, customers, suppliers, community and the environment.</li>
</ul>
<pre><code>Same dilemma, four questions:
 Layoffs to cut cost during a downturn -
  Utilitarian: does this maximize overall welfare (jobs saved elsewhere, firm survives)?
  Deontological: are workers treated as an END, not merely a MEANS (fair notice, severance)?
  Virtue: what would a person of integrity and compassion do here?
  Stakeholder: whose interests are affected, and how are they weighed?
</code></pre>
<div class="callout"><span class="badge">No single "correct" theory</span> Real cases rarely pass all four lenses cleanly — the skill this course builds is running a dilemma through more than one lens before deciding, not picking the theory that happens to justify the easy answer.</div>`,
    `<span class="eyebrow">LEI201 · Chương 3 · Bài 3.1</span>
<h2>Đạo đức kinh doanh &amp; các lý thuyết đạo đức</h2>
<p>Theo khung <strong><em>Business Ethics</em> của Crane &amp; Matten</strong>, có bốn lý thuyết cho nhà quản lý bốn góc nhìn khác nhau về cùng một tình huống khó xử.</p>
<h3>Bốn góc nhìn</h3>
<ul>
<li><strong>Thuyết vị lợi (utilitarianism)</strong> — hành động đúng tạo ra lợi ích lớn nhất cho số đông nhất; đánh giá qua <em>hệ quả</em>.</li>
<li><strong>Thuyết nghĩa vụ (deontology, Kant)</strong> — một số hành động đúng/sai <em>tự thân</em>, bất kể kết quả (ví dụ "không bao giờ lừa dối," "giữ lời hứa").</li>
<li><strong>Đạo đức đức hạnh (virtue ethics)</strong> — hỏi "người có nhân cách tốt sẽ làm gì?" — tập trung vào tính cách người hành động, không phải quy tắc hay phép tính.</li>
<li><strong>Thuyết các bên liên quan (stakeholder theory)</strong> — doanh nghiệp có nghĩa vụ không chỉ với cổ đông mà với nhân viên, khách hàng, nhà cung cấp, cộng đồng và môi trường.</li>
</ul>
<pre><code>Cung mot tinh huong, bon cau hoi:
 Sa thai de cat chi phi khi kinh te suy thoai -
  Vi loi: dieu nay co toi da hoa loi ich chung khong (cuu duoc viec khac, cong ty ton tai)?
  Nghia vu: nguoi lao dong duoc doi xu nhu MUC TIEU, khong chi la PHUONG TIEN (bao truoc, tro cap)?
  Duc hanh: nguoi liem chinh va nhan ai se lam gi?
  Cac ben lien quan: ai bi anh huong, va can nhac the nao?
</code></pre>
<div class="callout"><span class="badge">Không có lý thuyết "đúng" duy nhất</span> Tình huống thực tế hiếm khi vượt qua sạch cả bốn góc nhìn — kỹ năng môn này rèn là chạy tình huống qua nhiều góc nhìn trước khi quyết định, không chọn lý thuyết nào tiện lợi biện minh cho câu trả lời dễ nhất.</div>`,
  ]]);

const c3q = quiz('lei201-quiz-3', 'Quiz 3 — Ethical theories|||Quiz 3 — Lý thuyết đạo đức', [
  { id: 'q1', question: 'Thuyết đạo đức đánh giá hành động ĐÚNG/SAI dựa trên KẾT QUẢ (lợi ích lớn nhất cho số đông) là?', options: ['Deontology', 'Virtue ethics', 'Utilitarianism', 'Stakeholder theory'], correctIndex: 2, explanation: 'Utilitarianism (vị lợi) xét hành động qua hệ quả — lợi ích tổng thể.' },
  { id: 'q2', question: 'Thuyết nào cho rằng một số hành động sai về bản chất (ví dụ lừa dối) dù kết quả có tốt đến đâu?', options: ['Utilitarianism', 'Deontology (nghĩa vụ)', 'Virtue ethics', 'Stakeholder theory'], correctIndex: 1, explanation: 'Deontology xét đúng/sai theo nguyên tắc/bổn phận, không phụ thuộc kết quả.' },
  { id: 'q3', question: 'Stakeholder theory mở rộng nghĩa vụ của doanh nghiệp tới đối tượng nào ngoài cổ đông?', options: ['Chỉ ban giám đốc', 'Nhân viên, khách hàng, nhà cung cấp, cộng đồng, môi trường', 'Chỉ đối thủ cạnh tranh', 'Không mở rộng, chỉ cổ đông'], correctIndex: 1, explanation: 'Stakeholder theory nhìn doanh nghiệp có nghĩa vụ với nhiều bên liên quan, không chỉ chủ sở hữu vốn.' },
]);

const c4 = doc('lei201-4-1-csr-esg', '4.1 — Corporate Social Responsibility (CSR) & ESG|||4.1 — Trách nhiệm xã hội doanh nghiệp (CSR) & ESG',
  'Mô hình kim tự tháp CSR của Carroll (kinh tế, pháp lý, đạo đức, từ thiện); tiêu chí ESG (môi trường, xã hội, quản trị) và xu hướng đầu tư có trách nhiệm.',
  [[
    `<span class="eyebrow">LEI201 · Chapter 4 · Lesson 4.1</span>
<h2>Corporate Social Responsibility (CSR) &amp; ESG</h2>
<h3>Carroll's CSR pyramid</h3>
<pre><code>          Philanthropic  - "be a good corporate citizen" (donate, volunteer)
        Ethical          - "do what is right, fair" even beyond the law
      Legal              - "obey the law" - the mandatory floor
    Economic             - "be profitable" - the foundation everything rests on
</code></pre>
<p>Each layer rests on the one below: a company that isn't profitable can't sustain legal compliance, ethics, or philanthropy for long.</p>
<h3>From CSR to ESG</h3>
<ul>
<li><strong>Environmental (E)</strong> — emissions, resource use, waste, climate risk.</li>
<li><strong>Social (S)</strong> — labor practices, product safety, community impact, diversity.</li>
<li><strong>Governance (G)</strong> — board independence, executive pay, shareholder rights, anti-corruption controls.</li>
</ul>
<p>CSR is a company's voluntary <em>program</em>; <strong>ESG</strong> is a set of measurable <em>criteria investors and regulators use to score</em> that program — the shift from "doing good" to "proving it with data" that shareholders and lenders can act on.</p>
<div class="callout"><span class="badge">Why investors care</span> Poor governance (the "G") has historically been the strongest predictor of scandal and value destruction — often more than E or S — which is why credit raters and index funds weight it heavily.</div>`,
    `<span class="eyebrow">LEI201 · Chương 4 · Bài 4.1</span>
<h2>Trách nhiệm xã hội doanh nghiệp (CSR) &amp; ESG</h2>
<h3>Kim tự tháp CSR của Carroll</h3>
<pre><code>          Tu thien       - "la cong dan doanh nghiep tot" (quyen gop, thien nguyen)
        Dao duc          - "lam dieu dung, cong bang" ngay ca vuot luat
      Phap ly            - "tuan thu luat" - san bat buoc
    Kinh te              - "co loi nhuan" - nen tang moi thu khac dua vao
</code></pre>
<p>Mỗi tầng dựa vào tầng dưới: một công ty không có lợi nhuận thì khó duy trì tuân thủ pháp lý, đạo đức, hay hoạt động từ thiện lâu dài.</p>
<h3>Từ CSR đến ESG</h3>
<ul>
<li><strong>Môi trường (E)</strong> — khí thải, sử dụng tài nguyên, chất thải, rủi ro khí hậu.</li>
<li><strong>Xã hội (S)</strong> — chính sách lao động, an toàn sản phẩm, tác động cộng đồng, đa dạng.</li>
<li><strong>Quản trị (G)</strong> — tính độc lập của HĐQT, lương thưởng lãnh đạo, quyền cổ đông, kiểm soát chống tham nhũng.</li>
</ul>
<p>CSR là <em>chương trình</em> tự nguyện của doanh nghiệp; <strong>ESG</strong> là bộ <em>tiêu chí đo lường được</em> mà nhà đầu tư và cơ quan quản lý dùng để chấm điểm chương trình đó — bước chuyển từ "làm điều tốt" sang "chứng minh bằng dữ liệu" mà cổ đông và bên cho vay có thể hành động theo.</p>
<div class="callout"><span class="badge">Vì sao nhà đầu tư quan tâm</span> Quản trị yếu (chữ "G") trong lịch sử là dự báo mạnh nhất cho bê bối và mất giá trị — thường hơn cả E hoặc S — nên các tổ chức xếp hạng tín dụng và quỹ chỉ số đặt trọng số cao cho nó.</div>`,
  ]]);

const c4q = quiz('lei201-quiz-4', 'Quiz 4 — CSR & ESG|||Quiz 4 — CSR & ESG', [
  { id: 'q1', question: 'Theo kim tự tháp CSR của Carroll, tầng nào là NỀN TẢNG (nằm dưới cùng, các tầng khác phải dựa vào)?', options: ['Từ thiện (Philanthropic)', 'Pháp lý (Legal)', 'Kinh tế (Economic)', 'Đạo đức (Ethical)'], correctIndex: 2, explanation: 'Tầng Kinh tế (có lợi nhuận) là nền tảng; không có nó thì các tầng trên khó bền vững.' },
  { id: 'q2', question: 'ESG khác CSR chủ yếu ở điểm nào?', options: ['ESG là tên gọi khác của CSR, không khác gì', 'ESG là bộ tiêu chí đo lường được để nhà đầu tư/nhà quản lý đánh giá, còn CSR là chương trình tự nguyện của doanh nghiệp', 'ESG chỉ áp dụng cho doanh nghiệp nhà nước', 'CSR chỉ áp dụng ở Việt Nam'], correctIndex: 1, explanation: 'ESG lượng hoá để đánh giá, còn CSR là hoạt động/chương trình doanh nghiệp tự thực hiện.' },
  { id: 'q3', question: 'Chữ "G" trong ESG (Governance) đề cập tới điều gì?', options: ['Lượng khí thải carbon', 'Chính sách lao động và an toàn sản phẩm', 'Cấu trúc HĐQT, lương thưởng lãnh đạo, quyền cổ đông, kiểm soát chống tham nhũng', 'Chương trình từ thiện cộng đồng'], correctIndex: 2, explanation: 'Governance (quản trị) liên quan cấu trúc HĐQT, minh bạch, quyền cổ đông, kiểm soát nội bộ.' },
]);

const c5 = doc('lei201-5-1-dao-duc-dau-tu', '5.1 — Ethics in investment & securities markets|||5.1 — Đạo đức trong đầu tư & thị trường chứng khoán',
  'Luật Chứng khoán 2019: giao dịch nội gián (insider trading), thao túng thị trường (market manipulation); Bộ Quy tắc Đạo đức & Chuẩn hành nghề CFA.',
  [[
    `<span class="eyebrow">LEI201 · Chapter 5 · Lesson 5.1</span>
<h2>Ethics in investment &amp; securities markets</h2>
<h3>Two violations that undermine market trust — Luật Chứng khoán 2019</h3>
<ul>
<li><strong>Insider trading (giao dịch nội gián)</strong> — trading a listed security using material, non-public information (e.g. an unreleased earnings report or M&amp;A deal) before it reaches the public. Illegal because it turns "the market" into an unfair contest between the informed and everyone else.</li>
<li><strong>Market manipulation (thao túng thị trường)</strong> — creating a false impression of supply/demand or price (e.g. wash trading between accounts one person controls, spreading false rumors) to move the price and profit from it.</li>
</ul>
<h3>CFA Institute Code of Ethics &amp; Standards of Professional Conduct</h3>
<pre><code>Selected duties for investment professionals:
 - Act with integrity, competence, diligence - put client interests first
 - Use reasonable care and independent professional judgment
 - Do not misuse material non-public information
 - Disclose conflicts of interest fully and fairly
</code></pre>
<p>These are voluntary professional standards (not Vietnamese statute) but they set the global benchmark that securities regulators, including Vietnam's SSC, largely converge toward.</p>
<div class="callout"><span class="badge">Why this is "ethics," not just "law"</span> A trader can find a loophole that isn't explicitly banned yet still violates every professional standard above — the law lags market innovation, ethics is the standard that fills the gap before the law catches up.</div>`,
    `<span class="eyebrow">LEI201 · Chương 5 · Bài 5.1</span>
<h2>Đạo đức trong đầu tư &amp; thị trường chứng khoán</h2>
<h3>Hai hành vi phá vỡ niềm tin thị trường — Luật Chứng khoán 2019</h3>
<ul>
<li><strong>Giao dịch nội gián (insider trading)</strong> — giao dịch chứng khoán niêm yết dựa trên thông tin trọng yếu, chưa công bố (ví dụ báo cáo lợi nhuận chưa phát hành hoặc thương vụ M&amp;A) trước khi thông tin đến công chúng. Bất hợp pháp vì biến "thị trường" thành cuộc chơi không công bằng giữa người biết trước và mọi người khác.</li>
<li><strong>Thao túng thị trường</strong> — tạo ấn tượng giả về cung/cầu hoặc giá (ví dụ mua bán khớp giữa các tài khoản do một người kiểm soát, lan tin thất thiệt) để đẩy giá và hưởng lợi.</li>
</ul>
<h3>Bộ Quy tắc Đạo đức &amp; Chuẩn hành nghề CFA Institute</h3>
<pre><code>Mot so nghia vu cua chuyen gia dau tu:
 - Hanh dong liem chinh, chuyen mon, can trong - dat loi ich khach hang len truoc
 - Dung su can trong hop ly va phan doan chuyen mon doc lap
 - Khong loi dung thong tin trong yeu chua cong bo
 - Cong bo xung dot loi ich day du va trung thuc
</code></pre>
<p>Đây là chuẩn nghề nghiệp tự nguyện (không phải văn bản luật Việt Nam) nhưng đặt ra chuẩn tham chiếu toàn cầu mà các cơ quan quản lý chứng khoán, kể cả SSC Việt Nam, phần lớn hướng tới.</p>
<div class="callout"><span class="badge">Vì sao đây là "đạo đức," không chỉ "luật"</span> Một nhà giao dịch có thể tìm ra lỗ hổng chưa bị cấm rõ ràng nhưng vẫn vi phạm mọi chuẩn nghề nghiệp trên — luật đi sau đổi mới thị trường, đạo đức là chuẩn lấp khoảng trống trước khi luật kịp theo.</div>`,
  ]]);

const c5q = quiz('lei201-quiz-5', 'Quiz 5 — Investment ethics|||Quiz 5 — Đạo đức đầu tư & chứng khoán', [
  { id: 'q1', question: '"Giao dịch nội gián" (insider trading) là hành vi gì?', options: ['Mua bán cổ phiếu công khai trên sàn với thông tin đã công bố', 'Dùng thông tin trọng yếu chưa công bố để giao dịch trước công chúng', 'Mua chứng khoán của công ty mình đang làm việc sau khi thông tin đã công bố', 'Bán cổ phiếu lỗ để cắt lỗ'], correctIndex: 1, explanation: 'Insider trading là lợi dụng thông tin trọng yếu, chưa công khai để giao dịch trước, gây bất công cho nhà đầu tư khác.' },
  { id: 'q2', question: '"Thao túng thị trường" (market manipulation) thường được thực hiện bằng cách nào dưới đây?', options: ['Công bố báo cáo tài chính đúng hạn', 'Tạo cung/cầu giả hoặc lan tin thất thiệt để đẩy giá', 'Mua chứng khoán dài hạn và giữ', 'Tuân thủ tỉ lệ sở hữu nước ngoài'], correctIndex: 1, explanation: 'Thao túng thị trường tạo ấn tượng sai về cung/cầu hoặc giá để hưởng lợi bất chính.' },
  { id: 'q3', question: 'Bộ Quy tắc Đạo đức của CFA Institute có tính chất pháp lý như thế nào tại Việt Nam?', options: ['Là luật bắt buộc thay thế Luật Chứng khoán', 'Là chuẩn nghề nghiệp tự nguyện, không phải luật Việt Nam, nhưng được xem là chuẩn tham chiếu toàn cầu', 'Chỉ áp dụng cho công ty niêm yết ở Mỹ', 'Không có giá trị tham khảo nào'], correctIndex: 1, explanation: 'CFA Code là chuẩn nghề nghiệp quốc tế tự nguyện, không phải văn bản luật Việt Nam nhưng ảnh hưởng chuẩn ngành.' },
]);

const c6 = doc('lei201-6-1-quan-tri-cong-ty', '6.1 — Corporate governance & shareholder protection|||6.1 — Quản trị công ty & bảo vệ cổ đông',
  'Nguyên tắc quản trị công ty (OECD); cơ cấu HĐQT & Ban kiểm soát theo Luật Doanh nghiệp; quyền cổ đông thiểu số; giao dịch với người có liên quan.',
  [[
    `<span class="eyebrow">LEI201 · Chapter 6 · Lesson 6.1</span>
<h2>Corporate governance &amp; shareholder protection</h2>
<h3>Why governance exists</h3>
<p>Whoever <em>manages</em> a company (the board/executives) is not always the same person who <em>owns</em> it (the shareholders) — this separation creates the <strong>agency problem</strong>: managers may act in their own interest rather than the owners'. Governance rules exist to close that gap.</p>
<h3>Structure under Vietnam's Luật Doanh nghiệp</h3>
<ul>
<li><strong>General Meeting of Shareholders (Đại hội đồng cổ đông)</strong> — the highest decision body; elects the board.</li>
<li><strong>Board of Directors (Hội đồng quản trị – HĐQT)</strong> — sets strategy, appoints the CEO, oversees management.</li>
<li><strong>Supervisory Board (Ban kiểm soát)</strong> — independent oversight of the board &amp; management's compliance and financial reporting (or an audit committee under the board, in the one-tier model).</li>
</ul>
<h3>Protecting minority shareholders</h3>
<ul>
<li><strong>Related-party transactions (giao dịch với người có liên quan)</strong> — deals between the company and its directors/major shareholders must be disclosed and, above a threshold, approved by the shareholders' meeting — the classic channel for value to be siphoned away from minority holders.</li>
<li><strong>Right to information, to sue derivatively, and to a proportionate say</strong> — core protections that let a shareholder holding a small stake still hold management accountable.</li>
</ul>
<div class="callout"><span class="badge">Governance is a control, not a formality</span> Most major corporate scandals trace back to a related-party deal that was technically disclosed but never meaningfully scrutinized — governance fails quietly, long before the fraud becomes visible.</div>`,
    `<span class="eyebrow">LEI201 · Chương 6 · Bài 6.1</span>
<h2>Quản trị công ty &amp; bảo vệ cổ đông</h2>
<h3>Vì sao quản trị công ty tồn tại</h3>
<p>Người <em>quản lý</em> một công ty (HĐQT/ban điều hành) không phải luôn là người <em>sở hữu</em> nó (cổ đông) — sự tách biệt này tạo ra <strong>vấn đề đại diện</strong>: người quản lý có thể hành động theo lợi ích riêng thay vì lợi ích của chủ sở hữu. Quy tắc quản trị tồn tại để thu hẹp khoảng cách đó.</p>
<h3>Cơ cấu theo Luật Doanh nghiệp Việt Nam</h3>
<ul>
<li><strong>Đại hội đồng cổ đông</strong> — cơ quan quyết định cao nhất; bầu ra HĐQT.</li>
<li><strong>Hội đồng quản trị (HĐQT)</strong> — hoạch định chiến lược, bổ nhiệm CEO, giám sát ban điều hành.</li>
<li><strong>Ban kiểm soát</strong> — giám sát độc lập việc tuân thủ và báo cáo tài chính của HĐQT &amp; ban điều hành (hoặc ban kiểm toán trực thuộc HĐQT, trong mô hình một cấp).</li>
</ul>
<h3>Bảo vệ cổ đông thiểu số</h3>
<ul>
<li><strong>Giao dịch với người có liên quan</strong> — giao dịch giữa công ty và thành viên HĐQT/cổ đông lớn phải công bố và, vượt ngưỡng, cần Đại hội đồng cổ đông thông qua — kênh kinh điển để giá trị bị chuyển khỏi cổ đông thiểu số.</li>
<li><strong>Quyền được thông tin, quyền khởi kiện thay công ty, và quyền có tiếng nói tương xứng</strong> — những bảo vệ cốt lõi giúp cổ đông sở hữu tỉ lệ nhỏ vẫn có thể buộc ban điều hành chịu trách nhiệm.</li>
</ul>
<div class="callout"><span class="badge">Quản trị là kiểm soát, không phải hình thức</span> Hầu hết bê bối doanh nghiệp lớn bắt nguồn từ một giao dịch liên quan đã công bố về mặt kỹ thuật nhưng chưa từng bị soi xét thực chất — quản trị thất bại âm thầm, rất lâu trước khi gian lận lộ ra.</div>`,
  ]]);

const c6q = quiz('lei201-quiz-6', 'Quiz 6 — Governance & shareholders|||Quiz 6 — Quản trị công ty & cổ đông', [
  { id: 'q1', question: '"Vấn đề đại diện" (agency problem) trong quản trị công ty phát sinh từ đâu?', options: ['Sự tách biệt giữa người quản lý và người sở hữu (cổ đông)', 'Giá cổ phiếu biến động', 'Công ty không có website', 'Nhân viên nghỉ việc nhiều'], correctIndex: 0, explanation: 'Khi người quản lý không phải chủ sở hữu, lợi ích hai bên có thể lệch nhau — đó là vấn đề đại diện.' },
  { id: 'q2', question: 'Cơ quan nào trong công ty cổ phần có vai trò giám sát độc lập với HĐQT và ban điều hành?', options: ['Đại hội đồng cổ đông', 'Ban kiểm soát (hoặc ban kiểm toán)', 'Phòng nhân sự', 'Phòng marketing'], correctIndex: 1, explanation: 'Ban kiểm soát/ban kiểm toán giám sát tính tuân thủ và báo cáo tài chính độc lập với HĐQT.' },
  { id: 'q3', question: 'Vì sao "giao dịch với người có liên quan" cần công bố và đôi khi cần Đại hội đồng cổ đông thông qua?', options: ['Vì luật thuế yêu cầu', 'Vì đây là kênh dễ bị lợi dụng để chuyển lợi ích khỏi cổ đông thiểu số', 'Vì công ty muốn tăng doanh thu', 'Vì không liên quan quản trị'], correctIndex: 1, explanation: 'Giao dịch liên quan là nơi rủi ro tư lợi cao nhất, cần minh bạch để bảo vệ cổ đông thiểu số.' },
]);

const c7 = doc('lei201-7-1-hop-dong-shtt-tranh-chap', '7.1 — Contracts, intellectual property & business disputes|||7.1 — Hợp đồng, sở hữu trí tuệ & tranh chấp kinh doanh',
  'Yếu tố hợp đồng hợp lệ (đề nghị/chấp nhận, vi phạm, chế tài); các loại quyền SHTT (sáng chế, nhãn hiệu, bản quyền, bí mật kinh doanh); phương thức giải quyết tranh chấp.',
  [[
    `<span class="eyebrow">LEI201 · Chapter 7 · Lesson 7.1</span>
<h2>Contracts, intellectual property &amp; business disputes</h2>
<h3>What makes a contract enforceable</h3>
<ul>
<li><strong>Offer &amp; acceptance</strong> — one party proposes definite terms, the other accepts them without material change.</li>
<li><strong>Capacity &amp; legality</strong> — parties must have legal capacity to contract, and the subject matter must be lawful.</li>
<li><strong>Breach &amp; remedies</strong> — a broken promise can lead to specific performance, damages, or contract cancellation, depending on the harm caused.</li>
</ul>
<h3>Intellectual property that businesses actually deal with</h3>
<ul>
<li><strong>Patent (sáng chế)</strong> — protects a new, useful technical invention for a limited term.</li>
<li><strong>Trademark (nhãn hiệu)</strong> — protects a brand name/logo that distinguishes goods/services.</li>
<li><strong>Copyright (bản quyền)</strong> — protects original creative/software works automatically upon creation.</li>
<li><strong>Trade secret (bí mật kinh doanh)</strong> — protects confidential business information as long as it's kept secret (e.g. a formula, a customer list).</li>
</ul>
<h3>Resolving a business dispute — from cheapest to most formal</h3>
<pre><code>Negotiation (thuong luong) - cheapest, private, no third party
        v (if it fails)
Mediation (hoa giai)       - neutral third party helps reach agreement
        v (if it fails)
Arbitration (trong tai)    - private, binding decision (Luat Trong tai Thuong mai)
        v (alternative)
Litigation (toa an)        - public, binding, slowest, sets legal precedent
</code></pre>
<div class="callout"><span class="badge">Why arbitration is common in commercial contracts</span> Commercial contracts (especially cross-border ones) usually specify arbitration because it's faster, confidential, and the award is enforceable internationally under treaties Vietnam has joined — court litigation is the fallback, not the first choice.</div>`,
    `<span class="eyebrow">LEI201 · Chương 7 · Bài 7.1</span>
<h2>Hợp đồng, sở hữu trí tuệ &amp; tranh chấp kinh doanh</h2>
<h3>Điều gì làm một hợp đồng có hiệu lực thi hành</h3>
<ul>
<li><strong>Đề nghị &amp; chấp nhận</strong> — một bên đưa ra điều khoản rõ ràng, bên kia chấp nhận mà không thay đổi nội dung cốt lõi.</li>
<li><strong>Năng lực &amp; tính hợp pháp</strong> — các bên phải có năng lực pháp luật để giao kết hợp đồng, và nội dung phải hợp pháp.</li>
<li><strong>Vi phạm &amp; chế tài</strong> — lời hứa bị phá vỡ có thể dẫn tới buộc thực hiện đúng, bồi thường thiệt hại, hoặc huỷ hợp đồng, tuỳ mức độ thiệt hại.</li>
</ul>
<h3>Sở hữu trí tuệ mà doanh nghiệp thực sự phải xử lý</h3>
<ul>
<li><strong>Sáng chế (patent)</strong> — bảo vệ một giải pháp kỹ thuật mới, có tính ứng dụng, trong thời hạn nhất định.</li>
<li><strong>Nhãn hiệu (trademark)</strong> — bảo vệ tên/logo thương hiệu giúp phân biệt hàng hoá/dịch vụ.</li>
<li><strong>Bản quyền (copyright)</strong> — bảo vệ tác phẩm sáng tạo/phần mềm gốc tự động ngay khi tạo ra.</li>
<li><strong>Bí mật kinh doanh (trade secret)</strong> — bảo vệ thông tin kinh doanh bảo mật, chỉ khi thông tin còn được giữ kín (ví dụ công thức, danh sách khách hàng).</li>
</ul>
<h3>Giải quyết tranh chấp kinh doanh — từ rẻ nhất đến chính thức nhất</h3>
<pre><code>Thuong luong    - re nhat, kin, khong can nguoi thu ba
        v (neu khong thanh)
Hoa giai        - nguoi thu ba trung gian giup dat thoa thuan
        v (neu khong thanh)
Trong tai       - riêng tu, phan quyet rang buoc (Luat Trong tai Thuong mai)
        v (phuong an thay the)
Toa an          - cong khai, rang buoc, cham nhat, tao tien le phap ly
</code></pre>
<div class="callout"><span class="badge">Vì sao trọng tài phổ biến trong hợp đồng thương mại</span> Hợp đồng thương mại (đặc biệt xuyên biên giới) thường chọn trọng tài vì nhanh, bảo mật, và phán quyết được thi hành quốc tế theo các điều ước Việt Nam tham gia — kiện ra toà là phương án dự phòng, không phải lựa chọn đầu tiên.</div>`,
  ]]);

const c7q = quiz('lei201-quiz-7', 'Quiz 7 — Contracts, IP & disputes|||Quiz 7 — Hợp đồng, SHTT & tranh chấp', [
  { id: 'q1', question: 'Một hợp đồng được xem là có hiệu lực cần có yếu tố nào sau đây?', options: ['Chỉ cần một bên đồng ý', 'Đề nghị và chấp nhận rõ ràng, các bên có năng lực pháp luật, nội dung hợp pháp', 'Chỉ cần ký tên không cần nội dung', 'Không cần bất kỳ điều kiện nào'], correctIndex: 1, explanation: 'Hợp đồng hợp lệ cần đề nghị-chấp nhận thống nhất, năng lực pháp luật của các bên và nội dung hợp pháp.' },
  { id: 'q2', question: 'Loại quyền sở hữu trí tuệ nào bảo vệ một phát minh kỹ thuật mới, có tính ứng dụng?', options: ['Nhãn hiệu', 'Bản quyền', 'Sáng chế (patent)', 'Bí mật kinh doanh'], correctIndex: 2, explanation: 'Sáng chế/patent bảo vệ giải pháp kỹ thuật mới, có khả năng áp dụng công nghiệp.' },
  { id: 'q3', question: 'Vì sao hợp đồng thương mại quốc tế thường chọn trọng tài (arbitration) thay vì toà án?', options: ['Vì trọng tài luôn miễn phí', 'Vì phán quyết trọng tài thường được thực thi quốc tế nhanh, bảo mật hơn toà án', 'Vì trọng tài không có giá trị pháp lý', 'Vì luật cấm dùng toà án cho hợp đồng quốc tế'], correctIndex: 1, explanation: 'Trọng tài nhanh, bảo mật và phán quyết được công nhận/thi hành quốc tế theo các điều ước Việt Nam tham gia.' },
]);

const c8 = doc('lei201-8-1-tuan-thu-chong-tham-nhung', '8.1 — Compliance, anti-corruption & real-world cases|||8.1 — Tuân thủ, chống tham nhũng & tình huống thực tế',
  'Chương trình tuân thủ nội bộ; Luật Phòng, chống tham nhũng; rủi ro hối lộ khu vực công/tư; khung phân tích tình huống (vấn đề → bên liên quan → luật → đạo đức → quyết định).',
  [[
    `<span class="eyebrow">LEI201 · Chapter 8 · Lesson 8.1</span>
<h2>Compliance, anti-corruption &amp; real-world cases</h2>
<h3>What a compliance program actually does</h3>
<ul>
<li><strong>Prevent</strong> — codes of conduct, training, approval thresholds for spending/gifts.</li>
<li><strong>Detect</strong> — internal audit, whistleblower hotlines, transaction monitoring.</li>
<li><strong>Respond</strong> — investigation procedures, disciplinary action, self-reporting to regulators when required.</li>
</ul>
<h3>Anti-corruption — Luật Phòng, chống tham nhũng</h3>
<p>Corruption risk isn't limited to bribing a government official (public-sector bribery) — <strong>private-sector (commercial) bribery</strong>, such as kickbacks to a purchasing manager at another company, is increasingly covered by Vietnamese law and by most multinational compliance policies, because it distorts fair competition the same way public bribery does.</p>
<h3>A framework for analyzing any business-ethics case</h3>
<pre><code>1. ISSUE        - what actually happened, in one sentence, no spin
2. STAKEHOLDERS - who is affected, and how (list them, don't skip the quiet ones)
3. LAW          - what does Vietnamese/relevant law say (if anything)?
4. ETHICS       - run it through the four lenses (Ch.3): utilitarian / deontological / virtue / stakeholder
5. DECISION     - what should be done, and why THIS answer beats the alternatives
</code></pre>
<div class="callout"><span class="badge">The exam skill this course is really testing</span> Not "do you know the law" — but whether you can walk a messy, real situation through all five steps and land on a defensible decision, not just a legal one.</div>`,
    `<span class="eyebrow">LEI201 · Chương 8 · Bài 8.1</span>
<h2>Tuân thủ, chống tham nhũng &amp; tình huống thực tế</h2>
<h3>Một chương trình tuân thủ nội bộ thực sự làm gì</h3>
<ul>
<li><strong>Phòng ngừa</strong> — quy tắc ứng xử, đào tạo, ngưỡng phê duyệt chi tiêu/quà tặng.</li>
<li><strong>Phát hiện</strong> — kiểm toán nội bộ, đường dây tố giác, giám sát giao dịch.</li>
<li><strong>Ứng phó</strong> — quy trình điều tra, xử lý kỷ luật, tự báo cáo cơ quan quản lý khi bắt buộc.</li>
</ul>
<h3>Chống tham nhũng — Luật Phòng, chống tham nhũng</h3>
<p>Rủi ro tham nhũng không chỉ giới hạn ở hối lộ công chức nhà nước (hối lộ khu vực công) — <strong>hối lộ khu vực tư (thương mại)</strong>, ví dụ hoa hồng cho người quản lý mua hàng ở công ty khác, ngày càng được luật Việt Nam và hầu hết chính sách tuân thủ của tập đoàn đa quốc gia bao trùm, vì nó bóp méo cạnh tranh công bằng giống như hối lộ công.</p>
<h3>Khung phân tích cho bất kỳ tình huống đạo đức kinh doanh nào</h3>
<pre><code>1. VAN DE       - dieu gi thuc su xay ra, trong mot cau, khong to hong
2. BEN LIEN QUAN - ai bi anh huong, va nhu the nao (liet ke, khong bo sot ben im lang)
3. LUAT         - luat Viet Nam/luat lien quan noi gi (neu co)?
4. DAO DUC      - soi qua bon lang kinh (Chuong 3): vi loi / nghia vu / duc hanh / cac ben lien quan
5. QUYET DINH   - nen lam gi, va vi sao dap an NAY tot hon cac phuong an khac
</code></pre>
<div class="callout"><span class="badge">Kỹ năng mà bài thi môn này thực sự kiểm tra</span> Không phải "bạn có biết luật không" — mà là bạn có thể đưa một tình huống thực tế, lộn xộn, qua đủ năm bước và đi tới một quyết định có thể bảo vệ được, không chỉ hợp pháp.</div>`,
  ]]);

const c8q = quiz('lei201-quiz-8', 'Quiz 8 — Compliance & anti-corruption|||Quiz 8 — Tuân thủ & chống tham nhũng', [
  { id: 'q1', question: 'Ba chức năng chính của một chương trình tuân thủ nội bộ là?', options: ['Quảng cáo, bán hàng, thu nợ', 'Phòng ngừa, phát hiện, xử lý (ứng phó)', 'Tuyển dụng, đào tạo, sa thải', 'Kiểm toán thuế, kế toán, lương'], correctIndex: 1, explanation: 'Chương trình tuân thủ tập trung: phòng ngừa (prevent), phát hiện (detect), ứng phó (respond).' },
  { id: 'q2', question: '"Hối lộ khu vực tư" (private/commercial bribery) khác gì so với hối lộ công chức nhà nước?', options: ['Không bị coi là vi phạm ở đâu cả', 'Xảy ra giữa các bên trong khu vực doanh nghiệp (ví dụ hoa hồng cho người mua hàng) nhưng vẫn bị luật và chính sách tuân thủ coi là rủi ro tham nhũng', 'Chỉ xảy ra ở công ty nhà nước', 'Luôn hợp pháp nếu có hợp đồng'], correctIndex: 1, explanation: 'Hối lộ khu vực tư (thương mại) vẫn méo mó cạnh tranh công bằng và ngày càng bị luật/chính sách tuân thủ kiểm soát.' },
  { id: 'q3', question: 'Trong khung phân tích 5 bước (Vấn đề-Bên liên quan-Luật-Đạo đức-Quyết định), bước "Đạo đức" yêu cầu làm gì?', options: ['Bỏ qua luật pháp', 'Chỉ xét lợi nhuận công ty', 'Soi tình huống qua nhiều lý thuyết đạo đức (vị lợi, nghĩa vụ, đức hạnh, các bên liên quan) trước khi quyết định', 'Hỏi ý kiến truyền thông'], correctIndex: 2, explanation: 'Bước Đạo đức áp dụng các lăng kính đạo đức đã học ở Chương 3 để đánh giá đa chiều trước khi ra quyết định.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'LEI201',
    slug: 'lei201-law-and-ethics-in-business-and-investment',
    title: 'Law and Ethics in Business and Investment',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/LEI201.webp',
    shortDescription: 'Vietnamese corporate & investment law, ethical theories (Crane & Matten), CSR/ESG, investment & securities ethics (insider trading, CFA Ethics), corporate governance, contracts & IP, anti-corruption. Bilingual, with a case framework & quizzes.|||Luật doanh nghiệp & đầu tư VN, lý thuyết đạo đức (Crane & Matten), CSR/ESG, đạo đức đầu tư & chứng khoán (giao dịch nội gián, CFA Ethics), quản trị công ty, hợp đồng & SHTT, chống tham nhũng. Song ngữ, có khung phân tích tình huống & quiz.',
    description: 'Môn <strong>LEI201 — Law and Ethics in Business and Investment</strong> (kỳ 7) giúp hiểu <strong>ranh giới giữa luật và đạo đức</strong> trong kinh doanh &amp; đầu tư. Từ <strong>khung pháp lý doanh nghiệp Việt Nam</strong> (Luật Doanh nghiệp, Luật Đầu tư) → <strong>lý thuyết đạo đức kinh doanh</strong> (Crane &amp; Matten) → <strong>CSR &amp; ESG</strong> → <strong>đạo đức đầu tư &amp; thị trường chứng khoán</strong> (giao dịch nội gián, thao túng, CFA Ethics) → <strong>quản trị công ty &amp; bảo vệ cổ đông</strong> → <strong>hợp đồng, sở hữu trí tuệ &amp; tranh chấp</strong> → <strong>tuân thủ, chống tham nhũng &amp; tình huống thực tế</strong>. Bám giáo trình FLM, song ngữ, có khung phân tích tình huống và quiz mỗi chương.',
    whatYouLearn: 'Phân biệt luật và đạo đức; loại hình doanh nghiệp & thủ tục đầu tư theo Luật Doanh nghiệp/Đầu tư 2020; lý thuyết đạo đức (vị lợi, nghĩa vụ, đức hạnh, các bên liên quan); CSR & ESG; giao dịch nội gián, thao túng thị trường, CFA Ethics; quản trị công ty & bảo vệ cổ đông thiểu số; hợp đồng, sở hữu trí tuệ, giải quyết tranh chấp; tuân thủ & chống tham nhũng; khung phân tích tình huống thực tế.',
    requirements: 'Không yêu cầu kiến thức luật trước đó. Nên đọc trước Luật Doanh nghiệp 2020 và Luật Đầu tư 2020 trên FLM/Thư Viện Pháp Luật để dễ theo dõi các ví dụ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, văn bản luật, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Luật vs đạo đức, mô hình sàn-trần, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan luật & đạo đức|||Chapter 1 — Overview of law & ethics', description: 'Nguồn luật, mô hình sàn pháp lý – trần đạo đức.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khung pháp lý doanh nghiệp VN|||Chapter 2 — Vietnam corporate law framework', description: 'Luật Doanh nghiệp, Luật Đầu tư, loại hình DN.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đạo đức kinh doanh & lý thuyết|||Chapter 3 — Business ethics & theories', description: 'Crane & Matten: vị lợi, nghĩa vụ, đức hạnh, stakeholder.', lessons: [c3, c3q] },
    { title: 'Chương 4 — CSR & ESG|||Chapter 4 — CSR & ESG', description: 'Kim tự tháp Carroll, tiêu chí ESG.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đạo đức đầu tư & chứng khoán|||Chapter 5 — Investment & securities ethics', description: 'Giao dịch nội gián, thao túng, CFA Ethics.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quản trị công ty & cổ đông|||Chapter 6 — Corporate governance & shareholders', description: 'HĐQT, Ban kiểm soát, bảo vệ cổ đông thiểu số.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hợp đồng, SHTT & tranh chấp|||Chapter 7 — Contracts, IP & disputes', description: 'Hợp đồng, sở hữu trí tuệ, giải quyết tranh chấp.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Tuân thủ & chống tham nhũng|||Chapter 8 — Compliance & anti-corruption', description: 'Chương trình tuân thủ, khung phân tích tình huống.', lessons: [c8, c8q] },
  ],
};
