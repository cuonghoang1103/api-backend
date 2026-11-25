/**
 * Bắt đầu tại đây (1/2) — khoá fullstack-project (soạn 24/11/2026, agent fsp).
 * Output chạy THẬT trên máy nhà Fedora (Node 22.22.2, npm 10.9.7, Git 2.55.0, Docker 29.6.2, Compose v5.3.1).
 * Nguồn kiểm GET 200 ngày 24/11/2026: Wikipedia LAMP (Kunze, c't 12/1998), Wikipedia MEAN (Karpov 2013),
 * Stack Overflow Developer Survey 2025 (technology), Notion blog 06/10/2021, Figma blog (sharding Postgres).
 */
import { nguon, lienKet, spring } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-0-0-start-here-1', title: 'Node.js — Bắt đầu tại đây', sub: 'Nền backend JavaScript. Khoá này dùng Node làm backend; khái niệm sâu nằm bên đó.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'react', bai: 'rx-0-8-bat-dau-tai-day', title: 'React — Bắt đầu tại đây', sub: 'Nền frontend. Chương 6 của khoá này dựng giao diện bằng React.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-0-8-bat-dau-tai-day', title: 'Spring Boot — Bắt đầu tại đây', sub: 'Đồ án SWP391 dùng React + Spring Boot + PostgreSQL: mỗi chương ở đây có hộp chỉ đúng bài Spring tương ứng.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📖', 'Wikipedia — LAMP (software bundle)', 'Chữ LAMP do Michael Kunze đặt trong số tháng 12/1998 của tạp chí c\'t (Đức).', 'https://en.wikipedia.org/wiki/LAMP_(software_bundle)'),
  nguon('📖', 'Wikipedia — MEAN (solution stack)', 'Chữ MEAN do Valeri Karpov đặt trong một bài blog năm 2013.', 'https://en.wikipedia.org/wiki/MEAN_(solution_stack)'),
  nguon('📊', 'Stack Overflow Developer Survey 2025 — Technology', 'Tỷ lệ lập trình viên chuyên nghiệp dùng Node.js, React, PostgreSQL, Docker.', 'https://survey.stackoverflow.co/2025/technology'),
  nguon('🐘', 'Notion — Herding elephants: Lessons learned from sharding Postgres at Notion (06/10/2021)', 'Notion chạy trên PostgreSQL và phải chia nhỏ (shard) khi lớn.', 'https://www.notion.com/blog/sharding-postgres-at-notion'),
  nguon('🐘', 'Figma — How Figma’s databases team lived to tell the scale', 'Năm 2020 Figma chạy MỘT cơ sở dữ liệu Postgres; tới nay tăng gần 100 lần.', 'https://www.figma.com/blog/how-figmas-databases-team-lived-to-tell-the-scale/'),
].join('\n');

export default {
  title: 'Start here (1/2) — Why one finished project beats ten tutorials|||Bắt đầu tại đây (1/2) — Vì sao một dự án xong việc hơn mười tutorial dở dang',
  slug: 'fp-0-8-bat-dau-tai-day',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dự án full-stack là gì, chữ "stack" từ đâu ra (LAMP 1998, MEAN 2013), khác khoá khái niệm và đồ án SWP391 thế nào, cần nền gì, học xong làm được gì, hệ thống thật nào đang chạy đúng bộ công nghệ này (có nguồn), học kèm khoá nào — và kiểm máy trong 10 phút.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>You have watched enough tutorials. Now you build one real thing, all the way to production</h2>
<p class="lead">Welcome. This course is different from the others on this site. It does not teach one tool. It walks you through building <strong>one complete application</strong> — a small post-sharing network called <strong>ChiaSe</strong> — from an empty folder to a live URL with HTTPS: planning, backend, login, image upload, comments, a React frontend, light realtime, tests, Docker, CI and deployment. You type every line. Each chapter ends with a <strong>checkpoint</strong> you can grade yourself with one command.</p>

<h3>An everyday picture: learning to cook</h3>
<p>Watching cooking videos teaches you what a good dish looks like. It does not teach you what to do when the rice is still hard and the guests arrive in ten minutes. Only cooking a full meal — shopping, prepping, timing four dishes, cleaning up — teaches that. Tutorials show one dish in perfect conditions. A project makes you run the whole kitchen, and the hard parts are exactly the joins: the API works, the page works, but the page cannot call the API (CORS); the login works, but after a refresh you are logged out; everything works on your laptop, nothing works in Docker.</p>

<h3>What "full-stack" and "stack" mean — and where the words came from</h3>
<ul>
<li>A <strong>stack</strong> is the set of technologies that together run an application: something stores data (database), something answers requests (backend), something draws the screen (frontend), something runs it all (operating system, containers).</li>
<li>The word became popular through acronyms. <strong>LAMP</strong> (Linux, Apache, MySQL, PHP) was coined by Michael Kunze in the December 1998 issue of the German magazine <em>c't</em>, to show that free software could replace expensive commercial packages. <strong>MEAN</strong> (MongoDB, Express, Angular, Node.js) was coined by Valeri Karpov in a 2013 blog post — the first popular stack written in JavaScript end to end.</li>
<li>This course uses what people often call <strong>PERN</strong>: PostgreSQL, Express, React, Node.js — plus Prisma, Docker and GitHub Actions. Your SWP391 project uses the Java cousin: React + Spring Boot + PostgreSQL. The architecture is the same; only the backend language changes.</li>
<li>A <strong>full-stack developer</strong> is someone who can take a feature through every layer: table → API → page → test → deploy. Nobody is equally deep everywhere; what matters is that you can make the layers talk to each other and find which layer is broken.</li>
</ul>

<h3>How this course differs from what you already have</h3>
<table>
<thead><tr><th></th><th>Concept courses (Node.js, React, PostgreSQL…)</th><th>This course</th><th>SWP391 at school</th></tr></thead>
<tbody>
<tr><td>Goal</td><td>Understand one tool deeply</td><td>Assemble tools into one product, alone</td><td>Build a product as a team, graded</td></tr>
<tr><td>Examples</td><td>Small, isolated</td><td>One app that grows each chapter</td><td>Your team's topic</td></tr>
<tr><td>Hard part</td><td>The concept</td><td>The joins between layers, and finishing</td><td>Teamwork, deadlines</td></tr>
<tr><td>Output</td><td>Knowledge</td><td>A deployed app + a story for interviews</td><td>A grade + a demo</td></tr>
</tbody>
</table>
<p>Do this course <strong>before</strong> SWP391 if you can: when the team starts, you will already have walked the whole road once. It is also different from a "full-stack framework" such as Next.js, where one framework renders pages and handles the API. Here the frontend and the backend are <strong>separate applications</strong> that talk over HTTP — exactly the shape of React + Spring Boot in SWP391 and of most outsourcing projects.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — copying without understanding.</strong> Pasting a finished file from a video (or an AI) makes the checkpoint pass today and leaves you unable to change it tomorrow. Type it, break it once on purpose, and explain each line in your diary.</p></div>
<h3>What you need before starting</h3>
<ul>
<li>JavaScript basics: variables, functions, arrays, objects, <code>async/await</code>. TypeScript is introduced as we go.</li>
<li>Terminal basics (<code>cd</code>, <code>ls</code>, running a command) and Git at the level of commit and push.</li>
<li>A computer with Node 22, Git and Docker. The practice at the end of this lesson checks all three.</li>
<li>Every lesson re-explains the concept it needs on the spot, then links to the deep lesson in another course. You will not get stuck because "that was taught somewhere else".</li>
</ul>

<h3>After this course you can…</h3>
<ul>
<li>Turn a vague idea into user stories, a data model and an API list before writing code (Chapter 1).</li>
<li>Build an Express + TypeScript + PostgreSQL/Prisma backend with registration, login, JWT with refresh-token rotation, image upload to S3-compatible storage, comments, likes and cursor pagination (Chapters 2–5).</li>
<li>Build a React frontend that logs in, refreshes tokens silently and posts with an image preview; add live comments with Socket.IO (Chapters 6–7).</li>
<li>Test with a real database, package everything with Docker, block bad merges with CI, deploy to a VPS with a domain and HTTPS, and roll back when a deploy goes wrong (Chapters 8–11).</li>
<li>Answer "show me a project you built" with a live URL, a clean repository and a real story about a bug you fixed. That is the question every intern interview ends up at.</li>
</ul>

<h3>Is this stack real? Numbers and systems, with sources</h3>
<ul>
<li>Stack Overflow Developer Survey 2025, professional developers: <strong>Node.js 49.1%</strong> and <strong>React 46.9%</strong> are the two most-used web frameworks/technologies; Express 20.3%; Spring Boot 15.6%. <strong>PostgreSQL 58.2%</strong> is the most-used database. <strong>Docker 73.8%</strong> is the most-used tool.</li>
<li><strong>Notion</strong> runs on PostgreSQL; its engineering blog (6 Oct 2021) describes splitting it into shards when one database was no longer enough.</li>
<li><strong>Figma</strong> wrote that in 2020 it ran a single Postgres database, and that its database stack has grown almost 100× since — handled with replicas, vertical partitioning and then sharding.</li>
</ul>
<p>The point is not that ChiaSe will reach Figma's size. The point is that the boring choice — a relational database, an HTTP API, a component-based frontend — is what real products start with, and the skills transfer directly.</p>

<h3>Courses to take alongside</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Before / alongside</span><span class="lz-t">Git · JavaScript · terminal</span><span class="lz-d">Enough to commit, push and run commands.</span></div>
<div class="lz-step"><span class="lz-k">Deep dives while you build</span><span class="lz-t">Node.js · Prisma · PostgreSQL · React</span><span class="lz-d">Each chapter links to the exact lesson.</span></div>
<div class="lz-step"><span class="lz-k">Chapters 8–11</span><span class="lz-t">Testing · Docker · GitHub Actions · Deploy VPS</span><span class="lz-d">Linked where used; this course applies them.</span></div>
<div class="lz-step"><span class="lz-k">Java version</span><span class="lz-t">Spring Boot</span><span class="lz-d">"If you build it with Spring Boot" box in every chapter.</span></div>
</div>

${spring(true, 'The plan, the data model, the frontend, Docker, CI and deploy are identical. Only the backend layer changes: Express routes become @RestController, Prisma becomes Spring Data JPA, Prisma migrations become Flyway. Each chapter points to the exact Spring Boot lesson.', [
  ['sb-0-8-bat-dau-tai-day', 'Spring Boot — Start here'],
  ['sb-21-1-kien-truc-spa', 'Spring Boot Ch21 — React ↔ Spring Boot end to end'],
])}

<h3>🧪 Practice (10 min) — check your machine</h3>
<div class="callout ok">
<ol>
<li>Open a terminal (Windows: PowerShell or Git Bash; macOS/Linux: Terminal).</li>
<li>Run the five commands below and compare with the output from our machine.</li>
<li>Node must be <strong>22.12 or newer within 22.x</strong> (Vite 8 and ESLint 10 require it). Docker must answer without "permission denied".</li>
</ol>
<pre><code class="language-bash">node -v
npm -v
git --version
docker --version
docker compose version</code></pre>
<div class="out">$ node -v
v22.22.2
$ npm -v
10.9.7
$ git --version
git version 2.55.0
$ docker --version
Docker version 29.6.2, build dfc4efb
$ docker compose version
Docker Compose version v5.3.1</div>
<p><strong>Done when:</strong> all five commands print a version, and Node starts with <code>v22.</code>. Your exact numbers may be newer — that is fine.</p>
</div>
<details><summary>Stuck? Typical fixes</summary>
<ul>
<li><code>node: command not found</code> or an old version: install Node 22 LTS from nodejs.org, or use a version manager (nvm on macOS/Linux, nvm-windows or fnm on Windows), then open a <em>new</em> terminal.</li>
<li><code>permission denied … docker.sock</code> on Linux: add yourself to the <code>docker</code> group (<code>sudo usermod -aG docker $USER</code>) and log out/in.</li>
<li>Windows: Docker Desktop needs WSL 2 enabled; start Docker Desktop before running the command.</li>
</ul>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">stack</span><span class="v">The set of technologies that together run an application.</span></div>
  <div class="kv"><span class="k">full-stack</span><span class="v">Able to take one feature through every layer: database, API, UI, test, deploy.</span></div>
  <div class="kv"><span class="k">PERN</span><span class="v">PostgreSQL + Express + React + Node.js.</span></div>
  <div class="kv"><span class="k">checkpoint</span><span class="v">A self-check at the end of a chapter: one command that proves the chapter works.</span></div>
  <div class="kv"><span class="k">tutorial hell</span><span class="v">Watching tutorial after tutorial without ever finishing your own project.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>This course builds one app, ChiaSe, from empty folder to production; you type every line.</li>
<li>"Stack" acronyms: LAMP (1998, Kunze), MEAN (2013, Karpov); we use PERN; SWP391 uses React + Spring Boot + PostgreSQL — same shape.</li>
<li>The hard part of a project is the joins between layers and finishing; checkpoints make progress measurable.</li>
<li>Node.js, React, PostgreSQL and Docker are each the most-used in their category among professional developers (SO Survey 2025).</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Bạn đã xem đủ tutorial rồi. Giờ ta tự làm MỘT thứ thật, đi hết đường tới production</h2>
<p class="lead">Chào bạn. Khoá này khác các khoá khác trên trang. Nó không dạy một công cụ. Nó dẫn bạn tự xây <strong>một ứng dụng hoàn chỉnh</strong> — mạng chia sẻ bài viết nhỏ tên <strong>ChiaSe</strong> — từ một thư mục rỗng tới một địa chỉ web thật có HTTPS: lên kế hoạch, backend, đăng nhập, tải ảnh, bình luận, giao diện React, realtime nhẹ, test, Docker, CI và deploy. Bạn tự gõ từng dòng. Cuối mỗi chương có một <strong>checkpoint</strong> (điểm kiểm) bạn tự chấm bằng một lệnh.</p>

<h3>Liên tưởng đời thường: học nấu ăn</h3>
<p>Xem video nấu ăn cho bạn biết món ngon trông thế nào. Nó không dạy bạn phải làm gì khi cơm còn sống mà khách tới sau mười phút. Chỉ khi tự nấu trọn một bữa — đi chợ, sơ chế, canh giờ bốn món cùng lúc, dọn dẹp — bạn mới học được điều đó. Tutorial cho bạn xem một món trong điều kiện hoàn hảo. Dự án bắt bạn chạy cả căn bếp, và chỗ khó nằm đúng ở các mối nối: API chạy, trang chạy, nhưng trang không gọi được API (lỗi CORS); đăng nhập được, nhưng F5 là bị đăng xuất; trên laptop chạy hết, cho vào Docker thì không gì chạy.</p>

<h3>"Full-stack" và "stack" là gì — chữ này từ đâu ra</h3>
<ul>
<li><strong>Stack</strong> (bộ công nghệ) là tập các công nghệ cùng nhau chạy một ứng dụng: thứ lưu dữ liệu (cơ sở dữ liệu), thứ trả lời request (backend), thứ vẽ màn hình (frontend), thứ chạy tất cả (hệ điều hành, container).</li>
<li>Chữ này phổ biến nhờ các từ viết tắt. <strong>LAMP</strong> (Linux, Apache, MySQL, PHP) do Michael Kunze đặt trong số tháng 12/1998 của tạp chí Đức <em>c't</em>, để cho thấy phần mềm miễn phí thay được các gói thương mại đắt tiền. <strong>MEAN</strong> (MongoDB, Express, Angular, Node.js) do Valeri Karpov đặt trong một bài blog năm 2013 — bộ công nghệ nổi tiếng đầu tiên viết bằng JavaScript từ đầu tới cuối.</li>
<li>Khoá này dùng bộ người ta hay gọi là <strong>PERN</strong>: PostgreSQL, Express, React, Node.js — thêm Prisma, Docker và GitHub Actions. Đồ án SWP391 của bạn dùng "anh em" bên Java: React + Spring Boot + PostgreSQL. Kiến trúc giống hệt; chỉ đổi ngôn ngữ của tầng backend.</li>
<li><strong>Lập trình viên full-stack</strong> là người đưa được một tính năng đi qua mọi tầng: bảng → API → trang → test → deploy. Không ai sâu đều mọi tầng; điều quan trọng là bạn nối được các tầng với nhau và tìm ra tầng nào đang hỏng.</li>
</ul>

<h3>Khoá này khác những gì bạn đang có</h3>
<table>
<thead><tr><th></th><th>Khoá khái niệm (Node.js, React, PostgreSQL…)</th><th>Khoá này</th><th>SWP391 ở trường</th></tr></thead>
<tbody>
<tr><td>Mục tiêu</td><td>Hiểu sâu một công cụ</td><td>Ráp các công cụ thành một sản phẩm, tự làm một mình</td><td>Làm sản phẩm theo nhóm, có điểm</td></tr>
<tr><td>Ví dụ</td><td>Nhỏ, tách rời</td><td>Một ứng dụng lớn dần qua từng chương</td><td>Đề tài của nhóm</td></tr>
<tr><td>Chỗ khó</td><td>Khái niệm</td><td>Mối nối giữa các tầng, và làm cho XONG</td><td>Làm việc nhóm, hạn nộp</td></tr>
<tr><td>Thu được</td><td>Kiến thức</td><td>Ứng dụng đã deploy + câu chuyện để kể khi phỏng vấn</td><td>Điểm + buổi demo</td></tr>
</tbody>
</table>
<p>Nếu được, hãy học khoá này <strong>trước</strong> SWP391: khi nhóm bắt đầu, bạn đã đi hết con đường một lần. Khoá này cũng khác kiểu "framework full-stack" như Next.js, nơi một framework vừa vẽ trang vừa làm API. Ở đây frontend và backend là <strong>hai ứng dụng riêng</strong> nói chuyện qua HTTP — đúng hình dạng React + Spring Boot của SWP391 và của phần lớn dự án outsourcing.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — chép mà không hiểu.</strong> Dán nguyên một tệp hoàn chỉnh từ video (hoặc từ AI) làm checkpoint đạt hôm nay, nhưng mai bạn không sửa nổi nó. Hãy tự gõ, cố tình làm hỏng một lần, và giải thích từng dòng trong nhật ký.</p></div>
<h3>Cần biết gì trước</h3>
<ul>
<li>JavaScript cơ bản: biến, hàm, mảng, đối tượng, <code>async/await</code>. TypeScript được giới thiệu dần trong khoá.</li>
<li>Terminal cơ bản (<code>cd</code>, <code>ls</code>, chạy một lệnh) và Git ở mức commit, push.</li>
<li>Một máy có Node 22, Git và Docker. Phần thực hành cuối bài này kiểm cả ba.</li>
<li>Mỗi bài giải thích lại ngay tại chỗ khái niệm nó cần, rồi dẫn link sang bài chuyên sâu ở khoá khác. Bạn sẽ không bị kẹt vì "cái đó dạy ở chỗ khác rồi".</li>
</ul>

<h3>Học xong bạn làm được…</h3>
<ul>
<li>Biến một ý tưởng mơ hồ thành user story, mô hình dữ liệu và danh sách API trước khi viết mã (Chương 1).</li>
<li>Dựng backend Express + TypeScript + PostgreSQL/Prisma có đăng ký, đăng nhập, JWT với xoay vòng refresh token, tải ảnh lên kho kiểu S3, bình luận, lượt thích và phân trang kiểu cursor (Chương 2–5).</li>
<li>Dựng frontend React đăng nhập, tự làm mới token âm thầm, đăng bài kèm xem trước ảnh; thêm bình luận tức thời bằng Socket.IO (Chương 6–7).</li>
<li>Test với cơ sở dữ liệu thật, đóng gói mọi thứ bằng Docker, chặn merge hỏng bằng CI, deploy lên VPS có tên miền và HTTPS, và lùi bản khi deploy hỏng (Chương 8–11).</li>
<li>Trả lời câu "cho xem một dự án bạn đã làm" bằng một địa chỉ web đang chạy, một repo sạch và một câu chuyện thật về con bug bạn đã sửa. Buổi phỏng vấn thực tập nào rồi cũng đi tới câu đó.</li>
</ul>

<h3>Bộ công nghệ này có thật không? Số liệu và hệ thống, có nguồn</h3>
<ul>
<li>Khảo sát Stack Overflow 2025, nhóm lập trình viên chuyên nghiệp: <strong>Node.js 49,1%</strong> và <strong>React 46,9%</strong> là hai công nghệ web được dùng nhiều nhất; Express 20,3%; Spring Boot 15,6%. <strong>PostgreSQL 58,2%</strong> là cơ sở dữ liệu được dùng nhiều nhất. <strong>Docker 73,8%</strong> là công cụ được dùng nhiều nhất.</li>
<li><strong>Notion</strong> chạy trên PostgreSQL; blog kỹ thuật của họ (06/10/2021) kể lại việc chia cơ sở dữ liệu thành nhiều mảnh (shard) khi một máy không còn đủ.</li>
<li><strong>Figma</strong> viết rằng năm 2020 họ chạy MỘT cơ sở dữ liệu Postgres, và hệ cơ sở dữ liệu đã lớn lên gần 100 lần kể từ đó — xử lý bằng bản sao đọc, chia theo nhóm bảng rồi shard.</li>
</ul>
<p>Ý ở đây không phải ChiaSe sẽ lớn bằng Figma. Ý là lựa chọn "nhàm chán" — một cơ sở dữ liệu quan hệ, một API HTTP, một frontend dựng bằng component — chính là thứ sản phẩm thật bắt đầu, và kỹ năng bạn học ở đây dùng thẳng được ở đó.</p>

<h3>Học kèm khoá nào</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Trước / song song</span><span class="lz-t">Git · JavaScript · terminal</span><span class="lz-d">Đủ để commit, push, chạy lệnh.</span></div>
<div class="lz-step"><span class="lz-k">Đào sâu khi đang làm</span><span class="lz-t">Node.js · Prisma · PostgreSQL · React</span><span class="lz-d">Mỗi chương dẫn link đúng bài.</span></div>
<div class="lz-step"><span class="lz-k">Chương 8–11</span><span class="lz-t">Testing · Docker · GitHub Actions · Deploy VPS</span><span class="lz-d">Dẫn link chỗ dùng; khoá này áp dụng chúng.</span></div>
<div class="lz-step"><span class="lz-k">Bản Java</span><span class="lz-t">Spring Boot</span><span class="lz-d">Hộp "Nếu làm bằng Spring Boot" ở mọi chương.</span></div>
</div>

${spring(false, 'Kế hoạch, mô hình dữ liệu, frontend, Docker, CI và deploy giống hệt. Chỉ tầng backend đổi: route Express thành @RestController, Prisma thành Spring Data JPA, migration của Prisma thành Flyway. Mỗi chương chỉ đúng bài Spring Boot tương ứng.', [
  ['sb-0-8-bat-dau-tai-day', 'Spring Boot — Bắt đầu tại đây'],
  ['sb-21-1-kien-truc-spa', 'Spring Boot Ch21 — React ↔ Spring Boot trọn vẹn'],
])}

<h3>🧪 Thực hành (10 phút) — kiểm máy</h3>
<div class="callout ok">
<ol>
<li>Mở terminal (Windows: PowerShell hoặc Git Bash; macOS/Linux: Terminal).</li>
<li>Chạy năm lệnh dưới đây và so với output trên máy của chúng tôi.</li>
<li>Node phải là <strong>22.12 trở lên trong dòng 22.x</strong> (Vite 8 và ESLint 10 đòi vậy). Docker phải trả lời mà không báo "permission denied".</li>
</ol>
<pre><code class="language-bash">node -v
npm -v
git --version
docker --version
docker compose version</code></pre>
<div class="out">$ node -v
v22.22.2
$ npm -v
10.9.7
$ git --version
git version 2.55.0
$ docker --version
Docker version 29.6.2, build dfc4efb
$ docker compose version
Docker Compose version v5.3.1</div>
<p><strong>Xong khi:</strong> cả năm lệnh in ra số phiên bản, và Node bắt đầu bằng <code>v22.</code>. Số của bạn có thể mới hơn — không sao.</p>
</div>
<details><summary>Kẹt? Cách sửa hay gặp</summary>
<ul>
<li><code>node: command not found</code> hoặc bản cũ: cài Node 22 LTS từ nodejs.org, hoặc dùng trình quản lý phiên bản (nvm trên macOS/Linux, nvm-windows hoặc fnm trên Windows), rồi mở terminal <em>mới</em>.</li>
<li><code>permission denied … docker.sock</code> trên Linux: thêm mình vào nhóm <code>docker</code> (<code>sudo usermod -aG docker $USER</code>) rồi đăng xuất/đăng nhập lại.</li>
<li>Windows: Docker Desktop cần bật WSL 2; mở Docker Desktop trước khi chạy lệnh.</li>
</ul>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">stack (bộ công nghệ)</span><span class="v">Tập công nghệ cùng nhau chạy một ứng dụng.</span></div>
  <div class="kv"><span class="k">full-stack</span><span class="v">Đưa được một tính năng qua mọi tầng: CSDL, API, giao diện, test, deploy.</span></div>
  <div class="kv"><span class="k">PERN</span><span class="v">PostgreSQL + Express + React + Node.js.</span></div>
  <div class="kv"><span class="k">checkpoint (điểm kiểm)</span><span class="v">Bài tự kiểm cuối chương: một lệnh chứng minh chương đó chạy đúng.</span></div>
  <div class="kv"><span class="k">tutorial hell</span><span class="v">"Địa ngục tutorial": xem hết video này tới video khác mà không bao giờ làm xong dự án của mình.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Khoá này xây một ứng dụng, ChiaSe, từ thư mục rỗng tới production; bạn tự gõ từng dòng.</li>
<li>Các từ viết tắt "stack": LAMP (1998, Kunze), MEAN (2013, Karpov); ta dùng PERN; SWP391 dùng React + Spring Boot + PostgreSQL — cùng hình dạng.</li>
<li>Chỗ khó của dự án là mối nối giữa các tầng và làm cho xong; checkpoint biến tiến độ thành thứ đo được.</li>
<li>Node.js, React, PostgreSQL và Docker đều đứng đầu nhóm của mình trong khảo sát lập trình viên chuyên nghiệp (Stack Overflow 2025).</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
