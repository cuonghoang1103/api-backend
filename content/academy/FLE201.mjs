/**
 * FLE201 — Financial Law and Ethics in Finance. Giáo trình FLM (khối BBA, kỳ 3)
 * (syl): luật tài chính VN, đạo đức nghề (CFA Code of Ethics), giao dịch nội
 * gián/thao túng, xung đột lợi ích/uỷ thác, công bố thông tin, AML, quản trị
 * công ty & ESG. Song ngữ + ví dụ + bài tập. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('fle201-0-1-overview', 'Course overview: Financial Law and Ethics in Finance|||Tổng quan: Luật Tài chính và Đạo đức trong Tài chính',
  'Vì sao ngành tài chính cần cả luật lẫn đạo đức; lộ trình 8 chương: luật VN → CFA Code of Ethics → nội gián/thao túng → xung đột lợi ích/uỷ thác → công bố thông tin → AML → quản trị công ty & ESG.',
  [[
    `<span class="eyebrow">FLE201 · Lesson 0.1 · Overview</span>
<h2>Financial Law &amp; Ethics in Finance</h2>
<p class="lead">This course builds the two guardrails every finance professional works inside: <strong>the law</strong> (what you must do, enforced by the state) and <strong>professional ethics</strong> (what you should do, even where the law is silent). You'll study Vietnam's financial regulatory framework, the CFA Institute's global Code of Ethics, and the recurring failure modes — insider trading, conflicts of interest, opaque disclosure, money laundering — that keep showing up in real scandals.</p>
<h3>Why finance specifically</h3>
<p>Finance runs on trust: clients hand professionals their savings, information asymmetry is everywhere, and the temptation to act on privileged information or hidden conflicts is constant. When that trust breaks — Enron, the 2008 crisis, or Vietnam's own FLC and SCB/Vạn Thịnh Phát cases — the damage spreads far beyond the wrongdoer.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Ch.1–2</strong> — what financial law is, and Vietnam's specific legal framework (SBV, SSC, key laws).</li>
<li><strong>Ch.3</strong> — professional ethics standards, anchored on the CFA Institute Code of Ethics.</li>
<li><strong>Ch.4–6</strong> — the three classic abuse zones: insider trading/manipulation, conflicts of interest/fiduciary duty, disclosure/transparency.</li>
<li><strong>Ch.7–8</strong> — anti-money laundering compliance, then corporate governance, ESG and case-study practice.</li>
</ul>`,
    `<span class="eyebrow">FLE201 · Bài 0.1 · Tổng quan</span>
<h2>Luật Tài chính &amp; Đạo đức trong Tài chính</h2>
<p class="lead">Môn này dựng hai lớp bảo vệ mà mọi người làm tài chính phải sống trong đó: <strong>luật pháp</strong> (điều BẮT BUỘC phải làm, nhà nước cưỡng chế) và <strong>đạo đức nghề nghiệp</strong> (điều NÊN làm, ngay cả khi luật im lặng). Bạn sẽ học khung pháp lý tài chính Việt Nam, Bộ Quy tắc Đạo đức của CFA Institute (chuẩn toàn cầu), và những kiểu sai phạm lặp lại — giao dịch nội gián, xung đột lợi ích, công bố thông tin mờ, rửa tiền — vẫn liên tục xuất hiện trong các vụ bê bối thật.</p>
<h3>Vì sao đúng ngành tài chính</h3>
<p>Tài chính vận hành bằng niềm tin: khách hàng giao tiền tiết kiệm cho nhà chuyên môn, thông tin bất cân xứng có ở mọi nơi, và cám dỗ dùng thông tin đặc quyền hoặc che giấu xung đột lợi ích luôn thường trực. Khi niềm tin đó vỡ — Enron, khủng hoảng 2008, hay chính vụ FLC và SCB/Vạn Thịnh Phát ở Việt Nam — thiệt hại lan rộng ra ngoài người vi phạm rất nhiều.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Ch.1–2</strong> — luật tài chính là gì, và khung pháp lý riêng của Việt Nam (NHNN, UBCKNN, các luật chính).</li>
<li><strong>Ch.3</strong> — chuẩn đạo đức nghề nghiệp, dựa trên Bộ Quy tắc Đạo đức của CFA Institute.</li>
<li><strong>Ch.4–6</strong> — ba vùng lạm dụng kinh điển: nội gián/thao túng, xung đột lợi ích/nghĩa vụ uỷ thác, công bố thông tin/minh bạch.</li>
<li><strong>Ch.7–8</strong> — tuân thủ chống rửa tiền, rồi quản trị công ty, ESG và luyện tình huống thực tế.</li>
</ul>`,
  ]]);

const c1 = doc('fle201-1-1-overview-law-ethics', '1.1 — Overview: financial law & the ethics of the finance profession|||1.1 — Tổng quan: luật tài chính & đạo đức nghề tài chính',
  'Luật (bắt buộc, nhà nước cưỡng chế) khác đạo đức (tự nguyện, chuẩn nghề nghiệp) thế nào; khoảng trống "hợp pháp nhưng phi đạo đức"; vì sao ngành tài chính cần cả hai.',
  [[
    `<span class="eyebrow">FLE201 · Chapter 1 · Lesson 1.1</span>
<h2>Overview: financial law &amp; the ethics of the finance profession</h2>
<h3>Two different guardrails</h3>
<ul>
<li><strong>Financial law</strong> — binding rules issued by the state (statutes, decrees, circulars) governing banking, securities and insurance. Breaking them brings fines, licence suspension, or criminal liability.</li>
<li><strong>Professional ethics</strong> — the standards a profession holds itself to, often going further than the law requires: loyalty to clients, honesty, competence, avoiding even the appearance of impropriety.</li>
</ul>
<h3>The gap between "legal" and "ethical"</h3>
<p>Something can be perfectly legal and still unethical — e.g. disclosing a conflict of interest in fine print nobody reads, or steering a client into a product that pays the advisor more but serves the client less. Financial scandals rarely start with an obviously illegal act; they start in this grey zone and escalate once the first small compromise goes unpunished.</p>
<h3>Why finance specifically needs both</h3>
<p>Finance concentrates three risk factors: it handles other people's money, information is unevenly distributed (the professional almost always knows more than the client), and outcomes are delayed — a bad decision made today may not visibly hurt anyone for years. Law sets the floor; ethics is what keeps professionals above it when nobody is watching.</p>
<pre><code>Law vs Ethics
 Law     -&gt; minimum standard, state-enforced,      "what you MUST do"
 Ethics  -&gt; aspirational standard, self-enforced,   "what you SHOULD do"
 Gap     -&gt; conduct that is legal but still harms trust (disclosed but abusive conflicts, aggressive fine print)
</code></pre>
<div class="callout"><span class="badge">Legal ≠ ethical</span> Passing a compliance checklist is the floor, not the goal. This course treats law and ethics as two separate but overlapping tests every decision has to pass.</div>`,
    `<span class="eyebrow">FLE201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan: luật tài chính &amp; đạo đức nghề tài chính</h2>
<h3>Hai lớp bảo vệ khác nhau</h3>
<ul>
<li><strong>Luật tài chính</strong> — quy định bắt buộc do nhà nước ban hành (luật, nghị định, thông tư) điều chỉnh ngân hàng, chứng khoán và bảo hiểm. Vi phạm bị phạt tiền, đình chỉ giấy phép, hoặc truy cứu hình sự.</li>
<li><strong>Đạo đức nghề nghiệp</strong> — chuẩn mực mà một nghề tự đặt ra cho mình, thường vượt xa yêu cầu của luật: trung thành với khách hàng, trung thực, đủ năng lực, tránh cả những gì "trông có vẻ" sai trái.</li>
</ul>
<h3>Khoảng trống giữa "hợp pháp" và "có đạo đức"</h3>
<p>Một hành vi có thể hoàn toàn hợp pháp mà vẫn phi đạo đức — vd công bố xung đột lợi ích bằng chữ nhỏ không ai đọc, hoặc hướng khách hàng vào sản phẩm trả hoa hồng cao cho người tư vấn nhưng ít lợi cho khách. Các bê bối tài chính hiếm khi bắt đầu bằng một hành vi rõ ràng phi pháp; chúng bắt đầu ở vùng xám này và leo thang khi lần thoả hiệp nhỏ đầu tiên không bị xử lý.</p>
<h3>Vì sao đúng ngành tài chính cần cả hai</h3>
<p>Tài chính hội tụ ba yếu tố rủi ro: quản lý tiền của người khác, thông tin phân bổ không đều (nhà chuyên môn hầu như luôn biết nhiều hơn khách hàng), và hậu quả thường bị trì hoãn — một quyết định sai hôm nay có thể nhiều năm sau mới gây hại rõ ràng. Luật đặt sàn; đạo đức là thứ giữ người làm nghề ở trên sàn đó khi không ai đang nhìn.</p>
<pre><code>Luật vs Đạo đức
 Luật     -&gt; chuẩn tối thiểu, nhà nước cưỡng chế,   "PHẢI làm gì"
 Đạo đức  -&gt; chuẩn hướng tới, tự cưỡng chế,          "NÊN làm gì"
 Khoảng trống -&gt; hành vi hợp pháp nhưng vẫn hại niềm tin (xung đột đã công bố nhưng vẫn lạm dụng, chữ nhỏ mập mờ)
</code></pre>
<div class="callout"><span class="badge">Hợp pháp ≠ có đạo đức</span> Vượt qua checklist tuân thủ là cái sàn, không phải đích đến. Môn này coi luật và đạo đức là hai bài kiểm tra riêng biệt nhưng chồng lấp mà mọi quyết định phải vượt qua.</div>`,
  ]]);

const c1q = quiz('fle201-quiz-1', 'Quiz 1 — Overview: law & ethics|||Quiz 1 — Tổng quan luật & đạo đức', [
  { id: 'q1', question: 'Khác biệt chính giữa luật tài chính và đạo đức nghề nghiệp là gì?', options: ['Luật chỉ áp dụng cho ngân hàng', 'Luật bắt buộc & nhà nước cưỡng chế; đạo đức là chuẩn tự nguyện của nghề', 'Đạo đức luôn nghiêm hơn luật ở mọi trường hợp', 'Hai thứ hoàn toàn giống nhau'], correctIndex: 1, explanation: 'Luật là sàn bắt buộc do nhà nước cưỡng chế; đạo đức là chuẩn nghề tự đặt, thường cao hơn luật.' },
  { id: 'q2', question: '"Hợp pháp nhưng phi đạo đức" là tình huống như thế nào?', options: ['Không thể xảy ra trong thực tế', 'Hành vi vi phạm luật nhưng chưa bị phát hiện', 'Hành vi không vi phạm luật nhưng vẫn làm hại niềm tin/khách hàng', 'Hành vi bị cấm bởi cả luật và đạo đức'], correctIndex: 2, explanation: 'Ví dụ: công bố xung đột lợi ích bằng chữ nhỏ khó đọc — không phạm luật nhưng vẫn lạm dụng niềm tin.' },
  { id: 'q3', question: 'Vì sao ngành tài chính đặc biệt cần cả luật và đạo đức?', options: ['Vì tài chính không có quy định nào', 'Vì quản lý tiền người khác, thông tin bất cân xứng, hậu quả bị trì hoãn', 'Vì khách hàng luôn biết nhiều hơn chuyên gia', 'Vì luật tài chính không thể thay đổi'], correctIndex: 1, explanation: 'Ba yếu tố rủi ro: tiền của người khác, thông tin không đều, hậu quả trì hoãn — cần cả sàn luật và trần đạo đức.' },
]);

const c2 = doc('fle201-2-1-vn-legal-framework', '2.1 — Legal framework of Vietnam\'s financial market|||2.1 — Khung pháp lý thị trường tài chính Việt Nam',
  'Ba nhánh thị trường (ngân hàng, chứng khoán, bảo hiểm) & cơ quan quản lý (NHNN, UBCKNN, Bộ Tài chính); các luật trụ cột: Luật Các TCTD 2024, Luật Chứng khoán 2019.',
  [[
    `<span class="eyebrow">FLE201 · Chapter 2 · Lesson 2.1</span>
<h2>Legal framework of Vietnam's financial market</h2>
<h3>Three market segments, three regulators</h3>
<ul>
<li><strong>Banking</strong> — regulated by the <strong>State Bank of Vietnam (SBV / Ngân hàng Nhà nước)</strong>, which sets monetary policy, licenses credit institutions and supervises safety/soundness.</li>
<li><strong>Securities</strong> — regulated by the <strong>State Securities Commission (SSC / Uỷ ban Chứng khoán Nhà nước)</strong> under the Ministry of Finance, overseeing listed companies, brokers, exchanges (HSX, HNX) and market conduct.</li>
<li><strong>Insurance</strong> — regulated by the <strong>Ministry of Finance</strong>, covering solvency, product approval and insurer conduct.</li>
</ul>
<h3>Pillar laws</h3>
<pre><code>Law on Credit Institutions 2024 (Luật Các TCTD, No. 32/2024/QH15)
  -&gt; licensing, ownership limits, related-party lending caps, early intervention/bankruptcy of banks

Securities Law 2019 (Luật Chứng khoán, No. 54/2019/QH14)
  -&gt; public offering, listing, disclosure duties, insider trading &amp; manipulation, SSC enforcement powers

Law on Anti-Money Laundering 2022
  -&gt; KYC/CDD, suspicious-transaction reporting obligations for banks &amp; securities firms
</code></pre>
<h3>Why the framework keeps changing</h3>
<p>Vietnam's financial-law framework is revised often — the 2024 Law on Credit Institutions replaced the 2010 version specifically to tighten related-party lending limits after the 2022–2023 bank-run and bond-market shocks (SCB/Vạn Thịnh Phát, Tân Hoàng Minh). Studying "the law" here means studying a moving target that reacts to real failures.</p>
<div class="callout"><span class="badge">Know your regulator</span> Before analysing any financial-ethics case, first identify which regulator and which law actually govern it — banking, securities and insurance rules are not interchangeable.</div>`,
    `<span class="eyebrow">FLE201 · Chương 2 · Bài 2.1</span>
<h2>Khung pháp lý thị trường tài chính Việt Nam</h2>
<h3>Ba nhánh thị trường, ba cơ quan quản lý</h3>
<ul>
<li><strong>Ngân hàng</strong> — do <strong>Ngân hàng Nhà nước Việt Nam (NHNN)</strong> quản lý, điều hành chính sách tiền tệ, cấp phép tổ chức tín dụng và giám sát an toàn hoạt động.</li>
<li><strong>Chứng khoán</strong> — do <strong>Uỷ ban Chứng khoán Nhà nước (UBCKNN)</strong> thuộc Bộ Tài chính quản lý, giám sát công ty đại chúng, công ty chứng khoán, sở giao dịch (HSX, HNX) và hành vi trên thị trường.</li>
<li><strong>Bảo hiểm</strong> — do <strong>Bộ Tài chính</strong> quản lý, giám sát khả năng thanh toán, phê duyệt sản phẩm và hành vi của doanh nghiệp bảo hiểm.</li>
</ul>
<h3>Các luật trụ cột</h3>
<pre><code>Luật Các tổ chức tín dụng 2024 (Luật số 32/2024/QH15)
  -&gt; cấp phép, hạn mức sở hữu, trần cho vay bên liên quan, can thiệp sớm/phá sản ngân hàng

Luật Chứng khoán 2019 (Luật số 54/2019/QH14)
  -&gt; chào bán công khai, niêm yết, nghĩa vụ công bố thông tin, nội gián &amp; thao túng, quyền xử phạt của UBCKNN

Luật Phòng, chống rửa tiền 2022
  -&gt; KYC/nhận biết khách hàng, nghĩa vụ báo cáo giao dịch đáng ngờ của ngân hàng &amp; công ty chứng khoán
</code></pre>
<h3>Vì sao khung pháp lý liên tục thay đổi</h3>
<p>Khung luật tài chính Việt Nam được sửa đổi thường xuyên — Luật Các TCTD 2024 thay thế bản 2010 chính là để siết chặt trần cho vay bên liên quan sau các cú sốc rút tiền ngân hàng và trái phiếu 2022–2023 (SCB/Vạn Thịnh Phát, Tân Hoàng Minh). Học "luật" ở đây nghĩa là học một mục tiêu luôn di động, phản ứng theo các vụ đổ vỡ thật.</p>
<div class="callout"><span class="badge">Biết đúng cơ quan quản lý</span> Trước khi phân tích bất kỳ tình huống đạo đức tài chính nào, hãy xác định đúng cơ quan quản lý và đúng luật áp dụng — quy định ngân hàng, chứng khoán và bảo hiểm không thể dùng thay nhau.</div>`,
  ]]);

const c2q = quiz('fle201-quiz-2', 'Quiz 2 — Vietnam legal framework|||Quiz 2 — Khung pháp lý Việt Nam', [
  { id: 'q1', question: 'Cơ quan nào trực tiếp quản lý thị trường chứng khoán Việt Nam?', options: ['Ngân hàng Nhà nước (NHNN)', 'Uỷ ban Chứng khoán Nhà nước (UBCKNN)', 'Bộ Công an', 'HSX & HNX tự quản lý hoàn toàn'], correctIndex: 1, explanation: 'UBCKNN thuộc Bộ Tài chính, giám sát công ty đại chúng, công ty chứng khoán và sở giao dịch.' },
  { id: 'q2', question: 'Luật Các tổ chức tín dụng 2024 (số 32/2024/QH15) siết chặt điều gì sau các cú sốc 2022–2023?', options: ['Giờ giao dịch chứng khoán', 'Trần cho vay đối với bên liên quan', 'Lãi suất tiết kiệm', 'Thuế thu nhập doanh nghiệp'], correctIndex: 1, explanation: 'Sau vụ SCB/Vạn Thịnh Phát, luật mới siết hạn mức cho vay bên liên quan để giảm rủi ro sở hữu chéo.' },
  { id: 'q3', question: 'Luật Chứng khoán 2019 (số 54/2019/QH14) điều chỉnh nội dung nào?', options: ['Cấp phép ngân hàng', 'Chào bán công khai, niêm yết, công bố thông tin, nội gián & thao túng', 'Bảo hiểm nhân thọ', 'Chính sách tiền tệ quốc gia'], correctIndex: 1, explanation: 'Luật Chứng khoán 2019 là luật trụ cột của thị trường chứng khoán, bao gồm cả chế tài nội gián/thao túng.' },
]);

const c3 = doc('fle201-3-1-cfa-code-of-ethics', '3.1 — Professional ethics standards: the CFA Institute Code of Ethics|||3.1 — Đạo đức & tiêu chuẩn hành nghề: CFA Code of Ethics',
  'Sáu nguyên tắc trong CFA Code of Ethics; bảy nhóm Standards of Professional Conduct (I–VII); vì sao chuẩn quốc tế vẫn áp dụng được ở Việt Nam.',
  [[
    `<span class="eyebrow">FLE201 · Chapter 3 · Lesson 3.1</span>
<h2>Professional ethics standards: the CFA Institute Code of Ethics</h2>
<h3>Six tenets of the Code of Ethics</h3>
<p>Members and candidates of the CFA Institute pledge to: act with integrity, competence, diligence and respect; place client interests above their own and the profession's; use reasonable care and independent judgment; practise in a way that reflects credit on the profession; promote market integrity; and maintain their competence.</p>
<h3>Standards of Professional Conduct (I–VII)</h3>
<pre><code>I.    Professionalism            (knowledge of the law, independence, misrepresentation, misconduct)
II.   Integrity of Capital Markets (material nonpublic information, market manipulation)
III.  Duties to Clients          (loyalty/prudence/care, fair dealing, suitability, disclosure of fees)
IV.   Duties to Employers        (loyalty, additional compensation, supervisory responsibilities)
V.    Investment Analysis        (diligence, communication with clients, record retention)
VI.   Conflicts of Interest      (disclosure, priority of transactions, referral fees)
VII.  Responsibilities as a Member (conduct in CFA programs, reference to the CFA designation)
</code></pre>
<h3>Why an international code matters here</h3>
<p>Vietnamese law does not (yet) codify a single unified professional ethics code for the whole finance sector. The CFA Code of Ethics fills that gap as the de-facto global benchmark: it's the standard cited by international investors, auditors and regulators when judging whether a Vietnamese firm's conduct is "professional" in a cross-border sense — regardless of whether every clause has a matching statute.</p>
<div class="callout"><span class="badge">Loyalty ranks first</span> Standard III.A ("Loyalty, Prudence, and Care") is the clause most exam questions and real-world cases hinge on: client interests come before the firm's, and the firm's before the individual's own.</div>`,
    `<span class="eyebrow">FLE201 · Chương 3 · Bài 3.1</span>
<h2>Đạo đức &amp; tiêu chuẩn hành nghề: CFA Code of Ethics</h2>
<h3>Sáu nguyên tắc trong Bộ Quy tắc Đạo đức CFA</h3>
<p>Thành viên và ứng viên CFA Institute cam kết: hành động với sự trung thực, năng lực, cần cù và tôn trọng; đặt lợi ích khách hàng lên trên lợi ích cá nhân và của nghề; dùng sự cẩn trọng hợp lý và phán đoán độc lập; hành nghề theo cách tôn vinh nghề nghiệp; thúc đẩy sự lành mạnh của thị trường; và duy trì năng lực chuyên môn.</p>
<h3>Bảy nhóm Chuẩn Hành nghề (I–VII)</h3>
<pre><code>I.    Tính chuyên nghiệp        (hiểu luật, tính độc lập, không xuyên tạc, không hành vi sai trái)
II.   Sự lành mạnh của thị trường vốn (thông tin trọng yếu chưa công bố, thao túng thị trường)
III.  Nghĩa vụ với khách hàng   (trung thành/cẩn trọng/chăm sóc, đối xử công bằng, phù hợp, công bố phí)
IV.   Nghĩa vụ với người sử dụng lao động (trung thành, thu nhập ngoài lương, trách nhiệm giám sát)
V.    Phân tích đầu tư          (cần cù, trao đổi với khách hàng, lưu trữ hồ sơ)
VI.   Xung đột lợi ích          (công bố, thứ tự ưu tiên giao dịch, phí giới thiệu)
VII.  Trách nhiệm là thành viên (ứng xử trong chương trình CFA, cách dùng danh hiệu CFA)
</code></pre>
<h3>Vì sao chuẩn quốc tế lại quan trọng ở đây</h3>
<p>Luật Việt Nam chưa (hoặc chưa) hệ thống hoá một bộ quy tắc đạo đức nghề duy nhất cho toàn ngành tài chính. Bộ Quy tắc Đạo đức CFA lấp khoảng trống đó như chuẩn tham chiếu toàn cầu trên thực tế: đây là chuẩn mà nhà đầu tư quốc tế, kiểm toán và cơ quan quản lý dùng để đánh giá liệu hành vi của một công ty Việt Nam có "chuyên nghiệp" theo nghĩa xuyên biên giới hay không — bất kể mỗi điều khoản có luật tương ứng hay chưa.</p>
<div class="callout"><span class="badge">Trung thành đứng đầu</span> Standard III.A ("Trung thành, Cẩn trọng, Chăm sóc") là điều khoản mà hầu hết câu hỏi thi và tình huống thực tế xoay quanh: lợi ích khách hàng đứng trên lợi ích công ty, và lợi ích công ty đứng trên lợi ích cá nhân.</div>`,
  ]]);

const c3q = quiz('fle201-quiz-3', 'Quiz 3 — CFA Code of Ethics|||Quiz 3 — CFA Code of Ethics', [
  { id: 'q1', question: 'Theo CFA Code of Ethics, thứ tự ưu tiên lợi ích đúng là gì?', options: ['Cá nhân > công ty > khách hàng', 'Khách hàng > công ty > cá nhân', 'Công ty > khách hàng > cá nhân', 'Cả ba lợi ích ngang nhau luôn'], correctIndex: 1, explanation: 'Standard III.A: lợi ích khách hàng đặt trên công ty, và công ty đặt trên cá nhân.' },
  { id: 'q2', question: 'Standard II (Integrity of Capital Markets) tập trung vào vấn đề gì?', options: ['Lưu trữ hồ sơ nội bộ', 'Thông tin trọng yếu chưa công bố & thao túng thị trường', 'Phí giới thiệu khách hàng', 'Danh hiệu CFA'], correctIndex: 1, explanation: 'Standard II bảo vệ sự lành mạnh của thị trường vốn: cấm dùng MNPI và thao túng giá.' },
  { id: 'q3', question: 'Vì sao CFA Code of Ethics vẫn có giá trị dù không phải luật Việt Nam?', options: ['Vì nó thay thế hoàn toàn luật trong nước', 'Vì nó là chuẩn tham chiếu quốc tế cho nhà đầu tư & quản lý xuyên biên giới', 'Vì UBCKNN bắt buộc áp dụng y nguyên', 'Vì nó chỉ áp dụng cho ngân hàng'], correctIndex: 1, explanation: 'Nó lấp khoảng trống bằng vai trò chuẩn hành nghề được thừa nhận toàn cầu, không thay thế luật quốc gia.' },
]);

const c4 = doc('fle201-4-1-insider-trading-manipulation', '4.1 — Insider trading & market manipulation|||4.1 — Giao dịch nội gián & thao túng thị trường',
  'Thông tin trọng yếu chưa công bố (MNPI); các thủ đoạn thao túng (pump-and-dump, wash trading, spoofing); chế tài theo Luật Chứng khoán 2019; case study FLC.',
  [[
    `<span class="eyebrow">FLE201 · Chapter 4 · Lesson 4.1</span>
<h2>Insider trading &amp; market manipulation</h2>
<h3>Insider trading: trading on MNPI</h3>
<p>Insider trading means buying or selling a security while in possession of <strong>material nonpublic information (MNPI)</strong> — information that would likely move the price if disclosed, and that has not been made public. It's illegal whether the trader is a company insider, a tipped-off relative, or an outside analyst who happened to overhear it.</p>
<h3>Common manipulation tactics</h3>
<pre><code>Pump-and-dump   -&gt; spread hype/false info to inflate price, then sell into the rally
Wash trading    -&gt; trade with yourself (or a colluding party) to fake volume/liquidity
Spoofing        -&gt; place large orders with no intent to execute, cancel once price moves
Cornering       -&gt; accumulate a dominant position to control price/supply
</code></pre>
<h3>Vietnamese legal treatment</h3>
<p>The Securities Law 2019 (Điều 12) explicitly bans both insider trading and market manipulation, with SSC administrative fines and, for serious cases, criminal referral under the Penal Code. The <strong>FLC / Trịnh Văn Quyết case (2022)</strong> is the textbook domestic example: selling a large block of shares before disclosing it, and — in the related Penal Code prosecution — years of price manipulation across FLC-linked stocks, causing large investor losses once the truth surfaced.</p>
<div class="callout"><span class="badge">The disclosure test</span> A simple check: if the trade only makes sense once you assume the counterparty doesn't know what you know, or once you assume other investors are being fooled by fabricated activity — it's very likely inside trading or manipulation.</div>`,
    `<span class="eyebrow">FLE201 · Chương 4 · Bài 4.1</span>
<h2>Giao dịch nội gián &amp; thao túng thị trường</h2>
<h3>Giao dịch nội gián: giao dịch dựa trên MNPI</h3>
<p>Giao dịch nội gián là mua/bán một chứng khoán khi đang nắm <strong>thông tin trọng yếu chưa công bố (MNPI)</strong> — thông tin có khả năng làm biến động giá nếu được công bố, và chưa được công khai. Hành vi này bất hợp pháp bất kể người giao dịch là người nội bộ công ty, người thân được "mách", hay một nhà phân tích ngoài công ty vô tình nghe được.</p>
<h3>Các thủ đoạn thao túng thường gặp</h3>
<pre><code>Pump-and-dump  -&gt; tung tin đồn/thông tin giả để đẩy giá, rồi bán ra khi giá tăng
Wash trading   -&gt; tự mua bán với mình (hoặc bên thông đồng) để làm giả khối lượng/thanh khoản
Spoofing       -&gt; đặt lệnh lớn không có ý định khớp, huỷ ngay khi giá dịch chuyển như ý
Cornering      -&gt; gom vị thế chi phối để kiểm soát giá/nguồn cung
</code></pre>
<h3>Xử lý theo pháp luật Việt Nam</h3>
<p>Luật Chứng khoán 2019 (Điều 12) cấm rõ cả giao dịch nội gián và thao túng thị trường, với chế tài hành chính của UBCKNN và, với trường hợp nghiêm trọng, chuyển sang truy cứu hình sự theo Bộ luật Hình sự. <strong>Vụ FLC / Trịnh Văn Quyết (2022)</strong> là ví dụ trong nước điển hình: bán khối lượng lớn cổ phiếu trước khi công bố thông tin, và — trong vụ án hình sự liên quan — nhiều năm thao túng giá trên các mã liên quan FLC, gây thiệt hại lớn cho nhà đầu tư khi sự thật lộ ra.</p>
<div class="callout"><span class="badge">Phép thử công bố</span> Cách kiểm nhanh: nếu giao dịch chỉ có ý nghĩa khi giả định bên đối tác KHÔNG biết điều bạn biết, hoặc khi giả định nhà đầu tư khác đang bị đánh lừa bởi hoạt động giả tạo — rất có thể đó là nội gián hoặc thao túng.</div>`,
  ]]);

const c4q = quiz('fle201-quiz-4', 'Quiz 4 — Insider trading & manipulation|||Quiz 4 — Nội gián & thao túng', [
  { id: 'q1', question: 'MNPI là viết tắt của khái niệm gì?', options: ['Một loại chứng khoán phái sinh', 'Thông tin trọng yếu chưa công bố', 'Mức phí giao dịch tối thiểu', 'Một chỉ số thị trường'], correctIndex: 1, explanation: 'MNPI = material nonpublic information — thông tin trọng yếu, chưa công khai, có khả năng làm biến động giá.' },
  { id: 'q2', question: 'Wash trading là thủ đoạn thao túng bằng cách nào?', options: ['Công bố thông tin sớm cho công chúng', 'Tự giao dịch với mình/bên thông đồng để tạo khối lượng giả', 'Nắm giữ cổ phiếu dài hạn', 'Mua bảo hiểm rủi ro giá'], correctIndex: 1, explanation: 'Wash trading tạo khối lượng/thanh khoản giả bằng giao dịch không có rủi ro thật.' },
  { id: 'q3', question: 'Luật nào quy định trực tiếp việc cấm nội gián & thao túng thị trường chứng khoán VN?', options: ['Luật Các tổ chức tín dụng 2024', 'Luật Chứng khoán 2019 (Điều 12)', 'Luật Phòng, chống rửa tiền 2022', 'Luật Doanh nghiệp'], correctIndex: 1, explanation: 'Điều 12 Luật Chứng khoán 2019 cấm rõ cả hai hành vi, với chế tài của UBCKNN.' },
]);

const c5 = doc('fle201-5-1-conflicts-fiduciary-duty', '5.1 — Conflicts of interest & fiduciary duty|||5.1 — Xung đột lợi ích & nghĩa vụ uỷ thác',
  'Nghĩa vụ uỷ thác (duty of loyalty, duty of care); các dạng xung đột lợi ích phổ biến (giao dịch bên liên quan, hoa hồng, quà tặng); nguyên tắc quản lý xung đột.',
  [[
    `<span class="eyebrow">FLE201 · Chapter 5 · Lesson 5.1</span>
<h2>Conflicts of interest &amp; fiduciary duty</h2>
<h3>What "fiduciary duty" means</h3>
<p>A fiduciary is someone entrusted to act on another's behalf and required to put that person's interests first. It has two halves: <strong>duty of loyalty</strong> (act only in the client's interest, avoid self-dealing) and <strong>duty of care</strong> (act with the skill and diligence a prudent professional would use).</p>
<h3>Common conflict-of-interest patterns in finance</h3>
<ul>
<li><strong>Related-party transactions</strong> — lending to, or trading with, an entity connected to a bank's own owners or management (the exact abuse the 2024 Law on Credit Institutions tightened).</li>
<li><strong>Commission-driven advice</strong> — recommending the product that pays the advisor more, not the one that fits the client best.</li>
<li><strong>Gifts &amp; entertainment</strong> — accepting favours from a counterparty that could bias a decision, even unconsciously.</li>
<li><strong>Personal trading</strong> — an employee trading ahead of, or alongside, a client's order (front-running).</li>
</ul>
<pre><code>Managing a conflict (in order of preference):
 1. Avoid it            -&gt; decline the mandate/gift/trade entirely
 2. Disclose it clearly -&gt; plain language, before the decision, not buried in fine print
 3. Get informed consent-&gt; the affected party actually agrees, knowing the conflict
 4. Independent oversight -&gt; a separate party reviews/approves the decision
</code></pre>
<div class="callout"><span class="badge">Disclosure is not a licence</span> Telling a client about a conflict does not make an otherwise bad decision acceptable — it only satisfies the transparency requirement. The underlying decision must still serve the client's interest.</div>`,
    `<span class="eyebrow">FLE201 · Chương 5 · Bài 5.1</span>
<h2>Xung đột lợi ích &amp; nghĩa vụ uỷ thác</h2>
<h3>"Nghĩa vụ uỷ thác" nghĩa là gì</h3>
<p>Người được uỷ thác (fiduciary) là người được giao hành động thay cho người khác và buộc phải đặt lợi ích của người đó lên trước. Nó gồm hai phần: <strong>nghĩa vụ trung thành</strong> (chỉ hành động vì lợi ích khách hàng, tránh tự giao dịch cho mình) và <strong>nghĩa vụ cẩn trọng</strong> (hành động với kỹ năng và sự cần cù mà một chuyên gia thận trọng sẽ dùng).</p>
<h3>Các dạng xung đột lợi ích thường gặp trong tài chính</h3>
<ul>
<li><strong>Giao dịch bên liên quan</strong> — cho vay hoặc giao dịch với một pháp nhân liên quan đến chủ sở hữu/ban điều hành ngân hàng (đúng lỗ hổng mà Luật Các TCTD 2024 siết lại).</li>
<li><strong>Tư vấn theo hoa hồng</strong> — khuyên khách hàng chọn sản phẩm trả hoa hồng cao cho người tư vấn, không phải sản phẩm phù hợp nhất với khách.</li>
<li><strong>Quà tặng &amp; tiếp đãi</strong> — nhận ưu ái từ đối tác có thể làm lệch quyết định, ngay cả khi vô thức.</li>
<li><strong>Giao dịch cá nhân</strong> — nhân viên giao dịch trước hoặc cùng lúc với lệnh của khách hàng (front-running).</li>
</ul>
<pre><code>Quản lý xung đột lợi ích (theo thứ tự ưu tiên):
 1. Tránh hẳn         -&gt; từ chối nhận nhiệm vụ/quà/giao dịch đó
 2. Công bố rõ ràng   -&gt; ngôn ngữ dễ hiểu, trước khi ra quyết định, không giấu trong chữ nhỏ
 3. Có sự đồng ý      -&gt; bên bị ảnh hưởng thực sự đồng ý, biết rõ xung đột
 4. Giám sát độc lập  -&gt; một bên riêng biệt rà soát/phê duyệt quyết định
</code></pre>
<div class="callout"><span class="badge">Công bố không phải là giấy phép</span> Nói cho khách hàng biết về xung đột không làm một quyết định tệ trở nên chấp nhận được — nó chỉ đáp ứng yêu cầu minh bạch. Quyết định gốc vẫn phải phục vụ lợi ích khách hàng.</div>`,
  ]]);

const c5q = quiz('fle201-quiz-5', 'Quiz 5 — Conflicts & fiduciary duty|||Quiz 5 — Xung đột & uỷ thác', [
  { id: 'q1', question: 'Nghĩa vụ uỷ thác gồm hai phần nào?', options: ['Duty of loyalty & duty of care', 'Duty of secrecy & duty of profit', 'Duty of speed & duty of size', 'Duty of tax & duty of audit'], correctIndex: 0, explanation: 'Trung thành (đặt lợi ích khách hàng trước) và cẩn trọng (hành động đúng chuẩn chuyên môn).' },
  { id: 'q2', question: 'Front-running là hành vi xung đột lợi ích nào?', options: ['Công bố báo cáo tài chính đúng hạn', 'Nhân viên giao dịch trước/cùng lúc với lệnh của khách hàng', 'Từ chối nhận quà từ đối tác', 'Đào tạo lại nhân viên tư vấn'], correctIndex: 1, explanation: 'Front-running là lợi dụng thông tin lệnh của khách để giao dịch trước, gây hại cho khách.' },
  { id: 'q3', question: 'Vì sao "chỉ công bố xung đột lợi ích" là chưa đủ?', options: ['Vì công bố luôn bị cấm theo luật', 'Vì công bố chỉ đáp ứng minh bạch, quyết định gốc vẫn phải phục vụ lợi ích khách hàng', 'Vì khách hàng không được phép biết về xung đột', 'Vì công bố tự động giải quyết mọi xung đột'], correctIndex: 1, explanation: 'Công bố là điều kiện cần, không phải điều kiện đủ — quyết định vẫn phải đặt lợi ích khách hàng lên trước.' },
]);

const c6 = doc('fle201-6-1-disclosure-transparency', '6.1 — Disclosure & transparency|||6.1 — Công bố thông tin & minh bạch',
  'Công bố định kỳ vs công bố theo sự kiện; nguyên tắc công bố công bằng (fair disclosure); nghĩa vụ của công ty đại chúng theo quy định UBCKNN.',
  [[
    `<span class="eyebrow">FLE201 · Chapter 6 · Lesson 6.1</span>
<h2>Disclosure &amp; transparency</h2>
<h3>Two disclosure clocks</h3>
<ul>
<li><strong>Periodic disclosure</strong> — recurring, scheduled reporting: quarterly and annual financial statements, annual reports, corporate governance reports.</li>
<li><strong>Event-based disclosure</strong> — triggered by a specific "material event" the moment it happens: a large asset write-off, a change of controlling shareholder, a lawsuit, a credit-rating change, a major related-party transaction.</li>
</ul>
<h3>The fair disclosure principle</h3>
<p>Material information must reach <em>all</em> investors at the same time — no analyst call, private meeting, or "friendly" tip-off before the public release. This is the core idea behind rules like the US SEC's Regulation FD, mirrored in Vietnam's listed-company disclosure obligations (under circulars implementing the Securities Law 2019): public companies must publish material events on the exchange's disclosure system and their own website simultaneously, within a fixed number of hours.</p>
<pre><code>Disclosure failure modes:
 Selective disclosure -&gt; tell a favoured analyst/investor first
 Delayed disclosure    -&gt; sit on bad news past the legal deadline
 Buried disclosure      -&gt; technically disclosed, practically unreadable (footnote 47, page 212)
 False/misleading       -&gt; numbers that don't match the underlying reality
</code></pre>
<div class="callout"><span class="badge">Transparency is a market good</span> Fair, timely disclosure isn't just a compliance chore — it's what lets prices reflect real information, which is the entire point of having a market in the first place.</div>`,
    `<span class="eyebrow">FLE201 · Chương 6 · Bài 6.1</span>
<h2>Công bố thông tin &amp; minh bạch</h2>
<h3>Hai "đồng hồ" công bố thông tin</h3>
<ul>
<li><strong>Công bố định kỳ</strong> — báo cáo theo lịch cố định: báo cáo tài chính quý/năm, báo cáo thường niên, báo cáo quản trị công ty.</li>
<li><strong>Công bố theo sự kiện</strong> — kích hoạt ngay khi xảy ra một "sự kiện trọng yếu" cụ thể: xoá sổ tài sản lớn, thay đổi cổ đông chi phối, vụ kiện, thay đổi xếp hạng tín nhiệm, giao dịch lớn với bên liên quan.</li>
</ul>
<h3>Nguyên tắc công bố công bằng</h3>
<p>Thông tin trọng yếu phải đến với <em>mọi</em> nhà đầu tư cùng một lúc — không có cuộc gọi riêng cho nhà phân tích, cuộc gặp riêng, hay "mách" trước khi công bố công khai. Đây là ý tưởng cốt lõi của các quy định như Regulation FD của SEC Hoa Kỳ, và được phản ánh trong nghĩa vụ công bố thông tin của công ty đại chúng Việt Nam (theo các thông tư hướng dẫn Luật Chứng khoán 2019): công ty đại chúng phải công bố sự kiện trọng yếu đồng thời trên hệ thống của sở giao dịch và website của mình, trong một khung giờ cố định.</p>
<pre><code>Các kiểu công bố sai:
 Công bố chọn lọc  -&gt; nói riêng cho nhà phân tích/nhà đầu tư "quen biết" trước
 Công bố trễ        -&gt; giữ tin xấu quá thời hạn luật định
 Công bố chìm        -&gt; về mặt kỹ thuật đã công bố, nhưng thực tế không ai đọc được (chú thích 47, trang 212)
 Sai lệch/gây hiểu nhầm -&gt; số liệu không khớp thực tế
</code></pre>
<div class="callout"><span class="badge">Minh bạch là lợi ích của thị trường</span> Công bố công bằng, đúng hạn không chỉ là việc tuân thủ — đó là điều giúp giá phản ánh thông tin thật, chính là mục đích tồn tại của thị trường.</div>`,
  ]]);

const c6q = quiz('fle201-quiz-6', 'Quiz 6 — Disclosure & transparency|||Quiz 6 — Công bố & minh bạch', [
  { id: 'q1', question: 'Công bố "theo sự kiện" khác công bố "định kỳ" thế nào?', options: ['Định kỳ theo lịch cố định; sự kiện kích hoạt ngay khi có việc trọng yếu xảy ra', 'Hai loại này giống nhau hoàn toàn', 'Sự kiện chỉ áp dụng cho ngân hàng', 'Định kỳ không bắt buộc theo luật'], correctIndex: 0, explanation: 'Định kỳ: báo cáo quý/năm theo lịch. Sự kiện: công bố ngay khi phát sinh việc trọng yếu.' },
  { id: 'q2', question: 'Nguyên tắc công bố công bằng (fair disclosure) yêu cầu điều gì?', options: ['Chỉ công bố cho nhà đầu tư lớn', 'Thông tin trọng yếu đến mọi nhà đầu tư cùng lúc, không ưu tiên riêng ai', 'Công bố sau khi giá đã biến động', 'Không cần công bố nếu thông tin bất lợi'], correctIndex: 1, explanation: 'Không có công bố chọn lọc — mọi nhà đầu tư nhận thông tin trọng yếu đồng thời.' },
  { id: 'q3', question: '"Công bố chìm" (buried disclosure) nghĩa là gì?', options: ['Không công bố gì cả', 'Về kỹ thuật đã công bố nhưng thực tế khó/không đọc được', 'Công bố qua truyền hình quốc gia', 'Công bố trước khi sự kiện xảy ra'], correctIndex: 1, explanation: 'Thông tin được "công bố" đúng nghĩa đen nhưng bị giấu trong chi tiết khó tiếp cận — vẫn là một dạng vi phạm minh bạch thực chất.' },
]);

const c7 = doc('fle201-7-1-aml-compliance', '7.1 — Anti-money laundering (AML) & compliance|||7.1 — Phòng chống rửa tiền (AML) & tuân thủ',
  'Ba giai đoạn rửa tiền (placement, layering, integration); KYC/CDD; nghĩa vụ báo cáo giao dịch đáng ngờ; Luật Phòng, chống rửa tiền 2022 & chuẩn FATF.',
  [[
    `<span class="eyebrow">FLE201 · Chapter 7 · Lesson 7.1</span>
<h2>Anti-money laundering (AML) &amp; compliance</h2>
<h3>The three stages of money laundering</h3>
<pre><code>1. Placement    -&gt; dirty cash enters the financial system (deposits, cash-intensive businesses)
2. Layering     -&gt; funds are moved through many transactions/accounts/jurisdictions to obscure origin
3. Integration  -&gt; "clean" funds re-enter the legitimate economy (real estate, businesses, investments)
</code></pre>
<h3>What a financial institution must do</h3>
<ul>
<li><strong>KYC / Customer Due Diligence (CDD)</strong> — verify who the customer really is, and for companies, who ultimately owns/controls them (beneficial ownership).</li>
<li><strong>Ongoing monitoring</strong> — watch for transaction patterns inconsistent with the customer's known profile (a small trader suddenly moving tens of billions of VND).</li>
<li><strong>Suspicious transaction reports (STRs)</strong> — file with the AML authority when a transaction looks suspicious, without tipping off the customer.</li>
<li><strong>Recordkeeping</strong> — retain transaction and identification records for the legally required period.</li>
</ul>
<h3>Vietnam's framework</h3>
<p>The Law on Anti-Money Laundering 2022 sets these obligations for banks, securities firms and other reporting entities, aligning Vietnam with the international <strong>FATF (Financial Action Task Force)</strong> standards — the global reference set of 40 Recommendations that most countries' AML laws are built around.</p>
<div class="callout"><span class="badge">Compliance is a duty to the system, not just the client</span> AML rules exist to protect the financial system itself from being used for crime — which is why "the customer wants privacy" is never a valid reason to skip an STR.</div>`,
    `<span class="eyebrow">FLE201 · Chương 7 · Bài 7.1</span>
<h2>Phòng chống rửa tiền (AML) &amp; tuân thủ</h2>
<h3>Ba giai đoạn của rửa tiền</h3>
<pre><code>1. Placement (đưa vào)   -&gt; tiền bẩn đi vào hệ thống tài chính (gửi tiền, kinh doanh dùng nhiều tiền mặt)
2. Layering (phân lớp)   -&gt; luân chuyển qua nhiều giao dịch/tài khoản/quốc gia để che nguồn gốc
3. Integration (hợp thức hoá) -&gt; tiền "sạch" quay lại nền kinh tế hợp pháp (bất động sản, doanh nghiệp, đầu tư)
</code></pre>
<h3>Tổ chức tài chính phải làm gì</h3>
<ul>
<li><strong>KYC / Nhận biết khách hàng (CDD)</strong> — xác minh khách hàng thực sự là ai, và với doanh nghiệp, ai là chủ sở hữu/kiểm soát cuối cùng (beneficial ownership).</li>
<li><strong>Giám sát liên tục</strong> — theo dõi các mẫu giao dịch không khớp với hồ sơ đã biết của khách hàng (một nhà giao dịch nhỏ bất ngờ chuyển hàng chục tỷ đồng).</li>
<li><strong>Báo cáo giao dịch đáng ngờ (STR)</strong> — nộp cho cơ quan phòng chống rửa tiền khi giao dịch có dấu hiệu đáng ngờ, không được báo trước cho khách hàng.</li>
<li><strong>Lưu trữ hồ sơ</strong> — giữ hồ sơ giao dịch và định danh trong thời hạn luật quy định.</li>
</ul>
<h3>Khung pháp lý Việt Nam</h3>
<p>Luật Phòng, chống rửa tiền 2022 đặt các nghĩa vụ này cho ngân hàng, công ty chứng khoán và các đối tượng báo cáo khác, đưa Việt Nam theo chuẩn quốc tế của <strong>FATF (Lực lượng Đặc nhiệm Tài chính)</strong> — bộ 40 Khuyến nghị làm chuẩn tham chiếu toàn cầu mà hầu hết luật AML các nước dựa vào.</p>
<div class="callout"><span class="badge">Tuân thủ là nghĩa vụ với cả hệ thống, không chỉ với khách hàng</span> Quy định AML tồn tại để bảo vệ chính hệ thống tài chính khỏi bị lợi dụng cho tội phạm — vì vậy "khách hàng muốn giữ riêng tư" không bao giờ là lý do hợp lệ để bỏ qua báo cáo STR.</div>`,
  ]]);

const c7q = quiz('fle201-quiz-7', 'Quiz 7 — AML & compliance|||Quiz 7 — AML & tuân thủ', [
  { id: 'q1', question: 'Ba giai đoạn rửa tiền theo thứ tự đúng là gì?', options: ['Layering → Placement → Integration', 'Placement → Layering → Integration', 'Integration → Placement → Layering', 'Chỉ có hai giai đoạn'], correctIndex: 1, explanation: 'Đưa tiền vào hệ thống → phân lớp che nguồn gốc → hợp thức hoá vào kinh tế thật.' },
  { id: 'q2', question: 'KYC/CDD yêu cầu tổ chức tài chính làm gì?', options: ['Từ chối mọi khách hàng mới', 'Xác minh danh tính thật & chủ sở hữu cuối cùng của khách hàng', 'Chỉ áp dụng cho khách hàng nước ngoài', 'Bỏ qua với khách hàng lâu năm'], correctIndex: 1, explanation: 'KYC/CDD xác minh khách hàng thực sự là ai, kể cả beneficial ownership của doanh nghiệp.' },
  { id: 'q3', question: 'FATF là tổ chức đóng vai trò gì trong AML?', options: ['Cơ quan quản lý chứng khoán Việt Nam', 'Đặt chuẩn quốc tế (40 Khuyến nghị) mà luật AML nhiều nước dựa vào', 'Ngân hàng trung ương toàn cầu', 'Cơ quan xếp hạng tín nhiệm'], correctIndex: 1, explanation: 'FATF là chuẩn tham chiếu toàn cầu cho khung pháp lý phòng chống rửa tiền.' },
]);

const c8 = doc('fle201-8-1-governance-esg-case-study', '8.1 — Corporate governance, ESG & case-study practice|||8.1 — Quản trị công ty, ESG & tình huống thực tế',
  'Nguyên tắc quản trị công ty (HĐQT độc lập, quyền cổ đông); ba trụ cột ESG; khung phân tích tình huống áp dụng luật + đạo đức cho toàn môn.',
  [[
    `<span class="eyebrow">FLE201 · Chapter 8 · Lesson 8.1</span>
<h2>Corporate governance, ESG &amp; case-study practice</h2>
<h3>Core governance principles</h3>
<ul>
<li><strong>Board independence</strong> — enough directors free of ties to management/controlling shareholders to actually challenge decisions.</li>
<li><strong>Shareholder rights</strong> — equal treatment of minority shareholders, transparent voting, protection from majority-shareholder abuse.</li>
<li><strong>Internal control &amp; audit</strong> — an audit committee and internal-control function independent enough to catch problems before regulators do.</li>
</ul>
<h3>ESG's three pillars</h3>
<pre><code>Environmental -&gt; emissions, resource use, climate risk exposure
Social        -&gt; labour practices, customer/data protection, community impact
Governance    -&gt; board structure, executive pay, anti-corruption controls, shareholder rights
</code></pre>
<p>For a finance professional, ESG is not a side topic: a company with weak governance is statistically more likely to also have the disclosure, conflict-of-interest and fraud problems covered in chapters 4–6 — governance quality is a leading indicator, not just a compliance checkbox.</p>
<h3>A case-study framework for the whole course</h3>
<pre><code>1. Facts       -&gt; what actually happened, in order, who did what
2. Legal test  -&gt; which law/regulator applies; was a specific rule broken?
3. Ethics test -&gt; even if legal, whose trust was affected, and how?
4. Root cause  -&gt; incentive, oversight gap, or culture that let it happen
5. Fix         -&gt; what rule/control/disclosure would have prevented it
</code></pre>
<div class="callout"><span class="badge">Apply the whole course</span> Every real scandal in this course — FLC, SCB/Vạn Thịnh Phát, Enron — touches multiple chapters at once: a governance failure that enabled a conflict of interest, hidden by weak disclosure, sometimes crossing into market manipulation. Use the 5-step framework above to take any news case apart.</div>`,
    `<span class="eyebrow">FLE201 · Chương 8 · Bài 8.1</span>
<h2>Quản trị công ty, ESG &amp; tình huống thực tế</h2>
<h3>Nguyên tắc quản trị công ty cốt lõi</h3>
<ul>
<li><strong>HĐQT độc lập</strong> — đủ số thành viên không có ràng buộc với ban điều hành/cổ đông chi phối để thực sự phản biện quyết định.</li>
<li><strong>Quyền cổ đông</strong> — đối xử bình đẳng với cổ đông thiểu số, biểu quyết minh bạch, bảo vệ khỏi sự lạm dụng của cổ đông đa số.</li>
<li><strong>Kiểm soát nội bộ &amp; kiểm toán</strong> — ban kiểm toán và chức năng kiểm soát nội bộ đủ độc lập để phát hiện vấn đề trước khi cơ quan quản lý làm việc đó.</li>
</ul>
<h3>Ba trụ cột của ESG</h3>
<pre><code>Environmental (Môi trường) -&gt; phát thải, sử dụng tài nguyên, rủi ro khí hậu
Social (Xã hội)             -&gt; điều kiện lao động, bảo vệ khách hàng/dữ liệu, tác động cộng đồng
Governance (Quản trị)       -&gt; cơ cấu HĐQT, lương lãnh đạo, kiểm soát chống tham nhũng, quyền cổ đông
</code></pre>
<p>Với người làm tài chính, ESG không phải chủ đề phụ: một công ty quản trị yếu có khả năng thống kê cao hơn cũng gặp vấn đề công bố thông tin, xung đột lợi ích và gian lận như các chương 4–6 đã học — chất lượng quản trị là chỉ báo sớm, không chỉ là ô cần tick trong checklist tuân thủ.</p>
<h3>Khung phân tích tình huống cho cả môn học</h3>
<pre><code>1. Sự việc      -&gt; điều gì thực sự xảy ra, theo thứ tự, ai làm gì
2. Kiểm tra luật -&gt; luật/cơ quan quản lý nào áp dụng; có điều khoản cụ thể bị vi phạm không?
3. Kiểm tra đạo đức -&gt; dù hợp pháp, niềm tin của ai bị ảnh hưởng, và bằng cách nào?
4. Nguyên nhân gốc -&gt; động cơ, lỗ hổng giám sát, hoặc văn hoá nào đã cho phép việc đó xảy ra
5. Cách sửa     -&gt; quy định/kiểm soát/công bố nào có thể đã ngăn được nó
</code></pre>
<div class="callout"><span class="badge">Áp dụng cả môn học</span> Mọi vụ bê bối thật trong môn này — FLC, SCB/Vạn Thịnh Phát, Enron — đều chạm nhiều chương cùng lúc: một lỗ hổng quản trị tạo điều kiện cho xung đột lợi ích, bị che bởi công bố thông tin yếu, đôi khi lấn sang thao túng thị trường. Dùng khung 5 bước trên để phân tích bất kỳ vụ việc thời sự nào.</div>`,
  ]]);

const c8q = quiz('fle201-quiz-8', 'Quiz 8 — Governance, ESG & case study|||Quiz 8 — Quản trị, ESG & tình huống', [
  { id: 'q1', question: 'Vì sao HĐQT độc lập quan trọng với quản trị công ty?', options: ['Vì luật bắt buộc phải có nhiều thành viên', 'Vì đủ độc lập để thực sự phản biện quyết định của ban điều hành/cổ đông chi phối', 'Vì giúp công ty tăng giá cổ phiếu ngắn hạn', 'Vì không liên quan đến rủi ro gian lận'], correctIndex: 1, explanation: 'Tính độc lập giúp HĐQT giám sát thực chất, không chỉ mang tính hình thức.' },
  { id: 'q2', question: 'Ba trụ cột ESG là gì?', options: ['Equity, Strategy, Growth', 'Environmental, Social, Governance', 'Ethics, Standards, Governance', 'Efficiency, Sustainability, Gain'], correctIndex: 1, explanation: 'ESG = Environmental (môi trường), Social (xã hội), Governance (quản trị).' },
  { id: 'q3', question: 'Trong khung phân tích tình huống 5 bước, bước "Kiểm tra đạo đức" hỏi điều gì?', options: ['Vụ việc có vi phạm luật hình sự không', 'Dù hợp pháp, niềm tin của ai bị ảnh hưởng và bằng cách nào', 'Công ty có lãi hay lỗ trong năm đó', 'Cổ phiếu tăng hay giảm sau vụ việc'], correctIndex: 1, explanation: 'Bước đạo đức tách riêng khỏi bước pháp lý: xét xem hành vi có hại niềm tin dù không phạm luật.' },
]);

const taiLieu = doc('fle201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, CFA Institute Code of Ethics & Standards, sách "Finance Ethics" (Boatright), Luật Chứng khoán 2019, Luật Các TCTD 2024, cơ sở dữ liệu văn bản pháp luật.',
  [[
    `<span class="eyebrow">FLE201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study Financial Law and Ethics in Finance — Vietnam's legal framework, the CFA Code of Ethics, and the classic abuse patterns (insider trading, conflicts of interest, AML) — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are the reference sources this course draws on.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for FLE201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Professional ethics standards</h3>
<ul>
<li><a href="https://www.cfainstitute.org/en/ethics-standards" target="_blank" rel="noopener">CFA Institute — Code of Ethics &amp; Standards of Professional Conduct</a> (the global reference cited in Chapter 3)</li>
<li><a href="https://www.cfainstitute.org" target="_blank" rel="noopener">CFA Institute — homepage</a></li>
</ul>
<h3>📙 Reference book</h3>
<ul>
<li><a href="https://openlibrary.org/search?q=Finance+Ethics+Boatright" target="_blank" rel="noopener"><em>Finance Ethics: Critical Issues in Theory and Practice</em> — John R. Boatright (Open Library search)</a></li>
</ul>
<h3>⚖️ Vietnamese law sources</h3>
<ul>
<li><a href="https://vbpl.vn" target="_blank" rel="noopener">Cơ sở dữ liệu quốc gia về văn bản pháp luật (vbpl.vn)</a> — official text of the Securities Law 2019 (Luật Chứng khoán, No. 54/2019/QH14) and the Law on Credit Institutions 2024 (Luật Các TCTD, No. 32/2024/QH15)</li>
<li><a href="https://thuvienphapluat.vn" target="_blank" rel="noopener">Thư Viện Pháp Luật (thuvienphapluat.vn)</a> — searchable Vietnamese legal database, cross-referenced with related decrees/circulars</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the law/ethics distinction (Ch.1), Vietnam's regulators &amp; pillar laws (Ch.2).</li>
<li><strong>Standards</strong> — read the CFA Code of Ethics &amp; Standards of Professional Conduct in full (Ch.3).</li>
<li><strong>Abuse patterns</strong> — insider trading/manipulation, conflicts/fiduciary duty, disclosure (Ch.4–6).</li>
<li><strong>Compliance &amp; governance</strong> — AML obligations, corporate governance &amp; ESG, then re-analyse real cases (FLC, SCB/Vạn Thịnh Phát) with the Ch.8 5-step framework.</li>
</ol></div>`,
    `<span class="eyebrow">FLE201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Luật Tài chính và Đạo đức trong Tài chính — khung pháp lý Việt Nam, CFA Code of Ethics, và các dạng lạm dụng kinh điển (nội gián, xung đột lợi ích, AML) — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là các nguồn tham chiếu môn học dựa vào.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của FLE201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Chuẩn đạo đức nghề nghiệp</h3>
<ul>
<li><a href="https://www.cfainstitute.org/en/ethics-standards" target="_blank" rel="noopener">CFA Institute — Code of Ethics &amp; Standards of Professional Conduct</a> (chuẩn toàn cầu được trích dẫn ở Chương 3)</li>
<li><a href="https://www.cfainstitute.org" target="_blank" rel="noopener">CFA Institute — trang chủ</a></li>
</ul>
<h3>📙 Sách tham khảo</h3>
<ul>
<li><a href="https://openlibrary.org/search?q=Finance+Ethics+Boatright" target="_blank" rel="noopener"><em>Finance Ethics: Critical Issues in Theory and Practice</em> — John R. Boatright (tìm trên Open Library)</a></li>
</ul>
<h3>⚖️ Nguồn luật Việt Nam</h3>
<ul>
<li><a href="https://vbpl.vn" target="_blank" rel="noopener">Cơ sở dữ liệu quốc gia về văn bản pháp luật (vbpl.vn)</a> — văn bản chính thức Luật Chứng khoán 2019 (Luật số 54/2019/QH14) và Luật Các tổ chức tín dụng 2024 (Luật số 32/2024/QH15)</li>
<li><a href="https://thuvienphapluat.vn" target="_blank" rel="noopener">Thư Viện Pháp Luật (thuvienphapluat.vn)</a> — cơ sở dữ liệu pháp luật Việt Nam có thể tra cứu, đối chiếu nghị định/thông tư liên quan</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — phân biệt luật/đạo đức (Ch.1), cơ quan quản lý &amp; luật trụ cột Việt Nam (Ch.2).</li>
<li><strong>Chuẩn hành nghề</strong> — đọc đầy đủ CFA Code of Ethics &amp; Standards of Professional Conduct (Ch.3).</li>
<li><strong>Các dạng lạm dụng</strong> — nội gián/thao túng, xung đột lợi ích/uỷ thác, công bố thông tin (Ch.4–6).</li>
<li><strong>Tuân thủ &amp; quản trị</strong> — nghĩa vụ AML, quản trị công ty &amp; ESG, rồi phân tích lại các vụ việc thật (FLC, SCB/Vạn Thịnh Phát) bằng khung 5 bước ở Ch.8.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'FLE201',
    slug: 'fle201-financial-law-and-ethics-in-finance',
    title: 'Financial Law and Ethics in Finance',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FLE201.webp',
    shortDescription: 'Vietnam\'s financial legal framework & professional ethics — CFA Code of Ethics, insider trading & manipulation, conflicts of interest & fiduciary duty, disclosure, AML compliance, corporate governance & ESG. Bilingual, 8 chapters, quizzes.|||Khung pháp lý tài chính Việt Nam & đạo đức nghề — CFA Code of Ethics, nội gián & thao túng, xung đột lợi ích & nghĩa vụ uỷ thác, công bố thông tin, tuân thủ AML, quản trị công ty & ESG. Song ngữ, 8 chương, có quiz.',
    description: 'Môn <strong>FLE201 — Financial Law and Ethics in Finance</strong> (kỳ 3, khối BBA) xây hai lớp bảo vệ của người làm tài chính: <strong>luật pháp</strong> và <strong>đạo đức nghề nghiệp</strong>. Từ <strong>khung pháp lý Việt Nam</strong> (NHNN, UBCKNN, Luật Chứng khoán 2019, Luật Các TCTD 2024) → <strong>CFA Code of Ethics</strong> → ba vùng lạm dụng kinh điển: <strong>nội gián/thao túng</strong>, <strong>xung đột lợi ích/uỷ thác</strong>, <strong>công bố thông tin</strong> → <strong>AML</strong> → <strong>quản trị công ty &amp; ESG</strong> với khung phân tích tình huống thực tế (FLC, SCB/Vạn Thịnh Phát). Bám giáo trình FLM, song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Phân biệt luật vs đạo đức; cơ quan quản lý & luật trụ cột tài chính Việt Nam; 6 nguyên tắc & 7 nhóm Standards trong CFA Code of Ethics; nhận diện giao dịch nội gián (MNPI) & thao túng thị trường; nghĩa vụ uỷ thác (duty of loyalty/care) & quản lý xung đột lợi ích; công bố thông tin định kỳ/sự kiện & nguyên tắc công bố công bằng; ba giai đoạn rửa tiền & nghĩa vụ AML/KYC; nguyên tắc quản trị công ty & ba trụ cột ESG; khung 5 bước phân tích tình huống thực tế.',
    requirements: 'Không yêu cầu kiến thức tài chính chuyên sâu trước đó. Nên đọc trước tin tức về các vụ việc tài chính Việt Nam gần đây (FLC, SCB/Vạn Thịnh Phát) để liên hệ thực tế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, CFA Code of Ethics, sách Boatright, Luật Chứng khoán 2019, Luật Các TCTD 2024.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao tài chính cần cả luật & đạo đức; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan luật & đạo đức|||Chapter 1 — Overview of law & ethics', description: 'Luật vs đạo đức, khoảng trống "hợp pháp nhưng phi đạo đức".', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khung pháp lý tài chính Việt Nam|||Chapter 2 — Vietnam legal framework', description: 'NHNN, UBCKNN, Luật Các TCTD 2024, Luật Chứng khoán 2019.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đạo đức & CFA Code of Ethics|||Chapter 3 — Ethics & CFA Code of Ethics', description: '6 nguyên tắc & 7 nhóm Standards of Professional Conduct.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Nội gián & thao túng thị trường|||Chapter 4 — Insider trading & manipulation', description: 'MNPI, pump-and-dump, wash trading, case FLC.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Xung đột lợi ích & nghĩa vụ uỷ thác|||Chapter 5 — Conflicts of interest & fiduciary duty', description: 'Duty of loyalty/care, giao dịch bên liên quan, quản lý xung đột.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Công bố thông tin & minh bạch|||Chapter 6 — Disclosure & transparency', description: 'Công bố định kỳ/sự kiện, nguyên tắc công bố công bằng.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phòng chống rửa tiền (AML)|||Chapter 7 — Anti-money laundering (AML)', description: 'Placement/layering/integration, KYC, FATF.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quản trị công ty, ESG & tình huống|||Chapter 8 — Governance, ESG & case study', description: 'HĐQT độc lập, ba trụ cột ESG, khung 5 bước phân tích.', lessons: [c8, c8q] },
  ],
};
