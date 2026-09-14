/**
 * BFL301 — Banking and Finance Law (Luật Tài chính - Ngân hàng). Giáo trình
 * (trích dẫn, KHÔNG upload PDF): Luật Các tổ chức tín dụng 2024, Luật NHNN
 * 2010, Luật Chứng khoán 2019, Bộ luật Dân sự, Hogan/Cranston "Principles of
 * Banking Law". Song ngữ + quiz mỗi chương. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('bfl301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), văn bản luật gốc, sách tham khảo, cơ sở dữ liệu pháp luật chính thức, cơ quan quản lý, lộ trình tự học.',
  [[
    `<span class="eyebrow">BFL301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Banking and Finance Law — the legal framework around the State Bank, credit institutions, credit, deposits, payments and securities — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, official, legal sources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for BFL301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>⚖️ Primary legislation (cite the original text, not a summary)</h3>
<ul>
<li>Law on Credit Institutions 2024 (Luật Các tổ chức tín dụng, No. 32/2024/QH15) — effective 1 July 2024</li>
<li>Law on the State Bank of Vietnam 2010 (Luật Ngân hàng Nhà nước Việt Nam, No. 46/2010/QH12)</li>
<li>Law on Securities 2019 (Luật Chứng khoán, No. 54/2019/QH14)</li>
<li>Civil Code 2015 (Bộ luật Dân sự) — the base rules for contracts &amp; security interests</li>
<li>Anti-Money Laundering Law 2022 (Luật Phòng, chống rửa tiền, No. 14/2022/QH15)</li>
</ul>
<h3>📗 Reference book</h3>
<ul>
<li><em>Principles of Banking Law</em> — Hogan &amp; Cranston (comparative common-law banking law; use for concepts, not Vietnamese statute numbers)</li>
</ul>
<h3>🌐 Official legal databases &amp; regulators</h3>
<ul>
<li><a href="https://vbpl.vn/" target="_blank" rel="noopener">vbpl.vn</a> — Cơ sở dữ liệu quốc gia về pháp luật (Ministry of Justice's official legal database)</li>
<li><a href="https://thuvienphapluat.vn/" target="_blank" rel="noopener">thuvienphapluat.vn</a> — searchable consolidated legislation with English translations</li>
<li><a href="https://www.sbv.gov.vn/" target="_blank" rel="noopener">sbv.gov.vn</a> — State Bank of Vietnam (NHNN): monetary policy decisions, circulars</li>
<li><a href="https://www.ssc.gov.vn/" target="_blank" rel="noopener">ssc.gov.vn</a> — State Securities Commission (UBCKNN)</li>
<li><a href="https://en.wikipedia.org/wiki/Banking_law" target="_blank" rel="noopener">Wikipedia — Banking law (overview)</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — legal sources hierarchy, SBV's role &amp; monetary tools, what a credit institution is.</li>
<li><strong>Practice</strong> — read one real SBV circular or Law on Credit Institutions article end to end per week; note the article number.</li>
<li><strong>Go deeper</strong> — credit &amp; security law, deposit insurance, digital payments, securities market structure.</li>
<li><strong>Job-ready</strong> — connect a news story (a bank under special control, an IPO, an AML fine) to the exact article of law behind it.</li>
</ol></div>`,
    `<span class="eyebrow">BFL301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Luật Tài chính - Ngân hàng — khung pháp luật quanh Ngân hàng Nhà nước, tổ chức tín dụng, cấp tín dụng, tiền gửi, thanh toán và chứng khoán — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, chính thống.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của BFL301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>⚖️ Văn bản luật gốc (trích dẫn đúng văn bản, không qua bài tóm tắt)</h3>
<ul>
<li>Luật Các tổ chức tín dụng 2024 (số 32/2024/QH15) — hiệu lực từ 1/7/2024</li>
<li>Luật Ngân hàng Nhà nước Việt Nam 2010 (số 46/2010/QH12)</li>
<li>Luật Chứng khoán 2019 (số 54/2019/QH14)</li>
<li>Bộ luật Dân sự 2015 — nền tảng hợp đồng &amp; biện pháp bảo đảm</li>
<li>Luật Phòng, chống rửa tiền 2022 (số 14/2022/QH15)</li>
</ul>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Principles of Banking Law</em> — Hogan &amp; Cranston (luật ngân hàng so sánh theo common-law; dùng để hiểu khái niệm, không dùng số điều luật Việt Nam)</li>
</ul>
<h3>🌐 Cơ sở dữ liệu pháp luật &amp; cơ quan quản lý chính thức</h3>
<ul>
<li><a href="https://vbpl.vn/" target="_blank" rel="noopener">vbpl.vn</a> — Cơ sở dữ liệu quốc gia về pháp luật (Bộ Tư pháp)</li>
<li><a href="https://thuvienphapluat.vn/" target="_blank" rel="noopener">thuvienphapluat.vn</a> — tra văn bản hợp nhất, có bản dịch tiếng Anh</li>
<li><a href="https://www.sbv.gov.vn/" target="_blank" rel="noopener">sbv.gov.vn</a> — Ngân hàng Nhà nước Việt Nam: quyết định điều hành, thông tư</li>
<li><a href="https://www.ssc.gov.vn/" target="_blank" rel="noopener">ssc.gov.vn</a> — Ủy ban Chứng khoán Nhà nước</li>
<li><a href="https://en.wikipedia.org/wiki/Banking_law" target="_blank" rel="noopener">Wikipedia — Banking law (tổng quan)</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — thứ bậc nguồn luật, vai trò NHNN &amp; công cụ tiền tệ, tổ chức tín dụng là gì.</li>
<li><strong>Luyện tập</strong> — mỗi tuần đọc trọn một thông tư NHNN hoặc một điều của Luật Các TCTD, ghi lại số điều.</li>
<li><strong>Đào sâu</strong> — pháp luật cấp tín dụng &amp; bảo đảm, bảo hiểm tiền gửi, thanh toán số, cấu trúc thị trường chứng khoán.</li>
<li><strong>Sẵn sàng đi làm</strong> — nối một tin tức thật (ngân hàng bị kiểm soát đặc biệt, một IPO, một vụ phạt AML) với đúng điều luật đứng sau nó.</li>
</ol></div>`,
  ]]);

const intro = doc('bfl301-0-1-overview', 'Course overview: Banking and Finance Law|||Tổng quan: Luật Tài chính - Ngân hàng',
  'Vì sao ngành ngân hàng - tài chính bị điều chỉnh chặt; hai nhánh luật (ngân hàng & thị trường vốn); lộ trình 8 chương của môn.',
  [[
    `<span class="eyebrow">BFL301 · Lesson 0.1 · Overview</span>
<h2>Banking and Finance Law</h2>
<p class="lead">This course builds the legal map behind every headline about banks and markets in Vietnam: a bank put under <strong>special control</strong>, a company's <strong>IPO</strong>, a customer's deposit being <strong>insured</strong>, a fintech app needing a <strong>payment intermediary license</strong>. You will learn to trace each of those back to the exact law and article behind it.</p>
<h3>Two connected branches</h3>
<ul>
<li><strong>Banking law</strong> — the State Bank of Vietnam, credit institutions, credit and security, deposits and payments.</li>
<li><strong>Capital markets law</strong> — securities, public companies, market intermediaries and disclosure.</li>
</ul>
<p>Both sit under one theme: this is a <strong>regulated industry</strong>, because banks handle other people's money and markets need trust to function.</p>
<h3>Roadmap — 8 chapters</h3>
<p>Legal system overview → the State Bank &amp; monetary policy → credit institutions (licensing &amp; control) → credit &amp; secured lending → deposits &amp; deposit insurance → payments &amp; digital banking → securities market → violations, dispute resolution &amp; anti-money laundering. Bilingual, citing the real law each time.</p>`,
    `<span class="eyebrow">BFL301 · Bài 0.1 · Tổng quan</span>
<h2>Luật Tài chính - Ngân hàng</h2>
<p class="lead">Môn này dựng bản đồ pháp luật đứng sau mọi tin tức về ngân hàng và thị trường ở Việt Nam: một ngân hàng bị <strong>kiểm soát đặc biệt</strong>, một công ty <strong>IPO</strong>, tiền gửi của khách hàng được <strong>bảo hiểm</strong>, một app fintech cần <strong>giấy phép trung gian thanh toán</strong>. Bạn sẽ học cách nối từng việc đó với đúng luật và đúng điều.</p>
<h3>Hai nhánh gắn với nhau</h3>
<ul>
<li><strong>Luật ngân hàng</strong> — Ngân hàng Nhà nước, tổ chức tín dụng, cấp tín dụng &amp; bảo đảm, tiền gửi &amp; thanh toán.</li>
<li><strong>Luật thị trường vốn</strong> — chứng khoán, công ty đại chúng, chủ thể trung gian thị trường và công bố thông tin.</li>
</ul>
<p>Cả hai đứng dưới một chủ đề: đây là <strong>ngành bị quản lý chặt</strong>, vì ngân hàng cầm tiền của người khác và thị trường cần niềm tin để hoạt động.</p>
<h3>Lộ trình — 8 chương</h3>
<p>Tổng quan hệ thống pháp luật → Ngân hàng Nhà nước &amp; chính sách tiền tệ → tổ chức tín dụng (cấp phép &amp; kiểm soát) → cấp tín dụng &amp; bảo đảm tiền vay → huy động vốn &amp; bảo hiểm tiền gửi → thanh toán &amp; ngân hàng số → thị trường chứng khoán → xử lý vi phạm, giải quyết tranh chấp &amp; phòng chống rửa tiền. Song ngữ, luôn trích dẫn đúng luật.</p>`,
  ]]);

const c1 = doc('bfl301-1-1-tong-quan-he-thong', '1.1 — Overview of Vietnam banking & finance law|||1.1 — Tổng quan hệ thống pháp luật tài chính - ngân hàng',
  'Nguồn luật theo thứ bậc (Hiến pháp → Bộ luật Dân sự → luật chuyên ngành → nghị định → thông tư); ba cơ quan quản lý: NHNN, UBCKNN, Bộ Tài chính; vì sao ngành bị điều chỉnh chặt.',
  [[
    `<span class="eyebrow">BFL301 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of Vietnam&#39;s banking &amp; finance legal system</h2>
<h3>What this field covers</h3>
<p>Banking and finance law governs two connected worlds: <strong>banking law</strong> (the central bank, credit institutions, credit and payments) and <strong>capital markets law</strong> (securities, public companies, funds). Both sit inside a <strong>heavily regulated</strong> industry — a bank failure or a market crash can spread system-wide (<em>systemic risk</em>), and ordinary depositors and investors need protection.</p>
<h3>Sources of law, top to bottom</h3>
<pre><code>Constitution (Hien phap)
  -&gt; Civil Code (Bo luat Dan su) - base contract / property rules
  -&gt; Specialized laws:
       Law on Credit Institutions 2024 (Luat Cac TCTD)
       Law on the State Bank of Vietnam 2010 (Luat NHNN)
       Law on Securities 2019 (Luat Chung khoan)
       Anti-Money Laundering Law 2022
  -&gt; Decrees (Nghi dinh) - issued by the Government
  -&gt; Circulars (Thong tu) - issued by SBV / Ministry of Finance
</code></pre>
<h3>Who supervises what</h3>
<ul>
<li><strong>State Bank of Vietnam (SBV / NHNN)</strong> — banks, credit institutions, monetary policy.</li>
<li><strong>State Securities Commission (SSC / UBCKNN)</strong> — the securities market.</li>
<li><strong>Ministry of Finance</strong> — insurance, public finance; also oversees the SSC.</li>
</ul>
<div class="callout"><span class="badge">Why the rules are strict</span> A bank lends out depositors' money — it does not just hold it. The law's core job is keeping that promise safe: licensing, capital rules and supervision all trace back to protecting depositors and the payment system.</div>`,
    `<span class="eyebrow">BFL301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan hệ thống pháp luật tài chính - ngân hàng Việt Nam</h2>
<h3>Lĩnh vực này gồm gì</h3>
<p>Pháp luật tài chính - ngân hàng điều chỉnh hai thế giới gắn với nhau: <strong>luật ngân hàng</strong> (ngân hàng trung ương, tổ chức tín dụng, tín dụng và thanh toán) và <strong>luật thị trường vốn</strong> (chứng khoán, công ty đại chúng, quỹ). Cả hai nằm trong một ngành <strong>bị quản lý chặt</strong> — một ngân hàng đổ vỡ hay thị trường sụp có thể lan ra toàn hệ thống (<em>rủi ro hệ thống</em>), và người gửi tiền, nhà đầu tư bình thường cần được bảo vệ.</p>
<h3>Nguồn luật, từ trên xuống</h3>
<pre><code>Hien phap
  -&gt; Bo luat Dan su - nen hop dong / tai san
  -&gt; Luat chuyen nganh:
       Luat Cac to chuc tin dung 2024
       Luat Ngan hang Nha nuoc Viet Nam 2010
       Luat Chung khoan 2019
       Luat Phong, chong rua tien 2022
  -&gt; Nghi dinh - Chinh phu ban hanh
  -&gt; Thong tu - NHNN / Bo Tai chinh ban hanh
</code></pre>
<h3>Ai quản lý gì</h3>
<ul>
<li><strong>Ngân hàng Nhà nước Việt Nam (NHNN)</strong> — ngân hàng, tổ chức tín dụng, chính sách tiền tệ.</li>
<li><strong>Ủy ban Chứng khoán Nhà nước (UBCKNN)</strong> — thị trường chứng khoán.</li>
<li><strong>Bộ Tài chính</strong> — bảo hiểm, tài chính công; và giám sát cả UBCKNN.</li>
</ul>
<div class="callout"><span class="badge">Vì sao luật khắt khe</span> Ngân hàng cho vay lại tiền của người gửi — nó không chỉ giữ tiền. Việc gốc của luật là giữ an toàn cho lời hứa đó: cấp phép, quy định về vốn và thanh tra giám sát đều quy về bảo vệ người gửi tiền và hệ thống thanh toán.</div>`,
  ]]);

const c1q = quiz('bfl301-quiz-1', 'Quiz 1 — Tổng quan hệ thống pháp luật|||Quiz 1 — Legal system overview', [
  { id: 'q1', question: 'Trong hệ thống nguồn luật, văn bản nào do Chính phủ ban hành để hướng dẫn thi hành luật?', options: ['Thông tư', 'Nghị định', 'Hiến pháp', 'Bộ luật Dân sự'], correctIndex: 1, explanation: 'Nghị định do Chính phủ ban hành; Thông tư do bộ/NHNN ban hành, thấp hơn Nghị định.' },
  { id: 'q2', question: 'Cơ quan nào chịu trách nhiệm quản lý nhà nước về tiền tệ và hoạt động ngân hàng?', options: ['Ủy ban Chứng khoán Nhà nước', 'Bộ Tài chính', 'Ngân hàng Nhà nước Việt Nam', 'Tòa án nhân dân'], correctIndex: 2, explanation: 'NHNN quản lý tiền tệ, ngân hàng và là ngân hàng trung ương của Việt Nam.' },
  { id: 'q3', question: 'Vì sao ngành ngân hàng - tài chính bị pháp luật điều chỉnh chặt hơn nhiều ngành khác?', options: ['Vì ngân hàng lãi nhiều nhất', 'Vì rủi ro có thể lan ra toàn hệ thống và ảnh hưởng tiền của người gửi', 'Vì luật ngân hàng dễ soạn hơn', 'Vì không liên quan Bộ luật Dân sự'], correctIndex: 1, explanation: 'Ngân hàng cho vay lại tiền người gửi; đổ vỡ một ngân hàng có thể kéo theo rủi ro hệ thống, nên bị giám sát chặt.' },
]);

const c2 = doc('bfl301-2-1-nhnn-chinh-sach-tien-te', '2.1 — SBV & monetary management|||2.1 — Ngân hàng Nhà nước & quản lý tiền tệ',
  'Vị trí pháp lý & chức năng của NHNN theo Luật NHNN 2010: phát hành tiền, chính sách tiền tệ quốc gia, quản lý ngoại hối, người cho vay cuối cùng, thanh tra giám sát; công cụ chính sách tiền tệ.',
  [[
    `<span class="eyebrow">BFL301 · Chapter 2 · Lesson 2.1</span>
<h2>The State Bank of Vietnam &amp; monetary management</h2>
<h3>Legal status</h3>
<p>Under the <strong>Law on the State Bank of Vietnam 2010</strong>, the SBV (NHNN) is both a ministerial-level government agency and Vietnam's <strong>central bank</strong>. It performs state management over currency and banking activity, and it manages the currency itself.</p>
<h3>Core functions</h3>
<ul>
<li><strong>Sole issuer of currency</strong> — the SBV alone issues Vietnamese đồng.</li>
<li><strong>National monetary policy</strong> — sets policy interest rates, the exchange-rate mechanism, and the required reserve ratio for credit institutions.</li>
<li><strong>Foreign-exchange management</strong> — regulates the forex market and Vietnam's foreign reserves.</li>
<li><strong>Bank of last resort</strong> — lends to credit institutions facing liquidity risk, to stop one bank's trouble spreading system-wide.</li>
<li><strong>Banking supervision</strong> — licenses, inspects and sanctions credit institutions.</li>
</ul>
<h3>Monetary policy tools</h3>
<pre><code>- Policy interest rate (lai suat dieu hanh)
- Required reserve ratio (du tru bat buoc)
- Refinancing (tai cap von) - SBV lends to credit institutions
- Open market operations - OMO (nghiep vu thi truong mo)
- Central exchange rate (ty gia trung tam)
</code></pre>
<div class="callout"><span class="badge">Why a "last resort" lender matters</span> If depositors fear one bank can't pay, they may rush to withdraw from others too (a bank run). The SBV's ability to lend emergency liquidity is what keeps a single bank's problem from becoming everyone's problem.</div>`,
    `<span class="eyebrow">BFL301 · Chương 2 · Bài 2.1</span>
<h2>Ngân hàng Nhà nước &amp; quản lý tiền tệ</h2>
<h3>Vị trí pháp lý</h3>
<p>Theo <strong>Luật Ngân hàng Nhà nước Việt Nam 2010</strong>, NHNN vừa là cơ quan của Chính phủ (ngang bộ) vừa là <strong>ngân hàng trung ương</strong> của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. NHNN thực hiện chức năng quản lý nhà nước về tiền tệ, hoạt động ngân hàng, đồng thời tự mình thực hiện chức năng ngân hàng trung ương.</p>
<h3>Chức năng cốt lõi</h3>
<ul>
<li><strong>Độc quyền phát hành tiền</strong> — chỉ NHNN được phát hành tiền Việt Nam đồng.</li>
<li><strong>Chính sách tiền tệ quốc gia</strong> — đặt lãi suất điều hành, cơ chế điều hành tỷ giá, tỷ lệ dự trữ bắt buộc với tổ chức tín dụng.</li>
<li><strong>Quản lý ngoại hối</strong> — điều hành thị trường ngoại tệ và dự trữ ngoại hối quốc gia.</li>
<li><strong>Người cho vay cuối cùng</strong> — cho tổ chức tín dụng vay khi gặp rủi ro thanh khoản, để chặn khó khăn của một ngân hàng lan ra cả hệ thống.</li>
<li><strong>Thanh tra, giám sát ngân hàng</strong> — cấp phép, thanh tra và xử lý tổ chức tín dụng.</li>
</ul>
<h3>Công cụ chính sách tiền tệ</h3>
<pre><code>- Lai suat dieu hanh
- Ty le du tru bat buoc
- Tai cap von - NHNN cho to chuc tin dung vay
- Nghiep vu thi truong mo (OMO)
- Ty gia trung tam
</code></pre>
<div class="callout"><span class="badge">Vì sao "người cho vay cuối cùng" quan trọng</span> Nếu người gửi tiền lo một ngân hàng không trả được, họ có thể đổ xô rút tiền ở cả những ngân hàng khác (bank run). Khả năng NHNN cho vay thanh khoản khẩn cấp chính là thứ ngăn khó khăn của một ngân hàng biến thành khó khăn của tất cả.</div>`,
  ]]);

const c2q = quiz('bfl301-quiz-2', 'Quiz 2 — Ngân hàng Nhà nước & tiền tệ|||Quiz 2 — SBV & monetary policy', [
  { id: 'q1', question: 'NHNN có vị trí pháp lý như thế nào theo Luật NHNN 2010?', options: ['Doanh nghiệp nhà nước độc lập', 'Cơ quan của Chính phủ đồng thời là ngân hàng trung ương', 'Chỉ là ngân hàng thương mại lớn nhất', 'Cơ quan trực thuộc Bộ Tài chính'], correctIndex: 1, explanation: 'NHNN là cơ quan ngang bộ của Chính phủ và đồng thời là ngân hàng trung ương của Việt Nam.' },
  { id: 'q2', question: 'Công cụ nào KHÔNG phải là công cụ chính sách tiền tệ của NHNN?', options: ['Tỷ lệ dự trữ bắt buộc', 'Nghiệp vụ thị trường mở (OMO)', 'Lãi suất điều hành', 'Thuế thu nhập doanh nghiệp'], correctIndex: 3, explanation: 'Thuế thu nhập doanh nghiệp thuộc chính sách tài khóa, không phải công cụ tiền tệ của NHNN.' },
  { id: 'q3', question: 'Vai trò "người cho vay cuối cùng" của NHNN nhằm mục đích chính gì?', options: ['Tăng lợi nhuận cho NHNN', 'Ngăn rủi ro thanh khoản của một tổ chức tín dụng lan ra toàn hệ thống', 'Thay thế vai trò của Bộ Tài chính', 'Phát hành cổ phần cho ngân hàng thương mại'], correctIndex: 1, explanation: 'Cho vay khẩn cấp giúp chặn hiệu ứng lan truyền (bank run) khi một tổ chức tín dụng gặp khó khăn thanh khoản.' },
]);

const c3 = doc('bfl301-3-1-to-chuc-tin-dung', '3.1 — Credit institutions: licensing, operation, control|||3.1 — Tổ chức tín dụng: thành lập, hoạt động, kiểm soát',
  'Luật Các TCTD 2024: định nghĩa & loại hình TCTD, điều kiện cấp phép, giới hạn sở hữu cổ phần & giới hạn cấp tín dụng cho một khách hàng, cơ chế can thiệp sớm & kiểm soát đặc biệt.',
  [[
    `<span class="eyebrow">BFL301 · Chapter 3 · Lesson 3.1</span>
<h2>Credit institutions: licensing, operation &amp; control</h2>
<h3>What counts as a credit institution</h3>
<p>Under the <strong>Law on Credit Institutions 2024</strong> (effective 1 July 2024), a credit institution is an enterprise doing one or more banking operations. The law recognizes several types:</p>
<pre><code>Credit institutions
  |- Banks (commercial, policy, cooperative)
  |- Non-bank credit institutions (finance companies, finance leasing companies)
  |- Microfinance institutions
  |- People's credit funds (cooperative-style, local)
</code></pre>
<h3>Licensing conditions</h3>
<p>To be granted an operating license, a founder must show: sufficient <strong>legal capital</strong>, shareholders/members meeting eligibility conditions, and managers/executives meeting professional and integrity standards. A license can later be revoked for serious violations.</p>
<h3>Ownership &amp; credit-concentration limits</h3>
<p>To stop one shareholder or one borrower from controlling too much risk, the law caps: the <strong>percentage of shares</strong> a shareholder (and related persons) may hold, and the amount of credit a bank may extend to a single customer or group of related customers, set as a percentage of the bank's own capital. The 2024 law <strong>tightened</strong> the single-customer credit limit compared to the previous law, phased in over several years.</p>
<h3>Early intervention &amp; special control — the 2024 law's key addition</h3>
<p>When a credit institution shows signs of weakness, the SBV can apply <strong>early intervention</strong> (a recovery plan under supervision) before things worsen. If that fails, the institution is placed under <strong>special control</strong> — SBV-appointed management takes over operations to protect depositors and the system.</p>
<div class="callout"><span class="badge">The logic</span> Licensing keeps weak players out; ownership/credit limits keep concentrated risk from building up inside; early intervention catches trouble before it becomes a crisis.</div>`,
    `<span class="eyebrow">BFL301 · Chương 3 · Bài 3.1</span>
<h2>Tổ chức tín dụng: thành lập, hoạt động &amp; kiểm soát</h2>
<h3>Thế nào là tổ chức tín dụng</h3>
<p>Theo <strong>Luật Các tổ chức tín dụng 2024</strong> (hiệu lực từ 1/7/2024), tổ chức tín dụng (TCTD) là doanh nghiệp thực hiện một hoặc một số hoạt động ngân hàng. Luật ghi nhận nhiều loại hình:</p>
<pre><code>To chuc tin dung
  |- Ngan hang (thuong mai, chinh sach, hop tac xa)
  |- To chuc tin dung phi ngan hang (cong ty tai chinh, cong ty cho thue tai chinh)
  |- To chuc tai chinh vi mo
  |- Quy tin dung nhan dan (mo hinh hop tac xa, dia phuong)
</code></pre>
<h3>Điều kiện cấp phép</h3>
<p>Để được cấp Giấy phép thành lập &amp; hoạt động, người thành lập phải chứng minh: có đủ <strong>vốn pháp định</strong>, cổ đông/thành viên góp vốn đáp ứng điều kiện, người quản lý &amp; điều hành đủ tiêu chuẩn chuyên môn và đạo đức. Giấy phép có thể bị thu hồi sau này nếu vi phạm nghiêm trọng.</p>
<h3>Giới hạn sở hữu cổ phần &amp; giới hạn cấp tín dụng</h3>
<p>Để tránh một cổ đông hay một khách hàng vay ôm quá nhiều rủi ro, luật đặt trần: <strong>tỷ lệ sở hữu cổ phần</strong> của một cổ đông (và người liên quan), và mức cấp tín dụng tối đa cho một khách hàng hoặc một nhóm khách hàng liên quan, tính theo phần trăm vốn tự có của ngân hàng. Luật 2024 <strong>siết lại</strong> giới hạn cấp tín dụng cho một khách hàng so với luật cũ, áp dụng theo lộ trình nhiều năm.</p>
<h3>Can thiệp sớm &amp; kiểm soát đặc biệt — điểm mới quan trọng của Luật 2024</h3>
<p>Khi một TCTD có dấu hiệu yếu kém, NHNN có thể áp dụng <strong>can thiệp sớm</strong> (phương án phục hồi dưới sự giám sát) trước khi xấu thêm. Nếu không cải thiện, TCTD bị đặt vào <strong>kiểm soát đặc biệt</strong> — NHNN chỉ định người quản lý, điều hành để tiếp quản hoạt động, bảo vệ người gửi tiền và cả hệ thống.</p>
<div class="callout"><span class="badge">Logic của cơ chế</span> Cấp phép ngăn người yếu kém vào ngành; giới hạn sở hữu/tín dụng ngăn rủi ro dồn cục bên trong; can thiệp sớm bắt được sự cố trước khi thành khủng hoảng.</div>`,
  ]]);

const c3q = quiz('bfl301-quiz-3', 'Quiz 3 — Tổ chức tín dụng|||Quiz 3 — Credit institutions', [
  { id: 'q1', question: 'Điều kiện nào KHÔNG phải điều kiện cấp Giấy phép cho tổ chức tín dụng?', options: ['Vốn pháp định đủ mức quy định', 'Người quản lý, điều hành đủ tiêu chuẩn', 'Cổ đông/thành viên góp vốn đáp ứng điều kiện', 'Doanh nghiệp phải niêm yết trên sàn chứng khoán'], correctIndex: 3, explanation: 'Niêm yết không phải điều kiện cấp phép TCTD; đó là điều kiện của công ty đại chúng theo Luật Chứng khoán.' },
  { id: 'q2', question: 'Luật Các TCTD 2024 có điểm mới nào về cấp tín dụng cho một khách hàng?', options: ['Bỏ hoàn toàn giới hạn cấp tín dụng', 'Siết chặt hơn (giảm) giới hạn theo lộ trình', 'Tăng giới hạn lên không hạn chế', 'Chỉ áp dụng cho quỹ tín dụng nhân dân'], correctIndex: 1, explanation: 'Luật 2024 giảm/siết lại giới hạn cấp tín dụng cho một khách hàng/nhóm khách hàng liên quan, áp dụng theo lộ trình.' },
  { id: 'q3', question: '"Kiểm soát đặc biệt" được áp dụng khi nào?', options: ['Khi TCTD muốn tăng vốn điều lệ', 'Khi can thiệp sớm không cải thiện được tình trạng yếu kém của TCTD', 'Khi TCTD mới thành lập', 'Khi TCTD đổi tên thương hiệu'], correctIndex: 1, explanation: 'Kiểm soát đặc biệt là bước sau can thiệp sớm, khi TCTD vẫn yếu kém, NHNN tiếp quản để bảo vệ hệ thống.' },
]);

const c4 = doc('bfl301-4-1-cap-tin-dung-bao-dam', '4.1 — Credit extension & security law|||4.1 — Pháp luật về cấp tín dụng & bảo đảm tiền vay',
  'Các hình thức cấp tín dụng (cho vay, bảo lãnh, chiết khấu, bao thanh toán, cho thuê tài chính); phân loại nhóm nợ & trích lập dự phòng; biện pháp bảo đảm theo Bộ luật Dân sự & đăng ký giao dịch bảo đảm.',
  [[
    `<span class="eyebrow">BFL301 · Chapter 4 · Lesson 4.1</span>
<h2>Credit extension &amp; security law</h2>
<h3>Forms of credit extension</h3>
<p>"Credit" is broader than a simple loan. It includes <strong>lending</strong>, <strong>guarantees</strong> (bank guarantee), <strong>discounting</strong> of negotiable instruments, <strong>factoring</strong> (bao thanh toán — buying receivables), issuing <strong>credit cards</strong>, and <strong>financial leasing</strong>.</p>
<h3>Credit discipline: classification &amp; provisioning</h3>
<p>Before lending, a credit institution must assess the borrower's ability to repay. Once a loan is outstanding, SBV circulars require banks to classify debts into <strong>risk groups (nợ nhóm 1–5)</strong> by days overdue and repayment capacity, then set aside <strong>loan-loss provisions</strong> against each group — the accounting mirror of credit risk.</p>
<h3>Security interests under the Civil Code</h3>
<p>A lender rarely lends unsecured. The Civil Code lists the security devices:</p>
<ul>
<li><strong>Mortgage (thế chấp)</strong> — the asset (often real estate) stays with the borrower but is pledged.</li>
<li><strong>Pledge (cầm cố)</strong> — the asset is handed over to the secured party.</li>
<li><strong>Guarantee (bảo lãnh)</strong> — a third party promises to pay if the borrower doesn't.</li>
<li><strong>Deposit / earnest money (đặt cọc, ký cược)</strong> — a sum paid to secure performance.</li>
<li><strong>Unsecured trust lending (tín chấp)</strong> — based on the borrower's reputation, no collateral.</li>
</ul>
<p>A security interest generally needs to be <strong>registered</strong> to have priority (đối kháng) against third parties — without registration, a later secured or attaching creditor can beat an earlier unregistered one.</p>
<pre><code>Default happens
  -&gt; Lender enforces the security interest
  -&gt; Sells/disposes of the collateral (agreed method, or auction)
  -&gt; Proceeds pay the debt; surplus returns to the borrower
</code></pre>
<div class="callout"><span class="badge">Registration is not paperwork — it's priority</span> Two creditors can claim the same collateral. Registration date decides who gets paid first when it's sold.</div>`,
    `<span class="eyebrow">BFL301 · Chương 4 · Bài 4.1</span>
<h2>Pháp luật về cấp tín dụng &amp; bảo đảm tiền vay</h2>
<h3>Các hình thức cấp tín dụng</h3>
<p>"Cấp tín dụng" rộng hơn cho vay đơn thuần. Nó gồm <strong>cho vay</strong>, <strong>bảo lãnh ngân hàng</strong>, <strong>chiết khấu</strong> công cụ chuyển nhượng, <strong>bao thanh toán</strong> (mua lại khoản phải thu), phát hành <strong>thẻ tín dụng</strong>, và <strong>cho thuê tài chính</strong>.</p>
<h3>Kỷ luật tín dụng: phân loại nợ &amp; trích lập dự phòng</h3>
<p>Trước khi cho vay, TCTD phải thẩm định khả năng trả nợ của khách hàng. Khi khoản vay đang tồn tại, thông tư NHNN yêu cầu ngân hàng phân loại nợ thành các <strong>nhóm nợ (nhóm 1–5)</strong> theo số ngày quá hạn và khả năng trả nợ, rồi trích lập <strong>dự phòng rủi ro</strong> tương ứng mỗi nhóm — hình ảnh kế toán của rủi ro tín dụng.</p>
<h3>Biện pháp bảo đảm theo Bộ luật Dân sự</h3>
<p>Bên cho vay hiếm khi cho vay không có bảo đảm. Bộ luật Dân sự liệt kê các biện pháp:</p>
<ul>
<li><strong>Thế chấp</strong> — tài sản (thường là bất động sản) vẫn do bên vay giữ nhưng bị ràng buộc.</li>
<li><strong>Cầm cố</strong> — tài sản được giao cho bên nhận bảo đảm.</li>
<li><strong>Bảo lãnh</strong> — bên thứ ba hứa trả nếu bên vay không trả được.</li>
<li><strong>Đặt cọc, ký cược</strong> — một khoản tiền giao trước để bảo đảm thực hiện nghĩa vụ.</li>
<li><strong>Tín chấp</strong> — dựa vào uy tín của bên vay, không cần tài sản bảo đảm.</li>
</ul>
<p>Biện pháp bảo đảm thường phải được <strong>đăng ký</strong> để có hiệu lực đối kháng với người thứ ba — không đăng ký, một chủ nợ có bảo đảm hoặc đang xử lý tài sản sau đó có thể vượt lên trước một chủ nợ chưa đăng ký.</p>
<pre><code>Ben vay vi pham nghia vu
  -&gt; Ben cho vay xu ly tai san bao dam
  -&gt; Ban/xu ly tai san (theo thoa thuan hoac dau gia)
  -&gt; Tien thu duoc tra no; phan con lai tra lai cho ben vay
</code></pre>
<div class="callout"><span class="badge">Đăng ký không phải thủ tục hình thức — đó là thứ tự ưu tiên</span> Hai chủ nợ có thể cùng nhắm vào một tài sản. Ngày đăng ký quyết định ai được trả trước khi tài sản đó được bán.</div>`,
  ]]);

const c4q = quiz('bfl301-quiz-4', 'Quiz 4 — Cấp tín dụng & bảo đảm|||Quiz 4 — Credit & security', [
  { id: 'q1', question: 'Hình thức nào sau đây thuộc "cấp tín dụng" ngoài cho vay thông thường?', options: ['Bao thanh toán (factoring)', 'Ký hợp đồng lao động', 'Phát hành cổ phiếu', 'Đăng ký kinh doanh'], correctIndex: 0, explanation: 'Bao thanh toán, bảo lãnh, chiết khấu, cho thuê tài chính đều là hình thức cấp tín dụng.' },
  { id: 'q2', question: 'Sự khác biệt chính giữa thế chấp và cầm cố là gì?', options: ['Thế chấp không cần văn bản, cầm cố cần', 'Ở thế chấp tài sản vẫn do bên vay giữ; ở cầm cố tài sản giao cho bên nhận bảo đảm', 'Cầm cố chỉ áp dụng cho bất động sản', 'Không có khác biệt'], correctIndex: 1, explanation: 'Điểm khác cốt lõi là ai đang giữ tài sản bảo đảm trong thời gian bảo đảm còn hiệu lực.' },
  { id: 'q3', question: 'Vì sao đăng ký biện pháp bảo đảm lại quan trọng?', options: ['Để tính lãi suất vay', 'Để có hiệu lực đối kháng, quyết định thứ tự ưu tiên thanh toán giữa các chủ nợ', 'Để miễn thuế cho khoản vay', 'Để đổi loại tài sản bảo đảm'], correctIndex: 1, explanation: 'Đăng ký xác định ai được ưu tiên trả nợ trước khi tài sản bảo đảm bị xử lý, nhất là khi có nhiều chủ nợ.' },
]);

const c5 = doc('bfl301-5-1-huy-dong-von-tien-gui', '5.1 — Fund mobilization & deposit law|||5.1 — Pháp luật về huy động vốn & tiền gửi',
  'Các hình thức huy động vốn (nhận tiền gửi, phát hành giấy tờ có giá, vay liên ngân hàng/NHNN); bảo hiểm tiền gửi & Luật Bảo hiểm tiền gửi 2012; quyền của người gửi tiền, trần lãi suất huy động.',
  [[
    `<span class="eyebrow">BFL301 · Chapter 5 · Lesson 5.1</span>
<h2>Fund mobilization &amp; deposit law</h2>
<h3>How banks raise money</h3>
<ul>
<li><strong>Deposits</strong> — demand deposits (no fixed term) and time deposits (fixed term), the main funding source for most banks.</li>
<li><strong>Negotiable instruments</strong> — certificates of deposit, bonds issued by the bank itself.</li>
<li><strong>Interbank borrowing &amp; borrowing from the SBV</strong> — short-term liquidity between banks, or refinancing from the central bank.</li>
</ul>
<h3>Deposit insurance</h3>
<p>The <strong>Law on Deposit Insurance 2012</strong> protects individual depositors if a bank fails: the <strong>Deposit Insurance of Vietnam (DIV)</strong> pays out up to a maximum coverage amount per depositor per institution — a cap set and periodically updated by SBV decision, not the full deposit amount for large balances. Deposit insurance premiums are compulsory for banks taking individual deposits.</p>
<h3>Depositor rights &amp; deposit-rate ceilings</h3>
<p>Depositors have the right to withdraw under agreed terms and to receive interest. To keep competition for deposits from becoming destabilizing, the SBV periodically sets a <strong>ceiling on short-term/demand deposit rates</strong> — a tool that shifts with monetary policy, not a fixed number in the statute itself.</p>
<pre><code>Deposit -&gt; Bank                (funding)
Bank fails -&gt; DIV pays out     (up to the coverage cap, per depositor per bank)
Amount above the cap -&gt; ranks as an unsecured claim in liquidation
</code></pre>
<div class="callout"><span class="badge">The cap matters</span> Deposit insurance protects confidence in the system, not every individual's full balance — that's why the cap, and knowing it, matters for anyone with savings above it.</div>`,
    `<span class="eyebrow">BFL301 · Chương 5 · Bài 5.1</span>
<h2>Pháp luật về huy động vốn &amp; tiền gửi</h2>
<h3>Ngân hàng huy động vốn bằng cách nào</h3>
<ul>
<li><strong>Nhận tiền gửi</strong> — tiền gửi không kỳ hạn và có kỳ hạn, nguồn vốn chính của hầu hết ngân hàng.</li>
<li><strong>Phát hành giấy tờ có giá</strong> — chứng chỉ tiền gửi, trái phiếu do chính ngân hàng phát hành.</li>
<li><strong>Vay liên ngân hàng &amp; vay NHNN</strong> — thanh khoản ngắn hạn giữa các ngân hàng, hoặc tái cấp vốn từ ngân hàng trung ương.</li>
</ul>
<h3>Bảo hiểm tiền gửi</h3>
<p><strong>Luật Bảo hiểm tiền gửi 2012</strong> bảo vệ người gửi tiền cá nhân nếu ngân hàng đổ vỡ: <strong>Bảo hiểm tiền gửi Việt Nam (DIV)</strong> chi trả tối đa một hạn mức cho mỗi người gửi tại mỗi tổ chức — hạn mức này do NHNN quyết định và cập nhật theo thời kỳ, không phải là chi trả toàn bộ số dư nếu số dư lớn hơn hạn mức. Phí bảo hiểm tiền gửi là bắt buộc với ngân hàng nhận tiền gửi cá nhân.</p>
<h3>Quyền người gửi tiền &amp; trần lãi suất huy động</h3>
<p>Người gửi tiền có quyền rút theo điều kiện đã thỏa thuận và nhận lãi. Để cạnh tranh huy động không gây bất ổn, NHNN theo từng thời kỳ đặt <strong>trần lãi suất tiền gửi không kỳ hạn/ngắn hạn</strong> — một công cụ thay đổi theo chính sách tiền tệ, không phải một con số cố định trong luật.</p>
<pre><code>Gui tien -&gt; Ngan hang                (nguon von)
Ngan hang do vo -&gt; DIV chi tra        (toi da theo han muc, moi nguoi/moi TCTD)
Phan vuot han muc -&gt; xep hang nhu mot khoan no khong bao dam khi thanh ly
</code></pre>
<div class="callout"><span class="badge">Vì sao hạn mức quan trọng</span> Bảo hiểm tiền gửi bảo vệ niềm tin vào hệ thống, không phải toàn bộ số dư của từng người — đó là lý do hạn mức, và việc biết nó, quan trọng với ai có tiền gửi vượt mức.</div>`,
  ]]);

const c5q = quiz('bfl301-quiz-5', 'Quiz 5 — Huy động vốn & tiền gửi|||Quiz 5 — Fund mobilization & deposits', [
  { id: 'q1', question: 'Nguồn vốn nào KHÔNG phải hình thức huy động vốn của ngân hàng?', options: ['Nhận tiền gửi', 'Phát hành chứng chỉ tiền gửi', 'Vay liên ngân hàng', 'Bán tài sản cố định của ngân hàng'], correctIndex: 3, explanation: 'Bán tài sản cố định không phải hình thức huy động vốn thường xuyên; ba hình thức còn lại là nguồn vốn chính.' },
  { id: 'q2', question: 'Bảo hiểm tiền gửi theo Luật Bảo hiểm tiền gửi 2012 chi trả như thế nào nếu ngân hàng đổ vỡ?', options: ['Chi trả toàn bộ số dư không giới hạn', 'Chi trả tối đa theo một hạn mức do NHNN quy định, phần vượt xếp như nợ không bảo đảm', 'Không chi trả gì cho người gửi cá nhân', 'Chỉ áp dụng cho doanh nghiệp gửi tiền'], correctIndex: 1, explanation: 'DIV chi trả tối đa theo hạn mức; phần tiền gửi vượt hạn mức được xử lý như một khoản nợ không bảo đảm khi thanh lý.' },
  { id: 'q3', question: 'Trần lãi suất tiền gửi không kỳ hạn/ngắn hạn do cơ quan nào quy định theo từng thời kỳ?', options: ['Bộ Tài chính', 'Ủy ban Chứng khoán Nhà nước', 'Ngân hàng Nhà nước Việt Nam', 'Tòa án nhân dân tối cao'], correctIndex: 2, explanation: 'NHNN dùng trần lãi suất huy động ngắn hạn như một công cụ điều hành chính sách tiền tệ.' },
]);

const c6 = doc('bfl301-6-1-thanh-toan-ngan-hang-so', '6.1 — Payments & digital banking law|||6.1 — Pháp luật thanh toán & dịch vụ ngân hàng số',
  'Thanh toán không dùng tiền mặt; tài khoản thanh toán, séc, ủy nhiệm chi; trung gian thanh toán & ví điện tử cần giấy phép NHNN; eKYC, Mobile Money; cơ chế thử nghiệm sandbox cho Fintech.',
  [[
    `<span class="eyebrow">BFL301 · Chapter 6 · Lesson 6.1</span>
<h2>Payments &amp; digital banking law</h2>
<h3>Non-cash payment instruments</h3>
<p>Government regulations on <strong>non-cash payment</strong> govern payment accounts, cheques (séc), and payment orders (ủy nhiệm chi/lệnh chi) — the paper-era rails that digital payments now sit on top of.</p>
<h3>Payment intermediaries &amp; e-wallets need a license</h3>
<p>An <strong>e-wallet</strong> or a payment app is legally a <strong>payment intermediary service</strong> — it needs an SBV-issued license before it can hold and move customer money, exactly like the GIF/media-key lesson elsewhere in this platform's history: a third-party financial service cannot legally operate on trust alone. <strong>Mobile Money</strong> (payments via a telecom account, no bank account needed) is a separate, narrower license category aimed at financial inclusion.</p>
<h3>Digital onboarding: eKYC &amp; agent banking</h3>
<p><strong>eKYC</strong> (electronic Know-Your-Customer) lets a bank open certain accounts remotely, under conditions set by the SBV (identity verification technology, transaction limits during a trial period). <strong>Agent banking</strong> lets a licensed bank offer basic services through a non-bank agent (e.g. a retail store) to reach areas without a branch.</p>
<h3>Regulatory sandbox for fintech</h3>
<p>Because fintech innovation often runs ahead of settled law, the Government has set up a <strong>controlled testing mechanism (sandbox)</strong> letting selected fintech models (e.g. peer-to-peer lending platforms, credit scoring) operate for a limited time under close SBV supervision, with defined scope and safeguards for users, before any permanent rule is written.</p>
<div class="callout"><span class="badge">A recurring pattern</span> Whenever a technology touches customer money directly, the law's answer is the same: license it, cap it, and supervise it — the specifics change, the pattern doesn't.</div>`,
    `<span class="eyebrow">BFL301 · Chương 6 · Bài 6.1</span>
<h2>Pháp luật thanh toán &amp; dịch vụ ngân hàng số</h2>
<h3>Phương tiện thanh toán không dùng tiền mặt</h3>
<p>Quy định của Chính phủ về <strong>thanh toán không dùng tiền mặt</strong> điều chỉnh tài khoản thanh toán, séc và lệnh chi/ủy nhiệm chi — hạ tầng thời "giấy" mà thanh toán số ngày nay vẫn đứng trên đó.</p>
<h3>Trung gian thanh toán &amp; ví điện tử cần giấy phép</h3>
<p>Một <strong>ví điện tử</strong> hay app thanh toán, về pháp lý, là <strong>dịch vụ trung gian thanh toán</strong> — cần được NHNN cấp phép trước khi được giữ và chuyển tiền của khách hàng. <strong>Mobile Money</strong> (thanh toán qua tài khoản viễn thông, không cần tài khoản ngân hàng) là một loại giấy phép riêng, hẹp hơn, nhằm phổ cập tài chính.</p>
<h3>Định danh số: eKYC &amp; ngân hàng đại lý</h3>
<p><strong>eKYC</strong> (định danh khách hàng điện tử) cho phép ngân hàng mở một số loại tài khoản từ xa, theo điều kiện NHNN quy định (công nghệ xác thực danh tính, hạn mức giao dịch trong giai đoạn thử nghiệm). <strong>Ngân hàng đại lý (agent banking)</strong> cho phép ngân hàng được cấp phép cung cấp dịch vụ cơ bản qua một đại lý không phải ngân hàng (vd cửa hàng bán lẻ) để tới được những nơi chưa có chi nhánh.</p>
<h3>Cơ chế thử nghiệm có kiểm soát (sandbox) cho Fintech</h3>
<p>Vì đổi mới fintech thường đi trước pháp luật ổn định, Chính phủ đã lập <strong>cơ chế thử nghiệm có kiểm soát (sandbox)</strong> cho phép một số mô hình fintech được chọn (vd nền tảng cho vay ngang hàng, chấm điểm tín dụng) hoạt động trong thời gian giới hạn dưới giám sát chặt của NHNN, với phạm vi và biện pháp bảo vệ người dùng được xác định trước, trước khi có quy định chính thức lâu dài.</p>
<div class="callout"><span class="badge">Một khuôn lặp lại</span> Bất cứ khi nào công nghệ chạm trực tiếp vào tiền của khách hàng, câu trả lời của luật luôn giống nhau: cấp phép, đặt hạn mức, và giám sát — chi tiết đổi, khuôn không đổi.</div>`,
  ]]);

const c6q = quiz('bfl301-quiz-6', 'Quiz 6 — Thanh toán & ngân hàng số|||Quiz 6 — Payments & digital banking', [
  { id: 'q1', question: 'Một ví điện tử muốn giữ và chuyển tiền của khách hàng thì cần gì theo pháp luật Việt Nam?', options: ['Không cần gì, chỉ cần đăng ký kinh doanh thông thường', 'Giấy phép trung gian thanh toán do NHNN cấp', 'Chứng nhận ISO quốc tế', 'Giấy phép của Bộ Thông tin và Truyền thông duy nhất'], correctIndex: 1, explanation: 'Ví điện tử là dịch vụ trung gian thanh toán, phải được NHNN cấp phép mới được hoạt động hợp pháp.' },
  { id: 'q2', question: 'Mobile Money khác gì so với ví điện tử ngân hàng thông thường?', options: ['Mobile Money cho phép thanh toán qua tài khoản viễn thông, không cần tài khoản ngân hàng', 'Mobile Money chỉ dùng cho doanh nghiệp lớn', 'Mobile Money không cần giấy phép', 'Mobile Money là tên gọi khác của thẻ tín dụng'], correctIndex: 0, explanation: 'Mobile Money gắn với tài khoản viễn thông, hướng tới phổ cập tài chính ở nơi ít tiếp cận ngân hàng.' },
  { id: 'q3', question: 'Cơ chế sandbox trong lĩnh vực fintech có mục đích chính là gì?', options: ['Cấm hoàn toàn các mô hình fintech mới', 'Cho fintech thử nghiệm có kiểm soát, giới hạn thời gian và phạm vi, dưới giám sát NHNN', 'Miễn toàn bộ nghĩa vụ pháp lý cho fintech vĩnh viễn', 'Thay thế hoàn toàn Luật Các TCTD'], correctIndex: 1, explanation: 'Sandbox cho phép thử nghiệm mô hình mới trong khung kiểm soát, trước khi có quy định chính thức lâu dài.' },
]);

const c7 = doc('bfl301-7-1-thi-truong-chung-khoan', '7.1 — Securities market & capital markets law|||7.1 — Pháp luật thị trường chứng khoán & tài chính',
  'Luật Chứng khoán 2019: chứng khoán & công ty đại chúng, chào bán ra công chúng; UBCKNN, Sở Giao dịch Chứng khoán, Trung tâm Lưu ký; công bố thông tin, cấm giao dịch nội gián & thao túng.',
  [[
    `<span class="eyebrow">BFL301 · Chapter 7 · Lesson 7.1</span>
<h2>Securities market &amp; capital markets law</h2>
<h3>What is a security, and what is a public company</h3>
<p>The <strong>Law on Securities 2019</strong> defines securities to include shares, bonds, fund certificates, and derivative securities. A <strong>public company (công ty đại chúng)</strong> is a joint-stock company meeting scale/shareholder thresholds set by law — becoming public triggers heavier disclosure duties, whether or not it lists on an exchange.</p>
<h3>Public offering conditions</h3>
<p>Offering shares or bonds <strong>to the public</strong> is not free-for-all fundraising: it requires meeting capital, profitability and governance conditions and registering the offering with the <strong>State Securities Commission (SSC/UBCKNN)</strong> — the regulator for the whole securities market.</p>
<h3>Market infrastructure</h3>
<pre><code>SSC (UBCKNN)          - regulator, licenses & supervises
Stock Exchange (VNX)  - HOSE + HNX merged into one national exchange
VSDC                  - Vietnam Securities Depository & Clearing
Securities companies  - brokers, underwriters
Fund management cos.  - manage investment funds
</code></pre>
<h3>Disclosure &amp; prohibited conduct</h3>
<p>Public companies must periodically <strong>disclose information</strong> (financials, material events) so investors decide with the same facts. The law separately <strong>prohibits insider trading</strong> (trading on non-public material information) and <strong>market manipulation</strong> (e.g. wash trading to fake demand) — both undermine the trust a market needs to function.</p>
<div class="callout"><span class="badge">One market, one purpose</span> Disclosure and the insider-trading/manipulation bans exist for the same reason: an investor should lose money only to bad judgment, not to someone else's unfair information or fake trades.</div>`,
    `<span class="eyebrow">BFL301 · Chương 7 · Bài 7.1</span>
<h2>Pháp luật thị trường chứng khoán &amp; tài chính</h2>
<h3>Chứng khoán là gì, công ty đại chúng là gì</h3>
<p><strong>Luật Chứng khoán 2019</strong> định nghĩa chứng khoán gồm cổ phiếu, trái phiếu, chứng chỉ quỹ và chứng khoán phái sinh. <strong>Công ty đại chúng</strong> là công ty cổ phần đáp ứng ngưỡng quy mô/số cổ đông do luật quy định — trở thành đại chúng kéo theo nghĩa vụ công bố thông tin nặng hơn, bất kể có niêm yết trên sàn hay không.</p>
<h3>Điều kiện chào bán ra công chúng</h3>
<p>Chào bán cổ phiếu hoặc trái phiếu <strong>ra công chúng</strong> không phải huy động vốn tự do: phải đáp ứng điều kiện về vốn, khả năng sinh lời và quản trị, và đăng ký việc chào bán với <strong>Ủy ban Chứng khoán Nhà nước (UBCKNN)</strong> — cơ quan quản lý toàn bộ thị trường chứng khoán.</p>
<h3>Hạ tầng thị trường</h3>
<pre><code>UBCKNN         - co quan quan ly, cap phep & giam sat
So GDCK (VNX)  - HOSE + HNX hop nhat thanh mot so quoc gia
VSDC           - Tong Cong ty Luu ky va Bu tru Chung khoan
Cong ty chung khoan     - moi gioi, bao lanh phat hanh
Cong ty quan ly quy     - quan ly quy dau tu
</code></pre>
<h3>Công bố thông tin &amp; hành vi bị cấm</h3>
<p>Công ty đại chúng phải <strong>công bố thông tin</strong> định kỳ (báo cáo tài chính, sự kiện trọng yếu) để nhà đầu tư quyết định trên cùng một bộ thông tin. Luật đồng thời <strong>cấm giao dịch nội gián</strong> (dùng thông tin trọng yếu chưa công bố để giao dịch) và <strong>thao túng thị trường</strong> (vd tạo giao dịch giả để tạo cầu ảo) — cả hai đều phá vỡ niềm tin mà thị trường cần để hoạt động.</p>
<div class="callout"><span class="badge">Một thị trường, một mục đích</span> Công bố thông tin và lệnh cấm giao dịch nội gián/thao túng đứng cùng một lý do: nhà đầu tư chỉ nên mất tiền vì quyết định sai của mình, không phải vì thông tin không công bằng hay giao dịch giả của người khác.</div>`,
  ]]);

const c7q = quiz('bfl301-quiz-7', 'Quiz 7 — Thị trường chứng khoán|||Quiz 7 — Securities market', [
  { id: 'q1', question: 'Cơ quan nào quản lý nhà nước đối với thị trường chứng khoán Việt Nam?', options: ['Ngân hàng Nhà nước Việt Nam', 'Ủy ban Chứng khoán Nhà nước (UBCKNN)', 'Sở Giao dịch Chứng khoán', 'Trung tâm Lưu ký Chứng khoán'], correctIndex: 1, explanation: 'UBCKNN là cơ quan quản lý nhà nước chuyên trách thị trường chứng khoán, thuộc Bộ Tài chính.' },
  { id: 'q2', question: 'Điều kiện nào phải đáp ứng khi chào bán chứng khoán ra công chúng?', options: ['Không cần điều kiện gì, chỉ cần thông báo', 'Đáp ứng điều kiện về vốn, khả năng sinh lời, quản trị và đăng ký với UBCKNN', 'Chỉ cần được Sở Giao dịch Chứng khoán chấp thuận', 'Chỉ áp dụng cho doanh nghiệp nhà nước'], correctIndex: 1, explanation: 'Chào bán ra công chúng phải đáp ứng điều kiện luật định và đăng ký với UBCKNN trước khi thực hiện.' },
  { id: 'q3', question: 'Hành vi nào bị Luật Chứng khoán 2019 cấm vì phá vỡ niềm tin thị trường?', options: ['Mua cổ phiếu qua công ty chứng khoán', 'Công bố báo cáo tài chính định kỳ', 'Giao dịch nội gián dựa trên thông tin trọng yếu chưa công bố', 'Đầu tư vào chứng chỉ quỹ'], correctIndex: 2, explanation: 'Giao dịch nội gián và thao túng thị trường đều bị cấm vì tạo lợi thế bất công bằng cho một số nhà đầu tư.' },
]);

const c8 = doc('bfl301-8-1-xu-ly-vi-pham-aml', '8.1 — Violations, dispute resolution & AML|||8.1 — Xử lý vi phạm, giải quyết tranh chấp & phòng chống rửa tiền',
  'Ba loại trách nhiệm (hành chính, dân sự, hình sự); phương thức giải quyết tranh chấp (thương lượng, hòa giải, Tòa án, Trọng tài); Luật Phòng, chống rửa tiền 2022: KYC, báo cáo giao dịch đáng ngờ, giao dịch giá trị lớn.',
  [[
    `<span class="eyebrow">BFL301 · Chapter 8 · Lesson 8.1</span>
<h2>Violations, dispute resolution &amp; anti-money laundering</h2>
<h3>Three layers of liability</h3>
<ul>
<li><strong>Administrative</strong> — fines and sanctions under decrees on administrative violations in monetary/banking and securities activity (e.g. an unlicensed payment intermediary, late disclosure).</li>
<li><strong>Civil</strong> — damages for breach of a credit or deposit contract, decided between the parties or by a court/arbitrator.</li>
<li><strong>Criminal</strong> — the Penal Code covers serious cases: violating banking-operation regulations, usurious lending (cho vay lãi nặng) above the statutory rate cap, and fraudulent appropriation of property through credit fraud.</li>
</ul>
<h3>Resolving disputes</h3>
<pre><code>Negotiation (thuong luong)
   -&gt; Mediation (hoa giai)
   -&gt; Court (Toa an) - default, unless parties agreed otherwise
   -&gt; Commercial Arbitration (Trong tai thuong mai) - only if the contract has an arbitration clause
</code></pre>
<p>Most bank loan and account contracts choose court jurisdiction by default; arbitration is common in larger commercial financing where the contract says so.</p>
<h3>Anti-money laundering (AML) &amp; counter-terrorist financing (CFT)</h3>
<p>The <strong>Anti-Money Laundering Law 2022</strong> requires reporting entities (mainly banks) to: verify customer identity (<strong>KYC/CDD</strong>), monitor and report <strong>suspicious transactions (STR)</strong>, and report transactions above a statutory value threshold. The SBV's <strong>Anti-Money Laundering Department</strong> receives and analyzes these reports. AML rules are closely tied to counter-terrorist-financing obligations — both aim to stop the financial system from being used to hide the origin or destination of illicit funds.</p>
<div class="callout"><span class="badge">Why AML sits at the end of the course</span> Every earlier chapter — licensing, credit, deposits, payments, securities — is a channel money moves through. AML law is the check that runs across all of them, asking one question: does anyone actually know whose money this is?</div>`,
    `<span class="eyebrow">BFL301 · Chương 8 · Bài 8.1</span>
<h2>Xử lý vi phạm, giải quyết tranh chấp &amp; phòng chống rửa tiền</h2>
<h3>Ba lớp trách nhiệm</h3>
<ul>
<li><strong>Hành chính</strong> — xử phạt theo nghị định về xử phạt vi phạm hành chính trong lĩnh vực tiền tệ, ngân hàng và chứng khoán (vd trung gian thanh toán không phép, công bố thông tin trễ hạn).</li>
<li><strong>Dân sự</strong> — bồi thường thiệt hại do vi phạm hợp đồng tín dụng hoặc tiền gửi, do các bên thỏa thuận hoặc Tòa án/Trọng tài quyết định.</li>
<li><strong>Hình sự</strong> — Bộ luật Hình sự xử lý trường hợp nghiêm trọng: vi phạm quy định về hoạt động ngân hàng, cho vay lãi nặng vượt mức lãi suất luật định, lừa đảo chiếm đoạt tài sản thông qua gian lận tín dụng.</li>
</ul>
<h3>Giải quyết tranh chấp</h3>
<pre><code>Thuong luong
   -&gt; Hoa giai
   -&gt; Toa an - mac dinh, tru khi cac ben thoa thuan khac
   -&gt; Trong tai thuong mai - chi khi hop dong co dieu khoan trong tai
</code></pre>
<p>Hầu hết hợp đồng vay/tài khoản ngân hàng chọn thẩm quyền Tòa án theo mặc định; trọng tài thường gặp trong tài trợ thương mại lớn khi hợp đồng nêu rõ điều khoản đó.</p>
<h3>Phòng, chống rửa tiền (AML) &amp; chống tài trợ khủng bố (CFT)</h3>
<p><strong>Luật Phòng, chống rửa tiền 2022</strong> yêu cầu các đối tượng báo cáo (chủ yếu là ngân hàng) phải: xác minh danh tính khách hàng (<strong>KYC/CDD</strong>), theo dõi và báo cáo <strong>giao dịch đáng ngờ (STR)</strong>, và báo cáo giao dịch có giá trị vượt ngưỡng luật định. <strong>Cục Phòng, chống rửa tiền</strong> thuộc NHNN tiếp nhận và phân tích các báo cáo này. Quy định AML gắn chặt với nghĩa vụ chống tài trợ khủng bố — cả hai nhằm ngăn hệ thống tài chính bị dùng để che giấu nguồn gốc hoặc đích đến của tiền bất hợp pháp.</p>
<div class="callout"><span class="badge">Vì sao AML đứng ở chương cuối</span> Mọi chương trước đó — cấp phép, tín dụng, tiền gửi, thanh toán, chứng khoán — là một đường tiền đi qua. Pháp luật AML là phép kiểm chạy xuyên qua tất cả, chỉ hỏi một câu: có ai thực sự biết đây là tiền của ai không?</div>`,
  ]]);

const c8q = quiz('bfl301-quiz-8', 'Quiz 8 — Vi phạm, tranh chấp & rửa tiền|||Quiz 8 — Violations, disputes & AML', [
  { id: 'q1', question: 'Cho vay lãi nặng vượt mức lãi suất luật định có thể bị xử lý ở cấp độ nào?', options: ['Chỉ hành chính, không thể hình sự', 'Có thể bị xử lý hình sự theo Bộ luật Hình sự nếu đủ yếu tố cấu thành tội phạm', 'Không bị xử lý vì là thỏa thuận dân sự tự nguyện', 'Chỉ bị Tòa án nhắc nhở'], correctIndex: 1, explanation: 'Cho vay lãi nặng vượt mức luật định, nếu đủ yếu tố, là một tội danh trong Bộ luật Hình sự.' },
  { id: 'q2', question: 'Trọng tài thương mại được dùng để giải quyết tranh chấp ngân hàng khi nào?', options: ['Luôn được áp dụng mặc định cho mọi hợp đồng vay', 'Chỉ khi hợp đồng có điều khoản/thỏa thuận trọng tài', 'Chỉ Tòa án mới có quyền chuyển sang trọng tài', 'Không bao giờ áp dụng cho lĩnh vực ngân hàng'], correctIndex: 1, explanation: 'Trọng tài thương mại chỉ có thẩm quyền khi các bên đã thỏa thuận điều khoản trọng tài trong hợp đồng.' },
  { id: 'q3', question: 'Nghĩa vụ nào sau đây thuộc phạm vi Luật Phòng, chống rửa tiền 2022?', options: ['Niêm yết cổ phiếu trên sàn giao dịch', 'Xác minh danh tính khách hàng (KYC) và báo cáo giao dịch đáng ngờ', 'Trích lập dự phòng rủi ro tín dụng', 'Đăng ký biện pháp bảo đảm'], correctIndex: 1, explanation: 'KYC/CDD và báo cáo giao dịch đáng ngờ (STR) là nghĩa vụ cốt lõi của các đối tượng báo cáo theo luật AML.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'BFL301',
    slug: 'bfl301-luat-t224i-ch237nh-ng226n-h224ng',
    title: 'Banking and Finance Law (Luật Tài chính - Ngân hàng)',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BFL301.webp',
    shortDescription: 'Vietnamese banking & finance law: legal sources, the State Bank & monetary policy, credit institutions, credit & security law, deposits & insurance, digital payments, securities law, and anti-money laundering. Bilingual, with quizzes.|||Pháp luật tài chính - ngân hàng Việt Nam: nguồn luật, NHNN & chính sách tiền tệ, tổ chức tín dụng, cấp tín dụng & bảo đảm, huy động vốn & bảo hiểm tiền gửi, thanh toán số, chứng khoán và phòng chống rửa tiền. Song ngữ, có quiz.',
    description: 'Môn <strong>BFL301 — Banking and Finance Law (Luật Tài chính - Ngân hàng)</strong> thuộc khối Quản trị Kinh doanh (BBA), kỳ 8, dựng khung 8 chương bám các văn bản gốc: <strong>Luật Các tổ chức tín dụng 2024</strong>, <strong>Luật Ngân hàng Nhà nước Việt Nam 2010</strong>, <strong>Luật Chứng khoán 2019</strong>, <strong>Bộ luật Dân sự</strong> và <strong>Luật Phòng, chống rửa tiền 2022</strong>. Từ <strong>tổng quan hệ thống pháp luật</strong> → <strong>Ngân hàng Nhà nước &amp; chính sách tiền tệ</strong> → <strong>tổ chức tín dụng</strong> (cấp phép, giới hạn sở hữu, kiểm soát đặc biệt) → <strong>cấp tín dụng &amp; bảo đảm tiền vay</strong> → <strong>huy động vốn &amp; bảo hiểm tiền gửi</strong> → <strong>thanh toán &amp; ngân hàng số</strong> → <strong>thị trường chứng khoán</strong> → <strong>xử lý vi phạm, giải quyết tranh chấp &amp; phòng chống rửa tiền</strong>. Song ngữ, có quiz mỗi chương.',
    whatYouLearn: 'Thứ bậc nguồn luật & cơ quan quản lý (NHNN, UBCKNN, Bộ Tài chính); vị trí pháp lý & công cụ chính sách tiền tệ của NHNN; loại hình & điều kiện cấp phép tổ chức tín dụng, giới hạn sở hữu/cấp tín dụng, can thiệp sớm & kiểm soát đặc biệt (Luật Các TCTD 2024); các hình thức cấp tín dụng, phân loại nợ, biện pháp bảo đảm & đăng ký giao dịch bảo đảm theo Bộ luật Dân sự; huy động vốn & bảo hiểm tiền gửi (Luật Bảo hiểm tiền gửi 2012); pháp luật thanh toán không dùng tiền mặt, trung gian thanh toán, eKYC, sandbox fintech; pháp luật chứng khoán 2019 (chào bán, công bố thông tin, cấm giao dịch nội gián/thao túng); ba loại trách nhiệm pháp lý, giải quyết tranh chấp & phòng chống rửa tiền (Luật AML 2022).',
    requirements: 'Không yêu cầu kiến thức luật trước đó; nên đã học qua một môn pháp luật đại cương hoặc luật kinh tế cơ bản của khối BBA. Nên có tài khoản FLM để tra giáo trình & slide chính thức.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Văn bản luật gốc, giáo trình FLM, cơ sở dữ liệu pháp luật chính thức, cơ quan quản lý, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Hai nhánh luật ngân hàng & thị trường vốn, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan hệ thống pháp luật|||Chapter 1 — Legal system overview', description: 'Nguồn luật, ba cơ quan quản lý.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ngân hàng Nhà nước & tiền tệ|||Chapter 2 — SBV & monetary policy', description: 'Vị trí pháp lý, chức năng, công cụ chính sách tiền tệ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tổ chức tín dụng|||Chapter 3 — Credit institutions', description: 'Cấp phép, giới hạn sở hữu/tín dụng, can thiệp sớm & kiểm soát đặc biệt.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Cấp tín dụng & bảo đảm|||Chapter 4 — Credit & security law', description: 'Hình thức cấp tín dụng, phân loại nợ, biện pháp bảo đảm.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Huy động vốn & tiền gửi|||Chapter 5 — Deposits & fund mobilization', description: 'Huy động vốn, bảo hiểm tiền gửi, trần lãi suất.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thanh toán & ngân hàng số|||Chapter 6 — Payments & digital banking', description: 'Trung gian thanh toán, eKYC, sandbox fintech.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thị trường chứng khoán|||Chapter 7 — Securities market', description: 'Chào bán, hạ tầng thị trường, công bố thông tin.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Vi phạm, tranh chấp & rửa tiền|||Chapter 8 — Violations, disputes & AML', description: 'Ba loại trách nhiệm, giải quyết tranh chấp, phòng chống rửa tiền.', lessons: [c8, c8q] },
  ],
};
