/**
 * SSB201 — Advanced Business Communication (Kỹ năng giao tiếp nâng cao trong kinh doanh).
 * Khối Quản trị Kinh doanh, kỳ 5. Bám cấu trúc giáo trình giao tiếp kinh doanh chuẩn quốc tế
 * (vd Bovée & Thill — Business Communication Today; Guffey & Loewy — Business Communication:
 * Process and Product): quá trình giao tiếp, nhóm – họp – lắng nghe – phi ngôn ngữ, đa văn hoá,
 * quy trình viết 3 bước, thư thường ngày/tin tốt, tin xấu (gián tiếp, buffer), khủng hoảng,
 * thuyết phục & AIDA, báo cáo & đề xuất, thuyết trình, CV – thư xin việc – phỏng vấn.
 * Song ngữ + thư mẫu EN/VI (tình huống GIẢ ĐỊNH, số đã kiểm) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('ssb201-0-1-overview', 'Course overview: communicating to get results|||Tổng quan: giao tiếp để đạt kết quả',
  'Thế nào là giao tiếp kinh doanh hiệu quả, mô hình quá trình giao tiếp 8 bước, các rào cản, mạng lưới giao tiếp chính thức và không chính thức trong tổ chức, đạo đức trong giao tiếp, lộ trình môn.',
  [[
    `<span class="eyebrow">SSB201 · Lesson 0.1 · Overview</span>
<h2>Advanced Business Communication</h2>
<p class="lead">In business, a message succeeds only when the audience <strong>understands it, accepts it and acts on it</strong>. This course treats communication as a professional skill with a repeatable process: analyse the situation and the audience, choose the right approach and medium, write or speak clearly, and check the result.</p>
<h3>What effective business messages do</h3>
<ul>
<li><strong>Provide practical information</strong> — the audience learns what to do, how and by when.</li>
<li><strong>Give facts rather than vague impressions</strong> — concrete language, specific details, evidence.</li>
<li><strong>Present information concisely and efficiently</strong> — busy readers get the main point fast.</li>
<li><strong>Clarify expectations and responsibilities</strong> — who does what, by which deadline.</li>
<li><strong>Offer compelling arguments and recommendations</strong> — showing the audience how they benefit.</li>
</ul>
<h3>The communication process</h3>
<p>A widely used textbook model breaks communication into eight steps:</p>
<ol>
<li>The sender has an idea.</li>
<li>The sender <strong>encodes</strong> the idea as a message — words, images, gestures.</li>
<li>The sender produces the message in a transmittable <strong>medium</strong> — spoken, written, visual or electronic.</li>
<li>The sender transmits the message through a <strong>channel</strong> — a meeting room, the postal system, an email server, a social network.</li>
<li>The audience receives the message.</li>
<li>The audience <strong>decodes</strong> the message, interpreting it through its own knowledge, culture and expectations.</li>
<li>The audience responds (or does not).</li>
<li>The audience gives <strong>feedback</strong>, which lets the sender check whether the message was understood as intended.</li>
</ol>
<p>Every step can break down. Common <strong>barriers</strong> are physical noise and distractions, competing messages and <strong>information overload</strong>, emotional states, differences in perception, language and culture, and <strong>filtering</strong> — messages distorted or shortened as they pass through several layers of an organization.</p>
<h3>Communication inside organizations</h3>
<table>
<tr><th>Network</th><th>Direction and purpose</th></tr>
<tr><td>Formal — downward</td><td>From managers to employees: goals, instructions, policies, feedback on performance</td></tr>
<tr><td>Formal — upward</td><td>From employees to managers: progress reports, problems, suggestions</td></tr>
<tr><td>Formal — horizontal (lateral)</td><td>Between departments or peers: coordination and problem-solving</td></tr>
<tr><td>Informal — the grapevine</td><td>Personal networks that carry news and rumours quickly. Managers cannot abolish it, but they can reduce rumours by communicating openly and early</td></tr>
</table>
<h3>Ethics runs through everything</h3>
<p>Ethical communication includes all relevant information, is true in every sense and does not deceive. Distinguish an <strong>ethical dilemma</strong> — choosing between alternatives that are not clearly right or wrong, such as how much to tell staff about a restructuring that is still under discussion — from an <strong>ethical lapse</strong>, a clearly unethical or illegal choice such as hiding a known product defect. Typical lapses: plagiarism, omitting essential information, selective misquoting, misrepresenting numbers, distorting visuals, and failing to respect privacy or information security.</p>
<p>A quick test before sending: <em>Is it legal? Is it balanced and fair to everyone affected? Would I be comfortable if it were published or read by people I respect?</em></p>
<h3>Roadmap</h3>
<p>Part 1: interpersonal and intercultural foundations · Part 2: the writing process and routine messages · Part 3: bad-news and persuasive messages · Part 4: reports, proposals, presentations and employment messages. Each part ends with a quiz; Parts 2 and 3 include writing exercises with model answers, and Parts 3 and 4 contain worked examples.</p>
<div class="callout"><span class="badge">Mindset</span> The meaning of a message is what the audience understands, not what you intended. Design every message from the receiver's side.</div>`,
    `<span class="eyebrow">SSB201 · Bài 0.1 · Tổng quan</span>
<h2>Kỹ năng giao tiếp nâng cao trong kinh doanh</h2>
<p class="lead">Trong kinh doanh, một thông điệp chỉ thành công khi người nhận <strong>hiểu, chấp nhận và hành động theo nó</strong>. Môn học này coi giao tiếp là một kỹ năng nghề nghiệp có quy trình lặp lại được: phân tích tình huống và người nhận, chọn cách tiếp cận và phương tiện phù hợp, viết hoặc nói rõ ràng, rồi kiểm tra kết quả.</p>
<h3>Thông điệp kinh doanh hiệu quả làm được gì</h3>
<ul>
<li><strong>Cung cấp thông tin thiết thực</strong> — người nhận biết phải làm gì, làm thế nào và hạn khi nào.</li>
<li><strong>Đưa ra sự thật thay vì ấn tượng mơ hồ</strong> — ngôn ngữ cụ thể, chi tiết rõ ràng, có bằng chứng.</li>
<li><strong>Trình bày ngắn gọn, hiệu quả</strong> — người đọc bận rộn nắm được ý chính thật nhanh.</li>
<li><strong>Làm rõ kỳ vọng và trách nhiệm</strong> — ai làm gì, trước hạn nào.</li>
<li><strong>Đưa ra lập luận và đề xuất thuyết phục</strong> — cho người nhận thấy họ được lợi gì.</li>
</ul>
<h3>Quá trình giao tiếp</h3>
<p>Một mô hình giáo trình được dùng rộng rãi chia quá trình giao tiếp thành tám bước:</p>
<ol>
<li>Người gửi có một ý tưởng.</li>
<li>Người gửi <strong>mã hoá</strong> ý tưởng thành thông điệp — lời nói, hình ảnh, cử chỉ.</li>
<li>Người gửi thể hiện thông điệp qua một <strong>phương tiện</strong> truyền được — nói, viết, hình ảnh hoặc điện tử.</li>
<li>Người gửi chuyển thông điệp qua một <strong>kênh</strong> — phòng họp, hệ thống bưu chính, máy chủ email, mạng xã hội.</li>
<li>Người nhận tiếp nhận thông điệp.</li>
<li>Người nhận <strong>giải mã</strong> thông điệp, diễn giải nó qua kiến thức, văn hoá và kỳ vọng của chính mình.</li>
<li>Người nhận phản ứng (hoặc không phản ứng).</li>
<li>Người nhận gửi <strong>phản hồi</strong>, giúp người gửi kiểm tra xem thông điệp có được hiểu đúng ý hay không.</li>
</ol>
<p>Bước nào cũng có thể trục trặc. Các <strong>rào cản</strong> thường gặp gồm tiếng ồn và sự xao nhãng, thông điệp cạnh tranh và <strong>quá tải thông tin</strong>, trạng thái cảm xúc, khác biệt về nhận thức, ngôn ngữ và văn hoá, và hiện tượng <strong>sàng lọc</strong> — thông điệp bị bóp méo hoặc cắt bớt khi đi qua nhiều cấp trong tổ chức.</p>
<h3>Giao tiếp bên trong tổ chức</h3>
<table>
<tr><th>Mạng lưới</th><th>Chiều và mục đích</th></tr>
<tr><td>Chính thức — từ trên xuống</td><td>Từ quản lý tới nhân viên: mục tiêu, chỉ đạo, chính sách, nhận xét kết quả làm việc</td></tr>
<tr><td>Chính thức — từ dưới lên</td><td>Từ nhân viên tới quản lý: báo cáo tiến độ, vấn đề phát sinh, đề xuất</td></tr>
<tr><td>Chính thức — hàng ngang</td><td>Giữa các phòng ban hoặc đồng nghiệp ngang cấp: phối hợp và giải quyết vấn đề</td></tr>
<tr><td>Không chính thức — kênh tin đồn</td><td>Mạng lưới quan hệ cá nhân lan truyền tin tức và tin đồn rất nhanh. Nhà quản lý không xoá bỏ được nó, nhưng có thể giảm tin đồn bằng cách thông tin cởi mở và sớm</td></tr>
</table>
<h3>Đạo đức xuyên suốt mọi thông điệp</h3>
<p>Giao tiếp có đạo đức là đưa đủ thông tin liên quan, đúng sự thật theo mọi nghĩa và không lừa dối. Cần phân biệt <strong>tình huống khó xử về đạo đức</strong> — phải chọn giữa các phương án không rõ đúng sai, chẳng hạn nên cho nhân viên biết bao nhiêu về một kế hoạch tái cấu trúc còn đang bàn — với <strong>sai phạm đạo đức</strong>, tức một lựa chọn rõ ràng là phi đạo đức hoặc trái luật, như che giấu lỗi sản phẩm đã biết. Các sai phạm điển hình: đạo văn, bỏ sót thông tin thiết yếu, trích dẫn cắt xén, trình bày sai lệch số liệu, bóp méo hình ảnh minh hoạ, và không tôn trọng quyền riêng tư hay an toàn thông tin.</p>
<p>Phép thử nhanh trước khi gửi: <em>Có hợp pháp không? Có cân bằng và công bằng với mọi người bị ảnh hưởng không? Mình có thấy thoải mái nếu nó được công bố hoặc được những người mình tôn trọng đọc không?</em></p>
<h3>Lộ trình</h3>
<p>Phần 1: nền tảng giao tiếp liên cá nhân và đa văn hoá · Phần 2: quy trình viết và thông điệp thường ngày · Phần 3: thông điệp tin xấu và thuyết phục · Phần 4: báo cáo, đề xuất, thuyết trình và hồ sơ xin việc. Mỗi phần kết thúc bằng một bài quiz; phần 2 và 3 có bài tập viết kèm lời giải mẫu, phần 3 và 4 có ví dụ mẫu phân tích chi tiết.</p>
<div class="callout"><span class="badge">Tư duy</span> Ý nghĩa của thông điệp là điều người nhận hiểu được, không phải điều bạn định nói. Hãy thiết kế mọi thông điệp từ phía người nhận.</div>`,
  ]]);

const c1 = doc('ssb201-1-1-interpersonal', '1.1 — Teamwork, meetings, listening & nonverbal communication|||1.1 — Làm việc nhóm, họp, lắng nghe & giao tiếp phi ngôn ngữ',
  'Lợi ích và rủi ro của làm việc nhóm (tư duy nhóm, mục đích ngầm, người ăn theo), các giai đoạn phát triển nhóm, xung đột xây dựng, tổ chức cuộc họp hiệu quả, quá trình và ba kiểu lắng nghe, lắng nghe chủ động, các tín hiệu phi ngôn ngữ và phép lịch sự nơi công sở.',
  [[
    `<span class="eyebrow">SSB201 · Part 1 · Lesson 1.1</span>
<h2>Teamwork, meetings, listening &amp; nonverbal communication</h2>
<h3>Communicating in teams</h3>
<p>A <strong>team</strong> is a unit of two or more people who share a mission and the responsibility for working toward a common goal. Teams can bring more information and knowledge, a diversity of viewpoints, greater acceptance of the final decision and higher performance. They also carry risks:</p>
<ul>
<li><strong>Groupthink</strong> — pressure to conform leads members to suppress doubts and approve poor decisions.</li>
<li><strong>Hidden agendas</strong> — private motives that work against the group's goal.</li>
<li><strong>Free riders</strong> — members who benefit from the team's work without contributing their share.</li>
<li><strong>Cost</strong> — coordinating schedules, meetings and communication takes time and money.</li>
</ul>
<p>Teams typically develop through stages often summarized as <strong>forming → storming → norming → performing → adjourning</strong> (Tuckman's model). Conflict is not automatically harmful: <em>constructive</em> conflict focuses on issues and improves decisions, while <em>destructive</em> conflict attacks people and divides the team. Aim for win–win outcomes: separate the people from the problem, focus on shared interests rather than fixed positions, and agree on objective criteria for judging options.</p>
<h3>Productive meetings</h3>
<table>
<tr><th>Stage</th><th>Good practice</th></tr>
<tr><td>Prepare</td><td>Decide whether a meeting is really needed; define its purpose (informational or decision-making); invite only the people who are needed; circulate an <strong>agenda</strong> with topics, owners and time limits</td></tr>
<tr><td>Conduct</td><td>Start on time; keep discussion on the agenda; draw out quiet members and manage dominant ones; for formal meetings, follow an agreed procedure such as <em>Robert's Rules of Order</em></td></tr>
<tr><td>Close and follow up</td><td>Summarize the decisions; confirm <strong>action items</strong> — who, what, by when; distribute the <strong>minutes</strong> promptly</td></tr>
<tr><td>Virtual meetings</td><td>Test the technology, share materials in advance, encourage cameras where appropriate, and call on people by name so no one is left out</td></tr>
</table>
<h3>Listening</h3>
<p>Listening is a process: <strong>receiving</strong> (hearing and paying attention) → <strong>decoding</strong> (assigning meaning) → <strong>remembering</strong> → <strong>evaluating</strong> (weighing evidence, separating fact from opinion) → <strong>responding</strong>. Business situations call for three types of listening:</p>
<table>
<tr><th>Type</th><th>Goal</th><th>Example</th></tr>
<tr><td>Content listening</td><td>Understand and retain information</td><td>Taking notes while a colleague explains a new procedure</td></tr>
<tr><td>Critical listening</td><td>Evaluate the logic, evidence and motives</td><td>Assessing a supplier's sales pitch</td></tr>
<tr><td>Empathic listening</td><td>Understand the speaker's feelings and needs</td><td>Letting an upset customer explain the whole problem before offering a solution</td></tr>
</table>
<p><strong>Active listening</strong> means showing and checking understanding: keep your attention on the speaker, avoid interrupting, paraphrase ("So the main issue is the delivery delay, not the price?") and ask clarifying questions. Common barriers are <em>selective listening</em> (hearing only what you expect or want), prejudging the speaker, daydreaming, and planning your reply while the other person is still talking.</p>
<h3>Nonverbal communication</h3>
<ul>
<li><strong>Facial expressions and eye contact</strong> signal interest, honesty or discomfort — and norms for eye contact differ across cultures.</li>
<li><strong>Gestures and posture</strong> — an open, steady posture suggests confidence; fidgeting suggests nervousness.</li>
<li><strong>Vocal characteristics</strong> (paralanguage) — tone, pitch, speed and pauses can change the meaning of the same words.</li>
<li><strong>Personal appearance</strong>, <strong>touch</strong>, and the use of <strong>time and space</strong> — punctuality and appropriate personal distance are read as signs of respect.</li>
</ul>
<p>Nonverbal signals can repeat, complement, contradict or replace words. When words and nonverbal cues conflict, listeners tend to trust the nonverbal cues, so make them consistent with what you say.</p>
<h3>Business etiquette</h3>
<p>Be punctual, introduce people properly, silence your phone in meetings, respect others' time in calls and messages, and remember that anything written online can be forwarded, stored and read out of context.</p>
<div class="callout"><span class="badge">Try it</span> In your next team meeting, paraphrase one colleague's point before responding to it. Notice how often the paraphrase reveals a small misunderstanding that would otherwise have gone unnoticed.</div>`,
    `<span class="eyebrow">SSB201 · Phần 1 · Bài 1.1</span>
<h2>Làm việc nhóm, họp, lắng nghe &amp; giao tiếp phi ngôn ngữ</h2>
<h3>Giao tiếp trong nhóm</h3>
<p><strong>Nhóm làm việc</strong> là một đơn vị gồm từ hai người trở lên cùng chia sẻ sứ mệnh và trách nhiệm hướng tới một mục tiêu chung. Làm việc nhóm có thể mang lại nhiều thông tin và kiến thức hơn, góc nhìn đa dạng, quyết định cuối cùng được chấp nhận rộng rãi hơn và hiệu quả cao hơn. Nhưng nó cũng có rủi ro:</p>
<ul>
<li><strong>Tư duy nhóm</strong> — áp lực phải đồng thuận khiến các thành viên nén lại nghi ngờ và thông qua những quyết định kém.</li>
<li><strong>Mục đích ngầm</strong> — động cơ riêng tư đi ngược mục tiêu chung của nhóm.</li>
<li><strong>Người ăn theo</strong> — thành viên hưởng lợi từ công sức của nhóm mà không đóng góp phần của mình.</li>
<li><strong>Chi phí</strong> — sắp xếp lịch, họp hành và trao đổi thông tin đều tốn thời gian và tiền bạc.</li>
</ul>
<p>Nhóm thường phát triển qua các giai đoạn hay được tóm tắt là <strong>hình thành → xung đột → chuẩn hoá → vận hành hiệu quả → giải tán</strong> (mô hình Tuckman). Xung đột không tự động là điều xấu: xung đột <em>mang tính xây dựng</em> tập trung vào vấn đề và giúp quyết định tốt hơn, còn xung đột <em>mang tính phá hoại</em> công kích con người và chia rẽ nhóm. Hãy hướng tới kết quả đôi bên cùng có lợi: tách con người khỏi vấn đề, tập trung vào lợi ích chung thay vì khăng khăng giữ lập trường, và thống nhất tiêu chí khách quan để đánh giá các phương án.</p>
<h3>Cuộc họp hiệu quả</h3>
<table>
<tr><th>Giai đoạn</th><th>Cách làm tốt</th></tr>
<tr><td>Chuẩn bị</td><td>Cân nhắc xem có thật sự cần họp không; xác định mục đích (thông tin hay ra quyết định); chỉ mời những người cần thiết; gửi trước <strong>chương trình họp</strong> ghi rõ nội dung, người phụ trách và thời lượng</td></tr>
<tr><td>Điều hành</td><td>Bắt đầu đúng giờ; giữ thảo luận bám chương trình; khuyến khích người ít nói và kiềm chế người lấn át; với cuộc họp trang trọng, theo một thủ tục đã thống nhất như <em>Robert's Rules of Order</em></td></tr>
<tr><td>Kết thúc và theo dõi</td><td>Tóm tắt các quyết định; xác nhận <strong>đầu việc</strong> — ai, làm gì, hạn khi nào; gửi <strong>biên bản họp</strong> sớm</td></tr>
<tr><td>Họp trực tuyến</td><td>Kiểm tra công nghệ, gửi tài liệu trước, khuyến khích bật camera khi phù hợp, và gọi tên từng người để không ai bị bỏ quên</td></tr>
</table>
<h3>Lắng nghe</h3>
<p>Lắng nghe là một quá trình: <strong>tiếp nhận</strong> (nghe và chú ý) → <strong>giải mã</strong> (gán ý nghĩa) → <strong>ghi nhớ</strong> → <strong>đánh giá</strong> (cân nhắc bằng chứng, tách sự thật khỏi ý kiến) → <strong>phản hồi</strong>. Trong kinh doanh có ba kiểu lắng nghe:</p>
<table>
<tr><th>Kiểu</th><th>Mục tiêu</th><th>Ví dụ</th></tr>
<tr><td>Lắng nghe nội dung</td><td>Hiểu và ghi nhớ thông tin</td><td>Ghi chép khi đồng nghiệp giải thích một quy trình mới</td></tr>
<tr><td>Lắng nghe phản biện</td><td>Đánh giá lập luận, bằng chứng và động cơ</td><td>Thẩm định bài chào hàng của một nhà cung cấp</td></tr>
<tr><td>Lắng nghe thấu cảm</td><td>Hiểu cảm xúc và nhu cầu của người nói</td><td>Để một khách hàng đang bực bội trình bày hết vấn đề rồi mới đưa ra giải pháp</td></tr>
</table>
<p><strong>Lắng nghe chủ động</strong> là thể hiện và kiểm tra rằng mình đã hiểu: tập trung vào người nói, không ngắt lời, diễn đạt lại ("Vậy vấn đề chính là giao hàng chậm, chứ không phải giá?") và đặt câu hỏi làm rõ. Rào cản thường gặp là <em>nghe có chọn lọc</em> (chỉ nghe điều mình mong đợi hoặc muốn nghe), định kiến về người nói, lơ đãng, và mải nghĩ câu đáp trong khi người kia vẫn đang nói.</p>
<h3>Giao tiếp phi ngôn ngữ</h3>
<ul>
<li><strong>Nét mặt và ánh mắt</strong> cho thấy sự quan tâm, thành thật hay khó chịu — và chuẩn mực về giao tiếp bằng mắt khác nhau giữa các nền văn hoá.</li>
<li><strong>Cử chỉ và tư thế</strong> — tư thế cởi mở, vững vàng gợi sự tự tin; cựa quậy liên tục gợi sự lo lắng.</li>
<li><strong>Đặc điểm giọng nói</strong> (cận ngôn ngữ) — ngữ điệu, cao độ, tốc độ và khoảng ngừng có thể làm cùng một câu mang nghĩa khác.</li>
<li><strong>Diện mạo</strong>, <strong>đụng chạm</strong>, và cách dùng <strong>thời gian, không gian</strong> — đúng giờ và giữ khoảng cách phù hợp được hiểu là tôn trọng.</li>
</ul>
<p>Tín hiệu phi ngôn ngữ có thể lặp lại, bổ sung, mâu thuẫn hoặc thay thế lời nói. Khi lời nói và tín hiệu phi ngôn ngữ mâu thuẫn, người nghe thường tin vào tín hiệu phi ngôn ngữ — vì vậy hãy giữ chúng nhất quán với điều bạn nói.</p>
<h3>Phép lịch sự trong kinh doanh</h3>
<p>Đúng giờ, giới thiệu mọi người đúng cách, tắt chuông điện thoại khi họp, tôn trọng thời gian của người khác khi gọi điện và nhắn tin, và nhớ rằng mọi thứ viết trên mạng đều có thể bị chuyển tiếp, lưu lại và đọc tách khỏi ngữ cảnh.</p>
<div class="callout"><span class="badge">Thử ngay</span> Trong cuộc họp nhóm tới, hãy diễn đạt lại ý của một đồng nghiệp trước khi đáp lại. Để ý xem việc diễn đạt lại thường xuyên phát hiện ra những hiểu lầm nhỏ mà lẽ ra đã bị bỏ qua đến mức nào.</div>`,
  ]]);

const c2 = doc('ssb201-1-2-intercultural', '1.2 — Intercultural communication|||1.2 — Giao tiếp đa văn hoá',
  'Văn hoá và giải mã thông điệp, văn hoá ngữ cảnh cao – thấp và thời gian đơn – đa nhiệm (Hall), các chiều văn hoá của Hofstede, hàm ý thực tế khi họp, từ chối, ký kết và góp ý; ba cái bẫy (vị chủng, rập khuôn) và cách viết, nói cho người nghe đa ngôn ngữ.',
  [[
    `<span class="eyebrow">SSB201 · Part 1 · Lesson 1.2</span>
<h2>Intercultural communication</h2>
<p class="lead"><strong>Culture</strong> is a shared system of symbols, beliefs, attitudes, values, expectations and norms for behaviour. Because every audience decodes messages through its own culture, the same words or gestures can carry different meanings for different people.</p>
<h3>Recognizing cultural variations</h3>
<table>
<tr><th>Dimension</th><th>One end</th><th>Other end</th></tr>
<tr><td>Context (Edward T. Hall)</td><td><strong>Low-context</strong>: meaning is carried mainly by explicit words; people value directness, detailed written agreements and getting to the point (often cited: the United States, Germany, the Nordic countries)</td><td><strong>High-context</strong>: meaning relies on relationships, setting, status and nonverbal cues; people value indirectness, harmony and trust built over time (often cited: Japan, China, Korea, Arab countries; Vietnam is usually described as relatively high-context)</td></tr>
<tr><td>Time (Hall)</td><td><strong>Monochronic</strong>: one task at a time, strict schedules and punctuality</td><td><strong>Polychronic</strong>: several tasks at once, flexible schedules, relationships placed above timetables</td></tr>
</table>
<p><strong>Hofstede's cultural dimensions</strong> offer another lens for comparing national cultures: <strong>power distance</strong> (how far less powerful members accept that power is distributed unequally), <strong>individualism vs collectivism</strong>, <strong>masculinity vs femininity</strong> (competition and achievement vs cooperation and quality of life), <strong>uncertainty avoidance</strong> (how comfortable people are with ambiguity), <strong>long-term vs short-term orientation</strong>, and <strong>indulgence vs restraint</strong>. These describe tendencies of a national average, never the character of an individual.</p>
<h3>Practical implications</h3>
<table>
<tr><th>Situation</th><th>Low-context, low power distance audience</th><th>High-context, high power distance audience</th></tr>
<tr><td>Opening a first meeting</td><td>Brief small talk, then the agenda</td><td>Invest time in building the relationship; show respect for seniority and titles</td></tr>
<tr><td>Saying no</td><td>A clear, polite "no" is acceptable</td><td>"No" is often signalled indirectly ("That may be difficult"); read the context</td></tr>
<tr><td>Agreements</td><td>The detailed written contract is the real agreement</td><td>The relationship and mutual trust matter as much as the document</td></tr>
<tr><td>Criticism and feedback</td><td>Direct feedback, sometimes in front of the group</td><td>Criticism given privately to protect face</td></tr>
</table>
<h3>Traps to avoid</h3>
<ul>
<li><strong>Ethnocentrism</strong> — judging other cultures by the standards of your own and assuming your own is superior.</li>
<li><strong>Stereotyping</strong> — assigning generalized attributes to an individual because of group membership. Use cultural dimensions as starting hypotheses, then observe the actual person in front of you.</li>
<li>The goal is <strong>cultural pluralism</strong>: accepting that multiple cultures have value on their own terms while working toward shared goals.</li>
</ul>
<p>Cultures also differ in social customs (greetings, gift-giving, dining), attitudes to age and hierarchy, gender roles, religion, and legal and ethical norms — for example, what counts as an acceptable gift or a conflict of interest.</p>
<h3>Writing and speaking for multilingual audiences</h3>
<ul>
<li>Use plain English: short sentences, common words, one idea per sentence and clear transitions (<em>first, however, therefore</em>).</li>
<li>Avoid idioms, slang, jargon and humour that do not translate ("ballpark figure", "touch base", "hit it out of the park").</li>
<li>Write dates, numbers and units unambiguously. "03/04/2026" means 3 April in Vietnam and the United Kingdom but March 4 in the United States — write "3 April 2026". Vietnamese uses a period as the thousands separator (1.500.000 đồng) where English uses a comma (VND 1,500,000).</li>
<li>For important documents, use professional translators and check with <strong>back-translation</strong> — translating the translation back into the original language to catch errors.</li>
<li>When speaking, slow down, articulate clearly and check understanding with open questions ("Which option would suit your team best?") rather than "Do you understand?", which often produces a polite "yes".</li>
</ul>
<div class="callout"><span class="badge">Case (fictional)</span> A buyer from a low-context culture emails a supplier from a high-context culture: "Can you deliver by 1 March? Yes or no." The supplier replies: "We will try our best." The buyer reads a yes; the supplier meant "probably not". A reply that works in any culture states facts: "We can deliver 70% of the order by 1 March and the remaining 30% by 15 March." Specific information bridges the context gap without forcing anyone to give a blunt refusal.</div>`,
    `<span class="eyebrow">SSB201 · Phần 1 · Bài 1.2</span>
<h2>Giao tiếp đa văn hoá</h2>
<p class="lead"><strong>Văn hoá</strong> là một hệ thống chung gồm biểu tượng, niềm tin, thái độ, giá trị, kỳ vọng và chuẩn mực hành vi. Vì mỗi người nhận đều giải mã thông điệp qua lăng kính văn hoá của mình, cùng một lời nói hay cử chỉ có thể mang nghĩa khác nhau với những người khác nhau.</p>
<h3>Nhận diện khác biệt văn hoá</h3>
<table>
<tr><th>Chiều</th><th>Một đầu</th><th>Đầu kia</th></tr>
<tr><td>Ngữ cảnh (Edward T. Hall)</td><td><strong>Ngữ cảnh thấp</strong>: ý nghĩa chủ yếu nằm trong lời nói tường minh; người ta coi trọng sự thẳng thắn, thoả thuận bằng văn bản chi tiết và đi thẳng vào vấn đề (thường được nêu: Mỹ, Đức, các nước Bắc Âu)</td><td><strong>Ngữ cảnh cao</strong>: ý nghĩa dựa vào quan hệ, hoàn cảnh, địa vị và tín hiệu phi ngôn ngữ; người ta coi trọng cách nói gián tiếp, sự hài hoà và lòng tin xây dựng theo thời gian (thường được nêu: Nhật Bản, Trung Quốc, Hàn Quốc, các nước Ả Rập; Việt Nam thường được mô tả là tương đối thiên về ngữ cảnh cao)</td></tr>
<tr><td>Thời gian (Hall)</td><td><strong>Đơn thời</strong>: làm từng việc một, lịch trình chặt chẽ, đúng giờ</td><td><strong>Đa thời</strong>: làm nhiều việc cùng lúc, lịch trình linh hoạt, đặt quan hệ lên trên thời gian biểu</td></tr>
</table>
<p><strong>Các chiều văn hoá của Hofstede</strong> là một lăng kính khác để so sánh văn hoá các quốc gia: <strong>khoảng cách quyền lực</strong> (mức độ những người ít quyền lực chấp nhận việc quyền lực phân bố không đều), <strong>chủ nghĩa cá nhân – chủ nghĩa tập thể</strong>, <strong>nam tính – nữ tính</strong> (cạnh tranh và thành tích so với hợp tác và chất lượng cuộc sống), <strong>né tránh bất định</strong> (mức độ chịu đựng sự mơ hồ), <strong>định hướng dài hạn – ngắn hạn</strong>, và <strong>tận hưởng – kiềm chế</strong>. Đây là xu hướng của mức trung bình quốc gia, không bao giờ là tính cách của một cá nhân cụ thể.</p>
<h3>Hàm ý thực tế</h3>
<table>
<tr><th>Tình huống</th><th>Người nhận thuộc văn hoá ngữ cảnh thấp, khoảng cách quyền lực thấp</th><th>Người nhận thuộc văn hoá ngữ cảnh cao, khoảng cách quyền lực cao</th></tr>
<tr><td>Mở đầu buổi gặp đầu tiên</td><td>Chào hỏi ngắn rồi vào chương trình</td><td>Dành thời gian xây dựng quan hệ; thể hiện sự tôn trọng thâm niên và chức danh</td></tr>
<tr><td>Nói "không"</td><td>Một lời từ chối rõ ràng, lịch sự là chấp nhận được</td><td>Lời từ chối thường được ngầm báo ("Việc này có lẽ hơi khó"); cần đọc ngữ cảnh</td></tr>
<tr><td>Thoả thuận</td><td>Hợp đồng chi tiết bằng văn bản mới là thoả thuận thực sự</td><td>Quan hệ và lòng tin lẫn nhau quan trọng không kém văn bản</td></tr>
<tr><td>Phê bình và góp ý</td><td>Góp ý thẳng, đôi khi ngay trước cả nhóm</td><td>Góp ý riêng để giữ thể diện</td></tr>
</table>
<h3>Những cái bẫy cần tránh</h3>
<ul>
<li><strong>Chủ nghĩa vị chủng</strong> — đánh giá văn hoá khác bằng chuẩn mực của văn hoá mình và cho rằng văn hoá mình ưu việt hơn.</li>
<li><strong>Rập khuôn</strong> — gán những đặc điểm khái quát cho một cá nhân chỉ vì họ thuộc một nhóm. Hãy dùng các chiều văn hoá như giả thuyết ban đầu, rồi quan sát chính con người đang đứng trước mặt bạn.</li>
<li>Mục tiêu là <strong>đa nguyên văn hoá</strong>: chấp nhận rằng mỗi nền văn hoá có giá trị riêng của nó, đồng thời cùng làm việc hướng tới mục tiêu chung.</li>
</ul>
<p>Các nền văn hoá còn khác nhau về phong tục xã giao (chào hỏi, tặng quà, ăn uống), thái độ với tuổi tác và thứ bậc, vai trò giới, tôn giáo, và chuẩn mực pháp lý, đạo đức — chẳng hạn thế nào là món quà chấp nhận được hay thế nào là xung đột lợi ích.</p>
<h3>Viết và nói cho người nhận đa ngôn ngữ</h3>
<ul>
<li>Dùng tiếng Anh giản dị: câu ngắn, từ thông dụng, mỗi câu một ý và từ nối rõ ràng (<em>first, however, therefore</em>).</li>
<li>Tránh thành ngữ, tiếng lóng, biệt ngữ và câu đùa khó dịch ("ballpark figure", "touch base", "hit it out of the park").</li>
<li>Viết ngày tháng, con số và đơn vị không thể hiểu nhầm. "03/04/2026" là ngày 3 tháng 4 ở Việt Nam và Anh nhưng là ngày 4 tháng 3 ở Mỹ — nên viết "3 April 2026". Tiếng Việt dùng dấu chấm phân cách hàng nghìn (1.500.000 đồng), còn tiếng Anh dùng dấu phẩy (VND 1,500,000).</li>
<li>Với tài liệu quan trọng, dùng người dịch chuyên nghiệp và kiểm tra bằng <strong>dịch ngược</strong> — dịch bản dịch trở lại ngôn ngữ gốc để phát hiện lỗi.</li>
<li>Khi nói, hãy chậm lại, phát âm rõ và kiểm tra mức hiểu bằng câu hỏi mở ("Phương án nào hợp với nhóm của anh/chị nhất?") thay vì "Anh/chị hiểu chứ?" — câu hỏi thường chỉ nhận về một chữ "vâng" lịch sự.</li>
</ul>
<div class="callout"><span class="badge">Tình huống giả định</span> Một người mua thuộc văn hoá ngữ cảnh thấp gửi email cho nhà cung cấp thuộc văn hoá ngữ cảnh cao: "Bên anh giao hàng trước ngày 1/3 được không? Có hay không?" Nhà cung cấp trả lời: "Chúng tôi sẽ cố gắng hết sức." Người mua hiểu là "có"; nhà cung cấp lại muốn nói "có lẽ không kịp". Một câu trả lời hiệu quả ở mọi nền văn hoá là nêu sự thật: "Chúng tôi giao được 70% đơn hàng trước ngày 1/3 và 30% còn lại trước ngày 15/3." Thông tin cụ thể bắc cầu qua khoảng cách ngữ cảnh mà không buộc ai phải từ chối thẳng thừng.</div>`,
  ]]);

const q1 = quiz('ssb201-quiz-1', 'Quiz 1 — Interpersonal & intercultural communication|||Quiz 1 — Giao tiếp liên cá nhân & đa văn hoá', [
  { id: 'q1', question: 'During a meeting, a manager lets a colleague finish, then says: “So your main concern is the deadline, not the budget?” This is an example of…|||Trong cuộc họp, một quản lý để đồng nghiệp nói hết rồi hỏi: “Vậy mối lo chính của anh là thời hạn, chứ không phải ngân sách?” Đây là ví dụ của…', options: ['selective listening|||nghe có chọn lọc', 'active listening|||lắng nghe chủ động', 'prejudgment|||định kiến về người nói', 'filtering|||hiện tượng sàng lọc thông tin'], correctIndex: 1, explanation: 'Paraphrasing and asking a clarifying question are the core techniques of active listening; selective listening and prejudgment are barriers.|||Diễn đạt lại và hỏi để làm rõ là kỹ thuật cốt lõi của lắng nghe chủ động; nghe có chọn lọc và định kiến là rào cản.' },
  { id: 'q2', question: 'In a high-context culture, business partners are most likely to…|||Trong văn hoá ngữ cảnh cao, đối tác kinh doanh nhiều khả năng sẽ…', options: ['treat the detailed written contract as the only real agreement|||coi hợp đồng chi tiết bằng văn bản là thoả thuận thực sự duy nhất', 'expect you to get straight to the point at the first meeting|||mong bạn đi thẳng vào vấn đề ngay buổi gặp đầu', 'prefer blunt feedback given in front of the group|||thích được góp ý thẳng thừng trước cả nhóm', 'read meaning from the relationship, the setting and nonverbal cues|||đọc ý nghĩa từ quan hệ, hoàn cảnh và tín hiệu phi ngôn ngữ'], correctIndex: 3, explanation: 'In high-context cultures much of the meaning lies outside the explicit words; the other three options describe low-context preferences.|||Ở văn hoá ngữ cảnh cao, phần lớn ý nghĩa nằm ngoài lời nói tường minh; ba phương án kia mô tả xu hướng của văn hoá ngữ cảnh thấp.' },
  { id: 'q3', question: 'A team approves a risky plan because no one wants to be the only person who disagrees. This is…|||Một nhóm thông qua một kế hoạch rủi ro vì không ai muốn là người duy nhất phản đối. Đây là…', options: ['groupthink|||tư duy nhóm', 'a hidden agenda|||mục đích ngầm', 'free riding|||hiện tượng ăn theo', 'the forming stage|||giai đoạn hình thành'], correctIndex: 0, explanation: 'Groupthink is pressure to conform that suppresses dissent and leads to poor decisions; inviting a devil’s advocate or anonymous input helps prevent it.|||Tư duy nhóm là áp lực đồng thuận làm nén ý kiến trái chiều và dẫn tới quyết định kém; cử người phản biện hoặc thu ý kiến ẩn danh giúp phòng tránh.' },
]);

const c3 = doc('ssb201-2-1-writing-process', '2.1 — The three-step writing process & effective style|||2.1 — Quy trình viết ba bước & văn phong hiệu quả',
  'Quy trình lập kế hoạch – soạn thảo – hoàn thiện (và quy trình 3-x-3), xác định mục đích và người nhận, chọn phương tiện, chọn cách trực tiếp hay gián tiếp; quan điểm hướng về người đọc, nhấn mạnh tích cực, ngôn ngữ không thiên kiến, thể chủ động – bị động, viết súc tích, dễ đọc và soát lỗi.',
  [[
    `<span class="eyebrow">SSB201 · Part 2 · Lesson 2.1</span>
<h2>The three-step writing process &amp; effective style</h2>
<p class="lead">Good business writing is less a talent than a process. Textbooks describe it as three steps — <strong>plan, write, complete</strong> (Bovée &amp; Thill) — or as the similar "3-x-3" process of <strong>prewriting, drafting and revising</strong> (Guffey). A common rule of thumb is to spend roughly half of your time planning, a quarter writing and a quarter completing.</p>
<h3>Step 1 — Plan</h3>
<ol>
<li><strong>Analyse the situation.</strong> Define your general purpose (to inform, persuade or collaborate) and your specific purpose: what should the audience think or do after reading? Build an audience profile — who they are, what they already know, how they will react.</li>
<li><strong>Gather information</strong> the audience needs, and check every fact and figure.</li>
<li><strong>Choose the medium.</strong> Rich media (face-to-face, video calls) suit complex, sensitive or emotional messages; leaner media (email, memo, messaging) suit routine information that needs a record. Also weigh urgency, cost, formality, privacy and the audience's preferences.</li>
<li><strong>Organize.</strong> State your main idea in one or two sentences, limit the scope to what the audience needs, choose the approach and outline the content.</li>
</ol>
<table>
<tr><th>Expected audience reaction</th><th>Approach</th><th>Structure</th></tr>
<tr><td>Eager, interested, pleased or neutral</td><td><strong>Direct</strong> (deductive)</td><td>Main idea first, then details, then a courteous close</td></tr>
<tr><td>Displeased, uninterested or unwilling</td><td><strong>Indirect</strong> (inductive)</td><td>Context and reasons first, then the main idea (the bad news or the request), then a positive close</td></tr>
</table>
<h3>Step 2 — Write: adapt to the audience</h3>
<table>
<tr><th>Principle</th><th>Weak</th><th>Better</th></tr>
<tr><td><strong>You-attitude</strong> — the reader's perspective and benefits</td><td>We are pleased to announce that we have extended our opening hours.</td><td>You can now shop with us until 10 p.m. every day.</td></tr>
<tr><td><strong>Positive emphasis</strong></td><td>We cannot process your refund until you send the receipt.</td><td>We will process your refund as soon as we receive your receipt.</td></tr>
<tr><td><strong>Politeness</strong></td><td>You failed to attach the file.</td><td>The file does not seem to be attached — could you send it again?</td></tr>
<tr><td><strong>Bias-free language</strong></td><td>Each manager should submit his report. / chairman / a woman engineer</td><td>Managers should submit their reports. / chair / an engineer (mention gender only when relevant)</td></tr>
<tr><td><strong>Plain language</strong></td><td>Please be advised that the aforementioned invoice remains outstanding.</td><td>Invoice 1043 is still unpaid.</td></tr>
</table>
<p><strong>Active and passive voice.</strong> Prefer the active voice — it is shorter, clearer and names who acts ("The finance team approved the budget"). Use the passive deliberately when the actor is unknown or unimportant, or to soften bad news and avoid blame ("Two invoices were miscalculated" rather than "You miscalculated two invoices").</p>
<p><strong>A conversational, confident tone.</strong> Write the way a knowledgeable professional speaks: neither stiff ("herewith", "kindly be informed") nor too casual (slang, emoji in formal messages). Build credibility with accurate facts, and choose <strong>concrete words</strong> ("by 5 p.m. Friday") over abstract ones ("soon").</p>
<h3>Step 3 — Complete: revise, produce, proofread, distribute</h3>
<p><strong>Revise for content and organization first</strong> — is the main idea clear and, in a direct message, early? Is everything relevant? Then <strong>edit for clarity and conciseness</strong>:</p>
<table>
<tr><th>Wordy</th><th>Concise</th></tr>
<tr><td>due to the fact that</td><td>because</td></tr>
<tr><td>at this point in time</td><td>now</td></tr>
<tr><td>in the event that</td><td>if</td></tr>
<tr><td>we would like to take this opportunity to thank you</td><td>thank you</td></tr>
<tr><td>the reason why is that</td><td>because</td></tr>
<tr><td>end result, past history, advance planning</td><td>result, history, planning</td></tr>
</table>
<ul>
<li><strong>Improve readability</strong>: short paragraphs, informative headings, bulleted or numbered lists for parallel items, and parallel grammatical structure ("plan, write, complete" — not "planning, write, and the completion"). Readability formulas such as the Flesch–Kincaid grade level give a rough check, not a verdict.</li>
<li><strong>Produce</strong>: consistent layout, white space, and fonts that are easy to read on screens and in print.</li>
<li><strong>Proofread</strong>: take a break first, read slowly (aloud if possible), and check names, numbers, dates and attachments in a separate pass; spell-checkers do not catch a wrong but correctly spelled word.</li>
<li><strong>Distribute</strong>: the right recipients, format and timing; check file permissions and confidentiality.</li>
</ul>
<div class="callout"><span class="badge">Test</span> Before sending, ask: "If the reader reads only the subject line and the first two sentences, will they know what I want and by when?"</div>`,
    `<span class="eyebrow">SSB201 · Phần 2 · Bài 2.1</span>
<h2>Quy trình viết ba bước &amp; văn phong hiệu quả</h2>
<p class="lead">Viết tốt trong kinh doanh là một quy trình hơn là năng khiếu. Các giáo trình mô tả nó thành ba bước — <strong>lập kế hoạch, soạn thảo, hoàn thiện</strong> (Bovée &amp; Thill) — hoặc thành quy trình "3-x-3" tương tự gồm <strong>chuẩn bị viết, viết nháp và chỉnh sửa</strong> (Guffey). Một quy tắc kinh nghiệm phổ biến là dành khoảng một nửa thời gian để lập kế hoạch, một phần tư để viết và một phần tư để hoàn thiện.</p>
<h3>Bước 1 — Lập kế hoạch</h3>
<ol>
<li><strong>Phân tích tình huống.</strong> Xác định mục đích chung (thông tin, thuyết phục hay hợp tác) và mục đích cụ thể: sau khi đọc, người nhận nên nghĩ gì hoặc làm gì? Lập chân dung người nhận — họ là ai, đã biết gì, sẽ phản ứng thế nào.</li>
<li><strong>Thu thập thông tin</strong> người nhận cần, và kiểm tra lại mọi dữ kiện, con số.</li>
<li><strong>Chọn phương tiện.</strong> Phương tiện "giàu" (gặp trực tiếp, gọi video) hợp với thông điệp phức tạp, nhạy cảm hoặc nhiều cảm xúc; phương tiện "nghèo" hơn (email, thư báo nội bộ, tin nhắn) hợp với thông tin thường ngày cần lưu vết. Cân nhắc thêm mức khẩn cấp, chi phí, mức trang trọng, tính riêng tư và thói quen của người nhận.</li>
<li><strong>Tổ chức nội dung.</strong> Viết ý chính trong một hai câu, giới hạn phạm vi ở những gì người nhận cần, chọn cách tiếp cận và lập dàn ý.</li>
</ol>
<table>
<tr><th>Phản ứng dự kiến của người nhận</th><th>Cách tiếp cận</th><th>Cấu trúc</th></tr>
<tr><td>Háo hức, quan tâm, vui vẻ hoặc trung lập</td><td><strong>Trực tiếp</strong> (diễn dịch)</td><td>Ý chính trước, rồi chi tiết, rồi lời kết lịch sự</td></tr>
<tr><td>Không vui, không quan tâm hoặc không sẵn lòng</td><td><strong>Gián tiếp</strong> (quy nạp)</td><td>Bối cảnh và lý do trước, rồi ý chính (tin xấu hoặc lời đề nghị), rồi lời kết tích cực</td></tr>
</table>
<h3>Bước 2 — Soạn thảo: điều chỉnh theo người nhận</h3>
<table>
<tr><th>Nguyên tắc</th><th>Chưa tốt</th><th>Tốt hơn</th></tr>
<tr><td><strong>Hướng về người đọc</strong> (you-attitude) — góc nhìn và lợi ích của người đọc</td><td>Chúng tôi vui mừng thông báo rằng chúng tôi đã kéo dài giờ mở cửa.</td><td>Từ nay anh/chị có thể mua sắm tại cửa hàng đến 22 giờ mỗi ngày.</td></tr>
<tr><td><strong>Nhấn mạnh tích cực</strong></td><td>Chúng tôi không thể hoàn tiền cho tới khi anh/chị gửi hoá đơn.</td><td>Chúng tôi sẽ hoàn tiền ngay khi nhận được hoá đơn của anh/chị.</td></tr>
<tr><td><strong>Lịch sự</strong></td><td>Anh đã quên đính kèm tệp.</td><td>Hình như tệp chưa được đính kèm — anh gửi lại giúp em được không?</td></tr>
<tr><td><strong>Ngôn ngữ không thiên kiến</strong></td><td>Mỗi trưởng phòng cần nộp báo cáo của anh ấy. / "nữ kỹ sư Lan"</td><td>Các trưởng phòng cần nộp báo cáo. / "kỹ sư Lan" (chỉ nêu giới tính khi thật sự liên quan)</td></tr>
<tr><td><strong>Ngôn ngữ giản dị</strong></td><td>Xin trân trọng thông báo để Quý vị được rõ rằng hoá đơn nói trên hiện vẫn chưa được thanh toán.</td><td>Hoá đơn số 1043 vẫn chưa được thanh toán.</td></tr>
</table>
<p><strong>Thể chủ động và bị động.</strong> Ưu tiên thể chủ động — ngắn hơn, rõ hơn và nêu rõ ai hành động ("Phòng Tài chính đã duyệt ngân sách"). Dùng thể bị động có chủ ý khi không biết hoặc không cần nêu người thực hiện, hoặc để làm mềm tin xấu và tránh quy lỗi ("Hai hoá đơn đã bị tính sai" thay vì "Anh đã tính sai hai hoá đơn").</p>
<p><strong>Giọng văn tự nhiên, tự tin.</strong> Viết như cách một người làm nghề am hiểu nói chuyện: không cứng nhắc, sáo rỗng ("nay kính báo để Quý vị được biết") cũng không suồng sã (tiếng lóng, biểu tượng cảm xúc trong thư trang trọng). Tạo uy tín bằng dữ kiện chính xác, và chọn <strong>từ ngữ cụ thể</strong> ("trước 17 giờ thứ Sáu") thay cho từ trừu tượng ("sớm").</p>
<h3>Bước 3 — Hoàn thiện: chỉnh sửa, trình bày, soát lỗi, gửi đi</h3>
<p><strong>Trước hết sửa nội dung và bố cục</strong> — ý chính đã rõ và, với thông điệp trực tiếp, đã nằm ở đầu chưa? Mọi thứ có liên quan không? Sau đó <strong>biên tập cho rõ ràng và súc tích</strong>:</p>
<table>
<tr><th>Dài dòng</th><th>Súc tích</th></tr>
<tr><td>do bởi thực tế là</td><td>vì</td></tr>
<tr><td>vào thời điểm hiện tại này</td><td>hiện nay</td></tr>
<tr><td>trong trường hợp nếu như</td><td>nếu</td></tr>
<tr><td>chúng tôi xin phép được nhân cơ hội này để gửi lời cảm ơn</td><td>xin cảm ơn</td></tr>
<tr><td>lý do tại sao là bởi vì</td><td>vì</td></tr>
<tr><td>kết quả cuối cùng, lịch sử quá khứ, lên kế hoạch trước</td><td>kết quả, lịch sử, lên kế hoạch</td></tr>
</table>
<ul>
<li><strong>Tăng độ dễ đọc</strong>: đoạn ngắn, tiêu đề mang thông tin, danh sách gạch đầu dòng hoặc đánh số cho các ý song song, và cấu trúc ngữ pháp song hành ("lập kế hoạch, soạn thảo, hoàn thiện" — không phải "lập kế hoạch, viết, và việc hoàn thiện"). Các công thức đo độ dễ đọc như Flesch–Kincaid (cho tiếng Anh) chỉ để kiểm tra sơ bộ, không phải phán quyết.</li>
<li><strong>Trình bày</strong>: bố cục nhất quán, khoảng trắng hợp lý, phông chữ dễ đọc trên màn hình và khi in.</li>
<li><strong>Soát lỗi</strong>: nghỉ một lát trước khi soát, đọc chậm (đọc thành tiếng nếu được), và kiểm tra riêng một lượt cho tên người, con số, ngày tháng và tệp đính kèm; công cụ kiểm tra chính tả không bắt được một từ viết đúng chính tả nhưng dùng sai.</li>
<li><strong>Gửi đi</strong>: đúng người nhận, đúng định dạng, đúng thời điểm; kiểm tra quyền truy cập tệp và tính bảo mật.</li>
</ul>
<div class="callout"><span class="badge">Phép thử</span> Trước khi gửi, hãy tự hỏi: "Nếu người nhận chỉ đọc tiêu đề và hai câu đầu tiên, họ có biết tôi muốn gì và trước hạn nào không?"</div>`,
  ]]);

const c4 = doc('ssb201-2-2-routine-messages', '2.2 — Routine & good-news messages: email, memos & letters|||2.2 — Thông điệp thường ngày & tin tốt: email, thư báo nội bộ & thư',
  'Cấu trúc trực tiếp cho lời đề nghị thường ngày, thư trả lời và tin tốt; chấp nhận khiếu nại, thư giới thiệu, hướng dẫn, thư thiện chí; quy ước trình bày email, thư báo nội bộ (memo), thư thương mại, tin nhắn và mạng xã hội; phép lịch sự khi dùng email.',
  [[
    `<span class="eyebrow">SSB201 · Part 2 · Lesson 2.2</span>
<h2>Routine &amp; good-news messages: email, memos &amp; letters</h2>
<p class="lead">Most workplace messages are routine: requests, replies, announcements and thanks. Because the audience is interested or neutral, use the <strong>direct approach</strong> — main idea first.</p>
<h3>Routine requests</h3>
<ol>
<li><strong>State the request or main idea</strong> politely but directly ("Could you please send…"). If you have several questions, ask the most important one first.</li>
<li><strong>Explain and justify</strong>: give the reason and the details the reader needs to respond; number multiple questions so each gets an answer.</li>
<li><strong>Request specific action in a courteous close</strong>: what, by when, and why the date matters; add contact details and thanks.</li>
</ol>
<h3>Routine replies and positive messages</h3>
<p>Open with the main idea or the good news ("Your application for the leadership programme has been approved"), follow with the necessary details and explanation, and close courteously — often with a forward-looking note or a word of resale about the product or service.</p>
<table>
<tr><th>Message</th><th>Key points</th></tr>
<tr><td>Granting a claim when the company is at fault</td><td>Say yes first; explain briefly what went wrong and how it will be prevented; a sincere apology is appropriate, without over-dramatic language; restore confidence in the product or service</td></tr>
<tr><td>Recommendation or reference</td><td>Name the candidate and your relationship; give specific, verifiable evidence; stay honest — inflated recommendations damage your own credibility</td></tr>
<tr><td>Instructions</td><td>Numbered steps in logical order, one action per step, imperative verbs ("Click Save"), and warnings placed <em>before</em> the step they concern</td></tr>
<tr><td>Good-news announcement</td><td>The news first, then who is affected and how, then the next steps</td></tr>
<tr><td>Goodwill messages (congratulations, appreciation, condolences)</td><td>Prompt, sincere and specific; never mixed with a sales pitch; condolences short and personal</td></tr>
</table>
<h3>Formats and conventions</h3>
<table>
<tr><th>Format</th><th>Conventions</th></tr>
<tr><td>Email</td><td>An informative <strong>subject line</strong> ("Meeting moved to 3 p.m. Thursday", not "Meeting"); a greeting; the main point in the first paragraph; one topic per message; a signature block with name, title and contact details</td></tr>
<tr><td>Memo (internal)</td><td>Headings TO / FROM / DATE / SUBJECT; no salutation or complimentary close; used for internal announcements and records</td></tr>
<tr><td>Business letter (external, formal)</td><td>Letterhead, date, inside address, salutation, body, complimentary close, signature block; used when formality or a written record matters. In Vietnam, official documents of state agencies follow the layout set by Decree 30/2020/ND-CP on clerical work (check the version in force), and many companies use a similar layout for their official letters</td></tr>
<tr><td>Instant messaging and team chat</td><td>Short, quick exchanges; unsuitable for confidential, complex or emotional topics; respect colleagues' working hours</td></tr>
<tr><td>Company social media</td><td>Conversational but professional; respond promptly; never post anything you would not want quoted publicly</td></tr>
</table>
<h3>Email etiquette checklist</h3>
<ul>
<li>Use <em>Reply all</em> only when everyone needs your reply; use BCC to protect recipients' addresses in mass emails.</li>
<li>Do not write or send messages in anger — wait, reread, then decide.</li>
<li>Check names, attachments and the recipient list before clicking Send.</li>
<li>Remember that business email is not private: it can be forwarded, archived and used as evidence.</li>
</ul>
<div class="callout"><span class="badge">Example</span> Subject: <em>Approved: your training request for the Excel course (12–13 November)</em>. The reader knows the answer before even opening the message — that is the direct approach at work.</div>`,
    `<span class="eyebrow">SSB201 · Phần 2 · Bài 2.2</span>
<h2>Thông điệp thường ngày &amp; tin tốt: email, thư báo nội bộ &amp; thư</h2>
<p class="lead">Phần lớn thông điệp nơi công sở là thông điệp thường ngày: đề nghị, trả lời, thông báo và cảm ơn. Vì người nhận quan tâm hoặc trung lập, hãy dùng <strong>cách trực tiếp</strong> — ý chính trước.</p>
<h3>Lời đề nghị thường ngày</h3>
<ol>
<li><strong>Nêu lời đề nghị hoặc ý chính</strong> một cách lịch sự nhưng thẳng ("Anh/chị vui lòng gửi giúp…"). Nếu có nhiều câu hỏi, hỏi câu quan trọng nhất trước.</li>
<li><strong>Giải thích và nêu lý do</strong>: đưa lý do và những chi tiết người nhận cần để trả lời; đánh số các câu hỏi để câu nào cũng được trả lời.</li>
<li><strong>Đề nghị hành động cụ thể trong lời kết lịch sự</strong>: làm gì, trước hạn nào, và vì sao hạn đó quan trọng; kèm thông tin liên hệ và lời cảm ơn.</li>
</ol>
<h3>Thư trả lời thường ngày và thông điệp tích cực</h3>
<p>Mở đầu bằng ý chính hoặc tin tốt ("Đơn đăng ký chương trình đào tạo lãnh đạo của anh đã được phê duyệt"), tiếp theo là chi tiết và giải thích cần thiết, rồi kết thúc lịch sự — thường bằng một câu hướng tới tương lai hoặc một lời nhắc lại giá trị của sản phẩm, dịch vụ.</p>
<table>
<tr><th>Loại thông điệp</th><th>Điểm mấu chốt</th></tr>
<tr><td>Chấp nhận khiếu nại khi lỗi thuộc về công ty</td><td>Nói "đồng ý" trước; giải thích ngắn gọn điều gì đã xảy ra và sẽ phòng ngừa thế nào; một lời xin lỗi chân thành là phù hợp, không cần ngôn từ bi thảm; khôi phục niềm tin vào sản phẩm, dịch vụ</td></tr>
<tr><td>Thư giới thiệu, thư xác nhận</td><td>Nêu tên ứng viên và quan hệ của bạn với họ; đưa bằng chứng cụ thể, kiểm chứng được; giữ trung thực — thư giới thiệu thổi phồng làm hại chính uy tín của bạn</td></tr>
<tr><td>Hướng dẫn</td><td>Các bước đánh số theo trình tự hợp lý, mỗi bước một thao tác, dùng động từ mệnh lệnh ("Nhấn Lưu"), và đặt cảnh báo <em>trước</em> bước liên quan</td></tr>
<tr><td>Thông báo tin tốt</td><td>Tin tức trước, rồi ai chịu ảnh hưởng và ảnh hưởng thế nào, rồi các bước tiếp theo</td></tr>
<tr><td>Thư thiện chí (chúc mừng, cảm ơn, chia buồn)</td><td>Kịp thời, chân thành và cụ thể; không bao giờ lồng chào hàng; thư chia buồn ngắn gọn và mang tính cá nhân</td></tr>
</table>
<h3>Định dạng và quy ước</h3>
<table>
<tr><th>Định dạng</th><th>Quy ước</th></tr>
<tr><td>Email</td><td><strong>Tiêu đề</strong> mang thông tin ("Cuộc họp dời sang 15 giờ thứ Năm", không phải "Họp"); lời chào; ý chính ở đoạn đầu; mỗi email một chủ đề; khối chữ ký gồm tên, chức danh và thông tin liên hệ</td></tr>
<tr><td>Thư báo nội bộ (memo)</td><td>Các dòng GỬI / TỪ / NGÀY / V/V (về việc); không có lời chào đầu thư và câu chào cuối thư; dùng cho thông báo và lưu hồ sơ nội bộ</td></tr>
<tr><td>Thư thương mại (gửi ra ngoài, trang trọng)</td><td>Tiêu đề thư của công ty, ngày tháng, tên và địa chỉ người nhận, lời chào, nội dung, câu chào cuối thư, khối chữ ký; dùng khi cần trang trọng hoặc cần văn bản lưu vết. Ở Việt Nam, văn bản hành chính của cơ quan nhà nước theo thể thức quy định tại Nghị định 30/2020/NĐ-CP về công tác văn thư (kiểm văn bản đang có hiệu lực), và nhiều doanh nghiệp dùng bố cục tương tự cho công văn của mình</td></tr>
<tr><td>Tin nhắn và chat nhóm</td><td>Trao đổi ngắn, nhanh; không phù hợp với chủ đề bảo mật, phức tạp hoặc nhiều cảm xúc; tôn trọng giờ làm việc của đồng nghiệp</td></tr>
<tr><td>Mạng xã hội của công ty</td><td>Gần gũi nhưng chuyên nghiệp; phản hồi nhanh; không bao giờ đăng điều bạn không muốn bị trích dẫn công khai</td></tr>
</table>
<h3>Danh sách kiểm tra phép lịch sự khi dùng email</h3>
<ul>
<li>Chỉ dùng <em>Trả lời tất cả</em> khi mọi người đều cần câu trả lời của bạn; dùng BCC để bảo vệ địa chỉ người nhận khi gửi hàng loạt.</li>
<li>Đừng viết hoặc gửi thư khi đang tức giận — hãy chờ, đọc lại rồi mới quyết định.</li>
<li>Kiểm tra tên, tệp đính kèm và danh sách người nhận trước khi bấm Gửi.</li>
<li>Nhớ rằng email công việc không phải chuyện riêng tư: nó có thể bị chuyển tiếp, lưu trữ và dùng làm bằng chứng.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ</span> Tiêu đề: <em>Đã duyệt: đề nghị tham gia khoá Excel của anh (12–13/11)</em>. Người nhận biết câu trả lời ngay cả trước khi mở thư — đó chính là cách trực tiếp.</div>`,
  ]]);

const e1 = doc('ssb201-2-3-exercise', 'Exercise 1 — Rewriting a weak request email|||Bài tập 1 — Viết lại một email đề nghị kém hiệu quả',
  'Bài tập tình huống giả định: chẩn đoán lỗi của một email xin báo giá dài dòng, hướng về người viết, rồi viết lại theo cách trực tiếp; kèm bản viết mẫu EN/VI và bảng phân tích từng thay đổi.',
  [[
    `<span class="eyebrow">SSB201 · Part 2 · Exercise 1</span>
<h2>Exercise 1 — from a weak email to a clear request</h2>
<div class="callout"><span class="badge">Problem</span> Linh, a purchasing officer at Blue Lotus Trading (a fictional company), needs a quotation for 120 ergonomic office chairs for the company's new office in Ho Chi Minh City. The chairs must arrive by 16 November 2026, and she needs replies by 19 October to choose a supplier that week. Below is her first draft to a supplier. (a) List at least five weaknesses. (b) Rewrite the email using the direct approach.</div>
<pre><code class="language-text">Subject: Chairs

Dear Sir/Madam,

I am writing this email to you in order to introduce myself. My name is Linh
and I work in the Purchasing Department of Blue Lotus Trading. As you may or
may not know, our company has been growing very quickly over the past few
years, and at this point in time we are in the process of moving to a new
office, which is something we have been planning for a long time. Due to the
fact that we will have more staff, we will need some chairs. We were wondering
if it might be possible for you to perhaps send us some information about your
chairs and prices at your earliest convenience. We would also like to know
about delivery.

Please do not hesitate to contact me if you have any questions.

Best regards,
Linh</code></pre>
<h3>Model answer</h3>
<pre><code class="language-text">Subject: Request for quotation: 120 ergonomic office chairs, reply by 19 October

Dear Delta Office Furniture sales team,

Could you please send us a quotation for 120 ergonomic office chairs,
delivered to our new office in Ho Chi Minh City by Monday, 16 November 2026?

Blue Lotus Trading is moving to a larger office and is comparing three
suppliers. For each model you recommend, please include:

1. The unit price for an order of 120 chairs, including VAT
2. The warranty period and what it covers
3. Your earliest delivery date and the delivery cost
4. Whether you can lend us one sample chair for a one-week trial

A reply by Monday, 19 October, would allow us to choose a supplier and
place the order the same week.

Thank you for your help.

Best regards,
Tran Thi Linh
Purchasing Officer, Blue Lotus Trading</code></pre>
<table>
<tr><th>Weakness in the draft</th><th>Fix in the model answer</th></tr>
<tr><td>Vague subject line ("Chairs")</td><td>The subject states the action, quantity and deadline</td></tr>
<tr><td>The request is buried in the fourth sentence, after self-introduction and company history</td><td>Direct approach: the request is the first sentence</td></tr>
<tr><td>Wordy, hedging phrases ("at this point in time", "due to the fact that", "we were wondering if it might be possible for you to perhaps")</td><td>"Could you please…" — polite and direct</td></tr>
<tr><td>No specifics: "some chairs", "some information", "about delivery"</td><td>Exact quantity, type and delivery date; four numbered questions the supplier can answer one by one</td></tr>
<tr><td>"At your earliest convenience" sets no deadline</td><td>A specific reply date with the reason it matters</td></tr>
<tr><td>Cliché close ("Please do not hesitate…") and an incomplete signature</td><td>A short thank-you and a full signature block with name, title and company</td></tr>
</table>
<p><strong>Why:</strong> both versions are roughly the same length (about 140 and 130 words), yet the draft gives the supplier none of the facts needed to quote, while the revision contains all of them. Conciseness is not only about cutting words — it is about making every word carry useful information. Mentioning that three suppliers are being compared is honest and gently encourages a fast, competitive reply.</p>`,
    `<span class="eyebrow">SSB201 · Phần 2 · Bài tập 1</span>
<h2>Bài tập 1 — từ một email kém hiệu quả tới một lời đề nghị rõ ràng</h2>
<div class="callout"><span class="badge">Đề</span> Linh là chuyên viên mua hàng của Công ty Blue Lotus (công ty giả định), cần báo giá cho 120 ghế văn phòng công thái học cho văn phòng mới của công ty tại TP. Hồ Chí Minh. Ghế phải được giao trước ngày 16/11/2026, và Linh cần nhận phản hồi trước ngày 19/10 để chọn nhà cung cấp ngay trong tuần đó. Dưới đây là bản nháp đầu tiên Linh định gửi cho một nhà cung cấp. (a) Liệt kê ít nhất năm điểm yếu. (b) Viết lại email theo cách trực tiếp.</div>
<pre><code class="language-text">Tiêu đề: Ghế

Kính gửi Quý công ty,

Tôi viết email này để tự giới thiệu về bản thân mình. Tôi tên là Linh, hiện
đang làm việc tại Phòng Mua hàng của Công ty Blue Lotus. Như Quý công ty có thể
đã biết hoặc chưa biết, công ty chúng tôi đã phát triển rất nhanh trong mấy năm
vừa qua, và vào thời điểm hiện tại này chúng tôi đang trong quá trình chuyển
đến văn phòng mới, là việc mà chúng tôi đã lên kế hoạch từ lâu. Do bởi thực tế
là chúng tôi sẽ có thêm nhân sự nên chúng tôi sẽ cần một số ghế. Chúng tôi
không biết liệu Quý công ty có thể vui lòng gửi cho chúng tôi một vài thông tin
về ghế và giá cả vào lúc nào thuận tiện nhất hay không. Chúng tôi cũng muốn
biết về việc giao hàng.

Nếu có bất kỳ câu hỏi nào, xin đừng ngần ngại liên hệ với tôi.

Trân trọng,
Linh</code></pre>
<h3>Lời giải mẫu</h3>
<pre><code class="language-text">Tiêu đề: Đề nghị báo giá 120 ghế văn phòng công thái học – xin phản hồi trước 19/10

Kính gửi Phòng Kinh doanh Công ty Nội thất Văn phòng Delta,

Công ty Blue Lotus đề nghị Quý công ty gửi báo giá 120 ghế văn phòng công thái
học, giao đến văn phòng mới của chúng tôi tại TP. Hồ Chí Minh trước thứ Hai,
ngày 16/11/2026.

Chúng tôi đang chuyển sang văn phòng rộng hơn và đang so sánh ba nhà cung cấp.
Với mỗi mẫu ghế Quý công ty đề xuất, xin cho biết:

1. Đơn giá khi đặt 120 ghế, đã bao gồm thuế GTGT
2. Thời hạn bảo hành và phạm vi bảo hành
3. Ngày giao hàng sớm nhất và chi phí vận chuyển
4. Quý công ty có thể cho mượn một ghế mẫu để dùng thử trong một tuần không

Nếu nhận được phản hồi trước thứ Hai, ngày 19/10, chúng tôi có thể chọn nhà
cung cấp và đặt hàng ngay trong tuần đó.

Xin cảm ơn sự hỗ trợ của Quý công ty.

Trân trọng,
Trần Thị Linh
Chuyên viên Mua hàng, Công ty Blue Lotus</code></pre>
<table>
<tr><th>Điểm yếu của bản nháp</th><th>Cách sửa trong lời giải mẫu</th></tr>
<tr><td>Tiêu đề mơ hồ ("Ghế")</td><td>Tiêu đề nêu rõ việc cần làm, số lượng và hạn chót</td></tr>
<tr><td>Lời đề nghị bị chôn ở câu thứ tư, sau phần tự giới thiệu và lịch sử công ty</td><td>Cách trực tiếp: lời đề nghị nằm ngay câu đầu tiên</td></tr>
<tr><td>Cụm từ dài dòng, rào đón ("vào thời điểm hiện tại này", "do bởi thực tế là", "không biết liệu Quý công ty có thể vui lòng… hay không")</td><td>"Đề nghị Quý công ty gửi…" — lịch sự mà thẳng</td></tr>
<tr><td>Không cụ thể: "một số ghế", "một vài thông tin", "về việc giao hàng"</td><td>Số lượng, loại ghế và ngày giao chính xác; bốn câu hỏi đánh số để nhà cung cấp trả lời lần lượt</td></tr>
<tr><td>"Vào lúc nào thuận tiện nhất" không đặt hạn chót</td><td>Một ngày phản hồi cụ thể kèm lý do vì sao ngày đó quan trọng</td></tr>
<tr><td>Lời kết sáo mòn ("xin đừng ngần ngại…") và chữ ký thiếu thông tin</td><td>Lời cảm ơn ngắn và khối chữ ký đầy đủ họ tên, chức danh, công ty</td></tr>
</table>
<p><strong>Vì sao:</strong> hai bản dài gần bằng nhau (bản tiếng Anh khoảng 140 và 130 từ), nhưng bản nháp không cho nhà cung cấp dữ kiện nào để báo giá, còn bản viết lại có đủ tất cả. Súc tích không chỉ là cắt bớt chữ — mà là để mỗi chữ đều mang thông tin hữu ích. Việc nói rõ đang so sánh ba nhà cung cấp là trung thực và khéo léo khuyến khích bên nhận trả lời nhanh, với giá cạnh tranh.</p>`,
  ]]);

const q2 = quiz('ssb201-quiz-2', 'Quiz 2 — Writing process & routine messages|||Quiz 2 — Quy trình viết & thông điệp thường ngày', [
  { id: 'q1', question: 'Your audience is likely to be pleased or neutral about your message. Which approach should you use?|||Người nhận nhiều khả năng sẽ vui hoặc trung lập với thông điệp của bạn. Nên dùng cách tiếp cận nào?', options: ['Indirect: reasons first, main idea later|||Gián tiếp: lý do trước, ý chính sau', 'Direct: main idea first, then details and a courteous close|||Trực tiếp: ý chính trước, rồi chi tiết và lời kết lịch sự', 'Buffer, reasons, bad news, positive close|||Đoạn đệm, lý do, tin xấu, lời kết tích cực', 'Chronological: start with the history of the issue|||Theo trình tự thời gian: bắt đầu từ lịch sử vấn đề'], correctIndex: 1, explanation: 'Receptive or neutral audiences want the main point immediately; the indirect plan is kept for bad news or resistant readers.|||Người nhận sẵn lòng hoặc trung lập muốn biết ý chính ngay; cách gián tiếp dành cho tin xấu hoặc người đọc có tâm lý kháng cự.' },
  { id: 'q2', question: 'Which sentence best applies the you-attitude?|||Câu nào thể hiện rõ nhất quan điểm hướng về người đọc?', options: ['We are pleased to announce that we have extended our opening hours.|||Chúng tôi vui mừng thông báo rằng chúng tôi đã kéo dài giờ mở cửa.', 'Management has approved an extension of opening hours.|||Ban giám đốc đã phê duyệt việc kéo dài giờ mở cửa.', 'You can now shop with us until 10 p.m. every day.|||Từ nay anh/chị có thể mua sắm tại cửa hàng đến 22 giờ mỗi ngày.', 'Our new opening hours are the result of our strategic review.|||Giờ mở cửa mới là kết quả của đợt rà soát chiến lược của chúng tôi.'], correctIndex: 2, explanation: 'The you-attitude frames the message around the reader and the benefit to them, not around the writer or the organization.|||Quan điểm hướng về người đọc xây dựng thông điệp quanh người đọc và lợi ích của họ, không quanh người viết hay tổ chức.' },
  { id: 'q3', question: 'Which phrase is the most concise replacement for “due to the fact that”?|||Cách thay thế súc tích nhất cho “do bởi thực tế là” (due to the fact that) là gì?', options: ['because|||vì', 'owing to the fact that|||bởi lẽ thực tế là', 'in view of the fact that|||xét thực tế rằng', 'for the reason that|||với lý do là'], correctIndex: 0, explanation: 'The other three options are equally wordy; one plain word carries the same meaning.|||Ba phương án kia đều dài dòng như nhau; một từ đơn giản mang đúng nghĩa đó.' },
]);

const c5 = doc('ssb201-3-1-bad-news', '3.1 — Bad-news messages & crisis communication|||3.1 — Thông điệp tin xấu & truyền thông khủng hoảng',
  'Năm mục tiêu của thông điệp tin xấu, khi nào dùng cách trực tiếp hay gián tiếp, kế hoạch bốn phần (đoạn đệm – lý do – tin xấu – kết tích cực), kỹ thuật giảm nhấn mạnh có đạo đức, các tình huống tin xấu thường gặp, lời xin lỗi chân thành và nguyên tắc truyền thông khủng hoảng.',
  [[
    `<span class="eyebrow">SSB201 · Part 3 · Lesson 3.1</span>
<h2>Bad-news messages &amp; crisis communication</h2>
<p class="lead">Refusing a request, rejecting a claim, announcing a price rise or a layoff — delivering bad news is part of every manager's job. The aim is not only to say no, but to say it so that the reader <strong>understands and accepts</strong> the decision and still <strong>trusts</strong> your organization.</p>
<h3>Five goals of a bad-news message</h3>
<ol>
<li>Convey the bad news clearly.</li>
<li>Gain the reader's acceptance of it.</li>
<li>Maintain as much goodwill as possible.</li>
<li>Protect the organization's image.</li>
<li>Reduce or eliminate the need for further correspondence on the matter.</li>
</ol>
<h3>Direct or indirect?</h3>
<table>
<tr><th>Use the direct approach when…</th><th>Use the indirect approach when…</th></tr>
<tr><td>the news is minor or expected; the reader prefers directness (many internal messages, many low-context readers); firmness is essential; the reader might otherwise overlook the news; or safety or legal reasons demand immediate clarity</td><td>the news is significant or will upset the reader; the reader is personally or emotionally involved; you want to preserve a valuable relationship; or the reader's culture values indirectness</td></tr>
</table>
<h3>The four-part indirect plan</h3>
<table>
<tr><th>Part</th><th>Purpose</th><th>Tips</th></tr>
<tr><td>1. Buffer</td><td>Open with a neutral, relevant statement both sides can agree with</td><td>Types: appreciation, agreement, cooperation, fairness, good news, understanding. Keep it short; neither hint at a yes nor reveal the no; avoid clichés and irrelevant chatter</td></tr>
<tr><td>2. Reasons</td><td>Explain the decision logically before stating it</td><td>Be specific and factual; show reader benefit where it is honest ("to keep prices low for all customers"); do not hide behind "company policy" without explaining what the policy protects</td></tr>
<tr><td>3. Bad news</td><td>State the decision clearly but without emphasis</td><td>Place it right after the reasons, inside a paragraph; use a positive or impersonal construction; say what you <em>can</em> do; offer an alternative or compromise; never leave the decision ambiguous</td></tr>
<tr><td>4. Positive close</td><td>End on a forward-looking note of goodwill</td><td>Next steps, the alternative, resale or a sincere wish; do not repeat the bad news or apologize again; do not invite further argument</td></tr>
</table>
<h3>De-emphasizing techniques — used ethically</h3>
<ul>
<li><strong>Positioning</strong>: place the refusal between the reasons and the alternative, never in the first or last sentence.</li>
<li><strong>Passive or impersonal voice</strong>: "Credit cannot be extended at this time" instead of "We refuse to give you credit".</li>
<li><strong>Focus on what you can do</strong>: "We can deliver 500 units by 5 May" rather than "We cannot deliver 800 units".</li>
<li><strong>Conditional statements</strong>: "If you had registered by 30 June, we could have…" — use with care, because it can sound like blame.</li>
</ul>
<p>These techniques soften the tone; they must never make the reader misunderstand the decision. Ambiguity is unethical, and it only produces more correspondence.</p>
<h3>Common bad-news situations</h3>
<ul>
<li><strong>Refusing requests or claims</strong> — present the facts without accusing ("The damage shown in the photos is consistent with liquid exposure" rather than "You spilled liquid on it").</li>
<li><strong>Problems with orders</strong> — give the new timeline and the options: partial shipment, a substitute or cancellation.</li>
<li><strong>Rejecting job applicants</strong> — prompt, courteous and brief; thank them; avoid details that invite dispute.</li>
<li><strong>Negative performance feedback</strong> — describe specific behaviour and its effects, agree on an improvement plan, and deliver it privately, preferably face to face.</li>
<li><strong>Negative organizational news</strong> (layoffs, closures, price increases) — tell employees before outsiders whenever possible; be honest, give the reasons and the support available; consider delivering it in person.</li>
</ul>
<h3>Apologies</h3>
<p>A sincere apology <strong>acknowledges</strong> what happened, <strong>takes responsibility</strong>, <strong>expresses regret</strong>, <strong>explains briefly</strong> without making excuses, <strong>offers a remedy</strong> and <strong>commits to improvement</strong>. When legal liability may be involved, have the wording reviewed before it is sent.</p>
<h3>Crisis communication</h3>
<table>
<tr><th>Do</th><th>Avoid</th></tr>
<tr><td>Prepare a crisis plan in advance with a trained spokesperson; respond quickly on the channels your stakeholders actually use, including social media; tell the truth as you know it and say what you are doing about it; show concern for the people affected; give regular updates</td><td>Speculating or guessing; "no comment", which sounds like hiding something; blaming others; letting many unofficial voices speak for the company; going silent while rumours spread</td></tr>
</table>
<div class="callout"><span class="badge">Culture</span> In many high-context cultures, bad news is delivered even more indirectly — sometimes in person or through a trusted intermediary. With low-context readers, an overlong buffer can seem evasive. Adapt the plan to the reader, not the other way round.</div>`,
    `<span class="eyebrow">SSB201 · Phần 3 · Bài 3.1</span>
<h2>Thông điệp tin xấu &amp; truyền thông khủng hoảng</h2>
<p class="lead">Từ chối một lời đề nghị, bác một khiếu nại, thông báo tăng giá hay cắt giảm nhân sự — truyền đạt tin xấu là một phần công việc của mọi nhà quản lý. Mục tiêu không chỉ là nói "không", mà là nói sao cho người nhận <strong>hiểu và chấp nhận</strong> quyết định, và vẫn <strong>tin tưởng</strong> tổ chức của bạn.</p>
<h3>Năm mục tiêu của thông điệp tin xấu</h3>
<ol>
<li>Truyền đạt tin xấu một cách rõ ràng.</li>
<li>Khiến người nhận chấp nhận tin đó.</li>
<li>Giữ được thiện chí ở mức cao nhất có thể.</li>
<li>Bảo vệ hình ảnh của tổ chức.</li>
<li>Giảm hoặc loại bỏ nhu cầu phải trao đổi thêm về vấn đề này.</li>
</ol>
<h3>Trực tiếp hay gián tiếp?</h3>
<table>
<tr><th>Dùng cách trực tiếp khi…</th><th>Dùng cách gián tiếp khi…</th></tr>
<tr><td>tin xấu nhỏ hoặc đã được dự đoán; người nhận thích sự thẳng thắn (nhiều thông điệp nội bộ, nhiều người đọc thuộc văn hoá ngữ cảnh thấp); cần thể hiện sự dứt khoát; người nhận có thể bỏ sót tin nếu nói vòng; hoặc lý do an toàn, pháp lý đòi hỏi phải rõ ngay</td><td>tin xấu nghiêm trọng hoặc sẽ làm người nhận phiền lòng; người nhận liên quan trực tiếp hoặc có cảm xúc mạnh; bạn muốn giữ một mối quan hệ có giá trị; hoặc văn hoá của người nhận coi trọng cách nói gián tiếp</td></tr>
</table>
<h3>Kế hoạch gián tiếp bốn phần</h3>
<table>
<tr><th>Phần</th><th>Mục đích</th><th>Mẹo</th></tr>
<tr><td>1. Đoạn đệm (buffer)</td><td>Mở đầu bằng một câu trung lập, liên quan, mà cả hai bên đều đồng tình</td><td>Các loại: cảm ơn, đồng tình, hợp tác, công bằng, tin tốt, thấu hiểu. Giữ ngắn; không gợi ý là "đồng ý" mà cũng không để lộ lời từ chối; tránh sáo ngữ và nói chuyện ngoài lề</td></tr>
<tr><td>2. Lý do</td><td>Giải thích quyết định một cách logic trước khi nêu nó</td><td>Cụ thể, dựa trên dữ kiện; nêu lợi ích cho người nhận khi điều đó là thật ("để giữ giá thấp cho mọi khách hàng"); đừng núp sau "chính sách công ty" mà không giải thích chính sách đó bảo vệ điều gì</td></tr>
<tr><td>3. Tin xấu</td><td>Nêu quyết định rõ ràng nhưng không nhấn mạnh</td><td>Đặt ngay sau phần lý do, nằm trong đoạn văn; dùng cấu trúc tích cực hoặc khách quan; nói điều bạn <em>có thể</em> làm; đưa phương án thay thế hoặc thoả hiệp; không bao giờ để quyết định mập mờ</td></tr>
<tr><td>4. Lời kết tích cực</td><td>Kết thúc bằng một ý hướng tới tương lai, thể hiện thiện chí</td><td>Bước tiếp theo, phương án thay thế, lời nhắc giá trị sản phẩm hoặc một lời chúc chân thành; không nhắc lại tin xấu hay xin lỗi thêm lần nữa; không mời tranh luận tiếp</td></tr>
</table>
<h3>Kỹ thuật giảm nhấn mạnh — dùng có đạo đức</h3>
<ul>
<li><strong>Vị trí</strong>: đặt lời từ chối giữa phần lý do và phương án thay thế, không bao giờ ở câu đầu hay câu cuối.</li>
<li><strong>Thể bị động hoặc khách quan</strong>: "Hiện chưa thể cấp tín dụng" thay vì "Chúng tôi từ chối cấp tín dụng cho anh".</li>
<li><strong>Tập trung vào điều làm được</strong>: "Chúng tôi giao được 500 sản phẩm trước ngày 5/5" thay vì "Chúng tôi không giao nổi 800 sản phẩm".</li>
<li><strong>Câu điều kiện</strong>: "Nếu anh đăng ký trước ngày 30/6, chúng tôi đã có thể…" — dùng thận trọng vì dễ nghe như trách móc.</li>
</ul>
<p>Các kỹ thuật này làm mềm giọng văn; chúng không bao giờ được khiến người nhận hiểu sai quyết định. Mập mờ là thiếu đạo đức, và chỉ sinh thêm thư qua lại.</p>
<h3>Các tình huống tin xấu thường gặp</h3>
<ul>
<li><strong>Từ chối đề nghị hoặc khiếu nại</strong> — trình bày dữ kiện mà không buộc tội ("Hư hỏng trong ảnh phù hợp với tình trạng tiếp xúc chất lỏng" thay vì "Anh đã làm đổ nước vào máy").</li>
<li><strong>Sự cố với đơn hàng</strong> — nêu thời hạn mới và các lựa chọn: giao từng phần, hàng thay thế hoặc huỷ đơn.</li>
<li><strong>Từ chối ứng viên</strong> — kịp thời, lịch sự và ngắn gọn; cảm ơn họ; tránh chi tiết dễ gây tranh cãi.</li>
<li><strong>Nhận xét hiệu quả công việc chưa tốt</strong> — mô tả hành vi cụ thể và tác động của nó, thống nhất kế hoạch cải thiện, và trao đổi riêng, tốt nhất là trực tiếp.</li>
<li><strong>Tin xấu của tổ chức</strong> (cắt giảm nhân sự, đóng cửa, tăng giá) — báo cho nhân viên trước người ngoài bất cứ khi nào có thể; trung thực, nêu lý do và sự hỗ trợ sẽ có; cân nhắc thông báo trực tiếp.</li>
</ul>
<h3>Lời xin lỗi</h3>
<p>Một lời xin lỗi chân thành <strong>thừa nhận</strong> điều đã xảy ra, <strong>nhận trách nhiệm</strong>, <strong>bày tỏ sự tiếc nuối</strong>, <strong>giải thích ngắn gọn</strong> mà không bao biện, <strong>đưa ra biện pháp khắc phục</strong> và <strong>cam kết cải thiện</strong>. Khi có thể phát sinh trách nhiệm pháp lý, hãy cho bộ phận pháp chế xem lại câu chữ trước khi gửi.</p>
<h3>Truyền thông khủng hoảng</h3>
<table>
<tr><th>Nên</th><th>Tránh</th></tr>
<tr><td>Chuẩn bị sẵn kế hoạch khủng hoảng với người phát ngôn đã được huấn luyện; phản hồi nhanh trên chính các kênh mà các bên liên quan đang dùng, kể cả mạng xã hội; nói sự thật theo những gì đã biết và cho biết mình đang làm gì; thể hiện sự quan tâm tới những người bị ảnh hưởng; cập nhật thường xuyên</td><td>Suy đoán, phỏng đoán; nói "miễn bình luận" — nghe như đang che giấu điều gì; đổ lỗi cho người khác; để nhiều tiếng nói không chính thức cùng lên tiếng thay công ty; im lặng trong khi tin đồn lan rộng</td></tr>
</table>
<div class="callout"><span class="badge">Văn hoá</span> Ở nhiều nền văn hoá ngữ cảnh cao, tin xấu còn được truyền đạt gián tiếp hơn nữa — đôi khi gặp trực tiếp hoặc qua một người trung gian đáng tin. Với người đọc thuộc văn hoá ngữ cảnh thấp, đoạn đệm quá dài có thể bị coi là né tránh. Hãy điều chỉnh kế hoạch theo người nhận, chứ không bắt người nhận theo kế hoạch.</div>`,
  ]]);

const c6 = doc('ssb201-3-2-persuasive', '3.2 — Persuasive & sales messages (AIDA)|||3.2 — Thông điệp thuyết phục & thư bán hàng (AIDA)',
  'Ba cách thuyết phục của Aristotle (ethos, logos, pathos), phân tích nhu cầu và phản đối của người nhận, các nguyên tắc ảnh hưởng và giới hạn đạo đức, mô hình AIDA, các loại thông điệp thuyết phục (đề nghị hành động, khiếu nại, thư bán hàng); kèm một email bán hàng AIDA mẫu có phân tích.',
  [[
    `<span class="eyebrow">SSB201 · Part 3 · Lesson 3.2</span>
<h2>Persuasive &amp; sales messages (AIDA)</h2>
<p class="lead"><strong>Persuasion</strong> is the attempt to change an audience's attitudes, beliefs or actions. Business persuasion is ethical when it relies on accurate information, respects the audience's freedom to choose and serves the interests of both sides.</p>
<h3>Three appeals (Aristotle)</h3>
<table>
<tr><th>Appeal</th><th>Based on</th><th>In a business message</th></tr>
<tr><td><strong>Ethos</strong></td><td>The credibility of the communicator</td><td>Expertise, track record, endorsements, sincerity, common ground with the audience</td></tr>
<tr><td><strong>Logos</strong></td><td>Logic and evidence</td><td>Data, examples, cost–benefit analysis, comparisons, sound reasoning</td></tr>
<tr><td><strong>Pathos</strong></td><td>Emotion</td><td>Security, pride, belonging, fear of missing an opportunity — used honestly and in proportion</td></tr>
</table>
<h3>Analyse before you persuade</h3>
<ul>
<li><strong>Needs and values.</strong> What does the audience care about? Needs range from basic security to recognition and self-fulfilment — Maslow's hierarchy is a useful checklist.</li>
<li><strong>Objections.</strong> What will they resist — cost, risk, time, effort, loss of control? Answer the strongest objections inside the message instead of hoping they will not arise.</li>
<li><strong>Principles of influence.</strong> Cialdini's widely cited principles — <strong>reciprocity, commitment and consistency, social proof, liking, authority, scarcity</strong> — explain why people say yes. Use them only truthfully: fake deadlines, invented reviews or false scarcity are unethical and, in advertising, often illegal.</li>
</ul>
<h3>The AIDA model</h3>
<table>
<tr><th>Stage</th><th>Goal</th><th>Techniques</th></tr>
<tr><td><strong>Attention</strong></td><td>Make the reader want to read on</td><td>A relevant problem, a benefit, a surprising fact or a question — connected to the reader's interests, not a gimmick</td></tr>
<tr><td><strong>Interest</strong></td><td>Build on the opening</td><td>Explain how the idea or product solves the problem; turn <em>features</em> (what it is) into <em>benefits</em> (what it does for the reader)</td></tr>
<tr><td><strong>Desire</strong></td><td>Make the reader want it; reduce resistance</td><td>Evidence — testimonials, data, demonstrations, guarantees; answers to objections; price presented in terms of value</td></tr>
<tr><td><strong>Action</strong></td><td>Tell the reader exactly what to do</td><td>One specific, easy step; a genuine reason to act now (a real deadline or incentive); a final reminder of the main benefit</td></tr>
</table>
<h3>Types of persuasive messages</h3>
<ul>
<li><strong>Persuasive requests for action</strong> — for example asking managers to fund a project: lead with the problem or benefit that matters to <em>them</em>, then give evidence and costs, then name the specific decision you need.</li>
<li><strong>Persuasive claims and complaints</strong> — calm, factual and documented (dates, order numbers, copies of receipts); state the remedy you expect. A reasonable tone gets faster results than anger.</li>
<li><strong>Sales and marketing messages</strong> — built around a <strong>central selling point</strong>, the single benefit that best differentiates the offer; they must comply with consumer-protection and advertising rules, so every claim must be true and supportable.</li>
</ul>
<h3>Worked example — an AIDA sales email (fictional product)</h3>
<pre><code class="language-text">Subject: Approve Friday timesheets in one click

[Attention] Does your team still collect timesheets by email every Friday?

[Interest]  TimeNest is a timesheet app built for firms of 10 to 50 people.
            Staff log their hours on their phones, managers approve them in
            one click, and payroll receives a clean report automatically.

[Desire]    "We stopped chasing spreadsheets in the first week."
            - Operations manager at a client firm (fictional testimonial)
            Plans cost 45,000 VND per user per month - about 1,500 VND
            a day - and you can cancel at any time.

[Action]    Start a free 30-day trial before 30 November and we will import
            your existing staff list for you: timenest.example/trial</code></pre>
<p>Notice the central selling point (less time spent on a weekly chore), features turned into benefits, the price broken down into a small daily amount (45,000 ÷ 30 = 1,500 VND), a common objection — being locked in — answered by "cancel at any time", and one clear action with a genuine incentive and deadline.</p>
<div class="callout"><span class="badge">Ethics check</span> Could every sentence in your persuasive message be backed up if the reader asked for proof? If not, rewrite it.</div>`,
    `<span class="eyebrow">SSB201 · Phần 3 · Bài 3.2</span>
<h2>Thông điệp thuyết phục &amp; thư bán hàng (AIDA)</h2>
<p class="lead"><strong>Thuyết phục</strong> là nỗ lực thay đổi thái độ, niềm tin hoặc hành động của người nhận. Thuyết phục trong kinh doanh là có đạo đức khi nó dựa trên thông tin chính xác, tôn trọng quyền lựa chọn của người nhận và phục vụ lợi ích của cả hai bên.</p>
<h3>Ba cách thuyết phục (Aristotle)</h3>
<table>
<tr><th>Cách</th><th>Dựa trên</th><th>Trong thông điệp kinh doanh</th></tr>
<tr><td><strong>Ethos</strong></td><td>Uy tín của người truyền đạt</td><td>Chuyên môn, thành tích, sự bảo chứng, sự chân thành, điểm chung với người nhận</td></tr>
<tr><td><strong>Logos</strong></td><td>Lý lẽ và bằng chứng</td><td>Số liệu, ví dụ, phân tích chi phí – lợi ích, so sánh, lập luận chặt chẽ</td></tr>
<tr><td><strong>Pathos</strong></td><td>Cảm xúc</td><td>Cảm giác an toàn, niềm tự hào, sự gắn bó, nỗi sợ bỏ lỡ cơ hội — dùng trung thực và có chừng mực</td></tr>
</table>
<h3>Phân tích trước khi thuyết phục</h3>
<ul>
<li><strong>Nhu cầu và giá trị.</strong> Người nhận quan tâm điều gì? Nhu cầu trải từ an toàn cơ bản đến được công nhận và tự khẳng định — tháp nhu cầu Maslow là một danh sách kiểm tra hữu ích.</li>
<li><strong>Sự phản đối.</strong> Họ sẽ ngần ngại điều gì — chi phí, rủi ro, thời gian, công sức, mất quyền kiểm soát? Hãy trả lời những phản đối mạnh nhất ngay trong thông điệp thay vì mong chúng không xuất hiện.</li>
<li><strong>Các nguyên tắc ảnh hưởng.</strong> Các nguyên tắc được trích dẫn rộng rãi của Cialdini — <strong>có đi có lại, cam kết và nhất quán, bằng chứng xã hội, thiện cảm, uy quyền, khan hiếm</strong> — giải thích vì sao người ta nói "đồng ý". Chỉ dùng chúng một cách trung thực: hạn chót giả, đánh giá bịa đặt hay khan hiếm giả tạo là phi đạo đức và, trong quảng cáo, thường là vi phạm pháp luật.</li>
</ul>
<h3>Mô hình AIDA</h3>
<table>
<tr><th>Giai đoạn</th><th>Mục tiêu</th><th>Kỹ thuật</th></tr>
<tr><td><strong>Chú ý</strong> (Attention)</td><td>Khiến người đọc muốn đọc tiếp</td><td>Một vấn đề liên quan, một lợi ích, một sự thật bất ngờ hoặc một câu hỏi — gắn với mối quan tâm của người đọc, không phải chiêu trò</td></tr>
<tr><td><strong>Quan tâm</strong> (Interest)</td><td>Phát triển từ phần mở đầu</td><td>Giải thích ý tưởng hay sản phẩm giải quyết vấn đề thế nào; biến <em>tính năng</em> (nó là gì) thành <em>lợi ích</em> (nó làm được gì cho người đọc)</td></tr>
<tr><td><strong>Mong muốn</strong> (Desire)</td><td>Khiến người đọc muốn có nó; giảm sự kháng cự</td><td>Bằng chứng — lời chứng thực, số liệu, trình diễn, cam kết bảo đảm; trả lời các phản đối; trình bày giá theo giá trị nhận được</td></tr>
<tr><td><strong>Hành động</strong> (Action)</td><td>Nói rõ người đọc cần làm gì</td><td>Một bước cụ thể, dễ làm; một lý do thật để hành động ngay (hạn chót hoặc ưu đãi có thật); nhắc lại lợi ích chính lần cuối</td></tr>
</table>
<h3>Các loại thông điệp thuyết phục</h3>
<ul>
<li><strong>Đề nghị hành động mang tính thuyết phục</strong> — ví dụ xin lãnh đạo cấp kinh phí cho một dự án: mở đầu bằng vấn đề hoặc lợi ích mà <em>họ</em> quan tâm, rồi đưa bằng chứng và chi phí, rồi nêu rõ quyết định bạn cần.</li>
<li><strong>Khiếu nại mang tính thuyết phục</strong> — bình tĩnh, dựa trên dữ kiện và có chứng từ (ngày tháng, số đơn hàng, bản sao hoá đơn); nêu rõ biện pháp khắc phục bạn mong muốn. Giọng điệu hợp lý mang lại kết quả nhanh hơn sự giận dữ.</li>
<li><strong>Thư bán hàng và marketing</strong> — xây dựng quanh một <strong>lợi điểm bán hàng chính</strong>, tức lợi ích duy nhất tạo khác biệt rõ nhất cho sản phẩm; phải tuân thủ quy định về bảo vệ người tiêu dùng và quảng cáo, nên mọi tuyên bố phải đúng sự thật và chứng minh được.</li>
</ul>
<h3>Ví dụ mẫu — email bán hàng theo AIDA (sản phẩm giả định)</h3>
<pre><code class="language-text">Tiêu đề: Duyệt bảng chấm công thứ Sáu chỉ với một cú nhấp

[Chú ý]     Nhóm của anh/chị vẫn thu bảng chấm công qua email vào mỗi thứ Sáu?

[Quan tâm]  TimeNest là ứng dụng chấm công dành cho doanh nghiệp 10 đến 50 người.
            Nhân viên ghi giờ làm trên điện thoại, quản lý duyệt bằng một cú
            nhấp, và bộ phận tính lương tự động nhận báo cáo sạch sẽ.

[Mong muốn] "Ngay tuần đầu tiên, chúng tôi đã thôi phải đi đòi bảng tính."
            - Quản lý vận hành của một doanh nghiệp khách hàng (lời chứng thực giả định)
            Phí 45.000 đồng mỗi người dùng mỗi tháng - khoảng 1.500 đồng
            mỗi ngày - và anh/chị có thể huỷ bất cứ lúc nào.

[Hành động] Dùng thử miễn phí 30 ngày trước ngày 30/11, chúng tôi sẽ nhập sẵn
            danh sách nhân viên hiện có cho anh/chị: timenest.example/trial</code></pre>
<p>Hãy để ý lợi điểm bán hàng chính (bớt thời gian cho một việc vặt hằng tuần), tính năng được chuyển thành lợi ích, giá được chia nhỏ thành số tiền mỗi ngày (45.000 ÷ 30 = 1.500 đồng), một phản đối phổ biến — sợ bị ràng buộc — được trả lời bằng "huỷ bất cứ lúc nào", và một hành động rõ ràng đi kèm ưu đãi, hạn chót có thật.</p>
<div class="callout"><span class="badge">Kiểm tra đạo đức</span> Mọi câu trong thông điệp thuyết phục của bạn có chứng minh được không nếu người đọc yêu cầu bằng chứng? Nếu không, hãy viết lại.</div>`,
  ]]);

const e2 = doc('ssb201-3-3-exercise', 'Exercise 2 — Refusing a claim with an alternative|||Bài tập 2 — Từ chối khiếu nại kèm phương án thay thế',
  'Bài tập tình huống giả định: khách hàng đòi đổi máy tính mới dù đã hết bảo hành và hư do đổ nước; viết thư từ chối theo cách gián tiếp, kèm phương án sửa chữa có ưu đãi; có thư mẫu EN/VI và bảng phân tích bốn phần.',
  [[
    `<span class="eyebrow">SSB201 · Part 3 · Exercise 2</span>
<h2>Exercise 2 — saying no and keeping the customer</h2>
<div class="callout"><span class="badge">Problem</span> Nova Tech Store (a fictional retailer) receives an email from Mr Le Van Nam. He bought a Nova X14 laptop in July 2025. In September 2026 the keyboard stopped working after coffee was spilled on it, and he asks for a free replacement laptop. The 12-month warranty covers defects in materials and workmanship, not accidental liquid damage, and it ended in July 2026. The store cannot replace the laptop but wants to keep Mr Nam as a customer, so it offers: a free inspection (normally 200,000 VND), 20% off the repair, and return of the laptop within five working days, if he brings it in by 31 October 2026. The estimated repair cost for a new keyboard assembly is 2,500,000 VND including labour. Write the reply using the indirect approach.</div>
<h3>Model answer</h3>
<pre><code class="language-text">Subject: Your Nova X14 keyboard - repair options

Dear Mr Nam,

Thank you for contacting us about the keyboard on your Nova X14. We
understand how disruptive it is when a computer you rely on every day stops
working properly.

We have reviewed your purchase record and the details in your email. Your
laptop came with a 12-month warranty that covers defects in materials and
workmanship; it does not cover accidental liquid damage, and it ended in
July 2026. For these reasons, the keyboard repair is handled as a paid
service rather than a warranty replacement.

We would still like to get you back to work quickly. If you bring your
laptop to any Nova Tech service centre by 31 October 2026, we will:

- inspect it free of charge (normally 200,000 VND);
- take 20% off the repair: a new keyboard assembly, estimated at
  2,500,000 VND including labour, would cost you 2,000,000 VND;
- return it to you within five working days.

To book a time, simply reply to this email or call our service desk. We
look forward to having your Nova X14 running smoothly again.

Sincerely,
Pham Thu Ha
Customer Care Manager, Nova Tech Store</code></pre>
<table>
<tr><th>Part</th><th>What the letter does</th><th>Technique</th></tr>
<tr><td>Buffer</td><td>Thanks the customer and shows understanding of the inconvenience</td><td>Appreciation + understanding buffer; relevant, neutral, no false hint of a yes</td></tr>
<tr><td>Reasons</td><td>Explains the warranty terms and dates factually</td><td>Facts, not accusation ("accidental liquid damage", not "you spilled coffee")</td></tr>
<tr><td>Bad news</td><td>"…the keyboard repair is handled as a paid service rather than a warranty replacement"</td><td>Placed after the reasons, impersonal wording, clear — the reader cannot misread it as a yes</td></tr>
<tr><td>Alternative</td><td>Free inspection, 20% discount, fast turnaround, with the calculation shown</td><td>Focus on what the store <em>can</em> do; a specific deadline</td></tr>
<tr><td>Positive close</td><td>One easy next step and a forward-looking wish</td><td>No repeated apology, no invitation to reopen the argument</td></tr>
</table>
<p><strong>Check the numbers:</strong> 2,500,000 × (1 − 0.20) = 2,000,000 VND; the customer also saves the 200,000 VND inspection fee, so the total saving is 500,000 + 200,000 = 700,000 VND.</p>
<p><strong>Why:</strong> Mr Nam is emotionally involved and expects a yes, so an opening "No" would likely end the relationship. The reasons prepare him for the decision, the decision itself is unambiguous, and the concrete offer turns a refusal into a reason to come back to the store.</p>`,
    `<span class="eyebrow">SSB201 · Phần 3 · Bài tập 2</span>
<h2>Bài tập 2 — nói "không" mà vẫn giữ được khách hàng</h2>
<div class="callout"><span class="badge">Đề</span> Cửa hàng Nova Tech (nhà bán lẻ giả định) nhận email của anh Lê Văn Nam. Anh mua máy tính xách tay Nova X14 vào tháng 7/2025. Tháng 9/2026, bàn phím hỏng sau khi bị đổ cà phê, và anh yêu cầu được đổi máy mới miễn phí. Chế độ bảo hành 12 tháng chỉ áp dụng cho lỗi vật liệu và lỗi sản xuất, không bao gồm hư hỏng do vô tình đổ chất lỏng, và đã hết hạn từ tháng 7/2026. Cửa hàng không thể đổi máy nhưng muốn giữ anh Nam là khách hàng, nên đưa ra ưu đãi: kiểm tra miễn phí (bình thường 200.000 đồng), giảm 20% chi phí sửa chữa và trả máy trong vòng năm ngày làm việc, nếu anh mang máy đến trước ngày 31/10/2026. Chi phí ước tính để thay cụm bàn phím mới là 2.500.000 đồng, đã gồm tiền công. Hãy viết thư trả lời theo cách gián tiếp.</div>
<h3>Lời giải mẫu</h3>
<pre><code class="language-text">Tiêu đề: Bàn phím máy Nova X14 của anh - các phương án sửa chữa

Kính gửi anh Nam,

Cảm ơn anh đã liên hệ với chúng tôi về bàn phím chiếc Nova X14. Chúng tôi hiểu
việc chiếc máy tính mình dùng hằng ngày gặp trục trặc gây bất tiện đến mức nào.

Chúng tôi đã xem lại thông tin mua hàng và nội dung email của anh. Máy của anh
được bảo hành 12 tháng cho lỗi vật liệu và lỗi sản xuất; chế độ bảo hành không
bao gồm hư hỏng do vô tình tiếp xúc chất lỏng, và đã kết thúc vào tháng 7/2026.
Vì những lý do này, việc sửa bàn phím được thực hiện dưới dạng dịch vụ có tính
phí thay vì đổi máy theo bảo hành.

Chúng tôi vẫn mong giúp anh sớm có máy làm việc trở lại. Nếu anh mang máy đến
bất kỳ trung tâm dịch vụ nào của Nova Tech trước ngày 31/10/2026, chúng tôi sẽ:

- kiểm tra máy miễn phí (bình thường 200.000 đồng);
- giảm 20% chi phí sửa chữa: thay cụm bàn phím mới, ước tính 2.500.000 đồng
  đã gồm tiền công, anh chỉ cần thanh toán 2.000.000 đồng;
- trả máy cho anh trong vòng năm ngày làm việc.

Để đặt lịch, anh chỉ cần trả lời email này hoặc gọi đến bàn dịch vụ của chúng
tôi. Chúng tôi mong sớm thấy chiếc Nova X14 của anh hoạt động trơn tru trở lại.

Trân trọng,
Phạm Thu Hà
Quản lý Chăm sóc Khách hàng, Cửa hàng Nova Tech</code></pre>
<table>
<tr><th>Phần</th><th>Lá thư làm gì</th><th>Kỹ thuật</th></tr>
<tr><td>Đoạn đệm</td><td>Cảm ơn khách và thể hiện sự thấu hiểu nỗi bất tiện</td><td>Đoạn đệm cảm ơn + thấu hiểu; liên quan, trung lập, không gợi ý sai rằng sẽ "đồng ý"</td></tr>
<tr><td>Lý do</td><td>Giải thích điều khoản và thời hạn bảo hành dựa trên dữ kiện</td><td>Nêu dữ kiện, không buộc tội ("vô tình tiếp xúc chất lỏng", không phải "anh làm đổ cà phê")</td></tr>
<tr><td>Tin xấu</td><td>"…việc sửa bàn phím được thực hiện dưới dạng dịch vụ có tính phí thay vì đổi máy theo bảo hành"</td><td>Đặt sau phần lý do, câu chữ khách quan, rõ ràng — người đọc không thể hiểu nhầm là "đồng ý"</td></tr>
<tr><td>Phương án thay thế</td><td>Kiểm tra miễn phí, giảm 20%, trả máy nhanh, có ghi rõ phép tính</td><td>Tập trung vào điều cửa hàng <em>có thể</em> làm; hạn chót cụ thể</td></tr>
<tr><td>Lời kết tích cực</td><td>Một bước tiếp theo dễ làm và một lời chúc hướng tới tương lai</td><td>Không xin lỗi lặp lại, không mời tranh luận lại</td></tr>
</table>
<p><strong>Kiểm tra số liệu:</strong> 2.500.000 × (1 − 0,20) = 2.000.000 đồng; khách còn được miễn phí kiểm tra 200.000 đồng, nên tổng số tiền tiết kiệm là 500.000 + 200.000 = 700.000 đồng.</p>
<p><strong>Vì sao:</strong> anh Nam đang có cảm xúc mạnh và mong được "đồng ý", nên mở đầu bằng chữ "Không" rất dễ chấm dứt mối quan hệ. Phần lý do chuẩn bị tâm lý cho anh trước quyết định, bản thân quyết định thì rõ ràng không mập mờ, và ưu đãi cụ thể biến một lời từ chối thành lý do để anh quay lại cửa hàng.</p>`,
  ]]);

const q3 = quiz('ssb201-quiz-3', 'Quiz 3 — Bad-news & persuasive messages|||Quiz 3 — Thông điệp tin xấu & thuyết phục', [
  { id: 'q1', question: 'What is the usual sequence of an indirect bad-news message?|||Trình tự thông thường của một thông điệp tin xấu viết theo cách gián tiếp là gì?', options: ['Bad news → reasons → buffer → positive close|||Tin xấu → lý do → đoạn đệm → lời kết tích cực', 'Reasons → positive close → buffer → bad news|||Lý do → lời kết tích cực → đoạn đệm → tin xấu', 'Buffer → reasons → bad news → positive close|||Đoạn đệm → lý do → tin xấu → lời kết tích cực', 'Attention → interest → desire → action|||Chú ý → quan tâm → mong muốn → hành động'], correctIndex: 2, explanation: 'The buffer and reasons prepare the reader so the bad news is understood and accepted; AIDA is the plan for persuasive messages.|||Đoạn đệm và lý do chuẩn bị tâm lý để người nhận hiểu và chấp nhận tin xấu; AIDA là kế hoạch cho thông điệp thuyết phục.' },
  { id: 'q2', question: 'You must decline an invitation to speak at a university career fair. Which opening is the most effective buffer?|||Bạn phải từ chối lời mời phát biểu tại ngày hội việc làm của một trường đại học. Câu mở đầu nào là đoạn đệm hiệu quả nhất?', options: ['Unfortunately, we must decline your invitation.|||Rất tiếc, chúng tôi buộc phải từ chối lời mời.', 'Thank you for inviting our team to speak to your students on 12 November.|||Cảm ơn quý trường đã mời đội ngũ chúng tôi nói chuyện với sinh viên vào ngày 12/11.', 'We would absolutely love to be part of your event!|||Chúng tôi vô cùng muốn tham gia sự kiện của quý trường!', 'As you know, company policy does not allow this.|||Như quý trường đã biết, chính sách công ty không cho phép việc này.'], correctIndex: 1, explanation: 'An appreciation buffer is relevant and neutral; the first option reveals the no, the third falsely suggests a yes, and the fourth hides behind policy.|||Đoạn đệm cảm ơn vừa liên quan vừa trung lập; phương án đầu để lộ lời từ chối, phương án ba gợi ý sai là đồng ý, phương án bốn núp sau chính sách.' },
  { id: 'q3', question: 'In the AIDA model, the Desire stage mainly…|||Trong mô hình AIDA, giai đoạn Mong muốn chủ yếu…', options: ['grabs the reader’s attention with a question|||thu hút sự chú ý của người đọc bằng một câu hỏi', 'tells the reader exactly which step to take next|||nói rõ người đọc cần làm bước gì tiếp theo', 'introduces the writer and the company history|||giới thiệu người viết và lịch sử công ty', 'builds want with evidence and answers objections|||khơi mong muốn bằng bằng chứng và trả lời các phản đối'], correctIndex: 3, explanation: 'Desire uses testimonials, data and guarantees to reduce resistance; attention and action are the first and last stages.|||Giai đoạn Mong muốn dùng lời chứng thực, số liệu và cam kết bảo đảm để giảm kháng cự; chú ý và hành động là giai đoạn đầu và cuối.' },
]);

const c7 = doc('ssb201-4-1-reports-proposals', '4.1 — Business reports & proposals|||4.1 — Báo cáo & đề xuất kinh doanh',
  'Ba nhóm tài liệu (báo cáo thông tin, báo cáo phân tích, đề xuất), lập kế hoạch và nghiên cứu, cách tổ chức báo cáo phân tích (trực tiếp, 2 + 2 = 4, thước đo tiêu chí), các phần của báo cáo chính thức và của đề xuất, tiêu đề mang thông tin, chọn biểu đồ và đạo đức khi trình bày số liệu; kèm bản tóm tắt điều hành mẫu.',
  [[
    `<span class="eyebrow">SSB201 · Part 4 · Lesson 4.1</span>
<h2>Business reports &amp; proposals</h2>
<p class="lead">Reports and proposals turn research into decisions. Their readers are busy decision-makers, so structure matters as much as content: readers must be able to find the conclusion, the evidence and the decision required in seconds.</p>
<h3>Three families of documents</h3>
<table>
<tr><th>Type</th><th>Purpose</th><th>Examples</th></tr>
<tr><td>Informational reports</td><td>Present facts without analysis or recommendations</td><td>Progress and status reports, policies and procedures, compliance reports, meeting and trip reports</td></tr>
<tr><td>Analytical reports</td><td>Analyse a situation and reach conclusions, often with recommendations</td><td>Problem-solving reports, feasibility reports, justification reports, criteria-based comparisons of options</td></tr>
<tr><td>Proposals</td><td>Persuade readers to accept a plan, product or service, often in exchange for money</td><td>Internal proposals (for example, to fund a project); external proposals, either <strong>solicited</strong> — answering a <strong>request for proposal (RFP)</strong> — or <strong>unsolicited</strong></td></tr>
</table>
<h3>Planning and research</h3>
<ul>
<li>Write a <strong>problem statement</strong> ("Customer complaints about delivery times have risen for two consecutive quarters") and a <strong>statement of purpose</strong> ("This report identifies the causes and recommends solutions").</li>
<li>Prepare a <strong>work plan</strong>: tasks, sources, methods, schedule and responsibilities.</li>
<li>Combine <strong>secondary research</strong> (existing reports, databases, industry publications) with <strong>primary research</strong> (surveys, interviews, observation, internal company data). Evaluate every source: is it credible, current, objective and relevant?</li>
<li>Document sources in a recognized citation style (APA, MLA or Chicago). Presenting someone else's words or ideas as your own is <strong>plagiarism</strong>, whether in a university assignment or a consulting report.</li>
</ul>
<h3>Organizing analytical reports</h3>
<table>
<tr><th>Approach</th><th>When to use it</th><th>Structure</th></tr>
<tr><td>Focus on conclusions or recommendations (direct)</td><td>The reader trusts you and wants the answer first</td><td>Recommendation → supporting reasons → how to implement</td></tr>
<tr><td>Logical argument: "2 + 2 = 4"</td><td>The reader may be sceptical, so the case is built step by step</td><td>Reason 1 + reason 2 + reason 3 → conclusion</td></tr>
<tr><td>Logical argument: yardstick</td><td>Several options must be judged against the same criteria</td><td>Criteria (cost, benefit, risk…) → each option measured against them → the best option</td></tr>
</table>
<h3>Parts of a formal report</h3>
<ul>
<li><strong>Prefatory parts</strong>: title page, letter or memo of transmittal, table of contents, list of figures, and the <strong>executive summary</strong> — a stand-alone condensed version giving the purpose, key findings, conclusions and recommendations for readers who will read nothing else.</li>
<li><strong>Text</strong>: introduction (purpose, scope, background, methods, limitations, definitions), body (findings), conclusions, recommendations.</li>
<li><strong>Supplementary parts</strong>: appendices and references.</li>
</ul>
<h3>Parts of a proposal</h3>
<p><strong>Introduction</strong> (the problem or opportunity, purpose and scope) → <strong>background</strong> → <strong>proposed solution</strong> and its benefits → <strong>work plan and schedule</strong> → <strong>qualifications</strong> of the team → <strong>costs</strong> → <strong>request for authorization</strong>. A solicited proposal must follow the structure and evaluation criteria of the RFP exactly; an unsolicited one must first convince the reader that the problem exists.</p>
<h3>Headings and visuals</h3>
<p>Use <strong>informative ("talking") headings</strong> — "Late deliveries come mainly from one warehouse" — rather than generic ones such as "Findings". Choose each visual for its purpose:</p>
<table>
<tr><th>To show…</th><th>Use</th></tr>
<tr><td>Exact values for detailed comparison</td><td>Table</td></tr>
<tr><td>A trend over time</td><td>Line chart</td></tr>
<tr><td>A comparison between categories</td><td>Bar chart</td></tr>
<tr><td>Parts of a whole (few categories)</td><td>Pie chart</td></tr>
<tr><td>A process or sequence of steps</td><td>Flowchart</td></tr>
<tr><td>A project schedule</td><td>Gantt chart</td></tr>
</table>
<p>Ethics applies to visuals too: a truncated or uneven axis, a distorted scale or selectively chosen data can mislead as effectively as a false sentence.</p>
<h3>Worked example — an executive summary (fictional)</h3>
<pre><code class="language-text">Executive summary

Purpose: to decide whether Blue Lotus Trading should open a showroom in Da Nang.

Findings: a survey of 150 existing customers in central Vietnam and three
months of online sales data show steady demand; the main risk is high rent.

Financials: investment of 1.2 billion VND; forecast operating profit of
400 million VND a year; simple payback period of 3 years
(1,200 million / 400 million a year).

Recommendation: open the showroom in the second quarter of next year on a
12-month lease, so that the decision can be reviewed after the first year.</code></pre>
<div class="callout"><span class="badge">Test</span> Give your executive summary to someone who has not seen the report. If they cannot state your recommendation and the main reason for it, rewrite the summary.</div>`,
    `<span class="eyebrow">SSB201 · Phần 4 · Bài 4.1</span>
<h2>Báo cáo &amp; đề xuất kinh doanh</h2>
<p class="lead">Báo cáo và đề xuất biến kết quả nghiên cứu thành quyết định. Người đọc là những người ra quyết định bận rộn, nên cấu trúc quan trọng không kém nội dung: họ phải tìm được kết luận, bằng chứng và quyết định cần đưa ra chỉ trong vài giây.</p>
<h3>Ba nhóm tài liệu</h3>
<table>
<tr><th>Loại</th><th>Mục đích</th><th>Ví dụ</th></tr>
<tr><td>Báo cáo thông tin</td><td>Trình bày dữ kiện, không phân tích hay đề xuất</td><td>Báo cáo tiến độ, tình trạng; chính sách và quy trình; báo cáo tuân thủ; báo cáo cuộc họp, chuyến công tác</td></tr>
<tr><td>Báo cáo phân tích</td><td>Phân tích tình huống và rút ra kết luận, thường kèm đề xuất</td><td>Báo cáo giải quyết vấn đề, báo cáo khả thi, báo cáo biện minh, so sánh các phương án theo tiêu chí</td></tr>
<tr><td>Đề xuất</td><td>Thuyết phục người đọc chấp nhận một kế hoạch, sản phẩm hay dịch vụ, thường đổi lại là tiền</td><td>Đề xuất nội bộ (ví dụ xin kinh phí cho dự án); đề xuất gửi ra ngoài, gồm loại <strong>được mời</strong> — trả lời một <strong>hồ sơ mời đề xuất (RFP)</strong> — và loại <strong>chủ động</strong> (không được mời)</td></tr>
</table>
<h3>Lập kế hoạch và nghiên cứu</h3>
<ul>
<li>Viết <strong>tuyên bố vấn đề</strong> ("Khiếu nại của khách hàng về thời gian giao hàng tăng hai quý liên tiếp") và <strong>tuyên bố mục đích</strong> ("Báo cáo này xác định nguyên nhân và đề xuất giải pháp").</li>
<li>Lập <strong>kế hoạch làm việc</strong>: các đầu việc, nguồn thông tin, phương pháp, tiến độ và người phụ trách.</li>
<li>Kết hợp <strong>nghiên cứu thứ cấp</strong> (báo cáo sẵn có, cơ sở dữ liệu, ấn phẩm ngành) với <strong>nghiên cứu sơ cấp</strong> (khảo sát, phỏng vấn, quan sát, dữ liệu nội bộ). Đánh giá mọi nguồn: có đáng tin, cập nhật, khách quan và phù hợp không?</li>
<li>Ghi nguồn theo một chuẩn trích dẫn được công nhận (APA, MLA hoặc Chicago). Trình bày lời hay ý tưởng của người khác như của mình là <strong>đạo văn</strong>, dù trong bài tập đại học hay báo cáo tư vấn.</li>
</ul>
<h3>Tổ chức báo cáo phân tích</h3>
<table>
<tr><th>Cách tổ chức</th><th>Khi nào dùng</th><th>Cấu trúc</th></tr>
<tr><td>Tập trung vào kết luận hoặc đề xuất (trực tiếp)</td><td>Người đọc tin bạn và muốn biết câu trả lời trước</td><td>Đề xuất → lý do hỗ trợ → cách triển khai</td></tr>
<tr><td>Lập luận logic: "2 + 2 = 4"</td><td>Người đọc có thể hoài nghi, nên phải xây dựng lập luận từng bước</td><td>Lý do 1 + lý do 2 + lý do 3 → kết luận</td></tr>
<tr><td>Lập luận logic: thước đo tiêu chí (yardstick)</td><td>Nhiều phương án cần được đánh giá theo cùng một bộ tiêu chí</td><td>Tiêu chí (chi phí, lợi ích, rủi ro…) → đo từng phương án theo tiêu chí → phương án tốt nhất</td></tr>
</table>
<h3>Các phần của báo cáo chính thức</h3>
<ul>
<li><strong>Phần mở đầu</strong>: trang tiêu đề, thư hoặc thư báo chuyển giao, mục lục, danh mục hình, và <strong>bản tóm tắt điều hành</strong> — một phiên bản rút gọn đọc độc lập được, nêu mục đích, phát hiện chính, kết luận và đề xuất cho những người đọc sẽ không đọc gì khác.</li>
<li><strong>Phần nội dung</strong>: giới thiệu (mục đích, phạm vi, bối cảnh, phương pháp, giới hạn, định nghĩa), thân bài (các phát hiện), kết luận, đề xuất.</li>
<li><strong>Phần bổ trợ</strong>: phụ lục và tài liệu tham khảo.</li>
</ul>
<h3>Các phần của một đề xuất</h3>
<p><strong>Giới thiệu</strong> (vấn đề hoặc cơ hội, mục đích và phạm vi) → <strong>bối cảnh</strong> → <strong>giải pháp đề xuất</strong> và lợi ích → <strong>kế hoạch làm việc và tiến độ</strong> → <strong>năng lực</strong> của đội ngũ → <strong>chi phí</strong> → <strong>đề nghị phê duyệt</strong>. Đề xuất được mời phải tuân thủ chính xác cấu trúc và tiêu chí đánh giá trong RFP; đề xuất chủ động thì trước hết phải thuyết phục người đọc rằng vấn đề có thật.</p>
<h3>Tiêu đề và hình minh hoạ</h3>
<p>Dùng <strong>tiêu đề mang thông tin</strong> — "Giao hàng trễ chủ yếu xuất phát từ một kho" — thay vì tiêu đề chung chung như "Các phát hiện". Chọn mỗi hình minh hoạ theo mục đích:</p>
<table>
<tr><th>Muốn thể hiện…</th><th>Dùng</th></tr>
<tr><td>Giá trị chính xác để so sánh chi tiết</td><td>Bảng</td></tr>
<tr><td>Xu hướng theo thời gian</td><td>Biểu đồ đường</td></tr>
<tr><td>So sánh giữa các nhóm</td><td>Biểu đồ cột</td></tr>
<tr><td>Các phần của một tổng thể (ít nhóm)</td><td>Biểu đồ tròn</td></tr>
<tr><td>Một quy trình hay trình tự các bước</td><td>Lưu đồ</td></tr>
<tr><td>Tiến độ dự án</td><td>Biểu đồ Gantt</td></tr>
</table>
<p>Đạo đức cũng áp dụng cho hình minh hoạ: trục bị cắt hoặc chia không đều, tỷ lệ bị bóp méo hay dữ liệu được chọn lọc có chủ đích có thể gây hiểu lầm chẳng kém một câu sai sự thật.</p>
<h3>Ví dụ mẫu — bản tóm tắt điều hành (giả định)</h3>
<pre><code class="language-text">Tóm tắt điều hành

Mục đích: quyết định Công ty Blue Lotus có nên mở phòng trưng bày tại Đà Nẵng.

Phát hiện: khảo sát 150 khách hàng hiện có ở miền Trung và dữ liệu bán hàng trực
tuyến trong ba tháng cho thấy nhu cầu ổn định; rủi ro chính là giá thuê mặt bằng cao.

Tài chính: vốn đầu tư 1,2 tỷ đồng; lợi nhuận hoạt động dự báo 400 triệu đồng
mỗi năm; thời gian hoàn vốn giản đơn 3 năm (1.200 triệu / 400 triệu mỗi năm).

Đề xuất: mở phòng trưng bày vào quý II năm sau với hợp đồng thuê 12 tháng, để
có thể đánh giá lại quyết định sau năm đầu tiên.</code></pre>
<div class="callout"><span class="badge">Phép thử</span> Đưa bản tóm tắt điều hành cho một người chưa đọc báo cáo. Nếu họ không nói lại được đề xuất của bạn và lý do chính của nó, hãy viết lại bản tóm tắt.</div>`,
  ]]);

const c8 = doc('ssb201-4-2-presentations', '4.2 — Business presentations & slides|||4.2 — Thuyết trình kinh doanh & slide',
  'Lập kế hoạch và cấu trúc bài thuyết trình (mở đầu – thân bài – kết luận), phân bổ thời gian cho một bài nói 10 phút, thiết kế slide hỗ trợ người nói (slide khẳng định – bằng chứng), cách trình bày, kiểm soát hồi hộp, trả lời câu hỏi và thuyết trình trực tuyến.',
  [[
    `<span class="eyebrow">SSB201 · Part 4 · Lesson 4.2</span>
<h2>Business presentations &amp; slides</h2>
<p class="lead">A presentation is a message delivered live, with the added power — and risk — of voice, body language and visuals. The same three steps apply: plan, write, complete.</p>
<h3>Plan</h3>
<ul>
<li>Define the purpose (to inform, persuade or collaborate) and the <strong>one idea</strong> the audience must remember.</li>
<li>Analyse the audience: size, knowledge, attitude toward the topic, expectations and the setting (room or online, time of day).</li>
<li>Limit the scope to the time available. A short talk can develop only a few main points well — often three.</li>
</ul>
<h3>Structure</h3>
<table>
<tr><th>Part</th><th>Tasks</th></tr>
<tr><td>Introduction</td><td>Arouse interest (a relevant question, story or fact), build credibility, preview the main points</td></tr>
<tr><td>Body</td><td>Develop each main point with evidence and examples; use clear transitions ("Now that we have seen the cost, let us look at the benefits")</td></tr>
<tr><td>Close</td><td>Restate the main points, state the conclusion or the action you want, end with a memorable line; then invite questions</td></tr>
</table>
<h3>Worked example — timing a 10-minute persuasive talk</h3>
<table>
<tr><th>Segment</th><th>Content</th><th>Minutes</th></tr>
<tr><td>Opening</td><td>The problem: late deliveries are costing us repeat customers</td><td>1.5</td></tr>
<tr><td>Point 1</td><td>Causes, shown with data from the delivery log</td><td>2.5</td></tr>
<tr><td>Point 2</td><td>The proposed solution: a second delivery partner</td><td>2.5</td></tr>
<tr><td>Point 3</td><td>Costs, benefits and timeline</td><td>2.5</td></tr>
<tr><td>Close</td><td>Recap and the decision requested today</td><td>1.0</td></tr>
<tr><td colspan="2"><strong>Total</strong> (1.5 + 3 × 2.5 + 1.0)</td><td><strong>10.0</strong></td></tr>
</table>
<p>Questions and answers are scheduled separately, after the 10 minutes. Rehearse with a timer: most first drafts run long.</p>
<h3>Slides that support, not replace, the speaker</h3>
<ul>
<li>One idea per slide. A strong pattern is the <strong>assertion–evidence</strong> slide: a full-sentence headline stating the point ("A second partner cuts late deliveries in the south"), supported by a chart, image or diagram rather than a wall of bullets.</li>
<li>Keep text to a minimum. Popular rules of thumb such as "6 × 6" (at most about six bullets of six words) are warning limits, not targets.</li>
<li>Use large, readable fonts, high contrast and a consistent design; label charts clearly and cite data sources.</li>
<li>Do not read your slides aloud — the audience reads faster than you speak. Put details in handouts or speaker notes.</li>
<li>Prepare for technical failure: carry a PDF copy and be able to give the talk without slides.</li>
</ul>
<h3>Delivery</h3>
<ul>
<li><strong>Method</strong>: reading a script sounds stiff, memorizing is risky and speaking impromptu means speaking unprepared. For most business talks, speak <strong>extemporaneously</strong> — from brief notes, after thorough rehearsal.</li>
<li><strong>Voice and body</strong>: vary pace and pitch, pause before key points, stand steadily, use natural gestures and make eye contact across the room (online, look at the camera).</li>
<li><strong>Nervousness</strong> is normal: prepare thoroughly, rehearse aloud, breathe slowly and focus on the audience's needs rather than on yourself.</li>
</ul>
<h3>Handling questions</h3>
<p>Anticipate likely questions and prepare answers — and backup slides. Listen to the whole question, repeat or paraphrase it so everyone hears it, answer briefly and check that you have answered it. If you do not know, say so and promise to follow up — then do. Respond to hostile questions calmly: restate the concern neutrally and address the issue, not the person.</p>
<h3>Online presentations</h3>
<p>Test the platform, audio and screen sharing beforehand; send materials in advance; engage the audience every few minutes with a question, poll or chat prompt; and, for larger sessions, ask a co-host to manage the chat and technical problems.</p>
<div class="callout"><span class="badge">Remember</span> The audience cannot re-read what you said. Repeat the structure out loud: tell them what you will cover, cover it, then tell them what you covered.</div>`,
    `<span class="eyebrow">SSB201 · Phần 4 · Bài 4.2</span>
<h2>Thuyết trình kinh doanh &amp; slide</h2>
<p class="lead">Bài thuyết trình là một thông điệp truyền đạt trực tiếp, có thêm sức mạnh — và rủi ro — của giọng nói, ngôn ngữ cơ thể và hình ảnh. Ba bước quen thuộc vẫn áp dụng: lập kế hoạch, soạn thảo, hoàn thiện.</p>
<h3>Lập kế hoạch</h3>
<ul>
<li>Xác định mục đích (thông tin, thuyết phục hay hợp tác) và <strong>một ý duy nhất</strong> khán giả phải nhớ.</li>
<li>Phân tích khán giả: số lượng, hiểu biết, thái độ với chủ đề, kỳ vọng và bối cảnh (phòng họp hay trực tuyến, thời điểm trong ngày).</li>
<li>Giới hạn phạm vi theo thời gian cho phép. Một bài nói ngắn chỉ phát triển tốt được vài ý chính — thường là ba.</li>
</ul>
<h3>Cấu trúc</h3>
<table>
<tr><th>Phần</th><th>Nhiệm vụ</th></tr>
<tr><td>Mở đầu</td><td>Khơi gợi sự quan tâm (một câu hỏi, câu chuyện hay sự thật liên quan), tạo uy tín, giới thiệu trước các ý chính</td></tr>
<tr><td>Thân bài</td><td>Phát triển từng ý chính bằng bằng chứng và ví dụ; dùng câu chuyển ý rõ ràng ("Chúng ta đã thấy chi phí, giờ hãy xem lợi ích")</td></tr>
<tr><td>Kết luận</td><td>Nhắc lại các ý chính, nêu kết luận hoặc hành động bạn mong muốn, kết thúc bằng một câu dễ nhớ; sau đó mời đặt câu hỏi</td></tr>
</table>
<h3>Ví dụ mẫu — phân bổ thời gian cho bài nói thuyết phục 10 phút</h3>
<table>
<tr><th>Phân đoạn</th><th>Nội dung</th><th>Phút</th></tr>
<tr><td>Mở đầu</td><td>Vấn đề: giao hàng trễ đang làm ta mất khách hàng quay lại</td><td>1,5</td></tr>
<tr><td>Ý 1</td><td>Nguyên nhân, minh hoạ bằng dữ liệu từ sổ giao hàng</td><td>2,5</td></tr>
<tr><td>Ý 2</td><td>Giải pháp đề xuất: thêm một đối tác giao hàng thứ hai</td><td>2,5</td></tr>
<tr><td>Ý 3</td><td>Chi phí, lợi ích và tiến độ</td><td>2,5</td></tr>
<tr><td>Kết luận</td><td>Tóm tắt và quyết định cần thông qua ngay hôm nay</td><td>1,0</td></tr>
<tr><td colspan="2"><strong>Tổng</strong> (1,5 + 3 × 2,5 + 1,0)</td><td><strong>10,0</strong></td></tr>
</table>
<p>Phần hỏi đáp được xếp riêng, sau 10 phút này. Hãy tập với đồng hồ bấm giờ: phần lớn bản nháp đầu tiên đều bị lố giờ.</p>
<h3>Slide hỗ trợ người nói, không thay thế người nói</h3>
<ul>
<li>Mỗi slide một ý. Một mẫu hiệu quả là slide <strong>khẳng định – bằng chứng</strong>: tiêu đề là một câu hoàn chỉnh nêu luận điểm ("Đối tác thứ hai giúp giảm giao hàng trễ ở phía Nam"), đi kèm biểu đồ, hình ảnh hoặc sơ đồ làm bằng chứng thay vì một bức tường gạch đầu dòng.</li>
<li>Giữ chữ ở mức tối thiểu. Các quy tắc kinh nghiệm phổ biến như "6 × 6" (tối đa khoảng sáu dòng, mỗi dòng sáu từ) là giới hạn cảnh báo, không phải chỉ tiêu.</li>
<li>Dùng phông chữ lớn, dễ đọc, độ tương phản cao và thiết kế nhất quán; ghi chú rõ biểu đồ và dẫn nguồn số liệu.</li>
<li>Đừng đọc to slide — khán giả đọc nhanh hơn bạn nói. Đưa chi tiết vào tài liệu phát tay hoặc ghi chú của người nói.</li>
<li>Chuẩn bị cho sự cố kỹ thuật: mang theo bản PDF và có khả năng trình bày cả khi không có slide.</li>
</ul>
<h3>Cách trình bày</h3>
<ul>
<li><strong>Phương pháp</strong>: đọc bản viết sẵn nghe cứng nhắc, học thuộc lòng thì rủi ro, còn nói ứng khẩu là nói khi chưa chuẩn bị. Với phần lớn bài nói trong kinh doanh, hãy <strong>nói theo dàn ý</strong> — dựa vào ghi chú ngắn, sau khi đã tập kỹ.</li>
<li><strong>Giọng nói và cơ thể</strong>: thay đổi tốc độ và cao độ, ngừng một nhịp trước ý quan trọng, đứng vững, dùng cử chỉ tự nhiên và giao tiếp bằng mắt với khắp phòng (khi trực tuyến, hãy nhìn vào camera).</li>
<li><strong>Hồi hộp</strong> là bình thường: chuẩn bị kỹ, tập nói thành tiếng, thở chậm và tập trung vào nhu cầu của khán giả thay vì vào bản thân.</li>
</ul>
<h3>Trả lời câu hỏi</h3>
<p>Dự đoán các câu hỏi có thể gặp và chuẩn bị câu trả lời — cả slide dự phòng. Nghe hết câu hỏi, nhắc lại hoặc diễn đạt lại để cả phòng cùng nghe, trả lời ngắn gọn và kiểm tra xem mình đã trả lời đúng ý chưa. Nếu không biết, hãy nói thật và hứa sẽ phản hồi sau — rồi thực hiện. Với câu hỏi mang tính công kích, hãy bình tĩnh: nhắc lại mối lo ngại bằng lời lẽ trung lập và giải quyết vấn đề, không nhắm vào con người.</p>
<h3>Thuyết trình trực tuyến</h3>
<p>Kiểm tra trước nền tảng, âm thanh và chia sẻ màn hình; gửi tài liệu trước; cứ vài phút lại tương tác với khán giả bằng một câu hỏi, bình chọn hoặc lời mời nhắn tin; và với buổi đông người, nhờ một người đồng tổ chức quản lý khung chat và sự cố kỹ thuật.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Khán giả không thể đọc lại điều bạn đã nói. Hãy nói to cấu trúc bài: cho họ biết bạn sẽ trình bày gì, trình bày nó, rồi nhắc lại những gì bạn đã trình bày.</div>`,
  ]]);

const c9 = doc('ssb201-4-3-employment', '4.3 — CVs, application letters & job interviews|||4.3 — CV, thư xin việc & phỏng vấn',
  'Ba dạng CV (theo thời gian, theo kỹ năng, kết hợp), viết thành tích thay cho nhiệm vụ, hệ thống lọc hồ sơ ATS, thư xin việc theo AIDA, các loại phỏng vấn, chuẩn bị, trả lời theo phương pháp STAR và thư cảm ơn sau phỏng vấn; kèm câu trả lời STAR mẫu.',
  [[
    `<span class="eyebrow">SSB201 · Part 4 · Lesson 4.3</span>
<h2>CVs, application letters &amp; job interviews</h2>
<p class="lead">A job application is a persuasive message in which the product is you. Employers look for evidence that you can do the job, will fit the organization and communicate well — and the application itself is the first sample of how you communicate.</p>
<h3>The CV (résumé)</h3>
<table>
<tr><th>Format</th><th>Organization</th><th>Best for</th></tr>
<tr><td>Chronological</td><td>Work experience in reverse chronological order</td><td>Candidates with steady experience in the target field</td></tr>
<tr><td>Functional</td><td>Organized around skills and competencies</td><td>Career changers or people with gaps — but some recruiters distrust it because it hides the timeline</td></tr>
<tr><td>Combination (hybrid)</td><td>A skills summary followed by a chronological history</td><td>Students and early-career candidates with relevant projects, part-time jobs and activities</td></tr>
</table>
<ul>
<li><strong>Typical sections</strong>: contact information, a short profile or career objective, education, experience, skills (languages, software, certifications), activities and achievements.</li>
<li><strong>Write achievements, not duties</strong>: start with action verbs and quantify results. Weak: "Responsible for the club's social media." Strong: "Increased event registrations by 50% (from 80 to 120) by redesigning the club's social media plan."</li>
<li><strong>Tailor every CV</strong> to the job description. Many employers screen applications with an <strong>applicant tracking system (ATS)</strong>, so use the key terms of the job naturally and keep the layout simple — standard headings, no important text inside images.</li>
<li><strong>Be accurate</strong>: exaggeration or false information is unethical and can later be grounds for dismissal.</li>
<li><strong>Keep it concise</strong> — one page is usually enough for students and recent graduates. Conventions differ by country and employer (for example, whether to include a photo or date of birth), so follow the norms of the organization you are applying to.</li>
</ul>
<h3>The application letter — AIDA again</h3>
<table>
<tr><th>Stage</th><th>Content</th></tr>
<tr><td>Attention</td><td>Name the position and where you learned of it; open with your strongest qualification or a link to the employer's needs</td></tr>
<tr><td>Interest and desire</td><td>Match two or three key requirements of the job with specific evidence from your experience; show that you have researched the company</td></tr>
<tr><td>Action</td><td>Request an interview, state your availability and thank the reader</td></tr>
</table>
<p>A <strong>solicited</strong> letter responds to an advertised opening; an <strong>unsolicited</strong> (prospecting) letter asks about openings that have not been advertised and must work harder to show what you can offer.</p>
<h3>Job interviews</h3>
<ul>
<li><strong>Types</strong>: screening interviews (often by phone or video), selection and final interviews; structured and unstructured interviews; panel and group interviews; <strong>behavioural</strong> interviews (about your past behaviour) and <strong>situational</strong> interviews (about hypothetical scenarios).</li>
<li><strong>Prepare</strong>: research the company, its products, competitors and recent news; study the job description; prepare examples; plan appropriate dress; arrive — or log in — early.</li>
<li><strong>Answer behavioural questions with STAR</strong>: <strong>S</strong>ituation, <strong>T</strong>ask, <strong>A</strong>ction, <strong>R</strong>esult.</li>
<li><strong>Ask good questions</strong> that show interest in the work ("What would success look like in the first six months?"), not only about salary and holidays.</li>
<li><strong>Follow up</strong> with a brief thank-you message, usually within a day, that restates your interest and refers to one point from the conversation. Later messages — accepting or declining an offer, or resigning from a job — follow the same rules: direct for good news, courteous and brief for bad news.</li>
</ul>
<h3>Worked example — a STAR answer (fictional)</h3>
<pre><code class="language-text">Question: "Tell me about a time you persuaded people to change something."

S - Registrations for our student club's events had fallen to about 80.
T - As communications lead, I had to raise registrations before the
    spring event.
A - I surveyed members, moved our posts to the times they were most
    active online, and replaced long announcements with 30-second videos.
R - Registrations rose to 120 - a 50% increase - and the club still
    uses the new plan.</code></pre>
<p>Check: (120 − 80) ÷ 80 = 0.5 = 50%. The same fact appears, with the same numbers, in the CV bullet above — consistency builds credibility.</p>
<div class="callout"><span class="badge">Consistency</span> Your CV, letter, online profile and interview answers must tell the same story with the same facts. Interviewers notice mismatches.</div>`,
    `<span class="eyebrow">SSB201 · Phần 4 · Bài 4.3</span>
<h2>CV, thư xin việc &amp; phỏng vấn</h2>
<p class="lead">Hồ sơ xin việc là một thông điệp thuyết phục mà sản phẩm chính là bạn. Nhà tuyển dụng tìm bằng chứng rằng bạn làm được việc, hợp với tổ chức và giao tiếp tốt — và chính bộ hồ sơ là mẫu đầu tiên cho thấy cách bạn giao tiếp.</p>
<h3>CV (sơ yếu lý lịch)</h3>
<table>
<tr><th>Dạng</th><th>Cách sắp xếp</th><th>Phù hợp với</th></tr>
<tr><td>Theo thời gian</td><td>Kinh nghiệm làm việc xếp từ gần nhất trở về trước</td><td>Ứng viên có kinh nghiệm liên tục trong lĩnh vực muốn ứng tuyển</td></tr>
<tr><td>Theo kỹ năng</td><td>Sắp xếp quanh các kỹ năng và năng lực</td><td>Người chuyển ngành hoặc có khoảng trống trong quá trình làm việc — nhưng một số nhà tuyển dụng không tin dạng này vì nó che mất dòng thời gian</td></tr>
<tr><td>Kết hợp</td><td>Tóm tắt kỹ năng, sau đó là quá trình theo thời gian</td><td>Sinh viên và người mới đi làm có dự án, việc làm thêm và hoạt động liên quan</td></tr>
</table>
<ul>
<li><strong>Các mục thường có</strong>: thông tin liên hệ, phần giới thiệu ngắn hoặc mục tiêu nghề nghiệp, học vấn, kinh nghiệm, kỹ năng (ngoại ngữ, phần mềm, chứng chỉ), hoạt động và thành tích.</li>
<li><strong>Viết thành tích, không liệt kê nhiệm vụ</strong>: bắt đầu bằng động từ hành động và lượng hoá kết quả. Chưa tốt: "Phụ trách mạng xã hội của câu lạc bộ." Tốt: "Tăng 50% lượt đăng ký sự kiện (từ 80 lên 120) nhờ thiết kế lại kế hoạch mạng xã hội của câu lạc bộ."</li>
<li><strong>Điều chỉnh CV cho từng vị trí</strong> theo mô tả công việc. Nhiều nhà tuyển dụng sàng lọc hồ sơ bằng <strong>hệ thống quản lý ứng viên (ATS)</strong>, nên hãy dùng tự nhiên các từ khoá của vị trí và giữ bố cục đơn giản — tiêu đề mục chuẩn, không đặt chữ quan trọng bên trong hình ảnh.</li>
<li><strong>Chính xác</strong>: thổi phồng hoặc khai sai thông tin là thiếu đạo đức và về sau có thể là căn cứ để bị cho thôi việc.</li>
<li><strong>Ngắn gọn</strong> — một trang thường là đủ với sinh viên và người mới tốt nghiệp. Quy ước khác nhau tuỳ quốc gia và nhà tuyển dụng (chẳng hạn có nên kèm ảnh hay ngày sinh không), vì vậy hãy theo chuẩn mực của chính tổ chức bạn ứng tuyển.</li>
</ul>
<h3>Thư xin việc — lại là AIDA</h3>
<table>
<tr><th>Giai đoạn</th><th>Nội dung</th></tr>
<tr><td>Chú ý</td><td>Nêu vị trí ứng tuyển và nơi bạn biết thông tin; mở đầu bằng điểm mạnh nhất của bạn hoặc gắn với nhu cầu của nhà tuyển dụng</td></tr>
<tr><td>Quan tâm và mong muốn</td><td>Đối chiếu hai ba yêu cầu chính của công việc với bằng chứng cụ thể từ kinh nghiệm của bạn; cho thấy bạn đã tìm hiểu về công ty</td></tr>
<tr><td>Hành động</td><td>Đề nghị một buổi phỏng vấn, cho biết thời gian bạn có thể tham gia và cảm ơn người đọc</td></tr>
</table>
<p>Thư <strong>ứng tuyển theo thông báo</strong> trả lời một vị trí đã đăng tuyển; thư <strong>ứng tuyển chủ động</strong> hỏi về cơ hội chưa được đăng tuyển và phải cố gắng hơn để cho thấy bạn mang lại được gì.</p>
<h3>Phỏng vấn xin việc</h3>
<ul>
<li><strong>Các loại</strong>: phỏng vấn sàng lọc (thường qua điện thoại hoặc video), phỏng vấn tuyển chọn và phỏng vấn cuối; phỏng vấn có cấu trúc và không cấu trúc; phỏng vấn hội đồng và phỏng vấn nhóm; phỏng vấn <strong>hành vi</strong> (về cách bạn đã hành xử) và phỏng vấn <strong>tình huống</strong> (về các kịch bản giả định).</li>
<li><strong>Chuẩn bị</strong>: tìm hiểu công ty, sản phẩm, đối thủ và tin tức gần đây; nghiên cứu mô tả công việc; chuẩn bị sẵn ví dụ; chọn trang phục phù hợp; đến — hoặc đăng nhập — sớm.</li>
<li><strong>Trả lời câu hỏi hành vi theo STAR</strong>: <strong>S</strong>ituation (tình huống), <strong>T</strong>ask (nhiệm vụ), <strong>A</strong>ction (hành động), <strong>R</strong>esult (kết quả).</li>
<li><strong>Đặt câu hỏi hay</strong> thể hiện sự quan tâm tới công việc ("Thế nào được coi là thành công trong sáu tháng đầu?"), không chỉ hỏi về lương và ngày nghỉ.</li>
<li><strong>Theo dõi sau phỏng vấn</strong> bằng một lời cảm ơn ngắn, thường trong vòng một ngày, khẳng định lại sự quan tâm và nhắc tới một ý trong buổi trao đổi. Các thư sau đó — nhận hoặc từ chối lời mời làm việc, hay xin nghỉ việc — theo đúng các quy tắc đã học: trực tiếp với tin tốt, lịch sự và ngắn gọn với tin xấu.</li>
</ul>
<h3>Ví dụ mẫu — câu trả lời theo STAR (giả định)</h3>
<pre><code class="language-text">Câu hỏi: "Hãy kể về một lần bạn thuyết phục mọi người thay đổi điều gì đó."

S - Lượt đăng ký các sự kiện của câu lạc bộ sinh viên đã giảm còn khoảng 80.
T - Là trưởng ban truyền thông, tôi phải tăng lượt đăng ký trước sự kiện
    mùa xuân.
A - Tôi khảo sát thành viên, dời lịch đăng bài sang khung giờ họ hoạt động
    trên mạng nhiều nhất, và thay các thông báo dài bằng video 30 giây.
R - Lượt đăng ký tăng lên 120 - tăng 50% - và câu lạc bộ vẫn dùng kế hoạch
    mới đến nay.</code></pre>
<p>Kiểm tra: (120 − 80) ÷ 80 = 0,5 = 50%. Cùng một sự việc, với cùng những con số, xuất hiện trong dòng thành tích của CV ở trên — sự nhất quán tạo nên uy tín.</p>
<div class="callout"><span class="badge">Nhất quán</span> CV, thư xin việc, hồ sơ trực tuyến và câu trả lời phỏng vấn phải kể cùng một câu chuyện với cùng những dữ kiện. Người phỏng vấn nhận ra ngay những chỗ vênh nhau.</div>`,
  ]]);

const q4 = quiz('ssb201-quiz-4', 'Quiz 4 — Reports, presentations & employment|||Quiz 4 — Báo cáo, thuyết trình & xin việc', [
  { id: 'q1', question: 'A report compares three possible warehouse locations against the same criteria — cost, delivery time and risk — and then recommends one. Which organizing approach is this?|||Một báo cáo so sánh ba địa điểm đặt kho theo cùng bộ tiêu chí — chi phí, thời gian giao hàng và rủi ro — rồi đề xuất một địa điểm. Đây là cách tổ chức nào?', options: ['The yardstick approach|||Cách thước đo tiêu chí (yardstick)', 'Chronological organization|||Tổ chức theo trình tự thời gian', 'An informational progress report|||Báo cáo tiến độ mang tính thông tin', 'The indirect bad-news plan|||Kế hoạch tin xấu gián tiếp'], correctIndex: 0, explanation: 'The yardstick approach measures every option against the same set of criteria; a progress report presents facts without recommending.|||Cách thước đo tiêu chí đo mọi phương án theo cùng một bộ tiêu chí; báo cáo tiến độ chỉ trình bày dữ kiện, không đề xuất.' },
  { id: 'q2', question: 'Which visual best shows how monthly sales changed over the last 12 months?|||Hình minh hoạ nào thể hiện tốt nhất doanh số hằng tháng thay đổi thế nào trong 12 tháng qua?', options: ['A pie chart|||Biểu đồ tròn', 'A flowchart|||Lưu đồ', 'A line chart|||Biểu đồ đường', 'An organization chart|||Sơ đồ tổ chức'], correctIndex: 2, explanation: 'Line charts show trends over time; pie charts show parts of a whole and flowcharts show processes.|||Biểu đồ đường thể hiện xu hướng theo thời gian; biểu đồ tròn thể hiện các phần của tổng thể, còn lưu đồ thể hiện quy trình.' },
  { id: 'q3', question: 'In a behavioural job interview, the STAR method structures an answer as…|||Trong phỏng vấn hành vi, phương pháp STAR sắp xếp câu trả lời theo…', options: ['Strengths, Talents, Ambitions, References|||Điểm mạnh, Tài năng, Hoài bão, Người giới thiệu', 'Summary, Timeline, Analysis, Recommendation|||Tóm tắt, Dòng thời gian, Phân tích, Đề xuất', 'Salary, Training, Advancement, Rewards|||Lương, Đào tạo, Thăng tiến, Khen thưởng', 'Situation, Task, Action, Result|||Tình huống, Nhiệm vụ, Hành động, Kết quả'], correctIndex: 3, explanation: 'STAR turns a claim (“I am persuasive”) into evidence: a real situation, your task, what you did and the measurable result.|||STAR biến một lời tự nhận (“tôi có sức thuyết phục”) thành bằng chứng: tình huống thật, nhiệm vụ của bạn, việc bạn đã làm và kết quả đo được.' },
]);

const taiLieu = doc('ssb201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">SSB201 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning business communication: the official syllabus and slides, books, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official SSB201 syllabus and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://open.lib.umn.edu/businesscommunication/" target="_blank" rel="noopener">Business Communication for Success</a> — University of Minnesota Libraries Publishing: a free open textbook.</li>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">Business Communication Today</a> — Courtland L. Bovée &amp; John V. Thill (Pearson) — the classic text; search the title on the publisher site.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://www.plainlanguage.gov/" target="_blank" rel="noopener">PlainLanguage.gov</a> — official guidelines for clear, reader-focused writing.</li>
<li><a href="https://hbr.org/" target="_blank" rel="noopener">Harvard Business Review</a> — articles on persuasion, presentations and difficult conversations.</li>
<li><a href="https://www.mindtools.com/" target="_blank" rel="noopener">MindTools</a> — communication, listening and meeting skills.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Toastmasters" target="_blank" rel="noopener">Toastmasters International</a> — public-speaking tips and speech examples.</li>
<li><a href="https://www.youtube.com/@CharismaonCommand" target="_blank" rel="noopener">Charisma on Command</a> — confidence and conversation skills.</li>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED</a> — model talks for studying structure and delivery.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://hemingwayapp.com/" target="_blank" rel="noopener">Hemingway Editor</a> — highlights long sentences and passive voice.</li>
<li><a href="https://www.grammarly.com/" target="_blank" rel="noopener">Grammarly</a> — grammar and tone checking for English messages.</li>
<li><a href="https://www.notion.so/" target="_blank" rel="noopener">Notion</a> — keep templates for emails, reports and meeting notes.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — the communication process, audience analysis and the writing process, following the lessons here.</li>
<li><strong>Practise</strong> — rewrite one real email a week with the plan–write–complete checklist.</li>
<li><strong>Go deeper</strong> — draft bad-news and persuasive messages, and rehearse a timed presentation.</li>
<li><strong>Apply</strong> — build your CV, cover letter and STAR answers, then do a mock interview.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">SSB201 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học giao tiếp kinh doanh: giáo trình &amp; slide chính thức, sách, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của SSB201.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://open.lib.umn.edu/businesscommunication/" target="_blank" rel="noopener">Business Communication for Success</a> — University of Minnesota Libraries Publishing: giáo trình mở miễn phí.</li>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">Business Communication Today</a> — Courtland L. Bovée &amp; John V. Thill (Pearson) — giáo trình kinh điển; tra tên sách trên trang nhà xuất bản.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.plainlanguage.gov/" target="_blank" rel="noopener">PlainLanguage.gov</a> — hướng dẫn chính thức về viết rõ ràng, hướng tới người đọc.</li>
<li><a href="https://hbr.org/" target="_blank" rel="noopener">Harvard Business Review</a> — bài viết về thuyết phục, thuyết trình và các cuộc nói chuyện khó.</li>
<li><a href="https://www.mindtools.com/" target="_blank" rel="noopener">MindTools</a> — kỹ năng giao tiếp, lắng nghe và điều hành cuộc họp.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Toastmasters" target="_blank" rel="noopener">Toastmasters International</a> — mẹo nói trước công chúng và bài nói mẫu.</li>
<li><a href="https://www.youtube.com/@CharismaonCommand" target="_blank" rel="noopener">Charisma on Command</a> — sự tự tin và kỹ năng trò chuyện.</li>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED</a> — bài nói mẫu để học cấu trúc và cách trình bày.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://hemingwayapp.com/" target="_blank" rel="noopener">Hemingway Editor</a> — đánh dấu câu dài và câu bị động.</li>
<li><a href="https://www.grammarly.com/" target="_blank" rel="noopener">Grammarly</a> — kiểm tra ngữ pháp và giọng điệu cho thư tiếng Anh.</li>
<li><a href="https://www.notion.so/" target="_blank" rel="noopener">Notion</a> — lưu mẫu email, báo cáo và biên bản họp.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — quá trình giao tiếp, phân tích người nhận và quy trình viết, theo đúng các bài ở đây.</li>
<li><strong>Luyện tập</strong> — mỗi tuần viết lại một email thật theo danh sách lập kế hoạch – soạn – hoàn thiện.</li>
<li><strong>Đào sâu</strong> — soạn thư tin xấu, thư thuyết phục và tập một bài thuyết trình có bấm giờ.</li>
<li><strong>Vận dụng</strong> — hoàn thiện CV, thư xin việc, câu trả lời STAR, rồi phỏng vấn thử.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'SSB201',
    slug: 'ssb201-advanced-business-communicationky-nang-giao-tiep-n226ng-cao-trong-kinh-doanh',
    title: 'Advanced Business Communication',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SSB201.webp',
    shortDescription: 'Communicate to get results: teamwork, listening and intercultural skills; the plan–write–complete process; routine, bad-news and persuasive messages; reports, proposals, presentations and job applications. Bilingual, with model letters and quizzes.|||Giao tiếp để đạt kết quả: làm việc nhóm, lắng nghe, đa văn hoá; quy trình viết; thư thường ngày, tin xấu, thuyết phục; báo cáo, đề xuất, thuyết trình, hồ sơ xin việc. Song ngữ, có thư mẫu và quiz.',
    description: 'Môn <strong>SSB201 — Advanced Business Communication (Kỹ năng giao tiếp nâng cao trong kinh doanh)</strong> (khối Quản trị Kinh doanh, kỳ 5) rèn cách giao tiếp để <strong>người nhận hiểu, chấp nhận và hành động</strong>. Từ <strong>quá trình giao tiếp, rào cản và đạo đức</strong> → <strong>làm việc nhóm, họp, lắng nghe, giao tiếp phi ngôn ngữ</strong> và <strong>giao tiếp đa văn hoá</strong> (Hall, Hofstede) → <strong>quy trình viết ba bước</strong> và văn phong hướng về người đọc → <strong>email, thư, thư báo nội bộ</strong> theo cách trực tiếp → <strong>thông điệp tin xấu</strong> (đoạn đệm, cách gián tiếp, truyền thông khủng hoảng) và <strong>thông điệp thuyết phục</strong> (ethos – logos – pathos, AIDA) → <strong>báo cáo, đề xuất</strong>, <strong>thuyết trình</strong> và <strong>CV, thư xin việc, phỏng vấn</strong>. Bám cấu trúc giáo trình giao tiếp kinh doanh chuẩn quốc tế (Bovée &amp; Thill, Guffey &amp; Loewy), song ngữ Anh–Việt, có thư mẫu hai thứ tiếng, bài tập tình huống (giả định) kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Giải thích quá trình giao tiếp, các rào cản và chuẩn mực đạo đức trong giao tiếp kinh doanh\nLàm việc nhóm, điều hành cuộc họp, lắng nghe chủ động và đọc tín hiệu phi ngôn ngữ\nĐiều chỉnh thông điệp cho người nhận khác văn hoá (ngữ cảnh cao – thấp, các chiều của Hofstede)\nÁp dụng quy trình viết ba bước và văn phong rõ ràng, súc tích, hướng về người đọc\nViết email, thư, thư báo nội bộ và thông điệp tin tốt theo cách trực tiếp\nViết thông điệp tin xấu theo cách gián tiếp và xử lý truyền thông khủng hoảng\nViết thông điệp thuyết phục, thư bán hàng theo AIDA; lập báo cáo, đề xuất và bản tóm tắt điều hành\nThuyết trình với slide hiệu quả; viết CV, thư xin việc và trả lời phỏng vấn theo STAR',
    requirements: 'Nên có nền tảng kỹ năng giao tiếp cơ bản và tiếng Anh thương mại từ các kỳ trước\nĐọc hiểu tiếng Anh ở mức trung cấp để luyện viết thư song ngữ\nSẵn sàng viết, sửa bản nháp và tập thuyết trình thành tiếng',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Quá trình giao tiếp, rào cản, mạng lưới trong tổ chức, đạo đức, lộ trình.', lessons: [intro] },
    { title: 'Part 1 — Interpersonal & intercultural foundations|||Phần 1 — Nền tảng giao tiếp liên cá nhân & đa văn hoá', description: 'Làm việc nhóm, họp, lắng nghe, phi ngôn ngữ, ngữ cảnh cao – thấp, Hofstede.', lessons: [c1, c2, q1] },
    { title: 'Part 2 — The writing process & routine messages|||Phần 2 — Quy trình viết & thông điệp thường ngày', description: 'Lập kế hoạch – soạn thảo – hoàn thiện, văn phong, email, thư, memo, tin tốt.', lessons: [c3, c4, e1, q2] },
    { title: 'Part 3 — Bad-news & persuasive messages|||Phần 3 — Thông điệp tin xấu & thuyết phục', description: 'Đoạn đệm, cách gián tiếp, khủng hoảng, ethos – logos – pathos, AIDA.', lessons: [c5, c6, e2, q3] },
    { title: 'Part 4 — Reports, presentations & employment messages|||Phần 4 — Báo cáo, thuyết trình & hồ sơ xin việc', description: 'Báo cáo, đề xuất, tóm tắt điều hành, slide, CV, thư xin việc, STAR.', lessons: [c7, c8, c9, q4] },
  ],
};
