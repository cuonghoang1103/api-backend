/**
 * CIB401 — Comprehensive Business Chinese 2 (Tiếng Trung Thương mại Tổng hợp 2).
 * Ngành Ngôn ngữ Trung, FPTU, Kỳ 4. Tiếp nối CIB301 (nhập môn thương mại) —
 * nâng cao chủ đề đàm phán, hợp đồng, thư tín, marketing, xuất nhập khẩu,
 * ngân hàng/tài chính, hội chợ & quan hệ, văn phong trang trọng. HSK4-5.
 * Trích dẫn giáo trình "商务汉语" (BLCU Press) & "经贸中级汉语", KHÔNG upload PDF.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; UTF-8 chữ Hán + pinyin dấu thật.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cib401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (BLCU, kinh mậu Hán ngữ), tự điển/tra pinyin, HSK4-5, YouTube tiếng Trung thương mại, công cụ gõ chữ Hán.',
  [[
    `<span class="eyebrow">CIB401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Resources for <strong>Business Chinese</strong> at HSK4-5 level: negotiation, contracts, correspondence, marketing, import-export, banking &amp; finance, trade fairs. The official FPTU slides live on <strong>FLM</strong>; below are free, legal companions.</p>
<h3>📘 Reference textbooks (cited, not distributed)</h3>
<ul>
<li><em>商务汉语 (Business Chinese)</em> — Beijing Language and Culture University Press (北京语言大学出版社) — the standard intermediate-advanced business-Chinese series this course follows.</li>
<li><em>经贸中级汉语 (Intermediate Chinese for Economics &amp; Trade)</em> — companion material for import-export &amp; finance vocabulary.</li>
</ul>
<h3>🌐 Official / free tools</h3>
<ul>
<li><a href="https://www.mdbg.net/chindict/chindict.php" target="_blank" rel="noopener">MDBG Chinese-English Dictionary</a> — look up hanzi, pinyin, stroke order.</li>
<li><a href="https://www.chinesetest.cn/" target="_blank" rel="noopener">Chinesetest.cn (Hanban)</a> — official HSK4/HSK5 vocabulary lists &amp; mock tests.</li>
<li><a href="https://www.yellowbridge.com/" target="_blank" rel="noopener">YellowBridge</a> — hanzi decomposition &amp; etymology, useful for business terms built from common radicals.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — HSK4-5 grammar reviews.</li>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — real-speed interviews, good for business register.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — offline dictionary with OCR for reading contracts/letters.</li>
<li><a href="https://www.archchinese.com/chinese_english_dictionary.html" target="_blank" rel="noopener">Arch Chinese</a> — stroke-order writer sheets for new business hanzi.</li>
</ul>
<div class="callout"><span class="badge">Study path</span>
<ol>
<li><strong>Foundation</strong> — review CIB301 vocabulary (company intro, ordering, small talk) before the negotiation chapters.</li>
<li><strong>Core</strong> — negotiation → contracts → correspondence → marketing → import-export → banking/finance → trade fairs.</li>
<li><strong>Capstone</strong> — Chapter 8 combines every register into one complex scenario.</li>
</ol></div>`,
    `<span class="eyebrow">CIB401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Tài liệu cho <strong>Tiếng Trung thương mại</strong> trình độ HSK4-5: đàm phán, hợp đồng, thư tín, marketing, xuất nhập khẩu, ngân hàng &amp; tài chính, hội chợ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp đi kèm.</p>
<h3>📘 Giáo trình tham khảo (trích dẫn, không phát hành lại)</h3>
<ul>
<li><em>商务汉语 (Business Chinese)</em> — NXB Đại học Ngôn ngữ Bắc Kinh (北京语言大学出版社) — bộ giáo trình thương mại trung-cao cấp mà môn này bám theo.</li>
<li><em>经贸中级汉语 (Tiếng Trung kinh mậu trung cấp)</em> — tài liệu bổ trợ từ vựng xuất nhập khẩu &amp; tài chính.</li>
</ul>
<h3>🌐 Công cụ chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.mdbg.net/chindict/chindict.php" target="_blank" rel="noopener">MDBG Chinese-English Dictionary</a> — tra chữ Hán, pinyin, thứ tự nét.</li>
<li><a href="https://www.chinesetest.cn/" target="_blank" rel="noopener">Chinesetest.cn (Hán Bản)</a> — danh sách từ vựng HSK4/HSK5 chính thức &amp; đề thi thử.</li>
<li><a href="https://www.yellowbridge.com/" target="_blank" rel="noopener">YellowBridge</a> — phân tích cấu tạo chữ Hán, hữu ích cho từ thương mại ghép từ bộ thủ quen.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — ôn ngữ pháp HSK4-5.</li>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — phỏng vấn tốc độ thật, hợp để nghe văn phong thương mại.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển offline có OCR, hữu ích khi đọc hợp đồng/thư tín.</li>
<li><a href="https://www.archchinese.com/chinese_english_dictionary.html" target="_blank" rel="noopener">Arch Chinese</a> — phiếu luyện viết theo thứ tự nét cho chữ Hán thương mại mới.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình học</span>
<ol>
<li><strong>Nền</strong> — ôn lại từ vựng CIB301 (giới thiệu công ty, đặt hàng, giao tiếp xã giao) trước khi vào chương đàm phán.</li>
<li><strong>Lõi</strong> — đàm phán → hợp đồng → thư tín → marketing → xuất nhập khẩu → ngân hàng/tài chính → hội chợ.</li>
<li><strong>Tổng hợp</strong> — Chương 8 gộp mọi văn phong vào một tình huống phức hợp.</li>
</ol></div>`,
  ]]);

const intro = doc('cib401-0-1-overview', 'Course overview: Comprehensive Business Chinese 2|||Tổng quan: Tiếng Trung Thương mại Tổng hợp 2',
  'Từ CIB301 (nhập môn) lên trình độ HSK4-5: 8 chương thương mại nâng cao — đàm phán, hợp đồng, thư tín, marketing, xuất nhập khẩu, ngân hàng/tài chính, hội chợ, ôn tập văn phong trang trọng.',
  [[
    `<span class="eyebrow">CIB401 · Lesson 0.1 · Overview</span>
<h2>Comprehensive Business Chinese 2</h2>
<p class="lead">CIB301 introduced you to basic business situations — self-introduction, ordering, small talk. <strong>CIB401 raises the register to HSK4-5</strong>: you will negotiate a deal, read and draft a contract clause, write a formal business email, discuss marketing strategy, handle import-export documents, talk banking &amp; corporate finance, and network at a trade fair — all in Mandarin.</p>
<h3>Roadmap</h3>
<ol>
<li><strong>商务谈判</strong> — Business negotiation</li>
<li><strong>合同条款</strong> — Contract clauses</li>
<li><strong>商务信函与邮件</strong> — Business correspondence &amp; email</li>
<li><strong>市场营销与产品推广</strong> — Marketing &amp; product promotion</li>
<li><strong>进出口贸易</strong> — Import-export trade</li>
<li><strong>银行、信贷与企业融资</strong> — Banking, credit &amp; corporate finance</li>
<li><strong>展会、交易会与建立关系</strong> — Trade fairs &amp; relationship-building (关系)</li>
<li><strong>复习</strong> — Review: complex business scenarios &amp; formal register</li>
</ol>
<p>Every chapter pairs a <strong>vocabulary table</strong> (hanzi + pinyin + meaning) with a <strong>realistic dialogue</strong> and business sentence patterns, closing with a quiz.</p>`,
    `<span class="eyebrow">CIB401 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung Thương mại Tổng hợp 2</h2>
<p class="lead">CIB301 đã đưa bạn vào các tình huống thương mại cơ bản — tự giới thiệu, đặt hàng, giao tiếp xã giao. <strong>CIB401 nâng trình độ lên HSK4-5</strong>: bạn sẽ đàm phán một hợp đồng, đọc và soạn điều khoản hợp đồng, viết email thương mại trang trọng, bàn chiến lược marketing, xử lý chứng từ xuất nhập khẩu, nói về ngân hàng &amp; tài chính doanh nghiệp, và giao tiếp tại hội chợ thương mại — toàn bộ bằng tiếng Trung.</p>
<h3>Lộ trình</h3>
<ol>
<li><strong>商务谈判</strong> — Đàm phán thương mại</li>
<li><strong>合同条款</strong> — Hợp đồng &amp; điều khoản</li>
<li><strong>商务信函与邮件</strong> — Thư tín &amp; email thương mại</li>
<li><strong>市场营销与产品推广</strong> — Marketing &amp; quảng bá sản phẩm</li>
<li><strong>进出口贸易</strong> — Thương mại quốc tế &amp; xuất nhập khẩu</li>
<li><strong>银行、信贷与企业融资</strong> — Ngân hàng, tín dụng &amp; tài chính doanh nghiệp</li>
<li><strong>展会、交易会与建立关系</strong> — Hội chợ, triển lãm &amp; xây dựng quan hệ (关系)</li>
<li><strong>复习</strong> — Ôn tập: tình huống thương mại phức hợp &amp; văn phong trang trọng</li>
</ol>
<p>Mỗi chương gồm một <strong>bảng từ vựng</strong> (chữ Hán + pinyin + nghĩa) đi cùng <strong>hội thoại thực tế</strong> và mẫu câu thương mại, kết thúc bằng một quiz.</p>`,
  ]]);

const c1 = doc('cib401-1-1-negotiation', '1.1 — Business negotiation (商务谈判)|||1.1 — Đàm phán thương mại (商务谈判)',
  'Từ vựng đàm phán: 报价/还价/让步/底线/双赢; hội thoại thương lượng giá &amp; số lượng; mẫu câu nhượng bộ có điều kiện.',
  [[
    `<span class="eyebrow">CIB401 · Chapter 1 · Lesson 1.1</span>
<h2>Business negotiation — 商务谈判 (shāngwù tánpàn)</h2>
<h3>Vocabulary</h3>
<pre><code>谈判  tánpàn      negotiation
报价  bàojià      quote a price / quotation
还价  huánjià     counter-offer
让步  ràngbù      concession, to give way
底线  dǐxiàn      bottom line
达成协议 dáchéng xiéyì  reach an agreement
优势  yōushì      advantage, upper hand
僵局  jiāngjú     deadlock, stalemate
双赢  shuāngyíng  win-win
条款  tiáokuǎn    clause, term
折扣  zhékòu      discount
成交  chéngjiāo   to close a deal
</code></pre>
<h3>Dialogue — negotiating price &amp; quantity</h3>
<pre><code>甲 (Buyer): 这批订单的报价能不能再优惠一点？
    Zhè pī dìngdān de bàojià néng bu néng zài yōuhuì yìdiǎn?
    "Can you give a better quote for this order?"
乙 (Seller): 您的订单量比较大，我们可以打九五折。
    Nín de dìngdān liàng bǐjiào dà, wǒmen kěyǐ dǎ jiǔwǔ zhé.
    "Your order volume is fairly large, we can give a 5% discount."
甲: 如果我们把订单量提高到一千件，价格还能不能再让一步？
    Rúguǒ wǒmen bǎ dìngdān liàng tígāo dào yìqiān jiàn, jiàgé hái néng bu néng zài ràng yíbù?
    "If we raise the order to 1,000 pieces, can the price come down further?"
乙: 如果数量达到一千件，我们可以给您打九折，但这已经是我们的底线了。
    Rúguǒ shùliàng dádào yìqiān jiàn, wǒmen kěyǐ gěi nín dǎ jiǔ zhé, dàn zhè yǐjīng shì wǒmen de dǐxiàn le.
    "At 1,000 pieces we can give a 10% discount, but that is our bottom line."
甲: 好，那就按九折、一千件成交。希望这次合作能达成双赢。
    Hǎo, nà jiù àn jiǔ zhé, yìqiān jiàn chéngjiāo. Xīwàng zhè cì hézuò néng dáchéng shuāngyíng.
    "Alright, deal at 10% off for 1,000 pieces. I hope this is a win-win."
乙: 没问题，我们马上准备合同，尽快发给您签署。
    Méi wèntí, wǒmen mǎshàng zhǔnbèi hétong, jǐnkuài fā gěi nín qiānshǔ.
    "No problem, we will prepare the contract right away and send it for signing."
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>如果……，我们可以……</strong> "If …, we can …" — a conditional concession: 如果数量增加，我们可以再让步。</li>
<li><strong>这已经是我们的底线了</strong> "That is already our bottom line" — closing a negotiation firmly but politely.</li>
</ul>
<div class="callout"><span class="badge">Tip</span> In Chinese negotiation, 面子 (face) matters as much as price — concede gradually and always frame the final deal as 双赢 (win-win), never as one side losing.</div>`,
    `<span class="eyebrow">CIB401 · Chương 1 · Bài 1.1</span>
<h2>Đàm phán thương mại — 商务谈判 (shāngwù tánpàn)</h2>
<h3>Từ vựng</h3>
<pre><code>谈判  tánpàn      đàm phán
报价  bàojià      báo giá / bảng giá
还价  huánjià     trả giá, mặc cả lại
让步  ràngbù      nhượng bộ
底线  dǐxiàn      giới hạn cuối cùng
达成协议 dáchéng xiéyì  đạt được thoả thuận
优势  yōushì      lợi thế
僵局  jiāngjú     bế tắc, đình trệ
双赢  shuāngyíng  cùng thắng (win-win)
条款  tiáokuǎn    điều khoản
折扣  zhékòu      chiết khấu, giảm giá
成交  chéngjiāo   chốt giao dịch
</code></pre>
<h3>Hội thoại — thương lượng giá &amp; số lượng</h3>
<pre><code>甲 (Bên mua): 这批订单的报价能不能再优惠一点？
    Zhè pī dìngdān de bàojià néng bu néng zài yōuhuì yìdiǎn?
    "Đơn hàng này giá có ưu đãi thêm được không?"
乙 (Bên bán): 您的订单量比较大，我们可以打九五折。
    Nín de dìngdān liàng bǐjiào dà, wǒmen kěyǐ dǎ jiǔwǔ zhé.
    "Số lượng đơn hàng của anh/chị khá lớn, chúng tôi có thể giảm 5%."
甲: 如果我们把订单量提高到一千件，价格还能不能再让一步？
    Rúguǒ wǒmen bǎ dìngdān liàng tígāo dào yìqiān jiàn, jiàgé hái néng bu néng zài ràng yíbù?
    "Nếu chúng tôi tăng số lượng lên 1000 chiếc, giá có nhượng bộ thêm được không?"
乙: 如果数量达到一千件，我们可以给您打九折，但这已经是我们的底线了。
    Rúguǒ shùliàng dádào yìqiān jiàn, wǒmen kěyǐ gěi nín dǎ jiǔ zhé, dàn zhè yǐjīng shì wǒmen de dǐxiàn le.
    "Nếu đủ 1000 chiếc, chúng tôi giảm 10%, nhưng đây đã là giới hạn cuối cùng."
甲: 好，那就按九折、一千件成交。希望这次合作能达成双赢。
    Hǎo, nà jiù àn jiǔ zhé, yìqiān jiàn chéngjiāo. Xīwàng zhè cì hézuò néng dáchéng shuāngyíng.
    "Được, vậy chốt giảm 10% cho 1000 chiếc. Mong hợp tác lần này cùng thắng."
乙: 没问题，我们马上准备合同，尽快发给您签署。
    Méi wèntí, wǒmen mǎshàng zhǔnbèi hétong, jǐnkuài fā gěi nín qiānshǔ.
    "Không vấn đề, chúng tôi chuẩn bị hợp đồng ngay và gửi để anh/chị ký."
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>如果……，我们可以……</strong> "Nếu …, chúng tôi có thể …" — nhượng bộ có điều kiện: 如果数量增加，我们可以再让步。</li>
<li><strong>这已经是我们的底线了</strong> "Đây đã là giới hạn cuối cùng của chúng tôi" — chốt đàm phán dứt khoát nhưng lịch sự.</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Trong đàm phán kiểu Trung Quốc, 面子 (thể diện) quan trọng không kém giá cả — nhượng bộ từng bước và luôn trình bày kết quả cuối là 双赢 (cùng thắng), không bên nào "thua".</div>`,
  ]]);

const c1q = quiz('cib401-quiz-1', 'Quiz 1 — Negotiation|||Quiz 1 — Đàm phán', [
  { id: 'q1', question: '"底线" trong đàm phán thương mại nghĩa là gì?', options: ['Ưu đãi ban đầu', 'Giới hạn cuối cùng (bottom line)', 'Hợp đồng mẫu', 'Danh sách khách hàng'], correctIndex: 1, explanation: '底线 (dǐxiàn) = giới hạn cuối cùng mà một bên không thể nhượng bộ thêm.' },
  { id: 'q2', question: '"打九折" nghĩa là mức chiết khấu bao nhiêu phần trăm?', options: ['Giảm 5%', 'Giảm 10%', 'Giảm 90%', 'Tăng 10%'], correctIndex: 1, explanation: '打九折 = tính giá bằng 90% giá gốc, tức giảm 10%.' },
  { id: 'q3', question: 'Từ nào diễn tả kết quả đàm phán mà cả hai bên đều có lợi?', options: ['僵局 (jiāngjú)', '还价 (huánjià)', '双赢 (shuāngyíng)', '折扣 (zhékòu)'], correctIndex: 2, explanation: '双赢 (shuāngyíng) = cùng thắng, win-win — cách khép lại đàm phán được ưa dùng.' },
]);

const c2 = doc('cib401-2-1-contract', '2.1 — Contract clauses (合同条款)|||2.1 — Hợp đồng & điều khoản (合同条款)',
  'Từ vựng hợp đồng: 甲方/乙方/违约/赔偿/不可抗力; đọc trích đoạn điều khoản; mẫu câu quy định nghĩa vụ &amp; hiệu lực.',
  [[
    `<span class="eyebrow">CIB401 · Chapter 2 · Lesson 2.1</span>
<h2>Contract clauses — 合同条款 (hétong tiáokuǎn)</h2>
<h3>Vocabulary</h3>
<pre><code>合同    hétong        contract
甲方    jiǎfāng       Party A
乙方    yǐfāng        Party B
条款    tiáokuǎn      clause, term
违约    wéiyuē        breach of contract
赔偿    péicháng      compensation
生效    shēngxiào     to take effect
终止    zhōngzhǐ      to terminate
附件    fùjiàn        attachment, annex
保密协议 bǎomì xiéyì   non-disclosure agreement (NDA)
不可抗力 bùkě kànglì   force majeure
签署    qiānshǔ       to sign
法律责任 fǎlǜ zérèn    legal liability
</code></pre>
<h3>Reading — a contract clause excerpt</h3>
<pre><code>第五条 (Article 5): 交货与验收
甲方应于本合同签署后三十日内交付货物；
乙方应在收货后七日内完成验收，逾期视为验收合格。

第八条 (Article 8): 违约责任
如任何一方违反本合同约定，违约方应向对方支付
合同总金额百分之十的违约金，并赔偿由此造成的损失。

第十二条 (Article 12): 不可抗力
因不可抗力（自然灾害、战争、政府行为等）导致
本合同无法履行的，双方均不承担违约责任，
但应及时通知对方并协商解决方案。
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>甲方应于……内……</strong> "Party A shall … within …" — deadlines: 甲方应于合同签署后三十日内交付货物。</li>
<li><strong>如……违反……，应……</strong> "If … breaches …, shall …" — liability clauses: 如乙方违反保密协议，应承担法律责任。</li>
</ul>
<div class="callout"><span class="badge">Tip</span> Business contracts almost always number clauses as 第N条 (Article N) — learn to scan for 甲方/乙方, dates, and penalty amounts (违约金) first; that is where most disputes originate.</div>`,
    `<span class="eyebrow">CIB401 · Chương 2 · Bài 2.1</span>
<h2>Hợp đồng &amp; điều khoản — 合同条款 (hétong tiáokuǎn)</h2>
<h3>Từ vựng</h3>
<pre><code>合同    hétong        hợp đồng
甲方    jiǎfāng       Bên A
乙方    yǐfāng        Bên B
条款    tiáokuǎn      điều khoản
违约    wéiyuē        vi phạm hợp đồng
赔偿    péicháng      bồi thường
生效    shēngxiào     có hiệu lực
终止    zhōngzhǐ      chấm dứt, kết thúc
附件    fùjiàn        phụ lục, tài liệu đính kèm
保密协议 bǎomì xiéyì   thoả thuận bảo mật (NDA)
不可抗力 bùkě kànglì   bất khả kháng
签署    qiānshǔ       ký kết
法律责任 fǎlǜ zérèn    trách nhiệm pháp lý
</code></pre>
<h3>Đọc — trích đoạn điều khoản hợp đồng</h3>
<pre><code>第五条 (Điều 5): Giao hàng và nghiệm thu
甲方应于本合同签署后三十日内交付货物；
(Bên A phải giao hàng trong vòng 30 ngày sau khi ký hợp đồng;)
乙方应在收货后七日内完成验收，逾期视为验收合格。
(Bên B phải nghiệm thu trong 7 ngày sau khi nhận hàng, quá hạn coi như đạt.)

第八条 (Điều 8): Trách nhiệm vi phạm hợp đồng
如任何一方违反本合同约定，违约方应向对方支付
合同总金额百分之十的违约金，并赔偿由此造成的损失。
(Nếu một bên vi phạm hợp đồng, bên vi phạm phải trả 10% giá trị hợp đồng
làm tiền phạt vi phạm, và bồi thường thiệt hại phát sinh.)

第十二条 (Điều 12): Bất khả kháng
因不可抗力（自然灾害、战争、政府行为等）导致
本合同无法履行的，双方均不承担违约责任，
但应及时通知对方并协商解决方案。
(Nếu bất khả kháng — thiên tai, chiến tranh, hành vi của chính quyền…
khiến hợp đồng không thể thực hiện, hai bên không chịu trách nhiệm vi phạm,
nhưng phải thông báo kịp thời và cùng bàn phương án xử lý.)
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>甲方应于……内……</strong> "Bên A phải … trong vòng …" — quy định thời hạn: 甲方应于合同签署后三十日内交付货物。</li>
<li><strong>如……违反……，应……</strong> "Nếu … vi phạm …, phải …" — điều khoản trách nhiệm: 如乙方违反保密协议，应承担法律责任。</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Hợp đồng thương mại hầu như luôn đánh số điều khoản theo 第N条 (Điều N) — hãy tập quét nhanh 甲方/乙方, ngày tháng, và số tiền phạt (违约金) trước tiên; đây là nơi phát sinh tranh chấp nhiều nhất.</div>`,
  ]]);

const c2q = quiz('cib401-quiz-2', 'Quiz 2 — Contracts|||Quiz 2 — Hợp đồng', [
  { id: 'q1', question: 'Trong hợp đồng tiếng Trung, "甲方" và "乙方" chỉ ai?', options: ['Toà án và luật sư', 'Bên A và Bên B (hai bên ký hợp đồng)', 'Ngân hàng và khách hàng', 'Người mua và người bán lẻ'], correctIndex: 1, explanation: '甲方 (jiǎfāng) = Bên A, 乙方 (yǐfāng) = Bên B — cách gọi chuẩn hai bên trong hợp đồng.' },
  { id: 'q2', question: '"不可抗力" (bùkě kànglì) tương ứng với khái niệm pháp lý nào?', options: ['Vi phạm hợp đồng', 'Bồi thường thiệt hại', 'Bất khả kháng (force majeure)', 'Bảo mật thông tin'], correctIndex: 2, explanation: '不可抗力 = force majeure — sự kiện bất khả kháng như thiên tai, chiến tranh.' },
  { id: 'q3', question: 'Nếu một bên "违约" (wéiyuē), điều gì thường xảy ra theo điều khoản hợp đồng?', options: ['Hợp đồng tự động có hiệu lực', 'Phải trả tiền phạt vi phạm và bồi thường', 'Được tăng chiết khấu', 'Không có hậu quả gì'], correctIndex: 1, explanation: '违约 = vi phạm hợp đồng → thường phải trả 违约金 (tiền phạt) và 赔偿 (bồi thường).' },
]);

const c3 = doc('cib401-3-1-correspondence', '3.1 — Business correspondence & email (商务信函与邮件)|||3.1 — Thư tín & email thương mại (商务信函与邮件)',
  'Cấu trúc email thương mại: 主题/尊敬的/敬请/顺祝商祺; mẫu email hỏi giá &amp; báo giá; văn phong trang trọng.',
  [[
    `<span class="eyebrow">CIB401 · Chapter 3 · Lesson 3.1</span>
<h2>Business correspondence &amp; email — 商务信函与邮件</h2>
<h3>Vocabulary</h3>
<pre><code>主题     zhǔtí        subject (of an email)
尊敬的   zūnjìng de   Dear / Respected (formal salutation)
回复     huífù        to reply
询价     xúnjià       price inquiry
报盘     bàopán       offer (trade term)
催函     cuīhán       reminder letter
抄送     chāosòng     CC (carbon copy)
敬请     jìngqǐng     kindly please (formal request)
顺祝商祺 shùnzhù shāngqí  closing greeting "wishing you business prosperity"
正式     zhèngshì     formal
语气     yǔqì         tone (of writing/speech)
</code></pre>
<h3>Sample email — price inquiry &amp; reply</h3>
<pre><code>主题：关于产品报价的询价

尊敬的张经理：
    您好！我是越南ABC公司的采购代表阮文英。
我方对贵公司的新款办公家具很感兴趣，希望了解
批量采购的报价及交货周期。敬请贵方在方便时提供
详细报价单及最小起订量，谢谢！
                              顺祝商祺
                              阮文英 谨上

——回复——
主题：回复：关于产品报价的询价

尊敬的阮女士：
    感谢您的询价。附件为我方最新报价单（含运费），
最小起订量为二百件，交货周期为下单后二十个工作日。
如有其他问题，欢迎随时联系。
                              顺祝商祺
                              张伟 谨上
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>尊敬的……：……您好！</strong> opening a formal letter.</li>
<li><strong>敬请贵方……，谢谢！</strong> a polite formal request.</li>
<li><strong>顺祝商祺</strong> a standard closing for business letters, roughly "wishing your business prosperity."</li>
</ul>
<div class="callout"><span class="badge">Tip</span> Formal Chinese business email always keeps 敬 (respect) words in the opening/closing (尊敬的…, 顺祝商祺) even when the body is brief and direct — dropping them reads as rude, not efficient.</div>`,
    `<span class="eyebrow">CIB401 · Chương 3 · Bài 3.1</span>
<h2>Thư tín &amp; email thương mại — 商务信函与邮件</h2>
<h3>Từ vựng</h3>
<pre><code>主题     zhǔtí        chủ đề (email)
尊敬的   zūnjìng de   Kính gửi / Kính mến (mở đầu trang trọng)
回复     huífù        trả lời
询价     xúnjià       hỏi giá
报盘     bàopán       báo giá chào bán (thuật ngữ ngoại thương)
催函     cuīhán       thư nhắc nhở
抄送     chāosòng     đồng gửi (CC)
敬请     jìngqǐng     kính mong (yêu cầu trang trọng)
顺祝商祺 shùnzhù shāngqí  câu chào cuối "kính chúc quý công ty phát đạt"
正式     zhèngshì     trang trọng, chính thức
语气     yǔqì         văn phong, ngữ điệu
</code></pre>
<h3>Email mẫu — hỏi giá &amp; báo giá</h3>
<pre><code>主题：关于产品报价的询价
(Chủ đề: Hỏi giá sản phẩm)

尊敬的张经理：
    您好！我是越南ABC公司的采购代表阮文英。
我方对贵公司的新款办公家具很感兴趣，希望了解
批量采购的报价及交货周期。敬请贵方在方便时提供
详细报价单及最小起订量，谢谢！
                              顺祝商祺
                              阮文英 谨上
(Kính gửi anh Trương — Tôi là Nguyễn Văn Anh, đại diện mua hàng
công ty ABC Việt Nam. Chúng tôi quan tâm đến dòng bàn ghế văn phòng
mới, mong được biết giá bán sỉ và thời gian giao hàng. Kính mong
quý công ty gửi báo giá chi tiết và số lượng đặt hàng tối thiểu.
Kính chúc quý công ty phát đạt. — Nguyễn Văn Anh)

——回复——
主题：回复：关于产品报价的询价

尊敬的阮女士：
    感谢您的询价。附件为我方最新报价单（含运费），
最小起订量为二百件，交货周期为下单后二十个工作日。
如有其他问题，欢迎随时联系。
                              顺祝商祺
                              张伟 谨上
(Kính gửi chị Nguyễn — Cảm ơn đã hỏi giá. Đính kèm là báo giá mới
nhất (đã gồm phí vận chuyển), số lượng đặt tối thiểu là 200 chiếc,
thời gian giao hàng 20 ngày làm việc sau khi đặt. Nếu còn thắc mắc
xin liên hệ. — Trương Vĩ)
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>尊敬的……：……您好！</strong> mở đầu thư trang trọng.</li>
<li><strong>敬请贵方……，谢谢！</strong> yêu cầu lịch sự, trang trọng.</li>
<li><strong>顺祝商祺</strong> câu chào cuối chuẩn cho thư thương mại, đại ý "kính chúc quý công ty phát đạt".</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Email thương mại trang trọng tiếng Trung luôn giữ các từ 敬 (kính trọng) ở đầu/cuối thư (尊敬的…, 顺祝商祺) dù nội dung chính ngắn gọn — bỏ đi sẽ bị coi là thiếu lễ độ, không phải là "gọn gàng, hiệu quả".</div>`,
  ]]);

const c3q = quiz('cib401-quiz-3', 'Quiz 3 — Correspondence|||Quiz 3 — Thư tín', [
  { id: 'q1', question: '"询价" (xúnjià) trong một email thương mại nghĩa là gì?', options: ['Xác nhận đơn hàng', 'Hỏi giá sản phẩm', 'Khiếu nại chất lượng', 'Ký hợp đồng'], correctIndex: 1, explanation: '询价 = hỏi giá — email mở đầu quy trình mua bán khi bên mua muốn biết báo giá.' },
  { id: 'q2', question: 'Câu chào cuối "顺祝商祺" thường xuất hiện ở đâu và mang ý nghĩa gì?', options: ['Đầu thư, xin lỗi vì trả lời chậm', 'Cuối thư, chúc đối tác kinh doanh phát đạt', 'Giữa thư, thông báo giá mới', 'Chủ đề email, tóm tắt nội dung'], correctIndex: 1, explanation: '顺祝商祺 nằm ở cuối thư thương mại, mang nghĩa chúc đối tác làm ăn phát đạt.' },
  { id: 'q3', question: 'Vì sao KHÔNG nên bỏ "尊敬的……" khi mở đầu email thương mại tiếng Trung dù nội dung ngắn?', options: ['Vì hệ thống email sẽ báo lỗi', 'Vì bỏ đi bị xem là thiếu lễ độ với đối tác', 'Vì đó là quy định pháp luật', 'Vì email sẽ bị đánh dấu spam'], correctIndex: 1, explanation: 'Văn phong thương mại tiếng Trung coi trọng các từ ngữ kính trọng ở đầu/cuối thư; bỏ đi đọc như bất lịch sự, không phải "súc tích".' },
]);

const c4 = doc('cib401-4-1-marketing', '4.1 — Marketing & product promotion (市场营销与产品推广)|||4.1 — Marketing & quảng bá sản phẩm (市场营销与产品推广)',
  'Từ vựng marketing: 品牌/目标市场/竞争对手/促销活动/口碑; hội thoại thảo luận chiến lược quảng bá sản phẩm mới.',
  [[
    `<span class="eyebrow">CIB401 · Chapter 4 · Lesson 4.1</span>
<h2>Marketing &amp; product promotion — 市场营销与产品推广</h2>
<h3>Vocabulary</h3>
<pre><code>市场营销   shìchǎng yíngxiāo  marketing
品牌       pǐnpái             brand
目标市场   mùbiāo shìchǎng    target market
推广       tuīguǎng           to promote
竞争对手   jìngzhēng duìshǒu  competitor
市场调研   shìchǎng diàoyán   market research
促销活动   cùxiāo huódòng     promotional campaign
客户群     kèhùqún            customer base
广告       guǎnggào           advertisement
口碑       kǒubēi             word of mouth, reputation
定位       dìngwèi            positioning
营销策略   yíngxiāo cèlüè     marketing strategy
</code></pre>
<h3>Dialogue — planning a promotion</h3>
<pre><code>甲: 这次新产品上市，我们的目标市场定在哪里？
    Zhè cì xīn chǎnpǐn shàngshì, wǒmen de mùbiāo shìchǎng dìng zài nǎlǐ?
    "For this new product launch, where should we set our target market?"
乙: 根据市场调研，年轻白领是我们的主要客户群。
    Gēnjù shìchǎng diàoyán, niánqīng báilíng shì wǒmen de zhǔyào kèhùqún.
    "According to our market research, young office workers are our main customer base."
甲: 那我们的品牌定位应该突出什么？
    Nà wǒmen de pǐnpái dìngwèi yīnggāi tūchū shénme?
    "So what should our brand positioning emphasize?"
乙: 应该突出性价比，同时也要注意竞争对手的促销活动。
    Yīnggāi tūchū xìngjiàbǐ, tóngshí yě yào zhùyì jìngzhēng duìshǒu de cùxiāo huódòng.
    "We should emphasize value for money, while also watching competitors' promotions."
甲: 好的，好的口碑比广告更有效，我们要重视客户体验。
    Hǎo de, hǎo de kǒubēi bǐ guǎnggào gèng yǒuxiào, wǒmen yào zhòngshì kèhù tǐyàn.
    "Right, good word of mouth is more effective than advertising, we must focus on customer experience."
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>根据……，……是我们的……</strong> "According to …, … is our …" — presenting research findings.</li>
<li><strong>……比……更有效</strong> "… is more effective than …" — comparing marketing channels.</li>
</ul>
<div class="callout"><span class="badge">Tip</span> 口碑 (word of mouth) and 关系 (relationships, chapter 7) matter more in the Chinese market than pure advertising spend — many marketing strategies lean on social proof and referrals.</div>`,
    `<span class="eyebrow">CIB401 · Chương 4 · Bài 4.1</span>
<h2>Marketing &amp; quảng bá sản phẩm — 市场营销与产品推广</h2>
<h3>Từ vựng</h3>
<pre><code>市场营销   shìchǎng yíngxiāo  marketing
品牌       pǐnpái             thương hiệu
目标市场   mùbiāo shìchǎng    thị trường mục tiêu
推广       tuīguǎng           quảng bá
竞争对手   jìngzhēng duìshǒu  đối thủ cạnh tranh
市场调研   shìchǎng diàoyán   nghiên cứu thị trường
促销活动   cùxiāo huódòng     chương trình khuyến mãi
客户群     kèhùqún            nhóm khách hàng
广告       guǎnggào           quảng cáo
口碑       kǒubēi             truyền miệng, danh tiếng
定位       dìngwèi            định vị
营销策略   yíngxiāo cèlüè     chiến lược marketing
</code></pre>
<h3>Hội thoại — lập kế hoạch quảng bá</h3>
<pre><code>甲: 这次新产品上市，我们的目标市场定在哪里？
    Zhè cì xīn chǎnpǐn shàngshì, wǒmen de mùbiāo shìchǎng dìng zài nǎlǐ?
    "Lần ra mắt sản phẩm mới này, thị trường mục tiêu của mình xác định ở đâu?"
乙: 根据市场调研，年轻白领是我们的主要客户群。
    Gēnjù shìchǎng diàoyán, niánqīng báilíng shì wǒmen de zhǔyào kèhùqún.
    "Theo nghiên cứu thị trường, nhân viên văn phòng trẻ là nhóm khách hàng chính."
甲: 那我们的品牌定位应该突出什么？
    Nà wǒmen de pǐnpái dìngwèi yīnggāi tūchū shénme?
    "Vậy định vị thương hiệu của mình nên nhấn vào điểm gì?"
乙: 应该突出性价比，同时也要注意竞争对手的促销活动。
    Yīnggāi tūchū xìngjiàbǐ, tóngshí yě yào zhùyì jìngzhēng duìshǒu de cùxiāo huódòng.
    "Nên nhấn vào tỷ lệ giá/chất lượng, đồng thời cũng phải theo dõi khuyến mãi của đối thủ."
甲: 好的，好的口碑比广告更有效，我们要重视客户体验。
    Hǎo de, hǎo de kǒubēi bǐ guǎnggào gèng yǒuxiào, wǒmen yào zhòngshì kèhù tǐyàn.
    "Được, truyền miệng tốt hiệu quả hơn quảng cáo, mình phải chú trọng trải nghiệm khách hàng."
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>根据……，……是我们的……</strong> "Theo …, … là … của chúng ta" — trình bày kết quả nghiên cứu.</li>
<li><strong>……比……更有效</strong> "… hiệu quả hơn …" — so sánh các kênh marketing.</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> 口碑 (truyền miệng) và 关系 (quan hệ, chương 7) quan trọng hơn cả chi tiêu quảng cáo trên thị trường Trung Quốc — nhiều chiến lược marketing dựa vào bằng chứng xã hội và giới thiệu qua người quen.</div>`,
  ]]);

const c4q = quiz('cib401-quiz-4', 'Quiz 4 — Marketing|||Quiz 4 — Marketing', [
  { id: 'q1', question: '"目标市场" (mùbiāo shìchǎng) nghĩa là gì?', options: ['Đối thủ cạnh tranh', 'Thị trường mục tiêu', 'Chương trình khuyến mãi', 'Nghiên cứu thị trường'], correctIndex: 1, explanation: '目标市场 = thị trường mục tiêu — nhóm khách hàng doanh nghiệp muốn nhắm tới.' },
  { id: 'q2', question: 'Theo bài học, yếu tố nào được xem là quan trọng hơn quảng cáo (广告) trên thị trường Trung Quốc?', options: ['价格 (giá)', '口碑 (truyền miệng)', '包装 (bao bì)', '库存 (tồn kho)'], correctIndex: 1, explanation: 'Bài học nhấn mạnh 口碑 (word of mouth) thường hiệu quả hơn quảng cáo thuần túy.' },
  { id: 'q3', question: '"促销活动" là thuật ngữ chỉ điều gì?', options: ['Chương trình khuyến mãi', 'Hợp đồng bảo mật', 'Chứng từ hải quan', 'Báo cáo tài chính'], correctIndex: 0, explanation: '促销活动 (cùxiāo huódòng) = chương trình/hoạt động khuyến mãi.' },
]);

const c5 = doc('cib401-5-1-import-export', '5.1 — International trade & import-export (进出口贸易)|||5.1 — Thương mại quốc tế & xuất nhập khẩu (进出口贸易)',
  'Từ vựng ngoại thương: 报关/关税/信用证/提单/离岸价/到岸价; hội thoại xử lý chứng từ xuất khẩu.',
  [[
    `<span class="eyebrow">CIB401 · Chapter 5 · Lesson 5.1</span>
<h2>International trade &amp; import-export — 进出口贸易</h2>
<h3>Vocabulary</h3>
<pre><code>进出口     jìnchūkǒu       import &amp; export
报关       bàoguān         customs declaration
关税       guānshuì        tariff, customs duty
提单       tídān           bill of lading
信用证     xìnyòngzhèng    letter of credit (L/C)
装运       zhuāngyùn       shipment
集装箱     jízhuāngxiāng   container
原产地证   yuánchǎndìzhèng certificate of origin
报关行     bàoguānháng     customs broker
离岸价     lí'ànjià        FOB price (free on board)
到岸价     dào'ànjià       CIF price (cost, insurance, freight)
贸易壁垒   màoyì bìlěi     trade barrier
</code></pre>
<h3>Dialogue — export documentation</h3>
<pre><code>甲 (Exporter): 这批货物准备装运，报关手续都办好了吗？
    Zhè pī huòwù zhǔnbèi zhuāngyùn, bàoguān shǒuxù dōu bàn hǎo le ma?
    "This shipment is ready to load, is the customs declaration done?"
乙 (Broker): 都办好了，原产地证和提单也已经准备齐全。
    Dōu bàn hǎo le, yuánchǎndìzhèng hé tídān yě yǐjīng zhǔnbèi qíquán.
    "All done, the certificate of origin and bill of lading are also complete."
甲: 买方要求用信用证付款，这次报价是离岸价还是到岸价？
    Mǎifāng yāoqiú yòng xìnyòngzhèng fùkuǎn, zhè cì bàojià shì lí'ànjià háishì dào'ànjià?
    "The buyer wants to pay by L/C, is this quote FOB or CIF?"
乙: 合同里写的是到岸价，运费和保险费都由我方承担。
    Hétong lǐ xiě de shì dào'ànjià, yùnfèi hé bǎoxiǎnfèi dōu yóu wǒfāng chéngdān.
    "The contract states CIF, we bear both freight and insurance."
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>……手续都办好了吗？</strong> "Is … procedure all done?" — checking documentation status.</li>
<li><strong>由……承担</strong> "borne by …" — assigning who pays a cost (运费由卖方承担).</li>
</ul>
<div class="callout"><span class="badge">Tip</span> Know your Incoterms in Chinese: 离岸价 (FOB) — seller's cost ends at the port; 到岸价 (CIF) — seller also pays freight &amp; insurance to destination. Misreading this in a contract shifts real money.</div>`,
    `<span class="eyebrow">CIB401 · Chương 5 · Bài 5.1</span>
<h2>Thương mại quốc tế &amp; xuất nhập khẩu — 进出口贸易</h2>
<h3>Từ vựng</h3>
<pre><code>进出口     jìnchūkǒu       xuất nhập khẩu
报关       bàoguān         khai báo hải quan
关税       guānshuì        thuế quan
提单       tídān           vận đơn (bill of lading)
信用证     xìnyòngzhèng    thư tín dụng (L/C)
装运       zhuāngyùn       xếp hàng, giao vận
集装箱     jízhuāngxiāng   container
原产地证   yuánchǎndìzhèng giấy chứng nhận xuất xứ
报关行     bàoguānháng     đại lý khai báo hải quan
离岸价     lí'ànjià        giá FOB (giao tại cảng đi)
到岸价     dào'ànjià       giá CIF (gồm cước &amp; bảo hiểm)
贸易壁垒   màoyì bìlěi     rào cản thương mại
</code></pre>
<h3>Hội thoại — chứng từ xuất khẩu</h3>
<pre><code>甲 (Bên xuất khẩu): 这批货物准备装运，报关手续都办好了吗？
    Zhè pī huòwù zhǔnbèi zhuāngyùn, bàoguān shǒuxù dōu bàn hǎo le ma?
    "Lô hàng này sắp xếp lên tàu, thủ tục hải quan xong hết chưa?"
乙 (Đại lý hải quan): 都办好了，原产地证和提单也已经准备齐全。
    Dōu bàn hǎo le, yuánchǎndìzhèng hé tídān yě yǐjīng zhǔnbèi qíquán.
    "Xong hết rồi, giấy chứng nhận xuất xứ và vận đơn cũng đã chuẩn bị đầy đủ."
甲: 买方要求用信用证付款，这次报价是离岸价还是到岸价？
    Mǎifāng yāoqiú yòng xìnyòngzhèng fùkuǎn, zhè cì bàojià shì lí'ànjià háishì dào'ànjià?
    "Bên mua yêu cầu thanh toán bằng L/C, lần này báo giá là FOB hay CIF?"
乙: 合同里写的是到岸价，运费和保险费都由我方承担。
    Hétong lǐ xiě de shì dào'ànjià, yùnfèi hé bǎoxiǎnfèi dōu yóu wǒfāng chéngdān.
    "Trong hợp đồng ghi là giá CIF, cước vận chuyển và bảo hiểm bên mình chịu."
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>……手续都办好了吗？</strong> "Thủ tục … xong hết chưa?" — kiểm tra tình trạng chứng từ.</li>
<li><strong>由……承担</strong> "do … chịu" — quy định ai chi trả một khoản phí (运费由卖方承担).</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Nắm chắc Incoterms bằng tiếng Trung: 离岸价 (FOB) — bên bán chỉ chịu chi phí tới cảng đi; 到岸价 (CIF) — bên bán chịu luôn cước vận chuyển &amp; bảo hiểm tới đích. Đọc sai điều này trong hợp đồng là mất tiền thật.</div>`,
  ]]);

const c5q = quiz('cib401-quiz-5', 'Quiz 5 — Import-export|||Quiz 5 — Xuất nhập khẩu', [
  { id: 'q1', question: '"信用证" (xìnyòngzhèng) là công cụ thanh toán quốc tế nào?', options: ['Séc du lịch', 'Thư tín dụng (L/C)', 'Thẻ tín dụng doanh nghiệp', 'Chuyển khoản tay'], correctIndex: 1, explanation: '信用证 = Letter of Credit (L/C), công cụ thanh toán phổ biến trong ngoại thương.' },
  { id: 'q2', question: 'Sự khác biệt chính giữa "离岸价" (FOB) và "到岸价" (CIF) là gì?', options: ['FOB gồm cả thuế nhập khẩu, CIF không', 'CIF bên bán chịu thêm cước vận chuyển & bảo hiểm, FOB thì không', 'Không có khác biệt, chỉ là cách gọi khác nhau', 'FOB chỉ dùng cho hàng đường bộ'], correctIndex: 1, explanation: 'CIF (到岸价) bên bán chịu vận chuyển + bảo hiểm tới đích; FOB (离岸价) bên bán chỉ chịu tới cảng đi.' },
  { id: 'q3', question: '"原产地证" dùng để chứng minh điều gì cho một lô hàng xuất khẩu?', options: ['Giá trị bảo hiểm hàng hoá', 'Xuất xứ của hàng hoá', 'Số dư tài khoản người mua', 'Thời hạn bảo hành sản phẩm'], correctIndex: 1, explanation: '原产地证 (certificate of origin) chứng minh nước sản xuất/xuất xứ của hàng hoá.' },
]);

const c6 = doc('cib401-6-1-banking-finance', '6.1 — Banking, credit & corporate finance (银行、信贷与企业融资)|||6.1 — Ngân hàng, tín dụng & tài chính doanh nghiệp (银行、信贷与企业融资)',
  'Từ vựng tài chính: 贷款/利率/融资/现金流/汇率/风险评估; hội thoại xin vay vốn kinh doanh tại ngân hàng.',
  [[
    `<span class="eyebrow">CIB401 · Chapter 6 · Lesson 6.1</span>
<h2>Banking, credit &amp; corporate finance — 银行、信贷与企业融资</h2>
<h3>Vocabulary</h3>
<pre><code>贷款     dàikuǎn       loan
利率     lìlǜ          interest rate
信贷     xìndài        credit
融资     róngzī        financing
抵押     dǐyā          collateral, mortgage
还款     huánkuǎn      repayment
现金流   xiànjīnliú    cash flow
信用额度 xìnyòng édù   credit limit
汇率     huìlǜ         exchange rate
投资     tóuzī         investment
风险评估 fēngxiǎn pínggū risk assessment
股东     gǔdōng        shareholder
</code></pre>
<h3>Dialogue — applying for a business loan</h3>
<pre><code>甲 (Company rep): 我们公司想申请一笔贷款用于扩大生产，请问利率是多少？
    Wǒmen gōngsī xiǎng shēnqǐng yì bǐ dàikuǎn yòngyú kuòdà shēngchǎn, qǐngwèn lìlǜ shì duōshǎo?
    "Our company wants to apply for a loan to expand production, what is the interest rate?"
乙 (Bank officer): 需要先做风险评估，还要看贵公司近期的现金流状况。
    Xūyào xiān zuò fēngxiǎn pínggū, hái yào kàn guì gōngsī jìnqī de xiànjīnliú zhuàngkuàng.
    "We need a risk assessment first, and also to check your company's recent cash flow."
甲: 我们可以提供厂房作为抵押，融资额度大概需要五百万元。
    Wǒmen kěyǐ tígōng chǎngfáng zuòwéi dǐyā, róngzī édù dàgài xūyào wǔbǎi wàn yuán.
    "We can offer the factory building as collateral, we need about 5 million yuan in financing."
乙: 好的，通过审批后，还款期限可以设定为五年，按月还款。
    Hǎo de, tōngguò shěnpī hòu, huánkuǎn qīxiàn kěyǐ shèdìng wéi wǔ nián, àn yuè huánkuǎn.
    "Alright, once approved, the repayment period can be set at 5 years, paid monthly."
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>申请一笔贷款用于……</strong> "apply for a loan for the purpose of …" — stating loan purpose.</li>
<li><strong>提供……作为抵押</strong> "offer … as collateral" — securing financing.</li>
</ul>
<div class="callout"><span class="badge">Tip</span> 汇率 (exchange rate) risk is a constant topic when a Vietnamese company borrows or invoices in RMB — always clarify whether a quoted price/loan is locked to USD, VND or RMB.</div>`,
    `<span class="eyebrow">CIB401 · Chương 6 · Bài 6.1</span>
<h2>Ngân hàng, tín dụng &amp; tài chính doanh nghiệp — 银行、信贷与企业融资</h2>
<h3>Từ vựng</h3>
<pre><code>贷款     dàikuǎn       vay vốn, khoản vay
利率     lìlǜ          lãi suất
信贷     xìndài        tín dụng
融资     róngzī        tài trợ vốn, huy động vốn
抵押     dǐyā          thế chấp, tài sản đảm bảo
还款     huánkuǎn      trả nợ, hoàn trả
现金流   xiànjīnliú    dòng tiền
信用额度 xìnyòng édù   hạn mức tín dụng
汇率     huìlǜ         tỷ giá hối đoái
投资     tóuzī         đầu tư
风险评估 fēngxiǎn pínggū đánh giá rủi ro
股东     gǔdōng        cổ đông
</code></pre>
<h3>Hội thoại — xin vay vốn kinh doanh</h3>
<pre><code>甲 (Đại diện công ty): 我们公司想申请一笔贷款用于扩大生产，请问利率是多少？
    Wǒmen gōngsī xiǎng shēnqǐng yì bǐ dàikuǎn yòngyú kuòdà shēngchǎn, qǐngwèn lìlǜ shì duōshǎo?
    "Công ty chúng tôi muốn xin một khoản vay để mở rộng sản xuất, lãi suất là bao nhiêu?"
乙 (Nhân viên ngân hàng): 需要先做风险评估，还要看贵公司近期的现金流状况。
    Xūyào xiān zuò fēngxiǎn pínggū, hái yào kàn guì gōngsī jìnqī de xiànjīnliú zhuàngkuàng.
    "Cần đánh giá rủi ro trước, và cũng phải xem tình hình dòng tiền gần đây của công ty."
甲: 我们可以提供厂房作为抵押，融资额度大概需要五百万元。
    Wǒmen kěyǐ tígōng chǎngfáng zuòwéi dǐyā, róngzī édù dàgài xūyào wǔbǎi wàn yuán.
    "Chúng tôi có thể dùng nhà máy làm tài sản đảm bảo, hạn mức tài trợ khoảng 5 triệu nhân dân tệ."
乙: 好的，通过审批后，还款期限可以设定为五年，按月还款。
    Hǎo de, tōngguò shěnpī hòu, huánkuǎn qīxiàn kěyǐ shèdìng wéi wǔ nián, àn yuè huánkuǎn.
    "Được, sau khi phê duyệt, thời hạn trả nợ có thể đặt là 5 năm, trả theo tháng."
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>申请一笔贷款用于……</strong> "xin một khoản vay để …" — nêu mục đích vay vốn.</li>
<li><strong>提供……作为抵押</strong> "dùng … làm tài sản đảm bảo" — bảo đảm cho khoản tài trợ.</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Rủi ro 汇率 (tỷ giá) luôn là vấn đề khi doanh nghiệp Việt Nam vay vốn hoặc xuất hoá đơn bằng nhân dân tệ — luôn làm rõ giá/khoản vay được chốt theo USD, VND hay RMB.</div>`,
  ]]);

const c6q = quiz('cib401-quiz-6', 'Quiz 6 — Banking & finance|||Quiz 6 — Ngân hàng & tài chính', [
  { id: 'q1', question: '"抵押" (dǐyā) trong hồ sơ vay vốn nghĩa là gì?', options: ['Lãi suất', 'Tài sản thế chấp/đảm bảo', 'Cổ đông', 'Tỷ giá hối đoái'], correctIndex: 1, explanation: '抵押 = thế chấp, tài sản đảm bảo cho khoản vay.' },
  { id: 'q2', question: 'Trước khi phê duyệt khoản vay, ngân hàng thường yêu cầu làm gì?', options: ['风险评估 (đánh giá rủi ro)', '促销活动 (chương trình khuyến mãi)', '报关 (khai báo hải quan)', '市场调研 (nghiên cứu thị trường)'], correctIndex: 0, explanation: '风险评估 (fēngxiǎn pínggū) là bước ngân hàng thực hiện trước khi phê duyệt khoản vay.' },
  { id: 'q3', question: '"现金流" (xiànjīnliú) là thuật ngữ tài chính chỉ điều gì?', options: ['Dòng tiền của doanh nghiệp', 'Danh sách cổ đông', 'Hạn mức tín dụng', 'Tỷ giá hối đoái'], correctIndex: 0, explanation: '现金流 = cash flow, dòng tiền vào/ra của doanh nghiệp.' },
]);

const c7 = doc('cib401-7-1-trade-fair-guanxi', '7.1 — Trade fairs, exhibitions & relationship-building (展会、交易会与建立关系)|||7.1 — Hội chợ, triển lãm & xây dựng quan hệ (展会、交易会与建立关系)',
  'Từ vựng hội chợ &amp; quan hệ: 展位/名片/关系/宴请/敬酒/长期合作; hội thoại giao lưu tại triển lãm thương mại.',
  [[
    `<span class="eyebrow">CIB401 · Chapter 7 · Lesson 7.1</span>
<h2>Trade fairs &amp; relationship-building — 展会、交易会与建立关系</h2>
<h3>Vocabulary</h3>
<pre><code>展会       zhǎnhuì        exhibition
交易会     jiāoyìhuì      trade fair
展位       zhǎnwèi        exhibition booth
名片       míngpiàn       business card
关系       guānxi         relationships, connections
应酬       yìngchou       social entertaining (of clients)
宴请       yànqǐng        to host a banquet
敬酒       jìngjiǔ        to toast (drinking)
客户拜访   kèhù bàifǎng   client visit
商务礼仪   shāngwù lǐyí   business etiquette
建立信任   jiànlì xìnrèn  to build trust
长期合作   chángqī hézuò  long-term cooperation
</code></pre>
<h3>Dialogue — meeting a partner at a trade fair</h3>
<pre><code>甲: 您好，这是我的名片，很高兴在这次交易会认识您。
    Nín hǎo, zhè shì wǒ de míngpiàn, hěn gāoxìng zài zhè cì jiāoyìhuì rènshi nín.
    "Hello, here is my business card, glad to meet you at this trade fair."
乙: 谢谢，久闻大名。你们公司的展位设计得很有特色。
    Xièxie, jiǔwén dàmíng. Nǐmen gōngsī de zhǎnwèi shèjì de hěn yǒu tèsè.
    "Thank you, I have heard much about you. Your company's booth is very distinctive."
甲: 过奖了。晚上我们想宴请您，希望能进一步建立信任。
    Guòjiǎng le. Wǎnshàng wǒmen xiǎng yànqǐng nín, xīwàng néng jìnyíbù jiànlì xìnrèn.
    "You are too kind. Tonight we would like to host a dinner, hoping to build more trust."
乙: 太客气了，那我们敬一杯，希望以后能长期合作。
    Tài kèqi le, nà wǒmen jìng yì bēi, xīwàng yǐhòu néng chángqī hézuò.
    "You are too polite, let us toast then — hoping for long-term cooperation ahead."
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>久闻大名</strong> "I have long heard of your reputation" — a polite formal greeting.</li>
<li><strong>希望以后能长期合作</strong> "hoping for long-term cooperation in the future" — a standard closing toast line.</li>
</ul>
<div class="callout"><span class="badge">Tip</span> 关系 (guānxi) is built over dinner tables and toasts (敬酒), not only in meeting rooms — declining a reasonable 宴请 invitation can read as rejecting the relationship itself.</div>`,
    `<span class="eyebrow">CIB401 · Chương 7 · Bài 7.1</span>
<h2>Hội chợ, triển lãm &amp; xây dựng quan hệ — 展会、交易会与建立关系</h2>
<h3>Từ vựng</h3>
<pre><code>展会       zhǎnhuì        hội chợ, triển lãm
交易会     jiāoyìhuì      hội chợ thương mại
展位       zhǎnwèi        gian hàng trưng bày
名片       míngpiàn       danh thiếp
关系       guānxi         quan hệ, mối quan hệ
应酬       yìngchou       giao tiếp xã giao (tiếp đãi khách hàng)
宴请       yànqǐng        thết đãi, mời tiệc
敬酒       jìngjiǔ        chúc rượu, mời uống
客户拜访   kèhù bàifǎng   thăm khách hàng
商务礼仪   shāngwù lǐyí   nghi thức thương mại
建立信任   jiànlì xìnrèn  xây dựng lòng tin
长期合作   chángqī hézuò  hợp tác lâu dài
</code></pre>
<h3>Hội thoại — gặp đối tác tại hội chợ thương mại</h3>
<pre><code>甲: 您好，这是我的名片，很高兴在这次交易会认识您。
    Nín hǎo, zhè shì wǒ de míngpiàn, hěn gāoxìng zài zhè cì jiāoyìhuì rènshi nín.
    "Xin chào, đây là danh thiếp của tôi, rất vui được biết anh tại hội chợ lần này."
乙: 谢谢，久闻大名。你们公司的展位设计得很有特色。
    Xièxie, jiǔwén dàmíng. Nǐmen gōngsī de zhǎnwèi shèjì de hěn yǒu tèsè.
    "Cảm ơn, tôi đã nghe danh anh từ lâu. Gian hàng công ty anh thiết kế rất ấn tượng."
甲: 过奖了。晚上我们想宴请您，希望能进一步建立信任。
    Guòjiǎng le. Wǎnshàng wǒmen xiǎng yànqǐng nín, xīwàng néng jìnyíbù jiànlì xìnrèn.
    "Anh quá khen. Tối nay chúng tôi muốn mời anh dùng cơm, hy vọng xây dựng thêm lòng tin."
乙: 太客气了，那我们敬一杯，希望以后能长期合作。
    Tài kèqi le, nà wǒmen jìng yì bēi, xīwàng yǐhòu néng chángqī hézuò.
    "Anh khách sáo quá, vậy nâng ly nào — hy vọng sau này hợp tác lâu dài."
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>久闻大名</strong> "Đã nghe danh anh từ lâu" — lời chào lịch sự trang trọng.</li>
<li><strong>希望以后能长期合作</strong> "Hy vọng sau này hợp tác lâu dài" — câu chúc rượu khép lại cuộc gặp thường dùng.</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> 关系 (quan hệ) được xây trên bàn tiệc và ly rượu chúc (敬酒), không chỉ trong phòng họp — từ chối một lời mời 宴请 hợp lý có thể bị hiểu là từ chối cả mối quan hệ.</div>`,
  ]]);

const c7q = quiz('cib401-quiz-7', 'Quiz 7 — Trade fairs & guanxi|||Quiz 7 — Hội chợ & quan hệ', [
  { id: 'q1', question: '"关系" (guānxi) trong văn hoá kinh doanh Trung Quốc chỉ điều gì?', options: ['Hợp đồng ràng buộc pháp lý', 'Mạng lưới quan hệ / mối liên hệ cá nhân', 'Giá thành sản phẩm', 'Thuế xuất nhập khẩu'], correctIndex: 1, explanation: '关系 (guānxi) = mạng lưới quan hệ cá nhân, yếu tố quan trọng trong kinh doanh tại Trung Quốc.' },
  { id: 'q2', question: '"敬酒" (jìngjiǔ) là hành động gì thường diễn ra trong các buổi 宴请 (tiếp khách)?', options: ['Ký hợp đồng chính thức', 'Chúc rượu, mời uống', 'Trao danh thiếp', 'Kiểm tra hàng mẫu'], correctIndex: 1, explanation: '敬酒 = chúc rượu/mời uống, một nghi thức xã giao phổ biến trong tiếp đãi kinh doanh.' },
  { id: 'q3', question: 'Vì sao từ chối một lời mời 宴请 hợp lý có thể gây bất lợi trong quan hệ kinh doanh?', options: ['Vì luôn bị phạt tiền hợp đồng', 'Vì có thể bị hiểu là từ chối xây dựng mối quan hệ (关系)', 'Vì hội chợ sẽ không cấp danh thiếp mới', 'Vì giá hàng sẽ tự động tăng'], correctIndex: 1, explanation: 'Trong văn hoá kinh doanh Trung Quốc, từ chối tiếp đãi hợp lý dễ bị coi là từ chối cả mối quan hệ (关系).' },
]);

const c8 = doc('cib401-8-1-review', '8.1 — Review: complex scenarios & formal register (综合商务情景与正式文体)|||8.1 — Ôn tập: tình huống thương mại phức hợp & văn phong trang trọng (综合商务情景与正式文体)',
  'Ôn tập từ vựng 8 chương; hội thoại tổng hợp kết hợp đàm phán, hợp đồng, email trong một tình huống; bảng so sánh văn phong trang trọng vs. thân mật.',
  [[
    `<span class="eyebrow">CIB401 · Chapter 8 · Lesson 8.1 · Review</span>
<h2>Review — complex scenarios &amp; formal register</h2>
<h3>Vocabulary recap (one term per chapter)</h3>
<pre><code>1. 谈判 tánpàn        negotiation
2. 合同 hétong         contract
3. 尊敬的 zūnjìng de   formal salutation
4. 品牌 pǐnpái         brand
5. 信用证 xìnyòngzhèng letter of credit
6. 融资 róngzī         financing
7. 关系 guānxi         relationships
8. 正式文体 zhèngshì wéntǐ  formal register
</code></pre>
<h3>Combined scenario — from negotiation to signed contract</h3>
<pre><code>1. 展会认识 (met at a trade fair) -> exchange 名片, build 关系
2. 邮件询价 (email inquiry) -> 尊敬的……, request 报价
3. 电话谈判 (phone negotiation) -> 还价, agree on 折扣, avoid 僵局
4. 合同签署 (sign contract) -> confirm 甲方/乙方, 条款, 违约责任
5. 银行开证 (bank issues L/C) -> 信用证, confirm 到岸价
6. 装运出口 (ship &amp; export) -> 报关, 提单, 原产地证
7. 长期维护 (long-term maintenance) -> 宴请, 敬酒, 长期合作
</code></pre>
<h3>Formal vs. casual register — same message, two styles</h3>
<pre><code>Casual (informal, colleagues):
  "价格能不能便宜点？我们量挺大的。"
Formal (business register):
  "敬请贵方考虑我方订单量，给予适当的价格优惠，谢谢。"
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> In writing (contracts, email) always default to 正式文体 (formal register): 尊敬的, 敬请, 贵方/我方 instead of 你们/我们. In spoken negotiation, brief informal phrasing is acceptable once rapport (关系) is established.</div>`,
    `<span class="eyebrow">CIB401 · Chương 8 · Bài 8.1 · Ôn tập</span>
<h2>Ôn tập — tình huống phức hợp &amp; văn phong trang trọng</h2>
<h3>Ôn lại từ vựng (một từ tiêu biểu mỗi chương)</h3>
<pre><code>1. 谈判 tánpàn        đàm phán
2. 合同 hétong         hợp đồng
3. 尊敬的 zūnjìng de   mở đầu trang trọng
4. 品牌 pǐnpái         thương hiệu
5. 信用证 xìnyòngzhèng thư tín dụng
6. 融资 róngzī         tài trợ vốn
7. 关系 guānxi         quan hệ
8. 正式文体 zhèngshì wéntǐ  văn phong trang trọng
</code></pre>
<h3>Tình huống tổng hợp — từ đàm phán tới hợp đồng ký kết</h3>
<pre><code>1. 展会认识 (gặp nhau tại hội chợ) -> trao 名片, xây dựng 关系
2. 邮件询价 (email hỏi giá) -> 尊敬的……, yêu cầu 报价
3. 电话谈判 (đàm phán qua điện thoại) -> 还价, thống nhất 折扣, tránh 僵局
4. 合同签署 (ký hợp đồng) -> xác nhận 甲方/乙方, 条款, trách nhiệm 违约
5. 银行开证 (ngân hàng mở L/C) -> 信用证, xác nhận giá 到岸价
6. 装运出口 (xếp hàng xuất khẩu) -> 报关, 提单, 原产地证
7. 长期维护 (duy trì quan hệ lâu dài) -> 宴请, 敬酒, 长期合作
</code></pre>
<h3>Văn phong trang trọng vs. thân mật — cùng một ý, hai cách nói</h3>
<pre><code>Thân mật (đồng nghiệp, không chính thức):
  "价格能不能便宜点？我们量挺大的。"
  (Giá có rẻ hơn được không? Số lượng bên mình khá lớn đó.)
Trang trọng (văn phong thương mại):
  "敬请贵方考虑我方订单量，给予适当的价格优惠，谢谢。"
  (Kính mong quý công ty xem xét số lượng đơn hàng của chúng tôi
   và dành mức ưu đãi giá phù hợp, xin cảm ơn.)
</code></pre>
<div class="callout"><span class="badge">Lưu ý khi thi</span> Trong văn viết (hợp đồng, email) luôn mặc định dùng 正式文体 (văn phong trang trọng): 尊敬的, 敬请, 贵方/我方 thay cho 你们/我们. Trong đàm phán nói, cách diễn đạt ngắn gọn thân mật có thể chấp nhận được khi mối quan hệ (关系) đã được thiết lập.</div>`,
  ]]);

const c8q = quiz('cib401-quiz-8', 'Quiz 8 — Comprehensive review|||Quiz 8 — Ôn tập tổng hợp', [
  { id: 'q1', question: 'Trong văn viết thương mại trang trọng (hợp đồng, email), nên dùng cách xưng hô nào thay cho "你们/我们"?', options: ['你/我', '贵方/我方', '他们/我们', 'Không cần đổi, dùng nguyên "你们/我们"'], correctIndex: 1, explanation: 'Văn phong trang trọng (正式文体) dùng 贵方 (bên quý vị)/我方 (bên chúng tôi) thay cho 你们/我们 đời thường.' },
  { id: 'q2', question: 'Theo trình tự tình huống tổng hợp của chương ôn tập, bước nào diễn ra NGAY SAU khi ký hợp đồng (合同签署)?', options: ['展会认识 (gặp tại hội chợ)', '银行开证 (ngân hàng mở L/C)', '邮件询价 (email hỏi giá)', '电话谈判 (đàm phán điện thoại)'], correctIndex: 1, explanation: 'Trình tự: gặp hội chợ → email hỏi giá → đàm phán → ký hợp đồng → ngân hàng mở L/C → xuất khẩu → duy trì quan hệ.' },
  { id: 'q3', question: '"正式文体" (zhèngshì wéntǐ) trong môn này chỉ khái niệm gì?', options: ['Văn phong trang trọng dùng trong thương mại', 'Một loại hợp đồng bảo mật', 'Một chứng từ hải quan', 'Một chương trình khuyến mãi'], correctIndex: 0, explanation: '正式文体 = văn phong/thể loại văn bản trang trọng, dùng trong hợp đồng và thư tín thương mại.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CIB401',
    slug: 'cib401-comprehensive-business-chinese-2',
    title: 'Comprehensive Business Chinese 2',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CIB401.webp',
    shortDescription: 'Advanced Business Chinese (HSK4-5): negotiation, contracts, correspondence, marketing, import-export, banking & finance, trade fairs & guanxi, formal-register review. Hanzi + pinyin + meaning, vocabulary, dialogues, quizzes.|||Tiếng Trung thương mại nâng cao (HSK4-5): đàm phán, hợp đồng, thư tín, marketing, xuất nhập khẩu, ngân hàng & tài chính, hội chợ & quan hệ, ôn văn phong trang trọng. Chữ Hán + pinyin + nghĩa, từ vựng, hội thoại, quiz.',
    description: 'Môn <strong>CIB401 — Comprehensive Business Chinese 2</strong> (kỳ 4, ngành Ngôn ngữ Trung) tiếp nối CIB301, nâng trình độ lên <strong>HSK4-5</strong> với các chủ đề thương mại nâng cao: <strong>đàm phán</strong> (商务谈判), <strong>hợp đồng &amp; điều khoản</strong> (合同条款), <strong>thư tín &amp; email</strong> (商务信函与邮件), <strong>marketing &amp; quảng bá sản phẩm</strong> (市场营销), <strong>xuất nhập khẩu</strong> (进出口贸易), <strong>ngân hàng &amp; tài chính doanh nghiệp</strong> (银行与企业融资), <strong>hội chợ &amp; xây dựng quan hệ</strong> (展会与关系), và <strong>ôn tập tình huống phức hợp</strong>. Mỗi chương gồm chữ Hán, pinyin có dấu thanh, nghĩa Việt/Anh, từ vựng, hội thoại thực tế và quiz. Trích dẫn giáo trình <em>商务汉语</em> (BLCU) &amp; <em>经贸中级汉语</em>.',
    whatYouLearn: 'Từ vựng &amp; hội thoại đàm phán giá cả/số lượng; đọc &amp; soạn điều khoản hợp đồng (甲方/乙方, 违约, 不可抗力); viết email thương mại trang trọng (尊敬的, 顺祝商祺); thuật ngữ marketing (品牌, 目标市场, 促销活动); chứng từ xuất nhập khẩu (报关, 信用证, 离岸价/到岸价); tài chính doanh nghiệp (贷款, 融资, 现金流, 汇率); giao tiếp hội chợ &amp; xây dựng quan hệ (关系, 宴请, 敬酒); phân biệt văn phong trang trọng vs. thân mật.',
    requirements: 'Đã hoàn thành CIB301 (Comprehensive Business Chinese 1) hoặc trình độ tương đương HSK3-4. Biết đọc chữ Hán giản thể cơ bản và pinyin.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình 商务汉语 (BLCU), 经贸中级汉语, từ điển tra pinyin, HSK4-5, YouTube.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Từ CIB301 lên HSK4-5, lộ trình 8 chương thương mại nâng cao.', lessons: [intro] },
    { title: 'Chương 1 — Đàm phán thương mại|||Chapter 1 — Business negotiation', description: '报价/还价/让步/底线/双赢; hội thoại thương lượng giá.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hợp đồng & điều khoản|||Chapter 2 — Contract clauses', description: '甲方/乙方/违约/不可抗力; đọc trích đoạn hợp đồng.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thư tín & email thương mại|||Chapter 3 — Business correspondence', description: '尊敬的/敬请/顺祝商祺; email hỏi giá & báo giá.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Marketing & quảng bá sản phẩm|||Chapter 4 — Marketing & promotion', description: '品牌/目标市场/促销活动/口碑.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Xuất nhập khẩu|||Chapter 5 — Import-export trade', description: '报关/信用证/提单/离岸价/到岸价.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ngân hàng & tài chính doanh nghiệp|||Chapter 6 — Banking & corporate finance', description: '贷款/利率/融资/现金流/汇率.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hội chợ & xây dựng quan hệ|||Chapter 7 — Trade fairs & guanxi', description: '展位/名片/关系/宴请/敬酒/长期合作.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập tổng hợp|||Chapter 8 — Comprehensive review', description: 'Tình huống phức hợp, văn phong trang trọng vs. thân mật.', lessons: [c8, c8q] },
  ],
};
