/**
 * BFD301 — Digital Banking. Giáo trình tham khảo: "The FINTECH Book"
 * (Chishti/Barberis); Skinner "Digital Bank" & "Digital Human"; King
 * "Bank 4.0"; báo cáo McKinsey/Deloitte về chuyển đổi số ngân hàng.
 * 8 chương: tổng quan & chuyển đổi số → kênh số/CX → thanh toán số →
 * fintech & hợp tác (Open Banking/BaaS) → công nghệ nền (cloud/AI/big
 * data/blockchain) → an ninh & eKYC → neobank/siêu ứng dụng → pháp lý &
 * tương lai. Song ngữ. Giữ NGUYÊN slug/semester/thumb(v3) của stub.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('bfd301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách nền tảng (FINTECH Book, Bank 4.0, Digital Bank/Human), báo cáo McKinsey/Deloitte, cổng NHNN & NAPAS, kênh YouTube, công cụ tra cứu, lộ trình tự học.',
  [[
    `<span class="eyebrow">BFD301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Digital Banking — digital transformation, channels &amp; CX, digital payments, fintech partnerships, core technology, security, neobanks and regulation — in one place. Official FPTU slides live on <strong>FLM</strong>; below are free, legal resources used to build this course.</p>
<h3>📘 Foundational books</h3>
<ul>
<li><a href="https://thefintechbook.com/" target="_blank" rel="noopener"><em>The FINTECH Book</em> — Susanne Chishti &amp; Janos Barberis</a> — the crowd-sourced global fintech reference.</li>
<li><a href="https://thefinanser.com/" target="_blank" rel="noopener">Chris Skinner — <em>Digital Bank</em> &amp; <em>Digital Human</em></a> (author's blog, The Finanser).</li>
<li><a href="https://brettking.com/" target="_blank" rel="noopener">Brett King — <em>Bank 4.0</em></a> — "banking is no longer a place you go, it's something you do."</li>
</ul>
<h3>🌐 Official / free research</h3>
<ul>
<li><a href="https://www.mckinsey.com/industries/financial-services/our-insights" target="_blank" rel="noopener">McKinsey — Financial Services Insights</a></li>
<li><a href="https://www2.deloitte.com/us/en/insights/industry/financial-services.html" target="_blank" rel="noopener">Deloitte — Financial Services Insights</a></li>
<li><a href="https://www.worldbank.org/en/publication/globalfindex" target="_blank" rel="noopener">World Bank — Global Findex Database</a> (financial inclusion data)</li>
<li><a href="https://www.sbv.gov.vn" target="_blank" rel="noopener">Ngân hàng Nhà nước Việt Nam (SBV)</a> — official regulator</li>
<li><a href="https://napas.com.vn" target="_blank" rel="noopener">NAPAS</a> — national payment switch, operates VietQR</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@11FS" target="_blank" rel="noopener">11:FS (Fintech Insider)</a> — fintech &amp; digital banking analysis</li>
<li><a href="https://www.youtube.com/@wef" target="_blank" rel="noopener">World Economic Forum</a> — future-of-finance panels</li>
</ul>
<h3>🛠️ Reference tools</h3>
<ul>
<li><a href="https://www.investopedia.com/terms/f/fintech.asp" target="_blank" rel="noopener">Investopedia — Fintech</a></li>
<li><a href="https://www.investopedia.com/terms/o/open-banking.asp" target="_blank" rel="noopener">Investopedia — Open Banking</a></li>
<li><a href="https://vietqr.net" target="_blank" rel="noopener">VietQR.net</a> — VietQR standard reference</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — what "digital banking" means, the transformation stages, digital channels &amp; omnichannel CX.</li>
<li><strong>Practice</strong> — trace a real QR payment or eKYC onboarding flow end to end; compare a neobank app with a traditional bank app.</li>
<li><strong>Go deeper</strong> — Open Banking/BaaS architecture, cloud/AI/blockchain in banking, fraud &amp; security controls.</li>
<li><strong>Job-ready</strong> — read SBV circulars on eKYC and payment intermediaries; follow McKinsey/Deloitte banking reports for current trends.</li>
</ol></div>`,
    `<span class="eyebrow">BFD301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Ngân hàng số — chuyển đổi số, kênh số &amp; trải nghiệm khách hàng, thanh toán số, hợp tác fintech, công nghệ nền, an ninh và pháp lý — gom về một chỗ. Slide chính thức FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp dùng để dựng môn này.</p>
<h3>📘 Sách nền tảng</h3>
<ul>
<li><a href="https://thefintechbook.com/" target="_blank" rel="noopener"><em>The FINTECH Book</em> — Susanne Chishti &amp; Janos Barberis</a> — tài liệu fintech toàn cầu, tổng hợp từ cộng đồng.</li>
<li><a href="https://thefinanser.com/" target="_blank" rel="noopener">Chris Skinner — <em>Digital Bank</em> &amp; <em>Digital Human</em></a> (blog tác giả, The Finanser).</li>
<li><a href="https://brettking.com/" target="_blank" rel="noopener">Brett King — <em>Bank 4.0</em></a> — "ngân hàng không còn là nơi bạn đến, mà là việc bạn làm."</li>
</ul>
<h3>🌐 Nghiên cứu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.mckinsey.com/industries/financial-services/our-insights" target="_blank" rel="noopener">McKinsey — Financial Services Insights</a></li>
<li><a href="https://www2.deloitte.com/us/en/insights/industry/financial-services.html" target="_blank" rel="noopener">Deloitte — Financial Services Insights</a></li>
<li><a href="https://www.worldbank.org/en/publication/globalfindex" target="_blank" rel="noopener">World Bank — Global Findex Database</a> (dữ liệu phổ cập tài chính)</li>
<li><a href="https://www.sbv.gov.vn" target="_blank" rel="noopener">Ngân hàng Nhà nước Việt Nam (NHNN/SBV)</a> — cơ quan quản lý chính thức</li>
<li><a href="https://napas.com.vn" target="_blank" rel="noopener">NAPAS</a> — hạ tầng chuyển mạch quốc gia, vận hành VietQR</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@11FS" target="_blank" rel="noopener">11:FS (Fintech Insider)</a> — phân tích fintech &amp; ngân hàng số</li>
<li><a href="https://www.youtube.com/@wef" target="_blank" rel="noopener">World Economic Forum</a> — hội thảo tương lai tài chính</li>
</ul>
<h3>🛠️ Công cụ tra cứu</h3>
<ul>
<li><a href="https://www.investopedia.com/terms/f/fintech.asp" target="_blank" rel="noopener">Investopedia — Fintech</a></li>
<li><a href="https://www.investopedia.com/terms/o/open-banking.asp" target="_blank" rel="noopener">Investopedia — Open Banking</a></li>
<li><a href="https://vietqr.net" target="_blank" rel="noopener">VietQR.net</a> — tham chiếu chuẩn VietQR</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — "ngân hàng số" nghĩa là gì, các giai đoạn chuyển đổi số, kênh số &amp; trải nghiệm omnichannel.</li>
<li><strong>Luyện tập</strong> — lần theo một luồng thanh toán QR hoặc luồng eKYC thật từ đầu đến cuối; so sánh app neobank với app ngân hàng truyền thống.</li>
<li><strong>Đào sâu</strong> — kiến trúc Open Banking/BaaS, cloud/AI/blockchain trong ngân hàng, kiểm soát gian lận &amp; an ninh.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc thông tư NHNN về eKYC và trung gian thanh toán; theo dõi báo cáo McKinsey/Deloitte về xu hướng ngân hàng.</li>
</ol></div>`,
  ]]);

const intro = doc('bfd301-0-1-overview', 'Course overview: Digital Banking|||Tổng quan: Ngân hàng số',
  'Ngân hàng số là gì, vì sao ngành ngân hàng buộc phải chuyển đổi số; lộ trình 8 chương: tổng quan → kênh số → thanh toán số → fintech/hợp tác → công nghệ nền → an ninh → neobank/siêu ứng dụng → pháp lý & tương lai.',
  [[
    `<span class="eyebrow">BFD301 · Lesson 0.1 · Overview</span>
<h2>Digital Banking</h2>
<p class="lead">This course helps you understand <strong>how banks turn digital</strong> — from mobile apps and instant QR payments to fintech partnerships, cloud/AI infrastructure, security, neobanks and the regulation that shapes it all in Vietnam.</p>
<h3>What "digital banking" really means</h3>
<p>Digital banking is broader than "an app for your bank account." It spans <strong>digital channels</strong> (mobile/internet banking), <strong>digital payments</strong> (e-wallets, QR, real-time transfers), <strong>digital operations</strong> (cloud, AI, data), and entirely new <strong>digital-only business models</strong> (neobanks, super-apps, embedded finance). As Brett King puts it in <em>Bank 4.0</em>: banking is shifting from a <em>place you go</em> to <em>something you do</em> — increasingly invisible, embedded inside other apps and everyday life.</p>
<h3>Roadmap</h3>
<p>Overview &amp; transformation → digital channels &amp; CX → digital payments → fintech &amp; partnership models (Open Banking/BaaS) → core technology (cloud/AI/big data/blockchain) → security &amp; eKYC → neobanks &amp; super-apps → regulation, risk &amp; the future of Vietnamese digital banking. Bilingual, with diagrams and quizzes.</p>`,
    `<span class="eyebrow">BFD301 · Bài 0.1 · Tổng quan</span>
<h2>Ngân hàng số</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>ngân hàng chuyển đổi số như thế nào</strong> — từ app di động và thanh toán QR tức thời, đến hợp tác fintech, hạ tầng cloud/AI, an ninh, mô hình neobank và khung pháp lý định hình tất cả tại Việt Nam.</p>
<h3>"Ngân hàng số" thực sự nghĩa là gì</h3>
<p>Ngân hàng số rộng hơn "một app cho tài khoản ngân hàng". Nó gồm <strong>kênh số</strong> (mobile/internet banking), <strong>thanh toán số</strong> (ví điện tử, QR, chuyển tiền thời gian thực), <strong>vận hành số</strong> (cloud, AI, dữ liệu), và những <strong>mô hình kinh doanh hoàn toàn mới</strong> (neobank, siêu ứng dụng, tài chính nhúng). Như Brett King viết trong <em>Bank 4.0</em>: ngân hàng đang chuyển từ <em>một nơi bạn đến</em> thành <em>một việc bạn làm</em> — ngày càng vô hình, nhúng vào các ứng dụng và đời sống hằng ngày.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; chuyển đổi số → kênh số &amp; trải nghiệm khách hàng → thanh toán số → fintech &amp; mô hình hợp tác (Open Banking/BaaS) → công nghệ nền (cloud/AI/big data/blockchain) → an ninh &amp; eKYC → neobank &amp; siêu ứng dụng → pháp lý, rủi ro &amp; tương lai ngân hàng số Việt Nam. Song ngữ, có sơ đồ và quiz.</p>`,
  ]]);

const c1 = doc('bfd301-1-1-tong-quan', '1.1 — Digital banking overview & industry transformation|||1.1 — Tổng quan ngân hàng số & chuyển đổi số ngành',
  'Digital banking vs digitized banking; 3 giai đoạn chuyển đổi số (digitization → digitalization → digital transformation); động lực chuyển đổi; tầm nhìn Bank 1.0→4.0 (Brett King).',
  [[
    `<span class="eyebrow">BFD301 · Chapter 1 · Lesson 1.1</span>
<h2>Digital banking overview &amp; industry transformation</h2>
<h3>Digitized vs digital vs digital-only</h3>
<ul>
<li><strong>Digitized banking</strong> — old paper processes turned into electronic files (scan a form to PDF). The process itself doesn't change.</li>
<li><strong>Digital banking</strong> — the operating model and customer experience are rebuilt around digital channels and data, end to end.</li>
<li><strong>Digital-only bank (neobank)</strong> — no physical branches at all; the entire relationship lives in an app.</li>
</ul>
<h3>Three stages of digital transformation</h3>
<pre><code>1. Digitization        -> convert analog to digital (paper -> PDF, ledger -> database)
2. Digitalization      -> use digital tech to change a process (branch queue -> mobile app request)
3. Digital transformation -> rethink the whole business/operating model & culture around digital
</code></pre>
<h3>Why banks are forced to transform</h3>
<ul>
<li><strong>Customer expectation</strong> — people expect banking to feel like their favorite app (instant, simple, 24/7), not a queue at a branch.</li>
<li><strong>Fintech &amp; Big Tech competition</strong> — non-banks now offer payments, lending and wealth products without a branch network.</li>
<li><strong>Cost pressure</strong> — digital channels are dramatically cheaper to serve than branches/tellers.</li>
<li><strong>Regulatory push</strong> — eKYC, Open Banking and sandbox rules actively encourage digital models.</li>
</ul>
<h3>Bank 1.0 → 4.0 (Brett King)</h3>
<pre><code>Bank 1.0 -> Branch-based (you must visit a location)
Bank 2.0 -> Internet banking (self-service on the web)
Bank 3.0 -> Mobile-first (banking in your pocket, anytime)
Bank 4.0 -> Embedded / invisible banking (banking is a feature inside other apps, not a destination)
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Digital transformation is not "add an app" — it's rebuilding processes, culture and business model around digital, data and the customer's real behavior.</div>`,
    `<span class="eyebrow">BFD301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan ngân hàng số &amp; chuyển đổi số ngành</h2>
<h3>Số hoá vs ngân hàng số vs ngân hàng thuần số</h3>
<ul>
<li><strong>Số hoá (digitized)</strong> — quy trình giấy cũ được chuyển thành file điện tử (quét biểu mẫu thành PDF). Bản thân quy trình không đổi.</li>
<li><strong>Ngân hàng số (digital banking)</strong> — mô hình vận hành và trải nghiệm khách hàng được dựng lại xung quanh kênh số và dữ liệu, từ đầu đến cuối.</li>
<li><strong>Ngân hàng thuần số (neobank)</strong> — không có chi nhánh vật lý; toàn bộ mối quan hệ khách hàng nằm trong một app.</li>
</ul>
<h3>Ba giai đoạn chuyển đổi số</h3>
<pre><code>1. Digitization (số hoá)       -> chuyển analog sang số (giấy -> PDF, sổ sách -> database)
2. Digitalization (số hoá quy trình) -> dùng công nghệ số để thay đổi cách làm (xếp hàng tại quầy -> yêu cầu qua app)
3. Digital transformation (chuyển đổi số) -> nghĩ lại toàn bộ mô hình kinh doanh/vận hành & văn hoá quanh số hoá
</code></pre>
<h3>Vì sao ngân hàng buộc phải chuyển đổi</h3>
<ul>
<li><strong>Kỳ vọng khách hàng</strong> — người dùng muốn trải nghiệm ngân hàng như app yêu thích (tức thời, đơn giản, 24/7), không phải xếp hàng tại quầy.</li>
<li><strong>Cạnh tranh từ fintech &amp; Big Tech</strong> — các công ty phi ngân hàng cung cấp thanh toán, cho vay, đầu tư mà không cần mạng lưới chi nhánh.</li>
<li><strong>Áp lực chi phí</strong> — kênh số phục vụ khách rẻ hơn nhiều so với chi nhánh/giao dịch viên.</li>
<li><strong>Thúc đẩy từ quy định</strong> — quy định eKYC, Open Banking, sandbox chủ động khuyến khích mô hình số.</li>
</ul>
<h3>Bank 1.0 → 4.0 (Brett King)</h3>
<pre><code>Bank 1.0 -> Dựa vào chi nhánh (phải đến tận nơi)
Bank 2.0 -> Internet banking (tự phục vụ trên web)
Bank 3.0 -> Mobile-first (ngân hàng trong túi, mọi lúc)
Bank 4.0 -> Ngân hàng nhúng/vô hình (ngân hàng là tính năng bên trong app khác, không phải điểm đến)
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Chuyển đổi số không phải "thêm một cái app" — mà là dựng lại quy trình, văn hoá và mô hình kinh doanh xung quanh số hoá, dữ liệu và hành vi thực của khách hàng.</div>`,
  ]]);

const c1q = quiz('bfd301-quiz-1', 'Quiz 1 — Overview & transformation|||Quiz 1 — Tổng quan & chuyển đổi số', [
  { id: 'q1', question: '"Digital banking" khác "digitized banking" (số hoá đơn thuần) ở điểm nào?', options: ['Chỉ là quét giấy tờ thành file PDF', 'Chuyển đổi toàn diện mô hình vận hành & trải nghiệm quanh kênh số/dữ liệu, không chỉ số hoá quy trình cũ', 'Không có khác biệt, hai khái niệm giống nhau', 'Digital banking chỉ áp dụng cho ngân hàng nước ngoài'], correctIndex: 1, explanation: 'Digitized banking chỉ chuyển giấy tờ sang điện tử; digital banking dựng lại cả vận hành & trải nghiệm quanh số hoá.' },
  { id: 'q2', question: 'Theo Brett King (Bank 4.0), ngân hàng tương lai được mô tả là?', options: ['Một nơi khách hàng phải đến (a place)', 'Một việc khách hàng làm (something you do), có thể nhúng/vô hình trong dịch vụ khác', 'Chỉ tồn tại dưới dạng website tĩnh', 'Một dịch vụ chỉ dành cho doanh nghiệp lớn'], correctIndex: 1, explanation: 'Bank 4.0: ngân hàng chuyển từ "nơi đến" sang "việc làm", ngày càng nhúng vào đời sống số.' },
  { id: 'q3', question: 'Thứ tự đúng của 3 giai đoạn chuyển đổi số ngân hàng?', options: ['Digitalization → Digitization → Digital transformation', 'Digital transformation → Digitization → Digitalization', 'Digitization → Digitalization → Digital transformation', 'Digitalization → Digital transformation → Digitization'], correctIndex: 2, explanation: 'Số hoá dữ liệu → số hoá quy trình → chuyển đổi toàn bộ mô hình/văn hoá.' },
]);

const c2 = doc('bfd301-2-1-kenh-so', '2.1 — Digital channels & customer experience|||2.1 — Kênh số & trải nghiệm khách hàng',
  'Mobile banking vs internet banking; omnichannel vs multichannel; nguyên tắc CX số: cá nhân hoá, tự phục vụ, thời gian thực.',
  [[
    `<span class="eyebrow">BFD301 · Chapter 2 · Lesson 2.1</span>
<h2>Digital channels &amp; customer experience</h2>
<h3>Mobile banking vs internet banking</h3>
<ul>
<li><strong>Internet banking</strong> — accessed via a web browser on desktop/laptop; historically the first self-service channel.</li>
<li><strong>Mobile banking</strong> — a dedicated smartphone app; leverages biometrics (fingerprint/face), push notifications, camera (for QR/eKYC) and location — richer and faster than the web.</li>
</ul>
<h3>Multichannel vs omnichannel</h3>
<pre><code>Multichannel: Branch | ATM | Web | App | Call center   (each channel works alone, data is siloed)
Omnichannel:  Branch - ATM - Web - App - Call center    (all connected to ONE customer data platform)
              A customer can start a request on the app and finish it at a branch with full context.
</code></pre>
<h3>Principles of good digital CX</h3>
<ul>
<li><strong>Self-service</strong> — customers complete tasks (open account, dispute, request card) without calling anyone.</li>
<li><strong>Personalization</strong> — offers and content adapt to each customer's data and behavior, not one-size-fits-all.</li>
<li><strong>Real-time</strong> — balances, transfers and notifications update instantly, not overnight.</li>
<li><strong>Consistency</strong> — the same information and status are visible no matter which channel the customer uses next.</li>
</ul>
<div class="callout"><span class="badge">Why it matters</span> Omnichannel isn't "more channels" — it's ONE unified customer view behind every channel, so switching channels never means starting over.</div>`,
    `<span class="eyebrow">BFD301 · Chương 2 · Bài 2.1</span>
<h2>Kênh số &amp; trải nghiệm khách hàng</h2>
<h3>Mobile banking vs internet banking</h3>
<ul>
<li><strong>Internet banking</strong> — truy cập qua trình duyệt web trên máy tính; là kênh tự phục vụ đầu tiên trong lịch sử.</li>
<li><strong>Mobile banking</strong> — app riêng trên điện thoại; tận dụng sinh trắc học (vân tay/khuôn mặt), thông báo đẩy, camera (cho QR/eKYC) và vị trí — phong phú và nhanh hơn web.</li>
</ul>
<h3>Multichannel vs omnichannel</h3>
<pre><code>Multichannel: Chi nhánh | ATM | Web | App | Tổng đài   (mỗi kênh hoạt động riêng, dữ liệu tách rời)
Omnichannel:  Chi nhánh - ATM - Web - App - Tổng đài    (tất cả nối vào MỘT nền tảng dữ liệu khách hàng)
              Khách có thể bắt đầu yêu cầu trên app và hoàn tất tại chi nhánh mà không mất ngữ cảnh.
</code></pre>
<h3>Nguyên tắc trải nghiệm số tốt</h3>
<ul>
<li><strong>Tự phục vụ (self-service)</strong> — khách hoàn tất tác vụ (mở tài khoản, khiếu nại, yêu cầu thẻ) mà không cần gọi ai.</li>
<li><strong>Cá nhân hoá</strong> — ưu đãi và nội dung thích ứng theo dữ liệu/hành vi từng khách, không rập khuôn một kiểu cho tất cả.</li>
<li><strong>Thời gian thực</strong> — số dư, chuyển khoản, thông báo cập nhật tức thời, không phải qua đêm.</li>
<li><strong>Nhất quán</strong> — cùng một thông tin và trạng thái hiển thị dù khách chuyển sang kênh nào tiếp theo.</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Omnichannel không phải "nhiều kênh hơn" — mà là MỘT góc nhìn khách hàng thống nhất phía sau mọi kênh, nên đổi kênh không bao giờ có nghĩa là bắt đầu lại từ đầu.</div>`,
  ]]);

const c2q = quiz('bfd301-quiz-2', 'Quiz 2 — Channels & CX|||Quiz 2 — Kênh số & trải nghiệm khách hàng', [
  { id: 'q1', question: 'Omnichannel khác multichannel chủ yếu ở điểm nào?', options: ['Omnichannel có nhiều kênh hơn về số lượng', 'Omnichannel đồng bộ MỘT dữ liệu khách hàng xuyên suốt các kênh, trải nghiệm liền mạch', 'Multichannel chỉ dùng cho ngân hàng nhỏ', 'Không có khác biệt thực tế'], correctIndex: 1, explanation: 'Omnichannel hợp nhất dữ liệu để khách chuyển kênh không mất ngữ cảnh; multichannel để các kênh hoạt động tách rời.' },
  { id: 'q2', question: 'Mobile banking khác internet banking chủ yếu ở điểm nào?', options: ['Mobile banking không cần bảo mật', 'Mobile banking là app riêng trên di động, tận dụng sinh trắc học/camera/thông báo đẩy; internet banking chạy qua trình duyệt web', 'Internet banking mới hơn mobile banking', 'Hai kênh này hoàn toàn giống nhau'], correctIndex: 1, explanation: 'Nền tảng truy cập khác nhau: app di động (giàu tính năng phần cứng) vs trình duyệt web.' },
  { id: 'q3', question: 'Đâu là nguyên tắc CỐT LÕI của trải nghiệm khách hàng số tốt?', options: ['Bắt khách gọi tổng đài cho mọi yêu cầu', 'Tự phục vụ, cá nhân hoá và cập nhật thời gian thực', 'Chỉ cung cấp dịch vụ qua chi nhánh', 'Ẩn thông tin số dư để tăng bảo mật'], correctIndex: 1, explanation: 'Self-service, personalization và real-time là ba trụ cột của CX số tốt.' },
]);

const c3 = doc('bfd301-3-1-thanh-toan-so', '3.1 — Digital payments|||3.1 — Thanh toán số',
  'Ví điện tử, QR code (VietQR/NAPAS), thanh toán thời gian thực; luồng thanh toán QR end-to-end; lợi ích cho nền kinh tế không tiền mặt.',
  [[
    `<span class="eyebrow">BFD301 · Chapter 3 · Lesson 3.1</span>
<h2>Digital payments</h2>
<h3>The building blocks</h3>
<ul>
<li><strong>E-wallets</strong> (payment intermediaries) — apps that hold a stored balance or link to a bank account/card to pay merchants and peers (e.g. MoMo, ZaloPay, VNPay).</li>
<li><strong>QR payments</strong> — a merchant or customer QR code encodes payment info; scanning it triggers a transfer. <strong>VietQR</strong> is Vietnam's interoperable QR standard, so any participating bank/wallet app can scan any VietQR code.</li>
<li><strong>Real-time / instant payments</strong> — money moves and settles within seconds, 24/7 — not "next business day."</li>
</ul>
<h3>NAPAS — the national switch</h3>
<p><strong>NAPAS</strong> is Vietnam's national payment switch: it connects banks and wallets to each other, routes interbank transfers, and operates the <strong>VietQR</strong> standard and 24/7 real-time transfer rail.</p>
<h3>A QR payment, step by step</h3>
<pre><code>1. Merchant displays a VietQR code (static or dynamic, amount encoded)
2. Customer scans it with a bank app or e-wallet
3. App sends the payment request to its bank/wallet
4. NAPAS (the switch) routes the request to the merchant's bank
5. Merchant's bank credits the merchant account -> confirmation sent back, near-instant
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Interoperable QR + real-time rails are why Vietnam's cash-lite payment habits (transport, street food, bill splitting) became possible almost overnight — no new hardware needed, just a camera.</div>`,
    `<span class="eyebrow">BFD301 · Chương 3 · Bài 3.1</span>
<h2>Thanh toán số</h2>
<h3>Các khối cấu thành</h3>
<ul>
<li><strong>Ví điện tử</strong> (trung gian thanh toán) — app giữ số dư hoặc liên kết tài khoản/thẻ ngân hàng để trả cho người bán và chuyển ngang hàng (vd MoMo, ZaloPay, VNPay).</li>
<li><strong>Thanh toán QR</strong> — mã QR của người bán hoặc người mua mã hoá thông tin thanh toán; quét mã kích hoạt lệnh chuyển tiền. <strong>VietQR</strong> là chuẩn QR liên thông của Việt Nam, nên bất kỳ app ngân hàng/ví nào tham gia đều quét được mọi mã VietQR.</li>
<li><strong>Thanh toán thời gian thực</strong> — tiền chuyển và ghi có trong vài giây, 24/7 — không phải "ngày làm việc kế tiếp".</li>
</ul>
<h3>NAPAS — chuyển mạch quốc gia</h3>
<p><strong>NAPAS</strong> là chuyển mạch thanh toán quốc gia của Việt Nam: kết nối các ngân hàng và ví với nhau, định tuyến chuyển khoản liên ngân hàng, và vận hành chuẩn <strong>VietQR</strong> cùng hạ tầng chuyển tiền thời gian thực 24/7.</p>
<h3>Một giao dịch QR, từng bước</h3>
<pre><code>1. Người bán hiển thị mã VietQR (tĩnh hoặc động, có sẵn số tiền)
2. Người mua quét mã bằng app ngân hàng hoặc ví điện tử
3. App gửi yêu cầu thanh toán tới ngân hàng/ví của mình
4. NAPAS (chuyển mạch) định tuyến yêu cầu tới ngân hàng người bán
5. Ngân hàng người bán ghi có vào tài khoản -> gửi xác nhận về, gần như tức thời
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> QR liên thông + hạ tầng thời gian thực là lý do thói quen thanh toán ít tiền mặt ở Việt Nam (xe buýt, hàng quán, chia tiền) trở nên khả thi gần như chỉ sau một đêm — không cần thiết bị mới, chỉ cần camera.</div>`,
  ]]);

const c3q = quiz('bfd301-quiz-3', 'Quiz 3 — Digital payments|||Quiz 3 — Thanh toán số', [
  { id: 'q1', question: 'NAPAS đóng vai trò gì trong thanh toán số Việt Nam?', options: ['Là một ngân hàng thương mại bán lẻ', 'Là hạ tầng chuyển mạch quốc gia, kết nối liên ngân hàng và vận hành VietQR/chuyển tiền thời gian thực', 'Chỉ phát hành thẻ tín dụng', 'Là cơ quan cấp phép ngân hàng'], correctIndex: 1, explanation: 'NAPAS là chuyển mạch quốc gia, định tuyến giao dịch liên ngân hàng và vận hành VietQR.' },
  { id: 'q2', question: 'Thứ tự đúng của một giao dịch thanh toán QR?', options: ['Ngân hàng người bán ghi có → khách quét mã → NAPAS định tuyến', 'Khách quét mã → app gửi yêu cầu → NAPAS định tuyến → ngân hàng người bán ghi có', 'NAPAS định tuyến → khách quét mã → app gửi yêu cầu', 'Không cần chuyển mạch, ngân hàng tự xử lý hết'], correctIndex: 1, explanation: 'Đúng luồng: quét mã → gửi yêu cầu → chuyển mạch định tuyến → ghi có bên nhận.' },
  { id: 'q3', question: 'Lợi ích chính của thanh toán thời gian thực (real-time payment) là gì?', options: ['Tiền chỉ chuyển được trong giờ hành chính', 'Tiền đến và ghi có gần như ngay lập tức, hoạt động 24/7', 'Chỉ áp dụng cho giao dịch quốc tế', 'Yêu cầu phải có thẻ vật lý'], correctIndex: 1, explanation: 'Real-time payment: tiền đến trong vài giây, mọi lúc, khác hẳn mô hình "ngày làm việc kế tiếp".' },
]);

const c4 = doc('bfd301-4-1-fintech-hop-tac', '4.1 — Fintech & partnership models (Open Banking, API, BaaS)|||4.1 — Fintech & mô hình hợp tác (Open Banking, API, BaaS)',
  'Open Banking (chia sẻ dữ liệu qua API có sự đồng ý của khách hàng); Banking-as-a-Service (BaaS); ba mô hình hợp tác build/buy/partner.',
  [[
    `<span class="eyebrow">BFD301 · Chapter 4 · Lesson 4.1</span>
<h2>Fintech &amp; partnership models</h2>
<h3>Open Banking</h3>
<p><strong>Open Banking</strong> lets a bank securely share a customer's financial data (with the customer's explicit consent) with third-party providers through standardized <strong>APIs</strong> — e.g. a budgeting app that reads your balances across several banks, or a lender that verifies your income directly instead of asking for bank statements.</p>
<h3>Banking-as-a-Service (BaaS)</h3>
<p><strong>BaaS</strong> flips the relationship: a <em>licensed</em> bank exposes its regulated infrastructure (accounts, cards, payments, compliance) via API so a fintech or non-bank brand can launch financial products under its own name, without becoming a bank itself.</p>
<pre><code>BaaS stack:
  Licensed bank core (holds the license, capital, compliance)
        |  API layer (accounts, cards, payments, KYC)
        v
  Fintech / brand front-end (the app the end customer actually sees)
        |
        v
  End customer
</code></pre>
<h3>Three ways to compete: build, buy, partner</h3>
<ul>
<li><strong>Build</strong> — the bank develops the capability in-house (full control, slow, expensive).</li>
<li><strong>Buy</strong> — the bank acquires a fintech or vendor solution outright.</li>
<li><strong>Partner</strong> — the bank integrates with an existing fintech via API (fast, shared risk, less control) — this is the model Open Banking and BaaS enable.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Open Banking is data flowing OUT of the bank (with consent); BaaS is banking infrastructure flowing OUT to power someone else's brand. Both run on the same enabler: APIs.</div>`,
    `<span class="eyebrow">BFD301 · Chương 4 · Bài 4.1</span>
<h2>Fintech &amp; mô hình hợp tác</h2>
<h3>Open Banking</h3>
<p><strong>Open Banking</strong> cho phép ngân hàng chia sẻ an toàn dữ liệu tài chính của khách hàng (với sự đồng ý rõ ràng của khách) cho bên thứ ba qua <strong>API</strong> chuẩn hoá — vd một app quản lý chi tiêu đọc số dư từ nhiều ngân hàng, hoặc một bên cho vay xác minh thu nhập trực tiếp thay vì yêu cầu sao kê giấy.</p>
<h3>Banking-as-a-Service (BaaS)</h3>
<p><strong>BaaS</strong> đảo ngược mối quan hệ: một ngân hàng <em>có giấy phép</em> mở hạ tầng được quản lý của mình (tài khoản, thẻ, thanh toán, tuân thủ) qua API để fintech hoặc thương hiệu phi ngân hàng ra mắt sản phẩm tài chính dưới tên riêng, mà không cần tự trở thành ngân hàng.</p>
<pre><code>Chồng BaaS:
  Lõi ngân hàng có giấy phép (giữ giấy phép, vốn, tuân thủ)
        |  Lớp API (tài khoản, thẻ, thanh toán, KYC)
        v
  Fintech / thương hiệu tầng ứng dụng (thứ khách hàng cuối thực sự nhìn thấy)
        |
        v
  Khách hàng cuối
</code></pre>
<h3>Ba cách để cạnh tranh: build, buy, partner</h3>
<ul>
<li><strong>Build (tự xây)</strong> — ngân hàng tự phát triển năng lực (kiểm soát toàn diện, chậm, tốn kém).</li>
<li><strong>Buy (mua lại)</strong> — ngân hàng mua đứt một fintech hoặc giải pháp có sẵn.</li>
<li><strong>Partner (hợp tác)</strong> — ngân hàng tích hợp với fintech có sẵn qua API (nhanh, chia sẻ rủi ro, ít kiểm soát hơn) — đây là mô hình Open Banking và BaaS mở ra.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Open Banking là dữ liệu chảy RA khỏi ngân hàng (có sự đồng ý); BaaS là hạ tầng ngân hàng chảy RA để vận hành thương hiệu của người khác. Cả hai đều chạy trên cùng một chất xúc tác: API.</div>`,
  ]]);

const c4q = quiz('bfd301-quiz-4', 'Quiz 4 — Fintech & partnerships|||Quiz 4 — Fintech & hợp tác', [
  { id: 'q1', question: 'Open Banking là gì?', options: ['Ngân hàng đóng cửa mọi API vì lý do bảo mật', 'Ngân hàng chia sẻ dữ liệu khách hàng (có sự đồng ý) qua API chuẩn cho bên thứ ba', 'Một loại ngân hàng không có giấy phép', 'Chỉ là tên gọi khác của internet banking'], correctIndex: 1, explanation: 'Open Banking: chia sẻ dữ liệu tài chính qua API, luôn có sự đồng ý của khách hàng.' },
  { id: 'q2', question: 'Banking-as-a-Service (BaaS) nghĩa là gì?', options: ['Fintech tự xin giấy phép ngân hàng riêng', 'Ngân hàng có giấy phép cho fintech/thương hiệu khác dùng hạ tầng của mình qua API để ra sản phẩm tài chính riêng', 'Một ứng dụng chấm điểm tín dụng miễn phí', 'Dịch vụ chỉ dành cho khách hàng VIP tại quầy'], correctIndex: 1, explanation: 'BaaS: ngân hàng có giấy phép mở hạ tầng qua API cho bên khác xây sản phẩm dưới thương hiệu riêng.' },
  { id: 'q3', question: 'Trong ba mô hình "build, buy, partner", "partner" nghĩa là gì?', options: ['Ngân hàng tự phát triển toàn bộ tính năng', 'Ngân hàng mua đứt một công ty fintech', 'Ngân hàng hợp tác/tích hợp với fintech có sẵn qua API thay vì tự xây hoặc mua lại', 'Ngân hàng ngừng cung cấp dịch vụ số'], correctIndex: 2, explanation: 'Partner: tích hợp với fintech qua API — nhanh hơn build, ít rủi ro tài chính hơn buy.' },
]);

const c5 = doc('bfd301-5-1-cong-nghe-nen-tang', '5.1 — Core technology: cloud, AI, big data & blockchain|||5.1 — Công nghệ nền tảng: cloud, AI, big data & blockchain',
  'Cloud (linh hoạt, chi phí), AI (chatbot, chấm điểm tín dụng, phát hiện gian lận), big data (khách hàng 360°), blockchain/DLT (thanh toán xuyên biên giới, trade finance).',
  [[
    `<span class="eyebrow">BFD301 · Chapter 5 · Lesson 5.1</span>
<h2>Core technology: cloud, AI, big data &amp; blockchain</h2>
<pre><code>Layered tech stack of a digital bank:
  Channels        -> mobile app, internet banking, APIs
  Intelligence    -> AI/ML: credit scoring, personalization, fraud detection, chatbots
  Data            -> big data platform: unified "360-degree" customer view
  Infrastructure  -> cloud: elastic core banking, faster releases, lower fixed cost
  Emerging        -> blockchain/DLT: cross-border payments, trade finance pilots
</code></pre>
<h3>Cloud</h3>
<p>Moving core banking and channel systems to <strong>cloud</strong> infrastructure gives banks elastic scaling (handle a payday traffic spike without buying servers year-round), faster software releases, and lower upfront capital cost — at the price of new security and vendor-risk responsibilities.</p>
<h3>AI &amp; big data</h3>
<p><strong>Big data</strong> platforms merge transaction, app-usage and demographic data into one <strong>360-degree customer view</strong>. <strong>AI/ML</strong> then runs on top of that data for: alternative <strong>credit scoring</strong> (beyond just credit bureau history), <strong>personalized</strong> offers, <strong>chatbots</strong> for routine support, and real-time <strong>fraud detection</strong> that flags anomalous transactions.</p>
<h3>Blockchain / DLT</h3>
<p><strong>Blockchain</strong> (distributed ledger technology) is mostly still in pilot/experimental use in banking — the strongest real use cases so far are <strong>cross-border payments</strong> (settling faster than traditional correspondent banking) and <strong>trade finance</strong> (shared, tamper-evident documents like letters of credit across multiple parties). It is not yet a mainstream replacement for core banking ledgers.</p>
<div class="callout"><span class="badge">Watch out</span> Technology doesn't replace regulation or judgment — an AI credit model or a blockchain settlement still needs to be explainable and compliant.</div>`,
    `<span class="eyebrow">BFD301 · Chương 5 · Bài 5.1</span>
<h2>Công nghệ nền tảng: cloud, AI, big data &amp; blockchain</h2>
<pre><code>Chồng công nghệ theo lớp của một ngân hàng số:
  Kênh            -> app di động, internet banking, API
  Trí tuệ         -> AI/ML: chấm điểm tín dụng, cá nhân hoá, phát hiện gian lận, chatbot
  Dữ liệu         -> nền tảng big data: góc nhìn khách hàng "360 độ" hợp nhất
  Hạ tầng         -> cloud: lõi ngân hàng co giãn, phát hành nhanh hơn, chi phí cố định thấp hơn
  Mới nổi         -> blockchain/DLT: thanh toán xuyên biên giới, thử nghiệm trade finance
</code></pre>
<h3>Cloud (điện toán đám mây)</h3>
<p>Chuyển hệ thống lõi và kênh giao dịch lên hạ tầng <strong>cloud</strong> giúp ngân hàng mở rộng linh hoạt (xử lý đỉnh giao dịch ngày lương mà không cần mua máy chủ quanh năm), phát hành phần mềm nhanh hơn, và chi phí đầu tư ban đầu thấp hơn — đổi lại là trách nhiệm mới về bảo mật và rủi ro nhà cung cấp.</p>
<h3>AI &amp; big data</h3>
<p>Nền tảng <strong>big data</strong> hợp nhất dữ liệu giao dịch, hành vi sử dụng app và nhân khẩu học thành một <strong>góc nhìn khách hàng 360 độ</strong>. <strong>AI/ML</strong> chạy trên dữ liệu đó để: <strong>chấm điểm tín dụng thay thế</strong> (ngoài lịch sử tín dụng truyền thống), ưu đãi <strong>cá nhân hoá</strong>, <strong>chatbot</strong> cho hỗ trợ thường ngày, và <strong>phát hiện gian lận</strong> thời gian thực khi phát hiện giao dịch bất thường.</p>
<h3>Blockchain / DLT</h3>
<p><strong>Blockchain</strong> (công nghệ sổ cái phân tán) trong ngân hàng phần lớn vẫn đang ở giai đoạn thử nghiệm — ứng dụng thực tế mạnh nhất hiện nay là <strong>thanh toán xuyên biên giới</strong> (thanh toán nhanh hơn mô hình ngân hàng đại lý truyền thống) và <strong>tài trợ thương mại (trade finance)</strong> (chia sẻ chứng từ chống giả mạo như thư tín dụng giữa nhiều bên). Chưa phải giải pháp thay thế đại trà cho sổ cái ngân hàng lõi.</p>
<div class="callout"><span class="badge">Lưu ý</span> Công nghệ không thay thế được quy định hay phán đoán con người — một mô hình tín dụng AI hay một giao dịch settle bằng blockchain vẫn phải giải thích được và tuân thủ pháp luật.</div>`,
  ]]);

const c5q = quiz('bfd301-quiz-5', 'Quiz 5 — Core technology|||Quiz 5 — Công nghệ nền tảng', [
  { id: 'q1', question: 'Vai trò chính của AI trong ngân hàng số là gì?', options: ['Thay thế hoàn toàn quy định pháp luật', 'Chấm điểm tín dụng, cá nhân hoá, chatbot và phát hiện gian lận dựa trên dữ liệu', 'Chỉ dùng để thiết kế giao diện app', 'Chỉ áp dụng cho ngân hàng nước ngoài'], correctIndex: 1, explanation: 'AI hỗ trợ chấm điểm, cá nhân hoá, chatbot, phát hiện gian lận — không thay thế quy định.' },
  { id: 'q2', question: 'Big data giúp ngân hàng điều gì?', options: ['Xoá bỏ nhu cầu bảo mật dữ liệu', 'Xây dựng góc nhìn khách hàng "360 độ" từ nhiều nguồn dữ liệu hợp nhất', 'Chỉ lưu trữ dữ liệu giấy tờ cũ', 'Thay thế hoàn toàn cần có ngân hàng lõi'], correctIndex: 1, explanation: 'Big data hợp nhất nhiều nguồn dữ liệu thành một góc nhìn khách hàng toàn diện (360°).' },
  { id: 'q3', question: 'Blockchain/DLT trong ngân hàng hiện được dùng thử nghiệm nhiều nhất ở đâu?', options: ['Thay thế toàn bộ hệ thống core banking hiện tại', 'Thanh toán xuyên biên giới và tài trợ thương mại (trade finance)', 'In tiền giấy vật lý', 'Chỉ dùng cho quảng cáo ngân hàng'], correctIndex: 1, explanation: 'Ứng dụng thực tế mạnh nhất của blockchain trong ngân hàng hiện nay: cross-border payment & trade finance, còn thử nghiệm.' },
]);

const c6 = doc('bfd301-6-1-an-ninh-ekyc', '6.1 — Security, eKYC & fraud prevention|||6.1 — An ninh, eKYC & phòng chống gian lận',
  'eKYC (định danh từ xa, liveness detection); xác thực đa yếu tố (MFA); các dạng gian lận phổ biến; giám sát giao dịch & phát hiện bất thường.',
  [[
    `<span class="eyebrow">BFD301 · Chapter 6 · Lesson 6.1</span>
<h2>Security, eKYC &amp; fraud prevention</h2>
<h3>eKYC — remote identity verification</h3>
<p><strong>eKYC (electronic Know Your Customer)</strong> lets a customer open an account or verify their identity remotely, without visiting a branch:</p>
<pre><code>eKYC flow:
  1. Capture ID document (OCR reads name/ID number/DOB from photo)
  2. Face capture + liveness detection (proves a real live person, not a photo/video/mask)
  3. Face match (selfie vs ID photo)
  4. Cross-check against watchlists / risk databases
  5. Approve -> account opened remotely, or flag for manual review
</code></pre>
<p><strong>Liveness detection</strong> specifically defends against presenting a printed photo, a screen replay, or a deepfake video instead of a real person.</p>
<h3>Authentication: OTP, biometrics, MFA</h3>
<ul>
<li><strong>OTP (one-time password)</strong> — a single-use code sent by SMS/app, proving the customer has access to a registered device.</li>
<li><strong>Biometrics</strong> — fingerprint or face unlock, proving "something you are."</li>
<li><strong>MFA (multi-factor authentication)</strong> — combines at least two of: something you <em>know</em> (password/PIN), something you <em>have</em> (device/token), something you <em>are</em> (biometrics) — much harder to defeat than any single factor alone.</li>
</ul>
<h3>Common fraud patterns &amp; defenses</h3>
<ul>
<li><strong>Phishing / social engineering</strong> — tricking a customer into revealing OTP/credentials → defense: user education + transaction confirmation with context (amount, recipient shown clearly).</li>
<li><strong>Account takeover</strong> (stolen credentials/SIM swap) → defense: device fingerprinting, step-up authentication for new devices/large transfers.</li>
<li><strong>Transaction fraud</strong> → defense: real-time rule engines and AI anomaly detection that flag unusual amount/location/frequency before the transfer settles.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> No single control is enough — eKYC, MFA and real-time monitoring work as layers; a fraud that slips past one layer should still be caught by another.</div>`,
    `<span class="eyebrow">BFD301 · Chương 6 · Bài 6.1</span>
<h2>An ninh, eKYC &amp; phòng chống gian lận</h2>
<h3>eKYC — định danh khách hàng từ xa</h3>
<p><strong>eKYC (electronic Know Your Customer)</strong> cho phép khách hàng mở tài khoản hoặc xác thực danh tính từ xa, không cần đến chi nhánh:</p>
<pre><code>Luồng eKYC:
  1. Chụp giấy tờ tuỳ thân (OCR đọc tên/số giấy tờ/ngày sinh từ ảnh)
  2. Chụp khuôn mặt + liveness detection (chứng minh có người thật đang thao tác, không phải ảnh/video/mặt nạ)
  3. Đối chiếu khuôn mặt (ảnh selfie vs ảnh giấy tờ)
  4. Đối chiếu danh sách cảnh báo / cơ sở dữ liệu rủi ro
  5. Phê duyệt -> mở tài khoản từ xa, hoặc chuyển xét duyệt thủ công nếu nghi ngờ
</code></pre>
<p><strong>Liveness detection</strong> chống lại việc dùng ảnh in, phát lại video từ màn hình, hoặc video deepfake thay cho người thật.</p>
<h3>Xác thực: OTP, sinh trắc học, MFA</h3>
<ul>
<li><strong>OTP (mật khẩu dùng một lần)</strong> — mã dùng một lần gửi qua SMS/app, chứng minh khách đang cầm thiết bị đã đăng ký.</li>
<li><strong>Sinh trắc học</strong> — mở khoá bằng vân tay hoặc khuôn mặt, chứng minh "thứ bạn LÀ".</li>
<li><strong>MFA (xác thực đa yếu tố)</strong> — kết hợp ít nhất hai trong ba yếu tố: thứ bạn <em>biết</em> (mật khẩu/PIN), thứ bạn <em>có</em> (thiết bị/token), thứ bạn <em>là</em> (sinh trắc học) — khó bị phá hơn nhiều so với chỉ một yếu tố.</li>
</ul>
<h3>Các dạng gian lận phổ biến &amp; cách phòng chống</h3>
<ul>
<li><strong>Phishing / lừa đảo qua tương tác xã hội</strong> — dụ khách tiết lộ OTP/thông tin đăng nhập → phòng chống: giáo dục người dùng + hiển thị rõ ngữ cảnh giao dịch (số tiền, người nhận) khi xác nhận.</li>
<li><strong>Chiếm đoạt tài khoản</strong> (đánh cắp thông tin đăng nhập/SIM swap) → phòng chống: nhận diện thiết bị, xác thực nâng cao (step-up) khi có thiết bị mới/giao dịch lớn.</li>
<li><strong>Gian lận giao dịch</strong> → phòng chống: bộ luật (rule engine) và AI phát hiện bất thường thời gian thực, cảnh báo số tiền/vị trí/tần suất lạ trước khi giao dịch hoàn tất.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Không một lớp kiểm soát nào đủ — eKYC, MFA và giám sát thời gian thực hoạt động như nhiều lớp phòng thủ; gian lận lọt qua một lớp vẫn có thể bị lớp khác bắt được.</div>`,
  ]]);

const c6q = quiz('bfd301-quiz-6', 'Quiz 6 — Security & eKYC|||Quiz 6 — An ninh & eKYC', [
  { id: 'q1', question: 'eKYC là gì?', options: ['Một loại thẻ tín dụng cao cấp', 'Xác thực định danh khách hàng từ xa (giấy tờ + khuôn mặt) mà không cần đến quầy', 'Một phần mềm kế toán nội bộ ngân hàng', 'Chỉ dùng để đổi mật khẩu'], correctIndex: 1, explanation: 'eKYC: định danh điện tử từ xa, thay cho việc đến chi nhánh xuất trình giấy tờ.' },
  { id: 'q2', question: '"Liveness detection" trong eKYC dùng để làm gì?', options: ['Tăng tốc độ tải app', 'Chống giả mạo bằng ảnh/video tĩnh, xác nhận có người thật đang thao tác trực tiếp', 'Nén dung lượng ảnh giấy tờ', 'Tính điểm tín dụng khách hàng'], correctIndex: 1, explanation: 'Liveness detection chống dùng ảnh in/video phát lại/deepfake thay cho người thật.' },
  { id: 'q3', question: 'MFA (xác thực đa yếu tố) kết hợp những gì?', options: ['Chỉ dùng một mật khẩu duy nhất', 'Ít nhất hai trong ba yếu tố: thứ biết (mật khẩu/OTP), thứ có (thiết bị/token), thứ là (sinh trắc học)', 'Chỉ dựa vào địa chỉ IP', 'Chỉ áp dụng cho giao dịch dưới 1 triệu đồng'], correctIndex: 1, explanation: 'MFA kết hợp nhiều loại yếu tố xác thực khác nhau để khó bị phá hơn.' },
]);

const c7 = doc('bfd301-7-1-neobank-sieu-ung-dung', '7.1 — Neobanks, super-apps & new business models|||7.1 — Neobank, siêu ứng dụng & mô hình kinh doanh mới',
  'Neobank (ngân hàng thuần số); siêu ứng dụng (super-app) gộp nhiều dịch vụ; mô hình doanh thu: subscription, phí giao dịch, marketplace, data.',
  [[
    `<span class="eyebrow">BFD301 · Chapter 7 · Lesson 7.1</span>
<h2>Neobanks, super-apps &amp; new business models</h2>
<h3>Neobanks</h3>
<p>A <strong>neobank</strong> is a digital-only bank with no physical branch network — the entire relationship lives in an app. Some neobanks hold their own banking license; many operate on top of a licensed partner bank's infrastructure (a BaaS relationship). Examples internationally include Revolut and N26; in Vietnam, digital-only propositions like Cake, Timo and Ubank follow this model, often built on a licensed bank partner.</p>
<h3>Super-apps</h3>
<p>A <strong>super-app</strong> bundles many unrelated services — payments, ride-hailing, food delivery, e-commerce, lending — inside one app, so the provider becomes the customer's daily habit, not just their bank. Financial services (wallet, micro-loans, insurance) are often embedded as just one tile among many.</p>
<pre><code>Traditional bank         Neobank                  Super-app
  branch + app     vs      app only         vs      one app, many services
  full-service            low-cost, fast          finance is ONE feature among many
  cost: branches heavy    cost: lean, digital-only  cost: subsidized by cross-selling
</code></pre>
<h3>New revenue models</h3>
<ul>
<li><strong>Subscription</strong> — a monthly fee for a premium tier (higher limits, perks).</li>
<li><strong>Transaction fees</strong> — a small cut on payments, FX, card interchange.</li>
<li><strong>Marketplace</strong> — commission for distributing third-party products (insurance, loans) inside the app.</li>
<li><strong>Data monetization</strong> — (with consent/anonymization) using behavioral data to improve underwriting or offer targeted, opt-in products.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Neobanks compete on being digital-only and low-cost; super-apps compete on being the customer's everyday habit, with finance as just one embedded feature.</div>`,
    `<span class="eyebrow">BFD301 · Chương 7 · Bài 7.1</span>
<h2>Neobank, siêu ứng dụng &amp; mô hình kinh doanh mới</h2>
<h3>Neobank</h3>
<p><strong>Neobank</strong> là ngân hàng thuần số, không có mạng lưới chi nhánh vật lý — toàn bộ mối quan hệ khách hàng nằm trong một app. Một số neobank tự có giấy phép ngân hàng; nhiều neobank vận hành trên hạ tầng của một ngân hàng đối tác có giấy phép (quan hệ kiểu BaaS). Ví dụ quốc tế: Revolut, N26; tại Việt Nam, các đề xuất thuần số như Cake, Timo, Ubank theo mô hình này, thường xây trên nền một ngân hàng đối tác có giấy phép.</p>
<h3>Siêu ứng dụng (super-app)</h3>
<p><strong>Siêu ứng dụng</strong> gộp nhiều dịch vụ không liên quan — thanh toán, gọi xe, giao đồ ăn, thương mại điện tử, cho vay — vào một app duy nhất, để nhà cung cấp trở thành thói quen hằng ngày của khách, không chỉ là ngân hàng của họ. Dịch vụ tài chính (ví, vay nhỏ, bảo hiểm) thường chỉ là một tính năng trong rất nhiều tính năng.</p>
<pre><code>Ngân hàng truyền thống      Neobank                    Siêu ứng dụng
  chi nhánh + app     vs      chỉ có app          vs      một app, nhiều dịch vụ
  đầy đủ dịch vụ              chi phí thấp, nhanh          tài chính chỉ là MỘT tính năng
  chi phí: chi nhánh nặng     chi phí: gọn, thuần số        chi phí: được trợ giá bằng bán chéo
</code></pre>
<h3>Mô hình doanh thu mới</h3>
<ul>
<li><strong>Subscription (thuê bao)</strong> — phí hằng tháng cho gói cao cấp (hạn mức cao hơn, ưu đãi).</li>
<li><strong>Phí giao dịch</strong> — cắt phần trăm nhỏ trên thanh toán, ngoại hối, phí chiết khấu thẻ.</li>
<li><strong>Marketplace</strong> — hoa hồng phân phối sản phẩm bên thứ ba (bảo hiểm, khoản vay) trong app.</li>
<li><strong>Kiếm tiền từ dữ liệu</strong> — (có sự đồng ý/ẩn danh) dùng dữ liệu hành vi để cải thiện thẩm định tín dụng hoặc đề xuất sản phẩm phù hợp, có opt-in.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Neobank cạnh tranh bằng việc thuần số và chi phí thấp; siêu ứng dụng cạnh tranh bằng việc trở thành thói quen hằng ngày của khách, với tài chính chỉ là một tính năng nhúng.</div>`,
  ]]);

const c7q = quiz('bfd301-quiz-7', 'Quiz 7 — Neobank & super-app|||Quiz 7 — Neobank & siêu ứng dụng', [
  { id: 'q1', question: 'Neobank khác ngân hàng truyền thống ở điểm nào?', options: ['Có nhiều chi nhánh hơn ngân hàng truyền thống', 'Không có mạng lưới chi nhánh vật lý, vận hành hoàn toàn trên nền tảng số', 'Chỉ phục vụ doanh nghiệp lớn', 'Không được phép cung cấp dịch vụ thanh toán'], correctIndex: 1, explanation: 'Neobank là ngân hàng thuần số, không có chi nhánh vật lý, có thể dựa trên hạ tầng ngân hàng đối tác (BaaS).' },
  { id: 'q2', question: 'Siêu ứng dụng (super-app) là gì?', options: ['Một app chỉ làm đúng một chức năng chuyển tiền', 'Một app gộp nhiều dịch vụ (thanh toán, gọi xe, giao đồ ăn, tài chính…) vào một nền tảng duy nhất', 'Tên gọi khác của internet banking', 'Một loại thẻ ngân hàng vật lý cao cấp'], correctIndex: 1, explanation: 'Super-app bundle nhiều dịch vụ không liên quan vào một app để trở thành thói quen hằng ngày của người dùng.' },
  { id: 'q3', question: 'Mô hình kinh doanh nào KHÔNG phù hợp với neobank (do không có chi nhánh vật lý)?', options: ['Thu phí thuê bao (subscription) gói cao cấp', 'Thu phí duy trì mạng lưới chi nhánh vật lý', 'Thu phí giao dịch/ngoại hối', 'Hoa hồng marketplace phân phối sản phẩm bên thứ ba'], correctIndex: 1, explanation: 'Neobank không có chi nhánh nên không có khoản "phí duy trì chi nhánh" — đây là chi phí đặc trưng của ngân hàng truyền thống.' },
]);

const c8 = doc('bfd301-8-1-phap-ly-rui-ro', '8.1 — Regulation, risk & the future of digital banking in Vietnam|||8.1 — Quy định pháp lý, rủi ro & tương lai ngân hàng số Việt Nam',
  'Vai trò NHNN (SBV); quy định eKYC & trung gian thanh toán; cơ chế sandbox; rủi ro an ninh mạng & rủi ro liên kết fintech; xu hướng tương lai.',
  [[
    `<span class="eyebrow">BFD301 · Chapter 8 · Lesson 8.1</span>
<h2>Regulation, risk &amp; the future of digital banking in Vietnam</h2>
<h3>Who regulates digital banking in Vietnam</h3>
<p>The <strong>State Bank of Vietnam (SBV / NHNN)</strong> licenses and supervises banks and payment intermediaries, sets prudential rules, and has progressively issued rules that enable digital banking — including circulars that allow <strong>eKYC-based remote account opening</strong> and rules governing <strong>e-wallets / payment intermediaries</strong>.</p>
<h3>Regulatory sandbox</h3>
<pre><code>Regulatory sandbox (co che thu nghiem co kiem soat):
  New fintech product -> tested with LIMITED customers/scale/time
                       -> under regulator supervision (SBV)
                       -> outcome: approved for wider rollout, adjusted, or stopped
  Purpose: let innovation be tested safely BEFORE full-scale rules are finalized.
</code></pre>
<h3>Digital banking's distinctive risks</h3>
<ul>
<li><strong>Cybersecurity risk</strong> — a bigger digital attack surface (apps, APIs, cloud) than a branch-only bank.</li>
<li><strong>Interconnection risk</strong> — banks, wallets and fintechs are now wired together (Open Banking, BaaS, NAPAS); a failure or breach at one node can ripple through partners.</li>
<li><strong>Financial exclusion risk</strong> — customers without a smartphone, stable internet, or digital literacy can be left behind if "digital-first" becomes "digital-only" too fast.</li>
<li><strong>Operational/third-party risk</strong> — outsourcing to cloud/fintech partners means the bank still owns the regulatory responsibility for what its partners do.</li>
</ul>
<h3>Where digital banking in Vietnam is heading</h3>
<p>Expect continued growth in QR/real-time payments and embedded finance, gradual build-out of Open Banking data-sharing standards, more sandbox-tested fintech partnerships, exploration of central bank digital currency (CBDC) concepts globally, and heavier use of generative AI for customer service and risk — all moving in step with, not ahead of, SBV's regulatory framework.</p>
<div class="callout"><span class="badge">Key idea</span> In banking, technology moves fast but regulation sets the speed limit on purpose — sandboxes exist precisely to let the two meet safely.</div>`,
    `<span class="eyebrow">BFD301 · Chương 8 · Bài 8.1</span>
<h2>Quy định pháp lý, rủi ro &amp; tương lai ngân hàng số Việt Nam</h2>
<h3>Ai quản lý ngân hàng số tại Việt Nam</h3>
<p><strong>Ngân hàng Nhà nước Việt Nam (NHNN/SBV)</strong> cấp phép và giám sát ngân hàng cùng các tổ chức trung gian thanh toán, đặt ra quy định an toàn vốn, và đã dần ban hành các quy định tạo điều kiện cho ngân hàng số — bao gồm thông tư cho phép <strong>mở tài khoản từ xa bằng eKYC</strong> và quy định về <strong>ví điện tử/trung gian thanh toán</strong>.</p>
<h3>Cơ chế thử nghiệm có kiểm soát (sandbox)</h3>
<pre><code>Sandbox (co che thu nghiem co kiem soat):
  San pham fintech moi -> thu nghiem voi PHAM VI GIOI HAN (khach hang/quy mo/thoi gian)
                        -> duoi su giam sat cua co quan quan ly (NHNN)
                        -> ket qua: duoc trien khai dai tra, dieu chinh, hoac dung lai
  Muc dich: cho phep thu nghiem doi moi an toan TRUOC KHI hoan thien quy dinh dai tra.
</code></pre>
<h3>Những rủi ro đặc trưng của ngân hàng số</h3>
<ul>
<li><strong>Rủi ro an ninh mạng</strong> — bề mặt tấn công số lớn hơn (app, API, cloud) so với ngân hàng chỉ có chi nhánh.</li>
<li><strong>Rủi ro liên kết (interconnection)</strong> — ngân hàng, ví và fintech nay kết nối chặt với nhau (Open Banking, BaaS, NAPAS); sự cố/xâm nhập ở một điểm có thể lan sang các đối tác.</li>
<li><strong>Rủi ro loại trừ tài chính</strong> — khách hàng không có smartphone, internet ổn định, hoặc kỹ năng số có thể bị bỏ lại phía sau nếu "ưu tiên số" trở thành "chỉ có số" quá nhanh.</li>
<li><strong>Rủi ro vận hành/bên thứ ba</strong> — thuê ngoài cho cloud/fintech đối tác không có nghĩa ngân hàng hết trách nhiệm pháp lý về những gì đối tác làm.</li>
</ul>
<h3>Ngân hàng số Việt Nam đang đi về đâu</h3>
<p>Có thể kỳ vọng thanh toán QR/thời gian thực và tài chính nhúng tiếp tục tăng trưởng, chuẩn chia sẻ dữ liệu Open Banking được xây dựng dần, nhiều hợp tác fintech được thử nghiệm qua sandbox hơn, các khái niệm tiền kỹ thuật số ngân hàng trung ương (CBDC) được nghiên cứu trên toàn cầu, và AI tạo sinh được dùng nhiều hơn cho chăm sóc khách hàng và quản trị rủi ro — tất cả song hành, không đi trước, khung pháp lý của NHNN.</p>
<div class="callout"><span class="badge">Ý chính</span> Trong ngân hàng, công nghệ đi nhanh nhưng quy định đặt giới hạn tốc độ có chủ đích — sandbox tồn tại chính là để hai bên gặp nhau một cách an toàn.</div>`,
  ]]);

const c8q = quiz('bfd301-quiz-8', 'Quiz 8 — Regulation & risk|||Quiz 8 — Pháp lý & rủi ro', [
  { id: 'q1', question: 'Cơ quan quản lý ngành ngân hàng tại Việt Nam là?', options: ['Bộ Tài chính', 'Ngân hàng Nhà nước Việt Nam (NHNN/SBV)', 'Uỷ ban Chứng khoán Nhà nước', 'NAPAS'], correctIndex: 1, explanation: 'NHNN (SBV) là cơ quan cấp phép và giám sát ngân hàng cùng trung gian thanh toán tại Việt Nam.' },
  { id: 'q2', question: 'Cơ chế "sandbox" trong fintech nghĩa là gì?', options: ['Cấm hoàn toàn sản phẩm fintech mới', 'Cho thử nghiệm sản phẩm mới trong phạm vi giới hạn, dưới giám sát của cơ quan quản lý, trước khi triển khai đại trà', 'Chỉ áp dụng cho ngân hàng nước ngoài', 'Là tên một loại thẻ ngân hàng'], correctIndex: 1, explanation: 'Sandbox: thử nghiệm có kiểm soát về quy mô/thời gian/khách hàng dưới giám sát của NHNN.' },
  { id: 'q3', question: 'Rủi ro nào đặc trưng hơn ở ngân hàng số so với ngân hàng truyền thống thuần chi nhánh?', options: ['Rủi ro tồn kho tiền mặt tại quầy', 'Rủi ro an ninh mạng và rủi ro lan truyền do liên kết chặt với fintech/đối tác', 'Rủi ro in ấn sổ tiết kiệm giấy', 'Rủi ro không có chỗ đậu xe cho khách'], correctIndex: 1, explanation: 'Ngân hàng số có bề mặt tấn công số lớn hơn và liên kết chặt với hệ sinh thái fintech, làm tăng rủi ro an ninh mạng và rủi ro lan truyền.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'BFD301',
    slug: 'bfd301-digital-banking',
    title: 'Digital Banking',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BFD301.webp',
    shortDescription: 'Digital banking end to end: transformation, digital channels & CX, payments (e-wallet, QR, real-time), fintech (Open Banking, BaaS), cloud/AI/blockchain, eKYC & fraud prevention, neobanks/super-apps, regulation & risk in Vietnam.|||Ngân hàng số toàn diện: chuyển đổi số, kênh số & CX, thanh toán số (ví, QR, thời gian thực), fintech (Open Banking, BaaS), cloud/AI/blockchain, eKYC & chống gian lận, neobank/siêu ứng dụng, pháp lý & rủi ro tại Việt Nam.',
    description: 'Môn <strong>BFD301 — Digital Banking</strong> (kỳ 5) giúp hiểu <strong>ngân hàng chuyển đổi số như thế nào</strong>. Từ <strong>tổng quan &amp; các giai đoạn chuyển đổi số</strong> → <strong>kênh số &amp; trải nghiệm khách hàng</strong> (mobile/internet banking, omnichannel) → <strong>thanh toán số</strong> (ví điện tử, QR/VietQR, thời gian thực) → <strong>fintech &amp; mô hình hợp tác</strong> (Open Banking, API, BaaS) → <strong>công nghệ nền</strong> (cloud, AI, big data, blockchain) → <strong>an ninh &amp; eKYC</strong> → <strong>neobank, siêu ứng dụng &amp; mô hình kinh doanh mới</strong> → <strong>quy định pháp lý (NHNN, sandbox), rủi ro &amp; tương lai ngân hàng số Việt Nam</strong>. Bám tinh thần "The FINTECH Book", "Digital Bank/Digital Human" (Skinner), "Bank 4.0" (King) và báo cáo McKinsey/Deloitte; song ngữ, có sơ đồ và quiz mỗi chương.',
    whatYouLearn: 'Digital vs digitized banking, 3 giai đoạn chuyển đổi số, Bank 1.0→4.0; mobile/internet banking, omnichannel vs multichannel; ví điện tử, QR/VietQR, NAPAS, thanh toán thời gian thực; Open Banking, API, Banking-as-a-Service, mô hình build/buy/partner; cloud, AI/ML (chấm điểm tín dụng, phát hiện gian lận), big data, blockchain/DLT; eKYC, liveness detection, MFA, phòng chống gian lận; neobank, siêu ứng dụng, mô hình doanh thu mới; vai trò NHNN, cơ chế sandbox, rủi ro an ninh mạng & liên kết hệ thống.',
    requirements: 'Kiến thức tổng quan về ngân hàng/tài chính là một lợi thế nhưng không bắt buộc. Nên tìm hiểu thêm giáo trình chính thức trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách nền tảng (FINTECH Book, Bank 4.0, Digital Bank/Human), báo cáo McKinsey/Deloitte, cổng NHNN/NAPAS, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Ngân hàng số là gì, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & chuyển đổi số|||Chapter 1 — Overview & transformation', description: 'Digital vs digitized, 3 giai đoạn, Bank 1.0→4.0.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Kênh số & trải nghiệm khách hàng|||Chapter 2 — Digital channels & CX', description: 'Mobile/internet banking, omnichannel.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thanh toán số|||Chapter 3 — Digital payments', description: 'Ví điện tử, QR/VietQR, NAPAS, thời gian thực.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Fintech & hợp tác (Open Banking/BaaS)|||Chapter 4 — Fintech & partnerships', description: 'Open Banking, API, BaaS, build/buy/partner.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Công nghệ nền tảng|||Chapter 5 — Core technology', description: 'Cloud, AI/ML, big data, blockchain.', lessons: [c5, c5q] },
    { title: 'Chương 6 — An ninh & eKYC|||Chapter 6 — Security & eKYC', description: 'eKYC, liveness, MFA, gian lận.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Neobank & siêu ứng dụng|||Chapter 7 — Neobanks & super-apps', description: 'Neobank, super-app, mô hình doanh thu.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Pháp lý, rủi ro & tương lai|||Chapter 8 — Regulation, risk & the future', description: 'NHNN, sandbox, rủi ro, xu hướng.', lessons: [c8, c8q] },
  ],
};
