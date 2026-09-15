/**
 * IIP301 — International Payment (Thanh toán quốc tế).
 * Giáo trình FLM (khối Quản trị Kinh doanh, kỳ 4): UCP 600, URC 522, ISBP
 * (ICC); "International Trade Finance" (Grath); thực tiễn ngân hàng thương
 * mại. Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('iip301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: quy tắc ICC (UCP 600, URC 522, ISBP 745), sách tham khảo, tài liệu chính thức miễn phí, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">IIP301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn International Payment — remittance, collection, documentary credit and document examination — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources for the ICC rulebooks this course is built on.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for IIP301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books &amp; rulebooks</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Uniform_Customs_and_Practice_for_Documentary_Credits" target="_blank" rel="noopener">UCP 600 — Uniform Customs and Practice for Documentary Credits (ICC)</a> — overview &amp; history</li>
<li><a href="https://en.wikipedia.org/wiki/Uniform_Rules_for_Collections" target="_blank" rel="noopener">URC 522 — Uniform Rules for Collections (ICC)</a> — overview</li>
<li><a href="https://en.wikipedia.org/wiki/International_Standard_Banking_Practice" target="_blank" rel="noopener">ISBP 745 — International Standard Banking Practice (ICC)</a> — overview</li>
<li><em>International Trade Finance</em> — Anders Grath (core textbook)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://iccwbo.org/" target="_blank" rel="noopener">ICC — International Chamber of Commerce</a> — publisher of UCP 600 / URC 522 / ISBP</li>
<li><a href="https://www.trade.gov/trade-finance-guide" target="_blank" rel="noopener">Trade Finance Guide — U.S. International Trade Administration</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=letter+of+credit+explained" target="_blank" rel="noopener">"Letter of credit explained"</a> — search results, multiple bank/edu channels</li>
<li><a href="https://www.youtube.com/results?search_query=documentary+collection+D%2FP+D%2FA" target="_blank" rel="noopener">"Documentary collection D/P D/A"</a> — search results</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.investopedia.com/terms/l/letterofcredit.asp" target="_blank" rel="noopener">Investopedia — Letter of Credit</a> — quick reference &amp; glossary</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — parties in international payment, correspondent banking, bills of exchange.</li>
<li><strong>Payment methods</strong> — remittance (T/T) → collection (D/P/D/A) → documentary credit (L/C).</li>
<li><strong>Go deeper</strong> — special L/C types, document examination under ISBP.</li>
<li><strong>Job-ready</strong> — read real L/C texts, identify discrepancies, know Vietnam FX/banking practice.</li>
</ol></div>`,
    `<span class="eyebrow">IIP301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Thanh toán quốc tế — chuyển tiền, nhờ thu, tín dụng chứng từ và kiểm tra chứng từ — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp cho các quy tắc ICC mà môn này dựa vào.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IIP301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách &amp; quy tắc tham khảo</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Uniform_Customs_and_Practice_for_Documentary_Credits" target="_blank" rel="noopener">UCP 600 — Quy tắc thống nhất về tín dụng chứng từ (ICC)</a> — tổng quan &amp; lịch sử</li>
<li><a href="https://en.wikipedia.org/wiki/Uniform_Rules_for_Collections" target="_blank" rel="noopener">URC 522 — Quy tắc thống nhất về nhờ thu (ICC)</a> — tổng quan</li>
<li><a href="https://en.wikipedia.org/wiki/International_Standard_Banking_Practice" target="_blank" rel="noopener">ISBP 745 — Tập quán ngân hàng tiêu chuẩn quốc tế (ICC)</a> — tổng quan</li>
<li><em>International Trade Finance</em> — Anders Grath (giáo trình gốc)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://iccwbo.org/" target="_blank" rel="noopener">ICC — Phòng Thương mại Quốc tế</a> — đơn vị phát hành UCP 600 / URC 522 / ISBP</li>
<li><a href="https://www.trade.gov/trade-finance-guide" target="_blank" rel="noopener">Trade Finance Guide — Bộ Thương mại Hoa Kỳ</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=letter+of+credit+explained" target="_blank" rel="noopener">"Letter of credit explained"</a> — kết quả tìm kiếm, nhiều kênh ngân hàng/giáo dục</li>
<li><a href="https://www.youtube.com/results?search_query=documentary+collection+D%2FP+D%2FA" target="_blank" rel="noopener">"Documentary collection D/P D/A"</a> — kết quả tìm kiếm</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.investopedia.com/terms/l/letterofcredit.asp" target="_blank" rel="noopener">Investopedia — Letter of Credit</a> — tra cứu nhanh &amp; thuật ngữ</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — các bên trong thanh toán quốc tế, ngân hàng đại lý, hối phiếu.</li>
<li><strong>Phương thức thanh toán</strong> — chuyển tiền (T/T) → nhờ thu (D/P/D/A) → tín dụng chứng từ (L/C).</li>
<li><strong>Đào sâu</strong> — các loại L/C đặc biệt, kiểm tra chứng từ theo ISBP.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc L/C thật, phát hiện sai biệt (discrepancy), nắm thực tiễn FX/ngân hàng Việt Nam.</li>
</ol></div>`,
  ]]);

const intro = doc('iip301-0-1-overview', 'Course overview: International Payment|||Tổng quan: Thanh toán quốc tế',
  'Thanh toán quốc tế là gì, vì sao cần ngân hàng trung gian; lộ trình: tổng quan → phương tiện thanh toán → chuyển tiền → nhờ thu → L/C & UCP 600 → L/C đặc biệt → bộ chứng từ & ISBP → rủi ro & thực tiễn Việt Nam.',
  [[
    `<span class="eyebrow">IIP301 · Lesson 0.1 · Overview</span>
<h2>International Payment</h2>
<p class="lead">This course explains <strong>how buyers and sellers in different countries actually get paid</strong> when they cannot simply hand over cash — different currencies, different legal systems, and the two sides rarely trust each other on the first deal. You'll study the payment instruments and methods banks use to bridge that gap, the ICC rulebooks (<strong>UCP 600</strong>, <strong>URC 522</strong>, <strong>ISBP</strong>) that make those methods work the same way worldwide, and how this plays out in Vietnamese banking practice.</p>
<h3>Why a bank sits in the middle</h3>
<ul>
<li><strong>Distance &amp; trust</strong> — an exporter in Vietnam and an importer in Germany cannot verify each other in person; banks act as trusted intermediaries who pass money and documents through the correspondent banking network.</li>
<li><strong>Currency conversion</strong> — payments cross currencies, so exchange-rate risk and conversion sit inside every method.</li>
<li><strong>Risk allocation</strong> — every payment method shifts risk differently between buyer and seller; picking one is really picking who bears the risk of non-payment or non-delivery.</li>
</ul>
<h3>Roadmap</h3>
<p>Overview &amp; the banks' role → payment instruments (bill of exchange, cheque, promissory note) → remittance (T/T) → collection (D/P/D/A, URC 522) → documentary credit (L/C, UCP 600) → special L/C types → document set &amp; examination (ISBP) → risks &amp; Vietnam practice. Bilingual, with process diagrams and worked examples.</p>`,
    `<span class="eyebrow">IIP301 · Bài 0.1 · Tổng quan</span>
<h2>Thanh toán quốc tế</h2>
<p class="lead">Môn này giải thích <strong>người mua và người bán ở hai nước khác nhau thực sự được thanh toán như thế nào</strong> khi không thể đơn giản đưa tiền mặt qua tay — khác đồng tiền, khác hệ thống pháp luật, và hai bên hiếm khi tin nhau ngay từ giao dịch đầu. Bạn sẽ học các phương tiện và phương thức thanh toán mà ngân hàng dùng để bắc cầu qua khoảng cách đó, các quy tắc ICC (<strong>UCP 600</strong>, <strong>URC 522</strong>, <strong>ISBP</strong>) giúp các phương thức đó vận hành giống nhau trên toàn cầu, và cách điều này diễn ra trong thực tiễn ngân hàng Việt Nam.</p>
<h3>Vì sao ngân hàng đứng giữa</h3>
<ul>
<li><strong>Khoảng cách &amp; niềm tin</strong> — nhà xuất khẩu ở Việt Nam và nhà nhập khẩu ở Đức không thể xác minh nhau trực tiếp; ngân hàng đóng vai trung gian đáng tin, chuyển tiền và chứng từ qua mạng lưới ngân hàng đại lý.</li>
<li><strong>Chuyển đổi tiền tệ</strong> — thanh toán vượt qua các đồng tiền khác nhau, nên rủi ro tỷ giá và quy đổi nằm trong mọi phương thức.</li>
<li><strong>Phân bổ rủi ro</strong> — mỗi phương thức thanh toán chia rủi ro khác nhau giữa người mua và người bán; chọn phương thức thực chất là chọn ai chịu rủi ro không được thanh toán hoặc không nhận hàng.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; vai trò ngân hàng → phương tiện thanh toán (hối phiếu, séc, kỳ phiếu) → chuyển tiền (T/T) → nhờ thu (D/P/D/A, URC 522) → tín dụng chứng từ (L/C, UCP 600) → các loại L/C đặc biệt → bộ chứng từ &amp; kiểm tra chứng từ (ISBP) → rủi ro &amp; thực tiễn Việt Nam. Song ngữ, có sơ đồ quy trình và ví dụ mẫu.</p>`,
  ]]);

const c1 = doc('iip301-1-1-overview-banks', '1.1 — Overview of international payment & the role of banks|||1.1 — Tổng quan thanh toán quốc tế & vai trò ngân hàng',
  'Đặc điểm thanh toán quốc tế (khác nước, khác tiền, khác luật); các bên tham gia; ngân hàng đại lý, tài khoản Nostro/Vostro, hệ thống SWIFT.',
  [[
    `<span class="eyebrow">IIP301 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of international payment &amp; the role of banks</h2>
<h3>What makes it "international"</h3>
<ul>
<li><strong>Different countries</strong> — different legal systems, customs regulations, and enforcement; a contract dispute cannot simply go to "the local court" for both sides.</li>
<li><strong>Different currencies</strong> — payment usually involves converting one currency to another, carrying exchange-rate risk.</li>
<li><strong>Distance &amp; limited trust</strong> — buyer and seller often deal with each other for the first time, cannot inspect goods or creditworthiness directly, and rely on intermediaries.</li>
</ul>
<h3>The parties</h3>
<ul>
<li><strong>Importer (buyer/applicant)</strong> and <strong>exporter (seller/beneficiary)</strong> — the two trading parties.</li>
<li><strong>Issuing/remitting bank</strong> — the buyer's bank, which sends payment instructions or opens a credit on the buyer's behalf.</li>
<li><strong>Advising/collecting/paying bank</strong> — the seller's bank, which receives instructions or documents and pays or collects on the seller's side.</li>
<li><strong>Correspondent bank</strong> — a bank in another country that a local bank uses to settle payments there, when it has no branch of its own.</li>
</ul>
<h3>How money actually moves: correspondent banking</h3>
<p>Banks keep accounts with each other across borders: a <strong>Nostro account</strong> ("our account with you", held abroad in a foreign currency) and, from the other bank's view, the same account is its <strong>Vostro account</strong> ("your account with us"). Payment instructions travel over the <strong>SWIFT</strong> network (secure standardized messages, e.g. MT103 for a customer transfer); the actual money moves as bookkeeping entries between correspondent accounts, not physical cash crossing borders.</p>
<pre><code>Exporter (VN)  &lt;--goods/services-- Importer (DE)
     |                                    |
  Bank A (VN)  &lt;== SWIFT message ==&gt;  Bank B (DE)
     |                                    |
  settle via correspondent / Nostro-Vostro accounts
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Every payment method in this course — remittance, collection, documentary credit — is just a different set of rules for WHEN and HOW banks move money and pass documents through this same correspondent network.</div>`,
    `<span class="eyebrow">IIP301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan thanh toán quốc tế &amp; vai trò ngân hàng</h2>
<h3>Điều gì làm nó "quốc tế"</h3>
<ul>
<li><strong>Khác quốc gia</strong> — khác hệ thống pháp luật, quy định hải quan, và cơ chế thực thi; tranh chấp hợp đồng không thể đơn giản đưa ra "tòa án địa phương" cho cả hai bên.</li>
<li><strong>Khác đồng tiền</strong> — thanh toán thường phải quy đổi từ một đồng tiền sang đồng khác, kèm rủi ro tỷ giá.</li>
<li><strong>Khoảng cách &amp; niềm tin hạn chế</strong> — người mua và người bán thường giao dịch với nhau lần đầu, không thể kiểm tra hàng hóa hay khả năng tín dụng trực tiếp, và phải dựa vào trung gian.</li>
</ul>
<h3>Các bên tham gia</h3>
<ul>
<li><strong>Nhà nhập khẩu (người mua/người yêu cầu)</strong> và <strong>nhà xuất khẩu (người bán/người thụ hưởng)</strong> — hai bên giao dịch thương mại.</li>
<li><strong>Ngân hàng phát hành/chuyển tiền</strong> — ngân hàng của người mua, gửi lệnh thanh toán hoặc mở tín dụng thay người mua.</li>
<li><strong>Ngân hàng thông báo/nhờ thu/thanh toán</strong> — ngân hàng của người bán, nhận lệnh hoặc chứng từ và thanh toán hay thu tiền cho bên người bán.</li>
<li><strong>Ngân hàng đại lý</strong> — ngân hàng ở nước khác mà một ngân hàng nội địa dùng để quyết toán ở đó, khi không có chi nhánh riêng.</li>
</ul>
<h3>Tiền thực sự di chuyển thế nào: ngân hàng đại lý</h3>
<p>Các ngân hàng giữ tài khoản với nhau qua biên giới: <strong>tài khoản Nostro</strong> ("tài khoản của chúng tôi ở bạn", mở ở nước ngoài bằng ngoại tệ) và, từ góc nhìn ngân hàng kia, chính tài khoản đó là <strong>tài khoản Vostro</strong> của họ ("tài khoản của bạn ở chúng tôi"). Lệnh thanh toán truyền qua mạng <strong>SWIFT</strong> (điện chuẩn hóa, bảo mật, vd MT103 cho chuyển tiền khách hàng); tiền thực chuyển dưới dạng bút toán ghi sổ giữa các tài khoản đại lý, không phải tiền mặt vật lý vượt biên.</p>
<pre><code>Nhà XK (VN)  &lt;--hàng/dịch vụ-- Nhà NK (DE)
     |                                |
  NH A (VN)  &lt;== điện SWIFT ==&gt;  NH B (DE)
     |                                |
  quyết toán qua tài khoản đại lý Nostro-Vostro
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Mọi phương thức thanh toán trong môn này — chuyển tiền, nhờ thu, tín dụng chứng từ — chỉ là một bộ quy tắc khác nhau về KHI NÀO và CÁCH NÀO ngân hàng chuyển tiền và trao chứng từ qua chính mạng lưới đại lý này.</div>`,
  ]]);

const c1q = quiz('iip301-quiz-1', 'Quiz 1 — Overview & banks|||Quiz 1 — Tổng quan & vai trò ngân hàng', [
  { id: 'q1', question: 'Vì sao thanh toán quốc tế cần ngân hàng làm trung gian?', options: ['Vì luật cấm chuyển tiền trực tiếp', 'Vì khoảng cách, khác tiền tệ, khác luật và thiếu niềm tin trực tiếp giữa hai bên', 'Vì hàng hóa quốc tế luôn đắt hơn', 'Vì ngân hàng bắt buộc theo hợp đồng ngoại thương'], correctIndex: 1, explanation: 'Khác quốc gia/tiền tệ/luật và thiếu niềm tin trực tiếp khiến hai bên cần ngân hàng làm cầu nối đáng tin.' },
  { id: 'q2', question: 'Tài khoản Nostro là gì?', options: ['Tài khoản khách hàng cá nhân', 'Tài khoản "của chúng tôi" mở tại ngân hàng nước ngoài, bằng ngoại tệ', 'Tài khoản dự phòng rủi ro tín dụng', 'Tài khoản chỉ dùng cho L/C'], correctIndex: 1, explanation: 'Nostro = "tài khoản của chúng tôi ở bạn"; cùng tài khoản đó là Vostro theo góc nhìn ngân hàng đối tác.' },
  { id: 'q3', question: 'SWIFT dùng để làm gì trong thanh toán quốc tế?', options: ['Vận chuyển hàng hóa vật lý', 'Truyền điện thanh toán/chỉ dẫn chuẩn hóa, bảo mật giữa các ngân hàng', 'Bảo hiểm hàng hải', 'Cấp phép xuất nhập khẩu'], correctIndex: 1, explanation: 'SWIFT là mạng điện chuẩn hóa (vd MT103) để ngân hàng gửi lệnh/thông tin thanh toán qua biên giới.' },
]);

const c2 = doc('iip301-2-1-payment-instruments', '2.1 — Payment instruments: bill of exchange, cheque, promissory note|||2.1 — Phương tiện thanh toán: hối phiếu, séc, kỳ phiếu',
  'Hối phiếu (drawer/drawee/payee, hối phiếu trả ngay/trả sau, ký nhận-acceptance); séc; kỳ phiếu (promissory note).',
  [[
    `<span class="eyebrow">IIP301 · Chapter 2 · Lesson 2.1</span>
<h2>Payment instruments</h2>
<h3>Bill of exchange (draft)</h3>
<p>A <strong>bill of exchange</strong> is a written, unconditional order by one party (the <strong>drawer</strong>, usually the exporter) instructing another party (the <strong>drawee</strong>, usually the importer or its bank) to pay a fixed sum, on demand or at a fixed future date, to a named person or bearer (the <strong>payee</strong>).</p>
<ul>
<li><strong>Sight draft</strong> — payable on presentation/demand ("at sight").</li>
<li><strong>Time/usance draft</strong> — payable at a fixed future date (e.g. "90 days after sight" or "90 days after B/L date").</li>
<li><strong>Acceptance</strong> — for a time draft, the drawee signs "accepted" across its face, creating a firm, legally binding promise to pay at maturity; an accepted draft can then be discounted (sold before maturity for cash, at a discount).</li>
</ul>
<h3>Cheque (séc)</h3>
<p>A <strong>cheque</strong> is a written order by an account holder (drawer) instructing their bank (drawee) to pay a stated sum to a payee on demand. In trade finance it appears less often than drafts/L/Cs because it depends heavily on the drawer's bank balance and is slower/less secure to collect internationally.</p>
<h3>Promissory note (kỳ phiếu)</h3>
<p>A <strong>promissory note</strong> is the reverse structure: the <strong>maker</strong> (debtor) itself makes an unconditional promise to pay a sum to the payee — no separate drawee. It is common when a buyer wants to formalize a payment obligation, e.g. under deferred-payment terms.</p>
<pre><code>Bill of exchange:  Drawer orders Drawee to pay Payee
Promissory note:   Maker promises to pay Payee directly
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> These instruments are the "payment tools" that remittance, collection and L/C transactions carry inside them — a draft is what actually gets presented for payment or acceptance under a collection or an L/C.</div>`,
    `<span class="eyebrow">IIP301 · Chương 2 · Bài 2.1</span>
<h2>Phương tiện thanh toán</h2>
<h3>Hối phiếu (bill of exchange / draft)</h3>
<p>Một <strong>hối phiếu</strong> là lệnh viết, vô điều kiện, do một bên (<strong>người ký phát/drawer</strong>, thường là nhà xuất khẩu) yêu cầu bên khác (<strong>người bị ký phát/drawee</strong>, thường là nhà nhập khẩu hoặc ngân hàng của họ) trả một số tiền cố định, ngay khi xuất trình hoặc vào một ngày cố định trong tương lai, cho một người được chỉ định hoặc người cầm phiếu (<strong>người thụ hưởng/payee</strong>).</p>
<ul>
<li><strong>Hối phiếu trả ngay (sight draft)</strong> — trả khi xuất trình/theo yêu cầu ("at sight").</li>
<li><strong>Hối phiếu có kỳ hạn (time/usance draft)</strong> — trả vào một ngày cố định trong tương lai (vd "90 ngày sau khi xuất trình" hoặc "90 ngày sau ngày B/L").</li>
<li><strong>Ký nhận (acceptance)</strong> — với hối phiếu có kỳ hạn, người bị ký phát ký "accepted" lên mặt hối phiếu, tạo cam kết trả tiền chắc chắn, có tính pháp lý khi đến hạn; hối phiếu đã ký nhận sau đó có thể được chiết khấu (bán trước hạn lấy tiền mặt, trừ đi một khoản chiết khấu).</li>
</ul>
<h3>Séc (cheque)</h3>
<p>Một <strong>séc</strong> là lệnh viết của chủ tài khoản (người ký phát) yêu cầu ngân hàng của họ (người bị ký phát) trả một số tiền đã ghi cho người thụ hưởng theo yêu cầu. Trong tài trợ thương mại, séc ít xuất hiện hơn hối phiếu/L/C vì phụ thuộc nhiều vào số dư tài khoản người ký phát và thu tiền quốc tế chậm/kém an toàn hơn.</p>
<h3>Kỳ phiếu (promissory note)</h3>
<p>Một <strong>kỳ phiếu</strong> có cấu trúc ngược lại: <strong>người phát hành</strong> (bên nợ) tự mình cam kết vô điều kiện trả một số tiền cho người thụ hưởng — không có người bị ký phát riêng. Thường dùng khi người mua muốn chính thức hóa nghĩa vụ thanh toán, vd theo điều kiện trả chậm.</p>
<pre><code>Hối phiếu:  Người ký phát ra lệnh Người bị ký phát trả Người thụ hưởng
Kỳ phiếu:   Người phát hành tự cam kết trả trực tiếp cho Người thụ hưởng
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Đây là các "công cụ thanh toán" nằm bên trong giao dịch chuyển tiền, nhờ thu và L/C — hối phiếu chính là thứ được xuất trình để thanh toán hoặc ký nhận trong nhờ thu hoặc L/C.</div>`,
  ]]);

const c2q = quiz('iip301-quiz-2', 'Quiz 2 — Payment instruments|||Quiz 2 — Phương tiện thanh toán', [
  { id: 'q1', question: 'Trong hối phiếu, ai là "drawee" (người bị ký phát)?', options: ['Người ký phát ra lệnh', 'Người bị yêu cầu trả tiền (thường là nhà nhập khẩu/ngân hàng)', 'Người thụ hưởng cuối cùng', 'Ngân hàng đại lý'], correctIndex: 1, explanation: 'Drawee là bên bị drawer ra lệnh phải trả tiền cho payee.' },
  { id: 'q2', question: 'Hối phiếu "at sight" nghĩa là gì?', options: ['Trả sau 90 ngày', 'Trả ngay khi xuất trình', 'Không cần trả', 'Chỉ dùng cho séc'], correctIndex: 1, explanation: 'Sight draft phải trả ngay khi được xuất trình, khác với time draft trả vào ngày cố định sau này.' },
  { id: 'q3', question: 'Kỳ phiếu (promissory note) khác hối phiếu ở điểm nào?', options: ['Không có giá trị pháp lý', 'Người phát hành tự cam kết trả, không có bên thứ ba bị ra lệnh (drawee)', 'Chỉ dùng trong nội địa', 'Luôn trả ngay, không có kỳ hạn'], correctIndex: 1, explanation: 'Kỳ phiếu là cam kết trực tiếp của chính người phát hành, không có cấu trúc ra lệnh cho một drawee riêng như hối phiếu.' },
]);

const c3 = doc('iip301-3-1-remittance', '3.1 — Remittance (T/T)|||3.1 — Chuyển tiền (T/T)',
  'Chuyển tiền bằng điện (T/T) và bằng thư (M/T); T/T trả trước vs T/T trả sau giao hàng; điện SWIFT MT103; ai chịu rủi ro.',
  [[
    `<span class="eyebrow">IIP301 · Chapter 3 · Lesson 3.1</span>
<h2>Remittance (T/T)</h2>
<h3>What remittance is</h3>
<p><strong>Remittance</strong> is the simplest payment method: the buyer instructs its bank to pay a fixed sum directly to the seller (or the seller's bank), with the bank acting purely as a payment channel — it does not check any trade documents or guarantee performance by either side. The two forms are <strong>Telegraphic Transfer (T/T)</strong>, sent electronically (SWIFT), and <strong>Mail Transfer (M/T)</strong>, sent by post — T/T has almost entirely replaced M/T today because it is fast and traceable.</p>
<h3>Timing decides who bears the risk</h3>
<ul>
<li><strong>T/T in advance (advance payment)</strong> — buyer pays before the seller ships. All the risk sits with the <strong>buyer</strong>: if the seller never ships, the money is already gone.</li>
<li><strong>T/T after shipment / open account</strong> — seller ships first, buyer pays afterward (sometimes on receiving copy documents, sometimes on an agreed date). All the risk sits with the <strong>seller</strong>: if the buyer never pays, the goods are already gone.</li>
<li><strong>Split T/T</strong> — a common compromise, e.g. 30% deposit in advance + 70% before/after shipment, sharing the risk between both sides.</li>
</ul>
<h3>The message: SWIFT MT103</h3>
<pre><code>Importer instructs Bank B (remitting bank)
   -&gt; SWIFT MT103 "customer credit transfer" to Bank A (VN)
   -&gt; Bank A credits the exporter's account
   (no documents checked by either bank)
</code></pre>
<div class="callout"><span class="badge">Fast but unconditional</span> Remittance is cheap and quick precisely because the bank does not verify anything — which is also exactly why it carries the most risk for whichever side pays/ships first. Trust between the parties (or a long trading history) is what makes T/T workable.</div>`,
    `<span class="eyebrow">IIP301 · Chương 3 · Bài 3.1</span>
<h2>Chuyển tiền (T/T)</h2>
<h3>Chuyển tiền là gì</h3>
<p><strong>Chuyển tiền</strong> là phương thức thanh toán đơn giản nhất: người mua yêu cầu ngân hàng của mình trả một số tiền cố định trực tiếp cho người bán (hoặc ngân hàng người bán), với ngân hàng chỉ đóng vai trò kênh chuyển tiền — không kiểm tra chứng từ thương mại nào và không bảo đảm việc thực hiện của bên nào. Hai hình thức là <strong>chuyển tiền bằng điện (T/T — Telegraphic Transfer)</strong>, gửi điện tử (qua SWIFT), và <strong>chuyển tiền bằng thư (M/T — Mail Transfer)</strong>, gửi qua đường thư — ngày nay T/T đã thay thế gần hoàn toàn M/T vì nhanh và có thể theo dõi được.</p>
<h3>Thời điểm quyết định ai chịu rủi ro</h3>
<ul>
<li><strong>T/T trả trước (advance payment)</strong> — người mua trả tiền trước khi người bán giao hàng. Toàn bộ rủi ro nằm ở <strong>người mua</strong>: nếu người bán không giao hàng, tiền đã mất.</li>
<li><strong>T/T trả sau giao hàng / ghi sổ (open account)</strong> — người bán giao hàng trước, người mua trả tiền sau (có khi khi nhận bản sao chứng từ, có khi vào ngày đã thỏa thuận). Toàn bộ rủi ro nằm ở <strong>người bán</strong>: nếu người mua không trả tiền, hàng đã mất.</li>
<li><strong>T/T chia đợt (split T/T)</strong> — cách dung hòa phổ biến, vd đặt cọc trước 30% + trả 70% trước/sau khi giao hàng, chia sẻ rủi ro cho cả hai bên.</li>
</ul>
<h3>Bức điện: SWIFT MT103</h3>
<pre><code>Người NK yêu cầu NH B (ngân hàng chuyển tiền)
   -&gt; điện SWIFT MT103 "chuyển tiền tín dụng khách hàng" tới NH A (VN)
   -&gt; NH A ghi có vào tài khoản người XK
   (không ngân hàng nào kiểm tra chứng từ)
</code></pre>
<div class="callout"><span class="badge">Nhanh nhưng vô điều kiện</span> Chuyển tiền rẻ và nhanh chính vì ngân hàng không xác minh gì — đây cũng chính là lý do nó mang rủi ro cao nhất cho bên nào trả tiền/giao hàng trước. Niềm tin giữa hai bên (hoặc lịch sử giao dịch lâu dài) là điều làm T/T khả thi.</div>`,
  ]]);

const c3q = quiz('iip301-quiz-3', 'Quiz 3 — Remittance (T/T)|||Quiz 3 — Chuyển tiền (T/T)', [
  { id: 'q1', question: 'Vai trò của ngân hàng trong chuyển tiền (T/T) là gì?', options: ['Kiểm tra và đối chiếu bộ chứng từ', 'Bảo lãnh cho cả hai bên', 'Chỉ là kênh chuyển tiền, không kiểm tra chứng từ nào', 'Phát hành hối phiếu thay người mua'], correctIndex: 2, explanation: 'T/T là chuyển tiền thuần, ngân hàng không kiểm tra chứng từ hay bảo đảm thực hiện hợp đồng.' },
  { id: 'q2', question: 'T/T trả trước (advance payment) thì ai chịu rủi ro cao nhất?', options: ['Người bán', 'Người mua', 'Ngân hàng chuyển tiền', 'Ngân hàng đại lý'], correctIndex: 1, explanation: 'Người mua trả tiền trước khi nhận hàng nên chịu rủi ro nếu người bán không giao hàng.' },
  { id: 'q3', question: 'Điện SWIFT dùng cho chuyển tiền khách hàng thường có mã gì?', options: ['MT103', 'MT700', 'MT400', 'MT202'], correctIndex: 0, explanation: 'MT103 là điện SWIFT chuẩn cho "customer credit transfer" — chuyển tiền khách hàng.' },
]);

const c4 = doc('iip301-4-1-collection', '4.1 — Collection: D/P, D/A & URC 522|||4.1 — Nhờ thu: D/P, D/A & URC 522',
  'Nhờ thu kèm chứng từ; các bên (principal, remitting bank, collecting/presenting bank, drawee); D/P (trả tiền đổi chứng từ) vs D/A (ký nhận đổi chứng từ); URC 522.',
  [[
    `<span class="eyebrow">IIP301 · Chapter 4 · Lesson 4.1</span>
<h2>Collection: D/P, D/A &amp; URC 522</h2>
<h3>What a documentary collection is</h3>
<p>In a <strong>documentary collection</strong>, the exporter ships the goods and hands the shipping documents (and often a draft) to its own bank with instructions to release them to the importer ONLY against payment or acceptance. Unlike remittance, a bank now handles documents — but unlike an L/C, no bank promises to pay; the bank is just following instructions and is not on the hook if the importer refuses.</p>
<h3>The parties</h3>
<ul>
<li><strong>Principal</strong> — the exporter, who instructs the collection.</li>
<li><strong>Remitting bank</strong> — the exporter's bank, which sends documents onward.</li>
<li><strong>Collecting/presenting bank</strong> — the importer's bank, which presents documents to the importer and collects payment/acceptance.</li>
<li><strong>Drawee</strong> — the importer, who must pay or accept to get the documents.</li>
</ul>
<h3>D/P vs D/A</h3>
<ul>
<li><strong>D/P — Documents against Payment</strong> — the collecting bank releases documents to the importer only once it has actually paid. The importer cannot get the goods (via the B/L) without paying.</li>
<li><strong>D/A — Documents against Acceptance</strong> — the collecting bank releases documents once the importer merely accepts the draft (signs a promise to pay later). The importer gets the documents/goods NOW but pays LATER — riskier for the exporter, since an accepted draft can still go unpaid at maturity.</li>
</ul>
<pre><code>Exporter --docs+draft--&gt; Remitting bank --docs+draft--&gt; Collecting bank
                                                              |
                                            Importer pays (D/P) or accepts (D/A)
                                                              |
                                            Collecting bank releases documents
</code></pre>
<h3>URC 522</h3>
<p>Collections worldwide follow <strong>URC 522</strong> (Uniform Rules for Collections, ICC) — it standardizes how banks handle collection instructions, but it does NOT make any bank guarantee payment; banks act only as instructed and check documents only for completeness, not for compliance with the underlying contract.</p>
<div class="callout"><span class="badge">More secure than T/T, less than L/C</span> Collection gives the exporter some control (goods aren't released without payment/acceptance), but no bank is on the hook if the importer simply refuses — that guarantee only comes with a documentary credit.</div>`,
    `<span class="eyebrow">IIP301 · Chương 4 · Bài 4.1</span>
<h2>Nhờ thu: D/P, D/A &amp; URC 522</h2>
<h3>Nhờ thu kèm chứng từ là gì</h3>
<p>Trong <strong>nhờ thu kèm chứng từ</strong>, nhà xuất khẩu giao hàng và trao bộ chứng từ vận chuyển (thường kèm hối phiếu) cho ngân hàng của mình với chỉ dẫn CHỈ trao chứng từ cho nhà nhập khẩu khi thanh toán hoặc ký nhận. Khác chuyển tiền, giờ ngân hàng xử lý chứng từ — nhưng khác L/C, không ngân hàng nào cam kết trả tiền; ngân hàng chỉ làm theo chỉ dẫn và không chịu trách nhiệm nếu nhà nhập khẩu từ chối.</p>
<h3>Các bên tham gia</h3>
<ul>
<li><strong>Người ủy thác (principal)</strong> — nhà xuất khẩu, người ra chỉ dẫn nhờ thu.</li>
<li><strong>Ngân hàng chuyển chứng từ (remitting bank)</strong> — ngân hàng của nhà xuất khẩu, gửi chứng từ đi.</li>
<li><strong>Ngân hàng thu hộ/xuất trình (collecting/presenting bank)</strong> — ngân hàng của nhà nhập khẩu, xuất trình chứng từ và thu tiền/ký nhận.</li>
<li><strong>Người bị ký phát (drawee)</strong> — nhà nhập khẩu, phải trả tiền hoặc ký nhận để lấy chứng từ.</li>
</ul>
<h3>D/P và D/A</h3>
<ul>
<li><strong>D/P — Documents against Payment (trả tiền đổi chứng từ)</strong> — ngân hàng thu hộ chỉ trao chứng từ cho nhà nhập khẩu sau khi đã thực sự thanh toán. Nhà nhập khẩu không thể lấy hàng (qua B/L) nếu chưa trả tiền.</li>
<li><strong>D/A — Documents against Acceptance (ký nhận đổi chứng từ)</strong> — ngân hàng thu hộ trao chứng từ ngay khi nhà nhập khẩu chỉ cần ký nhận hối phiếu (cam kết trả sau). Nhà nhập khẩu nhận chứng từ/hàng NGAY nhưng trả tiền SAU — rủi ro hơn cho nhà xuất khẩu, vì hối phiếu đã ký nhận vẫn có thể không được trả khi đến hạn.</li>
</ul>
<pre><code>Nhà XK --chứng từ+hối phiếu--&gt; NH chuyển --chứng từ+hối phiếu--&gt; NH thu hộ
                                                                      |
                                          Nhà NK trả tiền (D/P) hoặc ký nhận (D/A)
                                                                      |
                                          NH thu hộ trao chứng từ
</code></pre>
<h3>URC 522</h3>
<p>Nhờ thu trên toàn cầu tuân theo <strong>URC 522</strong> (Quy tắc thống nhất về nhờ thu, ICC) — chuẩn hóa cách ngân hàng xử lý chỉ dẫn nhờ thu, nhưng KHÔNG khiến ngân hàng nào bảo đảm thanh toán; ngân hàng chỉ hành động theo chỉ dẫn và kiểm tra chứng từ về tính đầy đủ, không kiểm tra việc tuân thủ hợp đồng gốc.</p>
<div class="callout"><span class="badge">An toàn hơn T/T, kém hơn L/C</span> Nhờ thu cho nhà xuất khẩu một phần kiểm soát (hàng không được trao nếu chưa trả tiền/ký nhận), nhưng không ngân hàng nào chịu trách nhiệm nếu nhà nhập khẩu đơn giản từ chối — bảo đảm đó chỉ có ở tín dụng chứng từ.</div>`,
  ]]);

const c4q = quiz('iip301-quiz-4', 'Quiz 4 — Collection D/P, D/A, URC 522|||Quiz 4 — Nhờ thu D/P, D/A, URC 522', [
  { id: 'q1', question: 'Trong nhờ thu D/P, ngân hàng thu hộ trao chứng từ khi nào?', options: ['Ngay khi nhận được chứng từ', 'Chỉ sau khi nhà nhập khẩu đã thanh toán', 'Chỉ sau khi nhà nhập khẩu ký nhận hối phiếu', 'Khi hàng đến cảng'], correctIndex: 1, explanation: 'D/P = Documents against Payment: trao chứng từ chỉ khi đã thanh toán thực sự.' },
  { id: 'q2', question: 'D/A rủi ro hơn D/P cho nhà xuất khẩu vì sao?', options: ['D/A không dùng hối phiếu', 'Nhà nhập khẩu nhận chứng từ/hàng trước, chỉ cam kết trả sau bằng ký nhận', 'D/A chỉ áp dụng nội địa', 'D/A không cần ngân hàng thu hộ'], correctIndex: 1, explanation: 'D/A trao chứng từ khi chỉ ký nhận, nên nhà nhập khẩu có hàng trước khi trả tiền — hối phiếu ký nhận vẫn có thể không được trả khi đến hạn.' },
  { id: 'q3', question: 'URC 522 có vai trò gì trong nhờ thu?', options: ['Bảo đảm ngân hàng phải trả tiền thay nhà nhập khẩu', 'Chuẩn hóa cách ngân hàng xử lý chỉ dẫn nhờ thu, không bảo đảm thanh toán', 'Quy định thuế xuất nhập khẩu', 'Thay thế hợp đồng ngoại thương'], correctIndex: 1, explanation: 'URC 522 chỉ chuẩn hóa quy trình xử lý của ngân hàng; không ngân hàng nào cam kết thanh toán trong nhờ thu.' },
]);

const c5 = doc('iip301-5-1-lc-ucp600', '5.1 — Documentary credit (L/C) & UCP 600|||5.1 — Tín dụng chứng từ (L/C) & UCP 600',
  'L/C là gì, các bên (applicant, issuing bank, advising bank, beneficiary); nguyên tắc độc lập & tuân thủ nghiêm ngặt chứng từ; UCP 600.',
  [[
    `<span class="eyebrow">IIP301 · Chapter 5 · Lesson 5.1</span>
<h2>Documentary credit (L/C) &amp; UCP 600</h2>
<h3>What an L/C is</h3>
<p>A <strong>Letter of Credit (L/C)</strong> is a written undertaking by a bank (on the buyer's behalf) to pay the seller a stated sum, PROVIDED the seller presents documents that comply exactly with the credit's terms. This is the key difference from collection: here a <strong>bank itself</strong> promises to pay — not just the buyer.</p>
<h3>The parties</h3>
<ul>
<li><strong>Applicant</strong> — the importer/buyer, who asks its bank to open the credit.</li>
<li><strong>Issuing bank</strong> — the applicant's bank, which opens the L/C and undertakes to pay.</li>
<li><strong>Advising bank</strong> — a bank in the exporter's country that authenticates and forwards the L/C to the beneficiary (does not itself add a payment promise, unless it also confirms).</li>
<li><strong>Beneficiary</strong> — the exporter/seller, entitled to payment on presenting compliant documents.</li>
<li><strong>Confirming bank</strong> (optional) — a bank that ADDS its own payment undertaking on top of the issuing bank's, giving the beneficiary a second guarantee (useful when the issuing bank's country/credit risk is a concern).</li>
</ul>
<h3>Two governing principles</h3>
<ul>
<li><strong>Independence principle</strong> — the L/C is a separate contract from the underlying sale contract; the bank's obligation to pay does not depend on whether the goods actually match the contract, only on the documents.</li>
<li><strong>Strict compliance</strong> — the bank examines documents on their face only, and pays ONLY if they comply exactly with the credit's terms; any discrepancy can be grounds for refusal, even a minor one (e.g. a misspelled name, a missing signature).</li>
</ul>
<h3>UCP 600</h3>
<p><strong>UCP 600</strong> (Uniform Customs and Practice for Documentary Credits, ICC, 2007 revision, 39 articles) is the rulebook that L/Cs worldwide are issued "subject to" — it defines these principles, standard document requirements, bank examination time limits (5 banking days), and how discrepancies are handled.</p>
<pre><code>Applicant --applies--&gt; Issuing bank --opens L/C--&gt; Advising bank --advises--&gt; Beneficiary
                                                                                    |
                                                                        ships goods, presents docs
                                                                                    |
                                                    Issuing bank pays if docs comply (UCP 600)
</code></pre>
<div class="callout"><span class="badge">Why exporters prefer it</span> An L/C substitutes the buyer's promise to pay with a BANK's promise to pay — as long as the paperwork is right, payment does not depend on the buyer's goodwill.</div>`,
    `<span class="eyebrow">IIP301 · Chương 5 · Bài 5.1</span>
<h2>Tín dụng chứng từ (L/C) &amp; UCP 600</h2>
<h3>L/C là gì</h3>
<p>Một <strong>Thư tín dụng (L/C)</strong> là cam kết viết của một ngân hàng (thay mặt người mua) trả cho người bán một số tiền đã nêu, VỚI ĐIỀU KIỆN người bán xuất trình chứng từ tuân thủ đúng theo điều khoản của thư tín dụng. Đây là khác biệt then chốt so với nhờ thu: ở đây <strong>chính ngân hàng</strong> cam kết trả tiền — không chỉ người mua.</p>
<h3>Các bên tham gia</h3>
<ul>
<li><strong>Người yêu cầu (applicant)</strong> — nhà nhập khẩu/người mua, yêu cầu ngân hàng mở thư tín dụng.</li>
<li><strong>Ngân hàng phát hành (issuing bank)</strong> — ngân hàng của người yêu cầu, mở L/C và cam kết trả tiền.</li>
<li><strong>Ngân hàng thông báo (advising bank)</strong> — ngân hàng ở nước người bán, xác thực và chuyển L/C tới người thụ hưởng (không tự thêm cam kết trả tiền, trừ khi cũng xác nhận).</li>
<li><strong>Người thụ hưởng (beneficiary)</strong> — nhà xuất khẩu/người bán, được nhận tiền khi xuất trình chứng từ hợp lệ.</li>
<li><strong>Ngân hàng xác nhận (confirming bank)</strong> (nếu có) — ngân hàng THÊM cam kết trả tiền của riêng mình bên cạnh cam kết của ngân hàng phát hành, cho người thụ hưởng thêm một bảo đảm (hữu ích khi lo ngại rủi ro quốc gia/tín dụng của ngân hàng phát hành).</li>
</ul>
<h3>Hai nguyên tắc chi phối</h3>
<ul>
<li><strong>Nguyên tắc độc lập</strong> — L/C là hợp đồng tách biệt với hợp đồng mua bán gốc; nghĩa vụ trả tiền của ngân hàng không phụ thuộc việc hàng hóa có đúng như hợp đồng hay không, chỉ phụ thuộc chứng từ.</li>
<li><strong>Tuân thủ nghiêm ngặt (strict compliance)</strong> — ngân hàng chỉ kiểm tra chứng từ trên bề mặt, và CHỈ trả tiền nếu chứng từ tuân thủ đúng điều khoản L/C; bất kỳ sai biệt nào cũng có thể là lý do từ chối, dù nhỏ (vd viết sai tên, thiếu chữ ký).</li>
</ul>
<h3>UCP 600</h3>
<p><strong>UCP 600</strong> (Quy tắc thống nhất về tín dụng chứng từ, ICC, bản sửa 2007, 39 điều) là bộ quy tắc mà L/C toàn cầu "được phát hành theo" — định nghĩa các nguyên tắc trên, yêu cầu chứng từ chuẩn, thời hạn kiểm tra của ngân hàng (5 ngày làm việc ngân hàng), và cách xử lý sai biệt.</p>
<pre><code>Người YC --nộp đơn--&gt; NH phát hành --mở L/C--&gt; NH thông báo --thông báo--&gt; Người TH
                                                                                  |
                                                                    giao hàng, xuất trình chứng từ
                                                                                  |
                                          NH phát hành trả tiền nếu chứng từ hợp lệ (UCP 600)
</code></pre>
<div class="callout"><span class="badge">Vì sao nhà xuất khẩu thích L/C</span> L/C thay cam kết trả tiền của người mua bằng cam kết trả tiền của NGÂN HÀNG — chỉ cần chứng từ đúng, thanh toán không phụ thuộc vào ý muốn của người mua.</div>`,
  ]]);

const c5q = quiz('iip301-quiz-5', 'Quiz 5 — L/C & UCP 600|||Quiz 5 — L/C & UCP 600', [
  { id: 'q1', question: 'Khác biệt chính giữa L/C và nhờ thu là gì?', options: ['L/C không cần chứng từ', 'Trong L/C, chính ngân hàng cam kết trả tiền nếu chứng từ hợp lệ', 'Nhờ thu luôn nhanh hơn L/C', 'L/C chỉ dùng cho hàng nội địa'], correctIndex: 1, explanation: 'L/C có cam kết trả tiền độc lập của ngân hàng phát hành; nhờ thu thì ngân hàng chỉ theo chỉ dẫn, không cam kết trả.' },
  { id: 'q2', question: 'Nguyên tắc độc lập (independence principle) của L/C nghĩa là gì?', options: ['Ngân hàng phải kiểm tra hàng hóa thực tế', 'L/C tách biệt với hợp đồng mua bán gốc, ngân hàng chỉ xét chứng từ', 'Người mua có thể hủy L/C bất cứ lúc nào', 'L/C không cần UCP 600'], correctIndex: 1, explanation: 'Nghĩa vụ trả tiền của ngân hàng theo L/C độc lập với việc hàng có đúng hợp đồng hay không.' },
  { id: 'q3', question: 'UCP 600 quy định thời hạn kiểm tra chứng từ của ngân hàng là bao lâu?', options: ['24 giờ', '5 ngày làm việc ngân hàng', '30 ngày', 'Không có thời hạn'], correctIndex: 1, explanation: 'UCP 600 quy định ngân hàng có tối đa 5 ngày làm việc ngân hàng để kiểm tra và quyết định về bộ chứng từ.' },
]);

const c6 = doc('iip301-6-1-special-lc', '6.1 — Special types of L/C|||6.1 — Các loại L/C đặc biệt',
  'L/C chuyển nhượng (transferable), L/C giáp lưng (back-to-back), L/C tuần hoàn (revolving); L/C dự phòng (standby), L/C xác nhận, L/C điều khoản đỏ.',
  [[
    `<span class="eyebrow">IIP301 · Chapter 6 · Lesson 6.1</span>
<h2>Special types of L/C</h2>
<h3>Transferable L/C</h3>
<p>A <strong>transferable L/C</strong> lets the first (original) beneficiary transfer all or part of the credit to one or more second beneficiaries — common when the first beneficiary is a trading middleman who does not manufacture the goods itself, and needs to pay its own supplier using the same credit.</p>
<h3>Back-to-back L/C</h3>
<p>A <strong>back-to-back L/C</strong> is actually TWO separate, independent credits: the middleman, holding an L/C from the end buyer (the "master" L/C) as security, gets its own bank to issue a SECOND L/C in favor of its supplier. Unlike a transferable L/C, the two credits are legally unconnected — useful when the master L/C is not transferable, but riskier for the middleman's bank since it is issuing a fresh, independent undertaking.</p>
<h3>Revolving L/C</h3>
<p>A <strong>revolving L/C</strong> automatically reinstates its value after each drawing, up to a set number of times or a set period — used for a series of repeat shipments under one long-term supply contract, avoiding the cost of opening a brand-new L/C every time.</p>
<h3>Other common variants</h3>
<ul>
<li><strong>Standby L/C</strong> — functions like a bank guarantee: normally NOT drawn; the bank pays only if the applicant fails to perform (a payment-of-last-resort backstop, not the primary payment method).</li>
<li><strong>Confirmed L/C</strong> — a confirming bank adds its own payment undertaking (see 5.1) for extra security.</li>
<li><strong>Red clause L/C</strong> — allows the beneficiary to draw a portion of funds in ADVANCE, before shipment, e.g. to buy raw materials — the advance clause was historically printed in red ink.</li>
</ul>
<pre><code>Transferable L/C:  1 credit, part/all transferred to 2nd beneficiary
Back-to-back L/C:  2 separate credits (master + secondary), legally independent
Revolving L/C:     1 credit, value reinstated after each drawing
</code></pre>
<div class="callout"><span class="badge">Pick by the deal's shape</span> These variants exist because real trade chains are rarely a single buyer-seller pair — a middleman, a repeat contract, or a need for upfront cash each call for a different L/C structure.</div>`,
    `<span class="eyebrow">IIP301 · Chương 6 · Bài 6.1</span>
<h2>Các loại L/C đặc biệt</h2>
<h3>L/C chuyển nhượng (transferable)</h3>
<p>Một <strong>L/C chuyển nhượng</strong> cho phép người thụ hưởng thứ nhất (gốc) chuyển nhượng toàn bộ hoặc một phần L/C cho một hoặc nhiều người thụ hưởng thứ hai — phổ biến khi người thụ hưởng thứ nhất là trung gian thương mại, không tự sản xuất hàng, và cần trả cho nhà cung cấp của mình bằng chính L/C đó.</p>
<h3>L/C giáp lưng (back-to-back)</h3>
<p>Một <strong>L/C giáp lưng</strong> thực chất là HAI thư tín dụng riêng biệt, độc lập: trung gian, đang giữ L/C từ người mua cuối (L/C "gốc") làm bảo đảm, yêu cầu ngân hàng của mình phát hành một L/C THỨ HAI cho nhà cung cấp của mình. Khác L/C chuyển nhượng, hai L/C này không liên quan pháp lý với nhau — hữu ích khi L/C gốc không được chuyển nhượng, nhưng rủi ro hơn cho ngân hàng của trung gian vì đang phát hành một cam kết mới, độc lập.</p>
<h3>L/C tuần hoàn (revolving)</h3>
<p>Một <strong>L/C tuần hoàn</strong> tự động khôi phục giá trị sau mỗi lần rút tiền, tới một số lần hoặc thời hạn đã định — dùng cho một chuỗi giao hàng lặp lại theo một hợp đồng cung cấp dài hạn, tránh chi phí mở L/C mới mỗi lần.</p>
<h3>Các biến thể phổ biến khác</h3>
<ul>
<li><strong>L/C dự phòng (standby)</strong> — hoạt động như một bảo lãnh ngân hàng: thường KHÔNG bị rút; ngân hàng chỉ trả tiền khi người yêu cầu không thực hiện nghĩa vụ (lưới đỡ cuối cùng, không phải phương thức thanh toán chính).</li>
<li><strong>L/C xác nhận (confirmed)</strong> — ngân hàng xác nhận thêm cam kết trả tiền của riêng mình (xem bài 5.1) để tăng bảo đảm.</li>
<li><strong>L/C điều khoản đỏ (red clause)</strong> — cho phép người thụ hưởng rút một phần tiền TRƯỚC, trước khi giao hàng, vd để mua nguyên liệu — điều khoản ứng trước này trước đây được in bằng mực đỏ.</li>
</ul>
<pre><code>L/C chuyển nhượng: 1 L/C, chuyển một phần/toàn bộ cho người TH thứ 2
L/C giáp lưng:     2 L/C riêng biệt (gốc + thứ cấp), độc lập pháp lý
L/C tuần hoàn:     1 L/C, giá trị khôi phục sau mỗi lần rút
</code></pre>
<div class="callout"><span class="badge">Chọn theo hình dạng giao dịch</span> Các biến thể này tồn tại vì chuỗi thương mại thực tế hiếm khi chỉ có một cặp mua-bán đơn giản — trung gian, hợp đồng lặp lại, hay nhu cầu tiền mặt trước đều cần một cấu trúc L/C khác nhau.</div>`,
  ]]);

const c6q = quiz('iip301-quiz-6', 'Quiz 6 — Special L/C types|||Quiz 6 — Các loại L/C đặc biệt', [
  { id: 'q1', question: 'L/C giáp lưng (back-to-back) khác L/C chuyển nhượng ở điểm nào?', options: ['Giáp lưng chỉ có một L/C duy nhất', 'Giáp lưng là hai L/C riêng biệt, độc lập pháp lý; chuyển nhượng là một L/C được chuyển', 'Chuyển nhượng không cần ngân hàng phát hành', 'Không có khác biệt'], correctIndex: 1, explanation: 'Back-to-back tạo ra 2 L/C độc lập; transferable chỉ chuyển nhượng một phần/toàn bộ CÙNG một L/C.' },
  { id: 'q2', question: 'L/C dự phòng (standby L/C) thường được dùng như thế nào?', options: ['Là phương thức thanh toán chính, luôn bị rút', 'Như một bảo lãnh, chỉ trả tiền khi bên yêu cầu không thực hiện nghĩa vụ', 'Chỉ dùng cho giao hàng lặp lại', 'Thay thế hoàn toàn UCP 600'], correctIndex: 1, explanation: 'Standby L/C là lưới đỡ, chỉ được rút khi có việc không thực hiện nghĩa vụ, không phải công cụ thanh toán chính.' },
  { id: 'q3', question: 'L/C tuần hoàn (revolving) phù hợp nhất với trường hợp nào?', options: ['Giao dịch một lần duy nhất', 'Một chuỗi giao hàng lặp lại theo hợp đồng dài hạn', 'Khi người mua muốn hủy hợp đồng', 'Khi không có ngân hàng phát hành'], correctIndex: 1, explanation: 'Revolving L/C tự khôi phục giá trị sau mỗi lần rút, phù hợp cho các đợt giao hàng lặp lại.' },
]);

const c7 = doc('iip301-7-1-documents-isbp', '7.1 — Document set & examination (ISBP)|||7.1 — Bộ chứng từ & kiểm tra chứng từ (ISBP)',
  'Bộ chứng từ điển hình (hóa đơn, phiếu đóng gói, B/L, chứng từ bảo hiểm, C/O, giấy kiểm định); ISBP 745; sai biệt (discrepancy) và cách xử lý.',
  [[
    `<span class="eyebrow">IIP301 · Chapter 7 · Lesson 7.1</span>
<h2>Document set &amp; examination (ISBP)</h2>
<h3>The typical document set under an L/C</h3>
<ul>
<li><strong>Commercial invoice</strong> — states goods, quantity, unit price, total value; must match the L/C description exactly.</li>
<li><strong>Packing list</strong> — details how the goods are packed (cartons, weight, dimensions).</li>
<li><strong>Bill of Lading (B/L)</strong> — issued by the carrier; evidences shipment, is the title document for the goods, and must be presented to claim them at destination.</li>
<li><strong>Insurance document</strong> — required under CIF/CIP terms; covers the goods against loss/damage in transit.</li>
<li><strong>Certificate of Origin (C/O)</strong> — states the country the goods originated from, often needed for customs/tariff preference.</li>
<li><strong>Inspection certificate</strong> — an independent inspector confirms quality/quantity before shipment, when required by the credit.</li>
</ul>
<h3>ISBP — how banks actually examine documents</h3>
<p><strong>ISBP 745</strong> (International Standard Banking Practice, ICC) supplements UCP 600 with detailed, practical guidance on HOW to apply strict compliance — e.g. how names must be spelled, how dates and quantities are read, what minor variations are tolerable versus what counts as a real discrepancy. Banks examine documents on their face, cross-checking them against each other AND against the credit — data must not conflict between documents.</p>
<h3>Discrepancies</h3>
<pre><code>Document presented -&gt; Bank examines within 5 banking days (UCP 600)
   compliant   -&gt; bank pays / accepts
   discrepant  -&gt; bank may refuse, must notify beneficiary with reasons,
                  once, listing ALL discrepancies (no piecemeal notices)
</code></pre>
<p>Common discrepancies: late shipment/presentation, invoice amount exceeding the credit value, inconsistent goods description across documents, missing signature/endorsement, wrong or missing certificate. A discrepant set does not automatically kill payment — the applicant can waive the discrepancy, or the beneficiary can correct and re-present within the credit's validity.</p>
<div class="callout"><span class="badge">Paper, not goods</span> Banks are examining PAPER against PAPER — a perfect shipment with a flawed document set can still be refused; a flawless document set is what actually gets paid.</div>`,
    `<span class="eyebrow">IIP301 · Chương 7 · Bài 7.1</span>
<h2>Bộ chứng từ &amp; kiểm tra chứng từ (ISBP)</h2>
<h3>Bộ chứng từ điển hình theo L/C</h3>
<ul>
<li><strong>Hóa đơn thương mại (commercial invoice)</strong> — ghi hàng hóa, số lượng, đơn giá, tổng giá trị; phải khớp đúng mô tả trong L/C.</li>
<li><strong>Phiếu đóng gói (packing list)</strong> — chi tiết cách đóng gói hàng (số kiện, trọng lượng, kích thước).</li>
<li><strong>Vận đơn (Bill of Lading — B/L)</strong> — do hãng vận chuyển phát hành; chứng minh việc giao hàng, là chứng từ sở hữu hàng hóa, phải xuất trình để nhận hàng tại nơi đến.</li>
<li><strong>Chứng từ bảo hiểm</strong> — bắt buộc theo điều kiện CIF/CIP; bảo hiểm hàng hóa trước mất mát/hư hỏng trong vận chuyển.</li>
<li><strong>Giấy chứng nhận xuất xứ (C/O)</strong> — ghi nước xuất xứ hàng hóa, thường cần cho hải quan/ưu đãi thuế.</li>
<li><strong>Giấy kiểm định (inspection certificate)</strong> — bên kiểm định độc lập xác nhận chất lượng/số lượng trước khi giao hàng, khi L/C yêu cầu.</li>
</ul>
<h3>ISBP — ngân hàng kiểm tra chứng từ như thế nào</h3>
<p><strong>ISBP 745</strong> (Tập quán ngân hàng tiêu chuẩn quốc tế, ICC) bổ sung cho UCP 600 bằng hướng dẫn chi tiết, thực tế về CÁCH áp dụng tuân thủ nghiêm ngặt — vd tên phải viết thế nào, ngày và số lượng đọc thế nào, sai lệch nhỏ nào có thể chấp nhận so với sai biệt thực sự. Ngân hàng kiểm tra chứng từ trên bề mặt, đối chiếu chéo giữa các chứng từ VÀ với L/C — dữ liệu không được mâu thuẫn giữa các chứng từ.</p>
<h3>Sai biệt (discrepancy)</h3>
<pre><code>Chứng từ xuất trình -&gt; NH kiểm tra trong 5 ngày làm việc NH (UCP 600)
   hợp lệ    -&gt; NH thanh toán / ký nhận
   sai biệt  -&gt; NH có thể từ chối, phải thông báo người TH kèm lý do,
                một lần duy nhất, liệt kê TẤT CẢ sai biệt (không thông báo nhỏ giọt)
</code></pre>
<p>Sai biệt thường gặp: giao hàng/xuất trình chậm, số tiền hóa đơn vượt giá trị L/C, mô tả hàng hóa không nhất quán giữa các chứng từ, thiếu ký/ký hậu, thiếu hoặc sai giấy chứng nhận. Bộ chứng từ có sai biệt không tự động chấm hết việc thanh toán — người yêu cầu có thể miễn trừ sai biệt, hoặc người thụ hưởng có thể sửa và xuất trình lại trong thời hạn hiệu lực L/C.</p>
<div class="callout"><span class="badge">Giấy tờ, không phải hàng hóa</span> Ngân hàng đang kiểm GIẤY với GIẤY — một lô hàng hoàn hảo với bộ chứng từ lỗi vẫn có thể bị từ chối; bộ chứng từ hoàn hảo mới là thứ thực sự được trả tiền.</div>`,
  ]]);

const c7q = quiz('iip301-quiz-7', 'Quiz 7 — Documents & ISBP|||Quiz 7 — Chứng từ & ISBP', [
  { id: 'q1', question: 'Chứng từ nào được coi là chứng từ sở hữu hàng hóa, dùng để nhận hàng?', options: ['Hóa đơn thương mại', 'Phiếu đóng gói', 'Vận đơn (B/L)', 'Giấy chứng nhận xuất xứ'], correctIndex: 2, explanation: 'B/L là chứng từ sở hữu hàng hóa; phải xuất trình để nhận hàng tại nơi đến.' },
  { id: 'q2', question: 'ISBP 745 có vai trò gì so với UCP 600?', options: ['Thay thế hoàn toàn UCP 600', 'Bổ sung hướng dẫn thực tế, chi tiết về cách áp dụng tuân thủ nghiêm ngặt', 'Chỉ áp dụng cho nhờ thu, không áp dụng cho L/C', 'Quy định thuế quan'], correctIndex: 1, explanation: 'ISBP bổ sung cho UCP 600 bằng hướng dẫn thực hành cụ thể khi kiểm tra chứng từ.' },
  { id: 'q3', question: 'Khi phát hiện sai biệt trong bộ chứng từ, ngân hàng phải thông báo như thế nào?', options: ['Thông báo từng sai biệt một, nhiều lần', 'Một lần duy nhất, liệt kê tất cả sai biệt', 'Không cần thông báo, chỉ cần từ chối', 'Chỉ thông báo cho ngân hàng phát hành, không cho người thụ hưởng'], correctIndex: 1, explanation: 'UCP 600 yêu cầu ngân hàng thông báo từ chối một lần, nêu đầy đủ tất cả sai biệt.' },
]);

const c8 = doc('iip301-8-1-risks-vietnam', '8.1 — Risks in international payment & Vietnam practice|||8.1 — Rủi ro trong thanh toán quốc tế & thực tiễn Việt Nam',
  'Các loại rủi ro (tỷ giá, tín dụng/đối tác, quốc gia-chính trị, chứng từ, gian lận, vận hành); quản lý FX của Ngân hàng Nhà nước, thực tiễn L/C tại các ngân hàng thương mại Việt Nam.',
  [[
    `<span class="eyebrow">IIP301 · Chapter 8 · Lesson 8.1</span>
<h2>Risks in international payment &amp; Vietnam practice</h2>
<h3>Types of risk</h3>
<ul>
<li><strong>Exchange-rate risk</strong> — the value of a foreign-currency receivable/payable changes between contract signing and settlement; hedged with forward contracts or by pricing in a stable currency.</li>
<li><strong>Credit/counterparty risk</strong> — the other party (or its bank) becomes unable or unwilling to pay/perform; mitigated by choosing a payment method that shifts risk appropriately (L/C &gt; collection &gt; open-account T/T for the exporter).</li>
<li><strong>Country/political risk</strong> — capital controls, sanctions, war, or a banking-sector freeze in the counterparty's country can block payment even when both trading parties are willing.</li>
<li><strong>Documentary risk</strong> — a compliant-looking shipment can still fail to get paid because of a paperwork discrepancy (see 7.1).</li>
<li><strong>Fraud risk</strong> — forged documents, fake B/Ls, or a fraudulent L/C text; independence principle means banks pay on paper, so fraud that fools the paper can still get paid.</li>
<li><strong>Operational risk</strong> — SWIFT message errors, wrong account details, processing delays.</li>
</ul>
<h3>Vietnam practice</h3>
<p>Foreign-exchange transactions in Vietnam are supervised by the <strong>State Bank of Vietnam (Ngân hàng Nhà nước — SBV)</strong>, which regulates FX trading, current-account convertibility, and reporting for cross-border payments. Major commercial banks (<strong>Vietcombank, BIDV, VietinBank, Techcombank</strong>, and others) act as issuing/advising/collecting banks for Vietnamese importers and exporters, most of them with correspondent relationships covering the main trading currencies (USD, EUR, JPY, CNY).</p>
<p>In practice, L/C remains the dominant method for larger or first-time Vietnamese trade deals (the bank's undertaking substitutes for limited mutual trust), while T/T dominates smaller or repeat-buyer transactions where both sides already have a track record — and collection (D/P/D/A) sits in between, common with established but not fully trusted trading partners.</p>
<div class="callout"><span class="badge">Choosing a method is choosing a risk profile</span> There is no universally "best" method — an exporter shipping to a new, unknown buyer in a high-risk country should insist on a confirmed L/C; the same exporter shipping to a long-time repeat customer may happily accept open-account T/T.</div>`,
    `<span class="eyebrow">IIP301 · Chương 8 · Bài 8.1</span>
<h2>Rủi ro trong thanh toán quốc tế &amp; thực tiễn Việt Nam</h2>
<h3>Các loại rủi ro</h3>
<ul>
<li><strong>Rủi ro tỷ giá</strong> — giá trị khoản phải thu/phải trả bằng ngoại tệ thay đổi giữa lúc ký hợp đồng và lúc thanh toán; phòng ngừa bằng hợp đồng kỳ hạn hoặc định giá theo đồng tiền ổn định.</li>
<li><strong>Rủi ro tín dụng/đối tác</strong> — bên kia (hoặc ngân hàng của họ) không thể hoặc không muốn trả tiền/thực hiện nghĩa vụ; giảm nhẹ bằng cách chọn phương thức thanh toán phân bổ rủi ro phù hợp (L/C &gt; nhờ thu &gt; T/T ghi sổ, xét theo phía nhà xuất khẩu).</li>
<li><strong>Rủi ro quốc gia-chính trị</strong> — kiểm soát vốn, cấm vận, chiến tranh, hoặc đóng băng hệ thống ngân hàng ở nước đối tác có thể chặn thanh toán dù cả hai bên đều muốn giao dịch.</li>
<li><strong>Rủi ro chứng từ</strong> — một lô hàng có vẻ hợp lệ vẫn có thể không được trả tiền vì sai biệt chứng từ (xem bài 7.1).</li>
<li><strong>Rủi ro gian lận</strong> — chứng từ giả, B/L giả, hoặc L/C giả mạo; vì nguyên tắc độc lập nên ngân hàng trả tiền dựa trên giấy tờ, nên gian lận qua mặt được giấy tờ vẫn có thể được trả.</li>
<li><strong>Rủi ro vận hành</strong> — sai điện SWIFT, sai thông tin tài khoản, chậm xử lý.</li>
</ul>
<h3>Thực tiễn Việt Nam</h3>
<p>Các giao dịch ngoại hối tại Việt Nam do <strong>Ngân hàng Nhà nước Việt Nam (NHNN)</strong> giám sát, quản lý giao dịch ngoại hối, khả năng chuyển đổi tài khoản vãng lai, và báo cáo cho thanh toán xuyên biên giới. Các ngân hàng thương mại lớn (<strong>Vietcombank, BIDV, VietinBank, Techcombank</strong>, và các ngân hàng khác) đóng vai trò ngân hàng phát hành/thông báo/thu hộ cho nhà nhập khẩu và xuất khẩu Việt Nam, hầu hết có quan hệ đại lý phủ các đồng tiền giao dịch chính (USD, EUR, JPY, CNY).</p>
<p>Trong thực tế, L/C vẫn là phương thức chủ đạo cho các giao dịch lớn hoặc lần đầu của doanh nghiệp Việt Nam (cam kết của ngân hàng thay cho niềm tin song phương còn hạn chế), trong khi T/T chiếm ưu thế ở các giao dịch nhỏ hơn hoặc với khách hàng lặp lại đã có lịch sử giao dịch — còn nhờ thu (D/P/D/A) nằm ở giữa, phổ biến với đối tác đã quen biết nhưng chưa hoàn toàn tin tưởng.</p>
<div class="callout"><span class="badge">Chọn phương thức là chọn hồ sơ rủi ro</span> Không có phương thức "tốt nhất" tuyệt đối — nhà xuất khẩu giao hàng cho người mua mới, chưa quen, ở nước rủi ro cao nên yêu cầu L/C có xác nhận; cùng nhà xuất khẩu đó giao cho khách quen lâu năm có thể chấp nhận T/T ghi sổ.</div>`,
  ]]);

const c8q = quiz('iip301-quiz-8', 'Quiz 8 — Risks & Vietnam practice|||Quiz 8 — Rủi ro & thực tiễn Việt Nam', [
  { id: 'q1', question: 'Vì sao gian lận (chứng từ giả) vẫn có thể được ngân hàng trả tiền theo L/C?', options: ['Vì ngân hàng luôn kiểm tra hàng hóa thực tế', 'Vì nguyên tắc độc lập khiến ngân hàng chỉ trả tiền dựa trên chứng từ trên bề mặt', 'Vì UCP 600 không áp dụng cho gian lận', 'Vì ngân hàng phát hành không chịu trách nhiệm pháp lý'], correctIndex: 1, explanation: 'Nguyên tắc độc lập + kiểm tra bề mặt chứng từ nghĩa là gian lận qua mặt được giấy tờ vẫn có thể được thanh toán.' },
  { id: 'q2', question: 'Cơ quan nào giám sát giao dịch ngoại hối tại Việt Nam?', options: ['Bộ Tài chính', 'Ngân hàng Nhà nước Việt Nam (NHNN)', 'Tổng cục Hải quan', 'Ủy ban Chứng khoán Nhà nước'], correctIndex: 1, explanation: 'NHNN quản lý và giám sát các giao dịch ngoại hối, bao gồm thanh toán xuyên biên giới.' },
  { id: 'q3', question: 'Vì sao nhà xuất khẩu giao hàng cho khách mới, chưa quen, ở nước rủi ro cao nên chọn L/C có xác nhận?', options: ['Vì L/C xác nhận rẻ hơn T/T', 'Vì có thêm cam kết trả tiền của ngân hàng xác nhận, giảm rủi ro đối tác và rủi ro quốc gia', 'Vì L/C xác nhận không cần kiểm tra chứng từ', 'Vì luật bắt buộc dùng L/C cho mọi giao dịch mới'], correctIndex: 1, explanation: 'Ngân hàng xác nhận thêm một cam kết trả tiền độc lập, giúp giảm rủi ro tín dụng/đối tác và rủi ro quốc gia khi giao dịch với khách hàng/nước chưa quen.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'IIP301',
    slug: 'iip301-international-payment',
    title: 'International Payment',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IIP301.webp',
    shortDescription: 'International payment methods in cross-border trade: remittance (T/T), collection (D/P/D/A, URC 522), documentary credit (L/C, UCP 600) and its special forms, document examination (ISBP), and payment risks in Vietnamese banking practice.|||Các phương thức thanh toán quốc tế trong thương mại: chuyển tiền (T/T), nhờ thu (D/P/D/A, URC 522), tín dụng chứng từ (L/C, UCP 600) và các loại đặc biệt, kiểm tra chứng từ (ISBP), rủi ro trong thực tiễn ngân hàng Việt Nam.',
    description: 'Môn <strong>IIP301 — International Payment</strong> (khối Quản trị Kinh doanh, kỳ 4) giúp hiểu <strong>các bên và phương thức thanh toán quốc tế</strong>. Từ <strong>tổng quan &amp; vai trò ngân hàng</strong> (ngân hàng đại lý, SWIFT) → <strong>phương tiện thanh toán</strong> (hối phiếu, séc, kỳ phiếu) → <strong>chuyển tiền (T/T)</strong> → <strong>nhờ thu</strong> (D/P, D/A, URC 522) → <strong>tín dụng chứng từ (L/C, UCP 600)</strong> → <strong>L/C đặc biệt</strong> (chuyển nhượng, giáp lưng, tuần hoàn) → <strong>bộ chứng từ &amp; ISBP</strong> → <strong>rủi ro &amp; thực tiễn Việt Nam</strong>. Bám giáo trình FLM &amp; quy tắc ICC, song ngữ, có sơ đồ quy trình, ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Vai trò ngân hàng đại lý & SWIFT trong thanh toán quốc tế; hối phiếu, séc, kỳ phiếu; chuyển tiền T/T (trả trước vs trả sau); nhờ thu D/P & D/A theo URC 522; tín dụng chứng từ L/C & nguyên tắc UCP 600 (độc lập, tuân thủ nghiêm ngặt); L/C chuyển nhượng, giáp lưng, tuần hoàn, standby; bộ chứng từ (invoice, B/L, C/O...) & kiểm tra theo ISBP; rủi ro tỷ giá/tín dụng/quốc gia/gian lận; thực tiễn ngân hàng thương mại Việt Nam.',
    requirements: 'Kiến thức cơ bản về thương mại quốc tế/ngoại thương (điều kiện Incoterms là một lợi thế, không bắt buộc). Không yêu cầu kiến thức ngân hàng trước đó.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Quy tắc ICC (UCP 600, URC 522, ISBP), sách, tài liệu chính thức, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thanh toán quốc tế, vai trò ngân hàng, lộ trình môn học.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & vai trò ngân hàng|||Chapter 1 — Overview & role of banks', description: 'Các bên tham gia, ngân hàng đại lý, SWIFT.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phương tiện thanh toán|||Chapter 2 — Payment instruments', description: 'Hối phiếu, séc, kỳ phiếu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chuyển tiền (T/T)|||Chapter 3 — Remittance (T/T)', description: 'T/T trả trước vs trả sau, SWIFT MT103.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Nhờ thu (D/P, D/A, URC 522)|||Chapter 4 — Collection (D/P, D/A, URC 522)', description: 'Các bên, D/P vs D/A, URC 522.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tín dụng chứng từ (L/C) & UCP 600|||Chapter 5 — Documentary credit (L/C) & UCP 600', description: 'Các bên, nguyên tắc độc lập & tuân thủ nghiêm ngặt.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Các loại L/C đặc biệt|||Chapter 6 — Special types of L/C', description: 'Chuyển nhượng, giáp lưng, tuần hoàn, standby.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bộ chứng từ & kiểm tra chứng từ (ISBP)|||Chapter 7 — Document set & examination (ISBP)', description: 'Bộ chứng từ điển hình, ISBP 745, sai biệt.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Rủi ro & thực tiễn Việt Nam|||Chapter 8 — Risks & Vietnam practice', description: 'Các loại rủi ro, thực tiễn ngân hàng Việt Nam.', lessons: [c8, c8q] },
  ],
};
