/**
 * INT609 — AI Study Assistant (RAG chatbot) (Kỳ 6 — Thực tập, project #9).
 * Full-stack Next.js 14 (App Router) + Route Handlers (server-side LLM proxy + streaming)
 * + Prisma + PostgreSQL/pgvector (embeddings) + an LLM API.
 * Project-course theo khuôn Academy: Mục 0 (giới thiệu + kiến trúc + stack + kịch bản quay video)
 * → domain/DB design (pgvector) → App Router & server-side LLM proxy → auth & data-isolation
 * → RAG core (retrieve top-k → grounded prompt → citations, streamed) + hallucination guard
 * → chat UI (streaming + citations) → testing → deployment (Docker + pgvector) → nâng cao (★).
 * Song ngữ EN/VN đối xứng. Code Next/React/SQL <pre>+.tok-*; ví dụ giải từng bước + ★.
 * Deep-link CodeLab nextjs/react/prisma-orm/authentication; Docker → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/INT609.mjs --apply
 * ⚠️ Escaping: backtick trong code = &#96; ; ${...} (JS template) = \${ ; \n hiển thị = \\n ; quiz apostrophe = \' hoặc bọc nháy kép.
 */
export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    academyType: 'FPT',
    courseCode: 'INT609',
    title: 'AI Study Assistant',
    slug: 'ai-study-assistant',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Internship project #9 — an AI Study Assistant: a Next.js 14 RAG chatbot answering only from the student own uploaded notes, with citations and streaming. Postgres + pgvector store embeddings; the LLM key stays server-side behind a Route Handler proxy.|||Đồ án thực tập #9 — AI Study Assistant: chatbot RAG Next.js 14 trả lời chỉ từ ghi chú sinh viên, có trích dẫn và streaming. Postgres + pgvector lưu embedding; khoá LLM ở server sau Route Handler proxy, không lộ trình duyệt.',
    description: 'INT609 là đồ án thực tập của Kỳ 6: bạn xây một TRỢ LÝ HỌC TẬP AI (AI Study Assistant) hoàn chỉnh — một chatbot RAG (Retrieval-Augmented Generation) trả lời câu hỏi của sinh viên DỰA TRÊN chính ghi chú/PDF mà họ tải lên, kèm trích dẫn (citation) tới đúng đoạn nguồn, và câu trả lời được stream về giao diện theo thời gian thực. Toàn bộ là một app Next.js 14 (App Router): frontend React và backend Route Handler nằm trong cùng một dự án. Dữ liệu lưu trong PostgreSQL với extension pgvector để lưu và tìm kiếm vector embedding; truy vấn qua Prisma. Trọng tâm kỹ thuật số 1 là LÕI RAG ĐÚNG: chia nhỏ (chunk) ghi chú → nhúng (embed) thành vector → lưu vector → khi có câu hỏi thì tìm top-k đoạn liên quan → dựng một prompt "được nối đất" (grounded) → LLM chỉ trả lời TỪ ngữ cảnh đó KÈM trích dẫn, không bịa (chống hallucination). Trụ cột số 2 (nối thẳng với bài học "bí mật" của INT601): khoá API của LLM KHÔNG BAO GIỜ ship xuống trình duyệt — mọi lời gọi model đi qua một Route Handler phía server đọc khoá từ biến môi trường lúc chạy. Cuối cùng đóng gói cả hệ (app + postgres/pgvector) bằng Docker và viết kịch bản demo để quay video. Đây là dự án "ứng dụng LLM thật" của thực tập: mọi sản phẩm AI trên nền tài liệu riêng đều là biến thể của khuôn này.',
    whatYouLearn: 'Hiểu và triển khai một pipeline RAG đúng từ đầu đến cuối (chunk → embed → lưu vector → truy hồi top-k → grounded prompt → sinh câu trả lời kèm citation); thiết kế schema PostgreSQL + pgvector cho documents/chunks/embeddings và đánh index vector (HNSW/IVFFlat) với toán tử khoảng cách cosine; dựng app Next.js 14 App Router với Server Components + Route Handlers; MẪU PROXY PHÍA SERVER cho khoá LLM (đọc từ runtime env, không NEXT_PUBLIC_*, không bao giờ lộ ra client) và streaming câu trả lời về UI; xác thực + CÔ LẬP DỮ LIỆU theo từng sinh viên (mỗi người chỉ hỏi được ghi chú của chính mình); React chat UI có streaming và hiển thị trích dẫn bấm được; AI có trách nhiệm: chống hallucination bằng grounding, câu "tôi không biết" khi không có ngữ cảnh, và bảo vệ trước prompt injection; kiểm thử chất lượng truy hồi và tính "được nối đất" của câu trả lời; đóng gói Docker Compose (app + postgres/pgvector) + biến môi trường; và một kịch bản quay video demo chuyên nghiệp.',
    requirements: 'Nên đã học FER202 (React) và các môn web/CSDL nền tảng. Cần: Node.js LTS (20.x+), một IDE (VS Code khuyên dùng), Docker Desktop (để chạy Postgres + pgvector), MỘT khoá API của một nhà cung cấp LLM đặt làm biến môi trường phía server (KHÔNG phải NEXT_PUBLIC_*), Postman (hoặc REST Client) để thử endpoint, và một tài khoản GitHub cho nhóm.',
    documentsNote: 'Tham chiếu: Next.js Documentation (nextjs.org/docs — App Router, Route Handlers, Streaming) • React docs (react.dev) • Prisma Docs (prisma.io/docs) • PostgreSQL Documentation • pgvector README (github.com/pgvector/pgvector). Công cụ: VS Code, Docker Desktop, DBeaver/pgAdmin, Postman. Luyện code: track Code Lab Next.js + React + Prisma ORM + Authentication. LLM KHÔNG có track Code Lab riêng — trọng tâm là mẫu proxy phía server (đọc khoá từ runtime env) và pipeline RAG. Git & Docker: Exp Hub. Đây là project-course thực tập — vừa xây vừa quay video theo kịch bản ở bài 0.5.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Project Guide|||Mục 0 — Giới thiệu đồ án & Hướng dẫn',
      description: 'Đọc trước tiên: xây gì, kiến trúc client–server–DB của một app RAG, tech stack & lý do chọn, cài môi trường, và kịch bản quay video demo.',
      lessons: [
        {
          title: '0.1 — What you will build & the architecture map|||0.1 — Bạn sẽ xây gì & bản đồ kiến trúc',
          slug: 'int609-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: một trợ lý học tập AI thật, kiến trúc RAG, và bản đồ vòng đời từ chunk/embedding tới Docker.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What you will build — an AI Study Assistant (RAG chatbot)</h2>
<p class="lead">This is an <strong>internship project</strong>, not a lecture. You will build one real, deployable web application: an <strong>AI Study Assistant</strong> where a student uploads their own notes and PDFs, asks a question in plain language, and gets an answer that is <strong>grounded only in those notes</strong> — with <strong>citations</strong> pointing back to the exact source passages, streamed into the UI token by token. By the end you have a running full-stack app, tested and shipped in Docker, plus a recorded demo.</p>
<p>Every "AI over your own documents" product — a support bot over a manual, a legal assistant over contracts, a study tool over lecture notes — is a variation of this skeleton: a <strong>RAG pipeline</strong> that retrieves the right context, an authenticated <strong>server-side proxy</strong> that hides the model key, and a <strong>grounded prompt</strong> that makes the model answer from evidence instead of hallucinating. Master this one and the others are re-skins.</p>

<h3>The system in one picture — client / server / database</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">React chat UI (browser)</div><div class="lz-d">Next.js Client Components · streaming · citations</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Next.js Route Handlers</div><div class="lz-d">server-side LLM proxy · retrieval · grounded prompt</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL + pgvector</div><div class="lz-d">documents · chunks · embeddings (vectors)</div></div>
</div>
<div class="diagram">Browser  ──HTTP/stream──▶  Next.js Route Handler  ──Prisma/SQL──▶  Postgres+pgvector
  React chat            (server, reads LLM_API_KEY)              (vector search: &lt;=&gt; )
  (Client Comp.)   ──────▶  LLM API  (key NEVER in the browser)</div>

<h3>The build roadmap — your whole internship sprint</h3>
<div class="lz-map">
  <div class="lz-stage">Design</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Domain &amp; database design (pgvector)</div><div class="lz-nsub">documents · chunks · embeddings · the vector column &amp; index that make search possible</div></div></div>
  <div class="lz-stage">Server</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">App Router &amp; the server-side LLM proxy</div><div class="lz-nsub">Route Handlers · key from runtime env · the ingestion pipeline (chunk → embed → store)</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Auth &amp; data isolation</div><div class="lz-nsub">login · a student can only query their OWN notes</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">The RAG core</div><div class="lz-nsub">retrieve top-k → grounded prompt → answer WITH citations · streamed · no hallucination</div></div></div>
  <div class="lz-stage">Frontend</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">React chat UI</div><div class="lz-nsub">streaming answer · clickable citations · upload &amp; history</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">retrieval quality · a groundedness test that proves the answer cites real chunks</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Deployment</div><div class="lz-nsub">Docker Compose: app + postgres/pgvector · env config · smoke test</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Hybrid search · reranking · an eval harness · caching</div><div class="lz-nsub">Ship like a real AI engineering team</div></div></div>
</div>

<div class="callout ok">The one habit that decides your grade: <strong>ship a thin vertical slice first</strong> — upload one note → ask one question → get one grounded answer with a citation — then grow it. A tiny end-to-end RAG flow that runs beats a huge design that never answers correctly.</div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fai-study-assistant%2Flearn&reflabel=INT609#module-374" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Practice Next.js on Code Lab</span><span class="lc-sub">Warm up the App Router, Server Components and Route Handlers before you start the project.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bạn sẽ xây gì — một Trợ lý học tập AI (chatbot RAG)</h2>
<p class="lead">Đây là một <strong>đồ án thực tập</strong>, không phải bài giảng. Bạn sẽ xây một ứng dụng web thật, triển khai được: một <strong>Trợ lý học tập AI</strong>, nơi sinh viên tải lên ghi chú và PDF của chính mình, hỏi bằng ngôn ngữ tự nhiên, và nhận câu trả lời <strong>chỉ dựa trên những ghi chú đó</strong> — kèm <strong>trích dẫn (citation)</strong> trỏ về đúng đoạn nguồn, được stream vào giao diện từng token. Kết thúc, bạn có một app full-stack chạy được, đã test và đóng gói Docker, kèm một video demo.</p>
<p>Mọi sản phẩm "AI trên tài liệu riêng" — bot hỗ trợ trên một cuốn manual, trợ lý pháp lý trên hợp đồng, công cụ học trên ghi chú bài giảng — đều là biến thể của bộ khung này: một <strong>pipeline RAG</strong> truy hồi đúng ngữ cảnh, một <strong>proxy phía server</strong> có xác thực giấu khoá model, và một <strong>prompt được nối đất</strong> khiến model trả lời từ bằng chứng thay vì bịa. Làm chủ cái này thì các sản phẩm khác chỉ là "thay áo".</p>

<h3>Hệ thống trong một bức tranh — client / server / CSDL</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">React chat UI (trình duyệt)</div><div class="lz-d">Next.js Client Components · streaming · citation</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Next.js Route Handlers</div><div class="lz-d">proxy LLM phía server · truy hồi · grounded prompt</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">PostgreSQL + pgvector</div><div class="lz-d">documents · chunks · embeddings (vector)</div></div>
</div>
<div class="diagram">Trình duyệt ──HTTP/stream──▶  Next.js Route Handler  ──Prisma/SQL──▶  Postgres+pgvector
  React chat            (server, đọc LLM_API_KEY)              (tìm vector: &lt;=&gt; )
  (Client Comp.)   ──────▶  LLM API  (khoá KHÔNG BAO GIỜ ở trình duyệt)</div>

<h3>Lộ trình xây dựng — cả sprint thực tập của bạn</h3>
<div class="lz-map">
  <div class="lz-stage">Thiết kế</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế domain &amp; CSDL (pgvector)</div><div class="lz-nsub">documents · chunks · embeddings · cột vector &amp; index khiến việc tìm kiếm khả thi</div></div></div>
  <div class="lz-stage">Server</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">App Router &amp; proxy LLM phía server</div><div class="lz-nsub">Route Handler · khoá từ runtime env · pipeline nạp (chunk → embed → lưu)</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Xác thực &amp; cô lập dữ liệu</div><div class="lz-nsub">đăng nhập · một sinh viên chỉ hỏi được ghi chú CỦA MÌNH</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Lõi RAG</div><div class="lz-nsub">truy hồi top-k → grounded prompt → trả lời KÈM trích dẫn · streamed · không bịa</div></div></div>
  <div class="lz-stage">Frontend</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">React chat UI</div><div class="lz-nsub">câu trả lời streaming · trích dẫn bấm được · tải lên &amp; lịch sử</div></div></div>
  <div class="lz-stage">Ship</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">chất lượng truy hồi · một test tính-được-nối-đất chứng minh câu trả lời trích dẫn chunk thật</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Triển khai</div><div class="lz-nsub">Docker Compose: app + postgres/pgvector · cấu hình env · smoke test</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Hybrid search · reranking · bộ eval · caching</div><div class="lz-nsub">Ship như một đội kỹ sư AI thật</div></div></div>
</div>

<div class="callout ok">Thói quen quyết định điểm số: <strong>ship một lát cắt dọc mỏng trước</strong> — tải một ghi chú → hỏi một câu → nhận một câu trả lời được nối đất kèm trích dẫn — rồi mới mở rộng. Một luồng RAG nhỏ chạy được từ đầu đến cuối hơn hẳn một bản thiết kế đồ sộ không bao giờ trả lời đúng.</div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fai-study-assistant%2Flearn&reflabel=INT609#module-374" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Luyện Next.js trên Code Lab</span><span class="lc-sub">Khởi động App Router, Server Components và Route Handlers trước khi bắt đầu đồ án.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Scope, roles & acceptance criteria|||0.2 — Phạm vi, vai trò & tiêu chí nghiệm thu',
          slug: 'int609-pham-vi',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Đúng phạm vi để làm xong: một vai trò chính, luồng RAG lõi, và bảng tiêu chí nghiệm thu bạn tự chấm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Scope, roles &amp; acceptance criteria</h2>
<p class="lead">The fastest way to fail an internship project is to build too much and finish nothing. Lock the scope now: <strong>one main role, one RAG core, a handful of screens</strong>. Everything else is optional polish.</p>

<h3>Roles — one is enough for a real, useful product</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">STUDENT</span><span class="v">Register/login · upload notes/PDFs · ask questions · get answers WITH citations · see chat history · manage own documents</span></div>
  <div class="kv"><span class="k">ADMIN (optional)</span><span class="v">Login · see all users &amp; documents · inspect token usage · delete abusive content</span></div>
</div>

<h3>The core workflow — your vertical slice</h3>
<div class="diagram">STUDENT uploads a note ──▶ chunk ──▶ embed ──▶ store vectors  (ingestion)
        │
        ▼
STUDENT asks "What is X?" ──▶ embed the question ──▶ retrieve top-k chunks
        │                                                     │
        ▼                                                     ▼
   grounded prompt (context + question) ──▶ LLM ──▶ answer + [1][2] citations (streamed)</div>

<h3>Acceptance criteria — grade yourself before the demo</h3>
<table>
<thead><tr><th>#</th><th>Must pass</th><th>How to check</th></tr></thead>
<tbody>
<tr><td>1</td><td>A student can register, log in, and upload a note</td><td>POST /api/documents stores rows in documents + chunks</td></tr>
<tr><td>2</td><td>Uploading a note produces embeddings for its chunks</td><td>every chunk row has a non-null <code>embedding vector</code></td></tr>
<tr><td>3</td><td>A question retrieves the most relevant chunks of that user</td><td>vector search returns top-k ordered by cosine distance</td></tr>
<tr><td>4</td><td><b>The answer is grounded and cites real chunks</b></td><td>every claim maps to a returned chunk; sources are shown as [1][2]</td></tr>
<tr><td>5</td><td><b>The LLM key never reaches the browser</b></td><td>DevTools Network + bundle search show no key; all calls hit /api/*</td></tr>
<tr><td>6</td><td>A student can only query their OWN documents</td><td>querying with another user session returns no cross-user chunks</td></tr>
<tr><td>7</td><td>"I could not find that in your notes" when nothing matches</td><td>ask about a topic not in the notes → a refusal, not a hallucination</td></tr>
<tr><td>8</td><td>The whole system runs from one <code>docker compose up</code></td><td>app on :3000, postgres+pgvector healthy</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Scope killers — say no.</strong> Training or fine-tuning your own model, a multi-agent framework, voice input, a mobile app, "chat with the whole internet". A study assistant grounded in the student notes with correct citations scores; breadth with a hallucinating bot does not. Depth on the RAG core and the server-side key is where the marks are.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write acceptance criteria as tests, not prose.</b> Rows 3, 4 and 7 above each map to one automated test (you write them in Section 6). "Definition of Done = the tests are green" removes every argument about whether retrieval works or whether the bot hallucinates. <em>Why beyond syllabus: turning a checklist into executable specs — especially for a non-deterministic AI feature — is exactly how professional teams gate an AI release.</em></div>

<div class="note-ct">Next: <b>0.3</b> justifies the tech stack, <b>0.4</b> installs it, <b>0.5</b> is your video-demo script.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Phạm vi, vai trò &amp; tiêu chí nghiệm thu</h2>
<p class="lead">Cách nhanh nhất để trượt một đồ án thực tập là ôm quá nhiều rồi chẳng xong cái gì. Chốt phạm vi ngay: <strong>một vai trò chính, một lõi RAG, vài màn hình</strong>. Mọi thứ khác chỉ là tô điểm tuỳ chọn.</p>

<h3>Vai trò — một cái là đủ cho một sản phẩm thật, hữu ích</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SINH VIÊN</span><span class="v">Đăng ký/đăng nhập · tải ghi chú/PDF · đặt câu hỏi · nhận trả lời KÈM trích dẫn · xem lịch sử chat · quản lý tài liệu của mình</span></div>
  <div class="kv"><span class="k">ADMIN (tuỳ chọn)</span><span class="v">Đăng nhập · xem mọi người dùng &amp; tài liệu · xem lượng token dùng · xoá nội dung vi phạm</span></div>
</div>

<h3>Luồng lõi — lát cắt dọc của bạn</h3>
<div class="diagram">SINH VIÊN tải ghi chú ──▶ chunk ──▶ embed ──▶ lưu vector  (ingestion)
        │
        ▼
SINH VIÊN hỏi "X là gì?" ──▶ embed câu hỏi ──▶ truy hồi top-k chunk
        │                                                     │
        ▼                                                     ▼
   grounded prompt (ngữ cảnh + câu hỏi) ──▶ LLM ──▶ trả lời + trích dẫn [1][2] (streamed)</div>

<h3>Tiêu chí nghiệm thu — tự chấm trước khi demo</h3>
<table>
<thead><tr><th>#</th><th>Phải đạt</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>1</td><td>Sinh viên đăng ký, đăng nhập, tải một ghi chú</td><td>POST /api/documents ghi dòng vào documents + chunks</td></tr>
<tr><td>2</td><td>Tải một ghi chú sinh ra embedding cho các chunk của nó</td><td>mỗi dòng chunk có <code>embedding vector</code> khác null</td></tr>
<tr><td>3</td><td>Một câu hỏi truy hồi được các chunk liên quan nhất của người đó</td><td>tìm vector trả top-k sắp theo khoảng cách cosine</td></tr>
<tr><td>4</td><td><b>Câu trả lời được nối đất và trích dẫn chunk thật</b></td><td>mỗi khẳng định ứng với một chunk trả về; nguồn hiện là [1][2]</td></tr>
<tr><td>5</td><td><b>Khoá LLM không bao giờ tới trình duyệt</b></td><td>DevTools Network + tìm trong bundle không thấy khoá; mọi lời gọi qua /api/*</td></tr>
<tr><td>6</td><td>Sinh viên chỉ hỏi được tài liệu CỦA MÌNH</td><td>hỏi bằng phiên của người khác → không trả chunk chéo người dùng</td></tr>
<tr><td>7</td><td>"Không tìm thấy điều đó trong ghi chú của bạn" khi không khớp</td><td>hỏi chủ đề không có trong ghi chú → từ chối, không bịa</td></tr>
<tr><td>8</td><td>Cả hệ chạy từ một lệnh <code>docker compose up</code></td><td>app ở :3000, postgres+pgvector healthy</td></tr>
</tbody>
</table>

<div class="pitfall"><strong>Những thứ giết scope — nói không.</strong> Tự huấn luyện/fine-tune model, framework đa tác tử (multi-agent), nhập bằng giọng nói, app mobile, "chat với cả internet". Một trợ lý học tập được nối đất vào ghi chú sinh viên với trích dẫn đúng thì ăn điểm; ôm rộng mà bot vẫn bịa thì không. Sâu ở lõi RAG và khoá phía server mới là chỗ có điểm.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết tiêu chí nghiệm thu thành test, đừng viết văn.</b> Dòng 3, 4 và 7 ở trên mỗi cái ứng với một test tự động (bạn viết ở Mục 6). "Định nghĩa Hoàn thành = test xanh" xoá mọi tranh cãi về việc truy hồi có chạy không hay bot có bịa không. <em>Vì sao ngoài syllabus: biến checklist thành đặc tả chạy được — nhất là cho một tính năng AI phi tất định — chính là cách đội chuyên nghiệp "gác cổng" một bản phát hành AI.</em></div>

<div class="note-ct">Tiếp theo: <b>0.3</b> lý giải tech stack, <b>0.4</b> cài đặt, <b>0.5</b> là kịch bản quay video demo.</div>
</div>
`,
        },
        {
          title: '0.3 — The tech stack & why each choice|||0.3 — Tech stack & lý do chọn từng thứ',
          slug: 'int609-tech-stack',
          type: 'VIDEO',
          description: 'Chọn Next.js + Prisma + Postgres/pgvector + một LLM API — và biết vì sao, để trả lời hội đồng khi bị hỏi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The tech stack &amp; why each choice</h2>
<p class="lead">A reviewer will ask "why this stack?". Have a real answer. Every choice below is picked because it lets one small team ship a correct, secure RAG app fast — and because it is the mainstream industry combo for an "AI over your data" product.</p>

<h3>The stack, layer by layer</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Full-stack framework — Next.js 14 (App Router)</b><br/>One project holds both the React UI (Server + Client Components) and the backend (Route Handlers). <em>Why: the server code that holds the LLM key lives next to the UI but never ships to the browser; streaming responses are first-class.</em></div>
  <div class="lz-layer"><b>UI — React 18</b><br/>Client Components for the chat, hooks and Context for state, the streaming reader for token-by-token rendering. <em>Why: FER202 taught this; it is the most-hired frontend skill.</em></div>
  <div class="lz-layer"><b>ORM — Prisma</b><br/>Type-safe models and migrations over Postgres. Vector search uses a raw SQL escape hatch (<code>$queryRaw</code>) because pgvector operators are native SQL. <em>Why: Prisma removes JDBC-style boilerplate but still lets you drop to SQL for the vector distance operator.</em></div>
  <div class="lz-layer"><b>Database — PostgreSQL 16 + pgvector</b><br/>A real relational database that also stores and indexes <em>vector embeddings</em> and runs nearest-neighbour search with the <code>&lt;=&gt;</code> cosine-distance operator. <em>Why: no separate vector DB to run — one Postgres holds your rows AND your vectors, transactionally, with a HNSW index for speed.</em></div>
  <div class="lz-layer"><b>The model — an LLM API (embeddings + chat)</b><br/>One provider gives you an <em>embeddings</em> endpoint (text → vector) and a <em>chat/completions</em> endpoint (prompt → streamed answer). <em>Why: you rent intelligence instead of training it; the whole project is about using it correctly and securely, not building it.</em></div>
  <div class="lz-layer"><b>Ship — Docker Compose</b><br/>Two containers (app, db-with-pgvector) started by one command. <em>Why: "runs on my machine" becomes "runs anywhere"; graders love a one-command demo.</em></div>
</div>

<h3>The request journey — how a question becomes a grounded answer</h3>
<div class="diagram">Type a question  →  fetch POST /api/chat  (session cookie, NO key)
   →  Route Handler (server) reads LLM_API_KEY from process.env
   →  embed(question)         → a query vector
   →  SELECT ... ORDER BY embedding &lt;=&gt; $queryVec LIMIT k   (only this user rows)
   →  build a GROUNDED prompt: "Answer ONLY from this context. Cite sources."
   →  call the LLM chat endpoint with stream: true
   →  pipe tokens back to the browser  →  React renders text + [1][2] citations</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Postgres IS your vector database.</b> Many tutorials reach for a dedicated vector store (Pinecone, Weaviate). For this scale, pgvector inside your existing Postgres is simpler, cheaper, and keeps your rows and vectors in one transactional store — no second system to sync. Reviewers respect a student who can say "I did not need a separate vector DB because…". <em>Why beyond syllabus: choosing NOT to add infrastructure is an engineering-maturity call the syllabus never poses.</em></div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fai-study-assistant%2Flearn&reflabel=INT609#module-376" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Server Components &amp; data fetching on Code Lab</span><span class="lc-sub">Where server code and UI meet — the heart of a Next.js RAG app.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Tech stack &amp; lý do chọn từng thứ</h2>
<p class="lead">Hội đồng sẽ hỏi "sao chọn stack này?". Hãy có câu trả lời thật. Mọi lựa chọn dưới đây được chọn vì nó cho một nhóm nhỏ ship một app RAG đúng và an toàn nhanh — và là bộ combo chủ đạo của ngành cho sản phẩm "AI trên dữ liệu của bạn".</p>

<h3>Stack, theo từng lớp</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Framework full-stack — Next.js 14 (App Router)</b><br/>Một dự án chứa cả UI React (Server + Client Components) và backend (Route Handlers). <em>Vì sao: code server giữ khoá LLM nằm cạnh UI nhưng không bao giờ ship xuống trình duyệt; streaming là công dân hạng nhất.</em></div>
  <div class="lz-layer"><b>UI — React 18</b><br/>Client Components cho chat, hook và Context cho state, bộ đọc stream để render từng token. <em>Vì sao: FER202 đã dạy; là kỹ năng frontend được tuyển nhiều nhất.</em></div>
  <div class="lz-layer"><b>ORM — Prisma</b><br/>Model và migration type-safe trên Postgres. Tìm vector dùng cửa thoát SQL thô (<code>$queryRaw</code>) vì toán tử pgvector là SQL gốc. <em>Vì sao: Prisma bỏ boilerplate kiểu JDBC nhưng vẫn cho bạn xuống SQL cho toán tử khoảng cách vector.</em></div>
  <div class="lz-layer"><b>CSDL — PostgreSQL 16 + pgvector</b><br/>Một CSDL quan hệ thật mà còn lưu &amp; index <em>vector embedding</em> và chạy tìm láng giềng gần nhất bằng toán tử khoảng cách cosine <code>&lt;=&gt;</code>. <em>Vì sao: không cần chạy một vector DB riêng — một Postgres giữ cả dòng dữ liệu LẪN vector, có giao dịch, với index HNSW cho tốc độ.</em></div>
  <div class="lz-layer"><b>Model — một LLM API (embeddings + chat)</b><br/>Một nhà cung cấp cho bạn endpoint <em>embeddings</em> (text → vector) và endpoint <em>chat/completions</em> (prompt → câu trả lời stream). <em>Vì sao: bạn thuê trí tuệ thay vì huấn luyện nó; cả đồ án là về việc DÙNG nó đúng và an toàn, không phải xây nó.</em></div>
  <div class="lz-layer"><b>Triển khai — Docker Compose</b><br/>Hai container (app, db-có-pgvector) khởi động bằng một lệnh. <em>Vì sao: "chạy trên máy tôi" thành "chạy ở mọi nơi"; giám khảo thích demo một lệnh.</em></div>
</div>

<h3>Hành trình một request — một câu hỏi thành câu trả lời được nối đất</h3>
<div class="diagram">Gõ một câu hỏi  →  fetch POST /api/chat  (cookie phiên, KHÔNG có khoá)
   →  Route Handler (server) đọc LLM_API_KEY từ process.env
   →  embed(câu hỏi)         → một vector truy vấn
   →  SELECT ... ORDER BY embedding &lt;=&gt; $queryVec LIMIT k   (chỉ dòng của user này)
   →  dựng GROUNDED prompt: "Chỉ trả lời từ ngữ cảnh này. Trích dẫn nguồn."
   →  gọi endpoint chat của LLM với stream: true
   →  đẩy token về trình duyệt  →  React render text + trích dẫn [1][2]</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Postgres CHÍNH LÀ vector database của bạn.</b> Nhiều hướng dẫn vội dùng một kho vector riêng (Pinecone, Weaviate). Với quy mô này, pgvector ngay trong Postgres sẵn có đơn giản hơn, rẻ hơn, và giữ dòng dữ liệu và vector trong một kho có giao dịch — không có hệ thống thứ hai để đồng bộ. Hội đồng nể một sinh viên biết nói "tôi không cần vector DB riêng vì…". <em>Vì sao ngoài syllabus: chọn KHÔNG thêm hạ tầng là một quyết định trưởng thành kỹ thuật mà giáo trình không đặt ra.</em></div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fai-study-assistant%2Flearn&reflabel=INT609#module-376" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Server Components &amp; fetch dữ liệu trên Code Lab</span><span class="lc-sub">Nơi code server và UI gặp nhau — trái tim của một app RAG Next.js.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.4 — Set up your environment|||0.4 — Cài đặt môi trường',
          slug: 'int609-cai-dat',
          type: 'VIDEO',
          description: 'Node.js, VS Code, Docker (Postgres+pgvector), một khoá LLM đặt làm env phía server, Postman — cài một lần, dùng cả đồ án.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Set up your environment</h2>
<p class="lead">Install everything once, before you write a line of code. Verify each tool from the terminal so you never lose an afternoon to a missing Postgres extension or a mis-placed API key.</p>

<h3>The checklist</h3>
<table>
<thead><tr><th>Tool</th><th>Why</th><th>Verify command</th></tr></thead>
<tbody>
<tr><td>Node.js LTS (20.x+) + npm</td><td>build &amp; run the Next.js app</td><td><code>node -v</code> → 20.x</td></tr>
<tr><td>VS Code</td><td>the IDE (+ Prisma extension)</td><td>opens the project</td></tr>
<tr><td>Docker Desktop</td><td>Postgres + pgvector in one image</td><td><code>docker --version</code></td></tr>
<tr><td>An LLM API key</td><td>embeddings + chat calls</td><td>set as a <b>server</b> env var, never <code>NEXT_PUBLIC_*</code></td></tr>
<tr><td>Postman / REST Client</td><td>test the API without the UI</td><td>send a POST to /api/chat</td></tr>
<tr><td>Git + a GitHub repo</td><td>team workflow</td><td><code>git --version</code></td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Fastest Postgres with vectors:</strong> don't install anything — run the pgvector image in Docker. <code>docker run --name study-db -e POSTGRES_PASSWORD=study -e POSTGRES_DB=study -p 5432:5432 -d pgvector/pgvector:pg16</code>, then <code>CREATE EXTENSION IF NOT EXISTS vector;</code>. One command, throwaway, identical to production.</div>

<a class="link-card dl" href="/exp-hub/int609-cai-dat-moi-truong?ref=%2Fcourses%2Fai-study-assistant%2Flearn&reflabel=INT609" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Full setup guide — download links &amp; step-by-step</span><span class="lc-sub">Node.js, VS Code, Docker (Postgres+pgvector), the LLM key as a server env var, Postman — official links and a verify checklist on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Trap:</strong> putting the LLM key in a <code>NEXT_PUBLIC_*</code> variable. Anything named <code>NEXT_PUBLIC_*</code> is <em>inlined into the browser bundle at build time</em> — your secret key ships to every visitor. Name it <code>LLM_API_KEY</code> (no prefix) and read it only inside Route Handlers (server code). Verify by searching your built <code>.next</code> output: the key must not appear.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cài đặt môi trường</h2>
<p class="lead">Cài hết một lần, trước khi viết một dòng code. Kiểm từng công cụ từ terminal để không mất cả buổi chiều vì thiếu extension Postgres hay đặt sai khoá API.</p>

<h3>Danh sách cần cài</h3>
<table>
<thead><tr><th>Công cụ</th><th>Để làm gì</th><th>Lệnh kiểm</th></tr></thead>
<tbody>
<tr><td>Node.js LTS (20.x+) + npm</td><td>build &amp; chạy app Next.js</td><td><code>node -v</code> → 20.x</td></tr>
<tr><td>VS Code</td><td>IDE (+ extension Prisma)</td><td>mở được dự án</td></tr>
<tr><td>Docker Desktop</td><td>Postgres + pgvector trong một image</td><td><code>docker --version</code></td></tr>
<tr><td>Một khoá LLM API</td><td>gọi embeddings + chat</td><td>đặt làm biến env <b>server</b>, không bao giờ <code>NEXT_PUBLIC_*</code></td></tr>
<tr><td>Postman / REST Client</td><td>test API không cần UI</td><td>gửi POST tới /api/chat</td></tr>
<tr><td>Git + một repo GitHub</td><td>quy trình nhóm</td><td><code>git --version</code></td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Postgres có vector nhanh nhất:</strong> đừng cài gì — chạy image pgvector trong Docker. <code>docker run --name study-db -e POSTGRES_PASSWORD=study -e POSTGRES_DB=study -p 5432:5432 -d pgvector/pgvector:pg16</code>, rồi <code>CREATE EXTENSION IF NOT EXISTS vector;</code>. Một lệnh, dùng xong xoá, giống hệt production.</div>

<a class="link-card dl" href="/exp-hub/int609-cai-dat-moi-truong?ref=%2Fcourses%2Fai-study-assistant%2Flearn&reflabel=INT609" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn cài đặt đầy đủ — link tải &amp; từng bước</span><span class="lc-sub">Node.js, VS Code, Docker (Postgres+pgvector), khoá LLM làm env server, Postman — link chính chủ và checklist kiểm trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đặt khoá LLM vào một biến <code>NEXT_PUBLIC_*</code>. Bất kỳ thứ gì tên <code>NEXT_PUBLIC_*</code> đều được <em>nhúng thẳng vào bundle trình duyệt lúc build</em> — khoá bí mật của bạn ship tới mọi khách truy cập. Đặt tên <code>LLM_API_KEY</code> (không tiền tố) và chỉ đọc bên trong Route Handler (code server). Kiểm bằng cách tìm trong thư mục build <code>.next</code>: khoá không được xuất hiện.</div>
</div>
`,
        },
        {
          title: '0.5 — Your demo & video-recording script|||0.5 — Kịch bản demo & quay video',
          slug: 'int609-kich-ban-demo',
          type: 'VIDEO',
          description: 'Kịch bản 6–8 phút quay video demo chuyên nghiệp: mở đầu, luồng RAG, "khoảnh khắc chống bịa & giấu khoá", kết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Your demo &amp; video-recording script</h2>
<p class="lead">You are recording this project for your portfolio and your defence. A good demo is <strong>rehearsed and scripted</strong>, 6–8 minutes, and it climaxes on the two things that are hard: <strong>the answer is grounded with citations and refuses to hallucinate</strong>, and <strong>the model key never appears in the browser</strong>.</p>

<h3>The 6–8 minute script</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Hook (30s)</div><div class="lz-nsub">"This is a study assistant. It answers ONLY from your own notes, with citations, and it never leaks the model key. Let me show you." Show the architecture picture from 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Ingestion (1.5m)</div><div class="lz-nsub">Register → login → upload a lecture PDF → show the documents + chunks rows appear, each chunk with an embedding vector.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:00 — The money shot: grounded answer (2m)</div><div class="lz-nsub">Ask a question from the notes → watch the answer stream in token by token → click a [1] citation → it scrolls to the exact source chunk. Then ask something NOT in the notes → the bot says "I could not find that in your notes" instead of making it up.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:00 — The security shot: no key in the browser (1m)</div><div class="lz-nsub">Open DevTools → Network: every call goes to <code>/api/chat</code>, never to the LLM host, and carries no key. Search the JS bundle for the key — zero hits. Explain: the key lives in server env, behind the Route Handler.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:00 — Under the hood (1.5m)</div><div class="lz-nsub">One command: <code>docker compose up</code>. Show the pgvector schema, the <code>&lt;=&gt;</code> vector search query, and the grounded prompt. Explain in one sentence why the bot cannot hallucinate.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">6:30 — Close (30s)</div><div class="lz-nsub">"Stack: Next.js 14, Prisma, Postgres + pgvector, an LLM API. Repo link on screen. Thanks." Roll the GitHub URL.</div></div></div>
</div>

<div class="callout ok"><strong>Recording tips:</strong> seed demo notes first (never demo on an empty DB). Increase your editor/browser font size. Do one dry run. Record in 1080p. Keep mouse movements slow. If a stream stutters, cut and re-record that segment — never apologise on camera.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "no-hallucination" and "no-key-leak" moments are your whole grade in 90 seconds.</b> Anyone can wire a chatbot; showing that it <em>refuses</em> to answer without evidence and that the secret <em>never</em> reaches the client is what signals engineering maturity. Lead the demo with those two proofs, not with a tour of every screen. <em>Why beyond syllabus: communicating trustworthiness of an AI system is graded implicitly everywhere in your career, but rarely taught explicitly.</em></div>

<div class="note-ct">You now have the full map. Section 1 starts the build: turn documents and chunks into a pgvector schema.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Kịch bản demo &amp; quay video</h2>
<p class="lead">Bạn quay đồ án này cho portfolio và buổi bảo vệ. Một demo tốt là <strong>đã tập và có kịch bản</strong>, 6–8 phút, và cao trào ở đúng hai thứ khó: <strong>câu trả lời được nối đất kèm trích dẫn và từ chối bịa</strong>, và <strong>khoá model không bao giờ xuất hiện trong trình duyệt</strong>.</p>

<h3>Kịch bản 6–8 phút</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">0:00 — Mở màn (30s)</div><div class="lz-nsub">"Đây là trợ lý học tập. Nó chỉ trả lời TỪ ghi chú của bạn, có trích dẫn, và không bao giờ lộ khoá model. Để tôi cho xem." Chiếu bức tranh kiến trúc ở bài 0.1.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">0:30 — Nạp dữ liệu (1.5m)</div><div class="lz-nsub">Đăng ký → đăng nhập → tải một PDF bài giảng → cho thấy dòng documents + chunks hiện ra, mỗi chunk có một embedding vector.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">2:00 — Cảnh đắt giá: trả lời được nối đất (2m)</div><div class="lz-nsub">Hỏi một câu từ ghi chú → xem câu trả lời stream về từng token → bấm trích dẫn [1] → cuộn tới đúng chunk nguồn. Rồi hỏi thứ KHÔNG có trong ghi chú → bot nói "Không tìm thấy điều đó trong ghi chú của bạn" thay vì bịa.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">4:00 — Cảnh bảo mật: không lộ khoá (1m)</div><div class="lz-nsub">Mở DevTools → Network: mọi lời gọi tới <code>/api/chat</code>, không bao giờ tới host LLM, và không mang khoá. Tìm khoá trong bundle JS — không kết quả. Giải thích: khoá nằm ở env server, sau Route Handler.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">5:00 — Bên trong (1.5m)</div><div class="lz-nsub">Một lệnh: <code>docker compose up</code>. Chiếu schema pgvector, câu tìm vector <code>&lt;=&gt;</code>, và grounded prompt. Giải thích một câu vì sao bot không thể bịa.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">6:30 — Kết (30s)</div><div class="lz-nsub">"Stack: Next.js 14, Prisma, Postgres + pgvector, một LLM API. Link repo trên màn hình. Cảm ơn." Chạy URL GitHub.</div></div></div>
</div>

<div class="callout ok"><strong>Mẹo quay:</strong> seed ghi chú demo trước (đừng bao giờ demo trên DB rỗng). Tăng cỡ chữ editor/trình duyệt. Quay thử một lần. Quay 1080p. Di chuột chậm. Nếu stream giật, cắt và quay lại đoạn đó — đừng xin lỗi trên video.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khoảnh khắc "không bịa" và "không lộ khoá" là cả điểm số của bạn trong 90 giây.</b> Ai cũng nối được một chatbot; cho thấy nó <em>từ chối</em> trả lời khi không có bằng chứng và bí mật <em>không bao giờ</em> tới client mới là thứ thể hiện trưởng thành kỹ thuật. Mở demo bằng hai bằng chứng đó, không phải bằng đi tua từng màn hình. <em>Vì sao ngoài syllabus: truyền đạt độ tin cậy của một hệ AI bị chấm ngầm ở khắp sự nghiệp, nhưng hiếm khi được dạy rõ.</em></div>

<div class="note-ct">Giờ bạn đã có bản đồ đầy đủ. Mục 1 bắt đầu xây: biến documents và chunks thành một schema pgvector.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ MỤC 1 — DOMAIN & DATABASE DESIGN (pgvector) ══════════════════ */
    {
      title: 'Section 1 — Domain & Database Design (pgvector)|||Mục 1 — Thiết kế domain & CSDL (pgvector)',
      description: 'Biến "AI trên ghi chú của tôi" thành thực thể, ERD và một schema — với cột vector và index HNSW là trái tim của việc tìm kiếm ngữ nghĩa.',
      lessons: [
        {
          title: '1.1 — Entities & the ERD: documents, chunks, embeddings|||1.1 — Thực thể & ERD: documents, chunks, embeddings',
          slug: 'int609-erd',
          type: 'VIDEO',
          description: 'Từ hành vi tới thực thể: User, Document, Chunk (mang embedding), ChatMessage — và vì sao chunk là đơn vị của RAG.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.1</span>
<h2>Entities &amp; the ERD — documents, chunks, embeddings</h2>
<p class="lead">Design starts from behaviour. "A <b>student</b> uploads a <b>document</b>; the system splits it into <b>chunks</b>, each with an <b>embedding</b>; a <b>question</b> retrieves chunks and produces a <b>chat message</b>." The nouns give you the model — and the key insight is that <strong>the chunk, not the document, is the unit of retrieval</strong>.</p>

<h3>Use cases → entities</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — an account (email, password hash, role). Every document belongs to exactly one user. Role decides STUDENT vs optional ADMIN.</div>
  <div class="lz-layer"><b>Document</b> — one uploaded note or PDF: <code>title</code>, <code>ownerId</code>, original text, upload time. A document <em>has many</em> chunks.</div>
  <div class="lz-layer"><b>Chunk</b> — a small slice of a document (≈500–1000 characters) plus its <code>embedding</code> vector and a <code>chunkIndex</code>. This is what vector search matches and what a citation points to.</div>
  <div class="lz-layer"><b>ChatMessage</b> — one turn of a conversation: who asked, the question or answer text, and (for answers) the list of chunk ids that were cited. Lets you show history and prove groundedness.</div>
</div>

<h3>The ERD — relationships &amp; cardinality</h3>
<div class="diagram">┌──────────┐        ┌──────────────┐        ┌───────────────────────────┐
│   User   │1──────*│   Document   │1──────*│  Chunk (embedding vector) │
└──────────┘        └──────────────┘        └───────────────────────────┘
      │1                                              ▲ *
      │*                                              │  cited by
┌──────────────┐                                      │
│ ChatMessage  │*─────────────────────────────────────┘   (answer → cited chunks)
└──────────────┘

User     1—* Document     : a user owns many documents
Document 1—* Chunk        : a document is split into many chunks   ← retrieval unit
Chunk    *—* ChatMessage  : an answer cites the chunks it used     ← the citation link</div>

<h3>Worked example — why the chunk is the unit</h3>
<div class="out"><b>Question:</b> a student uploads a 20-page PDF, then asks "What is the CAP theorem?".
<b>Step 1 —</b> On upload, the 20 pages become ~60 chunks; each chunk gets its own embedding vector.
<b>Step 2 —</b> The question is embedded into one query vector.
<b>Step 3 —</b> Vector search compares the query vector to all 60 chunk vectors and returns the 4 closest — the paragraphs that actually mention CAP — not the whole 20-page PDF.
<b>Step 4 —</b> Only those 4 chunks go into the prompt. The answer cites chunk #37 and #38.
<b>Result:</b> retrieving at chunk granularity is what makes the context small, relevant, and citable. Embedding whole documents would return "the whole PDF" and blow the context window.</div>

<div class="pitfall"><strong>Design trap:</strong> storing the embedding on <code>Document</code> instead of <code>Chunk</code>. One vector for a 20-page doc is too coarse — it cannot point to a passage, and its "average meaning" matches everything weakly and nothing strongly. Embed per chunk; a citation must resolve to a chunk, not a whole file.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Chunk size is a real hyperparameter.</b> Too small (one sentence) and a chunk loses context; too big (a whole page) and retrieval gets noisy and the citation is vague. A common sweet spot is ~500–1000 characters with a small overlap (e.g. 100 chars) so a fact spanning a boundary is not cut in half. You will tune this in Section 6 against real questions. <em>Why beyond syllabus: chunking strategy is where most RAG systems win or lose, yet no course lists it as a design decision.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fai-study-assistant%2Flearn&reflabel=INT609#module-430" target="_blank" rel="noopener">
  <span class="lc-ico">◮</span>
  <span class="lc-body"><span class="lc-title">Prisma setup &amp; schema on Code Lab</span><span class="lc-sub">Models, relations and migrations — the ORM under your documents and chunks.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.1</span>
<h2>Thực thể &amp; ERD — documents, chunks, embeddings</h2>
<p class="lead">Thiết kế bắt đầu từ hành vi. "Một <b>sinh viên</b> tải một <b>tài liệu</b>; hệ thống chia nó thành các <b>chunk</b>, mỗi cái có một <b>embedding</b>; một <b>câu hỏi</b> truy hồi chunk và tạo ra một <b>tin nhắn chat</b>." Các danh từ cho ta mô hình — và điểm mấu chốt là <strong>chunk, không phải document, mới là đơn vị truy hồi</strong>.</p>

<h3>Use case → thực thể</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>User</b> — một tài khoản (email, hash mật khẩu, role). Mỗi tài liệu thuộc đúng một user. Role quyết định STUDENT vs ADMIN tuỳ chọn.</div>
  <div class="lz-layer"><b>Document</b> — một ghi chú/PDF đã tải: <code>title</code>, <code>ownerId</code>, văn bản gốc, thời điểm tải. Một document <em>có nhiều</em> chunk.</div>
  <div class="lz-layer"><b>Chunk</b> — một lát nhỏ của document (≈500–1000 ký tự) cộng vector <code>embedding</code> và <code>chunkIndex</code>. Đây là thứ tìm vector khớp tới và là thứ một trích dẫn trỏ vào.</div>
  <div class="lz-layer"><b>ChatMessage</b> — một lượt trong hội thoại: ai hỏi, nội dung câu hỏi/trả lời, và (với câu trả lời) danh sách id chunk đã trích dẫn. Cho phép hiện lịch sử và chứng minh tính-được-nối-đất.</div>
</div>

<h3>ERD — quan hệ &amp; lực lượng (cardinality)</h3>
<div class="diagram">┌──────────┐        ┌──────────────┐        ┌───────────────────────────┐
│   User   │1──────*│   Document   │1──────*│  Chunk (embedding vector) │
└──────────┘        └──────────────┘        └───────────────────────────┘
      │1                                              ▲ *
      │*                                              │  được trích dẫn bởi
┌──────────────┐                                      │
│ ChatMessage  │*─────────────────────────────────────┘   (trả lời → chunk trích dẫn)
└──────────────┘

User     1—* Document     : một user sở hữu nhiều tài liệu
Document 1—* Chunk        : một tài liệu chia thành nhiều chunk    ← đơn vị truy hồi
Chunk    *—* ChatMessage  : một câu trả lời trích dẫn các chunk đã dùng  ← liên kết trích dẫn</div>

<h3>Ví dụ có lời giải — vì sao chunk là đơn vị</h3>
<div class="out"><b>Câu hỏi:</b> sinh viên tải một PDF 20 trang, rồi hỏi "Định lý CAP là gì?".
<b>Bước 1 —</b> Khi tải, 20 trang thành ~60 chunk; mỗi chunk có vector embedding riêng.
<b>Bước 2 —</b> Câu hỏi được embed thành một vector truy vấn.
<b>Bước 3 —</b> Tìm vector so vector truy vấn với cả 60 vector chunk và trả về 4 cái gần nhất — các đoạn thực sự nhắc tới CAP — không phải cả PDF 20 trang.
<b>Bước 4 —</b> Chỉ 4 chunk đó vào prompt. Câu trả lời trích dẫn chunk #37 và #38.
<b>Kết quả:</b> truy hồi ở mức chunk chính là thứ khiến ngữ cảnh nhỏ, liên quan, và trích dẫn được. Embed cả tài liệu sẽ trả "cả PDF" và nổ context window.</div>

<div class="pitfall"><strong>Bẫy thiết kế:</strong> lưu embedding trên <code>Document</code> thay vì <code>Chunk</code>. Một vector cho tài liệu 20 trang quá thô — không trỏ được vào một đoạn, và "nghĩa trung bình" của nó khớp yếu với mọi thứ và mạnh với không gì cả. Hãy embed theo từng chunk; một trích dẫn phải giải về một chunk, không phải cả file.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kích thước chunk là một siêu tham số thật.</b> Quá nhỏ (một câu) thì chunk mất ngữ cảnh; quá lớn (cả trang) thì truy hồi nhiễu và trích dẫn mơ hồ. Điểm ngọt thường là ~500–1000 ký tự với chồng lấn nhỏ (vd 100 ký tự) để một sự kiện nằm vắt qua ranh giới không bị cắt đôi. Bạn sẽ tinh chỉnh cái này ở Mục 6 với câu hỏi thật. <em>Vì sao ngoài syllabus: chiến lược chunk là nơi đa số hệ RAG thắng hay thua, nhưng không môn nào liệt nó là một quyết định thiết kế.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fai-study-assistant%2Flearn&reflabel=INT609#module-430" target="_blank" rel="noopener">
  <span class="lc-ico">◮</span>
  <span class="lc-body"><span class="lc-title">Cài đặt Prisma &amp; schema trên Code Lab</span><span class="lc-sub">Model, quan hệ và migration — phần ORM nằm dưới documents và chunks.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — The pgvector schema & the vector index|||1.2 — Schema pgvector & index vector',
          slug: 'int609-schema',
          type: 'VIDEO',
          description: 'DDL đầy đủ + cột vector(1536) + index HNSW với toán tử cosine: thứ khiến tìm kiếm ngữ nghĩa khả thi và nhanh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 1 · Lesson 1.2</span>
<h2>The pgvector schema &amp; the vector index</h2>
<p class="lead">Here is the whole database. Notice two special lines on <code>chunks</code>: the <code>embedding vector(1536)</code> column, and the <strong>HNSW index using <code>vector_cosine_ops</code></strong>. That column is what turns a table into a searchable knowledge base; that index is what keeps nearest-neighbour search fast as the notes grow.</p>

<h3>Enable pgvector, then the DDL (PostgreSQL)</h3>
<pre><span class="tok-keyword">CREATE EXTENSION IF NOT EXISTS</span> vector;   <span class="tok-comment">-- once per database</span>

<span class="tok-keyword">CREATE TABLE</span> users (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  email       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  password    <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,      <span class="tok-comment">-- bcrypt hash</span>
  role        <span class="tok-type">VARCHAR</span>(20)  <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'STUDENT'</span>
);

<span class="tok-keyword">CREATE TABLE</span> documents (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  owner_id    <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id) <span class="tok-keyword">ON DELETE CASCADE</span>,
  title       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now()
);

<span class="tok-keyword">CREATE TABLE</span> chunks (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  document_id <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> documents(id) <span class="tok-keyword">ON DELETE CASCADE</span>,
  chunk_index <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL</span>,                  <span class="tok-comment">-- order within the document</span>
  content     <span class="tok-type">TEXT</span> <span class="tok-keyword">NOT NULL</span>,                     <span class="tok-comment">-- the raw text of this slice</span>
  embedding   <span class="tok-type">vector</span>(<span class="tok-number">1536</span>) <span class="tok-keyword">NOT NULL</span>,           <span class="tok-comment">-- ★ the embedding vector</span>
  <span class="tok-keyword">UNIQUE</span> (document_id, chunk_index)          <span class="tok-comment">-- no duplicate slice at the same position</span>
);

<span class="tok-comment">-- ★ the index that makes nearest-neighbour search fast (cosine distance)</span>
<span class="tok-keyword">CREATE INDEX</span> chunks_embedding_hnsw
  <span class="tok-keyword">ON</span> chunks <span class="tok-keyword">USING</span> hnsw (embedding vector_cosine_ops);

<span class="tok-keyword">CREATE TABLE</span> chat_messages (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  user_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id) <span class="tok-keyword">ON DELETE CASCADE</span>,
  role        <span class="tok-type">VARCHAR</span>(12) <span class="tok-keyword">NOT NULL</span>,             <span class="tok-comment">-- USER | ASSISTANT</span>
  content     <span class="tok-type">TEXT</span> <span class="tok-keyword">NOT NULL</span>,
  cited_chunk_ids <span class="tok-type">BIGINT</span>[] ,                    <span class="tok-comment">-- which chunks the answer cited</span>
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now()
);</pre>

<h3>Worked example — the vector search query</h3>
<div class="out"><b>Goal:</b> find the 4 chunks of <b>user 7</b> closest in meaning to a question already embedded as <code>$1</code>.
<b>The query (cosine distance, smaller = closer):</b>
  SELECT c.id, c.content, c.document_id
  FROM chunks c JOIN documents d ON d.id = c.document_id
  WHERE d.owner_id = 7                          -- ★ isolation: only this user
  ORDER BY c.embedding &lt;=&gt; $1                    -- ★ &lt;=&gt; is cosine distance
  LIMIT 4;
<b>Result:</b> four rows, the closest first. The HNSW index makes this an approximate-nearest-neighbour lookup — milliseconds even over tens of thousands of chunks, instead of scanning every row. <code>&lt;=&gt;</code> is pgvector cosine-distance operator; <code>&lt;-&gt;</code> is L2, <code>&lt;#&gt;</code> is inner product.</div>

<div class="pitfall"><strong>Trap:</strong> forgetting the <code>WHERE d.owner_id = ?</code>. Without it your vector search happily returns the closest chunks across <em>all</em> users — a student would see fragments of other people notes. Data isolation (Section 3) is not only an auth-route concern; it must be inside the retrieval query itself.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>HNSW vs IVFFlat, and why 1536.</b> <code>hnsw</code> builds a graph for fast, high-recall approximate search and needs no training data — great for a project that grows incrementally. <code>ivfflat</code> is smaller but must be built after you have many rows. The dimension (here <code>1536</code>) must match your embedding model exactly — a vector of the wrong length is rejected at insert. In Prisma, the <code>vector</code> type is not a native scalar, so you declare it via <code>Unsupported("vector(1536)")</code> and run vector queries through <code>$queryRaw</code>. <em>Why beyond syllabus: index choice and dimension matching are pgvector-specific operational knowledge the syllabus never covers.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fai-study-assistant%2Flearn&reflabel=INT609#module-2374" target="_blank" rel="noopener">
  <span class="lc-ico">◮</span>
  <span class="lc-body"><span class="lc-title">Native Postgres features on Code Lab</span><span class="lc-sub">Raw SQL &amp; extensions through Prisma — the escape hatch pgvector needs.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 1 · Bài 1.2</span>
<h2>Schema pgvector &amp; index vector</h2>
<p class="lead">Đây là toàn bộ CSDL. Chú ý hai dòng đặc biệt trên <code>chunks</code>: cột <code>embedding vector(1536)</code>, và <strong>index HNSW dùng <code>vector_cosine_ops</code></strong>. Cột đó biến một bảng thành kho tri thức tìm được; index đó giữ tìm láng giềng gần nhất nhanh khi ghi chú nhiều lên.</p>

<h3>Bật pgvector, rồi DDL (PostgreSQL)</h3>
<pre><span class="tok-keyword">CREATE EXTENSION IF NOT EXISTS</span> vector;   <span class="tok-comment">-- một lần mỗi database</span>

<span class="tok-keyword">CREATE TABLE</span> users (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  email       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">UNIQUE NOT NULL</span>,
  password    <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,      <span class="tok-comment">-- hash bcrypt</span>
  role        <span class="tok-type">VARCHAR</span>(20)  <span class="tok-keyword">NOT NULL DEFAULT</span> <span class="tok-string">'STUDENT'</span>
);

<span class="tok-keyword">CREATE TABLE</span> documents (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  owner_id    <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id) <span class="tok-keyword">ON DELETE CASCADE</span>,
  title       <span class="tok-type">VARCHAR</span>(255) <span class="tok-keyword">NOT NULL</span>,
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now()
);

<span class="tok-keyword">CREATE TABLE</span> chunks (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  document_id <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> documents(id) <span class="tok-keyword">ON DELETE CASCADE</span>,
  chunk_index <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL</span>,                  <span class="tok-comment">-- thứ tự trong tài liệu</span>
  content     <span class="tok-type">TEXT</span> <span class="tok-keyword">NOT NULL</span>,                     <span class="tok-comment">-- văn bản thô của lát này</span>
  embedding   <span class="tok-type">vector</span>(<span class="tok-number">1536</span>) <span class="tok-keyword">NOT NULL</span>,           <span class="tok-comment">-- ★ vector embedding</span>
  <span class="tok-keyword">UNIQUE</span> (document_id, chunk_index)          <span class="tok-comment">-- không lát trùng ở cùng vị trí</span>
);

<span class="tok-comment">-- ★ index khiến tìm láng giềng gần nhất nhanh (khoảng cách cosine)</span>
<span class="tok-keyword">CREATE INDEX</span> chunks_embedding_hnsw
  <span class="tok-keyword">ON</span> chunks <span class="tok-keyword">USING</span> hnsw (embedding vector_cosine_ops);

<span class="tok-keyword">CREATE TABLE</span> chat_messages (
  id          <span class="tok-type">BIGSERIAL</span> <span class="tok-keyword">PRIMARY KEY</span>,
  user_id     <span class="tok-type">BIGINT</span> <span class="tok-keyword">NOT NULL REFERENCES</span> users(id) <span class="tok-keyword">ON DELETE CASCADE</span>,
  role        <span class="tok-type">VARCHAR</span>(12) <span class="tok-keyword">NOT NULL</span>,             <span class="tok-comment">-- USER | ASSISTANT</span>
  content     <span class="tok-type">TEXT</span> <span class="tok-keyword">NOT NULL</span>,
  cited_chunk_ids <span class="tok-type">BIGINT</span>[] ,                    <span class="tok-comment">-- câu trả lời đã trích dẫn chunk nào</span>
  created_at  <span class="tok-type">TIMESTAMP</span> <span class="tok-keyword">NOT NULL DEFAULT</span> now()
);</pre>

<h3>Ví dụ có lời giải — câu truy vấn tìm vector</h3>
<div class="out"><b>Mục tiêu:</b> tìm 4 chunk của <b>user 7</b> gần nghĩa nhất với một câu hỏi đã embed thành <code>$1</code>.
<b>Câu truy vấn (khoảng cách cosine, nhỏ hơn = gần hơn):</b>
  SELECT c.id, c.content, c.document_id
  FROM chunks c JOIN documents d ON d.id = c.document_id
  WHERE d.owner_id = 7                          -- ★ cô lập: chỉ user này
  ORDER BY c.embedding &lt;=&gt; $1                    -- ★ &lt;=&gt; là khoảng cách cosine
  LIMIT 4;
<b>Kết quả:</b> bốn dòng, gần nhất trước. Index HNSW biến việc này thành tra láng giềng gần nhất xấp xỉ — mili-giây kể cả trên hàng chục nghìn chunk, thay vì quét mọi dòng. <code>&lt;=&gt;</code> là toán tử khoảng cách cosine của pgvector; <code>&lt;-&gt;</code> là L2, <code>&lt;#&gt;</code> là tích trong.</div>

<div class="pitfall"><strong>Bẫy:</strong> quên <code>WHERE d.owner_id = ?</code>. Không có nó, tìm vector vui vẻ trả về các chunk gần nhất trên <em>mọi</em> user — một sinh viên sẽ thấy mảnh ghi chú của người khác. Cô lập dữ liệu (Mục 3) không chỉ là chuyện của route xác thực; nó phải nằm bên trong chính câu truy vấn truy hồi.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>HNSW vs IVFFlat, và vì sao 1536.</b> <code>hnsw</code> dựng một đồ thị cho tìm xấp xỉ nhanh, recall cao và không cần dữ liệu huấn luyện — hợp cho một đồ án lớn dần từng bước. <code>ivfflat</code> nhỏ hơn nhưng phải dựng sau khi đã có nhiều dòng. Số chiều (ở đây <code>1536</code>) phải khớp chính xác model embedding của bạn — vector sai độ dài bị từ chối lúc chèn. Trong Prisma, kiểu <code>vector</code> không phải scalar gốc, nên bạn khai báo qua <code>Unsupported("vector(1536)")</code> và chạy truy vấn vector qua <code>$queryRaw</code>. <em>Vì sao ngoài syllabus: chọn index và khớp số chiều là kiến thức vận hành đặc thù pgvector mà giáo trình không nhắc.</em></div>

<a class="link-card codelab" href="/code-lab/prisma-orm?ref=%2Fcourses%2Fai-study-assistant%2Flearn&reflabel=INT609#module-2374" target="_blank" rel="noopener">
  <span class="lc-ico">◮</span>
  <span class="lc-body"><span class="lc-title">Tính năng Postgres gốc trên Code Lab</span><span class="lc-sub">SQL thô &amp; extension qua Prisma — cửa thoát mà pgvector cần.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 1 — Domain & pgvector schema|||Quiz 1 — Domain & schema pgvector',
          slug: 'int609-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra hiểu về thực thể, đơn vị truy hồi, cột vector và index HNSW.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'In a RAG system, what is the unit of retrieval that a citation points to?|||Trong hệ RAG, đơn vị truy hồi mà một trích dẫn trỏ vào là gì?',
                options: [
                  'The whole document|||Cả tài liệu',
                  'A chunk (a small slice of a document with its own embedding)|||Một chunk (lát nhỏ của tài liệu với embedding riêng)',
                  'The user account|||Tài khoản người dùng',
                  'The chat message|||Tin nhắn chat',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Which column and operator make semantic search possible in Postgres with pgvector?|||Cột và toán tử nào khiến tìm kiếm ngữ nghĩa khả thi trong Postgres với pgvector?',
                options: [
                  'A TEXT column and LIKE|||Cột TEXT và LIKE',
                  'A vector(1536) column and the cosine-distance operator &lt;=&gt;|||Cột vector(1536) và toán tử khoảng cách cosine &lt;=&gt;',
                  'A JSON column and -&gt;&gt;|||Cột JSON và -&gt;&gt;',
                  'An INT column and BETWEEN|||Cột INT và BETWEEN',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Why embed per chunk instead of storing one embedding on the whole document?|||Vì sao embed theo từng chunk thay vì lưu một embedding cho cả tài liệu?',
                options: [
                  'It uses less disk|||Tốn ít đĩa hơn',
                  'A per-chunk vector can point to a passage and keeps retrieved context small and relevant|||Vector theo chunk trỏ được vào một đoạn và giữ ngữ cảnh truy hồi nhỏ, liên quan',
                  'Prisma requires it|||Prisma bắt buộc',
                  'It avoids using an index|||Để tránh dùng index',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'A student vector search returns chunks belonging to other users. What is the most likely bug?|||Tìm vector của một sinh viên trả về chunk của người khác. Bug khả dĩ nhất là gì?',
                options: [
                  'The HNSW index is missing|||Thiếu index HNSW',
                  'The retrieval query is missing a WHERE owner_id filter|||Câu truy hồi thiếu lọc WHERE owner_id',
                  'The embedding dimension is wrong|||Sai số chiều embedding',
                  'The password hash is wrong|||Sai hash mật khẩu',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) Why does the embedding column dimension (e.g. 1536) have to match the embedding model?|||(Ngoài giáo trình) Vì sao số chiều cột embedding (vd 1536) phải khớp model embedding?',
                options: [
                  'For nicer formatting|||Để định dạng đẹp hơn',
                  'The model outputs vectors of a fixed length; a vector of a different length is rejected on insert and distances are meaningless|||Model xuất vector độ dài cố định; vector khác độ dài bị từ chối lúc chèn và khoảng cách vô nghĩa',
                  'To save tokens|||Để tiết kiệm token',
                  'It has no effect|||Không ảnh hưởng gì',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ MỤC 2 — APP ROUTER & PROXY LLM PHÍA SERVER ══════════════════ */
    {
      title: 'Section 2 — App Router & the Server-Side LLM Proxy|||Mục 2 — App Router & Proxy LLM phía server',
      description: 'Trụ cột số 2: khoá LLM ở server sau một Route Handler (đọc từ runtime env, không NEXT_PUBLIC_*), rồi dựng pipeline nạp chunk → embed → lưu.',
      lessons: [
        {
          title: '2.1 — Route Handlers & the server-side LLM proxy|||2.1 — Route Handlers & proxy LLM phía server',
          slug: 'int609-server-proxy',
          type: 'VIDEO',
          description: 'Vì sao khoá LLM KHÔNG BAO GIỜ vào bundle trình duyệt — mọi lời gọi model đi qua một Route Handler đọc khoá từ process.env.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.1</span>
<h2>Route Handlers &amp; the server-side LLM proxy</h2>
<p class="lead">This is the second pillar of the whole project, and the one reviewers probe hardest: <strong>the LLM API key must never reach the browser</strong>. In Next.js, the browser talks only to your own <code>/api/*</code> Route Handlers; those run on the server, read the key from <code>process.env</code>, and call the model. The client never sees the key or the model host.</p>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>This is the exact lesson INT601 learned the hard way.</b> That project once shipped a third-party key to the client via a <code>NEXT_PUBLIC_*</code> variable — baked into the bundle at build time — and it leaked to every visitor. The fix was the same pattern you use here: a small server proxy route that reads the key from runtime env, so key rotation is a container restart and no secret ever ships to the browser. <em>Why beyond syllabus: "browser-facing third-party APIs go through a server proxy" is a security invariant every real product enforces but few courses state outright.</em></div>

<h3>Wrong vs right — where the key lives</h3>
<div class="diagram">✗ WRONG                                   ✓ RIGHT
Browser  ──key──▶  LLM host               Browser  ──cookie──▶  /api/chat  (Route Handler)
(NEXT_PUBLIC_LLM_KEY in bundle)                              server reads LLM_API_KEY
key leaks to everyone                                        ──key──▶  LLM host
                                                            key never leaves the server</div>

<h3>The proxy Route Handler</h3>
<pre><span class="tok-comment">// app/api/chat/route.ts  — runs on the SERVER only</span>
<span class="tok-keyword">import</span> { NextRequest } <span class="tok-keyword">from</span> <span class="tok-string">'next/server'</span>;
<span class="tok-keyword">import</span> { getSession } <span class="tok-keyword">from</span> <span class="tok-string">'@/lib/auth'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">POST</span>(req: NextRequest) {
  <span class="tok-keyword">const</span> session = <span class="tok-keyword">await</span> getSession(req);
  <span class="tok-keyword">if</span> (!session) <span class="tok-keyword">return new</span> <span class="tok-type">Response</span>(<span class="tok-string">'Unauthorized'</span>, { status: <span class="tok-number">401</span> });

  <span class="tok-keyword">const</span> { question } = <span class="tok-keyword">await</span> req.json();

  <span class="tok-comment">// ★ the key is read here, on the server, from runtime env — never sent to the client</span>
  <span class="tok-keyword">const</span> key = process.env.<span class="tok-type">LLM_API_KEY</span>;        <span class="tok-comment">// NOT NEXT_PUBLIC_*</span>
  <span class="tok-keyword">if</span> (!key) <span class="tok-keyword">return new</span> <span class="tok-type">Response</span>(<span class="tok-string">'Server misconfigured'</span>, { status: <span class="tok-number">500</span> });

  <span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> fetch(process.env.<span class="tok-type">LLM_BASE_URL</span> + <span class="tok-string">'/chat/completions'</span>, {
    method: <span class="tok-string">'POST'</span>,
    headers: {
      <span class="tok-string">'Authorization'</span>: &#96;Bearer \${key}&#96;,       <span class="tok-comment">// key added server-side</span>
      <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json'</span>,
    },
    body: JSON.stringify({ model: process.env.<span class="tok-type">LLM_MODEL</span>, messages: [ <span class="tok-comment">/* ... */</span> ], stream: <span class="tok-keyword">true</span> }),
  });
  <span class="tok-keyword">return new</span> <span class="tok-type">Response</span>(res.body, { headers: { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'text/event-stream'</span> } });
}</pre>

<h3>Worked example — prove the key is not in the browser</h3>
<div class="out"><b>1.</b> Name the env var <code>LLM_API_KEY</code> (no <code>NEXT_PUBLIC_</code> prefix).
<b>2.</b> <code>npm run build</code>, then search the client bundle:
   grep -r "sk-" .next/static   →  (no matches)  ✅
<b>3.</b> Open the app, ask a question, watch DevTools → Network:
   every request goes to  /api/chat  — never to the LLM host, and carries only your session cookie.  ✅
<b>Contrast:</b> rename it <code>NEXT_PUBLIC_LLM_API_KEY</code> and rebuild → the key now appears in the bundle grep. That is the leak. Never do this.</div>

<div class="pitfall"><strong>Trap:</strong> calling the LLM from a Client Component with <code>fetch('https://llm-host/...')</code> "to save a hop". Any code in a Client Component runs in the browser, so its network calls and any embedded key are fully visible. All model calls belong in Route Handlers (or Server Actions) — server code that the browser never receives.</div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fai-study-assistant%2Flearn&reflabel=INT609#module-379" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">API Routes / server proxy on Code Lab</span><span class="lc-sub">Route Handlers and the server boundary — where secrets stay safe.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.1</span>
<h2>Route Handlers &amp; proxy LLM phía server</h2>
<p class="lead">Đây là trụ cột thứ hai của cả đồ án, và là thứ hội đồng dò gắt nhất: <strong>khoá API của LLM không bao giờ được tới trình duyệt</strong>. Trong Next.js, trình duyệt chỉ nói chuyện với các Route Handler <code>/api/*</code> của chính bạn; chúng chạy ở server, đọc khoá từ <code>process.env</code>, và gọi model. Client không bao giờ thấy khoá hay host của model.</p>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đây đúng là bài học INT601 học được bằng cách trả giá.</b> Đồ án đó từng ship một khoá bên thứ ba xuống client qua một biến <code>NEXT_PUBLIC_*</code> — nướng vào bundle lúc build — và nó lộ ra mọi khách. Cách sửa chính là mẫu bạn dùng ở đây: một route proxy nhỏ ở server đọc khoá từ runtime env, nên xoay khoá chỉ là restart container và không bí mật nào ship xuống trình duyệt. <em>Vì sao ngoài syllabus: "API bên thứ ba hướng trình duyệt phải đi qua proxy server" là bất biến bảo mật mọi sản phẩm thật ép, nhưng ít môn nói thẳng.</em></div>

<h3>Sai vs đúng — khoá nằm ở đâu</h3>
<div class="diagram">✗ SAI                                     ✓ ĐÚNG
Trình duyệt ──khoá──▶  host LLM            Trình duyệt ──cookie──▶  /api/chat  (Route Handler)
(NEXT_PUBLIC_LLM_KEY trong bundle)                              server đọc LLM_API_KEY
khoá lộ ra mọi người                                           ──khoá──▶  host LLM
                                                              khoá không bao giờ rời server</div>

<h3>Route Handler proxy</h3>
<pre><span class="tok-comment">// app/api/chat/route.ts  — chỉ chạy ở SERVER</span>
<span class="tok-keyword">import</span> { NextRequest } <span class="tok-keyword">from</span> <span class="tok-string">'next/server'</span>;
<span class="tok-keyword">import</span> { getSession } <span class="tok-keyword">from</span> <span class="tok-string">'@/lib/auth'</span>;

<span class="tok-keyword">export async function</span> <span class="tok-function">POST</span>(req: NextRequest) {
  <span class="tok-keyword">const</span> session = <span class="tok-keyword">await</span> getSession(req);
  <span class="tok-keyword">if</span> (!session) <span class="tok-keyword">return new</span> <span class="tok-type">Response</span>(<span class="tok-string">'Unauthorized'</span>, { status: <span class="tok-number">401</span> });

  <span class="tok-keyword">const</span> { question } = <span class="tok-keyword">await</span> req.json();

  <span class="tok-comment">// ★ khoá đọc ở đây, tại server, từ runtime env — không bao giờ gửi cho client</span>
  <span class="tok-keyword">const</span> key = process.env.<span class="tok-type">LLM_API_KEY</span>;        <span class="tok-comment">// KHÔNG phải NEXT_PUBLIC_*</span>
  <span class="tok-keyword">if</span> (!key) <span class="tok-keyword">return new</span> <span class="tok-type">Response</span>(<span class="tok-string">'Server misconfigured'</span>, { status: <span class="tok-number">500</span> });

  <span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> fetch(process.env.<span class="tok-type">LLM_BASE_URL</span> + <span class="tok-string">'/chat/completions'</span>, {
    method: <span class="tok-string">'POST'</span>,
    headers: {
      <span class="tok-string">'Authorization'</span>: &#96;Bearer \${key}&#96;,       <span class="tok-comment">// khoá thêm ở server</span>
      <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json'</span>,
    },
    body: JSON.stringify({ model: process.env.<span class="tok-type">LLM_MODEL</span>, messages: [ <span class="tok-comment">/* ... */</span> ], stream: <span class="tok-keyword">true</span> }),
  });
  <span class="tok-keyword">return new</span> <span class="tok-type">Response</span>(res.body, { headers: { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'text/event-stream'</span> } });
}</pre>

<h3>Ví dụ có lời giải — chứng minh khoá không có trong trình duyệt</h3>
<div class="out"><b>1.</b> Đặt tên biến env là <code>LLM_API_KEY</code> (không tiền tố <code>NEXT_PUBLIC_</code>).
<b>2.</b> <code>npm run build</code>, rồi tìm trong bundle client:
   grep -r "sk-" .next/static   →  (không kết quả)  ✅
<b>3.</b> Mở app, hỏi một câu, xem DevTools → Network:
   mọi request tới  /api/chat  — không bao giờ tới host LLM, và chỉ mang cookie phiên của bạn.  ✅
<b>Đối chiếu:</b> đổi tên thành <code>NEXT_PUBLIC_LLM_API_KEY</code> và build lại → khoá giờ hiện trong grep bundle. Đó là chỗ lộ. Đừng bao giờ làm thế.</div>

<div class="pitfall"><strong>Bẫy:</strong> gọi LLM từ một Client Component bằng <code>fetch('https://llm-host/...')</code> "để đỡ một chặng". Mọi code trong Client Component chạy ở trình duyệt, nên lời gọi mạng và bất kỳ khoá nhúng nào đều hiện rõ. Mọi lời gọi model thuộc về Route Handler (hoặc Server Action) — code server mà trình duyệt không bao giờ nhận.</div>

<a class="link-card codelab" href="/code-lab/nextjs?ref=%2Fcourses%2Fai-study-assistant%2Flearn&reflabel=INT609#module-379" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">API Routes / proxy server trên Code Lab</span><span class="lc-sub">Route Handlers và ranh giới server — nơi bí mật được giữ an toàn.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — The ingestion pipeline: chunk → embed → store|||2.2 — Pipeline nạp: chunk → embed → lưu',
          slug: 'int609-ingestion',
          type: 'VIDEO',
          description: 'Đi trọn một lát cắt: nhận một ghi chú, chia chunk, embed từng chunk qua proxy, lưu vector vào pgvector — có kết quả thật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 2 · Lesson 2.2</span>
<h2>The ingestion pipeline — chunk → embed → store</h2>
<p class="lead">Before anyone can ask a question, the notes must become searchable vectors. Ingestion is a three-step server pipeline that runs when a document is uploaded: <strong>split into chunks → embed each chunk → store the vectors</strong>. This is the write side of RAG; Section 4 is the read side.</p>

<h3>Step 1 — chunk the text (with overlap)</h3>
<pre><span class="tok-comment">// lib/chunk.ts</span>
<span class="tok-keyword">export function</span> <span class="tok-function">chunkText</span>(text: <span class="tok-type">string</span>, size = <span class="tok-number">800</span>, overlap = <span class="tok-number">100</span>): <span class="tok-type">string</span>[] {
  <span class="tok-keyword">const</span> chunks: <span class="tok-type">string</span>[] = [];
  <span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>; i &lt; text.length; i += size - overlap) {
    chunks.push(text.slice(i, i + size));       <span class="tok-comment">// overlap keeps facts across boundaries</span>
  }
  <span class="tok-keyword">return</span> chunks;
}</pre>

<h3>Step 2 — embed each chunk (through the server proxy)</h3>
<pre><span class="tok-comment">// lib/embed.ts  — server only; same key rule as 2.1</span>
<span class="tok-keyword">export async function</span> <span class="tok-function">embed</span>(input: <span class="tok-type">string</span>): <span class="tok-type">Promise</span>&lt;<span class="tok-type">number</span>[]&gt; {
  <span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> fetch(process.env.<span class="tok-type">LLM_BASE_URL</span> + <span class="tok-string">'/embeddings'</span>, {
    method: <span class="tok-string">'POST'</span>,
    headers: { <span class="tok-string">'Authorization'</span>: &#96;Bearer \${process.env.LLM_API_KEY}&#96;, <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json'</span> },
    body: JSON.stringify({ model: process.env.<span class="tok-type">EMBED_MODEL</span>, input }),
  });
  <span class="tok-keyword">const</span> data = <span class="tok-keyword">await</span> res.json();
  <span class="tok-keyword">return</span> data.data[<span class="tok-number">0</span>].embedding;   <span class="tok-comment">// a number[] of length 1536</span>
}</pre>

<h3>Step 3 — store the vector (raw SQL, because pgvector)</h3>
<pre><span class="tok-comment">// app/api/documents/route.ts (POST) — after saving the document row</span>
<span class="tok-keyword">const</span> pieces = chunkText(rawText);
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>; i &lt; pieces.length; i++) {
  <span class="tok-keyword">const</span> vec = <span class="tok-keyword">await</span> embed(pieces[i]);
  <span class="tok-keyword">const</span> literal = &#96;[\${vec.join(<span class="tok-string">','</span>)}]&#96;;      <span class="tok-comment">// pgvector text form: [0.1,0.2,...]</span>
  <span class="tok-keyword">await</span> prisma.$executeRaw&#96;
    INSERT INTO chunks (document_id, chunk_index, content, embedding)
    VALUES (\${docId}, \${i}, \${pieces[i]}, \${literal}::vector)&#96;;
}</pre>

<h3>Worked example — one upload, end to end</h3>
<div class="out"><b>Upload:</b> a 3,000-character note titled "Databases".
<b>Step 1 —</b> chunkText → 4 chunks (800 chars each, 100 overlap).
<b>Step 2 —</b> embed() called 4 times → 4 vectors of length 1536.
<b>Step 3 —</b> 4 INSERTs into chunks, each with its embedding.
<b>Verify:</b>  SELECT count(*) FROM chunks WHERE document_id = 12;  → 4
             SELECT vector_dims(embedding) FROM chunks LIMIT 1;   → 1536
<b>Result:</b> the note is now a set of searchable vectors. The read side (Section 4) can retrieve them.</div>

<div class="pitfall"><strong>Trap:</strong> embedding the whole document in one call, or storing the vector as a JSON string in a TEXT column. The first loses chunk granularity; the second cannot be indexed by pgvector and the <code>&lt;=&gt;</code> operator will not work on it. Always insert into a real <code>vector</code> column via <code>::vector</code>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Batch embeds and make ingestion idempotent.</b> Calling <code>embed()</code> once per chunk is fine for a demo, but a real pipeline batches many chunks per embedding request (fewer round trips, lower cost) and makes re-uploads idempotent — delete a document old chunks before re-inserting, or key on <code>(document_id, chunk_index)</code> so a retry does not duplicate rows. <em>Why beyond syllabus: batching and idempotent writes are cost- and correctness-engineering the syllabus never raises for AI pipelines.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 2 · Bài 2.2</span>
<h2>Pipeline nạp — chunk → embed → lưu</h2>
<p class="lead">Trước khi ai hỏi được, ghi chú phải thành vector tìm được. Nạp là một pipeline server ba bước chạy khi tải một tài liệu: <strong>chia chunk → embed từng chunk → lưu vector</strong>. Đây là phần GHI của RAG; Mục 4 là phần ĐỌC.</p>

<h3>Bước 1 — chia chunk (có chồng lấn)</h3>
<pre><span class="tok-comment">// lib/chunk.ts</span>
<span class="tok-keyword">export function</span> <span class="tok-function">chunkText</span>(text: <span class="tok-type">string</span>, size = <span class="tok-number">800</span>, overlap = <span class="tok-number">100</span>): <span class="tok-type">string</span>[] {
  <span class="tok-keyword">const</span> chunks: <span class="tok-type">string</span>[] = [];
  <span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>; i &lt; text.length; i += size - overlap) {
    chunks.push(text.slice(i, i + size));       <span class="tok-comment">// chồng lấn giữ sự kiện vắt qua ranh giới</span>
  }
  <span class="tok-keyword">return</span> chunks;
}</pre>

<h3>Bước 2 — embed từng chunk (qua proxy server)</h3>
<pre><span class="tok-comment">// lib/embed.ts  — chỉ server; cùng quy tắc khoá như 2.1</span>
<span class="tok-keyword">export async function</span> <span class="tok-function">embed</span>(input: <span class="tok-type">string</span>): <span class="tok-type">Promise</span>&lt;<span class="tok-type">number</span>[]&gt; {
  <span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> fetch(process.env.<span class="tok-type">LLM_BASE_URL</span> + <span class="tok-string">'/embeddings'</span>, {
    method: <span class="tok-string">'POST'</span>,
    headers: { <span class="tok-string">'Authorization'</span>: &#96;Bearer \${process.env.LLM_API_KEY}&#96;, <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json'</span> },
    body: JSON.stringify({ model: process.env.<span class="tok-type">EMBED_MODEL</span>, input }),
  });
  <span class="tok-keyword">const</span> data = <span class="tok-keyword">await</span> res.json();
  <span class="tok-keyword">return</span> data.data[<span class="tok-number">0</span>].embedding;   <span class="tok-comment">// một number[] độ dài 1536</span>
}</pre>

<h3>Bước 3 — lưu vector (SQL thô, vì pgvector)</h3>
<pre><span class="tok-comment">// app/api/documents/route.ts (POST) — sau khi lưu dòng document</span>
<span class="tok-keyword">const</span> pieces = chunkText(rawText);
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>; i &lt; pieces.length; i++) {
  <span class="tok-keyword">const</span> vec = <span class="tok-keyword">await</span> embed(pieces[i]);
  <span class="tok-keyword">const</span> literal = &#96;[\${vec.join(<span class="tok-string">','</span>)}]&#96;;      <span class="tok-comment">// dạng text pgvector: [0.1,0.2,...]</span>
  <span class="tok-keyword">await</span> prisma.$executeRaw&#96;
    INSERT INTO chunks (document_id, chunk_index, content, embedding)
    VALUES (\${docId}, \${i}, \${pieces[i]}, \${literal}::vector)&#96;;
}</pre>

<h3>Ví dụ có lời giải — một lần tải, đầu tới cuối</h3>
<div class="out"><b>Tải:</b> một ghi chú 3.000 ký tự tên "Databases".
<b>Bước 1 —</b> chunkText → 4 chunk (mỗi cái 800 ký tự, chồng lấn 100).
<b>Bước 2 —</b> embed() gọi 4 lần → 4 vector độ dài 1536.
<b>Bước 3 —</b> 4 INSERT vào chunks, mỗi cái có embedding.
<b>Kiểm:</b>  SELECT count(*) FROM chunks WHERE document_id = 12;  → 4
           SELECT vector_dims(embedding) FROM chunks LIMIT 1;   → 1536
<b>Kết quả:</b> ghi chú giờ là một tập vector tìm được. Phần đọc (Mục 4) có thể truy hồi chúng.</div>

<div class="pitfall"><strong>Bẫy:</strong> embed cả tài liệu trong một lời gọi, hoặc lưu vector thành chuỗi JSON trong cột TEXT. Cái đầu mất độ mịn chunk; cái sau không index được bởi pgvector và toán tử <code>&lt;=&gt;</code> sẽ không chạy trên nó. Luôn chèn vào một cột <code>vector</code> thật qua <code>::vector</code>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Batch embed và làm nạp idempotent.</b> Gọi <code>embed()</code> mỗi chunk một lần ổn cho demo, nhưng pipeline thật gom nhiều chunk mỗi lời gọi embedding (ít round trip, rẻ hơn) và làm việc tải lại idempotent — xoá chunk cũ của một tài liệu trước khi chèn lại, hoặc khoá theo <code>(document_id, chunk_index)</code> để một lần thử lại không nhân đôi dòng. <em>Vì sao ngoài syllabus: batching và ghi idempotent là kỹ nghệ chi phí và tính đúng mà giáo trình không nêu cho pipeline AI.</em></div>
</div>
`,
        },
      ],
    },
  ],
};
