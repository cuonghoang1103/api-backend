/**
 * CIB301 — Comprehensive Business Chinese 1 (Tiếng Trung Thương mại Tổng hợp 1).
 * Giáo trình (trích dẫn, KHÔNG upload PDF): "商务汉语" (Business Chinese, Beijing
 * Language and Culture University Press) & "New Silk Road Business Chinese".
 * 8 chương thương mại nhập môn (trình độ BCT/HSK3-4 + từ vựng thương mại):
 * chào hỏi & công ty → tiếp khách & hẹn gặp → giới thiệu sản phẩm → hỏi/báo giá
 * → đặt hàng & hợp đồng → thanh toán → giao hàng → ôn tập tổng hợp.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ trong nội dung.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cib301-0-0-tai-lieu', 'Course materials & references|||Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (trích dẫn), tài liệu HSK chính thức, từ điển, công cụ gõ chữ Hán, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">CIB301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Comprehensive Business Chinese 1</strong> — greetings, hosting partners, product pitches, pricing, contracts, payment and shipping — in one place. The official textbook &amp; slides live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Reference textbooks (cited, not uploaded)</h3>
<ul>
<li><em>商务汉语 (Business Chinese)</em> — Beijing Language and Culture University Press (北京语言大学出版社)</li>
<li><em>New Silk Road Business Chinese</em> — beginner-to-intermediate business Chinese course series</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="http://www.chinesetest.cn" target="_blank" rel="noopener">Chinese Test (chinesetest.cn)</a> — official HSK syllabus &amp; vocabulary lists</li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese-English Dictionary</a> — character &amp; pinyin lookup</li>
<li><a href="https://resources.allsetlearning.com/chinese/" target="_blank" rel="noopener">Chinese Grammar Wiki</a> — grammar reference by level</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@yoyochinese" target="_blank" rel="noopener">Yoyo Chinese</a> — pronunciation &amp; grammar for beginners/intermediate</li>
<li><a href="https://www.youtube.com/@ChinesePod" target="_blank" rel="noopener">ChinesePod</a> — dialogue-based lessons, some business-themed</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG dictionary</a> — look up characters by pinyin, radical or English</li>
<li><a href="https://www.pinyinpractice.com/" target="_blank" rel="noopener">Pinyin Practice</a> — tone &amp; pinyin drills</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — greet correctly, exchange business cards, name your company and role.</li>
<li><strong>Practice</strong> — read the chapter dialogues aloud, matching characters to pinyin and tones.</li>
<li><strong>Go deeper</strong> — swap the vocabulary into your own product/price/contract details.</li>
<li><strong>Job-ready</strong> — rehearse the Chapter 8 end-to-end dialogue until it flows without reading.</li>
</ol></div>`,
    `<span class="eyebrow">CIB301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Tiếng Trung Thương mại Tổng hợp 1</strong> — chào hỏi, tiếp khách, giới thiệu sản phẩm, hỏi/báo giá, hợp đồng, thanh toán, giao hàng — gom về một chỗ. Giáo trình &amp; slide chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình tham khảo (trích dẫn, không đăng file)</h3>
<ul>
<li><em>商务汉语 (Business Chinese)</em> — Nhà xuất bản Đại học Ngôn ngữ Bắc Kinh (北京语言大学出版社)</li>
<li><em>New Silk Road Business Chinese</em> — bộ giáo trình tiếng Trung thương mại từ sơ đến trung cấp</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="http://www.chinesetest.cn" target="_blank" rel="noopener">Chinese Test (chinesetest.cn)</a> — đề cương &amp; danh sách từ vựng HSK chính thức</li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">Từ điển Hán-Anh MDBG</a> — tra chữ Hán &amp; pinyin</li>
<li><a href="https://resources.allsetlearning.com/chinese/" target="_blank" rel="noopener">Chinese Grammar Wiki</a> — ngữ pháp theo cấp độ</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@yoyochinese" target="_blank" rel="noopener">Yoyo Chinese</a> — phát âm &amp; ngữ pháp cho người mới/trung cấp</li>
<li><a href="https://www.youtube.com/@ChinesePod" target="_blank" rel="noopener">ChinesePod</a> — bài học theo hội thoại, có chủ đề thương mại</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">Từ điển MDBG</a> — tra chữ theo pinyin, bộ thủ hoặc nghĩa tiếng Anh</li>
<li><a href="https://www.pinyinpractice.com/" target="_blank" rel="noopener">Pinyin Practice</a> — luyện thanh điệu &amp; pinyin</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — chào hỏi đúng cách, trao danh thiếp, giới thiệu công ty &amp; chức vụ.</li>
<li><strong>Luyện tập</strong> — đọc to hội thoại từng chương, khớp chữ Hán với pinyin và thanh điệu.</li>
<li><strong>Đào sâu</strong> — thay từ vựng bằng sản phẩm/giá/hợp đồng của chính bạn.</li>
<li><strong>Sẵn sàng đi làm</strong> — luyện hội thoại tổng hợp Chương 8 đến khi nói trôi chảy không cần đọc.</li>
</ol></div>`,
  ]]);

const c1 = doc('cib301-1-1-greetings-company', '1.1 — Greetings & company introduction (公司, 名片)|||1.1 — Chào hỏi & giới thiệu công ty (公司, 名片)',
  'Chào hỏi thương mại, trao danh thiếp, giới thiệu tên/chức vụ/công ty; 敝公司 vs 贵公司.',
  [[
    `<span class="eyebrow">CIB301 · Chapter 1 · Lesson 1.1</span>
<h2>Greetings &amp; company introduction</h2>
<h3>Vocabulary</h3>
<pre><code>你好      nǐ hǎo             hello
您好      nín hǎo            hello (polite, formal "you")
很高兴认识您  hěn gāoxìng rènshi nín  nice to meet you
公司      gōngsī             company
名片      míngpiàn           business card
经理      jīnglǐ             manager
职位      zhíwèi             position, job title
姓名      xìngmíng           full name
敝公司     bì gōngsī          my company (humble, referring to yourself)
贵公司     guì gōngsī         your company (honorific, referring to the other side)
</code></pre>
<h3>Dialogue</h3>
<pre><code>甲: 您好，我叫王明，是ABC公司的销售经理。这是我的名片。
    Nín hǎo, wǒ jiào Wáng Míng, shì ABC gōngsī de xiāoshòu jīnglǐ. Zhè shì wǒ de míngpiàn.
    Hello, my name is Wang Ming, I'm the sales manager of ABC Company. Here is my business card.

乙: 您好，王经理。很高兴认识您。我姓陈，是XYZ公司的采购经理。
    Nín hǎo, Wáng jīnglǐ. Hěn gāoxìng rènshi nín. Wǒ xìng Chén, shì XYZ gōngsī de cǎigòu jīnglǐ.
    Hello, Manager Wang. Nice to meet you. My surname is Chen, I'm the purchasing manager of XYZ Company.

甲: 请问贵公司主要做什么业务？
    Qǐngwèn guì gōngsī zhǔyào zuò shénme yèwù?
    May I ask, what business does your company mainly do?

乙: 敝公司主要做电子产品出口。
    Bì gōngsī zhǔyào zuò diànzǐ chǎnpǐn chūkǒu.
    Our company mainly exports electronic products.
</code></pre>
<h3>Sample sentence patterns</h3>
<ul>
<li><strong>我是 + [company] 公司的 + [position]。</strong> — I am the [position] of [company].</li>
<li><strong>贵公司主要做什么业务？</strong> — What business does your company mainly do?</li>
</ul>
<div class="callout"><span class="badge">Etiquette</span> Hand over a business card with both hands, text facing the receiver, and take theirs the same way — a small gesture that reads as professional.</div>`,
    `<span class="eyebrow">CIB301 · Chương 1 · Bài 1.1</span>
<h2>Chào hỏi &amp; giới thiệu công ty</h2>
<h3>Từ vựng</h3>
<pre><code>你好      nǐ hǎo             xin chào
您好      nín hǎo            xin chào (lịch sự, "ngài")
很高兴认识您  hěn gāoxìng rènshi nín  rất vui được biết ngài
公司      gōngsī             công ty
名片      míngpiàn           danh thiếp
经理      jīnglǐ             giám đốc, quản lý
职位      zhíwèi             chức vụ
姓名      xìngmíng           họ tên đầy đủ
敝公司     bì gōngsī          công ty chúng tôi (khiêm ngữ, nói về mình)
贵公司     guì gōngsī         công ty của ngài (kính ngữ, nói về đối tác)
</code></pre>
<h3>Hội thoại</h3>
<pre><code>甲: 您好，我叫王明，是ABC公司的销售经理。这是我的名片。
    Nín hǎo, wǒ jiào Wáng Míng, shì ABC gōngsī de xiāoshòu jīnglǐ. Zhè shì wǒ de míngpiàn.
    Chào ông/bà, tôi tên là Vương Minh, là giám đốc kinh doanh của công ty ABC. Đây là danh thiếp của tôi.

乙: 您好，王经理。很高兴认识您。我姓陈，是XYZ公司的采购经理。
    Nín hǎo, Wáng jīnglǐ. Hěn gāoxìng rènshi nín. Wǒ xìng Chén, shì XYZ gōngsī de cǎigòu jīnglǐ.
    Chào giám đốc Vương. Rất vui được biết ông. Tôi họ Trần, là giám đốc thu mua của công ty XYZ.

甲: 请问贵公司主要做什么业务？
    Qǐngwèn guì gōngsī zhǔyào zuò shénme yèwù?
    Xin hỏi, công ty của quý ngài chủ yếu kinh doanh mảng nào?

乙: 敝公司主要做电子产品出口。
    Bì gōngsī zhǔyào zuò diànzǐ chǎnpǐn chūkǒu.
    Công ty chúng tôi chủ yếu xuất khẩu sản phẩm điện tử.
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>我是 + [công ty] 公司的 + [chức vụ]。</strong> — Tôi là [chức vụ] của công ty [công ty].</li>
<li><strong>贵公司主要做什么业务？</strong> — Công ty của ngài chủ yếu kinh doanh mảng nào?</li>
</ul>
<div class="callout"><span class="badge">Phép xã giao</span> Trao danh thiếp bằng hai tay, mặt chữ hướng về người nhận, và nhận lại danh thiếp cũng bằng hai tay — một cử chỉ nhỏ nhưng thể hiện sự chuyên nghiệp.</div>`,
  ]]);

const c1q = quiz('cib301-quiz-1', 'Quiz 1 — Greetings & company|||Quiz 1 — Chào hỏi & giới thiệu công ty', [
  { id: 'q1', question: '"名片" nghĩa là gì?', options: ['Hợp đồng', 'Danh thiếp', 'Hóa đơn', 'Báo giá'], correctIndex: 1, explanation: '名片 (míngpiàn) là danh thiếp, dùng khi giới thiệu bản thân với đối tác.' },
  { id: 'q2', question: '"贵公司" dùng để chỉ ai?', options: ['Công ty của mình (敝公司)', 'Công ty của đối phương (kính ngữ)', 'Công ty nhà nước', 'Công ty gia đình'], correctIndex: 1, explanation: '贵公司 (guì gōngsī) là kính ngữ chỉ công ty của người đối diện; 敝公司 là khiêm ngữ chỉ công ty của mình.' },
  { id: 'q3', question: 'Câu nói lịch sự khi lần đầu gặp đối tác là?', options: ['你好，干嘛？', '很高兴认识您', '你是谁？', '等一下'], correctIndex: 1, explanation: '很高兴认识您 (hěn gāoxìng rènshi nín) nghĩa là "rất vui được biết ngài" — câu chào lịch sự khi gặp lần đầu.' },
]);

const c2 = doc('cib301-2-1-hosting-appointments', '2.1 — Hosting guests & scheduling meetings|||2.1 — Tiếp khách & hẹn gặp đối tác',
  'Đón khách tại lễ tân, xác nhận cuộc hẹn, mời ngồi, hẹn giờ và phòng họp.',
  [[
    `<span class="eyebrow">CIB301 · Chapter 2 · Lesson 2.1</span>
<h2>Hosting guests &amp; scheduling meetings</h2>
<h3>Vocabulary</h3>
<pre><code>欢迎      huānyíng    welcome
光临      guānglín    honorific "gracious presence" (your visit)
请坐      qǐng zuò    please sit
喝点什么   hē diǎn shénme  what would you like to drink
预约      yùyuē       appointment
约时间     yuē shíjiān  to arrange a time
方便      fāngbiàn    convenient
会议室     huìyìshì    meeting room
稍等      shāo děng   please wait a moment
接待      jiēdài      to receive (guests)
</code></pre>
<h3>Dialogue</h3>
<pre><code>甲: 您好，欢迎光临！请问您是跟哪位约好的？
    Nín hǎo, huānyíng guānglín! Qǐngwèn nín shì gēn nǎ wèi yuēhǎo de?
    Hello, welcome! May I ask who you have an appointment with?

乙: 我跟陈经理约了十点见面。
    Wǒ gēn Chén jīnglǐ yuē le shí diǎn jiànmiàn.
    I have an appointment with Manager Chen at 10 o'clock.

甲: 好的，请坐，稍等一下，我马上通知她。
    Hǎo de, qǐng zuò, shāo děng yíxià, wǒ mǎshàng tōngzhī tā.
    Alright, please sit, just a moment, I'll notify her right away.

乙: 谢谢，请问会议室在哪里方便一点？
    Xièxie, qǐngwèn huìyìshì zài nǎlǐ fāngbiàn yìdiǎn?
    Thank you, which meeting room would be more convenient?
</code></pre>
<h3>Sample sentence patterns</h3>
<ul>
<li><strong>我跟 + [name] + 约了 + [time] + 见面。</strong> — I have an appointment with [name] at [time].</li>
<li><strong>请问 + [X] + 方便吗？</strong> — Is [X] convenient?</li>
</ul>
<div class="callout"><span class="badge">Tip</span> Confirming the visitor's appointment before anything else avoids awkward surprises and shows the host runs an organized office.</div>`,
    `<span class="eyebrow">CIB301 · Chương 2 · Bài 2.1</span>
<h2>Tiếp khách &amp; hẹn gặp đối tác</h2>
<h3>Từ vựng</h3>
<pre><code>欢迎      huānyíng    chào mừng, hoan nghênh
光临      guānglín    kính ngữ "sự có mặt của ngài"
请坐      qǐng zuò    xin mời ngồi
喝点什么   hē diǎn shénme  dùng gì để uống
预约      yùyuē       hẹn trước, đặt hẹn
约时间     yuē shíjiān  hẹn giờ
方便      fāngbiàn    thuận tiện
会议室     huìyìshì    phòng họp
稍等      shāo děng   xin chờ một chút
接待      jiēdài      tiếp đón (khách)
</code></pre>
<h3>Hội thoại</h3>
<pre><code>甲: 您好，欢迎光临！请问您是跟哪位约好的？
    Nín hǎo, huānyíng guānglín! Qǐngwèn nín shì gēn nǎ wèi yuēhǎo de?
    Xin chào, hoan nghênh quý khách! Xin hỏi ngài đã hẹn với ai?

乙: 我跟陈经理约了十点见面。
    Wǒ gēn Chén jīnglǐ yuē le shí diǎn jiànmiàn.
    Tôi đã hẹn gặp giám đốc Trần vào lúc 10 giờ.

甲: 好的，请坐，稍等一下，我马上通知她。
    Hǎo de, qǐng zuò, shāo děng yíxià, wǒ mǎshàng tōngzhī tā.
    Được rồi, xin mời ngồi, chờ một chút, tôi báo cho chị ấy ngay.

乙: 谢谢，请问会议室在哪里方便一点？
    Xièxie, qǐngwèn huìyìshì zài nǎlǐ fāngbiàn yìdiǎn?
    Cảm ơn, xin hỏi phòng họp ở đâu thì thuận tiện hơn?
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>我跟 + [tên] + 约了 + [giờ] + 见面。</strong> — Tôi đã hẹn gặp [tên] vào lúc [giờ].</li>
<li><strong>请问 + [X] + 方便吗？</strong> — Xin hỏi [X] có thuận tiện không?</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Xác nhận cuộc hẹn của khách trước khi làm bất cứ điều gì khác giúp tránh bất ngờ khó xử và thể hiện văn phòng được tổ chức bài bản.</div>`,
  ]]);

const c2q = quiz('cib301-quiz-2', 'Quiz 2 — Hosting & meetings|||Quiz 2 — Tiếp khách & hẹn gặp', [
  { id: 'q1', question: '"预约" nghĩa là gì?', options: ['Hẹn trước, đặt hẹn', 'Hủy hẹn', 'Đến muộn', 'Chờ đợi'], correctIndex: 0, explanation: '预约 (yùyuē) nghĩa là hẹn trước / đặt hẹn.' },
  { id: 'q2', question: 'Câu "请坐，稍等一下" có nghĩa là?', options: ['Xin mời ngồi, chờ một chút', 'Xin mời về', 'Xin đừng đến', 'Xin trả tiền trước'], correctIndex: 0, explanation: '请坐 = xin mời ngồi; 稍等一下 = chờ một chút.' },
  { id: 'q3', question: '"会议室" là gì?', options: ['Nhà kho', 'Phòng họp', 'Quầy lễ tân', 'Nhà xưởng'], correctIndex: 1, explanation: '会议室 (huìyìshì) nghĩa là phòng họp.' },
]);

const c3 = doc('cib301-3-1-products-services', '3.1 — Presenting products & services|||3.1 — Giới thiệu sản phẩm & dịch vụ',
  'Giới thiệu sản phẩm, đặc điểm, ưu thế, hàng mẫu, sách hướng dẫn, tỷ lệ giá/chất lượng.',
  [[
    `<span class="eyebrow">CIB301 · Chapter 3 · Lesson 3.1</span>
<h2>Presenting products &amp; services</h2>
<h3>Vocabulary</h3>
<pre><code>产品      chǎnpǐn     product
服务      fúwù        service
质量      zhìliàng    quality
特点      tèdiǎn      feature
优势      yōushì      advantage
样品      yàngpǐn     sample
说明书     shuōmíngshū manual, instructions
材料      cáiliào     material
型号      xínghào     model number
性价比     xìngjiàbǐ   price-performance ratio
</code></pre>
<h3>Dialogue</h3>
<pre><code>甲: 这是我们最新的产品，型号是XR-200。
    Zhè shì wǒmen zuìxīn de chǎnpǐn, xínghào shì XR-200.
    This is our newest product, model XR-200.

乙: 这个产品有什么特点？
    Zhège chǎnpǐn yǒu shénme tèdiǎn?
    What features does this product have?

甲: 材料环保，质量好，而且性价比很高。我们也可以先寄样品给您看看。
    Cáiliào huánbǎo, zhìliàng hǎo, érqiě xìngjiàbǐ hěn gāo. Wǒmen yě kěyǐ xiān jì yàngpǐn gěi nín kànkan.
    The materials are eco-friendly, the quality is good, and the price-performance ratio is very high. We can also send you a sample first.

乙: 太好了，说明书是中英文的吗？
    Tài hǎo le, shuōmíngshū shì Zhōng-Yīng wén de ma?
    Great, is the manual in Chinese and English?
</code></pre>
<h3>Sample sentence patterns</h3>
<ul>
<li><strong>这个产品有什么特点/优势？</strong> — What features/advantages does this product have?</li>
<li><strong>我们可以先寄样品给您。</strong> — We can send you a sample first.</li>
</ul>
<div class="callout"><span class="badge">Tip</span> Leading with a concrete number (材料环保 → 质量好 → 性价比高) is more persuasive than a general "our product is good."</div>`,
    `<span class="eyebrow">CIB301 · Chương 3 · Bài 3.1</span>
<h2>Giới thiệu sản phẩm &amp; dịch vụ</h2>
<h3>Từ vựng</h3>
<pre><code>产品      chǎnpǐn     sản phẩm
服务      fúwù        dịch vụ
质量      zhìliàng    chất lượng
特点      tèdiǎn      đặc điểm
优势      yōushì      ưu thế
样品      yàngpǐn     hàng mẫu
说明书     shuōmíngshū sách hướng dẫn sử dụng
材料      cáiliào     nguyên liệu
型号      xínghào     mã kiểu, mã sản phẩm
性价比     xìngjiàbǐ   tỷ lệ giá/chất lượng
</code></pre>
<h3>Hội thoại</h3>
<pre><code>甲: 这是我们最新的产品，型号是XR-200。
    Zhè shì wǒmen zuìxīn de chǎnpǐn, xínghào shì XR-200.
    Đây là sản phẩm mới nhất của chúng tôi, mã kiểu là XR-200.

乙: 这个产品有什么特点？
    Zhège chǎnpǐn yǒu shénme tèdiǎn?
    Sản phẩm này có đặc điểm gì?

甲: 材料环保，质量好，而且性价比很高。我们也可以先寄样品给您看看。
    Cáiliào huánbǎo, zhìliàng hǎo, érqiě xìngjiàbǐ hěn gāo. Wǒmen yě kěyǐ xiān jì yàngpǐn gěi nín kànkan.
    Nguyên liệu thân thiện môi trường, chất lượng tốt, tỷ lệ giá/chất lượng rất cao. Chúng tôi cũng có thể gửi hàng mẫu cho ngài xem trước.

乙: 太好了，说明书是中英文的吗？
    Tài hǎo le, shuōmíngshū shì Zhōng-Yīng wén de ma?
    Tuyệt quá, sách hướng dẫn có song ngữ Trung-Anh không?
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>这个产品有什么特点/优势？</strong> — Sản phẩm này có đặc điểm/ưu thế gì?</li>
<li><strong>我们可以先寄样品给您。</strong> — Chúng tôi có thể gửi hàng mẫu cho ngài trước.</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Mở đầu bằng một chi tiết cụ thể (nguyên liệu thân thiện môi trường → chất lượng tốt → tỷ lệ giá/chất lượng cao) thuyết phục hơn câu chung "sản phẩm chúng tôi tốt".</div>`,
  ]]);

const c3q = quiz('cib301-quiz-3', 'Quiz 3 — Products & services|||Quiz 3 — Sản phẩm & dịch vụ', [
  { id: 'q1', question: '"性价比" nghĩa là gì?', options: ['Giá thành sản xuất', 'Tỷ lệ giá/chất lượng', 'Số lượng tồn kho', 'Thời hạn bảo hành'], correctIndex: 1, explanation: '性价比 (xìngjiàbǐ) nghĩa là tỷ lệ giữa giá cả và chất lượng.' },
  { id: 'q2', question: '"样品" dùng để làm gì trong đàm phán thương mại?', options: ['Ký hợp đồng', 'Cho khách xem/thử trước khi mua số lượng lớn', 'Thay thế hóa đơn', 'Tính tiền đặt cọc'], correctIndex: 1, explanation: '样品 (yàngpǐn) là hàng mẫu, gửi cho khách xem trước khi đặt số lượng lớn.' },
  { id: 'q3', question: '"说明书" nghĩa là gì?', options: ['Báo giá', 'Hợp đồng', 'Sách hướng dẫn sử dụng', 'Hóa đơn'], correctIndex: 2, explanation: '说明书 (shuōmíngshū) là sách/tài liệu hướng dẫn sử dụng sản phẩm.' },
]);

const c4 = doc('cib301-4-1-price-quotation', '4.1 — Price inquiry & quotation (询价, 报价)|||4.1 — Hỏi giá & báo giá (询价, 报价)',
  'Hỏi giá, đơn giá theo số lượng, chiết khấu, số lượng đặt hàng tối thiểu, bảng báo giá.',
  [[
    `<span class="eyebrow">CIB301 · Chapter 4 · Lesson 4.1</span>
<h2>Price inquiry &amp; quotation</h2>
<h3>Vocabulary</h3>
<pre><code>询价      xúnjià      to inquire about a price
报价      bàojià      to quote a price
价格      jiàgé       price
单价      dānjià      unit price
优惠      yōuhuì      preferential, discount
打折      dǎzhé       to give a discount
最低价     zuìdī jià   lowest price
报价单     bàojiàdān   price quotation sheet
数量      shùliàng    quantity
起订量     qǐdìngliàng minimum order quantity (MOQ)
</code></pre>
<h3>Dialogue</h3>
<pre><code>甲: 我想询价，这个型号一千个的单价是多少？
    Wǒ xiǎng xúnjià, zhège xínghào yìqiān gè de dānjià shì duōshao?
    I'd like to ask for a quote — what's the unit price for this model at a quantity of one thousand?

乙: 我们的起订量是五百个，一千个的话，单价是八块钱。
    Wǒmen de qǐdìngliàng shì wǔbǎi gè, yìqiān gè dehuà, dānjià shì bā kuài qián.
    Our MOQ is five hundred units; for one thousand units, the unit price is 8 yuan.

甲: 数量比较大，能不能多一点优惠？
    Shùliàng bǐjiào dà, néng bù néng duō yìdiǎn yōuhuì?
    The quantity is fairly large — could you give a little more discount?

乙: 可以，我给您打九五折，这是正式的报价单。
    Kěyǐ, wǒ gěi nín dǎ jiǔwǔ zhé, zhè shì zhèngshì de bàojiàdān.
    Sure, I'll give you a 5% discount, here is the official quotation sheet.
</code></pre>
<h3>Sample sentence patterns</h3>
<ul>
<li><strong>[X]的单价是多少？</strong> — What's the unit price of [X]?</li>
<li><strong>能不能多一点优惠/打折？</strong> — Could you give a bit more discount?</li>
</ul>
<div class="callout"><span class="badge">Tip</span> "打九五折" means the price becomes 95% of the original — a 5% discount, not 95% off. Mixing the two up is a common learner mistake.</div>`,
    `<span class="eyebrow">CIB301 · Chương 4 · Bài 4.1</span>
<h2>Hỏi giá &amp; báo giá</h2>
<h3>Từ vựng</h3>
<pre><code>询价      xúnjià      hỏi giá
报价      bàojià      báo giá
价格      jiàgé       giá cả
单价      dānjià      đơn giá
优惠      yōuhuì      ưu đãi
打折      dǎzhé       giảm giá, chiết khấu
最低价     zuìdī jià   giá thấp nhất
报价单     bàojiàdān   bảng báo giá
数量      shùliàng    số lượng
起订量     qǐdìngliàng số lượng đặt hàng tối thiểu (MOQ)
</code></pre>
<h3>Hội thoại</h3>
<pre><code>甲: 我想询价，这个型号一千个的单价是多少？
    Wǒ xiǎng xúnjià, zhège xínghào yìqiān gè de dānjià shì duōshao?
    Tôi muốn hỏi giá, mã này với số lượng một nghìn cái thì đơn giá là bao nhiêu?

乙: 我们的起订量是五百个，一千个的话，单价是八块钱。
    Wǒmen de qǐdìngliàng shì wǔbǎi gè, yìqiān gè dehuà, dānjià shì bā kuài qián.
    Số lượng đặt hàng tối thiểu của chúng tôi là 500 cái, còn nếu 1.000 cái thì đơn giá là 8 tệ.

甲: 数量比较大，能不能多一点优惠？
    Shùliàng bǐjiào dà, néng bù néng duō yìdiǎn yōuhuì?
    Số lượng khá lớn, có thể ưu đãi thêm một chút không?

乙: 可以，我给您打九五折，这是正式的报价单。
    Kěyǐ, wǒ gěi nín dǎ jiǔwǔ zhé, zhè shì zhèngshì de bàojiàdān.
    Được, tôi giảm 5% cho ngài (còn 95% giá gốc), đây là bảng báo giá chính thức.
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>[X]的单价是多少？</strong> — Đơn giá của [X] là bao nhiêu?</li>
<li><strong>能不能多一点优惠/打折？</strong> — Có thể ưu đãi/giảm giá thêm một chút không?</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> "打九五折" nghĩa là giá còn lại 95% giá gốc — tức GIẢM 5%, không phải giảm 95%. Đây là lỗi hay nhầm của người học.</div>`,
  ]]);

const c4q = quiz('cib301-quiz-4', 'Quiz 4 — Price & quotation|||Quiz 4 — Hỏi giá & báo giá', [
  { id: 'q1', question: '"起订量" nghĩa là gì?', options: ['Giá thấp nhất', 'Số lượng đặt hàng tối thiểu (MOQ)', 'Đơn giá', 'Chiết khấu'], correctIndex: 1, explanation: '起订量 (qǐdìngliàng) là số lượng tối thiểu phải đặt hàng (MOQ).' },
  { id: 'q2', question: '"打九五折" nghĩa là giảm giá bao nhiêu phần trăm?', options: ['5%', '9,5%', '95%', '50%'], correctIndex: 0, explanation: '打九五折 nghĩa là giá còn lại 95% giá gốc, tức chỉ giảm 5%.' },
  { id: 'q3', question: '"报价单" là gì?', options: ['Hợp đồng chính thức', 'Bảng báo giá', 'Hóa đơn thanh toán', 'Phiếu giao hàng'], correctIndex: 1, explanation: '报价单 (bàojiàdān) là bảng báo giá gửi cho khách hàng.' },
]);

const c5 = doc('cib301-5-1-orders-contracts', '5.1 — Placing orders & simple contracts|||5.1 — Đặt hàng & ký hợp đồng đơn giản',
  'Đặt đơn hàng, ký hợp đồng, điều khoản, thời hạn giao hàng, vi phạm hợp đồng, bên A/bên B.',
  [[
    `<span class="eyebrow">CIB301 · Chapter 5 · Lesson 5.1</span>
<h2>Placing orders &amp; simple contracts</h2>
<h3>Vocabulary</h3>
<pre><code>订单      dìngdān     order
下订单     xià dìngdān to place an order
合同      hétong      contract
签合同     qiān hétong to sign a contract
条款      tiáokuǎn    clause, term
交货期     jiāohuòqī   delivery date
违约      wéiyuē      to breach a contract
双方      shuāngfāng  both parties
甲方/乙方  jiǎfāng / yǐfāng  Party A / Party B
盖章      gàizhāng    to stamp, to seal
</code></pre>
<h3>Dialogue</h3>
<pre><code>甲: 我们决定下订单了，一共两千件。
    Wǒmen juédìng xià dìngdān le, yígòng liǎngqiān jiàn.
    We've decided to place the order, two thousand pieces in total.

乙: 好的，那我们先签合同，交货期定在三十天以内。
    Hǎo de, nà wǒmen xiān qiān hétong, jiāohuòqī dìng zài sānshí tiān yǐnèi.
    Alright, let's sign the contract first, delivery date set within thirty days.

甲: 合同条款里，如果一方违约怎么办？
    Hétong tiáokuǎn lǐ, rúguǒ yìfāng wéiyuē zěnme bàn?
    In the contract clauses, what happens if one party breaches the contract?

乙: 双方都要按条款赔偿，签字盖章以后就正式生效。
    Shuāngfāng dōu yào àn tiáokuǎn péicháng, qiānzì gàizhāng yǐhòu jiù zhèngshì shēngxiào.
    Both parties must compensate according to the clauses; it takes effect once signed and stamped.
</code></pre>
<h3>Sample sentence patterns</h3>
<ul>
<li><strong>我们决定下订单了。</strong> — We've decided to place the order.</li>
<li><strong>交货期定在[X]以内。</strong> — The delivery date is set within [X].</li>
</ul>
<div class="callout"><span class="badge">Tip</span> In Chinese business practice, a contract usually only takes legal effect once it carries the company seal (盖章) — a signature alone is often not enough.</div>`,
    `<span class="eyebrow">CIB301 · Chương 5 · Bài 5.1</span>
<h2>Đặt hàng &amp; ký hợp đồng đơn giản</h2>
<h3>Từ vựng</h3>
<pre><code>订单      dìngdān     đơn đặt hàng
下订单     xià dìngdān đặt hàng
合同      hétong      hợp đồng
签合同     qiān hétong ký hợp đồng
条款      tiáokuǎn    điều khoản
交货期     jiāohuòqī   thời hạn giao hàng
违约      wéiyuē      vi phạm hợp đồng
双方      shuāngfāng  hai bên
甲方/乙方  jiǎfāng / yǐfāng  bên A / bên B
盖章      gàizhāng    đóng dấu
</code></pre>
<h3>Hội thoại</h3>
<pre><code>甲: 我们决定下订单了，一共两千件。
    Wǒmen juédìng xià dìngdān le, yígòng liǎngqiān jiàn.
    Chúng tôi quyết định đặt hàng rồi, tổng cộng 2.000 chiếc.

乙: 好的，那我们先签合同，交货期定在三十天以内。
    Hǎo de, nà wǒmen xiān qiān hétong, jiāohuòqī dìng zài sānshí tiān yǐnèi.
    Được, vậy chúng ta ký hợp đồng trước, thời hạn giao hàng ấn định trong vòng 30 ngày.

甲: 合同条款里，如果一方违约怎么办？
    Hétong tiáokuǎn lǐ, rúguǒ yìfāng wéiyuē zěnme bàn?
    Trong điều khoản hợp đồng, nếu một bên vi phạm hợp đồng thì xử lý thế nào?

乙: 双方都要按条款赔偿，签字盖章以后就正式生效。
    Shuāngfāng dōu yào àn tiáokuǎn péicháng, qiānzì gàizhāng yǐhòu jiù zhèngshì shēngxiào.
    Hai bên đều phải bồi thường theo điều khoản, sau khi ký tên đóng dấu thì chính thức có hiệu lực.
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>我们决定下订单了。</strong> — Chúng tôi quyết định đặt hàng rồi.</li>
<li><strong>交货期定在[X]以内。</strong> — Thời hạn giao hàng ấn định trong vòng [X].</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Trong tập quán thương mại Trung Quốc, hợp đồng thường chỉ có hiệu lực pháp lý khi có dấu công ty (盖章) — chỉ ký tên đôi khi chưa đủ.</div>`,
  ]]);

const c5q = quiz('cib301-quiz-5', 'Quiz 5 — Orders & contracts|||Quiz 5 — Đặt hàng & hợp đồng', [
  { id: 'q1', question: 'Trong hợp đồng thương mại, "甲方" và "乙方" nghĩa là?', options: ['Ngân hàng và khách hàng', 'Bên A và bên B', 'Người mua và nhà nước', 'Công ty mẹ và công ty con'], correctIndex: 1, explanation: '甲方 (jiǎfāng) là Bên A, 乙方 (yǐfāng) là Bên B trong hợp đồng.' },
  { id: 'q2', question: '"违约" nghĩa là gì?', options: ['Ký hợp đồng', 'Vi phạm hợp đồng', 'Gia hạn hợp đồng', 'Hủy đơn hàng'], correctIndex: 1, explanation: '违约 (wéiyuē) nghĩa là vi phạm hợp đồng.' },
  { id: 'q3', question: 'Theo hội thoại, hợp đồng chính thức có hiệu lực khi nào?', options: ['Khi gửi email xác nhận', 'Khi hai bên ký tên và đóng dấu', 'Khi đặt cọc', 'Khi giao hàng xong'], correctIndex: 1, explanation: '签字盖章以后就正式生效 — hợp đồng có hiệu lực sau khi ký tên và đóng dấu.' },
]);

const c6 = doc('cib301-6-1-payment-methods', '6.1 — Payment & methods of payment|||6.1 — Thanh toán & phương thức chi trả',
  'Phương thức thanh toán, tiền đặt cọc, số tiền còn lại, hóa đơn, chuyển khoản, tỷ giá.',
  [[
    `<span class="eyebrow">CIB301 · Chapter 6 · Lesson 6.1</span>
<h2>Payment &amp; methods of payment</h2>
<h3>Vocabulary</h3>
<pre><code>付款      fùkuǎn        to pay
付款方式   fùkuǎn fāngshì payment method
定金      dìngjīn       deposit
余款      yúkuǎn        balance payment
发票      fāpiào        invoice
银行转账   yínháng zhuǎnzhàng  bank transfer
信用卡     xìnyòngkǎ     credit card
现金      xiànjīn       cash
到期      dàoqī         to be due
汇率      huìlǜ         exchange rate
</code></pre>
<h3>Dialogue</h3>
<pre><code>甲: 请问贵公司的付款方式是怎样的？
    Qǐngwèn guì gōngsī de fùkuǎn fāngshì shì zěnyàng de?
    May I ask what your company's payment method is?

乙: 一般是先付百分之三十的定金，剩下的余款交货前付清。
    Yìbān shì xiān fù bǎi fēn zhī sānshí de dìngjīn, shèngxià de yúkuǎn jiāohuò qián fùqīng.
    Usually you pay a 30% deposit first, and settle the balance before delivery.

甲: 可以银行转账吗？汇率按哪一天算？
    Kěyǐ yínháng zhuǎnzhàng ma? Huìlǜ àn nǎ yì tiān suàn?
    Can we pay by bank transfer? Which day's exchange rate is used?

乙: 可以，按付款当天的汇率计算，付款后我们会开发票。
    Kěyǐ, àn fùkuǎn dàngtiān de huìlǜ jìsuàn, fùkuǎn hòu wǒmen huì kāi fāpiào.
    Yes, calculated at the exchange rate on the day of payment; we'll issue an invoice after payment.
</code></pre>
<h3>Sample sentence patterns</h3>
<ul>
<li><strong>先付[X]定金，余款[Y]付清。</strong> — Pay a deposit of [X] first, settle the balance [Y].</li>
<li><strong>按[X]的汇率计算。</strong> — Calculated at the exchange rate of [X].</li>
</ul>
<div class="callout"><span class="badge">Tip</span> Always confirm which day's exchange rate applies before a cross-border transfer — a delay of even one day can shift the amount due.</div>`,
    `<span class="eyebrow">CIB301 · Chương 6 · Bài 6.1</span>
<h2>Thanh toán &amp; phương thức chi trả</h2>
<h3>Từ vựng</h3>
<pre><code>付款      fùkuǎn        thanh toán
付款方式   fùkuǎn fāngshì phương thức thanh toán
定金      dìngjīn       tiền đặt cọc
余款      yúkuǎn        số tiền còn lại
发票      fāpiào        hóa đơn
银行转账   yínháng zhuǎnzhàng  chuyển khoản ngân hàng
信用卡     xìnyòngkǎ     thẻ tín dụng
现金      xiànjīn       tiền mặt
到期      dàoqī         đến hạn
汇率      huìlǜ         tỷ giá hối đoái
</code></pre>
<h3>Hội thoại</h3>
<pre><code>甲: 请问贵公司的付款方式是怎样的？
    Qǐngwèn guì gōngsī de fùkuǎn fāngshì shì zěnyàng de?
    Xin hỏi phương thức thanh toán của công ty ngài như thế nào?

乙: 一般是先付百分之三十的定金，剩下的余款交货前付清。
    Yìbān shì xiān fù bǎi fēn zhī sānshí de dìngjīn, shèngxià de yúkuǎn jiāohuò qián fùqīng.
    Thông thường là trả trước 30% tiền đặt cọc, số tiền còn lại thanh toán hết trước khi giao hàng.

甲: 可以银行转账吗？汇率按哪一天算？
    Kěyǐ yínháng zhuǎnzhàng ma? Huìlǜ àn nǎ yì tiān suàn?
    Có thể chuyển khoản ngân hàng không? Tỷ giá tính theo ngày nào?

乙: 可以，按付款当天的汇率计算，付款后我们会开发票。
    Kěyǐ, àn fùkuǎn dàngtiān de huìlǜ jìsuàn, fùkuǎn hòu wǒmen huì kāi fāpiào.
    Được, tính theo tỷ giá của ngày thanh toán, sau khi thanh toán chúng tôi sẽ xuất hóa đơn.
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>先付[X]定金，余款[Y]付清。</strong> — Trả trước tiền đặt cọc [X], số tiền còn lại thanh toán hết [Y].</li>
<li><strong>按[X]的汇率计算。</strong> — Tính theo tỷ giá của [X].</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Luôn xác nhận tỷ giá tính theo ngày nào trước khi chuyển khoản quốc tế — chỉ chậm một ngày cũng có thể làm thay đổi số tiền phải trả.</div>`,
  ]]);

const c6q = quiz('cib301-quiz-6', 'Quiz 6 — Payment methods|||Quiz 6 — Thanh toán & phương thức chi trả', [
  { id: 'q1', question: '"定金" nghĩa là gì?', options: ['Số tiền còn lại', 'Tiền đặt cọc', 'Tổng hóa đơn', 'Phí vận chuyển'], correctIndex: 1, explanation: '定金 (dìngjīn) là tiền đặt cọc, trả trước khi ký/thực hiện đơn hàng.' },
  { id: 'q2', question: '"汇率" nghĩa là gì?', options: ['Lãi suất ngân hàng', 'Tỷ giá hối đoái', 'Thuế xuất khẩu', 'Phí chuyển khoản'], correctIndex: 1, explanation: '汇率 (huìlǜ) là tỷ giá hối đoái giữa hai loại tiền tệ.' },
  { id: 'q3', question: '"发票" là gì?', options: ['Hợp đồng', 'Hóa đơn', 'Báo giá', 'Danh thiếp'], correctIndex: 1, explanation: '发票 (fāpiào) là hóa đơn, xuất sau khi thanh toán.' },
]);

const c7 = doc('cib301-7-1-delivery-shipping', '7.1 — Delivery & basic shipping|||7.1 — Giao hàng & vận chuyển cơ bản',
  'Xuất hàng, đóng gói, phí vận chuyển, logistics, trì hoãn, nhận hàng tại kho.',
  [[
    `<span class="eyebrow">CIB301 · Chapter 7 · Lesson 7.1</span>
<h2>Delivery &amp; basic shipping</h2>
<h3>Vocabulary</h3>
<pre><code>发货      fāhuò       to ship goods
送货      sònghuò     to deliver goods
快递      kuàidì      express delivery
运费      yùnfèi      shipping fee
仓库      cāngkù      warehouse
物流      wùliú       logistics
到货      dàohuò      goods arrive
延误      yánwù       delay
包装      bāozhuāng   packaging
提货      tíhuò       to pick up goods
</code></pre>
<h3>Dialogue</h3>
<pre><code>甲: 我们的货什么时候可以发货？
    Wǒmen de huò shénme shíhou kěyǐ fāhuò?
    When can our goods be shipped?

乙: 包装好以后就发货，大概三天后到货，走海运的话运费比较便宜。
    Bāozhuāng hǎo yǐhòu jiù fāhuò, dàgài sān tiān hòu dàohuò, zǒu hǎiyùn dehuà yùnfèi bǐjiào piányi.
    We'll ship once packaging is done, goods should arrive in about three days; sea freight is cheaper.

甲: 好，如果物流延误了怎么联系？
    Hǎo, rúguǒ wùliú yánwù le zěnme liánxì?
    Alright, how do we get in touch if the logistics is delayed?

乙: 我们会随时通知您，货到仓库以后您可以直接去提货。
    Wǒmen huì suíshí tōngzhī nín, huò dào cāngkù yǐhòu nín kěyǐ zhíjiē qù tíhuò.
    We'll notify you promptly; once the goods reach the warehouse, you can go pick them up directly.
</code></pre>
<h3>Sample sentence patterns</h3>
<ul>
<li><strong>[X]什么时候可以发货/到货？</strong> — When can [X] be shipped / arrive?</li>
<li><strong>走海运/空运的话，运费...</strong> — If shipped by sea/air, the shipping fee...</li>
</ul>
<div class="callout"><span class="badge">Tip</span> Sea freight (海运) is cheaper but slower; air freight (空运) is faster but costlier — pick the route based on how urgent the order is.</div>`,
    `<span class="eyebrow">CIB301 · Chương 7 · Bài 7.1</span>
<h2>Giao hàng &amp; vận chuyển cơ bản</h2>
<h3>Từ vựng</h3>
<pre><code>发货      fāhuò       xuất hàng, gửi hàng
送货      sònghuò     giao hàng
快递      kuàidì      chuyển phát nhanh
运费      yùnfèi      phí vận chuyển
仓库      cāngkù      kho hàng
物流      wùliú       logistics, hậu cần
到货      dàohuò      hàng đến
延误      yánwù       trì hoãn, chậm trễ
包装      bāozhuāng   đóng gói, bao bì
提货      tíhuò       nhận hàng, lấy hàng
</code></pre>
<h3>Hội thoại</h3>
<pre><code>甲: 我们的货什么时候可以发货？
    Wǒmen de huò shénme shíhou kěyǐ fāhuò?
    Hàng của chúng tôi khi nào có thể xuất kho?

乙: 包装好以后就发货，大概三天后到货，走海运的话运费比较便宜。
    Bāozhuāng hǎo yǐhòu jiù fāhuò, dàgài sān tiān hòu dàohuò, zǒu hǎiyùn dehuà yùnfèi bǐjiào piányi.
    Sau khi đóng gói xong sẽ xuất hàng ngay, khoảng 3 ngày sau hàng sẽ đến, nếu đi đường biển thì phí vận chuyển rẻ hơn.

甲: 好，如果物流延误了怎么联系？
    Hǎo, rúguǒ wùliú yánwù le zěnme liánxì?
    Được, nếu logistics bị chậm trễ thì liên hệ thế nào?

乙: 我们会随时通知您，货到仓库以后您可以直接去提货。
    Wǒmen huì suíshí tōngzhī nín, huò dào cāngkù yǐhòu nín kěyǐ zhíjiē qù tíhuò.
    Chúng tôi sẽ thông báo cho ngài ngay, sau khi hàng về kho ngài có thể trực tiếp đến nhận hàng.
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>[X]什么时候可以发货/到货？</strong> — [X] khi nào có thể xuất/đến hàng?</li>
<li><strong>走海运/空运的话，运费...</strong> — Nếu đi đường biển/hàng không thì phí vận chuyển...</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Đường biển (海运) rẻ hơn nhưng chậm hơn; đường hàng không (空运) nhanh hơn nhưng đắt hơn — chọn tuyến theo mức độ khẩn cấp của đơn hàng.</div>`,
  ]]);

const c7q = quiz('cib301-quiz-7', 'Quiz 7 — Delivery & shipping|||Quiz 7 — Giao hàng & vận chuyển', [
  { id: 'q1', question: '"运费" nghĩa là gì?', options: ['Phí vận chuyển', 'Phí đóng gói', 'Phí lưu kho', 'Phí bảo hiểm'], correctIndex: 0, explanation: '运费 (yùnfèi) là phí vận chuyển hàng hóa.' },
  { id: 'q2', question: '"延误" nghĩa là gì?', options: ['Giao hàng đúng hẹn', 'Chậm trễ, trì hoãn', 'Hủy đơn hàng', 'Đổi hàng'], correctIndex: 1, explanation: '延误 (yánwù) nghĩa là chậm trễ, trì hoãn (thường dùng cho vận chuyển).' },
  { id: 'q3', question: '"提货" nghĩa là gì?', options: ['Xuất hàng từ nhà máy', 'Đóng gói hàng', 'Nhận/lấy hàng tại kho', 'Kiểm tra chất lượng hàng'], correctIndex: 2, explanation: '提货 (tíhuò) nghĩa là đến nhận/lấy hàng, thường tại kho hoặc điểm giao nhận.' },
]);

const c8 = doc('cib301-8-1-comprehensive-review', '8.1 — Review: comprehensive dialogue & HSK business vocabulary|||8.1 — Ôn tập: hội thoại thương mại tổng hợp & từ vựng HSK',
  'Ôn tập từ vựng 7 chương theo nhóm chủ đề; hội thoại tổng hợp từ chào hỏi đến giao hàng.',
  [[
    `<span class="eyebrow">CIB301 · Chapter 8 · Lesson 8.1</span>
<h2>Review: comprehensive dialogue &amp; business vocabulary</h2>
<h3>Vocabulary review by topic (HSK3-4 level)</h3>
<pre><code>Greetings/company:  名片 míngpiàn · 公司 gōngsī · 贵公司 guì gōngsī
Hosting/meetings:   预约 yùyuē · 会议室 huìyìshì · 接待 jiēdài
Products:           产品 chǎnpǐn · 样品 yàngpǐn · 性价比 xìngjiàbǐ
Price/quotation:    询价 xúnjià · 报价 bàojià · 起订量 qǐdìngliàng
Orders/contracts:   合同 hétong · 条款 tiáokuǎn · 违约 wéiyuē
Payment:            付款 fùkuǎn · 定金 dìngjīn · 发票 fāpiào
Shipping:           发货 fāhuò · 运费 yùnfèi · 提货 tíhuò
</code></pre>
<h3>End-to-end dialogue</h3>
<pre><code>甲: 您好，很高兴认识您，这是我的名片。
    Nín hǎo, hěn gāoxìng rènshi nín, zhè shì wǒ de míngpiàn.
    Hello, nice to meet you, here is my business card.

乙: 我们对贵公司的产品很感兴趣，可以先看一下样品和报价单吗？
    Wǒmen duì guì gōngsī de chǎnpǐn hěn gǎn xìngqù, kěyǐ xiān kàn yíxià yàngpǐn hé bàojiàdān ma?
    We're very interested in your company's products — could we see the sample and quotation sheet first?

甲: 当然，这是报价单，一千件的单价是八块钱，起订量是五百件。
    Dāngrán, zhè shì bàojiàdān, yìqiān jiàn de dānjià shì bā kuài qián, qǐdìngliàng shì wǔbǎi jiàn.
    Of course, here is the quotation — the unit price for one thousand pieces is 8 yuan, MOQ is 500 pieces.

乙: 好，我们决定下订单，麻烦准备合同，交货期定在三十天以内。
    Hǎo, wǒmen juédìng xià dìngdān, máfan zhǔnbèi hétong, jiāohuòqī dìng zài sānshí tiān yǐnèi.
    Good, we've decided to order — please prepare the contract, delivery date set within thirty days.

甲: 没问题，付款方式是先付三十定金，余款交货前付清，可以银行转账。
    Méi wèntí, fùkuǎn fāngshì shì xiān fù sānshí dìngjīn, yúkuǎn jiāohuò qián fùqīng, kěyǐ yínháng zhuǎnzhàng.
    No problem, the payment method is 30% deposit first, balance settled before delivery, bank transfer accepted.

乙: 好的，货物包装好以后请尽快发货，谢谢！
    Hǎo de, huòwù bāozhuāng hǎo yǐhòu qǐng jǐnkuài fāhuò, xièxie!
    Alright, once the goods are packaged please ship as soon as possible, thank you!
</code></pre>
<div class="callout"><span class="badge">Transaction flow</span> Greeting &amp; company intro → hosting/meeting → product pitch → price inquiry &amp; quotation → order &amp; contract → payment → shipping/delivery. This is the backbone of nearly every B2B deal in Chinese.</div>`,
    `<span class="eyebrow">CIB301 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập: hội thoại tổng hợp &amp; từ vựng thương mại</h2>
<h3>Ôn tập từ vựng theo chủ đề (trình độ HSK3-4)</h3>
<pre><code>Chào hỏi/công ty:  名片 míngpiàn · 公司 gōngsī · 贵公司 guì gōngsī
Tiếp khách/hẹn:    预约 yùyuē · 会议室 huìyìshì · 接待 jiēdài
Sản phẩm:          产品 chǎnpǐn · 样品 yàngpǐn · 性价比 xìngjiàbǐ
Giá/báo giá:       询价 xúnjià · 报价 bàojià · 起订量 qǐdìngliàng
Đặt hàng/hợp đồng: 合同 hétong · 条款 tiáokuǎn · 违约 wéiyuē
Thanh toán:        付款 fùkuǎn · 定金 dìngjīn · 发票 fāpiào
Vận chuyển:        发货 fāhuò · 运费 yùnfèi · 提货 tíhuò
</code></pre>
<h3>Hội thoại tổng hợp</h3>
<pre><code>甲: 您好，很高兴认识您，这是我的名片。
    Nín hǎo, hěn gāoxìng rènshi nín, zhè shì wǒ de míngpiàn.
    Chào ngài, rất vui được biết ngài, đây là danh thiếp của tôi.

乙: 我们对贵公司的产品很感兴趣，可以先看一下样品和报价单吗？
    Wǒmen duì guì gōngsī de chǎnpǐn hěn gǎn xìngqù, kěyǐ xiān kàn yíxià yàngpǐn hé bàojiàdān ma?
    Chúng tôi rất quan tâm đến sản phẩm của công ty ngài, có thể xem hàng mẫu và bảng báo giá trước không?

甲: 当然，这是报价单，一千件的单价是八块钱，起订量是五百件。
    Dāngrán, zhè shì bàojiàdān, yìqiān jiàn de dānjià shì bā kuài qián, qǐdìngliàng shì wǔbǎi jiàn.
    Tất nhiên, đây là bảng báo giá, đơn giá cho 1.000 chiếc là 8 tệ, số lượng đặt tối thiểu là 500 chiếc.

乙: 好，我们决定下订单，麻烦准备合同，交货期定在三十天以内。
    Hǎo, wǒmen juédìng xià dìngdān, máfan zhǔnbèi hétong, jiāohuòqī dìng zài sānshí tiān yǐnèi.
    Được, chúng tôi quyết định đặt hàng, xin vui lòng chuẩn bị hợp đồng, thời hạn giao hàng trong vòng 30 ngày.

甲: 没问题，付款方式是先付三十定金，余款交货前付清，可以银行转账。
    Méi wèntí, fùkuǎn fāngshì shì xiān fù sānshí dìngjīn, yúkuǎn jiāohuò qián fùqīng, kěyǐ yínháng zhuǎnzhàng.
    Không vấn đề, phương thức thanh toán là trả trước 30% đặt cọc, số tiền còn lại thanh toán hết trước khi giao hàng, có thể chuyển khoản ngân hàng.

乙: 好的，货物包装好以后请尽快发货，谢谢！
    Hǎo de, huòwù bāozhuāng hǎo yǐhòu qǐng jǐnkuài fāhuò, xièxie!
    Được, sau khi hàng đóng gói xong xin vui lòng xuất hàng sớm nhất, xin cảm ơn!
</code></pre>
<div class="callout"><span class="badge">Quy trình giao dịch</span> Chào hỏi &amp; giới thiệu công ty → tiếp khách/hẹn gặp → giới thiệu sản phẩm → hỏi giá &amp; báo giá → đặt hàng &amp; hợp đồng → thanh toán → vận chuyển/giao hàng. Đây là bộ khung của gần như mọi giao dịch B2B bằng tiếng Trung.</div>`,
  ]]);

const c8q = quiz('cib301-quiz-8', 'Quiz 8 — Comprehensive review|||Quiz 8 — Ôn tập tổng hợp', [
  { id: 'q1', question: 'Trong quy trình giao dịch thương mại, bước nào diễn ra TRƯỚC "签合同" (ký hợp đồng)?', options: ['发货 (giao hàng)', '报价 (báo giá)', '付余款 (trả số tiền còn lại)', '提货 (nhận hàng)'], correctIndex: 1, explanation: 'Quy trình thường là: chào hỏi → báo giá → đặt hàng → ký hợp đồng → thanh toán → giao hàng.' },
  { id: 'q2', question: 'Câu "先付定金，余款交货前付清" mô tả điều gì?', options: ['Điều khoản giao hàng', 'Phương thức thanh toán', 'Điều khoản bảo hành', 'Điều khoản vi phạm hợp đồng'], correctIndex: 1, explanation: 'Câu này mô tả phương thức thanh toán: trả cọc trước, trả hết trước khi giao hàng.' },
  { id: 'q3', question: 'Từ nào KHÔNG thuộc nhóm từ vựng thanh toán?', options: ['发票', '定金', '快递', '汇率'], correctIndex: 2, explanation: '快递 (kuàidì, chuyển phát nhanh) thuộc nhóm vận chuyển, không thuộc nhóm thanh toán.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CIB301',
    slug: 'cib301-comprehensive-business-chinese-1',
    title: 'Comprehensive Business Chinese 1',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CIB301.webp',
    shortDescription: 'Business Chinese 1: greetings & company intros, hosting partners, product pitches, price quotes, orders/contracts, payment, basic shipping — Chinese characters, pinyin, Vietnamese/English meaning, vocabulary, dialogues & quizzes.|||Tiếng Trung Thương mại 1: chào hỏi & giới thiệu công ty, tiếp khách, giới thiệu sản phẩm, hỏi/báo giá, đặt hàng & hợp đồng, thanh toán, giao hàng cơ bản — chữ Hán, pinyin, nghĩa Việt/Anh, từ vựng, hội thoại & quiz.',
    description: 'Môn <strong>CIB301 — Comprehensive Business Chinese 1</strong> (kỳ 3, ngành Ngôn ngữ Trung) dạy tiếng Trung thương mại trình độ trung cấp (HSK3-4 + từ vựng thương mại). Từ <strong>chào hỏi &amp; giới thiệu công ty</strong> (公司, 名片) → <strong>tiếp khách &amp; hẹn gặp đối tác</strong> → <strong>giới thiệu sản phẩm &amp; dịch vụ</strong> → <strong>hỏi giá &amp; báo giá</strong> (询价, 报价) → <strong>đặt hàng &amp; ký hợp đồng</strong> → <strong>thanh toán</strong> → <strong>giao hàng &amp; vận chuyển</strong> → <strong>ôn tập tổng hợp</strong>. Mỗi chương có chữ Hán, pinyin có dấu thanh, nghĩa Việt/Anh, từ vựng, hội thoại thương mại và quiz.',
    whatYouLearn: 'Chào hỏi thương mại & trao danh thiếp; giới thiệu công ty/chức vụ (敝公司 vs 贵公司); tiếp khách & hẹn gặp (预约, 会议室); giới thiệu sản phẩm & dịch vụ (特点, 优势, 样品); hỏi giá & báo giá (单价, 优惠, 起订量); đặt hàng & hợp đồng (条款, 交货期, 违约); thanh toán (定金, 余款, 汇率); giao hàng & vận chuyển (发货, 运费, 提货); hội thoại thương mại tổng hợp theo từ vựng HSK3-4.',
    requirements: 'Đã học tiếng Trung cơ bản tương đương HSK2-3 (đọc/viết chữ Hán cơ bản, ngữ pháp sơ cấp). Xem điều kiện tiên quyết chính thức trong khung chương trình ngành Ngôn ngữ Trung trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình trích dẫn, tài liệu HSK, từ điển, công cụ, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Chương 1 — Chào hỏi & giới thiệu công ty|||Chapter 1 — Greetings & company introduction', description: 'Chào hỏi, trao danh thiếp, giới thiệu công ty & chức vụ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tiếp khách & hẹn gặp đối tác|||Chapter 2 — Hosting guests & meetings', description: 'Đón khách, xác nhận hẹn, mời ngồi, phòng họp.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Giới thiệu sản phẩm & dịch vụ|||Chapter 3 — Presenting products & services', description: 'Đặc điểm, ưu thế, hàng mẫu, sách hướng dẫn.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Hỏi giá & báo giá|||Chapter 4 — Price inquiry & quotation', description: 'Đơn giá, chiết khấu, số lượng đặt tối thiểu, báo giá.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đặt hàng & hợp đồng|||Chapter 5 — Orders & contracts', description: 'Đơn hàng, ký hợp đồng, điều khoản, vi phạm hợp đồng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thanh toán & phương thức chi trả|||Chapter 6 — Payment & methods', description: 'Đặt cọc, số tiền còn lại, hóa đơn, chuyển khoản, tỷ giá.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Giao hàng & vận chuyển|||Chapter 7 — Delivery & shipping', description: 'Xuất hàng, đóng gói, phí vận chuyển, kho, nhận hàng.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập tổng hợp|||Chapter 8 — Comprehensive review', description: 'Từ vựng 7 chương theo chủ đề, hội thoại tổng hợp.', lessons: [c8, c8q] },
  ],
};
