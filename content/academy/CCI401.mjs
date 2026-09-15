/**
 * CCI401 — Intercultural Communication in Chinese Contexts. Ngành Ngôn ngữ
 * Trung, FPTU Kỳ 5. Nhấn LÝ THUYẾT giao tiếp liên văn hoá (không trùng CCB401
 * — văn hoá kinh doanh; không trùng CHC401 — văn hoá truyền thống). Giáo
 * trình tham khảo (trích dẫn, không upload PDF): "Communication Between
 * Cultures" (Samovar & Porter); "Intercultural Communication" (Ting-Toomey);
 * 跨文化交际学. 8 chương: tổng quan & khái niệm văn hoá, chiều văn hoá Hofstede
 * áp dụng cho TQ, ngữ cảnh cao/thấp (Hall) & phong cách giao tiếp Trung Hoa,
 * phi ngôn ngữ & im lặng, bản sắc/định kiến/cú sốc văn hoá, rào cản & hiểu
 * lầm liên văn hoá, năng lực giao tiếp liên văn hoá & thích nghi, tình huống
 * Trung-Việt & ứng dụng. Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG
 * backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cci401-0-0-materials', 'Course materials|||Tài liệu tham khảo',
  'Ba nguồn tham khảo chính của môn (trích dẫn, không upload PDF) + tài liệu miễn phí, hợp pháp.',
  [[
    `<span class="eyebrow">CCI401 · Course materials</span>
<h2>Reference materials</h2>
<p class="lead">This course draws on three main references. They are <strong>cited</strong>, not distributed as PDFs — use the official FLM (flm.fpt.edu.vn) slide deck as the primary source, and the links below for further reading.</p>
<h3>📘 Core references (cited)</h3>
<ul>
<li><strong>"Communication Between Cultures"</strong> — Larry A. Samovar &amp; Richard E. Porter, the classic intercultural-communication textbook (culture, worldview, values, verbal/nonverbal codes).</li>
<li><strong>"Intercultural Communication: A Reader / Communicating Across Cultures"</strong> — Stella Ting-Toomey, face-negotiation theory &amp; mindfulness in intercultural competence.</li>
<li><strong>跨文化交际学</strong> (Intercultural Communication Studies) — Chinese-language textbook on 跨文化交际 theory and Chinese communication norms.</li>
</ul>
<h3>🌐 Free, legitimate resources</h3>
<ul>
<li><a href="https://www.hofstede-insights.com/country-comparison-tool" target="_blank" rel="noopener">Hofstede Insights — Country Comparison Tool</a> (China vs Vietnam vs your home country)</li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — tra chữ Hán &amp; pinyin trực tuyến</li>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển Hán-Anh có pinyin, tra thuật ngữ nhanh</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AsianBossVN" target="_blank" rel="noopener">Asian Boss</a> — phỏng vấn đường phố về nhận thức văn hoá châu Á</li>
<li><a href="https://www.youtube.com/@geerthofstede" target="_blank" rel="noopener">Hofstede Insights channel</a> — giải thích trực quan các chiều văn hoá</li>
</ul>
<div class="callout"><span class="badge">Study path</span>
<ol>
<li><strong>Foundations</strong> — culture &amp; intercultural communication, Hofstede's dimensions (Chapters 1–2).</li>
<li><strong>Codes</strong> — high/low context, nonverbal communication &amp; silence (Chapters 3–4).</li>
<li><strong>Self &amp; other</strong> — identity, stereotypes, culture shock, barriers (Chapters 5–6).</li>
<li><strong>Competence &amp; application</strong> — adaptation strategies, China-Vietnam cases (Chapters 7–8).</li>
</ol></div>`,
    `<span class="eyebrow">CCI401 · Tài liệu tham khảo</span>
<h2>Nguồn tham khảo</h2>
<p class="lead">Môn học dựa trên ba nguồn tham khảo chính. Các nguồn này được <strong>trích dẫn</strong>, không phát PDF — dùng slide chính thức trên <strong>FLM</strong> (flm.fpt.edu.vn) làm nguồn chuẩn, và các liên kết dưới đây để đọc thêm.</p>
<h3>📘 Nguồn tham khảo chính (trích dẫn)</h3>
<ul>
<li><strong>"Communication Between Cultures"</strong> — Larry A. Samovar &amp; Richard E. Porter, giáo trình kinh điển về giao tiếp liên văn hoá (văn hoá, thế giới quan, giá trị, mã ngôn ngữ/phi ngôn ngữ).</li>
<li><strong>"Intercultural Communication: A Reader / Communicating Across Cultures"</strong> — Stella Ting-Toomey, lý thuyết thương lượng thể diện (face-negotiation) &amp; sự tỉnh thức (mindfulness) trong năng lực liên văn hoá.</li>
<li><strong>跨文化交际学</strong> (Giao tiếp học Liên văn hoá) — giáo trình tiếng Trung về lý thuyết 跨文化交际 và chuẩn mực giao tiếp của người Trung Quốc.</li>
</ul>
<h3>🌐 Tài liệu miễn phí, hợp pháp</h3>
<ul>
<li><a href="https://www.hofstede-insights.com/country-comparison-tool" target="_blank" rel="noopener">Hofstede Insights — Công cụ so sánh quốc gia</a> (Trung Quốc so với Việt Nam và quốc gia của bạn)</li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — tra chữ Hán &amp; pinyin trực tuyến</li>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển Hán-Anh có pinyin, tra thuật ngữ nhanh</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AsianBossVN" target="_blank" rel="noopener">Asian Boss</a> — phỏng vấn đường phố về nhận thức văn hoá châu Á</li>
<li><a href="https://www.youtube.com/@geerthofstede" target="_blank" rel="noopener">Hofstede Insights channel</a> — giải thích trực quan các chiều văn hoá</li>
</ul>
<div class="callout"><span class="badge">Lộ trình học</span>
<ol>
<li><strong>Nền tảng</strong> — văn hoá &amp; giao tiếp liên văn hoá, các chiều văn hoá Hofstede (Chương 1–2).</li>
<li><strong>Mã giao tiếp</strong> — ngữ cảnh cao/thấp, phi ngôn ngữ &amp; im lặng (Chương 3–4).</li>
<li><strong>Bản thân &amp; người khác</strong> — bản sắc, định kiến, cú sốc văn hoá, rào cản (Chương 5–6).</li>
<li><strong>Năng lực &amp; ứng dụng</strong> — chiến lược thích nghi, tình huống Trung-Việt (Chương 7–8).</li>
</ol></div>`,
  ]]);

const intro = doc('cci401-0-1-overview', 'Course overview: Intercultural Communication in Chinese Contexts|||Tổng quan: Giao tiếp Liên văn hoá trong Bối cảnh Trung Hoa',
  'Vì sao thông thạo tiếng Trung không đủ nếu đọc sai văn hoá; lộ trình 8 chương từ lý thuyết nền đến tình huống Trung-Việt thực tế.',
  [[
    `<span class="eyebrow">CCI401 · Lesson 0.1 · Overview</span>
<h2>Intercultural Communication in Chinese Contexts</h2>
<p class="lead">Two people can share perfect vocabulary and grammar and still misunderstand each other completely — because language carries <strong>culture</strong>, and culture shapes what a silence means, when "yes" means "maybe," and whether disagreeing with a senior person out loud is honest or disrespectful. This course is not about Chinese business etiquette (CCB401) or Chinese traditional festivals and philosophy (CHC401) — it is the <strong>theory of intercultural communication itself</strong>: how culture, perception and communication interact, illustrated throughout with the Chinese context and Chinese terminology.</p>
<h3>Why this matters for a Chinese-language graduate</h3>
<p>Fluent Mandarin without a framework for <em>why</em> misunderstandings happen leaves you reacting case-by-case, guessing. This course gives you the vocabulary of the field itself — culture, worldview, cultural dimensions, high/low context, face, culture shock, communication competence — each paired with its standard <strong>Chinese term and pinyin</strong>, so you can read 跨文化交际学 literature and discuss the theory in Chinese, not just in Vietnamese or English.</p>
<h3>Roadmap — 8 chapters</h3>
<ol>
<li>Overview of intercultural communication &amp; the concept of culture</li>
<li>Cultural dimensions (Hofstede: collectivism, power distance) applied to China</li>
<li>High- vs low-context communication (Hall) &amp; Chinese communication style</li>
<li>Nonverbal communication &amp; silence in Chinese culture</li>
<li>Identity, stereotypes &amp; culture shock</li>
<li>Communication barriers &amp; intercultural misunderstanding</li>
<li>Intercultural communication competence &amp; adaptation</li>
<li>China-Vietnam communication situations &amp; practical application</li>
</ol>
<div class="callout"><span class="badge">How to study</span> Each chapter has one reading (theory + model + Chinese terms + a realistic situation) and one quiz. Treat the Chinese terms as the theory's own vocabulary, not decoration — a paper on 跨文化交际 will use exactly these words.</div>`,
    `<span class="eyebrow">CCI401 · Bài 0.1 · Tổng quan</span>
<h2>Giao tiếp Liên văn hoá trong Bối cảnh Trung Hoa</h2>
<p class="lead">Hai người có thể dùng đúng từ vựng, đúng ngữ pháp mà vẫn hiểu lầm nhau hoàn toàn — vì ngôn ngữ mang theo <strong>văn hoá</strong>, và văn hoá quyết định một khoảng lặng nghĩa là gì, khi nào "vâng" thực ra là "để xem đã", và việc phản đối cấp trên công khai là thẳng thắn hay vô lễ. Môn này không phải là nghi thức kinh doanh Trung Quốc (CCB401) hay lễ hội/triết lý truyền thống Trung Hoa (CHC401) — đây là <strong>chính lý thuyết giao tiếp liên văn hoá</strong>: văn hoá, nhận thức và giao tiếp tương tác với nhau ra sao, minh hoạ xuyên suốt bằng bối cảnh và thuật ngữ tiếng Trung.</p>
<h3>Vì sao quan trọng với sinh viên ngành Ngôn ngữ Trung</h3>
<p>Giỏi tiếng Trung mà thiếu khung lý thuyết giải thích <em>vì sao</em> hiểu lầm xảy ra thì bạn chỉ phản ứng từng tình huống, đoán mò. Môn này trang bị chính vốn từ của ngành học — văn hoá, thế giới quan, chiều văn hoá, ngữ cảnh cao/thấp, thể diện, cú sốc văn hoá, năng lực giao tiếp — mỗi khái niệm đi kèm <strong>thuật ngữ tiếng Trung chuẩn và pinyin</strong>, để bạn đọc được tài liệu 跨文化交际学 và bàn luận lý thuyết bằng tiếng Trung, không chỉ tiếng Việt hay tiếng Anh.</p>
<h3>Lộ trình — 8 chương</h3>
<ol>
<li>Tổng quan giao tiếp liên văn hoá &amp; khái niệm văn hoá</li>
<li>Các chiều văn hoá (Hofstede: chủ nghĩa tập thể, khoảng cách quyền lực) áp dụng cho Trung Quốc</li>
<li>Ngữ cảnh cao vs thấp (Hall) &amp; phong cách giao tiếp Trung Hoa</li>
<li>Giao tiếp phi ngôn ngữ &amp; im lặng trong văn hoá Trung</li>
<li>Bản sắc, định kiến &amp; cú sốc văn hoá</li>
<li>Rào cản giao tiếp &amp; hiểu lầm liên văn hoá</li>
<li>Năng lực giao tiếp liên văn hoá &amp; thích nghi</li>
<li>Tình huống giao tiếp Trung-Việt &amp; ứng dụng thực tế</li>
</ol>
<div class="callout"><span class="badge">Cách học</span> Mỗi chương có một bài đọc (lý thuyết + mô hình + thuật ngữ tiếng Trung + một tình huống sát thực tế) và một quiz. Coi thuật ngữ tiếng Trung là từ vựng của chính lý thuyết, không phải trang trí — một bài viết về 跨文化交际 sẽ dùng đúng những từ này.</div>`,
  ]]);

const c1 = doc('cci401-1-1-overview-culture', '1.1 — Overview of intercultural communication & the concept of culture|||1.1 — Tổng quan giao tiếp liên văn hoá & khái niệm văn hoá',
  'Định nghĩa giao tiếp liên văn hoá & văn hoá; mô hình tảng băng (văn hoá bề mặt/sâu); thế giới quan, dân tộc-trung-tâm, thuyết tương đối văn hoá.',
  [[
    `<span class="eyebrow">CCI401 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of intercultural communication &amp; the concept of culture</h2>
<p class="lead"><strong>Intercultural communication (跨文化交际 kuà wénhuà jiāojì)</strong> is communication between people whose different cultures shape different assumptions about what is polite, true, or "just common sense." Understanding it starts with defining its object: <strong>culture (文化 wénhuà)</strong>. Samovar &amp; Porter define culture as a system of shared knowledge, values, beliefs, and norms — <em>learned</em>, not innate, and passed across generations, guiding how members of a group perceive and behave.</p>
<h3>The iceberg model of culture</h3>
<p>Culture is often pictured as an iceberg: a small visible tip above the waterline — food, dress, festivals, language — and a much larger mass hidden below — values, notions of time, hierarchy, face, what counts as "rude." Most intercultural friction happens <em>below</em> the waterline, where assumptions are invisible and rarely stated out loud.</p>
<h3>Worldview, ethnocentrism &amp; cultural relativism</h3>
<ul>
<li><strong>世界观 (shìjièguān)</strong> — worldview: a culture's underlying answers to questions like "what is a person's place relative to the group," which most members never consciously articulate.</li>
<li><strong>民族中心主义 (mínzú zhōngxīn zhǔyì)</strong> — ethnocentrism: judging another culture by the standards of one's own, treating one's own norms as the natural or correct baseline.</li>
<li><strong>文化相对主义 (wénhuà xiāngduì zhǔyì)</strong> — cultural relativism: the corrective stance of trying to understand a culture's practices on its own terms, within its own logic, before judging them.</li>
</ul>
<pre><code>Term table — Chapter 1
Hanzi           Pinyin              Meaning
文化            wénhuà              Culture
跨文化交际      kuà wénhuà jiāojì   Intercultural communication
价值观          jiàzhíguān          Values
世界观          shìjièguān          Worldview
民族中心主义    mínzú zhōngxīn zhǔyì  Ethnocentrism
文化相对主义    wénhuà xiāngduì zhǔyì  Cultural relativism
</code></pre>
<div class="callout"><span class="badge">Case</span> A Vietnamese exchange student in China was greeted with "你吃了吗?" (Nǐ chīle ma? — "Have you eaten?") and answered literally, describing his diet in detail. His Chinese host laughed, confused — the phrase is a surface-culture greeting formula functioning like "how are you," not a real question about food. The words were correct; the deep-culture function of the phrase was missed.</div>`,
    `<span class="eyebrow">CCI401 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan giao tiếp liên văn hoá &amp; khái niệm văn hoá</h2>
<p class="lead"><strong>Giao tiếp liên văn hoá (跨文化交际 kuà wénhuà jiāojì)</strong> là giao tiếp giữa những người mà văn hoá khác nhau khiến họ có giả định khác nhau về điều gì là lịch sự, đúng đắn, hay "hiển nhiên". Muốn hiểu nó, trước tiên phải định nghĩa đối tượng của nó: <strong>văn hoá (文化 wénhuà)</strong>. Samovar &amp; Porter định nghĩa văn hoá là một hệ thống tri thức, giá trị, niềm tin và chuẩn mực được chia sẻ — <em>học được</em>, không phải bẩm sinh, được truyền qua các thế hệ, định hướng cách thành viên trong nhóm nhận thức và hành xử.</p>
<h3>Mô hình tảng băng văn hoá</h3>
<p>Văn hoá thường được hình dung như một tảng băng: một phần nhỏ nhìn thấy được nhô trên mặt nước — ẩm thực, trang phục, lễ hội, ngôn ngữ — và một khối lớn hơn nhiều chìm bên dưới — giá trị, quan niệm về thời gian, cấp bậc, thể diện, thế nào là "vô lễ". Phần lớn xung đột liên văn hoá xảy ra <em>dưới</em> mặt nước, nơi các giả định vô hình và hiếm khi được nói ra.</p>
<h3>Thế giới quan, dân tộc-trung-tâm &amp; thuyết tương đối văn hoá</h3>
<ul>
<li><strong>世界观 (shìjièguān)</strong> — thế giới quan: những câu trả lời nền tảng của một nền văn hoá cho các câu hỏi như "vị trí của cá nhân so với nhóm là gì", điều mà hầu hết thành viên chưa bao giờ diễn đạt thành lời một cách có ý thức.</li>
<li><strong>民族中心主义 (mínzú zhōngxīn zhǔyì)</strong> — chủ nghĩa dân tộc-trung-tâm (ethnocentrism): đánh giá một nền văn hoá khác bằng chuẩn mực của văn hoá mình, coi chuẩn mực của mình là mặc định hoặc đúng đắn.</li>
<li><strong>文化相对主义 (wénhuà xiāngduì zhǔyì)</strong> — thuyết tương đối văn hoá: lập trường điều chỉnh, cố gắng hiểu thực hành của một nền văn hoá theo logic riêng của nó, trước khi phán xét.</li>
</ul>
<pre><code>Bảng thuật ngữ — Chương 1
Hán tự          Pinyin              Nghĩa
文化            wénhuà              Văn hoá
跨文化交际      kuà wénhuà jiāojì   Giao tiếp liên văn hoá
价值观          jiàzhíguān          Giá trị quan
世界观          shìjièguān          Thế giới quan
民族中心主义    mínzú zhōngxīn zhǔyì  Chủ nghĩa dân tộc-trung-tâm
文化相对主义    wénhuà xiāngduì zhǔyì  Thuyết tương đối văn hoá
</code></pre>
<div class="callout"><span class="badge">Tình huống</span> Một sinh viên trao đổi người Việt ở Trung Quốc được chào bằng "你吃了吗?" (Nǐ chīle ma? — "Ăn cơm chưa?") và trả lời theo nghĩa đen, kể chi tiết chế độ ăn của mình. Người bạn Trung Quốc bật cười, bối rối — câu này là công thức chào hỏi ở tầng văn hoá bề mặt, tương đương "bạn khoẻ không", không phải câu hỏi thật về ăn uống. Từ ngữ đúng, nhưng chức năng ở tầng văn hoá sâu thì bị bỏ lỡ.</div>`,
  ]]);

const c1q = quiz('cci401-quiz-1', 'Quiz 1 — Culture & intercultural communication|||Quiz 1 — Văn hoá & giao tiếp liên văn hoá', [
  { id: 'q1', question: 'Trong mô hình tảng băng văn hoá, phần lớn xung đột liên văn hoá thường xảy ra ở đâu?', options: ['Phần nổi (ẩm thực, trang phục, lễ hội)', 'Phần chìm (giá trị, thế giới quan, cấp bậc, thể diện)', 'Cả hai phần như nhau', 'Không liên quan đến mô hình tảng băng'], correctIndex: 1, explanation: 'Phần chìm chứa các giả định vô hình, hiếm khi được nói ra — đây là nơi hiểu lầm thường bắt nguồn.' },
  { id: 'q2', question: '"民族中心主义" (ethnocentrism) nghĩa là gì?', options: ['Hiểu một văn hoá theo logic riêng của nó', 'Đánh giá văn hoá khác theo chuẩn mực của văn hoá mình', 'Yêu quê hương, dân tộc mình', 'Học ngôn ngữ của một dân tộc khác'], correctIndex: 1, explanation: 'Ethnocentrism là coi chuẩn mực văn hoá của mình là mặc định/đúng đắn khi đánh giá văn hoá khác.' },
  { id: 'q3', question: 'Câu chào "你吃了吗?" (Nǐ chīle ma?) trong tình huống ở bài học minh hoạ điều gì?', options: ['Người Trung Quốc luôn quan tâm đến chế độ ăn của khách', 'Một câu ở tầng văn hoá bề mặt có thể mang chức năng khác với nghĩa đen', 'Đây là một lời mời ăn cơm thực sự cần nhận lời', 'Câu này chỉ dùng trong gia đình'], correctIndex: 1, explanation: 'Đây là công thức chào hỏi (tương đương "khoẻ không") — hiểu theo nghĩa đen là bỏ lỡ chức năng văn hoá thật.' },
]);

const c2 = doc('cci401-2-1-hofstede-china', '2.1 — Cultural dimensions (Hofstede) applied to China|||2.1 — Các chiều văn hoá (Hofstede) áp dụng cho Trung Quốc',
  'Thuyết chiều văn hoá Hofstede: cá nhân vs tập thể, khoảng cách quyền lực, định hướng dài hạn, né tránh bất định — điểm số của Trung Quốc.',
  [[
    `<span class="eyebrow">CCI401 · Chapter 2 · Lesson 2.1</span>
<h2>Cultural dimensions (Hofstede) applied to China</h2>
<p class="lead">Geert Hofstede's <strong>cultural dimensions theory (文化维度理论 wénhuà wéidù lǐlùn)</strong> ranks national cultures along measurable axes, built from a landmark large-scale employee survey. Two dimensions matter most for reading Chinese communication.</p>
<h3>Individualism vs collectivism</h3>
<p><strong>个人主义 (gèrén zhǔyì)</strong> — individualism — societies where ties between individuals are loose and self-reliance is prized, versus <strong>集体主义 (jítǐ zhǔyì)</strong> — collectivism — societies where people are integrated into strong in-groups (family, work unit 单位) that protect them in exchange for loyalty. China scores strongly collectivist: identity is defined partly through group belonging, and group harmony often outweighs individual preference in a decision.</p>
<h3>Power distance</h3>
<p><strong>权力距离 (quánlì jùlí)</strong> — power distance — the extent to which less powerful members of institutions accept that power is distributed unequally. China scores high: subordinates generally expect and accept direction from superiors, and openly challenging a senior person's decision in a public setting is uncommon and can cause discomfort on both sides.</p>
<h3>Two more dimensions</h3>
<ul>
<li><strong>长期取向 (chángqī qǔxiàng)</strong> — long-term orientation: China scores very high — pragmatism, thrift and perseverance toward future reward are valued over quick wins or rigid tradition.</li>
<li><strong>不确定性规避 (bú quèdìngxìng guī bì)</strong> — uncertainty avoidance: moderate in China — comfortable with ambiguity in some social situations, but risk-averse and rule-bound in bureaucratic ones.</li>
</ul>
<pre><code>Term table — Chapter 2
Hanzi               Pinyin                  Meaning
文化维度理论        wénhuà wéidù lǐlùn      Cultural dimensions theory
集体主义            jítǐ zhǔyì              Collectivism
个人主义            gèrén zhǔyì             Individualism
权力距离            quánlì jùlí             Power distance
长期取向            chángqī qǔxiàng         Long-term orientation
不确定性规避        bú quèdìngxìng guī bì   Uncertainty avoidance
</code></pre>
<div class="callout"><span class="badge">Case</span> A European intern at a Chinese company openly disagreed with her manager's plan during a team meeting, expecting to be seen as engaged and honest. The room went quiet, and her manager appeared to lose face in front of the team. In a high-power-distance, collectivist setting, disagreement is usually raised privately or phrased as a shared question ("maybe we should double-check this together"), not delivered as a public individual challenge.</div>`,
    `<span class="eyebrow">CCI401 · Chương 2 · Bài 2.1</span>
<h2>Các chiều văn hoá (Hofstede) áp dụng cho Trung Quốc</h2>
<p class="lead"><strong>Thuyết chiều văn hoá của Geert Hofstede (文化维度理论 wénhuà wéidù lǐlùn)</strong> xếp hạng các nền văn hoá quốc gia theo các trục có thể đo lường, xây dựng từ một khảo sát nhân viên quy mô lớn mang tính bước ngoặt. Hai chiều quan trọng nhất để đọc giao tiếp Trung Quốc là:</p>
<h3>Cá nhân vs tập thể</h3>
<p><strong>个人主义 (gèrén zhǔyì)</strong> — chủ nghĩa cá nhân — xã hội mà mối liên kết giữa các cá nhân lỏng lẻo và tự lực được coi trọng, đối lập với <strong>集体主义 (jítǐ zhǔyì)</strong> — chủ nghĩa tập thể — xã hội mà con người gắn với các nhóm-trong (gia đình, đơn vị công tác 单位) vốn bảo vệ họ để đổi lấy lòng trung thành. Trung Quốc có điểm chủ nghĩa tập thể rất cao: bản sắc cá nhân được định hình một phần qua việc thuộc về nhóm, và sự hoà hợp nhóm thường quan trọng hơn sở thích cá nhân khi ra quyết định.</p>
<h3>Khoảng cách quyền lực</h3>
<p><strong>权力距离 (quánlì jùlí)</strong> — khoảng cách quyền lực — mức độ mà thành viên ít quyền lực hơn trong một thể chế chấp nhận quyền lực được phân bố không đồng đều. Trung Quốc có điểm cao: cấp dưới nhìn chung kỳ vọng và chấp nhận sự chỉ đạo từ cấp trên, và việc công khai phản đối quyết định của người cấp cao ở nơi đông người là hiếm gặp và có thể gây khó xử cho cả hai phía.</p>
<h3>Hai chiều còn lại</h3>
<ul>
<li><strong>长期取向 (chángqī qǔxiàng)</strong> — định hướng dài hạn: Trung Quốc có điểm rất cao — coi trọng thực dụng, tiết kiệm và kiên trì hướng tới lợi ích tương lai hơn là thắng nhanh hay giữ truyền thống một cách cứng nhắc.</li>
<li><strong>不确定性规避 (bú quèdìngxìng guī bì)</strong> — né tránh bất định: ở mức trung bình tại Trung Quốc — thoải mái với sự mơ hồ trong một số tình huống xã hội, nhưng ngại rủi ro và tuân thủ quy tắc chặt trong bối cảnh hành chính.</li>
</ul>
<pre><code>Bảng thuật ngữ — Chương 2
Hán tự              Pinyin                  Nghĩa
文化维度理论        wénhuà wéidù lǐlùn      Thuyết chiều văn hoá
集体主义            jítǐ zhǔyì              Chủ nghĩa tập thể
个人主义            gèrén zhǔyì             Chủ nghĩa cá nhân
权力距离            quánlì jùlí             Khoảng cách quyền lực
长期取向            chángqī qǔxiàng         Định hướng dài hạn
不确定性规避        bú quèdìngxìng guī bì   Né tránh bất định
</code></pre>
<div class="callout"><span class="badge">Tình huống</span> Một thực tập sinh châu Âu tại một công ty Trung Quốc công khai phản đối kế hoạch của quản lý ngay trong cuộc họp nhóm, nghĩ rằng làm vậy thể hiện sự chủ động và thẳng thắn. Cả phòng im lặng, và người quản lý có vẻ mất mặt trước cả nhóm. Trong bối cảnh khoảng cách quyền lực cao và chủ nghĩa tập thể mạnh, bất đồng thường được nêu riêng tư hoặc diễn đạt như một câu hỏi chung ("có lẽ chúng ta nên kiểm tra lại cùng nhau"), chứ không phải một lời thách thức cá nhân công khai.</div>`,
  ]]);

const c2q = quiz('cci401-quiz-2', 'Quiz 2 — Hofstede dimensions|||Quiz 2 — Chiều văn hoá Hofstede', [
  { id: 'q1', question: 'Trung Quốc có điểm số như thế nào ở chiều "chủ nghĩa cá nhân/tập thể" của Hofstede?', options: ['Rất cá nhân chủ nghĩa', 'Rất tập thể chủ nghĩa', 'Trung tính, không nghiêng bên nào', 'Không đo được vì quá đa dạng vùng miền'], correctIndex: 1, explanation: 'Trung Quốc scores strongly collectivist — nhóm-trong (gia đình, đơn vị) quan trọng hơn sở thích cá nhân.' },
  { id: 'q2', question: '"权力距离" (power distance) cao có nghĩa là gì trong một tổ chức?', options: ['Cấp dưới thường xuyên phản đối cấp trên công khai', 'Cấp dưới chấp nhận và kỳ vọng sự phân bố quyền lực không đồng đều', 'Không có cấp bậc nào trong tổ chức', 'Quyền lực được luân phiên định kỳ'], correctIndex: 1, explanation: 'Power distance cao: thành viên ít quyền lực chấp nhận khoảng cách quyền lực là bình thường.' },
  { id: 'q3', question: 'Trong tình huống ở bài học, vì sao việc thực tập sinh phản đối công khai lại gây khó xử?', options: ['Vì cô ấy nói sai nội dung chuyên môn', 'Vì nó đi ngược chuẩn mực khoảng cách quyền lực cao & tập thể của bối cảnh', 'Vì cô ấy nói tiếng Anh thay vì tiếng Trung', 'Vì cuộc họp diễn ra ngoài giờ làm việc'], correctIndex: 1, explanation: 'Thách thức cá nhân công khai với cấp trên đi ngược chuẩn mực trong bối cảnh khoảng cách quyền lực cao, tập thể.' },
]);

const c3 = doc('cci401-3-1-high-low-context', '3.1 — High- vs low-context communication (Hall) & Chinese communication style|||3.1 — Ngữ cảnh cao vs thấp (Hall) & phong cách giao tiếp Trung Hoa',
  'Thuyết ngữ cảnh của Edward Hall: văn hoá ngữ cảnh cao (TQ) dựa vào hàm ý, quan hệ, cách nói tránh — khác văn hoá ngữ cảnh thấp dựa vào lời nói rõ ràng.',
  [[
    `<span class="eyebrow">CCI401 · Chapter 3 · Lesson 3.1</span>
<h2>High- vs low-context communication (Hall) &amp; Chinese communication style</h2>
<p class="lead">Anthropologist Edward T. Hall's <strong>context theory (语境理论)</strong> distinguishes cultures by how much meaning lives in the explicit words versus in shared context. <strong>语境 (yǔjìng)</strong> — context — is the surrounding information (relationship history, tone, situation, silence) that carries part of the message.</p>
<h3>High-context vs low-context</h3>
<ul>
<li><strong>高语境文化 (gāo yǔjìng wénhuà)</strong> — high-context culture: much of the meaning is implicit, relying on relationship, tone and shared background; China (and most of East Asia) sits here.</li>
<li><strong>低语境文化 (dī yǔjìng wénhuà)</strong> — low-context culture: meaning is expected to be spelled out explicitly in the words themselves; many Western cultures (Germany, the US, the Netherlands) sit closer to this end.</li>
</ul>
<h3>Reading between the lines</h3>
<p>In a high-context exchange, a listener trained to expect explicit statements can miss the actual message — the real content is <strong>言外之意 (yánwàizhīyì)</strong>, "implication beyond the words." Chinese speakers often favour <strong>委婉 (wěiwǎn)</strong> — indirect, softened phrasing — over a blunt "no," to preserve harmony and the other person's face. The listener's job is <strong>察言观色 (chá yán guān sè)</strong> — "observe the words, watch the expression" — reading tone, hesitation and facial cues alongside the literal sentence.</p>
<pre><code>Term table — Chapter 3
Hanzi           Pinyin              Meaning
语境            yǔjìng              Context
高语境文化      gāo yǔjìng wénhuà   High-context culture
低语境文化      dī yǔjìng wénhuà    Low-context culture
言外之意        yánwàizhīyì         Implication beyond the words
委婉            wěiwǎn              Indirect / softened (speech)
察言观色        chá yán guān sè     Read words, watch expressions
</code></pre>
<div class="callout"><span class="badge">Case</span> A Chinese partner responded to a proposal with "这个建议很有意思，我们再研究研究" (Zhège jiànyì hěn yǒuyìsi, wǒmen zài yánjiū yánjiū — "This suggestion is quite interesting, we'll study it further"). A low-context listener treated this as encouraging and expected a follow-up meeting. In high-context Chinese business register, this is a conventional soft way of declining without saying "no" outright — no further contact usually confirms it.</div>`,
    `<span class="eyebrow">CCI401 · Chương 3 · Bài 3.1</span>
<h2>Ngữ cảnh cao vs thấp (Hall) &amp; phong cách giao tiếp Trung Hoa</h2>
<p class="lead">Nhà nhân học Edward T. Hall đưa ra <strong>thuyết ngữ cảnh (语境理论)</strong>, phân biệt các nền văn hoá theo việc ý nghĩa nằm trong lời nói rõ ràng hay trong ngữ cảnh chung. <strong>语境 (yǔjìng)</strong> — ngữ cảnh — là thông tin xung quanh (lịch sử quan hệ, giọng điệu, tình huống, khoảng lặng) mang một phần thông điệp.</p>
<h3>Ngữ cảnh cao vs ngữ cảnh thấp</h3>
<ul>
<li><strong>高语境文化 (gāo yǔjìng wénhuà)</strong> — văn hoá ngữ cảnh cao: phần lớn ý nghĩa là ngầm định, dựa vào quan hệ, giọng điệu và nền tảng chung; Trung Quốc (và phần lớn Đông Á) thuộc nhóm này.</li>
<li><strong>低语境文化 (dī yǔjìng wénhuà)</strong> — văn hoá ngữ cảnh thấp: ý nghĩa được kỳ vọng nói rõ ràng ngay trong câu chữ; nhiều nền văn hoá phương Tây (Đức, Mỹ, Hà Lan) gần với đầu này hơn.</li>
</ul>
<h3>Đọc giữa các dòng chữ</h3>
<p>Trong một trao đổi ngữ cảnh cao, người nghe quen chờ câu nói rõ ràng có thể bỏ lỡ thông điệp thật — nội dung thật nằm ở <strong>言外之意 (yánwàizhīyì)</strong>, "hàm ý ngoài lời nói". Người Trung Quốc thường ưu tiên <strong>委婉 (wěiwǎn)</strong> — cách nói gián tiếp, nhẹ nhàng — hơn là một lời "không" thẳng thừng, để giữ hoà khí và thể diện cho đối phương. Nhiệm vụ của người nghe là <strong>察言观色 (chá yán guān sè)</strong> — "nghe lời, quan sát sắc mặt" — đọc giọng điệu, sự ngập ngừng và biểu cảm khuôn mặt cùng với câu chữ theo nghĩa đen.</p>
<pre><code>Bảng thuật ngữ — Chương 3
Hán tự          Pinyin              Nghĩa
语境            yǔjìng              Ngữ cảnh
高语境文化      gāo yǔjìng wénhuà   Văn hoá ngữ cảnh cao
低语境文化      dī yǔjìng wénhuà    Văn hoá ngữ cảnh thấp
言外之意        yánwàizhīyì         Hàm ý ngoài lời nói
委婉            wěiwǎn              Nói gián tiếp/nhẹ nhàng
察言观色        chá yán guān sè     Nghe lời, quan sát sắc mặt
</code></pre>
<div class="callout"><span class="badge">Tình huống</span> Một đối tác Trung Quốc trả lời đề xuất bằng câu "这个建议很有意思，我们再研究研究" (Zhège jiànyì hěn yǒuyìsi, wǒmen zài yánjiū yánjiū — "Đề xuất này khá thú vị, chúng tôi sẽ nghiên cứu thêm"). Người nghe theo tư duy ngữ cảnh thấp coi đây là tín hiệu tích cực và chờ cuộc họp tiếp theo. Trong khẩu ngữ kinh doanh Trung Quốc ngữ cảnh cao, đây là cách từ chối nhẹ nhàng thông thường mà không nói "không" trực tiếp — việc không liên hệ lại thường xác nhận điều đó.</div>`,
  ]]);

const c3q = quiz('cci401-quiz-3', 'Quiz 3 — High/low context|||Quiz 3 — Ngữ cảnh cao/thấp', [
  { id: 'q1', question: 'Văn hoá "ngữ cảnh cao" (高语境文化) có đặc điểm gì?', options: ['Ý nghĩa được nói rõ hoàn toàn bằng lời', 'Phần lớn ý nghĩa nằm ở hàm ý, quan hệ, giọng điệu chứ không chỉ ở câu chữ', 'Không có giao tiếp phi ngôn ngữ', 'Chỉ dùng trong văn viết, không dùng khi nói'], correctIndex: 1, explanation: 'Ngữ cảnh cao: ý nghĩa nằm nhiều ở ngữ cảnh, quan hệ, giọng điệu — không chỉ ở lời nói tường minh.' },
  { id: 'q2', question: '"这个建议很有意思，我们再研究研究" trong bối cảnh kinh doanh Trung Quốc thường được hiểu là gì?', options: ['Chấp nhận đề xuất ngay lập tức', 'Một cách từ chối nhẹ nhàng, gián tiếp (委婉)', 'Yêu cầu gửi thêm tài liệu', 'Lời mời họp chính thức'], correctIndex: 1, explanation: 'Đây là công thức từ chối nhẹ nhàng thường gặp — không nói "không" trực tiếp để giữ hoà khí.' },
  { id: 'q3', question: '"察言观色" (chá yán guān sè) mô tả kỹ năng nào?', options: ['Ghi nhớ từ vựng nhanh', 'Nghe lời nói và quan sát biểu cảm/sắc mặt để hiểu hàm ý', 'Nói thật to để gây chú ý', 'Dịch từng chữ sang tiếng Anh'], correctIndex: 1, explanation: '察言观色 là kỹ năng đọc giữa các dòng — quan trọng trong giao tiếp ngữ cảnh cao.' },
]);

const c4 = doc('cci401-4-1-nonverbal-silence', '4.1 — Nonverbal communication & silence in Chinese culture|||4.1 — Giao tiếp phi ngôn ngữ & im lặng trong văn hoá Trung',
  'Phi ngôn ngữ (ánh mắt, không gian cá nhân, ngôn ngữ cơ thể); im lặng như tôn trọng/suy nghĩ/bất đồng ngầm chứ không phải trống rỗng.',
  [[
    `<span class="eyebrow">CCI401 · Chapter 4 · Lesson 4.1</span>
<h2>Nonverbal communication &amp; silence in Chinese culture</h2>
<p class="lead">In high-context cultures, <strong>nonverbal communication (非语言交际 fēi yǔyán jiāojì)</strong> often carries more relational meaning than the words themselves — body language, eye contact, personal space, and especially <strong>silence (沉默 chénmò)</strong>.</p>
<h3>Silence is not empty</h3>
<p>In many low-context settings, silence signals awkwardness or disagreement that needs to be filled quickly. In Chinese communication, silence can instead signal respect for a senior speaker, careful thought before answering, tacit agreement, or a way to express reluctance without open confrontation. The idiom <strong>沉默是金 (chénmò shì jīn)</strong> — "silence is golden" — reflects a cultural value placed on restraint over hasty speech.</p>
<h3>Eye contact, space &amp; body language</h3>
<ul>
<li><strong>眼神交流 (yǎnshén jiāoliú)</strong> — eye contact: sustained, direct eye contact with an elder or superior can read as a challenge rather than as attentiveness, unlike norms where looking away signals evasiveness.</li>
<li><strong>个人空间 (gèrén kōngjiān)</strong> — personal space: comfortable distance is often closer in crowded public settings (queues, markets) but more reserved between unfamiliar business contacts.</li>
<li><strong>肢体语言 (zhītǐ yǔyán)</strong> — body language: a slight bow of the head, a soft handshake, or restrained gesturing often communicate respect rather than passivity.</li>
</ul>
<pre><code>Term table — Chapter 4
Hanzi           Pinyin              Meaning
非语言交际      fēi yǔyán jiāojì    Nonverbal communication
沉默            chénmò              Silence
眼神交流        yǎnshén jiāoliú     Eye contact
个人空间        gèrén kōngjiān      Personal space
肢体语言        zhītǐ yǔyán         Body language
沉默是金        chénmò shì jīn      "Silence is golden"
</code></pre>
<div class="callout"><span class="badge">Case</span> A Western trainer running a workshop in China paused after asking a question and, met with about eight seconds of silence, quickly moved on, assuming no one understood. A debrief later revealed several trainees were still forming a considered answer and felt cut off mid-thought. Trainers working in high-context settings often need to tolerate a longer silence before repeating or rephrasing.</div>`,
    `<span class="eyebrow">CCI401 · Chương 4 · Bài 4.1</span>
<h2>Giao tiếp phi ngôn ngữ &amp; im lặng trong văn hoá Trung</h2>
<p class="lead">Trong các nền văn hoá ngữ cảnh cao, <strong>giao tiếp phi ngôn ngữ (非语言交际 fēi yǔyán jiāojì)</strong> thường mang nhiều ý nghĩa quan hệ hơn cả lời nói — ngôn ngữ cơ thể, ánh mắt, không gian cá nhân, và đặc biệt là <strong>sự im lặng (沉默 chénmò)</strong>.</p>
<h3>Im lặng không phải trống rỗng</h3>
<p>Trong nhiều bối cảnh ngữ cảnh thấp, im lặng báo hiệu sự ngượng ngùng hoặc bất đồng cần được lấp đầy nhanh chóng. Trong giao tiếp của người Trung Quốc, im lặng có thể thay vào đó báo hiệu sự tôn trọng người nói lớn tuổi/cấp cao hơn, sự cân nhắc kỹ trước khi trả lời, sự đồng ý ngầm, hoặc một cách thể hiện sự miễn cưỡng mà không đối đầu công khai. Thành ngữ <strong>沉默是金 (chénmò shì jīn)</strong> — "im lặng là vàng" — phản ánh giá trị văn hoá coi trọng sự tiết chế hơn là nói vội.</p>
<h3>Ánh mắt, không gian &amp; ngôn ngữ cơ thể</h3>
<ul>
<li><strong>眼神交流 (yǎnshén jiāoliú)</strong> — giao tiếp bằng mắt: nhìn thẳng, kéo dài vào mắt người lớn tuổi hoặc cấp trên có thể bị đọc là thách thức thay vì chăm chú lắng nghe, khác với chuẩn mực coi tránh ánh mắt là né tránh.</li>
<li><strong>个人空间 (gèrén kōngjiān)</strong> — không gian cá nhân: khoảng cách thoải mái thường gần hơn ở nơi công cộng đông đúc (xếp hàng, chợ) nhưng dè dặt hơn giữa các đối tác kinh doanh chưa quen biết.</li>
<li><strong>肢体语言 (zhītǐ yǔyán)</strong> — ngôn ngữ cơ thể: một cái gật đầu nhẹ, cái bắt tay nhẹ nhàng, hay cử chỉ tiết chế thường truyền tải sự tôn trọng chứ không phải thụ động.</li>
</ul>
<pre><code>Bảng thuật ngữ — Chương 4
Hán tự          Pinyin              Nghĩa
非语言交际      fēi yǔyán jiāojì    Giao tiếp phi ngôn ngữ
沉默            chénmò              Im lặng
眼神交流        yǎnshén jiāoliú     Giao tiếp bằng ánh mắt
个人空间        gèrén kōngjiān      Không gian cá nhân
肢体语言        zhītǐ yǔyán         Ngôn ngữ cơ thể
沉默是金        chénmò shì jīn      "Im lặng là vàng"
</code></pre>
<div class="callout"><span class="badge">Tình huống</span> Một giảng viên phương Tây dạy workshop ở Trung Quốc đặt câu hỏi, gặp khoảng tám giây im lặng, liền vội chuyển sang phần khác, nghĩ rằng không ai hiểu. Buổi rút kinh nghiệm sau đó cho thấy vài học viên vẫn đang suy nghĩ câu trả lời cẩn thận và cảm thấy bị cắt ngang. Giảng viên làm việc trong bối cảnh ngữ cảnh cao thường cần chịu đựng khoảng lặng dài hơn trước khi lặp lại hay diễn đạt lại câu hỏi.</div>`,
  ]]);

const c4q = quiz('cci401-quiz-4', 'Quiz 4 — Nonverbal & silence|||Quiz 4 — Phi ngôn ngữ & im lặng', [
  { id: 'q1', question: 'Trong nhiều bối cảnh giao tiếp Trung Quốc, sự im lặng (沉默) sau một câu hỏi có thể mang nghĩa gì?', options: ['Luôn luôn là không hiểu câu hỏi', 'Có thể là tôn trọng, suy nghĩ cẩn thận, hoặc bất đồng ngầm', 'Luôn là dấu hiệu tức giận', 'Không mang ý nghĩa giao tiếp nào'], correctIndex: 1, explanation: 'Im lặng trong văn hoá ngữ cảnh cao có nhiều chức năng — không nên mặc định là không hiểu hay từ chối.' },
  { id: 'q2', question: 'Nhìn thẳng, kéo dài vào mắt một người lớn tuổi/cấp trên trong bối cảnh Trung Quốc có thể bị hiểu là?', options: ['Luôn được đánh giá là chăm chú, lịch sự', 'Có thể bị đọc như một sự thách thức', 'Bắt buộc phải làm để thể hiện tôn trọng', 'Không có ý nghĩa văn hoá nào'], correctIndex: 1, explanation: 'Ánh mắt trực diện kéo dài với người cấp cao hơn có thể bị hiểu khác với một số chuẩn mực phương Tây.' },
  { id: 'q3', question: 'Bài học rút ra từ tình huống người giảng viên vội chuyển chủ đề sau tám giây im lặng là gì?', options: ['Luôn nên bỏ qua câu hỏi khó', 'Cần tôn trọng khoảng lặng dài hơn trước khi lặp lại/diễn đạt lại', 'Học viên Trung Quốc không thích trả lời câu hỏi', 'Nên chuyển sang tiếng Trung ngay lập tức'], correctIndex: 1, explanation: 'Im lặng dài hơn có thể là học viên đang suy nghĩ — cần kiên nhẫn hơn trước khi kết luận.' },
]);

const c5 = doc('cci401-5-1-identity-stereotype-shock', '5.1 — Identity, stereotypes & culture shock|||5.1 — Bản sắc, định kiến & cú sốc văn hoá',
  'Bản sắc văn hoá, định kiến, thiên kiến; mô hình chữ U của cú sốc văn hoá: mật ngọt, khủng hoảng, thích nghi, hoà nhập.',
  [[
    `<span class="eyebrow">CCI401 · Chapter 5 · Lesson 5.1</span>
<h2>Identity, stereotypes &amp; culture shock</h2>
<p class="lead"><strong>Cultural identity (文化身份 wénhuà shēnfèn)</strong> is the part of a person's self-concept drawn from perceived membership in a cultural group. It shapes how someone communicates and how others interpret them before a word is even said.</p>
<h3>Stereotype &amp; prejudice</h3>
<ul>
<li><strong>刻板印象 (kèbǎn yìnxiàng)</strong> — stereotype: an oversimplified, generalized belief about a group; even a "positive" stereotype flattens individual variation.</li>
<li><strong>偏见 (piānjiàn)</strong> — prejudice: a negative attitude formed from a stereotype, often held before any real interaction with a member of the group.</li>
</ul>
<h3>Culture shock — the U-curve</h3>
<p><strong>文化冲击 (wénhuà chōngjī)</strong> — culture shock — is the psychological disorientation from losing familiar cultural cues. It is commonly modeled as a U-shaped curve with roughly four stages: <strong>蜜月期 (mìyuèqī)</strong> — the honeymoon phase, excitement and curiosity about everything new; a crisis phase of frustration, homesickness and irritation at small things; <strong>适应期 (shìyìngqī)</strong> — the adjustment phase, where coping strategies form and humor returns; and finally adaptation/mastery, functioning comfortably and sometimes bicultural.</p>
<pre><code>Term table — Chapter 5
Hanzi           Pinyin          Meaning
文化身份        wénhuà shēnfèn  Cultural identity
刻板印象        kèbǎn yìnxiàng  Stereotype
偏见            piānjiàn        Prejudice
文化冲击        wénhuà chōngjī  Culture shock
蜜月期          mìyuèqī         Honeymoon phase
适应期          shìyìngqī       Adjustment phase
</code></pre>
<div class="callout"><span class="badge">Case</span> A Vietnamese student's first semester in Kunming was pure enthusiasm — new food, new friends, new city (honeymoon). Around week six she grew irritable at bureaucracy, food fatigue and daily language gaps (crisis). By month four she had built routines, a small friend group and workarounds for paperwork (adjustment) — a textbook U-curve. Knowing the pattern in advance kept her from reading the week-six dip as personal failure.</div>`,
    `<span class="eyebrow">CCI401 · Chương 5 · Bài 5.1</span>
<h2>Bản sắc, định kiến &amp; cú sốc văn hoá</h2>
<p class="lead"><strong>Bản sắc văn hoá (文化身份 wénhuà shēnfèn)</strong> là phần trong khái niệm bản thân của một người được rút ra từ việc tự nhận mình thuộc về một nhóm văn hoá. Nó định hình cách người đó giao tiếp và cách người khác diễn giải họ trước cả khi lời nào được thốt ra.</p>
<h3>Định kiến &amp; thiên kiến</h3>
<ul>
<li><strong>刻板印象 (kèbǎn yìnxiàng)</strong> — định kiến (stereotype): một niềm tin đơn giản hoá, khái quát hoá về một nhóm; ngay cả định kiến "tích cực" cũng làm phẳng sự khác biệt cá nhân.</li>
<li><strong>偏见 (piānjiàn)</strong> — thiên kiến (prejudice): một thái độ tiêu cực hình thành từ định kiến, thường có sẵn trước khi có bất kỳ tương tác thực nào với thành viên của nhóm đó.</li>
</ul>
<h3>Cú sốc văn hoá — mô hình chữ U</h3>
<p><strong>文化冲击 (wénhuà chōngjī)</strong> — cú sốc văn hoá — là sự mất phương hướng tâm lý khi mất đi các dấu hiệu văn hoá quen thuộc. Nó thường được mô hình hoá thành đường cong chữ U với khoảng bốn giai đoạn: <strong>蜜月期 (mìyuèqī)</strong> — giai đoạn mật ngọt, hào hứng và tò mò với mọi thứ mới; giai đoạn khủng hoảng với sự khó chịu, nhớ nhà và bực bội với những việc nhỏ; <strong>适应期 (shìyìngqī)</strong> — giai đoạn thích nghi, khi các chiến lược ứng phó hình thành và sự hài hước trở lại; và cuối cùng là hoà nhập/làm chủ, hoạt động thoải mái và đôi khi mang tính song văn hoá.</p>
<pre><code>Bảng thuật ngữ — Chương 5
Hán tự          Pinyin          Nghĩa
文化身份        wénhuà shēnfèn  Bản sắc văn hoá
刻板印象        kèbǎn yìnxiàng  Định kiến
偏见            piānjiàn        Thiên kiến
文化冲击        wénhuà chōngjī  Cú sốc văn hoá
蜜月期          mìyuèqī         Giai đoạn mật ngọt
适应期          shìyìngqī       Giai đoạn thích nghi
</code></pre>
<div class="callout"><span class="badge">Tình huống</span> Học kỳ đầu tiên của một sinh viên Việt Nam ở Côn Minh tràn đầy hào hứng — món ăn mới, bạn mới, thành phố mới (mật ngọt). Đến khoảng tuần thứ sáu, cô bắt đầu bực bội với thủ tục hành chính, chán món ăn lặp lại và những khoảng trống ngôn ngữ hằng ngày (khủng hoảng). Đến tháng thứ tư, cô đã xây dựng được thói quen, một nhóm bạn nhỏ và cách xử lý giấy tờ (thích nghi) — đúng mô hình chữ U kinh điển. Biết trước quy luật này giúp cô không coi đợt sa sút ở tuần sáu là thất bại cá nhân.</div>`,
  ]]);

const c5q = quiz('cci401-quiz-5', 'Quiz 5 — Identity, stereotype & culture shock|||Quiz 5 — Bản sắc, định kiến & cú sốc văn hoá', [
  { id: 'q1', question: '"刻板印象" (stereotype) có đặc điểm gì, kể cả khi mang vẻ "tích cực"?', options: ['Luôn hoàn toàn chính xác về mọi cá nhân trong nhóm', 'Đơn giản hoá, làm phẳng sự khác biệt cá nhân trong nhóm', 'Chỉ tồn tại ở dạng tiêu cực', 'Không ảnh hưởng đến giao tiếp'], correctIndex: 1, explanation: 'Định kiến là niềm tin khái quát hoá, kể cả "tích cực" vẫn xoá đi sự đa dạng cá nhân.' },
  { id: 'q2', question: 'Theo mô hình chữ U, giai đoạn nào diễn ra ngay sau "giai đoạn mật ngọt" (蜜月期)?', options: ['Giai đoạn thích nghi (适应期)', 'Giai đoạn khủng hoảng (khó chịu, nhớ nhà)', 'Giai đoạn hoà nhập hoàn toàn', 'Không có giai đoạn nào tiếp theo'], correctIndex: 1, explanation: 'Sau mật ngọt là khủng hoảng — sự hào hứng nhường chỗ cho khó chịu, mệt mỏi, nhớ nhà.' },
  { id: 'q3', question: 'Biết trước mô hình chữ U của cú sốc văn hoá giúp ích gì cho người đi du học/làm việc xa nhà?', options: ['Giúp tránh hoàn toàn giai đoạn khủng hoảng', 'Giúp không coi giai đoạn khó khăn là thất bại cá nhân, vì đó là quy luật thường gặp', 'Không có tác dụng gì', 'Giúp rút ngắn thời gian ở nước ngoài'], correctIndex: 1, explanation: 'Hiểu quy luật giúp người trong cuộc không hoảng loạn hay tự trách khi rơi vào giai đoạn khủng hoảng.' },
]);

const c6 = doc('cci401-6-1-barriers-misunderstanding', '6.1 — Communication barriers & intercultural misunderstanding|||6.1 — Rào cản giao tiếp & hiểu lầm liên văn hoá',
  'Giả định tương đồng, khái quát hoá quá mức, lo âu liên văn hoá, hiểu lầm dịch thuật — vì sao khác biệt văn hoá tự nó chưa phải rào cản.',
  [[
    `<span class="eyebrow">CCI401 · Chapter 6 · Lesson 6.1</span>
<h2>Communication barriers &amp; intercultural misunderstanding</h2>
<p class="lead">Cultural difference itself is neutral; it becomes a <strong>communication barrier (交际障碍 jiāojì zhàng'ài)</strong> only when unexamined assumptions collide with it. Several barriers recur across the intercultural-communication literature.</p>
<h3>Common barriers</h3>
<ul>
<li><strong>假定相似性 (jiǎdìng xiāngsìxìng)</strong> — assumed similarity: believing "people are basically the same everywhere" and projecting one's own norms onto the other side, which is often more damaging than assuming difference.</li>
<li><strong>以偏概全 (yǐ piān gài quán)</strong> — overgeneralization: "judging the whole from one slice" — extending one encounter or one stereotype to an entire group.</li>
<li><strong>焦虑 (jiāolǜ)</strong> — intercultural anxiety: nervousness about saying the wrong thing that leads to withdrawal, over-apologizing, or avoiding contact altogether.</li>
<li><strong>误解 (wùjiě)</strong> — misunderstanding from literal or word-for-word translation that misses idiom, tone or register.</li>
</ul>
<p><strong>文化差异 (wénhuà chāyì)</strong> — cultural difference — is the raw material; ethnocentrism (Chapter 1), stereotyping (Chapter 5) and these barriers are what turn it into actual friction.</p>
<pre><code>Term table — Chapter 6
Hanzi           Pinyin              Meaning
交际障碍        jiāojì zhàng'ài     Communication barrier
误解            wùjiě               Misunderstanding
假定相似性      jiǎdìng xiāngsìxìng Assumed similarity
文化差异        wénhuà chāyì        Cultural difference
焦虑            jiāolǜ              (Intercultural) anxiety
以偏概全        yǐ piān gài quán    Overgeneralization
</code></pre>
<div class="callout"><span class="badge">Case</span> An interpreter translated a Chinese partner's phrase "你的方案我们会认真考虑" (Nǐ de fāng'àn wǒmen huì rènzhēn kǎolǜ — "We will seriously consider your proposal") literally into English as an active commitment. The Vietnamese business team proceeded as though a deal were close, then felt misled weeks later when no follow-up came. In Chinese business register the phrase is a conventional soft-decline formula, not a promise — the misunderstanding came from literal translation, not from the words being wrong.</div>`,
    `<span class="eyebrow">CCI401 · Chương 6 · Bài 6.1</span>
<h2>Rào cản giao tiếp &amp; hiểu lầm liên văn hoá</h2>
<p class="lead">Bản thân khác biệt văn hoá là trung tính; nó chỉ trở thành <strong>rào cản giao tiếp (交际障碍 jiāojì zhàng'ài)</strong> khi những giả định chưa được xem xét va chạm với nó. Một số rào cản lặp lại xuyên suốt tài liệu về giao tiếp liên văn hoá.</p>
<h3>Các rào cản phổ biến</h3>
<ul>
<li><strong>假定相似性 (jiǎdìng xiāngsìxìng)</strong> — giả định tương đồng: tin rằng "ai cũng như nhau ở đâu cũng vậy" và áp chuẩn mực của mình lên phía đối phương — thường gây hại nhiều hơn cả việc giả định là có khác biệt.</li>
<li><strong>以偏概全 (yǐ piān gài quán)</strong> — khái quát hoá quá mức: "lấy một lát cắt để đánh giá cả tổng thể" — mở rộng một lần gặp gỡ hay một định kiến ra cả một nhóm người.</li>
<li><strong>焦虑 (jiāolǜ)</strong> — lo âu liên văn hoá: sự lo lắng nói sai điều gì đó, dẫn đến rút lui, xin lỗi quá mức, hoặc né tránh tiếp xúc hoàn toàn.</li>
<li><strong>误解 (wùjiě)</strong> — hiểu lầm do dịch sát nghĩa từng chữ, bỏ lỡ thành ngữ, giọng điệu hay văn phong.</li>
</ul>
<p><strong>文化差异 (wénhuà chāyì)</strong> — khác biệt văn hoá — là chất liệu thô; chủ nghĩa dân tộc-trung-tâm (Chương 1), định kiến (Chương 5) và các rào cản này mới là thứ biến nó thành xung đột thực sự.</p>
<pre><code>Bảng thuật ngữ — Chương 6
Hán tự          Pinyin              Nghĩa
交际障碍        jiāojì zhàng'ài     Rào cản giao tiếp
误解            wùjiě               Hiểu lầm
假定相似性      jiǎdìng xiāngsìxìng Giả định tương đồng
文化差异        wénhuà chāyì        Khác biệt văn hoá
焦虑            jiāolǜ              Lo âu (liên văn hoá)
以偏概全        yǐ piān gài quán    Khái quát hoá quá mức
</code></pre>
<div class="callout"><span class="badge">Tình huống</span> Một phiên dịch viên dịch sát nghĩa câu nói của đối tác Trung Quốc "你的方案我们会认真考虑" (Nǐ de fāng'àn wǒmen huì rènzhēn kǎolǜ — "Chúng tôi sẽ nghiêm túc xem xét phương án của bạn") sang tiếng Anh như một cam kết chủ động. Đội kinh doanh Việt Nam tiến hành như thể thương vụ sắp chốt, rồi cảm thấy bị hiểu lầm vài tuần sau khi không có phản hồi tiếp theo. Trong khẩu ngữ kinh doanh Trung Quốc, câu này là công thức từ chối nhẹ nhàng thông thường, không phải một lời hứa — hiểu lầm đến từ việc dịch sát nghĩa, không phải vì từ ngữ sai.</div>`,
  ]]);

const c6q = quiz('cci401-quiz-6', 'Quiz 6 — Communication barriers|||Quiz 6 — Rào cản giao tiếp', [
  { id: 'q1', question: '"假定相似性" (assumed similarity) là rào cản như thế nào?', options: ['Nghĩ rằng mọi nền văn hoá đều khác biệt hoàn toàn', 'Tin rằng "ai cũng như nhau" và áp chuẩn mực của mình lên người khác', 'Học kỹ văn hoá của đối phương trước khi giao tiếp', 'Không liên quan đến giao tiếp liên văn hoá'], correctIndex: 1, explanation: 'Giả định tương đồng khiến người ta bỏ qua khác biệt thật, áp chuẩn mực của mình lên đối phương.' },
  { id: 'q2', question: 'Theo bài học, khác biệt văn hoá (文化差异) tự nó có phải là rào cản không?', options: ['Có, luôn luôn là rào cản', 'Không, nó trung tính — chỉ thành rào cản khi gặp giả định chưa xem xét', 'Chỉ là rào cản trong kinh doanh, không phải trong giao tiếp thường ngày', 'Không tồn tại giữa các nền văn hoá châu Á'], correctIndex: 1, explanation: 'Khác biệt văn hoá là chất liệu trung tính; ethnocentrism, định kiến và các rào cản khác mới biến nó thành xung đột.' },
  { id: 'q3', question: 'Trong tình huống phiên dịch, nguyên nhân gốc của hiểu lầm là gì?', options: ['Đối tác Trung Quốc cố tình lừa dối', 'Dịch sát nghĩa một công thức từ chối nhẹ nhàng thành một cam kết', 'Đội Việt Nam không biết tiếng Trung', 'Không có nguyên nhân nào, đó là hiểu lầm ngẫu nhiên'], correctIndex: 1, explanation: 'Câu nói là công thức từ chối nhẹ nhàng quy ước, dịch sát nghĩa đã biến nó thành một lời hứa sai lệch.' },
]);

const c7 = doc('cci401-7-1-competence-adaptation', '7.1 — Intercultural communication competence & adaptation|||7.1 — Năng lực giao tiếp liên văn hoá & thích nghi',
  'Ba thành phần năng lực (kiến thức, thái độ, kỹ năng); sự tỉnh thức (mindfulness); bốn chiến lược hoà nhập văn hoá của Berry.',
  [[
    `<span class="eyebrow">CCI401 · Chapter 7 · Lesson 7.1</span>
<h2>Intercultural communication competence &amp; adaptation</h2>
<p class="lead"><strong>Intercultural communication competence (跨文化交际能力 kuà wénhuà jiāojì nénglì)</strong> is the ability to communicate effectively and appropriately across cultural differences. It is commonly modeled with three components: knowledge (of the other culture, and of one's own), attitude — openness, respect and <strong>empathy (移情 yíqíng)</strong> — and behavioral <strong>flexibility (灵活性 línghuóxìng)</strong>, adjusting one's style to the situation.</p>
<h3>Mindfulness</h3>
<p>Stella Ting-Toomey highlights <strong>mindfulness (正念 zhèngniàn)</strong> as a prerequisite skill: consciously noticing one's own assumptions and the other person's cues in the moment, instead of running on an automatic cultural "script" built for home-culture situations.</p>
<h3>Berry's acculturation strategies</h3>
<p><strong>文化适应 (wénhuà shìyìng)</strong> — cultural adaptation/acculturation — is commonly described with four strategies when encountering another culture: <strong>integration</strong> (keep one's own culture while actively engaging the other), assimilation (drop one's own culture for the other), separation (keep one's own, avoid the other), and marginalization (neither). Integration is generally linked to the best psychological and communicative outcomes.</p>
<p>The classical Chinese diplomatic principle <strong>求同存异 (qiú tóng cún yì)</strong> — "seek common ground while reserving differences" — offers a practical mindset for competence in practice: agreement on everything is not required; a workable common ground usually is enough.</p>
<pre><code>Term table — Chapter 7
Hanzi               Pinyin                  Meaning
跨文化交际能力      kuà wénhuà jiāojì nénglì  Intercultural communication competence
移情                yíqíng                  Empathy
文化适应            wénhuà shìyìng          Cultural adaptation
灵活性              línghuóxìng             Flexibility
正念                zhèngniàn               Mindfulness
求同存异            qiú tóng cún yì         Seek common ground, reserve differences
</code></pre>
<div class="callout"><span class="badge">Case</span> A Vietnamese manager posted to a Chinese subsidiary spent his first month mostly observing meeting norms before speaking up (mindfulness). He kept celebrating Vietnamese holidays with his own family while learning to give feedback in the indirect style his Chinese staff expected (integration, not assimilation or separation). Within a year, staff surveys rated him the most trusted foreign manager the branch had had.</div>`,
    `<span class="eyebrow">CCI401 · Chương 7 · Bài 7.1</span>
<h2>Năng lực giao tiếp liên văn hoá &amp; thích nghi</h2>
<p class="lead"><strong>Năng lực giao tiếp liên văn hoá (跨文化交际能力 kuà wénhuà jiāojì nénglì)</strong> là khả năng giao tiếp hiệu quả và phù hợp qua các khác biệt văn hoá. Nó thường được mô hình hoá với ba thành phần: kiến thức (về văn hoá đối phương, và về chính văn hoá mình), thái độ — cởi mở, tôn trọng và <strong>sự đồng cảm (移情 yíqíng)</strong> — và <strong>sự linh hoạt (灵活性 línghuóxìng)</strong> trong hành vi, điều chỉnh phong cách theo tình huống.</p>
<h3>Sự tỉnh thức (mindfulness)</h3>
<p>Stella Ting-Toomey nhấn mạnh <strong>正念 (zhèngniàn)</strong> — sự tỉnh thức — như một kỹ năng tiên quyết: có ý thức nhận biết giả định của chính mình và tín hiệu của đối phương ngay trong khoảnh khắc đó, thay vì chạy theo một "kịch bản" văn hoá tự động được xây cho tình huống ở quê nhà.</p>
<h3>Bốn chiến lược hoà nhập văn hoá của Berry</h3>
<p><strong>文化适应 (wénhuà shìyìng)</strong> — thích nghi/hoà nhập văn hoá — thường được mô tả với bốn chiến lược khi gặp một nền văn hoá khác: <strong>hoà nhập (integration)</strong> (giữ văn hoá của mình đồng thời chủ động tiếp xúc với văn hoá kia), đồng hoá (assimilation) (từ bỏ văn hoá mình để theo văn hoá kia), tách biệt (separation) (giữ văn hoá mình, né tránh văn hoá kia), và bên lề hoá (marginalization) (không theo cả hai). Hoà nhập (integration) thường gắn với kết quả tâm lý và giao tiếp tốt nhất.</p>
<p>Nguyên tắc ngoại giao cổ điển của Trung Quốc <strong>求同存异 (qiú tóng cún yì)</strong> — "tìm điểm chung, giữ lại khác biệt" — đưa ra một tư duy thực tế cho năng lực trong thực hành: không cần đồng thuận trên mọi mặt; thường chỉ cần một điểm chung khả thi là đủ.</p>
<pre><code>Bảng thuật ngữ — Chương 7
Hán tự              Pinyin                  Nghĩa
跨文化交际能力      kuà wénhuà jiāojì nénglì  Năng lực giao tiếp liên văn hoá
移情                yíqíng                  Sự đồng cảm
文化适应            wénhuà shìyìng          Thích nghi văn hoá
灵活性              línghuóxìng             Sự linh hoạt
正念                zhèngniàn               Sự tỉnh thức
求同存异            qiú tóng cún yì         Tìm điểm chung, giữ khác biệt
</code></pre>
<div class="callout"><span class="badge">Tình huống</span> Một quản lý người Việt được cử sang công ty con ở Trung Quốc dành tháng đầu tiên chủ yếu quan sát chuẩn mực họp hành trước khi lên tiếng (sự tỉnh thức). Anh vẫn giữ thói quen mừng các ngày lễ Việt Nam với gia đình mình, đồng thời học cách góp ý theo phong cách gián tiếp mà nhân viên Trung Quốc của anh kỳ vọng (hoà nhập, không phải đồng hoá hay tách biệt). Sau một năm, khảo sát nhân viên đánh giá anh là quản lý nước ngoài được tin tưởng nhất mà chi nhánh từng có.</div>`,
  ]]);

const c7q = quiz('cci401-quiz-7', 'Quiz 7 — Competence & adaptation|||Quiz 7 — Năng lực & thích nghi', [
  { id: 'q1', question: 'Ba thành phần của năng lực giao tiếp liên văn hoá thường được mô hình hoá gồm những gì?', options: ['Kiến thức, thái độ, kỹ năng', 'Ngữ pháp, từ vựng, phát âm', 'Tiền bạc, thời gian, quan hệ', 'Chỉ cần kiến thức là đủ'], correctIndex: 0, explanation: 'Mô hình phổ biến gồm kiến thức (về văn hoá đối phương & mình), thái độ (cởi mở, đồng cảm) và kỹ năng (linh hoạt hành vi).' },
  { id: 'q2', question: 'Theo bốn chiến lược hoà nhập văn hoá của Berry, chiến lược nào thường gắn với kết quả tốt nhất?', options: ['Đồng hoá — từ bỏ hoàn toàn văn hoá gốc', 'Tách biệt — chỉ giữ văn hoá gốc, né tránh văn hoá mới', 'Hoà nhập (integration) — giữ văn hoá gốc và chủ động tiếp xúc văn hoá mới', 'Bên lề hoá — không theo văn hoá nào'], correctIndex: 2, explanation: 'Integration (hoà nhập) — giữ bản sắc gốc đồng thời chủ động tham gia văn hoá mới — thường có kết quả tốt nhất.' },
  { id: 'q3', question: '"求同存异" (qiú tóng cún yì) mang tư duy thực hành nào cho năng lực liên văn hoá?', options: ['Phải đồng ý tuyệt đối trên mọi vấn đề', 'Tìm điểm chung khả thi, chấp nhận vẫn còn khác biệt', 'Tránh hoàn toàn giao tiếp với người khác văn hoá', 'Áp đặt quan điểm của mình lên đối phương'], correctIndex: 1, explanation: 'Nguyên tắc này khuyến khích tìm điểm chung đủ để hợp tác, thay vì đòi đồng thuận tuyệt đối.' },
]);

const c8 = doc('cci401-8-1-china-vietnam-cases', '8.1 — China-Vietnam communication situations & practical application|||8.1 — Tình huống giao tiếp Trung-Việt & ứng dụng thực tế',
  'Điểm chung Nho giáo Trung-Việt, bẫy "giả định tương đồng"; nguyên tắc nhập gia tuỳ tục, đổi chỗ suy nghĩ, hoà mà không đồng; ba tình huống thực tế.',
  [[
    `<span class="eyebrow">CCI401 · Chapter 8 · Lesson 8.1</span>
<h2>China-Vietnam communication situations &amp; practical application</h2>
<p class="lead">China and Vietnam share deep Confucian-heritage overlap — collectivism, power distance, high-context communication, face — which can create a false sense that "we already understand each other." That false sense is exactly the <strong>assumed similarity</strong> trap from Chapter 6: real differences still exist in the specifics — directness norms, gift customs, negotiation pacing, workplace hierarchy signals.</p>
<h3>Guiding principles</h3>
<ul>
<li><strong>民心相通 (mínxīn xiāngtōng)</strong> — "people's hearts connecting" — the standard term for China-Vietnam people-to-people exchange; a reminder to build genuine understanding rather than assume it from geographic or historical closeness.</li>
<li><strong>入乡随俗 (rùxiāng suísú)</strong> — "when in Rome": check the specific local custom rather than defaulting to a rule from home or from an earlier chapter.</li>
<li><strong>换位思考 (huànwèi sīkǎo)</strong> — "think from the other's seat": deliberately imagining the situation from the counterpart's position before reacting.</li>
<li><strong>和而不同 (hé ér bù tóng)</strong> — the Confucian ideal of harmony without uniformity: coexisting productively despite real differences, rather than requiring sameness.</li>
</ul>
<pre><code>Term table — Chapter 8
Hanzi           Pinyin              Meaning
民心相通        mínxīn xiāngtōng    People's hearts connecting
入乡随俗        rùxiāng suísú       When in Rome, do as the Romans do
换位思考        huànwèi sīkǎo       Think from the other's perspective
和而不同        hé ér bù tóng       Harmony without uniformity
跨文化敏感度    kuà wénhuà mǐngǎndù Intercultural sensitivity
文化差异        wénhuà chāyì        Cultural difference (recap, Ch.6)
</code></pre>
<h3>Three realistic situations</h3>
<ol>
<li><strong>Situation 1 — misreading patience:</strong> a Vietnamese SME negotiating with a Guangdong supplier read "慢慢来" (take it slow) as disinterest and lowered its opening offer too early — giving up leverage that was never actually needed.</li>
<li><strong>Situation 2 — seating at a joint-venture meeting:</strong> a China-Vietnam joint venture kickoff nearly stumbled when the Vietnamese side seated its most senior member far from the door, unaware of the Chinese seating convention — the host quietly adjusted it in time, avoiding embarrassment.</li>
<li><strong>Situation 3 — toasting customs:</strong> Chinese 干杯 (bottoms-up toasting) and Vietnam's relaxed "một, hai, ba, dzô!" style sound similar but differ in formality and pacing; a Vietnamese host who toasted in the more formal order familiar to Chinese guests was received noticeably better than one who treated the whole table casually.</li>
</ol>
<div class="callout"><span class="badge">The rule that always applies</span> <strong>入乡随俗</strong> — verify the specific custom in front of you instead of applying a rule from Chapters 1–7, or from home, on autopilot. Cultural guides describe common patterns, not guarantees; the safest move in an unfamiliar situation is to observe, ask tactfully, or follow the host's lead.</div>`,
    `<span class="eyebrow">CCI401 · Chương 8 · Bài 8.1</span>
<h2>Tình huống giao tiếp Trung-Việt &amp; ứng dụng thực tế</h2>
<p class="lead">Trung Quốc và Việt Nam có nhiều điểm chung sâu sắc từ di sản Nho giáo — chủ nghĩa tập thể, khoảng cách quyền lực, giao tiếp ngữ cảnh cao, thể diện — điều này có thể tạo cảm giác sai lầm rằng "chúng ta đã hiểu nhau rồi". Cảm giác sai lầm đó chính là bẫy <strong>giả định tương đồng</strong> ở Chương 6: khác biệt thật vẫn tồn tại trong chi tiết cụ thể — chuẩn mực về sự thẳng thắn, tục lệ tặng quà, nhịp độ đàm phán, tín hiệu cấp bậc nơi làm việc.</p>
<h3>Các nguyên tắc định hướng</h3>
<ul>
<li><strong>民心相通 (mínxīn xiāngtōng)</strong> — "lòng dân thông nhau" — thuật ngữ chuẩn cho giao lưu nhân dân Trung-Việt; một lời nhắc xây dựng sự hiểu biết thật sự thay vì mặc định có sẵn nhờ gần gũi địa lý hay lịch sử.</li>
<li><strong>入乡随俗 (rùxiāng suísú)</strong> — "nhập gia tuỳ tục": kiểm chứng phong tục địa phương cụ thể thay vì mặc định áp một quy tắc từ quê nhà hay từ chương trước.</li>
<li><strong>换位思考 (huànwèi sīkǎo)</strong> — "đổi chỗ mà suy nghĩ": chủ động hình dung tình huống từ vị trí của đối phương trước khi phản ứng.</li>
<li><strong>和而不同 (hé ér bù tóng)</strong> — lý tưởng Nho giáo về hoà hợp mà không đồng nhất: cùng tồn tại một cách hiệu quả dù có khác biệt thật, thay vì đòi hỏi giống nhau hoàn toàn.</li>
</ul>
<pre><code>Bảng thuật ngữ — Chương 8
Hán tự          Pinyin              Nghĩa
民心相通        mínxīn xiāngtōng    Lòng dân thông nhau
入乡随俗        rùxiāng suísú       Nhập gia tuỳ tục
换位思考        huànwèi sīkǎo       Đổi chỗ suy nghĩ (đặt mình vào vị trí người khác)
和而不同        hé ér bù tóng       Hoà hợp mà không đồng nhất
跨文化敏感度    kuà wénhuà mǐngǎndù Sự nhạy cảm liên văn hoá
文化差异        wénhuà chāyì        Khác biệt văn hoá (nhắc lại, Chương 6)
</code></pre>
<h3>Ba tình huống sát thực tế</h3>
<ol>
<li><strong>Tình huống 1 — hiểu sai sự kiên nhẫn:</strong> một doanh nghiệp vừa và nhỏ Việt Nam đàm phán với nhà cung cấp Quảng Đông hiểu "慢慢来" (từ từ) là thiếu quan tâm, nên hạ giá chào ban đầu quá sớm — mất đi lợi thế đàm phán mà lẽ ra không cần nhượng.</li>
<li><strong>Tình huống 2 — chỗ ngồi trong họp liên doanh:</strong> buổi khởi động một liên doanh Trung-Việt suýt trục trặc khi phía Việt Nam xếp người cấp cao nhất của mình ngồi xa cửa ra vào, không biết quy ước phía Trung Quốc — chủ nhà kịp thời chỉnh lại khéo léo, tránh được sự bẽ mặt.</li>
<li><strong>Tình huống 3 — tục chúc rượu:</strong> 干杯 kiểu Trung Quốc (cạn ly) và phong cách "một, hai, ba, dzô!" thoải mái của Việt Nam nghe có vẻ giống nhau nhưng khác về mức trang trọng và nhịp độ; một chủ tiệc Việt Nam chúc rượu theo đúng thứ tự trang trọng hơn mà khách Trung Quốc quen thuộc được đón nhận rõ rệt tốt hơn so với người xử sự thoải mái với cả bàn.</li>
</ol>
<div class="callout"><span class="badge">Nguyên tắc luôn đúng</span> <strong>入乡随俗</strong> — kiểm chứng phong tục cụ thể trước mắt thay vì áp thẳng một quy tắc từ Chương 1–7 hay từ quê nhà theo quán tính. Các khung lý thuyết mô tả khuôn mẫu phổ biến, không phải sự đảm bảo tuyệt đối; cách an toàn nhất trong tình huống lạ là quan sát, hỏi khéo, hoặc theo sự dẫn dắt của chủ nhà.</div>`,
  ]]);

const c8q = quiz('cci401-quiz-8', 'Quiz 8 — China-Vietnam cases|||Quiz 8 — Tình huống Trung-Việt', [
  { id: 'q1', question: 'Vì sao điểm chung văn hoá Trung-Việt (di sản Nho giáo) lại có thể trở thành một cái bẫy?', options: ['Vì hai nước không có điểm chung nào cả', 'Vì nó dễ dẫn đến "giả định tương đồng", bỏ qua khác biệt thật trong chi tiết', 'Vì Nho giáo chỉ tồn tại ở Trung Quốc', 'Vì nó khiến giao tiếp trở nên khó khăn hơn hẳn'], correctIndex: 1, explanation: 'Điểm chung có thể khiến người ta mặc định "đã hiểu nhau", rơi vào bẫy giả định tương đồng đã học ở Chương 6.' },
  { id: 'q2', question: '"入乡随俗" trong bài học này khuyên người học điều gì?', options: ['Luôn áp dụng đúng quy tắc đã học từ chương trước', 'Kiểm chứng phong tục cụ thể tại chỗ thay vì mặc định', 'Chỉ làm theo thói quen ở quê nhà mình', 'Bỏ qua mọi phong tục địa phương'], correctIndex: 1, explanation: 'Nguyên tắc "nhập gia tuỳ tục" nhấn mạnh việc kiểm chứng thực tế tại chỗ, không áp đặt máy móc.' },
  { id: 'q3', question: 'Trong tình huống chỗ ngồi họp liên doanh, vấn đề nảy sinh từ đâu?', options: ['Phía Việt Nam cố tình gây bất hoà', 'Không biết quy ước sắp xếp chỗ ngồi theo cấp bậc của phía Trung Quốc', 'Cuộc họp bị huỷ vào phút chót', 'Ngôn ngữ bất đồng hoàn toàn'], correctIndex: 1, explanation: 'Vấn đề đến từ việc thiếu hiểu biết cụ thể về quy ước chỗ ngồi — một khác biệt trong chi tiết dù hai nền văn hoá có nhiều điểm chung.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CCI401',
    slug: 'cci401-intercultural-communication-in-chinese-contexts',
    title: 'Intercultural Communication in Chinese Contexts',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CCI401.webp',
    shortDescription: 'Intercultural communication theory via Chinese contexts — culture, Hofstede\'s dimensions, high/low context (Hall), nonverbal & silence, identity & culture shock, barriers, competence, China-Vietnam cases. Chinese terms & pinyin.|||Lý thuyết giao tiếp liên văn hoá qua bối cảnh Trung Hoa — văn hoá, chiều văn hoá Hofstede, ngữ cảnh cao/thấp (Hall), phi ngôn ngữ & im lặng, bản sắc & cú sốc văn hoá, rào cản, năng lực, tình huống Trung-Việt. Thuật ngữ Hán & pinyin.',
    description: 'Môn <strong>CCI401 — Intercultural Communication in Chinese Contexts</strong> (kỳ 5, ngành Ngôn ngữ Trung) trang bị <strong>lý thuyết giao tiếp liên văn hoá</strong> minh hoạ qua bối cảnh Trung Hoa: <strong>văn hoá &amp; thế giới quan</strong> → <strong>chiều văn hoá Hofstede</strong> (tập thể, khoảng cách quyền lực) → <strong>ngữ cảnh cao/thấp (Hall)</strong> → <strong>phi ngôn ngữ &amp; im lặng</strong> → <strong>bản sắc, định kiến &amp; cú sốc văn hoá</strong> → <strong>rào cản &amp; hiểu lầm liên văn hoá</strong> → <strong>năng lực giao tiếp liên văn hoá &amp; thích nghi</strong> → <strong>tình huống Trung-Việt thực tế</strong>. Song ngữ Anh-Việt, mỗi chương kèm thuật ngữ tiếng Trung (chữ Hán + pinyin có dấu thanh) và quiz.',
    whatYouLearn: 'Khái niệm văn hoá, mô hình tảng băng, thế giới quan, dân tộc-trung-tâm & thuyết tương đối văn hoá; chiều văn hoá Hofstede (tập thể/cá nhân, khoảng cách quyền lực, định hướng dài hạn) áp dụng cho Trung Quốc; ngữ cảnh cao/thấp (Hall) & phong cách giao tiếp gián tiếp Trung Hoa; phi ngôn ngữ, im lặng, ánh mắt, không gian cá nhân; bản sắc văn hoá, định kiến, thiên kiến, mô hình chữ U cú sốc văn hoá; rào cản giao tiếp (giả định tương đồng, khái quát hoá quá mức, lo âu liên văn hoá); năng lực giao tiếp liên văn hoá (kiến thức-thái độ-kỹ năng), sự tỉnh thức, chiến lược hoà nhập của Berry; ứng dụng vào tình huống giao tiếp Trung-Việt thực tế.',
    requirements: 'Đã học tiếng Trung cơ bản (đọc được pinyin và một số Hán tự thông dụng). Không cần kiến thức nền về lý thuyết giao tiếp trước đó.',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Ba nguồn tham khảo chính + tài liệu miễn phí, hợp pháp.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Vì sao lý thuyết giao tiếp liên văn hoá quan trọng; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & khái niệm văn hoá|||Chapter 1 — Overview & the concept of culture', description: 'Mô hình tảng băng, thế giới quan, dân tộc-trung-tâm, thuyết tương đối văn hoá.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chiều văn hoá Hofstede áp dụng cho TQ|||Chapter 2 — Hofstede\'s dimensions applied to China', description: 'Tập thể vs cá nhân, khoảng cách quyền lực, định hướng dài hạn.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ngữ cảnh cao vs thấp (Hall)|||Chapter 3 — High- vs low-context (Hall)', description: 'Hàm ý ngoài lời, nói tránh, quan sát sắc mặt.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phi ngôn ngữ & im lặng|||Chapter 4 — Nonverbal communication & silence', description: 'Ánh mắt, không gian cá nhân, ý nghĩa của im lặng.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Bản sắc, định kiến & cú sốc văn hoá|||Chapter 5 — Identity, stereotypes & culture shock', description: 'Định kiến, thiên kiến, mô hình chữ U.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Rào cản & hiểu lầm liên văn hoá|||Chapter 6 — Communication barriers & misunderstanding', description: 'Giả định tương đồng, khái quát hoá quá mức, lo âu liên văn hoá.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Năng lực giao tiếp liên văn hoá & thích nghi|||Chapter 7 — Intercultural competence & adaptation', description: 'Kiến thức-thái độ-kỹ năng, sự tỉnh thức, chiến lược hoà nhập Berry.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Tình huống Trung-Việt & ứng dụng|||Chapter 8 — China-Vietnam cases & application', description: 'Bẫy giả định tương đồng, nhập gia tuỳ tục, ba tình huống thực tế.', lessons: [c8, c8q] },
  ],
};
