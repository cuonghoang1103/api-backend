/**
 * CIN401 — Chinese for International Trade Negotiation (Tiếng Trung Đàm phán
 * Thương mại Quốc tế). Ngành Ngôn ngữ Trung, FPTU, Kỳ 4.
 * ⚠️ Khác CIB301/401 (tiếng Trung thương mại tổng hợp: giới thiệu công ty,
 * thư tín, marketing, xuất nhập khẩu...) và CBC401 (thư tín). CIN401 CHỈ đi
 * sâu vào ĐÀM PHÁN: 8 chương theo trình tự một cuộc đàm phán thật — mở đầu,
 * mặc cả, điều khoản/số lượng, chất lượng/đóng gói/giao hàng, thanh toán/bảo
 * hiểm, xử lý bất đồng, chốt hợp đồng, ôn tập mô phỏng hoàn chỉnh.
 * Trích dẫn giáo trình "国际商务谈判" (International Business Negotiation) &
 * "商务谈判汉语", KHÔNG upload PDF. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${ lồng nhau; UTF-8 chữ Hán + pinyin dấu thanh thật.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('cin401-1-1-opening-quotation', '1.1 — Preparation & opening the negotiation (开场, 报价)|||1.1 — Chuẩn bị & mở đầu đàm phán (开场, 报价)',
  'Từ vựng chuẩn bị đàm phán: 开场白/报价单/询盘/诚意; hội thoại lần đầu gặp đối tác, tự giới thiệu, xin báo giá sơ bộ.',
  [[
    `<span class="eyebrow">CIN401 · Chapter 1 · Lesson 1.1</span>
<h2>Preparation &amp; opening — 开场, 报价 (kāichǎng, bàojià)</h2>
<h3>Vocabulary</h3>
<pre><code>准备工作 zhǔnbèi gōngzuò   preparation work
开场白   kāichǎngbái       opening remarks
自我介绍 zìwǒ jièshào      self-introduction
久仰大名 jiǔyǎng dàmíng    "I have long admired your name" (polite)
诚意     chéngyì           sincerity, good faith
询盘     xúnpán            inquiry (trade term)
报价单   bàojiàdān         quotation sheet
初步报价 chūbù bàojià      preliminary quotation
供应商   gōngyìngshāng     supplier
采购方   cǎigòufāng        buying party
洽谈     qiàtán            to hold talks, to negotiate
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>久仰大名，早就想跟贵公司合作了</strong> "I have long admired you, I have wanted to cooperate with your company for a while" — a polite opener that flatters before business starts.</li>
<li><strong>我们对贵公司的……很感兴趣</strong> "We are very interested in your company's ……" — state the interest before asking for numbers.</li>
<li><strong>能不能先给我们一个初步报价？</strong> "Could you give us a preliminary quotation first?" — the standard way to open the price discussion without committing.</li>
</ul>
<h3>Dialogue — first meeting at the seller&rsquo;s office</h3>
<pre><code>甲 (Buyer): 您好，久仰大名，早就想跟贵公司合作了。
    Nín hǎo, jiǔyǎng dàmíng, zǎo jiù xiǎng gēn guì gōngsī hézuò le.
    "Hello, I have long admired you, I have wanted to work with your company."
乙 (Seller): 您太客气了，欢迎欢迎！请问贵公司主要经营什么产品？
    Nín tài kèqi le, huānyíng huānyíng! Qǐngwèn guì gōngsī zhǔyào jīngyíng shénme chǎnpǐn?
    "You are too kind, welcome! What products does your company mainly deal in?"
甲: 我们是越南的电子产品进口商，对贵公司的耳机很感兴趣。
    Wǒmen shì Yuènán de diànzǐ chǎnpǐn jìnkǒushāng, duì guì gōngsī de ěrjī hěn gǎn xìngqù.
    "We are a Vietnamese electronics importer, very interested in your headphones."
乙: 好的，这是我们的初步报价单，请您过目。
    Hǎo de, zhè shì wǒmen de chūbù bàojiàdān, qǐng nín guòmù.
    "Sure, here is our preliminary quotation, please take a look."
甲: 谢谢，我们先了解一下，再跟您详细洽谈价格和数量。
    Xièxie, wǒmen xiān liǎojiě yíxià, zài gēn nín xiángxì qiàtán jiàgé hé shùliàng.
    "Thank you, let us study it first, then we will discuss price and quantity in detail."
</code></pre>
<div class="callout"><span class="badge">Tip</span> Never ask for the "final price" in the opening meeting — 初步报价 (a preliminary figure) keeps both sides free to move in the bargaining chapter that follows.</div>`,
    `<span class="eyebrow">CIN401 · Chương 1 · Bài 1.1</span>
<h2>Chuẩn bị &amp; mở đầu — 开场, 报价 (kāichǎng, bàojià)</h2>
<h3>Từ vựng</h3>
<pre><code>准备工作 zhǔnbèi gōngzuò   công tác chuẩn bị
开场白   kāichǎngbái       lời mở đầu
自我介绍 zìwǒ jièshào      tự giới thiệu
久仰大名 jiǔyǎng dàmíng    "đã nghe danh từ lâu" (câu xã giao)
诚意     chéngyì           thiện chí
询盘     xúnpán            hỏi hàng (thuật ngữ ngoại thương)
报价单   bàojiàdān         bảng báo giá
初步报价 chūbù bàojià      báo giá sơ bộ
供应商   gōngyìngshāng     nhà cung cấp
采购方   cǎigòufāng        bên mua
洽谈     qiàtán            đàm đạo, thương lượng
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>久仰大名，早就想跟贵公司合作了</strong> "Đã nghe danh từ lâu, tôi vẫn muốn hợp tác với quý công ty" — câu mở đầu xã giao trước khi vào việc.</li>
<li><strong>我们对贵公司的……很感兴趣</strong> "Chúng tôi rất quan tâm đến …… của quý công ty" — nêu sự quan tâm trước khi hỏi giá.</li>
<li><strong>能不能先给我们一个初步报价？</strong> "Cho chúng tôi xin một báo giá sơ bộ trước được không?" — cách mở đầu chuẩn để vào phần giá mà chưa ràng buộc.</li>
</ul>
<h3>Hội thoại — lần đầu gặp tại văn phòng bên bán</h3>
<pre><code>甲 (Bên mua): 您好，久仰大名，早就想跟贵公司合作了。
    Nín hǎo, jiǔyǎng dàmíng, zǎo jiù xiǎng gēn guì gōngsī hézuò le.
    "Xin chào, đã nghe danh từ lâu, tôi vẫn muốn hợp tác với quý công ty."
乙 (Bên bán): 您太客气了，欢迎欢迎！请问贵公司主要经营什么产品？
    Nín tài kèqi le, huānyíng huānyíng! Qǐngwèn guì gōngsī zhǔyào jīngyíng shénme chǎnpǐn?
    "Anh/chị quá khen, hoan nghênh! Quý công ty chủ yếu kinh doanh sản phẩm gì?"
甲: 我们是越南的电子产品进口商，对贵公司的耳机很感兴趣。
    Wǒmen shì Yuènán de diànzǐ chǎnpǐn jìnkǒushāng, duì guì gōngsī de ěrjī hěn gǎn xìngqù.
    "Chúng tôi là nhà nhập khẩu điện tử Việt Nam, rất quan tâm đến tai nghe của quý công ty."
乙: 好的，这是我们的初步报价单，请您过目。
    Hǎo de, zhè shì wǒmen de chūbù bàojiàdān, qǐng nín guòmù.
    "Vâng, đây là báo giá sơ bộ của chúng tôi, mời anh/chị xem qua."
甲: 谢谢，我们先了解一下，再跟您详细洽谈价格和数量。
    Xièxie, wǒmen xiān liǎojiě yíxià, zài gēn nín xiángxì qiàtán jiàgé hé shùliàng.
    "Cảm ơn, chúng tôi tìm hiểu trước, sau đó sẽ đàm phán chi tiết về giá và số lượng."
</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> Đừng hỏi ngay "giá cuối cùng" ở buổi gặp đầu tiên — 初步报价 (báo giá sơ bộ) giữ cho cả hai bên còn dư địa để mặc cả ở chương sau.</div>`,
  ]]);

const c1q = quiz('cin401-quiz-1', 'Quiz 1 — Opening & quotation|||Quiz 1 — Mở đầu & báo giá', [
  { id: 'q1', question: '"初步报价" trong đàm phán thương mại nghĩa là gì?', options: ['Giá cuối cùng không thể đổi', 'Báo giá sơ bộ, còn có thể thương lượng', 'Hợp đồng đã ký', 'Danh sách khách hàng cũ'], correctIndex: 1, explanation: '初步报价 (chūbù bàojià) = báo giá sơ bộ, đưa ra ở buổi gặp đầu để hai bên còn dư địa mặc cả sau.' },
  { id: 'q2', question: '"久仰大名" dùng để làm gì trong đàm phán?', options: ['Từ chối hợp tác', 'Câu xã giao mở đầu, thể hiện thiện chí', 'Yêu cầu giảm giá', 'Kết thúc cuộc họp'], correctIndex: 1, explanation: '久仰大名 (jiǔyǎng dàmíng) là câu lịch sự mở đầu, tạo thiện chí trước khi vào nội dung giá cả.' },
  { id: 'q3', question: '"询盘" (xúnpán) trong ngoại thương chỉ hành động nào?', options: ['Ký hợp đồng', 'Hỏi hàng, hỏi giá ban đầu', 'Vận chuyển hàng', 'Thanh toán tiền hàng'], correctIndex: 1, explanation: '询盘 = bên mua gửi yêu cầu hỏi giá/hỏi hàng tới nhà cung cấp, bước khởi đầu trước báo giá.' },
]);

const c2 = doc('cin401-2-1-bargaining', '2.1 — Inquiry, quotation & bargaining (讨价还价)|||2.1 — Hỏi giá, chào giá & mặc cả (讨价还价)',
  'Từ vựng mặc cả: 讨价还价/单价/降价/优惠/打折/底价; hội thoại thương lượng giảm giá theo số lượng đặt hàng.',
  [[
    `<span class="eyebrow">CIN401 · Chapter 2 · Lesson 2.1</span>
<h2>Bargaining — 讨价还价 (tǎojià-huánjià)</h2>
<h3>Vocabulary</h3>
<pre><code>讨价还价 tǎojià-huánjià   to haggle, bargain
单价     dānjià           unit price
太贵了   tài guì le       too expensive
降价     jiàngjià         to reduce the price
优惠     yōuhuì           preferential (price/terms)
打折     dǎzhé            to give a discount
底价     dǐjià            rock-bottom price
批量     pīliàng          bulk quantity
成本     chéngběn         cost
利润空间 lìrùn kōngjiān   profit margin
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>这个价格太高了，能不能便宜一点？</strong> "This price is too high, can it be a bit cheaper?" — the standard opening move of a counter-offer.</li>
<li><strong>如果我们大量订购，可以打折吗？</strong> "If we order in bulk, can you give a discount?" — tie the discount request to volume, not just asking outright.</li>
<li><strong>这已经是我们的底价了，没有更多空间了</strong> "This is already our rock-bottom price, there is no more room" — the seller&rsquo;s way to signal a firm limit.</li>
</ul>
<h3>Dialogue — negotiating the unit price</h3>
<pre><code>甲 (Buyer): 您的单价比我们预算高了不少，能不能降价？
    Nín de dānjià bǐ wǒmen yùsuàn gāo le bù shǎo, néng bu néng jiàngjià?
    "Your unit price is much higher than our budget, can you reduce it?"
乙 (Seller): 我们的成本比较高，但如果您批量订购，可以给您优惠。
    Wǒmen de chéngběn bǐjiào gāo, dàn rúguǒ nín pīliàng dìnggòu, kěyǐ gěi nín yōuhuì.
    "Our cost is fairly high, but if you order in bulk we can give you a discount."
甲: 如果我们订五千件，能打几折？
    Rúguǒ wǒmen dìng wǔqiān jiàn, néng dǎ jǐ zhé?
    "If we order 5,000 pieces, what discount can you give?"
乙: 五千件的话，我们可以打九折，这已经是我们的底价了。
    Wǔqiān jiàn dehuà, wǒmen kěyǐ dǎ jiǔ zhé, zhè yǐjīng shì wǒmen de dǐjià le.
    "For 5,000 pieces we can give 10% off, this is already our rock-bottom price."
甲: 好，那我们再考虑一下，明天给您答复。
    Hǎo, nà wǒmen zài kǎolǜ yíxià, míngtiān gěi nín dáfù.
    "Alright, let us think it over and reply tomorrow."
</code></pre>
<div class="callout"><span class="badge">Tactic</span> Always attach a number to a discount request (批量, 五千件…) — an open-ended "can you lower the price?" invites a smaller concession than one tied to a concrete order size.</div>`,
    `<span class="eyebrow">CIN401 · Chương 2 · Bài 2.1</span>
<h2>Mặc cả — 讨价还价 (tǎojià-huánjià)</h2>
<h3>Từ vựng</h3>
<pre><code>讨价还价 tǎojià-huánjià   mặc cả, trả giá
单价     dānjià           đơn giá
太贵了   tài guì le       quá đắt
降价     jiàngjià         giảm giá
优惠     yōuhuì           ưu đãi
打折     dǎzhé            chiết khấu, giảm giá
底价     dǐjià            giá đáy, giá thấp nhất
批量     pīliàng          số lượng lớn, mua sỉ
成本     chéngběn         chi phí
利润空间 lìrùn kōngjiān   biên lợi nhuận
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>这个价格太高了，能不能便宜一点？</strong> "Giá này cao quá, có thể rẻ hơn một chút không?" — nước đi mở đầu để trả giá.</li>
<li><strong>如果我们大量订购，可以打折吗？</strong> "Nếu chúng tôi đặt số lượng lớn, có được giảm giá không?" — gắn yêu cầu giảm giá với số lượng, không hỏi suông.</li>
<li><strong>这已经是我们的底价了，没有更多空间了</strong> "Đây đã là giá đáy của chúng tôi, không còn dư địa nữa" — cách bên bán ra tín hiệu giới hạn dứt khoát.</li>
</ul>
<h3>Hội thoại — thương lượng đơn giá</h3>
<pre><code>甲 (Bên mua): 您的单价比我们预算高了不少，能不能降价？
    Nín de dānjià bǐ wǒmen yùsuàn gāo le bù shǎo, néng bu néng jiàngjià?
    "Đơn giá của anh/chị cao hơn ngân sách của chúng tôi khá nhiều, giảm giá được không?"
乙 (Bên bán): 我们的成本比较高，但如果您批量订购，可以给您优惠。
    Wǒmen de chéngběn bǐjiào gāo, dàn rúguǒ nín pīliàng dìnggòu, kěyǐ gěi nín yōuhuì.
    "Chi phí của chúng tôi khá cao, nhưng nếu đặt số lượng lớn thì có thể ưu đãi."
甲: 如果我们订五千件，能打几折？
    Rúguǒ wǒmen dìng wǔqiān jiàn, néng dǎ jǐ zhé?
    "Nếu chúng tôi đặt 5000 chiếc, giảm được bao nhiêu phần trăm?"
乙: 五千件的话，我们可以打九折，这已经是我们的底价了。
    Wǔqiān jiàn dehuà, wǒmen kěyǐ dǎ jiǔ zhé, zhè yǐjīng shì wǒmen de dǐjià le.
    "Với 5000 chiếc, chúng tôi giảm 10%, đây đã là giá đáy của chúng tôi."
甲: 好，那我们再考虑一下，明天给您答复。
    Hǎo, nà wǒmen zài kǎolǜ yíxià, míngtiān gěi nín dáfù.
    "Được, chúng tôi cân nhắc thêm và trả lời anh/chị vào ngày mai."
</code></pre>
<div class="callout"><span class="badge">Chiến thuật</span> Luôn gắn con số cụ thể vào yêu cầu giảm giá (批量, 五千件…) — hỏi suông "giảm giá được không" thường chỉ nhận được nhượng bộ nhỏ hơn so với gắn con số đơn hàng cụ thể.</div>`,
  ]]);

const c2q = quiz('cin401-quiz-2', 'Quiz 2 — Bargaining|||Quiz 2 — Mặc cả', [
  { id: 'q1', question: '"打九折" tương ứng với mức giảm giá bao nhiêu?', options: ['Giảm 90%', 'Giảm 10%', 'Giảm 9%', 'Tăng 10%'], correctIndex: 1, explanation: '打九折 = tính giá bằng 90% giá gốc, tức là giảm 10%.' },
  { id: 'q2', question: 'Theo bài học, cách hỏi giảm giá hiệu quả hơn là?', options: ['Hỏi chung chung "giảm giá được không?"', 'Gắn yêu cầu giảm giá với một số lượng đặt hàng cụ thể', 'Không nói gì, im lặng chờ bên bán tự giảm', 'Đòi giảm giá ngay ở câu chào hỏi đầu tiên'], correctIndex: 1, explanation: 'Gắn con số cụ thể (vd 五千件) vào yêu cầu giảm giá thường nhận được nhượng bộ lớn hơn hỏi suông.' },
  { id: 'q3', question: '"底价" (dǐjià) nghĩa là gì?', options: ['Giá niêm yết ban đầu', 'Giá thấp nhất bên bán có thể chấp nhận', 'Giá sau thuế', 'Giá vận chuyển'], correctIndex: 1, explanation: '底价 = mức giá đáy, giới hạn thấp nhất mà bên bán còn có thể chấp nhận bán.' },
]);

const c3 = doc('cin401-3-1-terms-quantity', '3.1 — Terms & quantity negotiation (数量与条款)|||3.1 — Thảo luận điều khoản & số lượng (数量与条款)',
  'Từ vựng điều khoản: 起订量/交货期/违约金/分批装运; hội thoại thương lượng số lượng tối thiểu và tiến độ giao hàng.',
  [[
    `<span class="eyebrow">CIN401 · Chapter 3 · Lesson 3.1</span>
<h2>Terms &amp; quantity — 数量与条款 (shùliàng yǔ tiáokuǎn)</h2>
<h3>Vocabulary</h3>
<pre><code>起订量   qǐdìngliàng      minimum order quantity (MOQ)
合同条款 hétong tiáokuǎn  contract clause
交货期   jiāohuòqī        delivery deadline
有效期   yǒuxiàoqī        validity period (of an offer)
违约金   wéiyuējīn        penalty for breach of contract
分批装运 fēnpī zhuāngyùn  shipment in installments
溢短装   yì duǎn zhuāng   more-or-less shipment tolerance
数量条款 shùliàng tiáokuǎn quantity clause
灵活性   línghuóxìng      flexibility
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>我们的起订量是……件</strong> "Our MOQ is …… pieces" — state the minimum before any further terms are discussed.</li>
<li><strong>如果数量增加，交货期是不是要延长？</strong> "If the quantity increases, does the delivery time need to extend?" — link quantity to schedule explicitly.</li>
<li><strong>可以允许百分之五的溢短装吗？</strong> "Can a 5% more-or-less tolerance be allowed?" — standard clause to avoid disputes over exact count.</li>
</ul>
<h3>Dialogue — agreeing on MOQ &amp; delivery schedule</h3>
<pre><code>甲 (Buyer): 请问贵公司的起订量是多少？
    Qǐngwèn guì gōngsī de qǐdìngliàng shì duōshǎo?
    "What is your company&rsquo;s minimum order quantity?"
乙 (Seller): 我们的起订量是两千件，交货期是订单确认后三十天。
    Wǒmen de qǐdìngliàng shì liǎngqiān jiàn, jiāohuòqī shì dìngdān quèrèn hòu sānshí tiān.
    "Our MOQ is 2,000 pieces, delivery is 30 days after order confirmation."
甲: 如果我们分两批装运，第一批一千件，可以吗？
    Rúguǒ wǒmen fēn liǎng pī zhuāngyùn, dì yī pī yìqiān jiàn, kěyǐ ma?
    "If we ship in two installments, 1,000 pieces first, is that possible?"
乙: 可以，不过合同里需要注明分批装运条款和每批的交货期。
    Kěyǐ, búguò hétong lǐ xūyào zhùmíng fēnpī zhuāngyùn tiáokuǎn hé měi pī de jiāohuòqī.
    "Yes, but the contract needs to specify the partial-shipment clause and each batch&rsquo;s delivery date."
甲: 没问题，我们也希望合同注明百分之五的溢短装。
    Méi wèntí, wǒmen yě xīwàng hétong zhùmíng bǎi fēn zhī wǔ de yì duǎn zhuāng.
    "No problem, we also hope the contract states a 5% more-or-less tolerance."
</code></pre>
<div class="callout"><span class="badge">Tip</span> Every quantity concession (分批装运, 溢短装) must be written into 合同条款 — a verbal agreement on numbers has no protection if a dispute arises later.</div>`,
    `<span class="eyebrow">CIN401 · Chương 3 · Bài 3.1</span>
<h2>Điều khoản &amp; số lượng — 数量与条款 (shùliàng yǔ tiáokuǎn)</h2>
<h3>Từ vựng</h3>
<pre><code>起订量   qǐdìngliàng      số lượng đặt hàng tối thiểu (MOQ)
合同条款 hétong tiáokuǎn  điều khoản hợp đồng
交货期   jiāohuòqī        thời hạn giao hàng
有效期   yǒuxiàoqī        thời hạn hiệu lực (của báo giá)
违约金   wéiyuējīn        tiền phạt vi phạm hợp đồng
分批装运 fēnpī zhuāngyùn  giao hàng nhiều đợt
溢短装   yì duǎn zhuāng   dung sai giao thừa/thiếu số lượng
数量条款 shùliàng tiáokuǎn điều khoản số lượng
灵活性   línghuóxìng      tính linh hoạt
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>我们的起订量是……件</strong> "Số lượng đặt hàng tối thiểu của chúng tôi là …… chiếc" — nêu mức tối thiểu trước khi bàn tiếp các điều khoản khác.</li>
<li><strong>如果数量增加，交货期是不是要延长？</strong> "Nếu số lượng tăng, thời hạn giao hàng có phải kéo dài không?" — gắn số lượng với tiến độ giao hàng rõ ràng.</li>
<li><strong>可以允许百分之五的溢短装吗？</strong> "Có thể cho phép dung sai 5% giao thừa/thiếu không?" — điều khoản chuẩn để tránh tranh chấp về số lượng chính xác.</li>
</ul>
<h3>Hội thoại — thống nhất MOQ &amp; tiến độ giao hàng</h3>
<pre><code>甲 (Bên mua): 请问贵公司的起订量是多少？
    Qǐngwèn guì gōngsī de qǐdìngliàng shì duōshǎo?
    "Xin hỏi số lượng đặt hàng tối thiểu của quý công ty là bao nhiêu?"
乙 (Bên bán): 我们的起订量是两千件，交货期是订单确认后三十天。
    Wǒmen de qǐdìngliàng shì liǎngqiān jiàn, jiāohuòqī shì dìngdān quèrèn hòu sānshí tiān.
    "MOQ của chúng tôi là 2000 chiếc, giao hàng trong 30 ngày sau khi xác nhận đơn."
甲: 如果我们分两批装运，第一批一千件，可以吗？
    Rúguǒ wǒmen fēn liǎng pī zhuāngyùn, dì yī pī yìqiān jiàn, kěyǐ ma?
    "Nếu chúng tôi giao thành hai đợt, đợt đầu 1000 chiếc, được không?"
乙: 可以，不过合同里需要注明分批装运条款和每批的交货期。
    Kěyǐ, búguò hétong lǐ xūyào zhùmíng fēnpī zhuāngyùn tiáokuǎn hé měi pī de jiāohuòqī.
    "Được, nhưng hợp đồng cần ghi rõ điều khoản giao nhiều đợt và thời hạn từng đợt."
甲: 没问题，我们也希望合同注明百分之五的溢短装。
    Méi wèntí, wǒmen yě xīwàng hétong zhùmíng bǎi fēn zhī wǔ de yì duǎn zhuāng.
    "Không vấn đề, chúng tôi cũng mong hợp đồng ghi rõ dung sai 5%."
</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> Mọi nhượng bộ về số lượng (分批装运, 溢短装) phải được ghi vào 合同条款 — thoả thuận miệng về con số không có giá trị bảo vệ khi phát sinh tranh chấp sau này.</div>`,
  ]]);

const c3q = quiz('cin401-quiz-3', 'Quiz 3 — Terms & quantity|||Quiz 3 — Điều khoản & số lượng', [
  { id: 'q1', question: '"起订量" (qǐdìngliàng) nghĩa là gì?', options: ['Số lượng tồn kho', 'Số lượng đặt hàng tối thiểu', 'Số lượng đã giao', 'Số lượng bị lỗi'], correctIndex: 1, explanation: '起订量 = MOQ, số lượng nhỏ nhất mà bên bán chấp nhận cho một đơn hàng.' },
  { id: 'q2', question: '"溢短装" trong hợp đồng ngoại thương dùng để?', options: ['Quy định phí vận chuyển', 'Cho phép dung sai chênh lệch số lượng giao (thừa/thiếu)', 'Quy định cách đóng gói', 'Quy định thời hạn bảo hành'], correctIndex: 1, explanation: '溢短装 (yì duǎn zhuāng) = điều khoản cho phép giao thừa hoặc thiếu một tỉ lệ % số lượng so với hợp đồng.' },
  { id: 'q3', question: 'Theo bài học, vì sao mọi nhượng bộ số lượng phải ghi vào 合同条款?', options: ['Vì luật yêu cầu ghi bằng tiếng Anh', 'Vì thoả thuận miệng không có giá trị bảo vệ khi tranh chấp', 'Vì hợp đồng cần dài hơn', 'Vì ngân hàng yêu cầu vậy'], correctIndex: 1, explanation: 'Thoả thuận miệng về số lượng/tiến độ không có căn cứ pháp lý — phải đưa vào điều khoản hợp đồng.' },
]);

const c4 = doc('cin401-4-1-quality-packaging-delivery', '4.1 — Quality, packaging & delivery negotiation (质量, 包装与交货)|||4.1 — Đàm phán chất lượng, đóng gói & giao hàng (质量, 包装与交货)',
  'Từ vựng chất lượng/đóng gói/giao hàng: 质量标准/验货/包装方式/集装箱/装运港; hội thoại thống nhất tiêu chuẩn và phương thức giao hàng.',
  [[
    `<span class="eyebrow">CIN401 · Chapter 4 · Lesson 4.1</span>
<h2>Quality, packaging &amp; delivery — 质量, 包装与交货</h2>
<h3>Vocabulary</h3>
<pre><code>质量标准 zhìliàng biāozhǔn   quality standard
品质保证 pǐnzhí bǎozhèng     quality guarantee
验货     yànhuò              inspection of goods
包装方式 bāozhuāng fāngshì   packaging method
纸箱     zhǐxiāng            carton
木箱     mùxiāng             wooden crate
集装箱   jízhuāngxiāng       container
海运     hǎiyùn              sea freight
空运     kōngyùn             air freight
装运港   zhuāngyùngǎng       port of shipment
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>产品质量必须符合国际标准</strong> "The product quality must meet international standards" — set the quality baseline before packaging talk.</li>
<li><strong>包装方式是纸箱还是木箱？</strong> "Is the packaging carton or wooden crate?" — a concrete question to pin down a spec, not a vague "good packaging."</li>
<li><strong>我们希望在装运前安排验货</strong> "We hope to arrange inspection before shipment" — the buyer&rsquo;s standard protection clause.</li>
</ul>
<h3>Dialogue — settling packaging &amp; shipment method</h3>
<pre><code>甲 (Buyer): 产品质量必须符合国际标准，而且我们希望装运前验货。
    Chǎnpǐn zhìliàng bìxū fúhé guójì biāozhǔn, érqiě wǒmen xīwàng zhuāngyùn qián yànhuò.
    "The product quality must meet international standards, and we want inspection before shipment."
乙 (Seller): 没问题，我们可以安排第三方验货机构。请问包装方式您有什么要求？
    Méi wèntí, wǒmen kěyǐ ānpái dìsānfāng yànhuò jīgòu. Qǐngwèn bāozhuāng fāngshì nín yǒu shénme yāoqiú?
    "No problem, we can arrange a third-party inspection agency. What are your packaging requirements?"
甲: 用纸箱就可以，但里面要有防潮材料。
    Yòng zhǐxiāng jiù kěyǐ, dàn lǐmiàn yào yǒu fángcháo cáiliào.
    "Cartons are fine, but there needs to be moisture-proof material inside."
乙: 好的，我们会用集装箱海运，装运港是上海港，大概二十天到货。
    Hǎo de, wǒmen huì yòng jízhuāngxiāng hǎiyùn, zhuāngyùngǎng shì Shànghǎi gǎng, dàgài èrshí tiān dàohuò.
    "Alright, we will ship by sea container, port of shipment is Shanghai, about 20 days to arrival."
</code></pre>
<div class="callout"><span class="badge">Tip</span> Always turn "good quality" or "fast delivery" into a concrete, checkable spec — 质量标准, 验货, 装运港 and a date — vague adjectives cause disputes later, precise clauses do not.</div>`,
    `<span class="eyebrow">CIN401 · Chương 4 · Bài 4.1</span>
<h2>Chất lượng, đóng gói &amp; giao hàng — 质量, 包装与交货</h2>
<h3>Từ vựng</h3>
<pre><code>质量标准 zhìliàng biāozhǔn   tiêu chuẩn chất lượng
品质保证 pǐnzhí bǎozhèng     bảo đảm chất lượng
验货     yànhuò              kiểm hàng
包装方式 bāozhuāng fāngshì   phương thức đóng gói
纸箱     zhǐxiāng            thùng carton
木箱     mùxiāng             thùng gỗ
集装箱   jízhuāngxiāng       container
海运     hǎiyùn              vận tải đường biển
空运     kōngyùn             vận tải đường hàng không
装运港   zhuāngyùngǎng       cảng bốc hàng
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>产品质量必须符合国际标准</strong> "Chất lượng sản phẩm phải đạt tiêu chuẩn quốc tế" — đặt chuẩn chất lượng trước khi bàn tới đóng gói.</li>
<li><strong>包装方式是纸箱还是木箱？</strong> "Đóng gói bằng thùng carton hay thùng gỗ?" — câu hỏi cụ thể để chốt quy cách, không nói chung chung "đóng gói tốt".</li>
<li><strong>我们希望在装运前安排验货</strong> "Chúng tôi mong được sắp xếp kiểm hàng trước khi giao" — điều khoản bảo vệ tiêu chuẩn của bên mua.</li>
</ul>
<h3>Hội thoại — thống nhất đóng gói &amp; phương thức giao hàng</h3>
<pre><code>甲 (Bên mua): 产品质量必须符合国际标准，而且我们希望装运前验货。
    Chǎnpǐn zhìliàng bìxū fúhé guójì biāozhǔn, érqiě wǒmen xīwàng zhuāngyùn qián yànhuò.
    "Chất lượng sản phẩm phải đạt tiêu chuẩn quốc tế, và chúng tôi mong được kiểm hàng trước khi giao."
乙 (Bên bán): 没问题，我们可以安排第三方验货机构。请问包装方式您有什么要求？
    Méi wèntí, wǒmen kěyǐ ānpái dìsānfāng yànhuò jīgòu. Qǐngwèn bāozhuāng fāngshì nín yǒu shénme yāoqiú?
    "Không vấn đề, chúng tôi có thể mời đơn vị kiểm hàng độc lập. Anh/chị có yêu cầu gì về đóng gói?"
甲: 用纸箱就可以，但里面要有防潮材料。
    Yòng zhǐxiāng jiù kěyǐ, dàn lǐmiàn yào yǒu fángcháo cáiliào.
    "Dùng thùng carton là được, nhưng bên trong cần có vật liệu chống ẩm."
乙: 好的，我们会用集装箱海运，装运港是上海港，大概二十天到货。
    Hǎo de, wǒmen huì yòng jízhuāngxiāng hǎiyùn, zhuāngyùngǎng shì Shànghǎi gǎng, dàgài èrshí tiān dàohuò.
    "Vâng, chúng tôi sẽ giao bằng container đường biển, cảng bốc hàng là Thượng Hải, khoảng 20 ngày sẽ đến."
</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> Luôn cụ thể hoá "chất lượng tốt" hay "giao nhanh" thành tiêu chuẩn kiểm chứng được — 质量标准, 验货, 装运港 và ngày cụ thể — tính từ mơ hồ gây tranh chấp sau này, điều khoản chính xác thì không.</div>`,
  ]]);

const c4q = quiz('cin401-quiz-4', 'Quiz 4 — Quality, packaging & delivery|||Quiz 4 — Chất lượng, đóng gói & giao hàng', [
  { id: 'q1', question: '"验货" (yànhuò) trong đàm phán ngoại thương nghĩa là?', options: ['Ký hợp đồng', 'Kiểm tra hàng hoá trước khi giao', 'Thanh toán tiền hàng', 'Vận chuyển hàng bằng máy bay'], correctIndex: 1, explanation: '验货 = kiểm hàng, thường được bên mua yêu cầu thực hiện trước khi giao/xếp hàng lên tàu.' },
  { id: 'q2', question: '"装运港" (zhuāngyùngǎng) nghĩa là gì?', options: ['Cảng đến', 'Cảng bốc hàng đi (cảng xuất phát)', 'Kho hàng nội địa', 'Trạm hải quan'], correctIndex: 1, explanation: '装运港 = cảng nơi hàng được xếp lên tàu để bắt đầu vận chuyển, khác với cảng đến (目的港).' },
  { id: 'q3', question: 'Theo bài học, vì sao nên chốt "包装方式" bằng câu hỏi cụ thể (纸箱 hay 木箱) thay vì nói "đóng gói tốt"?', options: ['Vì thùng gỗ luôn rẻ hơn', 'Vì yêu cầu chung chung dễ gây tranh chấp, cần quy cách kiểm chứng được', 'Vì hải quan chỉ chấp nhận thùng gỗ', 'Vì đó là quy định bắt buộc của FLM'], correctIndex: 1, explanation: 'Tính từ mơ hồ ("tốt", "nhanh") không kiểm chứng được — cần chốt quy cách cụ thể để tránh tranh chấp sau giao hàng.' },
]);

const c5 = doc('cin401-5-1-payment-insurance', '5.1 — Payment & insurance negotiation (付款与保险)|||5.1 — Đàm phán thanh toán & bảo hiểm (付款与保险)',
  'Từ vựng thanh toán/bảo hiểm: 信用证/电汇/预付定金/保险/到岸价/离岸价; hội thoại thống nhất phương thức thanh toán và bảo hiểm hàng hoá.',
  [[
    `<span class="eyebrow">CIN401 · Chapter 5 · Lesson 5.1</span>
<h2>Payment &amp; insurance — 付款与保险 (fùkuǎn yǔ bǎoxiǎn)</h2>
<h3>Vocabulary</h3>
<pre><code>付款方式 fùkuǎn fāngshì   payment method
信用证   xìnyòngzhèng     letter of credit (L/C)
电汇     diànhuì          telegraphic transfer (T/T)
预付定金 yùfù dìngjīn     advance deposit
余款     yúkuǎn           balance payment
提单     tídān            bill of lading
保险     bǎoxiǎn          insurance
投保     tóubǎo           to take out insurance
到岸价   dàoànjià         CIF (cost, insurance, freight)
离岸价   líànjià          FOB (free on board)
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>我们希望采用信用证付款</strong> "We hope to use L/C payment" — the safer method for a first-time buyer/seller relationship.</li>
<li><strong>可以先付百分之三十定金吗？</strong> "Can we pay a 30% deposit first?" — the common split for T/T payment.</li>
<li><strong>这批货物是按到岸价还是离岸价计算？</strong> "Is this batch priced CIF or FOB?" — clarifies who pays freight and insurance.</li>
</ul>
<h3>Dialogue — agreeing on payment terms</h3>
<pre><code>甲 (Buyer): 关于付款方式，我们希望采用电汇，先付百分之三十定金。
    Guānyú fùkuǎn fāngshì, wǒmen xīwàng cǎiyòng diànhuì, xiān fù bǎi fēn zhī sānshí dìngjīn.
    "Regarding payment, we hope to use T/T, paying 30% deposit first."
乙 (Seller): 可以，余款在提单复印件出来后付清，这样双方都有保障。
    Kěyǐ, yúkuǎn zài tídān fùyìnjiàn chūlái hòu fùqīng, zhèyàng shuāngfāng dōu yǒu bǎozhàng.
    "That works, the balance is settled after the B/L copy is issued, so both sides are protected."
甲: 好的。另外，这批货物需要投保吗？
    Hǎo de. Lìngwài, zhè pī huòwù xūyào tóubǎo ma?
    "Alright. Also, does this batch need insurance?"
乙: 我们按到岸价（CIF）报价，保险由我们负责投保，费用已经包含在价格里。
    Wǒmen àn dàoànjià (CIF) bàojià, bǎoxiǎn yóu wǒmen fùzé tóubǎo, fèiyòng yǐjīng bāohán zài jiàgé lǐ.
    "We quote CIF, insurance is our responsibility, the cost is already included in the price."
</code></pre>
<div class="callout"><span class="badge">Tip</span> 到岸价 (CIF) vs 离岸价 (FOB) decides who pays freight and insurance — always confirm which one a quotation uses before comparing prices between suppliers.</div>`,
    `<span class="eyebrow">CIN401 · Chương 5 · Bài 5.1</span>
<h2>Thanh toán &amp; bảo hiểm — 付款与保险 (fùkuǎn yǔ bǎoxiǎn)</h2>
<h3>Từ vựng</h3>
<pre><code>付款方式 fùkuǎn fāngshì   phương thức thanh toán
信用证   xìnyòngzhèng     thư tín dụng (L/C)
电汇     diànhuì          chuyển khoản điện tử (T/T)
预付定金 yùfù dìngjīn     tiền đặt cọc trả trước
余款     yúkuǎn           số tiền còn lại
提单     tídān            vận đơn (B/L)
保险     bǎoxiǎn          bảo hiểm
投保     tóubǎo           mua bảo hiểm
到岸价   dàoànjià         giá CIF (gồm bảo hiểm & cước)
离岸价   líànjià          giá FOB (giao lên tàu)
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>我们希望采用信用证付款</strong> "Chúng tôi mong dùng L/C để thanh toán" — phương thức an toàn hơn khi hai bên mới hợp tác lần đầu.</li>
<li><strong>可以先付百分之三十定金吗？</strong> "Có thể trả trước 30% tiền cọc không?" — tỉ lệ phổ biến khi thanh toán bằng T/T.</li>
<li><strong>这批货物是按到岸价还是离岸价计算？</strong> "Lô hàng này tính theo giá CIF hay FOB?" — làm rõ ai chịu chi phí vận chuyển và bảo hiểm.</li>
</ul>
<h3>Hội thoại — thống nhất điều kiện thanh toán</h3>
<pre><code>甲 (Bên mua): 关于付款方式，我们希望采用电汇，先付百分之三十定金。
    Guānyú fùkuǎn fāngshì, wǒmen xīwàng cǎiyòng diànhuì, xiān fù bǎi fēn zhī sānshí dìngjīn.
    "Về phương thức thanh toán, chúng tôi mong dùng T/T, trả trước 30% tiền cọc."
乙 (Bên bán): 可以，余款在提单复印件出来后付清，这样双方都有保障。
    Kěyǐ, yúkuǎn zài tídān fùyìnjiàn chūlái hòu fùqīng, zhèyàng shuāngfāng dōu yǒu bǎozhàng.
    "Được, số tiền còn lại thanh toán sau khi có bản copy vận đơn, như vậy cả hai bên đều an toàn."
甲: 好的。另外，这批货物需要投保吗？
    Hǎo de. Lìngwài, zhè pī huòwù xūyào tóubǎo ma?
    "Vâng. Ngoài ra, lô hàng này có cần mua bảo hiểm không?"
乙: 我们按到岸价（CIF）报价，保险由我们负责投保，费用已经包含在价格里。
    Wǒmen àn dàoànjià (CIF) bàojià, bǎoxiǎn yóu wǒmen fùzé tóubǎo, fèiyòng yǐjīng bāohán zài jiàgé lǐ.
    "Chúng tôi báo giá theo CIF, bảo hiểm do chúng tôi chịu trách nhiệm mua, chi phí đã tính vào giá."
</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> 到岸价 (CIF) khác 离岸价 (FOB) ở chỗ ai chịu chi phí vận chuyển và bảo hiểm — luôn xác nhận rõ báo giá theo điều kiện nào trước khi so sánh giá giữa các nhà cung cấp.</div>`,
  ]]);

const c5q = quiz('cin401-quiz-5', 'Quiz 5 — Payment & insurance|||Quiz 5 — Thanh toán & bảo hiểm', [
  { id: 'q1', question: '"信用证" (xìnyòngzhèng) là phương thức thanh toán nào?', options: ['Tiền mặt trực tiếp', 'Thư tín dụng (L/C)', 'Đổi hàng lấy hàng', 'Trả góp hàng tháng'], correctIndex: 1, explanation: '信用证 = Letter of Credit (L/C), ngân hàng cam kết thanh toán thay người mua khi đủ điều kiện chứng từ.' },
  { id: 'q2', question: 'Sự khác biệt chính giữa 到岸价 (CIF) và 离岸价 (FOB) là gì?', options: ['CIF không bao gồm giá hàng, FOB có', 'CIF gồm cước vận chuyển & bảo hiểm, FOB chỉ tính đến khi hàng lên tàu', 'FOB chỉ dùng cho vận tải hàng không', 'Không có khác biệt, chỉ là hai tên gọi khác nhau'], correctIndex: 1, explanation: 'CIF (到岸价) người bán chịu cước + bảo hiểm tới cảng đến; FOB (离岸价) người bán chỉ chịu trách nhiệm tới khi hàng lên tàu.' },
  { id: 'q3', question: '"预付定金" trong hội thoại nghĩa là gì?', options: ['Toàn bộ tiền hàng trả sau khi nhận hàng', 'Khoản tiền đặt cọc trả trước một phần giá trị đơn hàng', 'Phí bảo hiểm hàng hoá', 'Tiền phạt do giao hàng trễ'], correctIndex: 1, explanation: '预付定金 (yùfù dìngjīn) = tiền cọc trả trước, thường 20-30% giá trị đơn hàng, phần còn lại (余款) trả sau.' },
]);

const c6 = doc('cin401-6-1-disagreement-concession', '6.1 — Handling disagreement, concessions & persuasion (分歧, 让步与说服)|||6.1 — Xử lý bất đồng, nhượng bộ & thuyết phục (分歧, 让步与说服)',
  'Từ vựng xử lý bất đồng: 分歧/僵局/让步/妥协/说服/底线/双赢; hội thoại thuyết phục đối tác nhượng bộ về thời hạn giao hàng.',
  [[
    `<span class="eyebrow">CIN401 · Chapter 6 · Lesson 6.1</span>
<h2>Handling disagreement &amp; persuasion — 分歧, 让步与说服</h2>
<h3>Vocabulary</h3>
<pre><code>分歧     fēnqí          disagreement
僵局     jiāngjú        deadlock, stalemate
让步     ràngbù         concession
妥协     tuǒxié         compromise
说服     shuōfú         to persuade
底线     dǐxiàn         bottom line
立场     lìchǎng        position, stance
灵活     línghuó        flexible
双赢     shuāngyíng     win-win
打破僵局 dǎpò jiāngjú   to break a deadlock
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>我们在这一点上意见不一致</strong> "We disagree on this point" — name the disagreement plainly instead of letting it stay vague.</li>
<li><strong>为了达成合作，双方都需要做出一些让步</strong> "To reach cooperation, both sides need to make some concessions" — frame the concession as mutual, not one-sided.</li>
<li><strong>如果双方都能灵活一点，就能打破僵局</strong> "If both sides can be a bit more flexible, we can break the deadlock" — a persuasive line to restart a stalled talk.</li>
</ul>
<h3>Dialogue — breaking a deadlock over the delivery date</h3>
<pre><code>甲 (Buyer): 三十天的交货期太长了，我们在这一点上意见不一致。
    Sānshí tiān de jiāohuòqī tài cháng le, wǒmen zài zhè yì diǎn shàng yìjiàn bù yízhì.
    "30 days delivery is too long, we disagree on this point."
乙 (Seller): 我理解您的立场，但生产周期确实需要这么长时间。
    Wǒ lǐjiě nín de lìchǎng, dàn shēngchǎn zhōuqī quèshí xūyào zhème cháng shíjiān.
    "I understand your position, but the production cycle really needs that long."
甲: 如果我们同意先付百分之五十定金，能不能把交货期缩短到二十天？
    Rúguǒ wǒmen tóngyì xiān fù bǎi fēn zhī wǔshí dìngjīn, néng bu néng bǎ jiāohuòqī suōduǎn dào èrshí tiān?
    "If we agree to pay 50% deposit first, can the delivery time be shortened to 20 days?"
乙: 这是个不错的建议，为了达成合作，我们可以做出这个让步，安排加急生产。
    Zhè shì gè búcuò de jiànyì, wèile dáchéng hézuò, wǒmen kěyǐ zuòchū zhège ràngbù, ānpái jiājí shēngchǎn.
    "That is a good suggestion, to reach cooperation we can make this concession and arrange expedited production."
甲: 太好了，希望这次合作能达成双赢。
    Tài hǎo le, xīwàng zhè cì hézuò néng dáchéng shuāngyíng.
    "Great, I hope this cooperation reaches a win-win."
</code></pre>
<div class="callout"><span class="badge">Tactic</span> A concession works best when it is exchanged, not given away — 如果……就…… (if you …, then we can …) turns a demand into a trade, which is much easier for the other side to accept.</div>`,
    `<span class="eyebrow">CIN401 · Chương 6 · Bài 6.1</span>
<h2>Xử lý bất đồng &amp; thuyết phục — 分歧, 让步与说服</h2>
<h3>Từ vựng</h3>
<pre><code>分歧     fēnqí          bất đồng
僵局     jiāngjú        bế tắc, đình trệ
让步     ràngbù         nhượng bộ
妥协     tuǒxié         thoả hiệp
说服     shuōfú         thuyết phục
底线     dǐxiàn         giới hạn cuối cùng
立场     lìchǎng        lập trường, quan điểm
灵活     línghuó        linh hoạt
双赢     shuāngyíng     cùng thắng
打破僵局 dǎpò jiāngjú   phá vỡ bế tắc
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>我们在这一点上意见不一致</strong> "Chúng tôi bất đồng quan điểm ở điểm này" — nêu rõ bất đồng thay vì để nó mập mờ.</li>
<li><strong>为了达成合作，双方都需要做出一些让步</strong> "Để đạt được hợp tác, cả hai bên đều cần nhượng bộ đôi chút" — trình bày nhượng bộ là của cả hai bên, không phải một chiều.</li>
<li><strong>如果双方都能灵活一点，就能打破僵局</strong> "Nếu cả hai bên linh hoạt hơn một chút, có thể phá vỡ bế tắc" — câu thuyết phục để nối lại đàm phán đang chững.</li>
</ul>
<h3>Hội thoại — phá vỡ bế tắc về thời hạn giao hàng</h3>
<pre><code>甲 (Bên mua): 三十天的交货期太长了，我们在这一点上意见不一致。
    Sānshí tiān de jiāohuòqī tài cháng le, wǒmen zài zhè yì diǎn shàng yìjiàn bù yízhì.
    "Thời hạn giao hàng 30 ngày quá dài, chúng tôi bất đồng ở điểm này."
乙 (Bên bán): 我理解您的立场，但生产周期确实需要这么长时间。
    Wǒ lǐjiě nín de lìchǎng, dàn shēngchǎn zhōuqī quèshí xūyào zhème cháng shíjiān.
    "Tôi hiểu quan điểm của anh/chị, nhưng chu kỳ sản xuất thực sự cần nhiều thời gian như vậy."
甲: 如果我们同意先付百分之五十定金，能不能把交货期缩短到二十天？
    Rúguǒ wǒmen tóngyì xiān fù bǎi fēn zhī wǔshí dìngjīn, néng bu néng bǎ jiāohuòqī suōduǎn dào èrshí tiān?
    "Nếu chúng tôi đồng ý trả trước 50% tiền cọc, có thể rút ngắn giao hàng xuống 20 ngày không?"
乙: 这是个不错的建议，为了达成合作，我们可以做出这个让步，安排加急生产。
    Zhè shì gè búcuò de jiànyì, wèile dáchéng hézuò, wǒmen kěyǐ zuòchū zhège ràngbù, ānpái jiājí shēngchǎn.
    "Đây là đề xuất hay, để đạt được hợp tác, chúng tôi có thể nhượng bộ và sắp xếp sản xuất gấp."
甲: 太好了，希望这次合作能达成双赢。
    Tài hǎo le, xīwàng zhè cì hézuò néng dáchéng shuāngyíng.
    "Tuyệt vời, mong hợp tác lần này đạt được kết quả cùng thắng."
</code></pre>
<div class="callout"><span class="badge">Chiến thuật</span> Nhượng bộ hiệu quả nhất khi được TRAO ĐỔI chứ không cho không — 如果……就…… (nếu … thì …) biến một yêu cầu thành một cuộc trao đổi, dễ được đối tác chấp nhận hơn nhiều.</div>`,
  ]]);

const c6q = quiz('cin401-quiz-6', 'Quiz 6 — Disagreement & concession|||Quiz 6 — Bất đồng & nhượng bộ', [
  { id: 'q1', question: '"僵局" (jiāngjú) trong đàm phán nghĩa là gì?', options: ['Đã ký hợp đồng thành công', 'Tình trạng bế tắc, không bên nào nhượng bộ', 'Mức giá thấp nhất', 'Buổi gặp mặt đầu tiên'], correctIndex: 1, explanation: '僵局 = tình trạng đàm phán bị đình trệ, hai bên giữ nguyên lập trường không tiến triển.' },
  { id: 'q2', question: 'Theo chiến thuật của bài học, cách trình bày nhượng bộ hiệu quả nhất là?', options: ['Nhượng bộ vô điều kiện ngay khi được yêu cầu', 'Dùng cấu trúc "nếu … thì …" để biến nhượng bộ thành trao đổi hai chiều', 'Từ chối mọi nhượng bộ để giữ thế mạnh', 'Im lặng không phản hồi'], correctIndex: 1, explanation: 'Cấu trúc 如果……就…… biến yêu cầu thành trao đổi có qua có lại, dễ được chấp nhận hơn nhượng bộ một chiều hoặc từ chối cứng.' },
  { id: 'q3', question: '"双赢" (shuāngyíng) là kết quả đàm phán như thế nào?', options: ['Một bên thắng, một bên thua rõ rệt', 'Cả hai bên cùng có lợi', 'Đàm phán thất bại, không ai đạt được gì', 'Chỉ có lợi cho bên mua'], correctIndex: 1, explanation: '双赢 = win-win, kết quả đàm phán mà cả bên mua và bên bán đều đạt được lợi ích, cách khép lại đàm phán được ưa dùng.' },
]);

const c7 = doc('cin401-7-1-closing-contract', '7.1 — Closing the deal & signing the contract (达成协议与签订合同)|||7.1 — Chốt thoả thuận & ký hợp đồng (达成协议与签订合同)',
  'Từ vựng chốt hợp đồng: 达成协议/签订合同/一式两份/盖章/生效/合作愉快; hội thoại tổng kết điều khoản và ký kết hợp đồng.',
  [[
    `<span class="eyebrow">CIN401 · Chapter 7 · Lesson 7.1</span>
<h2>Closing &amp; signing — 达成协议与签订合同</h2>
<h3>Vocabulary</h3>
<pre><code>达成协议 dáchéng xiéyì   to reach an agreement
签订合同 qiāndìng hétong to sign a contract
一式两份 yīshì liǎngfèn  in duplicate (two identical copies)
盖章     gàizhāng        to stamp, to seal
生效     shēngxiào       to take effect
正本     zhèngběn        original (copy)
副本     fùběn           duplicate (copy)
履行     lǚxíng          to perform, to fulfil (a contract)
合作愉快 hézuò yúkuài     "pleasant cooperation" (closing courtesy)
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>我们双方已经在主要条款上达成了一致</strong> "Both parties have reached agreement on the main terms" — signal that negotiation is over and closing can begin.</li>
<li><strong>合同一式两份，双方各执一份</strong> "The contract is in duplicate, each party holds one copy" — the standard closing clause of a Chinese contract.</li>
<li><strong>希望我们合作愉快，后会有期</strong> "I hope our cooperation is pleasant, until we meet again" — the customary closing courtesy after signing.</li>
</ul>
<h3>Dialogue — finalizing &amp; signing</h3>
<pre><code>甲 (Buyer): 价格、数量、交货期和付款方式，我们双方已经达成了一致。
    Jiàgé, shùliàng, jiāohuòqī hé fùkuǎn fāngshì, wǒmen shuāngfāng yǐjīng dáchéng le yízhì.
    "Price, quantity, delivery, and payment — both sides have reached agreement."
乙 (Seller): 太好了，那我们现在就可以签订合同了。合同一式两份，请您过目后盖章。
    Tài hǎo le, nà wǒmen xiànzài jiù kěyǐ qiāndìng hétong le. Hétong yīshì liǎngfèn, qǐng nín guòmù hòu gàizhāng.
    "Great, then we can sign the contract now. It is in duplicate, please review and stamp it."
甲: 好的，双方盖章后，合同从今天开始生效，对吗？
    Hǎo de, shuāngfāng gàizhāng hòu, hétong cóng jīntiān kāishǐ shēngxiào, duì ma?
    "Alright, once both sides stamp it, the contract takes effect from today, right?"
乙: 没错。感谢您的信任，希望我们合作愉快，后会有期！
    Méi cuò. Gǎnxiè nín de xìnrèn, xīwàng wǒmen hézuò yúkuài, hòuhuìyǒuqī!
    "Correct. Thank you for your trust, I hope our cooperation is pleasant, until next time!"
</code></pre>
<div class="callout"><span class="badge">Tip</span> Before signing, always read the clause aloud back to the other side — 我们双方已经达成了一致 confirms every term one last time; a rushed signature is the most expensive mistake in a negotiation.</div>`,
    `<span class="eyebrow">CIN401 · Chương 7 · Bài 7.1</span>
<h2>Chốt thoả thuận &amp; ký kết — 达成协议与签订合同</h2>
<h3>Từ vựng</h3>
<pre><code>达成协议 dáchéng xiéyì   đạt được thoả thuận
签订合同 qiāndìng hétong ký kết hợp đồng
一式两份 yīshì liǎngfèn  làm thành hai bản giống nhau
盖章     gàizhāng        đóng dấu
生效     shēngxiào       có hiệu lực
正本     zhèngběn        bản chính
副本     fùběn           bản sao
履行     lǚxíng          thực hiện, thi hành (hợp đồng)
合作愉快 hézuò yúkuài     "hợp tác vui vẻ" (câu chào kết thúc)
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>我们双方已经在主要条款上达成了一致</strong> "Hai bên chúng ta đã đạt được sự thống nhất về các điều khoản chính" — báo hiệu đàm phán kết thúc, chuyển sang chốt hợp đồng.</li>
<li><strong>合同一式两份，双方各执一份</strong> "Hợp đồng làm thành hai bản, mỗi bên giữ một bản" — điều khoản chốt chuẩn của hợp đồng tiếng Trung.</li>
<li><strong>希望我们合作愉快，后会有期</strong> "Mong hợp tác của chúng ta vui vẻ, hẹn gặp lại" — câu xã giao kết thúc sau khi ký.</li>
</ul>
<h3>Hội thoại — tổng kết &amp; ký hợp đồng</h3>
<pre><code>甲 (Bên mua): 价格、数量、交货期和付款方式，我们双方已经达成了一致。
    Jiàgé, shùliàng, jiāohuòqī hé fùkuǎn fāngshì, wǒmen shuāngfāng yǐjīng dáchéng le yízhì.
    "Về giá, số lượng, thời hạn giao hàng và phương thức thanh toán, hai bên đã thống nhất."
乙 (Bên bán): 太好了，那我们现在就可以签订合同了。合同一式两份，请您过目后盖章。
    Tài hǎo le, nà wǒmen xiànzài jiù kěyǐ qiāndìng hétong le. Hétong yīshì liǎngfèn, qǐng nín guòmù hòu gàizhāng.
    "Tuyệt, vậy giờ chúng ta có thể ký hợp đồng. Hợp đồng làm hai bản, mời anh/chị xem rồi đóng dấu."
甲: 好的，双方盖章后，合同从今天开始生效，对吗？
    Hǎo de, shuāngfāng gàizhāng hòu, hétong cóng jīntiān kāishǐ shēngxiào, duì ma?
    "Vâng, sau khi hai bên đóng dấu, hợp đồng có hiệu lực từ hôm nay, đúng không?"
乙: 没错。感谢您的信任，希望我们合作愉快，后会有期！
    Méi cuò. Gǎnxiè nín de xìnrèn, xīwàng wǒmen hézuò yúkuài, hòuhuìyǒuqī!
    "Đúng vậy. Cảm ơn sự tin tưởng của anh/chị, mong hợp tác vui vẻ, hẹn gặp lại!"
</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> Trước khi ký, luôn đọc lại điều khoản cho đối tác nghe — 我们双方已经达成了一致 xác nhận lần cuối mọi điều khoản; ký vội là sai lầm đắt giá nhất trong đàm phán.</div>`,
  ]]);

const c7q = quiz('cin401-quiz-7', 'Quiz 7 — Closing & signing|||Quiz 7 — Chốt thoả thuận & ký kết', [
  { id: 'q1', question: '"一式两份" nghĩa là gì trong hợp đồng?', options: ['Hợp đồng chỉ có một bản duy nhất', 'Hợp đồng làm thành hai bản giống nhau, mỗi bên giữ một bản', 'Hợp đồng có hiệu lực trong hai năm', 'Hợp đồng cần công chứng hai lần'], correctIndex: 1, explanation: '一式两份 (yīshì liǎngfèn) = làm thành hai bản nội dung giống hệt nhau, mỗi bên giữ một bản làm bằng chứng.' },
  { id: 'q2', question: 'Hợp đồng "生效" (shēngxiào) khi nào theo hội thoại?', options: ['Ngay khi bắt đầu đàm phán', 'Sau khi cả hai bên ký và đóng dấu (盖章)', 'Sau khi hàng đã giao xong', 'Sau khi thanh toán hết tiền'], correctIndex: 1, explanation: '生效 = có hiệu lực; hợp đồng thường có hiệu lực ngay sau khi cả hai bên盖章 (đóng dấu) và ký tên.' },
  { id: 'q3', question: 'Vì sao bài học khuyên đọc lại điều khoản trước khi ký thay vì ký ngay?', options: ['Vì thủ tục hải quan yêu cầu', 'Vì xác nhận lần cuối mọi điều khoản, tránh sai sót đắt giá', 'Vì ngân hàng không chấp nhận ký nhanh', 'Vì hợp đồng cần dịch sang tiếng Anh trước'], correctIndex: 1, explanation: 'Đọc lại và xác nhận (我们双方已经达成了一致) giúp phát hiện sai sót trước khi ký — ký vội là lỗi tốn kém nhất trong đàm phán.' },
]);

const c8 = doc('cin401-8-1-full-simulation', '8.1 — Review: full negotiation simulation & tactics (综合谈判模拟与谈判技巧)|||8.1 — Ôn tập: mô phỏng đàm phán hoàn chỉnh & chiến thuật giao tiếp (综合谈判模拟与谈判技巧)',
  'Ôn tập toàn bộ trình tự đàm phán (mở đầu→mặc cả→điều khoản→chất lượng→thanh toán→xử lý bất đồng→ký hợp đồng) và 5 chiến thuật đàm phán thường gặp.',
  [[
    `<span class="eyebrow">CIN401 · Chapter 8 · Lesson 8.1</span>
<h2>Full negotiation simulation &amp; tactics</h2>
<h3>The full sequence — one negotiation, start to finish</h3>
<pre><code>1. 开场白 + 初步报价      opening remarks + preliminary quote        (Ch.1)
2. 讨价还价 + 打折         bargaining + discount                      (Ch.2)
3. 起订量 + 交货期条款     MOQ + delivery clause                      (Ch.3)
4. 质量标准 + 包装 + 验货   quality standard + packaging + inspection  (Ch.4)
5. 付款方式 + 投保         payment method + insurance                 (Ch.5)
6. 分歧 -> 让步 -> 打破僵局 disagreement -> concession -> deadlock broken (Ch.6)
7. 达成协议 -> 签订合同     agreement reached -> contract signed        (Ch.7)
</code></pre>
<h3>Five common negotiation tactics (谈判技巧)</h3>
<ul>
<li><strong>红脸白脸 (hóngliǎn báiliǎn)</strong> — "red face, white face" (good cop / bad cop): one negotiator is tough, the other conciliatory, to pressure a concession.</li>
<li><strong>以退为进 (yǐ tuì wéi jìn)</strong> — "retreat to advance": concede a small point deliberately to gain leverage on a bigger one later.</li>
<li><strong>沉默是金 (chénmò shì jīn)</strong> — "silence is golden": stay quiet after stating a position; the other side often fills the silence with a concession.</li>
<li><strong>抛砖引玉 (pāo zhuān yǐn yù)</strong> — "toss a brick to attract jade": offer a modest proposal first to draw out the other side&rsquo;s real position.</li>
<li><strong>声东击西 (shēng dōng jī xī)</strong> — "feint east, attack west": push hard on a minor clause to distract from the term that actually matters.</li>
</ul>
<h3>Simulation scenario (combine every chapter)</h3>
<pre><code>Bối cảnh: nhà nhập khẩu Việt Nam đàm phán mua 5000 tai nghe với nhà máy Trung Quốc.
1) 开场白: 久仰大名 -> 询盘 -> 初步报价单
2) 讨价还价: "太贵了" -> gắn số lượng 五千件 -> 打九折
3) 数量与条款: 起订量、分批装运 (2 đợt)、溢短装 5%
4) 质量与包装: 验货 trước khi giao, đóng carton chống ẩm, 集装箱海运
5) 付款与保险: T/T 30% cọc + 70% khi có提单, CIF nên bên bán投保
6) 分歧: giao hàng 30 ngày quá lâu -> đề nghị 50% cọc đổi 20 ngày (以退为进)
7) 达成协议: 一式两份, 盖章, 生效, 合作愉快
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> Every tactic above is a communication pattern, not a trick with a fixed script — recognize which one the other side is using (e.g. long silence after your offer = 沉默是金) so you are not pressured into an unplanned concession.</div>`,
    `<span class="eyebrow">CIN401 · Chương 8 · Bài 8.1</span>
<h2>Mô phỏng đàm phán hoàn chỉnh &amp; chiến thuật</h2>
<h3>Trình tự đầy đủ — một cuộc đàm phán từ đầu đến cuối</h3>
<pre><code>1. 开场白 + 初步报价      lời mở đầu + báo giá sơ bộ                (Ch.1)
2. 讨价还价 + 打折         mặc cả + chiết khấu                       (Ch.2)
3. 起订量 + 交货期条款     MOQ + điều khoản giao hàng                (Ch.3)
4. 质量标准 + 包装 + 验货   tiêu chuẩn chất lượng + đóng gói + kiểm hàng (Ch.4)
5. 付款方式 + 投保         phương thức thanh toán + bảo hiểm         (Ch.5)
6. 分歧 -> 让步 -> 打破僵局 bất đồng -> nhượng bộ -> phá bế tắc       (Ch.6)
7. 达成协议 -> 签订合同     đạt thoả thuận -> ký hợp đồng             (Ch.7)
</code></pre>
<h3>Năm chiến thuật đàm phán thường gặp (谈判技巧)</h3>
<ul>
<li><strong>红脸白脸 (hóngliǎn báiliǎn)</strong> — "mặt đỏ, mặt trắng" (good cop/bad cop): một người đàm phán cứng rắn, người kia mềm mỏng, để gây sức ép buộc đối phương nhượng bộ.</li>
<li><strong>以退为进 (yǐ tuì wéi jìn)</strong> — "lùi để tiến": chủ động nhượng bộ một điểm nhỏ để lấy lợi thế cho điểm lớn hơn về sau.</li>
<li><strong>沉默是金 (chénmò shì jīn)</strong> — "im lặng là vàng": giữ im lặng sau khi nêu quan điểm; đối phương thường tự lấp khoảng lặng bằng một nhượng bộ.</li>
<li><strong>抛砖引玉 (pāo zhuān yǐn yù)</strong> — "ném gạch dẫn ngọc": đưa ra đề nghị khiêm tốn trước để thăm dò lập trường thật của đối phương.</li>
<li><strong>声东击西 (shēng dōng jī xī)</strong> — "đánh động phía đông, tấn công phía tây": tập trung vào một điều khoản phụ để đánh lạc hướng khỏi điều khoản thực sự quan trọng.</li>
</ul>
<h3>Tình huống mô phỏng (kết hợp mọi chương)</h3>
<pre><code>Bối cảnh: nhà nhập khẩu Việt Nam đàm phán mua 5000 tai nghe với nhà máy Trung Quốc.
1) 开场白: 久仰大名 -> 询盘 -> 初步报价单
2) 讨价还价: "太贵了" -> gắn số lượng 五千件 -> 打九折
3) 数量与条款: 起订量、分批装运 (2 đợt)、溢短装 5%
4) 质量与包装: 验货 trước khi giao, đóng carton chống ẩm, 集装箱海运
5) 付款与保险: T/T 30% cọc + 70% khi có提单, CIF nên bên bán投保
6) 分歧: giao hàng 30 ngày quá lâu -> đề nghị 50% cọc đổi 20 ngày (以退为进)
7) 达成协议: 一式两份, 盖章, 生效, 合作愉快
</code></pre>
<div class="callout"><span class="badge">Mẹo thi</span> Mỗi chiến thuật trên là một KIỂU giao tiếp, không phải kịch bản cố định — nhận ra đối phương đang dùng chiến thuật nào (vd im lặng kéo dài sau khi bạn đưa giá = 沉默是金) để không bị ép nhượng bộ ngoài kế hoạch.</div>`,
  ]]);

const c8q = quiz('cin401-quiz-8', 'Quiz 8 — Full simulation & tactics|||Quiz 8 — Mô phỏng & chiến thuật', [
  { id: 'q1', question: '"红脸白脸" (hóngliǎn báiliǎn) mô tả chiến thuật đàm phán nào?', options: ['Im lặng để đối phương tự nhượng bộ', 'Một người cứng rắn, một người mềm mỏng, phối hợp gây sức ép (good cop / bad cop)', 'Nhượng bộ nhỏ để lấy lợi thế lớn hơn', 'Ném ra đề nghị khiêm tốn để thăm dò'], correctIndex: 1, explanation: '红脸白脸 = "mặt đỏ mặt trắng", tương đương good cop/bad cop trong tiếng Anh — phối hợp hai vai để ép đối phương nhượng bộ.' },
  { id: 'q2', question: '"以退为进" (yǐ tuì wéi jìn) nghĩa đen và ý nghĩa chiến thuật là gì?', options: ['"Lùi để tiến" — nhượng bộ nhỏ có tính toán để đạt lợi ích lớn hơn sau', '"Tiến để lùi" — tấn công ngay từ đầu để đối phương sợ hãi', '"Đứng yên" — không thay đổi lập trường trong suốt đàm phán', '"Đổi hướng" — chuyển sang đàm phán với đối tác khác'], correctIndex: 0, explanation: '以退为进 nghĩa đen "lùi để tiến" — chủ động nhượng bộ điểm nhỏ để tạo lợi thế cho điểm lớn hơn.' },
  { id: 'q3', question: 'Theo trình tự tổng hợp của chương ôn tập, bước nào diễn ra NGAY SAU khi thống nhất chất lượng & đóng gói (质量与包装)?', options: ['开场白 (mở đầu)', '付款与保险 (thanh toán & bảo hiểm)', '签订合同 (ký hợp đồng)', '讨价还价 (mặc cả)'], correctIndex: 1, explanation: 'Trình tự: mở đầu → mặc cả → điều khoản/số lượng → chất lượng/đóng gói → thanh toán & bảo hiểm → xử lý bất đồng → ký hợp đồng.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CIN401',
    slug: 'cin401-chinese-for-international-trade-negotiation',
    title: 'Chinese for International Trade Negotiation',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CIN401.webp',
    shortDescription: 'Chinese for trade negotiation: hanzi + pinyin + meaning, sentence patterns & tactics, real dialogues — opening, bargaining, terms, quality/packaging/delivery, payment/insurance, disagreement, closing & contract, full simulation.|||Tiếng Trung đàm phán thương mại: chữ Hán + pinyin + nghĩa, mẫu câu & chiến thuật đàm phán, hội thoại thực tế — mở đầu, mặc cả, điều khoản, chất lượng/đóng gói/giao hàng, thanh toán/bảo hiểm, xử lý bất đồng, chốt hợp đồng, mô phỏng hoàn chỉnh.',
    description: 'Môn <strong>CIN401 — Chinese for International Trade Negotiation</strong> (kỳ 4, ngành Ngôn ngữ Trung) tập trung riêng vào <strong>kỹ năng đàm phán thương mại quốc tế</strong> bằng tiếng Trung — khác với CIB301/401 (tiếng Trung thương mại tổng hợp) và CBC401 (thư tín). 8 chương bám sát trình tự một cuộc đàm phán thật: <strong>chuẩn bị &amp; mở đầu</strong> (开场, 报价) → <strong>hỏi giá, chào giá &amp; mặc cả</strong> (讨价还价) → <strong>điều khoản &amp; số lượng</strong> → <strong>chất lượng, đóng gói &amp; giao hàng</strong> → <strong>thanh toán &amp; bảo hiểm</strong> → <strong>xử lý bất đồng, nhượng bộ &amp; thuyết phục</strong> → <strong>chốt thoả thuận &amp; ký hợp đồng</strong> → <strong>ôn tập: mô phỏng đàm phán hoàn chỉnh &amp; chiến thuật giao tiếp</strong>. Mỗi chương có chữ Hán, pinyin có dấu thanh, nghĩa Việt/Anh, mẫu câu đàm phán và hội thoại thực tế, kèm quiz. Trích dẫn giáo trình <em>国际商务谈判</em> (International Business Negotiation) &amp; <em>商务谈判汉语</em>.',
    whatYouLearn: 'Mẫu câu mở đầu đàm phán & xin báo giá sơ bộ (报价单); mặc cả theo số lượng (讨价还价, 打折, 底价); điều khoản số lượng & giao hàng (起订量, 分批装运, 溢短装); chất lượng, đóng gói & vận chuyển (质量标准, 验货, 集装箱); thanh toán & bảo hiểm (信用证, 电汇, CIF/FOB, 投保); xử lý bất đồng, nhượng bộ có điều kiện & thuyết phục (让步, 双赢); chốt thoả thuận & ký hợp đồng (一式两份, 盖章, 生效); 5 chiến thuật đàm phán thường gặp (红脸白脸, 以退为进, 沉默是金…) và mô phỏng một cuộc đàm phán hoàn chỉnh.',
    requirements: 'Đã học xong tiếng Trung thương mại cơ sở (CIB301) hoặc trình độ HSK3 trở lên. Nên có kiến thức nền về ngoại thương (Incoterms, phương thức thanh toán quốc tế).',
  },
  sections: [
    { title: 'Chương 1 — Chuẩn bị & mở đầu đàm phán|||Chapter 1 — Preparation & opening', description: '开场白, 初步报价; hội thoại lần đầu gặp đối tác.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hỏi giá, chào giá & mặc cả|||Chapter 2 — Inquiry, quotation & bargaining', description: '讨价还价, 打折, 底价; hội thoại thương lượng giá.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thảo luận điều khoản & số lượng|||Chapter 3 — Terms & quantity negotiation', description: '起订量, 交货期, 溢短装; hội thoại thống nhất số lượng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Chất lượng, đóng gói & giao hàng|||Chapter 4 — Quality, packaging & delivery', description: '质量标准, 验货, 包装, 集装箱; hội thoại thống nhất giao hàng.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thanh toán & bảo hiểm|||Chapter 5 — Payment & insurance negotiation', description: '信用证, 电汇, CIF/FOB, 投保; hội thoại điều kiện thanh toán.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Xử lý bất đồng, nhượng bộ & thuyết phục|||Chapter 6 — Disagreement, concession & persuasion', description: '分歧, 让步, 双赢; hội thoại phá vỡ bế tắc.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Chốt thoả thuận & ký hợp đồng|||Chapter 7 — Closing the deal & signing', description: '达成协议, 一式两份, 盖章, 生效; hội thoại ký kết.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập: mô phỏng đàm phán hoàn chỉnh|||Chapter 8 — Review: full negotiation simulation', description: 'Trình tự đàm phán tổng hợp và 5 chiến thuật thường gặp.', lessons: [c8, c8q] },
  ],
};
