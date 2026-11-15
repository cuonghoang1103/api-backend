/**
 * IT Interview Prep — Chương 2: Kể câu chuyện của bạn (soạn 15/11/2026).
 * Khoá chữ, khuôn Mục 0 + helper ./_pv.mjs. GIỮ slug bài khung: pv-2-1…pv-2-4; thêm pv-2-5 (lab), pv-2-6 (quiz).
 * Câu chuyện mẫu dựng từ sự cố THẬT của cuongthai.com (CLAUDE.md + docs/so-loi.md) và đồ án LabFlow AI.
 * LUẬT: backtick → &#96;; không viết "${" trong chữ; < > & trong chữ → &lt; &gt; &amp;; không gạch chéo ngược.
 */
import { ra, lienKet, nguon, yt, flow, stack, bang, bay, keXau, doiThuong, neu, qa, thucHanh, thuatNgu, tomTat, lienQuan, rubric, cau } from './_pv.mjs';

/* ═══════════════════════ 2.1 — Giới thiệu bản thân ═══════════════════════ */
const GT_EN = `
PRESENT (20-25 s)
"I'm Cuong, a fourth-year Software Engineering student at FPT University.
I focus on backend development - mainly Node.js with TypeScript and PostgreSQL,
and I'm learning Spring Boot for my capstone."

PAST (40-50 s)
"For the past year I've built and run my own learning platform. It's a Next.js
frontend, an Express and Prisma API, PostgreSQL and Redis, all in Docker on a
Linux server. I wrote much of it with an AI coding assistant, so the part I'm
proudest of is operating it: I designed the deploy process - images are built
on a home machine and the server only swaps them - and I've handled real
incidents, like a deploy that took the API down for seven minutes. After that
I added a check that catches the cause before anything is shipped.
Separately, I'm hand-coding my capstone, LabFlow AI, a lab-equipment system in
Spring Boot and React, to make sure my own coding fundamentals are solid."

FUTURE (15-20 s)
"I'm looking for a backend internship where I can work on a real product with a
team, learn code review and testing properly, and contribute from the first
month. Your team's work on [something from the posting] is why I applied."
`;

const GT_VI = `
HIỆN TẠI (20-25 giây)
"Em là Cường, sinh viên năm tư ngành Kỹ thuật phần mềm, Đại học FPT.
Em tập trung vào backend - chủ yếu Node.js với TypeScript và PostgreSQL,
và đang học Spring Boot cho đồ án tốt nghiệp."

QUÁ KHỨ (40-50 giây)
"Khoảng một năm nay em tự dựng và vận hành một nền tảng học tập. Frontend là
Next.js, API dùng Express và Prisma, dữ liệu PostgreSQL và Redis, tất cả chạy
Docker trên một máy chủ Linux. Phần lớn mã em viết cùng trợ lý AI, nên phần em
tự hào nhất là vận hành: em thiết kế quy trình deploy - ảnh dựng ở máy nhà, máy
chủ chỉ tráo ảnh - và đã xử lý sự cố thật, như một lần deploy làm API chết bảy
phút. Sau lần đó em thêm một bước kiểm chặn đúng nguyên nhân ấy trước khi đẩy.
Song song, em tự code tay đồ án LabFlow AI, hệ thống quản lý thiết bị phòng lab
bằng Spring Boot và React, để chắc nền tảng code của chính mình."

TƯƠNG LAI (15-20 giây)
"Em đang tìm một vị trí thực tập backend để làm sản phẩm thật cùng một đội, học
review code và testing cho bài bản, và đóng góp được ngay từ tháng đầu. Em nộp
vào bên mình vì [một điều cụ thể trong tin tuyển dụng / sản phẩm của công ty]."
`;

const L21 = {
  title: '2.1 — "Tell me about yourself": a 90-second answer in Vietnamese and English|||2.1 — "Giới thiệu về bản thân": câu trả lời 90 giây bằng tiếng Việt và tiếng Anh',
  slug: 'pv-2-1-gioi-thieu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Câu hỏi mở màn của gần như mọi buổi phỏng vấn: khung Hiện tại – Quá khứ – Tương lai trong 90 giây, bản mẫu viết từ dự án thật (cuongthai.com + LabFlow AI), cách cắt cho từng vị trí, cách nói trung thực về phần AI viết, và những câu mở đầu làm hỏng ấn tượng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>"Tell me about yourself" — the 90 seconds that set the whole interview</h2>
<p class="lead">It is the first question in almost every interview, in Vietnamese ("Em giới thiệu về bản thân nhé") or in English, and it is not small talk. Your answer decides what the interviewer asks next: mention a deploy incident and they will ask about it; mention nothing concrete and they will fall back on generic questions. This lesson gives you a structure, a full sample built from a real student’s projects, and the rules for adapting it.</p>

<h3>An everyday picture: the trailer, not the film</h3>
${doiThuong('en', 'A film trailer does not tell the whole story. In ninety seconds it shows who the main character is, one or two strong scenes, and why you should buy a ticket. Your self-introduction is a trailer for the next forty-five minutes: who you are, one or two scenes from your projects that make the interviewer curious, and why you want this particular job. If they are curious, they will ask — and then you tell the rest of the film.')}

<h3>The structure: Present → Past → Future</h3>
${flow([
  ['Present · 20–25 s', 'who you are now, in one breath', 'Year, major, school, and the direction you focus on. One sentence of focus beats a list of ten technologies.'],
  ['Past · 40–50 s', 'one or two pieces of evidence', 'The project you want them to ask about, with one concrete detail (a number, an incident, a decision). This is the "hook".'],
  ['Future · 15–20 s', 'why this role, why here', 'What you want to learn and contribute, and one specific reason you chose this company — taken from the posting.'],
])}
<p>Why this order? Interviewers listen hardest at the start and the end. The present orients them, the past gives them something to ask about, and the future connects you to <em>their</em> job, so the conversation turns toward the role rather than drifting.</p>

<h3>A full sample, built from real projects</h3>
<p>This sample is written for a student with two kinds of evidence: a large personal platform he <strong>operates</strong> (built with substantial help from an AI coding assistant) and a capstone he <strong>codes by hand</strong>. Read it, then rewrite every sentence with your own facts.</p>
${ra(GT_EN)}
<p>Count what it does: one clear focus (backend), two pieces of evidence of different kinds, a number (seven minutes), an honest line about AI that turns into a strength (operations), a sign of fundamentals (hand-coded capstone), and a link to the company. Spoken at a calm pace this is about 90 seconds.</p>

<h3>Rules for making it yours</h3>
<ul>
<li><strong>One focus.</strong> Say "backend" or "fullstack with a backend lean", not "I like everything".</li>
<li><strong>Every noun must survive a follow-up.</strong> If you say "Redis", be ready for "what do you use Redis for?". If not, cut the word.</li>
<li><strong>Prefer one incident to five features.</strong> "I handled a deploy that took the API down" invites a story; "it has chat, courses, payments and a game" invites nothing.</li>
<li><strong>Change the Future part for each company</strong>; keep the Present and Past stable so you can say them without thinking.</li>
<li><strong>Do not recite your CV line by line</strong> — they already have it. The introduction is the story behind it.</li>
</ul>
${bay('en', 'starting with your hometown, hobbies and family.', 'In a technical interview the first thirty seconds are precious. "I was born in Nghe An, I like football and travelling" uses them on facts the interviewer cannot ask a technical question about. Keep personal details for the end, if at all — or for when they ask.')}

<h3>Variants: Java role, frontend role, English-only</h3>
${bang(['Target', 'What changes'], [
  ['Java / Spring backend', 'Lead with the capstone: "I’m building LabFlow AI in Spring Boot — layered modules, PostgreSQL, a React frontend". The platform becomes the second piece of evidence (operations, Docker, incidents).'],
  ['Frontend / fullstack', 'Lead with what users see: a page you built, how it behaves on a phone, a performance or accessibility fix. Keep one backend sentence to show you understand the API you call.'],
  ['English interview', 'Same structure, shorter sentences, about 60 seconds. Chapter 8 trains the pronunciation of the technical words.'],
])}
${neu('en', 'the interviewer interrupts you after twenty seconds with a question? Good — stop and answer it. The introduction is a tool to start a conversation, not a speech to finish. Never say "let me finish first".')}
${keXau('en', 'be careful how much personal data you put in a self-introduction video you upload publicly (Lab 2.5). Full name + school + student ID + phone number in one public video is enough for someone to impersonate you to a school office or open accounts in your name. Keep practice videos private, and never show your student card on camera.')}

<h3>Interview questions on this lesson</h3>
${qa('en', { so: '2.1-1', q: '"Tell me about yourself."', chu: 'whether you can choose what matters and give them a thread to pull.', a: '<p>Use the Present–Past–Future frame above, 60–90 seconds, ending with why this role. Stop speaking when you finish — do not trail off with "…so, yeah".</p>', sau: ['"You said you operate it — what does that mean day to day?"', '"Why did you choose PostgreSQL?"', '"Which part did the AI write, and which did you?"'], loi: 'a three-minute life story, or a list of technologies with no example.' })}
${qa('en', { so: '2.1-2', q: '"Why should we take you as an intern?"', chu: 'one concrete strength linked to their needs.', a: '<p>"Your posting asks for REST APIs and SQL. I have an API that real users hit every day, I designed its database migrations, and I have already been through a production incident and fixed its cause. I also learn fast because I document every bug I fix — I can show you that log."</p>', sau: ['"Show me that log."', '"What would you need from a mentor in the first month?"'], loi: '"Because I am hard-working and eager to learn" — every candidate says this.' })}
${thucHanh('en', { phut: '30', steps: [
  'Write your own Present–Past–Future script for your main direction, using the template. Maximum 200 words.',
  'Underline every technical noun and write, next to each, the first follow-up question it would trigger. Delete any noun you cannot answer about.',
  'Say it aloud with a timer three times. Aim for 80–95 seconds.',
  'Write a second Future paragraph for one specific company from your tracker.',
], dat: 'your script is under 200 words, lasts 80–95 seconds aloud, and every technical noun has a prepared follow-up answer.' })}
${thuatNgu('en', [
  ['Self-introduction / elevator pitch', 'A short spoken summary of who you are and why you fit — about the length of a lift ride.'],
  ['Hook', 'A concrete detail that makes the listener want to ask more.'],
  ['Follow-up question', 'The next question built on something you just said.'],
  ['Focus', 'The one direction you present yourself in (backend, frontend…).'],
  ['Filler words', '"Um", "like", "kiểu là" — sounds that fill silence and weaken your message.'],
])}
${tomTat('en', [
  'The self-introduction is a trailer: who you are, one strong scene, why this job.',
  'Present (20–25 s) → Past (40–50 s) → Future (15–20 s), about 90 seconds in total.',
  'Every technical word you say must survive a follow-up; cut the ones that do not.',
  'Say honestly what an AI wrote and what you did — then make your real part the strength.',
  'Keep Present and Past stable; rewrite Future for each company.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'communication-and-in-group-working-skills', bai: 'ssg104-5-1-thuyet-trinh', academy: true, L: 'en', title: 'Academy · SSG104 5.1 — Presenting with impact', sub: 'Voice, pace and structure — the same skills, applied to a 90-second talk.' }),
  yt('aJdA4eD7rkA', 'Leonard Thiele', 'How To Introduce Yourself as a Software Engineer: Tell Me About Yourself!', 6, 'en'),
  nguon('📘', 'Tech Interview Handbook — Self introduction', 'A short guide with more sample structures.', 'https://www.techinterviewhandbook.org/behavioral-interview/'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>"Giới thiệu về bản thân" — 90 giây quyết định cả buổi phỏng vấn</h2>
<p class="lead">Đây là câu hỏi đầu tiên của gần như mọi buổi phỏng vấn, bằng tiếng Việt ("Em giới thiệu về bản thân nhé") hay tiếng Anh ("Tell me about yourself"), và nó không phải câu xã giao. Câu trả lời của bạn quyết định người phỏng vấn hỏi gì tiếp: nhắc tới một sự cố deploy thì họ sẽ hỏi về nó; không nhắc gì cụ thể thì họ quay về mấy câu hỏi chung chung. Bài này cho bạn một khung, một bản mẫu trọn vẹn dựng từ dự án thật của một sinh viên, và luật để biến nó thành của bạn.</p>

<h3>Liên tưởng đời thường: đoạn trailer, không phải cả bộ phim</h3>
${doiThuong('vi', 'Trailer phim không kể hết câu chuyện. Trong chín mươi giây nó cho bạn thấy nhân vật chính là ai, một hai cảnh mạnh nhất, và vì sao bạn nên mua vé. Phần tự giới thiệu là trailer cho bốn mươi lăm phút tiếp theo: bạn là ai, một hai cảnh trong dự án khiến người phỏng vấn tò mò, và vì sao bạn muốn đúng công việc này. Họ tò mò thì họ sẽ hỏi — lúc đó bạn mới kể phần còn lại của bộ phim.')}

<h3>Khung: Hiện tại → Quá khứ → Tương lai</h3>
${flow([
  ['Hiện tại · 20–25 giây', 'bây giờ bạn là ai, nói trong một hơi', 'Năm học, ngành, trường, và hướng bạn tập trung. Một câu về hướng đi mạnh hơn danh sách mười công nghệ.'],
  ['Quá khứ · 40–50 giây', 'một hai bằng chứng', 'Dự án bạn MUỐN họ hỏi tới, kèm một chi tiết cụ thể (một con số, một sự cố, một quyết định). Đây là cái "móc câu".'],
  ['Tương lai · 15–20 giây', 'vì sao vị trí này, vì sao công ty này', 'Bạn muốn học gì và đóng góp gì, cộng một lý do cụ thể bạn chọn công ty — lấy từ chính tin tuyển dụng.'],
])}
<p>Vì sao theo thứ tự này? Người phỏng vấn nghe chăm chú nhất ở đầu và ở cuối. Phần hiện tại giúp họ định vị, phần quá khứ cho họ thứ để hỏi, phần tương lai nối bạn vào công việc <em>của họ</em>, nên câu chuyện rẽ về vị trí đang tuyển thay vì trôi lan man.</p>

<h3>Một bản mẫu trọn vẹn, dựng từ dự án thật</h3>
<p>Bản mẫu này viết cho một sinh viên có hai loại bằng chứng: một nền tảng cá nhân lớn mà bạn ấy <strong>vận hành</strong> (làm với sự trợ giúp đáng kể của trợ lý AI viết code) và một đồ án bạn ấy <strong>tự code tay</strong>. Đọc nó, rồi viết lại từng câu bằng sự thật của chính bạn.</p>
${ra(GT_VI)}
<p>Đếm xem nó làm được gì: một hướng rõ (backend), hai bằng chứng thuộc hai loại khác nhau, một con số (bảy phút), một câu trung thực về AI được biến thành điểm mạnh (vận hành), một dấu hiệu nền tảng vững (đồ án tự code tay), và một sợi dây nối tới công ty. Nói với tốc độ bình tĩnh thì vừa khoảng 90 giây.</p>

<h3>Luật để biến bản mẫu thành của bạn</h3>
<ul>
<li><strong>Một hướng duy nhất.</strong> Nói "backend" hoặc "fullstack thiên về backend", đừng nói "em thích tất cả".</li>
<li><strong>Mỗi danh từ phải sống sót qua một câu hỏi đào sâu.</strong> Bạn nói "Redis" thì phải sẵn sàng cho "em dùng Redis để làm gì?". Không sẵn sàng thì bỏ chữ đó đi.</li>
<li><strong>Một sự cố hơn năm tính năng.</strong> "Em đã xử lý một lần deploy làm sập API" mời gọi một câu chuyện; "nó có chat, khoá học, thanh toán và game" chẳng mời gọi gì.</li>
<li><strong>Đổi phần Tương lai cho từng công ty</strong>; giữ ổn định phần Hiện tại và Quá khứ để nói được mà không phải nghĩ.</li>
<li><strong>Đừng đọc lại CV từng dòng</strong> — họ có CV rồi. Phần giới thiệu là câu chuyện đằng sau tờ CV.</li>
</ul>
${bay('vi', 'mở đầu bằng quê quán, sở thích và gia đình.', 'Trong phỏng vấn kỹ thuật, ba mươi giây đầu rất quý. "Em sinh ra ở Nghệ An, em thích đá bóng và du lịch" tiêu chúng vào những điều người phỏng vấn không thể hỏi một câu kỹ thuật nào. Chuyện cá nhân để cuối, nếu có — hoặc để tới lúc họ hỏi.')}

<h3>Biến thể: vị trí Java, vị trí frontend, phỏng vấn tiếng Anh</h3>
${bang(['Vị trí nhắm', 'Đổi gì'], [
  ['Backend Java / Spring', 'Mở bằng đồ án: "Em đang làm LabFlow AI bằng Spring Boot — chia module theo tầng, PostgreSQL, frontend React". Nền tảng cá nhân thành bằng chứng thứ hai (vận hành, Docker, sự cố).'],
  ['Frontend / fullstack', 'Mở bằng thứ người dùng nhìn thấy: một trang bạn làm, nó chạy trên điện thoại ra sao, một lần sửa hiệu năng hay khả năng tiếp cận. Giữ một câu backend để cho thấy bạn hiểu cái API mình gọi.'],
  ['Phỏng vấn tiếng Anh', 'Cùng khung, câu ngắn hơn, khoảng 60 giây. Chương 8 luyện phát âm các từ kỹ thuật.'],
])}
${neu('vi', 'người phỏng vấn cắt ngang bạn sau hai mươi giây để hỏi? Tốt — dừng lại và trả lời câu đó. Phần giới thiệu là công cụ để mở một cuộc trò chuyện, không phải bài diễn văn phải đọc cho hết. Đừng bao giờ nói "anh cho em nói hết đã".')}
${keXau('vi', 'cẩn thận với lượng thông tin cá nhân trong video tự giới thiệu nếu bạn đăng công khai (Lab 2.5). Họ tên đầy đủ + trường + mã số sinh viên + số điện thoại trong cùng một video công khai là đủ để kẻ xấu giả danh bạn với phòng đào tạo hay mở tài khoản đứng tên bạn. Để video luyện tập ở chế độ riêng tư, và không bao giờ đưa thẻ sinh viên lên camera.')}

<h3>Câu hỏi phỏng vấn của bài này</h3>
${qa('vi', { so: '2.1-1', q: '"Em giới thiệu về bản thân nhé."', chu: 'bạn có biết chọn điều quan trọng và đưa cho họ một sợi chỉ để kéo không.', a: '<p>Dùng khung Hiện tại – Quá khứ – Tương lai ở trên, 60–90 giây, kết bằng lý do chọn vị trí này. Nói xong thì DỪNG — đừng kéo dài bằng "…dạ, đại khái vậy ạ".</p>', sau: ['"Em nói em vận hành nó — cụ thể hằng ngày em làm gì?"', '"Vì sao em chọn PostgreSQL?"', '"Phần nào AI viết, phần nào em làm?"'], loi: 'kể đời mình ba phút, hoặc đọc một danh sách công nghệ mà không có ví dụ nào.' })}
${qa('vi', { so: '2.1-2', q: '"Vì sao bên anh nên nhận em vào thực tập?"', chu: 'một điểm mạnh cụ thể khớp với nhu cầu của họ.', a: '<p>"Tin tuyển dụng của bên mình cần REST API và SQL. Em có một API mà người dùng thật gọi mỗi ngày, em thiết kế các migration cơ sở dữ liệu của nó, và em đã trải qua một sự cố production rồi sửa tận nguyên nhân. Em cũng học nhanh vì em ghi lại mọi lỗi mình sửa — em cho anh xem sổ đó được."</p>', sau: ['"Cho anh xem sổ đó."', '"Tháng đầu em cần gì từ người hướng dẫn?"'], loi: '"Vì em chăm chỉ và ham học hỏi" — ứng viên nào cũng nói thế.' })}
${thucHanh('vi', { phut: '30', steps: [
  'Viết kịch bản Hiện tại – Quá khứ – Tương lai cho hướng chính của bạn, dựa theo bản mẫu. Tối đa 200 chữ (bản tiếng Việt có thể dài hơn chút, nhưng nói không quá 95 giây).',
  'Gạch chân mọi danh từ kỹ thuật và viết cạnh mỗi cái câu đào sâu đầu tiên nó sẽ kéo theo. Xoá danh từ nào bạn không trả lời được.',
  'Nói to có bấm giờ ba lần. Nhắm 80–95 giây.',
  'Viết thêm một đoạn Tương lai thứ hai cho một công ty cụ thể trong bảng theo dõi.',
], dat: 'kịch bản nói to trong 80–95 giây, và mọi danh từ kỹ thuật trong đó đều có sẵn câu trả lời cho câu đào sâu.' })}
${thuatNgu('vi', [
  ['Self-introduction / elevator pitch (lời tự giới thiệu ngắn)', 'Bản tóm tắt nói bằng miệng về bạn là ai và vì sao bạn hợp — dài cỡ một chuyến thang máy.'],
  ['Hook (móc câu)', 'Một chi tiết cụ thể khiến người nghe muốn hỏi thêm.'],
  ['Follow-up question (câu hỏi đào sâu)', 'Câu hỏi kế tiếp dựng trên điều bạn vừa nói.'],
  ['Focus (hướng tập trung)', 'Một hướng duy nhất bạn trình bày bản thân (backend, frontend…).'],
  ['Filler words (từ đệm)', '"Ờ", "kiểu là", "thì là" — âm thanh lấp chỗ trống làm loãng thông điệp.'],
])}
${tomTat('vi', [
  'Lời tự giới thiệu là trailer: bạn là ai, một cảnh mạnh, vì sao công việc này.',
  'Hiện tại (20–25 giây) → Quá khứ (40–50 giây) → Tương lai (15–20 giây), tổng khoảng 90 giây.',
  'Mỗi từ kỹ thuật bạn nói phải sống sót qua một câu đào sâu; từ nào không thì bỏ.',
  'Nói thật phần nào AI viết, phần nào bạn làm — rồi biến phần thật của bạn thành điểm mạnh.',
  'Giữ ổn định Hiện tại và Quá khứ; viết lại phần Tương lai cho từng công ty.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'communication-and-in-group-working-skills', bai: 'ssg104-5-1-thuyet-trinh', academy: true, title: 'Academy · SSG104 5.1 — Thuyết trình có sức nặng', sub: 'Giọng, nhịp và cấu trúc — cùng kỹ năng ấy, áp vào một bài nói 90 giây.' }),
  yt('aJdA4eD7rkA', 'Leonard Thiele', 'How To Introduce Yourself as a Software Engineer: Tell Me About Yourself!', 6),
  nguon('📘', 'Tech Interview Handbook — Behavioral interview', 'Hướng dẫn ngắn có thêm các khung giới thiệu mẫu (tiếng Anh).', 'https://www.techinterviewhandbook.org/behavioral-interview/'),
])}
</div>
`,
};

/* ═══════════════════════ 2.2 — STAR ═══════════════════════ */
const STAR_EN = `
S  My personal learning platform runs in Docker on one Linux server. To keep the
   server's disk free, the images are built on a home machine, pushed to a
   registry, and the server only pulls and swaps them.
T  One evening, right after a deploy, the API started answering 502. I am the
   only person running it, so I had to bring it back and make sure it could not
   happen the same way again.
A  First I checked the containers: the backend was restarting in a loop. Its log
   said the Prisma query engine could not be loaded. I compared the image with
   the previous one and found the cause: my build script ran "docker build ."
   which picked the default Dockerfile - an Alpine image (musl libc) - instead of
   the Dockerfile the server uses, which ships a Prisma engine built for glibc.
   I put the previous image back, then fixed the script to always pass -f with
   the right file, and added a check that refuses to push an image whose libc
   does not match its Prisma engine.
R  The API was down for about seven minutes. Since then that class of broken
   image is stopped before it leaves the build machine, and I wrote down a
   recovery procedure - re-tagging the previous image - that takes about forty
   seconds instead of a fifteen-minute rebuild.
L  "The build is green" does not mean "the image runs". I now test what I ship,
   not just that it was built.
`;

const STAR_VI = `
S  Nền tảng học tập cá nhân của em chạy Docker trên một máy chủ Linux. Để đĩa máy
   chủ luôn trống, ảnh được dựng ở máy nhà, đẩy lên registry, máy chủ chỉ kéo về
   và tráo.
T  Một tối, ngay sau một lần deploy, API bắt đầu trả 502. Em là người duy nhất
   vận hành, nên em phải đưa nó sống lại và bảo đảm nó không thể hỏng y như thế
   lần nữa.
A  Đầu tiên em xem container: backend khởi động lại liên tục. Log báo engine truy
   vấn của Prisma không nạp được. Em so ảnh mới với ảnh trước và tìm ra nguyên
   nhân: script dựng ảnh chạy "docker build ." nên lấy Dockerfile mặc định - nền
   Alpine (thư viện C musl) - thay vì Dockerfile máy chủ dùng, thứ mang engine
   Prisma dựng cho glibc. Em đưa ảnh cũ trở lại, sửa script để luôn truyền -f với
   đúng tệp, và thêm một bước kiểm từ chối đẩy mọi ảnh có libc lệch với engine
   Prisma của nó.
R  API chết khoảng bảy phút. Từ đó loại ảnh hỏng này bị chặn ngay khi chưa rời
   máy dựng, và em ghi lại quy trình khôi phục - gắn lại tag cho ảnh cũ - mất
   khoảng bốn mươi giây thay vì dựng lại mười lăm phút.
L  "Build xanh" không có nghĩa là "ảnh chạy được". Giờ em kiểm thứ mình giao đi,
   không chỉ kiểm là nó đã dựng xong.
`;

const L22 = {
  title: '2.2 — STAR stories from your own projects: structure, "I" not "we", and numbers|||2.2 — Câu chuyện STAR từ dự án của bạn: cấu trúc, "em" chứ không phải "nhóm", và con số',
  slug: 'pv-2-2-star',
  type: 'LESSON',
  isFreePreview: true,
  description: 'STAR (Tình huống – Nhiệm vụ – Hành động – Kết quả) cộng bài học: vì sao người phỏng vấn dùng nó, tỉ lệ thời gian cho từng phần, cách nói "em đã làm" khi làm nhóm hay làm cùng AI, lấy số liệu thật ở đâu, một câu chuyện mẫu trọn vẹn từ sự cố 502 thật, và cách dựng kho 6–8 câu chuyện dùng cho mọi câu hỏi.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>STAR: turning what you did into a story an interviewer can score</h2>
<p class="lead">"Tell me about a time when…" — every behavioural question starts like this, and every one is scored the same way: did the candidate describe a real situation, what they personally did, and what came of it? STAR is the shape that makes that easy to hear. This lesson teaches the shape, the timing, the two habits that separate strong stories from weak ones, and a complete example built from a real production incident.</p>

<h3>An everyday picture: reporting a traffic accident</h3>
${doiThuong('en', 'When you report a small accident to the insurance company, they do not want your feelings about traffic in Hanoi. They want: where and when it happened (situation), what you were trying to do (task), what you did step by step (action), and the damage and what happened next (result). Say it in that order and the claim is processed; ramble and they ask you to start again. Interviewers are the insurance clerk of your career: give them the four boxes, filled in.')}

<h3>The four boxes, plus one</h3>
${flow([
  ['S · Situation · ~15%', 'the context in two sentences', 'Where, when, which project, what was normal before. Only what is needed to understand the problem.'],
  ['T · Task · ~10%', 'your responsibility or goal', 'What you, specifically, had to achieve. Often one sentence.'],
  ['A · Action · ~55%', 'what YOU did, step by step', 'The heart of the story: the steps, the decisions and why. This is where you are scored.'],
  ['R · Result · ~15%', 'what changed, with a number if possible', 'Outcome, measured: time, errors, users, money, speed. Include honest partial results.'],
  ['L · Lesson · ~5%', 'what you do differently now', 'One sentence. Many interviewers ask for it anyway; offering it shows maturity.'],
])}
<p>A good STAR answer lasts <strong>about two minutes</strong>. Less than one minute usually means the Action is missing; more than three means the Situation is too long.</p>

<h3>A complete example from a real incident</h3>
<p>The story below is based on a real outage of a student-run learning platform (August 2026). Notice how the Action is more than half of it, and how every step is something the speaker did or decided.</p>
${ra(STAR_EN)}

<h3>Habit 1 — "I", not "we"</h3>
<p>In team projects students say "we did X" for everything, and the interviewer cannot tell what <em>you</em> can do. Use "we" for the context and "I" for your actions: "We were four in the SWP391 team; <strong>I</strong> owned the booking module, <strong>I</strong> designed its tables, and <strong>I</strong> wrote the conflict check." The same applies to AI: "the assistant generated the first version of the script; <strong>I</strong> found that it used the wrong Dockerfile and <strong>I</strong> added the check". Honest and specific beats modest and vague.</p>
${bay('en', 'a story where nothing could have gone wrong.', '"I was assigned the login page and I finished it on time" is not a story — there was no difficulty, so no decision, so nothing to score. Choose situations with a problem: something broke, two people disagreed, time ran out, a requirement was unclear. The difficulty is what makes your Action visible.')}

<h3>Habit 2 — real numbers, from real records</h3>
<p>Numbers make a story believable, but only if they are true. Good sources you already have: deploy logs and timestamps (how long it was down), Git history (how many commits, how many days), issue trackers (how many tickets), build times, test counts, the size of a table. If you do not have a number, describe the scale honestly ("a few dozen users", "the whole team of four") — never invent "improved performance by 300%".</p>
${stack([
  ['Time', 'down for 7 minutes · recovery in about 40 s · build 3–6 min instead of ~15'],
  ['Size', 'a 46-requirement capstone plan · ~600 database models · 11 version bumps in 4.5 hours'],
  ['Effect', 'the same failure blocked before shipping · zero repeats since · one fewer manual step'],
  ['Honest scale', '"used by my classmates and a few hundred visitors", not "thousands of users" you cannot prove'],
])}

<h3>Your story bank: six to eight stories cover everything</h3>
<p>You do not need a different story for each of the fifty possible questions. Prepare six to eight strong stories and learn to point each one at several questions:</p>
${bang(['Story (example)', 'Answers questions about…'], [
  ['The 502 after a bad image (above)', 'a failure · pressure · debugging · ownership · a lesson learnt'],
  ['Moving deploys off "push to main" after two outages', 'a process you improved · a hard decision · learning from mistakes'],
  ['Choosing a modular monolith over microservices for the capstone', 'a disagreement · a technical decision · working alone'],
  ['A seed script that passed every check but broke production', 'testing · attention to detail · "how do you verify?"'],
  ['A teammate on another OS whose setup failed (SWP391)', 'teamwork · helping others · communication'],
  ['Learning Docker by running your own server', 'learning fast · self-motivation'],
])}
${neu('en', 'you only have school projects and no incidents? Then use school situations: a requirement the teacher changed a week before a milestone, a merge conflict the night before the demo, a teammate who disappeared. They are real, and interviewers of interns expect exactly these.')}
${keXau('en', 'do not put secrets or internal details into stories you post publicly (a blog, LinkedIn). "Our server’s IP is…", the name of an unpatched component, or a screenshot with tokens in it can help an attacker. Tell the shape of the incident, not the keys to the house.')}

<h3>Practice questions</h3>
${qa('en', { so: '2.2-1', q: '"Tell me about a technical problem you solved."', chu: 'a clear Action with real decisions, and a measurable Result.', a: '<p>Use the 502 story: two sentences of situation, one of task, then the diagnosis steps (container status → log → compare images → root cause), the immediate fix and the prevention, the seven minutes, and the lesson.</p>', sau: ['"Why did the default Dockerfile exist at all?"', '"How does the libc check work?"', '"What would you monitor so you notice faster?"'], loi: 'jumping to the fix without explaining how the cause was found.' })}
${qa('en', { so: '2.2-2', q: '"What was your role in your team project?"', chu: 'what you can do alone, inside a team.', a: '<p>"We were five; I owned the equipment-borrowing module end to end — the tables, the API and the React screens — and I reviewed the pull requests of two teammates. The hardest part I did was the rule that prevents two people from booking the same device for overlapping times."</p>', sau: ['"How did you implement that rule?"', '"What would you change about how the team split work?"'], loi: '"I did a bit of everything" or only "we".' })}
${thucHanh('en', { phut: '45', steps: [
  'List six to eight situations from your projects that had a real difficulty.',
  'Write two of them fully in STAR+L, Action at least half of the words.',
  'Mark every number; next to each, write where it comes from (log, Git, tracker). Remove any number without a source.',
  'Fill the "answers questions about…" column for all your stories.',
  'Tell one story aloud with a timer: 1.5–2.5 minutes.',
], dat: 'you have a story bank of at least six titles, two full STAR stories with sourced numbers, and one told within 2.5 minutes.' })}
${thuatNgu('en', [
  ['STAR', 'Situation – Task – Action – Result: the standard shape of a behavioural answer.'],
  ['STAR+L', 'STAR plus Lesson: what you do differently now.'],
  ['Behavioural question', '"Tell me about a time when…" — asks for past behaviour as a predictor of future behaviour.'],
  ['Root cause', 'The underlying reason a problem happened, not just its symptom.'],
  ['Story bank', 'Six to eight prepared stories, each mapped to several question types.'],
  ['Outage', 'A period when a service is unavailable to users.'],
])}
${tomTat('en', [
  'STAR = Situation, Task, Action, Result; add a one-line Lesson.',
  'Action is more than half the story; the whole answer lasts about two minutes.',
  'Say "we" for context and "I" for your actions — including what you did versus what an AI tool produced.',
  'Use only numbers you can trace to a record; describe scale honestly when you have none.',
  'Six to eight stories, each mapped to several questions, cover almost every behavioural interview.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'docker', bai: 'dk-6-2-chon-anh-nen', L: 'en', title: 'Docker 6.2 — Choosing a base image, and the musl trap', sub: 'The technical background of the 502 story — be ready to explain it.' }),
  yt('zoGZQatkqKg', 'Indeed', 'Behavioral Interview Questions and Answers: Use the STAR Technique', 10, 'en'),
  nguon('📘', 'Tech Interview Handbook — Behavioral interview', 'How behavioural rounds are scored, with STAR examples.', 'https://www.techinterviewhandbook.org/behavioral-interview/'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>STAR: biến điều bạn đã làm thành câu chuyện người phỏng vấn chấm được</h2>
<p class="lead">"Kể cho anh nghe về một lần mà…" — mọi câu hỏi hành vi đều mở đầu như vậy, và câu nào cũng được chấm theo cùng một cách: ứng viên có tả một tình huống thật không, chính họ đã làm gì, và kết quả ra sao? STAR là hình dạng giúp người nghe nhận ra ba điều đó dễ dàng. Bài này dạy hình dạng ấy, cách chia thời gian, hai thói quen tách câu chuyện mạnh khỏi câu chuyện yếu, và một ví dụ trọn vẹn dựng từ một sự cố production có thật.</p>

<h3>Liên tưởng đời thường: khai báo một vụ va quẹt xe</h3>
${doiThuong('vi', 'Khi báo một vụ va quẹt nhỏ cho bảo hiểm, họ không cần cảm xúc của bạn về giao thông Hà Nội. Họ cần: chuyện xảy ra ở đâu, lúc nào (tình huống), bạn lúc đó định làm gì (nhiệm vụ), bạn đã làm gì từng bước (hành động), và thiệt hại ra sao, sau đó thế nào (kết quả). Kể đúng thứ tự đó thì hồ sơ được xử lý; nói lan man thì họ bắt kể lại từ đầu. Người phỏng vấn chính là nhân viên bảo hiểm của sự nghiệp bạn: hãy đưa họ bốn ô, đã điền sẵn.')}

<h3>Bốn ô, cộng thêm một</h3>
${flow([
  ['S · Situation (tình huống) · ~15%', 'bối cảnh trong hai câu', 'Ở đâu, khi nào, dự án nào, bình thường mọi thứ ra sao. Chỉ đủ để hiểu vấn đề.'],
  ['T · Task (nhiệm vụ) · ~10%', 'trách nhiệm hay mục tiêu của bạn', 'Điều chính bạn phải đạt được. Thường chỉ một câu.'],
  ['A · Action (hành động) · ~55%', 'BẠN đã làm gì, từng bước', 'Trái tim của câu chuyện: các bước, các quyết định và lý do. Đây là chỗ bạn được chấm điểm.'],
  ['R · Result (kết quả) · ~15%', 'điều gì thay đổi, có số càng tốt', 'Kết cục đo được: thời gian, số lỗi, người dùng, tiền, tốc độ. Kể cả kết quả chỉ được một phần, nói thật.'],
  ['L · Lesson (bài học) · ~5%', 'bây giờ bạn làm khác đi thế nào', 'Một câu. Nhiều người phỏng vấn đằng nào cũng hỏi; tự nói ra cho thấy bạn chín chắn.'],
])}
<p>Một câu trả lời STAR tốt dài <strong>khoảng hai phút</strong>. Dưới một phút thường nghĩa là thiếu phần Hành động; trên ba phút thường là phần Tình huống quá dài.</p>

<h3>Một ví dụ trọn vẹn từ sự cố thật</h3>
<p>Câu chuyện dưới đây dựa trên một lần sập thật của một nền tảng học tập do sinh viên tự vận hành (tháng 8/2026). Để ý phần Hành động chiếm hơn một nửa, và mỗi bước đều là việc người kể đã làm hoặc đã quyết định.</p>
${ra(STAR_VI)}

<h3>Thói quen 1 — "em", không phải "nhóm em"</h3>
<p>Trong dự án nhóm, sinh viên hay nói "nhóm em làm X" cho mọi thứ, và người phỏng vấn không biết <em>bạn</em> làm được gì. Dùng "nhóm" cho bối cảnh và "em" cho hành động: "Nhóm SWP391 bọn em có bốn người; <strong>em</strong> phụ trách module đặt lịch, <strong>em</strong> thiết kế các bảng của nó, và <strong>em</strong> viết phần kiểm trùng lịch." Với AI cũng vậy: "trợ lý sinh bản đầu của script; <strong>em</strong> phát hiện nó dùng nhầm Dockerfile và <strong>em</strong> thêm bước kiểm". Trung thực và cụ thể thắng khiêm tốn mà mơ hồ.</p>
${bay('vi', 'một câu chuyện mà chẳng có gì có thể hỏng.', '"Em được giao trang đăng nhập và em làm xong đúng hạn" không phải là câu chuyện — không có khó khăn, nên không có quyết định, nên chẳng có gì để chấm. Hãy chọn tình huống có vấn đề: một thứ bị hỏng, hai người bất đồng, hết giờ, một yêu cầu không rõ. Chính cái khó làm phần Hành động của bạn hiện ra.')}

<h3>Thói quen 2 — con số thật, từ ghi chép thật</h3>
<p>Con số làm câu chuyện đáng tin, nhưng chỉ khi nó đúng. Những nguồn bạn đã có sẵn: log deploy và mốc thời gian (sập bao lâu), lịch sử Git (bao nhiêu commit, bao nhiêu ngày), công cụ quản lý việc (bao nhiêu thẻ), thời gian build, số test, kích thước một bảng. Không có số thì tả quy mô một cách trung thực ("vài chục người dùng", "cả nhóm bốn người") — tuyệt đối không bịa "tăng hiệu năng 300%".</p>
${stack([
  ['Thời gian', 'sập 7 phút · khôi phục khoảng 40 giây · build 3–6 phút thay vì ~15 phút'],
  ['Quy mô', 'kế hoạch đồ án 46 yêu cầu · ~600 model cơ sở dữ liệu · 11 lần tăng số phiên bản trong 4,5 giờ'],
  ['Tác động', 'cùng lỗi đó bị chặn trước khi giao đi · không lặp lại lần nào · bớt một bước làm tay'],
  ['Quy mô trung thực', '"bạn cùng lớp và vài trăm người ghé xem", không phải "hàng nghìn người dùng" mà bạn không chứng minh được'],
])}

<h3>Kho câu chuyện: sáu tới tám câu là đủ cho mọi thứ</h3>
<p>Bạn không cần một câu chuyện riêng cho từng câu trong năm mươi câu hỏi có thể gặp. Hãy chuẩn bị sáu tới tám câu chuyện mạnh và tập chĩa mỗi câu vào nhiều câu hỏi:</p>
${bang(['Câu chuyện (ví dụ)', 'Trả lời được các câu hỏi về…'], [
  ['Lỗi 502 sau một ảnh hỏng (ở trên)', 'thất bại · áp lực · gỡ lỗi · tinh thần trách nhiệm · bài học'],
  ['Bỏ "push lên main là deploy" sau hai lần sập', 'cải tiến quy trình · một quyết định khó · học từ sai lầm'],
  ['Chọn modular monolith thay vì microservices cho đồ án', 'bất đồng ý kiến · quyết định kỹ thuật · làm việc một mình'],
  ['Script seed qua hết mọi bước kiểm mà vẫn làm hỏng production', 'testing · cẩn thận chi tiết · "em kiểm chứng thế nào?"'],
  ['Bạn cùng nhóm dùng hệ điều hành khác, cài đặt không chạy (SWP391)', 'làm nhóm · giúp người khác · giao tiếp'],
  ['Học Docker bằng cách tự vận hành máy chủ', 'học nhanh · tự giác'],
])}
${neu('vi', 'bạn chỉ có đồ án ở trường, chưa có sự cố nào? Thì dùng tình huống ở trường: một yêu cầu thầy đổi một tuần trước mốc nộp, một xung đột merge đêm trước buổi demo, một bạn cùng nhóm "biến mất". Chúng là chuyện thật, và người phỏng vấn thực tập sinh mong đợi đúng những chuyện như thế.')}
${keXau('vi', 'đừng đưa bí mật hay chi tiết nội bộ vào câu chuyện bạn đăng công khai (blog, LinkedIn). "IP máy chủ bên em là…", tên một thành phần chưa vá, hay ảnh chụp màn hình còn lộ token đều có thể giúp kẻ tấn công. Kể hình dạng của sự cố, đừng đưa chìa khoá nhà.')}

<h3>Câu hỏi luyện tập</h3>
${qa('vi', { so: '2.2-1', q: '"Kể về một vấn đề kỹ thuật em đã giải quyết."', chu: 'một phần Hành động rõ ràng có quyết định thật, và một Kết quả đo được.', a: '<p>Dùng câu chuyện 502: hai câu tình huống, một câu nhiệm vụ, rồi các bước chẩn đoán (trạng thái container → log → so ảnh → nguyên nhân gốc), cách sửa tức thời và cách phòng về sau, bảy phút, và bài học.</p>', sau: ['"Sao lại có Dockerfile mặc định ở đó?"', '"Bước kiểm libc chạy thế nào?"', '"Em sẽ giám sát gì để phát hiện sớm hơn?"'], loi: 'nhảy thẳng tới cách sửa mà không kể đã tìm ra nguyên nhân bằng cách nào.' })}
${qa('vi', { so: '2.2-2', q: '"Vai trò của em trong dự án nhóm là gì?"', chu: 'một mình bạn làm được gì, khi ở trong một đội.', a: '<p>"Nhóm em năm người; em phụ trách trọn module mượn thiết bị — các bảng, API và màn hình React — và em review pull request của hai bạn. Phần khó nhất em làm là luật chặn hai người đặt cùng một thiết bị trong khoảng thời gian chồng nhau."</p>', sau: ['"Em cài đặt luật đó thế nào?"', '"Nếu làm lại em sẽ chia việc khác đi ra sao?"'], loi: '"Em làm mỗi thứ một chút" hoặc chỉ toàn "nhóm em".' })}
${thucHanh('vi', { phut: '45', steps: [
  'Liệt kê sáu tới tám tình huống trong dự án của bạn có một khó khăn thật.',
  'Viết trọn hai câu chuyện theo STAR+L, phần Hành động chiếm ít nhất một nửa số chữ.',
  'Đánh dấu mọi con số; cạnh mỗi số ghi nó lấy từ đâu (log, Git, công cụ quản lý việc). Bỏ số nào không có nguồn.',
  'Điền cột "trả lời được các câu hỏi về…" cho tất cả câu chuyện.',
  'Kể to một câu chuyện có bấm giờ: 1,5–2,5 phút.',
], dat: 'bạn có kho ít nhất sáu tiêu đề, hai câu chuyện STAR trọn vẹn với con số có nguồn, và kể được một câu trong 2,5 phút.' })}
${thuatNgu('vi', [
  ['STAR', 'Situation – Task – Action – Result (tình huống – nhiệm vụ – hành động – kết quả): hình dạng chuẩn của câu trả lời hành vi.'],
  ['STAR+L', 'STAR cộng Lesson (bài học): bây giờ bạn làm khác đi thế nào.'],
  ['Behavioural question (câu hỏi hành vi)', '"Kể về một lần mà…" — hỏi hành vi trong quá khứ để đoán hành vi tương lai.'],
  ['Root cause (nguyên nhân gốc)', 'Lý do sâu xa khiến vấn đề xảy ra, không chỉ là triệu chứng.'],
  ['Story bank (kho câu chuyện)', 'Sáu tới tám câu chuyện chuẩn bị sẵn, mỗi câu gắn với nhiều loại câu hỏi.'],
  ['Outage (sự cố sập dịch vụ)', 'Khoảng thời gian dịch vụ không dùng được với người dùng.'],
])}
${tomTat('vi', [
  'STAR = Tình huống, Nhiệm vụ, Hành động, Kết quả; thêm một câu Bài học.',
  'Hành động chiếm hơn nửa câu chuyện; cả câu trả lời dài khoảng hai phút.',
  'Nói "nhóm" cho bối cảnh và "em" cho hành động — kể cả phân biệt việc bạn làm với thứ công cụ AI sinh ra.',
  'Chỉ dùng con số truy được về một ghi chép; không có thì tả quy mô trung thực.',
  'Sáu tới tám câu chuyện, mỗi câu gắn nhiều câu hỏi, đủ cho gần như mọi buổi phỏng vấn hành vi.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'docker', bai: 'dk-6-2-chon-anh-nen', title: 'Docker 6.2 — Chọn ảnh nền, và cái bẫy musl', sub: 'Nền kỹ thuật của câu chuyện 502 — phải sẵn sàng giải thích được.' }),
  yt('zoGZQatkqKg', 'Indeed', 'Behavioral Interview Questions and Answers: Use the STAR Technique', 10),
  nguon('📘', 'Tech Interview Handbook — Behavioral interview', 'Vòng hành vi được chấm thế nào, có ví dụ STAR (tiếng Anh).', 'https://www.techinterviewhandbook.org/behavioral-interview/'),
])}
</div>
`,
};

/* ═══════════════════════ 2.3 — Thất bại và sự cố ═══════════════════════ */
const L23 = {
  title: '2.3 — Talking about failures and incidents: own it, fix it, prevent it, no blame|||2.3 — Kể về thất bại và sự cố: nhận trách nhiệm, sửa, phòng lại, không đổ lỗi',
  slug: 'pv-2-3-su-co',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao người phỏng vấn cố tình hỏi về thất bại, khung năm bước (nhận – tác động – sửa – phòng – thay đổi), tinh thần "blameless postmortem", hai sự cố thật kể mẫu (seed vỡ dù qua checklist, nginx đọc config cũ vì inode), câu hỏi "điểm yếu của em", và những câu tuyệt đối không nói.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Failures and incidents: the question that rewards honesty</h2>
<p class="lead">"Tell me about a time you failed." "What is the biggest mistake you have made?" "Have you ever broken production?" Students fear these questions and answer with a fake failure ("I worked too hard"). Interviewers ask them on purpose, because how you talk about a mistake predicts how you will behave the first time you make one in their codebase. This lesson shows the five-step answer, the culture behind it, and two complete stories from real incidents.</p>

<h3>An everyday picture: the cook who burnt the rice</h3>
${doiThuong('en', 'Two people burn the rice for a family dinner. The first says "the cooker is old, and someone distracted me". The second says "I forgot to lower the heat; I made noodles so nobody waited, and now I set a timer every time." Who would you let cook next time? Interviewers are deciding exactly that — not whether you have ever burnt the rice (everyone has), but which of the two people you are.')}

<h3>Why they ask: the blameless culture</h3>
<p>Mature engineering teams run a <strong>postmortem</strong> after every serious incident: a written analysis of what happened, why, and what will change. Many follow the idea popularised by Google’s Site Reliability Engineering book: postmortems are <strong>blameless</strong> — they look for causes in systems and processes, not people to punish, because people who fear punishment hide mistakes, and hidden mistakes repeat. A candidate who can describe their own failure calmly, with causes and fixes, already thinks like that team.</p>

<h3>The five-step answer</h3>
${flow([
  ['1 · Own it', 'say clearly what went wrong and your part in it', '"I shipped a change that broke the seed step in production." No passive voice ("mistakes were made").'],
  ['2 · Impact', 'who or what was affected, honestly sized', 'Duration, users, data. Not minimised, not dramatised.'],
  ['3 · Fix', 'what you did right away', 'The immediate repair or rollback, and how you confirmed it worked.'],
  ['4 · Prevent', 'the change that stops the same class of failure', 'A check, a test, a process step — something that does not depend on remembering.'],
  ['5 · What changed in you', 'the habit you have now', 'One sentence. This is what they will remember.'],
])}

<h3>Story 1 — a change that passed every check and still broke production</h3>
<p><strong>Situation:</strong> on the same student-run platform (August 2026), a database enum value was renamed so the backend and frontend used the same name. <strong>Task:</strong> ship the rename safely. <strong>Action / what went wrong:</strong> the full pre-push checklist was green — type check, build, migration — and the deploy still broke the content seed on production. The seed script had its <em>own hand-written copy</em> of the list of enum values, and the TypeScript configuration excluded the seed folder from type checking, so it was checked against itself and never against the database schema. <strong>Fix:</strong> correct the seed and redeploy. <strong>Prevent:</strong> a separate type-check configuration for the seed scripts, a <code>typecheck:seed</code> command added to the checklist, actually running the seed locally whenever the schema changes, and importing enum types from the generated client instead of copying them. <strong>Lesson:</strong> "a checklist only covers what it actually runs — I now check what each check really touches."</p>

<h3>Story 2 — "deployed successfully", but nothing changed</h3>
<p><strong>Situation:</strong> the deploy script synchronised the nginx configuration and reloaded nginx; it reported OK twice. <strong>Problem:</strong> the new settings (HTTP/2, cache headers) never took effect. <strong>Cause:</strong> the config file is mounted into the container as a single-file bind mount, which Docker attaches by <em>inode</em> at container start. The script replaced the file with <code>mv</code>, which creates a new inode, so the container kept reading the old file, validated the old config and reloaded the old config — "OK". <strong>Fix and prevention:</strong> overwrite the file in place instead of replacing it, and compare the checksum of the file on the host with the one <em>inside</em> the container; if they differ, restore and stop. <strong>Lesson:</strong> "written" and "command returned 0" do not mean "in effect" — verify from the side that consumes the change.</p>
${bay('en', 'the fake failure.', '"My biggest weakness is that I am a perfectionist" or "I failed because I cared too much" is recognised instantly and scores zero for honesty. Interviewers have heard it thousands of times. A real, small, well-handled failure scores far higher than a fake big virtue.')}

<h3>"What is your weakness?" — the same rule</h3>
<p>Pick a real weakness that is <strong>not fatal for the role</strong> and that you are <strong>actively fixing</strong>: "My spoken English is weaker than my reading. I read documentation in English every day, but in meetings I still need time. I practise speaking fifteen minutes a day and I am doing this interview course partly for that." For a backend intern, "I am not good with SQL" would be fatal; "I have not used Kubernetes" is fine.</p>
${neu('en', 'the failure was really a teammate’s fault? Then tell the part that was yours — "I noticed late", "I did not ask for the status early enough" — and what you changed. Even when someone else made the mistake, the question is about what <em>you</em> did. Blaming, even accurately, sounds like what you will do to your next team.')}
${keXau('en', 'in incident stories, never reveal details that are still exploitable — an unpatched vulnerability, a password that was leaked and maybe not rotated everywhere, how to reach an internal service. If the incident was a security one, describe the class ("a secret was committed to a repository") and the fix ("rotated, removed from history, added a scanner"), not the secret.')}

<h3>Practice questions</h3>
${qa('en', { so: '2.3-1', q: '"Tell me about a time you failed."', chu: 'ownership, honest impact, and a prevention that does not rely on memory.', a: '<p>Use the seed story with the five steps: own ("I shipped the rename"), impact (the seed step failed on production), fix (corrected and redeployed), prevent (seed type check in the checklist, run the seed locally, import types instead of copying), change ("I check what each check really touches").</p>', sau: ['"Why was the seed folder excluded in the first place?"', '"How would you have caught it without the new check?"'], loi: 'a story with no prevention step — it sounds as if it could happen again tomorrow.' })}
${qa('en', { so: '2.3-2', q: '"Have you ever broken production?"', chu: 'calm honesty; how you behave under the worst kind of pressure.', a: '<p>"Yes — on my own platform. A deploy shipped an image that could not start, and the API was down for about seven minutes. I put the previous image back first, then found the cause, and added a check so that kind of image cannot be shipped again."</p>', sau: ['"What did you do first, and why that?"', '"Who did you tell?"'], loi: '"No, never" — for anyone who has run anything real, that is either untrue or means they never shipped.' })}
${thucHanh('en', { phut: '30', steps: [
  'Pick one real failure from your projects or studies.',
  'Write it in the five steps; the Prevent step must be something that does not depend on remembering.',
  'Read it and remove every sentence that blames a person or a tool.',
  'Write your honest "weakness" answer: real, not fatal for your target role, and with what you are doing about it.',
], dat: 'you have one failure story with all five steps and no blame, and a weakness answer that names an active fix.' })}
${thuatNgu('en', [
  ['Postmortem', 'A written analysis after an incident: what happened, why, what will change.'],
  ['Blameless', 'Looking for causes in systems and processes rather than people to punish.'],
  ['Rollback', 'Returning to the previous working version.'],
  ['Prevention', 'A change that stops the same class of failure, ideally automatically.'],
  ['Bind mount', 'Mounting a file or folder from the host into a container.'],
  ['Inode', 'The identity of a file in the filesystem; replacing a file with mv creates a new one.'],
])}
${tomTat('en', [
  'Failure questions test how you will behave after your first mistake on their team.',
  'Answer in five steps: own it, impact, fix, prevent, what changed in you.',
  'Prevention should be a check or process, not "I will be more careful".',
  'Never offer a fake failure or a fake weakness; small and real beats big and fake.',
  'Do not blame — even when someone else caused it, tell your part.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'github-actions', bai: 'ga-10-2-seed-vo', L: 'en', title: 'GitHub Actions 10.2 — The seed that passed everything and broke prod', sub: 'The full technical write-up of Story 1.' }),
  yt('yidXECtZCOg', 'Jeff Su', 'Tell Me About a Time You Failed (Sample Answer included)', 6, 'en'),
  nguon('📕', 'Google SRE Book — Postmortem Culture: Learning from Failure', 'The original chapter on blameless postmortems.', 'https://sre.google/sre-book/postmortem-culture/'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Thất bại và sự cố: câu hỏi thưởng cho sự trung thực</h2>
<p class="lead">"Kể về một lần em thất bại." "Sai lầm lớn nhất của em là gì?" "Em đã bao giờ làm hỏng production chưa?" Sinh viên sợ mấy câu này và trả lời bằng một thất bại giả ("em làm việc quá sức"). Người phỏng vấn cố tình hỏi, vì cách bạn nói về một sai lầm dự đoán cách bạn sẽ cư xử ở lần đầu tiên bạn mắc lỗi trong mã của họ. Bài này chỉ cách trả lời năm bước, văn hoá đằng sau nó, và hai câu chuyện trọn vẹn từ sự cố thật.</p>

<h3>Liên tưởng đời thường: người nấu khê nồi cơm</h3>
${doiThuong('vi', 'Hai người làm khê nồi cơm bữa cơm gia đình. Người thứ nhất nói "nồi cũ rồi, với lại có người làm em xao nhãng". Người thứ hai nói "em quên vặn nhỏ lửa; em nấu mì để không ai phải chờ, và giờ lần nào em cũng hẹn giờ". Lần sau bạn để ai nấu? Người phỏng vấn đang quyết định đúng chuyện đó — không phải bạn đã từng làm khê cơm chưa (ai cũng từng), mà bạn là người nào trong hai người kia.')}

<h3>Vì sao họ hỏi: văn hoá không đổ lỗi</h3>
<p>Các đội kỹ thuật trưởng thành làm một bản <strong>postmortem</strong> (phân tích sau sự cố) sau mỗi sự cố nghiêm trọng: một bản viết về chuyện gì xảy ra, vì sao, và sẽ thay đổi gì. Nhiều đội theo tinh thần được phổ biến bởi cuốn Site Reliability Engineering của Google: postmortem là <strong>blameless</strong> (không đổ lỗi) — tìm nguyên nhân trong hệ thống và quy trình, không tìm người để phạt, vì người sợ bị phạt sẽ giấu lỗi, mà lỗi bị giấu thì lặp lại. Một ứng viên tả được thất bại của chính mình một cách bình tĩnh, có nguyên nhân và cách sửa, là người đã nghĩ giống đội đó rồi.</p>

<h3>Câu trả lời năm bước</h3>
${flow([
  ['1 · Nhận', 'nói rõ cái gì hỏng và phần của bạn trong đó', '"Em đã đẩy một thay đổi làm hỏng bước seed trên production." Không dùng câu bị động kiểu "đã có sai sót xảy ra".'],
  ['2 · Tác động', 'ai hay cái gì bị ảnh hưởng, nói đúng mức', 'Bao lâu, bao nhiêu người, dữ liệu ra sao. Không giảm nhẹ, không làm quá.'],
  ['3 · Sửa', 'bạn đã làm gì ngay lúc đó', 'Bản vá tức thời hoặc quay lui, và bạn xác nhận nó đã ổn bằng cách nào.'],
  ['4 · Phòng', 'thay đổi chặn cả LOẠI lỗi đó', 'Một bước kiểm, một bài test, một bước quy trình — thứ không phụ thuộc vào việc phải nhớ.'],
  ['5 · Bạn đã thay đổi gì', 'thói quen bây giờ bạn có', 'Một câu. Đây là điều họ sẽ nhớ.'],
])}

<h3>Câu chuyện 1 — một thay đổi qua mọi bước kiểm mà vẫn làm hỏng production</h3>
<p><strong>Tình huống:</strong> cũng trên nền tảng do sinh viên tự vận hành (tháng 8/2026), một giá trị enum trong cơ sở dữ liệu được đổi tên để backend và frontend dùng chung một tên. <strong>Nhiệm vụ:</strong> đưa thay đổi đó lên an toàn. <strong>Hành động / chuyện đã hỏng:</strong> toàn bộ checklist trước khi đẩy đều xanh — kiểm kiểu, build, migration — vậy mà deploy vẫn làm hỏng bước nạp nội dung (seed) trên production. Script seed có <em>bản chép tay riêng</em> của danh sách giá trị enum, còn cấu hình TypeScript lại loại thư mục seed khỏi việc kiểm kiểu, nên nó chỉ tự kiểm với chính nó và chưa bao giờ được so với lược đồ cơ sở dữ liệu. <strong>Sửa:</strong> chữa script seed và deploy lại. <strong>Phòng:</strong> một cấu hình kiểm kiểu riêng cho script seed, lệnh <code>typecheck:seed</code> được thêm vào checklist, chạy seed thật ở máy local mỗi khi đổi lược đồ, và import kiểu enum từ client được sinh ra thay vì chép tay. <strong>Bài học:</strong> "một checklist chỉ bao được những gì nó thật sự chạy — giờ em kiểm xem mỗi bước kiểm thực ra chạm tới đâu."</p>

<h3>Câu chuyện 2 — "deploy thành công", mà chẳng có gì thay đổi</h3>
<p><strong>Tình huống:</strong> script deploy đồng bộ cấu hình nginx và nạp lại nginx; nó báo OK hai lần liền. <strong>Vấn đề:</strong> các thiết lập mới (HTTP/2, header cache) không bao giờ có hiệu lực. <strong>Nguyên nhân:</strong> tệp cấu hình được gắn vào container dạng bind mount một tệp đơn, mà Docker gắn tệp đơn theo <em>inode</em> (định danh của tệp trong hệ thống tệp) lúc container khởi động. Script thay tệp bằng <code>mv</code>, thứ tạo ra inode mới, nên container vẫn đọc tệp cũ, kiểm cấu hình cũ, nạp lại cấu hình cũ — "OK". <strong>Sửa và phòng:</strong> ghi đè tại chỗ thay vì thay tệp, và so mã băm của tệp trên máy chủ với mã băm <em>bên trong</em> container; lệch thì trả bản cũ về và dừng. <strong>Bài học:</strong> "đã ghi" và "lệnh trả về 0" không có nghĩa là "đã có hiệu lực" — hãy kiểm từ phía thứ dùng thay đổi đó.</p>
${bay('vi', 'thất bại giả.', '"Điểm yếu lớn nhất của em là cầu toàn" hay "em thất bại vì quá tâm huyết" bị nhận ra ngay lập tức và được không điểm về trung thực. Người phỏng vấn đã nghe câu đó hàng nghìn lần. Một thất bại thật, nhỏ, được xử lý tốt được điểm cao hơn nhiều so với một đức tính giả mà to.')}

<h3>"Điểm yếu của em là gì?" — cùng một luật</h3>
<p>Chọn một điểm yếu thật, <strong>không chí mạng với vị trí</strong> và bạn <strong>đang tích cực sửa</strong>: "Tiếng Anh nói của em yếu hơn đọc. Em đọc tài liệu tiếng Anh mỗi ngày, nhưng trong cuộc họp em vẫn cần thời gian. Em luyện nói mười lăm phút mỗi ngày, và em học khoá phỏng vấn này một phần cũng vì thế." Với thực tập backend, "em yếu SQL" là chí mạng; "em chưa dùng Kubernetes" thì không sao.</p>
${neu('vi', 'thất bại đó thật ra là lỗi của bạn cùng nhóm? Thì kể phần là của bạn — "em phát hiện muộn", "em không hỏi tiến độ sớm" — và bạn đã thay đổi gì. Kể cả khi người khác gây ra lỗi, câu hỏi vẫn là về những gì <em>bạn</em> đã làm. Đổ lỗi, dù đúng sự thật, nghe như việc bạn sẽ làm với đội tiếp theo.')}
${keXau('vi', 'trong câu chuyện sự cố, không bao giờ tiết lộ chi tiết vẫn còn khai thác được — một lỗ hổng chưa vá, một mật khẩu từng bị lộ mà có thể chưa đổi ở mọi nơi, cách với tới một dịch vụ nội bộ. Nếu sự cố là sự cố bảo mật, kể loại của nó ("một bí mật bị commit vào kho mã") và cách sửa ("đã thay khoá, xoá khỏi lịch sử, thêm công cụ quét"), không kể chính bí mật.')}

<h3>Câu hỏi luyện tập</h3>
${qa('vi', { so: '2.3-1', q: '"Kể về một lần em thất bại."', chu: 'tinh thần nhận trách nhiệm, tác động nói đúng mức, và một cách phòng không dựa vào trí nhớ.', a: '<p>Dùng câu chuyện seed theo năm bước: nhận ("em đã đẩy thay đổi đổi tên"), tác động (bước seed hỏng trên production), sửa (chữa và deploy lại), phòng (kiểm kiểu seed trong checklist, chạy seed ở local, import kiểu thay vì chép), thay đổi ("em kiểm xem mỗi bước kiểm thật ra chạm tới đâu").</p>', sau: ['"Sao lúc đầu thư mục seed lại bị loại ra?"', '"Không có bước kiểm mới thì em bắt lỗi đó kiểu gì?"'], loi: 'câu chuyện không có bước phòng — nghe như ngày mai nó lại xảy ra.' })}
${qa('vi', { so: '2.3-2', q: '"Em đã bao giờ làm hỏng production chưa?"', chu: 'trung thực bình tĩnh; cách bạn cư xử dưới loại áp lực tệ nhất.', a: '<p>"Rồi ạ — trên nền tảng của chính em. Một lần deploy đẩy lên một ảnh không khởi động được, API sập khoảng bảy phút. Em đưa ảnh cũ trở lại trước, rồi mới tìm nguyên nhân, và thêm một bước kiểm để loại ảnh đó không thể bị đẩy lên nữa."</p>', sau: ['"Việc đầu tiên em làm là gì, sao lại là việc đó?"', '"Em báo cho ai?"'], loi: '"Chưa bao giờ ạ" — với người từng chạy thứ gì thật, câu đó hoặc không đúng, hoặc nghĩa là họ chưa từng giao sản phẩm nào.' })}
${thucHanh('vi', { phut: '30', steps: [
  'Chọn một thất bại thật trong dự án hoặc việc học của bạn.',
  'Viết nó theo năm bước; bước Phòng phải là thứ không phụ thuộc vào việc phải nhớ.',
  'Đọc lại và xoá mọi câu đổ lỗi cho một người hay một công cụ.',
  'Viết câu trả lời "điểm yếu" thật lòng: có thật, không chí mạng với vị trí nhắm, kèm việc bạn đang làm để sửa.',
], dat: 'bạn có một câu chuyện thất bại đủ năm bước, không đổ lỗi, và một câu trả lời điểm yếu có nêu cách đang sửa.' })}
${thuatNgu('vi', [
  ['Postmortem (phân tích sau sự cố)', 'Bản viết sau sự cố: chuyện gì xảy ra, vì sao, sẽ thay đổi gì.'],
  ['Blameless (không đổ lỗi)', 'Tìm nguyên nhân trong hệ thống và quy trình, không tìm người để phạt.'],
  ['Rollback (quay lui)', 'Trở về phiên bản trước đang chạy tốt.'],
  ['Prevention (phòng ngừa)', 'Một thay đổi chặn cả loại lỗi đó, tốt nhất là tự động.'],
  ['Bind mount (gắn từ máy chủ)', 'Gắn một tệp hay thư mục của máy chủ vào trong container.'],
  ['Inode', 'Định danh của một tệp trong hệ thống tệp; thay tệp bằng mv tạo ra inode mới.'],
])}
${tomTat('vi', [
  'Câu hỏi về thất bại kiểm xem bạn cư xử ra sao sau lỗi đầu tiên trong đội của họ.',
  'Trả lời năm bước: nhận, tác động, sửa, phòng, bạn đã thay đổi gì.',
  'Phòng phải là một bước kiểm hay quy trình, không phải "em sẽ cẩn thận hơn".',
  'Không bao giờ đưa ra thất bại giả hay điểm yếu giả; nhỏ mà thật thắng to mà giả.',
  'Không đổ lỗi — kể cả khi người khác gây ra, hãy kể phần của bạn.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'github-actions', bai: 'ga-10-2-seed-vo', title: 'GitHub Actions 10.2 — Script seed qua mọi bước kiểm mà vẫn làm hỏng production', sub: 'Bản phân tích kỹ thuật đầy đủ của Câu chuyện 1.' }),
  yt('yidXECtZCOg', 'Jeff Su', 'Tell Me About a Time You Failed (Sample Answer included)', 6),
  nguon('📕', 'Google SRE Book — Postmortem Culture: Learning from Failure', 'Chương gốc về postmortem không đổ lỗi (tiếng Anh).', 'https://sre.google/sre-book/postmortem-culture/'),
])}
</div>
`,
};

/* ═══════════════════════ 2.4 — Câu hỏi để hỏi lại ═══════════════════════ */
const HOI_EN = `
ABOUT THE WORK
1. What would an intern typically work on in the first month?
2. Could you describe a recent task an intern or junior finished on this team?
3. What does a normal week look like - meetings, coding, reviews?

ABOUT THE TEAM AND PROCESS
4. How are tasks assigned and tracked - Jira, a board, something else?
5. How does code review work here? Who reviews an intern's pull requests?
6. How do you test and deploy - is there CI, how often do you release?

ABOUT LEARNING
7. Will I have a mentor? How often would we meet?
8. What do the interns who do best here have in common?

ABOUT THE FUTURE
9. Do interns sometimes continue as full-time employees? What does that depend on?
10. What is the next step in the process, and when can I expect to hear back?
`;

const HOI_VI = `
VỀ CÔNG VIỆC
1. Tháng đầu, thực tập sinh thường được giao làm những việc gì ạ?
2. Anh/chị kể giúp em một việc gần đây một bạn thực tập hay junior trong đội đã làm xong được không ạ?
3. Một tuần bình thường của đội trông thế nào - họp, code, review?

VỀ ĐỘI VÀ QUY TRÌNH
4. Việc được giao và theo dõi bằng gì ạ - Jira, board, hay công cụ khác?
5. Review code ở đây diễn ra thế nào? Ai sẽ review pull request của thực tập sinh?
6. Đội test và deploy ra sao - có CI không, bao lâu phát hành một lần?

VỀ VIỆC HỌC
7. Em có người hướng dẫn (mentor) không ạ? Bao lâu gặp một lần?
8. Những bạn thực tập làm tốt nhất ở đây thường có điểm gì chung?

VỀ TƯƠNG LAI
9. Thực tập sinh có hay được ở lại làm chính thức không ạ? Điều đó phụ thuộc vào gì?
10. Bước tiếp theo của quy trình là gì, và khi nào em có thể nhận phản hồi ạ?
`;

const L24 = {
  title: '2.4 — Questions to ask the interviewer: about the work, the team, learning and the next step|||2.4 — Câu hỏi để hỏi lại người phỏng vấn: về công việc, đội, việc học và bước tiếp theo',
  slug: 'pv-2-4-cau-hoi-lai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao "Em có câu hỏi gì không?" là một phần của bài thi, mười câu hỏi mẫu song ngữ chia bốn nhóm, hỏi ai câu gì (kỹ sư, trưởng nhóm, HR), câu nào giúp bạn nhận ra môi trường xấu, câu nào nên tránh ở vòng đầu, và cách dùng câu hỏi để chốt lại điểm mạnh.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>"Do you have any questions for us?" — the last question is still part of the test</h2>
<p class="lead">At the end of almost every interview you will hear it. "No, thank you" ends the conversation on a flat note and suggests you have not thought about the job. Two or three good questions do the opposite: they show interest, they give you real information to choose between offers, and they let you finish on a strong point. This lesson gives you a prepared list and the reasons behind each question.</p>

<h3>An everyday picture: test-driving before you buy</h3>
${doiThuong('en', 'Nobody buys a motorbike after only listening to the seller. You ask how old it is, whether it has been repaired, what the paperwork looks like, and you take it for a short ride. The interview is your test ride of the company. The questions you ask are how you find out whether the "mentor and real product" in the posting are real — and the seller notices that you are a careful buyer.')}

<h3>Ten questions that work, in four groups</h3>
${ra(HOI_EN)}
<p>You do not ask all ten. Pick <strong>two or three</strong> depending on who is in front of you, and keep one in reserve in case they answered the others during the interview.</p>

<h3>Who to ask what</h3>
${bang(['Interviewer', 'Best questions', 'Why'], [
  ['Engineer', '1, 2, 5, 6', 'They know the daily work, the codebase and the review culture; their answers are the most concrete.'],
  ['Team lead / manager', '3, 4, 7, 8', 'They decide how interns are guided and judged.'],
  ['HR / recruiter', '9, 10, plus allowance, period, paperwork', 'They own the process, the contract and the timeline.'],
])}
${flow([
  ['Listen', 'during the interview, note what they mention', 'A tool, a project, a problem they are having. These are hooks for your questions.'],
  ['Ask', 'two or three questions, one at a time', 'Let them talk. A good question gets a two-minute answer.'],
  ['Connect', 'link one answer to your strength', '"You mentioned flaky tests — on my project I traced one to a timezone issue. I would enjoy working on that."'],
  ['Close', 'ask about the next step', 'Always end with question 10, so you know when to follow up (Lesson 9.2).'],
])}

<h3>Questions that reveal a bad environment</h3>
<p>Some answers are warning signs. If "Will I have a mentor?" gets "everyone is busy, you will learn by yourself", or "How do you test?" gets a laugh, or "What would I work on?" gets "anything that comes up — mostly data entry", you have learnt something important for choosing between offers (Lesson 9.3). Asking politely is not rude; it is what professionals do.</p>
${bay('en', 'asking about things the posting or website already answers.', '"What does your company do?" after an hour on their product tells the interviewer you did not prepare. Read the posting, the company website and their engineering blog or LinkedIn before the interview, and ask the next question beyond them: "Your site says you moved to microservices last year — how did that change the team’s work?"')}

<h3>What to avoid in a first technical round</h3>
<ul>
<li>Opening with salary or days off with the engineer — keep it for HR or for the offer stage.</li>
<li>"Did I pass?" — it puts the interviewer in an awkward position; ask about the next step instead.</li>
<li>Questions that are really complaints ("Why is the allowance so low?").</li>
<li>Ten questions in a row when time is up — watch the clock.</li>
</ul>
${neu('en', 'the interview runs late and they say "we have two minutes for questions"? Ask exactly one: the next step and the timeline. It is short, useful, and shows you respect their time.')}
${keXau('en', 'questions are also a safety check. A real company can answer "Who would be my mentor?" and "What is the next step — will I receive an email from your company domain?" with specifics. A fake recruiter (Lesson 0.1) becomes vague, pushes you to pay or to install something, or moves the conversation to a private chat. If the answers are evasive, stop before sharing documents.')}

<h3>Practice question</h3>
${qa('en', { so: '2.4-1', q: '"Do you have any questions for us?"', chu: 'genuine interest and preparation.', a: '<p>"Yes, two. First, what would an intern on this team typically work on in the first month? And second, how does code review work here — who reviews an intern’s pull requests? … Thank you. And what is the next step in the process?"</p>', sau: ['"What are you hoping to learn here?"', '"Why does code review matter to you?"'], loi: '"No, I think you covered everything" — or a question the website already answers.' })}
${thucHanh('en', { phut: '20', steps: [
  'Choose five questions from the list and rewrite them in your own words, in Vietnamese and English.',
  'For one company in your tracker, read its website and posting and write one question that goes beyond them.',
  'Write what answer would worry you for each question — your red flags.',
  'Practise asking two questions aloud, then closing with the next-step question.',
], dat: 'you have five questions in both languages, one company-specific question, and a red-flag note for each.' })}
${thuatNgu('en', [
  ['Reverse interview', 'The part where the candidate asks questions; you are also evaluating them.'],
  ['Mentor', 'An experienced colleague responsible for guiding you.'],
  ['Onboarding', 'The first days or weeks of joining: setup, introductions, first tasks.'],
  ['Red flag', 'A warning sign that something is wrong.'],
  ['Next step', 'What happens after this interview, and when.'],
])}
${tomTat('en', [
  '"Any questions?" is part of the evaluation; "no" ends weakly.',
  'Prepare questions about the work, the team and process, learning, and the next step.',
  'Ask engineers about daily work, leads about guidance, HR about contract and timeline.',
  'Some answers are red flags that help you choose between offers.',
  'Always close by asking about the next step and when to expect news.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-4-1-integrate', academy: true, L: 'en', title: 'Academy · OJT202 4.1 — Integrating into the company', sub: 'What the first weeks of an internship look like — useful to know what to ask.' }),
  yt('8LwveoDO_M8', 'Life Work Balance', 'Questions to ask at the End of an Interview', 7, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>"Em có câu hỏi gì cho bên anh chị không?" — câu cuối cùng vẫn là một phần của bài thi</h2>
<p class="lead">Cuối gần như mọi buổi phỏng vấn bạn sẽ nghe câu này. "Dạ không ạ, em cảm ơn" kết thúc cuộc trò chuyện một cách nhạt nhẽo và cho thấy bạn chưa nghĩ gì về công việc. Hai ba câu hỏi tốt làm điều ngược lại: chúng cho thấy bạn quan tâm, cho bạn thông tin thật để chọn giữa các offer, và cho bạn khép lại ở một điểm mạnh. Bài này cho bạn một danh sách chuẩn bị sẵn và lý do đằng sau từng câu.</p>

<h3>Liên tưởng đời thường: lái thử trước khi mua xe</h3>
${doiThuong('vi', 'Không ai mua xe máy chỉ nghe người bán nói. Bạn hỏi xe đi bao lâu rồi, đã sửa gì chưa, giấy tờ ra sao, rồi xin chạy thử một vòng. Buổi phỏng vấn là vòng chạy thử công ty của bạn. Những câu bạn hỏi là cách bạn biết "có mentor và sản phẩm thật" trong tin tuyển dụng có đúng không — và người bán cũng nhận ra bạn là một người mua cẩn thận.')}

<h3>Mười câu hỏi hiệu quả, chia bốn nhóm</h3>
${ra(HOI_VI)}
<p>Bạn không hỏi cả mười câu. Chọn <strong>hai hoặc ba</strong> tuỳ người đang ngồi trước mặt, và giữ một câu dự phòng phòng khi họ đã trả lời mấy câu kia trong buổi phỏng vấn.</p>

<h3>Hỏi ai câu gì</h3>
${bang(['Người phỏng vấn', 'Câu hỏi hợp nhất', 'Vì sao'], [
  ['Kỹ sư', '1, 2, 5, 6', 'Họ biết công việc hằng ngày, kho mã và văn hoá review; câu trả lời của họ cụ thể nhất.'],
  ['Trưởng nhóm / quản lý', '3, 4, 7, 8', 'Họ quyết định thực tập sinh được hướng dẫn và đánh giá thế nào.'],
  ['HR / người tuyển dụng', '9, 10, cùng trợ cấp, thời gian, giấy tờ', 'Họ nắm quy trình, hợp đồng và mốc thời gian.'],
])}
${flow([
  ['Nghe', 'trong buổi phỏng vấn, ghi lại điều họ nhắc', 'Một công cụ, một dự án, một vấn đề họ đang gặp. Đó là móc cho câu hỏi của bạn.'],
  ['Hỏi', 'hai ba câu, từng câu một', 'Để họ nói. Một câu hỏi tốt được trả lời trong hai phút.'],
  ['Nối', 'nối một câu trả lời vào điểm mạnh của bạn', '"Anh có nhắc tới test chập chờn — trong dự án của em, em từng lần ra một cái do lệch múi giờ. Em rất muốn được làm phần đó."'],
  ['Chốt', 'hỏi về bước tiếp theo', 'Luôn kết bằng câu 10, để biết khi nào nên hỏi lại (bài 9.2).'],
])}

<h3>Câu hỏi giúp bạn nhận ra môi trường không tốt</h3>
<p>Có những câu trả lời là dấu hiệu cảnh báo. Nếu "Em có mentor không ạ?" nhận về "ai cũng bận, em tự học là chính", hoặc "Đội test thế nào ạ?" nhận về một tràng cười, hoặc "Em sẽ làm gì?" nhận về "việc gì phát sinh thì làm — chủ yếu là nhập liệu", thì bạn vừa biết một điều quan trọng để chọn giữa các offer (bài 9.3). Hỏi lịch sự không phải là bất lịch sự; người chuyên nghiệp đều làm vậy.</p>
${bay('vi', 'hỏi những điều tin tuyển dụng hay trang web đã trả lời.', '"Công ty mình làm về gì ạ?" sau cả tiếng nói về sản phẩm của họ cho người phỏng vấn thấy bạn không chuẩn bị. Hãy đọc tin tuyển dụng, trang web công ty và blog kỹ thuật hay LinkedIn của họ trước buổi phỏng vấn, rồi hỏi câu tiếp theo vượt ra ngoài chúng: "Trang web nói năm ngoái bên mình chuyển sang microservices — việc đó thay đổi công việc của đội thế nào ạ?"')}

<h3>Nên tránh gì ở vòng kỹ thuật đầu tiên</h3>
<ul>
<li>Mở đầu bằng lương hay ngày nghỉ với kỹ sư — để dành cho HR hoặc lúc nhận offer.</li>
<li>"Em có đậu không ạ?" — làm người phỏng vấn khó xử; hãy hỏi về bước tiếp theo.</li>
<li>Câu hỏi thật ra là lời phàn nàn ("Sao trợ cấp thấp vậy ạ?").</li>
<li>Mười câu hỏi liên tiếp khi đã hết giờ — để ý đồng hồ.</li>
</ul>
${neu('vi', 'buổi phỏng vấn bị kéo dài và họ nói "mình còn hai phút cho câu hỏi"? Hỏi đúng một câu: bước tiếp theo và mốc thời gian. Ngắn, có ích, và cho thấy bạn tôn trọng thời gian của họ.')}
${keXau('vi', 'câu hỏi cũng là một bước kiểm an toàn. Công ty thật trả lời được "Ai sẽ là mentor của em?" và "Bước tiếp theo là gì — em sẽ nhận email từ tên miền công ty phải không ạ?" một cách cụ thể. Recruiter giả (bài 0.1) sẽ trả lời mơ hồ, giục bạn trả tiền hay cài đặt thứ gì đó, hoặc kéo cuộc nói chuyện sang chat riêng. Nếu câu trả lời né tránh, dừng lại trước khi gửi giấy tờ.')}

<h3>Câu hỏi luyện tập</h3>
${qa('vi', { so: '2.4-1', q: '"Em có câu hỏi gì cho bên anh chị không?"', chu: 'sự quan tâm thật và mức độ chuẩn bị.', a: '<p>"Dạ có, em có hai câu ạ. Thứ nhất, tháng đầu thực tập sinh trong đội mình thường làm những việc gì ạ? Thứ hai, review code ở đây diễn ra thế nào — ai sẽ review pull request của thực tập sinh ạ? … Em cảm ơn anh. Cho em hỏi bước tiếp theo của quy trình là gì ạ?"</p>', sau: ['"Em mong học được gì ở đây?"', '"Vì sao review code lại quan trọng với em?"'], loi: '"Dạ không, em nghĩ anh chị nói hết rồi ạ" — hoặc hỏi điều trang web đã ghi sẵn.' })}
${thucHanh('vi', { phut: '20', steps: [
  'Chọn năm câu trong danh sách và viết lại bằng lời của bạn, cả tiếng Việt lẫn tiếng Anh.',
  'Với một công ty trong bảng theo dõi, đọc trang web và tin tuyển dụng của họ rồi viết một câu hỏi vượt ra ngoài chúng.',
  'Với mỗi câu, ghi câu trả lời nào sẽ làm bạn lo — đó là cờ đỏ của bạn.',
  'Luyện hỏi to hai câu, rồi chốt bằng câu hỏi về bước tiếp theo.',
], dat: 'bạn có năm câu hỏi song ngữ, một câu riêng cho một công ty, và ghi chú cờ đỏ cho từng câu.' })}
${thuatNgu('vi', [
  ['Reverse interview (phỏng vấn ngược)', 'Phần ứng viên đặt câu hỏi; bạn cũng đang đánh giá họ.'],
  ['Mentor (người hướng dẫn)', 'Một đồng nghiệp có kinh nghiệm chịu trách nhiệm dẫn dắt bạn.'],
  ['Onboarding (giai đoạn nhập môn)', 'Những ngày, tuần đầu khi vào làm: cài đặt, làm quen, việc đầu tiên.'],
  ['Red flag (cờ đỏ)', 'Dấu hiệu cảnh báo có điều gì đó không ổn.'],
  ['Next step (bước tiếp theo)', 'Chuyện gì xảy ra sau buổi phỏng vấn này, và khi nào.'],
])}
${tomTat('vi', [
  '"Em có câu hỏi gì không?" là một phần của bài đánh giá; trả lời "không" là kết thúc yếu.',
  'Chuẩn bị câu hỏi về công việc, đội và quy trình, việc học, và bước tiếp theo.',
  'Hỏi kỹ sư về việc hằng ngày, trưởng nhóm về cách dẫn dắt, HR về hợp đồng và mốc thời gian.',
  'Một số câu trả lời là cờ đỏ giúp bạn chọn giữa các offer.',
  'Luôn khép lại bằng câu hỏi về bước tiếp theo và khi nào có tin.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-4-1-integrate', academy: true, title: 'Academy · OJT202 4.1 — Hoà nhập môi trường doanh nghiệp', sub: 'Mấy tuần đầu thực tập trông thế nào — biết để biết nên hỏi gì.' }),
  yt('8LwveoDO_M8', 'Life Work Balance', 'Questions to ask at the End of an Interview', 7),
])}
</div>
`,
};

const KIEM_0 = `
REVIEW CHECKLIST (per take)
[ ] duration: ___ s           (VI 80-95 · EN 50-65 · STAR 90-150)
[ ] filler words: ___         ("um", "uh", "kieu la", "thi la", "like")
[ ] looked away from camera: ___ times
[ ] the hook (a number / incident / decision) came at second: ___
[ ] the last sentence links to the company: yes / no
[ ] ended cleanly (no "...so, yeah"): yes / no

`;

const KIEM_1 = `
BẢNG KIỂM (mỗi lượt)
[ ] thời lượng: ___ giây       (VI 80-95 · EN 50-65 · STAR 90-150)
[ ] số từ đệm: ___            ("ờ", "à", "kiểu là", "thì là", "um", "like")
[ ] số lần nhìn khỏi camera: ___
[ ] móc câu (con số / sự cố / quyết định) xuất hiện ở giây: ___
[ ] câu cuối nối tới công ty: có / không
[ ] kết thúc gọn (không "...dạ, đại khái vậy ạ"): có / không

`;

/* ═══════════════════════ 2.5 — Lab: quay video tự giới thiệu ═══════════════════════ */
const L25 = {
  title: '2.5 — Lab 2: record your self-introduction (90 s Vietnamese + 60 s English) and score it|||2.5 — Lab 2: quay video tự giới thiệu (90 giây tiếng Việt + 60 giây tiếng Anh) và tự chấm',
  slug: 'pv-2-5-lab-tu-gioi-thieu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài lab làm được ngay: dựng góc quay như phỏng vấn online, quay ba lượt phần tự giới thiệu tiếng Việt 90 giây và tiếng Anh 60 giây, xem lại với bảng kiểm (thời lượng, từ đệm, ánh mắt, tốc độ, móc câu), tự chấm bằng rubric 12 điểm, và kể to một câu chuyện STAR.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lab 2</span>
<h2>Lab 2 — Record your self-introduction and score it like an interviewer would</h2>
<p class="lead">You cannot hear yourself while you speak. Every candidate thinks they speak slower, say "um" less and look at the camera more than they really do. The only fix is a recording. In this lab you set up your space exactly like an online interview, record your Vietnamese and English introductions three times each, and score them with a rubric — then do the same for one STAR story.</p>

<h3>The situation</h3>
<p>Next week you have your first online interview with a company from your tracker. The first two minutes will be your self-introduction, and the interviewer will be looking at you through a webcam. You want to know, before that day, what they will see and hear.</p>
${flow([
  ['1 · Set up', 'camera, light, sound, background', 'Laptop camera at eye level (put books under it), light in front of you not behind, a quiet room, a plain background, earphones with a microphone.'],
  ['2 · Record', 'three takes each, no editing', 'Use your phone or the laptop camera app. Take 1 is a warm-up; do not stop for mistakes.'],
  ['3 · Review', 'watch with the checklist', 'Count, do not judge: seconds, filler words, times you looked away, the moment of the hook.'],
  ['4 · Score and fix', 'rubric, then one change, then record again', 'Change one thing per take. Three focused takes beat ten random ones.'],
])}

<h3>Steps</h3>
<ol>
<li>Print or open your Lesson 2.1 script. Do <strong>not</strong> read it on camera — glance at three keywords written on a sticky note next to the camera.</li>
<li>Record the Vietnamese version (target 80–95 s) three times.</li>
<li>Record the English version (target 50–65 s) three times. Short sentences; it is fine to be slower.</li>
<li>Review each take with the checklist below and fill the rubric for your best take in each language.</li>
<li>Record one STAR story from Lesson 2.2 (target 1.5–2.5 min) and score it with the last two rubric lines.</li>
</ol>
${ra(KIEM_0)}
<details><summary>Hint — fewer filler words in one day</summary>
<p>Filler words fill silence while your brain looks for the next phrase. Do not try to "stop saying um"; instead, <strong>replace it with a short silent pause</strong>. A one-second pause sounds confident on a recording; "um" sounds unsure. Practise by recording the first sentence only, five times, pausing at every comma.</p>
</details>
<details><summary>Hint — where to look</summary>
<p>Look at the camera lens, not at your own face on the screen. Put a small sticker next to the lens. It feels strange; on the recording it looks like eye contact.</p>
</details>
${bay('en', 'memorising the script word for word.', 'A memorised script sounds recited, and one forgotten word can make you freeze. Memorise the structure and three keywords per part (for example "backend · platform + incident · capstone by hand · this team because…"), and let the sentences come out slightly differently each time. That is what natural speech is.')}
${keXau('en', 'keep these recordings private. Do not upload them publicly with your full name, school and student ID, and check that nothing private is visible behind you (a calendar with addresses, a student card, a monitor with emails). If you share a take with a friend for feedback, send the file directly rather than a public link.')}

<h3>Rubric (out of 12, per language)</h3>
${rubric('en', [
  ['Length', 'More than 30 s off target', 'Within 15–30 s of target', 'Within target'],
  ['Structure', 'No clear present/past/future', 'Two of the three parts', 'All three, in order'],
  ['Hook', 'No concrete detail', 'A detail, but vague', 'A number, incident or decision'],
  ['Honesty', 'Claims not defensible', 'Mostly defensible', 'Every claim defensible, AI role stated where relevant'],
  ['Delivery', 'More than 8 fillers, looks away often', '4–8 fillers', 'Fewer than 4, steady eye contact'],
  ['Close', 'Trails off', 'Ends but without the company link', 'Clean end linked to this role'],
])}
<p><strong>Target:</strong> 9/12 in Vietnamese and 7/12 in English before your first real interview. <strong>Extra challenge:</strong> ask a friend to interrupt you after 20 seconds with "Why PostgreSQL?" and continue smoothly.</p>
${thucHanh('en', { phut: '60', steps: [
  'Set up your space and record three takes in each language.',
  'Review every take with the checklist, score the best ones with the rubric.',
  'Make one change and record a fourth take in the weaker language.',
  'Record and score one STAR story.',
], dat: 'your best Vietnamese take scores at least 9/12, English at least 7/12, and one STAR story lasts 1.5–2.5 minutes.' })}
${thuatNgu('en', [
  ['Take', 'One recording attempt.'],
  ['Eye contact (online)', 'Looking into the camera lens so the viewer feels you are looking at them.'],
  ['Filler word', 'A sound like "um" used to fill silence.'],
  ['Pause', 'A short deliberate silence — sounds more confident than a filler.'],
  ['Rubric', 'A scoring table with criteria and levels.'],
])}
${tomTat('en', [
  'You only hear how you really sound on a recording.',
  'Set up like a real online interview: camera at eye level, light in front, quiet, plain background.',
  'Review by counting — seconds, fillers, glances away — not by feeling.',
  'Memorise structure and keywords, not sentences; replace fillers with short pauses.',
  'Keep practice videos private.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'software-development-project', bai: 'swp391-7-2-report-presentation', academy: true, L: 'en', title: 'Academy · SWP391 7.2 — The final presentation', sub: 'The same speaking skills, for your capstone defence.' }),
  yt('syfPzQWwbTk', 'The Wall Street Journal', 'How to Ace Your Video Interview', 6, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Lab 2</span>
<h2>Lab 2 — Quay phần tự giới thiệu và chấm nó như người phỏng vấn sẽ chấm</h2>
<p class="lead">Bạn không nghe được chính mình trong lúc nói. Ứng viên nào cũng nghĩ mình nói chậm hơn, ít "ờ" hơn và nhìn camera nhiều hơn thực tế. Cách duy nhất để sửa là quay lại. Trong lab này bạn dựng góc ngồi y như một buổi phỏng vấn online, quay phần giới thiệu tiếng Việt và tiếng Anh mỗi thứ ba lần, chấm bằng rubric — rồi làm tương tự với một câu chuyện STAR.</p>

<h3>Tình huống</h3>
<p>Tuần sau bạn có buổi phỏng vấn online đầu tiên với một công ty trong bảng theo dõi. Hai phút đầu sẽ là phần tự giới thiệu, và người phỏng vấn nhìn bạn qua webcam. Bạn muốn biết, trước ngày đó, họ sẽ thấy và nghe gì.</p>
${flow([
  ['1 · Dựng góc', 'camera, ánh sáng, âm thanh, phông nền', 'Camera laptop ngang tầm mắt (kê sách bên dưới), đèn chiếu từ phía trước chứ không phải sau lưng, phòng yên tĩnh, phông nền gọn, tai nghe có micro.'],
  ['2 · Quay', 'mỗi bản ba lượt, không cắt ghép', 'Dùng điện thoại hoặc ứng dụng camera của laptop. Lượt 1 là khởi động; vấp cũng đừng dừng.'],
  ['3 · Xem lại', 'xem với bảng kiểm', 'Đếm, đừng phán xét: số giây, số từ đệm, số lần nhìn đi chỗ khác, thời điểm cái móc câu xuất hiện.'],
  ['4 · Chấm và sửa', 'rubric, rồi sửa một thứ, rồi quay lại', 'Mỗi lượt chỉ đổi một thứ. Ba lượt tập trung hơn mười lượt tuỳ hứng.'],
])}

<h3>Các bước</h3>
<ol>
<li>In hoặc mở kịch bản ở bài 2.1. <strong>Không</strong> đọc nó trước camera — chỉ liếc ba từ khoá viết trên một tờ giấy nhớ dán cạnh camera.</li>
<li>Quay bản tiếng Việt (mục tiêu 80–95 giây) ba lần.</li>
<li>Quay bản tiếng Anh (mục tiêu 50–65 giây) ba lần. Câu ngắn; chậm một chút không sao.</li>
<li>Xem lại từng lượt với bảng kiểm dưới đây và điền rubric cho lượt tốt nhất của mỗi ngôn ngữ.</li>
<li>Quay một câu chuyện STAR từ bài 2.2 (mục tiêu 1,5–2,5 phút) và chấm bằng hai dòng cuối của rubric.</li>
</ol>
${ra(KIEM_1)}
<details><summary>Gợi ý — bớt từ đệm trong một ngày</summary>
<p>Từ đệm lấp khoảng lặng trong lúc não tìm cụm từ tiếp theo. Đừng cố "không nói ờ nữa"; hãy <strong>thay nó bằng một quãng lặng ngắn</strong>. Ngừng một giây nghe tự tin trên băng; "ờ" nghe thiếu chắc chắn. Luyện bằng cách chỉ quay câu đầu tiên, năm lần, ngừng ở mỗi dấu phẩy.</p>
</details>
<details><summary>Gợi ý — nhìn vào đâu</summary>
<p>Nhìn vào ống kính camera, không nhìn mặt mình trên màn hình. Dán một miếng nhãn nhỏ cạnh ống kính. Lúc đầu thấy kỳ; nhưng trên video trông như đang nhìn vào mắt người xem.</p>
</details>
${bay('vi', 'học thuộc kịch bản từng chữ.', 'Kịch bản học thuộc nghe như đọc bài, và quên một chữ là có thể đứng hình. Hãy thuộc cấu trúc và ba từ khoá mỗi phần (ví dụ "backend · nền tảng + sự cố · đồ án tự code · đội này vì…"), rồi để câu chữ bật ra hơi khác nhau mỗi lần. Đó mới là cách nói tự nhiên.')}
${keXau('vi', 'giữ các video này riêng tư. Đừng đăng công khai kèm họ tên đầy đủ, trường và mã số sinh viên, và kiểm xem phía sau bạn không lộ gì riêng tư (lịch có ghi địa chỉ, thẻ sinh viên, màn hình đang mở email). Nếu gửi một lượt quay cho bạn bè góp ý, gửi thẳng tệp thay vì một đường liên kết công khai.')}

<h3>Rubric (thang 12, cho mỗi ngôn ngữ)</h3>
${rubric('vi', [
  ['Thời lượng', 'Lệch mục tiêu hơn 30 giây', 'Lệch 15–30 giây', 'Trong mục tiêu'],
  ['Cấu trúc', 'Không rõ hiện tại/quá khứ/tương lai', 'Có hai trên ba phần', 'Đủ ba phần, đúng thứ tự'],
  ['Móc câu', 'Không có chi tiết cụ thể', 'Có chi tiết nhưng mơ hồ', 'Một con số, sự cố hoặc quyết định'],
  ['Trung thực', 'Có điều không bảo vệ được', 'Phần lớn bảo vệ được', 'Mọi điều đều bảo vệ được, nói rõ vai trò của AI khi liên quan'],
  ['Cách nói', 'Trên 8 từ đệm, hay nhìn đi chỗ khác', '4–8 từ đệm', 'Dưới 4, ánh mắt ổn định'],
  ['Kết', 'Nói lửng lơ', 'Có kết nhưng không nối tới công ty', 'Kết gọn, nối tới vị trí này'],
])}
<p><strong>Mục tiêu:</strong> tiếng Việt 9/12 và tiếng Anh 7/12 trước buổi phỏng vấn thật đầu tiên. <strong>Thử thách thêm:</strong> nhờ một người bạn cắt ngang bạn ở giây thứ 20 bằng câu "Sao em chọn PostgreSQL?" và bạn trả lời xong thì nối tiếp trơn tru.</p>
${thucHanh('vi', { phut: '60', steps: [
  'Dựng góc ngồi và quay ba lượt cho mỗi ngôn ngữ.',
  'Xem lại mọi lượt với bảng kiểm, chấm lượt tốt nhất bằng rubric.',
  'Sửa một thứ và quay lượt thứ tư cho ngôn ngữ yếu hơn.',
  'Quay và chấm một câu chuyện STAR.',
], dat: 'lượt tiếng Việt tốt nhất đạt ít nhất 9/12, tiếng Anh ít nhất 7/12, và một câu chuyện STAR dài 1,5–2,5 phút.' })}
${thuatNgu('vi', [
  ['Take (lượt quay)', 'Một lần quay thử.'],
  ['Eye contact online (giao tiếp bằng mắt khi gọi video)', 'Nhìn vào ống kính camera để người xem cảm thấy bạn đang nhìn họ.'],
  ['Filler word (từ đệm)', 'Âm như "ờ", "à" dùng để lấp khoảng lặng.'],
  ['Pause (quãng ngừng)', 'Một khoảng lặng ngắn có chủ ý — nghe tự tin hơn từ đệm.'],
  ['Rubric (bảng tiêu chí chấm)', 'Bảng chấm điểm gồm tiêu chí và mức.'],
])}
${tomTat('vi', [
  'Chỉ khi quay lại bạn mới nghe được giọng mình thật sự ra sao.',
  'Dựng góc y như phỏng vấn online thật: camera ngang mắt, đèn phía trước, yên tĩnh, phông gọn.',
  'Xem lại bằng cách đếm — số giây, từ đệm, lần nhìn đi — không bằng cảm giác.',
  'Thuộc cấu trúc và từ khoá, đừng thuộc câu; thay từ đệm bằng quãng ngừng ngắn.',
  'Giữ video luyện tập ở chế độ riêng tư.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'software-development-project', bai: 'swp391-7-2-report-presentation', academy: true, title: 'Academy · SWP391 7.2 — Buổi thuyết trình cuối kỳ', sub: 'Cùng những kỹ năng nói ấy, dùng cho buổi bảo vệ đồ án.' }),
  yt('syfPzQWwbTk', 'The Wall Street Journal', 'How to Ace Your Video Interview', 6),
])}
</div>
`,
};

/* ═══════════════════════ 2.6 — Quiz ═══════════════════════ */
const Q26 = {
  title: '2.6 — Chapter 2 check|||2.6 — Kiểm tra Chương 2',
  slug: 'pv-2-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về phần tự giới thiệu, STAR, "em" và "nhóm", con số có nguồn, kể thất bại không đổ lỗi, điểm yếu, và câu hỏi hỏi lại người phỏng vấn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Check</span>
<h2>Chapter 2 check — telling your story</h2>
<p class="lead">Ten situations from real interviews. Read every explanation, especially the reason the tempting answer is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can give a 90-second self-introduction in Present–Past–Future order.</li>
<li>I can tell a STAR story in about two minutes with the Action as the largest part.</li>
<li>I separate "we" (context) from "I" (my actions), including what an AI tool did.</li>
<li>I can talk about a failure in five steps without blaming anyone.</li>
<li>I have three questions ready for the end of an interview.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Kiểm tra Chương 2 — kể câu chuyện của bạn</h2>
<p class="lead">Mười tình huống từ các buổi phỏng vấn thật. Đọc mọi lời giải thích, nhất là lý do phương án hấp dẫn lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tự giới thiệu được trong 90 giây theo thứ tự Hiện tại – Quá khứ – Tương lai.</li>
<li>Tôi kể được một câu chuyện STAR trong khoảng hai phút, phần Hành động dài nhất.</li>
<li>Tôi tách "nhóm" (bối cảnh) với "em" (việc tôi làm), kể cả phần công cụ AI làm.</li>
<li>Tôi kể được một thất bại theo năm bước mà không đổ lỗi cho ai.</li>
<li>Tôi có sẵn ba câu hỏi cho cuối buổi phỏng vấn.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      cau('Your self-introduction starts: "I was born in Nghe An, I love football and my family has three children." What is the main problem?|||Phần tự giới thiệu của bạn mở đầu: "Em sinh ra ở Nghệ An, em thích đá bóng, nhà em có ba anh em." Vấn đề chính là gì?', [
        'It is too short|||Nó quá ngắn',
        'It uses the most valuable seconds on facts that give the interviewer nothing technical to ask about|||Nó tiêu những giây quý nhất vào những điều không cho người phỏng vấn thứ gì kỹ thuật để hỏi',
        'Interviewers are not allowed to hear personal information|||Người phỏng vấn không được phép nghe thông tin cá nhân',
        'It should be in English|||Nó phải bằng tiếng Anh',
      ], 1, 'EN: The opening seconds should orient the interviewer (who you are, your focus) and give them a hook. Personal facts are not forbidden — the problem is the wasted opening, not legality.|||VI: Những giây đầu nên giúp người phỏng vấn định vị bạn (bạn là ai, hướng tập trung) và đưa họ một cái móc. Thông tin cá nhân không bị cấm — vấn đề là phí mất phần mở đầu, không phải chuyện được phép hay không.'),
      cau('In a STAR story of two minutes, which part should take the most time?|||Trong một câu chuyện STAR dài hai phút, phần nào nên chiếm nhiều thời gian nhất?', [
        'Situation, so they understand the background|||Tình huống, để họ hiểu bối cảnh',
        'Task, so your responsibility is clear|||Nhiệm vụ, để trách nhiệm của bạn rõ ràng',
        'Result, because numbers impress|||Kết quả, vì con số gây ấn tượng',
        'Action — about half or more, because that is what is scored|||Hành động — khoảng một nửa hoặc hơn, vì đó là phần được chấm',
      ], 3, 'EN: The interviewer scores what you did and why. A long Situation is the most common mistake: it feels necessary but leaves no time for the Action.|||VI: Người phỏng vấn chấm điều bạn đã làm và vì sao. Tình huống dài là lỗi hay gặp nhất: nghe có vẻ cần, nhưng làm hết thời gian cho phần Hành động.'),
      cau('Which sentence is best in a team-project story?|||Câu nào tốt nhất trong một câu chuyện dự án nhóm?', [
        '"We were four; I owned the booking module and wrote the overlap check."|||"Nhóm em bốn người; em phụ trách module đặt lịch và viết phần kiểm trùng lịch."',
        '"We built the whole system together."|||"Nhóm em cùng nhau làm cả hệ thống."',
        '"I did everything because the others were lazy."|||"Em làm hết vì các bạn khác lười."',
        '"My team did the backend and I helped a bit."|||"Nhóm em làm backend, em phụ một chút."',
      ], 0, 'EN: "We" for the context, "I" for your concrete actions. "We built it together" hides what you can do; blaming teammates is a red flag even if true.|||VI: "Nhóm" cho bối cảnh, "em" cho hành động cụ thể. "Cùng nhau làm" giấu mất bạn làm được gì; đổ lỗi cho bạn cùng nhóm là cờ đỏ dù có đúng.'),
      cau('You want to say your fix "improved performance a lot". You have no measurement. What should you do?|||Bạn muốn nói bản sửa của mình "cải thiện hiệu năng rất nhiều", nhưng không có số đo nào. Nên làm gì?', [
        'Say "by about 300%" — it sounds convincing|||Nói "khoảng 300%" — nghe thuyết phục',
        'Leave out the result entirely|||Bỏ hẳn phần kết quả',
        'Describe the effect honestly ("the page no longer timed out for the class") or measure it before the interview|||Tả tác động một cách trung thực ("trang không còn bị quá thời gian chờ với cả lớp") hoặc đo nó trước buổi phỏng vấn',
        'Say you cannot remember the number|||Nói là em không nhớ con số',
      ], 2, 'EN: Numbers must come from records. An invented 300% collapses at the first follow-up ("how did you measure it?"). Leaving out the result weakens the story; an honest effect or a fresh measurement keeps it strong.|||VI: Con số phải đến từ ghi chép. Con số 300% bịa ra sụp đổ ngay câu hỏi đầu tiên ("em đo bằng cách nào?"). Bỏ phần kết quả làm câu chuyện yếu; tả tác động trung thực hoặc đo lại thì vẫn mạnh.'),
      cau('An AI assistant wrote the first version of your deploy script; you found a bug in it and added a check. How do you tell it?|||Trợ lý AI viết bản đầu của script deploy; bạn tìm ra lỗi trong nó và thêm một bước kiểm. Kể thế nào?', [
        '"I wrote the deploy script." — the AI is just a tool|||"Em viết script deploy." — AI chỉ là công cụ',
        '"The assistant generated the first version; I found it used the wrong Dockerfile and I added the check."|||"Trợ lý sinh bản đầu; em phát hiện nó dùng nhầm Dockerfile và em thêm bước kiểm."',
        '"The AI did it, I am not sure how it works."|||"AI làm hết, em không rõ nó chạy thế nào."',
        'Avoid the story — it reveals that you used AI|||Tránh kể câu chuyện này — nó lộ ra là bạn dùng AI',
      ], 1, 'EN: Saying exactly what the tool produced and what you did is honest and puts your real skill (finding the bug, adding prevention) in front. Claiming you wrote it all breaks at the first "change this line" request.|||VI: Nói đúng công cụ sinh ra gì và bạn làm gì vừa trung thực vừa đưa kỹ năng thật của bạn (tìm lỗi, thêm cách phòng) lên trước. Nhận là mình viết hết sẽ vỡ ngay khi bị nhờ "sửa dòng này đi".'),
      cau('"What is your biggest weakness?" Which answer is strongest for a backend intern?|||"Điểm yếu lớn nhất của em là gì?" Câu nào mạnh nhất cho thực tập backend?', [
        '"I am a perfectionist."|||"Em là người cầu toàn."',
        '"I am weak at SQL."|||"Em yếu SQL."',
        '"I do not have any real weaknesses."|||"Em không có điểm yếu thật sự nào."',
        '"My spoken English is weaker than my reading; I practise speaking 15 minutes a day."|||"Tiếng Anh nói của em yếu hơn đọc; em luyện nói 15 phút mỗi ngày."',
      ], 3, 'EN: A real weakness that is not fatal for the role, with an active fix. "Perfectionist" is a fake weakness everyone recognises; "weak at SQL" is real but fatal for backend.|||VI: Một điểm yếu thật, không chí mạng với vị trí, có cách đang sửa. "Cầu toàn" là điểm yếu giả ai cũng nhận ra; "yếu SQL" là thật nhưng chí mạng với backend.'),
      cau('A deploy step reported "OK" but the new nginx settings never took effect. Which prevention best matches the five-step answer?|||Một bước deploy báo "OK" nhưng thiết lập nginx mới không bao giờ có hiệu lực. Cách phòng nào khớp nhất với câu trả lời năm bước?', [
        'Compare the file’s checksum inside the container with the host copy and stop if they differ|||So mã băm của tệp bên trong container với bản trên máy chủ và dừng nếu lệch',
        'Promise to check more carefully next time|||Hứa lần sau kiểm cẩn thận hơn',
        'Restart the whole server after each deploy|||Khởi động lại cả máy chủ sau mỗi lần deploy',
        'Stop using nginx|||Thôi không dùng nginx nữa',
      ], 0, 'EN: Prevention must be a check that does not depend on memory, verified from the side that consumes the change. "Be more careful" is the classic weak prevention; restarting everything is heavy and hides the cause.|||VI: Phòng ngừa phải là một bước kiểm không phụ thuộc trí nhớ, kiểm từ phía dùng thay đổi. "Cẩn thận hơn" là cách phòng yếu kinh điển; khởi động lại tất cả thì nặng nề và che mất nguyên nhân.'),
      cau('Your teammate merged broken code the night before the demo. You are asked "Tell me about a conflict or failure in your team". What do you focus on?|||Bạn cùng nhóm merge code hỏng đêm trước buổi demo. Bạn được hỏi "Kể về một mâu thuẫn hay thất bại trong nhóm". Bạn tập trung vào gì?', [
        'Explaining clearly that it was the teammate’s fault|||Giải thích rõ đó là lỗi của bạn cùng nhóm',
        'Saying nothing went wrong in your team|||Nói nhóm không có chuyện gì sai',
        'Your part — what you did to recover, and what the team changed (for example review before merge)|||Phần của bạn — bạn đã làm gì để cứu, và nhóm đã thay đổi gì (ví dụ review trước khi merge)',
        'How unfair the teacher’s deadline was|||Hạn của thầy bất công thế nào',
      ], 2, 'EN: Even when someone else caused it, the question is about your actions and the process change. Accurate blame still sounds like what you will do to your next team.|||VI: Kể cả khi người khác gây ra, câu hỏi vẫn là về hành động của bạn và thay đổi quy trình. Đổ lỗi dù đúng vẫn nghe như điều bạn sẽ làm với đội tiếp theo.'),
      cau('At the end of a technical round with an engineer, which question is best?|||Cuối vòng kỹ thuật với một kỹ sư, câu hỏi nào tốt nhất?', [
        '"How many days off will I get?"|||"Em được nghỉ mấy ngày ạ?"',
        '"How does code review work here, and who reviews an intern’s pull requests?"|||"Review code ở đây diễn ra thế nào, ai sẽ review pull request của thực tập sinh ạ?"',
        '"What does your company do?"|||"Công ty mình làm về gì ạ?"',
        '"Did I pass?"|||"Em có đậu không ạ?"',
      ], 1, 'EN: Engineers know the review culture; the answer helps you choose. Days off belong with HR; "what does your company do" shows no preparation; "did I pass" makes them uncomfortable.|||VI: Kỹ sư nắm văn hoá review; câu trả lời giúp bạn lựa chọn. Ngày nghỉ hỏi HR; "công ty làm gì" cho thấy không chuẩn bị; "em có đậu không" làm họ khó xử.'),
      cau('Your STAR stories mostly take 4–5 minutes. What is the most likely cause?|||Các câu chuyện STAR của bạn hầu hết kéo dài 4–5 phút. Nguyên nhân khả dĩ nhất là gì?', [
        'The Action is too detailed — you should cut it|||Phần Hành động quá chi tiết — nên cắt',
        'You speak too slowly|||Bạn nói quá chậm',
        'Interviewers expect five minutes|||Người phỏng vấn mong đợi năm phút',
        'The Situation is too long — background the interviewer does not need|||Phần Tình huống quá dài — bối cảnh người phỏng vấn không cần',
      ], 3, 'EN: Over-long stories usually come from a long setup. Cutting the Action is tempting but removes the scored part; trim the Situation to two sentences instead.|||VI: Câu chuyện quá dài thường do phần dẫn dắt dài. Cắt phần Hành động nghe hợp lý nhưng là bỏ đi phần được chấm; hãy rút Tình huống còn hai câu.'),
    ],
  },
};

export default {
  title: 'Chapter 2 — Telling your story|||Chương 2 — Kể câu chuyện của bạn',
  description: 'Giới thiệu bản thân trong 90 giây, kể dự án theo STAR với con số thật, kể thất bại và sự cố không đổ lỗi, câu hỏi để hỏi lại người phỏng vấn, và lab quay video tự giới thiệu có rubric.',
  lessons: [L21, L22, L23, L24, L25, Q26],
};
