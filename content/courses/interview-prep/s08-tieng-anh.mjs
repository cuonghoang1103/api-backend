/**
 * IT Interview Prep — Chương 8: Tiếng Anh phỏng vấn IT (soạn 15/11/2026).
 * Viết cho người KÉM tiếng Anh: khối VI giải nghĩa từng mẫu câu; phiên âm kiểu Việt chỉ GẦN đúng — nghe bản gốc trên YouGlish.
 * Khoá chữ, khuôn Mục 0 + helper ./_pv.mjs. GIỮ slug bài của khung cũ.
 * LUẬT: không backtick trần; không viết "${" trong chữ; < > & trong chữ → &lt; &gt; &amp;; không gạch chéo ngược.
 */
import { ra, lienKet, nguon, yt, flow, stack, kv, bang, bay, keXau, doiThuong, neu, thucHanh, thuatNgu, tomTat, lienQuan, rubric, cau } from './_pv.mjs';

/* ═══════════════════════ 8.1 — Giới thiệu bản thân bằng tiếng Anh ═══════════════════════ */
const MAU_60S = `
[PRESENT — who I am now · ~15 s]
Hi, my name is Cuong. I'm a software engineering student at FPT University,
and I'm looking for a backend internship for the spring semester.

[PAST — what I have done · ~30 s]
For the past year, I have built and run my own learning platform, cuongthai.com.
It uses Next.js, Express with TypeScript, and PostgreSQL, and it runs in Docker
on a Linux server. I used AI coding assistants for a lot of the code.
My main work was the architecture, reviewing the code, deploying,
and fixing problems in production.
I'm also building my capstone project, LabFlow AI, with Spring Boot and React.
I write that code by hand.

[FUTURE — why this job · ~15 s]
Now I want to join a real team, learn how professional engineers
review and ship code, and grow as a backend developer.
That's why I applied to this internship.
`;

const L81 = {
  title: '8.1 — Introducing yourself in English: present, past, future in 60 seconds|||8.1 — Giới thiệu bản thân bằng tiếng Anh: hiện tại, quá khứ, tương lai trong 60 giây',
  slug: 'pv-8-1-gioi-thieu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Khung present → past → future cho câu "Tell me about yourself" bằng tiếng Anh đơn giản, bản 60 giây mẫu dựng từ hồ sơ thật của chủ kênh, bảng "câu tiếng Việt muốn nói → câu tiếng Anh đơn giản", và năm lỗi phát âm người Việt hay mắc khi nói về bản thân.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Introducing yourself in English — sixty seconds, three tenses, short sentences</h2>
<p class="lead">"Tell me about yourself" is almost always the first question, and in an English interview it is the one moment you can fully prepare. You do not need advanced English for it. You need about ten short sentences, in three blocks — present, past, future — that you have said out loud so many times that they come out even when you are nervous. This lesson builds that answer from a real student profile.</p>

<h3>An everyday picture: the bus-stop introduction</h3>
${doiThuong('en', 'Imagine meeting a friend’s parent at a bus stop. You would not recite your whole life. You would say who you are now ("I study software engineering"), one thing you have done ("I built a website for my courses"), and where you are heading ("I’m looking for an internship"). Thirty seconds, then the bus comes. An interview introduction is the same shape, just a little longer and a little more polished.')}

<h3>The present–past–future frame</h3>
${flow([
  ['1 · Present (~15 s)', 'who you are now', 'Name, what you study, what you are looking for. Present simple and present continuous: "I study…", "I’m looking for…".'],
  ['2 · Past (~30 s)', 'the evidence', 'One or two projects and what YOU did in them. Present perfect for things that continue ("I have built…"), past simple for finished events ("I fixed…").'],
  ['3 · Future (~15 s)', 'why this job', 'What you want to learn, and the link to this company. "I want to…", "That’s why I applied…".'],
])}
<p>This frame works because the listener always knows where you are. It also keeps your grammar simple: each block uses one or two tenses, so you are not switching tenses mid-sentence.</p>

<h3>A 60-second model, built from a real profile</h3>
<p>Below is a model for a student who runs a personal learning platform and is building a capstone. Notice: short sentences, no rare words, and an honest line about AI tools. Replace every detail with yours — do not memorise someone else’s life.</p>
${ra(MAU_60S)}
<p>Why the honest AI line? Because the next question is often "Tell me more about that project", and the interviewer may ask you to explain or change code. Saying clearly what you did yourself — architecture, review, deployment, incident fixing — and that the capstone is hand-written makes you <strong>more</strong> credible, not less.</p>

<h3>Ten sentences you can reuse</h3>
${bang(['What you want to say', 'Simple English', 'Note'], [
  ['I am a third-year student of software engineering', 'I’m a third-year software engineering student at FPT University.', '"third-year" with a hyphen; no "of".'],
  ['I am looking for an internship', 'I’m looking for a backend internship.', 'present continuous = right now.'],
  ['I have done a project about…', 'I have built a web app for…', '"built", not "done a project about".'],
  ['My part in the team was…', 'In my team, I was responsible for the API and the database.', '"responsible for" + noun/-ing.'],
  ['I am good at…', 'I’m comfortable with Node.js and SQL.', 'sounds confident but honest.'],
  ['I am learning…', 'I’m currently learning Spring Boot.', '"currently" shows it is ongoing.'],
  ['I solved a big bug', 'I fixed a production bug that took the API down.', 'concrete beats big.'],
  ['I want to improve myself', 'I want to learn how professional teams review code.', 'specific beats general.'],
  ['That is why I choose your company', 'That’s why I applied to this role.', 'past tense: you already applied.'],
  ['That’s all about me', 'I’d be happy to tell you more about any of these.', 'a soft, open ending.'],
])}
${bay('en', 'translating a long Vietnamese paragraph word by word.', 'Vietnamese sentences joined with "và", "thì", "mà" become one endless English sentence with broken grammar. Cut every idea into its own short sentence: subject + verb + one detail. Short sentences are not "bad English"; native speakers use them in interviews too.')}

<h3>Five sounds that make Vietnamese speakers hard to understand</h3>
${stack([
  ['Final consonants', '"built" not "bui", "project" not "pro-jec", "fixed" ends with a /t/. Say the last sound, even softly.'],
  ['-s endings', '"projects", "APIs", "years" — the -s carries meaning (plural). Dropping it changes the sentence.'],
  ['-ed endings', '"deployed" /d/, "fixed" /t/, "migrated" /ɪd/. Only verbs ending in t/d add a syllable.'],
  ['Word stress', 'de-PLOY, ar-chi-TEC-ture is wrong: it is AR-chi-tec-ture. Stress the right syllable and the word becomes clear (Lesson 8.3).'],
  ['Speed', 'Nervous people speed up. Aim for about two-thirds of your normal speed, with a pause after each block.'],
])}

${neu('en', 'the interviewer interrupts after twenty seconds with a question? That is good — it means they are interested. Answer the question, then do not restart your introduction. If something important is left (for example your capstone), add it naturally later: "That reminds me of my capstone project…".')}
${keXau('en', 'some "English interview coaching" services ask for money to give you a "guaranteed" script or a fake certificate. No script guarantees a job, and a certificate you did not earn is easy to check and can end an offer. Free tools — your phone recorder, YouGlish, and a friend — are enough for this chapter.')}

${thucHanh('en', { phut: '20–30', steps: [
  'Write your own three blocks using the frame: 2 sentences present, 4 sentences past, 2 sentences future.',
  'Read each sentence aloud and cut any sentence that you cannot say in one breath.',
  'Record yourself on your phone. Listen once for final consonants and -s/-ed endings only, and fix three words.',
  'Record again and time it: 50–70 seconds is the target.',
], dat: 'you have a written 8-sentence introduction and a recording between 50 and 70 seconds in which every final consonant of "built", "fixed", "projects" is audible.' })}
${thuatNgu('en', [
  ['Present simple', '"I study", "I work" — facts and habits.'],
  ['Present continuous', '"I’m looking for", "I’m learning" — happening around now.'],
  ['Present perfect', '"I have built" — from the past up to now, result still matters.'],
  ['Past simple', '"I fixed", "I deployed" — finished events at a known time.'],
  ['Word stress', 'The syllable said louder and longer; wrong stress makes words hard to recognise.'],
  ['Elevator pitch', 'A short, prepared summary of who you are and what you want.'],
])}
${tomTat('en', [
  'Build the introduction in three blocks: present, past, future — about 60 seconds.',
  'Use short sentences: subject + verb + one detail; never translate long Vietnamese sentences word by word.',
  'Say clearly what you built yourself and how you used AI tools — honesty makes the next questions easier.',
  'Pronounce final consonants and -s/-ed endings; speak at two-thirds speed.',
  'If interrupted, answer the question and continue naturally; do not restart.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'interview-prep', bai: 'pv-2-1-gioi-thieu', L: 'en', title: 'IT Interview Prep 2.1 — "Tell me about yourself"', sub: 'The same answer in Vietnamese, with the content decisions explained.' }),
  yt('8laYlyAFd0o', 'linguamarina', 'SELF INTRODUCTION — How to introduce yourself in English (confidently)', 13, 'en'),
  nguon('🔊', 'YouGlish', 'Type any word and hear it spoken by real people in thousands of YouTube videos.', 'https://youglish.com/'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Giới thiệu bản thân bằng tiếng Anh — sáu mươi giây, ba thì, câu ngắn</h2>
<p class="lead">"Tell me about yourself" (hãy kể về bản thân bạn) gần như luôn là câu hỏi đầu tiên, và trong một buổi phỏng vấn tiếng Anh đây là khoảnh khắc DUY NHẤT bạn chuẩn bị được trọn vẹn. Bạn không cần tiếng Anh cao siêu. Bạn cần khoảng mười câu ngắn, chia ba khối — hiện tại, quá khứ, tương lai — đã nói thành tiếng nhiều tới mức lúc run vẫn tự bật ra. Bài này dựng câu trả lời đó từ một hồ sơ sinh viên có thật.</p>

<h3>Liên tưởng đời thường: lời chào ở bến xe buýt</h3>
${doiThuong('vi', 'Hãy tưởng tượng bạn gặp bố mẹ của một người bạn ở bến xe buýt. Bạn sẽ không kể cả cuộc đời. Bạn nói mình là ai bây giờ ("cháu học kỹ thuật phần mềm"), một việc mình đã làm ("cháu làm một trang web học tập"), và mình đang hướng tới đâu ("cháu đang tìm chỗ thực tập"). Ba mươi giây, rồi xe tới. Lời giới thiệu trong phỏng vấn có đúng hình dạng đó, chỉ dài hơn và chau chuốt hơn một chút.')}

<h3>Khung hiện tại – quá khứ – tương lai</h3>
${flow([
  ['1 · Hiện tại (~15 giây)', 'bạn là ai bây giờ', 'Tên, đang học gì, đang tìm gì. Dùng thì hiện tại đơn và hiện tại tiếp diễn: "I study…" (tôi học…), "I’m looking for…" (tôi đang tìm…).'],
  ['2 · Quá khứ (~30 giây)', 'bằng chứng', 'Một hai dự án và việc CHÍNH BẠN đã làm. Hiện tại hoàn thành cho việc còn kéo dài ("I have built…" — tôi đã xây và nó vẫn đang chạy), quá khứ đơn cho sự việc đã xong ("I fixed…" — tôi đã sửa).'],
  ['3 · Tương lai (~15 giây)', 'vì sao là công việc này', 'Bạn muốn học gì, và nối với công ty này. "I want to…" (tôi muốn…), "That’s why I applied…" (vì vậy tôi đã nộp đơn…).'],
])}
<p>Khung này hiệu quả vì người nghe luôn biết bạn đang ở đâu trong câu chuyện. Nó còn giữ ngữ pháp đơn giản: mỗi khối chỉ dùng một hai thì, nên bạn không phải đổi thì giữa câu — chỗ người Việt hay vấp nhất.</p>

<h3>Bản mẫu 60 giây, dựng từ một hồ sơ thật</h3>
<p>Dưới đây là bản mẫu cho một sinh viên đang vận hành một nền tảng học tập cá nhân và đang làm đồ án tốt nghiệp. Để ý: câu ngắn, không có từ hiếm, và có một câu trung thực về công cụ AI. Thay mọi chi tiết bằng của bạn — đừng học thuộc cuộc đời của người khác.</p>
${ra(MAU_60S)}
<p>Giải nghĩa từng khối để bạn hiểu chứ không chỉ thuộc:</p>
<ul>
<li><strong>Present:</strong> "I’m looking for a backend internship for the spring semester" = "em đang tìm một chỗ thực tập backend cho kỳ Spring". Câu này nói luôn vị trí và thời gian — đúng hai thứ HR cần.</li>
<li><strong>Past:</strong> "For the past year, I have built and run…" = "trong một năm qua, em đã xây và vận hành…". "Run" ở đây là vận hành, không phải chạy bộ. "I used AI coding assistants for a lot of the code. My main work was the architecture, reviewing the code, deploying, and fixing problems in production" = "em dùng trợ lý AI viết nhiều phần mã; việc chính của em là kiến trúc, duyệt mã, deploy, và sửa sự cố trên môi trường thật". "I write that code by hand" = "phần đó em tự viết tay".</li>
<li><strong>Future:</strong> "learn how professional engineers review and ship code" = "học cách kỹ sư chuyên nghiệp duyệt và đưa code lên sản phẩm". "Ship" (đưa ra dùng thật) là từ dân trong ngành rất hay dùng.</li>
</ul>
<p>Vì sao phải có câu thành thật về AI? Vì câu tiếp theo thường là "Tell me more about that project" (kể thêm về dự án đó), và người phỏng vấn có thể nhờ bạn giải thích hoặc sửa một đoạn code. Nói rõ phần nào chính bạn làm — kiến trúc, duyệt mã, deploy, xử lý sự cố — và đồ án là tự code tay khiến bạn <strong>đáng tin hơn</strong>, chứ không kém đi.</p>

<h3>Mười câu dùng lại được: tiếng Việt muốn nói → tiếng Anh đơn giản</h3>
${bang(['Bạn muốn nói', 'Tiếng Anh đơn giản', 'Ghi chú'], [
  ['Em là sinh viên năm ba ngành kỹ thuật phần mềm', 'I’m a third-year software engineering student at FPT University.', '"third-year" có gạch nối; KHÔNG viết "student of software engineering".'],
  ['Em đang tìm chỗ thực tập', 'I’m looking for a backend internship.', 'hiện tại tiếp diễn = đang diễn ra lúc này.'],
  ['Em đã làm một dự án về…', 'I have built a web app for…', 'dùng "built" (xây), đừng "done a project about".'],
  ['Phần của em trong nhóm là…', 'In my team, I was responsible for the API and the database.', '"responsible for" (chịu trách nhiệm) + danh từ hoặc -ing.'],
  ['Em giỏi về…', 'I’m comfortable with Node.js and SQL.', '"comfortable with" (dùng thạo) nghe tự tin mà vẫn khiêm tốn.'],
  ['Em đang học…', 'I’m currently learning Spring Boot.', '"currently" (hiện đang) cho thấy việc còn tiếp diễn.'],
  ['Em đã giải quyết một lỗi lớn', 'I fixed a production bug that took the API down.', 'cụ thể ("làm sập API") mạnh hơn chữ "lớn".'],
  ['Em muốn hoàn thiện bản thân', 'I want to learn how professional teams review code.', 'mục tiêu cụ thể thay cho câu sáo rỗng.'],
  ['Đó là lý do em chọn công ty', 'That’s why I applied to this role.', 'thì quá khứ: bạn ĐÃ nộp đơn rồi.'],
  ['Em xin hết ạ', 'I’d be happy to tell you more about any of these.', 'kết mở, lịch sự, mời họ hỏi tiếp — đừng nói "That’s all".'],
])}
${bay('vi', 'dịch từng chữ một đoạn văn dài tiếng Việt.', 'Câu tiếng Việt nối bằng "và", "thì", "mà" sẽ thành một câu tiếng Anh dài bất tận, gãy ngữ pháp. Hãy cắt mỗi ý thành một câu ngắn riêng: chủ ngữ + động từ + một chi tiết. Câu ngắn KHÔNG phải "tiếng Anh dở"; người bản xứ cũng nói câu ngắn khi phỏng vấn.')}

<h3>Năm âm làm người Việt khó được hiểu</h3>
${stack([
  ['Phụ âm cuối', '"built" chứ không "bui", "project" chứ không "pro-jéc", "fixed" kết thúc bằng âm /t/. Hãy phát âm âm cuối, dù nhẹ — tiếng Việt hay nuốt âm cuối nên đây là lỗi số một.'],
  ['Đuôi -s', '"projects", "APIs", "years" — đuôi -s mang nghĩa số nhiều. Bỏ nó đi là đổi nghĩa câu.'],
  ['Đuôi -ed', '"deployed" đọc /d/, "fixed" đọc /t/, "migrated" đọc /ɪd/ (thêm một âm tiết). Chỉ động từ tận cùng t hoặc d mới thêm âm tiết.'],
  ['Trọng âm từ', 'Đọc "ar-chi-TEC-ture" là sai, đúng là "AR-chi-tec-ture". Nhấn đúng âm tiết thì người nghe nhận ra từ ngay (bài 8.3).'],
  ['Tốc độ', 'Người đang run thường nói nhanh lên. Hãy nhắm khoảng hai phần ba tốc độ bình thường, nghỉ một nhịp sau mỗi khối.'],
])}

${neu('vi', 'người phỏng vấn ngắt lời bạn ở giây thứ hai mươi để hỏi? Đó là dấu hiệu TỐT — nghĩa là họ quan tâm. Trả lời câu hỏi đó, rồi đừng quay lại đọc lại phần giới thiệu từ đầu. Nếu còn ý quan trọng (ví dụ đồ án), chèn tự nhiên lúc sau: "That reminds me of my capstone project…" (chuyện này làm em nhớ tới đồ án của em…).')}
${keXau('vi', 'một số dịch vụ "luyện phỏng vấn tiếng Anh" thu tiền để đưa bạn một kịch bản "bao đậu" hoặc một chứng chỉ giả. Không kịch bản nào bảo đảm có việc, và một chứng chỉ bạn không tự thi rất dễ bị kiểm tra — có thể làm mất luôn offer. Công cụ miễn phí — máy ghi âm điện thoại, YouGlish, và một người bạn — là đủ cho cả chương này.')}

${thucHanh('vi', { phut: '20–30', steps: [
  'Viết ba khối của bạn theo khung: 2 câu hiện tại, 4 câu quá khứ, 2 câu tương lai.',
  'Đọc to từng câu và cắt bỏ (hoặc tách đôi) câu nào bạn không nói hết trong một hơi.',
  'Ghi âm bằng điện thoại. Nghe lại một lượt CHỈ để bắt phụ âm cuối và đuôi -s/-ed, sửa ba từ.',
  'Ghi âm lần nữa và bấm giờ: mục tiêu 50–70 giây.',
], dat: 'bạn có bản giới thiệu 8 câu viết ra giấy và một bản ghi 50–70 giây trong đó nghe rõ âm cuối của "built", "fixed", "projects".' })}
${thuatNgu('vi', [
  ['Present simple (hiện tại đơn)', '"I study", "I work" — sự thật và thói quen.'],
  ['Present continuous (hiện tại tiếp diễn)', '"I’m looking for", "I’m learning" — đang diễn ra quanh thời điểm nói.'],
  ['Present perfect (hiện tại hoàn thành)', '"I have built" — từ quá khứ tới bây giờ, kết quả vẫn còn giá trị.'],
  ['Past simple (quá khứ đơn)', '"I fixed", "I deployed" — việc đã xong ở một thời điểm xác định.'],
  ['Word stress (trọng âm từ)', 'Âm tiết được đọc to và dài hơn; nhấn sai thì người nghe khó nhận ra từ.'],
  ['Elevator pitch (lời giới thiệu thang máy)', 'Bản tóm tắt ngắn, chuẩn bị sẵn về bạn là ai và bạn muốn gì.'],
])}
${tomTat('vi', [
  'Dựng lời giới thiệu thành ba khối: hiện tại, quá khứ, tương lai — khoảng 60 giây.',
  'Dùng câu ngắn: chủ ngữ + động từ + một chi tiết; đừng bao giờ dịch từng chữ câu tiếng Việt dài.',
  'Nói rõ phần chính bạn làm và bạn dùng AI ra sao — trung thực làm các câu hỏi sau dễ hơn.',
  'Phát âm phụ âm cuối và đuôi -s/-ed; nói ở hai phần ba tốc độ.',
  'Bị ngắt lời thì trả lời câu hỏi rồi đi tiếp tự nhiên; đừng đọc lại từ đầu.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'interview-prep', bai: 'pv-2-1-gioi-thieu', title: 'IT Interview Prep 2.1 — "Giới thiệu về bản thân"', sub: 'Cùng câu trả lời bằng tiếng Việt, kèm giải thích vì sao chọn nội dung như vậy.' }),
  yt('8laYlyAFd0o', 'linguamarina', 'SELF INTRODUCTION — How to introduce yourself in English (confidently)', 13),
  nguon('🔊', 'YouGlish', 'Gõ một từ bất kỳ và nghe người thật nói từ đó trong hàng nghìn video YouTube.', 'https://youglish.com/'),
])}
</div>
`,
};

/* ═══════════════════════ 8.2 — Giải thích dự án bằng tiếng Anh ═══════════════════════ */
const KIEN_TRUC_EN = `
[1 · WHAT — one sentence]
cuongthai.com is a learning platform with courses, a project tracker like Jira,
and a desktop app. Real students use it every day.

[2 · ARCHITECTURE — follow one request]
When a user opens a page, the request first goes to nginx.
nginx sends page requests to the Next.js frontend
and API requests to the backend, which is Express with TypeScript.
The backend stores data in PostgreSQL through Prisma,
and it keeps images and videos in Cloudflare R2, which is object storage.
Everything runs in Docker containers on one Ubuntu server.

[3 · DEPLOYMENT]
I build the Docker images on a machine at home and push them to a registry.
The server only pulls the new images and swaps the containers.
After each deploy, a script checks the main API routes.

[4 · MY ROLE — honest]
I designed this setup and I run it. AI assistants wrote much of the code;
I reviewed it, deployed it and fixed the incidents.

[5 · ONE PROBLEM + RESULT]
Once, a new backend image crashed in a loop and the API was down for seven minutes.
The base image used one C library, but the database engine expected another.
I rolled back, fixed the Dockerfile, and added a check that runs
before every push, so the same mistake cannot reach the server again.

[6 · WHAT I WOULD IMPROVE]
Next, I want better monitoring, so I find problems before users do.
`;

const LABFLOW_EN = `
LabFlow AI is my capstone project. It helps a university lab manage its equipment:
students book devices, staff approve bookings, and sensors report device status.
I use Spring Boot for the backend, React for the frontend and PostgreSQL for the data.
I chose a modular monolith: one application, but each module has its own package
and talks to other modules only through interfaces.
I chose it because I work alone and I have twenty weeks;
microservices would add a lot of work without helping the users.
The project is still in progress. So far I have finished the booking module.
`;

const L82 = {
  title: '8.2 — Explaining a project in English: architecture, your role, one problem, the result|||8.2 — Giải thích dự án bằng tiếng Anh: kiến trúc, vai trò của bạn, một vấn đề, kết quả',
  slug: 'pv-8-2-du-an',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Khung sáu bước để kể một dự án bằng tiếng Anh đơn giản (làm gì → kiến trúc theo đường đi một request → deploy → vai trò thật → một sự cố + kết quả → cải tiến), bản mẫu cho cuongthai.com và LabFlow AI, 20 động từ quá khứ, câu nối, và câu dùng khi vẽ sơ đồ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Explaining a project in English — follow one request, then tell one problem</h2>
<p class="lead">After the introduction, the interviewer almost always says "Tell me more about this project." In English, the danger is not grammar — it is getting lost: you start with the database, jump to the login page, mention Docker, and two minutes later the listener has no picture. This lesson gives you a six-step route through any project and two full models, one for a large system you operate and one for a capstone you code by hand.</p>

<h3>An everyday picture: giving directions to your house</h3>
${doiThuong('en', 'When you give directions, you do not list every street in the city. You start from a place the listener knows ("from the main gate"), follow one path ("turn left at the pharmacy"), and stop at your door. Explaining architecture works the same way: start from the user, follow one request through the system, and stop where the data is stored. The listener builds the map in their head as you walk.')}

<h3>The six-step route</h3>
${flow([
  ['1 · What', 'one sentence: what it does and who uses it', '"It’s a learning platform. Students use it every day." No technology yet.'],
  ['2 · Architecture', 'follow ONE request from the user to the data', '"The request goes to… then… then…". Name each part once, with its job.'],
  ['3 · Deployment', 'how it reaches users', 'Where it runs, how a new version gets there, how you check it.'],
  ['4 · My role', 'what YOU did — honestly', '"I designed…", "I wrote…", "AI wrote much of…, I reviewed…".'],
  ['5 · One problem + result', 'a short STAR in English', 'What broke, why, what you did, what changed afterwards.'],
  ['6 · Improve', 'what you would do next', 'Shows you think beyond "it works".'],
])}

<h3>Model 1 — a system you operate</h3>
${ra(KIEN_TRUC_EN)}
<p>Count the sentence lengths: almost none is longer than fifteen words. Each technology appears once, with its job ("Cloudflare R2, which is object storage"). The incident is told in four sentences — situation, cause, action, result — which is all an interviewer needs before they ask follow-up questions.</p>

<h3>Model 2 — a capstone you code yourself</h3>
${ra(LABFLOW_EN)}
<p>Notice two phrases: "I chose X because…" (shows a decision, not only a tool) and "The project is still in progress. So far I have finished…" (honest about status). Never present a half-built project as finished; the next question will expose it.</p>

<h3>Twenty past-tense verbs that carry a project story</h3>
${bang(['Verb (past)', 'Meaning in a project', 'Example'], [
  ['built / designed', 'created a system or a part', 'I designed the database schema.'],
  ['wrote / implemented', 'wrote the code', 'I implemented the booking API.'],
  ['set up / configured', 'prepared tools or servers', 'I set up the CI pipeline.'],
  ['deployed / released', 'put a version online', 'We deployed every Friday.'],
  ['migrated / moved', 'changed to a new system', 'I migrated the files to object storage.'],
  ['fixed / debugged / investigated', 'found and solved a bug', 'I investigated the logs and fixed the bug.'],
  ['found out / noticed / realised', 'discovered something', 'I noticed the disk was almost full.'],
  ['reduced / improved / sped up', 'made something better', 'It reduced build time from about 15 to about 5 minutes.'],
  ['added / removed / replaced', 'changed a part', 'I added a check before each push.'],
  ['reviewed / tested / learned', 'checked, verified, gained', 'I reviewed every change before merging.'],
])}

<h3>Linking words — the glue between short sentences</h3>
${kv([
  ['First, … Then, … After that, …', 'Order of steps. Use them when following a request.'],
  ['because / so', '"because" gives a reason, "so" gives a result: "I work alone, so I chose a monolith."'],
  ['However, …', 'A contrast: "It worked locally. However, it crashed on the server."'],
  ['As a result, …', 'The outcome: "As a result, the same bug cannot reach production again."'],
  ['For example, …', 'Introduce one concrete case.'],
  ['To be honest, …', 'Before an honest limit: "To be honest, I haven’t load-tested it yet."'],
])}

<h3>When you draw while you talk</h3>
<p>In many interviews you can share a whiteboard or a screen. Useful lines: "Let me draw it quickly." · "This box is the frontend, this one is the API." · "The arrow means the API calls the database." · "Does this make sense so far?" Drawing reduces how much English you need — the picture does half the explaining.</p>
${bay('en', 'starting with the tech list ("We used React, Node, Postgres, Redis, Docker…").', 'A list of names gives no picture and invites "Why Redis?" for every item. Start with what the product does, then follow a request; mention a technology only at the moment it does its job.')}
${neu('en', 'the interviewer asks "Why did you choose PostgreSQL and not MongoDB?" and you did not really choose — the template came with it? Say so, then reason: "To be honest, the project started with PostgreSQL. Looking back, it fits, because our data has many relations — users, bookings, devices — and we need transactions." Honest plus reasoning beats an invented story.')}
${keXau('en', 'when you explain a real system in an interview, never share secrets: no server IP addresses, no API keys, no admin URLs, no customer data on screen. Interviewers do not need them, and screen recordings can leak. Say "a Linux server" instead of its address, and close your .env files before sharing your screen.')}

${thucHanh('en', { phut: '30', steps: [
  'Choose your main project and write the six steps in English, each step 1–4 short sentences.',
  'Underline every past-tense verb and check its -ed sound (/t/, /d/ or /ɪd/).',
  'Draw the architecture as 4–6 boxes on paper. Explain it out loud while pointing, in under two minutes, and record it.',
  'Listen and count how many times you said "and then… and then…". Replace half of them with First / After that / As a result.',
], dat: 'you have a two-minute recording that follows one request through your system, includes one problem with its result, and states your real role.' })}
${thuatNgu('en', [
  ['Architecture', 'How the parts of a system are arranged and talk to each other.'],
  ['Request', 'One message from a client (browser, app) asking the server to do something.'],
  ['Deploy / release', 'Put a new version where users can use it.'],
  ['Roll back', 'Return to the previous working version after a bad deploy.'],
  ['Modular monolith', 'One application split into well-separated modules.'],
  ['In progress', 'Not finished yet — say it honestly.'],
])}
${tomTat('en', [
  'Use the six-step route: what → architecture → deployment → my role → one problem → improve.',
  'Explain architecture by following one request from the user to the data.',
  'Keep sentences under about fifteen words; name each technology once, with its job.',
  'Use past-tense verbs and linking words to turn short sentences into a story.',
  'State your real role and the project’s real status; draw when you can.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-0-2-go-dia-chi', L: 'en', title: 'Networking 0.2 — What happens when you type a URL and press Enter', sub: 'The "follow one request" skill, taught in depth.' }),
  lienKet({ khoa: 'docker', bai: 'dk-6-2-chon-anh-nen', L: 'en', title: 'Docker 6.2 — Choosing a base image, and the musl trap', sub: 'The real cause behind the seven-minute outage in Model 1.' }),
  yt('JthcXAfxNh4', 'English express99', 'How to explain a project you worked on (Business English)', 38, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Giải thích dự án bằng tiếng Anh — đi theo một request, rồi kể một vấn đề</h2>
<p class="lead">Sau phần giới thiệu, người phỏng vấn gần như luôn nói "Tell me more about this project" (kể thêm về dự án này). Bằng tiếng Anh, mối nguy không nằm ở ngữ pháp — mà ở chỗ lạc đường: bạn bắt đầu từ database, nhảy sang trang đăng nhập, nhắc Docker, và hai phút sau người nghe không hình dung được gì. Bài này cho bạn một lộ trình sáu bước đi xuyên qua bất kỳ dự án nào, và hai bản mẫu đầy đủ: một cho hệ thống lớn bạn vận hành, một cho đồ án bạn tự code tay.</p>

<h3>Liên tưởng đời thường: chỉ đường về nhà</h3>
${doiThuong('vi', 'Khi chỉ đường, bạn không kể hết mọi con phố trong thành phố. Bạn bắt đầu từ chỗ người nghe biết ("từ cổng chính"), đi theo MỘT lối ("rẽ trái ở hiệu thuốc"), và dừng ở cửa nhà. Giải thích kiến trúc cũng vậy: bắt đầu từ người dùng, đi theo một request (yêu cầu) xuyên qua hệ thống, và dừng ở chỗ dữ liệu được lưu. Người nghe tự vẽ bản đồ trong đầu theo từng bước bạn đi.')}

<h3>Lộ trình sáu bước</h3>
${flow([
  ['1 · What (là gì)', 'một câu: nó làm gì, ai dùng', '"It’s a learning platform. Students use it every day." (Đó là nền tảng học tập, sinh viên dùng hằng ngày.) Chưa nói công nghệ.'],
  ['2 · Architecture (kiến trúc)', 'đi theo MỘT request từ người dùng tới dữ liệu', '"The request goes to… then… then…" (request đi tới… rồi… rồi…). Nêu mỗi phần đúng một lần, kèm nhiệm vụ của nó.'],
  ['3 · Deployment (triển khai)', 'nó tới tay người dùng thế nào', 'Chạy ở đâu, phiên bản mới tới đó bằng cách nào, bạn kiểm tra ra sao.'],
  ['4 · My role (vai trò của tôi)', 'CHÍNH BẠN làm gì — trung thực', '"I designed…" (tôi thiết kế), "I wrote…" (tôi viết), "AI wrote much of…, I reviewed…" (AI viết phần lớn…, tôi duyệt…).'],
  ['5 · One problem + result', 'một câu chuyện STAR ngắn bằng tiếng Anh', 'Cái gì hỏng, vì sao, bạn làm gì, sau đó thay đổi gì.'],
  ['6 · Improve (cải tiến)', 'bạn sẽ làm gì tiếp', 'Cho thấy bạn nghĩ xa hơn "chạy được là xong".'],
])}

<h3>Bản mẫu 1 — một hệ thống bạn vận hành</h3>
${ra(KIEN_TRUC_EN)}
<p>Giải nghĩa những câu then chốt:</p>
<ul>
<li>"When a user opens a page, the request first goes to nginx" = "khi người dùng mở một trang, request đi tới nginx đầu tiên". nginx là máy chủ đứng trước, chia đường.</li>
<li>"nginx sends page requests to the Next.js frontend and API requests to the backend" = "nginx gửi request trang cho frontend Next.js và request API cho backend".</li>
<li>"which is object storage" = "là kho lưu trữ đối tượng" — mẹo: thêm "which is…" để giải thích một tên riêng người nghe có thể chưa biết.</li>
<li>"The server only pulls the new images and swaps the containers" = "máy chủ chỉ kéo ảnh mới về và tráo container". "Swap" = tráo đổi.</li>
<li>"crashed in a loop" = "chết rồi khởi động lại liên tục". "The base image used one C library, but the database engine expected another" = "ảnh nền dùng một thư viện C, nhưng engine của database lại cần thư viện khác" (đây là sự cố thật: ảnh Alpine dùng musl, engine Prisma cần glibc).</li>
<li>"I rolled back" = "tôi quay về bản cũ". "so the same mistake cannot reach the server again" = "để cùng lỗi đó không thể tới máy chủ lần nữa".</li>
</ul>
<p>Đếm độ dài câu: gần như không câu nào quá mười lăm từ. Mỗi công nghệ xuất hiện một lần, kèm nhiệm vụ của nó. Sự cố được kể trong bốn câu — tình huống, nguyên nhân, hành động, kết quả — là đủ để người phỏng vấn bắt đầu hỏi đào sâu.</p>

<h3>Bản mẫu 2 — đồ án bạn tự code</h3>
${ra(LABFLOW_EN)}
<p>Để ý hai cụm: "I chose X because…" (tôi chọn X vì… — cho thấy một QUYẾT ĐỊNH, không chỉ một công cụ) và "The project is still in progress. So far I have finished…" (dự án vẫn đang làm; tới giờ tôi đã xong…). Đừng bao giờ trình bày một dự án làm dở như đã xong; câu hỏi tiếp theo sẽ lật tẩy ngay. "Modular monolith" = "khối nguyên khối chia mô-đun": một ứng dụng nhưng các phần tách bạch, gọi nhau qua interface.</p>

<h3>Hai mươi động từ quá khứ chở cả câu chuyện dự án</h3>
${bang(['Động từ (quá khứ)', 'Nghĩa trong dự án', 'Ví dụ'], [
  ['built / designed', 'xây / thiết kế một hệ thống hay một phần', 'I designed the database schema. (Tôi thiết kế lược đồ CSDL.)'],
  ['wrote / implemented', 'viết / cài đặt mã', 'I implemented the booking API. (Tôi viết API đặt lịch.)'],
  ['set up / configured', 'dựng / cấu hình công cụ, máy chủ', 'I set up the CI pipeline. (Tôi dựng pipeline CI.)'],
  ['deployed / released', 'đưa một phiên bản lên chạy thật', 'We deployed every Friday. (Chúng tôi deploy mỗi thứ Sáu.)'],
  ['migrated / moved', 'chuyển sang hệ thống mới', 'I migrated the files to object storage. (Tôi chuyển tệp sang kho đối tượng.)'],
  ['fixed / debugged / investigated', 'tìm và sửa lỗi / điều tra', 'I investigated the logs and fixed the bug. (Tôi xem log và sửa lỗi.)'],
  ['found out / noticed / realised', 'phát hiện ra', 'I noticed the disk was almost full. (Tôi để ý thấy đĩa gần đầy.)'],
  ['reduced / improved / sped up', 'giảm / cải thiện / tăng tốc', 'It reduced build time from about 15 to about 5 minutes.'],
  ['added / removed / replaced', 'thêm / bỏ / thay một phần', 'I added a check before each push. (Tôi thêm một bước kiểm trước mỗi lần đẩy.)'],
  ['reviewed / tested / learned', 'duyệt / kiểm thử / học được', 'I reviewed every change before merging. (Tôi duyệt mọi thay đổi trước khi gộp.)'],
])}

<h3>Từ nối — keo dán giữa các câu ngắn</h3>
${kv([
  ['First, … Then, … After that, …', 'Đầu tiên… Rồi… Sau đó… — thứ tự các bước, dùng khi đi theo một request.'],
  ['because / so', '"because" (vì) đưa lý do, "so" (nên) đưa kết quả: "I work alone, so I chose a monolith." (Tôi làm một mình nên chọn monolith.)'],
  ['However, …', 'Tuy nhiên — đối lập: "It worked locally. However, it crashed on the server." (Chạy được ở máy tôi. Tuy nhiên lại chết trên server.)'],
  ['As a result, …', 'Kết quả là — nêu hệ quả cuối.'],
  ['For example, …', 'Ví dụ — dẫn vào một trường hợp cụ thể.'],
  ['To be honest, …', 'Thật lòng mà nói — trước một giới hạn thật: "To be honest, I haven’t load-tested it yet." (Thật ra tôi chưa test tải.)'],
])}

<h3>Khi vừa vẽ vừa nói</h3>
<p>Nhiều buổi phỏng vấn cho bạn chia sẻ bảng trắng hoặc màn hình. Câu dùng được: "Let me draw it quickly." (để tôi vẽ nhanh) · "This box is the frontend, this one is the API." (ô này là frontend, ô này là API) · "The arrow means the API calls the database." (mũi tên nghĩa là API gọi CSDL) · "Does this make sense so far?" (tới đây anh/chị theo kịp không?). Vẽ giúp bạn cần ít tiếng Anh hơn — bức hình làm thay một nửa phần giải thích.</p>
${bay('vi', 'mở đầu bằng danh sách công nghệ ("We used React, Node, Postgres, Redis, Docker…").', 'Một dãy tên không tạo ra hình ảnh nào và mời gọi câu "Vì sao lại Redis?" cho từng món. Hãy bắt đầu bằng việc sản phẩm làm gì, rồi đi theo một request; chỉ nhắc một công nghệ đúng lúc nó làm việc của nó.')}
${neu('vi', 'người phỏng vấn hỏi "Why did you choose PostgreSQL and not MongoDB?" (sao chọn PostgreSQL mà không MongoDB?) trong khi bạn không thật sự chọn — bộ khung có sẵn nó? Cứ nói thật, rồi lập luận: "To be honest, the project started with PostgreSQL. Looking back, it fits, because our data has many relations — users, bookings, devices — and we need transactions." (Thật ra dự án bắt đầu với PostgreSQL. Nhìn lại thì nó hợp, vì dữ liệu có nhiều quan hệ và cần giao dịch.) Trung thực + lập luận thắng một câu chuyện bịa.')}
${keXau('vi', 'khi giải thích một hệ thống thật trong buổi phỏng vấn, đừng bao giờ để lộ bí mật: không địa chỉ IP máy chủ, không khoá API, không đường dẫn trang quản trị, không dữ liệu người dùng trên màn hình. Người phỏng vấn không cần những thứ đó, và bản ghi màn hình có thể bị lộ. Nói "a Linux server" thay vì địa chỉ của nó, và đóng các tệp .env trước khi chia sẻ màn hình.')}

${thucHanh('vi', { phut: '30', steps: [
  'Chọn dự án chính và viết sáu bước bằng tiếng Anh, mỗi bước 1–4 câu ngắn.',
  'Gạch chân mọi động từ quá khứ và kiểm cách đọc đuôi -ed (/t/, /d/ hay /ɪd/).',
  'Vẽ kiến trúc thành 4–6 ô trên giấy. Vừa chỉ tay vừa giải thích thành tiếng trong dưới hai phút, và ghi âm.',
  'Nghe lại và đếm số lần bạn nói "and then… and then…". Thay một nửa bằng First / After that / As a result.',
], dat: 'bạn có bản ghi hai phút đi theo một request xuyên hệ thống, có một vấn đề kèm kết quả, và nói đúng vai trò thật của bạn.' })}
${thuatNgu('vi', [
  ['Architecture (kiến trúc)', 'Cách các phần của hệ thống được sắp xếp và nói chuyện với nhau.'],
  ['Request (yêu cầu)', 'Một thông điệp từ client (trình duyệt, app) nhờ máy chủ làm một việc.'],
  ['Deploy / release (triển khai / phát hành)', 'Đưa một phiên bản mới tới chỗ người dùng dùng được.'],
  ['Roll back (quay lui)', 'Trở về phiên bản chạy tốt trước đó sau một lần deploy hỏng.'],
  ['Modular monolith (nguyên khối chia mô-đun)', 'Một ứng dụng chia thành các mô-đun tách bạch.'],
  ['In progress (đang làm)', 'Chưa xong — nói thật như vậy.'],
])}
${tomTat('vi', [
  'Dùng lộ trình sáu bước: là gì → kiến trúc → triển khai → vai trò → một vấn đề → cải tiến.',
  'Giải thích kiến trúc bằng cách đi theo một request từ người dùng tới dữ liệu.',
  'Giữ câu dưới khoảng mười lăm từ; nêu mỗi công nghệ một lần, kèm nhiệm vụ của nó.',
  'Dùng động từ quá khứ và từ nối để biến câu ngắn thành một câu chuyện.',
  'Nói đúng vai trò thật và tình trạng thật của dự án; vẽ khi có thể.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-0-2-go-dia-chi', title: 'Networking 0.2 — Chuyện gì xảy ra khi bạn gõ URL và nhấn Enter', sub: 'Kỹ năng "đi theo một request", dạy kỹ.' }),
  lienKet({ khoa: 'docker', bai: 'dk-6-2-chon-anh-nen', title: 'Docker 6.2 — Chọn ảnh nền, và cái bẫy musl', sub: 'Nguyên nhân thật của sự cố bảy phút trong Bản mẫu 1.' }),
  yt('JthcXAfxNh4', 'English express99', 'How to explain a project you worked on (Business English)', 38),
])}
</div>
`,
};

/* ═══════════════════════ 8.3 — Từ vựng kỹ thuật hay vấp ═══════════════════════ */
// [từ, IPA gần đúng, đọc kiểu Việt (CHỮ HOA = âm nhấn), lỗi hay gặp, câu ví dụ]
const TU = [
  ['cache', '/kæʃ/', 'KÉT (như "cash")', '"ca-chê", "cát-chơ"', 'We cache the course list for five minutes.'],
  ['queue', '/kjuː/', 'KIU (như chữ Q)', '"kiu-ơ", "quơ-ê"', 'Emails go into a queue and a worker sends them.'],
  ['SQL', '/ˌes.kjuːˈel/ or /ˈsiː.kwəl/', 'ét-kiu-EO hoặc XI-quồ', 'cả hai đều được — chọn một, dùng nhất quán', 'I wrote the SQL query by hand.'],
  ['PostgreSQL', '/ˈpoʊst.ɡres.kjuː.el/', 'PÂUS-grét-ét-kiu-eo (gọn: "Postgres")', '"pốt-xờ-grê"', 'Our data is in PostgreSQL.'],
  ['Linux', '/ˈlɪn.ʊks/', 'LÍN-nớcx', '"lai-nớt"', 'The server runs Linux.'],
  ['nginx', '/ˈen.dʒɪn.eks/', 'EN-jin-éch (engine-x)', '"en-gin-xơ", "ngin-x"', 'nginx sits in front of the API.'],
  ['Kubernetes', '/ˌkuː.bərˈnet.iːz/', 'ku-bơ-NÉT-tìz', '"kiu-bơ-nét", "ku-bê-nê-tét"', 'I have not used Kubernetes in production.'],
  ['Docker', '/ˈdɑː.kər/', 'ĐÓC-cờ', '"đô-kơ" kéo dài', 'Everything runs in Docker.'],
  ['Git', '/ɡɪt/', 'GHÍT (g cứng)', '"dzít"', 'I use Git every day.'],
  ['JSON', '/ˈdʒeɪ.sən/', 'DZÂY-xần', '"giây-sôn" (vẫn hiểu được)', 'The API returns JSON.'],
  ['Azure', '/ˈæʒ.ər/', 'Á-giờ', '"a-du-rơ"', 'They host it on Azure.'],
  ['API', '/ˌeɪ.piːˈaɪ/', 'ây-pi-AI', '"a-pi"', 'I designed the booking API.'],
  ['GUI', '/ˈɡuː.i/', 'GÚ-i', '"gờ-u-i"', 'It is a GUI tool for Git.'],
  ['Redis', '/ˈred.ɪs/', 'RÉ-đix', '"rê-đi"', 'Sessions are stored in Redis.'],
  ['schema', '/ˈskiː.mə/', 'XKÍ-mờ', '"sê-ma", "sơ-chê-ma"', 'I changed the database schema.'],
  ['query', '/ˈkwɪr.i/', 'QUÍA-ri', '"quơ-ry"', 'This query was slow.'],
  ['deploy', '/dɪˈplɔɪ/', 'đi-PLÓI (nhấn âm 2)', '"ĐÊ-ploi"', 'We deploy twice a week.'],
  ['debug', '/diːˈbʌɡ/', 'đi-BẤG', '"đê-búc"', 'I debugged it with the logs.'],
  ['develop / developer', '/dɪˈvel.əp/', 'đi-VE-lợp / đi-VE-lợp-pờ', '"ĐÊ-vơ-lốp"', 'I am a backend developer.'],
  ['architecture', '/ˈɑːr.kə.tek.tʃər/', 'A-kờ-téc-chờ (ch = k)', '"a-chi-tếch", nhấn sai âm 3', 'Let me explain the architecture.'],
  ['algorithm', '/ˈæl.ɡə.rɪð.əm/', 'ÁL-gờ-ri-thờm', '"an-go-rít"', 'The algorithm is O(n log n).'],
  ['asynchronous', '/eɪˈsɪŋ.krə.nəs/', 'ây-XÍNG-krơ-nợx', '"a-sin-crô-nớt"', 'Node handles I/O asynchronously.'],
  ['authentication', '/ɔːˌθen.tɪˈkeɪ.ʃən/', 'o-then-ti-KÊI-shần', 'nhấn âm đầu', 'Authentication checks who you are.'],
  ['authorization', '/ˌɔː.θər.əˈzeɪ.ʃən/', 'o-thờ-rờ-DÊI-shần', 'lẫn với authentication', 'Authorization checks what you may do.'],
  ['integer', '/ˈɪn.tɪ.dʒər/', 'IN-tơ-giờ', '"in-tê-gơ" (g cứng)', 'The id is an integer.'],
  ['variable', '/ˈver.i.ə.bəl/', 'VE-ri-ờ-bồ', '"va-ri-a-bồ"', 'Store it in an environment variable.'],
  ['method', '/ˈmeθ.əd/', 'MÉ-thờd', '"mê-tốt"', 'This method returns a list.'],
  ['module', '/ˈmɑː.dʒuːl/', 'MÁ-giun', '"mô-đun" kiểu Việt', 'Each module has its own package.'],
  ['component', '/kəmˈpoʊ.nənt/', 'kờm-PÂU-nần', '"com-pô-nen"', 'I split the page into components.'],
  ['suite (test suite)', '/swiːt/', 'XUÝT (như "sweet")', '"xút" như "suit"', 'The test suite takes two minutes.'],
  ['tuple', '/ˈtuː.pəl/', 'TU-pồ', '"tấp-lê"', 'The function returns a tuple.'],
  ['daemon', '/ˈdiː.mən/', 'ĐI-mần', '"đê-mon"', 'The Docker daemon was not running.'],
  ['sudo', '/ˈsuː.duː/', 'XU-đu', '"xu-đô"', 'You need sudo to install it.'],
  ['Ubuntu', '/ʊˈbʊn.tuː/', 'u-BUN-tu', '"u-bun-tu" đều giọng', 'The server is Ubuntu 24.04.'],
  ['Vite', '/viːt/', 'VÍT (tiếng Pháp: nhanh)', '"vai-tơ"', 'The frontend is built with Vite.'],
  ['Vue', '/vjuː/', 'VIU (như "view")', '"vu-ê"', 'I have not used Vue yet.'],
  ['char', '/tʃɑːr/', 'CHA', '"ca", "sa"', 'A char is one character.'],
  ['boolean', '/ˈbuː.li.ən/', 'BU-li-ần', '"bô-lê-an"', 'isActive is a boolean.'],
  ['null', '/nʌl/', 'NÂL', '"nun", "nu-lờ"', 'The value was null.'],
  ['enum', '/ˈiː.nʌm/', 'I-nâm', '"ê-num"', 'Status is an enum with four values.'],
  ['cookie', '/ˈkʊk.i/', 'CÚC-ki', '"cu-ki"', 'The token is in an HttpOnly cookie.'],
  ['token', '/ˈtoʊ.kən/', 'TÂU-kần', '"tô-ken"', 'The access token expires in 15 minutes.'],
  ['thread', '/θred/', 'THRÉD (lưỡi giữa răng)', '"thờ-rét", "tret"', 'Node runs your code on one thread.'],
  ['width', '/wɪdθ/', 'UÝT-th', '"uých"', 'Set the width to 100%.'],
  ['regex', '/ˈreɡ.eks/', 'RÉ-ghéch', '"rê-gết"', 'I validated it with a regex.'],
  ['Python', '/ˈpaɪ.θɑːn/', 'PAI-thon', '"pi-tông"', 'I used Python for the script.'],
  ['Kafka', '/ˈkɑːf.kə/', 'CÁP-kờ', '"ka-fa-ka"', 'They use Kafka for events.'],
  ['Jira', '/ˈdʒɪr.ə/', 'DZI-rờ', '"gi-ra"', 'Tasks are tracked in Jira.'],
  ['Agile', '/ˈædʒ.əl/', 'Á-giồ', '"a-gai", "a-gin"', 'We work in an Agile team.'],
  ['framework', '/ˈfreɪm.wɝːk/', 'FRÊIM-uơk', '"fram-uốc"', 'Spring Boot is a framework.'],
];

const L83 = {
  title: '8.3 — Technical vocabulary that trips people up: 50 words, how to say them, how to use them|||8.3 — Từ vựng kỹ thuật hay vấp: 50 từ, đọc thế nào, dùng ra sao',
  slug: 'pv-8-3-ky-thuat',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Năm mươi từ kỹ thuật người Việt hay đọc sai (cache, queue, SQL, nginx, Kubernetes, PostgreSQL, JSON, Azure, schema, deploy, architecture…) kèm phiên âm, cách đọc gần đúng kiểu Việt, lỗi hay gặp và câu ví dụ; ba quy tắc trọng âm; cách tự kiểm bằng YouGlish; và những cặp từ hay nhầm nghĩa.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Technical vocabulary that trips people up — say it so the interviewer recognises it</h2>
<p class="lead">Most Vietnamese developers read English documentation every day but rarely say the words out loud. The result is a private pronunciation — "ca-chê" for cache, "lai-nớt" for Linux — that sounds fine in your head and is unrecognisable to an interviewer. Fixing about fifty words removes most of that friction. This lesson lists them, gives three stress rules, and shows a free way to check any word in ten seconds.</p>

<h3>An everyday picture: a phone number with one wrong digit</h3>
${doiThuong('en', 'If you read a phone number aloud and one digit is wrong, the call does not reach "almost" the right person — it fails. Technical words work the same way in conversation: "ca-chê" is not "almost cache"; the listener simply does not connect it to the word. One word fixed is one sentence understood.')}

<h3>Three rules that fix most words</h3>
${flow([
  ['1 · Stress', 'say one syllable louder and longer', 'de-PLOY, de-VEL-op, AR-chi-tec-ture, AL-go-rithm. Wrong stress hurts more than an imperfect vowel.'],
  ['2 · Final sounds', 'say the last consonant', 'cache ends in /ʃ/, Git in /t/, method in /d/, width in /θ/. Vietnamese habit drops them.'],
  ['3 · Letters are not sounds', 'English spelling lies', 'queue = /kjuː/, suite = /swiːt/, daemon = /ˈdiː.mən/, architecture with ch = /k/. Check unfamiliar words; do not guess from spelling.'],
])}

<h3>The fifty words</h3>
<p>IPA is a guide; the right-hand column is an example sentence you can actually use in an interview. Listen to each word on YouGlish before trusting your reading of the IPA.</p>
${bang(['Word', 'IPA (approx.)', 'Common mistake', 'Example sentence'], TU.map(([w, ipa, , sai, vd]) => ['<strong>' + w + '</strong>', ipa, sai, vd]))}

<h3>Words that are spelled the same as acronyms — both are fine</h3>
<p>Some names have two accepted readings: SQL ("S-Q-L" or "sequel"), GIF (hard or soft g), data ("day-ta" or "da-ta"), route ("root" or "rowt"). Pick one and keep it; consistency matters more than which one. When the interviewer uses the other, do not correct them.</p>

<h3>Pairs that are easy to mix up in meaning</h3>
${kv([
  ['authentication vs authorization', 'Who you are vs what you are allowed to do. Mixing them is a common technical mistake too.'],
  ['argument vs parameter', 'The value you pass vs the name in the function definition.'],
  ['library vs framework', 'You call a library; a framework calls your code.'],
  ['deploy vs release', 'Deploy = put it on servers; release = make it available to users (sometimes the same moment).'],
  ['latency vs throughput', 'How long one request takes vs how many requests per second.'],
  ['concurrency vs parallelism', 'Handling many things at once (interleaved) vs doing many at the same instant (several cores).'],
])}
${bay('en', 'spending your study time on rare words before fixing the common ones.', 'Interviewers will say "cache", "query", "deploy" and "architecture" in the first ten minutes; they will rarely say "idempotency". Fix the fifty words in this lesson first — they are most of what you will hear and say.')}
${neu('en', 'you are in the middle of an answer and realise you do not know how to say a word? Spell it or describe it: "the… the reverse proxy, nginx, N-G-I-N-X". Interviewers are engineers; they read these words every day and will recognise the spelling instantly. Then keep going — a pause for one word is nothing.')}
${keXau('en', 'pronunciation apps and "AI accent coaches" often ask for microphone access and your contacts or photos. Before installing, check what permissions the app requests and who publishes it; a free website like YouGlish needs no permission at all. Never record mock interviews that include company documents or colleagues’ voices in an app you do not trust.')}

${thucHanh('en', { phut: '15 per day × 3 days', steps: [
  'Day 1: open YouGlish and listen to the first 20 words, three clips each. Mark every word you were saying differently.',
  'Day 2: the next 30 words, same method. Make a list of your 10 worst words.',
  'Day 3: record yourself reading the 10 example sentences of your worst words. Compare with YouGlish and re-record until each word is recognisable.',
], dat: 'your list of 10 hardest words is recorded correctly, and a friend (or a speech-to-text app) recognises each word in its example sentence.' })}
${thuatNgu('en', [
  ['IPA', 'International Phonetic Alphabet — one symbol per sound.'],
  ['Stress', 'The syllable said louder and longer.'],
  ['Final consonant', 'The last consonant sound of a word, often dropped by Vietnamese speakers.'],
  ['Acronym', 'A word made of initials: API, SQL, JSON.'],
  ['YouGlish', 'A site that plays real YouTube clips of people saying a word.'],
  ['Speech-to-text', 'Software that writes what you say — a cheap pronunciation check.'],
])}
${tomTat('en', [
  'A mispronounced technical word is not "almost right"; the listener does not recognise it.',
  'Three rules fix most words: stress the right syllable, say final consonants, do not trust spelling.',
  'Learn the fifty words here first; they cover most of what you will hear in an interview.',
  'For words with two accepted readings, pick one and stay consistent.',
  'If stuck mid-answer, spell the word and continue.',
])}
${lienQuan('en', [
  yt('-qWiBtYY04A', 'Accent’s Way English with Hadar', 'The Most Mispronounced Words in Tech (part 1)', 6, 'en'),
  nguon('🔊', 'YouGlish', 'Hear any word in real speech, with accent filters (US, UK, AUS).', 'https://youglish.com/'),
  lienKet({ khoa: 'authentication', bai: 'auth-9-1-phan-quyen-la-gi', L: 'en', title: 'Authentication 9.1 — Where authentication ends and authorization begins', sub: 'The most important "pair that is easy to mix up", taught properly.' }),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Từ vựng kỹ thuật hay vấp — đọc sao cho người phỏng vấn nhận ra</h2>
<p class="lead">Phần lớn lập trình viên Việt đọc tài liệu tiếng Anh mỗi ngày nhưng hiếm khi nói các từ đó thành tiếng. Kết quả là một kiểu phát âm "riêng" — "ca-chê" cho cache, "lai-nớt" cho Linux — nghe trong đầu thì ổn mà người phỏng vấn không nhận ra. Sửa khoảng năm mươi từ là gỡ được phần lớn chỗ vướng đó. Bài này liệt kê chúng, đưa ba quy tắc trọng âm, và chỉ một cách miễn phí kiểm bất kỳ từ nào trong mười giây.</p>

<h3>Liên tưởng đời thường: số điện thoại sai một chữ số</h3>
${doiThuong('vi', 'Nếu bạn đọc một số điện thoại mà sai một chữ số, cuộc gọi không tới "gần đúng" người cần gọi — nó hỏng hẳn. Từ kỹ thuật trong hội thoại cũng vậy: "ca-chê" không phải "gần như cache"; người nghe đơn giản là không nối được nó với từ nào. Sửa đúng một từ là thêm một câu được hiểu.')}

<h3>Ba quy tắc sửa được phần lớn các từ</h3>
${flow([
  ['1 · Trọng âm', 'đọc một âm tiết to và dài hơn', 'đi-PLÓI (deploy), đi-VE-lợp (develop), A-kờ-téc-chờ (architecture), ÁL-gờ-ri-thờm (algorithm). Nhấn sai trọng âm hại hơn đọc nguyên âm chưa chuẩn.'],
  ['2 · Âm cuối', 'phát âm phụ âm cuối', 'cache kết thúc bằng /ʃ/ (như "sh"), Git bằng /t/, method bằng /d/, width bằng /θ/. Thói quen tiếng Việt hay bỏ chúng.'],
  ['3 · Chữ không phải âm', 'chính tả tiếng Anh "nói dối"', 'queue đọc /kjuː/ ("kiu"), suite đọc /swiːt/ ("xuýt"), daemon đọc "đi-mần", architecture có "ch" đọc là /k/. Từ lạ thì kiểm, đừng đoán theo mặt chữ.'],
])}

<h3>Năm mươi từ</h3>
<p>Cột "đọc kiểu Việt" chỉ GẦN đúng, để bạn có điểm bám — CHỮ HOA là âm tiết được nhấn. Luôn nghe bản gốc trên YouGlish trước khi tin cách mình đọc. Cột cuối là câu ví dụ bạn dùng được ngay trong buổi phỏng vấn.</p>
${bang(['Từ', 'Đọc kiểu Việt (gần đúng)', 'Lỗi hay gặp', 'Câu ví dụ'], TU.map(([w, , viet, sai, vd]) => ['<strong>' + w + '</strong>', viet, sai, vd]))}

<h3>Từ có hai cách đọc đều được chấp nhận</h3>
<p>Một số tên có hai cách đọc đều đúng: SQL ("ét-kiu-eo" hoặc "xi-quồ"), GIF (g cứng hoặc mềm), data ("đây-tờ" hoặc "đa-tờ"), route ("rút" hoặc "rao-t"). Chọn một và giữ nguyên; nhất quán quan trọng hơn chọn cách nào. Khi người phỏng vấn dùng cách kia, đừng sửa họ.</p>

<h3>Những cặp từ dễ nhầm NGHĨA</h3>
${kv([
  ['authentication vs authorization', 'Xác thực (bạn là ai) vs phân quyền (bạn được làm gì). Nhầm hai từ này cũng là lỗi kỹ thuật hay gặp.'],
  ['argument vs parameter', 'Giá trị bạn truyền vào (đối số) vs tên trong định nghĩa hàm (tham số).'],
  ['library vs framework', 'Bạn gọi thư viện; framework gọi code của bạn.'],
  ['deploy vs release', 'Deploy = đưa lên máy chủ; release = mở cho người dùng dùng (đôi khi cùng một lúc).'],
  ['latency vs throughput', 'Một request mất bao lâu (độ trễ) vs mỗi giây xử lý bao nhiêu request (thông lượng).'],
  ['concurrency vs parallelism', 'Xử lý nhiều việc xen kẽ (đồng thời) vs làm nhiều việc đúng cùng một khoảnh khắc trên nhiều nhân (song song).'],
])}
${bay('vi', 'dồn thời gian học từ hiếm trước khi sửa từ phổ biến.', 'Người phỏng vấn sẽ nói "cache", "query", "deploy", "architecture" ngay mười phút đầu; họ hiếm khi nói "idempotency". Sửa năm mươi từ trong bài này trước — chúng là phần lớn những gì bạn sẽ nghe và nói.')}
${neu('vi', 'đang trả lời dở thì bạn nhận ra mình không biết đọc một từ? Đánh vần hoặc mô tả nó: "the… the reverse proxy, nginx, N-G-I-N-X". Người phỏng vấn là kỹ sư; họ đọc những từ này hằng ngày và nhận ra chính tả ngay. Rồi nói tiếp — dừng một nhịp vì một từ chẳng là gì cả.')}
${keXau('vi', 'nhiều app luyện phát âm và "AI sửa giọng" đòi quyền micro kèm danh bạ hay ảnh. Trước khi cài, xem app xin những quyền gì và ai phát hành; một trang miễn phí như YouGlish không cần quyền nào. Đừng bao giờ ghi âm buổi phỏng vấn thử có tài liệu công ty hay giọng đồng nghiệp trong một app bạn không tin.')}

${thucHanh('vi', { phut: '15 mỗi ngày × 3 ngày', steps: [
  'Ngày 1: mở YouGlish, nghe 20 từ đầu, mỗi từ ba đoạn. Đánh dấu mọi từ bạn vẫn đọc khác.',
  'Ngày 2: 30 từ còn lại, cùng cách. Lập danh sách 10 từ bạn đọc tệ nhất.',
  'Ngày 3: ghi âm bạn đọc 10 câu ví dụ của 10 từ đó. So với YouGlish và ghi lại tới khi từng từ nghe ra được.',
], dat: '10 từ khó nhất của bạn đã được ghi âm đúng, và một người bạn (hoặc app chuyển giọng nói thành chữ) nhận ra từng từ trong câu ví dụ của nó.' })}
${thuatNgu('vi', [
  ['IPA (bảng phiên âm quốc tế)', 'Mỗi ký hiệu là một âm.'],
  ['Stress (trọng âm)', 'Âm tiết được đọc to và dài hơn.'],
  ['Final consonant (phụ âm cuối)', 'Âm phụ âm cuối của từ, người Việt hay bỏ.'],
  ['Acronym (từ viết tắt)', 'Từ ghép từ chữ cái đầu: API, SQL, JSON.'],
  ['YouGlish', 'Trang phát đoạn YouTube thật có người nói đúng từ bạn gõ.'],
  ['Speech-to-text (chuyển giọng thành chữ)', 'Phần mềm viết ra điều bạn nói — cách kiểm phát âm rẻ tiền.'],
])}
${tomTat('vi', [
  'Một từ kỹ thuật đọc sai không phải "gần đúng"; người nghe không nhận ra nó.',
  'Ba quy tắc sửa phần lớn các từ: nhấn đúng âm tiết, đọc âm cuối, đừng tin chính tả.',
  'Học năm mươi từ ở đây trước; chúng phủ phần lớn những gì bạn nghe trong buổi phỏng vấn.',
  'Từ có hai cách đọc đúng thì chọn một và giữ nhất quán.',
  'Bí giữa câu thì đánh vần từ đó rồi nói tiếp.',
])}
${lienQuan('vi', [
  yt('-qWiBtYY04A', 'Accent’s Way English with Hadar', 'The Most Mispronounced Words in Tech (part 1)', 6),
  nguon('🔊', 'YouGlish', 'Nghe bất kỳ từ nào trong lời nói thật, lọc theo giọng Mỹ, Anh, Úc.', 'https://youglish.com/'),
  lienKet({ khoa: 'authentication', bai: 'auth-9-1-phan-quyen-la-gi', title: 'Authentication 9.1 — Xác thực kết thúc ở đâu, phân quyền bắt đầu ở đâu', sub: 'Cặp từ "dễ nhầm" quan trọng nhất, dạy cho đến nơi.' }),
])}
</div>
`,
};

/* ═══════════════════════ 8.4 — Khi không hiểu câu hỏi ═══════════════════════ */
const CUU_EN = `
ASK TO REPEAT
  Sorry, could you repeat the question, please?
  Could you say that a bit more slowly, please?
  Sorry, the connection cut out. Could you say the last part again?

CHECK YOU UNDERSTOOD (paraphrase)
  Just to make sure I understand — you're asking how I would make this API faster, right?
  So the question is about the database, not the cache. Is that correct?
  What do you mean by "consistency" here — in the database, or between services?

BUY TIME (honest, 5-10 seconds)
  That's a good question. Let me think for a moment.
  Let me think about this step by step.
  Can I take a few seconds to organise my answer?

WHEN YOU DON'T KNOW
  I haven't used Kafka yet, but I've used a Redis queue, which is similar because...
  I'm not 100% sure, but I think it works like this...
  I don't know the exact answer. Here is how I would find out: ...

CORRECT YOURSELF
  Sorry, let me rephrase that.
  Actually, I meant "authorization", not "authentication".
  Let me go back one step.
`;

const L84 = {
  title: '8.4 — When you do not understand the question: ask, paraphrase, buy time, say "I don’t know, but…"|||8.4 — Khi không hiểu câu hỏi: xin nhắc lại, diễn đạt lại để xác nhận, mua thời gian, nói "em chưa biết, nhưng…"',
  slug: 'pv-8-4-khi-khong-hieu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Năm nhóm câu cứu nguy khi phỏng vấn tiếng Anh: xin nhắc lại, diễn đạt lại để xác nhận, mua thời gian một cách trung thực, nói "chưa biết nhưng…" kèm hướng suy luận, và tự sửa khi nói nhầm — có giải nghĩa từng câu, quy trình 4 bước, và lúc nào được xin chuyển sang tiếng Việt.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>When you do not understand the question — the five rescue moves</h2>
<p class="lead">In an English interview, the most dangerous moment is not a hard question. It is a question you did not fully catch — and then answer anyway, by guessing. Answering the wrong question looks like a knowledge gap; asking to repeat looks like care. This lesson gives you ready-made sentences for five situations, so that not understanding becomes a normal, two-second step instead of a panic.</p>

<h3>An everyday picture: the pharmacy</h3>
${doiThuong('en', 'When a pharmacist explains how to take a medicine and you miss a word, you do not guess — you ask "twice a day or three times?", because a wrong guess has a cost. Nobody thinks you are stupid for checking. Interviews are the same: checking the question is what careful engineers do with unclear requirements every day.')}

<h3>The four-step routine</h3>
${flow([
  ['1 · Listen', 'to the end, keywords on paper', 'Write two or three keywords while they speak (for example "API · slow · many users"). Do not start forming your answer yet.'],
  ['2 · Check', 'repeat or paraphrase', 'If anything is unclear, ask to repeat; if you think you understood, paraphrase it back in one sentence.'],
  ['3 · Pause', 'a few honest seconds', 'Say that you are thinking. Silence with a sentence before it is fine; silence without one feels like freezing.'],
  ['4 · Answer', 'structure first, then detail', '"There are two parts to this. First… Second…" — the structure helps you and the listener.'],
])}

<h3>Sentences for the five situations</h3>
${ra(CUU_EN)}
${bay('en', 'answering "Yes" to a question you did not understand, to avoid looking weak.', 'It is the most expensive mistake in the chapter. The interviewer now discusses something you do not follow, and the gap grows with every minute. One "Sorry, could you repeat that?" costs three seconds.')}

<h3>"I don’t know, but…" — turning a gap into evidence</h3>
<p>Interviewers often push until they find the edge of your knowledge — that is how they measure depth. When you reach it, the worst answers are silence or bluffing. The best answer has three parts: admit, connect, reason.</p>
${stack([
  ['Admit', '"I haven’t used Kafka in a project."'],
  ['Connect', '"But I’ve used a Redis queue with background workers, which solves a similar problem."'],
  ['Reason', '"So I would expect Kafka to keep messages on disk, let several consumers read them, and… I would check the documentation for how it handles ordering."'],
])}
<p>This answer shows honesty, related experience and the ability to reason — three of the five signals from Lesson 0.8 — from a question you could not answer.</p>
${neu('en', 'the interviewer is Vietnamese, at a Vietnamese company, and the interview switched to English only to check your level? After you have shown that you can try, it is acceptable to ask politely: "Would it be okay if I explain this technical part in Vietnamese, so I can be more precise?" Many will agree. Do not do this in the first minutes, and never with a foreign interviewer.')}
${keXau('en', 'a fake "HR" calling from an unknown number may speak fast English or mix languages to rush you into sharing information: your ID number, a one-time code "to verify the interview", or bank details "for the allowance". Use the same rescue move — "Sorry, could you repeat that? Who is calling and from which company?" — then hang up and call back using the number on the company’s official website. A real recruiter never needs an OTP.')}

<h3>Correcting yourself is a strength</h3>
<p>Everyone misspeaks under pressure. "Actually, I meant authorization, not authentication" shows that you notice your own errors — exactly what a code reviewer does. Correct the word, then continue; do not apologise three times.</p>

${thucHanh('en', { phut: '20', steps: [
  'Copy the five groups of sentences onto one card or one phone note.',
  'Ask a friend to read you five technical questions in English quickly, without repeating (use questions from Chapter 4 or 5).',
  'For each question: use at least one rescue sentence, paraphrase the question, then answer with "There are two parts…".',
  'For one question you really cannot answer, use admit → connect → reason.',
], dat: 'you used every one of the five groups at least once in a recorded practice, and none of your answers started before you had checked the question.' })}
${thuatNgu('en', [
  ['Paraphrase', 'Say the same meaning in other words — to check you understood.'],
  ['Clarifying question', 'A question that removes ambiguity before you answer.'],
  ['Buy time', 'Gain a few seconds honestly to organise your answer.'],
  ['Bluff', 'Pretend to know — easy to detect and costly.'],
  ['OTP (one-time password)', 'A short code for one login or payment — never share it.'],
])}
${tomTat('en', [
  'Answering the wrong question looks worse than asking to repeat it.',
  'Routine: listen with keywords → check (repeat or paraphrase) → pause honestly → answer with structure.',
  'At the edge of your knowledge: admit, connect to what you know, reason out loud.',
  'Switching to Vietnamese is sometimes acceptable with a Vietnamese interviewer — ask politely, and not first.',
  'Correct yourself once, clearly, and continue.',
])}
${lienQuan('en', [
  yt('ZqNorUIgIe8', 'Jeff Su', 'How to Answer an Interview Question you DIDN’T Prepare For', 7, 'en'),
  lienKet({ khoa: 'interview-prep', bai: 'pv-7-2-live-coding', L: 'en', title: 'IT Interview Prep 7.2 — Live coding and pair programming', sub: 'The same "check the question first" habit, applied to coding problems.' }),
  nguon('📘', 'Tech Interview Handbook — Behavioral interviews', 'Free guide with sample phrasing for difficult questions.', 'https://www.techinterviewhandbook.org/behavioral-interview/'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Khi không hiểu câu hỏi — năm nước đi cứu nguy</h2>
<p class="lead">Trong buổi phỏng vấn tiếng Anh, khoảnh khắc nguy hiểm nhất không phải câu hỏi khó. Mà là câu hỏi bạn nghe không trọn — rồi vẫn trả lời, bằng cách đoán. Trả lời nhầm câu hỏi trông như hổng kiến thức; xin nhắc lại trông như cẩn thận. Bài này cho bạn những câu dựng sẵn cho năm tình huống, để "không hiểu" trở thành một bước bình thường hai giây thay vì một cơn hoảng.</p>

<h3>Liên tưởng đời thường: ở hiệu thuốc</h3>
${doiThuong('vi', 'Khi dược sĩ dặn cách uống thuốc mà bạn nghe sót một chữ, bạn không đoán — bạn hỏi "ngày hai lần hay ba lần ạ?", vì đoán sai thì có hậu quả. Chẳng ai nghĩ bạn kém vì hỏi lại. Phỏng vấn cũng vậy: kiểm lại câu hỏi chính là việc kỹ sư cẩn thận làm hằng ngày với yêu cầu chưa rõ.')}

<h3>Quy trình bốn bước</h3>
${flow([
  ['1 · Nghe', 'tới hết câu, ghi từ khoá ra giấy', 'Ghi hai ba từ khoá trong lúc họ nói (ví dụ "API · slow · many users"). Đừng vội nghĩ câu trả lời.'],
  ['2 · Kiểm', 'xin nhắc lại hoặc diễn đạt lại', 'Chỗ nào chưa rõ thì xin nhắc lại; nếu nghĩ mình đã hiểu thì nói lại câu hỏi bằng một câu của mình để xác nhận.'],
  ['3 · Dừng', 'vài giây, trung thực', 'Nói ra rằng bạn đang nghĩ. Im lặng có một câu dẫn trước thì ổn; im lặng trơn thì trông như đứng hình.'],
  ['4 · Trả lời', 'khung trước, chi tiết sau', '"There are two parts to this. First… Second…" (việc này có hai phần, thứ nhất… thứ hai…) — cái khung giúp cả bạn lẫn người nghe.'],
])}

<h3>Các câu cho năm tình huống</h3>
${ra(CUU_EN)}
<p>Giải nghĩa để bạn dùng đúng lúc:</p>
${bang(['Câu tiếng Anh', 'Nghĩa', 'Dùng khi'], [
  ['Sorry, could you repeat the question, please?', 'Xin lỗi, anh/chị nhắc lại câu hỏi được không ạ?', 'không nghe kịp cả câu'],
  ['Could you say that a bit more slowly, please?', 'Anh/chị nói chậm hơn một chút được không ạ?', 'họ nói quá nhanh'],
  ['Sorry, the connection cut out…', 'Xin lỗi, mạng bị ngắt, anh/chị nói lại đoạn cuối được không?', 'phỏng vấn online, tiếng bị rè (và cả khi bạn chỉ… không theo kịp)'],
  ['Just to make sure I understand — you’re asking…, right?', 'Để chắc em hiểu đúng — anh/chị đang hỏi…, đúng không ạ?', 'nghĩ là hiểu nhưng muốn chắc'],
  ['What do you mean by "…" here?', 'Ở đây anh/chị muốn nói "…" theo nghĩa nào ạ?', 'một từ có nhiều nghĩa'],
  ['That’s a good question. Let me think for a moment.', 'Câu hỏi hay ạ. Cho em nghĩ một chút.', 'cần 5–10 giây sắp ý'],
  ['I haven’t used X yet, but I’ve used Y, which is similar because…', 'Em chưa dùng X, nhưng em đã dùng Y, khá giống vì…', 'chưa biết đúng thứ được hỏi'],
  ['I’m not 100% sure, but I think…', 'Em không chắc hoàn toàn, nhưng em nghĩ là…', 'biết một phần'],
  ['Sorry, let me rephrase that.', 'Xin lỗi, để em nói lại cho rõ.', 'câu vừa nói bị rối'],
  ['Actually, I meant…, not…', 'Thật ra ý em là…, không phải…', 'nói nhầm một từ'],
])}
${bay('vi', 'trả lời "Yes" cho một câu hỏi bạn không hiểu, để khỏi trông yếu.', 'Đây là lỗi đắt nhất của cả chương. Người phỏng vấn giờ bàn tiếp một chuyện bạn không theo kịp, và khoảng hở lớn dần theo từng phút. Một câu "Sorry, could you repeat that?" chỉ tốn ba giây.')}

<h3>"Em chưa biết, nhưng…" — biến khoảng trống thành bằng chứng</h3>
<p>Người phỏng vấn hay hỏi dồn tới khi chạm giới hạn kiến thức của bạn — đó là cách họ đo độ sâu. Khi chạm tới đó, hai câu trả lời tệ nhất là im lặng và chém gió. Câu trả lời tốt nhất có ba phần: thừa nhận, nối, suy luận.</p>
${stack([
  ['Thừa nhận', '"I haven’t used Kafka in a project." (Em chưa dùng Kafka trong dự án nào.)'],
  ['Nối', '"But I’ve used a Redis queue with background workers, which solves a similar problem." (Nhưng em đã dùng hàng đợi Redis với worker chạy nền, giải một bài toán tương tự.)'],
  ['Suy luận', '"So I would expect Kafka to keep messages on disk, let several consumers read them, and… I would check the documentation for how it handles ordering." (Nên em đoán Kafka giữ tin nhắn trên đĩa, cho nhiều bên đọc, và… em sẽ xem tài liệu về cách nó giữ thứ tự.)'],
])}
<p>Câu trả lời này cho thấy sự trung thực, kinh nghiệm liên quan và khả năng suy luận — ba trong năm tín hiệu ở bài 0.8 — từ đúng một câu hỏi bạn không trả lời được.</p>
${neu('vi', 'người phỏng vấn là người Việt, ở công ty Việt, và buổi phỏng vấn chuyển sang tiếng Anh chỉ để kiểm trình độ của bạn? Sau khi bạn đã cho thấy mình cố gắng, có thể lịch sự hỏi: "Would it be okay if I explain this technical part in Vietnamese, so I can be more precise?" (Em xin phép giải thích phần kỹ thuật này bằng tiếng Việt để nói chính xác hơn được không ạ?). Nhiều người sẽ đồng ý. Đừng làm thế ngay mấy phút đầu, và tuyệt đối không với người phỏng vấn nước ngoài.')}
${keXau('vi', 'một "HR" giả gọi từ số lạ có thể nói tiếng Anh thật nhanh hoặc trộn ngôn ngữ để hối bạn đưa thông tin: số căn cước, một mã OTP "để xác minh buổi phỏng vấn", hay số tài khoản "để chuyển trợ cấp". Dùng đúng nước đi cứu nguy — "Sorry, could you repeat that? Who is calling and from which company?" (xin nhắc lại, ai đang gọi và từ công ty nào?) — rồi cúp máy và gọi lại theo số trên trang web chính thức của công ty. Nhà tuyển dụng thật không bao giờ cần OTP.')}

<h3>Tự sửa khi nói nhầm là một điểm mạnh</h3>
<p>Ai cũng nói nhầm khi căng thẳng. "Actually, I meant authorization, not authentication" cho thấy bạn tự phát hiện lỗi của chính mình — đúng việc một người review code làm. Sửa từ đó, rồi đi tiếp; đừng xin lỗi ba lần.</p>

${thucHanh('vi', { phut: '20', steps: [
  'Chép năm nhóm câu vào một tấm thẻ hoặc một ghi chú trên điện thoại.',
  'Nhờ một người bạn đọc nhanh năm câu hỏi kỹ thuật bằng tiếng Anh, không nhắc lại (lấy câu ở Chương 4 hoặc 5).',
  'Với mỗi câu: dùng ít nhất một câu cứu nguy, diễn đạt lại câu hỏi, rồi trả lời bắt đầu bằng "There are two parts…".',
  'Với một câu bạn thật sự không trả lời được, dùng thừa nhận → nối → suy luận.',
], dat: 'trong bản ghi luyện tập, bạn đã dùng đủ năm nhóm câu ít nhất một lần, và không câu trả lời nào bắt đầu trước khi bạn kiểm lại câu hỏi.' })}
${thuatNgu('vi', [
  ['Paraphrase (diễn đạt lại)', 'Nói cùng ý bằng lời khác — để kiểm mình hiểu đúng.'],
  ['Clarifying question (câu hỏi làm rõ)', 'Câu hỏi gỡ chỗ mơ hồ trước khi trả lời.'],
  ['Buy time (câu giờ)', 'Lấy vài giây một cách trung thực để sắp xếp câu trả lời.'],
  ['Bluff (chém gió)', 'Giả vờ biết — dễ bị lộ và rất đắt.'],
  ['OTP (mã một lần)', 'Mã ngắn cho một lần đăng nhập hay thanh toán — không bao giờ đưa ai.'],
])}
${tomTat('vi', [
  'Trả lời nhầm câu hỏi trông tệ hơn nhiều so với xin nhắc lại.',
  'Quy trình: nghe và ghi từ khoá → kiểm (nhắc lại hoặc diễn đạt lại) → dừng có câu dẫn → trả lời có khung.',
  'Ở giới hạn kiến thức: thừa nhận, nối với cái mình biết, suy luận thành tiếng.',
  'Xin chuyển sang tiếng Việt đôi khi được chấp nhận với người phỏng vấn Việt — hỏi lịch sự, và không phải lúc đầu.',
  'Tự sửa một lần, rõ ràng, rồi đi tiếp.',
])}
${lienQuan('vi', [
  yt('ZqNorUIgIe8', 'Jeff Su', 'How to Answer an Interview Question you DIDN’T Prepare For', 7),
  lienKet({ khoa: 'interview-prep', bai: 'pv-7-2-live-coding', title: 'IT Interview Prep 7.2 — Code trực tiếp và lập trình cặp', sub: 'Cùng thói quen "kiểm câu hỏi trước", áp vào bài code.' }),
  nguon('📘', 'Tech Interview Handbook — Behavioral interviews', 'Cẩm nang miễn phí, có cách diễn đạt mẫu cho câu hỏi khó (tiếng Anh).', 'https://www.techinterviewhandbook.org/behavioral-interview/'),
])}
</div>
`,
};

/* ═══════════════════════ 8.5 — Lab nói tiếng Anh ═══════════════════════ */
const LICH_7 = `
Day  Task (15 minutes)                                           Output file
---  ----------------------------------------------------------  ---------------------------
1    Record your 60-second introduction, no retakes (baseline)   english/d1-intro.m4a
2    Shadow the introduction part of the lesson video 3 times,   english/d2-shadow.m4a
     then re-record your own intro once
3    Explain your main project with the 6-step route (2 min)     english/d3-project.m4a
4    Read the example sentences of your 10 hardest words         english/d4-words.m4a
5    Friend (or AI voice) asks 5 questions fast; use the rescue  english/d5-rescue.m4a
     sentences from 8.4 every time
6    Full 10-minute English mock: intro, project, 3 questions,   english/d6-mock.m4a
     2 questions you ask them
7    Re-record the intro and the project. Listen to day 1 and    english/d7-intro.m4a
     day 7 back to back; fill the scoring sheet for both         english/score.md
`;

const L85 = {
  title: '8.5 — Lab 8: seven days of English speaking, 15 minutes a day, recorded and scored|||8.5 — Lab 8: bảy ngày nói tiếng Anh, 15 phút mỗi ngày, có ghi âm và phiếu chấm',
  slug: 'pv-8-5-lab-noi-tieng-anh',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab bảy ngày cho người kém tiếng Anh: lịch 15 phút/ngày (ghi âm mốc, shadowing, kể dự án, 10 từ khó, câu cứu nguy, phỏng vấn thử 10 phút, ghi lại và so sánh), phiếu chấm năm tiêu chí, gợi ý dùng trợ lý AI giọng nói làm người hỏi, và thử thách thêm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lab 8</span>
<h2>Lab 8 — Seven days of English speaking, recorded and scored</h2>
<p class="lead">Reading this chapter does not change how you speak; saying the sentences does. This lab is deliberately small — fifteen minutes a day for seven days — because a short habit you finish beats a long plan you abandon. At the end you will hear, on your own recordings, the difference between day 1 and day 7.</p>

<h3>The situation</h3>
<p>You have an online interview in about a week with a company that will run part of it in English. Your reading is fine; your speaking is slow and you worry about not understanding the questions. You have fifteen minutes a day between other work.</p>
${flow([
  ['Baseline', 'day 1', 'Record before practising. Without a baseline you cannot see progress, and seeing progress is what keeps you going.'],
  ['Input', 'days 2 and 4', 'Shadowing and word work: copy real speech, fix the words you will use most.'],
  ['Output', 'days 3 and 5', 'Your project story and the rescue sentences, out loud, recorded.'],
  ['Simulation', 'day 6', 'A full ten-minute mock in English.'],
  ['Compare', 'day 7', 'Day 1 vs day 7, scored on the same sheet.'],
])}

<h3>The seven-day schedule</h3>
${ra(LICH_7)}
<details><summary>Hint — what "shadowing" means and how to do it</summary>
<p>Play a short sentence from a native speaker, pause, and repeat it immediately, copying the rhythm and stress, not just the words. Do it three times per sentence. You are training your mouth, not your vocabulary. The lesson video below has a "practice speaking with me" format that works well for this.</p>
</details>
<details><summary>Hint — using an AI voice assistant as the interviewer</summary>
<p>If no friend is free, a voice-mode AI assistant can play the interviewer. Ask it: "Act as an interviewer for a backend internship. Ask me one question at a time, speak quickly, and do not repeat unless I ask." Do not paste company documents or personal data into it. Judge your answers with the scoring sheet, not with the assistant’s praise — assistants are usually too kind.</p>
</details>
${bay('en', 'retaking a recording until it is perfect.', 'Interviews have no retakes. Record once, listen, note two fixes, move on. Perfect recordings train perfectionism; one-take recordings train recovery, which is what you need when a word fails you live.')}
${keXau('en', 'free "English test" sites sometimes ask you to upload a video of yourself plus an ID document to receive a certificate. Recordings of your face and voice plus your ID are exactly what is needed to impersonate you. Keep practice recordings on your own device; delete those you do not need.')}

<h3>How to listen to your own recording</h3>
${flow([
  ['Pass 1 · content', 'listen without stopping', 'Is the order clear? Did you say what you did yourself? Note one thing to cut.'],
  ['Pass 2 · words', 'pause on each technical word', 'Would a stranger recognise cache, deploy, schema? Note the unclear ones for Lesson 8.3.'],
  ['Pass 3 · sounds', 'listen only to endings', 'Final consonants and -s/-ed. Pick two words to fix tomorrow — not ten.'],
])}
<p>Three short passes with one goal each find more than one long, worried listen. If you hate hearing your own voice, that is normal; after two or three recordings it disappears.</p>
<h3>Scoring sheet (score day 1 and day 7)</h3>
${rubric('en', [
  ['Structure', 'No clear order', 'Order exists but wanders', 'Present → past → future, or the 6-step route, clearly'],
  ['Clarity of key words', 'Several technical words unrecognisable', '1–2 unclear words', 'All key words recognisable (8.3)'],
  ['Fluency', 'Long silent pauses, restarts', 'Pauses with fillers ("uh", "ờ")', 'Short pauses, linking words used'],
  ['Grammar that matters', 'Tense errors change meaning', 'Small errors, meaning clear', 'Past tense for finished events, -s/-ed audible'],
  ['Handling not understanding', 'Guessed or said "yes"', 'Asked to repeat', 'Paraphrased and answered with structure'],
])}
<p><strong>Extra challenge:</strong> on day 7, answer one behavioural question from Chapter 3 in English using STAR, in under two minutes, without notes.</p>
${neu('en', 'you miss a day? Do not do two days at once — just continue with the next day. The goal is seven sessions, not seven consecutive dates. If you miss three days, restart from day 5.')}

${thucHanh('en', { phut: '15 per day × 7', steps: [
  'Create <code>~/interview-kit/english/</code> and follow the schedule, saving each file with its name.',
  'On day 7, fill the scoring sheet for day 1 and day 7 in <code>score.md</code>.',
  'Write the two things that improved most and the one that still needs work, and add that one to your plan for next week.',
], dat: 'all seven recordings exist, the day-7 score is at least 2 points higher than day 1 (out of 10), and the day-6 mock lasts the full ten minutes without stopping.' })}
${thuatNgu('en', [
  ['Shadowing', 'Repeating native speech immediately, copying rhythm and stress.'],
  ['Baseline', 'A first measurement taken before practice, to compare against.'],
  ['Filler', '"uh", "um", "ờ" — sounds that fill pauses; fine in moderation.'],
  ['One-take', 'Recording once without restarting — like a real interview.'],
  ['Self-assessment', 'Scoring yourself against fixed criteria.'],
])}
${tomTat('en', [
  'Fifteen minutes a day for seven days beats a long plan you abandon.',
  'Record a baseline on day 1 so you can hear your progress on day 7.',
  'Alternate input (shadowing, words) and output (project story, rescue sentences).',
  'Record in one take; recovery is the real skill.',
  'Score with a fixed sheet, not with how you feel.',
])}
${lienQuan('en', [
  yt('Ln_3AVoBRLk', 'linguamarina', 'Practice speaking with me — Job Interview in English', 16, 'en'),
  lienKet({ khoa: 'interview-prep', bai: 'pv-2-5-lab-tu-gioi-thieu', L: 'en', title: 'IT Interview Prep 2.5 — Lab: record your self-introduction', sub: 'The Vietnamese version of this lab, for comparison.' }),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Lab 8</span>
<h2>Lab 8 — Bảy ngày nói tiếng Anh, có ghi âm và phiếu chấm</h2>
<p class="lead">Đọc chương này không làm bạn nói khác đi; nói thành tiếng các câu đó mới làm. Lab này cố ý nhỏ — mười lăm phút mỗi ngày trong bảy ngày — vì một thói quen ngắn mà bạn làm xong thắng một kế hoạch dài mà bạn bỏ dở. Cuối lab, bạn sẽ nghe thấy, trên chính bản ghi của mình, sự khác biệt giữa ngày 1 và ngày 7.</p>

<h3>Tình huống</h3>
<p>Khoảng một tuần nữa bạn có buổi phỏng vấn online với một công ty sẽ hỏi một phần bằng tiếng Anh. Đọc thì bạn ổn; nói thì chậm và bạn lo không hiểu câu hỏi. Mỗi ngày bạn có mười lăm phút xen giữa các việc khác.</p>
${flow([
  ['Mốc ban đầu', 'ngày 1', 'Ghi âm TRƯỚC khi luyện. Không có mốc thì không thấy tiến bộ, mà thấy tiến bộ là thứ giữ bạn đi tiếp.'],
  ['Nạp vào', 'ngày 2 và 4', 'Shadowing (nói đuổi) và luyện từ: bắt chước lời nói thật, sửa những từ bạn sẽ dùng nhiều nhất.'],
  ['Nói ra', 'ngày 3 và 5', 'Câu chuyện dự án và các câu cứu nguy, nói thành tiếng, có ghi âm.'],
  ['Mô phỏng', 'ngày 6', 'Một buổi phỏng vấn thử trọn mười phút bằng tiếng Anh.'],
  ['So sánh', 'ngày 7', 'Ngày 1 và ngày 7, chấm trên cùng một phiếu.'],
])}

<h3>Lịch bảy ngày</h3>
${ra(LICH_7)}
<p>Giải nghĩa cột Task: Ngày 1 — ghi lời giới thiệu 60 giây, không ghi lại (mốc). Ngày 2 — nói đuổi đoạn giới thiệu trong video bài học 3 lần, rồi ghi lại lời giới thiệu của mình một lần. Ngày 3 — kể dự án chính theo lộ trình 6 bước (2 phút). Ngày 4 — đọc câu ví dụ của 10 từ khó nhất (bài 8.3). Ngày 5 — bạn bè (hoặc AI giọng nói) hỏi nhanh 5 câu; mỗi lần đều dùng câu cứu nguy ở bài 8.4. Ngày 6 — phỏng vấn thử 10 phút bằng tiếng Anh: giới thiệu, dự án, 3 câu hỏi, 2 câu bạn hỏi lại. Ngày 7 — ghi lại phần giới thiệu và dự án; nghe ngày 1 rồi ngày 7 liền nhau, chấm cả hai.</p>
<details><summary>Gợi ý — "shadowing" (nói đuổi) là gì và làm thế nào</summary>
<p>Phát một câu ngắn của người bản xứ, dừng lại, và lặp lại NGAY, bắt chước nhịp và trọng âm chứ không chỉ chữ. Mỗi câu ba lần. Bạn đang luyện cái miệng, không phải vốn từ. Video bài học bên dưới có dạng "nói cùng tôi" rất hợp cho việc này.</p>
</details>
<details><summary>Gợi ý — dùng trợ lý AI giọng nói làm người phỏng vấn</summary>
<p>Nếu không có bạn rảnh, một trợ lý AI ở chế độ giọng nói có thể đóng vai người phỏng vấn. Bảo nó: "Act as an interviewer for a backend internship. Ask me one question at a time, speak quickly, and do not repeat unless I ask." (Hãy đóng vai người phỏng vấn thực tập backend, hỏi từng câu một, nói nhanh, chỉ nhắc lại khi tôi xin.) Đừng dán tài liệu công ty hay dữ liệu cá nhân vào. Chấm câu trả lời bằng phiếu chấm, đừng bằng lời khen của trợ lý — trợ lý thường khen quá tay.</p>
</details>
${bay('vi', 'ghi đi ghi lại tới khi hoàn hảo.', 'Phỏng vấn không có lần quay lại. Ghi một lần, nghe, ghi chú hai chỗ sửa, đi tiếp. Bản ghi hoàn hảo luyện tính cầu toàn; bản ghi một lần luyện khả năng gỡ lại — đúng thứ bạn cần khi một từ phản bội bạn giữa buổi thật.')}
${keXau('vi', 'các trang "kiểm tra tiếng Anh miễn phí" đôi khi bắt bạn tải lên video mặt mình kèm ảnh giấy tờ tuỳ thân để "nhận chứng chỉ". Bản ghi khuôn mặt, giọng nói cộng với giấy tờ của bạn là đúng thứ kẻ gian cần để mạo danh bạn. Giữ bản ghi luyện tập trên máy của bạn; xoá những bản không cần.')}

<h3>Cách tự nghe lại bản ghi của mình</h3>
${flow([
  ['Lượt 1 · nội dung', 'nghe không dừng', 'Thứ tự có rõ không? Bạn có nói được phần chính mình làm không? Ghi một chỗ cần cắt.'],
  ['Lượt 2 · từ', 'dừng ở mỗi từ kỹ thuật', 'Một người lạ có nhận ra cache, deploy, schema không? Ghi các từ chưa rõ để luyện ở bài 8.3.'],
  ['Lượt 3 · âm', 'chỉ nghe phần đuôi', 'Phụ âm cuối và -s/-ed. Chọn hai từ để sửa ngày mai — không phải mười từ.'],
])}
<p>Ba lượt nghe ngắn, mỗi lượt một mục tiêu, tìm ra nhiều lỗi hơn một lượt nghe dài đầy lo lắng. Nếu bạn ghét nghe giọng mình, đó là chuyện bình thường; sau hai ba bản ghi cảm giác đó sẽ hết. Mẹo cho người kém tiếng Anh: bật tính năng chuyển giọng nói thành chữ (ví dụ trong Google Docs hoặc ghi chú điện thoại) rồi đọc bản ghi — từ nào máy ghi sai thường cũng là từ người nghe khó nhận ra.</p>
<h3>Phiếu chấm (chấm ngày 1 và ngày 7)</h3>
${rubric('vi', [
  ['Bố cục', 'Không có thứ tự rõ', 'Có thứ tự nhưng lan man', 'Hiện tại → quá khứ → tương lai, hoặc lộ trình 6 bước, rõ ràng'],
  ['Độ rõ của từ khoá', 'Nhiều từ kỹ thuật không nghe ra', '1–2 từ chưa rõ', 'Mọi từ khoá nghe ra được (bài 8.3)'],
  ['Độ trôi chảy', 'Im lâu, nói lại từ đầu', 'Có ngắt với âm đệm ("uh", "ờ")', 'Ngắt ngắn, có dùng từ nối'],
  ['Ngữ pháp quan trọng', 'Sai thì làm đổi nghĩa', 'Lỗi nhỏ, nghĩa vẫn rõ', 'Quá khứ cho việc đã xong, nghe rõ -s/-ed'],
  ['Xử lý khi không hiểu', 'Đoán hoặc nói "yes"', 'Xin nhắc lại', 'Diễn đạt lại rồi trả lời có khung'],
])}
<p><strong>Thử thách thêm:</strong> ngày 7, trả lời một câu hỏi hành vi ở Chương 3 bằng tiếng Anh theo STAR, dưới hai phút, không nhìn giấy.</p>
${neu('vi', 'bạn lỡ một ngày? Đừng làm gộp hai ngày — cứ làm tiếp ngày kế tiếp. Mục tiêu là bảy buổi, không phải bảy ngày liên tiếp. Lỡ ba ngày thì bắt đầu lại từ ngày 5.')}

${thucHanh('vi', { phut: '15 mỗi ngày × 7', steps: [
  'Tạo thư mục <code>~/interview-kit/english/</code> và làm theo lịch, lưu mỗi tệp đúng tên.',
  'Ngày 7, điền phiếu chấm cho ngày 1 và ngày 7 vào <code>score.md</code>.',
  'Viết hai điều tiến bộ nhất và một điều còn cần luyện, rồi đưa điều đó vào kế hoạch tuần sau.',
], dat: 'đủ bảy bản ghi, điểm ngày 7 cao hơn ngày 1 ít nhất 2 điểm (thang 10), và buổi thử ngày 6 kéo dài đủ mười phút không dừng.' })}
${thuatNgu('vi', [
  ['Shadowing (nói đuổi)', 'Lặp lại ngay lời người bản xứ, bắt chước nhịp và trọng âm.'],
  ['Baseline (mốc ban đầu)', 'Lần đo đầu tiên trước khi luyện, để so sánh về sau.'],
  ['Filler (âm đệm)', '"uh", "um", "ờ" — âm lấp chỗ ngắt; dùng vừa phải thì không sao.'],
  ['One-take (ghi một lần)', 'Ghi một lần không làm lại — giống buổi phỏng vấn thật.'],
  ['Self-assessment (tự đánh giá)', 'Tự chấm mình theo tiêu chí cố định.'],
])}
${tomTat('vi', [
  'Mười lăm phút mỗi ngày trong bảy ngày thắng một kế hoạch dài bị bỏ dở.',
  'Ghi âm mốc ngày 1 để ngày 7 nghe được tiến bộ của mình.',
  'Xen kẽ nạp vào (nói đuổi, luyện từ) và nói ra (câu chuyện dự án, câu cứu nguy).',
  'Ghi một lần; khả năng gỡ lại mới là kỹ năng thật.',
  'Chấm bằng phiếu cố định, đừng chấm bằng cảm giác.',
])}
${lienQuan('vi', [
  yt('Ln_3AVoBRLk', 'linguamarina', 'Practice speaking with me — Job Interview in English', 16),
  lienKet({ khoa: 'interview-prep', bai: 'pv-2-5-lab-tu-gioi-thieu', title: 'IT Interview Prep 2.5 — Lab: quay thử lời tự giới thiệu', sub: 'Bản tiếng Việt của lab này, để so sánh.' }),
])}
</div>
`,
};

/* ═══════════════════════ 8.6 — Quiz ═══════════════════════ */
const Q86 = {
  title: '8.6 — Chapter 8 check|||8.6 — Kiểm tra Chương 8',
  slug: 'pv-8-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về tự giới thiệu bằng tiếng Anh, kể dự án, phát âm từ kỹ thuật, câu cứu nguy khi không hiểu, và luyện nói.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Check</span>
<h2>Chapter 8 check — English for IT interviews</h2>
<p class="lead">Ten situations from English interviews. Read every explanation, especially for the sentences you would actually say.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can give a 60-second introduction in three blocks: present, past, future.</li>
<li>I can explain my main project by following one request, in short sentences.</li>
<li>I pronounce cache, queue, nginx, schema, deploy and architecture so they are recognisable.</li>
<li>I have a sentence ready for each of the five rescue situations.</li>
<li>I have recorded myself at least twice and scored the recordings.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Kiểm tra Chương 8 — tiếng Anh phỏng vấn IT</h2>
<p class="lead">Mười tình huống trong phỏng vấn tiếng Anh. Đọc mọi lời giải thích, nhất là với những câu bạn sẽ nói thật.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giới thiệu được 60 giây theo ba khối: hiện tại, quá khứ, tương lai.</li>
<li>Tôi giải thích được dự án chính bằng cách đi theo một request, câu ngắn.</li>
<li>Tôi đọc cache, queue, nginx, schema, deploy, architecture sao cho người nghe nhận ra.</li>
<li>Tôi có sẵn một câu cho mỗi tình huống trong năm tình huống cứu nguy.</li>
<li>Tôi đã tự ghi âm ít nhất hai lần và chấm các bản ghi đó.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      cau('The interviewer asks a long question in fast English and you only catch "database" and "slow". What is the best first response?|||Người phỏng vấn hỏi một câu dài bằng tiếng Anh nhanh, bạn chỉ bắt được "database" và "slow". Phản ứng đầu tiên tốt nhất là gì?', [
        'Start talking about indexes, since it is probably about indexes|||Nói luôn về index, vì chắc là hỏi về index',
        'Say "Yes, I agree" and wait for the next question|||Nói "Yes, I agree" rồi chờ câu tiếp',
        '"Just to make sure I understand — you’re asking why a database query becomes slow, right?"|||"Just to make sure I understand — you’re asking why a database query becomes slow, right?" (để chắc em hiểu đúng — anh/chị hỏi vì sao truy vấn chậm, đúng không ạ?)',
        'Stay silent until they repeat it|||Im lặng tới khi họ nhắc lại',
      ], 2, 'EN: Paraphrasing checks your understanding and shows care. Jumping to indexes is tempting, but if the question was about connection pools or caching, you just answered the wrong question. "Yes, I agree" to an unclear question is the most expensive mistake of the chapter.|||VI: Diễn đạt lại để kiểm mình hiểu đúng và cho thấy sự cẩn thận. Nhảy ngay vào index nghe hợp lý, nhưng nếu câu hỏi là về pool kết nối hay cache thì bạn vừa trả lời nhầm câu. "Yes, I agree" với một câu chưa hiểu là lỗi đắt nhất của chương.'),
      cau('Which order does the course recommend for a 60-second English introduction?|||Khoá học khuyên thứ tự nào cho lời giới thiệu tiếng Anh 60 giây?', [
        'Present (who I am now) → past (evidence) → future (why this job)|||Hiện tại (tôi là ai) → quá khứ (bằng chứng) → tương lai (vì sao công việc này)',
        'Childhood → university → hobbies → projects|||Tuổi thơ → đại học → sở thích → dự án',
        'List of technologies → GPA → certificates|||Danh sách công nghệ → điểm GPA → chứng chỉ',
        'Future → present → past, to sound ambitious|||Tương lai → hiện tại → quá khứ, cho nghe có hoài bão',
      ], 0, 'EN: Present–past–future keeps the listener oriented and keeps each block to one or two tenses. Starting from childhood wastes the limited time; a technology list gives no picture.|||VI: Hiện tại – quá khứ – tương lai giữ người nghe định hướng được và mỗi khối chỉ cần một hai thì. Kể từ tuổi thơ phí thời gian có hạn; danh sách công nghệ không tạo ra hình ảnh nào.'),
      cau('You built most of your platform with an AI coding assistant. Which English sentence is the most honest and still strong?|||Bạn làm phần lớn nền tảng của mình cùng trợ lý AI viết code. Câu tiếng Anh nào trung thực nhất mà vẫn mạnh?', [
        '"I wrote all of the code myself."|||"I wrote all of the code myself." (tôi tự viết toàn bộ mã)',
        '"AI assistants wrote much of the code; my main work was the architecture, reviewing the code, deploying and fixing production incidents."|||"AI assistants wrote much of the code; my main work was the architecture, reviewing the code, deploying and fixing production incidents." (AI viết nhiều phần mã; việc chính của tôi là kiến trúc, duyệt mã, deploy và xử lý sự cố)',
        '"An AI did it, I just used it."|||"An AI did it, I just used it." (AI làm hết, tôi chỉ dùng)',
        'Avoid mentioning the project|||Né không nhắc tới dự án',
      ], 1, 'EN: The second sentence is true and lists real skills. "I wrote all of it" is tempting but collapses at the first "change this function now". "An AI did it" undersells real work you did.|||VI: Câu thứ hai đúng sự thật và nêu được kỹ năng thật. "Tôi tự viết hết" nghe hấp dẫn nhưng sụp ngay ở câu "sửa hàm này ngay nhé". "AI làm hết" thì tự hạ thấp phần việc thật bạn đã làm.'),
      cau('Which pronunciation of "cache" will an English-speaking interviewer recognise?|||Cách đọc "cache" nào người phỏng vấn nói tiếng Anh sẽ nhận ra?', [
        '"ca-chê"|||"ca-chê"',
        '"cát-chơ"|||"cát-chơ"',
        '"ca-xe"|||"ca-xe"',
        '/kæʃ/ — the same sound as "cash"|||/kæʃ/ — đọc giống "cash" ("két")',
      ], 3, 'EN: cache is one syllable, /kæʃ/, like "cash". The two-syllable versions come from reading the spelling as Vietnamese and are not recognised.|||VI: cache chỉ có một âm tiết, /kæʃ/, giống "cash". Các cách đọc hai âm tiết đến từ việc đọc mặt chữ kiểu tiếng Việt và người nghe không nhận ra.'),
      cau('You are asked about Kafka, which you have never used. Which answer follows "admit → connect → reason"?|||Bạn bị hỏi về Kafka, thứ bạn chưa dùng bao giờ. Câu trả lời nào theo đúng "thừa nhận → nối → suy luận"?', [
        '"Kafka is a big data tool used by many companies."|||"Kafka là công cụ big data nhiều công ty dùng."',
        '"Sorry, I don’t know." — and stop|||"Sorry, I don’t know." — rồi dừng',
        '"I haven’t used Kafka, but I’ve used a Redis queue with workers, so I would expect Kafka to keep messages on disk and let several consumers read them…"|||"I haven’t used Kafka, but I’ve used a Redis queue with workers, so I would expect Kafka to keep messages on disk and let several consumers read them…" (chưa dùng Kafka, nhưng đã dùng hàng đợi Redis, nên em đoán…)',
        'Describe Kafka confidently from a video you once watched|||Tự tin mô tả Kafka theo một video từng xem',
      ], 2, 'EN: Admitting, connecting to real experience and reasoning shows honesty and depth from a gap. A generic sentence or confident bluffing is detected by the next follow-up; "I don’t know" alone gives no evidence.|||VI: Thừa nhận, nối với kinh nghiệm thật và suy luận cho thấy sự trung thực và độ sâu ngay từ chỗ hổng. Câu chung chung hay chém gió tự tin sẽ lộ ở câu hỏi tiếp; chỉ "I don’t know" thì không cho bằng chứng gì.'),
      cau('When explaining your architecture in English, where should you start?|||Khi giải thích kiến trúc bằng tiếng Anh, nên bắt đầu từ đâu?', [
        'From the user, following one request through the system to where the data is stored|||Từ người dùng, đi theo một request xuyên hệ thống tới chỗ dữ liệu được lưu',
        'From the list of all technologies in package.json|||Từ danh sách mọi công nghệ trong package.json',
        'From the hardest bug you fixed|||Từ lỗi khó nhất bạn từng sửa',
        'From the database tables, one by one|||Từ các bảng CSDL, từng bảng một',
      ], 0, 'EN: Following one request gives the listener a map, like giving directions. A technology list or table-by-table tour gives names without a picture; the bug comes later, in step 5.|||VI: Đi theo một request cho người nghe một tấm bản đồ, như chỉ đường. Danh sách công nghệ hay đi từng bảng chỉ cho tên mà không cho hình; còn lỗi khó thì để tới bước 5.'),
      cau('A caller says they are HR, speaks very fast English, and asks for an OTP "to verify your interview". What do you do?|||Một người gọi tự xưng HR, nói tiếng Anh rất nhanh, xin mã OTP "để xác minh buổi phỏng vấn". Bạn làm gì?', [
        'Give it quickly so you do not lose the interview|||Đọc nhanh để không mất buổi phỏng vấn',
        'Ask them to repeat slowly, then give it|||Xin họ nói chậm lại, rồi đọc mã',
        'Give only half of the code|||Chỉ đọc nửa mã',
        'Ask who is calling and from which company, hang up, and call back using the number on the official website — never share an OTP|||Hỏi ai đang gọi, từ công ty nào, cúp máy và gọi lại theo số trên trang chính thức — không bao giờ đưa OTP',
      ], 3, 'EN: No real recruiter needs a one-time code. Speed and mixed languages are pressure tactics. Asking to repeat is right as a first step, but giving the code afterwards is still handing over your account.|||VI: Không nhà tuyển dụng thật nào cần mã một lần. Nói nhanh và trộn ngôn ngữ là chiêu gây áp lực. Xin nhắc lại là đúng ở bước đầu, nhưng sau đó vẫn đọc mã thì vẫn là giao tài khoản cho người ta.'),
      cau('Which pair is correctly matched?|||Cặp nào ghép đúng nghĩa?', [
        'Authentication = what you may do; authorization = who you are|||Authentication = bạn được làm gì; authorization = bạn là ai',
        'Latency = how long one request takes; throughput = how many requests per second|||Latency = một request mất bao lâu; throughput = mỗi giây bao nhiêu request',
        'Library = calls your code; framework = you call it|||Library = gọi code của bạn; framework = bạn gọi nó',
        'Deploy = write the code; release = test the code|||Deploy = viết code; release = test code',
      ], 1, 'EN: Latency and throughput are correct. The authentication/authorization pair is swapped — a classic confusion. The library/framework pair is also reversed: you call a library, a framework calls you.|||VI: Latency và throughput ghép đúng. Cặp authentication/authorization bị đảo — kiểu nhầm kinh điển. Cặp library/framework cũng bị ngược: bạn gọi thư viện, framework gọi bạn.'),
      cau('In Lab 8, why should practice recordings be done in one take?|||Trong Lab 8, vì sao bản ghi luyện tập nên ghi một lần?', [
        'To save phone storage|||Để tiết kiệm bộ nhớ điện thoại',
        'Because retakes are not allowed by the scoring sheet|||Vì phiếu chấm cấm ghi lại',
        'Because real interviews have no retakes, so the skill to train is recovering from mistakes|||Vì phỏng vấn thật không có lần quay lại, nên kỹ năng cần luyện là gỡ lại sau khi vấp',
        'Because the first take is always the best|||Vì lần ghi đầu luôn là hay nhất',
      ], 2, 'EN: The lab trains recovery. Storage and "first take is best" are not the reason; the scoring sheet itself does not forbid retakes — the habit does.|||VI: Lab luyện khả năng gỡ lại. Bộ nhớ hay "lần đầu luôn hay nhất" không phải lý do; phiếu chấm không cấm ghi lại — thói quen mới là thứ cần.'),
      cau('With a Vietnamese interviewer who switched to English to test you, when is it acceptable to ask to explain a technical part in Vietnamese?|||Với người phỏng vấn Việt chuyển sang tiếng Anh để kiểm tra bạn, khi nào được xin giải thích một phần kỹ thuật bằng tiếng Việt?', [
        'At the very beginning, to avoid mistakes|||Ngay từ đầu, cho khỏi sai',
        'Never, under any circumstances|||Không bao giờ, trong mọi trường hợp',
        'Only by switching without asking|||Chỉ bằng cách tự chuyển mà không hỏi',
        'After you have shown you can try in English, by asking politely — and never with a foreign interviewer|||Sau khi đã cho thấy mình cố gắng bằng tiếng Anh, bằng cách hỏi lịch sự — và không bao giờ với người phỏng vấn nước ngoài',
      ], 3, 'EN: Asking politely after trying is often accepted by Vietnamese interviewers, because precision matters for technical content. Asking at the start fails the English check; switching without asking is rude; "never" is stricter than reality.|||VI: Hỏi lịch sự sau khi đã cố gắng thường được người phỏng vấn Việt chấp nhận, vì nội dung kỹ thuật cần chính xác. Xin ngay từ đầu là trượt luôn phần kiểm tiếng Anh; tự chuyển không hỏi là bất lịch sự; "không bao giờ" thì khắt khe hơn thực tế.'),
    ],
  },
};

export default {
  title: 'Chapter 8 — English for IT interviews|||Chương 8 — Tiếng Anh phỏng vấn IT',
  description: 'Nói về mình và về kỹ thuật bằng tiếng Anh đơn giản: tự giới thiệu 60 giây, kể dự án theo đường đi của một request, 50 từ kỹ thuật hay đọc sai, câu cứu nguy khi không hiểu, và lab bảy ngày có ghi âm, phiếu chấm.',
  lessons: [L81, L82, L83, L84, L85, Q86],
};
