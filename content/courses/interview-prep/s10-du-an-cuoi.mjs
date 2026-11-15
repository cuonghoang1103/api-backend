/**
 * IT Interview Prep — Chương 10 (MỚI): Dự án cuối khoá — bộ hồ sơ ứng tuyển hoàn chỉnh (soạn 15/11/2026).
 * Sự cố/quyết định dùng làm ví dụ đều có thật (CLAUDE.md, docs/so-loi.md, kế hoạch LabFlow) — kể bằng tên thành phần,
 * không IP/khoá/tên miền nội bộ. Số đo: build ~15 phút trên VPS → ~3–6 phút ở máy nhà; API 502 bảy phút (18/08/2026);
 * cache build 7,6 GB, đĩa tụt còn 1,8 GB (18/08/2026); app desktop bump 11 lần trong 4,5 giờ (19–20/08/2026).
 * Khoá chữ, khuôn Mục 0 + helper ./_pv.mjs.
 * LUẬT: không backtick trần; không viết "${" trong chữ; < > & trong chữ → &lt; &gt; &amp;; không gạch chéo ngược.
 */
import { ma, ra, lienKet, nguon, yt, flow, stack, kv, bang, bay, keXau, doiThuong, neu, thucHanh, thuatNgu, tomTat, lienQuan, rubric, cau } from './_pv.mjs';

/* ═══════════════════════ 10.1 — Đề bài ═══════════════════════ */
const DE_EN = `
FINAL PROJECT — "Application kit v1.0"                         owner: you · reviewer: you + one senior/friend

Deliverables (all in ~/interview-kit/, links collected in kit.md)
 D1  CV — one page, PDF, text-selectable, every link opens on a phone            due 29/11
 D2  GitHub — profile README + 2-3 pinned repos, each README: what/why/run/
     architecture/my role/screens                                                due 29/11
 D3  LinkedIn — photo, headline, About, Experience/Projects, Education, Skills  due 29/11
 D4  5 STAR stories — written (≤ 250 words each) + recorded (≤ 2 min each)       due 03/12
 D5  Self-introduction — 60-90 s in Vietnamese + 60-90 s in English, recorded    due 03/12
 D6  Technical answer bank — 20 questions for your direction, answered in your
     own words, each with one example from your projects                         due 06/12
 D7  Final mock — 60 minutes, recorded, scored with the Lesson 10.4 sheet         due 08/12
 D8  Tracker — at least 15 real applications sent, every row with a next step    due 10/12

Constraints
 - Honest: every line defensible under 3 follow-up questions; AI use described truthfully
 - Safe: no secrets, IPs, tokens, private data in any file, screenshot or recording
 - Decision point 10/12: no confirmed company -> register a school-listed company before the OJT deadline
`;

const DE_VI = `
DỰ ÁN CUỐI KHOÁ — "Bộ hồ sơ ứng tuyển v1.0"            chủ: bạn · người duyệt: bạn + một anh chị khoá trên/bạn bè

Sản phẩm phải nộp (tất cả trong ~/interview-kit/, đường dẫn gom vào kit.md)
 D1  CV — một trang, PDF, chọn được chữ, mọi link mở được trên điện thoại        hạn 29/11
 D2  GitHub — README hồ sơ + 2-3 repo ghim, mỗi README có: là gì/vì sao/
     cách chạy/kiến trúc/vai trò của tôi/ảnh màn hình                            hạn 29/11
 D3  LinkedIn — ảnh, headline, About, Kinh nghiệm/Dự án, Học vấn, Kỹ năng        hạn 29/11
 D4  5 câu chuyện STAR — viết (≤ 250 từ mỗi câu) + ghi âm (≤ 2 phút mỗi câu)    hạn 03/12
 D5  Tự giới thiệu — 60-90 giây tiếng Việt + 60-90 giây tiếng Anh, có ghi âm     hạn 03/12
 D6  Ngân hàng câu trả lời kỹ thuật — 20 câu theo hướng bạn chọn, trả lời bằng
     lời của mình, mỗi câu một ví dụ từ dự án                                    hạn 06/12
 D7  Buổi thử cuối — 60 phút, có ghi hình, chấm theo phiếu bài 10.4              hạn 08/12
 D8  Bảng theo dõi — ít nhất 15 đơn thật đã gửi, dòng nào cũng có bước tiếp theo hạn 10/12

Ràng buộc
 - Trung thực: mọi dòng bảo vệ được qua 3 câu đào sâu; kể đúng việc dùng AI
 - An toàn: không bí mật, IP, token, dữ liệu riêng trong bất kỳ tệp, ảnh, bản ghi nào
 - Điểm quyết định 10/12: chưa có công ty chốt -> đăng ký công ty trong danh sách trường trước hạn OJT
`;

const L101 = {
  title: '10.1 — The final project brief: eight deliverables, real deadlines, a 100-point rubric|||10.1 — Đề bài dự án cuối khoá: tám sản phẩm, hạn chót thật, rubric 100 điểm',
  slug: 'pv-10-1-de-bai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đề bài như một đầu việc thật: tám sản phẩm phải nộp (CV, GitHub, LinkedIn, 5 câu chuyện STAR, tự giới thiệu hai thứ tiếng, ngân hàng 20 câu kỹ thuật, buổi thử 60 phút, bảng theo dõi 15 đơn), hạn chót bám lịch 20–29/11 và điểm quyết định 10/12, ràng buộc trung thực và an toàn, rubric 100 điểm, và cách chia việc theo ngày.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>The final project brief — your application kit, specified like a real ticket</h2>
<p class="lead">Every chapter of this course produced a piece: a tracker, a skill matrix, a CV draft, stories, answers, recordings, emails. This final chapter assembles them into one product you will actually use for the next three weeks — and for your next applications after OJT. It is written as a work ticket with deliverables, due dates and a rubric, because that is how you will receive work at your internship.</p>

<h3>An everyday picture: moving into a new room</h3>
${doiThuong('en', 'When you move, you do not carry things one by one as you remember them. You make a list, pack by category, label the boxes, and set a moving day. The application kit is your moving list: everything a company will ask for, packed, labelled, and ready before the day you need it.')}

<h3>The brief</h3>
${ra(DE_EN)}

<h3>How the deliverables fit together</h3>
${flow([
  ['D1–D3 · the profile', 'what gets you the interview', 'The CV makes a claim; GitHub and LinkedIn prove it. One story told three ways, consistent in dates and roles.'],
  ['D4–D5 · the voice', 'what you say in the first ten minutes', 'The introduction and five stories cover most behavioural questions (Chapter 3).'],
  ['D6 · the depth', 'what you say in the technical round', 'Twenty questions in your direction (Chapters 4–7), each anchored in your own project.'],
  ['D7 · the rehearsal', 'the proof it works under time', 'A full 60-minute mock (Lesson 10.4).'],
  ['D8 · the pipeline', 'what turns the kit into offers', 'Fifteen real applications with next steps, and the decision on 10/12.'],
])}

<h3>Rubric — 100 points</h3>
${bang(['Deliverable', 'Points', 'Full marks when…'], [
  ['D1 CV', '15', 'One page; every bullet has an action and a concrete result; skills match evidence; no unexplainable line'],
  ['D2 GitHub', '15', '2–3 pinned repos with complete READMEs, real screenshots, a clear "my role" section, no secrets in history'],
  ['D3 LinkedIn', '5', 'Headline states the target role; About matches the CV; projects linked'],
  ['D4 Five STAR stories', '20', 'All five types present; each has a real cause and a "what changed afterwards"; under 2 minutes'],
  ['D5 Introduction VI + EN', '10', '60–90 s each, three blocks, honest AI line, key words pronounced clearly'],
  ['D6 Technical bank', '15', '20 answers in your own words, each with a project example and one follow-up prepared'],
  ['D7 Final mock', '15', 'Recorded, scored with the sheet, three weakest answers rewritten'],
  ['D8 Tracker', '5', '15+ real applications, every row with a dated next step'],
])}
<p>Pass mark: <strong>70</strong>. Below 70, fix the lowest-scoring deliverable first — usually D1 or D4, because they decide whether you get interviews and how the first ten minutes go.</p>
${bay('en', 'polishing the CV for a week and sending nothing.', 'The kit is "v1.0", not perfect. D8 exists so that the CV goes out by 29/11 and starts collecting real feedback. A good CV that is sent beats a perfect CV that is still a draft on 10 December.')}

<h3>A day-by-day split</h3>
${bang(['Dates', 'Work', 'Lessons'], [
  ['20–23/11', 'D1 CV draft and review; D3 LinkedIn', '1.1, 1.2, 1.4, 10.2'],
  ['24–29/11', 'D2 GitHub READMEs; finalise D1; first 5 applications', '1.3, 10.2'],
  ['30/11–3/12', 'D4 stories; D5 introductions; 5 more applications', '2.1–2.3, 8.1, 10.3'],
  ['4–6/12', 'D6 technical bank for your direction', 'Ch4/5/6, Ch7'],
  ['7–8/12', 'D7 final mock and rewrites', '9.1, 10.4'],
  ['9–10/12', 'D8 review; decision point', '9.3, 9.4'],
])}
${neu('en', 'you get a real interview on 2 December, before D6 is ready? Prioritise: re-read that company’s posting, do D6 only for the skills it lists, and use the interview as part of D7. The plan serves the applications, not the other way round.')}
${keXau('en', 'your kit folder will contain your CV, phone number, recordings of your voice and face, and maybe scans of documents. Do not keep it in a public repository or a shared drive "anyone with the link" can open. If you put the kit itself on GitHub to track it, make that repository private, and never commit identity documents.')}

${thucHanh('en', { phut: '30', steps: [
  'Create <code>~/interview-kit/kit.md</code> with the eight deliverables, their due dates, and a status column.',
  'Copy the day-by-day split into your calendar with your real constraints (exams, block 5).',
  'Score your current state against the rubric honestly — this is your baseline.',
  'Choose the person who will review D1 and D7 and message them now.',
], dat: 'kit.md lists the eight deliverables with dates and a baseline score, the plan is in your calendar, and a reviewer has agreed.' })}
${thuatNgu('en', [
  ['Deliverable', 'A concrete product you must hand in.'],
  ['Brief', 'The description of a task: what, by when, under which constraints.'],
  ['Rubric', 'A scoring grid that says what full marks look like.'],
  ['Baseline', 'Your score before starting, to measure progress.'],
  ['Pipeline (job search)', 'The flow of applications from sent to answered.'],
])}
${tomTat('en', [
  'The final project is your application kit: eight deliverables with real due dates.',
  'Profile (D1–D3) gets interviews; voice (D4–D5) and depth (D6) win them; the mock (D7) proves it; the tracker (D8) turns it into offers.',
  'Pass mark 70/100; fix the lowest deliverable first.',
  'Send the CV by 29/11 — v1.0, not perfect.',
  'Keep the kit private and free of secrets.',
])}
${lienQuan('en', [
  yt('ZU9x1vFx5lI', 'Harvard Business Review', 'Stand Out in a Job Interview', 10, 'en'),
  lienKet({ khoa: 'interview-prep', bai: 'pv-0-3-lab-bang-ung-tuyen', L: 'en', title: 'IT Interview Prep 0.3 — Lab 0: your job-hunt dashboard', sub: 'D8 is this tracker, now with fifteen real applications.' }),
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-2-1-cv-portfolio', academy: true, L: 'en', title: 'Academy · OJT202 2.1 — CV, portfolio and interview prep', sub: 'What the OJT coordinator expects in your file.' }),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Đề bài dự án cuối khoá — bộ hồ sơ ứng tuyển, đặc tả như một đầu việc thật</h2>
<p class="lead">Mỗi chương của khoá đã cho ra một mảnh: bảng theo dõi, ma trận kỹ năng, bản nháp CV, câu chuyện, câu trả lời, bản ghi âm, email. Chương cuối ráp chúng thành một sản phẩm bạn sẽ dùng thật trong ba tuần tới — và cho những lần ứng tuyển sau OJT. Đề được viết như một thẻ việc có sản phẩm phải nộp, hạn chót và rubric, vì đó đúng là cách bạn sẽ nhận việc ở chỗ thực tập.</p>

<h3>Liên tưởng đời thường: chuyển sang phòng trọ mới</h3>
${doiThuong('vi', 'Khi chuyển nhà, bạn không khuân từng món theo kiểu nhớ ra cái gì khuân cái đó. Bạn lập danh sách, đóng gói theo loại, dán nhãn thùng, và chọn ngày chuyển. Bộ hồ sơ ứng tuyển là danh sách chuyển nhà của bạn: mọi thứ công ty sẽ hỏi, đã đóng gói, dán nhãn, sẵn sàng trước ngày cần dùng.')}

<h3>Đề bài</h3>
${ra(DE_VI)}

<h3>Các sản phẩm khớp với nhau thế nào</h3>
${flow([
  ['D1–D3 · hồ sơ', 'thứ giúp bạn được gọi phỏng vấn', 'CV đưa ra một khẳng định; GitHub và LinkedIn chứng minh nó. Một câu chuyện kể ba cách, khớp nhau về ngày tháng và vai trò.'],
  ['D4–D5 · giọng nói', 'thứ bạn nói trong mười phút đầu', 'Lời giới thiệu và năm câu chuyện phủ phần lớn câu hỏi hành vi (Chương 3).'],
  ['D6 · độ sâu', 'thứ bạn nói ở vòng kỹ thuật', 'Hai mươi câu theo hướng của bạn (Chương 4–7), câu nào cũng neo vào dự án của chính bạn.'],
  ['D7 · tổng duyệt', 'bằng chứng nó chạy được dưới áp lực giờ', 'Một buổi thử trọn 60 phút (bài 10.4).'],
  ['D8 · đường ống', 'thứ biến bộ hồ sơ thành offer', 'Mười lăm đơn thật có bước tiếp theo, và quyết định ngày 10/12.'],
])}

<h3>Rubric — 100 điểm</h3>
${bang(['Sản phẩm', 'Điểm', 'Đủ điểm khi…'], [
  ['D1 CV', '15', 'Một trang; gạch đầu dòng nào cũng có hành động và kết quả cụ thể; kỹ năng khớp bằng chứng; không có dòng nào không giải thích được'],
  ['D2 GitHub', '15', '2–3 repo ghim có README đầy đủ, ảnh màn hình thật, mục "vai trò của tôi" rõ ràng, lịch sử commit không lộ bí mật'],
  ['D3 LinkedIn', '5', 'Headline nói rõ vị trí nhắm tới; About khớp CV; có liên kết dự án'],
  ['D4 Năm câu chuyện STAR', '20', 'Đủ năm loại; câu nào cũng có nguyên nhân thật và "sau đó đã đổi gì"; dưới 2 phút'],
  ['D5 Giới thiệu VI + EN', '10', 'Mỗi bản 60–90 giây, ba khối, có câu trung thực về AI, từ khoá đọc rõ'],
  ['D6 Ngân hàng kỹ thuật', '15', '20 câu trả lời bằng lời của bạn, câu nào cũng có ví dụ từ dự án và một câu đào sâu đã chuẩn bị'],
  ['D7 Buổi thử cuối', '15', 'Có ghi hình, chấm bằng phiếu, ba câu yếu nhất đã viết lại'],
  ['D8 Bảng theo dõi', '5', '15+ đơn thật, dòng nào cũng có bước tiếp theo kèm ngày'],
])}
<p>Điểm đạt: <strong>70</strong>. Dưới 70 thì sửa sản phẩm có điểm thấp nhất trước — thường là D1 hoặc D4, vì chúng quyết định bạn có được gọi phỏng vấn không và mười phút đầu diễn ra thế nào.</p>
${bay('vi', 'mài CV cả tuần mà không gửi đi đơn nào.', 'Bộ hồ sơ là "v1.0", không phải hoàn hảo. D8 có mặt để CV được gửi đi trước 29/11 và bắt đầu thu phản hồi thật. Một CV tốt đã gửi thắng một CV hoàn hảo vẫn còn là bản nháp vào ngày 10/12.')}

<h3>Chia việc theo ngày</h3>
${bang(['Ngày', 'Việc', 'Bài liên quan'], [
  ['20–23/11', 'D1 nháp CV và nhờ duyệt; D3 LinkedIn', '1.1, 1.2, 1.4, 10.2'],
  ['24–29/11', 'D2 README GitHub; chốt D1; 5 đơn đầu tiên', '1.3, 10.2'],
  ['30/11–3/12', 'D4 câu chuyện; D5 lời giới thiệu; thêm 5 đơn', '2.1–2.3, 8.1, 10.3'],
  ['4–6/12', 'D6 ngân hàng kỹ thuật theo hướng của bạn', 'Ch4/5/6, Ch7'],
  ['7–8/12', 'D7 buổi thử cuối và viết lại câu yếu', '9.1, 10.4'],
  ['9–10/12', 'Soát D8; điểm quyết định', '9.3, 9.4'],
])}
${neu('vi', 'bạn có một buổi phỏng vấn thật vào 2/12, khi D6 chưa xong? Sắp xếp lại ưu tiên: đọc lại tin tuyển dụng của công ty đó, làm D6 chỉ cho các kỹ năng tin đó liệt kê, và tính buổi phỏng vấn ấy là một phần của D7. Kế hoạch phục vụ việc ứng tuyển, không phải ngược lại.')}
${keXau('vi', 'thư mục bộ hồ sơ sẽ chứa CV, số điện thoại, bản ghi giọng nói và khuôn mặt, có khi cả ảnh chụp giấy tờ. Đừng để nó trong một kho mã công khai hay một ổ chia sẻ "ai có link cũng mở được". Nếu bạn đưa chính bộ hồ sơ lên GitHub để theo dõi, hãy để kho đó ở chế độ riêng tư, và không bao giờ commit giấy tờ tuỳ thân.')}

${thucHanh('vi', { phut: '30', steps: [
  'Tạo <code>~/interview-kit/kit.md</code> liệt kê tám sản phẩm, hạn chót và một cột trạng thái.',
  'Chép bảng chia việc theo ngày vào lịch với ràng buộc thật của bạn (lịch thi, block 5).',
  'Tự chấm tình trạng hiện tại theo rubric một cách thật lòng — đây là mốc ban đầu.',
  'Chọn người sẽ duyệt D1 và D7 và nhắn họ ngay bây giờ.',
], dat: 'kit.md có tám sản phẩm kèm ngày và điểm mốc ban đầu, kế hoạch đã vào lịch, và đã có người nhận lời duyệt.' })}
${thuatNgu('vi', [
  ['Deliverable (sản phẩm phải nộp)', 'Một sản phẩm cụ thể bạn phải giao.'],
  ['Brief (đề bài)', 'Mô tả một đầu việc: làm gì, hạn khi nào, ràng buộc gì.'],
  ['Rubric (bảng chấm)', 'Lưới chấm điểm nói rõ thế nào là đủ điểm.'],
  ['Baseline (mốc ban đầu)', 'Điểm của bạn trước khi bắt đầu, để đo tiến bộ.'],
  ['Pipeline (đường ống ứng tuyển)', 'Dòng chảy các lá đơn từ lúc gửi tới lúc có trả lời.'],
])}
${tomTat('vi', [
  'Dự án cuối khoá là bộ hồ sơ ứng tuyển của bạn: tám sản phẩm với hạn chót thật.',
  'Hồ sơ (D1–D3) giúp được gọi; giọng nói (D4–D5) và độ sâu (D6) giúp thắng; buổi thử (D7) chứng minh; bảng theo dõi (D8) biến tất cả thành offer.',
  'Điểm đạt 70/100; sửa sản phẩm thấp điểm nhất trước.',
  'Gửi CV trước 29/11 — bản v1.0, không phải hoàn hảo.',
  'Giữ bộ hồ sơ riêng tư và không có bí mật.',
])}
${lienQuan('vi', [
  yt('ZU9x1vFx5lI', 'Harvard Business Review', 'Stand Out in a Job Interview', 10),
  lienKet({ khoa: 'interview-prep', bai: 'pv-0-3-lab-bang-ung-tuyen', title: 'IT Interview Prep 0.3 — Lab 0: bảng điều khiển tìm việc', sub: 'D8 chính là bảng này, giờ có mười lăm đơn thật.' }),
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-2-1-cv-portfolio', academy: true, title: 'Academy · OJT202 2.1 — CV, portfolio và chuẩn bị phỏng vấn', sub: 'Điều phối viên OJT mong thấy gì trong hồ sơ của bạn.' }),
])}
</div>
`,
};

/* ═══════════════════════ 10.2 — CV + GitHub + LinkedIn ═══════════════════════ */
const CV_MAU = `
[YOUR NAME]                                                    Backend Developer Intern
[City] · [phone] · [email] · github.com/[you] · linkedin.com/in/[you] · cuongthai.com

SUMMARY
Software engineering student (FPT University) who builds and operates a production
learning platform. Looking for a backend internship (Node.js or Java) from Spring 2027.

PROJECTS
cuongthai.com — learning platform with courses, a Jira-like tracker and a desktop app   2026 – present
Next.js · Express/TypeScript · PostgreSQL/Prisma · Redis · Docker · nginx · Cloudflare R2
- Designed and operate the production setup: Docker Compose on an Ubuntu server behind nginx;
  images built on a home machine and pushed to a registry, cutting build time per deploy
  from ~15 min to ~3-6 min and removing build cache from the database disk.
- Added a post-deploy smoke test that fails the deploy when a core API route returns 404,
  catching stale builds before users do.
- After a 7-minute API outage (base image with musl, database engine built for glibc),
  rolled back and added a pre-push check that compares the two.
- Built with AI coding assistants; my responsibility: architecture, code review,
  deployment and incident response.

LabFlow AI — capstone: lab equipment booking with IoT status          10/2026 – present (in progress)
Spring Boot · React · PostgreSQL
- Hand-coded modular monolith; modules communicate only through interfaces.
- 46 requirements planned and tracked as tickets with weekly milestones.

EDUCATION
FPT University — B.Sc. Software Engineering                                  expected 2028
Relevant: OOP (Java), Databases, Software Testing, Software Requirements, React

SKILLS
Languages: TypeScript, JavaScript, Java, SQL
Backend: Node.js/Express, Prisma, REST APIs · Spring Boot (learning)
DevOps: Git/GitHub, Docker & Compose, nginx, Linux (Ubuntu), CI with GitHub Actions
Frontend: React, Next.js (basic)
English: reads technical documentation daily; spoken English improving
`;

const README_MAU = `
# LabFlow AI
Lab equipment booking for a university lab: students book devices, staff approve,
sensors report device status.  Status: in progress (capstone, Oct 2026 - Feb 2027).

## Why
Labs track bookings on paper and chat; double bookings and lost devices are common.

## Run it locally
  docker compose up -d db
  ./mvnw spring-boot:run          # API on http://localhost:8080
  cd web && npm install && npm run dev

## Architecture
  React (web) -> Spring Boot API (modules: booking, device, user) -> PostgreSQL
  (screenshot of the diagram: docs/architecture.png)

## My role
Solo project. I wrote all of the code by hand; I used AI tools to explain concepts.

## Screens
  docs/screens/booking.png · docs/screens/approve.png

## What I would improve next
Load testing the booking API; notifications when a device goes offline.
`;

const L102 = {
  title: '10.2 — Deliverables D1–D3: the CV, the GitHub profile and LinkedIn, checked line by line|||10.2 — Sản phẩm D1–D3: CV, GitHub và LinkedIn, soát từng dòng',
  slug: 'pv-10-2-ho-so',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hoàn thiện ba sản phẩm hồ sơ: CV một trang mẫu dựng từ dự án thật (cuongthai.com và LabFlow AI, có câu trung thực về AI và số đo thật), khung README cho repo ghim, checklist LinkedIn, bài kiểm "ba câu đào sâu" cho từng dòng CV, quét lộ bí mật trong lịch sử Git, và rubric 35 điểm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>D1–D3 — the CV, GitHub and LinkedIn, checked line by line</h2>
<p class="lead">Chapter 1 taught how to write each piece. This lesson finishes them as one consistent profile: a CV whose every bullet survives three follow-up questions, GitHub repositories whose READMEs answer what a reviewer looks for in thirty seconds, and a LinkedIn profile that tells the same story. You will check everything against a model built from real projects and a 35-point rubric.</p>

<h3>An everyday picture: a shop window and the shop</h3>
${doiThuong('en', 'A CV is the shop window; GitHub is the shop. A beautiful window with an empty shop disappoints, and a great shop with a dirty window gets no visitors. Recruiters look at the window for a few seconds; engineers walk into the shop. Both must show the same goods.')}

<h3>A model CV built from real projects</h3>
${ra(CV_MAU)}
<p>What makes it work: every project bullet has an <strong>action verb</strong>, a <strong>concrete result</strong> and, where measured, a <strong>number</strong> (build time, outage length). The AI line is short and placed under the project it concerns. The capstone is marked "in progress" and "hand-coded". English is described honestly. Nothing says "expert", "proficient" or "passionate".</p>

<h3>The three-follow-ups test, for every line</h3>
${flow([
  ['Line', '"Added a post-deploy smoke test that fails on 404"', 'Read the bullet aloud.'],
  ['Follow-up 1', '"Why 404 and not 500?"', 'Because 404 means the route is not mounted — the old build is running; 401 or 200 means the route exists.'],
  ['Follow-up 2', '"How is it run?"', 'A script hits a list of core GET routes on the internal backend after the containers are swapped.'],
  ['Follow-up 3', '"What would you change?"', 'Check a few authenticated routes with a test account, and alert instead of only failing the deploy.'],
])}
<p>If you cannot answer the third follow-up, the line stays but you study it, or you rewrite it at the level you can defend.</p>

<h3>The README every pinned repository needs</h3>
${ra(README_MAU)}
${stack([
  ['Profile README', 'Two or three lines: who you are, what you are looking for, links to the pinned repositories.'],
  ['Pinned: 2–3 repos', 'Your strongest evidence, matching the CV order. A tutorial clone is not evidence.'],
  ['Each README', 'What and why, how to run, architecture, my role, screenshots, what I would improve.'],
  ['History', 'No .env, keys or passwords anywhere in the commit history — not only in the latest version.'],
])}
${bay('en', 'pinning a private or broken project.', 'Before pinning, open each repository in a private browser window on your phone: is it public, does the README render, do the screenshots load? A pinned repo that says "404" or shows an empty README is worse than not pinning it.')}
${keXau('en', 'automated bots scan public GitHub repositories for leaked keys within minutes of a push, and a key deleted in a later commit is still in the history. Before making a repository public, search its history for secrets (for example with a secret scanner, or by searching the log for "KEY", "SECRET", "password"). If a real key was ever committed, rotate it at the provider first — rewriting history is not enough.')}

<h3>LinkedIn checklist</h3>
${kv([
  ['Photo', 'Clear face, neutral background; it raises trust far more than a perfect description.'],
  ['Headline', '"Software Engineering student · Backend (Node.js / Java) · looking for an internship" — not just "Student at FPT University".'],
  ['About', 'Three to five sentences — the same story as your introduction (Lesson 2.1).'],
  ['Projects / Experience', 'The two CV projects, with links and the same dates.'],
  ['Education and skills', 'Consistent with the CV; skills only with evidence.'],
  ['Open to work', 'Visible to recruiters only, if you prefer.'],
])}

<h3>Rubric for D1–D3 (35 points)</h3>
${rubric('en', [
  ['CV length and layout (×2)', 'Over one page or dense', 'One page, uneven', 'One page, clean, PDF with selectable text'],
  ['CV bullets (×3)', 'Duties, no results', 'Some results', 'Every bullet: action + concrete result'],
  ['Honesty (×2)', 'Claims you cannot defend', 'Mostly defensible', 'Every line passes three follow-ups; AI use stated'],
  ['GitHub READMEs (×3)', 'Missing or empty', 'Partial', 'All six sections, screenshots load'],
  ['GitHub hygiene (×2)', 'Secrets or broken repos', 'Minor issues', 'Clean history, public, renders on phone'],
  ['LinkedIn (×2)', 'Default profile', 'Partly filled', 'Photo, headline, About, projects consistent with CV'],
  ['Consistency (×3)', 'Dates or roles differ', 'Small mismatches', 'Same story across CV, GitHub, LinkedIn'],
])}
<p>Each row scores 0–2 times its weight; the weights add to 17, so the maximum is 34 — round up to 35 when everything is consistent and a reviewer has read it.</p>
${neu('en', 'a reviewer says your CV looks "too strong for an intern" and asks whether it is exaggerated? That is the best possible test. Walk them through the three follow-ups for the strongest bullet. If you can, the CV is honest and strong; if you cannot, rewrite that bullet today.')}

${thucHanh('en', { phut: '90–120', steps: [
  'Rewrite your CV against the model, then run the three-follow-ups test aloud on every bullet.',
  'Write or fix the README of each pinned repository with the six sections; check them on your phone.',
  'Scan the history of each public repository for secrets; rotate any real key you find.',
  'Update LinkedIn with the checklist; compare dates and roles across all three.',
  'Score with the rubric, and send the CV to your reviewer.',
], dat: 'the CV, two or three READMEs and LinkedIn tell the same story, every CV line passes three follow-ups, no secret is in any history, and the rubric score is at least 28.' })}
${thuatNgu('en', [
  ['Action verb', 'A verb that says what you did: designed, added, reduced, fixed.'],
  ['Pinned repository', 'A repository shown at the top of your GitHub profile.'],
  ['Profile README', 'The README of the repository named after your username, shown on your profile.'],
  ['Secret scanning', 'Searching code and history for leaked keys or passwords.'],
  ['Rotate a key', 'Revoke the old key and issue a new one.'],
  ['Headline', 'The line under your name on LinkedIn.'],
])}
${tomTat('en', [
  'The CV is the window, GitHub the shop: both must show the same goods.',
  'Every bullet: action + concrete result; numbers only if measured.',
  'Run the three-follow-ups test on every line; rewrite what you cannot defend.',
  'Each pinned README: what/why, run, architecture, my role, screens, improvements.',
  'Scan history for secrets; a leaked key must be rotated, not just deleted.',
  'Keep CV, GitHub and LinkedIn consistent in dates and roles.',
])}
${lienQuan('en', [
  yt('QDfLou004iE', 'Keith Galli', 'How to make your GitHub more impressive to Employers (5 simple tips)', 19, 'en'),
  lienKet({ khoa: 'git', bai: 'git-15-1-ho-so-github', L: 'en', title: 'Git 15.1 — Your GitHub profile as a CV', sub: 'Profile README, pins and project READMEs in depth.' }),
  lienKet({ khoa: 'git', bai: 'git-8-3-go-bi-mat', L: 'en', title: 'Git 8.3 — Removing a leaked secret from all of history', sub: 'And why rotating the key comes first.' }),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>D1–D3 — CV, GitHub và LinkedIn, soát từng dòng</h2>
<p class="lead">Chương 1 đã dạy cách viết từng mảnh. Bài này hoàn thiện chúng thành một hồ sơ nhất quán: một CV mà gạch đầu dòng nào cũng sống sót qua ba câu đào sâu, các repo GitHub có README trả lời đúng điều người duyệt tìm trong ba mươi giây, và một hồ sơ LinkedIn kể cùng một câu chuyện. Bạn sẽ đối chiếu mọi thứ với một bản mẫu dựng từ dự án thật và một rubric 35 điểm.</p>

<h3>Liên tưởng đời thường: tủ kính và cửa hàng</h3>
${doiThuong('vi', 'CV là tủ kính; GitHub là cửa hàng. Tủ kính đẹp mà cửa hàng trống thì khách thất vọng, còn cửa hàng tốt mà tủ kính bẩn thì chẳng ai bước vào. Người tuyển dụng nhìn tủ kính vài giây; kỹ sư thì bước vào cửa hàng. Cả hai phải bày cùng một món hàng.')}

<h3>Một CV mẫu dựng từ dự án thật</h3>
${ra(CV_MAU)}
<p>CV viết bằng tiếng Anh vì phần lớn công ty IT ở Việt Nam đọc CV tiếng Anh, và nó dùng được cho cả nơi nước ngoài. Giải nghĩa vài dòng then chốt:</p>
<ul>
<li>"Designed and operate the production setup… cutting build time per deploy from ~15 min to ~3–6 min and removing build cache from the database disk" = "thiết kế và vận hành hệ thống chạy thật… rút thời gian build mỗi lần deploy từ ~15 phút xuống ~3–6 phút và đưa cache build ra khỏi ổ đĩa chứa CSDL". Đây là số đo thật của dự án: build trên VPS mất khoảng 15 phút, ở máy nhà 3–6 phút, và cache build từng phình 7,6 GB trên chính đĩa chứa Postgres.</li>
<li>"After a 7-minute API outage… rolled back and added a pre-push check" = "sau một lần API chết bảy phút… quay lui và thêm bước kiểm trước khi đẩy ảnh".</li>
<li>"Built with AI coding assistants; my responsibility: architecture, code review, deployment and incident response" = câu trung thực về AI, đặt ngay dưới dự án liên quan.</li>
<li>"Hand-coded modular monolith" = "monolith chia mô-đun, tự code tay" — bằng chứng kỹ năng code thuần. "(in progress)" = đang làm.</li>
<li>"spoken English improving" = "tiếng Anh nói đang cải thiện" — trung thực, không phải điểm trừ.</li>
</ul>
<p>Điều làm nó hiệu quả: gạch đầu dòng nào cũng có <strong>động từ hành động</strong>, <strong>kết quả cụ thể</strong> và, ở chỗ có đo, một <strong>con số</strong>. Không có chữ "expert", "proficient" hay "passionate".</p>

<h3>Bài kiểm "ba câu đào sâu" cho từng dòng</h3>
${flow([
  ['Dòng CV', '"Added a post-deploy smoke test that fails on 404"', 'Đọc to gạch đầu dòng đó.'],
  ['Đào sâu 1', '"Vì sao là 404 mà không phải 500?"', 'Vì 404 nghĩa là route chưa được gắn — bản build cũ đang chạy; 401 hay 200 nghĩa là route có tồn tại.'],
  ['Đào sâu 2', '"Nó chạy thế nào?"', 'Một script gọi danh sách các route GET cốt lõi vào backend nội bộ, ngay sau khi tráo container.'],
  ['Đào sâu 3', '"Em sẽ cải tiến gì?"', 'Kiểm thêm vài route cần đăng nhập bằng tài khoản thử, và gửi cảnh báo thay vì chỉ làm deploy thất bại.'],
])}
<p>Nếu bạn không trả lời được câu đào sâu thứ ba, dòng đó vẫn giữ nhưng bạn phải học thêm về nó, hoặc viết lại ở mức bạn bảo vệ được.</p>

<h3>README mà repo ghim nào cũng cần</h3>
${ra(README_MAU)}
${stack([
  ['README hồ sơ', 'Hai ba dòng: bạn là ai, bạn đang tìm gì, link tới các repo ghim.'],
  ['Ghim 2–3 repo', 'Bằng chứng mạnh nhất, cùng thứ tự với CV. Một bản chép theo tutorial không phải bằng chứng.'],
  ['Mỗi README', 'Là gì và vì sao, cách chạy, kiến trúc, vai trò của tôi, ảnh màn hình, sẽ cải tiến gì.'],
  ['Lịch sử commit', 'Không có .env, khoá hay mật khẩu ở BẤT KỲ đâu trong lịch sử — không chỉ ở bản mới nhất.'],
])}
${bay('vi', 'ghim một dự án riêng tư hoặc đang hỏng.', 'Trước khi ghim, mở từng repo bằng cửa sổ ẩn danh trên điện thoại: nó có công khai không, README có hiện không, ảnh màn hình có tải được không? Một repo ghim báo "404" hay README trống còn tệ hơn là không ghim.')}
${keXau('vi', 'bot tự động quét các repo GitHub công khai để tìm khoá bị lộ chỉ vài phút sau mỗi lần push, và một khoá bị xoá ở commit sau vẫn còn nằm trong lịch sử. Trước khi chuyển repo sang công khai, hãy tìm bí mật trong lịch sử của nó (ví dụ bằng công cụ quét bí mật, hoặc tìm trong log các chữ "KEY", "SECRET", "password"). Nếu một khoá thật từng bị commit, hãy XOAY khoá đó ở nhà cung cấp trước — viết lại lịch sử thôi là chưa đủ.')}

<h3>Checklist LinkedIn</h3>
${kv([
  ['Ảnh', 'Rõ mặt, nền trung tính; tăng độ tin cậy nhiều hơn một đoạn mô tả hoàn hảo.'],
  ['Headline (dòng dưới tên)', '"Software Engineering student · Backend (Node.js / Java) · looking for an internship" — đừng chỉ "Student at FPT University".'],
  ['About', 'Ba tới năm câu — cùng câu chuyện với lời giới thiệu (bài 2.1).'],
  ['Projects / Experience', 'Hai dự án trong CV, có link và cùng ngày tháng.'],
  ['Học vấn và kỹ năng', 'Khớp với CV; kỹ năng chỉ ghi khi có bằng chứng.'],
  ['Open to work', 'Có thể để chỉ recruiter mới thấy, nếu bạn muốn.'],
])}

<h3>Rubric cho D1–D3 (35 điểm)</h3>
${rubric('vi', [
  ['Độ dài và trình bày CV (×2)', 'Quá một trang hoặc dày đặc', 'Một trang, chưa đều', 'Một trang, gọn, PDF chọn được chữ'],
  ['Gạch đầu dòng CV (×3)', 'Liệt kê nhiệm vụ, không có kết quả', 'Một số có kết quả', 'Dòng nào cũng: hành động + kết quả cụ thể'],
  ['Trung thực (×2)', 'Có khẳng định không bảo vệ được', 'Phần lớn bảo vệ được', 'Mọi dòng qua ba câu đào sâu; nói rõ việc dùng AI'],
  ['README GitHub (×3)', 'Thiếu hoặc trống', 'Có một phần', 'Đủ sáu mục, ảnh tải được'],
  ['Vệ sinh GitHub (×2)', 'Lộ bí mật hoặc repo hỏng', 'Lỗi nhỏ', 'Lịch sử sạch, công khai, hiện tốt trên điện thoại'],
  ['LinkedIn (×2)', 'Hồ sơ mặc định', 'Điền một phần', 'Ảnh, headline, About, dự án khớp với CV'],
  ['Nhất quán (×3)', 'Ngày tháng hoặc vai trò lệch nhau', 'Lệch nhỏ', 'Cùng một câu chuyện trên CV, GitHub, LinkedIn'],
])}
<p>Mỗi dòng được 0–2 điểm nhân trọng số; tổng trọng số là 17 nên tối đa 34 — làm tròn lên 35 khi mọi thứ nhất quán và đã có người duyệt đọc.</p>
${neu('vi', 'người duyệt nói CV của bạn "mạnh quá so với thực tập sinh" và hỏi có phóng đại không? Đó là phép thử tốt nhất có thể. Dẫn họ qua ba câu đào sâu cho dòng mạnh nhất. Nếu bạn làm được, CV vừa trung thực vừa mạnh; nếu không, viết lại dòng đó ngay hôm nay.')}

${thucHanh('vi', { phut: '90–120', steps: [
  'Viết lại CV theo bản mẫu, rồi chạy bài kiểm ba câu đào sâu thành tiếng cho từng gạch đầu dòng.',
  'Viết hoặc sửa README của từng repo ghim theo sáu mục; kiểm trên điện thoại.',
  'Quét lịch sử của từng repo công khai tìm bí mật; xoay mọi khoá thật bạn tìm thấy.',
  'Cập nhật LinkedIn theo checklist; so ngày tháng và vai trò giữa cả ba nơi.',
  'Chấm theo rubric, và gửi CV cho người duyệt.',
], dat: 'CV, hai ba README và LinkedIn kể cùng một câu chuyện, mọi dòng CV qua được ba câu đào sâu, không lịch sử nào chứa bí mật, và điểm rubric ít nhất 28.' })}
${thuatNgu('vi', [
  ['Action verb (động từ hành động)', 'Động từ nói bạn đã làm gì: designed, added, reduced, fixed.'],
  ['Pinned repository (repo ghim)', 'Repo hiện ở đầu trang GitHub của bạn.'],
  ['Profile README (README hồ sơ)', 'README của repo trùng tên tài khoản, hiện ngay trên trang hồ sơ.'],
  ['Secret scanning (quét bí mật)', 'Tìm khoá hay mật khẩu bị lộ trong mã và lịch sử.'],
  ['Rotate a key (xoay khoá)', 'Thu hồi khoá cũ và cấp khoá mới.'],
  ['Headline', 'Dòng ngay dưới tên bạn trên LinkedIn.'],
])}
${tomTat('vi', [
  'CV là tủ kính, GitHub là cửa hàng: cả hai phải bày cùng một món hàng.',
  'Gạch đầu dòng nào cũng: hành động + kết quả cụ thể; chỉ ghi số khi đã đo.',
  'Chạy bài kiểm ba câu đào sâu cho mọi dòng; viết lại thứ không bảo vệ được.',
  'Mỗi README ghim: là gì/vì sao, cách chạy, kiến trúc, vai trò, ảnh, cải tiến.',
  'Quét lịch sử tìm bí mật; khoá đã lộ phải xoay, không chỉ xoá.',
  'Giữ CV, GitHub và LinkedIn khớp nhau về ngày tháng và vai trò.',
])}
${lienQuan('vi', [
  yt('QDfLou004iE', 'Keith Galli', 'How to make your GitHub more impressive to Employers (5 simple tips)', 19),
  lienKet({ khoa: 'git', bai: 'git-15-1-ho-so-github', title: 'Git 15.1 — Trang GitHub như một bản CV', sub: 'README hồ sơ, repo ghim và README dự án, nói kỹ.' }),
  lienKet({ khoa: 'git', bai: 'git-8-3-go-bi-mat', title: 'Git 8.3 — Gỡ một bí mật bị lộ khỏi toàn bộ lịch sử', sub: 'Và vì sao phải xoay khoá trước tiên.' }),
])}
</div>
`,
};

/* ═══════════════════════ 10.3 — Năm câu chuyện STAR ═══════════════════════ */
const L103 = {
  title: '10.3 — Deliverable D4: five STAR stories every candidate needs, with full models from real projects|||10.3 — Sản phẩm D4: năm câu chuyện STAR ứng viên nào cũng cần, kèm bản mẫu đầy đủ từ dự án thật',
  slug: 'pv-10-3-nam-cau-chuyen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Năm câu chuyện bắt buộc của bộ hồ sơ — dự án tự hào, sự cố/sai lầm, bất đồng trong làm nhóm, học nhanh, áp lực hạn chót — mỗi câu kèm danh sách câu hỏi nó trả lời được, khung điền, bản mẫu đầy đủ từ chuyện thật của cuongthai.com và LabFlow AI, bảng phủ câu hỏi, và phiếu chấm từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>D4 — five stories that answer almost every behavioural question</h2>
<p class="lead">Behavioural interviews seem to have endless questions, but they draw from a small set of themes. Five well-prepared stories — each told in under two minutes, each adaptable — cover most of them. This lesson defines the five, shows which questions each one answers, and gives full models built from real events in a student’s own projects, so you can see the level of detail that works.</p>

<h3>An everyday picture: a small wardrobe that goes with everything</h3>
${doiThuong('en', 'A traveller with a small suitcase does not pack an outfit for every possible event. They pack five pieces that combine — a shirt that works for dinner and for a meeting. Your five stories are that capsule wardrobe: the same "incident" story answers "a mistake you made", "working under pressure" and "something you are proud of fixing", with a different first sentence.')}

<h3>The five stories and what they answer</h3>
${bang(['Story', 'Answers questions like', 'Must show'], [
  ['1 · Proud project', 'Your best work; a technical challenge; why should we hire you', 'A decision you made and a measurable result'],
  ['2 · Incident or mistake', 'A failure; a mistake; a bug in production; what you learned', 'Ownership without blame, a real cause, what changed afterwards'],
  ['3 · Disagreement / teamwork', 'A conflict; you disagreed with someone; working in a team', 'Listening, criteria, a respectful decision'],
  ['4 · Learning fast', 'Learning a new technology; a time you did not know how', 'How you learn, not only that you learned'],
  ['5 · Pressure / deadline', 'Working under pressure; prioritising; an urgent problem', 'Calm order of actions, protecting what matters most'],
])}
${flow([
  ['S · Situation', '1–2 sentences', 'Where, when, what was at stake. Enough context, no more.'],
  ['T · Task', '1 sentence', 'What you specifically had to achieve.'],
  ['A · Action', '3–5 sentences — the longest part', 'What YOU did, in order, with the reasons. "I", not "we".'],
  ['R · Result', '1–2 sentences + lesson', 'The outcome, a number if measured, and what changed afterwards.'],
])}
<p>Full models follow. They are real events from one student’s projects, written truthfully — including the role of AI tools. Read them for the level of detail; write yours from your own events.</p>

<details><summary>Story 1 · Proud project — moving builds off the production server</summary>
<p><strong>S:</strong> My learning platform runs in Docker on a small Linux server. Each deploy built the images on that server: about fifteen minutes, sequentially, because parallel builds had been killed for running out of memory. The build cache had also grown to 7.6 GB on the same disk as the database.</p>
<p><strong>T:</strong> Make deploys faster and safer without paying for a bigger server.</p>
<p><strong>A:</strong> I moved image building to a more powerful machine at home: it builds both images in parallel and pushes them to a container registry, and the server only pulls and swaps the containers. I asked for a check that the base image and the database engine use the same C library before pushing, kept the old server-side deploy as a fallback, and kept a smoke test that fails the deploy if a core route returns 404. An AI assistant wrote much of the script; I designed the flow and tested the failure cases.</p>
<p><strong>R:</strong> Builds take about three to six minutes, and the build cache no longer lives on the database disk. I learned that the slow part of a system is often not the code but where the work happens.</p>
</details>
<details><summary>Story 2 · Incident or mistake — a rename that passed every check and still broke production</summary>
<p><strong>S:</strong> I renamed an enum value in the database schema so it matched the frontend.</p>
<p><strong>T:</strong> Ship the rename without breaking anything — my change, my responsibility.</p>
<p><strong>A:</strong> I ran the full pre-push checklist: type check, build, migration. All green. After deploy, the seed script failed on production. I investigated and found two causes: the seed file had its own hand-written copy of the enum values, and the TypeScript configuration excluded the seed folder, so nothing checked it. I fixed the seed to import the type from the generated client, added a separate type-check for the seed files, and added "run the seed" to the checklist for every schema change.</p>
<p><strong>R:</strong> This class of error is now caught before deploy. The lesson I keep: green checks only mean the checks passed — I verify what the checker actually covers.</p>
</details>
<details><summary>Story 3 · Disagreement — microservices or a modular monolith for the capstone</summary>
<p><strong>S:</strong> For my capstone, LabFlow AI, a senior who had graduated advised microservices, because teams using them were often praised.</p>
<p><strong>T:</strong> Choose an architecture I could actually deliver in twenty weeks, working alone.</p>
<p><strong>A:</strong> I thanked him and wrote down the criteria: one developer, twenty weeks, still learning React and databases, and grading based on a working product and a defence. Microservices would add deployment, networking and data-consistency work without helping users. I chose a modular monolith, with five rules that keep it splittable later — for example, modules talk only through interfaces and never join each other’s tables. I explained the reasoning to him and recorded the decision in the project documents.</p>
<p><strong>R:</strong> The architecture was fixed in the second week of the project and has stayed the plan since; the decision and its reasons are written down, so anyone can challenge it with new criteria. I learned to answer advice with criteria, not with opinions. (For group conflicts, tell a story from a team project — same structure.)</p>
</details>
<details><summary>Story 4 · Learning fast — regaining server access from a network that blocked SSH</summary>
<p><strong>S:</strong> My school’s network blocked the standard SSH port, so I could not reach my production server from campus.</p>
<p><strong>T:</strong> Regain access without risking the existing access path or the running site.</p>
<p><strong>A:</strong> The obvious fix — change the port in the SSH configuration and reload — would not behave as I expected. I read how Ubuntu 24.04 starts SSH: through systemd socket activation, where the port is held by a socket unit. Changing that socket on a live server could drop the existing connections. So I added a separate SSH service on another port that the school network allows, with checks that remove it automatically if anything fails, and left the original untouched. I also used a CI runner as a backup way in.</p>
<p><strong>R:</strong> I can work on the server from campus, and the original access was never at risk. I learned to survey how a system really works before changing it.</p>
</details>
<details><summary>Story 5 · Pressure — the deploy that filled the disk next to the database</summary>
<p><strong>S:</strong> During a deploy, the build failed with "no space left on device". Free space had fallen to 1.8 GB, on the disk that also holds the PostgreSQL data.</p>
<p><strong>T:</strong> Restore a working deploy quickly, without endangering the database.</p>
<p><strong>A:</strong> The rule was: protect the database first. Check that PostgreSQL is still healthy, find what filled the disk — the Docker build cache — and remove only that, never a broad cleanup command that can also delete volumes. Then fix the cause: builds moved off the server (Story 1), and a weekly scheduled cleanup reclaims disk space automatically. <em>(This model keeps to the recorded facts — the error, 1.8 GB, the move of builds, the weekly cleanup. In your own story, tell only the steps you really took.)</em></p>
<p><strong>R:</strong> No data was lost, and since the builds moved off the server the problem has not returned. Under pressure, I now ask first: "what must not break?" — and protect that before fixing anything else.</p>
</details>

<h3>Coverage check</h3>
<p>Take the bank of 30 behavioural questions (Lesson 3.4). For each, write which of your five stories answers it. Every question should map to at least one story; if many map to none, you are missing a theme — often "disagreement" or "helping someone else".</p>
${bay('en', 'telling the same story to every question without changing the opening.', 'The interviewer hears "a mistake" and you start with "I’m proud of…". Keep the facts, but change the first sentence and the emphasis to match the question: for "a mistake", start with your own error; for "pressure", start with the clock.')}
${neu('en', 'you have no "team conflict" story because your capstone is solo? Use a group project from an earlier course (SWP391 or another team assignment) — disagreements about task split or deadlines count. If you truly have none, the "advice you disagreed with" story above is a real disagreement; say honestly that it was one-on-one.')}
${keXau('en', 'do not use stories that reveal confidential details of an employer or a client (names, systems, figures) — the interviewer will wonder what you will tell the next company about them. And never invent a story: behavioural interviewers ask three or four follow-ups precisely to detect invented details.')}

<h3>Scoring each story (out of 8)</h3>
${rubric('en', [
  ['Length', 'Over 3 minutes', '2–3 minutes', 'Under 2 minutes'],
  ['"I" in the action', 'Mostly "we"', 'Mixed', 'Clear personal actions with reasons'],
  ['Result', 'None', 'Vague', 'Concrete, measured where possible'],
  ['Afterwards', 'Nothing changed', 'A lesson only', 'A lesson plus a changed process or check'],
])}

${thucHanh('en', { phut: '120 (over two days)', steps: [
  'Write your five stories in STAR, each at most 250 words, in <code>~/interview-kit/stories/</code>.',
  'Record each one; cut until each is under two minutes.',
  'Run the coverage check against the 30 questions of Lesson 3.4.',
  'Score each story; rewrite any story below 6/8.',
], dat: 'five written and recorded stories under two minutes, each scoring at least 6/8, and every one of the 30 questions mapped to a story.' })}
${thuatNgu('en', [
  ['STAR', 'Situation, Task, Action, Result — the structure of a behavioural answer.'],
  ['Story bank', 'Your set of prepared stories, reused across questions.'],
  ['Coverage', 'Which questions each story can answer.'],
  ['Ownership', 'Saying clearly what you did, including your mistakes.'],
  ['Socket activation', 'systemd holding a port and starting the service when a connection arrives.'],
])}
${tomTat('en', [
  'Five stories — proud project, incident, disagreement, learning, pressure — cover most behavioural questions.',
  'Action is the longest part; use "I" and give reasons.',
  'Every result should include what changed afterwards.',
  'Adapt the opening sentence to the question; keep the facts.',
  'Use real events only, and keep employer and client details confidential.',
])}
${lienQuan('en', [
  yt('p8JTbk5UoFM', 'Aced (formerly Exponent)', 'The best stories to tell in behavioral interviews: creating a story bank', 3, 'en'),
  lienKet({ khoa: 'interview-prep', bai: 'pv-2-2-star', L: 'en', title: 'IT Interview Prep 2.2 — STAR stories from your projects', sub: 'How to build one STAR story from scratch.' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-10-2-seed-vo', L: 'en', title: 'GitHub Actions 10.2 — The seed that passed everything and broke prod', sub: 'Story 2 told as a full technical case study.' }),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>D4 — năm câu chuyện trả lời được gần hết câu hỏi hành vi</h2>
<p class="lead">Phỏng vấn hành vi trông như có vô số câu hỏi, nhưng chúng rút từ một nhúm chủ đề nhỏ. Năm câu chuyện chuẩn bị kỹ — mỗi câu kể dưới hai phút, mỗi câu biến tấu được — phủ được phần lớn. Bài này định nghĩa năm câu đó, chỉ ra mỗi câu trả lời được những câu hỏi nào, và đưa bản mẫu đầy đủ dựng từ sự việc thật trong chính dự án của một sinh viên, để bạn thấy mức chi tiết nào là vừa.</p>

<h3>Liên tưởng đời thường: một tủ đồ nhỏ phối được với mọi thứ</h3>
${doiThuong('vi', 'Người đi du lịch với một vali nhỏ không mang một bộ đồ cho từng sự kiện. Họ mang năm món phối được với nhau — một chiếc áo mặc đi ăn tối cũng được mà đi họp cũng được. Năm câu chuyện của bạn là tủ đồ đó: cùng câu chuyện "sự cố" trả lời được "một sai lầm của em", "làm việc dưới áp lực" và "một thứ em tự hào đã sửa được", chỉ cần đổi câu mở đầu.')}

<h3>Năm câu chuyện và những câu hỏi chúng trả lời</h3>
${bang(['Câu chuyện', 'Trả lời các câu như', 'Phải cho thấy'], [
  ['1 · Dự án tự hào', 'Việc tốt nhất của em; một thử thách kỹ thuật; vì sao nên nhận em', 'Một quyết định của chính bạn và một kết quả đo được'],
  ['2 · Sự cố hoặc sai lầm', 'Một thất bại; một sai lầm; một lỗi trên production; em học được gì', 'Nhận trách nhiệm không đổ lỗi, nguyên nhân thật, điều đã đổi sau đó'],
  ['3 · Bất đồng / làm nhóm', 'Một mâu thuẫn; em không đồng ý với ai đó; làm việc nhóm', 'Lắng nghe, có tiêu chí, quyết định tôn trọng người kia'],
  ['4 · Học nhanh', 'Học một công nghệ mới; một lần em không biết phải làm sao', 'CÁCH bạn học, không chỉ là bạn đã học'],
  ['5 · Áp lực / hạn chót', 'Làm việc dưới áp lực; sắp thứ tự ưu tiên; một vấn đề khẩn cấp', 'Hành động bình tĩnh có thứ tự, bảo vệ thứ quan trọng nhất'],
])}
${flow([
  ['S · Situation (tình huống)', '1–2 câu', 'Ở đâu, khi nào, cái gì đang bị đe doạ. Đủ bối cảnh, không hơn.'],
  ['T · Task (nhiệm vụ)', '1 câu', 'Cụ thể bạn phải đạt được điều gì.'],
  ['A · Action (hành động)', '3–5 câu — phần dài nhất', 'CHÍNH BẠN làm gì, theo thứ tự, kèm lý do. Nói "em", không phải "nhóm em".'],
  ['R · Result (kết quả)', '1–2 câu + bài học', 'Kết quả, con số nếu có đo, và điều đã thay đổi sau đó.'],
])}
<p>Dưới đây là năm bản mẫu đầy đủ. Đó là sự việc thật trong dự án của một sinh viên, kể đúng sự thật — kể cả vai trò của công cụ AI. Đọc để thấy mức chi tiết; viết câu của bạn từ sự việc của chính bạn.</p>

<details><summary>Câu 1 · Dự án tự hào — đưa việc build ra khỏi máy chủ production</summary>
<p><strong>S:</strong> Nền tảng học tập của em chạy bằng Docker trên một máy chủ Linux nhỏ. Mỗi lần deploy, ảnh được build ngay trên máy đó: khoảng mười lăm phút, phải chạy tuần tự vì build song song từng bị giết do hết bộ nhớ. Cache build cũng phình lên 7,6 GB trên chính ổ đĩa chứa cơ sở dữ liệu.</p>
<p><strong>T:</strong> Làm cho deploy nhanh và an toàn hơn mà không phải trả tiền thuê máy to hơn.</p>
<p><strong>A:</strong> Em chuyển việc build ảnh sang một máy mạnh hơn ở nhà: nó build hai ảnh song song rồi đẩy lên một kho ảnh (registry), còn máy chủ chỉ kéo ảnh về và tráo container. Em yêu cầu thêm một bước kiểm trước khi đẩy: ảnh nền và engine của database phải dùng cùng một thư viện C; giữ đường deploy cũ trên máy chủ làm đường lùi; và giữ smoke test làm deploy thất bại nếu một route cốt lõi trả 404. Trợ lý AI viết nhiều phần script; em thiết kế luồng và thử các tình huống hỏng.</p>
<p><strong>R:</strong> Build giờ mất khoảng ba tới sáu phút, và cache build không còn nằm trên ổ đĩa của database. Em học được rằng phần chậm của một hệ thống nhiều khi không nằm ở code mà ở chỗ công việc được làm.</p>
</details>
<details><summary>Câu 2 · Sự cố hoặc sai lầm — một lần đổi tên qua hết mọi bước kiểm mà vẫn làm vỡ production</summary>
<p><strong>S:</strong> Em đổi tên một giá trị enum trong lược đồ CSDL cho khớp với frontend.</p>
<p><strong>T:</strong> Đưa thay đổi lên mà không làm hỏng gì — thay đổi của em, trách nhiệm của em.</p>
<p><strong>A:</strong> Em chạy đủ checklist trước khi push: kiểm kiểu, build, migration. Tất cả đều xanh. Sau deploy, script seed (nạp dữ liệu mẫu) chết trên production. Em điều tra và tìm ra hai nguyên nhân: tệp seed tự chép tay một bản danh sách giá trị enum riêng, và cấu hình TypeScript loại thư mục seed ra nên không gì kiểm nó cả. Em sửa seed để nhập kiểu trực tiếp từ client sinh ra, thêm một bước kiểm kiểu riêng cho các tệp seed, và thêm "chạy seed" vào checklist cho mọi lần đổi lược đồ.</p>
<p><strong>R:</strong> Loại lỗi này giờ bị bắt trước khi deploy. Bài học em giữ: bước kiểm xanh chỉ có nghĩa là bước kiểm đã qua — em kiểm xem bộ kiểm thật ra phủ những gì.</p>
</details>
<details><summary>Câu 3 · Bất đồng — microservices hay monolith chia mô-đun cho đồ án</summary>
<p><strong>S:</strong> Với đồ án LabFlow AI, một anh khoá trên đã ra trường khuyên em làm microservices, vì nhóm nào làm kiểu đó hay được khen.</p>
<p><strong>T:</strong> Chọn một kiến trúc em thật sự làm xong được trong hai mươi tuần, một mình.</p>
<p><strong>A:</strong> Em cảm ơn anh và viết ra các tiêu chí: một người làm, hai mươi tuần, còn đang học React và CSDL, chấm điểm dựa trên sản phẩm chạy được và buổi bảo vệ. Microservices thêm việc deploy, mạng và nhất quán dữ liệu mà không giúp gì người dùng. Em chọn monolith chia mô-đun, với năm quy tắc để sau này tách ra được — ví dụ các mô-đun chỉ gọi nhau qua interface và không bao giờ join bảng của nhau. Em giải thích lý do với anh và ghi quyết định vào tài liệu dự án.</p>
<p><strong>R:</strong> Kiến trúc được chốt từ tuần thứ hai của dự án và giữ nguyên từ đó; quyết định và lý do đều được ghi lại, nên ai cũng có thể phản biện bằng tiêu chí mới. Em học được cách đáp lại lời khuyên bằng tiêu chí, không bằng ý kiến. (Với mâu thuẫn trong nhóm, hãy kể một chuyện ở đồ án nhóm — cùng khung này.)</p>
</details>
<details><summary>Câu 4 · Học nhanh — vào lại máy chủ từ một mạng chặn SSH</summary>
<p><strong>S:</strong> Mạng của trường chặn cổng SSH chuẩn, nên ở trường em không vào được máy chủ production.</p>
<p><strong>T:</strong> Lấy lại quyền truy cập mà không làm hỏng đường vào sẵn có hay trang web đang chạy.</p>
<p><strong>A:</strong> Cách sửa hiển nhiên — đổi cổng trong cấu hình SSH rồi nạp lại — sẽ không chạy như em nghĩ. Em đọc cách Ubuntu 24.04 khởi động SSH: qua cơ chế socket activation của systemd, nơi cổng được một socket unit giữ. Đổi socket đó trên máy đang chạy có thể làm rơi các kết nối sẵn có. Nên em thêm một dịch vụ SSH riêng ở một cổng khác mà mạng trường cho phép, kèm bước kiểm tự gỡ bỏ nếu có gì hỏng, và để nguyên cấu hình cũ. Em còn dùng một runner CI làm đường vào dự phòng.</p>
<p><strong>R:</strong> Em làm việc được với máy chủ ngay ở trường, và đường vào cũ chưa lúc nào bị đe doạ. Em học được thói quen khảo sát hệ thống thật sự chạy thế nào trước khi sửa nó.</p>
</details>
<details><summary>Câu 5 · Áp lực — lần deploy làm đầy ổ đĩa nằm cạnh database</summary>
<p><strong>S:</strong> Trong một lần deploy, build chết với lỗi "no space left on device". Dung lượng trống tụt còn 1,8 GB, trên chính ổ đĩa chứa dữ liệu PostgreSQL.</p>
<p><strong>T:</strong> Khôi phục một lần deploy chạy được thật nhanh, mà không đặt database vào nguy hiểm.</p>
<p><strong>A:</strong> Nguyên tắc là: bảo vệ database trước. Kiểm PostgreSQL còn khoẻ, tìm thứ đã làm đầy đĩa — cache build của Docker — và chỉ xoá đúng thứ đó, không bao giờ dùng một lệnh dọn rộng có thể xoá luôn volume. Rồi sửa tận gốc: chuyển việc build ra khỏi máy chủ (Câu 1), và một job dọn đĩa chạy theo lịch hằng tuần tự thu hồi dung lượng. <em>(Bản mẫu này chỉ giữ các sự kiện đã được ghi lại — lỗi, 1,8 GB, việc chuyển build, job dọn hằng tuần. Khi kể chuyện của bạn, chỉ kể những bước bạn thật sự đã làm.)</em></p>
<p><strong>R:</strong> Không mất dữ liệu, và từ khi việc build rời khỏi máy chủ, vấn đề không lặp lại. Dưới áp lực, giờ em hỏi trước tiên: "cái gì tuyệt đối không được hỏng?" — và bảo vệ nó trước khi sửa bất cứ thứ gì khác.</p>
</details>

<h3>Kiểm độ phủ</h3>
<p>Lấy ngân hàng 30 câu hỏi hành vi (bài 3.4). Với mỗi câu, ghi câu chuyện nào trong năm câu của bạn trả lời được nó. Câu hỏi nào cũng phải nối được với ít nhất một câu chuyện; nếu nhiều câu không nối được với câu nào, bạn đang thiếu một chủ đề — thường là "bất đồng" hoặc "giúp đỡ người khác".</p>
${bay('vi', 'kể cùng một câu chuyện cho mọi câu hỏi mà không đổi câu mở đầu.', 'Người phỏng vấn hỏi "một sai lầm" mà bạn lại mở bằng "em tự hào về…". Giữ nguyên sự việc, nhưng đổi câu đầu và chỗ nhấn cho khớp câu hỏi: với "sai lầm", mở bằng chính lỗi của bạn; với "áp lực", mở bằng chiếc đồng hồ đang chạy.')}
${neu('vi', 'bạn không có câu chuyện "mâu thuẫn trong nhóm" vì đồ án làm một mình? Dùng một đồ án nhóm ở môn trước (SWP391 hoặc bài tập nhóm khác) — bất đồng về chia việc hay hạn nộp đều tính. Nếu thật sự không có, câu "lời khuyên em không đồng ý" ở trên là một bất đồng có thật; cứ nói thật đó là chuyện giữa hai người.')}
${keXau('vi', 'đừng dùng câu chuyện làm lộ chi tiết bảo mật của nơi bạn làm hay của khách hàng (tên, hệ thống, số liệu) — người phỏng vấn sẽ nghĩ sau này bạn kể gì về họ cho công ty khác. Và đừng bao giờ bịa câu chuyện: người phỏng vấn hành vi hỏi ba bốn câu đào sâu chính là để bắt chi tiết bịa.')}

<h3>Chấm từng câu chuyện (thang 8)</h3>
${rubric('vi', [
  ['Độ dài', 'Quá 3 phút', '2–3 phút', 'Dưới 2 phút'],
  ['"Em" trong phần hành động', 'Toàn "nhóm em"', 'Lẫn lộn', 'Hành động cá nhân rõ ràng, có lý do'],
  ['Kết quả', 'Không có', 'Mơ hồ', 'Cụ thể, có số đo khi được'],
  ['Sau đó', 'Không có gì đổi', 'Chỉ có bài học', 'Bài học kèm một quy trình hay bước kiểm đã thay đổi'],
])}

${thucHanh('vi', { phut: '120 (chia hai ngày)', steps: [
  'Viết năm câu chuyện theo STAR, mỗi câu tối đa 250 từ, trong <code>~/interview-kit/stories/</code>.',
  'Ghi âm từng câu; cắt bớt tới khi câu nào cũng dưới hai phút.',
  'Kiểm độ phủ với 30 câu hỏi của bài 3.4.',
  'Chấm từng câu; viết lại câu nào dưới 6/8.',
], dat: 'năm câu chuyện đã viết và ghi âm, dưới hai phút, câu nào cũng ít nhất 6/8, và cả 30 câu hỏi đều nối được với một câu chuyện.' })}
${thuatNgu('vi', [
  ['STAR', 'Situation, Task, Action, Result — khung của một câu trả lời hành vi.'],
  ['Story bank (kho câu chuyện)', 'Bộ câu chuyện đã chuẩn bị, dùng lại cho nhiều câu hỏi.'],
  ['Coverage (độ phủ)', 'Mỗi câu chuyện trả lời được những câu hỏi nào.'],
  ['Ownership (nhận trách nhiệm)', 'Nói rõ việc bạn đã làm, kể cả lỗi của bạn.'],
  ['Socket activation', 'systemd giữ một cổng và khởi động dịch vụ khi có kết nối tới.'],
])}
${tomTat('vi', [
  'Năm câu chuyện — dự án tự hào, sự cố, bất đồng, học nhanh, áp lực — phủ phần lớn câu hỏi hành vi.',
  'Hành động là phần dài nhất; nói "em" và đưa lý do.',
  'Kết quả nào cũng nên có điều đã thay đổi sau đó.',
  'Đổi câu mở đầu cho khớp câu hỏi; giữ nguyên sự việc.',
  'Chỉ dùng sự việc thật, và giữ kín chi tiết của nơi làm và khách hàng.',
])}
${lienQuan('vi', [
  yt('p8JTbk5UoFM', 'Aced (formerly Exponent)', 'The best stories to tell in behavioral interviews: creating a story bank', 3),
  lienKet({ khoa: 'interview-prep', bai: 'pv-2-2-star', title: 'IT Interview Prep 2.2 — Câu chuyện STAR từ dự án của bạn', sub: 'Cách dựng một câu chuyện STAR từ số 0.' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-10-2-seed-vo', title: 'GitHub Actions 10.2 — Bản seed qua hết mọi bước mà vẫn vỡ prod', sub: 'Câu chuyện số 2 kể thành một ca kỹ thuật đầy đủ.' }),
])}
</div>
`,
};

/* ═══════════════════════ 10.4 — Buổi thử cuối 60 phút ═══════════════════════ */
const MOCK60 = `
FINAL MOCK — 60 minutes                       interviewer reads; candidate answers; timer visible
00-05  Self-introduction in Vietnamese ............................. (D5)
05-08  "Now the same in English, please." ........................... (D5, Ch8)
08-20  Project deep-dive: what · one request end to end · your role
       · what broke · what you would change .......................... (D2, D4)
20-35  Six technical questions for the chosen direction (sets below) . (D6)
35-55  Coding: overlapping lab bookings, 20 minutes, think aloud ..... (Ch7)
55-58  Three behavioural questions, one minute each ................ (D4, Ch3)
58-60  "What would you like to ask us?" ............................ (2.4)
`;

const DE_CODE_EN = `
Problem — overlapping lab bookings
Each booking is { id, deviceId, start, end } with start < end (minutes since midnight).
A booking uses the device in [start, end): a booking ending at 10:00 and one starting
at 10:00 do NOT overlap. Return the ids of all bookings that overlap another booking
on the SAME device. Any order.

Example
  [ {id:1, deviceId:"A", start:540, end:600},
    {id:2, deviceId:"A", start:590, end:650},
    {id:3, deviceId:"B", start:540, end:600},
    {id:4, deviceId:"A", start:650, end:700} ]   ->   [1, 2]
`;

const LOI_GIAI = `
function overlappingBookings(bookings) {
  const byDevice = new Map();
  for (const b of bookings) {
    if (!byDevice.has(b.deviceId)) byDevice.set(b.deviceId, []);
    byDevice.get(b.deviceId).push(b);
  }
  const result = new Set();
  for (const list of byDevice.values()) {
    list.sort((a, b) => a.start - b.start);
    let furthest = list[0];               // booking with the latest end so far
    for (let i = 1; i < list.length; i++) {
      const cur = list[i];
      if (cur.start < furthest.end) {     // [start, end): equal times do not overlap
        result.add(furthest.id);
        result.add(cur.id);
      }
      if (cur.end > furthest.end) furthest = cur;
    }
  }
  return [...result];
}
// O(n log n) time for the sorts, O(n) extra space.
// Tests: empty list · one booking · touching (end == start) · one long booking
// covering three short ones · same times on two different devices.
`;

const L104 = {
  title: '10.4 — Deliverable D7: the final 60-minute mock interview|||10.4 — Sản phẩm D7: buổi phỏng vấn thử cuối 60 phút, trọn mọi vòng',
  slug: 'pv-10-4-mock-cuoi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Kịch bản buổi thử cuối 60 phút ráp toàn bộ khoá: giới thiệu tiếng Việt và tiếng Anh, đào sâu dự án, ba bộ sáu câu kỹ thuật (backend Node, Java/Spring, frontend), bài code 20 phút "lịch đặt thiết bị chồng nhau" kèm lời giải và test, ba câu hành vi, câu hỏi lại; cách quay, phiếu chấm 20 điểm quy đổi sang rubric dự án, và kế hoạch sửa sau buổi thử.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>D7 — the final mock: the whole course in sixty minutes</h2>
<p class="lead">Lesson 9.1 rehearsed a backend/DevOps interview. This final mock is longer and covers everything an internship interview in Vietnam or abroad can contain: both languages, your project, the technical round for your direction, a real coding problem, behavioural questions and your questions. Record it, score it, and fix the three weakest moments. It is the last deliverable before the decision point on 10 December.</p>

<h3>An everyday picture: the mock exam before the final</h3>
${doiThuong('en', 'Before a final exam, a good teacher gives a full mock paper under exam conditions — same length, same clock, no notes. Students who only did single exercises discover in the mock that they run out of time. This 60-minute session is your mock paper: the same length as a long interview, so you learn your pace.')}

<h3>The running order</h3>
${ra(MOCK60)}
${flow([
  ['Language block', '0–8 min', 'Vietnamese first, then English. The switch itself is practised — many Vietnamese companies do exactly this.'],
  ['Depth block', '8–35 min', 'Project, then six technical questions. This is where your D2 and D6 are tested.'],
  ['Problem block', '35–55 min', 'A coding problem: clarify, plan, code, test — out loud.'],
  ['People block', '55–60 min', 'Three short behavioural questions and your own questions.'],
])}

<h3>Six technical questions — choose the set for your direction</h3>
${bang(['Backend Node.js', 'Backend Java/Spring', 'Frontend React'], [
  ['How does the event loop let one thread serve many requests?', 'Explain encapsulation, inheritance and polymorphism with your own code', 'What triggers a re-render in React?'],
  ['401 vs 403 — where does each come from in your API?', 'What does Spring’s dependency injection give you?', 'When does useEffect run, and why does the dependency array matter?'],
  ['What is the N+1 problem and how do you fix it?', 'What is the N+1 problem with JPA/Hibernate and how do you fix it?', 'Server Components vs Client Components in Next.js'],
  ['When do you need a transaction? Give an example', 'What does @Transactional do, and when does it not work?', 'How would you make a slow page faster? What do you measure first?'],
  ['Unit test vs integration test — what did you test with each?', 'Interface vs abstract class — when do you use each?', 'Controlled vs uncontrolled inputs'],
  ['How does your code get to production, and how do you roll back?', 'How does your Spring app get built and deployed?', 'How do you call an API safely from the browser (CORS, tokens)?'],
])}

<h3>The coding problem (20 minutes)</h3>
${ra(DE_CODE_EN)}
${stack([
  ['Clarify (2 min)', 'Ask: are end times exclusive? Can the list be empty? Is it sorted? (Here: exclusive, can be empty, not sorted.)'],
  ['Plan (3 min)', 'Say the brute force first (compare every pair: O(n²)), then the better idea: group by device, sort by start, sweep.'],
  ['Code (10 min)', 'Write it while explaining each step.'],
  ['Test (5 min)', 'Run the example by hand, then the edge cases: empty, touching times, one long booking covering several.'],
])}
<details><summary>A model solution (open only after your attempt)</summary>
${ma('javascript', LOI_GIAI)}
<p>The key idea: after sorting by start, a booking overlaps the earlier one that ends latest, if it starts before that end. Keeping only the "furthest end so far" catches the case where one long booking covers several short ones.</p>
</details>

<h3>Three behavioural questions (one minute each)</h3>
<ul>
<li>"Tell me about a mistake you made and what you changed afterwards." (Story 2)</li>
<li>"Tell me about a time you disagreed with someone." (Story 3)</li>
<li>"How do you use AI tools in your work?" (Lesson 3.3 — honestly, with one concrete example.)</li>
</ul>

<h3>Scoring sheet (out of 20 → converted to 15 for the project rubric)</h3>
${rubric('en', [
  ['Introduction VI', 'Over 2 min / no structure', 'Structured, long', '60–90 s, three blocks'],
  ['Introduction EN', 'Could not finish', 'Finished with long pauses', 'Clear, key words recognisable'],
  ['Project deep-dive', 'No clear picture', 'Picture with gaps', 'One request end to end, exact role'],
  ['Technical — correctness', '0–2 of 6', '3–4 of 6', '5–6 of 6'],
  ['Technical — examples', 'No own examples', 'Some', 'Every answer tied to your project'],
  ['Coding — clarify and plan', 'Started coding at once', 'Some questions', 'Asked, stated brute force, then better plan'],
  ['Coding — result and tests', 'Does not run', 'Works on the example', 'Works and edge cases tested aloud'],
  ['Thinking aloud', 'Long silences', 'Partly', 'Continuous, ordered reasoning'],
  ['Behavioural', 'Blames or vague', 'Correct but long', 'STAR, under a minute, ownership'],
  ['Questions asked', 'None', 'Generic', 'Two or three specific to the team and work'],
])}
<p>Project points for D7 = (score ÷ 20) × 15, plus the requirement that the three weakest moments are rewritten.</p>
${bay('en', 'pausing the recording to look something up.', 'The point is to see what happens when you do not know. Treat every unknown exactly as you would live: "I’m not sure, but…" — then reason. Looking things up turns the mock into a study session and hides your real gaps.')}
${neu('en', 'your score is below 12/20? Do not redo the whole mock tomorrow. Take the two lowest rows, practise only those for two days (for example, the English introduction and coding tests), then run a 20-minute partial mock on just those parts. Repeating the whole hour without fixing anything trains the same mistakes.')}
${keXau('en', 'if you practise the coding problem on an online platform or an AI chat, do not paste your real CV, phone number or company names you are interviewing with. And when you share the recording for feedback, share a link with access only for that person, and remove it afterwards.')}

${thucHanh('en', { phut: '75–90', steps: [
  'Choose your technical set and send the script to your interviewer (or prepare the audio for a solo run).',
  'Run the full 60 minutes on camera without pausing.',
  'Score with the sheet; your interviewer scores separately.',
  'Rewrite the three weakest moments and add them to your banks (stories, technical answers).',
  'Record the project score in <code>kit.md</code>.',
], dat: 'a 60-minute recording, two score sheets, a D7 score of at least 10/15 on the project rubric, and three rewritten answers saved.' })}
${thuatNgu('en', [
  ['Brute force', 'The simplest correct approach, often slow; say it first, then improve.'],
  ['Sweep', 'Process items in sorted order while keeping a small summary (here, the furthest end).'],
  ['Edge case', 'An unusual input that often breaks code: empty, equal values, one huge item.'],
  ['Half-open interval', '[start, end): includes start, excludes end — touching intervals do not overlap.'],
  ['Partial mock', 'A short mock on only the weakest parts.'],
])}
${tomTat('en', [
  'The final mock covers both languages, the project, six technical questions, a coding problem, behavioural questions and your questions.',
  'Pick the technical set for your direction and answer with your own examples.',
  'In coding: clarify, say the brute force, plan, code, test edge cases — out loud.',
  'Score on the sheet, convert to the project rubric, and rewrite the three weakest moments.',
  'Low score: fix the two weakest parts with short partial mocks, not by repeating the whole hour.',
])}
${lienQuan('en', [
  yt('V8DGdPkBBxg', 'Jane Street', 'A Jane Street Software Engineering Mock Interview with Grace and Nolen', 37, 'en'),
  lienKet({ khoa: 'interview-prep', bai: 'pv-9-1-phong-van-thu', L: 'en', title: 'IT Interview Prep 9.1 — Mock interview: backend/DevOps', sub: 'The shorter 45-minute mock with model answers for the technical questions.' }),
  lienKet({ khoa: 'react', bai: 'rx-9-4-phong-van', L: 'en', title: 'React 9.4 — 20 React interview questions', sub: 'Material for the frontend set.' }),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>D7 — buổi thử cuối: cả khoá học trong sáu mươi phút</h2>
<p class="lead">Bài 9.1 đã tập một buổi phỏng vấn backend/DevOps. Buổi thử cuối này dài hơn và phủ mọi thứ một buổi phỏng vấn thực tập ở Việt Nam hay nước ngoài có thể có: cả hai thứ tiếng, dự án của bạn, vòng kỹ thuật theo hướng bạn chọn, một bài code thật, câu hỏi hành vi và câu hỏi của bạn. Quay lại, chấm, và sửa ba khoảnh khắc yếu nhất. Đây là sản phẩm cuối cùng trước điểm quyết định ngày 10/12.</p>

<h3>Liên tưởng đời thường: đề thi thử trước kỳ thi cuối</h3>
${doiThuong('vi', 'Trước kỳ thi cuối, thầy cô giỏi cho làm một đề thi thử trọn vẹn trong điều kiện như thi thật — cùng độ dài, cùng đồng hồ, không tài liệu. Học sinh chỉ làm từng bài lẻ sẽ phát hiện ra trong đề thử rằng mình hết giờ. Buổi 60 phút này là đề thi thử của bạn: dài bằng một buổi phỏng vấn dài, để bạn biết nhịp của mình.')}

<h3>Trình tự</h3>
${ra(MOCK60)}
<p>Giải nghĩa: 00–05 tự giới thiệu tiếng Việt · 05–08 "giờ em nói lại bằng tiếng Anh nhé" · 08–20 đào sâu dự án (là gì, một request từ đầu tới cuối, vai trò của em, cái gì đã hỏng, em sẽ đổi gì) · 20–35 sáu câu kỹ thuật theo hướng đã chọn · 35–55 bài code "lịch đặt thiết bị chồng nhau", 20 phút, nghĩ thành tiếng · 55–58 ba câu hành vi, mỗi câu một phút · 58–60 "em muốn hỏi gì bên anh chị?".</p>
${flow([
  ['Khối ngôn ngữ', 'phút 0–8', 'Tiếng Việt trước, rồi tiếng Anh. Tập luôn cả cú chuyển ngôn ngữ — nhiều công ty Việt làm đúng như vậy.'],
  ['Khối độ sâu', 'phút 8–35', 'Dự án, rồi sáu câu kỹ thuật. Đây là chỗ D2 và D6 của bạn bị kiểm.'],
  ['Khối bài toán', 'phút 35–55', 'Một bài code: làm rõ đề, lập kế hoạch, viết, kiểm thử — nói thành tiếng.'],
  ['Khối con người', 'phút 55–60', 'Ba câu hành vi ngắn và câu hỏi của chính bạn.'],
])}

<h3>Sáu câu kỹ thuật — chọn bộ theo hướng của bạn</h3>
${bang(['Backend Node.js', 'Backend Java/Spring', 'Frontend React'], [
  ['Event loop giúp một luồng phục vụ nhiều request thế nào?', 'Giải thích đóng gói, kế thừa, đa hình bằng chính code của em', 'Điều gì làm React render lại?'],
  ['401 và 403 — trong API của em, mỗi mã xuất phát từ đâu?', 'Dependency injection của Spring cho em được gì?', 'useEffect chạy khi nào, và vì sao mảng phụ thuộc quan trọng?'],
  ['N+1 là gì và sửa thế nào?', 'N+1 với JPA/Hibernate là gì và sửa thế nào?', 'Server Component khác Client Component trong Next.js ra sao?'],
  ['Khi nào cần transaction? Cho một ví dụ', '@Transactional làm gì, và khi nào nó không có tác dụng?', 'Em làm một trang chậm nhanh lên thế nào? Đo gì trước?'],
  ['Unit test khác integration test — em đã test gì bằng mỗi loại?', 'Interface khác abstract class — khi nào dùng cái nào?', 'Input có kiểm soát và không kiểm soát'],
  ['Code đi lên production thế nào, và quay lui ra sao?', 'App Spring của em được build và deploy thế nào?', 'Gọi API an toàn từ trình duyệt thế nào (CORS, token)?'],
])}

<h3>Bài code (20 phút)</h3>
${ra(DE_CODE_EN)}
<p>Đề bằng tiếng Anh vì vòng code thường viết như vậy. Nghĩa: mỗi lượt đặt là <code>{ id, deviceId, start, end }</code> với start &lt; end (tính bằng phút từ nửa đêm). Một lượt đặt dùng thiết bị trong khoảng [start, end): lượt kết thúc lúc 10:00 và lượt bắt đầu lúc 10:00 KHÔNG chồng nhau. Trả về id của mọi lượt đặt chồng lên một lượt khác trên CÙNG thiết bị, thứ tự tuỳ ý. Trong ví dụ, lượt 1 (540–600) và lượt 2 (590–650) trên máy A chồng nhau; lượt 4 bắt đầu đúng lúc lượt 2 kết thúc nên không tính.</p>
${stack([
  ['Làm rõ (2 phút)', 'Hỏi: giờ kết thúc có tính không? Danh sách có thể rỗng không? Đã sắp xếp chưa? (Ở đây: không tính giờ kết thúc, có thể rỗng, chưa sắp xếp.)'],
  ['Lập kế hoạch (3 phút)', 'Nói cách vét cạn trước (so mọi cặp: O(n²)), rồi ý tốt hơn: gom theo thiết bị, sắp xếp theo giờ bắt đầu, quét một lượt.'],
  ['Viết code (10 phút)', 'Vừa viết vừa giải thích từng bước.'],
  ['Kiểm thử (5 phút)', 'Chạy tay ví dụ, rồi các trường hợp biên: rỗng, giờ chạm nhau, một lượt dài phủ nhiều lượt ngắn.'],
])}
<details><summary>Một lời giải mẫu (chỉ mở sau khi bạn đã tự làm)</summary>
${ma('javascript', LOI_GIAI)}
<p>Ý then chốt: sau khi sắp xếp theo giờ bắt đầu, một lượt đặt chồng lên lượt trước có giờ kết thúc muộn nhất, nếu nó bắt đầu trước giờ kết thúc đó. Chỉ giữ "lượt kết thúc xa nhất tới giờ" là bắt được trường hợp một lượt dài phủ lên nhiều lượt ngắn. Độ phức tạp O(n log n) do sắp xếp, bộ nhớ thêm O(n). Bài này lấy từ chính nghiệp vụ của LabFlow AI (đặt thiết bị phòng lab) — nếu bạn làm đồ án tương tự, nói luôn điều đó với người phỏng vấn.</p>
</details>

<h3>Ba câu hỏi hành vi (mỗi câu một phút)</h3>
<ul>
<li>"Kể một sai lầm em đã mắc và điều em thay đổi sau đó." (Câu chuyện 2)</li>
<li>"Kể một lần em không đồng ý với ai đó." (Câu chuyện 3)</li>
<li>"Em dùng công cụ AI trong công việc thế nào?" (bài 3.3 — trung thực, kèm một ví dụ cụ thể.)</li>
</ul>

<h3>Phiếu chấm (thang 20 → quy đổi ra 15 điểm của rubric dự án)</h3>
${rubric('vi', [
  ['Giới thiệu tiếng Việt', 'Quá 2 phút / không bố cục', 'Có bố cục, dài', '60–90 giây, ba khối'],
  ['Giới thiệu tiếng Anh', 'Không nói hết được', 'Nói hết nhưng ngắt lâu', 'Rõ ràng, từ khoá nghe ra được'],
  ['Đào sâu dự án', 'Không có hình dung rõ', 'Có hình, còn hổng', 'Một request từ đầu tới cuối, vai trò chính xác'],
  ['Kỹ thuật — đúng', 'Đúng 0–2/6', 'Đúng 3–4/6', 'Đúng 5–6/6'],
  ['Kỹ thuật — ví dụ', 'Không có ví dụ của mình', 'Có vài ví dụ', 'Câu nào cũng gắn với dự án của bạn'],
  ['Code — làm rõ và kế hoạch', 'Lao vào code ngay', 'Có hỏi một ít', 'Có hỏi, nói vét cạn, rồi kế hoạch tốt hơn'],
  ['Code — kết quả và test', 'Không chạy', 'Chạy đúng ví dụ', 'Chạy đúng và đã kiểm các trường hợp biên thành tiếng'],
  ['Nghĩ thành tiếng', 'Im lặng lâu', 'Một phần', 'Liên tục, có thứ tự'],
  ['Hành vi', 'Đổ lỗi hoặc mơ hồ', 'Đúng nhưng dài', 'STAR, dưới một phút, nhận trách nhiệm'],
  ['Câu hỏi lại', 'Không có', 'Chung chung', 'Hai ba câu cụ thể về đội và công việc'],
])}
<p>Điểm D7 trong rubric dự án = (điểm phiếu ÷ 20) × 15, kèm điều kiện ba khoảnh khắc yếu nhất đã được viết lại.</p>
${bay('vi', 'dừng bản ghi để tra cứu một thứ.', 'Mục đích là thấy chuyện gì xảy ra khi bạn không biết. Đối xử với mọi chỗ không biết y như lúc thật: "Em không chắc, nhưng…" — rồi suy luận. Tra cứu giữa chừng biến buổi thử thành buổi học và giấu đi lỗ hổng thật của bạn.')}
${neu('vi', 'điểm của bạn dưới 12/20? Đừng làm lại cả buổi vào ngày mai. Lấy hai dòng thấp nhất, chỉ luyện hai thứ đó trong hai ngày (ví dụ giới thiệu tiếng Anh và kiểm thử khi code), rồi chạy một buổi thử từng phần 20 phút chỉ cho các phần đó. Lặp lại cả tiếng đồng hồ mà không sửa gì chỉ luyện thêm đúng các lỗi cũ.')}
${keXau('vi', 'nếu bạn luyện bài code trên một nền tảng online hay trong một cuộc chat AI, đừng dán CV thật, số điện thoại hay tên các công ty bạn đang phỏng vấn. Và khi chia sẻ bản ghi để xin góp ý, chỉ chia sẻ đường link cho đúng người đó, rồi gỡ quyền sau khi xong.')}

${thucHanh('vi', { phut: '75–90', steps: [
  'Chọn bộ câu kỹ thuật của bạn và gửi kịch bản cho người phỏng vấn (hoặc chuẩn bị bản thu âm câu hỏi nếu làm một mình).',
  'Chạy trọn 60 phút có camera, không dừng.',
  'Chấm theo phiếu; người phỏng vấn chấm riêng.',
  'Viết lại ba khoảnh khắc yếu nhất và đưa vào các kho (câu chuyện, câu trả lời kỹ thuật).',
  'Ghi điểm dự án vào <code>kit.md</code>.',
], dat: 'một bản ghi 60 phút, hai phiếu chấm, điểm D7 ít nhất 10/15 theo rubric dự án, và ba câu trả lời viết lại đã lưu.' })}
${thuatNgu('vi', [
  ['Brute force (vét cạn)', 'Cách đúng đơn giản nhất, thường chậm; nói nó trước, rồi cải tiến.'],
  ['Sweep (quét)', 'Xử lý các phần tử theo thứ tự đã sắp, giữ một bản tóm tắt nhỏ (ở đây là giờ kết thúc xa nhất).'],
  ['Edge case (trường hợp biên)', 'Đầu vào bất thường hay làm hỏng code: rỗng, giá trị bằng nhau, một phần tử khổng lồ.'],
  ['Half-open interval (khoảng nửa mở)', '[start, end): gồm start, không gồm end — hai khoảng chạm nhau thì không chồng.'],
  ['Partial mock (buổi thử từng phần)', 'Buổi thử ngắn chỉ cho các phần yếu nhất.'],
])}
${tomTat('vi', [
  'Buổi thử cuối phủ cả hai thứ tiếng, dự án, sáu câu kỹ thuật, một bài code, câu hỏi hành vi và câu hỏi của bạn.',
  'Chọn bộ câu kỹ thuật theo hướng của bạn và trả lời bằng ví dụ của chính mình.',
  'Khi code: làm rõ đề, nói vét cạn, lập kế hoạch, viết, kiểm trường hợp biên — tất cả thành tiếng.',
  'Chấm bằng phiếu, quy đổi ra rubric dự án, và viết lại ba khoảnh khắc yếu nhất.',
  'Điểm thấp: sửa hai phần yếu nhất bằng buổi thử từng phần ngắn, không lặp lại cả tiếng.',
])}
${lienQuan('vi', [
  yt('V8DGdPkBBxg', 'Jane Street', 'A Jane Street Software Engineering Mock Interview with Grace and Nolen', 37),
  lienKet({ khoa: 'interview-prep', bai: 'pv-9-1-phong-van-thu', title: 'IT Interview Prep 9.1 — Phỏng vấn thử: backend/DevOps', sub: 'Buổi thử 45 phút ngắn hơn, có ý trả lời mẫu cho các câu kỹ thuật.' }),
  lienKet({ khoa: 'react', bai: 'rx-9-4-phong-van', title: 'React 9.4 — 20 câu phỏng vấn React', sub: 'Chất liệu cho bộ câu frontend.' }),
])}
</div>
`,
};

/* ═══════════════════════ 10.5 — Kiểm tra cuối khoá ═══════════════════════ */
const Q105 = {
  title: '10.5 — Final exam: the whole course in 20 situations|||10.5 — Kiểm tra cuối khoá: cả khoá học trong 20 tình huống',
  slug: 'pv-10-5-kiem-tra-cuoi-khoa',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Hai mươi câu tình huống phủ cả khoá: tuyển dụng và lừa đảo, CV/GitHub/LinkedIn, STAR và câu hỏi hành vi, trung thực về AI, các vòng kỹ thuật backend/DevOps/frontend/Java, coding và system design, tiếng Anh, sau phỏng vấn và offer.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Final exam</span>
<h2>Final exam — the whole course in 20 situations</h2>
<p class="lead">Twenty situations from every chapter, in roughly the order they happen in a real application. Thirty minutes. Aim for 16/20; every explanation tells you which lesson to re-read.</p>
<h3>Self-check before you start</h3>
<ul>
<li>My CV, GitHub and LinkedIn tell the same story, and every line survives three follow-ups.</li>
<li>I have five STAR stories under two minutes each.</li>
<li>I can answer the six technical questions of my direction with my own examples.</li>
<li>I can introduce myself and my project in English, and I know what to say when I do not understand.</li>
<li>I can read an offer, compare two, and spot a fake one.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra cuối khoá</span>
<h2>Kiểm tra cuối khoá — cả khoá học trong 20 tình huống</h2>
<p class="lead">Hai mươi tình huống từ mọi chương, xếp gần đúng theo thứ tự chúng xảy ra trong một lần ứng tuyển thật. Ba mươi phút. Nhắm 16/20; lời giải thích nào cũng chỉ bài cần đọc lại.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>CV, GitHub và LinkedIn của tôi kể cùng một câu chuyện, và mọi dòng qua được ba câu đào sâu.</li>
<li>Tôi có năm câu chuyện STAR, mỗi câu dưới hai phút.</li>
<li>Tôi trả lời được sáu câu kỹ thuật của hướng mình bằng ví dụ của chính mình.</li>
<li>Tôi giới thiệu được bản thân và dự án bằng tiếng Anh, và biết nói gì khi không hiểu.</li>
<li>Tôi đọc được một offer, so sánh được hai offer, và nhận ra offer giả.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 1800,
    questions: [
      cau('For an internship candidate, which weakness is most likely to end the interview?|||Với ứng viên thực tập, điểm yếu nào dễ làm hỏng buổi phỏng vấn nhất?', [
        'Not being able to explain the project at the top of your own CV|||Không giải thích được dự án đứng đầu chính CV của mình',
        'Not having used Kubernetes|||Chưa từng dùng Kubernetes',
        'Speaking English with an accent|||Nói tiếng Anh có giọng',
        'Not having a cloud certificate|||Không có chứng chỉ cloud',
      ], 0, 'EN: Interns are judged on potential and ownership; an unexplainable CV line makes every other line doubtful (Lesson 0.8). Missing tools and an accent are forgiven.|||VI: Thực tập sinh được chấm theo tiềm năng và làm chủ sản phẩm; một dòng CV không giải thích được làm mọi dòng khác bị nghi ngờ (bài 0.8). Thiếu công cụ hay có giọng thì được bỏ qua.'),
      cau('A "recruiter" sends a take-home repository and insists you run it before any call. What do you do first?|||Một "recruiter" gửi kho mã bài làm ở nhà và nằng nặc bắt bạn chạy trước mọi cuộc gọi. Bạn làm gì trước tiên?', [
        'Run it quickly to show you are eager|||Chạy nhanh cho thấy mình nhiệt tình',
        'Run it on your laptop but with antivirus on|||Chạy trên laptop nhưng bật diệt virus',
        'Read package.json scripts, run nothing on your main machine, verify the company and recruiter through official channels|||Đọc phần scripts của package.json, không chạy gì trên máy chính, xác minh công ty và recruiter qua kênh chính thức',
        'Delete your GitHub account|||Xoá tài khoản GitHub',
      ], 2, 'EN: Fake interviews with malicious "test projects" are a documented campaign against developers (Lessons 0.9, 0.1). Antivirus is not enough; postinstall scripts run on install.|||VI: Phỏng vấn giả kèm "dự án bài test" chứa mã độc là chiến dịch có thật nhắm vào lập trình viên (bài 0.9, 0.1). Diệt virus không đủ; script postinstall chạy ngay khi cài.'),
      cau('Which CV bullet is strongest?|||Gạch đầu dòng CV nào mạnh nhất?', [
        '"Responsible for the backend of the project"|||"Chịu trách nhiệm phần backend của dự án"',
        '"Added a post-deploy smoke test that fails the deploy when a core route returns 404, catching stale builds"|||"Thêm smoke test sau deploy làm deploy thất bại khi route cốt lõi trả 404, bắt được bản build cũ"',
        '"Passionate, hard-working and a fast learner"|||"Đam mê, chăm chỉ và học nhanh"',
        '"Expert in Node.js, Java, React, Docker and AWS"|||"Chuyên gia Node.js, Java, React, Docker và AWS"',
      ], 1, 'EN: Action plus concrete result, and defensible under follow-ups (Lessons 1.1, 10.2). "Responsible for" states a duty; adjectives and "expert" claims invite probing you cannot survive.|||VI: Có hành động cộng kết quả cụ thể, và bảo vệ được khi bị đào sâu (bài 1.1, 10.2). "Chịu trách nhiệm" chỉ nêu nhiệm vụ; tính từ và chữ "chuyên gia" mời gọi câu hỏi mà bạn không qua nổi.'),
      cau('You once committed an API key to a public repository and removed it in the next commit. Is that enough?|||Bạn từng commit một khoá API lên repo công khai rồi xoá ở commit sau. Như vậy đã đủ chưa?', [
        'Yes, the latest version no longer contains it|||Đủ, bản mới nhất không còn khoá nữa',
        'Yes, if the repository is starred by few people|||Đủ, nếu repo ít người gắn sao',
        'Make the repository private and it is solved|||Chuyển repo sang riêng tư là xong',
        'No — the key is still in the history and bots scan quickly; rotate the key at the provider first, then clean the history|||Chưa — khoá vẫn nằm trong lịch sử và bot quét rất nhanh; xoay khoá ở nhà cung cấp trước, rồi mới dọn lịch sử',
      ], 3, 'EN: Removing it later does not remove it from history, and making the repo private does not un-leak a key that was already public (Lesson 10.2, Git 8.3). Rotation is the real fix.|||VI: Xoá sau không xoá khỏi lịch sử, và chuyển repo sang riêng tư không thu hồi được một khoá đã từng công khai (bài 10.2, Git 8.3). Xoay khoá mới là cách sửa thật.'),
      cau('In a STAR answer, which part should be the longest?|||Trong một câu trả lời STAR, phần nào nên dài nhất?', [
        'Action — what YOU did, in order, with reasons|||Action — CHÍNH BẠN làm gì, theo thứ tự, kèm lý do',
        'Situation — so the context is complete|||Situation — cho bối cảnh đầy đủ',
        'Task — so the goal is clear|||Task — cho mục tiêu rõ ràng',
        'All four parts equally|||Bốn phần bằng nhau',
      ], 0, 'EN: Interviewers score your actions; a long situation is the most common way to run out of time (Lessons 2.2, 10.3).|||VI: Người phỏng vấn chấm hành động của bạn; kể tình huống dài là cách hay gặp nhất để hết giờ (bài 2.2, 10.3).'),
      cau('"Tell me about a conflict in your team." Which answer pattern is best?|||"Kể một lần mâu thuẫn trong nhóm." Kiểu trả lời nào tốt nhất?', [
        'Explain why the teammate was wrong and lazy|||Giải thích vì sao bạn kia sai và lười',
        'Describe listening, the criteria you used, a respectful decision, and what you learned — without blaming|||Kể việc lắng nghe, tiêu chí đã dùng, một quyết định tôn trọng, và bài học — không đổ lỗi',
        'Say your team never had conflicts|||Nói nhóm bạn chưa bao giờ có mâu thuẫn',
        'Tell how the lecturer solved it for you|||Kể giảng viên đã giải quyết giúp bạn thế nào',
      ], 1, 'EN: Blame predicts future blame; "never had conflicts" sounds untrue or inexperienced (Chapter 3, Story 3 in Lesson 10.3).|||VI: Đổ lỗi báo trước bạn sẽ đổ lỗi về sau; "chưa bao giờ có mâu thuẫn" nghe thiếu thật hoặc thiếu trải nghiệm (Chương 3, câu chuyện 3 ở bài 10.3).'),
      cau('"How do you use AI tools?" You built much of a project with an AI assistant. Best answer?|||"Em dùng công cụ AI thế nào?" Bạn làm phần lớn một dự án cùng trợ lý AI. Câu trả lời tốt nhất?', [
        'Say you never use AI|||Nói mình không bao giờ dùng AI',
        'Say AI does everything, so you do not need to understand the code|||Nói AI làm hết nên không cần hiểu code',
        'Change the topic to your capstone|||Lái sang chuyện đồ án',
        'Describe it honestly with an example: what the assistant wrote, what you decided, reviewed and debugged — and that you can explain the code|||Kể trung thực kèm ví dụ: trợ lý viết gì, bạn quyết định, duyệt và gỡ lỗi gì — và bạn giải thích được code',
      ], 3, 'EN: Honesty plus concrete ownership is strong; "never" is often untrue and "AI does everything" fails the ownership signal (Lesson 3.3, 0.2).|||VI: Trung thực cộng với phần làm chủ cụ thể là câu trả lời mạnh; "không bao giờ" thường không thật, còn "AI làm hết" trượt tín hiệu làm chủ sản phẩm (bài 3.3, 0.2).'),
      cau('Node.js runs your JavaScript on one thread. How can it serve many requests at once?|||Node.js chạy JavaScript trên một luồng. Sao nó phục vụ được nhiều request cùng lúc?', [
        'It creates a new thread for every request|||Nó tạo một luồng mới cho mỗi request',
        'It runs requests one after another, very fast|||Nó chạy request lần lượt, rất nhanh',
        'I/O is handed to the system and the event loop runs callbacks when results are ready, so the thread does not wait|||I/O được giao cho hệ thống và event loop chạy callback khi có kết quả, nên luồng không phải chờ',
        'It uses the GPU for networking|||Nó dùng GPU cho việc mạng',
      ], 2, 'EN: Non-blocking I/O plus the event loop is the core idea (Lesson 4.1, Node.js 2.2). "One after another" ignores that most time is waiting on I/O; Node does not spawn a thread per request.|||VI: I/O không chặn cộng với event loop là ý cốt lõi (bài 4.1, Node.js 2.2). "Lần lượt" bỏ qua việc phần lớn thời gian là chờ I/O; Node không tạo một luồng cho mỗi request.'),
      cau('A list page shows 50 posts and their authors, and makes 51 database queries. What is this, and the usual fix?|||Một trang danh sách hiện 50 bài viết kèm tác giả và chạy 51 truy vấn CSDL. Đây là gì, và cách sửa thường dùng?', [
        'The N+1 problem — load the authors with a join or one batched query|||Vấn đề N+1 — lấy tác giả bằng join hoặc một truy vấn gom lô',
        'A missing primary key — add one|||Thiếu khoá chính — thêm vào',
        'A deadlock — add a transaction|||Deadlock — thêm transaction',
        'Too much RAM — add swap|||Quá nhiều RAM — thêm swap',
      ], 0, 'EN: One query for the list plus one per row is N+1 (Lesson 4.2, Node.js 7.4). Transactions and swap do not reduce the query count.|||VI: Một truy vấn cho danh sách cộng một truy vấn cho mỗi dòng là N+1 (bài 4.2, Node.js 7.4). Transaction hay swap không làm giảm số truy vấn.'),
      cau('A logged-in student calls an admin-only endpoint. Which status code is correct?|||Một sinh viên đã đăng nhập gọi endpoint chỉ dành cho admin. Mã trạng thái đúng là gì?', [
        '401 Unauthorized|||401 Unauthorized',
        '404 Not Found, always|||Luôn là 404 Not Found',
        '403 Forbidden — authenticated, but not allowed|||403 Forbidden — đã xác thực, nhưng không đủ quyền',
        '500 Internal Server Error|||500 Internal Server Error',
      ], 2, 'EN: 401 means not authenticated; this user is authenticated but lacks permission (Lesson 4.3, API 1.3). Some APIs deliberately return 404 to hide a resource, but "always 404" is not the rule.|||VI: 401 nghĩa là chưa xác thực; người này đã xác thực nhưng thiếu quyền (bài 4.3, API 1.3). Có API cố ý trả 404 để giấu tài nguyên, nhưng "luôn 404" không phải quy tắc.'),
      cau('You rebased your feature branch, which a teammate had already pulled, and want to push. What is the safe rule?|||Bạn đã rebase nhánh tính năng mà bạn cùng nhóm đã kéo về, giờ muốn push. Quy tắc an toàn là gì?', [
        'git push --force, it is your branch|||git push --force, nhánh của mình mà',
        'Do not rewrite history others have pulled; if you must, agree first and use --force-with-lease, never on main|||Đừng viết lại lịch sử người khác đã kéo; nếu buộc phải làm, thống nhất trước và dùng --force-with-lease, không bao giờ trên main',
        'Delete the remote branch and push again|||Xoá nhánh trên remote rồi push lại',
        'Push to main instead|||Push thẳng lên main thay thế',
      ], 1, 'EN: Rewriting shared history breaks teammates’ copies (Lesson 5.1, Git 3.4). Deleting and re-pushing is the same rewrite in disguise.|||VI: Viết lại lịch sử dùng chung làm hỏng bản sao của bạn cùng nhóm (bài 5.1, Git 3.4). Xoá rồi push lại chỉ là cùng kiểu viết lại đội lốt khác.'),
      cau('A container keeps restarting and docker ps shows exit code 137 during a build-heavy task. Most likely cause?|||Một container cứ khởi động lại và docker ps báo exit code 137 khi đang làm việc nặng. Nguyên nhân khả dĩ nhất?', [
        'A syntax error in the Dockerfile|||Lỗi cú pháp trong Dockerfile',
        'A wrong port mapping|||Ánh xạ cổng sai',
        'An expired TLS certificate|||Chứng chỉ TLS hết hạn',
        'It was killed with SIGKILL, very often by the out-of-memory killer — check memory limits and usage|||Nó bị giết bằng SIGKILL, rất hay do bộ diệt khi hết bộ nhớ — kiểm giới hạn và mức dùng bộ nhớ',
      ], 3, 'EN: 137 = 128 + 9 (SIGKILL), commonly OOM (Lesson 5.2, Docker 11.2). A Dockerfile syntax error fails the build, not the running container.|||VI: 137 = 128 + 9 (SIGKILL), thường do hết bộ nhớ (bài 5.2, Docker 11.2). Lỗi cú pháp Dockerfile làm hỏng bước build, không làm container đang chạy chết.'),
      cau('Where should a deploy pipeline keep the SSH key it uses to reach the server?|||Pipeline deploy nên giữ khoá SSH dùng để vào máy chủ ở đâu?', [
        'In the repository’s encrypted secrets (for example GitHub Actions secrets), never in the code|||Trong secrets mã hoá của repo (ví dụ secrets của GitHub Actions), không bao giờ trong code',
        'In the README so the team can find it|||Trong README cho cả nhóm dễ tìm',
        'In a committed .env file|||Trong một tệp .env đã commit',
        'Printed in the build log for debugging|||In ra log build để dễ gỡ lỗi',
      ], 0, 'EN: Secrets belong in the CI secret store, injected at run time and masked in logs (Lesson 5.3, GitHub Actions 6.1). Any committed or logged copy is a leak.|||VI: Bí mật thuộc về kho secret của CI, được đưa vào lúc chạy và che trong log (bài 5.3, GitHub Actions 6.1). Mọi bản đã commit hay in ra log đều là lộ.'),
      cau('A React component fetches data in useEffect with no dependency array and the page sends requests endlessly. Why?|||Một component React gọi API trong useEffect mà không có mảng phụ thuộc, và trang gửi request liên tục. Vì sao?', [
        'useEffect never runs without dependencies|||useEffect không bao giờ chạy nếu thiếu mảng phụ thuộc',
        'React caches the request forever|||React lưu đệm request mãi mãi',
        'Without a dependency array the effect runs after every render; setting state from the result causes another render, and so on|||Không có mảng phụ thuộc thì effect chạy sau mỗi lần render; set state từ kết quả gây render tiếp, cứ thế lặp',
        'The browser retries failed requests automatically|||Trình duyệt tự thử lại request lỗi',
      ], 2, 'EN: No array = run after every render; state updates re-render; loop (Lesson 6.1, React 4.1). An empty array [] runs it once after mount.|||VI: Không có mảng = chạy sau mỗi lần render; cập nhật state làm render lại; thành vòng lặp (bài 6.1, React 4.1). Mảng rỗng [] thì chỉ chạy một lần sau khi gắn.'),
      cau('In the Next.js App Router, what is a component by default?|||Trong App Router của Next.js, một component mặc định là gì?', [
        'A Client Component|||Một Client Component',
        'A Server Component — you opt into the browser with "use client"|||Một Server Component — muốn chạy ở trình duyệt thì khai "use client"',
        'A static HTML file with no JavaScript ever|||Một tệp HTML tĩnh không bao giờ có JavaScript',
        'It depends on the file extension|||Tuỳ theo phần mở rộng của tệp',
      ], 1, 'EN: App Router components are Server Components by default (Lesson 6.2, Next.js 9.1). Interactivity needs "use client".|||VI: Component trong App Router mặc định là Server Component (bài 6.2, Next.js 9.1). Cần tương tác thì khai "use client".'),
      cau('In a live-coding round you get a problem and immediately know a solution. What should you do first?|||Ở vòng code trực tiếp bạn nhận đề và nghĩ ra lời giải ngay. Việc đầu tiên nên làm là gì?', [
        'Start typing before you forget it|||Gõ ngay kẻo quên',
        'Ask for the optimal solution|||Xin luôn lời giải tối ưu',
        'Stay silent to concentrate|||Im lặng để tập trung',
        'Clarify inputs and edge cases, state the approach and its complexity, then code while talking|||Làm rõ đầu vào và trường hợp biên, nói hướng giải và độ phức tạp, rồi vừa code vừa nói',
      ], 3, 'EN: Clarifying catches misunderstood requirements, and stating the plan gives evidence even if time runs out (Lessons 7.1, 7.2, 10.4).|||VI: Làm rõ đề bắt được chỗ hiểu sai yêu cầu, và nói kế hoạch cho bằng chứng kể cả khi hết giờ (bài 7.1, 7.2, 10.4).'),
      cau('What does a junior-level system design question usually expect?|||Câu hỏi system design ở mức junior thường mong đợi gì?', [
        'Clear requirements, a simple working design with main components and data flow, and sensible trade-offs|||Yêu cầu rõ ràng, một thiết kế đơn giản chạy được với các thành phần chính và luồng dữ liệu, và cân nhắc hợp lý',
        'A design for a billion users with sharding on day one|||Thiết kế cho một tỉ người dùng, sharding ngay từ đầu',
        'Exact cloud prices from memory|||Giá cloud chính xác thuộc lòng',
        'Naming as many technologies as possible|||Kể càng nhiều công nghệ càng tốt',
      ], 0, 'EN: Juniors are judged on clarity and reasoning, not scale fantasies (Lesson 7.3). A list of technologies without a reason scores low.|||VI: Junior được chấm ở độ rõ ràng và suy luận, không phải kịch bản quy mô tưởng tượng (bài 7.3). Kể một dãy công nghệ không có lý do thì điểm thấp.'),
      cau('In an English interview you are not sure you understood the question. Best move?|||Trong buổi phỏng vấn tiếng Anh bạn không chắc đã hiểu câu hỏi. Nước đi tốt nhất?', [
        'Answer what you guess it was|||Trả lời theo phỏng đoán',
        'Paraphrase it: "Just to make sure I understand, you’re asking…, right?"|||Diễn đạt lại: "Just to make sure I understand, you’re asking…, right?"',
        'Say "Yes" and wait|||Nói "Yes" rồi chờ',
        'Switch to Vietnamese without asking|||Tự chuyển sang tiếng Việt mà không hỏi',
      ], 1, 'EN: Paraphrasing checks understanding in three seconds (Lesson 8.4). Guessing risks answering the wrong question; "Yes" is the most expensive mistake.|||VI: Diễn đạt lại kiểm được mình hiểu đúng chỉ trong ba giây (bài 8.4). Đoán thì có nguy cơ trả lời nhầm câu; nói "Yes" là lỗi đắt nhất.'),
      cau('Which description of the 2026 gross-to-net rules for an employee is correct?|||Mô tả nào về quy tắc gross ra net năm 2026 cho người lao động là đúng?', [
        'Income tax is a flat 10% of gross|||Thuế thu nhập là 10% cố định trên gross',
        'Employees pay no insurance; the company pays all of it|||Người lao động không đóng bảo hiểm; công ty đóng hết',
        'The employee pays 10.5% insurance (8% + 1.5% + 1%); tax applies only above the family deduction of 15.5 million (+6.2 million per dependant)|||Người lao động đóng 10,5% bảo hiểm (8% + 1,5% + 1%); thuế chỉ tính trên phần vượt mức giảm trừ 15,5 triệu (+6,2 triệu mỗi người phụ thuộc)',
        'Interns always pay the same as employees|||Thực tập sinh luôn đóng như người lao động',
      ], 2, 'EN: These are the figures checked in Lesson 9.3 (Social Insurance Law 2024; Resolution 110/2025/UBTVQH15). How an internship allowance is treated varies — ask HR.|||VI: Đây là các con số đã kiểm ở bài 9.3 (Luật BHXH 2024; Nghị quyết 110/2025/UBTVQH15). Trợ cấp thực tập xử lý thế nào thì mỗi nơi một khác — hỏi HR.'),
      cau('It is 10 December. You have two interviews pending and no confirmed company; the OJT registration deadline is mid-December. What does the course recommend?|||Hôm nay là 10/12. Bạn còn hai buổi phỏng vấn đang chờ và chưa có công ty nào chốt; hạn đăng ký OJT là giữa tháng 12. Khoá học khuyên gì?', [
        'Wait for the two interviews, whatever the deadline|||Chờ hai buổi phỏng vấn, bất kể hạn',
        'Skip OJT this semester and try next year|||Bỏ OJT kỳ này, năm sau tính',
        'Accept any offer that arrives, without reading it|||Nhận bất kỳ offer nào tới, không cần đọc',
        'Register a school-listed company before the deadline — passing the OJT semester comes first — while keeping the pending interviews alive|||Đăng ký một công ty trong danh sách trường trước hạn — qua được kỳ OJT là trên hết — trong khi vẫn giữ các buổi phỏng vấn đang chờ',
      ], 3, 'EN: The decision point exists so a missed deadline cannot cost a semester (Lessons 0.8, 10.1). Waiting past the deadline risks exactly that; accepting unread offers risks a scam.|||VI: Điểm quyết định có mặt để một lần lỡ hạn không làm mất cả một kỳ (bài 0.8, 10.1). Chờ quá hạn là đúng rủi ro đó; nhận offer mà không đọc thì có nguy cơ dính lừa đảo.'),
    ],
  },
};

export default {
  title: 'Chapter 10 — Final project: your complete application kit|||Chương 10 — Dự án cuối khoá: bộ hồ sơ ứng tuyển hoàn chỉnh',
  description: 'Dự án cuối khoá: tám sản phẩm có hạn chót thật (CV, GitHub, LinkedIn, năm câu chuyện STAR, tự giới thiệu hai thứ tiếng, ngân hàng 20 câu kỹ thuật, buổi thử 60 phút, bảng theo dõi 15 đơn), rubric 100 điểm, bản mẫu từ dự án thật, và bài kiểm tra cuối khoá 20 câu.',
  lessons: [L101, L102, L103, L104, Q105],
};
