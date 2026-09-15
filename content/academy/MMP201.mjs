/**
 * MMP201 — Media Psychology. Giáo trình FLM (khối Quản trị Kinh doanh, BBA):
 * Giles "Media Psychology"; "The Psychology of Media and Politics"; Bandura
 * social learning; Cialdini "Influence". 8 chương: tổng quan → nhận thức/chú
 * ý → học tập xã hội (Bandura) → cảm xúc/thuyết phục (ELM, Cialdini) → khán
 * giả (uses & gratifications) → truyền thông xã hội/trực tuyến → tác động
 * tiêu cực → ứng dụng quảng cáo/marketing có đạo đức. Song ngữ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). KHÔNG backtick lồng/${}; escape &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mmp201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền (Giles, Bandura, Cialdini), tài liệu miễn phí, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">MMP201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Media Psychology — perception, social learning, persuasion, audience engagement, social media &amp; ethics in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MMP201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (cited, not uploaded)</h3>
<ul>
<li><em>Media Psychology</em> — David Giles (core textbook: cognition, effects, audiences).</li>
<li><em>The Psychology of Media and Politics</em> — media framing, political cognition &amp; persuasion.</li>
<li><em>Influence: The Psychology of Persuasion</em> — Robert Cialdini (six persuasion principles).</li>
<li>Albert Bandura's social learning / social cognitive theory papers — modeling &amp; media effects.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.apadivisions.org/division-46" target="_blank" rel="noopener">APA Division 46 — Society for Media Psychology &amp; Technology</a></li>
<li><a href="https://www.simplypsychology.org/" target="_blank" rel="noopener">Simply Psychology</a> — Bandura, Elaboration Likelihood Model, attitude theory explainers</li>
<li><a href="https://www.influenceatwork.com/" target="_blank" rel="noopener">Influence at Work (Cialdini)</a> — the six principles of persuasion</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@crashcourse" target="_blank" rel="noopener">CrashCourse — Psychology series</a></li>
<li><a href="https://www.youtube.com/@AssociationforPsychologicalScience" target="_blank" rel="noopener">Association for Psychological Science</a> — research talks on media &amp; behavior</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — what media psychology studies, perception &amp; attention, Bandura's social learning.</li>
<li><strong>Practice</strong> — analyse a real ad or news story using ELM (central vs peripheral route) and Cialdini's principles.</li>
<li><strong>Go deeper</strong> — uses &amp; gratifications, social media identity &amp; comparison, negative effects (addiction, misinformation).</li>
<li><strong>Job-ready</strong> — apply the frameworks ethically in advertising, marketing and campaign design.</li>
</ol></div>`,
    `<span class="eyebrow">MMP201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Tâm lý học Truyền thông — nhận thức, học tập xã hội, thuyết phục, sự tham gia của khán giả, truyền thông xã hội &amp; đạo đức — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MMP201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền (trích dẫn, không tải lên)</h3>
<ul>
<li><em>Media Psychology</em> — David Giles (giáo trình gốc: nhận thức, tác động, khán giả).</li>
<li><em>The Psychology of Media and Politics</em> — khung tin tức, nhận thức chính trị &amp; thuyết phục.</li>
<li><em>Influence: The Psychology of Persuasion</em> — Robert Cialdini (sáu nguyên tắc thuyết phục).</li>
<li>Các nghiên cứu học tập xã hội / nhận thức xã hội của Albert Bandura — làm mẫu &amp; tác động truyền thông.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.apadivisions.org/division-46" target="_blank" rel="noopener">APA Division 46 — Society for Media Psychology &amp; Technology</a></li>
<li><a href="https://www.simplypsychology.org/" target="_blank" rel="noopener">Simply Psychology</a> — giải thích Bandura, mô hình khả năng chi tiết hoá (ELM), lý thuyết thái độ</li>
<li><a href="https://www.influenceatwork.com/" target="_blank" rel="noopener">Influence at Work (Cialdini)</a> — sáu nguyên tắc thuyết phục</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@crashcourse" target="_blank" rel="noopener">CrashCourse — chuỗi Psychology</a></li>
<li><a href="https://www.youtube.com/@AssociationforPsychologicalScience" target="_blank" rel="noopener">Association for Psychological Science</a> — các buổi nói về truyền thông &amp; hành vi</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — tâm lý học truyền thông nghiên cứu gì, nhận thức &amp; chú ý, học tập xã hội của Bandura.</li>
<li><strong>Luyện tập</strong> — phân tích một quảng cáo hoặc bản tin thật bằng ELM (tuyến trung tâm vs tuyến ngoại vi) và các nguyên tắc Cialdini.</li>
<li><strong>Đào sâu</strong> — uses &amp; gratifications, bản sắc &amp; so sánh xã hội trên social media, tác động tiêu cực (nghiện, tin giả).</li>
<li><strong>Sẵn sàng đi làm</strong> — áp dụng các khung này một cách có đạo đức trong quảng cáo, marketing và thiết kế chiến dịch.</li>
</ol></div>`,
  ]]);

const intro = doc('mmp201-0-1-overview', 'Course overview: Media Psychology|||Tổng quan: Tâm lý học Truyền thông',
  'Tâm lý học truyền thông nghiên cứu gì; ba trụ cột (nhận thức, xã hội, văn hoá); lộ trình 8 chương từ nhận thức đến ứng dụng đạo đức.',
  [[
    `<span class="eyebrow">MMP201 · Lesson 0.1 · Overview</span>
<h2>Media Psychology</h2>
<p class="lead">This course studies <strong>how people think, feel and behave</strong> in relation to media — TV, advertising, news, and social platforms. It blends cognitive psychology (how we process media messages), social psychology (how media shapes attitudes and behavior) and communication theory into one applied lens for marketing, advertising and responsible media practice.</p>
<h3>Three pillars</h3>
<ul>
<li><strong>Cognitive</strong> — attention, perception, memory: how a message actually gets processed (or ignored).</li>
<li><strong>Social/behavioral</strong> — modeling, persuasion, attitude change: how media shapes what we do and believe.</li>
<li><strong>Cultural/ethical</strong> — identity, wellbeing, misinformation: the wider consequences of media exposure.</li>
</ul>
<h3>Roadmap</h3>
<p>Foundations (perception &amp; attention) → social learning (Bandura) → persuasion &amp; emotion (ELM, Cialdini) → audience psychology (uses &amp; gratifications) → social media &amp; online identity → negative effects (addiction, fake news, mental health) → ethical application in advertising and marketing.</p>`,
    `<span class="eyebrow">MMP201 · Bài 0.1 · Tổng quan</span>
<h2>Tâm lý học Truyền thông</h2>
<p class="lead">Môn này nghiên cứu <strong>con người nghĩ, cảm nhận và hành xử ra sao</strong> trong quan hệ với truyền thông — TV, quảng cáo, tin tức và các nền tảng xã hội. Nó kết hợp tâm lý học nhận thức (thông điệp được xử lý thế nào), tâm lý học xã hội (truyền thông định hình thái độ &amp; hành vi ra sao) và lý thuyết truyền thông thành một lăng kính ứng dụng cho marketing, quảng cáo và thực hành truyền thông có trách nhiệm.</p>
<h3>Ba trụ cột</h3>
<ul>
<li><strong>Nhận thức</strong> — chú ý, tri giác, ghi nhớ: thông điệp được xử lý (hay bị bỏ qua) thế nào.</li>
<li><strong>Xã hội/hành vi</strong> — làm mẫu, thuyết phục, thay đổi thái độ: truyền thông định hình điều ta làm &amp; tin ra sao.</li>
<li><strong>Văn hoá/đạo đức</strong> — bản sắc, sức khoẻ tâm thần, tin giả: hệ quả rộng hơn của việc tiếp xúc truyền thông.</li>
</ul>
<h3>Lộ trình</h3>
<p>Nền tảng (nhận thức &amp; chú ý) → học tập xã hội (Bandura) → thuyết phục &amp; cảm xúc (ELM, Cialdini) → tâm lý khán giả (uses &amp; gratifications) → truyền thông xã hội &amp; bản sắc trực tuyến → tác động tiêu cực (nghiện, tin giả, sức khoẻ tâm thần) → ứng dụng có đạo đức trong quảng cáo &amp; marketing.</p>`,
  ]]);

const c1 = doc('mmp201-1-1-overview-field', '1.1 — Overview of media psychology|||1.1 — Tổng quan tâm lý học truyền thông',
  'Định nghĩa tâm lý học truyền thông; lịch sử ngắn (từ tuyên truyền chiến tranh đến social media); các mô hình truyền thông chính (truyền tải, sử dụng-thoả mãn, thiết lập chương trình nghị sự).',
  [[
    `<span class="eyebrow">MMP201 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of media psychology</h2>
<h3>What counts as "media"?</h3>
<p><strong>Media psychology</strong> is the scientific study of how people interact with media — television, film, advertising, news, video games, and digital/social platforms — and how that interaction shapes cognition, emotion, attitudes and behavior. It is applied: the same theories explain a political ad, a viral TikTok, and a video game's design.</p>
<h3>A short history</h3>
<p>Early 20th-century work on wartime propaganda assumed a powerful, direct effect on a passive audience (the "hypodermic needle" model). Later research showed audiences are <em>active</em> — they select, interpret and resist messages. Today's field studies both mass media (TV, news) and interactive/social media, where the audience is also the producer.</p>
<h3>Three classic models</h3>
<pre><code>Transmission model:    Sender -> Message -> Channel -> Receiver
Agenda-setting:        Media doesn't tell you WHAT to think,
                       it tells you WHAT TO THINK ABOUT
Uses &amp; gratifications: Audience is ACTIVE - people choose media
                       to satisfy specific needs (see Chapter 5)
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Every later chapter — attention, learning, persuasion, social media, ethics — sits on top of one idea: media effects are not automatic. They depend on the message, the person, and the context.</div>`,
    `<span class="eyebrow">MMP201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan tâm lý học truyền thông</h2>
<h3>"Truyền thông" gồm những gì?</h3>
<p><strong>Tâm lý học truyền thông</strong> là nghiên cứu khoa học về việc con người tương tác với truyền thông ra sao — truyền hình, phim ảnh, quảng cáo, tin tức, game, và các nền tảng số/xã hội — và tương tác đó định hình nhận thức, cảm xúc, thái độ và hành vi thế nào. Đây là lĩnh vực ứng dụng: cùng một lý thuyết giải thích được một quảng cáo chính trị, một video TikTok viral, và cách một trò chơi được thiết kế.</p>
<h3>Lịch sử ngắn</h3>
<p>Đầu thế kỷ 20, nghiên cứu về tuyên truyền thời chiến giả định truyền thông có tác động mạnh, trực tiếp lên một khán giả bị động (mô hình "mũi kim tiêm dưới da"). Nghiên cứu sau đó cho thấy khán giả <em>chủ động</em> — họ chọn lọc, diễn giải và chống lại thông điệp. Ngày nay lĩnh vực này nghiên cứu cả truyền thông đại chúng (TV, tin tức) và truyền thông tương tác/xã hội, nơi khán giả cũng đồng thời là người sản xuất.</p>
<h3>Ba mô hình kinh điển</h3>
<pre><code>Mô hình truyền tải:      Người gửi -> Thông điệp -> Kênh -> Người nhận
Thiết lập chương trình:  Truyền thông không bảo bạn NGHĨ GÌ,
                        nó bảo bạn NÊN NGHĨ VỀ ĐIỀU GÌ
Uses &amp; gratifications:   Khán giả CHỦ ĐỘNG - người ta chọn truyền
                        thông để thoả mãn nhu cầu cụ thể (xem Chương 5)
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Mọi chương sau — chú ý, học tập, thuyết phục, truyền thông xã hội, đạo đức — đều dựa trên một ý: tác động truyền thông không tự động xảy ra. Nó phụ thuộc vào thông điệp, con người, và ngữ cảnh.</div>`,
  ]]);

const c1q = quiz('mmp201-quiz-1', 'Quiz 1 — Overview|||Quiz 1 — Tổng quan', [
  { id: 'q1', question: 'Mô hình "mũi kim tiêm dưới da" (hypodermic needle) giả định điều gì?', options: ['Khán giả chủ động chọn lọc thông điệp', 'Truyền thông có tác động mạnh, trực tiếp lên khán giả bị động', 'Truyền thông chỉ ảnh hưởng qua bạn bè', 'Không có tác động nào cả'], correctIndex: 1, explanation: 'Đây là mô hình sớm, xem khán giả thụ động trước tác động truyền thông mạnh.' },
  { id: 'q2', question: 'Thuyết thiết lập chương trình nghị sự (agenda-setting) nói truyền thông làm gì?', options: ['Bảo khán giả nên tin điều gì', 'Bảo khán giả nên nghĩ VỀ điều gì', 'Không có ảnh hưởng nào', 'Chỉ giải trí, không thông tin'], correctIndex: 1, explanation: 'Agenda-setting: truyền thông định hướng chủ đề được chú ý, không ép buộc quan điểm.' },
  { id: 'q3', question: 'Điểm khác biệt của mô hình "uses & gratifications" so với mô hình truyền tải cổ điển?', options: ['Xem khán giả chủ động, chọn media để thoả mãn nhu cầu', 'Xem khán giả hoàn toàn bị động', 'Chỉ áp dụng cho quảng cáo', 'Bỏ qua vai trò của người gửi'], correctIndex: 0, explanation: 'Uses & gratifications coi người xem là chủ động lựa chọn, không chỉ tiếp nhận.' },
]);

const c2 = doc('mmp201-2-1-perception-attention', '2.1 — Perception, attention & information processing|||2.1 — Nhận thức, chú ý & xử lý thông tin truyền thông',
  'Chú ý có chọn lọc (selective attention), tri giác thông điệp, mô hình xử lý kép (dual-process), tải nhận thức khi xem media.',
  [[
    `<span class="eyebrow">MMP201 · Chapter 2 · Lesson 2.1</span>
<h2>Perception, attention &amp; information processing</h2>
<h3>Selective attention</h3>
<p>We are exposed to far more media than we can process, so the mind filters. <strong>Selective attention</strong> means we notice what is salient (loud, moving, novel, relevant to our goals) and filter out the rest — this is why ads use motion, contrast and faces to "capture" attention.</p>
<h3>From perception to meaning</h3>
<p>Perception is not a camera; it is construction. Prior <strong>schemas</strong> (mental templates from past experience) shape how an ambiguous message gets interpreted — two people can watch the same news clip and perceive opposite meanings.</p>
<h3>Dual-process view of processing</h3>
<pre><code>System 1 (fast, automatic)  -> heuristics, emotion, gut reaction
System 2 (slow, effortful)  -> deliberate analysis, requires
                                attention &amp; motivation
</code></pre>
<p>Most everyday media consumption runs on System 1 — this is exactly why persuasion techniques that rely on quick cues (a trusted face, a catchy jingle) work so well, and why fact-checking (System 2) is comparatively hard to trigger.</p>
<div class="callout"><span class="badge">Cognitive load</span> Multitasking with media (scrolling while watching TV) reduces how deeply any single message is processed — encoding is shallower, memory for it weaker.</div>`,
    `<span class="eyebrow">MMP201 · Chương 2 · Bài 2.1</span>
<h2>Nhận thức, chú ý &amp; xử lý thông tin truyền thông</h2>
<h3>Chú ý có chọn lọc</h3>
<p>Ta tiếp xúc với nhiều truyền thông hơn khả năng xử lý, nên tâm trí phải lọc. <strong>Chú ý có chọn lọc</strong> nghĩa là ta chú ý đến cái nổi bật (to, động, mới, liên quan mục tiêu của mình) và lọc bỏ phần còn lại — đây là lý do quảng cáo dùng chuyển động, độ tương phản và khuôn mặt để "bắt" sự chú ý.</p>
<h3>Từ tri giác đến ý nghĩa</h3>
<p>Tri giác không phải một chiếc camera; nó là sự kiến tạo. <strong>Sơ đồ nhận thức (schema)</strong> có sẵn từ kinh nghiệm cũ định hình việc một thông điệp mơ hồ được diễn giải ra sao — hai người xem cùng một đoạn tin có thể tri giác ra hai ý nghĩa đối lập.</p>
<h3>Góc nhìn xử lý kép</h3>
<pre><code>Hệ thống 1 (nhanh, tự động) -> lối tắt (heuristic), cảm xúc,
                               phản ứng bản năng
Hệ thống 2 (chậm, tốn công)  -> phân tích có chủ đích, cần
                               chú ý &amp; động lực
</code></pre>
<p>Phần lớn việc tiêu thụ truyền thông hàng ngày chạy trên Hệ thống 1 — đây chính là lý do các kỹ thuật thuyết phục dựa vào gợi ý nhanh (một khuôn mặt đáng tin, một đoạn nhạc bắt tai) hiệu quả đến vậy, và vì sao việc kiểm chứng thông tin (Hệ thống 2) tương đối khó kích hoạt.</p>
<div class="callout"><span class="badge">Tải nhận thức</span> Đa nhiệm với truyền thông (cuộn điện thoại khi đang xem TV) làm giảm độ sâu xử lý mỗi thông điệp — mã hoá hời hợt hơn, trí nhớ về nó yếu hơn.</div>`,
  ]]);

const c2q = quiz('mmp201-quiz-2', 'Quiz 2 — Perception & attention|||Quiz 2 — Nhận thức & chú ý', [
  { id: 'q1', question: 'Chú ý có chọn lọc là gì?', options: ['Xử lý mọi thông điệp truyền thông như nhau', 'Chú ý đến cái nổi bật, lọc bỏ phần còn lại', 'Chỉ xảy ra khi xem TV', 'Không liên quan đến quảng cáo'], correctIndex: 1, explanation: 'Tâm trí lọc thông tin, ưu tiên cái nổi bật/liên quan mục tiêu.' },
  { id: 'q2', question: 'Sơ đồ nhận thức (schema) ảnh hưởng đến điều gì?', options: ['Tốc độ mạng khi xem video', 'Cách một thông điệp mơ hồ được diễn giải', 'Độ phân giải màn hình', 'Giá quảng cáo'], correctIndex: 1, explanation: 'Schema là khung có sẵn định hình việc diễn giải thông điệp mới.' },
  { id: 'q3', question: 'Đa nhiệm khi xem media (vừa xem vừa lướt điện thoại) có xu hướng gây ra điều gì?', options: ['Xử lý sâu hơn, nhớ tốt hơn', 'Xử lý hời hợt hơn, trí nhớ yếu hơn', 'Không ảnh hưởng gì', 'Chỉ ảnh hưởng đến quảng cáo, không ảnh hưởng tin tức'], correctIndex: 1, explanation: 'Tải nhận thức tăng khi đa nhiệm làm giảm độ sâu mã hoá thông tin.' },
]);

const c3 = doc('mmp201-3-1-social-learning-bandura', '3.1 — Social learning theory & media effects (Bandura)|||3.1 — Thuyết học tập xã hội & tác động truyền thông (Bandura)',
  'Thuyết học tập xã hội của Bandura; thí nghiệm búp bê Bobo; bốn bước làm mẫu (mô hình hoá); tự hiệu quả (self-efficacy) và bắt chước hành vi bạo lực/tích cực từ media.',
  [[
    `<span class="eyebrow">MMP201 · Chapter 3 · Lesson 3.1</span>
<h2>Social learning theory &amp; media effects (Bandura)</h2>
<h3>Learning by watching</h3>
<p>Albert Bandura's <strong>social learning theory</strong> (later social cognitive theory) argues people learn behavior not only from direct experience but by <strong>observing others</strong> — including media characters — and the consequences they receive. His famous <strong>Bobo doll experiment</strong> showed children who watched an adult act aggressively toward a doll later imitated that aggression themselves.</p>
<h3>Four steps of modeling</h3>
<pre><code>1. Attention    -> the viewer must notice the modeled behavior
2. Retention    -> the behavior must be remembered
3. Reproduction -> the viewer must be physically/skillfully able to copy it
4. Motivation   -> there must be a reason to perform it
   (reward seen, or simply expected)
</code></pre>
<h3>Self-efficacy &amp; vicarious reinforcement</h3>
<p>Watching a model succeed (or get punished) changes the viewer's <strong>self-efficacy</strong> — their belief they can do the same thing. This is why media role models matter: a character who is rewarded for aggression, generosity, or a health behavior can shift what viewers believe is normal and effective, without the viewer ever trying it themselves.</p>
<div class="callout"><span class="badge">Two-sided</span> The same mechanism that explains imitated violence also explains pro-social effects — public-health campaigns and educational shows (e.g. modeling healthy eating or kindness) deliberately use modeling to teach.</div>`,
    `<span class="eyebrow">MMP201 · Chương 3 · Bài 3.1</span>
<h2>Thuyết học tập xã hội &amp; tác động truyền thông (Bandura)</h2>
<h3>Học bằng cách quan sát</h3>
<p><strong>Thuyết học tập xã hội</strong> của Albert Bandura (sau này là thuyết nhận thức xã hội) cho rằng con người học hành vi không chỉ qua kinh nghiệm trực tiếp mà còn bằng cách <strong>quan sát người khác</strong> — kể cả nhân vật trên truyền thông — và hệ quả họ nhận được. <strong>Thí nghiệm búp bê Bobo</strong> nổi tiếng của ông cho thấy trẻ xem người lớn hành xử hung hăng với búp bê sau đó bắt chước chính hành vi đó.</p>
<h3>Bốn bước làm mẫu (mô hình hoá)</h3>
<pre><code>1. Chú ý       -> người xem phải nhận ra hành vi được làm mẫu
2. Ghi nhớ     -> hành vi phải được lưu lại trong trí nhớ
3. Tái tạo     -> người xem phải có khả năng thể chất/kỹ năng để lặp lại
4. Động lực    -> phải có lý do để thực hiện
   (thấy được thưởng, hoặc chỉ đơn giản là kỳ vọng được thưởng)
</code></pre>
<h3>Tự hiệu quả &amp; củng cố gián tiếp</h3>
<p>Xem một mô hình thành công (hoặc bị phạt) làm thay đổi <strong>tự hiệu quả (self-efficacy)</strong> của người xem — niềm tin rằng họ cũng làm được điều đó. Đây là lý do hình mẫu trên truyền thông quan trọng: một nhân vật được thưởng vì hành vi hung hăng, rộng lượng, hay một hành vi sức khoẻ có thể thay đổi điều người xem tin là bình thường và hiệu quả, dù họ chưa từng thử.</p>
<div class="callout"><span class="badge">Hai chiều</span> Cùng cơ chế giải thích hành vi bạo lực bị bắt chước cũng giải thích tác động tích cực — chiến dịch y tế công cộng và chương trình giáo dục (vd làm mẫu ăn uống lành mạnh hay tử tế) chủ động dùng mô hình hoá để dạy.</div>`,
  ]]);

const c3q = quiz('mmp201-quiz-3', 'Quiz 3 — Social learning (Bandura)|||Quiz 3 — Học tập xã hội (Bandura)', [
  { id: 'q1', question: 'Thí nghiệm búp bê Bobo của Bandura cho thấy điều gì?', options: ['Trẻ không bị ảnh hưởng bởi thứ chúng xem', 'Trẻ bắt chước hành vi hung hăng đã quan sát từ người lớn', 'Chỉ người lớn mới học qua quan sát', 'Học tập chỉ xảy ra qua trải nghiệm trực tiếp'], correctIndex: 1, explanation: 'Trẻ xem hành vi hung hăng với búp bê rồi bắt chước lại chính hành vi đó.' },
  { id: 'q2', question: 'Bước nào trong 4 bước làm mẫu liên quan đến việc người xem PHẢI CÓ LÝ DO để thực hiện hành vi?', options: ['Chú ý', 'Ghi nhớ', 'Tái tạo', 'Động lực'], correctIndex: 3, explanation: 'Động lực là bước cuối: cần lý do (thưởng thấy được hoặc kỳ vọng) để thực hiện hành vi.' },
  { id: 'q3', question: 'Tự hiệu quả (self-efficacy) thay đổi khi nào theo Bandura?', options: ['Khi người xem thấy mô hình thành công hoặc bị phạt', 'Chỉ khi người xem tự trải nghiệm', 'Không bao giờ thay đổi qua media', 'Chỉ áp dụng cho trẻ em'], correctIndex: 0, explanation: 'Quan sát hệ quả (thành công/bị phạt) của mô hình làm thay đổi niềm tin về khả năng của bản thân.' },
]);

const c4 = doc('mmp201-4-1-emotion-persuasion-elm-cialdini', '4.1 — Emotion, persuasion & attitudes (ELM, Cialdini)|||4.1 — Cảm xúc, thuyết phục & thái độ (ELM, Cialdini)',
  'Mô hình khả năng chi tiết hoá (ELM): tuyến trung tâm vs tuyến ngoại vi; vai trò cảm xúc trong thuyết phục; sáu nguyên tắc thuyết phục của Cialdini.',
  [[
    `<span class="eyebrow">MMP201 · Chapter 4 · Lesson 4.1</span>
<h2>Emotion, persuasion &amp; attitudes</h2>
<h3>The Elaboration Likelihood Model (ELM)</h3>
<p>The <strong>ELM</strong> explains that persuasion happens along two routes, depending on how motivated and able the audience is to think carefully:</p>
<pre><code>Central route   -> high motivation/ability -> evaluates ARGUMENT
                    QUALITY -> attitude change is durable
Peripheral route -> low motivation/ability  -> relies on CUES
                    (attractive source, catchy music, emotion)
                    -> attitude change is weaker, less durable
</code></pre>
<h3>Emotion as a persuasion lever</h3>
<p>Emotional appeals (fear, humor, warmth, pride) are effective peripheral cues — they can shift attitudes fast, but without strong arguments behind them the shift tends to fade or reverse when the audience later thinks it through (the central route "wins" over time).</p>
<h3>Cialdini's six principles of influence</h3>
<ul>
<li><strong>Reciprocity</strong> — people return favors ("free sample" marketing).</li>
<li><strong>Commitment/consistency</strong> — small yeses lead to bigger yeses.</li>
<li><strong>Social proof</strong> — "everyone else is doing it" (reviews, bestseller lists).</li>
<li><strong>Liking</strong> — we're persuaded more by people/brands we like.</li>
<li><strong>Authority</strong> — experts and credentials increase compliance.</li>
<li><strong>Scarcity</strong> — limited availability increases perceived value ("only 3 left").</li>
</ul>
<div class="callout"><span class="badge">Ethical line</span> These principles describe how influence works — using them to inform honestly is persuasion; using them to mislead is manipulation. Chapter 8 returns to this line.</div>`,
    `<span class="eyebrow">MMP201 · Chương 4 · Bài 4.1</span>
<h2>Cảm xúc, thuyết phục &amp; thái độ</h2>
<h3>Mô hình khả năng chi tiết hoá (ELM)</h3>
<p><strong>ELM</strong> giải thích thuyết phục xảy ra theo hai tuyến, tuỳ vào việc khán giả có động lực và khả năng suy nghĩ kỹ hay không:</p>
<pre><code>Tuyến trung tâm -> động lực/khả năng cao -> đánh giá CHẤT LƯỢNG
                   LUẬN ĐIỂM -> thay đổi thái độ bền vững
Tuyến ngoại vi  -> động lực/khả năng thấp -> dựa vào GỢI Ý
                   (nguồn hấp dẫn, nhạc bắt tai, cảm xúc)
                   -> thay đổi thái độ yếu hơn, kém bền vững
</code></pre>
<h3>Cảm xúc như một đòn bẩy thuyết phục</h3>
<p>Kích thích cảm xúc (sợ hãi, hài hước, ấm áp, tự hào) là gợi ý ngoại vi hiệu quả — chúng có thể đổi thái độ nhanh, nhưng nếu thiếu luận điểm mạnh phía sau, sự thay đổi đó thường phai nhạt hoặc đảo ngược khi khán giả sau đó suy nghĩ kỹ (tuyến trung tâm "thắng" theo thời gian).</p>
<h3>Sáu nguyên tắc thuyết phục của Cialdini</h3>
<ul>
<li><strong>Có qua có lại (reciprocity)</strong> — người ta đáp lại ơn nghĩa ("mẫu thử miễn phí" trong marketing).</li>
<li><strong>Cam kết/nhất quán</strong> — những cái "đồng ý" nhỏ dẫn đến cái "đồng ý" lớn hơn.</li>
<li><strong>Bằng chứng xã hội</strong> — "mọi người khác đều làm vậy" (đánh giá, danh sách bán chạy).</li>
<li><strong>Thiện cảm (liking)</strong> — ta dễ bị thuyết phục hơn bởi người/thương hiệu ta thích.</li>
<li><strong>Uy quyền</strong> — chuyên gia và chứng chỉ làm tăng sự tuân theo.</li>
<li><strong>Khan hiếm</strong> — nguồn cung hạn chế làm tăng giá trị cảm nhận ("chỉ còn 3 suất").</li>
</ul>
<div class="callout"><span class="badge">Ranh giới đạo đức</span> Các nguyên tắc này mô tả cách ảnh hưởng hoạt động — dùng chúng để thông tin trung thực là thuyết phục; dùng để đánh lừa là thao túng. Chương 8 sẽ trở lại ranh giới này.</div>`,
  ]]);

const c4q = quiz('mmp201-quiz-4', 'Quiz 4 — Persuasion (ELM & Cialdini)|||Quiz 4 — Thuyết phục (ELM & Cialdini)', [
  { id: 'q1', question: 'Theo ELM, tuyến trung tâm được dùng khi nào?', options: ['Khán giả có động lực/khả năng thấp', 'Khán giả có động lực/khả năng cao, đánh giá chất lượng luận điểm', 'Chỉ khi có nhạc hay', 'Không bao giờ dùng trong quảng cáo'], correctIndex: 1, explanation: 'Tuyến trung tâm cần động lực và khả năng cao để phân tích luận điểm, tạo thay đổi bền vững.' },
  { id: 'q2', question: 'Nguyên tắc "khan hiếm" của Cialdini hoạt động dựa trên?', options: ['Nguồn cung hạn chế làm tăng giá trị cảm nhận', 'Chuyên gia luôn đúng', 'Mọi người đều thích giống nhau', 'Trả ơn khi nhận quà'], correctIndex: 0, explanation: 'Khan hiếm: ít ỏi/hạn chế khiến người ta đánh giá cao hơn và hành động nhanh hơn.' },
  { id: 'q3', question: 'Vì sao thay đổi thái độ qua tuyến ngoại vi (gợi ý cảm xúc) thường kém bền vững?', options: ['Vì nó không liên quan gì đến thái độ', 'Vì thiếu luận điểm mạnh nên dễ phai/đảo ngược khi suy nghĩ kỹ lại', 'Vì tuyến ngoại vi luôn sai', 'Vì chỉ áp dụng cho trẻ em'], correctIndex: 1, explanation: 'Không có nền luận điểm chắc, hiệu ứng cảm xúc dễ mất đi khi tuyến trung tâm được kích hoạt sau đó.' },
]);

const c5 = doc('mmp201-5-1-audience-uses-gratifications', '5.1 — Audience psychology & engagement (uses & gratifications)|||5.1 — Tâm lý khán giả & sự tham gia (uses & gratifications)',
  'Thuyết uses & gratifications: khán giả chủ động chọn media để thoả mãn nhu cầu; các nhóm nhu cầu chính (thông tin, giải trí, đồng nhất bản thân, tương tác xã hội, thoát li).',
  [[
    `<span class="eyebrow">MMP201 · Chapter 5 · Lesson 5.1</span>
<h2>Audience psychology &amp; engagement (uses &amp; gratifications)</h2>
<h3>The audience chooses</h3>
<p>The <strong>uses &amp; gratifications</strong> approach flips the classic question from "what does media do to people?" to "what do people do with media?" It treats the audience as goal-directed: people select specific media and content to satisfy specific psychological or social needs.</p>
<h3>Core gratification categories</h3>
<pre><code>Information       -> learning, surveillance of the environment
Entertainment     -> escape, relaxation, emotional release
Personal identity -> value reinforcement, self-understanding
Social interaction -> connecting, conversation topics, belonging
Escapism          -> diversion from problems / boredom
</code></pre>
<h3>Why it explains engagement</h3>
<p>This model explains binge-watching, fandoms, and why the same show gratifies different viewers differently — one watches a drama for escapism, another for social conversation with friends the next day. It also predicts <strong>media substitution</strong>: when one medium stops meeting a need (e.g. TV news feels too slow), audiences switch to another (a live social feed) that meets the same need faster.</p>
<div class="callout"><span class="badge">Design implication</span> Platforms study which gratifications keep users engaged (notifications for social connection, autoplay for escapism) — the same theory that explains audience choice also explains addictive design (see Chapter 7).</div>`,
    `<span class="eyebrow">MMP201 · Chương 5 · Bài 5.1</span>
<h2>Tâm lý khán giả &amp; sự tham gia (uses &amp; gratifications)</h2>
<h3>Khán giả là người chọn</h3>
<p>Cách tiếp cận <strong>uses &amp; gratifications</strong> lật ngược câu hỏi kinh điển từ "truyền thông làm gì với con người?" thành "con người làm gì với truyền thông?" Nó xem khán giả là chủ thể có mục tiêu: người ta chọn media và nội dung cụ thể để thoả mãn nhu cầu tâm lý hoặc xã hội cụ thể.</p>
<h3>Các nhóm thoả mãn chính</h3>
<pre><code>Thông tin        -> học hỏi, giám sát môi trường xung quanh
Giải trí         -> thoát li, thư giãn, giải phóng cảm xúc
Bản sắc cá nhân  -> củng cố giá trị, tự hiểu bản thân
Tương tác xã hội -> kết nối, đề tài trò chuyện, thuộc về nhóm
Thoát li         -> tránh khỏi vấn đề / sự buồn chán
</code></pre>
<h3>Vì sao nó giải thích sự tham gia</h3>
<p>Mô hình này giải thích việc xem liên tục nhiều tập (binge-watching), fandom, và vì sao cùng một show thoả mãn khác nhau ở mỗi người xem — người này xem phim để thoát li, người khác xem để có đề tài nói chuyện với bạn hôm sau. Nó còn dự đoán <strong>sự thay thế media</strong>: khi một loại media không còn đáp ứng một nhu cầu (vd tin TV có vẻ quá chậm), khán giả chuyển sang loại khác (mạng xã hội trực tiếp) đáp ứng nhu cầu đó nhanh hơn.</p>
<div class="callout"><span class="badge">Hàm ý thiết kế</span> Các nền tảng nghiên cứu thoả mãn nào giữ chân người dùng (thông báo cho kết nối xã hội, tự động phát cho thoát li) — cùng lý thuyết giải thích lựa chọn của khán giả cũng giải thích thiết kế gây nghiện (xem Chương 7).</div>`,
  ]]);

const c5q = quiz('mmp201-quiz-5', 'Quiz 5 — Uses & gratifications|||Quiz 5 — Uses & gratifications', [
  { id: 'q1', question: 'Thuyết uses & gratifications đặt câu hỏi trung tâm là gì?', options: ['Truyền thông làm gì với con người?', 'Con người làm gì với truyền thông?', 'Truyền thông kiếm tiền thế nào?', 'Ai kiểm soát truyền thông?'], correctIndex: 1, explanation: 'Thuyết này xem khán giả chủ động, chọn media để thoả mãn nhu cầu — ngược với hỏi tác động một chiều.' },
  { id: 'q2', question: 'Khi một người xem phim để tránh cảm giác buồn chán, đó là nhóm thoả mãn nào?', options: ['Thông tin', 'Tương tác xã hội', 'Thoát li', 'Bản sắc cá nhân'], correctIndex: 2, explanation: 'Thoát li (escapism): dùng media để tránh vấn đề/sự buồn chán.' },
  { id: 'q3', question: '"Sự thay thế media" (media substitution) xảy ra khi nào?', options: ['Khi một media không còn đáp ứng nhu cầu, khán giả chuyển sang media khác đáp ứng nhanh hơn', 'Khi một kênh TV đổi tên', 'Khi giá quảng cáo tăng', 'Không bao giờ xảy ra'], correctIndex: 0, explanation: 'Khán giả chủ động chuyển media khi nhu cầu không còn được thoả mãn tốt.' },
]);

const c6 = doc('mmp201-6-1-social-media-online-psychology', '6.1 — Social media & online psychology|||6.1 — Truyền thông xã hội & tâm lý trực tuyến',
  'Bản sắc trực tuyến (identity), so sánh xã hội (social comparison) trên social media, hiệu ứng làm nổi bật bản thân (highlight-reel), phòng vọng âm (echo chamber).',
  [[
    `<span class="eyebrow">MMP201 · Chapter 6 · Lesson 6.1</span>
<h2>Social media &amp; online psychology</h2>
<h3>Curated identity</h3>
<p>On social platforms, people don't just <em>report</em> their identity — they <strong>construct</strong> it through selective posting, filters, and edited self-presentation. This "highlight-reel" effect means the version of others' lives we see is systematically more positive than reality.</p>
<h3>Social comparison</h3>
<p>Leon Festinger's <strong>social comparison theory</strong> — we evaluate ourselves by comparing to others — explains a lot of social media's emotional impact. Comparing our ordinary day to someone's curated highlight-reel is an <strong>upward comparison</strong> that reliably lowers mood and self-esteem, especially around appearance and achievement.</p>
<h3>Echo chambers &amp; algorithmic feedback</h3>
<pre><code>User engages with content -> algorithm learns preference
   -> feed shows MORE similar content -> beliefs feel more
   "confirmed" and less challenged -> polarization risk grows
</code></pre>
<div class="callout"><span class="badge">Not all negative</span> The same platforms support identity exploration, finding community (especially for marginalized groups), and social support — the psychological effect depends heavily on HOW the platform is used, not just time spent.</div>`,
    `<span class="eyebrow">MMP201 · Chương 6 · Bài 6.1</span>
<h2>Truyền thông xã hội &amp; tâm lý trực tuyến</h2>
<h3>Bản sắc được chọn lọc dựng nên</h3>
<p>Trên các nền tảng xã hội, con người không chỉ <em>phản ánh</em> bản sắc của mình — họ <strong>xây dựng</strong> nó qua việc đăng bài có chọn lọc, dùng filter, và tự thể hiện đã được biên tập. Hiệu ứng "cuốn phim điểm nhấn" (highlight-reel) này khiến phiên bản đời sống người khác mà ta thấy có hệ thống tích cực hơn thực tế.</p>
<h3>So sánh xã hội</h3>
<p><strong>Thuyết so sánh xã hội</strong> của Leon Festinger — ta đánh giá bản thân bằng cách so sánh với người khác — giải thích nhiều tác động cảm xúc của social media. So sánh ngày thường của mình với "cuốn phim điểm nhấn" đã chọn lọc của người khác là một <strong>so sánh hướng lên</strong>, thường làm giảm tâm trạng và tự trọng, đặc biệt về ngoại hình và thành tích.</p>
<h3>Phòng vọng âm &amp; phản hồi thuật toán</h3>
<pre><code>Người dùng tương tác với nội dung -> thuật toán học sở thích
   -> nguồn tin hiện NHIỀU nội dung tương tự -> niềm tin cảm thấy
   được "xác nhận" hơn, ít bị thử thách hơn -> nguy cơ phân cực tăng
</code></pre>
<div class="callout"><span class="badge">Không chỉ tiêu cực</span> Cùng những nền tảng đó hỗ trợ khám phá bản sắc, tìm cộng đồng (đặc biệt cho nhóm thiểu số), và hỗ trợ xã hội — tác động tâm lý phụ thuộc nhiều vào CÁCH dùng nền tảng, không chỉ thời gian dùng.</div>`,
  ]]);

const c6q = quiz('mmp201-quiz-6', 'Quiz 6 — Social media psychology|||Quiz 6 — Tâm lý truyền thông xã hội', [
  { id: 'q1', question: 'Hiệu ứng "highlight-reel" trên social media là gì?', options: ['Mọi bài đăng đều ngẫu nhiên', 'Người dùng chọn lọc đăng phần tích cực nhất, khiến đời người khác có vẻ tốt hơn thực tế', 'Chỉ áp dụng cho người nổi tiếng', 'Không ảnh hưởng đến tâm trạng'], correctIndex: 1, explanation: 'Đăng bài có chọn lọc tạo ra bức tranh tích cực hơn thực tế đời sống.' },
  { id: 'q2', question: 'So sánh hướng lên (upward comparison) trên social media thường gây ra điều gì?', options: ['Tăng tự trọng', 'Giảm tâm trạng và tự trọng', 'Không ảnh hưởng gì', 'Chỉ ảnh hưởng người lớn tuổi'], correctIndex: 1, explanation: 'So sánh bản thân với cuốn phim điểm nhấn của người khác thường hạ tâm trạng/tự trọng.' },
  { id: 'q3', question: 'Phòng vọng âm (echo chamber) do thuật toán tạo ra bằng cách nào?', options: ['Hiện nội dung ngẫu nhiên hoàn toàn', 'Hiện nhiều nội dung tương tự sở thích đã thể hiện, ít thử thách niềm tin', 'Xoá hết nội dung cũ', 'Chỉ hiện tin tức chính thống'], correctIndex: 1, explanation: 'Thuật toán học sở thích rồi khuếch đại nội dung tương tự, giảm tiếp xúc quan điểm khác.' },
]);

const c7 = doc('mmp201-7-1-negative-effects', '7.1 — Negative effects: addiction, misinformation & mental health|||7.1 — Tác động tiêu cực: nghiện, tin giả & sức khoẻ tâm thần',
  'Nghiện media/mạng xã hội (biến đổi tâm trạng, dung sai, cai); tin giả lan nhanh vì cảm xúc; liên hệ giữa dùng mạng xã hội và sức khoẻ tâm thần.',
  [[
    `<span class="eyebrow">MMP201 · Chapter 7 · Lesson 7.1</span>
<h2>Negative effects: addiction, misinformation &amp; mental health</h2>
<h3>Media/social media "addiction"</h3>
<p>Problematic use shares features with behavioral addictions: <strong>mood modification</strong> (using the app to feel better), <strong>tolerance</strong> (needing more use for the same effect), <strong>withdrawal</strong> (irritability without access), and <strong>relapse</strong>. Variable rewards — a notification might or might not bring something good — are a known driver, the same mechanism behind slot machines.</p>
<h3>Why misinformation spreads faster than facts</h3>
<pre><code>High emotional arousal (anger, fear, surprise) -> higher share rate
Novelty                                        -> feels worth sharing
Confirms existing belief                       -> low resistance
Fact-checks / corrections                      -> lower arousal,
                                                   arrive AFTER exposure
</code></pre>
<p>Studies repeatedly find false, emotionally charged stories travel further and faster than corrections — corrections rarely "catch up" with everyone who saw the original claim (the <strong>continued influence effect</strong>).</p>
<h3>Social media &amp; mental health</h3>
<p>Heavy, passive use (scrolling without interacting) correlates with higher anxiety and lower mood in several studies, more than active use (messaging friends). Correlation is not proof of one-way causation — pre-existing mood problems can also drive heavier passive use — but the pattern is consistent enough to warrant caution, especially for adolescents.</p>
<div class="callout"><span class="badge">Practical takeaway</span> Design features that create variable rewards, and content that provokes strong emotion, are exactly the features to be most alert to — both as a consumer and as anyone designing media products.</div>`,
    `<span class="eyebrow">MMP201 · Chương 7 · Bài 7.1</span>
<h2>Tác động tiêu cực: nghiện, tin giả &amp; sức khoẻ tâm thần</h2>
<h3>"Nghiện" media/mạng xã hội</h3>
<p>Việc sử dụng có vấn đề mang các đặc điểm của nghiện hành vi: <strong>biến đổi tâm trạng</strong> (dùng app để cảm thấy tốt hơn), <strong>dung sai (tolerance)</strong> (cần dùng nhiều hơn để có cùng hiệu ứng), <strong>hội chứng cai (withdrawal)</strong> (khó chịu khi không được dùng), và <strong>tái nghiện</strong>. Thưởng biến đổi (variable rewards) — một thông báo có thể mang tin tốt hoặc không — là động lực đã được biết đến, cùng cơ chế đứng sau máy đánh bạc.</p>
<h3>Vì sao tin giả lan nhanh hơn sự thật</h3>
<pre><code>Kích thích cảm xúc mạnh (giận, sợ, ngạc nhiên) -> tỉ lệ chia sẻ cao hơn
Sự mới lạ                                      -> cảm thấy đáng chia sẻ
Xác nhận niềm tin sẵn có                       -> ít bị phản kháng
Kiểm chứng/đính chính                          -> ít kích thích cảm
                                                   xúc, đến SAU khi đã lan
</code></pre>
<p>Nhiều nghiên cứu liên tục cho thấy tin sai, mang cảm xúc mạnh lan xa và nhanh hơn đính chính — đính chính hiếm khi "đuổi kịp" mọi người đã thấy tuyên bố gốc (<strong>hiệu ứng ảnh hưởng tiếp diễn</strong>).</p>
<h3>Mạng xã hội &amp; sức khoẻ tâm thần</h3>
<p>Sử dụng thụ động, nhiều giờ (cuộn xem mà không tương tác) tương quan với lo âu cao hơn và tâm trạng thấp hơn trong nhiều nghiên cứu, hơn so với dùng chủ động (nhắn tin với bạn). Tương quan không chứng minh nhân quả một chiều — vấn đề tâm trạng sẵn có cũng có thể khiến người ta dùng thụ động nhiều hơn — nhưng khuôn mẫu này đủ ổn định để cần thận trọng, đặc biệt với thanh thiếu niên.</p>
<div class="callout"><span class="badge">Bài học thực tế</span> Các tính năng thiết kế tạo thưởng biến đổi, và nội dung kích thích cảm xúc mạnh, chính là điều cần cảnh giác nhất — cả với người dùng và người thiết kế sản phẩm truyền thông.</div>`,
  ]]);

const c7q = quiz('mmp201-quiz-7', 'Quiz 7 — Negative effects|||Quiz 7 — Tác động tiêu cực', [
  { id: 'q1', question: 'Cơ chế "thưởng biến đổi" (variable rewards) trong nghiện app hoạt động thế nào?', options: ['Luôn thưởng cố định mỗi lần mở app', 'Thông báo có thể mang tin tốt hoặc không, khiến người dùng kiểm tra liên tục', 'Không liên quan đến hành vi nghiện', 'Chỉ xảy ra ở trò chơi điện tử'], correctIndex: 1, explanation: 'Thưởng không chắc chắn (như máy đánh bạc) thúc đẩy kiểm tra lặp lại.' },
  { id: 'q2', question: 'Vì sao tin giả thường lan nhanh hơn đính chính?', options: ['Tin giả luôn dài hơn', 'Tin giả thường kích thích cảm xúc mạnh và đến trước đính chính', 'Đính chính luôn bị chặn', 'Không có sự khác biệt về tốc độ lan truyền'], correctIndex: 1, explanation: 'Cảm xúc mạnh + đến trước khiến tin giả lan xa hơn, đính chính khó đuổi kịp toàn bộ.' },
  { id: 'q3', question: 'Loại sử dụng mạng xã hội nào tương quan nhiều hơn với lo âu/tâm trạng thấp trong các nghiên cứu?', options: ['Sử dụng chủ động (nhắn tin với bạn)', 'Sử dụng thụ động (cuộn xem không tương tác)', 'Không dùng mạng xã hội', 'Chỉ dùng vào buổi sáng'], correctIndex: 1, explanation: 'Cuộn xem thụ động, không tương tác, tương quan nhiều hơn với lo âu/tâm trạng thấp.' },
]);

const c8 = doc('mmp201-8-1-advertising-marketing-ethics', '8.1 — Applications in advertising, marketing & ethical media|||8.1 — Ứng dụng trong quảng cáo, marketing & truyền thông có đạo đức',
  'Ứng dụng ELM/Cialdini/Bandura vào quảng cáo và marketing; ranh giới thuyết phục vs thao túng; nguyên tắc truyền thông có đạo đức (minh bạch, đồng thuận, không lợi dụng nhóm dễ tổn thương).',
  [[
    `<span class="eyebrow">MMP201 · Chapter 8 · Lesson 8.1</span>
<h2>Applications in advertising, marketing &amp; ethical media</h2>
<h3>Putting the theories to work</h3>
<p>Every chapter's theory becomes a practical tool: attention design uses perception principles (Ch.2); influencer marketing leans on modeling and vicarious reinforcement (Bandura, Ch.3); ad copy is written for central OR peripheral routes depending on the product (Ch.4); platform design leverages the specific gratification a product delivers (Ch.5); community-building content uses social identity mechanics responsibly (Ch.6).</p>
<h3>Persuasion vs. manipulation — the ethical line</h3>
<pre><code>Persuasion:  message is honest, claims are true,
             audience can reasonably evaluate &amp; decline
Manipulation: exploits a cognitive bias, hides material
              information, or targets a vulnerability
              the audience can't reasonably defend against
</code></pre>
<h3>Principles for ethical media practice</h3>
<ul>
<li><strong>Transparency</strong> — disclose sponsorship/ads clearly (no disguised native ads).</li>
<li><strong>Truthful claims</strong> — no fabricated scarcity, fake reviews, or fake urgency.</li>
<li><strong>Respect for vulnerable audiences</strong> — extra care with children, and with health/financial anxiety triggers.</li>
<li><strong>Informed consent</strong> — especially for data-driven targeting and algorithmic personalization.</li>
</ul>
<div class="callout"><span class="badge">Closing thread</span> Media psychology gives real power to move attention, emotion and behavior (Ch.1-7). This course's last message: the same toolkit that can manipulate can also inform, help people make better decisions, and build healthier products — the theory is neutral, the application is a choice.</div>`,
    `<span class="eyebrow">MMP201 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng trong quảng cáo, marketing &amp; truyền thông có đạo đức</h2>
<h3>Đưa lý thuyết vào thực hành</h3>
<p>Lý thuyết mỗi chương trở thành công cụ thực tiễn: thiết kế thu hút chú ý dùng nguyên tắc tri giác (Ch.2); marketing qua influencer dựa vào mô hình hoá và củng cố gián tiếp (Bandura, Ch.3); nội dung quảng cáo được viết theo tuyến trung tâm HAY ngoại vi tuỳ sản phẩm (Ch.4); thiết kế nền tảng khai thác đúng loại thoả mãn sản phẩm mang lại (Ch.5); nội dung xây cộng đồng dùng cơ chế bản sắc xã hội một cách có trách nhiệm (Ch.6).</p>
<h3>Thuyết phục vs. thao túng — ranh giới đạo đức</h3>
<pre><code>Thuyết phục: thông điệp trung thực, tuyên bố đúng sự thật,
             khán giả có thể đánh giá &amp; từ chối hợp lý
Thao túng:   khai thác một thiên kiến nhận thức, che giấu
             thông tin quan trọng, hoặc nhắm vào điểm yếu
             mà khán giả khó tự bảo vệ một cách hợp lý
</code></pre>
<h3>Nguyên tắc thực hành truyền thông có đạo đức</h3>
<ul>
<li><strong>Minh bạch</strong> — công khai rõ tài trợ/quảng cáo (không nội dung native quảng cáo trá hình).</li>
<li><strong>Tuyên bố trung thực</strong> — không bịa khan hiếm, đánh giá giả, hay cấp bách giả.</li>
<li><strong>Tôn trọng nhóm dễ tổn thương</strong> — cẩn trọng hơn với trẻ em, và các yếu tố kích hoạt lo âu sức khoẻ/tài chính.</li>
<li><strong>Đồng thuận có thông tin</strong> — đặc biệt với target hoá theo dữ liệu và cá nhân hoá bằng thuật toán.</li>
</ul>
<div class="callout"><span class="badge">Lời kết</span> Tâm lý học truyền thông trao quyền năng thật để chuyển dịch chú ý, cảm xúc và hành vi (Ch.1-7). Thông điệp cuối của môn: cùng bộ công cụ có thể thao túng cũng có thể thông tin, giúp con người quyết định tốt hơn, và xây sản phẩm lành mạnh hơn — lý thuyết trung lập, ứng dụng là một lựa chọn.</div>`,
  ]]);

const c8q = quiz('mmp201-quiz-8', 'Quiz 8 — Advertising, marketing & ethics|||Quiz 8 — Quảng cáo, marketing & đạo đức', [
  { id: 'q1', question: 'Điểm khác nhau chính giữa thuyết phục và thao túng là gì?', options: ['Thuyết phục trung thực và để khán giả tự quyết; thao túng khai thác thiên kiến/che giấu thông tin', 'Không có khác biệt', 'Thao túng luôn hợp pháp', 'Thuyết phục chỉ dùng trong chính trị'], correctIndex: 0, explanation: 'Ranh giới nằm ở tính trung thực và khả năng khán giả tự đánh giá/từ chối.' },
  { id: 'q2', question: 'Nguyên tắc đạo đức nào yêu cầu công khai rõ nội dung được tài trợ?', options: ['Khan hiếm', 'Minh bạch', 'Uy quyền', 'So sánh xã hội'], correctIndex: 1, explanation: 'Minh bạch: phải công khai tài trợ/quảng cáo, tránh nội dung trá hình.' },
  { id: 'q3', question: 'Marketing qua influencer dựa chủ yếu vào cơ chế tâm lý nào đã học ở Chương 3?', options: ['Chú ý có chọn lọc', 'Mô hình hoá & củng cố gián tiếp (Bandura)', 'Phòng vọng âm', 'Bằng chứng xã hội duy nhất'], correctIndex: 1, explanation: 'Người xem học và tin theo hành vi được làm mẫu và củng cố qua influencer, đúng cơ chế học tập xã hội của Bandura.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'MMP201',
    slug: 'mmp201-media-psychology',
    title: 'Media Psychology',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MMP201.webp',
    shortDescription: 'How media shapes cognition, emotion & behavior — perception/attention, Bandura social learning, persuasion (ELM, Cialdini), audience uses & gratifications, social media psychology, negative effects, ethical advertising. Bilingual, with quizzes.|||Truyền thông định hình nhận thức, cảm xúc & hành vi ra sao — nhận thức/chú ý, học tập xã hội (Bandura), thuyết phục (ELM, Cialdini), tâm lý khán giả, tâm lý mạng xã hội, tác động tiêu cực, quảng cáo có đạo đức. Song ngữ, có quiz.',
    description: 'Môn <strong>MMP201 — Media Psychology</strong> (kỳ 2, khối Quản trị Kinh doanh) nghiên cứu <strong>con người tương tác với truyền thông ra sao</strong>. Từ <strong>tổng quan &amp; nhận thức/chú ý</strong> → <strong>học tập xã hội của Bandura</strong> → <strong>cảm xúc &amp; thuyết phục</strong> (ELM, Cialdini) → <strong>tâm lý khán giả</strong> (uses &amp; gratifications) → <strong>truyền thông xã hội &amp; bản sắc trực tuyến</strong> → <strong>tác động tiêu cực</strong> (nghiện, tin giả, sức khoẻ tâm thần) → <strong>ứng dụng có đạo đức</strong> trong quảng cáo &amp; marketing. Bám giáo trình FLM (Giles; Bandura; Cialdini), song ngữ, có quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa & lịch sử tâm lý học truyền thông; chú ý có chọn lọc, schema, xử lý kép; thuyết học tập xã hội của Bandura (4 bước mô hình hoá, self-efficacy); ELM (tuyến trung tâm/ngoại vi); 6 nguyên tắc thuyết phục Cialdini; uses & gratifications; bản sắc & so sánh xã hội trên social media, echo chamber; nghiện media, lan truyền tin giả, liên hệ sức khoẻ tâm thần; ứng dụng đạo đức trong quảng cáo & marketing.',
    requirements: 'Không yêu cầu kiến thức tâm lý học trước đó. Nên đọc trước Media Psychology (Giles) và Influence (Cialdini) nếu có sẵn.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách nền, tài liệu chính thức, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tâm lý học truyền thông, ba trụ cột, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan tâm lý học truyền thông|||Chapter 1 — Overview of media psychology', description: 'Định nghĩa, lịch sử, ba mô hình kinh điển.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nhận thức, chú ý & xử lý thông tin|||Chapter 2 — Perception, attention & processing', description: 'Chú ý có chọn lọc, schema, xử lý kép, tải nhận thức.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Học tập xã hội & tác động (Bandura)|||Chapter 3 — Social learning & effects (Bandura)', description: 'Bobo doll, 4 bước mô hình hoá, self-efficacy.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Cảm xúc, thuyết phục & thái độ|||Chapter 4 — Emotion, persuasion & attitudes', description: 'ELM (trung tâm/ngoại vi), 6 nguyên tắc Cialdini.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tâm lý khán giả & sự tham gia|||Chapter 5 — Audience psychology & engagement', description: 'Uses & gratifications, các nhóm nhu cầu, thay thế media.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Truyền thông xã hội & tâm lý trực tuyến|||Chapter 6 — Social media & online psychology', description: 'Bản sắc, so sánh xã hội, echo chamber.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tác động tiêu cực|||Chapter 7 — Negative effects', description: 'Nghiện, tin giả, sức khoẻ tâm thần.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng quảng cáo, marketing & đạo đức|||Chapter 8 — Advertising, marketing & ethics', description: 'Áp dụng lý thuyết, thuyết phục vs thao túng, nguyên tắc đạo đức.', lessons: [c8, c8q] },
  ],
};
