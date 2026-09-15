/**
 * IEI301 — Import Export (Nghiệp vụ Xuất nhập khẩu). Giáo trình FLM (syl):
 * "Import/Export Business" (Weiss); Incoterms 2020; UCP 600; Luật Thương mại
 * VN & Luật Quản lý ngoại thương 2017. 8 chương: tổng quan XNK → nghiên cứu
 * thị trường & đối tác → đàm phán & hợp đồng ngoại thương → Incoterms 2020 →
 * bộ chứng từ XNK → thanh toán quốc tế → hải quan & logistics → rủi ro,
 * tranh chấp & thực tiễn XNK Việt Nam. Song ngữ + ví dụ + bài tập.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('iei301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình Import/Export Business (Weiss), Incoterms 2020, UCP 600, Luật Thương mại & Luật Quản lý ngoại thương VN, tài liệu chính thức miễn phí, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">IEI301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Import Export (foreign trade operations) — market research, contracts, Incoterms, documents, payment, customs and risk — in one place. The full official slides live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giao trinh &amp; lecture slides for IEI301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Import/Export: How to Take Your Business Across Borders</em> — Kenneth D. Weiss (the core reference textbook for this subject)</li>
<li><em>Incoterms 2020</em> — ICC (International Chamber of Commerce) rulebook for delivery terms</li>
<li><em>UCP 600</em> — ICC Uniform Customs and Practice for Documentary Credits (letter of credit rules)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/" target="_blank" rel="noopener">ICC — Incoterms rules (official overview)</a></li>
<li><a href="https://www.trade.gov/" target="_blank" rel="noopener">Trade.gov — US export/import guides</a></li>
<li><a href="https://www.customs.gov.vn/" target="_blank" rel="noopener">Tổng cục Hải quan Việt Nam (customs.gov.vn)</a></li>
<li><a href="https://moit.gov.vn/" target="_blank" rel="noopener">Bộ Công Thương — Luật Quản lý ngoại thương 2017</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.trademap.org/" target="_blank" rel="noopener">Trade Map (ITC)</a> — bilateral trade statistics by product/country</li>
<li><a href="https://www.hscode.org/" target="_blank" rel="noopener">HS code lookup</a> — classify goods for tariffs &amp; customs</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — import-export cycle, Incoterms 2020, the four core documents (invoice, packing list, B/L, C/O).</li>
<li><strong>Practice</strong> — draft a simple contract and a full document set for one shipment; pick the right Incoterm.</li>
<li><strong>Go deeper</strong> — L/C payment flow, customs declaration steps, freight forwarding.</li>
<li><strong>Job-ready</strong> — read a real L/C, spot a discrepancy, and know the dispute-resolution options under Vietnamese law.</li>
</ol></div>`,
    `<span class="eyebrow">IEI301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Nghiệp vụ Xuất nhập khẩu — nghiên cứu thị trường, hợp đồng, Incoterms, chứng từ, thanh toán, hải quan và rủi ro — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IEI301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Import/Export: How to Take Your Business Across Borders</em> — Kenneth D. Weiss (sách nền của môn)</li>
<li><em>Incoterms 2020</em> — bộ quy tắc điều kiện giao hàng của ICC (Phòng Thương mại Quốc tế)</li>
<li><em>UCP 600</em> — Quy tắc thống nhất về tín dụng chứng từ của ICC (quy định về thư tín dụng L/C)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/" target="_blank" rel="noopener">ICC — Quy tắc Incoterms (tổng quan chính thức)</a></li>
<li><a href="https://www.trade.gov/" target="_blank" rel="noopener">Trade.gov — hướng dẫn xuất nhập khẩu (Mỹ)</a></li>
<li><a href="https://www.customs.gov.vn/" target="_blank" rel="noopener">Tổng cục Hải quan Việt Nam (customs.gov.vn)</a></li>
<li><a href="https://moit.gov.vn/" target="_blank" rel="noopener">Bộ Công Thương — Luật Quản lý ngoại thương 2017</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.trademap.org/" target="_blank" rel="noopener">Trade Map (ITC)</a> — số liệu thương mại song phương theo mặt hàng/quốc gia</li>
<li><a href="https://www.hscode.org/" target="_blank" rel="noopener">Tra mã HS</a> — phân loại hàng hoá để tính thuế &amp; làm hải quan</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — chu trình XNK, Incoterms 2020, bốn chứng từ cốt lõi (invoice, packing list, B/L, C/O).</li>
<li><strong>Luyện tập</strong> — soạn một hợp đồng đơn giản và bộ chứng từ đầy đủ cho một lô hàng; chọn đúng điều kiện Incoterm.</li>
<li><strong>Đào sâu thực tế</strong> — quy trình thanh toán L/C, các bước khai báo hải quan, giao nhận logistics.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc một L/C thật, phát hiện bất hợp lệ (discrepancy), và biết các cách xử lý tranh chấp theo luật Việt Nam.</li>
</ol></div>`,
  ]]);

const intro = doc('iei301-0-1-overview', 'Course overview: Import Export|||Tổng quan: Nghiệp vụ Xuất nhập khẩu',
  'Xuất nhập khẩu là gì, vì sao doanh nghiệp tham gia thương mại quốc tế, chu trình một giao dịch XNK; lộ trình 8 chương: tổng quan → thị trường/đối tác → hợp đồng → Incoterms → chứng từ → thanh toán → hải quan/logistics → rủi ro & thực tiễn VN.',
  [[
    `<span class="eyebrow">IEI301 · Lesson 0.1 · Overview</span>
<h2>Import Export</h2>
<p class="lead">This course teaches the full <strong>foreign trade operations cycle</strong> — from finding an overseas partner to getting paid and clearing customs. It follows the reference textbook <em>Import/Export Business</em> (Weiss), the <strong>Incoterms 2020</strong> rules, <strong>UCP 600</strong>, and Vietnam Commercial Law &amp; the Law on Foreign Trade Management 2017.</p>
<h3>Why firms trade internationally</h3>
<ul>
<li><strong>Access new markets</strong> — sell beyond a saturated domestic market.</li>
<li><strong>Source cheaper / better inputs</strong> — raw materials, components, labor.</li>
<li><strong>Comparative advantage</strong> — a country specializes in what it produces most efficiently and trades for the rest.</li>
</ul>
<h3>The import-export cycle, at a glance</h3>
<pre><code>1. Market research &amp; partner search
2. Negotiation -> contract signed (with an Incoterm)
3. Production / sourcing the goods
4. Documents prepared (invoice, packing list, B/L, C/O ...)
5. Payment (L/C, T/T, collection ...)
6. Customs clearance (export side, then import side)
7. Freight &amp; delivery to the agreed point
8. After-sale: claims, disputes, next order
</code></pre>
<h3>Roadmap</h3>
<p>Overview -&gt; market &amp; partner research -&gt; negotiation &amp; contracts -&gt; Incoterms 2020 -&gt; documents -&gt; international payment -&gt; customs &amp; logistics -&gt; risk, disputes &amp; Vietnam practice. Bilingual, with worked examples, sample documents and quizzes.</p>`,
    `<span class="eyebrow">IEI301 · Bài 0.1 · Tổng quan</span>
<h2>Nghiệp vụ Xuất nhập khẩu</h2>
<p class="lead">Môn này dạy toàn bộ <strong>chu trình nghiệp vụ ngoại thương</strong> — từ tìm đối tác nước ngoài đến nhận thanh toán và thông quan. Bám theo sách nền <em>Import/Export Business</em> (Weiss), quy tắc <strong>Incoterms 2020</strong>, <strong>UCP 600</strong>, và Luật Thương mại VN &amp; Luật Quản lý ngoại thương 2017.</p>
<h3>Vì sao doanh nghiệp tham gia thương mại quốc tế</h3>
<ul>
<li><strong>Tiếp cận thị trường mới</strong> — bán ra ngoài một thị trường nội địa đã bão hoà.</li>
<li><strong>Tìm nguồn rẻ hơn / tốt hơn</strong> — nguyên liệu, linh kiện, nhân công.</li>
<li><strong>Lợi thế so sánh</strong> — mỗi nước chuyên sản xuất thứ mình làm hiệu quả nhất, rồi trao đổi lấy phần còn lại.</li>
</ul>
<h3>Chu trình XNK, nhìn tổng quan</h3>
<pre><code>1. Nghiên cứu thị trường &amp; tìm đối tác
2. Đàm phán -> ký hợp đồng (có điều kiện Incoterm)
3. Sản xuất / tìm nguồn hàng
4. Soạn chứng từ (invoice, packing list, B/L, C/O ...)
5. Thanh toán (L/C, T/T, nhờ thu ...)
6. Thông quan (bên xuất, rồi bên nhập)
7. Vận chuyển &amp; giao hàng tới điểm thoả thuận
8. Sau bán: khiếu nại, tranh chấp, đơn hàng kế tiếp
</code></pre>
<h3>Lộ trình</h3>
<p>Tổng quan -&gt; nghiên cứu thị trường &amp; đối tác -&gt; đàm phán &amp; hợp đồng -&gt; Incoterms 2020 -&gt; chứng từ -&gt; thanh toán quốc tế -&gt; hải quan &amp; logistics -&gt; rủi ro, tranh chấp &amp; thực tiễn Việt Nam. Song ngữ, có ví dụ mẫu, chứng từ mẫu và quiz.</p>`,
  ]]);

const c1 = doc('iei301-1-1-overview-of-ie', '1.1 — Overview of import-export activities|||1.1 — Tổng quan hoạt động xuất nhập khẩu',
  'Khái niệm xuất khẩu/nhập khẩu, các bên tham gia (nhà xuất khẩu, nhập khẩu, forwarder, ngân hàng, hải quan), phương thức thâm nhập (xuất khẩu trực tiếp/gián tiếp, đại lý, liên doanh), khung pháp lý VN.',
  [[
    `<span class="eyebrow">IEI301 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of import-export activities</h2>
<h3>Core concepts</h3>
<ul>
<li><strong>Export</strong> — selling goods/services produced in one country to a buyer in another.</li>
<li><strong>Import</strong> — buying goods/services from another country for use or resale at home.</li>
<li><strong>Re-export / entrepot trade</strong> — importing goods only to export them again, often through a free-trade zone.</li>
</ul>
<h3>Who is involved in a trade deal</h3>
<ul>
<li><strong>Exporter / Importer</strong> — the seller and buyer, each with obligations set by the contract and the chosen Incoterm.</li>
<li><strong>Freight forwarder</strong> — arranges transport, consolidates cargo, handles booking and documents.</li>
<li><strong>Bank</strong> — handles international payment (L/C, T/T, collection) and sometimes trade finance.</li>
<li><strong>Customs authority</strong> — clears goods across the border, collects duties, enforces trade law.</li>
<li><strong>Insurer</strong> — covers cargo loss/damage in transit (marine cargo insurance).</li>
</ul>
<h3>Modes of market entry</h3>
<ul>
<li><strong>Direct export</strong> — the manufacturer sells straight to a foreign buyer; more control, more risk and workload.</li>
<li><strong>Indirect export</strong> — through a trading company / export management company; less control, less risk.</li>
<li><strong>Agent / distributor</strong> — a local representative sells on the exporter's behalf in the target market.</li>
<li><strong>Joint venture / local production</strong> — deeper commitment; used when tariffs, logistics costs or local-content rules make plain export unattractive.</li>
</ul>
<h3>Vietnam legal framework</h3>
<p>Foreign trade activity in Vietnam is governed mainly by the <strong>Commercial Law</strong> (Luật Thương mại) and the <strong>Law on Foreign Trade Management 2017</strong> (Luật Quản lý ngoại thương), which set out trading rights, prohibited/restricted/conditional goods, trade remedies (anti-dumping, safeguards) and origin rules.</p>
<div class="callout"><span class="badge">Exam anchor</span> Every later chapter (contract, Incoterms, documents, payment, customs) is one stage of the SAME cycle described here — keep this map in mind as the course goes deeper.</div>`,
    `<span class="eyebrow">IEI301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan hoạt động xuất nhập khẩu</h2>
<h3>Khái niệm cốt lõi</h3>
<ul>
<li><strong>Xuất khẩu</strong> — bán hàng hoá/dịch vụ sản xuất ở một nước cho người mua ở nước khác.</li>
<li><strong>Nhập khẩu</strong> — mua hàng hoá/dịch vụ từ nước khác để dùng hoặc bán lại trong nước.</li>
<li><strong>Tái xuất / thương mại trung chuyển</strong> — nhập hàng chỉ để xuất lại, thường qua khu thương mại tự do.</li>
</ul>
<h3>Các bên tham gia một giao dịch thương mại</h3>
<ul>
<li><strong>Nhà xuất khẩu / nhập khẩu</strong> — bên bán và bên mua, mỗi bên có nghĩa vụ theo hợp đồng và điều kiện Incoterm đã chọn.</li>
<li><strong>Forwarder (giao nhận)</strong> — sắp xếp vận chuyển, gom hàng, đặt chỗ và xử lý chứng từ.</li>
<li><strong>Ngân hàng</strong> — xử lý thanh toán quốc tế (L/C, T/T, nhờ thu) và đôi khi tài trợ thương mại.</li>
<li><strong>Cơ quan hải quan</strong> — thông quan hàng qua biên giới, thu thuế, thực thi luật thương mại.</li>
<li><strong>Công ty bảo hiểm</strong> — bảo hiểm hàng hoá mất/hỏng trong vận chuyển (bảo hiểm hàng hải).</li>
</ul>
<h3>Phương thức thâm nhập thị trường</h3>
<ul>
<li><strong>Xuất khẩu trực tiếp</strong> — nhà sản xuất bán thẳng cho người mua nước ngoài; kiểm soát nhiều hơn, rủi ro &amp; khối lượng việc cũng nhiều hơn.</li>
<li><strong>Xuất khẩu gián tiếp</strong> — qua công ty thương mại / công ty quản lý xuất khẩu; ít kiểm soát, ít rủi ro hơn.</li>
<li><strong>Đại lý / nhà phân phối</strong> — đại diện tại chỗ bán hàng thay nhà xuất khẩu ở thị trường mục tiêu.</li>
<li><strong>Liên doanh / sản xuất tại chỗ</strong> — cam kết sâu hơn; dùng khi thuế, chi phí logistics hoặc quy định nội địa hoá làm xuất khẩu thuần kém hấp dẫn.</li>
</ul>
<h3>Khung pháp lý Việt Nam</h3>
<p>Hoạt động ngoại thương ở Việt Nam chủ yếu theo <strong>Luật Thương mại</strong> và <strong>Luật Quản lý ngoại thương 2017</strong>, quy định quyền kinh doanh xuất nhập khẩu, hàng cấm/hạn chế/có điều kiện, biện pháp phòng vệ thương mại (chống bán phá giá, tự vệ) và quy tắc xuất xứ.</p>
<div class="callout"><span class="badge">Mốc để nhớ khi thi</span> Mọi chương sau (hợp đồng, Incoterms, chứng từ, thanh toán, hải quan) là MỘT giai đoạn của đúng chu trình mô tả ở đây — giữ bản đồ này trong đầu khi môn học đi sâu hơn.</div>`,
  ]]);

const c1q = quiz('iei301-quiz-1', 'Quiz 1 — Overview of import-export|||Quiz 1 — Tổng quan XNK', [
  { id: 'q1', question: 'Bên nào chịu trách nhiệm sắp xếp vận chuyển, gom hàng và xử lý chứng từ vận tải?', options: ['Ngân hàng', 'Cơ quan hải quan', 'Freight forwarder (đơn vị giao nhận)', 'Công ty bảo hiểm'], correctIndex: 2, explanation: 'Forwarder lo đặt chỗ tàu/máy bay, gom hàng và chứng từ vận tải.' },
  { id: 'q2', question: 'Phương thức thâm nhập nào cho nhà sản xuất kiểm soát cao nhất nhưng cũng chịu nhiều rủi ro và khối lượng việc nhất?', options: ['Xuất khẩu gián tiếp qua công ty thương mại', 'Xuất khẩu trực tiếp', 'Chỉ dùng đại lý địa phương', 'Không tham gia thị trường quốc tế'], correctIndex: 1, explanation: 'Xuất khẩu trực tiếp: nhà sản xuất tự bán thẳng, kiểm soát nhiều nhưng tự chịu rủi ro và việc.' },
  { id: 'q3', question: 'Ở Việt Nam, văn bản luật nào quy định quyền kinh doanh xuất nhập khẩu và các biện pháp phòng vệ thương mại?', options: ['Luật Doanh nghiệp', 'Luật Quản lý ngoại thương 2017', 'Luật Đầu tư', 'Luật Lao động'], correctIndex: 1, explanation: 'Luật Quản lý ngoại thương 2017 quy định quyền XNK, hàng cấm/hạn chế, phòng vệ thương mại, xuất xứ.' },
]);

const c2 = doc('iei301-2-1-market-research', '2.1 — Market research & finding international partners|||2.1 — Nghiên cứu thị trường & tìm kiếm đối tác quốc tế',
  'Nghiên cứu thị trường mục tiêu (nhu cầu, rào cản thuế/phi thuế, đối thủ, văn hoá kinh doanh), nguồn tìm đối tác (hội chợ, sàn B2B, thương vụ, phòng thương mại), thẩm định đối tác (due diligence).',
  [[
    `<span class="eyebrow">IEI301 · Chapter 2 · Lesson 2.1</span>
<h2>Market research &amp; finding international partners</h2>
<h3>What to research in a target market</h3>
<ul>
<li><strong>Demand</strong> — is there real, growing demand for the product? Who are the end users?</li>
<li><strong>Tariff &amp; non-tariff barriers</strong> — import duties, quotas, technical standards, licensing, labeling rules.</li>
<li><strong>Competition</strong> — local producers and other foreign exporters already serving the market.</li>
<li><strong>Business culture &amp; practice</strong> — negotiation style, payment norms, typical contract terms in that market.</li>
</ul>
<h3>Where to find international partners</h3>
<ul>
<li><strong>Trade fairs / exhibitions</strong> — direct contact with buyers and suppliers; see the product in person.</li>
<li><strong>B2B trade platforms</strong> — online marketplaces connecting exporters and importers by industry.</li>
<li><strong>Trade promotion offices</strong> — a country's commercial attache / trade office abroad (in Vietnam: Thương vụ Việt Nam) matches local firms with foreign buyers.</li>
<li><strong>Chambers of commerce</strong> — VCCI and foreign chambers publish directories and host matching events.</li>
</ul>
<h3>Vetting a partner (due diligence)</h3>
<pre><code>Checklist before signing anything:
- Legal registration (business license, tax code)
- Financial standing (credit report, bank reference)
- Trade history / references from other partners
- Site visit or third-party inspection when possible
- Match between claimed capacity and the order size
</code></pre>
<div class="callout"><span class="badge">Common trap</span> A cheap quote from an unverified supplier is the single most common cause of failed first deals — always verify before committing.</div>`,
    `<span class="eyebrow">IEI301 · Chương 2 · Bài 2.1</span>
<h2>Nghiên cứu thị trường &amp; tìm kiếm đối tác quốc tế</h2>
<h3>Cần nghiên cứu gì ở thị trường mục tiêu</h3>
<ul>
<li><strong>Nhu cầu</strong> — thị trường có nhu cầu thật và đang tăng không? Ai là người dùng cuối?</li>
<li><strong>Rào cản thuế &amp; phi thuế</strong> — thuế nhập khẩu, hạn ngạch, tiêu chuẩn kỹ thuật, cấp phép, quy định nhãn mác.</li>
<li><strong>Đối thủ cạnh tranh</strong> — nhà sản xuất địa phương và các nhà xuất khẩu nước ngoài khác đã có mặt.</li>
<li><strong>Văn hoá &amp; tập quán kinh doanh</strong> — cách đàm phán, chuẩn thanh toán, điều khoản hợp đồng phổ biến ở thị trường đó.</li>
</ul>
<h3>Tìm đối tác quốc tế ở đâu</h3>
<ul>
<li><strong>Hội chợ / triển lãm thương mại</strong> — gặp trực tiếp người mua và nhà cung cấp; xem hàng thật.</li>
<li><strong>Sàn giao dịch B2B</strong> — nền tảng trực tuyến kết nối nhà xuất khẩu và nhập khẩu theo ngành.</li>
<li><strong>Cơ quan xúc tiến thương mại</strong> — thương vụ của quốc gia ở nước ngoài (tại VN: Thương vụ Việt Nam) kết nối doanh nghiệp trong nước với người mua nước ngoài.</li>
<li><strong>Phòng thương mại</strong> — VCCI và các phòng thương mại nước ngoài công bố danh bạ, tổ chức sự kiện kết nối.</li>
</ul>
<h3>Thẩm định đối tác (due diligence)</h3>
<pre><code>Danh sách kiểm trước khi ký bất cứ điều gì:
- Đăng ký pháp lý (giấy phép kinh doanh, mã số thuế)
- Tình hình tài chính (báo cáo tín dụng, tham chiếu ngân hàng)
- Lịch sử giao dịch / tham chiếu từ đối tác khác
- Thăm thực địa hoặc thuê giám định độc lập nếu có thể
- Đối chiếu năng lực họ khai với quy mô đơn hàng</code></pre>
<div class="callout"><span class="badge">Bẫy thường gặp</span> Một báo giá rẻ từ nhà cung cấp chưa thẩm định là nguyên nhân phổ biến nhất khiến giao dịch đầu tay thất bại — luôn xác minh trước khi cam kết.</div>`,
  ]]);

const c2q = quiz('iei301-quiz-2', 'Quiz 2 — Market & partner research|||Quiz 2 — Nghiên cứu thị trường & đối tác', [
  { id: 'q1', question: 'Rào cản nào sau đây là rào cản PHI THUẾ khi thâm nhập một thị trường?', options: ['Thuế nhập khẩu theo tỷ lệ %', 'Tiêu chuẩn kỹ thuật và yêu cầu cấp phép', 'Thuế giá trị gia tăng', 'Thuế xuất khẩu'], correctIndex: 1, explanation: 'Tiêu chuẩn kỹ thuật, hạn ngạch, cấp phép là rào cản phi thuế; các loại thuế là rào cản thuế.' },
  { id: 'q2', question: 'Tại Việt Nam, đơn vị nào ở nước ngoài có nhiệm vụ kết nối doanh nghiệp Việt với người mua quốc tế?', options: ['Tổng cục Hải quan', 'Thương vụ Việt Nam', 'Ngân hàng Nhà nước', 'Bộ Tài chính'], correctIndex: 1, explanation: 'Thương vụ Việt Nam ở nước ngoài là cơ quan xúc tiến thương mại, kết nối đối tác.' },
  { id: 'q3', question: 'Vì sao cần thẩm định (due diligence) đối tác trước khi ký hợp đồng?', options: ['Để tăng giá bán', 'Để xác minh năng lực pháp lý, tài chính và lịch sử giao dịch, tránh rủi ro lừa đảo/mất khả năng giao hàng', 'Vì luật bắt buộc mọi hợp đồng phải có công chứng', 'Để giảm thuế nhập khẩu'], correctIndex: 1, explanation: 'Due diligence giúp tránh ký với đối tác không đủ năng lực hoặc không minh bạch.' },
]);

const c3 = doc('iei301-3-1-negotiation-contract', '3.1 — Negotiating & signing foreign trade contracts|||3.1 — Đàm phán & ký kết hợp đồng ngoại thương',
  'Chiến lược đàm phán ngoại thương, các điều khoản cốt lõi của hợp đồng mua bán quốc tế (tên hàng, số lượng, giá, giao hàng, thanh toán, bảo hành, bất khả kháng, luật áp dụng, giải quyết tranh chấp).',
  [[
    `<span class="eyebrow">IEI301 · Chapter 3 · Lesson 3.1</span>
<h2>Negotiating &amp; signing foreign trade contracts</h2>
<h3>Negotiation basics</h3>
<ul>
<li><strong>Know your walk-away point</strong> — the minimum price/terms you will accept before negotiation starts.</li>
<li><strong>Separate positions from interests</strong> — a lower price and a longer payment term can both satisfy the same underlying interest (cash flow).</li>
<li><strong>Cultural adaptation</strong> — pace, formality and the role of relationship-building vary a lot by country/region.</li>
</ul>
<h3>Core clauses of an international sale contract</h3>
<pre><code>A typical foreign trade contract covers:
1. Commodity   - name, spec, quality, HS code
2. Quantity    - unit, tolerance (e.g. +/-5%)
3. Price       - unit price, currency, Incoterm (e.g. 10 USD/pc FOB HCMC)
4. Delivery    - shipment date, port of loading/discharge, partial shipment allowed?
5. Payment     - method (L/C/T/T/collection), timing, currency
6. Packing &amp; marking
7. Warranty / quality claim period
8. Force majeure - events excusing non-performance (war, natural disaster ...)
9. Governing law &amp; dispute resolution (litigation vs arbitration)
</code></pre>
<h3>Why the Incoterm and payment clause matter most</h3>
<p>The <strong>Incoterm</strong> fixes who pays for freight/insurance and when risk transfers; the <strong>payment method</strong> fixes how much trust exists between the parties. Getting either wrong is the most common source of disputes — the next chapter covers Incoterms 2020 in depth.</p>
<div class="callout"><span class="badge">Contract vs Incoterm</span> The contract is the full agreement; the Incoterm is just one clause inside it (delivery &amp; risk). Never confuse "we agreed FOB" with "we have a contract" — price, quantity, payment and law still need their own clauses.</div>`,
    `<span class="eyebrow">IEI301 · Chương 3 · Bài 3.1</span>
<h2>Đàm phán &amp; ký kết hợp đồng ngoại thương</h2>
<h3>Cơ bản về đàm phán</h3>
<ul>
<li><strong>Biết điểm dừng của mình</strong> — mức giá/điều khoản thấp nhất chấp nhận được trước khi vào bàn đàm phán.</li>
<li><strong>Tách lập trường khỏi lợi ích thật</strong> — giá thấp hơn và thời hạn thanh toán dài hơn đều có thể phục vụ cùng một lợi ích cốt lõi (dòng tiền).</li>
<li><strong>Thích ứng văn hoá</strong> — tốc độ, mức trang trọng và vai trò của quan hệ cá nhân khác nhau nhiều theo quốc gia/vùng.</li>
</ul>
<h3>Các điều khoản cốt lõi của hợp đồng mua bán quốc tế</h3>
<pre><code>Một hợp đồng ngoại thương điển hình gồm:
1. Tên hàng   - tên, quy cách, chất lượng, mã HS
2. Số lượng   - đơn vị, dung sai (vd +/-5%)
3. Giá cả     - đơn giá, đơn vị tiền, điều kiện Incoterm (vd 10 USD/cái FOB HCMC)
4. Giao hàng  - ngày giao, cảng đi/đến, có cho giao từng phần không?
5. Thanh toán - phương thức (L/C/T/T/nhờ thu), thời điểm, loại tiền
6. Đóng gói &amp; ký hiệu mã hàng
7. Bảo hành / thời hạn khiếu nại chất lượng
8. Bất khả kháng - sự kiện miễn trừ trách nhiệm (chiến tranh, thiên tai ...)
9. Luật áp dụng &amp; giải quyết tranh chấp (kiện tại toà hay trọng tài)
</code></pre>
<h3>Vì sao điều kiện Incoterm và điều khoản thanh toán quan trọng nhất</h3>
<p><strong>Incoterm</strong> xác định ai trả cước/bảo hiểm và rủi ro chuyển giao lúc nào; <strong>phương thức thanh toán</strong> phản ánh mức độ tin tưởng giữa hai bên. Sai một trong hai là nguồn tranh chấp phổ biến nhất — chương kế tiếp đi sâu vào Incoterms 2020.</p>
<div class="callout"><span class="badge">Hợp đồng khác Incoterm</span> Hợp đồng là toàn bộ thoả thuận; Incoterm chỉ là MỘT điều khoản trong đó (giao hàng &amp; rủi ro). Đừng nhầm "đã thống nhất FOB" với "đã có hợp đồng" — giá, số lượng, thanh toán và luật áp dụng vẫn cần điều khoản riêng.</div>`,
  ]]);

const c3q = quiz('iei301-quiz-3', 'Quiz 3 — Negotiation & contracts|||Quiz 3 — Đàm phán & hợp đồng', [
  { id: 'q1', question: 'Điều khoản nào trong hợp đồng ngoại thương quy định sự kiện miễn trừ trách nhiệm như chiến tranh, thiên tai?', options: ['Điều khoản giá cả', 'Điều khoản bất khả kháng', 'Điều khoản đóng gói', 'Điều khoản bảo hành'], correctIndex: 1, explanation: 'Bất khả kháng (force majeure) miễn trừ trách nhiệm khi xảy ra sự kiện ngoài kiểm soát.' },
  { id: 'q2', question: 'Nhận định nào ĐÚNG về quan hệ giữa hợp đồng và Incoterm?', options: ['Incoterm thay thế toàn bộ hợp đồng', 'Incoterm chỉ là một điều khoản trong hợp đồng, quy định giao hàng & rủi ro', 'Có Incoterm là đủ, không cần điều khoản thanh toán', 'Incoterm quy định luật áp dụng khi tranh chấp'], correctIndex: 1, explanation: 'Incoterm chỉ cố định phần giao hàng/rủi ro/chi phí vận tải, không thay cho các điều khoản khác.' },
  { id: 'q3', question: 'Trong đàm phán ngoại thương, "tách lập trường khỏi lợi ích" nghĩa là gì?', options: ['Luôn giữ đúng mức giá ban đầu đưa ra', 'Nhận ra rằng nhiều giải pháp khác nhau (giá, thời hạn thanh toán...) có thể cùng thoả mãn một lợi ích cốt lõi như dòng tiền', 'Không bao giờ nhượng bộ', 'Chỉ đàm phán bằng văn bản, không gặp trực tiếp'], correctIndex: 1, explanation: 'Lập trường là con số cụ thể; lợi ích là nhu cầu thật đằng sau, có thể đạt bằng nhiều cách khác nhau.' },
]);

const c4 = doc('iei301-4-1-incoterms-2020', '4.1 — Incoterms 2020 & delivery terms|||4.1 — Incoterms 2020 & điều kiện giao hàng',
  'Incoterms 2020: 11 điều kiện chia 2 nhóm (mọi phương thức vận tải / chỉ đường biển), điểm chuyển giao rủi ro và chi phí, bốn nhóm chữ đầu (E/F/C/D), so sánh EXW/FOB/CIF/DDP.',
  [[
    `<span class="eyebrow">IEI301 · Chapter 4 · Lesson 4.1</span>
<h2>Incoterms 2020 &amp; delivery terms</h2>
<h3>What Incoterms actually fix</h3>
<p><strong>Incoterms</strong> (International Commercial Terms, published by the ICC) are 11 standard three-letter terms that fix exactly THREE things between seller and buyer: (1) who arranges &amp; pays for transport/insurance, (2) where risk of loss/damage passes from seller to buyer, and (3) who handles export/import customs. Incoterms never fix price, payment method, or ownership/title.</p>
<h3>11 terms, two groups</h3>
<pre><code>Any mode of transport (7):
  EXW - Ex Works              seller's minimum obligation (buyer picks up at seller's door)
  FCA - Free Carrier
  CPT - Carriage Paid To
  CIP - Carriage &amp; Insurance Paid To
  DAP - Delivered At Place
  DPU - Delivered at Place Unloaded
  DDP - Delivered Duty Paid   seller's maximum obligation (delivers, duty paid, ready to unload)

Sea &amp; inland waterway only (4):
  FAS - Free Alongside Ship
  FOB - Free On Board          risk passes when goods are on board the vessel
  CFR - Cost and Freight
  CIF - Cost, Insurance and Freight
</code></pre>
<h3>The E / F / C / D logic</h3>
<ul>
<li><strong>E</strong> (EXW) — seller does the least: goods made available at their own premises.</li>
<li><strong>F</strong> (FCA/FAS/FOB) — seller hands goods to a carrier the BUYER arranges; main carriage is buyer's cost.</li>
<li><strong>C</strong> (CPT/CIP/CFR/CIF) — seller arranges &amp; pays main carriage, but risk still passes early (at origin) — cost and risk transfer point are DIFFERENT places, a frequent exam trap.</li>
<li><strong>D</strong> (DAP/DPU/DDP) — seller delivers all the way to destination; seller bears the most risk and cost.</li>
</ul>
<pre><code>Example: goods sold CIF Hai Phong -&gt; Rotterdam, seller = Vietnam factory
 Seller pays: freight + marine insurance to Rotterdam
 Risk passes: when goods are loaded on board at Hai Phong (NOT at Rotterdam)
 -&gt; if the ship sinks mid-voyage, buyer claims the insurance, not the seller
</code></pre>
<div class="callout"><span class="badge">Exam trap</span> Under C-terms, cost goes all the way to destination but RISK transfers at origin. Confusing the two is the single most common Incoterms mistake.</div>`,
    `<span class="eyebrow">IEI301 · Chương 4 · Bài 4.1</span>
<h2>Incoterms 2020 &amp; điều kiện giao hàng</h2>
<h3>Incoterms thật ra cố định điều gì</h3>
<p><strong>Incoterms</strong> (Điều kiện thương mại quốc tế, do ICC ban hành) là 11 điều kiện chuẩn ba chữ, cố định đúng BA thứ giữa người bán và người mua: (1) ai lo &amp; trả cước vận chuyển/bảo hiểm, (2) rủi ro mất/hỏng chuyển từ người bán sang người mua ở đâu, và (3) ai làm thủ tục hải quan xuất/nhập. Incoterms KHÔNG cố định giá cả, phương thức thanh toán, hay quyền sở hữu hàng hoá.</p>
<h3>11 điều kiện, hai nhóm</h3>
<pre><code>Mọi phương thức vận tải (7 điều kiện):
  EXW - Giao tại xưởng        nghĩa vụ tối thiểu của người bán (người mua tự lấy hàng)
  FCA - Giao cho người chuyên chở
  CPT - Cước phí trả tới
  CIP - Cước phí & bảo hiểm trả tới
  DAP - Giao tại nơi đến
  DPU - Giao tại nơi đến đã dỡ hàng
  DDP - Giao đã nộp thuế       nghĩa vụ tối đa của người bán (giao tận nơi, đã nộp thuế, sẵn dỡ)

Chỉ đường biển & thuỷ nội địa (4 điều kiện):
  FAS - Giao dọc mạn tàu
  FOB - Giao trên tàu           rủi ro chuyển khi hàng đã lên tàu
  CFR - Cước phí trả tới
  CIF - Cước phí, bảo hiểm & cước trả tới
</code></pre>
<h3>Logic bốn nhóm chữ E / F / C / D</h3>
<ul>
<li><strong>E</strong> (EXW) — người bán làm ít nhất: giao hàng sẵn tại cơ sở của mình.</li>
<li><strong>F</strong> (FCA/FAS/FOB) — người bán trao hàng cho người chuyên chở do NGƯỜI MUA chỉ định; chặng vận tải chính do người mua chịu chi phí.</li>
<li><strong>C</strong> (CPT/CIP/CFR/CIF) — người bán lo &amp; trả chặng vận tải chính, nhưng rủi ro vẫn chuyển sớm (tại nơi đi) — điểm chuyển chi phí và điểm chuyển rủi ro KHÁC NHAU, bẫy thi hay gặp nhất.</li>
<li><strong>D</strong> (DAP/DPU/DDP) — người bán giao tới tận nơi đến; người bán chịu rủi ro &amp; chi phí nhiều nhất.</li>
</ul>
<pre><code>Ví dụ: bán CIF Hải Phòng -&gt; Rotterdam, người bán = nhà máy Việt Nam
 Người bán trả: cước tàu + bảo hiểm hàng hải tới Rotterdam
 Rủi ro chuyển: khi hàng đã xếp lên tàu tại Hải Phòng (KHÔNG phải tại Rotterdam)
 -&gt; nếu tàu chìm giữa đường, người mua đòi bảo hiểm, không phải người bán
</code></pre>
<div class="callout"><span class="badge">Bẫy khi thi</span> Với nhóm C, chi phí đi hết tới nơi đến nhưng RỦI RO chuyển tại nơi đi. Nhầm lẫn hai điều này là lỗi Incoterms phổ biến nhất.</div>`,
  ]]);

const c4q = quiz('iei301-quiz-4', 'Quiz 4 — Incoterms 2020|||Quiz 4 — Incoterms 2020', [
  { id: 'q1', question: 'Điều kiện Incoterm nào thể hiện nghĩa vụ TỐI THIỂU của người bán?', options: ['DDP', 'CIF', 'EXW', 'DAP'], correctIndex: 2, explanation: 'EXW (Ex Works): người bán chỉ cần để hàng sẵn tại cơ sở của mình.' },
  { id: 'q2', question: 'Với điều kiện CIF, rủi ro mất/hỏng hàng chuyển từ người bán sang người mua khi nào?', options: ['Khi hàng đến cảng đích', 'Khi hàng đã xếp lên tàu tại cảng đi', 'Khi người mua nhận được chứng từ bảo hiểm', 'Khi hàng qua thông quan nhập khẩu'], correctIndex: 1, explanation: 'Nhóm C: chi phí (cước, bảo hiểm) trả tới đích, nhưng rủi ro chuyển ngay tại cảng đi khi hàng lên tàu.' },
  { id: 'q3', question: 'Bốn điều kiện Incoterms nào CHỈ dùng cho vận tải đường biển/thuỷ nội địa?', options: ['EXW, FCA, CPT, CIP', 'FAS, FOB, CFR, CIF', 'DAP, DPU, DDP, EXW', 'FCA, DAP, DPU, DDP'], correctIndex: 1, explanation: 'FAS/FOB/CFR/CIF là 4 điều kiện chỉ áp dụng cho vận tải biển & thuỷ nội địa.' },
]);

const c5 = doc('iei301-5-1-trade-documents', '5.1 — Export-import documents|||5.1 — Bộ chứng từ xuất nhập khẩu',
  'Bốn chứng từ cốt lõi: commercial invoice, packing list, bill of lading (B/L), certificate of origin (C/O); vai trò từng chứng từ, chứng từ bổ sung (insurance policy, inspection certificate).',
  [[
    `<span class="eyebrow">IEI301 · Chapter 5 · Lesson 5.1</span>
<h2>Export-import documents</h2>
<h3>The four core documents</h3>
<ul>
<li><strong>Commercial Invoice</strong> — the seller's bill: describes goods, quantity, unit price, total value, Incoterm, buyer &amp; seller details. Used by customs to assess value/duty and by the bank to check payment.</li>
<li><strong>Packing List</strong> — details how goods are physically packed: number of cartons/pallets, weight (gross/net), dimensions per package. Used by customs and the carrier to verify the shipment, not for pricing.</li>
<li><strong>Bill of Lading (B/L)</strong> — issued by the carrier; it is (1) a receipt for goods loaded, (2) evidence of the contract of carriage, and (3) — if a "negotiable" / "to order" B/L — a DOCUMENT OF TITLE: whoever holds the original B/L can claim the goods.</li>
<li><strong>Certificate of Origin (C/O)</strong> — issued by an authorized body (in Vietnam: VCCI or the Ministry of Industry and Trade) confirming where the goods were made; needed to claim preferential tariffs under a free trade agreement (e.g. C/O form D for ASEAN).</li>
</ul>
<h3>Other common documents</h3>
<pre><code>- Insurance Policy/Certificate  -&gt; proof of marine cargo cover (needed under CIF/CIP)
- Inspection Certificate        -&gt; independent proof of quality/quantity before shipment
- Bill of Exchange (draft)      -&gt; payment instrument used with L/C or collection
- Customs Declaration           -&gt; the form submitted to clear goods (see Chapter 7)
</code></pre>
<h3>Why documents matter more than the goods, on paper</h3>
<p>In international trade the BANK and the CUSTOMS AUTHORITY never see the physical goods — they only see documents. A perfect shipment with a wrong document (a misspelled name, a missing signature, a date after the L/C expiry) can be rejected for payment or held at customs. This is why L/C payment (Chapter 6) is checked document-by-document, not goods-by-goods.</p>
<div class="callout"><span class="badge">Rule of thumb</span> Invoice = money &amp; identity of the deal. Packing list = physical shape of the shipment. B/L = who can claim it &amp; proof of shipment. C/O = where it is from.</div>`,
    `<span class="eyebrow">IEI301 · Chương 5 · Bài 5.1</span>
<h2>Bộ chứng từ xuất nhập khẩu</h2>
<h3>Bốn chứng từ cốt lõi</h3>
<ul>
<li><strong>Commercial Invoice (hoá đơn thương mại)</strong> — hoá đơn của người bán: mô tả hàng, số lượng, đơn giá, tổng giá trị, điều kiện Incoterm, thông tin hai bên. Hải quan dùng để tính giá trị/thuế, ngân hàng dùng để kiểm tra thanh toán.</li>
<li><strong>Packing List (phiếu đóng gói)</strong> — chi tiết cách đóng gói hàng: số kiện/pallet, trọng lượng (gross/net), kích thước mỗi kiện. Hải quan và người vận chuyển dùng để đối chiếu lô hàng, không dùng để định giá.</li>
<li><strong>Bill of Lading — B/L (vận đơn)</strong> — do người chuyên chở phát hành; nó là (1) biên nhận đã nhận hàng lên tàu, (2) chứng cứ hợp đồng vận chuyển, và (3) — nếu là B/L "theo lệnh"/có thể chuyển nhượng — CHỨNG TỪ SỞ HỮU: ai giữ B/L gốc thì có quyền nhận hàng.</li>
<li><strong>Certificate of Origin — C/O (giấy chứng nhận xuất xứ)</strong> — do cơ quan có thẩm quyền cấp (tại VN: VCCI hoặc Bộ Công Thương) xác nhận hàng sản xuất ở đâu; cần để hưởng ưu đãi thuế theo hiệp định thương mại tự do (vd C/O mẫu D cho ASEAN).</li>
</ul>
<h3>Các chứng từ khác thường gặp</h3>
<pre><code>- Insurance Policy/Certificate  -&gt; chứng nhận bảo hiểm hàng hải (cần khi bán CIF/CIP)
- Inspection Certificate        -&gt; giám định độc lập chất lượng/số lượng trước khi giao
- Bill of Exchange (hối phiếu)  -&gt; công cụ thanh toán dùng kèm L/C hoặc nhờ thu
- Customs Declaration (khai báo hải quan) -&gt; tờ khai để thông quan (xem Chương 7)
</code></pre>
<h3>Vì sao chứng từ quan trọng hơn hàng thật, trên giấy</h3>
<p>Trong thương mại quốc tế, NGÂN HÀNG và HẢI QUAN không bao giờ nhìn thấy hàng thật — họ chỉ thấy chứng từ. Một lô hàng hoàn hảo nhưng chứng từ sai (viết sai tên, thiếu ký, ngày quá hạn L/C) có thể bị từ chối thanh toán hoặc giữ ở hải quan. Đây là lý do thanh toán L/C (Chương 6) được kiểm từng chứng từ, không kiểm từng lô hàng.</p>
<div class="callout"><span class="badge">Ghi nhớ nhanh</span> Invoice = tiền &amp; danh tính giao dịch. Packing list = hình dạng vật lý lô hàng. B/L = ai được nhận hàng &amp; chứng cứ đã giao. C/O = hàng từ đâu.</div>`,
  ]]);

const c5q = quiz('iei301-quiz-5', 'Quiz 5 — Export-import documents|||Quiz 5 — Bộ chứng từ XNK', [
  { id: 'q1', question: 'Chứng từ nào có thể đóng vai trò CHỨNG TỪ SỞ HỮU — ai giữ bản gốc thì có quyền nhận hàng?', options: ['Commercial Invoice', 'Packing List', 'Bill of Lading (B/L) theo lệnh', 'Certificate of Origin'], correctIndex: 2, explanation: 'B/L "theo lệnh"/có thể chuyển nhượng là chứng từ sở hữu hàng hoá.' },
  { id: 'q2', question: 'Chứng từ nào cần để hàng được hưởng ưu đãi thuế theo hiệp định thương mại tự do?', options: ['Packing List', 'Certificate of Origin (C/O)', 'Bill of Exchange', 'Inspection Certificate'], correctIndex: 1, explanation: 'C/O xác nhận xuất xứ, là căn cứ hưởng ưu đãi thuế FTA (vd C/O mẫu D ASEAN).' },
  { id: 'q3', question: 'Vì sao một lô hàng đúng chất lượng vẫn có thể bị từ chối thanh toán trong thương mại quốc tế?', options: ['Vì hàng bị hỏng khi vận chuyển', 'Vì ngân hàng/hải quan chỉ kiểm tra CHỨNG TỪ, và một sai sót nhỏ trên chứng từ (sai tên, thiếu ký, quá hạn) có thể bị coi là bất hợp lệ', 'Vì giá hàng thay đổi trên thị trường', 'Vì người mua đổi ý không muốn nhận hàng nữa'], correctIndex: 1, explanation: 'Ngân hàng/hải quan xử lý dựa trên chứng từ, không nhìn hàng thật — chứng từ sai là lý do từ chối phổ biến.' },
]);

const c6 = doc('iei301-6-1-international-payment', '6.1 — International payment methods|||6.1 — Thanh toán quốc tế',
  'Ba phương thức chính: chuyển tiền (T/T) trả trước/trả sau, nhờ thu (collection) kèm/không kèm chứng từ, thư tín dụng (L/C) theo UCP 600; so sánh mức độ an toàn cho người bán/người mua.',
  [[
    `<span class="eyebrow">IEI301 · Chapter 6 · Lesson 6.1</span>
<h2>International payment methods</h2>
<h3>Telegraphic Transfer (T/T)</h3>
<p>A direct bank-to-bank wire transfer. Simple and cheap, but risk is one-sided:</p>
<ul>
<li><strong>T/T in advance</strong> — buyer pays before shipment; all risk on the BUYER (seller could fail to ship).</li>
<li><strong>T/T after shipment / on delivery</strong> — seller ships first; all risk on the SELLER (buyer could fail to pay).</li>
<li>Common compromise: split T/T — e.g. 30% deposit in advance, 70% before/on shipment.</li>
</ul>
<h3>Collection (Documentary Collection)</h3>
<p>The seller ships goods, then sends shipping documents to their bank, which forwards them to the buyer's bank for release against payment or acceptance.</p>
<ul>
<li><strong>D/P — Documents against Payment</strong> — buyer's bank releases documents only when the buyer pays.</li>
<li><strong>D/A — Documents against Acceptance</strong> — buyer's bank releases documents once the buyer accepts a bill of exchange (promises to pay later) — more risk for the seller than D/P.</li>
</ul>
<h3>Letter of Credit (L/C) — the most secure for both sides</h3>
<pre><code>L/C flow (simplified, under UCP 600):
1. Buyer asks their bank (issuing bank) to open an L/C in seller's favor
2. Issuing bank sends the L/C to seller's bank (advising/confirming bank)
3. Seller ships goods, prepares the exact documents the L/C demands
4. Seller presents documents to their bank
5. Bank checks documents STRICTLY against the L/C terms
6. If compliant -&gt; seller gets paid; bank forwards documents, claims reimbursement from issuing bank
7. Issuing bank releases documents to buyer against payment/acceptance
</code></pre>
<p>The bank's payment obligation depends only on documents matching the L/C — this is the <strong>principle of strict compliance</strong> under UCP 600. A single discrepancy (wrong date, misspelled name, missing document) lets the bank refuse payment even if the goods themselves are fine.</p>
<div class="callout"><span class="badge">Risk ranking</span> Safest for seller -&gt; riskiest for seller: L/C &gt; D/P &gt; T/T after shipment. Safest for buyer -&gt; riskiest for buyer: T/T in advance is riskiest for buyer, L/C is balanced for both.</div>`,
    `<span class="eyebrow">IEI301 · Chương 6 · Bài 6.1</span>
<h2>Thanh toán quốc tế</h2>
<h3>Chuyển tiền bằng điện (T/T)</h3>
<p>Chuyển tiền trực tiếp giữa hai ngân hàng. Đơn giản, rẻ, nhưng rủi ro dồn về một bên:</p>
<ul>
<li><strong>T/T trả trước</strong> — người mua trả tiền trước khi giao hàng; toàn bộ rủi ro dồn về NGƯỜI MUA (người bán có thể không giao hàng).</li>
<li><strong>T/T trả sau / khi giao hàng</strong> — người bán giao hàng trước; toàn bộ rủi ro dồn về NGƯỜI BÁN (người mua có thể không trả tiền).</li>
<li>Thoả hiệp phổ biến: chia T/T — vd đặt cọc 30% trước, 70% trước/khi giao hàng.</li>
</ul>
<h3>Nhờ thu (Documentary Collection)</h3>
<p>Người bán giao hàng, sau đó gửi chứng từ vận tải cho ngân hàng mình, ngân hàng chuyển tiếp cho ngân hàng người mua để giao chứng từ đổi lấy thanh toán hoặc chấp nhận.</p>
<ul>
<li><strong>D/P — Documents against Payment (nhờ thu trả tiền đổi chứng từ)</strong> — ngân hàng người mua chỉ giao chứng từ khi người mua đã trả tiền.</li>
<li><strong>D/A — Documents against Acceptance (nhờ thu chấp nhận đổi chứng từ)</strong> — ngân hàng người mua giao chứng từ ngay khi người mua ký chấp nhận hối phiếu (hứa trả sau) — rủi ro cho người bán cao hơn D/P.</li>
</ul>
<h3>Thư tín dụng (L/C) — an toàn nhất cho cả hai bên</h3>
<pre><code>Quy trình L/C (rút gọn, theo UCP 600):
1. Người mua yêu cầu ngân hàng mình (ngân hàng phát hành) mở L/C cho người bán hưởng
2. Ngân hàng phát hành gửi L/C tới ngân hàng người bán (thông báo/xác nhận)
3. Người bán giao hàng, chuẩn bị đúng chứng từ L/C yêu cầu
4. Người bán trình chứng từ cho ngân hàng mình
5. Ngân hàng kiểm chứng từ NGHIÊM NGẶT theo đúng nội dung L/C
6. Nếu phù hợp -&gt; người bán được trả tiền; ngân hàng chuyển chứng từ, đòi tiền ngân hàng phát hành
7. Ngân hàng phát hành giao chứng từ cho người mua đổi lấy thanh toán/chấp nhận
</code></pre>
<p>Nghĩa vụ trả tiền của ngân hàng chỉ phụ thuộc vào chứng từ có khớp L/C không — đây là <strong>nguyên tắc tuân thủ nghiêm ngặt</strong> theo UCP 600. Một bất hợp lệ nhỏ (sai ngày, sai tên, thiếu chứng từ) cho phép ngân hàng từ chối thanh toán dù hàng hoá vẫn tốt.</p>
<div class="callout"><span class="badge">Xếp hạng rủi ro</span> An toàn nhất cho người bán -&gt; rủi ro nhất cho người bán: L/C &gt; D/P &gt; T/T trả sau. An toàn nhất cho người mua -&gt; rủi ro nhất cho người mua: T/T trả trước rủi ro nhất cho người mua, L/C cân bằng cho cả hai.</div>`,
  ]]);

const c6q = quiz('iei301-quiz-6', 'Quiz 6 — International payment|||Quiz 6 — Thanh toán quốc tế', [
  { id: 'q1', question: 'Trong D/P (Documents against Payment), ngân hàng người mua giao chứng từ khi nào?', options: ['Ngay khi nhận được chứng từ', 'Khi người mua đã trả tiền', 'Khi người mua chỉ cần ký chấp nhận hối phiếu', 'Khi hàng đã tới cảng đích'], correctIndex: 1, explanation: 'D/P: giao chứng từ đổi lấy thanh toán ngay, khác D/A (chỉ cần chấp nhận trả sau).' },
  { id: 'q2', question: 'Nguyên tắc "tuân thủ nghiêm ngặt" trong thanh toán L/C (theo UCP 600) nghĩa là gì?', options: ['Ngân hàng kiểm tra chất lượng hàng hoá thật', 'Ngân hàng chỉ trả tiền nếu chứng từ khớp đúng với nội dung L/C, bất kể tình trạng hàng hoá thực tế', 'Người mua có thể từ chối trả tiền tuỳ ý', 'Ngân hàng phát hành không chịu trách nhiệm gì'], correctIndex: 1, explanation: 'Nghĩa vụ ngân hàng chỉ dựa trên sự phù hợp của chứng từ với L/C, không dựa trên hàng thật.' },
  { id: 'q3', question: 'Phương thức thanh toán nào rủi ro NHẤT cho người bán?', options: ['L/C', 'T/T trả trước', 'D/P', 'T/T sau khi giao hàng (trả sau)'], correctIndex: 3, explanation: 'T/T trả sau: người bán giao hàng trước, hoàn toàn phụ thuộc vào việc người mua có trả tiền hay không.' },
]);

const c7 = doc('iei301-7-1-customs-logistics', '7.1 — Customs procedures & freight forwarding logistics|||7.1 — Thủ tục hải quan & logistics giao nhận',
  'Quy trình khai báo hải quan xuất/nhập, phân loại HS code & tính thuế, vai trò forwarder trong đặt tải/vận đơn/thông quan, các phương thức vận tải (biển/hàng không/đa phương thức).',
  [[
    `<span class="eyebrow">IEI301 · Chapter 7 · Lesson 7.1</span>
<h2>Customs procedures &amp; freight forwarding logistics</h2>
<h3>Customs clearance steps</h3>
<pre><code>Typical export/import customs process:
1. Classify goods -&gt; HS code (determines duty rate & any license needed)
2. Prepare customs declaration + supporting documents
   (invoice, packing list, B/L, C/O, license if required)
3. Submit declaration electronically (e.g. Vietnam's VNACCS system)
4. Customs risk-channels the shipment:
   Green  -&gt; cleared immediately, no physical check
   Yellow -&gt; documents checked in detail
   Red    -&gt; documents AND physical inspection of goods
5. Pay duties/taxes (import duty, VAT, excise if applicable)
6. Goods released
</code></pre>
<h3>HS code &amp; duty</h3>
<p>The <strong>Harmonized System (HS) code</strong> is a standardized international product classification. It determines the tariff rate, whether the product needs a special license, and whether it qualifies for FTA preferential rates (with the right C/O).</p>
<h3>The freight forwarder's role</h3>
<ul>
<li><strong>Booking</strong> — reserves space with the shipping line / airline.</li>
<li><strong>Consolidation</strong> — combines several smaller shipments (LCL — Less than Container Load) into one container to cut cost.</li>
<li><strong>Documentation</strong> — prepares/handles the B/L, arranges cargo insurance, sometimes handles the customs declaration too.</li>
<li><strong>Door-to-door logistics</strong> — under D-terms, may coordinate the full chain from factory to buyer's warehouse.</li>
</ul>
<h3>Choosing a transport mode</h3>
<pre><code>Sea freight (FCL/LCL) -&gt; cheapest per kg, slowest, best for bulky/low-value cargo
Air freight            -&gt; fastest, most expensive, best for urgent/high-value/perishable cargo
Multimodal             -&gt; combines sea + road/rail/air under ONE contract & ONE document
</code></pre>
<div class="callout"><span class="badge">Common failure</span> A shipment held at customs is very often a documents problem (wrong HS code, missing C/O, mismatched invoice value) — not a physical problem with the goods.</div>`,
    `<span class="eyebrow">IEI301 · Chương 7 · Bài 7.1</span>
<h2>Thủ tục hải quan &amp; logistics giao nhận</h2>
<h3>Các bước thông quan</h3>
<pre><code>Quy trình thông quan xuất/nhập điển hình:
1. Phân loại hàng -&gt; mã HS (xác định mức thuế & giấy phép nếu có)
2. Chuẩn bị tờ khai hải quan + chứng từ kèm theo
   (invoice, packing list, B/L, C/O, giấy phép nếu cần)
3. Nộp tờ khai điện tử (vd hệ thống VNACCS của Việt Nam)
4. Hải quan phân luồng theo rủi ro:
   Luồng xanh - thông quan ngay, không kiểm tra thực tế
   Luồng vàng - kiểm tra chi tiết chứng từ
   Luồng đỏ   - kiểm tra chứng từ VÀ kiểm tra thực tế hàng hoá
5. Nộp thuế/phí (thuế nhập khẩu, VAT, thuế tiêu thụ đặc biệt nếu có)
6. Giải phóng hàng
</code></pre>
<h3>Mã HS &amp; thuế</h3>
<p><strong>Mã HS (Harmonized System)</strong> là hệ thống phân loại hàng hoá chuẩn quốc tế. Nó xác định mức thuế, hàng có cần giấy phép đặc biệt không, và có được hưởng ưu đãi thuế FTA không (khi có đúng C/O).</p>
<h3>Vai trò của forwarder (đơn vị giao nhận)</h3>
<ul>
<li><strong>Đặt tải (booking)</strong> — giữ chỗ với hãng tàu/hãng hàng không.</li>
<li><strong>Gom hàng (consolidation)</strong> — ghép nhiều lô hàng nhỏ (LCL — hàng lẻ, chưa đủ container) vào một container để giảm chi phí.</li>
<li><strong>Chứng từ</strong> — soạn/xử lý B/L, mua bảo hiểm hàng hoá, đôi khi làm luôn thủ tục khai báo hải quan.</li>
<li><strong>Logistics tận nơi</strong> — theo điều kiện nhóm D, có thể điều phối cả chuỗi từ nhà máy tới kho người mua.</li>
</ul>
<h3>Chọn phương thức vận tải</h3>
<pre><code>Đường biển (FCL/LCL) -&gt; rẻ nhất theo kg, chậm nhất, hợp hàng cồng kềnh/giá trị thấp
Đường hàng không     -&gt; nhanh nhất, đắt nhất, hợp hàng gấp/giá trị cao/dễ hỏng
Đa phương thức       -&gt; ghép biển + đường bộ/sắt/không dưới MỘT hợp đồng & MỘT chứng từ
</code></pre>
<div class="callout"><span class="badge">Lỗi thường gặp</span> Hàng bị giữ ở hải quan rất thường là vấn đề CHỨNG TỪ (sai mã HS, thiếu C/O, giá trị invoice không khớp) — không phải vấn đề vật lý của hàng hoá.</div>`,
  ]]);

const c7q = quiz('iei301-quiz-7', 'Quiz 7 — Customs & logistics|||Quiz 7 — Hải quan & logistics', [
  { id: 'q1', question: 'Mã HS code dùng để làm gì trong thủ tục hải quan?', options: ['Chỉ để đặt tên hàng cho đẹp', 'Xác định mức thuế, yêu cầu giấy phép và điều kiện hưởng ưu đãi FTA', 'Thay thế hoàn toàn cho invoice', 'Chỉ dùng khi vận chuyển đường hàng không'], correctIndex: 1, explanation: 'HS code là hệ phân loại hàng hoá chuẩn quốc tế, quyết định thuế suất và điều kiện ưu đãi.' },
  { id: 'q2', question: 'Lô hàng bị phân vào "luồng đỏ" khi thông quan nghĩa là gì?', options: ['Được thông quan ngay không kiểm tra', 'Chỉ kiểm tra chứng từ chi tiết', 'Kiểm tra cả chứng từ VÀ kiểm tra thực tế hàng hoá', 'Bị cấm nhập khẩu vĩnh viễn'], correctIndex: 2, explanation: 'Luồng đỏ là mức kiểm tra cao nhất: cả chứng từ và hàng hoá thực tế.' },
  { id: 'q3', question: 'LCL (Less than Container Load) là gì trong logistics đường biển?', options: ['Một container đầy hàng của một chủ hàng duy nhất', 'Gom nhiều lô hàng nhỏ của nhiều chủ hàng vào một container để giảm chi phí', 'Một loại giấy phép nhập khẩu', 'Một phương thức thanh toán quốc tế'], correctIndex: 1, explanation: 'LCL là hàng lẻ, forwarder gom nhiều lô nhỏ chung một container.' },
]);

const c8 = doc('iei301-8-1-risk-dispute-practice', '8.1 — Risk management, disputes & Vietnam import-export practice|||8.1 — Quản trị rủi ro, tranh chấp & thực tiễn XNK Việt Nam',
  'Các loại rủi ro trong XNK (thương mại, tỷ giá, vận tải, chính trị), công cụ giảm rủi ro, giải quyết tranh chấp (thương lượng, trọng tài, toà án), thực tiễn XNK Việt Nam (nhóm hàng chủ lực, FTA).',
  [[
    `<span class="eyebrow">IEI301 · Chapter 8 · Lesson 8.1</span>
<h2>Risk management, disputes &amp; Vietnam import-export practice</h2>
<h3>Types of risk in foreign trade</h3>
<ul>
<li><strong>Commercial risk</strong> — the partner fails to pay or fails to deliver as agreed.</li>
<li><strong>Foreign exchange (FX) risk</strong> — the contract currency moves against you between signing and settlement.</li>
<li><strong>Transport risk</strong> — loss, damage or delay of cargo in transit.</li>
<li><strong>Political / country risk</strong> — trade sanctions, sudden regulation, embargo, currency controls in the partner country.</li>
</ul>
<h3>Tools to reduce risk</h3>
<pre><code>Commercial risk    -&gt; L/C, due diligence, trade credit insurance, partial deposit
FX risk             -&gt; invoice in a stable currency, forward contract with the bank
Transport risk       -&gt; marine cargo insurance, correct Incoterm for the deal
Political risk       -&gt; check trade sanctions lists, diversify markets/suppliers
</code></pre>
<h3>Resolving disputes</h3>
<ul>
<li><strong>Negotiation</strong> — fastest, cheapest, preserves the relationship; the first step in almost every contract.</li>
<li><strong>Mediation / conciliation</strong> — a neutral third party helps the two sides reach a voluntary settlement.</li>
<li><strong>Arbitration</strong> — a private, binding decision by an arbitral tribunal (e.g. VIAC — Vietnam International Arbitration Centre); faster and more confidential than court, and its award is enforceable abroad under the New York Convention. Most international sale contracts choose arbitration.</li>
<li><strong>Litigation (court)</strong> — public, can be slower, and a foreign court judgment is harder to enforce abroad than an arbitral award.</li>
</ul>
<h3>Vietnam import-export practice, at a glance</h3>
<p>Vietnam's leading export groups include electronics, textiles &amp; garments, footwear, and agricultural products (rice, coffee, seafood); leading imports include machinery, electronic components, fuel and raw materials. Vietnam is party to numerous FTAs (CPTPP, EVFTA, RCEP, ASEAN agreements) which lower tariffs for goods meeting the FTA's rules of origin — one more reason a correct C/O (Chapter 5) matters.</p>
<div class="callout"><span class="badge">Putting it together</span> A well-run deal chains every earlier chapter correctly: research the partner (Ch.2) -&gt; negotiate a complete contract with the right Incoterm (Ch.3-4) -&gt; prepare accurate documents (Ch.5) -&gt; choose payment matching the trust level (Ch.6) -&gt; clear customs cleanly (Ch.7) -&gt; and have a dispute-resolution clause ready if something still goes wrong (Ch.8).</div>`,
    `<span class="eyebrow">IEI301 · Chương 8 · Bài 8.1</span>
<h2>Quản trị rủi ro, tranh chấp &amp; thực tiễn XNK Việt Nam</h2>
<h3>Các loại rủi ro trong ngoại thương</h3>
<ul>
<li><strong>Rủi ro thương mại</strong> — đối tác không trả tiền hoặc không giao hàng như thoả thuận.</li>
<li><strong>Rủi ro tỷ giá</strong> — đồng tiền hợp đồng biến động bất lợi giữa lúc ký và lúc thanh toán.</li>
<li><strong>Rủi ro vận tải</strong> — hàng mất, hỏng hoặc trễ trong quá trình vận chuyển.</li>
<li><strong>Rủi ro chính trị / quốc gia</strong> — cấm vận thương mại, thay đổi quy định đột ngột, kiểm soát ngoại hối ở nước đối tác.</li>
</ul>
<h3>Công cụ giảm rủi ro</h3>
<pre><code>Rủi ro thương mại  -&gt; L/C, thẩm định đối tác, bảo hiểm tín dụng thương mại, đặt cọc
Rủi ro tỷ giá       -&gt; lập hoá đơn bằng đồng tiền ổn định, hợp đồng kỳ hạn với ngân hàng
Rủi ro vận tải       -&gt; bảo hiểm hàng hải, chọn đúng Incoterm cho giao dịch
Rủi ro chính trị     -&gt; kiểm tra danh sách cấm vận, đa dạng hoá thị trường/nguồn cung
</code></pre>
<h3>Giải quyết tranh chấp</h3>
<ul>
<li><strong>Thương lượng</strong> — nhanh nhất, rẻ nhất, giữ được quan hệ; bước đầu tiên trong hầu hết hợp đồng.</li>
<li><strong>Hoà giải</strong> — một bên trung gian giúp hai bên đạt thoả thuận tự nguyện.</li>
<li><strong>Trọng tài</strong> — quyết định riêng, ràng buộc, do hội đồng trọng tài đưa ra (vd VIAC — Trung tâm Trọng tài Quốc tế Việt Nam); nhanh hơn và bảo mật hơn toà án, phán quyết được thi hành ở nước ngoài theo Công ước New York. Hầu hết hợp đồng mua bán quốc tế chọn trọng tài.</li>
<li><strong>Kiện tại toà án</strong> — công khai, có thể chậm hơn, và bản án toà nước ngoài khó thi hành ở nước khác hơn phán quyết trọng tài.</li>
</ul>
<h3>Thực tiễn XNK Việt Nam, nhìn tổng quan</h3>
<p>Nhóm hàng xuất khẩu chủ lực của Việt Nam gồm điện tử, dệt may, giày dép, và nông sản (gạo, cà phê, thuỷ sản); nhóm hàng nhập khẩu chủ lực gồm máy móc, linh kiện điện tử, nhiên liệu và nguyên liệu. Việt Nam tham gia nhiều FTA (CPTPP, EVFTA, RCEP, các hiệp định ASEAN) giúp giảm thuế cho hàng đáp ứng quy tắc xuất xứ của FTA — một lý do nữa vì sao C/O đúng (Chương 5) quan trọng.</p>
<div class="callout"><span class="badge">Ghép lại toàn cảnh</span> Một giao dịch trơn tru nối đúng mọi chương trước: nghiên cứu đối tác (Ch.2) -&gt; đàm phán hợp đồng đầy đủ với đúng Incoterm (Ch.3-4) -&gt; chuẩn bị chứng từ chính xác (Ch.5) -&gt; chọn thanh toán khớp mức tin tưởng (Ch.6) -&gt; thông quan sạch sẽ (Ch.7) -&gt; và có sẵn điều khoản giải quyết tranh chấp nếu vẫn có sự cố (Ch.8).</div>`,
  ]]);

const c8q = quiz('iei301-quiz-8', 'Quiz 8 — Risk, disputes & Vietnam practice|||Quiz 8 — Rủi ro, tranh chấp & thực tiễn VN', [
  { id: 'q1', question: 'Rủi ro tỷ giá (FX risk) trong ngoại thương là gì?', options: ['Đối tác không giao hàng', 'Đồng tiền hợp đồng biến động bất lợi giữa lúc ký hợp đồng và lúc thanh toán', 'Hàng bị hỏng khi vận chuyển', 'Chính phủ cấm vận thương mại'], correctIndex: 1, explanation: 'FX risk liên quan đến biến động tỷ giá giữa thời điểm ký và thanh toán.' },
  { id: 'q2', question: 'Vì sao trọng tài (arbitration) thường được chọn hơn kiện toà án trong hợp đồng ngoại thương?', options: ['Vì trọng tài luôn miễn phí', 'Vì phán quyết trọng tài có thể thi hành ở nước ngoài dễ hơn theo Công ước New York, nhanh và bảo mật hơn toà', 'Vì trọng tài không cần có hợp đồng', 'Vì toà án luôn ra quyết định có lợi cho bên nguyên'], correctIndex: 1, explanation: 'Công ước New York giúp thi hành phán quyết trọng tài quốc tế dễ hơn bản án toà nước ngoài.' },
  { id: 'q3', question: 'C/O (chứng nhận xuất xứ) đúng quan trọng với thực tiễn XNK Việt Nam vì sao?', options: ['Vì bắt buộc cho mọi loại hàng không phân biệt thị trường', 'Vì là điều kiện để hàng hưởng ưu đãi thuế theo các FTA mà Việt Nam tham gia (CPTPP, EVFTA, RCEP...)', 'Vì thay thế được invoice', 'Vì chỉ cần cho hàng nhập khẩu, không cần cho hàng xuất khẩu'], correctIndex: 1, explanation: 'C/O đúng theo quy tắc xuất xứ của FTA là điều kiện để được giảm/miễn thuế.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'IEI301',
    slug: 'iei301-import-export',
    title: 'Import Export',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IEI301.webp',
    shortDescription: 'The foreign trade operations cycle: market & partner research, contracts, Incoterms 2020, export-import documents, international payment (L/C/T/T), customs & logistics, and risk/dispute management. Bilingual, with examples & quizzes.|||Chu trình nghiệp vụ ngoại thương: nghiên cứu thị trường & đối tác, hợp đồng, Incoterms 2020, chứng từ XNK, thanh toán quốc tế (L/C/T/T), hải quan & logistics, quản trị rủi ro & tranh chấp. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>IEI301 — Import Export</strong> (kỳ 5) dạy toàn bộ <strong>chu trình nghiệp vụ xuất nhập khẩu</strong>. Từ <strong>tổng quan hoạt động XNK</strong> → <strong>nghiên cứu thị trường &amp; tìm đối tác</strong> → <strong>đàm phán &amp; hợp đồng ngoại thương</strong> → <strong>Incoterms 2020</strong> → <strong>bộ chứng từ XNK</strong> (invoice, packing list, B/L, C/O) → <strong>thanh toán quốc tế</strong> (L/C, T/T, nhờ thu) → <strong>thủ tục hải quan &amp; logistics</strong> → <strong>quản trị rủi ro, tranh chấp &amp; thực tiễn XNK Việt Nam</strong>. Bám giáo trình Weiss, Incoterms 2020, UCP 600 và luật Việt Nam, song ngữ, có ví dụ minh hoạ và quiz mỗi chương.',
    whatYouLearn: 'Chu trình XNK & các bên tham gia; nghiên cứu thị trường & thẩm định đối tác; điều khoản cốt lõi hợp đồng ngoại thương; 11 điều kiện Incoterms 2020 (nhóm E/F/C/D, điểm chuyển rủi ro & chi phí); bộ chứng từ (invoice, packing list, B/L, C/O); phương thức thanh toán quốc tế (T/T, nhờ thu D/P·D/A, L/C theo UCP 600); quy trình thông quan, mã HS, vai trò forwarder; rủi ro thương mại/tỷ giá/vận tải/chính trị và cách giải quyết tranh chấp (thương lượng, trọng tài, toà án); thực tiễn XNK Việt Nam & FTA.',
    requirements: 'Không yêu cầu kiến thức chuyên ngành trước. Nên có kiến thức nền về kinh doanh quốc tế hoặc kinh tế học cơ bản; nên đọc thêm giáo trình chính thức trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Weiss, Incoterms 2020, UCP 600, luật VN, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Xuất nhập khẩu là gì, chu trình XNK, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan hoạt động XNK|||Chapter 1 — Overview of import-export', description: 'Khái niệm, các bên tham gia, phương thức thâm nhập, khung pháp lý VN.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nghiên cứu thị trường & đối tác|||Chapter 2 — Market & partner research', description: 'Nghiên cứu thị trường, tìm đối tác, thẩm định đối tác.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đàm phán & hợp đồng ngoại thương|||Chapter 3 — Negotiation & foreign trade contracts', description: 'Chiến lược đàm phán, điều khoản cốt lõi của hợp đồng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Incoterms 2020 & điều kiện giao hàng|||Chapter 4 — Incoterms 2020', description: '11 điều kiện, nhóm E/F/C/D, chuyển rủi ro & chi phí.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Bộ chứng từ xuất nhập khẩu|||Chapter 5 — Export-import documents', description: 'Invoice, packing list, B/L, C/O và chứng từ bổ sung.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thanh toán quốc tế|||Chapter 6 — International payment', description: 'T/T, nhờ thu (D/P·D/A), thư tín dụng L/C theo UCP 600.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thủ tục hải quan & logistics|||Chapter 7 — Customs & logistics', description: 'Quy trình thông quan, mã HS, vai trò forwarder, phương thức vận tải.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Rủi ro, tranh chấp & thực tiễn XNK VN|||Chapter 8 — Risk, disputes & Vietnam practice', description: 'Loại rủi ro, công cụ giảm rủi ro, giải quyết tranh chấp, thực tiễn VN.', lessons: [c8, c8q] },
  ],
};
