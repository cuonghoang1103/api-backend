/**
 * IT Interview Prep — Chương 1: CV, LinkedIn và GitHub (soạn 15/11/2026).
 * Khoá chữ, khuôn khoá Redis + helper ./_pv.mjs. GIỮ slug bài của khung cũ (pv-1-1-cv … pv-1-4-linkedin).
 * Ví dụ dự án lấy từ hệ thống THẬT (cuongthai.com trong repo này, đồ án LabFlow AI) — số liệu từ CLAUDE.md, không bịa.
 * LUẬT: backtick → &#96;; không viết "${" trong chữ; < > & trong chữ → &lt; &gt; &amp;; không gạch chéo ngược;
 * dòng đóng template literal đứng riêng.
 */
import { ra, lienKet, nguon, yt, flow, stack, kv, bang, bay, keXau, doiThuong, neu, qa, thucHanh, thuatNgu, tomTat, lienQuan, rubric, cau } from './_pv.mjs';

/* ═══════════════════════ 1.1 — CV kỹ thuật một trang ═══════════════════════ */
const CV_KHUNG_EN = `
[FULL NAME]
Backend Developer Intern · Ho Chi Minh City · [phone] · [email] · github.com/[user] · linkedin.com/in/[user] · [portfolio link]

SUMMARY
Software Engineering student (FPT University) who builds and runs a production web platform
(Node.js/TypeScript, PostgreSQL, Docker). Looking for a backend internship from January 2027.

EDUCATION
FPT University — B.Sc. Software Engineering                          expected graduation 2028
Relevant: Databases (DBI202), OOP in Java (PRO192), Java Web (PRJ301), Software Testing (SWT301)

PROJECTS
cuongthai.com — learning & community platform (personal, in production)              2026 – now
- [action verb] + [what] + [how / tech] + [result or evidence]
- ...
LabFlow AI — lab & equipment management system (capstone, in progress)               2026 – now
- ...

SKILLS
Languages: JavaScript, TypeScript, Java, SQL
Backend: Node.js, Express, Spring Boot (learning), REST APIs, Prisma
Data & Ops: PostgreSQL, Redis, Docker, Docker Compose, Nginx, Git, GitHub Actions, Linux
English: reading technical documentation; [TOEIC/IELTS score if you have one]
`;

const CV_KHUNG_VI = `
[HỌ VÀ TÊN]
Thực tập sinh Backend · TP.HCM · [điện thoại] · [email] · github.com/[user] · linkedin.com/in/[user] · [link portfolio]

TÓM TẮT
Sinh viên Kỹ thuật phần mềm (Đại học FPT), tự xây và vận hành một nền tảng web đang chạy thật
(Node.js/TypeScript, PostgreSQL, Docker). Tìm vị trí thực tập backend từ tháng 1/2027.

HỌC VẤN
Đại học FPT — Kỹ thuật phần mềm                                        dự kiến tốt nghiệp 2028
Môn liên quan: Cơ sở dữ liệu (DBI202), OOP Java (PRO192), Java Web (PRJ301), Kiểm thử (SWT301)

DỰ ÁN
cuongthai.com — nền tảng học tập & cộng đồng (cá nhân, đang chạy thật)                2026 – nay
- [động từ mạnh] + [làm gì] + [bằng cách nào / công nghệ] + [kết quả hoặc bằng chứng]
- ...
LabFlow AI — hệ thống quản lý phòng lab & thiết bị (đồ án, đang làm)                  2026 – nay
- ...

KỸ NĂNG
Ngôn ngữ: JavaScript, TypeScript, Java, SQL
Backend: Node.js, Express, Spring Boot (đang học), REST API, Prisma
Dữ liệu & vận hành: PostgreSQL, Redis, Docker, Docker Compose, Nginx, Git, GitHub Actions, Linux
Tiếng Anh: đọc tài liệu kỹ thuật; [điểm TOEIC/IELTS nếu có]
`;

const L11 = {
  title: '1.1 — A one-page technical CV that gets read: structure, bullets, numbers, ATS|||1.1 — CV kỹ thuật một trang được đọc tới cuối: cấu trúc, gạch đầu dòng, con số, ATS',
  slug: 'pv-1-1-cv',
  type: 'LESSON',
  isFreePreview: true,
  description: 'CV để làm gì (lấy được buổi phỏng vấn, không phải lấy việc), bố cục một trang cho sinh viên IT, công thức gạch đầu dòng động từ + việc + cách làm + kết quả, con số thật thay cho tính từ, viết cho cả máy (ATS) lẫn người, những thứ CV Việt Nam hay thừa (ảnh, ngày sinh, số căn cước), và chống lừa "dịch vụ sửa CV".',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>A one-page technical CV that gets read to the end</h2>
<p class="lead">A CV has exactly one job: to get you an interview. It does not need to tell your life story, and it will not get you the job by itself — the interview does that. Once you see the CV as an <strong>advertisement for a conversation</strong>, every decision becomes easy: keep what makes someone want to talk to you, cut the rest, and make sure every line can survive that conversation.</p>

<h3>An everyday picture: the menu outside a restaurant</h3>
${doiThuong('en', 'You walk past ten restaurants and glance at the menu boards. A board with three clear dishes, prices and a photo makes you stop; a board crammed with sixty items in tiny letters makes you walk on — even if the food inside is better. A recruiter scanning CVs is the person walking past. They spend very little time per CV. Your CV is the menu board: a few clear, specific "dishes" (projects with results), easy to read in a few seconds, and true — because the customer will taste them in the interview.')}

<h3>The one-page layout for a student</h3>
${stack([
  ['Header', 'Name, target role, city, phone, professional email, GitHub, LinkedIn, one portfolio link. No photo needed, no date of birth, no ID number.'],
  ['Summary (2 lines)', 'Who you are + your strongest proof + what you want. Rewrite it for each posting.'],
  ['Education', 'University, major, expected graduation; relevant courses; GPA only if it helps.'],
  ['Projects (the main section)', 'Two or three projects, most impressive first, each with 3–4 bullets and a link. For students, projects outweigh everything else.'],
  ['Experience (if any)', 'Part-time, teaching assistant, freelance, club roles — written with the same bullet formula.'],
  ['Skills', 'Grouped and honest: languages, backend, data and operations, tools. No progress bars, no "90% Java".'],
  ['Extras (optional)', 'Certificates, awards, English score. Only if they are relevant and real.'],
])}
<p>One page is the norm for students and fresh graduates. It is not a rule of nature, but it forces you to choose — and choosing is exactly what makes a CV readable.</p>

<h3>What Vietnamese student CVs often get wrong</h3>
${bang(['Often included', 'Do this instead', 'Why'], [
  ['Photo, date of birth, gender, marital status', 'Leave them out unless the company explicitly asks', 'Irrelevant to the job; takes space; foreign companies and ATS do not need it.'],
  ['ID card number, full home address', 'City only', 'Personal data you should not spread (see the bad-actor box).'],
  ['"Hobbies: reading, music, travel"', 'Delete, or replace with something that shows skill (a technical blog, a club you ran)', 'Everyone writes it; it says nothing.'],
  ['"Career objective: to work in a dynamic environment"', 'A two-line summary with your strongest proof', 'Generic objectives are skipped.'],
  ['Skill bars ("Java ●●●●○")', 'Plain grouped list', 'A bar means nothing and invites "so what is the missing 20%?"'],
  ['A colourful two-column Canva template', 'A clean single-column layout', 'Some ATS read columns in the wrong order or lose text in graphics.'],
])}

<h3>The bullet formula</h3>
<p>Every bullet under a project or job follows the same shape. It is the most useful sentence pattern in this whole course:</p>
${flow([
  ['1 · Action verb', 'start with what you did', 'Built, designed, migrated, reduced, automated, diagnosed, fixed, wrote, tested, deployed — not "responsible for" or "participated in".'],
  ['2 · What', 'the thing, in words a stranger understands', '"the deploy pipeline", "the login API", "the database schema for orders".'],
  ['3 · How', 'the technique or tool', '"by moving image builds to a separate machine and pushing to a registry".'],
  ['4 · Result', 'a number, or checkable evidence', '"build time ~15 → 3–6 minutes", "0 failed deploys since", "used by N people" — only numbers you actually measured.'],
])}
<p>Before and after, from a real personal project:</p>
${bang(['Weak', 'Strong'], [
  ['Responsible for deploying the website with Docker.', 'Moved Docker image builds off the 6 GB production server to a home build machine that pushes to a container registry; builds dropped from about 15 to 3–6 minutes and the server no longer stores a build cache.'],
  ['Fixed many bugs.', 'Diagnosed a 7-minute API outage caused by an Alpine (musl) image shipping a glibc-only Prisma engine; added a pre-release check that compares the image’s libc with the engine.'],
  ['Used PostgreSQL and Prisma.', 'Wrote and applied hand-written SQL migrations with Prisma after the standard migration tool failed on the shadow database; added a drift check to the release checklist.'],
])}
${bay('en', 'inventing numbers to make bullets look "data-driven".', '"Improved performance by 40%" without a measurement is worse than no number: the first follow-up question ("how did you measure 40%?") breaks it. Use numbers you can explain — times, counts, sizes, dates — or use checkable evidence instead ("added a smoke test that fails the deploy on a 404").')}

<h3>Writing for the machine and for the human</h3>
<p>Many companies store applications in an ATS and search them by keyword. That is not a robot rejecting you at random; it is a recruiter searching "Node.js intern" or "Spring Boot". So:</p>
<ul>
<li>Use the <strong>exact words of the posting</strong> where they are true for you ("PostgreSQL", not only "Postgres"; "REST API").</li>
<li>Use <strong>standard section names</strong> (Education, Projects, Experience, Skills) and a single column.</li>
<li>Send a <strong>PDF made from text</strong>, not a scanned image. Test it: open the PDF, select all, copy, paste into a plain text editor — if the order is scrambled, an ATS will see it scrambled too.</li>
<li>Name the file properly: <code>FullName_Backend_Intern_CV.pdf</code>.</li>
</ul>
<p>Then remember the human: the recruiter reads the top third first. Your name, target role, summary and first project must carry the CV on their own.</p>

<h3>The skeleton, ready to fill</h3>
${ra(CV_KHUNG_EN)}
<p>English or Vietnamese? For IT companies in Vietnam an English CV is common and widely accepted, and it is required for foreign companies. Keep the English version as your main one and a Vietnamese copy for companies that ask for it.</p>

${keXau('en', 'A CV is a bundle of personal data. Two scams target it. First, "CV review" or "job placement" services that ask for money up front, or that collect CVs to sell phone numbers and emails to spammers. Second, fake recruiters who use your CV details to sound convincing in a later phishing message ("Hi, about your application for the Node.js role…"). Defences: never put your ID card number, full address or date of birth on a CV; post CVs only on known job sites; when you share a CV link (Google Drive), make it view-only and turn it off after the hiring season; and check the sender of any follow-up message against the company you really applied to.')}
${neu('en', 'your GPA is not good? Leave it out — nobody requires it on a CV. If you are asked in the interview, answer honestly and briefly, then move to what you have built ("my GPA is average; I put most of my effort into building and running a real system, which I can show you").')}

<h3>Interview questions this lesson prepares you for</h3>
${qa('en', { so: '1.1-1', q: '"Walk me through your CV."', chu: 'whether you can tell a short, ordered story and lead to your strongest proof.', a: '<p>Two minutes, top to bottom, ending on what you want: "I’m a fifth-term software engineering student at FPT University. My strongest project is a web platform I built and still run in production — Next.js, an Express/TypeScript API, PostgreSQL, deployed with Docker on a VPS. What I learnt most there is operations: I redesigned the deploy so builds run on a separate machine, and I added checks after two real outages. I’m also building my capstone in Spring Boot. I’m looking for a backend internship where I can work on a real team’s codebase."</p>', sau: ['"Which part of that project are you proudest of?"', '"You said two outages — tell me about one."'], loi: 'reading the CV aloud line by line, or spending the two minutes on high school.' })}
${qa('en', { so: '1.1-2', q: '"I see you listed Redis. When would you NOT cache something?"', chu: 'whether a Skills line is real.', a: '<p>"When the data must always be exact — like a balance or a permission — or when it changes more often than it is read, or when computing it is already cheap. Caching adds a second copy that can be stale, so it is only worth it when reads are frequent and slightly old data is acceptable. In my project I use Redis for things like sessions and rate limits rather than for authoritative data."</p>', sau: ['"How do you invalidate a cached value?"', '"What happens if Redis is down?"'], loi: 'listing a technology you have only seen in a tutorial — if you cannot answer this, move Redis to "familiar" or remove it.' })}

${thucHanh('en', { phut: '30–40', steps: [
  'Copy the skeleton into a document and fill the header, summary and education.',
  'Write three bullets for your strongest project using the four-part formula. Every bullet must start with an action verb and end with a number or checkable evidence.',
  'Delete everything from the "often included" column that you had.',
  'Export to PDF and run the copy-paste test in a plain text editor.',
], dat: 'you have a one-page PDF draft whose first project has three formula bullets, no personal ID data, and text that pastes in the right order.' })}
${thuatNgu('en', [
  ['CV / résumé', 'In Vietnam and Europe usually called CV; in the US "résumé". For students it means the same one-page document.'],
  ['Bullet point', 'One line under a project or job, written as action + what + how + result.'],
  ['Action verb', 'A verb that says what you did: built, reduced, diagnosed, automated.'],
  ['ATS keyword', 'A word from the posting a recruiter may search for; use it when it is true.'],
  ['Summary', 'Two lines at the top: who you are, your best proof, what you want.'],
  ['Tailoring', 'Adjusting the summary and bullet order for each posting.'],
])}
${tomTat('en', [
  'A CV exists to get an interview; every line must survive a follow-up question.',
  'One page, single column: header, summary, education, projects, experience, skills.',
  'Bullets follow action verb + what + how + result, with only numbers you measured.',
  'Leave out photo, date of birth, ID number, generic objectives and skill bars.',
  'Use the posting’s exact words where true, send a text PDF, and run the copy-paste test.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-2-1-cv-portfolio', academy: true, L: 'en', title: 'Academy · OJT202 2.1 — CV, portfolio and interview prep', sub: 'The school’s checklist — compare it with the layout in this lesson.' }),
  yt('eGmZZFJ-8PY', 'Farah Sharghi', 'Ex-Google Recruiter Explains: 6 Résumé Secrets That Get You Hired', 10, 'en'),
  nguon('📘', 'Tech Interview Handbook — Resume', 'A detailed, free guide to software engineering CVs.', 'https://www.techinterviewhandbook.org/resume/'),
  nguon('📄', 'Jake’s Resume (Overleaf template)', 'A popular single-column template for software engineering CVs.', 'https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>CV kỹ thuật một trang được đọc tới tận cuối</h2>
<p class="lead">CV chỉ có đúng một nhiệm vụ: đem về cho bạn một buổi phỏng vấn. Nó không cần kể đời bạn, và tự nó không lấy được việc — buổi phỏng vấn mới làm việc đó. Khi bạn coi CV là <strong>một tấm quảng cáo cho một cuộc nói chuyện</strong>, mọi quyết định trở nên dễ: giữ những gì khiến người ta muốn nói chuyện với bạn, cắt phần còn lại, và bảo đảm từng dòng đều sống sót qua cuộc nói chuyện đó.</p>

<h3>Liên tưởng đời thường: tấm bảng thực đơn trước cửa quán</h3>
${doiThuong('vi', 'Bạn đi ngang mười quán ăn và liếc bảng thực đơn. Tấm bảng có ba món rõ ràng, có giá, có ảnh khiến bạn dừng lại; tấm bảng nhồi sáu mươi món chữ li ti khiến bạn đi tiếp — kể cả khi đồ ăn bên trong ngon hơn. Người tuyển dụng lướt CV chính là người đi ngang. Họ dành rất ít thời gian cho mỗi CV. CV của bạn là tấm bảng thực đơn: vài "món" rõ ràng, cụ thể (dự án có kết quả), đọc vài giây là hiểu, và có thật — vì khách sẽ nếm thử trong buổi phỏng vấn.')}

<h3>Bố cục một trang cho sinh viên</h3>
${stack([
  ['Phần đầu (header)', 'Họ tên, vị trí nhắm tới, thành phố, số điện thoại, email nghiêm túc, GitHub, LinkedIn, một link portfolio. Không cần ảnh, không ngày sinh, không số căn cước.'],
  ['Tóm tắt (2 dòng)', 'Bạn là ai + bằng chứng mạnh nhất + bạn muốn gì. Viết lại cho từng tin tuyển dụng.'],
  ['Học vấn', 'Trường, ngành, năm dự kiến tốt nghiệp; môn liên quan; điểm trung bình chỉ khi nó giúp bạn.'],
  ['Dự án (phần chính)', 'Hai ba dự án, ấn tượng nhất lên đầu, mỗi dự án 3–4 gạch đầu dòng và một đường dẫn. Với sinh viên, dự án nặng ký hơn mọi thứ khác.'],
  ['Kinh nghiệm (nếu có)', 'Làm thêm, trợ giảng, freelance, vai trò trong câu lạc bộ — viết bằng cùng công thức gạch đầu dòng.'],
  ['Kỹ năng', 'Gom nhóm và trung thực: ngôn ngữ, backend, dữ liệu và vận hành, công cụ. Không thanh tiến độ, không "Java 90%".'],
  ['Phần thêm (tuỳ)', 'Chứng chỉ, giải thưởng, điểm tiếng Anh. Chỉ khi liên quan và có thật.'],
])}
<p>Một trang là chuẩn cho sinh viên và người mới ra trường. Đó không phải định luật, nhưng nó buộc bạn phải chọn — và chính việc chọn làm cho CV dễ đọc.</p>

<h3>Những thứ CV sinh viên Việt Nam hay làm sai</h3>
${bang(['Hay có', 'Nên làm thay', 'Vì sao'], [
  ['Ảnh, ngày sinh, giới tính, tình trạng hôn nhân', 'Bỏ ra, trừ khi công ty yêu cầu rõ', 'Không liên quan tới công việc; tốn chỗ; công ty nước ngoài và ATS không cần.'],
  ['Số căn cước, địa chỉ nhà đầy đủ', 'Chỉ ghi thành phố', 'Dữ liệu cá nhân không nên rải ra (xem ô góc kẻ xấu).'],
  ['"Sở thích: đọc sách, nghe nhạc, du lịch"', 'Xoá, hoặc thay bằng thứ cho thấy kỹ năng (blog kỹ thuật, câu lạc bộ bạn điều hành)', 'Ai cũng ghi; chẳng nói lên gì.'],
  ['"Mục tiêu nghề nghiệp: được làm việc trong môi trường năng động"', 'Hai dòng tóm tắt kèm bằng chứng mạnh nhất', 'Mục tiêu chung chung bị lướt qua.'],
  ['Thanh kỹ năng ("Java ●●●●○")', 'Danh sách gom nhóm đơn giản', 'Thanh vẽ không có nghĩa gì và mời gọi câu "thế 20% còn thiếu là gì?"'],
  ['Mẫu Canva hai cột nhiều màu', 'Bố cục một cột sạch sẽ', 'Một số ATS đọc cột sai thứ tự hoặc mất chữ nằm trong hình.'],
])}

<h3>Công thức gạch đầu dòng</h3>
<p>Mọi gạch đầu dòng dưới một dự án hay một công việc đều theo cùng một khuôn. Đây là mẫu câu hữu ích nhất của cả khoá:</p>
${flow([
  ['1 · Động từ mạnh', 'mở đầu bằng việc bạn đã làm', 'Xây dựng, thiết kế, chuyển, giảm, tự động hoá, chẩn đoán, sửa, viết, kiểm thử, triển khai — không phải "chịu trách nhiệm" hay "tham gia".'],
  ['2 · Làm gì', 'đối tượng, bằng lời người lạ hiểu', '"quy trình deploy", "API đăng nhập", "lược đồ cơ sở dữ liệu cho đơn hàng".'],
  ['3 · Bằng cách nào', 'kỹ thuật hoặc công cụ', '"bằng cách chuyển việc dựng ảnh sang một máy riêng rồi đẩy lên registry (kho ảnh)".'],
  ['4 · Kết quả', 'một con số, hoặc bằng chứng kiểm được', '"thời gian build ~15 → 3–6 phút", "0 lần deploy lỗi từ đó", "N người dùng" — chỉ những con số bạn thật sự đo.'],
])}
<p>Trước và sau, lấy từ một dự án cá nhân có thật:</p>
${bang(['Yếu', 'Mạnh'], [
  ['Chịu trách nhiệm deploy website bằng Docker.', 'Chuyển việc dựng ảnh Docker khỏi máy chủ production 6 GB sang một máy dựng ở nhà đẩy lên container registry; thời gian build giảm từ khoảng 15 xuống 3–6 phút và máy chủ không còn giữ cache build.'],
  ['Sửa nhiều lỗi.', 'Chẩn đoán sự cố API chết 7 phút do ảnh Alpine (thư viện C musl) mang engine Prisma chỉ chạy với glibc; thêm bước kiểm trước khi phát hành so libc của ảnh với engine.'],
  ['Dùng PostgreSQL và Prisma.', 'Viết tay và áp migration SQL với Prisma sau khi công cụ migrate chuẩn hỏng trên shadow database; thêm phép kiểm lệch lược đồ (drift) vào checklist phát hành.'],
])}
${bay('vi', 'bịa con số để gạch đầu dòng trông "có số liệu".', '"Cải thiện hiệu năng 40%" mà không có phép đo còn tệ hơn không có số: câu đào sâu đầu tiên ("em đo 40% thế nào?") là gãy. Dùng con số bạn giải thích được — thời gian, số lượng, dung lượng, ngày tháng — hoặc dùng bằng chứng kiểm được thay vào ("thêm smoke test làm deploy thất bại khi gặp 404").')}

<h3>Viết cho cả máy lẫn người</h3>
<p>Nhiều công ty lưu đơn trong ATS và tìm theo từ khoá. Đó không phải con robot loại bạn ngẫu nhiên; đó là người tuyển dụng gõ tìm "Node.js intern" hay "Spring Boot". Vì vậy:</p>
<ul>
<li>Dùng <strong>đúng chữ trong tin tuyển dụng</strong> khi nó đúng với bạn ("PostgreSQL", không chỉ "Postgres"; "REST API").</li>
<li>Dùng <strong>tên mục chuẩn</strong> (Education, Projects, Experience, Skills) và một cột.</li>
<li>Gửi <strong>PDF dựng từ chữ</strong>, không phải ảnh scan. Kiểm thử: mở PDF, chọn hết, sao chép, dán vào trình soạn thảo văn bản thuần — nếu thứ tự bị xáo trộn thì ATS cũng thấy nó xáo trộn.</li>
<li>Đặt tên tệp đàng hoàng: <code>HoTen_Backend_Intern_CV.pdf</code>.</li>
</ul>
<p>Rồi nhớ tới con người: người tuyển dụng đọc một phần ba trên cùng trước. Tên, vị trí nhắm tới, tóm tắt và dự án đầu tiên phải tự gánh được cả CV.</p>

<h3>Bộ khung, sẵn để điền</h3>
${ra(CV_KHUNG_VI)}
<p>Tiếng Anh hay tiếng Việt? Với công ty IT ở Việt Nam, CV tiếng Anh phổ biến và được chấp nhận rộng rãi, và là bắt buộc với công ty nước ngoài. Giữ bản tiếng Anh làm bản chính và một bản tiếng Việt cho công ty yêu cầu.</p>

${keXau('vi', 'CV là một gói dữ liệu cá nhân. Có hai kiểu lừa nhắm vào nó. Một là "dịch vụ sửa CV" hay "giới thiệu việc làm" đòi tiền trước, hoặc gom CV để bán số điện thoại và email cho bên spam. Hai là recruiter giả dùng thông tin trong CV của bạn để nói chuyện cho thật trong một tin nhắn lừa đảo sau đó ("Chào em, về đơn ứng tuyển vị trí Node.js của em…"). Cách phòng: không bao giờ ghi số căn cước, địa chỉ đầy đủ hay ngày sinh lên CV; chỉ đăng CV trên trang việc làm có tên tuổi; khi chia sẻ link CV (Google Drive) thì để chỉ xem và tắt sau mùa tuyển dụng; và đối chiếu người gửi của mọi tin nhắn theo tiếp với công ty bạn thật sự đã nộp.')}
${neu('vi', 'điểm trung bình của bạn không đẹp? Bỏ ra — không ai bắt phải ghi lên CV. Nếu bị hỏi trong buổi phỏng vấn, trả lời thật và ngắn, rồi chuyển sang thứ bạn đã làm ra ("điểm của em ở mức trung bình; em dồn phần lớn sức vào việc xây và vận hành một hệ thống thật, em cho anh xem được").')}

<h3>Câu hỏi phỏng vấn bài này chuẩn bị cho bạn</h3>
${qa('vi', { so: '1.1-1', q: '"Em đi qua CV của em cho anh nghe nhé."', chu: 'bạn có kể được một câu chuyện ngắn, có thứ tự, và dẫn tới bằng chứng mạnh nhất không.', a: '<p>Hai phút, từ trên xuống, kết thúc bằng điều bạn muốn: "Em là sinh viên Kỹ thuật phần mềm kỳ năm ở Đại học FPT. Dự án mạnh nhất của em là một nền tảng web em tự xây và vẫn đang vận hành thật — Next.js, API Express/TypeScript, PostgreSQL, deploy bằng Docker trên VPS. Điều em học được nhiều nhất ở đó là vận hành: em thiết kế lại quy trình deploy để việc build chạy ở một máy riêng, và thêm các bước kiểm sau hai lần sự cố thật. Em cũng đang làm đồ án bằng Spring Boot. Em tìm một vị trí thực tập backend để được làm trên mã nguồn của một đội thật."</p>', sau: ['"Phần nào trong dự án đó em tự hào nhất?"', '"Em nói có hai lần sự cố — kể anh nghe một lần."'], loi: 'đọc to CV từng dòng, hoặc dùng hai phút để kể chuyện cấp ba.' })}
${qa('vi', { so: '1.1-2', q: '"Anh thấy em ghi Redis. Khi nào thì em KHÔNG cache một thứ?"', chu: 'một dòng trong mục Kỹ năng có thật không.', a: '<p>"Khi dữ liệu phải luôn chính xác — như số dư hay quyền truy cập — hoặc khi nó đổi thường xuyên hơn số lần được đọc, hoặc khi tính ra nó vốn đã rẻ. Cache thêm một bản sao có thể bị cũ, nên chỉ đáng khi đọc nhiều và chấp nhận được dữ liệu hơi cũ. Trong dự án của em, em dùng Redis cho những thứ như phiên đăng nhập và giới hạn tần suất chứ không cho dữ liệu gốc."</p>', sau: ['"Em làm mất hiệu lực (invalidate) một giá trị đã cache thế nào?"', '"Nếu Redis sập thì chuyện gì xảy ra?"'], loi: 'ghi một công nghệ chỉ mới thấy trong video hướng dẫn — nếu không trả lời được câu này, chuyển Redis sang "có biết" hoặc bỏ đi.' })}

${thucHanh('vi', { phut: '30–40', steps: [
  'Chép bộ khung vào một tài liệu và điền phần đầu, tóm tắt và học vấn.',
  'Viết ba gạch đầu dòng cho dự án mạnh nhất theo công thức bốn phần. Dòng nào cũng phải mở bằng động từ mạnh và kết bằng một con số hoặc bằng chứng kiểm được.',
  'Xoá mọi thứ thuộc cột "hay có" mà CV cũ của bạn đang có.',
  'Xuất ra PDF và làm phép thử sao chép–dán vào trình soạn thảo văn bản thuần.',
], dat: 'bạn có một bản nháp PDF một trang, dự án đầu có ba gạch đầu dòng đúng công thức, không có dữ liệu định danh cá nhân, và chữ dán ra đúng thứ tự.' })}
${thuatNgu('vi', [
  ['CV / résumé', 'Ở Việt Nam và châu Âu thường gọi CV; ở Mỹ gọi "résumé". Với sinh viên, cả hai là cùng một tài liệu một trang.'],
  ['Bullet point (gạch đầu dòng)', 'Một dòng dưới một dự án hay công việc, viết theo động từ + việc + cách làm + kết quả.'],
  ['Action verb (động từ hành động)', 'Động từ nói bạn đã làm gì: xây, giảm, chẩn đoán, tự động hoá.'],
  ['ATS keyword (từ khoá)', 'Một chữ trong tin tuyển dụng mà người tuyển dụng có thể tìm; dùng khi nó đúng với bạn.'],
  ['Summary (tóm tắt)', 'Hai dòng trên cùng: bạn là ai, bằng chứng tốt nhất, bạn muốn gì.'],
  ['Tailoring (may đo)', 'Chỉnh phần tóm tắt và thứ tự gạch đầu dòng cho từng tin tuyển dụng.'],
])}
${tomTat('vi', [
  'CV tồn tại để lấy buổi phỏng vấn; từng dòng phải sống sót qua một câu hỏi đào sâu.',
  'Một trang, một cột: phần đầu, tóm tắt, học vấn, dự án, kinh nghiệm, kỹ năng.',
  'Gạch đầu dòng theo động từ + việc + cách làm + kết quả, chỉ dùng con số bạn đã đo.',
  'Bỏ ảnh, ngày sinh, số căn cước, mục tiêu chung chung và thanh kỹ năng.',
  'Dùng đúng chữ của tin tuyển dụng khi đúng sự thật, gửi PDF dạng chữ, và làm phép thử sao chép–dán.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-2-1-cv-portfolio', academy: true, title: 'Academy · OJT202 2.1 — CV, portfolio và chuẩn bị phỏng vấn', sub: 'Danh sách kiểm của nhà trường — đặt cạnh bố cục trong bài này để so.' }),
  yt('eGmZZFJ-8PY', 'Farah Sharghi', 'Ex-Google Recruiter Explains: 6 Résumé Secrets That Get You Hired', 10),
  nguon('📘', 'Tech Interview Handbook — Resume', 'Hướng dẫn chi tiết, miễn phí về CV kỹ sư phần mềm (tiếng Anh).', 'https://www.techinterviewhandbook.org/resume/'),
  nguon('📄', 'Jake’s Resume (mẫu Overleaf)', 'Mẫu CV một cột rất phổ biến cho kỹ sư phần mềm.', 'https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs'),
])}
</div>
`,
};

/* ═══════════════════════ 1.2 — Viết dự án trong CV ═══════════════════════ */
const DU_AN_EN = `
cuongthai.com — learning & community platform · personal project, in production        2026 – now
Next.js · Express/TypeScript · PostgreSQL/Prisma · Redis · Cloudflare R2 · Docker Compose · Nginx · GitHub Actions
- Designed and operate the full stack on a single Ubuntu VPS with Docker Compose; built with AI coding
  assistants, with my focus on architecture, code review, deployment and incident response.
- Moved image builds from the 6 GB VPS to a home build machine pushing to GHCR; build time ~15 -> 3-6 min,
  and the VPS no longer keeps a build cache (which had once filled the disk holding PostgreSQL).
- Added a post-deploy smoke test that fails the release when a core API route returns 404, after a stale
  image was deployed silently; separated "push to main" from "deploy" after two race-condition outages.
- Diagnosed a 7-minute API outage (Alpine/musl image shipping a glibc Prisma engine) and added a
  pre-release libc/engine check.
Links: live site · case-study README · architecture diagram

LabFlow AI — lab & equipment management system · capstone, in progress                   2026 – now
Spring Boot · React · PostgreSQL · IoT sensors
- Coding the backend by hand as a modular monolith (modules talk through interfaces, no cross-module joins),
  so it can be split later without a rewrite.
- Tracking 46 requirements across 20 weeks on a Jira-style board with weekly milestones.
Links: repository · requirements page
`;

const DU_AN_VI = `
cuongthai.com — nền tảng học tập & cộng đồng · dự án cá nhân, đang chạy thật           2026 – nay
Next.js · Express/TypeScript · PostgreSQL/Prisma · Redis · Cloudflare R2 · Docker Compose · Nginx · GitHub Actions
- Thiết kế và vận hành toàn bộ hệ thống trên một VPS Ubuntu bằng Docker Compose; xây cùng trợ lý AI viết
  code, phần em tập trung là kiến trúc, duyệt mã, quy trình deploy và xử lý sự cố.
- Chuyển việc dựng ảnh từ VPS 6 GB sang máy dựng ở nhà đẩy lên GHCR; thời gian build ~15 -> 3-6 phút,
  và VPS không còn giữ cache build (thứ từng làm đầy ổ đĩa chứa PostgreSQL).
- Thêm smoke test sau deploy làm bản phát hành thất bại khi một route API cốt lõi trả 404, sau một lần ảnh
  cũ bị deploy âm thầm; tách "push lên main" khỏi "deploy" sau hai lần sập vì hai luồng deploy đua nhau.
- Chẩn đoán sự cố API chết 7 phút (ảnh Alpine/musl mang engine Prisma bản glibc) và thêm bước kiểm
  libc/engine trước khi phát hành.
Đường dẫn: trang chạy thật · README dạng case study · sơ đồ kiến trúc

LabFlow AI — hệ thống quản lý phòng lab & thiết bị · đồ án tốt nghiệp, đang làm         2026 – nay
Spring Boot · React · PostgreSQL · cảm biến IoT
- Tự code tay phần backend theo kiến trúc modular monolith (module gọi nhau qua interface, không join chéo
  module), để sau này tách được mà không phải viết lại.
- Theo dõi 46 yêu cầu trong 20 tuần trên board kiểu Jira với mốc kiểm hằng tuần.
Đường dẫn: kho mã · trang yêu cầu
`;

const L12 = {
  title: '1.2 — Writing projects on your CV: role, decisions, problems, results|||1.2 — Viết dự án trong CV: vai trò, quyết định, sự cố, kết quả',
  slug: 'pv-1-2-du-an-cv',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Giải phẫu một mục dự án (tên, một dòng mô tả, vai trò, công nghệ, 3–4 gạch đầu dòng, đường dẫn), bốn loại gạch đầu dòng (tính năng, quyết định, sự cố, kết quả), viết đúng phần của mình trong dự án nhóm, viết trung thực về dự án làm cùng AI, ví dụ đầy đủ từ cuongthai.com và LabFlow AI, và luật "ba tầng đào sâu".',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Writing projects on your CV — what you did, why, what broke, what changed</h2>
<p class="lead">For a student, the Projects section <em>is</em> the CV. It is where an interviewer decides what to ask you for the next forty minutes. This lesson shows how to write a project entry that invites good questions — about your decisions and the problems you solved — instead of questions you cannot answer.</p>

<h3>An everyday picture: describing a house you built</h3>
${doiThuong('en', 'Imagine two people describing a small house they built. The first says: "I used bricks, cement, a roof and doors." The second says: "I built three rooms; I moved the kitchen to the back after the first rains flooded it; the roof has not leaked since." The first lists materials — like a CV that lists technologies. The second tells you what was built, what decision was made and why, what went wrong and what changed. That is the second kind of project entry this lesson teaches.')}

<h3>Anatomy of one project entry</h3>
${stack([
  ['Name + one line', 'What it is, for whom — "a lab and equipment management system for a university faculty".'],
  ['Context', 'Personal / team of N / capstone / internship; dates; status (in production, in progress, finished).'],
  ['Stack (one line)', 'The main technologies, in the posting’s words where true.'],
  ['3–4 bullets', 'Each a different kind: a feature, a decision, a problem, a result (next section).'],
  ['Links', 'Live demo, repository or a case-study README, an architecture diagram.'],
])}

<h3>Four kinds of bullet — use a mix</h3>
${flow([
  ['Feature', 'what you built', '"Built the booking API with optimistic locking so two users cannot take the same slot." Shows you can deliver.'],
  ['Decision', 'what you chose and why', '"Chose a modular monolith over microservices for a one-person capstone, keeping module boundaries so it can be split later." Shows judgement.'],
  ['Problem', 'what broke and how you fixed it', '"Diagnosed a 7-minute outage caused by a musl/glibc mismatch and added a pre-release check." Shows debugging — interviewers love these.'],
  ['Result', 'what changed, measured', '"Build time ~15 → 3–6 minutes." Shows impact. Only measured numbers.'],
])}
<p>Students usually write only feature bullets ("built login, built CRUD, built search"). A decision bullet and a problem bullet are what make an interviewer think "this person has actually run software".</p>

<h3>Team projects: say exactly what was yours</h3>
<p>"Our team built an e-commerce site" tells the interviewer nothing about you. Write the team size and your part: "Team of 5 · I owned the order and payment module: …". In the interview, use "I" for what you did and "we" for what the team did — mixing them up in either direction is noticed. If your part was small, make it deep instead: one module you understand completely beats a whole project you only watched.</p>

<h3>Projects built with AI assistance: write the truth, and it is still strong</h3>
${bang(['Instead of', 'Write', 'Why'], [
  ['"Built a Jira-like project tracker with sprints, boards and JQL search."', '"Designed and led development (with AI coding assistants) of a Jira-like tracker; I reviewed the code, designed the data model and permissions, and ran it in production."', 'The first invites "show me how you implemented JQL parsing" — and if you did not write it, you fail on honesty.'],
  ['"Developed 600+ database tables."', 'Leave the raw count out, or explain it: "a multi-module platform (courses, social, project tracker) on one PostgreSQL database".', 'A big number with no story looks inflated and invites a hard follow-up.'],
  ['Hiding the AI part entirely', 'Mention it once, plainly, then focus on your decisions and incidents', 'AI use is normal now; hiding it and being caught is not.'],
])}
<p>A useful split for many students: <strong>one hand-coded project</strong> (often the capstone) proves you can write code; <strong>one larger system you operate</strong> proves engineering judgement. Together they are more convincing than either alone.</p>

<h3>A complete example from real projects</h3>
${ra(DU_AN_EN)}
<p>Every number above comes from the project’s own records — build times, the outage duration, the requirement count. Nothing is estimated.</p>

<h3>The three-level rule</h3>
<p>Before a bullet goes on the CV, ask yourself three follow-up questions about it, each deeper than the last. If you cannot answer the third, rewrite or remove the bullet.</p>
${bang(['Bullet', 'Level 1', 'Level 2', 'Level 3'], [
  ['Moved builds to a home machine pushing to GHCR', 'Why not build on the server?', 'How does the server get the new image, and what if the push fails?', 'How do you roll back to the previous image?'],
  ['Added a smoke test that fails on 404', 'Why 404 and not any error?', 'Which routes, and why not POST routes?', 'What did the stale build look like from outside?'],
  ['Modular monolith for LabFlow', 'Why not microservices?', 'How do modules communicate?', 'What would you do first if you had to split one module out?'],
])}
${bay('en', 'tutorial clones with nothing of your own.', 'A "Netflix clone" or "todo app" copied from a video is easy to recognise and invites "what did you change from the tutorial?". If you have one, add something real — authentication, tests, a deployment, a feature the tutorial did not have — and write bullets about that part only.')}
${keXau('en', 'a demo link on a CV is an invitation to the whole internet, not only to recruiters. Do not ship a demo with a default admin account, a test password printed in the README, an open registration that sends email, or an API key in the frontend bundle. Give recruiters a read-only demo account, put rate limits on login, and check that the repository history has no secrets (Lesson 1.3).')}
${neu('en', 'your capstone is only half finished when you apply? Write it as "in progress" with what already works, and one bullet on the design. "In progress, here is the design and the part that runs" is honest and interesting; claiming features that do not exist is not.')}

<h3>Interview questions this lesson prepares you for</h3>
${qa('en', { so: '1.2-1', q: '"Tell me about a project you are proud of."', chu: 'depth, ownership and whether you talk about decisions or only features.', a: '<p>Pick one project and use the order context → your role → one decision → one problem → result: "My personal platform runs in production on one VPS with Docker Compose. I built it with AI coding assistants, and my own work was mostly architecture and operations. The decision I’m proudest of was separating pushing code from deploying: we had two outages when two deploy pipelines raced each other on every push. Now deploys are a script I run, builds happen on a separate machine, and a smoke test fails the deploy if a core route returns 404. Since then that race cannot happen any more, because a push no longer starts a deploy at all."</p>', sau: ['"Why did the two pipelines race?"', '"What is in the smoke test exactly?"', '"What would you do differently today?"'], loi: 'listing every feature of the project for three minutes without one decision or problem.' })}
${qa('en', { so: '1.2-2', q: '"In your team project, what did you personally do?"', chu: 'whether "we" hides that you did little.', a: '<p>"We were five. I owned the booking module: the database tables, the API and the validation rules. The hardest part was preventing double bookings — I used a unique constraint on the slot plus a transaction, and wrote tests that try to book the same slot twice. I also reviewed two teammates’ pull requests each week."</p>', sau: ['"Show me the table design."', '"How did the tests simulate two users?"'], loi: '"I did a bit of everything" — it sounds like nothing in particular.' })}
${qa('en', { so: '1.2-3', q: '"If you rebuilt this project from scratch, what would you change?"', chu: 'reflection — the ability to see your own mistakes.', a: '<p>"I would add automated tests for the deploy path from day one — two of my incidents would have been caught by a check that exists today. And I would decide the deployment model before adding features, instead of letting push-to-deploy grow until it broke."</p>', sau: ['"Why didn’t you do that the first time?"'], loi: '"Nothing, it’s good" — it signals no reflection.' })}

${thucHanh('en', { phut: '40–50', steps: [
  'Pick your two strongest projects. For each, write the name line, context, stack and links.',
  'Write four bullets per project, one of each kind: feature, decision, problem, result.',
  'For team or AI-assisted work, rewrite any bullet that claims more than you did.',
  'Apply the three-level rule to every bullet with a friend (or yourself, out loud). Remove bullets that fail level 3.',
], dat: 'two project entries, each with a decision bullet and a problem bullet, every bullet survives three follow-ups.' })}
${thuatNgu('en', [
  ['Project entry', 'One block in the Projects section: name, context, stack, bullets, links.'],
  ['Decision bullet', 'A bullet about a choice you made and why.'],
  ['Incident', 'A real failure in a running system — an outage, data loss, a bad deploy.'],
  ['Case study', 'A short write-up of a project: problem, decisions, results, lessons.'],
  ['Modular monolith', 'One deployable application with strict internal module boundaries.'],
  ['Follow-up question', 'The interviewer’s next, deeper question about what you just said.'],
])}
${tomTat('en', [
  'For students the Projects section is the CV; it decides what you will be asked.',
  'Mix four bullet kinds: feature, decision, problem, result — not only features.',
  'In team projects state the team size and exactly your part.',
  'Describe AI-assisted work truthfully and focus on your decisions and incidents.',
  'Every bullet must survive three levels of follow-up; otherwise rewrite or cut it.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'software-development-project', bai: 'swp391-0-6-chong-truot-diem-cao', academy: true, L: 'en', title: 'Academy · SWP391 0.8 — Why teams lose marks, and how to score high', sub: 'The same "who did what" problem, seen from the grading side of a team project.' }),
  yt('pjiLoJf-B2U', 'Roman Taylor', 'What Projects to Put on Your Resume [as a Software Engineer]', 10, 'en'),
  nguon('🧪', 'LabFlow AI — project page', 'An example of a project case-study page: goals, architecture, requirements, plan.', '/projects/labflow-ai'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Viết dự án trong CV — bạn làm gì, vì sao, cái gì hỏng, cái gì thay đổi</h2>
<p class="lead">Với sinh viên, mục Dự án <em>chính là</em> CV. Đó là nơi người phỏng vấn quyết định sẽ hỏi bạn gì trong bốn mươi phút tới. Bài này chỉ cách viết một mục dự án mời gọi những câu hỏi tốt — về quyết định của bạn và những vấn đề bạn đã giải — thay vì những câu bạn không trả lời nổi.</p>

<h3>Liên tưởng đời thường: kể về căn nhà bạn tự xây</h3>
${doiThuong('vi', 'Hãy tưởng tượng hai người kể về căn nhà nhỏ mình tự xây. Người thứ nhất: "Tôi dùng gạch, xi măng, mái và cửa." Người thứ hai: "Tôi xây ba phòng; sau trận mưa đầu tiên bếp bị ngập nên tôi dời bếp ra sau; từ đó mái không dột lần nào." Người thứ nhất liệt kê vật liệu — giống CV liệt kê công nghệ. Người thứ hai cho bạn biết đã xây gì, đã quyết định gì và vì sao, cái gì hỏng và cái gì đã thay đổi. Bài này dạy kiểu mục dự án thứ hai.')}

<h3>Giải phẫu một mục dự án</h3>
${stack([
  ['Tên + một dòng', 'Nó là gì, cho ai — "hệ thống quản lý phòng lab và thiết bị cho một khoa của trường đại học".'],
  ['Bối cảnh', 'Cá nhân / nhóm N người / đồ án / thực tập; thời gian; trạng thái (đang chạy thật, đang làm, đã xong).'],
  ['Công nghệ (một dòng)', 'Các công nghệ chính, dùng chữ của tin tuyển dụng khi đúng.'],
  ['3–4 gạch đầu dòng', 'Mỗi dòng một loại khác nhau: tính năng, quyết định, sự cố, kết quả (phần dưới).'],
  ['Đường dẫn', 'Bản demo đang chạy, kho mã hoặc README dạng case study, sơ đồ kiến trúc.'],
])}

<h3>Bốn loại gạch đầu dòng — dùng trộn</h3>
${flow([
  ['Tính năng', 'bạn đã làm ra gì', '"Xây API đặt lịch có khoá lạc quan (optimistic locking) để hai người không lấy cùng một khung giờ." Cho thấy bạn làm ra được sản phẩm.'],
  ['Quyết định', 'bạn đã chọn gì và vì sao', '"Chọn modular monolith thay vì microservices cho đồ án một người làm, giữ ranh giới module để sau này tách được." Cho thấy óc phán đoán.'],
  ['Sự cố', 'cái gì hỏng và bạn sửa thế nào', '"Chẩn đoán sự cố sập 7 phút do lệch musl/glibc và thêm bước kiểm trước phát hành." Cho thấy khả năng gỡ lỗi — người phỏng vấn rất thích loại này.'],
  ['Kết quả', 'cái gì đã thay đổi, có đo', '"Thời gian build ~15 → 3–6 phút." Cho thấy tác động. Chỉ con số đã đo.'],
])}
<p>Sinh viên thường chỉ viết loại tính năng ("làm đăng nhập, làm CRUD, làm tìm kiếm"). Một dòng quyết định và một dòng sự cố mới là thứ khiến người phỏng vấn nghĩ "bạn này đã thật sự vận hành phần mềm".</p>

<h3>Dự án nhóm: nói đúng phần của mình</h3>
<p>"Nhóm em làm một trang thương mại điện tử" không nói gì về bạn. Ghi số người và phần của bạn: "Nhóm 5 người · em phụ trách module đơn hàng và thanh toán: …". Trong buổi phỏng vấn, dùng "em" cho việc bạn làm và "nhóm em" cho việc cả nhóm làm — lẫn lộn theo chiều nào cũng bị nhận ra. Nếu phần của bạn nhỏ, hãy làm nó SÂU: một module bạn hiểu trọn vẹn thắng cả một dự án bạn chỉ đứng xem.</p>

<h3>Dự án làm cùng AI: viết đúng sự thật, và nó vẫn mạnh</h3>
${bang(['Thay vì', 'Hãy viết', 'Vì sao'], [
  ['"Xây một công cụ quản lý dự án kiểu Jira có sprint, board và tìm kiếm JQL."', '"Thiết kế và dẫn dắt việc phát triển (cùng trợ lý AI viết code) một công cụ kiểu Jira; em duyệt mã, thiết kế mô hình dữ liệu và phân quyền, và vận hành nó trên production."', 'Câu đầu mời gọi "em cho anh xem em cài bộ phân tích cú pháp JQL thế nào" — nếu bạn không viết nó, bạn trượt ở tiêu chí trung thực.'],
  ['"Phát triển hơn 600 bảng cơ sở dữ liệu."', 'Bỏ con số trần trụi, hoặc giải thích nó: "một nền tảng nhiều module (khoá học, mạng xã hội, quản lý dự án) trên một cơ sở dữ liệu PostgreSQL".', 'Một con số lớn không có câu chuyện trông như thổi phồng và mời gọi câu hỏi khó.'],
  ['Giấu hẳn phần AI', 'Nhắc một lần, rõ ràng, rồi tập trung vào quyết định và sự cố của bạn', 'Dùng AI giờ là bình thường; giấu rồi bị phát hiện thì không.'],
])}
<p>Một cách chia hữu ích với nhiều sinh viên: <strong>một dự án tự code tay</strong> (thường là đồ án) chứng minh bạn viết được code; <strong>một hệ thống lớn hơn bạn vận hành</strong> chứng minh óc phán đoán kỹ thuật. Đi cùng nhau, chúng thuyết phục hơn từng cái riêng lẻ.</p>

<h3>Một ví dụ trọn vẹn từ dự án có thật</h3>
${ra(DU_AN_VI)}
<p>Mọi con số ở trên lấy từ ghi chép của chính dự án — thời gian build, thời lượng sự cố, số yêu cầu. Không có gì là ước lượng.</p>

<h3>Luật ba tầng đào sâu</h3>
<p>Trước khi một gạch đầu dòng được lên CV, tự hỏi mình ba câu đào sâu về nó, câu sau sâu hơn câu trước. Nếu không trả lời được câu thứ ba, viết lại hoặc bỏ dòng đó.</p>
${bang(['Gạch đầu dòng', 'Tầng 1', 'Tầng 2', 'Tầng 3'], [
  ['Chuyển build sang máy nhà đẩy lên GHCR', 'Sao không build ngay trên máy chủ?', 'Máy chủ lấy ảnh mới bằng cách nào, nếu đẩy lỗi thì sao?', 'Em quay lui về ảnh trước thế nào?'],
  ['Thêm smoke test thất bại khi gặp 404', 'Sao lại là 404 mà không phải mọi lỗi?', 'Kiểm những route nào, sao không kiểm route POST?', 'Bản build cũ nhìn từ bên ngoài trông ra sao?'],
  ['Modular monolith cho LabFlow', 'Sao không microservices?', 'Các module nói chuyện với nhau thế nào?', 'Nếu phải tách một module ra, em làm gì đầu tiên?'],
])}
${bay('vi', 'dự án nhái theo video mà không có gì của riêng mình.', 'Một "bản sao Netflix" hay "todo app" chép từ video rất dễ nhận ra và mời gọi câu "em đã đổi gì so với video?". Nếu bạn có một cái như vậy, thêm một thứ thật — xác thực, test, deploy, một tính năng video không có — và chỉ viết gạch đầu dòng về phần đó.')}
${keXau('vi', 'một đường dẫn demo trên CV là lời mời gửi cho cả Internet, không riêng người tuyển dụng. Đừng để demo có sẵn tài khoản admin mặc định, mật khẩu test in trong README, đăng ký mở tự gửi email, hay khoá API nằm trong gói JavaScript gửi xuống trình duyệt. Cho người tuyển dụng một tài khoản demo chỉ đọc, đặt giới hạn tần suất cho đăng nhập, và kiểm lịch sử kho mã không chứa bí mật (bài 1.3).')}
${neu('vi', 'đồ án của bạn mới xong một nửa lúc nộp đơn? Ghi "đang làm" kèm phần đã chạy, và một gạch đầu dòng về thiết kế. "Đang làm, đây là thiết kế và phần đã chạy được" vừa trung thực vừa thú vị; nhận những tính năng chưa tồn tại thì không.')}

<h3>Câu hỏi phỏng vấn bài này chuẩn bị cho bạn</h3>
${qa('vi', { so: '1.2-1', q: '"Kể anh nghe một dự án em tự hào."', chu: 'độ sâu, sự làm chủ, và bạn nói về quyết định hay chỉ kể tính năng.', a: '<p>Chọn một dự án và đi theo thứ tự bối cảnh → vai trò → một quyết định → một sự cố → kết quả: "Nền tảng cá nhân của em đang chạy thật trên một VPS bằng Docker Compose. Em xây nó cùng trợ lý AI viết code, phần việc của chính em chủ yếu là kiến trúc và vận hành. Quyết định em tự hào nhất là tách việc đẩy code khỏi việc deploy: hệ thống từng sập hai lần vì hai luồng deploy đua nhau mỗi lần push. Giờ deploy là một script em chủ động chạy, việc build diễn ra ở một máy riêng, và một smoke test làm deploy thất bại nếu một route cốt lõi trả 404. Từ đó cuộc đua ấy không thể xảy ra nữa, vì push không còn khởi động deploy nào."</p>', sau: ['"Vì sao hai luồng lại đua nhau?"', '"Smoke test kiểm chính xác những gì?"', '"Bây giờ làm lại thì em làm khác gì?"'], loi: 'kể mọi tính năng của dự án trong ba phút mà không có lấy một quyết định hay một sự cố.' })}
${qa('vi', { so: '1.2-2', q: '"Trong dự án nhóm, chính em làm gì?"', chu: 'chữ "nhóm em" có đang che việc bạn làm rất ít không.', a: '<p>"Nhóm em năm người. Em phụ trách module đặt lịch: bảng dữ liệu, API và các luật kiểm tra. Khó nhất là chống đặt trùng — em dùng ràng buộc unique trên khung giờ cộng với giao dịch, và viết test cố tình đặt cùng một khung giờ hai lần. Em cũng review hai pull request của bạn cùng nhóm mỗi tuần."</p>', sau: ['"Cho anh xem thiết kế bảng."', '"Test của em giả lập hai người dùng thế nào?"'], loi: '"Em làm mỗi thứ một chút" — nghe như chẳng làm gì cụ thể.' })}
${qa('vi', { so: '1.2-3', q: '"Nếu làm lại dự án này từ đầu, em sẽ đổi gì?"', chu: 'khả năng tự nhìn lại — thấy được sai lầm của chính mình.', a: '<p>"Em sẽ thêm kiểm tra tự động cho đường deploy ngay từ ngày đầu — hai sự cố của em lẽ ra đã bị chặn bởi những bước kiểm mà bây giờ mới có. Và em sẽ chốt mô hình deploy trước khi thêm tính năng, thay vì để push-là-deploy lớn dần tới khi nó gãy."</p>', sau: ['"Vì sao lần đầu em không làm vậy?"'], loi: '"Không đổi gì, nó tốt rồi ạ" — báo hiệu không biết tự nhìn lại.' })}

${thucHanh('vi', { phut: '40–50', steps: [
  'Chọn hai dự án mạnh nhất. Với mỗi dự án, viết dòng tên, bối cảnh, công nghệ và đường dẫn.',
  'Viết bốn gạch đầu dòng cho mỗi dự án, mỗi loại một dòng: tính năng, quyết định, sự cố, kết quả.',
  'Với việc làm nhóm hoặc làm cùng AI, viết lại mọi dòng đang nhận nhiều hơn phần bạn thật sự làm.',
  'Áp luật ba tầng cho từng dòng cùng một người bạn (hoặc tự hỏi to). Bỏ những dòng gãy ở tầng 3.',
], dat: 'hai mục dự án, mỗi mục có một dòng quyết định và một dòng sự cố, và mọi dòng sống sót qua ba câu đào sâu.' })}
${thuatNgu('vi', [
  ['Project entry (mục dự án)', 'Một khối trong mục Dự án: tên, bối cảnh, công nghệ, gạch đầu dòng, đường dẫn.'],
  ['Decision bullet (dòng quyết định)', 'Một gạch đầu dòng về lựa chọn bạn đã đưa ra và vì sao.'],
  ['Incident (sự cố)', 'Một lần hỏng thật trong hệ thống đang chạy — sập, mất dữ liệu, deploy lỗi.'],
  ['Case study (bài phân tích dự án)', 'Một bài viết ngắn về dự án: vấn đề, quyết định, kết quả, bài học.'],
  ['Modular monolith', 'Một ứng dụng triển khai một khối nhưng chia module bên trong với ranh giới chặt.'],
  ['Follow-up question (câu đào sâu)', 'Câu hỏi tiếp theo, sâu hơn, của người phỏng vấn về điều bạn vừa nói.'],
])}
${tomTat('vi', [
  'Với sinh viên, mục Dự án là CV; nó quyết định bạn sẽ bị hỏi gì.',
  'Trộn bốn loại gạch đầu dòng: tính năng, quyết định, sự cố, kết quả — đừng chỉ tính năng.',
  'Với dự án nhóm, ghi số người và đúng phần của bạn.',
  'Mô tả việc làm cùng AI một cách trung thực và tập trung vào quyết định và sự cố của bạn.',
  'Mọi dòng phải sống sót qua ba tầng đào sâu; không thì viết lại hoặc bỏ.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'software-development-project', bai: 'swp391-0-6-chong-truot-diem-cao', academy: true, title: 'Academy · SWP391 0.8 — Vì sao nhóm bị trừ điểm, và cách lấy điểm cao', sub: 'Cùng bài toán "ai làm gì", nhìn từ phía chấm điểm một dự án nhóm.' }),
  yt('pjiLoJf-B2U', 'Roman Taylor', 'What Projects to Put on Your Resume [as a Software Engineer]', 10),
  nguon('🧪', 'LabFlow AI — trang dự án', 'Ví dụ một trang case study dự án: mục tiêu, kiến trúc, yêu cầu, kế hoạch.', '/projects/labflow-ai'),
])}
</div>
`,
};

/* ═══════════════════════ 1.3 — GitHub và portfolio ═══════════════════════ */
const README_EN = `
# LabFlow AI — lab & equipment management

One sentence: what it does and for whom.
Live demo: <link> (read-only account: demo / see below) · Status: in progress (week 6 of 20)

## Screenshots
<2-3 images: the main screen, one important flow>

## What I built (my part)
- Solo capstone; I wrote the backend by hand. Frontend: React. Database: PostgreSQL.
- 3 bullets with the decisions and problems — same as on the CV.

## Architecture
<one diagram: browser -> API -> modules -> database; where IoT data comes in>

## Run it locally
1. Requirements: JDK 21, Node 22, Docker
2. cp .env.example .env    (no real secrets in the repo)
3. docker compose up -d db && ./mvnw spring-boot:run

## Tests
How to run them, and what they cover.

## What I learned / what I would change
Two or three honest lines.
`;

const README_VI = `
# LabFlow AI — quản lý phòng lab & thiết bị

Một câu: nó làm gì và cho ai.
Demo: <link> (tài khoản chỉ đọc: demo / xem dưới) · Trạng thái: đang làm (tuần 6/20)

## Ảnh chụp màn hình
<2-3 ảnh: màn chính, một luồng quan trọng>

## Phần em làm
- Đồ án một người; em tự code tay phần backend. Frontend: React. CSDL: PostgreSQL.
- 3 gạch đầu dòng về quyết định và sự cố — giống trên CV.

## Kiến trúc
<một sơ đồ: trình duyệt -> API -> các module -> CSDL; dữ liệu IoT đi vào ở đâu>

## Chạy ở máy
1. Cần: JDK 21, Node 22, Docker
2. cp .env.example .env    (kho mã không chứa bí mật thật)
3. docker compose up -d db && ./mvnw spring-boot:run

## Kiểm thử
Chạy thế nào, và bao phủ những gì.

## Em học được gì / sẽ đổi gì
Hai ba dòng thành thật.
`;

const L13 = {
  title: '1.3 — GitHub and a portfolio that back up your CV: pinned repos, READMEs, a clean history|||1.3 — GitHub và portfolio làm chỗ dựa cho CV: kho ghim, README, lịch sử sạch',
  slug: 'pv-1-3-github',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Người tuyển dụng thật sự nhìn gì trên GitHub (kho ghim, README, lịch sử commit, mã sạch, không lộ bí mật), README trang hồ sơ, khung README một dự án, xử lý mã nguồn riêng tư bằng kho case study, quy định chia sẻ bài tập ở trường, và vì sao không được "làm đẹp" biểu đồ đóng góp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>GitHub and a portfolio that back up every line of your CV</h2>
<p class="lead">Your CV makes claims; your GitHub is where a curious interviewer goes to check them. Most will spend a few minutes there at most — so what they see first must be the right thing: a short profile, six pinned repositories with READMEs that explain themselves, and nothing embarrassing (or dangerous) in the history.</p>

<h3>An everyday picture: the shop window</h3>
${doiThuong('en', 'A shop does not put its whole warehouse in the window. It puts six well-lit items with price tags and a sign saying what the shop sells. Your GitHub profile is that window: a short sign (the profile README), up to six pinned items, each with a clear label (the README). The other forty repositories — course exercises, half-finished experiments — can stay in the warehouse.')}

<h3>What a reviewer actually looks at, in order</h3>
${flow([
  ['1 · Profile', 'photo or initials, name, one-line bio, profile README', 'Does it say who you are and what you work on? GitHub shows a README from a public repository named exactly like your username at the top of your profile.'],
  ['2 · Pinned repositories', 'up to six', 'Are these the projects from the CV? Do they have descriptions and topics?'],
  ['3 · One README', 'the first pinned project', 'Can they understand what it is, see it, and run it in five minutes?'],
  ['4 · The code', 'one or two files', 'Readable names, structure, no giant commented-out blocks, some tests.'],
  ['5 · The history', 'commit messages, a few diffs', 'Small commits with meaningful messages, not "update", "fix", "aaa". No secrets, no node_modules.'],
])}

<h3>A README that does its job</h3>
<p>The README is the most important file you will write for job hunting. It is a one-page case study. A template that works:</p>
${ra(README_EN)}
${bay('en', 'a README that is the framework’s default text.', '"This project was bootstrapped with Create React App…" or the Spring Initializr default tells the reviewer you never wrote a word about your own project. Replace it before the repository goes on your CV.')}

<h3>When the code cannot be public</h3>
<p>Some projects should stay private: a production system with business logic, infrastructure scripts, client work. You still want the evidence visible. Two honest options:</p>
<ul>
<li><strong>A public case-study repository</strong>: only a README with the problem, architecture diagram, screenshots, the incidents and what you changed — no source code, no server addresses, no configuration.</li>
<li><strong>Show on request</strong>: in the interview, offer to share your screen and walk through the real code. Say so in the README: "Source is private; happy to walk through it live."</li>
</ul>
${keXau('en', 'automated bots continuously scan public repositories for leaked secrets — cloud keys, database URLs, API tokens — and abuse them quickly. A key committed once stays in the history even if you delete the file in the next commit. Before making any repository public: check that <code>.env</code> is in <code>.gitignore</code>; search the history for keys; and if one ever leaked, <strong>revoke the key first</strong>, then clean the history. GitHub’s secret scanning can warn you, but do not rely on it. Also never publish server IP addresses, SSH ports or internal paths in a README.')}

<h3>School assignments and academic integrity</h3>
<p>Before publishing solutions to labs, assignments or exam practice from a course, check your course rules. Some subjects reuse assignments, and publishing solutions can count as helping others cheat. A safe pattern: publish projects you designed yourself (capstone, personal projects) and keep graded coursework private.</p>

<h3>Do not decorate the contribution graph</h3>
<p>There are tools that create fake commits to fill the green squares. Experienced reviewers recognise them (hundreds of identical commits, no real diffs) and the result is the opposite of what you wanted. A sparse graph with one strong project beats a green wall of noise. Consistency of real work is what matters — a few meaningful commits a week on your capstone is plenty.</p>
${neu('en', 'an interviewer opens a repository from your CV during the call and asks "why is this function 300 lines long?" Do not defend it. Say what you would change: "It grew as I added cases; I would split it into a validator and three handlers, and I would add tests before refactoring." Seeing your own code’s problems is a strong signal.')}

<h3>Interview questions this lesson prepares you for</h3>
${qa('en', { so: '1.3-1', q: '"Can you walk me through the structure of this repository?"', chu: 'whether you know your own codebase and can explain layers quickly.', a: '<p>Start from the entry point and follow one request: "The app starts in the main class; requests go to controllers in each module folder; controllers call services, which hold the rules; services use repositories to reach PostgreSQL. Each module — inventory, booking, users — has the same three layers, and modules only call each other through interfaces in an api package. Tests sit next to each module."</p>', sau: ['"Why did you choose this layering?"', '"Where would a new feature go?"'], loi: 'opening folders randomly and reading file names aloud.' })}
${qa('en', { so: '1.3-2', q: '"Your commit messages are mostly \'update\'. Why?"', chu: 'awareness of team habits.', a: '<p>Honest and forward-looking: "Early on I committed like a save button. Since I started working with pull requests I write messages that say what and why — for example ‘booking: reject overlapping slots (unique constraint + test)’. You can see the change from week four of the repository."</p>', sau: ['"What makes a good commit message?"'], loi: 'claiming that messages do not matter.' })}

${thucHanh('en', { phut: '45–60', steps: [
  'Create a public repository named exactly like your GitHub username with a README: three lines about you, your two main projects, how to contact you.',
  'Pin the projects from your CV (up to six). Give each a one-line description and topics.',
  'Rewrite the README of your strongest project with the template: screenshots, your part, architecture, how to run, tests, lessons.',
  'Security check: confirm .env is ignored and search the history for keys (for example search for "API_KEY", "password", "secret" in the repository).',
], dat: 'your profile shows a README and pinned projects, the first project’s README follows the template, and you found no secrets in the history.' })}
${thuatNgu('en', [
  ['Profile README', 'A README in a repository named like your username, shown at the top of your GitHub profile.'],
  ['Pinned repository', 'A repository you chose to show first on your profile (up to six).'],
  ['README', 'The front page of a repository: what, why, how to run, what you learned.'],
  ['Secret / credential', 'Anything that grants access: keys, tokens, passwords, connection strings.'],
  ['.gitignore', 'The list of files Git must never track (.env, node_modules, build output).'],
  ['Case-study repository', 'A public repository with documentation and diagrams but no private source code.'],
])}
${tomTat('en', [
  'Reviewers check profile, pinned repos, one README, a little code and the commit history — in minutes.',
  'The README is a one-page case study: what, screenshots, your part, architecture, how to run, tests, lessons.',
  'Private code can still be evidenced by a public case-study repository or a live walkthrough.',
  'Never publish secrets, server addresses or graded coursework solutions; revoke leaked keys first.',
  'Real, steady commits beat a decorated contribution graph.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'git', bai: 'git-15-1-ho-so-github', L: 'en', title: 'Git 15.1 — Your GitHub profile as a CV: profile README, pins and project READMEs', sub: 'The step-by-step, click-by-click version of this lesson.' }),
  lienKet({ khoa: 'git', bai: 'git-8-3-go-bi-mat', L: 'en', title: 'Git 8.3 — Removing a leaked secret from all of history', sub: 'What to do if the security check in the practice finds something.' }),
  yt('z8UPAVTh2aE', 'Miraya', 'How To Make Your GitHub Stand Out (Gets You Hired!)', 8, 'en'),
  nguon('📗', 'GitHub Docs — Managing your profile README', 'The official rule for the username-named repository.', 'https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>GitHub và portfolio làm chỗ dựa cho từng dòng trong CV</h2>
<p class="lead">CV của bạn đưa ra các tuyên bố; GitHub là nơi một người phỏng vấn tò mò ghé vào để kiểm chúng. Phần lớn chỉ dành ở đó vài phút — nên thứ họ thấy đầu tiên phải là đúng thứ: một trang hồ sơ ngắn, sáu kho được ghim có README tự giải thích, và không có gì đáng xấu hổ (hay nguy hiểm) trong lịch sử.</p>

<h3>Liên tưởng đời thường: tủ kính trưng bày</h3>
${doiThuong('vi', 'Một cửa hàng không bày cả kho ra tủ kính. Họ bày sáu món được chiếu sáng, có nhãn giá, và một tấm biển nói cửa hàng bán gì. Trang GitHub của bạn là tủ kính đó: một tấm biển ngắn (README trang hồ sơ), tối đa sáu món được ghim, món nào cũng có nhãn rõ ràng (README). Bốn mươi kho còn lại — bài tập môn học, thử nghiệm làm dở — cứ để trong kho.')}

<h3>Người xét hồ sơ thật sự nhìn gì, theo thứ tự</h3>
${flow([
  ['1 · Hồ sơ', 'ảnh hoặc chữ viết tắt, tên, một dòng giới thiệu, README trang hồ sơ', 'Có nói bạn là ai và làm gì không? GitHub hiện README của một kho công khai đặt tên ĐÚNG bằng tên người dùng của bạn ở đầu trang hồ sơ.'],
  ['2 · Kho được ghim', 'tối đa sáu', 'Có phải các dự án trong CV không? Có mô tả và chủ đề (topics) không?'],
  ['3 · Một README', 'dự án ghim đầu tiên', 'Họ có hiểu nó là gì, nhìn thấy nó, và chạy nó trong năm phút không?'],
  ['4 · Mã nguồn', 'một hai tệp', 'Tên dễ đọc, cấu trúc, không có khối code chú thích khổng lồ, có vài test.'],
  ['5 · Lịch sử', 'thông điệp commit, vài diff', 'Commit nhỏ, thông điệp có nghĩa, không phải "update", "fix", "aaa". Không bí mật, không node_modules.'],
])}

<h3>Một README làm đúng việc của nó</h3>
<p>README là tệp quan trọng nhất bạn viết cho việc tìm việc. Nó là một bài case study một trang. Một khuôn dùng được:</p>
${ra(README_VI)}
${bay('vi', 'README còn nguyên chữ mặc định của framework.', '"This project was bootstrapped with Create React App…" hay mặc định của Spring Initializr báo cho người xem rằng bạn chưa từng viết một chữ nào về dự án của chính mình. Thay nó trước khi kho đó lên CV.')}

<h3>Khi mã nguồn không thể công khai</h3>
<p>Có dự án nên để riêng tư: hệ thống production có logic kinh doanh, script hạ tầng, việc làm cho khách. Bạn vẫn muốn bằng chứng được nhìn thấy. Hai cách trung thực:</p>
<ul>
<li><strong>Một kho case study công khai</strong>: chỉ có README với vấn đề, sơ đồ kiến trúc, ảnh chụp màn hình, các sự cố và thứ bạn đã thay đổi — không mã nguồn, không địa chỉ máy chủ, không cấu hình.</li>
<li><strong>Cho xem khi được hỏi</strong>: trong buổi phỏng vấn, đề nghị chia sẻ màn hình và đi qua mã thật. Ghi luôn trong README: "Mã nguồn riêng tư; rất sẵn lòng đi qua trực tiếp."</li>
</ul>
${keXau('vi', 'có những bot tự động quét liên tục các kho công khai để tìm bí mật bị lộ — khoá cloud, chuỗi kết nối cơ sở dữ liệu, token API — và lạm dụng chúng rất nhanh. Một khoá đã commit một lần sẽ nằm lại trong lịch sử kể cả khi bạn xoá tệp ở commit kế tiếp. Trước khi công khai bất kỳ kho nào: kiểm <code>.env</code> đã nằm trong <code>.gitignore</code>; tìm trong lịch sử xem có khoá không; và nếu một khoá từng lộ, <strong>thu hồi khoá TRƯỚC</strong>, rồi mới dọn lịch sử. Tính năng secret scanning của GitHub có thể cảnh báo, nhưng đừng trông vào nó. Và đừng bao giờ đăng địa chỉ IP máy chủ, cổng SSH hay đường dẫn nội bộ trong README.')}

<h3>Bài tập ở trường và liêm chính học thuật</h3>
<p>Trước khi đăng lời giải lab, assignment hay đề luyện của một môn, hãy kiểm quy định môn học. Có môn dùng lại đề, và đăng lời giải có thể bị coi là tiếp tay gian lận. Một cách an toàn: công khai những dự án bạn tự thiết kế (đồ án, dự án cá nhân) và để bài tập có chấm điểm ở chế độ riêng tư.</p>

<h3>Đừng tô vẽ biểu đồ đóng góp</h3>
<p>Có công cụ tạo commit giả để lấp đầy các ô xanh. Người xét hồ sơ có kinh nghiệm nhận ra chúng (hàng trăm commit y hệt nhau, không có thay đổi thật) và kết quả ngược hẳn điều bạn muốn. Một biểu đồ thưa với một dự án mạnh thắng một bức tường xanh toàn tiếng ồn. Thứ quan trọng là sự đều đặn của việc thật — vài commit có nghĩa mỗi tuần cho đồ án là quá đủ.</p>
${neu('vi', 'người phỏng vấn mở một kho trong CV ngay trong cuộc gọi và hỏi "sao hàm này dài 300 dòng?" Đừng bào chữa. Hãy nói bạn sẽ đổi gì: "Nó phình dần khi em thêm trường hợp; em sẽ tách thành một bộ kiểm tra đầu vào và ba hàm xử lý, và viết test trước khi tái cấu trúc." Thấy được vấn đề trong code của chính mình là một tín hiệu mạnh.')}

<h3>Câu hỏi phỏng vấn bài này chuẩn bị cho bạn</h3>
${qa('vi', { so: '1.3-1', q: '"Em đi qua cấu trúc của kho này cho anh nhé?"', chu: 'bạn có biết mã nguồn của chính mình và giải thích các tầng nhanh không.', a: '<p>Bắt đầu từ điểm vào và đi theo một request: "Ứng dụng khởi động ở lớp main; request tới controller trong thư mục của từng module; controller gọi service, nơi giữ các luật nghiệp vụ; service dùng repository để tới PostgreSQL. Module nào — kho thiết bị, đặt lịch, người dùng — cũng có đúng ba tầng đó, và các module chỉ gọi nhau qua interface trong gói api. Test nằm cạnh từng module."</p>', sau: ['"Vì sao em chọn chia tầng như vậy?"', '"Một tính năng mới sẽ nằm ở đâu?"'], loi: 'mở thư mục lung tung và đọc to tên tệp.' })}
${qa('vi', { so: '1.3-2', q: '"Thông điệp commit của em toàn là \'update\'. Sao vậy?"', chu: 'ý thức về thói quen làm nhóm.', a: '<p>Trung thực và hướng tới phía trước: "Lúc đầu em commit như bấm nút lưu. Từ khi làm việc với pull request, em viết thông điệp nói làm gì và vì sao — ví dụ ‘booking: chặn khung giờ chồng nhau (ràng buộc unique + test)’. Anh xem được sự thay đổi từ tuần thứ tư của kho."</p>', sau: ['"Thế nào là một thông điệp commit tốt?"'], loi: 'khẳng định thông điệp commit không quan trọng.' })}

${thucHanh('vi', { phut: '45–60', steps: [
  'Tạo một kho công khai đặt tên ĐÚNG bằng tên người dùng GitHub của bạn, kèm README: ba dòng về bạn, hai dự án chính, cách liên lạc.',
  'Ghim các dự án có trong CV (tối đa sáu). Cho mỗi kho một dòng mô tả và vài chủ đề (topics).',
  'Viết lại README của dự án mạnh nhất theo khuôn: ảnh chụp, phần bạn làm, kiến trúc, cách chạy, test, bài học.',
  'Kiểm an toàn: xác nhận .env đã bị bỏ qua và tìm trong lịch sử xem có khoá không (ví dụ tìm "API_KEY", "password", "secret" trong kho).',
], dat: 'trang hồ sơ có README và các dự án ghim, README dự án đầu theo đúng khuôn, và bạn không tìm thấy bí mật nào trong lịch sử.' })}
${thuatNgu('vi', [
  ['Profile README (README trang hồ sơ)', 'README trong kho đặt tên bằng tên người dùng, hiện ở đầu trang GitHub của bạn.'],
  ['Pinned repository (kho ghim)', 'Kho bạn chọn hiện đầu tiên trên trang hồ sơ (tối đa sáu).'],
  ['README', 'Trang đầu của một kho: là gì, vì sao, chạy thế nào, bạn học được gì.'],
  ['Secret / credential (bí mật)', 'Mọi thứ cho quyền truy cập: khoá, token, mật khẩu, chuỗi kết nối.'],
  ['.gitignore', 'Danh sách tệp Git không bao giờ được theo dõi (.env, node_modules, thư mục build).'],
  ['Kho case study', 'Kho công khai chỉ có tài liệu và sơ đồ, không có mã nguồn riêng tư.'],
])}
${tomTat('vi', [
  'Người xét hồ sơ xem trang hồ sơ, kho ghim, một README, một ít code và lịch sử commit — trong vài phút.',
  'README là một bài case study một trang: là gì, ảnh, phần bạn làm, kiến trúc, cách chạy, test, bài học.',
  'Mã riêng tư vẫn có bằng chứng được, qua kho case study công khai hoặc đi qua trực tiếp.',
  'Không bao giờ đăng bí mật, địa chỉ máy chủ hay lời giải bài tập có chấm điểm; khoá lộ thì thu hồi trước.',
  'Commit thật, đều đặn thắng một biểu đồ đóng góp được tô vẽ.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'git', bai: 'git-15-1-ho-so-github', title: 'Git 15.1 — Trang GitHub như một CV: README hồ sơ, kho ghim và README dự án', sub: 'Bản từng bước, từng cú bấm của chính bài này.' }),
  lienKet({ khoa: 'git', bai: 'git-8-3-go-bi-mat', title: 'Git 8.3 — Gỡ một bí mật bị lộ khỏi toàn bộ lịch sử', sub: 'Phải làm gì nếu phép kiểm an toàn trong phần thực hành tìm ra thứ gì đó.' }),
  yt('z8UPAVTh2aE', 'Miraya', 'How To Make Your GitHub Stand Out (Gets You Hired!)', 8),
  nguon('📗', 'GitHub Docs — Managing your profile README', 'Quy định chính thức về kho đặt tên theo tên người dùng.', 'https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme'),
])}
</div>
`,
};

/* ═══════════════════════ 1.4 — LinkedIn ═══════════════════════ */
const LOI_NHAN_EN = `
Connection note to a senior from your school (under 300 characters):
Hi [Name], I'm a 5th-term SE student at FPTU. I read your post about [topic] and I'm preparing for
a backend internship. Could I connect and ask one short question about your team's internship? Thanks!

Asking for a referral (after they accepted and you have talked once):
Hi [Name], thank you again for the advice last week. I saw [Company] is hiring a Backend Intern
([link]). I match most of the requirements (Node.js, PostgreSQL, Docker) - my CV is attached.
If you think I'm a fit, would you be comfortable referring me? If not, no problem at all.
`;

const LOI_NHAN_VI = `
Lời nhắn kết nối với anh/chị khoá trên cùng trường (dưới 300 ký tự):
Chào anh [Tên], em là sinh viên SE kỳ 5 ở FPTU. Em đọc bài anh viết về [chủ đề] và đang chuẩn bị
thực tập backend. Em xin kết nối và hỏi anh một câu ngắn về đợt thực tập ở đội anh được không ạ? Em cảm ơn!

Xin giới thiệu nội bộ (sau khi họ đã đồng ý kết nối và hai bên đã nói chuyện một lần):
Chào anh [Tên], em cảm ơn anh lần nữa vì lời khuyên tuần trước. Em thấy [Công ty] đang tuyển Backend
Intern ([link]). Em khớp phần lớn yêu cầu (Node.js, PostgreSQL, Docker) - em gửi kèm CV. Nếu anh thấy
em phù hợp, anh có tiện giới thiệu em không ạ? Nếu không tiện thì hoàn toàn không sao ạ.
`;

const L14 = {
  title: '1.4 — LinkedIn for students: a profile recruiters find, connections, and asking for a referral|||1.4 — LinkedIn cho sinh viên: hồ sơ recruiter tìm thấy, kết nối, và xin giới thiệu nội bộ',
  slug: 'pv-1-4-linkedin',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hồ sơ LinkedIn theo từng ô (ảnh, tiêu đề, giới thiệu, dự án, học vấn, kỹ năng, mục nổi bật, đường dẫn riêng), bật "Open to work" chỉ cho recruiter, kết nối với người đúng và lời nhắn mẫu, cách xin giới thiệu nội bộ lịch sự, đăng bài học tập, và nhận diện recruiter giả.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>LinkedIn for students — be findable, be specific, ask politely</h2>
<p class="lead">A CV only works when you send it. LinkedIn works while you sleep: recruiters search it every day for "Node.js intern Ho Chi Minh City" or "Java fresher". For a student the goal is modest and concrete — a complete profile that matches your CV, thirty to a hundred relevant connections, and the confidence to ask a senior for a referral.</p>

<h3>An everyday picture: your stall at the job fair</h3>
${doiThuong('en', 'At a university job fair, a company representative walks past a hundred tables. The ones they stop at have a clear sign ("Backend · Node.js · PostgreSQL"), a friendly face, and something to show. LinkedIn is a job fair that never closes: your headline is the sign, your photo is the face, the Featured section and projects are what you show, and recruiters are walking past all the time.')}

<h3>The profile, field by field</h3>
${bang(['Field', 'What to put', 'Example'], [
  ['Photo', 'A clear, friendly face, plain background', 'A phone photo against a wall is fine.'],
  ['Headline', 'Role + stack + proof, not just "Student at FPTU"', 'Software Engineering student · Backend (Node.js, PostgreSQL, Docker) · runs a production web platform'],
  ['About', 'Three short paragraphs: who you are, two proofs, what you are looking for and when', '"…looking for a backend internship from January 2027."'],
  ['Experience / Projects', 'The same entries and bullets as your CV', 'Copy the project entries from Lesson 1.2.'],
  ['Education', 'University, major, expected graduation, relevant courses', 'FPT University — Software Engineering, expected 2028'],
  ['Skills', '10–15 real skills; the top three are the ones on your CV', 'Node.js · PostgreSQL · Docker'],
  ['Featured', 'Links: live demo, case-study README, a post you wrote', 'Your strongest project link first.'],
  ['Custom URL', 'linkedin.com/in/your-name instead of random digits', 'Put this URL on your CV.'],
])}
<p><strong>Open to work</strong>: LinkedIn lets you signal that you are looking, either visible to everyone (the green frame on your photo) or to recruiters only. For a student, both are acceptable; "recruiters only" is the quieter option.</p>

<h3>Who to connect with, and how</h3>
${flow([
  ['1 · People you know', 'classmates, seniors, lecturers, mentors', 'Start here — they accept, and their networks become reachable.'],
  ['2 · Seniors at target companies', 'alumni from your school who work where you want to work', 'The best source of referrals and honest information.'],
  ['3 · Recruiters', 'IT recruiters in Vietnam and at target companies', 'They post openings and search profiles daily.'],
  ['4 · Engineers who write', 'people who post about your stack', 'Follow them; comment thoughtfully; connect after a real exchange.'],
])}
<p>Always add a short note to a connection request to someone you do not know. Templates:</p>
${ra(LOI_NHAN_EN)}
${bay('en', 'asking a stranger for a referral in the first message.', 'A referral puts the referrer’s reputation on the line. Nobody wants to vouch for someone they have never talked to. The order is: connect with a note → one genuine question or exchange → only then ask, with the link and your CV, and an easy way to say no.')}

<h3>Posting: optional, but powerful</h3>
<p>You do not need to become an influencer. One short post every week or two about something real you learnt — "today I found why my deploy was serving an old build: a 404 vs 401 check told me the route was not mounted" — shows exactly the signals from Lesson 0.8: learning, communication, ownership. Write it in English if you can (it is also practice for Chapter 8); keep it factual; never post company or client secrets.</p>
${keXau('en', 'LinkedIn is a favourite tool for fake recruiters: polished profiles with few connections, a stock photo, an offer that is too good, a quick move to Telegram or WhatsApp, a "test task" that requires running their code or paying for equipment. Also beware links to "document portals" that ask you to log in — a common way to steal passwords. Check the person’s history, check the company website for the same job, reply only through the company’s official email, and never enter your password on a page you reached from a message.')}
${neu('en', 'nobody accepts your connection requests? Check the note: generic notes ("I’d like to add you to my network") are ignored. Mention what you share — the same university, a post they wrote, a technology you both use — and keep it under three lines.')}

<h3>Interview questions this lesson prepares you for</h3>
${qa('en', { so: '1.4-1', q: '"How did you hear about this position?"', chu: 'whether you researched them or applied blindly.', a: '<p>"A senior from my university who works on your backend team posted about the internship on LinkedIn. I read the job description and your engineering blog post about moving to PostgreSQL, which is close to what I do in my own project — that is why I applied."</p>', sau: ['"What do you know about our product?"'], loi: '"On a job site, I applied to many companies" — true, but it says you do not care about this one.' })}

${thucHanh('en', { phut: '45–60', steps: [
  'Fill every field in the table, copying projects and bullets from your CV so the two match.',
  'Set a custom URL and add it to your CV header.',
  'Send ten connection requests with notes: five to classmates or seniors, three to seniors at target companies, two to IT recruiters.',
  'Write (do not necessarily publish yet) one short post about something real you learnt this month.',
], dat: 'your profile matches your CV, has a custom URL and a Featured link, and ten personalised requests are sent.' })}
${thuatNgu('en', [
  ['Headline', 'The line under your name; the most-read text on your profile.'],
  ['Open to work', 'A LinkedIn setting that signals you are job hunting, to everyone or recruiters only.'],
  ['Featured', 'A section that shows chosen links, posts or files at the top of the profile.'],
  ['Connection note', 'A short personal message attached to a connection request.'],
  ['Referral', 'An employee recommending you through the company’s internal process.'],
  ['Alumni', 'Former students of your university.'],
])}
${tomTat('en', [
  'LinkedIn makes you findable; recruiters search it every day.',
  'Write a headline with role, stack and proof; copy projects from your CV so both match.',
  'Connect with people you know first, then seniors at target companies and recruiters — always with a note.',
  'Ask for a referral only after a real exchange, with the link, your CV and an easy way to decline.',
  'Fake recruiters are common: verify, stay on official channels, never log in from a message link.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-3-1-find-apply', academy: true, L: 'en', title: 'Academy · OJT202 3.1 — Finding and applying for an internship', sub: 'Networking from the school side: alumni, job fairs and the OJT coordinator.' }),
  yt('OKF7ZeWNrfg', 'Jeff Su', '5 LinkedIn Profile Tips that Get You Hired (backed by data)', 10, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>LinkedIn cho sinh viên — để được tìm thấy, nói cụ thể, hỏi lịch sự</h2>
<p class="lead">CV chỉ có tác dụng khi bạn gửi nó đi. LinkedIn thì làm việc cả khi bạn ngủ: người tuyển dụng tìm trên đó mỗi ngày với những cụm như "Node.js intern Ho Chi Minh City" hay "Java fresher". Với sinh viên, mục tiêu khiêm tốn và cụ thể — một hồ sơ đầy đủ khớp với CV, ba mươi tới một trăm kết nối đúng người, và đủ tự tin để nhờ một anh chị khoá trên giới thiệu nội bộ.</p>

<h3>Liên tưởng đời thường: gian hàng của bạn ở ngày hội việc làm</h3>
${doiThuong('vi', 'Ở ngày hội việc làm của trường, đại diện công ty đi ngang cả trăm bàn. Bàn họ dừng lại là bàn có tấm biển rõ ràng ("Backend · Node.js · PostgreSQL"), một gương mặt thân thiện, và có gì đó để cho xem. LinkedIn là một ngày hội việc làm không bao giờ đóng cửa: tiêu đề là tấm biển, ảnh là gương mặt, mục Nổi bật và dự án là thứ để cho xem, và người tuyển dụng đi ngang suốt ngày.')}

<h3>Hồ sơ, từng ô một</h3>
${bang(['Ô', 'Nên ghi gì', 'Ví dụ'], [
  ['Ảnh', 'Mặt rõ, thân thiện, nền đơn giản', 'Ảnh chụp bằng điện thoại đứng trước bức tường là đủ.'],
  ['Headline (tiêu đề)', 'Vị trí + công nghệ + bằng chứng, không chỉ "Student at FPTU"', 'Software Engineering student · Backend (Node.js, PostgreSQL, Docker) · runs a production web platform'],
  ['About (giới thiệu)', 'Ba đoạn ngắn: bạn là ai, hai bằng chứng, bạn tìm gì và từ khi nào', '"…looking for a backend internship from January 2027."'],
  ['Experience / Projects', 'Đúng các mục và gạch đầu dòng như CV', 'Chép các mục dự án ở bài 1.2.'],
  ['Education (học vấn)', 'Trường, ngành, năm dự kiến tốt nghiệp, môn liên quan', 'FPT University — Software Engineering, expected 2028'],
  ['Skills (kỹ năng)', '10–15 kỹ năng thật; ba cái đầu là ba cái có trên CV', 'Node.js · PostgreSQL · Docker'],
  ['Featured (nổi bật)', 'Đường dẫn: demo, README case study, một bài bạn viết', 'Link dự án mạnh nhất lên đầu.'],
  ['Custom URL (đường dẫn riêng)', 'linkedin.com/in/ten-ban thay cho dãy số ngẫu nhiên', 'Dán đường dẫn này lên CV.'],
])}
<p><strong>Open to work</strong>: LinkedIn cho bạn báo hiệu mình đang tìm việc, hoặc cho tất cả mọi người thấy (khung xanh quanh ảnh), hoặc chỉ cho người tuyển dụng thấy. Với sinh viên cả hai đều ổn; "chỉ người tuyển dụng" là lựa chọn kín đáo hơn.</p>

<h3>Kết nối với ai, và bằng cách nào</h3>
${flow([
  ['1 · Người bạn quen', 'bạn cùng lớp, anh chị khoá trên, giảng viên, người hướng dẫn', 'Bắt đầu từ đây — họ đồng ý, và mạng lưới của họ trở nên với tới được.'],
  ['2 · Anh chị khoá trên ở công ty bạn nhắm', 'cựu sinh viên trường bạn đang làm ở nơi bạn muốn tới', 'Nguồn giới thiệu nội bộ và thông tin thật tốt nhất.'],
  ['3 · Người tuyển dụng', 'recruiter IT ở Việt Nam và ở công ty mục tiêu', 'Họ đăng tin và tìm hồ sơ hằng ngày.'],
  ['4 · Kỹ sư hay viết bài', 'người viết về đúng công nghệ bạn dùng', 'Theo dõi; bình luận có suy nghĩ; kết nối sau một lần trao đổi thật.'],
])}
<p>Luôn kèm một lời nhắn ngắn khi gửi lời mời kết nối tới người bạn chưa quen. Mẫu:</p>
${ra(LOI_NHAN_VI)}
${bay('vi', 'nhờ người lạ giới thiệu ngay trong tin nhắn đầu tiên.', 'Giới thiệu nội bộ đặt uy tín của người giới thiệu lên bàn cân. Không ai muốn bảo lãnh cho người mình chưa nói chuyện lần nào. Thứ tự là: kết nối kèm lời nhắn → một câu hỏi hay một lần trao đổi thật lòng → rồi mới nhờ, kèm đường dẫn tin, CV, và một lối dễ dàng để họ từ chối.')}

<h3>Đăng bài: không bắt buộc, nhưng rất có lực</h3>
<p>Bạn không cần thành người có ảnh hưởng. Một bài ngắn mỗi tuần hay hai tuần về một điều thật bạn học được — "hôm nay em tìm ra vì sao bản deploy phục vụ bản build cũ: phép kiểm 404 với 401 cho em biết route chưa được gắn" — cho thấy đúng những tín hiệu ở bài 0.8: học hỏi, giao tiếp, làm chủ. Viết bằng tiếng Anh nếu được (đó cũng là luyện tập cho Chương 8); giữ đúng sự thật; không bao giờ đăng bí mật của công ty hay khách hàng.</p>
${keXau('vi', 'LinkedIn là công cụ ưa thích của recruiter giả: hồ sơ bóng bẩy nhưng ít kết nối, ảnh lấy trên mạng, lời mời quá hời, chuyển nhanh sang Telegram hay WhatsApp, một "bài test" đòi chạy mã của họ hoặc trả tiền mua thiết bị. Cũng cảnh giác với đường dẫn tới "cổng tài liệu" bắt đăng nhập — một cách phổ biến để lấy cắp mật khẩu. Xem lịch sử của người đó, kiểm trang web công ty có đúng tin tuyển dụng đó không, chỉ trả lời qua email chính thức của công ty, và không bao giờ nhập mật khẩu vào trang bạn tới từ một tin nhắn.')}
${neu('vi', 'chẳng ai chấp nhận lời mời kết nối của bạn? Xem lại lời nhắn: lời nhắn chung chung ("I’d like to add you to my network") bị lờ đi. Nhắc tới điểm chung — cùng trường, một bài họ viết, một công nghệ cả hai cùng dùng — và giữ dưới ba dòng.')}

<h3>Câu hỏi phỏng vấn bài này chuẩn bị cho bạn</h3>
${qa('vi', { so: '1.4-1', q: '"Em biết tới vị trí này từ đâu?"', chu: 'bạn đã tìm hiểu về họ hay nộp đại.', a: '<p>"Một anh khoá trên cùng trường đang làm ở đội backend bên mình đăng về đợt thực tập trên LinkedIn. Em đọc mô tả công việc và bài blog kỹ thuật của bên mình về việc chuyển sang PostgreSQL, rất gần với việc em làm trong dự án riêng — nên em nộp."</p>', sau: ['"Em biết gì về sản phẩm của bên anh?"'], loi: '"Trên trang việc làm, em nộp nhiều công ty lắm" — đúng là thật, nhưng nó nói bạn không quan tâm tới chỗ này.' })}

${thucHanh('vi', { phut: '45–60', steps: [
  'Điền đủ mọi ô trong bảng, chép dự án và gạch đầu dòng từ CV để hai bên khớp nhau.',
  'Đặt đường dẫn riêng và thêm nó vào phần đầu CV.',
  'Gửi mười lời mời kết nối kèm lời nhắn: năm cho bạn cùng lớp hoặc anh chị khoá trên, ba cho anh chị ở công ty mục tiêu, hai cho recruiter IT.',
  'Viết (chưa cần đăng) một bài ngắn về một điều thật bạn học được trong tháng này.',
], dat: 'hồ sơ khớp với CV, có đường dẫn riêng và một link ở mục Nổi bật, và mười lời mời có lời nhắn riêng đã được gửi.' })}
${thuatNgu('vi', [
  ['Headline (tiêu đề)', 'Dòng dưới tên bạn; chữ được đọc nhiều nhất trên hồ sơ.'],
  ['Open to work', 'Thiết lập của LinkedIn báo bạn đang tìm việc, cho mọi người hoặc chỉ cho recruiter.'],
  ['Featured (nổi bật)', 'Mục hiện các đường dẫn, bài viết hay tệp bạn chọn ở đầu hồ sơ.'],
  ['Connection note (lời nhắn kết nối)', 'Tin nhắn ngắn, riêng, gửi kèm lời mời kết nối.'],
  ['Referral (giới thiệu nội bộ)', 'Một nhân viên giới thiệu bạn qua quy trình nội bộ của công ty.'],
  ['Alumni (cựu sinh viên)', 'Những người từng học ở trường bạn.'],
])}
${tomTat('vi', [
  'LinkedIn làm bạn được tìm thấy; người tuyển dụng tìm trên đó hằng ngày.',
  'Viết tiêu đề có vị trí, công nghệ và bằng chứng; chép dự án từ CV để hai bên khớp.',
  'Kết nối người quen trước, rồi anh chị ở công ty mục tiêu và recruiter — luôn kèm lời nhắn.',
  'Chỉ nhờ giới thiệu sau một lần trao đổi thật, kèm link tin, CV và lối dễ để từ chối.',
  'Recruiter giả rất phổ biến: kiểm chứng, ở trên kênh chính thức, không đăng nhập từ link trong tin nhắn.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-3-1-find-apply', academy: true, title: 'Academy · OJT202 3.1 — Tìm và ứng tuyển thực tập', sub: 'Mạng lưới nhìn từ phía nhà trường: cựu sinh viên, ngày hội việc làm và điều phối viên OJT.' }),
  yt('OKF7ZeWNrfg', 'Jeff Su', '5 LinkedIn Profile Tips that Get You Hired (backed by data)', 10),
])}
</div>
`,
};

/* ═══════════════════════ 1.5 — Lab 1 ═══════════════════════ */
const DONG_TU = `
Built · Designed · Implemented · Migrated · Automated · Reduced · Diagnosed · Fixed · Tested · Deployed
Refactored · Documented · Integrated · Secured · Monitored · Optimised · Wrote · Led · Reviewed · Shipped

Xây dựng · Thiết kế · Hiện thực · Chuyển đổi · Tự động hoá · Giảm · Chẩn đoán · Sửa · Kiểm thử · Triển khai
Tái cấu trúc · Viết tài liệu · Tích hợp · Bảo mật · Giám sát · Tối ưu · Viết · Dẫn dắt · Duyệt · Phát hành
`;

const L15 = {
  title: '1.5 — Lab 1: write your CV, tailor it three ways, and test it before sending|||1.5 — Lab 1: viết CV, may đo thành ba bản, và kiểm thử trước khi gửi',
  slug: 'pv-1-5-lab-cv',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài lab chương 1: viết CV hoàn chỉnh từ bộ khung, may đo ba bản cho ba hướng (backend Node, Java/Spring, fullstack), chạy bốn phép thử (nhìn nhanh 10 giây, sao chép–dán ATS, bấm mọi đường dẫn, ba tầng đào sâu), chấm bằng rubric 20 điểm và gửi tới ba tin thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lab 1</span>
<h2>Lab 1 — Write the CV, tailor it, test it like software</h2>
<p class="lead">A CV is a small piece of software that runs in a recruiter’s head. Like software, it should be built from a spec, tested before release, and versioned. In this lab you produce the real thing — the CV you will send in the CV week — plus two tailored variants, and you test all three before they leave your machine.</p>

<h3>The situation</h3>
<p>It is the CV week (22–29 November in the four-week plan). You have your skill matrix (0.2), your tracker with ten postings (0.3), and draft project entries (1.2). By the end of this lab you will have three PDFs and you will have sent at least three applications.</p>
${flow([
  ['1 · Build', 'the base CV', 'Skeleton from 1.1 + project entries from 1.2 + skills from your matrix. One page.'],
  ['2 · Tailor', 'three variants', 'Backend Node · Java/Spring · Fullstack. Only the summary, skill order and bullet order change — never the facts.'],
  ['3 · Test', 'four tests', 'Ten-second glance · ATS copy-paste · click every link · three-level follow-ups.'],
  ['4 · Score', 'rubric out of 20', 'Fix every line that scores 0.'],
  ['5 · Ship', 'three real applications', 'Log each one in the tracker with a dated next step.'],
])}

<h3>Steps</h3>
<ol>
<li><strong>Build the base CV</strong> from the skeleton in Lesson 1.1. Paste in your two strongest project entries from Lesson 1.2. Fill Skills only with lines at level 2 or 3 in your matrix.</li>
<li><strong>Create three variants</strong> by copying the file: <code>Name_Backend_Node_CV.pdf</code>, <code>Name_Backend_Java_CV.pdf</code>, <code>Name_Fullstack_CV.pdf</code>. In each, rewrite the summary for that direction and move the most relevant project and skills to the top.</li>
<li><strong>Run the ten-second glance test</strong>: show the CV to a friend for ten seconds, take it away, and ask "what role is this person applying for, and what is their best project?" If they cannot answer, your top third is not doing its job.</li>
<li><strong>Run the ATS test</strong>: open the PDF, select all, copy, paste into a plain text editor. Check that sections appear in order and no text is missing.</li>
<li><strong>Click every link</strong> in the PDF: GitHub, LinkedIn, demo, case study. A dead link on a CV is a small disaster.</li>
<li><strong>Run the three-level follow-up test</strong> (Lesson 1.2) on every bullet, out loud.</li>
<li><strong>Score with the rubric</strong> below, fix, rescore.</li>
<li><strong>Send</strong> the right variant to three postings marked "Apply now" in your tracker, and set the next step for each.</li>
</ol>
<details><summary>Hint — strong verbs to start bullets with</summary>
${ra(DONG_TU)}
</details>
<details><summary>Hint — what to write when a bullet has no number</summary>
<p>Use checkable evidence instead: "added a smoke test that fails the deploy on a 404", "wrote 12 unit tests for the booking rules", "documented the setup so a teammate ran the project in 15 minutes". Counts, tests, documents and before/after behaviour are all evidence.</p>
</details>
<details><summary>Hint — the summary formula</summary>
<p>[Who you are] + [strongest proof] + [what you want, from when]. Example: "Software Engineering student who builds and runs a production web platform (Node.js/TypeScript, PostgreSQL, Docker). Looking for a backend internship from January 2027."</p>
</details>
${bay('en', 'tailoring by changing facts.', 'Tailoring means choosing what to show first, not changing what is true. If the Java variant says "Spring Boot: 1 year" and the Node variant says "Spring Boot: learning", the two CVs will one day be compared — in the same company, by the same recruiter.')}
${keXau('en', 'once you send a CV you lose control of the file. Before sending: remove document metadata that contains your full name or old addresses (PDF properties), make sure the file is exported fresh (not a shared Google Docs link with edit rights), and send only to the company’s official address or portal. If a "recruiter" asks you to upload the CV to an unfamiliar site that also wants your login, stop.')}

<h3>Rubric (out of 20)</h3>
${rubric('en', [
  ['Length and layout', 'More than one page or two columns', 'One page, cluttered', 'One page, single column, clear headings'],
  ['Header', 'Missing links or unprofessional email', 'Complete, no custom LinkedIn URL', 'Complete, custom URLs, all links work'],
  ['Summary', 'Generic objective', 'Specific but not tailored', 'Tailored: who + proof + what/when'],
  ['Bullet formula', 'Duties ("responsible for")', 'Some action verbs', 'Every bullet: verb + what + how + result'],
  ['Decision and problem bullets', 'None', 'One of the two', 'At least one of each'],
  ['Numbers', 'Invented or vague', 'Few, some unexplained', 'Only measured numbers or checkable evidence'],
  ['Skills vs evidence', 'Skills with no proof', 'Mostly backed', 'Every listed skill backed in the matrix'],
  ['Personal data', 'ID number, birth date or full address', 'Some unnecessary details', 'Only city, phone, email, links'],
  ['ATS test', 'Scrambled or missing text', 'Minor order issues', 'Pastes cleanly in order'],
  ['Consistency', 'CV, GitHub and LinkedIn disagree', 'Small differences', 'All three tell the same story'],
])}
<p><strong>Extra challenge:</strong> ask a senior who already works as a developer to spend five minutes on your CV and tell you the first question they would ask. Prepare that answer.</p>
${thucHanh('en', { phut: '90–120', steps: [
  'Complete steps 1–8 above.',
  'Save the three PDFs in <code>~/interview-kit/cv/</code> with a version date in the file names you keep (send clean names).',
  'Log the three applications in your tracker.',
], dat: 'three PDFs scoring at least 16/20, every link works, and three real applications are logged with dated next steps.' })}
${thuatNgu('en', [
  ['Variant', 'A tailored copy of the base CV for one direction.'],
  ['Glance test', 'Showing the CV briefly to someone and checking what they remember.'],
  ['ATS test', 'Copy-pasting the PDF text to see what a parser would read.'],
  ['Rubric', 'A scoring table with criteria and levels, used to grade work consistently.'],
  ['Metadata', 'Hidden information in a file, such as author name and creation date.'],
])}
${tomTat('en', [
  'Treat the CV like software: spec, build, test, version, ship.',
  'Tailor by order and emphasis, never by changing facts.',
  'Four tests: ten-second glance, ATS copy-paste, every link, three-level follow-ups.',
  'Aim for at least 16/20 on the rubric before sending.',
  'A CV week ends with real applications in the tracker, not a perfect file on your disk.',
])}
${lienQuan('en', [
  yt('PxGLmDk55JU', 'Tech With Tim', 'I Reviewed 200 Developer Resumes - They Were Shocking...', 11, 'en'),
  lienKet({ khoa: 'git', bai: 'git-15-1-ho-so-github', L: 'en', title: 'Git 15.1 — Your GitHub profile as a CV', sub: 'Make sure the GitHub link on the CV lands on a profile that tells the same story.' }),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Lab 1</span>
<h2>Lab 1 — Viết CV, may đo nó, kiểm thử nó như kiểm thử phần mềm</h2>
<p class="lead">CV là một mẩu phần mềm nhỏ chạy trong đầu người tuyển dụng. Như phần mềm, nó nên được dựng từ một bản đặc tả, kiểm thử trước khi phát hành, và có phiên bản. Trong lab này bạn làm ra thứ thật — chính cái CV bạn sẽ gửi trong tuần CV — cùng hai bản may đo, và kiểm thử cả ba trước khi chúng rời khỏi máy bạn.</p>

<h3>Tình huống</h3>
<p>Đây là tuần CV (22–29/11 trong kế hoạch bốn tuần). Bạn đã có ma trận kỹ năng (0.2), bảng theo dõi với mười tin (0.3), và bản nháp các mục dự án (1.2). Hết lab này bạn có ba tệp PDF và đã gửi ít nhất ba đơn ứng tuyển.</p>
${flow([
  ['1 · Dựng', 'bản CV gốc', 'Khung ở bài 1.1 + các mục dự án ở bài 1.2 + kỹ năng từ ma trận. Một trang.'],
  ['2 · May đo', 'ba bản', 'Backend Node · Java/Spring · Fullstack. Chỉ đổi tóm tắt, thứ tự kỹ năng và thứ tự gạch đầu dòng — không bao giờ đổi sự thật.'],
  ['3 · Kiểm thử', 'bốn phép thử', 'Nhìn nhanh mười giây · sao chép–dán ATS · bấm mọi đường dẫn · ba tầng đào sâu.'],
  ['4 · Chấm', 'rubric thang 20', 'Sửa mọi tiêu chí đang được 0 điểm.'],
  ['5 · Phát hành', 'ba đơn thật', 'Ghi từng đơn vào bảng theo dõi, kèm bước tiếp theo có ngày.'],
])}

<h3>Các bước</h3>
<ol>
<li><strong>Dựng bản CV gốc</strong> từ bộ khung ở bài 1.1. Dán vào hai mục dự án mạnh nhất từ bài 1.2. Mục Kỹ năng chỉ điền các dòng ở mức 2 hoặc 3 trong ma trận.</li>
<li><strong>Tạo ba bản</strong> bằng cách sao tệp: <code>HoTen_Backend_Node_CV.pdf</code>, <code>HoTen_Backend_Java_CV.pdf</code>, <code>HoTen_Fullstack_CV.pdf</code>. Ở mỗi bản, viết lại tóm tắt cho đúng hướng đó và đưa dự án, kỹ năng liên quan nhất lên đầu.</li>
<li><strong>Làm phép thử nhìn nhanh mười giây</strong>: cho một người bạn xem CV trong mười giây, cất đi, rồi hỏi "người này ứng tuyển vị trí gì, và dự án tốt nhất của họ là gì?" Nếu họ không trả lời được, một phần ba trên cùng của CV chưa làm tròn việc.</li>
<li><strong>Làm phép thử ATS</strong>: mở PDF, chọn hết, sao chép, dán vào trình soạn thảo văn bản thuần. Kiểm các mục hiện ra đúng thứ tự và không mất chữ.</li>
<li><strong>Bấm mọi đường dẫn</strong> trong PDF: GitHub, LinkedIn, demo, case study. Một đường dẫn chết trên CV là một thảm hoạ nhỏ.</li>
<li><strong>Làm phép thử ba tầng đào sâu</strong> (bài 1.2) cho từng gạch đầu dòng, nói thành tiếng.</li>
<li><strong>Chấm bằng rubric</strong> bên dưới, sửa, chấm lại.</li>
<li><strong>Gửi</strong> đúng bản cho ba tin được đánh dấu "Nộp ngay" trong bảng theo dõi, và đặt bước tiếp theo cho từng tin.</li>
</ol>
<details><summary>Gợi ý — động từ mạnh để mở đầu gạch đầu dòng</summary>
${ra(DONG_TU)}
</details>
<details><summary>Gợi ý — viết gì khi một dòng không có con số</summary>
<p>Dùng bằng chứng kiểm được thay vào: "thêm smoke test làm deploy thất bại khi gặp 404", "viết 12 unit test cho luật đặt lịch", "viết tài liệu cài đặt để bạn cùng nhóm chạy được dự án trong 15 phút". Số lượng, test, tài liệu và hành vi trước/sau đều là bằng chứng.</p>
</details>
<details><summary>Gợi ý — công thức phần tóm tắt</summary>
<p>[Bạn là ai] + [bằng chứng mạnh nhất] + [bạn muốn gì, từ khi nào]. Ví dụ: "Software Engineering student who builds and runs a production web platform (Node.js/TypeScript, PostgreSQL, Docker). Looking for a backend internship from January 2027."</p>
</details>
${bay('vi', 'may đo bằng cách đổi sự thật.', 'May đo nghĩa là chọn cái gì hiện ra trước, không phải đổi cái gì là thật. Nếu bản Java ghi "Spring Boot: 1 năm" còn bản Node ghi "Spring Boot: đang học", sẽ có ngày hai bản CV bị đặt cạnh nhau — ở cùng một công ty, bởi cùng một người tuyển dụng.')}
${keXau('vi', 'gửi CV đi là bạn mất quyền kiểm soát tệp đó. Trước khi gửi: xoá siêu dữ liệu (metadata) trong tài liệu có họ tên đầy đủ hay địa chỉ cũ (thuộc tính PDF), bảo đảm tệp được xuất mới (không phải link Google Docs chia sẻ quyền sửa), và chỉ gửi tới email hay cổng ứng tuyển chính thức của công ty. Nếu một "recruiter" bảo bạn tải CV lên một trang lạ đồng thời đòi đăng nhập, dừng lại.')}

<h3>Rubric (thang 20)</h3>
${rubric('vi', [
  ['Độ dài và bố cục', 'Hơn một trang hoặc hai cột', 'Một trang, rối', 'Một trang, một cột, tiêu đề mục rõ'],
  ['Phần đầu', 'Thiếu đường dẫn hoặc email thiếu nghiêm túc', 'Đủ, chưa có đường dẫn LinkedIn riêng', 'Đủ, đường dẫn riêng, mọi link đều chạy'],
  ['Tóm tắt', 'Mục tiêu chung chung', 'Cụ thể nhưng chưa may đo', 'May đo: ai + bằng chứng + muốn gì/khi nào'],
  ['Công thức gạch đầu dòng', 'Liệt kê nhiệm vụ ("chịu trách nhiệm")', 'Có vài động từ mạnh', 'Mọi dòng: động từ + việc + cách làm + kết quả'],
  ['Dòng quyết định và sự cố', 'Không có', 'Có một trong hai', 'Có ít nhất một mỗi loại'],
  ['Con số', 'Bịa hoặc mơ hồ', 'Ít, có cái không giải thích được', 'Chỉ con số đã đo hoặc bằng chứng kiểm được'],
  ['Kỹ năng và bằng chứng', 'Kỹ năng không có bằng chứng', 'Phần lớn có bằng chứng', 'Mọi kỹ năng ghi ra đều có bằng chứng trong ma trận'],
  ['Dữ liệu cá nhân', 'Có số căn cước, ngày sinh hoặc địa chỉ đầy đủ', 'Còn vài chi tiết thừa', 'Chỉ thành phố, điện thoại, email, đường dẫn'],
  ['Phép thử ATS', 'Chữ bị xáo trộn hoặc mất', 'Lệch thứ tự nhỏ', 'Dán ra sạch, đúng thứ tự'],
  ['Nhất quán', 'CV, GitHub và LinkedIn nói khác nhau', 'Khác nhau chút ít', 'Cả ba kể cùng một câu chuyện'],
])}
<p><strong>Thử thách thêm:</strong> nhờ một anh chị đã đi làm lập trình viên dành năm phút cho CV của bạn và nói câu hỏi đầu tiên họ sẽ hỏi. Chuẩn bị câu trả lời cho câu đó.</p>
${thucHanh('vi', { phut: '90–120', steps: [
  'Làm xong các bước 1–8 ở trên.',
  'Lưu ba tệp PDF vào <code>~/interview-kit/cv/</code>, bản bạn giữ lại có ngày phiên bản trong tên tệp (bản gửi đi thì tên sạch).',
  'Ghi ba đơn ứng tuyển vào bảng theo dõi.',
], dat: 'ba tệp PDF đạt ít nhất 16/20, mọi đường dẫn chạy, và ba đơn thật đã được ghi kèm bước tiếp theo có ngày.' })}
${thuatNgu('vi', [
  ['Variant (bản may đo)', 'Một bản sao của CV gốc được chỉnh cho một hướng.'],
  ['Glance test (phép thử nhìn nhanh)', 'Cho ai đó xem CV trong chốc lát rồi kiểm họ nhớ được gì.'],
  ['ATS test (phép thử ATS)', 'Sao chép–dán chữ trong PDF để xem một bộ đọc tự động sẽ thấy gì.'],
  ['Rubric (bảng tiêu chí chấm)', 'Bảng tiêu chí và mức điểm, dùng để chấm cho nhất quán.'],
  ['Metadata (siêu dữ liệu)', 'Thông tin ẩn trong tệp, như tên tác giả và ngày tạo.'],
])}
${tomTat('vi', [
  'Đối xử với CV như phần mềm: đặc tả, dựng, kiểm thử, phiên bản, phát hành.',
  'May đo bằng thứ tự và điểm nhấn, không bao giờ bằng cách đổi sự thật.',
  'Bốn phép thử: nhìn nhanh mười giây, sao chép–dán ATS, bấm mọi đường dẫn, ba tầng đào sâu.',
  'Nhắm ít nhất 16/20 theo rubric trước khi gửi.',
  'Tuần CV kết thúc bằng những đơn thật trong bảng theo dõi, không phải một tệp hoàn hảo nằm trên ổ đĩa.',
])}
${lienQuan('vi', [
  yt('PxGLmDk55JU', 'Tech With Tim', 'I Reviewed 200 Developer Resumes - They Were Shocking...', 11),
  lienKet({ khoa: 'git', bai: 'git-15-1-ho-so-github', title: 'Git 15.1 — Trang GitHub như một CV', sub: 'Bảo đảm đường dẫn GitHub trên CV dẫn tới một trang hồ sơ kể cùng một câu chuyện.' }),
])}
</div>
`,
};

/* ═══════════════════════ 1.6 — Quiz ═══════════════════════ */
const Q16 = {
  title: '1.6 — Chapter 1 check|||1.6 — Kiểm tra Chương 1',
  slug: 'pv-1-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về CV một trang, công thức gạch đầu dòng, con số trung thực, dự án nhóm và dự án làm cùng AI, GitHub và bí mật bị lộ, LinkedIn và xin giới thiệu nội bộ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Check</span>
<h2>Chapter 1 check — CV, GitHub, LinkedIn</h2>
<p class="lead">Ten situations from the CV week. Read every explanation, especially for the questions you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a bullet as action verb + what + how + result.</li>
<li>I know which personal details to leave off a CV, and why.</li>
<li>I can describe team and AI-assisted work truthfully.</li>
<li>I know what to do first if a key leaked into a public repository.</li>
<li>I know the order for asking someone for a referral.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Kiểm tra Chương 1 — CV, GitHub, LinkedIn</h2>
<p class="lead">Mười tình huống của tuần CV. Đọc mọi lời giải thích, nhất là những câu bạn đoán mà trúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được một gạch đầu dòng theo động từ + việc + cách làm + kết quả.</li>
<li>Tôi biết thông tin cá nhân nào nên bỏ khỏi CV, và vì sao.</li>
<li>Tôi mô tả được việc làm nhóm và việc làm cùng AI một cách trung thực.</li>
<li>Tôi biết phải làm gì ĐẦU TIÊN nếu một khoá bị lộ lên kho công khai.</li>
<li>Tôi biết thứ tự đúng khi nhờ ai đó giới thiệu nội bộ.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      cau('Which bullet follows the formula best?|||Gạch đầu dòng nào theo đúng công thức nhất?', [
        'Responsible for the deploy process of the website.|||Chịu trách nhiệm quy trình deploy của website.',
        'Participated in many tasks using Docker, Nginx and GitHub Actions.|||Tham gia nhiều công việc dùng Docker, Nginx và GitHub Actions.',
        'Hard-working team player who learns new technologies fast.|||Chăm chỉ, làm nhóm tốt, học công nghệ mới nhanh.',
        'Moved image builds to a separate machine pushing to a registry, cutting build time from ~15 to 3–6 minutes.|||Chuyển việc dựng ảnh sang một máy riêng đẩy lên registry, giảm thời gian build từ ~15 xuống 3–6 phút.',
      ], 3, 'EN: It has an action verb, the object, the method and a measured result. The second option looks rich because it lists tools, but "participated in many tasks" says nothing you did.|||VI: Nó có động từ, đối tượng, cách làm và kết quả đã đo. Phương án hai trông "nhiều chữ" vì liệt kê công cụ, nhưng "tham gia nhiều công việc" không nói bạn đã làm gì.'),
      cau('A friend suggests adding "improved performance by 40%" to your CV because "numbers look good". You never measured it. What should you do?|||Một người bạn gợi ý thêm "cải thiện hiệu năng 40%" vào CV vì "có số trông đẹp". Bạn chưa từng đo. Bạn nên làm gì?', [
        'Add it — nobody checks numbers on a student CV|||Thêm vào — chẳng ai kiểm số trên CV sinh viên',
        'Leave it out, or measure it first; otherwise use checkable evidence such as a test or a before/after behaviour|||Bỏ ra, hoặc đo trước đã; không thì dùng bằng chứng kiểm được như một bài test hay hành vi trước/sau',
        'Write "about 40%" to be safe|||Ghi "khoảng 40%" cho an toàn',
        'Write 20% instead, to sound modest|||Ghi 20% cho khiêm tốn',
      ], 1, 'EN: An unmeasured number breaks at the first follow-up ("how did you measure it?"). Softening it to "about" or a smaller number is still invented.|||VI: Con số chưa đo sẽ gãy ở câu đào sâu đầu tiên ("em đo thế nào?"). Làm mềm thành "khoảng" hay hạ xuống số nhỏ hơn thì vẫn là bịa.'),
      cau('Which item should a Vietnamese student CV for an IT internship normally leave OUT?|||Mục nào CV thực tập IT của sinh viên Việt Nam thường nên BỎ RA?', [
        'Links to GitHub and LinkedIn|||Đường dẫn GitHub và LinkedIn',
        'Expected graduation year|||Năm dự kiến tốt nghiệp',
        'ID card number and full home address|||Số căn cước và địa chỉ nhà đầy đủ',
        'A two-line summary|||Hai dòng tóm tắt',
      ], 2, 'EN: ID number and full address are irrelevant to the job and useful to scammers. The graduation year is relevant: it tells them when you are available and how far along you are.|||VI: Số căn cước và địa chỉ đầy đủ không liên quan tới công việc mà lại có ích cho kẻ lừa. Năm tốt nghiệp thì liên quan: nó cho họ biết khi nào bạn rảnh và bạn đã học tới đâu.'),
      cau('You copy your PDF CV into a plain text editor and the Skills section appears in the middle of a project bullet. What does this tell you?|||Bạn dán CV PDF vào trình soạn thảo văn bản thuần và mục Kỹ năng hiện ra giữa một gạch đầu dòng dự án. Điều đó nói lên gì?', [
        'An ATS will likely read it scrambled too — switch to a simple single-column layout|||Một hệ thống ATS nhiều khả năng cũng đọc ra lộn xộn — chuyển sang bố cục một cột đơn giản',
        'Nothing — humans read the PDF, not the text|||Không sao — con người đọc PDF, không đọc chữ',
        'The PDF is corrupted and must be re-downloaded|||Tệp PDF bị hỏng và phải tải lại',
        'You should send the CV as an image instead|||Bạn nên gửi CV dạng ảnh',
      ], 0, 'EN: The copy-paste test approximates what a parser sees; multi-column layouts often break it. Sending an image makes it worse — there is no text to search at all.|||VI: Phép thử sao chép–dán mô phỏng những gì một bộ đọc tự động thấy; bố cục nhiều cột hay làm hỏng nó. Gửi dạng ảnh còn tệ hơn — không còn chữ nào để tìm.'),
      cau('In a team of five you built only the payment module. How should the CV describe it?|||Trong nhóm năm người, bạn chỉ làm module thanh toán. CV nên mô tả thế nào?', [
        '"Built an e-commerce platform" — the team’s result counts|||"Xây một nền tảng thương mại điện tử" — kết quả của nhóm cũng tính',
        'Leave the project off because your part was small|||Bỏ dự án ra vì phần của bạn nhỏ',
        'List every feature of the platform so it looks bigger|||Liệt kê mọi tính năng của nền tảng cho trông lớn',
        '"Team of 5 · I owned the payment module: …" with deep bullets about that module|||"Nhóm 5 người · em phụ trách module thanh toán: …" kèm các dòng đi sâu vào module đó',
      ], 3, 'EN: State team size and your part, then go deep. "Built an e-commerce platform" is tempting but the first question ("which part did you do?") exposes it.|||VI: Ghi số người và phần của bạn, rồi đi sâu. "Xây một nền tảng thương mại điện tử" nghe hấp dẫn nhưng câu hỏi đầu tiên ("em làm phần nào?") làm lộ ra ngay.'),
      cau('Most of your personal platform’s code was written by an AI assistant under your direction. What is the best CV wording?|||Phần lớn mã của nền tảng cá nhân do trợ lý AI viết theo chỉ đạo của bạn. Cách ghi CV tốt nhất là gì?', [
        '"Developed every feature from scratch."|||"Tự phát triển mọi tính năng từ số 0."',
        '"Designed and operate the system (built with AI coding assistants); focused on architecture, review, deployment and incident response."|||"Thiết kế và vận hành hệ thống (xây cùng trợ lý AI); tập trung vào kiến trúc, duyệt mã, deploy và xử lý sự cố."',
        'Do not mention the project at all|||Không nhắc tới dự án',
        'Mention AI in every bullet|||Nhắc tới AI ở mọi gạch đầu dòng',
      ], 1, 'EN: Say it once, truthfully, and focus on what you really own. Claiming everything from scratch fails the first "change this code now" request; repeating AI in every bullet hides your real contributions.|||VI: Nói một lần, đúng sự thật, và tập trung vào phần bạn thật sự làm chủ. Nhận "tự làm từ số 0" sẽ gãy ngay khi bị nhờ "sửa đoạn này luôn nhé"; nhắc AI ở mọi dòng lại che mất đóng góp thật của bạn.'),
      cau('You discover that a database password was committed to a public repository three weeks ago. What do you do FIRST?|||Bạn phát hiện một mật khẩu cơ sở dữ liệu đã bị commit lên kho công khai từ ba tuần trước. Việc ĐẦU TIÊN phải làm là gì?', [
        'Delete the file in a new commit|||Xoá tệp trong một commit mới',
        'Make the repository private|||Chuyển kho sang riêng tư',
        'Change (revoke) the password, then clean the history|||Đổi (thu hồi) mật khẩu, rồi mới dọn lịch sử',
        'Rewrite history with force push and keep the password|||Viết lại lịch sử bằng force push và giữ nguyên mật khẩu',
      ], 2, 'EN: After three weeks you must assume it was copied; only revoking makes the leaked value useless. Deleting the file leaves it in history, and making the repository private does not un-copy it.|||VI: Sau ba tuần phải coi như nó đã bị chép; chỉ có thu hồi mới làm giá trị bị lộ hết tác dụng. Xoá tệp thì nó vẫn nằm trong lịch sử, và chuyển kho sang riêng tư không làm bản đã bị chép biến mất.'),
      cau('Your production code is private. How do you still give a reviewer evidence?|||Mã production của bạn là riêng tư. Làm sao vẫn cho người xét hồ sơ bằng chứng?', [
        'A public case-study repository (README, diagram, screenshots, incidents) and an offer to walk through the code live|||Một kho case study công khai (README, sơ đồ, ảnh, sự cố) và đề nghị đi qua mã trực tiếp',
        'Make the production repository public for the hiring season|||Công khai kho production trong mùa tuyển dụng',
        'Copy the source into a new public repository without the .env|||Sao mã nguồn sang một kho công khai mới, bỏ .env',
        'Write "code available on request" with no other detail|||Ghi "có mã nếu được yêu cầu" mà không thêm gì khác',
      ], 0, 'EN: A case study shows decisions and results without exposing infrastructure. Copying the source "without .env" is the tempting wrong answer: configuration, server details and old secrets often live elsewhere in the code and history.|||VI: Một case study cho thấy quyết định và kết quả mà không phơi hạ tầng ra. Sao mã "bỏ .env" là phương án sai hấp dẫn: cấu hình, chi tiết máy chủ và bí mật cũ thường nằm rải rác ở chỗ khác trong mã và lịch sử.'),
      cau('What is the right order for getting a referral from a senior you have never met?|||Thứ tự đúng để xin giới thiệu nội bộ từ một anh chị khoá trên bạn chưa từng gặp là gì?', [
        'Send the CV with the first connection request|||Gửi CV kèm ngay lời mời kết nối đầu tiên',
        'Connect with a short note → one genuine exchange → ask with the link, CV and an easy way to decline|||Kết nối kèm lời nhắn ngắn → một lần trao đổi thật lòng → nhờ kèm link tin, CV và lối dễ để từ chối',
        'Ask a friend to forward your CV without telling the senior|||Nhờ bạn chuyển CV mà không báo trước cho anh chị đó',
        'Comment "please refer me" on their posts|||Bình luận "anh giới thiệu em với" dưới bài của họ',
      ], 1, 'EN: A referral risks the referrer’s reputation, so it follows a real exchange. Sending the CV with the first request skips the trust-building that makes people willing to vouch for you.|||VI: Giới thiệu nội bộ đặt cược uy tín của người giới thiệu, nên phải đi sau một lần trao đổi thật. Gửi CV ngay lời mời đầu tiên bỏ qua bước tạo lòng tin khiến người ta sẵn lòng bảo lãnh cho bạn.'),
      cau('Your Java CV variant says "Spring Boot — 1 year", your Node variant says "Spring Boot — learning". What is wrong?|||Bản CV Java ghi "Spring Boot — 1 năm", bản Node ghi "Spring Boot — đang học". Sai ở đâu?', [
        'Nothing; each variant targets a different company|||Không sai; mỗi bản nhắm một công ty khác nhau',
        'The Node variant should also say one year|||Bản Node cũng nên ghi một năm',
        'Variants should not exist; send one CV everywhere|||Không nên có bản may đo; gửi một CV cho mọi nơi',
        'Tailoring changed a fact; variants may change order and emphasis, never truth|||May đo đã đổi một sự thật; bản may đo chỉ được đổi thứ tự và điểm nhấn, không bao giờ đổi sự thật',
      ], 3, 'EN: The two files can end up in front of the same recruiter. "Different companies" is tempting, but recruiters, agencies and shared databases make inconsistent CVs visible.|||VI: Hai tệp hoàn toàn có thể tới tay cùng một người tuyển dụng. "Công ty khác nhau" nghe hợp lý, nhưng recruiter, công ty săn đầu người và cơ sở dữ liệu dùng chung làm CV mâu thuẫn bị lộ.'),
    ],
  },
};

export default {
  title: 'Chapter 1 — CV, LinkedIn and GitHub|||Chương 1 — CV, LinkedIn và GitHub',
  description: 'Hồ sơ được hồi âm: CV kỹ thuật một trang theo công thức động từ + việc + cách làm + kết quả, viết dự án có quyết định và sự cố (kể cả dự án nhóm và dự án làm cùng AI), GitHub với kho ghim và README case study an toàn, LinkedIn và cách xin giới thiệu nội bộ, Lab 1 may đo ba bản CV và kiểm thử trước khi gửi.',
  lessons: [L11, L12, L13, L14, L15, Q16],
};
