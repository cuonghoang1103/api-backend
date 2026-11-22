/**
 * Node.js — phần bổ sung "mở đầu 6 ý" cho hai bài Bắt đầu tại đây (22/11/2026, luật feedback-mo-dau-khoa-6-y).
 *   BAI1 (nodejs-0-0-start-here-1): (1) là gì + lịch sử (tóm, chi tiết ở 0.1) · (2) khác/quan hệ công nghệ lân cận · (3) nền cần trước
 *   BAI2 (nodejs-0-0-start-here-2): (4) học xong làm được gì, vị trí việc làm · (5) hệ thống lớn có NGUỒN · (6) học kèm/trước/sau
 *        + "học xong làm được gì" của dự án xuyên suốt + lời mời đăng ký (bài này mang cờ dangKyDuAn).
 * Nguồn ý (5) đã mở/kiểm 22/11/2026 — chỉ giữ blog kỹ thuật chính thức của chính công ty hoặc OpenJS Foundation:
 *   PayPal  — medium.com/paypal-engineering (blog kỹ thuật PayPal), "Node.js at PayPal", Jeff Harrell, 22/11/2013
 *   Netflix — openjsf.org/blog/from-streaming-to-studio-the-evolution-of-node-js-at-netflix (24/09/2020)
 *   LinkedIn— engineering.linkedin.com/nodejs/blazing-fast-nodejs-10-performance-tips-linkedin-mobile
 *   Uber    — uber.com/blog/uber-tech-stack-part-two (07/2016)
 * Chuỗi nháy kép thường (KHÔNG template literal) ⇒ không vướng luật backtick/gạch chéo của course-content-check.
 */

const lk = (href, ico, title, sub, cta) =>
  "<a class=\"link-card lien-ket-cheo\" href=\"" + href + "\"><span class=\"lc-ico\">" + ico + "</span><span class=\"lc-body\"><span class=\"lc-title\">" + title + "</span><span class=\"lc-sub\">" + sub + "</span></span><span class=\"lc-cta\">" + cta + " →</span></a>";
const nguon = (title, sub) => "<div class=\"link-card\"><span class=\"lc-ico\">📄</span><span class=\"lc-body\"><span class=\"lc-title\">" + title + "</span><span class=\"lc-sub\">" + sub + "</span></span></div>";

export const BAI1_EN = [
  "<h3>Where Node.js came from, in one paragraph</h3>",
  "<p>Until 2009 JavaScript lived only inside the browser. That year Ryan Dahl took V8 — the JavaScript engine of Google Chrome — joined it to an event loop and non-blocking I/O (later the libuv library), and presented the result at JSConf EU as <strong>Node.js</strong>. npm, its package manager, followed in 2010. Since 2019 the project is governed by the <strong>OpenJS Foundation</strong> and ships a new Long-Term Support (LTS) line every year; this course uses Node.js 22 LTS. Lesson 0.1 tells the story in detail, with the original talk.</p>",
  "<h3>Node.js and its neighbours: what it is, and what it is not</h3>",
  "<div class=\"kv-grid\">",
  "<div class=\"kv\"><span class=\"k\">Node.js vs the browser</span><span class=\"v\">Same language, same V8 engine. The browser gives you the DOM, window and a sandbox; Node gives you files (fs), network sockets (net, http), processes and environment variables — and no DOM. Code that touches document will not run in Node; code that reads a file will not run in a page.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Node.js vs Express / NestJS</span><span class=\"v\">Node is the runtime; Express (Chapter 5) and NestJS are frameworks that run on it. You learn Node first so a framework is a convenience, not magic.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Node.js vs Deno and Bun</span><span class=\"v\">Deno (2018, also by Ryan Dahl) is secure by default and runs TypeScript directly; Bun (1.0 in 2023) uses Apple’s JavaScriptCore engine and bundles a package manager and test runner. Both now run most npm packages. Node remains the default in job posts and production; everything you learn here transfers.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Node.js vs Spring Boot, PHP, Python</span><span class=\"v\">All of them build web backends. Java/Spring Boot traditionally gives each request a thread; Node serves many connections on one event loop, which is cheap for I/O-heavy APIs but punishes CPU-heavy work (Chapter 2 measures it). Choose by team and problem, not by fashion — Chapter 18 shows how.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Node.js vs Next.js</span><span class=\"v\">Next.js is a React framework whose server part runs on Node. Knowing Node is what lets you debug the server side of a Next.js app.</span></div>",
  "</div>",
  "<h3>What you should know before starting</h3>",
  "<p>Only basic programming in any language (variables, conditions, loops, functions — FPT’s PRF192 or PRO192 is enough). Chapter 1 rebuilds the JavaScript a backend needs. These help a lot, but are not required on day one:</p>",
  lk("/courses/web-foundations", "🌐", "Web Foundations", "HTML, HTTP, a first JavaScript page — what a request looks like from the browser side", "Open course"),
  lk("/courses/git", "🌿", "Git &amp; GitHub", "Your course project lives in a repository from milestone 1", "Open course"),
  lk("/courses/linux-bash", "🐧", "Linux &amp; Bash", "The terminal you will use for every command and, later, the server you deploy to", "Open course"),
  lk("/academy/courses/introduction-to-databases", "🗄️", "DBI202 — Introduction to Databases (Academy)", "SQL and table design before Chapter 7; or take the PostgreSQL course alongside", "Open subject"),
].join("\n");

export const BAI1_VI = [
  "<h3>Node.js ra đời thế nào, gói trong một đoạn</h3>",
  "<p>Tới năm 2009 JavaScript chỉ sống trong trình duyệt. Năm đó Ryan Dahl lấy V8 — engine JavaScript của Google Chrome — ghép với một vòng lặp sự kiện và I/O không chặn (sau này là thư viện libuv), rồi trình bày ở JSConf EU với tên <strong>Node.js</strong>. npm, trình quản lý gói, ra đời năm 2010. Từ 2019 dự án do <strong>OpenJS Foundation</strong> quản trị và mỗi năm ra một dòng hỗ trợ dài hạn (LTS); khoá này dùng Node.js 22 LTS. Bài 0.1 kể chi tiết, kèm bài nói gốc.</p>",
  "<h3>Node.js và các công nghệ lân cận: nó là gì, và không phải là gì</h3>",
  "<div class=\"kv-grid\">",
  "<div class=\"kv\"><span class=\"k\">Node.js và trình duyệt</span><span class=\"v\">Cùng ngôn ngữ, cùng engine V8. Trình duyệt cho bạn DOM, window và một hộp cát; Node cho bạn tệp (fs), socket mạng (net, http), tiến trình và biến môi trường — và không có DOM. Mã đụng tới document không chạy trong Node; mã đọc tệp không chạy trong trang web.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Node.js và Express / NestJS</span><span class=\"v\">Node là runtime; Express (Chương 5) và NestJS là framework chạy trên nó. Học Node trước thì framework là tiện ích, không phải phép màu.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Node.js, Deno và Bun</span><span class=\"v\">Deno (2018, cũng của Ryan Dahl) an toàn mặc định và chạy TypeScript trực tiếp; Bun (bản 1.0 năm 2023) dùng engine JavaScriptCore của Apple và gói sẵn trình quản lý gói lẫn bộ chạy test. Cả hai nay chạy được phần lớn gói npm. Node vẫn là mặc định trong tin tuyển dụng và production; mọi thứ học ở đây đều mang sang được.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Node.js và Spring Boot, PHP, Python</span><span class=\"v\">Tất cả đều dựng backend web. Java/Spring Boot truyền thống cấp mỗi request một luồng; Node phục vụ nhiều kết nối trên một event loop — rẻ cho API nặng I/O nhưng trừng phạt việc nặng CPU (Chương 2 đo điều đó). Chọn theo đội và bài toán, không theo trào lưu — Chương 18 chỉ cách.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Node.js và Next.js</span><span class=\"v\">Next.js là framework React có phần máy chủ chạy trên Node. Biết Node là thứ giúp bạn gỡ lỗi phía máy chủ của một app Next.js.</span></div>",
  "</div>",
  "<h3>Cần biết gì trước khi bắt đầu</h3>",
  "<p>Chỉ cần lập trình cơ bản ở một ngôn ngữ bất kỳ (biến, điều kiện, vòng lặp, hàm — học xong PRF192 hoặc PRO192 ở FPT là đủ). Chương 1 dựng lại phần JavaScript mà backend cần. Những khoá sau giúp rất nhiều, nhưng không bắt buộc ngay ngày đầu:</p>",
  lk("/courses/web-foundations", "🌐", "Web Foundations", "HTML, HTTP, trang JavaScript đầu tiên — request trông thế nào nhìn từ phía trình duyệt", "Mở khoá"),
  lk("/courses/git", "🌿", "Git &amp; GitHub", "Dự án cuối khoá của bạn nằm trong một repo ngay từ mốc 1", "Mở khoá"),
  lk("/courses/linux-bash", "🐧", "Linux &amp; Bash", "Terminal bạn dùng cho mọi lệnh, và sau này là server bạn deploy lên", "Mở khoá"),
  lk("/academy/courses/introduction-to-databases", "🗄️", "DBI202 — Nhập môn cơ sở dữ liệu (Academy)", "SQL và thiết kế bảng trước Chương 7; hoặc học song song khoá PostgreSQL", "Mở môn"),
].join("\n");

export const BAI2_EN = [
  "<h3>After the course: what you can do, and which jobs it leads to</h3>",
  "<p>You will be able to design, build, secure, test, measure and deploy a production-style REST API with PostgreSQL, Redis, background jobs and realtime — and explain every decision, which is what interviews test. Typical roles that ask for exactly this:</p>",
  "<div class=\"kv-grid\">",
  "<div class=\"kv\"><span class=\"k\">Backend Developer (Node.js)</span><span class=\"v\">Intern / fresher / junior: Express or NestJS, PostgreSQL or MongoDB, REST, auth, Docker.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Full-stack JavaScript</span><span class=\"v\">With React or Next.js on top (MERN / PERN stacks) — the most common combination in Vietnamese start-ups and outsourcing teams.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Mobile backend / API integration</span><span class=\"v\">The API behind a React Native or Flutter app (FPT’s MMA301), payment and third-party integrations.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Later: DevOps / platform</span><span class=\"v\">Chapters 15–17 (observability, performance, Docker, deploy) are the first step towards running systems, not only writing them.</span></div>",
  "</div>",
  "<h3>Who really runs Node.js — with the source</h3>",
  "<p>Only companies that described it themselves, on their own engineering blog or the foundation that governs Node. Dates matter: a stack described in 2013 may have changed since.</p>",
  "<div class=\"kv-grid\">",
  "<div class=\"kv\"><span class=\"k\">PayPal (2013)</span><span class=\"v\">Rebuilt its account overview page in Node.js alongside a Java version and announced that its consumer-facing web applications would be built on Node.js.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Netflix (2020)</span><span class=\"v\">Its Node.js platform (NodeQuark) authenticates and routes requests for the streaming UI, and was later restructured into plugins for studio/production apps.</span></div>",
  "<div class=\"kv\"><span class=\"k\">LinkedIn (2011)</span><span class=\"v\">The server behind its mobile apps was a tier of Node.js servers; the team published its performance lessons.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Uber (2016)</span><span class=\"v\">The marketplace systems that receive real-time pings from riders and drivers and match them were written in Node.js and Go; its web tier ran on Node.js with Express.</span></div>",
  "<div class=\"kv\"><span class=\"k\">This website (today)</span><span class=\"v\">cuongthai.com runs Node.js + Express + TypeScript, PostgreSQL through Prisma, Redis and Socket.IO in Docker — the exact stack of this course.</span></div>",
  "</div>",
  nguon("PayPal Technology Blog — “Node.js at PayPal” (Jeff Harrell, 2013)", "medium.com/paypal-engineering/node-js-at-paypal-4e2d1d08ce4f"),
  nguon("OpenJS Foundation — “From streaming to studio: the evolution of Node.js at Netflix” (2020)", "openjsf.org/blog/from-streaming-to-studio-the-evolution-of-node-js-at-netflix"),
  nguon("LinkedIn Engineering — “Blazing fast node.js: 10 performance tips from LinkedIn Mobile”", "engineering.linkedin.com/nodejs/blazing-fast-nodejs-10-performance-tips-linkedin-mobile"),
  nguon("Uber Blog — “The Uber Engineering Tech Stack, Part II: The Edge and Beyond” (2016)", "uber.com/blog/uber-tech-stack-part-two"),
  "<h3>What to take before, alongside and after this course</h3>",
  "<div class=\"kv-grid\">",
  "<div class=\"kv\"><span class=\"k\">Before</span><span class=\"v\">Web Foundations, Git, Linux &amp; Bash (see the previous lesson).</span></div>",
  "<div class=\"kv\"><span class=\"k\">Alongside</span><span class=\"v\">PostgreSQL (Chapter 7 goes deeper there), TypeScript (types for the same code), API Design, Authentication, Testing.</span></div>",
  "<div class=\"kv\"><span class=\"k\">After</span><span class=\"v\">Redis, Socket.IO and Docker in depth, Deploy to a VPS, GitHub Actions, Observability, System Design; React or Next.js for the frontend; Spring Boot as a second backend.</span></div>",
  "<div class=\"kv\"><span class=\"k\">For an FPT SE student majoring in Node.js</span><span class=\"v\">This is the backbone of SDN302 (Node + Express + MongoDB — this course adds PostgreSQL, security and production depth), the API for MMA301, and the backend of the WDP301 capstone.</span></div>",
  "</div>",
  lk("/courses/postgresql", "🐘", "PostgreSQL", "The database of this course, from zero to production", "Open course"),
  lk("/courses/typescript", "🔷", "TypeScript", "Types for the same backend code — most Node job posts expect it", "Open course"),
  lk("/academy/courses/server-side-development-nodejs-express-mongodb", "🎓", "SDN302 — Server-side development with Node.js, Express, MongoDB (Academy)", "The school subject this course supports; same Express core, MongoDB instead of PostgreSQL", "Open subject"),
  lk("/courses/spring-boot", "🍃", "Spring Boot", "After Node: the same ideas in Java, compared side by side", "Open course"),
  "<h3>🎯 Your course project</h3>",
  "<p>Lessons build the Notes API together with you; alongside it you build <strong>your own backend on a topic you choose</strong> — clinic booking, canteen ordering, a team task board, a boarding-house manager, event tickets with seat holds, a campus library, or your own idea reviewed by AI. After every chapter a milestone applies exactly that chapter to your topic, with a minimal example that was really run; at the end you deploy it and defend it in front of an AI committee scored on a 10-point rubric. The finished, live project is what you put on your CV.</p>",
  "<p><strong>Register the topic of your course project below.</strong></p>",
].join("\n");

export const BAI2_VI = [
  "<h3>Học xong làm được gì, và dẫn tới công việc nào</h3>",
  "<p>Bạn sẽ tự thiết kế, xây, bảo mật, kiểm thử, đo và deploy một REST API kiểu production với PostgreSQL, Redis, tác vụ nền và realtime — và giải thích được mọi quyết định, đúng thứ phỏng vấn kiểm tra. Những vị trí hay đòi đúng các kỹ năng này:</p>",
  "<div class=\"kv-grid\">",
  "<div class=\"kv\"><span class=\"k\">Backend Developer (Node.js)</span><span class=\"v\">Thực tập / fresher / junior: Express hoặc NestJS, PostgreSQL hoặc MongoDB, REST, xác thực, Docker.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Full-stack JavaScript</span><span class=\"v\">Thêm React hoặc Next.js phía trên (stack MERN / PERN) — tổ hợp phổ biến nhất ở start-up và công ty outsource tại Việt Nam.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Backend cho mobile / tích hợp API</span><span class=\"v\">API phía sau app React Native hay Flutter (môn MMA301 ở FPT), tích hợp thanh toán và dịch vụ bên thứ ba.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Về sau: DevOps / platform</span><span class=\"v\">Chương 15–17 (quan sát hệ thống, hiệu năng, Docker, deploy) là bước đầu để vận hành hệ thống, không chỉ viết mã.</span></div>",
  "</div>",
  "<h3>Ai đang chạy Node.js thật — kèm nguồn</h3>",
  "<p>Chỉ nêu công ty tự mô tả điều đó trên blog kỹ thuật của chính họ hoặc của tổ chức quản trị Node. Để ý năm: một stack mô tả năm 2013 có thể đã đổi.</p>",
  "<div class=\"kv-grid\">",
  "<div class=\"kv\"><span class=\"k\">PayPal (2013)</span><span class=\"v\">Dựng lại trang tổng quan tài khoản bằng Node.js song song một bản Java, rồi công bố các ứng dụng web cho người dùng sẽ xây trên Node.js.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Netflix (2020)</span><span class=\"v\">Nền tảng Node.js của họ (NodeQuark) xác thực và định tuyến request cho giao diện xem phim, sau đó được tách thành plugin cho các app phục vụ sản xuất phim.</span></div>",
  "<div class=\"kv\"><span class=\"k\">LinkedIn (2011)</span><span class=\"v\">Máy chủ phía sau app di động của họ là một tầng server Node.js; đội ngũ công bố các bài học hiệu năng rút ra.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Uber (2016)</span><span class=\"v\">Hệ thống marketplace nhận tín hiệu thời gian thực từ khách và tài xế rồi ghép cặp được viết bằng Node.js và Go; tầng web chạy Node.js với Express.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Chính website này (hôm nay)</span><span class=\"v\">cuongthai.com chạy Node.js + Express + TypeScript, PostgreSQL qua Prisma, Redis và Socket.IO trong Docker — đúng stack của khoá này.</span></div>",
  "</div>",
  nguon("PayPal Technology Blog — “Node.js at PayPal” (Jeff Harrell, 2013)", "medium.com/paypal-engineering/node-js-at-paypal-4e2d1d08ce4f"),
  nguon("OpenJS Foundation — “From streaming to studio: the evolution of Node.js at Netflix” (2020)", "openjsf.org/blog/from-streaming-to-studio-the-evolution-of-node-js-at-netflix"),
  nguon("LinkedIn Engineering — “Blazing fast node.js: 10 performance tips from LinkedIn Mobile”", "engineering.linkedin.com/nodejs/blazing-fast-nodejs-10-performance-tips-linkedin-mobile"),
  nguon("Uber Blog — “The Uber Engineering Tech Stack, Part II: The Edge and Beyond” (2016)", "uber.com/blog/uber-tech-stack-part-two"),
  "<h3>Học trước, học kèm và học sau khoá nào</h3>",
  "<div class=\"kv-grid\">",
  "<div class=\"kv\"><span class=\"k\">Trước</span><span class=\"v\">Web Foundations, Git, Linux &amp; Bash (xem bài trước).</span></div>",
  "<div class=\"kv\"><span class=\"k\">Học kèm</span><span class=\"v\">PostgreSQL (Chương 7 đào sâu ở đó), TypeScript (kiểu cho chính đoạn mã này), API Design, Authentication, Testing.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Sau</span><span class=\"v\">Redis, Socket.IO và Docker chuyên sâu, Deploy lên VPS, GitHub Actions, Observability, System Design; React hoặc Next.js cho frontend; Spring Boot làm backend thứ hai.</span></div>",
  "<div class=\"kv\"><span class=\"k\">Với sinh viên SE FPT chuyên ngành hẹp Node.js</span><span class=\"v\">Đây là xương sống của SDN302 (Node + Express + MongoDB — khoá này thêm PostgreSQL, bảo mật và chiều sâu production), là API cho MMA301, và là backend của đồ án WDP301.</span></div>",
  "</div>",
  lk("/courses/postgresql", "🐘", "PostgreSQL", "Cơ sở dữ liệu của khoá này, từ số 0 tới production", "Mở khoá"),
  lk("/courses/typescript", "🔷", "TypeScript", "Kiểu cho chính mã backend — đa số tin tuyển Node đòi có", "Mở khoá"),
  lk("/academy/courses/server-side-development-nodejs-express-mongodb", "🎓", "SDN302 — Phát triển phía máy chủ với Node.js, Express, MongoDB (Academy)", "Môn ở trường mà khoá này hỗ trợ; cùng lõi Express, MongoDB thay cho PostgreSQL", "Mở môn"),
  lk("/courses/spring-boot", "🍃", "Spring Boot", "Sau Node: cùng các ý đó bằng Java, so sánh từng chỗ", "Mở khoá"),
  "<h3>🎯 Dự án cuối khoá của bạn</h3>",
  "<p>Bài học cùng bạn xây Notes API; song song đó bạn xây <strong>backend của riêng mình theo đề tài tự chọn</strong> — đặt lịch phòng khám, đặt món căng tin, bảng công việc nhóm, quản lý nhà trọ, bán vé sự kiện có giữ chỗ, thư viện trường, hoặc ý tưởng của bạn được AI xét duyệt. Sau mỗi chương có một mốc áp đúng kiến thức chương đó vào đề tài, kèm ví dụ tối thiểu đã chạy thật; cuối khoá bạn deploy và bảo vệ trước hội đồng AI, chấm thang 10 điểm. Dự án hoàn chỉnh, chạy trên mạng chính là thứ bạn ghi vào CV.</p>",
  "<p><strong>Hãy đăng ký đề tài dự án cuối khoá của bạn ở bên dưới.</strong></p>",
].join("\n");
