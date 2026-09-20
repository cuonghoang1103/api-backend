/**
 * CBC401 — Chinese Business Correspondence (Thư tín Thương mại tiếng Trung).
 * Khối Ngôn ngữ Trung FPTU, Kỳ 4. MÔN VIẾT thư tín/văn bản thương mại tiếng
 * Trung (email, thư chào hàng, hợp đồng, công văn) — KHÁC CIB301/401 (tổng
 * hợp thương mại). Giáo trình tham khảo (trích dẫn, không upload PDF):
 * "商务信函写作" (Business Chinese Correspondence Writing), "外贸函电"
 * (Foreign Trade Correspondence). 8 chương theo thể loại thư giao dịch ngoại
 * thương, từ định dạng chung đến bộ hồ sơ hoàn chỉnh.
 * Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick lồng/${; trong HTML content "&" → "&amp;".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('cbc401-1-1-format-style', 'Chapter 1 — Format & style of Chinese business letters|||Chương 1 — Định dạng & văn phong thư tín thương mại tiếng Trung',
  'Cấu trúc chuẩn một thư thương mại tiếng Trung: 信头, 日期, 封内地址, 称呼, 正文, 结尾敬语, 签名. Văn phong trang trọng (敬语) khác khẩu ngữ.',
  [[
    `<span class="eyebrow">CBC401 · Chapter 1</span>
<h2>Format &amp; style of Chinese business letters (商务信函格式与文体)</h2>
<p class="lead">Every Chinese business letter follows the same skeleton, whether it is a paper letter or a formal email body. Learn the six parts first — the content of later chapters (inquiry, offer, order, L/C, shipment, claim...) just fills this skeleton with different purposes.</p>
<h3>Key terms (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>信函</td><td>xìnhán</td><td>letter, correspondence</td></tr>
<tr><td>信头</td><td>xìntóu</td><td>letterhead (sender's info)</td></tr>
<tr><td>称呼</td><td>chēnghu</td><td>salutation</td></tr>
<tr><td>正文</td><td>zhèngwén</td><td>body of the letter</td></tr>
<tr><td>结尾敬语</td><td>jiéwěi jìngyǔ</td><td>complimentary close</td></tr>
<tr><td>此致 敬礼</td><td>cǐzhì jìnglǐ</td><td>"hereby, with regards" — standard closing formula</td></tr>
<tr><td>尊敬的</td><td>zūnjìng de</td><td>Dear / respected (honorific opener)</td></tr>
<tr><td>敬启</td><td>jìngqǐ</td><td>please be informed / respectfully opened</td></tr>
<tr><td>附件</td><td>fùjiàn</td><td>enclosure / attachment</td></tr>
</table>
<h3>Letter skeleton (信函结构)</h3>
<pre><code>【信头 xìntóu — Letterhead】
  ABC贸易有限公司
  北京市朝阳区建国路88号
  电话：010-8888xxxx  邮箱：sales@abc-trade.com

【日期 rìqī — Date】
  2026年9月16日

【封内地址 fēngnèi dìzhǐ — Inside address (recipient)】
  Mr. John Smith
  ABC Import Co., Ltd., New York, USA

【称呼 chēnghu — Salutation】
  尊敬的史密斯先生：(Zūnjìng de Shǐmìsī xiānshēng: — Dear Mr. Smith:)

【正文 zhèngwén — Body, 2-3 short paragraphs, ONE idea per paragraph】
  第一段：说明写信目的 (state the purpose)
  第二段：具体内容 (details — price / order / claim / ...)
  第三段：期待回复 (request a reply)

【结尾敬语 jiéwěi jìngyǔ — Complimentary close】
  此致
  敬礼！

【签名 qiānmíng — Signature block】
  ABC贸易有限公司
  经理：王芳（签名）
</code></pre>
<h3>Formal vs. casual register</h3>
<ul>
<li><strong>尊敬的 + Surname + 先生/女士：</strong> the standard formal opener — always safe for a first contact.</li>
<li><strong>此致 敬礼</strong> is written on its OWN two lines at the end — never merged into the last sentence of the body.</li>
<li>Avoid spoken-Chinese fillers (的话, 啊, 呀); use written connectives like <strong>由于 / 因此 / 特此 / 为此</strong> instead of casual 所以 / 那.</li>
<li>Numbers, dates, quantities and money must be exact and consistent throughout the whole letter — a mismatch is read as sloppy or, worse, dishonest.</li>
</ul>
<div class="callout"><span class="badge">Golden rule</span> One idea per paragraph, plain factual sentences, and always close with 此致 敬礼 on their own lines. Every letter type in this course is this same skeleton with a different purpose in the body.</div>`,
    `<span class="eyebrow">CBC401 · Chương 1</span>
<h2>Định dạng &amp; văn phong thư tín thương mại tiếng Trung (商务信函格式与文体)</h2>
<p class="lead">Mọi thư thương mại tiếng Trung đều theo đúng một khung, dù là thư giấy hay phần thân của một email trang trọng. Học khung 6 phần này trước — nội dung các chương sau (hỏi hàng, chào hàng, đặt hàng, tín dụng thư, giao hàng, khiếu nại...) chỉ là điền mục đích khác nhau vào đúng khung này.</p>
<h3>Từ khoá (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>信函</td><td>xìnhán</td><td>thư tín, thư từ</td></tr>
<tr><td>信头</td><td>xìntóu</td><td>tiêu đề thư (thông tin người gửi)</td></tr>
<tr><td>称呼</td><td>chēnghu</td><td>lời chào mở đầu</td></tr>
<tr><td>正文</td><td>zhèngwén</td><td>thân thư</td></tr>
<tr><td>结尾敬语</td><td>jiéwěi jìngyǔ</td><td>lời chào kết thư</td></tr>
<tr><td>此致 敬礼</td><td>cǐzhì jìnglǐ</td><td>công thức kết thư chuẩn "kính chào, kính thư"</td></tr>
<tr><td>尊敬的</td><td>zūnjìng de</td><td>kính gửi / kính trọng (mở đầu trang trọng)</td></tr>
<tr><td>敬启</td><td>jìngqǐ</td><td>kính báo / xin trân trọng thông báo</td></tr>
<tr><td>附件</td><td>fùjiàn</td><td>tài liệu đính kèm</td></tr>
</table>
<h3>Khung một lá thư (信函结构)</h3>
<pre><code>【信头 xìntóu — Tiêu đề thư】
  ABC贸易有限公司
  北京市朝阳区建国路88号
  电话：010-8888xxxx  邮箱：sales@abc-trade.com

【日期 rìqī — Ngày viết thư】
  2026年9月16日

【封内地址 fēngnèi dìzhǐ — Địa chỉ người nhận】
  Mr. John Smith
  ABC Import Co., Ltd., New York, USA

【称呼 chēnghu — Lời chào mở đầu】
  尊敬的史密斯先生：(Zūnjìng de Shǐmìsī xiānshēng: — Kính gửi ông Smith:)

【正文 zhèngwén — Thân thư, 2-3 đoạn ngắn, MỖI đoạn MỘT ý】
  第一段：说明写信目的 (nêu mục đích viết thư)
  第二段：具体内容 (nội dung cụ thể — giá / đơn hàng / khiếu nại / ...)
  第三段：期待回复 (đề nghị hồi âm)

【结尾敬语 jiéwěi jìngyǔ — Lời chào kết thư】
  此致
  敬礼！

【签名 qiānmíng — Khối ký tên】
  ABC贸易有限公司
  经理：王芳（签名）
</code></pre>
<h3>Văn phong trang trọng vs. khẩu ngữ</h3>
<ul>
<li><strong>尊敬的 + họ + 先生/女士：</strong> mở đầu trang trọng chuẩn — luôn an toàn khi lần đầu liên hệ.</li>
<li><strong>此致 敬礼</strong> viết trên HAI dòng RIÊNG ở cuối thư — không bao giờ ghép vào câu cuối của thân thư.</li>
<li>Tránh từ đệm khẩu ngữ (的话, 啊, 呀); dùng liên từ văn viết như <strong>由于 / 因此 / 特此 / 为此</strong> thay cho 所以 / 那 thông tục.</li>
<li>Số liệu, ngày tháng, số lượng, tiền phải chính xác và nhất quán suốt cả thư — sai lệch bị hiểu là cẩu thả, nặng hơn là thiếu trung thực.</li>
</ul>
<div class="callout"><span class="badge">Quy tắc vàng</span> Mỗi đoạn một ý, câu văn khách quan súc tích, và luôn kết bằng 此致 敬礼 trên dòng riêng. Mọi loại thư trong môn này đều dùng đúng khung này với mục đích khác nhau ở thân thư.</div>`,
  ]]);

const c1q = quiz('cbc401-quiz-1', 'Quiz 1 — Format & style|||Quiz 1 — Định dạng & văn phong', [
  { id: 'q1', question: 'Công thức kết thư chuẩn của một thư thương mại tiếng Trung là gì?', options: ['谢谢，再见', '此致 敬礼', '你好，拜拜', '祝你快乐'], correctIndex: 1, explanation: '此致 敬礼 là công thức kết thư trang trọng chuẩn, viết trên hai dòng riêng ở cuối thư.' },
  { id: 'q2', question: 'Mở đầu một thư thương mại trang trọng lần đầu liên hệ nên dùng cách nào?', options: ['喂，你好', '尊敬的 + họ + 先生/女士：', '嗨，朋友', 'Không cần lời chào, viết thẳng nội dung'], correctIndex: 1, explanation: '尊敬的 + họ + 先生/女士 là cách mở đầu trang trọng, an toàn cho lần đầu liên hệ.' },
  { id: 'q3', question: 'Nguyên tắc viết đoạn văn (正文) trong thư thương mại tiếng Trung là?', options: ['Viết một đoạn dài duy nhất cho gọn', 'Mỗi đoạn nêu MỘT ý, câu văn khách quan', 'Dùng nhiều từ đệm khẩu ngữ cho tự nhiên', 'Không cần nêu mục đích viết thư'], correctIndex: 1, explanation: 'Chuẩn viết thư thương mại: mỗi đoạn một ý (mục đích → nội dung cụ thể → đề nghị hồi âm), câu văn khách quan súc tích.' },
]);

const c2 = doc('cbc401-2-1-inquiry-offer', 'Chapter 2 — Inquiry & offer letters (询盘, 报盘)|||Chương 2 — Thư hỏi hàng & chào hàng (询盘, 报盘)',
  'Từ vựng: 询盘, 报盘, 报价, 单价, 起订量, 现货, 有效期, 目录, 样品. Khung viết thư hỏi hàng và thư chào hàng phản hồi.',
  [[
    `<span class="eyebrow">CBC401 · Chapter 2</span>
<h2>Inquiry &amp; offer letters (询盘信与报盘信)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>询盘</td><td>xúnpán</td><td>inquiry (asking for price/terms)</td></tr>
<tr><td>报盘</td><td>bàopán</td><td>offer (a formal quotation with terms)</td></tr>
<tr><td>报价</td><td>bàojià</td><td>to quote a price; quotation</td></tr>
<tr><td>单价</td><td>dānjià</td><td>unit price</td></tr>
<tr><td>起订量</td><td>qǐdìngliàng</td><td>minimum order quantity (MOQ)</td></tr>
<tr><td>现货</td><td>xiànhuò</td><td>goods in stock</td></tr>
<tr><td>有效期</td><td>yǒuxiàoqī</td><td>validity period (of an offer)</td></tr>
<tr><td>目录</td><td>mùlù</td><td>catalogue</td></tr>
<tr><td>样品</td><td>yàngpǐn</td><td>sample</td></tr>
</table>
<h3>Writing frame — inquiry letter (询盘信框架)</h3>
<ul>
<li>Open: how you learned of them (通过展会/网站/朋友介绍得知贵公司).</li>
<li>State exactly what you want: product, spec, quantity, and ask for price + terms.</li>
<li>Ask for catalogue/samples if useful, and request their best terms.</li>
<li>Close: request a prompt reply (盼early回复).</li>
</ul>
<pre><code>【询盘信样例 — Sample inquiry letter】
尊敬的经理：

  我们从贵公司网站上得知你们生产真丝围巾，对此很感兴趣。
  Wǒmen cóng guì gōngsī wǎngzhàn shàng dé zhī nǐmen shēngchǎn zhēnsī wéijīn, duì cǐ hěn gǎn xìngqù.
  (We learned from your website that you produce silk scarves, and we are very interested.)

  请报FOB上海价，起订量500条，并告知交货期及现货情况。
  Qǐng bào FOB Shànghǎi jià, qǐdìngliàng 500 tiáo, bìng gàozhī jiāohuòqī jí xiànhuò qíngkuàng.
  (Please quote FOB Shanghai price for an MOQ of 500 pieces, and advise delivery time and stock status.)

  如蒙寄送产品目录及样品，将不胜感激。
  Rú méng jìsòng chǎnpǐn mùlù jí yàngpǐn, jiāng bùshèng gǎnjī.
  (We would be most grateful if you could send a catalogue and samples.)

此致
敬礼！
</code></pre>
<h3>Writing frame — offer letter (报盘信框架)</h3>
<ul>
<li>Thank them for the inquiry, confirm the product they asked about.</li>
<li>Give the formal offer: unit price, currency &amp; trade term (FOB/CIF), MOQ, delivery time, and validity period.</li>
<li>Add a persuasive line (quality, popularity) and invite them to place an order before the offer expires.</li>
</ul>
<pre><code>【报盘信样例 — Sample offer letter】
尊敬的先生：

  感谢贵方9月10日的询盘。现报盘如下：
  Gǎnxiè guì fāng jiǔ yuè shí rì de xúnpán. Xiàn bàopán rúxià:
  (Thank you for your inquiry of September 10. We are pleased to offer as follows:)

  真丝围巾，FOB上海每条12美元，起订量500条，
  现货供应，交货期为收到订金后15天，
  本报盘有效期至9月30日。
  Zhēnsī wéijīn, FOB Shànghǎi měi tiáo 12 měiyuán, qǐdìngliàng 500 tiáo,
  xiànhuò gōngyìng, jiāohuòqī wéi shōudào dìngjīn hòu shíwǔ tiān,
  běn bàopán yǒuxiàoqī zhì jiǔ yuè sānshí rì.
  (Silk scarves, FOB Shanghai USD12/piece, MOQ 500 pieces, ready stock,
  delivery 15 days after deposit is received, offer valid until Sep 30.)

  望贵方及早确认，以便安排生产。
  Wàng guì fāng jízǎo quèrèn, yǐbiàn ānpái shēngchǎn.
  (We hope you can confirm soon so we can arrange production.)

此致
敬礼！
</code></pre>
<div class="callout"><span class="badge">Note</span> An 报盘 must always carry a 有效期 (validity period) — an offer without a deadline can be withdrawn any time, which invites disputes. Always pair a price with its trade term (FOB/CIF) — a bare number means nothing in foreign trade.</div>`,
    `<span class="eyebrow">CBC401 · Chương 2</span>
<h2>Thư hỏi hàng &amp; chào hàng (询盘信与报盘信)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>询盘</td><td>xúnpán</td><td>hỏi hàng (hỏi giá/điều khoản)</td></tr>
<tr><td>报盘</td><td>bàopán</td><td>chào hàng (bảng giá chính thức kèm điều khoản)</td></tr>
<tr><td>报价</td><td>bàojià</td><td>báo giá</td></tr>
<tr><td>单价</td><td>dānjià</td><td>đơn giá</td></tr>
<tr><td>起订量</td><td>qǐdìngliàng</td><td>số lượng đặt tối thiểu (MOQ)</td></tr>
<tr><td>现货</td><td>xiànhuò</td><td>hàng có sẵn</td></tr>
<tr><td>有效期</td><td>yǒuxiàoqī</td><td>thời hạn hiệu lực (của báo giá)</td></tr>
<tr><td>目录</td><td>mùlù</td><td>catalogue, danh mục sản phẩm</td></tr>
<tr><td>样品</td><td>yàngpǐn</td><td>hàng mẫu</td></tr>
</table>
<h3>Khung viết — thư hỏi hàng (询盘信框架)</h3>
<ul>
<li>Mở đầu: nêu cách biết đến đối tác (qua展会/网站/朋友介绍).</li>
<li>Nêu chính xác điều cần hỏi: sản phẩm, quy cách, số lượng, hỏi giá + điều khoản.</li>
<li>Đề nghị gửi catalogue/hàng mẫu nếu cần, hỏi điều khoản tốt nhất.</li>
<li>Kết: đề nghị hồi âm sớm (盼early回复).</li>
</ul>
<pre><code>【询盘信样例 — Mẫu thư hỏi hàng】
尊敬的经理：

  我们从贵公司网站上得知你们生产真丝围巾，对此很感兴趣。
  Wǒmen cóng guì gōngsī wǎngzhàn shàng dé zhī nǐmen shēngchǎn zhēnsī wéijīn, duì cǐ hěn gǎn xìngqù.
  (Chúng tôi biết qua trang web của quý công ty rằng quý công ty sản xuất khăn lụa, rất quan tâm.)

  请报FOB上海价，起订量500条，并告知交货期及现货情况。
  Qǐng bào FOB Shànghǎi jià, qǐdìngliàng 500 tiáo, bìng gàozhī jiāohuòqī jí xiànhuò qíngkuàng.
  (Xin báo giá FOB Thượng Hải cho đơn tối thiểu 500 chiếc, và cho biết thời gian giao hàng, tình trạng hàng có sẵn.)

  如蒙寄送产品目录及样品，将不胜感激。
  Rú méng jìsòng chǎnpǐn mùlù jí yàngpǐn, jiāng bùshèng gǎnjī.
  (Rất cảm kích nếu quý công ty gửi catalogue và hàng mẫu.)

此致
敬礼！
</code></pre>
<h3>Khung viết — thư chào hàng (报盘信框架)</h3>
<ul>
<li>Cảm ơn thư hỏi hàng, xác nhận đúng sản phẩm được hỏi.</li>
<li>Đưa bảng chào hàng chính thức: đơn giá, tiền tệ &amp; điều kiện thương mại (FOB/CIF), MOQ, thời gian giao hàng, thời hạn hiệu lực.</li>
<li>Thêm câu thuyết phục (chất lượng, được ưa chuộng) và mời đặt hàng trước khi hết hạn.</li>
</ul>
<pre><code>【报盘信样例 — Mẫu thư chào hàng】
尊敬的先生：

  感谢贵方9月10日的询盘。现报盘如下：
  Gǎnxiè guì fāng jiǔ yuè shí rì de xúnpán. Xiàn bàopán rúxià:
  (Cảm ơn thư hỏi hàng ngày 10/9 của quý ngài. Nay chào hàng như sau:)

  真丝围巾，FOB上海每条12美元，起订量500条，
  现货供应，交货期为收到订金后15天，
  本报盘有效期至9月30日。
  Zhēnsī wéijīn, FOB Shànghǎi měi tiáo 12 měiyuán, qǐdìngliàng 500 tiáo,
  xiànhuò gōngyìng, jiāohuòqī wéi shōudào dìngjīn hòu shíwǔ tiān,
  běn bàopán yǒuxiàoqī zhì jiǔ yuè sānshí rì.
  (Khăn lụa, FOB Thượng Hải 12 USD/chiếc, MOQ 500 chiếc, hàng có sẵn,
  giao hàng 15 ngày sau khi nhận tiền đặt cọc, báo giá có hiệu lực đến 30/9.)

  望贵方及早确认，以便安排生产。
  Wàng guì fāng jízǎo quèrèn, yǐbiàn ānpái shēngchǎn.
  (Mong quý công ty xác nhận sớm để chúng tôi bố trí sản xuất.)

此致
敬礼！
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Một 报盘 luôn phải kèm 有效期 (thời hạn hiệu lực) — báo giá không có hạn có thể bị rút bất cứ lúc nào, dễ gây tranh chấp. Luôn đi kèm giá với điều kiện thương mại (FOB/CIF) — một số tiền trần trụi vô nghĩa trong ngoại thương.</div>`,
  ]]);

const c2q = quiz('cbc401-quiz-2', 'Quiz 2 — Inquiry & offer|||Quiz 2 — Hỏi hàng & chào hàng', [
  { id: 'q1', question: '"询盘" (xúnpán) nghĩa là gì?', options: ['Chào hàng chính thức', 'Hỏi hàng, hỏi giá/điều khoản', 'Đặt hàng', 'Khiếu nại'], correctIndex: 1, explanation: '询盘 = thư hỏi hàng, bên mua hỏi giá và điều khoản trước khi đặt hàng.' },
  { id: 'q2', question: 'Vì sao một thư 报盘 (chào hàng) luôn cần kèm 有效期?', options: ['Để thư dài hơn cho trang trọng', 'Vì thiếu hạn thì báo giá có thể bị rút bất cứ lúc nào, dễ tranh chấp', 'Không cần thiết, chỉ là hình thức', 'Vì luật thương mại tiếng Trung yêu cầu ghi ngày sinh'], correctIndex: 1, explanation: '有效期 (thời hạn hiệu lực) bảo vệ cả hai bên: bên bán không bị ràng buộc giá vô hạn, bên mua biết hạn để quyết định.' },
  { id: 'q3', question: '"起订量" (qǐdìngliàng) trong thư chào hàng nghĩa là?', options: ['Giá đơn vị', 'Số lượng đặt hàng tối thiểu (MOQ)', 'Thời hạn hiệu lực báo giá', 'Hàng có sẵn trong kho'], correctIndex: 1, explanation: '起订量 = MOQ, số lượng tối thiểu bên mua phải đặt trong một đơn hàng.' },
]);

const c3 = doc('cbc401-3-1-counter-offer', 'Chapter 3 — Counter-offer & negotiation letters (还盘)|||Chương 3 — Thư đàm phán giá & điều khoản (还盘)',
  'Từ vựng: 还盘, 让步, 折扣, 底价, 成交, 付款方式, 汇率, 让利. Khung viết thư hoàn giá và thư phản hồi nhượng bộ.',
  [[
    `<span class="eyebrow">CBC401 · Chapter 3</span>
<h2>Counter-offer &amp; negotiation letters (还盘信)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>还盘</td><td>huánpán</td><td>counter-offer</td></tr>
<tr><td>让步</td><td>ràngbù</td><td>concession, to give ground</td></tr>
<tr><td>折扣</td><td>zhékòu</td><td>discount</td></tr>
<tr><td>底价</td><td>dǐjià</td><td>bottom / floor price</td></tr>
<tr><td>成交</td><td>chéngjiāo</td><td>to close a deal</td></tr>
<tr><td>付款方式</td><td>fùkuǎn fāngshì</td><td>method of payment</td></tr>
<tr><td>汇率</td><td>huìlǜ</td><td>exchange rate</td></tr>
<tr><td>让利</td><td>rànglì</td><td>to give up part of the profit margin</td></tr>
<tr><td>具竞争力</td><td>jù jìngzhēnglì</td><td>competitive (of a price)</td></tr>
</table>
<h3>Writing frame — counter-offer (还盘信框架)</h3>
<ul>
<li>Thank them for the offer, state clearly which point you cannot accept (usually price or MOQ) — never reject vaguely.</li>
<li>Give a REASON backed by fact: market price, a rival's quote, or order volume — a bare "too expensive" is not persuasive.</li>
<li>Propose your own number/term (your 还盘) and, if possible, offer something in return (larger quantity, faster payment) so it reads as a trade, not just a demand.</li>
<li>Close with an invitation to close the deal quickly if they accept.</li>
</ul>
<pre><code>【还盘信样例 — Sample counter-offer letter】
尊敬的先生：

  贵方9月12日报盘已收到，谢谢。但每条12美元的价格
  较市场价偏高，我方难以接受。
  Guì fāng jiǔ yuè shí'èr rì bàopán yǐ shōudào, xièxie. Dàn měi tiáo shí'èr měiyuán de jiàgé
  jiào shìchǎng jià piān gāo, wǒ fāng nányǐ jiēshòu.
  (We received your offer of Sep 12, thank you. However, USD12/piece
  is higher than the market price, which we find hard to accept.)

  如贵方能将单价降至每条10美元，我方可将订量
  提高至1000条，并可考虑成交。
  Rú guì fāng néng jiāng dānjià jiàng zhì měi tiáo shí měiyuán, wǒ fāng kě jiāng dìngliàng
  tígāo zhì yìqiān tiáo, bìng kě kǎolǜ chéngjiāo.
  (If you can lower the unit price to USD10/piece, we can raise
  our order to 1,000 pieces, and would consider closing the deal.)

  盼早日回复，以便双方尽快成交。
  Pàn zǎorì huífù, yǐbiàn shuāngfāng jìnkuài chéngjiāo.
  (We look forward to your early reply so both sides can close soon.)

此致
敬礼！
</code></pre>
<div class="callout"><span class="badge">Note</span> A counter-offer legally CANCELS the original offer — the seller is no longer bound by their first price once you 还盘. Always pair a price cut request with something you give in return (volume, payment speed); a one-sided demand rarely gets a fast 让步.</div>`,
    `<span class="eyebrow">CBC401 · Chương 3</span>
<h2>Thư đàm phán giá &amp; điều khoản (还盘信)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>还盘</td><td>huánpán</td><td>hoàn giá, trả giá lại</td></tr>
<tr><td>让步</td><td>ràngbù</td><td>nhượng bộ</td></tr>
<tr><td>折扣</td><td>zhékòu</td><td>chiết khấu, giảm giá</td></tr>
<tr><td>底价</td><td>dǐjià</td><td>giá sàn, giá thấp nhất</td></tr>
<tr><td>成交</td><td>chéngjiāo</td><td>chốt giao dịch, thành giao dịch</td></tr>
<tr><td>付款方式</td><td>fùkuǎn fāngshì</td><td>phương thức thanh toán</td></tr>
<tr><td>汇率</td><td>huìlǜ</td><td>tỷ giá hối đoái</td></tr>
<tr><td>让利</td><td>rànglì</td><td>nhượng một phần lợi nhuận</td></tr>
<tr><td>具竞争力</td><td>jù jìngzhēnglì</td><td>có tính cạnh tranh (về giá)</td></tr>
</table>
<h3>Khung viết — thư hoàn giá (还盘信框架)</h3>
<ul>
<li>Cảm ơn báo giá, nói rõ điểm không thể chấp nhận (thường là giá hoặc MOQ) — không bao giờ từ chối mơ hồ.</li>
<li>Đưa LÝ DO có căn cứ: giá thị trường, báo giá đối thủ, hoặc khối lượng đặt hàng — chỉ nói "đắt quá" không đủ thuyết phục.</li>
<li>Đề xuất số/điều khoản của mình (还盘 của bạn), nếu được thì đổi lại một điều gì đó (đặt số lượng lớn hơn, thanh toán nhanh hơn) để nó là một cuộc trao đổi, không chỉ là yêu cầu một chiều.</li>
<li>Kết bằng lời mời chốt giao dịch nhanh nếu bên kia đồng ý.</li>
</ul>
<pre><code>【还盘信样例 — Mẫu thư hoàn giá】
尊敬的先生：

  贵方9月12日报盘已收到，谢谢。但每条12美元的价格
  较市场价偏高，我方难以接受。
  Guì fāng jiǔ yuè shí'èr rì bàopán yǐ shōudào, xièxie. Dàn měi tiáo shí'èr měiyuán de jiàgé
  jiào shìchǎng jià piān gāo, wǒ fāng nányǐ jiēshòu.
  (Chúng tôi đã nhận báo giá ngày 12/9, xin cảm ơn. Nhưng mức giá 12 USD/chiếc
  cao hơn giá thị trường, phía chúng tôi khó chấp nhận.)

  如贵方能将单价降至每条10美元，我方可将订量
  提高至1000条，并可考虑成交。
  Rú guì fāng néng jiāng dānjià jiàng zhì měi tiáo shí měiyuán, wǒ fāng kě jiāng dìngliàng
  tígāo zhì yìqiān tiáo, bìng kě kǎolǜ chéngjiāo.
  (Nếu quý công ty giảm đơn giá xuống 10 USD/chiếc, chúng tôi có thể nâng
  số lượng đặt lên 1000 chiếc, và có thể xem xét chốt giao dịch.)

  盼早日回复，以便双方尽快成交。
  Pàn zǎorì huífù, yǐbiàn shuāngfāng jìnkuài chéngjiāo.
  (Mong sớm nhận hồi âm để hai bên chốt giao dịch càng sớm càng tốt.)

此致
敬礼！
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Một thư 还盘 về mặt pháp lý HUỶ báo giá gốc — bên bán không còn bị ràng buộc bởi giá đầu tiên khi bạn 还盘. Luôn đi kèm yêu cầu giảm giá với điều gì đó bạn đổi lại (số lượng, tốc độ thanh toán); yêu cầu một chiều hiếm khi được 让步 nhanh.</div>`,
  ]]);

const c3q = quiz('cbc401-quiz-3', 'Quiz 3 — Counter-offer & negotiation|||Quiz 3 — Đàm phán & hoàn giá', [
  { id: 'q1', question: 'Về mặt giao dịch, một thư 还盘 (hoàn giá) có tác dụng gì với báo giá gốc?', options: ['Không ảnh hưởng gì, báo giá gốc vẫn còn hiệu lực', 'Huỷ báo giá gốc, bên bán không còn bị ràng buộc bởi giá đầu tiên', 'Tự động chấp nhận báo giá gốc', 'Kéo dài thêm thời hạn hiệu lực của báo giá gốc'], correctIndex: 1, explanation: '还盘 huỷ bỏ 报盘 ban đầu — khi trả giá lại, người mua không còn quyền chốt theo giá cũ nữa.' },
  { id: 'q2', question: 'Khi viết thư hoàn giá, vì sao chỉ nói "giá quá đắt" là chưa đủ thuyết phục?', options: ['Vì phải viết bằng tiếng Anh mới thuyết phục', 'Vì cần đưa lý do có căn cứ như giá thị trường hoặc báo giá đối thủ', 'Vì thư hoàn giá không cần lý do', 'Vì bên bán không đọc lý do'], correctIndex: 1, explanation: 'Một 还盘 thuyết phục cần lý do cụ thể (thị trường, đối thủ, khối lượng) thay vì nhận định chủ quan.' },
  { id: 'q3', question: '"让步" (ràngbù) trong đàm phán thương mại nghĩa là?', options: ['Chốt giao dịch', 'Nhượng bộ, nhường một phần yêu cầu', 'Từ chối hoàn toàn', 'Tỷ giá hối đoái'], correctIndex: 1, explanation: '让步 = nhượng bộ — một bên nhường một phần điều kiện để tiến tới thoả thuận.' },
]);

const c4 = doc('cbc401-4-1-order-confirmation', 'Chapter 4 — Order & confirmation letters (订单)|||Chương 4 — Thư đặt hàng & xác nhận đơn (订单)',
  'Từ vựng: 订单, 确认, 装箱单, 交货期, 唛头, 合同, 生效, 型号. Khung viết thư đặt hàng và thư xác nhận đơn hàng.',
  [[
    `<span class="eyebrow">CBC401 · Chapter 4</span>
<h2>Order &amp; confirmation letters (订单与确认信)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>订单</td><td>dìngdān</td><td>purchase order</td></tr>
<tr><td>确认</td><td>quèrèn</td><td>to confirm</td></tr>
<tr><td>装箱单</td><td>zhuāngxiāngdān</td><td>packing list</td></tr>
<tr><td>交货期</td><td>jiāohuòqī</td><td>delivery date / lead time</td></tr>
<tr><td>唛头</td><td>màitóu</td><td>shipping mark</td></tr>
<tr><td>合同</td><td>hétong</td><td>contract</td></tr>
<tr><td>生效</td><td>shēngxiào</td><td>to take effect</td></tr>
<tr><td>型号</td><td>xínghào</td><td>model / item number</td></tr>
<tr><td>数量</td><td>shùliàng</td><td>quantity</td></tr>
</table>
<h3>Writing frame — placing an order (订单信框架)</h3>
<ul>
<li>Reference the agreed terms (price/date of the offer or negotiation that led here).</li>
<li>List exactly: item/model, quantity, unit price, total amount, trade term, delivery date.</li>
<li>State the payment method you will use and ask them to send a 装箱单/合同 for signature.</li>
</ul>
<pre><code>【订单信样例 — Sample order letter】
尊敬的经理：

  根据我方9月18日与贵方达成的协议，现正式下单如下：
  Gēnjù wǒ fāng jiǔ yuè shíbā rì yǔ guì fāng dáchéng de xiéyì, xiàn zhèngshì xiàdān rúxià:
  (Based on the agreement reached on Sep 18, we hereby place a formal order as follows:)

  货号A-102真丝围巾1000条，单价10美元，
  金额共10000美元，FOB上海，10月15日前交货。
  Huòhào A-102 zhēnsī wéijīn yìqiān tiáo, dānjià shí měiyuán,
  jīn'é gòng yíwàn měiyuán, FOB Shànghǎi, shí yuè shíwǔ rì qián jiāohuò.
  (Item A-102 silk scarves, 1,000 pcs, unit price USD10,
  total USD10,000, FOB Shanghai, delivery before Oct 15.)

  款项将以T/T方式于收到装箱单后支付。
  Kuǎnxiàng jiāng yǐ T/T fāngshì yú shōudào zhuāngxiāngdān hòu zhīfù.
  (Payment will be made by T/T upon receipt of the packing list.)

  请尽快寄来销售合同以便双方签字生效。
  Qǐng jǐnkuài jì lái xiāoshòu hétong yǐbiàn shuāngfāng qiānzì shēngxiào.
  (Please send the sales contract soon so both sides can sign for it to take effect.)

此致
敬礼！
</code></pre>
<h3>Writing frame — order confirmation (确认信框架)</h3>
<ul>
<li>Acknowledge the order number/date and confirm every figure back (item, quantity, price, date) — this is the legal proof both sides agree.</li>
<li>State the shipping mark (唛头) and any next step (contract to sign, deposit to pay).</li>
</ul>
<div class="callout"><span class="badge">Note</span> 确认信 must restate EVERY figure of the order, not just say "OK" — if a number is wrong and goes unnoticed, that number becomes the contract. 唛头 (shipping mark) is agreed here so the factory can print it on every carton before shipment.</div>`,
    `<span class="eyebrow">CBC401 · Chương 4</span>
<h2>Thư đặt hàng &amp; xác nhận đơn (订单与确认信)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>订单</td><td>dìngdān</td><td>đơn đặt hàng</td></tr>
<tr><td>确认</td><td>quèrèn</td><td>xác nhận</td></tr>
<tr><td>装箱单</td><td>zhuāngxiāngdān</td><td>phiếu đóng gói (packing list)</td></tr>
<tr><td>交货期</td><td>jiāohuòqī</td><td>thời gian giao hàng</td></tr>
<tr><td>唛头</td><td>màitóu</td><td>ký hiệu vận chuyển (shipping mark)</td></tr>
<tr><td>合同</td><td>hétong</td><td>hợp đồng</td></tr>
<tr><td>生效</td><td>shēngxiào</td><td>có hiệu lực</td></tr>
<tr><td>型号</td><td>xínghào</td><td>mã hàng, mã hiệu</td></tr>
<tr><td>数量</td><td>shùliàng</td><td>số lượng</td></tr>
</table>
<h3>Khung viết — thư đặt hàng (订单信框架)</h3>
<ul>
<li>Nhắc lại điều khoản đã thống nhất (giá/ngày của thư chào hàng hoặc đàm phán trước đó).</li>
<li>Ghi rõ chính xác: mã hàng/model, số lượng, đơn giá, tổng tiền, điều kiện thương mại, ngày giao hàng.</li>
<li>Nêu phương thức thanh toán sẽ dùng và đề nghị họ gửi 装箱单/合同 để ký.</li>
</ul>
<pre><code>【订单信样例 — Mẫu thư đặt hàng】
尊敬的经理：

  根据我方9月18日与贵方达成的协议，现正式下单如下：
  Gēnjù wǒ fāng jiǔ yuè shíbā rì yǔ guì fāng dáchéng de xiéyì, xiàn zhèngshì xiàdān rúxià:
  (Căn cứ thoả thuận đã đạt được với quý công ty ngày 18/9, nay đặt hàng chính thức như sau:)

  货号A-102真丝围巾1000条，单价10美元，
  金额共10000美元，FOB上海，10月15日前交货。
  Huòhào A-102 zhēnsī wéijīn yìqiān tiáo, dānjià shí měiyuán,
  jīn'é gòng yíwàn měiyuán, FOB Shànghǎi, shí yuè shíwǔ rì qián jiāohuò.
  (Mã hàng A-102 khăn lụa 1000 chiếc, đơn giá 10 USD,
  tổng tiền 10.000 USD, FOB Thượng Hải, giao trước 15/10.)

  款项将以T/T方式于收到装箱单后支付。
  Kuǎnxiàng jiāng yǐ T/T fāngshì yú shōudào zhuāngxiāngdān hòu zhīfù.
  (Tiền hàng thanh toán bằng T/T sau khi nhận phiếu đóng gói.)

  请尽快寄来销售合同以便双方签字生效。
  Qǐng jǐnkuài jì lái xiāoshòu hétong yǐbiàn shuāngfāng qiānzì shēngxiào.
  (Xin gửi sớm hợp đồng bán hàng để hai bên ký cho có hiệu lực.)

此致
敬礼！
</code></pre>
<h3>Khung viết — thư xác nhận đơn (确认信框架)</h3>
<ul>
<li>Xác nhận số/ngày đơn hàng và nhắc lại đầy đủ mọi số liệu (mã hàng, số lượng, giá, ngày) — đây là chứng cứ pháp lý hai bên đồng ý.</li>
<li>Nêu 唛头 (ký hiệu vận chuyển) và bước tiếp theo (hợp đồng cần ký, tiền cọc cần trả).</li>
</ul>
<div class="callout"><span class="badge">Ghi chú</span> Thư 确认 phải nhắc lại ĐẦY ĐỦ mọi số liệu của đơn hàng, không chỉ nói "OK" — nếu một số sai mà không ai phát hiện, số đó sẽ thành hợp đồng. 唛头 (ký hiệu vận chuyển) được thống nhất ở đây để nhà máy in lên từng thùng hàng trước khi giao.</div>`,
  ]]);

const c4q = quiz('cbc401-quiz-4', 'Quiz 4 — Order & confirmation|||Quiz 4 — Đặt hàng & xác nhận', [
  { id: 'q1', question: '"唛头" (màitóu) trong thư đặt hàng/xác nhận dùng để làm gì?', options: ['Là mức chiết khấu cho đơn hàng lớn', 'Là ký hiệu vận chuyển in trên từng thùng hàng', 'Là tên ngân hàng phát hành tín dụng thư', 'Là ngày hết hạn báo giá'], correctIndex: 1, explanation: '唛头 (shipping mark) là ký hiệu được thống nhất để in lên bao bì/thùng hàng, giúp nhận diện lô hàng khi vận chuyển.' },
  { id: 'q2', question: 'Vì sao thư 确认 (xác nhận đơn hàng) phải nhắc lại đầy đủ mọi số liệu thay vì chỉ nói "đồng ý"?', options: ['Để thư dài hơn cho trang trọng', 'Vì đây là chứng cứ pháp lý hai bên đồng ý; sai số mà không phát hiện sẽ thành hợp đồng', 'Vì quy định bắt buộc phải viết dài', 'Không cần thiết, chỉ cần nói ngắn gọn'], correctIndex: 1, explanation: 'Thư xác nhận là căn cứ ràng buộc — mọi số liệu (mã hàng, số lượng, giá, ngày) phải khớp chính xác với thoả thuận trước đó.' },
  { id: 'q3', question: '"交货期" (jiāohuòqī) nghĩa là gì?', options: ['Phiếu đóng gói', 'Thời gian/ngày giao hàng', 'Hợp đồng có hiệu lực', 'Số lượng đặt hàng tối thiểu'], correctIndex: 1, explanation: '交货期 = thời gian giao hàng, một trong các mục bắt buộc phải có trong đơn đặt hàng.' },
]);

const c5 = doc('cbc401-5-1-lc-payment', 'Chapter 5 — Payment & letter of credit letters (信用证 L/C)|||Chương 5 — Thư về thanh toán & tín dụng thư (信用证 L/C)',
  'Từ vựng: 信用证, 开证行, 不可撤销, 议付, 汇票, 提单, 保兑, 单据. Khung viết thư yêu cầu mở L/C và thư báo đã nhận L/C.',
  [[
    `<span class="eyebrow">CBC401 · Chapter 5</span>
<h2>Payment &amp; letter of credit letters (信用证与付款信)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>信用证</td><td>xìnyòngzhèng</td><td>letter of credit (L/C)</td></tr>
<tr><td>开证行</td><td>kāizhèngháng</td><td>issuing bank</td></tr>
<tr><td>不可撤销</td><td>bùkě chèxiāo</td><td>irrevocable</td></tr>
<tr><td>议付</td><td>yìfù</td><td>negotiation (of documents at a bank)</td></tr>
<tr><td>汇票</td><td>huìpiào</td><td>bill of exchange / draft</td></tr>
<tr><td>提单</td><td>tídān</td><td>bill of lading (B/L)</td></tr>
<tr><td>保兑</td><td>bǎoduì</td><td>confirmed (of an L/C)</td></tr>
<tr><td>单据</td><td>dānjù</td><td>documents (shipping/trade docs)</td></tr>
<tr><td>议付行</td><td>yìfùháng</td><td>negotiating bank</td></tr>
</table>
<h3>Writing frame — requesting the L/C to be opened (催开信用证信框架)</h3>
<ul>
<li>Reference the contract/order number and the agreed payment term (by L/C).</li>
<li>Remind the exact deadline they must open the L/C by, and the minimum requirement: irrevocable, at sight, correct amount and validity.</li>
<li>Explain the consequence if it is late (production/shipment will be delayed).</li>
</ul>
<pre><code>【催开信用证信样例 — Sample letter urging L/C opening】
尊敬的先生：

  根据第2026-088号合同规定，贵方应于9月25日前
  通过开证行开出不可撤销的信用证。
  Gēnjù dì 2026-088 hào hétong guīdìng, guì fāng yīng yú jiǔ yuè èrshíwǔ rì qián
  tōngguò kāizhèngháng kāi chū bùkě chèxiāo de xìnyòngzhèng.
  (Under Contract No. 2026-088, you should open an irrevocable L/C
  through the issuing bank by Sep 25.)

  截至目前我方尚未收到该证，请贵方尽快办理，
  以免影响装运期。
  Jiézhì mùqián wǒ fāng shàng wèi shōudào gāi zhèng, qǐng guì fāng jǐnkuài bànlǐ,
  yǐmiǎn yǐngxiǎng zhuāngyùnqī.
  (So far we have not received it — please arrange it soon
  to avoid delaying the shipment date.)

此致
敬礼！
</code></pre>
<h3>Writing frame — acknowledging receipt of the L/C (确认收到信用证信框架)</h3>
<ul>
<li>Confirm the L/C number, amount, and that it is irrevocable — point out any discrepancy against the contract immediately (amount/date/goods description must match exactly).</li>
<li>Confirm the documents you will present for 议付 (invoice, packing list, 提单, insurance certificate...) once shipped.</li>
</ul>
<div class="callout"><span class="badge">Note</span> Every clause of the L/C must match the contract EXACTLY — banks pay against paper, not against the actual goods, so a mismatched word or figure is grounds to refuse payment. 不可撤销 (irrevocable) is the minimum a seller should ever accept; a revocable L/C can be cancelled by the buyer without notice.</div>`,
    `<span class="eyebrow">CBC401 · Chương 5</span>
<h2>Thư về thanh toán &amp; tín dụng thư (信用证与付款信)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>信用证</td><td>xìnyòngzhèng</td><td>tín dụng thư (L/C)</td></tr>
<tr><td>开证行</td><td>kāizhèngháng</td><td>ngân hàng phát hành L/C</td></tr>
<tr><td>不可撤销</td><td>bùkě chèxiāo</td><td>không thể huỷ ngang (irrevocable)</td></tr>
<tr><td>议付</td><td>yìfù</td><td>chiết khấu chứng từ tại ngân hàng</td></tr>
<tr><td>汇票</td><td>huìpiào</td><td>hối phiếu</td></tr>
<tr><td>提单</td><td>tídān</td><td>vận đơn (B/L)</td></tr>
<tr><td>保兑</td><td>bǎoduì</td><td>được xác nhận (của L/C)</td></tr>
<tr><td>单据</td><td>dānjù</td><td>chứng từ (vận chuyển/thương mại)</td></tr>
<tr><td>议付行</td><td>yìfùháng</td><td>ngân hàng chiết khấu</td></tr>
</table>
<h3>Khung viết — thư thúc mở L/C (催开信用证信框架)</h3>
<ul>
<li>Nhắc lại số hợp đồng/đơn hàng và điều khoản thanh toán đã thoả thuận (bằng L/C).</li>
<li>Nhắc chính xác hạn phải mở L/C, và yêu cầu tối thiểu: không thể huỷ ngang, trả ngay, số tiền &amp; thời hạn đúng.</li>
<li>Giải thích hệ quả nếu chậm (sản xuất/giao hàng sẽ bị trễ).</li>
</ul>
<pre><code>【催开信用证信样例 — Mẫu thư thúc mở L/C】
尊敬的先生：

  根据第2026-088号合同规定，贵方应于9月25日前
  通过开证行开出不可撤销的信用证。
  Gēnjù dì 2026-088 hào hétong guīdìng, guì fāng yīng yú jiǔ yuè èrshíwǔ rì qián
  tōngguò kāizhèngháng kāi chū bùkě chèxiāo de xìnyòngzhèng.
  (Theo quy định của hợp đồng số 2026-088, quý công ty phải mở tín dụng thư
  không thể huỷ ngang qua ngân hàng phát hành trước ngày 25/9.)

  截至目前我方尚未收到该证，请贵方尽快办理，
  以免影响装运期。
  Jiézhì mùqián wǒ fāng shàng wèi shōudào gāi zhèng, qǐng guì fāng jǐnkuài bànlǐ,
  yǐmiǎn yǐngxiǎng zhuāngyùnqī.
  (Đến nay chúng tôi vẫn chưa nhận được, xin quý công ty làm sớm
  để không ảnh hưởng thời gian giao hàng.)

此致
敬礼！
</code></pre>
<h3>Khung viết — thư xác nhận đã nhận L/C (确认收到信用证信框架)</h3>
<ul>
<li>Xác nhận số L/C, số tiền, và việc L/C không thể huỷ ngang — chỉ ra ngay nếu có điểm không khớp với hợp đồng (số tiền/ngày/mô tả hàng phải khớp chính xác).</li>
<li>Xác nhận các chứng từ sẽ trình để 议付 (hoá đơn, phiếu đóng gói, 提单, giấy chứng nhận bảo hiểm...) sau khi giao hàng.</li>
</ul>
<div class="callout"><span class="badge">Ghi chú</span> Mọi điều khoản của L/C phải khớp CHÍNH XÁC với hợp đồng — ngân hàng trả tiền dựa trên chứng từ, không dựa trên hàng hoá thực tế, nên một từ hoặc số liệu sai lệch là lý do để từ chối thanh toán. 不可撤销 (không thể huỷ ngang) là điều tối thiểu người bán nên chấp nhận; L/C có thể huỷ ngang có thể bị bên mua hủy mà không cần báo trước.</div>`,
  ]]);

const c5q = quiz('cbc401-quiz-5', 'Quiz 5 — L/C & payment|||Quiz 5 — Tín dụng thư & thanh toán', [
  { id: 'q1', question: 'Vì sao ngân hàng có thể từ chối thanh toán dù hàng đã giao đúng thực tế?', options: ['Vì ngân hàng không tin người bán', 'Vì ngân hàng trả tiền dựa trên chứng từ khớp L/C, không dựa trên hàng hoá thực tế', 'Vì hàng hoá luôn bị kiểm tra lại', 'Vì L/C chỉ áp dụng cho hàng nội địa'], correctIndex: 1, explanation: 'Nguyên tắc của L/C: ngân hàng chỉ đối chiếu chứng từ (单据) với điều khoản L/C — chứng từ sai một chi tiết là đủ để bị từ chối, bất kể hàng thật thế nào.' },
  { id: 'q2', question: '"不可撤销" (bùkě chèxiāo) trong tín dụng thư nghĩa là gì, và vì sao quan trọng với người bán?', options: ['Có thể huỷ bất cứ lúc nào — không quan trọng', 'Không thể huỷ ngang — bảo vệ người bán khỏi việc bên mua tự ý huỷ mà không báo trước', 'Là loại tiền tệ thanh toán', 'Là ngân hàng chiết khấu chứng từ'], correctIndex: 1, explanation: '不可撤销 (irrevocable) là mức tối thiểu người bán nên yêu cầu; L/C loại này không thể bị bên mua huỷ đơn phương.' },
  { id: 'q3', question: '"提单" (tídān) là loại chứng từ gì?', options: ['Hối phiếu', 'Vận đơn (bill of lading)', 'Giấy chứng nhận bảo hiểm', 'Phiếu đóng gói'], correctIndex: 1, explanation: '提单 = vận đơn (B/L), một trong các chứng từ bắt buộc để trình ngân hàng nhận thanh toán qua L/C.' },
]);

const c6 = doc('cbc401-6-1-shipment-claim', 'Chapter 6 — Shipment & claim letters (装运, 索赔)|||Chương 6 — Thư giao hàng, vận chuyển & khiếu nại (装运, 索赔)',
  'Từ vựng: 装运, 提单, 保险, 索赔, 破损, 短装, 赔偿, 理赔. Khung viết thư báo giao hàng và thư khiếu nại khi hàng có vấn đề.',
  [[
    `<span class="eyebrow">CBC401 · Chapter 6</span>
<h2>Shipment &amp; claim letters (装运信与索赔信)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>装运</td><td>zhuāngyùn</td><td>shipment; to ship</td></tr>
<tr><td>提单</td><td>tídān</td><td>bill of lading (B/L)</td></tr>
<tr><td>保险</td><td>bǎoxiǎn</td><td>insurance</td></tr>
<tr><td>索赔</td><td>suǒpéi</td><td>to file a claim</td></tr>
<tr><td>破损</td><td>pòsǔn</td><td>damaged / broken</td></tr>
<tr><td>短装</td><td>duǎnzhuāng</td><td>short-shipped (less quantity than ordered)</td></tr>
<tr><td>赔偿</td><td>péicháng</td><td>compensation; to compensate</td></tr>
<tr><td>理赔</td><td>lǐpéi</td><td>to settle a claim</td></tr>
<tr><td>检验证书</td><td>jiǎnyàn zhèngshū</td><td>inspection certificate</td></tr>
</table>
<h3>Writing frame — shipping advice (装运通知信框架)</h3>
<ul>
<li>State the order/contract number, vessel name and shipment date, and quantity actually shipped.</li>
<li>List key documents already sent (提单, 装箱单, 保险单) and how (courier/email attachment).</li>
</ul>
<h3>Writing frame — claim letter (索赔信框架)</h3>
<ul>
<li>State facts first, with proof: order number, what arrived vs. what was ordered, and attach 检验证书 (inspection certificate) if you have one.</li>
<li>Name the specific problem — 破损 (damaged) or 短装 (short-shipped) — with exact quantity/amount affected.</li>
<li>State your claim precisely: replacement, refund, or a specific 赔偿 amount — vague requests get vague (slow) answers.</li>
<li>Stay factual and polite even when firm — a claim letter is evidence if the dispute escalates.</li>
</ul>
<pre><code>【索赔信样例 — Sample claim letter】
尊敬的经理：

  我方订单第2026-088号货物于9月20日到达后，
  经检验发现50条围巾破损，另短装30条。
  Wǒ fāng dìngdān dì 2026-088 hào huòwù yú jiǔ yuè èrshí rì dàodá hòu,
  jīng jiǎnyàn fāxiàn wǔshí tiáo wéijīn pòsǔn, lìng duǎnzhuāng sānshí tiáo.
  (Our order No. 2026-088 arrived on Sep 20; upon inspection we found
  50 scarves damaged, and 30 pieces short-shipped.)

  随信附上检验证书及照片为证。
  Suí xìn fùshàng jiǎnyàn zhèngshū jí zhàopiàn wéi zhèng.
  (Enclosed are the inspection certificate and photos as proof.)

  请贵方对破损及短装部分予以赔偿，
  共计800美元，并请尽快理赔。
  Qǐng guì fāng duì pòsǔn jí duǎnzhuāng bùfen yǔyǐ péicháng,
  gòngjì bābǎi měiyuán, bìng qǐng jǐnkuài lǐpéi.
  (Please compensate for the damaged and short-shipped goods,
  totalling USD800, and settle the claim promptly.)

此致
敬礼！
</code></pre>
<div class="callout"><span class="badge">Note</span> A claim letter is only as strong as its proof — always attach 检验证书 (inspection certificate) or photos, and name an EXACT quantity and amount. Whether 保险 (insurance) or the seller pays depends on which trade term (FOB/CIF) and who arranged the insurance — check the contract before deciding who to claim against.</div>`,
    `<span class="eyebrow">CBC401 · Chương 6</span>
<h2>Thư giao hàng, vận chuyển &amp; khiếu nại (装运信与索赔信)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>装运</td><td>zhuāngyùn</td><td>giao hàng, vận chuyển (danh/động từ)</td></tr>
<tr><td>提单</td><td>tídān</td><td>vận đơn (B/L)</td></tr>
<tr><td>保险</td><td>bǎoxiǎn</td><td>bảo hiểm</td></tr>
<tr><td>索赔</td><td>suǒpéi</td><td>khiếu nại, yêu cầu bồi thường</td></tr>
<tr><td>破损</td><td>pòsǔn</td><td>hư hỏng, bị vỡ</td></tr>
<tr><td>短装</td><td>duǎnzhuāng</td><td>giao thiếu (ít hơn số đặt)</td></tr>
<tr><td>赔偿</td><td>péicháng</td><td>bồi thường</td></tr>
<tr><td>理赔</td><td>lǐpéi</td><td>giải quyết khiếu nại/bồi thường</td></tr>
<tr><td>检验证书</td><td>jiǎnyàn zhèngshū</td><td>giấy chứng nhận kiểm định</td></tr>
</table>
<h3>Khung viết — thư báo giao hàng (装运通知信框架)</h3>
<ul>
<li>Nêu số đơn hàng/hợp đồng, tên tàu và ngày giao hàng, số lượng thực tế đã giao.</li>
<li>Liệt kê chứng từ chính đã gửi (提单, 装箱单, 保险单) và cách gửi (chuyển phát/đính kèm email).</li>
</ul>
<h3>Khung viết — thư khiếu nại (索赔信框架)</h3>
<ul>
<li>Nêu sự kiện trước, kèm bằng chứng: số đơn hàng, hàng nhận được so với hàng đặt, kèm 检验证书 (giấy kiểm định) nếu có.</li>
<li>Chỉ rõ vấn đề cụ thể — 破损 (hư hỏng) hoặc 短装 (giao thiếu) — với số lượng/số tiền chính xác bị ảnh hưởng.</li>
<li>Nêu chính xác yêu cầu: đổi hàng, hoàn tiền, hay một mức 赔偿 cụ thể — yêu cầu mơ hồ sẽ nhận phản hồi mơ hồ (và chậm).</li>
<li>Giữ giọng khách quan, lịch sự dù cứng rắn — thư khiếu nại là bằng chứng nếu tranh chấp leo thang.</li>
</ul>
<pre><code>【索赔信样例 — Mẫu thư khiếu nại】
尊敬的经理：

  我方订单第2026-088号货物于9月20日到达后，
  经检验发现50条围巾破损，另短装30条。
  Wǒ fāng dìngdān dì 2026-088 hào huòwù yú jiǔ yuè èrshí rì dàodá hòu,
  jīng jiǎnyàn fāxiàn wǔshí tiáo wéijīn pòsǔn, lìng duǎnzhuāng sānshí tiáo.
  (Hàng của đơn số 2026-088 chúng tôi đến ngày 20/9; qua kiểm tra
  phát hiện 50 chiếc khăn bị hư hỏng, và giao thiếu 30 chiếc.)

  随信附上检验证书及照片为证。
  Suí xìn fùshàng jiǎnyàn zhèngshū jí zhàopiàn wéi zhèng.
  (Kèm theo thư là giấy chứng nhận kiểm định và ảnh làm bằng chứng.)

  请贵方对破损及短装部分予以赔偿，
  共计800美元，并请尽快理赔。
  Qǐng guì fāng duì pòsǔn jí duǎnzhuāng bùfen yǔyǐ péicháng,
  gòngjì bābǎi měiyuán, bìng qǐng jǐnkuài lǐpéi.
  (Xin quý công ty bồi thường phần hư hỏng và giao thiếu,
  tổng cộng 800 USD, và xin giải quyết khiếu nại sớm.)

此致
敬礼！
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Một thư khiếu nại mạnh hay yếu phụ thuộc vào bằng chứng — luôn kèm 检验证书 (giấy kiểm định) hoặc ảnh, và nêu CHÍNH XÁC số lượng, số tiền. Việc 保险 (bảo hiểm) hay người bán trả tuỳ vào điều kiện thương mại (FOB/CIF) và ai mua bảo hiểm — kiểm tra hợp đồng trước khi quyết định khiếu nại bên nào.</div>`,
  ]]);

const c6q = quiz('cbc401-quiz-6', 'Quiz 6 — Shipment & claim|||Quiz 6 — Giao hàng & khiếu nại', [
  { id: 'q1', question: 'Một thư khiếu nại (索赔信) thuyết phục cần có yếu tố gì?', options: ['Chỉ cần nói chung là hàng không tốt', 'Bằng chứng cụ thể (giấy kiểm định/ảnh) và số lượng, số tiền chính xác', 'Viết bằng giọng gay gắt để gây áp lực', 'Không cần nêu số đơn hàng'], correctIndex: 1, explanation: 'Thư khiếu nại mạnh dựa trên bằng chứng rõ (检验证书, ảnh) và số liệu chính xác — yêu cầu mơ hồ nhận phản hồi mơ hồ, chậm.' },
  { id: 'q2', question: '"短装" (duǎnzhuāng) nghĩa là gì?', options: ['Hàng bị hư hỏng khi vận chuyển', 'Giao hàng với số lượng ít hơn số đã đặt', 'Giao hàng chậm hơn hợp đồng', 'Hàng bị sai mẫu mã'], correctIndex: 1, explanation: '短装 = giao thiếu, tức số lượng thực nhận ít hơn số lượng đã đặt trong đơn hàng.' },
  { id: 'q3', question: 'Việc bên nào (người bán hay bảo hiểm) chịu trách nhiệm cho hàng hư hỏng khi vận chuyển phụ thuộc vào điều gì?', options: ['Luôn luôn là người bán chịu, không có ngoại lệ', 'Điều kiện thương mại (FOB/CIF) và ai là người mua bảo hiểm theo hợp đồng', 'Luôn luôn là bên mua tự chịu', 'Không liên quan đến hợp đồng, tuỳ thoả thuận miệng'], correctIndex: 1, explanation: 'Trách nhiệm phụ thuộc điều kiện thương mại (FOB/CIF...) quy định trong hợp đồng — phải kiểm tra trước khi xác định bên chịu trách nhiệm bồi thường.' },
]);

const c7 = doc('cbc401-7-1-email-notice-cooperation', 'Chapter 7 — Business emails, notices & cooperation invitations (商务邮件与通知)|||Chương 7 — Email thương mại, thông báo & mời hợp tác (商务邮件与通知)',
  'Từ vựng: 邮件, 附件, 通知, 合作, 洽谈, 展会, 诚邀, 回复, 主题. Khung viết email thương mại, thư thông báo nội bộ/khách hàng và thư mời hợp tác.',
  [[
    `<span class="eyebrow">CBC401 · Chapter 7</span>
<h2>Business emails, notices &amp; cooperation invitations (商务邮件、通知与邀请信)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>邮件</td><td>yóujiàn</td><td>email / mail</td></tr>
<tr><td>附件</td><td>fùjiàn</td><td>attachment</td></tr>
<tr><td>通知</td><td>tōngzhī</td><td>notice; to notify</td></tr>
<tr><td>合作</td><td>hézuò</td><td>cooperation</td></tr>
<tr><td>洽谈</td><td>qiàtán</td><td>to hold business talks</td></tr>
<tr><td>展会</td><td>zhǎnhuì</td><td>trade fair / exhibition</td></tr>
<tr><td>诚邀</td><td>chéngyāo</td><td>to sincerely invite</td></tr>
<tr><td>回复</td><td>huífù</td><td>reply</td></tr>
<tr><td>主题</td><td>zhǔtí</td><td>email subject line</td></tr>
</table>
<h3>Writing frame — a business email (商务邮件框架)</h3>
<ul>
<li><strong>主题 (subject line):</strong> short, specific — "关于第2026-088号订单交货期" not just "Question".</li>
<li>Body keeps the same letter skeleton but shorter: greeting → purpose in the first line → details → request → closing.</li>
<li>List every attachment by name at the end: "附件：装箱单、发票" so nothing is missed.</li>
</ul>
<h3>Writing frame — a notice (通知信框架)</h3>
<ul>
<li>State who it is for, the fact/change, the effective date, and any action required — notices are announcements, not requests, so keep them direct.</li>
</ul>
<h3>Writing frame — inviting cooperation (邀请合作信框架)</h3>
<ul>
<li>Introduce your company briefly and where you learned of them (展会/网站/行业介绍).</li>
<li>State exactly what cooperation you propose (agency, joint venture, long-term supply) and why it benefits them.</li>
<li>Propose a next step: a call, a meeting, or a visit at an upcoming trade fair.</li>
</ul>
<pre><code>【邀请合作邮件样例 — Sample cooperation-invitation email】
主题：诚邀贵司合作 — 真丝制品长期供应

尊敬的经理：

  我方在广交会上了解到贵司在欧洲市场的销售网络，
  诚邀贵司探讨真丝制品的长期合作。
  Wǒ fāng zài Guǎngjiāohuì shàng liǎojiě dào guì sī zài Ōuzhōu shìchǎng de xiāoshòu wǎngluò,
  chéngyāo guì sī tàntǎo zhēnsī zhìpǐn de chángqī hézuò.
  (We learned about your sales network in the European market at the
  Canton Fair, and would sincerely invite you to discuss long-term
  cooperation on silk products.)

  如贵司有兴趣，欢迎回复邮件，安排时间进一步洽谈。
  Rú guì sī yǒu xìngqù, huānyíng huífù yóujiàn, ānpái shíjiān jìnyíbù qiàtán.
  (If interested, please reply so we can arrange a time to talk further.)

  附件：公司简介、产品目录
  Fùjiàn: gōngsī jiǎnjiè, chǎnpǐn mùlù
  (Attachments: company profile, product catalogue)

此致
敬礼！
</code></pre>
<div class="callout"><span class="badge">Note</span> A specific 主题 (subject line) referencing the order/contract number is what gets a busy buyer to open the email first — a vague subject gets buried. Always list 附件 by name at the end of the email so the reader knows what to expect and check for.</div>`,
    `<span class="eyebrow">CBC401 · Chương 7</span>
<h2>Email thương mại, thông báo &amp; thư mời hợp tác (商务邮件、通知与邀请信)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>邮件</td><td>yóujiàn</td><td>email, thư điện tử</td></tr>
<tr><td>附件</td><td>fùjiàn</td><td>tài liệu đính kèm</td></tr>
<tr><td>通知</td><td>tōngzhī</td><td>thông báo</td></tr>
<tr><td>合作</td><td>hézuò</td><td>hợp tác</td></tr>
<tr><td>洽谈</td><td>qiàtán</td><td>đàm phán, thương thảo kinh doanh</td></tr>
<tr><td>展会</td><td>zhǎnhuì</td><td>hội chợ, triển lãm thương mại</td></tr>
<tr><td>诚邀</td><td>chéngyāo</td><td>chân thành mời</td></tr>
<tr><td>回复</td><td>huífù</td><td>hồi âm, trả lời</td></tr>
<tr><td>主题</td><td>zhǔtí</td><td>tiêu đề email (subject line)</td></tr>
</table>
<h3>Khung viết — email thương mại (商务邮件框架)</h3>
<ul>
<li><strong>主题 (tiêu đề email):</strong> ngắn, cụ thể — "关于第2026-088号订单交货期" thay vì chỉ "Question".</li>
<li>Thân email giữ đúng khung thư nhưng ngắn hơn: chào → mục đích ở câu đầu → chi tiết → yêu cầu → kết.</li>
<li>Liệt kê tên từng tài liệu đính kèm ở cuối: "附件：装箱单、发票" để không bị sót.</li>
</ul>
<h3>Khung viết — thư thông báo (通知信框架)</h3>
<ul>
<li>Nêu rõ đối tượng nhận, sự kiện/thay đổi, ngày có hiệu lực, và hành động cần làm (nếu có) — thông báo là công bố, không phải yêu cầu, nên viết trực tiếp.</li>
</ul>
<h3>Khung viết — thư mời hợp tác (邀请合作信框架)</h3>
<ul>
<li>Giới thiệu ngắn công ty mình và nơi biết đến đối tác (展会/网站/giới thiệu ngành).</li>
<li>Nêu chính xác hình thức hợp tác đề xuất (đại lý, liên doanh, cung cấp dài hạn) và lợi ích cho họ.</li>
<li>Đề xuất bước tiếp theo: cuộc gọi, cuộc gặp, hoặc gặp tại hội chợ sắp tới.</li>
</ul>
<pre><code>【邀请合作邮件样例 — Mẫu email mời hợp tác】
主题：诚邀贵司合作 — 真丝制品长期供应

尊敬的经理：

  我方在广交会上了解到贵司在欧洲市场的销售网络，
  诚邀贵司探讨真丝制品的长期合作。
  Wǒ fāng zài Guǎngjiāohuì shàng liǎojiě dào guì sī zài Ōuzhōu shìchǎng de xiāoshòu wǎngluò,
  chéngyāo guì sī tàntǎo zhēnsī zhìpǐn de chángqī hézuò.
  (Chúng tôi biết đến mạng lưới bán hàng của quý công ty ở thị trường
  châu Âu qua hội chợ Canton Fair, chân thành mời quý công ty trao đổi
  hợp tác dài hạn về sản phẩm lụa.)

  如贵司有兴趣，欢迎回复邮件，安排时间进一步洽谈。
  Rú guì sī yǒu xìngqù, huānyíng huífù yóujiàn, ānpái shíjiān jìnyíbù qiàtán.
  (Nếu quý công ty quan tâm, xin hồi âm để chúng ta sắp xếp thời gian
  trao đổi thêm.)

  附件：公司简介、产品目录
  Fùjiàn: gōngsī jiǎnjiè, chǎnpǐn mùlù
  (Đính kèm: giới thiệu công ty, catalogue sản phẩm)

此致
敬礼！
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Một 主题 (tiêu đề email) cụ thể có nhắc số đơn hàng/hợp đồng là điều khiến người mua bận rộn mở email trước tiên — tiêu đề mơ hồ dễ bị bỏ sót. Luôn liệt kê 附件 theo tên ở cuối email để người nhận biết cần kiểm tra gì.</div>`,
  ]]);

const c7q = quiz('cbc401-quiz-7', 'Quiz 7 — Email & cooperation|||Quiz 7 — Email & mời hợp tác', [
  { id: 'q1', question: 'Vì sao tiêu đề email (主题) nên cụ thể, ví dụ nhắc số đơn hàng, thay vì viết chung như "Question"?', options: ['Vì tiêu đề dài mới trang trọng', 'Vì tiêu đề cụ thể giúp người bận rộn nhận biết và mở email trước, tiêu đề mơ hồ dễ bị bỏ sót', 'Không có sự khác biệt nào', 'Vì hệ thống email tự động xoá tiêu đề ngắn'], correctIndex: 1, explanation: 'Tiêu đề cụ thể (có số đơn hàng/hợp đồng) giúp người nhận ưu tiên xử lý; tiêu đề mơ hồ dễ bị lẫn và bỏ sót.' },
  { id: 'q2', question: '"附件" (fùjiàn) trong một email thương mại nên được xử lý thế nào?', options: ['Không cần nhắc đến trong nội dung email', 'Liệt kê rõ tên từng tài liệu đính kèm ở cuối email', 'Chỉ cần nói "có đính kèm" mà không cần liệt kê', 'Gửi riêng một email khác không liên quan'], correctIndex: 1, explanation: 'Liệt kê tên từng 附件 ở cuối email giúp người nhận biết chính xác cần kiểm tra/tải xuống gì, tránh sót tài liệu.' },
  { id: 'q3', question: 'Một thư thông báo (通知) khác với một thư yêu cầu/đề nghị ở điểm nào?', options: ['Thông báo luôn phải xin phép trước khi công bố', 'Thông báo là công bố sự kiện/thay đổi một cách trực tiếp, không phải lời đề nghị chờ phản hồi', 'Thông báo luôn cần chữ ký của khách hàng', 'Không có sự khác biệt gì'], correctIndex: 1, explanation: 'Thư thông báo (通知) nêu thẳng sự kiện, ngày hiệu lực và hành động cần làm — mang tính công bố, khác với thư đề nghị/yêu cầu cần chờ đồng ý.' },
]);

const c8 = doc('cbc401-8-1-review-full-set', 'Chapter 8 — Review: a complete transaction set & foreign-trade terms|||Chương 8 — Ôn tập: bộ thư tín giao dịch hoàn chỉnh & thuật ngữ ngoại thương',
  'Ôn toàn bộ quy trình 询盘→报盘→还盘→订单→信用证→装运→索赔 qua một giao dịch mẫu; bảng thuật ngữ Incoterms & ngoại thương cốt lõi.',
  [[
    `<span class="eyebrow">CBC401 · Chapter 8 · Review</span>
<h2>Review: a complete transaction correspondence set (外贸函电综合复习)</h2>
<p class="lead">A real deal is a CHAIN of letters, each depending on the one before. Below is the full chain for one transaction — trace how the order number, price and quantity carry through every letter, and notice how each letter type reuses the same skeleton from Chapter 1.</p>
<h3>The full chain (完整流程)</h3>
<pre><code>询盘 xúnpán (Inquiry)
  -> 报盘 bàopán (Offer: price + terms + validity)
  -> 还盘 huánpán (Counter-offer: price/quantity negotiation)
  -> 成交 chéngjiāo (Deal closed — both sides agree)
  -> 订单 dìngdān (Buyer places the order)
  -> 确认 quèrèn (Seller confirms every figure back)
  -> 信用证 xìnyòngzhèng (Buyer opens the L/C; seller checks it matches the contract)
  -> 装运 zhuāngyùn (Seller ships, sends 提单/装箱单/保险单)
  -> 索赔 suǒpéi (IF something is wrong: damaged/short-shipped -> claim with proof)
</code></pre>
<h3>Core foreign-trade terms review (贸易术语与外贸词汇总复习)</h3>
<table>
<tr><th>汉字/Term</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>离岸价 (FOB)</td><td>lí'àn jià</td><td>Free On Board — seller's cost/risk ends when goods pass the ship's rail</td></tr>
<tr><td>到岸价 (CIF)</td><td>dào'àn jià</td><td>Cost, Insurance &amp; Freight — seller pays freight + insurance to destination port</td></tr>
<tr><td>运费在内价 (CFR)</td><td>yùnfèi zài nèi jià</td><td>Cost &amp; Freight — like CIF but buyer arranges insurance</td></tr>
<tr><td>合同</td><td>hétong</td><td>contract</td></tr>
<tr><td>信用证</td><td>xìnyòngzhèng</td><td>letter of credit (L/C)</td></tr>
<tr><td>装运</td><td>zhuāngyùn</td><td>shipment</td></tr>
<tr><td>索赔</td><td>suǒpéi</td><td>claim</td></tr>
<tr><td>报盘 / 还盘</td><td>bàopán / huánpán</td><td>offer / counter-offer</td></tr>
<tr><td>订单</td><td>dìngdān</td><td>purchase order</td></tr>
</table>
<h3>Checklist before sending ANY business letter (发信前自查清单)</h3>
<ul>
<li>Skeleton complete: 信头, 日期, 称呼, 正文 (one idea/paragraph), 此致 敬礼, 签名.</li>
<li>Every number (price, quantity, date, amount) checked against the previous letter in the chain.</li>
<li>The trade term (FOB/CIF/CFR) is stated whenever a price appears.</li>
<li>Register is formal throughout — no spoken-Chinese fillers.</li>
<li>Attachments (附件) listed by name if any documents are enclosed.</li>
</ul>
<div class="callout"><span class="badge">Exam tip</span> When asked to draft a letter, first identify WHERE it sits in the chain above — that tells you which figures must already be fixed (carried from the previous letter) and which are new (your own proposal/decision in this letter).</div>`,
    `<span class="eyebrow">CBC401 · Chương 8 · Ôn tập</span>
<h2>Ôn tập: bộ thư tín giao dịch hoàn chỉnh (外贸函电综合复习)</h2>
<p class="lead">Một giao dịch thật là một CHUỖI thư, thư sau phụ thuộc thư trước. Dưới đây là chuỗi đầy đủ cho một giao dịch — theo dõi số đơn hàng, giá và số lượng được mang theo qua từng thư, và để ý mỗi loại thư đều dùng lại đúng khung ở Chương 1.</p>
<h3>Chuỗi đầy đủ (完整流程)</h3>
<pre><code>询盘 xúnpán (Hỏi hàng)
  -> 报盘 bàopán (Chào hàng: giá + điều khoản + thời hạn hiệu lực)
  -> 还盘 huánpán (Hoàn giá: đàm phán giá/số lượng)
  -> 成交 chéngjiāo (Chốt giao dịch — hai bên đồng ý)
  -> 订单 dìngdān (Bên mua đặt hàng chính thức)
  -> 确认 quèrèn (Bên bán xác nhận lại đầy đủ số liệu)
  -> 信用证 xìnyòngzhèng (Bên mua mở L/C; bên bán kiểm tra khớp hợp đồng)
  -> 装运 zhuāngyùn (Bên bán giao hàng, gửi 提单/装箱单/保险单)
  -> 索赔 suǒpéi (NẾU có vấn đề: hư hỏng/giao thiếu -> khiếu nại kèm bằng chứng)
</code></pre>
<h3>Ôn thuật ngữ ngoại thương cốt lõi (贸易术语与外贸词汇总复习)</h3>
<table>
<tr><th>汉字/Thuật ngữ</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>离岸价 (FOB)</td><td>lí'àn jià</td><td>Giá FOB — trách nhiệm/rủi ro của bên bán hết khi hàng qua lan can tàu</td></tr>
<tr><td>到岸价 (CIF)</td><td>dào'àn jià</td><td>Giá CIF — bên bán trả cước vận chuyển + bảo hiểm đến cảng đích</td></tr>
<tr><td>运费在内价 (CFR)</td><td>yùnfèi zài nèi jià</td><td>Giá CFR — như CIF nhưng bên mua tự mua bảo hiểm</td></tr>
<tr><td>合同</td><td>hétong</td><td>hợp đồng</td></tr>
<tr><td>信用证</td><td>xìnyòngzhèng</td><td>tín dụng thư (L/C)</td></tr>
<tr><td>装运</td><td>zhuāngyùn</td><td>giao hàng, vận chuyển</td></tr>
<tr><td>索赔</td><td>suǒpéi</td><td>khiếu nại</td></tr>
<tr><td>报盘 / 还盘</td><td>bàopán / huánpán</td><td>chào hàng / hoàn giá</td></tr>
<tr><td>订单</td><td>dìngdān</td><td>đơn đặt hàng</td></tr>
</table>
<h3>Danh sách tự kiểm trước khi gửi BẤT KỲ thư thương mại nào (发信前自查清单)</h3>
<ul>
<li>Đủ khung: 信头, 日期, 称呼, 正文 (mỗi đoạn một ý), 此致 敬礼, 签名.</li>
<li>Mọi số liệu (giá, số lượng, ngày, số tiền) đã đối chiếu với thư trước trong chuỗi.</li>
<li>Điều kiện thương mại (FOB/CIF/CFR) được nêu rõ mỗi khi xuất hiện một mức giá.</li>
<li>Văn phong trang trọng suốt cả thư — không dùng từ đệm khẩu ngữ.</li>
<li>附件 (tài liệu đính kèm) được liệt kê theo tên nếu có.</li>
</ul>
<div class="callout"><span class="badge">Mẹo làm bài</span> Khi được yêu cầu soạn một lá thư, trước tiên xác định thư đó NẰM ĐÂU trong chuỗi trên — điều đó cho biết số liệu nào đã cố định (mang từ thư trước) và số liệu nào là mới (đề xuất/quyết định của chính lá thư này).</div>`,
  ]]);

const c8q = quiz('cbc401-quiz-8', 'Quiz 8 — Review: full transaction & terms|||Quiz 8 — Ôn tập: giao dịch hoàn chỉnh & thuật ngữ', [
  { id: 'q1', question: 'Trong chuỗi giao dịch ngoại thương, thư nào diễn ra NGAY SAU khi 还盘 (hoàn giá) được hai bên đồng ý (成交)?', options: ['索赔 (khiếu nại)', '订单 (đặt hàng)', '询盘 (hỏi hàng)', '信用证 (tín dụng thư) luôn đến trước đơn hàng'], correctIndex: 1, explanation: 'Chuỗi chuẩn: 询盘 → 报盘 → 还盘 → 成交 → 订单 → 确认 → 信用证 → 装运 → (索赔 nếu có vấn đề). Sau khi chốt giá (成交), bên mua gửi 订单 chính thức.' },
  { id: 'q2', question: 'Sự khác biệt chính giữa 离岸价 (FOB) và 到岸价 (CIF) là gì?', options: ['FOB và CIF là một, chỉ khác tên gọi', 'CIF bên bán chịu cước vận chuyển + bảo hiểm đến cảng đích, FOB thì hết trách nhiệm khi hàng qua lan can tàu', 'FOB chỉ dùng cho hàng nội địa, CIF chỉ dùng cho hàng quốc tế', 'CIF không cần hợp đồng, FOB cần hợp đồng'], correctIndex: 1, explanation: 'FOB: người bán hết trách nhiệm khi hàng qua lan can tàu tại cảng đi. CIF: người bán còn chịu cước vận chuyển và bảo hiểm đến cảng đích.' },
  { id: 'q3', question: 'Khi soạn một lá thư thương mại bất kỳ, bước đầu tiên nên làm gì theo phần ôn tập này?', options: ['Viết ngay không cần suy nghĩ vì mọi thư đều giống nhau', 'Xác định thư đó nằm ở đâu trong chuỗi giao dịch để biết số liệu nào đã cố định, số liệu nào là mới', 'Luôn bắt đầu bằng một lời khiếu nại để gây chú ý', 'Bỏ qua khung 信头/称呼/结尾敬语 nếu là email'], correctIndex: 1, explanation: 'Xác định vị trí trong chuỗi (询盘→报盘→还盘→订单→确认→信用证→装运→索赔) giúp biết số liệu nào phải khớp với thư trước và số liệu nào là đề xuất mới trong thư đang soạn.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CBC401',
    slug: 'cbc401-chinese-business-correspondence',
    title: 'Chinese Business Correspondence',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CBC401.webp',
    shortDescription: 'Writing Chinese business letters: format, inquiries & offers (询盘/报盘), counter-offers (还盘), orders & confirmation, L/C payment, shipment & claims (索赔), business emails & cooperation invitations, plus a full-transaction review.|||Viết thư tín thương mại tiếng Trung: định dạng, hỏi hàng & chào hàng (询盘/报盘), hoàn giá (还盘), đặt hàng & xác nhận, thanh toán tín dụng thư, giao hàng & khiếu nại (索赔), email & thư mời hợp tác, ôn tập bộ giao dịch hoàn chỉnh.',
    description: 'Môn <strong>CBC401 — Chinese Business Correspondence (Thư tín Thương mại tiếng Trung)</strong> tập trung <strong>kỹ năng VIẾT</strong> thư tín &amp; văn bản thương mại tiếng Trung — khác với các môn tổng hợp thương mại. Đi từ <strong>định dạng &amp; văn phong chung</strong> → <strong>thư hỏi hàng &amp; chào hàng (询盘, 报盘)</strong> → <strong>đàm phán giá (还盘)</strong> → <strong>đặt hàng &amp; xác nhận (订单)</strong> → <strong>thanh toán &amp; tín dụng thư (信用证 L/C)</strong> → <strong>giao hàng, vận chuyển &amp; khiếu nại (索赔)</strong> → <strong>email thương mại &amp; thư mời hợp tác</strong> → <strong>ôn tập bộ thư giao dịch hoàn chỉnh &amp; thuật ngữ ngoại thương</strong>. Bám giáo trình 商务信函写作 / 外贸函电, mỗi chương có mẫu thư thật (chữ Hán + pinyin + nghĩa Việt/Anh), bảng từ vựng, khung viết, và quiz.',
    whatYouLearn: 'Khung 6 phần một thư thương mại tiếng Trung (信头, 日期, 称呼, 正文, 结尾敬语, 签名) và văn phong trang trọng; viết thư hỏi hàng (询盘) &amp; chào hàng (报盘) kèm điều kiện thương mại FOB/CIF; viết thư hoàn giá (还盘) và đàm phán; viết thư đặt hàng (订单) &amp; xác nhận đơn (确认); viết thư liên quan tín dụng thư (信用证 L/C) — 开证行, 不可撤销, 单据; viết thư báo giao hàng (装运) &amp; khiếu nại (索赔) kèm bằng chứng; viết email thương mại, thông báo &amp; thư mời hợp tác (合作); ghép toàn bộ chuỗi thư một giao dịch xuất nhập khẩu thật và ôn thuật ngữ ngoại thương cốt lõi.',
    requirements: 'Đã có nền tiếng Trung tương đương các môn CHI trước đó trong khung ngành Ngôn ngữ Trung (đọc hiểu chữ Hán cơ bản, pinyin, ngữ pháp trình trung cấp). Nên cài Pleco hoặc dùng từ điển hanzii.net để tra chữ &amp; nghe phát âm.',
  },
  sections: [
    { title: 'Chương 1 — Định dạng & văn phong thư tín|||Chapter 1 — Letter format & style', description: '信头, 日期, 称呼, 正文, 结尾敬语, 签名; văn phong trang trọng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thư hỏi hàng & chào hàng|||Chapter 2 — Inquiry & offer letters', description: '询盘, 报盘, 报价, 单价, 起订量, 现货, 有效期.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thư đàm phán giá & điều khoản|||Chapter 3 — Counter-offer & negotiation letters', description: '还盘, 让步, 折扣, 底价, 成交, 付款方式.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thư đặt hàng & xác nhận đơn|||Chapter 4 — Order & confirmation letters', description: '订单, 确认, 装箱单, 交货期, 唛头, 合同, 生效.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thư thanh toán & tín dụng thư|||Chapter 5 — Payment & letter of credit letters', description: '信用证, 开证行, 不可撤销, 议付, 汇票, 提单, 单据.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thư giao hàng, vận chuyển & khiếu nại|||Chapter 6 — Shipment & claim letters', description: '装运, 提单, 保险, 索赔, 破损, 短装, 赔偿.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Email thương mại, thông báo & mời hợp tác|||Chapter 7 — Business emails, notices & cooperation', description: '邮件, 附件, 通知, 合作, 洽谈, 展会, 诚邀.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập: bộ thư tín giao dịch hoàn chỉnh|||Chapter 8 — Review: complete transaction set', description: 'Chuỗi 询盘→报盘→还盘→订单→信用证→装运→索赔; bảng thuật ngữ Incoterms.', lessons: [c8, c8q] },
  ],
};
