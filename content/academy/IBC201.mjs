/**
 * IBC201 — Cross Cultural Management and Negotiation (Quản trị đa văn hoá và đàm phán). Khối QTKD, kỳ 3.
 * Bám cấu trúc giáo trình chuẩn quốc tế: Deresky — International Management: Managing Across Borders
 * and Cultures (Pearson); Lewicki, Saunders & Barry — Negotiation (McGraw-Hill); tóm tắt ý 8 thang đo của
 * Erin Meyer — The Culture Map (không trích dài). Văn hoá & các tầng văn hoá, Hofstede, Trompenaars, Hall,
 * GLOBE, Meyer (trình bày ĐỊNH TÍNH, KHÔNG in điểm quốc gia), giao tiếp, cú sốc văn hoá, CQ, đội đa văn hoá
 * và đội ảo, lãnh đạo, nhân sự quốc tế (EPRG, expat), đạo đức; đàm phán phân phối/tích hợp, BATNA, ZOPA,
 * neo, nhiều vấn đề (bảng điểm, Pareto), đa bên, quốc tế (Salacuse), thiên kiến, đạo đức đàm phán.
 * Song ngữ + ví dụ (số đã kiểm bằng máy; tình huống HƯ CẤU, số liệu GIẢ ĐỊNH) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('ibc201-0-1-overview', 'Course overview: managing difference, negotiating agreement|||Tổng quan: quản trị khác biệt, đàm phán để đi tới thoả thuận',
  'Vì sao văn hoá quan trọng với nhà quản trị, hai bộ công cụ của môn (quản trị đa văn hoá và đàm phán), lộ trình 5 phần, cách dùng các khung văn hoá có trách nhiệm.',
  [[
    `<span class="eyebrow">IBC201 · Lesson 0.1 · Overview</span>
<h2>Cross Cultural Management and Negotiation</h2>
<p class="lead">Managers today work with colleagues, suppliers, customers and partners who grew up with different assumptions about hierarchy, time, trust and conflict. This course gives you two toolkits: one to <strong>understand and manage cultural difference</strong>, and one to <strong>negotiate</strong> — first between any two parties, then across borders.</p>
<h3>Why culture matters to managers</h3>
<p>Culture shapes how people communicate, what they expect from a boss, how they make decisions, how they build trust and how they bargain. A plan that works well at headquarters can fail abroad not because it is technically wrong but because it collides with local expectations. International management textbooks such as Deresky's describe the manager's task as developing <strong>cultural savvy</strong>: noticing differences, interpreting them without judging too quickly, and adapting practices where it matters — while keeping the core standards the organization will not give up.</p>
<h3>What you will be able to do</h3>
<table>
<tr><th>Part</th><th>Question</th><th>Key tools</th></tr>
<tr><td>1. Culture &amp; frameworks</td><td>What is culture and how can we compare cultures?</td><td>Schein's levels, Hofstede's onion and six dimensions, Trompenaars, Hall, GLOBE</td></tr>
<tr><td>2. Communication, adjustment &amp; teams</td><td>How do people communicate, adjust and work together across cultures?</td><td>Meyer's eight scales, culture shock curves, cultural intelligence (CQ), the MBI model, virtual-team practices</td></tr>
<tr><td>3. Leading, staffing &amp; ethics</td><td>How do we lead, staff and stay ethical abroad?</td><td>GLOBE leadership, EPRG, the expatriate cycle, relativism vs universalism, anti-bribery rules</td></tr>
<tr><td>4. Negotiation fundamentals</td><td>How do we claim value and avoid thinking traps?</td><td>BATNA, resistance point, ZOPA, anchoring, concessions, cognitive biases, negotiation ethics</td></tr>
<tr><td>5. Integrative, multiparty &amp; international negotiation</td><td>How do we create value with many issues, many parties and many cultures?</td><td>Interests, logrolling, scoring systems, Pareto efficiency, coalitions, Salacuse's ten factors</td></tr>
</table>
<h3>How to use cultural frameworks responsibly</h3>
<p>Every framework in this course describes <strong>tendencies of groups</strong>, not the behaviour of any single person. We therefore present the frameworks qualitatively and do not print country scores. Treat a framework as a first hypothesis to test in conversation, never as a verdict about an individual. All cases in the course are fictional and all numbers are illustrative; every calculation has been checked.</p>
<h3>How this course builds on earlier ones</h3>
<p>OBE102c introduced communication, conflict and the basic ideas of BATNA and ZOPA. IBC201 goes further: it adds the cultural layer, the planning tools of professional negotiators (resistance points, anchoring, scoring systems, Pareto efficiency) and the special features of multiparty and international deals.</p>
<div class="callout"><span class="badge">One idea to keep</span> Culture explains <em>why</em> a reasonable person might act differently from you. Negotiation gives you a method to reach agreement anyway. Together they turn difference from a source of friction into a source of value.</div>`,
    `<span class="eyebrow">IBC201 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị đa văn hoá và đàm phán</h2>
<p class="lead">Nhà quản trị ngày nay làm việc với đồng nghiệp, nhà cung cấp, khách hàng và đối tác lớn lên cùng những giả định khác nhau về thứ bậc, thời gian, niềm tin và xung đột. Môn học trao cho bạn hai bộ công cụ: một để <strong>hiểu và quản trị khác biệt văn hoá</strong>, một để <strong>đàm phán</strong> — trước hết giữa hai bên bất kỳ, rồi xuyên biên giới.</p>
<h3>Vì sao văn hoá quan trọng với nhà quản trị</h3>
<p>Văn hoá định hình cách con người giao tiếp, điều họ kỳ vọng ở cấp trên, cách họ ra quyết định, xây dựng niềm tin và mặc cả. Một kế hoạch chạy tốt ở trụ sở chính có thể thất bại ở nước ngoài không phải vì sai về kỹ thuật mà vì va chạm với kỳ vọng tại chỗ. Các giáo trình quản trị quốc tế như của Deresky mô tả nhiệm vụ của nhà quản trị là phát triển <strong>sự nhạy bén văn hoá</strong>: nhận ra khác biệt, diễn giải chúng mà không vội phán xét, và điều chỉnh cách làm ở những chỗ cần thiết — trong khi vẫn giữ những chuẩn mực cốt lõi mà tổ chức không từ bỏ.</p>
<h3>Bạn sẽ làm được gì</h3>
<table>
<tr><th>Phần</th><th>Câu hỏi</th><th>Công cụ chính</th></tr>
<tr><td>1. Văn hoá &amp; các khung phân tích</td><td>Văn hoá là gì và so sánh các nền văn hoá thế nào?</td><td>Ba cấp độ của Schein, mô hình củ hành và sáu chiều của Hofstede, Trompenaars, Hall, GLOBE</td></tr>
<tr><td>2. Giao tiếp, thích nghi &amp; làm việc nhóm</td><td>Con người giao tiếp, thích nghi và làm việc cùng nhau xuyên văn hoá ra sao?</td><td>Tám thang đo của Meyer, các đường cong cú sốc văn hoá, trí tuệ văn hoá (CQ), mô hình MBI, thực hành cho đội ảo</td></tr>
<tr><td>3. Lãnh đạo, nhân sự &amp; đạo đức</td><td>Lãnh đạo, bố trí nhân sự và giữ đạo đức ở nước ngoài thế nào?</td><td>Lãnh đạo theo GLOBE, EPRG, chu trình nhân viên biệt phái, tương đối luận và phổ quát luận, luật chống hối lộ</td></tr>
<tr><td>4. Nền tảng đàm phán</td><td>Giành giá trị và tránh bẫy tư duy thế nào?</td><td>BATNA, điểm kháng cự, ZOPA, neo giá, nhượng bộ, thiên kiến nhận thức, đạo đức đàm phán</td></tr>
<tr><td>5. Đàm phán tích hợp, đa bên &amp; quốc tế</td><td>Tạo giá trị khi có nhiều vấn đề, nhiều bên và nhiều nền văn hoá thế nào?</td><td>Lợi ích, trao đổi chéo (logrolling), bảng điểm, hiệu quả Pareto, liên minh, mười yếu tố của Salacuse</td></tr>
</table>
<h3>Dùng các khung văn hoá một cách có trách nhiệm</h3>
<p>Mọi khung trong môn học mô tả <strong>xu hướng của nhóm</strong>, không phải hành vi của một cá nhân cụ thể. Vì vậy các khung được trình bày định tính và không in điểm số quốc gia. Hãy coi một khung là giả thuyết ban đầu để kiểm chứng qua trao đổi, không bao giờ là phán quyết về một con người. Mọi tình huống trong môn là hư cấu, mọi con số là số liệu minh hoạ giả định; các phép tính đã được kiểm tra.</p>
<h3>Môn học nối tiếp các môn trước thế nào</h3>
<p>OBE102c đã giới thiệu giao tiếp, xung đột và ý tưởng cơ bản của BATNA, ZOPA. IBC201 đi xa hơn: thêm tầng văn hoá, các công cụ lập kế hoạch của nhà đàm phán chuyên nghiệp (điểm kháng cự, neo giá, bảng điểm, hiệu quả Pareto) và những đặc thù của thương vụ đa bên và quốc tế.</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> Văn hoá giải thích <em>vì sao</em> một người hợp lý có thể hành xử khác bạn. Đàm phán cho bạn phương pháp để vẫn đi tới thoả thuận. Kết hợp lại, chúng biến khác biệt từ nguồn va chạm thành nguồn giá trị.</div>`,
  ]]);

const c1 = doc('ibc201-1-1-what-is-culture', '1.1 — What culture is: levels, layers and impact on management|||1.1 — Văn hoá là gì: cấp độ, tầng lớp và tác động tới quản trị',
  'Định nghĩa và đặc điểm của văn hoá, ba cấp độ văn hoá của Schein, mô hình củ hành của Hofstede (thực hành và giá trị), các tầng văn hoá nhà quản trị gặp, cách văn hoá đi vào thực tiễn quản trị, tư tưởng cục bộ và vị chủng.',
  [[
    `<span class="eyebrow">IBC201 · Part 1 · Lesson 1.1</span>
<h2>What culture is: levels, layers and impact on management</h2>
<p class="lead">Culture is the shared set of values, beliefs, norms and assumptions that a group learns and passes on, and that shapes how its members see the world and behave. It is <strong>learned</strong> (not inherited), <strong>shared</strong> by a group, <strong>passed across generations</strong>, largely <strong>taken for granted</strong> and slow to change.</p>
<h3>Levels of culture: what you see and what lies beneath</h3>
<p>Edgar Schein, writing about organizational culture, distinguishes three levels. The same logic helps when you read a national or professional culture.</p>
<table>
<tr><th>Level (Schein)</th><th>What it is</th><th>Example at work</th></tr>
<tr><td>Artifacts</td><td>Visible structures and behaviour: dress, office layout, rituals, language — easy to see, hard to decode</td><td>Open-plan offices; job titles printed prominently on business cards</td></tr>
<tr><td>Espoused beliefs and values</td><td>Stated goals, philosophies and justifications</td><td>"We value open feedback" written in a code of conduct</td></tr>
<tr><td>Basic underlying assumptions</td><td>Unconscious, taken-for-granted beliefs about people, time, truth and relationships — the real source of behaviour</td><td>An unspoken assumption that a junior person should not contradict a senior one in public</td></tr>
</table>
<p>When espoused values and underlying assumptions differ, people follow the assumptions. A company can announce "open feedback", yet if the deep assumption is that questioning the boss is disloyal, meetings stay silent.</p>
<h3>Hofstede's onion</h3>
<p>Geert Hofstede pictures culture as an onion. The outer layers are <strong>practices</strong> that can be seen and learned fairly quickly: <strong>symbols</strong> (words, gestures, dress), <strong>heroes</strong> (people admired as models) and <strong>rituals</strong> (greetings, meetings, ceremonies). The core is <strong>values</strong> — broad preferences for some states of affairs over others, acquired early in life. Hofstede's research suggests that national cultures differ mainly in values, while organizational cultures differ mainly in practices. This is one reason a corporate culture can be taught to new hires from many countries, but national values cannot simply be "trained away".</p>
<h3>Layers of culture a manager meets</h3>
<ul>
<li><strong>National culture</strong> — shaped by history, language, religion and institutions.</li>
<li><strong>Subcultures</strong> — regional, ethnic, religious and generational groups within a country; variation inside a country can be as large as variation between countries.</li>
<li><strong>Organizational culture</strong> — the shared practices and assumptions of a company.</li>
<li><strong>Professional and functional culture</strong> — engineers, accountants or salespeople often share norms across borders.</li>
</ul>
<h3>How culture reaches management practice</h3>
<p>Culture influences management through <strong>work-related values</strong> and <strong>norms</strong>: attitudes to authority, time, change, risk, and the individual versus the group. These shape how people respond to planning, organizing, leading, motivating and controlling — for example, whether a detailed plan is seen as professional or rigid, or whether a manager who asks for opinions is seen as open or indecisive.</p>
<p>Two traps follow. <strong>Parochialism</strong> is assuming your way is the only way because you have not seen others. <strong>Ethnocentrism</strong> is assuming your way is the best way. The opposite skill — <strong>cultural sensitivity</strong> or cultural empathy — is the ability to see a situation as others see it without giving up your own judgement.</p>
<div class="callout"><span class="badge">Watch out</span> Most cross-cultural misunderstandings happen at the level you cannot see. Two teams can agree on the same written value ("respect") and still disagree about what respectful behaviour looks like.</div>`,
    `<span class="eyebrow">IBC201 · Phần 1 · Bài 1.1</span>
<h2>Văn hoá là gì: cấp độ, tầng lớp và tác động tới quản trị</h2>
<p class="lead">Văn hoá là tập hợp giá trị, niềm tin, chuẩn mực và giả định được một nhóm người học hỏi, truyền lại và chia sẻ, định hình cách các thành viên nhìn thế giới và hành xử. Văn hoá được <strong>học hỏi</strong> (không di truyền), được <strong>chia sẻ</strong> trong nhóm, được <strong>truyền qua các thế hệ</strong>, phần lớn được <strong>coi là đương nhiên</strong> và thay đổi chậm.</p>
<h3>Các cấp độ văn hoá: điều nhìn thấy và điều nằm bên dưới</h3>
<p>Edgar Schein, khi nghiên cứu văn hoá tổ chức, phân biệt ba cấp độ. Cùng logic đó giúp ta đọc văn hoá quốc gia hay văn hoá nghề nghiệp.</p>
<table>
<tr><th>Cấp độ (Schein)</th><th>Là gì</th><th>Ví dụ ở nơi làm việc</th></tr>
<tr><td>Các biểu hiện hữu hình (artifacts)</td><td>Cấu trúc và hành vi nhìn thấy được: trang phục, bố trí văn phòng, nghi thức, ngôn ngữ — dễ thấy nhưng khó giải mã</td><td>Văn phòng mở; chức danh in nổi bật trên danh thiếp</td></tr>
<tr><td>Niềm tin và giá trị được tuyên bố</td><td>Mục tiêu, triết lý và lời biện minh được nói ra</td><td>"Chúng tôi coi trọng góp ý thẳng thắn" ghi trong bộ quy tắc ứng xử</td></tr>
<tr><td>Các giả định nền tảng</td><td>Niềm tin vô thức, mặc nhiên về con người, thời gian, sự thật và các mối quan hệ — nguồn gốc thật của hành vi</td><td>Giả định ngầm rằng người cấp dưới không nên phản bác người cấp trên trước đám đông</td></tr>
</table>
<p>Khi giá trị được tuyên bố khác với giả định nền tảng, con người làm theo giả định. Một công ty có thể tuyên bố "góp ý thẳng thắn", nhưng nếu giả định sâu xa là chất vấn sếp là thiếu trung thành, các cuộc họp vẫn im lặng.</p>
<h3>Mô hình củ hành của Hofstede</h3>
<p>Geert Hofstede hình dung văn hoá như một củ hành. Các lớp ngoài là <strong>thực hành</strong> có thể nhìn thấy và học tương đối nhanh: <strong>biểu tượng</strong> (từ ngữ, cử chỉ, trang phục), <strong>người hùng</strong> (những người được ngưỡng mộ làm hình mẫu) và <strong>nghi thức</strong> (cách chào hỏi, họp hành, lễ nghi). Lõi là <strong>giá trị</strong> — những ưu tiên rộng cho trạng thái này hơn trạng thái khác, hình thành từ sớm trong đời. Nghiên cứu của Hofstede cho thấy văn hoá quốc gia khác nhau chủ yếu ở giá trị, còn văn hoá tổ chức khác nhau chủ yếu ở thực hành. Đó là một lý do văn hoá doanh nghiệp có thể dạy cho nhân viên mới đến từ nhiều nước, nhưng giá trị quốc gia thì không thể đơn giản "đào tạo cho hết".</p>
<h3>Các tầng văn hoá nhà quản trị gặp</h3>
<ul>
<li><strong>Văn hoá quốc gia</strong> — hình thành từ lịch sử, ngôn ngữ, tôn giáo và thể chế.</li>
<li><strong>Nhánh văn hoá</strong> — các nhóm vùng miền, dân tộc, tôn giáo, thế hệ trong một quốc gia; khác biệt bên trong một nước có thể lớn ngang khác biệt giữa các nước.</li>
<li><strong>Văn hoá tổ chức</strong> — các thực hành và giả định chung của một công ty.</li>
<li><strong>Văn hoá nghề nghiệp và chức năng</strong> — kỹ sư, kế toán hay nhân viên bán hàng thường chia sẻ chuẩn mực xuyên biên giới.</li>
</ul>
<h3>Văn hoá đi vào thực tiễn quản trị thế nào</h3>
<p>Văn hoá tác động tới quản trị qua <strong>các giá trị liên quan tới công việc</strong> và <strong>chuẩn mực</strong>: thái độ với quyền lực, thời gian, thay đổi, rủi ro, và cá nhân so với tập thể. Chúng định hình cách con người phản ứng với hoạch định, tổ chức, lãnh đạo, tạo động lực và kiểm soát — chẳng hạn một kế hoạch chi tiết bị coi là chuyên nghiệp hay cứng nhắc, một nhà quản lý hỏi ý kiến bị coi là cởi mở hay thiếu quyết đoán.</p>
<p>Từ đó có hai cái bẫy. <strong>Tư tưởng cục bộ</strong> (parochialism) là cho rằng cách của mình là cách duy nhất vì chưa từng thấy cách khác. <strong>Chủ nghĩa vị chủng</strong> (ethnocentrism) là cho rằng cách của mình là tốt nhất. Kỹ năng ngược lại — <strong>sự nhạy cảm văn hoá</strong> hay thấu cảm văn hoá — là khả năng nhìn tình huống như người khác nhìn mà không đánh mất phán đoán của chính mình.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Phần lớn hiểu lầm xuyên văn hoá xảy ra ở cấp độ không nhìn thấy. Hai nhóm có thể cùng đồng ý một giá trị viết ra giấy ("tôn trọng") mà vẫn bất đồng về việc hành vi tôn trọng trông như thế nào.</div>`,
  ]]);

const c2 = doc('ibc201-1-2-hofstede-trompenaars', '1.2 — Comparing cultures I: Hofstede and Trompenaars|||1.2 — So sánh văn hoá I: Hofstede và Trompenaars',
  'Nguồn gốc và sáu chiều văn hoá của Hofstede kèm hàm ý quản trị (định tính, không điểm quốc gia), bảy chiều của Trompenaars và Hampden-Turner, ví dụ phổ quát – đặc thù, cách hoà giải thế lưỡng nan, so sánh hai khung.',
  [[
    `<span class="eyebrow">IBC201 · Part 1 · Lesson 1.2</span>
<h2>Comparing cultures I: Hofstede and Trompenaars</h2>
<h3>Hofstede's six dimensions</h3>
<p>Hofstede's original four dimensions came from a large survey of the employees of one multinational (IBM) around the late 1960s and early 1970s. Long-term orientation was added later from research with Michael Bond, and indulgence versus restraint was added in 2010 from Michael Minkov's analysis of World Values Survey data. Each dimension is a continuum; countries receive <em>relative</em> positions, not absolute labels.</p>
<table>
<tr><th>Dimension</th><th>The question it answers</th><th>What it can mean at work (tendencies)</th></tr>
<tr><td>Power distance</td><td>How far do less powerful members accept that power is distributed unequally?</td><td>Higher: steeper hierarchies, bosses expected to decide, subordinates wait for instructions. Lower: flatter structures, bosses consult, subordinates expect to be asked.</td></tr>
<tr><td>Individualism vs collectivism</td><td>Do people see themselves mainly as "I" or as "we" — looking after themselves or loyal to an in-group?</td><td>Individualist: personal goals, task before relationship, direct appraisal. Collectivist: group harmony, relationship before task, loyalty to the in-group.</td></tr>
<tr><td>Masculinity vs femininity</td><td>Is the society driven by competition, achievement and success, or by caring for others and quality of life?</td><td>More "masculine": performance, assertiveness, distinct gender roles. More "feminine": consensus, work–life balance, modesty.</td></tr>
<tr><td>Uncertainty avoidance</td><td>How threatened do people feel by ambiguous or unknown situations?</td><td>Higher: rules, procedures, detailed contracts, expertise valued. Lower: tolerance of ambiguity, fewer rules, faster experimentation.</td></tr>
<tr><td>Long-term vs short-term orientation</td><td>Does the society focus on future rewards (persistence, thrift, adapting traditions) or on the past and present (tradition, quick results)?</td><td>Long-term: saving, investment, pragmatic adaptation. Short-term: quick results, respect for tradition, fulfilling social obligations.</td></tr>
<tr><td>Indulgence vs restraint</td><td>How freely are people allowed to satisfy desires related to enjoying life?</td><td>Indulgent: leisure, optimism and freedom of expression valued. Restrained: stricter social norms, less emphasis on leisure.</td></tr>
</table>
<h3>Trompenaars and Hampden-Turner: seven dimensions</h3>
<p>Fons Trompenaars and Charles Hampden-Turner surveyed managers using dilemmas ("what would you do if…?"). Five dimensions concern relationships with people, one concerns time and one the natural environment.</p>
<table>
<tr><th>Dimension</th><th>One pole</th><th>Other pole</th></tr>
<tr><td>Universalism vs particularism</td><td>Rules and contracts apply equally to everyone</td><td>Relationships and circumstances decide what is right</td></tr>
<tr><td>Individualism vs communitarianism</td><td>Individual freedom and achievement</td><td>The group's interests come first</td></tr>
<tr><td>Specific vs diffuse</td><td>Work and private life kept separate; get to the point</td><td>Life spheres overlap; business follows personal acquaintance</td></tr>
<tr><td>Neutral vs affective (emotional)</td><td>Emotions kept in check</td><td>Emotions expressed openly</td></tr>
<tr><td>Achievement vs ascription</td><td>Status earned by what you do</td><td>Status from who you are: age, family, position, education</td></tr>
<tr><td>Sequential vs synchronic time</td><td>One thing at a time; plans and deadlines</td><td>Several things in parallel; flexible plans</td></tr>
<tr><td>Internal vs external direction</td><td>We can control our environment</td><td>We should work with the environment and adapt to it</td></tr>
</table>
<p>A typical illustration of universalism versus particularism is a friend who asks for a favour that breaks a company rule. Universalist respondents tend to apply the rule; particularist respondents tend to protect the relationship. Neither side is "less ethical" — they rank two good principles differently. Trompenaars and Hampden-Turner stress <strong>reconciling</strong> such dilemmas rather than choosing one pole: for instance, a clear contract (universalist) plus regular relationship meetings that allow adjustment (particularist).</p>
<h3>How the two frameworks differ</h3>
<p>Hofstede's dimensions are mainly about <strong>values</strong> measured with survey items; Trompenaars' are framed as <strong>dilemmas</strong> managers must resolve. They overlap — both have an individualism dimension — but emphasize different things: Trompenaars adds rules versus relationships, how emotion is displayed, the source of status, and the relationship with nature.</p>
<div class="callout"><span class="badge">In practice</span> Use the dimensions to ask better questions before you act: Who is expected to decide here? How detailed should the contract be? Should we build the relationship before talking business? Then check the answers with local colleagues.</div>`,
    `<span class="eyebrow">IBC201 · Phần 1 · Bài 1.2</span>
<h2>So sánh văn hoá I: Hofstede và Trompenaars</h2>
<h3>Sáu chiều văn hoá của Hofstede</h3>
<p>Bốn chiều đầu tiên của Hofstede đến từ một cuộc khảo sát lớn nhân viên của một công ty đa quốc gia (IBM) vào khoảng cuối thập niên 1960 – đầu thập niên 1970. Chiều định hướng dài hạn được bổ sung sau đó từ nghiên cứu cùng Michael Bond, và chiều tự thoả mãn – kiềm chế được bổ sung năm 2010 từ phân tích của Michael Minkov trên dữ liệu Khảo sát Giá trị Thế giới (World Values Survey). Mỗi chiều là một thang liên tục; các quốc gia có vị trí <em>tương đối</em>, không phải nhãn tuyệt đối.</p>
<table>
<tr><th>Chiều</th><th>Câu hỏi mà chiều đó trả lời</th><th>Ý nghĩa có thể có ở nơi làm việc (xu hướng)</th></tr>
<tr><td>Khoảng cách quyền lực</td><td>Những thành viên ít quyền lực chấp nhận việc quyền lực phân bố không đều tới mức nào?</td><td>Cao hơn: thứ bậc nhiều tầng, sếp được kỳ vọng ra quyết định, cấp dưới chờ chỉ thị. Thấp hơn: cấu trúc phẳng, sếp tham khảo ý kiến, cấp dưới mong được hỏi.</td></tr>
<tr><td>Chủ nghĩa cá nhân – chủ nghĩa tập thể</td><td>Con người coi mình chủ yếu là "tôi" hay "chúng ta" — tự lo cho bản thân hay trung thành với nhóm của mình?</td><td>Cá nhân: mục tiêu riêng, công việc trước quan hệ, đánh giá trực tiếp. Tập thể: hài hoà nhóm, quan hệ trước công việc, trung thành với nhóm.</td></tr>
<tr><td>Nam tính – nữ tính</td><td>Xã hội được thúc đẩy bởi cạnh tranh, thành tích và thành công, hay bởi sự quan tâm tới người khác và chất lượng cuộc sống?</td><td>"Nam tính" hơn: đề cao kết quả, quyết đoán, vai trò giới phân biệt rõ. "Nữ tính" hơn: đồng thuận, cân bằng công việc – cuộc sống, khiêm tốn.</td></tr>
<tr><td>Né tránh bất định</td><td>Con người cảm thấy bị đe doạ tới mức nào trước tình huống mơ hồ hoặc chưa biết?</td><td>Cao hơn: quy tắc, quy trình, hợp đồng chi tiết, đề cao chuyên môn. Thấp hơn: chấp nhận mơ hồ, ít quy tắc, thử nghiệm nhanh hơn.</td></tr>
<tr><td>Định hướng dài hạn – ngắn hạn</td><td>Xã hội tập trung vào phần thưởng tương lai (bền bỉ, tiết kiệm, điều chỉnh truyền thống) hay vào quá khứ và hiện tại (truyền thống, kết quả nhanh)?</td><td>Dài hạn: tiết kiệm, đầu tư, thích nghi thực dụng. Ngắn hạn: kết quả nhanh, tôn trọng truyền thống, làm tròn nghĩa vụ xã hội.</td></tr>
<tr><td>Tự thoả mãn – kiềm chế</td><td>Con người được tự do thoả mãn các mong muốn liên quan tới tận hưởng cuộc sống tới mức nào?</td><td>Tự thoả mãn: đề cao giải trí, lạc quan, tự do bày tỏ. Kiềm chế: chuẩn mực xã hội chặt hơn, ít chú trọng giải trí.</td></tr>
</table>
<h3>Trompenaars và Hampden-Turner: bảy chiều</h3>
<p>Fons Trompenaars và Charles Hampden-Turner khảo sát các nhà quản lý bằng những tình huống lưỡng nan ("bạn sẽ làm gì nếu…?"). Năm chiều liên quan tới quan hệ giữa người với người, một chiều về thời gian và một chiều về môi trường tự nhiên.</p>
<table>
<tr><th>Chiều</th><th>Một cực</th><th>Cực kia</th></tr>
<tr><td>Phổ quát – đặc thù</td><td>Quy tắc và hợp đồng áp dụng như nhau cho mọi người</td><td>Quan hệ và hoàn cảnh quyết định điều gì là đúng</td></tr>
<tr><td>Cá nhân – cộng đồng</td><td>Tự do và thành tích cá nhân</td><td>Lợi ích của nhóm đặt lên trước</td></tr>
<tr><td>Cụ thể – lan toả</td><td>Công việc và đời tư tách bạch; đi thẳng vào vấn đề</td><td>Các lĩnh vực đời sống đan xen; làm ăn đi sau quen biết cá nhân</td></tr>
<tr><td>Trung tính – cảm xúc</td><td>Cảm xúc được kiềm giữ</td><td>Cảm xúc được bộc lộ công khai</td></tr>
<tr><td>Thành tựu – quy gán</td><td>Địa vị có được nhờ việc mình làm</td><td>Địa vị đến từ mình là ai: tuổi tác, gia đình, chức vụ, học vấn</td></tr>
<tr><td>Thời gian tuần tự – đồng thời</td><td>Làm từng việc một; kế hoạch và hạn chót</td><td>Nhiều việc song song; kế hoạch linh hoạt</td></tr>
<tr><td>Định hướng bên trong – bên ngoài</td><td>Chúng ta kiểm soát được môi trường</td><td>Chúng ta nên hoà hợp và thích nghi với môi trường</td></tr>
</table>
<p>Một minh hoạ điển hình cho chiều phổ quát – đặc thù là người bạn nhờ một việc trái quy định công ty. Người có xu hướng phổ quát thường áp dụng quy định; người có xu hướng đặc thù thường bảo vệ mối quan hệ. Không bên nào "kém đạo đức hơn" — họ xếp hạng hai nguyên tắc tốt theo thứ tự khác nhau. Trompenaars và Hampden-Turner nhấn mạnh việc <strong>hoà giải</strong> các thế lưỡng nan thay vì chọn một cực: ví dụ một hợp đồng rõ ràng (phổ quát) cộng với các buổi gặp gỡ định kỳ để vun đắp quan hệ và cho phép điều chỉnh (đặc thù).</p>
<h3>Hai khung khác nhau ở đâu</h3>
<p>Các chiều của Hofstede chủ yếu nói về <strong>giá trị</strong> đo bằng câu hỏi khảo sát; các chiều của Trompenaars được đặt thành <strong>thế lưỡng nan</strong> mà nhà quản lý phải giải quyết. Hai khung giao nhau — cả hai đều có chiều cá nhân – tập thể — nhưng nhấn vào những điều khác nhau: Trompenaars bổ sung quy tắc so với quan hệ, cách bộc lộ cảm xúc, nguồn gốc địa vị và quan hệ với tự nhiên.</p>
<div class="callout"><span class="badge">Vận dụng</span> Dùng các chiều để đặt câu hỏi tốt hơn trước khi hành động: Ở đây ai được kỳ vọng ra quyết định? Hợp đồng nên chi tiết tới đâu? Có nên xây quan hệ trước khi bàn công việc? Rồi kiểm chứng câu trả lời với đồng nghiệp tại chỗ.</div>`,
  ]]);

const c3 = doc('ibc201-1-3-hall-globe-limits', '1.3 — Comparing cultures II: Hall, GLOBE and the limits of frameworks|||1.3 — So sánh văn hoá II: Hall, GLOBE và giới hạn của các khung',
  'Ngữ cảnh cao/thấp, thời gian đơn tuyến/đa tuyến và không gian theo Edward T. Hall; dự án GLOBE với chín chiều, thực hành và giá trị, mười cụm xã hội; giới hạn của các khung văn hoá: khuôn mẫu, sai lầm sinh thái, quốc gia không đồng nhất, thay đổi theo thời gian, phê bình phương pháp.',
  [[
    `<span class="eyebrow">IBC201 · Part 1 · Lesson 1.3</span>
<h2>Comparing cultures II: Hall, GLOBE and the limits of frameworks</h2>
<h3>Edward T. Hall: context, time and space</h3>
<p>The anthropologist Edward T. Hall offered three ideas that remain central to intercultural communication.</p>
<table>
<tr><th>Idea</th><th>One end</th><th>Other end</th></tr>
<tr><td>Context</td><td><strong>Low-context</strong>: meaning is carried mainly by explicit words; say what you mean, put it in writing, contracts are detailed</td><td><strong>High-context</strong>: much meaning lies in the relationship, the setting, tone and what is left unsaid; listeners are expected to read between the lines</td></tr>
<tr><td>Time</td><td><strong>Monochronic</strong>: one thing at a time, schedules and punctuality are firm, interruptions are unwelcome</td><td><strong>Polychronic</strong>: several things at once, schedules flex around people and relationships</td></tr>
<tr><td>Space (proxemics)</td><td>Larger comfortable distance, private offices</td><td>Closer distance, shared spaces</td></tr>
</table>
<p>In a low-context email, "Please send the report by Friday" means exactly that. In a high-context exchange, a colleague's "that may be difficult" may be a polite but clear "no". Neither style is better: each is efficient among people who share it and confusing for people who do not.</p>
<h3>The GLOBE project</h3>
<p>GLOBE (Global Leadership and Organizational Behavior Effectiveness), led by Robert House, surveyed thousands of middle managers in 62 societies. It measured nine cultural dimensions in two ways: <strong>practices</strong> ("as is" — how things are done) and <strong>values</strong> ("should be" — how people think things ought to be done). The gap between the two is itself informative: a society may practise high power distance while its managers say they would like less.</p>
<table>
<tr><th>GLOBE dimension</th><th>Short meaning</th></tr>
<tr><td>Performance orientation</td><td>Encouraging and rewarding improvement and excellence</td></tr>
<tr><td>Assertiveness</td><td>How confrontational and assertive people are in relationships</td></tr>
<tr><td>Future orientation</td><td>Planning, investing, delaying gratification</td></tr>
<tr><td>Humane orientation</td><td>Rewarding fairness, generosity and care for others</td></tr>
<tr><td>Institutional collectivism</td><td>Institutions encourage collective distribution of resources and collective action</td></tr>
<tr><td>In-group collectivism</td><td>Pride, loyalty and cohesion in families and organizations</td></tr>
<tr><td>Gender egalitarianism</td><td>Minimizing differences in gender roles</td></tr>
<tr><td>Power distance</td><td>Accepting that power is shared unequally</td></tr>
<tr><td>Uncertainty avoidance</td><td>Relying on norms, rules and procedures to reduce unpredictability</td></tr>
</table>
<p>GLOBE grouped societies into ten clusters (for example Anglo, Confucian Asia, Southern Asia, Latin America, Nordic Europe and Germanic Europe) and linked culture to leadership expectations — the subject of Lesson 3.1.</p>
<h3>The limits of cultural frameworks</h3>
<ul>
<li><strong>Stereotyping.</strong> A dimension describes a group average; individuals spread widely around it and overlap with people from other countries. Joyce Osland and Allan Bird warn that relying on dimensions alone produces "sophisticated stereotyping": a useful first step that sounds scientific, yet still misses the context and the person in front of you.</li>
<li><strong>Ecological fallacy.</strong> Relationships found between country averages cannot be assumed to hold for individuals. A country that is collectivist on average still contains many individualists.</li>
<li><strong>Nation is not the same as culture.</strong> Many countries hold very different regions, ethnic groups and generations, and many cultures cross borders.</li>
<li><strong>Change over time.</strong> Economic development, education and digital media shift values, especially among younger professionals.</li>
<li><strong>Method.</strong> Critics (for example Brendan McSweeney, writing on Hofstede) question the samples, the survey items and whether a few dimensions can capture a culture.</li>
<li><strong>Context beats averages.</strong> Behaviour depends on the situation, the organization, the role and the relationship.</li>
</ul>
<div class="callout"><span class="badge">A responsible habit</span> Use frameworks as a map, not as the territory: form a hypothesis ("this partner may prefer to build the relationship first"), observe, ask, and update. Describe cultures as tendencies — "tends to", "often" — never "all" or "always".</div>`,
    `<span class="eyebrow">IBC201 · Phần 1 · Bài 1.3</span>
<h2>So sánh văn hoá II: Hall, GLOBE và giới hạn của các khung</h2>
<h3>Edward T. Hall: ngữ cảnh, thời gian và không gian</h3>
<p>Nhà nhân học Edward T. Hall đưa ra ba ý tưởng đến nay vẫn là trung tâm của giao tiếp liên văn hoá.</p>
<table>
<tr><th>Ý tưởng</th><th>Một đầu</th><th>Đầu kia</th></tr>
<tr><td>Ngữ cảnh</td><td><strong>Ngữ cảnh thấp</strong>: ý nghĩa nằm chủ yếu ở lời nói tường minh; nghĩ gì nói nấy, ghi thành văn bản, hợp đồng chi tiết</td><td><strong>Ngữ cảnh cao</strong>: nhiều ý nghĩa nằm trong mối quan hệ, bối cảnh, giọng điệu và những điều không nói ra; người nghe được kỳ vọng hiểu ý ngầm</td></tr>
<tr><td>Thời gian</td><td><strong>Đơn tuyến</strong> (monochronic): làm từng việc một, lịch trình và đúng giờ là cố định, không thích bị ngắt quãng</td><td><strong>Đa tuyến</strong> (polychronic): nhiều việc cùng lúc, lịch trình co giãn theo con người và quan hệ</td></tr>
<tr><td>Không gian (proxemics)</td><td>Khoảng cách dễ chịu lớn hơn, văn phòng riêng</td><td>Khoảng cách gần hơn, không gian dùng chung</td></tr>
</table>
<p>Trong một email ngữ cảnh thấp, "Vui lòng gửi báo cáo trước thứ Sáu" có nghĩa đúng như vậy. Trong một trao đổi ngữ cảnh cao, câu "việc đó có thể hơi khó" của đồng nghiệp có thể là một lời "không" lịch sự nhưng rõ ràng. Không phong cách nào tốt hơn: mỗi phong cách hiệu quả giữa những người cùng chia sẻ nó và gây bối rối cho người không chia sẻ.</p>
<h3>Dự án GLOBE</h3>
<p>GLOBE (Global Leadership and Organizational Behavior Effectiveness — Hiệu quả lãnh đạo và hành vi tổ chức toàn cầu), do Robert House dẫn dắt, khảo sát hàng nghìn nhà quản lý cấp trung ở 62 xã hội. Dự án đo chín chiều văn hoá theo hai cách: <strong>thực hành</strong> ("như hiện tại" — mọi việc đang được làm thế nào) và <strong>giá trị</strong> ("nên là" — con người nghĩ mọi việc nên được làm thế nào). Khoảng cách giữa hai cách đo tự nó đã mang thông tin: một xã hội có thể đang thực hành khoảng cách quyền lực cao trong khi các nhà quản lý nói họ muốn nó thấp hơn.</p>
<table>
<tr><th>Chiều của GLOBE</th><th>Nghĩa ngắn gọn</th></tr>
<tr><td>Định hướng thành tích</td><td>Khuyến khích và khen thưởng sự tiến bộ và xuất sắc</td></tr>
<tr><td>Tính quyết đoán</td><td>Mức độ đối đầu và quyết liệt của con người trong các mối quan hệ</td></tr>
<tr><td>Định hướng tương lai</td><td>Lập kế hoạch, đầu tư, trì hoãn sự thoả mãn</td></tr>
<tr><td>Định hướng nhân văn</td><td>Khen thưởng sự công bằng, hào phóng và quan tâm tới người khác</td></tr>
<tr><td>Tập thể thể chế</td><td>Thể chế khuyến khích phân phối nguồn lực và hành động theo tập thể</td></tr>
<tr><td>Tập thể nội nhóm</td><td>Niềm tự hào, lòng trung thành và sự gắn kết trong gia đình và tổ chức</td></tr>
<tr><td>Bình đẳng giới</td><td>Giảm thiểu khác biệt về vai trò giới</td></tr>
<tr><td>Khoảng cách quyền lực</td><td>Chấp nhận việc quyền lực được chia không đều</td></tr>
<tr><td>Né tránh bất định</td><td>Dựa vào chuẩn mực, quy tắc và quy trình để giảm sự khó lường</td></tr>
</table>
<p>GLOBE xếp các xã hội thành mười cụm (ví dụ cụm Anglo, Á Đông Nho giáo, Nam Á, Mỹ Latinh, Bắc Âu và Âu German) và gắn văn hoá với kỳ vọng về lãnh đạo — chủ đề của Bài 3.1.</p>
<h3>Giới hạn của các khung văn hoá</h3>
<ul>
<li><strong>Khuôn mẫu hoá.</strong> Một chiều văn hoá mô tả giá trị trung bình của nhóm; các cá nhân phân tán rộng quanh đó và chồng lấn với người đến từ nước khác. Joyce Osland và Allan Bird cảnh báo rằng chỉ dựa vào các chiều văn hoá sẽ dẫn tới "khuôn mẫu hoá tinh vi": một bước khởi đầu hữu ích, nghe có vẻ khoa học, nhưng vẫn bỏ sót bối cảnh và con người đang đứng trước mặt bạn.</li>
<li><strong>Sai lầm sinh thái.</strong> Quan hệ tìm thấy giữa các giá trị trung bình quốc gia không thể mặc nhiên đúng với từng cá nhân. Một nước có xu hướng tập thể tính trung bình vẫn có nhiều người theo chủ nghĩa cá nhân.</li>
<li><strong>Quốc gia không đồng nghĩa với văn hoá.</strong> Nhiều nước có các vùng miền, dân tộc và thế hệ rất khác nhau, và nhiều nền văn hoá vượt qua biên giới.</li>
<li><strong>Thay đổi theo thời gian.</strong> Phát triển kinh tế, giáo dục và truyền thông số làm dịch chuyển giá trị, nhất là ở giới chuyên môn trẻ.</li>
<li><strong>Phương pháp.</strong> Các nhà phê bình (ví dụ Brendan McSweeney khi viết về Hofstede) đặt câu hỏi về mẫu khảo sát, các câu hỏi đo lường và việc liệu vài chiều có đủ nắm bắt một nền văn hoá.</li>
<li><strong>Bối cảnh mạnh hơn số trung bình.</strong> Hành vi phụ thuộc vào tình huống, tổ chức, vai trò và mối quan hệ.</li>
</ul>
<div class="callout"><span class="badge">Thói quen có trách nhiệm</span> Dùng các khung như tấm bản đồ, không phải chính vùng đất: đặt giả thuyết ("đối tác này có thể muốn xây quan hệ trước"), quan sát, hỏi và cập nhật. Mô tả văn hoá bằng xu hướng — "có xu hướng", "thường" — không bao giờ "tất cả" hay "luôn luôn".</div>`,
  ]]);

const c3q = quiz('ibc201-quiz-1', 'Quiz 1 — Culture and cultural frameworks|||Quiz 1 — Văn hoá và các khung văn hoá', [
  { id: 'q1', question: 'In Schein’s model, which level of culture is the deepest and the real source of behaviour?|||Trong mô hình của Schein, cấp độ văn hoá nào sâu nhất và là nguồn gốc thật của hành vi?', options: ['Artifacts such as dress and office layout|||Biểu hiện hữu hình như trang phục và bố trí văn phòng', 'Espoused beliefs and values|||Niềm tin và giá trị được tuyên bố', 'Basic underlying assumptions|||Các giả định nền tảng', 'Rituals and ceremonies|||Nghi thức và lễ nghi'], correctIndex: 2, explanation: 'Underlying assumptions are unconscious and taken for granted; when they conflict with stated values, people follow the assumptions.|||Giả định nền tảng là vô thức và mặc nhiên; khi chúng mâu thuẫn với giá trị được tuyên bố, con người làm theo giả định.' },
  { id: 'q2', question: 'A manager reads that a country is collectivist on average and concludes that a new colleague from that country must dislike individual bonuses. This mistake is called…|||Một nhà quản lý đọc thấy một nước có xu hướng tập thể tính trung bình và kết luận rằng đồng nghiệp mới từ nước đó chắc chắn không thích thưởng cá nhân. Sai lầm này gọi là…', options: ['the ecological fallacy|||sai lầm sinh thái', 'the endowment effect|||hiệu ứng sở hữu', 'reactive devaluation|||hạ giá trị phản ứng', 'the winner’s curse|||lời nguyền người thắng'], correctIndex: 0, explanation: 'Country-level averages cannot be assumed to describe any single individual; frameworks give hypotheses, not verdicts.|||Giá trị trung bình cấp quốc gia không thể mặc nhiên mô tả một cá nhân cụ thể; các khung chỉ cho giả thuyết, không cho phán quyết.' },
  { id: 'q3', question: 'Which dimension belongs to Trompenaars and Hampden-Turner rather than to Hofstede?|||Chiều nào thuộc khung của Trompenaars và Hampden-Turner chứ không thuộc Hofstede?', options: ['Power distance|||Khoảng cách quyền lực', 'Uncertainty avoidance|||Né tránh bất định', 'Indulgence vs restraint|||Tự thoả mãn – kiềm chế', 'Universalism vs particularism|||Phổ quát – đặc thù'], correctIndex: 3, explanation: 'Universalism vs particularism (rules vs relationships) is one of Trompenaars’ seven dimensions; the other three options are Hofstede dimensions.|||Phổ quát – đặc thù (quy tắc hay quan hệ) là một trong bảy chiều của Trompenaars; ba phương án còn lại là các chiều của Hofstede.' },
]);

const c4 = doc('ibc201-2-1-communication-meyer', '2.1 — Communicating across cultures and Meyer’s eight scales|||2.1 — Giao tiếp liên văn hoá và tám thang đo của Meyer',
  'Mô hình giao tiếp và nhiễu văn hoá, những chỗ thông điệp bị lạc (ngôn ngữ, phi ngôn ngữ, quy kết, khuôn mẫu, kênh), tóm tắt tám thang đo trong The Culture Map của Erin Meyer và nguyên lý tương đối văn hoá, ghi chú có rào về nơi làm việc Việt Nam, quy tắc thực hành.',
  [[
    `<span class="eyebrow">IBC201 · Part 2 · Lesson 2.1</span>
<h2>Communicating across cultures and Meyer's eight scales</h2>
<h3>Communication with cultural noise</h3>
<p>In the basic model, a sender encodes a message and sends it through a channel; a receiver decodes it and gives feedback. Across cultures, <strong>cultural noise</strong> — differences in values, language, context, non-verbal cues and expectations — distorts both encoding and decoding. The receiver then attributes a meaning, usually through their own cultural lens: silence can be read as agreement, disagreement, respect or confusion.</p>
<h3>Where messages get lost</h3>
<ul>
<li><strong>Language</strong> — second-language speakers may understand more than they can say, or may say "yes" to avoid asking for a repetition; idioms and jokes rarely travel.</li>
<li><strong>Non-verbal communication</strong> — <em>kinesics</em> (gestures, eye contact, facial expressions), <em>proxemics</em> (personal space), <em>paralanguage</em> (tone, pace, silence), <em>chronemics</em> (use of time) and <em>object language</em> (dress, offices, gifts).</li>
<li><strong>Attribution</strong> — explaining others' behaviour by their character ("he is rude") when it simply follows a different norm ("he is direct").</li>
<li><strong>Stereotypes and selective perception</strong> — noticing only what confirms our expectations.</li>
<li><strong>Media</strong> — email and chat strip away tone and context, which hurts high-context communicators most.</li>
</ul>
<h3>Erin Meyer's eight scales (summary)</h3>
<p>In <em>The Culture Map</em>, Erin Meyer places cultures on eight scales describing everyday business behaviour. Her key point is <strong>cultural relativity</strong>: what matters is not where a culture sits in absolute terms but where it sits <em>relative to the person you are working with</em>.</p>
<table>
<tr><th>Scale</th><th>One end</th><th>Other end</th></tr>
<tr><td>Communicating</td><td>Low-context: precise, simple, explicit</td><td>High-context: layered, implicit, read between the lines</td></tr>
<tr><td>Evaluating</td><td>Direct negative feedback, stated frankly, sometimes in front of others</td><td>Indirect negative feedback, softened and given privately</td></tr>
<tr><td>Persuading</td><td>Principles-first: theory, then conclusion</td><td>Applications-first: start with the conclusion or recommendation and practical examples, adding theory only as needed (inductive reasoning; Meyer also notes a more holistic style of reasoning in some cultures)</td></tr>
<tr><td>Leading</td><td>Egalitarian: flat, the boss as facilitator</td><td>Hierarchical: status matters, the boss leads from the front</td></tr>
<tr><td>Deciding</td><td>Consensual: decide together, slower but stable</td><td>Top-down: the boss decides, faster but open to later change</td></tr>
<tr><td>Trusting</td><td>Task-based: trust comes from reliable work</td><td>Relationship-based: trust comes from shared meals, time and personal connection</td></tr>
<tr><td>Disagreeing</td><td>Confrontational: open debate is healthy</td><td>Avoids confrontation: open disagreement harms harmony</td></tr>
<tr><td>Scheduling</td><td>Linear-time: fixed deadlines, one task at a time</td><td>Flexible-time: plans adapt to opportunities and people</td></tr>
</table>
<p>The scales are not simply combinations of older frameworks. Meyer shows, for instance, that a culture can be <em>low-context yet indirect with negative feedback</em>, or <em>hierarchical yet consensual</em> in reaching decisions. That is why each scale should be read separately.</p>
<h3>A hedged note on Vietnamese workplaces</h3>
<p>Many observers describe Vietnamese workplace communication as <em>tending towards</em> the higher-context, relationship-based and hierarchical side, with disagreement often expressed indirectly and "yes" sometimes meaning "I heard you" rather than "I agree". These are broad tendencies only: generation, region, industry, company culture and international experience create large differences, and many Vietnamese professionals switch styles fluently.</p>
<h3>Practical rules</h3>
<ol>
<li>Speak slowly and plainly and avoid idioms; confirm understanding with open questions ("What will you do first?") rather than "Is that clear?".</li>
<li>Follow meetings with a short written recap of decisions, owners and dates.</li>
<li>Match feedback to the receiver: private and framed for indirect evaluators, specific and plain for direct ones.</li>
<li>Before judging a behaviour, think of at least two cultural explanations for it.</li>
</ol>
<div class="callout"><span class="badge">Remember</span> Meyer's scales, like all frameworks, describe tendencies. Watch your relative position: to a very direct colleague you may seem indirect, and to a very indirect one you may seem blunt.</div>`,
    `<span class="eyebrow">IBC201 · Phần 2 · Bài 2.1</span>
<h2>Giao tiếp liên văn hoá và tám thang đo của Meyer</h2>
<h3>Giao tiếp có nhiễu văn hoá</h3>
<p>Trong mô hình cơ bản, người gửi mã hoá thông điệp và gửi qua một kênh; người nhận giải mã và phản hồi. Khi xuyên văn hoá, <strong>nhiễu văn hoá</strong> — khác biệt về giá trị, ngôn ngữ, ngữ cảnh, tín hiệu phi ngôn ngữ và kỳ vọng — làm méo cả việc mã hoá lẫn giải mã. Người nhận sau đó gán ý nghĩa, thường qua lăng kính văn hoá của chính mình: sự im lặng có thể được hiểu là đồng ý, không đồng ý, tôn trọng hay bối rối.</p>
<h3>Thông điệp bị lạc ở đâu</h3>
<ul>
<li><strong>Ngôn ngữ</strong> — người dùng ngoại ngữ có thể hiểu nhiều hơn điều họ nói được, hoặc nói "vâng" để khỏi phải nhờ nhắc lại; thành ngữ và câu đùa hiếm khi "đi" được sang văn hoá khác.</li>
<li><strong>Giao tiếp phi ngôn ngữ</strong> — <em>cử động cơ thể</em> (cử chỉ, giao tiếp bằng mắt, nét mặt), <em>khoảng cách</em> (không gian cá nhân), <em>cận ngôn</em> (giọng điệu, tốc độ, sự im lặng), <em>cách dùng thời gian</em> và <em>ngôn ngữ đồ vật</em> (trang phục, văn phòng, quà tặng).</li>
<li><strong>Quy kết</strong> — giải thích hành vi của người khác bằng tính cách ("anh ta thô lỗ") trong khi hành vi đó chỉ theo một chuẩn mực khác ("anh ta nói thẳng").</li>
<li><strong>Khuôn mẫu và nhận thức có chọn lọc</strong> — chỉ để ý những gì khẳng định kỳ vọng của mình.</li>
<li><strong>Kênh truyền thông</strong> — email và tin nhắn làm mất giọng điệu và ngữ cảnh, gây bất lợi nhất cho người giao tiếp theo ngữ cảnh cao.</li>
</ul>
<h3>Tám thang đo của Erin Meyer (tóm tắt)</h3>
<p>Trong <em>The Culture Map</em>, Erin Meyer đặt các nền văn hoá lên tám thang đo mô tả hành vi kinh doanh hằng ngày. Điểm then chốt của bà là <strong>tính tương đối văn hoá</strong>: điều quan trọng không phải một nền văn hoá nằm ở đâu theo nghĩa tuyệt đối mà nằm ở đâu <em>so với người bạn đang làm việc cùng</em>.</p>
<table>
<tr><th>Thang đo</th><th>Một đầu</th><th>Đầu kia</th></tr>
<tr><td>Giao tiếp</td><td>Ngữ cảnh thấp: chính xác, đơn giản, tường minh</td><td>Ngữ cảnh cao: nhiều tầng nghĩa, hàm ẩn, hiểu ý ngầm</td></tr>
<tr><td>Đánh giá</td><td>Góp ý tiêu cực trực tiếp, nói thẳng, đôi khi trước mặt người khác</td><td>Góp ý tiêu cực gián tiếp, được làm mềm và nói riêng</td></tr>
<tr><td>Thuyết phục</td><td>Nguyên lý trước: lý thuyết rồi mới kết luận</td><td>Ứng dụng trước: nêu kết luận hoặc khuyến nghị cùng ví dụ thực tế ngay từ đầu, chỉ thêm lý thuyết khi cần (lập luận quy nạp; Meyer còn lưu ý lối lập luận tổng thể hơn ở một số nền văn hoá)</td></tr>
<tr><td>Lãnh đạo</td><td>Bình đẳng: tổ chức phẳng, sếp là người điều phối</td><td>Thứ bậc: địa vị quan trọng, sếp dẫn dắt từ phía trước</td></tr>
<tr><td>Ra quyết định</td><td>Đồng thuận: cùng quyết, chậm nhưng bền</td><td>Từ trên xuống: sếp quyết, nhanh nhưng có thể thay đổi sau đó</td></tr>
<tr><td>Tin tưởng</td><td>Dựa trên công việc: niềm tin đến từ làm việc đáng tin cậy</td><td>Dựa trên quan hệ: niềm tin đến từ những bữa ăn, thời gian và gắn bó cá nhân</td></tr>
<tr><td>Bất đồng</td><td>Đối đầu: tranh luận công khai là lành mạnh</td><td>Tránh đối đầu: bất đồng công khai làm tổn hại sự hài hoà</td></tr>
<tr><td>Lịch trình</td><td>Thời gian tuyến tính: hạn chót cố định, làm từng việc một</td><td>Thời gian linh hoạt: kế hoạch thích ứng theo cơ hội và con người</td></tr>
</table>
<p>Các thang đo không đơn thuần là tổ hợp của những khung cũ. Chẳng hạn, Meyer chỉ ra rằng một nền văn hoá có thể <em>ngữ cảnh thấp nhưng lại góp ý tiêu cực gián tiếp</em>, hoặc <em>thứ bậc nhưng lại đồng thuận</em> khi đi tới quyết định. Vì thế cần đọc từng thang đo riêng rẽ.</p>
<h3>Ghi chú có rào về nơi làm việc Việt Nam</h3>
<p>Nhiều nhà quan sát mô tả giao tiếp ở nơi làm việc Việt Nam <em>có xu hướng</em> nghiêng về phía ngữ cảnh cao hơn, dựa trên quan hệ và thứ bậc, bất đồng thường được bày tỏ gián tiếp và chữ "vâng" đôi khi mang nghĩa "tôi đã nghe" hơn là "tôi đồng ý". Đây chỉ là xu hướng chung: thế hệ, vùng miền, ngành nghề, văn hoá công ty và kinh nghiệm quốc tế tạo ra khác biệt rất lớn, và nhiều người làm chuyên môn Việt Nam chuyển đổi phong cách rất linh hoạt.</p>
<h3>Quy tắc thực hành</h3>
<ol>
<li>Nói chậm, rõ và tránh thành ngữ; xác nhận sự hiểu bằng câu hỏi mở ("Việc đầu tiên anh/chị sẽ làm là gì?") thay vì "Rõ chưa?".</li>
<li>Sau cuộc họp, gửi bản tóm tắt ngắn bằng văn bản: quyết định, người phụ trách và thời hạn.</li>
<li>Điều chỉnh cách góp ý theo người nhận: nói riêng và khéo léo với người quen góp ý gián tiếp, cụ thể và rõ ràng với người quen góp ý trực tiếp.</li>
<li>Trước khi phán xét một hành vi, hãy nghĩ ra ít nhất hai cách giải thích mang tính văn hoá cho nó.</li>
</ol>
<div class="callout"><span class="badge">Ghi nhớ</span> Tám thang đo của Meyer, như mọi khung khác, mô tả xu hướng. Hãy để ý vị trí tương đối của mình: với một đồng nghiệp rất thẳng thắn, bạn có thể bị coi là vòng vo; với một người rất gián tiếp, bạn có thể bị coi là thô.</div>`,
  ]]);

const c5 = doc('ibc201-2-2-culture-shock-cq', '2.2 — Adjusting to a new culture: culture shock and cultural intelligence|||2.2 — Thích nghi với văn hoá mới: cú sốc văn hoá và trí tuệ văn hoá',
  'Cú sốc văn hoá theo Oberg và các biểu hiện, đường cong chữ U (Lysgaard) và chữ W (Gullahorn & Gullahorn) cùng giới hạn của chúng, trí tuệ văn hoá CQ với bốn thành phần (động lực, tri thức, siêu nhận thức, hành vi) và cách phát triển, cách hỗ trợ thích nghi.',
  [[
    `<span class="eyebrow">IBC201 · Part 2 · Lesson 2.2</span>
<h2>Adjusting to a new culture: culture shock and cultural intelligence</h2>
<h3>Culture shock</h3>
<p>The anthropologist Kalervo Oberg used the term <strong>culture shock</strong> for the anxiety that results from losing the familiar signs and symbols of social interaction. Typical symptoms include irritability, homesickness, fatigue, withdrawal and negative judgements about the host culture.</p>
<h3>The U-curve and the W-curve</h3>
<pre><code class="language-text">Adjustment
   ^
   |  Honeymoon                                    Mastery
   |     \                                       /
   |      \                           Adjustment
   |       \                         /
   |        \  Crisis (culture shock)
   +------------------------------------------------&gt; Time abroad
U-curve (Lysgaard, 1955); stage labels commonly used in textbooks
        (building on Oberg): honeymoon → crisis → adjustment → mastery
W-curve (Gullahorn and Gullahorn): the U repeats after returning home
        (re-entry or reverse culture shock) — two U's in a row</code></pre>
<ul>
<li><strong>Honeymoon</strong> — novelty and excitement.</li>
<li><strong>Crisis (culture shock)</strong> — daily frustrations accumulate; mood and performance fall.</li>
<li><strong>Adjustment</strong> — the person learns the rules and builds routines and relationships.</li>
<li><strong>Mastery (adaptation)</strong> — the person functions effectively, sometimes biculturally.</li>
</ul>
<p>The W-curve reminds companies that <strong>coming home is also an adjustment</strong>: returning employees find that the organization, their colleagues and they themselves have changed. Research support for a neat U-shape is mixed — some people never feel a honeymoon, others adjust steadily — so use the curves to normalize feelings and plan support, not as a timetable.</p>
<h3>Cultural intelligence (CQ)</h3>
<p>P. Christopher Earley and Soon Ang introduced <strong>cultural intelligence</strong> as the capability to function effectively in culturally diverse settings. Unlike knowledge of one particular culture, CQ is a general capability that can be developed. It has four components (following Ang and Van Dyne; the labels in brackets are the popular terms CQ Drive, Knowledge, Strategy and Action):</p>
<table>
<tr><th>Component</th><th>What it means</th><th>How to develop it</th></tr>
<tr><td>Motivational (CQ Drive)</td><td>Interest, confidence and persistence in intercultural situations</td><td>Link intercultural work to personal goals; start with small successes</td></tr>
<tr><td>Cognitive (CQ Knowledge)</td><td>Knowledge of how cultures are similar and different: economic, legal and social systems, values, norms</td><td>Study frameworks, history and language basics; follow local news</td></tr>
<tr><td>Metacognitive (CQ Strategy)</td><td>Awareness and planning: checking assumptions before, during and after interactions</td><td>Plan meetings; notice surprises; debrief ("What did I assume?")</td></tr>
<tr><td>Behavioural (CQ Action)</td><td>Ability to adapt verbal and non-verbal behaviour appropriately</td><td>Practise adjusting speech rate, directness and greetings; ask for feedback</td></tr>
</table>
<p>Knowledge alone is not enough. A manager who knows the frameworks but lacks drive avoids interaction; one who has knowledge but no strategy applies stereotypes rigidly. The metacognitive component is what turns knowledge into accurate, situation-specific judgement.</p>
<h3>Supporting adjustment</h3>
<ul>
<li>Pre-departure preparation that includes the family, not only the employee.</li>
<li>A local mentor or "buddy" and early social connections.</li>
<li>Realistic expectations about a dip in performance during the first months.</li>
<li>Planned re-entry support long before the assignment ends (Lesson 3.2).</li>
</ul>
<div class="callout"><span class="badge">Key lesson</span> Culture shock is a normal response, not a personal failure. Cultural intelligence can be learned — above all the habit of checking your assumptions before acting on them.</div>`,
    `<span class="eyebrow">IBC201 · Phần 2 · Bài 2.2</span>
<h2>Thích nghi với văn hoá mới: cú sốc văn hoá và trí tuệ văn hoá</h2>
<h3>Cú sốc văn hoá</h3>
<p>Nhà nhân học Kalervo Oberg dùng thuật ngữ <strong>cú sốc văn hoá</strong> để chỉ sự lo âu nảy sinh khi mất đi những dấu hiệu và biểu tượng quen thuộc của giao tiếp xã hội. Biểu hiện thường gặp gồm dễ cáu bẳn, nhớ nhà, mệt mỏi, thu mình và phán xét tiêu cực về văn hoá nước sở tại.</p>
<h3>Đường cong chữ U và chữ W</h3>
<pre><code class="language-text">Mức thích nghi
   ^
   |  Trăng mật                                    Làm chủ
   |     \                                       /
   |      \                          Điều chỉnh
   |       \                         /
   |        \  Khủng hoảng (cú sốc văn hoá)
   +------------------------------------------------&gt; Thời gian ở nước ngoài
Đường cong chữ U (Lysgaard, 1955); tên các giai đoạn thường dùng trong giáo trình
        (dựa trên Oberg): trăng mật → khủng hoảng → điều chỉnh → làm chủ
Đường cong chữ W (Gullahorn và Gullahorn): chữ U lặp lại sau khi về nước
        (cú sốc tái nhập hay cú sốc văn hoá ngược) — hai chữ U nối tiếp</code></pre>
<ul>
<li><strong>Trăng mật</strong> — mới lạ và hào hứng.</li>
<li><strong>Khủng hoảng (cú sốc văn hoá)</strong> — những bực bội hằng ngày tích tụ; tâm trạng và hiệu quả làm việc đi xuống.</li>
<li><strong>Điều chỉnh</strong> — người đó học được luật chơi, xây dựng thói quen và các mối quan hệ.</li>
<li><strong>Làm chủ (thích nghi)</strong> — người đó hoạt động hiệu quả, đôi khi thành người song văn hoá.</li>
</ul>
<p>Đường cong chữ W nhắc doanh nghiệp rằng <strong>trở về cũng là một quá trình thích nghi</strong>: nhân viên về nước thấy tổ chức, đồng nghiệp và chính mình đều đã thay đổi. Bằng chứng nghiên cứu cho một hình chữ U gọn gàng là không nhất quán — có người không hề trải qua giai đoạn trăng mật, có người thích nghi đều đặn — nên hãy dùng các đường cong để bình thường hoá cảm xúc và lên kế hoạch hỗ trợ, không phải như một thời gian biểu.</p>
<h3>Trí tuệ văn hoá (CQ)</h3>
<p>P. Christopher Earley và Soon Ang đưa ra khái niệm <strong>trí tuệ văn hoá</strong> — năng lực hoạt động hiệu quả trong môi trường đa dạng văn hoá. Khác với hiểu biết về một nền văn hoá cụ thể, CQ là năng lực chung có thể phát triển. CQ gồm bốn thành phần (theo Ang và Van Dyne; nhãn trong ngoặc là cách gọi phổ biến CQ Drive, Knowledge, Strategy, Action):</p>
<table>
<tr><th>Thành phần</th><th>Nghĩa là gì</th><th>Cách phát triển</th></tr>
<tr><td>Động lực (CQ Drive)</td><td>Hứng thú, tự tin và kiên trì trong các tình huống liên văn hoá</td><td>Gắn công việc liên văn hoá với mục tiêu cá nhân; bắt đầu từ những thành công nhỏ</td></tr>
<tr><td>Tri thức (CQ Knowledge)</td><td>Hiểu biết về chỗ giống và khác nhau giữa các nền văn hoá: hệ thống kinh tế, pháp luật, xã hội, giá trị, chuẩn mực</td><td>Học các khung phân tích, lịch sử, ngôn ngữ cơ bản; theo dõi tin tức địa phương</td></tr>
<tr><td>Siêu nhận thức (CQ Strategy)</td><td>Nhận thức và lập kế hoạch: kiểm tra giả định trước, trong và sau khi tương tác</td><td>Chuẩn bị cho cuộc họp; để ý những điều bất ngờ; rút kinh nghiệm ("Mình đã giả định điều gì?")</td></tr>
<tr><td>Hành vi (CQ Action)</td><td>Khả năng điều chỉnh hành vi ngôn ngữ và phi ngôn ngữ cho phù hợp</td><td>Luyện điều chỉnh tốc độ nói, mức thẳng thắn, cách chào hỏi; xin phản hồi</td></tr>
</table>
<p>Chỉ có tri thức là chưa đủ. Một nhà quản lý biết các khung nhưng thiếu động lực sẽ né tránh tương tác; người có tri thức nhưng thiếu chiến lược sẽ áp khuôn mẫu một cách cứng nhắc. Thành phần siêu nhận thức là thứ biến tri thức thành phán đoán chính xác, sát với từng tình huống.</p>
<h3>Hỗ trợ quá trình thích nghi</h3>
<ul>
<li>Chuẩn bị trước khi đi cho cả gia đình, không chỉ cho nhân viên.</li>
<li>Một người hướng dẫn hoặc "bạn đồng hành" tại chỗ và các kết nối xã hội sớm.</li>
<li>Kỳ vọng thực tế về việc hiệu quả làm việc giảm trong những tháng đầu.</li>
<li>Lên kế hoạch hỗ trợ tái nhập từ lâu trước khi nhiệm kỳ kết thúc (Bài 3.2).</li>
</ul>
<div class="callout"><span class="badge">Bài học chính</span> Cú sốc văn hoá là phản ứng bình thường, không phải thất bại cá nhân. Trí tuệ văn hoá có thể học được — trên hết là thói quen kiểm tra giả định của mình trước khi hành động dựa trên chúng.</div>`,
  ]]);

const c6 = doc('ibc201-2-3-multicultural-virtual-teams', '2.3 — Managing multicultural and virtual teams|||2.3 — Quản trị đội đa văn hoá và đội ảo',
  'Đa dạng là con dao hai lưỡi, bốn thách thức của đội đa văn hoá và bốn kiểu can thiệp (Brett, Behfar & Kern), mô hình MBI — lập bản đồ, bắc cầu, hội nhập (Maznevski & DiStefano), khó khăn riêng của đội ảo toàn cầu (múi giờ, kênh nghèo, niềm tin tức thời) và thực hành tốt.',
  [[
    `<span class="eyebrow">IBC201 · Part 2 · Lesson 2.3</span>
<h2>Managing multicultural and virtual teams</h2>
<h3>Diversity: a double-edged sword</h3>
<p>Culturally diverse teams bring more perspectives, knowledge of different markets and a lower risk of groupthink. They also bring more misunderstanding, slower trust-building and more conflict about process. Research summarized by Nancy Adler suggests that diverse teams tend to end up at the extremes — among the most effective or the least effective — while homogeneous teams more often land in the middle. The difference lies in how the team is managed.</p>
<h3>Four common challenges</h3>
<p>Jeanne Brett, Kristin Behfar and Mary Kern identified four recurring challenges in multicultural teams:</p>
<table>
<tr><th>Challenge</th><th>What happens</th></tr>
<tr><td>Direct vs indirect communication</td><td>Direct members find indirect ones evasive; indirect members find direct ones rude</td></tr>
<tr><td>Accents and fluency</td><td>Less fluent members speak less, and their expertise is underused</td></tr>
<tr><td>Attitudes to hierarchy</td><td>Some members wait for the leader; others bypass status</td></tr>
<tr><td>Decision-making norms</td><td>Some want to decide quickly and fix later; others want analysis and consensus first</td></tr>
</table>
<p>They describe four types of response: <strong>adaptation</strong> (members acknowledge the differences and adjust), <strong>structural intervention</strong> (changing subgroups, roles or meeting formats), <strong>managerial intervention</strong> (a leader sets norms or decides), and, as a last resort, <strong>exit</strong> (a member leaves the team).</p>
<h3>The MBI model: map, bridge, integrate</h3>
<p>Martha Maznevski and Joseph DiStefano propose three steps for creating value from diversity:</p>
<ol>
<li><strong>Map</strong> the differences — describe members' preferences (for example on Meyer's scales) without judging them.</li>
<li><strong>Bridge</strong> them through communication — <em>decentring</em> (seeing the issue from the other's perspective) and <em>recentring</em> (building shared norms and a common goal).</li>
<li><strong>Integrate</strong> — make sure everyone participates, resolve conflicts constructively and build on one another's ideas.</li>
</ol>
<h3>Global virtual teams</h3>
<p>Virtual teams work across locations and time zones mainly through technology. Their specific difficulties:</p>
<ul>
<li><strong>Time zones</strong> — little overlap in working hours; the same people always take the late-night calls.</li>
<li><strong>Lean media</strong> — chat and email lose tone and context, so misunderstandings escalate.</li>
<li><strong>Trust</strong> — relationship-based trust is hard to build without meeting. Teams often start with <em>swift trust</em>, a provisional trust based on roles and professionalism, which must be confirmed by reliable early actions.</li>
<li><strong>Invisibility</strong> — the contributions of remote or quieter members go unseen.</li>
</ul>
<h3>Good practices</h3>
<ul>
<li>Write a <strong>team charter</strong> early: goals, roles, decision rules, response-time norms, preferred channels and the meeting language.</li>
<li>Protect the <strong>overlap window</strong> for live work and rotate inconvenient meeting times fairly.</li>
<li>Combine media: video for relationships and conflict, written summaries for decisions.</li>
<li>Invest in relationships early — a kick-off (face to face if possible), informal video time, personal introductions.</li>
<li>Make work visible: shared task boards with clear owners and dates.</li>
</ul>
<div class="callout"><span class="badge">Key lesson</span> Diversity creates value only when a team deliberately maps its differences, bridges them through communication and integrates everyone's ideas. Left alone, it usually creates friction.</div>`,
    `<span class="eyebrow">IBC201 · Phần 2 · Bài 2.3</span>
<h2>Quản trị đội đa văn hoá và đội ảo</h2>
<h3>Đa dạng: con dao hai lưỡi</h3>
<p>Đội đa dạng văn hoá mang lại nhiều góc nhìn hơn, hiểu biết về nhiều thị trường và ít nguy cơ tư duy nhóm hơn. Nhưng đội đó cũng có nhiều hiểu lầm hơn, xây dựng niềm tin chậm hơn và nhiều xung đột về cách làm hơn. Các nghiên cứu được Nancy Adler tổng kết cho thấy đội đa dạng có xu hướng rơi vào hai thái cực — hoặc thuộc nhóm hiệu quả nhất, hoặc thuộc nhóm kém hiệu quả nhất — trong khi đội đồng nhất thường nằm ở giữa. Khác biệt nằm ở cách đội được quản trị.</p>
<h3>Bốn thách thức thường gặp</h3>
<p>Jeanne Brett, Kristin Behfar và Mary Kern xác định bốn thách thức lặp đi lặp lại trong đội đa văn hoá:</p>
<table>
<tr><th>Thách thức</th><th>Điều xảy ra</th></tr>
<tr><td>Giao tiếp trực tiếp và gián tiếp</td><td>Người nói thẳng thấy người gián tiếp lảng tránh; người gián tiếp thấy người nói thẳng thô lỗ</td></tr>
<tr><td>Giọng nói và độ lưu loát</td><td>Thành viên kém lưu loát nói ít hơn, và chuyên môn của họ bị lãng phí</td></tr>
<tr><td>Thái độ với thứ bậc</td><td>Một số thành viên chờ trưởng nhóm; số khác bỏ qua địa vị</td></tr>
<tr><td>Chuẩn mực ra quyết định</td><td>Người muốn quyết nhanh rồi sửa sau; người muốn phân tích và đồng thuận trước</td></tr>
</table>
<p>Các tác giả mô tả bốn kiểu xử lý: <strong>thích ứng</strong> (thành viên thừa nhận khác biệt và tự điều chỉnh), <strong>can thiệp cấu trúc</strong> (thay đổi nhóm con, vai trò hay hình thức họp), <strong>can thiệp quản lý</strong> (trưởng nhóm đặt chuẩn mực hoặc ra quyết định), và, như biện pháp cuối cùng, <strong>rời đội</strong> (một thành viên rời khỏi đội).</p>
<h3>Mô hình MBI: lập bản đồ, bắc cầu, hội nhập</h3>
<p>Martha Maznevski và Joseph DiStefano đề xuất ba bước để tạo giá trị từ sự đa dạng:</p>
<ol>
<li><strong>Lập bản đồ</strong> (Map) các khác biệt — mô tả ưu tiên của các thành viên (ví dụ trên các thang đo của Meyer) mà không phán xét.</li>
<li><strong>Bắc cầu</strong> (Bridge) bằng giao tiếp — <em>thoát khỏi trung tâm</em> (nhìn vấn đề từ góc độ của người khác) và <em>tái lập trung tâm</em> (xây dựng chuẩn mực chung và mục tiêu chung).</li>
<li><strong>Hội nhập</strong> (Integrate) — bảo đảm mọi người đều tham gia, giải quyết xung đột một cách xây dựng và phát triển tiếp ý tưởng của nhau.</li>
</ol>
<h3>Đội ảo toàn cầu</h3>
<p>Đội ảo làm việc xuyên địa điểm và múi giờ, chủ yếu qua công nghệ. Những khó khăn riêng:</p>
<ul>
<li><strong>Múi giờ</strong> — giờ làm việc ít trùng nhau; luôn là những người đó phải họp đêm.</li>
<li><strong>Kênh nghèo thông tin</strong> — tin nhắn và email mất giọng điệu, ngữ cảnh, nên hiểu lầm leo thang.</li>
<li><strong>Niềm tin</strong> — niềm tin dựa trên quan hệ khó xây khi không gặp mặt. Đội thường khởi đầu bằng <em>niềm tin tức thời</em> (swift trust), một niềm tin tạm thời dựa trên vai trò và tính chuyên nghiệp, cần được khẳng định bằng những hành động đáng tin cậy từ sớm.</li>
<li><strong>Sự vô hình</strong> — đóng góp của thành viên ở xa hoặc ít nói không được nhìn thấy.</li>
</ul>
<h3>Thực hành tốt</h3>
<ul>
<li>Viết <strong>hiến chương nhóm</strong> từ sớm: mục tiêu, vai trò, quy tắc ra quyết định, chuẩn mực thời gian phản hồi, kênh ưu tiên và ngôn ngữ họp.</li>
<li>Giữ <strong>khung giờ trùng nhau</strong> cho việc làm trực tiếp và luân phiên công bằng những giờ họp bất tiện.</li>
<li>Kết hợp các kênh: video cho quan hệ và xung đột, tóm tắt bằng văn bản cho các quyết định.</li>
<li>Đầu tư vào quan hệ từ sớm — buổi khởi động (gặp trực tiếp nếu có thể), thời gian trò chuyện không chính thức qua video, giới thiệu bản thân.</li>
<li>Làm cho công việc hiện ra: bảng việc chung với người phụ trách và thời hạn rõ ràng.</li>
</ul>
<div class="callout"><span class="badge">Bài học chính</span> Đa dạng chỉ tạo ra giá trị khi đội chủ động lập bản đồ khác biệt, bắc cầu bằng giao tiếp và hội nhập ý tưởng của mọi người. Nếu bỏ mặc, nó thường chỉ tạo ra va chạm.</div>`,
  ]]);

const c6e = doc('ibc201-2-4-exercise', 'Exercise 1 — a project team split across three offices|||Bài tập 1 — đội dự án chia ở ba văn phòng',
  'Bài tập tình huống hư cấu: chẩn đoán bốn vấn đề của một đội phần mềm ở TP.HCM, Bengaluru và Berlin bằng khung của Hall và thang đo của Meyer, tính khung giờ trùng nhau vào mùa đông và mùa hè, đề xuất quy tắc làm việc cho hiến chương nhóm; kèm lời giải.',
  [[
    `<span class="eyebrow">IBC201 · Part 2 · Exercise 1</span>
<h2>Exercise 1 — a project team split across three offices</h2>
<div class="callout"><span class="badge">Problem</span> (A fictional case; the people and the company are invented.) A software company runs a six-person project team: two developers in Ho Chi Minh City (UTC+7), two analysts in Bengaluru (UTC+5:30), and a project lead and a designer in Berlin (UTC+1 in winter). Everyone works 9:00–18:00 local time. After two months: (1) the Berlin lead, Jonas, posts short critiques in the group chat such as "This screen is wrong, redo it"; the Ho Chi Minh City developers go quiet in calls and their replies get shorter; (2) when Jonas asks "Can you finish by Friday?", the developers answer "Yes, we will try" — and Friday deadlines slip; (3) the Bengaluru analysts move internal deadlines whenever new client requests arrive and answer messages late at night; (4) decisions announced by Jonas are reopened a week later because some members say they were never consulted. (a) Diagnose the problems using Hall and Meyer's scales. (b) Calculate the daily window in which all three offices are at work, in winter and in summer (Berlin moves to UTC+2; Vietnam and India do not change their clocks). (c) Propose working rules for a team charter.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Diagnosis (tendencies seen in these individuals — not verdicts on nations)
    Issue 1  Meyer: Evaluating (direct vs indirect negative feedback)
             Jonas criticizes directly and in public; colleagues used to softer,
             private feedback may feel a loss of face and withdraw.
    Issue 2  Hall: low- vs high-context; Meyer: Communicating, Disagreeing
             "Yes, we will try" may mean "we heard you" or a polite "difficult";
             a low-context listener hears a firm commitment.
    Issue 3  Hall: monochronic vs polychronic; Meyer: Scheduling
             Linear-time vs flexible-time: deadlines fixed vs adjustable.
    Issue 4  Meyer: Deciding (consensual vs top-down) and Leading
             Some expect the lead to decide; others expect to be consulted first.

(b) Overlap window (9:00-18:00 local, converted to UTC)
    Ho Chi Minh City  UTC+7     09-18 local = 02:00-11:00 UTC
    Bengaluru         UTC+5:30  09-18 local = 03:30-12:30 UTC
    Berlin (winter)   UTC+1     09-18 local = 08:00-17:00 UTC
    Overlap = latest start to earliest end = 08:00-11:00 UTC = 3 hours
      = 15:00-18:00 HCMC, 13:30-16:30 Bengaluru, 09:00-12:00 Berlin
    Berlin (summer)   UTC+2     09-18 local = 07:00-16:00 UTC
    Overlap = 07:00-11:00 UTC = 4 hours
      = 14:00-18:00 HCMC, 12:30-16:30 Bengaluru, 09:00-13:00 Berlin

(c) Team charter (examples)
    1. Feedback: criticism of work in one-to-one calls or private messages;
       in the group chat describe the issue and the fix
       ("Screen 3: totals missing — please add").
    2. Commitments: answer with one of three words — "Committed", "At risk",
       "Not possible" — plus the reason; "we will try" is not used.
    3. Decisions: state the rule up front (lead decides after input, or team
       consensus) and the date; a 48-hour window for input before deciding.
    4. Deadlines: client-driven changes go through the lead; a date changes
       only with a written note to everyone.
    5. Time: live meetings only inside the overlap window; no replies expected
       outside local 9:00-18:00; a written recap within 24 hours.
    6. Relationship: a monthly informal video session; a visit at a milestone.</code></pre>
<p><strong>Why:</strong> each problem is a clash between two reasonable norms, not bad intentions. Mapping the behaviours on Hall's and Meyer's scales turns blame ("they are unreliable", "he is rude") into a design question. The charter <em>bridges</em> the gap in two directions: it makes implicit expectations explicit, which helps low-context members, and it moves criticism into private channels and replaces an ambiguous "yes" with agreed words, which protects face for high-context members. The short overlap window — only 3 hours in winter — explains why written, asynchronous rules matter so much in this team.</p>`,
    `<span class="eyebrow">IBC201 · Phần 2 · Bài tập 1</span>
<h2>Bài tập 1 — đội dự án chia ở ba văn phòng</h2>
<div class="callout"><span class="badge">Đề</span> (Tình huống giả định; con người và công ty đều hư cấu.) Một công ty phần mềm có một đội dự án sáu người: hai lập trình viên ở TP. Hồ Chí Minh (UTC+7), hai chuyên viên phân tích ở Bengaluru (UTC+5:30), một trưởng dự án và một nhà thiết kế ở Berlin (UTC+1 vào mùa đông). Mọi người làm việc 9:00–18:00 theo giờ địa phương. Sau hai tháng: (1) trưởng dự án Jonas ở Berlin đăng những nhận xét ngắn trong nhóm chat như "Màn hình này sai, làm lại đi"; hai lập trình viên ở TP.HCM trở nên im lặng trong các cuộc gọi và trả lời ngày càng ngắn; (2) khi Jonas hỏi "Các bạn xong trước thứ Sáu được không?", các lập trình viên trả lời "Vâng, bọn em sẽ cố" — và các hạn thứ Sáu liên tục bị trễ; (3) hai chuyên viên ở Bengaluru dời hạn chót nội bộ mỗi khi khách hàng có yêu cầu mới và trả lời tin nhắn lúc khuya; (4) các quyết định Jonas công bố bị mở lại một tuần sau vì một số thành viên nói họ chưa hề được hỏi ý kiến. (a) Chẩn đoán các vấn đề bằng khung của Hall và các thang đo của Meyer. (b) Tính khung giờ hằng ngày mà cả ba văn phòng cùng đang làm việc, vào mùa đông và mùa hè (Berlin chuyển sang UTC+2; Việt Nam và Ấn Độ không đổi giờ). (c) Đề xuất quy tắc làm việc cho hiến chương nhóm.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Chẩn đoán (xu hướng thấy ở những cá nhân này — không phải phán quyết về quốc gia)
    Vấn đề 1  Meyer: Đánh giá (góp ý tiêu cực trực tiếp hay gián tiếp)
              Jonas phê bình thẳng và công khai; đồng nghiệp quen góp ý nhẹ nhàng,
              nói riêng có thể thấy mất thể diện và thu mình lại.
    Vấn đề 2  Hall: ngữ cảnh thấp hay cao; Meyer: Giao tiếp, Bất đồng
              "Vâng, bọn em sẽ cố" có thể nghĩa "bọn em đã nghe" hoặc một chữ "khó" lịch sự;
              người nghe theo ngữ cảnh thấp hiểu đó là cam kết chắc chắn.
    Vấn đề 3  Hall: đơn tuyến hay đa tuyến; Meyer: Lịch trình
              Thời gian tuyến tính hay linh hoạt: hạn chót cố định hay điều chỉnh được.
    Vấn đề 4  Meyer: Ra quyết định (đồng thuận hay từ trên xuống) và Lãnh đạo
              Có người chờ trưởng dự án quyết; có người mong được hỏi ý kiến trước.

(b) Khung giờ trùng nhau (9:00-18:00 giờ địa phương, đổi sang UTC)
    TP. Hồ Chí Minh   UTC+7     09-18 địa phương = 02:00-11:00 UTC
    Bengaluru         UTC+5:30  09-18 địa phương = 03:30-12:30 UTC
    Berlin (mùa đông) UTC+1     09-18 địa phương = 08:00-17:00 UTC
    Trùng nhau = từ giờ bắt đầu muộn nhất tới giờ kết thúc sớm nhất = 08:00-11:00 UTC = 3 giờ
      = 15:00-18:00 TP.HCM, 13:30-16:30 Bengaluru, 09:00-12:00 Berlin
    Berlin (mùa hè)   UTC+2     09-18 địa phương = 07:00-16:00 UTC
    Trùng nhau = 07:00-11:00 UTC = 4 giờ
      = 14:00-18:00 TP.HCM, 12:30-16:30 Bengaluru, 09:00-13:00 Berlin

(c) Hiến chương nhóm (ví dụ)
    1. Góp ý: phê bình công việc qua cuộc gọi riêng hoặc tin nhắn riêng;
       trong nhóm chat chỉ nêu vấn đề và cách sửa
       ("Màn hình 3: thiếu dòng tổng — nhờ bổ sung").
    2. Cam kết: trả lời bằng một trong ba từ — "Cam kết", "Có rủi ro",
       "Không thể" — kèm lý do; không dùng câu "sẽ cố".
    3. Quyết định: nêu trước quy tắc (trưởng dự án quyết sau khi nghe ý kiến,
       hoặc cả đội đồng thuận) và ngày quyết; có 48 giờ để góp ý trước khi chốt.
    4. Hạn chót: thay đổi do khách hàng phải đi qua trưởng dự án; chỉ đổi ngày
       khi có thông báo bằng văn bản cho mọi người.
    5. Thời gian: chỉ họp trực tiếp trong khung giờ trùng nhau; không đòi hỏi trả lời
       ngoài 9:00-18:00 giờ địa phương; gửi tóm tắt bằng văn bản trong 24 giờ.
    6. Quan hệ: mỗi tháng một buổi trò chuyện qua video; gặp mặt ở một mốc dự án.</code></pre>
<p><strong>Vì sao:</strong> mỗi vấn đề là sự va chạm giữa hai chuẩn mực hợp lý, không phải ý xấu. Đặt các hành vi lên thang đo của Hall và Meyer biến lời đổ lỗi ("họ không đáng tin", "anh ta thô lỗ") thành một bài toán thiết kế. Hiến chương <em>bắc cầu</em> theo hai chiều: nó biến kỳ vọng ngầm thành quy tắc tường minh, giúp các thành viên quen ngữ cảnh thấp; và nó chuyển phê bình sang kênh riêng, thay chữ "vâng" mơ hồ bằng các từ đã thống nhất, giúp giữ thể diện cho các thành viên quen ngữ cảnh cao. Khung giờ trùng nhau ngắn — chỉ 3 giờ vào mùa đông — giải thích vì sao các quy tắc làm việc bằng văn bản, không đồng bộ lại quan trọng đến vậy với đội này.</p>`,
  ]]);

const c6q = quiz('ibc201-quiz-2', 'Quiz 2 — Communication, adjustment and teams|||Quiz 2 — Giao tiếp, thích nghi và làm việc nhóm', [
  { id: 'q1', question: 'What does the W-curve add to the U-curve of cultural adjustment?|||Đường cong chữ W bổ sung điều gì cho đường cong chữ U về thích nghi văn hoá?', options: ['A second honeymoon in the middle of the assignment|||Một giai đoạn trăng mật thứ hai giữa nhiệm kỳ', 'A second adjustment cycle on returning home (reverse culture shock)|||Một chu kỳ thích nghi thứ hai khi trở về nước (cú sốc văn hoá ngược)', 'A test that measures cultural intelligence|||Một bài kiểm tra đo trí tuệ văn hoá', 'A rule that adjustment always takes exactly one year|||Một quy tắc rằng thích nghi luôn mất đúng một năm'], correctIndex: 1, explanation: 'Gullahorn and Gullahorn extended the U-curve: returnees go through a second U when re-entering their home culture.|||Gullahorn và Gullahorn mở rộng đường cong chữ U: người trở về trải qua chữ U thứ hai khi tái nhập văn hoá của mình.' },
  { id: 'q2', question: 'Before a meeting with a new foreign partner, a manager plans how to open, then notices during the meeting that her assumptions were wrong and revises them and her plan. Which CQ component is this?|||Trước cuộc họp với một đối tác nước ngoài mới, một nhà quản lý lên kế hoạch cách mở đầu, rồi trong cuộc họp nhận ra giả định của mình sai và xem lại giả định cùng kế hoạch của mình. Đây là thành phần CQ nào?', options: ['Motivational (CQ Drive)|||Động lực (CQ Drive)', 'Cognitive (CQ Knowledge)|||Tri thức (CQ Knowledge)', 'Metacognitive (CQ Strategy)|||Siêu nhận thức (CQ Strategy)', 'Behavioural (CQ Action)|||Hành vi (CQ Action)'], correctIndex: 2, explanation: 'Planning and checking assumptions before, during and after an interaction is metacognitive CQ.|||Lập kế hoạch và kiểm tra giả định trước, trong và sau tương tác là CQ siêu nhận thức.' },
  { id: 'q3', question: 'Offices in Ho Chi Minh City (UTC+7) and Berlin (UTC+1) both work 9:00–18:00 local time. How many working hours overlap each day?|||Văn phòng ở TP. Hồ Chí Minh (UTC+7) và Berlin (UTC+1) cùng làm 9:00–18:00 giờ địa phương. Mỗi ngày có bao nhiêu giờ làm việc trùng nhau?', options: ['3 hours|||3 giờ', '1 hour|||1 giờ', '6 hours|||6 giờ', '9 hours|||9 giờ'], correctIndex: 0, explanation: 'HCMC 9–18 is 02:00–11:00 UTC; Berlin 9–18 is 08:00–17:00 UTC. The overlap is 08:00–11:00 UTC = 3 hours (15:00–18:00 in HCMC).|||TP.HCM 9–18 là 02:00–11:00 UTC; Berlin 9–18 là 08:00–17:00 UTC. Phần trùng là 08:00–11:00 UTC = 3 giờ (15:00–18:00 giờ TP.HCM).' },
]);

const c7 = doc('ibc201-3-1-leadership-motivation', '3.1 — Leading and motivating across cultures|||3.1 — Lãnh đạo và tạo động lực xuyên văn hoá',
  'Lý thuyết lãnh đạo ngầm định được văn hoá tán thành (CLT) của GLOBE với sáu chiều lãnh đạo (trình bày định tính), các thuộc tính được đánh giá tích cực hay tiêu cực ở mọi nơi và các thuộc tính tuỳ văn hoá, tạo động lực trong các bối cảnh văn hoá khác nhau, hàm ý thực hành.',
  [[
    `<span class="eyebrow">IBC201 · Part 3 · Lesson 3.1</span>
<h2>Leading and motivating across cultures</h2>
<p class="lead">What counts as a "good leader" is partly universal and partly culture-specific. Behaviour admired as decisive in one setting can look authoritarian in another; behaviour praised as participative can look weak.</p>
<h3>GLOBE's culturally endorsed implicit leadership theory (CLT)</h3>
<p>GLOBE asked managers which attributes help or hinder outstanding leadership. The answers grouped into six global leadership dimensions:</p>
<table>
<tr><th>CLT dimension</th><th>What it describes</th><th>Cross-cultural pattern (qualitative)</th></tr>
<tr><td>Charismatic / value-based</td><td>Inspiring, visionary, decisive, performance-oriented, with integrity</td><td>Seen as contributing to outstanding leadership in virtually all societies</td></tr>
<tr><td>Team-oriented</td><td>Team building, collaboration, a common purpose</td><td>Also widely endorsed</td></tr>
<tr><td>Participative</td><td>Involving others in decisions</td><td>Generally endorsed, but the degree varies considerably between clusters</td></tr>
<tr><td>Humane-oriented</td><td>Supportive, considerate, compassionate, generous</td><td>Moderately endorsed; varies between clusters</td></tr>
<tr><td>Autonomous</td><td>Independent, individualistic leadership</td><td>Varies widely; neutral or slightly negative in many clusters</td></tr>
<tr><td>Self-protective</td><td>Status-conscious, face-saving, procedural, self-centred</td><td>Generally seen as hindering, though less strongly in some clusters</td></tr>
</table>
<h3>Universal and culturally contingent attributes</h3>
<ul>
<li><strong>Universally positive</strong> (examples): trustworthy, just, honest, having foresight, encouraging, motivating, dependable, decisive, excellence-oriented, a team builder, a win-win problem solver.</li>
<li><strong>Universally negative</strong> (examples): loner, asocial, non-cooperative, irritable, non-explicit, egocentric, ruthless, dictatorial.</li>
<li><strong>Culturally contingent</strong> (examples): ambitious, cautious, individualistic, risk-taking, status-conscious, formal — valued in some cultures and not in others.</li>
</ul>
<p>So a global manager has a <strong>core</strong> that travels — integrity, vision, team building — and a <strong>range</strong> of behaviours to adjust: how participative to be, how visible status should be, how directly to push for results.</p>
<h3>Motivation across cultures</h3>
<p>Most motivation theories were developed in Western, individualist settings, so applying them abroad needs care.</p>
<ul>
<li><strong>Needs.</strong> The order of Maslow's needs may differ: in more collectivist settings, belonging and security may weigh more than individual self-actualization.</li>
<li><strong>Rewards.</strong> Individual pay-for-performance fits individualist, achievement-oriented cultures; group bonuses, recognition and job security may motivate more elsewhere.</li>
<li><strong>Meaning of work.</strong> How important work is relative to family, leisure and community varies between societies.</li>
<li><strong>Recognition.</strong> Public praise of one person can embarrass someone in a group-oriented team; private or team recognition may work better.</li>
</ul>
<h3>Practical implications</h3>
<ol>
<li>Keep the universal attributes constant: be honest, fair, reliable and clear about the vision.</li>
<li>Adjust participation and formality to local expectations first; if the organization needs a different style, move towards it gradually and explain why.</li>
<li>Design rewards with local managers, and test assumptions before rolling out a global incentive plan.</li>
</ol>
<div class="callout"><span class="badge">Key lesson</span> There is no single best leadership style across cultures, but there is a common core. Leaders abroad often struggle not for lack of skill but because they apply a home-country style without checking whether it is read the same way.</div>`,
    `<span class="eyebrow">IBC201 · Phần 3 · Bài 3.1</span>
<h2>Lãnh đạo và tạo động lực xuyên văn hoá</h2>
<p class="lead">Thế nào là "nhà lãnh đạo giỏi" vừa có phần phổ quát vừa có phần đặc thù văn hoá. Hành vi được ngưỡng mộ là quyết đoán ở nơi này có thể bị coi là độc đoán ở nơi khác; hành vi được khen là dân chủ có thể bị coi là yếu.</p>
<h3>Lý thuyết lãnh đạo ngầm định được văn hoá tán thành (CLT) của GLOBE</h3>
<p>GLOBE hỏi các nhà quản lý những thuộc tính nào giúp hay cản trở sự lãnh đạo xuất sắc. Câu trả lời được gom thành sáu chiều lãnh đạo toàn cầu:</p>
<table>
<tr><th>Chiều CLT</th><th>Mô tả</th><th>Khuôn mẫu xuyên văn hoá (định tính)</th></tr>
<tr><td>Lôi cuốn / dựa trên giá trị</td><td>Truyền cảm hứng, có tầm nhìn, quyết đoán, định hướng kết quả, chính trực</td><td>Được coi là góp phần vào lãnh đạo xuất sắc ở hầu hết mọi xã hội</td></tr>
<tr><td>Định hướng đội nhóm</td><td>Xây dựng đội, hợp tác, mục đích chung</td><td>Cũng được tán thành rộng rãi</td></tr>
<tr><td>Tham gia</td><td>Để người khác cùng tham gia ra quyết định</td><td>Nhìn chung được tán thành, nhưng mức độ khác nhau đáng kể giữa các cụm</td></tr>
<tr><td>Định hướng nhân văn</td><td>Hỗ trợ, chu đáo, giàu lòng trắc ẩn, rộng lượng</td><td>Được tán thành ở mức vừa; khác nhau giữa các cụm</td></tr>
<tr><td>Tự chủ</td><td>Lãnh đạo độc lập, mang tính cá nhân</td><td>Rất khác nhau; trung tính hoặc hơi tiêu cực ở nhiều cụm</td></tr>
<tr><td>Tự bảo vệ</td><td>Chú trọng địa vị, giữ thể diện, nặng thủ tục, lấy mình làm trung tâm</td><td>Nhìn chung bị coi là cản trở, dù ở một số cụm mức độ nhẹ hơn</td></tr>
</table>
<h3>Thuộc tính phổ quát và thuộc tính tuỳ văn hoá</h3>
<ul>
<li><strong>Tích cực ở mọi nơi</strong> (ví dụ): đáng tin cậy, công bằng, trung thực, có tầm nhìn xa, biết khích lệ, tạo động lực, đáng tin cậy trong công việc, quyết đoán, hướng tới sự xuất sắc, biết xây dựng đội, giải quyết vấn đề theo hướng cùng thắng.</li>
<li><strong>Tiêu cực ở mọi nơi</strong> (ví dụ): đơn độc, khó hoà đồng, không hợp tác, dễ cáu bẳn, không rõ ràng, vị kỷ, tàn nhẫn, độc tài.</li>
<li><strong>Tuỳ văn hoá</strong> (ví dụ): tham vọng, thận trọng, cá nhân chủ nghĩa, chấp nhận rủi ro, coi trọng địa vị, trang trọng — được đánh giá cao ở nền văn hoá này nhưng không ở nền văn hoá khác.</li>
</ul>
<p>Như vậy, nhà quản trị toàn cầu có một <strong>phần lõi</strong> mang theo được mọi nơi — chính trực, tầm nhìn, xây dựng đội — và một <strong>dải</strong> hành vi cần điều chỉnh: dân chủ tới mức nào, địa vị nên thể hiện rõ tới đâu, thúc ép kết quả thẳng thắn tới đâu.</p>
<h3>Tạo động lực xuyên văn hoá</h3>
<p>Phần lớn lý thuyết động lực được phát triển trong bối cảnh phương Tây, đề cao cá nhân, nên khi áp dụng ở nước khác cần thận trọng.</p>
<ul>
<li><strong>Nhu cầu.</strong> Thứ tự các nhu cầu của Maslow có thể khác: ở bối cảnh tập thể hơn, nhu cầu thuộc về và an toàn có thể nặng ký hơn tự thể hiện cá nhân.</li>
<li><strong>Phần thưởng.</strong> Trả lương theo kết quả cá nhân hợp với văn hoá cá nhân, định hướng thành tựu; ở nơi khác, thưởng theo nhóm, sự ghi nhận và ổn định công việc có thể tạo động lực tốt hơn.</li>
<li><strong>Ý nghĩa của công việc.</strong> Tầm quan trọng của công việc so với gia đình, giải trí và cộng đồng khác nhau giữa các xã hội.</li>
<li><strong>Ghi nhận.</strong> Khen một người trước tập thể có thể làm người đó ngượng trong một đội đề cao tập thể; ghi nhận riêng hoặc ghi nhận cả đội có thể hiệu quả hơn.</li>
</ul>
<h3>Hàm ý thực hành</h3>
<ol>
<li>Giữ nguyên các thuộc tính phổ quát: trung thực, công bằng, đáng tin cậy và rõ ràng về tầm nhìn.</li>
<li>Trước hết điều chỉnh mức độ tham gia và tính trang trọng theo kỳ vọng tại chỗ; nếu tổ chức cần một phong cách khác, dịch chuyển dần và giải thích lý do.</li>
<li>Thiết kế chế độ thưởng cùng các nhà quản lý địa phương, và kiểm chứng giả định trước khi triển khai một kế hoạch khuyến khích toàn cầu.</li>
</ol>
<div class="callout"><span class="badge">Bài học chính</span> Không có một phong cách lãnh đạo tốt nhất cho mọi nền văn hoá, nhưng có một phần lõi chung. Nhà lãnh đạo ở nước ngoài thường gặp khó không phải vì thiếu kỹ năng, mà vì áp phong cách của nước mình mà không kiểm tra xem nó có được hiểu theo cùng một cách hay không.</div>`,
  ]]);

const c8 = doc('ibc201-3-2-international-hrm', '3.2 — International HRM: staffing and the expatriate cycle|||3.2 — Quản trị nhân sự quốc tế: bố trí nhân sự và chu trình nhân viên biệt phái',
  'Bốn định hướng bố trí nhân sự EPRG của Perlmutter (vị chủng, đa tâm, vùng tâm, địa tâm) với PCN, HCN, TCN; lý do biệt phái và nguyên nhân thất bại; chu trình nhân viên biệt phái: tuyển chọn, đào tạo theo mức độ chuyên sâu, hỗ trợ, đãi ngộ theo cách tiếp cận bảng cân đối, hồi hương; các phương án thay thế.',
  [[
    `<span class="eyebrow">IBC201 · Part 3 · Lesson 3.2</span>
<h2>International HRM: staffing and the expatriate cycle</h2>
<h3>Staffing orientations: EPRG</h3>
<p>Howard Perlmutter described how multinationals think about headquarters and subsidiaries; the regiocentric orientation was added later in work with David Heenan. The orientation shapes who fills the key jobs.</p>
<table>
<tr><th>Orientation</th><th>Mindset</th><th>Key positions filled by</th><th>Advantages / drawbacks</th></tr>
<tr><td>Ethnocentric</td><td>Home-country ways are best</td><td>Parent-country nationals (PCNs)</td><td>Control and consistency / little local insight; local talent is blocked</td></tr>
<tr><td>Polycentric</td><td>Each country is different; let locals run it</td><td>Host-country nationals (HCNs) in subsidiaries; PCNs at headquarters</td><td>Local knowledge, lower cost / weak integration; a ceiling for local managers</td></tr>
<tr><td>Regiocentric</td><td>Manage by region</td><td>Managers from within the region</td><td>Regional synergies / regions can become silos</td></tr>
<tr><td>Geocentric (global)</td><td>The best person, whatever the nationality</td><td>PCNs, HCNs and third-country nationals (TCNs)</td><td>A global talent pool and mindset / costly and complex (visas, pay, relocation)</td></tr>
</table>
<h3>Why send expatriates — and why assignments fail</h3>
<p>Companies send expatriates to fill skill gaps, transfer knowledge and corporate culture, coordinate and control subsidiaries, and develop global managers. Assignments are expensive and can "fail" through early return, poor performance or the employee leaving soon after coming home. Frequently cited causes include the <strong>inability of the spouse or family to adjust</strong> (highlighted in Rosalie Tung's classic studies), the manager's own difficulty in adapting, weak preparation, and selection based only on technical skill.</p>
<h3>The expatriate cycle</h3>
<ol>
<li><strong>Selection</strong> — technical and managerial competence <em>plus</em> cross-cultural adaptability (openness, emotional stability, CQ), the family situation and its willingness to move, and language ability.</li>
<li><strong>Preparation and training</strong> — from low-rigour, information-giving methods (briefings, area studies, reading), through moderate ones (culture assimilators built on critical incidents, role-plays, language classes), to high-rigour, experiential methods (field visits, simulations, intensive language immersion). Rigour should increase with cultural distance, the length of the assignment and how much the person must interact with locals.</li>
<li><strong>Support during the assignment</strong> — a host-country mentor, a home-country sponsor, support for the family, and performance appraisal that includes input from local colleagues.</li>
<li><strong>Compensation</strong> — commonly the <em>balance-sheet approach</em>: keep the home-country standard of living through base pay plus allowances (cost of living, housing, hardship, children's education) and tax equalization.</li>
<li><strong>Repatriation</strong> — returning managers face reverse culture shock, a job with less autonomy, and a feeling that their new knowledge is ignored; many companies lose returnees for these reasons. Good practice: plan the return job early, keep a home sponsor, run a debrief to capture knowledge, and support the family.</li>
</ol>
<h3>Alternatives to long assignments</h3>
<p>Short-term assignments, frequent business travel, commuter arrangements, <strong>inpatriates</strong> (subsidiary managers brought to headquarters) and global virtual teams (Lesson 2.3) can transfer knowledge at lower cost and with less disruption to families.</p>
<div class="callout"><span class="badge">Watch out</span> The most technically brilliant candidate is not automatically the best expatriate. Adaptability and family readiness predict success abroad, and selection and repatriation are where many programmes are weakest.</div>`,
    `<span class="eyebrow">IBC201 · Phần 3 · Bài 3.2</span>
<h2>Quản trị nhân sự quốc tế: bố trí nhân sự và chu trình nhân viên biệt phái</h2>
<h3>Định hướng bố trí nhân sự: EPRG</h3>
<p>Howard Perlmutter mô tả cách các công ty đa quốc gia nhìn nhận quan hệ giữa trụ sở chính và công ty con; định hướng vùng tâm được bổ sung sau trong nghiên cứu cùng David Heenan. Định hướng này quyết định ai nắm giữ các vị trí then chốt.</p>
<table>
<tr><th>Định hướng</th><th>Tư duy</th><th>Vị trí then chốt do ai nắm</th><th>Ưu điểm / nhược điểm</th></tr>
<tr><td>Vị chủng (Ethnocentric)</td><td>Cách làm của nước mẹ là tốt nhất</td><td>Nhân viên mang quốc tịch nước mẹ (PCN)</td><td>Kiểm soát và nhất quán / ít hiểu biết địa phương; nhân tài địa phương bị chặn đường thăng tiến</td></tr>
<tr><td>Đa tâm (Polycentric)</td><td>Mỗi nước một khác; hãy để người địa phương điều hành</td><td>Nhân viên nước sở tại (HCN) ở công ty con; PCN ở trụ sở chính</td><td>Hiểu biết địa phương, chi phí thấp hơn / hội nhập yếu; nhà quản lý địa phương bị giới hạn thăng tiến</td></tr>
<tr><td>Vùng tâm (Regiocentric)</td><td>Quản lý theo khu vực</td><td>Nhà quản lý đến từ trong khu vực</td><td>Cộng hưởng trong khu vực / các khu vực có thể thành "ốc đảo"</td></tr>
<tr><td>Địa tâm (Geocentric, toàn cầu)</td><td>Chọn người giỏi nhất, bất kể quốc tịch</td><td>PCN, HCN và nhân viên nước thứ ba (TCN)</td><td>Nguồn nhân tài và tư duy toàn cầu / tốn kém và phức tạp (thị thực, lương, di chuyển)</td></tr>
</table>
<h3>Vì sao cử nhân viên biệt phái — và vì sao nhiệm kỳ thất bại</h3>
<p>Doanh nghiệp cử nhân viên biệt phái (expatriate) để lấp khoảng trống kỹ năng, chuyển giao tri thức và văn hoá doanh nghiệp, điều phối và kiểm soát công ty con, và phát triển nhà quản lý toàn cầu. Nhiệm kỳ biệt phái rất tốn kém và có thể "thất bại" do về nước sớm, làm việc kém hiệu quả hoặc nhân viên nghỉ việc ngay sau khi về. Các nguyên nhân hay được nhắc tới gồm <strong>vợ/chồng hoặc gia đình không thích nghi được</strong> (được nhấn mạnh trong các nghiên cứu kinh điển của Rosalie Tung), khó khăn thích nghi của chính nhà quản lý, chuẩn bị sơ sài và tuyển chọn chỉ dựa trên kỹ năng chuyên môn.</p>
<h3>Chu trình nhân viên biệt phái</h3>
<ol>
<li><strong>Tuyển chọn</strong> — năng lực chuyên môn và quản lý <em>cộng với</em> khả năng thích nghi liên văn hoá (cởi mở, ổn định cảm xúc, CQ), hoàn cảnh gia đình và mức sẵn sàng chuyển đi, khả năng ngoại ngữ.</li>
<li><strong>Chuẩn bị và đào tạo</strong> — từ các phương pháp ít chuyên sâu, cung cấp thông tin (buổi giới thiệu, nghiên cứu khu vực, tài liệu đọc), qua mức vừa (bài tập đồng hoá văn hoá dựa trên các sự cố điển hình, đóng vai, lớp ngoại ngữ), tới các phương pháp chuyên sâu, trải nghiệm (chuyến khảo sát thực địa, mô phỏng, học ngoại ngữ chuyên sâu). Mức chuyên sâu nên tăng theo khoảng cách văn hoá, độ dài nhiệm kỳ và mức độ phải tương tác với người địa phương.</li>
<li><strong>Hỗ trợ trong nhiệm kỳ</strong> — người hướng dẫn ở nước sở tại, người bảo trợ ở nước nhà, hỗ trợ cho gia đình, và đánh giá hiệu quả có lấy ý kiến của đồng nghiệp tại chỗ.</li>
<li><strong>Đãi ngộ</strong> — thường theo <em>cách tiếp cận bảng cân đối</em>: giữ mức sống như ở nước nhà bằng lương cơ bản cộng các khoản phụ cấp (sinh hoạt phí, nhà ở, điều kiện khó khăn, học phí cho con) và cân bằng thuế.</li>
<li><strong>Hồi hương</strong> — nhà quản lý trở về đối mặt với cú sốc văn hoá ngược, một vị trí ít quyền tự chủ hơn và cảm giác tri thức mới của mình bị bỏ phí; nhiều công ty mất người trở về vì những lý do này. Thực hành tốt: lên kế hoạch cho vị trí khi về từ sớm, duy trì người bảo trợ ở nước nhà, tổ chức buổi rút kinh nghiệm để thu nhận tri thức, và hỗ trợ gia đình.</li>
</ol>
<h3>Phương án thay thế cho nhiệm kỳ dài</h3>
<p>Biệt phái ngắn hạn, công tác thường xuyên, đi về định kỳ, <strong>nhân viên "biệt phái ngược"</strong> (inpatriate — nhà quản lý công ty con được đưa về trụ sở chính) và đội ảo toàn cầu (Bài 2.3) có thể chuyển giao tri thức với chi phí thấp hơn và ít xáo trộn cho gia đình hơn.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Ứng viên giỏi chuyên môn nhất không mặc nhiên là người biệt phái tốt nhất. Khả năng thích nghi và sự sẵn sàng của gia đình mới dự báo thành công ở nước ngoài, và tuyển chọn cùng hồi hương là hai khâu mà nhiều chương trình yếu nhất.</div>`,
  ]]);

const c9 = doc('ibc201-3-3-international-ethics', '3.3 — Ethics and social responsibility across borders|||3.3 — Đạo đức và trách nhiệm xã hội xuyên biên giới',
  'Tương đối luận và phổ quát luận đạo đức, chủ nghĩa đế quốc đạo đức, ba nguyên tắc của Donaldson và siêu chuẩn mực, các thế lưỡng nan điển hình, nguyên tắc chung của luật chống hối lộ (FCPA, UK Bribery Act, Công ước OECD, UNCAC, pháp luật Việt Nam — kiểm văn bản đang có hiệu lực), phép thử quà tặng, trách nhiệm xã hội và UN Global Compact.',
  [[
    `<span class="eyebrow">IBC201 · Part 3 · Lesson 3.3</span>
<h2>Ethics and social responsibility across borders</h2>
<h3>Relativism versus universalism</h3>
<p>When home and host standards differ, managers face a basic question: whose ethics apply?</p>
<table>
<tr><th>Position</th><th>Claim</th><th>Risk</th></tr>
<tr><td>Ethical relativism</td><td>What is right depends on the local culture: "when in Rome, do as the Romans do"</td><td>Can excuse practices that harm people (unsafe work, bribery) because they are "local"</td></tr>
<tr><td>Ethical universalism</td><td>Some basic principles apply everywhere</td><td>Pushed too far it becomes <strong>ethical imperialism</strong>: imposing every home rule abroad and disrespecting legitimate local practices</td></tr>
</table>
<p>A widely taught middle path, from Thomas Donaldson, rests on three principles: respect <strong>core human values</strong> that set a minimum floor everywhere (human dignity, basic rights, good citizenship); respect <strong>local traditions</strong> where they stay above that floor (for example modest gift-giving customs); and accept that <strong>context matters</strong> when deciding what is right. The integrative social contracts theory of Donaldson and Thomas Dunfee expresses a similar idea: universal <strong>hypernorms</strong> limit the range of acceptable local norms.</p>
<h3>Typical dilemmas</h3>
<ul>
<li>Gifts and hospitality versus bribes.</li>
<li>Labour standards and safety in the supply chain.</li>
<li>Environmental standards lower than those at home.</li>
<li>Human rights, privacy and requests for data from authorities.</li>
<li>Tax and transfer-pricing arrangements that are legal but controversial.</li>
</ul>
<h3>Corruption and anti-bribery rules (general principles)</h3>
<ul>
<li>The United States <strong>Foreign Corrupt Practices Act</strong> (FCPA, 1977) prohibits bribing foreign officials to obtain or keep business, and requires companies listed in the US (issuers) to keep accurate books and records and adequate internal controls. It contains a narrow exception for "facilitating payments" for routine government actions — an exception that many companies nevertheless ban in their own policies. US enforcement priorities under the FCPA change over time, so check current official guidance.</li>
<li>The <strong>UK Bribery Act 2010</strong> covers bribery of public officials and of private persons, makes it an offence for a commercial organization to fail to prevent bribery by people acting for it, and has no exception for facilitation payments.</li>
<li>The <strong>OECD Anti-Bribery Convention</strong> commits its parties to make bribery of foreign public officials a crime; the <strong>United Nations Convention against Corruption (UNCAC)</strong> is the broadest global treaty on corruption.</li>
<li><strong>Vietnam</strong> has a law on anti-corruption and criminal-code offences of giving and receiving bribes, and is a party to UNCAC. Scope and thresholds change over time — always check the legal texts currently in force and your company's policy.</li>
</ul>
<p>These laws can reach a company's agents, distributors and joint-venture partners, so due diligence on third parties is essential.</p>
<h3>A practical test for gifts and payments</h3>
<ol>
<li>Is it legal under local law <em>and</em> under the laws that bind your company?</li>
<li>Is it transparent — could it be recorded accurately and disclosed?</li>
<li>Is it proportionate — modest, customary and not linked to a pending decision?</li>
<li>Would you be comfortable seeing it reported in the news?</li>
</ol>
<h3>Corporate social responsibility abroad</h3>
<p>Beyond compliance, multinationals are expected to consider stakeholders in every country where they operate: employees, communities, suppliers and the environment. Voluntary frameworks such as the <strong>UN Global Compact</strong> — ten principles on human rights, labour, the environment and anti-corruption — provide a shared reference.</p>
<div class="callout"><span class="badge">Key lesson</span> Respecting cultural difference does not mean accepting everything. Adapt freely on etiquette; hold firm on core values and the law — and build processes (gift registers, third-party checks, speak-up channels) so employees are not left alone with the dilemma.</div>`,
    `<span class="eyebrow">IBC201 · Phần 3 · Bài 3.3</span>
<h2>Đạo đức và trách nhiệm xã hội xuyên biên giới</h2>
<h3>Tương đối luận và phổ quát luận</h3>
<p>Khi chuẩn mực ở nước nhà và nước sở tại khác nhau, nhà quản trị đứng trước một câu hỏi cơ bản: áp dụng đạo đức của ai?</p>
<table>
<tr><th>Quan điểm</th><th>Luận điểm</th><th>Rủi ro</th></tr>
<tr><td>Tương đối luận đạo đức</td><td>Đúng hay sai tuỳ vào văn hoá địa phương: "nhập gia tuỳ tục"</td><td>Có thể biện minh cho những thực hành gây hại (điều kiện làm việc không an toàn, hối lộ) vì chúng là "chuyện địa phương"</td></tr>
<tr><td>Phổ quát luận đạo đức</td><td>Một số nguyên tắc cơ bản áp dụng ở mọi nơi</td><td>Đẩy quá xa thì thành <strong>chủ nghĩa đế quốc đạo đức</strong>: áp mọi quy tắc của nước nhà ra nước ngoài và coi thường những thực hành chính đáng của địa phương</td></tr>
</table>
<p>Một con đường trung dung được giảng dạy rộng rãi, của Thomas Donaldson, dựa trên ba nguyên tắc: tôn trọng <strong>các giá trị con người cốt lõi</strong> tạo thành mức sàn tối thiểu ở mọi nơi (phẩm giá con người, các quyền cơ bản, tư cách công dân tốt); tôn trọng <strong>truyền thống địa phương</strong> khi chúng vẫn nằm trên mức sàn đó (ví dụ phong tục tặng quà khiêm tốn); và chấp nhận rằng <strong>bối cảnh có ý nghĩa</strong> khi phân định đúng sai. Lý thuyết khế ước xã hội tích hợp của Donaldson và Thomas Dunfee diễn đạt ý tương tự: các <strong>siêu chuẩn mực</strong> (hypernorms) phổ quát giới hạn phạm vi những chuẩn mực địa phương có thể chấp nhận.</p>
<h3>Các thế lưỡng nan điển hình</h3>
<ul>
<li>Quà tặng và tiếp khách so với hối lộ.</li>
<li>Tiêu chuẩn lao động và an toàn trong chuỗi cung ứng.</li>
<li>Tiêu chuẩn môi trường ở nước sở tại thấp hơn so với ở nước nhà.</li>
<li>Quyền con người, quyền riêng tư và yêu cầu cung cấp dữ liệu từ cơ quan chức năng.</li>
<li>Các thu xếp về thuế và giá chuyển nhượng hợp pháp nhưng gây tranh cãi.</li>
</ul>
<h3>Tham nhũng và luật chống hối lộ (nguyên tắc chung)</h3>
<ul>
<li><strong>Đạo luật Chống tham nhũng ở nước ngoài</strong> của Hoa Kỳ (FCPA, 1977) cấm hối lộ quan chức nước ngoài để có được hoặc giữ hoạt động kinh doanh, và yêu cầu các công ty niêm yết tại Hoa Kỳ (issuers) giữ sổ sách, hồ sơ chính xác và có hệ thống kiểm soát nội bộ phù hợp. Luật có một ngoại lệ hẹp cho "khoản thanh toán tạo thuận lợi" đối với các thủ tục hành chính thông thường — ngoại lệ mà nhiều công ty vẫn cấm trong chính sách nội bộ. Ưu tiên thực thi FCPA của Hoa Kỳ thay đổi theo thời gian, nên hãy kiểm hướng dẫn chính thức hiện hành.</li>
<li><strong>Đạo luật Chống hối lộ 2010 của Anh</strong> (UK Bribery Act) bao trùm hối lộ công chức lẫn hối lộ trong khu vực tư, quy định tội danh đối với tổ chức thương mại không ngăn chặn được hành vi hối lộ của người hành động thay mặt mình, và không có ngoại lệ cho khoản thanh toán tạo thuận lợi.</li>
<li><strong>Công ước Chống hối lộ của OECD</strong> buộc các bên thành viên hình sự hoá hành vi hối lộ công chức nước ngoài; <strong>Công ước Liên hợp quốc về chống tham nhũng (UNCAC)</strong> là điều ước toàn cầu rộng nhất về tham nhũng.</li>
<li><strong>Việt Nam</strong> có Luật Phòng, chống tham nhũng và các tội đưa hối lộ, nhận hối lộ trong Bộ luật Hình sự, và là thành viên của UNCAC. Phạm vi và ngưỡng áp dụng thay đổi theo thời gian — luôn kiểm văn bản pháp luật đang có hiệu lực và chính sách của công ty bạn.</li>
</ul>
<p>Các luật này có thể với tới đại lý, nhà phân phối và đối tác liên doanh của công ty, nên thẩm định bên thứ ba là việc bắt buộc.</p>
<h3>Phép thử thực hành cho quà tặng và khoản chi</h3>
<ol>
<li>Có hợp pháp theo luật địa phương <em>và</em> theo các luật mà công ty bạn phải tuân thủ không?</li>
<li>Có minh bạch không — có thể ghi sổ chính xác và công khai được không?</li>
<li>Có tương xứng không — khiêm tốn, theo phong tục và không gắn với một quyết định đang chờ?</li>
<li>Bạn có thấy thoải mái nếu nó xuất hiện trên báo không?</li>
</ol>
<h3>Trách nhiệm xã hội ở nước ngoài</h3>
<p>Ngoài tuân thủ pháp luật, các công ty đa quốc gia được kỳ vọng quan tâm tới các bên liên quan ở mọi nước mình hoạt động: người lao động, cộng đồng, nhà cung cấp và môi trường. Các khung tự nguyện như <strong>Hiệp ước Toàn cầu của Liên hợp quốc</strong> (UN Global Compact) — mười nguyên tắc về quyền con người, lao động, môi trường và chống tham nhũng — tạo ra một điểm tham chiếu chung.</p>
<div class="callout"><span class="badge">Bài học chính</span> Tôn trọng khác biệt văn hoá không có nghĩa là chấp nhận mọi thứ. Linh hoạt thoải mái về nghi thức; giữ vững giá trị cốt lõi và pháp luật — và xây dựng quy trình (sổ đăng ký quà tặng, thẩm định bên thứ ba, kênh lên tiếng) để nhân viên không phải một mình đối mặt với thế lưỡng nan.</div>`,
  ]]);

const c9q = quiz('ibc201-quiz-3', 'Quiz 3 — Leading, staffing and ethics|||Quiz 3 — Lãnh đạo, nhân sự và đạo đức', [
  { id: 'q1', question: 'A multinational lets host-country nationals manage its subsidiaries, while headquarters positions are held by parent-country nationals. Which EPRG orientation is this?|||Một công ty đa quốc gia để nhân viên nước sở tại quản lý các công ty con, còn các vị trí ở trụ sở chính do nhân viên mang quốc tịch nước mẹ nắm giữ. Đây là định hướng EPRG nào?', options: ['Ethnocentric|||Vị chủng', 'Polycentric|||Đa tâm', 'Regiocentric|||Vùng tâm', 'Geocentric|||Địa tâm'], correctIndex: 1, explanation: 'Polycentric firms treat each country as different and let locals run it, but key headquarters jobs usually stay with PCNs.|||Công ty đa tâm coi mỗi nước một khác và để người địa phương điều hành, nhưng các vị trí then chốt ở trụ sở chính thường vẫn do PCN nắm.' },
  { id: 'q2', question: 'According to GLOBE, which leader attribute is seen as hindering outstanding leadership in virtually all cultures?|||Theo GLOBE, thuộc tính nào của nhà lãnh đạo bị coi là cản trở lãnh đạo xuất sắc ở hầu hết mọi nền văn hoá?', options: ['Honest|||Trung thực', 'Decisive|||Quyết đoán', 'Ruthless|||Tàn nhẫn', 'Status-conscious|||Coi trọng địa vị'], correctIndex: 2, explanation: 'Ruthless is among the universally negative attributes; honest and decisive are universally positive; status-conscious is culturally contingent.|||Tàn nhẫn thuộc nhóm tiêu cực ở mọi nơi; trung thực và quyết đoán tích cực ở mọi nơi; coi trọng địa vị là thuộc tính tuỳ văn hoá.' },
  { id: 'q3', question: 'Which statement about anti-bribery rules is accurate?|||Nhận định nào về luật chống hối lộ là chính xác?', options: ['The UK Bribery Act 2010 has no exception for facilitation payments|||Đạo luật Chống hối lộ 2010 của Anh không có ngoại lệ cho khoản thanh toán tạo thuận lợi', 'The FCPA only applies to bribes paid inside the United States|||FCPA chỉ áp dụng cho hối lộ xảy ra trong lãnh thổ Hoa Kỳ', 'A gift is always acceptable if it is customary locally|||Quà tặng luôn chấp nhận được nếu hợp phong tục địa phương', 'Anti-bribery laws never reach a company’s agents or distributors|||Luật chống hối lộ không bao giờ với tới đại lý hay nhà phân phối của công ty'], correctIndex: 0, explanation: 'Unlike the FCPA, which has a narrow exception for facilitating payments to foreign officials for routine governmental actions, the UK Bribery Act has no such exception; both laws can reach third parties acting for the company.|||Khác với FCPA — vốn có ngoại lệ hẹp cho khoản thanh toán tạo thuận lợi trả cho quan chức nước ngoài để làm các thủ tục hành chính thông thường — luật của Anh không có ngoại lệ này; cả hai luật đều có thể với tới bên thứ ba hành động thay mặt công ty.' },
]);

const c10 = doc('ibc201-4-1-distributive-bargaining', '4.1 — Distributive bargaining: claiming value|||4.1 — Đàm phán phân phối: giành phần giá trị',
  'Điểm mục tiêu, điểm kháng cự, đề nghị mở đầu, BATNA và vùng thoả thuận (ZOPA) như một hệ thống lập kế hoạch; vùng thương lượng dương và âm có ví dụ số; bốn chiến lược phân phối; đề nghị đầu tiên và hiệu ứng neo; khuôn mẫu nhượng bộ và cách kết thúc; nhận diện chiến thuật cứng rắn.',
  [[
    `<span class="eyebrow">IBC201 · Part 4 · Lesson 4.1</span>
<h2>Distributive bargaining: claiming value</h2>
<p class="lead">In a distributive (win–lose) situation, the parties divide a fixed amount of value — typically the price. What one side gains, the other gives up. OBE102c introduced BATNA and ZOPA; here we use them as a complete planning system.</p>
<h3>The key points</h3>
<table>
<tr><th>Point</th><th>Meaning</th></tr>
<tr><td>Target point</td><td>The outcome you realistically hope to achieve</td></tr>
<tr><td>Resistance (reservation) point</td><td>Your walk-away point — the worst deal you would still accept</td></tr>
<tr><td>Opening offer (asking price)</td><td>Where you start; usually beyond your target</td></tr>
<tr><td>BATNA</td><td>Best alternative to a negotiated agreement — what you will do if there is no deal (Fisher and Ury)</td></tr>
<tr><td>Bargaining range / ZOPA</td><td>The span between the two resistance points; a deal is possible only inside it</td></tr>
</table>
<p>Your resistance point should be anchored in your BATNA: never accept a deal worse than your best alternative. A stronger BATNA moves your resistance point in your favour (up for a seller, down for a buyer) and gives you more bargaining power.</p>
<h3>An illustration (a fictional case, illustrative numbers)</h3>
<pre><code class="language-text">A hotel buys a booking-software licence (USD thousand per year)
Buyer target 65 . . Vendor RP 70 ======== Buyer RP 85 . . Vendor target 90
                              |---- ZOPA 70-85 ----|   width = 85 - 70 = 15
Positive bargaining zone: vendor RP 70 &lt; buyer RP 85  → a deal is possible
If the vendor's RP were 88: 88 &gt; 85 → negative zone (gap 3) → no deal,
                            unless the parties change the issues on the table</code></pre>
<h3>Four strategies in distributive bargaining</h3>
<ol>
<li>Push for a settlement close to the other side's resistance point.</li>
<li>Convince the other side to move its resistance point — for example by changing how it values the deal or its alternatives.</li>
<li>If the zone is negative, persuade the other side to change its resistance point, reconsider your own, or add issues so that a zone appears.</li>
<li>Convince the other side that this settlement is the best it can get.</li>
</ol>
<p>To do this, negotiators assess the other side's values and its costs of ending the talks, manage the impression they give of their own limits, and influence the other side's perceptions — within ethical limits (Lesson 4.2).</p>
<h3>Opening offers and anchoring</h3>
<p>The first number tends to act as an <strong>anchor</strong>: later offers are adjusted from it, usually not far enough. Experimental work (for example by Adam Galinsky and Thomas Mussweiler) finds that first offers are strongly related to final outcomes, especially when the value of the item is uncertain. Practical guidance:</p>
<ul>
<li>Make the first offer when you are well informed about the likely ZOPA; if you are not, let the other side speak first and gather information.</li>
<li>Open ambitiously but <strong>justifiably</strong> — support the number with criteria (market data, quality, delivery record). An offer that seems absurd damages your credibility and the relationship.</li>
<li>If the other side anchors first and aggressively, do not counter right next to it: say it is unrealistic, refocus on your own target and criteria, and re-anchor with your own well-supported number.</li>
</ul>
<h3>Concessions and closing</h3>
<p>Concessions are expected; a party that never moves is seen as unreasonable. The <strong>pattern</strong> sends a signal: successively smaller concessions (for example 56 → 52 → 50 → 49, steps of 4, 2 and 1) tell the other side you are approaching your limit. Label each concession and ask for something in return. Closing tactics include offering alternative packages, summarizing and assuming the close, splitting the difference (which favours whoever anchored better), and adding a small sweetener to finish.</p>
<h3>Hardball tactics — recognize them</h3>
<p>Good cop / bad cop; an extreme highball or lowball offer; the bogey (pretending an unimportant issue is vital in order to trade it later); the nibble (a small extra demand at the last minute); chicken (threats to force a concession); and intimidation. Responses: ignore the tactic, discuss it openly ("this looks like a tactic — can we return to criteria?"), respond in kind only with great care, or co-opt the other side into joint problem-solving.</p>
<div class="callout"><span class="badge">Remember</span> Prepare three numbers before any bargaining — your BATNA-based resistance point, your target and your justified opening — then estimate the same three for the other side.</div>`,
    `<span class="eyebrow">IBC201 · Phần 4 · Bài 4.1</span>
<h2>Đàm phán phân phối: giành phần giá trị</h2>
<p class="lead">Trong tình huống phân phối (thắng – thua), các bên chia nhau một lượng giá trị cố định — thường là giá. Bên này được thêm bao nhiêu thì bên kia mất bấy nhiêu. OBE102c đã giới thiệu BATNA và ZOPA; ở đây ta dùng chúng như một hệ thống lập kế hoạch hoàn chỉnh.</p>
<h3>Các điểm then chốt</h3>
<table>
<tr><th>Điểm</th><th>Ý nghĩa</th></tr>
<tr><td>Điểm mục tiêu</td><td>Kết quả bạn hy vọng một cách thực tế sẽ đạt được</td></tr>
<tr><td>Điểm kháng cự (điểm bảo lưu)</td><td>Điểm bỏ bàn đàm phán — thoả thuận tệ nhất bạn vẫn chấp nhận</td></tr>
<tr><td>Đề nghị mở đầu (giá chào)</td><td>Nơi bạn bắt đầu; thường vượt quá điểm mục tiêu</td></tr>
<tr><td>BATNA</td><td>Phương án thay thế tốt nhất cho một thoả thuận đàm phán — điều bạn sẽ làm nếu không đạt thoả thuận (Fisher và Ury)</td></tr>
<tr><td>Vùng thương lượng / ZOPA</td><td>Khoảng giữa hai điểm kháng cự; chỉ có thể đạt thoả thuận bên trong khoảng này</td></tr>
</table>
<p>Điểm kháng cự nên được neo vào BATNA: không bao giờ chấp nhận một thoả thuận tệ hơn phương án thay thế tốt nhất của mình. BATNA càng mạnh thì điểm kháng cự càng dịch về phía có lợi cho bạn (lên với bên bán, xuống với bên mua) và quyền lực thương lượng càng lớn.</p>
<h3>Minh hoạ (tình huống giả định, số liệu minh hoạ giả định)</h3>
<pre><code class="language-text">Một khách sạn mua bản quyền phần mềm đặt phòng (nghìn USD mỗi năm)
Mục tiêu bên mua 65 . . KC bên bán 70 ======== KC bên mua 85 . . Mục tiêu bên bán 90
                                   |----- ZOPA 70-85 -----|   độ rộng = 85 - 70 = 15
Vùng thương lượng dương: KC bên bán 70 &lt; KC bên mua 85  → có thể đạt thoả thuận
Nếu KC bên bán là 88: 88 &gt; 85 → vùng âm (khoảng hở 3) → không có thoả thuận,
                      trừ khi các bên thay đổi các vấn đề đưa lên bàn
(KC = điểm kháng cự)</code></pre>
<h3>Bốn chiến lược trong đàm phán phân phối</h3>
<ol>
<li>Thúc đẩy một thoả thuận gần điểm kháng cự của bên kia.</li>
<li>Thuyết phục bên kia dịch chuyển điểm kháng cự — ví dụ bằng cách thay đổi cách họ định giá thương vụ hoặc các phương án thay thế của họ.</li>
<li>Nếu vùng thương lượng âm, thuyết phục bên kia đổi điểm kháng cự, xem lại điểm của chính mình, hoặc thêm vấn đề để một vùng thoả thuận xuất hiện.</li>
<li>Thuyết phục bên kia rằng thoả thuận này là tốt nhất họ có thể có.</li>
</ol>
<p>Để làm vậy, nhà đàm phán ước lượng giá trị của bên kia và chi phí nếu bên kia dừng đàm phán, quản lý ấn tượng về giới hạn của chính mình, và tác động tới nhận thức của bên kia — trong khuôn khổ đạo đức (Bài 4.2).</p>
<h3>Đề nghị mở đầu và hiệu ứng neo</h3>
<p>Con số đầu tiên thường đóng vai trò <strong>mỏ neo</strong>: các đề nghị sau được điều chỉnh từ nó, và thường điều chỉnh chưa đủ xa. Các thí nghiệm (ví dụ của Adam Galinsky và Thomas Mussweiler) cho thấy đề nghị đầu tiên liên hệ chặt với kết quả cuối cùng, nhất là khi giá trị của món hàng không chắc chắn. Hướng dẫn thực hành:</p>
<ul>
<li>Đưa ra đề nghị đầu tiên khi bạn nắm rõ ZOPA có thể có; nếu chưa, hãy để bên kia nói trước và thu thập thông tin.</li>
<li>Mở đầu tham vọng nhưng <strong>có căn cứ</strong> — dựa con số vào tiêu chí (dữ liệu thị trường, chất lượng, lịch sử giao hàng). Một đề nghị có vẻ vô lý làm hỏng uy tín của bạn và mối quan hệ.</li>
<li>Nếu bên kia neo trước và rất gắt, đừng đưa đề nghị ngược sát bên cạnh: nói rõ con số đó không thực tế, quay về mục tiêu và tiêu chí của mình, và neo lại bằng một con số có căn cứ của bạn.</li>
</ul>
<h3>Nhượng bộ và kết thúc</h3>
<p>Nhượng bộ là điều được chờ đợi; một bên không bao giờ nhúc nhích bị coi là thiếu hợp lý. <strong>Khuôn mẫu</strong> nhượng bộ phát đi tín hiệu: các bước nhượng nhỏ dần (ví dụ 56 → 52 → 50 → 49, tức các bước 4, 2 và 1) cho bên kia biết bạn đang tiến gần giới hạn. Gọi tên từng nhượng bộ và đòi lại một điều gì đó. Các chiến thuật kết thúc gồm đưa ra các gói phương án thay thế, tóm tắt và coi như đã chốt, chia đôi khoảng cách (có lợi cho bên neo tốt hơn), và thêm một "phần ngọt" nhỏ để khép lại.</p>
<h3>Chiến thuật cứng rắn — nhận diện chúng</h3>
<p>Người tốt / kẻ xấu; đề nghị quá cao hoặc quá thấp; "con ngáo ộp" (bogey — giả vờ một vấn đề không quan trọng là rất quan trọng để đem ra đổi sau); "rỉa thêm" (nibble — đòi thêm một điều nhỏ vào phút chót); "thách thức ai lùi trước" (chicken — đe doạ để ép nhượng bộ); và đe nẹt. Cách đối phó: phớt lờ chiến thuật, nói thẳng về nó ("có vẻ đây là một chiến thuật — ta quay lại tiêu chí được không?"), đáp trả tương tự chỉ khi hết sức cẩn trọng, hoặc lôi kéo bên kia vào cùng giải quyết vấn đề.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Chuẩn bị ba con số trước mọi cuộc mặc cả — điểm kháng cự dựa trên BATNA, điểm mục tiêu và đề nghị mở đầu có căn cứ — rồi ước lượng ba con số tương ứng của bên kia.</div>`,
  ]]);

const c11 = doc('ibc201-4-2-cognition-ethics', '4.2 — Negotiator cognition and ethics|||4.2 — Nhận thức và đạo đức của nhà đàm phán',
  'Mười hai thiên kiến nhận thức thường gặp trong đàm phán kèm cách khắc phục, tác động của văn hoá lên quy kết; bốn cách tiếp cận lập luận đạo đức, các nhóm chiến thuật đạo đức mập mờ, ranh giới giữa không tiết lộ và lừa dối, cách xử lý khi nghi bị lừa.',
  [[
    `<span class="eyebrow">IBC201 · Part 4 · Lesson 4.2</span>
<h2>Negotiator cognition and ethics</h2>
<h3>Thinking traps in negotiation</h3>
<p>Negotiators are not perfectly rational. Lewicki, Saunders and Barry summarize common cognitive biases:</p>
<table>
<tr><th>Bias</th><th>What happens</th><th>Antidote</th></tr>
<tr><td>Irrational escalation of commitment</td><td>Sticking to a failing course because of what has already been invested</td><td>Set limits in advance; ask someone else to review</td></tr>
<tr><td>Mythical fixed-pie belief</td><td>Assuming every issue is win–lose</td><td>Ask about interests and priorities; look for trades</td></tr>
<tr><td>Anchoring and adjustment</td><td>Being pulled by an initial number</td><td>Set your own target and criteria before hearing theirs</td></tr>
<tr><td>Issue framing and risk</td><td>Framed as losses, people take more risks; framed as gains, they become cautious (prospect theory)</td><td>Reframe offers; look at both frames</td></tr>
<tr><td>Availability of information</td><td>Overweighting vivid or easily recalled information</td><td>Use data, not anecdotes</td></tr>
<tr><td>The winner's curse</td><td>Getting a quick "yes" and then feeling you could have done better — or that something is wrong</td><td>Research the value beforehand</td></tr>
<tr><td>Overconfidence</td><td>Overestimating your chances or the accuracy of your judgement</td><td>Look for evidence that you are wrong</td></tr>
<tr><td>Law of small numbers</td><td>Drawing conclusions from a few past cases</td><td>Look at larger samples</td></tr>
<tr><td>Self-serving biases</td><td>Crediting your successes to yourself and the other side's behaviour to its character</td><td>Consider situational explanations</td></tr>
<tr><td>Endowment effect</td><td>Valuing what you own more than you would pay for it</td><td>Use market references</td></tr>
<tr><td>Ignoring others' cognitions</td><td>Not thinking about how the other side sees the situation</td><td>Role-play the other side</td></tr>
<tr><td>Reactive devaluation</td><td>Discounting a concession simply because the opponent offered it</td><td>Judge proposals on their merits, or have a neutral party present them</td></tr>
</table>
<p>Culture adds to these traps. People judge the other side through their own norms — an <em>attribution error</em> — so a polite silence may be read as weakness and a blunt refusal as hostility.</p>
<h3>Ethics in negotiation</h3>
<p>Negotiation involves choices about what to reveal, how to present information and how hard to push. Four approaches to ethical reasoning help you examine a tactic:</p>
<table>
<tr><th>Approach</th><th>Question it asks</th></tr>
<tr><td>End-result ethics</td><td>Does the outcome produce the greatest good?</td></tr>
<tr><td>Duty ethics</td><td>Does the action follow principles that should apply to everyone (for example, do not lie)?</td></tr>
<tr><td>Social contract ethics</td><td>Is it acceptable under the norms of this community or context?</td></tr>
<tr><td>Personalistic ethics</td><td>Is it consistent with my own conscience?</td></tr>
</table>
<p>Research on ethically ambiguous tactics groups them into categories: traditional competitive bargaining (hiding your walk-away point, an inflated opening), emotional manipulation, misrepresentation, misrepresentation to the opponent's network, inappropriate information gathering, and bluffing. Many people accept the first category as part of the game, while misrepresentation and false promises are widely seen as unethical.</p>
<h3>Where the lines usually are</h3>
<ul>
<li><strong>Not disclosing</strong> your resistance point is normal; <strong>lying</strong> about material facts (a fake competing offer, false quality data) is deception — and in many legal systems it can allow the contract to be cancelled or amount to fraud.</li>
<li>Enthusiastic praise of your own product is tolerated; stating false facts is not.</li>
<li>Cultures draw these lines differently (how much exaggeration is expected, what counts as a harmless white lie), so clarify the norms — and your company's code — early.</li>
</ul>
<p>If you suspect deception: ask specific, probing questions; test statements against facts; point out inconsistencies; and, if necessary, name the tactic calmly.</p>
<div class="callout"><span class="badge">Key lesson</span> Short-term gains from deception rarely survive repeated dealings. Reputation is a negotiator's most valuable asset — especially in relationship-based cultures, where word travels quickly through networks.</div>`,
    `<span class="eyebrow">IBC201 · Phần 4 · Bài 4.2</span>
<h2>Nhận thức và đạo đức của nhà đàm phán</h2>
<h3>Những bẫy tư duy trong đàm phán</h3>
<p>Nhà đàm phán không hoàn toàn duy lý. Lewicki, Saunders và Barry tổng kết các thiên kiến nhận thức thường gặp:</p>
<table>
<tr><th>Thiên kiến</th><th>Điều xảy ra</th><th>Cách khắc phục</th></tr>
<tr><td>Leo thang cam kết phi lý</td><td>Bám theo một hướng đang thất bại vì những gì đã đầu tư</td><td>Đặt giới hạn từ trước; nhờ người khác xem xét</td></tr>
<tr><td>Niềm tin "chiếc bánh cố định"</td><td>Cho rằng mọi vấn đề đều là thắng – thua</td><td>Hỏi về lợi ích và ưu tiên; tìm cơ hội trao đổi</td></tr>
<tr><td>Neo và điều chỉnh</td><td>Bị con số ban đầu kéo theo</td><td>Xác định mục tiêu và tiêu chí của mình trước khi nghe con số của họ</td></tr>
<tr><td>Cách đóng khung vấn đề và rủi ro</td><td>Khi đóng khung là mất mát, người ta chấp nhận rủi ro nhiều hơn; khi là được lợi, họ thận trọng hơn (lý thuyết triển vọng)</td><td>Đóng khung lại đề nghị; xem xét cả hai khung</td></tr>
<tr><td>Tính sẵn có của thông tin</td><td>Coi trọng quá mức thông tin sống động hoặc dễ nhớ</td><td>Dùng dữ liệu, không dùng giai thoại</td></tr>
<tr><td>Lời nguyền người thắng</td><td>Nhận được cái gật đầu quá nhanh rồi thấy lẽ ra mình làm tốt hơn — hoặc thấy có gì đó không ổn</td><td>Tìm hiểu giá trị từ trước</td></tr>
<tr><td>Quá tự tin</td><td>Đánh giá quá cao cơ hội của mình hoặc độ chính xác của phán đoán</td><td>Tìm bằng chứng cho thấy mình sai</td></tr>
<tr><td>Quy luật số nhỏ</td><td>Rút ra kết luận từ vài trường hợp trước đây</td><td>Xem xét mẫu lớn hơn</td></tr>
<tr><td>Thiên kiến vị kỷ</td><td>Quy thành công cho bản thân và quy hành vi của bên kia cho tính cách của họ</td><td>Xem xét các lý giải do hoàn cảnh</td></tr>
<tr><td>Hiệu ứng sở hữu</td><td>Định giá thứ mình sở hữu cao hơn mức mình sẵn sàng trả để mua nó</td><td>Dùng mốc tham chiếu thị trường</td></tr>
<tr><td>Bỏ qua nhận thức của người khác</td><td>Không nghĩ tới việc bên kia nhìn tình huống ra sao</td><td>Đóng vai bên kia</td></tr>
<tr><td>Hạ giá trị phản ứng (xem nhẹ đề xuất vì do đối phương đưa ra)</td><td>Xem nhẹ một nhượng bộ chỉ vì nó do đối phương đưa ra</td><td>Đánh giá đề xuất theo nội dung, hoặc nhờ một bên trung lập trình bày</td></tr>
</table>
<p>Văn hoá làm những cái bẫy này sâu thêm. Con người đánh giá bên kia qua chuẩn mực của chính mình — một <em>lỗi quy kết</em> — nên sự im lặng lịch sự có thể bị hiểu là yếu thế, còn lời từ chối thẳng thừng bị hiểu là thù địch.</p>
<h3>Đạo đức trong đàm phán</h3>
<p>Đàm phán gồm những lựa chọn về điều gì nên tiết lộ, trình bày thông tin ra sao và gây sức ép tới mức nào. Bốn cách tiếp cận lập luận đạo đức giúp xem xét một chiến thuật:</p>
<table>
<tr><th>Cách tiếp cận</th><th>Câu hỏi đặt ra</th></tr>
<tr><td>Đạo đức theo kết quả</td><td>Kết quả có tạo ra điều tốt lớn nhất không?</td></tr>
<tr><td>Đạo đức theo bổn phận</td><td>Hành động có theo những nguyên tắc nên áp dụng cho mọi người (ví dụ không nói dối) không?</td></tr>
<tr><td>Đạo đức theo khế ước xã hội</td><td>Có chấp nhận được theo chuẩn mực của cộng đồng hay bối cảnh này không?</td></tr>
<tr><td>Đạo đức cá nhân</td><td>Có phù hợp với lương tâm của chính tôi không?</td></tr>
</table>
<p>Nghiên cứu về các chiến thuật mập mờ về đạo đức xếp chúng thành các nhóm: mặc cả cạnh tranh truyền thống (giấu điểm bỏ bàn, mở đầu bằng con số thổi phồng), thao túng cảm xúc, trình bày sai sự thật, trình bày sai sự thật với mạng lưới của đối phương, thu thập thông tin không chính đáng, và hù doạ suông / hứa hão (bluffing — đe doạ hoặc hứa hẹn điều mình không định thực hiện). Nhiều người chấp nhận nhóm thứ nhất như một phần của cuộc chơi, trong khi trình bày sai sự thật và hứa hão bị coi rộng rãi là phi đạo đức.</p>
<h3>Ranh giới thường nằm ở đâu</h3>
<ul>
<li><strong>Không tiết lộ</strong> điểm kháng cự là bình thường; <strong>nói dối</strong> về sự thật trọng yếu (một lời chào giá cạnh tranh giả, dữ liệu chất lượng sai) là lừa dối — và ở nhiều hệ thống pháp luật có thể khiến hợp đồng bị huỷ bỏ hoặc cấu thành hành vi gian lận.</li>
<li>Khen sản phẩm của mình một cách nhiệt tình được chấp nhận; nêu dữ kiện sai thì không.</li>
<li>Mỗi nền văn hoá vạch những ranh giới này khác nhau (mức phóng đại được chờ đợi, thế nào là lời nói dối vô hại), nên hãy làm rõ chuẩn mực — và bộ quy tắc của công ty bạn — từ sớm.</li>
</ul>
<p>Khi nghi bị lừa: đặt câu hỏi cụ thể, thăm dò; đối chiếu lời nói với dữ kiện; chỉ ra chỗ mâu thuẫn; và nếu cần, bình tĩnh gọi tên chiến thuật đó.</p>
<div class="callout"><span class="badge">Bài học chính</span> Cái lợi ngắn hạn từ lừa dối hiếm khi tồn tại qua những lần làm ăn lặp lại. Uy tín là tài sản quý nhất của nhà đàm phán — nhất là ở những nền văn hoá dựa trên quan hệ, nơi tiếng tăm lan rất nhanh qua các mạng lưới.</div>`,
  ]]);

const c11e = doc('ibc201-4-3-exercise', 'Exercise 2 — BATNA, resistance points, ZOPA and an anchoring plan|||Bài tập 2 — BATNA, điểm kháng cự, ZOPA và kế hoạch neo giá',
  'Bài tập tình huống giả định: một nhà sản xuất nội thất Việt Nam bán 2.000 ghế cho một nhà nhập khẩu nước ngoài; xác định BATNA và điểm kháng cự của hai bên, tính ZOPA, đề xuất chiến lược neo và kế hoạch nhượng bộ, phân tích khi BATNA của bên mua thay đổi; kèm lời giải.',
  [[
    `<span class="eyebrow">IBC201 · Part 4 · Exercise 2</span>
<h2>Exercise 2 — preparing the numbers for a chair contract</h2>
<div class="callout"><span class="badge">Problem</span> (A fictional case with illustrative numbers.) Seller M, a Vietnamese furniture maker, is negotiating a contract to supply 2,000 wooden chairs to Buyer N, an overseas importer. All figures are in USD per chair. Seller M's cost is 34. Another importer has offered M 43 per chair, but only with a design change that would cost M 3 per chair. M's target is 52. Buyer N's alternative is another supplier quoting 50 per chair, which would add 3 per chair in extra shipping and inspection. (a) Find each side's BATNA and resistance point. (b) Find the ZOPA and its total value for 2,000 chairs. (c) Propose an anchoring strategy for M. If M opens at 56, N counters at 42 and they finally split the difference, what is the price, and how is the ZOPA shared? (d) Propose a concession pattern for M. (e) Before signing, N receives a new quote of 45 (plus the same 3 extra). What changes?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Seller M: BATNA = sell to the other importer at 43 − 3 (redesign) = net 40
              resistance point = 40   (profit 40 − 34 = 6 per chair, same as BATNA)
    Buyer N:  BATNA = other supplier at 50 + 3 (shipping, inspection) = 53
              resistance point = 53

(b) ZOPA = 40 to 53 → width 53 − 40 = 13 per chair
    Total value in play = 13 x 2,000 = USD 26,000 (a positive bargaining zone)

(c) Anchoring: assume M has good market data on prices for such chairs; then
    M should open first, ambitiously but with reasons (quality certificates,
    on-time record): 56.
    Split the difference: (56 + 42) / 2 = 49
    M's surplus = 49 − 40 = 9 per chair → 9 / 13 = 69.2% of the ZOPA → USD 18,000
    N's surplus = 53 − 49 = 4 per chair → 4 / 13 = 30.8% of the ZOPA → USD  8,000
    Contract value = 49 x 2,000 = USD 98,000; M's profit = 49 − 34 = 15 per chair
    Midpoint of the ZOPA = (40 + 53) / 2 = 46.5 → with these two openings and
    a split, the deal lands 49 − 46.5 = 2.5 per chair = USD 5,000 above the
    midpoint, in M's favour (M's ambitious, justified anchor is one reason)

(d) Concessions: 56 → 52 → 50 → 49 (steps of 4, 2, 1 — shrinking)
    Each concession is labelled and traded, e.g. 52 in return for a
    50% deposit; 50 in return for a two-year framework agreement.

(e) N's new BATNA = 45 + 3 = 48 → N's resistance point falls to 48
    New ZOPA = 40 to 48 → width 8 per chair = USD 16,000
    49 is now above N's resistance point (49 &gt; 48) → no deal at 49.
    M must update: ask about N's alternative, add value (faster delivery,
    better packaging) or move to 48 or below.</code></pre>
<p><strong>Why:</strong> resistance points come from BATNAs, not from wishes — M should not go below 40 because the other importer already guarantees 40 net, and N will not pay above 53 because the other supplier costs 53 delivered. An ambitious but justified first offer pulls the settlement towards the anchor: splitting the difference between 56 and 42 gives 49, well above the ZOPA midpoint of 46.5. Shrinking concessions signal that M is near its limit. Part (e) shows why negotiators must keep checking the other side's alternatives: when N's BATNA improves, the same anchor and the same "split" no longer produce a deal.</p>`,
    `<span class="eyebrow">IBC201 · Phần 4 · Bài tập 2</span>
<h2>Bài tập 2 — chuẩn bị các con số cho hợp đồng bán ghế</h2>
<div class="callout"><span class="badge">Đề</span> (Tình huống giả định, số liệu minh hoạ giả định.) Bên bán M, một nhà sản xuất nội thất Việt Nam, đang đàm phán hợp đồng cung cấp 2.000 ghế gỗ cho Bên mua N, một nhà nhập khẩu nước ngoài. Mọi con số tính bằng USD mỗi chiếc ghế. Giá thành của M là 34. Một nhà nhập khẩu khác đã trả M 43 mỗi chiếc, nhưng chỉ khi M đổi thiết kế với chi phí 3 mỗi chiếc. Mục tiêu của M là 52. Phương án thay thế của N là một nhà cung cấp khác chào 50 mỗi chiếc, cộng thêm 3 mỗi chiếc cho vận chuyển và kiểm định. (a) Xác định BATNA và điểm kháng cự của mỗi bên. (b) Tìm ZOPA và tổng giá trị của nó cho 2.000 ghế. (c) Đề xuất chiến lược neo cho M. Nếu M mở đầu ở 56, N đáp lại 42 và cuối cùng hai bên chia đôi khoảng cách, giá là bao nhiêu và ZOPA được chia ra sao? (d) Đề xuất khuôn mẫu nhượng bộ cho M. (e) Trước khi ký, N nhận được báo giá mới 45 (cộng 3 như cũ). Điều gì thay đổi?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Bên bán M: BATNA = bán cho nhà nhập khẩu khác 43 − 3 (đổi thiết kế) = ròng 40
               điểm kháng cự = 40   (lãi 40 − 34 = 6 mỗi ghế, bằng BATNA)
    Bên mua N: BATNA = nhà cung cấp khác 50 + 3 (vận chuyển, kiểm định) = 53
               điểm kháng cự = 53

(b) ZOPA = 40 tới 53 → độ rộng 53 − 40 = 13 mỗi ghế
    Tổng giá trị đang được thương lượng = 13 x 2.000 = 26.000 USD (vùng thương lượng dương)

(c) Neo giá: giả sử M có dữ liệu thị trường tốt về giá loại ghế này; khi đó
    M nên đưa đề nghị trước, tham vọng nhưng có lý do (chứng nhận chất lượng,
    lịch sử giao hàng đúng hạn): 56.
    Chia đôi khoảng cách: (56 + 42) / 2 = 49
    Thặng dư của M = 49 − 40 = 9 mỗi ghế → 9 / 13 = 69,2% ZOPA → 18.000 USD
    Thặng dư của N = 53 − 49 = 4 mỗi ghế → 4 / 13 = 30,8% ZOPA →  8.000 USD
    Giá trị hợp đồng = 49 x 2.000 = 98.000 USD; lãi của M = 49 − 34 = 15 mỗi ghế
    Điểm giữa ZOPA = (40 + 53) / 2 = 46,5 → với hai đề nghị mở đầu này và
    cách chia đôi, thoả thuận rơi vào mức cao hơn điểm giữa 49 − 46,5 = 2,5
    mỗi ghế = 5.000 USD có lợi cho M (mỏ neo tham vọng, có căn cứ của M là
    một nguyên nhân)

(d) Nhượng bộ: 56 → 52 → 50 → 49 (các bước 4, 2, 1 — nhỏ dần)
    Mỗi nhượng bộ đều được gọi tên và đổi lấy điều gì đó, ví dụ 52 đổi lấy
    khoản đặt cọc 50%; 50 đổi lấy một thoả thuận khung hai năm.

(e) BATNA mới của N = 45 + 3 = 48 → điểm kháng cự của N giảm còn 48
    ZOPA mới = 40 tới 48 → độ rộng 8 mỗi ghế = 16.000 USD
    Giá 49 nay cao hơn điểm kháng cự của N (49 &gt; 48) → không có thoả thuận ở 49.
    M phải cập nhật: hỏi về phương án thay thế của N, thêm giá trị (giao nhanh hơn,
    đóng gói tốt hơn) hoặc lùi xuống 48 hay thấp hơn.</code></pre>
<p><strong>Vì sao:</strong> điểm kháng cự đến từ BATNA, không đến từ mong muốn — M không nên xuống dưới 40 vì nhà nhập khẩu kia đã bảo đảm 40 ròng, và N sẽ không trả trên 53 vì nhà cung cấp kia tốn 53 khi hàng về tới nơi. Một đề nghị đầu tiên tham vọng nhưng có căn cứ kéo thoả thuận về phía mỏ neo: chia đôi khoảng cách giữa 56 và 42 được 49, cao hơn hẳn điểm giữa ZOPA là 46,5. Các bước nhượng nhỏ dần báo hiệu M đã gần tới giới hạn. Câu (e) cho thấy vì sao nhà đàm phán phải liên tục kiểm tra phương án thay thế của bên kia: khi BATNA của N tốt lên, cùng mỏ neo và cùng cách "chia đôi" không còn cho ra thoả thuận.</p>`,
  ]]);

const c11q = quiz('ibc201-quiz-4', 'Quiz 4 — Distributive bargaining, cognition and ethics|||Quiz 4 — Đàm phán phân phối, nhận thức và đạo đức', [
  { id: 'q1', question: 'A seller’s resistance point is 120 and the buyer’s is 150. The opening offers are 180 (seller) and 100 (buyer). What is the ZOPA?|||Điểm kháng cự của bên bán là 120, của bên mua là 150. Đề nghị mở đầu là 180 (bên bán) và 100 (bên mua). ZOPA là gì?', options: ['100 to 180, width 80|||100 tới 180, độ rộng 80', '120 to 150, width 30|||120 tới 150, độ rộng 30', '100 to 150, width 50|||100 tới 150, độ rộng 50', '120 to 180, width 60|||120 tới 180, độ rộng 60'], correctIndex: 1, explanation: 'The ZOPA lies between the two resistance points, not the opening offers: 150 − 120 = 30.|||ZOPA nằm giữa hai điểm kháng cự, không phải giữa hai đề nghị mở đầu: 150 − 120 = 30.' },
  { id: 'q2', question: 'A negotiator rejects a reasonable proposal mainly because the other side suggested it. This bias is called…|||Một nhà đàm phán bác bỏ một đề xuất hợp lý chủ yếu vì nó do bên kia đưa ra. Thiên kiến này gọi là…', options: ['the endowment effect|||hiệu ứng sở hữu', 'the law of small numbers|||quy luật số nhỏ', 'escalation of commitment|||leo thang cam kết', 'reactive devaluation|||hạ giá trị phản ứng'], correctIndex: 3, explanation: 'Reactive devaluation discounts a concession or proposal because of its source; judging proposals on their merits, or having a neutral party present them, helps.|||Hạ giá trị phản ứng là xem nhẹ một nhượng bộ hay đề xuất vì nguồn gốc của nó; đánh giá theo nội dung, hoặc nhờ bên trung lập trình bày, sẽ giúp khắc phục.' },
  { id: 'q3', question: 'Which behaviour is generally treated as legitimate competitive bargaining rather than deception?|||Hành vi nào thường được coi là mặc cả cạnh tranh chính đáng chứ không phải lừa dối?', options: ['Not revealing your resistance point|||Không tiết lộ điểm kháng cự của mình', 'Inventing a competing offer that does not exist|||Bịa ra một lời chào giá cạnh tranh không có thật', 'Giving false quality test results|||Đưa kết quả kiểm định chất lượng sai sự thật', 'Promising future orders you have no intention of placing|||Hứa những đơn hàng tương lai mà mình không hề định đặt'], correctIndex: 0, explanation: 'Keeping your walk-away point private is normal; inventing facts or making false promises is misrepresentation.|||Giữ kín điểm bỏ bàn là bình thường; bịa dữ kiện hay hứa hão là trình bày sai sự thật.' },
]);

const c12 = doc('ibc201-5-1-integrative-multi-issue', '5.1 — Integrative negotiation: creating value with several issues|||5.1 — Đàm phán tích hợp: tạo giá trị khi có nhiều vấn đề',
  'Từ lập trường sang lợi ích, bốn nguyên tắc đàm phán theo nguyên tắc (Fisher & Ury), bốn bước của quy trình tích hợp, năm cách tạo phương án (mở rộng chiếc bánh, trao đổi chéo, bù đắp không cụ thể, giảm chi phí tuân thủ, giải pháp bắc cầu), bảng điểm cho đàm phán nhiều vấn đề, hiệu quả Pareto và thoả thuận sau thoả thuận.',
  [[
    `<span class="eyebrow">IBC201 · Part 5 · Lesson 5.1</span>
<h2>Integrative negotiation: creating value with several issues</h2>
<p class="lead">In integrative (win–win) negotiation, the parties look for agreements that leave both better off than a simple split would. The key move is from <strong>positions</strong> (what each side demands) to <strong>interests</strong> (why it demands it).</p>
<h3>Principled negotiation</h3>
<p>Roger Fisher and William Ury of the Harvard Negotiation Project (<em>Getting to Yes</em>) proposed four principles: separate the <strong>people</strong> from the problem; focus on <strong>interests</strong>, not positions; invent <strong>options for mutual gain</strong>; and insist on <strong>objective criteria</strong>. They also introduced the idea of the BATNA.</p>
<h3>The integrative process</h3>
<ol>
<li><strong>Identify and define the problem</strong> in a way both sides accept, without assigning blame.</li>
<li><strong>Understand interests and needs</strong> — substantive, process, relationship and principle interests — by asking "why?" and "why not?".</li>
<li><strong>Generate alternative solutions</strong>.</li>
<li><strong>Evaluate and select</strong> using criteria both sides accept.</li>
</ol>
<h3>Five ways to invent options</h3>
<table>
<tr><th>Method</th><th>Idea</th><th>Example (fictional)</th></tr>
<tr><td>Expand the pie</td><td>Add resources so that both can get more</td><td>A larger order volume in return for a lower unit price</td></tr>
<tr><td>Logroll</td><td>Trade issues the parties value differently: each concedes on what matters less to it</td><td>The supplier gets fast payment; the client gets a longer warranty</td></tr>
<tr><td>Nonspecific compensation</td><td>One side gets its way; the other is paid in some other "currency"</td><td>A lower price accepted in exchange for a public reference</td></tr>
<tr><td>Cut the costs for compliance</td><td>Reduce the costs the other side bears if it agrees</td><td>The seller handles the customs paperwork for the buyer</td></tr>
<tr><td>Find a bridge solution</td><td>Invent a new option that meets both sides' core interests</td><td>A pilot project with an option to extend</td></tr>
</table>
<h3>Multi-issue negotiation and scoring systems</h3>
<p>With several issues, it helps to build a <strong>scoring system</strong> (a planning matrix) before the talks: list the issues and the options for each, then assign points so that the total reflects your priorities (for example out of 100). Every package can then be evaluated quickly and consistently, and trade-offs become visible.</p>
<pre><code class="language-text">Illustrative scoring for one side (total 100 points)
Issue          Options and points
Price          high 40 | middle 20 | low 0
Delivery date  early 30 | normal 15 | late 0
Warranty       short 30 | medium 15 | long 0
Package "middle on every issue" = 20 + 15 + 15 = 50 points</code></pre>
<p>Splitting every issue down the middle usually leaves value on the table. When the two sides' priorities differ, trading whole issues (logrolling) can give both sides more than the middle package — Exercise 3 works through a full example.</p>
<h3>Pareto efficiency</h3>
<p>Package X <strong>Pareto-dominates</strong> package Y if at least one party is better off under X and nobody is worse off. A package is <strong>Pareto-efficient</strong> if no other package dominates it; the set of such packages forms the <strong>Pareto frontier</strong>. Integrative negotiation moves the parties towards the frontier (creating value); choosing a point on the frontier is still distributive (claiming value). The decision analyst Howard Raiffa also suggested a <strong>post-settlement settlement</strong>: after agreeing, the parties check together whether another package exists that both prefer.</p>
<h3>What makes integration possible</h3>
<ul>
<li>A common goal and belief in the parties' ability to solve problems jointly.</li>
<li>Trust and open, accurate exchange of information — at least about priorities, if not about limits.</li>
<li>Motivation to cooperate and a clear, agreed process.</li>
</ul>
<div class="callout"><span class="badge">Watch out</span> Revealing priorities creates value; revealing your resistance point gives value away. Share what you care about and why — keep your walk-away number to yourself.</div>`,
    `<span class="eyebrow">IBC201 · Phần 5 · Bài 5.1</span>
<h2>Đàm phán tích hợp: tạo giá trị khi có nhiều vấn đề</h2>
<p class="lead">Trong đàm phán tích hợp (cùng thắng), các bên tìm những thoả thuận khiến cả hai được lợi hơn so với một cách chia đơn giản. Bước chuyển then chốt là đi từ <strong>lập trường</strong> (mỗi bên đòi gì) sang <strong>lợi ích</strong> (vì sao họ đòi như vậy).</p>
<h3>Đàm phán theo nguyên tắc</h3>
<p>Roger Fisher và William Ury thuộc Dự án Đàm phán Harvard (<em>Getting to Yes</em>) đề xuất bốn nguyên tắc: tách <strong>con người</strong> khỏi vấn đề; tập trung vào <strong>lợi ích</strong>, không vào lập trường; sáng tạo <strong>phương án cùng có lợi</strong>; và kiên định với <strong>tiêu chí khách quan</strong>. Hai tác giả cũng đưa ra khái niệm BATNA.</p>
<h3>Quy trình tích hợp</h3>
<ol>
<li><strong>Nhận diện và xác định vấn đề</strong> theo cách cả hai bên chấp nhận, không đổ lỗi.</li>
<li><strong>Hiểu lợi ích và nhu cầu</strong> — lợi ích thực chất, lợi ích về quy trình, về quan hệ và về nguyên tắc — bằng cách hỏi "vì sao?" và "vì sao không?".</li>
<li><strong>Tạo ra các giải pháp thay thế</strong>.</li>
<li><strong>Đánh giá và lựa chọn</strong> theo tiêu chí cả hai bên chấp nhận.</li>
</ol>
<h3>Năm cách sáng tạo phương án</h3>
<table>
<tr><th>Cách</th><th>Ý tưởng</th><th>Ví dụ (hư cấu)</th></tr>
<tr><td>Mở rộng chiếc bánh</td><td>Thêm nguồn lực để cả hai cùng được nhiều hơn</td><td>Tăng khối lượng đơn hàng để đổi lấy đơn giá thấp hơn</td></tr>
<tr><td>Trao đổi chéo (logrolling)</td><td>Đổi các vấn đề mà hai bên coi trọng khác nhau: mỗi bên nhượng ở điều ít quan trọng với mình</td><td>Nhà cung cấp được thanh toán nhanh; khách hàng được bảo hành dài hơn</td></tr>
<tr><td>Bù đắp không cụ thể</td><td>Một bên được như ý; bên kia được trả bằng một "đồng tiền" khác</td><td>Chấp nhận giá thấp hơn để đổi lấy việc được nêu tên làm khách hàng tham chiếu</td></tr>
<tr><td>Giảm chi phí tuân thủ</td><td>Giảm chi phí mà bên kia phải chịu nếu đồng ý</td><td>Bên bán lo thủ tục hải quan cho bên mua</td></tr>
<tr><td>Tìm giải pháp bắc cầu</td><td>Tạo ra một phương án mới đáp ứng lợi ích cốt lõi của cả hai bên</td><td>Một dự án thí điểm có quyền chọn gia hạn</td></tr>
</table>
<h3>Đàm phán nhiều vấn đề và bảng điểm</h3>
<p>Khi có nhiều vấn đề, nên xây dựng <strong>bảng điểm</strong> (ma trận lập kế hoạch) trước khi đàm phán: liệt kê các vấn đề và các phương án cho từng vấn đề, rồi gán điểm sao cho tổng phản ánh thứ tự ưu tiên của mình (ví dụ trên thang 100). Khi đó mọi gói phương án đều được đánh giá nhanh và nhất quán, và các đánh đổi hiện ra rõ ràng.</p>
<pre><code class="language-text">Bảng điểm minh hoạ cho một bên (tổng 100 điểm)
Vấn đề          Phương án và điểm
Giá             cao 40 | giữa 20 | thấp 0
Ngày giao hàng  sớm 30 | bình thường 15 | muộn 0
Bảo hành        ngắn 30 | vừa 15 | dài 0
Gói "ở giữa mọi vấn đề" = 20 + 15 + 15 = 50 điểm</code></pre>
<p>Chia đôi từng vấn đề thường bỏ phí giá trị. Khi thứ tự ưu tiên của hai bên khác nhau, việc đổi trọn các vấn đề cho nhau (trao đổi chéo) có thể cho cả hai bên nhiều hơn gói ở giữa — Bài tập 3 đi qua một ví dụ đầy đủ.</p>
<h3>Hiệu quả Pareto</h3>
<p>Gói X <strong>trội Pareto</strong> so với gói Y nếu với X ít nhất một bên được lợi hơn và không bên nào bị thiệt hơn. Một gói là <strong>hiệu quả Pareto</strong> nếu không có gói nào trội hơn nó; tập hợp các gói như vậy tạo thành <strong>đường biên Pareto</strong>. Đàm phán tích hợp đưa các bên tiến về đường biên (tạo ra giá trị); còn chọn điểm nào trên đường biên vẫn là phân phối (giành giá trị). Nhà phân tích quyết định Howard Raiffa còn gợi ý <strong>thoả thuận sau thoả thuận</strong> (post-settlement settlement): sau khi đã đồng ý, hai bên cùng kiểm tra xem còn gói nào cả hai đều thích hơn không.</p>
<h3>Điều gì giúp tích hợp thành công</h3>
<ul>
<li>Mục tiêu chung và niềm tin vào khả năng cùng nhau giải quyết vấn đề.</li>
<li>Niềm tin lẫn nhau và trao đổi thông tin cởi mở, chính xác — ít nhất về thứ tự ưu tiên, dù không phải về giới hạn.</li>
<li>Động lực hợp tác và một quy trình rõ ràng, được thống nhất.</li>
</ul>
<div class="callout"><span class="badge">Cẩn thận</span> Tiết lộ thứ tự ưu tiên tạo ra giá trị; tiết lộ điểm kháng cự làm mất giá trị. Hãy chia sẻ điều bạn quan tâm và vì sao — nhưng giữ riêng con số bỏ bàn của mình.</div>`,
  ]]);

const c13 = doc('ibc201-5-2-multiparty-team', '5.2 — Multiparty and team negotiation|||5.2 — Đàm phán đa bên và đàm phán theo đoàn',
  'Năm dạng phức tạp của đàm phán đa bên, quản trị ba giai đoạn (trước đàm phán, đàm phán chính thức, thoả thuận), các quy tắc ra quyết định, liên minh, đàm phán theo đoàn với vai trò, chuẩn bị, tạm nghỉ hội ý và các bên hậu thuẫn, tín hiệu văn hoá của thành phần đoàn.',
  [[
    `<span class="eyebrow">IBC201 · Part 5 · Lesson 5.2</span>
<h2>Multiparty and team negotiation</h2>
<h3>How multiparty negotiation differs</h3>
<p>When three or more parties negotiate — a joint venture with several partners, an industry association, an international consortium — complexity rises sharply:</p>
<ul>
<li><strong>Number of parties</strong> — more interests, more roles, more speaking time needed.</li>
<li><strong>Informational and computational complexity</strong> — more issues and more positions to track.</li>
<li><strong>Social complexity</strong> — pressure to conform, and the risk that a dominant party takes over.</li>
<li><strong>Procedural complexity</strong> — who speaks when, how to decide, how to record agreement.</li>
<li><strong>Strategic complexity</strong> — parties form <strong>coalitions</strong>, and each move is aimed at several audiences at once.</li>
</ul>
<h3>Managing the three stages</h3>
<table>
<tr><th>Stage</th><th>Key tasks</th></tr>
<tr><td>Prenegotiation</td><td>Decide who takes part; anticipate coalitions; define roles (chair, facilitator, recorder); understand each party's costs of no agreement; agree the agenda and ground rules</td></tr>
<tr><td>Formal negotiation</td><td>Use a chair or facilitator to manage the process; make sure all perspectives are heard; work through the agenda issue by issue or in packages; choose a <strong>decision rule</strong> — majority vote (fast, but the losing side may resist), consensus (slower, but stronger commitment) or unanimity (every party has a veto)</td></tr>
<tr><td>Agreement</td><td>Select the best agreement, write it down, check that everyone understands the same thing, and plan implementation and review</td></tr>
</table>
<h3>Coalitions</h3>
<p>Weaker parties can join forces to match a stronger one, and a party that can tip the balance (a "pivotal" member) gains power beyond its size. Coalitions are fragile when members' interests diverge, so members must agree early how any gains will be shared.</p>
<h3>Negotiating as a team</h3>
<p>Many international negotiations are team against team. A team brings more expertise and can split roles, but it must speak with one voice.</p>
<ul>
<li><strong>Roles</strong>: a lead negotiator (speaks for the team), a technical expert, an analyst or recorder (tracks offers and numbers), and an observer (watches the other side's reactions and non-verbal cues).</li>
<li><strong>Preparation</strong>: agree goals, limits and priorities, and who may make concessions; rehearse.</li>
<li><strong>Caucus</strong>: agree a signal for a break to consult privately rather than disagreeing in front of the other side.</li>
<li><strong>Constituencies</strong>: team members answer to bosses and stakeholders at home; keep them informed so that commitments made at the table can be approved.</li>
</ul>
<p>Across cultures, the composition of the team itself sends signals. In more hierarchical settings the other side may expect a senior leader of matching rank; in more consensual settings the other team may need time to consult headquarters before it can agree.</p>
<div class="callout"><span class="badge">Key lesson</span> In multiparty talks, managing the <em>process</em> — agenda, roles, decision rule — matters as much as the substance. Many multiparty negotiations fail because nobody agreed in advance how a decision would be made.</div>`,
    `<span class="eyebrow">IBC201 · Phần 5 · Bài 5.2</span>
<h2>Đàm phán đa bên và đàm phán theo đoàn</h2>
<h3>Đàm phán đa bên khác biệt thế nào</h3>
<p>Khi từ ba bên trở lên cùng đàm phán — một liên doanh nhiều đối tác, một hiệp hội ngành, một liên danh quốc tế — độ phức tạp tăng vọt:</p>
<ul>
<li><strong>Số bên</strong> — nhiều lợi ích hơn, nhiều vai trò hơn, cần nhiều thời gian phát biểu hơn.</li>
<li><strong>Phức tạp về thông tin và tính toán</strong> — nhiều vấn đề và nhiều lập trường hơn phải theo dõi.</li>
<li><strong>Phức tạp về xã hội</strong> — áp lực phải theo số đông, và nguy cơ một bên áp đảo chiếm quyền dẫn dắt.</li>
<li><strong>Phức tạp về thủ tục</strong> — ai nói lúc nào, quyết định ra sao, ghi nhận thoả thuận thế nào.</li>
<li><strong>Phức tạp về chiến lược</strong> — các bên lập <strong>liên minh</strong>, và mỗi nước đi nhắm tới nhiều "khán giả" cùng lúc.</li>
</ul>
<h3>Quản trị ba giai đoạn</h3>
<table>
<tr><th>Giai đoạn</th><th>Nhiệm vụ chính</th></tr>
<tr><td>Trước đàm phán</td><td>Quyết định ai tham gia; dự đoán các liên minh; xác định vai trò (chủ toạ, người điều phối, người ghi chép); hiểu cái giá của việc không đạt thoả thuận với từng bên; thống nhất chương trình nghị sự và quy tắc cơ bản</td></tr>
<tr><td>Đàm phán chính thức</td><td>Dùng chủ toạ hoặc người điều phối để quản lý quy trình; bảo đảm mọi góc nhìn đều được lắng nghe; đi qua chương trình theo từng vấn đề hoặc theo gói; chọn <strong>quy tắc ra quyết định</strong> — biểu quyết theo đa số (nhanh, nhưng bên thua có thể chống đối), đồng thuận (chậm hơn nhưng cam kết mạnh hơn) hoặc nhất trí tuyệt đối (bên nào cũng có quyền phủ quyết)</td></tr>
<tr><td>Thoả thuận</td><td>Chọn thoả thuận tốt nhất, ghi thành văn bản, kiểm tra để mọi người hiểu cùng một nội dung, và lên kế hoạch thực hiện, rà soát</td></tr>
</table>
<h3>Liên minh</h3>
<p>Các bên yếu hơn có thể liên kết để cân bằng với một bên mạnh, và một bên có thể làm nghiêng cán cân (thành viên "then chốt") có quyền lực vượt quá quy mô của mình. Liên minh dễ vỡ khi lợi ích của các thành viên khác nhau, nên các thành viên cần thống nhất sớm cách chia phần lợi thu được.</p>
<h3>Đàm phán theo đoàn</h3>
<p>Nhiều cuộc đàm phán quốc tế là đoàn đối đoàn. Một đoàn có nhiều chuyên môn hơn và có thể phân vai, nhưng phải nói bằng một tiếng nói.</p>
<ul>
<li><strong>Vai trò</strong>: trưởng đoàn (phát ngôn cho cả đoàn), chuyên gia kỹ thuật, người phân tích hoặc ghi chép (theo dõi các đề nghị và con số), và người quan sát (theo dõi phản ứng và tín hiệu phi ngôn ngữ của bên kia).</li>
<li><strong>Chuẩn bị</strong>: thống nhất mục tiêu, giới hạn, thứ tự ưu tiên và ai được quyền nhượng bộ; tập dượt trước.</li>
<li><strong>Tạm nghỉ hội ý</strong> (caucus): thống nhất một tín hiệu để xin nghỉ và bàn riêng, thay vì bất đồng ngay trước mặt bên kia.</li>
<li><strong>Các bên hậu thuẫn</strong>: thành viên đoàn phải báo cáo cho cấp trên và các bên liên quan ở nhà; giữ họ nắm thông tin để những cam kết đưa ra trên bàn đàm phán được phê duyệt.</li>
</ul>
<p>Khi xuyên văn hoá, bản thân thành phần đoàn đã phát đi tín hiệu. Ở bối cảnh thứ bậc hơn, bên kia có thể chờ đợi một lãnh đạo cấp cao có vị thế tương xứng; ở bối cảnh đồng thuận hơn, đoàn bên kia có thể cần thời gian hỏi ý kiến trụ sở trước khi đồng ý.</p>
<div class="callout"><span class="badge">Bài học chính</span> Trong đàm phán đa bên, quản lý <em>quy trình</em> — chương trình nghị sự, vai trò, quy tắc ra quyết định — quan trọng ngang với nội dung. Nhiều cuộc đàm phán đa bên thất bại chỉ vì không ai thống nhất trước cách ra quyết định.</div>`,
  ]]);

const c14 = doc('ibc201-5-3-international-negotiation', '5.3 — International and cross-cultural negotiation|||5.3 — Đàm phán quốc tế và xuyên văn hoá',
  'Bối cảnh môi trường và bối cảnh trực tiếp của đàm phán quốc tế (Phatak & Habib, theo Lewicki), mười yếu tố văn hoá ảnh hưởng tới phong cách đàm phán của Salacuse, năm giai đoạn đàm phán quốc tế, tám chiến lược đáp ứng văn hoá theo mức độ quen thuộc của Weiss, lưu ý thực hành về phiên dịch, thẩm quyền, luật áp dụng, đàm phán trực tuyến.',
  [[
    `<span class="eyebrow">IBC201 · Part 5 · Lesson 5.3</span>
<h2>International and cross-cultural negotiation</h2>
<h3>What changes when negotiation crosses borders</h3>
<p>Lewicki, Saunders and Barry, drawing on Phatak and Habib, separate two layers of context.</p>
<table>
<tr><th>Environmental context (beyond the negotiators' control)</th><th>Immediate context (what the negotiators can influence)</th></tr>
<tr><td>Political and legal pluralism: different laws, taxes and labour rules</td><td>Relative bargaining power: for example the equity split in a joint venture or control of technology</td></tr>
<tr><td>International economics: exchange rates, currency controls</td><td>Levels of conflict: ethnic, identity or resource conflicts raise the stakes</td></tr>
<tr><td>Foreign governments and bureaucracies: approvals, state ownership</td><td>The relationship between the negotiators: history and trust</td></tr>
<tr><td>Instability: political, economic, supply</td><td>Desired outcomes: tangible and intangible goals, including national pride</td></tr>
<tr><td>Ideology: views on individual rights, profit, the role of the state</td><td>Immediate stakeholders: bosses, employees, communities</td></tr>
<tr><td>Culture</td><td>—</td></tr>
<tr><td>External stakeholders: business associations, unions, NGOs</td><td>—</td></tr>
</table>
<h3>Salacuse: ten ways culture affects negotiating style</h3>
<p>Jeswald Salacuse identified ten factors, each a continuum. Know where you and your counterpart tend to sit.</p>
<table>
<tr><th>Factor</th><th>Range</th></tr>
<tr><td>1. Negotiating goal</td><td>A signed contract ↔ a relationship</td></tr>
<tr><td>2. Attitude</td><td>Win–lose ↔ win–win</td></tr>
<tr><td>3. Personal style</td><td>Informal ↔ formal</td></tr>
<tr><td>4. Communication</td><td>Direct ↔ indirect</td></tr>
<tr><td>5. Sensitivity to time</td><td>High (finish fast) ↔ low (take the time)</td></tr>
<tr><td>6. Emotionalism</td><td>High ↔ low</td></tr>
<tr><td>7. Form of agreement</td><td>Specific and detailed ↔ general principles</td></tr>
<tr><td>8. Building an agreement</td><td>Bottom-up (details first) ↔ top-down (principles first)</td></tr>
<tr><td>9. Team organization</td><td>One leader decides ↔ consensus of the team</td></tr>
<tr><td>10. Risk taking</td><td>High ↔ low</td></tr>
</table>
<p>A typical clash: one side sees the signed contract as the goal and wants every contingency written in; the other sees the contract as the start of a relationship and expects to adjust terms as circumstances change. Both are rational — they have different goals and different views of what a contract is for.</p>
<h3>Stages of international negotiation</h3>
<ol>
<li><strong>Preparation</strong> — study the counterpart's culture, context, interests, BATNA and decision process.</li>
<li><strong>Relationship building</strong> (non-task sounding) — in relationship-based cultures this stage can take much longer and is essential.</li>
<li><strong>Exchange of task-related information</strong> — presentations, questions, clarification.</li>
<li><strong>Persuasion</strong> — styles vary: rational argument, appeals to the relationship, emotion or authority.</li>
<li><strong>Concessions and agreement</strong> — some cultures agree issue by issue, others only at the end as a package.</li>
</ol>
<h3>Choosing a culturally responsive strategy</h3>
<p>Stephen Weiss suggests choosing a strategy according to how familiar each side is with the other's culture:</p>
<ul>
<li><strong>Low familiarity</strong>: employ an agent or adviser; involve a mediator; or induce the counterpart to follow your own approach.</li>
<li><strong>Moderate familiarity</strong>: adapt to the counterpart's approach; or coordinate adjustment by both sides.</li>
<li><strong>High familiarity</strong>: embrace the counterpart's approach; improvise an approach; or create a new joint approach (Weiss calls this "effect symphony").</li>
</ul>
<h3>Practical points</h3>
<ul>
<li>Use interpreters well: brief them in advance, speak in short segments, and look at your counterpart rather than at the interpreter.</li>
<li>Clarify who has authority to decide and how approval works on the other side.</li>
<li>Agree which language version of the contract prevails, which law governs and how disputes will be resolved (for example by arbitration).</li>
<li>In e-negotiation, remember that lean media strip away context; use video for relationship-building and difficult issues.</li>
</ul>
<div class="callout"><span class="badge">Key lesson</span> Culture shapes <em>how</em> people negotiate — goals, pace, form of agreement — but interests and BATNAs still drive <em>what</em> they can agree. Prepare both: the cultural script and the numbers.</div>`,
    `<span class="eyebrow">IBC201 · Phần 5 · Bài 5.3</span>
<h2>Đàm phán quốc tế và xuyên văn hoá</h2>
<h3>Điều gì thay đổi khi đàm phán vượt biên giới</h3>
<p>Lewicki, Saunders và Barry, dựa trên Phatak và Habib, tách hai tầng bối cảnh.</p>
<table>
<tr><th>Bối cảnh môi trường (ngoài tầm kiểm soát của nhà đàm phán)</th><th>Bối cảnh trực tiếp (nhà đàm phán có thể tác động)</th></tr>
<tr><td>Đa nguyên chính trị và pháp lý: luật, thuế, quy định lao động khác nhau</td><td>Quyền lực thương lượng tương đối: ví dụ tỷ lệ góp vốn trong liên doanh, quyền kiểm soát công nghệ</td></tr>
<tr><td>Kinh tế quốc tế: tỷ giá, kiểm soát ngoại hối</td><td>Mức độ xung đột: xung đột sắc tộc, bản sắc hay tài nguyên làm tăng mức độ hệ trọng</td></tr>
<tr><td>Chính phủ và bộ máy hành chính nước ngoài: phê duyệt, sở hữu nhà nước</td><td>Quan hệ giữa các nhà đàm phán: lịch sử và niềm tin</td></tr>
<tr><td>Bất ổn: chính trị, kinh tế, nguồn cung</td><td>Kết quả mong muốn: mục tiêu hữu hình và vô hình, kể cả niềm tự hào dân tộc</td></tr>
<tr><td>Hệ tư tưởng: quan niệm về quyền cá nhân, lợi nhuận, vai trò nhà nước</td><td>Các bên liên quan trực tiếp: cấp trên, nhân viên, cộng đồng</td></tr>
<tr><td>Văn hoá</td><td>—</td></tr>
<tr><td>Các bên liên quan bên ngoài: hiệp hội doanh nghiệp, công đoàn, tổ chức phi chính phủ</td><td>—</td></tr>
</table>
<h3>Salacuse: mười cách văn hoá ảnh hưởng tới phong cách đàm phán</h3>
<p>Jeswald Salacuse xác định mười yếu tố, mỗi yếu tố là một thang liên tục. Hãy biết bạn và đối tác có xu hướng nằm ở đâu.</p>
<table>
<tr><th>Yếu tố</th><th>Phạm vi</th></tr>
<tr><td>1. Mục tiêu đàm phán</td><td>Một hợp đồng được ký ↔ một mối quan hệ</td></tr>
<tr><td>2. Thái độ</td><td>Thắng – thua ↔ cùng thắng</td></tr>
<tr><td>3. Phong cách cá nhân</td><td>Thân mật ↔ trang trọng</td></tr>
<tr><td>4. Giao tiếp</td><td>Trực tiếp ↔ gián tiếp</td></tr>
<tr><td>5. Nhạy cảm với thời gian</td><td>Cao (xong nhanh) ↔ thấp (cứ từ từ)</td></tr>
<tr><td>6. Bộc lộ cảm xúc</td><td>Nhiều ↔ ít</td></tr>
<tr><td>7. Hình thức thoả thuận</td><td>Cụ thể, chi tiết ↔ nguyên tắc chung</td></tr>
<tr><td>8. Cách xây dựng thoả thuận</td><td>Từ dưới lên (chi tiết trước) ↔ từ trên xuống (nguyên tắc trước)</td></tr>
<tr><td>9. Tổ chức đoàn</td><td>Một người lãnh đạo quyết ↔ cả đoàn đồng thuận</td></tr>
<tr><td>10. Chấp nhận rủi ro</td><td>Cao ↔ thấp</td></tr>
</table>
<p>Một va chạm điển hình: một bên coi hợp đồng được ký là mục tiêu và muốn ghi mọi tình huống có thể xảy ra; bên kia coi hợp đồng là khởi đầu của một mối quan hệ và kỳ vọng điều chỉnh điều khoản khi hoàn cảnh thay đổi. Cả hai đều hợp lý — họ có mục tiêu khác nhau và quan niệm khác nhau về chức năng của hợp đồng.</p>
<h3>Các giai đoạn của đàm phán quốc tế</h3>
<ol>
<li><strong>Chuẩn bị</strong> — tìm hiểu văn hoá, bối cảnh, lợi ích, BATNA và quy trình ra quyết định của đối tác.</li>
<li><strong>Xây dựng quan hệ</strong> (trao đổi ngoài công việc) — ở những nền văn hoá dựa trên quan hệ, giai đoạn này có thể kéo dài hơn nhiều và là thiết yếu.</li>
<li><strong>Trao đổi thông tin về công việc</strong> — thuyết trình, đặt câu hỏi, làm rõ.</li>
<li><strong>Thuyết phục</strong> — phong cách khác nhau: lập luận lý tính, viện dẫn quan hệ, cảm xúc hay thẩm quyền.</li>
<li><strong>Nhượng bộ và thoả thuận</strong> — có nền văn hoá thống nhất từng vấn đề một, có nền văn hoá chỉ chốt ở cuối theo cả gói.</li>
</ol>
<h3>Chọn chiến lược đáp ứng văn hoá</h3>
<p>Stephen Weiss gợi ý chọn chiến lược theo mức độ mỗi bên quen thuộc với văn hoá của bên kia:</p>
<ul>
<li><strong>Ít quen thuộc</strong>: thuê đại diện hoặc cố vấn; mời người hoà giải; hoặc khiến đối tác theo cách tiếp cận của mình.</li>
<li><strong>Quen thuộc vừa phải</strong>: thích ứng theo cách tiếp cận của đối tác; hoặc phối hợp để cả hai bên cùng điều chỉnh.</li>
<li><strong>Rất quen thuộc</strong>: tiếp nhận hẳn cách tiếp cận của đối tác; ứng biến một cách tiếp cận riêng; hoặc cùng tạo ra một cách tiếp cận chung mới (Weiss gọi là "tạo bản giao hưởng").</li>
</ul>
<h3>Lưu ý thực hành</h3>
<ul>
<li>Dùng phiên dịch cho tốt: trao đổi trước với phiên dịch, nói từng đoạn ngắn, và nhìn vào đối tác thay vì nhìn phiên dịch.</li>
<li>Làm rõ ai có thẩm quyền quyết định và việc phê duyệt ở phía bên kia diễn ra thế nào.</li>
<li>Thống nhất bản ngôn ngữ nào của hợp đồng có giá trị ưu tiên, luật nào được áp dụng và tranh chấp được giải quyết ra sao (ví dụ bằng trọng tài).</li>
<li>Khi đàm phán trực tuyến, nhớ rằng kênh nghèo thông tin làm mất ngữ cảnh; dùng video để xây quan hệ và bàn các vấn đề khó.</li>
</ul>
<div class="callout"><span class="badge">Bài học chính</span> Văn hoá định hình <em>cách</em> con người đàm phán — mục tiêu, nhịp độ, hình thức thoả thuận — nhưng lợi ích và BATNA vẫn quyết định <em>điều gì</em> họ có thể đồng ý. Hãy chuẩn bị cả hai: kịch bản văn hoá và các con số.</div>`,
  ]]);

const c14e = doc('ibc201-5-4-exercise', 'Exercise 3 — a multi-issue scoring system, logrolling and Pareto efficiency|||Bài tập 3 — bảng điểm nhiều vấn đề, trao đổi chéo và hiệu quả Pareto',
  'Bài tập tình huống giả định: nhà cung cấp phần mềm và khách hàng nước ngoài đàm phán bốn vấn đề (đơn giá, thời hạn thanh toán, thời hạn hợp đồng, bảo hành); tính điểm gói chia đôi, xếp hạng ưu tiên, dùng trao đổi chéo tìm gói tốt hơn cho cả hai, kiểm tra một đề nghị có hiệu quả Pareto hay không; kèm lời giải.',
  [[
    `<span class="eyebrow">IBC201 · Part 5 · Exercise 3</span>
<h2>Exercise 3 — scoring packages and finding a better deal for both</h2>
<div class="callout"><span class="badge">Problem</span> (A fictional case with illustrative numbers.) Supplier S, a Vietnamese software firm, and Client K, an overseas retailer, are negotiating a development contract with four issues. Each side has privately built a scoring system (points out of 100):
<table>
<tr><th>Issue</th><th>Option 1</th><th>Option 2</th><th>Option 3</th></tr>
<tr><td>A. Price (USD per developer-month)</td><td>4,200 — S 30, K 0</td><td>4,000 — S 15, K 20</td><td>3,800 — S 0, K 40</td></tr>
<tr><td>B. Payment terms</td><td>15 days — S 30, K 0</td><td>45 days — S 15, K 5</td><td>75 days — S 0, K 10</td></tr>
<tr><td>C. Contract length</td><td>24 months — S 25, K 0</td><td>18 months — S 12, K 5</td><td>12 months — S 0, K 10</td></tr>
<tr><td>D. Free warranty (bug fixing)</td><td>1 month — S 15, K 0</td><td>3 months — S 8, K 20</td><td>6 months — S 0, K 40</td></tr>
</table>
(a) Check that each side's maximum is 100 and rank each side's priorities. (b) Score the "split the difference" package (Option 2 on every issue). (c) Use logrolling to build a package that both sides prefer to (b). (d) K proposes: 3,800 / 15 days / 24 months / 3 months. Score it and say whether it is Pareto-efficient. (e) Keeping 15 days, 24 months and 6 months, compare the three possible prices. How should the parties choose among them?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Maximum S = 30 + 30 + 25 + 15 = 100      Maximum K = 40 + 10 + 10 + 40 = 100
    Priorities (points between best and worst option):
    S: price 30 = payment 30 &gt; length 25 &gt; warranty 15
    K: price 40 = warranty 40 &gt; payment 10 = length 10

(b) Option 2 everywhere (4,000 / 45 days / 18 months / 3 months)
    S = 15 + 15 + 12 + 8 = 50        K = 20 + 5 + 5 + 20 = 50        joint = 100

(c) Logroll: S cares about payment and length (a full range of 55 points) that
    cost K at most 20; K cares about warranty (a range of 40 points) that costs
    S at most 15.
    Package: 4,000 / 15 days / 24 months / 6 months
    S = 15 + 30 + 25 + 0 = 70        K = 20 + 0 + 0 + 40 = 60        joint = 130
    Versus (b): S +28 on payment/length (+15, +13), −8 on warranty = +20
                K −10 on payment/length (−5, −5), +20 on warranty = +10
    → both better off (a Pareto improvement)

(d) K's proposal: 3,800 / 15 days / 24 months / 3 months
    S = 0 + 30 + 25 + 8 = 63         K = 40 + 0 + 0 + 20 = 60        joint = 123
    Package (c) gives S 70 &gt; 63 and K 60 = 60 → (c) dominates (d)
    → (d) is NOT Pareto-efficient (K gives up 20 on price but gains 20 on warranty;
      S gains 15 on price and loses 8 on warranty, net +7)

(e) Payment 15 days, length 24 months, warranty 6 months:
    price 4,200 → S 85, K 40 (joint 125)
    price 4,000 → S 70, K 60 (joint 130)
    price 3,800 → S 55, K 80 (joint 135)
    All three are Pareto-efficient: moving between them helps one side
    only by hurting the other. Choosing among them is distributive.</code></pre>
<p><strong>Why:</strong> splitting every issue in the middle treats all issues as equally important to both sides, which they are not. Because S values payment and contract length much more than K does, and K values the warranty much more than S does, trading whole issues creates 30 extra joint points (100 → 130). Part (d) shows that a package can look generous and still be inefficient: a small change makes one side better off at no cost to the other. Once the parties reach the frontier, the remaining question — which price — is decided by BATNAs, power and objective criteria such as market rates. For example, 4,200 gives K only 40 points, less than the 50 of the middle package, so K would only accept it if its alternatives were weak.</p>`,
    `<span class="eyebrow">IBC201 · Phần 5 · Bài tập 3</span>
<h2>Bài tập 3 — chấm điểm các gói và tìm thoả thuận tốt hơn cho cả hai</h2>
<div class="callout"><span class="badge">Đề</span> (Tình huống giả định, số liệu minh hoạ giả định.) Nhà cung cấp S, một công ty phần mềm Việt Nam, và Khách hàng K, một nhà bán lẻ nước ngoài, đàm phán hợp đồng phát triển phần mềm với bốn vấn đề. Mỗi bên đã tự xây dựng bảng điểm riêng (thang 100):
<table>
<tr><th>Vấn đề</th><th>Phương án 1</th><th>Phương án 2</th><th>Phương án 3</th></tr>
<tr><td>A. Đơn giá (USD mỗi người-tháng)</td><td>4.200 — S 30, K 0</td><td>4.000 — S 15, K 20</td><td>3.800 — S 0, K 40</td></tr>
<tr><td>B. Thời hạn thanh toán</td><td>15 ngày — S 30, K 0</td><td>45 ngày — S 15, K 5</td><td>75 ngày — S 0, K 10</td></tr>
<tr><td>C. Thời hạn hợp đồng</td><td>24 tháng — S 25, K 0</td><td>18 tháng — S 12, K 5</td><td>12 tháng — S 0, K 10</td></tr>
<tr><td>D. Bảo hành miễn phí (sửa lỗi)</td><td>1 tháng — S 15, K 0</td><td>3 tháng — S 8, K 20</td><td>6 tháng — S 0, K 40</td></tr>
</table>
(a) Kiểm tra điểm tối đa của mỗi bên là 100 và xếp hạng ưu tiên của từng bên. (b) Tính điểm gói "chia đôi khoảng cách" (Phương án 2 ở mọi vấn đề). (c) Dùng trao đổi chéo để xây dựng một gói mà cả hai bên đều thích hơn (b). (d) K đề nghị: 3.800 / 15 ngày / 24 tháng / 3 tháng. Tính điểm và cho biết gói này có hiệu quả Pareto không. (e) Giữ 15 ngày, 24 tháng và 6 tháng, so sánh ba mức giá có thể. Hai bên nên chọn giữa chúng thế nào?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Tối đa của S = 30 + 30 + 25 + 15 = 100     Tối đa của K = 40 + 10 + 10 + 40 = 100
    Thứ tự ưu tiên (chênh điểm giữa phương án tốt nhất và tệ nhất):
    S: giá 30 = thanh toán 30 &gt; thời hạn HĐ 25 &gt; bảo hành 15
    K: giá 40 = bảo hành 40 &gt; thanh toán 10 = thời hạn HĐ 10

(b) Phương án 2 ở mọi vấn đề (4.000 / 45 ngày / 18 tháng / 3 tháng)
    S = 15 + 15 + 12 + 8 = 50        K = 20 + 5 + 5 + 20 = 50        tổng chung = 100

(c) Trao đổi chéo: S coi trọng thanh toán và thời hạn HĐ (cả thang 55 điểm) mà
    K chỉ mất tối đa 20; K coi trọng bảo hành (thang 40 điểm) mà S chỉ mất tối đa 15.
    Gói: 4.000 / 15 ngày / 24 tháng / 6 tháng
    S = 15 + 30 + 25 + 0 = 70        K = 20 + 0 + 0 + 40 = 60        tổng chung = 130
    So với (b): S +28 ở thanh toán/thời hạn HĐ (+15, +13), −8 ở bảo hành = +20
                K −10 ở thanh toán/thời hạn HĐ (−5, −5), +20 ở bảo hành = +10
    → cả hai đều lợi hơn (một cải thiện Pareto)

(d) Đề nghị của K: 3.800 / 15 ngày / 24 tháng / 3 tháng
    S = 0 + 30 + 25 + 8 = 63         K = 40 + 0 + 0 + 20 = 60        tổng chung = 123
    Gói (c) cho S 70 &gt; 63 và K 60 = 60 → (c) trội hơn (d)
    → (d) KHÔNG hiệu quả Pareto (K mất 20 ở giá nhưng được 20 ở bảo hành;
      S được 15 ở giá và mất 8 ở bảo hành, ròng +7)

(e) Thanh toán 15 ngày, hợp đồng 24 tháng, bảo hành 6 tháng:
    giá 4.200 → S 85, K 40 (tổng chung 125)
    giá 4.000 → S 70, K 60 (tổng chung 130)
    giá 3.800 → S 55, K 80 (tổng chung 135)
    Cả ba đều hiệu quả Pareto: chuyển giữa chúng chỉ giúp một bên
    bằng cách làm thiệt bên kia. Chọn giữa chúng là việc phân phối.</code></pre>
<p><strong>Vì sao:</strong> chia đôi mọi vấn đề là coi mọi vấn đề quan trọng như nhau với cả hai bên, trong khi thực tế không phải vậy. Vì S coi trọng thanh toán và thời hạn hợp đồng hơn K rất nhiều, còn K coi trọng bảo hành hơn S rất nhiều, việc đổi trọn các vấn đề cho nhau tạo thêm 30 điểm chung (100 → 130). Câu (d) cho thấy một gói có thể trông hào phóng mà vẫn kém hiệu quả: chỉ một thay đổi nhỏ đã giúp một bên lợi hơn mà bên kia không mất gì. Khi hai bên đã tới đường biên, câu hỏi còn lại — chọn mức giá nào — được quyết định bởi BATNA, quyền lực và các tiêu chí khách quan như giá thị trường. Chẳng hạn, giá 4.200 chỉ cho K 40 điểm, thấp hơn 50 điểm của gói ở giữa, nên K chỉ chấp nhận nếu các phương án thay thế của K yếu.</p>`,
  ]]);

const c14q = quiz('ibc201-quiz-5', 'Quiz 5 — Integrative, multiparty and international negotiation|||Quiz 5 — Đàm phán tích hợp, đa bên và quốc tế', [
  { id: 'q1', question: 'In integrative negotiation, logrolling means…|||Trong đàm phán tích hợp, trao đổi chéo (logrolling) nghĩa là…', options: ['splitting every issue exactly in the middle|||chia đôi chính xác từng vấn đề', 'adding a mediator to the talks|||đưa thêm người hoà giải vào cuộc đàm phán', 'making the first offer to anchor the price|||đưa ra đề nghị đầu tiên để neo giá', 'trading issues so that each side concedes on what matters less to it|||đổi các vấn đề cho nhau để mỗi bên nhượng ở điều ít quan trọng với mình'], correctIndex: 3, explanation: 'Logrolling works when the parties have different priorities across issues; each gets what it values most.|||Trao đổi chéo có tác dụng khi hai bên có thứ tự ưu tiên khác nhau giữa các vấn đề; mỗi bên được điều mình coi trọng nhất.' },
  { id: 'q2', question: 'In Salacuse’s list, the factor that ranges from "a signed contract" to "a relationship" is…|||Trong danh sách của Salacuse, yếu tố trải từ "một hợp đồng được ký" tới "một mối quan hệ" là…', options: ['the negotiating goal|||mục tiêu đàm phán', 'risk taking|||chấp nhận rủi ro', 'team organization|||tổ chức đoàn', 'sensitivity to time|||nhạy cảm với thời gian'], correctIndex: 0, explanation: 'Salacuse’s first factor is the negotiating goal: some negotiators aim at a signed contract, others at a lasting relationship.|||Yếu tố thứ nhất của Salacuse là mục tiêu đàm phán: có nhà đàm phán nhắm tới hợp đồng được ký, có người nhắm tới mối quan hệ lâu dài.' },
  { id: 'q3', question: 'Package P gives the supplier 50 points and the client 50; package Q gives 70 and 60; package R gives 63 and 60. Which statement is correct?|||Gói P cho nhà cung cấp 50 điểm và khách hàng 50; gói Q cho 70 và 60; gói R cho 63 và 60. Nhận định nào đúng?', options: ['R is Pareto-efficient because the client gets 60|||R hiệu quả Pareto vì khách hàng được 60', 'P is the best package because it splits every issue equally|||P là gói tốt nhất vì chia đều mọi vấn đề', 'Q Pareto-dominates both P and R|||Q trội Pareto so với cả P và R', 'Q and R are equally good because the client gets 60 in both|||Q và R tốt như nhau vì khách hàng đều được 60'], correctIndex: 2, explanation: 'Against P, Q is better for both (70 &gt; 50, 60 &gt; 50); against R, Q is better for the supplier (70 &gt; 63) and equal for the client (60), so Q dominates both.|||So với P, Q tốt hơn cho cả hai (70 &gt; 50, 60 &gt; 50); so với R, Q tốt hơn cho nhà cung cấp (70 &gt; 63) và bằng cho khách hàng (60), nên Q trội hơn cả hai.' },
]);

const taiLieu = doc('ibc201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">IBC201 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning cross-cultural management and negotiation: the official syllabus and slides, books, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official IBC201 syllabus, learning outcomes and lecture slides. This course follows the structure of standard international textbooks; always check FLM for the materials and assessments used in your class.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">International Management: Managing Across Borders and Cultures</a> — Helen Deresky (Pearson): culture, communication, ethics, negotiation, leadership and HRM across borders. Search the title on the publisher's site.</li>
<li><a href="https://www.mheducation.com/" target="_blank" rel="noopener">Negotiation</a> — Roy J. Lewicki, David M. Saunders and Bruce Barry (McGraw Hill): distributive and integrative negotiation, cognition, ethics, multiparty and international negotiation. Search the title on the publisher's site; a shorter edition, <em>Essentials of Negotiation</em>, also exists.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://www.theculturefactor.com/country-comparison-tool" target="_blank" rel="noopener">The Culture Factor (formerly Hofstede Insights) — country comparison tool</a> — explore the dimension scores yourself; remember they are group averages, not descriptions of individuals.</li>
<li><a href="https://globeproject.com/" target="_blank" rel="noopener">GLOBE Project</a> — the official site of the GLOBE research programme on culture and leadership.</li>
<li><a href="https://erinmeyer.com/books/the-culture-map/" target="_blank" rel="noopener">Erin Meyer — The Culture Map</a> — the author's page introducing the eight scales (the book itself is copyrighted; this course only summarizes its ideas).</li>
<li><a href="https://www.pon.harvard.edu/" target="_blank" rel="noopener">Program on Negotiation at Harvard Law School</a> — free articles on negotiation strategy, BATNA, anchoring and cross-cultural negotiation.</li>
<li><a href="https://unglobalcompact.org/what-is-gc/mission/principles" target="_blank" rel="noopener">UN Global Compact — The Ten Principles</a> — human rights, labour, environment and anti-corruption.</li>
<li><a href="https://www.unodc.org/unodc/en/corruption/uncac.html" target="_blank" rel="noopener">UNODC — UN Convention against Corruption</a> — the global anti-corruption treaty explained.</li>
<li><a href="https://openstax.org/details/books/business-ethics" target="_blank" rel="noopener">Business Ethics</a> — OpenStax: a free, peer-reviewed open textbook on ethics, stakeholders and responsibility.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — short videos on global teams, leadership and negotiation.</li>
<li><a href="https://www.youtube.com/@INSEAD" target="_blank" rel="noopener">INSEAD</a> — the business school where Erin Meyer teaches; talks on cross-cultural management and global leadership.</li>
<li><a href="https://www.youtube.com/@StanfordGSB" target="_blank" rel="noopener">Stanford Graduate School of Business</a> — talks on negotiation, influence and leadership.</li>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED</a> — talks on culture, communication and conflict.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.worldtimebuddy.com/" target="_blank" rel="noopener">World Time Buddy</a> — find the overlap window of a team across time zones (Exercise 1).</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — build scoring systems and test every package automatically (Exercise 3).</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — an online whiteboard for team charters, culture maps and negotiation planning.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — the levels of culture, Hofstede, Trompenaars, Hall, GLOBE and Meyer, following Parts 1–2 here; for each framework write one workplace example.</li>
<li><strong>Practise</strong> — map a team you know on Meyer's eight scales, then write a one-page team charter.</li>
<li><strong>Go deeper</strong> — before any real negotiation (an internship offer, a rent, a group project split), write down BATNA, resistance point, target and opening for both sides.</li>
<li><strong>Apply</strong> — build a scoring system for a multi-issue case in a spreadsheet, list all packages, and find the Pareto frontier.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">IBC201 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học quản trị đa văn hoá và đàm phán: giáo trình &amp; slide chính thức, sách, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc đề cương, chuẩn đầu ra và slide bài giảng chính thức của IBC201. Môn học ở đây bám cấu trúc các giáo trình quốc tế chuẩn; luôn kiểm tra FLM để biết tài liệu và hình thức đánh giá mà lớp bạn sử dụng.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">International Management: Managing Across Borders and Cultures</a> — Helen Deresky (Pearson): văn hoá, giao tiếp, đạo đức, đàm phán, lãnh đạo và quản trị nhân sự xuyên biên giới. Tra tên sách trên trang nhà xuất bản.</li>
<li><a href="https://www.mheducation.com/" target="_blank" rel="noopener">Negotiation</a> — Roy J. Lewicki, David M. Saunders và Bruce Barry (McGraw Hill): đàm phán phân phối và tích hợp, nhận thức, đạo đức, đàm phán đa bên và quốc tế. Tra tên sách trên trang nhà xuất bản; còn có bản rút gọn <em>Essentials of Negotiation</em>.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.theculturefactor.com/country-comparison-tool" target="_blank" rel="noopener">The Culture Factor (trước đây là Hofstede Insights) — công cụ so sánh quốc gia</a> — tự khám phá điểm các chiều văn hoá; nhớ rằng đó là trung bình nhóm, không mô tả từng cá nhân.</li>
<li><a href="https://globeproject.com/" target="_blank" rel="noopener">GLOBE Project</a> — trang chính thức của chương trình nghiên cứu GLOBE về văn hoá và lãnh đạo.</li>
<li><a href="https://erinmeyer.com/books/the-culture-map/" target="_blank" rel="noopener">Erin Meyer — The Culture Map</a> — trang của tác giả giới thiệu tám thang đo (bản thân cuốn sách có bản quyền; môn học chỉ tóm tắt ý tưởng).</li>
<li><a href="https://www.pon.harvard.edu/" target="_blank" rel="noopener">Program on Negotiation — Trường Luật Harvard</a> — bài viết miễn phí về chiến lược đàm phán, BATNA, neo giá và đàm phán xuyên văn hoá.</li>
<li><a href="https://unglobalcompact.org/what-is-gc/mission/principles" target="_blank" rel="noopener">UN Global Compact — Mười nguyên tắc</a> — quyền con người, lao động, môi trường và chống tham nhũng.</li>
<li><a href="https://www.unodc.org/unodc/en/corruption/uncac.html" target="_blank" rel="noopener">UNODC — Công ước Liên hợp quốc về chống tham nhũng</a> — giới thiệu điều ước toàn cầu về chống tham nhũng.</li>
<li><a href="https://openstax.org/details/books/business-ethics" target="_blank" rel="noopener">Business Ethics</a> — OpenStax: giáo trình mở miễn phí, có bình duyệt, về đạo đức, các bên liên quan và trách nhiệm.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — video ngắn về đội toàn cầu, lãnh đạo và đàm phán.</li>
<li><a href="https://www.youtube.com/@INSEAD" target="_blank" rel="noopener">INSEAD</a> — trường kinh doanh nơi Erin Meyer giảng dạy; các bài nói về quản trị xuyên văn hoá và lãnh đạo toàn cầu.</li>
<li><a href="https://www.youtube.com/@StanfordGSB" target="_blank" rel="noopener">Stanford Graduate School of Business</a> — bài nói về đàm phán, gây ảnh hưởng và lãnh đạo.</li>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED</a> — bài nói về văn hoá, giao tiếp và xung đột.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.worldtimebuddy.com/" target="_blank" rel="noopener">World Time Buddy</a> — tìm khung giờ trùng nhau của một đội ở nhiều múi giờ (Bài tập 1).</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — dựng bảng điểm và tự động chấm mọi gói phương án (Bài tập 3).</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — bảng trắng trực tuyến để soạn hiến chương nhóm, bản đồ văn hoá và kế hoạch đàm phán.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — các cấp độ văn hoá, Hofstede, Trompenaars, Hall, GLOBE và Meyer, theo đúng Phần 1–2 ở đây; với mỗi khung, viết một ví dụ ở nơi làm việc.</li>
<li><strong>Luyện tập</strong> — đặt một đội bạn quen lên tám thang đo của Meyer, rồi viết hiến chương nhóm dài một trang.</li>
<li><strong>Đào sâu</strong> — trước mỗi cuộc đàm phán thật (lời mời thực tập, tiền thuê nhà, chia việc nhóm), ghi ra BATNA, điểm kháng cự, mục tiêu và đề nghị mở đầu của cả hai bên.</li>
<li><strong>Vận dụng</strong> — dựng bảng điểm cho một tình huống nhiều vấn đề trên bảng tính, liệt kê mọi gói phương án và tìm đường biên Pareto.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'IBC201',
    slug: 'ibc201-cross-cultural-management-and-negotiation',
    title: 'Cross Cultural Management and Negotiation',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IBC201.webp',
    shortDescription: 'Managing culture and negotiating across borders: Hofstede, Trompenaars, Hall, GLOBE, Meyer, CQ, global teams, expatriates, ethics; BATNA, ZOPA, anchoring, logrolling, Pareto, multiparty and cross-cultural deals. Bilingual, with exercises.|||Quản trị văn hoá và đàm phán xuyên biên giới: Hofstede, Trompenaars, Hall, GLOBE, Meyer, CQ, đội toàn cầu, expat, đạo đức; BATNA, ZOPA, neo giá, trao đổi chéo, Pareto, đàm phán đa bên và quốc tế. Song ngữ, có bài tập.',
    description: 'Môn <strong>IBC201 — Cross Cultural Management and Negotiation (Quản trị đa văn hoá và đàm phán)</strong> (khối Quản trị Kinh doanh, kỳ 3) trao hai bộ công cụ: <strong>hiểu và quản trị khác biệt văn hoá</strong>, và <strong>đàm phán</strong> từ hai bên tới đa bên, xuyên biên giới. Từ <strong>văn hoá và các khung so sánh</strong> (Schein, củ hành Hofstede, sáu chiều Hofstede, Trompenaars, Hall, GLOBE — trình bày định tính, kèm giới hạn của các khung) → <strong>giao tiếp, thích nghi và làm việc nhóm</strong> (tám thang đo của Meyer, cú sốc văn hoá, trí tuệ văn hoá CQ, đội đa văn hoá và đội ảo) → <strong>lãnh đạo, nhân sự quốc tế và đạo đức</strong> (GLOBE CLT, EPRG, chu trình expat, luật chống hối lộ) → <strong>nền tảng đàm phán</strong> (BATNA, điểm kháng cự, ZOPA, neo giá, thiên kiến, đạo đức) → <strong>đàm phán tích hợp, đa bên và quốc tế</strong> (bảng điểm, trao đổi chéo, hiệu quả Pareto, liên minh, mười yếu tố của Salacuse). Bám cấu trúc giáo trình của Deresky và Lewicki, Saunders &amp; Barry, song ngữ Anh–Việt, tình huống hư cấu và số liệu minh hoạ đã kiểm bằng máy, có bài tập kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Giải thích văn hoá qua ba cấp độ của Schein và mô hình củ hành của Hofstede\nSo sánh văn hoá bằng Hofstede, Trompenaars, Hall, GLOBE và nêu được giới hạn của các khung\nChẩn đoán vấn đề giao tiếp trong đội bằng tám thang đo của Meyer và đề xuất hiến chương nhóm\nNhận diện cú sốc văn hoá (đường cong U, W) và phát triển bốn thành phần trí tuệ văn hoá CQ\nPhân tích lãnh đạo theo GLOBE, định hướng nhân sự EPRG và chu trình nhân viên biệt phái\nXử lý thế lưỡng nan đạo đức quốc tế và nắm nguyên tắc chung của luật chống hối lộ\nChuẩn bị đàm phán bằng BATNA, điểm kháng cự, ZOPA, chiến lược neo và khuôn mẫu nhượng bộ\nDùng bảng điểm, trao đổi chéo và hiệu quả Pareto; áp dụng khung Salacuse cho đàm phán quốc tế',
    requirements: 'Nên học trước OBE102c — Organizational Behavior (giao tiếp, xung đột, BATNA và ZOPA cơ bản)\nĐọc hiểu tiếng Anh chuyên ngành ở mức cơ bản\nBảng tính (Excel, Google Sheets) để chấm điểm các gói phương án đàm phán',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Hai bộ công cụ của môn, lộ trình, dùng khung văn hoá có trách nhiệm.', lessons: [intro] },
    { title: 'Part 1 — Culture and cultural frameworks|||Phần 1 — Văn hoá và các khung văn hoá', description: 'Schein, củ hành Hofstede, sáu chiều Hofstede, Trompenaars, Hall, GLOBE, giới hạn.', lessons: [c1, c2, c3, c3q] },
    { title: 'Part 2 — Communication, adjustment and teams|||Phần 2 — Giao tiếp, thích nghi và làm việc nhóm', description: 'Tám thang đo Meyer, cú sốc văn hoá, CQ, đội đa văn hoá và đội ảo.', lessons: [c4, c5, c6, c6e, c6q] },
    { title: 'Part 3 — Leading, staffing and ethics across borders|||Phần 3 — Lãnh đạo, nhân sự và đạo đức xuyên biên giới', description: 'GLOBE CLT, động lực, EPRG, expat, hồi hương, đạo đức, chống hối lộ.', lessons: [c7, c8, c9, c9q] },
    { title: 'Part 4 — Negotiation fundamentals|||Phần 4 — Nền tảng đàm phán', description: 'BATNA, điểm kháng cự, ZOPA, neo giá, nhượng bộ, thiên kiến, đạo đức.', lessons: [c10, c11, c11e, c11q] },
    { title: 'Part 5 — Integrative, multiparty and international negotiation|||Phần 5 — Đàm phán tích hợp, đa bên và quốc tế', description: 'Lợi ích, bảng điểm, trao đổi chéo, Pareto, liên minh, Salacuse, Weiss.', lessons: [c12, c13, c14, c14e, c14q] },
  ],
};
