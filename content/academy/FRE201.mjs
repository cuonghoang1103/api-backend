/**
 * FRE201 — Fintech Regulations and Ethics. Giáo trình FLM (syl) + tham khảo:
 * "The FINTECH Book" (Chishti/Barberis); "Regulatory Technology"; Nghị định
 * sandbox Fintech Việt Nam; tài liệu NHNN. 8 chương: tổng quan & vì sao cần
 * quản lý, khung pháp lý (giấy phép/sandbox/NHNN), bảo vệ NTD tài chính, bảo
 * mật dữ liệu (GDPR/NĐ 13), AML/KYC, đạo đức AI/thuật toán tài chính, quy
 * định crypto/tài sản ảo, RegTech & xu hướng toàn cầu. Song ngữ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('fre201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách tham khảo (kèm link), khung pháp lý & sandbox Việt Nam, tài liệu chính thức NHNN, tổ chức quốc tế, lộ trình tự học.',
  [[
    `<span class="eyebrow">FRE201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Fintech Regulations and Ethics — legal frameworks, consumer &amp; data protection, AML/KYC, AI ethics, crypto rules and RegTech — in one place. The official FPTU giáo trình &amp; slides live on <strong>FLM</strong>; below are free, legal reference resources.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/The+FINTECH+Book%3A+The+Financial+Technology+Handbook+for+Investors%2C+Entrepreneurs+and+Visionaries-p-9781119218881" target="_blank" rel="noopener"><em>The FINTECH Book</em> — Susanne Chishti &amp; Janos Barberis</a></li>
<li><a href="https://www.wiley.com/en-us/The+REGTECH+Book%3A+The+Financial+Technology+Handbook+for+Investors%2C+Entrepreneurs+and+Visionaries+in+Regulation-p-9781119362188" target="_blank" rel="noopener"><em>Regulatory Technology (RegTech)</em> — Chishti, Barberis, et al.</a></li>
</ul>
<h3>🇻🇳 Official Vietnam documentation</h3>
<ul>
<li><a href="https://sbv.gov.vn/" target="_blank" rel="noopener">Ngân hàng Nhà nước Việt Nam (SBV) — official site</a></li>
<li><a href="https://thuvienphapluat.vn/van-ban/Tien-te-Ngan-hang/Nghi-dinh-13-2023-ND-CP-bao-ve-du-lieu-ca-nhan-543619.aspx" target="_blank" rel="noopener">Nghị định 13/2023/NĐ-CP — bảo vệ dữ liệu cá nhân</a></li>
<li><a href="https://thuvienphapluat.vn/" target="_blank" rel="noopener">Thư viện Pháp luật — văn bản pháp luật Việt Nam</a></li>
</ul>
<h3>🌐 International / official documentation</h3>
<ul>
<li><a href="https://www.fatf-gafi.org/" target="_blank" rel="noopener">FATF — Financial Action Task Force (AML/CFT standards)</a></li>
<li><a href="https://gdpr.eu/" target="_blank" rel="noopener">GDPR.eu — official text &amp; guidance</a></li>
<li><a href="https://finance.ec.europa.eu/digital-finance/markets-crypto-assets-regulation-mica_en" target="_blank" rel="noopener">EU MiCA — Markets in Crypto-Assets Regulation</a></li>
<li><a href="https://www.bis.org/bcbs/" target="_blank" rel="noopener">Basel Committee on Banking Supervision (BIS)</a></li>
</ul>
<h3>▶️ Talks &amp; explainers</h3>
<ul>
<li><a href="https://www.youtube.com/@Fintech" target="_blank" rel="noopener">Fintech-focused explainer channels (search "fintech regulation explained")</a></li>
<li><a href="https://www.imf.org/en/Topics/fintech" target="_blank" rel="noopener">IMF — Fintech topic hub</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — why fintech needs regulation, licensing &amp; the sandbox, consumer &amp; data protection basics.</li>
<li><strong>Practice</strong> — map a real fintech product (e-wallet, P2P lending app) to the licences and rules it needs.</li>
<li><strong>Go deeper</strong> — AML/KYC flows, algorithmic/credit-scoring ethics, crypto regulation.</li>
<li><strong>Job-ready</strong> — read one real regulator sandbox decision or enforcement case end to end; understand RegTech tooling.</li>
</ol></div>`,
    `<span class="eyebrow">FRE201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Quy định pháp lý và Đạo đức trong Fintech — khung pháp lý, bảo vệ người tiêu dùng &amp; dữ liệu, AML/KYC, đạo đức AI, quy định crypto và RegTech — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn tham khảo miễn phí, hợp pháp.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/The+FINTECH+Book%3A+The+Financial+Technology+Handbook+for+Investors%2C+Entrepreneurs+and+Visionaries-p-9781119218881" target="_blank" rel="noopener"><em>The FINTECH Book</em> — Susanne Chishti &amp; Janos Barberis</a></li>
<li><a href="https://www.wiley.com/en-us/The+REGTECH+Book%3A+The+Financial+Technology+Handbook+for+Investors%2C+Entrepreneurs+and+Visionaries+in+Regulation-p-9781119362188" target="_blank" rel="noopener"><em>Regulatory Technology (RegTech)</em> — Chishti, Barberis, et al.</a></li>
</ul>
<h3>🇻🇳 Tài liệu chính thức Việt Nam</h3>
<ul>
<li><a href="https://sbv.gov.vn/" target="_blank" rel="noopener">Ngân hàng Nhà nước Việt Nam (NHNN) — trang chính thức</a></li>
<li><a href="https://thuvienphapluat.vn/van-ban/Tien-te-Ngan-hang/Nghi-dinh-13-2023-ND-CP-bao-ve-du-lieu-ca-nhan-543619.aspx" target="_blank" rel="noopener">Nghị định 13/2023/NĐ-CP — bảo vệ dữ liệu cá nhân</a></li>
<li><a href="https://thuvienphapluat.vn/" target="_blank" rel="noopener">Thư viện Pháp luật — văn bản pháp luật Việt Nam</a></li>
</ul>
<h3>🌐 Tài liệu quốc tế / chính thức</h3>
<ul>
<li><a href="https://www.fatf-gafi.org/" target="_blank" rel="noopener">FATF — Lực lượng đặc nhiệm tài chính quốc tế (chuẩn AML/CFT)</a></li>
<li><a href="https://gdpr.eu/" target="_blank" rel="noopener">GDPR.eu — văn bản gốc &amp; hướng dẫn</a></li>
<li><a href="https://finance.ec.europa.eu/digital-finance/markets-crypto-assets-regulation-mica_en" target="_blank" rel="noopener">EU MiCA — Quy định thị trường tài sản mã hoá</a></li>
<li><a href="https://www.bis.org/bcbs/" target="_blank" rel="noopener">Uỷ ban Basel về Giám sát Ngân hàng (BIS)</a></li>
</ul>
<h3>▶️ Video &amp; giải thích</h3>
<ul>
<li><a href="https://www.imf.org/en/Topics/fintech" target="_blank" rel="noopener">IMF — trang chủ đề Fintech</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — vì sao fintech cần quản lý, giấy phép &amp; sandbox, bảo vệ NTD &amp; dữ liệu cơ bản.</li>
<li><strong>Luyện tập</strong> — đối chiếu một sản phẩm fintech thật (ví điện tử, app P2P lending) với các giấy phép/quy định cần có.</li>
<li><strong>Đào sâu</strong> — quy trình AML/KYC, đạo đức thuật toán/chấm điểm tín dụng, quy định crypto.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc trọn một quyết định sandbox hoặc vụ xử phạt thật; hiểu công cụ RegTech.</li>
</ol></div>`,
  ]]);

const intro = doc('fre201-0-1-overview', 'Course overview: Fintech Regulations and Ethics|||Tổng quan: Quy định pháp lý và Đạo đức trong Fintech',
  'Fintech là gì, vì sao càn phát triển nhanh cần được quản lý, tam giác đổi mới–ổn định–bảo vệ; lộ trình 8 chương từ khung pháp lý tới RegTech.',
  [[
    `<span class="eyebrow">FRE201 · Lesson 0.1 · Overview</span>
<h2>Fintech Regulations and Ethics</h2>
<p class="lead">This course explains <strong>how fintech is regulated, and why</strong> — from licensing and sandboxes, to consumer &amp; data protection, anti-money-laundering, the ethics of algorithmic decisions, crypto rules, and the RegTech tools that make compliance possible at scale.</p>
<h3>What is fintech?</h3>
<p><strong>Fintech (financial technology)</strong> is technology applied to financial services: digital payments, e-wallets, P2P lending, digital banking, robo-advisors, InsurTech, and crypto-assets. It moves fast because software iterates faster than banking regulation was ever designed for.</p>
<h3>Why regulate it at all?</h3>
<ul>
<li><strong>Consumer protection</strong> — people can lose real money to unclear fees, unfair contracts, or fraud.</li>
<li><strong>Financial stability</strong> — a large enough fintech failure can ripple into the wider financial system.</li>
<li><strong>Fair competition</strong> — a licensed bank and an unlicensed app should not play by different rules for the same activity.</li>
<li><strong>Controlled innovation</strong> — regulation that is too slow kills useful innovation; regulation that is absent invites the next scandal.</li>
</ul>
<h3>The regulatory triangle</h3>
<pre><code>        Innovation
           / \\
          /   \\
   Protection — Stability
</code></pre>
<p>Every rule in this course trades off between these three corners. A sandbox leans toward innovation; a hard KYC rule leans toward stability/protection.</p>
<h3>Roadmap</h3>
<p>Legal framework &amp; sandbox (NHNN) → consumer protection → data privacy (GDPR, Decree 13) → AML/KYC → AI/algorithmic ethics → crypto &amp; virtual assets → RegTech &amp; global trends. Bilingual, with real Vietnamese and international cases and a quiz per chapter.</p>`,
    `<span class="eyebrow">FRE201 · Bài 0.1 · Tổng quan</span>
<h2>Quy định pháp lý và Đạo đức trong Fintech</h2>
<p class="lead">Môn này giải thích <strong>fintech được quản lý ra sao, và vì sao</strong> — từ cấp phép và sandbox, đến bảo vệ người tiêu dùng &amp; dữ liệu, chống rửa tiền, đạo đức của các quyết định thuật toán, quy định crypto, và các công cụ RegTech giúp tuân thủ được ở quy mô lớn.</p>
<h3>Fintech là gì?</h3>
<p><strong>Fintech (công nghệ tài chính)</strong> là công nghệ áp dụng vào dịch vụ tài chính: thanh toán số, ví điện tử, cho vay ngang hàng (P2P lending), ngân hàng số, robo-advisor, InsurTech, và tài sản crypto. Nó phát triển nhanh vì phần mềm lặp lại nhanh hơn tốc độ mà luật ngân hàng từng được thiết kế để theo kịp.</p>
<h3>Vì sao phải quản lý?</h3>
<ul>
<li><strong>Bảo vệ người tiêu dùng</strong> — người dùng có thể mất tiền thật vì phí không rõ ràng, hợp đồng bất công, hoặc lừa đảo.</li>
<li><strong>Ổn định tài chính</strong> — một sự sụp đổ fintech đủ lớn có thể lan sang cả hệ thống tài chính.</li>
<li><strong>Cạnh tranh công bằng</strong> — một ngân hàng có phép và một app không phép không nên chơi theo luật khác nhau cho cùng một hoạt động.</li>
<li><strong>Đổi mới có kiểm soát</strong> — quản lý quá chậm giết chết đổi mới có ích; không quản lý thì mời gọi vụ bê bối kế tiếp.</li>
</ul>
<h3>Tam giác quản lý</h3>
<pre><code>         Đổi mới
           / \\
          /   \\
    Bảo vệ — Ổn định
</code></pre>
<p>Mọi quy định trong môn này đều đánh đổi giữa ba góc đó. Một sandbox nghiêng về đổi mới; một quy tắc KYC chặt nghiêng về ổn định/bảo vệ.</p>
<h3>Lộ trình</h3>
<p>Khung pháp lý &amp; sandbox (NHNN) → bảo vệ người tiêu dùng → bảo mật dữ liệu (GDPR, NĐ 13) → AML/KYC → đạo đức AI/thuật toán → crypto &amp; tài sản ảo → RegTech &amp; xu hướng toàn cầu. Song ngữ, có ca thực tế tại Việt Nam và quốc tế, quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('fre201-1-1-fintech-and-regulation', '1.1 — What is fintech, and why regulate it|||1.1 — Fintech là gì và vì sao cần quản lý',
  'Các nhóm fintech (thanh toán, cho vay, ngân hàng số, InsurTech, crypto); rủi ro nếu không quản lý; case ICO 2017 và sụp đổ Terra/LUNA & FTX 2022; ba mục tiêu của cơ quan quản lý.',
  [[
    `<span class="eyebrow">FRE201 · Chapter 1 · Lesson 1.1</span>
<h2>What is fintech, and why regulate it</h2>
<h3>The main fintech categories</h3>
<ul>
<li><strong>Payments</strong> — e-wallets, payment intermediaries, QR/instant transfer.</li>
<li><strong>Lending</strong> — P2P lending, buy-now-pay-later, alternative credit scoring.</li>
<li><strong>Digital banking</strong> — neobanks, robo-advisors, wealthtech.</li>
<li><strong>InsurTech</strong> — usage-based insurance, automated claims.</li>
<li><strong>Crypto &amp; blockchain</strong> — exchanges, stablecoins, DeFi.</li>
</ul>
<h3>What happens without regulation</h3>
<p>Two cautionary cases show the cost of a regulatory vacuum:</p>
<ul>
<li><strong>The 2017 ICO boom</strong> — thousands of "initial coin offerings" raised billions with no disclosure standard; a large share turned out to be fraud or vaporware, and retail investors had no recourse.</li>
<li><strong>Terra/LUNA (May 2022) &amp; FTX (Nov 2022)</strong> — an "algorithmic stablecoin" de-pegged and erased ~$40B in days; months later a major exchange collapsed after commingling customer funds with a trading arm — something a licensed, regulated custodian would not have been allowed to do.</li>
</ul>
<h3>Three goals every regulator balances</h3>
<pre><code>1. Consumer &amp; investor protection — clear disclosure, recourse when things go wrong
2. Financial system stability   — no single failure should cascade
3. Market integrity &amp; fair competition — same rules for same risk, regardless of "fintech" label
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Regulation does not exist to slow fintech down for its own sake — it exists because the failure modes above are real, expensive, and have already happened more than once.</div>`,
    `<span class="eyebrow">FRE201 · Chương 1 · Bài 1.1</span>
<h2>Fintech là gì và vì sao cần quản lý</h2>
<h3>Các nhóm fintech chính</h3>
<ul>
<li><strong>Thanh toán</strong> — ví điện tử, trung gian thanh toán, chuyển tiền nhanh qua QR.</li>
<li><strong>Cho vay</strong> — cho vay ngang hàng (P2P lending), mua trước trả sau (BNPL), chấm điểm tín dụng thay thế.</li>
<li><strong>Ngân hàng số</strong> — neobank, robo-advisor, wealthtech.</li>
<li><strong>InsurTech</strong> — bảo hiểm theo mức sử dụng, xử lý bồi thường tự động.</li>
<li><strong>Crypto &amp; blockchain</strong> — sàn giao dịch, stablecoin, DeFi.</li>
</ul>
<h3>Điều gì xảy ra nếu không quản lý</h3>
<p>Hai ca cảnh báo cho thấy giá của một khoảng trống pháp lý:</p>
<ul>
<li><strong>Làn sóng ICO 2017</strong> — hàng nghìn "phát hành coin lần đầu" gọi vốn hàng tỉ đô mà không có chuẩn công bố thông tin nào; một phần lớn hoá ra là lừa đảo hoặc dự án ảo, nhà đầu tư cá nhân không có cách nào đòi lại.</li>
<li><strong>Terra/LUNA (5/2022) &amp; FTX (11/2022)</strong> — một "stablecoin thuật toán" mất chốt giá và xoá sổ ~40 tỉ đô trong vài ngày; vài tháng sau một sàn giao dịch lớn sụp đổ vì trộn lẫn tiền khách hàng với quỹ giao dịch riêng — điều mà một đơn vị lưu ký có phép, được quản lý sẽ không được phép làm.</li>
</ul>
<h3>Ba mục tiêu mà cơ quan quản lý phải cân bằng</h3>
<pre><code>1. Bảo vệ NTD &amp; nhà đầu tư — công bố rõ ràng, có kênh khiếu nại khi có sự cố
2. Ổn định hệ thống tài chính — không để một sự sụp đổ đơn lẻ lan rộng
3. Toàn vẹn thị trường &amp; cạnh tranh công bằng — cùng rủi ro thì cùng luật, không phân biệt "mác fintech"
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Quản lý không tồn tại để làm chậm fintech vì lý do riêng nó — nó tồn tại vì các kiểu thất bại trên là thật, đắt giá, và đã xảy ra nhiều hơn một lần.</div>`,
  ]]);

const c1q = quiz('fre201-quiz-1', 'Quiz 1 — Fintech & regulation|||Quiz 1 — Fintech & quản lý', [
  { id: 'q1', question: 'Sự sụp đổ của FTX (11/2022) cho thấy rủi ro nào?', options: ['Thiếu vốn hoá thị trường', 'Trộn lẫn tiền khách hàng với quỹ giao dịch riêng', 'Giá crypto biến động', 'Tốc độ giao dịch chậm'], correctIndex: 1, explanation: 'FTX commingling tiền khách với quỹ trading riêng — điều một custodian có phép, được quản lý không được làm.' },
  { id: 'q2', question: 'Tam giác mà cơ quan quản lý phải cân bằng gồm?', options: ['Đổi mới — Ổn định — Bảo vệ', 'Tốc độ — Giá — Chất lượng', 'Vốn — Lãi — Rủi ro', 'Cung — Cầu — Giá'], correctIndex: 0, explanation: 'Ba góc: đổi mới, ổn định hệ thống, bảo vệ NTD/nhà đầu tư.' },
  { id: 'q3', question: 'Vì sao làn sóng ICO 2017 là ví dụ về khoảng trống pháp lý?', options: ['Vì không ai đầu tư', 'Vì gọi vốn tỉ đô không có chuẩn công bố, nhiều dự án lừa đảo mà NTD không có cách đòi lại', 'Vì giá coin quá thấp', 'Vì chỉ là công nghệ mới, không liên quan quản lý'], correctIndex: 1, explanation: 'Không chuẩn disclosure + không cơ quan giám sát ⇒ rủi ro dồn hết lên nhà đầu tư cá nhân.' },
]);

const c2 = doc('fre201-2-1-legal-framework-sandbox', '2.1 — Legal framework: licensing, sandbox & the State Bank|||2.1 — Khung pháp lý: giấy phép, sandbox & NHNN',
  'NHNN là cơ quan quản lý chính cho fintech thanh toán/cho vay; giấy phép trung gian thanh toán; cơ chế thử nghiệm có kiểm soát (sandbox) cho P2P lending, chấm điểm tín dụng, chia sẻ dữ liệu mở.',
  [[
    `<span class="eyebrow">FRE201 · Chapter 2 · Lesson 2.1</span>
<h2>Legal framework: licensing, sandbox &amp; the State Bank</h2>
<h3>Who regulates what, in Vietnam</h3>
<ul>
<li><strong>State Bank of Vietnam (SBV / NHNN)</strong> — the primary regulator for payment fintech, digital lending, and banking-adjacent activity.</li>
<li><strong>State Securities Commission (SSC)</strong> — regulates crypto-assets that behave like securities, and digital investment platforms.</li>
<li><strong>Ministry of Industry and Trade</strong> — e-commerce platforms and some online payment flows.</li>
</ul>
<h3>The Payment Intermediary Licence</h3>
<p>A company offering e-wallets, payment gateways, or fund collection/disbursement services must hold a <strong>Payment Intermediary Licence</strong> from SBV — the licensing chain runs from the original payment decree through its later amendments. Requirements typically include minimum capital, a technical security audit, and an escrow arrangement so customer float is never at the operator's own risk.</p>
<h3>Why a regulatory sandbox exists</h3>
<p>New fintech models (P2P lending, alternative credit scoring, open-data sharing) often don't fit any existing licence category. Writing a full law first would take years the market doesn't have; regulating with zero rules invites the failures from Lesson 1.1. The <strong>Fintech Regulatory Sandbox</strong> is the middle path: a controlled, time-boxed, limited-scale trial under SBV supervision, before a permanent legal framework is finalized.</p>
<pre><code>Sandbox mechanics (typical):
  Scope     -> named fintech solutions only (e.g. P2P lending, credit scoring)
  Duration  -> fixed trial period (renewable), not indefinite
  Limits    -> capped customer numbers / transaction volume
  Oversight -> regular reporting to SBV; exit if consumer harm appears
  Outcome   -> either graduates into a real licence category, or is shut down
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> The sandbox is not a loophole — it is supervision at a smaller, reversible scale. A product operating in it is <em>not</em> unregulated; it is regulated differently, on purpose, for a limited time.</div>`,
    `<span class="eyebrow">FRE201 · Chương 2 · Bài 2.1</span>
<h2>Khung pháp lý: giấy phép, sandbox &amp; NHNN</h2>
<h3>Ai quản lý gì, tại Việt Nam</h3>
<ul>
<li><strong>Ngân hàng Nhà nước Việt Nam (NHNN)</strong> — cơ quan quản lý chính cho fintech thanh toán, cho vay số, và các hoạt động sát ngân hàng.</li>
<li><strong>Uỷ ban Chứng khoán Nhà nước (SSC)</strong> — quản lý tài sản crypto mang tính chất chứng khoán, và các nền tảng đầu tư số.</li>
<li><strong>Bộ Công Thương</strong> — sàn thương mại điện tử và một số luồng thanh toán trực tuyến.</li>
</ul>
<h3>Giấy phép trung gian thanh toán</h3>
<p>Một công ty cung cấp ví điện tử, cổng thanh toán, hoặc dịch vụ thu/chi hộ phải có <strong>Giấy phép trung gian thanh toán</strong> do NHNN cấp — chuỗi cấp phép này bắt nguồn từ nghị định thanh toán gốc và các lần sửa đổi sau đó. Điều kiện thường gồm vốn pháp định tối thiểu, kiểm tra an toàn kỹ thuật, và cơ chế ký quỹ để tiền của khách hàng không chịu rủi ro từ chính đơn vị vận hành.</p>
<h3>Vì sao có sandbox</h3>
<p>Các mô hình fintech mới (P2P lending, chấm điểm tín dụng thay thế, chia sẻ dữ liệu mở) thường không khớp với bất kỳ hạng mục giấy phép hiện có. Viết luật đầy đủ trước sẽ mất nhiều năm mà thị trường không có; quản lý bằng không quy tắc nào lại mời gọi các thất bại ở Bài 1.1. <strong>Cơ chế thử nghiệm có kiểm soát (sandbox)</strong> là con đường giữa: một phép thử có kiểm soát, có thời hạn, quy mô hạn chế dưới sự giám sát của NHNN, trước khi hoàn thiện khung pháp lý chính thức.</p>
<pre><code>Cơ chế sandbox (điển hình):
  Phạm vi  -> chỉ các giải pháp fintech được chỉ định (vd P2P lending, chấm điểm TD)
  Thời hạn -> khoảng thử nghiệm cố định (có thể gia hạn), không vô thời hạn
  Giới hạn -> trần số khách hàng / khối lượng giao dịch
  Giám sát -> báo cáo định kỳ cho NHNN; dừng nếu phát hiện gây hại cho NTD
  Kết quả  -> hoặc chuyển thành hạng mục giấy phép chính thức, hoặc bị đóng
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Sandbox không phải lỗ hổng pháp lý — nó là giám sát ở quy mô nhỏ hơn, có thể đảo ngược. Một sản phẩm vận hành trong sandbox <em>không</em> phải "chưa được quản lý"; nó được quản lý theo cách khác, có chủ đích, trong thời gian có hạn.</div>`,
  ]]);

const c2q = quiz('fre201-quiz-2', 'Quiz 2 — Legal framework & sandbox|||Quiz 2 — Khung pháp lý & sandbox', [
  { id: 'q1', question: 'Cơ quan quản lý chính cho fintech thanh toán/cho vay số tại Việt Nam là?', options: ['Bộ Công Thương', 'Ngân hàng Nhà nước (NHNN)', 'Uỷ ban Chứng khoán Nhà nước', 'Bộ Tài chính'], correctIndex: 1, explanation: 'NHNN là cơ quan quản lý chính cho fintech thanh toán và cho vay số.' },
  { id: 'q2', question: 'Một công ty cung cấp ví điện tử cần loại giấy phép nào?', options: ['Giấy phép trung gian thanh toán', 'Giấy phép kinh doanh chứng khoán', 'Giấy phép viễn thông', 'Không cần giấy phép'], correctIndex: 0, explanation: 'Ví điện tử/cổng thanh toán cần Giấy phép trung gian thanh toán do NHNN cấp.' },
  { id: 'q3', question: 'Đặc điểm ĐÚNG của cơ chế sandbox fintech?', options: ['Vô thời hạn, không giới hạn quy mô', 'Có thời hạn, quy mô hạn chế, giám sát bởi NHNN', 'Không cần báo cáo cho cơ quan quản lý', 'Chỉ áp dụng cho ngân hàng lớn'], correctIndex: 1, explanation: 'Sandbox là thử nghiệm có kiểm soát: thời hạn cố định, quy mô giới hạn, báo cáo định kỳ.' },
]);

const c3 = doc('fre201-3-1-consumer-protection', '3.1 — Financial consumer protection|||3.1 — Bảo vệ người tiêu dùng tài chính',
  'Nguyên tắc bảo vệ NTD tài chính: minh bạch phí, công bằng hợp đồng, cơ chế khiếu nại; Luật Bảo vệ quyền lợi NTD 2023; bẫy phí ẩn và điều khoản bất lợi thường gặp trong app cho vay.',
  [[
    `<span class="eyebrow">FRE201 · Chapter 3 · Lesson 3.1</span>
<h2>Financial consumer protection</h2>
<h3>Why financial products need special protection</h3>
<p>A financial contract is asymmetric: the provider understands the fee structure and risk; the customer usually doesn't, and the harm (debt, lost savings) can be severe and hard to reverse. Consumer protection law exists to close that information gap.</p>
<h3>Four core principles</h3>
<ul>
<li><strong>Fee transparency</strong> — the true annual cost (interest + all fees) must be disclosed up front, not buried in fine print.</li>
<li><strong>Contract fairness</strong> — no one-sided clauses that let the provider change terms unilaterally or waive its own liability for its own errors.</li>
<li><strong>Fair data handling</strong> — a customer's financial data collected for one purpose (e.g. a loan application) cannot be silently reused for another (e.g. sold to marketers).</li>
<li><strong>Accessible complaint &amp; redress</strong> — a clear channel to dispute a charge or an unfair decision, with a defined response time.</li>
</ul>
<h3>Vietnam's legal basis</h3>
<p>The <strong>2023 Law on Protection of Consumer Rights</strong> applies to financial services and strengthens disclosure and complaint-handling duties; it works alongside sector rules from the Law on Credit Institutions for lenders specifically.</p>
<h3>A common real-world trap: the hidden-fee lending app</h3>
<pre><code>Advertised: "0% interest for the first loan!"
Buried in T&amp;Cs:
  - "Service fee"  10% of principal, charged up front
  - "Late fee"     5%/day, compounding
  - Auto-renewal that resets the "0%" promo period only once
Effective annual rate: often several hundred percent
</code></pre>
<div class="callout"><span class="badge">Exam angle</span> "Is a fee disclosed" is not enough — the test is whether the <em>true cost</em> is disclosed <em>clearly and up front</em>, in a way an average customer would actually notice.</div>`,
    `<span class="eyebrow">FRE201 · Chương 3 · Bài 3.1</span>
<h2>Bảo vệ người tiêu dùng tài chính</h2>
<h3>Vì sao sản phẩm tài chính cần bảo vệ đặc biệt</h3>
<p>Một hợp đồng tài chính không đối xứng: bên cung cấp hiểu rõ cấu trúc phí và rủi ro; khách hàng thường không, và thiệt hại (nợ, mất tiền tiết kiệm) có thể nghiêm trọng và khó đảo ngược. Luật bảo vệ NTD tồn tại để thu hẹp khoảng cách thông tin đó.</p>
<h3>Bốn nguyên tắc cốt lõi</h3>
<ul>
<li><strong>Minh bạch phí</strong> — chi phí thực hằng năm (lãi + mọi phí) phải được công bố ngay từ đầu, không giấu trong chữ nhỏ.</li>
<li><strong>Công bằng hợp đồng</strong> — không có điều khoản một chiều cho phép bên cung cấp tự đổi điều kiện hoặc miễn trừ trách nhiệm cho lỗi của chính mình.</li>
<li><strong>Xử lý dữ liệu công bằng</strong> — dữ liệu tài chính khách hàng thu thập cho một mục đích (vd hồ sơ vay) không thể lặng lẽ dùng lại cho mục đích khác (vd bán cho bên tiếp thị).</li>
<li><strong>Kênh khiếu nại dễ tiếp cận</strong> — có cách rõ ràng để khiếu nại một khoản phí hoặc quyết định bất công, với thời hạn phản hồi cụ thể.</li>
</ul>
<h3>Cơ sở pháp lý tại Việt Nam</h3>
<p><strong>Luật Bảo vệ quyền lợi người tiêu dùng 2023</strong> áp dụng cho dịch vụ tài chính và siết chặt nghĩa vụ công bố thông tin cùng xử lý khiếu nại; luật này hoạt động song song với quy định chuyên ngành từ Luật các Tổ chức tín dụng đối với riêng bên cho vay.</p>
<h3>Bẫy thực tế thường gặp: app cho vay giấu phí</h3>
<pre><code>Quảng cáo: "0% lãi suất cho khoản vay đầu tiên!"
Giấu trong điều khoản:
  - "Phí dịch vụ"     10% gốc, thu trước
  - "Phí trễ hạn"     5%/ngày, cộng gộp
  - Tự động gia hạn chỉ áp "0%" đúng một lần đầu
Lãi suất hiệu dụng theo năm: thường lên tới vài trăm %
</code></pre>
<div class="callout"><span class="badge">Góc nhìn thi</span> "Phí có được công bố" là chưa đủ — điểm mấu chốt là <em>chi phí thực</em> có được công bố <em>rõ ràng và ngay từ đầu</em> hay không, theo cách một khách hàng bình thường thực sự nhận ra.</div>`,
  ]]);

const c3q = quiz('fre201-quiz-3', 'Quiz 3 — Consumer protection|||Quiz 3 — Bảo vệ người tiêu dùng', [
  { id: 'q1', question: 'Nguyên tắc "minh bạch phí" yêu cầu điều gì?', options: ['Chỉ cần ghi phí ở đâu đó trong hợp đồng', 'Công bố rõ ràng chi phí thực (lãi + mọi phí) ngay từ đầu', 'Không cần công bố nếu lãi suất 0%', 'Chỉ áp dụng cho ngân hàng, không áp dụng app vay'], correctIndex: 1, explanation: 'Chuẩn là công bố chi phí thực rõ ràng, dễ nhận thấy — không phải "có ghi ở đâu đó".' },
  { id: 'q2', question: 'Vì sao hợp đồng tài chính cần bảo vệ NTD đặc biệt?', options: ['Vì luôn có lãi suất thấp', 'Vì bất đối xứng thông tin giữa bên cung cấp và khách hàng, thiệt hại khó đảo ngược', 'Vì khách hàng luôn hiểu rõ mọi điều khoản', 'Vì không liên quan tới tiền'], correctIndex: 1, explanation: 'Bên cung cấp nắm rõ cấu trúc phí/rủi ro hơn khách hàng, và hậu quả (nợ, mất tiền) có thể nghiêm trọng.' },
  { id: 'q3', question: 'App vay quảng cáo "0% lãi" nhưng thu "phí dịch vụ" 10% ngay đầu là vi phạm nguyên tắc nào?', options: ['Công bằng hợp đồng', 'Minh bạch phí', 'Xử lý dữ liệu công bằng', 'Cạnh tranh công bằng'], correctIndex: 1, explanation: 'Chi phí thực bị che giấu sau lời quảng cáo "0%" — vi phạm minh bạch phí.' },
]);

const c4 = doc('fre201-4-1-data-privacy', '4.1 — Data privacy: GDPR & Decree 13/2023|||4.1 — Bảo mật dữ liệu: GDPR & Nghị định 13/2023',
  'Nguyên tắc GDPR (tối thiểu hoá dữ liệu, đồng ý, quyền được xoá, thông báo vi phạm 72h, mức phạt); Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân Việt Nam (dữ liệu cơ bản/nhạy cảm, ĐTĐL, chuyển dữ liệu ra nước ngoài).',
  [[
    `<span class="eyebrow">FRE201 · Chapter 4 · Lesson 4.1</span>
<h2>Data privacy: GDPR &amp; Decree 13/2023</h2>
<h3>Why fintech is a special data-privacy risk</h3>
<p>A fintech app routinely holds identity documents, income, spending patterns, and sometimes location and biometric data. That combination is uniquely attractive to attackers and uniquely damaging when leaked — which is why privacy law treats financial data with extra care.</p>
<h3>GDPR — the global reference standard (EU)</h3>
<ul>
<li><strong>Data minimisation</strong> — collect only what's strictly needed for the stated purpose.</li>
<li><strong>Lawful basis / consent</strong> — a real, informed, freely-given consent — not a pre-ticked box.</li>
<li><strong>Right to erasure ("right to be forgotten")</strong> — a user can demand deletion of their data, with narrow exceptions (e.g. legal retention duties).</li>
<li><strong>Breach notification</strong> — the regulator must be told within <strong>72 hours</strong> of discovering a breach.</li>
<li><strong>Fines</strong> — up to <strong>4% of global annual revenue</strong> or €20M, whichever is higher — large enough that privacy became a board-level risk, not just a legal footnote.</li>
</ul>
<h3>Vietnam — Decree 13/2023/NĐ-CP on Personal Data Protection</h3>
<ul>
<li>Splits data into <strong>basic personal data</strong> and <strong>sensitive personal data</strong> (the latter includes financial account data, biometrics, health, location history — subject to stricter rules).</li>
<li>Requires a <strong>Data Protection Impact Assessment (DPIA)</strong> document for processing that carries higher risk, filed with the Ministry of Public Security.</li>
<li>Regulates <strong>cross-border data transfer</strong> — transferring Vietnamese users' personal data abroad has its own assessment and notification requirements.</li>
<li>Requires clear, specific consent — similar spirit to GDPR, but the mechanics (forms, filing duties) differ and must be checked directly against the decree text.</li>
</ul>
<pre><code>GDPR                          Decree 13/2023 (Vietnam)
- "personal data" (1 tier)     - "basic" vs "sensitive" (2 tiers)
- DPIA encouraged/required     - DPIA (ĐTĐL) required, filed with MPS
- breach notice: 72h           - notice duty exists, check current text
- fine: up to 4% revenue       - administrative fines, case-by-case
</code></pre>
<div class="callout"><span class="badge">Exam angle</span> Financial account numbers and transaction history fall under "sensitive personal data" in the Vietnamese framework — a fintech handling them faces the stricter tier, not the basic one.</div>`,
    `<span class="eyebrow">FRE201 · Chương 4 · Bài 4.1</span>
<h2>Bảo mật dữ liệu: GDPR &amp; Nghị định 13/2023</h2>
<h3>Vì sao fintech là rủi ro dữ liệu đặc biệt</h3>
<p>Một app fintech thường lưu giấy tờ định danh, thu nhập, thói quen chi tiêu, và đôi khi cả vị trí và dữ liệu sinh trắc học. Sự kết hợp đó đặc biệt hấp dẫn với kẻ tấn công và đặc biệt gây hại khi bị lộ — vì vậy luật bảo mật dữ liệu đối xử với dữ liệu tài chính cẩn trọng hơn.</p>
<h3>GDPR — chuẩn tham chiếu toàn cầu (EU)</h3>
<ul>
<li><strong>Tối thiểu hoá dữ liệu</strong> — chỉ thu thập những gì thực sự cần cho mục đích đã nêu.</li>
<li><strong>Cơ sở pháp lý / sự đồng ý</strong> — đồng ý thật, được thông báo đầy đủ, tự nguyện — không phải ô tick sẵn.</li>
<li><strong>Quyền được xoá ("quyền được lãng quên")</strong> — người dùng có thể yêu cầu xoá dữ liệu, trừ một số ngoại lệ hẹp (vd nghĩa vụ lưu trữ pháp lý).</li>
<li><strong>Thông báo vi phạm</strong> — cơ quan quản lý phải được báo trong <strong>72 giờ</strong> kể từ khi phát hiện vi phạm.</li>
<li><strong>Mức phạt</strong> — tới <strong>4% doanh thu toàn cầu hằng năm</strong> hoặc 20 triệu euro, tuỳ mức nào cao hơn — đủ lớn để bảo mật dữ liệu trở thành rủi ro cấp hội đồng quản trị, không chỉ là ghi chú pháp lý.</li>
</ul>
<h3>Việt Nam — Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân</h3>
<ul>
<li>Chia dữ liệu thành <strong>dữ liệu cá nhân cơ bản</strong> và <strong>dữ liệu cá nhân nhạy cảm</strong> (nhóm sau gồm dữ liệu tài khoản tài chính, sinh trắc học, sức khoẻ, lịch sử vị trí — chịu quy tắc chặt hơn).</li>
<li>Yêu cầu tài liệu <strong>Đánh giá tác động xử lý dữ liệu cá nhân (ĐTĐL)</strong> cho việc xử lý mang rủi ro cao hơn, nộp cho Bộ Công an.</li>
<li>Quản lý <strong>chuyển dữ liệu ra nước ngoài</strong> — chuyển dữ liệu cá nhân của người dùng Việt Nam ra nước ngoài có yêu cầu đánh giá và thông báo riêng.</li>
<li>Yêu cầu sự đồng ý rõ ràng, cụ thể — cùng tinh thần với GDPR, nhưng cơ chế (mẫu biểu, nghĩa vụ nộp hồ sơ) khác nhau và phải đối chiếu trực tiếp với văn bản nghị định.</li>
</ul>
<pre><code>GDPR                            Nghị định 13/2023 (VN)
- "dữ liệu cá nhân" (1 mức)      - "cơ bản" vs "nhạy cảm" (2 mức)
- DPIA khuyến khích/yêu cầu      - ĐTĐL bắt buộc, nộp cho Bộ Công an
- báo vi phạm: 72 giờ            - có nghĩa vụ báo, cần đối chiếu văn bản hiện hành
- phạt: tới 4% doanh thu         - phạt hành chính, tuỳ từng trường hợp
</code></pre>
<div class="callout"><span class="badge">Góc nhìn thi</span> Số tài khoản tài chính và lịch sử giao dịch thuộc "dữ liệu cá nhân nhạy cảm" trong khung Việt Nam — một fintech xử lý chúng chịu mức quy tắc chặt hơn, không phải mức cơ bản.</div>`,
  ]]);

const c4q = quiz('fre201-quiz-4', 'Quiz 4 — Data privacy|||Quiz 4 — Bảo mật dữ liệu', [
  { id: 'q1', question: 'GDPR yêu cầu thông báo vi phạm dữ liệu cho cơ quan quản lý trong bao lâu?', options: ['24 giờ', '72 giờ', '30 ngày', 'Không có thời hạn cụ thể'], correctIndex: 1, explanation: 'GDPR quy định thông báo vi phạm trong 72 giờ kể từ khi phát hiện.' },
  { id: 'q2', question: 'Nghị định 13/2023/NĐ-CP chia dữ liệu cá nhân thành mấy nhóm?', options: ['Một nhóm duy nhất', 'Hai nhóm: cơ bản và nhạy cảm', 'Ba nhóm theo độ tuổi', 'Không phân nhóm'], correctIndex: 1, explanation: 'Nghị định 13/2023 phân biệt dữ liệu cá nhân cơ bản và dữ liệu cá nhân nhạy cảm.' },
  { id: 'q3', question: 'Số tài khoản tài chính của khách hàng thuộc nhóm dữ liệu nào theo khung Việt Nam?', options: ['Dữ liệu cơ bản', 'Dữ liệu nhạy cảm', 'Không được xem là dữ liệu cá nhân', 'Dữ liệu công khai'], correctIndex: 1, explanation: 'Dữ liệu tài khoản tài chính thuộc nhóm dữ liệu cá nhân nhạy cảm, chịu quy tắc chặt hơn.' },
]);

const c5 = doc('fre201-5-1-aml-kyc', '5.1 — Anti-money-laundering: AML/KYC in fintech|||5.1 — Phòng chống rửa tiền: AML/KYC trong fintech',
  'Chuẩn FATF; KYC/CDD/EDD; giám sát giao dịch & báo cáo giao dịch đáng ngờ (STR); Luật Phòng, chống rửa tiền 2022 Việt Nam; vì sao fintech (ẩn danh, tốc độ, xuyên biên giới) là mục tiêu ưa thích của rửa tiền.',
  [[
    `<span class="eyebrow">FRE201 · Chapter 5 · Lesson 5.1</span>
<h2>Anti-money-laundering: AML/KYC in fintech</h2>
<h3>Why fintech is an attractive AML target</h3>
<p>Money laundering needs to move dirty money through legitimate-looking channels quickly and, ideally, across borders. Fintech's biggest selling points — instant transfers, low-friction onboarding, cross-border reach — are exactly the properties a launderer wants, which is why fintech AML obligations are often as strict as, or stricter than, traditional banks'.</p>
<h3>The FATF standard</h3>
<p>The <strong>Financial Action Task Force (FATF)</strong> sets the 40 Recommendations that most national AML laws are built on: customer identification, record-keeping, suspicious-activity reporting, and international cooperation.</p>
<h3>KYC, CDD and EDD</h3>
<ul>
<li><strong>KYC (Know Your Customer)</strong> — verify who the customer actually is, using an ID document plus a liveness/biometric check (eKYC) for remote onboarding.</li>
<li><strong>CDD (Customer Due Diligence)</strong> — the standard level of ongoing checking applied to every customer: source of funds, expected transaction pattern.</li>
<li><strong>EDD (Enhanced Due Diligence)</strong> — extra scrutiny for higher-risk customers: politically exposed persons (PEPs), customers from high-risk jurisdictions, unusually large or complex transactions.</li>
</ul>
<h3>Transaction monitoring &amp; the Suspicious Transaction Report (STR)</h3>
<pre><code>Onboarding -> KYC/eKYC verifies identity
Ongoing    -> automated monitoring flags anomalies
              (sudden large transfer, rapid in-and-out, mismatched profile)
Escalation -> compliance team reviews the flag
Reporting  -> if suspicious, file an STR with the Anti-Money-Laundering
              Department (NHNN) — NOT with the customer, and NOT delayed
</code></pre>
<h3>Vietnam's legal basis</h3>
<p>The <strong>2022 Law on Anti-Money Laundering</strong> requires "reporting entities" (which explicitly include payment intermediaries and other fintech providers) to perform CDD, monitor transactions, and file STRs with the Anti-Money-Laundering Department under SBV.</p>
<div class="callout"><span class="badge">Key idea</span> A launderer's biggest enemy is friction and a paper trail. Every KYC/CDD step exists specifically to slow down and document what the launderer needs to be instant and anonymous.</div>`,
    `<span class="eyebrow">FRE201 · Chương 5 · Bài 5.1</span>
<h2>Phòng chống rửa tiền: AML/KYC trong fintech</h2>
<h3>Vì sao fintech là mục tiêu ưa thích của rửa tiền</h3>
<p>Rửa tiền cần chuyển tiền bẩn qua các kênh trông hợp pháp, nhanh chóng và lý tưởng là xuyên biên giới. Những điểm mạnh bán hàng lớn nhất của fintech — chuyển tiền ngay lập tức, đăng ký ít ma sát, tiếp cận xuyên biên giới — chính là những đặc điểm mà kẻ rửa tiền muốn, nên nghĩa vụ AML của fintech thường chặt bằng hoặc chặt hơn ngân hàng truyền thống.</p>
<h3>Chuẩn FATF</h3>
<p><strong>Lực lượng đặc nhiệm tài chính (FATF)</strong> đặt ra 40 Khuyến nghị mà hầu hết luật AML quốc gia được xây dựng trên đó: định danh khách hàng, lưu trữ hồ sơ, báo cáo hoạt động đáng ngờ, và hợp tác quốc tế.</p>
<h3>KYC, CDD và EDD</h3>
<ul>
<li><strong>KYC (Biết khách hàng của bạn)</strong> — xác minh khách hàng thực sự là ai, dùng giấy tờ định danh cộng kiểm tra sinh trắc học/liveness (eKYC) cho đăng ký từ xa.</li>
<li><strong>CDD (Thẩm định khách hàng)</strong> — mức kiểm tra chuẩn, liên tục áp dụng cho mọi khách hàng: nguồn tiền, mẫu giao dịch dự kiến.</li>
<li><strong>EDD (Thẩm định tăng cường)</strong> — kiểm tra kỹ hơn cho khách hàng rủi ro cao: người có ảnh hưởng chính trị (PEP), khách từ khu vực rủi ro cao, giao dịch bất thường lớn hoặc phức tạp.</li>
</ul>
<h3>Giám sát giao dịch &amp; Báo cáo giao dịch đáng ngờ (STR)</h3>
<pre><code>Đăng ký    -> KYC/eKYC xác minh danh tính
Liên tục   -> giám sát tự động phát hiện bất thường
              (chuyển lớn bất ngờ, vào-ra nhanh, lệch hồ sơ)
Chuyển tiếp -> bộ phận tuân thủ xem xét cảnh báo
Báo cáo    -> nếu đáng ngờ, nộp STR cho Cục Phòng, chống rửa tiền
              (NHNN) — KHÔNG báo cho khách hàng, và KHÔNG trì hoãn
</code></pre>
<h3>Cơ sở pháp lý Việt Nam</h3>
<p><strong>Luật Phòng, chống rửa tiền 2022</strong> yêu cầu các "đối tượng báo cáo" (bao gồm rõ ràng các tổ chức trung gian thanh toán và các nhà cung cấp fintech khác) thực hiện CDD, giám sát giao dịch, và nộp STR cho Cục Phòng, chống rửa tiền thuộc NHNN.</p>
<div class="callout"><span class="badge">Ý chính</span> Kẻ thù lớn nhất của kẻ rửa tiền là ma sát và dấu vết giấy tờ. Mỗi bước KYC/CDD tồn tại chính xác để làm chậm và ghi lại điều mà kẻ rửa tiền cần là tức thì và vô danh.</div>`,
  ]]);

const c5q = quiz('fre201-quiz-5', 'Quiz 5 — AML/KYC|||Quiz 5 — AML/KYC', [
  { id: 'q1', question: 'EDD (Thẩm định tăng cường) áp dụng cho nhóm khách hàng nào?', options: ['Mọi khách hàng như nhau', 'Khách hàng rủi ro cao (PEP, khu vực rủi ro cao, giao dịch bất thường)', 'Chỉ khách hàng doanh nghiệp', 'Chỉ khách hàng dùng tiền mặt'], correctIndex: 1, explanation: 'EDD dành riêng cho khách hàng rủi ro cao hơn mức CDD chuẩn.' },
  { id: 'q2', question: 'Khi phát hiện giao dịch đáng ngờ, đơn vị fintech phải làm gì?', options: ['Báo trực tiếp cho khách hàng trước', 'Nộp Báo cáo giao dịch đáng ngờ (STR) cho Cục Phòng, chống rửa tiền, không trì hoãn', 'Chờ khách hàng tự giải trình rồi mới báo', 'Không cần báo nếu số tiền nhỏ'], correctIndex: 1, explanation: 'STR phải nộp cho cơ quan chức năng (NHNN), không báo khách hàng, không trì hoãn.' },
  { id: 'q3', question: 'Vì sao fintech dễ bị lợi dụng để rửa tiền hơn một số kênh truyền thống?', options: ['Vì fintech luôn có phí thấp hơn', 'Vì chuyển tiền tức thì, đăng ký ít ma sát, xuyên biên giới dễ dàng', 'Vì fintech không có khách hàng thật', 'Vì fintech không dùng công nghệ'], correctIndex: 1, explanation: 'Đặc tính tốc độ, ít ma sát, xuyên biên giới của fintech cũng là thứ kẻ rửa tiền cần.' },
]);

const c6 = doc('fre201-6-1-ai-ethics-credit-scoring', '6.1 — Ethics of AI in financial algorithms: credit scoring & bias|||6.1 — Đạo đức AI trong thuật toán tài chính: chấm điểm tín dụng & thiên lệch',
  'Thiên lệch trong mô hình chấm điểm tín dụng (dữ liệu lịch sử phản chiếu thiên lệch xã hội); vụ Apple Card 2019; nguyên tắc FAT (Fairness, Accountability, Transparency); quyền giải thích quyết định tự động.',
  [[
    `<span class="eyebrow">FRE201 · Chapter 6 · Lesson 6.1</span>
<h2>Ethics of AI in financial algorithms: credit scoring &amp; bias</h2>
<h3>How bias enters a credit-scoring model</h3>
<p>A machine-learning credit model is trained on <strong>historical</strong> lending data. If past lending was systematically less generous to a certain gender, region, or group — for reasons that had nothing to do with actual creditworthiness — the model learns that pattern as if it were a real signal. The algorithm doesn't invent bias; it <strong>launders</strong> the bias that was already in the data, under the appearance of neutral math.</p>
<h3>A real case: the Apple Card gender-bias scandal (2019)</h3>
<p>Several users publicly reported that the Apple Card's underlying algorithm gave a much lower credit limit to a wife than to her husband, despite the wife having an equal or better credit profile and shared assets. The card issuer could not fully explain the specific factors behind individual decisions — which was itself part of the problem: an unexplainable decision cannot be checked for bias by the people affected by it.</p>
<h3>The FAT principles for AI ethics</h3>
<ul>
<li><strong>Fairness</strong> — the model's outcomes should not systematically disadvantage a protected group for reasons unrelated to actual risk.</li>
<li><strong>Accountability</strong> — a specific, identifiable party is responsible for the model's decisions — "the algorithm decided" is not an acceptable answer.</li>
<li><strong>Transparency</strong> — the logic (or at least the key factors) behind a decision must be explainable, especially to the person it affects.</li>
</ul>
<h3>The right to an explanation</h3>
<p>A customer denied credit by an automated system has a legitimate interest in knowing <em>why</em> — not the full model internals, but the specific factors that drove the outcome, and a route to human review. This is the practical, day-to-day form the FAT principles take in a real product.</p>
<pre><code>Bad practice:              Better practice:
"Denied. Reason: model     "Denied. Main factors: income
 output negative."          instability, high existing debt
                            ratio. You may request human
                            review within 30 days."
</code></pre>
<div class="callout"><span class="badge">Exam angle</span> "The algorithm is neutral because it's just math" is a common wrong answer — a model trained on biased historical data reproduces that bias exactly, with no intent required.</div>`,
    `<span class="eyebrow">FRE201 · Chương 6 · Bài 6.1</span>
<h2>Đạo đức AI trong thuật toán tài chính: chấm điểm tín dụng &amp; thiên lệch</h2>
<h3>Thiên lệch xâm nhập vào mô hình chấm điểm tín dụng thế nào</h3>
<p>Một mô hình chấm điểm tín dụng học máy được huấn luyện trên dữ liệu cho vay <strong>lịch sử</strong>. Nếu việc cho vay trước đây hệ thống hoá kém rộng rãi hơn với một giới tính, khu vực, hoặc nhóm nào — vì lý do không liên quan đến khả năng trả nợ thực sự — mô hình sẽ học lại mẫu đó như thể nó là một tín hiệu thật. Thuật toán không tạo ra thiên lệch; nó <strong>tẩy trắng</strong> thiên lệch đã có sẵn trong dữ liệu, dưới vẻ ngoài của con số trung lập.</p>
<h3>Ca thực tế: vụ bê bối thiên lệch giới tính của Apple Card (2019)</h3>
<p>Nhiều người dùng công khai phản ánh rằng thuật toán nền của Apple Card cấp hạn mức tín dụng thấp hơn nhiều cho người vợ so với người chồng, dù người vợ có hồ sơ tín dụng tương đương hoặc tốt hơn và tài sản chung. Đơn vị phát hành thẻ không thể giải thích đầy đủ các yếu tố cụ thể đằng sau từng quyết định — và điều đó chính là một phần của vấn đề: một quyết định không thể giải thích được thì không thể được người bị ảnh hưởng kiểm tra xem có thiên lệch hay không.</p>
<h3>Nguyên tắc FAT cho đạo đức AI</h3>
<ul>
<li><strong>Công bằng (Fairness)</strong> — kết quả của mô hình không nên hệ thống hoá bất lợi cho một nhóm được bảo vệ vì lý do không liên quan đến rủi ro thực.</li>
<li><strong>Trách nhiệm giải trình (Accountability)</strong> — một bên cụ thể, xác định được phải chịu trách nhiệm cho quyết định của mô hình — "thuật toán tự quyết định" không phải câu trả lời chấp nhận được.</li>
<li><strong>Minh bạch (Transparency)</strong> — logic (hoặc chí ít các yếu tố chính) đằng sau một quyết định phải giải thích được, đặc biệt với người bị ảnh hưởng.</li>
</ul>
<h3>Quyền được giải thích</h3>
<p>Một khách hàng bị hệ thống tự động từ chối cấp tín dụng có lợi ích hợp pháp để biết <em>vì sao</em> — không cần toàn bộ nội bộ mô hình, nhưng cần các yếu tố cụ thể đã dẫn tới kết quả, và một lối đi để yêu cầu con người xem lại. Đây là hình thức thực tế, hằng ngày mà nguyên tắc FAT thể hiện trong một sản phẩm thật.</p>
<pre><code>Cách làm KÉM:               Cách làm TỐT HƠN:
"Từ chối. Lý do: kết quả    "Từ chối. Yếu tố chính: thu nhập
 mô hình âm."                 không ổn định, tỉ lệ nợ hiện có
                              cao. Bạn có thể yêu cầu con người
                              xem lại trong 30 ngày."
</code></pre>
<div class="callout"><span class="badge">Góc nhìn thi</span> "Thuật toán trung lập vì nó chỉ là toán học" là một câu trả lời sai phổ biến — một mô hình huấn luyện trên dữ liệu lịch sử thiên lệch sẽ tái tạo chính xác thiên lệch đó, không cần chủ đích.</div>`,
  ]]);

const c6q = quiz('fre201-quiz-6', 'Quiz 6 — AI ethics & credit scoring|||Quiz 6 — Đạo đức AI & chấm điểm tín dụng', [
  { id: 'q1', question: 'Vì sao một mô hình chấm điểm tín dụng có thể thiên lệch dù chỉ là "toán học"?', options: ['Vì máy tính luôn sai', 'Vì nó học từ dữ liệu lịch sử đã có sẵn thiên lệch xã hội', 'Vì thuật toán có ý định xấu', 'Vì khách hàng khai báo sai'], correctIndex: 1, explanation: 'Mô hình tái tạo lại thiên lệch có trong dữ liệu huấn luyện, không cần chủ đích.' },
  { id: 'q2', question: 'Nguyên tắc FAT trong đạo đức AI gồm?', options: ['Fairness, Accountability, Transparency', 'Fast, Accurate, Trusted', 'Finance, Audit, Tax', 'Flexibility, Automation, Trust'], correctIndex: 0, explanation: 'FAT = Công bằng, Trách nhiệm giải trình, Minh bạch.' },
  { id: 'q3', question: 'Vụ Apple Card 2019 cho thấy vấn đề gì rõ nhất?', options: ['Thẻ tín dụng quá nhiều ưu đãi', 'Quyết định không giải thích được nên không thể kiểm tra thiên lệch', 'Lãi suất thẻ quá thấp', 'Không liên quan đến AI'], correctIndex: 1, explanation: 'Không giải thích được lý do quyết định ⇒ người bị ảnh hưởng không thể kiểm tra có thiên lệch hay không.' },
]);

const c7 = doc('fre201-7-1-crypto-regulation', '7.1 — Regulating crypto, digital currency & virtual assets|||7.1 — Quy định về crypto, tiền số & tài sản ảo',
  'Định nghĩa cryptocurrency/tài sản ảo/stablecoin/CBDC; crypto KHÔNG là phương tiện thanh toán hợp pháp tại Việt Nam; thí điểm sàn giao dịch tài sản số; khung EU MiCA làm tham chiếu quốc tế.',
  [[
    `<span class="eyebrow">FRE201 · Chapter 7 · Lesson 7.1</span>
<h2>Regulating crypto, digital currency &amp; virtual assets</h2>
<h3>Key definitions</h3>
<ul>
<li><strong>Cryptocurrency</strong> — a decentralized digital asset secured by cryptography (e.g. Bitcoin, Ether); not issued or backed by any central authority.</li>
<li><strong>Virtual asset (VA)</strong> — the broader regulatory term (used by FATF and most laws) covering any digital representation of value that can be traded or transferred, including tokens and NFTs where they carry transferable value.</li>
<li><strong>Stablecoin</strong> — a crypto token designed to hold a stable value, usually pegged to a fiat currency, backed by reserves (or, riskier, by an algorithm — see the Terra/LUNA case in Lesson 1.1).</li>
<li><strong>CBDC (Central Bank Digital Currency)</strong> — a digital form of a country's own official currency, issued directly by the central bank — the opposite of decentralized crypto, even though it also runs on digital infrastructure.</li>
</ul>
<h3>Vietnam's position: crypto is not legal tender</h3>
<p>Under Vietnam's payment framework, only the Vietnamese đồng and instruments explicitly authorized by the State Bank may be used as a means of payment. <strong>Cryptocurrency is explicitly excluded</strong> — a merchant accepting Bitcoin as payment for goods is operating outside the legal payment framework, regardless of whether owning or trading crypto itself is separately restricted.</p>
<h3>A pilot step forward: digital asset exchanges</h3>
<p>A 2025 National Assembly resolution formally recognized the category of "digital asset" (tài sản số / tài sản mã hoá) for the first time and authorized a pilot for licensed digital-asset trading platforms — a first, limited legal foothold for trading crypto-assets in a supervised setting, distinct from using them as payment.</p>
<h3>An international reference point: EU MiCA</h3>
<pre><code>EU MiCA (2023) in one line:
  - crypto-asset issuers   -> must publish a whitepaper, meet disclosure rules
  - stablecoin issuers     -> must hold verifiable reserves, face stricter oversight
  - exchanges/custodians   -> must be licensed, meet capital &amp; security requirements
</code></pre>
<div class="callout"><span class="badge">Exam angle</span> "Crypto is illegal in Vietnam" and "crypto is fully legal in Vietnam" are both wrong. The precise rule is: crypto is not a legal means of <em>payment</em>, while trading/holding is being brought, cautiously and partially, into a supervised pilot framework.</div>`,
    `<span class="eyebrow">FRE201 · Chương 7 · Bài 7.1</span>
<h2>Quy định về crypto, tiền số &amp; tài sản ảo</h2>
<h3>Định nghĩa cốt lõi</h3>
<ul>
<li><strong>Cryptocurrency (tiền mã hoá)</strong> — tài sản số phi tập trung được bảo vệ bằng mật mã học (vd Bitcoin, Ether); không do bất kỳ cơ quan trung ương phát hành hay bảo đảm.</li>
<li><strong>Tài sản ảo (Virtual asset - VA)</strong> — thuật ngữ pháp lý rộng hơn (dùng bởi FATF và hầu hết luật) chỉ mọi biểu diễn số của giá trị có thể giao dịch hoặc chuyển nhượng, gồm token và NFT khi mang giá trị chuyển nhượng được.</li>
<li><strong>Stablecoin</strong> — token crypto được thiết kế giữ giá trị ổn định, thường gắn với một loại tiền pháp định, bảo đảm bởi dự trữ (hoặc rủi ro hơn, bởi thuật toán — xem ca Terra/LUNA ở Bài 1.1).</li>
<li><strong>CBDC (Tiền số ngân hàng trung ương)</strong> — dạng số của chính đồng tiền chính thức một quốc gia, do ngân hàng trung ương phát hành trực tiếp — ngược lại với crypto phi tập trung, dù cũng chạy trên hạ tầng số.</li>
</ul>
<h3>Vị trí của Việt Nam: crypto không là phương tiện thanh toán hợp pháp</h3>
<p>Theo khung pháp lý thanh toán của Việt Nam, chỉ đồng Việt Nam và các phương tiện được NHNN cho phép rõ ràng mới được dùng làm phương tiện thanh toán. <strong>Tiền mã hoá bị loại trừ rõ ràng</strong> — một cửa hàng nhận Bitcoin để thanh toán hàng hoá đang hoạt động ngoài khung pháp lý thanh toán, bất kể việc sở hữu hay giao dịch crypto tự nó có bị hạn chế riêng hay không.</p>
<h3>Một bước thí điểm: sàn giao dịch tài sản số</h3>
<p>Một nghị quyết Quốc hội năm 2025 lần đầu chính thức công nhận hạng mục "tài sản số / tài sản mã hoá" và cho phép thí điểm các sàn giao dịch tài sản số có phép — một chỗ đứng pháp lý đầu tiên, giới hạn cho việc giao dịch tài sản crypto trong môi trường được giám sát, khác với việc dùng nó làm phương tiện thanh toán.</p>
<h3>Điểm tham chiếu quốc tế: EU MiCA</h3>
<pre><code>EU MiCA (2023) tóm tắt:
  - đơn vị phát hành crypto-asset -> phải công bố whitepaper, đáp ứng quy tắc công bố
  - đơn vị phát hành stablecoin   -> phải giữ dự trữ kiểm chứng được, giám sát chặt hơn
  - sàn giao dịch/lưu ký          -> phải có phép, đáp ứng yêu cầu vốn &amp; an toàn
</code></pre>
<div class="callout"><span class="badge">Góc nhìn thi</span> "Crypto bất hợp pháp tại Việt Nam" và "crypto hoàn toàn hợp pháp tại Việt Nam" đều sai. Quy tắc chính xác là: crypto không phải phương tiện <em>thanh toán</em> hợp pháp, còn giao dịch/sở hữu đang được đưa dần, thận trọng và có giới hạn, vào khung thí điểm được giám sát.</div>`,
  ]]);

const c7q = quiz('fre201-quiz-7', 'Quiz 7 — Crypto regulation|||Quiz 7 — Quy định crypto', [
  { id: 'q1', question: 'Tại Việt Nam, crypto (vd Bitcoin) có được dùng làm phương tiện thanh toán hợp pháp không?', options: ['Có, hoàn toàn hợp pháp', 'Không — chỉ đồng Việt Nam và phương tiện được NHNN cho phép mới hợp pháp', 'Chỉ hợp pháp với giao dịch nhỏ', 'Chỉ hợp pháp với doanh nghiệp nước ngoài'], correctIndex: 1, explanation: 'Khung thanh toán VN loại trừ crypto khỏi phương tiện thanh toán hợp pháp.' },
  { id: 'q2', question: 'Stablecoin khác cryptocurrency thông thường ở điểm nào?', options: ['Không dùng công nghệ blockchain', 'Được thiết kế giữ giá trị ổn định, thường gắn với tiền pháp định', 'Luôn do ngân hàng trung ương phát hành', 'Không thể giao dịch'], correctIndex: 1, explanation: 'Stablecoin nhắm giữ giá ổn định, khác với biến động tự do của cryptocurrency thường.' },
  { id: 'q3', question: 'CBDC khác biệt căn bản với cryptocurrency ở điểm nào?', options: ['CBDC phi tập trung như crypto', 'CBDC do ngân hàng trung ương phát hành trực tiếp, không phi tập trung', 'CBDC không chạy trên hạ tầng số', 'Không có khác biệt'], correctIndex: 1, explanation: 'CBDC là tiền pháp định dạng số do NHTW phát hành — ngược với crypto phi tập trung.' },
]);

const c8 = doc('fre201-8-1-regtech-global-trends', '8.1 — RegTech, compliance & global regulatory trends|||8.1 — RegTech, tuân thủ & xu hướng pháp lý toàn cầu',
  'RegTech (eKYC tự động, giám sát giao dịch real-time bằng AI, báo cáo tuân thủ tự động); Open Banking/Open Finance; quản lý dựa trên rủi ro; sandbox toàn cầu (UK FCA 2016) và hợp tác xuyên biên giới.',
  [[
    `<span class="eyebrow">FRE201 · Chapter 8 · Lesson 8.1</span>
<h2>RegTech, compliance &amp; global regulatory trends</h2>
<h3>What RegTech actually automates</h3>
<p><strong>RegTech (Regulatory Technology)</strong> is the set of tools that let a fintech comply at scale — because manually re-checking every customer and every transaction against every rule in this course simply doesn't scale past a few thousand users.</p>
<ul>
<li><strong>Automated eKYC</strong> — ID document scanning + liveness/biometric checks that turn a manual onboarding review into a few seconds of automated verification.</li>
<li><strong>Real-time transaction monitoring (AI-based)</strong> — machine-learning models score every transaction for AML/fraud risk as it happens, instead of a periodic batch review days later.</li>
<li><strong>Automated regulatory reporting</strong> — compliance reports (to SBV, tax authorities, etc.) generated directly from transaction systems, cutting both cost and the risk of manual reporting error.</li>
</ul>
<h3>Global trend 1: Open Banking / Open Finance</h3>
<p>Regulation increasingly requires banks to expose secure, standardized APIs so that, with customer consent, a third-party fintech app can read account data or initiate payments. This turns the customer's own data into something they can actually take with them, and it's a major driver of new fintech products (budgeting apps, alternative credit scoring) — but it also multiplies the surface area that data-privacy and security rules (Lesson 4.1) have to cover.</p>
<h3>Global trend 2: risk-based regulation</h3>
<p>Instead of one identical rulebook for every player, modern regulation increasingly scales requirements to actual risk: a small P2P lending pilot in a sandbox faces lighter rules than a systemically important payment network. This is the same logic behind CDD vs. EDD in Lesson 5.1, applied at the level of whole business models.</p>
<h3>Global trend 3: cross-border sandbox cooperation</h3>
<p>The <strong>UK FCA's regulatory sandbox (launched 2016)</strong> is widely credited as the model most other countries' sandboxes — including Vietnam's — were built on. Regulators increasingly cooperate directly (shared sandboxes, information-sharing agreements) because fintech products, unlike traditional banks, are cross-border by default from day one.</p>
<div class="callout"><span class="badge">Closing the loop</span> Every earlier chapter created an obligation — licensing, consumer protection, privacy, AML, algorithmic fairness, crypto rules. RegTech is the layer that makes actually meeting all of them, at real product scale, possible.</div>`,
    `<span class="eyebrow">FRE201 · Chương 8 · Bài 8.1</span>
<h2>RegTech, tuân thủ &amp; xu hướng pháp lý toàn cầu</h2>
<h3>RegTech thực sự tự động hoá điều gì</h3>
<p><strong>RegTech (Công nghệ hỗ trợ tuân thủ)</strong> là tập công cụ giúp một fintech tuân thủ ở quy mô lớn — vì kiểm tra thủ công từng khách hàng và từng giao dịch với mọi quy tắc trong môn này đơn giản là không thể mở rộng quá vài nghìn người dùng.</p>
<ul>
<li><strong>eKYC tự động</strong> — quét giấy tờ định danh + kiểm tra liveness/sinh trắc học biến việc xét duyệt đăng ký thủ công thành vài giây xác minh tự động.</li>
<li><strong>Giám sát giao dịch thời gian thực (dựa trên AI)</strong> — mô hình học máy chấm điểm rủi ro AML/gian lận cho từng giao dịch ngay khi nó xảy ra, thay vì xét theo lô định kỳ vài ngày sau.</li>
<li><strong>Báo cáo tuân thủ tự động</strong> — báo cáo tuân thủ (cho NHNN, cơ quan thuế, v.v.) được tạo trực tiếp từ hệ thống giao dịch, giảm cả chi phí và rủi ro sai sót khi báo cáo thủ công.</li>
</ul>
<h3>Xu hướng toàn cầu 1: Open Banking / Open Finance</h3>
<p>Quy định ngày càng yêu cầu ngân hàng mở API an toàn, chuẩn hoá để, với sự đồng ý của khách hàng, một app fintech bên thứ ba có thể đọc dữ liệu tài khoản hoặc khởi tạo thanh toán. Điều này biến dữ liệu của chính khách hàng thành thứ họ thực sự có thể mang theo, và là động lực lớn cho sản phẩm fintech mới (app quản lý chi tiêu, chấm điểm tín dụng thay thế) — nhưng nó cũng nhân rộng phạm vi mà quy tắc bảo mật dữ liệu (Bài 4.1) phải bao quát.</p>
<h3>Xu hướng toàn cầu 2: quản lý dựa trên rủi ro</h3>
<p>Thay vì một bộ quy tắc giống nhau cho mọi bên, quản lý hiện đại ngày càng điều chỉnh yêu cầu theo rủi ro thực tế: một thí điểm P2P lending nhỏ trong sandbox chịu quy tắc nhẹ hơn một mạng thanh toán có tầm quan trọng hệ thống. Đây cùng logic với CDD so với EDD ở Bài 5.1, áp dụng ở tầm toàn bộ mô hình kinh doanh.</p>
<h3>Xu hướng toàn cầu 3: hợp tác sandbox xuyên biên giới</h3>
<p><strong>Sandbox quản lý của FCA Anh (ra mắt 2016)</strong> được công nhận rộng rãi là mô hình mà sandbox của nhiều nước khác — gồm cả Việt Nam — dựa theo. Các cơ quan quản lý ngày càng hợp tác trực tiếp (sandbox chung, thoả thuận chia sẻ thông tin) vì sản phẩm fintech, khác với ngân hàng truyền thống, mang tính xuyên biên giới ngay từ ngày đầu.</p>
<div class="callout"><span class="badge">Khép vòng</span> Mỗi chương trước đó tạo ra một nghĩa vụ — cấp phép, bảo vệ NTD, bảo mật, AML, công bằng thuật toán, quy định crypto. RegTech là lớp giúp việc thực sự đáp ứng tất cả những nghĩa vụ đó, ở quy mô sản phẩm thật, trở nên khả thi.</div>`,
  ]]);

const c8q = quiz('fre201-quiz-8', 'Quiz 8 — RegTech & global trends|||Quiz 8 — RegTech & xu hướng toàn cầu', [
  { id: 'q1', question: 'RegTech giải quyết vấn đề chính nào?', options: ['Tăng lãi suất cho vay', 'Giúp tuân thủ quy định ở quy mô lớn mà kiểm tra thủ công không theo kịp', 'Thay thế hoàn toàn cơ quan quản lý', 'Chỉ dùng cho marketing'], correctIndex: 1, explanation: 'RegTech tự động hoá eKYC, giám sát giao dịch, báo cáo — cái mà thủ công không mở rộng được.' },
  { id: 'q2', question: 'Open Banking/Open Finance cho phép điều gì (với sự đồng ý khách hàng)?', options: ['Ngân hàng giữ độc quyền dữ liệu mãi mãi', 'App bên thứ ba đọc dữ liệu tài khoản hoặc khởi tạo thanh toán qua API chuẩn hoá', 'Xoá bỏ hoàn toàn yêu cầu bảo mật dữ liệu', 'Chỉ áp dụng cho tiền mặt'], correctIndex: 1, explanation: 'Open Banking mở API an toàn để bên thứ ba truy cập dữ liệu/thanh toán khi khách hàng đồng ý.' },
  { id: 'q3', question: 'Sandbox quản lý fintech của quốc gia nào được xem là mô hình gốc mà nhiều nước (gồm Việt Nam) dựa theo?', options: ['Nhật Bản', 'Anh (UK FCA, 2016)', 'Trung Quốc', 'Singapore'], correctIndex: 1, explanation: 'Sandbox của FCA Anh ra mắt 2016 là mô hình tham chiếu phổ biến nhất.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'FRE201',
    slug: 'fre201-fintech-regulations-and-ethics',
    title: 'Fintech regulations and ethics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FRE201.webp',
    shortDescription: 'How fintech is regulated & its ethics — legal framework & sandbox, consumer protection, data privacy (GDPR, Decree 13), AML/KYC, AI/credit-scoring ethics, crypto rules, RegTech & global trends. Bilingual, with real cases & quizzes.|||Fintech được quản lý ra sao và đạo đức đằng sau nó — khung pháp lý & sandbox, bảo vệ NTD, bảo mật dữ liệu (GDPR, NĐ 13), AML/KYC, đạo đức AI/chấm tín dụng, quy định crypto, RegTech & xu hướng toàn cầu. Song ngữ, có ca thực tế & quiz.',
    description: 'Môn <strong>FRE201 — Fintech Regulations and Ethics</strong> (kỳ 8, khối Quản trị Kinh doanh) giúp hiểu <strong>fintech được quản lý ra sao, và vì sao</strong>. Từ <strong>tổng quan &amp; vì sao cần quản lý</strong> (case ICO 2017, Terra/FTX) → <strong>khung pháp lý &amp; sandbox</strong> (giấy phép trung gian thanh toán, NHNN) → <strong>bảo vệ người tiêu dùng tài chính</strong> → <strong>bảo mật dữ liệu</strong> (GDPR, Nghị định 13/2023) → <strong>AML/KYC</strong> (FATF, STR) → <strong>đạo đức AI/thuật toán tài chính</strong> (chấm điểm tín dụng, case Apple Card) → <strong>quy định crypto &amp; tài sản ảo</strong> → <strong>RegTech &amp; xu hướng toàn cầu</strong> (Open Banking, sandbox quốc tế). Bám giáo trình FLM, song ngữ, có ca thực tế Việt Nam &amp; quốc tế, quiz mỗi chương.',
    whatYouLearn: 'Vì sao fintech cần quản lý (tam giác đổi mới–ổn định–bảo vệ); khung pháp lý VN (NHNN, giấy phép trung gian thanh toán, sandbox); bảo vệ người tiêu dùng tài chính (minh bạch phí, công bằng hợp đồng); bảo mật dữ liệu (GDPR, Nghị định 13/2023 — dữ liệu cơ bản/nhạy cảm, ĐTĐL); AML/KYC (FATF, CDD/EDD, STR, Luật PCRT 2022); đạo đức AI trong chấm điểm tín dụng (thiên lệch, nguyên tắc FAT, quyền giải thích); quy định crypto/tài sản ảo (VN vs EU MiCA); RegTech (eKYC, giám sát AI, báo cáo tự động) & xu hướng Open Banking, sandbox toàn cầu.',
    requirements: 'Không yêu cầu kiến thức pháp lý trước. Nên có hiểu biết cơ bản về dịch vụ tài chính/ngân hàng (đã học các môn nền BBA) và quan tâm tới công nghệ tài chính.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách tham khảo, tài liệu chính thức NHNN/quốc tế, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Fintech là gì, vì sao cần quản lý, tam giác đổi mới–ổn định–bảo vệ.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan fintech & quản lý|||Chapter 1 — Fintech overview & regulation', description: 'Nhóm fintech, case ICO/Terra/FTX, ba mục tiêu quản lý.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khung pháp lý & sandbox|||Chapter 2 — Legal framework & sandbox', description: 'NHNN, giấy phép trung gian thanh toán, cơ chế sandbox.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Bảo vệ người tiêu dùng tài chính|||Chapter 3 — Consumer protection', description: 'Minh bạch phí, công bằng hợp đồng, Luật BVQLNTD 2023.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Bảo mật dữ liệu & quyền riêng tư|||Chapter 4 — Data privacy', description: 'GDPR, Nghị định 13/2023, dữ liệu nhạy cảm.', lessons: [c4, c4q] },
    { title: 'Chương 5 — AML/KYC trong fintech|||Chapter 5 — AML/KYC', description: 'FATF, CDD/EDD, STR, Luật PCRT 2022.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đạo đức AI/thuật toán tài chính|||Chapter 6 — AI ethics in finance', description: 'Thiên lệch chấm điểm tín dụng, case Apple Card, nguyên tắc FAT.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Quy định crypto & tài sản ảo|||Chapter 7 — Crypto & virtual assets', description: 'Định nghĩa, vị trí VN, EU MiCA.', lessons: [c7, c7q] },
    { title: 'Chương 8 — RegTech & xu hướng toàn cầu|||Chapter 8 — RegTech & global trends', description: 'eKYC, giám sát AI, Open Banking, sandbox quốc tế.', lessons: [c8, c8q] },
  ],
};
