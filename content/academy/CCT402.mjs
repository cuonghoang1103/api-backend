/**
 * CCT402 — Chinese Translation and Interpretation 2 (Biên - Phiên dịch tiếng
 * Trung 2). Khối Ngôn ngữ Trung FPTU, Kỳ 5. NÂNG CAO — tiếp nối CCT401 (nhập
 * môn dịch): dịch chuyên ngành (kinh tế, chính trị-ngoại giao, khoa học-kỹ
 * thuật, pháp luật-hợp đồng, văn học) + phiên dịch song song nhập môn + ghi
 * chép ký hiệu & trí nhớ + đạo đức nghề dịch. Giáo trình tham khảo: 汉越翻译
 * 教程 (nâng cao); 口译教程 (梅德明, Interpreting Course).
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; trong
 * HTML content "&" → "&amp;". shortDescription dùng "&" thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 420, questions } });

const taiLieu = doc('cct402-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Giáo trình 汉越翻译教程 (nâng cao) & 口译教程 (梅德明), công cụ tra cứu CATTI/Baidu Fanyi/Chinese Grammar Wiki, lộ trình luyện dịch chuyên ngành.',
  [[
    `<span class="eyebrow">CCT402 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">This course builds on CCT401's basics into <strong>specialized translation</strong> (economic, political-diplomatic, sci-tech, legal-contract, literary) and an <strong>introduction to simultaneous interpreting</strong>. The reference textbooks are the standard ones used in Chinese Translation programs.</p>
<h3>📘 Reference textbooks</h3>
<ul>
<li><strong>汉越翻译教程 (Hán-Việt phiên dịch giáo trình)</strong> — advanced Chinese–Vietnamese translation coursebook: specialized-text translation techniques by domain.</li>
<li><strong>口译教程 (Interpreting Course)</strong> — 梅德明 (Mei Deming) — the standard consecutive/simultaneous interpreting textbook used across Chinese-major programs.</li>
</ul>
<h3>🌐 Tools &amp; references</h3>
<ul>
<li><a href="http://www.catti.net.cn/" target="_blank" rel="noopener">CATTI (中国翻译专业资格考试)</a> — official site of China's professional translation/interpreting accreditation exam.</li>
<li><a href="https://fanyi.baidu.com/" target="_blank" rel="noopener">Baidu Fanyi</a> — Chinese↔Vietnamese machine translation, useful to cross-check draft translations (never trust blindly for legal/contract text).</li>
<li><a href="https://resources.allsetlearning.com/chinese/grammar/" target="_blank" rel="noopener">Chinese Grammar Wiki</a> — grammar-point reference for structures that show up in specialized texts (被, 把, 兹, 之类).</li>
</ul>
<div class="callout"><span class="badge">How to practise</span>
<ol>
<li><strong>Read authentic texts</strong> — real contracts, press releases, spec sheets, news — not textbook-simplified ones.</li>
<li><strong>Build a term bank</strong> per domain (economic, legal, technical) — specialized translation lives and dies by terminology consistency.</li>
<li><strong>Back-translate</strong> your own Vietnamese output to Chinese and compare — catches meaning drift.</li>
<li><strong>Record yourself</strong> doing short interpreting drills (shadowing, chunking) and listen back for lag and omissions.</li>
</ol></div>`,
    `<span class="eyebrow">CCT402 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Môn này tiếp nối nền tảng của CCT401 để bước vào <strong>dịch chuyên ngành</strong> (kinh tế, chính trị-ngoại giao, khoa học-kỹ thuật, pháp luật-hợp đồng, văn học) và <strong>nhập môn phiên dịch song song</strong>. Giáo trình tham khảo bên dưới là các đầu sách chuẩn dùng trong chương trình Ngôn ngữ Trung.</p>
<h3>📘 Giáo trình tham khảo</h3>
<ul>
<li><strong>汉越翻译教程 (Hán-Việt phiên dịch giáo trình)</strong> — giáo trình dịch Trung-Việt nâng cao: kỹ thuật dịch văn bản chuyên ngành theo từng lĩnh vực.</li>
<li><strong>口译教程 (Giáo trình phiên dịch)</strong> — 梅德明 (Mai Đức Minh) — giáo trình phiên dịch đuổi/song song chuẩn, dùng phổ biến trong các chương trình Ngôn ngữ Trung.</li>
</ul>
<h3>🌐 Công cụ &amp; tra cứu</h3>
<ul>
<li><a href="http://www.catti.net.cn/" target="_blank" rel="noopener">CATTI (中国翻译专业资格考试)</a> — trang chính thức kỳ thi cấp chứng chỉ nghiệp vụ biên-phiên dịch Trung Quốc.</li>
<li><a href="https://fanyi.baidu.com/" target="_blank" rel="noopener">Baidu Fanyi</a> — dịch máy Trung↔Việt, dùng để đối chiếu nháp (KHÔNG tin tuyệt đối với văn bản pháp lý/hợp đồng).</li>
<li><a href="https://resources.allsetlearning.com/chinese/grammar/" target="_blank" rel="noopener">Chinese Grammar Wiki</a> — tra cấu trúc ngữ pháp hay gặp trong văn bản chuyên ngành (被, 把, 兹, 之类).</li>
</ul>
<div class="callout"><span class="badge">Cách luyện tập</span>
<ol>
<li><strong>Đọc văn bản thật</strong> — hợp đồng, thông cáo báo chí, bản thông số kỹ thuật, tin tức thật — không dùng bản đã đơn giản hoá cho giáo trình.</li>
<li><strong>Lập sổ thuật ngữ</strong> theo từng lĩnh vực (kinh tế, pháp lý, kỹ thuật) — dịch chuyên ngành sống nhờ thuật ngữ nhất quán.</li>
<li><strong>Dịch ngược</strong> bản dịch tiếng Việt của mình về tiếng Trung rồi đối chiếu — phát hiện chỗ lệch nghĩa.</li>
<li><strong>Tự ghi âm</strong> khi luyện phiên dịch (shadowing, chunking) rồi nghe lại để bắt lỗi trễ nhịp và bỏ sót ý.</li>
</ol></div>`,
  ]]);

const intro = doc('cct402-0-1-overview', 'Course overview: advanced Chinese–Vietnamese translation|||Tổng quan: Biên - Phiên dịch tiếng Trung nâng cao',
  'Tiếp nối CCT401: dịch chuyên ngành 5 loại văn bản, phiên dịch song song nhập môn, ghi chép ký hiệu & trí nhớ, ôn tập & đạo đức nghề dịch.',
  [[
    `<span class="eyebrow">CCT402 · Lesson 0.1 · Overview</span>
<h2>Chinese Translation and Interpretation 2</h2>
<p class="lead">CCT401 covered the basics of translating between Chinese and Vietnamese. This course moves into <strong>specialized translation</strong> — texts with domain-specific terminology and register — and gives a <strong>first introduction to simultaneous interpreting</strong>, a very different skill from written translation.</p>
<h3>Why specialized texts are harder</h3>
<ul>
<li><strong>Fixed terminology</strong> — economic, legal and technical terms usually have ONE accepted translation; you don't get to improvise.</li>
<li><strong>Register</strong> — political-diplomatic and legal text is formal and rigid; literary text is the opposite — it rewards keeping the author's voice and imagery.</li>
<li><strong>Zero tolerance for drift</strong> — in a contract or a diplomatic statement, a slightly "freer" translation can change a legal obligation or a political stance.</li>
</ul>
<h3>Roadmap of this course</h3>
<p>Economic/trade texts → political-diplomatic texts → sci-tech texts → legal &amp; contract texts → literary/cultural texts (style) → intro to simultaneous interpreting (同声传译) → note-taking symbols &amp; memory for consecutive interpreting → review: specialized practice &amp; professional ethics.</p>`,
    `<span class="eyebrow">CCT402 · Bài 0.1 · Tổng quan</span>
<h2>Biên - Phiên dịch tiếng Trung 2</h2>
<p class="lead">CCT401 đã dạy nền tảng dịch Trung-Việt. Môn này bước vào <strong>dịch văn bản chuyên ngành</strong> — có thuật ngữ và văn phong riêng của từng lĩnh vực — và <strong>nhập môn phiên dịch song song</strong>, một kỹ năng rất khác với dịch viết.</p>
<h3>Vì sao văn bản chuyên ngành khó hơn</h3>
<ul>
<li><strong>Thuật ngữ cố định</strong> — thuật ngữ kinh tế, pháp lý, kỹ thuật thường chỉ có MỘT cách dịch được chấp nhận; không được tuỳ tiện sáng tạo.</li>
<li><strong>Văn phong (register)</strong> — văn bản chính trị-ngoại giao và pháp luật trang trọng, cứng nhắc; văn học thì ngược lại — cần giữ giọng văn và hình ảnh của tác giả.</li>
<li><strong>Không được sai lệch</strong> — trong hợp đồng hay tuyên bố ngoại giao, một bản dịch "thoáng" hơn một chút có thể làm đổi nghĩa vụ pháp lý hoặc lập trường chính trị.</li>
</ul>
<h3>Lộ trình môn học</h3>
<p>Văn bản kinh tế-thương mại → văn bản chính trị-ngoại giao → văn bản khoa học-kỹ thuật → văn bản pháp luật &amp; hợp đồng → văn học &amp; văn hoá (giữ phong cách) → nhập môn phiên dịch song song (同声传译) → ghi chép ký hiệu &amp; trí nhớ cho phiên dịch đuổi → ôn tập: thực hành dịch chuyên ngành &amp; đạo đức nghề dịch.</p>`,
  ]]);

const c1 = doc('cct402-1-1-kinh-te-thuong-mai', '1.1 — Translating economic & trade texts|||1.1 — Dịch văn bản kinh tế - thương mại',
  'Thuật ngữ hợp đồng/tài chính, giữ nguyên số liệu & đơn vị tiền tệ, ví dụ dịch hợp đồng và báo cáo tài chính song ngữ.',
  [[
    `<span class="eyebrow">CCT402 · Chapter 1 · Lesson 1.1</span>
<h2>Translating economic &amp; trade texts</h2>
<h3>Key terminology</h3>
<pre><code>合同 hétong        hợp đồng
报价 bàojià        báo giá
违约金 wéiyuējīn   tiền phạt vi phạm hợp đồng
供应商 gōngyìngshāng  nhà cung cấp
营业收入 yíngyè shōurù  doanh thu
净利润 jìnglìrùn   lợi nhuận ròng
</code></pre>
<h3>Two hard rules for numbers &amp; currency</h3>
<ul>
<li><strong>Never re-convert currency yourself</strong> — keep the original figure AND the original currency unit (人民币/元 = Nhân dân tệ, 美元 = đô la Mỹ), unless the client explicitly asks for a converted figure — and then you add it as a bracketed note, never silently replace the original.</li>
<li><strong>Never round numbers</strong> — a financial figure is a fact, not prose; 2000万元 stays "20 triệu nhân dân tệ", not "khoảng 20 triệu".</li>
</ul>
<h3>Worked examples</h3>
<pre><code>ZH: 根据本合同条款，甲方应在收到货物后30天内支付全部货款。
VI: Theo điều khoản hợp đồng này, Bên A phải thanh toán toàn bộ
    tiền hàng trong vòng 30 ngày kể từ khi nhận hàng.

ZH: 本季度公司营业收入同比增长15%，净利润达到2000万元人民币。
VI: Trong quý này, doanh thu của công ty tăng 15% so với cùng
    kỳ năm trước, lợi nhuận ròng đạt 20 triệu nhân dân tệ.
</code></pre>
<div class="callout"><span class="badge">Reader test</span> If a Vietnamese businessperson reading your translation could sign the contract or make a decision based on it without misunderstanding a figure or a term, the economic translation did its job.</div>`,
    `<span class="eyebrow">CCT402 · Chương 1 · Bài 1.1</span>
<h2>Dịch văn bản kinh tế - thương mại</h2>
<h3>Thuật ngữ then chốt</h3>
<pre><code>合同 hétong        hợp đồng
报价 bàojià        báo giá
违约金 wéiyuējīn   tiền phạt vi phạm hợp đồng
供应商 gōngyìngshāng  nhà cung cấp
营业收入 yíngyè shōurù  doanh thu
净利润 jìnglìrùn   lợi nhuận ròng
</code></pre>
<h3>Hai nguyên tắc bắt buộc với số liệu &amp; tiền tệ</h3>
<ul>
<li><strong>Không tự quy đổi tiền tệ</strong> — giữ nguyên con số VÀ đơn vị tiền tệ gốc (人民币/元 = Nhân dân tệ, 美元 = đô la Mỹ), trừ khi khách hàng yêu cầu quy đổi rõ ràng — khi đó thêm số đã quy đổi trong ngoặc, không được âm thầm thay thế số gốc.</li>
<li><strong>Không làm tròn số</strong> — số liệu tài chính là sự thật, không phải văn xuôi; 2000万元 phải dịch "20 triệu nhân dân tệ", không phải "khoảng 20 triệu".</li>
</ul>
<h3>Ví dụ dịch</h3>
<pre><code>ZH: 根据本合同条款，甲方应在收到货物后30天内支付全部货款。
VI: Theo điều khoản hợp đồng này, Bên A phải thanh toán toàn bộ
    tiền hàng trong vòng 30 ngày kể từ khi nhận hàng.

ZH: 本季度公司营业收入同比增长15%，净利润达到2000万元人民币。
VI: Trong quý này, doanh thu của công ty tăng 15% so với cùng
    kỳ năm trước, lợi nhuận ròng đạt 20 triệu nhân dân tệ.
</code></pre>
<div class="callout"><span class="badge">Phép thử người đọc</span> Nếu một doanh nhân Việt Nam đọc bản dịch có thể ký hợp đồng hoặc ra quyết định mà không hiểu sai con số hay thuật ngữ nào, bản dịch kinh tế đã đạt yêu cầu.</div>`,
  ]]);

const c1q = quiz('cct402-quiz-1', 'Quiz 1 — Economic & trade texts|||Quiz 1 — Văn bản kinh tế - thương mại', [
  { id: 'q1', question: '"违约金" nghĩa là gì?', options: ['Phí vận chuyển', 'Tiền phạt vi phạm hợp đồng', 'Thuế nhập khẩu', 'Lãi suất ngân hàng'], correctIndex: 1, explanation: '违约金 (wéiyuē jīn) = khoản tiền phạt khi một bên vi phạm điều khoản hợp đồng.' },
  { id: 'q2', question: 'Khi dịch văn bản kinh tế có số liệu và đơn vị tiền tệ, nguyên tắc đúng là?', options: ['Tự quy đổi sang VND theo tỷ giá hiện tại', 'Giữ nguyên số liệu và ghi rõ đơn vị tiền tệ gốc', 'Làm tròn số cho dễ đọc', 'Bỏ đơn vị tiền tệ nếu không quan trọng'], correctIndex: 1, explanation: 'Số liệu tài chính là sự thật cần giữ nguyên; chỉ thêm quy đổi khi khách hàng yêu cầu, và ghi rõ đó là số đã quy đổi.' },
  { id: 'q3', question: '"供应商" dịch đúng là?', options: ['Khách hàng', 'Nhà cung cấp', 'Đối tác đầu tư', 'Cổ đông'], correctIndex: 1, explanation: '供应商 (gōngyìngshāng) = nhà cung cấp hàng hoá/dịch vụ.' },
]);

const c2 = doc('cct402-2-1-chinh-tri-ngoai-giao', '2.1 — Translating political & diplomatic texts|||2.1 — Dịch văn bản chính trị - ngoại giao',
  'Thuật ngữ chính trị-ngoại giao đã có cách dịch chính thống, giữ sắc thái trang trọng, không tự sáng tạo cách dịch cho tên gọi chính trị.',
  [[
    `<span class="eyebrow">CCT402 · Chapter 2 · Lesson 2.1</span>
<h2>Translating political &amp; diplomatic texts</h2>
<h3>The one rule that overrides everything else</h3>
<p>Political and diplomatic terms that have already been <strong>officially published</strong> (by state media, official communiqués) must be translated using that EXACT established rendering — never a "nicer" or "more literal" version you invent yourself. Getting this wrong is not a stylistic slip; it can misrepresent a country's official position.</p>
<h3>Key terminology (established renderings)</h3>
<pre><code>一带一路 Yīdài Yīlù              Vành đai và Con đường
人类命运共同体                    Cộng đồng chung vận mệnh nhân loại
rénlèi mìngyùn gòngtóngtǐ
联合声明 liánhé shēngmíng         Tuyên bố chung
双边关系 shuāngbiān guānxi        Quan hệ song phương
互利共赢 hùlì gòngyíng            Hợp tác cùng có lợi, cùng thắng
</code></pre>
<h3>Worked example</h3>
<pre><code>ZH: 中越双方同意在"一带一路"倡议和"两廊一圈"规划对接框架下深化合作。
VI: Hai bên Trung - Việt nhất trí làm sâu sắc hợp tác trong khuôn
    khổ kết nối sáng kiến "Vành đai và Con đường" với quy hoạch
    "Hai hành lang, một vành đai".
</code></pre>
<div class="callout"><span class="badge">Tone matters</span> Diplomatic language is deliberately measured — never upgrade "关切" (concern) to "phản đối gay gắt" (strongly oppose), and never downgrade it either. Match the register exactly.</div>`,
    `<span class="eyebrow">CCT402 · Chương 2 · Bài 2.1</span>
<h2>Dịch văn bản chính trị - ngoại giao</h2>
<h3>Nguyên tắc quan trọng nhất</h3>
<p>Thuật ngữ chính trị-ngoại giao đã có <strong>cách dịch chính thống được công bố</strong> (báo chí nhà nước, tuyên bố chính thức) thì phải dùng ĐÚNG cách dịch đó — không tự sáng tạo cách dịch "hay hơn" hay "sát nghĩa hơn". Dịch sai chỗ này không chỉ là lỗi văn phong, mà có thể làm sai lệch lập trường chính thức của một quốc gia.</p>
<h3>Thuật ngữ then chốt (cách dịch chính thống)</h3>
<pre><code>一带一路 Yīdài Yīlù              Vành đai và Con đường
人类命运共同体                    Cộng đồng chung vận mệnh nhân loại
rénlèi mìngyùn gòngtóngtǐ
联合声明 liánhé shēngmíng         Tuyên bố chung
双边关系 shuāngbiān guānxi        Quan hệ song phương
互利共赢 hùlì gòngyíng            Hợp tác cùng có lợi, cùng thắng
</code></pre>
<h3>Ví dụ dịch</h3>
<pre><code>ZH: 中越双方同意在"一带一路"倡议和"两廊一圈"规划对接框架下深化合作。
VI: Hai bên Trung - Việt nhất trí làm sâu sắc hợp tác trong khuôn
    khổ kết nối sáng kiến "Vành đai và Con đường" với quy hoạch
    "Hai hành lang, một vành đai".
</code></pre>
<div class="callout"><span class="badge">Sắc thái là tất cả</span> Ngôn ngữ ngoại giao luôn được cân nhắc kỹ — không được nâng "关切" (quan ngại) thành "phản đối gay gắt", cũng không được hạ giọng ngược lại. Phải khớp đúng sắc thái gốc.</div>`,
  ]]);

const c2q = quiz('cct402-quiz-2', 'Quiz 2 — Political & diplomatic texts|||Quiz 2 — Văn bản chính trị - ngoại giao', [
  { id: 'q1', question: '"一带一路" đã có cách dịch chính thống sang tiếng Việt là?', options: ['Con đường tơ lụa mới', 'Vành đai và Con đường', 'Hành lang kinh tế', 'Liên minh thương mại'], correctIndex: 1, explanation: '一带一路 (Yīdài Yīlù) được dịch chính thống là "Vành đai và Con đường".' },
  { id: 'q2', question: 'Khi thuật ngữ chính trị-ngoại giao đã có cách dịch chính thức được công bố, người dịch nên?', options: ['Sáng tạo cách dịch mới cho hay hơn', 'Dùng đúng cách dịch chính thống đã công bố', 'Dịch tự do miễn đúng nghĩa đen', 'Giữ nguyên tiếng Trung, không dịch'], correctIndex: 1, explanation: 'Thuật ngữ chính trị đã công bố chính thức bắt buộc dùng đúng bản dịch đó, không tự sáng tạo.' },
  { id: 'q3', question: '"互利共赢" nghĩa là?', options: ['Cạnh tranh khốc liệt', 'Hợp tác cùng có lợi, cùng thắng', 'Đơn phương áp đặt', 'Đối đầu chiến lược'], correctIndex: 1, explanation: '互利共赢 (hùlì gòngyíng) = hai bên cùng có lợi, cùng thắng (win-win).' },
]);

const c3 = doc('cct402-3-1-khoa-hoc-ky-thuat', '3.1 — Translating sci-tech texts|||3.1 — Dịch văn bản khoa học - kỹ thuật',
  'Thuật ngữ kỹ thuật chính xác, xử lý câu bị động 被, giữ nguyên đơn vị đo; ví dụ dịch hướng dẫn sử dụng.',
  [[
    `<span class="eyebrow">CCT402 · Chapter 3 · Lesson 3.1</span>
<h2>Translating sci-tech texts</h2>
<h3>Key terminology</h3>
<pre><code>说明书 shuōmíngshū   hướng dẫn sử dụng
参数 cānshù          thông số
精度 jīngdù          độ chính xác
故障 gùzhàng         sự cố / lỗi
</code></pre>
<h3>The 被 (bèi) passive: don't translate it mechanically</h3>
<p>Chinese technical text uses the <strong>被</strong> passive construction a lot. Vietnamese uses passive voice far less than Chinese — often the sentence reads more naturally as an <strong>active</strong> Vietnamese sentence. Decide case by case; don't force "bị/được" onto every 被.</p>
<h3>Worked example</h3>
<pre><code>ZH: 设备在运行过程中如果被检测到异常，系统将自动停止。
VI: Nếu phát hiện bất thường trong quá trình vận hành, hệ
    thống sẽ tự động dừng thiết bị.
    (被检测到 → chuyển thành câu chủ động "phát hiện", tự
     nhiên hơn "nếu bất thường bị phát hiện".)
</code></pre>
<h3>Units of measure</h3>
<p>Keep the original unit (毫米 → mm, 千瓦 → kW) — only translate the unit's NAME, never convert the value to a different unit system unless the client asks and you flag it as a conversion.</p>
<div class="callout"><span class="badge">Precision over elegance</span> In technical translation, a slightly clunky but exact sentence beats a smooth one that blurs a parameter or a safety condition.</div>`,
    `<span class="eyebrow">CCT402 · Chương 3 · Bài 3.1</span>
<h2>Dịch văn bản khoa học - kỹ thuật</h2>
<h3>Thuật ngữ then chốt</h3>
<pre><code>说明书 shuōmíngshū   hướng dẫn sử dụng
参数 cānshù          thông số
精度 jīngdù          độ chính xác
故障 gùzhàng         sự cố / lỗi
</code></pre>
<h3>Câu bị động 被 (bèi): đừng dịch máy móc</h3>
<p>Văn bản kỹ thuật tiếng Trung dùng cấu trúc bị động <strong>被</strong> rất nhiều. Tiếng Việt dùng câu bị động ít hơn hẳn tiếng Trung — nhiều khi câu đọc tự nhiên hơn nếu chuyển sang câu <strong>chủ động</strong> trong tiếng Việt. Cần xét từng trường hợp, không ép "bị/được" vào mọi chữ 被.</p>
<h3>Ví dụ dịch</h3>
<pre><code>ZH: 设备在运行过程中如果被检测到异常，系统将自动停止。
VI: Nếu phát hiện bất thường trong quá trình vận hành, hệ
    thống sẽ tự động dừng thiết bị.
    (被检测到 → chuyển thành câu chủ động "phát hiện", tự
     nhiên hơn "nếu bất thường bị phát hiện".)
</code></pre>
<h3>Đơn vị đo</h3>
<p>Giữ nguyên đơn vị đo gốc (毫米 → mm, 千瓦 → kW) — chỉ dịch TÊN đơn vị, không tự quy đổi sang hệ đo khác trừ khi khách hàng yêu cầu và ghi rõ đó là số đã quy đổi.</p>
<div class="callout"><span class="badge">Chính xác hơn trau chuốt</span> Trong dịch kỹ thuật, một câu hơi vụng nhưng chính xác tuyệt đối tốt hơn một câu mượt mà nhưng làm mờ một thông số hay một điều kiện an toàn.</div>`,
  ]]);

const c3q = quiz('cct402-quiz-3', 'Quiz 3 — Sci-tech texts|||Quiz 3 — Văn bản khoa học - kỹ thuật', [
  { id: 'q1', question: 'Cấu trúc "被" trong câu kỹ thuật tiếng Trung khi dịch sang tiếng Việt nên?', options: ['Luôn dịch thành câu bị động "bị/được"', 'Có thể chuyển sang câu chủ động cho tự nhiên hơn tuỳ ngữ cảnh', 'Bỏ qua không dịch', 'Dịch thành câu hỏi'], correctIndex: 1, explanation: 'Tiếng Việt dùng bị động ít hơn tiếng Trung; nhiều câu 被 nên chuyển chủ động cho tự nhiên.' },
  { id: 'q2', question: 'Khi dịch đơn vị đo trong văn bản kỹ thuật (vd 毫米, 千瓦), nguyên tắc là?', options: ['Quy đổi tuỳ ý sang đơn vị khác', 'Giữ nguyên đơn vị đo gốc, chỉ dịch tên đơn vị tương ứng', 'Bỏ đơn vị vì không quan trọng', 'Chỉ ghi số, không ghi đơn vị'], correctIndex: 1, explanation: 'Giữ nguyên đơn vị đo gốc; chỉ tự quy đổi khi được yêu cầu và phải ghi rõ.' },
  { id: 'q3', question: '"说明书" nghĩa là?', options: ['Hợp đồng', 'Hướng dẫn sử dụng', 'Hoá đơn', 'Báo cáo'], correctIndex: 1, explanation: '说明书 (shuōmíngshū) = tài liệu hướng dẫn sử dụng sản phẩm/thiết bị.' },
]);

const c4 = doc('cct402-4-1-phap-luat-hop-dong', '4.1 — Translating legal & contract texts|||4.1 — Dịch văn bản pháp luật & hợp đồng',
  '甲方/乙方, cấu trúc mở đầu văn bản pháp lý, giữ đúng số thứ tự điều khoản; ví dụ mở đầu hợp đồng.',
  [[
    `<span class="eyebrow">CCT402 · Chapter 4 · Lesson 4.1</span>
<h2>Translating legal &amp; contract texts</h2>
<h3>Key terminology</h3>
<pre><code>甲方 jiǎfāng             Bên A
乙方 yǐfāng              Bên B
兹 zī     (formal opener, roughly "hereby / whereas")
违约责任 wéiyuē zérèn    trách nhiệm do vi phạm hợp đồng
不可抗力 bùkěkànglì      bất khả kháng
</code></pre>
<h3>Two rules with zero exceptions</h3>
<ul>
<li><strong>Translate literally, do not interpret.</strong> A legal translator's job is not to clarify what a clause "probably means" — that is the lawyer's job. Render exactly what the source says.</li>
<li><strong>Clause numbering must match the original exactly</strong> (第一条 = Điều 1, 第二条 = Điều 2 …). Never merge, split or renumber clauses.</li>
</ul>
<h3>Worked example</h3>
<pre><code>ZH: 兹经甲乙双方友好协商，就以下条款达成一致，特签订本合同。
VI: Nay qua thương lượng hữu nghị, hai Bên A và Bên B đã thống
    nhất các điều khoản sau đây và ký kết hợp đồng này.
</code></pre>
<div class="callout"><span class="badge">No creative license here</span> In literary translation, style choices are a virtue. In legal translation, an unauthorized style choice is a liability — it can change who owes what to whom.</div>`,
    `<span class="eyebrow">CCT402 · Chương 4 · Bài 4.1</span>
<h2>Dịch văn bản pháp luật &amp; hợp đồng</h2>
<h3>Thuật ngữ then chốt</h3>
<pre><code>甲方 jiǎfāng             Bên A
乙方 yǐfāng              Bên B
兹 zī      (từ mở đầu trang trọng, nghĩa gần "nay, xét rằng")
违约责任 wéiyuē zérèn    trách nhiệm do vi phạm hợp đồng
不可抗力 bùkěkànglì      bất khả kháng
</code></pre>
<h3>Hai nguyên tắc không có ngoại lệ</h3>
<ul>
<li><strong>Dịch sát nghĩa, không diễn giải.</strong> Việc của người dịch pháp lý không phải là làm rõ điều khoản "chắc là có ý gì" — đó là việc của luật sư. Dịch đúng những gì bản gốc viết.</li>
<li><strong>Số thứ tự điều khoản phải khớp bản gốc tuyệt đối</strong> (第一条 = Điều 1, 第二条 = Điều 2 …). Không được gộp, tách hay đánh số lại điều khoản.</li>
</ul>
<h3>Ví dụ dịch</h3>
<pre><code>ZH: 兹经甲乙双方友好协商，就以下条款达成一致，特签订本合同。
VI: Nay qua thương lượng hữu nghị, hai Bên A và Bên B đã thống
    nhất các điều khoản sau đây và ký kết hợp đồng này.
</code></pre>
<div class="callout"><span class="badge">Không có chỗ cho sáng tạo</span> Trong dịch văn học, lựa chọn văn phong là một điểm cộng. Trong dịch pháp lý, một lựa chọn văn phong tự ý là một rủi ro — nó có thể làm đổi nghĩa vụ của ai đối với ai.</div>`,
  ]]);

const c4q = quiz('cct402-quiz-4', 'Quiz 4 — Legal & contract texts|||Quiz 4 — Văn bản pháp luật & hợp đồng', [
  { id: 'q1', question: '"甲方" và "乙方" trong hợp đồng tiếng Trung tương ứng với?', options: ['Bên mua và bên bán luôn cố định', 'Bên A và Bên B (vai trò cụ thể do hợp đồng quy định)', 'Chính phủ và doanh nghiệp', 'Người mua và người bảo lãnh'], correctIndex: 1, explanation: '甲方/乙方 chỉ là ký hiệu Bên A/Bên B; vai trò cụ thể (bên bán, bên mua...) do nội dung hợp đồng quy định.' },
  { id: 'q2', question: 'Khi dịch văn bản pháp lý, số thứ tự điều khoản (第一条, 第二条...) cần?', options: ['Sắp xếp lại theo cách hiểu của người dịch', 'Giữ đúng thứ tự và số điều khoản khớp bản gốc tuyệt đối', 'Gộp các điều khoản ngắn cho gọn', 'Bỏ số thứ tự vì không cần thiết'], correctIndex: 1, explanation: 'Số thứ tự điều khoản pháp lý phải khớp tuyệt đối với bản gốc, không được gộp/tách/đổi số.' },
  { id: 'q3', question: '"不可抗力" nghĩa là?', options: ['Trách nhiệm pháp lý', 'Bất khả kháng', 'Vi phạm hợp đồng', 'Bảo hành sản phẩm'], correctIndex: 1, explanation: '不可抗力 (bùkěkànglì) = sự kiện bất khả kháng (thiên tai, chiến tranh...) làm miễn trừ trách nhiệm hợp đồng.' },
]);

const c5 = doc('cct402-5-1-van-hoc-van-hoa', '5.1 — Literary & cultural translation (keeping style)|||5.1 — Dịch văn học & văn hoá (giữ phong cách)',
  'Tiêu chuẩn 信达雅 (tín-đạt-nhã), xử lý thành ngữ 成语, ví dụ dịch giữ hình ảnh ẩn dụ trong câu văn học.',
  [[
    `<span class="eyebrow">CCT402 · Chapter 5 · Lesson 5.1</span>
<h2>Literary &amp; cultural translation</h2>
<h3>The classic standard: 信达雅 (xìn dá yǎ)</h3>
<p>Proposed by 严复 (Yan Fu): <strong>信 (tín)</strong> — faithful to the source meaning; <strong>达 (đạt)</strong> — reads smoothly, gets the meaning across; <strong>雅 (nhã)</strong> — elegant, keeps the author's style. Unlike legal/technical translation (where 信 dominates absolutely), literary translation balances all three — some freedom is allowed if it serves 雅.</p>
<h3>Idioms (成语) — don't translate word by word</h3>
<pre><code>画蛇添足 huà shé tiān zú  → vẽ rắn thêm chân (làm việc thừa,
                             phản tác dụng)
塞翁失马 sài wēng shī mǎ  → tái ông thất mã (trong hoạ có phúc)
</code></pre>
<p>When the target language has an equivalent idiom, use it. When it doesn't, keep the image if a Vietnamese reader can still get it — don't collapse a vivid idiom into a flat literal sentence.</p>
<h3>Worked example — keeping the image</h3>
<pre><code>ZH: 月光如水，静静地洒在古老的青石板路上。
VI: Ánh trăng như nước, lặng lẽ trải xuống con đường lát đá
    xanh cổ kính.
    (Kept the "moonlight like water" image instead of flattening
     it to "trăng sáng chiếu xuống đường".)
</code></pre>
<div class="callout"><span class="badge">Different job, different rule</span> Chapters 1–4 taught "don't add, don't interpret." Here the rule flips slightly: preserving the FEEL sometimes means not translating word-for-word.</div>`,
    `<span class="eyebrow">CCT402 · Chương 5 · Bài 5.1</span>
<h2>Dịch văn học &amp; văn hoá</h2>
<h3>Tiêu chuẩn kinh điển: 信达雅 (tín - đạt - nhã)</h3>
<p>Do 严复 (Nghiêm Phục) đề ra: <strong>信 (tín)</strong> — trung thực với nghĩa gốc; <strong>达 (đạt)</strong> — đọc trôi chảy, truyền tải được ý; <strong>雅 (nhã)</strong> — trau chuốt, giữ được giọng văn tác giả. Khác với dịch pháp lý/kỹ thuật (nơi 信 gần như tuyệt đối), dịch văn học cân bằng cả ba — được phép thoáng hơn một chút nếu điều đó phục vụ cho 雅.</p>
<h3>Thành ngữ (成语) — đừng dịch từng chữ</h3>
<pre><code>画蛇添足 huà shé tiān zú  → vẽ rắn thêm chân (làm việc thừa,
                             phản tác dụng)
塞翁失马 sài wēng shī mǎ  → tái ông thất mã (trong hoạ có phúc)
</code></pre>
<p>Khi tiếng Việt có thành ngữ tương đương, hãy dùng nó. Khi không có, giữ hình ảnh nếu người đọc Việt vẫn hiểu được — đừng biến một thành ngữ sống động thành một câu dịch nghĩa đen phẳng lì.</p>
<h3>Ví dụ dịch — giữ hình ảnh</h3>
<pre><code>ZH: 月光如水，静静地洒在古老的青石板路上。
VI: Ánh trăng như nước, lặng lẽ trải xuống con đường lát đá
    xanh cổ kính.
    (Giữ hình ảnh "ánh trăng như nước" thay vì làm phẳng thành
     "trăng sáng chiếu xuống đường".)
</code></pre>
<div class="callout"><span class="badge">Việc khác, quy tắc khác</span> Chương 1–4 dạy "không thêm, không diễn giải." Ở đây quy tắc hơi đảo lại: giữ được CẢM XÚC đôi khi nghĩa là không dịch từng chữ.</div>`,
  ]]);

const c5q = quiz('cct402-quiz-5', 'Quiz 5 — Literary & cultural translation|||Quiz 5 — Dịch văn học & văn hoá', [
  { id: 'q1', question: 'Tiêu chuẩn dịch văn học kinh điển "信达雅" (Nghiêm Phục) gồm ba yếu tố nào?', options: ['Nhanh - rẻ - đẹp', 'Tín - đạt - nhã (trung thực - thông suốt - trau chuốt)', 'Ngắn - gọn - súc tích', 'Trực dịch - thoát ý - sáng tạo'], correctIndex: 1, explanation: '信达雅 (xìn dá yǎ) = tín (trung thực) - đạt (thông suốt) - nhã (trau chuốt, giữ văn phong).' },
  { id: 'q2', question: 'Khi gặp thành ngữ (成语) trong văn học, cách dịch phù hợp thường là?', options: ['Luôn dịch nghĩa đen từng chữ', 'Tìm thành ngữ Việt tương đương hoặc giữ hình ảnh nếu người đọc hiểu được', 'Bỏ qua không dịch', 'Phiên âm Hán Việt toàn bộ'], correctIndex: 1, explanation: 'Ưu tiên thành ngữ Việt tương đương; nếu không có, giữ hình ảnh gốc nếu người đọc vẫn hiểu được.' },
  { id: 'q3', question: '"画蛇添足" mang nghĩa gần với cách nói nào?', options: ['Nước đến chân mới nhảy', 'Vẽ rắn thêm chân (làm việc thừa, phản tác dụng)', 'Có công mài sắt có ngày nên kim', 'Một công đôi việc'], correctIndex: 1, explanation: '画蛇添足 (huà shé tiān zú) = vẽ rắn thêm chân — làm việc thừa thãi, phản tác dụng.' },
]);

const c6 = doc('cct402-6-1-phien-dich-song-song', '6.1 — Intro to simultaneous interpreting (同声传译)|||6.1 — Nhập môn phiên dịch song song (同声传译)',
  'Khác biệt với phiên dịch đuổi, ear-voice span, kỹ thuật shadowing/chunking/anticipation; ví dụ chia cụm dịch song song.',
  [[
    `<span class="eyebrow">CCT402 · Chapter 6 · Lesson 6.1</span>
<h2>Intro to simultaneous interpreting (同声传译)</h2>
<h3>Simultaneous vs. consecutive</h3>
<p>In <strong>consecutive interpreting</strong>, the speaker pauses and the interpreter renders a chunk of speech afterward. In <strong>simultaneous interpreting (SI)</strong>, the interpreter speaks almost at the same time as the speaker, lagging by only a few seconds — the <strong>ear-voice span (EVS)</strong>, typically 2–4 seconds. SI is usually done from a soundproof booth with headphones, and interpreters work in pairs, swapping every 15–20 minutes because the cognitive load is extremely high.</p>
<h3>Three entry-level techniques</h3>
<ul>
<li><strong>Shadowing</strong> — repeat what you hear in the SAME language, near-simultaneously, to train the reflex of speaking while still listening.</li>
<li><strong>Chunking</strong> — break a long sentence into small meaning-units and interpret each unit as it arrives, instead of waiting for the whole sentence.</li>
<li><strong>Anticipation</strong> — Chinese sentences are usually Subject–Verb–Object; use that pattern to predict what's coming and start interpreting before the sentence ends.</li>
</ul>
<h3>Worked example — chunking</h3>
<pre><code>ZH (chunks): 为了/进一步/推动/两国/经贸合作/，
             中方/愿意/与越方/加强/在/数字经济/领域/的/交流。
VI (as chunks arrive):
  Để/tiếp tục thúc đẩy/hợp tác kinh tế - thương mại song
  phương/, phía Trung Quốc/sẵn sàng/cùng phía Việt Nam/
  tăng cường/trao đổi/trong lĩnh vực/kinh tế số.
</code></pre>
<div class="callout"><span class="badge">This is a taste, not mastery</span> Professional SI takes years of training. This chapter's goal is only to understand the mechanics and try the drills at low speed.</div>`,
    `<span class="eyebrow">CCT402 · Chương 6 · Bài 6.1</span>
<h2>Nhập môn phiên dịch song song (同声传译)</h2>
<h3>Phiên dịch song song khác phiên dịch đuổi ở đâu</h3>
<p>Ở <strong>phiên dịch đuổi (consecutive)</strong>, diễn giả dừng lời và người phiên dịch thuật lại một đoạn sau đó. Ở <strong>phiên dịch song song (simultaneous interpreting, SI)</strong>, người phiên dịch nói gần như đồng thời với diễn giả, chỉ trễ vài giây — gọi là <strong>ear-voice span (EVS)</strong>, thường 2-4 giây. SI thường làm trong cabin cách âm, đeo tai nghe, và người phiên dịch làm việc theo cặp, đổi ca mỗi 15-20 phút vì tải nhận thức (cognitive load) rất cao.</p>
<h3>Ba kỹ thuật nhập môn</h3>
<ul>
<li><strong>Shadowing (nhại lời)</strong> — nhắc lại gần như đồng thời những gì nghe được, CÙNG một ngôn ngữ, để luyện phản xạ vừa nghe vừa nói.</li>
<li><strong>Chunking (chia cụm)</strong> — chia câu dài thành các cụm nghĩa nhỏ và dịch ngay từng cụm khi nó xuất hiện, thay vì đợi hết cả câu.</li>
<li><strong>Anticipation (dự đoán)</strong> — câu tiếng Trung thường theo cấu trúc Chủ-Vị-Tân; dựa vào đó để đoán trước phần sắp tới và bắt đầu dịch trước khi câu kết thúc.</li>
</ul>
<h3>Ví dụ — chia cụm</h3>
<pre><code>ZH (chia cụm): 为了/进一步/推动/两国/经贸合作/，
               中方/愿意/与越方/加强/在/数字经济/领域/的/交流。
VI (dịch ngay theo từng cụm):
  Để/tiếp tục thúc đẩy/hợp tác kinh tế - thương mại song
  phương/, phía Trung Quốc/sẵn sàng/cùng phía Việt Nam/
  tăng cường/trao đổi/trong lĩnh vực/kinh tế số.
</code></pre>
<div class="callout"><span class="badge">Đây là làm quen, chưa phải thành thạo</span> Phiên dịch song song chuyên nghiệp cần nhiều năm luyện tập. Mục tiêu của chương này chỉ là hiểu cơ chế và thử luyện tập ở tốc độ chậm.</div>`,
  ]]);

const c6q = quiz('cct402-quiz-6', 'Quiz 6 — Simultaneous interpreting|||Quiz 6 — Phiên dịch song song', [
  { id: 'q1', question: 'Phiên dịch song song (同声传译) khác phiên dịch đuổi (consecutive) chủ yếu ở điểm nào?', options: ['Chỉ dùng cho các cuộc họp nhỏ', 'Người phiên dịch nói gần như đồng thời với diễn giả, chỉ trễ vài giây (ear-voice span), thay vì đợi diễn giả dừng lời', 'Không cần ghi chú gì cả', 'Chỉ áp dụng cho văn bản viết'], correctIndex: 1, explanation: 'Điểm khác biệt cốt lõi là độ trễ ngắn (EVS) thay vì đợi diễn giả ngừng nói như phiên dịch đuổi.' },
  { id: 'q2', question: 'Kỹ thuật "chunking" trong phiên dịch song song nghĩa là?', options: ['Ghi âm toàn bộ bài nói', 'Chia câu dài thành các cụm nghĩa nhỏ để dịch ngay từng cụm', 'Dịch sau khi nghe hết cả bài', 'Bỏ bớt thông tin không quan trọng'], correctIndex: 1, explanation: 'Chunking = chia nhỏ câu thành các đơn vị nghĩa để dịch ngay, không chờ hết câu.' },
  { id: 'q3', question: 'Vì sao phiên dịch song song thường làm việc theo cặp, đổi ca mỗi 15-20 phút?', options: ['Vì quy định hành chính', 'Vì tải nhận thức (cognitive load) rất cao, dễ mệt và giảm chất lượng nếu làm liên tục', 'Vì cabin chỉ đủ chỗ ngồi luân phiên', 'Vì cần hai người dịch hai ngôn ngữ khác nhau'], correctIndex: 1, explanation: 'SI đòi hỏi nghe-hiểu-dịch-nói cùng lúc liên tục, tải nhận thức cực cao nên cần đổi ca.' },
]);

const c7 = doc('cct402-7-1-ghi-chep-ky-hieu', '7.1 — Note-taking symbols (笔记) & memory for interpreting|||7.1 — Ghi chép ký hiệu phiên dịch (笔记) & trí nhớ',
  'Ghi ý & cấu trúc logic bằng ký hiệu (không tốc ký toàn văn), viết theo cột dọc, ký hiệu mẫu, luyện trí nhớ ngắn hạn.',
  [[
    `<span class="eyebrow">CCT402 · Chapter 7 · Lesson 7.1</span>
<h2>Note-taking symbols &amp; memory for consecutive interpreting</h2>
<h3>Notes ≠ shorthand</h3>
<p>Consecutive interpreting deals with long segments (1–5 minutes), so you need notes. But note-taking is NOT writing down every word — it's capturing the <strong>ideas and their logical structure</strong> with symbols and abbreviations, fast enough to keep listening. Write in a <strong>vertical column</strong>, not a continuous horizontal line — it's much easier to see the overall structure at a glance when you read it back.</p>
<h3>A starter symbol set</h3>
<pre><code>→   dẫn đến / vì vậy (cause → effect)
↑ ↓  tăng / giảm
=    là, tương đương
✓    đồng ý
□    quốc gia (ô vuông tượng trưng lãnh thổ)
◯ chữ  khoanh tròn quanh chữ = tên riêng / nhấn mạnh
</code></pre>
<h3>Worked example — notes for a spoken segment</h3>
<pre><code>ZH: 越南和中国是山水相连的邻邦，自1950年建交以来，双边关系经历了
    曲折发展，但总体保持了友好合作的大方向。
Notes: VN=CN (láng giềng núi sông liền)
       1950 kết giao
       QH: gập ghềnh → nhưng chung: hữu nghị + hợp tác
</code></pre>
<h3>Short-term memory</h3>
<p>Before adding notes, practice listening to a 1-minute segment and retelling it from memory alone — <strong>visualize</strong> the content as images, and group facts in chunks of about 3 to make them easier to hold in working memory.</p>
<div class="callout"><span class="badge">Your handwriting, your system</span> There is no single "correct" symbol set — build one you can read back instantly under pressure, and use it consistently.</div>`,
    `<span class="eyebrow">CCT402 · Chương 7 · Bài 7.1</span>
<h2>Ghi chép ký hiệu &amp; trí nhớ cho phiên dịch đuổi</h2>
<h3>Ghi chú ≠ tốc ký</h3>
<p>Phiên dịch đuổi xử lý các đoạn nói dài (1-5 phút), nên cần ghi chú. Nhưng ghi chú KHÔNG phải chép lại từng chữ — mà là nắm bắt <strong>Ý và cấu trúc logic</strong> bằng ký hiệu và viết tắt, đủ nhanh để vẫn còn nghe kịp. Viết theo <strong>cột dọc</strong>, không viết liền theo dòng ngang — nhìn lại sẽ dễ thấy cấu trúc tổng thể hơn nhiều.</p>
<h3>Bộ ký hiệu nhập môn</h3>
<pre><code>→   dẫn đến / vì vậy (quan hệ nhân quả)
↑ ↓  tăng / giảm
=    là, tương đương
✓    đồng ý
□    quốc gia (ô vuông tượng trưng lãnh thổ)
◯ chữ  khoanh tròn quanh chữ = tên riêng / nhấn mạnh
</code></pre>
<h3>Ví dụ — ghi chú cho một đoạn nói</h3>
<pre><code>ZH: 越南和中国是山水相连的邻邦，自1950年建交以来，双边关系经历了
    曲折发展，但总体保持了友好合作的大方向。
Ghi chú: VN=CN (láng giềng núi sông liền)
         1950 kết giao
         QH: gập ghềnh → nhưng chung: hữu nghị + hợp tác
</code></pre>
<h3>Trí nhớ ngắn hạn</h3>
<p>Trước khi thêm ghi chú, hãy luyện nghe một đoạn 1 phút rồi thuật lại chỉ bằng trí nhớ — <strong>hình dung</strong> nội dung thành hình ảnh, và nhóm các sự kiện theo cụm khoảng 3 ý để dễ giữ trong trí nhớ ngắn hạn.</p>
<div class="callout"><span class="badge">Chữ viết của bạn, hệ thống của bạn</span> Không có một bộ ký hiệu "chuẩn" duy nhất — hãy xây một bộ mà bạn đọc lại được ngay lập tức dưới áp lực, và dùng nhất quán.</div>`,
  ]]);

const c7q = quiz('cct402-quiz-7', 'Quiz 7 — Note-taking & memory|||Quiz 7 — Ghi chép ký hiệu & trí nhớ', [
  { id: 'q1', question: 'Ghi chép ký hiệu (笔记) trong phiên dịch đuổi khác gì với tốc ký?', options: ['Ghi lại toàn văn từng chữ người nói', 'Ghi lại Ý chính và cấu trúc logic bằng ký hiệu, viết tắt, không ghi toàn văn', 'Chỉ ghi số liệu, bỏ qua nội dung khác', 'Không cần ghi chép gì'], correctIndex: 1, explanation: 'Note-taking phiên dịch nắm ý & cấu trúc logic bằng ký hiệu, không tốc ký toàn văn.' },
  { id: 'q2', question: 'Vì sao nên ghi chú theo cột dọc thay vì viết liền theo dòng ngang?', options: ['Vì tiết kiệm giấy', 'Vì dễ nhìn bao quát cấu trúc và mối quan hệ logic giữa các ý khi đọc lại', 'Vì là quy tắc bắt buộc khi thi CATTI', 'Vì viết dọc nhanh hơn viết ngang'], correctIndex: 1, explanation: 'Viết cột dọc giúp thấy rõ cấu trúc và quan hệ logic giữa các ý khi nhìn lại ghi chú.' },
  { id: 'q3', question: 'Ký hiệu mũi tên (→) trong ghi chép phiên dịch thường biểu thị?', options: ['Sự tương phản, đối lập', 'Quan hệ nhân quả, dẫn đến điều tiếp theo', 'Sự ngang bằng, tương đương', 'Phủ định, không đồng ý'], correctIndex: 1, explanation: 'Mũi tên (→) thường dùng để biểu thị quan hệ nhân quả / dẫn đến.' },
]);

const c8 = doc('cct402-8-1-on-tap-dao-duc', '8.1 — Review: specialized practice & professional ethics|||8.1 — Ôn tập: thực hành dịch chuyên ngành & đạo đức nghề dịch',
  'Tổng ôn 7 kỹ năng, tiêu chuẩn tín-đạt-nhã theo loại văn bản, đạo đức nghề dịch (trung thực, bảo mật, trung lập), CATTI.',
  [[
    `<span class="eyebrow">CCT402 · Chapter 8 · Lesson 8.1</span>
<h2>Review: specialized practice &amp; professional ethics</h2>
<h3>Same standard, different weight</h3>
<p>信达雅 (tín-đạt-nhã) applies to every text type, but the WEIGHT shifts: legal and technical texts demand near-absolute <strong>信 (tín)</strong>; literary texts trade some 信 for <strong>雅 (nhã)</strong>; political-diplomatic texts need 信 AND the exact established register at the same time.</p>
<h3>Professional ethics — non-negotiable rules</h3>
<ul>
<li><strong>Fidelity</strong> — never add, omit or distort what a speaker/author said, even if you disagree with it or think you can phrase it better.</li>
<li><strong>Confidentiality</strong> — contract terms, negotiation details and client information stay confidential, always.</li>
<li><strong>Neutrality</strong> — when interpreting for two opposing parties (e.g. a negotiation), you represent BOTH sides equally; you never take a side or "help" one party.</li>
<li><strong>Competence</strong> — only accept jobs within your domain knowledge; a mistranslated medical or legal term can cause real harm.</li>
</ul>
<h3>A professional benchmark: CATTI</h3>
<p><strong>CATTI (中国翻译专业资格考试)</strong> is China's official accreditation exam for professional translators/interpreters — a useful external benchmark for the level this course aims toward, even if you don't sit the exam itself.</p>
<div class="callout"><span class="badge">Put it together</span> Practice a short mixed passage (economic + diplomatic) end to end: build your term list first, translate, then re-check numbers, terminology consistency and register before calling it done.</div>`,
    `<span class="eyebrow">CCT402 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập: thực hành dịch chuyên ngành &amp; đạo đức nghề dịch</h2>
<h3>Cùng một tiêu chuẩn, khác trọng số</h3>
<p>信达雅 (tín-đạt-nhã) áp dụng cho mọi loại văn bản, nhưng TRỌNG SỐ thay đổi: văn bản pháp lý và kỹ thuật đòi hỏi <strong>信 (tín)</strong> gần như tuyệt đối; văn bản văn học đánh đổi một phần tín để lấy <strong>雅 (nhã)</strong>; văn bản chính trị-ngoại giao cần tín VÀ đúng sắc thái chính thống cùng lúc.</p>
<h3>Đạo đức nghề dịch — những nguyên tắc không thể thoả hiệp</h3>
<ul>
<li><strong>Trung thực</strong> — không bao giờ thêm, bớt hay bóp méo điều người nói/tác giả đã nói, kể cả khi bạn không đồng ý hay nghĩ mình diễn đạt hay hơn.</li>
<li><strong>Bảo mật</strong> — điều khoản hợp đồng, chi tiết đàm phán và thông tin khách hàng luôn được giữ kín.</li>
<li><strong>Trung lập</strong> — khi phiên dịch cho hai bên đối lập (vd một cuộc đàm phán), bạn đại diện CÔNG BẰNG cho cả hai bên; không bao giờ nghiêng về một phía hay "giúp" một bên.</li>
<li><strong>Đúng năng lực</strong> — chỉ nhận việc trong lĩnh vực mình nắm vững; dịch sai một thuật ngữ y khoa hay pháp lý có thể gây hậu quả thật.</li>
</ul>
<h3>Một chuẩn mực nghề nghiệp: CATTI</h3>
<p><strong>CATTI (中国翻译专业资格考试)</strong> là kỳ thi cấp chứng chỉ nghiệp vụ biên-phiên dịch chính thức của Trung Quốc — một cột mốc tham khảo hữu ích cho trình độ mà môn học này hướng tới, dù bạn không thi kỳ thi này.</p>
<div class="callout"><span class="badge">Ráp lại tất cả</span> Hãy luyện một đoạn hỗn hợp ngắn (kinh tế + ngoại giao) từ đầu đến cuối: lập sổ thuật ngữ trước, dịch, rồi kiểm lại số liệu, tính nhất quán thuật ngữ và sắc thái trước khi coi là xong.</div>`,
  ]]);

const c8q = quiz('cct402-quiz-8', 'Quiz 8 — Review & professional ethics|||Quiz 8 — Ôn tập & đạo đức nghề dịch', [
  { id: 'q1', question: 'Nguyên tắc đạo đức quan trọng nhất khi phiên dịch cho hai bên đàm phán đối lập là?', options: ['Nghiêng về bên trả phí cao hơn', 'Trung lập tuyệt đối, không thể hiện quan điểm cá nhân, chỉ truyền đạt đúng lời hai bên', 'Tự ý thêm ý kiến để hoà giải', 'Dịch có lợi cho bên mình quen biết'], correctIndex: 1, explanation: 'Người phiên dịch phải trung lập tuyệt đối, đại diện công bằng cho cả hai bên.' },
  { id: 'q2', question: 'Với văn bản pháp lý/kỹ thuật, tiêu chí nào trong "tín-đạt-nhã" cần ưu tiên gần như tuyệt đối?', options: ['Nhã (trau chuốt câu văn)', 'Tín (trung thực, chính xác tuyệt đối với bản gốc)', 'Đạt (thông suốt) quan trọng hơn Tín', 'Không cần tuân theo tiêu chí nào'], correctIndex: 1, explanation: 'Văn bản pháp lý/kỹ thuật đòi hỏi Tín (trung thực, chính xác) gần như tuyệt đối, hơn Đạt và Nhã.' },
  { id: 'q3', question: 'CATTI là gì?', options: ['Một phần mềm dịch tự động', 'Kỳ thi cấp chứng chỉ nghiệp vụ biên-phiên dịch chuyên nghiệp tại Trung Quốc', 'Một loại hợp đồng thương mại quốc tế', 'Tên gọi khác của phiên dịch song song'], correctIndex: 1, explanation: 'CATTI (中国翻译专业资格考试) là kỳ thi chứng chỉ nghiệp vụ biên-phiên dịch chính thức của Trung Quốc.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CCT402',
    slug: 'cct402-chinese-translation-and-interpretation-2',
    title: 'Chinese Translation and Interpretation 2',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CCT402.webp',
    shortDescription: 'Advanced Chinese-Vietnamese translation & interpreting — economic, political-diplomatic, sci-tech, legal, literary texts; intro to simultaneous interpreting, note-taking & memory; ethics.|||Biên - phiên dịch Trung-Việt nâng cao — văn bản kinh tế, chính trị-ngoại giao, khoa học-kỹ thuật, pháp luật, văn học; nhập môn phiên dịch song song, ghi chép & trí nhớ; đạo đức nghề.',
    description: 'Môn <strong>CCT402 — Chinese Translation and Interpretation 2</strong> (kỳ 5) tiếp nối CCT401, đưa sinh viên vào <strong>dịch chuyên ngành</strong> và <strong>nhập môn phiên dịch song song</strong>. Từ <strong>văn bản kinh tế - thương mại</strong> → <strong>chính trị - ngoại giao</strong> → <strong>khoa học - kỹ thuật</strong> → <strong>pháp luật &amp; hợp đồng</strong> → <strong>văn học &amp; văn hoá</strong> (giữ phong cách) → <strong>phiên dịch song song (同声传译)</strong> nhập môn → <strong>ghi chép ký hiệu &amp; trí nhớ</strong> cho phiên dịch đuổi → ôn tập thực hành &amp; <strong>đạo đức nghề dịch</strong>. Bám giáo trình 汉越翻译教程 &amp; 口译教程 (梅德明), mỗi chương có lý thuyết song ngữ, ví dụ dịch Trung-Việt thật và quiz.',
    whatYouLearn: 'Dịch văn bản kinh tế-thương mại (hợp đồng, báo cáo tài chính, giữ nguyên số liệu &amp; tiền tệ); văn bản chính trị-ngoại giao (thuật ngữ chính thống 一带一路, 人类命运共同体, giữ sắc thái); văn bản khoa học-kỹ thuật (thuật ngữ, câu bị động 被, đơn vị đo); văn bản pháp luật &amp; hợp đồng (甲方/乙方, số thứ tự điều khoản, dịch sát nghĩa không diễn giải); văn học &amp; văn hoá (tín-đạt-nhã 信达雅, xử lý thành ngữ 成语, giữ hình ảnh ẩn dụ); nhập môn phiên dịch song song (同声传译: ear-voice span, shadowing, chunking, anticipation); ghi chép ký hiệu phiên dịch (笔记) &amp; luyện trí nhớ ngắn hạn; đạo đức nghề dịch (trung thực, bảo mật, trung lập, đúng năng lực) và chuẩn CATTI.',
    requirements: 'Đã học CCT401 (Chinese Translation and Interpretation 1) hoặc trình độ HSK4 trở lên. Nên có sổ tay thuật ngữ riêng theo từng lĩnh vực và luyện nghe-nói tiếng Trung thường xuyên cho phần phiên dịch.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình 汉越翻译教程 & 口译教程, công cụ tra cứu, lộ trình luyện dịch chuyên ngành.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tiếp nối CCT401, lộ trình 8 chương dịch chuyên ngành & phiên dịch song song.', lessons: [intro] },
    { title: 'Chương 1 — Kinh tế - thương mại|||Chapter 1 — Economic & trade', description: 'Thuật ngữ hợp đồng/tài chính, số liệu & tiền tệ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chính trị - ngoại giao|||Chapter 2 — Political & diplomatic', description: 'Thuật ngữ chính thống, sắc thái ngoại giao.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Khoa học - kỹ thuật|||Chapter 3 — Sci-tech', description: 'Thuật ngữ kỹ thuật, câu bị động 被, đơn vị đo.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Pháp luật & hợp đồng|||Chapter 4 — Legal & contract', description: '甲方/乙方, số thứ tự điều khoản, dịch sát nghĩa.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Văn học & văn hoá|||Chapter 5 — Literary & cultural', description: 'Tín-đạt-nhã, thành ngữ 成语, giữ phong cách.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Phiên dịch song song|||Chapter 6 — Simultaneous interpreting', description: '同声传译 nhập môn: shadowing, chunking, anticipation.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Ghi chép ký hiệu & trí nhớ|||Chapter 7 — Note-taking & memory', description: '笔记 ký hiệu, cột dọc, luyện trí nhớ ngắn hạn.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập & đạo đức nghề dịch|||Chapter 8 — Review & professional ethics', description: 'Tổng ôn 7 kỹ năng, đạo đức nghề, CATTI.', lessons: [c8, c8q] },
  ],
};
