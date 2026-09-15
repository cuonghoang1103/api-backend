/**
 * GLI202 — International Trade (Thương mại quốc tế). Giáo trình FLM (syl):
 * lý thuyết thương mại & lợi thế so sánh, chính sách thương mại, định chế/
 * hiệp định (WTO/FTA/CPTPP/EVFTA), quy trình & chứng từ XNK, Incoterms 2020,
 * thanh toán quốc tế (L/C, UCP 600), vận tải & bảo hiểm, rủi ro & tranh chấp.
 * Tham khảo: Krugman/Obstfeld "International Economics"; Feenstra/Taylor
 * "International Trade"; Incoterms 2020 (ICC); UCP 600 (ICC) — trích dẫn,
 * KHÔNG upload PDF. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick lồng/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('gli202-0-0-materials', 'Course materials & references|||Tài liệu & nguồn tham khảo',
  'Giáo trình FLM, sách tham khảo (Krugman/Obstfeld, Feenstra/Taylor), Incoterms 2020, UCP 600, nguồn miễn phí.',
  [[
    `<span class="eyebrow">GLI202 · Course materials</span>
<h2>Reference hub — International Trade</h2>
<p class="lead">Everything to study <strong>International Trade</strong> — theory, policy, institutions, documents, payments, transport and risk — in one place. The official FPTU syllabus &amp; slides are on <strong>FLM</strong>; below are free, legitimate references used to build these lessons.</p>
<h3>Textbooks (as cited in FLM syllabus)</h3>
<ul>
<li><em>International Economics: Theory &amp; Policy</em> — Paul Krugman, Maurice Obstfeld (trade theory: comparative advantage, tariffs, trade policy).</li>
<li><em>International Trade</em> — Robert Feenstra, Alan Taylor (modern trade theory &amp; empirics).</li>
</ul>
<h3>Official rulebooks (ICC)</h3>
<ul>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/" target="_blank" rel="noopener">Incoterms 2020</a> — the 11 official trade terms defining who pays &amp; who bears risk, where.</li>
<li><a href="https://iccwbo.org/business-solutions/trade-finance/rules/" target="_blank" rel="noopener">UCP 600</a> — Uniform Customs and Practice for Documentary Credits, the rulebook banks use for Letters of Credit.</li>
</ul>
<h3>Free / official resources</h3>
<ul>
<li><a href="https://www.wto.org/english/thewto_e/whatis_e/tif_e/tif_e.htm" target="_blank" rel="noopener">WTO — Trade topics</a> — official explainers on tariffs, FTAs, dispute settlement.</li>
<li><a href="https://trungtamwto.vn/" target="_blank" rel="noopener">Trung tâm WTO (VCCI)</a> — CPTPP, EVFTA and Vietnam's FTA texts &amp; guides in Vietnamese.</li>
<li><a href="https://www.customs.gov.vn/" target="_blank" rel="noopener">Tổng cục Hải quan Việt Nam</a> — customs procedures &amp; forms.</li>
</ul>
<h3>Tools</h3>
<ul>
<li><a href="https://www.trademap.org/" target="_blank" rel="noopener">Trade Map (ITC)</a> — explore real trade-flow statistics by country/product.</li>
</ul>
<div class="callout"><span class="badge">Study path</span>
<ol>
<li><strong>Core theory</strong> — comparative advantage, trade policy tools, WTO/FTA framework.</li>
<li><strong>Documents &amp; practice</strong> — export-import procedure, Incoterms 2020, key trade documents.</li>
<li><strong>Money &amp; movement</strong> — international payment methods (UCP 600), transport &amp; cargo insurance.</li>
<li><strong>Exam-ready</strong> — risk &amp; dispute scenarios, Vietnam's own trade practice (WTO member since 2007, CPTPP/EVFTA).</li>
</ol></div>`,
    `<span class="eyebrow">GLI202 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo — Thương mại quốc tế</h2>
<p class="lead">Mọi thứ để học <strong>Thương mại quốc tế</strong> — lý thuyết, chính sách, định chế, chứng từ, thanh toán, vận tải và rủi ro — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn tham khảo miễn phí, hợp pháp dùng để dựng các bài học này.</p>
<h3>Giáo trình (theo syllabus FLM)</h3>
<ul>
<li><em>International Economics: Theory &amp; Policy</em> — Paul Krugman, Maurice Obstfeld (lý thuyết thương mại: lợi thế so sánh, thuế quan, chính sách thương mại).</li>
<li><em>International Trade</em> — Robert Feenstra, Alan Taylor (lý thuyết &amp; thực chứng thương mại hiện đại).</li>
</ul>
<h3>Bộ quy tắc chính thức (ICC)</h3>
<ul>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/" target="_blank" rel="noopener">Incoterms 2020</a> — 11 điều kiện thương mại chính thức, quy định ai trả tiền &amp; ai chịu rủi ro, tại đâu.</li>
<li><a href="https://iccwbo.org/business-solutions/trade-finance/rules/" target="_blank" rel="noopener">UCP 600</a> — Quy tắc thực hành thống nhất về tín dụng chứng từ, bộ luật ngân hàng dùng cho L/C.</li>
</ul>
<h3>Nguồn miễn phí / chính thức</h3>
<ul>
<li><a href="https://www.wto.org/english/thewto_e/whatis_e/tif_e/tif_e.htm" target="_blank" rel="noopener">WTO — Trade topics</a> — giải thích chính thức về thuế quan, FTA, giải quyết tranh chấp.</li>
<li><a href="https://trungtamwto.vn/" target="_blank" rel="noopener">Trung tâm WTO (VCCI)</a> — văn bản &amp; hướng dẫn CPTPP, EVFTA và các FTA của Việt Nam bằng tiếng Việt.</li>
<li><a href="https://www.customs.gov.vn/" target="_blank" rel="noopener">Tổng cục Hải quan Việt Nam</a> — quy trình &amp; mẫu chứng từ hải quan.</li>
</ul>
<h3>Công cụ</h3>
<ul>
<li><a href="https://www.trademap.org/" target="_blank" rel="noopener">Trade Map (ITC)</a> — tra số liệu dòng chảy thương mại thật theo quốc gia/mặt hàng.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Lý thuyết nền</strong> — lợi thế so sánh, công cụ chính sách thương mại, khung WTO/FTA.</li>
<li><strong>Chứng từ &amp; thực hành</strong> — quy trình xuất nhập khẩu, Incoterms 2020, các chứng từ chính.</li>
<li><strong>Tiền &amp; vận chuyển</strong> — phương thức thanh toán quốc tế (UCP 600), vận tải &amp; bảo hiểm hàng hoá.</li>
<li><strong>Sẵn sàng thi</strong> — tình huống rủi ro &amp; tranh chấp, thực tiễn thương mại Việt Nam (thành viên WTO từ 2007, CPTPP/EVFTA).</li>
</ol></div>`,
  ]]);

const intro = doc('gli202-0-1-overview', 'Course overview: International Trade|||Tổng quan môn: Thương mại quốc tế',
  'Vì sao các nước giao thương; lộ trình môn: lý thuyết → chính sách → định chế → quy trình/chứng từ → Incoterms → thanh toán → vận tải/bảo hiểm → rủi ro.',
  [[
    `<span class="eyebrow">GLI202 · Lesson 0.1 · Overview</span>
<h2>International Trade</h2>
<p class="lead">This course explains <strong>why countries trade</strong>, <strong>how governments intervene</strong> in trade, and <strong>how an actual export-import deal is carried out</strong> — from theory to the documents, payment methods and shipping terms real businesses use.</p>
<h3>The big question</h3>
<p>If a country can produce everything itself, why trade at all? The answer — <strong>comparative advantage</strong> — is the single most important idea in this course, and it explains why even a country that is worse at producing everything still gains from trade.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Ch.1</strong> Trade theory &amp; comparative advantage — why trade happens.</li>
<li><strong>Ch.2</strong> Trade policy — tariffs, quotas, protectionism — how governments shape it.</li>
<li><strong>Ch.3</strong> Institutions &amp; agreements — WTO, FTA, CPTPP, EVFTA — the rules of the game.</li>
<li><strong>Ch.4</strong> Export-import procedure &amp; documents — how a shipment actually moves.</li>
<li><strong>Ch.5</strong> Incoterms 2020 — who pays &amp; who bears risk, and where.</li>
<li><strong>Ch.6</strong> International payment — L/C, T/T, D/P, UCP 600 — how the seller gets paid.</li>
<li><strong>Ch.7</strong> Transport &amp; insurance — moving goods safely across borders.</li>
<li><strong>Ch.8</strong> Risk, disputes &amp; Vietnam's trade practice — what can go wrong, and how Vietnam trades today.</li>
</ul>
<p>Bilingual throughout, with worked examples, quizzes and real trade documents/clauses referenced by name (Incoterms 2020, UCP 600).</p>`,
    `<span class="eyebrow">GLI202 · Bài 0.1 · Tổng quan</span>
<h2>Thương mại quốc tế</h2>
<p class="lead">Môn này giải thích <strong>vì sao các nước giao thương</strong>, <strong>chính phủ can thiệp vào thương mại thế nào</strong>, và <strong>một giao dịch xuất nhập khẩu thật diễn ra ra sao</strong> — từ lý thuyết đến chứng từ, phương thức thanh toán và điều kiện giao hàng mà doanh nghiệp thực tế dùng.</p>
<h3>Câu hỏi lớn</h3>
<p>Nếu một nước có thể tự sản xuất mọi thứ, vậy tại sao vẫn giao thương? Câu trả lời — <strong>lợi thế so sánh</strong> — là ý tưởng quan trọng nhất của môn này, và nó giải thích vì sao ngay cả một nước kém hơn ở MỌI mặt hàng vẫn có lợi khi giao thương.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Ch.1</strong> Lý thuyết thương mại &amp; lợi thế so sánh — vì sao thương mại xảy ra.</li>
<li><strong>Ch.2</strong> Chính sách thương mại — thuế quan, hạn ngạch, bảo hộ — chính phủ định hình thương mại thế nào.</li>
<li><strong>Ch.3</strong> Định chế &amp; hiệp định — WTO, FTA, CPTPP, EVFTA — luật chơi chung.</li>
<li><strong>Ch.4</strong> Quy trình &amp; chứng từ xuất nhập khẩu — một lô hàng thực sự di chuyển thế nào.</li>
<li><strong>Ch.5</strong> Incoterms 2020 — ai trả tiền &amp; ai chịu rủi ro, tại đâu.</li>
<li><strong>Ch.6</strong> Thanh toán quốc tế — L/C, T/T, D/P, UCP 600 — người bán nhận tiền thế nào.</li>
<li><strong>Ch.7</strong> Vận tải &amp; bảo hiểm — chuyển hàng an toàn qua biên giới.</li>
<li><strong>Ch.8</strong> Rủi ro, tranh chấp &amp; thương mại Việt Nam — điều gì có thể sai, và Việt Nam giao thương thế nào hôm nay.</li>
</ul>
<p>Song ngữ toàn bộ, có ví dụ tính toán, quiz và trích dẫn đúng tên chứng từ/điều khoản thật (Incoterms 2020, UCP 600).</p>`,
  ]]);

const c1 = doc('gli202-1-1-trade-theory', '1.1 — Trade theory & comparative advantage|||1.1 — Lý thuyết thương mại & lợi thế so sánh',
  'Lợi thế tuyệt đối (Adam Smith) vs lợi thế so sánh (David Ricardo); lợi ích từ thương mại; ví dụ số 2 nước 2 hàng hoá.',
  [[
    `<span class="eyebrow">GLI202 · Chapter 1 · Lesson 1.1</span>
<h2>Trade theory &amp; comparative advantage</h2>
<h3>Absolute vs comparative advantage</h3>
<ul>
<li><strong>Absolute advantage (Adam Smith)</strong> — a country can produce a good using fewer resources (more efficiently) than another country.</li>
<li><strong>Comparative advantage (David Ricardo)</strong> — a country should specialize in the good where its <strong>opportunity cost</strong> is lowest, even if it has no absolute advantage in anything. This is the theory used throughout this course (Krugman/Obstfeld, ch. on Ricardian trade).</li>
</ul>
<h3>Worked example</h3>
<pre><code>Hours needed to produce 1 unit:
            Cloth   Wine
 Country A:   2       3
 Country B:   4       2

Opportunity cost of Cloth: A = 2/3 wine, B = 4/2 = 2 wine
 -> A has LOWER opportunity cost in Cloth -> A specializes in Cloth
 -> B has LOWER opportunity cost in Wine  -> B specializes in Wine
Both countries gain by trading, even though B may be slower at everything.
</code></pre>
<h3>Gains from trade</h3>
<p>Specialization + trade lets both countries consume <strong>more of both goods</strong> than they could in isolation (autarky) — the "gains from trade". This is the theoretical foundation for every trade-policy debate in this course.</p>
<div class="callout"><span class="badge">Exam tip</span> "Comparative advantage" is about <strong>relative</strong> opportunity cost, not who is absolutely better. A country with no absolute advantage in anything still has a comparative advantage in something.</div>`,
    `<span class="eyebrow">GLI202 · Chương 1 · Bài 1.1</span>
<h2>Lý thuyết thương mại &amp; lợi thế so sánh</h2>
<h3>Lợi thế tuyệt đối vs lợi thế so sánh</h3>
<ul>
<li><strong>Lợi thế tuyệt đối (Adam Smith)</strong> — một nước sản xuất một mặt hàng dùng ÍT nguồn lực hơn (hiệu quả hơn) nước khác.</li>
<li><strong>Lợi thế so sánh (David Ricardo)</strong> — một nước nên chuyên môn hoá vào mặt hàng có <strong>chi phí cơ hội</strong> THẤP NHẤT, dù không có lợi thế tuyệt đối ở bất kỳ mặt hàng nào. Đây là lý thuyết dùng suốt môn này (Krugman/Obstfeld, chương thương mại Ricardo).</li>
</ul>
<h3>Ví dụ tính toán</h3>
<pre><code>Số giờ để sản xuất 1 đơn vị:
            Vải     Rượu
 Nước A:      2       3
 Nước B:      4       2

Chi phí cơ hội của Vải: A = 2/3 rượu, B = 4/2 = 2 rượu
 -> A có chi phí cơ hội THẤP HƠN ở Vải -> A chuyên môn hoá Vải
 -> B có chi phí cơ hội THẤP HƠN ở Rượu -> B chuyên môn hoá Rượu
Cả hai nước đều có lợi khi giao thương, dù B có thể chậm hơn ở mọi mặt hàng.
</code></pre>
<h3>Lợi ích từ thương mại</h3>
<p>Chuyên môn hoá + giao thương giúp cả hai nước tiêu dùng <strong>nhiều hơn cả hai mặt hàng</strong> so với khi tự cung tự cấp (autarky) — "lợi ích từ thương mại". Đây là nền lý thuyết cho mọi tranh luận chính sách thương mại trong môn này.</p>
<div class="callout"><span class="badge">Mẹo thi</span> "Lợi thế so sánh" nói về chi phí cơ hội <strong>TƯƠNG ĐỐI</strong>, không phải ai giỏi tuyệt đối hơn. Một nước không có lợi thế tuyệt đối ở đâu vẫn có lợi thế so sánh ở một mặt hàng nào đó.</div>`,
  ]]);

const c1q = quiz('gli202-quiz-1', 'Quiz 1 — Trade theory|||Quiz 1 — Lý thuyết thương mại', [
  { id: 'q1', question: 'Lý thuyết lợi thế so sánh (comparative advantage) là của ai?', options: ['Adam Smith', 'David Ricardo', 'Karl Marx', 'John Maynard Keynes'], correctIndex: 1, explanation: 'David Ricardo đề xuất lý thuyết lợi thế so sánh dựa trên chi phí cơ hội tương đối.' },
  { id: 'q2', question: 'Một nước NÊN chuyên môn hoá vào mặt hàng nào theo lý thuyết lợi thế so sánh?', options: ['Mặt hàng nước đó sản xuất tuyệt đối tốt nhất', 'Mặt hàng có chi phí cơ hội thấp nhất so với nước khác', 'Mặt hàng có giá bán cao nhất', 'Mặt hàng cần ít vốn đầu tư nhất'], correctIndex: 1, explanation: 'Lợi thế so sánh dựa trên chi phí cơ hội TƯƠNG ĐỐI, không phải năng lực tuyệt đối hay giá bán.' },
  { id: 'q3', question: 'Vì sao một nước KHÔNG có lợi thế tuyệt đối ở bất kỳ mặt hàng nào vẫn có lợi khi giao thương?', options: ['Vì nước đó luôn được trợ giá', 'Vì nước đó vẫn có lợi thế so sánh ở mặt hàng có chi phí cơ hội thấp hơn tương đối', 'Vì tỷ giá luôn có lợi cho nước yếu hơn', 'Vì WTO bắt buộc các nước khác phải mua hàng'], correctIndex: 1, explanation: 'Lợi thế so sánh là tương đối giữa các mặt hàng trong CHÍNH nước đó, nên luôn tồn tại một mặt hàng có chi phí cơ hội thấp hơn.' },
]);

const c2 = doc('gli202-2-1-trade-policy', '2.1 — Trade policy: tariffs, quotas & protectionism|||2.1 — Chính sách thương mại: thuế quan, hạn ngạch & bảo hộ',
  'Thuế quan (ad valorem/tuyệt đối), hạn ngạch nhập khẩu, trợ cấp xuất khẩu, hàng rào phi thuế quan; ai được/mất.',
  [[
    `<span class="eyebrow">GLI202 · Chapter 2 · Lesson 2.1</span>
<h2>Trade policy: tariffs, quotas &amp; protectionism</h2>
<h3>Tariffs (thuế quan)</h3>
<ul>
<li><strong>Ad valorem tariff</strong> — a percentage of the good's value (e.g. 10% of import value).</li>
<li><strong>Specific tariff</strong> — a fixed amount per unit (e.g. a fixed fee per tonne), regardless of price.</li>
<li>Effect: raises the domestic price of the imported good -> protects domestic producers, but hurts domestic consumers and reduces overall trade volume.</li>
</ul>
<h3>Quotas &amp; other tools</h3>
<ul>
<li><strong>Import quota</strong> — a hard limit on the physical QUANTITY that can be imported, regardless of price. Unlike a tariff, the government collects no revenue (unless quota licenses are auctioned).</li>
<li><strong>Export subsidy</strong> — government payment to exporters, making their goods cheaper abroad — often challenged at the WTO as unfair.</li>
<li><strong>Non-tariff barriers (NTBs)</strong> — technical standards, sanitary/phytosanitary rules, licensing requirements — restrict trade without a tariff or quota.</li>
</ul>
<h3>Who wins, who loses</h3>
<pre><code>Protectionist tool -> domestic producers WIN (higher price/less competition)
                   -> domestic consumers LOSE (higher price/less choice)
                   -> foreign exporters LOSE (smaller market)
Net effect on the protecting country's total welfare is usually NEGATIVE
(the loss to consumers outweighs the gain to producers + government revenue).
</code></pre>
<div class="callout"><span class="badge">Why protect anyway?</span> Common justifications: protecting infant industries, national security, jobs in politically sensitive sectors, retaliation against another country's barriers.</div>`,
    `<span class="eyebrow">GLI202 · Chương 2 · Bài 2.1</span>
<h2>Chính sách thương mại: thuế quan, hạn ngạch &amp; bảo hộ</h2>
<h3>Thuế quan (tariff)</h3>
<ul>
<li><strong>Thuế theo giá trị (ad valorem)</strong> — một tỷ lệ % trên giá trị hàng nhập (vd 10% giá trị nhập khẩu).</li>
<li><strong>Thuế tuyệt đối (specific)</strong> — một khoản cố định trên mỗi đơn vị (vd một mức phí cố định trên mỗi tấn), không phụ thuộc giá.</li>
<li>Tác động: đẩy giá trong nước của hàng nhập lên -> bảo vệ nhà sản xuất trong nước, nhưng gây hại người tiêu dùng trong nước và giảm tổng khối lượng thương mại.</li>
</ul>
<h3>Hạn ngạch &amp; công cụ khác</h3>
<ul>
<li><strong>Hạn ngạch nhập khẩu (quota)</strong> — giới hạn cứng về SỐ LƯỢNG vật lý được nhập, bất kể giá. Khác thuế quan, chính phủ không thu được ngân sách (trừ khi đấu giá hạn ngạch).</li>
<li><strong>Trợ cấp xuất khẩu</strong> — chính phủ trả tiền cho nhà xuất khẩu, làm hàng của họ rẻ hơn ở nước ngoài — thường bị WTO coi là cạnh tranh không công bằng.</li>
<li><strong>Hàng rào phi thuế quan (NTB)</strong> — tiêu chuẩn kỹ thuật, quy định vệ sinh dịch tễ, yêu cầu cấp phép — hạn chế thương mại mà không cần thuế hay hạn ngạch.</li>
</ul>
<h3>Ai được, ai mất</h3>
<pre><code>Công cụ bảo hộ -> nhà sản xuất trong nước ĐƯỢC (giá cao hơn/ít cạnh tranh hơn)
              -> người tiêu dùng trong nước MẤT (giá cao hơn/ít lựa chọn)
              -> nhà xuất khẩu nước ngoài MẤT (thị trường nhỏ lại)
Tác động thuần lên tổng phúc lợi của nước bảo hộ thường là ÂM
(thiệt hại của người tiêu dùng lớn hơn lợi ích của nhà sản xuất + ngân sách).
</code></pre>
<div class="callout"><span class="badge">Vậy sao vẫn bảo hộ?</span> Các lý do thường gặp: bảo vệ ngành công nghiệp non trẻ, an ninh quốc gia, việc làm ở ngành nhạy cảm chính trị, trả đũa hàng rào của nước khác.</div>`,
  ]]);

const c2q = quiz('gli202-quiz-2', 'Quiz 2 — Trade policy|||Quiz 2 — Chính sách thương mại', [
  { id: 'q1', question: 'Thuế quan "ad valorem" được tính theo?', options: ['Một khoản cố định trên mỗi đơn vị', 'Một tỷ lệ % trên giá trị hàng hoá', 'Số lượng hàng nhập tối đa', 'Chi phí vận chuyển thực tế'], correctIndex: 1, explanation: 'Ad valorem = theo giá trị, tức % trên giá trị hàng nhập; thuế tuyệt đối mới là khoản cố định/đơn vị.' },
  { id: 'q2', question: 'Khác biệt chính giữa hạn ngạch (quota) và thuế quan (tariff) là gì?', options: ['Hạn ngạch luôn rẻ hơn thuế quan', 'Hạn ngạch giới hạn số lượng, thuế quan đánh vào giá và có thể mang lại ngân sách cho chính phủ', 'Thuế quan chỉ áp cho hàng xuất khẩu', 'Hạn ngạch không ảnh hưởng đến giá trong nước'], correctIndex: 1, explanation: 'Quota giới hạn số lượng vật lý và thường không tạo ngân sách; tariff đánh vào giá và chính phủ thu được thuế.' },
  { id: 'q3', question: 'Tác động thuần (net welfare) của chính sách bảo hộ lên nước áp dụng thường là gì?', options: ['Luôn dương vì bảo vệ được sản xuất trong nước', 'Thường âm vì thiệt hại người tiêu dùng lớn hơn lợi ích nhà sản xuất + ngân sách', 'Không đổi vì chỉ chuyển tiền trong nội bộ nền kinh tế', 'Luôn tăng GDP vì hạn chế nhập khẩu'], correctIndex: 1, explanation: 'Về lý thuyết, tổn thất phúc lợi của người tiêu dùng thường vượt lợi ích của nhà sản xuất và ngân sách nhà nước.' },
]);

const c3 = doc('gli202-3-1-institutions-agreements', '3.1 — Institutions & agreements: WTO, FTA, CPTPP, EVFTA|||3.1 — Định chế & hiệp định: WTO, FTA, CPTPP, EVFTA',
  'Nguyên tắc WTO (MFN, đối xử quốc gia), các loại FTA, CPTPP & EVFTA với Việt Nam.',
  [[
    `<span class="eyebrow">GLI202 · Chapter 3 · Lesson 3.1</span>
<h2>Institutions &amp; agreements: WTO, FTA, CPTPP, EVFTA</h2>
<h3>The WTO — the multilateral rulebook</h3>
<p>The <strong>World Trade Organization</strong> sets global trade rules and resolves disputes between member states. Two core principles:</p>
<ul>
<li><strong>Most-Favoured-Nation (MFN)</strong> — a trade advantage given to one member must be given to ALL members (with FTA exceptions).</li>
<li><strong>National treatment</strong> — imported goods, once inside a country, must be treated the same as domestically produced goods (e.g. same domestic tax).</li>
</ul>
<h3>Free Trade Agreements (FTAs)</h3>
<p>An FTA is an <em>exception</em> to MFN allowed by WTO rules: members cut tariffs among THEMSELVES further/faster than they give the rest of the world. Types range from bilateral (2 countries) to mega-regional (many countries).</p>
<h3>CPTPP &amp; EVFTA — Vietnam's two flagship FTAs</h3>
<ul>
<li><strong>CPTPP</strong> (Comprehensive and Progressive Agreement for Trans-Pacific Partnership) — 11 Pacific-Rim members (incl. Vietnam, Japan, Canada, Australia...), eliminates most tariffs among members over a schedule.</li>
<li><strong>EVFTA</strong> (EU-Vietnam Free Trade Agreement) — between Vietnam and the EU, in force since 2020, phasing out tariffs on most goods within 7-10 years and covering services, investment and intellectual property.</li>
</ul>
<div class="callout"><span class="badge">Why it matters</span> Vietnam joined the WTO in 2007 and has since signed 17+ FTAs — trade policy for Vietnamese businesses today means knowing exactly WHICH agreement applies to a given trading partner.</div>`,
    `<span class="eyebrow">GLI202 · Chương 3 · Bài 3.1</span>
<h2>Định chế &amp; hiệp định: WTO, FTA, CPTPP, EVFTA</h2>
<h3>WTO — bộ luật đa phương</h3>
<p><strong>Tổ chức Thương mại Thế giới (WTO)</strong> đặt ra luật thương mại toàn cầu và giải quyết tranh chấp giữa các nước thành viên. Hai nguyên tắc cốt lõi:</p>
<ul>
<li><strong>Đối xử tối huệ quốc (MFN)</strong> — ưu đãi thương mại dành cho một thành viên phải dành cho TẤT CẢ thành viên (trừ ngoại lệ FTA).</li>
<li><strong>Đối xử quốc gia (national treatment)</strong> — hàng nhập khẩu, khi đã vào trong nước, phải được đối xử NGANG BẰNG hàng sản xuất trong nước (vd cùng mức thuế nội địa).</li>
</ul>
<h3>Hiệp định thương mại tự do (FTA)</h3>
<p>FTA là một <em>ngoại lệ</em> của MFN được WTO cho phép: các thành viên cắt thuế quan cho NHAU sâu hơn/nhanh hơn so với phần còn lại của thế giới. Có nhiều loại, từ song phương (2 nước) đến siêu khu vực (nhiều nước).</p>
<h3>CPTPP &amp; EVFTA — hai FTA trọng điểm của Việt Nam</h3>
<ul>
<li><strong>CPTPP</strong> (Hiệp định Đối tác Toàn diện và Tiến bộ xuyên Thái Bình Dương) — 11 thành viên vành đai Thái Bình Dương (gồm Việt Nam, Nhật Bản, Canada, Úc...), xoá bỏ hầu hết thuế quan giữa các thành viên theo lộ trình.</li>
<li><strong>EVFTA</strong> (Hiệp định Thương mại Tự do EU-Việt Nam) — giữa Việt Nam và EU, có hiệu lực từ 2020, xoá bỏ thuế quan với hầu hết hàng hoá trong 7-10 năm và bao gồm dịch vụ, đầu tư, sở hữu trí tuệ.</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Việt Nam gia nhập WTO năm 2007 và từ đó ký hơn 17 FTA — chính sách thương mại với doanh nghiệp Việt Nam hôm nay là biết CHÍNH XÁC hiệp định nào áp dụng cho đối tác thương mại nào.</div>`,
  ]]);

const c3q = quiz('gli202-quiz-3', 'Quiz 3 — Institutions & agreements|||Quiz 3 — Định chế & hiệp định', [
  { id: 'q1', question: 'Nguyên tắc "đối xử tối huệ quốc" (MFN) của WTO nghĩa là gì?', options: ['Mỗi nước tự do đặt thuế quan riêng cho từng đối tác', 'Ưu đãi dành cho một thành viên phải dành cho tất cả thành viên WTO (trừ ngoại lệ FTA)', 'Hàng nhập khẩu luôn bị đánh thuế cao hơn hàng trong nước', 'Chỉ áp dụng cho hàng nông sản'], correctIndex: 1, explanation: 'MFN yêu cầu đối xử bình đẳng giữa các thành viên WTO, trừ ngoại lệ được phép như FTA.' },
  { id: 'q2', question: 'FTA (hiệp định thương mại tự do) được xem là gì trong khung WTO?', options: ['Một hình thức trợ cấp xuất khẩu', 'Một ngoại lệ được phép của nguyên tắc MFN', 'Một loại hàng rào phi thuế quan', 'Một cơ chế giải quyết tranh chấp duy nhất'], correctIndex: 1, explanation: 'FTA cho phép các thành viên cắt giảm thuế quan cho nhau sâu hơn phần còn lại của thế giới — là ngoại lệ WTO cho phép với MFN.' },
  { id: 'q3', question: 'EVFTA là hiệp định thương mại tự do giữa Việt Nam và?', options: ['Hoa Kỳ', 'Liên minh châu Âu (EU)', 'ASEAN', 'Trung Quốc'], correctIndex: 1, explanation: 'EVFTA = EU-Vietnam Free Trade Agreement, có hiệu lực từ 2020.' },
]);

const c4 = doc('gli202-4-1-export-import-procedure', '4.1 — Export-import procedure & documents|||4.1 — Quy trình xuất nhập khẩu & chứng từ',
  'Các bước quy trình XNK; chứng từ chính: hợp đồng, invoice, packing list, B/L, C/O, khai hải quan.',
  [[
    `<span class="eyebrow">GLI202 · Chapter 4 · Lesson 4.1</span>
<h2>Export-import procedure &amp; documents</h2>
<h3>The procedure, step by step</h3>
<pre><code>1. Sales contract signed (terms, Incoterm, payment method agreed)
2. Exporter prepares goods + books transport (with a forwarder/carrier)
3. Export customs declaration + clearance in exporter's country
4. Goods shipped; carrier issues transport document (e.g. Bill of Lading)
5. Exporter sends shipping documents to importer / bank (per payment method)
6. Import customs declaration + clearance + duties paid in importer's country
7. Goods released to importer; payment settled per the agreed method
</code></pre>
<h3>Key documents</h3>
<ul>
<li><strong>Commercial invoice</strong> — the seller's bill: goods, price, terms; used by customs to assess value/duty.</li>
<li><strong>Packing list</strong> — physical detail of each package (weight, dimensions, contents) — does NOT show price.</li>
<li><strong>Bill of Lading (B/L)</strong> — issued by the carrier; proof of shipment, contract of carriage, AND (if "negotiable") title to the goods.</li>
<li><strong>Certificate of Origin (C/O)</strong> — certifies where the goods were made; required to claim preferential tariffs under an FTA (e.g. CPTPP, EVFTA).</li>
<li><strong>Customs declaration</strong> — the formal filing to import/export authorities, in Vietnam via the VNACCS electronic system.</li>
</ul>
<div class="callout"><span class="badge">Exam tip</span> A C/O is the document that PROVES a shipment qualifies for an FTA's lower tariff — without it, customs applies the normal (higher) MFN rate even if the FTA exists.</div>`,
    `<span class="eyebrow">GLI202 · Chương 4 · Bài 4.1</span>
<h2>Quy trình xuất nhập khẩu &amp; chứng từ</h2>
<h3>Quy trình, từng bước</h3>
<pre><code>1. Ký hợp đồng mua bán (thoả thuận điều kiện, Incoterm, phương thức thanh toán)
2. Nhà xuất khẩu chuẩn bị hàng + đặt vận chuyển (qua forwarder/hãng tàu)
3. Khai báo &amp; thông quan xuất khẩu tại nước xuất khẩu
4. Hàng được vận chuyển; hãng vận tải phát hành chứng từ vận tải (vd Bill of Lading)
5. Nhà xuất khẩu gửi chứng từ giao hàng cho người nhập khẩu/ngân hàng (theo phương thức thanh toán)
6. Khai báo &amp; thông quan nhập khẩu + nộp thuế tại nước nhập khẩu
7. Hàng được giao cho người nhập khẩu; thanh toán theo phương thức đã thoả thuận
</code></pre>
<h3>Các chứng từ chính</h3>
<ul>
<li><strong>Hoá đơn thương mại (commercial invoice)</strong> — hoá đơn của người bán: hàng hoá, giá, điều kiện; hải quan dùng để định giá tính thuế.</li>
<li><strong>Bảng kê chi tiết hàng hoá (packing list)</strong> — chi tiết vật lý từng gói hàng (trọng lượng, kích thước, nội dung) — KHÔNG ghi giá.</li>
<li><strong>Vận đơn (Bill of Lading, B/L)</strong> — do hãng vận tải phát hành; là bằng chứng đã giao hàng, hợp đồng vận chuyển, VÀ (nếu "chuyển nhượng được") là chứng từ sở hữu hàng hoá.</li>
<li><strong>Giấy chứng nhận xuất xứ (C/O)</strong> — chứng nhận nơi sản xuất hàng hoá; cần để hưởng thuế ưu đãi theo FTA (vd CPTPP, EVFTA).</li>
<li><strong>Tờ khai hải quan</strong> — khai báo chính thức với cơ quan hải quan, ở Việt Nam qua hệ thống điện tử VNACCS.</li>
</ul>
<div class="callout"><span class="badge">Mẹo thi</span> C/O là chứng từ CHỨNG MINH lô hàng đủ điều kiện hưởng thuế ưu đãi FTA — thiếu nó, hải quan áp mức thuế MFN thông thường (cao hơn) dù FTA có tồn tại.</div>`,
  ]]);

const c4q = quiz('gli202-quiz-4', 'Quiz 4 — Export-import procedure|||Quiz 4 — Quy trình XNK', [
  { id: 'q1', question: 'Chứng từ nào chứng minh lô hàng đủ điều kiện hưởng thuế ưu đãi theo FTA?', options: ['Packing list', 'Certificate of Origin (C/O)', 'Commercial invoice', 'Bill of Lading'], correctIndex: 1, explanation: 'C/O chứng nhận xuất xứ hàng hoá — điều kiện bắt buộc để hưởng thuế ưu đãi FTA.' },
  { id: 'q2', question: 'Bill of Lading (B/L) có chức năng gì KHÔNG đúng?', options: ['Bằng chứng đã giao hàng cho hãng vận tải', 'Hợp đồng vận chuyển', 'Chứng từ sở hữu hàng hoá (nếu chuyển nhượng được)', 'Chứng nhận xuất xứ hàng hoá để hưởng ưu đãi thuế'], correctIndex: 3, explanation: 'Chứng nhận xuất xứ là chức năng của C/O, không phải B/L. B/L là chứng từ vận tải/sở hữu.' },
  { id: 'q3', question: 'Packing list khác commercial invoice ở điểm nào?', options: ['Packing list có ghi giá, invoice thì không', 'Packing list ghi chi tiết vật lý (trọng lượng/kích thước), không ghi giá; invoice ghi giá để tính thuế', 'Hai chứng từ này giống nhau hoàn toàn', 'Packing list chỉ dùng cho hàng nhập khẩu'], correctIndex: 1, explanation: 'Packing list mô tả vật lý lô hàng, không có giá; invoice là hoá đơn có giá để hải quan tính thuế.' },
]);

const c5 = doc('gli202-5-1-incoterms-2020', '5.1 — Incoterms 2020: allocating cost & risk|||5.1 — Incoterms 2020: phân chia chi phí & rủi ro',
  '11 điều kiện Incoterms 2020, 4 nhóm E/F/C/D, điểm chuyển rủi ro; so sánh EXW, FOB, CIF, DDP.',
  [[
    `<span class="eyebrow">GLI202 · Chapter 5 · Lesson 5.1</span>
<h2>Incoterms 2020: allocating cost &amp; risk</h2>
<h3>What Incoterms actually decide</h3>
<p><strong>Incoterms 2020</strong> (published by the ICC) are 11 standard three-letter terms that answer two questions for every shipment: <strong>who pays for what</strong>, and <strong>at which point does risk pass</strong> from seller to buyer. They do NOT cover price, currency, or payment method.</p>
<h3>Four groups</h3>
<pre><code>Group E (departure): EXW               - buyer takes ALL risk/cost from seller's door
Group F (main carriage unpaid): FCA, FAS, FOB  - seller delivers to a carrier, buyer pays main carriage
Group C (main carriage paid): CPT, CIP, CFR, CIF - seller pays main carriage, but risk passes EARLY
Group D (arrival): DAP, DPU, DDP       - seller bears risk/cost all the way to destination
</code></pre>
<h3>Four commonly tested terms</h3>
<ul>
<li><strong>EXW (Ex Works)</strong> — seller's minimum obligation: buyer collects goods at seller's premises and handles everything else (incl. export clearance).</li>
<li><strong>FOB (Free On Board)</strong> — seller's risk ends once goods are loaded ON BOARD the vessel at the named port; used for sea/inland waterway only.</li>
<li><strong>CIF (Cost, Insurance and Freight)</strong> — seller pays freight AND insurance to destination port, but risk passes when goods are on board — buyer bears risk during the voyage even though seller paid for insurance.</li>
<li><strong>DDP (Delivered Duty Paid)</strong> — seller's MAXIMUM obligation: delivers, cleared for import, duty paid, at the buyer's named place.</li>
</ul>
<div class="callout"><span class="badge">Exam trap</span> Under CIF, the seller pays for insurance but the BUYER bears the risk of loss during sea transport — "who pays" and "who bears risk" are answered SEPARATELY and often differ.</div>`,
    `<span class="eyebrow">GLI202 · Chương 5 · Bài 5.1</span>
<h2>Incoterms 2020: phân chia chi phí &amp; rủi ro</h2>
<h3>Incoterms thực sự quyết định điều gì</h3>
<p><strong>Incoterms 2020</strong> (do ICC ban hành) là 11 điều kiện chuẩn ba chữ, trả lời hai câu hỏi cho mọi lô hàng: <strong>ai trả cho cái gì</strong>, và <strong>rủi ro chuyển từ người bán sang người mua tại điểm nào</strong>. Chúng KHÔNG quy định giá, đồng tiền, hay phương thức thanh toán.</p>
<h3>Bốn nhóm</h3>
<pre><code>Nhóm E (khởi hành): EXW                 - người mua chịu MỌI rủi ro/chi phí từ cửa xưởng người bán
Nhóm F (chưa trả vận chuyển chính): FCA, FAS, FOB - người bán giao cho hãng vận tải, người mua trả vận chuyển chính
Nhóm C (đã trả vận chuyển chính): CPT, CIP, CFR, CIF - người bán trả vận chuyển chính, nhưng rủi ro chuyển SỚM
Nhóm D (đến nơi): DAP, DPU, DDP          - người bán chịu rủi ro/chi phí đến tận nơi đến
</code></pre>
<h3>Bốn điều kiện thường gặp trong đề thi</h3>
<ul>
<li><strong>EXW (Ex Works)</strong> — nghĩa vụ TỐI THIỂU của người bán: người mua nhận hàng tại xưởng người bán và tự lo mọi thứ còn lại (kể cả thông quan xuất khẩu).</li>
<li><strong>FOB (Free On Board)</strong> — rủi ro của người bán kết thúc khi hàng đã được XẾP LÊN TÀU tại cảng chỉ định; chỉ dùng cho vận tải biển/đường thuỷ nội địa.</li>
<li><strong>CIF (Cost, Insurance and Freight)</strong> — người bán trả cước VÀ bảo hiểm đến cảng đến, nhưng rủi ro chuyển khi hàng lên tàu — người mua chịu rủi ro trong hành trình dù người bán đã trả bảo hiểm.</li>
<li><strong>DDP (Delivered Duty Paid)</strong> — nghĩa vụ TỐI ĐA của người bán: giao hàng, đã thông quan nhập khẩu, đã nộp thuế, tại nơi người mua chỉ định.</li>
</ul>
<div class="callout"><span class="badge">Bẫy hay gặp</span> Với CIF, người bán trả tiền bảo hiểm nhưng NGƯỜI MUA chịu rủi ro mất mát trong hành trình biển — "ai trả tiền" và "ai chịu rủi ro" được trả lời RIÊNG và thường khác nhau.</div>`,
  ]]);

const c5q = quiz('gli202-quiz-5', 'Quiz 5 — Incoterms 2020|||Quiz 5 — Incoterms 2020', [
  { id: 'q1', question: 'Theo điều kiện FOB, rủi ro của người bán kết thúc tại thời điểm nào?', options: ['Khi hàng ra khỏi xưởng người bán', 'Khi hàng được xếp lên tàu tại cảng chỉ định', 'Khi hàng tới cảng đến', 'Khi người mua nộp thuế nhập khẩu'], correctIndex: 1, explanation: 'FOB: rủi ro chuyển sang người mua ngay khi hàng được xếp lên tàu (on board) tại cảng đi.' },
  { id: 'q2', question: 'Điều kiện Incoterms nào đặt nghĩa vụ TỐI ĐA lên người bán (giao hàng, đã thông quan nhập khẩu, đã nộp thuế)?', options: ['EXW', 'FOB', 'CIF', 'DDP'], correctIndex: 3, explanation: 'DDP (Delivered Duty Paid) là điều kiện người bán chịu trách nhiệm nhiều nhất, tới tận nơi người mua.' },
  { id: 'q3', question: 'Với điều kiện CIF, phát biểu nào ĐÚNG?', options: ['Người bán chịu rủi ro suốt hành trình biển', 'Người bán trả cước và bảo hiểm, nhưng người mua chịu rủi ro từ khi hàng lên tàu', 'Người mua phải tự mua bảo hiểm vì CIF không bao gồm bảo hiểm', 'CIF chỉ dùng cho vận tải hàng không'], correctIndex: 1, explanation: 'CIF: seller trả cước + bảo hiểm tới cảng đến, nhưng rủi ro đã chuyển cho buyer khi hàng lên tàu.' },
]);

const c6 = doc('gli202-6-1-international-payment', '6.1 — International payment: L/C, T/T, D/P & UCP 600|||6.1 — Thanh toán quốc tế: L/C, T/T, D/P & UCP 600',
  'Các phương thức thanh toán (T/T, D/P, D/A, L/C); quy trình L/C; UCP 600 là bộ quy tắc ngân hàng dùng cho L/C.',
  [[
    `<span class="eyebrow">GLI202 · Chapter 6 · Lesson 6.1</span>
<h2>International payment: L/C, T/T, D/P &amp; UCP 600</h2>
<h3>Payment methods, from riskiest-for-seller to safest-for-seller</h3>
<ul>
<li><strong>Open account</strong> — goods shipped first, buyer pays later per invoice terms. Riskiest for the SELLER (no guarantee of payment).</li>
<li><strong>T/T (Telegraphic Transfer)</strong> — a bank wire; simple and cheap, but has no built-in guarantee — risk depends on WHEN it's sent (advance T/T is safe for seller, T/T after delivery is not).</li>
<li><strong>D/P &amp; D/A (Documents against Payment / Acceptance)</strong> — seller's bank releases shipping documents to the buyer only against payment (D/P) or against the buyer's signed acceptance to pay later (D/A). Safer than open account, still no bank guarantee of payment.</li>
<li><strong>L/C (Letter of Credit)</strong> — the buyer's bank formally GUARANTEES payment to the seller once the seller presents documents that exactly match the L/C's terms. Safest for the seller among common methods.</li>
</ul>
<h3>How an L/C works — and UCP 600</h3>
<pre><code>1. Buyer (applicant) asks its bank (issuing bank) to open an L/C
2. Issuing bank sends the L/C to seller's bank (advising/confirming bank)
3. Seller ships goods, then presents documents (invoice, B/L, C/O...) to its bank
4. Bank checks documents STRICTLY against the L/C terms (doctrine of strict compliance)
5. If documents comply -> issuing bank MUST pay, even if the goods themselves have a problem
</code></pre>
<p><strong>UCP 600</strong> (Uniform Customs and Practice for Documentary Credits, ICC) is the rulebook nearly every bank worldwide applies to L/Cs — it defines how documents are checked and what "compliant" means.</p>
<div class="callout"><span class="badge">Exam tip</span> An L/C is a payment obligation based on DOCUMENTS, not goods — a bank pays against paper that matches the L/C, independent of the actual condition of the goods (the "principle of independence").</div>`,
    `<span class="eyebrow">GLI202 · Chương 6 · Bài 6.1</span>
<h2>Thanh toán quốc tế: L/C, T/T, D/P &amp; UCP 600</h2>
<h3>Các phương thức thanh toán, từ rủi ro nhất cho người bán đến an toàn nhất</h3>
<ul>
<li><strong>Ghi sổ (open account)</strong> — giao hàng trước, người mua trả sau theo điều kiện hoá đơn. Rủi ro nhất cho NGƯỜI BÁN (không có bảo đảm thanh toán).</li>
<li><strong>T/T (chuyển tiền điện tử)</strong> — chuyển khoản ngân hàng; đơn giản, rẻ, nhưng không có bảo đảm sẵn — rủi ro phụ thuộc THỜI ĐIỂM chuyển (T/T trả trước an toàn cho người bán, T/T sau khi giao hàng thì không).</li>
<li><strong>D/P &amp; D/A (nhờ thu kèm chứng từ)</strong> — ngân hàng người bán chỉ giao chứng từ cho người mua khi thanh toán (D/P) hoặc khi người mua ký nhận nợ trả sau (D/A). An toàn hơn ghi sổ, nhưng vẫn không có bảo đảm của ngân hàng.</li>
<li><strong>L/C (Thư tín dụng)</strong> — ngân hàng của người mua CAM KẾT chính thức trả tiền cho người bán khi người bán xuất trình chứng từ khớp đúng điều kiện L/C. An toàn nhất cho người bán trong các phương thức phổ biến.</li>
</ul>
<h3>L/C hoạt động thế nào — và UCP 600</h3>
<pre><code>1. Người mua (applicant) yêu cầu ngân hàng mình (issuing bank) mở L/C
2. Ngân hàng phát hành gửi L/C cho ngân hàng người bán (advising/confirming bank)
3. Người bán giao hàng, sau đó xuất trình chứng từ (invoice, B/L, C/O...) cho ngân hàng mình
4. Ngân hàng kiểm tra chứng từ NGHIÊM NGẶT theo điều kiện L/C (nguyên tắc tuân thủ chặt chẽ)
5. Nếu chứng từ khớp -> ngân hàng phát hành PHẢI trả tiền, dù hàng hoá thực tế có vấn đề
</code></pre>
<p><strong>UCP 600</strong> (Quy tắc thực hành thống nhất về tín dụng chứng từ, ICC) là bộ luật hầu hết ngân hàng trên thế giới áp dụng cho L/C — quy định cách kiểm chứng từ và thế nào là "khớp".</p>
<div class="callout"><span class="badge">Mẹo thi</span> L/C là nghĩa vụ thanh toán dựa trên CHỨNG TỪ, không phải hàng hoá — ngân hàng trả tiền dựa trên giấy tờ khớp với L/C, độc lập với tình trạng thực tế của hàng hoá ("nguyên tắc độc lập").</div>`,
  ]]);

const c6q = quiz('gli202-quiz-6', 'Quiz 6 — International payment|||Quiz 6 — Thanh toán quốc tế', [
  { id: 'q1', question: 'Phương thức thanh toán nào an toàn NHẤT cho người bán trong số các phương thức phổ biến?', options: ['Ghi sổ (open account)', 'T/T sau khi giao hàng', 'L/C (thư tín dụng)', 'D/A (nhờ thu chấp nhận)'], correctIndex: 2, explanation: 'L/C có ngân hàng phát hành cam kết trả tiền khi chứng từ khớp điều kiện — an toàn nhất cho người bán.' },
  { id: 'q2', question: 'Bộ quy tắc nào các ngân hàng dùng để kiểm tra chứng từ trong giao dịch L/C?', options: ['Incoterms 2020', 'UCP 600', 'WTO Agreement on Tariffs', 'CPTPP'], correctIndex: 1, explanation: 'UCP 600 là quy tắc thực hành thống nhất về tín dụng chứng từ, dùng cho L/C. Incoterms dùng cho phân chia rủi ro/chi phí, không phải thanh toán.' },
  { id: 'q3', question: '"Nguyên tắc độc lập" của L/C nghĩa là gì?', options: ['Ngân hàng chỉ trả tiền nếu hàng hoá không có lỗi', 'Ngân hàng trả tiền dựa trên chứng từ khớp điều kiện, độc lập với tình trạng thực tế của hàng hoá', 'Người mua có thể huỷ L/C bất cứ lúc nào', 'L/C không cần thông qua ngân hàng nào'], correctIndex: 1, explanation: 'Ngân hàng chỉ kiểm chứng từ, không kiểm hàng thật — đây là nguyên tắc độc lập giữa L/C và hợp đồng mua bán.' },
]);

const c7 = doc('gli202-7-1-transport-insurance', '7.1 — Transport & cargo insurance|||7.1 — Vận tải & bảo hiểm hàng hoá',
  'Phương thức vận tải (biển, hàng không, đa phương thức); chứng từ vận tải; bảo hiểm hàng hoá (ICC A/B/C).',
  [[
    `<span class="eyebrow">GLI202 · Chapter 7 · Lesson 7.1</span>
<h2>Transport &amp; cargo insurance</h2>
<h3>Modes of transport</h3>
<ul>
<li><strong>Sea freight</strong> — cheapest per unit for bulk/heavy cargo, but slowest; document: Bill of Lading (B/L).</li>
<li><strong>Air freight</strong> — fastest, most expensive per kg; used for high-value/perishable/urgent goods; document: Air Waybill (AWB) — always non-negotiable, unlike an ocean B/L.</li>
<li><strong>Multimodal transport</strong> — combines 2+ modes (e.g. truck + ship + truck) under a SINGLE contract and one document, simplifying door-to-door shipments.</li>
</ul>
<h3>Why cargo insurance</h3>
<p>Even with a clear Incoterm allocating risk, the party bearing the risk during transport needs insurance against loss/damage — theft, sinking, fire, rough handling. Under CIF/CIP the seller must buy it (on the buyer's behalf); under other terms, whoever bears the risk typically arranges their own.</p>
<h3>Institute Cargo Clauses (ICC) — coverage levels</h3>
<pre><code>ICC (A) - broadest cover: ALL risks of loss/damage, except listed exclusions
ICC (B) - mid cover: named perils (fire, sinking, collision, jettison...)
ICC (C) - narrowest cover: only major casualties (fire, sinking, collision)
</code></pre>
<div class="callout"><span class="badge">Exam trap</span> "ICC" here means <strong>Institute Cargo Clauses</strong> (marine insurance) — a totally different "ICC" from the <strong>International Chamber of Commerce</strong> that publishes Incoterms and UCP 600. Same acronym, unrelated bodies.</div>`,
    `<span class="eyebrow">GLI202 · Chương 7 · Bài 7.1</span>
<h2>Vận tải &amp; bảo hiểm hàng hoá</h2>
<h3>Các phương thức vận tải</h3>
<ul>
<li><strong>Vận tải biển</strong> — rẻ nhất trên mỗi đơn vị cho hàng cồng kềnh/nặng, nhưng chậm nhất; chứng từ: Vận đơn (B/L).</li>
<li><strong>Vận tải hàng không</strong> — nhanh nhất, đắt nhất trên mỗi kg; dùng cho hàng giá trị cao/dễ hỏng/gấp; chứng từ: Vận đơn hàng không (AWB) — luôn KHÔNG chuyển nhượng được, khác B/L đường biển.</li>
<li><strong>Vận tải đa phương thức</strong> — kết hợp 2+ phương thức (vd xe tải + tàu + xe tải) trong MỘT hợp đồng và một chứng từ duy nhất, đơn giản hoá vận chuyển door-to-door.</li>
</ul>
<h3>Vì sao cần bảo hiểm hàng hoá</h3>
<p>Dù Incoterm đã phân định rõ ai chịu rủi ro, bên chịu rủi ro trong vận chuyển vẫn cần bảo hiểm chống mất mát/hư hỏng — trộm cắp, đắm tàu, hoả hoạn, va chạm khi bốc xếp. Theo CIF/CIP người bán phải mua bảo hiểm (thay mặt người mua); ở các điều kiện khác, bên chịu rủi ro thường tự sắp xếp.</p>
<h3>Institute Cargo Clauses (ICC) — mức độ bảo hiểm</h3>
<pre><code>ICC (A) - phạm vi rộng nhất: MỌI rủi ro mất mát/hư hỏng, trừ các loại trừ liệt kê
ICC (B) - phạm vi trung bình: rủi ro được nêu tên (hoả hoạn, đắm tàu, va chạm, ném hàng...)
ICC (C) - phạm vi hẹp nhất: chỉ tai nạn lớn (hoả hoạn, đắm tàu, va chạm)
</code></pre>
<div class="callout"><span class="badge">Bẫy hay gặp</span> "ICC" ở đây là <strong>Institute Cargo Clauses</strong> (bảo hiểm hàng hải) — hoàn toàn khác "ICC" là <strong>International Chamber of Commerce</strong> ban hành Incoterms và UCP 600. Cùng viết tắt, hai tổ chức không liên quan.</div>`,
  ]]);

const c7q = quiz('gli202-quiz-7', 'Quiz 7 — Transport & insurance|||Quiz 7 — Vận tải & bảo hiểm', [
  { id: 'q1', question: 'Chứng từ vận tải hàng không (Air Waybill, AWB) khác Bill of Lading đường biển ở điểm nào?', options: ['AWB đắt hơn B/L', 'AWB luôn không chuyển nhượng được, còn B/L đường biển có thể chuyển nhượng được', 'AWB chỉ dùng cho hàng nội địa', 'AWB không cần chữ ký của hãng vận tải'], correctIndex: 1, explanation: 'AWB luôn là chứng từ không chuyển nhượng (non-negotiable); B/L đường biển có thể phát hành dạng chuyển nhượng được.' },
  { id: 'q2', question: 'Trong 3 mức Institute Cargo Clauses, mức nào có phạm vi bảo hiểm RỘNG NHẤT?', options: ['ICC (C)', 'ICC (B)', 'ICC (A)', 'Cả 3 mức bằng nhau'], correctIndex: 2, explanation: 'ICC (A) bảo hiểm mọi rủi ro trừ loại trừ liệt kê — rộng nhất; ICC (C) hẹp nhất, chỉ tai nạn lớn.' },
  { id: 'q3', question: '"ICC" trong Institute Cargo Clauses có liên quan gì đến "ICC" ban hành Incoterms?', options: ['Là cùng một tổ chức (International Chamber of Commerce)', 'Là hai tổ chức khác nhau, chỉ trùng viết tắt', 'Institute Cargo Clauses là một chương trong Incoterms 2020', 'Không tổ chức nào tên là ICC trong bảo hiểm hàng hải'], correctIndex: 1, explanation: 'Institute Cargo Clauses (bảo hiểm hàng hải, thị trường Lloyd\'s/London) và International Chamber of Commerce (Incoterms, UCP 600) là hai tổ chức khác nhau, trùng viết tắt.' },
]);

const c8 = doc('gli202-8-1-risk-disputes-vietnam', '8.1 — Trade risk, disputes & Vietnam\'s trade practice|||8.1 — Rủi ro, tranh chấp & thương mại quốc tế Việt Nam',
  'Rủi ro tỷ giá/tín dụng/quốc gia/bất khả kháng; giải quyết tranh chấp; Việt Nam: WTO, CPTPP, EVFTA, cơ cấu xuất khẩu.',
  [[
    `<span class="eyebrow">GLI202 · Chapter 8 · Lesson 8.1</span>
<h2>Trade risk, disputes &amp; Vietnam's trade practice</h2>
<h3>Common risks in international trade</h3>
<ul>
<li><strong>Exchange-rate risk</strong> — the invoice currency moves between contract and payment date, changing the real value received/paid.</li>
<li><strong>Credit risk</strong> — the buyer fails to pay (mitigated by L/C, credit insurance, or advance payment).</li>
<li><strong>Country risk</strong> — political instability, sudden capital/trade controls, or sanctions in the trading partner's country.</li>
<li><strong>Force majeure</strong> — events beyond either party's control (natural disaster, war, pandemic) that excuse non-performance — must be defined in the contract to be enforceable.</li>
</ul>
<h3>Resolving disputes</h3>
<p>Most international sales contracts specify <strong>arbitration</strong> (e.g. under ICC or VIAC — Vietnam International Arbitration Centre rules) rather than litigation in a national court, because an arbitral award is easier to enforce across borders (New York Convention 1958). Incoterms 2020 and UCP 600 are often the FIRST reference point to determine who was at fault — e.g. "was risk still with the seller at the moment of loss?"</p>
<h3>Vietnam's trade practice today</h3>
<ul>
<li>WTO member since <strong>2007</strong>; party to <strong>17+ FTAs</strong> including CPTPP and EVFTA.</li>
<li>Export structure has shifted from raw agricultural/resource goods toward manufacturing (electronics, textiles, footwear) — foreign direct investment (FDI) plays a large role in this shift.</li>
<li>Common practical risk for Vietnamese exporters: relying on a single large buyer or market, and currency exposure since most contracts are priced in USD.</li>
</ul>
<div class="callout"><span class="badge">Big picture</span> Every earlier chapter feeds this one: a trade dispute is usually a disagreement over WHO bore a risk (Incoterms), WHETHER documents complied (UCP 600), or WHETHER a policy/agreement (tariff, FTA rule of origin) was applied correctly.</div>`,
    `<span class="eyebrow">GLI202 · Chương 8 · Bài 8.1</span>
<h2>Rủi ro, tranh chấp &amp; thương mại quốc tế Việt Nam</h2>
<h3>Các rủi ro thường gặp trong thương mại quốc tế</h3>
<ul>
<li><strong>Rủi ro tỷ giá</strong> — đồng tiền trên hoá đơn biến động giữa ngày ký hợp đồng và ngày thanh toán, làm thay đổi giá trị thực nhận/trả.</li>
<li><strong>Rủi ro tín dụng</strong> — người mua không thanh toán (giảm thiểu bằng L/C, bảo hiểm tín dụng, hoặc trả trước).</li>
<li><strong>Rủi ro quốc gia</strong> — bất ổn chính trị, kiểm soát vốn/thương mại đột ngột, hoặc trừng phạt tại nước đối tác.</li>
<li><strong>Bất khả kháng (force majeure)</strong> — các sự kiện nằm ngoài kiểm soát của cả hai bên (thiên tai, chiến tranh, đại dịch) miễn trừ trách nhiệm không thực hiện hợp đồng — phải được định nghĩa rõ trong hợp đồng để có hiệu lực.</li>
</ul>
<h3>Giải quyết tranh chấp</h3>
<p>Hầu hết hợp đồng mua bán quốc tế chọn <strong>trọng tài</strong> (vd theo quy tắc ICC hoặc VIAC — Trung tâm Trọng tài Quốc tế Việt Nam) thay vì kiện ra toà án quốc gia, vì phán quyết trọng tài dễ thi hành xuyên biên giới hơn (Công ước New York 1958). Incoterms 2020 và UCP 600 thường là điểm tham chiếu ĐẦU TIÊN để xác định lỗi thuộc về ai — vd "rủi ro còn thuộc người bán tại thời điểm mất mát không?"</p>
<h3>Thương mại quốc tế của Việt Nam hôm nay</h3>
<ul>
<li>Thành viên WTO từ <strong>2007</strong>; tham gia hơn <strong>17 FTA</strong>, gồm CPTPP và EVFTA.</li>
<li>Cơ cấu xuất khẩu đã chuyển từ nông sản/tài nguyên thô sang hàng chế biến (điện tử, dệt may, giày dép) — vốn đầu tư trực tiếp nước ngoài (FDI) đóng vai trò lớn trong sự chuyển dịch này.</li>
<li>Rủi ro thực tế thường gặp của doanh nghiệp xuất khẩu Việt Nam: phụ thuộc vào một khách hàng/thị trường lớn duy nhất, và rủi ro tỷ giá vì hầu hết hợp đồng định giá bằng USD.</li>
</ul>
<div class="callout"><span class="badge">Bức tranh tổng thể</span> Mọi chương trước đều dẫn tới chương này: một tranh chấp thương mại thường là bất đồng về việc AI chịu rủi ro (Incoterms), chứng từ có KHỚP điều kiện không (UCP 600), hay chính sách/hiệp định (thuế quan, quy tắc xuất xứ FTA) đã được áp dụng đúng chưa.</div>`,
  ]]);

const c8q = quiz('gli202-quiz-8', 'Quiz 8 — Risk, disputes & Vietnam|||Quiz 8 — Rủi ro, tranh chấp & Việt Nam', [
  { id: 'q1', question: 'Rủi ro nào xảy ra khi đồng tiền hoá đơn biến động giữa ngày ký hợp đồng và ngày thanh toán?', options: ['Rủi ro tín dụng', 'Rủi ro tỷ giá', 'Rủi ro quốc gia', 'Bất khả kháng'], correctIndex: 1, explanation: 'Biến động tỷ giá giữa thời điểm ký hợp đồng và thanh toán là rủi ro tỷ giá (exchange-rate risk).' },
  { id: 'q2', question: 'Vì sao hợp đồng thương mại quốc tế thường chọn trọng tài thay vì kiện ra toà án quốc gia?', options: ['Trọng tài luôn miễn phí', 'Phán quyết trọng tài dễ thi hành xuyên biên giới hơn (theo Công ước New York 1958)', 'Toà án quốc gia không được phép xử tranh chấp thương mại', 'Trọng tài không cần chứng cứ'], correctIndex: 1, explanation: 'Công ước New York 1958 giúp phán quyết trọng tài được công nhận và thi hành ở nhiều nước, thuận lợi hơn án toà quốc gia.' },
  { id: 'q3', question: 'Việt Nam gia nhập WTO vào năm nào?', options: ['1995', '2000', '2007', '2020'], correctIndex: 2, explanation: 'Việt Nam chính thức trở thành thành viên WTO năm 2007.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'GLI202',
    slug: 'gli202-thuong-mai-quoc-te',
    title: 'Thương mại quốc tế',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/GLI202.webp',
    shortDescription: 'How international trade works — comparative advantage, trade policy, WTO/FTA/CPTPP/EVFTA, export-import procedures, Incoterms 2020, payments (L/C, UCP 600), transport & insurance, trade risk. Bilingual, with examples & quizzes.|||Thương mại quốc tế: lợi thế so sánh, chính sách thương mại, WTO/FTA/CPTPP/EVFTA, quy trình XNK, Incoterms 2020, thanh toán quốc tế (L/C, UCP 600), vận tải & bảo hiểm, rủi ro thương mại. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>GLI202 — International Trade (Thương mại quốc tế)</strong> (khối Quản trị Kinh doanh, kỳ 3) đi từ <strong>lý thuyết thương mại</strong> (lợi thế so sánh) → <strong>chính sách thương mại</strong> (thuế quan, hạn ngạch) → <strong>định chế &amp; hiệp định</strong> (WTO, FTA, CPTPP, EVFTA) → <strong>quy trình &amp; chứng từ xuất nhập khẩu</strong> → <strong>Incoterms 2020</strong> → <strong>thanh toán quốc tế</strong> (L/C, UCP 600) → <strong>vận tải &amp; bảo hiểm</strong> → <strong>rủi ro, tranh chấp &amp; thương mại quốc tế của Việt Nam</strong>. Bám giáo trình FLM (Krugman/Obstfeld, Feenstra/Taylor, Incoterms 2020, UCP 600), song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Lợi thế tuyệt đối vs so sánh; lợi ích từ thương mại; thuế quan (ad valorem/tuyệt đối) & hạn ngạch; hàng rào phi thuế quan; nguyên tắc WTO (MFN, đối xử quốc gia); FTA, CPTPP, EVFTA; quy trình & chứng từ XNK (invoice, packing list, B/L, C/O, khai hải quan); 11 điều kiện Incoterms 2020 (EXW/FOB/CIF/DDP...); phương thức thanh toán quốc tế (T/T, D/P, D/A, L/C) & UCP 600; vận tải biển/hàng không/đa phương thức; bảo hiểm hàng hoá (ICC A/B/C); rủi ro tỷ giá/tín dụng/quốc gia, trọng tài thương mại, thương mại quốc tế của Việt Nam.',
    requirements: 'Kiến thức kinh tế học đại cương (vi mô/vĩ mô cơ bản). Nên đọc trước syllabus GLI202 trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách tham khảo, Incoterms 2020, UCP 600, nguồn miễn phí, công cụ.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao các nước giao thương; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Lý thuyết thương mại|||Chapter 1 — Trade theory', description: 'Lợi thế tuyệt đối vs so sánh, lợi ích từ thương mại.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chính sách thương mại|||Chapter 2 — Trade policy', description: 'Thuế quan, hạn ngạch, bảo hộ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Định chế & hiệp định|||Chapter 3 — Institutions & agreements', description: 'WTO, FTA, CPTPP, EVFTA.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Quy trình & chứng từ XNK|||Chapter 4 — Export-import procedure', description: 'Quy trình, invoice, packing list, B/L, C/O.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Incoterms 2020|||Chapter 5 — Incoterms 2020', description: '11 điều kiện, 4 nhóm E/F/C/D, EXW/FOB/CIF/DDP.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thanh toán quốc tế|||Chapter 6 — International payment', description: 'T/T, D/P, D/A, L/C, UCP 600.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Vận tải & bảo hiểm|||Chapter 7 — Transport & insurance', description: 'Biển, hàng không, đa phương thức, ICC A/B/C.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Rủi ro, tranh chấp & Việt Nam|||Chapter 8 — Risk, disputes & Vietnam', description: 'Rủi ro tỷ giá/tín dụng/quốc gia, trọng tài, thương mại VN.', lessons: [c8, c8q] },
  ],
};
