/**
 * SWT301 · Chapter 9 — Agile testing.
 * Source: "Topic 8 ISTQB CTFL Agile Tester.pptx" (74 visible slides; hidden
 * pptx slide 58 is an earlier, title-only copy of the "CI Activities" slide and
 * is summarised in text) + the teacher's speaker notes + "ISTQB Agile Tester in
 * a Nutshell" (ISTQB Marketing WG, May 2014, 22 pages).
 * The deck teaches chapter 1 of the ISTQB Foundation Level Agile Tester
 * syllabus (2014). Its chapters 2 and 3 are only listed on deck slide 2 and in
 * the Nutshell book pp. 18–20, so they are written here as lessons 9.5–9.7
 * (no slides):
 *   9.1 Agile fundamentals: manifesto, whole team, feedback   slides 1–22
 *   9.2 Agile approaches: XP, Scrum, Kanban                   slides 23–47
 *   9.3 User stories, retrospectives, continuous integration  slides 48–64
 *   9.4 Release and iteration planning                        slides 65–74
 *   9.5 Testing in Agile: differences, status, regression, roles  (syllabus ch.2)
 *   9.6 Agile testing methods: TDD, ATDD, BDD, pyramid, quadrants (syllabus 3.1)
 *   9.7 Quality risks, estimation, techniques and tools           (syllabus 3.2–3.4)
 * The deck has no "Question" slides; Quiz 9 tests every lesson.
 * All code output (TDD cycle) and all numbers (velocity, burndown, risk scores,
 * planning poker) were produced by running the code / a node script.
 */
import { walk, walkHead, books, bi } from './_slides.mjs';

const D = 'agile';

/* ───────────────── 9.1 Agile fundamentals ───────────────── */
const L91 = {
  title: '9.1 — Agile fundamentals: the Manifesto, the whole team, early feedback|||9.1 — Nền tảng Agile: Tuyên ngôn, cả đội cùng làm, phản hồi sớm',
  slug: 'swt301-agile-quadrants',
  type: 'VIDEO',
  description: 'Topic 8 slide 1–22: 4 giá trị và 12 nguyên tắc của Agile Manifesto, whole-team approach, power of three, phản hồi sớm và thường xuyên — giải thích từng slide, bốn biểu đồ Agile vs Waterfall, bài tập phân loại có lời giải.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lesson 9.1 · Topic 8 slides 1–22</span>
<h2>Agile fundamentals — what every Agile tester must believe first</h2>
<p class="lead">Topic 8 is the teacher's cut of the ISTQB <strong>Foundation Level Agile Tester</strong> extension (CTFL-AT, 2014). Before any technique, an Agile tester has to understand <em>why</em> Agile teams work the way they do: the four values and twelve principles of the <strong>Agile Manifesto</strong>, the <strong>whole-team approach</strong> (testers, developers and business people as one team), and the value of <strong>early and frequent feedback</strong>. This lesson walks slides 1–22 in that order.</p>
<div class="callout"><b>Learning objectives (Agile Tester syllabus).</b> FA-1.1.1 Recall the basic concept of Agile software development based on the Agile Manifesto (K1) · FA-1.1.2 Understand the advantages of the whole-team approach (K2) · FA-1.1.3 Understand the benefits of early and frequent feedback (K2). Link to the core CTFL 2018 syllabus: §2.1 iterative &amp; incremental models (lesson 2.1) and §1.4 "testing in context".</div>
<h3>The essentials in one screen</h3>
<table>
<thead><tr><th>Idea</th><th>What you must be able to say</th></tr></thead>
<tbody>
<tr><td>4 values</td><td>Individuals &amp; interactions <em>over</em> processes &amp; tools · Working software <em>over</em> comprehensive documentation · Customer collaboration <em>over</em> contract negotiation · Responding to change <em>over</em> following a plan. The right-hand items still have value; the left-hand items are valued <em>more</em>.</td></tr>
<tr><td>12 principles</td><td>Early &amp; continuous delivery · welcome change · deliver frequently · business + developers daily · motivated individuals · face-to-face · working software = measure of progress · sustainable pace · technical excellence · simplicity · self-organising teams · regular reflection (retrospective).</td></tr>
<tr><td>Whole team</td><td>Everyone needed for success in one small (3–9), co-located, cross-functional team that meets daily; quality is <em>everyone's</em> responsibility.</td></tr>
<tr><td>Power of three</td><td>Tester + developer + business representative take part in every feature discussion (a.k.a. "three amigos").</td></tr>
<tr><td>Early &amp; frequent feedback</td><td>Short iterations + continuous integration show problems while they are cheap: fewer misunderstandings, clearer features, quality problems found early, visible productivity, steady momentum.</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 9 · Bài 9.1 · Topic 8 slide 1–22</span>
<h2>Nền tảng Agile — điều tester Agile phải thấm trước tiên</h2>
<p class="lead">Topic 8 là phần thầy/cô chọn lọc từ chứng chỉ mở rộng ISTQB <strong>Foundation Level Agile Tester</strong> (CTFL-AT, 2014). Trước mọi kỹ thuật, tester trong đội Agile phải hiểu <em>vì sao</em> đội Agile làm việc như vậy: bốn giá trị và mười hai nguyên tắc của <strong>Agile Manifesto</strong>, <strong>whole-team approach</strong> (tester, developer và người phía nghiệp vụ là một đội), và giá trị của <strong>phản hồi sớm và thường xuyên</strong>. Bài này đi qua slide 1–22 theo đúng thứ tự đó.</p>
<div class="callout"><b>Chuẩn đầu ra (syllabus Agile Tester).</b> FA-1.1.1 Nhắc lại khái niệm cơ bản của phát triển phần mềm Agile dựa trên Agile Manifesto (K1) · FA-1.1.2 Hiểu lợi ích của whole-team approach (K2) · FA-1.1.3 Hiểu lợi ích của phản hồi sớm và thường xuyên (K2). Liên hệ syllabus CTFL 2018 lõi: §2.1 mô hình lặp &amp; tăng dần (bài 2.1) và §1.4 "kiểm thử theo ngữ cảnh".</div>
<h3>Cốt lõi trong một màn hình</h3>
<table>
<thead><tr><th>Ý chính</th><th>Bạn phải nói được</th></tr></thead>
<tbody>
<tr><td>4 giá trị</td><td>Cá nhân &amp; tương tác <em>hơn</em> quy trình &amp; công cụ · Phần mềm chạy được <em>hơn</em> tài liệu đầy đủ · Cộng tác với khách hàng <em>hơn</em> đàm phán hợp đồng · Phản ứng với thay đổi <em>hơn</em> bám theo kế hoạch. Vế phải vẫn có giá trị; vế trái được coi trọng <em>hơn</em>.</td></tr>
<tr><td>12 nguyên tắc</td><td>Giao sớm &amp; liên tục · chào đón thay đổi · giao thường xuyên · nghiệp vụ + dev làm cùng hằng ngày · con người có động lực · nói chuyện trực tiếp · phần mềm chạy được = thước đo tiến độ · nhịp độ bền vững · xuất sắc kỹ thuật · đơn giản · đội tự tổ chức · định kỳ nhìn lại (retrospective).</td></tr>
<tr><td>Whole team</td><td>Mọi người cần cho thành công gom vào một đội nhỏ (3–9), ngồi cùng chỗ, đa năng (cross-functional), họp hằng ngày; chất lượng là trách nhiệm của <em>mọi người</em>.</td></tr>
<tr><td>Power of three</td><td>Tester + developer + đại diện nghiệp vụ cùng có mặt trong mọi buổi bàn về tính năng (còn gọi là "three amigos").</td></tr>
<tr><td>Phản hồi sớm &amp; thường xuyên</td><td>Vòng lặp ngắn + tích hợp liên tục làm lộ vấn đề khi còn rẻ: ít hiểu nhầm yêu cầu, tính năng rõ hơn, lỗi chất lượng lộ sớm, năng suất minh bạch, đà dự án ổn định.</td></tr>
</tbody>
</table>`),
    walkHead(D, 1, 22, 'This deck has no <em>Question</em> slides; the self-check questions are in the worked examples and in Quiz 9.', 'Bộ slide này không có slide <em>Question</em>; câu tự kiểm tra nằm trong phần ví dụ có lời giải và Quiz 9.'),
    walk(D, [
      [1, 'ISTQB CTFL Agile Tester (cover)',
        `<p>The title names the certificate: <strong>ISTQB Certified Tester Foundation Level — Agile Tester</strong>. It is an <em>extension</em> of CTFL: the ISTQB introduced extensions for "vertical" competences and the Agile Tester was the first one, released in June 2014 (Nutshell book p.12). The CTFL certificate you prepare for in SWT301 is its prerequisite (p.21).</p>`,
        `<p>Tiêu đề chính là tên chứng chỉ: <strong>ISTQB Certified Tester Foundation Level — Agile Tester</strong>. Đây là chứng chỉ <em>mở rộng</em> (extension) của CTFL: ISTQB tạo các extension cho năng lực "chuyên sâu theo mảng", và Agile Tester là extension đầu tiên, ra mắt tháng 6/2014 (sách Nutshell tr.12). Chứng chỉ CTFL mà SWT301 luyện cho bạn là điều kiện tiên quyết của nó (tr.21).</p>`],
      [2, 'CONTENT',
        `<p>The three bullets are exactly the three chapters of the Agile Tester syllabus: <strong>1 Agile Software Development</strong>, <strong>2 Fundamental Agile Testing Principles, Practices and Processes</strong>, <strong>3 Agile Testing Methods, Techniques and Tools</strong>. The slides that follow teach chapter 1 in depth. Chapters 2 and 3 are not on slides, so this site adds them as lessons <strong>9.5</strong> (differences, test status, regression, the tester's role and skills), <strong>9.6</strong> (TDD, ATDD, BDD, test pyramid, testing quadrants) and <strong>9.7</strong> (quality risks, estimation, acceptance criteria, exploratory testing, tools) — built from the syllabus objectives printed on pp.17–20 of the Nutshell book.</p>`,
        `<p>Ba gạch đầu dòng chính là ba chương của syllabus Agile Tester: <strong>1 Phát triển phần mềm Agile</strong>, <strong>2 Nguyên tắc, thực hành và quy trình kiểm thử Agile cơ bản</strong>, <strong>3 Phương pháp, kỹ thuật và công cụ kiểm thử Agile</strong>. Các slide phía sau dạy kỹ chương 1. Chương 2 và 3 không có slide, nên trang này bổ sung thành bài <strong>9.5</strong> (khác biệt, trạng thái kiểm thử, hồi quy, vai trò và kỹ năng tester), <strong>9.6</strong> (TDD, ATDD, BDD, test pyramid, testing quadrants) và <strong>9.7</strong> (rủi ro chất lượng, ước lượng, acceptance criteria, exploratory testing, công cụ) — dựa trên danh sách chuẩn đầu ra in ở tr.17–20 sách Nutshell.</p>`],
      [3, 'Agile Software Development — section divider',
        `<p>Chapter 1 of the syllabus has two sections: <strong>1.1 Fundamentals of Agile software development</strong> (manifesto, whole team, feedback — this lesson) and <strong>1.2 Aspects of Agile approaches</strong> (XP, Scrum, Kanban, user stories, retrospectives, CI, planning — lessons 9.2–9.4). The divider re-appears on slides 6 and 23 each time a section starts.</p>`,
        `<p>Chương 1 của syllabus có hai phần: <strong>1.1 Nền tảng phát triển phần mềm Agile</strong> (tuyên ngôn, whole team, phản hồi — bài này) và <strong>1.2 Các khía cạnh của cách tiếp cận Agile</strong> (XP, Scrum, Kanban, user story, retrospective, CI, lập kế hoạch — bài 9.2–9.4). Slide ngăn cách này xuất hiện lại ở slide 6 và 23 mỗi khi sang phần mới.</p>`],
      [4, 'Learning Objectives (section 1.1)',
        `<p>Three objectives, with their K-levels from the syllabus: <em>recall</em> the Agile concept from the Manifesto (K1 — you must remember the four values word for word), <em>understand</em> the advantages of the whole-team approach (K2 — explain why), <em>understand</em> the benefits of early &amp; frequent feedback (K2). K1 questions test recall ("which is a value of the Manifesto?"); K2 questions give a situation and ask for the benefit or the reason.</p>`,
        `<p>Ba chuẩn đầu ra kèm mức K theo syllabus: <em>nhắc lại</em> khái niệm Agile từ Tuyên ngôn (K1 — phải thuộc bốn giá trị đúng từng chữ), <em>hiểu</em> lợi ích của whole-team approach (K2 — giải thích được vì sao), <em>hiểu</em> lợi ích của phản hồi sớm &amp; thường xuyên (K2). Câu K1 hỏi nhớ ("đâu là một giá trị của Tuyên ngôn?"); câu K2 cho một tình huống rồi hỏi lợi ích hay lý do.</p>`],
      [5, 'Agile Testers Work Differently',
        `<p>Three differences from a tester in a sequential (waterfall/V-model) project: (1) the tester must understand the <strong>values and principles</strong> behind Agile — the "why", not just the ceremonies; (2) the tester is an <strong>integral part of the whole team</strong>, not a separate department that receives a build at the end; (3) everyone communicates <strong>early and frequently</strong>, which removes defects early (often before they are coded) and builds quality in. Compare with lesson 1.5: the "us vs them" tension between testers and developers is exactly what the whole-team approach is designed to dissolve.</p>`,
        `<p>Ba điểm khác so với tester trong dự án tuần tự (waterfall/V-model): (1) tester phải hiểu <strong>giá trị và nguyên tắc</strong> đằng sau Agile — hiểu "vì sao", không chỉ thuộc các buổi họp; (2) tester là <strong>một phần không tách rời của cả đội</strong>, không phải một phòng ban riêng nhận bản build ở cuối; (3) mọi người giao tiếp <strong>sớm và thường xuyên</strong>, nhờ đó gỡ defect sớm (thường trước cả khi nó được code) và xây chất lượng ngay từ trong. So với bài 1.5: căng thẳng "phe tester – phe dev" chính là thứ whole-team approach sinh ra để hoá giải.</p>`],
      [6, 'Section divider — Fundamentals of Agile SWD',
        `<p>The divider again, now opening section 1.1 proper. Slides 7–22 cover the Manifesto (7–12), the whole-team approach (13–18) and early &amp; frequent feedback (19–22).</p>`,
        `<p>Slide ngăn cách lặp lại, lần này mở chính thức phần 1.1. Slide 7–22 gồm Tuyên ngôn (7–12), whole-team approach (13–18) và phản hồi sớm &amp; thường xuyên (19–22).</p>`],
      [7, 'Agile Manifesto — Agile Values',
        `<p>The poster is the full text of the <strong>Manifesto for Agile Software Development</strong> (agilemanifesto.org, February 2001): "We are uncovering better ways of developing software by doing it and helping others do it. Through this work we have come to value: <strong>Individuals and interactions</strong> over processes and tools · <strong>Working software</strong> over comprehensive documentation · <strong>Customer collaboration</strong> over contract negotiation · <strong>Responding to change</strong> over following a plan. That is, while there is value in the items on the right, we value the items on the left more." The teacher's notes add the context: the Manifesto was first aimed at <em>small</em> projects with an unclear process, people wearing several hats and changing requirements; today large projects use it too by splitting the work into smaller, manageable projects (several teams).</p>
<div class="callout ok"><b>Memory hook:</b> the left side is always about <em>people and results</em> — people, working software, the customer, change. The right side is about <em>control artefacts</em> — process, documents, contracts, plans.</div>`,
        `<p>Tấm poster là toàn văn <strong>Tuyên ngôn Phát triển Phần mềm Agile</strong> (agilemanifesto.org, tháng 2/2001): "Chúng tôi đang khám phá những cách phát triển phần mềm tốt hơn bằng cách tự làm và giúp người khác làm. Qua công việc này, chúng tôi coi trọng: <strong>Cá nhân và sự tương tác</strong> hơn quy trình và công cụ · <strong>Phần mềm chạy được</strong> hơn tài liệu đầy đủ · <strong>Cộng tác với khách hàng</strong> hơn đàm phán hợp đồng · <strong>Phản ứng với thay đổi</strong> hơn bám theo kế hoạch. Nghĩa là, dù các mục bên phải vẫn có giá trị, chúng tôi coi trọng các mục bên trái hơn." Ghi chú của thầy/cô bổ sung bối cảnh: ban đầu Tuyên ngôn nhắm vào dự án <em>nhỏ</em>, quy trình chưa rõ ràng, một người kiêm nhiều vai, yêu cầu hay đổi; ngày nay dự án lớn cũng áp dụng bằng cách chia thành nhiều dự án (nhiều đội) nhỏ, dễ quản lý hơn.</p>
<div class="callout ok"><b>Mẹo nhớ:</b> vế trái luôn nói về <em>con người và kết quả</em> — con người, phần mềm chạy được, khách hàng, thay đổi. Vế phải là các <em>công cụ kiểm soát</em> — quy trình, tài liệu, hợp đồng, kế hoạch.</div>`],
      [8, 'Individuals and Interactions',
        `<p>Value 1. Agile is <strong>people-centred</strong>: teams, not processes, build software, and continuous communication lets a team work most effectively. Processes and tools are important, but less important than people talking to each other. The sketch contrasts a small group chatting around shared ideas with a rigid org-chart of boxes. The teacher's example: instead of relying only on a project-management tool, an Agile team makes room for <em>face-to-face</em> events — Daily Stand-up, Sprint Planning, Retrospective — where problems are solved by talking. For a tester this means: walk over and ask the developer instead of only filing a ticket.</p>`,
        `<p>Giá trị 1. Agile <strong>lấy con người làm trung tâm</strong>: đội ngũ, không phải quy trình, làm ra phần mềm; giao tiếp liên tục giúp đội làm việc hiệu quả nhất. Quy trình và công cụ quan trọng, nhưng kém quan trọng hơn việc con người nói chuyện với nhau. Hình vẽ đối lập một nhóm nhỏ trao đổi quanh ý tưởng chung với một sơ đồ tổ chức cứng nhắc. Ví dụ trong ghi chú của thầy/cô: thay vì chỉ dựa vào công cụ quản lý dự án, đội Agile dành chỗ cho các buổi gặp <em>trực tiếp</em> — Daily Stand-up, Sprint Planning, Retrospective — nơi vấn đề được giải bằng trao đổi. Với tester: đi sang hỏi thẳng developer thay vì chỉ ném một ticket.</p>`],
      [9, 'Working Software',
        `<p>Value 2. Customers care about software that works, not about thick documents; working software gives <strong>rapid feedback</strong> to the team and can give a <strong>time-to-market advantage</strong> (a usable part can ship early). The teacher's notes stress the history — waterfall projects spent enormous time on technical specifications, interface documents and sign-offs, which delayed delivery — and one sentence you must keep: <strong>"Agile does not eliminate documentation."</strong> It keeps the documentation that is useful (user stories with acceptance criteria, the Definition of Done, automated tests as living documentation) and drops documents written only to be signed.</p>`,
        `<p>Giá trị 2. Khách hàng quan tâm phần mềm chạy được chứ không phải chồng tài liệu dày; phần mềm chạy được cho đội <strong>phản hồi nhanh</strong> và có thể tạo <strong>lợi thế ra thị trường sớm</strong> (một phần dùng được có thể phát hành trước). Ghi chú của thầy/cô nhấn mạnh lịch sử — dự án waterfall tốn rất nhiều thời gian cho đặc tả kỹ thuật, tài liệu giao diện, thủ tục ký duyệt, làm chậm việc giao hàng — và một câu bạn phải nhớ: <strong>"Agile không xoá bỏ tài liệu."</strong> Agile giữ tài liệu hữu ích (user story kèm acceptance criteria, Definition of Done, test tự động như tài liệu sống) và bỏ tài liệu viết ra chỉ để ký.</p>`],
      [10, 'Customer Collaboration',
        `<p>Value 3. Customers find it hard to specify requirements up front; building strictly to the original requirements may produce useless software; collaboration gives a better understanding of what the customer really wants. The notes explain the contrast: in waterfall the customer negotiates detailed requirements <em>before</em> work starts and returns only <em>after</em> it ends — absent during development. In Agile the customer (or a Product Owner speaking for them) is engaged throughout: periodic demos at least, sometimes an end user sitting in the team. "Ideas change over time" — contracts still matter, but working closely together is more likely to succeed. Link: Principle 7 of testing (absence-of-errors fallacy, lesson 1.3) — a system built exactly to a wrong spec is still useless.</p>`,
        `<p>Giá trị 3. Khách hàng khó đặc tả hết yêu cầu từ đầu; làm cứng nhắc theo yêu cầu gốc có thể ra phần mềm vô dụng; cộng tác giúp hiểu đúng điều khách hàng thực sự muốn. Ghi chú giải thích sự đối lập: trong waterfall khách hàng đàm phán yêu cầu chi tiết <em>trước</em> khi làm và chỉ quay lại <em>sau</em> khi xong — vắng mặt suốt quá trình phát triển. Trong Agile khách hàng (hoặc Product Owner đại diện) tham gia suốt: ít nhất là các buổi demo định kỳ, có khi một người dùng cuối ngồi luôn trong đội. "Ý tưởng thay đổi theo thời gian" — hợp đồng vẫn quan trọng, nhưng làm việc sát nhau dễ thành công hơn. Liên hệ: Nguyên tắc kiểm thử 7 (ngộ nhận không có lỗi, bài 1.3) — hệ thống làm đúng từng chữ theo một đặc tả sai vẫn vô dụng.</p>`],
      [11, 'Responding to Change',
        `<p>Value 4. Change is inevitable and should be responded to; flexibility matters more than sticking to a plan; planning must be smart and flexible because many factors can hit a project — environment, business domain, legislation, technological advances. The sketch shows two routes up to an obstacle: the adaptive arrow bends around it and continues, the "follow the plan" arrow keeps its planned line and is crossed out. Careful: Agile teams <em>do</em> plan (lesson 9.4 — release and iteration planning); they plan in shorter horizons and re-plan when facts change.</p>`,
        `<p>Giá trị 4. Thay đổi là tất yếu và cần được đáp ứng; linh hoạt quan trọng hơn bám kế hoạch; việc lập kế hoạch phải thông minh và linh hoạt vì nhiều yếu tố có thể tác động mạnh — môi trường, lĩnh vực kinh doanh, luật pháp, tiến bộ công nghệ. Hình vẽ cho hai đường đi tới một chướng ngại: mũi tên thích nghi uốn quanh nó và đi tiếp, mũi tên "theo kế hoạch" giữ nguyên đường đã vạch và bị gạch chéo. Cẩn thận: đội Agile <em>vẫn</em> lập kế hoạch (bài 9.4 — release và iteration planning); chỉ là kế hoạch ngắn hạn hơn và được lập lại khi thực tế thay đổi.</p>`],
      [12, '12 Agile Principles',
        `<p>The sketch-note by Olga Heismann shows the 12 principles behind the Manifesto (the teacher's notes translate each one):</p>
<ol>
<li>Highest priority: satisfy the customer through <strong>early and continuous delivery</strong> of valuable software.</li>
<li><strong>Welcome changing requirements</strong>, even late in development.</li>
<li><strong>Deliver working software frequently</strong>, preferring shorter timescales (weeks rather than months).</li>
<li><strong>Business people and developers work together daily</strong> throughout the project.</li>
<li>Build projects around <strong>motivated individuals</strong>; give them the environment and support, and <strong>trust</strong> them.</li>
<li>The most efficient and effective way to convey information is <strong>face-to-face conversation</strong>.</li>
<li><strong>Working software is the primary measure of progress.</strong></li>
<li>Agile processes promote <strong>sustainable development</strong> — sponsors, developers and users keep a constant pace indefinitely.</li>
<li>Continuous attention to <strong>technical excellence and good design</strong> enhances agility.</li>
<li><strong>Simplicity</strong> — the art of maximising the amount of work <em>not</em> done — is essential.</li>
<li>The best architectures, requirements and designs emerge from <strong>self-organising teams</strong>.</li>
<li>At regular intervals the team <strong>reflects</strong> on how to become more effective and adjusts (→ the retrospective, lesson 9.3).</li>
</ol>
<p>Exam tip: principle 7 answers "how is progress measured in Agile?" (not by documents or hours spent); principle 10's definition of simplicity is a favourite recall question.</p>`,
        `<p>Tranh sketch-note của Olga Heismann vẽ 12 nguyên tắc đằng sau Tuyên ngôn (ghi chú của thầy/cô dịch từng câu):</p>
<ol>
<li>Ưu tiên cao nhất: làm hài lòng khách hàng bằng việc <strong>giao sớm và liên tục</strong> phần mềm có giá trị.</li>
<li><strong>Chào đón thay đổi yêu cầu</strong>, kể cả ở giai đoạn muộn.</li>
<li><strong>Giao phần mềm chạy được thường xuyên</strong>, ưu tiên chu kỳ ngắn (vài tuần hơn là vài tháng).</li>
<li><strong>Người nghiệp vụ và developer làm việc cùng nhau hằng ngày</strong> suốt dự án.</li>
<li>Xây dự án quanh <strong>những con người có động lực</strong>; cho họ môi trường, sự hỗ trợ và <strong>tin tưởng</strong> họ.</li>
<li>Cách truyền thông tin hiệu quả nhất là <strong>trò chuyện trực tiếp</strong>.</li>
<li><strong>Phần mềm chạy được là thước đo chính của tiến độ.</strong></li>
<li>Quy trình Agile thúc đẩy <strong>phát triển bền vững</strong> — nhà tài trợ, developer và người dùng giữ được nhịp độ ổn định mãi.</li>
<li>Chú trọng liên tục tới <strong>xuất sắc kỹ thuật và thiết kế tốt</strong> làm tăng tính linh hoạt.</li>
<li><strong>Sự đơn giản</strong> — nghệ thuật tối đa hoá lượng việc <em>không</em> phải làm — là thiết yếu.</li>
<li>Kiến trúc, yêu cầu và thiết kế tốt nhất nảy sinh từ <strong>các đội tự tổ chức</strong>.</li>
<li>Định kỳ, đội <strong>nhìn lại</strong> cách làm việc để hiệu quả hơn và điều chỉnh (→ retrospective, bài 9.3).</li>
</ol>
<p>Mẹo thi: nguyên tắc 7 trả lời câu "Agile đo tiến độ bằng gì?" (không phải tài liệu hay số giờ đã làm); định nghĩa "đơn giản" của nguyên tắc 10 là câu hỏi nhớ rất hay gặp.</p>`],
      [13, 'Whole Team Approach — definition',
        `<p>The quote is the classic definition of a team (Katzenbach &amp; Smith, <em>The Wisdom of Teams</em>): "A small number of people with <strong>complementary skills</strong> who are committed to a <strong>common purpose</strong>, performance goals and approach for which they hold themselves <strong>mutually accountable</strong>." Three key words: complementary (different skills — dev, test, business), common purpose (the sprint goal / product), mutually accountable (nobody can say "quality is QA's problem").</p>`,
        `<p>Câu trích dẫn là định nghĩa kinh điển về một đội (Katzenbach &amp; Smith, <em>The Wisdom of Teams</em>): "Một nhóm nhỏ người có <strong>kỹ năng bổ sung cho nhau</strong>, cùng cam kết với một <strong>mục đích chung</strong>, mục tiêu hiệu suất và cách làm mà họ <strong>cùng chịu trách nhiệm với nhau</strong>." Ba chữ khoá: bổ sung (kỹ năng khác nhau — dev, test, nghiệp vụ), mục đích chung (mục tiêu sprint / sản phẩm), cùng chịu trách nhiệm (không ai được nói "chất lượng là việc của QA").</p>`],
      [14, 'Whole Team Approach — characteristics',
        `<p>The whole team <strong>involves everyone</strong> with the knowledge and skills needed for success, <strong>including customer representatives and business stakeholders</strong> who decide product features. It is small (<strong>3–9 members</strong>), ideally <strong>co-located</strong>, and meets in a <strong>daily stand-up</strong>; it is one of the main ideas behind Agile. The notes explain <em>why</em>: in sequential development roles are split by phase and each phase hands a document to the next; Agile keeps documentation minimal, so all stakeholders must be involved throughout to stay on the same page. A small team means members must already be skilful (little time for training). The stand-up has three talking points: what I did, what I will do today, any issues (blockers).</p>
<p><em>Note:</em> "3–9" comes from the 2017 Scrum Guide (development team of 3–9); the 2020 Scrum Guide says "typically 10 or fewer people" for the whole Scrum team. The exam follows the slide.</p>`,
        `<p>Whole team <strong>gồm mọi người</strong> có kiến thức và kỹ năng cần cho thành công, <strong>kể cả đại diện khách hàng và các bên nghiệp vụ</strong> — những người quyết định tính năng. Đội nhỏ (<strong>3–9 người</strong>), lý tưởng là <strong>ngồi cùng một chỗ</strong>, và họp <strong>daily stand-up</strong> mỗi ngày; đây là một trong những ý tưởng chính của Agile. Ghi chú giải thích <em>vì sao</em>: phát triển tuần tự chia vai theo pha, pha trước giao tài liệu cho pha sau; Agile giữ tài liệu tối thiểu nên mọi bên phải tham gia suốt quá trình để cùng hiểu một điều. Đội nhỏ nghĩa là thành viên phải giỏi sẵn (ít thời gian đào tạo). Stand-up có ba nội dung: hôm qua làm gì, hôm nay làm gì, có vướng mắc gì không.</p>
<p><em>Lưu ý:</em> con số "3–9" lấy từ Scrum Guide 2017 (development team 3–9 người); Scrum Guide 2020 nói cả Scrum team "thường 10 người trở xuống". Đề thi bám theo slide.</p>`],
      [15, 'Whole Team should be Cross Functional',
        `<p>The picture shows three development teams (vertical columns) cutting across four horizontal <strong>communities</strong> — Programming, Test, UI and ScrumMaster. Each team is <strong>cross-functional</strong>: it holds programmers, testers, a UI person and a Scrum Master, so it can finish a feature without waiting for another department; the communities (Spotify calls them "chapters" and "guilds") keep specialists of the same craft learning from each other across teams. The notes list the benefits: flexibility (members can take over different tasks), speed (no hand-over queues), diverse knowledge and creativity, stronger team spirit, and CI and testing done inside the same team.</p>`,
        `<p>Hình vẽ ba đội phát triển (các cột dọc) cắt ngang bốn <strong>cộng đồng</strong> nằm ngang — Lập trình, Test, UI và ScrumMaster. Mỗi đội là <strong>cross-functional</strong> (đa năng): có lập trình viên, tester, người làm UI và Scrum Master, nên tự hoàn thành một tính năng mà không phải chờ phòng ban khác; còn các cộng đồng (Spotify gọi là "chapter" và "guild") giúp người cùng chuyên môn ở các đội khác nhau học hỏi lẫn nhau. Ghi chú liệt kê lợi ích: linh hoạt (thành viên đảm nhận được nhiều việc), nhanh (không có hàng đợi bàn giao), kiến thức đa dạng và sáng tạo, tinh thần đồng đội mạnh hơn, và CI cùng kiểm thử diễn ra ngay trong một đội.</p>`],
      [16, 'Power of Three',
        `<p>The whole team takes part in any meeting where product features are <strong>presented, analysed or estimated</strong>. Involving <strong>testers, developers and business representatives</strong> in all feature discussions is called the <strong>power of three</strong> (industry name: "three amigos"). Each brings a different question: business — "what problem are we solving?", developer — "how will we build it?", tester — "what could go wrong, and how will we know it works?". The tester's question is what turns a vague feature into testable acceptance criteria.</p>`,
        `<p>Cả đội tham gia mọi buổi họp mà tính năng sản phẩm được <strong>trình bày, phân tích hay ước lượng</strong>. Việc có mặt đủ <strong>tester, developer và đại diện nghiệp vụ</strong> trong mọi buổi bàn về tính năng gọi là <strong>power of three</strong> (tên trong nghề: "three amigos"). Mỗi người mang một câu hỏi khác: nghiệp vụ — "ta đang giải bài toán gì?", developer — "làm nó thế nào?", tester — "cái gì có thể hỏng, và làm sao biết nó chạy đúng?". Chính câu hỏi của tester biến một tính năng mơ hồ thành acceptance criteria kiểm thử được.</p>`],
      [17, 'Example: Tester Work with Others',
        `<p>What "working with others" means concretely: testers work with developers and business people to reach the desired quality; they <strong>help business representatives create suitable acceptance tests</strong>; they <strong>agree the testing strategy and the test-automation approach with developers</strong>; they <strong>transfer and extend testing knowledge</strong> to the rest of the team and influence how the product is built. Because the three parties work together at every step, the process is <strong>transparent</strong>. This is the Nutshell book's list of what an Agile tester contributes (p.15) in slide form.</p>`,
        `<p>"Làm việc cùng người khác" cụ thể là: tester cùng developer và người nghiệp vụ đạt mức chất lượng mong muốn; <strong>giúp đại diện nghiệp vụ tạo acceptance test phù hợp</strong>; <strong>thống nhất chiến lược kiểm thử và cách tự động hoá test với developer</strong>; <strong>truyền và mở rộng kiến thức kiểm thử</strong> cho cả đội và tác động tới cách sản phẩm được làm. Vì ba bên làm cùng nhau ở mọi bước nên quy trình <strong>minh bạch</strong>. Đây chính là danh sách đóng góp của tester Agile trong sách Nutshell (tr.15) được chuyển thành slide.</p>`],
      [18, 'Whole Team Approach: Benefits',
        `<p>The five benefits, exactly as the syllabus lists them: more effective and efficient <strong>team dynamics</strong>; better <strong>communication and collaboration</strong> within the team; the team's <strong>various skill sets are leveraged</strong> for the project; members <strong>learn and share knowledge</strong>; and — the one examiners love — <strong>quality becomes everyone's responsibility</strong>. A typical K2 distractor: "the whole-team approach removes the need for testers" (false: testing skills are still needed; they are spread and shared, not deleted).</p>`,
        `<p>Năm lợi ích, đúng như syllabus liệt kê: <strong>động lực làm việc nhóm</strong> hiệu quả hơn; <strong>giao tiếp và cộng tác</strong> trong đội tốt hơn; tận dụng <strong>nhiều bộ kỹ năng khác nhau</strong> của đội cho dự án; thành viên <strong>học hỏi và chia sẻ kiến thức</strong>; và — câu giám khảo rất thích — <strong>chất lượng trở thành trách nhiệm của mọi người</strong>. Phương án gây nhiễu kiểu K2 hay gặp: "whole-team approach làm đội không cần tester nữa" (sai: kỹ năng kiểm thử vẫn cần; nó được lan toả và chia sẻ, không bị xoá bỏ).</p>`],
      [19, 'Early and Frequent Feedback',
        `<p>In a sequential approach the customer often sees the product only when it is nearly finished — <strong>too late</strong> to address issues effectively. Agile iterations provide feedback every few weeks, and <strong>continuous integration</strong> provides rapid technical feedback every day. The diagram states the equation: <strong>iterations in Agile projects = early &amp; continuous feedback</strong>. Every iteration ends with something the customer can see and react to.</p>`,
        `<p>Trong cách làm tuần tự, khách hàng thường chỉ thấy sản phẩm khi nó gần xong — <strong>quá muộn</strong> để xử lý vấn đề hiệu quả. Các iteration của Agile cho phản hồi vài tuần một lần, còn <strong>tích hợp liên tục (CI)</strong> cho phản hồi kỹ thuật nhanh mỗi ngày. Sơ đồ nêu phương trình: <strong>iteration trong dự án Agile = phản hồi sớm &amp; liên tục</strong>. Mỗi iteration kết thúc bằng một thứ khách hàng nhìn thấy và phản hồi được.</p>`],
      [20, 'Agile vs waterfall — four curves',
        `<p>Four hand-drawn charts compare the two approaches over the project's life (time runs left to right):</p>
<ul>
<li><strong>Cost of change</strong> — waterfall starts low but climbs steeply late (a change after coding touches spec, design, code and tests); Agile stays nearly flat because every iteration re-plans and the test suite protects refactoring.</li>
<li><strong>Intensity and stress</strong> — waterfall is calm early and explodes near the deadline (integration and test "crunch"); Agile has a moderate wave every iteration.</li>
<li><strong>Delivered value</strong> — Agile delivers value early and keeps adding; waterfall delivers almost nothing until the very end.</li>
<li><strong>Transparency and customer involvement</strong> — waterfall is high at the start (requirements) and at the end (acceptance) but drops to the bottom in between (a "bathtub"); Agile stays at a constant medium level all the way.</li>
</ul>`,
        `<p>Bốn biểu đồ vẽ tay so sánh hai cách làm theo vòng đời dự án (thời gian chạy từ trái sang phải):</p>
<ul>
<li><strong>Chi phí thay đổi</strong> — waterfall ban đầu thấp nhưng tăng vọt về cuối (đổi sau khi đã code phải sửa đặc tả, thiết kế, code và test); Agile gần như phẳng vì mỗi iteration đều lập lại kế hoạch và bộ test bảo vệ việc refactor.</li>
<li><strong>Cường độ và áp lực</strong> — waterfall nhàn lúc đầu rồi bùng nổ gần hạn chót (dồn tích hợp và test); Agile có một con sóng vừa phải mỗi iteration.</li>
<li><strong>Giá trị đã giao</strong> — Agile giao giá trị sớm và cộng dồn dần; waterfall gần như không giao gì tới tận cuối.</li>
<li><strong>Minh bạch và mức tham gia của khách hàng</strong> — waterfall cao lúc đầu (lấy yêu cầu) và lúc cuối (nghiệm thu) nhưng tụt đáy ở giữa (hình "bồn tắm"); Agile giữ mức vừa phải, đều đặn suốt dự án.</li>
</ul>`],
      [21, 'Early and Frequent Feedback — fail fast',
        `<p>"If you have to fail, <strong>fail fast</strong>!" — a failed idea discovered after two weeks is cheap; after two years it kills the project. Frequent feedback also gives: better implementation of <strong>new changes</strong>; better focus on the features with the <strong>highest business value and risk</strong> (they are built and tested first); and better team management because capability is <strong>transparent</strong> — everybody sees how much work we can do, what could make us faster, and asks "why are we not doing that, then?".</p>`,
        `<p>"Nếu phải thất bại, hãy <strong>thất bại nhanh</strong>!" — một ý tưởng hỏng lộ ra sau hai tuần thì rẻ; lộ ra sau hai năm thì giết cả dự án. Phản hồi thường xuyên còn giúp: đưa <strong>thay đổi mới</strong> vào quy trình tốt hơn; tập trung vào tính năng có <strong>giá trị nghiệp vụ và rủi ro cao nhất</strong> (làm và test trước); quản lý đội tốt hơn vì năng lực <strong>minh bạch</strong> — ai cũng thấy đội làm được bao nhiêu, điều gì giúp đội nhanh hơn, và hỏi "vậy sao ta chưa làm điều đó?".</p>`],
      [22, 'Early and Frequent Feedback: Benefits',
        `<p>The syllabus list of benefits (the notes add the reasons): <strong>avoid requirements misunderstandings</strong> that would otherwise surface late, when they are expensive; <strong>clarify customer feature requests</strong> and make them usable early, so the product reflects what the customer wants; <strong>discover (via CI), isolate and resolve quality problems early</strong>; <strong>provide information to the team about its productivity and ability to deliver</strong>; <strong>promote consistent project momentum</strong>. The slide adds "helping identify ways to improve ourselves" — the bridge to retrospectives.</p>`,
        `<p>Danh sách lợi ích của syllabus (ghi chú bổ sung lý do): <strong>tránh hiểu nhầm yêu cầu</strong> — vốn sẽ lộ muộn, khi sửa rất đắt; <strong>làm rõ yêu cầu tính năng của khách hàng</strong> và cho họ dùng sớm, nên sản phẩm phản ánh đúng mong muốn; <strong>phát hiện (qua CI), cô lập và xử lý vấn đề chất lượng sớm</strong>; <strong>cung cấp cho đội thông tin về năng suất và khả năng giao hàng</strong>; <strong>giữ đà dự án ổn định</strong>. Slide thêm "giúp tìm cách tự cải thiện" — cầu nối sang retrospective.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — which value, which principle?</h3>
<p>For each situation, name the Manifesto value or principle it follows (✔) or violates (✘).</p>
<table>
<thead><tr><th>#</th><th>Situation</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>1</td><td>The PO asks to add "pay by QR code" in week 7 of a 10-week release; the team re-orders the backlog instead of refusing.</td><td>✔ Value 4 (responding to change) + principle 2 (welcome change, even late).</td></tr>
<tr><td>2</td><td>Progress is reported as "85% of the design document written".</td><td>✘ Principle 7 — working software is the primary measure of progress.</td></tr>
<tr><td>3</td><td>A tester finds an unclear rule and walks to the PO's desk instead of waiting for the weekly meeting.</td><td>✔ Value 1 + principle 6 (face-to-face).</td></tr>
<tr><td>4</td><td>The team works 70-hour weeks for the whole release "because Agile is fast".</td><td>✘ Principle 8 (sustainable pace); slide 30 — Agile is not compressing the schedule.</td></tr>
<tr><td>5</td><td>A developer builds a generic plug-in framework "in case we need it later".</td><td>✘ Principle 10 (simplicity — maximise work not done); XP "no functionality is added early".</td></tr>
<tr><td>6</td><td>Testers, developers and the PO estimate the stories together in planning.</td><td>✔ Whole team / power of three (slides 14, 16).</td></tr>
</tbody>
</table>
<div class="pitfall"><b>"Over" does not mean "instead of".</b> Exam options such as "Agile rejects documentation / plans / contracts / tools" are always wrong. The Manifesto's last line says the right-hand items <em>have value</em>; the left-hand items are valued <em>more</em>. Same trap for the whole team: it does not remove specialists — it removes walls between them.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Where the Manifesto came from, and how it is criticised.</b> Seventeen practitioners (among them Kent Beck of XP, Ken Schwaber and Jeff Sutherland of Scrum, Alistair Cockburn of Crystal) met at Snowbird, Utah, in February 2001 and wrote the 68-word text. Twenty years later critics such as Ron Jeffries (a signatory) warn about "Dark Scrum" — ceremonies imposed by management with none of the values, e.g. a daily stand-up used as a status report to a boss. For testers the practical lesson: judge a team by whether feedback really arrives early (tests in the same iteration, defects fixed within days), not by whether it holds the meetings. <em>Outside the syllabus because CTFL-AT only asks you to recall the values and principles, not their history or critique.</em></div>`,
      `<h3>Ví dụ có lời giải · Bài tập — giá trị nào, nguyên tắc nào?</h3>
<p>Với mỗi tình huống, gọi tên giá trị hay nguyên tắc của Tuyên ngôn mà nó tuân theo (✔) hay vi phạm (✘).</p>
<table>
<thead><tr><th>#</th><th>Tình huống</th><th>Đáp án</th></tr></thead>
<tbody>
<tr><td>1</td><td>PO muốn thêm "thanh toán bằng mã QR" ở tuần 7 của đợt phát hành 10 tuần; đội sắp xếp lại backlog thay vì từ chối.</td><td>✔ Giá trị 4 (phản ứng với thay đổi) + nguyên tắc 2 (chào đón thay đổi, kể cả muộn).</td></tr>
<tr><td>2</td><td>Tiến độ được báo là "đã viết xong 85% tài liệu thiết kế".</td><td>✘ Nguyên tắc 7 — phần mềm chạy được mới là thước đo chính của tiến độ.</td></tr>
<tr><td>3</td><td>Tester thấy một quy tắc chưa rõ và đi thẳng tới bàn PO hỏi thay vì chờ buổi họp tuần.</td><td>✔ Giá trị 1 + nguyên tắc 6 (trao đổi trực tiếp).</td></tr>
<tr><td>4</td><td>Đội làm 70 giờ/tuần suốt đợt phát hành "vì Agile là phải nhanh".</td><td>✘ Nguyên tắc 8 (nhịp độ bền vững); slide 30 — Agile không phải là nén lịch.</td></tr>
<tr><td>5</td><td>Developer dựng sẵn một framework plug-in tổng quát "phòng khi sau này cần".</td><td>✘ Nguyên tắc 10 (đơn giản — tối đa hoá việc không phải làm); luật XP "không thêm chức năng sớm".</td></tr>
<tr><td>6</td><td>Tester, developer và PO cùng ước lượng story trong buổi planning.</td><td>✔ Whole team / power of three (slide 14, 16).</td></tr>
</tbody>
</table>
<div class="pitfall"><b>"Over" (hơn) không có nghĩa là "thay cho".</b> Các phương án kiểu "Agile loại bỏ tài liệu / kế hoạch / hợp đồng / công cụ" luôn sai. Câu cuối của Tuyên ngôn nói vế phải <em>có giá trị</em>; vế trái được coi trọng <em>hơn</em>. Bẫy tương tự với whole team: nó không xoá bỏ chuyên gia — nó xoá bức tường giữa họ.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tuyên ngôn ra đời thế nào, và bị phê bình ra sao.</b> Mười bảy người làm nghề (trong đó có Kent Beck của XP, Ken Schwaber và Jeff Sutherland của Scrum, Alistair Cockburn của Crystal) gặp nhau ở Snowbird, Utah, tháng 2/2001 và viết văn bản dài 68 từ này. Hai mươi năm sau, những người như Ron Jeffries (một người ký tên) cảnh báo về "Dark Scrum" — ban quản lý áp đặt nghi thức mà không có giá trị nào, ví dụ daily stand-up biến thành buổi báo cáo cho sếp. Bài học thực tế cho tester: đánh giá một đội bằng việc phản hồi có thật sự đến sớm không (test trong cùng iteration, defect được sửa trong vài ngày), không phải bằng việc đội có họp đủ buổi hay không. <em>Ngoài giáo trình vì CTFL-AT chỉ yêu cầu nhớ các giá trị và nguyên tắc, không hỏi lịch sử hay phê bình.</em></div>`),
    books([
      ['agile', 'ISTQB Agile Tester in a Nutshell — p.12 (Agile Tester = first ISTQB extension, June 2014), p.15 (the contribution of Agile testers), p.17 (learning objectives of chapter 1), p.21 (who the extension is for; CTFL is a prerequisite)', 'ISTQB Agile Tester in a Nutshell — tr.12 (Agile Tester là extension đầu tiên, 6/2014), tr.15 (đóng góp của tester Agile), tr.17 (chuẩn đầu ra chương 1), tr.21 (đối tượng; CTFL là điều kiện tiên quyết)'],
      ['sp5', '§3.2 Iterative and Incremental Development Models, PDF pp.82–84 — "all forms of agile software development are iterative-incremental"; XP, Kanban, Scrum; Fig. 3-3 Scrum-based agile development', '§3.2 Iterative and Incremental Development Models, PDF tr.82–84 — "mọi dạng phát triển Agile đều là lặp-tăng dần"; XP, Kanban, Scrum; Hình 3-3 mô hình Agile theo Scrum'],
    ]),
  ].join('\n'),
};

/* ───────────────── 9.2 Agile approaches: XP, Scrum, Kanban ───────────────── */
const L92 = {
  title: '9.2 — Agile approaches: common practices, XP, Scrum and Kanban|||9.2 — Các cách tiếp cận Agile: thực hành chung, XP, Scrum và Kanban',
  slug: 'swt301-agile-xp-scrum-kanban',
  type: 'VIDEO',
  description: 'Topic 8 slide 23–47: bốn thực hành Agile chung, Agile là gì và KHÔNG là gì, XP (5 giá trị, luật XP, sơ đồ dự án/iteration), Scrum (2 backlog, 5 timebox, DoD, 3 vai trò), Kanban (bảng, WIP limit, lead time), Kanban vs Scrum.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lesson 9.2 · Topic 8 slides 23–47</span>
<h2>Agile approaches — the four shared practices and the three big methods</h2>
<p class="lead">"Agile" is an umbrella; the team actually follows a concrete <strong>approach</strong>. The syllabus picks three: <strong>Extreme Programming (XP)</strong> — engineering practices, <strong>Scrum</strong> — a management framework, and <strong>Kanban</strong> — flow management with WIP limits. Whatever the method, four practices appear everywhere: collaborative user-story creation, retrospectives, continuous integration, and release &amp; iteration planning (lessons 9.3–9.4).</p>
<div class="callout"><b>Learning objectives.</b> FA-1.2.1 Recall Agile software development approaches (K1). Slide 24 also lists FA-1.2.2 write testable user stories (K3), FA-1.2.3 retrospectives (K2), FA-1.2.4 continuous integration (K2) and FA-1.2.5 release vs iteration planning (K1) — those are taught in 9.3 and 9.4.</div>
<h3>The three approaches side by side</h3>
<table>
<thead><tr><th></th><th>XP</th><th>Scrum</th><th>Kanban</th></tr></thead>
<tbody>
<tr><td>Focus</td><td>Software quality &amp; engineering practices</td><td>Project management &amp; productivity</td><td>Visualising and optimising the flow of work</td></tr>
<tr><td>Iterations</td><td>Short, usually 1–2 weeks</td><td>Sprint of 1–4 weeks (fixed timebox)</td><td>Optional</td></tr>
<tr><td>Change during an iteration</td><td>Customer may swap stories</td><td>Sprint goal is protected</td><td>Any time — pull the next ticket</td></tr>
<tr><td>Testing guidance</td><td>Yes: test-first, unit tests for all code, acceptance tests run often</td><td>None — Scrum does not say how to test</td><td>None — it optimises the existing process</td></tr>
<tr><td>Key vocabulary</td><td>5 values, 14 principles, 13 practices; pair programming, TDD, collective ownership</td><td>3 roles, 2 backlogs, 5 timeboxes, Definition of Done</td><td>Board, stations, WIP limit, pull, lead time</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 9 · Bài 9.2 · Topic 8 slide 23–47</span>
<h2>Các cách tiếp cận Agile — bốn thực hành chung và ba phương pháp lớn</h2>
<p class="lead">"Agile" là chiếc ô chung; đội thực sự làm theo một <strong>cách tiếp cận</strong> cụ thể. Syllabus chọn ba: <strong>Extreme Programming (XP)</strong> — thực hành kỹ thuật, <strong>Scrum</strong> — khung quản lý, và <strong>Kanban</strong> — quản lý dòng chảy công việc với giới hạn WIP. Dù dùng phương pháp nào, bốn thực hành luôn có mặt: cùng nhau viết user story, retrospective, tích hợp liên tục, và release &amp; iteration planning (bài 9.3–9.4).</p>
<div class="callout"><b>Chuẩn đầu ra.</b> FA-1.2.1 Nhắc lại các cách tiếp cận phát triển Agile (K1). Slide 24 còn liệt kê FA-1.2.2 viết user story kiểm thử được (K3), FA-1.2.3 retrospective (K2), FA-1.2.4 tích hợp liên tục (K2) và FA-1.2.5 release vs iteration planning (K1) — các mục đó học ở bài 9.3 và 9.4.</div>
<h3>Ba cách tiếp cận đặt cạnh nhau</h3>
<table>
<thead><tr><th></th><th>XP</th><th>Scrum</th><th>Kanban</th></tr></thead>
<tbody>
<tr><td>Trọng tâm</td><td>Chất lượng phần mềm &amp; thực hành kỹ thuật</td><td>Quản lý dự án &amp; năng suất</td><td>Trực quan hoá và tối ưu dòng chảy công việc</td></tr>
<tr><td>Iteration</td><td>Ngắn, thường 1–2 tuần</td><td>Sprint 1–4 tuần (timebox cố định)</td><td>Không bắt buộc</td></tr>
<tr><td>Thay đổi giữa iteration</td><td>Khách hàng có thể đổi story</td><td>Mục tiêu sprint được bảo vệ</td><td>Bất cứ lúc nào — kéo ticket kế tiếp</td></tr>
<tr><td>Hướng dẫn kiểm thử</td><td>Có: test-first, mọi code có unit test, acceptance test chạy thường xuyên</td><td>Không — Scrum không nói cách test</td><td>Không — nó tối ưu quy trình đang có</td></tr>
<tr><td>Từ khoá</td><td>5 giá trị, 14 nguyên tắc, 13 thực hành; pair programming, TDD, sở hữu code chung</td><td>3 vai trò, 2 backlog, 5 timebox, Definition of Done</td><td>Bảng, trạm, WIP limit, kéo (pull), lead time</td></tr>
</tbody>
</table>`),
    walkHead(D, 23, 47),
    walk(D, [
      [23, 'Section divider — Aspects of Agile Approaches',
        `<p>The divider now opens section <strong>1.2 Aspects of Agile approaches</strong>. Everything up to slide 74 belongs to it: methods (this lesson), then the four common practices (lessons 9.3–9.4).</p>`,
        `<p>Slide ngăn cách lần này mở phần <strong>1.2 Các khía cạnh của cách tiếp cận Agile</strong>. Mọi slide tới slide 74 thuộc phần này: các phương pháp (bài này), rồi bốn thực hành chung (bài 9.3–9.4).</p>`],
      [24, 'Learning Objectives (section 1.2)',
        `<p>Five objectives: <em>recall</em> Agile approaches (K1); <em>write testable user stories</em> in collaboration with developers and business representatives (K3 — the only "apply" objective of chapter 1, practised in lessons 9.3 and 9.6); <em>understand</em> retrospectives as a process-improvement mechanism (K2); <em>understand</em> the use and purpose of continuous integration (K2); <em>know</em> the difference between iteration and release planning and how a tester adds value in each (K1).</p>`,
        `<p>Năm chuẩn đầu ra: <em>nhắc lại</em> các cách tiếp cận Agile (K1); <em>viết user story kiểm thử được</em> cùng developer và đại diện nghiệp vụ (K3 — chuẩn "vận dụng" duy nhất của chương 1, luyện ở bài 9.3 và 9.6); <em>hiểu</em> retrospective như cơ chế cải tiến quy trình (K2); <em>hiểu</em> công dụng và mục đích của tích hợp liên tục (K2); <em>biết</em> khác biệt giữa iteration planning và release planning và tester đóng góp gì ở mỗi loại (K1).</p>`],
      [25, 'Common Agile Practices — collaborative user story creation',
        `<p>The wheel shows the <strong>four common Agile practices</strong> around the centre: collaborative user story creation, retrospectives, continuous integration, release &amp; iteration planning. Slides 25–28 are the same picture; the teacher's notes on each one explain one practice. Notes on slide 25 — <strong>collaborative user story creation</strong>: stories are not written alone by the Product Owner; the PO, developers, testers, designers and other stakeholders define, interpret and clarify the requirement together in discussions and workshops, so everyone understands it and can contribute ideas. Detail in lesson 9.3.</p>`,
        `<p>Bánh xe cho thấy <strong>bốn thực hành Agile chung</strong> quanh tâm: cùng nhau viết user story, retrospective, tích hợp liên tục, release &amp; iteration planning. Slide 25–28 là cùng một hình; ghi chú của thầy/cô ở mỗi slide giải thích một thực hành. Ghi chú slide 25 — <strong>collaborative user story creation</strong>: story không do một mình Product Owner viết; PO, developer, tester, người thiết kế và các bên liên quan cùng định nghĩa, diễn giải và làm rõ yêu cầu qua thảo luận, họp nhóm, để ai cũng hiểu và góp được ý. Chi tiết ở bài 9.3.</p>`],
      [26, 'Common Agile Practices — retrospectives',
        `<p>Notes on slide 26 — <strong>retrospectives</strong>: a regular meeting at the end of every sprint where the team evaluates its own way of working. Three questions: <em>What went well?</em> (collaboration, team spirit, on-time tasks…) · <em>What could be improved?</em> (communication, task split, time management…) · <em>What actions will we take?</em> (concrete changes to the process). It lets the team learn from experience and improve continuously. Detail in lesson 9.3 (slides 53–56).</p>`,
        `<p>Ghi chú slide 26 — <strong>retrospective</strong>: buổi họp định kỳ cuối mỗi sprint để đội tự đánh giá cách làm việc của mình. Ba câu hỏi: <em>Điều gì diễn ra tốt?</em> (cộng tác, tinh thần đội, xong việc đúng hạn…) · <em>Điều gì cần cải thiện?</em> (giao tiếp, chia việc, quản lý thời gian…) · <em>Ta sẽ hành động gì?</em> (thay đổi cụ thể trong quy trình). Nó giúp đội học từ kinh nghiệm và cải tiến liên tục. Chi tiết ở bài 9.3 (slide 53–56).</p>`],
      [27, 'Common Agile Practices — continuous integration',
        `<p>Notes on slide 27 — <strong>continuous integration</strong>: team members integrate and check new code into the shared system continuously. Goal: an <em>automated</em> process of testing, integrating and building the source code; purpose: new changes merge into existing code smoothly without breaking it. The five steps in the notes: (1) commit to version control, (2) the CI system merges the change, (3) automatic build (compile, package), (4) automated tests, (5) report to the team and managers. Detail in lesson 9.3 (slides 57–64).</p>`,
        `<p>Ghi chú slide 27 — <strong>tích hợp liên tục (CI)</strong>: các thành viên liên tục tích hợp và kiểm tra code mới vào hệ thống chung. Mục tiêu: một quy trình <em>tự động</em> gồm test, tích hợp và build mã nguồn; mục đích: thay đổi mới hoà vào code sẵn có trơn tru, không làm hỏng gì. Năm bước trong ghi chú: (1) commit lên hệ thống quản lý phiên bản, (2) hệ thống CI hợp nhất thay đổi, (3) build tự động (biên dịch, đóng gói), (4) test tự động, (5) báo kết quả cho đội và quản lý. Chi tiết ở bài 9.3 (slide 57–64).</p>`],
      [28, 'Common Agile Practices — release and iteration planning',
        `<p>Notes on slide 28 — <strong>release planning</strong> plans a whole release: which features go into a specific version; high level; spans months to quarters; considers business goals, prioritised requirements, time and resources, and a release timeline. <strong>Iteration planning</strong> plans one sprint (1–4 weeks): the team and PO pick the user stories for the next sprint, split them into tasks with time estimates, then prioritise and assign them. Detail in lesson 9.4 (slides 65–74).</p>`,
        `<p>Ghi chú slide 28 — <strong>release planning</strong> lập kế hoạch cho cả một bản phát hành: tính năng nào vào phiên bản nào; ở mức cao; kéo dài vài tháng tới vài quý; xét mục tiêu kinh doanh, yêu cầu đã ưu tiên, thời gian và nguồn lực, và mốc phát hành. <strong>Iteration planning</strong> lập kế hoạch cho một sprint (1–4 tuần): đội và PO chọn user story cho sprint tới, chia thành task có ước lượng thời gian, rồi xếp ưu tiên và phân công. Chi tiết ở bài 9.4 (slide 65–74).</p>`],
      [29, 'An Agile Method is',
        `<p>Four arrows point to the goal <strong>"to give working software"</strong>: an Agile method is <strong>iterative and incremental</strong> (repeat short cycles, each adding a usable increment — lesson 2.1), <strong>cooperative</strong> (customer and team work together) and <strong>adaptive</strong> (plans and processes change with feedback). If a question asks what characterises an Agile method, look for these words.</p>`,
        `<p>Các mũi tên cùng hướng tới đích <strong>"giao phần mềm chạy được"</strong>: phương pháp Agile là <strong>lặp và tăng dần</strong> (lặp các chu kỳ ngắn, mỗi chu kỳ thêm một phần dùng được — bài 2.1), <strong>hợp tác</strong> (khách hàng và đội làm cùng nhau) và <strong>thích nghi</strong> (kế hoạch và quy trình thay đổi theo phản hồi). Câu hỏi về đặc trưng của phương pháp Agile thì tìm các chữ này.</p>`],
      [30, 'An Agile Method is NOT',
        `<p>Five misconceptions to reject: Agile is <strong>not</strong> compressing the schedule (doing the same work faster under pressure); <strong>not</strong> removing all existing development processes; <strong>not</strong> throwing out all documentation (slide 9); <strong>not</strong> writing code up to the last minute (work is finished and tested inside each iteration — "Done" means done); and <strong>not</strong> an excuse for doing anything (Agile needs <em>more</em> discipline: timeboxes, DoD, automated tests, CI).</p>`,
        `<p>Năm hiểu lầm cần bác bỏ: Agile <strong>không phải</strong> nén lịch (làm cùng khối việc nhanh hơn dưới áp lực); <strong>không phải</strong> bỏ hết quy trình phát triển đang có; <strong>không phải</strong> vứt hết tài liệu (slide 9); <strong>không phải</strong> code tới phút chót (việc được làm xong và test ngay trong iteration — "Done" là xong thật); và <strong>không phải</strong> cái cớ để muốn làm gì thì làm (Agile đòi hỏi kỷ luật <em>cao hơn</em>: timebox, DoD, test tự động, CI).</p>`],
      [31, 'Mostly Used Agile Methods',
        `<p>The family: <strong>Scrum</strong>, <strong>Extreme Programming (XP)</strong>, Lean software development, <strong>Kanban</strong>, Dynamic Systems Development Method (DSDM), Adaptive software development, Crystal methods, Feature-Driven Development (FDD), Agile Unified Process. The syllabus (and the exam) only goes deep into <strong>XP, Scrum and Kanban</strong>; for the others, recognising the name as "an Agile method" is enough.</p>`,
        `<p>Cả họ phương pháp: <strong>Scrum</strong>, <strong>Extreme Programming (XP)</strong>, Lean software development, <strong>Kanban</strong>, Dynamic Systems Development Method (DSDM), Adaptive software development, Crystal, Feature-Driven Development (FDD), Agile Unified Process. Syllabus (và đề thi) chỉ đi sâu vào <strong>XP, Scrum và Kanban</strong>; các cái còn lại chỉ cần nhận ra tên là "một phương pháp Agile".</p>`],
      [32, 'Extreme Programming',
        `<p>XP was introduced by <strong>Kent Beck</strong> (the slide misspells it "Kent Back"). The slide's origin story — a financial system that a team of 30 had failed to deliver for years, delivered in 2 years — is the usual telling of the Chrysler "C3" payroll project (1996), where Beck, Ron Jeffries and others first applied XP. XP is described by <strong>5 values → 14 principles → 13 (primary) practices</strong> (2nd edition of Beck's book, 2004): values guide principles, principles justify practices. Many Agile approaches are influenced by XP — Scrum teams very often adopt XP practices such as pair programming, TDD and CI, because Scrum itself gives no engineering practices.</p>`,
        `<p>XP do <strong>Kent Beck</strong> đưa ra (slide viết nhầm thành "Kent Back"). Câu chuyện trên slide — một hệ thống tài chính mà đội 30 người nhiều năm không giao được, được hoàn thành trong 2 năm — là cách kể thường gặp về dự án lương "C3" của Chrysler (1996), nơi Beck, Ron Jeffries và cộng sự lần đầu áp dụng XP. XP được mô tả bằng <strong>5 giá trị → 14 nguyên tắc → 13 thực hành (chính)</strong> (sách của Beck, bản 2, 2004): giá trị dẫn dắt nguyên tắc, nguyên tắc biện minh cho thực hành. Nhiều cách tiếp cận Agile chịu ảnh hưởng của XP — đội Scrum rất hay dùng thực hành XP như pair programming, TDD và CI, vì bản thân Scrum không đưa ra thực hành kỹ thuật nào.</p>`],
      [33, 'XP 5 Values Guiding Development',
        `<p>The table: <strong>Communication</strong> — everyone is part of the team; face-to-face, daily communication. <strong>Simplicity</strong> — start with the simplest solution; extra functionality can be added later; do what is needed and asked for, but no more. <strong>Feedback</strong> — from the system (tests), from the team, from the customer. <strong>Courage</strong> — tell the truth with no excuses; refactor (change working code to improve it); persistence. <strong>Respect</strong> — respect other team members' work. The notes add that these values build transparency, interaction and focus on quality. Compare Scrum's values (openness, focus, commitment, courage, respect) — only courage and respect are shared.</p>`,
        `<p>Bảng giá trị: <strong>Communication (giao tiếp)</strong> — ai cũng là thành viên đội; giao tiếp trực tiếp, hằng ngày. <strong>Simplicity (đơn giản)</strong> — bắt đầu bằng giải pháp đơn giản nhất; tính năng thêm có thể bổ sung sau; làm đúng cái cần và được yêu cầu, không hơn. <strong>Feedback (phản hồi)</strong> — từ hệ thống (test), từ đội, từ khách hàng. <strong>Courage (dũng cảm)</strong> — nói thật, không bao biện; refactor (sửa code đang chạy cho tốt hơn); kiên trì. <strong>Respect (tôn trọng)</strong> — tôn trọng công sức của đồng đội. Ghi chú thêm: các giá trị này tạo sự minh bạch, tương tác và tập trung vào chất lượng. So với giá trị của Scrum (openness, focus, commitment, courage, respect) — chỉ courage và respect là trùng.</p>`],
      [34, 'XP Rules — Managing and Planning',
        `<p>The "XP rules" (Don Wells, extremeprogramming.org), first two groups. <strong>Managing</strong>: dedicated open work space · <strong>sustainable pace</strong> (the notes: overwork causes fatigue and lower quality; keep work–life balance) · a stand-up starts each day · <strong>project velocity</strong> is measured (work completed per iteration, used to plan the next ones) · <strong>move people around</strong> (rotate people across tasks to spread knowledge and avoid bottlenecks) · <strong>fix XP when it breaks</strong> (adapt the process itself when it does not work). <strong>Planning</strong>: user stories are written · release planning creates the release schedule · frequent small releases · the project is divided into iterations · iteration planning starts each iteration.</p>`,
        `<p>"Luật XP" (Don Wells, extremeprogramming.org), hai nhóm đầu. <strong>Quản lý</strong>: không gian làm việc mở dành riêng cho đội · <strong>nhịp độ bền vững</strong> (ghi chú: làm quá sức gây mệt mỏi, giảm chất lượng; giữ cân bằng công việc – cuộc sống) · mỗi ngày bắt đầu bằng stand-up · đo <strong>project velocity</strong> (lượng việc hoàn thành mỗi iteration, dùng để lập kế hoạch cho các iteration sau) · <strong>luân chuyển người</strong> (xoay vòng người qua các việc để lan kiến thức, tránh nút thắt) · <strong>sửa XP khi nó hỏng</strong> (chỉnh chính quy trình khi nó không hiệu quả). <strong>Lập kế hoạch</strong>: viết user story · release planning tạo lịch phát hành · phát hành nhỏ và thường xuyên · chia dự án thành iteration · mỗi iteration mở đầu bằng iteration planning.</p>`],
      [35, 'XP Rules — Designing and Coding',
        `<p><strong>Designing</strong>: simplicity · choose a <strong>system metaphor</strong> (a shared story of how the system works, so names and structure stay consistent) · <strong>CRC cards</strong> (Class–Responsibility–Collaboration) for design sessions · <strong>spike solutions</strong> to reduce risk (a small throw-away experiment to answer a technical question before committing) · no functionality is added early · refactor whenever and wherever possible (improve code without changing its external behaviour). <strong>Coding</strong>: the customer is always available · code to an agreed standard · <strong>code the unit test first</strong> (→ TDD, lesson 9.6) · all production code is <strong>pair programmed</strong> (two people, one computer) · only one pair integrates code at a time · integrate often · a dedicated integration computer · <strong>collective ownership</strong> (anyone may change any code). For a tester, "code the unit test first" and "integrate often" are the XP roots of TDD and CI.</p>`,
        `<p><strong>Thiết kế</strong>: đơn giản · chọn một <strong>system metaphor</strong> (một hình ảnh chung mô tả hệ thống vận hành thế nào, để cách đặt tên và cấu trúc nhất quán) · dùng <strong>thẻ CRC</strong> (Class–Responsibility–Collaboration) trong buổi thiết kế · làm <strong>spike solution</strong> để giảm rủi ro (một thử nghiệm nhỏ, làm xong bỏ, để trả lời một câu hỏi kỹ thuật trước khi cam kết) · không thêm chức năng sớm · refactor mọi lúc mọi nơi có thể (cải thiện code mà không đổi hành vi bên ngoài). <strong>Lập trình</strong>: khách hàng luôn sẵn sàng · code theo chuẩn đã thống nhất · <strong>viết unit test trước</strong> (→ TDD, bài 9.6) · mọi code production đều <strong>lập trình cặp</strong> (hai người, một máy) · mỗi lúc chỉ một cặp tích hợp code · tích hợp thường xuyên · một máy tích hợp riêng · <strong>sở hữu code chung</strong> (ai cũng được sửa mọi đoạn code). Với tester, "viết unit test trước" và "tích hợp thường xuyên" chính là gốc XP của TDD và CI.</p>`],
      [36, 'XP Rules — Testing',
        `<p>The testing rules — memorise them, they are the most "tester" slide of the XP block: <strong>all code must have unit tests</strong>; <strong>all code must pass all unit tests before it can be released</strong>; <strong>when a bug is found, tests are created</strong> (first a test that reproduces the bug, then the fix — so it can never silently return: a regression test is born from every defect); <strong>acceptance tests are run often and the score is published</strong> (visible progress for the whole team and the customer).</p>`,
        `<p>Các luật kiểm thử — nên thuộc, đây là slide "chất tester" nhất của khối XP: <strong>mọi code phải có unit test</strong>; <strong>mọi code phải qua hết unit test trước khi được phát hành</strong>; <strong>khi tìm thấy bug thì viết test</strong> (trước hết là một test tái hiện bug, rồi mới sửa — để bug không thể lặng lẽ quay lại: mỗi defect sinh ra một test hồi quy); <strong>acceptance test chạy thường xuyên và điểm số được công bố</strong> (tiến độ hiển thị cho cả đội và khách hàng).</p>`],
      [37, 'XP Project',
        `<p>The flowchart of a whole XP project: <em>user stories</em> give requirements and test scenarios; an <em>architectural spike</em> gives the system metaphor; <em>release planning</em> (fed by uncertain estimates → spikes → confident estimates) produces the release plan; each <em>iteration</em> produces the latest version, which goes to <em>acceptance tests</em>; bugs found there and new stories / project velocity flow back into the next iteration; after <em>customer approval</em> come <em>small releases</em>. Notice where testing sits: test scenarios come straight from user stories, and acceptance tests gate every release.</p>`,
        `<p>Sơ đồ toàn bộ một dự án XP: <em>user story</em> cho ra yêu cầu và kịch bản test; <em>architectural spike</em> cho ra system metaphor; <em>release planning</em> (từ ước lượng chưa chắc → spike → ước lượng chắc chắn) tạo ra release plan; mỗi <em>iteration</em> tạo phiên bản mới nhất, đưa qua <em>acceptance test</em>; bug tìm được ở đó cùng story mới / project velocity quay vòng vào iteration sau; khi <em>khách hàng chấp nhận</em> thì <em>phát hành nhỏ</em>. Để ý chỗ của kiểm thử: kịch bản test sinh thẳng từ user story, và acceptance test là cửa chặn của mọi lần phát hành.</p>`],
      [38, 'XP Iteration',
        `<p>Zooming into one iteration: the release plan's user stories, the project velocity, failed acceptance tests from the previous iteration and bugs all feed <em>iteration planning</em>, which yields the iteration plan; <em>development</em> runs day by day and outputs the latest version with new functionality and bug fixes; unfinished tasks go back to the next iteration planning; "learn and communicate" updates new user stories and the velocity. Failed acceptance tests are planned like any other work — they are not a separate "test phase".</p>`,
        `<p>Phóng to một iteration: user story từ release plan, project velocity, acceptance test bị fail ở iteration trước và bug cùng đổ vào <em>iteration planning</em>, cho ra iteration plan; <em>development</em> chạy từng ngày và cho ra phiên bản mới nhất có chức năng mới và bản sửa bug; task chưa xong quay lại buổi iteration planning sau; "học và trao đổi" cập nhật user story mới và velocity. Acceptance test bị fail được lên kế hoạch như mọi việc khác — không có "pha test" riêng.</p>`],
      [39, 'XP Development',
        `<p>Zooming into development: from the iteration plan, a <em>stand-up meeting</em> each day hands out tasks (too much to do → tasks go back as unfinished); the work happens in <em>collective code ownership</em> with pair programming, merciless refactoring, moving people around and CRC cards; it ends with <strong>100% unit tests passed</strong> → new functionality, and <strong>acceptance test passed</strong> → bug fixes. Failed acceptance tests become the next task.</p>`,
        `<p>Phóng to phần phát triển: từ iteration plan, <em>stand-up</em> mỗi ngày chia task (việc quá nhiều → task quay lại thành việc chưa xong); việc được làm trong <em>collective code ownership</em> với lập trình cặp, refactor không nương tay, luân chuyển người và thẻ CRC; kết quả là <strong>100% unit test pass</strong> → chức năng mới, và <strong>acceptance test pass</strong> → bản sửa bug. Acceptance test bị fail trở thành task tiếp theo.</p>`],
      [40, 'XP Collective Ownership',
        `<p>The innermost level (diagram © 2000 J. Donvan Wells): take the next task or a failed acceptance test → pair up → <strong>create a unit test</strong> → pair programming (simple code, refactor mercilessly when code is complex; change pair / ask for help when needed; CRC cards for complex problems) → failed unit test loops back, passed unit test moves on → <strong>continuous integration</strong> (run all unit tests) → 100% unit tests passed → run failed acceptance test → acceptance test passed. This is literally the TDD loop (lesson 9.6) wrapped inside CI.</p>`,
        `<p>Lớp trong cùng (sơ đồ © 2000 J. Donvan Wells): nhận task kế tiếp hoặc một acceptance test bị fail → ghép cặp → <strong>viết unit test</strong> → lập trình cặp (code đơn giản, refactor mạnh tay khi code phức tạp; đổi cặp / nhờ trợ giúp khi cần; thẻ CRC cho vấn đề phức tạp) → unit test fail thì quay lại, pass thì đi tiếp → <strong>tích hợp liên tục</strong> (chạy toàn bộ unit test) → 100% unit test pass → chạy acceptance test từng fail → acceptance test pass. Đây chính là vòng lặp TDD (bài 9.6) được bọc trong CI.</p>`],
      [41, 'Scrum',
        `<p>Scrum is an <strong>iterative, incremental framework for project management</strong>. Unlike XP it <strong>does not dictate development techniques</strong> (no test-first rule) and gives <strong>no guidance on how testing is done</strong> — the team must decide that itself (which is why testers matter). Scrum consists of <strong>2 backlogs</strong> (product backlog, sprint backlog), <strong>5 timeboxes</strong>, a <strong>Definition of Done</strong> and <strong>3 roles</strong>. The notes compare Scrum and XP: both aim to deliver quality fast, but Scrum focuses on management/productivity while XP focuses on engineering quality; Scrum sprints are usually 2–4 weeks, XP 1–2; no change may interrupt a Scrum sprint goal, while XP lets the customer swap work mid-iteration; in Scrum the PO sets priorities, in XP developers work in strict priority order. The 5 timeboxes from the notes: <strong>Sprint</strong> 1–4 weeks · <strong>Sprint Planning</strong> 2 h per sprint week · <strong>Daily Scrum</strong> 15 min · <strong>Sprint Review</strong> 2–4 h · <strong>Sprint Retrospective</strong> 60–90 min.</p>
<p><em>Update:</em> the current Scrum Guide (2020) sets maxima for a one-month sprint — planning ≤ 8 h, review ≤ 4 h, retrospective ≤ 3 h — shorter for shorter sprints; it speaks of three <em>accountabilities</em> and three artefacts (product backlog, sprint backlog, increment). The notes' numbers are common practice, not the guide's limits.</p>`,
        `<p>Scrum là <strong>khung quản lý dự án lặp và tăng dần</strong>. Khác XP, nó <strong>không quy định kỹ thuật phát triển</strong> (không có luật test-first) và <strong>không hướng dẫn cách kiểm thử</strong> — đội phải tự quyết (vì thế mới cần tester). Scrum gồm <strong>2 backlog</strong> (product backlog, sprint backlog), <strong>5 timebox</strong>, một <strong>Definition of Done</strong> và <strong>3 vai trò</strong>. Ghi chú so sánh Scrum với XP: cả hai đều muốn giao chất lượng nhanh, nhưng Scrum tập trung vào quản lý/năng suất còn XP tập trung vào chất lượng kỹ thuật; sprint Scrum thường 2–4 tuần, XP 1–2 tuần; không thay đổi nào được phá mục tiêu sprint Scrum, còn XP cho khách hàng đổi việc giữa iteration; trong Scrum PO quyết ưu tiên, trong XP developer làm theo đúng thứ tự ưu tiên. Năm timebox theo ghi chú: <strong>Sprint</strong> 1–4 tuần · <strong>Sprint Planning</strong> 2 giờ cho mỗi tuần sprint · <strong>Daily Scrum</strong> 15 phút · <strong>Sprint Review</strong> 2–4 giờ · <strong>Sprint Retrospective</strong> 60–90 phút.</p>
<p><em>Cập nhật:</em> Scrum Guide hiện hành (2020) đặt mức tối đa cho sprint một tháng — planning ≤ 8 giờ, review ≤ 4 giờ, retrospective ≤ 3 giờ — ngắn hơn với sprint ngắn hơn; bản này nói về ba <em>accountability</em> và ba artefact (product backlog, sprint backlog, increment). Con số trong ghi chú là thói quen phổ biến, không phải giới hạn của guide.</p>`],
      [42, 'Scrum Framework at a glance',
        `<p>The classic picture: inputs from executives, team, stakeholders and users go to the <strong>Product Owner</strong>, who keeps a <strong>ranked product backlog</strong> (features, stories…). In the <strong>Sprint Planning Meeting</strong> the team selects from the top as much as it can commit to deliver by the end of the sprint → <strong>sprint backlog</strong> (with task breakdown). The <strong>1–4-week sprint</strong> runs with a <strong>Daily Scrum</strong> every 24 hours and a <strong>burndown/up chart</strong> watched by the <strong>Scrum Master</strong>; "sprint end date and team deliverable do not change". The sprint ends with <strong>finished work</strong>, the <strong>Sprint Review</strong> (demo to stakeholders) and the <strong>Sprint Retrospective</strong> (process improvement). For testers: the burndown chart and the sprint backlog (task board) are the main test-status tools (lesson 9.5).</p>`,
        `<p>Hình kinh điển: ý kiến từ lãnh đạo, đội, các bên liên quan và người dùng đổ về <strong>Product Owner</strong>, người giữ <strong>product backlog đã xếp hạng</strong> (tính năng, story…). Trong <strong>Sprint Planning Meeting</strong> đội chọn từ đầu danh sách nhiều nhất mức có thể cam kết giao vào cuối sprint → <strong>sprint backlog</strong> (kèm chia task). <strong>Sprint 1–4 tuần</strong> chạy với <strong>Daily Scrum</strong> mỗi 24 giờ và <strong>biểu đồ burndown/burnup</strong> do <strong>Scrum Master</strong> theo dõi; "ngày kết thúc sprint và sản phẩm cam kết không đổi". Sprint kết thúc với <strong>việc đã xong</strong>, <strong>Sprint Review</strong> (demo cho các bên) và <strong>Sprint Retrospective</strong> (cải tiến quy trình). Với tester: biểu đồ burndown và sprint backlog (task board) là công cụ báo trạng thái kiểm thử chính (bài 9.5).</p>`],
      [43, 'Scrum Roles',
        `<p>Three roles: <strong>Scrum Master</strong> — a coach who ensures Scrum practices and rules are followed correctly and <strong>removes impediments</strong> (not a project manager, does not assign tasks). <strong>Product Owner</strong> — represents the customer/business side; <strong>creates, maintains and prioritises the product backlog</strong>. <strong>Team</strong> — develops <em>and tests</em> the product as a <strong>self-organised, cross-functional</strong> team that manages its own work. Note there is no "tester" role: testers are part of the Team. Classic questions: "who prioritises the backlog?" → PO; "who removes impediments?" → Scrum Master; "who decides how many stories fit in the sprint?" → the Team.</p>`,
        `<p>Ba vai trò: <strong>Scrum Master</strong> — người huấn luyện, đảm bảo thực hành và luật Scrum được làm đúng, <strong>gỡ bỏ trở ngại</strong> (không phải quản lý dự án, không giao việc). <strong>Product Owner</strong> — đại diện khách hàng/phía nghiệp vụ; <strong>tạo, duy trì và xếp ưu tiên product backlog</strong>. <strong>Team (đội phát triển)</strong> — phát triển <em>và kiểm thử</em> sản phẩm như một đội <strong>tự tổ chức, đa năng</strong>, tự quản lý công việc. Để ý: không có vai trò "tester" — tester là một phần của Team. Câu hỏi kinh điển: "ai xếp ưu tiên backlog?" → PO; "ai gỡ trở ngại?" → Scrum Master; "ai quyết bao nhiêu story vừa sprint?" → Team.</p>`],
      [44, 'Kanban (Visual Card or Board)',
        `<p>Kanban (Japanese: "visual signal / card") is a <strong>management approach</strong> sometimes used in Agile projects. In a value-added chain it is used to <strong>manage work in progress (WIP) visually on a board</strong> and to <strong>optimise work by limiting WIP to match the team's throughput</strong>. The board on the slide has columns Backlog → Planned → In Progress → Developed → Tested → Completed; blue cards are user stories, pink cards tasks (TK), orange cards incidents (IN). The notes: the four core principles are <em>visualise work, limit WIP, focus on flow, continuous improvement</em>; Toyota used Kanban cards for just-in-time production; Kanban is <strong>applied to an existing process</strong> — it adds no functionality, it only makes the workflow visible and optimises it.</p>`,
        `<p>Kanban (tiếng Nhật: "tín hiệu / thẻ trực quan") là một <strong>cách tiếp cận quản lý</strong> đôi khi dùng trong dự án Agile. Trong một chuỗi giá trị, nó dùng để <strong>quản lý công việc đang làm (WIP) một cách trực quan trên bảng</strong> và <strong>tối ưu công việc bằng cách giới hạn WIP cho khớp năng lực xử lý (throughput) của đội</strong>. Bảng trên slide có các cột Backlog → Planned → In Progress → Developed → Tested → Completed; thẻ xanh là user story, thẻ hồng là task (TK), thẻ cam là sự cố (IN). Ghi chú: bốn nguyên tắc cốt lõi là <em>trực quan hoá công việc, giới hạn WIP, tập trung vào dòng chảy, cải tiến liên tục</em>; Toyota dùng thẻ Kanban cho sản xuất just-in-time; Kanban <strong>áp lên quy trình đang có</strong> — không thêm chức năng, chỉ làm dòng công việc hiện ra và tối ưu nó.</p>`],
      [45, 'Kanban Board',
        `<p>Each <strong>column is a station</strong> (a set of related activities); items or tasks are <strong>tickets that move left to right</strong> through the stations. The example board (© Scaled Agile) has Team Backlog → Analyze → Review → Build → Integrate and test → Accepted, with "in progress / ready" sub-columns; the red numbers above the columns (2 | 6, 4, 2 | 8, 6) are the <strong>WIP limits</strong>. The horizontal swimlanes are classes of service: <em>Expedite</em> (urgent, may jump the queue), <em>Fixed date</em> and <em>Standard</em>. Notice "Integrate and test" is a station like any other — its WIP limit makes testing capacity visible.</p>`,
        `<p>Mỗi <strong>cột là một trạm</strong> (một nhóm hoạt động liên quan); hạng mục hay task là <strong>ticket di chuyển từ trái sang phải</strong> qua các trạm. Bảng ví dụ (© Scaled Agile) có Team Backlog → Analyze → Review → Build → Integrate and test → Accepted, với cột con "đang làm / sẵn sàng"; các số đỏ trên đầu cột (2 | 6, 4, 2 | 8, 6) là <strong>giới hạn WIP</strong>. Các làn ngang (swimlane) là loại dịch vụ: <em>Expedite</em> (khẩn, được chen hàng), <em>Fixed date</em> (có hạn cố định) và <em>Standard</em>. Để ý "Integrate and test" là một trạm như mọi trạm khác — giới hạn WIP của nó làm năng lực kiểm thử hiện rõ.</p>`],
      [46, 'Work-in-Progress Limit and Lead Time',
        `<p>The <strong>WIP limit</strong> caps parallel activities by the maximum number of tickets allowed at a station. Whenever a station has free capacity it <strong>pulls</strong> a ticket from the previous station — "pull, not push" (the diagram's arrow). Kanban's main objective is to <strong>minimise the lead time of the complete value stream</strong> by optimising the continuous flow of tasks. The diagram distinguishes <em>cycle time</em> (from starting work on an item to finishing it) from <em>lead time</em> (from the request entering the backlog until delivery), and repeats the principles: visualise work, limit WIP, focus on flow, continuous improvement.</p>`,
        `<p><strong>Giới hạn WIP</strong> chặn số việc làm song song bằng số ticket tối đa được phép ở một trạm. Khi một trạm còn chỗ, nó <strong>kéo (pull)</strong> ticket từ trạm trước — "kéo, không đẩy" (mũi tên trên sơ đồ). Mục tiêu chính của Kanban là <strong>giảm tối đa lead time của cả chuỗi giá trị</strong> bằng cách tối ưu dòng chảy liên tục của công việc. Sơ đồ phân biệt <em>cycle time</em> (từ lúc bắt tay làm một hạng mục tới lúc xong) với <em>lead time</em> (từ lúc yêu cầu vào backlog tới lúc giao), và nhắc lại các nguyên tắc: trực quan hoá, giới hạn WIP, tập trung dòng chảy, cải tiến liên tục.</p>`],
      [47, 'Kanban vs. Scrum',
        `<p>What they share: in both, <strong>visualising active tasks</strong> gives transparency of content and progress, and tasks not yet scheduled <strong>wait in a backlog</strong> and move onto the board when there is capacity. The differences: in Kanban <strong>iterations or sprints are optional</strong>, deliverables can be <strong>released item by item</strong> rather than as part of a release, and <strong>timeboxing as a synchronising mechanism is optional</strong>. In Scrum the sprint timebox is mandatory and the sprint backlog is fixed during the sprint. Many teams mix the two ("Scrumban").</p>`,
        `<p>Điểm chung: ở cả hai, <strong>trực quan hoá các task đang làm</strong> tạo minh bạch về nội dung và tiến độ, và task chưa lên lịch <strong>chờ trong backlog</strong>, được đưa lên bảng khi có năng lực trống. Điểm khác: trong Kanban <strong>iteration hay sprint là tuỳ chọn</strong>, sản phẩm có thể <strong>phát hành từng hạng mục một</strong> thay vì theo đợt, và <strong>timebox như cơ chế đồng bộ là tuỳ chọn</strong>. Trong Scrum timebox sprint là bắt buộc và sprint backlog cố định trong suốt sprint. Nhiều đội trộn cả hai ("Scrumban").</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — a full test column on a Kanban board</h3>
<p>A team's board has the WIP limits <em>Build 3 · Test 2 · Done ∞</em>. Right now <em>Test</em> holds 2 stories (full), and developer Minh finishes a third story in <em>Build</em>. What should happen?</p>
<ol>
<li><strong>Minh may not push the card into Test</strong> — the Test station is at its limit (2/2). In Kanban the downstream station <em>pulls</em> when it has capacity.</li>
<li>The card stays in Build marked "ready". Build now holds 3/3, so <strong>no one can start new build work either</strong> — the limit stops the queue in front of testing from growing.</li>
<li>The team <strong>swarms on the bottleneck</strong>: Minh helps test (runs the automated acceptance tests, pairs with the tester on an exploratory session, fixes the defects found). When a test card moves to Done, Test pulls Minh's card.</li>
<li>Why it matters, with Little's law: average lead time = WIP ÷ throughput. With 12 items in progress and a throughput of 4 items/day the lead time is 12 ÷ 4 = <strong>3 days</strong>; letting WIP grow to 20 at the same throughput would stretch it to 5 days. Limiting WIP shortens lead time without anyone working faster.</li>
</ol>
<p><b>Identify the method (quick self-check):</b> "pair programming and a unit test before code" → XP · "a Product Owner orders the backlog; the sprint goal is protected" → Scrum · "no iterations; each item is released when it reaches Done; WIP limit per column" → Kanban · "Definition of Done" → Scrum (commonly adopted by all) · "velocity is measured; move people around" → XP rules.</p>
<div class="pitfall"><b>Scrum says nothing about testing.</b> Exam options such as "Scrum prescribes test-first programming" or "Scrum defines how acceptance tests are written" are false (slide 41). Test-first comes from <strong>XP</strong>. Another trap: "Kanban requires timeboxed iterations" — false, they are optional (slide 47).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Little's law and flow metrics.</b> The formula used above, L = λ·W (items in system = arrival rate × time in system), was proved by John Little in 1961 for any stable queue; Kanban practitioners use it as lead time = WIP ÷ throughput and track <em>cumulative flow diagrams</em>, cycle-time scatterplots and throughput run charts instead of velocity. A widening "In test" band on a cumulative flow diagram is the earliest visual warning that testing has become the bottleneck. <em>Outside the syllabus because CTFL-AT only asks what WIP limits and lead time are, not how to calculate or chart them.</em></div>`,
      `<h3>Ví dụ có lời giải · Bài tập — cột Test đã đầy trên bảng Kanban</h3>
<p>Bảng của một đội có giới hạn WIP <em>Build 3 · Test 2 · Done ∞</em>. Hiện <em>Test</em> đang có 2 story (đầy), và developer Minh vừa làm xong story thứ ba ở <em>Build</em>. Chuyện gì phải xảy ra?</p>
<ol>
<li><strong>Minh không được đẩy thẻ sang Test</strong> — trạm Test đã chạm giới hạn (2/2). Trong Kanban trạm phía sau <em>kéo</em> khi còn chỗ.</li>
<li>Thẻ nằm lại ở Build với nhãn "sẵn sàng". Build lúc này 3/3, nên <strong>cũng không ai được bắt đầu việc build mới</strong> — giới hạn ngăn hàng đợi trước khâu test phình ra.</li>
<li>Cả đội <strong>dồn vào nút thắt</strong>: Minh giúp test (chạy acceptance test tự động, làm exploratory cặp với tester, sửa defect tìm được). Khi một thẻ ở Test sang Done, Test kéo thẻ của Minh vào.</li>
<li>Vì sao quan trọng, theo định luật Little: lead time trung bình = WIP ÷ throughput. Có 12 hạng mục đang làm và throughput 4 hạng mục/ngày thì lead time = 12 ÷ 4 = <strong>3 ngày</strong>; để WIP phình lên 20 với cùng throughput thì lead time kéo dài thành 5 ngày. Giới hạn WIP rút ngắn lead time mà không ai phải làm nhanh hơn.</li>
</ol>
<p><b>Nhận diện phương pháp (tự kiểm tra nhanh):</b> "lập trình cặp và viết unit test trước code" → XP · "Product Owner xếp thứ tự backlog; mục tiêu sprint được bảo vệ" → Scrum · "không có iteration; mỗi hạng mục phát hành khi tới Done; giới hạn WIP theo cột" → Kanban · "Definition of Done" → Scrum (các đội khác cũng hay dùng) · "đo velocity; luân chuyển người" → luật XP.</p>
<div class="pitfall"><b>Scrum không nói gì về kiểm thử.</b> Các phương án "Scrum quy định lập trình test-first" hay "Scrum quy định cách viết acceptance test" đều sai (slide 41). Test-first đến từ <strong>XP</strong>. Bẫy khác: "Kanban bắt buộc có iteration theo timebox" — sai, đó là tuỳ chọn (slide 47).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Định luật Little và các chỉ số dòng chảy.</b> Công thức dùng ở trên, L = λ·W (số hạng mục trong hệ thống = tốc độ đến × thời gian nằm trong hệ thống), được John Little chứng minh năm 1961 cho mọi hàng đợi ổn định; người dùng Kanban áp nó thành lead time = WIP ÷ throughput và theo dõi <em>cumulative flow diagram</em>, biểu đồ phân tán cycle time, biểu đồ throughput thay cho velocity. Dải "In test" phình rộng trên cumulative flow diagram là cảnh báo trực quan sớm nhất rằng kiểm thử đã thành nút thắt. <em>Ngoài giáo trình vì CTFL-AT chỉ hỏi WIP limit và lead time là gì, không yêu cầu tính hay vẽ biểu đồ.</em></div>`),
    books([
      ['agile', 'ISTQB Agile Tester in a Nutshell — p.17 (chapter 1 objectives: "recall agile software development approaches"), p.15 (the tester\'s contribution in an agile team)', 'ISTQB Agile Tester in a Nutshell — tr.17 (chuẩn đầu ra chương 1: "nhắc lại các cách tiếp cận Agile"), tr.15 (đóng góp của tester trong đội Agile)'],
      ['sp5', '§3.2 Iterative and Incremental Development Models, PDF p.83 — "the best-known agile models are Extreme Programming (XP), Kanban and Scrum", Fig. 3-3 Scrum-based agile development; PDF p.84 — continuous testing and test automation in agile projects', '§3.2 Iterative and Incremental Development Models, PDF tr.83 — "các mô hình Agile nổi tiếng nhất là XP, Kanban và Scrum", Hình 3-3 mô hình Agile theo Scrum; PDF tr.84 — continuous testing và tự động hoá test trong dự án Agile'],
    ]),
  ].join('\n'),
};

/* ───────────────── 9.3 User stories, retrospectives, CI ───────────────── */
const L93 = {
  title: '9.3 — Collaborative user stories, retrospectives and continuous integration|||9.3 — Cùng viết user story, retrospective và tích hợp liên tục',
  slug: 'swt301-agile-user-stories-ci',
  type: 'VIDEO',
  description: 'Topic 8 slide 48–64: đặc tả kém, power of three, user story + acceptance criteria, góc nhìn tester, INVEST, retrospective (lợi ích, cách chạy, yếu tố thành công), CI (hoạt động, test tự động, deploy tự động, lợi ích, rủi ro) — kèm 1 slide ẩn.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lesson 9.3 · Topic 8 slides 48–64</span>
<h2>Three practices where the Agile tester earns their place</h2>
<p class="lead">Three of the four common practices from the wheel on slide 25. <strong>Collaborative user-story creation</strong> — the tester makes stories testable before a line of code exists. <strong>Retrospectives</strong> — the team, testers included, improves its own process every iteration. <strong>Continuous integration</strong> — every change is built and tested automatically, so the tester gets a fresh, working build every day and can spend manual effort where it matters.</p>
<div class="callout"><b>Learning objectives.</b> FA-1.2.2 Write testable user stories in collaboration with developers and business representatives (K3) · FA-1.2.3 Understand how retrospectives can be used as a mechanism for process improvement in Agile projects (K2) · FA-1.2.4 Understand the use and purpose of continuous integration (K2).</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Card</div><div class="lz-t">the story on a card</div><div class="lz-d">As a &lt;role&gt;, I want &lt;goal&gt; so that &lt;benefit&gt;</div></div>
  <div class="lz-step"><div class="lz-k">Conversation</div><div class="lz-t">power of three talks</div><div class="lz-d">open questions, missing details, NFRs</div></div>
  <div class="lz-step"><div class="lz-k">Confirmation</div><div class="lz-t">acceptance criteria</div><div class="lz-d">how the business will validate it</div></div>
  <div class="lz-step"><div class="lz-k">Build + CI</div><div class="lz-t">code, integrate, test daily</div><div class="lz-d">automated build &amp; regression</div></div>
  <div class="lz-step"><div class="lz-k">Retrospective</div><div class="lz-t">improve the process</div><div class="lz-d">keep the good, fix the bad</div></div>
</div>`,
    `<span class="eyebrow">Chương 9 · Bài 9.3 · Topic 8 slide 48–64</span>
<h2>Ba thực hành nơi tester Agile khẳng định chỗ đứng</h2>
<p class="lead">Ba trong bốn thực hành chung của bánh xe ở slide 25. <strong>Cùng nhau viết user story</strong> — tester làm story trở nên kiểm thử được trước khi có dòng code nào. <strong>Retrospective</strong> — cả đội, kể cả tester, tự cải tiến quy trình mỗi iteration. <strong>Tích hợp liên tục (CI)</strong> — mọi thay đổi được build và test tự động, nên tester có bản build mới, chạy được mỗi ngày và dồn công sức test tay vào đúng chỗ cần.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> FA-1.2.2 Viết user story kiểm thử được cùng developer và đại diện nghiệp vụ (K3) · FA-1.2.3 Hiểu cách dùng retrospective làm cơ chế cải tiến quy trình trong dự án Agile (K2) · FA-1.2.4 Hiểu công dụng và mục đích của tích hợp liên tục (K2).</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Card</div><div class="lz-t">story ghi trên thẻ</div><div class="lz-d">Là &lt;vai trò&gt;, tôi muốn &lt;mục tiêu&gt; để &lt;lợi ích&gt;</div></div>
  <div class="lz-step"><div class="lz-k">Conversation</div><div class="lz-t">ba bên trao đổi</div><div class="lz-d">câu hỏi mở, chi tiết thiếu, yêu cầu phi chức năng</div></div>
  <div class="lz-step"><div class="lz-k">Confirmation</div><div class="lz-t">acceptance criteria</div><div class="lz-d">nghiệp vụ sẽ nghiệm thu thế nào</div></div>
  <div class="lz-step"><div class="lz-k">Build + CI</div><div class="lz-t">code, tích hợp, test mỗi ngày</div><div class="lz-d">build &amp; hồi quy tự động</div></div>
  <div class="lz-step"><div class="lz-k">Retrospective</div><div class="lz-t">cải tiến quy trình</div><div class="lz-d">giữ cái tốt, sửa cái dở</div></div>
</div>`),
    walkHead(D, 48, 64),
    walk(D, [
      [48, 'Poor Specifications',
        `<p>Poor specifications are <strong>a major reason for project failure</strong>. The pie chart "Why do projects fail?" puts <strong>poor requirements definition at 50%</strong>, then inadequate risk management 17%, poor scope definition 15%, communication problems 14%, lack of qualified resources 3%, other 1%. Poor specs come from: users' lack of insight into what they need; no global vision of the system; redundant features; contradictory features; miscommunications; misinterpretations — and, highlighted, <strong>lacking the power of three</strong>. The teacher's notes: users sometimes do not know what they really need; nobody sees the whole picture (how the sub-systems talk to each other); BA, developers and testers miscommunicate. The Agile answer is the next slide.</p>`,
        `<p>Đặc tả kém là <strong>một nguyên nhân chính khiến dự án thất bại</strong>. Biểu đồ tròn "Vì sao dự án thất bại?" cho <strong>định nghĩa yêu cầu kém chiếm 50%</strong>, rồi quản lý rủi ro không đủ 17%, xác định phạm vi kém 15%, vấn đề giao tiếp 14%, thiếu nhân lực đủ năng lực 3%, khác 1%. Đặc tả kém sinh ra từ: người dùng không rõ mình cần gì; không có tầm nhìn tổng thể về hệ thống; tính năng thừa; tính năng mâu thuẫn nhau; truyền đạt sai; hiểu sai — và, được tô đậm, <strong>thiếu power of three</strong>. Ghi chú của thầy/cô: người dùng đôi khi không biết mình thực sự cần gì; không ai thấy bức tranh tổng (các hệ thống con giao tiếp ra sao); BA, dev và tester hiểu nhầm nhau. Lời giải của Agile nằm ở slide sau.</p>`],
      [49, 'Power of 3 is Achieved by',
        `<p>Two ways to get the three perspectives into the requirements. <strong>Sequential development</strong>: by <em>formal reviews</em> (Chapter 3) <em>after</em> the requirements are written. <strong>Agile development</strong>: by <em>frequent informal reviews while</em> the requirements are being written, in the form of <strong>user stories</strong> that capture the requirement from the perspective of developers, testers and business representatives. Link to lesson 3.x: it is still static testing — just continuous and informal instead of a single formal gate.</p>`,
        `<p>Hai cách đưa ba góc nhìn vào yêu cầu. <strong>Phát triển tuần tự</strong>: bằng <em>review chính thức</em> (Chương 3) <em>sau khi</em> yêu cầu đã viết xong. <strong>Phát triển Agile</strong>: bằng <em>review không chính thức, thường xuyên, ngay trong lúc</em> viết yêu cầu, dưới dạng <strong>user story</strong> ghi lại yêu cầu từ góc nhìn của developer, tester và đại diện nghiệp vụ. Liên hệ Chương 3: đây vẫn là kiểm thử tĩnh — chỉ là liên tục và không chính thức thay vì một cửa kiểm duyệt trang trọng duy nhất.</p>`],
      [50, 'User Stories',
        `<p>A user story <strong>documents minimal requirements</strong> — functional <em>and</em> non-functional — and <strong>should include acceptance criteria</strong> written together by business representatives, developers and testers. The acceptance criteria extend the developers' and testers' view of the feature that the business will validate. Template on the yellow note: <strong>"As &lt;who&gt;, I want &lt;what&gt; so that &lt;why&gt;."</strong> The pink cards are the syllabus's own example of a <em>non-functional</em> story: <em>Performance constraint — "As Mary, I want to receive a response to any input in less than one second."</em> <em>Acceptance criteria — measure the time between clicking a button or hitting a key and the response being displayed; 50 users active on the website; no other booking is taking place.</em> Notice how the criteria turn "less than one second" into something measurable: <em>what</em> is timed and <em>under which load</em>.</p>
<p>The syllabus also names the <strong>3 Cs</strong> of a story: <strong>Card</strong> (the physical medium — short, with the story and its criteria), <strong>Conversation</strong> (how the software will be used — the real requirement lives in the discussion) and <strong>Confirmation</strong> (the acceptance criteria that confirm the story is done).</p>`,
        `<p>User story <strong>ghi lại yêu cầu ở mức tối thiểu</strong> — cả chức năng <em>lẫn</em> phi chức năng — và <strong>nên có acceptance criteria</strong> do đại diện nghiệp vụ, developer và tester cùng viết. Acceptance criteria mở rộng hình dung của dev và tester về tính năng mà nghiệp vụ sẽ nghiệm thu. Mẫu trên tờ giấy vàng: <strong>"Là &lt;ai&gt;, tôi muốn &lt;cái gì&gt; để &lt;vì sao&gt;."</strong> Hai thẻ hồng là ví dụ của chính syllabus về một story <em>phi chức năng</em>: <em>Ràng buộc hiệu năng — "Là Mary, tôi muốn nhận phản hồi cho mọi thao tác nhập trong vòng dưới một giây."</em> <em>Acceptance criteria — đo thời gian từ lúc bấm nút hoặc gõ phím tới lúc phản hồi hiện ra; 50 người dùng đang hoạt động trên website; không có giao dịch đặt chỗ nào khác đang diễn ra.</em> Để ý cách tiêu chí biến "dưới một giây" thành thứ đo được: đo <em>cái gì</em> và <em>dưới tải nào</em>.</p>
<p>Syllabus còn nêu <strong>3 chữ C</strong> của một story: <strong>Card</strong> (thẻ — phương tiện vật lý, ngắn gọn, ghi story và tiêu chí), <strong>Conversation</strong> (trao đổi — phần mềm sẽ được dùng thế nào; yêu cầu thật nằm trong cuộc nói chuyện) và <strong>Confirmation</strong> (xác nhận — acceptance criteria khẳng định story đã xong).</p>`],
      [51, 'User Story Creation: Tester Perspective',
        `<p>What the tester brings to story writing: <strong>identifying missing details or non-functional requirements</strong> (performance, security, usability are the usual gaps); <strong>asking business representatives open-ended questions</strong> ("what should happen when…?", "who else uses this?"); <strong>proposing ways to test the user story</strong>; <strong>confirming the acceptance criteria</strong>. Every question asked here is a defect prevented — the cheapest point on the cost-of-change curve (slide 20). The worked example below applies this list.</p>`,
        `<p>Tester mang gì tới buổi viết story: <strong>phát hiện chi tiết còn thiếu hoặc yêu cầu phi chức năng</strong> (hiệu năng, bảo mật, khả năng sử dụng là các khoảng trống hay gặp); <strong>đặt câu hỏi mở cho đại diện nghiệp vụ</strong> ("chuyện gì xảy ra khi…?", "còn ai dùng tính năng này?"); <strong>đề xuất cách kiểm thử story</strong>; <strong>xác nhận acceptance criteria</strong>. Mỗi câu hỏi đặt ra ở đây là một defect được ngăn từ trứng — điểm rẻ nhất trên đường chi phí thay đổi (slide 20). Bài tập có lời giải bên dưới áp dụng đúng danh sách này.</p>`],
      [52, 'User Story Creation: Techniques',
        `<p>Techniques for writing stories together: <strong>brainstorming</strong>, <strong>mind mapping</strong> and the <strong>INVEST</strong> checklist created by Bill Wake as a reminder of the qualities of a good story: <strong>I</strong>ndependent (understandable on its own; the notes: so that stories can be placed into any sprint), <strong>N</strong>egotiable (flexible, details agreed in conversation), <strong>V</strong>aluable (adds value for a user or the business), <strong>E</strong>stimable (enough detail to estimate in story points and time), <strong>S</strong>mall (sized to fit one iteration), <strong>T</strong>estable (has acceptance criteria). The letter a tester owns is <strong>T</strong>: a story without testable acceptance criteria is not ready for a sprint.</p>`,
        `<p>Kỹ thuật để cùng viết story: <strong>brainstorming</strong>, <strong>mind mapping</strong> và checklist <strong>INVEST</strong> do Bill Wake đặt ra để nhắc các phẩm chất của một story tốt: <strong>I</strong>ndependent — độc lập (hiểu được một mình; ghi chú: để story xếp được vào bất kỳ sprint nào), <strong>N</strong>egotiable — thương lượng được (linh hoạt, chi tiết chốt trong trao đổi), <strong>V</strong>aluable — có giá trị (cho người dùng hoặc doanh nghiệp), <strong>E</strong>stimable — ước lượng được (đủ chi tiết để ước bằng story point và thời gian), <strong>S</strong>mall — nhỏ (vừa một iteration), <strong>T</strong>estable — kiểm thử được (có acceptance criteria). Chữ cái mà tester "sở hữu" là <strong>T</strong>: story không có acceptance criteria kiểm thử được thì chưa sẵn sàng vào sprint.</p>`],
      [53, 'Retrospectives in Agile Development',
        `<p>A retrospective is a <strong>meeting held at the end of each iteration</strong> to discuss <em>what went well</em>, <em>what can be improved</em>, and <em>how to keep the good and improve the bad</em> in the next iterations. Topics may cover <strong>process, people, organisation, relationships and tools</strong> — it is not a defect meeting and not a blame session. It is the concrete form of Manifesto principle 12 ("the team reflects at regular intervals and adjusts").</p>`,
        `<p>Retrospective là <strong>buổi họp cuối mỗi iteration</strong> để bàn <em>điều gì diễn ra tốt</em>, <em>điều gì có thể cải thiện</em>, và <em>làm sao giữ cái tốt, sửa cái dở</em> ở các iteration sau. Chủ đề có thể là <strong>quy trình, con người, tổ chức, các mối quan hệ và công cụ</strong> — không phải buổi họp về defect, cũng không phải buổi đổ lỗi. Đây là dạng cụ thể của nguyên tắc 12 trong Tuyên ngôn ("định kỳ đội nhìn lại và điều chỉnh").</p>`],
      [54, 'Retrospectives: Benefits',
        `<p>Held regularly <strong>with appropriate follow-up</strong> (the actions are really done in the next iteration), retrospectives lead to: better <strong>self-organisation</strong>; <strong>continuous improvement of development and testing</strong>; <strong>test-related improvements</strong> in effectiveness, efficiency, test-case quality and team satisfaction; and <strong>better testability</strong> of applications, user stories, features and system interfaces. Without follow-up, a retrospective is just a complaint session — and people stop coming.</p>`,
        `<p>Tổ chức đều đặn <strong>và có theo dõi thực hiện</strong> (hành động thực sự được làm ở iteration sau), retrospective đem lại: <strong>tự tổ chức</strong> tốt hơn; <strong>cải tiến liên tục cả phát triển lẫn kiểm thử</strong>; <strong>cải tiến liên quan tới kiểm thử</strong> về hiệu quả, năng suất, chất lượng test case và sự hài lòng của đội; và <strong>khả năng kiểm thử (testability) tốt hơn</strong> cho ứng dụng, user story, tính năng và giao diện hệ thống. Không có theo dõi thực hiện, retrospective chỉ là buổi than phiền — và mọi người thôi không đến nữa.</p>`],
      [55, 'Retrospectives: Effectivity',
        `<p>How to make them work: <strong>root-cause analysis of defects</strong> can drive development and testing improvements (lesson 1.2); <strong>a few improvements per iteration</strong> = continuous improvement at a sustainable pace = what makes the method <em>adaptive</em>; timing depends on the method and organisation; the meeting is run by a <strong>facilitator</strong>; <strong>both business representatives and the team</strong> attend; it happens in an environment of <strong>trust</strong>; <strong>every team member can give input on testing and non-testing activities</strong> — a developer may suggest a test improvement and a tester may point out a coding practice.</p>`,
        `<p>Làm sao cho hiệu quả: <strong>phân tích nguyên nhân gốc của defect</strong> có thể thúc đẩy cải tiến phát triển và kiểm thử (bài 1.2); <strong>vài cải tiến mỗi iteration</strong> = cải tiến liên tục với nhịp bền vững = điều làm phương pháp trở nên <em>thích nghi</em>; thời điểm tuỳ phương pháp và tổ chức; buổi họp do một <strong>người điều phối (facilitator)</strong> dẫn; <strong>cả đại diện nghiệp vụ lẫn đội</strong> tham dự; diễn ra trong môi trường <strong>tin cậy</strong>; <strong>mọi thành viên đều góp ý được cho cả hoạt động kiểm thử lẫn phi kiểm thử</strong> — developer có thể đề xuất cải tiến test, tester có thể góp ý về cách code.</p>`],
      [56, 'Retrospective: Key Success Factors',
        `<p>"Similar to the success factors of reviews" — compare Chapter 3 (LO-3.2.5): <strong>defects found are welcomed and expressed objectively</strong>; <strong>people issues and psychological aspects are dealt with</strong>; <strong>checklists or roles are used if appropriate</strong>; <strong>training is given in the techniques used</strong>; <strong>management support</strong>. A retrospective is, in effect, a review of the team's process instead of a work product.</p>`,
        `<p>"Giống yếu tố thành công của review" — so với Chương 3 (LO-3.2.5): <strong>vấn đề tìm ra được hoan nghênh và nêu một cách khách quan</strong>; <strong>vấn đề con người và khía cạnh tâm lý được xử lý</strong>; <strong>dùng checklist hoặc phân vai khi phù hợp</strong>; <strong>được đào tạo về kỹ thuật sử dụng</strong>; <strong>có sự ủng hộ của quản lý</strong>. Thực chất retrospective là một buổi review — đối tượng là quy trình của đội thay vì một sản phẩm công việc.</p>`],
      [57, 'Need for Continuous Integration (CI)',
        `<p>Why Agile needs CI: delivering a product requires <strong>reliable, working, integrated software at the end of every sprint</strong> — short cycles <em>increase</em> integration risk. CI <strong>merges and integrates changes at least once a day</strong>, and wraps configuration management, compilation, software build, deployment and testing into <strong>a single, automated, repeatable process</strong> — which <em>decreases</em> risk. Result: <strong>defects are detected more quickly</strong>.</p>`,
        `<p>Vì sao Agile cần CI: giao sản phẩm đòi hỏi <strong>phần mềm tin cậy, chạy được, đã tích hợp vào cuối mỗi sprint</strong> — chu kỳ ngắn làm rủi ro tích hợp <em>tăng</em>. CI <strong>hợp nhất và tích hợp thay đổi ít nhất mỗi ngày một lần</strong>, gói quản lý cấu hình, biên dịch, build, triển khai và kiểm thử thành <strong>một quy trình duy nhất, tự động, lặp lại được</strong> — nên rủi ro <em>giảm</em>. Kết quả: <strong>defect được phát hiện nhanh hơn</strong>.</p>`],
      [58, 'CI Activities (Automated and Daily)',
        `<p>The cycle diagram: <strong>1</strong> the developer checks out code from source control → <strong>2</strong> commits changes → <strong>3</strong> the CI server initiates a build → <strong>4a</strong> a clean build triggers unit and integration tests, or <strong>4b</strong> the developer is notified of build failures → <strong>5</strong> the developer is notified of the test results. The teacher's notes spell out the stages: integrate source code into the shared repository (Git, SVN); automatic build (compile, package, resources); automated testing (unit, integration, acceptance); analyse the test results and notify the team on failure; automated deployment to a test or production environment if everything passes; fast feedback on the stability and quality of the code.</p>`,
        `<p>Sơ đồ vòng tròn: <strong>1</strong> developer lấy code từ hệ thống quản lý mã nguồn → <strong>2</strong> commit thay đổi → <strong>3</strong> CI server khởi động một bản build → <strong>4a</strong> build sạch kích hoạt unit test và integration test, hoặc <strong>4b</strong> developer nhận thông báo build hỏng → <strong>5</strong> developer nhận thông báo kết quả test. Ghi chú của thầy/cô liệt kê các bước: tích hợp mã vào kho chung (Git, SVN); build tự động (biên dịch, đóng gói, tài nguyên); test tự động (unit, integration, acceptance); phân tích kết quả và báo đội khi có lỗi; triển khai tự động lên môi trường test hoặc production nếu mọi thứ đạt; phản hồi nhanh về độ ổn định và chất lượng code.</p>`],
      [59, 'CI: Continuous Automated Testing',
        `<p>The build-and-test process runs <strong>daily</strong>, so integration issues are found early and quickly. Agile testers run automated tests daily and send feedback on code quality to the team (the slide's "tam" is a typo for "team"). Test results are <strong>visible to all team members</strong>, especially through automated reports. <strong>Regression testing can be continuous</strong> throughout the iteration, covering as much functionality as possible, <em>including user stories delivered in previous iterations</em>. The teacher's notes add a warning worth an exam point: a common misinterpretation of CI is that <strong>manual testing is no longer needed — that is not the case</strong>. CI aims at a stable build without integration defects, not at proving the product does what it should; exploratory testing, confirmation testing and many other activities remain essential.</p>`,
        `<p>Quy trình build-và-test chạy <strong>hằng ngày</strong>, nên lỗi tích hợp lộ sớm và nhanh. Tester Agile chạy test tự động mỗi ngày và gửi phản hồi về chất lượng code cho đội (chữ "tam" trên slide là gõ nhầm của "team"). Kết quả test <strong>hiển thị cho mọi thành viên</strong>, nhất là qua báo cáo tự động. <strong>Kiểm thử hồi quy có thể diễn ra liên tục</strong> suốt iteration, phủ càng nhiều chức năng càng tốt, <em>kể cả user story đã giao ở các iteration trước</em>. Ghi chú của thầy/cô thêm một cảnh báo đáng giá một câu thi: hiểu lầm phổ biến về CI là <strong>không cần test tay nữa — không phải vậy</strong>. CI nhắm tới một bản build ổn định, không lỗi tích hợp, chứ không chứng minh sản phẩm làm đúng điều nó phải làm; exploratory testing, confirmation testing và nhiều hoạt động khác vẫn thiết yếu.</p>`],
      [60, 'CI: Continuous Automated Testing — freeing the tester',
        `<p>Good regression coverage helps build <strong>large integrated systems</strong>. Automating regression <strong>creates time</strong> for testers to concentrate their <em>manual</em> testing on <strong>new features</strong>, <strong>implemented changes</strong> and <strong>confirmation testing of defect fixes</strong>. The notes repeat the point of slide 59 on purpose: automation does not replace the tester — it moves the tester to where human judgment is needed.</p>`,
        `<p>Độ phủ hồi quy tốt giúp xây dựng <strong>các hệ thống tích hợp lớn</strong>. Tự động hoá hồi quy <strong>tạo ra thời gian</strong> để tester dồn phần test <em>tay</em> vào <strong>tính năng mới</strong>, <strong>thay đổi vừa làm</strong> và <strong>confirmation testing cho các bản sửa defect</strong>. Ghi chú cố ý nhắc lại ý của slide 59: tự động hoá không thay thế tester — nó dời tester tới chỗ cần óc phán đoán của con người.</p>`],
      [61, 'CI: Continuous Quality Control',
        `<p><strong>Automated build tools</strong> are used to run unit and integration tests, run <strong>static and dynamic</strong> tests (static analysis such as SonarQube/Checkstyle runs in the pipeline — lesson on Chapter 3 and Lab 1), measure and profile performance, extract and format documentation from source code (Javadoc), and facilitate manual QA processes. The objectives: <strong>improve product quality</strong> and <strong>reduce time to deliver</strong> — quality control is no longer done <em>after</em> development is finished.</p>`,
        `<p><strong>Công cụ build tự động</strong> dùng để chạy unit test và integration test, chạy test <strong>tĩnh và động</strong> (phân tích tĩnh như SonarQube/Checkstyle chạy ngay trong pipeline — Chương 3 và Lab 1), đo và phân tích hiệu năng, trích và định dạng tài liệu từ mã nguồn (Javadoc), và hỗ trợ các quy trình QA thủ công. Mục tiêu: <strong>nâng chất lượng sản phẩm</strong> và <strong>rút ngắn thời gian giao</strong> — kiểm soát chất lượng không còn dồn <em>sau</em> khi phát triển xong.</p>`],
      [62, 'CI: Automatic Deployments',
        `<p>Build tools are often linked to <strong>automatic deployment tools</strong>, which fetch the right build from the CI/build server and <strong>deploy it into one or more environments</strong> (development, test, staging, production). This reduces the errors and delays of relying on specialised staff or programmers to install releases by hand. For the tester: a fresh build appears in the test environment without asking anyone — and the <em>version under test</em> is always known.</p>`,
        `<p>Công cụ build thường được nối với <strong>công cụ triển khai tự động</strong>, thứ lấy đúng bản build từ CI/build server và <strong>triển khai nó lên một hoặc nhiều môi trường</strong> (development, test, staging, production). Việc này giảm lỗi và độ trễ khi phải trông vào nhân sự chuyên trách hay lập trình viên cài bản phát hành bằng tay. Với tester: bản build mới tự xuất hiện ở môi trường test mà không cần nhờ ai — và luôn biết chính xác <em>phiên bản đang được test</em>.</p>`],
      [63, 'CI: Possible Benefits',
        `<p>The nine benefits (syllabus list): earlier detection and easier root-cause analysis of <strong>integration problems</strong> and conflicting changes; <strong>regular feedback</strong> to the team on whether the code works; keeps the <strong>version being tested within a day of the version being developed</strong>; <strong>reduces regression risk</strong> of refactoring; confidence that each day's work rests on a <strong>solid foundation</strong>; <strong>progress toward the increment is visible</strong>; <strong>eliminates the schedule risks of big-bang integration</strong>; <strong>executable software is constantly available</strong> for testing, demos or training; <strong>reduces repetitive manual testing</strong>. The notes explain the "within a day" item: testers test what developers wrote yesterday, so defects are found and fixed while the code is still fresh in the developer's head.</p>`,
        `<p>Chín lợi ích (danh sách syllabus): phát hiện sớm và dễ phân tích nguyên nhân gốc của <strong>lỗi tích hợp</strong> và thay đổi xung đột; <strong>phản hồi đều đặn</strong> cho đội về việc code có chạy không; giữ <strong>phiên bản đang test cách phiên bản đang phát triển không quá một ngày</strong>; <strong>giảm rủi ro hồi quy</strong> khi refactor; tin chắc công việc mỗi ngày dựa trên <strong>nền móng vững</strong>; <strong>tiến độ tới increment hiện rõ</strong>; <strong>loại bỏ rủi ro lịch trình của tích hợp big-bang</strong>; <strong>luôn có phần mềm chạy được</strong> để test, demo hay đào tạo; <strong>giảm test tay lặp đi lặp lại</strong>. Ghi chú giải thích mục "trong vòng một ngày": tester test thứ developer viết hôm qua, nên defect được tìm và sửa khi code còn nóng trong đầu developer.</p>`],
      [64, 'CI: Risks and Challenges',
        `<p>The costs: CI tools must be <strong>introduced and maintained</strong>; the CI process must be <strong>defined and estimated</strong>; <strong>test automation needs extra resources and can be complex</strong>; <strong>thorough test coverage is essential</strong> to get the benefits of automated testing; teams sometimes <strong>over-rely on unit tests and do too little system and acceptance testing</strong> (the favourite exam item); and tools are needed for testing, build automation and version control. The over-reliance risk is the reason for the test pyramid <em>and</em> the testing quadrants (lesson 9.6): unit tests are the base, not the whole building.</p>`,
        `<p>Cái giá phải trả: công cụ CI phải được <strong>đưa vào và bảo trì</strong>; quy trình CI phải được <strong>định nghĩa và ước lượng</strong>; <strong>tự động hoá test cần thêm nguồn lực và có thể phức tạp</strong>; <strong>độ phủ test kỹ lưỡng là điều kiện bắt buộc</strong> để hưởng lợi từ test tự động; đội đôi khi <strong>quá tin vào unit test mà làm quá ít system test và acceptance test</strong> (mục giám khảo thích hỏi nhất); và cần công cụ cho kiểm thử, tự động hoá build và quản lý phiên bản. Rủi ro "quá tin unit test" chính là lý do có test pyramid <em>và</em> testing quadrants (bài 9.6): unit test là móng nhà, không phải cả ngôi nhà.</p>`],
    ]),
    bi(`<h3>🔒 Hidden slide in "Topic 8 ISTQB CTFL Agile Tester.pptx"</h3>
<ul>
<li><strong>pptx slide 58 — "CI Activities (Automated &amp; Daily)"</strong>. A hidden, earlier copy of the slide you saw as visible slide 58 (pptx 59): same title, no body text and no speaker notes left in the file. The teacher kept the version with the six-step CI cycle diagram and the detailed notes; nothing is lost by skipping the hidden one.</li>
</ul>`,
      `<h3>🔒 Slide ẩn trong file "Topic 8 ISTQB CTFL Agile Tester.pptx"</h3>
<ul>
<li><strong>Slide pptx 58 — "CI Activities (Automated &amp; Daily)"</strong>. Một bản cũ bị ẩn của slide bạn đã thấy ở slide hiển thị số 58 (pptx 59): cùng tiêu đề, không còn nội dung chữ và không có ghi chú. Thầy/cô giữ bản có sơ đồ vòng CI sáu bước và ghi chú chi tiết; bỏ qua bản ẩn không mất gì.</li>
</ul>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — INVEST-check the slide's own story, then see why CI must run per commit</h3>
<p><b>Part A. Is "As Mary, I want to receive a response to any input in less than one second" a good story?</b></p>
<table>
<thead><tr><th>Letter</th><th>Verdict</th><th>Reason / fix</th></tr></thead>
<tbody>
<tr><td>I — Independent</td><td>⚠</td><td>"Any input" touches every screen, so it depends on all other stories. Fix: attach it as a performance <em>constraint</em> to the relevant stories (search, booking), or to the Definition of Done.</td></tr>
<tr><td>N — Negotiable</td><td>✔</td><td>1 second, 50 users can be discussed with the business.</td></tr>
<tr><td>V — Valuable</td><td>✔</td><td>Slow responses lose customers.</td></tr>
<tr><td>E — Estimable</td><td>⚠</td><td>Without knowing which inputs and which environment the team cannot size it.</td></tr>
<tr><td>S — Small</td><td>✘</td><td>"Any input" is not one iteration of work.</td></tr>
<tr><td>T — Testable</td><td>✔</td><td>Thanks to the acceptance criteria: what is measured (click/key → response displayed) and under which load (50 active users, no other booking). Without them it would fail T.</td></tr>
</tbody>
</table>
<p>Tester's open questions (slide 51): Which percentile — every response, or 95 %? Measured on which network and device? What about the first page load? What should the user see if it takes longer? Rewritten: <em>"As Mary, I want search results within 1 second so that I can compare flights quickly"</em> with the criteria "95th percentile ≤ 1.0 s with 50 active users on the staging server; measured from pressing Search to the result list being displayed".</p>
<p><b>Part B. Why integrate at least daily?</b> Three developers commit about 4 times a day each = <strong>12 commits/day</strong>. With one nightly build, a red build leaves 12 suspect commits to search. With a build per commit (slide 58), the red build points at <strong>exactly 1 commit</strong> and its author is notified within minutes (step 4b) — the "earlier detection and root-cause analysis" benefit of slide 63 in numbers.</p>
<div class="pitfall"><b>CI traps.</b> (1) "With CI, manual testing is no longer needed" — false (slide 59 notes). (2) "CI integrates changes once per sprint" — false: at least daily. (3) "The biggest CI risk is too much system testing" — reversed: the risk is <em>over-reliance on unit tests</em> and too little system and acceptance testing.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>From CI to continuous delivery and "shift-left" security.</b> Modern pipelines (GitHub Actions, GitLab CI, Jenkins) extend CI into <em>continuous delivery</em> — every green build is releasable — and add quality gates: static analysis thresholds, dependency vulnerability scans (SCA), secret detection and container scanning, all before a human sees the build. Pipelines typically fail fast: compile and unit tests in the first minutes, slower integration and UI tests later in parallel stages. <em>Outside the syllabus because CTFL-AT (2014) describes CI only up to automatic deployment and does not cover pipeline design or DevSecOps.</em></div>`,
      `<h3>Ví dụ có lời giải · Bài tập — soát INVEST cho chính story trên slide, rồi thấy vì sao CI phải chạy theo từng commit</h3>
<p><b>Phần A. "Là Mary, tôi muốn nhận phản hồi cho mọi thao tác nhập trong vòng dưới một giây" có phải story tốt?</b></p>
<table>
<thead><tr><th>Chữ</th><th>Kết luận</th><th>Lý do / cách sửa</th></tr></thead>
<tbody>
<tr><td>I — Độc lập</td><td>⚠</td><td>"Mọi thao tác" đụng tới mọi màn hình, nên phụ thuộc mọi story khác. Sửa: gắn nó như một <em>ràng buộc</em> hiệu năng vào các story liên quan (tìm kiếm, đặt chỗ), hoặc vào Definition of Done.</td></tr>
<tr><td>N — Thương lượng được</td><td>✔</td><td>1 giây, 50 người dùng đều bàn lại được với nghiệp vụ.</td></tr>
<tr><td>V — Có giá trị</td><td>✔</td><td>Phản hồi chậm làm mất khách.</td></tr>
<tr><td>E — Ước lượng được</td><td>⚠</td><td>Không biết thao tác nào, môi trường nào thì đội không ước được.</td></tr>
<tr><td>S — Nhỏ</td><td>✘</td><td>"Mọi thao tác" không phải khối việc của một iteration.</td></tr>
<tr><td>T — Kiểm thử được</td><td>✔</td><td>Nhờ acceptance criteria: đo cái gì (bấm/gõ → phản hồi hiện ra) và dưới tải nào (50 người dùng, không có giao dịch đặt chỗ khác). Thiếu chúng thì trượt chữ T.</td></tr>
</tbody>
</table>
<p>Câu hỏi mở của tester (slide 51): Tính theo mọi phản hồi hay phân vị 95%? Đo trên mạng và thiết bị nào? Còn lần tải trang đầu tiên? Nếu lâu hơn thì người dùng thấy gì? Viết lại: <em>"Là Mary, tôi muốn có kết quả tìm kiếm trong vòng 1 giây để so sánh chuyến bay nhanh"</em> với tiêu chí "phân vị 95 ≤ 1,0 giây với 50 người dùng đang hoạt động trên máy chủ staging; đo từ lúc bấm Search tới lúc danh sách kết quả hiện ra".</p>
<p><b>Phần B. Vì sao phải tích hợp ít nhất mỗi ngày?</b> Ba developer, mỗi người commit khoảng 4 lần/ngày = <strong>12 commit/ngày</strong>. Chỉ build một lần ban đêm thì khi build đỏ phải lục 12 commit bị nghi. Build theo từng commit (slide 58) thì build đỏ chỉ thẳng vào <strong>đúng 1 commit</strong> và tác giả được báo trong vài phút (bước 4b) — lợi ích "phát hiện và phân tích nguyên nhân sớm" của slide 63 bằng con số.</p>
<div class="pitfall"><b>Bẫy về CI.</b> (1) "Có CI thì không cần test tay" — sai (ghi chú slide 59). (2) "CI tích hợp thay đổi mỗi sprint một lần" — sai: ít nhất mỗi ngày. (3) "Rủi ro lớn nhất của CI là làm quá nhiều system test" — ngược: rủi ro là <em>quá tin unit test</em> và làm quá ít system test, acceptance test.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Từ CI tới continuous delivery và bảo mật "dời sang trái".</b> Pipeline hiện đại (GitHub Actions, GitLab CI, Jenkins) mở rộng CI thành <em>continuous delivery</em> — mọi bản build xanh đều phát hành được — và thêm các cổng chất lượng: ngưỡng phân tích tĩnh, quét lỗ hổng thư viện (SCA), dò lộ khoá bí mật, quét container, tất cả trước khi có người nhìn thấy bản build. Pipeline thường "hỏng sớm": biên dịch và unit test trong mấy phút đầu, integration test và UI test chậm hơn chạy song song ở các chặng sau. <em>Ngoài giáo trình vì CTFL-AT (2014) chỉ mô tả CI tới bước triển khai tự động, không bàn thiết kế pipeline hay DevSecOps.</em></div>`),
    books([
      ['agile', 'ISTQB Agile Tester in a Nutshell — p.15 (Agile testers "help business stakeholders define understandable and testable user stories and acceptance criteria", "assist in test automation"), p.17 (objectives FA-1.2.2 to 1.2.4)', 'ISTQB Agile Tester in a Nutshell — tr.15 (tester Agile "giúp các bên nghiệp vụ định nghĩa user story và acceptance criteria dễ hiểu, kiểm thử được", "hỗ trợ tự động hoá test"), tr.17 (chuẩn FA-1.2.2 tới 1.2.4)'],
      ['sp5', '§3.2, PDF p.84 — continuous testing and test automation in agile projects; Chapter 4 Static testing, §4.5 success factors for reviews, PDF p.150 (the retrospective success factors of slide 56 mirror them)', '§3.2, PDF tr.84 — continuous testing và tự động hoá test trong dự án Agile; Chương 4 Kiểm thử tĩnh, §4.5 yếu tố thành công của review, PDF tr.150 (yếu tố thành công của retrospective ở slide 56 phản chiếu đúng mục này)'],
      ['junit', 'Ch.13 Continuous integration with JUnit 5, PDF p.254 — setting up a CI server that runs the JUnit suite on every commit', 'Ch.13 Continuous integration with JUnit 5, PDF tr.254 — dựng CI server chạy bộ JUnit ở mỗi commit'],
    ]),
  ].join('\n'),
};

/* ───────────────── 9.4 Release and iteration planning ───────────────── */
const L94 = {
  title: '9.4 — Release and iteration planning: where the tester adds value|||9.4 — Release planning và iteration planning: tester đóng góp ở đâu',
  slug: 'swt301-agile-release-iteration-planning',
  type: 'VIDEO',
  description: 'Topic 8 slide 65–74: lập kế hoạch Agile (tầm nhìn → roadmap → release → iteration → stand-up), 3 loại backlog, release planning vs iteration planning, việc của tester trong từng loại, lập lại kế hoạch — kèm bài tập chọn story theo velocity và chia task có giờ.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lesson 9.4 · Topic 8 slides 65–74</span>
<h2>Agile planning — two levels, and a tester at both</h2>
<p class="lead">Agile teams do plan — continuously and at two levels. <strong>Release planning</strong> looks months ahead and decides <em>which</em> features go into a release; <strong>iteration planning</strong> looks one sprint ahead and decides <em>how</em> the selected stories become tasks. Testers are not guests in these meetings: they define testability, analyse risks, estimate testing effort and make sure testing tasks are on the plan.</p>
<div class="callout"><b>Learning objective.</b> FA-1.2.5 Know the differences between iteration and release planning, and how a tester adds value in each of these activities (K1).</div>
<table>
<thead><tr><th></th><th>Release planning</th><th>Iteration planning</th></tr></thead>
<tbody>
<tr><td>Horizon</td><td>The whole release — often a few months ahead</td><td>One iteration (1–4 weeks), held before each iteration</td></tr>
<tr><td>Backlog</td><td>Defines / re-defines the <em>product</em> backlog → release backlog</td><td>Pulls stories from the release backlog into the <em>iteration</em> backlog</td></tr>
<tr><td>Level of detail</td><td>High-level: stories, risks, high-level effort estimation</td><td>Detailed: stories elaborated, risk-analysed, broken into tasks (≈ ≤ 1 day each)</td></tr>
<tr><td>Tester adds</td><td>Testable stories + high-level acceptance criteria, project &amp; quality risk analysis, test effort per story, test levels, release test plan</td><td>Detailed risk analysis, testability check, acceptance tests, testing tasks, task estimates, functional &amp; non-functional aspects, automation support</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 9 · Bài 9.4 · Topic 8 slide 65–74</span>
<h2>Lập kế hoạch Agile — hai tầng, tầng nào cũng có tester</h2>
<p class="lead">Đội Agile vẫn lập kế hoạch — liên tục và ở hai tầng. <strong>Release planning</strong> nhìn trước vài tháng và quyết <em>tính năng nào</em> vào một bản phát hành; <strong>iteration planning</strong> nhìn trước một sprint và quyết các story đã chọn biến thành task <em>như thế nào</em>. Tester không phải khách mời trong các buổi này: họ xác định tính kiểm thử được, phân tích rủi ro, ước lượng công sức test và bảo đảm việc test có mặt trong kế hoạch.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> FA-1.2.5 Biết khác biệt giữa iteration planning và release planning, và tester đóng góp giá trị gì trong mỗi hoạt động (K1).</div>
<table>
<thead><tr><th></th><th>Release planning</th><th>Iteration planning</th></tr></thead>
<tbody>
<tr><td>Tầm nhìn</td><td>Cả bản phát hành — thường vài tháng trước</td><td>Một iteration (1–4 tuần), họp trước mỗi iteration</td></tr>
<tr><td>Backlog</td><td>Định nghĩa / định nghĩa lại <em>product</em> backlog → release backlog</td><td>Kéo story từ release backlog vào <em>iteration</em> backlog</td></tr>
<tr><td>Mức chi tiết</td><td>Mức cao: story, rủi ro, ước lượng công sức mức cao</td><td>Chi tiết: story được làm rõ, phân tích rủi ro, chia task (mỗi task ≈ ≤ 1 ngày)</td></tr>
<tr><td>Tester đóng góp</td><td>Story kiểm thử được + acceptance criteria mức cao, phân tích rủi ro dự án &amp; chất lượng, công sức test mỗi story, các cấp test, kế hoạch test cho release</td><td>Phân tích rủi ro chi tiết, soát tính kiểm thử được, acceptance test, task kiểm thử, ước lượng task, khía cạnh chức năng &amp; phi chức năng, hỗ trợ tự động hoá</td></tr>
</tbody>
</table>`),
    walkHead(D, 65, 74),
    walk(D, [
      [65, 'Agile Planning',
        `<p><strong>Planning is an ongoing activity</strong> in Agile — not a phase done once at the start. Agile lifecycles have <strong>two types of planning: release planning and iteration planning</strong>. Keep both names exactly: exam options sometimes invent "sprint release planning" or "test planning" as a third Agile planning type.</p>`,
        `<p>Trong Agile <strong>lập kế hoạch là hoạt động diễn ra liên tục</strong> — không phải một pha làm một lần ở đầu. Vòng đời Agile có <strong>hai loại lập kế hoạch: release planning và iteration planning</strong>. Nhớ đúng hai tên này: đề thi đôi khi bịa ra "sprint release planning" hay "test planning" như loại kế hoạch Agile thứ ba.</p>`],
      [66, 'Planning onion: vision, roadmap, release, iteration, daily stand-up',
        `<p>The concentric circles (the "planning onion") go from the widest, longest horizon to the shortest: <strong>Product Vision</strong> → <strong>Product Roadmap</strong> → <strong>Release Plan</strong> → <strong>Iteration Plan</strong> → <strong>Daily Stand-up</strong>. In the rendered slide the explanation boxes on the right overlap each other; their text is: <em>Product vision</em> — where the product is expected to get to at a high level: the goal the organisation aims at, which problems the product solves, which ambitions it fulfils. <em>Product roadmap</em> — a high-level visual summary of the vision and direction over time; it communicates the <em>why</em> and the <em>what</em> and shows how to reach the vision. <em>Release plan</em> — the result of the highest-level Agile planning; answers "<strong>when will we deliver what</strong> (which features)?". <em>Iteration plan</em> — the event where the team decides how much of the backlog it can commit to in the upcoming iteration/sprint. <em>Daily stand-up</em> — a short daily meeting: what did I do yesterday, what will I do today, do I have impediments or blockers?</p>`,
        `<p>Các vòng tròn đồng tâm ("củ hành kế hoạch") đi từ tầm nhìn rộng và dài nhất tới ngắn nhất: <strong>Product Vision</strong> → <strong>Product Roadmap</strong> → <strong>Release Plan</strong> → <strong>Iteration Plan</strong> → <strong>Daily Stand-up</strong>. Trên slide, các ô chú thích bên phải bị chồng lên nhau; nội dung của chúng là: <em>Tầm nhìn sản phẩm</em> — sản phẩm muốn đi tới đâu ở mức cao: mục tiêu tổ chức hướng tới, vấn đề sản phẩm giải quyết, tham vọng nó thực hiện. <em>Lộ trình sản phẩm</em> — bản tóm tắt trực quan mức cao về tầm nhìn và hướng đi theo thời gian; nó truyền đạt <em>vì sao</em> và <em>cái gì</em>, và chỉ ra cách đạt tầm nhìn. <em>Release plan</em> — kết quả của tầng lập kế hoạch cao nhất trong Agile; trả lời "<strong>khi nào giao cái gì</strong> (tính năng nào)?". <em>Iteration plan</em> — buổi đội quyết định có thể cam kết bao nhiêu phần backlog cho iteration/sprint tới. <em>Daily stand-up</em> — cuộc họp ngắn mỗi ngày: hôm qua tôi làm gì, hôm nay làm gì, có trở ngại hay vướng mắc gì không?</p>`],
      [67, 'Backlogs',
        `<p>Three backlogs and two planning steps: the <strong>product backlog</strong> (yellow — all prioritised high-level features from the roadmap, no dates) → <strong>release planning</strong> cuts it into <strong>release backlogs</strong> (green — one per release) → <strong>iteration planning</strong> pulls items into <strong>iteration backlogs</strong> (pink — one per iteration), refining them and breaking each item into tasks. The notes: the product backlog alone says nothing about <em>when</em> a feature ships — that is decided in release planning; one release = one release plan, and each release consists of several iterations.</p>`,
        `<p>Ba loại backlog và hai bước lập kế hoạch: <strong>product backlog</strong> (vàng — mọi tính năng mức cao đã xếp ưu tiên từ roadmap, chưa có ngày) → <strong>release planning</strong> cắt nó thành các <strong>release backlog</strong> (xanh — mỗi release một cái) → <strong>iteration planning</strong> kéo hạng mục vào các <strong>iteration backlog</strong> (hồng — mỗi iteration một cái), làm rõ và chia mỗi hạng mục thành task. Ghi chú: riêng product backlog không cho biết <em>khi nào</em> tính năng ra mắt — việc đó quyết ở release planning; một release = một release plan, và mỗi release gồm nhiều iteration.</p>`],
      [68, 'Release Planning',
        `<p>Release planning <strong>looks ahead to the release of a product</strong>, often a few months ahead of the start of a project. It <strong>defines or re-defines the product backlog</strong> — may refine large stories (epics) into smaller ones; business representatives and the team establish and prioritise the stories for the release. It <strong>provides the basis for the test approach and test planning for all iterations</strong>. Based on the stories, <strong>project and quality risks are identified and a high-level effort estimation is performed</strong> ("perform" on the slide should read "performed"). Release plans are high-level.</p>`,
        `<p>Release planning <strong>nhìn trước tới lúc phát hành sản phẩm</strong>, thường vài tháng trước khi dự án bắt đầu. Nó <strong>định nghĩa hoặc định nghĩa lại product backlog</strong> — có thể tách story lớn (epic) thành story nhỏ; đại diện nghiệp vụ và đội chốt và xếp ưu tiên story cho release. Nó <strong>là nền cho cách tiếp cận kiểm thử và kế hoạch test của mọi iteration</strong>. Dựa trên các story, <strong>rủi ro dự án và rủi ro chất lượng được xác định, và ước lượng công sức mức cao được thực hiện</strong> (chữ "perform" trên slide đúng ra là "performed"). Release plan ở mức cao.</p>`],
      [69, 'Testers in Release Planning',
        `<p>Testers are involved in release planning and add value especially in: <strong>defining testable user stories, including high-level acceptance criteria</strong>; <strong>participating in project and quality risk analysis</strong>; <strong>estimating testing effort associated with the stories</strong>; <strong>defining the necessary test levels</strong>; <strong>planning the testing for the release</strong>. Memory hook — the five are all "big picture": stories, risks, effort, levels, plan.</p>`,
        `<p>Tester tham gia release planning và đóng góp nhất ở: <strong>định nghĩa user story kiểm thử được, gồm acceptance criteria mức cao</strong>; <strong>tham gia phân tích rủi ro dự án và rủi ro chất lượng</strong>; <strong>ước lượng công sức kiểm thử gắn với các story</strong>; <strong>xác định các cấp kiểm thử cần thiết</strong>; <strong>lập kế hoạch kiểm thử cho release</strong>. Mẹo nhớ — cả năm đều là "bức tranh lớn": story, rủi ro, công sức, cấp test, kế hoạch.</p>`],
      [70, 'Iteration Planning',
        `<p>Iteration planning <strong>takes place before each iteration</strong>, looks ahead to the end of a single iteration and is concerned with the <strong>iteration backlog</strong>. The team <strong>selects stories, elaborates them, performs risk analysis and estimates the work</strong>. A story <strong>can be refused</strong> by the team if it is vague and the business representatives fail to clarify it (this is how testability is enforced). The number of stories selected depends on the team's <strong>established velocity</strong> and the <strong>size</strong> of the stories. Selected stories are <strong>broken into tasks</strong> carried out by the team. The notes add a rule of thumb: each task should be small enough to finish in <strong>one working day</strong>, and a working day means about <strong>6 hours of production per person</strong> — the rest goes to meetings, discussions, learning.</p>`,
        `<p>Iteration planning <strong>diễn ra trước mỗi iteration</strong>, nhìn tới cuối một iteration duy nhất và làm việc với <strong>iteration backlog</strong>. Đội <strong>chọn story, làm rõ, phân tích rủi ro và ước lượng công việc</strong>. Đội <strong>có thể từ chối</strong> một story nếu nó mơ hồ và đại diện nghiệp vụ không làm rõ được (đây là cách bảo đảm tính kiểm thử được). Số story được chọn phụ thuộc <strong>velocity đã ổn định</strong> của đội và <strong>kích thước</strong> story. Story được chọn sẽ <strong>chia thành task</strong> do đội thực hiện. Ghi chú thêm một quy tắc ngón tay cái: mỗi task nên đủ nhỏ để xong trong <strong>một ngày làm việc</strong>, và một ngày làm việc nghĩa là khoảng <strong>6 giờ sản xuất mỗi người</strong> — thời gian còn lại dành cho họp, trao đổi, học hỏi.</p>`],
      [71, 'Testers in Iteration Planning',
        `<p>In iteration planning testers add value by: <strong>participating in detailed risk analysis of stories</strong>; <strong>determining the testability of stories</strong>; <strong>creating acceptance tests for the stories</strong>; <strong>breaking stories down into tasks (particularly testing tasks)</strong>; <strong>estimating testing effort for all testing tasks</strong>; <strong>identifying functional and non-functional aspects to be tested</strong>; <strong>supporting and participating in test automation at multiple test levels</strong>. Compare with slide 69: here everything is <em>detailed</em> and per story/task. A typical K1 question gives one activity and asks "release or iteration planning?" — "estimating testing effort for testing <em>tasks</em>" → iteration; "defining the necessary test <em>levels</em>" → release.</p>`,
        `<p>Trong iteration planning tester đóng góp bằng cách: <strong>tham gia phân tích rủi ro chi tiết của story</strong>; <strong>xác định tính kiểm thử được của story</strong>; <strong>tạo acceptance test cho story</strong>; <strong>chia story thành task (đặc biệt là task kiểm thử)</strong>; <strong>ước lượng công sức cho mọi task kiểm thử</strong>; <strong>xác định khía cạnh chức năng và phi chức năng cần test</strong>; <strong>hỗ trợ và tham gia tự động hoá test ở nhiều cấp</strong>. So với slide 69: ở đây mọi thứ đều <em>chi tiết</em> và theo từng story/task. Câu K1 điển hình đưa một hoạt động và hỏi "release hay iteration planning?" — "ước lượng công sức cho các <em>task</em> kiểm thử" → iteration; "xác định các <em>cấp</em> test cần thiết" → release.</p>`],
      [72, 'Release and Iteration Planning Address Test Planning',
        `<p>Together, the two planning levels cover what a test plan covers (lesson 5.x): <strong>testing scope</strong> (extent of testing and test goals); <strong>the team members who will do the test activities</strong>; <strong>test environment and test data needed</strong> (when they are needed and expected changes); <strong>scheduling functional and non-functional test activities</strong> (frequency, dependencies, relation to development); <strong>project and quality risks to be addressed</strong>. And the team's estimate <strong>must include the time and effort for the required testing</strong> — a story estimated without its testing is under-estimated.</p>`,
        `<p>Gộp lại, hai tầng lập kế hoạch bao trùm những gì một test plan bao trùm (Chương 5): <strong>phạm vi kiểm thử</strong> (mức độ kiểm thử và mục tiêu test); <strong>thành viên nào làm các hoạt động kiểm thử</strong>; <strong>môi trường test và dữ liệu test cần có</strong> (khi nào cần và thay đổi dự kiến); <strong>lịch các hoạt động test chức năng và phi chức năng</strong> (tần suất, phụ thuộc, quan hệ với việc phát triển); <strong>rủi ro dự án và chất lượng cần xử lý</strong>. Và ước lượng của đội <strong>phải gồm thời gian và công sức cho việc kiểm thử cần làm</strong> — story ước lượng mà bỏ quên phần test là ước thiếu.</p>`],
      [73, 'Re-planning Releases and Iterations',
        `<p>Releases and iterations <strong>may change</strong> — that is adaptability. <strong>Release re-planning</strong> happens when individual stories change because of <strong>internal factors</strong> (delivery capability, velocity, technical issues) or <strong>external factors</strong> (new markets or opportunities, competitors, threats). <strong>Iteration re-planning</strong> happens for reasons such as a story estimated as simple turning out more complex than expected. Exam reflex: "velocity dropped" = internal; "a competitor launched the same feature" = external.</p>`,
        `<p>Release và iteration <strong>có thể thay đổi</strong> — đó là tính thích nghi. <strong>Lập lại release plan</strong> khi từng story thay đổi do <strong>yếu tố bên trong</strong> (năng lực giao hàng, velocity, vấn đề kỹ thuật) hoặc <strong>yếu tố bên ngoài</strong> (thị trường hay cơ hội mới, đối thủ, mối đe doạ). <strong>Lập lại iteration plan</strong> vì những lý do như một story tưởng đơn giản hoá ra phức tạp hơn dự kiến. Phản xạ khi thi: "velocity giảm" = bên trong; "đối thủ ra mắt đúng tính năng đó" = bên ngoài.</p>`],
      [74, 'Re-planning Challenges Testers',
        `<p>What changing plans means for testers: <strong>understanding the big picture of a release</strong> for test planning; having an <strong>adequate test basis and test oracle in each iteration</strong> for test development (stories change, so expected results change); <strong>embracing changes</strong> (not treating each change as an attack); and <strong>deciding test strategies and how much documentation</strong> to keep. Practical answer: keep tests close to the stories (acceptance criteria and automated scenarios as living documentation), so a changed story updates its tests in the same place.</p>`,
        `<p>Kế hoạch thay đổi có ý nghĩa gì với tester: <strong>hiểu bức tranh lớn của release</strong> để lập kế hoạch test; có <strong>test basis và test oracle đầy đủ trong mỗi iteration</strong> để phát triển test (story đổi thì kết quả mong đợi đổi); <strong>đón nhận thay đổi</strong> (không coi mỗi thay đổi là một đòn tấn công); và <strong>quyết định chiến lược test và mức tài liệu</strong> cần giữ. Lời giải thực tế: giữ test sát với story (acceptance criteria và kịch bản tự động như tài liệu sống), để story đổi thì test đổi ngay tại cùng một chỗ.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — fill the next sprint by velocity, then plan the testing tasks</h3>
<p>The FU Bookstore team finished <strong>21, 18 and 24</strong> story points in its last three sprints. The release backlog (already estimated with planning poker, lesson 9.7) is ordered by the PO:</p>
<table>
<thead><tr><th>Order</th><th>Story</th><th>Points</th><th>Running total</th></tr></thead>
<tbody>
<tr><td>1</td><td>US-17 Free shipping from 500,000 VND</td><td>5</td><td>5</td></tr>
<tr><td>2</td><td>US-12 Pay by MoMo e-wallet</td><td>8</td><td>13</td></tr>
<tr><td>3</td><td>US-20 Order history</td><td>5</td><td>18</td></tr>
<tr><td>4</td><td>US-09 Reset password by e-mail</td><td>3</td><td><strong>21</strong></td></tr>
<tr><td>5</td><td>US-22 Wishlist</td><td>5</td><td>26 — over capacity</td></tr>
</tbody>
</table>
<ol>
<li><strong>Velocity</strong> = average of the last sprints = (21 + 18 + 24) ÷ 3 = <strong>21 points</strong>.</li>
<li>Take stories in PO order while the total stays ≤ 21: 5 + 8 + 5 + 3 = <strong>21</strong>. US-22 would make 26 → it stays in the release backlog.</li>
<li><strong>Break a story into tasks</strong> (slide 70) — US-17, with the tester's tasks visible on the board: code the fee rule with TDD 6 h · write the Gherkin acceptance tests with the PO 2 h · automate the 3 scenarios 4 h · exploratory session on checkout 1.5 h · regression run of checkout 2 h → <strong>15.5 h</strong>. Every task ≤ 1 day (≤ 6 productive hours).</li>
<li><strong>Check testing capacity</strong>: 2 testers × 9 working days × 6 productive hours = <strong>108 h</strong> for the sprint. If the testing tasks of all four stories add up to more than that, the team must drop a story or move testing work to developers — deciding this <em>now</em> is exactly "estimation includes testing effort" (slide 72).</li>
</ol>
<p><em>Numbers checked with a script: average 21, selection 21 of 21, US-17 tasks 15.5 h, capacity 108 h.</em></p>
<div class="pitfall"><b>Release vs iteration — who and what.</b> "Business representatives with the team prioritise stories for the release" → release planning. "The team may refuse a vague story; stories are broken into tasks" → iteration planning. "Defining the test levels" → release; "estimating each testing task" → iteration. And velocity is an <em>input</em> to iteration planning, not a target to raise by overtime (principle 8).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Definition of Ready and probabilistic forecasting.</b> Many teams add a <em>Definition of Ready</em> — a checklist a story must meet before it may enter iteration planning (INVEST-checked, acceptance criteria agreed, test data known, dependencies resolved). It formalises slide 70's "the team may refuse a vague story". At release level, instead of dividing remaining points by one average velocity, teams increasingly run Monte Carlo simulations over their historic throughput ("85 % chance to finish by 30 November"), which communicates uncertainty honestly. <em>Outside the syllabus because CTFL-AT only asks what happens in release and iteration planning, not how to forecast.</em></div>`,
      `<h3>Ví dụ có lời giải · Bài tập — lấp sprint kế tiếp theo velocity, rồi lên kế hoạch task kiểm thử</h3>
<p>Đội FU Bookstore hoàn thành <strong>21, 18 và 24</strong> story point trong ba sprint gần nhất. Release backlog (đã ước lượng bằng planning poker, bài 9.7) được PO xếp thứ tự:</p>
<table>
<thead><tr><th>Thứ tự</th><th>Story</th><th>Point</th><th>Cộng dồn</th></tr></thead>
<tbody>
<tr><td>1</td><td>US-17 Miễn phí vận chuyển từ 500.000 đ</td><td>5</td><td>5</td></tr>
<tr><td>2</td><td>US-12 Thanh toán bằng ví MoMo</td><td>8</td><td>13</td></tr>
<tr><td>3</td><td>US-20 Lịch sử đơn hàng</td><td>5</td><td>18</td></tr>
<tr><td>4</td><td>US-09 Đặt lại mật khẩu qua e-mail</td><td>3</td><td><strong>21</strong></td></tr>
<tr><td>5</td><td>US-22 Danh sách yêu thích</td><td>5</td><td>26 — vượt năng lực</td></tr>
</tbody>
</table>
<ol>
<li><strong>Velocity</strong> = trung bình các sprint gần nhất = (21 + 18 + 24) ÷ 3 = <strong>21 point</strong>.</li>
<li>Lấy story theo thứ tự của PO khi tổng còn ≤ 21: 5 + 8 + 5 + 3 = <strong>21</strong>. Thêm US-22 thành 26 → nó ở lại release backlog.</li>
<li><strong>Chia story thành task</strong> (slide 70) — US-17, có task của tester hiện rõ trên bảng: code quy tắc phí bằng TDD 6 giờ · viết acceptance test Gherkin cùng PO 2 giờ · tự động hoá 3 kịch bản 4 giờ · một phiên exploratory trên trang thanh toán 1,5 giờ · chạy hồi quy phần thanh toán 2 giờ → <strong>15,5 giờ</strong>. Mọi task ≤ 1 ngày (≤ 6 giờ sản xuất).</li>
<li><strong>Soát năng lực kiểm thử</strong>: 2 tester × 9 ngày làm việc × 6 giờ sản xuất = <strong>108 giờ</strong> cho sprint. Nếu task kiểm thử của cả bốn story cộng lại vượt con số đó, đội phải bớt một story hoặc chuyển bớt việc test cho developer — quyết định việc này <em>ngay lúc này</em> chính là "ước lượng phải gồm công sức test" (slide 72).</li>
</ol>
<p><em>Các con số đã được kiểm bằng script: trung bình 21, chọn 21/21, task US-17 là 15,5 giờ, năng lực 108 giờ.</em></p>
<div class="pitfall"><b>Release hay iteration — ai và cái gì.</b> "Đại diện nghiệp vụ cùng đội xếp ưu tiên story cho release" → release planning. "Đội có thể từ chối story mơ hồ; story được chia thành task" → iteration planning. "Xác định các cấp test" → release; "ước lượng từng task kiểm thử" → iteration. Và velocity là <em>đầu vào</em> của iteration planning, không phải chỉ tiêu để đẩy lên bằng tăng ca (nguyên tắc 8).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Definition of Ready và dự báo xác suất.</b> Nhiều đội thêm <em>Definition of Ready</em> — checklist một story phải đạt trước khi được đưa vào iteration planning (đã soát INVEST, acceptance criteria đã thống nhất, biết dữ liệu test, đã gỡ phụ thuộc). Nó chính thức hoá câu "đội có thể từ chối story mơ hồ" ở slide 70. Ở tầng release, thay vì chia số point còn lại cho một velocity trung bình, các đội ngày càng chạy mô phỏng Monte Carlo trên throughput lịch sử ("85% khả năng xong trước 30/11"), cách này nói thật về độ bất định. <em>Ngoài giáo trình vì CTFL-AT chỉ hỏi release và iteration planning gồm những gì, không hỏi cách dự báo.</em></div>`),
    books([
      ['agile', 'ISTQB Agile Tester in a Nutshell — p.15 ("support the agile team in planning test related activities"), p.17 (FA-1.2.5 iteration vs release planning), p.19 ("estimate testing effort based on iteration content and product quality risks")', 'ISTQB Agile Tester in a Nutshell — tr.15 ("hỗ trợ đội Agile lập kế hoạch các hoạt động kiểm thử"), tr.17 (FA-1.2.5 iteration vs release planning), tr.19 ("ước lượng công sức test dựa trên nội dung iteration và rủi ro chất lượng")'],
      ['sp5', 'Chapter 6 Test management, "Our Tip — estimating testing effort for agile projects", PDF p.270 (team velocity and planning poker); test progress reporting in agile projects, PDF p.283 (task boards, defect backlogs, burndown charts in daily stand-ups)', 'Chương 6 Quản lý kiểm thử, mục "Our Tip — estimating testing effort for agile projects", PDF tr.270 (velocity của đội và planning poker); báo cáo tiến độ test trong dự án Agile, PDF tr.283 (task board, defect backlog, burndown chart trong daily stand-up)'],
    ]),
  ].join('\n'),
};

/* ───────────────── 9.5 Testing in Agile (syllabus chapter 2, no slides) ───────────────── */
const BURNDOWN_SVG = `<svg viewBox="0 0 580 280" width="100%" style="max-width:580px" role="img" aria-label="Sprint burndown: ideal line from 21 to 0 over 10 days; actual 21,21,21,16,16,16,8,8,5,5,5">
<g stroke="#8a8f98" stroke-width="1" fill="none"><line x1="40" y1="20" x2="40" y2="230"/><line x1="40" y1="230" x2="540" y2="230"/></g>
<g fill="#8a8f98" font-size="11" font-family="system-ui"><text x="10" y="24">21</text><text x="10" y="129">10.5</text><text x="22" y="234">0</text>
<text x="36" y="248">0</text><text x="136" y="248">2</text><text x="236" y="248">4</text><text x="336" y="248">6</text><text x="436" y="248">8</text><text x="530" y="248">10</text><text x="250" y="268">day of sprint</text></g>
<line x1="40" y1="20" x2="540" y2="230" stroke="#3b82f6" stroke-width="2" stroke-dasharray="6 4"/>
<polyline points="40,20 90,20 140,20 190,70 240,70 290,70 340,150 390,150 440,180 490,180 540,180" fill="none" stroke="#f97316" stroke-width="3"/>
<g fill="#f97316"><circle cx="190" cy="70" r="4"/><circle cx="340" cy="150" r="4"/><circle cx="440" cy="180" r="4"/></g>
<g font-size="11" font-family="system-ui"><text x="196" y="64" fill="#f97316">US-17 Done</text><text x="346" y="144" fill="#f97316">US-12 Done</text><text x="446" y="174" fill="#f97316">US-09 Done</text>
<text x="420" y="214" fill="#3b82f6">ideal</text><text x="470" y="198" fill="#f97316">actual: 5 left</text></g>
</svg>`;

const L95 = {
  title: '9.5 — Testing in Agile: differences, test status, regression risk, the tester\'s role and skills|||9.5 — Kiểm thử trong Agile: khác biệt, trạng thái test, rủi ro hồi quy, vai trò và kỹ năng tester',
  slug: 'swt301-agile-testing-status-roles',
  type: 'DOCUMENT',
  description: 'Bài bổ sung (chương 2 syllabus Agile Tester, không có slide): khác biệt kiểm thử truyền thống vs Agile, sản phẩm công việc, cấp test, tính độc lập, burndown chart và task board, quản lý rủi ro hồi quy bằng tự động hoá, kỹ năng và vai trò tester — kèm bài tập đọc burndown.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lesson 9.5 · Agile Tester syllabus chapter 2 (not on the slides)</span>
<h2>Fundamental Agile testing principles, practices and processes</h2>
<p class="lead">Deck slide 2 lists this chapter but no slide teaches it, so this lesson is written from the syllabus objectives printed in the Nutshell book (p.18). It answers three questions: <strong>how is testing different</strong> in an Agile project, <strong>how does the team see test status</strong> (burndown chart, task board, stand-up) and keep <strong>regression risk</strong> under control, and <strong>what does an Agile tester do and need to know</strong>.</p>
<div class="callout"><b>Learning objectives (syllabus chapter 2).</b> FA-2.1.1 Describe the differences between testing activities in Agile and non-Agile projects (K2) · FA-2.1.2 Describe how development and testing activities are integrated in Agile projects (K2) · FA-2.1.3 Describe the role of independent testing in Agile projects (K2) · FA-2.2.1 Describe the tools and techniques used to communicate test status, including progress and product quality (K2) · FA-2.2.2 Describe the process of evolving tests across multiple iterations and explain why test automation is important to manage regression risk (K2) · FA-2.3.1 Understand the skills of a tester in an Agile team (K2) · FA-2.3.2 Understand the role of a tester within an Agile team (K2).</div>
<h3>1. How testing differs — traditional vs Agile</h3>
<table>
<thead><tr><th>Aspect</th><th>Traditional (sequential)</th><th>Agile</th></tr></thead>
<tbody>
<tr><td>When testing happens</td><td>A phase after development; test levels in sequence</td><td>Inside every iteration, in parallel with coding; test levels overlap</td></tr>
<tr><td>Who tests</td><td>A separate test team</td><td>The whole team: developers write unit tests, testers lead acceptance, exploratory and non-functional testing, business people validate</td></tr>
<tr><td>Test basis</td><td>Complete, signed requirement documents</td><td>User stories + acceptance criteria + conversations; the basis changes each iteration</td></tr>
<tr><td>Documentation</td><td>Detailed test plans and test case specifications</td><td>Lightweight: test strategy, quality risk list, charters, automated tests as living documentation (more formal in regulated/safety-critical contexts)</td></tr>
<tr><td>Regression</td><td>A regression cycle before release</td><td>Continuous, mostly automated, run in CI every day</td></tr>
<tr><td>Tester's relation to developers</td><td>Hand-over at the end; "us vs them" risk</td><td>Pairing, early feedback, shared Definition of Done</td></tr>
</tbody>
</table>
<p><strong>How coding and testing are integrated (FA-2.1.2).</strong> Within one iteration, a story passes through <em>verification</em> and <em>validation</em> at several levels: <strong>unit tests</strong> (often written by developers, ideally test-first), <strong>feature verification</strong> against the acceptance criteria (often automated, by developers or testers), <strong>feature validation</strong> (usually manual, with business stakeholders: does it really solve the user's need?), plus <strong>parallel regression testing</strong> of everything already delivered, and <strong>system-level non-functional testing</strong> where needed. Acceptance testing can happen at the end of every iteration, after a few, or before release (alpha, beta, UAT, operational acceptance). Some teams add a "hardening" or stabilisation iteration before a release — but the goal is to avoid building up <strong>technical debt</strong> that such an iteration would have to pay off.</p>
<p><strong>Work products (FA-2.1.1).</strong> Three kinds: <em>business-oriented</em> (user stories, acceptance criteria, epics), <em>development</em> (code, unit tests, CI scripts) and <em>test</em> work products (automated acceptance tests, test charters and notes of exploratory sessions, a quality-risk catalogue, defect reports, test result logs, test metrics). Test plans exist, but short.</p>
<p><strong>Independent testing (FA-2.1.3).</strong> A tester embedded in the team is close to the work — and at risk of <em>losing independence</em>: adopting the developers' assumptions ("going native"), becoming tolerant of weak practices. The syllabus names three organisational options: (1) independent testers <em>embedded</em> in the Agile team; (2) an <em>independent test team outside</em> the Agile teams that does longer-term, cross-team work (system integration, non-functional, end-to-end tests), with testers assigned to Agile teams; (3) testers from an independent test organisation assigned to a team for the project, keeping their reporting line outside it. Compare lesson 5.1 (levels of independence).</p>`,
    `<span class="eyebrow">Chương 9 · Bài 9.5 · Chương 2 syllabus Agile Tester (không có trên slide)</span>
<h2>Nguyên tắc, thực hành và quy trình kiểm thử Agile cơ bản</h2>
<p class="lead">Slide 2 của bộ slide liệt kê chương này nhưng không có slide nào dạy nó, nên bài này được viết theo danh sách chuẩn đầu ra in trong sách Nutshell (tr.18). Bài trả lời ba câu hỏi: <strong>kiểm thử khác đi thế nào</strong> trong dự án Agile, <strong>đội nhìn trạng thái kiểm thử bằng gì</strong> (burndown chart, task board, stand-up) và giữ <strong>rủi ro hồi quy</strong> trong tầm kiểm soát ra sao, và <strong>tester Agile làm gì, cần biết gì</strong>.</p>
<div class="callout"><b>Chuẩn đầu ra (chương 2 syllabus).</b> FA-2.1.1 Mô tả khác biệt giữa hoạt động kiểm thử trong dự án Agile và không Agile (K2) · FA-2.1.2 Mô tả cách hoạt động phát triển và kiểm thử được đan vào nhau trong dự án Agile (K2) · FA-2.1.3 Mô tả vai trò của kiểm thử độc lập trong dự án Agile (K2) · FA-2.2.1 Mô tả công cụ và kỹ thuật truyền đạt trạng thái kiểm thử, gồm tiến độ và chất lượng sản phẩm (K2) · FA-2.2.2 Mô tả quá trình phát triển bộ test qua nhiều iteration và giải thích vì sao tự động hoá test quan trọng để quản lý rủi ro hồi quy (K2) · FA-2.3.1 Hiểu kỹ năng của tester trong đội Agile (K2) · FA-2.3.2 Hiểu vai trò của tester trong đội Agile (K2).</div>
<h3>1. Kiểm thử khác đi thế nào — truyền thống vs Agile</h3>
<table>
<thead><tr><th>Khía cạnh</th><th>Truyền thống (tuần tự)</th><th>Agile</th></tr></thead>
<tbody>
<tr><td>Khi nào kiểm thử</td><td>Một pha sau phát triển; các cấp test nối tiếp nhau</td><td>Trong mọi iteration, song song với việc code; các cấp test chồng lên nhau</td></tr>
<tr><td>Ai kiểm thử</td><td>Một đội test riêng</td><td>Cả đội: developer viết unit test, tester dẫn dắt acceptance, exploratory và kiểm thử phi chức năng, người nghiệp vụ nghiệm thu</td></tr>
<tr><td>Test basis</td><td>Tài liệu yêu cầu đầy đủ, đã ký</td><td>User story + acceptance criteria + các cuộc trao đổi; test basis thay đổi mỗi iteration</td></tr>
<tr><td>Tài liệu</td><td>Test plan và đặc tả test case chi tiết</td><td>Gọn nhẹ: chiến lược test, danh sách rủi ro chất lượng, charter, test tự động như tài liệu sống (trang trọng hơn trong ngữ cảnh có quy định/an toàn sống còn)</td></tr>
<tr><td>Hồi quy</td><td>Một đợt hồi quy trước phát hành</td><td>Liên tục, phần lớn tự động, chạy trong CI mỗi ngày</td></tr>
<tr><td>Quan hệ tester – developer</td><td>Bàn giao ở cuối; nguy cơ "phe ta – phe họ"</td><td>Làm cặp, phản hồi sớm, Definition of Done chung</td></tr>
</tbody>
</table>
<p><strong>Code và test đan vào nhau thế nào (FA-2.1.2).</strong> Trong một iteration, một story đi qua <em>verification</em> và <em>validation</em> ở nhiều cấp: <strong>unit test</strong> (thường do developer viết, lý tưởng là test-first), <strong>feature verification</strong> — kiểm tính năng theo acceptance criteria (thường tự động, do developer hoặc tester), <strong>feature validation</strong> — nghiệm thu tính năng (thường làm tay, cùng các bên nghiệp vụ: nó có thật sự giải quyết nhu cầu người dùng?), cộng với <strong>kiểm thử hồi quy song song</strong> cho mọi thứ đã giao, và <strong>kiểm thử phi chức năng mức hệ thống</strong> khi cần. Acceptance testing có thể diễn ra cuối mỗi iteration, sau vài iteration, hoặc trước phát hành (alpha, beta, UAT, operational acceptance). Một số đội thêm một iteration "hardening" (ổn định hoá) trước phát hành — nhưng mục tiêu là tránh tích tụ <strong>nợ kỹ thuật (technical debt)</strong> mà iteration đó phải trả.</p>
<p><strong>Sản phẩm công việc (FA-2.1.1).</strong> Ba loại: <em>hướng nghiệp vụ</em> (user story, acceptance criteria, epic), <em>phát triển</em> (code, unit test, script CI) và <em>kiểm thử</em> (acceptance test tự động, charter và ghi chép của các phiên exploratory, danh mục rủi ro chất lượng, báo cáo defect, log kết quả test, số liệu test). Vẫn có test plan, nhưng ngắn.</p>
<p><strong>Kiểm thử độc lập (FA-2.1.3).</strong> Tester ngồi trong đội thì gần công việc — và có nguy cơ <em>mất tính độc lập</em>: nhiễm giả định của developer ("going native"), dễ dãi với cách làm yếu kém. Syllabus nêu ba phương án tổ chức: (1) tester độc lập <em>nằm trong</em> đội Agile; (2) một <em>đội test độc lập bên ngoài</em> các đội Agile làm việc dài hạn, xuyên đội (tích hợp hệ thống, phi chức năng, end-to-end), đồng thời cử tester vào các đội Agile; (3) tester từ một tổ chức test độc lập được cử vào đội suốt dự án, vẫn báo cáo theo tuyến bên ngoài. So với bài 5.1 (các mức độc lập).</p>`),
    bi(`<h3>2. Communicating test status — progress and product quality (FA-2.2.1)</h3>
<ul>
<li><strong>Burndown chart</strong> — remaining work (story points or hours) against time in the iteration, with an "ideal" straight line. Story points burn only when a story meets the Definition of Done, so testing that lags shows up immediately as a flat line.</li>
<li><strong>Task board</strong> (physical or Jira-like) — one row per story, columns <em>To do · In progress · Done</em> (sometimes also <em>Verify/Test</em>); <strong>testing tasks sit on the same board</strong> as development tasks, colour-coded, so everyone sees them. The daily stand-up is held in front of it, and testers report there like everyone else.</li>
<li><strong>Automated reports</strong> — CI dashboards with build status and test pass/fail, visible to the whole team; wikis for dashboards.</li>
<li><strong>Product-quality metrics</strong> — test pass/fail rates, defect discovery rate, confirmation and regression results, defect density, defects found vs fixed, requirement (story) coverage, risk coverage, code coverage, code churn; plus customer-satisfaction surveys after demos. These feed the retrospective.</li>
<li><strong>Definition of Done</strong> — makes "done" a team-wide exit criterion (a story is not done until its acceptance tests pass, no open severe defects, regression green…).</li>
</ul>
<h3>3. Regression risk and evolving tests (FA-2.2.2)</h3>
<p>Every iteration adds features, so the amount of code that could regress grows every iteration while the iteration length stays the same. Manual regression would take longer every sprint until it no longer fits. Hence: (1) <strong>automate at all levels</strong> — unit and component tests, API/integration tests, a smaller set of automated acceptance tests (the test pyramid, lesson 9.6), run in CI; (2) <strong>keep the tests up to date</strong> — review and revise them when stories change, remove obsolete ones, so the suite stays trustworthy; (3) run <strong>build verification tests</strong> on every build and the full regression nightly or before release; (4) automate the <em>tasks around testing</em> too: test-data generation, loading data, environment deployment, output comparison. Manual time then goes to new stories, changes, confirmation testing and exploratory sessions (deck slide 60).</p>
<h3>4. The tester's skills and role (FA-2.3.1, 2.3.2)</h3>
<table>
<thead><tr><th>Skills an Agile tester needs (on top of CTFL)</th><th>What an Agile tester does in the team</th></tr></thead>
<tbody>
<tr><td>
<ul>
<li>Positive, solution-oriented attitude with team members and stakeholders</li>
<li>Critical, quality-oriented, sceptical thinking about the product</li>
<li>Actively acquires information from stakeholders (does not wait for documents)</li>
<li>Accurately evaluates and reports test results, progress and product quality</li>
<li>Works with business people to define <strong>testable</strong> stories and acceptance criteria</li>
<li>Collaborates, pairs with developers and other testers</li>
<li>Responds to change quickly (changing, adding, improving tests)</li>
<li>Plans and organises own work</li>
<li>Technical skills: test automation, TDD/ATDD/BDD, black-box and white-box techniques, experience-based testing</li>
</ul></td>
<td>
<ul>
<li>Understands, implements and updates the <strong>test strategy</strong></li>
<li>Measures and reports test coverage across all dimensions</li>
<li>Ensures testing tools are used properly</li>
<li>Configures, uses and manages test environments and test data</li>
<li>Reports defects and works with the team to resolve them</li>
<li><strong>Coaches</strong> other team members in relevant aspects of testing</li>
<li>Ensures the right testing tasks are scheduled in release and iteration planning</li>
<li>Actively collaborates with developers and business to clarify requirements (testability, consistency, completeness)</li>
<li>Participates proactively in retrospectives, suggesting improvements</li>
</ul></td></tr>
</tbody>
</table>
<p>Organisational risks the syllabus warns about: testers <strong>lose independence</strong> and objective evaluation; become <strong>tolerant of inefficient or ineffective practices</strong>; <strong>cannot keep pace</strong> with incoming changes in time-constrained iterations; lose touch with the wider testing profession.</p>`,
      `<h3>2. Truyền đạt trạng thái kiểm thử — tiến độ và chất lượng sản phẩm (FA-2.2.1)</h3>
<ul>
<li><strong>Burndown chart</strong> — lượng việc còn lại (story point hoặc giờ) theo thời gian trong iteration, kèm một đường thẳng "lý tưởng". Story point chỉ được "đốt" khi story đạt Definition of Done, nên việc test bị chậm lộ ra ngay thành một đoạn nằm ngang.</li>
<li><strong>Task board</strong> (bảng giấy hoặc kiểu Jira) — mỗi story một hàng, các cột <em>To do · In progress · Done</em> (đôi khi thêm <em>Verify/Test</em>); <strong>task kiểm thử nằm cùng bảng</strong> với task phát triển, tô màu riêng, để ai cũng thấy. Daily stand-up đứng ngay trước bảng, và tester báo cáo ở đó như mọi người.</li>
<li><strong>Báo cáo tự động</strong> — dashboard CI với trạng thái build và test pass/fail, cả đội đều thấy; wiki làm dashboard.</li>
<li><strong>Số liệu chất lượng sản phẩm</strong> — tỉ lệ test pass/fail, tốc độ phát hiện defect, kết quả confirmation và hồi quy, mật độ defect, defect tìm thấy so với đã sửa, độ phủ yêu cầu (story), độ phủ rủi ro, độ phủ code, code churn; cộng khảo sát mức hài lòng của khách hàng sau demo. Những số này là đầu vào cho retrospective.</li>
<li><strong>Definition of Done</strong> — biến "xong" thành exit criterion chung cho cả đội (story chưa xong khi acceptance test chưa pass, còn defect nghiêm trọng mở, hồi quy chưa xanh…).</li>
</ul>
<h3>3. Rủi ro hồi quy và bộ test tiến hoá (FA-2.2.2)</h3>
<p>Mỗi iteration thêm tính năng, nên lượng code có thể bị hồi quy tăng lên mỗi iteration trong khi độ dài iteration không đổi. Hồi quy bằng tay sẽ tốn thêm thời gian mỗi sprint cho tới lúc không còn nhét vừa. Do đó: (1) <strong>tự động hoá ở mọi cấp</strong> — unit và component test, test API/tích hợp, một nhóm nhỏ hơn acceptance test tự động (test pyramid, bài 9.6), chạy trong CI; (2) <strong>giữ test luôn cập nhật</strong> — review và sửa khi story đổi, bỏ test lỗi thời, để bộ test luôn đáng tin; (3) chạy <strong>build verification test</strong> ở mọi bản build và toàn bộ hồi quy mỗi đêm hoặc trước phát hành; (4) tự động hoá cả <em>các việc quanh kiểm thử</em>: sinh dữ liệu test, nạp dữ liệu, triển khai môi trường, so sánh kết quả. Thời gian test tay khi đó dồn cho story mới, thay đổi, confirmation testing và các phiên exploratory (slide 60 của bộ slide).</p>
<h3>4. Kỹ năng và vai trò của tester (FA-2.3.1, 2.3.2)</h3>
<table>
<thead><tr><th>Kỹ năng tester Agile cần (ngoài kiến thức CTFL)</th><th>Tester Agile làm gì trong đội</th></tr></thead>
<tbody>
<tr><td>
<ul>
<li>Thái độ tích cực, hướng giải pháp với đồng đội và các bên liên quan</li>
<li>Tư duy phản biện, hướng chất lượng, hoài nghi về sản phẩm</li>
<li>Chủ động thu thập thông tin từ các bên (không ngồi chờ tài liệu)</li>
<li>Đánh giá và báo cáo chính xác kết quả test, tiến độ và chất lượng sản phẩm</li>
<li>Cùng người nghiệp vụ định nghĩa story và acceptance criteria <strong>kiểm thử được</strong></li>
<li>Cộng tác, làm cặp với developer và tester khác</li>
<li>Phản ứng nhanh với thay đổi (sửa, thêm, cải thiện test)</li>
<li>Tự lập kế hoạch và tổ chức công việc</li>
<li>Kỹ năng kỹ thuật: tự động hoá test, TDD/ATDD/BDD, kỹ thuật hộp đen và hộp trắng, kiểm thử dựa trên kinh nghiệm</li>
</ul></td>
<td>
<ul>
<li>Hiểu, triển khai và cập nhật <strong>chiến lược kiểm thử</strong></li>
<li>Đo và báo cáo độ phủ test theo mọi chiều</li>
<li>Bảo đảm công cụ kiểm thử được dùng đúng</li>
<li>Cấu hình, sử dụng và quản lý môi trường test, dữ liệu test</li>
<li>Báo cáo defect và cùng đội xử lý</li>
<li><strong>Huấn luyện</strong> đồng đội về các khía cạnh kiểm thử</li>
<li>Bảo đảm các task kiểm thử phù hợp được xếp lịch trong release và iteration planning</li>
<li>Chủ động cùng developer và nghiệp vụ làm rõ yêu cầu (tính kiểm thử được, nhất quán, đầy đủ)</li>
<li>Tham gia chủ động vào retrospective, đề xuất cải tiến</li>
</ul></td></tr>
</tbody>
</table>
<p>Rủi ro tổ chức mà syllabus cảnh báo: tester <strong>mất tính độc lập</strong> và cái nhìn khách quan; trở nên <strong>dễ dãi với cách làm kém hiệu quả</strong>; <strong>không theo kịp</strong> dòng thay đổi trong các iteration bị giới hạn thời gian; mất kết nối với giới kiểm thử rộng hơn.</p>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — read a burndown chart like a tester</h3>
<p>The FU Bookstore team committed <strong>21 points</strong> for a 10-day sprint (US-17 5, US-12 8, US-09 3, US-20 5). Points burn only when a story is <em>Done</em>. Remaining points at the end of each day:</p>
${BURNDOWN_SVG}
<table>
<thead><tr><th>Day</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr></thead>
<tbody>
<tr><td>Ideal (21 − 2.1·d)</td><td>21</td><td>18.9</td><td>16.8</td><td>14.7</td><td>12.6</td><td>10.5</td><td>8.4</td><td>6.3</td><td>4.2</td><td>2.1</td><td>0</td></tr>
<tr><td>Actual</td><td>21</td><td>21</td><td>21</td><td>16</td><td>16</td><td>16</td><td>8</td><td>8</td><td>5</td><td>5</td><td>5</td></tr>
<tr><td>Gap (actual − ideal)</td><td>0</td><td>2.1</td><td>4.2</td><td>1.3</td><td>3.4</td><td>5.5</td><td>−0.4</td><td>1.7</td><td>0.8</td><td>2.9</td><td>5</td></tr>
</tbody>
</table>
<ol>
<li><strong>Days 0–2 flat:</strong> work is in progress but nothing is Done. Normal at the start, but a tester asks at stand-up: which story will reach "Done" first, and are its acceptance tests ready?</li>
<li><strong>Day 5 — the worst gap (5.5 points behind):</strong> the 8-point US-12 (MoMo payment) is coded but not tested. The team swarms on it (developers help run and automate its tests) and it burns on day 6 — actual drops to 8, slightly <em>ahead</em> of ideal (−0.4).</li>
<li><strong>Day 10 — 5 points left:</strong> US-20 (order history) failed its acceptance test on the last day. It is <strong>not Done, so it earns no points</strong> — no "90 % done" credit. It returns to the product backlog for the PO to re-prioritise.</li>
<li><strong>Velocity</strong> of this sprint = 21 − 5 = <strong>16</strong>. The rolling average of the last three sprints becomes (18 + 24 + 16) ÷ 3 = <strong>19.33</strong>, which the team uses in the next iteration planning (lesson 9.4).</li>
<li><strong>Retrospective input:</strong> both flat stretches were stories waiting for testing. Action: split stories smaller and start writing acceptance tests on day 1 (ATDD, lesson 9.6).</li>
</ol>
<p><em>All values produced by a script (recomputed burn sequence matches; gaps rounded to 0.1).</em></p>
<div class="pitfall"><b>Two status traps.</b> (1) "Test status in Agile is reported in a formal test summary report at the end of the release" — no: burndown charts, task boards and stand-ups communicate it continuously (formal reports only where regulation requires). (2) "Embedding testers in the team fully guarantees their independence" — no: embedding brings them closer but is exactly the <em>risk</em> to independence the syllabus warns about.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Burn-up charts and the "hardening sprint" smell.</b> A burndown hides scope change: if the PO adds 5 points mid-sprint, the line jumps up and progress looks worse than it is. A <em>burn-up</em> chart draws two lines — total scope and work completed — so added scope and real progress are visible separately. And a team that regularly needs a "hardening sprint" before each release is usually running a mini-waterfall inside Agile: testing is not really inside each iteration, and technical debt is being deferred. <em>Outside the syllabus because CTFL-AT only names burndown charts and task boards.</em></div>`,
      `<h3>Ví dụ có lời giải · Bài tập — đọc burndown chart bằng mắt tester</h3>
<p>Đội FU Bookstore cam kết <strong>21 point</strong> cho sprint 10 ngày (US-17 5, US-12 8, US-09 3, US-20 5). Point chỉ được đốt khi story <em>Done</em>. Số point còn lại cuối mỗi ngày:</p>
${BURNDOWN_SVG}
<table>
<thead><tr><th>Ngày</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr></thead>
<tbody>
<tr><td>Lý tưởng (21 − 2,1·d)</td><td>21</td><td>18,9</td><td>16,8</td><td>14,7</td><td>12,6</td><td>10,5</td><td>8,4</td><td>6,3</td><td>4,2</td><td>2,1</td><td>0</td></tr>
<tr><td>Thực tế</td><td>21</td><td>21</td><td>21</td><td>16</td><td>16</td><td>16</td><td>8</td><td>8</td><td>5</td><td>5</td><td>5</td></tr>
<tr><td>Chênh (thực tế − lý tưởng)</td><td>0</td><td>2,1</td><td>4,2</td><td>1,3</td><td>3,4</td><td>5,5</td><td>−0,4</td><td>1,7</td><td>0,8</td><td>2,9</td><td>5</td></tr>
</tbody>
</table>
<ol>
<li><strong>Ngày 0–2 nằm ngang:</strong> việc đang làm nhưng chưa có gì Done. Bình thường ở đầu sprint, nhưng tester hỏi ngay ở stand-up: story nào sẽ tới "Done" đầu tiên, acceptance test của nó đã sẵn chưa?</li>
<li><strong>Ngày 5 — chênh lệch tệ nhất (chậm 5,5 point):</strong> US-12 8 point (thanh toán MoMo) đã code xong nhưng chưa test. Cả đội dồn vào (developer giúp chạy và tự động hoá test của nó) và nó được đốt vào ngày 6 — thực tế tụt xuống 8, nhỉnh <em>trước</em> đường lý tưởng (−0,4).</li>
<li><strong>Ngày 10 — còn 5 point:</strong> US-20 (lịch sử đơn hàng) trượt acceptance test vào ngày cuối. Nó <strong>chưa Done nên không được tính point nào</strong> — không có chuyện "xong 90%". Nó quay về product backlog để PO xếp ưu tiên lại.</li>
<li><strong>Velocity</strong> của sprint này = 21 − 5 = <strong>16</strong>. Trung bình trượt của ba sprint gần nhất thành (18 + 24 + 16) ÷ 3 = <strong>19,33</strong>, đội dùng số này cho buổi iteration planning kế tiếp (bài 9.4).</li>
<li><strong>Đầu vào cho retrospective:</strong> cả hai đoạn nằm ngang đều là story chờ test. Hành động: chia story nhỏ hơn và bắt đầu viết acceptance test từ ngày 1 (ATDD, bài 9.6).</li>
</ol>
<p><em>Mọi giá trị do script tính ra (chuỗi đốt point tính lại khớp; chênh lệch làm tròn 0,1).</em></p>
<div class="pitfall"><b>Hai bẫy về trạng thái.</b> (1) "Trạng thái kiểm thử trong Agile được báo bằng test summary report chính thức cuối release" — không: burndown chart, task board và stand-up truyền đạt nó liên tục (báo cáo chính thức chỉ khi quy định bắt buộc). (2) "Đặt tester trong đội bảo đảm hoàn toàn tính độc lập" — không: ngồi trong đội giúp gần công việc hơn nhưng chính là <em>rủi ro</em> với tính độc lập mà syllabus cảnh báo.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Burn-up chart và "mùi" hardening sprint.</b> Burndown che mất thay đổi phạm vi: nếu PO thêm 5 point giữa sprint, đường nhảy lên và tiến độ trông tệ hơn thực tế. <em>Burn-up</em> chart vẽ hai đường — tổng phạm vi và phần đã xong — nên phạm vi thêm vào và tiến độ thật hiện riêng. Và một đội thường xuyên cần "hardening sprint" trước mỗi release thường đang chạy một mini-waterfall bên trong Agile: kiểm thử không thật sự nằm trong mỗi iteration, và nợ kỹ thuật đang bị dồn lại. <em>Ngoài giáo trình vì CTFL-AT chỉ nêu tên burndown chart và task board.</em></div>`),
    books([
      ['agile', 'ISTQB Agile Tester in a Nutshell — p.18 (learning objectives of chapter 2: differences, integration of coding and testing, independent testing, status work products, evolving tests and regression automation, skills and role of the tester), p.15 (the contribution of Agile testers)', 'ISTQB Agile Tester in a Nutshell — tr.18 (chuẩn đầu ra chương 2: khác biệt, đan xen code và test, kiểm thử độc lập, sản phẩm báo trạng thái, bộ test tiến hoá và tự động hoá hồi quy, kỹ năng và vai trò tester), tr.15 (đóng góp của tester Agile)'],
      ['sp5', 'Chapter 6 Test management — test progress reporting in agile projects: "task boards, defect backlogs, and burndown charts that are discussed in daily standup meetings", PDF p.283; §6.1 test organisation and independence, PDF p.247; §3.2 continuous testing and automation, PDF p.84', 'Chương 6 Quản lý kiểm thử — báo cáo tiến độ test trong dự án Agile: "task board, defect backlog và burndown chart được bàn trong daily stand-up", PDF tr.283; §6.1 tổ chức kiểm thử và tính độc lập, PDF tr.247; §3.2 continuous testing và tự động hoá, PDF tr.84'],
      ['junit', 'Ch.22 Implementing a test pyramid strategy, §22.1 Software testing levels, PDF p.494 — why automated tests at every level keep regression under control', 'Ch.22 Implementing a test pyramid strategy, §22.1 Software testing levels, PDF tr.494 — vì sao test tự động ở mọi cấp giữ được hồi quy trong tầm kiểm soát'],
    ]),
  ].join('\n'),
};

/* ───────────────── 9.6 TDD, ATDD, BDD, pyramid, quadrants (syllabus 3.1, no slides) ───────────────── */
const GHERKIN = `<pre><code>Feature: Free shipping from 500,000 VND (US-17)

  Background:
    Given the free-shipping threshold is 500,000 VND
    And the standard shipping fee is 30,000 VND

  Scenario Outline: The shipping fee depends on the cart total
    Given I am logged in as a registered customer
    And my cart total is &lt;total&gt; VND
    When I open the checkout page
    Then the shipping fee shown is &lt;fee&gt; VND

    Examples:
      | total     | fee    |
      | 1,000     | 30,000 |
      | 499,999   | 30,000 |
      | 500,000   | 0      |
      | 1,250,000 | 0      |

  Scenario: Removing an item drops the cart below the threshold
    Given my cart total is 520,000 VND including a 60,000 VND book
    When I remove the book
    Then the cart total is 460,000 VND
    And the shipping fee shown is 30,000 VND
    And I see the message "Add 40,000 VND more for free shipping"

  Scenario: The threshold is checked after the voucher discount
    Given my cart total is 520,000 VND
    When I apply the voucher "GIAM50K" worth 50,000 VND
    Then the amount payable before shipping is 470,000 VND
    And the shipping fee shown is 30,000 VND</code></pre>`;

const TDD_TEST1 = `<pre><code>// ShippingCalculatorTest.java — written BEFORE ShippingCalculator exists
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ShippingCalculatorTest {
    private final ShippingCalculator calc = new ShippingCalculator();

    @Test
    void chargesStandardFeeJustBelowThreshold() {
        assertEquals(30_000, calc.fee(499_999));
    }
}</code></pre>
<p class="chu-thich">$ javac -cp "$JUNIT" -d out *.java</p>
<pre><code>ShippingCalculatorTest.java:5: error: cannot find symbol
    private final ShippingCalculator calc = new ShippingCalculator();
                  ^
  symbol:   class ShippingCalculator
  location: class ShippingCalculatorTest
ShippingCalculatorTest.java:5: error: cannot find symbol
    private final ShippingCalculator calc = new ShippingCalculator();
                                                ^
  symbol:   class ShippingCalculator
  location: class ShippingCalculatorTest
2 errors</code></pre>`;

const TDD_GREEN1 = `<pre><code>public class ShippingCalculator {
    public long fee(long cartTotal) {
        return 30_000;              // "fake it": the simplest thing that passes
    }
}</code></pre>
<p class="chu-thich">$ java -cp "out:$JUNIT" Runner</p>
<pre><code>PASS  chargesStandardFeeJustBelowThreshold()
1 passed, 0 failed</code></pre>`;

const TDD_RED2 = `<pre><code>    @Test
    void shipsFreeAtThreshold() {
        assertEquals(0, calc.fee(500_000));
    }</code></pre>
<pre><code>PASS  chargesStandardFeeJustBelowThreshold()
FAIL  shipsFreeAtThreshold()  -&gt;  expected: &lt;0&gt; but was: &lt;30000&gt;
1 passed, 1 failed</code></pre>`;

const TDD_GREEN2 = `<pre><code>    public long fee(long cartTotal) {
        if (cartTotal &gt;= 500_000) return 0;
        return 30_000;
    }</code></pre>
<pre><code>PASS  chargesStandardFeeJustBelowThreshold()
PASS  shipsFreeAtThreshold()
2 passed, 0 failed</code></pre>`;

const TDD_REFACTOR = `<pre><code>/** Shipping fee rule of user story US-17 (free shipping from 500,000 VND). */
public class ShippingCalculator {
    static final long FREE_SHIPPING_THRESHOLD = 500_000;   // VND
    static final long STANDARD_FEE = 30_000;               // VND

    public long fee(long cartTotal) {
        return qualifiesForFreeShipping(cartTotal) ? 0 : STANDARD_FEE;
    }

    private boolean qualifiesForFreeShipping(long cartTotal) {
        return cartTotal &gt;= FREE_SHIPPING_THRESHOLD;
    }
}</code></pre>
<pre><code>PASS  chargesStandardFeeJustBelowThreshold()
PASS  shipsFreeAtThreshold()
2 passed, 0 failed</code></pre>`;

const TDD_CYCLE3 = `<pre><code>    @Test
    void rejectsNegativeTotal() {
        assertThrows(IllegalArgumentException.class, () -&gt; calc.fee(-1));
    }</code></pre>
<pre><code>PASS  chargesStandardFeeJustBelowThreshold()
PASS  shipsFreeAtThreshold()
FAIL  rejectsNegativeTotal()  -&gt;  Expected java.lang.IllegalArgumentException to be thrown, but nothing was thrown.
2 passed, 1 failed</code></pre>
<pre><code>    public long fee(long cartTotal) {
        if (cartTotal &lt; 0) throw new IllegalArgumentException("cart total must be &gt;= 0");
        return qualifiesForFreeShipping(cartTotal) ? 0 : STANDARD_FEE;
    }</code></pre>
<pre><code>PASS  chargesStandardFeeJustBelowThreshold()
PASS  shipsFreeAtThreshold()
PASS  rejectsNegativeTotal()
3 passed, 0 failed</code></pre>`;

const L96 = {
  title: '9.6 — Agile testing methods: TDD, ATDD, BDD, the test pyramid and the testing quadrants|||9.6 — Phương pháp kiểm thử Agile: TDD, ATDD, BDD, test pyramid và testing quadrants',
  slug: 'swt301-tdd-bdd',
  type: 'DOCUMENT',
  description: 'Bài bổ sung (syllabus Agile Tester 3.1): TDD red-green-refactor, ATDD, BDD Given/When/Then, test pyramid, bốn testing quadrants, tester trong đội Scrum — kèm 3 bài có lời giải: user story → INVEST → acceptance criteria → Gherkin, một vòng TDD Java chạy thật với JUnit 5, phân loại 8 test vào Q1–Q4.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lesson 9.6 · Agile Tester syllabus §3.1 (not on the slides)</span>
<h2>Test-first methods, the test pyramid and the testing quadrants</h2>
<p class="lead">Agile teams write tests <em>before</em> the code they check. <strong>TDD</strong> does it at the unit level for developers, <strong>ATDD</strong> at the story level with the whole team, and <strong>BDD</strong> writes the same idea in business language (Given/When/Then). Two models then help decide <em>how many</em> tests of <em>which kind</em>: the <strong>test pyramid</strong> (many low-level tests, few high-level ones) and the <strong>testing quadrants</strong> (four purposes that a balanced team covers). This lesson builds them on one running example — user story US-17, free shipping from 500,000 VND — from story to Gherkin to real Java code.</p>
<div class="callout"><b>Learning objectives (syllabus §3.1).</b> FA-3.1.1 Recall the concepts of test-driven development, acceptance test-driven development and behaviour-driven development (K1) · FA-3.1.2 Recall the concepts of the test pyramid (K1) · FA-3.1.3 Summarise the testing quadrants and their relationships with testing levels and testing types (K2) · FA-3.1.4 For a given Agile project, practise the role of a tester in a Scrum team (K3).</div>
<table>
<thead><tr><th></th><th>TDD</th><th>ATDD</th><th>BDD</th></tr></thead>
<tbody>
<tr><td>Level</td><td>Unit (code-focused)</td><td>Story / acceptance</td><td>Behaviour of a feature</td></tr>
<tr><td>Who writes the tests</td><td>The developer</td><td>Developer + tester + business rep (power of three), in a specification workshop</td><td>The team, in business-readable language</td></tr>
<tr><td>Form</td><td>xUnit test methods (JUnit)</td><td>Examples / acceptance tests derived from the acceptance criteria</td><td>Given / When / Then scenarios (Gherkin), run by Cucumber, JBehave…</td></tr>
<tr><td>Main benefit</td><td>Design guided by tests, fast feedback, regression safety net</td><td>Shared understanding before coding; tests = executable requirements</td><td>Developers focus on behaviour the business needs; non-programmers can read the tests</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 9 · Bài 9.6 · Syllabus Agile Tester §3.1 (không có trên slide)</span>
<h2>Các phương pháp test-first, test pyramid và testing quadrants</h2>
<p class="lead">Đội Agile viết test <em>trước</em> đoạn code mà test đó kiểm. <strong>TDD</strong> làm việc này ở cấp unit cho developer, <strong>ATDD</strong> ở cấp story với cả đội, và <strong>BDD</strong> viết cùng ý tưởng đó bằng ngôn ngữ nghiệp vụ (Given/When/Then). Sau đó hai mô hình giúp quyết định <em>bao nhiêu</em> test thuộc <em>loại nào</em>: <strong>test pyramid</strong> (nhiều test cấp thấp, ít test cấp cao) và <strong>testing quadrants</strong> (bốn mục đích mà một đội cân bằng phải phủ). Bài này dựng tất cả trên một ví dụ xuyên suốt — user story US-17, miễn phí vận chuyển từ 500.000 đ — đi từ story tới Gherkin tới code Java chạy thật.</p>
<div class="callout"><b>Chuẩn đầu ra (syllabus §3.1).</b> FA-3.1.1 Nhắc lại khái niệm test-driven development, acceptance test-driven development và behaviour-driven development (K1) · FA-3.1.2 Nhắc lại khái niệm test pyramid (K1) · FA-3.1.3 Tóm tắt testing quadrants và quan hệ của chúng với cấp test và loại test (K2) · FA-3.1.4 Với một dự án Agile cho trước, thực hành vai trò tester trong đội Scrum (K3).</div>
<table>
<thead><tr><th></th><th>TDD</th><th>ATDD</th><th>BDD</th></tr></thead>
<tbody>
<tr><td>Cấp</td><td>Unit (tập trung vào code)</td><td>Story / nghiệm thu</td><td>Hành vi của một tính năng</td></tr>
<tr><td>Ai viết test</td><td>Developer</td><td>Developer + tester + đại diện nghiệp vụ (power of three), trong một buổi specification workshop</td><td>Cả đội, bằng ngôn ngữ nghiệp vụ đọc được</td></tr>
<tr><td>Hình thức</td><td>Phương thức test xUnit (JUnit)</td><td>Ví dụ / acceptance test rút từ acceptance criteria</td><td>Kịch bản Given / When / Then (Gherkin), chạy bằng Cucumber, JBehave…</td></tr>
<tr><td>Lợi ích chính</td><td>Thiết kế được test dẫn dắt, phản hồi nhanh, lưới an toàn hồi quy</td><td>Hiểu chung trước khi code; test = yêu cầu chạy được</td><td>Developer tập trung vào hành vi nghiệp vụ cần; người không lập trình đọc được test</td></tr>
</tbody>
</table>`),
    bi(`<h3>1. Test-driven development (TDD)</h3>
<p>The syllabus describes TDD as a tight loop: <strong>add a test</strong> that captures the programmer's idea of the desired behaviour of a small piece of code → <strong>run it; it should fail</strong> because the code does not exist → <strong>write the code and run the test</strong> in a tight loop until it passes → <strong>refactor</strong> the code after the test passes, re-running the tests to make sure it still passes → <strong>repeat</strong> for the next small piece, running all previous tests as well. The tests are mainly unit level and code-focused (they can also be written at integration or system level). TDD comes from XP ("code the unit test first", deck slide 35) and it is as much a <em>design</em> technique as a testing one: to write the test you must decide the interface and the edge cases first.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Red</div><div class="lz-t">write one failing test</div><div class="lz-d">for behaviour that does not exist yet</div></div>
  <div class="lz-step"><div class="lz-k">2 · Green</div><div class="lz-t">make it pass</div><div class="lz-d">the simplest code that satisfies the test</div></div>
  <div class="lz-step"><div class="lz-k">3 · Refactor</div><div class="lz-t">clean up</div><div class="lz-d">improve the design; all tests stay green</div></div>
</div>
<h3>2. Acceptance test-driven development (ATDD)</h3>
<p>ATDD defines <strong>acceptance criteria and tests during user-story creation</strong>, together (developers, testers and business representatives), <strong>before implementation</strong>. The syllabus sequence: a <em>specification workshop</em> analyses and discusses the story (the tester's open questions remove ambiguities); the team writes tests as <strong>examples</strong> — first the positive, "happy-path" examples that confirm the behaviour, then negative tests, then non-functional ones (performance, usability); the tests are expressed so that stakeholders understand them and developers can automate them; they then serve as <strong>executable requirements</strong> and as regression tests. ATDD is a test-first approach at the acceptance level.</p>
<h3>3. Behaviour-driven development (BDD)</h3>
<p>BDD lets the developer focus on the <strong>behaviour</strong> the business expects. Tests are written in the <strong>Given / When / Then</strong> format — <em>Given</em> some initial context, <em>When</em> an event occurs, <em>Then</em> ensure some outcomes — in a language the business understands (Gherkin). Frameworks such as <strong>Cucumber</strong> and <strong>JBehave</strong> turn each line into executable code ("step definitions"). The syllabus stresses that BDD helps developers collaborate with other stakeholders to define accurate unit tests focused on business needs. Memory hook: <em>TDD asks "does the code do what the developer intended?"; BDD/ATDD ask "does the product do what the business needs?"</em></p>`,
      `<h3>1. Test-driven development (TDD)</h3>
<p>Syllabus mô tả TDD là một vòng lặp chặt: <strong>thêm một test</strong> ghi lại ý tưởng của lập trình viên về hành vi mong muốn của một đoạn code nhỏ → <strong>chạy nó; nó phải fail</strong> vì code chưa tồn tại → <strong>viết code và chạy test</strong> trong vòng lặp chặt tới khi pass → <strong>refactor</strong> code sau khi test pass, chạy lại test để chắc nó vẫn pass → <strong>lặp lại</strong> cho mẩu tiếp theo, chạy luôn mọi test trước đó. Test chủ yếu ở cấp unit, tập trung vào code (cũng có thể viết ở cấp tích hợp hoặc hệ thống). TDD bắt nguồn từ XP ("viết unit test trước", slide 35 của bộ slide) và nó là kỹ thuật <em>thiết kế</em> không kém kỹ thuật kiểm thử: muốn viết test, bạn phải quyết định giao diện và các ca biên trước.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Red</div><div class="lz-t">viết một test fail</div><div class="lz-d">cho hành vi chưa tồn tại</div></div>
  <div class="lz-step"><div class="lz-k">2 · Green</div><div class="lz-t">làm nó pass</div><div class="lz-d">đoạn code đơn giản nhất thoả test</div></div>
  <div class="lz-step"><div class="lz-k">3 · Refactor</div><div class="lz-t">dọn dẹp</div><div class="lz-d">cải thiện thiết kế; mọi test vẫn xanh</div></div>
</div>
<h3>2. Acceptance test-driven development (ATDD)</h3>
<p>ATDD định nghĩa <strong>acceptance criteria và test ngay trong lúc viết user story</strong>, cùng nhau (developer, tester và đại diện nghiệp vụ), <strong>trước khi cài đặt</strong>. Trình tự theo syllabus: một buổi <em>specification workshop</em> phân tích và bàn về story (câu hỏi mở của tester gỡ các chỗ mơ hồ); đội viết test dưới dạng <strong>ví dụ</strong> — trước là các ví dụ tích cực "happy path" khẳng định hành vi, rồi test tiêu cực, rồi test phi chức năng (hiệu năng, khả năng sử dụng); test được diễn đạt sao cho các bên hiểu và developer tự động hoá được; sau đó chúng là <strong>yêu cầu chạy được (executable requirements)</strong> và là test hồi quy. ATDD là cách tiếp cận test-first ở cấp nghiệm thu.</p>
<h3>3. Behaviour-driven development (BDD)</h3>
<p>BDD giúp developer tập trung vào <strong>hành vi</strong> mà nghiệp vụ mong đợi. Test được viết theo mẫu <strong>Given / When / Then</strong> — <em>Given</em> một bối cảnh ban đầu, <em>When</em> một sự kiện xảy ra, <em>Then</em> bảo đảm một số kết quả — bằng ngôn ngữ nghiệp vụ hiểu được (Gherkin). Các framework như <strong>Cucumber</strong> và <strong>JBehave</strong> biến mỗi dòng thành code chạy được ("step definition"). Syllabus nhấn mạnh BDD giúp developer cộng tác với các bên để định nghĩa unit test chính xác, tập trung vào nhu cầu nghiệp vụ. Mẹo nhớ: <em>TDD hỏi "code có làm đúng ý developer không?"; BDD/ATDD hỏi "sản phẩm có làm đúng điều nghiệp vụ cần không?"</em></p>`),
    bi(`<h3>4. The test pyramid</h3>
<p>The pyramid shows the <strong>number of tests per level</strong>: a wide base of <strong>unit/component tests</strong> (many, fast, cheap, precise when they fail, run on every commit), a middle layer of <strong>integration / API / service tests</strong>, and a narrow top of <strong>system and acceptance tests through the UI</strong> (few, slow, expensive, brittle). The syllabus: the pyramid emphasises having <em>a larger number of tests at the lower levels</em> than at the higher levels; it supports test automation and the "shift left" of testing. The upside-down shape — many manual or UI tests, few unit tests — is the "ice-cream cone" anti-pattern: slow feedback, costly maintenance, and the CI risk of slide 64 in reverse. JUnit in Action ch.22 builds a complete pyramid for a flights-management application (unit → integration → system → acceptance) and reaches 100 % code coverage.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Top · few</div><div class="lz-t">UI / end-to-end, acceptance</div><div class="lz-d">slow, costly, brittle — only key journeys</div></div>
  <div class="lz-step"><div class="lz-k">Middle</div><div class="lz-t">integration / API / service</div><div class="lz-d">components talking to each other</div></div>
  <div class="lz-step"><div class="lz-k">Base · many</div><div class="lz-t">unit / component (TDD)</div><div class="lz-d">milliseconds each, run on every commit</div></div>
</div>
<h3>5. The testing quadrants (Brian Marick; Crispin &amp; Gregory)</h3>
<p>Two axes: <strong>business-facing vs technology-facing</strong>, and tests that <strong>support the team</strong> (guide development) vs tests that <strong>critique the product</strong> (evaluate it). The syllabus links each quadrant to test levels and types:</p>
<table>
<thead><tr><th></th><th>Supporting the team</th><th>Critiquing the product</th></tr></thead>
<tbody>
<tr><td><strong>Business-facing</strong></td><td><strong>Q2</strong> — system level; functional tests, examples, story tests, user-experience prototypes, simulations; checks acceptance criteria; manual or automated; often written during ATDD/BDD</td><td><strong>Q3</strong> — system or user-acceptance level; exploratory testing, scenarios, process flows, usability testing, user acceptance testing, alpha and beta testing; manual, user-oriented</td></tr>
<tr><td><strong>Technology-facing</strong></td><td><strong>Q1</strong> — unit level; unit tests and component tests; automated, part of CI; TDD lives here</td><td><strong>Q4</strong> — system or operational-acceptance level; performance, load, stress, scalability, security, maintainability, memory management, compatibility, interoperability, data migration, infrastructure, recovery testing; often automated with tools</td></tr>
</tbody>
</table>
<p>The quadrants are <strong>not a sequence</strong> (Q1 is not "first"); they are a <strong>coverage checklist</strong>. Any iteration may need tests from any quadrant, and a healthy team is active in all four. A team with only Q1 ships fast but may ship insecure, slow or unusable software — exactly the gaps Q3 and Q4 catch.</p>
<h3>6. The tester in a Scrum team (FA-3.1.4)</h3>
<ul>
<li><strong>Teamwork</strong> — the team is cross-functional, self-organising, co-located, collaborative, empowered, committed, transparent, credible, open to feedback and resilient; the tester is a full member in the Daily Scrum, planning, review and retrospective.</li>
<li><strong>Sprint zero</strong> (the first iteration that prepares the project) — the tester helps identify the scope, create the initial system architecture and prototypes, plan and acquire tools, create an <strong>initial test strategy</strong> for all test levels, perform an <strong>initial quality risk analysis</strong>, define test metrics, specify the <strong>Definition of Done</strong>, create the task board, and define when to continue or stop testing before delivering to the customer.</li>
<li><strong>Integration</strong> — plan tests for the integration of features across stories and teams, not only single stories.</li>
<li><strong>Test planning</strong> — happens in release and iteration planning (lesson 9.4); testing tasks go on the task board.</li>
<li><strong>Agile testing practices</strong> — <em>pairing</em> (tester with developer, or two testers), <em>incremental test design</em> (tests grow with the stories, from simple to complex), and <em>mind mapping</em> to organise test ideas.</li>
</ul>`,
      `<h3>4. Test pyramid</h3>
<p>Kim tự tháp thể hiện <strong>số lượng test ở mỗi cấp</strong>: đáy rộng gồm <strong>unit/component test</strong> (rất nhiều, nhanh, rẻ, khi fail chỉ đúng chỗ hỏng, chạy ở mỗi commit), tầng giữa gồm <strong>test tích hợp / API / service</strong>, và đỉnh hẹp gồm <strong>system test và acceptance test qua giao diện</strong> (ít, chậm, đắt, dễ gãy). Syllabus: kim tự tháp nhấn mạnh việc có <em>nhiều test hơn ở các cấp thấp</em> so với các cấp cao; nó hỗ trợ tự động hoá test và việc "dời kiểm thử sang trái" (shift left). Hình lộn ngược — nhiều test tay hay test UI, ít unit test — là phản mẫu "cây kem ốc quế": phản hồi chậm, bảo trì tốn kém, và chính là rủi ro CI ở slide 64 theo chiều ngược lại. JUnit in Action chương 22 dựng trọn một kim tự tháp cho ứng dụng quản lý chuyến bay (unit → integration → system → acceptance) và đạt 100% độ phủ code.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Đỉnh · ít</div><div class="lz-t">UI / end-to-end, acceptance</div><div class="lz-d">chậm, đắt, dễ gãy — chỉ các hành trình chính</div></div>
  <div class="lz-step"><div class="lz-k">Giữa</div><div class="lz-t">tích hợp / API / service</div><div class="lz-d">các thành phần nói chuyện với nhau</div></div>
  <div class="lz-step"><div class="lz-k">Đáy · nhiều</div><div class="lz-t">unit / component (TDD)</div><div class="lz-d">vài mili-giây mỗi test, chạy ở mọi commit</div></div>
</div>
<h3>5. Testing quadrants (Brian Marick; Crispin &amp; Gregory)</h3>
<p>Hai trục: <strong>hướng nghiệp vụ vs hướng kỹ thuật</strong>, và test <strong>hỗ trợ đội</strong> (dẫn dắt việc phát triển) vs test <strong>phê bình sản phẩm</strong> (đánh giá nó). Syllabus gắn mỗi góc phần tư với cấp test và loại test:</p>
<table>
<thead><tr><th></th><th>Hỗ trợ đội</th><th>Phê bình sản phẩm</th></tr></thead>
<tbody>
<tr><td><strong>Hướng nghiệp vụ</strong></td><td><strong>Q2</strong> — cấp hệ thống; functional test, ví dụ, story test, prototype trải nghiệm người dùng, mô phỏng; kiểm acceptance criteria; tay hoặc tự động; thường viết trong ATDD/BDD</td><td><strong>Q3</strong> — cấp hệ thống hoặc nghiệm thu người dùng; exploratory testing, kịch bản, luồng quy trình, usability testing, UAT, alpha và beta testing; làm tay, hướng người dùng</td></tr>
<tr><td><strong>Hướng kỹ thuật</strong></td><td><strong>Q1</strong> — cấp unit; unit test và component test; tự động, nằm trong CI; TDD ở đây</td><td><strong>Q4</strong> — cấp hệ thống hoặc nghiệm thu vận hành; kiểm thử hiệu năng, tải, stress, khả năng mở rộng, bảo mật, khả năng bảo trì, quản lý bộ nhớ, tương thích, liên tác, chuyển đổi dữ liệu, hạ tầng, khôi phục; thường tự động bằng công cụ</td></tr>
</tbody>
</table>
<p>Các quadrant <strong>không phải một trình tự</strong> (Q1 không phải "làm trước"); chúng là một <strong>checklist độ phủ</strong>. Iteration nào cũng có thể cần test thuộc bất kỳ góc nào, và một đội khoẻ mạnh hoạt động ở cả bốn. Đội chỉ có Q1 thì ship nhanh nhưng có thể ship phần mềm không an toàn, chậm hoặc khó dùng — đúng những khoảng trống Q3 và Q4 bắt được.</p>
<h3>6. Tester trong đội Scrum (FA-3.1.4)</h3>
<ul>
<li><strong>Làm việc nhóm</strong> — đội đa năng, tự tổ chức, ngồi cùng nhau, cộng tác, được trao quyền, cam kết, minh bạch, đáng tin, cởi mở với phản hồi và bền bỉ; tester là thành viên đầy đủ trong Daily Scrum, planning, review và retrospective.</li>
<li><strong>Sprint zero</strong> (iteration đầu tiên để chuẩn bị dự án) — tester giúp xác định phạm vi, dựng kiến trúc hệ thống ban đầu và prototype, lập kế hoạch và mua sắm công cụ, tạo <strong>chiến lược test ban đầu</strong> cho mọi cấp, làm <strong>phân tích rủi ro chất lượng ban đầu</strong>, định nghĩa số liệu test, đặc tả <strong>Definition of Done</strong>, dựng task board, và xác định khi nào tiếp tục hay dừng test trước khi giao cho khách hàng.</li>
<li><strong>Tích hợp</strong> — lên kế hoạch test cho việc tích hợp tính năng giữa các story và các đội, không chỉ từng story riêng lẻ.</li>
<li><strong>Lập kế hoạch test</strong> — diễn ra trong release và iteration planning (bài 9.4); task kiểm thử nằm trên task board.</li>
<li><strong>Thực hành kiểm thử Agile</strong> — <em>pairing</em> (tester với developer, hoặc hai tester), <em>thiết kế test tăng dần</em> (test lớn lên cùng story, từ đơn giản tới phức tạp), và <em>mind mapping</em> để sắp xếp ý tưởng test.</li>
</ul>`),
    bi(`<h3>Ví dụ có lời giải 1 · Worked example — from a vague story to INVEST-checked acceptance criteria and Gherkin (ATDD/BDD)</h3>
<p><b>Step 1 — the first draft from the business:</b> <em>"As a customer, I want free shipping for big orders."</em> Not testable: how big? The tester's open questions in the three-amigos session (deck slide 51): What amount counts as "big"? Is the amount itself included? Is it checked before or after a voucher? What does the customer see when just below the limit? Which customers — guests too? What if an item is removed at checkout?</p>
<p><b>Step 2 — the story after the conversation:</b> <em>"US-17 — As a registered customer of FU Bookstore, I want shipping to be free when my cart reaches 500,000 VND, so that I save the 30,000 VND fee when I buy more."</em></p>
<p><b>Step 3 — acceptance criteria (confirmation):</b></p>
<ol>
<li>AC1 — If the cart total <em>after voucher discounts and before shipping</em> is <strong>≥ 500,000 VND</strong>, the shipping fee is 0.</li>
<li>AC2 — If that total is <strong>&lt; 500,000 VND</strong>, the shipping fee is 30,000 VND.</li>
<li>AC3 — The fee is recalculated immediately when the cart changes; below the threshold the page shows "Add X VND more for free shipping".</li>
<li>AC4 — Only registered customers; delivery addresses in Vietnam only.</li>
<li>AC5 (non-functional) — The updated fee is displayed within 1 second of a cart change.</li>
</ol>
<p><b>Step 4 — INVEST check:</b></p>
<table>
<thead><tr><th>Letter</th><th>✔/✘</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Independent</td><td>✔</td><td>Needs only the cart total; can ship before or after the MoMo payment story.</td></tr>
<tr><td>Negotiable</td><td>✔</td><td>The PO could still pick 400,000 VND or exclude sale items.</td></tr>
<tr><td>Valuable</td><td>✔</td><td>Customer saves 30,000 VND; the business gets bigger orders.</td></tr>
<tr><td>Estimable</td><td>✔</td><td>The team knows the checkout code; planning poker gave 5 points (lesson 9.7).</td></tr>
<tr><td>Small</td><td>✔</td><td>About 15.5 hours of tasks (lesson 9.4) — fits one sprint easily.</td></tr>
<tr><td>Testable</td><td>✔</td><td>After step 3: exact threshold, inclusive boundary, voucher rule. The step-1 draft failed this letter.</td></tr>
</tbody>
</table>
<p><b>Step 5 — the acceptance tests as Gherkin</b> (concrete data; the Scenario Outline applies boundary value analysis from Chapter 4 — 499,999 / 500,000 are the two boundary values):</p>
${GHERKIN}
<p>Checks: 520,000 − 60,000 = 460,000 and 500,000 − 460,000 = 40,000; 520,000 − 50,000 = 470,000 &lt; 500,000, so the fee is charged. The last scenario pins down the rule that the business had not thought about in step 1 — a defect prevented before coding.</p>`,
      `<h3>Ví dụ có lời giải 1 · Bài tập — từ một story mơ hồ tới acceptance criteria đã soát INVEST và Gherkin (ATDD/BDD)</h3>
<p><b>Bước 1 — bản nháp đầu từ phía nghiệp vụ:</b> <em>"Là khách hàng, tôi muốn được miễn phí vận chuyển cho đơn hàng lớn."</em> Không kiểm thử được: lớn là bao nhiêu? Câu hỏi mở của tester trong buổi three amigos (slide 51 của bộ slide): Bao nhiêu tiền thì tính là "lớn"? Đúng bằng mức đó có được không? Tính trước hay sau voucher? Khi thiếu một chút thì khách thấy gì? Khách nào — cả khách vãng lai? Nếu bỏ bớt món ở trang thanh toán thì sao?</p>
<p><b>Bước 2 — story sau khi trao đổi:</b> <em>"US-17 — Là khách hàng đã đăng ký của FU Bookstore, tôi muốn được miễn phí vận chuyển khi giỏ hàng đạt 500.000 đ, để tiết kiệm 30.000 đ phí ship khi mua nhiều hơn."</em></p>
<p><b>Bước 3 — acceptance criteria (confirmation):</b></p>
<ol>
<li>AC1 — Nếu tổng giỏ <em>sau khi trừ voucher và trước phí ship</em> <strong>≥ 500.000 đ</strong> thì phí ship bằng 0.</li>
<li>AC2 — Nếu tổng đó <strong>&lt; 500.000 đ</strong> thì phí ship là 30.000 đ.</li>
<li>AC3 — Phí được tính lại ngay khi giỏ thay đổi; dưới ngưỡng thì trang hiện "Mua thêm X đ để được miễn phí vận chuyển".</li>
<li>AC4 — Chỉ khách đã đăng ký; chỉ địa chỉ giao hàng tại Việt Nam.</li>
<li>AC5 (phi chức năng) — Phí mới hiển thị trong vòng 1 giây sau khi giỏ thay đổi.</li>
</ol>
<p><b>Bước 4 — soát INVEST:</b></p>
<table>
<thead><tr><th>Chữ</th><th>✔/✘</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Độc lập</td><td>✔</td><td>Chỉ cần tổng giỏ; giao trước hay sau story thanh toán MoMo đều được.</td></tr>
<tr><td>Thương lượng được</td><td>✔</td><td>PO vẫn có thể chọn 400.000 đ hay loại trừ hàng giảm giá.</td></tr>
<tr><td>Có giá trị</td><td>✔</td><td>Khách tiết kiệm 30.000 đ; doanh nghiệp có đơn to hơn.</td></tr>
<tr><td>Ước lượng được</td><td>✔</td><td>Đội hiểu code thanh toán; planning poker ra 5 point (bài 9.7).</td></tr>
<tr><td>Nhỏ</td><td>✔</td><td>Khoảng 15,5 giờ task (bài 9.4) — vừa một sprint thoải mái.</td></tr>
<tr><td>Kiểm thử được</td><td>✔</td><td>Sau bước 3: ngưỡng chính xác, biên tính cả bằng, quy tắc voucher. Bản nháp ở bước 1 trượt đúng chữ này.</td></tr>
</tbody>
</table>
<p><b>Bước 5 — acceptance test viết bằng Gherkin</b> (dữ liệu cụ thể; Scenario Outline áp dụng phân tích giá trị biên của Chương 4 — 499.999 / 500.000 là hai giá trị biên). Từ khoá Gherkin giữ nguyên tiếng Anh như công cụ yêu cầu:</p>
${GHERKIN}
<p>Kiểm tra: 520.000 − 60.000 = 460.000 và 500.000 − 460.000 = 40.000; 520.000 − 50.000 = 470.000 &lt; 500.000 nên vẫn tính phí. Kịch bản cuối ghim chặt quy tắc mà phía nghiệp vụ chưa hề nghĩ tới ở bước 1 — một defect bị ngăn trước khi code.</p>`),
    bi(`<h3>Ví dụ có lời giải 2 · Worked example — one TDD session in Java (JUnit 5, JDK 21, real output)</h3>
<p>The developer implements AC1/AC2 of US-17 test-first. Everything below was compiled with <code>javac</code> 21.0.9 and run with the JUnit 5.12 engine through a tiny console runner (it prints PASS/FAIL per test and a total). Outputs are pasted exactly.</p>
<p><b>Cycle 1 · RED</b> — write the test for the value just below the boundary. The class does not exist, so in Java the first "red" is a compile error:</p>
${TDD_TEST1}
<p><b>Cycle 1 · GREEN</b> — the minimal code. Returning a constant ("fake it") is allowed: the single test does not yet force anything smarter.</p>
${TDD_GREEN1}
<p><b>Cycle 2 · RED</b> — a second test on the other boundary value forces real logic:</p>
${TDD_RED2}
<p><b>Cycle 2 · GREEN</b> — the smallest change that makes both pass:</p>
${TDD_GREEN2}
<p><b>REFACTOR</b> — remove the magic numbers and name the rule; no behaviour change, so the same two tests must stay green:</p>
${TDD_REFACTOR}
<p><b>Cycle 3</b> — a developer-level robustness rule (not in the acceptance criteria): a negative total is a programming error. Red first, then green:</p>
${TDD_CYCLE3}
<p><b>What the session shows.</b> (1) Every line of production code was written to make a failing test pass, so the three tests fully pin down the behaviour. (2) The refactor was safe because the tests stayed green. (3) The TDD tests (Q1) are finer-grained than the Gherkin scenarios (Q2): the negative-total rule matters to the developer, not to the business. (4) Test 1 and 2 are exactly the boundary pair 499,999 / 500,000 from the Scenario Outline — ATDD told the developer which unit tests to write.</p>`,
      `<h3>Ví dụ có lời giải 2 · Bài tập — một phiên TDD bằng Java (JUnit 5, JDK 21, output thật)</h3>
<p>Developer cài đặt AC1/AC2 của US-17 theo lối test-first. Mọi thứ dưới đây đã được biên dịch bằng <code>javac</code> 21.0.9 và chạy bằng engine JUnit 5.12 qua một runner console nhỏ (in PASS/FAIL cho từng test và tổng số). Output được dán nguyên văn.</p>
<p><b>Vòng 1 · RED</b> — viết test cho giá trị ngay dưới biên. Lớp chưa tồn tại, nên trong Java "đỏ" đầu tiên là lỗi biên dịch:</p>
${TDD_TEST1}
<p><b>Vòng 1 · GREEN</b> — đoạn code tối thiểu. Trả về một hằng số ("fake it") là hợp lệ: một test duy nhất chưa buộc được gì thông minh hơn.</p>
${TDD_GREEN1}
<p><b>Vòng 2 · RED</b> — test thứ hai ở giá trị biên còn lại buộc phải có logic thật:</p>
${TDD_RED2}
<p><b>Vòng 2 · GREEN</b> — thay đổi nhỏ nhất để cả hai pass:</p>
${TDD_GREEN2}
<p><b>REFACTOR</b> — bỏ "số ma thuật", đặt tên cho quy tắc; hành vi không đổi nên đúng hai test đó phải vẫn xanh:</p>
${TDD_REFACTOR}
<p><b>Vòng 3</b> — một quy tắc chắc chắn cấp developer (không có trong acceptance criteria): tổng âm là lỗi lập trình. Đỏ trước, rồi xanh:</p>
${TDD_CYCLE3}
<p><b>Phiên này cho thấy gì.</b> (1) Mọi dòng code production đều được viết để làm một test đang fail trở nên pass, nên ba test ghim chặt toàn bộ hành vi. (2) Refactor an toàn vì test vẫn xanh. (3) Test TDD (Q1) mịn hơn kịch bản Gherkin (Q2): quy tắc tổng âm quan trọng với developer chứ không phải với nghiệp vụ. (4) Test 1 và 2 chính là cặp biên 499.999 / 500.000 của Scenario Outline — ATDD đã chỉ cho developer phải viết unit test nào.</p>`),
    bi(`<h3>Ví dụ có lời giải 3 · Worked example — put eight tests of US-17 into the quadrants</h3>
<p>Rule of thumb: first ask <em>who can judge the result</em> (business person → Q2/Q3; only a technical person or a tool → Q1/Q4), then <em>is it guiding the build or evaluating the finished thing</em> (support → Q1/Q2; critique → Q3/Q4).</p>
<table>
<thead><tr><th>#</th><th>Test</th><th>Quadrant</th><th>Reason</th></tr></thead>
<tbody>
<tr><td>1</td><td>JUnit test <code>fee(499_999) == 30_000</code>, run on every commit</td><td><strong>Q1</strong></td><td>Unit level, technology-facing, written test-first to guide the code.</td></tr>
<tr><td>2</td><td>Component-integration test: OrderService + ShippingCalculator + in-memory database, in CI</td><td><strong>Q1</strong></td><td>Technology-facing component test that supports developers.</td></tr>
<tr><td>3</td><td>The Cucumber Scenario Outline of US-17 (4 examples), automated</td><td><strong>Q2</strong></td><td>Business-facing story test that checks the acceptance criteria while the story is built.</td></tr>
<tr><td>4</td><td>The PO walks through a clickable Figma prototype of the "Add X VND more" message</td><td><strong>Q2</strong></td><td>User-experience prototype — business-facing, supports the team before coding.</td></tr>
<tr><td>5</td><td>90-minute exploratory session: "explore checkout with vouchers and item removal to discover fee errors"</td><td><strong>Q3</strong></td><td>Business-facing, critiques the finished feature; manual and user-oriented.</td></tr>
<tr><td>6</td><td>Five students try to buy books while observed; the PO accepts the story at the sprint review</td><td><strong>Q3</strong></td><td>Usability testing and user acceptance testing.</td></tr>
<tr><td>7</td><td>JMeter: 2,000 concurrent checkouts, 95th-percentile fee update ≤ 1 s (AC5)</td><td><strong>Q4</strong></td><td>Performance/load test — technology-facing, critiques the product with a tool.</td></tr>
<tr><td>8</td><td>OWASP ZAP security scan of the checkout and payment pages</td><td><strong>Q4</strong></td><td>Security testing — technology-facing critique, automated.</td></tr>
</tbody>
</table>
<p>All four quadrants are active for one small story: developers own Q1, the whole team shapes Q2, testers lead Q3, specialists and tools cover Q4. Count them against the pyramid too: tests 1–2 are many and fast (base), 3 is a handful of UI/API scenarios (upper layers), 5–6 are not automated at all.</p>
<div class="pitfall"><b>Three classic confusions.</b> (1) <b>TDD ≠ BDD</b>: TDD is developer-facing unit tests that drive the code; BDD is business-readable behaviour scenarios (often called "TDD at the feature level in the language of the business"). (2) <b>The quadrants are not phases</b> — "Q1 is done first and Q4 last" is false. (3) <b>Usability is Q3, performance and security are Q4</b>; "functional tests and prototypes" are Q2, not Q3. And in the pyramid, the <em>bottom</em> has the most tests.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>DevOps, continuous testing and testing in production.</b> Modern teams fuse these methods into a <b>DevOps</b> pipeline: the TDD unit tests, the BDD scenarios and automated Q4 checks run on every change (<b>continuous testing</b>), and teams measure themselves with the four <b>DORA metrics</b> — deployment frequency, lead time for changes, change-failure rate, time to restore. Beyond the pipeline, <b>testing in production</b> — feature flags, canary releases, A/B tests, real-user monitoring — treats live traffic as the final test environment (the "shift-right" counterpart of shift-left). Some teams also go "outside-in": they write the failing Gherkin scenario first, then drive the code with TDD until the scenario passes — exactly the path of worked examples 1 and 2. <em>Outside the syllabus because CTFL-AT stops at the concepts of TDD/ATDD/BDD, the pyramid and the quadrants.</em></div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&amp;reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practise TDD: red-green-refactor with JUnit</span><span class="lc-sub">Write the test first, then the code — on CodeLab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>`,
      `<h3>Ví dụ có lời giải 3 · Bài tập — xếp tám test của US-17 vào các quadrant</h3>
<p>Quy tắc ngón tay cái: trước hết hỏi <em>ai phán được kết quả</em> (người nghiệp vụ → Q2/Q3; chỉ người kỹ thuật hoặc công cụ → Q1/Q4), rồi hỏi <em>nó dẫn dắt việc làm hay đánh giá thứ đã làm xong</em> (hỗ trợ → Q1/Q2; phê bình → Q3/Q4).</p>
<table>
<thead><tr><th>#</th><th>Test</th><th>Quadrant</th><th>Lý do</th></tr></thead>
<tbody>
<tr><td>1</td><td>JUnit test <code>fee(499_999) == 30_000</code>, chạy ở mọi commit</td><td><strong>Q1</strong></td><td>Cấp unit, hướng kỹ thuật, viết test-first để dẫn dắt code.</td></tr>
<tr><td>2</td><td>Component-integration test: OrderService + ShippingCalculator + database trong bộ nhớ, trong CI</td><td><strong>Q1</strong></td><td>Component test hướng kỹ thuật, hỗ trợ developer.</td></tr>
<tr><td>3</td><td>Scenario Outline Cucumber của US-17 (4 ví dụ), đã tự động hoá</td><td><strong>Q2</strong></td><td>Story test hướng nghiệp vụ, kiểm acceptance criteria ngay trong lúc làm story.</td></tr>
<tr><td>4</td><td>PO bấm thử một prototype Figma của thông báo "Mua thêm X đ"</td><td><strong>Q2</strong></td><td>Prototype trải nghiệm người dùng — hướng nghiệp vụ, hỗ trợ đội trước khi code.</td></tr>
<tr><td>5</td><td>Phiên exploratory 90 phút: "khám phá trang thanh toán với voucher và việc bỏ bớt món để tìm lỗi tính phí"</td><td><strong>Q3</strong></td><td>Hướng nghiệp vụ, phê bình tính năng đã làm; làm tay, hướng người dùng.</td></tr>
<tr><td>6</td><td>Năm sinh viên thử mua sách trong khi được quan sát; PO nghiệm thu story ở sprint review</td><td><strong>Q3</strong></td><td>Usability testing và user acceptance testing.</td></tr>
<tr><td>7</td><td>JMeter: 2.000 lượt thanh toán đồng thời, phân vị 95 của thời gian cập nhật phí ≤ 1 giây (AC5)</td><td><strong>Q4</strong></td><td>Test hiệu năng/tải — hướng kỹ thuật, phê bình sản phẩm bằng công cụ.</td></tr>
<tr><td>8</td><td>Quét bảo mật OWASP ZAP trang thanh toán</td><td><strong>Q4</strong></td><td>Kiểm thử bảo mật — phê bình hướng kỹ thuật, tự động.</td></tr>
</tbody>
</table>
<p>Cả bốn quadrant cùng hoạt động cho một story nhỏ: developer lo Q1, cả đội định hình Q2, tester dẫn Q3, chuyên gia và công cụ phủ Q4. Đối chiếu thêm với kim tự tháp: test 1–2 nhiều và nhanh (đáy), test 3 là vài kịch bản UI/API (tầng trên), test 5–6 hoàn toàn không tự động.</p>
<div class="pitfall"><b>Ba nhầm lẫn kinh điển.</b> (1) <b>TDD ≠ BDD</b>: TDD là unit test hướng developer, dẫn dắt code; BDD là kịch bản hành vi đọc được bằng ngôn ngữ nghiệp vụ (hay được gọi là "TDD ở cấp tính năng, bằng ngôn ngữ của nghiệp vụ"). (2) <b>Quadrant không phải là pha</b> — "Q1 làm trước, Q4 làm sau cùng" là sai. (3) <b>Usability thuộc Q3, hiệu năng và bảo mật thuộc Q4</b>; "functional test và prototype" thuộc Q2, không phải Q3. Còn trong kim tự tháp, <em>đáy</em> có nhiều test nhất.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>DevOps, continuous testing và kiểm thử trên production.</b> Đội hiện đại gộp các phương pháp này vào một pipeline <b>DevOps</b>: unit test TDD, kịch bản BDD và các kiểm tra Q4 tự động chạy ở mọi thay đổi (<b>continuous testing</b>), và đội tự đo bằng bốn <b>DORA metrics</b> — tần suất deploy, lead time của thay đổi, tỉ lệ thay đổi gây lỗi, thời gian khôi phục. Ngoài pipeline, <b>testing in production</b> — feature flag, canary release, A/B test, giám sát người dùng thật — coi lưu lượng thật là môi trường test cuối cùng (vế "shift-right" đối xứng với shift-left). Một số đội còn làm "từ ngoài vào trong": viết kịch bản Gherkin đang fail trước, rồi dùng TDD dẫn dắt code tới khi kịch bản pass — đúng con đường của bài tập 1 và 2. <em>Ngoài giáo trình vì CTFL-AT dừng ở khái niệm TDD/ATDD/BDD, kim tự tháp và quadrant.</em></div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&amp;reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện TDD: red-green-refactor với JUnit</span><span class="lc-sub">Viết test trước, rồi viết code — trên CodeLab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>`),
    books([
      ['agile', 'ISTQB Agile Tester in a Nutshell — p.19 (objectives of §3.1: TDD, ATDD, BDD, test pyramid, testing quadrants, the tester in a Scrum team), p.20 ("given a user story, write ATDD test cases")', 'ISTQB Agile Tester in a Nutshell — tr.19 (chuẩn đầu ra §3.1: TDD, ATDD, BDD, test pyramid, testing quadrants, tester trong đội Scrum), tr.20 ("cho một user story, viết test case ATDD")'],
      ['junit', 'Ch.20 Test Driven Development with JUnit 5, PDF p.420 (§20.2 the flights-management application p.422, §20.4 refactoring p.432, §20.5 new features by working TDD p.437); Ch.21 Behavior Driven Development with JUnit 5, PDF p.452 (§21.1 introducing BDD p.453, §21.2 Cucumber p.456, §21.3 JBehave p.476); Ch.22 Implementing a test pyramid strategy, PDF p.493 (§22.1 testing levels p.494, §22.2 unit p.495, §22.3 integration p.505)', 'Ch.20 Test Driven Development with JUnit 5, PDF tr.420 (§20.2 ứng dụng quản lý chuyến bay tr.422, §20.4 refactor tr.432, §20.5 thêm tính năng theo TDD tr.437); Ch.21 Behavior Driven Development with JUnit 5, PDF tr.452 (§21.1 giới thiệu BDD tr.453, §21.2 Cucumber tr.456, §21.3 JBehave tr.476); Ch.22 Implementing a test pyramid strategy, PDF tr.493 (§22.1 các cấp test tr.494, §22.2 unit tr.495, §22.3 integration tr.505)'],
      ['sp5', 'PDF p.95 — "test-first programming" / test-driven development; PDF p.56 and p.308 — BDD and ATDD notations for acceptance criteria; §3.2 PDF pp.82–84 — iterative-incremental and agile models', 'PDF tr.95 — "test-first programming" / test-driven development; PDF tr.56 và tr.308 — cách viết acceptance criteria kiểu BDD và ATDD; §3.2 PDF tr.82–84 — mô hình lặp-tăng dần và Agile'],
    ]),
  ].join('\n'),
};

/* ───────────────── 9.7 Quality risks, estimation, techniques, tools (syllabus 3.2–3.4) ───────────────── */
const L97 = {
  title: '9.7 — Quality risks, estimating test effort, Agile test techniques and tools|||9.7 — Rủi ro chất lượng, ước lượng công sức test, kỹ thuật và công cụ kiểm thử Agile',
  slug: 'swt301-agile-risk-estimation',
  type: 'DOCUMENT',
  description: 'Bài bổ sung (syllabus Agile Tester 3.2–3.4): đánh giá rủi ro chất lượng trong iteration, planning poker, acceptance criteria và Definition of Done, kỹ thuật hộp đen cho story, exploratory testing có charter, công cụ trong dự án Agile — kèm bài tập ma trận rủi ro và một vòng planning poker.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lesson 9.7 · Agile Tester syllabus §3.2–3.4 (not on the slides)</span>
<h2>How much to test, how long it takes, and how to test it</h2>
<p class="lead">The last part of the syllabus turns Chapter 5 (risk, estimation) and Chapter 4 (techniques) into Agile form. Risks are assessed <strong>per story, in every iteration</strong>; effort is estimated <strong>by the whole team</strong>, usually with <strong>planning poker</strong>; the test basis is the story plus its <strong>acceptance criteria</strong>; black-box techniques still design the tests; <strong>exploratory testing</strong> is run in time-boxed sessions; and a set of tools supports the team.</p>
<div class="callout"><b>Learning objectives (syllabus §3.2–3.4).</b> FA-3.2.1 Assess quality risks within an Agile project (K3) · FA-3.2.2 Estimate testing effort based on iteration content and quality risks (K3) · FA-3.3.1 Interpret relevant information to support testing activities (K2) · FA-3.3.2 Explain to business stakeholders how to define testable acceptance criteria (K2) · FA-3.3.3 Given a user story, write ATDD test cases (K3) · FA-3.3.4 Write test cases for functional and non-functional behaviour using black-box techniques based on user stories (K3) · FA-3.3.5 Perform exploratory testing to support the testing of an Agile project (K3) · FA-3.4.1 Recall different tools available to testers according to their purpose and to the activities in Agile projects (K1).</div>`,
    `<span class="eyebrow">Chương 9 · Bài 9.7 · Syllabus Agile Tester §3.2–3.4 (không có trên slide)</span>
<h2>Test bao nhiêu, mất bao lâu, và test bằng cách nào</h2>
<p class="lead">Phần cuối syllabus chuyển Chương 5 (rủi ro, ước lượng) và Chương 4 (kỹ thuật) sang dạng Agile. Rủi ro được đánh giá <strong>theo từng story, ở mọi iteration</strong>; công sức được ước lượng <strong>bởi cả đội</strong>, thường bằng <strong>planning poker</strong>; test basis là story cùng <strong>acceptance criteria</strong> của nó; kỹ thuật hộp đen vẫn là thứ thiết kế test; <strong>exploratory testing</strong> chạy theo các phiên có giới hạn thời gian; và một bộ công cụ hỗ trợ cả đội.</p>
<div class="callout"><b>Chuẩn đầu ra (syllabus §3.2–3.4).</b> FA-3.2.1 Đánh giá rủi ro chất lượng trong dự án Agile (K3) · FA-3.2.2 Ước lượng công sức test dựa trên nội dung iteration và rủi ro chất lượng (K3) · FA-3.3.1 Diễn giải thông tin liên quan để hỗ trợ hoạt động kiểm thử (K2) · FA-3.3.2 Giải thích cho các bên nghiệp vụ cách định nghĩa acceptance criteria kiểm thử được (K2) · FA-3.3.3 Cho một user story, viết test case ATDD (K3) · FA-3.3.4 Viết test case cho hành vi chức năng và phi chức năng bằng kỹ thuật hộp đen dựa trên user story (K3) · FA-3.3.5 Thực hiện exploratory testing để hỗ trợ kiểm thử trong dự án Agile (K3) · FA-3.4.1 Nhắc lại các công cụ dành cho tester theo mục đích và theo hoạt động trong dự án Agile (K1).</div>`),
    bi(`<h3>1. Assessing quality risks in an iteration (FA-3.2.1)</h3>
<p>A <em>quality (product) risk</em> is a possible problem with the product's quality (lesson 5.5: risk level = likelihood × impact). In Agile the analysis happens at two moments: high-level in <strong>release planning</strong>, detailed per story in <strong>iteration planning</strong> (deck slides 69 and 71). The syllabus steps: gather the team (power of three), list the stories of the iteration, <strong>identify the quality risks</strong> of each story (functional and non-functional), <strong>assess</strong> each one — categorise it and give likelihood and impact —, decide the <strong>extent of testing</strong> proportional to the risk level, then choose the <strong>mitigation</strong>: which test techniques, levels and types, and in which order. High-risk stories are tested earlier and more thoroughly; the risk list is revisited during the iteration.</p>
<h3>2. Estimating test effort — planning poker (FA-3.2.2)</h3>
<p>Estimation in Agile is done by the team, for the <em>whole</em> story (development <em>and</em> testing), usually in relative <strong>story points</strong>. <strong>Planning poker</strong> is a consensus-based expert technique: each member holds cards with a modified Fibonacci series (0, 1, 2, 3, 5, 8, 13, 20, 40, 100, ?, and sometimes ☕); the PO reads a story; everyone picks a card <em>privately</em>; all cards are turned at the same time (so nobody anchors on the senior's number); the <strong>highest and lowest</strong> estimators explain their reasons; the team discusses and votes again until the estimates converge. The Fibonacci gaps express that larger items are more uncertain. Inputs that change an estimate: story size and complexity, <strong>quality risk level</strong>, the test levels and types needed, the Definition of Done, available test automation, and the team's velocity. The tester's typical contribution is the testing effort others forget: boundary cases, non-functional checks, regression, test data.</p>
<h3>3. Acceptance criteria, adequate coverage and other information (FA-3.3.1, 3.3.2)</h3>
<p>Test basis sources in Agile: user stories and their acceptance criteria, experience from previous projects, existing functions and defects, feedback from users, domain and competitor knowledge, architecture and design notes, and conversations. <strong>Acceptance criteria</strong> should cover (syllabus list): <em>functional behaviour</em> (externally observable behaviour for given inputs), <em>quality characteristics</em> (performance, reliability, usability…), <em>scenarios / use cases</em>, <em>business rules</em>, <em>external interfaces</em>, <em>constraints</em> (design, implementation) and <em>data definitions</em> (format, type, valid ranges). To explain testable criteria to business people: each criterion must be <strong>specific, measurable and checkable as pass/fail</strong> ("fast" → "≤ 1 s for 95 % of requests with 50 users"), stated from the user's viewpoint, and agreed by the three amigos. The <strong>Definition of Done</strong> gives the exit criteria at each level — unit (tests written and passing, code reviewed, static analysis clean), integration, system, <strong>user story</strong> (acceptance tests pass, no open severe defects, NFRs checked), feature, iteration and release (coverage, quality, time, cost targets met).</p>`,
      `<h3>1. Đánh giá rủi ro chất lượng trong iteration (FA-3.2.1)</h3>
<p><em>Rủi ro chất lượng (rủi ro sản phẩm)</em> là một vấn đề có thể xảy ra với chất lượng sản phẩm (bài 5.5: mức rủi ro = khả năng xảy ra × mức ảnh hưởng). Trong Agile việc phân tích diễn ra ở hai thời điểm: mức cao trong <strong>release planning</strong>, chi tiết theo từng story trong <strong>iteration planning</strong> (slide 69 và 71 của bộ slide). Các bước theo syllabus: tập hợp đội (power of three), liệt kê các story của iteration, <strong>xác định rủi ro chất lượng</strong> của từng story (chức năng và phi chức năng), <strong>đánh giá</strong> từng rủi ro — phân loại và cho điểm khả năng xảy ra, mức ảnh hưởng —, quyết định <strong>mức độ kiểm thử</strong> tương xứng với mức rủi ro, rồi chọn cách <strong>giảm thiểu</strong>: kỹ thuật, cấp và loại test nào, theo thứ tự nào. Story rủi ro cao được test sớm hơn và kỹ hơn; danh sách rủi ro được xem lại trong suốt iteration.</p>
<h3>2. Ước lượng công sức test — planning poker (FA-3.2.2)</h3>
<p>Trong Agile, ước lượng do cả đội làm, cho <em>toàn bộ</em> story (phát triển <em>và</em> kiểm thử), thường bằng <strong>story point</strong> tương đối. <strong>Planning poker</strong> là kỹ thuật chuyên gia dựa trên đồng thuận: mỗi người cầm bộ bài theo dãy Fibonacci biến thể (0, 1, 2, 3, 5, 8, 13, 20, 40, 100, ?, đôi khi có ☕); PO đọc một story; mỗi người chọn một lá <em>riêng tư</em>; tất cả lật bài cùng lúc (để không ai bị "neo" theo số của người có thâm niên); người ra số <strong>cao nhất và thấp nhất</strong> giải thích lý do; đội thảo luận và bỏ phiếu lại tới khi các ước lượng hội tụ. Khoảng cách Fibonacci thể hiện rằng hạng mục càng lớn càng bất định. Các yếu tố làm thay đổi ước lượng: kích thước và độ phức tạp story, <strong>mức rủi ro chất lượng</strong>, các cấp và loại test cần làm, Definition of Done, mức tự động hoá test sẵn có, và velocity của đội. Đóng góp điển hình của tester là phần công sức test mà người khác hay quên: ca biên, kiểm tra phi chức năng, hồi quy, dữ liệu test.</p>
<h3>3. Acceptance criteria, độ phủ đầy đủ và thông tin khác (FA-3.3.1, 3.3.2)</h3>
<p>Nguồn test basis trong Agile: user story và acceptance criteria của nó, kinh nghiệm từ dự án trước, chức năng và defect đang có, phản hồi của người dùng, hiểu biết về lĩnh vực và đối thủ, ghi chú kiến trúc và thiết kế, và các cuộc trao đổi. <strong>Acceptance criteria</strong> nên bao trùm (danh sách syllabus): <em>hành vi chức năng</em> (hành vi quan sát được từ bên ngoài với đầu vào cho trước), <em>đặc tính chất lượng</em> (hiệu năng, độ tin cậy, khả năng sử dụng…), <em>kịch bản / use case</em>, <em>quy tắc nghiệp vụ</em>, <em>giao diện bên ngoài</em>, <em>ràng buộc</em> (thiết kế, cài đặt) và <em>định nghĩa dữ liệu</em> (định dạng, kiểu, miền giá trị hợp lệ). Để giải thích cho người nghiệp vụ thế nào là tiêu chí kiểm thử được: mỗi tiêu chí phải <strong>cụ thể, đo được và kiểm được theo kiểu đạt/không đạt</strong> ("nhanh" → "≤ 1 giây cho 95% yêu cầu với 50 người dùng"), phát biểu từ góc nhìn người dùng, và được three amigos thống nhất. <strong>Definition of Done</strong> đưa ra exit criteria ở mỗi cấp — unit (test đã viết và pass, code đã review, phân tích tĩnh sạch), tích hợp, hệ thống, <strong>user story</strong> (acceptance test pass, không còn defect nghiêm trọng mở, đã kiểm NFR), tính năng, iteration và release (đạt mục tiêu độ phủ, chất lượng, thời gian, chi phí).</p>`),
    bi(`<h3>4. Functional and non-functional black-box testing, ATDD (FA-3.3.3, 3.3.4)</h3>
<p>Stories are a test basis like any other, so Chapter 4 techniques apply directly: <strong>equivalence partitioning and boundary value analysis</strong> on amounts and ranges (US-17: 499,999 / 500,000), <strong>decision tables</strong> for combinations of business rules (voucher × membership × region), <strong>state transition</strong> for workflows (order: new → paid → shipped → delivered), <strong>use-case / scenario</strong> testing for end-to-end flows. Non-functional criteria (performance, security, usability) become tests too — often in Q4. ATDD test cases are written from the acceptance criteria as concrete examples — see worked example 1 of lesson 9.6.</p>
<h3>5. Exploratory testing in Agile (FA-3.3.5)</h3>
<p>Because the test basis is lightweight and changes every iteration, <strong>exploratory testing</strong> is essential: test design and execution happen at the same time, guided by a <strong>test charter</strong>, in a <strong>time-boxed session</strong> (typically 60–120 minutes). The syllabus lists what a charter may contain: <em>actor</em> (intended user), <em>purpose</em> (the charter's theme and objective), <em>set-up</em> (what must be in place), <em>priority</em>, <em>reference</em> (specs, story, risks), <em>data</em>, <em>activities</em> (ideas of what to do), <em>oracle notes</em> (how to judge results), <em>variations</em>. Session-based test management adds a short <strong>debriefing</strong> after each session (what was tested, what was found, what remains). Heuristics help generate ideas — boundaries, CRUD, configurations, interruptions, "what if the user…". Results are recorded (notes, screenshots, defect reports) so the knowledge is shared; good findings become new automated regression tests.</p>
<h3>6. Tools in Agile projects (FA-3.4.1)</h3>
<table>
<thead><tr><th>Purpose</th><th>Examples</th></tr></thead>
<tbody>
<tr><td>Task management and tracking</td><td>Electronic task boards and backlogs with burndown charts (Jira, Azure Boards, Trello); they capture stories, tasks, estimates, test tasks and progress</td></tr>
<tr><td>Communication and information sharing</td><td>Wikis (Confluence) for test charters, dashboards, product knowledge; instant messaging, video calls, desktop sharing for distributed teams</td></tr>
<tr><td>Software build and distribution</td><td>CI servers and build tools (Jenkins, GitHub Actions, GitLab CI, Maven, Gradle) — daily build, deployment, automated test run (lesson 9.3)</td></tr>
<tr><td>Configuration management</td><td>Version control for code <em>and</em> automated tests (Git); tests are stored and versioned with the code they test</td></tr>
<tr><td>Test design, implementation and execution</td><td>Test design tools (mind maps), test-case management, test-data preparation and generation, test-data load tools, automated test execution (JUnit for TDD, Cucumber/JBehave for ATDD/BDD, Selenium/Playwright for UI), exploratory-test recording tools</td></tr>
<tr><td>Cloud computing and virtualisation</td><td>Virtual machines and containers (Docker) to create test environments and test data on demand, so testers are not blocked waiting for an environment</td></tr>
</tbody>
</table>`,
      `<h3>4. Kiểm thử hộp đen chức năng và phi chức năng, ATDD (FA-3.3.3, 3.3.4)</h3>
<p>Story là một test basis như mọi test basis khác, nên kỹ thuật Chương 4 áp dụng thẳng: <strong>phân vùng tương đương và phân tích giá trị biên</strong> cho số tiền và miền giá trị (US-17: 499.999 / 500.000), <strong>bảng quyết định</strong> cho tổ hợp quy tắc nghiệp vụ (voucher × hạng thành viên × khu vực), <strong>chuyển trạng thái</strong> cho luồng công việc (đơn hàng: mới → đã thanh toán → đã gửi → đã giao), kiểm thử <strong>use case / kịch bản</strong> cho luồng end-to-end. Tiêu chí phi chức năng (hiệu năng, bảo mật, khả năng sử dụng) cũng thành test — thường ở Q4. Test case ATDD được viết từ acceptance criteria dưới dạng ví dụ cụ thể — xem bài tập 1 của bài 9.6.</p>
<h3>5. Exploratory testing trong Agile (FA-3.3.5)</h3>
<p>Vì test basis gọn nhẹ và đổi mỗi iteration, <strong>exploratory testing</strong> là thiết yếu: thiết kế và thực thi test diễn ra cùng lúc, dưới sự dẫn dắt của một <strong>test charter</strong>, trong một <strong>phiên có giới hạn thời gian</strong> (thường 60–120 phút). Syllabus liệt kê những gì một charter có thể gồm: <em>actor</em> (người dùng giả định), <em>purpose</em> (chủ đề và mục tiêu của charter), <em>set-up</em> (những gì phải có sẵn), <em>priority</em> (độ ưu tiên), <em>reference</em> (đặc tả, story, rủi ro), <em>data</em> (dữ liệu), <em>activities</em> (ý tưởng việc sẽ làm), <em>oracle notes</em> (cách phán kết quả), <em>variations</em> (biến thể). Session-based test management thêm một buổi <strong>debriefing</strong> ngắn sau mỗi phiên (đã test gì, tìm được gì, còn lại gì). Heuristic giúp nảy ý tưởng — biên, CRUD, cấu hình, bị ngắt giữa chừng, "nếu người dùng…". Kết quả được ghi lại (ghi chú, ảnh chụp, báo cáo defect) để chia sẻ kiến thức; phát hiện tốt trở thành test hồi quy tự động mới.</p>
<h3>6. Công cụ trong dự án Agile (FA-3.4.1)</h3>
<table>
<thead><tr><th>Mục đích</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Quản lý và theo dõi công việc</td><td>Task board và backlog điện tử có burndown chart (Jira, Azure Boards, Trello); ghi lại story, task, ước lượng, task kiểm thử và tiến độ</td></tr>
<tr><td>Giao tiếp và chia sẻ thông tin</td><td>Wiki (Confluence) cho test charter, dashboard, kiến thức sản phẩm; nhắn tin, gọi video, chia sẻ màn hình cho đội phân tán</td></tr>
<tr><td>Build và phân phối phần mềm</td><td>CI server và công cụ build (Jenkins, GitHub Actions, GitLab CI, Maven, Gradle) — build hằng ngày, triển khai, chạy test tự động (bài 9.3)</td></tr>
<tr><td>Quản lý cấu hình</td><td>Quản lý phiên bản cho code <em>và</em> test tự động (Git); test được lưu và đánh phiên bản cùng code mà nó kiểm</td></tr>
<tr><td>Thiết kế, cài đặt và thực thi test</td><td>Công cụ thiết kế test (mind map), quản lý test case, chuẩn bị và sinh dữ liệu test, nạp dữ liệu test, thực thi test tự động (JUnit cho TDD, Cucumber/JBehave cho ATDD/BDD, Selenium/Playwright cho UI), công cụ ghi lại phiên exploratory</td></tr>
<tr><td>Điện toán đám mây và ảo hoá</td><td>Máy ảo và container (Docker) để tạo môi trường và dữ liệu test theo yêu cầu, để tester không bị kẹt chờ môi trường</td></tr>
</tbody>
</table>`),
    bi(`<h3>Ví dụ có lời giải · Worked example A — a quality-risk matrix for the next iteration</h3>
<p>Likelihood (L) and impact (I) on a 1–3 scale; risk level = L × I; 6–9 = high, 3–4 = medium, 1–2 = low.</p>
<table>
<thead><tr><th>Risk</th><th>L</th><th>I</th><th>Level</th><th>Extent and kind of testing</th></tr></thead>
<tbody>
<tr><td>R1 MoMo payment charged twice (US-12)</td><td>2</td><td>3</td><td><strong>6 high</strong></td><td>Test first and deepest: decision table of payment states, state-transition tests (timeout, retry, callback twice), exploratory session, automated API regression</td></tr>
<tr><td>R2 Free shipping applied at the wrong boundary (US-17)</td><td>3</td><td>2</td><td><strong>6 high</strong></td><td>BVA 499,999 / 500,000, voucher combinations, automated Scenario Outline (lesson 9.6)</td></tr>
<tr><td>R3 Order history &gt; 2 s for a customer with 1,000 orders (US-20)</td><td>2</td><td>2</td><td>4 medium</td><td>One performance test with a large data set; functional tests on typical data</td></tr>
<tr><td>R4 Reset-password e-mail lands in spam (US-09)</td><td>2</td><td>1</td><td>2 low</td><td>A quick check with two mail providers</td></tr>
<tr><td>R5 Wishlist icon misaligned on iPhone SE (US-22)</td><td>1</td><td>1</td><td>1 low</td><td>Covered by the normal UI check; no dedicated test</td></tr>
</tbody>
</table>
<p><em>Scores computed by a script.</em> Consequence for planning: US-12 and US-17 get their test tasks first on the board and the tester pairs with the developers there; R4 and R5 are accepted as low risks.</p>
<h3>Ví dụ có lời giải · Worked example B — one planning-poker round for US-17</h3>
<p>Deck: 0, 1, 2, 3, 5, 8, 13, 20, 40, 100, ?. Team: Lan, Minh, Tuấn (developers), Hoa (tester). The PO reads US-17 and its five acceptance criteria.</p>
<table>
<thead><tr><th>Round</th><th>Lan</th><th>Minh</th><th>Tuấn</th><th>Hoa</th><th>What happens</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>3</td><td>2</td><td>8</td><td>Spread 2–8. Tuấn (lowest): "it is one if-statement". Hoa (highest): "the <em>testing</em> is not one if-statement — two boundaries, voucher rule, message recalculation, the 1-second NFR, and a regression of the whole checkout".</td></tr>
<tr><td>2</td><td>5</td><td>5</td><td>5</td><td>8</td><td>The developers now see the test work. Hoa explains her 8: there is no automated checkout regression yet. Minh: the Cucumber set-up exists from US-11, so automation is cheaper than she thinks.</td></tr>
<tr><td>3</td><td>5</td><td>5</td><td>5</td><td>5</td><td>Consensus: <strong>5 points</strong> — the value used in lesson 9.4.</td></tr>
</tbody>
</table>
<p>Why it works: cards are shown simultaneously (no anchoring), only the extremes explain (fast), and the tester's view moves the estimate from 3 to 5 — without her the story would have been under-estimated by ignoring testing, exactly what deck slide 72 warns against. <em>Rounds checked by a script (values on the deck, consensus only in round 3).</em></p>
<h3>Ví dụ có lời giải · Worked example C — a test charter for an exploratory session</h3>
<table>
<tbody>
<tr><td>Charter</td><td>Explore the checkout page with vouchers and item changes to discover wrong shipping fees or misleading messages</td></tr>
<tr><td>Actor / set-up</td><td>Registered customer; staging build of today; three vouchers (GIAM50K, GIAM10%, FREESHIP) loaded</td></tr>
<tr><td>Reference / risk</td><td>US-17 AC1–AC5; risk R2</td></tr>
<tr><td>Ideas (activities)</td><td>Hit exactly 500,000 with and without voucher; remove/add items quickly; change quantity to 0; stack two vouchers; go back in the browser after paying; slow 3G network for AC5</td></tr>
<tr><td>Oracle notes</td><td>Fee = 0 iff total after voucher ≥ 500,000; message amount = 500,000 − total</td></tr>
<tr><td>Time box</td><td>90 minutes, then a 10-minute debrief with the PO</td></tr>
</tbody>
</table>
<div class="pitfall"><b>Estimation traps.</b> (1) "Testers estimate testing separately after developers estimate coding" — no: the whole team estimates the whole story including testing. (2) "In planning poker the most senior person's estimate is taken" — no: cards are revealed together and the team converges by discussion. (3) "Exploratory testing is unplanned ad-hoc testing" — no: it is structured by charters and time boxes, and its results are recorded.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why story points and not hours — and the #NoEstimates debate.</b> Story points measure <em>relative size</em> (US-17 is "about half of" an 8-point story), which people judge more reliably than absolute hours; velocity then converts points to time from real data. Some teams go further (#NoEstimates, Vasco Duarte): they split every story to roughly the same small size and simply count stories per sprint, which removes estimation meetings but requires strong story-splitting skills — the "S" of INVEST done well. <em>Outside the syllabus because CTFL-AT only requires you to apply planning poker, not to compare estimation philosophies.</em></div>`,
      `<h3>Ví dụ có lời giải · Bài tập A — ma trận rủi ro chất lượng cho iteration tới</h3>
<p>Khả năng xảy ra (L) và mức ảnh hưởng (I) theo thang 1–3; mức rủi ro = L × I; 6–9 = cao, 3–4 = trung bình, 1–2 = thấp.</p>
<table>
<thead><tr><th>Rủi ro</th><th>L</th><th>I</th><th>Mức</th><th>Mức độ và loại kiểm thử</th></tr></thead>
<tbody>
<tr><td>R1 Thanh toán MoMo bị trừ tiền hai lần (US-12)</td><td>2</td><td>3</td><td><strong>6 cao</strong></td><td>Test sớm nhất và sâu nhất: bảng quyết định các trạng thái thanh toán, test chuyển trạng thái (timeout, thử lại, callback hai lần), một phiên exploratory, hồi quy API tự động</td></tr>
<tr><td>R2 Miễn phí ship áp sai ở biên (US-17)</td><td>3</td><td>2</td><td><strong>6 cao</strong></td><td>BVA 499.999 / 500.000, tổ hợp voucher, Scenario Outline tự động (bài 9.6)</td></tr>
<tr><td>R3 Lịch sử đơn hàng &gt; 2 giây với khách có 1.000 đơn (US-20)</td><td>2</td><td>2</td><td>4 trung bình</td><td>Một test hiệu năng với bộ dữ liệu lớn; test chức năng trên dữ liệu thông thường</td></tr>
<tr><td>R4 E-mail đặt lại mật khẩu rơi vào spam (US-09)</td><td>2</td><td>1</td><td>2 thấp</td><td>Kiểm nhanh với hai nhà cung cấp mail</td></tr>
<tr><td>R5 Biểu tượng wishlist lệch trên iPhone SE (US-22)</td><td>1</td><td>1</td><td>1 thấp</td><td>Nằm trong lượt kiểm UI thông thường; không có test riêng</td></tr>
</tbody>
</table>
<p><em>Điểm do script tính.</em> Hệ quả cho kế hoạch: task kiểm thử của US-12 và US-17 được đưa lên bảng trước và tester làm cặp với developer ở đó; R4 và R5 được chấp nhận là rủi ro thấp.</p>
<h3>Ví dụ có lời giải · Bài tập B — một vòng planning poker cho US-17</h3>
<p>Bộ bài: 0, 1, 2, 3, 5, 8, 13, 20, 40, 100, ?. Đội: Lan, Minh, Tuấn (developer), Hoa (tester). PO đọc US-17 và năm acceptance criteria.</p>
<table>
<thead><tr><th>Vòng</th><th>Lan</th><th>Minh</th><th>Tuấn</th><th>Hoa</th><th>Diễn biến</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>3</td><td>2</td><td>8</td><td>Chênh 2–8. Tuấn (thấp nhất): "chỉ là một câu if". Hoa (cao nhất): "phần <em>kiểm thử</em> không phải một câu if — hai giá trị biên, quy tắc voucher, tính lại thông báo, NFR 1 giây, và hồi quy toàn bộ trang thanh toán".</td></tr>
<tr><td>2</td><td>5</td><td>5</td><td>5</td><td>8</td><td>Developer giờ đã thấy phần việc test. Hoa giải thích số 8: chưa có bộ hồi quy tự động cho trang thanh toán. Minh: phần dựng Cucumber đã có sẵn từ US-11 nên tự động hoá rẻ hơn Hoa nghĩ.</td></tr>
<tr><td>3</td><td>5</td><td>5</td><td>5</td><td>5</td><td>Đồng thuận: <strong>5 point</strong> — đúng con số dùng ở bài 9.4.</td></tr>
</tbody>
</table>
<p>Vì sao hiệu quả: lật bài cùng lúc (không bị neo số), chỉ hai người ở hai đầu giải thích (nhanh), và góc nhìn của tester kéo ước lượng từ 3 lên 5 — không có Hoa, story đã bị ước thiếu vì quên phần test, đúng điều slide 72 cảnh báo. <em>Các vòng đã được kiểm bằng script (giá trị nằm trong bộ bài, chỉ vòng 3 đồng thuận).</em></p>
<h3>Ví dụ có lời giải · Bài tập C — một test charter cho phiên exploratory</h3>
<table>
<tbody>
<tr><td>Charter</td><td>Khám phá trang thanh toán với voucher và thay đổi món hàng để tìm phí ship sai hoặc thông báo gây hiểu nhầm</td></tr>
<tr><td>Actor / set-up</td><td>Khách đã đăng ký; bản build staging hôm nay; nạp sẵn ba voucher (GIAM50K, GIAM10%, FREESHIP)</td></tr>
<tr><td>Reference / rủi ro</td><td>US-17 AC1–AC5; rủi ro R2</td></tr>
<tr><td>Ý tưởng (activities)</td><td>Chạm đúng 500.000 có và không có voucher; bỏ/thêm món thật nhanh; đổi số lượng về 0; chồng hai voucher; bấm Back trên trình duyệt sau khi thanh toán; mạng 3G chậm cho AC5</td></tr>
<tr><td>Oracle notes</td><td>Phí = 0 khi và chỉ khi tổng sau voucher ≥ 500.000; số tiền trong thông báo = 500.000 − tổng</td></tr>
<tr><td>Time box</td><td>90 phút, rồi debrief 10 phút với PO</td></tr>
</tbody>
</table>
<div class="pitfall"><b>Bẫy về ước lượng.</b> (1) "Tester ước lượng phần test riêng sau khi developer ước lượng phần code" — không: cả đội ước lượng toàn bộ story, gồm cả kiểm thử. (2) "Trong planning poker lấy ước lượng của người thâm niên nhất" — không: bài được lật cùng lúc và đội hội tụ qua thảo luận. (3) "Exploratory testing là test tuỳ hứng không kế hoạch" — không: nó được cấu trúc bằng charter và time box, và kết quả được ghi lại.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao dùng story point chứ không phải giờ — và tranh luận #NoEstimates.</b> Story point đo <em>kích thước tương đối</em> (US-17 "cỡ nửa" một story 8 point), thứ con người ước đoán đáng tin hơn số giờ tuyệt đối; velocity sau đó quy point ra thời gian bằng dữ liệu thật. Một số đội đi xa hơn (#NoEstimates, Vasco Duarte): chia mọi story về cỡ nhỏ gần như bằng nhau rồi chỉ đếm số story mỗi sprint — bỏ được các buổi ước lượng nhưng đòi hỏi kỹ năng chia story rất tốt — tức chữ "S" của INVEST làm tới nơi. <em>Ngoài giáo trình vì CTFL-AT chỉ yêu cầu áp dụng planning poker, không so sánh các triết lý ước lượng.</em></div>`),
    books([
      ['agile', 'ISTQB Agile Tester in a Nutshell — p.19 (objectives of §3.2: assess product quality risks, estimate testing effort based on iteration content and quality risks), p.20 (objectives of §3.3–3.4: testable acceptance criteria, ATDD test cases, black-box tests from user stories, exploratory testing, tools)', 'ISTQB Agile Tester in a Nutshell — tr.19 (chuẩn đầu ra §3.2: đánh giá rủi ro chất lượng sản phẩm, ước lượng công sức test theo nội dung iteration và rủi ro), tr.20 (chuẩn đầu ra §3.3–3.4: acceptance criteria kiểm thử được, test case ATDD, test hộp đen từ user story, exploratory testing, công cụ)'],
      ['sp5', 'Chapter 6 Test management — "Our Tip: estimating testing effort for agile projects" (team velocity and "planning poker"), PDF p.270; §6.2.4 testing and risk, PDF p.263; Chapter 5 black-box techniques (EP p.165, BVA p.176, state transition p.184, decision tables p.192), §5.3 experience-based incl. exploratory testing, PDF p.233; Chapter 7 tools, PDF p.303', 'Chương 6 Quản lý kiểm thử — "Our Tip: estimating testing effort for agile projects" (velocity của đội và "planning poker"), PDF tr.270; §6.2.4 kiểm thử và rủi ro, PDF tr.263; Chương 5 kỹ thuật hộp đen (EP tr.165, BVA tr.176, chuyển trạng thái tr.184, bảng quyết định tr.192), §5.3 dựa trên kinh nghiệm gồm exploratory testing, PDF tr.233; Chương 7 công cụ, PDF tr.303'],
      ['fst4', 'Ch.5 §5.2 test planning and estimation p.161 (metrics-based vs expert-based estimation — planning poker is expert-based) and §5.5 risks and testing p.183; Ch.4 §4.4 experience-based techniques p.140 (exploratory testing and charters)', 'Ch.5 §5.2 lập kế hoạch và ước lượng tr.161 (ước lượng theo số liệu vs theo chuyên gia — planning poker thuộc loại chuyên gia) và §5.5 rủi ro và kiểm thử tr.183; Ch.4 §4.4 kỹ thuật dựa trên kinh nghiệm tr.140 (exploratory testing và charter)'],
    ]),
  ].join('\n'),
};

/* ───────────────── Quiz 9 ───────────────── */
const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ9 = {
  title: 'Quiz 9 — Agile testing|||Quiz 9 — Kiểm thử Agile',
  slug: 'swt301-quiz-9',
  type: 'QUIZ',
  description: '24 câu phủ cả chương: Agile Manifesto, whole team, phản hồi sớm, XP/Scrum/Kanban, user story & INVEST, retrospective, CI, release/iteration planning, trạng thái kiểm thử, TDD/ATDD/BDD, test pyramid, quadrants, rủi ro, planning poker, exploratory testing (bộ slide Topic 8 không có slide Question).',
  quiz: {
    timeLimitSeconds: 1440,
    questions: [
      q('Which of the following is one of the four values of the Agile Manifesto? (Topic 8 s.7)|||Đâu là một trong bốn giá trị của Agile Manifesto? (Topic 8 s.7)', ['Following a plan over responding to change|||Bám theo kế hoạch hơn phản ứng với thay đổi', 'Comprehensive documentation over working software|||Tài liệu đầy đủ hơn phần mềm chạy được', 'Customer collaboration over contract negotiation|||Cộng tác với khách hàng hơn đàm phán hợp đồng', 'Processes and tools over individuals and interactions|||Quy trình và công cụ hơn cá nhân và tương tác'], 2),
      q('"Working software is the primary measure of progress" is… (s.12)|||"Phần mềm chạy được là thước đo chính của tiến độ" là… (s.12)', ['one of the 12 principles behind the Agile Manifesto|||một trong 12 nguyên tắc đằng sau Agile Manifesto', 'one of the four Manifesto values|||một trong bốn giá trị của Tuyên ngôn', 'an XP testing rule|||một luật kiểm thử của XP', 'a Scrum timebox|||một timebox của Scrum'], 0),
      q('Which statement about the Agile Manifesto is TRUE? (s.7, s.9)|||Phát biểu nào về Agile Manifesto là ĐÚNG? (s.7, s.9)', ['Agile projects produce no documentation|||Dự án Agile không tạo tài liệu nào', 'The items on the right still have value, but the items on the left are valued more|||Các mục bên phải vẫn có giá trị, nhưng các mục bên trái được coi trọng hơn', 'Agile teams do not plan|||Đội Agile không lập kế hoạch', 'Contracts are forbidden in Agile|||Hợp đồng bị cấm trong Agile'], 1),
      q('Involving testers, developers and business representatives in all feature discussions is called… (s.16)|||Việc có mặt tester, developer và đại diện nghiệp vụ trong mọi buổi bàn về tính năng gọi là… (s.16)', ['the power of three|||power of three', 'pair programming|||lập trình cặp', 'the Definition of Done|||Definition of Done', 'sprint zero|||sprint zero'], 0),
      q('Which is a benefit of the whole-team approach? (s.18)|||Đâu là một lợi ích của whole-team approach? (s.18)', ['Testers are no longer needed|||Không cần tester nữa', 'Quality becomes everyone\'s responsibility|||Chất lượng trở thành trách nhiệm của mọi người', 'Requirements never change|||Yêu cầu không bao giờ thay đổi', 'Documentation is eliminated|||Tài liệu bị loại bỏ'], 1),
      q('Which is a benefit of early and frequent feedback? (s.22)|||Đâu là lợi ích của phản hồi sớm và thường xuyên? (s.22)', ['It avoids requirements misunderstandings that would be expensive to fix later|||Tránh hiểu nhầm yêu cầu vốn sẽ tốn kém nếu sửa muộn', 'It removes the need for regression testing|||Không cần kiểm thử hồi quy nữa', 'It fixes the scope at the start of the project|||Chốt cứng phạm vi ngay đầu dự án', 'It lets the customer see the product only at the end|||Cho khách hàng chỉ thấy sản phẩm ở cuối'], 0),
      q('Which Agile approach prescribes test-first programming, unit tests for all code and pair programming? (s.35–36, s.41)|||Cách tiếp cận Agile nào quy định lập trình test-first, unit test cho mọi code và lập trình cặp? (s.35–36, s.41)', ['Scrum', 'Kanban', 'Extreme Programming (XP)', 'DSDM'], 2),
      q('In Scrum, who creates, maintains and prioritises the product backlog? (s.43)|||Trong Scrum, ai tạo, duy trì và xếp ưu tiên product backlog? (s.43)', ['The Scrum Master|||Scrum Master', 'The Product Owner|||Product Owner', 'The tester|||Tester', 'The project manager|||Quản lý dự án'], 1),
      q('Which statement about Kanban is correct? (s.46–47)|||Phát biểu nào về Kanban là đúng? (s.46–47)', ['Timeboxed sprints are mandatory|||Sprint theo timebox là bắt buộc', 'Each station pushes finished tickets to the next station regardless of its load|||Mỗi trạm đẩy ticket xong sang trạm sau bất kể trạm sau đang tải bao nhiêu', 'WIP limits cap the tickets per station and a station pulls work when it has capacity|||Giới hạn WIP chặn số ticket mỗi trạm và trạm kéo việc khi còn chỗ', 'Kanban defines three roles and five timeboxes|||Kanban định nghĩa ba vai trò và năm timebox'], 2),
      q('In INVEST, a story that is too big to finish in one iteration violates… (s.52)|||Trong INVEST, một story quá lớn để xong trong một iteration vi phạm… (s.52)', ['Independent|||Independent (độc lập)', 'Negotiable|||Negotiable (thương lượng được)', 'Small|||Small (nhỏ)', 'Valuable|||Valuable (có giá trị)'], 2),
      q('The 3 Cs of a user story are…|||3 chữ C của một user story là…', ['Card, Conversation, Confirmation|||Card, Conversation, Confirmation', 'Code, Compile, Commit|||Code, Compile, Commit', 'Customer, Contract, Change|||Customer, Contract, Change', 'Create, Check, Close|||Create, Check, Close'], 0),
      q('What is the main purpose of a retrospective? (s.53–54)|||Mục đích chính của retrospective là gì? (s.53–54)', ['To demonstrate the increment to stakeholders|||Demo increment cho các bên liên quan', 'To improve the team\'s process — what went well, what to improve, how|||Cải tiến quy trình của đội — điều gì tốt, điều gì cần cải thiện, cải thiện thế nào', 'To assign blame for defects|||Quy trách nhiệm cho các defect', 'To estimate the product backlog|||Ước lượng product backlog'], 1),
      q('Which is a RISK or challenge of continuous integration named on the slides? (s.64)|||Đâu là một RỦI RO hay thách thức của CI được nêu trên slide? (s.64)', ['Integration problems are found earlier|||Lỗi tích hợp được phát hiện sớm hơn', 'Teams over-rely on unit tests and do too little system and acceptance testing|||Đội quá tin unit test và làm quá ít system test, acceptance test', 'Executable software is always available|||Luôn có phần mềm chạy được', 'Repetitive manual testing is reduced|||Giảm test tay lặp đi lặp lại'], 1),
      q('According to the teacher\'s notes, with CI in place… (s.59–60)|||Theo ghi chú của thầy/cô, khi đã có CI… (s.59–60)', ['manual testing is no longer needed|||không cần test tay nữa', 'manual testing shifts to new features, changes and confirmation testing, plus exploratory testing|||test tay dời sang tính năng mới, thay đổi, confirmation testing và exploratory testing', 'testers only write unit tests|||tester chỉ viết unit test', 'regression testing is done once per release|||kiểm thử hồi quy làm mỗi release một lần'], 1),
      q('Which tester activity belongs to ITERATION planning rather than release planning? (s.69, s.71)|||Hoạt động nào của tester thuộc ITERATION planning chứ không phải release planning? (s.69, s.71)', ['Defining the necessary test levels|||Xác định các cấp kiểm thử cần thiết', 'Planning the testing for the release|||Lập kế hoạch kiểm thử cho release', 'Breaking user stories down into tasks, particularly testing tasks|||Chia user story thành task, đặc biệt là task kiểm thử', 'Estimating high-level test effort for the whole release|||Ước lượng công sức test mức cao cho cả release'], 2),
      q('A team finished 21, 18 and 24 points in its last three sprints. Using average velocity, how many points should it plan for the next sprint? (s.70)|||Một đội hoàn thành 21, 18 và 24 point trong ba sprint gần nhất. Theo velocity trung bình, sprint tới nên lên kế hoạch bao nhiêu point? (s.70)', ['18', '21', '24', '63'], 1),
      q('On a burndown chart the "remaining points" line stays flat for three days. The most likely meaning is…|||Trên burndown chart, đường "point còn lại" nằm ngang ba ngày liền. Ý nghĩa khả dĩ nhất là…', ['the team is idle|||đội đang ngồi chơi', 'work is in progress but no story has met the Definition of Done yet|||việc đang làm nhưng chưa story nào đạt Definition of Done', 'all stories are done|||mọi story đã xong', 'the sprint has been cancelled|||sprint đã bị huỷ'], 1),
      q('Which is a risk for a tester embedded in an Agile team, according to the syllabus?|||Theo syllabus, đâu là rủi ro với tester ngồi trong đội Agile?', ['Losing independence and becoming tolerant of inefficient practices|||Mất tính độc lập và trở nên dễ dãi với cách làm kém hiệu quả', 'Having too much time for testing|||Có quá nhiều thời gian để test', 'Not being allowed to attend the daily stand-up|||Không được dự daily stand-up', 'Being unable to use test tools|||Không được dùng công cụ test'], 0),
      q('In TDD, what is the FIRST step of each cycle?|||Trong TDD, bước ĐẦU TIÊN của mỗi vòng là gì?', ['Write the production code, then the test|||Viết code production, rồi tới test', 'Write a test for the new behaviour and see it fail|||Viết test cho hành vi mới và thấy nó fail', 'Refactor the existing code|||Refactor code đang có', 'Run the acceptance tests|||Chạy acceptance test'], 1),
      q('Which statement BEST describes BDD?|||Câu nào mô tả ĐÚNG NHẤT BDD?', ['Unit tests written by a developer only, in Java|||Unit test do riêng developer viết, bằng Java', 'Behaviour scenarios in Given/When/Then form that business people can read and tools such as Cucumber can execute|||Kịch bản hành vi dạng Given/When/Then mà người nghiệp vụ đọc được và công cụ như Cucumber chạy được', 'A load-testing technique|||Một kỹ thuật kiểm thử tải', 'A way to estimate stories|||Một cách ước lượng story'], 1),
      q('The test pyramid recommends…|||Test pyramid khuyến nghị…', ['more tests at the higher levels (UI) than at the lower levels|||nhiều test ở cấp cao (UI) hơn cấp thấp', 'a larger number of tests at the lower levels (unit) than at the higher levels|||nhiều test ở cấp thấp (unit) hơn các cấp cao', 'the same number of tests at every level|||số test như nhau ở mọi cấp', 'no automated tests at the unit level|||không có test tự động ở cấp unit'], 1),
      q('In the testing quadrants, performance, load and security tests belong to…|||Trong testing quadrants, test hiệu năng, tải và bảo mật thuộc…', ['Q1 — technology-facing, supporting the team|||Q1 — hướng kỹ thuật, hỗ trợ đội', 'Q2 — business-facing, supporting the team|||Q2 — hướng nghiệp vụ, hỗ trợ đội', 'Q3 — business-facing, critiquing the product|||Q3 — hướng nghiệp vụ, phê bình sản phẩm', 'Q4 — technology-facing, critiquing the product|||Q4 — hướng kỹ thuật, phê bình sản phẩm'], 3),
      q('In planning poker, after the first reveal the estimates are 2, 3, 3 and 8. What happens next?|||Trong planning poker, sau lần lật đầu tiên các ước lượng là 2, 3, 3 và 8. Tiếp theo làm gì?', ['Take the average, 4|||Lấy trung bình, 4', 'Take the estimate of the most senior developer|||Lấy ước lượng của developer thâm niên nhất', 'The people who chose 2 and 8 explain their reasons, then the team votes again|||Người chọn 2 và 8 giải thích lý do, rồi đội bỏ phiếu lại', 'The Scrum Master decides|||Scrum Master quyết định'], 2),
      q('Which statement about exploratory testing in Agile projects is correct?|||Phát biểu nào về exploratory testing trong dự án Agile là đúng?', ['It is unplanned and its results are not recorded|||Nó không có kế hoạch và kết quả không được ghi lại', 'It is guided by a test charter and run in time-boxed sessions, with results recorded and debriefed|||Nó được dẫn dắt bởi test charter và chạy theo phiên có giới hạn thời gian, kết quả được ghi lại và debrief', 'It replaces all automated tests|||Nó thay thế mọi test tự động', 'It can only be done after the release|||Chỉ làm được sau khi phát hành'], 1),
    ],
  },
};

export default {
  title: 'Chapter 9 — Agile testing|||Chương 9 — Agile testing',
  description: 'Topic 8 "ISTQB CTFL Agile Tester" (74 slide) học từng slide: Agile Manifesto, whole team, XP/Scrum/Kanban, user story & INVEST, retrospective, CI, release/iteration planning — cộng 3 bài bổ sung cho chương 2–3 của syllabus Agile Tester: trạng thái kiểm thử và vai trò tester, TDD/ATDD/BDD, test pyramid, quadrants, rủi ro, planning poker, exploratory testing — kèm bài có lời giải chạy thật và Quiz 24 câu.',
  lessons: [L91, L92, L93, L94, L95, L96, L97, QUIZ9],
};
