/**
 * IT Interview Prep — Mục 0: Tuyển dụng IT diễn ra thế nào (soạn 15/11/2026).
 * Khoá chữ (không slide ảnh), khuôn khoá Redis + helper ./_pv.mjs. GIỮ slug bài của khung cũ.
 * LUẬT: backtick → &#96;; không viết "${" trong chữ; < > & trong chữ → &lt; &gt; &amp;; không gạch chéo ngược.
 */
import { ra, lienKet, nguon, yt, flow, stack, kv, bang, bay, keXau, doiThuong, neu, thucHanh, thuatNgu, tomTat, lienQuan, rubric, cau } from './_pv.mjs';

/* ═══════════════════════ Bắt đầu tại đây 1/2 ═══════════════════════ */
const B1 = {
  title: 'Start here (1/2) — How tech hiring works in Vietnam and abroad, and what interviewers look for|||Bắt đầu tại đây (1/2) — Tuyển dụng IT ở Việt Nam và nước ngoài diễn ra thế nào, người phỏng vấn tìm gì',
  slug: 'pv-0-8-bat-dau-tai-day',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài mở cửa: khoá này giúp bạn làm được gì, một quy trình tuyển dụng IT đi qua những vòng nào (lọc CV, bài test, kỹ thuật, văn hoá, offer), thực tập khác fresher ra sao, phỏng vấn đã thay đổi thế nào từ câu đố mẹo tới phỏng vấn có cấu trúc, và năm tín hiệu người phỏng vấn thật sự chấm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>How tech hiring works, and what the person across the table is looking for</h2>
<p class="lead">Hello. If you are a software engineering student about to apply for your first internship or junior job — and you feel that you "know some things" but have no idea what an interview actually checks — this course is written for you. It was written first for one specific learner: a student at FPT University who has to finish a CV in late November, apply for the OJT internship semester before mid-December, and has real projects to talk about but has never been taught how to talk about them.</p>
<p>By the end of the course you will have six concrete things in your hands, not just knowledge: <strong>a one-page technical CV</strong>, <strong>a GitHub profile with pinned, readable projects</strong>, <strong>a LinkedIn profile</strong>, <strong>five STAR stories</strong> drawn from your own projects, <strong>prepared answers for the technical rounds</strong> (backend, SQL, Git, Docker, frontend, Java/OOP, coding, a little system design), and <strong>a self-introduction you can say in Vietnamese and in English</strong>. Chapter 10 puts them together and ends with a full mock interview that you record and score yourself.</p>

<h3>An everyday picture first: an interview is a two-way viewing</h3>
${doiThuong('en', 'Think of looking for a room to rent. The landlord looks at you — do you pay on time, will you be a problem? — and you look at the room — is it noisy, is the landlord fair? Neither side can live there for a month before deciding, so both use a short visit to guess. An interview is exactly that: a company and a candidate, each guessing from one or two hours whether the next six months together will work. Everything in this course is about giving the other side good evidence — and collecting good evidence yourself.')}

<h3>The rounds, in the order you meet them</h3>
<p>Almost every tech hiring process, from a ten-person startup in Hanoi to a large company abroad, is some version of the same funnel. What changes is how many rounds there are and how formal each one is.</p>
${flow([
  ['1 · Apply', 'CV + links, through a job site, a referral or a school list', 'Your CV is read for a short time by a recruiter, sometimes after an applicant tracking system (ATS) has stored and searched it. Most rejections happen here, silently.'],
  ['2 · Screen', 'a short call with HR or a recruiter', 'Checks the basics: availability, the internship period, expected allowance, can you explain your CV in plain words.'],
  ['3 · Online test', 'a timed coding test or a technical quiz', 'Common at larger companies and for many applicants at once. Some companies skip it entirely.'],
  ['4 · Technical', 'one or two interviews with engineers', 'Questions about your projects and fundamentals, sometimes live coding. This is where depth is checked.'],
  ['5 · Culture / manager', 'a talk with a lead or manager', 'Behavioural questions: teamwork, mistakes, how you learn. Often decides between two technically similar candidates.'],
  ['6 · Offer', 'a letter or an email with the terms', 'Allowance or salary, period, working hours, conditions. You can still ask questions and compare (Chapter 9).'],
])}
<p>For an <strong>internship in Vietnam</strong>, steps 2 to 5 are often compressed into one or two meetings — sometimes a single hour where an engineer asks about your project and then a lead asks about you. For <strong>companies abroad or remote roles</strong>, the funnel is usually longer: a recruiter screen, a technical phone screen, then a "loop" of several interviews in one day, all in English, often across time zones.</p>

<h3>Intern, fresher, junior: three different bars</h3>
${bang(['', 'Intern (OJT)', 'Fresher', 'Junior'], [
  ['Who', 'Still studying; works for a fixed period', 'Just graduated, first full-time job', 'Has roughly a year of real work'],
  ['What they expect', 'Fundamentals, a project you understand, the ability to learn', 'Fundamentals plus one stack you can build with', 'Can take a ticket and ship it with light guidance'],
  ['What they forgive', 'Gaps in tools and experience', 'Some gaps, if you learn fast', 'Much less'],
  ['What sinks you', 'Not understanding your own CV', 'Shallow knowledge of the stack you claim', 'No evidence of shipping anything'],
])}
<p>The key message for an intern: <strong>potential and honesty weigh more than experience</strong>. Nobody expects you to know Kubernetes. They do expect you to explain, without notes, the project you put at the top of your CV.</p>

<h3>How interviews got this way — a short history</h3>
<p>It helps to know that interview formats are not laws of nature; they were invented, tried and changed.</p>
<ul>
<li><strong>1990s–2000s — the puzzle era.</strong> Microsoft became famous for brain-teasers ("How would you move Mount Fuji?" became the title of William Poundstone's 2003 book about it). Many companies copied the style.</li>
<li><strong>2013 — the puzzles are dropped.</strong> Google's head of people operations, Laszlo Bock, told the New York Times that brain-teasers were "a complete waste of time" because they did not predict how people performed at work. What Google kept were <strong>structured behavioural interviews</strong>: the same questions for every candidate, scored against the same criteria.</li>
<li><strong>The research behind it.</strong> A large review of 85 years of hiring studies (Schmidt &amp; Hunter, 1998) found that structured interviews predicted job performance clearly better than unstructured chats — which is why most serious companies now use question banks and scoring sheets. That is good news for you: the questions are predictable, so they can be prepared.</li>
<li><strong>2010s — the coding-test era.</strong> Online platforms made timed algorithm tests cheap, and "LeetCode-style" rounds spread everywhere, including in Vietnam.</li>
<li><strong>2023 onwards — the AI era.</strong> With AI assistants able to solve many take-home tasks, companies increasingly ask you to <em>explain and modify</em> code live, to talk through decisions, and to say honestly how you use AI. Chapter 3 has a lesson on exactly this.</li>
</ul>

<h3>What the interviewer is really scoring: five signals</h3>
${stack([
  ['1 · Fundamentals', 'Can you explain the basics of what you claim — HTTP, SQL, Git, the language you use — in your own words?'],
  ['2 · Problem solving out loud', 'When you do not know, do you reason step by step and say what you are thinking, or freeze?'],
  ['3 · Ownership of your work', 'Do you understand every line of your CV, including the parts a teammate or an AI tool wrote?'],
  ['4 · Communication', 'Can a stranger follow your explanation in two minutes? Do you ask when a question is unclear?'],
  ['5 · Learning and teamwork', 'Evidence that you learn on your own, accept feedback and do not blame others.'],
])}
<p>Notice what is <em>not</em> on the list: knowing every framework, having perfect English, or never making mistakes. A candidate who says "I don’t know that yet, but here is how I would find out" often scores higher than one who bluffs.</p>
${bay('en', 'waiting until you "know enough" before applying.', 'There is no such day. Interviewing is a skill learnt by doing it; your first two or three interviews will be your weakest whatever you do. Start sending applications while you study this course — Lesson 0.9 shows a four-week plan that does both at once.')}

<h3>What this means for you, this month</h3>
<p>If you are on the same path as the learner this course was written for, the dates are concrete: <strong>CV and portfolio in the last ten days of November</strong>, applications from then on, and a decision point around <strong>10 December</strong> — if no company has accepted you by then, register for a company from the school’s list before the mid-December OJT deadline, because passing the OJT semester matters more than where you do it. The course order follows that calendar: CV first, stories next, technical rounds after.</p>
${neu('en', 'you get an interview invitation next week, before you have finished the course? Take it. Read Chapter 2 (your story) and the technical lesson for that role the night before, and treat it as your first mock. A real interview you are not ready for teaches more than three you only imagined.')}

${thucHanh('en', { phut: '15–20', steps: [
  'Write three lines: the role you want first (for example "Backend intern, Node.js or Java"), the period you can work, and the date you want an offer by.',
  'Open two job sites and find five internship postings that are open now. For each, note which rounds the posting mentions (test? interview? how many?).',
  'Write down one project you would talk about if an interviewer called you tomorrow, and one thing in it you could not explain yet.',
], dat: 'you have a written target role and date, five real postings with their rounds noted, and one honest "weak spot" to fix.' })}
${thuatNgu('en', [
  ['ATS (applicant tracking system)', 'Software that stores applications and lets recruiters search and filter them.'],
  ['Screening call', 'A short first conversation, usually with HR, to check the basics.'],
  ['Technical round', 'An interview with engineers about fundamentals, your projects and sometimes live code.'],
  ['Behavioural interview', 'Questions about how you acted in past situations — teamwork, mistakes, pressure.'],
  ['Structured interview', 'Every candidate gets the same questions, scored on the same sheet.'],
  ['Offer', 'The written proposal of terms after you pass: pay, period, hours, conditions.'],
  ['Referral', 'An employee recommends you internally — often the fastest route to an interview.'],
])}
${tomTat('en', [
  'Hiring is a funnel: apply → screen → (test) → technical → culture/manager → offer; internships in Vietnam often compress it into one or two meetings.',
  'Interns are judged on potential and honesty; the fatal mistake is not understanding your own CV.',
  'Interviews moved from puzzles to structured interviews because the latter predict performance better — so the questions can be prepared.',
  'Interviewers score five signals: fundamentals, reasoning out loud, ownership, communication, learning and teamwork.',
  'Do not wait to "know enough": apply while you study, and treat the first interviews as practice.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-1-1-what-is-ojt', academy: true, L: 'en', title: 'Academy · OJT202 1.1 — OJT, prerequisites and the FPTU process', sub: 'The school side of the internship: eligibility on FAP, the six-step process, and why to start early.' }),
  yt('BH3y1V7KUKg', 'Tech With Tim', '7 Steps to Pass Technical Interviews', 12, 'en'),
  nguon('📘', 'Tech Interview Handbook', 'A free, well-maintained guide to the whole process, from CV to negotiation.', 'https://www.techinterviewhandbook.org/'),
  nguon('📰', 'New York Times (2013) — "In Head-Hunting, Big Data May Not Be Such a Big Deal"', 'The interview where Laszlo Bock explains why Google dropped brain-teasers.', 'https://www.nytimes.com/2013/06/20/business/in-head-hunting-big-data-may-not-be-such-a-big-deal.html'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Tuyển dụng IT diễn ra thế nào, và người ngồi đối diện bạn đang tìm gì</h2>
<p class="lead">Chào bạn. Nếu bạn là sinh viên kỹ thuật phần mềm sắp nộp đơn thực tập hoặc tìm việc junior đầu tiên — và bạn thấy mình "cũng biết vài thứ" nhưng không hình dung nổi một buổi phỏng vấn thật ra kiểm tra cái gì — thì khoá này viết cho bạn. Nó được viết trước hết cho một người học cụ thể: một sinh viên FPTU phải xong CV vào cuối tháng 11, nộp hồ sơ kỳ thực tập OJT trước giữa tháng 12, có dự án thật để kể nhưng chưa từng được dạy cách kể về chúng.</p>
<p>Học xong khoá, trong tay bạn có sáu thứ cụ thể chứ không chỉ kiến thức: <strong>một CV kỹ thuật một trang</strong>, <strong>một trang GitHub có dự án ghim, đọc là hiểu</strong>, <strong>một hồ sơ LinkedIn</strong>, <strong>năm câu chuyện STAR</strong> lấy từ chính dự án của bạn, <strong>bộ câu trả lời đã chuẩn bị cho các vòng kỹ thuật</strong> (backend, SQL, Git, Docker, frontend, Java/OOP, coding, một chút system design), và <strong>một đoạn tự giới thiệu nói được bằng tiếng Việt lẫn tiếng Anh</strong>. Chương 10 gom tất cả lại và kết thúc bằng một buổi phỏng vấn thử trọn vẹn mà bạn tự quay và tự chấm.</p>

<h3>Liên tưởng đời thường trước: phỏng vấn là một buổi đi xem phòng HAI chiều</h3>
${doiThuong('vi', 'Hãy nghĩ tới lúc đi tìm phòng trọ. Chủ nhà nhìn bạn — có trả tiền đúng hạn không, có gây phiền không — còn bạn nhìn căn phòng — có ồn không, chủ nhà có sòng phẳng không. Không bên nào được ở thử một tháng rồi mới quyết, nên cả hai dùng một buổi xem ngắn để đoán. Phỏng vấn đúng là như vậy: công ty và ứng viên, mỗi bên đoán từ một hai tiếng xem sáu tháng tới làm cùng nhau có ổn không. Cả khoá này xoay quanh việc đưa cho bên kia bằng chứng tốt — và tự thu thập bằng chứng tốt cho mình.')}

<h3>Các vòng, theo đúng thứ tự bạn sẽ gặp</h3>
<p>Gần như mọi quy trình tuyển dụng IT, từ một startup mười người ở Hà Nội tới một công ty lớn ở nước ngoài, đều là một biến thể của cùng một cái phễu. Chỉ khác nhau ở số vòng và mức độ trang trọng của từng vòng.</p>
${flow([
  ['1 · Ứng tuyển', 'CV + đường dẫn, qua trang việc làm, người giới thiệu hoặc danh sách của trường', 'CV của bạn được nhà tuyển dụng đọc trong thời gian rất ngắn, đôi khi sau khi hệ thống ATS (phần mềm quản lý hồ sơ ứng tuyển) đã lưu và cho tìm kiếm. Phần lớn lời từ chối xảy ra ở đây, trong im lặng.'],
  ['2 · Sàng lọc', 'một cuộc gọi ngắn với HR hoặc người tuyển dụng', 'Kiểm những thứ cơ bản: thời gian rảnh, thời gian thực tập, mức trợ cấp mong muốn, bạn có giải thích được CV bằng lời thường không.'],
  ['3 · Bài test online', 'bài code có giờ hoặc trắc nghiệm kỹ thuật', 'Hay gặp ở công ty lớn và khi tuyển nhiều người một lúc. Có công ty bỏ hẳn vòng này.'],
  ['4 · Kỹ thuật', 'một hai buổi với kỹ sư', 'Hỏi về dự án và kiến thức nền, đôi khi code trực tiếp. Đây là nơi độ sâu bị kiểm.'],
  ['5 · Văn hoá / quản lý', 'nói chuyện với trưởng nhóm hoặc quản lý', 'Câu hỏi hành vi: làm nhóm, sai lầm, cách bạn học. Thường là thứ quyết định giữa hai ứng viên ngang tay về kỹ thuật.'],
  ['6 · Offer', 'thư mời hoặc email ghi điều kiện', 'Trợ cấp hoặc lương, thời hạn, giờ làm, điều kiện. Bạn vẫn được hỏi lại và so sánh (Chương 9).'],
])}
<p>Với <strong>thực tập ở Việt Nam</strong>, các bước 2 tới 5 thường bị nén lại còn một hai buổi — có khi chỉ một tiếng: một kỹ sư hỏi về dự án, rồi trưởng nhóm hỏi về con người bạn. Với <strong>công ty nước ngoài hoặc việc remote</strong> (làm từ xa), phễu thường dài hơn: sàng lọc với recruiter, một buổi kỹ thuật qua điện thoại/video, rồi một "loop" (chuỗi phỏng vấn) gồm nhiều buổi trong một ngày, tất cả bằng tiếng Anh, nhiều khi lệch múi giờ.</p>

<h3>Intern, fresher, junior: ba mức chuẩn khác nhau</h3>
${bang(['', 'Intern (thực tập, OJT)', 'Fresher (mới ra trường)', 'Junior (đã đi làm ~1 năm)'], [
  ['Là ai', 'Còn đang học; làm trong một khoảng thời gian cố định', 'Vừa tốt nghiệp, việc toàn thời gian đầu tiên', 'Đã có khoảng một năm làm việc thật'],
  ['Họ kỳ vọng', 'Kiến thức nền, một dự án bạn hiểu, khả năng học', 'Nền tảng + một bộ công nghệ bạn tự dựng được sản phẩm', 'Nhận một đầu việc và hoàn thành với ít hướng dẫn'],
  ['Họ bỏ qua', 'Thiếu công cụ, thiếu kinh nghiệm', 'Thiếu một ít, nếu bạn học nhanh', 'Ít hơn nhiều'],
  ['Thứ đánh trượt bạn', 'Không hiểu chính CV của mình', 'Hiểu hời hợt bộ công nghệ mình ghi', 'Không có bằng chứng đã từng làm xong việc gì'],
])}
<p>Thông điệp mấu chốt cho intern: <strong>tiềm năng và sự trung thực nặng ký hơn kinh nghiệm</strong>. Không ai mong bạn biết Kubernetes. Nhưng họ mong bạn giải thích được, không cần giấy, cái dự án bạn đặt ở đầu CV.</p>

<h3>Phỏng vấn thành ra như bây giờ thế nào — lịch sử ngắn</h3>
<p>Biết rằng các kiểu phỏng vấn không phải định luật tự nhiên — chúng được nghĩ ra, thử, rồi thay đổi — giúp bạn bớt sợ hơn nhiều.</p>
<ul>
<li><strong>Thập niên 1990–2000 — thời câu đố mẹo.</strong> Microsoft nổi tiếng với các câu đố kiểu "Làm sao dời núi Phú Sĩ?" (thành tên cuốn sách năm 2003 của William Poundstone viết về chuyện này). Rất nhiều công ty bắt chước.</li>
<li><strong>2013 — câu đố bị bỏ.</strong> Laszlo Bock, người phụ trách nhân sự của Google, nói với báo New York Times rằng câu đố mẹo "hoàn toàn lãng phí thời gian" vì chúng không dự đoán được người ta làm việc ra sao. Thứ Google giữ lại là <strong>phỏng vấn hành vi có cấu trúc</strong>: mọi ứng viên cùng một bộ câu hỏi, chấm theo cùng một bộ tiêu chí.</li>
<li><strong>Nghiên cứu đứng sau.</strong> Một tổng hợp lớn của 85 năm nghiên cứu tuyển dụng (Schmidt &amp; Hunter, 1998) cho thấy phỏng vấn có cấu trúc dự đoán hiệu quả công việc tốt hơn rõ rệt so với kiểu nói chuyện tự do — vì vậy hầu hết công ty nghiêm túc bây giờ dùng ngân hàng câu hỏi và phiếu chấm. Đây là tin tốt cho bạn: câu hỏi đoán trước được, nên chuẩn bị được.</li>
<li><strong>Thập niên 2010 — thời bài test code.</strong> Các nền tảng online làm cho bài thuật toán có giờ trở nên rẻ, và vòng "kiểu LeetCode" lan ra khắp nơi, kể cả Việt Nam.</li>
<li><strong>Từ 2023 — thời AI.</strong> Khi trợ lý AI giải được nhiều bài làm ở nhà, công ty ngày càng bắt bạn <em>giải thích và sửa</em> code ngay tại chỗ, nói rõ vì sao mình quyết định thế, và nói thật mình dùng AI ra sao. Chương 3 có hẳn một bài về chuyện này.</li>
</ul>

<h3>Người phỏng vấn thật ra đang chấm gì: năm tín hiệu</h3>
${stack([
  ['1 · Kiến thức nền', 'Bạn giải thích được phần cơ bản của thứ mình ghi — HTTP, SQL, Git, ngôn ngữ bạn dùng — bằng lời của chính mình không?'],
  ['2 · Giải quyết vấn đề thành tiếng', 'Khi không biết, bạn có suy luận từng bước và nói ra mình đang nghĩ gì, hay đứng hình?'],
  ['3 · Làm chủ sản phẩm của mình', 'Bạn hiểu từng dòng trong CV không — kể cả phần bạn cùng nhóm hay công cụ AI viết?'],
  ['4 · Giao tiếp', 'Một người lạ theo kịp lời giải thích của bạn trong hai phút không? Bạn có hỏi lại khi câu hỏi chưa rõ?'],
  ['5 · Học hỏi và làm nhóm', 'Bằng chứng bạn tự học, nhận góp ý, và không đổ lỗi cho người khác.'],
])}
<p>Để ý thứ KHÔNG có trong danh sách: biết mọi framework, tiếng Anh hoàn hảo, hay chưa từng sai. Một ứng viên nói "Em chưa biết cái đó, nhưng em sẽ tìm hiểu như thế này…" thường được điểm cao hơn người chém gió.</p>
${bay('vi', 'đợi tới khi "biết đủ" mới nộp đơn.', 'Không có ngày đó. Phỏng vấn là một kỹ năng học bằng cách làm; hai ba buổi đầu tiên sẽ là những buổi kém nhất của bạn dù bạn có làm gì. Hãy nộp đơn TRONG LÚC học khoá này — bài 0.9 có kế hoạch bốn tuần làm được cả hai việc cùng lúc.')}

<h3>Điều này có nghĩa gì với bạn, ngay tháng này</h3>
<p>Nếu bạn đi cùng con đường với người học mà khoá này viết cho, các mốc rất cụ thể: <strong>CV và portfolio trong mười ngày cuối tháng 11</strong>, nộp đơn từ đó trở đi, và một điểm quyết định quanh <strong>ngày 10/12</strong> — nếu tới lúc đó chưa có công ty nhận, hãy đăng ký một công ty trong danh sách của trường trước hạn OJT giữa tháng 12, vì qua được kỳ OJT quan trọng hơn là làm ở đâu. Thứ tự các chương đi theo đúng lịch đó: CV trước, câu chuyện sau, các vòng kỹ thuật sau nữa.</p>
${neu('vi', 'tuần sau bạn nhận được lời mời phỏng vấn, khi chưa học xong khoá? Nhận luôn. Tối hôm trước đọc Chương 2 (câu chuyện của bạn) và bài kỹ thuật đúng vị trí đó, rồi coi buổi ấy là buổi phỏng vấn thử đầu tiên. Một buổi thật dù chưa sẵn sàng dạy bạn nhiều hơn ba buổi chỉ tưởng tượng.')}

${thucHanh('vi', { phut: '15–20', steps: [
  'Viết ba dòng: vị trí bạn nhắm trước tiên (ví dụ "Thực tập backend, Node.js hoặc Java"), khoảng thời gian bạn làm được, và ngày bạn muốn có offer.',
  'Mở hai trang việc làm và tìm năm tin tuyển thực tập đang mở. Với mỗi tin, ghi lại tin nói có những vòng nào (có test không? phỏng vấn mấy vòng?).',
  'Ghi ra một dự án bạn sẽ kể nếu ngày mai có người gọi phỏng vấn, và một chỗ trong dự án đó bạn CHƯA giải thích được.',
], dat: 'bạn có vị trí mục tiêu + ngày mục tiêu viết ra giấy, năm tin tuyển dụng thật kèm số vòng, và một "điểm yếu" thành thật để sửa.' })}
${thuatNgu('vi', [
  ['ATS (hệ thống quản lý hồ sơ ứng tuyển)', 'Phần mềm lưu đơn ứng tuyển, cho người tuyển dụng tìm và lọc.'],
  ['Screening call (cuộc gọi sàng lọc)', 'Cuộc nói chuyện đầu tiên, ngắn, thường với HR, để kiểm thông tin cơ bản.'],
  ['Technical round (vòng kỹ thuật)', 'Buổi phỏng vấn với kỹ sư về kiến thức nền, dự án và đôi khi code trực tiếp.'],
  ['Behavioural interview (phỏng vấn hành vi)', 'Câu hỏi về cách bạn đã hành động trong tình huống thật — làm nhóm, sai lầm, áp lực.'],
  ['Structured interview (phỏng vấn có cấu trúc)', 'Mọi ứng viên cùng một bộ câu hỏi, chấm trên cùng một phiếu.'],
  ['Offer (thư mời nhận việc)', 'Đề nghị điều kiện bằng văn bản sau khi bạn qua: tiền, thời hạn, giờ làm, điều kiện.'],
  ['Referral (giới thiệu nội bộ)', 'Một nhân viên giới thiệu bạn từ bên trong — thường là đường nhanh nhất tới buổi phỏng vấn.'],
])}
${tomTat('vi', [
  'Tuyển dụng là một cái phễu: ứng tuyển → sàng lọc → (test) → kỹ thuật → văn hoá/quản lý → offer; thực tập ở Việt Nam hay nén còn một hai buổi.',
  'Intern được chấm theo tiềm năng và sự trung thực; lỗi chết người là không hiểu chính CV của mình.',
  'Phỏng vấn đã chuyển từ câu đố sang phỏng vấn có cấu trúc vì kiểu sau dự đoán tốt hơn — nên câu hỏi chuẩn bị được.',
  'Người phỏng vấn chấm năm tín hiệu: nền tảng, suy luận thành tiếng, làm chủ sản phẩm, giao tiếp, học hỏi và làm nhóm.',
  'Đừng đợi "biết đủ": vừa học vừa nộp, và coi mấy buổi đầu là buổi luyện.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-1-1-what-is-ojt', academy: true, title: 'Academy · OJT202 1.1 — OJT, điều kiện tiên quyết và quy trình FPTU', sub: 'Phía nhà trường của kỳ thực tập: điều kiện trên FAP, quy trình sáu bước, và vì sao phải bắt đầu sớm.' }),
  yt('BH3y1V7KUKg', 'Tech With Tim', '7 Steps to Pass Technical Interviews', 12),
  nguon('📘', 'Tech Interview Handbook', 'Cẩm nang miễn phí, được cập nhật đều, đi hết quy trình từ CV tới thương lượng (tiếng Anh).', 'https://www.techinterviewhandbook.org/'),
  nguon('📰', 'New York Times (2013) — "In Head-Hunting, Big Data May Not Be Such a Big Deal"', 'Bài phỏng vấn Laszlo Bock giải thích vì sao Google bỏ câu đố mẹo.', 'https://www.nytimes.com/2013/06/20/business/in-head-hunting-big-data-may-not-be-such-a-big-deal.html'),
])}
</div>
`,
};

/* ═══════════════════════ Bắt đầu tại đây 2/2 ═══════════════════════ */
const B2 = {
  title: 'Start here (2/2) — Why good students fail interviews, and a four-week plan that fits your calendar|||Bắt đầu tại đây (2/2) — Vì sao sinh viên giỏi vẫn trượt phỏng vấn, và kế hoạch bốn tuần khớp lịch của bạn',
  slug: 'pv-0-9-bat-dau-khi-khong-co',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám kiểu trượt phỏng vấn hay gặp ở sinh viên (kể như tình huống minh hoạ), một cái bẫy thật nhắm vào người tìm việc IT, kế hoạch bốn tuần từ 15/11 tới hạn OJT giữa tháng 12 có tính cả tuần thi, nhịp một buổi học, và cách không nản khi bị từ chối.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>Why good students still fail interviews — and a plan that fits your real calendar</h2>
<p class="lead">Interviews are not lost on intelligence. They are lost on a handful of predictable mistakes, almost all of which are about preparation and communication rather than knowledge. This lesson names the eight we see most often, shows one real danger that targets developers looking for work, and then gives you a four-week plan built around actual dates — including the exam week you may be in right now.</p>

<h3>Eight ways strong students lose interviews</h3>
<p>These are <strong>illustrative situations</strong>, assembled from patterns that interview guides and interviewers describe again and again — not stories about named people. Read each and ask: "Would that be me?"</p>
${bang(['#', 'What happens', 'Why it sinks you', 'Fixed in'], [
  ['1', 'The CV lists 15 technologies. The interviewer picks one ("you wrote Redis — when would you not cache?") and the answer is silence.', 'One unexplained line makes them doubt every other line.', 'Ch1, Ch4–6'],
  ['2', '"In the team project I did the frontend." Asked what exactly, the answer is vague.', 'They cannot tell what you can do alone.', 'Ch1.2, Ch2'],
  ['3', 'Live coding in total silence for ten minutes, then a half-finished answer.', 'Silence gives no evidence; a wrong answer explained out loud gives a lot.', 'Ch7'],
  ['4', '"Tell me about a conflict" — and the answer blames a teammate.', 'They imagine you blaming them six months from now.', 'Ch3'],
  ['5', '"Do you have any questions for us?" — "No."', 'It reads as no interest in the job.', 'Ch2.4'],
  ['6', 'An online interview: late by eight minutes, microphone not tested, a messy background.', 'First impressions are hard to undo.', 'Ch9'],
  ['7', 'The question is in English, not understood, and the candidate guesses instead of asking.', 'Answering the wrong question looks worse than asking to repeat.', 'Ch8.4'],
  ['8', 'A take-home solved with an AI tool that the candidate cannot explain when asked to change one thing.', 'It is read as dishonesty, not as skill.', 'Ch3.3, Ch7.4'],
])}
<p>Notice that only the first one is mostly about knowledge — and even that one is really about <strong>putting on the CV only what you can defend</strong>.</p>

<h3>A real danger: the fake interview</h3>
${keXau('en', 'Since at least late 2022, security researchers at Palo Alto Networks Unit 42 have tracked a campaign they named "Contagious Interview": attackers pose as recruiters, invite software developers to an online interview, and ask them to download and run a "test project" — which installs malware that steals passwords and crypto wallets. It is attributed to a state-sponsored group, and it targets exactly people like you: developers eager to show they can run a project. Defence: never run an unknown repository on your main machine; read <code>package.json</code> scripts (especially <code>postinstall</code>) before <code>npm install</code>; run strangers’ code in a container or a throw-away virtual machine; and check that the company and the recruiter actually exist (official website, a real company email domain, LinkedIn history). Lesson 0.1 shows more scam patterns.')}

<h3>The four-week plan, with real dates</h3>
<p>This plan assumes the calendar of an FPTU student in the Fall 2026 term: final exams around 17–21 November, CV work from 20 to 29 November, and the OJT registration deadline in mid-December. Shift the dates if yours differ — keep the order.</p>
${flow([
  ['Week 0 · 15–21/11 (exam week)', '20 minutes a day, no more', 'Section 0 only. Build your application tracker (Lab 0.3), collect raw material: screenshots, links and notes for every project you have done. Your exams come first.'],
  ['Week 1 · 22–29/11', 'CV week — the most important one', 'Chapter 1 (CV, projects, GitHub, LinkedIn) and Chapter 2 (self-introduction, STAR). By 29/11: a finished CV and pinned GitHub repositories. Start applying.'],
  ['Week 2 · 30/11–6/12', 'stories and the technical round for your role', 'Chapter 3 (behavioural) plus the technical chapter that matches your target: Ch4 backend, Ch5 DevOps, Ch6 frontend. Apply to a few companies every day.'],
  ['Week 3 · 7–13/12', 'mock, English, decision', 'Chapter 7 (coding), Chapter 8 (English), Chapter 9 (mock and offer), Chapter 10 (the full kit). Around 10/12: if nothing is confirmed, register a school-listed company before the deadline.'],
])}
${bay('en', 'studying in exam week instead of revising for exams.', 'Failing a subject now can push the internship itself back a semester (internship eligibility depends on how many subjects you still owe). Twenty calm minutes a day on Section 0 is enough this week. The CV work starts the moment the exams end.')}

<h3>The rhythm of one study session (60–90 minutes)</h3>
<ol>
<li><strong>Read the lesson</strong> once, fast, then the examples slowly (15–20 min).</li>
<li><strong>Answer out loud before opening the sample answer.</strong> Every interview question in this course hides its sample answer in a collapsible box. Say yours first — out loud, not in your head. This is the single most important habit in the course.</li>
<li><strong>Do the 🧪 practice</strong> and save its output (a file, a recording, a filled table) in one folder, for example <code>~/interview-kit/</code>.</li>
<li><strong>Do the chapter quiz</strong> at the end of each chapter, and note every question you got wrong.</li>
<li><strong>Update your tracker</strong>: applications sent today, replies, next steps.</li>
</ol>

<h3>How not to give up</h3>
<p>Rejection is the normal result of an application, not a judgement of you. Many postings get far more applicants than places, and most companies never explain their decisions. So measure <strong>what you control</strong>: applications sent per week, mock interviews done, stories prepared. If after about twenty applications nobody replies, the problem is almost always the CV or the targeting — Chapter 1 shows how to diagnose it. If you get interviews but no offers, it is the stories or the technical depth — Chapters 2 to 7. Either way, you will know what to fix.</p>
${neu('en', 'you are rejected after an interview you thought went well? Send a short thank-you, ask politely for one piece of feedback (Lesson 9.2 has the email), write down the three questions that were hardest, and turn each into a prepared answer. That is how the next interview gets better.')}

${thucHanh('en', { phut: '15–20', steps: [
  'Read the table of eight mistakes and mark the two you are most likely to make. Write one sentence for each on how you will avoid it.',
  'Copy the four-week plan into your calendar with your real dates (exams, block 5, any deadline your school gave you).',
  'Create the folder <code>~/interview-kit/</code> with sub-folders <code>cv</code>, <code>stories</code>, <code>tech</code>, <code>english</code>, <code>mock</code>.',
], dat: 'your calendar has the four weeks with real dates, you know your two personal risks, and the kit folder exists.' })}
${thuatNgu('en', [
  ['Take-home assignment', 'A task you do at home in a few hours or days and submit, often followed by a talk about it.'],
  ['Live coding', 'Writing code while the interviewer watches, usually in a shared editor.'],
  ['Mock interview', 'A practice interview, with a friend, a mentor or yourself on camera, scored afterwards.'],
  ['Feedback', 'Comments on how you did; companies do not always give it, but it is fine to ask once.'],
  ['Malware', 'Software that harms you — steals passwords, files or money.'],
  ['postinstall script', 'A command in package.json that npm runs automatically after installing — a common hiding place for malicious code.'],
])}
${tomTat('en', [
  'Most interview failures are about preparation and communication, not intelligence.',
  'Only put on your CV what you can defend under three follow-up questions.',
  'Fake interviews with "test projects" are a real malware campaign against developers — run unknown code only in a container or VM.',
  'Follow the four weeks in order: tracker → CV and stories → technical round for your role → mock, English and the decision around 10/12.',
  'Always answer out loud before reading a sample answer.',
  'Measure what you control (applications, mocks, stories), not rejections.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-2-1-cv-portfolio', academy: true, L: 'en', title: 'Academy · OJT202 2.1 — CV, portfolio and interview prep', sub: 'The school’s short version of this course — useful to see what the coordinator expects.' }),
  yt('1t1_a1BZ04o', 'Fireship', 'How to NOT Fail a Technical Interview', 8, 'en'),
  nguon('🛡️', 'Unit 42 (2023) — Two job-related campaigns from North Korean threat actors', 'The original research on "Contagious Interview": fake recruiters, malicious test projects.', 'https://unit42.paloaltonetworks.com/two-campaigns-by-north-korea-bad-actors-target-job-hunters/'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Vì sao sinh viên giỏi vẫn trượt phỏng vấn — và một kế hoạch khớp với lịch thật của bạn</h2>
<p class="lead">Người ta không trượt phỏng vấn vì kém thông minh. Người ta trượt vì một nhúm lỗi đoán trước được, hầu như đều thuộc về chuẩn bị và giao tiếp hơn là kiến thức. Bài này gọi tên tám lỗi hay gặp nhất, chỉ ra một mối nguy THẬT nhắm vào lập trình viên đang tìm việc, rồi đưa bạn kế hoạch bốn tuần dựng trên ngày tháng thật — tính cả tuần thi mà có thể bạn đang ở trong đó.</p>

<h3>Tám kiểu sinh viên giỏi đánh rơi buổi phỏng vấn</h3>
<p>Đây là <strong>tình huống minh hoạ</strong>, gom từ những khuôn mẫu mà các cẩm nang phỏng vấn và người phỏng vấn kể đi kể lại — không phải chuyện của người có tên thật. Đọc từng dòng và tự hỏi: "Mình có thế không?"</p>
${bang(['#', 'Chuyện gì xảy ra', 'Vì sao nó đánh trượt bạn', 'Sửa ở'], [
  ['1', 'CV ghi 15 công nghệ. Người phỏng vấn chọn một cái ("em ghi Redis — khi nào thì KHÔNG nên cache?") và câu trả lời là im lặng.', 'Một dòng không giải thích được làm họ nghi ngờ mọi dòng còn lại.', 'Ch1, Ch4–6'],
  ['2', '"Trong đồ án nhóm em làm frontend." Hỏi cụ thể làm gì thì trả lời mơ hồ.', 'Họ không biết một mình bạn làm được gì.', 'Ch1.2, Ch2'],
  ['3', 'Code trực tiếp trong im lặng tuyệt đối mười phút, rồi nộp một lời giải dở dang.', 'Im lặng không cho bằng chứng gì; một lời giải sai nhưng nói ra thành tiếng cho rất nhiều.', 'Ch7'],
  ['4', '"Kể về một lần mâu thuẫn" — và câu trả lời đổ lỗi cho bạn cùng nhóm.', 'Họ hình dung sáu tháng sau bạn đổ lỗi cho chính họ.', 'Ch3'],
  ['5', '"Em có câu hỏi gì cho bên anh chị không?" — "Dạ không ạ."', 'Nghe như không quan tâm tới công việc.', 'Ch2.4'],
  ['6', 'Phỏng vấn online: trễ tám phút, chưa thử micro, phía sau lộn xộn.', 'Ấn tượng đầu rất khó gỡ.', 'Ch9'],
  ['7', 'Câu hỏi bằng tiếng Anh, không hiểu, và ứng viên đoán bừa thay vì hỏi lại.', 'Trả lời nhầm câu hỏi trông tệ hơn nhiều so với xin nhắc lại.', 'Ch8.4'],
  ['8', 'Bài làm ở nhà giải bằng AI, khi được nhờ sửa một chỗ thì không giải thích được.', 'Bị đọc là thiếu trung thực, không phải là giỏi.', 'Ch3.3, Ch7.4'],
])}
<p>Để ý rằng chỉ lỗi đầu tiên chủ yếu là chuyện kiến thức — và ngay cả lỗi đó thật ra cũng là chuyện <strong>chỉ ghi vào CV những gì bạn bảo vệ được</strong>.</p>

<h3>Một mối nguy có thật: buổi phỏng vấn giả</h3>
${keXau('vi', 'Từ ít nhất cuối năm 2022, nhóm nghiên cứu bảo mật Unit 42 của Palo Alto Networks theo dõi một chiến dịch họ đặt tên là "Contagious Interview" (phỏng vấn lây nhiễm): kẻ tấn công đóng vai nhà tuyển dụng, mời lập trình viên phỏng vấn online, rồi nhờ tải về và chạy một "dự án bài test" — thứ thật ra cài mã độc lấy cắp mật khẩu và ví tiền điện tử. Chiến dịch được quy cho một nhóm có nhà nước đứng sau, và nhắm đúng những người như bạn: lập trình viên háo hức chứng tỏ mình chạy được dự án. Cách phòng: không bao giờ chạy kho mã lạ trên máy chính; đọc phần <code>scripts</code> trong <code>package.json</code> (nhất là <code>postinstall</code> — lệnh npm tự chạy sau khi cài) trước khi <code>npm install</code>; chạy mã của người lạ trong container hoặc máy ảo dùng một lần; và kiểm công ty với người tuyển dụng có thật không (trang web chính thức, email đúng tên miền công ty, lịch sử LinkedIn). Bài 0.1 có thêm các kiểu lừa khác.')}

<h3>Kế hoạch bốn tuần, theo ngày thật</h3>
<p>Kế hoạch này giả định lịch của một sinh viên FPTU kỳ Fall 2026: thi cuối kỳ khoảng 17–21/11, làm CV từ 20 tới 29/11, và hạn đăng ký OJT vào giữa tháng 12. Lịch của bạn khác thì dời ngày — nhưng giữ thứ tự.</p>
${flow([
  ['Tuần 0 · 15–21/11 (tuần thi)', '20 phút mỗi ngày, không hơn', 'Chỉ Mục 0. Dựng bảng theo dõi ứng tuyển (Lab 0.3), gom nguyên liệu thô: ảnh chụp, đường dẫn, ghi chú của mọi dự án bạn từng làm. Bài thi là ưu tiên số một.'],
  ['Tuần 1 · 22–29/11', 'tuần CV — tuần quan trọng nhất', 'Chương 1 (CV, dự án, GitHub, LinkedIn) và Chương 2 (tự giới thiệu, STAR). Tới 29/11: CV xong và GitHub đã ghim dự án. Bắt đầu nộp đơn.'],
  ['Tuần 2 · 30/11–6/12', 'câu chuyện + vòng kỹ thuật của vị trí bạn nhắm', 'Chương 3 (hành vi) cùng chương kỹ thuật khớp mục tiêu: Ch4 backend, Ch5 DevOps, Ch6 frontend. Mỗi ngày nộp vài công ty.'],
  ['Tuần 3 · 7–13/12', 'phỏng vấn thử, tiếng Anh, quyết định', 'Chương 7 (coding), Chương 8 (tiếng Anh), Chương 9 (phỏng vấn thử + offer), Chương 10 (bộ hồ sơ trọn vẹn). Quanh 10/12: nếu chưa chốt được nơi nào, đăng ký công ty trong danh sách trường trước hạn.'],
])}
${bay('vi', 'ngồi học khoá này trong tuần thi thay vì ôn thi.', 'Trượt một môn bây giờ có thể đẩy chính kỳ thực tập lùi một kỳ (điều kiện đi OJT phụ thuộc vào số môn bạn còn nợ). Tuần này hai mươi phút thong thả mỗi ngày cho Mục 0 là đủ. Việc CV bắt đầu ngay khi thi xong.')}

<h3>Nhịp của một buổi học (60–90 phút)</h3>
<ol>
<li><strong>Đọc bài</strong> một lượt thật nhanh, rồi đọc chậm phần ví dụ (15–20 phút).</li>
<li><strong>Trả lời thành tiếng TRƯỚC khi mở câu trả lời mẫu.</strong> Mọi câu hỏi phỏng vấn trong khoá đều giấu câu trả lời mẫu trong một ô gập. Hãy nói câu của bạn trước — nói ra miệng, không nghĩ trong đầu. Đây là thói quen quan trọng nhất của cả khoá.</li>
<li><strong>Làm phần 🧪 thực hành</strong> và lưu sản phẩm (một tệp, một đoạn ghi âm, một bảng đã điền) vào một thư mục, ví dụ <code>~/interview-kit/</code>.</li>
<li><strong>Làm quiz chương</strong> ở cuối mỗi chương, ghi lại mọi câu làm sai.</li>
<li><strong>Cập nhật bảng theo dõi</strong>: hôm nay nộp mấy đơn, ai trả lời, bước tiếp theo là gì.</li>
</ol>

<h3>Làm sao để không nản</h3>
<p>Bị từ chối là kết quả BÌNH THƯỜNG của một lá đơn, không phải lời phán xét về bạn. Nhiều tin tuyển dụng nhận số đơn lớn hơn rất nhiều so với số chỗ, và đa số công ty không bao giờ giải thích quyết định. Vì vậy hãy đo <strong>những gì bạn kiểm soát được</strong>: số đơn nộp mỗi tuần, số buổi phỏng vấn thử, số câu chuyện đã chuẩn bị. Nếu sau khoảng hai mươi đơn không ai trả lời, vấn đề gần như luôn là CV hoặc nhắm sai chỗ — Chương 1 chỉ cách chẩn đoán. Nếu được gọi phỏng vấn mà không có offer, vấn đề là câu chuyện hoặc độ sâu kỹ thuật — Chương 2 tới 7. Dù thế nào, bạn sẽ biết phải sửa cái gì.</p>
${neu('vi', 'bạn bị từ chối sau một buổi mà bạn tưởng mình làm tốt? Gửi một lời cảm ơn ngắn, lịch sự xin một góp ý (bài 9.2 có mẫu email), ghi lại ba câu hỏi khó nhất, và biến mỗi câu thành một câu trả lời đã chuẩn bị. Buổi sau sẽ tốt hơn đúng nhờ việc đó.')}

${thucHanh('vi', { phut: '15–20', steps: [
  'Đọc bảng tám lỗi và đánh dấu hai lỗi bạn dễ mắc nhất. Viết cho mỗi lỗi một câu: bạn sẽ tránh nó thế nào.',
  'Chép kế hoạch bốn tuần vào lịch của bạn với ngày thật (ngày thi, block 5, mọi hạn trường đã báo).',
  'Tạo thư mục <code>~/interview-kit/</code> với các thư mục con <code>cv</code>, <code>stories</code>, <code>tech</code>, <code>english</code>, <code>mock</code>.',
], dat: 'lịch của bạn có đủ bốn tuần với ngày thật, bạn biết hai rủi ro của riêng mình, và thư mục bộ hồ sơ đã có.' })}
${thuatNgu('vi', [
  ['Take-home assignment (bài làm ở nhà)', 'Một đề bạn làm ở nhà trong vài giờ hoặc vài ngày rồi nộp, thường kèm một buổi trao đổi về nó.'],
  ['Live coding (code trực tiếp)', 'Viết code trong khi người phỏng vấn xem, thường trên một trình soạn thảo chung.'],
  ['Mock interview (phỏng vấn thử)', 'Buổi phỏng vấn tập, với bạn bè, người hướng dẫn, hoặc tự quay camera, chấm lại sau.'],
  ['Feedback (góp ý)', 'Nhận xét về phần thể hiện; công ty không phải lúc nào cũng gửi, nhưng hỏi một lần là bình thường.'],
  ['Malware (mã độc)', 'Phần mềm gây hại — lấy mật khẩu, tệp, hay tiền của bạn.'],
  ['postinstall script', 'Một lệnh trong package.json mà npm TỰ chạy sau khi cài — chỗ hay giấu mã độc.'],
])}
${tomTat('vi', [
  'Phần lớn lần trượt phỏng vấn là do chuẩn bị và giao tiếp, không phải do kém thông minh.',
  'Chỉ ghi vào CV những gì bạn bảo vệ được qua ba câu hỏi đào sâu.',
  'Phỏng vấn giả kèm "dự án bài test" là một chiến dịch mã độc có thật nhắm vào lập trình viên — chỉ chạy mã lạ trong container hoặc máy ảo.',
  'Đi bốn tuần theo đúng thứ tự: bảng theo dõi → CV và câu chuyện → vòng kỹ thuật của vị trí → phỏng vấn thử, tiếng Anh và quyết định quanh 10/12.',
  'Luôn trả lời thành tiếng trước khi đọc câu trả lời mẫu.',
  'Đo những gì bạn kiểm soát (đơn, buổi thử, câu chuyện), đừng đo lời từ chối.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-2-1-cv-portfolio', academy: true, title: 'Academy · OJT202 2.1 — CV, portfolio và chuẩn bị phỏng vấn', sub: 'Bản ngắn của nhà trường cho đúng chủ đề khoá này — xem để biết điều phối viên OJT kỳ vọng gì.' }),
  yt('1t1_a1BZ04o', 'Fireship', 'How to NOT Fail a Technical Interview', 8),
  nguon('🛡️', 'Unit 42 (2023) — Hai chiến dịch liên quan tới việc làm của nhóm tấn công Triều Tiên', 'Nghiên cứu gốc về "Contagious Interview": nhà tuyển dụng giả, dự án bài test chứa mã độc (tiếng Anh).', 'https://unit42.paloaltonetworks.com/two-campaigns-by-north-korea-bad-actors-target-job-hunters/'),
])}
</div>
`,
};

/* ═══════════════════════ 0.1 — Tìm việc ở đâu ═══════════════════════ */
const TIN_MAU_EN = `
BACKEND INTERN (Node.js) — 3 months, Ho Chi Minh City / hybrid      [illustrative posting]

Responsibilities
- Build and maintain REST APIs for our booking product
- Write unit tests and fix bugs reported by QA
- Join daily stand-ups and code reviews

Requirements
- Final-year student in IT / Software Engineering
- Good knowledge of JavaScript; basic Node.js / Express
- Understand SQL (PostgreSQL or MySQL)
- Familiar with Git
- Able to read English technical documents

Nice to have
- TypeScript, Docker, any cloud
- Personal projects on GitHub

We offer
- Monthly allowance, mentor, chance to become full-time after the internship
- Support with university internship paperwork
`;

const TIN_MAU_VI = `
THỰC TẬP SINH BACKEND (Node.js) — 3 tháng, TP.HCM / hybrid        [tin mẫu minh hoạ]

Mô tả công việc
- Xây dựng và bảo trì REST API cho sản phẩm đặt lịch
- Viết unit test và sửa lỗi do QA báo
- Tham gia họp đứng hằng ngày và review code

Yêu cầu
- Sinh viên năm cuối ngành CNTT / Kỹ thuật phần mềm
- Nắm tốt JavaScript; biết cơ bản Node.js / Express
- Hiểu SQL (PostgreSQL hoặc MySQL)
- Quen dùng Git
- Đọc hiểu tài liệu kỹ thuật tiếng Anh

Ưu tiên
- TypeScript, Docker, cloud bất kỳ
- Có dự án cá nhân trên GitHub

Quyền lợi
- Trợ cấp hằng tháng, có mentor, cơ hội lên chính thức sau thực tập
- Hỗ trợ giấy tờ thực tập với nhà trường
`;

const L01 = {
  title: '0.1 — Where to find internships and jobs, how to read a posting, and how to spot a scam|||0.1 — Tìm việc ở đâu, đọc tin tuyển dụng thế nào, và nhận ra tin lừa đảo',
  slug: 'pv-0-1-tim-viec',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Các kênh tìm thực tập và việc IT ở Việt Nam và nước ngoài (ITviec, TopCV, TopDev, VietnamWorks, LinkedIn, trang công ty, giới thiệu nội bộ, danh sách OJT của trường), giải mã một tin tuyển dụng từng dòng, luật "khớp khoảng 60% là nộp", và các dấu hiệu tin lừa đảo.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Where the jobs are, how to read a posting, and how to tell a real one from a trap</h2>
<p class="lead">Most students search in one place, apply to the first ten postings they see, and conclude that "nobody replies". This lesson spreads your search over the channels that actually work for interns in Vietnam and abroad, teaches you to read a posting the way a hiring manager wrote it, and shows the patterns that give a scam away.</p>

<h3>The channels, and what each is good for</h3>
${bang(['Channel', 'Good for', 'Tip'], [
  ['ITviec (itviec.com)', 'IT-only jobs in Vietnam, many product and outsourcing companies', 'Filter by skill and "intern/fresher"; company pages show reviews written by employees.'],
  ['TopCV, TopDev, VietnamWorks', 'Wide range of companies; TopDev focuses on developers', 'Use the same CV but rewrite the summary line for each role.'],
  ['LinkedIn Jobs', 'Foreign companies, remote roles, and recruiters who search you', 'A complete profile matters as much as applying (Lesson 1.4).'],
  ['Company career pages', 'Larger companies that run their own internship programmes', 'Many publish internship rounds at fixed times of year — check early.'],
  ['Referral (giới thiệu nội bộ)', 'Skipping the CV pile', 'Seniors from your school, former classmates, mentors. Often the best conversion rate of all.'],
  ['The university OJT list and job fairs', 'Companies that already work with your school', 'The safety net: register before the deadline if your own search has not landed.'],
  ['Facebook / Discord groups', 'Small startups and quick contacts', 'Highest scam rate — apply the checks below every time.'],
])}
<p>A healthy mix for a student in the final weeks before an OJT deadline: most applications through job sites and career pages, a few strong ones through referrals, and the school list as a fallback with a fixed date.</p>

<h3>Reading a posting line by line</h3>
<p>Here is an <strong>illustrative</strong> posting, typical of what you will see for a backend intern role:</p>
${ra(TIN_MAU_EN)}
${flow([
  ['Responsibilities', 'what you would actually do', '"REST APIs + unit tests + bug fixes + stand-ups" tells you the interview will ask about HTTP, a test you wrote, and how you work in a team. Prepare one story for each.'],
  ['Requirements', 'the real filter — but softer than it looks', '"Good JavaScript, basic Node, SQL, Git, read English" — these are the topics of the technical round. "Final-year student" often just means "available for the internship period".'],
  ['Nice to have', 'tie-breakers, not filters', 'TypeScript and Docker set you apart. Do not skip a posting because you lack these.'],
  ['We offer', 'what they are proud of', '"Mentor" and "chance to become full-time" are good signs. "Support with internship paperwork" means they have hosted students before.'],
])}
<p>A useful rule of thumb used by many career guides: <strong>if you match most of the requirements — roughly 60% — apply</strong>. Postings describe an ideal candidate; companies hire the best one who actually applied.</p>
${bay('en', 'reading the posting only to decide whether to apply.', 'Read it a second time to prepare. Every line under "Responsibilities" and "Requirements" is a likely interview question. Copy them into your tracker (Lab 0.3) next to the company name — that list is your study plan for that interview.')}

<h3>Abroad and remote: what is different</h3>
<ul>
<li><strong>Everything is in English</strong>, including the first screen. Chapter 8 exists for this.</li>
<li><strong>Remote internships are rarer</strong> and more competitive than local ones; for a first job, a local internship followed by remote work later is a common, realistic path.</li>
<li><strong>Contracts differ</strong>: some remote roles are freelance or "contractor" contracts with no insurance; read them carefully (Lesson 9.3).</li>
<li><strong>Time zones</strong>: ask about overlapping hours in the interview — it shows maturity.</li>
</ul>

<h3>How to spot a scam</h3>
${keXau('en', 'Fake job offers are one of the most common online frauds. Warning signs: you are asked to <strong>pay</strong> anything (a training fee, a deposit, a uniform, equipment); the "job" is liking, reviewing or ordering items and then "topping up" money to unlock commission; the chat moves immediately to Telegram or Zalo with a stranger; the salary is far above anything else for "easy online work"; they ask for your ID card photo, a selfie or bank details before any real interview; the email comes from a free address instead of the company domain; or — specifically for developers — they send a repository and insist you run it before the interview (Lesson 0.9). A real company never asks you to pay to get hired. When in doubt, look the company up on its official website and on LinkedIn, and call the number published there, not the one in the message.')}
${neu('en', 'a "recruiter" on LinkedIn offers you a remote internship with an unusually high allowance and asks you to clone their repo and run <code>npm install</code> to "check your environment"? Do not run it on your laptop. Open <code>package.json</code> on GitHub first and read the scripts. Then ask for a video call with a company email invitation. Real recruiters are happy to prove who they are; scammers disappear.')}

${thucHanh('en', { phut: '25–30', steps: [
  'Search three channels (for example ITviec, LinkedIn, and one company career page) for internships in your target role. Collect ten real postings.',
  'For each posting, copy the Requirements into two columns: "I have evidence for this" and "I don’t yet".',
  'Mark each posting as Apply now (≥ 60% match), Apply after one fix, or Skip — and write the reason.',
  'Run the scam checklist on every posting from a group or a direct message.',
], dat: 'you have ten postings in a list with a decision and reason for each, and at least three marked "Apply now".' })}
${thuatNgu('en', [
  ['Job posting / JD (job description)', 'The advertisement that lists responsibilities, requirements and benefits.'],
  ['Requirements vs nice to have', 'The first are the main filter; the second only break ties.'],
  ['Hybrid / remote / onsite', 'Mixed office and home / fully from home / fully in the office.'],
  ['Career page', 'The jobs section of a company’s own website.'],
  ['Recruiter', 'A person whose job is finding candidates, inside the company or at an agency.'],
  ['Contractor', 'Working under a service contract rather than as an employee — fewer protections.'],
])}
${tomTat('en', [
  'Spread your search: job sites, LinkedIn, career pages, referrals, and the school OJT list as a safety net.',
  'Responsibilities and requirements are a preview of the interview questions — copy them into your tracker.',
  'Apply when you match most requirements; "nice to have" never disqualifies you.',
  'Remote and foreign roles add English, time zones and different contracts.',
  'Any request to pay, any move to private chat with a stranger, or any "run this repo first" is a red flag.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-3-1-find-apply', academy: true, L: 'en', title: 'Academy · OJT202 3.1 — Finding and applying for an internship', sub: 'The school’s checklist for finding a host company.' }),
  yt('fhZ2QNNd2k4', 'Teal', 'How to Read a Job Description (According to a Real Recruiter)', 7, 'en'),
  yt('X_SbBnci6jM', 'miss cyberpenny by Jane Lo', 'Fake Job Offers Delivering Malware? (Black Hat Asia)', 17, 'en'),
  nguon('🔎', 'ITviec', 'IT-only job board in Vietnam with company reviews.', 'https://itviec.com/'),
  nguon('🔎', 'TopDev', 'Developer-focused job board in Vietnam.', 'https://topdev.vn/'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Việc ở đâu, đọc tin tuyển dụng ra sao, và phân biệt tin thật với cái bẫy</h2>
<p class="lead">Phần lớn sinh viên tìm ở đúng một nơi, nộp mười tin đầu tiên thấy được, rồi kết luận "chẳng ai trả lời". Bài này rải việc tìm kiếm của bạn ra các kênh thật sự hiệu quả cho thực tập sinh ở Việt Nam và nước ngoài, dạy bạn đọc một tin tuyển dụng theo cách người quản lý tuyển dụng đã viết ra nó, và chỉ ra các khuôn mẫu làm lộ một tin lừa.</p>

<h3>Các kênh, và mỗi kênh hợp với cái gì</h3>
${bang(['Kênh', 'Hợp với', 'Mẹo'], [
  ['ITviec (itviec.com)', 'Việc thuần IT ở Việt Nam, nhiều công ty sản phẩm và outsource (gia công phần mềm)', 'Lọc theo kỹ năng và "intern/fresher"; trang công ty có đánh giá do nhân viên viết.'],
  ['TopCV, TopDev, VietnamWorks', 'Nhiều loại công ty; TopDev tập trung vào lập trình viên', 'Dùng chung một CV nhưng viết lại dòng tóm tắt cho từng vị trí.'],
  ['LinkedIn Jobs', 'Công ty nước ngoài, việc remote, và recruiter (người tuyển dụng) chủ động tìm bạn', 'Hồ sơ đầy đủ quan trọng ngang việc nộp đơn (bài 1.4).'],
  ['Trang tuyển dụng của công ty', 'Công ty lớn tự chạy chương trình thực tập', 'Nhiều nơi mở đợt thực tập vào thời điểm cố định trong năm — xem sớm.'],
  ['Giới thiệu nội bộ (referral)', 'Đi tắt qua đống CV', 'Anh chị khoá trên, bạn cũ, người hướng dẫn. Thường có tỉ lệ được gọi cao nhất.'],
  ['Danh sách OJT của trường, ngày hội việc làm', 'Công ty đã hợp tác với trường', 'Lưới đỡ: đăng ký trước hạn nếu tự tìm chưa có kết quả.'],
  ['Nhóm Facebook / Discord', 'Startup nhỏ, liên hệ nhanh', 'Tỉ lệ lừa đảo cao nhất — áp bộ kiểm bên dưới mỗi lần.'],
])}
<p>Một tỉ lệ hợp lý cho sinh viên trong mấy tuần cuối trước hạn OJT: phần lớn đơn qua trang việc làm và trang công ty, vài đơn mạnh qua người giới thiệu, và danh sách của trường làm đường lùi với một ngày chốt cố định.</p>

<h3>Đọc một tin tuyển dụng từng dòng</h3>
<p>Đây là một tin <strong>minh hoạ</strong>, điển hình cho những gì bạn sẽ gặp ở vị trí thực tập backend:</p>
${ra(TIN_MAU_VI)}
${flow([
  ['Mô tả công việc', 'bạn sẽ thật sự làm gì', '"REST API + unit test + sửa lỗi + họp đứng" báo trước rằng buổi phỏng vấn sẽ hỏi về HTTP, một cái test bạn từng viết, và cách bạn làm việc nhóm. Chuẩn bị mỗi thứ một câu chuyện.'],
  ['Yêu cầu', 'bộ lọc thật — nhưng mềm hơn vẻ ngoài', '"JavaScript tốt, Node cơ bản, SQL, Git, đọc tiếng Anh" — đó chính là đề tài của vòng kỹ thuật. "Sinh viên năm cuối" nhiều khi chỉ có nghĩa là "rảnh đúng kỳ thực tập".'],
  ['Ưu tiên', 'thứ phân định khi ngang điểm, không phải bộ lọc', 'TypeScript và Docker giúp bạn nổi bật. Đừng bỏ qua tin vì thiếu mấy thứ này.'],
  ['Quyền lợi', 'thứ họ tự hào', '"Có mentor" và "cơ hội lên chính thức" là dấu hiệu tốt. "Hỗ trợ giấy tờ thực tập" nghĩa là họ từng nhận sinh viên.'],
])}
<p>Một luật kinh nghiệm nhiều cẩm nang nghề nghiệp dùng: <strong>nếu bạn khớp phần lớn yêu cầu — khoảng 60% — thì nộp</strong>. Tin tuyển dụng mô tả một ứng viên lý tưởng; công ty tuyển người tốt nhất trong số những người THẬT SỰ đã nộp.</p>
${bay('vi', 'chỉ đọc tin để quyết định có nộp hay không.', 'Hãy đọc lần thứ hai để CHUẨN BỊ. Mỗi dòng dưới "Mô tả công việc" và "Yêu cầu" là một câu hỏi phỏng vấn tiềm năng. Chép chúng vào bảng theo dõi (Lab 0.3) cạnh tên công ty — danh sách đó chính là kế hoạch ôn cho buổi phỏng vấn ấy.')}

<h3>Nước ngoài và remote: khác gì</h3>
<ul>
<li><strong>Mọi thứ bằng tiếng Anh</strong>, kể cả vòng sàng lọc đầu tiên. Chương 8 có để lo việc này.</li>
<li><strong>Thực tập remote hiếm hơn</strong> và cạnh tranh hơn thực tập tại chỗ; với việc đầu tiên, thực tập tại chỗ rồi sau đó mới làm remote là con đường phổ biến và thực tế.</li>
<li><strong>Hợp đồng khác</strong>: có việc remote là hợp đồng freelance hay "contractor" (hợp đồng dịch vụ) không có bảo hiểm; đọc kỹ (bài 9.3).</li>
<li><strong>Múi giờ</strong>: hỏi về số giờ làm trùng nhau trong buổi phỏng vấn — cho thấy bạn chín chắn.</li>
</ul>

<h3>Nhận ra tin lừa đảo</h3>
${keXau('vi', 'Tin tuyển dụng giả là một trong những kiểu lừa đảo online phổ biến nhất. Dấu hiệu: bạn bị đòi <strong>trả tiền</strong> bất kỳ thứ gì (phí đào tạo, tiền đặt cọc, đồng phục, thiết bị); "công việc" là bấm thích, viết đánh giá hay đặt hàng rồi "nạp tiền" để mở hoa hồng; cuộc trò chuyện lập tức chuyển sang Telegram hay Zalo với người lạ; lương cao vượt hẳn mọi chỗ khác cho "việc online nhẹ nhàng"; họ đòi ảnh căn cước, ảnh selfie hay số tài khoản trước khi có buổi phỏng vấn thật nào; email gửi từ địa chỉ miễn phí thay vì tên miền công ty; hoặc — riêng với lập trình viên — họ gửi một kho mã và nằng nặc bắt bạn chạy trước buổi phỏng vấn (bài 0.9). Công ty thật không bao giờ bắt bạn trả tiền để được tuyển. Khi nghi ngờ, tra công ty trên trang web chính thức và LinkedIn, và gọi số điện thoại đăng ở đó, không phải số trong tin nhắn.')}
${neu('vi', 'một "recruiter" trên LinkedIn mời bạn thực tập remote với mức trợ cấp cao bất thường, rồi nhờ bạn clone kho mã của họ và chạy <code>npm install</code> để "kiểm tra môi trường"? Đừng chạy trên laptop. Mở <code>package.json</code> trên GitHub trước và đọc phần scripts. Rồi đề nghị một cuộc gọi video có thư mời từ email công ty. Recruiter thật vui vẻ chứng minh họ là ai; kẻ lừa sẽ biến mất.')}

${thucHanh('vi', { phut: '25–30', steps: [
  'Tìm trên ba kênh (ví dụ ITviec, LinkedIn, và trang tuyển dụng của một công ty) các tin thực tập đúng vị trí bạn nhắm. Gom mười tin thật.',
  'Với mỗi tin, chép phần Yêu cầu vào hai cột: "Mình có bằng chứng cho cái này" và "Mình chưa có".',
  'Đánh dấu mỗi tin là Nộp ngay (khớp ≥ 60%), Nộp sau khi sửa một chỗ, hoặc Bỏ qua — và ghi lý do.',
  'Chạy bộ kiểm lừa đảo với mọi tin tới từ nhóm hoặc tin nhắn riêng.',
], dat: 'bạn có danh sách mười tin, mỗi tin kèm quyết định và lý do, và ít nhất ba tin đánh dấu "Nộp ngay".' })}
${thuatNgu('vi', [
  ['Job posting / JD (tin tuyển dụng / mô tả công việc)', 'Bản tin liệt kê việc phải làm, yêu cầu và quyền lợi.'],
  ['Requirements vs nice to have (yêu cầu vs ưu tiên)', 'Cái đầu là bộ lọc chính; cái sau chỉ để phân định khi ngang điểm.'],
  ['Hybrid / remote / onsite', 'Kết hợp văn phòng và nhà / hoàn toàn ở nhà / hoàn toàn ở văn phòng.'],
  ['Career page (trang tuyển dụng)', 'Mục việc làm trên trang web của chính công ty.'],
  ['Recruiter (người tuyển dụng)', 'Người có nhiệm vụ tìm ứng viên, thuộc công ty hoặc một công ty săn đầu người.'],
  ['Contractor (người làm theo hợp đồng dịch vụ)', 'Làm theo hợp đồng dịch vụ thay vì là nhân viên — ít được bảo vệ hơn.'],
])}
${tomTat('vi', [
  'Rải việc tìm kiếm: trang việc làm, LinkedIn, trang công ty, người giới thiệu, và danh sách OJT của trường làm lưới đỡ.',
  'Mô tả công việc và yêu cầu là bản xem trước của câu hỏi phỏng vấn — chép vào bảng theo dõi.',
  'Nộp khi bạn khớp phần lớn yêu cầu; mục "ưu tiên" không bao giờ loại bạn.',
  'Việc remote và nước ngoài thêm tiếng Anh, múi giờ và kiểu hợp đồng khác.',
  'Mọi yêu cầu trả tiền, mọi lời rủ sang chat riêng với người lạ, mọi câu "chạy kho mã này trước đã" đều là cờ đỏ.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-3-1-find-apply', academy: true, title: 'Academy · OJT202 3.1 — Tìm và ứng tuyển thực tập', sub: 'Danh sách kiểm của nhà trường khi tìm công ty thực tập.' }),
  yt('fhZ2QNNd2k4', 'Teal', 'How to Read a Job Description (According to a Real Recruiter)', 7),
  yt('X_SbBnci6jM', 'miss cyberpenny by Jane Lo', 'Fake Job Offers Delivering Malware? (Black Hat Asia)', 17),
  nguon('🔎', 'ITviec', 'Trang việc làm thuần IT ở Việt Nam, có đánh giá công ty.', 'https://itviec.com/'),
  nguon('🔎', 'TopDev', 'Trang việc làm dành cho lập trình viên ở Việt Nam.', 'https://topdev.vn/'),
])}
</div>
`,
};

/* ═══════════════════════ 0.2 — Bản đồ kỹ năng ═══════════════════════ */
const MA_TRAN_EN = `
Skill            Level (0-3)   Evidence (link / file)                      Gap -> fix
---------------  ------------  ------------------------------------------  ---------------------------
JavaScript/Node  2             personal web app: API + background jobs     event loop questions (Ch4.1)
SQL              2             DBI202 + course project schema               EXPLAIN, isolation (Ch4.2)
Java / OOP       1             PRO192 labs, LabFlow (in progress)           explain SOLID with my code
Git              2             every project on GitHub                      rebase vs merge story (Ch5.1)
Docker           2             runs my app stack every day                  explain layers, multi-stage
React            1             FER202 exercises                             hooks questions (Ch6.1)
Testing          1             SWT301 test cases, a few unit tests          write 5 real unit tests
English          1             reads docs, weak speaking                    Ch8, 15 min/day

Levels: 0 never used · 1 followed a tutorial · 2 built something alone · 3 can explain + debug it
`;

const MA_TRAN_VI = `
Kỹ năng          Mức (0-3)     Bằng chứng (link / tệp)                     Lỗ hổng -> cách bù
---------------  ------------  ------------------------------------------  ---------------------------
JavaScript/Node  2             web cá nhân: API + việc chạy nền            câu hỏi event loop (Ch4.1)
SQL              2             DBI202 + lược đồ đồ án                       EXPLAIN, mức cô lập (Ch4.2)
Java / OOP       1             lab PRO192, LabFlow (đang làm)               giải thích SOLID bằng code mình
Git              2             mọi dự án trên GitHub                        câu chuyện rebase vs merge (Ch5.1)
Docker           2             chạy cả cụm ứng dụng hằng ngày               giải thích tầng ảnh, multi-stage
React            1             bài tập FER202                               câu hỏi hook (Ch6.1)
Testing          1             test case SWT301, vài unit test              viết 5 unit test thật
Tiếng Anh        1             đọc tài liệu được, nói yếu                   Ch8, 15 phút/ngày

Mức: 0 chưa dùng · 1 làm theo hướng dẫn · 2 tự làm ra được · 3 giải thích + gỡ lỗi được
`;

const L02 = {
  title: '0.2 — Mapping your skills to the posting: a skill matrix with evidence|||0.2 — Đối chiếu kỹ năng với tin tuyển dụng: ma trận kỹ năng có bằng chứng',
  slug: 'pv-0-2-ban-do-ky-nang',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Gom kỹ năng lặp lại trong mười tin tuyển dụng, tự chấm từng kỹ năng theo thang 0–3 KÈM bằng chứng, chọn một hướng chính và một hướng phụ (backend Node, Java/Spring, fullstack), và nối mỗi lỗ hổng với đúng bài trên trang để bù.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Mapping your skills to the posting — with evidence, not adjectives</h2>
<p class="lead">"Good at teamwork, fast learner, proficient in Java, React, Node, Docker, AWS…" — every student CV says it, so it says nothing. This lesson replaces adjectives with a <strong>skill matrix</strong>: the skills that real postings ask for, your honest level in each, and the evidence that proves it. The matrix decides what goes on your CV, which role you target first, and what to study before each interview.</p>

<h3>An everyday picture: the doctor’s chart</h3>
${doiThuong('en', 'A doctor does not write "patient seems fairly healthy". They measure — blood pressure, temperature, a test result — and write each number next to what it means. Your skill matrix is the same chart for your career: each skill gets a measured level and a proof you can point at. When an interviewer asks "how good is your SQL?", you do not say "quite good"; you say "I designed the schema of my project with eleven tables and I can show you the migration".')}

<h3>Step 1 — Count what the market asks for</h3>
<p>Take the ten postings you collected in Lesson 0.1 and count how many mention each skill. You will find a short list that repeats — for backend internships in Vietnam it is typically a language (JavaScript/TypeScript or Java), SQL, Git, REST APIs, and English reading; then Docker, testing and a framework as "nice to have". <strong>Your own count beats any article</strong>, because it reflects the companies you will actually apply to this month.</p>

<h3>Step 2 — Score yourself honestly, with a proof per line</h3>
${stack([
  ['Level 3 — explain and debug', 'You can explain how it works inside and fixed a real problem with it. Safe to put at the top of your CV.'],
  ['Level 2 — built something alone', 'You made something work without following a tutorial step by step. Safe on the CV with one example ready.'],
  ['Level 1 — followed a tutorial', 'You have used it in a guided exercise. Put it under "familiar with" or leave it off.'],
  ['Level 0 — never used', 'Leave it off. If the posting needs it, it becomes a gap to fix.'],
])}
<p>Here is an <strong>example</strong> matrix for a student with a personal web platform and a capstone project in progress. It is a template — score yourself; do not copy the numbers:</p>
${ra(MA_TRAN_EN)}
${bay('en', 'scoring by "I have seen it" instead of "I can show it".', 'The level is only worth the evidence next to it. A line with no link or file is, at best, level 1. Interviewers probe exactly the lines that look strongest — so the strongest lines must have the best evidence.')}

<h3>A special case: projects built with AI assistance</h3>
<p>Many students today build impressive projects with AI coding assistants. That is not cheating — it is how a lot of software is now written — but it changes what your evidence proves. If an assistant wrote most of the code, your level-3 skills are likely <strong>architecture choices, reviewing code, running and debugging the system, deployment and incident response</strong>, not "I wrote this feature from scratch". Score what you actually did. A project you <em>coded by hand</em> (for many students, the capstone) is the evidence for raw coding skill; a larger system you <em>operate</em> is the evidence for engineering judgement. Both are valuable when described truthfully — Lesson 3.3 shows how to talk about it.</p>

<h3>Step 3 — Choose one main direction and one backup</h3>
${bang(['Direction', 'Typical postings ask for', 'Your proof should be'], [
  ['Backend intern — Node.js/TypeScript', 'JavaScript, Node/Express, SQL, REST, Git; Docker as a plus', 'an API you can explain end to end, with one bug you fixed'],
  ['Backend intern — Java/Spring Boot', 'Java, OOP, Spring Boot, SQL, Git; often at outsourcing companies', 'a Spring project (for example a capstone) with layers you can draw'],
  ['Fullstack / frontend intern', 'React, JavaScript, HTML/CSS, calling APIs', 'a UI you built, deployed, and can open on your phone'],
])}
<p>Pick the main direction where your evidence is strongest <em>and</em> postings are plentiful. Keep the backup ready — many Vietnamese companies hire interns into whichever team has space.</p>

<h3>Step 4 — Turn each gap into a lesson you will study</h3>
${bang(['Gap', 'Where to fix it on this site'], [
  ['Async JavaScript, the event loop', 'Node.js 1.4 and 2.2'],
  ['SQL joins, indexes, transactions', 'PostgreSQL 5.1, 9.1, 11.3 (or Academy DBI202)'],
  ['Git beyond add/commit/push', 'Git 3.4 (rebase vs merge) and 4.4 (reflog)'],
  ['Docker basics', 'Docker 1.1 (what a container is made of)'],
  ['Testing', 'Testing 0.2 (the test pyramid)'],
  ['React hooks', 'React 2.1 (useState) and 4.1 (useEffect)'],
  ['Java OOP', 'Academy PRO192, and Lesson 4.5 of this course'],
  ['Data structures and algorithms', 'Academy CSD201, and Chapter 7 of this course'],
])}
${neu('en', 'a posting you love asks for something at level 0 — say Spring Boot when you only know Node? Apply anyway if you match most of the rest, and in the meantime build one tiny thing with it (a single CRUD endpoint) so you can honestly say "I have started, here is what I built this week". That sentence often beats a CV that claims the skill.')}

${thucHanh('en', { phut: '30–40', steps: [
  'From your ten postings, count each skill and keep the top eight.',
  'Fill a matrix like the example: level 0–3, one evidence link or file per line, and the gap.',
  'Choose your main direction and backup, and write one sentence on why.',
  'For your two biggest gaps, open the lesson listed above and schedule it in the four-week plan.',
], dat: 'your matrix has eight lines, every line at level 2 or 3 has evidence, and your two gaps are scheduled.' })}
${thuatNgu('en', [
  ['Skill matrix', 'A table of skills × honest level × evidence; the source for your CV and study plan.'],
  ['Evidence', 'Something an interviewer can check: a repository, a deployed page, a report, a test.'],
  ['Gap', 'A requirement you do not meet yet — to fix or to address honestly.'],
  ['Main / backup direction', 'The role you target first, and the one you keep ready.'],
  ['Stack', 'The set of technologies used together (for example Node + PostgreSQL + React).'],
])}
${tomTat('en', [
  'Replace adjectives on your CV with a skill matrix: skill, level 0–3, evidence.',
  'Count skills from postings you will actually apply to, not from generic articles.',
  'A level is only worth the proof next to it; the strongest lines will be probed hardest.',
  'If AI wrote most of a project’s code, score what you really did — architecture, review, operations.',
  'Pick one main direction and one backup; turn each gap into a scheduled lesson.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-1-4-bat-dong-bo', L: 'en', title: 'Node.js 1.4 — Async: callbacks, Promises, async/await', sub: 'The most common backend gap for students — and the most common interview question.' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-9-1-chi-muc-la-gi', L: 'en', title: 'PostgreSQL 9.1 — What an index is', sub: 'The SQL topic that separates level 1 from level 2.' }),
  yt('DtdpQlS9J88', 'Indeed', 'Decoding the Job Description', 48, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Đối chiếu kỹ năng với tin tuyển dụng — bằng bằng chứng, không bằng tính từ</h2>
<p class="lead">"Làm việc nhóm tốt, ham học hỏi, thành thạo Java, React, Node, Docker, AWS…" — CV sinh viên nào cũng ghi thế, nên nó chẳng nói lên điều gì. Bài này thay tính từ bằng một <strong>ma trận kỹ năng</strong>: những kỹ năng tin tuyển dụng thật đòi hỏi, mức thật của bạn ở từng kỹ năng, và bằng chứng chứng minh mức đó. Ma trận quyết định cái gì được lên CV, bạn nhắm vị trí nào trước, và ôn gì trước mỗi buổi phỏng vấn.</p>

<h3>Liên tưởng đời thường: tờ bệnh án</h3>
${doiThuong('vi', 'Bác sĩ không ghi "bệnh nhân trông có vẻ khá khoẻ". Họ đo — huyết áp, nhiệt độ, một kết quả xét nghiệm — và ghi từng con số cạnh ý nghĩa của nó. Ma trận kỹ năng là đúng tờ bệnh án đó cho sự nghiệp của bạn: mỗi kỹ năng có một mức đã đo và một bằng chứng chỉ vào được. Khi người phỏng vấn hỏi "SQL của em thế nào?", bạn không nói "cũng khá ạ"; bạn nói "em thiết kế lược đồ cho dự án của em gồm mười một bảng, em cho anh xem file migration được".')}

<h3>Bước 1 — Đếm xem thị trường đòi gì</h3>
<p>Lấy mười tin bạn đã gom ở bài 0.1 và đếm xem mỗi kỹ năng được nhắc trong bao nhiêu tin. Bạn sẽ thấy một danh sách ngắn lặp đi lặp lại — với thực tập backend ở Việt Nam thường là một ngôn ngữ (JavaScript/TypeScript hoặc Java), SQL, Git, REST API, và đọc tiếng Anh; rồi Docker, testing và một framework ở mục "ưu tiên". <strong>Con số bạn tự đếm đáng tin hơn mọi bài báo</strong>, vì nó phản ánh đúng các công ty bạn sẽ nộp trong tháng này.</p>

<h3>Bước 2 — Tự chấm trung thực, mỗi dòng một bằng chứng</h3>
${stack([
  ['Mức 3 — giải thích và gỡ lỗi được', 'Bạn giải thích được bên trong nó chạy ra sao và đã sửa một vấn đề thật với nó. An toàn để đặt lên đầu CV.'],
  ['Mức 2 — tự làm ra được', 'Bạn làm một thứ chạy được mà không phải theo hướng dẫn từng bước. An toàn để lên CV, kèm sẵn một ví dụ.'],
  ['Mức 1 — làm theo hướng dẫn', 'Bạn đã dùng trong một bài tập có hướng dẫn. Đặt ở mục "có biết" hoặc bỏ ra.'],
  ['Mức 0 — chưa dùng', 'Bỏ ra. Nếu tin cần nó, nó thành một lỗ hổng phải bù.'],
])}
<p>Đây là một ma trận <strong>ví dụ</strong> cho một sinh viên có một nền tảng web cá nhân và một đồ án đang làm. Nó là khuôn mẫu — hãy tự chấm; đừng chép con số:</p>
${ra(MA_TRAN_VI)}
${bay('vi', 'chấm theo kiểu "mình từng thấy rồi" thay vì "mình chỉ ra được".', 'Một mức chỉ đáng giá bằng cái bằng chứng đặt cạnh nó. Dòng không có đường dẫn hay tệp nào thì tốt lắm cũng chỉ là mức 1. Người phỏng vấn đào đúng những dòng trông mạnh nhất — nên những dòng mạnh nhất phải có bằng chứng tốt nhất.')}

<h3>Trường hợp đặc biệt: dự án làm cùng trợ lý AI</h3>
<p>Ngày nay nhiều sinh viên làm ra những dự án ấn tượng cùng trợ lý AI viết code. Đó không phải gian lận — rất nhiều phần mềm bây giờ được viết như vậy — nhưng nó thay đổi điều mà bằng chứng của bạn chứng minh. Nếu trợ lý viết phần lớn mã, kỹ năng mức 3 của bạn nhiều khả năng là <strong>chọn kiến trúc, duyệt mã, vận hành và gỡ lỗi hệ thống, quy trình deploy và xử lý sự cố</strong>, chứ không phải "em tự viết tính năng này từ số 0". Hãy chấm đúng cái bạn thật sự làm. Một dự án bạn <em>tự code tay</em> (với nhiều bạn, đó là đồ án tốt nghiệp) là bằng chứng cho kỹ năng code thuần; một hệ thống lớn hơn bạn <em>vận hành</em> là bằng chứng cho óc phán đoán kỹ thuật. Cả hai đều có giá trị khi được kể đúng sự thật — bài 3.3 chỉ cách nói về chuyện này.</p>

<h3>Bước 3 — Chọn một hướng chính và một hướng dự phòng</h3>
${bang(['Hướng', 'Tin tuyển dụng thường đòi', 'Bằng chứng của bạn nên là'], [
  ['Thực tập backend — Node.js/TypeScript', 'JavaScript, Node/Express, SQL, REST, Git; Docker là điểm cộng', 'một API bạn giải thích được từ đầu tới cuối, kèm một lỗi bạn đã sửa'],
  ['Thực tập backend — Java/Spring Boot', 'Java, OOP, Spring Boot, SQL, Git; hay gặp ở công ty outsource', 'một dự án Spring (ví dụ đồ án) có các tầng bạn vẽ ra được'],
  ['Thực tập fullstack / frontend', 'React, JavaScript, HTML/CSS, gọi API', 'một giao diện bạn tự làm, đã deploy, mở được trên điện thoại'],
])}
<p>Chọn hướng chính là chỗ bằng chứng của bạn mạnh nhất <em>và</em> tin tuyển dụng nhiều. Giữ sẵn hướng dự phòng — nhiều công ty Việt Nam nhận thực tập sinh vào đội nào đang còn chỗ.</p>

<h3>Bước 4 — Biến mỗi lỗ hổng thành một bài bạn sẽ học</h3>
${bang(['Lỗ hổng', 'Bù ở đâu trên trang này'], [
  ['JavaScript bất đồng bộ, event loop', 'Node.js 1.4 và 2.2'],
  ['SQL join, chỉ mục, giao dịch', 'PostgreSQL 5.1, 9.1, 11.3 (hoặc Academy DBI202)'],
  ['Git ngoài add/commit/push', 'Git 3.4 (rebase vs merge) và 4.4 (reflog)'],
  ['Docker cơ bản', 'Docker 1.1 (container thật ra làm bằng gì)'],
  ['Testing', 'Testing 0.2 (kim tự tháp test)'],
  ['React hook', 'React 2.1 (useState) và 4.1 (useEffect)'],
  ['Java OOP', 'Academy PRO192, và bài 4.5 của khoá này'],
  ['Cấu trúc dữ liệu và giải thuật', 'Academy CSD201, và Chương 7 của khoá này'],
])}
${neu('vi', 'một tin bạn rất thích lại đòi thứ bạn ở mức 0 — ví dụ Spring Boot trong khi bạn chỉ biết Node? Cứ nộp nếu bạn khớp phần lớn phần còn lại, và trong lúc chờ hãy làm một thứ thật nhỏ với nó (một endpoint CRUD duy nhất) để có thể nói thật lòng "em đã bắt đầu, đây là cái em làm trong tuần này". Câu đó nhiều khi thắng một CV tự nhận mình biết.')}

${thucHanh('vi', { phut: '30–40', steps: [
  'Từ mười tin tuyển dụng, đếm từng kỹ năng và giữ lại tám kỹ năng hay gặp nhất.',
  'Điền một ma trận như ví dụ: mức 0–3, mỗi dòng một đường dẫn hoặc tệp bằng chứng, và lỗ hổng.',
  'Chọn hướng chính và hướng dự phòng, viết một câu vì sao.',
  'Với hai lỗ hổng lớn nhất, mở bài tương ứng ở bảng trên và xếp nó vào kế hoạch bốn tuần.',
], dat: 'ma trận của bạn có tám dòng, mọi dòng mức 2 hoặc 3 đều có bằng chứng, và hai lỗ hổng đã có lịch học.' })}
${thuatNgu('vi', [
  ['Skill matrix (ma trận kỹ năng)', 'Bảng kỹ năng × mức trung thực × bằng chứng; nguồn để viết CV và lập kế hoạch ôn.'],
  ['Evidence (bằng chứng)', 'Thứ người phỏng vấn kiểm được: một kho mã, một trang đã deploy, một báo cáo, một bài test.'],
  ['Gap (lỗ hổng)', 'Một yêu cầu bạn chưa đáp ứng — để bù hoặc để nói thật.'],
  ['Hướng chính / dự phòng', 'Vị trí bạn nhắm trước, và vị trí bạn giữ sẵn.'],
  ['Stack (bộ công nghệ)', 'Tập công nghệ dùng chung với nhau (ví dụ Node + PostgreSQL + React).'],
])}
${tomTat('vi', [
  'Thay tính từ trên CV bằng ma trận kỹ năng: kỹ năng, mức 0–3, bằng chứng.',
  'Đếm kỹ năng từ chính các tin bạn sẽ nộp, không từ bài báo chung chung.',
  'Một mức chỉ đáng giá bằng bằng chứng cạnh nó; dòng mạnh nhất sẽ bị đào sâu nhất.',
  'Nếu AI viết phần lớn mã của một dự án, chấm đúng cái bạn thật sự làm — kiến trúc, duyệt mã, vận hành.',
  'Chọn một hướng chính và một hướng dự phòng; biến mỗi lỗ hổng thành một bài có lịch học.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-1-4-bat-dong-bo', title: 'Node.js 1.4 — Bất đồng bộ: callback, Promise, async/await', sub: 'Lỗ hổng backend hay gặp nhất ở sinh viên — và cũng là câu phỏng vấn hay gặp nhất.' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-9-1-chi-muc-la-gi', title: 'PostgreSQL 9.1 — Chỉ mục là gì', sub: 'Chủ đề SQL tách mức 1 khỏi mức 2.' }),
  yt('DtdpQlS9J88', 'Indeed', 'Decoding the Job Description', 48),
])}
</div>
`,
};

/* ═══════════════════════ 0.3 — Lab 0 ═══════════════════════ */
const BANG_EN = `
Company,Role,Channel,Posting link,Applied on,Status,Contact,Next step,Next step date,Skills in posting,Notes after interview
Acme Software,Backend intern (Node),ITviec,https://...,2026-11-23,Applied,hr@acme.example,Wait for reply,2026-11-30,"Node, SQL, Git, REST",
Beta Labs,Java intern,Referral (senior K16),https://...,2026-11-24,Interview booked,Anh Minh (lead),Prepare SQL + OOP,2026-11-27,"Java, Spring, SQL",
School OJT list,Backend intern,FPTU list,https://...,,Not applied,,Decide by,2026-12-10,"Java, SQL",

Status values: Not applied · Applied · Screen · Interview booked · Interviewed · Offer · Rejected · No reply (after 14 days)
`;

const BANG_VI = `
Công ty,Vị trí,Kênh,Link tin,Ngày nộp,Trạng thái,Người liên hệ,Bước tiếp theo,Ngày bước tiếp,Kỹ năng trong tin,Ghi chú sau phỏng vấn
Acme Software,Thực tập backend (Node),ITviec,https://...,2026-11-23,Đã nộp,hr@acme.example,Chờ phản hồi,2026-11-30,"Node, SQL, Git, REST",
Beta Labs,Thực tập Java,Giới thiệu (anh K16),https://...,2026-11-24,Đã hẹn PV,Anh Minh (lead),Ôn SQL + OOP,2026-11-27,"Java, Spring, SQL",
Danh sách OJT trường,Thực tập backend,Danh sách FPTU,https://...,,Chưa nộp,,Quyết trước,2026-12-10,"Java, SQL",

Giá trị Trạng thái: Chưa nộp · Đã nộp · Sàng lọc · Đã hẹn PV · Đã PV · Offer · Bị từ chối · Không phản hồi (sau 14 ngày)
`;

const L03 = {
  title: '0.3 — Lab 0: build your job-hunt dashboard (tracker, skill matrix, calendar)|||0.3 — Lab 0: dựng bảng điều khiển tìm việc (bảng theo dõi, ma trận kỹ năng, lịch)',
  slug: 'pv-0-3-lab-bang-ung-tuyen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài lab đầu tiên: dựng một bảng tính theo dõi ứng tuyển có cột trạng thái, ngày bước tiếp theo và kỹ năng trong tin; gắn ma trận kỹ năng; đặt lịch bốn tuần và chỉ tiêu mỗi tuần; tự chấm bằng rubric.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lab 0</span>
<h2>Lab 0 — Build your job-hunt dashboard</h2>
<p class="lead">Job hunting fails quietly when it lives in your head: you forget who you applied to, miss a reply, or prepare the wrong topic for an interview. In this lab you build the one spreadsheet you will update every day until you have an offer — the same way a team tracks tickets on a board.</p>

<h3>The situation</h3>
<p>It is the week after your final exams. You plan to send around five applications a week for three weeks, keep the school’s OJT list as a fallback with a fixed decision date, and prepare each interview from the posting itself. You need one place that tells you, every morning, <strong>what to do today</strong>.</p>
${flow([
  ['1 · Collect', 'postings into the tracker', 'Every posting you consider gets a row, even before you apply. Copy the skills it asks for.'],
  ['2 · Act', 'apply and set a next step', 'Every row always has a next step and a date — "wait for reply until 30/11", "prepare SQL by 27/11".'],
  ['3 · Prepare', 'from the skills column', 'Before an interview, the "skills in posting" cell is your study list for that company.'],
  ['4 · Learn', 'notes after each interview', 'The questions you were asked go into notes, then into your prepared answers.'],
])}

<h3>Steps</h3>
<ol>
<li><strong>Create the sheet</strong> (Google Sheets or Excel) named <code>Job hunt 2026</code> with the columns below. Paste the sample, then delete the three example rows.</li>
<li><strong>Add a status dropdown</strong> (Data → Data validation → list) with exactly the status values listed under the sample.</li>
<li><strong>Add conditional colours</strong>: green for Offer, red for Rejected, yellow when "Next step date" is today or earlier.</li>
<li><strong>Add a second tab</strong> <code>Skills</code> and paste the skill matrix you made in Lesson 0.2.</li>
<li><strong>Add a third tab</strong> <code>Plan</code>: the four weeks with dates and targets — for example 5 applications, 1 mock interview, 2 STAR stories per week.</li>
<li><strong>Enter your ten postings</strong> from Lesson 0.1, with "Not applied" and a next step for each.</li>
</ol>
${ra(BANG_EN)}
<details><summary>Hint 1 — a counter for the top of the sheet</summary>
<p>In an empty cell type <code>=COUNTIF(F:F,"Applied")</code> to count applications sent (column F is Status). On a Vietnamese-locale Google Sheet the separator is a semicolon: <code>=COUNTIF(F:F;"Applied")</code>. Make one counter per status.</p>
</details>
<details><summary>Hint 2 — the "today" rule for the yellow colour</summary>
<p>Conditional formatting → custom formula on the range of column I: <code>=AND(I2&lt;&gt;"", I2&lt;=TODAY())</code>. Every row whose next step is due turns yellow.</p>
</details>
${bay('en', 'a tracker without a "next step" column.', 'A list of companies is a diary; a list of next steps with dates is a plan. The most common way to lose an opportunity is not a bad interview — it is a reply you never followed up. If a row has no next step, it is not finished.')}
${keXau('en', 'your tracker holds names, emails and phone numbers of real people. Keep the sheet private (do not share "anyone with the link"), and never paste passwords or one-time codes into it. A leaked job-hunt sheet is exactly what a scammer needs to impersonate a recruiter you are already talking to.')}

<h3>Self-assessment rubric (out of 10)</h3>
${rubric('en', [
  ['Columns', 'Fewer than 6 of the columns', 'All columns, no dropdown', 'All columns + status dropdown'],
  ['Next steps', 'Missing on most rows', 'On some rows', 'On every row, each with a date'],
  ['Skills tab', 'Missing', 'Skills without evidence', 'Matrix with levels and evidence'],
  ['Plan tab', 'Missing', 'Weeks without targets', 'Four dated weeks with numeric targets'],
  ['Real data', 'Fewer than 5 postings', '5–9 postings', '10 or more real postings'],
])}
<p><strong>Extra challenge:</strong> add a small chart of status counts, and a column "Days since applied" (<code>=TODAY()-E2</code>) so a row turns into "No reply" after 14 days.</p>
${thucHanh('en', { phut: '40–60', steps: [
  'Build the three tabs as described and enter your ten postings.',
  'Score yourself with the rubric and fix every row that scores 0 or 1.',
  'Tomorrow morning, open the sheet first and do the yellow rows — repeat daily.',
], dat: 'the sheet scores at least 8/10 on the rubric and every posting row has a dated next step.' })}
${thuatNgu('en', [
  ['Tracker', 'A table that follows every application from first sight to final answer.'],
  ['Data validation', 'A spreadsheet rule that limits a cell to a list of allowed values.'],
  ['Conditional formatting', 'Colours that appear automatically when a rule is true.'],
  ['COUNTIF', 'A spreadsheet function that counts cells matching a condition.'],
  ['Follow-up', 'A polite message to check the status of an application or interview.'],
])}
${tomTat('en', [
  'Keep the whole job hunt in one sheet: postings, status, next step with a date, skills, notes.',
  'A row without a next step is unfinished.',
  'The skills column of a posting is your study list for that interview.',
  'Keep the sheet private — it contains other people’s contact details.',
  'Open it first every morning and clear the yellow rows.',
])}
${lienQuan('en', [
  yt('rqqrZp4wPc8', 'Google Sheets Geeks', 'Job Hunt Tracker Simple in Google Sheets', 5, 'en'),
  lienKet({ khoa: 'huong-dan-ct-work', bai: 'ctw-02-board-hang-ngay', L: 'en', title: 'CT Work guide — the daily board', sub: 'If you prefer a board to a spreadsheet: the same idea as cards moving across columns.' }),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Lab 0</span>
<h2>Lab 0 — Dựng bảng điều khiển tìm việc của bạn</h2>
<p class="lead">Việc tìm việc thất bại âm thầm khi nó chỉ nằm trong đầu bạn: quên mình đã nộp chỗ nào, bỏ sót một lời hồi âm, hay ôn nhầm chủ đề cho một buổi phỏng vấn. Trong lab này bạn dựng đúng một bảng tính mà bạn sẽ cập nhật mỗi ngày cho tới khi có offer — giống hệt cách một đội theo dõi các thẻ việc trên board.</p>

<h3>Tình huống</h3>
<p>Đây là tuần ngay sau kỳ thi cuối kỳ. Bạn định nộp khoảng năm đơn mỗi tuần trong ba tuần, giữ danh sách OJT của trường làm đường lùi với một ngày chốt cố định, và chuẩn bị mỗi buổi phỏng vấn từ chính tin tuyển dụng. Bạn cần một chỗ mỗi sáng nói cho bạn biết <strong>hôm nay phải làm gì</strong>.</p>
${flow([
  ['1 · Gom', 'tin tuyển dụng vào bảng', 'Mỗi tin bạn cân nhắc đều có một dòng, kể cả trước khi nộp. Chép kỹ năng tin yêu cầu.'],
  ['2 · Làm', 'nộp và đặt bước tiếp theo', 'Dòng nào cũng luôn có một bước tiếp theo kèm ngày — "chờ phản hồi tới 30/11", "ôn SQL trước 27/11".'],
  ['3 · Chuẩn bị', 'từ cột kỹ năng', 'Trước một buổi phỏng vấn, ô "kỹ năng trong tin" chính là danh sách ôn cho công ty đó.'],
  ['4 · Rút kinh nghiệm', 'ghi chú sau mỗi buổi', 'Những câu bạn bị hỏi đi vào ghi chú, rồi đi vào bộ câu trả lời đã chuẩn bị.'],
])}

<h3>Các bước</h3>
<ol>
<li><strong>Tạo bảng tính</strong> (Google Sheets hoặc Excel) tên <code>Tim viec 2026</code> với các cột dưới đây. Dán mẫu vào, rồi xoá ba dòng ví dụ.</li>
<li><strong>Thêm danh sách thả xuống cho cột Trạng thái</strong> (Dữ liệu → Xác thực dữ liệu → danh sách) với đúng các giá trị ghi dưới mẫu.</li>
<li><strong>Thêm tô màu có điều kiện</strong>: xanh cho Offer, đỏ cho Bị từ chối, vàng khi "Ngày bước tiếp" là hôm nay hoặc đã qua.</li>
<li><strong>Thêm thẻ thứ hai</strong> <code>Ky nang</code> và dán ma trận kỹ năng bạn làm ở bài 0.2.</li>
<li><strong>Thêm thẻ thứ ba</strong> <code>Ke hoach</code>: bốn tuần kèm ngày và chỉ tiêu — ví dụ mỗi tuần 5 đơn, 1 buổi phỏng vấn thử, 2 câu chuyện STAR.</li>
<li><strong>Nhập mười tin tuyển dụng</strong> của bạn từ bài 0.1, trạng thái "Chưa nộp" và một bước tiếp theo cho từng tin.</li>
</ol>
${ra(BANG_VI)}
<details><summary>Gợi ý 1 — bộ đếm ở đầu bảng</summary>
<p>Ở một ô trống gõ <code>=COUNTIF(F:F,"Đã nộp")</code> để đếm số đơn đã gửi (cột F là Trạng thái). Với Google Sheets cài vùng Việt Nam, dấu ngăn là chấm phẩy: <code>=COUNTIF(F:F;"Đã nộp")</code>. Làm một bộ đếm cho mỗi trạng thái.</p>
</details>
<details><summary>Gợi ý 2 — luật "tới hạn" cho màu vàng</summary>
<p>Định dạng có điều kiện → công thức tuỳ chỉnh trên vùng cột I: <code>=AND(I2&lt;&gt;"", I2&lt;=TODAY())</code>. Mọi dòng có bước tiếp theo tới hạn sẽ chuyển vàng.</p>
</details>
${bay('vi', 'một bảng theo dõi không có cột "bước tiếp theo".', 'Một danh sách công ty chỉ là nhật ký; một danh sách bước tiếp theo có ngày mới là kế hoạch. Cách phổ biến nhất để mất một cơ hội không phải là phỏng vấn dở — mà là một lời hồi âm bạn không bao giờ theo tiếp. Dòng nào chưa có bước tiếp theo là dòng chưa xong.')}
${keXau('vi', 'bảng của bạn chứa tên, email và số điện thoại của người thật. Để bảng ở chế độ riêng tư (không chia sẻ "bất kỳ ai có đường liên kết"), và không bao giờ dán mật khẩu hay mã một lần vào đó. Một bảng tìm việc bị lộ là đúng thứ kẻ lừa cần để giả danh một recruiter mà bạn đang trao đổi.')}

<h3>Bảng tự chấm (thang 10)</h3>
${rubric('vi', [
  ['Các cột', 'Ít hơn 6 cột', 'Đủ cột, chưa có danh sách thả xuống', 'Đủ cột + danh sách thả xuống cho Trạng thái'],
  ['Bước tiếp theo', 'Thiếu ở hầu hết các dòng', 'Có ở một số dòng', 'Có ở mọi dòng, dòng nào cũng có ngày'],
  ['Thẻ Kỹ năng', 'Không có', 'Có kỹ năng nhưng không có bằng chứng', 'Ma trận có mức và bằng chứng'],
  ['Thẻ Kế hoạch', 'Không có', 'Có tuần nhưng không có chỉ tiêu', 'Bốn tuần có ngày và chỉ tiêu bằng số'],
  ['Dữ liệu thật', 'Dưới 5 tin', '5–9 tin', 'Từ 10 tin thật trở lên'],
])}
<p><strong>Thử thách thêm:</strong> thêm một biểu đồ nhỏ đếm theo trạng thái, và một cột "Số ngày từ khi nộp" (<code>=TODAY()-E2</code>) để sau 14 ngày dòng đó chuyển sang "Không phản hồi".</p>
${thucHanh('vi', { phut: '40–60', steps: [
  'Dựng ba thẻ như mô tả và nhập mười tin tuyển dụng.',
  'Tự chấm bằng rubric và sửa mọi tiêu chí đang được 0 hoặc 1.',
  'Sáng mai, mở bảng này đầu tiên và làm hết các dòng vàng — lặp lại mỗi ngày.',
], dat: 'bảng đạt ít nhất 8/10 theo rubric và mọi dòng tin tuyển dụng đều có bước tiếp theo kèm ngày.' })}
${thuatNgu('vi', [
  ['Tracker (bảng theo dõi)', 'Bảng đi theo từng lá đơn từ lúc thấy tin tới câu trả lời cuối cùng.'],
  ['Data validation (xác thực dữ liệu)', 'Luật của bảng tính giới hạn một ô trong danh sách giá trị cho phép.'],
  ['Conditional formatting (định dạng có điều kiện)', 'Màu tự hiện khi một điều kiện đúng.'],
  ['COUNTIF', 'Hàm bảng tính đếm các ô thoả một điều kiện.'],
  ['Follow-up (theo tiếp)', 'Một tin nhắn lịch sự hỏi tình trạng của lá đơn hoặc buổi phỏng vấn.'],
])}
${tomTat('vi', [
  'Giữ toàn bộ việc tìm việc trong một bảng: tin, trạng thái, bước tiếp theo kèm ngày, kỹ năng, ghi chú.',
  'Dòng nào chưa có bước tiếp theo là dòng chưa xong.',
  'Cột kỹ năng của một tin chính là danh sách ôn cho buổi phỏng vấn đó.',
  'Để bảng riêng tư — nó chứa thông tin liên lạc của người khác.',
  'Mở nó đầu tiên mỗi sáng và làm sạch các dòng vàng.',
])}
${lienQuan('vi', [
  yt('rqqrZp4wPc8', 'Google Sheets Geeks', 'Job Hunt Tracker Simple in Google Sheets', 5),
  lienKet({ khoa: 'huong-dan-ct-work', bai: 'ctw-02-board-hang-ngay', title: 'Hướng dẫn CT Work — board hằng ngày', sub: 'Nếu bạn thích board hơn bảng tính: cùng một ý tưởng, thẻ đi qua các cột.' }),
])}
</div>
`,
};

/* ═══════════════════════ 0.4 — Quiz ═══════════════════════ */
const Q04 = {
  title: '0.4 — Section 0 check|||0.4 — Kiểm tra Mục 0',
  slug: 'pv-0-4-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về quy trình tuyển dụng, năm tín hiệu người phỏng vấn chấm, đọc tin tuyển dụng, nhận ra lừa đảo, ma trận kỹ năng và kế hoạch bốn tuần.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Check</span>
<h2>Section 0 check — how hiring works</h2>
<p class="lead">Ten situations. Each explanation says why the right answer is right and why the most tempting wrong answer is wrong — read them even when you answer correctly.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can list the rounds of a typical hiring funnel and say which ones internships in Vietnam often merge.</li>
<li>I can name the five signals an interviewer scores.</li>
<li>I can read a posting and turn its requirements into a study list.</li>
<li>I can recognise at least five signs of a fake job offer.</li>
<li>I have a skill matrix with evidence and a tracker with dated next steps.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Kiểm tra Mục 0 — tuyển dụng diễn ra thế nào</h2>
<p class="lead">Mười tình huống. Mỗi lời giải thích nói vì sao đáp án đúng là đúng và vì sao phương án sai hấp dẫn nhất lại sai — đọc cả khi bạn trả lời đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi kể được các vòng của một phễu tuyển dụng điển hình và nói được thực tập ở Việt Nam hay gộp vòng nào.</li>
<li>Tôi gọi tên được năm tín hiệu người phỏng vấn chấm.</li>
<li>Tôi đọc được một tin tuyển dụng và biến phần yêu cầu thành danh sách ôn.</li>
<li>Tôi nhận ra ít nhất năm dấu hiệu của một tin tuyển dụng giả.</li>
<li>Tôi có ma trận kỹ năng kèm bằng chứng và bảng theo dõi có bước tiếp theo kèm ngày.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      cau('An interviewer for an internship asks you to explain the project at the top of your CV, and you realise you cannot explain its login flow because a teammate wrote it. Which signal are you about to fail?|||Người phỏng vấn thực tập nhờ bạn giải thích dự án đầu CV, và bạn nhận ra mình không giải thích được luồng đăng nhập vì bạn cùng nhóm viết nó. Bạn sắp trượt tín hiệu nào?', [
        'Communication — you speak too fast|||Giao tiếp — bạn nói quá nhanh',
        'Ownership of your work — you must understand every line you present, including parts others wrote|||Làm chủ sản phẩm của mình — bạn phải hiểu từng dòng bạn trình bày, kể cả phần người khác viết',
        'Learning — you have not taken a course on authentication|||Học hỏi — bạn chưa học khoá xác thực nào',
        'Fundamentals of algorithms|||Nền tảng giải thuật',
      ], 1, 'EN: Ownership means you can explain what you put forward, whoever typed it. "Learning" is tempting, but the interviewer is not checking whether you took a course — they are checking whether the CV line is really yours.|||VI: Làm chủ sản phẩm nghĩa là bạn giải thích được thứ mình đưa ra, bất kể ai gõ. "Học hỏi" nghe hợp lý, nhưng người phỏng vấn không kiểm bạn đã học khoá nào — họ kiểm dòng đó trên CV có thật là của bạn không.'),
      cau('A posting lists: Java, Spring Boot, SQL, Git, English reading (requirements) and Docker, AWS (nice to have). You have strong Java, SQL and Git, basic Spring, no Docker or AWS. What should you do?|||Một tin ghi: Java, Spring Boot, SQL, Git, đọc tiếng Anh (yêu cầu) và Docker, AWS (ưu tiên). Bạn mạnh Java, SQL, Git, biết cơ bản Spring, chưa biết Docker và AWS. Bạn nên làm gì?', [
        'Skip it until you have learnt Docker and AWS|||Bỏ qua tới khi học xong Docker và AWS',
        'Apply and write Docker and AWS on the CV anyway|||Nộp và cứ ghi Docker, AWS lên CV',
        'Apply — you match most requirements; nice-to-haves only break ties|||Nộp — bạn khớp phần lớn yêu cầu; mục ưu tiên chỉ dùng khi ngang điểm',
        'Email HR first to ask whether Docker is mandatory|||Email cho HR trước để hỏi Docker có bắt buộc không',
      ], 2, 'EN: You match most of the real filter, so apply. Writing Docker and AWS without evidence is the trap: it is exactly the line an interviewer would probe. Skipping wastes a good match.|||VI: Bạn khớp phần lớn bộ lọc thật, nên nộp. Ghi Docker, AWS khi không có bằng chứng là cái bẫy: đó đúng là dòng người phỏng vấn sẽ đào. Bỏ qua thì phí một tin rất hợp.'),
      cau('A LinkedIn "recruiter" offers a remote internship with an unusually high allowance and asks you to clone a repository and run npm install "to check your environment" before any call. What is the safest response?|||Một "recruiter" trên LinkedIn mời thực tập remote với trợ cấp cao bất thường và nhờ bạn clone một kho mã, chạy npm install "để kiểm môi trường" trước mọi cuộc gọi. Phản ứng an toàn nhất là gì?', [
        'Read package.json scripts first, never run it on your main machine, and ask for a video call with a company-domain invitation|||Đọc phần scripts trong package.json trước, không bao giờ chạy trên máy chính, và đề nghị gọi video có thư mời từ email công ty',
        'Run it quickly — it is only npm install, not the app itself|||Chạy nhanh — chỉ là npm install, đâu phải chạy ứng dụng',
        'Run it but turn off Wi-Fi afterwards|||Chạy, rồi tắt Wi-Fi ngay sau đó',
        'Ignore it and block every recruiter on LinkedIn|||Lờ đi và chặn mọi recruiter trên LinkedIn',
      ], 0, 'EN: npm install can run postinstall scripts automatically, so "only npm install" is exactly how the Contagious Interview campaign infects developers. Turning Wi-Fi off afterwards is too late. Blocking everyone throws away real recruiters.|||VI: npm install có thể tự chạy script postinstall, nên "chỉ npm install thôi" chính là cách chiến dịch Contagious Interview lây vào lập trình viên. Tắt Wi-Fi sau đó là quá muộn. Chặn hết thì mất luôn recruiter thật.'),
      cau('Which statement about the history of interviews is accurate?|||Phát biểu nào về lịch sử phỏng vấn là chính xác?', [
        'Brain-teasers were proven to be the best predictor of performance|||Câu đố mẹo đã được chứng minh là cách dự đoán hiệu quả tốt nhất',
        'Google stopped using brain-teasers and kept structured interviews, which research shows predict performance better than unstructured chats|||Google bỏ câu đố mẹo và giữ phỏng vấn có cấu trúc — kiểu mà nghiên cứu cho thấy dự đoán hiệu quả tốt hơn nói chuyện tự do',
        'Structured interviews are only used for senior engineers|||Phỏng vấn có cấu trúc chỉ dùng cho kỹ sư cấp cao',
        'Interview questions are random, so preparation does not help|||Câu hỏi phỏng vấn là ngẫu nhiên, nên chuẩn bị không giúp gì',
      ], 1, 'EN: Laszlo Bock said in 2013 that brain-teasers were a waste of time; structured interviews outperform unstructured ones in the research (Schmidt and Hunter, 1998). Because questions come from banks, they can be prepared — the last option is the opposite of the truth.|||VI: Năm 2013 Laszlo Bock nói câu đố mẹo là lãng phí thời gian; nghiên cứu (Schmidt và Hunter, 1998) cho thấy phỏng vấn có cấu trúc tốt hơn kiểu tự do. Vì câu hỏi lấy từ ngân hàng nên chuẩn bị được — phương án cuối ngược hẳn sự thật.'),
      cau('You have sent 22 applications in three weeks and received no interview invitation. What is the most likely problem to check first?|||Bạn đã gửi 22 đơn trong ba tuần mà không được mời phỏng vấn lần nào. Vấn đề khả dĩ nhất cần kiểm trước là gì?', [
        'Your interview technique|||Kỹ năng phỏng vấn của bạn',
        'Your English pronunciation|||Phát âm tiếng Anh của bạn',
        'The market is closed until next year|||Thị trường đóng cửa tới sang năm',
        'The CV or the targeting — nobody has seen you interview yet|||CV hoặc việc nhắm vị trí — chưa ai được thấy bạn phỏng vấn cả',
      ], 3, 'EN: With no interviews at all, the funnel is failing at step 1, so the CV and the choice of postings are the suspects. Interview technique is tempting but cannot be the cause: no one has interviewed you yet.|||VI: Không có buổi phỏng vấn nào nghĩa là phễu hỏng ở bước 1, nên CV và việc chọn tin là nghi phạm. Kỹ năng phỏng vấn nghe hợp lý nhưng không thể là nguyên nhân: chưa ai phỏng vấn bạn cả.'),
      cau('In your skill matrix you gave yourself level 3 in Docker, but the evidence column is empty. What does the course recommend?|||Trong ma trận kỹ năng bạn tự chấm Docker mức 3, nhưng cột bằng chứng để trống. Khoá học khuyên gì?', [
        'Keep level 3 — confidence matters in interviews|||Giữ mức 3 — tự tin là quan trọng khi phỏng vấn',
        'Delete Docker from the matrix|||Xoá Docker khỏi ma trận',
        'Treat it as level 1 until you add a link or file you can show, because the strongest lines get probed hardest|||Coi là mức 1 cho tới khi thêm một đường dẫn hoặc tệp chỉ ra được, vì dòng mạnh nhất bị đào sâu nhất',
        'Ask a friend to rate you instead|||Nhờ bạn bè chấm hộ',
      ], 2, 'EN: A level is only worth its evidence. Keeping level 3 "for confidence" sets up the exact line an interviewer will drill into. Deleting it loses a real skill — add the proof instead.|||VI: Một mức chỉ đáng giá bằng bằng chứng của nó. Giữ mức 3 "cho tự tin" là tự dựng sẵn đúng dòng người phỏng vấn sẽ khoan vào. Xoá đi thì mất một kỹ năng thật — hãy bổ sung bằng chứng.'),
      cau('It is final-exam week. According to the four-week plan, how much time should go to this course?|||Đang là tuần thi cuối kỳ. Theo kế hoạch bốn tuần, nên dành bao nhiêu thời gian cho khoá này?', [
        'About 20 minutes a day on Section 0 only — exams first, because failing a subject can delay the internship|||Khoảng 20 phút mỗi ngày, chỉ Mục 0 — ưu tiên thi, vì trượt môn có thể làm lùi kỳ thực tập',
        'Full days, because the CV deadline is close|||Cả ngày, vì hạn CV đã gần',
        'None at all until the internship starts|||Không chút nào cho tới khi bắt đầu thực tập',
        'Only the technical chapters, skipping the CV|||Chỉ các chương kỹ thuật, bỏ phần CV',
      ], 0, 'EN: OJT eligibility depends on subjects owed, so the exams protect the internship itself. "Full days" is tempting because of the CV deadline, but the CV week starts right after the exams. Doing nothing wastes the time to build the tracker.|||VI: Điều kiện đi OJT phụ thuộc số môn còn nợ, nên kỳ thi bảo vệ chính kỳ thực tập. "Cả ngày" nghe hợp vì hạn CV, nhưng tuần CV bắt đầu ngay sau thi. Không làm gì thì phí thời gian dựng bảng theo dõi.'),
      cau('Which row in your tracker is "unfinished" by the rule of Lab 0?|||Dòng nào trong bảng theo dõi là "chưa xong" theo luật của Lab 0?', [
        'A row with status "Rejected" and notes|||Dòng có trạng thái "Bị từ chối" và có ghi chú',
        'A row with status "Applied" and next step "wait for reply until 30/11"|||Dòng "Đã nộp" với bước tiếp theo "chờ phản hồi tới 30/11"',
        'A row with status "Not applied" and next step "decide by 10/12"|||Dòng "Chưa nộp" với bước tiếp theo "quyết trước 10/12"',
        'A row with status "Applied" and an empty next-step column|||Dòng "Đã nộp" với cột bước tiếp theo để trống',
      ], 3, 'EN: Every open row needs a next step with a date; that is what turns a diary into a plan. The "Rejected" row is closed, and the other two have dated next steps.|||VI: Mọi dòng còn mở đều cần một bước tiếp theo kèm ngày; đó là thứ biến nhật ký thành kế hoạch. Dòng "Bị từ chối" đã đóng, còn hai dòng kia đều có bước tiếp theo có ngày.'),
      cau('You built most of a large personal platform with an AI coding assistant. How should that appear in your skill matrix?|||Bạn làm phần lớn một nền tảng cá nhân lớn cùng trợ lý AI viết code. Điều đó nên hiện trong ma trận kỹ năng thế nào?', [
        'Hide the AI part — interviewers will think less of you|||Giấu phần AI — người phỏng vấn sẽ đánh giá thấp bạn',
        'Score what you really did — architecture, review, operating and debugging — and use a hand-coded project as evidence of raw coding|||Chấm đúng cái bạn thật sự làm — kiến trúc, duyệt mã, vận hành và gỡ lỗi — và dùng một dự án tự code tay làm bằng chứng code thuần',
        'Score every technology in the project at level 3|||Chấm mọi công nghệ trong dự án ở mức 3',
        'Remove the project from your CV entirely|||Bỏ hẳn dự án khỏi CV',
      ], 1, 'EN: Truthful scoring keeps the project valuable and defensible. Hiding the AI part is the tempting wrong answer: one follow-up question ("change this function now") exposes it, and the honesty signal is lost.|||VI: Chấm trung thực giữ cho dự án có giá trị và bảo vệ được. Giấu phần AI là phương án sai hấp dẫn: chỉ một câu đào sâu ("sửa hàm này ngay nhé") là lộ, và mất luôn tín hiệu trung thực.'),
      cau('For an internship in Vietnam, which description of the process is most typical?|||Với thực tập ở Việt Nam, mô tả quy trình nào điển hình nhất?', [
        'Always six separate rounds over a month|||Luôn sáu vòng riêng biệt kéo dài một tháng',
        'Only an online algorithm test, never an interview|||Chỉ một bài test thuật toán online, không bao giờ phỏng vấn',
        'Often compressed into one or two meetings: an engineer asks about your project, a lead asks about you|||Thường nén còn một hai buổi: một kỹ sư hỏi về dự án, một trưởng nhóm hỏi về con người bạn',
        'A single phone call with HR decides everything|||Một cuộc gọi với HR quyết định tất cả',
      ], 2, 'EN: Internship processes in Vietnam are usually short; steps 2 to 5 of the funnel are often merged. The six-round month describes long processes, more common abroad. Some companies do add a test, but rarely without any interview.|||VI: Quy trình thực tập ở Việt Nam thường ngắn; bước 2 tới 5 của phễu hay bị gộp. Một tháng sáu vòng là kiểu quy trình dài, hay gặp ở nước ngoài hơn. Có công ty thêm bài test, nhưng hiếm khi không có buổi phỏng vấn nào.'),
    ],
  },
};

export default {
  title: 'Section 0 — How tech hiring works|||Mục 0 — Tuyển dụng IT diễn ra thế nào',
  description: 'Quy trình tuyển dụng và kế hoạch chuẩn bị: các vòng phỏng vấn ở Việt Nam và nước ngoài, năm tín hiệu người phỏng vấn chấm, kế hoạch bốn tuần khớp lịch OJT, tìm việc ở đâu và nhận ra lừa đảo, ma trận kỹ năng có bằng chứng, và bảng điều khiển tìm việc.',
  lessons: [B1, B2, L01, L02, L03, Q04],
};
