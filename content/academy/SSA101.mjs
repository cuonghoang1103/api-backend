/**
 * SSA101 — Academic Skills (Kỹ năng học thuật). Ngành Robotics & AI, Kỳ 1, FPTU.
 * Môn kỹ năng nền tảng cho tân sinh viên: chuyển tiếp đại học & tư duy phát
 * triển, quản lý thời gian, ghi chép, đọc học thuật & tư duy phản biện, ghi
 * nhớ, nghiên cứu & liêm chính học thuật, thuyết trình & nhóm, ôn thi & nghề.
 * Giáo trình: Cottrell "The Study Skills Handbook"; Pauk "How to Study in
 * College" (Cornell); Oakley "A Mind for Numbers"; Covey "7 Habits".
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ssa101-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (Cottrell, Pauk, Oakley, Covey), khoá học miễn phí, YouTube, công cụ, lộ trình.',
  [[
    `<span class="eyebrow">SSA101 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to build strong <strong>academic skills</strong> — how to manage your time, take notes, read and think critically, remember more, write with integrity, present, and prepare for exams. The full official slides live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for SSA101 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Stella_Cottrell" target="_blank" rel="noopener">Stella Cottrell — <em>The Study Skills Handbook</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Walter_Pauk" target="_blank" rel="noopener">Walter Pauk — <em>How to Study in College</em> (Cornell method)</a></li>
<li><a href="https://barbaraoakley.com/books/a-mind-for-numbers/" target="_blank" rel="noopener">Barbara Oakley — <em>A Mind for Numbers</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People" target="_blank" rel="noopener">Stephen Covey — <em>The 7 Habits of Highly Effective People</em></a></li>
</ul>
<h3>🌐 Free courses &amp; guides</h3>
<ul>
<li><a href="https://www.coursera.org/learn/learning-how-to-learn" target="_blank" rel="noopener">Learning How to Learn — Oakley &amp; Sejnowski (Coursera, free to audit)</a></li>
<li><a href="https://learningcenter.unc.edu/tips-and-tools/" target="_blank" rel="noopener">UNC Learning Center — study tips &amp; tools</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ThomasFrank" target="_blank" rel="noopener">Thomas Frank</a> — study skills &amp; productivity</li>
<li><a href="https://www.youtube.com/@AliAbdaal" target="_blank" rel="noopener">Ali Abdaal</a> — evidence-based studying</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://apps.ankiweb.net/" target="_blank" rel="noopener">Anki</a> — spaced-repetition flashcards</li>
<li><a href="https://pomofocus.io/" target="_blank" rel="noopener">Pomofocus</a> — Pomodoro timer</li>
<li><a href="https://www.zotero.org/" target="_blank" rel="noopener">Zotero</a> — reference manager &amp; citations</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Set up your system</strong> — a calendar, a task list, and a weekly plan you actually keep.</li>
<li><strong>Learn how to learn</strong> — Cornell notes, active recall, spaced repetition; test yourself, don't just re-read.</li>
<li><strong>Read &amp; think</strong> — read academic sources critically, and cite everything honestly.</li>
<li><strong>Perform</strong> — present clearly, work well in a team, and walk into exams prepared and calm.</li>
</ol></div>`,
    `<span class="eyebrow">SSA101 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để xây <strong>kỹ năng học thuật</strong> vững — quản lý thời gian, ghi chép, đọc và tư duy phản biện, ghi nhớ tốt hơn, viết có liêm chính, thuyết trình và ôn thi. Slide chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SSA101 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Stella_Cottrell" target="_blank" rel="noopener">Stella Cottrell — <em>The Study Skills Handbook</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Walter_Pauk" target="_blank" rel="noopener">Walter Pauk — <em>How to Study in College</em> (phương pháp Cornell)</a></li>
<li><a href="https://barbaraoakley.com/books/a-mind-for-numbers/" target="_blank" rel="noopener">Barbara Oakley — <em>A Mind for Numbers</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People" target="_blank" rel="noopener">Stephen Covey — <em>7 Thói quen của người thành đạt</em></a></li>
</ul>
<h3>🌐 Khoá học &amp; hướng dẫn miễn phí</h3>
<ul>
<li><a href="https://www.coursera.org/learn/learning-how-to-learn" target="_blank" rel="noopener">Learning How to Learn — Oakley &amp; Sejnowski (Coursera, học thử miễn phí)</a></li>
<li><a href="https://learningcenter.unc.edu/tips-and-tools/" target="_blank" rel="noopener">UNC Learning Center — mẹo &amp; công cụ học tập</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ThomasFrank" target="_blank" rel="noopener">Thomas Frank</a> — kỹ năng học &amp; năng suất</li>
<li><a href="https://www.youtube.com/@AliAbdaal" target="_blank" rel="noopener">Ali Abdaal</a> — học dựa trên bằng chứng</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://apps.ankiweb.net/" target="_blank" rel="noopener">Anki</a> — thẻ ghi nhớ lặp lại ngắt quãng</li>
<li><a href="https://pomofocus.io/" target="_blank" rel="noopener">Pomofocus</a> — đồng hồ Pomodoro</li>
<li><a href="https://www.zotero.org/" target="_blank" rel="noopener">Zotero</a> — quản lý tài liệu &amp; trích dẫn</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Dựng hệ thống</strong> — một lịch, một danh sách việc, và một kế hoạch tuần bạn thật sự giữ được.</li>
<li><strong>Học cách học</strong> — ghi chép Cornell, ghi nhớ chủ động, lặp lại ngắt quãng; tự kiểm tra, đừng chỉ đọc lại.</li>
<li><strong>Đọc &amp; tư duy</strong> — đọc nguồn học thuật có phản biện, và trích dẫn trung thực mọi thứ.</li>
<li><strong>Thể hiện</strong> — thuyết trình rõ ràng, làm việc nhóm tốt, và bước vào phòng thi đã chuẩn bị và bình tĩnh.</li>
</ol></div>`,
  ]]);

const intro = doc('ssa101-0-1-overview', 'Course overview: Academic Skills|||Tổng quan: Kỹ năng học thuật',
  'Vì sao kỹ năng học quan trọng hơn IQ ở đại học; học là kỹ năng rèn được; lộ trình 8 chương: tư duy phát triển → thời gian → ghi chép → đọc/phản biện → ghi nhớ → nghiên cứu/liêm chính → thuyết trình/nhóm → thi & nghề.',
  [[
    `<span class="eyebrow">SSA101 · Lesson 0.1 · Overview</span>
<h2>Academic Skills</h2>
<p class="lead">University is not just "more school". You get less structure, more reading, and full responsibility for your own time. This course gives you the <strong>practical skills</strong> that decide who copes and who thrives — and the good news is every one of them is <strong>learnable</strong>, not a talent you're born with.</p>
<h3>Skills beat raw talent</h3>
<p>Two students with the same ability get very different grades because one <em>knows how to study</em> — plans time, tests themselves, reads critically, and stays calm in exams — while the other just works harder in less effective ways. This course closes that gap.</p>
<h3>Roadmap — 8 chapters</h3>
<ol>
<li><strong>Transition &amp; growth mindset</strong> — from school to university; ability grows with effort.</li>
<li><strong>Time management &amp; goals</strong> — SMART goals, Pomodoro, priorities.</li>
<li><strong>Note-taking</strong> — Cornell method, mind maps.</li>
<li><strong>Academic reading &amp; critical thinking</strong> — SQ3R, evaluating arguments.</li>
<li><strong>Memory &amp; effective learning</strong> — active recall, spaced repetition.</li>
<li><strong>Research, citation &amp; integrity</strong> — sources, referencing, avoiding plagiarism.</li>
<li><strong>Presentations &amp; teamwork</strong> — speak clearly, work in groups.</li>
<li><strong>Exams, stress &amp; career</strong> — revision, managing pressure, planning ahead.</li>
</ol>
<div class="callout"><span class="badge">How to use this course</span> Don't just read — <strong>apply one technique this week</strong>. Skills only stick when you practise them on your real subjects.</div>`,
    `<span class="eyebrow">SSA101 · Bài 0.1 · Tổng quan</span>
<h2>Kỹ năng học thuật</h2>
<p class="lead">Đại học không chỉ là "học nhiều hơn". Bạn có ít khuôn khổ hơn, đọc nhiều hơn, và tự chịu trách nhiệm hoàn toàn về thời gian của mình. Môn này trao cho bạn những <strong>kỹ năng thực hành</strong> quyết định ai chật vật và ai bứt phá — và tin vui là mọi kỹ năng đó đều <strong>học được</strong>, không phải tài năng bẩm sinh.</p>
<h3>Kỹ năng thắng năng khiếu thô</h3>
<p>Hai sinh viên cùng năng lực nhận điểm rất khác nhau vì một người <em>biết cách học</em> — lập kế hoạch thời gian, tự kiểm tra, đọc có phản biện, bình tĩnh khi thi — còn người kia chỉ cố sức theo cách kém hiệu quả. Môn này thu hẹp khoảng cách đó.</p>
<h3>Lộ trình — 8 chương</h3>
<ol>
<li><strong>Chuyển tiếp &amp; tư duy phát triển</strong> — từ phổ thông lên đại học; năng lực tăng theo nỗ lực.</li>
<li><strong>Quản lý thời gian &amp; mục tiêu</strong> — mục tiêu SMART, Pomodoro, ưu tiên.</li>
<li><strong>Kỹ năng ghi chép</strong> — phương pháp Cornell, sơ đồ tư duy.</li>
<li><strong>Đọc học thuật &amp; tư duy phản biện</strong> — SQ3R, đánh giá lập luận.</li>
<li><strong>Ghi nhớ &amp; học hiệu quả</strong> — ghi nhớ chủ động, lặp lại ngắt quãng.</li>
<li><strong>Nghiên cứu, trích dẫn &amp; liêm chính</strong> — nguồn, trích dẫn, tránh đạo văn.</li>
<li><strong>Thuyết trình &amp; làm việc nhóm</strong> — nói rõ ràng, làm việc theo nhóm.</li>
<li><strong>Thi cử, căng thẳng &amp; nghề nghiệp</strong> — ôn tập, quản lý áp lực, lập kế hoạch.</li>
</ol>
<div class="callout"><span class="badge">Cách dùng môn này</span> Đừng chỉ đọc — hãy <strong>áp dụng một kỹ thuật ngay tuần này</strong>. Kỹ năng chỉ ăn sâu khi bạn luyện trên chính các môn thật của mình.</div>`,
  ]]);

const c1 = doc('ssa101-1-1-transition-mindset', '1.1 — University transition &amp; growth mindset|||1.1 — Chuyển tiếp đại học &amp; tư duy phát triển',
  'Khác biệt phổ thông ↔ đại học (tự chủ, khối lượng đọc); tư duy phát triển (Dweck) vs tư duy cố định; "chưa làm được" (yet); biến thất bại thành phản hồi.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 1 · Lesson 1.1</span>
<h2>University transition &amp; growth mindset</h2>
<h3>School vs university</h3>
<pre><code>School                     University
------------------------   ------------------------
teachers chase you         you manage yourself
short, guided reading      long, independent reading
frequent small tests       fewer, high-stakes exams
timetable fixed for you    you build your own schedule
</code></pre>
<p>The biggest shock is <strong>freedom</strong>: no one checks whether you did the reading. That freedom is a gift only if you build your own structure — which is what the rest of this course teaches.</p>
<h3>Growth mindset (Carol Dweck)</h3>
<ul>
<li><strong>Fixed mindset:</strong> "I'm just not a maths person." Ability is seen as fixed, so a low mark feels like a verdict — and you avoid hard things to protect your ego.</li>
<li><strong>Growth mindset:</strong> "I can't do this <em>yet</em>." Ability is seen as trainable, so a low mark is <em>information</em> about what to practise next.</li>
</ul>
<p>The brain forms new connections when you struggle with something hard — <strong>difficulty is how learning happens</strong>, not a sign you lack talent.</p>
<div class="callout"><span class="badge">Try this</span> Catch yourself saying "I can't do X" and add the word <strong>"yet"</strong>. Then name one concrete next step. That single habit rewires how you meet every hard subject.</div>`,
    `<span class="eyebrow">SSA101 · Chương 1 · Bài 1.1</span>
<h2>Chuyển tiếp đại học &amp; tư duy phát triển</h2>
<h3>Phổ thông vs đại học</h3>
<pre><code>Phổ thông                  Đại học
------------------------   ------------------------
thầy cô nhắc nhở bạn        bạn tự quản lý mình
đọc ngắn, có dẫn dắt        đọc dài, tự lực
kiểm tra nhỏ liên tục       ít kỳ thi, trọng số cao
thời khoá biểu có sẵn       bạn tự dựng lịch của mình
</code></pre>
<p>Cú sốc lớn nhất là <strong>sự tự do</strong>: không ai kiểm tra bạn đã đọc bài chưa. Tự do đó chỉ là món quà nếu bạn tự dựng khuôn khổ cho mình — đúng thứ phần còn lại của môn này dạy.</p>
<h3>Tư duy phát triển (Carol Dweck)</h3>
<ul>
<li><strong>Tư duy cố định:</strong> "Mình vốn không có đầu óc toán." Năng lực bị coi là bất biến, nên điểm thấp giống một lời phán xét — và bạn né việc khó để giữ cái tôi.</li>
<li><strong>Tư duy phát triển:</strong> "Mình <em>chưa</em> làm được." Năng lực được coi là rèn được, nên điểm thấp là <em>thông tin</em> về thứ cần luyện tiếp.</li>
</ul>
<p>Não hình thành kết nối mới khi bạn vật lộn với thứ khó — <strong>khó khăn chính là cách việc học diễn ra</strong>, không phải dấu hiệu bạn thiếu tài năng.</p>
<div class="callout"><span class="badge">Thử ngay</span> Bắt gặp mình nói "Mình không làm được X" thì thêm từ <strong>"chưa"</strong>. Rồi nêu một bước tiếp theo cụ thể. Chỉ thói quen đó thôi đã đổi cách bạn đối mặt mọi môn khó.</div>`,
  ]]);

const c1q = quiz('ssa101-quiz-1', 'Quiz 1 — Transition & mindset|||Quiz 1 — Chuyển tiếp & tư duy', [
  { id: 'q1', question: 'Khác biệt lớn nhất khi lên đại học so với phổ thông là?', options: ['Bài tập dễ hơn', 'Bạn phải tự quản lý thời gian và việc học', 'Không còn thi cử', 'Thầy cô nhắc bài mỗi ngày'], correctIndex: 1, explanation: 'Đại học cho nhiều tự do hơn nhưng đòi tự chủ — bạn tự dựng khuôn khổ cho mình.' },
  { id: 'q2', question: 'Câu nào thể hiện TƯ DUY PHÁT TRIỂN?', options: ['"Mình vốn dốt lập trình."', '"Mình CHƯA làm được, cần luyện thêm."', '"Điểm thấp nghĩa là mình không hợp môn này."', '"Người giỏi thì sinh ra đã giỏi."'], correctIndex: 1, explanation: 'Tư duy phát triển coi năng lực rèn được; "chưa" biến thất bại thành bước luyện tiếp.' },
  { id: 'q3', question: 'Theo tư duy phát triển, một điểm kém nên được xem là?', options: ['Bằng chứng bạn thiếu tài năng', 'Lý do để bỏ môn', 'Thông tin phản hồi về thứ cần luyện', 'Chuyện may rủi'], correctIndex: 2, explanation: 'Điểm kém là dữ liệu chỉ ra chỗ cần cải thiện, không phải lời phán xét cố định.' },
]);

const c2 = doc('ssa101-2-1-time-goals', '2.1 — Time management &amp; goals|||2.1 — Quản lý thời gian &amp; mục tiêu',
  'Mục tiêu SMART; ma trận Eisenhower (khẩn/quan trọng); kế hoạch tuần; kỹ thuật Pomodoro; chống trì hoãn; "việc quan trọng trước" (Covey).',
  [[
    `<span class="eyebrow">SSA101 · Chapter 2 · Lesson 2.1</span>
<h2>Time management &amp; goals</h2>
<h3>SMART goals</h3>
<p>"Study more" is a wish, not a goal. Make it <strong>SMART</strong>:</p>
<pre><code>S  Specific    what exactly? ("finish Ch.3 problem set")
M  Measurable  how will you know it's done? (10 problems)
A  Achievable  realistic for the time you have
R  Relevant    tied to a real outcome (the midterm)
T  Time-bound  by when? ("by Friday 8pm")
</code></pre>
<h3>Priorities — the Eisenhower matrix</h3>
<pre><code>              URGENT            NOT URGENT
IMPORTANT     do now            schedule it   &lt;- growth lives here
NOT IMPORTANT delegate/trim     drop it
</code></pre>
<p>Covey's rule — <strong>"put first things first"</strong> — means protecting the <em>important-but-not-urgent</em> box (revision, projects) before it becomes a 2am emergency.</p>
<h3>Pomodoro technique</h3>
<p>Work in focused blocks: <strong>25 minutes on one task, 5-minute break</strong>; after four blocks take a longer 15–30 min break. It fights procrastination because starting "just 25 minutes" is easy, and it protects attention from constant task-switching.</p>
<div class="callout"><span class="badge">Beat procrastination</span> The hardest part is starting. Shrink the first step until it's laughably small — "open the file and read one paragraph" — and momentum usually carries you the rest of the way.</div>`,
    `<span class="eyebrow">SSA101 · Chương 2 · Bài 2.1</span>
<h2>Quản lý thời gian &amp; mục tiêu</h2>
<h3>Mục tiêu SMART</h3>
<p>"Học nhiều hơn" là mong ước, không phải mục tiêu. Hãy làm nó <strong>SMART</strong>:</p>
<pre><code>S  Cụ thể      chính xác cái gì? ("xong bài tập Chương 3")
M  Đo được     làm sao biết đã xong? (10 bài)
A  Khả thi     thực tế với thời gian bạn có
R  Liên quan   gắn với kết quả thật (bài giữa kỳ)
T  Có hạn      xong khi nào? ("trước 20h thứ Sáu")
</code></pre>
<h3>Ưu tiên — ma trận Eisenhower</h3>
<pre><code>                KHẨN             KHÔNG KHẨN
QUAN TRỌNG      làm ngay         lên lịch    &lt;- chỗ để trưởng thành
KHÔNG QT        giao/cắt bớt     bỏ đi
</code></pre>
<p>Nguyên tắc của Covey — <strong>"việc quan trọng làm trước"</strong> — nghĩa là bảo vệ ô <em>quan trọng nhưng chưa khẩn</em> (ôn tập, đồ án) trước khi nó thành cơn cháy nhà lúc 2h sáng.</p>
<h3>Kỹ thuật Pomodoro</h3>
<p>Làm theo khối tập trung: <strong>25 phút cho một việc, nghỉ 5 phút</strong>; sau bốn khối thì nghỉ dài 15–30 phút. Nó chống trì hoãn vì bắt đầu "chỉ 25 phút" thì dễ, và nó bảo vệ sự chú ý khỏi liên tục nhảy việc.</p>
<div class="callout"><span class="badge">Thắng trì hoãn</span> Khó nhất là lúc bắt đầu. Thu nhỏ bước đầu tiên đến mức buồn cười — "mở file và đọc một đoạn" — rồi đà thường sẽ kéo bạn đi tiếp.</div>`,
  ]]);

const c2q = quiz('ssa101-quiz-2', 'Quiz 2 — Time & goals|||Quiz 2 — Thời gian & mục tiêu', [
  { id: 'q1', question: 'Chữ "M" trong mục tiêu SMART nghĩa là?', options: ['Motivated (có động lực)', 'Measurable (đo được)', 'Major (quan trọng)', 'Mandatory (bắt buộc)'], correctIndex: 1, explanation: 'M = Measurable: phải có cách biết mục tiêu đã đạt hay chưa.' },
  { id: 'q2', question: 'Kỹ thuật Pomodoro cơ bản là?', options: ['Học liền 3 tiếng không nghỉ', '25 phút tập trung rồi nghỉ 5 phút', 'Chỉ học khi có hứng', 'Làm nhiều việc cùng lúc'], correctIndex: 1, explanation: 'Pomodoro: khối 25 phút tập trung + nghỉ ngắn, giúp bắt đầu dễ và giữ chú ý.' },
  { id: 'q3', question: 'Theo ma trận Eisenhower, việc "quan trọng nhưng CHƯA khẩn" (như ôn tập sớm) nên?', options: ['Bỏ đi', 'Lên lịch làm chủ động', 'Chỉ làm khi đã thành khẩn cấp', 'Giao cho người khác'], correctIndex: 1, explanation: 'Đây là ô "việc quan trọng làm trước" của Covey — lên lịch trước khi nó thành khủng hoảng.' },
]);

const c3 = doc('ssa101-3-1-note-taking', '3.1 — Note-taking: Cornell &amp; mind maps|||3.1 — Ghi chép: Cornell &amp; sơ đồ tư duy',
  'Vì sao chép nguyên văn kém hiệu quả; phương pháp Cornell (cột ghi/cột gợi ý/tóm tắt); sơ đồ tư duy cho ý liên kết; viết tay vs gõ máy.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 3 · Lesson 3.1</span>
<h2>Note-taking: Cornell &amp; mind maps</h2>
<p>Copying the lecturer word-for-word feels productive but teaches you little — you're transcribing, not thinking. Good notes <strong>process</strong> ideas in your own words.</p>
<h3>The Cornell method (Walter Pauk)</h3>
<p>Divide the page into three zones:</p>
<pre><code>+----------+---------------------------+
|  CUES    |   NOTES                   |
| (recall  |   main ideas, in your     |
|  questions|  own words, during class |
|  &amp; key   |                           |
|  words)  |                           |
|          |                           |
+----------+---------------------------+
|  SUMMARY: 2-3 sentences, from memory  |
+---------------------------------------+
</code></pre>
<ul>
<li><strong>Notes (right):</strong> capture main points during the lecture — not every word.</li>
<li><strong>Cues (left):</strong> afterwards, write questions and keywords that the notes answer.</li>
<li><strong>Summary (bottom):</strong> sum up the page in your own words. Later, cover the notes and answer the cues — instant self-testing.</li>
</ul>
<h3>Mind maps</h3>
<p>For <em>connected</em> ideas, a <strong>mind map</strong> beats a linear list: put the topic in the centre and branch outwards, so you see relationships, not just a sequence. Great for brainstorming an essay or revising how a whole topic fits together.</p>
<div class="callout"><span class="badge">Handwriting helps</span> Studies suggest writing notes by hand — because you can't keep up word-for-word — forces you to summarise, which is exactly the thinking that builds memory.</div>`,
    `<span class="eyebrow">SSA101 · Chương 3 · Bài 3.1</span>
<h2>Ghi chép: Cornell &amp; sơ đồ tư duy</h2>
<p>Chép nguyên văn lời giảng viên có vẻ năng suất nhưng dạy bạn rất ít — bạn đang chép lại, không phải suy nghĩ. Ghi chép tốt <strong>xử lý</strong> ý bằng lời của chính bạn.</p>
<h3>Phương pháp Cornell (Walter Pauk)</h3>
<p>Chia trang giấy thành ba vùng:</p>
<pre><code>+----------+---------------------------+
| GỢI Ý    |   GHI CHÉP                |
| (câu hỏi |   ý chính, bằng lời của   |
|  ôn &amp;    |   bạn, ghi trong giờ học  |
|  từ khoá)|                           |
|          |                           |
+----------+---------------------------+
|  TÓM TẮT: 2-3 câu, viết từ trí nhớ    |
+---------------------------------------+
</code></pre>
<ul>
<li><strong>Ghi chép (phải):</strong> nắm ý chính trong giờ học — không phải mọi chữ.</li>
<li><strong>Gợi ý (trái):</strong> sau giờ học, viết câu hỏi và từ khoá mà phần ghi chép trả lời.</li>
<li><strong>Tóm tắt (dưới):</strong> tóm cả trang bằng lời của bạn. Sau này che phần ghi chép và trả lời cột gợi ý — tự kiểm tra tức thì.</li>
</ul>
<h3>Sơ đồ tư duy</h3>
<p>Với ý <em>liên kết</em>, một <strong>sơ đồ tư duy</strong> hơn hẳn danh sách thẳng: đặt chủ đề ở giữa rồi toả nhánh ra ngoài, để bạn thấy mối quan hệ chứ không chỉ một chuỗi. Rất hợp để phác một bài luận hoặc ôn xem cả chủ đề ráp lại thế nào.</p>
<div class="callout"><span class="badge">Viết tay có lợi</span> Nghiên cứu cho thấy viết tay — vì không kịp chép từng chữ — buộc bạn tóm ý, mà chính sự tóm ý đó là suy nghĩ xây nên trí nhớ.</div>`,
  ]]);

const c3q = quiz('ssa101-quiz-3', 'Quiz 3 — Note-taking|||Quiz 3 — Ghi chép', [
  { id: 'q1', question: 'Ba vùng của phương pháp Cornell là?', options: ['Tiêu đề, thân bài, kết luận', 'Ghi chép, cột gợi ý, tóm tắt', 'Câu hỏi, đáp án, điểm số', 'Mở bài, ví dụ, bài tập'], correctIndex: 1, explanation: 'Cornell chia trang thành: ghi chép (phải), cột gợi ý/câu hỏi (trái), tóm tắt (dưới).' },
  { id: 'q2', question: 'Vì sao chép nguyên văn lời giảng thường kém hiệu quả?', options: ['Vì viết chậm', 'Vì bạn chỉ chép lại chứ không xử lý và tóm ý', 'Vì tốn giấy', 'Vì giảng viên không thích'], correctIndex: 1, explanation: 'Chép nguyên văn là ghi lại thụ động; ghi chép tốt tóm ý bằng lời của mình để hiểu và nhớ.' },
  { id: 'q3', question: 'Cách ghi nào phù hợp nhất để thấy mối quan hệ giữa các ý?', options: ['Sơ đồ tư duy (mind map)', 'Chép từng chữ một', 'Danh sách gạch đầu dòng dài', 'Chụp ảnh slide'], correctIndex: 0, explanation: 'Sơ đồ tư duy toả nhánh từ chủ đề trung tâm, làm nổi bật liên kết giữa các ý.' },
]);

const c4 = doc('ssa101-4-1-reading-critical', '4.1 — Academic reading &amp; critical thinking|||4.1 — Đọc học thuật &amp; tư duy phản biện',
  'Đọc chủ động vs đọc thụ động; SQ3R (Survey-Question-Read-Recite-Review); skim/scan; đánh giá nguồn (tác giả, bằng chứng, thiên lệch); phân biệt sự kiện/ý kiến; nguỵ biện thường gặp.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 4 · Lesson 4.1</span>
<h2>Academic reading &amp; critical thinking</h2>
<h3>Active reading with SQ3R</h3>
<p>You can't read a textbook like a novel. Use <strong>SQ3R</strong>:</p>
<pre><code>Survey   skim headings, intro, summary — get the shape
Question turn each heading into a question
Read     read to answer your questions
Recite   look away and say the answer in your own words
Review   go back over cues/summaries later
</code></pre>
<p><strong>Skim</strong> to get the gist (headings, first lines); <strong>scan</strong> to find a specific fact (a date, a term). Full slow reading is for the parts that actually matter.</p>
<h3>Critical thinking</h3>
<p>Don't accept a source just because it's printed. Ask:</p>
<ul>
<li><strong>Who wrote it, and why?</strong> Expertise? Something to sell?</li>
<li><strong>What's the evidence?</strong> Data and cited studies, or just assertion?</li>
<li><strong>Fact vs opinion?</strong> "Sales fell 10%" is checkable; "the product is bad" is a judgement.</li>
<li><strong>Any bias?</strong> What viewpoint is missing?</li>
</ul>
<p>Watch for common <strong>fallacies</strong>: attacking the person not the argument (ad hominem), "everyone believes it" (bandwagon), or only two choices offered when more exist (false dilemma).</p>
<div class="callout"><span class="badge">Read to argue back</span> A critical reader holds a quiet conversation with the text — "Is that true? What's the proof? What would the other side say?" — instead of swallowing it whole.</div>`,
    `<span class="eyebrow">SSA101 · Chương 4 · Bài 4.1</span>
<h2>Đọc học thuật &amp; tư duy phản biện</h2>
<h3>Đọc chủ động với SQ3R</h3>
<p>Không thể đọc giáo trình như đọc tiểu thuyết. Dùng <strong>SQ3R</strong>:</p>
<pre><code>Survey   (khảo) lướt tiêu đề, mở đầu, tóm tắt — nắm khung
Question (hỏi)  biến mỗi tiêu đề thành một câu hỏi
Read     (đọc)  đọc để trả lời câu hỏi của mình
Recite   (đọc lại) ngước lên, nói lại bằng lời của bạn
Review   (ôn)   xem lại cột gợi ý/tóm tắt sau đó
</code></pre>
<p><strong>Đọc lướt (skim)</strong> để nắm ý chính (tiêu đề, câu đầu); <strong>đọc quét (scan)</strong> để tìm một dữ kiện cụ thể (một ngày, một thuật ngữ). Đọc kỹ chậm chỉ dành cho phần thật sự quan trọng.</p>
<h3>Tư duy phản biện</h3>
<p>Đừng tin một nguồn chỉ vì nó được in ra. Hãy hỏi:</p>
<ul>
<li><strong>Ai viết, và vì sao?</strong> Có chuyên môn? Có thứ để bán?</li>
<li><strong>Bằng chứng đâu?</strong> Số liệu và nghiên cứu được trích, hay chỉ là khẳng định?</li>
<li><strong>Sự kiện hay ý kiến?</strong> "Doanh số giảm 10%" kiểm được; "sản phẩm này tệ" là phán xét.</li>
<li><strong>Có thiên lệch không?</strong> Góc nhìn nào đang bị thiếu?</li>
</ul>
<p>Cảnh giác các <strong>nguỵ biện</strong> thường gặp: công kích cá nhân thay vì lập luận (ad hominem), "ai cũng tin thế" (theo số đông), hay chỉ đưa hai lựa chọn khi thực ra còn nhiều hơn (lưỡng nan giả).</p>
<div class="callout"><span class="badge">Đọc để phản biện</span> Người đọc phản biện trò chuyện thầm với văn bản — "Đúng không? Bằng chứng đâu? Phía kia sẽ nói gì?" — thay vì nuốt trọn.</div>`,
  ]]);

const c4q = quiz('ssa101-quiz-4', 'Quiz 4 — Reading & critical thinking|||Quiz 4 — Đọc & tư duy phản biện', [
  { id: 'q1', question: 'Trong SQ3R, bước "Survey" (Khảo) làm gì?', options: ['Đọc kỹ từng câu', 'Lướt tiêu đề, mở đầu, tóm tắt để nắm khung', 'Làm bài kiểm tra', 'Chép lại toàn bộ chương'], correctIndex: 1, explanation: 'Survey = lướt nhanh cấu trúc (tiêu đề, mở đầu, tóm tắt) trước khi đọc chi tiết.' },
  { id: 'q2', question: 'Câu nào là SỰ KIỆN (kiểm chứng được), không phải ý kiến?', options: ['"Cuốn sách này rất hay."', '"Doanh số quý 2 giảm 10% so với quý 1."', '"Ai cũng nên đọc nó."', '"Tác giả viết dở."'], correctIndex: 1, explanation: 'Sự kiện có thể kiểm chứng bằng dữ liệu; các câu còn lại là đánh giá/ý kiến.' },
  { id: 'q3', question: 'Công kích người nói thay vì lập luận của họ là nguỵ biện?', options: ['Ad hominem (công kích cá nhân)', 'Theo số đông', 'Lưỡng nan giả', 'Đọc quét'], correctIndex: 0, explanation: 'Ad hominem: bác bỏ bằng cách nhắm vào người thay vì phản bác nội dung lập luận.' },
]);

const c5 = doc('ssa101-5-1-memory-learning', '5.1 — Memory &amp; effective learning|||5.1 — Ghi nhớ &amp; học hiệu quả',
  'Ghi nhớ chủ động (active recall) > đọc lại; lặp lại ngắt quãng (spaced repetition, đường quên Ebbinghaus); xen kẽ (interleaving); chế độ tập trung/khuếch tán (Oakley); vì sao nhồi nhét thất bại.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 5 · Lesson 5.1</span>
<h2>Memory &amp; effective learning</h2>
<h3>Active recall beats re-reading</h3>
<p>Re-reading and highlighting <em>feel</em> like learning but are among the weakest methods. The strongest is <strong>active recall</strong>: close the book and try to <em>retrieve</em> the answer. Struggling to remember is what strengthens the memory — a quiz teaches more than another read-through.</p>
<h3>Spaced repetition</h3>
<p>We forget fast — Ebbinghaus's <strong>forgetting curve</strong> drops steeply within a day. Reviewing at <strong>increasing intervals</strong> (day 1, day 3, day 7, day 21) resets the curve each time and moves knowledge into long-term memory. Flashcard apps like Anki schedule this for you.</p>
<pre><code>Cramming:  1 huge session -> forget most within a week
Spacing:   same total time, spread out -> remember for months
</code></pre>
<h3>Interleaving &amp; two modes of thinking</h3>
<ul>
<li><strong>Interleaving:</strong> mix problem types instead of doing 20 of the same — it's harder, and that's why it sticks.</li>
<li><strong>Focused vs diffuse mode (Oakley):</strong> focused = concentrated work; diffuse = the relaxed background thinking that happens on a walk or after sleep. Stuck problems often unlock in diffuse mode — so take real breaks, and sleep before an exam.</li>
</ul>
<div class="callout"><span class="badge">The golden rule</span> Test yourself, space it out, sleep on it. If a method feels easy and comfortable, it's probably not building durable memory.</div>`,
    `<span class="eyebrow">SSA101 · Chương 5 · Bài 5.1</span>
<h2>Ghi nhớ &amp; học hiệu quả</h2>
<h3>Ghi nhớ chủ động thắng đọc lại</h3>
<p>Đọc lại và tô đậm <em>cảm giác</em> như đang học nhưng thuộc nhóm kém hiệu quả nhất. Mạnh nhất là <strong>ghi nhớ chủ động (active recall)</strong>: gấp sách lại và cố <em>truy hồi</em> câu trả lời. Chính sự vật lộn để nhớ mới làm trí nhớ mạnh lên — một lần tự kiểm tra dạy nhiều hơn một lần đọc lại.</p>
<h3>Lặp lại ngắt quãng</h3>
<p>Chúng ta quên rất nhanh — <strong>đường cong quên</strong> của Ebbinghaus tụt dốc chỉ trong một ngày. Ôn lại theo <strong>khoảng cách tăng dần</strong> (ngày 1, ngày 3, ngày 7, ngày 21) mỗi lần lại kéo đường cong lên và đưa kiến thức vào trí nhớ dài hạn. Các app thẻ ghi nhớ như Anki tự xếp lịch này cho bạn.</p>
<pre><code>Nhồi nhét: 1 buổi khổng lồ  -> quên gần hết trong một tuần
Ngắt quãng: cùng tổng thời gian, trải ra -> nhớ nhiều tháng
</code></pre>
<h3>Xen kẽ &amp; hai chế độ tư duy</h3>
<ul>
<li><strong>Xen kẽ (interleaving):</strong> trộn nhiều dạng bài thay vì làm 20 bài cùng loại — khó hơn, và chính vì thế mà nhớ lâu.</li>
<li><strong>Tập trung vs khuếch tán (Oakley):</strong> tập trung = làm việc dồn sức; khuếch tán = suy nghĩ nền thư giãn khi đi dạo hay sau giấc ngủ. Bài toán bí thường được cởi ở chế độ khuếch tán — nên hãy nghỉ thật, và ngủ trước khi thi.</li>
</ul>
<div class="callout"><span class="badge">Quy tắc vàng</span> Tự kiểm tra, trải khoảng cách, ngủ đủ. Nếu một cách học thấy dễ và thoải mái, nó thường KHÔNG xây được trí nhớ bền.</div>`,
  ]]);

const c5q = quiz('ssa101-quiz-5', 'Quiz 5 — Memory & learning|||Quiz 5 — Ghi nhớ & học', [
  { id: 'q1', question: 'Cách học nào MẠNH nhất trong các lựa chọn sau?', options: ['Đọc lại chương nhiều lần', 'Tô đậm (highlight) hết sách', 'Ghi nhớ chủ động — gấp sách và tự truy hồi câu trả lời', 'Chép lại nguyên văn'], correctIndex: 2, explanation: 'Active recall (tự truy hồi) buộc não làm việc, xây trí nhớ bền hơn đọc lại thụ động.' },
  { id: 'q2', question: 'Lặp lại ngắt quãng (spaced repetition) nghĩa là?', options: ['Ôn tất cả trong một đêm trước thi', 'Ôn lại theo các khoảng cách tăng dần theo thời gian', 'Chỉ ôn khi sắp quên hẳn', 'Không cần ôn lại'], correctIndex: 1, explanation: 'Ôn theo khoảng cách tăng dần (ngày 1, 3, 7, 21...) chống đường cong quên và đưa vào trí nhớ dài hạn.' },
  { id: 'q3', question: 'Theo Oakley, khi bí một bài khó, chế độ "khuếch tán" giúp bằng cách?', options: ['Ép bản thân ngồi lì thêm nhiều giờ', 'Nghỉ ngơi/đi dạo/ngủ để não xử lý ngầm', 'Bỏ hẳn bài đó', 'Hỏi đáp án ngay'], correctIndex: 1, explanation: 'Chế độ khuếch tán là suy nghĩ nền lúc thư giãn/ngủ; nghỉ thật thường giúp cởi bài bí.' },
]);

const c6 = doc('ssa101-6-1-research-integrity', '6.1 — Research, citation &amp; academic integrity|||6.1 — Nghiên cứu, trích dẫn &amp; liêm chính học thuật',
  'Tìm nguồn tin cậy (học thuật vs web); vì sao phải trích dẫn; đạo văn là gì (kể cả vô ý & tự đạo văn); diễn giải (paraphrase) đúng cách; kiểu trích dẫn APA/IEEE; công cụ Zotero.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 6 · Lesson 6.1</span>
<h2>Research, citation &amp; academic integrity</h2>
<h3>Finding good sources</h3>
<p>Not all sources are equal. Prefer <strong>peer-reviewed papers, textbooks and official documentation</strong> over random blogs. Use Google Scholar and your library database, and always sanity-check who wrote it and when.</p>
<h3>Why cite?</h3>
<p>Citing gives credit to the original author, lets a reader verify your claim, and shows your work rests on real evidence. <strong>Not</strong> citing — passing someone's words or ideas off as your own — is <strong>plagiarism</strong>, one of the most serious academic offences.</p>
<pre><code>Plagiarism includes:
  - copying text without quotation marks + citation
  - paraphrasing an idea but giving no credit
  - buying/copying someone else's assignment
  - self-plagiarism: reusing your own old work as new
</code></pre>
<h3>Paraphrasing properly</h3>
<p>A real paraphrase restates the idea in <em>your own structure and words</em> — and still cites the source. Swapping a few synonyms while keeping the original sentence is <strong>still plagiarism</strong>. If you keep the exact words, use quotation marks.</p>
<h3>Citation styles</h3>
<p>Follow the style your course requires — <strong>APA</strong> (author-date, common in social sciences) or <strong>IEEE</strong> (numbered, common in engineering &amp; CS). A tool like <strong>Zotero</strong> stores sources and generates the reference list for you.</p>
<div class="callout"><span class="badge">The safe rule</span> When in doubt, cite. It is never wrong to give credit — and integrity, once lost, is very hard to win back.</div>`,
    `<span class="eyebrow">SSA101 · Chương 6 · Bài 6.1</span>
<h2>Nghiên cứu, trích dẫn &amp; liêm chính học thuật</h2>
<h3>Tìm nguồn tốt</h3>
<p>Không phải nguồn nào cũng ngang nhau. Ưu tiên <strong>bài báo bình duyệt, giáo trình và tài liệu chính thức</strong> hơn blog ngẫu nhiên. Dùng Google Scholar và thư viện của trường, và luôn kiểm ai viết và viết khi nào.</p>
<h3>Vì sao phải trích dẫn?</h3>
<p>Trích dẫn ghi công tác giả gốc, cho người đọc kiểm chứng khẳng định của bạn, và cho thấy bài dựa trên bằng chứng thật. <strong>Không</strong> trích dẫn — nhận lời hay ý của người khác là của mình — là <strong>đạo văn</strong>, một trong những lỗi học thuật nghiêm trọng nhất.</p>
<pre><code>Đạo văn bao gồm:
  - chép nguyên văn mà không có dấu ngoặc kép + trích dẫn
  - diễn giải một ý nhưng không ghi công
  - mua/chép bài của người khác
  - tự đạo văn: nộp lại bài cũ của mình như bài mới
</code></pre>
<h3>Diễn giải đúng cách</h3>
<p>Diễn giải thật sự là nói lại ý bằng <em>cấu trúc và lời của chính bạn</em> — và vẫn trích dẫn nguồn. Đổi vài từ đồng nghĩa mà giữ nguyên câu gốc thì <strong>vẫn là đạo văn</strong>. Nếu giữ nguyên từ ngữ, phải dùng dấu ngoặc kép.</p>
<h3>Kiểu trích dẫn</h3>
<p>Theo đúng kiểu môn học yêu cầu — <strong>APA</strong> (tác giả–năm, phổ biến ở khoa học xã hội) hay <strong>IEEE</strong> (đánh số, phổ biến ở kỹ thuật &amp; CNTT). Công cụ như <strong>Zotero</strong> lưu nguồn và tự tạo danh mục tài liệu cho bạn.</p>
<div class="callout"><span class="badge">Quy tắc an toàn</span> Khi phân vân, hãy trích dẫn. Ghi công không bao giờ là sai — và liêm chính, một khi mất, rất khó lấy lại.</div>`,
  ]]);

const c6q = quiz('ssa101-quiz-6', 'Quiz 6 — Research & integrity|||Quiz 6 — Nghiên cứu & liêm chính', [
  { id: 'q1', question: 'Đâu là đạo văn?', options: ['Trích dẫn nguồn rõ ràng khi dùng ý người khác', 'Đặt câu chép nguyên văn trong ngoặc kép + trích dẫn', 'Đổi vài từ đồng nghĩa của câu gốc mà không ghi nguồn', 'Tự viết bằng lời và ý của chính mình'], correctIndex: 2, explanation: 'Chỉ đổi từ đồng nghĩa nhưng giữ cấu trúc/ý gốc và không ghi nguồn vẫn là đạo văn.' },
  { id: 'q2', question: 'Diễn giải (paraphrase) ĐÚNG cách là?', options: ['Chép nguyên văn nhưng bỏ tên tác giả', 'Nói lại ý bằng cấu trúc, lời của mình VÀ vẫn trích dẫn nguồn', 'Dịch câu gốc sang tiếng khác', 'Đổi thứ tự vài từ trong câu'], correctIndex: 1, explanation: 'Diễn giải thật sự là viết lại bằng lời/cấu trúc của mình và vẫn ghi công nguồn gốc.' },
  { id: 'q3', question: 'Nguồn nào thường ĐÁNG TIN nhất cho bài học thuật?', options: ['Blog cá nhân ẩn danh', 'Bình luận mạng xã hội', 'Bài báo bình duyệt, giáo trình, tài liệu chính thức', 'Quảng cáo sản phẩm'], correctIndex: 2, explanation: 'Nguồn bình duyệt/giáo trình/tài liệu chính thức có kiểm chứng, đáng tin hơn nguồn ngẫu nhiên.' },
]);

const c7 = doc('ssa101-7-1-presenting-teamwork', '7.1 — Presentation skills &amp; teamwork|||7.1 — Kỹ năng thuyết trình &amp; làm việc nhóm',
  'Cấu trúc bài nói (mở-thân-kết); slide tối giản; giao tiếp phi ngôn ngữ & luyện tập; quản lý hồi hộp; vai trò trong nhóm, chia việc rõ, xử lý xung đột & người "ăn không".',
  [[
    `<span class="eyebrow">SSA101 · Chapter 7 · Lesson 7.1</span>
<h2>Presentation skills &amp; teamwork</h2>
<h3>Structure a talk</h3>
<pre><code>Tell them what you'll say   (intro: hook + roadmap)
Say it                      (body: 2-4 clear points)
Tell them what you said     (conclusion: recap + takeaway)
</code></pre>
<p>An audience can only hold a few ideas — pick the <strong>2–4 that matter</strong> and drop the rest.</p>
<h3>Slides &amp; delivery</h3>
<ul>
<li><strong>Slides are a backdrop, not a script</strong> — few words, one idea per slide, readable font. Never read your slides aloud.</li>
<li><strong>Delivery:</strong> make eye contact, slow down, and pause instead of saying "um". <strong>Rehearse out loud</strong> — the single biggest fix for nerves is knowing your material cold.</li>
<li><strong>Nerves are normal.</strong> Breathe slowly, and reframe adrenaline as energy.</li>
</ul>
<h3>Teamwork</h3>
<p>Group projects fail from poor process, not lack of ability. Early on, agree:</p>
<ul>
<li><strong>Roles &amp; tasks</strong> — who does what, written down.</li>
<li><strong>Deadlines</strong> — internal ones before the real one.</li>
<li><strong>How you'll communicate</strong> — one channel, agreed check-ins.</li>
</ul>
<p>Handle conflict by focusing on the <em>work</em>, not the person. If a member doesn't contribute, address it early and directly as a team — don't silently absorb their share.</p>
<div class="callout"><span class="badge">Rehearse for real</span> Practising in your head is not practising. Say it out loud, standing up, timed — ideally in front of one friend — at least once before the day.</div>`,
    `<span class="eyebrow">SSA101 · Chương 7 · Bài 7.1</span>
<h2>Kỹ năng thuyết trình &amp; làm việc nhóm</h2>
<h3>Cấu trúc bài nói</h3>
<pre><code>Nói trước bạn sẽ nói gì    (mở bài: câu mồi + lộ trình)
Nói điều đó                (thân bài: 2-4 ý rõ ràng)
Nhắc lại điều đã nói        (kết bài: tóm + thông điệp)
</code></pre>
<p>Người nghe chỉ giữ được vài ý — hãy chọn <strong>2–4 ý quan trọng</strong> và bỏ phần còn lại.</p>
<h3>Slide &amp; cách trình bày</h3>
<ul>
<li><strong>Slide là phông nền, không phải kịch bản</strong> — ít chữ, một ý mỗi slide, cỡ chữ đọc được. Đừng đọc nguyên slide.</li>
<li><strong>Trình bày:</strong> giao tiếp bằng mắt, nói chậm lại, và ngừng thay vì "ừm". <strong>Tập nói to</strong> — cách chữa hồi hộp lớn nhất là thuộc bài đến mức nhuần nhuyễn.</li>
<li><strong>Hồi hộp là bình thường.</strong> Thở chậm, và xem adrenaline như năng lượng.</li>
</ul>
<h3>Làm việc nhóm</h3>
<p>Đồ án nhóm hỏng vì quy trình kém, không phải vì thiếu năng lực. Ngay từ đầu, hãy thống nhất:</p>
<ul>
<li><strong>Vai trò &amp; công việc</strong> — ai làm gì, ghi ra giấy.</li>
<li><strong>Hạn chót</strong> — các mốc nội bộ trước mốc thật.</li>
<li><strong>Cách trao đổi</strong> — một kênh, các buổi kiểm tiến độ đã hẹn.</li>
</ul>
<p>Xử lý xung đột bằng cách tập trung vào <em>công việc</em>, không vào con người. Nếu một thành viên không đóng góp, hãy nêu sớm và thẳng thắn với tư cách cả nhóm — đừng âm thầm gánh phần của họ.</p>
<div class="callout"><span class="badge">Tập như thật</span> Tập trong đầu không phải là tập. Hãy nói to, đứng dậy, bấm giờ — tốt nhất trước một người bạn — ít nhất một lần trước ngày thuyết trình.</div>`,
  ]]);

const c7q = quiz('ssa101-quiz-7', 'Quiz 7 — Presenting & teamwork|||Quiz 7 — Thuyết trình & nhóm', [
  { id: 'q1', question: 'Nguyên tắc tốt cho SLIDE thuyết trình là?', options: ['Nhồi thật nhiều chữ để không quên', 'Ít chữ, một ý mỗi slide, đọc được từ xa', 'Đọc nguyên văn từng slide cho khán giả', 'Dùng cỡ chữ nhỏ để vừa nhiều nội dung'], correctIndex: 1, explanation: 'Slide là phông nền: ít chữ, một ý/slide, dễ đọc; không đọc nguyên slide.' },
  { id: 'q2', question: 'Cách chữa hồi hộp khi thuyết trình hiệu quả nhất là?', options: ['Học thuộc lòng từng chữ trong đầu', 'Tập nói TO, đứng dậy, bấm giờ nhiều lần trước ngày nói', 'Uống thật nhiều cà phê', 'Tránh nhìn khán giả'], correctIndex: 1, explanation: 'Luyện tập thật (nói to, có bấm giờ) giúp thuộc bài và giảm hồi hộp mạnh nhất.' },
  { id: 'q3', question: 'Khi một thành viên nhóm không đóng góp, cách xử lý tốt là?', options: ['Âm thầm làm hết phần của họ', 'Nêu vấn đề sớm, thẳng thắn với tư cách cả nhóm', 'Báo giảng viên ngay mà không nói với bạn đó', 'Bỏ mặc đồ án'], correctIndex: 1, explanation: 'Giải quyết sớm và trực tiếp, tập trung vào công việc; đừng lặng lẽ gánh phần người khác.' },
]);

const c8 = doc('ssa101-8-1-exams-stress-career', '8.1 — Exam prep, stress &amp; career planning|||8.1 — Ôn thi, quản lý căng thẳng &amp; kế hoạch nghề nghiệp',
  'Kế hoạch ôn tập ngược từ ngày thi; đề cũ & tự kiểm tra theo điều kiện thi; chăm bản thân (ngủ/ăn/vận động); kỹ thuật giảm lo âu; đặt mục tiêu nghề & xây hồ sơ từ năm nhất.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 8 · Lesson 8.1</span>
<h2>Exam prep, stress &amp; career planning</h2>
<h3>Revision that works</h3>
<p>Plan <strong>backwards from the exam date</strong>: list topics, spread them over the days you have, and start early so you can space your review. The best revision is <strong>active</strong> — do <strong>past papers under exam conditions</strong> (timed, no notes), then mark them. Practising the test is the most exam-like thing you can do.</p>
<pre><code>2 weeks out: map every topic to a study day
1 week out:  past papers, timed; fix weak spots
night before: light review + SLEEP (no all-nighter)
</code></pre>
<h3>Managing stress</h3>
<ul>
<li>Some pressure sharpens you; too much blocks memory. Manage it with <strong>sleep, food, exercise and breaks</strong> — the basics beat any trick.</li>
<li>Slow breathing calms the body in minutes. Talk to someone if stress becomes overwhelming — that's a strength, not a weakness.</li>
<li><strong>Pulling an all-nighter backfires:</strong> sleep is when memory consolidates, so a rested brain outperforms a crammed, exhausted one.</li>
</ul>
<h3>Career planning from year one</h3>
<p>You don't need your whole life mapped, but start now: set a rough direction, then <strong>build evidence</strong> — projects, an internship, a portfolio (e.g. a GitHub for a Robotics &amp; AI student). Small steps each semester compound into a strong CV by graduation.</p>
<div class="callout"><span class="badge">Play the long game</span> Grades open doors, but <em>what you can show you've built</em> gets you hired. Start one small project this year.</div>`,
    `<span class="eyebrow">SSA101 · Chương 8 · Bài 8.1</span>
<h2>Ôn thi, quản lý căng thẳng &amp; kế hoạch nghề nghiệp</h2>
<h3>Ôn tập đúng cách</h3>
<p>Lập kế hoạch <strong>lùi từ ngày thi</strong>: liệt kê chủ đề, trải ra các ngày bạn có, và bắt đầu sớm để ôn ngắt quãng. Ôn tốt nhất là <strong>chủ động</strong> — làm <strong>đề cũ trong điều kiện thi</strong> (bấm giờ, không giở tài liệu), rồi tự chấm. Luyện chính đề thi là việc giống thi thật nhất.</p>
<pre><code>Còn 2 tuần: gán mỗi chủ đề vào một ngày ôn
Còn 1 tuần: làm đề cũ, bấm giờ; vá chỗ yếu
Đêm trước:  ôn nhẹ + NGỦ (không thức trắng)
</code></pre>
<h3>Quản lý căng thẳng</h3>
<ul>
<li>Một chút áp lực giúp tỉnh táo; quá nhiều thì chặn trí nhớ. Quản lý bằng <strong>ngủ, ăn, vận động và nghỉ ngơi</strong> — thứ cơ bản hơn mọi mẹo.</li>
<li>Thở chậm làm dịu cơ thể trong vài phút. Hãy nói với ai đó nếu căng thẳng quá tải — đó là điểm mạnh, không phải điểm yếu.</li>
<li><strong>Thức trắng phản tác dụng:</strong> giấc ngủ là lúc trí nhớ được củng cố, nên một cái đầu nghỉ đủ vượt trội một cái đầu nhồi nhét kiệt sức.</li>
</ul>
<h3>Kế hoạch nghề nghiệp từ năm nhất</h3>
<p>Bạn không cần vẽ sẵn cả đời, nhưng hãy bắt đầu ngay: đặt một hướng đi thô, rồi <strong>xây bằng chứng</strong> — dự án, một kỳ thực tập, một hồ sơ năng lực (vd một GitHub cho sinh viên Robotics &amp; AI). Những bước nhỏ mỗi kỳ cộng dồn thành một CV mạnh khi tốt nghiệp.</p>
<div class="callout"><span class="badge">Chơi ván dài</span> Điểm số mở cánh cửa, nhưng <em>thứ bạn chứng minh mình đã làm được</em> mới giúp bạn được tuyển. Hãy bắt đầu một dự án nhỏ ngay năm nay.</div>`,
  ]]);

const c8q = quiz('ssa101-quiz-8', 'Quiz 8 — Exams, stress & career|||Quiz 8 — Thi, căng thẳng & nghề', [
  { id: 'q1', question: 'Cách ôn thi CHỦ ĐỘNG và giống thi thật nhất là?', options: ['Đọc lại vở nhiều lần', 'Làm đề cũ trong điều kiện thi (bấm giờ, không giở tài liệu) rồi tự chấm', 'Tô đậm sách giáo trình', 'Nghe bạn kể lại nội dung'], correctIndex: 1, explanation: 'Làm đề cũ có bấm giờ là ghi nhớ chủ động và mô phỏng đúng điều kiện thi.' },
  { id: 'q2', question: 'Vì sao thức trắng đêm trước thi thường phản tác dụng?', options: ['Vì tốn điện', 'Vì giấc ngủ là lúc trí nhớ được củng cố; đầu óc kiệt sức làm bài kém hơn', 'Vì không ai thức cùng', 'Vì phòng thi lạnh'], correctIndex: 1, explanation: 'Ngủ giúp củng cố trí nhớ; não nghỉ đủ vượt trội não nhồi nhét, mệt mỏi.' },
  { id: 'q3', question: 'Lời khuyên nghề nghiệp cho sinh viên năm nhất là?', options: ['Chờ đến năm cuối mới nghĩ tới', 'Đặt hướng đi thô và bắt đầu xây bằng chứng (dự án, portfolio) ngay từ sớm', 'Chỉ cần điểm cao là đủ', 'Không cần dự án cá nhân'], correctIndex: 1, explanation: 'Bắt đầu sớm với các dự án/portfolio nhỏ; chúng cộng dồn thành CV mạnh khi tốt nghiệp.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'SSA101',
    slug: 'ssa101-academic-skills',
    title: 'Academic Skills',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SSA101.webp',
    shortDescription: 'Study-skills foundations for university — growth mindset, time management, Cornell notes, academic reading & critical thinking, memory techniques, research & academic integrity, presentations & teamwork, exam prep & careers. Bilingual, with quizzes.|||Kỹ năng học thuật nền tảng cho đại học — tư duy phát triển, quản lý thời gian, ghi chép Cornell, đọc & tư duy phản biện, kỹ thuật ghi nhớ, nghiên cứu & liêm chính học thuật, thuyết trình & làm việc nhóm, ôn thi & nghề nghiệp. Song ngữ, có quiz.',
    description: 'Môn <strong>SSA101 — Academic Skills</strong> (Kỹ năng học thuật, Kỳ 1) là môn kỹ năng nền tảng cho tân sinh viên ngành Robotics &amp; AI. Từ <strong>chuyển tiếp đại học &amp; tư duy phát triển</strong> → <strong>quản lý thời gian &amp; mục tiêu</strong> (SMART, Pomodoro) → <strong>ghi chép</strong> (Cornell, sơ đồ tư duy) → <strong>đọc học thuật &amp; tư duy phản biện</strong> (SQ3R) → <strong>ghi nhớ &amp; học hiệu quả</strong> (active recall, lặp lại ngắt quãng) → <strong>nghiên cứu, trích dẫn &amp; liêm chính</strong> (tránh đạo văn) → <strong>thuyết trình &amp; làm việc nhóm</strong> → <strong>ôn thi, quản lý căng thẳng &amp; kế hoạch nghề nghiệp</strong>. Bám các giáo trình chuẩn (Cottrell, Pauk, Oakley, Covey), song ngữ, có checklist và quiz mỗi chương.',
    whatYouLearn: 'Tư duy phát triển & chuyển tiếp đại học; mục tiêu SMART, ma trận Eisenhower, Pomodoro, chống trì hoãn; ghi chép Cornell & sơ đồ tư duy; đọc chủ động SQ3R, đánh giá nguồn & nhận diện nguỵ biện; ghi nhớ chủ động, lặp lại ngắt quãng, xen kẽ, chế độ tập trung/khuếch tán; tìm nguồn, trích dẫn (APA/IEEE), diễn giải & tránh đạo văn; cấu trúc bài nói, thiết kế slide, làm việc nhóm & xử lý xung đột; kế hoạch ôn thi, quản lý căng thẳng và định hướng nghề nghiệp.',
    requirements: 'Không cần kiến thức nền đặc biệt — môn dành cho tân sinh viên. Chỉ cần tinh thần sẵn sàng áp dụng các kỹ thuật vào chính các môn đang học.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách (Cottrell, Pauk, Oakley, Covey), khoá học, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao kỹ năng học quan trọng; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Chuyển tiếp & tư duy phát triển|||Chapter 1 — Transition & growth mindset', description: 'Phổ thông vs đại học; tư duy phát triển (Dweck).', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thời gian & mục tiêu|||Chapter 2 — Time & goals', description: 'SMART, Eisenhower, Pomodoro, chống trì hoãn.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ghi chép|||Chapter 3 — Note-taking', description: 'Phương pháp Cornell, sơ đồ tư duy.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đọc & tư duy phản biện|||Chapter 4 — Reading & critical thinking', description: 'SQ3R, đánh giá nguồn, nguỵ biện.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Ghi nhớ & học hiệu quả|||Chapter 5 — Memory & learning', description: 'Active recall, spaced repetition, xen kẽ.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nghiên cứu & liêm chính|||Chapter 6 — Research & integrity', description: 'Nguồn, trích dẫn APA/IEEE, tránh đạo văn.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thuyết trình & làm việc nhóm|||Chapter 7 — Presenting & teamwork', description: 'Cấu trúc bài nói, slide, quy trình nhóm.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Thi, căng thẳng & nghề nghiệp|||Chapter 8 — Exams, stress & career', description: 'Ôn tập, đề cũ, quản lý căng thẳng, hướng nghiệp.', lessons: [c8, c8q] },
  ],
};
