/**
 * CIC401 — Advanced Integrated Chinese / Tiếng Trung tổng hợp nâng cao. Ngành
 * Ngôn ngữ Trung, FPTU, Kỳ 4. Trình độ HSK5→6, môn CUỐI chuỗi CIC (301/302/303)
 * → đỉnh HSK6. 8 chương: vấn đề xã hội đương đại & bình luận, kinh tế/đổi mới/
 * khởi nghiệp, KH-AI & đạo đức, triết học & tư tưởng truyền thống, văn học
 * kinh điển & hiện đại, ngôn ngữ chính luận & phản biện, thành ngữ/điển cố &
 * ẩn dụ văn hoá, ôn tập HSK6. Từ vựng/mẫu câu/thành ngữ ở đây CHỌN CHỦ ĐỘNG
 * khác với CIC303 (đã dạy: 贫富差距/老龄化/城市化, 一方面…另一方面, 由于…因此,
 * 一旦…就, 除非…否则, 之所以…是因为, 从…到…, 与其…不如, 借景抒情, 据报道,
 * 众所周知, 综上所述, 不可否认, và 8 thành ngữ 画蛇添足/亡羊补牢/守株待兔/
 * 滥竽充数/狐假虎威/对牛弹琴/井底之蛙/塞翁失马) để không lặp cấp dưới.
 * Chữ Hán UTF-8 + pinyin có dấu thanh thật + nghĩa Việt/Anh. Giữ NGUYÊN
 * slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('cic401-1-1-social-commentary', 'Chapter 1 — Contemporary social issues &amp; commentary|||Chương 1 — Vấn đề xã hội đương đại &amp; bình luận',
  'Từ vựng hiện tượng xã hội mới (内卷, 躺平, 信息茧房…); mẫu câu 不仅仅是…更是…, 说到底, 不容忽视的是.',
  [[
    `<span class="eyebrow">CIC401 · Chapter 1 · Lesson 1</span>
<h2>Contemporary social issues &amp; commentary</h2>
<p class="lead">Beyond textbook sociology terms (wealth gap, aging population — already covered earlier in the CIC track), HSK6 commentary increasingly engages with <strong>internet-born social vocabulary</strong>: the language young Chinese speakers themselves use to describe pressure, burnout and disconnection.</p>
<h3>Core vocabulary (核心词汇)</h3>
<pre><code>内卷 (nèijuǎn) — involution: fierce, zero-sum internal competition
躺平 (tǎngpíng) — "lying flat": opting out of ambition/competition
信息茧房 (xìnxī jiǎnfáng) — information cocoon (filter bubble)
网络暴力 (wǎngluò bàolì) — cyberbullying
消费主义 (xiāofèi zhǔyì) — consumerism
代际差异 (dàijì chāyì) — generational gap
心理健康 (xīnlǐ jiànkāng) — mental health
阶层固化 (jiēcéng gùhuà) — social-mobility stagnation (class rigidity)
</code></pre>
<h3>HSK6 sentence patterns (句型)</h3>
<ul>
<li><strong>不仅仅是…更是…</strong> (bùjǐnjǐn shì… gèng shì…) — "is not merely … but even more so …". <em>躺平不仅仅是个人的选择，更是社会结构性压力的反映。</em></li>
<li><strong>说到底</strong> (shuōdàodǐ) — "when it comes down to it". <em>说到底，内卷和躺平都是年轻人应对压力的两种方式。</em></li>
<li><strong>不容忽视的是</strong> (bùróng hūshì de shì) — "what cannot be ignored is …". <em>不容忽视的是，信息茧房正在加深不同世代之间的代际差异。</em></li>
</ul>
<h3>Reading: buzzwords of a generation (一代人的流行词)</h3>
<pre><code>如今，"内卷"和"躺平"成为年轻人挂在嘴边的两个词。有人为了
升学、就业而陷入激烈的内卷，也有人选择躺平，主动退出竞争。
这两种现象背后，不容忽视的是社交媒体制造的信息茧房——它让
每个人只看到自己愿意看到的观点，进一步加深了代际差异与心理
健康问题。说到底，无论是内卷还是躺平，都不仅仅是个人选择，
更是当代社会结构性压力的一种反映。
</code></pre>
<p><em>Translation:</em> Nowadays, "involution" and "lying flat" have become two buzzwords on young people's lips. Some fall into fierce competition over schooling and jobs; others choose to lie flat, opting out of the race. Behind both, what cannot be ignored is the information cocoon built by social media — it lets everyone see only the views they already want to, deepening both the generational gap and mental-health problems. When it comes down to it, whether it's involution or lying flat, neither is merely a personal choice — it is even more a reflection of contemporary society's structural pressure.</p>
<div class="callout"><span class="badge">Register note</span> These internet-coined terms (内卷, 躺平) are now accepted in formal commentary — HSK6 reading passages use them precisely because they are impossible to translate with one classical word, which is what makes them worth testing.</div>`,
    `<span class="eyebrow">CIC401 · Chương 1 · Bài 1</span>
<h2>Vấn đề xã hội đương đại &amp; bình luận</h2>
<p class="lead">Ngoài các thuật ngữ xã hội học kiểu sách giáo khoa (khoảng cách giàu nghèo, già hoá dân số — đã học ở các môn CIC trước), bài bình luận HSK6 ngày càng dùng <strong>từ vựng xã hội sinh ra từ internet</strong>: chính ngôn ngữ mà người trẻ Trung Quốc dùng để mô tả áp lực, kiệt sức và sự tách rời.</p>
<h3>Từ vựng trọng tâm (核心词汇)</h3>
<pre><code>内卷 (nèijuǎn) — nội cuốn: cạnh tranh nội bộ khốc liệt, tổng bằng không
躺平 (tǎngpíng) — "nằm yên": chủ động rút khỏi tham vọng/cạnh tranh
信息茧房 (xìnxī jiǎnfáng) — kén thông tin (bong bóng lọc tin)
网络暴力 (wǎngluò bàolì) — bạo lực mạng
消费主义 (xiāofèi zhǔyì) — chủ nghĩa tiêu dùng
代际差异 (dàijì chāyì) — khác biệt thế hệ
心理健康 (xīnlǐ jiànkāng) — sức khoẻ tâm lý
阶层固化 (jiēcéng gùhuà) — đông cứng tầng lớp xã hội
</code></pre>
<h3>Mẫu câu HSK6 (句型)</h3>
<ul>
<li><strong>不仅仅是…更是…</strong> (bùjǐnjǐn shì… gèng shì…) — "không chỉ là… mà còn là…, ở mức cao hơn". <em>躺平不仅仅是个人的选择，更是社会结构性压力的反映。</em> (Nằm yên không chỉ là lựa chọn cá nhân, mà còn là sự phản ánh áp lực mang tính cấu trúc của xã hội.)</li>
<li><strong>说到底</strong> (shuōdàodǐ) — "suy cho cùng, nói đến cùng". <em>说到底，内卷和躺平都是年轻人应对压力的两种方式。</em> (Nói đến cùng, nội cuốn và nằm yên đều là hai cách người trẻ đối mặt với áp lực.)</li>
<li><strong>不容忽视的是</strong> (bùróng hūshì de shì) — "điều không thể xem nhẹ là…". <em>不容忽视的是，信息茧房正在加深不同世代之间的代际差异。</em> (Điều không thể xem nhẹ là, kén thông tin đang làm sâu thêm khác biệt thế hệ giữa các nhóm tuổi khác nhau.)</li>
</ul>
<h3>Đọc hiểu: từ khoá của một thế hệ (一代人的流行词)</h3>
<pre><code>如今，"内卷"和"躺平"成为年轻人挂在嘴边的两个词。有人为了
升学、就业而陷入激烈的内卷，也有人选择躺平，主动退出竞争。
这两种现象背后，不容忽视的是社交媒体制造的信息茧房——它让
每个人只看到自己愿意看到的观点，进一步加深了代际差异与心理
健康问题。说到底，无论是内卷还是躺平，都不仅仅是个人选择，
更是当代社会结构性压力的一种反映。
</code></pre>
<p><em>Dịch nghĩa:</em> Ngày nay, "nội cuốn" và "nằm yên" trở thành hai từ cửa miệng của người trẻ. Có người vì thi cử, việc làm mà rơi vào cuộc cạnh tranh nội bộ khốc liệt, cũng có người chọn nằm yên, chủ động rút khỏi cuộc đua. Đằng sau hai hiện tượng này, điều không thể xem nhẹ là kén thông tin do mạng xã hội tạo ra — nó khiến mỗi người chỉ nhìn thấy quan điểm mình muốn thấy, càng làm sâu thêm khác biệt thế hệ và các vấn đề sức khoẻ tâm lý. Nói đến cùng, dù là nội cuốn hay nằm yên, cả hai đều không chỉ là lựa chọn cá nhân, mà còn là sự phản ánh áp lực mang tính cấu trúc của xã hội hiện đại.</p>
<div class="callout"><span class="badge">Lưu ý văn phong</span> Những từ sinh ra từ internet này (内卷, 躺平) nay đã được chấp nhận trong văn phong trang trọng — bài đọc HSK6 dùng chúng chính vì không thể dịch gọn bằng một từ cổ điển nào, và đó cũng là lý do chúng được đưa vào đề thi.</div>`,
  ]]);

const c1q = quiz('cic401-quiz-1', 'Quiz 1 — Social commentary|||Quiz 1 — Bình luận xã hội', [
  { id: 'q1', question: '"内卷" trong ngữ cảnh xã hội hiện đại nghĩa gần nhất là gì?', options: ['Cuộc cạnh tranh nội bộ khốc liệt, tốn công nhưng ít giá trị thực ("nội cuốn")', 'Phát triển bền vững', 'An sinh xã hội', 'Khoảng cách giàu nghèo'], correctIndex: 0, explanation: '内卷 (nèijuǎn) chỉ tình trạng cạnh tranh nội bộ ngày càng khốc liệt mà không tạo thêm giá trị thực sự cho tổng thể.' },
  { id: 'q2', question: '"躺平" miêu tả lựa chọn nào của một số người trẻ?', options: ['Chủ động rút khỏi cuộc đua, giảm kỳ vọng và tham vọng', 'Tăng tốc làm việc để thăng tiến nhanh hơn', 'Di cư ra nước ngoài lập nghiệp', 'Đầu tư mạo hiểm vào cổ phiếu'], correctIndex: 0, explanation: '躺(nằm)+平(bằng) → "nằm yên": chủ động không tham gia cuộc đua thành tích/cạnh tranh.' },
  { id: 'q3', question: 'Mẫu câu "不仅仅是…更是…" dùng để làm gì?', options: ['Nhấn mạnh điều gì đó không chỉ là A mà còn ở mức cao hơn là B', 'Diễn tả điều kiện giả định', 'Nêu quan hệ nguyên nhân — kết quả đơn giản', 'Liệt kê các bước theo trình tự thời gian'], correctIndex: 0, explanation: '不仅仅是(không chỉ là)…更是(mà còn/hơn nữa là)… nâng mức độ của nhận định từ A lên B.' },
]);

const c2 = doc('cic401-2-1-startup-innovation', 'Chapter 2 — Economy, innovation &amp; entrepreneurship|||Chương 2 — Kinh tế, đổi mới &amp; khởi nghiệp',
  'Từ vựng khởi nghiệp-đổi mới (独角兽企业, 颠覆式创新…); mẫu câu 在…的背景下, 只有…才能…, 以…为核心.',
  [[
    `<span class="eyebrow">CIC401 · Chapter 2 · Lesson 2</span>
<h2>Economy, innovation &amp; entrepreneurship</h2>
<p class="lead">Beyond macro trade terms (GDP, tariffs, trade balance — covered earlier), this chapter zooms into the vocabulary of the startup world itself: valuation, business models, disruptive innovation.</p>
<h3>Core vocabulary (核心词汇)</h3>
<pre><code>创业 (chuàngyè) — to start a business
风险投资 (fēngxiǎn tóuzī) — venture capital
独角兽企业 (dújiǎoshòu qǐyè) — unicorn company
商业模式 (shāngyè móshì) — business model
知识产权 (zhīshì chǎnquán) — intellectual property
颠覆式创新 (diānfùshì chuàngxīn) — disruptive innovation
估值 (gūzhí) — valuation
孵化器 (fūhuàqì) — (business) incubator
</code></pre>
<h3>HSK6 sentence patterns (句型)</h3>
<ul>
<li><strong>在…的背景下</strong> (zài… de bèijǐng xià) — "against the backdrop of …". <em>在数字经济快速发展的背景下，创业者纷纷涌向新兴行业。</em></li>
<li><strong>只有…才能…</strong> (zhǐyǒu… cáinéng…) — "only by/if … can …". <em>只有保护好知识产权，企业才能获得合理的估值。</em></li>
<li><strong>以…为核心</strong> (yǐ… wéi héxīn) — "centered on / with … at the core". <em>一个成熟的商业模式，往往以用户需求为核心。</em></li>
</ul>
<h3>Reading: building a unicorn (打造独角兽)</h3>
<pre><code>在数字经济快速发展的背景下，越来越多的创业者试图通过颠覆式
创新打造属于自己的独角兽企业。一个成熟的商业模式，往往以用
户需求为核心，同时依靠风险投资和孵化器的支持完成早期融资。
只有保护好自己的知识产权，企业才能在竞争中获得合理的估值，
避免被模仿者迅速超越。
</code></pre>
<p><em>Translation:</em> Against the backdrop of the digital economy's rapid growth, more and more entrepreneurs are trying to build their own unicorn company through disruptive innovation. A mature business model is usually centered on user needs, while also relying on venture capital and incubator support to complete early financing. Only by properly protecting its intellectual property can a company earn a fair valuation in competition and avoid being quickly overtaken by imitators.</p>
<div class="callout"><span class="badge">Exam tip</span> HSK6 essays on entrepreneurship score well when a candidate names a <em>condition</em> (只有…才能…) rather than just describing success — examiners read this as more analytical than descriptive.</div>`,
    `<span class="eyebrow">CIC401 · Chương 2 · Bài 2</span>
<h2>Kinh tế, đổi mới &amp; khởi nghiệp</h2>
<p class="lead">Vượt ra ngoài các thuật ngữ thương mại vĩ mô (GDP, thuế quan, cán cân thương mại — đã học trước đó), chương này đi sâu vào từ vựng của chính thế giới khởi nghiệp: định giá, mô hình kinh doanh, đổi mới đột phá.</p>
<h3>Từ vựng trọng tâm (核心词汇)</h3>
<pre><code>创业 (chuàngyè) — khởi nghiệp
风险投资 (fēngxiǎn tóuzī) — đầu tư mạo hiểm
独角兽企业 (dújiǎoshòu qǐyè) — doanh nghiệp kỳ lân
商业模式 (shāngyè móshì) — mô hình kinh doanh
知识产权 (zhīshì chǎnquán) — sở hữu trí tuệ
颠覆式创新 (diānfùshì chuàngxīn) — đổi mới đột phá
估值 (gūzhí) — định giá (doanh nghiệp)
孵化器 (fūhuàqì) — vườn ươm khởi nghiệp
</code></pre>
<h3>Mẫu câu HSK6 (句型)</h3>
<ul>
<li><strong>在…的背景下</strong> (zài… de bèijǐng xià) — "trong bối cảnh…". <em>在数字经济快速发展的背景下，创业者纷纷涌向新兴行业。</em> (Trong bối cảnh kinh tế số phát triển nhanh, các nhà khởi nghiệp đổ dồn vào các ngành mới nổi.)</li>
<li><strong>只有…才能…</strong> (zhǐyǒu… cáinéng…) — "chỉ có… mới có thể…". <em>只有保护好知识产权，企业才能获得合理的估值。</em> (Chỉ khi bảo vệ tốt sở hữu trí tuệ, doanh nghiệp mới có thể đạt được mức định giá hợp lý.)</li>
<li><strong>以…为核心</strong> (yǐ… wéi héxīn) — "lấy… làm cốt lõi". <em>一个成熟的商业模式，往往以用户需求为核心。</em> (Một mô hình kinh doanh trưởng thành thường lấy nhu cầu người dùng làm cốt lõi.)</li>
</ul>
<h3>Đọc hiểu: dựng một doanh nghiệp kỳ lân (打造独角兽)</h3>
<pre><code>在数字经济快速发展的背景下，越来越多的创业者试图通过颠覆式
创新打造属于自己的独角兽企业。一个成熟的商业模式，往往以用
户需求为核心，同时依靠风险投资和孵化器的支持完成早期融资。
只有保护好自己的知识产权，企业才能在竞争中获得合理的估值，
避免被模仿者迅速超越。
</code></pre>
<p><em>Dịch nghĩa:</em> Trong bối cảnh kinh tế số phát triển nhanh, ngày càng nhiều nhà khởi nghiệp cố gắng thông qua đổi mới đột phá để dựng nên doanh nghiệp kỳ lân của riêng mình. Một mô hình kinh doanh trưởng thành thường lấy nhu cầu người dùng làm cốt lõi, đồng thời dựa vào sự hỗ trợ của đầu tư mạo hiểm và vườn ươm để hoàn thành huy động vốn giai đoạn đầu. Chỉ khi bảo vệ tốt sở hữu trí tuệ của mình, doanh nghiệp mới có thể đạt được mức định giá hợp lý trong cạnh tranh, tránh bị người bắt chước vượt qua nhanh chóng.</p>
<div class="callout"><span class="badge">Mẹo thi</span> Bài luận HSK6 về khởi nghiệp được đánh giá cao khi thí sinh nêu được một <em>điều kiện</em> (只有…才能…) thay vì chỉ miêu tả thành công — giám khảo đọc đây là lối viết phân tích, không chỉ tường thuật.</div>`,
  ]]);

const c2q = quiz('cic401-quiz-2', 'Quiz 2 — Startups &amp; innovation|||Quiz 2 — Khởi nghiệp &amp; đổi mới', [
  { id: 'q1', question: '"独角兽企业" nghĩa là gì?', options: ['Doanh nghiệp khởi nghiệp được định giá trên 1 tỷ đô la ("kỳ lân")', 'Doanh nghiệp nhà nước lâu đời', 'Doanh nghiệp đã phá sản', 'Doanh nghiệp kinh doanh gia đình nhỏ'], correctIndex: 0, explanation: '独角兽(kỳ lân, con vật huyền thoại hiếm)+企业(doanh nghiệp) — ẩn dụ cho startup hiếm và có giá trị cao.' },
  { id: 'q2', question: '"孵化器" trong ngữ cảnh khởi nghiệp nghĩa là gì?', options: ['Vườn ươm hỗ trợ startup ở giai đoạn đầu', 'Ngân hàng trung ương', 'Sàn giao dịch chứng khoán', 'Cơ quan thuế nhà nước'], correctIndex: 0, explanation: '孵化(ấp trứng)+器(công cụ) — ẩn dụ cho tổ chức "ấp" và hỗ trợ startup non trẻ.' },
  { id: 'q3', question: 'Mẫu câu "只有…才能…" biểu thị điều gì?', options: ['Điều kiện DUY NHẤT để đạt được một kết quả ("chỉ có... mới có thể...")', 'Sự nhượng bộ trước khi phản bác', 'Sự liệt kê ngang hàng nhiều ý', 'Sự so sánh hơn — kém giữa hai lựa chọn'], correctIndex: 0, explanation: '只有(chỉ có)…才能(mới có thể)… nêu điều kiện bắt buộc, thiếu nó thì kết quả không xảy ra.' },
]);

const c3 = doc('cic401-3-1-ai-ethics', 'Chapter 3 — Science, AI &amp; ethics|||Chương 3 — Khoa học, trí tuệ nhân tạo &amp; đạo đức',
  'Từ vựng đạo đức công nghệ (算法偏见, 问责机制…); mẫu câu 假如/倘若…就…, 与其说…不如说…, 从…角度来看.',
  [[
    `<span class="eyebrow">CIC401 · Chapter 3 · Lesson 3</span>
<h2>Science, AI &amp; ethics</h2>
<p class="lead">Beyond naming what AI technology <em>is</em> (covered earlier), this chapter builds the vocabulary to argue about who is <strong>responsible</strong> when it goes wrong.</p>
<h3>Core vocabulary (核心词汇)</h3>
<pre><code>人工智能 (réngōng zhìnéng) — artificial intelligence
算法偏见 (suànfǎ piānjiàn) — algorithmic bias
伦理道德 (lúnlǐ dàodé) — ethics and morality
隐私泄露 (yǐnsī xièlù) — privacy leak
基因编辑 (jīyīn biānjí) — gene editing
数据安全 (shùjù ānquán) — data security
双刃剑 (shuāngrènjiàn) — double-edged sword
问责机制 (wènzé jīzhì) — accountability mechanism
</code></pre>
<h3>HSK6 sentence patterns (句型)</h3>
<ul>
<li><strong>假如/倘若…就…</strong> (jiǎrú/tǎngruò… jiù…) — "if / suppose … then …". <em>倘若算法存在偏见，就可能在不知不觉中放大社会的不公平。</em></li>
<li><strong>与其说…不如说…</strong> (yǔqí shuō… bùrú shuō…) — "it's not so much … as it is …". <em>与其说这是技术本身的问题，不如说是问责机制缺失所致。</em></li>
<li><strong>从…角度来看</strong> (cóng… jiǎodù láikàn) — "from the perspective of …". <em>从伦理道德的角度来看，基因编辑技术必须受到严格监管。</em></li>
</ul>
<h3>Reading: who is accountable? (谁来负责？)</h3>
<pre><code>人工智能被称为一把双刃剑：倘若算法存在偏见，就可能在不知
不觉中放大社会的不公平；与其说这是技术本身的问题，不如说
是问责机制缺失所致。从伦理道德的角度来看，无论是隐私泄露、
数据安全，还是基因编辑，都需要建立清晰的问责机制，而不能
仅仅依靠技术公司的自我约束。
</code></pre>
<p><em>Translation:</em> Artificial intelligence is called a double-edged sword: if an algorithm carries bias, it may unknowingly amplify social unfairness; it is not so much a problem of the technology itself as it is one caused by a missing accountability mechanism. From the perspective of ethics and morality, whether it is privacy leaks, data security, or gene editing, a clear accountability mechanism must be built — one cannot rely solely on tech companies' self-restraint.</p>
<div class="callout"><span class="badge">Argument shape</span> Note the move from "blaming the technology" to "blaming the missing mechanism" via 与其说…不如说… — HSK6 graders reward this reframing far more than a flat "AI is dangerous" statement.</div>`,
    `<span class="eyebrow">CIC401 · Chương 3 · Bài 3</span>
<h2>Khoa học, trí tuệ nhân tạo &amp; đạo đức</h2>
<p class="lead">Ngoài việc định nghĩa công nghệ AI <em>là gì</em> (đã học trước đó), chương này xây dựng vốn từ để tranh luận về việc ai phải <strong>chịu trách nhiệm</strong> khi công nghệ gây hậu quả xấu.</p>
<h3>Từ vựng trọng tâm (核心词汇)</h3>
<pre><code>人工智能 (réngōng zhìnéng) — trí tuệ nhân tạo
算法偏见 (suànfǎ piānjiàn) — thiên lệch/định kiến thuật toán
伦理道德 (lúnlǐ dàodé) — đạo đức luân lý
隐私泄露 (yǐnsī xièlù) — rò rỉ quyền riêng tư
基因编辑 (jīyīn biānjí) — chỉnh sửa gen
数据安全 (shùjù ānquán) — an toàn dữ liệu
双刃剑 (shuāngrènjiàn) — con dao hai lưỡi
问责机制 (wènzé jīzhì) — cơ chế quy trách nhiệm
</code></pre>
<h3>Mẫu câu HSK6 (句型)</h3>
<ul>
<li><strong>假如/倘若…就…</strong> (jiǎrú/tǎngruò… jiù…) — "giả sử… thì…". <em>倘若算法存在偏见，就可能在不知不觉中放大社会的不公平。</em> (Giả sử thuật toán có thiên lệch, thì có thể vô tình khuếch đại sự bất công của xã hội.)</li>
<li><strong>与其说…不如说…</strong> (yǔqí shuō… bùrú shuō…) — "nói… chẳng bằng nói…". <em>与其说这是技术本身的问题，不如说是问责机制缺失所致。</em> (Nói đây là vấn đề của bản thân công nghệ chẳng bằng nói là do thiếu cơ chế quy trách nhiệm.)</li>
<li><strong>从…角度来看</strong> (cóng… jiǎodù láikàn) — "nhìn từ góc độ…". <em>从伦理道德的角度来看，基因编辑技术必须受到严格监管。</em> (Nhìn từ góc độ đạo đức luân lý, công nghệ chỉnh sửa gen phải chịu sự giám sát nghiêm ngặt.)</li>
</ul>
<h3>Đọc hiểu: ai phải chịu trách nhiệm? (谁来负责？)</h3>
<pre><code>人工智能被称为一把双刃剑：倘若算法存在偏见，就可能在不知
不觉中放大社会的不公平；与其说这是技术本身的问题，不如说
是问责机制缺失所致。从伦理道德的角度来看，无论是隐私泄露、
数据安全，还是基因编辑，都需要建立清晰的问责机制，而不能
仅仅依靠技术公司的自我约束。
</code></pre>
<p><em>Dịch nghĩa:</em> Trí tuệ nhân tạo được gọi là con dao hai lưỡi: giả sử thuật toán có thiên lệch, thì có thể vô tình khuếch đại sự bất công của xã hội; nói đây là vấn đề của bản thân công nghệ thì chẳng bằng nói là do thiếu cơ chế quy trách nhiệm. Nhìn từ góc độ đạo đức luân lý, dù là rò rỉ quyền riêng tư, an toàn dữ liệu, hay chỉnh sửa gen, đều cần xây dựng cơ chế quy trách nhiệm rõ ràng, chứ không thể chỉ dựa vào sự tự giác của các công ty công nghệ.</p>
<div class="callout"><span class="badge">Dáng lập luận</span> Chú ý cách chuyển từ "đổ lỗi cho công nghệ" sang "đổ lỗi cho cơ chế còn thiếu" bằng 与其说…不如说… — giám khảo HSK6 đánh giá cao cách tái định hướng này hơn nhiều so với câu khẳng định phẳng "AI nguy hiểm".</div>`,
  ]]);

const c3q = quiz('cic401-quiz-3', 'Quiz 3 — AI &amp; ethics|||Quiz 3 — AI &amp; đạo đức', [
  { id: 'q1', question: '"算法偏见" nghĩa là gì?', options: ['Định kiến/thiên lệch trong thuật toán', 'An toàn dữ liệu', 'Chỉnh sửa gen', 'Cơ chế quy trách nhiệm'], correctIndex: 0, explanation: '算法(thuật toán)+偏见(định kiến) = kết quả thuật toán thiên lệch, thường do dữ liệu huấn luyện thiên lệch.' },
  { id: 'q2', question: '"问责机制" nghĩa là gì?', options: ['Cơ chế quy trách nhiệm', 'Cơ chế bảo mật kỹ thuật', 'Cơ chế huy động vốn', 'Cơ chế đào tạo nhân sự'], correctIndex: 0, explanation: '问责(hỏi/truy trách nhiệm)+机制(cơ chế) = hệ thống xác định và xử lý ai chịu trách nhiệm khi có sai sót.' },
  { id: 'q3', question: 'Mẫu câu "与其说…不如说…" dùng để làm gì?', options: ['Điều chỉnh lại một phát biểu cho chính xác/đúng bản chất hơn', 'Đưa ra một ví dụ minh hoạ cụ thể', 'Kết luận toàn bộ bài viết', 'Diễn tả một điều kiện giả định'], correctIndex: 0, explanation: '与其说A不如说B — phủ nhận nhẹ cách nói A để khẳng định cách nói B mô tả đúng bản chất hơn.' },
]);

const c4 = doc('cic401-4-1-philosophy', 'Chapter 4 — Philosophy &amp; traditional Chinese thought|||Chương 4 — Triết học &amp; tư tưởng truyền thống Trung Hoa',
  'Khái niệm cốt lõi Nho-Đạo (中庸之道, 天人合一, 无为而治…); mẫu câu 正如…所说, 既是…又是…, 归根结底.',
  [[
    `<span class="eyebrow">CIC401 · Chapter 4 · Lesson 4</span>
<h2>Philosophy &amp; traditional Chinese thought</h2>
<p class="lead">Beyond simply naming the schools (Confucianism, Taoism — covered earlier), this chapter goes into their core <strong>doctrines</strong>: the actual concepts HSK6 reading passages quote and contrast.</p>
<h3>Core vocabulary (核心词汇)</h3>
<pre><code>儒家 (rújiā) — Confucianism
道家 (dàojiā) — Taoism
中庸之道 (zhōngyōng zhī dào) — the doctrine of the mean
天人合一 (tiān rén hé yī) — unity of heaven and man
仁义礼智信 (rén yì lǐ zhì xìn) — the five constant virtues
无为而治 (wúwéi ér zhì) — govern by non-action
阴阳 (yīnyáng) — yin and yang
知行合一 (zhī xíng hé yī) — unity of knowledge and action
</code></pre>
<h3>HSK6 sentence patterns (句型)</h3>
<ul>
<li><strong>正如…所说</strong> (zhèngrú… suǒ shuō) — "just as … said". <em>正如孔子所说，"过犹不及"，凡事都应讲究中庸之道。</em></li>
<li><strong>既是…又是…</strong> (jì shì… yòu shì…) — "is both … and …". <em>阴阳既是对立的，又是相互依存的两个方面。</em></li>
<li><strong>归根结底</strong> (guīgēn jiédǐ) — "in the final analysis". <em>归根结底，儒家思想强调的是人与人之间的道德责任。</em></li>
</ul>
<h3>Reading: the doctrine of the mean (中庸之道)</h3>
<pre><code>儒家提倡中庸之道，主张凡事不偏不倚、过犹不及；道家则崇尚
无为而治，追求天人合一的境界。正如古人所说，两者虽然出发
点不同，但归根结底都在探讨人应该如何与自然、与社会和谐相
处。
</code></pre>
<p><em>Translation:</em> Confucianism advocates the doctrine of the mean, holding that in all things one should avoid extremes — "too much is as bad as too little." Taoism, meanwhile, champions governing through non-action, pursuing the state of unity between heaven and man. As the ancients said, though the two schools start from different premises, in the final analysis both explore how people should live in harmony with nature and society.</p>
<div class="callout"><span class="badge">Reading strategy</span> When a passage opens with 儒家/道家 plus a four-character concept (中庸之道, 无为而治), expect the paragraph to <em>contrast</em> the two schools — scan for 而/但/则 to find the pivot.</div>`,
    `<span class="eyebrow">CIC401 · Chương 4 · Bài 4</span>
<h2>Triết học &amp; tư tưởng truyền thống Trung Hoa</h2>
<p class="lead">Ngoài việc chỉ gọi tên các trường phái (Nho gia, Đạo gia — đã học trước đó), chương này đi vào <strong>học thuyết cốt lõi</strong> của chúng: những khái niệm thực sự được bài đọc HSK6 trích dẫn và đối chiếu.</p>
<h3>Từ vựng trọng tâm (核心词汇)</h3>
<pre><code>儒家 (rújiā) — Nho gia
道家 (dàojiā) — Đạo gia
中庸之道 (zhōngyōng zhī dào) — đạo trung dung
天人合一 (tiān rén hé yī) — thiên nhân hợp nhất
仁义礼智信 (rén yì lǐ zhì xìn) — nhân, nghĩa, lễ, trí, tín
无为而治 (wúwéi ér zhì) — vô vi nhi trị
阴阳 (yīnyáng) — âm dương
知行合一 (zhī xíng hé yī) — tri hành hợp nhất
</code></pre>
<h3>Mẫu câu HSK6 (句型)</h3>
<ul>
<li><strong>正如…所说</strong> (zhèngrú… suǒ shuō) — "đúng như… đã nói". <em>正如孔子所说，"过犹不及"，凡事都应讲究中庸之道。</em> (Đúng như Khổng Tử đã nói, "thái quá cũng như bất cập", mọi việc đều nên chú trọng đạo trung dung.)</li>
<li><strong>既是…又是…</strong> (jì shì… yòu shì…) — "vừa là… vừa là…". <em>阴阳既是对立的，又是相互依存的两个方面。</em> (Âm dương vừa là hai mặt đối lập, vừa là hai mặt phụ thuộc lẫn nhau.)</li>
<li><strong>归根结底</strong> (guīgēn jiédǐ) — "suy cho cùng". <em>归根结底，儒家思想强调的是人与人之间的道德责任。</em> (Suy cho cùng, tư tưởng Nho gia nhấn mạnh trách nhiệm đạo đức giữa người với người.)</li>
</ul>
<h3>Đọc hiểu: đạo trung dung (中庸之道)</h3>
<pre><code>儒家提倡中庸之道，主张凡事不偏不倚、过犹不及；道家则崇尚
无为而治，追求天人合一的境界。正如古人所说，两者虽然出发
点不同，但归根结底都在探讨人应该如何与自然、与社会和谐相
处。
</code></pre>
<p><em>Dịch nghĩa:</em> Nho gia đề xướng đạo trung dung, chủ trương mọi việc không thiên lệch, thái quá cũng như bất cập; còn Đạo gia thì tôn sùng vô vi nhi trị, theo đuổi cảnh giới thiên nhân hợp nhất. Đúng như người xưa đã nói, tuy điểm xuất phát của hai trường phái khác nhau, nhưng suy cho cùng đều bàn về việc con người nên sống hài hoà với tự nhiên và xã hội như thế nào.</p>
<div class="callout"><span class="badge">Chiến thuật đọc hiểu</span> Khi đoạn văn mở đầu bằng 儒家/道家 kèm một khái niệm bốn chữ (中庸之道, 无为而治), hãy chờ đoạn văn <em>đối chiếu</em> hai trường phái — quét chữ 而/但/则 để tìm điểm bản lề.</div>`,
  ]]);

const c4q = quiz('cic401-quiz-4', 'Quiz 4 — Philosophy|||Quiz 4 — Triết học', [
  { id: 'q1', question: '"无为而治" là tư tưởng đặc trưng của trường phái nào?', options: ['Đạo gia', 'Nho gia', 'Pháp gia', 'Mặc gia'], correctIndex: 0, explanation: '无为而治 (vô vi nhi trị) — "cai trị bằng không hành động cưỡng ép" — là tư tưởng cốt lõi của Đạo gia.' },
  { id: 'q2', question: '"归根结底" nghĩa gần nhất là gì?', options: ['Suy cho cùng, xét đến cùng', 'Ngược lại hoàn toàn', 'Trước hết, đầu tiên', 'Nói cách khác'], correctIndex: 0, explanation: '归(quy về)+根(gốc)+结底(kết đáy) = quy về cái gốc/đáy cùng — "suy cho cùng".' },
  { id: 'q3', question: 'Mẫu câu "正如…所说" dùng để làm gì?', options: ['Trích dẫn lời một ai đó để làm luận cứ củng cố quan điểm', 'Phủ định hoàn toàn một quan điểm', 'Đặt một câu hỏi tu từ', 'Nêu điều kiện giả định'], correctIndex: 0, explanation: '正如(đúng như)…所说(đã nói) = dẫn lời người khác (thường là danh nhân) để làm căn cứ cho lập luận.' },
]);

const c5 = doc('cic401-5-1-literature', 'Chapter 5 — Classic &amp; modern Chinese literature|||Chương 5 — Văn học kinh điển &amp; hiện đại',
  'Văn học hiện thực phê phán, tiểu thuyết (乡土文学, 批判现实主义…); mẫu câu 通过…表达了…, 字里行间, 令人深思.',
  [[
    `<span class="eyebrow">CIC401 · Chapter 5 · Lesson 5</span>
<h2>Classic &amp; modern Chinese literature</h2>
<p class="lead">Where earlier chapters trained poetry and visual-art vocabulary, this chapter turns to the <strong>novel</strong>: the Four Great Classical Novels, and the critical-realist fiction of the New Culture Movement.</p>
<h3>Core vocabulary (核心词汇)</h3>
<pre><code>四大名著 (sì dà míngzhù) — the Four Great Classical Novels
白话文 (báihuàwén) — vernacular written Chinese
人物塑造 (rénwù sùzào) — characterization
悲剧色彩 (bēijù sècǎi) — tragic tone
讽刺 (fěngcì) — satire
批判现实主义 (pīpàn xiànshí zhǔyì) — critical realism
乡土文学 (xiāngtǔ wénxué) — native-soil (rural) literature
文学流派 (wénxué liúpài) — literary school
</code></pre>
<h3>HSK6 sentence patterns (句型)</h3>
<ul>
<li><strong>通过…表达了…</strong> (tōngguò… biǎodá le…) — "through …, [the author] expressed …". <em>作者通过细腻的人物塑造，表达了对旧社会的深刻批判。</em></li>
<li><strong>字里行间</strong> (zìlǐ hángjiān) — "between the lines". <em>字里行间充满悲剧色彩，读来令人深思。</em></li>
<li><strong>令人深思</strong> (lìng rén shēnsī) — "thought-provoking". <em>小说结尾的悲剧色彩令人深思。</em></li>
</ul>
<h3>Reading: Lu Xun's critical realism (鲁迅与批判现实主义)</h3>
<pre><code>鲁迅是中国现代乡土文学与批判现实主义的代表作家，属于新文化
运动中最具影响力的文学流派之一。他善于通过细腻的人物塑造和
犀利的讽刺，表达了对旧社会的深刻批判；字里行间充满悲剧色彩，
读来令人深思。
</code></pre>
<p><em>Translation:</em> Lu Xun is a representative writer of modern Chinese native-soil literature and critical realism, belonging to one of the most influential literary schools of the New Culture Movement. He was skilled at using delicate characterization and sharp satire to express profound critique of the old society; between the lines the writing is thick with tragic tone, and reading it is deeply thought-provoking.</p>
<div class="callout"><span class="badge">Inference skill</span> Literature passages rarely state the theme directly — look for 通过…表达了…的批判/赞美 (the author's stance) and 字里行间 (the implied feeling) to answer "what does the author intend?" questions.</div>`,
    `<span class="eyebrow">CIC401 · Chương 5 · Bài 5</span>
<h2>Văn học kinh điển &amp; hiện đại</h2>
<p class="lead">Nếu các chương trước rèn từ vựng thơ ca và nghệ thuật thị giác, chương này chuyển sang <strong>tiểu thuyết</strong>: Tứ đại danh tác, và văn học hiện thực phê phán của phong trào Tân Văn hoá.</p>
<h3>Từ vựng trọng tâm (核心词汇)</h3>
<pre><code>四大名著 (sì dà míngzhù) — tứ đại danh tác
白话文 (báihuàwén) — văn bạch thoại
人物塑造 (rénwù sùzào) — xây dựng nhân vật
悲剧色彩 (bēijù sècǎi) — sắc thái bi kịch
讽刺 (fěngcì) — châm biếm
批判现实主义 (pīpàn xiànshí zhǔyì) — chủ nghĩa hiện thực phê phán
乡土文学 (xiāngtǔ wénxué) — văn học hương thổ (nông thôn)
文学流派 (wénxué liúpài) — trường phái văn học
</code></pre>
<h3>Mẫu câu HSK6 (句型)</h3>
<ul>
<li><strong>通过…表达了…</strong> (tōngguò… biǎodá le…) — "thông qua…, [tác giả] đã bày tỏ…". <em>作者通过细腻的人物塑造，表达了对旧社会的深刻批判。</em> (Thông qua việc xây dựng nhân vật tinh tế, tác giả đã bày tỏ sự phê phán sâu sắc đối với xã hội cũ.)</li>
<li><strong>字里行间</strong> (zìlǐ hángjiān) — "giữa các dòng chữ, ẩn trong câu chữ". <em>字里行间充满悲剧色彩，读来令人深思。</em> (Ẩn trong câu chữ tràn ngập sắc thái bi kịch, đọc lên khiến người ta suy ngẫm sâu sắc.)</li>
<li><strong>令人深思</strong> (lìng rén shēnsī) — "khiến người ta suy ngẫm sâu sắc". <em>小说结尾的悲剧色彩令人深思。</em> (Sắc thái bi kịch ở đoạn kết tiểu thuyết khiến người ta suy ngẫm sâu sắc.)</li>
</ul>
<h3>Đọc hiểu: Lỗ Tấn và chủ nghĩa hiện thực phê phán (鲁迅与批判现实主义)</h3>
<pre><code>鲁迅是中国现代乡土文学与批判现实主义的代表作家，属于新文化
运动中最具影响力的文学流派之一。他善于通过细腻的人物塑造和
犀利的讽刺，表达了对旧社会的深刻批判；字里行间充满悲剧色彩，
读来令人深思。
</code></pre>
<p><em>Dịch nghĩa:</em> Lỗ Tấn là nhà văn tiêu biểu của văn học hương thổ và chủ nghĩa hiện thực phê phán trong văn học hiện đại Trung Quốc, thuộc một trong những trường phái văn học có ảnh hưởng nhất của phong trào Tân Văn hoá. Ông giỏi dùng nghệ thuật xây dựng nhân vật tinh tế và ngòi bút châm biếm sắc sảo để bày tỏ sự phê phán sâu sắc đối với xã hội cũ; ẩn trong câu chữ tràn ngập sắc thái bi kịch, đọc lên khiến người ta suy ngẫm sâu sắc.</p>
<div class="callout"><span class="badge">Kỹ năng suy luận</span> Đoạn văn học hiếm khi nói thẳng chủ đề — hãy tìm 通过…表达了…的批判/赞美 (lập trường của tác giả) và 字里行间 (cảm xúc ngầm ẩn) để trả lời câu hỏi "tác giả có dụng ý gì?".</div>`,
  ]]);

const c5q = quiz('cic401-quiz-5', 'Quiz 5 — Literature|||Quiz 5 — Văn học', [
  { id: 'q1', question: '"乡土文学" nghĩa là gì?', options: ['Văn học hương thổ / nông thôn', 'Văn học lãng mạn thành thị', 'Văn học trinh thám', 'Văn học thần thoại'], correctIndex: 0, explanation: '乡土(quê hương, đất đai)+文学(văn học) = dòng văn học viết về nông thôn và đời sống bản địa.' },
  { id: 'q2', question: '"字里行间" dùng để diễn tả điều gì khi phân tích văn học?', options: ['Ý nghĩa/cảm xúc ẩn giữa các câu chữ, không nói thẳng ra', 'Số lượng chữ trong bài viết', 'Tên và tiểu sử tác giả', 'Thể loại của văn bản (thơ/văn xuôi)'], correctIndex: 0, explanation: '字里行间 nghĩa đen "giữa các chữ, giữa các dòng" — chỉ ý/tình ẩn trong cách viết, không nói trực tiếp.' },
  { id: 'q3', question: '"批判现实主义" là trường phái văn học đặc trưng bởi điều gì?', options: ['Phê phán các vấn đề xã hội hiện thực qua tác phẩm', 'Ca ngợi thiên nhiên một cách thuần tuý', 'Kể chuyện thần tiên, kỳ ảo', 'Chỉ miêu tả tình yêu lãng mạn'], correctIndex: 0, explanation: '批判(phê phán)+现实主义(chủ nghĩa hiện thực) = dùng ngòi bút hiện thực để phê phán xã hội, như Lỗ Tấn.' },
]);

const c6 = doc('cic401-6-1-argumentation', 'Chapter 6 — Argumentative language &amp; critical thinking|||Chương 6 — Ngôn ngữ chính luận &amp; phản biện',
  'Từ vựng lỗi lập luận (逻辑漏洞, 以偏概全, 循环论证…); mẫu câu 诚然…但是…, 不难看出, 值得商榷的是.',
  [[
    `<span class="eyebrow">CIC401 · Chapter 6 · Lesson 6</span>
<h2>Argumentative language &amp; critical thinking</h2>
<p class="lead">Beyond the basics of thesis/evidence and news-citation phrasing (covered earlier), this chapter names the <strong>logical flaws</strong> a strong HSK6 essay must recognize and avoid — the vocabulary of critique itself.</p>
<h3>Core vocabulary (核心词汇)</h3>
<pre><code>逻辑漏洞 (luójí lòudòng) — logical loophole/flaw
偷换概念 (tōuhuàn gàiniàn) — equivocation (switching concepts mid-argument)
以偏概全 (yǐpiān gàiquán) — hasty generalization
循环论证 (xúnhuán lùnzhèng) — circular reasoning
稻草人论证 (dàocǎorén lùnzhèng) — straw man argument
人身攻击 (rénshēn gōngjī) — ad hominem attack
站得住脚 (zhàndezhùjiǎo) — to hold up under scrutiny
有说服力 (yǒu shuōfúlì) — persuasive
</code></pre>
<h3>HSK6 sentence patterns (句型)</h3>
<ul>
<li><strong>诚然…但是…</strong> (chéngrán… dànshì…) — "admittedly … but …" (concede then pivot). <em>诚然，情绪化的表达更容易引起共鸣，但是缺乏证据的观点很难说是有说服力的。</em></li>
<li><strong>不难看出</strong> (bù nán kànchū) — "it is not hard to see that …". <em>不难看出，真正站得住脚的论证靠的是严密的逻辑。</em></li>
<li><strong>值得商榷的是</strong> (zhídé shāngquè de shì) — "what is debatable is …". <em>网络舆论是否总能分辨真假论证，仍是一个值得商榷的问题。</em></li>
</ul>
<h3>Reading: spotting a weak argument (辨别一个不成立的论证)</h3>
<pre><code>网络上讨论热点事件时，人们常常各执一词。有些反驳看似有理，
实际上却存在逻辑漏洞——比如偷换概念，或者用以偏概全的方式
得出结论。诚然，情绪化的表达更容易引起共鸣，但是缺乏证据支
持的观点很难说是有说服力的。不难看出，真正站得住脚的论证，
靠的是严密的逻辑，而不是循环论证或人身攻击。至于网络舆论是
否总能分辨真假论证，仍是一个值得商榷的问题。
</code></pre>
<p><em>Translation:</em> When discussing hot-button events online, people often each stick to their own view. Some rebuttals look reasonable but actually contain logical loopholes — such as equivocating on a concept, or reaching a conclusion through hasty generalization. Admittedly, emotional expression more easily strikes a chord, but a view lacking evidentiary support can hardly be called persuasive. It is not hard to see that a truly solid argument relies on rigorous logic, not circular reasoning or ad hominem attacks. As for whether online opinion can always tell real arguments from fake ones, that remains a debatable question.</p>
<div class="callout"><span class="badge">Exam tip</span> HSK6 sometimes gives a flawed mini-argument and asks you to name the flaw — knowing 偷换概念/以偏概全/循环论证/人身攻击 by name (not just "this is wrong") is what earns full marks.</div>`,
    `<span class="eyebrow">CIC401 · Chương 6 · Bài 6</span>
<h2>Ngôn ngữ chính luận &amp; phản biện</h2>
<p class="lead">Ngoài kiến thức nền về luận điểm/luận cứ và cách dẫn tin (đã học trước đó), chương này gọi tên các <strong>lỗi lập luận</strong> mà một bài luận HSK6 tốt phải nhận ra và tránh — chính là từ vựng của việc phản biện.</p>
<h3>Từ vựng trọng tâm (核心词汇)</h3>
<pre><code>逻辑漏洞 (luójí lòudòng) — lỗ hổng/kẽ hở logic
偷换概念 (tōuhuàn gàiniàn) — đánh lận khái niệm giữa lập luận
以偏概全 (yǐpiān gàiquán) — khái quát vội vàng (suy rộng từ cái riêng)
循环论证 (xúnhuán lùnzhèng) — lập luận vòng tròn
稻草人论证 (dàocǎorén lùnzhèng) — lập luận người nộm (bóp méo luận điểm đối phương)
人身攻击 (rénshēn gōngjī) — công kích cá nhân
站得住脚 (zhàndezhùjiǎo) — đứng vững được (khi bị chất vấn)
有说服力 (yǒu shuōfúlì) — có sức thuyết phục
</code></pre>
<h3>Mẫu câu HSK6 (句型)</h3>
<ul>
<li><strong>诚然…但是…</strong> (chéngrán… dànshì…) — "đúng là… nhưng…" (nhượng bộ rồi chuyển hướng). <em>诚然，情绪化的表达更容易引起共鸣，但是缺乏证据的观点很难说是有说服力的。</em> (Đúng là biểu đạt cảm tính dễ gây đồng cảm hơn, nhưng quan điểm thiếu bằng chứng thì khó gọi là có sức thuyết phục.)</li>
<li><strong>不难看出</strong> (bù nán kànchū) — "không khó để nhận ra rằng…". <em>不难看出，真正站得住脚的论证靠的是严密的逻辑。</em> (Không khó để nhận ra, một lập luận thực sự đứng vững phải dựa vào logic chặt chẽ.)</li>
<li><strong>值得商榷的是</strong> (zhídé shāngquè de shì) — "điều đáng cân nhắc/bàn thêm là…". <em>网络舆论是否总能分辨真假论证，仍是一个值得商榷的问题。</em> (Liệu dư luận mạng có luôn phân biệt được lập luận thật giả hay không, vẫn là một vấn đề đáng bàn thêm.)</li>
</ul>
<h3>Đọc hiểu: nhận diện một lập luận yếu (辨别一个不成立的论证)</h3>
<pre><code>网络上讨论热点事件时，人们常常各执一词。有些反驳看似有理，
实际上却存在逻辑漏洞——比如偷换概念，或者用以偏概全的方式
得出结论。诚然，情绪化的表达更容易引起共鸣，但是缺乏证据支
持的观点很难说是有说服力的。不难看出，真正站得住脚的论证，
靠的是严密的逻辑，而不是循环论证或人身攻击。至于网络舆论是
否总能分辨真假论证，仍是一个值得商榷的问题。
</code></pre>
<p><em>Dịch nghĩa:</em> Khi thảo luận về sự kiện nóng trên mạng, người ta thường ai giữ ý kiến của mình. Một số lời phản bác nghe có lý nhưng thực chất chứa lỗ hổng logic — chẳng hạn đánh lận khái niệm, hoặc dùng cách khái quát vội vàng để đưa ra kết luận. Đúng là biểu đạt cảm tính dễ gây đồng cảm hơn, nhưng quan điểm thiếu bằng chứng hỗ trợ thì khó gọi là có sức thuyết phục. Không khó để nhận ra, một lập luận thực sự đứng vững phải dựa vào logic chặt chẽ, không phải lập luận vòng tròn hay công kích cá nhân. Còn việc dư luận mạng có luôn phân biệt được lập luận thật giả hay không, vẫn là một vấn đề đáng bàn thêm.</p>
<div class="callout"><span class="badge">Mẹo thi</span> HSK6 đôi khi đưa một đoạn lập luận có lỗi và hỏi lỗi đó là gì — biết gọi tên 偷换概念/以偏概全/循环论证/人身攻击 (không chỉ nói "cái này sai") mới là điều được cho điểm tối đa.</div>`,
  ]]);

const c6q = quiz('cic401-quiz-6', 'Quiz 6 — Argumentation &amp; critical thinking|||Quiz 6 — Phản biện &amp; tư duy phê phán', [
  { id: 'q1', question: '"偷换概念" là một loại lỗi gì trong lập luận?', options: ['Đánh lận khái niệm giữa chừng lập luận để đánh lạc hướng', 'Trích dẫn nguồn tin chính xác', 'Đưa ra bằng chứng thống kê đầy đủ', 'Kết luận hợp lý dựa trên dữ liệu'], correctIndex: 0, explanation: '偷(lén)+换(đổi)+概念(khái niệm) — lén thay đổi nghĩa của một khái niệm giữa lập luận để lừa người nghe.' },
  { id: 'q2', question: '"以偏概全" nghĩa là gì?', options: ['Suy rộng từ một trường hợp riêng lẻ thành kết luận chung (khái quát vội vàng)', 'Nhìn nhận vấn đề đa chiều, khách quan', 'Trích dẫn nguồn tin chính thức', 'Phản bác có căn cứ vững vàng'], correctIndex: 0, explanation: '以偏(lấy cái lệch/riêng lẻ)+概全(khái quát toàn bộ) — lỗi lập luận dùng ví dụ nhỏ để kết luận cho cả tổng thể.' },
  { id: 'q3', question: '"循环论证" là lỗi lập luận như thế nào?', options: ['Dùng chính kết luận (hoặc một dạng của nó) để làm căn cứ chứng minh cho nó', 'Dùng số liệu thống kê sai lệch', 'Công kích cá nhân người phản đối thay vì luận điểm', 'Bỏ qua hoàn toàn bằng chứng đối lập'], correctIndex: 0, explanation: '循环(vòng tròn)+论证(lập luận) — lập luận quay lại chính nó, không thực sự chứng minh được gì mới.' },
]);

const c7 = doc('cic401-7-1-idioms', 'Chapter 7 — Idioms, allusions &amp; cultural metaphor|||Chương 7 — Thành ngữ, điển cố &amp; ẩn dụ văn hoá',
  '10 thành ngữ HSK6 mới (画龙点睛, 破釜沉舟, 未雨绸缪, 前车之鉴…) kèm điển tích và cách dùng trong văn viết.',
  [[
    `<span class="eyebrow">CIC401 · Chapter 7 · Lesson 7</span>
<h2>Idioms, allusions &amp; cultural metaphor</h2>
<p class="lead">A 成语 (four-character idiom) packs a whole story into four syllables. This chapter's ten idioms are new ground — different stories from the ones covered earlier in the CIC track.</p>
<h3>Ten HSK6 idioms (十个成语)</h3>
<pre><code>画龙点睛 (huàlóng diǎnjīng) — dot the dragon's eye (the finishing touch)
杯弓蛇影 (bēigōng shéyǐng) — mistake a bow's reflection for a snake (needless paranoia)
刻舟求剑 (kèzhōu qiújiàn) — mark the boat to find the sword (rigid, outdated thinking)
破釜沉舟 (pòfǔ chénzhōu) — smash the pots, sink the boats (burn your bridges, commit fully)
掩耳盗铃 (yǎn'ěr dàolíng) — cover your ears while stealing a bell (self-deception)
望梅止渴 (wàngméi zhǐkě) — gaze at plums to quench thirst (comfort via illusion)
熟能生巧 (shúnéngshēngqiǎo) — practice makes perfect
前车之鉴 (qiánchē zhī jiàn) — the overturned cart ahead (a lesson from past failure)
未雨绸缪 (wèiyǔ chóumóu) — mend the roof before it rains (plan ahead)
一箭双雕 (yījiàn shuāngdiāo) — one arrow, two hawks (kill two birds with one stone)
</code></pre>
<h3>Using idioms in formal writing</h3>
<p>成语 replace whole clauses: instead of "他不愿意承认问题存在" you can write <strong>他这样做纯粹是掩耳盗铃</strong>. Instead of "他下定决心，不留退路" you can write <strong>他破釜沉舟，决心一搏</strong>. This compression is exactly what HSK6's summary-writing task rewards.</p>
<h3>Reading: a lesson learned (一次教训)</h3>
<pre><code>他起初做事总是掩耳盗铃，不愿正视问题；后来因为没有未雨绸缪
而吃了大亏，这次失败成了他的前车之鉴。从此他破釜沉舟，全力
以赴，最终画龙点睛般地完成了整个项目。
</code></pre>
<p><em>Translation:</em> At first he always deceived himself, refusing to face problems directly; later, because he failed to plan ahead, he suffered a great loss, and this failure became a lesson for him. From then on he burned his bridges and gave everything, finally putting the finishing touch that brought the whole project to life.</p>
<div class="callout"><span class="badge">Memory hook</span> Group idioms by the emotion they carry: <strong>self-deception</strong> (掩耳盗铃, 望梅止渴), <strong>rigid thinking</strong> (刻舟求剑, 杯弓蛇影), <strong>commitment/preparation</strong> (破釜沉舟, 未雨绸缪, 熟能生巧) — recalling the group is faster than recalling each idiom alone.</div>`,
    `<span class="eyebrow">CIC401 · Chương 7 · Bài 7</span>
<h2>Thành ngữ, điển cố &amp; ẩn dụ văn hoá</h2>
<p class="lead">Một 成语 (thành ngữ bốn chữ) gói cả một câu chuyện vào bốn âm tiết. Mười thành ngữ trong chương này là vùng đất mới — những câu chuyện khác với các thành ngữ đã học ở các môn CIC trước.</p>
<h3>Mười thành ngữ HSK6 (十个成语)</h3>
<pre><code>画龙点睛 (huàlóng diǎnjīng) — vẽ rồng điểm mắt (nét hoàn thiện làm sống dậy cả bức tranh)
杯弓蛇影 (bēigōng shéyǐng) — cung với chén ngỡ rắn (nghi hoặc không cần thiết)
刻舟求剑 (kèzhōu qiújiàn) — khắc mạn thuyền tìm gươm (tư duy cứng nhắc, lỗi thời)
破釜沉舟 (pòfǔ chénzhōu) — phá nồi chìm thuyền (quyết tâm không đường lui)
掩耳盗铃 (yǎn'ěr dàolíng) — bịt tai trộm chuông (tự lừa dối bản thân)
望梅止渴 (wàngméi zhǐkě) — ngóng mơ giải khát (tự an ủi bằng ảo tưởng)
熟能生巧 (shúnéngshēngqiǎo) — quen tay hay việc (luyện tập nhiều thành khéo)
前车之鉴 (qiánchē zhī jiàn) — xe trước đổ, xe sau tránh (bài học từ thất bại trước)
未雨绸缪 (wèiyǔ chóumóu) — chưa mưa đã lo buộc mái (chuẩn bị trước khi việc xảy ra)
一箭双雕 (yījiàn shuāngdiāo) — một mũi tên, hai chim ưng (một công đôi việc)
</code></pre>
<h3>Dùng thành ngữ trong văn viết trang trọng</h3>
<p>成语 thay thế cả mệnh đề: thay vì viết "他不愿意承认问题存在" (anh ta không muốn thừa nhận vấn đề tồn tại) bạn có thể viết <strong>他这样做纯粹是掩耳盗铃</strong>. Thay vì "他下定决心，不留退路" (anh ta quyết tâm, không để đường lui) bạn có thể viết <strong>他破釜沉舟，决心一搏</strong>. Đây chính là kiểu nén ý mà phần thi viết tóm tắt HSK6 đánh giá cao.</p>
<h3>Đọc hiểu: một bài học (一次教训)</h3>
<pre><code>他起初做事总是掩耳盗铃，不愿正视问题；后来因为没有未雨绸缪
而吃了大亏，这次失败成了他的前车之鉴。从此他破釜沉舟，全力
以赴，最终画龙点睛般地完成了整个项目。
</code></pre>
<p><em>Dịch nghĩa:</em> Ban đầu anh ta làm việc luôn tự lừa dối bản thân, không muốn đối mặt trực tiếp với vấn đề; sau đó vì không chuẩn bị trước mà chịu thiệt hại lớn, lần thất bại này trở thành bài học cho anh. Từ đó anh quyết tâm phá nồi chìm thuyền, dốc toàn lực, cuối cùng hoàn thành cả dự án với một nét hoàn thiện làm sống dậy tất cả.</p>
<div class="callout"><span class="badge">Mẹo ghi nhớ</span> Nhóm thành ngữ theo cảm xúc chúng mang: <strong>tự lừa dối</strong> (掩耳盗铃, 望梅止渴), <strong>tư duy cứng nhắc</strong> (刻舟求剑, 杯弓蛇影), <strong>quyết tâm/chuẩn bị</strong> (破釜沉舟, 未雨绸缪, 熟能生巧) — nhớ theo nhóm nhanh hơn nhớ từng thành ngữ riêng lẻ.</div>`,
  ]]);

const c7q = quiz('cic401-quiz-7', 'Quiz 7 — Idioms &amp; cultural metaphor|||Quiz 7 — Thành ngữ &amp; ẩn dụ văn hoá', [
  { id: 'q1', question: 'Thành ngữ "未雨绸缪" khuyên điều gì?', options: ['Chuẩn bị trước khi việc xấu xảy ra', 'Hành động liều lĩnh không tính toán', 'Chờ đợi vận may từ trên trời rơi xuống', 'Sao chép cách làm của người khác'], correctIndex: 0, explanation: '未(chưa)+雨(mưa)+绸缪(buộc chặt, chuẩn bị) — lo buộc mái nhà trước khi mưa đến, tức chuẩn bị từ sớm.' },
  { id: 'q2', question: 'Thành ngữ nào có nghĩa "tự lừa dối bản thân, không muốn đối mặt sự thật"?', options: ['掩耳盗铃', '画龙点睛', '一箭双雕', '熟能生巧'], correctIndex: 0, explanation: '掩(bịt)+耳(tai)+盗(trộm)+铃(chuông) — bịt tai mình lại rồi trộm chuông, tưởng người khác không nghe thấy như mình.' },
  { id: 'q3', question: '"前车之鉴" dùng để chỉ điều gì?', options: ['Bài học/lời cảnh báo rút ra từ một thất bại trước đó', 'Một chiến thắng vẻ vang, đáng tự hào', 'Một kế hoạch được cho là hoàn hảo', 'Một lời khen ngợi chân thành'], correctIndex: 0, explanation: '前车(xe đi trước)+之鉴(bài học) — xe trước lật đổ là lời cảnh báo cho xe đi sau, tức bài học từ thất bại người/việc trước.' },
]);

const c8 = doc('cic401-8-1-hsk6-review', 'Chapter 8 — HSK6 review: academic writing, deep reading &amp; synthesis|||Chương 8 — Ôn tập HSK6: viết luận học thuật, đọc hiểu chuyên sâu &amp; tổng hợp',
  'Khung bài luận nghị luận 5 đoạn, chiến thuật đọc hiểu, bảng tổng hợp mẫu câu 7 chương, đoạn kết luận mẫu.',
  [[
    `<span class="eyebrow">CIC401 · Chapter 8 · Lesson 8</span>
<h2>HSK6 review: academic writing, deep reading &amp; synthesis</h2>
<p class="lead">The final chapter consolidates Chapters 1-7 of this course into exam-ready skills: writing a five-paragraph argumentative essay (议论文), reading strategically under time pressure, and recognizing which sentence pattern each paragraph needs.</p>
<h3>Essay skeleton (议论文结构)</h3>
<pre><code>1. 引言 (introduction) — state the topic + your 论点 (thesis)
2. 正方论证 (supporting argument) — evidence + example, e.g. 只有…才能…
3. 让步与反驳 (concession &amp; rebuttal) — 诚然…但是…
4. 深化 (deepen) — 与其说…不如说… / 从…角度来看
5. 结论 (conclusion) — 综上所述 / 归根结底
</code></pre>
<h3>Reading strategy checklist (阅读策略)</h3>
<ul>
<li><strong>Skim first</strong> — read the first and last sentence of each paragraph before reading in full; topic sentences carry the 论点.</li>
<li><strong>Watch the pivot words</strong> — 而/但是/然而/却 mark where an argument turns; the sentence right after usually holds the real point.</li>
<li><strong>Idioms as compression</strong> — a 成语 (掩耳盗铃, 破釜沉舟) often IS the answer; don't skip over it as decoration.</li>
<li><strong>Infer the author's stance</strong> — look for 表达了/批判了/肯定了 near the end of a passage.</li>
</ul>
<h3>Grammar patterns from Chapters 1–7 (七章句型总表)</h3>
<pre><code>Ch1 不仅仅是…更是…  /  说到底  /  不容忽视的是
Ch2 在…的背景下  /  只有…才能…  /  以…为核心
Ch3 假如/倘若…就…  /  与其说…不如说…  /  从…角度来看
Ch4 正如…所说  /  既是…又是…  /  归根结底
Ch5 通过…表达了…  /  字里行间  /  令人深思
Ch6 诚然…但是…  /  不难看出  /  值得商榷的是
Ch7 (十个成语 as ready-made metaphors — see Chapter 7)
</code></pre>
<h3>Model closing paragraph (结论段示例)</h3>
<pre><code>综上所述，无论是社会现象、经济创新，还是科技伦理，归根结底
都需要我们从多个角度来看，权衡利弊，理性判断，而不是人云亦
云、以偏概全。
</code></pre>
<p><em>Translation:</em> In summary, whether the topic is a social phenomenon, economic innovation, or technology ethics, in the final analysis we need to look at it from multiple angles, weigh the pros and cons, and judge rationally — rather than merely echoing others or generalizing from one-sided evidence.</p>
<div class="callout"><span class="badge">Exam-day tip</span> Memorize ONE version of this closing skeleton (综上所述, 无论…还是…, 归根结底, 而不是…以偏概全) and adapt its topic words — a strong, reusable conclusion is worth more points than an ambitious but shaky one improvised under time pressure.</div>`,
    `<span class="eyebrow">CIC401 · Chương 8 · Bài 8</span>
<h2>Ôn tập HSK6: viết luận học thuật, đọc hiểu chuyên sâu &amp; tổng hợp</h2>
<p class="lead">Chương cuối gom lại kỹ năng từ Chương 1-7 của môn này thành bộ công cụ sẵn sàng cho kỳ thi: viết bài luận nghị luận năm đoạn (议论文), đọc hiểu có chiến thuật dưới áp lực thời gian, và nhận diện mẫu câu nào phù hợp cho từng đoạn.</p>
<h3>Khung bài luận (议论文结构)</h3>
<pre><code>1. 引言 (mở bài) — nêu chủ đề + 论点 (luận điểm) của bạn
2. 正方论证 (luận chứng ủng hộ) — bằng chứng + ví dụ, vd 只有…才能…
3. 让步与反驳 (nhượng bộ &amp; phản bác) — 诚然…但是…
4. 深化 (đào sâu) — 与其说…不如说… / 从…角度来看
5. 结论 (kết luận) — 综上所述 / 归根结底
</code></pre>
<h3>Danh sách chiến thuật đọc hiểu (阅读策略)</h3>
<ul>
<li><strong>Đọc lướt trước</strong> — đọc câu đầu và câu cuối mỗi đoạn trước khi đọc toàn bộ; câu chủ đề thường mang 论点.</li>
<li><strong>Chú ý từ bản lề</strong> — 而/但是/然而/却 đánh dấu chỗ lập luận chuyển hướng; câu ngay sau đó thường chứa ý chính thật sự.</li>
<li><strong>Thành ngữ là sự nén ý</strong> — một 成语 (掩耳盗铃, 破釜沉舟) thường CHÍNH LÀ đáp án; đừng bỏ qua nó như một chi tiết trang trí.</li>
<li><strong>Suy luận lập trường tác giả</strong> — tìm 表达了/批判了/肯定了 gần cuối đoạn văn.</li>
</ul>
<h3>Bảng tổng hợp mẫu câu Chương 1-7 (七章句型总表)</h3>
<pre><code>Ch1 不仅仅是…更是…  /  说到底  /  不容忽视的是
Ch2 在…的背景下  /  只有…才能…  /  以…为核心
Ch3 假如/倘若…就…  /  与其说…不如说…  /  从…角度来看
Ch4 正如…所说  /  既是…又是…  /  归根结底
Ch5 通过…表达了…  /  字里行间  /  令人深思
Ch6 诚然…但是…  /  不难看出  /  值得商榷的是
Ch7 (十个成语 dùng như ẩn dụ có sẵn — xem Chương 7)
</code></pre>
<h3>Đoạn kết luận mẫu (结论段示例)</h3>
<pre><code>综上所述，无论是社会现象、经济创新，还是科技伦理，归根结底
都需要我们从多个角度来看，权衡利弊，理性判断，而不是人云亦
云、以偏概全。
</code></pre>
<p><em>Dịch nghĩa:</em> Tóm lại, dù là hiện tượng xã hội, đổi mới kinh tế, hay đạo đức công nghệ, suy cho cùng chúng ta đều cần nhìn từ nhiều góc độ, cân nhắc lợi hại, phán đoán lý trí — chứ không phải hùa theo người khác hay khái quát vội vàng, phiến diện.</p>
<div class="callout"><span class="badge">Mẹo ngày thi</span> Hãy thuộc lòng MỘT phiên bản khung kết luận này (综上所述, 无论…还是…, 归根结底, 而不是…以偏概全) rồi thay từ khoá chủ đề — một kết luận vững chắc, tái sử dụng được có giá trị điểm số cao hơn một kết luận tham vọng nhưng lung lay vì ứng biến vội dưới áp lực thời gian.</div>`,
  ]]);

const c8q = quiz('cic401-quiz-8', 'Quiz 8 — HSK6 review|||Quiz 8 — Ôn tập HSK6', [
  { id: 'q1', question: 'Trong khung 5 đoạn của bài nghị luận (议论文), đoạn "让步与反驳" nằm ở vị trí nào?', options: ['Đoạn 3, sau luận chứng ủng hộ và trước phần đào sâu', 'Đoạn mở bài đầu tiên', 'Đoạn kết luận cuối cùng', 'Không thuộc cấu trúc bài nghị luận'], correctIndex: 0, explanation: 'Khung 5 đoạn: mở bài → luận chứng ủng hộ → nhượng bộ &amp; phản bác → đào sâu → kết luận.' },
  { id: 'q2', question: 'Chiến thuật đọc hiểu HSK6 khuyên nên chú ý từ nào để tìm điểm "bản lề" của lập luận?', options: ['而/但是/然而/却', '的/了/吗/呢', '一/二/三/四', '很/太/非常/特别'], correctIndex: 0, explanation: 'Các từ chuyển ý như 而/但是/然而/却 đánh dấu chỗ lập luận đổi hướng — câu sau đó thường chứa ý chính.' },
  { id: 'q3', question: 'Vì sao nên thuộc sẵn MỘT khung kết luận (综上所述…归根结底…) thay vì ứng biến mỗi lần?', options: ['Vì một kết luận vững chắc, tái sử dụng được ăn điểm cao hơn ứng biến vội vàng dưới áp lực thời gian', 'Vì giám khảo chỉ chấm điểm đoạn kết luận', 'Vì đề thi không cho phép viết kết luận khác nhau giữa các bài', 'Vì từ vựng trong đoạn kết luận không được lặp lại ở đoạn khác'], correctIndex: 0, explanation: 'Một khung kết luận đã luyện kỹ giúp tránh lỗi cấu trúc/ngữ pháp khi viết vội trong thời gian thi có hạn.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CIC401',
    slug: 'cic401-advanced-integrated-chinese',
    title: 'Advanced Integrated Chinese',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CIC401.webp',
    shortDescription: 'Advanced HSK5-6 Chinese, final CIC course: internet-age social commentary, startups &amp; innovation, AI ethics, Confucian/Taoist thought, critical-realist literature, logical-fallacy critique, 10 new idioms, HSK6 essay &amp; reading review.|||Tiếng Trung nâng cao HSK5-6, môn cuối chuỗi CIC: bình luận xã hội thời internet, khởi nghiệp, đạo đức AI, triết học Nho-Đạo, văn học hiện thực phê phán, phản biện logic, 10 thành ngữ mới, ôn viết luận &amp; đọc hiểu HSK6.',
    description: 'Môn <strong>CIC401 — Advanced Integrated Chinese</strong> (ngành Ngôn ngữ Trung, kỳ 4) là môn <strong>cuối cùng của chuỗi CIC (301→302→303→401)</strong>, đưa trình độ lên đỉnh HSK6 qua 8 chương KHÔNG lặp lại nội dung các môn trước: <strong>vấn đề xã hội đương đại &amp; bình luận</strong> (内卷, 躺平, 信息茧房), <strong>kinh tế, đổi mới &amp; khởi nghiệp</strong> (独角兽企业, 颠覆式创新), <strong>khoa học, AI &amp; đạo đức</strong> (算法偏见, 问责机制), <strong>triết học &amp; tư tưởng truyền thống</strong> (中庸之道, 天人合一), <strong>văn học kinh điển &amp; hiện đại</strong> (乡土文学, 批判现实主义), <strong>ngôn ngữ chính luận &amp; phản biện</strong> (逻辑漏洞, 以偏概全), <strong>10 thành ngữ &amp; ẩn dụ văn hoá mới</strong>, và <strong>ôn tập HSK6</strong> (khung bài luận, chiến thuật đọc hiểu, bảng tổng hợp mẫu câu). Mỗi chương có chữ Hán, pinyin có dấu thanh, nghĩa Việt/Anh, mẫu câu ngữ pháp nâng cao, bài đọc minh hoạ và quiz. Bám giáo trình <em>HSK Standard Course 6</em> (Đại học Ngôn ngữ Bắc Kinh) và <em>Developing Chinese Advanced Comprehensive</em>.',
    whatYouLearn: 'Từ vựng học thuật/trừu tượng HSK6 theo 8 chủ đề mới (内卷/躺平/信息茧房; 独角兽企业/颠覆式创新/估值; 算法偏见/问责机制; 中庸之道/天人合一/无为而治; 乡土文学/批判现实主义; 逻辑漏洞/以偏概全/循环论证; 10 thành ngữ mới; ôn HSK6); mẫu câu nâng cao: 不仅仅是…更是…, 说到底, 不容忽视的是, 在…的背景下, 只有…才能…, 以…为核心, 假如/倘若…就…, 与其说…不如说…, 从…角度来看, 正如…所说, 既是…又是…, 归根结底, 通过…表达了…, 字里行间, 令人深思, 诚然…但是…, 不难看出, 值得商榷的是; khung bài luận nghị luận 5 đoạn và chiến lược đọc hiểu học thuật cho kỳ thi HSK6.',
    requirements: 'Đã học xong CIC303 (hoặc đạt HSK5-6 tương đương): đọc hiểu 2.500+ từ vựng, nắm ngữ pháp trung-cao cấp. Đây là môn cuối cùng của chuỗi CIC, tiếp nối trực tiếp CIC303.',
  },
  sections: [
    { title: 'Chương 1 — Vấn đề xã hội đương đại &amp; bình luận|||Chapter 1 — Contemporary social issues &amp; commentary', description: '内卷, 躺平, 信息茧房; 不仅仅是…更是…, 说到底.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Kinh tế, đổi mới &amp; khởi nghiệp|||Chapter 2 — Economy, innovation &amp; entrepreneurship', description: '独角兽企业, 颠覆式创新, 估值; 在…的背景下, 只有…才能….', lessons: [c2, c2q] },
    { title: 'Chương 3 — Khoa học, trí tuệ nhân tạo &amp; đạo đức|||Chapter 3 — Science, AI &amp; ethics', description: '算法偏见, 问责机制, 双刃剑; 与其说…不如说….', lessons: [c3, c3q] },
    { title: 'Chương 4 — Triết học &amp; tư tưởng truyền thống Trung Hoa|||Chapter 4 — Philosophy &amp; traditional Chinese thought', description: '中庸之道, 天人合一, 无为而治; 归根结底.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Văn học kinh điển &amp; hiện đại|||Chapter 5 — Classic &amp; modern Chinese literature', description: '乡土文学, 批判现实主义; 通过…表达了…, 字里行间.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ngôn ngữ chính luận &amp; phản biện|||Chapter 6 — Argumentative language &amp; critical thinking', description: '逻辑漏洞, 以偏概全, 循环论证; 诚然…但是….', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thành ngữ, điển cố &amp; ẩn dụ văn hoá|||Chapter 7 — Idioms, allusions &amp; cultural metaphor', description: '10 thành ngữ mới (画龙点睛, 破釜沉舟, 未雨绸缪…) kèm điển tích.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập HSK6|||Chapter 8 — HSK6 review', description: 'Khung bài luận 议论文, chiến thuật đọc hiểu, bảng tổng hợp mẫu câu.', lessons: [c8, c8q] },
  ],
};
