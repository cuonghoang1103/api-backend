/**
 * PRE301 — Strategic Public Relations (Quan hệ công chúng chiến lược).
 * Ngành Công nghệ Truyền thông FPTU, kỳ 5. Môn NÂNG CAO nối tiếp PRE203
 * (Nhập môn PR). KHÔNG có FLM syl công khai → dựng theo giáo trình chuẩn
 * quốc tế: Smith "Strategic Planning for Public Relations" (mô hình ROSTIR /
 * 4 pha), Wilcox "Public Relations: Strategies and Tactics", Austin &
 * Pinkleton "Strategic Public Relations Management"; PRSA & AMEC. 8 chương:
 * tư duy chiến lược & hoạch định · nghiên cứu hình thành · mục tiêu & công
 * chúng · thông điệp & người phát ngôn · chiến thuật & kênh tích hợp · quản
 * trị khủng hoảng & vấn đề · PR nội bộ, CSR & quan hệ chính phủ · đo lường &
 * đánh giá. Song ngữ + ví dụ chiến dịch thật + quiz.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→"&amp;" trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('pre301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách chiến lược (Smith ROSTIR, Wilcox, Austin & Pinkleton), chuẩn đo lường AMEC/Barcelona, hiệp hội nghề (PRSA/IPRA), công cụ hoạch định & giám sát, lộ trình 4 pha.',
  [[
    `<span class="eyebrow">PRE301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to move from <strong>doing PR</strong> to <strong>planning and managing it strategically</strong> — the strategic planning process, formative research, objectives &amp; publics, message &amp; spokesperson strategy, integrated tactics, crisis &amp; issues management, and rigorous measurement. Builds directly on <strong>PRE203 (Introduction to PR)</strong>.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><a href="https://www.routledge.com/" target="_blank" rel="noopener"><em>Strategic Planning for Public Relations</em> — Ronald D. Smith</a> — home of the nine-step / four-phase (ROSTIR) planning model this course follows.</li>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener"><em>Public Relations: Strategies and Tactics</em> — Wilcox, Cameron &amp; Reber</a> — the tactic-by-tactic reference.</li>
<li><a href="https://www.routledge.com/" target="_blank" rel="noopener"><em>Strategic Public Relations Management</em> — Austin &amp; Pinkleton</a> — planning and evaluation with an evidence-based lens.</li>
</ul>
<h3>🌐 Professional bodies &amp; standards (free)</h3>
<ul>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA</a> — Code of Ethics, strategy resources, case studies (Silver Anvil awards).</li>
<li><a href="https://amecorg.com/" target="_blank" rel="noopener">AMEC — Barcelona Principles &amp; Measurement Framework</a> — the global standard for evaluating campaigns.</li>
<li><a href="https://www.ipra.org/" target="_blank" rel="noopener">IPRA</a> — international code &amp; global standards.</li>
</ul>
<h3>🛠️ Planning &amp; monitoring tools</h3>
<ul>
<li><a href="https://www.cision.com/" target="_blank" rel="noopener">Cision</a> — media database, monitoring &amp; measurement.</li>
<li><a href="https://www.meltwater.com/" target="_blank" rel="noopener">Meltwater</a> — media &amp; social listening for situation analysis.</li>
<li><a href="https://www.muckrack.com/" target="_blank" rel="noopener">Muck Rack</a> — journalist database, pitching &amp; coverage reports.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Think strategically</strong> — see PR as a planned management function tied to organizational goals, not a stream of tactics.</li>
<li><strong>Run the model</strong> — walk one real (mini) campaign through Smith's four phases: formative research → strategy → tactics → evaluation.</li>
<li><strong>Handle the hard cases</strong> — issues &amp; crisis management, internal / investor / community relations, CSR and public affairs.</li>
<li><strong>Prove value</strong> — set measurable objectives and evaluate outputs, outtakes and outcomes with the Barcelona Principles.</li>
</ol></div>`,
    `<span class="eyebrow">PRE301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để chuyển từ <strong>làm PR</strong> sang <strong>hoạch định và quản trị PR một cách chiến lược</strong> — quy trình hoạch định, nghiên cứu hình thành, mục tiêu &amp; công chúng, chiến lược thông điệp &amp; người phát ngôn, chiến thuật tích hợp, quản trị khủng hoảng &amp; vấn đề, và đo lường chặt chẽ. Nối tiếp trực tiếp <strong>PRE203 (Nhập môn PR)</strong>.</p>
<h3>📘 Sách giáo trình gốc</h3>
<ul>
<li><a href="https://www.routledge.com/" target="_blank" rel="noopener"><em>Strategic Planning for Public Relations</em> — Ronald D. Smith</a> — nơi sinh ra mô hình hoạch định 9 bước / 4 pha (ROSTIR) mà môn này theo.</li>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener"><em>Public Relations: Strategies and Tactics</em> — Wilcox, Cameron &amp; Reber</a> — sách tra cứu theo từng chiến thuật.</li>
<li><a href="https://www.routledge.com/" target="_blank" rel="noopener"><em>Strategic Public Relations Management</em> — Austin &amp; Pinkleton</a> — hoạch định và đánh giá theo hướng dựa trên bằng chứng.</li>
</ul>
<h3>🌐 Hiệp hội nghề &amp; chuẩn (miễn phí)</h3>
<ul>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA</a> — Bộ quy tắc đạo đức, tài liệu chiến lược, case study (giải Silver Anvil).</li>
<li><a href="https://amecorg.com/" target="_blank" rel="noopener">AMEC — Nguyên tắc Barcelona &amp; Khung đo lường</a> — chuẩn toàn cầu để đánh giá chiến dịch.</li>
<li><a href="https://www.ipra.org/" target="_blank" rel="noopener">IPRA</a> — bộ quy tắc &amp; chuẩn quốc tế.</li>
</ul>
<h3>🛠️ Công cụ hoạch định &amp; giám sát</h3>
<ul>
<li><a href="https://www.cision.com/" target="_blank" rel="noopener">Cision</a> — cơ sở dữ liệu báo chí, giám sát &amp; đo lường.</li>
<li><a href="https://www.meltwater.com/" target="_blank" rel="noopener">Meltwater</a> — lắng nghe báo chí &amp; mạng xã hội phục vụ phân tích tình huống.</li>
<li><a href="https://www.muckrack.com/" target="_blank" rel="noopener">Muck Rack</a> — dữ liệu nhà báo, gửi pitch &amp; báo cáo tin bài.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Tư duy chiến lược</strong> — coi PR là chức năng quản trị có kế hoạch, gắn với mục tiêu tổ chức, không phải chuỗi chiến thuật rời rạc.</li>
<li><strong>Chạy mô hình</strong> — đưa một chiến dịch (nhỏ) thật qua bốn pha của Smith: nghiên cứu hình thành → chiến lược → chiến thuật → đánh giá.</li>
<li><strong>Xử ca khó</strong> — quản trị vấn đề &amp; khủng hoảng, quan hệ nội bộ / nhà đầu tư / cộng đồng, CSR và quan hệ chính phủ.</li>
<li><strong>Chứng minh giá trị</strong> — đặt mục tiêu đo được và đánh giá outputs, outtakes, outcomes theo Nguyên tắc Barcelona.</li>
</ol></div>`,
  ]]);

const intro = doc('pre301-0-1-overview', 'Course overview: Strategic Public Relations|||Tổng quan: Quan hệ công chúng chiến lược',
  'Môn nâng cao nối tiếp PRE203: từ "biết PR là gì" sang hoạch định & quản trị chiến dịch. Lộ trình 8 chương theo mô hình 4 pha của Smith: nghiên cứu → chiến lược → chiến thuật → đánh giá, cộng khủng hoảng, PR nội bộ/CSR/công.',
  [[
    `<span class="eyebrow">PRE301 · Lesson 0.1 · Overview</span>
<h2>Strategic Public Relations</h2>
<p class="lead">This is the <strong>advanced sequel to PRE203</strong>. Where the intro course answered "what is PR and how does it work", PRE301 answers a harder question: <strong>how do you plan, manage and prove the value of a PR program</strong> that actually moves an organization's goals?</p>
<h3>From tactics to strategy</h3>
<p>PRE203 gave you the building blocks — press releases, media relations, the PESO channels, the RACE process. PRE301 treats PR as a <strong>management function</strong>: it starts from the organization's objectives, grounds every decision in <strong>research</strong>, and follows a disciplined planning model so that tactics are chosen <em>because</em> they serve a strategy, not because they are fashionable.</p>
<h3>The model we'll follow</h3>
<p>Ronald D. Smith organizes strategic PR into <strong>four phases</strong> (the ROSTIR model):</p>
<ol>
<li><strong>Formative research</strong> — analyze the situation, the organization and the publics.</li>
<li><strong>Strategy</strong> — set objectives, choose key publics, and design the message.</li>
<li><strong>Tactics</strong> — pick integrated communication tools and package the plan.</li>
<li><strong>Evaluative research</strong> — measure results against the objectives.</li>
</ol>
<h3>Roadmap</h3>
<p>Strategic thinking &amp; planning models → formative research → objectives &amp; strategic publics → message &amp; spokesperson strategy → integrated tactics &amp; channels → issues &amp; crisis management → internal, CSR &amp; government relations → measurement &amp; evaluation. Bilingual, with real campaign examples and a quiz each chapter.</p>`,
    `<span class="eyebrow">PRE301 · Bài 0.1 · Tổng quan</span>
<h2>Quan hệ công chúng chiến lược</h2>
<p class="lead">Đây là <strong>phần nâng cao nối tiếp PRE203</strong>. Nếu môn nhập môn trả lời "PR là gì và vận hành thế nào", thì PRE301 trả lời một câu hỏi khó hơn: <strong>làm sao hoạch định, quản trị và chứng minh giá trị của một chương trình PR</strong> thật sự làm dịch chuyển mục tiêu của tổ chức?</p>
<h3>Từ chiến thuật lên chiến lược</h3>
<p>PRE203 cho bạn các khối dựng — thông cáo báo chí, quan hệ báo chí, kênh PESO, quy trình RACE. PRE301 coi PR là một <strong>chức năng quản trị</strong>: nó khởi đi từ mục tiêu của tổ chức, đặt mọi quyết định trên <strong>nghiên cứu</strong>, và theo một mô hình hoạch định có kỷ luật để chiến thuật được chọn <em>vì</em> nó phục vụ chiến lược, chứ không vì đang thịnh hành.</p>
<h3>Mô hình sẽ theo</h3>
<p>Ronald D. Smith sắp xếp PR chiến lược thành <strong>bốn pha</strong> (mô hình ROSTIR):</p>
<ol>
<li><strong>Nghiên cứu hình thành</strong> — phân tích tình huống, tổ chức và công chúng.</li>
<li><strong>Chiến lược</strong> — đặt mục tiêu, chọn công chúng chủ chốt, và thiết kế thông điệp.</li>
<li><strong>Chiến thuật</strong> — chọn công cụ truyền thông tích hợp và đóng gói kế hoạch.</li>
<li><strong>Nghiên cứu đánh giá</strong> — đo kết quả so với mục tiêu.</li>
</ol>
<h3>Lộ trình</h3>
<p>Tư duy &amp; mô hình hoạch định chiến lược → nghiên cứu hình thành → mục tiêu &amp; công chúng chiến lược → chiến lược thông điệp &amp; người phát ngôn → chiến thuật &amp; kênh tích hợp → quản trị vấn đề &amp; khủng hoảng → PR nội bộ, CSR &amp; quan hệ chính phủ → đo lường &amp; đánh giá. Song ngữ, có ví dụ chiến dịch thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('pre301-1-1-strategic-thinking', '1.1 — Strategic thinking & the planning model (ROSTIR)|||1.1 — Tư duy PR chiến lược & mô hình hoạch định (ROSTIR)',
  'PR như chức năng quản trị; strategy vs tactics; mô hình 4 pha / 9 bước của Smith (ROSTIR); liên kết mục tiêu tổ chức → mục tiêu truyền thông; MBO trong PR.',
  [[
    `<span class="eyebrow">PRE301 · Chapter 1 · Lesson 1.1</span>
<h2>Strategic thinking &amp; the planning model</h2>
<h3>What makes PR "strategic"</h3>
<p>Strategy is <strong>the overall game plan</strong> — the "why" and "what for"; tactics are the <strong>specific actions</strong> — the "how" and "with what". Strategic PR is <strong>management by objectives (MBO)</strong>: it links every communication activity back to a business goal, so you can always answer "what is this for?".</p>
<h3>Smith's four-phase model (ROSTIR)</h3>
<pre><code>Phase 1  FORMATIVE RESEARCH
   1 Analyze the situation
   2 Analyze the organization
   3 Analyze the publics
Phase 2  STRATEGY
   4 Establish goals &amp; objectives
   5 Formulate action &amp; response strategies
   6 Design effective communication (message)
Phase 3  TACTICS
   7 Choose communication tactics
   8 Implement the strategic plan
Phase 4  EVALUATIVE RESEARCH
   9 Evaluate the plan
</code></pre>
<p>The mnemonic <strong>ROSTIR</strong> — Research, Objectives, Strategy, Tactics, Implementation, Reporting — captures the same flow. The point is discipline: <em>research before objectives, objectives before tactics, evaluation against those objectives</em>.</p>
<div class="callout"><span class="badge">Key idea</span> A tactic without a strategy is just activity. "We should be on TikTok" is not a plan until you can name the public, the objective and how you'll measure it.</div>`,
    `<span class="eyebrow">PRE301 · Chương 1 · Bài 1.1</span>
<h2>Tư duy chiến lược &amp; mô hình hoạch định</h2>
<h3>Điều gì khiến PR "chiến lược"</h3>
<p>Chiến lược là <strong>kế hoạch tổng thể</strong> — cái "vì sao" và "để làm gì"; chiến thuật là <strong>hành động cụ thể</strong> — cái "làm thế nào" và "bằng gì". PR chiến lược là <strong>quản trị theo mục tiêu (MBO)</strong>: nó nối mọi hoạt động truyền thông về một mục tiêu kinh doanh, để bạn luôn trả lời được "cái này để làm gì?".</p>
<h3>Mô hình bốn pha của Smith (ROSTIR)</h3>
<pre><code>Pha 1  NGHIEN CUU HINH THANH
   1 Phan tich tinh huong
   2 Phan tich to chuc
   3 Phan tich cong chung
Pha 2  CHIEN LUOC
   4 Dat muc dich &amp; muc tieu
   5 Xay chien luoc hanh dong &amp; ung pho
   6 Thiet ke truyen thong (thong diep)
Pha 3  CHIEN THUAT
   7 Chon chien thuat truyen thong
   8 Thuc thi ke hoach
Pha 4  NGHIEN CUU DANH GIA
   9 Danh gia ke hoach
</code></pre>
<p>Chữ ghép <strong>ROSTIR</strong> — Research, Objectives, Strategy, Tactics, Implementation, Reporting — gói cùng một dòng chảy. Cốt lõi là kỷ luật: <em>nghiên cứu trước mục tiêu, mục tiêu trước chiến thuật, đánh giá theo chính mục tiêu đó</em>.</p>
<div class="callout"><span class="badge">Ý chính</span> Một chiến thuật không có chiến lược chỉ là hoạt động. "Ta nên lên TikTok" chưa phải kế hoạch cho tới khi bạn gọi tên được công chúng, mục tiêu và cách đo.</div>`,
  ]]);

const c1q = quiz('pre301-quiz-1', 'Quiz 1 — Strategic thinking|||Quiz 1 — Tư duy chiến lược', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa "strategy" và "tactics" trong PR là?', options: ['Strategy là hành động cụ thể, tactics là kế hoạch tổng thể', 'Strategy là kế hoạch tổng thể/"vì sao", tactics là hành động cụ thể/"làm thế nào"', 'Hai từ đồng nghĩa, dùng thay nhau', 'Strategy chỉ dành cho quảng cáo'], correctIndex: 1, explanation: 'Strategy = game plan (why/what for); tactics = hành động cụ thể (how/with what).' },
  { id: 'q2', question: 'Bốn pha trong mô hình hoạch định của Ronald Smith theo đúng thứ tự là?', options: ['Chiến thuật → nghiên cứu → chiến lược → đánh giá', 'Nghiên cứu hình thành → chiến lược → chiến thuật → nghiên cứu đánh giá', 'Chiến lược → chiến thuật → nghiên cứu → báo cáo', 'Đánh giá → chiến lược → nghiên cứu → chiến thuật'], correctIndex: 1, explanation: 'Formative research → Strategy → Tactics → Evaluative research.' },
  { id: 'q3', question: 'PR chiến lược được ví như "quản trị theo mục tiêu (MBO)" vì?', options: ['Nó bỏ qua nghiên cứu để làm nhanh', 'Nó nối mọi hoạt động truyền thông về một mục tiêu của tổ chức', 'Nó chỉ tập trung vào số bài báo', 'Nó do phòng nhân sự phụ trách'], correctIndex: 1, explanation: 'Mỗi hoạt động phải phục vụ một mục tiêu kinh doanh — luôn trả lời "để làm gì".' },
]);

const c2 = doc('pre301-2-1-formative-research', '2.1 — Formative research & situation analysis|||2.1 — Nghiên cứu hình thành & phân tích tình huống',
  'Pha 1: phân tích tình huống (opportunity vs obstacle), phân tích tổ chức (nội bộ/công/ngoại vi), phân tích công chúng; SWOT; sơ cấp/thứ cấp, định tính/định lượng; social listening.',
  [[
    `<span class="eyebrow">PRE301 · Chapter 2 · Lesson 2.1</span>
<h2>Formative research &amp; situation analysis</h2>
<p>Phase 1 answers "where are we and why?" <strong>before</strong> anyone writes a message. Smith breaks it into three analyses.</p>
<h3>The three analyses</h3>
<ul>
<li><strong>Situation</strong> — the specific circumstance you face. Is it an <em>opportunity</em> (something positive to leverage) or an <em>obstacle</em> (a problem to overcome)? Naming this shapes everything after.</li>
<li><strong>Organization</strong> — an internal audit (mission, resources, performance), a public-perception audit (reputation), and an external environment scan (competitors, allies, trends).</li>
<li><strong>Publics</strong> — who they are, what they know and feel, how they're linked to you (customers, employees, media, opinion leaders, regulators).</li>
</ul>
<h3>SWOT &amp; research types</h3>
<p>A <strong>SWOT</strong> (Strengths, Weaknesses, Opportunities, Threats) summarizes the analysis on one page. Feed it with real data:</p>
<ul>
<li><strong>Secondary</strong> research first (existing reports, media coverage, past surveys) — cheap and fast; then <strong>primary</strong> research (your own surveys, interviews, focus groups).</li>
<li><strong>Quantitative</strong> (surveys → numbers, "how many / how much") vs <strong>qualitative</strong> (interviews, focus groups → "why"). Good plans use both.</li>
<li><strong>Social listening &amp; media audits</strong> — monitor what publics already say to find the real perception, not the one you assume.</li>
</ul>
<div class="callout"><span class="badge">Rule</span> "No research, no PR." Formative research is what separates a strategic plan from a guess — and it is where the objectives in Chapter 3 come from.</div>`,
    `<span class="eyebrow">PRE301 · Chương 2 · Bài 2.1</span>
<h2>Nghiên cứu hình thành &amp; phân tích tình huống</h2>
<p>Pha 1 trả lời "ta đang ở đâu và vì sao?" <strong>trước khi</strong> ai đó viết một thông điệp. Smith chia thành ba phân tích.</p>
<h3>Ba phân tích</h3>
<ul>
<li><strong>Tình huống</strong> — hoàn cảnh cụ thể bạn đối mặt. Đó là <em>cơ hội</em> (điều tích cực để tận dụng) hay <em>trở ngại</em> (vấn đề cần vượt qua)? Gọi đúng tên nó định hình mọi thứ sau đó.</li>
<li><strong>Tổ chức</strong> — audit nội bộ (sứ mệnh, nguồn lực, hiệu quả), audit nhận thức công chúng (danh tiếng), và quét môi trường bên ngoài (đối thủ, đồng minh, xu hướng).</li>
<li><strong>Công chúng</strong> — họ là ai, biết gì và cảm thấy gì, gắn với bạn ra sao (khách hàng, nhân viên, báo chí, người dẫn dắt dư luận, cơ quan quản lý).</li>
</ul>
<h3>SWOT &amp; các loại nghiên cứu</h3>
<p>Một bảng <strong>SWOT</strong> (Điểm mạnh, Điểm yếu, Cơ hội, Thách thức) tóm tắt phân tích trên một trang. Nuôi nó bằng dữ liệu thật:</p>
<ul>
<li>Nghiên cứu <strong>thứ cấp</strong> trước (báo cáo có sẵn, tin bài, khảo sát cũ) — rẻ và nhanh; rồi <strong>sơ cấp</strong> (khảo sát, phỏng vấn, nhóm tập trung của chính bạn).</li>
<li><strong>Định lượng</strong> (khảo sát → con số, "bao nhiêu") so với <strong>định tính</strong> (phỏng vấn, focus group → "vì sao"). Kế hoạch tốt dùng cả hai.</li>
<li><strong>Social listening &amp; audit báo chí</strong> — giám sát điều công chúng đang nói để tìm nhận thức thật, không phải nhận thức bạn giả định.</li>
</ul>
<div class="callout"><span class="badge">Quy tắc</span> "Không nghiên cứu, không PR." Nghiên cứu hình thành là thứ tách một kế hoạch chiến lược khỏi một phỏng đoán — và là nơi mục tiêu ở Chương 3 sinh ra.</div>`,
  ]]);

const c2q = quiz('pre301-quiz-2', 'Quiz 2 — Formative research|||Quiz 2 — Nghiên cứu hình thành', [
  { id: 'q1', question: 'Trong phân tích tình huống, việc gọi tên "cơ hội" hay "trở ngại" quan trọng vì?', options: ['Chỉ để làm đẹp báo cáo', 'Nó định hình toàn bộ mục tiêu và chiến lược phía sau', 'Luật PR bắt buộc', 'Không ảnh hưởng gì tới kế hoạch'], correctIndex: 1, explanation: 'Opportunity vs obstacle định hình cả kế hoạch — leverage cơ hội hay khắc phục vấn đề.' },
  { id: 'q2', question: 'Khác biệt giữa nghiên cứu định lượng và định tính là?', options: ['Định lượng cho "vì sao", định tính cho con số', 'Định lượng cho con số ("bao nhiêu"), định tính cho "vì sao"', 'Cả hai chỉ dùng khảo sát', 'Định tính luôn chính xác hơn'], correctIndex: 1, explanation: 'Định lượng = số (khảo sát); định tính = chiều sâu "vì sao" (phỏng vấn, focus group).' },
  { id: 'q3', question: 'Công cụ một trang tóm tắt Điểm mạnh, Điểm yếu, Cơ hội, Thách thức là?', options: ['PESO', 'SWOT', 'ROSTIR', 'AVE'], correctIndex: 1, explanation: 'SWOT: Strengths, Weaknesses, Opportunities, Threats.' },
]);

const c3 = doc('pre301-3-1-objectives-publics', '3.1 — Strategic objectives & key publics|||3.1 — Mục tiêu & công chúng chiến lược',
  'Pha 2: goal vs objective; ba bậc mục tiêu awareness/acceptance/action; viết mục tiêu đo được (public + kết quả + mức + hạn); chọn key publics; định vị (positioning).',
  [[
    `<span class="eyebrow">PRE301 · Chapter 3 · Lesson 3.1</span>
<h2>Strategic objectives &amp; key publics</h2>
<h3>Goals vs objectives</h3>
<p>A <strong>goal</strong> is a broad, qualitative direction ("become the region's most trusted clinic"). An <strong>objective</strong> is a specific, measurable milestone toward it. Smith sorts objectives into a <strong>hierarchy of three</strong>, matching how people change:</p>
<ol>
<li><strong>Awareness objectives</strong> (cognitive) — attention, comprehension, retention. "Increase awareness of the new service to 40% of young parents in 3 months."</li>
<li><strong>Acceptance objectives</strong> (affective) — interest and attitude. "Raise favorable attitude toward the clinic from 25% to 45%."</li>
<li><strong>Action objectives</strong> (behavioral) — the real payoff. "Generate 500 new bookings in Q2." Awareness and acceptance exist to enable action.</li>
</ol>
<div class="callout"><span class="badge">Well-formed objective</span> Every objective names a <strong>public</strong>, a <strong>desired result</strong>, a <strong>measurable level</strong>, and a <strong>deadline</strong>. Miss any of the four and you cannot evaluate it later.</div>
<h3>Choosing key publics &amp; positioning</h3>
<p>You cannot pursue every public with equal effort. <strong>Key publics</strong> are the few groups most essential to the objective. For each, PR defines a <strong>position</strong> — the distinct place you want to occupy in their mind (e.g. "the safest choice", "the challenger for young families") relative to competitors. Objectives + key publics + positioning are the heart of the strategy.</p>`,
    `<span class="eyebrow">PRE301 · Chương 3 · Bài 3.1</span>
<h2>Mục tiêu &amp; công chúng chiến lược</h2>
<h3>Mục đích (goal) khác mục tiêu (objective)</h3>
<p><strong>Mục đích (goal)</strong> là hướng đi rộng, định tính ("trở thành phòng khám được tin nhất vùng"). <strong>Mục tiêu (objective)</strong> là cột mốc cụ thể, đo được hướng tới nó. Smith xếp mục tiêu theo <strong>thứ bậc ba tầng</strong>, khớp với cách con người thay đổi:</p>
<ol>
<li><strong>Mục tiêu nhận biết</strong> (nhận thức) — chú ý, hiểu, nhớ. "Tăng nhận biết dịch vụ mới lên 40% cha mẹ trẻ trong 3 tháng."</li>
<li><strong>Mục tiêu chấp nhận</strong> (cảm xúc) — quan tâm và thái độ. "Nâng thái độ tích cực với phòng khám từ 25% lên 45%."</li>
<li><strong>Mục tiêu hành động</strong> (hành vi) — phần thưởng thật. "Tạo 500 lượt đặt lịch mới trong Q2." Nhận biết và chấp nhận tồn tại để dẫn tới hành động.</li>
</ol>
<div class="callout"><span class="badge">Mục tiêu đúng chuẩn</span> Mỗi mục tiêu gọi tên một <strong>công chúng</strong>, một <strong>kết quả mong muốn</strong>, một <strong>mức đo được</strong>, và một <strong>hạn định</strong>. Thiếu một trong bốn là không đánh giá được về sau.</div>
<h3>Chọn công chúng chủ chốt &amp; định vị</h3>
<p>Bạn không thể dồn công sức ngang nhau cho mọi công chúng. <strong>Công chúng chủ chốt (key publics)</strong> là số ít nhóm thiết yếu nhất với mục tiêu. Với mỗi nhóm, PR xác định một <strong>định vị (position)</strong> — vị trí riêng bạn muốn chiếm trong tâm trí họ (vd "lựa chọn an toàn nhất", "kẻ thách thức cho gia đình trẻ") so với đối thủ. Mục tiêu + công chúng chủ chốt + định vị là trái tim của chiến lược.</p>`,
  ]]);

const c3q = quiz('pre301-quiz-3', 'Quiz 3 — Objectives & publics|||Quiz 3 — Mục tiêu & công chúng', [
  { id: 'q1', question: 'Ba bậc mục tiêu PR theo Smith (khớp cách công chúng thay đổi) là?', options: ['Paid, earned, owned', 'Awareness (nhận biết) → acceptance (chấp nhận) → action (hành động)', 'Research, strategy, tactics', 'Output, outtake, outcome'], correctIndex: 1, explanation: 'Nhận thức → cảm xúc → hành vi: awareness, acceptance, action.' },
  { id: 'q2', question: 'Một mục tiêu PR viết đúng chuẩn phải có đủ?', options: ['Chỉ một con số phần trăm', 'Công chúng + kết quả mong muốn + mức đo được + hạn định', 'Tên người phát ngôn', 'Ngân sách và địa điểm'], correctIndex: 1, explanation: 'Thiếu một trong bốn (public/result/level/deadline) là không đánh giá được.' },
  { id: 'q3', question: '"Key publics" (công chúng chủ chốt) nghĩa là?', options: ['Toàn bộ dân số', 'Số ít nhóm thiết yếu nhất với mục tiêu, nơi dồn công sức', 'Chỉ các nhà báo', 'Nhóm đông người nhất bất kể liên quan'], correctIndex: 1, explanation: 'Không dồn công sức ngang nhau; chọn nhóm thiết yếu nhất với mục tiêu.' },
]);

const c4 = doc('pre301-4-1-message-spokesperson', '4.1 — Message strategy & the spokesperson|||4.1 — Chiến lược thông điệp & người phát ngôn',
  'Pha 2 (bước 6): message strategy (key message, rational vs emotional appeal, verbal/nonverbal), third-party endorsement, người phát ngôn (credibility: expertise/trustworthiness), source appeals.',
  [[
    `<span class="eyebrow">PRE301 · Chapter 4 · Lesson 4.1</span>
<h2>Message strategy &amp; the spokesperson</h2>
<h3>Designing the message</h3>
<p>Step 6 turns strategy into <strong>what you actually say</strong>. Every key public needs a <strong>key message</strong> — one or two core ideas repeated consistently. Decide the <strong>appeal</strong>:</p>
<ul>
<li><strong>Rational</strong> — facts, evidence, cost/benefit (good for high-involvement, considered decisions).</li>
<li><strong>Emotional</strong> — hopes, fears, belonging, humor (good for attitude and memorability).</li>
<li><strong>Positive vs negative</strong> — reward the desired behavior, or warn of a consequence; positive appeals age better and carry less ethical risk.</li>
</ul>
<h3>The source: credibility &amp; the spokesperson</h3>
<p>The same message lands differently depending on <em>who</em> delivers it. Source <strong>credibility</strong> has three drivers: <strong>expertise</strong> (do they know?), <strong>trustworthiness</strong> (are they honest?), and <strong>likability/attractiveness</strong>. A good <strong>spokesperson</strong> is on-message, trained, and matched to the public.</p>
<h3>Third-party endorsement</h3>
<p>The most powerful PR asset is someone <em>other than you</em> vouching for you — a journalist, expert, review, award, or satisfied customer. Because the audience knows they aren't paid to say it, <strong>third-party endorsement</strong> carries credibility advertising cannot buy. Strategy decides which endorsers to cultivate and how.</p>
<div class="callout"><span class="badge">Example</span> A health app's own claim "clinically effective" is weak; the same point made by an independent doctor, a peer-reviewed study, and user testimonials is credible — that is message strategy plus third-party endorsement working together.</div>`,
    `<span class="eyebrow">PRE301 · Chương 4 · Bài 4.1</span>
<h2>Chiến lược thông điệp &amp; người phát ngôn</h2>
<h3>Thiết kế thông điệp</h3>
<p>Bước 6 biến chiến lược thành <strong>điều bạn thật sự nói</strong>. Mỗi công chúng chủ chốt cần một <strong>thông điệp chính (key message)</strong> — một hai ý cốt lõi lặp lại nhất quán. Chọn <strong>kiểu tác động (appeal)</strong>:</p>
<ul>
<li><strong>Lý trí</strong> — sự thật, bằng chứng, lợi ích/chi phí (hợp với quyết định cân nhắc kỹ, mức liên quan cao).</li>
<li><strong>Cảm xúc</strong> — hy vọng, nỗi sợ, thuộc về, hài hước (hợp với thái độ và độ ghi nhớ).</li>
<li><strong>Tích cực so với tiêu cực</strong> — thưởng cho hành vi mong muốn, hoặc cảnh báo hậu quả; tác động tích cực bền hơn và ít rủi ro đạo đức hơn.</li>
</ul>
<h3>Nguồn phát: độ tín nhiệm &amp; người phát ngôn</h3>
<p>Cùng một thông điệp rơi khác nhau tuỳ <em>ai</em> nói. <strong>Độ tín nhiệm (credibility)</strong> của nguồn có ba trụ: <strong>chuyên môn</strong> (họ có biết không?), <strong>đáng tin</strong> (họ có trung thực không?), và <strong>dễ mến/hấp dẫn</strong>. Một <strong>người phát ngôn</strong> tốt bám thông điệp, được huấn luyện, và khớp với công chúng.</p>
<h3>Chứng thực từ bên thứ ba</h3>
<p>Tài sản PR mạnh nhất là ai đó <em>không phải bạn</em> đứng ra bảo chứng — nhà báo, chuyên gia, review, giải thưởng, hay khách hàng hài lòng. Vì khán giả biết họ không được trả tiền để nói, <strong>chứng thực bên thứ ba</strong> mang độ tin mà quảng cáo không mua được. Chiến lược quyết định nuôi dưỡng người bảo chứng nào và bằng cách nào.</p>
<div class="callout"><span class="badge">Ví dụ</span> Một app sức khoẻ tự nói "hiệu quả lâm sàng" thì yếu; cùng ý đó do một bác sĩ độc lập, một nghiên cứu bình duyệt, và lời chứng người dùng nói ra thì đáng tin — đó là chiến lược thông điệp cộng chứng thực bên thứ ba cùng vận hành.</div>`,
  ]]);

const c4q = quiz('pre301-quiz-4', 'Quiz 4 — Message & spokesperson|||Quiz 4 — Thông điệp & người phát ngôn', [
  { id: 'q1', question: 'Ba yếu tố tạo nên độ tín nhiệm (credibility) của nguồn phát thông điệp là?', options: ['Giá, chỗ, khuyến mãi', 'Chuyên môn (expertise), đáng tin (trustworthiness), dễ mến/hấp dẫn', 'Reach, frequency, impact', 'Paid, earned, owned'], correctIndex: 1, explanation: 'Credibility = expertise + trustworthiness + likability/attractiveness.' },
  { id: 'q2', question: 'Vì sao "chứng thực bên thứ ba" (third-party endorsement) đáng tin hơn tự quảng cáo?', options: ['Vì nó luôn miễn phí', 'Vì khán giả biết bên thứ ba không được trả tiền để nói tốt', 'Vì nó dài hơn', 'Vì luật yêu cầu'], correctIndex: 1, explanation: 'Nhà báo/chuyên gia/khách hàng bảo chứng độc lập → độ tin quảng cáo không mua được.' },
  { id: 'q3', question: 'Thông điệp dùng "rational appeal" phù hợp nhất khi?', options: ['Quyết định cảm tính, ít suy nghĩ', 'Quyết định cân nhắc kỹ, mức liên quan cao, cần bằng chứng', 'Chỉ khi có ngân sách lớn', 'Không bao giờ nên dùng'], correctIndex: 1, explanation: 'Rational (sự thật, lợi ích/chi phí) hợp quyết định high-involvement; cảm xúc hợp thái độ/ghi nhớ.' },
]);

const c5 = doc('pre301-5-1-integrated-tactics', '5.1 — Integrated tactics & channels|||5.1 — Chiến thuật & kênh tích hợp',
  'Pha 3: tactics matrix (interpersonal, organizational/owned media, news/earned media, advertising/paid); PESO tích hợp; digital PR; đóng gói thành chương trình (calendar, budget, Gantt).',
  [[
    `<span class="eyebrow">PRE301 · Chapter 5 · Lesson 5.1</span>
<h2>Integrated tactics &amp; channels</h2>
<p>Phase 3 chooses the <strong>tools</strong> — but only now, after research, objectives and message. Smith groups tactics into four families:</p>
<ul>
<li><strong>Interpersonal</strong> — meetings, events, speeches, sponsorships: high impact, low reach, most credible.</li>
<li><strong>Owned media</strong> (organizational) — website, newsletter, reports, social channels you control.</li>
<li><strong>News / earned media</strong> — press releases, media pitches, interviews: credible, but you don't control the wording.</li>
<li><strong>Advertising / paid media</strong> — used strategically to guarantee reach and timing for a key message.</li>
</ul>
<h3>Integration: the PESO discipline</h3>
<p>These map onto <strong>PESO</strong> (Paid, Earned, Shared, Owned). "Integrated" means they reinforce each other — earned coverage is amplified on owned and shared channels, and paid guarantees the reach — all carrying <em>one consistent message</em>. <strong>Digital PR</strong> (influencers, online newsrooms, SEO-earning coverage, social listening) sits across shared and earned.</p>
<h3>Packaging the plan</h3>
<pre><code>For each key public, build a tactics matrix:
  Public | Objective | Key message | Tactics (PESO) | Channel | Timing | Owner | Budget
Then a calendar/Gantt sequences it, and a budget totals it.
</code></pre>
<div class="callout"><span class="badge">Example</span> A city bike-share launch: mayor ride-along event (interpersonal), route map + app (owned), a launch-day press release &amp; journalist rides (earned), user photo challenge (shared), and boosted safety posts (paid) — one message ("cheap, safe, everywhere") across every channel.</div>`,
    `<span class="eyebrow">PRE301 · Chương 5 · Bài 5.1</span>
<h2>Chiến thuật &amp; kênh tích hợp</h2>
<p>Pha 3 chọn <strong>công cụ</strong> — nhưng chỉ tới bây giờ, sau nghiên cứu, mục tiêu và thông điệp. Smith gom chiến thuật thành bốn họ:</p>
<ul>
<li><strong>Liên cá nhân</strong> — họp, sự kiện, diễn thuyết, tài trợ: tác động cao, độ phủ thấp, đáng tin nhất.</li>
<li><strong>Owned media</strong> (của tổ chức) — website, newsletter, báo cáo, kênh mạng xã hội bạn kiểm soát.</li>
<li><strong>Earned media / tin tức</strong> — thông cáo, pitch báo chí, phỏng vấn: đáng tin, nhưng bạn không kiểm soát câu chữ.</li>
<li><strong>Paid media / quảng cáo</strong> — dùng có chiến lược để bảo đảm độ phủ và thời điểm cho một thông điệp chủ chốt.</li>
</ul>
<h3>Tích hợp: kỷ luật PESO</h3>
<p>Bốn họ này khớp vào <strong>PESO</strong> (Paid, Earned, Shared, Owned). "Tích hợp" nghĩa là chúng bổ trợ nhau — tin earned được khuếch đại trên kênh owned và shared, còn paid bảo đảm độ phủ — tất cả mang <em>một thông điệp nhất quán</em>. <strong>Digital PR</strong> (influencer, phòng tin trực tuyến, tin bài earn được backlink SEO, social listening) nằm vắt qua shared và earned.</p>
<h3>Đóng gói kế hoạch</h3>
<pre><code>Voi moi cong chung chu chot, dung mot tactics matrix:
  Cong chung | Muc tieu | Thong diep | Chien thuat (PESO) | Kenh | Thoi diem | Nguoi phu trach | Ngan sach
Roi mot lich/Gantt sap trinh tu, va mot ngan sach cong tong.
</code></pre>
<div class="callout"><span class="badge">Ví dụ</span> Ra mắt xe đạp công cộng của thành phố: thị trưởng đạp cùng (liên cá nhân), bản đồ tuyến + app (owned), thông cáo ngày ra mắt &amp; cho nhà báo đạp thử (earned), thử thách ảnh người dùng (shared), và đẩy bài an toàn (paid) — một thông điệp ("rẻ, an toàn, khắp nơi") trên mọi kênh.</div>`,
  ]]);

const c5q = quiz('pre301-quiz-5', 'Quiz 5 — Integrated tactics|||Quiz 5 — Chiến thuật tích hợp', [
  { id: 'q1', question: 'Trong mô hình của Smith, chiến thuật được chọn vào lúc nào?', options: ['Đầu tiên, trước cả nghiên cứu', 'Ở Pha 3, sau nghiên cứu, mục tiêu và thông điệp', 'Bất cứ khi nào có ý tưởng hay', 'Chỉ sau khi đánh giá xong'], correctIndex: 1, explanation: 'Chiến thuật ở Pha 3 — công cụ được chọn VÌ phục vụ chiến lược đã có.' },
  { id: 'q2', question: 'Loại chiến thuật "liên cá nhân" (sự kiện, gặp mặt) có đặc điểm?', options: ['Độ phủ rất lớn, ít đáng tin', 'Tác động cao, độ phủ thấp, đáng tin nhất', 'Hoàn toàn miễn phí và tự động', 'Chỉ dùng cho quảng cáo'], correctIndex: 1, explanation: 'Interpersonal: impact cao, reach thấp, credibility cao nhất.' },
  { id: 'q3', question: '"Tích hợp" (integrated) trong PESO nghĩa là?', options: ['Chỉ dùng một kênh duy nhất', 'Các kênh bổ trợ nhau, cùng mang một thông điệp nhất quán', 'Tách rời paid khỏi mọi kênh khác', 'Bỏ hẳn earned media'], correctIndex: 1, explanation: 'Earned được khuếch đại trên owned/shared, paid bảo đảm reach — một thông điệp nhất quán.' },
]);

const c6 = doc('pre301-6-1-issues-crisis', '6.1 — Issues & crisis management|||6.1 — Quản trị vấn đề & khủng hoảng',
  'Issues management (quét sớm, vòng đời vấn đề), chuẩn bị khủng hoảng (crisis plan, đội, người phát ngôn), SCCT của Coombs (deny/diminish/rebuild), quy tắc 24h; tổng quan, liên hệ CRM301.',
  [[
    `<span class="eyebrow">PRE301 · Chapter 6 · Lesson 6.1</span>
<h2>Issues &amp; crisis management</h2>
<h3>Issues management — before it's a crisis</h3>
<p>An <strong>issue</strong> is an emerging problem that could affect the organization if left unmanaged. <strong>Issues management</strong> scans the environment early, tracks the issue's life cycle (early → emerging → current → crisis → dormant), and acts while options are still cheap. The earlier you engage, the more control you keep.</p>
<h3>Crisis planning</h3>
<p>A <strong>crisis</strong> is a sudden, high-threat event that demands immediate response. You cannot improvise it — you <strong>plan before</strong>:</p>
<ul>
<li>A written <strong>crisis plan</strong>, a <strong>crisis team</strong> with clear roles, and a trained <strong>spokesperson</strong> (one voice).</li>
<li><strong>Holding statements</strong> drafted in advance; contact trees; dark web pages ready to publish.</li>
<li>The <strong>golden rule</strong>: respond fast (the first 24 hours set the narrative), tell the truth, show empathy, take responsibility, and never cover up.</li>
</ul>
<h3>Response strategies (Coombs' SCCT)</h3>
<p>Situational Crisis Communication Theory matches the response to how much the public blames you: <strong>deny</strong> (it isn't a crisis / not us), <strong>diminish</strong> (it's smaller / we couldn't control it), <strong>rebuild</strong> (apologize, compensate, fix). Higher responsibility → more accommodative response.</p>
<div class="callout"><span class="badge">Scope note</span> This is an overview; the dedicated <strong>CRM301 (Crisis Management)</strong> course goes deeper into simulations and recovery. Here, crisis is one part of the strategic PR toolkit.</div>`,
    `<span class="eyebrow">PRE301 · Chương 6 · Bài 6.1</span>
<h2>Quản trị vấn đề &amp; khủng hoảng</h2>
<h3>Quản trị vấn đề — trước khi thành khủng hoảng</h3>
<p>Một <strong>vấn đề (issue)</strong> là rắc rối đang nổi lên có thể ảnh hưởng tổ chức nếu bỏ mặc. <strong>Quản trị vấn đề</strong> quét môi trường sớm, theo dõi vòng đời vấn đề (sớm → nổi lên → hiện hành → khủng hoảng → ngủ), và hành động khi lựa chọn còn rẻ. Càng vào cuộc sớm, càng giữ được nhiều quyền kiểm soát.</p>
<h3>Chuẩn bị khủng hoảng</h3>
<p>Một <strong>khủng hoảng (crisis)</strong> là sự cố bất ngờ, đe doạ cao, đòi phản ứng tức thì. Không thể ứng biến — bạn <strong>lập kế hoạch trước</strong>:</p>
<ul>
<li>Một <strong>kế hoạch khủng hoảng</strong> bằng văn bản, một <strong>đội khủng hoảng</strong> phân vai rõ, và một <strong>người phát ngôn</strong> được huấn luyện (một giọng nói).</li>
<li><strong>Tuyên bố giữ nhịp (holding statement)</strong> soạn sẵn; sơ đồ liên lạc; trang web "tối" chờ bấm đăng.</li>
<li><strong>Quy tắc vàng</strong>: phản ứng nhanh (24 giờ đầu định hình câu chuyện), nói thật, thể hiện đồng cảm, nhận trách nhiệm, và không bao giờ che giấu.</li>
</ul>
<h3>Chiến lược ứng phó (SCCT của Coombs)</h3>
<p>Lý thuyết Truyền thông Khủng hoảng Tình huống khớp phản ứng với mức công chúng quy trách nhiệm cho bạn: <strong>chối (deny)</strong> (không phải khủng hoảng / không phải chúng tôi), <strong>giảm nhẹ (diminish)</strong> (nhỏ hơn / ngoài tầm kiểm soát), <strong>tái dựng (rebuild)</strong> (xin lỗi, đền bù, khắc phục). Trách nhiệm càng cao → ứng phó càng phải nhượng bộ.</p>
<div class="callout"><span class="badge">Phạm vi</span> Đây là tổng quan; môn chuyên biệt <strong>CRM301 (Quản trị khủng hoảng)</strong> đi sâu vào mô phỏng và phục hồi. Ở đây, khủng hoảng là một phần trong bộ công cụ PR chiến lược.</div>`,
  ]]);

const c6q = quiz('pre301-quiz-6', 'Quiz 6 — Issues & crisis|||Quiz 6 — Vấn đề & khủng hoảng', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa "issue" và "crisis" là?', options: ['Không có khác biệt', 'Issue là vấn đề đang nổi lên có thể quản trị sớm; crisis là sự cố bất ngờ, đe doạ cao, đòi phản ứng tức thì', 'Crisis luôn nhỏ hơn issue', 'Issue chỉ xảy ra trên mạng xã hội'], correctIndex: 1, explanation: 'Quản trị vấn đề sớm để nó không leo thang thành khủng hoảng.' },
  { id: 'q2', question: 'Theo SCCT của Coombs, khi công chúng quy trách nhiệm CAO cho tổ chức, nên?', options: ['Chối bỏ hoàn toàn', 'Nghiêng về nhóm chiến lược "rebuild" (xin lỗi, đền bù, khắc phục)', 'Im lặng tuyệt đối', 'Đổ lỗi cho nạn nhân'], correctIndex: 1, explanation: 'Trách nhiệm càng cao → ứng phó càng nhượng bộ (rebuild), không phải deny.' },
  { id: 'q3', question: '"Quy tắc vàng" khi xử lý khủng hoảng nhấn mạnh 24 giờ đầu vì?', options: ['Sau đó không ai quan tâm nữa', 'Phản ứng nhanh trong 24h đầu định hình câu chuyện; chậm là để bên khác kể thay', 'Luật bắt buộc đúng 24 giờ', 'Để kịp mua quảng cáo'], correctIndex: 1, explanation: 'Nhanh + thật + đồng cảm + nhận trách nhiệm; 24h đầu định hình narrative.' },
]);

const c7 = doc('pre301-7-1-internal-csr-public-affairs', '7.1 — Internal, CSR & government relations|||7.1 — PR nội bộ, CSR & quan hệ chính phủ',
  'Quan hệ nội bộ (employee relations, engagement), quan hệ nhà đầu tư (IR), quan hệ cộng đồng; CSR & ESG (tránh greenwashing); public affairs, lobbying, quan hệ chính phủ.',
  [[
    `<span class="eyebrow">PRE301 · Chapter 7 · Lesson 7.1</span>
<h2>Internal, CSR &amp; government relations</h2>
<p>Strategic PR manages relationships with <strong>every</strong> stakeholder, not just customers and media.</p>
<h3>Internal &amp; financial publics</h3>
<ul>
<li><strong>Employee relations</strong> — employees are the first public and the most credible ambassadors. Internal communication drives <strong>engagement</strong>; a scandal leaks from inside first.</li>
<li><strong>Investor relations (IR)</strong> — communicating with shareholders and analysts under strict, regulated, timely-disclosure rules; reputation here moves the share price.</li>
<li><strong>Community relations</strong> — earning a "license to operate" from the people who live around the organization.</li>
</ul>
<h3>CSR &amp; ESG</h3>
<p><strong>Corporate Social Responsibility</strong> and the <strong>ESG</strong> lens (Environmental, Social, Governance) are now core to reputation. Done authentically, they build trust and loyalty; done as a veneer, they become <strong>greenwashing</strong> and backfire. The PR test: is the commitment real, measurable and reported honestly?</p>
<h3>Public affairs &amp; government relations</h3>
<p><strong>Public affairs</strong> is PR with government and the policy environment — monitoring legislation, building relationships with officials, and <strong>lobbying</strong> (advocating a position) within legal and ethical limits, with transparency about who you represent.</p>
<div class="callout"><span class="badge">Example</span> A factory that keeps employees informed, publishes real emissions data (ESG), funds local schools (community), and engages regulators early (public affairs) builds a reservoir of goodwill that protects it when something goes wrong.</div>`,
    `<span class="eyebrow">PRE301 · Chương 7 · Bài 7.1</span>
<h2>PR nội bộ, CSR &amp; quan hệ chính phủ</h2>
<p>PR chiến lược quản trị quan hệ với <strong>mọi</strong> stakeholder, không chỉ khách hàng và báo chí.</p>
<h3>Công chúng nội bộ &amp; tài chính</h3>
<ul>
<li><strong>Quan hệ nội bộ (employee relations)</strong> — nhân viên là công chúng đầu tiên và là đại sứ đáng tin nhất. Truyền thông nội bộ thúc đẩy <strong>gắn kết (engagement)</strong>; bê bối rò rỉ từ bên trong trước tiên.</li>
<li><strong>Quan hệ nhà đầu tư (IR)</strong> — truyền thông với cổ đông và giới phân tích theo luật công bố thông tin nghiêm ngặt, kịp thời; danh tiếng ở đây làm dịch chuyển giá cổ phiếu.</li>
<li><strong>Quan hệ cộng đồng</strong> — giành "giấy phép vận hành" từ những người sống quanh tổ chức.</li>
</ul>
<h3>CSR &amp; ESG</h3>
<p><strong>Trách nhiệm xã hội doanh nghiệp (CSR)</strong> và lăng kính <strong>ESG</strong> (Môi trường, Xã hội, Quản trị) nay là cốt lõi của danh tiếng. Làm chân thật thì xây niềm tin và lòng trung thành; làm kiểu tô vẽ thì thành <strong>greenwashing</strong> và phản tác dụng. Phép thử của PR: cam kết có thật, đo được, và báo cáo trung thực không?</p>
<h3>Public affairs &amp; quan hệ chính phủ</h3>
<p><strong>Public affairs</strong> là PR với chính phủ và môi trường chính sách — theo dõi luật pháp, xây quan hệ với quan chức, và <strong>vận động chính sách (lobbying)</strong> (bênh vực một quan điểm) trong giới hạn hợp pháp và đạo đức, minh bạch về việc mình đại diện cho ai.</p>
<div class="callout"><span class="badge">Ví dụ</span> Một nhà máy giữ nhân viên nắm thông tin, công bố dữ liệu phát thải thật (ESG), tài trợ trường học địa phương (cộng đồng), và làm việc sớm với cơ quan quản lý (public affairs) tích được một kho thiện chí bảo vệ nó khi có sự cố.</div>`,
  ]]);

const c7q = quiz('pre301-quiz-7', 'Quiz 7 — Internal, CSR & public affairs|||Quiz 7 — Nội bộ, CSR & quan hệ chính phủ', [
  { id: 'q1', question: 'Vì sao nhân viên được coi là "công chúng đầu tiên" trong PR chiến lược?', options: ['Vì họ trả tiền cho công ty', 'Vì họ là đại sứ đáng tin nhất và bê bối thường rò rỉ từ bên trong', 'Vì luật bắt buộc ưu tiên họ', 'Vì họ không quan trọng nên xếp đầu cho xong'], correctIndex: 1, explanation: 'Employee relations: nhân viên là đại sứ đáng tin; truyền thông nội bộ tạo engagement.' },
  { id: 'q2', question: 'CSR/ESG làm kiểu tô vẽ, không thật thì bị gọi là?', options: ['Lobbying', 'Greenwashing (tẩy xanh) và phản tác dụng', 'Investor relations', 'Public affairs'], correctIndex: 1, explanation: 'Cam kết phải thật, đo được, báo cáo trung thực; giả tạo = greenwashing.' },
  { id: 'q3', question: '"Public affairs" trong PR chiến lược chỉ về?', options: ['Quảng cáo trên báo công', 'Quan hệ với chính phủ, môi trường chính sách và vận động (lobbying) minh bạch', 'Sự kiện dành cho công chúng đại chúng', 'Quan hệ nhà đầu tư'], correctIndex: 1, explanation: 'Public affairs = PR với chính phủ/chính sách, lobbying trong giới hạn hợp pháp & minh bạch.' },
]);

const c8 = doc('pre301-8-1-measurement-evaluation', '8.1 — Measurement & campaign evaluation|||8.1 — Đo lường & đánh giá chiến dịch',
  'Pha 4: Nguyên tắc Barcelona (AMEC) 2020; outputs/outtakes/outcomes/impact; đo theo chính mục tiêu 3 bậc; AVE bị bác; ROI & PR value; AMEC Integrated Evaluation Framework.',
  [[
    `<span class="eyebrow">PRE301 · Chapter 8 · Lesson 8.1</span>
<h2>Measurement &amp; campaign evaluation</h2>
<p>Phase 4 closes the loop: did the plan meet the <strong>objectives set in Chapter 3</strong>? Strategic PR is measured against its own targets, not by activity counts.</p>
<h3>The evaluation ladder</h3>
<ul>
<li><strong>Outputs</strong> — what you produced &amp; distributed (releases, events, reach, impressions). Necessary, but they don't prove change.</li>
<li><strong>Outtakes</strong> — what the audience took away (did they notice, recall, understand the message?).</li>
<li><strong>Outcomes</strong> — the real change in awareness, attitude or behavior — mapped straight onto the three-level objectives.</li>
<li><strong>Impact / organizational value</strong> — the effect on the organization's goals (sales, reputation, policy, license to operate).</li>
</ul>
<h3>The Barcelona Principles (AMEC)</h3>
<p>The global standard (updated 2020): goal-setting and measurement are fundamental; measure <strong>outcomes, not just outputs</strong>; <strong>AVEs are not the value of PR</strong>; measurement is holistic (paid, earned, shared, owned) and should be transparent, consistent and valid. AMEC's <strong>Integrated Evaluation Framework</strong> is the practical worksheet: inputs → activities → outputs → outtakes → outcomes → impact.</p>
<h3>ROI &amp; proving value</h3>
<p>Where possible, tie outcomes to <strong>return on investment</strong> or clear business value, and always evaluate against the original objectives so the next campaign's formative research starts from evidence. Measurement is not the end of the cycle — it is the start of the next one.</p>
<div class="callout"><span class="badge">Example</span> The bike-share launch: outputs = 40 articles &amp; 2M impressions; outtakes = 55% of residents recall "cheap &amp; safe"; outcomes = +18% favorable attitude and 12,000 sign-ups (the action objective); impact = the city funds phase two. That, not AVE, is how you prove PR value.</div>`,
    `<span class="eyebrow">PRE301 · Chương 8 · Bài 8.1</span>
<h2>Đo lường &amp; đánh giá chiến dịch</h2>
<p>Pha 4 khép vòng: kế hoạch có đạt <strong>mục tiêu đặt ở Chương 3</strong> không? PR chiến lược được đo theo chính mục tiêu của nó, không phải bằng đếm hoạt động.</p>
<h3>Thang đánh giá</h3>
<ul>
<li><strong>Outputs</strong> — thứ bạn tạo &amp; phát đi (thông cáo, sự kiện, độ phủ, lượt hiển thị). Cần thiết, nhưng không chứng minh có thay đổi.</li>
<li><strong>Outtakes</strong> — điều khán giả ghi nhận (họ có chú ý, nhớ, hiểu thông điệp không?).</li>
<li><strong>Outcomes</strong> — thay đổi thật về nhận biết, thái độ hay hành vi — ánh xạ thẳng vào mục tiêu ba bậc.</li>
<li><strong>Impact / giá trị tổ chức</strong> — tác động lên mục tiêu của tổ chức (doanh số, danh tiếng, chính sách, giấy phép vận hành).</li>
</ul>
<h3>Nguyên tắc Barcelona (AMEC)</h3>
<p>Chuẩn toàn cầu (cập nhật 2020): đặt mục tiêu và đo lường là nền tảng; đo <strong>outcomes, không chỉ outputs</strong>; <strong>AVE không phải giá trị của PR</strong>; đo toàn diện (paid, earned, shared, owned) và phải minh bạch, nhất quán, hợp lệ. <strong>Khung Đánh giá Tích hợp</strong> của AMEC là bảng thực hành: inputs → activities → outputs → outtakes → outcomes → impact.</p>
<h3>ROI &amp; chứng minh giá trị</h3>
<p>Khi có thể, gắn outcomes với <strong>hoàn vốn đầu tư (ROI)</strong> hay giá trị kinh doanh rõ ràng, và luôn đánh giá so với mục tiêu gốc để nghiên cứu hình thành của chiến dịch sau bắt đầu từ bằng chứng. Đo lường không phải điểm cuối của chu trình — nó là khởi đầu của vòng kế tiếp.</p>
<div class="callout"><span class="badge">Ví dụ</span> Chiến dịch xe đạp công cộng: outputs = 40 bài báo &amp; 2 triệu lượt hiển thị; outtakes = 55% cư dân nhớ "rẻ &amp; an toàn"; outcomes = +18% thái độ tích cực và 12.000 lượt đăng ký (mục tiêu hành động); impact = thành phố cấp vốn giai đoạn hai. Đó — không phải AVE — mới là cách chứng minh giá trị PR.</div>`,
  ]]);

const c8q = quiz('pre301-quiz-8', 'Quiz 8 — Measurement & evaluation|||Quiz 8 — Đo lường & đánh giá', [
  { id: 'q1', question: 'Trong thang đánh giá, "outcomes" khác "outputs" ở chỗ?', options: ['Outputs đo thay đổi thật, outcomes đo số bài', 'Outputs là thứ tạo ra (bài/độ phủ); outcomes là thay đổi thật về nhận biết/thái độ/hành vi', 'Hai từ giống nhau', 'Outcomes chỉ dùng cho quảng cáo'], correctIndex: 1, explanation: 'Outputs = sản phẩm/độ phủ; outtakes = ghi nhận; outcomes = thay đổi thật; impact = tác động tổ chức.' },
  { id: 'q2', question: 'Nguyên tắc Barcelona của AMEC khẳng định điều gì về AVE?', options: ['AVE là thước đo tốt nhất của PR', 'AVE KHÔNG phải là giá trị của PR', 'AVE nên nhân đôi cho PR', 'AVE bắt buộc trong mọi báo cáo'], correctIndex: 1, explanation: 'Barcelona Principles bác AVE; đo outcomes, toàn diện, minh bạch.' },
  { id: 'q3', question: 'PR chiến lược nên được đánh giá dựa trên?', options: ['Số hoạt động đã làm', 'Chính các mục tiêu đo được đã đặt từ đầu (Chương 3)', 'Cảm nhận chủ quan của sếp', 'Số lượng nhân viên PR'], correctIndex: 1, explanation: 'Đo theo mục tiêu gốc; đánh giá là khởi đầu nghiên cứu hình thành của vòng sau.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'PRE301',
    slug: 'pre301-public-relations-principles-and-strategies',
    title: 'Strategic Public Relations',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PRE301.webp',
    shortDescription: 'Advanced sequel to PRE203: plan, manage & prove PR strategically — Smith\'s 4-phase model, formative research & SWOT, objectives & key publics, message & spokesperson strategy, integrated PESO tactics, crisis, internal/CSR, Barcelona measurement|||Nối tiếp nâng cao PRE203: hoạch định & chứng minh PR chiến lược — mô hình 4 pha của Smith, nghiên cứu hình thành & SWOT, mục tiêu & công chúng, thông điệp & người phát ngôn, chiến thuật PESO, khủng hoảng, PR nội bộ/CSR, đo lường Barcelona',
    description: 'Môn <strong>PRE301 — Strategic Public Relations (Quan hệ công chúng chiến lược)</strong> (kỳ 5, ngành Công nghệ Truyền thông) là môn <strong>nâng cao nối tiếp PRE203</strong>: từ "biết PR là gì" sang <strong>hoạch định, quản trị và chứng minh giá trị</strong> của cả một chương trình PR. Bám mô hình bốn pha của Ronald Smith: <strong>nghiên cứu hình thành</strong> (phân tích tình huống, tổ chức, công chúng, SWOT) → <strong>chiến lược</strong> (mục tiêu ba bậc, công chúng chủ chốt, định vị, thông điệp &amp; người phát ngôn) → <strong>chiến thuật tích hợp</strong> (PESO, digital PR) → <strong>đánh giá</strong> (Nguyên tắc Barcelona), cộng <strong>quản trị vấn đề &amp; khủng hoảng</strong> và <strong>PR nội bộ, CSR &amp; quan hệ chính phủ</strong>. Song ngữ, ví dụ chiến dịch thật, quiz mỗi chương.',
    whatYouLearn: 'Tư duy chiến lược & phân biệt strategy/tactics; mô hình 4 pha / ROSTIR của Smith; nghiên cứu hình thành (situation/organization/publics, SWOT, định tính/định lượng, social listening); mục tiêu ba bậc awareness/acceptance/action & viết mục tiêu đo được; chọn key publics & định vị; chiến lược thông điệp (rational/emotional appeal), người phát ngôn & credibility, third-party endorsement; chiến thuật tích hợp PESO & digital PR; quản trị vấn đề & khủng hoảng (issues life cycle, crisis plan, SCCT của Coombs); PR nội bộ, IR, quan hệ cộng đồng, CSR/ESG, public affairs & lobbying; đo lường (outputs/outtakes/outcomes/impact, Nguyên tắc Barcelona, ROI).',
    requirements: 'Nên hoàn thành hoặc nắm nền PRE203 (Nhập môn PR): định nghĩa PR, mô hình Grunig, quy trình RACE/ROPE, PESO, đạo đức. Có ý thức đọc tin và quan sát chiến dịch của các thương hiệu/tổ chức thực tế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chiến lược (Smith, Wilcox, Austin & Pinkleton), chuẩn AMEC/Barcelona, hiệp hội nghề, công cụ hoạch định, lộ trình 4 pha.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp PRE203; từ chiến thuật lên chiến lược; mô hình 4 pha của Smith.', lessons: [intro] },
    { title: 'Chương 1 — Tư duy & mô hình hoạch định|||Chapter 1 — Strategic thinking', description: 'Strategy vs tactics, MBO, mô hình 4 pha / 9 bước (ROSTIR).', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nghiên cứu hình thành|||Chapter 2 — Formative research', description: 'Phân tích tình huống/tổ chức/công chúng, SWOT, sơ cấp/thứ cấp.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mục tiêu & công chúng|||Chapter 3 — Objectives & publics', description: 'Awareness/acceptance/action, mục tiêu đo được, key publics, định vị.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thông điệp & người phát ngôn|||Chapter 4 — Message & spokesperson', description: 'Message strategy, appeal, credibility, third-party endorsement.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chiến thuật & kênh tích hợp|||Chapter 5 — Integrated tactics', description: 'Tactics matrix, PESO tích hợp, digital PR, đóng gói kế hoạch.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Vấn đề & khủng hoảng|||Chapter 6 — Issues & crisis', description: 'Issues management, crisis plan, SCCT của Coombs; liên hệ CRM301.', lessons: [c6, c6q] },
    { title: 'Chương 7 — PR nội bộ, CSR & chính phủ|||Chapter 7 — Internal, CSR & public affairs', description: 'Employee/investor/community relations, CSR/ESG, public affairs.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & đánh giá|||Chapter 8 — Measurement & evaluation', description: 'Outputs/outtakes/outcomes/impact, Nguyên tắc Barcelona, ROI.', lessons: [c8, c8q] },
  ],
};
