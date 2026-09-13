/**
 * DPS201c — Dynamic Public Speaking (Thuyết trình sinh động).
 * Ngành Công nghệ Truyền thông FPTU, kỳ 4. Môn KHÔNG có FLM syllabus →
 * khung dựng theo giáo trình chuẩn quốc tế: Coursera "Dynamic Public
 * Speaking" (Univ. of Washington), "Talk Like TED" (Carmine Gallo),
 * "The Art of Public Speaking" (Stephen Lucas), Toastmasters, TED.com.
 * Song ngữ VI+EN, mỗi chương 1 outline + 1 quiz. Lộ trình 4 bước.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ lồng;
 * "&"→"&amp;" trong content HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dps201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: khoá học miễn phí, sách kinh điển, TED, Toastmasters, công cụ luyện nói, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">DPS201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to become a <strong>dynamic, confident speaker</strong> — overcoming fear, analysing audiences, structuring talks, using rhetoric, delivery, and slides — gathered in one place. This subject has no FLM syllabus, so the roadmap follows widely used international sources; all links below are free or free-to-audit.</p>
<h3>🎓 Free courses</h3>
<ul>
<li><a href="https://www.coursera.org/learn/public-speaking" target="_blank" rel="noopener">Coursera — <em>Dynamic Public Speaking</em> (University of Washington)</a>, the backbone of this course.</li>
<li><a href="https://www.edx.org/learn/public-speaking" target="_blank" rel="noopener">edX — Public Speaking courses (RIT, UBC)</a></li>
</ul>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.carminegallo.com/books/talk-like-ted/" target="_blank" rel="noopener"><em>Talk Like TED</em> — Carmine Gallo</a>: the 9 secrets of the world's best talks.</li>
<li><a href="https://en.wikipedia.org/wiki/The_Art_of_Public_Speaking" target="_blank" rel="noopener"><em>The Art of Public Speaking</em> — Stephen Lucas</a>: the standard college textbook.</li>
</ul>
<h3>🌐 Watch &amp; practise</h3>
<ul>
<li><a href="https://www.ted.com/talks" target="_blank" rel="noopener">TED.com — Talks</a>: study great speakers; watch with the sound off to see body language.</li>
<li><a href="https://www.toastmasters.org/" target="_blank" rel="noopener">Toastmasters International</a>: clubs and a proven speech-project path.</li>
<li><a href="https://www.ted.com/participate/ted-ed-clubs" target="_blank" rel="noopener">TED-Ed</a>: short lessons on speaking &amp; storytelling.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://orai.com/" target="_blank" rel="noopener">Orai</a> / phone voice recorder — hear your own filler words &amp; pace.</li>
<li><a href="https://www.speeko.co/" target="_blank" rel="noopener">Speeko</a> — AI speech coach for tone and pauses.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — understand fear, purpose &amp; audience; structure a simple talk.</li>
<li><strong>Build</strong> — write with stories, evidence and clear language (ethos/pathos/logos).</li>
<li><strong>Deliver</strong> — practise voice, eye contact, gesture and clean slides out loud, on camera.</li>
<li><strong>Perform</strong> — give persuasive, informative and impromptu talks; handle Q&amp;A with poise.</li>
</ol></div>`,
    `<span class="eyebrow">DPS201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để trở thành <strong>người nói năng động, tự tin</strong> — vượt nỗi sợ, phân tích khán giả, dựng cấu trúc, dùng hùng biện, trình bày và slide — gom về một chỗ. Môn này không có syllabus FLM nên lộ trình bám các nguồn quốc tế phổ biến; mọi liên kết dưới đây miễn phí hoặc học thử miễn phí.</p>
<h3>🎓 Khoá học miễn phí</h3>
<ul>
<li><a href="https://www.coursera.org/learn/public-speaking" target="_blank" rel="noopener">Coursera — <em>Dynamic Public Speaking</em> (Đại học Washington)</a>, xương sống của môn này.</li>
<li><a href="https://www.edx.org/learn/public-speaking" target="_blank" rel="noopener">edX — các khoá Public Speaking (RIT, UBC)</a></li>
</ul>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.carminegallo.com/books/talk-like-ted/" target="_blank" rel="noopener"><em>Talk Like TED</em> — Carmine Gallo</a>: 9 bí quyết của những bài nói hay nhất thế giới.</li>
<li><a href="https://en.wikipedia.org/wiki/The_Art_of_Public_Speaking" target="_blank" rel="noopener"><em>The Art of Public Speaking</em> — Stephen Lucas</a>: giáo trình đại học chuẩn.</li>
</ul>
<h3>🌐 Xem &amp; luyện</h3>
<ul>
<li><a href="https://www.ted.com/talks" target="_blank" rel="noopener">TED.com — Talks</a>: học người nói giỏi; tắt tiếng để nhìn ngôn ngữ cơ thể.</li>
<li><a href="https://www.toastmasters.org/" target="_blank" rel="noopener">Toastmasters International</a>: câu lạc bộ và lộ trình bài nói đã kiểm chứng.</li>
<li><a href="https://www.ted.com/participate/ted-ed-clubs" target="_blank" rel="noopener">TED-Ed</a>: bài học ngắn về nói &amp; kể chuyện.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://orai.com/" target="_blank" rel="noopener">Orai</a> / máy ghi âm điện thoại — nghe lại từ đệm &amp; tốc độ của chính mình.</li>
<li><a href="https://www.speeko.co/" target="_blank" rel="noopener">Speeko</a> — huấn luyện nói bằng AI cho giọng điệu và quãng nghỉ.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — hiểu nỗi sợ, mục tiêu &amp; khán giả; dựng một bài nói đơn giản.</li>
<li><strong>Xây dựng</strong> — viết bằng câu chuyện, bằng chứng và ngôn ngữ rõ (ethos/pathos/logos).</li>
<li><strong>Trình bày</strong> — luyện giọng, ánh mắt, cử chỉ và slide gọn, nói thành tiếng, quay lại.</li>
<li><strong>Biểu diễn</strong> — nói thuyết phục, cung cấp thông tin, ứng khẩu; xử lý Q&amp;A điềm tĩnh.</li>
</ol></div>`,
  ]]);

const intro = doc('dps201c-0-1-overview', 'Course overview: Dynamic Public Speaking|||Tổng quan: Thuyết trình sinh động',
  'Thuyết trình là gì và vì sao quan trọng; ba trụ hùng biện (ethos/pathos/logos); lộ trình 8 chương: nỗi sợ → khán giả → cấu trúc → nội dung → ngôn ngữ → trình bày → slide → thuyết phục.',
  [[
    `<span class="eyebrow">DPS201c · Lesson 0.1 · Overview</span>
<h2>Dynamic Public Speaking</h2>
<p class="lead">This course teaches you to <strong>speak so people listen, remember and act</strong>. Public speaking is a skill, not a talent — it can be broken down, practised and improved. You will move from managing nerves to designing and delivering talks that inform and persuade.</p>
<h3>Why it matters</h3>
<p>Whether you pitch a project, defend a thesis, run a meeting or post a video, the same core applies: know your <strong>audience</strong>, have a clear <strong>message</strong>, and deliver it with <strong>credible, human energy</strong>. In communications careers it is a daily tool.</p>
<h3>The three pillars of persuasion (Aristotle)</h3>
<ul>
<li><strong>Ethos</strong> — credibility &amp; character: why should they trust you?</li>
<li><strong>Pathos</strong> — emotion: stories and images that make them care.</li>
<li><strong>Logos</strong> — logic: evidence, data and clear reasoning.</li>
</ul>
<h3>Roadmap</h3>
<p>Overcome fear → analyse the audience &amp; set a purpose → structure (intro–body–conclusion) → content &amp; evidence (stories, data) → language &amp; style → delivery &amp; body language → slides &amp; visual aids → persuasion &amp; speech types. Bilingual, with examples, tips and a quiz each chapter.</p>
<div class="callout"><span class="badge">Golden rule</span> Great speaking is <strong>audience-first</strong>: you are not there to unload information, you are there to change what people think, feel or do.</div>`,
    `<span class="eyebrow">DPS201c · Bài 0.1 · Tổng quan</span>
<h2>Thuyết trình sinh động</h2>
<p class="lead">Môn này dạy bạn <strong>nói sao cho người ta lắng nghe, nhớ và hành động</strong>. Thuyết trình là kỹ năng, không phải năng khiếu — nó chia nhỏ được, luyện được, tiến bộ được. Bạn đi từ việc kiểm soát hồi hộp đến thiết kế và trình bày những bài nói cung cấp thông tin và thuyết phục.</p>
<h3>Vì sao quan trọng</h3>
<p>Dù bạn pitch dự án, bảo vệ luận văn, điều hành họp hay đăng video, cốt lõi vẫn là: hiểu <strong>khán giả</strong>, có <strong>thông điệp</strong> rõ, và truyền nó bằng <strong>năng lượng đáng tin, con người</strong>. Trong nghề truyền thông, đây là công cụ hằng ngày.</p>
<h3>Ba trụ thuyết phục (Aristotle)</h3>
<ul>
<li><strong>Ethos</strong> — uy tín &amp; tư cách: tại sao họ nên tin bạn?</li>
<li><strong>Pathos</strong> — cảm xúc: câu chuyện và hình ảnh khiến họ quan tâm.</li>
<li><strong>Logos</strong> — logic: bằng chứng, số liệu và lập luận rõ ràng.</li>
</ul>
<h3>Lộ trình</h3>
<p>Vượt nỗi sợ → phân tích khán giả &amp; đặt mục tiêu → cấu trúc (mở–thân–kết) → nội dung &amp; bằng chứng (câu chuyện, số liệu) → ngôn ngữ &amp; phong cách → trình bày &amp; ngôn ngữ cơ thể → slide &amp; phương tiện → thuyết phục &amp; loại bài nói. Song ngữ, có ví dụ, mẹo và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Nguyên tắc vàng</span> Nói hay là <strong>đặt khán giả lên trước</strong>: bạn không lên đó để trút thông tin, bạn lên đó để thay đổi điều người ta nghĩ, cảm hoặc làm.</div>`,
  ]]);

const c1 = doc('dps201c-1-1-fear', '1.1 — Public speaking & overcoming fear|||1.1 — Thuyết trình & vượt nỗi sợ',
  'Nỗi sợ nói trước đám đông (glossophobia) là bình thường; kỹ thuật: chuẩn bị, thở, tái định khung lo lắng thành hào hứng, luyện thành tiếng, tư thế quyền lực.',
  [[
    `<span class="eyebrow">DPS201c · Chapter 1 · Lesson 1.1</span>
<h2>Public speaking &amp; overcoming fear</h2>
<p class="lead">Fear of public speaking (<em>glossophobia</em>) is one of the most common fears — even experts feel it. The goal is not to erase nerves but to <strong>channel</strong> them into energy.</p>
<h3>Why we feel it</h3>
<p>Standing before a group triggers a <strong>fight-or-flight</strong> response: racing heart, dry mouth, shaky hands. It is your body preparing to perform, not a sign you will fail.</p>
<h3>Techniques that work</h3>
<ul>
<li><strong>Over-prepare</strong> — nothing calms nerves like knowing your first 30 seconds cold. Rehearse out loud, not just in your head.</li>
<li><strong>Breathe</strong> — slow belly breathing (4 in, 6 out) lowers heart rate before you start.</li>
<li><strong>Reframe</strong> — say "I am excited" instead of "I am nervous". The body feels the same; the label changes performance (anxiety → enthusiasm).</li>
<li><strong>Power pose</strong> — stand tall, shoulders back for two minutes beforehand; open posture builds confidence.</li>
<li><strong>Anchor on the message</strong> — focus on helping the audience, not on being judged. Shifting attention outward shrinks fear.</li>
</ul>
<pre><code>Pre-talk checklist:
  1. Know your opening line by heart
  2. 4-6 breathing, 3 rounds
  3. Reframe: "excited, not nervous"
  4. Find 2-3 friendly faces to speak to
</code></pre>
<div class="callout"><span class="badge">Practice tip</span> Record a 2-minute talk on your phone. Watching it once removes most of the mystery — you will see you look far calmer than you feel.</div>`,
    `<span class="eyebrow">DPS201c · Chương 1 · Bài 1.1</span>
<h2>Thuyết trình &amp; vượt nỗi sợ</h2>
<p class="lead">Nỗi sợ nói trước đám đông (<em>glossophobia</em>) là một trong những nỗi sợ phổ biến nhất — cả chuyên gia cũng thấy. Mục tiêu không phải xoá bỏ hồi hộp mà là <strong>chuyển hoá</strong> nó thành năng lượng.</p>
<h3>Vì sao ta thấy sợ</h3>
<p>Đứng trước đám đông kích hoạt phản ứng <strong>đánh-hay-chạy</strong>: tim đập nhanh, khô miệng, tay run. Đó là cơ thể chuẩn bị trình diễn, không phải dấu hiệu bạn sẽ thất bại.</p>
<h3>Kỹ thuật hiệu quả</h3>
<ul>
<li><strong>Chuẩn bị dư</strong> — không gì trấn tĩnh bằng thuộc lòng 30 giây đầu. Tập nói thành tiếng, đừng chỉ nhẩm trong đầu.</li>
<li><strong>Thở</strong> — thở bụng chậm (hít 4, thở 6) hạ nhịp tim trước khi bắt đầu.</li>
<li><strong>Tái định khung</strong> — nói "Mình đang hào hứng" thay vì "Mình đang lo". Cơ thể cảm giác như nhau; đổi nhãn đổi phần thể hiện (lo lắng → hào hứng).</li>
<li><strong>Tư thế quyền lực</strong> — đứng thẳng, ưỡn vai trong hai phút trước khi nói; tư thế mở tạo tự tin.</li>
<li><strong>Neo vào thông điệp</strong> — tập trung giúp khán giả, đừng nghĩ bị đánh giá. Hướng chú ý ra ngoài làm nỗi sợ nhỏ lại.</li>
</ul>
<pre><code>Checklist trước khi nói:
  1. Thuộc lòng câu mở đầu
  2. Thở 4-6, 3 lượt
  3. Tái khung: "hào hứng, không lo"
  4. Tìm 2-3 gương mặt thiện cảm để nói với
</code></pre>
<div class="callout"><span class="badge">Mẹo luyện</span> Quay 2 phút nói bằng điện thoại. Xem lại một lần là hết phần lớn bí ẩn — bạn sẽ thấy mình trông bình tĩnh hơn cảm giác nhiều.</div>`,
  ]]);

const c1q = quiz('dps201c-quiz-1', 'Quiz 1 — Fear|||Quiz 1 — Nỗi sợ', [
  { id: 'q1', question: 'Cách "tái định khung" (reframe) nỗi lo hiệu quả trước khi nói là?', options: ['Tự nhủ "đừng lo, bình tĩnh"', 'Nói "mình đang hào hứng" thay vì "mình đang lo"', 'Uống nhiều cà phê', 'Nhìn xuống sàn'], correctIndex: 1, explanation: 'Cơ thể lo lắng và hào hứng giống nhau; đổi nhãn sang hào hứng cải thiện thể hiện.' },
  { id: 'q2', question: 'Kỹ thuật thở giúp hạ nhịp tim trước khi nói?', options: ['Thở nhanh và nông', 'Nín thở', 'Thở bụng chậm (hít 4, thở 6)', 'Không thở qua mũi'], correctIndex: 2, explanation: 'Thở bụng chậm kích hoạt phản ứng thư giãn, hạ nhịp tim.' },
  { id: 'q3', question: 'Mục tiêu đúng khi đối diện nỗi sợ sân khấu là?', options: ['Xoá bỏ hoàn toàn mọi hồi hộp', 'Chuyển hoá hồi hộp thành năng lượng', 'Tránh mọi buổi nói', 'Đọc nguyên văn từ giấy'], correctIndex: 1, explanation: 'Không thể và không cần xoá hết nỗi sợ; hãy chuyển nó thành năng lượng trình diễn.' },
]);

const c2 = doc('dps201c-2-1-audience', '2.1 — Audience analysis & purpose|||2.1 — Phân tích khán giả & mục tiêu',
  'Phân tích khán giả (nhân khẩu, tâm lý, mức hiểu biết, "cái họ được lợi"); ba mục tiêu bài nói: cung cấp thông tin, thuyết phục, giải trí; đặt một thông điệp trung tâm.',
  [[
    `<span class="eyebrow">DPS201c · Chapter 2 · Lesson 2.1</span>
<h2>Audience analysis &amp; purpose</h2>
<p class="lead">The single biggest predictor of a talk's success is whether it was built <strong>for its audience</strong>. Before writing a word, learn who is in the room and what they need.</p>
<h3>Analyse the audience</h3>
<ul>
<li><strong>Demographics</strong> — age, background, role, expertise. A talk for beginners differs sharply from one for experts.</li>
<li><strong>Psychographics</strong> — what they value, believe and worry about. This shapes your pathos.</li>
<li><strong>Knowledge level</strong> — define jargon for novices; skip the basics for experts.</li>
<li><strong>"What's in it for me?"</strong> — every listener silently asks this. Answer it early.</li>
</ul>
<h3>Set a clear purpose</h3>
<p>Every speech has a <strong>general purpose</strong> — usually to <strong>inform</strong>, <strong>persuade</strong> or <strong>entertain</strong> — and one <strong>specific purpose</strong> (what you want this audience to know, do or feel by the end).</p>
<pre><code>General purpose:  To persuade
Specific purpose: To convince first-year students
                  to join one campus club this term
Central idea:     One club turns a big campus small.
</code></pre>
<div class="callout"><span class="badge">Practice tip</span> Write your specific purpose as a single sentence starting with a verb ("To persuade… / To explain…"). If you cannot, your talk is not focused yet.</div>`,
    `<span class="eyebrow">DPS201c · Chương 2 · Bài 2.1</span>
<h2>Phân tích khán giả &amp; mục tiêu</h2>
<p class="lead">Yếu tố dự báo thành công lớn nhất của một bài nói là nó có được xây <strong>cho khán giả</strong> hay không. Trước khi viết chữ nào, hãy tìm hiểu ai đang trong phòng và họ cần gì.</p>
<h3>Phân tích khán giả</h3>
<ul>
<li><strong>Nhân khẩu học</strong> — tuổi, nền tảng, vai trò, chuyên môn. Bài cho người mới khác hẳn bài cho chuyên gia.</li>
<li><strong>Tâm lý học</strong> — điều họ coi trọng, tin và lo. Cái này định hình pathos của bạn.</li>
<li><strong>Mức hiểu biết</strong> — giải nghĩa thuật ngữ cho người mới; bỏ phần cơ bản với chuyên gia.</li>
<li><strong>"Tôi được lợi gì?"</strong> — mọi người nghe đều thầm hỏi câu này. Trả lời sớm.</li>
</ul>
<h3>Đặt mục tiêu rõ</h3>
<p>Mỗi bài nói có một <strong>mục tiêu chung</strong> — thường là <strong>cung cấp thông tin</strong>, <strong>thuyết phục</strong> hoặc <strong>giải trí</strong> — và một <strong>mục tiêu cụ thể</strong> (điều bạn muốn khán giả này biết, làm hoặc cảm khi kết thúc).</p>
<pre><code>Mục tiêu chung:  Thuyết phục
Mục tiêu cụ thể: Thuyết phục sinh viên năm nhất
                 tham gia một câu lạc bộ trong kỳ này
Ý trung tâm:     Một CLB biến trường lớn thành nhỏ.
</code></pre>
<div class="callout"><span class="badge">Mẹo luyện</span> Viết mục tiêu cụ thể thành một câu bắt đầu bằng động từ ("Thuyết phục… / Giải thích…"). Nếu không viết nổi, bài nói của bạn chưa đủ tập trung.</div>`,
  ]]);

const c2q = quiz('dps201c-quiz-2', 'Quiz 2 — Audience & purpose|||Quiz 2 — Khán giả & mục tiêu', [
  { id: 'q1', question: 'Ba mục tiêu chung phổ biến của một bài nói là?', options: ['Đọc, viết, nghe', 'Cung cấp thông tin, thuyết phục, giải trí', 'Mở, thân, kết', 'Ethos, pathos, logos'], correctIndex: 1, explanation: 'General purpose thường là inform, persuade hoặc entertain.' },
  { id: 'q2', question: 'Câu hỏi thầm lặng mọi khán giả đều đặt ra là?', options: ['"Người nói mặc gì?"', '"Bao giờ hết giờ?"', '"Tôi được lợi gì từ bài này?"', '"Có bao nhiêu slide?"'], correctIndex: 2, explanation: '"What is in it for me?" — hãy trả lời sớm trong bài nói.' },
  { id: 'q3', question: 'Nên viết "mục tiêu cụ thể" (specific purpose) thế nào?', options: ['Một đoạn văn dài', 'Một câu bắt đầu bằng động từ, nêu điều muốn khán giả biết/làm/cảm', 'Danh sách từ khoá', 'Tiêu đề slide đầu'], correctIndex: 1, explanation: 'Một câu rõ, bắt đầu bằng động từ, giúp bài nói tập trung.' },
]);

const c3 = doc('dps201c-3-1-structure', '3.1 — Speech structure|||3.1 — Cấu trúc bài nói',
  'Ba phần mở–thân–kết; mở bằng "hook" + luận đề (thesis) + tiền lộ (preview); thân 2–4 luận điểm có chuyển ý; kết tóm tắt + lời kêu gọi; không kết bằng "cảm ơn hết rồi".',
  [[
    `<span class="eyebrow">DPS201c · Chapter 3 · Lesson 3.1</span>
<h2>Speech structure</h2>
<p class="lead">Audiences cannot rewind. A clear structure — <strong>tell them what you'll say, say it, then remind them</strong> — is what lets them follow and remember.</p>
<h3>The three parts</h3>
<ul>
<li><strong>Introduction</strong> — a <strong>hook</strong> (question, story, surprising stat) to grab attention, your <strong>thesis</strong> (the one central message), and a <strong>preview</strong> of your main points.</li>
<li><strong>Body</strong> — usually <strong>2–4 main points</strong>, each with support, joined by clear <strong>transitions</strong> ("First… / Now that we've seen X, let's turn to Y").</li>
<li><strong>Conclusion</strong> — <strong>summarise</strong> the points, restate the thesis, and end with a memorable <strong>call to action</strong> or closing image.</li>
</ul>
<pre><code>Skeleton:
  Intro   -> Hook + Thesis + Preview
  Body    -> Point 1 (+ evidence)
          -> Point 2 (+ evidence)
          -> Point 3 (+ evidence)
  Concl.  -> Summary + Call to action
</code></pre>
<h3>Common mistakes</h3>
<ul>
<li>No hook — starting with "Um, so today I'm going to talk about…".</li>
<li>Too many points — three sticks; seven blurs.</li>
<li>Ending on "That's it, thanks" instead of a real close.</li>
</ul>
<div class="callout"><span class="badge">Practice tip</span> Outline before you write full sentences. If your three points don't each support the thesis, cut or replace them.</div>`,
    `<span class="eyebrow">DPS201c · Chương 3 · Bài 3.1</span>
<h2>Cấu trúc bài nói</h2>
<p class="lead">Khán giả không thể tua lại. Một cấu trúc rõ — <strong>báo trước điều sẽ nói, nói ra, rồi nhắc lại</strong> — là thứ giúp họ theo dõi và ghi nhớ.</p>
<h3>Ba phần</h3>
<ul>
<li><strong>Mở đầu</strong> — một <strong>"hook"</strong> (câu hỏi, câu chuyện, số liệu bất ngờ) để hút chú ý, <strong>luận đề</strong> (thông điệp trung tâm duy nhất), và <strong>tiền lộ</strong> (preview) các luận điểm chính.</li>
<li><strong>Thân bài</strong> — thường <strong>2–4 luận điểm</strong>, mỗi cái có dẫn chứng, nối bằng <strong>chuyển ý</strong> rõ ("Thứ nhất… / Đã thấy X, giờ ta sang Y").</li>
<li><strong>Kết luận</strong> — <strong>tóm tắt</strong> các điểm, nhắc lại luận đề, và khép bằng <strong>lời kêu gọi hành động</strong> hoặc hình ảnh đáng nhớ.</li>
</ul>
<pre><code>Bộ khung:
  Mở    -> Hook + Luận đề + Tiền lộ
  Thân  -> Điểm 1 (+ dẫn chứng)
        -> Điểm 2 (+ dẫn chứng)
        -> Điểm 3 (+ dẫn chứng)
  Kết   -> Tóm tắt + Kêu gọi hành động
</code></pre>
<h3>Lỗi thường gặp</h3>
<ul>
<li>Không có hook — mở bằng "Ừm, hôm nay em sẽ nói về…".</li>
<li>Quá nhiều luận điểm — ba thì nhớ; bảy thì nhoè.</li>
<li>Kết bằng "Hết rồi ạ, cảm ơn" thay vì một cái khép thực sự.</li>
</ul>
<div class="callout"><span class="badge">Mẹo luyện</span> Dựng outline trước khi viết câu đầy đủ. Nếu ba luận điểm không cùng phục vụ luận đề, hãy cắt hoặc thay.</div>`,
  ]]);

const c3q = quiz('dps201c-quiz-3', 'Quiz 3 — Structure|||Quiz 3 — Cấu trúc', [
  { id: 'q1', question: 'Ba phần cơ bản của một bài nói là?', options: ['Ethos, pathos, logos', 'Mở đầu, thân bài, kết luận', 'Hook, slide, cảm ơn', 'Giọng, mắt, cử chỉ'], correctIndex: 1, explanation: 'Cấu trúc kinh điển: introduction – body – conclusion.' },
  { id: 'q2', question: '"Hook" trong phần mở đầu dùng để?', options: ['Tóm tắt toàn bài', 'Hút sự chú ý ngay từ đầu (câu hỏi, câu chuyện, số liệu bất ngờ)', 'Cảm ơn khán giả', 'Liệt kê tài liệu tham khảo'], correctIndex: 1, explanation: 'Hook mở màn kéo khán giả vào bài nói.' },
  { id: 'q3', question: 'Số luận điểm chính nên có trong thân bài, theo kinh nghiệm, là?', options: ['1 điểm duy nhất', 'Khoảng 2–4 điểm', '7–10 điểm', 'Càng nhiều càng tốt'], correctIndex: 1, explanation: '2–4 điểm dễ nhớ; quá nhiều làm khán giả nhoè.' },
]);

const c4 = doc('dps201c-4-1-content', '4.1 — Content & evidence|||4.1 — Nội dung & bằng chứng',
  'Nghiên cứu nguồn đáng tin; kể chuyện (story) là trái tim bài nói (TED); dùng số liệu ít mà đắt, làm số "sống" bằng so sánh; ví dụ, phép loại suy, trích dẫn.',
  [[
    `<span class="eyebrow">DPS201c · Chapter 4 · Lesson 4.1</span>
<h2>Content &amp; evidence</h2>
<p class="lead">A structure is a skeleton; content is the flesh. Great talks mix <strong>stories</strong> that make us feel with <strong>evidence</strong> that makes us believe.</p>
<h3>Research first</h3>
<p>Support points with <strong>credible sources</strong> — studies, experts, reliable data. Note where each fact comes from so you can cite it and answer questions.</p>
<h3>Storytelling — the heart of the talk</h3>
<p>In <em>Talk Like TED</em>, Carmine Gallo found the best talks are roughly <strong>65% story</strong>. A concrete story about one person beats an abstract statistic — it triggers emotion and memory. Use a simple arc: <strong>situation → complication → resolution → lesson</strong>.</p>
<h3>Make data land</h3>
<ul>
<li><strong>Less is more</strong> — one striking number beats a slide of figures.</li>
<li><strong>Bring it to life</strong> — "1.5 million litres" means little; "enough to fill 60 Olympic pools" you can picture.</li>
<li><strong>Analogy &amp; example</strong> — connect the new to something the audience already knows.</li>
</ul>
<pre><code>Weak:  "Water use rose 47.3% year on year."
Strong:"Every second, we now pour away a bathtub
        more water than we did last year." + why
</code></pre>
<div class="callout"><span class="badge">Practice tip</span> For each main point, pair one <strong>story</strong> with one <strong>fact</strong>. Emotion opens the door; evidence closes the deal.</div>`,
    `<span class="eyebrow">DPS201c · Chương 4 · Bài 4.1</span>
<h2>Nội dung &amp; bằng chứng</h2>
<p class="lead">Cấu trúc là bộ xương; nội dung là phần thịt. Bài nói hay pha trộn <strong>câu chuyện</strong> khiến ta cảm với <strong>bằng chứng</strong> khiến ta tin.</p>
<h3>Nghiên cứu trước</h3>
<p>Chống đỡ luận điểm bằng <strong>nguồn đáng tin</strong> — nghiên cứu, chuyên gia, dữ liệu tin cậy. Ghi lại xuất xứ từng dữ kiện để trích dẫn và trả lời câu hỏi.</p>
<h3>Kể chuyện — trái tim bài nói</h3>
<p>Trong <em>Talk Like TED</em>, Carmine Gallo thấy các bài hay nhất khoảng <strong>65% là câu chuyện</strong>. Một câu chuyện cụ thể về một con người thắng một thống kê trừu tượng — nó kích hoạt cảm xúc và trí nhớ. Dùng cung đơn giản: <strong>hoàn cảnh → biến cố → giải quyết → bài học</strong>.</p>
<h3>Làm số liệu "sống"</h3>
<ul>
<li><strong>Ít mà đắt</strong> — một con số gây sốc thắng cả slide đầy số.</li>
<li><strong>Cho nó sống</strong> — "1,5 triệu lít" nói lên ít; "đủ đổ đầy 60 bể bơi Olympic" thì hình dung được.</li>
<li><strong>Loại suy &amp; ví dụ</strong> — nối cái mới với thứ khán giả đã biết.</li>
</ul>
<pre><code>Yếu:  "Lượng nước dùng tăng 47,3% mỗi năm."
Mạnh: "Mỗi giây, giờ ta đổ đi nhiều hơn năm
       ngoái đúng một bồn tắm nước." + vì sao
</code></pre>
<div class="callout"><span class="badge">Mẹo luyện</span> Với mỗi luận điểm, ghép một <strong>câu chuyện</strong> với một <strong>dữ kiện</strong>. Cảm xúc mở cửa; bằng chứng chốt hạ.</div>`,
  ]]);

const c4q = quiz('dps201c-quiz-4', 'Quiz 4 — Content & evidence|||Quiz 4 — Nội dung & bằng chứng', [
  { id: 'q1', question: 'Theo "Talk Like TED", thành phần chiếm phần lớn các bài nói hay nhất là?', options: ['Số liệu thống kê', 'Câu chuyện (khoảng 65%)', 'Slide đẹp', 'Trích dẫn danh nhân'], correctIndex: 1, explanation: 'Gallo thấy các TED hay nhất khoảng 65% là kể chuyện.' },
  { id: 'q2', question: 'Cách trình bày số liệu hiệu quả nhất là?', options: ['Đưa càng nhiều con số càng tốt', 'Làm số "sống" bằng so sánh dễ hình dung', 'Đọc thật nhanh cho hết', 'Giấu nguồn để khỏi bị hỏi'], correctIndex: 1, explanation: 'Một con số gắn với so sánh cụ thể dễ nhớ hơn một bảng số.' },
  { id: 'q3', question: 'Vai trò của câu chuyện so với bằng chứng trong bài nói?', options: ['Câu chuyện thay thế hoàn toàn bằng chứng', 'Cảm xúc mở cửa, bằng chứng chốt hạ — dùng cả hai', 'Chỉ cần bằng chứng, bỏ câu chuyện', 'Cả hai đều không cần thiết'], correctIndex: 1, explanation: 'Kết hợp: story khơi cảm xúc, evidence tạo niềm tin.' },
]);

const c5 = doc('dps201c-5-1-language', '5.1 — Language & style|||5.1 — Ngôn ngữ & phong cách',
  'Chọn từ cụ thể, ngắn, chủ động; nhịp điệu và phép lặp (rule of three, anaphora); ẩn dụ; ba trụ hùng biện ethos/pathos/logos; viết cho TAI (nói) chứ không cho MẮT (đọc).',
  [[
    `<span class="eyebrow">DPS201c · Chapter 5 · Lesson 5.1</span>
<h2>Language &amp; style</h2>
<p class="lead">You are writing for the <strong>ear</strong>, not the eye. Spoken language is shorter, simpler and more rhythmic than written prose.</p>
<h3>Word choice</h3>
<ul>
<li><strong>Concrete over abstract</strong> — "a rusty bike" beats "a mode of transport".</li>
<li><strong>Short &amp; active</strong> — "We cut waste by half" beats "Waste was reduced by 50%".</li>
<li><strong>Cut filler</strong> — every "basically / actually / you know" weakens you.</li>
</ul>
<h3>Rhetorical devices</h3>
<ul>
<li><strong>Rule of three</strong> — "government of the people, by the people, for the people". Three is memorable.</li>
<li><strong>Anaphora</strong> — repeat an opening phrase ("I have a dream…") for rhythm and force.</li>
<li><strong>Metaphor</strong> — one vivid image ("a mountain of debt") does the work of a paragraph.</li>
</ul>
<h3>The rhetorical triangle</h3>
<pre><code>Ethos  -> credibility  ("As a nurse for 10 years…")
Pathos -> emotion      (a story that moves them)
Logos  -> logic        (data, clear reasoning)
Balance all three; leaning on only one weakens you.
</code></pre>
<div class="callout"><span class="badge">Practice tip</span> Read your script aloud. Anywhere you stumble or run out of breath, the sentence is too long for speech — cut it.</div>`,
    `<span class="eyebrow">DPS201c · Chương 5 · Bài 5.1</span>
<h2>Ngôn ngữ &amp; phong cách</h2>
<p class="lead">Bạn viết cho <strong>tai</strong>, không cho mắt. Ngôn ngữ nói ngắn hơn, đơn giản hơn và giàu nhịp điệu hơn văn viết.</p>
<h3>Chọn từ</h3>
<ul>
<li><strong>Cụ thể hơn trừu tượng</strong> — "chiếc xe đạp gỉ sét" hơn "một phương tiện di chuyển".</li>
<li><strong>Ngắn &amp; chủ động</strong> — "Chúng tôi cắt nửa lượng rác" hơn "Lượng rác đã được giảm 50%".</li>
<li><strong>Bỏ từ đệm</strong> — mỗi tiếng "kiểu như / thật ra / bạn biết đấy" làm bạn yếu đi.</li>
</ul>
<h3>Thủ pháp hùng biện</h3>
<ul>
<li><strong>Quy tắc ba (rule of three)</strong> — "của dân, do dân, vì dân". Bộ ba dễ nhớ.</li>
<li><strong>Điệp đầu (anaphora)</strong> — lặp cụm mở đầu ("Tôi có một giấc mơ…") tạo nhịp và sức mạnh.</li>
<li><strong>Ẩn dụ</strong> — một hình ảnh sống động ("núi nợ nần") làm thay cả đoạn văn.</li>
</ul>
<h3>Tam giác hùng biện</h3>
<pre><code>Ethos  -> uy tín   ("Là y tá 10 năm, tôi…")
Pathos -> cảm xúc  (câu chuyện lay động)
Logos  -> logic    (số liệu, lập luận rõ)
Cân cả ba; chỉ dựa vào một là yếu.
</code></pre>
<div class="callout"><span class="badge">Mẹo luyện</span> Đọc kịch bản thành tiếng. Chỗ nào vấp hoặc hụt hơi nghĩa là câu quá dài để nói — hãy cắt.</div>`,
  ]]);

const c5q = quiz('dps201c-quiz-5', 'Quiz 5 — Language & style|||Quiz 5 — Ngôn ngữ & phong cách', [
  { id: 'q1', question: 'Ba trụ của tam giác hùng biện (Aristotle) là?', options: ['Mở, thân, kết', 'Ethos, pathos, logos', 'Giọng, mắt, cử chỉ', 'Hook, số liệu, kết'], correctIndex: 1, explanation: 'Ethos (uy tín), pathos (cảm xúc), logos (logic).' },
  { id: 'q2', question: '"Rule of three" (quy tắc ba) trong hùng biện nghĩa là?', options: ['Chỉ nói trong ba phút', 'Nhóm ý theo bộ ba cho dễ nhớ ("của dân, do dân, vì dân")', 'Ba slide tối đa', 'Lặp lại ba lần cùng một câu'], correctIndex: 1, explanation: 'Bộ ba tạo nhịp và dễ nhớ hơn.' },
  { id: 'q3', question: 'Khi viết cho bài nói, nguyên tắc đúng là?', options: ['Viết như văn học thuật, câu dài', 'Viết cho tai: câu ngắn, từ cụ thể, chủ động', 'Dùng nhiều từ đệm cho tự nhiên', 'Càng nhiều thuật ngữ càng uy tín'], correctIndex: 1, explanation: 'Ngôn ngữ nói ngắn, cụ thể, chủ động; đọc to để kiểm tra.' },
]);

const c6 = doc('dps201c-6-1-delivery', '6.1 — Delivery & nonverbal|||6.1 — Trình bày & phi ngôn ngữ',
  'Giọng: âm lượng, tốc độ, cao độ, quãng nghỉ đắt giá; ánh mắt giữ từng người 2–3 giây; cử chỉ mở; di chuyển có chủ đích; loại bỏ từ đệm; luyện thành tiếng và quay lại.',
  [[
    `<span class="eyebrow">DPS201c · Chapter 6 · Lesson 6.1</span>
<h2>Delivery &amp; nonverbal communication</h2>
<p class="lead">How you say it often matters more than the words. Voice and body carry a huge share of your message.</p>
<h3>Voice — your main instrument</h3>
<ul>
<li><strong>Volume</strong> — project to the back row; energy reads as confidence.</li>
<li><strong>Pace</strong> — slow down for key points; nerves make us rush.</li>
<li><strong>Pitch &amp; variety</strong> — a monotone loses people; vary your tone.</li>
<li><strong>The pause</strong> — silence after a big idea gives it weight, and beats every "um".</li>
</ul>
<h3>Body language</h3>
<ul>
<li><strong>Eye contact</strong> — hold one person for a full thought (2–3 seconds), then move on. It builds connection and calms you.</li>
<li><strong>Gestures</strong> — open, purposeful hands reinforce meaning; hidden hands read as nervous.</li>
<li><strong>Posture &amp; movement</strong> — stand grounded; move with intention (to mark a new point), not to pace anxiously.</li>
</ul>
<pre><code>Kill filler words:
  Instead of "um / like / you know" -> PAUSE.
  Silence sounds thoughtful; filler sounds unsure.
</code></pre>
<div class="callout"><span class="badge">Practice tip</span> Rehearse on camera and watch with the sound off. If your gestures and face still tell the story, your nonverbals are working.</div>`,
    `<span class="eyebrow">DPS201c · Chương 6 · Bài 6.1</span>
<h2>Trình bày &amp; giao tiếp phi ngôn ngữ</h2>
<p class="lead">Cách bạn nói thường quan trọng hơn lời nói. Giọng và cơ thể mang một phần lớn thông điệp.</p>
<h3>Giọng — nhạc cụ chính của bạn</h3>
<ul>
<li><strong>Âm lượng</strong> — phóng tới hàng ghế cuối; năng lượng đọc thành sự tự tin.</li>
<li><strong>Tốc độ</strong> — chậm lại ở điểm quan trọng; hồi hộp khiến ta nói vội.</li>
<li><strong>Cao độ &amp; biến hoá</strong> — giọng đều đều làm mất khán giả; hãy đổi giọng điệu.</li>
<li><strong>Quãng nghỉ</strong> — im lặng sau một ý lớn tạo sức nặng, và hơn hẳn mọi tiếng "ừm".</li>
</ul>
<h3>Ngôn ngữ cơ thể</h3>
<ul>
<li><strong>Ánh mắt</strong> — giữ một người trọn một ý (2–3 giây) rồi chuyển. Nó tạo kết nối và giúp bạn bình tĩnh.</li>
<li><strong>Cử chỉ</strong> — bàn tay mở, có chủ đích củng cố ý nghĩa; tay giấu đi trông lo lắng.</li>
<li><strong>Tư thế &amp; di chuyển</strong> — đứng vững; di chuyển có ý (để đánh dấu ý mới), không đi tới lui vì lo.</li>
</ul>
<pre><code>Diệt từ đệm:
  Thay vì "ừm / kiểu / bạn biết đấy" -> NGHỈ.
  Im lặng nghe điềm tĩnh; từ đệm nghe thiếu chắc.
</code></pre>
<div class="callout"><span class="badge">Mẹo luyện</span> Tập trước camera và xem lại với âm lượng tắt. Nếu cử chỉ và gương mặt vẫn kể được câu chuyện, phần phi ngôn ngữ của bạn đang hiệu quả.</div>`,
  ]]);

const c6q = quiz('dps201c-quiz-6', 'Quiz 6 — Delivery|||Quiz 6 — Trình bày', [
  { id: 'q1', question: 'Cách dùng ánh mắt hiệu quả khi nói trước đám đông là?', options: ['Nhìn lướt cả phòng thật nhanh', 'Nhìn trần nhà hoặc slide', 'Giữ một người trọn một ý (2–3 giây) rồi chuyển', 'Nhắm mắt cho đỡ run'], correctIndex: 2, explanation: 'Giao tiếp mắt từng người tạo kết nối và giúp bình tĩnh.' },
  { id: 'q2', question: 'Cách tốt nhất để thay thế từ đệm ("ừm", "kiểu") là?', options: ['Nói nhanh hơn', 'Dùng một quãng nghỉ (im lặng)', 'Thêm nhiều từ đệm khác', 'Xin lỗi khán giả'], correctIndex: 1, explanation: 'Quãng nghỉ nghe điềm tĩnh và có suy nghĩ; từ đệm nghe thiếu chắc chắn.' },
  { id: 'q3', question: 'Vai trò của "quãng nghỉ" (pause) sau một ý lớn là?', options: ['Làm mất thời gian', 'Tạo sức nặng, cho khán giả thời gian tiếp nhận', 'Cho thấy người nói quên bài', 'Không có tác dụng gì'], correctIndex: 1, explanation: 'Im lặng đúng chỗ nhấn mạnh ý và tạo sức nặng.' },
]);

const c7 = doc('dps201c-7-1-slides', '7.1 — Slides & visual aids|||7.1 — Slide & phương tiện hỗ trợ',
  'Slide hỗ trợ chứ không thay người nói; một ý mỗi slide; ít chữ, hình lớn; tránh "death by PowerPoint" và đọc slide; quy tắc tương phản/khoảng trắng; nêu nguồn dữ liệu.',
  [[
    `<span class="eyebrow">DPS201c · Chapter 7 · Lesson 7.1</span>
<h2>Slides &amp; visual aids</h2>
<p class="lead"><strong>You</strong> are the presentation; slides are the support. A good slide reinforces your point in a glance — it is not your script projected on a wall.</p>
<h3>Design principles</h3>
<ul>
<li><strong>One idea per slide</strong> — if it needs a paragraph, it is a document, not a slide.</li>
<li><strong>Few words, big visuals</strong> — a strong image or one chart beats a wall of bullets.</li>
<li><strong>Large, readable type</strong> — if the back row can't read it, cut it.</li>
<li><strong>Contrast &amp; white space</strong> — let the slide breathe; clutter kills focus.</li>
</ul>
<h3>Avoid "death by PowerPoint"</h3>
<ul>
<li>Do not <strong>read your slides</strong> — the audience can read faster than you talk.</li>
<li>Cite the <strong>source</strong> under any data or chart.</li>
<li>Use a <strong>black slide</strong> (or "B" key) when you want all eyes on you.</li>
</ul>
<pre><code>Bad slide:  12 bullet points, 3 fonts, full paragraphs
Good slide: 1 headline idea + 1 image, source cited
Rule of thumb: a viewer "gets it" in about 3 seconds
</code></pre>
<div class="callout"><span class="badge">Practice tip</span> Design the talk first, slides last. If your talk still works with the projector off, your slides are supporting — not carrying — you.</div>`,
    `<span class="eyebrow">DPS201c · Chương 7 · Bài 7.1</span>
<h2>Slide &amp; phương tiện hỗ trợ</h2>
<p class="lead"><strong>Bạn</strong> mới là bài thuyết trình; slide là phần hỗ trợ. Một slide tốt củng cố ý của bạn trong một cái liếc — nó không phải kịch bản chiếu lên tường.</p>
<h3>Nguyên tắc thiết kế</h3>
<ul>
<li><strong>Một ý mỗi slide</strong> — nếu cần cả đoạn văn thì đó là tài liệu, không phải slide.</li>
<li><strong>Ít chữ, hình lớn</strong> — một hình mạnh hoặc một biểu đồ hơn cả bức tường gạch đầu dòng.</li>
<li><strong>Chữ to, dễ đọc</strong> — hàng ghế cuối không đọc được thì bỏ đi.</li>
<li><strong>Tương phản &amp; khoảng trắng</strong> — để slide "thở"; rối rắm giết sự tập trung.</li>
</ul>
<h3>Tránh "chết vì PowerPoint"</h3>
<ul>
<li>Đừng <strong>đọc slide</strong> — khán giả đọc nhanh hơn bạn nói.</li>
<li>Ghi <strong>nguồn</strong> dưới mọi dữ liệu hoặc biểu đồ.</li>
<li>Dùng <strong>slide đen</strong> (hoặc phím "B") khi muốn mọi ánh mắt về phía bạn.</li>
</ul>
<pre><code>Slide tệ:  12 gạch đầu dòng, 3 phông, đoạn văn dài
Slide tốt: 1 ý tiêu đề + 1 hình, có ghi nguồn
Mẹo: người xem "hiểu ngay" trong khoảng 3 giây
</code></pre>
<div class="callout"><span class="badge">Mẹo luyện</span> Thiết kế bài nói trước, slide sau cùng. Nếu tắt máy chiếu mà bài vẫn chạy được, tức slide đang hỗ trợ — chứ không gánh — bạn.</div>`,
  ]]);

const c7q = quiz('dps201c-quiz-7', 'Quiz 7 — Slides|||Quiz 7 — Slide', [
  { id: 'q1', question: 'Nguyên tắc thiết kế slide tốt nhất trong số sau là?', options: ['Nhồi càng nhiều chữ càng đầy đủ', 'Một ý mỗi slide, ít chữ, hình lớn', 'Đọc nguyên văn slide cho khán giả', 'Dùng nhiều phông và màu cho sinh động'], correctIndex: 1, explanation: 'Một ý mỗi slide, ít chữ, hình lớn — slide hỗ trợ chứ không thay người nói.' },
  { id: 'q2', question: '"Death by PowerPoint" thường do?', options: ['Slide quá ít chữ', 'Slide dày chữ và người nói đọc lại slide', 'Không dùng slide nào', 'Ghi nguồn dữ liệu'], correctIndex: 1, explanation: 'Slide đầy gạch đầu dòng + đọc lại slide làm khán giả chán.' },
  { id: 'q3', question: 'Nên thiết kế slide vào lúc nào trong quy trình?', options: ['Đầu tiên, trước cả nội dung', 'Sau cùng, sau khi đã dựng nội dung bài nói', 'Không cần nội dung, chỉ cần slide', 'Trong lúc đang nói'], correctIndex: 1, explanation: 'Dựng bài nói trước, slide sau; slide chỉ để hỗ trợ.' },
]);

const c8 = doc('dps201c-8-1-persuasion', '8.1 — Persuasion & speech types|||8.1 — Thuyết phục & loại bài nói',
  'Bài thông tin vs thuyết phục; Monroe Motivated Sequence (5 bước); bài ứng khẩu (impromptu) khung PREP; xử lý Q&A: nghe kỹ, nhắc lại, ngắn gọn, thành thật khi chưa biết.',
  [[
    `<span class="eyebrow">DPS201c · Chapter 8 · Lesson 8.1</span>
<h2>Persuasion &amp; speech types</h2>
<p class="lead">Different goals need different shapes. Knowing the type of talk you're giving tells you how to build it.</p>
<h3>Informative vs persuasive</h3>
<ul>
<li><strong>Informative</strong> — teach or explain clearly and fairly; success = the audience understands.</li>
<li><strong>Persuasive</strong> — change belief or drive action; success = the audience moves.</li>
</ul>
<h3>Monroe's Motivated Sequence (for persuasion)</h3>
<pre><code>1. Attention  -> hook them
2. Need       -> show the problem, make it real
3. Satisfaction -> present your solution
4. Visualization -> paint life with (and without) it
5. Action     -> the specific step you want them to take
</code></pre>
<h3>Impromptu speaking — the PREP frame</h3>
<p>Asked to speak with no prep? Use <strong>PREP</strong>: <strong>Point</strong> (your answer) → <strong>Reason</strong> → <strong>Example</strong> → <strong>Point</strong> (restate). It instantly structures an off-the-cuff reply.</p>
<h3>Handling Q&amp;A</h3>
<ul>
<li><strong>Listen fully</strong> and, if needed, repeat the question so all can hear.</li>
<li><strong>Be concise</strong> — answer, then stop; don't re-give the whole talk.</li>
<li><strong>Be honest</strong> — "I don't know, but I'll find out" beats bluffing.</li>
</ul>
<div class="callout"><span class="badge">Practice tip</span> Rehearse the <strong>hardest question</strong> you might get. If you can answer that calmly, the rest of Q&amp;A feels easy.</div>`,
    `<span class="eyebrow">DPS201c · Chương 8 · Bài 8.1</span>
<h2>Thuyết phục &amp; các loại bài nói</h2>
<p class="lead">Mục tiêu khác nhau cần hình dạng khác nhau. Biết mình đang nói loại bài gì sẽ cho biết cách dựng nó.</p>
<h3>Bài thông tin vs bài thuyết phục</h3>
<ul>
<li><strong>Thông tin (informative)</strong> — dạy hoặc giải thích rõ ràng, công bằng; thành công = khán giả hiểu.</li>
<li><strong>Thuyết phục (persuasive)</strong> — đổi niềm tin hoặc thúc hành động; thành công = khán giả chuyển động.</li>
</ul>
<h3>Chuỗi tạo động lực Monroe (cho thuyết phục)</h3>
<pre><code>1. Chú ý       -> hút khán giả
2. Nhu cầu     -> nêu vấn đề, làm nó có thật
3. Thoả mãn    -> đưa ra giải pháp của bạn
4. Hình dung   -> vẽ cuộc sống có (và không có) nó
5. Hành động   -> bước cụ thể bạn muốn họ làm
</code></pre>
<h3>Nói ứng khẩu — khung PREP</h3>
<p>Bị mời nói mà không chuẩn bị? Dùng <strong>PREP</strong>: <strong>Point</strong> (câu trả lời) → <strong>Reason</strong> (lý do) → <strong>Example</strong> (ví dụ) → <strong>Point</strong> (nhắc lại). Nó lập tức tạo cấu trúc cho câu đáp tức thời.</p>
<h3>Xử lý Q&amp;A (hỏi &amp; đáp)</h3>
<ul>
<li><strong>Nghe trọn vẹn</strong> và nếu cần, nhắc lại câu hỏi để mọi người cùng nghe.</li>
<li><strong>Ngắn gọn</strong> — trả lời rồi dừng; đừng nói lại cả bài.</li>
<li><strong>Thành thật</strong> — "Tôi chưa biết, nhưng sẽ tìm hiểu" hơn là nói bừa.</li>
</ul>
<div class="callout"><span class="badge">Mẹo luyện</span> Tập trước <strong>câu hỏi khó nhất</strong> bạn có thể gặp. Trả lời được nó một cách điềm tĩnh thì phần Q&amp;A còn lại thấy dễ hẳn.</div>`,
  ]]);

const c8q = quiz('dps201c-quiz-8', 'Quiz 8 — Persuasion & types|||Quiz 8 — Thuyết phục & loại bài', [
  { id: 'q1', question: 'Khung "PREP" dùng cho bài nói ứng khẩu (impromptu) gồm?', options: ['Plan – Rehearse – Edit – Present', 'Point – Reason – Example – Point', 'Prepare – Read – Explain – Pause', 'Problem – Result – Effect – Plan'], correctIndex: 1, explanation: 'PREP = Point → Reason → Example → Point (nhắc lại).' },
  { id: 'q2', question: 'Điểm khác nhau cốt lõi giữa bài thông tin và bài thuyết phục là?', options: ['Bài thông tin dài hơn', 'Thông tin để khán giả HIỂU; thuyết phục để khán giả CHUYỂN ĐỘNG (đổi niềm tin/hành động)', 'Thuyết phục không cần bằng chứng', 'Không có khác biệt'], correctIndex: 1, explanation: 'Informative nhắm hiểu biết; persuasive nhắm thay đổi niềm tin hoặc hành vi.' },
  { id: 'q3', question: 'Khi bị hỏi một câu mà bạn không biết đáp án trong Q&A, tốt nhất nên?', options: ['Bịa một câu trả lời nghe hợp lý', 'Lờ đi và chuyển câu khác', 'Thành thật: "Tôi chưa biết, nhưng sẽ tìm hiểu"', 'Nói lại toàn bộ bài thuyết trình'], correctIndex: 2, explanation: 'Thành thật giữ uy tín (ethos) hơn là nói bừa.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'DPS201c',
    slug: 'dps201c-dynamic-public-speaking',
    title: 'Dynamic Public Speaking',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DPS201c.webp',
    shortDescription: 'Speak with confidence — beat stage fright, read your audience, structure & write a talk, use stories, evidence and ethos/pathos/logos, master voice & body language, design slides, and give persuasive & impromptu talks. Bilingual, with quizzes.|||Nói tự tin — vượt sợ sân khấu, đọc khán giả, dựng & viết bài nói, dùng câu chuyện, bằng chứng và ethos/pathos/logos, làm chủ giọng & cơ thể, thiết kế slide, thuyết trình thuyết phục & ứng khẩu. Song ngữ, có quiz.',
    description: 'Môn <strong>DPS201c — Dynamic Public Speaking</strong> (Thuyết trình sinh động, ngành Công nghệ Truyền thông, kỳ 4) dạy bạn <strong>nói sao cho người ta lắng nghe, nhớ và hành động</strong>. Từ <strong>vượt nỗi sợ sân khấu</strong> → <strong>phân tích khán giả &amp; đặt mục tiêu</strong> → <strong>cấu trúc</strong> (mở–thân–kết) → <strong>nội dung &amp; bằng chứng</strong> (kể chuyện, số liệu) → <strong>ngôn ngữ &amp; hùng biện</strong> (ethos/pathos/logos) → <strong>trình bày &amp; ngôn ngữ cơ thể</strong> → <strong>slide &amp; phương tiện</strong> → <strong>thuyết phục &amp; các loại bài nói</strong>. Khung dựng theo Coursera "Dynamic Public Speaking" (UW), "Talk Like TED" (Gallo), "The Art of Public Speaking" (Lucas), Toastmasters &amp; TED; song ngữ, có ví dụ, mẹo thực hành và quiz mỗi chương.',
    whatYouLearn: 'Kiểm soát nỗi sợ (thở, tái định khung, tư thế); phân tích khán giả &amp; đặt mục tiêu (inform/persuade/entertain); cấu trúc mở–thân–kết (hook, luận đề, chuyển ý); nghiên cứu, kể chuyện &amp; dùng số liệu sống; chọn từ, nhịp điệu &amp; ba trụ hùng biện; giọng, ánh mắt, cử chỉ, quãng nghỉ; thiết kế slide gọn, tránh "death by PowerPoint"; bài thuyết phục (Monroe), ứng khẩu (PREP) &amp; xử lý Q&amp;A.',
    requirements: 'Không cần kiến thức nền chuyên môn. Nên có điện thoại để tự quay lại khi luyện nói, và tinh thần sẵn sàng thực hành thành tiếng.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Khoá học, sách, TED, Toastmasters, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thuyết trình là gì, ba trụ hùng biện, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Thuyết trình & vượt nỗi sợ|||Chapter 1 — Public speaking & fear', description: 'Nỗi sợ sân khấu, thở, tái định khung, tư thế.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phân tích khán giả & mục tiêu|||Chapter 2 — Audience & purpose', description: 'Nhân khẩu/tâm lý, "được lợi gì", mục tiêu bài nói.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Cấu trúc bài nói|||Chapter 3 — Speech structure', description: 'Mở–thân–kết, hook, luận đề, chuyển ý.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Nội dung & bằng chứng|||Chapter 4 — Content & evidence', description: 'Nghiên cứu, kể chuyện, số liệu sống.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Ngôn ngữ & phong cách|||Chapter 5 — Language & style', description: 'Chọn từ, nhịp điệu, ethos/pathos/logos.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Trình bày & phi ngôn ngữ|||Chapter 6 — Delivery & nonverbal', description: 'Giọng, ánh mắt, cử chỉ, quãng nghỉ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Slide & phương tiện hỗ trợ|||Chapter 7 — Slides & visual aids', description: 'Thiết kế slide, tránh death by PowerPoint.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Thuyết phục & loại bài nói|||Chapter 8 — Persuasion & types', description: 'Monroe, PREP ứng khẩu, xử lý Q&A.', lessons: [c8, c8q] },
  ],
};
