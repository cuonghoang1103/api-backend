/**
 * INT610 — AI Recruitment Screening (Kỳ 6 — Thực tập, project #10).
 * Full-stack: Next.js 14 (App Router + Route Handlers) + Prisma + PostgreSQL + an LLM API.
 * Two roles: CANDIDATE (apply, upload CV, track status) + RECRUITER (define a rubric,
 * see AI-scored shortlist, make the final decision). Crown jewel = STRUCTURED LLM
 * EXTRACTION + human-in-the-loop: the LLM reads a CV → strict JSON validated by zod;
 * the model SUGGESTS, the recruiter DECIDES (APPLIED→SCREENED→SHORTLISTED→REJECTED).
 * Includes a fairness/bias & auditability chapter. LLM key stays server-side (Route Handler proxy).
 * Song ngữ EN/VN đối xứng. Code Next/TS/Prisma/zod <pre>+.tok-*; ví dụ giải từng bước + ★.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/INT610.mjs --apply
 * ⚠️ Escaping: backtick trong code = &#96; ; ${...} (template literal/env) = \${ ; quiz apostrophe = \' hoặc bọc nháy kép.
 */
export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    academyType: 'FPT',
    courseCode: 'INT610',
    title: 'AI Recruitment Screening',
    slug: 'ai-recruitment-screening',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Internship project #10 — build an AI recruitment-screening web app: Next.js 14 Route Handlers, Prisma + PostgreSQL, JWT and two roles. An LLM turns each CV into strict JSON validated by zod — the model suggests, the recruiter decides. Ship with Docker.|||Đồ án thực tập #10 — web sàng lọc tuyển dụng bằng AI: Next.js 14 Route Handlers, Prisma + PostgreSQL, JWT và hai vai trò. Một LLM biến mỗi CV thành JSON nghiêm ngặt được zod kiểm — model gợi ý, nhà tuyển dụng quyết định. Ship bằng Docker.',
    description: 'INT610 là đồ án thực tập xoay quanh AI thực dụng: bạn xây một hệ thống SÀNG LỌC TUYỂN DỤNG (AI Recruitment Screening) hoàn chỉnh. Ứng viên (CANDIDATE) nộp đơn và tải CV; nhà tuyển dụng (RECRUITER) định nghĩa một bộ rubric cho vị trí, rồi bấm "sàng lọc bằng AI": một LLM đọc CV và trả về JSON NGHIÊM NGẶT — danh sách kỹ năng, số năm kinh nghiệm, và điểm cho từng tiêu chí rubric — được kiểm bằng schema zod. Điểm mấu chốt: MÔ HÌNH CHỈ GỢI Ý, NHÀ TUYỂN DỤNG MỚI QUYẾT ĐỊNH. Trạng thái đơn đi theo pipeline APPLIED→SCREENED→SHORTLISTED→REJECTED và chỉ recruiter được dịch chuyển nó — AI không bao giờ tự loại ai. Toàn bộ viết bằng Next.js 14 (App Router + Route Handlers), dữ liệu trong PostgreSQL qua Prisma; khoá LLM nằm SERVER-SIDE trong một Route Handler proxy (không bao giờ NEXT_PUBLIC_). Đồ án có cả một chương về CÔNG BẰNG & THIÊN KIẾN (fairness/bias) và tính KIỂM TOÁN được — góc "AI có trách nhiệm" mà hội đồng rất thích. Cuối cùng đóng gói bằng Docker và viết kịch bản demo. Đây là mẫu "AI product có human-in-the-loop" mà mọi startup dùng LLM đều tái dùng.',
    whatYouLearn: 'Thiết kế domain & schema cho nghiệp vụ tuyển dụng (User/Job/Criterion/Application/Screening/CriterionScore) với ràng buộc @@unique chống nộp trùng; dựng Next.js 14 App Router + Route Handlers theo kiến trúc phân lớp route→service→Prisma; JWT auth + phân quyền hai vai trò CANDIDATE/RECRUITER (kèm kiểm quyền sở hữu); LÕI: gọi LLM qua một Route Handler proxy server-side, ép mô hình trả JSON và kiểm bằng zod với vòng retry khi validation fail; hiểu vì sao schema bảo đảm HÌNH DẠNG chứ không bảo đảm SỰ THẬT — hallucination có kiểu đúng vẫn cần con người; state machine trạng thái đơn với transition guard (chỉ recruiter dịch chuyển); tải CV; recruiter dashboard xem shortlist đã chấm; CÔNG BẰNG, THIÊN KIẾN & KIỂM TOÁN (vì sao AI không được tự loại, lưu vết quyết định); kiểm thử (unit + route + một test chứng minh AI không tự đổi trạng thái) và đóng gói Docker; cùng một kịch bản quay video demo chuyên nghiệp.',
    requirements: 'Nên đã học FER202 (React), PRJ301/WED201c (web) và DBI202 (CSDL/SQL). Cần: Node.js LTS (20+), VS Code, Docker Desktop (để chạy Postgres), Prisma CLI, một client test API (Postman hoặc REST Client), một tài khoản GitHub, và MỘT KHOÁ LLM API để làm biến môi trường server (KHÔNG đặt là NEXT_PUBLIC_). Không cần cài PostgreSQL trực tiếp — chạy bằng Docker.',
    documentsNote: 'Tham chiếu: Next.js docs (nextjs.org/docs — App Router & Route Handlers) • Prisma docs (prisma.io/docs) • zod docs (zod.dev) • PostgreSQL Documentation • jwt.io • tài liệu API của nhà cung cấp LLM bạn chọn (đọc mục JSON/structured output). Công cụ: VS Code, Postman, DBeaver/pgAdmin, Docker Desktop, draw.io (ERD). Luyện code: track Code Lab Next.js + React + Prisma ORM + Authentication + REST APIs. Git & Docker: Exp Hub. Đây là project-course thực tập — vừa xây vừa quay video theo kịch bản ở bài 0.5. AI CÓ TRÁCH NHIỆM: mô hình gợi ý, con người quyết định.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Project Guide|||Mục 0 — Giới thiệu đồ án & Hướng dẫn',
      description: 'Đọc trước tiên: xây gì, kiến trúc client–server–LLM, tech stack & lý do chọn, cài môi trường, và kịch bản quay video demo.',
      lessons: [
        {
          title: '0.1 — What you will build & the architecture map|||0.1 — Bạn sẽ xây gì & bản đồ kiến trúc',
          slug: 'int610-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: một web sàng lọc CV bằng AI có human-in-the-loop, kiến trúc client–server–LLM, và bản đồ từ schema tới Docker.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What you will build — AI Recruitment Screening</h2>
<p class="lead">This is an <strong>internship project</strong>, not a lecture. You will build one real, deployable web application: an <strong>AI recruitment-screening system</strong> where a candidate applies and uploads a CV, and a recruiter defines a scoring rubric and gets an <strong>AI-scored shortlist</strong> — but the AI only <strong>suggests</strong>; the recruiter makes every final decision. By the end you have a running full-stack app, tested and shipped in Docker, plus a recorded demo.</p>
<p>This is the template every LLM product reuses: an authenticated app over a relational database, a <strong>server-side LLM proxy</strong> that turns messy text into <strong>strict, schema-validated JSON</strong>, and a <strong>human-in-the-loop</strong> so a model never takes an irreversible action on its own. Master this one and every "AI-powered X" is a re-skin.</p>

<h3>The system in one picture — client / server / LLM / database</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Next.js UI (browser)</div><div class="lz-d">apply · upload CV · recruiter dashboard</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Route Handlers (server)</div><div class="lz-d">auth · Prisma · LLM proxy + zod</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">LLM API</div><div class="lz-d">reads CV → JSON (server key only)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">PostgreSQL</div><div class="lz-d">users · jobs · applications · screenings</div></div>
</div>
<div class="diagram">Browser ──fetch/JSON──▶ Route Handler ──Prisma──▶ PostgreSQL
 (Next.js)             (server, port 3000)         (port 5432)
                            │  ▲
                    LLM_API_KEY (server env only)
                            ▼  │  strict JSON, zod-validated
                        LLM API endpoint</div>

<h3>The build roadmap — your whole internship sprint</h3>
<div class="lz-map">
  <div class="lz-stage">Design</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Domain &amp; database design</div><div class="lz-nsub">Roles &amp; use cases · ERD · Prisma schema · the @@unique that prevents double-applying</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Next.js Route Handlers &amp; layers</div><div class="lz-nsub">route → service → Prisma · DTO &amp; validation</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Auth &amp; roles (JWT)</div><div class="lz-nsub">Register/login · Candidate vs Recruiter · ownership</div></div></div>
  <div class="lz-stage">The core · AI</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Structured LLM extraction + human-in-the-loop</div><div class="lz-nsub">CV → strict JSON · zod validate + retry · pipeline · fairness &amp; audit</div></div></div>
  <div class="lz-stage">Frontend</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">The React UI</div><div class="lz-nsub">Auth context · apply/upload screen · recruiter dashboard</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">unit · route · a test proving the AI never auto-decides</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Deployment</div><div class="lz-nsub">Docker Compose: web + db · env config · smoke test</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Streaming · caching · rate limits · CI</div><div class="lz-nsub">Ship like a real AI team</div></div></div>
</div>

<div class="callout ok">The one habit that decides your grade: <strong>ship a thin vertical slice first</strong> — apply → upload CV → recruiter screens it → JSON appears → recruiter shortlists — then grow it. A tiny end-to-end flow that runs beats a huge design that never compiles.</div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610#module-374" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Practice Next.js foundations on Code Lab</span><span class="lc-sub">App Router, pages and layouts before you start the project.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bạn sẽ xây gì — Sàng lọc tuyển dụng bằng AI</h2>
<p class="lead">Đây là một <strong>đồ án thực tập</strong>, không phải bài giảng. Bạn sẽ xây một ứng dụng web thật, triển khai được: <strong>hệ thống sàng lọc tuyển dụng bằng AI</strong>, nơi ứng viên nộp đơn và tải CV, còn nhà tuyển dụng định nghĩa một rubric chấm điểm và nhận một <strong>shortlist đã được AI chấm</strong> — nhưng AI chỉ <strong>gợi ý</strong>; nhà tuyển dụng ra mọi quyết định cuối. Kết thúc, bạn có một app full-stack chạy được, đã test và đóng gói Docker, kèm một video demo.</p>
<p>Đây là bộ khung mà mọi sản phẩm LLM tái dùng: một app có xác thực trên CSDL quan hệ, một <strong>LLM proxy phía server</strong> biến văn bản lộn xộn thành <strong>JSON nghiêm ngặt, đã kiểm bằng schema</strong>, và một <strong>human-in-the-loop</strong> để mô hình không bao giờ tự làm một hành động không thể hoàn tác. Làm chủ cái này thì mọi "X có AI" chỉ là "thay áo".</p>

<h3>Hệ thống trong một bức tranh — client / server / LLM / CSDL</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Giao diện Next.js (trình duyệt)</div><div class="lz-d">nộp đơn · tải CV · dashboard tuyển dụng</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Route Handlers (server)</div><div class="lz-d">auth · Prisma · LLM proxy + zod</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">LLM API</div><div class="lz-d">đọc CV → JSON (chỉ khoá server)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">PostgreSQL</div><div class="lz-d">users · jobs · applications · screenings</div></div>
</div>
<div class="diagram">Trình duyệt ─fetch/JSON─▶ Route Handler ─Prisma─▶ PostgreSQL
 (Next.js)               (server, cổng 3000)       (cổng 5432)
                              │  ▲
                    LLM_API_KEY (chỉ env server)
                              ▼  │  JSON nghiêm ngặt, zod kiểm
                          endpoint LLM API</div>

<h3>Lộ trình xây dựng — cả sprint thực tập của bạn</h3>
<div class="lz-map">
  <div class="lz-stage">Thiết kế</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế domain &amp; CSDL</div><div class="lz-nsub">Vai trò &amp; use case · ERD · Prisma schema · @@unique chống nộp trùng</div></div></div>
  <div class="lz-stage">Backend</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Route Handlers Next.js &amp; các lớp</div><div class="lz-nsub">route → service → Prisma · DTO &amp; validation</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Xác thực &amp; vai trò (JWT)</div><div class="lz-nsub">Đăng ký/đăng nhập · Ứng viên vs Nhà tuyển dụng · quyền sở hữu</div></div></div>
  <div class="lz-stage">Lõi · AI</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Trích xuất LLM có cấu trúc + human-in-the-loop</div><div class="lz-nsub">CV → JSON nghiêm ngặt · zod kiểm + retry · pipeline · công bằng &amp; kiểm toán</div></div></div>
  <div class="lz-stage">Frontend</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Giao diện React</div><div class="lz-nsub">Auth context · màn hình nộp/tải CV · dashboard tuyển dụng</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">unit · route · một test chứng minh AI không tự quyết định</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Triển khai</div><div class="lz-nsub">Docker Compose: web + db · cấu hình env · smoke test</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Streaming · cache · rate limit · CI</div><div class="lz-nsub">Ship như một đội AI thật</div></div></div>
</div>

<div class="callout ok">Thói quen quyết định điểm số: <strong>ship một lát cắt dọc mỏng trước</strong> — nộp đơn → tải CV → recruiter sàng lọc → JSON hiện ra → recruiter shortlist — rồi mới mở rộng. Một luồng nhỏ chạy được từ đầu đến cuối hơn hẳn một bản thiết kế đồ sộ không bao giờ biên dịch.</div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610#module-374" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Luyện nền tảng Next.js trên Code Lab</span><span class="lc-sub">App Router, page và layout trước khi bắt đầu đồ án.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Scope, roles & acceptance criteria|||0.2 — Phạm vi, vai trò & tiêu chí nghiệm thu',
          slug: 'int610-pham-vi',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Đúng phạm vi để làm xong: 2 vai trò, lõi AI có human-in-the-loop, và bảng tiêu chí nghiệm thu bạn tự chấm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Scope, roles &amp; acceptance criteria</h2>
<p class="lead">The fastest way to fail an internship project is to build too much and finish nothing. Lock the scope now: <strong>two roles, one AI-screening core with a human in the loop, a handful of screens</strong>. Everything else is optional polish.</p>

<h3>Two roles — that is enough for real access control</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CANDIDATE</span><span class="v">Register/login · browse open jobs · apply once per job · upload a CV · track own application status</span></div>
  <div class="kv"><span class="k">RECRUITER</span><span class="v">Login · post a job + define a rubric · run AI screening on an application · read the AI JSON · shortlist or reject (the final call)</span></div>
</div>

<h3>The core workflow — your vertical slice</h3>
<div class="diagram">CANDIDATE applies + uploads CV ──▶ Application status = APPLIED
        │
        ▼
RECRUITER clicks "Screen with AI" ──▶ LLM reads CV ──▶ strict JSON (zod-checked)
        │                                     status = SCREENED  (NOT auto-decided)
        ▼
RECRUITER reads scores ──▶ SHORTLISTED  or  REJECTED   ← only a human moves it here</div>

<h3>Acceptance criteria — grade yourself before the demo</h3>
<table>
<thead><tr><th>#</th><th>Must pass</th><th>How to check</th></tr></thead>
<tbody>
<tr><td>1</td><td>A candidate can register, log in, and receive a JWT</td><td>POST /api/auth/register then /api/auth/login returns a token</td></tr>
<tr><td>2</td><td>A candidate applies once per job and uploads a CV</td><td>a second apply to the same job → 409 Conflict</td></tr>
<tr><td>3</td><td>Only a RECRUITER can run AI screening</td><td>CANDIDATE calling the screen endpoint → 403</td></tr>
<tr><td>4</td><td>The AI returns JSON validated by a zod schema</td><td>an out-of-range score is rejected/retried, never stored</td></tr>
<tr><td>5</td><td><b>The AI never auto-shortlists or auto-rejects</b></td><td>after screening, status is SCREENED — only a recruiter action changes it</td></tr>
<tr><td>6</td><td>A candidate sees only their own applications</td><td>reading another user&#39;s application → 403</td></tr>
<tr><td>7</td><td>The whole system runs from one <code>docker compose up</code></td><td>web on :3000, db healthy, LLM key from env</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Scope killers — say no.</strong> Training your own model, parsing every CV file format perfectly, real ATS integrations, auto-emailing candidates, ranking thousands of CVs. Screen plain-text or a single PDF field; simulate emails with a log line. Depth on the AI-extraction + human-in-the-loop core scores; breadth with nothing finished does not.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write acceptance criteria as tests, not prose.</b> Each row above maps to one automated test (you write them in Section 6). Criterion #5 — "the AI never auto-decides" — becomes an assertion that status stays SCREENED after screening. "Definition of Done = the tests are green" removes every argument about whether a feature works. <em>Why beyond syllabus: turning a responsible-AI rule into an executable spec is exactly how serious teams gate an AI release.</em></div>

<div class="note-ct">Next: <b>0.3</b> justifies the tech stack, <b>0.4</b> installs it, <b>0.5</b> is your video-demo script.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Phạm vi, vai trò &amp; tiêu chí nghiệm thu</h2>
<p class="lead">Cách nhanh nhất để trượt một đồ án thực tập là ôm quá nhiều rồi chẳng xong cái gì. Chốt phạm vi ngay: <strong>hai vai trò, một lõi sàng lọc AI có con người trong vòng lặp, vài màn hình</strong>. Mọi thứ khác chỉ là tô điểm tuỳ chọn.</p>

<h3>Hai vai trò — đủ để có phân quyền thật</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ỨNG VIÊN</span><span class="v">Đăng ký/đăng nhập · xem vị trí đang mở · nộp một lần mỗi vị trí · tải CV · theo dõi trạng thái đơn của mình</span></div>
  <div class="kv"><span class="k">NHÀ TUYỂN DỤNG</span><span class="v">Đăng nhập · đăng vị trí + định nghĩa rubric · chạy sàng lọc AI trên một đơn · đọc JSON của AI · shortlist hoặc loại (quyết định cuối)</span></div>
</div>

<h3>Luồng lõi — lát cắt dọc của bạn</h3>
<div class="diagram">ỨNG VIÊN nộp đơn + tải CV ──▶ trạng thái đơn = APPLIED
        │
        ▼
NHÀ TUYỂN DỤNG bấm "Sàng lọc bằng AI" ─▶ LLM đọc CV ─▶ JSON nghiêm ngặt (zod kiểm)
        │                                     trạng thái = SCREENED  (KHÔNG tự quyết)
        ▼
NHÀ TUYỂN DỤNG đọc điểm ──▶ SHORTLISTED  hoặc  REJECTED   ← chỉ con người đổi tới đây</div>

<h3>Tiêu chí nghiệm thu — tự chấm trước khi demo</h3>
<table>
<thead><tr><th>#</th><th>Phải đạt</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>1</td><td>Ứng viên đăng ký, đăng nhập, nhận JWT</td><td>POST /api/auth/register rồi /api/auth/login trả token</td></tr>
<tr><td>2</td><td>Ứng viên nộp một lần mỗi vị trí và tải CV</td><td>nộp lần hai cùng vị trí → 409 Conflict</td></tr>
<tr><td>3</td><td>Chỉ NHÀ TUYỂN DỤNG được chạy sàng lọc AI</td><td>ỨNG VIÊN gọi endpoint sàng lọc → 403</td></tr>
<tr><td>4</td><td>AI trả JSON được kiểm bằng schema zod</td><td>một điểm ngoài khoảng bị từ chối/retry, không bao giờ lưu</td></tr>
<tr><td>5</td><td><b>AI không bao giờ tự shortlist hay tự loại</b></td><td>sau sàng lọc, trạng thái là SCREENED — chỉ hành động của recruiter mới đổi</td></tr>
<tr><td>6</td><td>Ứng viên chỉ thấy đơn của chính mình</td><td>đọc đơn của người khác → 403</td></tr>
<tr><td>7</td><td>Cả hệ chạy từ một lệnh <code>docker compose up</code></td><td>web ở :3000, db healthy, khoá LLM lấy từ env</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Những thứ giết scope — nói không.</strong> Tự huấn luyện mô hình, parse hoàn hảo mọi định dạng file CV, tích hợp ATS thật, tự gửi email ứng viên, xếp hạng hàng nghìn CV. Hãy sàng lọc văn bản thuần hoặc một trường PDF; giả lập email bằng một dòng log. Sâu ở lõi trích xuất AI + human-in-the-loop mới ăn điểm; ôm rộng mà chẳng xong thì không.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết tiêu chí nghiệm thu thành test, đừng viết văn.</b> Mỗi dòng ở bảng trên ứng với một test tự động (bạn viết ở Mục 6). Dòng #5 — "AI không bao giờ tự quyết" — trở thành một assertion rằng trạng thái vẫn là SCREENED sau khi sàng lọc. "Định nghĩa Hoàn thành = test xanh" xoá mọi tranh cãi về việc một tính năng có chạy hay không. <em>Vì sao ngoài syllabus: biến một quy tắc AI-có-trách-nhiệm thành đặc tả chạy được chính là cách đội nghiêm túc "gác cổng" một bản phát hành AI.</em></div>

<div class="note-ct">Tiếp theo: <b>0.3</b> lý giải tech stack, <b>0.4</b> cài đặt, <b>0.5</b> là kịch bản quay video demo.</div>
</div>
`,
        },
        {
          title: '0.3 — The tech stack & why each choice|||0.3 — Tech stack & lý do chọn từng thứ',
          slug: 'int610-tech-stack',
          type: 'VIDEO',
          description: 'Chọn Next.js + Prisma + PostgreSQL + zod + một LLM API — và biết vì sao, để trả lời hội đồng khi bị hỏi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The tech stack &amp; why each choice</h2>
<p class="lead">A reviewer will ask "why this stack?". Have a real answer. Every choice below is picked because it is <strong>mainstream, hireable, and keeps the LLM key on the server</strong> where it belongs.</p>

<h3>The stack, layer by layer</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Frontend + backend — Next.js 14 (App Router)</b><br/>One framework for the React UI <em>and</em> the server API (Route Handlers). <em>Why: you write UI and secure server code in one repo; the LLM proxy lives on the server so the key never reaches the browser.</em></div>
  <div class="lz-layer"><b>Server API — Route Handlers</b><br/>Files like <code>app/api/screenings/route.ts</code> run only on the server. <em>Why: this is where we call the LLM and read <code>process.env.LLM_API_KEY</code> — impossible to leak to the client.</em></div>
  <div class="lz-layer"><b>Validation — zod</b><br/>A TypeScript-first schema library. <em>Why: the LLM returns text; zod turns that text into a typed, range-checked object or a precise error — the backbone of "structured extraction".</em></div>
  <div class="lz-layer"><b>Persistence — Prisma + PostgreSQL 16</b><br/>Type-safe ORM over a real ACID database. <em>Why: <code>@@unique</code> stops double-applying; transactions keep a screening write atomic; Postgres is the industry default.</em></div>
  <div class="lz-layer"><b>AI — an LLM API (server-side)</b><br/>Any provider with a JSON/structured-output mode. <em>Why: the model does the reading; your job is to constrain it, validate it, and keep a human in charge.</em></div>
  <div class="lz-layer"><b>Ship — Docker Compose</b><br/>web + db by one command, key injected at run time. <em>Why: "runs on my machine" becomes "runs anywhere"; graders love a one-command demo.</em></div>
</div>

<h3>The request journey — how a CV becomes a shortlist</h3>
<div class="diagram">Recruiter clicks "Screen"  →  fetch POST /api/screenings  (JWT cookie)
   →  Route Handler checks role = RECRUITER
   →  load CV text + rubric via Prisma
   →  call LLM with a JSON-only prompt   (LLM_API_KEY, server env)
   →  zod.safeParse(model output)  →  ok? store : retry once
   →  Prisma: create Screening, set Application.status = SCREENED
   →  201 Created  →  UI shows scores; recruiter decides next</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The key never touches <code>NEXT_PUBLIC_</code>.</b> Any variable prefixed <code>NEXT_PUBLIC_</code> is inlined into the browser bundle at build time — shipping your LLM key to every visitor. Third-party keys stay server-only and are read inside a Route Handler. This single rule is the difference between a safe app and a leaked-credentials incident. <em>Why beyond syllabus: client/server secret boundaries are an operational-security concern the syllabus rarely drills.</em></div>

<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610#module-367" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">Brush up React fundamentals on Code Lab</span><span class="lc-sub">Components, hooks and state — the UI half of this project.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Tech stack &amp; lý do chọn từng thứ</h2>
<p class="lead">Hội đồng sẽ hỏi "sao chọn stack này?". Hãy có câu trả lời thật. Mọi lựa chọn dưới đây được chọn vì nó <strong>chủ đạo, dễ xin việc, và giữ khoá LLM ở phía server</strong> đúng chỗ của nó.</p>

<h3>Stack, theo từng lớp</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Frontend + backend — Next.js 14 (App Router)</b><br/>Một framework cho cả giao diện React <em>và</em> API server (Route Handlers). <em>Vì sao: bạn viết UI và code server an toàn trong một repo; LLM proxy nằm ở server nên khoá không bao giờ chạm trình duyệt.</em></div>
  <div class="lz-layer"><b>API server — Route Handlers</b><br/>Các file như <code>app/api/screenings/route.ts</code> chỉ chạy ở server. <em>Vì sao: đây là nơi ta gọi LLM và đọc <code>process.env.LLM_API_KEY</code> — không thể lộ ra client.</em></div>
  <div class="lz-layer"><b>Kiểm tra — zod</b><br/>Thư viện schema ưu tiên TypeScript. <em>Vì sao: LLM trả về văn bản; zod biến văn bản đó thành một object có kiểu, đã kiểm khoảng, hoặc một lỗi chính xác — xương sống của "trích xuất có cấu trúc".</em></div>
  <div class="lz-layer"><b>Lưu trữ — Prisma + PostgreSQL 16</b><br/>ORM an toàn kiểu trên một CSDL ACID thật. <em>Vì sao: <code>@@unique</code> chặn nộp trùng; transaction giữ một lượt ghi screening là nguyên tử; Postgres là mặc định của ngành.</em></div>
  <div class="lz-layer"><b>AI — một LLM API (phía server)</b><br/>Nhà cung cấp nào có chế độ JSON/structured output. <em>Vì sao: mô hình lo việc đọc; việc của bạn là ràng buộc, kiểm tra, và giữ con người nắm quyền.</em></div>
  <div class="lz-layer"><b>Triển khai — Docker Compose</b><br/>web + db bằng một lệnh, khoá tiêm lúc chạy. <em>Vì sao: "chạy trên máy tôi" thành "chạy ở mọi nơi"; giám khảo thích demo một lệnh.</em></div>
</div>

<h3>Hành trình một request — một CV thành một shortlist</h3>
<div class="diagram">Recruiter bấm "Sàng lọc"  →  fetch POST /api/screenings  (cookie JWT)
   →  Route Handler kiểm role = RECRUITER
   →  nạp văn bản CV + rubric qua Prisma
   →  gọi LLM với prompt chỉ-JSON   (LLM_API_KEY, env server)
   →  zod.safeParse(output mô hình)  →  ok? lưu : retry một lần
   →  Prisma: tạo Screening, đặt Application.status = SCREENED
   →  201 Created  →  UI hiện điểm; recruiter quyết định bước sau</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khoá không bao giờ chạm <code>NEXT_PUBLIC_</code>.</b> Bất kỳ biến nào có tiền tố <code>NEXT_PUBLIC_</code> đều bị nhúng thẳng vào bundle trình duyệt lúc build — ship khoá LLM của bạn cho mọi khách. Khoá bên thứ ba chỉ nằm ở server và được đọc bên trong một Route Handler. Một quy tắc này là ranh giới giữa một app an toàn và một sự cố lộ thông tin đăng nhập. <em>Vì sao ngoài syllabus: ranh giới bí mật client/server là mối lo bảo mật vận hành mà giáo trình ít luyện.</em></div>

<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610#module-367" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">Ôn nền tảng React trên Code Lab</span><span class="lc-sub">Component, hook và state — nửa giao diện của đồ án này.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.4 — Set up your environment|||0.4 — Cài đặt môi trường',
          slug: 'int610-cai-dat',
          type: 'VIDEO',
          description: 'Node.js, VS Code, Docker, Prisma CLI, an LLM API key, Postman — cài một lần, dùng cả đồ án. Hướng dẫn chi tiết ở Exp Hub.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Set up your environment</h2>
<p class="lead">Install everything once, before you write a line of code. Verify each tool from the terminal so you never lose an afternoon to a missing Node or an unset key.</p>

<h3>The checklist</h3>
<table>
<thead><tr><th>Tool</th><th>Why</th><th>Verify command</th></tr></thead>
<tbody>
<tr><td>Node.js LTS + npm</td><td>run Next.js</td><td><code>node -v</code> → 20.x</td></tr>
<tr><td>VS Code</td><td>the editor</td><td><code>code --version</code></td></tr>
<tr><td>Docker Desktop</td><td>Postgres + one-command ship</td><td><code>docker --version</code></td></tr>
<tr><td>Prisma CLI</td><td>schema, migrate, studio</td><td><code>npx prisma -v</code></td></tr>
<tr><td>An LLM API key</td><td>the screening brain</td><td>set as <code>LLM_API_KEY</code> in <code>.env</code> (never <code>NEXT_PUBLIC_</code>)</td></tr>
<tr><td>Postman / REST Client</td><td>test routes without the UI</td><td>send a GET</td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Fastest Postgres:</strong> don&#39;t install it — run it in Docker. <code>docker run --name screen-db -e POSTGRES_PASSWORD=screen -e POSTGRES_DB=screen -p 5432:5432 -d postgres:16</code>. One command, throwaway, identical to production.</div>

<a class="link-card dl" href="/exp-hub/int610-cai-dat-moi-truong?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Full setup guide — download links &amp; step-by-step</span><span class="lc-sub">Node.js, VS Code, Docker Desktop, Prisma CLI, the LLM key, Postman — official links and a verify checklist on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Trap:</strong> putting the LLM key in <code>NEXT_PUBLIC_LLM_API_KEY</code> "so the client can call the model". Never. That inlines the secret into the browser bundle. Keep it as <code>LLM_API_KEY</code> and read it only inside a Route Handler. Also add <code>.env</code> to <code>.gitignore</code> so you never commit it.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cài đặt môi trường</h2>
<p class="lead">Cài hết một lần, trước khi viết một dòng code. Kiểm từng công cụ từ terminal để không mất cả buổi chiều vì thiếu Node hay quên set khoá.</p>

<h3>Danh sách cần cài</h3>
<table>
<thead><tr><th>Công cụ</th><th>Để làm gì</th><th>Lệnh kiểm</th></tr></thead>
<tbody>
<tr><td>Node.js LTS + npm</td><td>chạy Next.js</td><td><code>node -v</code> → 20.x</td></tr>
<tr><td>VS Code</td><td>trình soạn thảo</td><td><code>code --version</code></td></tr>
<tr><td>Docker Desktop</td><td>Postgres + ship một lệnh</td><td><code>docker --version</code></td></tr>
<tr><td>Prisma CLI</td><td>schema, migrate, studio</td><td><code>npx prisma -v</code></td></tr>
<tr><td>Một khoá LLM API</td><td>bộ não sàng lọc</td><td>đặt là <code>LLM_API_KEY</code> trong <code>.env</code> (không bao giờ <code>NEXT_PUBLIC_</code>)</td></tr>
<tr><td>Postman / REST Client</td><td>test route không cần UI</td><td>gửi một GET</td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Postgres nhanh nhất:</strong> đừng cài — chạy trong Docker. <code>docker run --name screen-db -e POSTGRES_PASSWORD=screen -e POSTGRES_DB=screen -p 5432:5432 -d postgres:16</code>. Một lệnh, dùng xong xoá, giống hệt production.</div>

<a class="link-card dl" href="/exp-hub/int610-cai-dat-moi-truong?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn cài đặt đầy đủ — link tải &amp; từng bước</span><span class="lc-sub">Node.js, VS Code, Docker Desktop, Prisma CLI, khoá LLM, Postman — link chính chủ và checklist kiểm trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đặt khoá LLM vào <code>NEXT_PUBLIC_LLM_API_KEY</code> "để client gọi được mô hình". Đừng bao giờ. Nó nhúng bí mật thẳng vào bundle trình duyệt. Giữ nó là <code>LLM_API_KEY</code> và chỉ đọc bên trong một Route Handler. Ngoài ra thêm <code>.env</code> vào <code>.gitignore</code> để không bao giờ commit nó.</div>
</div>
`,
        },
        {
          title: '0.5 — Your demo & video-recording script|||0.5 — Kịch bản demo & quay video',
          slug: 'int610-kich-ban-demo',
          type: 'VIDEO',
          description: 'Kịch bản 6–8 phút quay video demo chuyên nghiệp: mở đầu, luồng lõi, "khoảnh khắc AI gợi ý con người quyết", kết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Your demo &amp; video-recording script</h2>
<p class="lead">You are recording this project for your portfolio and your defence. A good demo is <strong>rehearsed and scripted</strong>, 6–8 minutes, and it climaxes on the one thing that is hard and responsible: <strong>the AI produces scored JSON, and a human makes the decision — on camera</strong>.</p>

<h3>The 6–8 minute script</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Hook (30s)</div><div class="lz-nsub">"This app screens CVs with an LLM, but the AI only suggests — a recruiter always decides. Let me show you." Show the architecture picture from 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Candidate flow (1.5m)</div><div class="lz-nsub">Register → login (show the JWT in DevTools) → open a job → apply → upload a CV → status shows APPLIED in "My applications".</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:00 — The money shot (2m)</div><div class="lz-nsub">Log in as recruiter → open the application → click "Screen with AI" → the LLM JSON appears: skills, years, a score per rubric criterion. Point out status is now SCREENED, not decided.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:00 — Validation &amp; retry (1m)</div><div class="lz-nsub">Show the terminal log where the model first returned an out-of-range score, zod rejected it, and the retry produced valid JSON. This proves the schema guard works.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:00 — The human decides (1.5m)</div><div class="lz-nsub">Recruiter reads the scores and clicks Shortlist (or Reject). Show a candidate being blocked (403) from the screen endpoint. Show the audit row: who decided, when.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">6:30 — Under the hood + close (1m)</div><div class="lz-nsub">One command: <code>docker compose up</code>. Show the schema, the zod schema, and the LLM key living only in server env. "Stack: Next.js, Prisma, PostgreSQL, zod, Docker. Repo link on screen. Thanks."</div></div></div>
</div>

<div class="callout ok"><strong>Recording tips:</strong> seed demo data first (never demo on an empty DB). Increase your editor/browser font size. Do one dry run. Record in 1080p. Keep mouse movements slow. If something breaks, cut and re-record that segment — never apologise on camera.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Lead with the responsible-AI angle.</b> Interviewers watch the first 60 seconds and the "hard part". Opening with "the AI only suggests; a human decides" and ending with the audit trail signals engineering and ethical maturity far more than a tour of every screen. <em>Why beyond syllabus: communicating <em>how</em> you kept a model accountable is what separates an "AI demo" from a hireable AI engineer.</em></div>

<div class="note-ct">You now have the full map. Section 1 starts the build: turn the two roles into an ERD and a Prisma schema.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Kịch bản demo &amp; quay video</h2>
<p class="lead">Bạn quay đồ án này cho portfolio và buổi bảo vệ. Một demo tốt là <strong>đã tập và có kịch bản</strong>, 6–8 phút, và cao trào ở đúng thứ khó và có trách nhiệm: <strong>AI sinh ra JSON đã chấm điểm, và con người ra quyết định — ngay trên video</strong>.</p>

<h3>Kịch bản 6–8 phút</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Mở màn (30s)</div><div class="lz-nsub">"App này sàng lọc CV bằng một LLM, nhưng AI chỉ gợi ý — nhà tuyển dụng luôn quyết định. Để tôi cho xem." Chiếu bức tranh kiến trúc ở bài 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Luồng ứng viên (1.5m)</div><div class="lz-nsub">Đăng ký → đăng nhập (chỉ JWT trong DevTools) → mở một vị trí → nộp đơn → tải CV → trạng thái hiện APPLIED trong "Đơn của tôi".</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:00 — Cảnh đắt giá (2m)</div><div class="lz-nsub">Đăng nhập nhà tuyển dụng → mở đơn → bấm "Sàng lọc bằng AI" → JSON của LLM hiện ra: kỹ năng, số năm, điểm cho từng tiêu chí rubric. Chỉ rõ trạng thái giờ là SCREENED, chưa quyết.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:00 — Kiểm tra &amp; retry (1m)</div><div class="lz-nsub">Chiếu log terminal nơi mô hình lần đầu trả một điểm ngoài khoảng, zod từ chối, và lần retry sinh JSON hợp lệ. Chứng minh hàng rào schema chạy đúng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:00 — Con người quyết định (1.5m)</div><div class="lz-nsub">Recruiter đọc điểm rồi bấm Shortlist (hoặc Loại). Cho thấy ứng viên bị chặn (403) khỏi endpoint sàng lọc. Chiếu dòng kiểm toán: ai quyết, lúc nào.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">6:30 — Bên trong + Kết (1m)</div><div class="lz-nsub">Một lệnh: <code>docker compose up</code>. Chiếu schema, schema zod, và khoá LLM chỉ nằm ở env server. "Stack: Next.js, Prisma, PostgreSQL, zod, Docker. Link repo trên màn hình. Cảm ơn."</div></div></div>
</div>

<div class="callout ok"><strong>Mẹo quay:</strong> seed dữ liệu demo trước (đừng bao giờ demo trên DB rỗng). Tăng cỡ chữ editor/trình duyệt. Quay thử một lần. Quay 1080p. Di chuột chậm. Nếu hỏng, cắt và quay lại đoạn đó — đừng xin lỗi trên video.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mở đầu bằng góc AI-có-trách-nhiệm.</b> Nhà tuyển dụng xem 60 giây đầu và "phần khó". Mở bằng "AI chỉ gợi ý; con người quyết định" và kết bằng vết kiểm toán thể hiện sự trưởng thành kỹ thuật lẫn đạo đức hơn nhiều so với đi tua từng màn hình. <em>Vì sao ngoài syllabus: trình bày <em>cách</em> bạn giữ mô hình chịu trách nhiệm là thứ tách một "demo AI" khỏi một kỹ sư AI đáng tuyển.</em></div>

<div class="note-ct">Giờ bạn đã có bản đồ đầy đủ. Mục 1 bắt đầu xây: biến hai vai trò thành ERD và một Prisma schema.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 1 — DOMAIN & DATABASE DESIGN ══════════════════ */
    {
      title: 'Section 1 — Domain & Database Design|||Mục 1 — Thiết kế domain & CSDL',
      description: 'Biến hai vai trò thành use case, ERD và một Prisma schema chuẩn hoá — với @@unique chống nộp trùng và một Screening 1-1 cho kết quả AI.',
      lessons: [
        {
          title: '1.1 — Use cases, entities & the ERD|||1.1 — Use case, thực thể & ERD',
          slug: 'int610-erd',
          type: 'VIDEO',
          description: 'Từ vai trò tới thực thể: User, Job, Criterion, Application, Screening, CriterionScore và quan hệ giữa chúng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.1</span>
<h2>Use cases, entities &amp; the ERD</h2>
<p class="lead">Design starts from behaviour. List what each role <em>does</em>, and the nouns in those sentences become your entities. Do this on paper first — a wrong table is expensive to change after you have code on top of it.</p>

<h3>Use cases → entities</h3>
<p>"A <b>candidate</b> applies to a <b>job</b>, uploading a CV, creating an <b>application</b>; a <b>recruiter</b> defines <b>criteria</b> and runs a <b>screening</b> that stores a <b>score per criterion</b>." The nouns give us six entities:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — an account with a role (CANDIDATE or RECRUITER), email, password hash. Role decides permissions.</div>
  <div class="lz-layer"><b>Job</b> — a posting owned by a recruiter: title, description. A job <em>has many</em> criteria and <em>has many</em> applications.</div>
  <div class="lz-layer"><b>Criterion</b> — one rubric line for a job: a label ("Java/Spring") and a weight. The AI scores each one 0–10.</div>
  <div class="lz-layer"><b>Application</b> — a candidate applying to a job: a CV, a <code>status</code> (APPLIED / SCREENED / SHORTLISTED / REJECTED). This is the resource the pipeline moves through.</div>
  <div class="lz-layer"><b>Screening</b> — the AI result for one application (1-1): extracted <code>skills</code>, <code>yearsExperience</code>, an overall score, when it ran.</div>
  <div class="lz-layer"><b>CriterionScore</b> — the AI&#39;s score + rationale for one criterion within one screening.</div>
</div>

<h3>The ERD — relationships &amp; cardinality</h3>
<div class="diagram">┌──────────┐        ┌───────────┐1───*┌────────────┐
│   User   │1──────*│    Job    │     │ Criterion  │
│(RECRUITER)│       └───────────┘     └────────────┘
└──────────┘             1│                  │1
                          │*                 │*
┌──────────┐        ┌───────────┐1──1┌────────────┐    ┌────────────────┐
│   User   │1──────*│Application│    │ Screening  │1──*│ CriterionScore │
│(CANDIDATE)│       └───────────┘    └────────────┘    └────────────────┘
└──────────┘

Job         1—* Criterion    : a job has many rubric lines
Job         1—* Application  : a job receives many applications
Application 1—1 Screening    : at most one AI screening per application
Screening   1—* CriterionScore : one score per rubric criterion</div>

<h3>Worked example — reading the model out loud</h3>
<div class="out"><b>Question:</b> Recruiter Mai posts "Java Intern" with rubric [Java/Spring, SQL, DevOps]. Candidate An applies.
<b>Step 1 —</b> An sends POST /api/applications { jobId: JavaIntern }, uploads cv.pdf.
<b>Step 2 —</b> An Application row is created: candidate=An, job=JavaIntern, status=APPLIED.
<b>Step 3 —</b> Mai runs screening → one Screening row (skills, years) + 3 CriterionScore rows (one per rubric line).
<b>Step 4 —</b> Application.status becomes SCREENED. Mai reads the scores and decides SHORTLISTED.
<b>Result:</b> the 1—1 between Application and Screening means re-screening replaces one result, never piles up duplicates.</div>

<div class="pitfall"><strong>Design trap:</strong> storing the AI scores as free JSON on the Application ("just dump the model output"). Then you cannot query "average DevOps score across candidates", cannot show a clean table, and cannot audit one criterion. Model CriterionScore as real rows so the rubric is queryable.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Separate the machine&#39;s opinion from the human&#39;s decision.</b> Notice the score lives in Screening/CriterionScore, but the <em>outcome</em> (SHORTLISTED/REJECTED) lives in Application.status set by a recruiter. Keeping "what the model said" and "what the human did" in different places is what makes the system auditable and the human accountable. <em>Why beyond syllabus: this separation is the data-model expression of "AI suggests, human decides" — a responsible-AI pattern the syllabus never frames.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610#module-430" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Prisma setup &amp; schema on Code Lab</span><span class="lc-sub">Models, fields and the datasource — the ORM under your tables.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.1</span>
<h2>Use case, thực thể &amp; ERD</h2>
<p class="lead">Thiết kế bắt đầu từ hành vi. Liệt kê mỗi vai trò <em>làm gì</em>, và các danh từ trong những câu đó trở thành thực thể. Làm trên giấy trước — một bảng sai rất đắt để sửa khi đã có code đè lên.</p>

<h3>Use case → thực thể</h3>
<p>"Một <b>ứng viên</b> nộp đơn vào một <b>vị trí</b>, tải CV, tạo ra một <b>đơn</b>; một <b>nhà tuyển dụng</b> định nghĩa <b>tiêu chí</b> và chạy một <b>lượt sàng lọc</b> lưu <b>điểm cho từng tiêu chí</b>." Các danh từ cho ta sáu thực thể:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — một tài khoản có vai trò (CANDIDATE hoặc RECRUITER), email, hash mật khẩu. Role quyết định quyền.</div>
  <div class="lz-layer"><b>Job</b> — một tin đăng thuộc về một recruiter: tiêu đề, mô tả. Một vị trí <em>có nhiều</em> tiêu chí và <em>có nhiều</em> đơn.</div>
  <div class="lz-layer"><b>Criterion</b> — một dòng rubric của vị trí: một nhãn ("Java/Spring") và một trọng số. AI chấm mỗi cái 0–10.</div>
  <div class="lz-layer"><b>Application</b> — một ứng viên nộp vào một vị trí: một CV, một <code>status</code> (APPLIED / SCREENED / SHORTLISTED / REJECTED). Đây là tài nguyên mà pipeline dịch chuyển.</div>
  <div class="lz-layer"><b>Screening</b> — kết quả AI cho một đơn (1-1): <code>skills</code> trích ra, <code>yearsExperience</code>, một điểm tổng, thời điểm chạy.</div>
  <div class="lz-layer"><b>CriterionScore</b> — điểm + lý giải của AI cho một tiêu chí trong một lượt sàng lọc.</div>
</div>

<h3>ERD — quan hệ &amp; lực lượng (cardinality)</h3>
<div class="diagram">┌──────────┐        ┌───────────┐1───*┌────────────┐
│   User   │1──────*│    Job    │     │ Criterion  │
│(RECRUITER)│       └───────────┘     └────────────┘
└──────────┘             1│                  │1
                          │*                 │*
┌──────────┐        ┌───────────┐1──1┌────────────┐    ┌────────────────┐
│   User   │1──────*│Application│    │ Screening  │1──*│ CriterionScore │
│(CANDIDATE)│       └───────────┘    └────────────┘    └────────────────┘
└──────────┘

Job         1—* Criterion    : một vị trí có nhiều dòng rubric
Job         1—* Application  : một vị trí nhận nhiều đơn
Application 1—1 Screening    : tối đa một lượt sàng lọc AI mỗi đơn
Screening   1—* CriterionScore : một điểm cho mỗi tiêu chí rubric</div>

<h3>Ví dụ có lời giải — đọc mô hình thành tiếng</h3>
<div class="out"><b>Câu hỏi:</b> Recruiter Mai đăng "Java Intern" với rubric [Java/Spring, SQL, DevOps]. Ứng viên An nộp.
<b>Bước 1 —</b> An gửi POST /api/applications { jobId: JavaIntern }, tải cv.pdf.
<b>Bước 2 —</b> Một dòng Application được tạo: candidate=An, job=JavaIntern, status=APPLIED.
<b>Bước 3 —</b> Mai chạy sàng lọc → một dòng Screening (skills, years) + 3 dòng CriterionScore (một cho mỗi dòng rubric).
<b>Bước 4 —</b> Application.status thành SCREENED. Mai đọc điểm và quyết định SHORTLISTED.
<b>Kết quả:</b> quan hệ 1—1 giữa Application và Screening nghĩa là sàng lọc lại sẽ thay một kết quả, không chồng chất trùng lặp.</div>

<div class="pitfall"><strong>Bẫy thiết kế:</strong> lưu điểm AI dưới dạng JSON tự do trên Application ("cứ đổ nguyên output mô hình"). Khi đó bạn không truy vấn được "điểm DevOps trung bình của các ứng viên", không hiện được bảng gọn, và không kiểm toán được từng tiêu chí. Hãy mô hình CriterionScore thành dòng thật để rubric truy vấn được.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tách ý kiến của máy khỏi quyết định của người.</b> Chú ý điểm nằm trong Screening/CriterionScore, còn <em>kết cục</em> (SHORTLISTED/REJECTED) nằm trong Application.status do recruiter đặt. Giữ "mô hình nói gì" và "con người làm gì" ở hai chỗ khác nhau chính là thứ khiến hệ thống kiểm toán được và con người chịu trách nhiệm. <em>Vì sao ngoài syllabus: cách tách này là hình thức dữ liệu của "AI gợi ý, người quyết" — một mẫu AI-có-trách-nhiệm mà giáo trình không nêu.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610#module-430" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Cài đặt &amp; schema Prisma trên Code Lab</span><span class="lc-sub">Model, field và datasource — ORM nằm dưới các bảng của bạn.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — The Prisma schema & the constraint that prevents double-applying|||1.2 — Prisma schema & ràng buộc chống nộp trùng',
          slug: 'int610-schema',
          type: 'VIDEO',
          description: 'Prisma schema đầy đủ + @@unique([jobId, candidateId]): hàng rào chống nộp trùng, do CSDL bảo đảm, đặt tên constraint tường minh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.2</span>
<h2>The Prisma schema &amp; the constraint that prevents double-applying</h2>
<p class="lead">Here is the whole database as a Prisma schema. Notice one line — the <code>@@unique([jobId, candidateId])</code>. That single constraint is your <strong>last line of defence</strong> against a candidate applying twice: even if two requests slip past every check in your code, the database itself refuses the second row.</p>

<h3>schema.prisma</h3>
<pre><span class="tok-keyword">model</span> <span class="tok-type">User</span> {
  id           <span class="tok-type">Int</span>      <span class="tok-keyword">@id @default</span>(autoincrement())
  email        <span class="tok-type">String</span>   <span class="tok-keyword">@unique</span>
  password     <span class="tok-type">String</span>                       <span class="tok-comment">// bcrypt hash</span>
  fullName     <span class="tok-type">String</span>
  role         <span class="tok-type">Role</span>     <span class="tok-keyword">@default</span>(CANDIDATE)   <span class="tok-comment">// CANDIDATE | RECRUITER</span>
  jobs         <span class="tok-type">Job[]</span>         <span class="tok-keyword">@relation</span>(<span class="tok-string">"RecruiterJobs"</span>)
  applications <span class="tok-type">Application[]</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">Job</span> {
  id           <span class="tok-type">Int</span>      <span class="tok-keyword">@id @default</span>(autoincrement())
  title        <span class="tok-type">String</span>
  description  <span class="tok-type">String</span>
  recruiterId  <span class="tok-type">Int</span>
  recruiter    <span class="tok-type">User</span>     <span class="tok-keyword">@relation</span>(<span class="tok-string">"RecruiterJobs"</span>, fields: [recruiterId], references: [id])
  criteria     <span class="tok-type">Criterion[]</span>
  applications <span class="tok-type">Application[]</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">Criterion</span> {
  id      <span class="tok-type">Int</span>    <span class="tok-keyword">@id @default</span>(autoincrement())
  jobId   <span class="tok-type">Int</span>
  job     <span class="tok-type">Job</span>    <span class="tok-keyword">@relation</span>(fields: [jobId], references: [id])
  label   <span class="tok-type">String</span>                        <span class="tok-comment">// "Java/Spring"</span>
  weight  <span class="tok-type">Int</span>    <span class="tok-keyword">@default</span>(1)
  scores  <span class="tok-type">CriterionScore[]</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">Application</span> {
  id          <span class="tok-type">Int</span>       <span class="tok-keyword">@id @default</span>(autoincrement())
  jobId       <span class="tok-type">Int</span>
  candidateId <span class="tok-type">Int</span>
  job         <span class="tok-type">Job</span>       <span class="tok-keyword">@relation</span>(fields: [jobId], references: [id])
  candidate   <span class="tok-type">User</span>      <span class="tok-keyword">@relation</span>(fields: [candidateId], references: [id])
  cvUrl       <span class="tok-type">String</span>
  status      <span class="tok-type">ApplicationStatus</span> <span class="tok-keyword">@default</span>(APPLIED)
  createdAt   <span class="tok-type">DateTime</span>  <span class="tok-keyword">@default</span>(now())
  screening   <span class="tok-type">Screening?</span>

  <span class="tok-keyword">@@unique</span>([jobId, candidateId], name: <span class="tok-string">"uq_one_application"</span>)  <span class="tok-comment">// ★ one apply per job</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">Screening</span> {
  id              <span class="tok-type">Int</span>      <span class="tok-keyword">@id @default</span>(autoincrement())
  applicationId   <span class="tok-type">Int</span>      <span class="tok-keyword">@unique</span>                 <span class="tok-comment">// 1-1 with Application</span>
  application     <span class="tok-type">Application</span> <span class="tok-keyword">@relation</span>(fields: [applicationId], references: [id])
  skills          <span class="tok-type">String[]</span>                          <span class="tok-comment">// extracted by the LLM</span>
  yearsExperience <span class="tok-type">Int</span>
  overallScore    <span class="tok-type">Int</span>
  createdAt       <span class="tok-type">DateTime</span> <span class="tok-keyword">@default</span>(now())
  criterionScores <span class="tok-type">CriterionScore[]</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">CriterionScore</span> {
  id          <span class="tok-type">Int</span>       <span class="tok-keyword">@id @default</span>(autoincrement())
  screeningId <span class="tok-type">Int</span>
  criterionId <span class="tok-type">Int</span>
  screening   <span class="tok-type">Screening</span> <span class="tok-keyword">@relation</span>(fields: [screeningId], references: [id])
  criterion   <span class="tok-type">Criterion</span> <span class="tok-keyword">@relation</span>(fields: [criterionId], references: [id])
  score       <span class="tok-type">Int</span>                                 <span class="tok-comment">// 0..10, checked by zod before insert</span>
  rationale   <span class="tok-type">String</span>
}

<span class="tok-keyword">enum</span> <span class="tok-type">Role</span> { CANDIDATE  RECRUITER }
<span class="tok-keyword">enum</span> <span class="tok-type">ApplicationStatus</span> { APPLIED  SCREENED  SHORTLISTED  REJECTED }</pre>

<h3>Worked example — why the @@unique is the real guard</h3>
<div class="out"><b>Scenario:</b> An double-clicks "Apply" — two inserts for (jobId=5, candidateId=7) arrive at once.
<b>Step 1 —</b> Request A: INSERT application (5,7) → row locked, not yet committed.
<b>Step 2 —</b> Request B: INSERT application (5,7) → PostgreSQL sees the pending unique key → <b>B waits</b>.
<b>Step 3 —</b> A commits. The unique key (5,7) now exists.
<b>Step 4 —</b> B is released → its INSERT violates <code>uq_one_application</code> → Prisma throws <b>P2002 (unique constraint failed)</b>.
<b>Result:</b> exactly one application exists. Your code catches P2002 and returns <b>409 Conflict</b>. The database, not your <code>if</code>-statement, guarantees it.</div>

<div class="pitfall"><strong>Trap (from our project history):</strong> when you name a constraint with <code>@@unique([...], name: "uq_one_application")</code>, Prisma queries must use that <em>custom name</em>, not the default compound key. Use <code>where: { uq_one_application: { jobId, candidateId } }</code> — <b>not</b> <code>where: { jobId_candidateId: {...} }</code>. The default name only exists if you omit <code>name:</code>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Validate at three layers, not one.</b> The score range (0–10) is enforced by <em>zod</em> before insert (Section 4); the "one apply per job" rule by the <em>database</em> <code>@@unique</code>; the "your own application only" rule by <em>application code</em>. A junior trusts one check; a professional layers cheap fast checks in front of an absolute database backstop. <em>Why beyond syllabus: defence-in-depth across validation layers is a design discipline the syllabus rarely makes explicit.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610#module-433" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Prisma relations on Code Lab</span><span class="lc-sub">One-to-many, one-to-one and named relations — hands-on.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.2</span>
<h2>Prisma schema &amp; ràng buộc chống nộp trùng</h2>
<p class="lead">Đây là toàn bộ CSDL dưới dạng Prisma schema. Chú ý một dòng — <code>@@unique([jobId, candidateId])</code>. Ràng buộc đơn lẻ đó là <strong>hàng rào cuối cùng</strong> chống một ứng viên nộp hai lần: kể cả khi hai request lọt qua mọi kiểm tra trong code, chính CSDL từ chối dòng thứ hai.</p>

<h3>schema.prisma</h3>
<pre><span class="tok-keyword">model</span> <span class="tok-type">User</span> {
  id           <span class="tok-type">Int</span>      <span class="tok-keyword">@id @default</span>(autoincrement())
  email        <span class="tok-type">String</span>   <span class="tok-keyword">@unique</span>
  password     <span class="tok-type">String</span>                       <span class="tok-comment">// hash bcrypt</span>
  fullName     <span class="tok-type">String</span>
  role         <span class="tok-type">Role</span>     <span class="tok-keyword">@default</span>(CANDIDATE)   <span class="tok-comment">// CANDIDATE | RECRUITER</span>
  jobs         <span class="tok-type">Job[]</span>         <span class="tok-keyword">@relation</span>(<span class="tok-string">"RecruiterJobs"</span>)
  applications <span class="tok-type">Application[]</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">Job</span> {
  id           <span class="tok-type">Int</span>      <span class="tok-keyword">@id @default</span>(autoincrement())
  title        <span class="tok-type">String</span>
  description  <span class="tok-type">String</span>
  recruiterId  <span class="tok-type">Int</span>
  recruiter    <span class="tok-type">User</span>     <span class="tok-keyword">@relation</span>(<span class="tok-string">"RecruiterJobs"</span>, fields: [recruiterId], references: [id])
  criteria     <span class="tok-type">Criterion[]</span>
  applications <span class="tok-type">Application[]</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">Criterion</span> {
  id      <span class="tok-type">Int</span>    <span class="tok-keyword">@id @default</span>(autoincrement())
  jobId   <span class="tok-type">Int</span>
  job     <span class="tok-type">Job</span>    <span class="tok-keyword">@relation</span>(fields: [jobId], references: [id])
  label   <span class="tok-type">String</span>                        <span class="tok-comment">// "Java/Spring"</span>
  weight  <span class="tok-type">Int</span>    <span class="tok-keyword">@default</span>(1)
  scores  <span class="tok-type">CriterionScore[]</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">Application</span> {
  id          <span class="tok-type">Int</span>       <span class="tok-keyword">@id @default</span>(autoincrement())
  jobId       <span class="tok-type">Int</span>
  candidateId <span class="tok-type">Int</span>
  job         <span class="tok-type">Job</span>       <span class="tok-keyword">@relation</span>(fields: [jobId], references: [id])
  candidate   <span class="tok-type">User</span>      <span class="tok-keyword">@relation</span>(fields: [candidateId], references: [id])
  cvUrl       <span class="tok-type">String</span>
  status      <span class="tok-type">ApplicationStatus</span> <span class="tok-keyword">@default</span>(APPLIED)
  createdAt   <span class="tok-type">DateTime</span>  <span class="tok-keyword">@default</span>(now())
  screening   <span class="tok-type">Screening?</span>

  <span class="tok-keyword">@@unique</span>([jobId, candidateId], name: <span class="tok-string">"uq_one_application"</span>)  <span class="tok-comment">// ★ một lần nộp mỗi vị trí</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">Screening</span> {
  id              <span class="tok-type">Int</span>      <span class="tok-keyword">@id @default</span>(autoincrement())
  applicationId   <span class="tok-type">Int</span>      <span class="tok-keyword">@unique</span>                 <span class="tok-comment">// 1-1 với Application</span>
  application     <span class="tok-type">Application</span> <span class="tok-keyword">@relation</span>(fields: [applicationId], references: [id])
  skills          <span class="tok-type">String[]</span>                          <span class="tok-comment">// LLM trích ra</span>
  yearsExperience <span class="tok-type">Int</span>
  overallScore    <span class="tok-type">Int</span>
  createdAt       <span class="tok-type">DateTime</span> <span class="tok-keyword">@default</span>(now())
  criterionScores <span class="tok-type">CriterionScore[]</span>
}

<span class="tok-keyword">model</span> <span class="tok-type">CriterionScore</span> {
  id          <span class="tok-type">Int</span>       <span class="tok-keyword">@id @default</span>(autoincrement())
  screeningId <span class="tok-type">Int</span>
  criterionId <span class="tok-type">Int</span>
  screening   <span class="tok-type">Screening</span> <span class="tok-keyword">@relation</span>(fields: [screeningId], references: [id])
  criterion   <span class="tok-type">Criterion</span> <span class="tok-keyword">@relation</span>(fields: [criterionId], references: [id])
  score       <span class="tok-type">Int</span>                                 <span class="tok-comment">// 0..10, zod kiểm trước khi insert</span>
  rationale   <span class="tok-type">String</span>
}

<span class="tok-keyword">enum</span> <span class="tok-type">Role</span> { CANDIDATE  RECRUITER }
<span class="tok-keyword">enum</span> <span class="tok-type">ApplicationStatus</span> { APPLIED  SCREENED  SHORTLISTED  REJECTED }</pre>

<h3>Ví dụ có lời giải — vì sao @@unique mới là người gác thật</h3>
<div class="out"><b>Tình huống:</b> An double-click "Nộp" — hai insert cho (jobId=5, candidateId=7) tới cùng lúc.
<b>Bước 1 —</b> Request A: INSERT application (5,7) → dòng bị khoá, chưa commit.
<b>Bước 2 —</b> Request B: INSERT application (5,7) → PostgreSQL thấy khoá unique đang chờ → <b>B đợi</b>.
<b>Bước 3 —</b> A commit. Khoá unique (5,7) giờ tồn tại.
<b>Bước 4 —</b> B được thả → INSERT của nó vi phạm <code>uq_one_application</code> → Prisma ném <b>P2002 (unique constraint failed)</b>.
<b>Kết quả:</b> đúng một đơn tồn tại. Code của bạn bắt P2002 và trả <b>409 Conflict</b>. Chính CSDL, không phải câu <code>if</code>, bảo đảm điều đó.</div>

<div class="pitfall"><strong>Bẫy (từ lịch sử dự án của chúng ta):</strong> khi bạn đặt tên ràng buộc bằng <code>@@unique([...], name: "uq_one_application")</code>, truy vấn Prisma phải dùng <em>tên tuỳ chỉnh</em> đó, không phải khoá ghép mặc định. Dùng <code>where: { uq_one_application: { jobId, candidateId } }</code> — <b>không phải</b> <code>where: { jobId_candidateId: {...} }</code>. Tên mặc định chỉ tồn tại nếu bạn bỏ <code>name:</code>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kiểm tra ở ba lớp, không phải một.</b> Khoảng điểm (0–10) được ép bởi <em>zod</em> trước khi insert (Mục 4); quy tắc "một lần nộp mỗi vị trí" bởi <em>CSDL</em> <code>@@unique</code>; quy tắc "chỉ đơn của mình" bởi <em>code ứng dụng</em>. Junior tin một kiểm tra; dân chuyên xếp các kiểm tra nhanh rẻ trước một chốt chặn tuyệt đối ở CSDL. <em>Vì sao ngoài syllabus: phòng thủ theo chiều sâu qua các lớp kiểm tra là kỷ luật thiết kế mà giáo trình ít nói rõ.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610#module-433" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Quan hệ Prisma trên Code Lab</span><span class="lc-sub">One-to-many, one-to-one và named relation — thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 1 — Domain & schema|||Quiz 1 — Domain & schema',
          slug: 'int610-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra hiểu về ERD, cardinality, @@unique và cách tách ý kiến máy khỏi quyết định người.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Which constraint prevents a candidate applying twice to the same job, and where does the guarantee live?|||Ràng buộc nào chống một ứng viên nộp hai lần vào cùng vị trí, và sự bảo đảm nằm ở đâu?',
                options: [
                  'A React check; guaranteed by the frontend|||Một kiểm tra React; bảo đảm bằng frontend',
                  '@@unique([jobId, candidateId]); guaranteed by the database|||@@unique([jobId, candidateId]); bảo đảm bằng CSDL',
                  'The JWT; guaranteed by the token|||JWT; bảo đảm bằng token',
                  'The LLM; guaranteed by the model|||LLM; bảo đảm bằng mô hình',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The relationship "an application has at most one AI screening" is which cardinality?|||Quan hệ "một đơn có tối đa một lượt sàng lọc AI" là lực lượng nào?',
                options: ['1—1 (one-to-one)|||1—1 (một-một)', '1—* (one-to-many)|||1—* (một-nhiều)', '*—* (many-to-many)|||*—* (nhiều-nhiều)', '0—0'],
                correctIndex: 0,
              },
              {
                id: 'q3', points: 1,
                question: 'Why store CriterionScore as real rows instead of dumping the model output as free JSON on Application?|||Vì sao lưu CriterionScore thành dòng thật thay vì đổ output mô hình thành JSON tự do trên Application?',
                options: [
                  'It uses less disk|||Tốn ít đĩa hơn',
                  'So the rubric is queryable and auditable per criterion|||Để rubric truy vấn được và kiểm toán được theo từng tiêu chí',
                  'Prisma forbids JSON|||Prisma cấm JSON',
                  'To avoid a foreign key|||Để tránh khoá ngoại',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'With @@unique([...], name: "uq_one_application"), a Prisma where-clause must use…|||Với @@unique([...], name: "uq_one_application"), mệnh đề where của Prisma phải dùng…',
                options: [
                  'where: { jobId_candidateId: {...} }',
                  'where: { uq_one_application: { jobId, candidateId } }',
                  'where: { id: {...} }',
                  'any name works|||tên nào cũng được',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) Keeping the AI score in Screening but the SHORTLISTED/REJECTED outcome in Application.status achieves what?|||(Ngoài giáo trình) Giữ điểm AI trong Screening nhưng kết cục SHORTLISTED/REJECTED trong Application.status đạt được gì?',
                options: [
                  'Faster queries only|||Chỉ truy vấn nhanh hơn',
                  'It separates the machine and human roles, keeping the system auditable|||Nó tách vai trò của máy và của người, giữ hệ thống kiểm toán được',
                  'It lets the AI auto-decide|||Nó cho AI tự quyết',
                  'It removes the need for a recruiter|||Nó bỏ nhu cầu có recruiter',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ MỤC 2 — BACKEND: ROUTE HANDLERS & CÁC LỚP ══════════════════ */
    {
      title: 'Section 2 — Backend: Route Handlers & the Layers|||Mục 2 — Backend: Route Handlers & các lớp',
      description: 'Khởi tạo dự án Next.js, nối Prisma, và xây một lát cắt dọc "GET các đơn của một vị trí" qua route → service → Prisma.',
      lessons: [
        {
          title: '2.1 — Project setup & the layered architecture|||2.1 — Khởi tạo dự án & kiến trúc phân lớp',
          slug: 'int610-backend-setup',
          type: 'VIDEO',
          description: 'create-next-app, một Prisma client singleton, và ba lớp route / service / data — mỗi lớp một trách nhiệm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.1</span>
<h2>Project setup &amp; the layered architecture</h2>
<p class="lead">Scaffold with <code>npx create-next-app@latest screen --ts --app</code>, add <code>prisma</code>, <code>zod</code>, <code>bcryptjs</code> and <code>jsonwebtoken</code>. Then decide your layers up front — Route Handlers are thin; the real work lives in a service layer that never knows about HTTP.</p>

<h3>The Prisma client — one instance for the whole app</h3>
<pre><span class="tok-comment">// lib/prisma.ts — a singleton so dev hot-reload doesn&#39;t open 100 connections</span>
<span class="tok-keyword">import</span> { PrismaClient } <span class="tok-keyword">from</span> <span class="tok-string">'@prisma/client'</span>;

<span class="tok-keyword">const</span> g = globalThis <span class="tok-keyword">as</span> <span class="tok-keyword">unknown</span> <span class="tok-keyword">as</span> { prisma?: PrismaClient };
<span class="tok-keyword">export const</span> prisma = g.prisma ?? <span class="tok-keyword">new</span> PrismaClient();
<span class="tok-keyword">if</span> (process.env.NODE_ENV !== <span class="tok-string">'production'</span>) g.prisma = prisma;</pre>

<h3>The .env — where secrets live (server only)</h3>
<pre><span class="tok-comment"># .env — NEVER commit this; add it to .gitignore</span>
DATABASE_URL=<span class="tok-string">"postgresql://postgres:screen@localhost:5432/screen"</span>
JWT_SECRET=<span class="tok-string">"change-me-32-bytes-minimum"</span>
LLM_API_URL=<span class="tok-string">"https://your-llm-provider/v1/chat"</span>
LLM_API_KEY=<span class="tok-string">"sk-..."</span>            <span class="tok-comment"># server-side only — NO NEXT_PUBLIC_ prefix</span></pre>

<h3>The three layers — one responsibility each</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Route Handler</b> (<code>app/api/**/route.ts</code>) — HTTP only. Reads the request, checks auth, validates input with zod, calls a service, returns <code>NextResponse.json</code> with a status code. <em>No business logic here.</em></div>
  <div class="lz-layer"><b>Service</b> (<code>lib/services/*.ts</code>) — the business rules. "Can this candidate apply? Run the screening, set the status." Owns transactions. <em>Knows nothing about HTTP.</em></div>
  <div class="lz-layer"><b>Data</b> (<code>lib/prisma.ts</code> + models) — database access via Prisma. <em>Knows nothing about business rules.</em></div>
</div>
<div class="diagram">HTTP request
   │
   ▼
Route Handler ──dto──▶ Service ──prisma──▶ PostgreSQL
   ▲                     │
   └──json/status────────┘  (map result → 200/201/403/409…)</div>

<div class="callout ok">Why layer at all? Because you can then <strong>unit-test the service without HTTP</strong> and <strong>reuse it from a Route Handler or a Server Action</strong>. Each layer depends only on the one below it.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Route Handlers run only on the server — that is the whole security model.</b> Code in <code>app/api/**/route.ts</code> never ships to the browser, so it can safely read <code>process.env.LLM_API_KEY</code>, hold DB credentials, and call the LLM. The moment you move that call into a client component, the key would leak. Knowing <em>where</em> code executes is the core mental model of Next.js. <em>Why beyond syllabus: the server/client boundary is Next.js\\u2019s defining idea, and the source of most beginner security bugs.</em></div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610#module-379" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">API Routes &amp; server proxy on Code Lab</span><span class="lc-sub">Route Handlers, request/response and the server boundary.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.1</span>
<h2>Khởi tạo dự án &amp; kiến trúc phân lớp</h2>
<p class="lead">Tạo khung bằng <code>npx create-next-app@latest screen --ts --app</code>, thêm <code>prisma</code>, <code>zod</code>, <code>bcryptjs</code> và <code>jsonwebtoken</code>. Rồi quyết định các lớp ngay từ đầu — Route Handler mỏng; việc thật nằm trong lớp service không biết gì về HTTP.</p>

<h3>Prisma client — một instance cho cả app</h3>
<pre><span class="tok-comment">// lib/prisma.ts — một singleton để hot-reload dev không mở 100 kết nối</span>
<span class="tok-keyword">import</span> { PrismaClient } <span class="tok-keyword">from</span> <span class="tok-string">'@prisma/client'</span>;

<span class="tok-keyword">const</span> g = globalThis <span class="tok-keyword">as</span> <span class="tok-keyword">unknown</span> <span class="tok-keyword">as</span> { prisma?: PrismaClient };
<span class="tok-keyword">export const</span> prisma = g.prisma ?? <span class="tok-keyword">new</span> PrismaClient();
<span class="tok-keyword">if</span> (process.env.NODE_ENV !== <span class="tok-string">'production'</span>) g.prisma = prisma;</pre>

<h3>.env — nơi bí mật sống (chỉ server)</h3>
<pre><span class="tok-comment"># .env — KHÔNG BAO GIỜ commit; thêm vào .gitignore</span>
DATABASE_URL=<span class="tok-string">"postgresql://postgres:screen@localhost:5432/screen"</span>
JWT_SECRET=<span class="tok-string">"change-me-32-bytes-minimum"</span>
LLM_API_URL=<span class="tok-string">"https://your-llm-provider/v1/chat"</span>
LLM_API_KEY=<span class="tok-string">"sk-..."</span>            <span class="tok-comment"># chỉ phía server — KHÔNG tiền tố NEXT_PUBLIC_</span></pre>

<h3>Ba lớp — mỗi lớp một trách nhiệm</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Route Handler</b> (<code>app/api/**/route.ts</code>) — chỉ lo HTTP. Đọc request, kiểm auth, validate input bằng zod, gọi service, trả <code>NextResponse.json</code> kèm status code. <em>Không có business logic ở đây.</em></div>
  <div class="lz-layer"><b>Service</b> (<code>lib/services/*.ts</code>) — quy tắc nghiệp vụ. "Ứng viên này nộp được không? Chạy sàng lọc, đặt trạng thái." Sở hữu transaction. <em>Không biết gì về HTTP.</em></div>
  <div class="lz-layer"><b>Data</b> (<code>lib/prisma.ts</code> + model) — truy cập CSDL qua Prisma. <em>Không biết gì về quy tắc nghiệp vụ.</em></div>
</div>
<div class="diagram">HTTP request
   │
   ▼
Route Handler ──dto──▶ Service ──prisma──▶ PostgreSQL
   ▲                     │
   └──json/status────────┘  (ánh xạ kết quả → 200/201/403/409…)</div>

<div class="callout ok">Vì sao phải phân lớp? Vì khi đó bạn có thể <strong>unit-test service không cần HTTP</strong> và <strong>dùng lại nó từ một Route Handler hay một Server Action</strong>. Mỗi lớp chỉ phụ thuộc lớp ngay dưới.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Route Handler chỉ chạy ở server — đó là toàn bộ mô hình bảo mật.</b> Code trong <code>app/api/**/route.ts</code> không bao giờ ship xuống trình duyệt, nên nó có thể an toàn đọc <code>process.env.LLM_API_KEY</code>, giữ thông tin đăng nhập DB, và gọi LLM. Khoảnh khắc bạn chuyển lời gọi đó vào một client component, khoá sẽ lộ. Biết code chạy <em>ở đâu</em> là mô hình tư duy cốt lõi của Next.js. <em>Vì sao ngoài syllabus: ranh giới server/client là ý tưởng định danh của Next.js, và là nguồn của phần lớn lỗi bảo mật của người mới.</em></div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610#module-379" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">API Routes &amp; server proxy trên Code Lab</span><span class="lc-sub">Route Handler, request/response và ranh giới server.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — The data layer & Prisma queries|||2.2 — Lớp dữ liệu & truy vấn Prisma',
          slug: 'int610-data-layer',
          type: 'VIDEO',
          description: 'Migrate schema, seed dữ liệu demo, và viết các truy vấn Prisma có include quan hệ — không phải viết SQL.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.2</span>
<h2>The data layer &amp; Prisma queries</h2>
<p class="lead">With the schema from Section 1, one command creates the tables, and Prisma gives you a fully typed client. You write queries as method calls; Prisma writes the SQL and types the result.</p>

<h3>Migrate &amp; generate</h3>
<pre><span class="tok-comment"># create the SQL migration and apply it to the dev database</span>
npx prisma migrate dev --name init
<span class="tok-comment"># regenerate the typed client after any schema change</span>
npx prisma generate
<span class="tok-comment"># open a GUI to see your data</span>
npx prisma studio</pre>

<h3>Typed queries with relations</h3>
<pre><span class="tok-comment">// lib/services/application.service.ts</span>
<span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">'../prisma'</span>;

<span class="tok-comment">// all applications for one job, with candidate + screening scores</span>
<span class="tok-keyword">export function</span> <span class="tok-function">applicationsForJob</span>(jobId: <span class="tok-type">number</span>) {
  <span class="tok-keyword">return</span> prisma.application.findMany({
    <span class="tok-keyword">where</span>: { jobId },
    <span class="tok-keyword">include</span>: {
      candidate: { <span class="tok-keyword">select</span>: { id: <span class="tok-keyword">true</span>, fullName: <span class="tok-keyword">true</span>, email: <span class="tok-keyword">true</span> } },
      screening: { <span class="tok-keyword">include</span>: { criterionScores: <span class="tok-keyword">true</span> } },
    },
    orderBy: { createdAt: <span class="tok-string">'desc'</span> },
  });
}

<span class="tok-comment">// guard used everywhere: does this application belong to this candidate?</span>
<span class="tok-keyword">export function</span> <span class="tok-function">findOwnApplication</span>(id: <span class="tok-type">number</span>, candidateId: <span class="tok-type">number</span>) {
  <span class="tok-keyword">return</span> prisma.application.findFirst({ <span class="tok-keyword">where</span>: { id, candidateId } });
}</pre>

<h3>Worked example — what Prisma runs</h3>
<div class="out"><b>Call:</b>  applicationsForJob(5)
<b>Prisma emits (roughly):</b>
  SELECT * FROM "Application" WHERE "jobId" = 5 ORDER BY "createdAt" DESC;
  SELECT id, "fullName", email FROM "User" WHERE id IN (7, 9, 12);
  SELECT * FROM "Screening" WHERE "applicationId" IN (...);
  SELECT * FROM "CriterionScore" WHERE "screeningId" IN (...);
<b>Result (typed):</b> Application[] each with candidate + screening.criterionScores nested — ready to send as JSON.</div>

<div class="pitfall"><strong>Trap:</strong> selecting the whole User (including <code>password</code>) when you only need a name. Always <code>select</code> the fields you return, or you will leak the bcrypt hash into an API response. Never spread a raw <code>User</code> row into JSON.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b><code>include</code> vs the N+1 problem.</b> Prisma\\u2019s <code>include</code> batches the related rows into a few <code>IN (...)</code> queries — not one query per parent. If you instead looped and fetched each candidate separately, you would fire one query per application (the classic N+1). One nested <code>include</code> is both cleaner and dramatically faster. <em>Why beyond syllabus: recognising and avoiding N+1 is a performance skill the syllabus rarely tests.</em></div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610#module-380" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Auth &amp; DB with Next.js on Code Lab</span><span class="lc-sub">Wiring a database and protecting routes — hands-on.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.2</span>
<h2>Lớp dữ liệu &amp; truy vấn Prisma</h2>
<p class="lead">Với schema ở Mục 1, một lệnh tạo ra các bảng, và Prisma cho bạn một client có kiểu đầy đủ. Bạn viết truy vấn thành lời gọi method; Prisma viết SQL và gán kiểu cho kết quả.</p>

<h3>Migrate &amp; generate</h3>
<pre><span class="tok-comment"># tạo migration SQL và áp vào CSDL dev</span>
npx prisma migrate dev --name init
<span class="tok-comment"># sinh lại client có kiểu sau mỗi lần đổi schema</span>
npx prisma generate
<span class="tok-comment"># mở GUI để xem dữ liệu</span>
npx prisma studio</pre>

<h3>Truy vấn có kiểu với quan hệ</h3>
<pre><span class="tok-comment">// lib/services/application.service.ts</span>
<span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">'../prisma'</span>;

<span class="tok-comment">// mọi đơn của một vị trí, kèm ứng viên + điểm screening</span>
<span class="tok-keyword">export function</span> <span class="tok-function">applicationsForJob</span>(jobId: <span class="tok-type">number</span>) {
  <span class="tok-keyword">return</span> prisma.application.findMany({
    <span class="tok-keyword">where</span>: { jobId },
    <span class="tok-keyword">include</span>: {
      candidate: { <span class="tok-keyword">select</span>: { id: <span class="tok-keyword">true</span>, fullName: <span class="tok-keyword">true</span>, email: <span class="tok-keyword">true</span> } },
      screening: { <span class="tok-keyword">include</span>: { criterionScores: <span class="tok-keyword">true</span> } },
    },
    orderBy: { createdAt: <span class="tok-string">'desc'</span> },
  });
}

<span class="tok-comment">// guard dùng khắp nơi: đơn này có thuộc ứng viên này không?</span>
<span class="tok-keyword">export function</span> <span class="tok-function">findOwnApplication</span>(id: <span class="tok-type">number</span>, candidateId: <span class="tok-type">number</span>) {
  <span class="tok-keyword">return</span> prisma.application.findFirst({ <span class="tok-keyword">where</span>: { id, candidateId } });
}</pre>

<h3>Ví dụ có lời giải — Prisma chạy gì</h3>
<div class="out"><b>Gọi:</b>  applicationsForJob(5)
<b>Prisma phát (đại khái):</b>
  SELECT * FROM "Application" WHERE "jobId" = 5 ORDER BY "createdAt" DESC;
  SELECT id, "fullName", email FROM "User" WHERE id IN (7, 9, 12);
  SELECT * FROM "Screening" WHERE "applicationId" IN (...);
  SELECT * FROM "CriterionScore" WHERE "screeningId" IN (...);
<b>Kết quả (có kiểu):</b> Application[] mỗi cái kèm candidate + screening.criterionScores lồng nhau — sẵn sàng gửi dưới dạng JSON.</div>

<div class="pitfall"><strong>Bẫy:</strong> select cả User (gồm <code>password</code>) khi bạn chỉ cần một cái tên. Luôn <code>select</code> các field bạn trả về, nếu không bạn sẽ để lộ hash bcrypt vào một phản hồi API. Đừng bao giờ spread một dòng <code>User</code> thô vào JSON.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b><code>include</code> vs vấn đề N+1.</b> <code>include</code> của Prisma gộp các dòng liên quan thành vài truy vấn <code>IN (...)</code> — không phải một truy vấn cho mỗi cha. Nếu thay vào đó bạn lặp và nạp từng ứng viên riêng, bạn sẽ bắn một truy vấn cho mỗi đơn (N+1 kinh điển). Một <code>include</code> lồng vừa sạch hơn vừa nhanh hơn nhiều. <em>Vì sao ngoài syllabus: nhận ra và tránh N+1 là kỹ năng hiệu năng mà giáo trình ít kiểm.</em></div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610#module-380" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Auth &amp; DB với Next.js trên Code Lab</span><span class="lc-sub">Nối CSDL và bảo vệ route — thực hành.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.3 — Worked slice: GET a job\\u2019s applications|||2.3 — Lát cắt có lời giải: GET các đơn của một vị trí',
          slug: 'int610-slice-applications',
          type: 'VIDEO',
          description: 'Đi trọn một lát cắt dọc: zod input → service → Route Handler → thử bằng curl, có kết quả JSON thật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.3</span>
<h2>Worked slice — GET a job&#39;s applications</h2>
<p class="lead">Let&#39;s ship the first vertical slice end-to-end: a Route Handler that returns one job&#39;s applications as clean JSON, recruiter-only. This is the template every other read endpoint copies.</p>

<h3>Step 1 — the Route Handler (HTTP only)</h3>
<pre><span class="tok-comment">// app/api/jobs/[id]/applications/route.ts</span>
<span class="tok-keyword">import</span> { NextRequest, NextResponse } <span class="tok-keyword">from</span> <span class="tok-string">'next/server'</span>;
<span class="tok-keyword">import</span> { requireRole } <span class="tok-keyword">from</span> <span class="tok-string">'@/lib/auth'</span>;
<span class="tok-keyword">import</span> { applicationsForJob } <span class="tok-keyword">from</span> <span class="tok-string">'@/lib/services/application.service'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">GET</span>(req: NextRequest, { params }: { params: { id: <span class="tok-type">string</span> } }) {
  <span class="tok-keyword">const</span> me = <span class="tok-keyword">await</span> requireRole(req, <span class="tok-string">'RECRUITER'</span>);   <span class="tok-comment">// throws 401/403 (Section 3)</span>
  <span class="tok-keyword">const</span> rows = <span class="tok-keyword">await</span> applicationsForJob(Number(params.id));
  <span class="tok-keyword">return</span> NextResponse.json(rows.map(toDto));
}

<span class="tok-comment">// map to a safe shape — never leak the password hash</span>
<span class="tok-keyword">function</span> <span class="tok-function">toDto</span>(a: <span class="tok-keyword">any</span>) {
  <span class="tok-keyword">return</span> {
    id: a.id, status: a.status, cvUrl: a.cvUrl,
    candidate: a.candidate,
    overallScore: a.screening?.overallScore ?? <span class="tok-keyword">null</span>,
  };
}</pre>

<h3>Step 2 — test it (real output)</h3>
<div class="out"><b>Request:</b>  curl -H "Authorization: Bearer &lt;recruiter-jwt&gt;" \\
             http://localhost:3000/api/jobs/5/applications
<b>Response 200:</b>
[
  { "id": 31, "status": "SCREENED", "cvUrl": "/uploads/an.pdf",
    "candidate": { "id": 7, "fullName": "An", "email": "an@mail.com" },
    "overallScore": 7 },
  { "id": 32, "status": "APPLIED", "cvUrl": "/uploads/binh.pdf",
    "candidate": { "id": 9, "fullName": "Binh", "email": "binh@mail.com" },
    "overallScore": null }
]
<b>As a candidate?</b>  same URL with a candidate token → 403 Forbidden.</div>
<p>That is a complete slice: request → auth → service → Prisma → JSON. Every other GET endpoint (my applications, one application detail) is this same shape.</p>

<div class="callout ok"><strong>Rhythm to internalise:</strong> auth first, then service (the intent), then a DTO map (the safe shape). The Route Handler stays tiny; the service is reusable and testable.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Design the API contract, not just the code.</b> Notice <code>overallScore</code> is <code>null</code> until screening runs — a deliberate, documented shape the frontend can rely on ("no score yet" vs "score 0"). Deciding the JSON contract up front — status codes, nullability, field names — is API design, and it is what makes the frontend and backend able to move independently. <em>Why beyond syllabus: treating the API as a versioned contract is a professional practice the syllabus rarely frames.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610#module-528" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">API design best practices on Code Lab</span><span class="lc-sub">Resources, status codes and clean JSON contracts.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.3</span>
<h2>Lát cắt có lời giải — GET các đơn của một vị trí</h2>
<p class="lead">Hãy ship lát cắt dọc đầu tiên từ đầu đến cuối: một Route Handler trả về các đơn của một vị trí dưới dạng JSON sạch, chỉ cho recruiter. Đây là khuôn mà mọi endpoint đọc khác sao chép lại.</p>

<h3>Bước 1 — Route Handler (chỉ HTTP)</h3>
<pre><span class="tok-comment">// app/api/jobs/[id]/applications/route.ts</span>
<span class="tok-keyword">import</span> { NextRequest, NextResponse } <span class="tok-keyword">from</span> <span class="tok-string">'next/server'</span>;
<span class="tok-keyword">import</span> { requireRole } <span class="tok-keyword">from</span> <span class="tok-string">'@/lib/auth'</span>;
<span class="tok-keyword">import</span> { applicationsForJob } <span class="tok-keyword">from</span> <span class="tok-string">'@/lib/services/application.service'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">GET</span>(req: NextRequest, { params }: { params: { id: <span class="tok-type">string</span> } }) {
  <span class="tok-keyword">const</span> me = <span class="tok-keyword">await</span> requireRole(req, <span class="tok-string">'RECRUITER'</span>);   <span class="tok-comment">// ném 401/403 (Mục 3)</span>
  <span class="tok-keyword">const</span> rows = <span class="tok-keyword">await</span> applicationsForJob(Number(params.id));
  <span class="tok-keyword">return</span> NextResponse.json(rows.map(toDto));
}

<span class="tok-comment">// ánh xạ sang hình dạng an toàn — không bao giờ lộ hash mật khẩu</span>
<span class="tok-keyword">function</span> <span class="tok-function">toDto</span>(a: <span class="tok-keyword">any</span>) {
  <span class="tok-keyword">return</span> {
    id: a.id, status: a.status, cvUrl: a.cvUrl,
    candidate: a.candidate,
    overallScore: a.screening?.overallScore ?? <span class="tok-keyword">null</span>,
  };
}</pre>

<h3>Bước 2 — thử nó (kết quả thật)</h3>
<div class="out"><b>Request:</b>  curl -H "Authorization: Bearer &lt;recruiter-jwt&gt;" \\
             http://localhost:3000/api/jobs/5/applications
<b>Response 200:</b>
[
  { "id": 31, "status": "SCREENED", "cvUrl": "/uploads/an.pdf",
    "candidate": { "id": 7, "fullName": "An", "email": "an@mail.com" },
    "overallScore": 7 },
  { "id": 32, "status": "APPLIED", "cvUrl": "/uploads/binh.pdf",
    "candidate": { "id": 9, "fullName": "Binh", "email": "binh@mail.com" },
    "overallScore": null }
]
<b>Là ứng viên?</b>  cùng URL với token ứng viên → 403 Forbidden.</div>
<p>Đó là một lát cắt hoàn chỉnh: request → auth → service → Prisma → JSON. Mọi endpoint GET khác (đơn của tôi, chi tiết một đơn) đều cùng hình dạng này.</p>

<div class="callout ok"><strong>Nhịp cần thấm:</strong> auth trước, rồi service (ý định), rồi map DTO (hình dạng an toàn). Route Handler giữ nhỏ xíu; service dùng lại được và test được.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thiết kế hợp đồng API, không chỉ code.</b> Chú ý <code>overallScore</code> là <code>null</code> tới khi sàng lọc chạy — một hình dạng có chủ đích, có tài liệu mà frontend dựa vào ("chưa có điểm" vs "điểm 0"). Quyết hợp đồng JSON từ đầu — status code, tính null, tên field — là thiết kế API, và chính nó khiến frontend và backend đi độc lập được. <em>Vì sao ngoài syllabus: coi API như một hợp đồng có phiên bản là thực hành chuyên nghiệp mà giáo trình ít nêu.</em></div>

<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fai-recruitment-screening%2Flearn&reflabel=INT610#module-528" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Thực hành thiết kế API tốt trên Code Lab</span><span class="lc-sub">Resource, status code và hợp đồng JSON sạch.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },
  ],
};
