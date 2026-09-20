/**
 * CIC303 — Comprehensive Chinese 5 / Tiếng Trung Quốc tổng hợp 5. Ngành Ngôn
 * ngữ Trung, FPTU, Kỳ 3. Trình độ HSK5→6: xã hội, kinh tế & toàn cầu hoá,
 * khoa học & công nghệ, lịch sử & tư tưởng, văn học & nghệ thuật, báo chí &
 * nghị luận, thành ngữ & văn hoá sâu, ôn tập HSK6. Chữ Hán UTF-8 + pinyin có
 * dấu thanh thật + nghĩa Việt/Anh. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick lồng/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('cic303-1-1-society-issues', '1.1 — Society & contemporary issues|||1.1 — Xã hội & các vấn đề đương đại',
  'Từ vựng học thuật về xã hội (khoảng cách giàu nghèo, lão hoá dân số, đô thị hoá); mẫu câu 随着…, 不仅…而且…, 尽管…但是…, 就…而言.',
  [[
    `<span class="eyebrow">CIC303 · Chapter 1 · Lesson 1.1</span>
<h2>Society &amp; contemporary issues</h2>
<p class="lead">At HSK5-6 you move from everyday vocabulary to <strong>abstract, academic Chinese</strong> — the register used to discuss social phenomena: the wealth gap, an aging population, urbanization, employment pressure and social welfare. This lesson builds the vocabulary and sentence frames needed to describe and argue about these issues.</p>
<h3>Key vocabulary (HSK5-6)</h3>
<pre><code>社会现象   shèhuì xiànxiàng     social phenomenon
贫富差距   pín fù chājù         wealth gap (rich-poor divide)
人口老龄化 rénkǒu lǎolínghuà    population aging
城市化    chéngshìhuà          urbanization
就业压力   jiùyè yālì           employment pressure
竞争     jìngzhēng             competition
焦虑     jiāolǜ                anxiety
福利     fúlì                  welfare
养老金    yǎnglǎojīn            pension
社会保障   shèhuì bǎozhàng       social security
弱势群体   ruòshì qúntǐ          vulnerable group
志愿者    zhìyuànzhě            volunteer
可持续发展 kě chíxù fāzhǎn       sustainable development
</code></pre>
<h3>Grammar &amp; sentence patterns</h3>
<ul>
<li><strong>随着…的发展/提高</strong> (suízhe…de fāzhǎn/tígāo) — "as … develops/improves". Introduces a background trend that causes a following result.</li>
<li><strong>不仅…而且…</strong> (bùjǐn…érqiě…) — "not only… but also…", linking two escalating clauses.</li>
<li><strong>尽管…但是…</strong> (jǐnguǎn…dànshì…) — "although… (yet) still…", concession followed by contrast.</li>
<li><strong>就…而言</strong> (jiù…éryán) — "as far as … is concerned", narrowing the scope of a claim.</li>
</ul>
<h3>Worked example</h3>
<pre><code>随着城市化的发展，人口老龄化问题日益严重，
这不仅给社会保障体系带来压力，而且也影响到
年轻一代的就业竞争。

Suízhe chéngshìhuà de fāzhǎn, rénkǒu lǎolínghuà wèntí
rìyì yánzhòng, zhè bùjǐn gěi shèhuì bǎozhàng tǐxì
dàilái yālì, érqiě yě yǐngxiǎng dào niánqīng yídài
de jiùyè jìngzhēng.

"As urbanization advances, population aging is becoming
increasingly severe — this not only pressures the social
security system, but also affects the younger generation's
employment competition."
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> HSK6 writing and speaking tasks reward exactly this shape: state a trend with <strong>随着…</strong>, then unpack <em>two</em> consequences with <strong>不仅…而且…</strong>. Memorize the frame, not just the words inside it.</div>`,
    `<span class="eyebrow">CIC303 · Chương 1 · Bài 1.1</span>
<h2>Xã hội &amp; các vấn đề đương đại</h2>
<p class="lead">Ở trình độ HSK5-6, bạn chuyển từ từ vựng đời thường sang <strong>tiếng Trung trừu tượng, học thuật</strong> — văn phong dùng để bàn về các hiện tượng xã hội: khoảng cách giàu nghèo, lão hoá dân số, đô thị hoá, áp lực việc làm và phúc lợi xã hội. Bài học xây dựng từ vựng và khung câu để mô tả, lập luận về những vấn đề này.</p>
<h3>Từ vựng trọng tâm (HSK5-6)</h3>
<pre><code>社会现象   shèhuì xiànxiàng     hiện tượng xã hội
贫富差距   pín fù chājù         khoảng cách giàu nghèo
人口老龄化 rénkǒu lǎolínghuà    lão hoá dân số
城市化    chéngshìhuà          đô thị hoá
就业压力   jiùyè yālì           áp lực việc làm
竞争     jìngzhēng             cạnh tranh
焦虑     jiāolǜ                lo âu
福利     fúlì                  phúc lợi
养老金    yǎnglǎojīn            lương hưu
社会保障   shèhuì bǎozhàng       an sinh xã hội
弱势群体   ruòshì qúntǐ          nhóm yếu thế
志愿者    zhìyuànzhě            tình nguyện viên
可持续发展 kě chíxù fāzhǎn       phát triển bền vững
</code></pre>
<h3>Ngữ pháp &amp; mẫu câu</h3>
<ul>
<li><strong>随着…的发展/提高</strong> (suízhe…de fāzhǎn/tígāo) — "cùng với sự phát triển/nâng cao của…". Nêu một xu hướng nền làm nảy sinh kết quả phía sau.</li>
<li><strong>不仅…而且…</strong> (bùjǐn…érqiě…) — "không những… mà còn…", nối hai vế tăng tiến.</li>
<li><strong>尽管…但是…</strong> (jǐnguǎn…dànshì…) — "mặc dù… nhưng…", nhượng bộ rồi tương phản.</li>
<li><strong>就…而言</strong> (jiù…éryán) — "xét về mặt…", thu hẹp phạm vi của một nhận định.</li>
</ul>
<h3>Ví dụ minh hoạ</h3>
<pre><code>随着城市化的发展，人口老龄化问题日益严重，
这不仅给社会保障体系带来压力，而且也影响到
年轻一代的就业竞争。

Suízhe chéngshìhuà de fāzhǎn, rénkǒu lǎolínghuà wèntí
rìyì yánzhòng, zhè bùjǐn gěi shèhuì bǎozhàng tǐxì
dàilái yālì, érqiě yě yǐngxiǎng dào niánqīng yídài
de jiùyè jìngzhēng.

"Cùng với sự phát triển của đô thị hoá, vấn đề lão hoá
dân số ngày càng nghiêm trọng, điều này không những gây
áp lực cho hệ thống an sinh xã hội, mà còn ảnh hưởng đến
cạnh tranh việc làm của thế hệ trẻ."
</code></pre>
<div class="callout"><span class="badge">Mẹo thi</span> Bài viết/nói HSK6 chấm điểm cao đúng khung này: nêu xu hướng bằng <strong>随着…</strong>, rồi tách <em>hai</em> hệ quả bằng <strong>不仅…而且…</strong>. Học thuộc cái khung, không chỉ từ vựng bên trong.</div>`,
  ]]);

const c1q = quiz('cic303-quiz-1', 'Quiz 1 — Society & issues|||Quiz 1 — Xã hội & vấn đề', [
  { id: 'q1', question: '"贫富差距" nghĩa là gì?', options: ['Tăng trưởng kinh tế', 'Khoảng cách giàu nghèo', 'Lão hoá dân số', 'An sinh xã hội'], correctIndex: 1, explanation: '贫(nghèo)+富(giàu)+差距(khoảng cách) → khoảng cách giàu nghèo.' },
  { id: 'q2', question: 'Mẫu câu "不仅…而且…" dùng để làm gì?', options: ['So sánh hơn kém', 'Nối hai vế tăng tiến (không những… mà còn…)', 'Diễn tả điều kiện', 'Diễn tả nhượng bộ'], correctIndex: 1, explanation: '不仅…而且… là cấu trúc tăng tiến, thêm ý thứ hai mạnh hơn ý đầu.' },
  { id: 'q3', question: 'Từ nào có nghĩa "phát triển bền vững"?', options: ['可持续发展', '社会保障', '就业压力', '弱势群体'], correctIndex: 0, explanation: '可持续(bền vững, có thể duy trì)+发展(phát triển) = phát triển bền vững.' },
]);

const c2 = doc('cic303-2-1-economy-globalization', '2.1 — Economy, trade & globalization|||2.1 — Kinh tế, thương mại & toàn cầu hoá',
  'Từ vựng kinh tế học thuật (lạm phát, tỷ giá, thâm hụt/thặng dư thương mại, chuỗi cung ứng); mẫu câu 一方面…另一方面…, 无论…都…, 由于…因此….',
  [[
    `<span class="eyebrow">CIC303 · Chapter 2 · Lesson 2.1</span>
<h2>Economy, trade &amp; globalization</h2>
<p class="lead">Business news, economic commentary and HSK6 reading passages share one register: precise terms for growth, inflation, trade and global supply chains, wrapped in balanced two-part sentence frames. This lesson trains both.</p>
<h3>Key vocabulary (HSK5-6)</h3>
<pre><code>经济增长   jīngjì zēngzhǎng     economic growth
通货膨胀   tōnghuò péngzhàng    inflation
汇率      huìlǜ                exchange rate
贸易顺差   màoyì shùnchā        trade surplus
贸易逆差   màoyì nìchā          trade deficit
关税      guānshuì             tariff
自由贸易   zìyóu màoyì          free trade
全球化     quánqiúhuà           globalization
产业链     chǎnyèliàn           industry chain
供应链     gōngyìngliàn         supply chain
金融危机   jīnróng wēijī        financial crisis
内需      nèixū                domestic demand
竞争力     jìngzhēnglì          competitiveness
</code></pre>
<h3>Grammar &amp; sentence patterns</h3>
<ul>
<li><strong>一方面…另一方面…</strong> (yī fāngmiàn…lìng yī fāngmiàn…) — "on one hand… on the other hand…", presenting two facets of one issue, not a contradiction.</li>
<li><strong>无论…都…</strong> (wúlùn…dōu…) — "no matter (what/how)… always…", stating a result that holds under any condition.</li>
<li><strong>由于…因此…</strong> (yóuyú…yīncǐ…) — "because of…, therefore…", formal cause-effect linking, more written/academic than 因为…所以….</li>
</ul>
<h3>Worked example</h3>
<pre><code>由于全球化的深入发展，各国经济联系日益紧密；
一方面，自由贸易促进了资源的优化配置，
另一方面，贸易逆差和关税壁垒也带来了新的挑战。

Yóuyú quánqiúhuà de shēnrù fāzhǎn, gèguó jīngjì liánxì
rìyì jǐnmì; yī fāngmiàn, zìyóu màoyì cùjìnle zīyuán de
yōuhuà pèizhì, lìng yī fāngmiàn, màoyì nìchā hé guānshuì
bìlěi yě dàiláile xīn de tiǎozhàn.

"As globalization deepens, economies grow more closely
tied together; on one hand free trade improves how
resources are allocated, on the other hand trade deficits
and tariff barriers bring new challenges too."
</code></pre>
<div class="callout"><span class="badge">Register note</span> 由于…因此… reads as formal/written Chinese — the kind that appears in news commentary and HSK6 passages. 因为…所以… is the everyday spoken equivalent; know both, but produce the formal one in essays.</div>`,
    `<span class="eyebrow">CIC303 · Chương 2 · Bài 2.1</span>
<h2>Kinh tế, thương mại &amp; toàn cầu hoá</h2>
<p class="lead">Tin kinh tế, bình luận thời sự và bài đọc HSK6 dùng chung một văn phong: thuật ngữ chính xác về tăng trưởng, lạm phát, thương mại, chuỗi cung ứng toàn cầu, gói trong các khung câu hai vế cân đối. Bài học rèn cả hai.</p>
<h3>Từ vựng trọng tâm (HSK5-6)</h3>
<pre><code>经济增长   jīngjì zēngzhǎng     tăng trưởng kinh tế
通货膨胀   tōnghuò péngzhàng    lạm phát
汇率      huìlǜ                tỷ giá hối đoái
贸易顺差   màoyì shùnchā        thặng dư thương mại
贸易逆差   màoyì nìchā          thâm hụt thương mại
关税      guānshuì             thuế quan
自由贸易   zìyóu màoyì          thương mại tự do
全球化     quánqiúhuà           toàn cầu hoá
产业链     chǎnyèliàn           chuỗi sản xuất
供应链     gōngyìngliàn         chuỗi cung ứng
金融危机   jīnróng wēijī        khủng hoảng tài chính
内需      nèixū                nhu cầu nội địa
竞争力     jìngzhēnglì          năng lực cạnh tranh
</code></pre>
<h3>Ngữ pháp &amp; mẫu câu</h3>
<ul>
<li><strong>一方面…另一方面…</strong> (yī fāngmiàn…lìng yī fāngmiàn…) — "một mặt… mặt khác…", trình bày hai khía cạnh của cùng một vấn đề, không phải mâu thuẫn.</li>
<li><strong>无论…都…</strong> (wúlùn…dōu…) — "dù… (thế nào)… đều…", nêu kết quả đúng trong mọi điều kiện.</li>
<li><strong>由于…因此…</strong> (yóuyú…yīncǐ…) — "do…, vì vậy…", liên kết nhân-quả trang trọng, mang tính văn viết/học thuật hơn 因为…所以….</li>
</ul>
<h3>Ví dụ minh hoạ</h3>
<pre><code>由于全球化的深入发展，各国经济联系日益紧密；
一方面，自由贸易促进了资源的优化配置，
另一方面，贸易逆差和关税壁垒也带来了新的挑战。

Yóuyú quánqiúhuà de shēnrù fāzhǎn, gèguó jīngjì liánxì
rìyì jǐnmì; yī fāngmiàn, zìyóu màoyì cùjìnle zīyuán de
yōuhuà pèizhì, lìng yī fāngmiàn, màoyì nìchā hé guānshuì
bìlěi yě dàiláile xīn de tiǎozhàn.

"Do toàn cầu hoá phát triển sâu rộng, mối liên hệ kinh
tế giữa các nước ngày càng chặt chẽ; một mặt, thương mại
tự do thúc đẩy tối ưu hoá phân bổ nguồn lực, mặt khác,
thâm hụt thương mại và rào cản thuế quan cũng mang lại
thách thức mới."
</code></pre>
<div class="callout"><span class="badge">Lưu ý văn phong</span> 由于…因此… là văn viết/trang trọng — loại xuất hiện trong bình luận thời sự và bài đọc HSK6. 因为…所以… là bản khẩu ngữ đời thường tương đương; biết cả hai, nhưng dùng bản trang trọng khi viết luận.</div>`,
  ]]);

const c2q = quiz('cic303-quiz-2', 'Quiz 2 — Economy & globalization|||Quiz 2 — Kinh tế & toàn cầu hoá', [
  { id: 'q1', question: '"贸易逆差" nghĩa là gì?', options: ['Thặng dư thương mại', 'Thâm hụt thương mại', 'Tỷ giá hối đoái', 'Lạm phát'], correctIndex: 1, explanation: '逆差(nghịch/ngược) → nhập nhiều hơn xuất, tức thâm hụt thương mại; ngược lại 顺差 là thặng dư.' },
  { id: 'q2', question: 'Cấu trúc "一方面…另一方面…" dùng để làm gì?', options: ['Liệt kê hai mặt của cùng một vấn đề', 'Diễn tả nguyên nhân — kết quả', 'So sánh hơn kém', 'Diễn tả trình tự thời gian'], correctIndex: 0, explanation: 'Cấu trúc trình bày hai khía cạnh song song của một sự việc, không phải quan hệ đối lập.' },
  { id: 'q3', question: '"由于…因此…" biểu thị quan hệ gì?', options: ['Tương phản', 'Nhân — quả (trang trọng)', 'Lựa chọn', 'Song song ngang hàng'], correctIndex: 1, explanation: '由于(do) nêu nguyên nhân, 因此(vì vậy) nêu kết quả — quan hệ nhân quả ở văn phong trang trọng.' },
]);

const c3 = doc('cic303-3-1-science-technology', '3.1 — Science, technology & the future|||3.1 — Khoa học, công nghệ & tương lai',
  'Từ vựng công nghệ (AI, dữ liệu lớn, điện toán đám mây, năng lượng tái tạo); mẫu câu 一旦…就…, 除非…否则…, 之所以…是因为….',
  [[
    `<span class="eyebrow">CIC303 · Chapter 3 · Lesson 3.1</span>
<h2>Science, technology &amp; the future</h2>
<p class="lead">Discussing artificial intelligence, big data and renewable energy in Chinese requires both technical nouns and the logical connectors that let you reason about conditions and causes — exactly what HSK6 argumentative essays test.</p>
<h3>Key vocabulary (HSK5-6)</h3>
<pre><code>人工智能   réngōng zhìnéng      artificial intelligence
大数据     dà shùjù             big data
云计算     yún jìsuàn           cloud computing
虚拟现实   xūnǐ xiànshí         virtual reality
基因工程   jīyīn gōngchéng      genetic engineering
可再生能源 kě zàishēng néngyuán renewable energy
航天技术   hángtiān jìshù       aerospace technology
自动化     zìdònghuà            automation
量子计算   liàngzǐ jìsuàn       quantum computing
数字化转型 shùzìhuà zhuǎnxíng   digital transformation
</code></pre>
<h3>Grammar &amp; sentence patterns</h3>
<ul>
<li><strong>一旦…就…</strong> (yídàn…jiù…) — "once… then (immediately)…", a single trigger leading straight to a result.</li>
<li><strong>除非…否则…</strong> (chúfēi…fǒuzé…) — "unless…, otherwise…", the only exception that avoids a negative outcome.</li>
<li><strong>之所以…是因为…</strong> (zhī suǒyǐ…shì yīnwèi…) — "the reason why… is because…", puts the result first, then explains the cause — common in analytical writing.</li>
</ul>
<h3>Worked example</h3>
<pre><code>人工智能之所以能够改变未来，是因为它一旦与
大数据和云计算结合，就能大幅提高各行各业的
自动化水平；然而，除非我们建立完善的伦理
规范，否则技术滥用的风险将不断增加。

Réngōng zhìnéng zhī suǒyǐ nénggòu gǎibiàn wèilái, shì
yīnwèi tā yídàn yǔ dà shùjù hé yún jìsuàn jiéhé, jiù néng
dàfú tígāo gè háng gè yè de zìdònghuà shuǐpíng; rán'ér,
chúfēi wǒmen jiànlì wánshàn de lúnlǐ guīfàn, fǒuzé jìshù
lànyòng de fēngxiǎn jiāng bùduàn zēngjiā.

"The reason AI can reshape the future is that once it
combines with big data and cloud computing, it can sharply
raise automation across every industry; however, unless we
build sound ethical standards, the risk of technology
misuse will keep growing."
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> 之所以…是因为… is the safest way to answer a HSK6 "why" question in writing — it forces you to state the claim first, then the cause, which examiners can follow at a glance.</div>`,
    `<span class="eyebrow">CIC303 · Chương 3 · Bài 3.1</span>
<h2>Khoa học, công nghệ &amp; tương lai</h2>
<p class="lead">Bàn về trí tuệ nhân tạo, dữ liệu lớn và năng lượng tái tạo bằng tiếng Trung đòi hỏi cả danh từ kỹ thuật lẫn các liên từ lập luận để nói về điều kiện và nguyên nhân — đúng thứ bài luận nghị luận HSK6 kiểm tra.</p>
<h3>Từ vựng trọng tâm (HSK5-6)</h3>
<pre><code>人工智能   réngōng zhìnéng      trí tuệ nhân tạo
大数据     dà shùjù             dữ liệu lớn
云计算     yún jìsuàn           điện toán đám mây
虚拟现实   xūnǐ xiànshí         thực tế ảo
基因工程   jīyīn gōngchéng      công nghệ di truyền
可再生能源 kě zàishēng néngyuán năng lượng tái tạo
航天技术   hángtiān jìshù       công nghệ hàng không vũ trụ
自动化     zìdònghuà            tự động hoá
量子计算   liàngzǐ jìsuàn       điện toán lượng tử
数字化转型 shùzìhuà zhuǎnxíng   chuyển đổi số
</code></pre>
<h3>Ngữ pháp &amp; mẫu câu</h3>
<ul>
<li><strong>一旦…就…</strong> (yídàn…jiù…) — "một khi… thì (ngay lập tức)…", một tác nhân duy nhất dẫn thẳng tới kết quả.</li>
<li><strong>除非…否则…</strong> (chúfēi…fǒuzé…) — "trừ khi…, nếu không thì…", điều kiện ngoại lệ duy nhất tránh được hậu quả xấu.</li>
<li><strong>之所以…是因为…</strong> (zhī suǒyǐ…shì yīnwèi…) — "sở dĩ… là vì…", nêu kết quả trước rồi giải thích nguyên nhân — thường gặp trong văn phân tích.</li>
</ul>
<h3>Ví dụ minh hoạ</h3>
<pre><code>人工智能之所以能够改变未来，是因为它一旦与
大数据和云计算结合，就能大幅提高各行各业的
自动化水平；然而，除非我们建立完善的伦理
规范，否则技术滥用的风险将不断增加。

Réngōng zhìnéng zhī suǒyǐ nénggòu gǎibiàn wèilái, shì
yīnwèi tā yídàn yǔ dà shùjù hé yún jìsuàn jiéhé, jiù néng
dàfú tígāo gè háng gè yè de zìdònghuà shuǐpíng; rán'ér,
chúfēi wǒmen jiànlì wánshàn de lúnlǐ guīfàn, fǒuzé jìshù
lànyòng de fēngxiǎn jiāng bùduàn zēngjiā.

"Sở dĩ trí tuệ nhân tạo có thể thay đổi tương lai là vì
một khi nó kết hợp với dữ liệu lớn và điện toán đám mây,
nó có thể nâng cao đáng kể mức độ tự động hoá của mọi
ngành nghề; tuy nhiên, trừ khi chúng ta xây dựng được
chuẩn mực đạo đức hoàn thiện, nếu không nguy cơ lạm dụng
công nghệ sẽ không ngừng gia tăng."
</code></pre>
<div class="callout"><span class="badge">Mẹo thi</span> 之所以…是因为… là cách an toàn nhất để trả lời câu hỏi "tại sao" trong bài viết HSK6 — buộc bạn nêu luận điểm trước rồi mới đến nguyên nhân, giám khảo theo dõi được ngay.</div>`,
  ]]);

const c3q = quiz('cic303-quiz-3', 'Quiz 3 — Science & technology|||Quiz 3 — Khoa học & công nghệ', [
  { id: 'q1', question: '"人工智能" là gì?', options: ['Dữ liệu lớn', 'Trí tuệ nhân tạo', 'Điện toán đám mây', 'Năng lượng tái tạo'], correctIndex: 1, explanation: '人工(nhân tạo)+智能(trí tuệ) = trí tuệ nhân tạo (AI).' },
  { id: 'q2', question: 'Mẫu "一旦…就…" nghĩa là gì?', options: ['Một khi… thì…', 'Trừ khi… nếu không…', 'Mặc dù… nhưng…', 'Không những… mà còn…'], correctIndex: 0, explanation: '一旦(một khi) nêu tác nhân, 就(thì) nêu kết quả xảy ra ngay sau đó.' },
  { id: 'q3', question: 'Cấu trúc "之所以…是因为…" dùng để làm gì?', options: ['Nêu kết quả trước rồi giải thích nguyên nhân', 'Nêu điều kiện duy nhất', 'Diễn tả sự tương phản', 'Diễn tả trình tự thời gian'], correctIndex: 0, explanation: '之所以(sở dĩ) đặt trước kết quả/luận điểm, 是因为(là vì) mới nêu nguyên nhân phía sau.' },
]);

const c4 = doc('cic303-4-1-history-thought', '4.1 — Chinese history & thought|||4.1 — Lịch sử & tư tưởng Trung Hoa',
  'Các triều đại, Nho-Đạo-Pháp gia, chế độ khoa cử, Con đường tơ lụa, Tứ đại phát minh, cải cách mở cửa; mẫu câu 从…到…, 与其…不如….',
  [[
    `<span class="eyebrow">CIC303 · Chapter 4 · Lesson 4.1</span>
<h2>Chinese history &amp; thought</h2>
<p class="lead">A working vocabulary of dynasties, philosophical schools and landmark institutions lets you read historical texts and cultural commentary without stumbling on the same ten proper nouns every time.</p>
<h3>Key vocabulary (HSK5-6)</h3>
<pre><code>朝代      cháodài              dynasty
儒家      rújiā                Confucianism
道家      dàojiā               Daoism
法家      fǎjiā                Legalism
诸子百家   zhūzǐ bǎijiā         the Hundred Schools of Thought
封建社会   fēngjiàn shèhuì      feudal society
科举制度   kējǔ zhìdù           imperial examination system
丝绸之路   sīchóu zhī lù        the Silk Road
四大发明   sì dà fāmíng         the Four Great Inventions
改革开放   gǎigé kāifàng        Reform and Opening-up
</code></pre>
<h3>Grammar &amp; sentence patterns</h3>
<ul>
<li><strong>从…到…</strong> (cóng…dào…) — "from… to…", tracing change across a span of time or stages.</li>
<li><strong>与其…不如…</strong> (yǔqí…bùrú…) — "rather than…, it is better to…", comparing two options and recommending the second.</li>
<li><strong>可以说…</strong> (kěyǐ shuō…) — "it can be said that…", a hedged, academic way to state an interpretation.</li>
</ul>
<h3>Worked example</h3>
<pre><code>从春秋战国的诸子百家到汉代以后儒家思想的独尊
地位，中国传统思想经历了漫长的演变；与其说
这是单一学派的胜利，不如说是历史与社会现实
共同选择的结果。

Cóng Chūnqiū Zhànguó de zhūzǐ bǎijiā dào Hàndài yǐhòu
rújiā sīxiǎng de dúzūn dìwèi, Zhōngguó chuántǒng sīxiǎng
jīnglìle màncháng de yǎnbiàn; yǔqí shuō zhè shì dānyī
xuépài de shènglì, bùrú shuō shì lìshǐ yǔ shèhuì xiànshí
gòngtóng xuǎnzé de jiéguǒ.

"From the Hundred Schools of the Spring and Autumn/
Warring States period to Confucianism's dominance after
the Han dynasty, Chinese traditional thought went through
a long evolution; rather than the victory of one single
school, it is better described as the joint outcome of
history and social reality."
</code></pre>
<div class="callout"><span class="badge">Culture note</span> 诸子百家 names an entire era of competing philosophies (Confucian, Daoist, Legalist, Mohist and more) — don't translate it as one "school"; it is the plural field they all belong to.</div>`,
    `<span class="eyebrow">CIC303 · Chương 4 · Bài 4.1</span>
<h2>Lịch sử &amp; tư tưởng Trung Hoa</h2>
<p class="lead">Vốn từ vững về các triều đại, trường phái tư tưởng và thiết chế mang tính bước ngoặt giúp bạn đọc văn bản lịch sử và bình luận văn hoá mà không vấp phải cùng mười danh từ riêng mỗi lần.</p>
<h3>Từ vựng trọng tâm (HSK5-6)</h3>
<pre><code>朝代      cháodài              triều đại
儒家      rújiā                Nho gia
道家      dàojiā               Đạo gia
法家      fǎjiā                Pháp gia
诸子百家   zhūzǐ bǎijiā         chư tử bách gia
封建社会   fēngjiàn shèhuì      xã hội phong kiến
科举制度   kējǔ zhìdù           chế độ khoa cử
丝绸之路   sīchóu zhī lù        Con đường tơ lụa
四大发明   sì dà fāmíng         Tứ đại phát minh
改革开放   gǎigé kāifàng        cải cách mở cửa
</code></pre>
<h3>Ngữ pháp &amp; mẫu câu</h3>
<ul>
<li><strong>从…到…</strong> (cóng…dào…) — "từ… đến…", theo dõi sự biến đổi qua một khoảng thời gian hoặc các giai đoạn.</li>
<li><strong>与其…不如…</strong> (yǔqí…bùrú…) — "thà… còn hơn…", so sánh hai lựa chọn và nghiêng về lựa chọn thứ hai.</li>
<li><strong>可以说…</strong> (kěyǐ shuō…) — "có thể nói rằng…", cách nêu một cách diễn giải mang tính thận trọng, học thuật.</li>
</ul>
<h3>Ví dụ minh hoạ</h3>
<pre><code>从春秋战国的诸子百家到汉代以后儒家思想的独尊
地位，中国传统思想经历了漫长的演变；与其说
这是单一学派的胜利，不如说是历史与社会现实
共同选择的结果。

Cóng Chūnqiū Zhànguó de zhūzǐ bǎijiā dào Hàndài yǐhòu
rújiā sīxiǎng de dúzūn dìwèi, Zhōngguó chuántǒng sīxiǎng
jīnglìle màncháng de yǎnbiàn; yǔqí shuō zhè shì dānyī
xuépài de shènglì, bùrú shuō shì lìshǐ yǔ shèhuì xiànshí
gòngtóng xuǎnzé de jiéguǒ.

"Từ chư tử bách gia thời Xuân Thu Chiến Quốc đến vị thế
độc tôn của Nho gia sau thời Hán, tư tưởng truyền thống
Trung Hoa đã trải qua một quá trình biến đổi dài lâu; thà
nói đây là kết quả lựa chọn chung của lịch sử và thực tế
xã hội, còn hơn nói đó là chiến thắng của riêng một
trường phái."
</code></pre>
<div class="callout"><span class="badge">Ghi chú văn hoá</span> 诸子百家 gọi tên cả một thời đại nhiều trường phái tư tưởng cạnh tranh (Nho, Đạo, Pháp, Mặc…) — đừng dịch thành "một trường phái"; đó là cả một lĩnh vực số nhiều mà các trường phái ấy thuộc về.</div>`,
  ]]);

const c4q = quiz('cic303-quiz-4', 'Quiz 4 — History & thought|||Quiz 4 — Lịch sử & tư tưởng', [
  { id: 'q1', question: '"儒家" là trường phái tư tưởng nào?', options: ['Pháp gia', 'Đạo gia', 'Nho gia', 'Mặc gia'], correctIndex: 2, explanation: '儒家 (rújiā) là Nho gia, do Khổng Tử sáng lập.' },
  { id: 'q2', question: '"科举制度" là gì?', options: ['Con đường tơ lụa', 'Chế độ khoa cử', 'Tứ đại phát minh', 'Cải cách mở cửa'], correctIndex: 1, explanation: '科举(khoa cử)+制度(chế độ) = hệ thống thi cử tuyển quan lại thời phong kiến.' },
  { id: 'q3', question: 'Cấu trúc "与其…不如…" biểu thị điều gì?', options: ['Càng…càng…', 'Thà…còn hơn… (so sánh, nghiêng về lựa chọn sau)', 'Không những…mà còn…', 'Một khi…thì…'], correctIndex: 1, explanation: '与其(thà)…不如(còn hơn/chi bằng)… so sánh hai phương án và chọn phương án thứ hai.' },
]);

const c5 = doc('cic303-5-1-literature-art', '5.1 — Advanced literature & art|||5.1 — Văn học & nghệ thuật nâng cao',
  'Ý cảnh, thủ pháp tu từ, thư pháp, tranh thuỷ mặc, kinh kịch; mẫu câu 借景抒情, 富有…色彩, phân tích ẩn dụ &amp; biểu tượng.',
  [[
    `<span class="eyebrow">CIC303 · Chapter 5 · Lesson 5.1</span>
<h2>Advanced literature &amp; art</h2>
<p class="lead">Reading Chinese poetry and prose critically means naming <em>how</em> a text produces its effect, not just what it says. This lesson gives you the vocabulary of literary analysis and the visual arts that often accompany it.</p>
<h3>Key vocabulary (HSK5-6)</h3>
<pre><code>古典文学   gǔdiǎn wénxué        classical literature
诗词      shīcí                classical poetry (shi &amp; ci forms)
散文      sǎnwén               prose / essay
意境      yìjìng               artistic mood / conception
修辞手法   xiūcí shǒufǎ         rhetorical device
象征      xiàngzhēng           symbol, symbolism
隐喻      yǐnyù                metaphor
书法      shūfǎ                calligraphy
水墨画     shuǐmòhuà            ink wash painting
京剧      jīngjù               Peking opera
</code></pre>
<h3>Grammar &amp; sentence patterns</h3>
<ul>
<li><strong>借景抒情</strong> (jiè jǐng shū qíng) — "borrowing scenery to express feeling", the classic technique where landscape description carries the poet's emotion.</li>
<li><strong>富有…色彩</strong> (fùyǒu…sècǎi) — "rich in a … flavor/color", used to characterize a work's tone (e.g. 富有浪漫色彩 "richly romantic").</li>
<li><strong>不禁…起来</strong> (bùjīn…qǐlái) — "cannot help but (start to)…", describing a spontaneous emotional reaction while reading.</li>
</ul>
<h3>Worked example</h3>
<pre><code>这首诗借景抒情，通过对山水的描写，含蓄地
表达了诗人对故乡的思念，读来令人不禁感慨
万千。

Zhè shǒu shī jiè jǐng shū qíng, tōngguò duì shānshuǐ
de miáoxiě, hánxù de biǎodále shīrén duì gùxiāng de
sīniàn, dú lái lìng rén bùjīn gǎnkǎi wànqiān.

"This poem borrows scenery to express feeling: through
its depiction of mountains and rivers, it subtly conveys
the poet's longing for home, leaving the reader unable to
help feeling deeply moved."
</code></pre>
<div class="callout"><span class="badge">Analysis tip</span> When an HSK6 reading passage asks "what technique does the author use", scan for landscape/object description paired with an emotional word nearby — that pairing is almost always 借景抒情 or 象征.</div>`,
    `<span class="eyebrow">CIC303 · Chương 5 · Bài 5.1</span>
<h2>Văn học &amp; nghệ thuật nâng cao</h2>
<p class="lead">Đọc hiểu thơ văn Trung Quốc ở mức phê bình nghĩa là gọi tên được <em>cách</em> văn bản tạo ra hiệu ứng, không chỉ nội dung nó nói. Bài học cung cấp từ vựng phân tích văn học và các loại hình nghệ thuật thị giác thường đi kèm.</p>
<h3>Từ vựng trọng tâm (HSK5-6)</h3>
<pre><code>古典文学   gǔdiǎn wénxué        văn học cổ điển
诗词      shīcí                thơ từ cổ điển (thể thi &amp; từ)
散文      sǎnwén               tản văn
意境      yìjìng               ý cảnh / tứ thơ
修辞手法   xiūcí shǒufǎ         thủ pháp tu từ
象征      xiàngzhēng           biểu tượng, tượng trưng
隐喻      yǐnyù                ẩn dụ
书法      shūfǎ                thư pháp
水墨画     shuǐmòhuà            tranh thuỷ mặc
京剧      jīngjù               kinh kịch
</code></pre>
<h3>Ngữ pháp &amp; mẫu câu</h3>
<ul>
<li><strong>借景抒情</strong> (jiè jǐng shū qíng) — "mượn cảnh để tả tình", thủ pháp kinh điển: miêu tả cảnh vật để chuyên chở cảm xúc của người viết.</li>
<li><strong>富有…色彩</strong> (fùyǒu…sècǎi) — "giàu chất/màu sắc…", dùng để nêu đặc điểm giọng điệu tác phẩm (vd 富有浪漫色彩 "giàu chất lãng mạn").</li>
<li><strong>不禁…起来</strong> (bùjīn…qǐlái) — "không kìm được mà…", diễn tả phản ứng cảm xúc tự nhiên khi đọc.</li>
</ul>
<h3>Ví dụ minh hoạ</h3>
<pre><code>这首诗借景抒情，通过对山水的描写，含蓄地
表达了诗人对故乡的思念，读来令人不禁感慨
万千。

Zhè shǒu shī jiè jǐng shū qíng, tōngguò duì shānshuǐ
de miáoxiě, hánxù de biǎodále shīrén duì gùxiāng de
sīniàn, dú lái lìng rén bùjīn gǎnkǎi wànqiān.

"Bài thơ này mượn cảnh để tả tình: qua việc miêu tả núi
sông, nó kín đáo bày tỏ nỗi nhớ quê hương của nhà thơ,
đọc lên khiến người ta không kìm được mà cảm khái vô
cùng."
</code></pre>
<div class="callout"><span class="badge">Mẹo phân tích</span> Khi bài đọc HSK6 hỏi "tác giả dùng thủ pháp gì", hãy tìm đoạn miêu tả cảnh vật/sự vật đi kèm một từ cảm xúc gần đó — sự kết hợp ấy hầu như luôn là 借景抒情 hoặc 象征.</div>`,
  ]]);

const c5q = quiz('cic303-quiz-5', 'Quiz 5 — Literature & art|||Quiz 5 — Văn học & nghệ thuật', [
  { id: 'q1', question: '"意境" trong văn học nghĩa gần nhất là gì?', options: ['Vần điệu', 'Ý cảnh — tứ thơ tạo ra từ sự hoà quyện cảnh và tình', 'Thể loại văn bản', 'Đối tượng được miêu tả'], correctIndex: 1, explanation: '意境 chỉ không gian cảm xúc/thẩm mỹ mà cảnh và tình cùng tạo nên trong tác phẩm.' },
  { id: 'q2', question: '"借景抒情" là thủ pháp gì?', options: ['Mượn cảnh để tả tình', 'Dùng số liệu để chứng minh', 'Liệt kê sự kiện theo thời gian', 'Đối thoại trực tiếp giữa nhân vật'], correctIndex: 0, explanation: '借(mượn)+景(cảnh)+抒(bày tỏ)+情(tình) = mượn cảnh vật để bộc lộ cảm xúc.' },
  { id: 'q3', question: '"水墨画" là gì?', options: ['Thư pháp', 'Tranh thuỷ mặc', 'Kinh kịch', 'Tản văn'], correctIndex: 1, explanation: '水(nước)+墨(mực)+画(tranh) = tranh vẽ bằng mực nước, tức tranh thuỷ mặc.' },
]);

const c6 = doc('cic303-6-1-news-argumentative', '6.1 — Journalistic language & argumentative style|||6.1 — Ngôn ngữ báo chí & văn phong nghị luận',
  'Cấu trúc bản tin (标题/导语), xã luận, lập luận (论点/论据/论证/反驳); mẫu câu 据报道, 众所周知, 综上所述, 不可否认.',
  [[
    `<span class="eyebrow">CIC303 · Chapter 6 · Lesson 6.1</span>
<h2>Journalistic language &amp; argumentative style</h2>
<p class="lead">News reports and argumentative essays share a toolkit of fixed formal phrases that signal where you are in the text: citing a source, asserting shared knowledge, or wrapping up a conclusion. Recognizing them speeds up reading; producing them raises your writing register.</p>
<h3>Key vocabulary (HSK5-6)</h3>
<pre><code>报道      bàodào               (news) report
社论      shèlùn               editorial
标题      biāotí               headline
导语      dǎoyǔ                lead paragraph
舆论      yúlùn                public opinion
论点      lùndiǎn              thesis / argument
论据      lùnjù                evidence
论证      lùnzhèng             reasoning / argumentation
反驳      fǎnbó                to refute
</code></pre>
<h3>Grammar &amp; sentence patterns</h3>
<ul>
<li><strong>据报道</strong> (jù bàodào) — "according to reports", opens a sentence that cites an external source without naming it precisely.</li>
<li><strong>众所周知</strong> (zhòngsuǒzhōuzhī) — "as is widely known", introduces a premise the writer treats as common ground before arguing further.</li>
<li><strong>综上所述</strong> (zōng shàng suǒ shù) — "to sum up the above", the standard opener for a conclusion paragraph.</li>
<li><strong>不可否认</strong> (bùkě fǒurèn) — "it cannot be denied that…", concedes a point before the writer pivots to their own argument.</li>
</ul>
<h3>Worked example</h3>
<pre><code>据报道，短视频用户数量在过去五年中大幅增长。
众所周知，这一现象既带来了娱乐方式的多元化，
也引发了对青少年注意力的担忧。不可否认，
平台需要承担更多社会责任。综上所述，短视频
行业的健康发展离不开监管与自律的结合。

Jù bàodào, duǎn shìpín yònghù shùliàng zài guòqù wǔ
nián zhōng dàfú zēngzhǎng. Zhòngsuǒzhōuzhī, zhè yī
xiànxiàng jì dàiláile yúlè fāngshì de duōyuánhuà, yě
yǐnfāle duì qīngshàonián zhùyìlì de dānyōu. Bùkě fǒurèn,
píngtái xūyào chéngdān gèng duō shèhuì zérèn. Zōng shàng
suǒ shù, duǎn shìpín hángyè de jiànkāng fāzhǎn líbukāi
jiānguǎn yǔ zìlǜ de jiéhé.

"Reports say short-video user numbers have grown sharply
over the past five years. As is widely known, this both
diversified entertainment and raised concern about
teenagers' attention spans. It cannot be denied that
platforms must take on more social responsibility. To sum
up, the healthy growth of the short-video industry cannot
happen without a combination of regulation and self-
discipline."</code></pre>
<div class="callout"><span class="badge">Structure tip</span> This four-sentence skeleton — cite (据报道) → shared premise (众所周知) → concession (不可否认) → conclusion (综上所述) — is a ready-made frame for the HSK6 argumentative writing task.</div>`,
    `<span class="eyebrow">CIC303 · Chương 6 · Bài 6.1</span>
<h2>Ngôn ngữ báo chí &amp; văn phong nghị luận</h2>
<p class="lead">Bản tin và bài luận nghị luận dùng chung một bộ cụm từ cố định, trang trọng để báo hiệu vị trí trong văn bản: trích nguồn, khẳng định điều đã biết chung, hay chốt kết luận. Nhận ra chúng giúp đọc nhanh hơn; dùng được chúng nâng văn phong bài viết.</p>
<h3>Từ vựng trọng tâm (HSK5-6)</h3>
<pre><code>报道      bàodào               bản tin, đưa tin
社论      shèlùn               bài xã luận
标题      biāotí               tiêu đề
导语      dǎoyǔ                lời dẫn (đầu bản tin)
舆论      yúlùn                dư luận
论点      lùndiǎn              luận điểm
论据      lùnjù                luận cứ, dẫn chứng
论证      lùnzhèng             lập luận, luận chứng
反驳      fǎnbó                phản bác
</code></pre>
<h3>Ngữ pháp &amp; mẫu câu</h3>
<ul>
<li><strong>据报道</strong> (jù bàodào) — "theo báo cáo/tin đưa", mở đầu câu trích dẫn nguồn tin bên ngoài mà không cần nêu chính xác.</li>
<li><strong>众所周知</strong> (zhòngsuǒzhōuzhī) — "ai cũng biết", giới thiệu một tiền đề mà người viết coi là điểm chung trước khi lập luận tiếp.</li>
<li><strong>综上所述</strong> (zōng shàng suǒ shù) — "tổng hợp những điều trên", câu mở đầu chuẩn cho đoạn kết luận.</li>
<li><strong>不可否认</strong> (bùkě fǒurèn) — "không thể phủ nhận rằng…", nhượng bộ một điểm trước khi người viết xoay sang luận điểm của mình.</li>
</ul>
<h3>Ví dụ minh hoạ</h3>
<pre><code>据报道，短视频用户数量在过去五年中大幅增长。
众所周知，这一现象既带来了娱乐方式的多元化，
也引发了对青少年注意力的担忧。不可否认，
平台需要承担更多社会责任。综上所述，短视频
行业的健康发展离不开监管与自律的结合。

Jù bàodào, duǎn shìpín yònghù shùliàng zài guòqù wǔ
nián zhōng dàfú zēngzhǎng. Zhòngsuǒzhōuzhī, zhè yī
xiànxiàng jì dàiláile yúlè fāngshì de duōyuánhuà, yě
yǐnfāle duì qīngshàonián zhùyìlì de dānyōu. Bùkě fǒurèn,
píngtái xūyào chéngdān gèng duō shèhuì zérèn. Zōng shàng
suǒ shù, duǎn shìpín hángyè de jiànkāng fāzhǎn líbukāi
jiānguǎn yǔ zìlǜ de jiéhé.

"Theo báo đưa, số lượng người dùng video ngắn đã tăng
mạnh trong năm năm qua. Ai cũng biết, hiện tượng này vừa
mang lại sự đa dạng cho cách giải trí, vừa gây lo ngại về
sự tập trung chú ý của thanh thiếu niên. Không thể phủ
nhận, các nền tảng cần gánh vác thêm trách nhiệm xã hội.
Tổng kết lại, sự phát triển lành mạnh của ngành video
ngắn không thể tách rời sự kết hợp giữa quản lý và tự
giác."</code></pre>
<div class="callout"><span class="badge">Mẹo cấu trúc</span> Khung bốn câu này — trích nguồn (据报道) → tiền đề chung (众所周知) → nhượng bộ (不可否认) → kết luận (综上所述) — là khung dựng sẵn cho bài viết nghị luận HSK6.</div>`,
  ]]);

const c6q = quiz('cic303-quiz-6', 'Quiz 6 — News & argumentative style|||Quiz 6 — Báo chí & nghị luận', [
  { id: 'q1', question: '"社论" nghĩa là gì?', options: ['Tin tức thường', 'Bài xã luận', 'Tiêu đề', 'Lời dẫn'], correctIndex: 1, explanation: '社论 là bài viết thể hiện quan điểm chính thức của toà soạn, tức xã luận.' },
  { id: 'q2', question: '"据报道" dùng khi nào?', options: ['Khi trích dẫn nguồn tin', 'Khi phủ định hoàn toàn', 'Khi tổng kết bài viết', 'Khi đặt câu hỏi'], correctIndex: 0, explanation: '据(căn cứ theo)+报道(tin đưa) = mở đầu câu dẫn nguồn tin.' },
  { id: 'q3', question: '"综上所述" thường xuất hiện ở đâu trong bài nghị luận?', options: ['Mở bài', 'Đoạn kết luận, tổng kết', 'Giữa thân bài, khi nêu ví dụ', 'Trong tiêu đề'], correctIndex: 1, explanation: '综(tổng hợp)+上(trên)+所述(đã trình bày) = câu mở đầu chuẩn cho phần kết luận.' },
]);

const c7 = doc('cic303-7-1-idioms-culture', '7.1 — Idioms, allusions & deep culture|||7.1 — Thành ngữ, điển cố & văn hoá sâu',
  '8 thành ngữ điển cố quan trọng (画蛇添足, 亡羊补牢, 守株待兔, 滥竽充数, 狐假虎威, 对牛弹琴, 井底之蛙, 塞翁失马) — nguồn gốc, nghĩa &amp; cách dùng.',
  [[
    `<span class="eyebrow">CIC303 · Chapter 7 · Lesson 7.1</span>
<h2>Idioms, allusions &amp; deep culture</h2>
<p class="lead">Chinese <strong>成语 (chéngyǔ)</strong> pack an entire short story into four characters. Knowing the story behind each one is the only reliable way to remember when it applies — memorizing the definition alone rarely sticks at this level.</p>
<h3>Eight core idioms (HSK5-6)</h3>
<pre><code>画蛇添足  huàshétiānzú    draw a snake, add feet — ruin something by
                          overdoing it
亡羊补牢  wángyángbǔláo   mend the pen after losing a sheep — better
                          late than never
守株待兔  shǒuzhūdàitù    guard a stump waiting for a hare — rely on
                          luck instead of effort
滥竽充数  lànyúchōngshù   pad the ensemble to fill a number — a
                          mediocre person hiding among skilled ones
狐假虎威  hújiǎhǔwēi      the fox borrows the tiger's might — bully
                          others using someone else's power
对牛弹琴  duìniútánqín    play the lute to a cow — speak to an
                          audience that cannot appreciate it
井底之蛙  jǐngdǐzhīwā     a frog at the bottom of a well — someone
                          with a narrow, limited view
塞翁失马  sàiwēngshīmǎ    the old man on the frontier lost his horse
                          — a blessing in disguise
</code></pre>
<h3>One story in full: 塞翁失马</h3>
<p>An old man near the border lost his horse; neighbours offered sympathy, but he said "how do you know this isn't a blessing?" The horse returned bringing a fine wild horse — neighbours congratulated him, but he warned "how do you know this isn't a misfortune?" His son later broke his leg riding it — yet that injury kept the son out of a war that killed most young men in the village. The idiom now marks any moment where a setback later turns out to be fortunate, or vice versa.</p>
<h3>Grammar note</h3>
<p>成语 function as a single grammatical unit — usually a verb phrase or predicate — and can be dropped directly into a sentence: <strong>他这样做纯粹是画蛇添足</strong> (Tā zhèyàng zuò chúncuì shì huàshétiānzú, "what he did was pure overkill").</p>
<div class="callout"><span class="badge">Exam tip</span> HSK6 often tests idioms by giving a short scenario and asking which 成语 fits — the fix is to know the <em>story</em>, not just an English gloss, since several idioms share similar surface meanings but different nuances.</div>`,
    `<span class="eyebrow">CIC303 · Chương 7 · Bài 7.1</span>
<h2>Thành ngữ, điển cố &amp; biểu đạt văn hoá sâu</h2>
<p class="lead"><strong>成语 (chéngyǔ)</strong> — thành ngữ bốn chữ của tiếng Trung — nén cả một câu chuyện ngắn vào bốn âm tiết. Biết câu chuyện đằng sau mỗi thành ngữ là cách chắc chắn duy nhất để nhớ khi nào dùng nó — chỉ học định nghĩa suông ở trình độ này rất khó nhớ lâu.</p>
<h3>Tám thành ngữ trọng tâm (HSK5-6)</h3>
<pre><code>画蛇添足  huàshétiānzú    vẽ rắn thêm chân — làm hỏng việc vì
                          làm thừa, làm quá tay
亡羊补牢  wángyángbǔláo   mất cừu mới sửa chuồng — muộn còn hơn
                          không, mất bò mới lo làm chuồng
守株待兔  shǒuzhūdàitù    ôm gốc cây chờ thỏ — trông chờ may mắn
                          thay vì nỗ lực
滥竽充数  lànyúchōngshù   thổi kèn giả cho đủ số — kẻ tầm thường
                          trà trộn trong nhóm người giỏi
狐假虎威  hújiǎhǔwēi      cáo mượn oai hùm — dựa thế người khác
                          để bắt nạt kẻ khác
对牛弹琴  duìniútánqín    đàn gảy tai trâu — nói với người không
                          hiểu/không biết thưởng thức
井底之蛙  jǐngdǐzhīwā     ếch ngồi đáy giếng — người có tầm nhìn
                          hạn hẹp
塞翁失马  sàiwēngshīmǎ    tái ông thất mã — trong cái rủi có cái
                          may, hoạ phúc khôn lường
</code></pre>
<h3>Một điển tích trọn vẹn: 塞翁失马</h3>
<p>Một ông lão sống gần biên ải mất con ngựa; hàng xóm đến chia buồn, ông nói "sao biết đây không phải là phúc?". Ít lâu sau ngựa quay về, dẫn theo một con ngựa hoang quý; hàng xóm đến chúc mừng, ông lại nói "sao biết đây không phải là hoạ?". Con trai ông sau đó cưỡi ngựa ngã gãy chân — nhưng chính vết thương ấy giúp con ông thoát khỏi đợt trưng binh khiến phần lớn trai tráng trong làng tử trận. Từ đó, thành ngữ này chỉ những lúc rủi ro rồi hoá ra là may mắn, hoặc ngược lại.</p>
<h3>Ghi chú ngữ pháp</h3>
<p>成语 hoạt động như một khối ngữ pháp duy nhất — thường là cụm động từ hoặc vị ngữ — và có thể chèn thẳng vào câu: <strong>他这样做纯粹是画蛇添足</strong> (Tā zhèyàng zuò chúncuì shì huàshétiānzú, "việc anh ấy làm hoàn toàn là vẽ rắn thêm chân/làm thừa").</p>
<div class="callout"><span class="badge">Mẹo thi</span> HSK6 thường kiểm tra thành ngữ bằng cách đưa một tình huống ngắn rồi hỏi 成语 nào phù hợp — cách chắc ăn là biết <em>câu chuyện gốc</em>, không chỉ nghĩa tiếng Việt, vì nhiều thành ngữ có bề mặt giống nhau nhưng sắc thái khác nhau.</div>`,
  ]]);

const c7q = quiz('cic303-quiz-7', 'Quiz 7 — Idioms & culture|||Quiz 7 — Thành ngữ & văn hoá', [
  { id: 'q1', question: '"守株待兔" khuyên điều gì?', options: ['Kiên trì làm việc chăm chỉ', 'Đừng ỷ lại vào may mắn ngẫu nhiên thay vì nỗ lực', 'Cẩn thận trong lời nói', 'Học từ sai lầm của người khác'], correctIndex: 1, explanation: 'Người nông dân ôm gốc cây chờ thỏ đâm đầu vào lần nữa — phê phán việc trông chờ may rủi thay vì hành động.' },
  { id: 'q2', question: '"亡羊补牢" gần nghĩa nhất với câu tục ngữ Việt nào?', options: ['Mất bò mới lo làm chuồng', 'Nước đến chân mới nhảy', 'Được voi đòi tiên', 'Đứng núi này trông núi nọ'], correctIndex: 0, explanation: 'Cả hai đều nói về việc sửa chữa sau khi đã mất mát, nhưng vẫn còn kịp — muộn còn hơn không.' },
  { id: 'q3', question: '"塞翁失马" hàm ý điều gì?', options: ['Trong cái rủi có cái may, hoạ phúc khôn lường', 'Tham thì thâm', 'Cẩn tắc vô áy náy', 'Có công mài sắt có ngày nên kim'], correctIndex: 0, explanation: 'Câu chuyện ông lão mất ngựa cho thấy rủi ro và may mắn có thể đảo chiều lẫn nhau.' },
]);

const c8 = doc('cic303-8-1-hsk6-review', '8.1 — HSK6 review: advanced writing, academic reading & paraphrasing|||8.1 — Ôn tập HSK6: viết luận nâng cao, đọc hiểu học thuật & tóm tắt diễn đạt lại',
  'Cấu trúc bài thi viết HSK6 (缩写 tóm tắt ~400 chữ từ bài đọc ~1000 chữ), chiến lược đọc hiểu học thuật, kỹ thuật diễn đạt lại (改写); liên từ tổ chức đoạn văn.',
  [[
    `<span class="eyebrow">CIC303 · Chapter 8 · Lesson 8.1</span>
<h2>HSK6 review: advanced writing, academic reading &amp; paraphrasing</h2>
<p class="lead">The HSK6 writing section has one fixed task: read a roughly 1,000-character narrative for ten minutes, then rewrite it from memory in about 400 characters — a <strong>缩写 (suōxiě, abridgment/summary)</strong>. It rewards structure and faithfulness, not personal opinion or fancy vocabulary.</p>
<h3>Key vocabulary &amp; connectors</h3>
<pre><code>首先…其次…最后  shǒuxiān…qícì…zuìhòu   first…next…finally
换言之          huàn yán zhī           in other words
简而言之        jiǎn ér yán zhī        in short / to put it briefly
综上所述        zōng shàng suǒ shù     to sum up the above
缩写            suōxiě                 to abridge / summarize
改写            gǎixiě                 to rewrite / paraphrase
中心思想        zhōngxīn sīxiǎng       central idea / theme
</code></pre>
<h3>The 缩写 (summary-writing) method</h3>
<ul>
<li><strong>Read once for plot, not detail.</strong> Track who did what, in what order, and why — that skeleton is what survives into 400 characters.</li>
<li><strong>Find the 中心思想 (central idea)</strong> — the one sentence the whole story is proving. Your summary must preserve it even if every other detail is trimmed.</li>
<li><strong>Do NOT add opinions.</strong> HSK6 abridgment is graded on fidelity to the source, not on your reaction to it — this differs from a Western "response" essay.</li>
<li><strong>Give your own title.</strong> The prompt deliberately omits one; a title drawn from the central idea signals you understood the passage.</li>
<li><strong>Paraphrase (改写), don't copy.</strong> Reuse the events and character names, but rebuild the sentences in your own words — verbatim copying loses points.</li>
</ul>
<h3>Academic reading strategy</h3>
<p>For HSK6 argumentative/expository reading passages, scan first for the connectors above: <strong>首先…其次…最后</strong> marks the argument's skeleton, and <strong>综上所述</strong> almost always precedes the passage's main claim. Read the sentence right after 综上所述 first if you are short on time — it is usually the answer to a "what is the author's main point" question.</p>
<div class="callout"><span class="badge">Exam tip</span> Practice writing a 400-character 缩写 from a 1,000-character story under a real 35-minute clock (10 min read + 25 min write, no notes on the second pass) — timing pressure, not vocabulary, is what most candidates underestimate.</div>`,
    `<span class="eyebrow">CIC303 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập HSK6: viết luận nâng cao, đọc hiểu học thuật &amp; tóm tắt diễn đạt lại</h2>
<p class="lead">Phần thi viết HSK6 chỉ có một dạng bài cố định: đọc một câu chuyện khoảng 1.000 chữ trong mười phút, sau đó viết lại theo trí nhớ trong khoảng 400 chữ — gọi là <strong>缩写 (suōxiě, bản tóm lược)</strong>. Bài chấm điểm dựa trên cấu trúc và độ trung thành với bản gốc, không phải quan điểm cá nhân hay từ vựng hoa mỹ.</p>
<h3>Từ vựng &amp; liên từ trọng tâm</h3>
<pre><code>首先…其次…最后  shǒuxiān…qícì…zuìhòu   trước tiên…tiếp theo…cuối cùng
换言之          huàn yán zhī           nói cách khác
简而言之        jiǎn ér yán zhī        nói ngắn gọn
综上所述        zōng shàng suǒ shù     tổng hợp lại những điều trên
缩写            suōxiě                 tóm lược, viết gọn lại
改写            gǎixiě                 viết lại, diễn đạt lại
中心思想        zhōngxīn sīxiǎng       tư tưởng trung tâm, ý chính
</code></pre>
<h3>Phương pháp viết 缩写 (tóm tắt)</h3>
<ul>
<li><strong>Đọc một lần để nắm cốt truyện, không sa vào chi tiết.</strong> Theo dõi ai làm gì, theo thứ tự nào, vì sao — cái khung đó mới là thứ cần giữ lại trong 400 chữ.</li>
<li><strong>Tìm 中心思想 (ý chính)</strong> — câu duy nhất mà cả câu chuyện muốn chứng minh. Bản tóm tắt phải giữ được ý này dù mọi chi tiết khác bị cắt.</li>
<li><strong>KHÔNG thêm quan điểm cá nhân.</strong> Bài 缩写 HSK6 chấm điểm dựa trên độ trung thành với bản gốc, không phải phản ứng của bạn với nó — khác với kiểu bài luận "nêu ý kiến" phương Tây.</li>
<li><strong>Tự đặt tiêu đề.</strong> Đề bài cố tình không cho sẵn tiêu đề; một tiêu đề rút ra từ ý chính cho thấy bạn đã hiểu bài đọc.</li>
<li><strong>Diễn đạt lại (改写), đừng chép nguyên văn.</strong> Giữ lại sự kiện và tên nhân vật, nhưng dựng lại câu bằng lời của mình — chép nguyên văn bị trừ điểm.</li>
</ul>
<h3>Chiến lược đọc hiểu học thuật</h3>
<p>Với bài đọc nghị luận/thuyết minh HSK6, hãy quét trước các liên từ ở trên: <strong>首先…其次…最后</strong> đánh dấu bộ khung lập luận, còn <strong>综上所述</strong> hầu như luôn đứng trước luận điểm chính của bài. Nếu thiếu thời gian, hãy đọc câu ngay sau 综上所述 trước tiên — đó thường là đáp án cho câu hỏi "ý chính của tác giả là gì".</p>
<div class="callout"><span class="badge">Mẹo thi</span> Luyện viết một bài 缩写 400 chữ từ câu chuyện 1.000 chữ trong đúng 35 phút thật (10 phút đọc + 25 phút viết, không xem lại bài đọc ở lượt viết) — áp lực thời gian, chứ không phải từ vựng, mới là thứ hầu hết thí sinh đánh giá thấp.</div>`,
  ]]);

const c8q = quiz('cic303-quiz-8', 'Quiz 8 — HSK6 review|||Quiz 8 — Ôn tập HSK6', [
  { id: 'q1', question: 'Trong bài thi viết HSK6 (缩写), thí sinh cần làm gì với bài đọc khoảng 1.000 chữ?', options: ['Viết cảm nghĩ cá nhân về bài đọc', 'Tóm tắt lại bằng khoảng 400 chữ, trung thành với nội dung gốc', 'Dịch nguyên văn sang tiếng Anh', 'Chỉ liệt kê các từ vựng khó trong bài'], correctIndex: 1, explanation: '缩写(tóm lược) yêu cầu viết lại theo trí nhớ, giữ đúng cốt truyện và ý chính, không thêm quan điểm riêng.' },
  { id: 'q2', question: '"换言之" dùng để làm gì?', options: ['Nói cách khác / diễn đạt lại ý vừa nêu', 'Đưa ra một ví dụ cụ thể', 'Phủ định hoàn toàn ý trước đó', 'Đặt một câu hỏi tu từ'], correctIndex: 0, explanation: '换(đổi)+言(lời)+之 = nói bằng lời khác, dùng để diễn đạt lại cùng một ý.' },
  { id: 'q3', question: 'Cấu trúc "首先…其次…最后…" dùng để làm gì?', options: ['So sánh hai đối tượng ngang hàng', 'Sắp xếp các bước/luận điểm theo trình tự', 'Diễn tả quan hệ nguyên nhân — kết quả', 'Diễn tả sự nhượng bộ, tương phản'], correctIndex: 1, explanation: '首先(trước tiên)…其次(tiếp theo)…最后(cuối cùng) tổ chức lập luận hoặc câu chuyện theo trình tự các bước.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CIC303',
    slug: 'cic303-tieng-trung-quoc-tong-hop-5',
    title: 'Tiếng Trung Quốc tổng hợp 5',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CIC303.webp',
    shortDescription: 'Advanced Chinese (HSK5-6): society, economy &amp; globalization, tech, Chinese history &amp; thought, literature &amp; art, news/argumentative style, idioms, HSK6 review — real vocabulary, grammar patterns &amp; quizzes.|||Tiếng Trung nâng cao (HSK5-6): xã hội, kinh tế &amp; toàn cầu hoá, công nghệ, lịch sử &amp; tư tưởng, văn học &amp; nghệ thuật, báo chí &amp; nghị luận, thành ngữ, ôn HSK6 — từ vựng, ngữ pháp thật &amp; quiz.',
    description: 'Môn <strong>CIC303 — Tiếng Trung Quốc tổng hợp 5</strong> (ngành Ngôn ngữ Trung, kỳ 3) đưa trình độ từ HSK5 lên HSK6 qua 8 chương: <strong>xã hội &amp; vấn đề đương đại</strong>, <strong>kinh tế, thương mại &amp; toàn cầu hoá</strong>, <strong>khoa học, công nghệ &amp; tương lai</strong>, <strong>lịch sử &amp; tư tưởng Trung Hoa</strong>, <strong>văn học &amp; nghệ thuật nâng cao</strong>, <strong>ngôn ngữ báo chí &amp; văn phong nghị luận</strong>, <strong>thành ngữ, điển cố &amp; biểu đạt văn hoá sâu</strong>, và <strong>ôn tập HSK6</strong> (viết luận, đọc hiểu học thuật, tóm tắt &amp; diễn đạt lại). Mỗi chương có chữ Hán, pinyin có dấu thanh, nghĩa Việt/Anh, mẫu câu ngữ pháp nâng cao, ví dụ minh hoạ và quiz kiểm tra. Bám giáo trình <em>HSK Standard Course 5-6</em> (Đại học Ngôn ngữ Bắc Kinh) và <em>Developing Chinese Advanced</em>.',
    whatYouLearn: 'Từ vựng học thuật/trừu tượng HSK5-6 theo 8 chủ đề (xã hội, kinh tế, công nghệ, lịch sử-tư tưởng, văn học-nghệ thuật, báo chí-nghị luận, thành ngữ-văn hoá, ôn HSK6); mẫu câu nâng cao: 随着…, 不仅…而且…, 尽管…但是…, 一方面…另一方面…, 无论…都…, 由于…因此…, 一旦…就…, 除非…否则…, 之所以…是因为…, 从…到…, 与其…不如…, 借景抒情, 据报道, 众所周知, 综上所述, 不可否认; 8 thành ngữ điển cố (画蛇添足, 亡羊补牢, 守株待兔, 滥竽充数, 狐假虎威, 对牛弹琴, 井底之蛙, 塞翁失马); phương pháp viết 缩写 (tóm tắt) và chiến lược đọc hiểu học thuật cho kỳ thi HSK6.',
    requirements: 'Đã đạt trình độ HSK5 (hoặc tương đương): đọc hiểu 2.500 từ vựng cơ bản, nắm ngữ pháp trung cấp. Môn tiếp nối trực tiếp lên HSK6.',
  },
  sections: [
    { title: 'Chương 1 — Xã hội & các vấn đề đương đại|||Chapter 1 — Society & contemporary issues', description: 'Khoảng cách giàu nghèo, lão hoá dân số, đô thị hoá; 随着…, 不仅…而且….', lessons: [c1, c1q] },
    { title: 'Chương 2 — Kinh tế, thương mại & toàn cầu hoá|||Chapter 2 — Economy, trade & globalization', description: 'Lạm phát, tỷ giá, thương mại, chuỗi cung ứng; 一方面…另一方面…, 由于…因此….', lessons: [c2, c2q] },
    { title: 'Chương 3 — Khoa học, công nghệ & tương lai|||Chapter 3 — Science, technology & the future', description: 'AI, dữ liệu lớn, năng lượng tái tạo; 一旦…就…, 除非…否则…, 之所以…是因为….', lessons: [c3, c3q] },
    { title: 'Chương 4 — Lịch sử & tư tưởng Trung Hoa|||Chapter 4 — Chinese history & thought', description: 'Nho-Đạo-Pháp gia, khoa cử, Con đường tơ lụa; 从…到…, 与其…不如….', lessons: [c4, c4q] },
    { title: 'Chương 5 — Văn học & nghệ thuật nâng cao|||Chapter 5 — Advanced literature & art', description: 'Ý cảnh, tu từ, thư pháp, tranh thuỷ mặc, kinh kịch; 借景抒情.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ngôn ngữ báo chí & văn phong nghị luận|||Chapter 6 — Journalistic language & argumentative style', description: 'Bản tin, xã luận, lập luận; 据报道, 众所周知, 综上所述.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thành ngữ, điển cố & văn hoá sâu|||Chapter 7 — Idioms, allusions & deep culture', description: '8 thành ngữ kinh điển kèm điển tích, nghĩa &amp; cách dùng.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập HSK6|||Chapter 8 — HSK6 review', description: 'Viết luận (缩写), đọc hiểu học thuật, tóm tắt &amp; diễn đạt lại (改写).', lessons: [c8, c8q] },
  ],
};
