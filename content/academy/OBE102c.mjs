/**
 * OBE102c — Organizational Behavior (Hành vi tổ chức). Khối Quản trị Kinh doanh, kỳ 2.
 * Bám cấu trúc giáo trình hành vi tổ chức chuẩn (vd Robbins & Judge — Organizational Behavior;
 * OpenStax — Organizational Behavior): cá nhân (thái độ, cảm xúc, tính cách, nhận thức),
 * động lực, nhóm & đội, giao tiếp – xung đột – đàm phán, lãnh đạo – quyền lực, văn hoá & thay đổi.
 * Song ngữ + ví dụ (số đã kiểm; tình huống GIẢ ĐỊNH) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('obe102c-0-1-overview', 'Course overview: why people behave as they do at work|||Tổng quan: vì sao con người hành xử như vậy ở nơi làm việc',
  'Hành vi tổ chức là gì, ba cấp độ phân tích, các ngành đóng góp, mô hình đầu vào – quá trình – kết quả, thách thức và cơ hội hiện nay, lộ trình môn.',
  [[
    `<span class="eyebrow">OBE102c · Lesson 0.1 · Overview</span>
<h2>Organizational Behavior</h2>
<p class="lead"><strong>Organizational behavior (OB)</strong> studies the impact that individuals, groups and structure have on behaviour within organizations, and uses that knowledge to make organizations more effective. It replaces "gut feeling" about people with <strong>systematic study</strong> and evidence.</p>
<h3>Three levels of analysis</h3>
<table>
<tr><th>Level</th><th>Questions</th></tr>
<tr><td>Individual</td><td>Why are some people more satisfied, motivated or stressed than others? How do personality, perception and emotions shape decisions?</td></tr>
<tr><td>Group</td><td>Why do some teams perform brilliantly and others fall apart? How do communication, conflict and leadership work?</td></tr>
<tr><td>Organization</td><td>How do culture, structure and change affect everyone inside?</td></tr>
</table>
<h3>Where OB comes from</h3>
<p>OB draws on <strong>psychology</strong> (individual behaviour, learning, personality), <strong>social psychology</strong> (attitudes, group influence, change), <strong>sociology</strong> (groups, structure, culture) and <strong>anthropology</strong> (values and societies). Few rules are absolute: OB relies on <em>contingency</em> thinking — "it depends on the situation".</p>
<h3>A simple model</h3>
<pre><code>INPUTS                    PROCESSES                     OUTCOMES
personality, values   ->  emotions, perception,     ->  attitudes and stress, task
group roles, structure    motivation, communication,     performance, citizenship,
culture                   leadership, conflict           withdrawal, team and
                                                          organizational effectiveness</code></pre>
<h3>Why OB matters now</h3>
<p>Workforce diversity, globalization, remote and hybrid work, fast technological change (including AI), and higher expectations of ethics and well-being all make "people skills" a core management competence, not a soft extra.</p>
<h3>Roadmap</h3>
<p>Part 1: the individual · Part 2: motivation · Part 3: groups, teams, communication, conflict and negotiation · Part 4: leadership, power, culture and change. Each part ends with a quiz; parts 2 and 3 include exercises.</p>
<div class="callout"><span class="badge">How to study</span> After every lesson, apply one idea to a group you actually belong to — a class team, a club, a part-time job. OB is learned by noticing behaviour, not by memorizing lists.</div>`,
    `<span class="eyebrow">OBE102c · Bài 0.1 · Tổng quan</span>
<h2>Hành vi tổ chức</h2>
<p class="lead"><strong>Hành vi tổ chức (OB)</strong> nghiên cứu tác động của cá nhân, nhóm và cơ cấu lên hành vi bên trong tổ chức, và dùng hiểu biết đó để tổ chức hoạt động hiệu quả hơn. Nó thay "cảm tính" về con người bằng <strong>nghiên cứu có hệ thống</strong> và bằng chứng.</p>
<h3>Ba cấp độ phân tích</h3>
<table>
<tr><th>Cấp độ</th><th>Câu hỏi</th></tr>
<tr><td>Cá nhân</td><td>Vì sao có người hài lòng, có động lực hay căng thẳng hơn người khác? Tính cách, nhận thức và cảm xúc định hình quyết định ra sao?</td></tr>
<tr><td>Nhóm</td><td>Vì sao có đội làm việc xuất sắc, có đội tan rã? Giao tiếp, xung đột và lãnh đạo vận hành thế nào?</td></tr>
<tr><td>Tổ chức</td><td>Văn hoá, cơ cấu và thay đổi tác động ra sao tới mọi người bên trong?</td></tr>
</table>
<h3>Hành vi tổ chức bắt nguồn từ đâu</h3>
<p>OB dựa trên <strong>tâm lý học</strong> (hành vi cá nhân, học hỏi, tính cách), <strong>tâm lý học xã hội</strong> (thái độ, ảnh hưởng của nhóm, thay đổi), <strong>xã hội học</strong> (nhóm, cơ cấu, văn hoá) và <strong>nhân học</strong> (giá trị và xã hội). Rất ít quy luật là tuyệt đối: OB dựa vào tư duy <em>tình huống</em> — "tuỳ vào hoàn cảnh".</p>
<h3>Một mô hình đơn giản</h3>
<pre><code>ĐẦU VÀO                   QUÁ TRÌNH                     KẾT QUẢ
tính cách, giá trị    ->  cảm xúc, nhận thức,       ->  thái độ và căng thẳng, kết quả
vai trò nhóm, cơ cấu      động lực, giao tiếp,          công việc, hành vi công dân,
văn hoá                   lãnh đạo, xung đột            rút lui, hiệu quả của đội
                                                         và của tổ chức</code></pre>
<h3>Vì sao OB quan trọng lúc này</h3>
<p>Lực lượng lao động đa dạng, toàn cầu hoá, làm việc từ xa và kết hợp, công nghệ thay đổi nhanh (kể cả AI), cùng kỳ vọng cao hơn về đạo đức và sức khoẻ tinh thần khiến "kỹ năng con người" trở thành năng lực quản trị cốt lõi, không phải phần phụ.</p>
<h3>Lộ trình</h3>
<p>Phần 1: cá nhân · Phần 2: động lực · Phần 3: nhóm, đội, giao tiếp, xung đột và đàm phán · Phần 4: lãnh đạo, quyền lực, văn hoá và thay đổi. Mỗi phần kết thúc bằng một bài quiz; phần 2 và 3 có bài tập.</p>
<div class="callout"><span class="badge">Cách học</span> Sau mỗi bài, áp một ý vào một nhóm bạn đang thực sự tham gia — nhóm học tập, câu lạc bộ, chỗ làm thêm. Hành vi tổ chức được học bằng cách quan sát hành vi, không phải học thuộc danh sách.</div>`,
  ]]);

const c1 = doc('obe102c-1-1-attitudes-emotions', '1.1 — Diversity, attitudes, job satisfaction & emotions|||1.1 — Đa dạng, thái độ, sự hài lòng & cảm xúc',
  'Đa dạng bề mặt và đa dạng sâu, ba thành phần của thái độ và bất hoà nhận thức, sự hài lòng trong công việc và khung phản ứng thoát – lên tiếng – trung thành – thờ ơ, cảm xúc và tâm trạng, lao động cảm xúc, trí tuệ cảm xúc.',
  [[
    `<span class="eyebrow">OBE102c · Part 1 · Lesson 1.1</span>
<h2>Diversity, attitudes, job satisfaction &amp; emotions</h2>
<h3>Diversity</h3>
<p><strong>Surface-level diversity</strong> covers easily seen characteristics (age, gender, ethnicity, disability); <strong>deep-level diversity</strong> covers differences in values, personality and work preferences, which become more important as people get to know each other. Well-managed diversity broadens perspectives and improves decisions; badly managed, it breeds stereotyping and conflict.</p>
<h3>Attitudes</h3>
<p>An attitude is an evaluative statement about objects, people or events. It has three components: <strong>cognitive</strong> (a belief — "my manager gives the good projects to her friends"), <strong>affective</strong> (a feeling — "I resent that") and <strong>behavioural</strong> (an intention — "I will look for another job"). When attitudes and behaviour conflict, people feel <strong>cognitive dissonance</strong> and try to reduce it by changing either the attitude or the behaviour, or by rationalizing.</p>
<h3>Job satisfaction</h3>
<p>Job satisfaction is a positive feeling about one's job. It is driven most by the <em>work itself</em> (interesting tasks, autonomy, feedback), relations with colleagues and supervisors, fair pay and personality. Dissatisfied employees respond in four ways:</p>
<table>
<tr><th></th><th>Constructive</th><th>Destructive</th></tr>
<tr><td><strong>Active</strong></td><td>Voice — suggest improvements, discuss problems</td><td>Exit — look for a new job, resign</td></tr>
<tr><td><strong>Passive</strong></td><td>Loyalty — wait optimistically for things to improve</td><td>Neglect — absenteeism, lateness, reduced effort</td></tr>
</table>
<p>Satisfied employees tend to perform better, show more <strong>organizational citizenship behaviour</strong> (helping beyond the job description) and satisfy customers better.</p>
<h3>Emotions and moods</h3>
<p><strong>Emotions</strong> are intense, short feelings directed at something; <strong>moods</strong> are weaker, longer-lasting and often without a clear cause. <strong>Emotional labour</strong> is expressing organizationally desired emotions — a hotel receptionist smiling after a rude guest; the gap between felt and displayed emotion (<em>emotional dissonance</em>) is tiring. <strong>Emotional intelligence</strong> — perceiving, understanding and managing emotions in oneself and others — helps in jobs with heavy social interaction.</p>
<div class="callout"><span class="badge">Manager's takeaway</span> Listen for "voice" early. Employees who stop complaining are not always satisfied — they may already be on the exit or neglect path.</div>`,
    `<span class="eyebrow">OBE102c · Phần 1 · Bài 1.1</span>
<h2>Đa dạng, thái độ, sự hài lòng &amp; cảm xúc</h2>
<h3>Sự đa dạng</h3>
<p><strong>Đa dạng bề mặt</strong> gồm các đặc điểm dễ thấy (tuổi, giới tính, dân tộc, khuyết tật); <strong>đa dạng sâu</strong> gồm khác biệt về giá trị, tính cách và sở thích làm việc, ngày càng quan trọng khi mọi người hiểu nhau hơn. Được quản lý tốt, đa dạng mở rộng góc nhìn và cải thiện quyết định; quản lý kém, nó sinh ra định kiến và xung đột.</p>
<h3>Thái độ</h3>
<p>Thái độ là một phát biểu mang tính đánh giá về sự vật, con người hay sự kiện. Thái độ có ba thành phần: <strong>nhận thức</strong> (một niềm tin — "sếp giao dự án tốt cho bạn thân"), <strong>cảm xúc</strong> (một cảm giác — "tôi thấy bực bội") và <strong>hành vi</strong> (một ý định — "tôi sẽ tìm việc khác"). Khi thái độ và hành vi mâu thuẫn, con người cảm thấy <strong>bất hoà nhận thức</strong> và tìm cách giảm nó bằng cách đổi thái độ, đổi hành vi, hoặc tự hợp lý hoá.</p>
<h3>Sự hài lòng trong công việc</h3>
<p>Sự hài lòng trong công việc là cảm giác tích cực về công việc của mình. Nó chịu tác động mạnh nhất từ <em>bản thân công việc</em> (nhiệm vụ thú vị, quyền tự chủ, phản hồi), quan hệ với đồng nghiệp và cấp trên, sự công bằng về lương và tính cách. Người không hài lòng phản ứng theo bốn cách:</p>
<table>
<tr><th></th><th>Mang tính xây dựng</th><th>Mang tính phá hoại</th></tr>
<tr><td><strong>Chủ động</strong></td><td>Lên tiếng — đề xuất cải tiến, trao đổi vấn đề</td><td>Thoát — tìm việc mới, nghỉ việc</td></tr>
<tr><td><strong>Thụ động</strong></td><td>Trung thành — lạc quan chờ mọi thứ tốt lên</td><td>Thờ ơ — vắng mặt, đi muộn, giảm nỗ lực</td></tr>
</table>
<p>Nhân viên hài lòng thường làm việc tốt hơn, có nhiều <strong>hành vi công dân tổ chức</strong> hơn (giúp đỡ vượt ngoài mô tả công việc) và làm khách hàng hài lòng hơn.</p>
<h3>Cảm xúc và tâm trạng</h3>
<p><strong>Cảm xúc</strong> là cảm giác mạnh, ngắn và hướng vào một đối tượng; <strong>tâm trạng</strong> yếu hơn, kéo dài hơn và thường không có nguyên nhân rõ ràng. <strong>Lao động cảm xúc</strong> là thể hiện cảm xúc mà tổ chức mong muốn — lễ tân khách sạn vẫn mỉm cười sau một vị khách thô lỗ; khoảng cách giữa cảm xúc thật và cảm xúc thể hiện (<em>bất hoà cảm xúc</em>) gây mệt mỏi. <strong>Trí tuệ cảm xúc</strong> — nhận biết, hiểu và điều tiết cảm xúc của mình và người khác — giúp ích trong các công việc tương tác xã hội nhiều.</p>
<div class="callout"><span class="badge">Cho nhà quản trị</span> Hãy lắng nghe sự "lên tiếng" từ sớm. Nhân viên thôi phàn nàn chưa chắc đã hài lòng — có thể họ đã sang con đường thoát hoặc thờ ơ.</div>`,
  ]]);

const c2 = doc('obe102c-1-2-personality-perception', '1.2 — Personality, values, perception & attribution|||1.2 — Tính cách, giá trị, nhận thức & quy kết',
  'Mô hình năm yếu tố tính cách (Big Five) và mức liên quan tới kết quả công việc, giới hạn của MBTI, giá trị, nhận thức và các yếu tố ảnh hưởng, lý thuyết quy kết (tính khác biệt, đồng thuận, nhất quán), các thiên kiến nhận thức phổ biến.',
  [[
    `<span class="eyebrow">OBE102c · Part 1 · Lesson 1.2</span>
<h2>Personality, values, perception &amp; attribution</h2>
<h3>Personality: the Big Five</h3>
<table>
<tr><th>Trait</th><th>High scorers are…</th><th>Link to work</th></tr>
<tr><td>Conscientiousness</td><td>Responsible, organized, persistent</td><td>The most consistent predictor of job performance across jobs</td></tr>
<tr><td>Emotional stability</td><td>Calm, secure (low = anxious)</td><td>Higher satisfaction, lower stress</td></tr>
<tr><td>Extraversion</td><td>Sociable, assertive</td><td>Helps in sales, management and leadership emergence</td></tr>
<tr><td>Openness to experience</td><td>Curious, creative</td><td>Creativity, adapting to change</td></tr>
<tr><td>Agreeableness</td><td>Cooperative, warm, trusting</td><td>Good in teams and service; less effective in hard negotiation</td></tr>
</table>
<p>The popular <strong>Myers-Briggs Type Indicator (MBTI)</strong> can support self-reflection, but evidence that it predicts job performance is weak — it should not be used for hiring decisions. <strong>Values</strong> are basic convictions about what is right or desirable; Rokeach distinguished <em>terminal</em> values (desired end-states, such as a comfortable life) from <em>instrumental</em> values (preferred ways of behaving, such as honesty). Person–organization fit matters: people are more satisfied where the organization's values match their own.</p>
<h3>Perception and attribution</h3>
<p><strong>Perception</strong> is how we organize and interpret sensory impressions; what we perceive can differ from objective reality and is shaped by the perceiver, the target and the situation. <strong>Attribution theory</strong> asks whether we explain someone's behaviour by internal causes (ability, effort) or external ones (luck, circumstances), using three cues:</p>
<pre><code>Distinctiveness  — does the person behave this way only in this situation?  high -> external
Consensus        — do others behave the same way in this situation?          high -> external
Consistency      — does the person behave this way over time?                 high -> internal
Example: Minh is late today; he is late often (high consistency), in many settings (low
distinctiveness), and colleagues arrive on time (low consensus) -> we attribute it to Minh.</code></pre>
<h3>Common perceptual errors</h3>
<ul>
<li><strong>Fundamental attribution error</strong> — underestimating external factors and overestimating internal ones when judging others.</li>
<li><strong>Self-serving bias</strong> — crediting our successes to ourselves and blaming failures on outside factors.</li>
<li><strong>Selective perception</strong>, the <strong>halo effect</strong> (one trait colours the whole judgement), <strong>contrast effects</strong> and <strong>stereotyping</strong>.</li>
</ul>
<div class="callout"><span class="badge">Application</span> In performance reviews and interviews, these errors are costly. Structured criteria, multiple raters and written evidence reduce them.</div>`,
    `<span class="eyebrow">OBE102c · Phần 1 · Bài 1.2</span>
<h2>Tính cách, giá trị, nhận thức &amp; quy kết</h2>
<h3>Tính cách: mô hình năm yếu tố (Big Five)</h3>
<table>
<tr><th>Yếu tố</th><th>Người điểm cao thường…</th><th>Liên hệ công việc</th></tr>
<tr><td>Tận tâm</td><td>Có trách nhiệm, ngăn nắp, bền bỉ</td><td>Yếu tố dự báo kết quả công việc ổn định nhất ở mọi loại công việc</td></tr>
<tr><td>Ổn định cảm xúc</td><td>Bình tĩnh, vững vàng (thấp = hay lo âu)</td><td>Hài lòng cao hơn, căng thẳng thấp hơn</td></tr>
<tr><td>Hướng ngoại</td><td>Hoà đồng, quyết đoán</td><td>Có lợi trong bán hàng, quản lý và việc nổi lên làm người lãnh đạo</td></tr>
<tr><td>Cởi mở với trải nghiệm</td><td>Tò mò, sáng tạo</td><td>Sáng tạo, thích nghi với thay đổi</td></tr>
<tr><td>Dễ chịu</td><td>Hợp tác, ấm áp, tin người</td><td>Tốt trong làm việc nhóm và dịch vụ; kém hiệu quả hơn khi đàm phán cứng rắn</td></tr>
</table>
<p>Công cụ phổ biến <strong>Myers-Briggs Type Indicator (MBTI)</strong> có thể hỗ trợ tự nhìn nhận, nhưng bằng chứng về khả năng dự báo kết quả công việc của nó yếu — không nên dùng để ra quyết định tuyển dụng. <strong>Giá trị</strong> là những niềm tin nền tảng về điều đúng hay đáng mong muốn; Rokeach phân biệt giá trị <em>mục đích</em> (trạng thái cuối mong muốn, như cuộc sống sung túc) với giá trị <em>công cụ</em> (cách hành xử ưa thích, như trung thực). Sự phù hợp giữa cá nhân và tổ chức rất quan trọng: người ta hài lòng hơn ở nơi có giá trị giống mình.</p>
<h3>Nhận thức và quy kết</h3>
<p><strong>Nhận thức</strong> là cách ta sắp xếp và diễn giải các ấn tượng giác quan; điều ta nhận thấy có thể khác thực tế khách quan và chịu ảnh hưởng của người nhận thức, đối tượng và tình huống. <strong>Lý thuyết quy kết</strong> xem ta giải thích hành vi của người khác bằng nguyên nhân bên trong (năng lực, nỗ lực) hay bên ngoài (may rủi, hoàn cảnh), dựa trên ba dấu hiệu:</p>
<pre><code>Tính khác biệt — người đó chỉ hành xử như vậy trong tình huống này?     cao -> bên ngoài
Tính đồng thuận — người khác cũng hành xử như vậy trong tình huống này? cao -> bên ngoài
Tính nhất quán  — người đó hành xử như vậy qua thời gian?               cao -> bên trong
Ví dụ: hôm nay Minh đi muộn; Minh thường xuyên đi muộn (nhất quán cao), ở nhiều hoàn cảnh
(khác biệt thấp), còn đồng nghiệp đều đúng giờ (đồng thuận thấp) -> ta quy kết cho Minh.</code></pre>
<h3>Các lỗi nhận thức phổ biến</h3>
<ul>
<li><strong>Lỗi quy kết cơ bản</strong> — đánh giá thấp yếu tố bên ngoài và đánh giá cao yếu tố bên trong khi nhận xét người khác.</li>
<li><strong>Thiên kiến tự phục vụ</strong> — nhận thành công về mình và đổ thất bại cho yếu tố bên ngoài.</li>
<li><strong>Nhận thức chọn lọc</strong>, <strong>hiệu ứng hào quang</strong> (một đặc điểm chi phối toàn bộ đánh giá), <strong>hiệu ứng tương phản</strong> và <strong>rập khuôn</strong>.</li>
</ul>
<div class="callout"><span class="badge">Ứng dụng</span> Trong đánh giá kết quả và phỏng vấn, các lỗi này rất tốn kém. Tiêu chí có cấu trúc, nhiều người đánh giá và bằng chứng bằng văn bản giúp giảm chúng.</div>`,
  ]]);

const c2q = quiz('obe102c-quiz-1', 'Quiz 1 — The individual|||Quiz 1 — Cá nhân', [
  { id: 'q1', question: 'Which Big Five trait is the most consistent predictor of job performance across occupations?|||Yếu tố Big Five nào dự báo kết quả công việc ổn định nhất ở mọi ngành nghề?', options: ['Extraversion|||Hướng ngoại', 'Openness to experience|||Cởi mở với trải nghiệm', 'Conscientiousness|||Tận tâm', 'Agreeableness|||Dễ chịu'], correctIndex: 2, explanation: 'Responsible, organized, persistent people tend to perform well in almost every kind of job.|||Người có trách nhiệm, ngăn nắp, bền bỉ thường làm tốt ở hầu hết mọi loại công việc.' },
  { id: 'q2', question: 'The fundamental attribution error is the tendency to…|||Lỗi quy kết cơ bản là xu hướng…', options: ['credit our own success to ourselves|||nhận thành công về mình', 'underestimate external factors and overestimate internal factors when judging others|||đánh giá thấp yếu tố bên ngoài và đánh giá cao yếu tố bên trong khi nhận xét người khác', 'judge people by the group they belong to|||đánh giá người khác theo nhóm của họ', 'let one good trait shape the whole judgement|||để một đặc điểm tốt chi phối toàn bộ đánh giá'], correctIndex: 1, explanation: 'Option A is the self-serving bias, C is stereotyping and D is the halo effect.|||Phương án A là thiên kiến tự phục vụ, C là rập khuôn và D là hiệu ứng hào quang.' },
  { id: 'q3', question: 'An employee believes overtime is unfair but works late every night. The discomfort she feels is called…|||Một nhân viên tin rằng làm thêm giờ là bất công nhưng tối nào cũng ở lại muộn. Cảm giác khó chịu cô ấy trải qua gọi là…', options: ['emotional labour|||lao động cảm xúc', 'cognitive dissonance|||bất hoà nhận thức', 'the halo effect|||hiệu ứng hào quang', 'job enrichment|||làm phong phú công việc'], correctIndex: 1, explanation: 'Dissonance arises when behaviour and attitudes are inconsistent; she will try to reduce it.|||Bất hoà xuất hiện khi hành vi và thái độ không nhất quán; cô ấy sẽ tìm cách giảm nó.' },
]);

const c3 = doc('obe102c-2-1-motivation', '2.1 — Motivation: from concepts to application|||2.1 — Động lực: từ khái niệm tới ứng dụng',
  'Nhắc lại ngắn các thuyết nhu cầu, thuyết tự quyết và thuyết đánh giá nhận thức, thiết lập mục tiêu và tự hiệu quả, công bằng tổ chức (phân phối, thủ tục, tương tác), thuyết kỳ vọng, mô hình đặc điểm công việc với chỉ số MPS, thiết kế lại công việc, sự tham gia của nhân viên và phần thưởng.',
  [[
    `<span class="eyebrow">OBE102c · Part 2 · Lesson 2.1</span>
<h2>Motivation: from concepts to application</h2>
<p>Motivation is the process that accounts for a person's <strong>intensity</strong>, <strong>direction</strong> and <strong>persistence</strong> of effort toward a goal. The need theories (Maslow, Herzberg, McClelland — covered in MGT103) are intuitive, but OB research leans more on the theories below.</p>
<h3>Contemporary theories</h3>
<ul>
<li><strong>Self-determination theory</strong> — people want autonomy, competence and relatedness. Its <em>cognitive evaluation</em> part warns that adding extrinsic rewards to a task people already enjoy can reduce intrinsic motivation if the reward feels controlling.</li>
<li><strong>Goal-setting theory</strong> — specific, difficult goals that are accepted, with feedback, lead to higher performance. <strong>Self-efficacy</strong> — belief in one's ability to do the task — raises effort and persistence.</li>
<li><strong>Organizational justice</strong> — equity theory says people compare their outcome/input ratio with a referent. Justice has three parts: <em>distributive</em> (fair outcomes), <em>procedural</em> (fair processes used to decide) and <em>interactional</em> (being treated with dignity and given honest explanations).</li>
<li><strong>Expectancy theory</strong> — effort depends on expectancy (effort → performance), instrumentality (performance → reward) and valence (value of the reward).</li>
</ul>
<h3>Designing motivating jobs</h3>
<p>The <strong>job characteristics model</strong> (Hackman and Oldham) lists five core dimensions, each rated from 1 to 7: skill variety (SV), task identity (TI), task significance (TS), autonomy (A) and feedback (F). They combine into a <strong>motivating potential score</strong>:</p>
<pre><code>MPS = [(SV + TI + TS) / 3] x A x F
Autonomy and feedback MULTIPLY: if either is very low, MPS is low
however interesting the tasks are.</code></pre>
<p>Ways to redesign work: <strong>job rotation</strong> (moving between tasks), <strong>job enrichment</strong> (adding responsibility and control, e.g. letting staff solve customer problems themselves), <strong>relational job design</strong> (showing employees how their work helps real people), and alternative arrangements (flexible hours, job sharing, remote work). Employees can also be motivated through <strong>involvement</strong> (participative management, representative participation) and well-designed <strong>rewards</strong> — pay structures, variable pay tied to performance, benefits and recognition.</p>
<div class="callout"><span class="badge">Watch out</span> Paying people to do something they already love can backfire. Rewards should inform ("you did great work") rather than control ("do this and you get that").</div>`,
    `<span class="eyebrow">OBE102c · Phần 2 · Bài 2.1</span>
<h2>Động lực: từ khái niệm tới ứng dụng</h2>
<p>Động lực là quá trình quyết định <strong>cường độ</strong>, <strong>định hướng</strong> và <strong>sự bền bỉ</strong> trong nỗ lực của một người hướng tới mục tiêu. Các thuyết nhu cầu (Maslow, Herzberg, McClelland — đã học ở MGT103) dễ hiểu, nhưng nghiên cứu hành vi tổ chức dựa nhiều hơn vào các thuyết dưới đây.</p>
<h3>Các thuyết hiện đại</h3>
<ul>
<li><strong>Thuyết tự quyết</strong> — con người muốn tự chủ, có năng lực và được gắn kết. Phần <em>đánh giá nhận thức</em> của thuyết cảnh báo rằng thêm phần thưởng bên ngoài cho một việc người ta vốn đã thích có thể làm giảm động lực nội tại nếu phần thưởng mang cảm giác kiểm soát.</li>
<li><strong>Thuyết thiết lập mục tiêu</strong> — mục tiêu cụ thể, thách thức, được chấp nhận, kèm phản hồi, dẫn tới kết quả cao hơn. <strong>Tự hiệu quả</strong> — niềm tin vào khả năng làm được việc — làm tăng nỗ lực và sự bền bỉ.</li>
<li><strong>Công bằng tổ chức</strong> — thuyết công bằng cho rằng người ta so tỷ lệ kết quả/đóng góp của mình với người được so sánh. Công bằng có ba phần: <em>phân phối</em> (kết quả công bằng), <em>thủ tục</em> (quy trình ra quyết định công bằng) và <em>tương tác</em> (được đối xử tôn trọng và được giải thích trung thực).</li>
<li><strong>Thuyết kỳ vọng</strong> — nỗ lực phụ thuộc vào kỳ vọng (nỗ lực → kết quả), tính công cụ (kết quả → phần thưởng) và hoá trị (giá trị của phần thưởng).</li>
</ul>
<h3>Thiết kế công việc tạo động lực</h3>
<p><strong>Mô hình đặc điểm công việc</strong> (Hackman và Oldham) nêu năm chiều cốt lõi, mỗi chiều chấm từ 1 đến 7: đa dạng kỹ năng (SV), tính trọn vẹn của nhiệm vụ (TI), tầm quan trọng của nhiệm vụ (TS), quyền tự chủ (A) và phản hồi (F). Chúng kết hợp thành <strong>chỉ số tiềm năng động viên</strong>:</p>
<pre><code>MPS = [(SV + TI + TS) / 3] x A x F
Tự chủ và phản hồi là thừa số NHÂN: nếu một trong hai rất thấp thì MPS thấp
dù nhiệm vụ thú vị đến đâu.</code></pre>
<p>Các cách thiết kế lại công việc: <strong>luân chuyển công việc</strong> (chuyển qua lại giữa các nhiệm vụ), <strong>làm phong phú công việc</strong> (thêm trách nhiệm và quyền kiểm soát, vd cho nhân viên tự giải quyết vấn đề của khách hàng), <strong>thiết kế công việc theo quan hệ</strong> (cho nhân viên thấy công việc của họ giúp ích cho những con người cụ thể), và các cách bố trí khác (giờ linh hoạt, chia sẻ công việc, làm việc từ xa). Nhân viên còn được tạo động lực qua <strong>sự tham gia</strong> (quản lý có sự tham gia, tham gia qua đại diện) và <strong>phần thưởng</strong> được thiết kế tốt — cơ cấu lương, lương biến đổi gắn với kết quả, phúc lợi và sự công nhận.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Trả tiền để người ta làm việc họ vốn đã yêu thích có thể phản tác dụng. Phần thưởng nên mang tính ghi nhận ("bạn làm rất tốt") hơn là kiểm soát ("làm việc này thì được cái kia").</div>`,
  ]]);

const c3e = doc('obe102c-2-2-exercise', 'Exercise 1 — scoring and redesigning two jobs|||Bài tập 1 — chấm điểm và thiết kế lại hai công việc',
  'Bài tập: tính chỉ số tiềm năng động viên (MPS) cho nhân viên tổng đài và điều phối viên dự án, đề xuất thiết kế lại công việc tổng đài và tính lại MPS; phân tích một so sánh công bằng; kèm lời giải.',
  [[
    `<span class="eyebrow">OBE102c · Part 2 · Exercise</span>
<h2>Exercise 1 — which job motivates, and how to fix the other?</h2>
<div class="callout"><span class="badge">Problem</span> Ratings on a 1–7 scale (a fictional case). Call-centre agent: skill variety 2, task identity 3, task significance 4, autonomy 2, feedback 5. Project coordinator: skill variety 6, task identity 5, task significance 5, autonomy 6, feedback 4. (a) Compute both MPS values. (b) The company lets agents resolve common problems themselves (autonomy rises to 4) and rotates them across product lines (skill variety rises to 4). Recompute the agent's MPS. (c) Lan, an agent, earns VND 20 million a month for 45 hours a week; she learns that a colleague earns VND 22 million for 40 hours. Using equity theory, how might Lan react?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Agent:        [(2 + 3 + 4) / 3] x 2 x 5 = 3.00 x 10 = 30
    Coordinator:  [(6 + 5 + 5) / 3] x 6 x 4 = 5.33 x 24 = 128

(b) Redesigned agent job: [(4 + 3 + 4) / 3] x 4 x 5 = 3.67 x 20 = 73.3
    Raising autonomy from 2 to 4 alone doubles the score; the rotation adds the rest.

(c) Lan:       20 / 45 ≈ 0.44 million per weekly hour
    Colleague: 22 / 40 = 0.55 million per weekly hour
    Lan perceives under-reward inequity.</code></pre>
<p><strong>Why:</strong> because MPS multiplies autonomy and feedback, the cheapest big improvement is often to give people more control, not more tasks. In (c) equity theory predicts Lan may reduce her effort or hours, ask for a raise, change her perception (e.g. "the colleague has more experience"), choose a different comparison person, or leave. The comparison is <em>perceived</em>: a transparent, procedurally fair pay system reduces this risk.</p>`,
    `<span class="eyebrow">OBE102c · Phần 2 · Bài tập</span>
<h2>Bài tập 1 — công việc nào tạo động lực, và sửa công việc kia thế nào?</h2>
<div class="callout"><span class="badge">Đề</span> Điểm chấm trên thang 1–7 (tình huống giả định). Nhân viên tổng đài: đa dạng kỹ năng 2, tính trọn vẹn 3, tầm quan trọng 4, tự chủ 2, phản hồi 5. Điều phối viên dự án: đa dạng kỹ năng 6, tính trọn vẹn 5, tầm quan trọng 5, tự chủ 6, phản hồi 4. (a) Tính MPS của hai công việc. (b) Công ty cho nhân viên tổng đài tự xử lý các vấn đề thường gặp (tự chủ tăng lên 4) và luân chuyển họ qua các dòng sản phẩm (đa dạng kỹ năng tăng lên 4). Tính lại MPS. (c) Lan, một nhân viên tổng đài, nhận 20 triệu đồng mỗi tháng cho 45 giờ mỗi tuần; cô biết một đồng nghiệp nhận 22 triệu cho 40 giờ. Theo thuyết công bằng, Lan có thể phản ứng thế nào?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Tổng đài:     [(2 + 3 + 4) / 3] x 2 x 5 = 3,00 x 10 = 30
    Điều phối:    [(6 + 5 + 5) / 3] x 6 x 4 = 5,33 x 24 = 128

(b) Công việc tổng đài sau thiết kế lại: [(4 + 3 + 4) / 3] x 4 x 5 = 3,67 x 20 = 73,3
    Chỉ riêng việc nâng tự chủ từ 2 lên 4 đã làm điểm tăng gấp đôi; luân chuyển góp phần còn lại.

(c) Lan:         20 / 45 ≈ 0,44 triệu cho mỗi giờ/tuần
    Đồng nghiệp: 22 / 40 = 0,55 triệu cho mỗi giờ/tuần
    Lan cảm thấy bất công theo hướng bị trả thấp.</code></pre>
<p><strong>Vì sao:</strong> vì MPS nhân tự chủ với phản hồi, cách cải thiện lớn và rẻ nhất thường là trao thêm quyền kiểm soát chứ không phải thêm việc. Ở (c), thuyết công bằng dự đoán Lan có thể giảm nỗ lực hoặc giờ làm, đề nghị tăng lương, thay đổi nhận thức (vd "đồng nghiệp có kinh nghiệm hơn"), chọn người khác để so sánh, hoặc nghỉ việc. Sự so sánh này là <em>do cảm nhận</em>: một hệ thống lương minh bạch, có thủ tục công bằng giúp giảm rủi ro đó.</p>`,
  ]]);

const c3q = quiz('obe102c-quiz-2', 'Quiz 2 — Motivation|||Quiz 2 — Động lực', [
  { id: 'q1', question: 'In the motivating potential score, which two dimensions act as multipliers?|||Trong chỉ số tiềm năng động viên, hai chiều nào đóng vai trò thừa số nhân?', options: ['Skill variety and task identity|||Đa dạng kỹ năng và tính trọn vẹn', 'Autonomy and feedback|||Tự chủ và phản hồi', 'Task significance and pay|||Tầm quan trọng và lương', 'Task identity and feedback|||Tính trọn vẹn và phản hồi'], correctIndex: 1, explanation: 'MPS = [(SV + TI + TS)/3] x A x F, so low autonomy or feedback drags the whole score down.|||MPS = [(SV + TI + TS)/3] x A x F, nên tự chủ hoặc phản hồi thấp kéo cả điểm xuống.' },
  { id: 'q2', question: 'Employees accept a pay cut because the decision process was open and consistent. This reflects…|||Nhân viên chấp nhận giảm lương vì quy trình ra quyết định công khai và nhất quán. Điều này thể hiện…', options: ['distributive justice|||công bằng phân phối', 'procedural justice|||công bằng thủ tục', 'the halo effect|||hiệu ứng hào quang', 'job rotation|||luân chuyển công việc'], correctIndex: 1, explanation: 'Procedural justice is the perceived fairness of the process used to decide outcomes.|||Công bằng thủ tục là cảm nhận về tính công bằng của quy trình dùng để quyết định kết quả.' },
  { id: 'q3', question: 'According to cognitive evaluation theory, paying people to do a task they already enjoy may…|||Theo thuyết đánh giá nhận thức, trả tiền để người ta làm việc họ vốn đã thích có thể…', options: ['always increase motivation|||luôn làm tăng động lực', 'reduce intrinsic motivation if the reward feels controlling|||làm giảm động lực nội tại nếu phần thưởng mang cảm giác kiểm soát', 'have no effect at all|||không có tác động gì', 'only affect hygiene factors|||chỉ ảnh hưởng nhân tố duy trì'], correctIndex: 1, explanation: 'Rewards that feel controlling shift the reason for working from “I like it” to “I am paid for it”.|||Phần thưởng mang cảm giác kiểm soát đổi lý do làm việc từ “tôi thích” sang “tôi được trả tiền”.' },
]);

const c4 = doc('obe102c-3-1-groups-teams', '3.1 — Groups and teams|||3.1 — Nhóm và đội',
  'Nhóm chính thức và không chính thức, năm giai đoạn phát triển nhóm (Tuckman) và mô hình cân bằng ngắt quãng, vai trò, chuẩn mực, địa vị, quy mô và hiện tượng ỷ lại, tính gắn kết, tư duy nhóm và dịch chuyển nhóm; các loại đội và mô hình đội hiệu quả.',
  [[
    `<span class="eyebrow">OBE102c · Part 3 · Lesson 3.1</span>
<h2>Groups and teams</h2>
<h3>Groups and how they develop</h3>
<p>A <strong>group</strong> is two or more interacting, interdependent people who come together to achieve objectives. <strong>Formal groups</strong> are defined by the structure (a department, a project); <strong>informal groups</strong> form naturally from friendship and shared interests. Tuckman's five stages describe how many groups develop:</p>
<table>
<tr><th>Stage</th><th>What happens</th></tr>
<tr><td>Forming</td><td>Uncertainty about purpose, structure and leadership</td></tr>
<tr><td>Storming</td><td>Conflict over who controls the group and how</td></tr>
<tr><td>Norming</td><td>Closer relationships, shared expectations, cohesion</td></tr>
<tr><td>Performing</td><td>Energy goes into the task</td></tr>
<tr><td>Adjourning</td><td>Temporary groups wrap up</td></tr>
</table>
<p>Temporary groups with deadlines often follow a <strong>punctuated-equilibrium</strong> pattern instead: little progress in the first half, then a burst of change around the midpoint.</p>
<h3>Group properties</h3>
<ul>
<li><strong>Roles</strong> — expected behaviours; conflict arises when roles clash.</li>
<li><strong>Norms</strong> — shared standards of acceptable behaviour (how hard to work, how to dress, when to arrive); groups pressure members to conform.</li>
<li><strong>Status</strong> — socially defined rank; big status differences can silence low-status members.</li>
<li><strong>Size</strong> — larger groups generate more ideas but suffer <strong>social loafing</strong>, the tendency to exert less effort when working collectively. Remedies: smaller groups, identifiable individual contributions, clear goals.</li>
<li><strong>Cohesiveness</strong> — how attracted members are to each other; high cohesion raises performance only when the group's norms support performance.</li>
</ul>
<p>Group decisions offer more information and acceptance but take time and risk <strong>groupthink</strong> (pressure to agree suppresses dissent) and <strong>groupshift</strong> (the group's final position becomes more extreme than members' initial views).</p>
<h3>Teams</h3>
<p>A <strong>work team</strong> generates positive synergy through coordinated effort; performance is greater than the sum of individual inputs. Types: <em>problem-solving</em>, <em>self-managed</em>, <em>cross-functional</em> and <em>virtual</em> teams. Effective teams need the right <strong>context</strong> (resources, leadership, trust, fair evaluation and rewards), <strong>composition</strong> (abilities, personalities, diversity, size, member preferences) and <strong>processes</strong> (a common purpose, specific goals, team efficacy, managed conflict and low social loafing).</p>
<div class="callout"><span class="badge">Practical rule</span> Make every member's contribution visible — shared goals plus individual accountability is the most reliable cure for social loafing in student and workplace teams alike.</div>`,
    `<span class="eyebrow">OBE102c · Phần 3 · Bài 3.1</span>
<h2>Nhóm và đội</h2>
<h3>Nhóm và quá trình phát triển</h3>
<p><strong>Nhóm</strong> là từ hai người trở lên, tương tác và phụ thuộc lẫn nhau, cùng nhau đạt mục tiêu. <strong>Nhóm chính thức</strong> do cơ cấu tổ chức xác định (một phòng ban, một dự án); <strong>nhóm không chính thức</strong> hình thành tự nhiên từ tình bạn và sở thích chung. Năm giai đoạn của Tuckman mô tả cách nhiều nhóm phát triển:</p>
<table>
<tr><th>Giai đoạn</th><th>Điều diễn ra</th></tr>
<tr><td>Hình thành (forming)</td><td>Chưa rõ mục đích, cơ cấu và người lãnh đạo</td></tr>
<tr><td>Bão tố (storming)</td><td>Xung đột về việc ai kiểm soát nhóm và kiểm soát thế nào</td></tr>
<tr><td>Chuẩn hoá (norming)</td><td>Quan hệ gần gũi hơn, kỳ vọng chung, gắn kết</td></tr>
<tr><td>Thực hiện (performing)</td><td>Năng lượng dồn vào nhiệm vụ</td></tr>
<tr><td>Kết thúc (adjourning)</td><td>Nhóm tạm thời khép lại công việc</td></tr>
</table>
<p>Nhóm tạm thời có hạn chót thường đi theo mô hình <strong>cân bằng ngắt quãng</strong>: nửa đầu tiến triển rất ít, rồi bùng lên thay đổi quanh điểm giữa kỳ hạn.</p>
<h3>Đặc tính của nhóm</h3>
<ul>
<li><strong>Vai trò</strong> — những hành vi được kỳ vọng; xung đột nảy sinh khi các vai trò mâu thuẫn.</li>
<li><strong>Chuẩn mực</strong> — tiêu chuẩn chung về hành vi chấp nhận được (làm việc chăm tới đâu, ăn mặc thế nào, đến lúc nào); nhóm gây áp lực để thành viên tuân theo.</li>
<li><strong>Địa vị</strong> — thứ bậc do xã hội xác định; chênh lệch địa vị lớn có thể khiến thành viên địa vị thấp im lặng.</li>
<li><strong>Quy mô</strong> — nhóm lớn có nhiều ý tưởng hơn nhưng dễ bị <strong>ỷ lại (social loafing)</strong>, xu hướng bỏ ít công sức hơn khi làm việc tập thể. Cách khắc phục: nhóm nhỏ hơn, đóng góp cá nhân nhìn thấy được, mục tiêu rõ ràng.</li>
<li><strong>Tính gắn kết</strong> — mức các thành viên gắn bó với nhau; gắn kết cao chỉ làm tăng kết quả khi chuẩn mực của nhóm ủng hộ kết quả.</li>
</ul>
<p>Quyết định nhóm có nhiều thông tin và sự đồng thuận hơn nhưng tốn thời gian và dễ rơi vào <strong>tư duy nhóm</strong> (áp lực đồng thuận dập tắt ý kiến trái chiều) và <strong>dịch chuyển nhóm</strong> (lập trường cuối cùng của nhóm cực đoan hơn quan điểm ban đầu của các thành viên).</p>
<h3>Đội</h3>
<p><strong>Đội làm việc</strong> tạo ra cộng hưởng tích cực nhờ nỗ lực phối hợp; kết quả lớn hơn tổng đóng góp cá nhân. Các loại: đội <em>giải quyết vấn đề</em>, đội <em>tự quản</em>, đội <em>liên chức năng</em> và đội <em>ảo</em>. Đội hiệu quả cần <strong>bối cảnh</strong> phù hợp (nguồn lực, lãnh đạo, lòng tin, đánh giá và khen thưởng công bằng), <strong>thành phần</strong> phù hợp (năng lực, tính cách, đa dạng, quy mô, mong muốn của thành viên) và <strong>quá trình</strong> tốt (mục đích chung, mục tiêu cụ thể, niềm tin vào năng lực của đội, xung đột được quản lý và ít ỷ lại).</p>
<div class="callout"><span class="badge">Quy tắc thực tế</span> Làm cho đóng góp của mỗi thành viên nhìn thấy được — mục tiêu chung cộng với trách nhiệm cá nhân là cách chữa hiện tượng ỷ lại đáng tin cậy nhất, ở nhóm sinh viên cũng như nơi làm việc.</div>`,
  ]]);

const c5 = doc('obe102c-3-2-communication-conflict-negotiation', '3.2 — Communication, conflict & negotiation|||3.2 — Giao tiếp, xung đột & đàm phán',
  'Chức năng và hướng của giao tiếp, lựa chọn kênh theo độ phong phú, rào cản; quan điểm về xung đột, xung đột nhiệm vụ – quan hệ – quy trình, năm phong cách xử lý xung đột; đàm phán phân phối và hội nhập, BATNA, điểm kháng cự và vùng thoả thuận (ZOPA).',
  [[
    `<span class="eyebrow">OBE102c · Part 3 · Lesson 3.2</span>
<h2>Communication, conflict &amp; negotiation</h2>
<h3>Communication</h3>
<p>Communication in organizations serves four functions: control, motivation, emotional expression and information. It flows <strong>downward</strong> (managers to employees), <strong>upward</strong> (feedback to managers) and <strong>laterally</strong> (among peers). Choose the channel by <strong>richness</strong>: face-to-face is richest (voice, face, instant feedback) and suits complex or emotional messages; written channels suit routine, precise or record-keeping messages. Barriers include filtering, selective perception, information overload, emotions, language and silence.</p>
<h3>Conflict</h3>
<p>Views of conflict have moved from "always harmful" to the <strong>interactionist</strong> view: some conflict is functional. The key is its type:</p>
<table>
<tr><th>Type</th><th>About</th><th>Effect</th></tr>
<tr><td>Task conflict</td><td>The content and goals of the work</td><td>Low to moderate levels can improve decisions</td></tr>
<tr><td>Relationship conflict</td><td>Interpersonal friction, dislike</td><td>Almost always harmful</td></tr>
<tr><td>Process conflict</td><td>How the work gets done, who does what</td><td>Harmful when it is about roles and status</td></tr>
</table>
<p>Handling styles vary along assertiveness (satisfying one's own concerns) and cooperativeness (satisfying the other's): <strong>competing</strong> (assertive, uncooperative), <strong>collaborating</strong> (both high — seeks a win-win), <strong>avoiding</strong> (both low), <strong>accommodating</strong> (cooperative, unassertive) and <strong>compromising</strong> (middle ground). None is always best: collaborate on important issues when time allows; compromise under time pressure with equal power; compete in emergencies; avoid trivial issues.</p>
<h3>Negotiation</h3>
<p><strong>Distributive</strong> bargaining divides a fixed pie (win-lose); <strong>integrative</strong> bargaining looks for settlements that create value for both (win-win), for example by trading issues each side values differently. Before negotiating, know your <strong>BATNA</strong> — best alternative to a negotiated agreement — and your <strong>resistance point</strong> (the worst deal you will accept). The overlap between the two sides' resistance points is the <strong>zone of possible agreement (ZOPA)</strong>.</p>
<div class="callout"><span class="badge">Rule of thumb</span> Separate the people from the problem: argue hard about the task, never about the person — that keeps conflict on the useful side.</div>`,
    `<span class="eyebrow">OBE102c · Phần 3 · Bài 3.2</span>
<h2>Giao tiếp, xung đột &amp; đàm phán</h2>
<h3>Giao tiếp</h3>
<p>Giao tiếp trong tổ chức có bốn chức năng: kiểm soát, tạo động lực, bộc lộ cảm xúc và cung cấp thông tin. Thông tin đi <strong>từ trên xuống</strong> (nhà quản trị tới nhân viên), <strong>từ dưới lên</strong> (phản hồi tới nhà quản trị) và <strong>theo chiều ngang</strong> (giữa đồng cấp). Chọn kênh theo <strong>độ phong phú</strong>: gặp trực tiếp phong phú nhất (giọng nói, nét mặt, phản hồi tức thì), hợp với thông điệp phức tạp hay nhạy cảm; kênh văn bản hợp với thông điệp thường lệ, cần chính xác hay cần lưu vết. Rào cản gồm lọc thông tin, nhận thức chọn lọc, quá tải thông tin, cảm xúc, ngôn ngữ và sự im lặng.</p>
<h3>Xung đột</h3>
<p>Quan điểm về xung đột đã chuyển từ "luôn có hại" sang quan điểm <strong>tương tác</strong>: một mức xung đột nào đó là có ích. Điều quan trọng là loại xung đột:</p>
<table>
<tr><th>Loại</th><th>Về</th><th>Tác động</th></tr>
<tr><td>Xung đột nhiệm vụ</td><td>Nội dung và mục tiêu công việc</td><td>Ở mức thấp tới vừa có thể cải thiện quyết định</td></tr>
<tr><td>Xung đột quan hệ</td><td>Va chạm cá nhân, không ưa nhau</td><td>Gần như luôn có hại</td></tr>
<tr><td>Xung đột quy trình</td><td>Cách làm việc, ai làm gì</td><td>Có hại khi xoay quanh vai trò và địa vị</td></tr>
</table>
<p>Các phong cách xử lý khác nhau theo mức quyết đoán (thoả mãn mối quan tâm của mình) và mức hợp tác (thoả mãn mối quan tâm của bên kia): <strong>cạnh tranh</strong> (quyết đoán, không hợp tác), <strong>hợp tác</strong> (cả hai cao — tìm lời giải cùng thắng), <strong>né tránh</strong> (cả hai thấp), <strong>nhượng bộ</strong> (hợp tác, không quyết đoán) và <strong>thoả hiệp</strong> (điểm giữa). Không có phong cách nào luôn tốt nhất: hợp tác với vấn đề quan trọng khi có thời gian; thoả hiệp khi gấp và hai bên ngang quyền lực; cạnh tranh trong tình huống khẩn cấp; né tránh với chuyện vặt.</p>
<h3>Đàm phán</h3>
<p>Thương lượng <strong>phân phối</strong> chia một chiếc bánh cố định (thắng – thua); thương lượng <strong>hội nhập</strong> tìm thoả thuận tạo thêm giá trị cho cả hai (cùng thắng), ví dụ bằng cách đổi những vấn đề mà mỗi bên coi trọng khác nhau. Trước khi đàm phán, hãy biết <strong>BATNA</strong> — phương án thay thế tốt nhất nếu không đạt thoả thuận — và <strong>điểm kháng cự</strong> của mình (thoả thuận tệ nhất mình chấp nhận). Phần giao nhau giữa điểm kháng cự của hai bên là <strong>vùng thoả thuận khả dĩ (ZOPA)</strong>.</p>
<div class="callout"><span class="badge">Kinh nghiệm</span> Tách con người khỏi vấn đề: tranh luận quyết liệt về công việc, không bao giờ công kích con người — như vậy xung đột sẽ nằm ở phía có ích.</div>`,
  ]]);

const c5e = doc('obe102c-3-3-exercise', 'Exercise 2 — a team conflict and a negotiation|||Bài tập 2 — một xung đột trong đội và một cuộc đàm phán',
  'Bài tập tình huống: chẩn đoán loại xung đột trong đội làm dự án và chọn phong cách xử lý; tính vùng thoả thuận (ZOPA) khi mua bán máy tính cũ trước và sau khi người bán có BATNA, gợi ý thoả thuận hội nhập; kèm lời giải.',
  [[
    `<span class="eyebrow">OBE102c · Part 3 · Exercise</span>
<h2>Exercise 2 — from conflict to agreement</h2>
<div class="callout"><span class="badge">Problem</span> (A fictional case.) (a) In a five-person student team, Huy and Mai argue about whether the marketing plan should target students or office workers; the debate is heated but about the idea. Two weeks later they stop speaking to each other and the team avoids meetings. Diagnose the conflict at each point and recommend a handling style. (b) Huy wants to sell his used laptop; the lowest price he will accept is VND 12 million. Mai's friend Lan will pay at most VND 15 million. Find the ZOPA. Then another buyer offers Huy VND 12.5 million: what changes? Suggest one integrative move.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Week 1: task conflict (about the target market) -> potentially useful
    Week 3: relationship conflict (not speaking) + avoidance by the team -> harmful
    Style: collaborating — meet, restate the shared goal, compare both segments
    with the same criteria (size, access, fit with the brief), then agree

(b) Seller resistance point 12.0 m, buyer resistance point 15.0 m
    ZOPA = 12.0 m to 15.0 m (width 3.0 m)
    With a BATNA of 12.5 m, Huy will not accept less than 12.5 m:
    new ZOPA = 12.5 m to 15.0 m (width 2.5 m); midpoint = (12.5 + 15.0) / 2 = 13.75 m
    Integrative move: include the charger, bag and a one-month "return if faulty"
    promise, which cost Huy little but are worth a lot to Lan</code></pre>
<p><strong>Why:</strong> the first argument was healthy disagreement about the work; it turned harmful once it became personal, so the fix is to bring it back to shared criteria. In negotiation, a better BATNA gives power: Huy's alternative offer moved his resistance point up and shrank the zone. Adding issues that the two sides value differently expands the pie instead of only dividing it.</p>`,
    `<span class="eyebrow">OBE102c · Phần 3 · Bài tập</span>
<h2>Bài tập 2 — từ xung đột tới thoả thuận</h2>
<div class="callout"><span class="badge">Đề</span> (Tình huống giả định.) (a) Trong một nhóm sinh viên năm người, Huy và Mai tranh cãi xem kế hoạch marketing nên nhắm vào sinh viên hay nhân viên văn phòng; cuộc tranh luận căng thẳng nhưng xoay quanh ý tưởng. Hai tuần sau, hai người không nói chuyện với nhau và cả nhóm tránh họp. Chẩn đoán xung đột ở từng thời điểm và đề xuất phong cách xử lý. (b) Huy muốn bán máy tính xách tay cũ; giá thấp nhất anh chấp nhận là 12 triệu đồng. Lan, bạn của Mai, trả tối đa 15 triệu đồng. Tìm ZOPA. Sau đó một người mua khác trả Huy 12,5 triệu: điều gì thay đổi? Gợi ý một bước đi hội nhập.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Tuần 1: xung đột nhiệm vụ (về thị trường mục tiêu) -> có thể có ích
    Tuần 3: xung đột quan hệ (không nói chuyện) + cả nhóm né tránh -> có hại
    Phong cách: hợp tác — gặp nhau, nhắc lại mục tiêu chung, so hai phân khúc
    bằng cùng tiêu chí (quy mô, khả năng tiếp cận, phù hợp với đề bài), rồi thống nhất

(b) Điểm kháng cự của người bán 12,0 triệu, của người mua 15,0 triệu
    ZOPA = 12,0 triệu tới 15,0 triệu (rộng 3,0 triệu)
    Có BATNA 12,5 triệu, Huy sẽ không nhận dưới 12,5 triệu:
    ZOPA mới = 12,5 triệu tới 15,0 triệu (rộng 2,5 triệu); điểm giữa = (12,5 + 15,0) / 2 = 13,75 triệu
    Bước đi hội nhập: tặng kèm sạc, túi và cam kết "đổi trả trong một tháng nếu lỗi",
    những thứ Huy tốn ít mà Lan lại rất coi trọng</code></pre>
<p><strong>Vì sao:</strong> tranh luận ban đầu là bất đồng lành mạnh về công việc; nó trở nên có hại khi chuyển thành chuyện cá nhân, nên cách sửa là đưa nó về lại các tiêu chí chung. Trong đàm phán, BATNA tốt hơn mang lại quyền lực: lời đề nghị khác đã nâng điểm kháng cự của Huy và thu hẹp vùng thoả thuận. Thêm những vấn đề mà hai bên coi trọng khác nhau giúp làm to chiếc bánh thay vì chỉ chia nó.</p>`,
  ]]);

const c5q = quiz('obe102c-quiz-3', 'Quiz 3 — Groups, conflict & negotiation|||Quiz 3 — Nhóm, xung đột & đàm phán', [
  { id: 'q1', question: 'In Tuckman’s model, the stage marked by conflict over who controls the group is…|||Trong mô hình Tuckman, giai đoạn đặc trưng bởi xung đột về việc ai kiểm soát nhóm là…', options: ['forming|||hình thành', 'storming|||bão tố', 'norming|||chuẩn hoá', 'performing|||thực hiện'], correctIndex: 1, explanation: 'Storming comes after forming; once it is resolved, the group moves on to norming.|||Bão tố đến sau hình thành; khi được giải quyết, nhóm chuyển sang chuẩn hoá.' },
  { id: 'q2', question: 'Social loafing is…|||Hiện tượng ỷ lại (social loafing) là…', options: ['the tendency to exert less effort when working collectively|||xu hướng bỏ ít công sức hơn khi làm việc tập thể', 'conflict about roles in a team|||xung đột về vai trò trong đội', 'pressure to agree that silences dissent|||áp lực đồng thuận dập tắt ý kiến trái chiều', 'a leader delegating all work|||người lãnh đạo giao hết việc'], correctIndex: 0, explanation: 'It grows when individual contributions cannot be identified; option C describes groupthink.|||Nó tăng khi không nhận ra được đóng góp cá nhân; phương án C mô tả tư duy nhóm.' },
  { id: 'q3', question: 'BATNA stands for…|||BATNA là viết tắt của…', options: ['basic agreement terms in negotiation analysis|||các điều khoản cơ bản trong phân tích đàm phán', 'best alternative to a negotiated agreement|||phương án thay thế tốt nhất cho một thoả thuận đàm phán', 'bargaining approach toward new alliances|||cách thương lượng hướng tới liên minh mới', 'balanced approach to negotiation and arbitration|||cách tiếp cận cân bằng giữa đàm phán và trọng tài'], correctIndex: 1, explanation: 'Your BATNA sets the minimum you should accept; a stronger BATNA gives more bargaining power.|||BATNA đặt ra mức tối thiểu bạn nên chấp nhận; BATNA càng mạnh thì quyền thương lượng càng lớn.' },
]);

const c6 = doc('obe102c-4-1-leadership-power', '4.1 — Leadership, power & politics|||4.1 — Lãnh đạo, quyền lực & chính trị trong tổ chức',
  'Lãnh đạo nhìn từ hành vi tổ chức: đặc điểm (liên hệ Big Five), hành vi, tình huống, thuyết trao đổi lãnh đạo – thành viên (LMX), lãnh đạo lôi cuốn, chuyển đổi, chân thực, phục vụ; năm cơ sở quyền lực của French và Raven, chiến thuật gây ảnh hưởng, chính trị trong tổ chức.',
  [[
    `<span class="eyebrow">OBE102c · Part 4 · Lesson 4.1</span>
<h2>Leadership, power &amp; politics</h2>
<h3>Leadership through an OB lens</h3>
<p>MGT103 introduced trait, behavioural and contingency theories. OB research adds depth:</p>
<ul>
<li><strong>Traits:</strong> extraversion predicts who <em>emerges</em> as a leader; conscientiousness and openness also relate to effectiveness; emotional intelligence helps but is not sufficient.</li>
<li><strong>Leader–member exchange (LMX) theory:</strong> leaders build a special relationship with a small <em>in-group</em> (more trust, attention and privileges) and treat the <em>out-group</em> more formally. In-group members tend to perform better and be more satisfied — so fair access to the in-group matters.</li>
<li><strong>Charismatic and transformational leadership:</strong> transformational leaders inspire followers to transcend self-interest through idealized influence, inspirational motivation, intellectual stimulation and individualized consideration; they build on (not replace) <strong>transactional</strong> leadership, which clarifies roles and exchanges rewards for performance.</li>
<li><strong>Authentic, ethical and servant leadership:</strong> leaders who know who they are, act on their values and put followers' growth first build <strong>trust</strong> — the foundation of all leadership.</li>
</ul>
<h3>Power: five bases (French and Raven)</h3>
<table>
<tr><th>Formal power (from the position)</th><th>Personal power (from the individual)</th></tr>
<tr><td><strong>Legitimate</strong> — authority of the role; <strong>reward</strong> — ability to give benefits; <strong>coercive</strong> — ability to punish</td><td><strong>Expert</strong> — special skill or knowledge; <strong>referent</strong> — admiration and identification with the person</td></tr>
</table>
<p>Personal bases (expert, referent) are most strongly linked to commitment and satisfaction; coercive power produces compliance at best and resistance at worst. People turn power into action through <strong>influence tactics</strong> — rational persuasion, inspirational appeals and consultation work best; pressure works worst.</p>
<h3>Organizational politics</h3>
<p>Political behaviour means using influence outside the formal role to gain advantage. It thrives when resources are scarce, roles are ambiguous, performance criteria are unclear and promotion is zero-sum. Clear criteria, transparent decisions and trust reduce it.</p>
<div class="callout"><span class="badge">Takeaway</span> Titles give legitimate power; lasting influence comes from expertise and respect — which anyone in a team can build.</div>`,
    `<span class="eyebrow">OBE102c · Phần 4 · Bài 4.1</span>
<h2>Lãnh đạo, quyền lực &amp; chính trị trong tổ chức</h2>
<h3>Lãnh đạo nhìn từ hành vi tổ chức</h3>
<p>MGT103 đã giới thiệu các lý thuyết đặc điểm, hành vi và tình huống. Nghiên cứu hành vi tổ chức bổ sung chiều sâu:</p>
<ul>
<li><strong>Đặc điểm:</strong> tính hướng ngoại dự báo ai <em>nổi lên</em> làm người lãnh đạo; tận tâm và cởi mở cũng liên quan tới hiệu quả; trí tuệ cảm xúc có ích nhưng chưa đủ.</li>
<li><strong>Thuyết trao đổi lãnh đạo – thành viên (LMX):</strong> người lãnh đạo xây quan hệ đặc biệt với một <em>nhóm trong</em> nhỏ (tin tưởng, quan tâm và ưu đãi hơn) và đối xử trang trọng hơn với <em>nhóm ngoài</em>. Thành viên nhóm trong thường làm tốt hơn và hài lòng hơn — nên cơ hội vào nhóm trong phải công bằng.</li>
<li><strong>Lãnh đạo lôi cuốn và chuyển đổi:</strong> người lãnh đạo chuyển đổi truyền cảm hứng để người theo vượt lên lợi ích cá nhân qua ảnh hưởng lý tưởng, động viên truyền cảm hứng, kích thích trí tuệ và quan tâm cá nhân; họ xây trên nền (chứ không thay thế) lãnh đạo <strong>giao dịch</strong>, vốn làm rõ vai trò và trao phần thưởng lấy kết quả.</li>
<li><strong>Lãnh đạo chân thực, có đạo đức và phục vụ:</strong> người lãnh đạo hiểu mình là ai, hành động theo giá trị của mình và đặt sự phát triển của người theo lên trước sẽ xây được <strong>lòng tin</strong> — nền móng của mọi sự lãnh đạo.</li>
</ul>
<h3>Quyền lực: năm cơ sở (French và Raven)</h3>
<table>
<tr><th>Quyền lực chính thức (từ vị trí)</th><th>Quyền lực cá nhân (từ con người)</th></tr>
<tr><td><strong>Hợp pháp</strong> — thẩm quyền của vai trò; <strong>khen thưởng</strong> — khả năng trao lợi ích; <strong>cưỡng chế</strong> — khả năng trừng phạt</td><td><strong>Chuyên môn</strong> — kỹ năng, hiểu biết đặc biệt; <strong>tham chiếu</strong> — sự ngưỡng mộ và muốn giống người đó</td></tr>
</table>
<p>Các cơ sở cá nhân (chuyên môn, tham chiếu) gắn chặt nhất với sự cam kết và hài lòng; quyền cưỡng chế tốt nhất chỉ tạo ra sự tuân thủ, tệ nhất là sự chống đối. Người ta biến quyền lực thành hành động qua các <strong>chiến thuật gây ảnh hưởng</strong> — thuyết phục bằng lý lẽ, khơi gợi cảm hứng và tham vấn hiệu quả nhất; gây sức ép kém hiệu quả nhất.</p>
<h3>Chính trị trong tổ chức</h3>
<p>Hành vi chính trị là dùng ảnh hưởng ngoài vai trò chính thức để giành lợi thế. Nó phát triển mạnh khi nguồn lực khan hiếm, vai trò mơ hồ, tiêu chí đánh giá không rõ và thăng tiến mang tính được – mất. Tiêu chí rõ ràng, quyết định minh bạch và lòng tin giúp giảm nó.</p>
<div class="callout"><span class="badge">Rút ra</span> Chức danh cho quyền lực hợp pháp; ảnh hưởng lâu dài đến từ chuyên môn và sự tôn trọng — thứ mà bất kỳ ai trong đội cũng xây dựng được.</div>`,
  ]]);

const c7 = doc('obe102c-4-2-culture-change-stress', '4.2 — Organizational culture, change & stress|||4.2 — Văn hoá tổ chức, thay đổi & căng thẳng',
  'Chức năng của văn hoá tổ chức, cách văn hoá hình thành và được duy trì (tuyển chọn, lãnh đạo cấp cao, xã hội hoá), mô hình thay đổi ba bước của Lewin và tám bước của Kotter, nguồn gốc và cách vượt qua sự chống đối thay đổi, căng thẳng thách thức và căng thẳng cản trở.',
  [[
    `<span class="eyebrow">OBE102c · Part 4 · Lesson 4.2</span>
<h2>Organizational culture, change &amp; stress</h2>
<h3>Culture</h3>
<p>Organizational culture is a system of shared meaning that distinguishes one organization from others. It defines boundaries, conveys identity, generates commitment and guides behaviour — but a strong culture can also block change, diversity and mergers. Culture is <strong>created</strong> by founders, <strong>sustained</strong> through selection (hiring people who fit), top-management behaviour and <strong>socialization</strong> (pre-arrival, encounter, metamorphosis), and <strong>learned</strong> through stories, rituals, symbols and language.</p>
<h3>Managing change</h3>
<pre><code>Lewin's three steps:   UNFREEZE  ->  MOVE (change)  ->  REFREEZE
Kotter's eight steps:  1 create urgency · 2 form a guiding coalition · 3 create a vision
                       4 communicate the vision · 5 empower others and remove obstacles
                       6 create short-term wins · 7 consolidate and keep moving
                       8 anchor the changes in the culture</code></pre>
<p><strong>Resistance to change</strong> comes from individuals (habit, security, economic fears, fear of the unknown, selective information processing) and from the organization (structural inertia, threats to expertise, power and resource allocations). Ways to reduce it: education and communication, participation, building support and commitment, developing positive relationships, implementing changes fairly, careful selection of people who accept change — and, as a last resort, coercion.</p>
<h3>Stress</h3>
<p>Stress is a dynamic condition in which a person faces an opportunity, demand or resource related to what they want, with an uncertain but important outcome. <strong>Challenge stressors</strong> (workload, time pressure, responsibility) can motivate, while <strong>hindrance stressors</strong> (red tape, office politics, role confusion) mostly harm performance. Too much stress shows up as physical symptoms, anxiety and burnout, and as absenteeism and turnover. Individuals manage it through time management, exercise and social support; organizations through realistic goals, job redesign, employee involvement, clear communication and wellness programmes.</p>
<div class="callout"><span class="badge">Remember</span> Most change efforts fail not in planning but in steps 7–8: declaring victory too early and never making the new way "how we do things here".</div>`,
    `<span class="eyebrow">OBE102c · Phần 4 · Bài 4.2</span>
<h2>Văn hoá tổ chức, thay đổi &amp; căng thẳng</h2>
<h3>Văn hoá</h3>
<p>Văn hoá tổ chức là hệ thống ý nghĩa được chia sẻ, phân biệt tổ chức này với tổ chức khác. Nó xác định ranh giới, truyền tải bản sắc, tạo sự gắn bó và định hướng hành vi — nhưng văn hoá mạnh cũng có thể cản trở thay đổi, sự đa dạng và các vụ sáp nhập. Văn hoá được <strong>tạo ra</strong> bởi người sáng lập, <strong>duy trì</strong> qua tuyển chọn (tuyển người phù hợp), hành vi của lãnh đạo cấp cao và <strong>xã hội hoá</strong> (trước khi vào, gặp gỡ, chuyển hoá), và được <strong>học</strong> qua câu chuyện, nghi thức, biểu tượng và ngôn ngữ.</p>
<h3>Quản lý thay đổi</h3>
<pre><code>Ba bước của Lewin:   PHÁ BĂNG  ->  THAY ĐỔI  ->  TÁI ĐÔNG CỨNG
Tám bước của Kotter: 1 tạo cảm giác cấp bách · 2 lập liên minh dẫn dắt · 3 xây tầm nhìn
                     4 truyền đạt tầm nhìn · 5 trao quyền và dỡ bỏ trở ngại
                     6 tạo thắng lợi ngắn hạn · 7 củng cố và tiếp tục thay đổi
                     8 neo thay đổi vào văn hoá</code></pre>
<p><strong>Sự chống đối thay đổi</strong> đến từ cá nhân (thói quen, nhu cầu an toàn, lo ngại kinh tế, sợ điều chưa biết, xử lý thông tin có chọn lọc) và từ tổ chức (quán tính cơ cấu, đe doạ tới chuyên môn, quyền lực và cách phân bổ nguồn lực). Cách giảm: giáo dục và truyền thông, cho tham gia, xây dựng sự ủng hộ và cam kết, phát triển quan hệ tích cực, thực hiện thay đổi công bằng, chọn người chấp nhận thay đổi — và biện pháp cuối cùng là cưỡng chế.</p>
<h3>Căng thẳng</h3>
<p>Căng thẳng là trạng thái động khi một người đối mặt với cơ hội, yêu cầu hay nguồn lực liên quan tới điều họ mong muốn, với kết quả không chắc chắn nhưng quan trọng. <strong>Căng thẳng thách thức</strong> (khối lượng việc, áp lực thời gian, trách nhiệm) có thể tạo động lực, còn <strong>căng thẳng cản trở</strong> (thủ tục rườm rà, chính trị nội bộ, vai trò mơ hồ) chủ yếu làm giảm kết quả. Căng thẳng quá mức biểu hiện qua triệu chứng thể chất, lo âu và kiệt sức, cùng việc vắng mặt và nghỉ việc. Cá nhân quản lý nó bằng quản lý thời gian, tập thể dục và sự hỗ trợ xã hội; tổ chức bằng mục tiêu thực tế, thiết kế lại công việc, cho nhân viên tham gia, giao tiếp rõ ràng và chương trình chăm sóc sức khoẻ.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Phần lớn nỗ lực thay đổi thất bại không phải ở khâu lập kế hoạch mà ở bước 7–8: tuyên bố thắng lợi quá sớm và không bao giờ biến cách làm mới thành "cách chúng ta vẫn làm ở đây".</div>`,
  ]]);

const c7q = quiz('obe102c-quiz-4', 'Quiz 4 — Leadership, culture & change|||Quiz 4 — Lãnh đạo, văn hoá & thay đổi', [
  { id: 'q1', question: 'A junior analyst is followed by colleagues because everyone admires her and wants to be like her. Her power base is…|||Một chuyên viên trẻ được đồng nghiệp làm theo vì ai cũng ngưỡng mộ và muốn giống cô ấy. Cơ sở quyền lực của cô ấy là…', options: ['legitimate|||hợp pháp', 'coercive|||cưỡng chế', 'referent|||tham chiếu', 'reward|||khen thưởng'], correctIndex: 2, explanation: 'Referent power rests on admiration and identification, not on position.|||Quyền lực tham chiếu dựa trên sự ngưỡng mộ và muốn giống người đó, không dựa trên vị trí.' },
  { id: 'q2', question: 'Which sequence is Lewin’s change model?|||Trình tự nào là mô hình thay đổi của Lewin?', options: ['Plan → do → check → act|||Lập kế hoạch → thực hiện → kiểm tra → điều chỉnh', 'Unfreeze → move → refreeze|||Phá băng → thay đổi → tái đông cứng', 'Forming → storming → norming|||Hình thành → bão tố → chuẩn hoá', 'Urgency → coalition → vision|||Cấp bách → liên minh → tầm nhìn'], correctIndex: 1, explanation: 'Option D is the start of Kotter’s eight steps, and C is Tuckman’s group development.|||Phương án D là phần đầu tám bước của Kotter, còn C là quá trình phát triển nhóm của Tuckman.' },
  { id: 'q3', question: 'Leader–member exchange (LMX) theory argues that leaders…|||Thuyết trao đổi lãnh đạo – thành viên (LMX) cho rằng người lãnh đạo…', options: ['treat all followers exactly the same|||đối xử với mọi người theo như nhau', 'form in-groups and out-groups that experience different relationships|||hình thành nhóm trong và nhóm ngoài có quan hệ khác nhau với mình', 'should only use coercive power|||chỉ nên dùng quyền cưỡng chế', 'are born, not made|||sinh ra đã là lãnh đạo'], correctIndex: 1, explanation: 'In-group members get more trust and attention and tend to perform better.|||Thành viên nhóm trong được tin tưởng, quan tâm hơn và thường làm tốt hơn.' },
]);

const taiLieu = doc('obe102c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">OBE102c · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning organizational behaviour: the official syllabus and slides, books, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official OBE102c syllabus and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://openstax.org/details/books/organizational-behavior" target="_blank" rel="noopener">Organizational Behavior</a> — OpenStax: a free, peer-reviewed open textbook.</li>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">Organizational Behavior</a> — Stephen P. Robbins &amp; Timothy A. Judge (Pearson) — the standard text; search the title on the publisher site.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://www.mindtools.com/" target="_blank" rel="noopener">MindTools</a> — toolkits on motivation, conflict, teams and communication.</li>
<li><a href="https://hbr.org/" target="_blank" rel="noopener">Harvard Business Review</a> — research-based articles on people at work.</li>
<li><a href="https://www.shrm.org/" target="_blank" rel="noopener">SHRM</a> — HR and people-management resources.</li>
<li><a href="https://rework.withgoogle.com/" target="_blank" rel="noopener">Google re:Work</a> — guides on team effectiveness and psychological safety.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — short videos on motivation, teams and leadership.</li>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED</a> — talks on psychology at work.</li>
<li><a href="https://www.youtube.com/@simonsinek" target="_blank" rel="noopener">Simon Sinek</a> — trust, teams and leadership.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — run team retrospectives and conflict-mapping sessions.</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — make every member’s contribution visible to reduce social loafing.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — attitudes, personality, perception and motivation, following Parts 1–2 here.</li>
<li><strong>Practise</strong> — keep an OB journal: one behaviour you observed each week, explained with a theory.</li>
<li><strong>Go deeper</strong> — study team effectiveness and psychological safety with Google re:Work.</li>
<li><strong>Apply</strong> — run a retrospective with your team using the conflict and motivation tools.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">OBE102c · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học hành vi tổ chức: giáo trình &amp; slide chính thức, sách, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của OBE102c.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://openstax.org/details/books/organizational-behavior" target="_blank" rel="noopener">Organizational Behavior</a> — OpenStax: giáo trình mở miễn phí, có bình duyệt.</li>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">Organizational Behavior</a> — Stephen P. Robbins &amp; Timothy A. Judge (Pearson) — giáo trình chuẩn; tra tên sách trên trang nhà xuất bản.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.mindtools.com/" target="_blank" rel="noopener">MindTools</a> — bộ công cụ về động lực, xung đột, đội nhóm và giao tiếp.</li>
<li><a href="https://hbr.org/" target="_blank" rel="noopener">Harvard Business Review</a> — bài viết dựa trên nghiên cứu về con người nơi làm việc.</li>
<li><a href="https://www.shrm.org/" target="_blank" rel="noopener">SHRM</a> — tài nguyên về nhân sự và quản lý con người.</li>
<li><a href="https://rework.withgoogle.com/" target="_blank" rel="noopener">Google re:Work</a> — hướng dẫn về hiệu quả đội nhóm và an toàn tâm lý.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — video ngắn về động lực, đội nhóm và lãnh đạo.</li>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED</a> — bài nói về tâm lý nơi làm việc.</li>
<li><a href="https://www.youtube.com/@simonsinek" target="_blank" rel="noopener">Simon Sinek</a> — lòng tin, đội nhóm và lãnh đạo.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — tổ chức buổi nhìn lại của đội và lập bản đồ xung đột.</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — làm đóng góp của mỗi thành viên hiện rõ để giảm hiện tượng ỷ lại.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — thái độ, tính cách, nhận thức và động lực, theo đúng Phần 1–2 ở đây.</li>
<li><strong>Luyện tập</strong> — viết nhật ký hành vi tổ chức: mỗi tuần một hành vi quan sát được, giải thích bằng một lý thuyết.</li>
<li><strong>Đào sâu</strong> — tìm hiểu hiệu quả đội nhóm và an toàn tâm lý qua Google re:Work.</li>
<li><strong>Vận dụng</strong> — tổ chức một buổi nhìn lại với đội của bạn, dùng các công cụ về xung đột và động lực.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'OBE102c',
    slug: 'obe102c-organizational-behavior',
    title: 'Organizational Behavior',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/OBE102c.webp',
    shortDescription: 'Why people behave as they do at work: attitudes, emotions, personality and perception, motivation and job design, groups and teams, communication, conflict and negotiation, leadership, power, culture and change. Bilingual, with exercises and quizzes.|||Vì sao con người hành xử như vậy nơi làm việc: thái độ, cảm xúc, tính cách, nhận thức, động lực, nhóm và đội, xung đột, đàm phán, lãnh đạo, quyền lực, văn hoá, thay đổi. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>OBE102c — Organizational Behavior (Hành vi tổ chức)</strong> (khối Quản trị Kinh doanh, kỳ 2) giải thích <strong>vì sao con người hành xử như vậy ở nơi làm việc</strong> và dùng hiểu biết đó để tổ chức hiệu quả hơn. Từ <strong>cá nhân</strong> (đa dạng, thái độ, sự hài lòng, cảm xúc, tính cách Big Five, nhận thức và quy kết) → <strong>động lực</strong> (thuyết tự quyết, mục tiêu, công bằng, kỳ vọng, mô hình đặc điểm công việc) → <strong>nhóm và đội</strong>, <strong>giao tiếp, xung đột và đàm phán</strong> (BATNA, ZOPA) → <strong>lãnh đạo, quyền lực, chính trị</strong>, <strong>văn hoá, thay đổi và căng thẳng</strong>. Bám cấu trúc giáo trình hành vi tổ chức chuẩn, song ngữ Anh–Việt, có bài tập tình huống kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Giải thích ba cấp độ phân tích và mô hình đầu vào – quá trình – kết quả của hành vi tổ chức\nPhân tích thái độ, sự hài lòng, cảm xúc và phản ứng của nhân viên bất mãn\nDùng Big Five, giá trị và lý thuyết quy kết; nhận diện các lỗi nhận thức\nÁp dụng thuyết tự quyết, thiết lập mục tiêu, công bằng và kỳ vọng\nTính chỉ số MPS và thiết kế lại công việc để tạo động lực\nChẩn đoán giai đoạn nhóm, hiện tượng ỷ lại, tư duy nhóm và các loại xung đột\nChuẩn bị đàm phán bằng BATNA, điểm kháng cự và ZOPA\nPhân tích quyền lực, lãnh đạo, văn hoá và dẫn dắt thay đổi theo Lewin và Kotter',
    requirements: 'Nên học trước MGT103 — Introduction to Management\nKhông cần kiến thức tâm lý học trước\nSẵn sàng liên hệ bài học với trải nghiệm làm việc nhóm của bản thân',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Hành vi tổ chức là gì, ba cấp độ, mô hình, lộ trình.', lessons: [intro] },
    { title: 'Part 1 — The individual|||Phần 1 — Cá nhân', description: 'Thái độ, hài lòng, cảm xúc, tính cách, nhận thức.', lessons: [c1, c2, c2q] },
    { title: 'Part 2 — Motivation|||Phần 2 — Động lực', description: 'Tự quyết, mục tiêu, công bằng, kỳ vọng, MPS.', lessons: [c3, c3e, c3q] },
    { title: 'Part 3 — Groups, teams, conflict & negotiation|||Phần 3 — Nhóm, đội, xung đột & đàm phán', description: 'Tuckman, ỷ lại, giao tiếp, xung đột, BATNA, ZOPA.', lessons: [c4, c5, c5e, c5q] },
    { title: 'Part 4 — Leadership, power, culture & change|||Phần 4 — Lãnh đạo, quyền lực, văn hoá & thay đổi', description: 'LMX, chuyển đổi, năm cơ sở quyền lực, Lewin, Kotter.', lessons: [c6, c7, c7q] },
  ],
};
