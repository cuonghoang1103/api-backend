/**
 * SWD392 · Chương 5 — dùng AI trong kiến trúc & thiết kế (bộ slide GenAI).
 * Bài 📑 học theo từng slide: swd27 (SWD392_GenAI.pptx (bộ slide cũ 2_SWD392), slide 1–18).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: swd392-on-ch5.
 * Quiz viết lại (10 câu, giữ slug swd392-quiz-5).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/SWD392/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node SWD392/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 5.A — 📑 Slide by slide · Applying AI in design: ChatGPT, PlantUML, Copilot, review (GenAI deck, slides 1–18) ───────── */
const L_swd27_1 = {
  title: '5.A — 📑 Slide by slide · Applying AI in design: ChatGPT, PlantUML, Copilot, review (GenAI deck, slides 1–18)|||5.A — 📑 Học theo từng slide · Dùng AI trong thiết kế: ChatGPT, PlantUML, Copilot, soát lỗi (bộ GenAI, slide 1–18)',
  slug: 'swd392-slide-swd27-1',
  type: 'VIDEO',
  description: 'Giảng đủ 18 slide bộ "Applying AI in Software Architecture and Design" của trường: dùng ChatGPT gợi ý actor/use case và viết mã PlantUML, thiết kế kiến trúc 3 tầng cho cửa hàng online (component + sequence dựng lại đúng ảnh slide), Copilot sinh Service/DAO, AI gợi ý Strategy cho thanh toán (code AI chạy thật và bản đã soát), so sánh pattern, chọn kiến trúc cho case Online Food Delivery. Mở rộng: khuôn prompt tốt, bốn lỗi AI hay mắc (nhầm include/extend, thiếu bội số, trộn tầng BCE, statechart thiếu guard) với bản sai và bản sửa dựng thật, quy định khai báo AI của Course Project, ví dụ trên LabFlow.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.A · school deck "Applying AI in Software Architecture and Design", slides 1–18</span>
<h2>Using AI as a design assistant — and checking every line it gives you</h2>
<p class="lead">This short deck (18 slides) shows how the course expects you to use three tools — <strong>ChatGPT</strong> (a chat assistant), <strong>PlantUML</strong> (text that becomes a UML diagram) and <strong>GitHub Copilot</strong> (code completion in the IDE) — at three moments of design: finding use cases, choosing and drawing an architecture, and picking design patterns. The last slide gives the rule that the whole lesson is built on: <em>AI is a supportive assistant, not a replacement for the designer; its outputs need validation and refinement.</em></p>
<p>Why it matters for you: the course project of SWD392 is officially "AI-assisted system design" — you may use AI, but you must <strong>declare</strong> every prompt and output and <strong>explain</strong> them yourself, and an individual AI rubric (up to 10 points) is part of the final grade. The syllabus also has its own learning outcome for this (CLO7). In LabFlow, the same skill decides whether an AI-drafted SRS/SDS diagram survives the defence committee's "why?".</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>You will be able to</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>goal, tools, CLOs</td><td>say what each tool is good for and which course outcome it serves</td></tr>
<tr><td>4–6</td><td>use case modeling with AI</td><td>write a prompt that yields actors and use cases, turn the answer into a PlantUML diagram, and find what the AI got wrong</td></tr>
<tr><td>7–10</td><td>system design with AI</td><td>ask for a layered architecture, read the component and sequence diagrams it produces, and review Copilot's Service/DAO code</td></tr>
<tr><td>11–14</td><td>design patterns with AI</td><td>get a pattern suggestion (Strategy for payment), run and fix the AI's Java code, compare alternatives</td></tr>
<tr><td>15–17</td><td>choosing an architecture with AI</td><td>compare styles for a real case (Online Food Delivery) and justify a component diagram and patterns</td></tr>
<tr><td>18</td><td>conclusion</td><td>apply a checklist to any AI-generated diagram before it goes into a report</td></tr>
</tbody>
</table>
<div class="callout"><strong>Read this first.</strong> The diagrams on slides 6 and 9 are screenshots of real ChatGPT/PlantUML output; they are redrawn here <em>exactly</em>. Every other "AI draft" in this lesson is an <strong>illustration written by the course author</strong> to show the errors AI tools typically make — each one is labelled, and the corrected version always follows. Material that is not on the slide is marked <strong>➕ Beyond the slide</strong>. Earlier lessons 5.1 (database design) and 5.2 (AI tools overview) stay on this chapter; this lesson goes slide by slide and deeper.</div>`,
    `<span class="eyebrow">Chương 5 · Bài 5.A · bộ slide "Applying AI in Software Architecture and Design" của trường, slide 1–18</span>
<h2>Dùng AI làm trợ lý thiết kế — và kiểm từng dòng nó đưa cho bạn</h2>
<p class="lead">Bộ slide ngắn này (18 slide) chỉ cách môn học muốn bạn dùng ba công cụ — <strong>ChatGPT</strong> (trợ lý hội thoại), <strong>PlantUML</strong> (viết chữ thành sơ đồ UML) và <strong>GitHub Copilot</strong> (gợi ý code ngay trong IDE — môi trường lập trình) — ở ba thời điểm của thiết kế: tìm use case (ca sử dụng), chọn và vẽ kiến trúc, chọn design pattern (mẫu thiết kế). Slide cuối nêu nguyên tắc mà cả bài dựa vào: <em>AI là trợ lý hỗ trợ, không thay người thiết kế; kết quả của AI phải được kiểm chứng (validation) và chỉnh sửa (refinement).</em></p>
<p>Vì sao quan trọng với bạn: đồ án môn SWD392 chính thức mang tên "AI-assisted system design" (thiết kế hệ thống có AI hỗ trợ) — được dùng AI, nhưng phải <strong>khai báo</strong> mọi prompt (câu lệnh gửi AI) và output (kết quả), và phải <strong>tự giải thích</strong> chúng; điểm cá nhân có hẳn một rubric (thang chấm) AI tối đa 10 điểm. Đề cương còn có riêng một chuẩn đầu ra cho việc này (CLO7). Với LabFlow, cùng kỹ năng đó quyết định một sơ đồ SRS/SDS do AI phác có trụ được trước câu "vì sao?" của hội đồng hay không.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>mục tiêu, công cụ, CLO</td><td>nói được mỗi công cụ giỏi việc gì và phục vụ chuẩn đầu ra nào</td></tr>
<tr><td>4–6</td><td>mô hình use case với AI</td><td>viết prompt ra actor (tác nhân) và use case, biến câu trả lời thành sơ đồ PlantUML, và tìm chỗ AI sai</td></tr>
<tr><td>7–10</td><td>thiết kế hệ thống với AI</td><td>xin một kiến trúc phân tầng (layered), đọc component diagram và sequence diagram nó sinh, soát code Service/DAO của Copilot</td></tr>
<tr><td>11–14</td><td>design pattern với AI</td><td>xin gợi ý pattern (Strategy cho thanh toán), chạy và sửa code Java của AI, so sánh các phương án</td></tr>
<tr><td>15–17</td><td>chọn kiến trúc với AI</td><td>so sánh các kiểu kiến trúc cho một case thật (Online Food Delivery) và biện minh component diagram cùng pattern</td></tr>
<tr><td>18</td><td>kết luận</td><td>áp một bảng kiểm cho mọi sơ đồ AI sinh trước khi đưa vào báo cáo</td></tr>
</tbody>
</table>
<div class="callout"><strong>Đọc trước.</strong> Sơ đồ trên slide 6 và 9 là ảnh chụp output thật của ChatGPT/PlantUML; ở đây được vẽ lại <em>đúng y</em>. Mọi "bản AI phác" khác trong bài là <strong>bản minh hoạ do người soạn viết</strong> để cho thấy lỗi công cụ AI hay mắc — cái nào cũng có ghi nhãn, và luôn có bản đã sửa ngay sau. Phần không có trên slide được đánh dấu <strong>➕ Mở rộng ngoài slide</strong>. Bài cũ 5.1 (thiết kế CSDL) và 5.2 (tổng quan công cụ AI) vẫn nằm trong chương này; bài này đi từng slide và sâu hơn.</div>`),
    walkHead('swd27', 1, 18),
    walk('swd27', [
      [1, 'Applying AI in Software Architecture and Design',
        `<p class="y-chinh">🎯 Title slide of the GenAI deck: how to apply AI tools in software <strong>architecture</strong> (the big structure) and <strong>design</strong> (the classes, interactions and patterns inside it).</p>
<p>This deck is not a chapter of Gomaa's textbook; the school added it to the course when AI tools became part of the syllabus, so it has no chapter number. It reuses everything you learned in Chapters 1–4 of this site: use cases (school Ch.6), architecture styles (Ch.12–16), design patterns (appendix). The AI only changes <em>how fast</em> you produce a first draft — the knowledge needed to judge the draft is still yours.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề của bộ GenAI: cách áp dụng công cụ AI vào <strong>kiến trúc</strong> phần mềm (architecture — cấu trúc lớn) và <strong>thiết kế</strong> (design — các lớp, tương tác, pattern bên trong).</p>
<p>Bộ slide này không phải một chương trong sách Gomaa; trường thêm vào môn khi công cụ AI được đưa vào đề cương, nên nó không có số chương. Nó dùng lại mọi thứ bạn đã học ở Chương 1–4 của trang: use case (Ch.6 của trường), các kiểu kiến trúc (Ch.12–16), design pattern (phụ lục). AI chỉ đổi <em>tốc độ</em> bạn làm ra bản nháp đầu — kiến thức để đánh giá bản nháp vẫn phải là của bạn.</p>`],
      [2, 'INTRODUCTION',
        `<p class="y-chinh">🎯 Objective: guide students to use AI tools to support software system design and to select an appropriate architecture. Key tools: ChatGPT, GitHub Copilot, PlantUML. Related CLOs: CLO3, CLO4, CLO6.</p>
<p>The three CLOs the slide names are exactly the three places AI is used in the deck:</p>
<table>
<thead><tr><th>CLO (syllabus)</th><th>What it says</th><th>Where the deck uses AI</th><th>Syllabus session</th></tr></thead>
<tbody>
<tr><td>CLO3</td><td>build the analysis model: classes, objects, statecharts</td><td>slides 4–6: actors and use cases</td><td>session 10 ("use ChatGPT to generate use case descriptions")</td></tr>
<tr><td>CLO4</td><td>design the overall software architecture</td><td>slides 7–10 and 15–17: layered, microservices</td><td>sessions 36–41 (client/server, assessment 2)</td></tr>
<tr><td>CLO6</td><td>explain and document a design pattern</td><td>slides 11–14: Strategy for payment</td><td>session 22 ("use ChatGPT to suggest appropriate design patterns") and 38</td></tr>
</tbody>
</table>
<p><strong>Note a gap in the slide:</strong> the current syllabus (FLM, sylID 14179) also has <strong>CLO7</strong> — "effectively utilize AI tools (ChatGPT, PlantUML, Copilot) to support software architecture analysis and design". That is the outcome this whole deck serves, but slide 2 does not list it (the deck is older than that CLO). If a theory question asks "which CLO is about AI tools?", the answer is CLO7.</p>
<div class="pitfall">Using AI is <strong>allowed</strong> in the course project but never silent: the project document requires you to declare the prompt and the AI output, and to explain it in your own words. An undeclared AI diagram you cannot explain counts against you (rubric: "Transparency" and "Understanding of AI Output").</div>`,
        `<p class="y-chinh">🎯 Mục tiêu: hướng dẫn sinh viên dùng công cụ AI hỗ trợ thiết kế hệ thống phần mềm và chọn kiến trúc phù hợp. Công cụ chính: ChatGPT, GitHub Copilot, PlantUML. CLO liên quan: CLO3, CLO4, CLO6.</p>
<p>Ba CLO (chuẩn đầu ra môn học — course learning outcome) slide nêu chính là ba chỗ bộ slide dùng AI:</p>
<table>
<thead><tr><th>CLO (đề cương)</th><th>Nội dung</th><th>Chỗ bộ slide dùng AI</th><th>Buổi trong đề cương</th></tr></thead>
<tbody>
<tr><td>CLO3</td><td>dựng mô hình phân tích: lớp, đối tượng, statechart</td><td>slide 4–6: actor và use case</td><td>buổi 10 ("dùng ChatGPT sinh mô tả use case")</td></tr>
<tr><td>CLO4</td><td>thiết kế kiến trúc phần mềm tổng thể</td><td>slide 7–10 và 15–17: phân tầng, microservices</td><td>buổi 36–41 (client/server, đánh giá 2)</td></tr>
<tr><td>CLO6</td><td>giải thích và viết tài liệu cho một design pattern</td><td>slide 11–14: Strategy cho thanh toán</td><td>buổi 22 ("dùng ChatGPT gợi ý design pattern phù hợp") và 38</td></tr>
</tbody>
</table>
<p><strong>Chú ý một chỗ slide thiếu:</strong> đề cương hiện hành (FLM, sylID 14179) còn có <strong>CLO7</strong> — "sử dụng hiệu quả công cụ AI (ChatGPT, PlantUML, Copilot) hỗ trợ phân tích và thiết kế kiến trúc phần mềm". Đó mới là chuẩn đầu ra mà cả bộ slide phục vụ, nhưng slide 2 không ghi (bộ slide cũ hơn CLO đó). Nếu đề lý thuyết hỏi "CLO nào nói về công cụ AI?", đáp án là CLO7.</p>
<div class="pitfall">Dùng AI <strong>được phép</strong> trong đồ án môn nhưng không được dùng lén: tài liệu đồ án bắt khai báo prompt và output của AI, và giải thích bằng lời của chính mình. Một sơ đồ AI không khai báo mà bạn không giải thích nổi sẽ bị trừ điểm (rubric: "Transparency" — minh bạch, và "Understanding of AI Output" — hiểu output của AI).</div>`],
      [3, 'Tools: ChatGPT, PlantUML, GitHub Copilot',
        `<p class="y-chinh">🎯 The three tools and their addresses: ChatGPT (chatgpt.com), PlantUML (plantuml.com), GitHub Copilot (github.com/copilot).</p>
<table>
<thead><tr><th>Tool</th><th>What it really is</th><th>Good at</th><th>Weak at</th></tr></thead>
<tbody>
<tr><td>ChatGPT</td><td>a large language model (LLM) you talk to in text</td><td>listing options, drafting text (use case descriptions), writing PlantUML and sample code, comparing styles</td><td>knowing your real requirements; exact UML semantics; admitting it is unsure</td></tr>
<tr><td>PlantUML</td><td>an open-source tool that turns a text description into a UML diagram (uses Graphviz for layout)</td><td>fast, versionable diagrams (text in Git), easy to regenerate after a change</td><td>pixel-perfect layout; it draws <em>whatever</em> you write — wrong models render just as nicely</td></tr>
<tr><td>GitHub Copilot</td><td>an AI code completer inside VS Code / IntelliJ</td><td>boilerplate: classes, CRUD methods, tests, code that follows a comment</td><td>business rules it cannot see; it repeats patterns from its training data, including outdated APIs</td></tr>
</tbody>
</table>
<p><strong>➕ Beyond the slide.</strong> Any modern assistant (Claude, Gemini, Copilot Chat) works the same way — the course teaches the <em>method</em>, not a brand. PlantUML runs inside VS Code and IntelliJ with a plugin (see the tool-setup lesson in Section 0), so you do not have to paste into the website. Verified students can get Copilot free through GitHub Education. Never paste secrets (passwords, API keys) or an unreleased exam into a chat tool.</p>
<p class="meo">🧠 One line per tool: ChatGPT <em>suggests</em>, PlantUML <em>draws</em>, Copilot <em>types</em> — and you <em>decide</em>.</p>`,
        `<p class="y-chinh">🎯 Ba công cụ và địa chỉ: ChatGPT (chatgpt.com), PlantUML (plantuml.com), GitHub Copilot (github.com/copilot).</p>
<table>
<thead><tr><th>Công cụ</th><th>Thực chất là gì</th><th>Giỏi</th><th>Yếu</th></tr></thead>
<tbody>
<tr><td>ChatGPT</td><td>một mô hình ngôn ngữ lớn (LLM — large language model) bạn trò chuyện bằng chữ</td><td>liệt kê phương án, phác văn bản (mô tả use case), viết mã PlantUML và code mẫu, so sánh các kiểu kiến trúc</td><td>biết yêu cầu thật của bạn; ngữ nghĩa UML chính xác; thừa nhận khi không chắc</td></tr>
<tr><td>PlantUML</td><td>công cụ mã nguồn mở biến mô tả bằng chữ thành sơ đồ UML (dùng Graphviz để dàn bố cục)</td><td>sơ đồ nhanh, quản lý phiên bản được (chữ nằm trong Git), sửa xong dựng lại dễ</td><td>bố cục chính xác từng điểm ảnh; nó vẽ <em>bất cứ thứ gì</em> bạn viết — mô hình sai vẫn ra hình đẹp</td></tr>
<tr><td>GitHub Copilot</td><td>bộ gợi ý code bằng AI nằm trong VS Code / IntelliJ</td><td>code rập khuôn (boilerplate): lớp, hàm CRUD, test, code làm theo một dòng chú thích</td><td>luật nghiệp vụ nó không nhìn thấy; nó lặp lại mẫu trong dữ liệu huấn luyện, kể cả API đã lỗi thời</td></tr>
</tbody>
</table>
<p><strong>➕ Mở rộng ngoài slide.</strong> Trợ lý hiện đại nào (Claude, Gemini, Copilot Chat) cũng dùng theo cùng một cách — môn học dạy <em>phương pháp</em>, không dạy nhãn hiệu. PlantUML chạy ngay trong VS Code và IntelliJ bằng plugin (xem bài cài công cụ ở Mục 0), khỏi phải dán lên trang web. Sinh viên đã xác minh có thể dùng Copilot miễn phí qua GitHub Education. Đừng bao giờ dán bí mật (mật khẩu, API key) hay đề thi chưa công bố vào công cụ chat.</p>
<p class="meo">🧠 Mỗi công cụ một câu: ChatGPT <em>gợi ý</em>, PlantUML <em>vẽ</em>, Copilot <em>gõ</em> — còn bạn <em>quyết định</em>.</p>`],
      [4, 'Use Case Analysis and Modeling with AI',
        `<p class="y-chinh">🎯 Use case modeling with AI (support for session 10). ChatGPT: suggest actors and main use cases from a system description, generate use case descriptions (brief, main flow, alternate flow), suggest functions from business keywords. PlantUML: generate the use case diagram from text or from ChatGPT's output. Demo: library system → use case diagram.</p>
<p>Where the AI helps and where it does not, for this first model:</p>
<table>
<thead><tr><th>Step of use case modeling (school Ch.6)</th><th>What ChatGPT gives quickly</th><th>What you must still check</th></tr></thead>
<tbody>
<tr><td>find actors</td><td>a list of human roles and external systems</td><td>is each actor <em>outside</em> the system? ("Database" is never an actor)</td></tr>
<tr><td>find use cases</td><td>verb + object goals</td><td>is each one a complete goal of an actor, not a UI step ("Click Search")?</td></tr>
<tr><td>write descriptions</td><td>brief, main flow, alternatives</td><td>numbered steps, what not how, alternatives tied to a step number (FPT 7-row template)</td></tr>
<tr><td>relationships</td><td>«include» / «extend» arrows</td><td>direction and meaning — the most common AI mistake (slide 6)</td></tr>
</tbody>
</table>
<p>"Suggest functionality based on business-related keywords" is useful when the text is thin: give "library, fine, reservation" and the AI proposes Reserve Book or Pay Fine. Treat those as <strong>questions to ask the customer</strong>, not as requirements — the AI does not know what the library actually wants.</p>`,
        `<p class="y-chinh">🎯 Mô hình use case với AI (hỗ trợ buổi 10). ChatGPT: gợi ý actor và use case chính từ mô tả hệ thống, sinh mô tả use case (tóm tắt, luồng chính, luồng thay thế), gợi ý chức năng từ từ khoá nghiệp vụ. PlantUML: sinh use case diagram từ chữ hoặc từ output của ChatGPT. Demo: hệ thống thư viện → use case diagram.</p>
<p>Chỗ AI giúp được và chỗ không, cho mô hình đầu tiên này:</p>
<table>
<thead><tr><th>Bước mô hình use case (Ch.6 trường)</th><th>ChatGPT cho nhanh</th><th>Bạn vẫn phải kiểm</th></tr></thead>
<tbody>
<tr><td>tìm actor</td><td>danh sách vai người dùng và hệ thống ngoài</td><td>mỗi actor có nằm <em>ngoài</em> hệ thống không? ("Database" không bao giờ là actor)</td></tr>
<tr><td>tìm use case</td><td>mục tiêu dạng động từ + tân ngữ</td><td>mỗi cái có là mục tiêu trọn vẹn của actor, không phải một bước giao diện ("Click Search")?</td></tr>
<tr><td>viết mô tả</td><td>tóm tắt, luồng chính, luồng thay thế</td><td>bước đánh số, nói làm gì chứ không nói làm thế nào, luồng phụ gắn số bước (khuôn 7 dòng FPT)</td></tr>
<tr><td>quan hệ</td><td>mũi tên «include» / «extend»</td><td>chiều và nghĩa — lỗi AI mắc nhiều nhất (slide 6)</td></tr>
</tbody>
</table>
<p>"Gợi ý chức năng từ từ khoá nghiệp vụ" có ích khi đề bài mỏng: đưa "thư viện, tiền phạt, đặt trước" thì AI đề xuất Reserve Book hay Pay Fine. Hãy coi chúng là <strong>câu hỏi cần hỏi khách hàng</strong>, không phải yêu cầu — AI không biết thư viện thật sự muốn gì.</p>`],
      [5, 'Use Case Analysis and Modeling with AI',
        `<p class="y-chinh">🎯 Two sample prompts. Prompt 1 asks, "as a software system designer", for the actors and major use cases of a library system (users log in, search, borrow, return; librarians manage books and user accounts) — then <em>students explain the rationale</em>. Prompt 2: "Write PlantUML code for all the proposed use cases" — paste the result into PlantUML.</p>
<pre><code class="language-plaintext">Prompt 1: As a software system designer, I need to design a library management system
with the following functionalities:
  - Users can log in, search for books, borrow, and return them
  - Librarians can manage books and user accounts
Please help identify the Actors and major Use Cases.

Prompt 2: Write PlantUML code for all the proposed Use Cases.</code></pre>
<p>The blue line on the slide — "let students explain the rationale behind the identified actors and use cases" — is the heart of the method: the prompt is 20 seconds of work, the explanation is what you are graded on. For each actor say who it is and why it is outside; for each use case say which actor's goal it serves.</p>
<p><strong>➕ Beyond the slide — a better prompt.</strong> Prompt 1 gives a role and the requirements, which is good. It becomes much more reliable if you also fix the <em>rules</em> and the <em>output form</em>, and ask the AI to list its assumptions:</p>
<pre><code class="language-plaintext">Role: you are a software analyst using UML use case modeling (Gomaa, COMET).
Context: &lt;paste the requirement text exactly, nothing else&gt;
Rules: actors are outside the system; name use cases "verb + object"; use «include»
only for mandatory shared steps and «extend» only for conditional behaviour, with
the arrow from the extension to the base; do not invent functions not in the text.
Output: (1) a table # | Actor | Description, (2) a table UC-ID | Use Case | Actor,
(3) PlantUML code with a system boundary, (4) a list of assumptions and questions.</code></pre>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): paste the "Reservation &amp; Waitlist" feature text of your SRS into the Context line. The "assumptions and questions" list is gold: every item is either a business rule you forgot to write (BR-xx) or a question for your supervisor.</div>`,
        `<p class="y-chinh">🎯 Hai prompt mẫu. Prompt 1 nhờ AI, "với vai người thiết kế hệ thống phần mềm", tìm actor và use case chính của hệ thống thư viện (người dùng đăng nhập, tìm, mượn, trả sách; thủ thư quản lý sách và tài khoản) — rồi <em>sinh viên giải thích lý do</em>. Prompt 2: "Viết mã PlantUML cho mọi use case đã đề xuất" — dán kết quả vào PlantUML.</p>
<pre><code class="language-plaintext">Prompt 1: As a software system designer, I need to design a library management system
with the following functionalities:
  - Users can log in, search for books, borrow, and return them
  - Librarians can manage books and user accounts
Please help identify the Actors and major Use Cases.

Prompt 2: Write PlantUML code for all the proposed Use Cases.</code></pre>
<p>Dòng chữ xanh trên slide — "để sinh viên giải thích lý do đằng sau các actor và use case đã tìm" — là cốt lõi của phương pháp: viết prompt mất 20 giây, phần giải thích mới là thứ được chấm. Với mỗi actor, nói nó là ai và vì sao nằm ngoài hệ thống; với mỗi use case, nói nó phục vụ mục tiêu của actor nào.</p>
<p><strong>➕ Mở rộng ngoài slide — một prompt tốt hơn.</strong> Prompt 1 đã cho vai (role) và yêu cầu, thế là tốt. Nó đáng tin hơn nhiều nếu bạn chốt thêm <em>luật</em> và <em>dạng output</em>, và bắt AI liệt kê giả định của nó (tiếng Anh giữ nguyên để dán vào AI; nghĩa: vai — ngữ cảnh — luật — đầu ra):</p>
<pre><code class="language-plaintext">Role: you are a software analyst using UML use case modeling (Gomaa, COMET).
Context: &lt;paste the requirement text exactly, nothing else&gt;
Rules: actors are outside the system; name use cases "verb + object"; use «include»
only for mandatory shared steps and «extend» only for conditional behaviour, with
the arrow from the extension to the base; do not invent functions not in the text.
Output: (1) a table # | Actor | Description, (2) a table UC-ID | Use Case | Actor,
(3) PlantUML code with a system boundary, (4) a list of assumptions and questions.</code></pre>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): dán đoạn chữ của tính năng "Reservation &amp; Waitlist" trong SRS vào dòng Context. Danh sách "giả định và câu hỏi" là vàng: mỗi mục hoặc là một luật nghiệp vụ bạn quên viết (BR-xx), hoặc là một câu cần hỏi thầy hướng dẫn.</div>`],
      [6, 'Use Case Analysis and Modeling with AI',
        `<p class="y-chinh">🎯 The result of prompt 2 on plantuml.com: the PlantUML code (two actors, six use cases, plain associations) and the diagram it renders. Here it is, rebuilt from the exact code on the slide.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/8dfe1d217c11c63267dee93dde6132a431f0b334.svg" alt="Slide 6 — the AI's PlantUML, rendered exactly as written: User and Librarian, six use cases" loading="lazy" /><p class="chu-thich">🧩 Slide 6 — the AI's PlantUML, rendered exactly as written: User and Librarian, six use cases</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Use case diagram generated from ChatGPT's PlantUML (slide 6, reproduced as on the slide)
' Exactly the code shown on slide 6: two actors, six use cases, no system boundary
actor "User" as User
actor "Librarian" as Librarian

usecase "Log In" as UC_Login
usecase "Search for Books" as UC_Search
usecase "Borrow Book" as UC_Borrow
usecase "Return Book" as UC_Return
usecase "Manage Books" as UC_ManageBooks
usecase "Manage User Accounts" as UC_ManageUsers

User --&gt; UC_Login
User --&gt; UC_Search
User --&gt; UC_Borrow
User --&gt; UC_Return

Librarian --&gt; UC_Login
Librarian --&gt; UC_ManageBooks
Librarian --&gt; UC_ManageUsers
@enduml</code></pre></details>
<p><strong>Review it like a grader.</strong> The draft is reasonable, but it is not yet a diagram you can submit:</p>
<table>
<thead><tr><th>What you see</th><th>Problem</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>no rectangle around the use cases</td><td>no system boundary — you cannot tell what is inside the system</td><td>add <code>rectangle "Library Management System" { … }</code></td></tr>
<tr><td>actor "User"</td><td>vague: the librarian is also a user of the system</td><td>name the role: Member</td></tr>
<tr><td>"Manage User Accounts"</td><td>ambiguous — whose accounts?</td><td>"Manage Member Accounts"</td></tr>
<tr><td>arrows <code>--&gt;</code> from actors</td><td>association shown with an arrowhead; harmless, but Gomaa draws plain lines</td><td><code>--</code></td></tr>
<tr><td>Log In linked to both actors</td><td>acceptable (FPT templates list Log In as a use case); do <strong>not</strong> add «include» Log In to every use case — logging in is a precondition, not a shared step</td><td>keep as its own use case</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/b668e13d702bd580feb9b9ac7ebf19724527fbb6.svg" alt="After review — same six goals, now with a boundary and clear names (nothing invented)" loading="lazy" /><p class="chu-thich">🧩 After review — same six goals, now with a boundary and clear names (nothing invented)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Library use case diagram after human review (system boundary, clear actor names, same six goals)
' Reviewed version: boundary added, "User" renamed Member, account management names what is managed; no requirement added
left to right direction
actor "Member" as M
actor "Librarian" as L
rectangle "Library Management System" {
  usecase "Log In" as UC1
  usecase "Search for Books" as UC2
  usecase "Borrow Book" as UC3
  usecase "Return Book" as UC4
  usecase "Manage Books" as UC5
  usecase "Manage Member Accounts" as UC6
}
M -- UC1
M -- UC2
M -- UC3
M -- UC4
L -- UC1
L -- UC5
L -- UC6
@enduml</code></pre></details>
<p><strong>➕ Beyond the slide — the four errors AI makes most often in use case diagrams.</strong> The draft below is an <em>illustration</em> written to show them together; compare it with the corrected version.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/8b1a9377887d7b43b509b120adc76c6bbfdfa17b.svg" alt="Illustration — an AI draft with four errors (do not copy)" loading="lazy" /><p class="chu-thich">🧩 Illustration — an AI draft with four errors (do not copy)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title A typical AI draft with four modeling errors (illustration, do NOT copy)
' Four frequent AI mistakes: database as actor, include used for a conditional step, extend arrow reversed, UI step as use case
left to right direction
actor "User" as U
actor "Database" as DB
rectangle "Library System" {
  usecase "Borrow Book" as B
  usecase "Check Membership" as C
  usecase "Pay Late Fee" as F
  usecase "Return Book" as R
  usecase "Click Search Button" as S
}
U -- B
U -- R
U -- S
B .&gt; C : &lt;&lt;extend&gt;&gt;
R .&gt; F : &lt;&lt;include&gt;&gt;
B -- DB
R -- DB
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/86d3679a243ee60df8eaf4271f06194a23e6360f.svg" alt="The same draft corrected" loading="lazy" /><p class="chu-thich">🧩 The same draft corrected</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title The same draft after review: every error fixed
' Fixed: no database actor, Check Membership is included (mandatory), Pay Late Fee extends Return Book under a condition, goal-level names
left to right direction
actor "Member" as U
rectangle "Library System" {
  usecase "Borrow Book" as B
  usecase "Check Membership" as C
  usecase "Pay Late Fee" as F
  usecase "Return Book" as R
  usecase "Search for Books" as S
}
U -- B
U -- R
U -- S
B .&gt; C : &lt;&lt;include&gt;&gt;
F .&gt; R : &lt;&lt;extend&gt;&gt;\\n[book is overdue]
@enduml</code></pre></details>
<table>
<thead><tr><th>Error in the draft</th><th>Why it is wrong</th><th>Correct model</th></tr></thead>
<tbody>
<tr><td>actor "Database"</td><td>the database is part of the system, not outside it</td><td>remove it</td></tr>
<tr><td>Borrow Book «extend» Check Membership</td><td>checking membership happens <em>every</em> time — mandatory, so «include», from base to included</td><td>Borrow Book ..&gt; Check Membership «include»</td></tr>
<tr><td>Return Book «include» Pay Late Fee</td><td>paying happens <em>only</em> when the book is late — conditional, so «extend», arrow from the extension to the base</td><td>Pay Late Fee ..&gt; Return Book «extend» [book is overdue]</td></tr>
<tr><td>"Click Search Button"</td><td>a UI step, not a goal</td><td>"Search for Books"</td></tr>
</tbody>
</table>
<p class="meo">🧠 Include = "always, shared, arrow <em>out of</em> the base". Extend = "sometimes, conditional, arrow <em>into</em> the base".</p>`,
        `<p class="y-chinh">🎯 Kết quả của prompt 2 trên plantuml.com: mã PlantUML (hai actor, sáu use case, liên kết thường) và sơ đồ nó dựng ra. Dưới đây là bản dựng lại từ đúng đoạn mã trên slide.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/8dfe1d217c11c63267dee93dde6132a431f0b334.svg" alt="Slide 6 — mã PlantUML của AI, dựng đúng như viết: User và Librarian, sáu use case" loading="lazy" /><p class="chu-thich">🧩 Slide 6 — mã PlantUML của AI, dựng đúng như viết: User và Librarian, sáu use case</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Use case diagram generated from ChatGPT's PlantUML (slide 6, reproduced as on the slide)
' Đúng đoạn mã trên slide 6: hai actor, sáu use case, không có khung hệ thống
actor "User" as User
actor "Librarian" as Librarian

usecase "Log In" as UC_Login
usecase "Search for Books" as UC_Search
usecase "Borrow Book" as UC_Borrow
usecase "Return Book" as UC_Return
usecase "Manage Books" as UC_ManageBooks
usecase "Manage User Accounts" as UC_ManageUsers

User --&gt; UC_Login
User --&gt; UC_Search
User --&gt; UC_Borrow
User --&gt; UC_Return

Librarian --&gt; UC_Login
Librarian --&gt; UC_ManageBooks
Librarian --&gt; UC_ManageUsers
@enduml</code></pre></details>
<p><strong>Soát như người chấm.</strong> Bản nháp khá ổn, nhưng chưa phải sơ đồ nộp được:</p>
<table>
<thead><tr><th>Thấy gì</th><th>Vấn đề</th><th>Sửa</th></tr></thead>
<tbody>
<tr><td>không có hình chữ nhật bao các use case</td><td>thiếu khung hệ thống (system boundary) — không biết cái gì nằm trong hệ thống</td><td>thêm <code>rectangle "Library Management System" { … }</code></td></tr>
<tr><td>actor "User"</td><td>mơ hồ: thủ thư cũng là người dùng hệ thống</td><td>gọi đúng vai: Member (bạn đọc)</td></tr>
<tr><td>"Manage User Accounts"</td><td>mơ hồ — tài khoản của ai?</td><td>"Manage Member Accounts"</td></tr>
<tr><td>mũi tên <code>--&gt;</code> từ actor</td><td>liên kết vẽ có đầu mũi tên; không sai hẳn, nhưng Gomaa vẽ đường thẳng trơn</td><td><code>--</code></td></tr>
<tr><td>Log In nối cả hai actor</td><td>chấp nhận được (khuôn FPT có ghi Log In là use case); <strong>đừng</strong> thêm «include» Log In vào mọi use case — đăng nhập là điều kiện trước (precondition), không phải bước dùng chung</td><td>giữ là use case riêng</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/b668e13d702bd580feb9b9ac7ebf19724527fbb6.svg" alt="Sau khi soát — vẫn sáu mục tiêu, thêm khung hệ thống và tên rõ (không bịa thêm gì)" loading="lazy" /><p class="chu-thich">🧩 Sau khi soát — vẫn sáu mục tiêu, thêm khung hệ thống và tên rõ (không bịa thêm gì)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Library use case diagram after human review (system boundary, clear actor names, same six goals)
' Bản đã soát: thêm khung hệ thống, đổi "User" thành Member, đặt tên rõ thứ được quản lý; không thêm yêu cầu nào
left to right direction
actor "Member" as M
actor "Librarian" as L
rectangle "Library Management System" {
  usecase "Log In" as UC1
  usecase "Search for Books" as UC2
  usecase "Borrow Book" as UC3
  usecase "Return Book" as UC4
  usecase "Manage Books" as UC5
  usecase "Manage Member Accounts" as UC6
}
M -- UC1
M -- UC2
M -- UC3
M -- UC4
L -- UC1
L -- UC5
L -- UC6
@enduml</code></pre></details>
<p><strong>➕ Mở rộng ngoài slide — bốn lỗi AI hay mắc nhất ở use case diagram.</strong> Bản nháp dưới đây là <em>minh hoạ</em> viết ra để gom cả bốn lỗi; so với bản đã sửa.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/8b1a9377887d7b43b509b120adc76c6bbfdfa17b.svg" alt="Minh hoạ — bản AI phác có bốn lỗi (đừng chép)" loading="lazy" /><p class="chu-thich">🧩 Minh hoạ — bản AI phác có bốn lỗi (đừng chép)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title A typical AI draft with four modeling errors (illustration, do NOT copy)
' Bốn lỗi AI hay mắc: CSDL làm actor, include cho bước có điều kiện, mũi tên extend ngược, bước giao diện thành use case
left to right direction
actor "User" as U
actor "Database" as DB
rectangle "Library System" {
  usecase "Borrow Book" as B
  usecase "Check Membership" as C
  usecase "Pay Late Fee" as F
  usecase "Return Book" as R
  usecase "Click Search Button" as S
}
U -- B
U -- R
U -- S
B .&gt; C : &lt;&lt;extend&gt;&gt;
R .&gt; F : &lt;&lt;include&gt;&gt;
B -- DB
R -- DB
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/86d3679a243ee60df8eaf4271f06194a23e6360f.svg" alt="Cùng bản đó đã sửa" loading="lazy" /><p class="chu-thich">🧩 Cùng bản đó đã sửa</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title The same draft after review: every error fixed
' Đã sửa: bỏ actor CSDL, Check Membership là include (bắt buộc), Pay Late Fee extend Return Book có điều kiện, tên ở mức mục tiêu
left to right direction
actor "Member" as U
rectangle "Library System" {
  usecase "Borrow Book" as B
  usecase "Check Membership" as C
  usecase "Pay Late Fee" as F
  usecase "Return Book" as R
  usecase "Search for Books" as S
}
U -- B
U -- R
U -- S
B .&gt; C : &lt;&lt;include&gt;&gt;
F .&gt; R : &lt;&lt;extend&gt;&gt;\\n[book is overdue]
@enduml</code></pre></details>
<table>
<thead><tr><th>Lỗi trong bản nháp</th><th>Vì sao sai</th><th>Mô hình đúng</th></tr></thead>
<tbody>
<tr><td>actor "Database"</td><td>CSDL là một phần của hệ thống, không nằm ngoài</td><td>bỏ đi</td></tr>
<tr><td>Borrow Book «extend» Check Membership</td><td>kiểm thẻ thành viên xảy ra <em>mọi</em> lần — bắt buộc nên là «include», mũi tên từ gốc tới use case được include</td><td>Borrow Book ..&gt; Check Membership «include»</td></tr>
<tr><td>Return Book «include» Pay Late Fee</td><td>trả phạt <em>chỉ</em> xảy ra khi sách trễ hạn — có điều kiện nên là «extend», mũi tên từ use case mở rộng vào gốc</td><td>Pay Late Fee ..&gt; Return Book «extend» [book is overdue]</td></tr>
<tr><td>"Click Search Button"</td><td>là một bước giao diện, không phải mục tiêu</td><td>"Search for Books"</td></tr>
</tbody>
</table>
<p class="meo">🧠 Include = "luôn luôn, dùng chung, mũi tên đi <em>ra khỏi</em> gốc". Extend = "thỉnh thoảng, có điều kiện, mũi tên đi <em>vào</em> gốc".</p>`],
      [7, 'AI-Supported System Design',
        `<p class="y-chinh">🎯 AI in system (architecture) design. ChatGPT: suggest a structure for a given style (Layered, MVC, Microservice…), produce block-based descriptions (component diagram, deployment diagram), help analyse trade-offs between styles. PlantUML: draw component and deployment diagrams quickly. Copilot: generate code templates for the architectural components. Demo: "Design a Layered architecture for an online shopping system" → component diagram + description of the layers.</p>
<p>The two diagram types named here are the ones Chapter 3 of this site uses for architecture:</p>
<table>
<thead><tr><th>Diagram</th><th>Shows</th><th>Question it answers</th></tr></thead>
<tbody>
<tr><td>component diagram</td><td>software parts (components, subsystems) and their interfaces/dependencies</td><td>what are the building blocks and who depends on whom?</td></tr>
<tr><td>deployment diagram</td><td>physical nodes (devices, servers, DB server) and what runs where</td><td>on which machines does it run, and how are they connected?</td></tr>
</tbody>
</table>
<p>"Analyse trade-offs" is the part where AI saves the most time: it can list pros and cons of Layered vs Microservices in seconds. But a trade-off only means something against <em>your</em> quality attributes (school Ch.20: performance, scalability, availability, modifiability, security…). Always give the AI your non-functional requirements; otherwise it answers for an imaginary average system.</p>`,
        `<p class="y-chinh">🎯 AI trong thiết kế hệ thống (kiến trúc). ChatGPT: gợi ý cấu trúc theo một kiểu kiến trúc (Layered — phân tầng, MVC, Microservice…), sinh mô tả dạng khối (component diagram, deployment diagram), giúp phân tích đánh đổi (trade-off) giữa các kiểu. PlantUML: vẽ nhanh component và deployment diagram. Copilot: sinh khung code cho các thành phần kiến trúc. Demo: "Thiết kế kiến trúc phân tầng cho hệ thống bán hàng online" → component diagram + mô tả các tầng.</p>
<p>Hai loại sơ đồ nêu ở đây chính là hai loại Chương 3 của trang dùng cho kiến trúc:</p>
<table>
<thead><tr><th>Sơ đồ</th><th>Cho thấy</th><th>Trả lời câu hỏi</th></tr></thead>
<tbody>
<tr><td>component diagram (sơ đồ thành phần)</td><td>các phần mềm (component, subsystem) và giao diện/phụ thuộc giữa chúng</td><td>các khối xây dựng là gì, ai phụ thuộc ai?</td></tr>
<tr><td>deployment diagram (sơ đồ triển khai)</td><td>các node vật lý (thiết bị, máy chủ, máy CSDL) và cái gì chạy ở đâu</td><td>chạy trên những máy nào, nối với nhau ra sao?</td></tr>
</tbody>
</table>
<p>"Phân tích đánh đổi" là phần AI tiết kiệm thời gian nhất: nó liệt kê ưu nhược của Layered với Microservices trong vài giây. Nhưng đánh đổi chỉ có nghĩa khi đặt cạnh thuộc tính chất lượng (quality attribute) <em>của bạn</em> (Ch.20 trường: hiệu năng, khả năng mở rộng, tính sẵn sàng, dễ sửa đổi, bảo mật…). Luôn đưa cho AI yêu cầu phi chức năng của bạn; không thì nó trả lời cho một hệ thống trung bình tưởng tượng.</p>`],
      [8, 'AI-Supported System Design',
        `<p class="y-chinh">🎯 Sample prompt: "Help me design a 3-layered architecture for an online shopping system. Layers: Presentation, Business, Data Access. List key components and describe the role of each layer. Then generate a UML component diagram." The screenshots show ChatGPT's answer and a follow-up.</p>
<pre><code class="language-plaintext">Help me design a 3-layered architecture for an online shopping system.
Layers: Presentation, Business, Data Access.
List key components and describe the role of each layer.
Then generate a UML component diagram.</code></pre>
<p>What the screenshots show: the AI promises (1) a description of each layer, (2) key components per layer, (3) a UML component diagram in PlantUML; then "Layer 1: Presentation Layer — Purpose: handles all user interactions (UI/UX); Technologies: web interface, mobile app, REST controllers". At the end it offers to expand: a sequence diagram for order placement, a class diagram for one of the services, or an enhanced architecture with microservices or an API gateway — and the student chooses "a sequence diagram for order placement" (slide 9).</p>
<p>Why this prompt works: it <strong>fixes the style and the layer names</strong> instead of asking "what architecture should I use?", and it asks for roles <em>and</em> a diagram, so text and picture can be checked against each other. Following up in the same conversation (layers → sequence diagram) keeps the component names consistent.</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): the SDS of LabFlow already fixes the style — a Spring Boot modular monolith with Presentation (React), Application (controllers, domain services, data access) and Data (PostgreSQL) layers. Put that in the prompt and ask only for the components of one module (e.g. <code>com.labflow.reservation</code>); an AI that suggests "microservices" at this point has not read your constraints.</div>`,
        `<p class="y-chinh">🎯 Prompt mẫu: "Giúp tôi thiết kế kiến trúc 3 tầng cho hệ thống bán hàng online. Các tầng: Presentation, Business, Data Access. Liệt kê các thành phần chính và mô tả vai trò mỗi tầng. Sau đó sinh UML component diagram." Ảnh chụp cho thấy câu trả lời của ChatGPT và một câu hỏi tiếp.</p>
<pre><code class="language-plaintext">Help me design a 3-layered architecture for an online shopping system.
Layers: Presentation, Business, Data Access.
List key components and describe the role of each layer.
Then generate a UML component diagram.</code></pre>
<p>Ảnh chụp cho thấy: AI hứa (1) mô tả từng tầng, (2) các thành phần chính mỗi tầng, (3) một UML component diagram bằng PlantUML; rồi "Layer 1: Presentation Layer — mục đích: xử lý mọi tương tác người dùng (UI/UX); công nghệ: giao diện web, app di động, REST controller". Cuối câu trả lời nó mời mở rộng: sequence diagram cho việc đặt hàng, class diagram cho một service, hoặc kiến trúc nâng cao với microservices hay API gateway — và sinh viên chọn "sequence diagram cho đặt hàng" (slide 9).</p>
<p>Vì sao prompt này hiệu quả: nó <strong>chốt sẵn kiểu kiến trúc và tên các tầng</strong> thay vì hỏi "nên dùng kiến trúc gì?", và nó đòi cả vai trò <em>lẫn</em> sơ đồ, nên chữ và hình đối chiếu được với nhau. Hỏi tiếp trong cùng cuộc hội thoại (tầng → sequence diagram) giữ tên các thành phần thống nhất.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): SDS của LabFlow đã chốt kiểu kiến trúc — một modular monolith (khối nguyên chia module) Spring Boot với tầng Presentation (React), Application (controller, domain service, truy cập dữ liệu) và Data (PostgreSQL). Ghi điều đó vào prompt và chỉ xin thành phần của một module (vd <code>com.labflow.reservation</code>); AI mà gợi ý "microservices" ở bước này là chưa đọc ràng buộc của bạn.</div>`],
      [9, 'AI-Supported System Design',
        `<p class="y-chinh">🎯 "Copy the PlantUML code to generate the diagram": left, the component diagram of the three layers; right, the sequence diagram for placing an order. Both are rebuilt below from the code on the slide.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/6567c99e5708634e1817b98af7e345b209b2fbdd.svg" alt="Slide 9 (left) — three layers as packages: Web UI and CheckoutController; four services; four DAOs" loading="lazy" /><p class="chu-thich">🧩 Slide 9 (left) — three layers as packages: Web UI and CheckoutController; four services; four DAOs</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title 3-layered architecture of an online shopping system (slide 9, left: ChatGPT's component diagram)
' Three packages = three layers; each layer only calls the layer directly below
package "Presentation Layer" {
  [Web UI] as UI
  [CheckoutController] as CC
}
package "Business Layer" {
  [ProductService] as PS
  [OrderService] as OS
  [UserService] as US
  [PaymentService] as PayS
}
package "Data Access Layer" {
  [ProductDAO] as PD
  [OrderDAO] as OD
  [UserDAO] as UD
  [PaymentDAO] as PayD
}
database "Database" as DB
UI --&gt; CC
CC --&gt; PS
CC --&gt; OS
CC --&gt; US
CC --&gt; PayS
PS --&gt; PD
OS --&gt; OD
US --&gt; UD
PayS --&gt; PayD
PD --&gt; DB
OD --&gt; DB
UD --&gt; DB
PayD --&gt; DB
@enduml</code></pre></details>
<p>The slide's screenshot is cut just below "Business Layer", so the arrows from the services to the DAOs and to the database are our reconstruction (each service uses its own DAO — what the sequence diagram on the right shows). The rule to check: <strong>arrows only go downward, one layer at a time</strong>; a Controller → DAO arrow would break the layering.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/afe2b15f78b436ad7baeb71b0528908cd8e42ea7.svg" alt="Slide 9 (right) — Place Order: User → Web UI → CheckoutController → OrderService/OrderDAO, then PaymentService/PaymentDAO" loading="lazy" /><p class="chu-thich">🧩 Slide 9 (right) — Place Order: User → Web UI → CheckoutController → OrderService/OrderDAO, then PaymentService/PaymentDAO</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Sequence diagram "Place Order" in the 3-layered design (slide 9, right)
' Reproduced from slide 9: the AI's follow-up answer to "a sequence diagram for order placement"
actor User
participant "Web UI" as UI
participant CheckoutController as C
participant OrderService as OS
participant PaymentService as PS
participant OrderDAO as OD
participant PaymentDAO as PD
User -&gt; UI : Place Order Request
UI -&gt; C : submitOrder()
C -&gt; OS : createOrder(cartData)
OS -&gt; OD : saveOrder(order)
OD --&gt; OS : confirmation
C -&gt; PS : processPayment(order)
PS -&gt; PD : savePayment(transaction)
PD --&gt; PS : confirmation
PS --&gt; C : payment success
C --&gt; UI : show order confirmation
@enduml</code></pre></details>
<p><strong>Review the sequence diagram.</strong> It is consistent with the component diagram (same names, calls go down the layers), which is good. What it leaves out, and what a grader of Assignment 03 would ask:</p>
<table>
<thead><tr><th>Missing</th><th>Why it matters</th><th>Added in the reviewed version</th></tr></thead>
<tbody>
<tr><td>failure path</td><td>payments are declined; a design with only the happy path is incomplete</td><td><code>alt payment approved / else payment declined</code></td></tr>
<tr><td>order status</td><td>the order is saved before payment — in what status?</td><td><code>PENDING_PAYMENT</code> → <code>PAID</code> / <code>PAYMENT_FAILED</code></td></tr>
<tr><td>the external payment gateway</td><td>"PaymentDAO.savePayment" only stores data; nothing actually charges money</td><td>a Payment Gateway participant (a secondary actor)</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/b354ef26a07d8974e190d2bbf8db4df14c47a0a8.svg" alt="After review — Place Order with the declined-payment path and order status" loading="lazy" /><p class="chu-thich">🧩 After review — Place Order with the declined-payment path and order status</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title "Place Order" after review: the failure path and the order status the AI left out
' Added by review: payment gateway, alt for declined payment, order status update, one transaction per step
actor User
participant "Web UI" as UI
participant CheckoutController as C
participant OrderService as OS
participant PaymentService as PS
participant OrderDAO as OD
participant "Payment Gateway" as GW
User -&gt; UI : Place Order Request
UI -&gt; C : submitOrder(cart)
C -&gt; OS : createOrder(cartData)
OS -&gt; OD : saveOrder(order, PENDING_PAYMENT)
OD --&gt; OS : orderId
OS --&gt; C : order
C -&gt; PS : processPayment(order)
PS -&gt; GW : charge(amount, method)
alt payment approved
  GW --&gt; PS : approved(txId)
  PS -&gt; OS : markPaid(orderId, txId)
  OS -&gt; OD : updateStatus(orderId, PAID)
  PS --&gt; C : payment success
  C --&gt; UI : show order confirmation
else payment declined
  GW --&gt; PS : declined(reason)
  PS -&gt; OS : markPaymentFailed(orderId)
  OS -&gt; OD : updateStatus(orderId, PAYMENT_FAILED)
  PS --&gt; C : payment failed(reason)
  C --&gt; UI : show error and retry option
end
@enduml</code></pre></details>
<p><strong>➕ Beyond the slide:</strong> slide 7 mentions deployment diagrams but the deck never shows one. The layers are <em>logical</em>; where they run is a separate decision:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/28b5c5305203453b926c1b8e7e5f2d08abb6c0cf.svg" alt="Deployment of the 3-layered shop: browser, application server, database server" loading="lazy" /><p class="chu-thich">🧩 Deployment of the 3-layered shop: browser, application server, database server</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Deployment diagram of the 3-layered shop (extension: the diagram slide 7 mentions but does not show)
' Layers are logical; nodes are physical. Here three layers run on two server nodes
node "Client device" as N1 {
  artifact "Web browser (Web UI)" as A1
}
node "Application server" as N2 {
  artifact "shop-app.jar\\nPresentation + Business + Data Access" as A2
}
node "Database server" as N3 {
  database "PostgreSQL" as D
}
N1 -- N2 : HTTPS
N2 -- N3 : JDBC/TCP 5432
@enduml</code></pre></details>`,
        `<p class="y-chinh">🎯 "Chép mã PlantUML để dựng sơ đồ": bên trái, component diagram của ba tầng; bên phải, sequence diagram cho việc đặt hàng. Cả hai được dựng lại dưới đây từ mã trên slide.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/6567c99e5708634e1817b98af7e345b209b2fbdd.svg" alt="Slide 9 (trái) — ba tầng là ba package: Web UI và CheckoutController; bốn service; bốn DAO" loading="lazy" /><p class="chu-thich">🧩 Slide 9 (trái) — ba tầng là ba package: Web UI và CheckoutController; bốn service; bốn DAO</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title 3-layered architecture of an online shopping system (slide 9, left: ChatGPT's component diagram)
' Ba package = ba tầng; mỗi tầng chỉ gọi tầng ngay dưới
package "Presentation Layer" {
  [Web UI] as UI
  [CheckoutController] as CC
}
package "Business Layer" {
  [ProductService] as PS
  [OrderService] as OS
  [UserService] as US
  [PaymentService] as PayS
}
package "Data Access Layer" {
  [ProductDAO] as PD
  [OrderDAO] as OD
  [UserDAO] as UD
  [PaymentDAO] as PayD
}
database "Database" as DB
UI --&gt; CC
CC --&gt; PS
CC --&gt; OS
CC --&gt; US
CC --&gt; PayS
PS --&gt; PD
OS --&gt; OD
US --&gt; UD
PayS --&gt; PayD
PD --&gt; DB
OD --&gt; DB
UD --&gt; DB
PayD --&gt; DB
@enduml</code></pre></details>
<p>Ảnh chụp trên slide bị cắt ngay dưới "Business Layer", nên các mũi tên từ service xuống DAO và xuống CSDL là phần chúng tôi dựng lại (mỗi service dùng DAO của mình — đúng như sequence diagram bên phải cho thấy). DAO (Data Access Object — đối tượng truy cập dữ liệu) là lớp chỉ lo đọc/ghi CSDL. Luật cần kiểm: <strong>mũi tên chỉ đi xuống, mỗi lần một tầng</strong>; một mũi tên Controller → DAO là phá vỡ phân tầng.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/afe2b15f78b436ad7baeb71b0528908cd8e42ea7.svg" alt="Slide 9 (phải) — Place Order: User → Web UI → CheckoutController → OrderService/OrderDAO, rồi PaymentService/PaymentDAO" loading="lazy" /><p class="chu-thich">🧩 Slide 9 (phải) — Place Order: User → Web UI → CheckoutController → OrderService/OrderDAO, rồi PaymentService/PaymentDAO</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Sequence diagram "Place Order" in the 3-layered design (slide 9, right)
' Chép lại từ slide 9: câu trả lời tiếp theo của AI cho yêu cầu "sequence diagram cho đặt hàng"
actor User
participant "Web UI" as UI
participant CheckoutController as C
participant OrderService as OS
participant PaymentService as PS
participant OrderDAO as OD
participant PaymentDAO as PD
User -&gt; UI : Place Order Request
UI -&gt; C : submitOrder()
C -&gt; OS : createOrder(cartData)
OS -&gt; OD : saveOrder(order)
OD --&gt; OS : confirmation
C -&gt; PS : processPayment(order)
PS -&gt; PD : savePayment(transaction)
PD --&gt; PS : confirmation
PS --&gt; C : payment success
C --&gt; UI : show order confirmation
@enduml</code></pre></details>
<p><strong>Soát sequence diagram.</strong> Nó khớp với component diagram (cùng tên, lời gọi đi xuống theo tầng) — tốt. Những gì nó bỏ sót, và người chấm Assignment 03 sẽ hỏi:</p>
<table>
<thead><tr><th>Thiếu</th><th>Vì sao quan trọng</th><th>Thêm vào bản đã soát</th></tr></thead>
<tbody>
<tr><td>luồng thất bại</td><td>thanh toán có thể bị từ chối; thiết kế chỉ có đường thuận là chưa đủ</td><td><code>alt payment approved / else payment declined</code></td></tr>
<tr><td>trạng thái đơn hàng</td><td>đơn được lưu trước khi thanh toán — ở trạng thái gì?</td><td><code>PENDING_PAYMENT</code> → <code>PAID</code> / <code>PAYMENT_FAILED</code></td></tr>
<tr><td>cổng thanh toán bên ngoài</td><td>"PaymentDAO.savePayment" chỉ lưu dữ liệu; chẳng có gì thực sự trừ tiền</td><td>thêm participant Payment Gateway (một actor phụ)</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/b354ef26a07d8974e190d2bbf8db4df14c47a0a8.svg" alt="Sau khi soát — Place Order có nhánh thanh toán bị từ chối và trạng thái đơn" loading="lazy" /><p class="chu-thich">🧩 Sau khi soát — Place Order có nhánh thanh toán bị từ chối và trạng thái đơn</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title "Place Order" after review: the failure path and the order status the AI left out
' Soát bổ sung: cổng thanh toán, khung alt khi bị từ chối, cập nhật trạng thái đơn
actor User
participant "Web UI" as UI
participant CheckoutController as C
participant OrderService as OS
participant PaymentService as PS
participant OrderDAO as OD
participant "Payment Gateway" as GW
User -&gt; UI : Place Order Request
UI -&gt; C : submitOrder(cart)
C -&gt; OS : createOrder(cartData)
OS -&gt; OD : saveOrder(order, PENDING_PAYMENT)
OD --&gt; OS : orderId
OS --&gt; C : order
C -&gt; PS : processPayment(order)
PS -&gt; GW : charge(amount, method)
alt payment approved
  GW --&gt; PS : approved(txId)
  PS -&gt; OS : markPaid(orderId, txId)
  OS -&gt; OD : updateStatus(orderId, PAID)
  PS --&gt; C : payment success
  C --&gt; UI : show order confirmation
else payment declined
  GW --&gt; PS : declined(reason)
  PS -&gt; OS : markPaymentFailed(orderId)
  OS -&gt; OD : updateStatus(orderId, PAYMENT_FAILED)
  PS --&gt; C : payment failed(reason)
  C --&gt; UI : show error and retry option
end
@enduml</code></pre></details>
<p><strong>➕ Mở rộng ngoài slide:</strong> slide 7 có nhắc deployment diagram nhưng cả bộ không hề vẽ. Các tầng là <em>logic</em>; chúng chạy ở đâu là một quyết định riêng:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/28b5c5305203453b926c1b8e7e5f2d08abb6c0cf.svg" alt="Triển khai cửa hàng 3 tầng: trình duyệt, máy chủ ứng dụng, máy chủ CSDL" loading="lazy" /><p class="chu-thich">🧩 Triển khai cửa hàng 3 tầng: trình duyệt, máy chủ ứng dụng, máy chủ CSDL</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Deployment diagram of the 3-layered shop (extension: the diagram slide 7 mentions but does not show)
' Tầng là logic; node là vật lý. Ở đây ba tầng chạy trên hai node máy chủ
node "Client device" as N1 {
  artifact "Web browser (Web UI)" as A1
}
node "Application server" as N2 {
  artifact "shop-app.jar\\nPresentation + Business + Data Access" as A2
}
node "Database server" as N3 {
  database "PostgreSQL" as D
}
N1 -- N2 : HTTPS
N2 -- N3 : JDBC/TCP 5432
@enduml</code></pre></details>`],
      [10, 'AI-Supported System Design',
        `<p class="y-chinh">🎯 Use GitHub Copilot to quickly generate Service and DAO classes, auto-complete common CRUD methods, and produce code that follows popular patterns (Service, Repository, Dependency Injection…).</p>
<p>Below is the kind of code Copilot completes for the three layers of slide 9 — a DAO with CRUD, services with the business rules, a controller, all wired by <strong>constructor injection</strong> (the object is handed its dependencies instead of creating them — what Spring does for you). It runs; the output is real.</p>
<pre class="trich"><code class="language-java">// Data Access Layer: CRUD only, no business rule
interface OrderDAO {
    Order save(Order o);
    Optional&lt;Order&gt; findById(long id);
    List&lt;Order&gt; findAll();
    void delete(long id);
}

class InMemoryOrderDAO implements OrderDAO {
    private final Map&lt;Long, Order&gt; rows = new LinkedHashMap&lt;&gt;();
    public Order save(Order o) { rows.put(o.id(), o); return o; }
    public Optional&lt;Order&gt; findById(long id) { return Optional.ofNullable(rows.get(id)); }
    public List&lt;Order&gt; findAll() { return new ArrayList&lt;&gt;(rows.values()); }
    public void delete(long id) { rows.remove(id); }
}

class PaymentDAO {
    private final List&lt;Payment&gt; rows = new ArrayList&lt;&gt;();
    Payment savePayment(Payment p) { rows.add(p); return p; }
}</code></pre>
<pre class="trich"><code class="language-java">// Business Layer: rules live here; it only knows the DAO interfaces
class OrderService {
    private final OrderDAO orderDAO;
    private long nextId = 1;
    OrderService(OrderDAO orderDAO) { this.orderDAO = orderDAO; }

    Order createOrder(String customer, List&lt;Long&gt; cartPrices) {
        if (cartPrices.isEmpty()) throw new IllegalArgumentException("Cart is empty");
        long total = cartPrices.stream().mapToLong(Long::longValue).sum();
        return orderDAO.save(new Order(nextId++, customer, total, "PENDING_PAYMENT"));
    }

    void markPaid(long orderId) {
        Order o = orderDAO.findById(orderId).orElseThrow();
        orderDAO.save(new Order(o.id(), o.customer(), o.total(), "PAID"));
    }
}

class PaymentService {
    private final PaymentDAO paymentDAO;
    private final OrderService orderService;
    PaymentService(PaymentDAO paymentDAO, OrderService orderService) {
        this.paymentDAO = paymentDAO;
        this.orderService = orderService;
    }

    String processPayment(Order order) {
        paymentDAO.savePayment(new Payment(order.id(), order.total(), "SUCCESS"));
        orderService.markPaid(order.id());
        return "payment success";
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Presentation Layer: turns a request into service calls, holds no data
class CheckoutController {
    private final OrderService orderService;
    private final PaymentService paymentService;
    CheckoutController(OrderService o, PaymentService p) { this.orderService = o; this.paymentService = p; }

    String submitOrder(String customer, List&lt;Long&gt; cart) {
        try {
            Order order = orderService.createOrder(customer, cart);
            String result = paymentService.processPayment(order);
            return "Order #" + order.id() + " (" + order.total() + " VND): " + result;
        } catch (IllegalArgumentException e) {
            return "Rejected: " + e.getMessage();
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">OrderDAO orderDAO = new InMemoryOrderDAO();                 // what Spring would inject
OrderService orderService = new OrderService(orderDAO);
PaymentService paymentService = new PaymentService(new PaymentDAO(), orderService);
CheckoutController controller = new CheckoutController(orderService, paymentService);

System.out.println(controller.submitOrder("an", List.of(120000L, 35000L)));
System.out.println(controller.submitOrder("binh", List.of()));
System.out.println(controller.submitOrder("chi", List.of(99000L)));
for (Order o : orderDAO.findAll()) System.out.println(o);</code></pre>
<div class="out">Order #1 (155000 VND): payment success<br>
Rejected: Cart is empty<br>
Order #2 (99000 VND): payment success<br>
Order[id=1, customer=an, total=155000, status=PAID]<br>
Order[id=2, customer=chi, total=99000, status=PAID]</div>
<p><strong>What to check in Copilot's code</strong> (it compiles, so the compiler will not tell you): business rules sit in the service, not the controller (here "cart must not be empty"); the controller never calls a DAO; the DAO has no rule; every dependency is injected, never created with <code>new</code> inside a class. ➕ In a real Spring Boot 3 project you would not even write the DAO: <code>interface OrderRepository extends JpaRepository&lt;Order, Long&gt;</code> gives all CRUD methods for free — Copilot often writes a manual DAO or old <code>javax.persistence</code> imports instead of <code>jakarta.persistence</code>.</p>
<div class="pitfall">The generated code has <strong>no transaction</strong>: if payment fails after the order is saved, the database keeps a half-finished order. In Spring you add <code>@Transactional</code> on the service method — a design decision the AI will not make unless you ask.</div>`,
        `<p class="y-chinh">🎯 Dùng GitHub Copilot để nhanh chóng sinh lớp Service và DAO, tự hoàn thành các hàm CRUD (tạo/đọc/sửa/xoá) thông dụng, và sinh code theo các mẫu phổ biến (Service, Repository, Dependency Injection — tiêm phụ thuộc…).</p>
<p>Dưới đây là loại code Copilot hay gợi ý cho ba tầng ở slide 9 — một DAO có CRUD, các service chứa luật nghiệp vụ, một controller, tất cả nối bằng <strong>tiêm qua constructor</strong> (constructor injection: đối tượng được đưa sẵn các phụ thuộc thay vì tự tạo — đúng việc Spring làm hộ bạn). Code chạy được; output là thật.</p>
<pre class="trich"><code class="language-java">// Tầng truy cập dữ liệu: chỉ CRUD, không có luật nghiệp vụ
interface OrderDAO {
    Order save(Order o);
    Optional&lt;Order&gt; findById(long id);
    List&lt;Order&gt; findAll();
    void delete(long id);
}

class InMemoryOrderDAO implements OrderDAO {
    private final Map&lt;Long, Order&gt; rows = new LinkedHashMap&lt;&gt;();
    public Order save(Order o) { rows.put(o.id(), o); return o; }
    public Optional&lt;Order&gt; findById(long id) { return Optional.ofNullable(rows.get(id)); }
    public List&lt;Order&gt; findAll() { return new ArrayList&lt;&gt;(rows.values()); }
    public void delete(long id) { rows.remove(id); }
}

class PaymentDAO {
    private final List&lt;Payment&gt; rows = new ArrayList&lt;&gt;();
    Payment savePayment(Payment p) { rows.add(p); return p; }
}</code></pre>
<pre class="trich"><code class="language-java">// Tầng nghiệp vụ: luật nằm ở đây; nó chỉ biết interface DAO
class OrderService {
    private final OrderDAO orderDAO;
    private long nextId = 1;
    OrderService(OrderDAO orderDAO) { this.orderDAO = orderDAO; }

    Order createOrder(String customer, List&lt;Long&gt; cartPrices) {
        if (cartPrices.isEmpty()) throw new IllegalArgumentException("Cart is empty");
        long total = cartPrices.stream().mapToLong(Long::longValue).sum();
        return orderDAO.save(new Order(nextId++, customer, total, "PENDING_PAYMENT"));
    }

    void markPaid(long orderId) {
        Order o = orderDAO.findById(orderId).orElseThrow();
        orderDAO.save(new Order(o.id(), o.customer(), o.total(), "PAID"));
    }
}

class PaymentService {
    private final PaymentDAO paymentDAO;
    private final OrderService orderService;
    PaymentService(PaymentDAO paymentDAO, OrderService orderService) {
        this.paymentDAO = paymentDAO;
        this.orderService = orderService;
    }

    String processPayment(Order order) {
        paymentDAO.savePayment(new Payment(order.id(), order.total(), "SUCCESS"));
        orderService.markPaid(order.id());
        return "payment success";
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Tầng trình bày: biến yêu cầu thành lời gọi service, không giữ dữ liệu
class CheckoutController {
    private final OrderService orderService;
    private final PaymentService paymentService;
    CheckoutController(OrderService o, PaymentService p) { this.orderService = o; this.paymentService = p; }

    String submitOrder(String customer, List&lt;Long&gt; cart) {
        try {
            Order order = orderService.createOrder(customer, cart);
            String result = paymentService.processPayment(order);
            return "Order #" + order.id() + " (" + order.total() + " VND): " + result;
        } catch (IllegalArgumentException e) {
            return "Rejected: " + e.getMessage();
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">OrderDAO orderDAO = new InMemoryOrderDAO();                 // thứ Spring sẽ tiêm
OrderService orderService = new OrderService(orderDAO);
PaymentService paymentService = new PaymentService(new PaymentDAO(), orderService);
CheckoutController controller = new CheckoutController(orderService, paymentService);

System.out.println(controller.submitOrder("an", List.of(120000L, 35000L)));
System.out.println(controller.submitOrder("binh", List.of()));
System.out.println(controller.submitOrder("chi", List.of(99000L)));
for (Order o : orderDAO.findAll()) System.out.println(o);</code></pre>
<div class="out">Order #1 (155000 VND): payment success<br>
Rejected: Cart is empty<br>
Order #2 (99000 VND): payment success<br>
Order[id=1, customer=an, total=155000, status=PAID]<br>
Order[id=2, customer=chi, total=99000, status=PAID]</div>
<p><strong>Kiểm gì trong code của Copilot</strong> (nó biên dịch được, nên trình biên dịch không báo gì): luật nghiệp vụ nằm ở service, không ở controller (ở đây "giỏ hàng không được rỗng"); controller không bao giờ gọi DAO; DAO không chứa luật; mọi phụ thuộc được tiêm vào, không bao giờ <code>new</code> bên trong lớp. ➕ Trong dự án Spring Boot 3 thật bạn còn không phải viết DAO: <code>interface OrderRepository extends JpaRepository&lt;Order, Long&gt;</code> cho sẵn mọi hàm CRUD — Copilot hay viết DAO thủ công, hoặc import <code>javax.persistence</code> cũ thay vì <code>jakarta.persistence</code>.</p>
<div class="pitfall">Code sinh ra <strong>không có transaction</strong> (giao dịch): nếu thanh toán hỏng sau khi đơn đã lưu, CSDL giữ lại một đơn dở dang. Trong Spring bạn thêm <code>@Transactional</code> lên hàm của service — một quyết định thiết kế AI sẽ không tự đưa ra nếu bạn không hỏi.</div>`],
      [11, 'AI Suggestions for Design Patterns',
        `<p class="y-chinh">🎯 ChatGPT: ask "which pattern fits use case A?", get patterns for specific functions (Singleton for logging, Strategy for payment…), generate sample code. Copilot: generates pattern code from a comment such as <code>// Singleton pattern for configuration</code>. Demo: "a flexible payment processing module that supports multiple methods" → Strategy + Java snippet.</p>
<p>A pattern is chosen from the <strong>problem</strong>, not from the feature name. The trick that makes AI suggestions checkable is to state the problem in GoF's words and compare with each pattern's <em>intent</em> (Chapter 4):</p>
<table>
<thead><tr><th>Problem phrase in the requirement</th><th>Pattern whose intent matches</th><th>Chapter 4 lesson</th></tr></thead>
<tbody>
<tr><td>"several ways to do the same thing, chosen at run time"</td><td>Strategy</td><td>behavioral patterns</td></tr>
<tr><td>"create objects without naming the exact class"</td><td>Factory Method / Abstract Factory</td><td>creational patterns</td></tr>
<tr><td>"exactly one shared instance" (config, logger)</td><td>Singleton — in Spring, a singleton-scoped <code>@Bean</code></td><td>creational patterns</td></tr>
<tr><td>"notify many parts when something changes"</td><td>Observer — Spring <code>ApplicationEvent</code></td><td>behavioral patterns</td></tr>
<tr><td>"use an external API whose interface does not fit"</td><td>Adapter</td><td>structural patterns</td></tr>
</tbody>
</table>
<div class="pitfall">AI tools <strong>over-apply</strong> patterns: ask "which pattern?" and you always get one, even when a plain <code>if</code> is enough. Ask instead "is a pattern justified here, and what would the code look like without it?". Singleton is the classic over-suggestion — global state that makes testing hard.</div>`,
        `<p class="y-chinh">🎯 ChatGPT: hỏi "pattern nào hợp với use case A?", nhận gợi ý pattern cho từng chức năng (Singleton cho ghi log, Strategy cho thanh toán…), sinh code mẫu. Copilot: sinh code pattern từ một dòng chú thích như <code>// Singleton pattern for configuration</code>. Demo: "một module xử lý thanh toán linh hoạt, hỗ trợ nhiều phương thức" → Strategy + đoạn Java.</p>
<p>Pattern được chọn từ <strong>vấn đề</strong>, không từ tên chức năng. Mẹo để kiểm được gợi ý của AI là phát biểu vấn đề bằng lời của GoF rồi so với <em>intent</em> (ý định) của từng pattern (Chương 4):</p>
<table>
<thead><tr><th>Cụm từ vấn đề trong yêu cầu</th><th>Pattern có intent khớp</th><th>Bài Chương 4</th></tr></thead>
<tbody>
<tr><td>"nhiều cách làm cùng một việc, chọn lúc chạy"</td><td>Strategy</td><td>behavioral patterns (mẫu hành vi)</td></tr>
<tr><td>"tạo đối tượng mà không nêu đích danh lớp"</td><td>Factory Method / Abstract Factory</td><td>creational patterns (mẫu khởi tạo)</td></tr>
<tr><td>"đúng một thể hiện dùng chung" (cấu hình, logger)</td><td>Singleton — trong Spring là <code>@Bean</code> phạm vi singleton</td><td>creational patterns</td></tr>
<tr><td>"báo cho nhiều bên khi có gì thay đổi"</td><td>Observer — <code>ApplicationEvent</code> của Spring</td><td>behavioral patterns</td></tr>
<tr><td>"dùng một API ngoài có giao diện không khớp"</td><td>Adapter</td><td>structural patterns (mẫu cấu trúc)</td></tr>
</tbody>
</table>
<div class="pitfall">Công cụ AI <strong>lạm dụng</strong> pattern: hỏi "pattern nào?" là lúc nào cũng nhận được một cái, kể cả khi một câu <code>if</code> là đủ. Hãy hỏi "ở đây có đáng dùng pattern không, và không có nó thì code trông ra sao?". Singleton là gợi ý thừa kinh điển — trạng thái toàn cục làm khó kiểm thử.</div>`],
      [12, 'AI Suggestions for Design Patterns',
        `<p class="y-chinh">🎯 Requirement: "The system supports multiple payment methods (Momo, ZaloPay, Credit Card). It must be easily extensible." Prompt: "I'm designing a payment system that can flexibly support different payment methods. Which design pattern should I use? Please explain and provide an example in Java." ChatGPT answers: the <strong>Strategy pattern</strong> — it defines a family of algorithms (payment methods), encapsulates each one and makes them interchangeable at run time; it follows the Open/Closed Principle, so new methods are added without modifying existing code.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/4820a4d235be03a152f05c4314344098a729088d.svg" alt="Class view of the AI's answer: PaymentStrategy with two concrete strategies and a context" loading="lazy" /><p class="chu-thich">🧩 Class view of the AI's answer: PaymentStrategy with two concrete strategies and a context</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Strategy pattern as ChatGPT proposed it (slides 12-13)
' Class view of the AI's Java answer: one interface, concrete strategies CreditCardPayment and PayPalPayment
interface PaymentStrategy {
  + pay(amount : double) : void
}
class CreditCardPayment {
  + pay(amount : double) : void
}
class PayPalPayment {
  + pay(amount : double) : void
}
class PaymentContext {
  - strategy : PaymentStrategy
  + setPaymentStrategy(s : PaymentStrategy) : void
  + pay(amount : double) : void
}
PaymentStrategy &lt;|.. CreditCardPayment
PaymentStrategy &lt;|.. PayPalPayment
PaymentContext o--&gt; "1" PaymentStrategy
@enduml</code></pre></details>
<p>The answer is correct and the reasoning (OCP — open for extension, closed for modification, the "O" of SOLID) is exactly what a PE question 5 asks you to write. But look at what happened between the requirement and the prompt: the requirement names <strong>Momo, ZaloPay and Credit Card</strong>, the prompt names none of them — so the AI's example (slide 13) uses Credit Card and <strong>PayPal</strong>, a method nobody asked for. The AI answered a generic question because it was given a generic question.</p>
<p class="meo">🧠 Paste the requirement, not your summary of it. Every detail you drop from the prompt is a detail the AI will invent.</p>`,
        `<p class="y-chinh">🎯 Yêu cầu: "Hệ thống hỗ trợ nhiều phương thức thanh toán (Momo, ZaloPay, thẻ tín dụng). Phải dễ mở rộng." Prompt: "Tôi đang thiết kế một hệ thống thanh toán hỗ trợ linh hoạt nhiều phương thức. Nên dùng design pattern nào? Giải thích và cho ví dụ Java." ChatGPT trả lời: <strong>Strategy pattern</strong> — định nghĩa một họ thuật toán (các phương thức thanh toán), đóng gói từng cái và cho chúng thay thế nhau lúc chạy; nó theo nguyên lý Đóng/Mở (Open/Closed Principle), nên thêm phương thức mới mà không sửa code cũ.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/4820a4d235be03a152f05c4314344098a729088d.svg" alt="Góc nhìn lớp của câu trả lời AI: PaymentStrategy, hai chiến lược cụ thể và một context" loading="lazy" /><p class="chu-thich">🧩 Góc nhìn lớp của câu trả lời AI: PaymentStrategy, hai chiến lược cụ thể và một context</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Strategy pattern as ChatGPT proposed it (slides 12-13)
' Góc nhìn lớp của đoạn Java AI trả lời: một interface, các chiến lược cụ thể CreditCardPayment và PayPalPayment
interface PaymentStrategy {
  + pay(amount : double) : void
}
class CreditCardPayment {
  + pay(amount : double) : void
}
class PayPalPayment {
  + pay(amount : double) : void
}
class PaymentContext {
  - strategy : PaymentStrategy
  + setPaymentStrategy(s : PaymentStrategy) : void
  + pay(amount : double) : void
}
PaymentStrategy &lt;|.. CreditCardPayment
PaymentStrategy &lt;|.. PayPalPayment
PaymentContext o--&gt; "1" PaymentStrategy
@enduml</code></pre></details>
<p>Câu trả lời đúng và lập luận (OCP — mở để mở rộng, đóng để sửa đổi, chữ "O" của SOLID) đúng là thứ câu 5 đề PE bắt bạn viết. Nhưng nhìn chuyện xảy ra giữa yêu cầu và prompt: yêu cầu nêu <strong>Momo, ZaloPay và thẻ tín dụng</strong>, prompt không nêu cái nào — nên ví dụ của AI (slide 13) dùng thẻ tín dụng và <strong>PayPal</strong>, phương thức chẳng ai yêu cầu. AI trả lời câu hỏi chung chung vì nó được hỏi chung chung.</p>
<p class="meo">🧠 Dán nguyên yêu cầu, đừng dán bản tóm tắt của bạn. Chi tiết nào bạn bỏ khỏi prompt là chi tiết AI sẽ tự bịa.</p>`],
      [13, 'AI Suggestions for Design Patterns',
        `<p class="y-chinh">🎯 The AI's Java code example: (1) the strategy interface <code>PaymentStrategy</code> with <code>void pay(double amount)</code>; (2) concrete strategies <code>CreditCardPayment</code> and <code>PayPalPayment</code> that print "Paid … using …".</p>
<p>The screenshot ends after <code>PayPalPayment</code>; the context class and <code>main</code> below are the usual third and fourth parts of such an answer, completed by us so the code runs. Output is real.</p>
<pre class="trich"><code class="language-java">interface PaymentStrategy {
    void pay(double amount);
}

class CreditCardPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using Credit Card.");
    }
}

class PayPalPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using PayPal.");
    }
}

class PaymentContext {
    private PaymentStrategy strategy;

    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public void pay(double amount) {
        strategy.pay(amount);
    }
}</code></pre>
<pre class="trich"><code class="language-java">PaymentContext context = new PaymentContext();
context.setPaymentStrategy(new CreditCardPayment());
context.pay(150000);
context.setPaymentStrategy(new PayPalPayment());
context.pay(0.1 + 0.2);                      // money as double: the first thing a reviewer checks
PaymentContext forgotten = new PaymentContext();
try {
    forgotten.pay(50000);                    // no strategy set yet
} catch (NullPointerException e) {
    System.out.println("NullPointerException: no strategy was set");
}</code></pre>
<div class="out">Paid 150000.0 using Credit Card.<br>
Paid 0.30000000000000004 using PayPal.<br>
NullPointerException: no strategy was set</div>
<p><strong>Review — four defects the pattern hides:</strong> (1) money as <code>double</code>: 0.1 + 0.2 prints 0.30000000000000004, and 150000 VND prints as "150000.0" — use <code>BigDecimal</code>; (2) <code>pay</code> prints and returns nothing, so the caller cannot know whether payment succeeded; (3) a context without a strategy throws <code>NullPointerException</code>; (4) the methods are not the ones in the requirement. The reviewed version fixes all four and chooses the strategy from a map, which is how a Spring service receives every <code>@Component</code> implementing the interface:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/8188e6c63b482b72197e5dde59240b0635df0be1.svg" alt="After review — Momo, ZaloPay, CreditCard; BigDecimal; PaymentResult; PaymentService picks the strategy" loading="lazy" /><p class="chu-thich">🧩 After review — Momo, ZaloPay, CreditCard; BigDecimal; PaymentResult; PaymentService picks the strategy</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Strategy after review: the methods the requirement named, money as BigDecimal, a result instead of println
' Review fixes: Momo and ZaloPay (named in the requirement) instead of PayPal, BigDecimal, PaymentResult, registry by method
interface PaymentStrategy {
  + method() : PaymentMethod
  + pay(orderId : String, amount : BigDecimal) : PaymentResult
}
class MomoPayment
class ZaloPayPayment
class CreditCardPayment
enum PaymentMethod {
  MOMO
  ZALOPAY
  CREDIT_CARD
}
class PaymentService {
  - strategies : Map&lt;PaymentMethod, PaymentStrategy&gt;
  + checkout(orderId : String, amount : BigDecimal, m : PaymentMethod) : PaymentResult
}
class PaymentResult &lt;&lt;record&gt;&gt; {
  + success : boolean
  + message : String
}
PaymentStrategy &lt;|.. MomoPayment
PaymentStrategy &lt;|.. ZaloPayPayment
PaymentStrategy &lt;|.. CreditCardPayment
PaymentService o--&gt; "1..*" PaymentStrategy
PaymentStrategy ..&gt; PaymentResult
PaymentStrategy ..&gt; PaymentMethod
@enduml</code></pre></details>
<pre><code class="language-java">// Slides 12-14 after human review: the methods named in the requirement, BigDecimal money, a result object, no null strategy
import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

enum PaymentMethod { MOMO, ZALOPAY, CREDIT_CARD, VNPAY }

record PaymentResult(boolean success, String message) {}

interface PaymentStrategy {
    PaymentMethod method();
    PaymentResult pay(String orderId, BigDecimal amount);
}

class MomoPayment implements PaymentStrategy {
    public PaymentMethod method() { return PaymentMethod.MOMO; }
    public PaymentResult pay(String orderId, BigDecimal amount) {
        return new PaymentResult(true, "Momo wallet charged " + amount + " VND for " + orderId);
    }
}

class ZaloPayPayment implements PaymentStrategy {
    public PaymentMethod method() { return PaymentMethod.ZALOPAY; }
    public PaymentResult pay(String orderId, BigDecimal amount) {
        return new PaymentResult(true, "ZaloPay charged " + amount + " VND for " + orderId);
    }
}

class CreditCardPayment implements PaymentStrategy {
    private static final BigDecimal LIMIT = new BigDecimal("20000000");
    public PaymentMethod method() { return PaymentMethod.CREDIT_CARD; }
    public PaymentResult pay(String orderId, BigDecimal amount) {
        if (amount.compareTo(LIMIT) &gt; 0) return new PaymentResult(false, "Card limit exceeded for " + orderId);
        return new PaymentResult(true, "Card charged " + amount + " VND for " + orderId);
    }
}

// The context: in Spring, List&lt;PaymentStrategy&gt; is injected with every @Component that implements the interface
class PaymentService {
    private final Map&lt;PaymentMethod, PaymentStrategy&gt; strategies = new EnumMap&lt;&gt;(PaymentMethod.class);

    PaymentService(List&lt;PaymentStrategy&gt; all) {
        for (PaymentStrategy s : all) strategies.put(s.method(), s);
    }

    PaymentResult checkout(String orderId, BigDecimal amount, PaymentMethod m) {
        if (amount.signum() &lt;= 0) return new PaymentResult(false, "Amount must be positive");
        PaymentStrategy s = strategies.get(m);
        if (s == null) return new PaymentResult(false, "Unsupported payment method: " + m);
        return s.pay(orderId, amount);
    }
}

public class ReviewedPayment {
    public static void main(String[] args) {
        PaymentService service = new PaymentService(List.of(new MomoPayment(), new ZaloPayPayment(), new CreditCardPayment()));
        System.out.println(service.checkout("ORD-1", new BigDecimal("150000"), PaymentMethod.MOMO).message());
        System.out.println(service.checkout("ORD-2", new BigDecimal("0.1").add(new BigDecimal("0.2")), PaymentMethod.ZALOPAY).message());
        System.out.println(service.checkout("ORD-3", new BigDecimal("25000000"), PaymentMethod.CREDIT_CARD));
        System.out.println(service.checkout("ORD-4", new BigDecimal("99000"), PaymentMethod.VNPAY));
        System.out.println(service.checkout("ORD-5", BigDecimal.ZERO, PaymentMethod.MOMO));
        System.out.println("double: 0.1 + 0.2 = " + (0.1 + 0.2));
    }
}</code></pre>
<div class="out">Momo wallet charged 150000 VND for ORD-1<br>
ZaloPay charged 0.3 VND for ORD-2<br>
PaymentResult[success=false, message=Card limit exceeded for ORD-3]<br>
PaymentResult[success=false, message=Unsupported payment method: VNPAY]<br>
PaymentResult[success=false, message=Amount must be positive]<br>
double: 0.1 + 0.2 = 0.30000000000000004</div>
<p>Adding VNPay later = one new class implementing <code>PaymentStrategy</code>; <code>PaymentService</code> does not change (Open/Closed). The run shows the other side too: until that class exists, VNPay is rejected with a clear message instead of a crash.</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): LabFlow has no payments, but it has the same shape of problem — who must approve a reservation (nobody, the lecturer of the student group, or the Lab Manager for large labs and flagged equipment). An <code>ApprovalPolicy</code> interface with one class per rule is a Strategy you can defend at the committee with the same OCP argument.</div>`,
        `<p class="y-chinh">🎯 Code Java mẫu của AI: (1) interface chiến lược <code>PaymentStrategy</code> với <code>void pay(double amount)</code>; (2) các chiến lược cụ thể <code>CreditCardPayment</code> và <code>PayPalPayment</code> in ra "Paid … using …".</p>
<p>Ảnh chụp dừng sau <code>PayPalPayment</code>; lớp context và <code>main</code> dưới đây là phần thứ ba, thứ tư thường có của một câu trả lời kiểu này, do chúng tôi viết nốt để code chạy được. Output là thật.</p>
<pre class="trich"><code class="language-java">interface PaymentStrategy {
    void pay(double amount);
}

class CreditCardPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using Credit Card.");
    }
}

class PayPalPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using PayPal.");
    }
}

class PaymentContext {
    private PaymentStrategy strategy;

    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public void pay(double amount) {
        strategy.pay(amount);
    }
}</code></pre>
<pre class="trich"><code class="language-java">PaymentContext context = new PaymentContext();
context.setPaymentStrategy(new CreditCardPayment());
context.pay(150000);
context.setPaymentStrategy(new PayPalPayment());
context.pay(0.1 + 0.2);                      // tiền kiểu double: thứ đầu tiên người soát phải kiểm
PaymentContext forgotten = new PaymentContext();
try {
    forgotten.pay(50000);                    // chưa đặt chiến lược nào
} catch (NullPointerException e) {
    System.out.println("NullPointerException: no strategy was set");
}</code></pre>
<div class="out">Paid 150000.0 using Credit Card.<br>
Paid 0.30000000000000004 using PayPal.<br>
NullPointerException: no strategy was set</div>
<p><strong>Soát — bốn lỗi mà pattern che mất:</strong> (1) tiền kiểu <code>double</code>: 0.1 + 0.2 in ra 0.30000000000000004, còn 150000 VND in thành "150000.0" — dùng <code>BigDecimal</code>; (2) <code>pay</code> chỉ in và không trả về gì, nên bên gọi không biết thanh toán có thành công không; (3) context chưa có chiến lược thì ném <code>NullPointerException</code>; (4) các phương thức không phải những cái yêu cầu nêu. Bản đã soát sửa cả bốn và chọn chiến lược từ một bảng tra (map) — đúng cách một service Spring nhận mọi <code>@Component</code> cài interface đó:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/8188e6c63b482b72197e5dde59240b0635df0be1.svg" alt="Sau khi soát — Momo, ZaloPay, CreditCard; BigDecimal; PaymentResult; PaymentService chọn chiến lược" loading="lazy" /><p class="chu-thich">🧩 Sau khi soát — Momo, ZaloPay, CreditCard; BigDecimal; PaymentResult; PaymentService chọn chiến lược</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Strategy after review: the methods the requirement named, money as BigDecimal, a result instead of println
' Soát: Momo và ZaloPay (đề nêu) thay PayPal, BigDecimal, PaymentResult, bảng tra theo phương thức
interface PaymentStrategy {
  + method() : PaymentMethod
  + pay(orderId : String, amount : BigDecimal) : PaymentResult
}
class MomoPayment
class ZaloPayPayment
class CreditCardPayment
enum PaymentMethod {
  MOMO
  ZALOPAY
  CREDIT_CARD
}
class PaymentService {
  - strategies : Map&lt;PaymentMethod, PaymentStrategy&gt;
  + checkout(orderId : String, amount : BigDecimal, m : PaymentMethod) : PaymentResult
}
class PaymentResult &lt;&lt;record&gt;&gt; {
  + success : boolean
  + message : String
}
PaymentStrategy &lt;|.. MomoPayment
PaymentStrategy &lt;|.. ZaloPayPayment
PaymentStrategy &lt;|.. CreditCardPayment
PaymentService o--&gt; "1..*" PaymentStrategy
PaymentStrategy ..&gt; PaymentResult
PaymentStrategy ..&gt; PaymentMethod
@enduml</code></pre></details>
<pre><code class="language-java">// Slide 12-14 sau khi người soát: đúng phương thức đề nêu, tiền BigDecimal, trả về kết quả, không có chiến lược null
import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

enum PaymentMethod { MOMO, ZALOPAY, CREDIT_CARD, VNPAY }

record PaymentResult(boolean success, String message) {}

interface PaymentStrategy {
    PaymentMethod method();
    PaymentResult pay(String orderId, BigDecimal amount);
}

class MomoPayment implements PaymentStrategy {
    public PaymentMethod method() { return PaymentMethod.MOMO; }
    public PaymentResult pay(String orderId, BigDecimal amount) {
        return new PaymentResult(true, "Momo wallet charged " + amount + " VND for " + orderId);
    }
}

class ZaloPayPayment implements PaymentStrategy {
    public PaymentMethod method() { return PaymentMethod.ZALOPAY; }
    public PaymentResult pay(String orderId, BigDecimal amount) {
        return new PaymentResult(true, "ZaloPay charged " + amount + " VND for " + orderId);
    }
}

class CreditCardPayment implements PaymentStrategy {
    private static final BigDecimal LIMIT = new BigDecimal("20000000");
    public PaymentMethod method() { return PaymentMethod.CREDIT_CARD; }
    public PaymentResult pay(String orderId, BigDecimal amount) {
        if (amount.compareTo(LIMIT) &gt; 0) return new PaymentResult(false, "Card limit exceeded for " + orderId);
        return new PaymentResult(true, "Card charged " + amount + " VND for " + orderId);
    }
}

// Ngữ cảnh: trong Spring, List&lt;PaymentStrategy&gt; được tiêm mọi @Component cài interface này
class PaymentService {
    private final Map&lt;PaymentMethod, PaymentStrategy&gt; strategies = new EnumMap&lt;&gt;(PaymentMethod.class);

    PaymentService(List&lt;PaymentStrategy&gt; all) {
        for (PaymentStrategy s : all) strategies.put(s.method(), s);
    }

    PaymentResult checkout(String orderId, BigDecimal amount, PaymentMethod m) {
        if (amount.signum() &lt;= 0) return new PaymentResult(false, "Amount must be positive");
        PaymentStrategy s = strategies.get(m);
        if (s == null) return new PaymentResult(false, "Unsupported payment method: " + m);
        return s.pay(orderId, amount);
    }
}

public class ReviewedPayment {
    public static void main(String[] args) {
        PaymentService service = new PaymentService(List.of(new MomoPayment(), new ZaloPayPayment(), new CreditCardPayment()));
        System.out.println(service.checkout("ORD-1", new BigDecimal("150000"), PaymentMethod.MOMO).message());
        System.out.println(service.checkout("ORD-2", new BigDecimal("0.1").add(new BigDecimal("0.2")), PaymentMethod.ZALOPAY).message());
        System.out.println(service.checkout("ORD-3", new BigDecimal("25000000"), PaymentMethod.CREDIT_CARD));
        System.out.println(service.checkout("ORD-4", new BigDecimal("99000"), PaymentMethod.VNPAY));
        System.out.println(service.checkout("ORD-5", BigDecimal.ZERO, PaymentMethod.MOMO));
        System.out.println("double: 0.1 + 0.2 = " + (0.1 + 0.2));
    }
}</code></pre>
<div class="out">Momo wallet charged 150000 VND for ORD-1<br>
ZaloPay charged 0.3 VND for ORD-2<br>
PaymentResult[success=false, message=Card limit exceeded for ORD-3]<br>
PaymentResult[success=false, message=Unsupported payment method: VNPAY]<br>
PaymentResult[success=false, message=Amount must be positive]<br>
double: 0.1 + 0.2 = 0.30000000000000004</div>
<p>Sau này thêm VNPay = một lớp mới cài <code>PaymentStrategy</code>; <code>PaymentService</code> không đổi (Đóng/Mở). Lần chạy cho thấy cả mặt kia: khi lớp đó chưa có, VNPay bị từ chối kèm thông báo rõ ràng thay vì sập chương trình.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): LabFlow không có thanh toán, nhưng có vấn đề cùng hình dạng — ai phải duyệt một lượt đặt (không ai, giảng viên của nhóm sinh viên, hay Lab Manager với phòng lớn và thiết bị bị gắn cờ). Một interface <code>ApprovalPolicy</code> với mỗi luật một lớp là một Strategy bạn bảo vệ được trước hội đồng bằng đúng lập luận OCP.</div>`],
      [14, 'AI Suggestions for Design Patterns',
        `<p class="y-chinh">🎯 The AI's comparison "Strategy pattern vs other patterns for payment systems": Strategy, Factory Method, Template Method and Command, each with purpose, pros, cons and when to use.</p>
<table>
<thead><tr><th>Pattern</th><th>General purpose</th><th>Pros</th><th>Cons</th><th>When to use</th></tr></thead>
<tbody>
<tr><td>Strategy</td><td>encapsulate interchangeable behaviours (algorithms)</td><td>easy to extend, runtime flexibility</td><td>may involve many small classes</td><td>several ways to perform the same action (various payment methods)</td></tr>
<tr><td>Factory Method</td><td>create objects without specifying the exact class</td><td>encapsulates object creation</td><td>harder to manage with many types</td><td>hide the creation logic of payment methods</td></tr>
<tr><td>Template Method</td><td>define the skeleton of an algorithm, subclasses customize steps</td><td>reuses common workflow logic</td><td>less flexible than Strategy</td><td>payment processes similar with small differences</td></tr>
<tr><td>Command</td><td>encapsulate an action as an object</td><td>enables undo/redo, command queuing</td><td>more complex if undo is not needed</td><td>payment treated as a command (logging, retries, queueing)</td></tr>
</tbody>
</table>
<p>How to read it: these patterns are <strong>not rivals</strong> — they answer different questions and are often combined. Strategy answers "<em>how</em> is this payment done?"; Factory Method answers "<em>who creates</em> the right strategy from the string 'MOMO'?"; Template Method fits when every method shares the steps validate → charge → record and only "charge" differs (inheritance instead of composition); Command fits when a payment must be stored, retried or queued. The reviewed code on slide 13 already combines Strategy with a small factory (the map).</p>
<p>Asking the AI for a comparison table is the best habit this deck teaches: it forces the answer to show alternatives, which is exactly what the PE and the defence ask — "why this pattern and not another?".</p>`,
        `<p class="y-chinh">🎯 Bảng so sánh của AI "Strategy so với các pattern khác cho hệ thống thanh toán": Strategy, Factory Method, Template Method và Command, mỗi cái có mục đích, ưu, nhược và khi nào dùng.</p>
<table>
<thead><tr><th>Pattern</th><th>Mục đích chung</th><th>Ưu</th><th>Nhược</th><th>Khi nào dùng</th></tr></thead>
<tbody>
<tr><td>Strategy</td><td>đóng gói các hành vi (thuật toán) thay thế được cho nhau</td><td>dễ mở rộng, linh hoạt lúc chạy</td><td>có thể sinh nhiều lớp nhỏ</td><td>có nhiều cách thực hiện cùng một việc (nhiều phương thức thanh toán)</td></tr>
<tr><td>Factory Method</td><td>tạo đối tượng mà không nêu đích danh lớp</td><td>đóng gói việc khởi tạo</td><td>khó quản lý khi có quá nhiều loại</td><td>muốn giấu logic khởi tạo các phương thức thanh toán</td></tr>
<tr><td>Template Method</td><td>định nghĩa khung một thuật toán, lớp con tuỳ biến từng bước</td><td>dùng lại luồng xử lý chung</td><td>kém linh hoạt hơn Strategy</td><td>các quy trình thanh toán giống nhau, khác chút ít</td></tr>
<tr><td>Command</td><td>đóng gói một hành động thành đối tượng</td><td>cho phép undo/redo, xếp hàng lệnh</td><td>phức tạp hơn nếu không cần undo</td><td>coi thanh toán là một lệnh (ghi log, thử lại, xếp hàng)</td></tr>
</tbody>
</table>
<p>Cách đọc: các pattern này <strong>không phải đối thủ</strong> — chúng trả lời những câu hỏi khác nhau và hay được kết hợp. Strategy trả lời "thanh toán này làm <em>thế nào</em>?"; Factory Method trả lời "<em>ai tạo</em> ra đúng chiến lược từ chuỗi 'MOMO'?"; Template Method hợp khi mọi phương thức có chung các bước kiểm → trừ tiền → ghi nhận và chỉ bước "trừ tiền" khác nhau (dùng kế thừa thay vì kết hợp); Command hợp khi một lần thanh toán phải được lưu, thử lại hay xếp hàng. Code đã soát ở slide 13 đã kết hợp Strategy với một factory nhỏ (bảng map).</p>
<p>Xin AI một bảng so sánh là thói quen tốt nhất bộ slide này dạy: nó buộc câu trả lời bày ra các phương án, đúng thứ đề PE và buổi bảo vệ hỏi — "vì sao chọn pattern này mà không phải cái khác?".</p>`],
      [15, 'Using AI to Select an Appropriate Architecture',
        `<p class="y-chinh">🎯 Four steps with sample prompts: (1) describe the system requirements ("a real-time chat application with high concurrency, scalability and fast message delivery — what architectural style do you recommend and why?"); (2) compare styles ("Microservices, Layered and Event-Driven for an online shopping system, pros and cons"); (3) ask for a diagram ("a PlantUML component diagram for a microservices architecture of an e-commerce platform"); (4) review and customize.</p>
<pre><code class="language-plaintext">1. I am designing a real-time chat application with high concurrency, scalability,
   and fast message delivery. What architectural style do you recommend and why?
2. Compare Microservices, Layered Architecture, and Event-Driven Architecture for
   an online shopping system. List pros and cons of each.
3. Generate a PlantUML component diagram for a microservices architecture of an
   e-commerce platform.
4. Review and customize.</code></pre>
<p>Step 4 has one line on the slide and is most of the work. A typical answer to prompt 3 (illustration below) <em>looks</em> like microservices but is a "distributed monolith": every service shares one database and they call each other in a synchronous chain, so one slow service blocks all and no service can change its tables alone.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/fc042a08c9564909bd8f458e15b078853243b5a6.svg" alt="Illustration — a typical AI &quot;microservices&quot; diagram: shared database, synchronous call chain" loading="lazy" /><p class="chu-thich">🧩 Illustration — a typical AI "microservices" diagram: shared database, synchronous call chain</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title A typical AI "microservices" diagram that is really a distributed monolith (illustration)
' Error to spot: every service shares one database, and services call each other in a synchronous chain
actor Customer
[API Gateway] as GW
[User Service] as US
[Product Service] as PS
[Order Service] as OS
[Payment Service] as PayS
database "Shared Database" as DB
Customer --&gt; GW
GW --&gt; US
GW --&gt; PS
GW --&gt; OS
OS --&gt; PS : REST
OS --&gt; PayS : REST
PayS --&gt; US : REST
US --&gt; DB
PS --&gt; DB
OS --&gt; DB
PayS --&gt; DB
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/7da53f18db85265d8dac5325d0c0c9c30d8d6c6a.svg" alt="After review — database per service, cross-service updates through events" loading="lazy" /><p class="chu-thich">🧩 After review — database per service, cross-service updates through events</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title E-commerce microservices after review: database per service, events for cross-service updates
' Fixed: each service owns its data; order and payment talk through a message broker instead of a call chain
actor Customer
[API Gateway] as GW
[User Service] as US
[Product Service] as PS
[Order Service] as OS
[Payment Service] as PayS
queue "Message Broker" as MB
database "User DB" as UDB
database "Product DB" as PDB
database "Order DB" as ODB
database "Payment DB" as PayDB
Customer --&gt; GW
GW --&gt; US
GW --&gt; PS
GW --&gt; OS
US --&gt; UDB
PS --&gt; PDB
OS --&gt; ODB
PayS --&gt; PayDB
OS ..&gt; MB : OrderPlaced
MB ..&gt; PayS : OrderPlaced
PayS ..&gt; MB : PaymentCompleted
MB ..&gt; OS : PaymentCompleted
@enduml</code></pre></details>
<table>
<thead><tr><th>Review question for any AI architecture</th><th>In the illustration</th></tr></thead>
<tbody>
<tr><td>does each service own its data?</td><td>no — one shared database → fixed: one DB per service</td></tr>
<tr><td>can a service fail without stopping the others?</td><td>no — Order → Payment → User chain → fixed: events through a broker</td></tr>
<tr><td>is every requirement placed in some component?</td><td>check against your use case list</td></tr>
<tr><td>is the style justified by a quality attribute, not by fashion?</td><td>the answer must cite scalability / availability needs</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Bốn bước kèm prompt mẫu: (1) mô tả yêu cầu hệ thống ("một app chat thời gian thực, đồng thời cao, mở rộng được, giao tin nhanh — nên dùng kiểu kiến trúc nào và vì sao?"); (2) so sánh các kiểu ("Microservices, Layered và Event-Driven cho hệ bán hàng online, ưu nhược từng cái"); (3) xin sơ đồ ("một PlantUML component diagram cho kiến trúc microservices của một nền tảng thương mại điện tử"); (4) soát và tuỳ chỉnh.</p>
<pre><code class="language-plaintext">1. I am designing a real-time chat application with high concurrency, scalability,
   and fast message delivery. What architectural style do you recommend and why?
2. Compare Microservices, Layered Architecture, and Event-Driven Architecture for
   an online shopping system. List pros and cons of each.
3. Generate a PlantUML component diagram for a microservices architecture of an
   e-commerce platform.
4. Review and customize.</code></pre>
<p>Bước 4 chỉ có một dòng trên slide mà lại là phần lớn công việc. Một câu trả lời điển hình cho prompt 3 (minh hoạ dưới) <em>trông</em> như microservices nhưng thật ra là "khối nguyên phân tán" (distributed monolith): mọi service dùng chung một CSDL và gọi nhau thành chuỗi đồng bộ, nên một service chậm là chặn tất cả, và không service nào tự đổi bảng của mình được.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/fc042a08c9564909bd8f458e15b078853243b5a6.svg" alt="Minh hoạ — sơ đồ &quot;microservices&quot; AI hay sinh: CSDL dùng chung, chuỗi gọi đồng bộ" loading="lazy" /><p class="chu-thich">🧩 Minh hoạ — sơ đồ "microservices" AI hay sinh: CSDL dùng chung, chuỗi gọi đồng bộ</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title A typical AI "microservices" diagram that is really a distributed monolith (illustration)
' Lỗi cần thấy: mọi service dùng chung một CSDL, và gọi nhau thành chuỗi đồng bộ
actor Customer
[API Gateway] as GW
[User Service] as US
[Product Service] as PS
[Order Service] as OS
[Payment Service] as PayS
database "Shared Database" as DB
Customer --&gt; GW
GW --&gt; US
GW --&gt; PS
GW --&gt; OS
OS --&gt; PS : REST
OS --&gt; PayS : REST
PayS --&gt; US : REST
US --&gt; DB
PS --&gt; DB
OS --&gt; DB
PayS --&gt; DB
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/7da53f18db85265d8dac5325d0c0c9c30d8d6c6a.svg" alt="Sau khi soát — mỗi service một CSDL, cập nhật chéo qua sự kiện" loading="lazy" /><p class="chu-thich">🧩 Sau khi soát — mỗi service một CSDL, cập nhật chéo qua sự kiện</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title E-commerce microservices after review: database per service, events for cross-service updates
' Đã sửa: mỗi service sở hữu dữ liệu của mình; order và payment nói chuyện qua message broker thay vì chuỗi gọi
actor Customer
[API Gateway] as GW
[User Service] as US
[Product Service] as PS
[Order Service] as OS
[Payment Service] as PayS
queue "Message Broker" as MB
database "User DB" as UDB
database "Product DB" as PDB
database "Order DB" as ODB
database "Payment DB" as PayDB
Customer --&gt; GW
GW --&gt; US
GW --&gt; PS
GW --&gt; OS
US --&gt; UDB
PS --&gt; PDB
OS --&gt; ODB
PayS --&gt; PayDB
OS ..&gt; MB : OrderPlaced
MB ..&gt; PayS : OrderPlaced
PayS ..&gt; MB : PaymentCompleted
MB ..&gt; OS : PaymentCompleted
@enduml</code></pre></details>
<table>
<thead><tr><th>Câu hỏi soát cho mọi kiến trúc AI đề xuất</th><th>Trong bản minh hoạ</th></tr></thead>
<tbody>
<tr><td>mỗi service có sở hữu dữ liệu của mình không?</td><td>không — một CSDL chung → sửa: mỗi service một CSDL</td></tr>
<tr><td>một service hỏng thì các service khác còn chạy không?</td><td>không — chuỗi Order → Payment → User → sửa: sự kiện qua broker (bộ chuyển thông điệp)</td></tr>
<tr><td>mọi yêu cầu có nằm trong một thành phần nào đó không?</td><td>đối chiếu với danh sách use case của bạn</td></tr>
<tr><td>kiểu kiến trúc có được biện minh bằng thuộc tính chất lượng, không phải vì "mốt" không?</td><td>câu trả lời phải dẫn nhu cầu mở rộng / sẵn sàng</td></tr>
</tbody>
</table>`],
      [16, 'Using AI to Select an Appropriate Architecture',
        `<p class="y-chinh">🎯 Case study: design an <strong>Online Food Delivery System</strong>. Functional requirements: users browse menus, place and track orders in real time; restaurants receive and prepare orders; drivers accept delivery tasks and update status; the system sends live order-status updates. Non-functional: thousands of concurrent orders, real-time response (tracking), scalable to many restaurants and regions, high reliability between loosely coupled components (delivery, payment…).</p>
<p>Before asking any AI, translate the non-functional requirements into the quality attributes of school Ch.20 — that list is what the AI's recommendation must be judged against:</p>
<table>
<thead><tr><th>Requirement on the slide</th><th>Quality attribute</th><th>Architectural consequence</th></tr></thead>
<tbody>
<tr><td>thousands of concurrent orders</td><td>performance, scalability</td><td>stateless services that scale out; no single bottleneck database</td></tr>
<tr><td>real-time order tracking</td><td>performance (latency)</td><td>push to the client (WebSocket) instead of polling</td></tr>
<tr><td>many restaurants and regions</td><td>scalability</td><td>partition data and services, add instances per region</td></tr>
<tr><td>reliable, loosely coupled components</td><td>availability, modifiability</td><td>asynchronous messages (a broker); a failed payment service must not stop ordering</td></tr>
</tbody>
</table>
<p>Actors: Customer, Restaurant, Driver (plus Payment Gateway and a map service as external systems). These are the inputs for the AI prompts of slide 17.</p>`,
        `<p class="y-chinh">🎯 Case study: thiết kế <strong>Hệ thống giao đồ ăn online</strong>. Yêu cầu chức năng: người dùng xem thực đơn, đặt món và theo dõi đơn theo thời gian thực; nhà hàng nhận và chuẩn bị đơn; tài xế nhận việc giao và cập nhật trạng thái; hệ thống gửi cập nhật trạng thái đơn trực tiếp. Phi chức năng: hàng nghìn đơn đồng thời, phản hồi thời gian thực (theo dõi đơn), mở rộng được cho nhiều nhà hàng và khu vực, tin cậy cao giữa các thành phần ghép lỏng (giao hàng, thanh toán…).</p>
<p>Trước khi hỏi AI, hãy dịch yêu cầu phi chức năng thành thuộc tính chất lượng của Ch.20 trường — danh sách đó là thước đo để chấm lời khuyên của AI:</p>
<table>
<thead><tr><th>Yêu cầu trên slide</th><th>Thuộc tính chất lượng</th><th>Hệ quả kiến trúc</th></tr></thead>
<tbody>
<tr><td>hàng nghìn đơn đồng thời</td><td>hiệu năng, khả năng mở rộng (scalability)</td><td>service không giữ trạng thái, nhân bản ra nhiều máy; không có một CSDL làm nút thắt</td></tr>
<tr><td>theo dõi đơn thời gian thực</td><td>hiệu năng (độ trễ)</td><td>đẩy xuống client (WebSocket) thay vì hỏi liên tục (polling)</td></tr>
<tr><td>nhiều nhà hàng và khu vực</td><td>khả năng mở rộng</td><td>chia dữ liệu và service, thêm thể hiện theo khu vực</td></tr>
<tr><td>thành phần tin cậy, ghép lỏng</td><td>tính sẵn sàng (availability), dễ sửa đổi</td><td>thông điệp bất đồng bộ (broker); dịch vụ thanh toán hỏng không được làm dừng việc đặt món</td></tr>
</tbody>
</table>
<p>Actor: Customer (khách), Restaurant (nhà hàng), Driver (tài xế) (cộng Payment Gateway và dịch vụ bản đồ là hệ thống ngoài). Đây là đầu vào cho các prompt AI ở slide 17.</p>`],
      [17, 'Using AI to Select an Appropriate Architecture',
        `<p class="y-chinh">🎯 The tasks: use AI to recommend an architecture; explain why it fits; ask the AI to compare at least two architectures (e.g. microservices vs layered); request a PlantUML component diagram for the recommendation; identify design patterns for key components (payment, notification, delivery assignment).</p>
<p><strong>A reviewed answer</strong> (what you should end with after asking and checking — not a raw AI answer):</p>
<table>
<thead><tr><th>Criterion</th><th>Layered monolith</th><th>Event-driven microservices</th></tr></thead>
<tbody>
<tr><td>thousands of concurrent orders</td><td>scale the whole app together</td><td>scale only Order/Delivery services</td></tr>
<tr><td>real-time tracking</td><td>possible, but the app does everything</td><td>a dedicated realtime gateway pushes status events</td></tr>
<tr><td>a failing payment provider</td><td>can slow the whole app</td><td>payment reacts to events; ordering continues</td></tr>
<tr><td>team and cost</td><td>simple to build, test, deploy</td><td>needs a broker, monitoring, eventual consistency</td></tr>
</tbody>
</table>
<p>Recommendation: <strong>event-driven microservices</strong>, because the case explicitly asks for scalability per region, real-time push and loose coupling. The honest caveat — which a good AI answer should also give — is cost: for a student team of 4–5, a well-modularized monolith with a message queue is a legitimate alternative; state which one you chose and why.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/90782868ca289134a30087c21c92cdc8a4d7ca42.svg" alt="Recommended architecture — gateway, services owning their data, event broker, realtime gateway" loading="lazy" /><p class="chu-thich">🧩 Recommended architecture — gateway, services owning their data, event broker, realtime gateway</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Online Food Delivery System (slides 16-17): event-driven microservices, one reviewed answer
' Case study solution: gateway + WebSocket for live tracking, services own their data, broker for loose coupling
actor Customer
actor Restaurant
actor Driver
[API Gateway] as GW
[Realtime Gateway\\n(WebSocket)] as WS
[Menu Service] as MS
[Order Service] as OS
[Payment Service] as PS
[Delivery Service] as DS
[Notification Service] as NS
queue "Event Broker\\n(Kafka)" as K
database "Menu DB" as MDB
database "Order DB" as ODB
database "Payment DB" as PDB
database "Delivery DB" as DDB
Customer --&gt; GW
Restaurant --&gt; GW
Driver --&gt; GW
Customer &lt;-- WS : live status
GW --&gt; MS
GW --&gt; OS
GW --&gt; DS
MS --&gt; MDB
OS --&gt; ODB
PS --&gt; PDB
DS --&gt; DDB
OS ..&gt; K : OrderPlaced
K ..&gt; PS : OrderPlaced
PS ..&gt; K : PaymentCompleted
K ..&gt; DS : OrderReady
DS ..&gt; K : StatusChanged
K ..&gt; NS : all status events
NS --&gt; WS : push
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/c81e48108179ee3582105d26677e059f92849feb.svg" alt="Patterns for the key components: Strategy (payment, driver assignment), Observer (status notification)" loading="lazy" /><p class="chu-thich">🧩 Patterns for the key components: Strategy (payment, driver assignment), Observer (status notification)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Design patterns for the key components of the food delivery system (slide 17, last task)
' Strategy for payment, Strategy for driver assignment, Observer for status notification
package "Payment (Strategy)" {
  interface PaymentStrategy {
    + pay(order : Order) : PaymentResult
  }
  class MomoPayment
  class CardPayment
  class CashOnDelivery
  PaymentStrategy &lt;|.. MomoPayment
  PaymentStrategy &lt;|.. CardPayment
  PaymentStrategy &lt;|.. CashOnDelivery
}
package "Delivery assignment (Strategy)" {
  interface AssignmentPolicy {
    + choose(order : Order, drivers : List&lt;Driver&gt;) : Driver
  }
  class NearestDriverPolicy
  class LeastBusyDriverPolicy
  AssignmentPolicy &lt;|.. NearestDriverPolicy
  AssignmentPolicy &lt;|.. LeastBusyDriverPolicy
}
package "Notification (Observer)" {
  class OrderStatusPublisher {
    + subscribe(l : StatusListener) : void
    + publish(e : StatusChanged) : void
  }
  interface StatusListener {
    + onStatusChanged(e : StatusChanged) : void
  }
  class PushNotifier
  class SmsNotifier
  OrderStatusPublisher o--&gt; "0..*" StatusListener
  StatusListener &lt;|.. PushNotifier
  StatusListener &lt;|.. SmsNotifier
}
@enduml</code></pre></details>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): LabFlow chose the <em>other</em> column — a modular monolith — and its SDS says why: one developer, transactions kept simple (the exclusion constraint that blocks double-booking lives in one database), clear module boundaries. That is a valid architecture decision, and exactly the "why not microservices?" answer the committee expects.</div>`,
        `<p class="y-chinh">🎯 Các yêu cầu: dùng AI đề xuất kiến trúc; giải thích vì sao hợp; bắt AI so sánh ít nhất hai kiến trúc (vd microservices với layered); xin PlantUML component diagram cho kiến trúc được chọn; xác định design pattern cho các thành phần chính (thanh toán, thông báo, phân việc giao hàng).</p>
<p><strong>Một câu trả lời đã soát</strong> (thứ bạn nên có sau khi hỏi và kiểm — không phải câu trả lời AI thô):</p>
<table>
<thead><tr><th>Tiêu chí</th><th>Khối nguyên phân tầng</th><th>Microservices hướng sự kiện</th></tr></thead>
<tbody>
<tr><td>hàng nghìn đơn đồng thời</td><td>phải nhân bản cả ứng dụng</td><td>chỉ nhân bản service Order/Delivery</td></tr>
<tr><td>theo dõi thời gian thực</td><td>làm được, nhưng một app gánh mọi việc</td><td>có riêng một realtime gateway đẩy sự kiện trạng thái</td></tr>
<tr><td>nhà cung cấp thanh toán gặp sự cố</td><td>có thể làm chậm cả app</td><td>payment phản ứng theo sự kiện; đặt món vẫn chạy</td></tr>
<tr><td>nhóm và chi phí</td><td>dựng, test, triển khai đơn giản</td><td>cần broker, giám sát, nhất quán sau cùng (eventual consistency)</td></tr>
</tbody>
</table>
<p>Đề xuất: <strong>microservices hướng sự kiện</strong> (event-driven), vì case đòi rõ khả năng mở rộng theo khu vực, đẩy thời gian thực và ghép lỏng. Điều cần nói thật — mà một câu trả lời AI tốt cũng phải nói — là chi phí: với nhóm sinh viên 4–5 người, một khối nguyên chia module tốt kèm hàng đợi thông điệp là phương án chính đáng; ghi rõ bạn chọn cái nào và vì sao.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/90782868ca289134a30087c21c92cdc8a4d7ca42.svg" alt="Kiến trúc đề xuất — gateway, service sở hữu dữ liệu, broker sự kiện, realtime gateway" loading="lazy" /><p class="chu-thich">🧩 Kiến trúc đề xuất — gateway, service sở hữu dữ liệu, broker sự kiện, realtime gateway</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Online Food Delivery System (slides 16-17): event-driven microservices, one reviewed answer
' Lời giải case study: gateway + WebSocket cho theo dõi trực tiếp, service sở hữu dữ liệu, broker để giảm phụ thuộc
actor Customer
actor Restaurant
actor Driver
[API Gateway] as GW
[Realtime Gateway\\n(WebSocket)] as WS
[Menu Service] as MS
[Order Service] as OS
[Payment Service] as PS
[Delivery Service] as DS
[Notification Service] as NS
queue "Event Broker\\n(Kafka)" as K
database "Menu DB" as MDB
database "Order DB" as ODB
database "Payment DB" as PDB
database "Delivery DB" as DDB
Customer --&gt; GW
Restaurant --&gt; GW
Driver --&gt; GW
Customer &lt;-- WS : live status
GW --&gt; MS
GW --&gt; OS
GW --&gt; DS
MS --&gt; MDB
OS --&gt; ODB
PS --&gt; PDB
DS --&gt; DDB
OS ..&gt; K : OrderPlaced
K ..&gt; PS : OrderPlaced
PS ..&gt; K : PaymentCompleted
K ..&gt; DS : OrderReady
DS ..&gt; K : StatusChanged
K ..&gt; NS : all status events
NS --&gt; WS : push
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/c81e48108179ee3582105d26677e059f92849feb.svg" alt="Pattern cho các thành phần chính: Strategy (thanh toán, phân tài xế), Observer (thông báo trạng thái)" loading="lazy" /><p class="chu-thich">🧩 Pattern cho các thành phần chính: Strategy (thanh toán, phân tài xế), Observer (thông báo trạng thái)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Design patterns for the key components of the food delivery system (slide 17, last task)
' Strategy cho thanh toán, Strategy cho phân tài xế, Observer cho thông báo trạng thái
package "Payment (Strategy)" {
  interface PaymentStrategy {
    + pay(order : Order) : PaymentResult
  }
  class MomoPayment
  class CardPayment
  class CashOnDelivery
  PaymentStrategy &lt;|.. MomoPayment
  PaymentStrategy &lt;|.. CardPayment
  PaymentStrategy &lt;|.. CashOnDelivery
}
package "Delivery assignment (Strategy)" {
  interface AssignmentPolicy {
    + choose(order : Order, drivers : List&lt;Driver&gt;) : Driver
  }
  class NearestDriverPolicy
  class LeastBusyDriverPolicy
  AssignmentPolicy &lt;|.. NearestDriverPolicy
  AssignmentPolicy &lt;|.. LeastBusyDriverPolicy
}
package "Notification (Observer)" {
  class OrderStatusPublisher {
    + subscribe(l : StatusListener) : void
    + publish(e : StatusChanged) : void
  }
  interface StatusListener {
    + onStatusChanged(e : StatusChanged) : void
  }
  class PushNotifier
  class SmsNotifier
  OrderStatusPublisher o--&gt; "0..*" StatusListener
  StatusListener &lt;|.. PushNotifier
  StatusListener &lt;|.. SmsNotifier
}
@enduml</code></pre></details>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): LabFlow chọn cột <em>còn lại</em> — modular monolith — và SDS nói lý do: một người làm, transaction đơn giản (exclusion constraint chặn đặt trùng nằm trong một CSDL), ranh giới module rõ. Đó là một quyết định kiến trúc hợp lệ, và đúng câu trả lời cho "sao không dùng microservices?" mà hội đồng chờ nghe.</div>`],
      [18, 'Conclusion',
        `<p class="y-chinh">🎯 Conclusion: AI is a supportive assistant, not a replacement for the designer; AI outputs need validation and refinement; integrating AI helps students think more systematically and work more efficiently.</p>
<p><strong>➕ Beyond the slide — what "validation" means in practice.</strong> Before any AI diagram goes into a report, run this checklist. The four rows are the errors AI makes most often; each has a built example below.</p>
<table>
<thead><tr><th>Diagram</th><th>Check</th><th>Typical AI error</th></tr></thead>
<tbody>
<tr><td>use case</td><td>include = mandatory, base → included; extend = conditional, extension → base; actors outside; goal-level names</td><td>include/extend swapped (slide 6 illustration)</td></tr>
<tr><td>class</td><td>every association has multiplicities at both ends; no foreign-key attributes in analysis classes; boundary / control / entity not mixed</td><td>missing multiplicities; a controller that stores entity data</td></tr>
<tr><td>sequence</td><td>follows the use case steps; calls go down the layers; the alternative path is shown</td><td>happy path only (slide 9)</td></tr>
<tr><td>statechart</td><td>states are conditions that last, not actions; each arrow "event [guard] / action"; timer events "after (t)"</td><td>"Sending Email" as a state; no guards</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/d6b51644b6f0d3abc1241db8f922a901d780fdc0.svg" alt="Illustration — AI draft of LabFlow classes: no multiplicities, foreign keys as attributes, boundary holding data" loading="lazy" /><p class="chu-thich">🧩 Illustration — AI draft of LabFlow classes: no multiplicities, foreign keys as attributes, boundary holding data</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title LabFlow analysis classes as an AI drafted them (illustration: three errors)
' Errors: no multiplicities, foreign-key attributes in analysis classes, a boundary class holding entity data
class ReservationController &lt;&lt;boundary&gt;&gt; {
  - reservationId : Long
  - startTime : LocalDateTime
  - status : String
  + createReservation() : void
}
class Reservation &lt;&lt;entity&gt;&gt; {
  - id : Long
  - userId : Long
  - equipmentId : Long
  - startTime : LocalDateTime
}
class Equipment &lt;&lt;entity&gt;&gt; {
  - id : Long
  - name : String
}
class User &lt;&lt;entity&gt;&gt; {
  - id : Long
  - email : String
}
User -- Reservation
Equipment -- Reservation
ReservationController --&gt; Reservation
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/4c1de09b5ceef6874370c057978180e16ce3d313.svg" alt="After review — boundary, coordinator and entities separated; multiplicities; no foreign keys" loading="lazy" /><p class="chu-thich">🧩 After review — boundary, coordinator and entities separated; multiplicities; no foreign keys</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title LabFlow analysis classes after review: multiplicities, no foreign keys, boundary-control-entity separated
' Fixed: a control object runs the use case, entities hold data, every association has multiplicities
class ReservationUI &lt;&lt;boundary&gt;&gt; {
  + showSlots() : void
  + submit(request) : void
}
class ReservationCoordinator &lt;&lt;coordinator&gt;&gt; {
  + createReservation(request) : Reservation
}
class Reservation &lt;&lt;entity&gt;&gt; {
  - startTime : LocalDateTime
  - endTime : LocalDateTime
  - status : ReservationStatus
}
class Equipment &lt;&lt;entity&gt;&gt; {
  - name : String
  - serialNo : String
}
class Member &lt;&lt;entity&gt;&gt; {
  - email : String
  - role : Role
}
ReservationUI --&gt; ReservationCoordinator
ReservationCoordinator --&gt; Reservation
Member "1" -- "0..*" Reservation : makes &gt;
Reservation "0..*" -- "1" Equipment : reserves &gt;
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/6040cc4776ce74487662ed23962a017c69272fc4.svg" alt="Illustration — AI draft of the Reservation statechart: actions as states, no guards, no timer" loading="lazy" /><p class="chu-thich">🧩 Illustration — AI draft of the Reservation statechart: actions as states, no guards, no timer</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Reservation statechart as an AI drafted it (illustration: states that are actions, missing guards and timer)
' Errors: "Sending Email" and "Checking Slot" are actions not states; Cancel has no guard; no-show has no timer event
hide empty description
[*] --&gt; CheckingSlot
state "Checking Slot" as CheckingSlot
state "Sending Email" as SendingEmail
CheckingSlot --&gt; SendingEmail
SendingEmail --&gt; CONFIRMED
CONFIRMED --&gt; CHECKED_IN : check in
CONFIRMED --&gt; CANCELLED : cancel
CHECKED_IN --&gt; CANCELLED : cancel
CONFIRMED --&gt; NO_SHOW
CHECKED_IN --&gt; COMPLETED
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/2e2c0ee188cb2b0aaf9560fc47a2e3058c69ccf7.svg" alt="After review — LabFlow Reservation statechart with events, guards, actions and the no-show timer" loading="lazy" /><p class="chu-thich">🧩 After review — LabFlow Reservation statechart with events, guards, actions and the no-show timer</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Reservation statechart after review (LabFlow): events, guards, actions and the timer event
' Fixed: only waiting conditions are states; each arrow is event [guard] / action; no-show fired by a timer
hide empty description
[*] --&gt; PENDING_APPROVAL : Request Submitted [needs approval]
[*] --&gt; CONFIRMED : Request Submitted [no approval needed] / Send Confirmation
PENDING_APPROVAL --&gt; CONFIRMED : Approved / Send Confirmation
PENDING_APPROVAL --&gt; REJECTED : Rejected / Notify Requester
PENDING_APPROVAL --&gt; CANCELLED : Cancel [by requester]
CONFIRMED --&gt; CANCELLED : Cancel [before start time] / Release Slot
CONFIRMED --&gt; CHECKED_IN : QR Scanned [within check-in window]
CONFIRMED --&gt; NO_SHOW : after (check-in window ends) / Release Slot
CHECKED_IN --&gt; COMPLETED : Session Ended
REJECTED --&gt; [*]
CANCELLED --&gt; [*]
NO_SHOW --&gt; [*]
COMPLETED --&gt; [*]
@enduml</code></pre></details>
<p class="meo">🧠 The AI writes the first draft; you write the second — and only the second goes into the report, together with the declaration of the first.</p>`,
        `<p class="y-chinh">🎯 Kết luận: AI là trợ lý hỗ trợ, không thay người thiết kế; output của AI phải được kiểm chứng và chỉnh sửa; đưa AI vào giúp sinh viên suy nghĩ có hệ thống hơn và làm việc hiệu quả hơn.</p>
<p><strong>➕ Mở rộng ngoài slide — "kiểm chứng" nghĩa là làm gì trong thực tế.</strong> Trước khi đưa bất kỳ sơ đồ AI nào vào báo cáo, chạy bảng kiểm này. Bốn dòng là bốn lỗi AI mắc nhiều nhất; mỗi dòng có ví dụ dựng thật bên dưới.</p>
<table>
<thead><tr><th>Sơ đồ</th><th>Kiểm</th><th>Lỗi AI điển hình</th></tr></thead>
<tbody>
<tr><td>use case</td><td>include = bắt buộc, gốc → được include; extend = có điều kiện, mở rộng → gốc; actor ở ngoài; tên ở mức mục tiêu</td><td>đảo include/extend (minh hoạ ở slide 6)</td></tr>
<tr><td>class</td><td>mọi liên kết có bội số (multiplicity) ở cả hai đầu; lớp phân tích không có thuộc tính khoá ngoại; boundary / control / entity (biên / điều khiển / thực thể — BCE) không trộn lẫn</td><td>thiếu bội số; một controller giữ dữ liệu entity</td></tr>
<tr><td>sequence</td><td>bám các bước use case; lời gọi đi xuống theo tầng; có luồng thay thế</td><td>chỉ có đường thuận (slide 9)</td></tr>
<tr><td>statechart</td><td>trạng thái là tình trạng kéo dài, không phải hành động; mỗi mũi tên "event [guard] / action" (sự kiện [điều kiện canh] / hành động); sự kiện hẹn giờ "after (t)"</td><td>"Sending Email" thành trạng thái; thiếu điều kiện canh</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/d6b51644b6f0d3abc1241db8f922a901d780fdc0.svg" alt="Minh hoạ — bản AI phác lớp LabFlow: thiếu bội số, khoá ngoại làm thuộc tính, lớp biên giữ dữ liệu" loading="lazy" /><p class="chu-thich">🧩 Minh hoạ — bản AI phác lớp LabFlow: thiếu bội số, khoá ngoại làm thuộc tính, lớp biên giữ dữ liệu</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title LabFlow analysis classes as an AI drafted them (illustration: three errors)
' Lỗi: thiếu bội số, thuộc tính khoá ngoại trong lớp phân tích, lớp biên giữ dữ liệu entity
class ReservationController &lt;&lt;boundary&gt;&gt; {
  - reservationId : Long
  - startTime : LocalDateTime
  - status : String
  + createReservation() : void
}
class Reservation &lt;&lt;entity&gt;&gt; {
  - id : Long
  - userId : Long
  - equipmentId : Long
  - startTime : LocalDateTime
}
class Equipment &lt;&lt;entity&gt;&gt; {
  - id : Long
  - name : String
}
class User &lt;&lt;entity&gt;&gt; {
  - id : Long
  - email : String
}
User -- Reservation
Equipment -- Reservation
ReservationController --&gt; Reservation
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/4c1de09b5ceef6874370c057978180e16ce3d313.svg" alt="Sau khi soát — tách boundary, coordinator và entity; có bội số; không có khoá ngoại" loading="lazy" /><p class="chu-thich">🧩 Sau khi soát — tách boundary, coordinator và entity; có bội số; không có khoá ngoại</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title LabFlow analysis classes after review: multiplicities, no foreign keys, boundary-control-entity separated
' Đã sửa: một đối tượng điều khiển chạy use case, entity giữ dữ liệu, mọi liên kết có bội số
class ReservationUI &lt;&lt;boundary&gt;&gt; {
  + showSlots() : void
  + submit(request) : void
}
class ReservationCoordinator &lt;&lt;coordinator&gt;&gt; {
  + createReservation(request) : Reservation
}
class Reservation &lt;&lt;entity&gt;&gt; {
  - startTime : LocalDateTime
  - endTime : LocalDateTime
  - status : ReservationStatus
}
class Equipment &lt;&lt;entity&gt;&gt; {
  - name : String
  - serialNo : String
}
class Member &lt;&lt;entity&gt;&gt; {
  - email : String
  - role : Role
}
ReservationUI --&gt; ReservationCoordinator
ReservationCoordinator --&gt; Reservation
Member "1" -- "0..*" Reservation : makes &gt;
Reservation "0..*" -- "1" Equipment : reserves &gt;
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/6040cc4776ce74487662ed23962a017c69272fc4.svg" alt="Minh hoạ — bản AI phác statechart Reservation: hành động thành trạng thái, thiếu điều kiện canh, thiếu hẹn giờ" loading="lazy" /><p class="chu-thich">🧩 Minh hoạ — bản AI phác statechart Reservation: hành động thành trạng thái, thiếu điều kiện canh, thiếu hẹn giờ</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Reservation statechart as an AI drafted it (illustration: states that are actions, missing guards and timer)
' Lỗi: "Sending Email" và "Checking Slot" là hành động, không phải trạng thái; Cancel không có điều kiện canh; no-show thiếu sự kiện hẹn giờ
hide empty description
[*] --&gt; CheckingSlot
state "Checking Slot" as CheckingSlot
state "Sending Email" as SendingEmail
CheckingSlot --&gt; SendingEmail
SendingEmail --&gt; CONFIRMED
CONFIRMED --&gt; CHECKED_IN : check in
CONFIRMED --&gt; CANCELLED : cancel
CHECKED_IN --&gt; CANCELLED : cancel
CONFIRMED --&gt; NO_SHOW
CHECKED_IN --&gt; COMPLETED
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/2e2c0ee188cb2b0aaf9560fc47a2e3058c69ccf7.svg" alt="Sau khi soát — statechart Reservation của LabFlow có sự kiện, điều kiện canh, hành động và bộ hẹn giờ no-show" loading="lazy" /><p class="chu-thich">🧩 Sau khi soát — statechart Reservation của LabFlow có sự kiện, điều kiện canh, hành động và bộ hẹn giờ no-show</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Reservation statechart after review (LabFlow): events, guards, actions and the timer event
' Đã sửa: chỉ tình trạng chờ mới là trạng thái; mỗi mũi tên là event [guard] / action; no-show do bộ hẹn giờ kích hoạt
hide empty description
[*] --&gt; PENDING_APPROVAL : Request Submitted [needs approval]
[*] --&gt; CONFIRMED : Request Submitted [no approval needed] / Send Confirmation
PENDING_APPROVAL --&gt; CONFIRMED : Approved / Send Confirmation
PENDING_APPROVAL --&gt; REJECTED : Rejected / Notify Requester
PENDING_APPROVAL --&gt; CANCELLED : Cancel [by requester]
CONFIRMED --&gt; CANCELLED : Cancel [before start time] / Release Slot
CONFIRMED --&gt; CHECKED_IN : QR Scanned [within check-in window]
CONFIRMED --&gt; NO_SHOW : after (check-in window ends) / Release Slot
CHECKED_IN --&gt; COMPLETED : Session Ended
REJECTED --&gt; [*]
CANCELLED --&gt; [*]
NO_SHOW --&gt; [*]
COMPLETED --&gt; [*]
@enduml</code></pre></details>
<p class="meo">🧠 AI viết bản nháp thứ nhất; bạn viết bản thứ hai — và chỉ bản thứ hai được vào báo cáo, kèm lời khai báo về bản thứ nhất.</p>`],
    ]),
    bi(`<h2>📌 What to keep from this deck</h2>
<ul>
<li>Three tools, three jobs: ChatGPT suggests (actors, use cases, styles, patterns, code), PlantUML draws from text, Copilot types boilerplate — the designer decides. The course outcome for this is CLO7 (slide 2 lists CLO3/4/6).</li>
<li>Good prompts give a role, the <em>exact</em> requirement, the rules (UML semantics, your constraints) and the output form, and ask for assumptions. Dropped details get invented (PayPal on slide 13).</li>
<li>Every AI diagram is reviewed against the notation rules: include/extend direction, multiplicities, BCE separation, events/guards/actions, layering, failure paths.</li>
<li>Patterns come from the problem and are compared (Strategy vs Factory Method vs Template Method vs Command); AI over-suggests patterns.</li>
<li>Architecture is chosen from quality attributes; microservices need data ownership and asynchronous coupling, or they are a distributed monolith.</li>
</ul>
<h2>📝 The AI declaration the course project asks for</h2>
<p>The project document ("AI-assisted system design") requires: team of 4–5; AI allowed <em>only if</em> you declare which prompt was used and what the AI generated, and explain the output in your own understanding (how and why it was applied). Evaluation 1 (requirements: use case, activity, sequence, communication diagrams) and Evaluation 2 (architecture: component, deployment, database schema, class diagrams of ≥ 3 subsystems, one creational + one structural + one behavioral pattern) each want "documented prompts and AI output" and "clearly marked AI-supported content". The individual AI rubric (up to 10 points) grades: <strong>understanding of AI output · customization and enhancement · transparency (prompt + declaration) · effective and ethical use</strong>; you need ≥ 5/10 in both evaluations and no plagiarism. A simple declaration table per artifact:</p>
<table>
<thead><tr><th>Artifact</th><th>Tool</th><th>Prompt (exact)</th><th>What the AI produced</th><th>Kept</th><th>Changed and why</th></tr></thead>
<tbody>
<tr><td>UC diagram "Borrow/Return"</td><td>ChatGPT</td><td>"…"</td><td>6 use cases, PlantUML code</td><td>the six goals</td><td>added boundary; Pay Late Fee made «extend» [book is overdue] because it is conditional</td></tr>
</tbody>
</table>`,
    `<h2>📌 Cần nhớ từ bộ slide này</h2>
<ul>
<li>Ba công cụ, ba việc: ChatGPT gợi ý (actor, use case, kiểu kiến trúc, pattern, code), PlantUML vẽ từ chữ, Copilot gõ code rập khuôn — người thiết kế quyết định. Chuẩn đầu ra tương ứng là CLO7 (slide 2 ghi CLO3/4/6).</li>
<li>Prompt tốt có vai, <em>nguyên văn</em> yêu cầu, luật (ngữ nghĩa UML, ràng buộc của bạn) và dạng output, và bắt AI nêu giả định. Chi tiết bị bỏ sẽ bị bịa (PayPal ở slide 13).</li>
<li>Mọi sơ đồ AI đều phải soát theo luật ký pháp: chiều include/extend, bội số, tách BCE, sự kiện/điều kiện canh/hành động, phân tầng, luồng thất bại.</li>
<li>Pattern xuất phát từ vấn đề và phải được so sánh (Strategy với Factory Method, Template Method, Command); AI hay gợi ý thừa pattern.</li>
<li>Kiến trúc được chọn từ thuộc tính chất lượng; microservices phải có sở hữu dữ liệu riêng và ghép bất đồng bộ, không thì chỉ là khối nguyên phân tán.</li>
</ul>
<h2>📝 Lời khai báo AI mà đồ án môn đòi</h2>
<p>Tài liệu đồ án ("AI-assisted system design") yêu cầu: nhóm 4–5 người; được dùng AI <em>chỉ khi</em> khai rõ prompt nào đã dùng và AI đã sinh ra gì, và giải thích output bằng hiểu biết của chính mình (áp dụng thế nào, vì sao). Evaluation 1 (yêu cầu: use case, activity, sequence, communication diagram) và Evaluation 2 (kiến trúc: component, deployment, lược đồ CSDL, class diagram cho ≥ 3 subsystem, một pattern khởi tạo + một cấu trúc + một hành vi) đều đòi "prompt và output AI có ghi lại" và "phần có AI hỗ trợ được đánh dấu rõ". Rubric AI cá nhân (tối đa 10 điểm) chấm: <strong>hiểu output của AI · tuỳ chỉnh và nâng cấp output · minh bạch (prompt + khai báo) · dùng hiệu quả và có đạo đức</strong>; cần ≥ 5/10 ở cả hai lần đánh giá và không gian lận/đạo văn. Một bảng khai báo đơn giản cho mỗi sản phẩm:</p>
<table>
<thead><tr><th>Sản phẩm</th><th>Công cụ</th><th>Prompt (nguyên văn)</th><th>AI sinh ra gì</th><th>Giữ</th><th>Sửa gì và vì sao</th></tr></thead>
<tbody>
<tr><td>UC diagram "Borrow/Return"</td><td>ChatGPT</td><td>"…"</td><td>6 use case, mã PlantUML</td><td>sáu mục tiêu</td><td>thêm khung hệ thống; Pay Late Fee thành «extend» [book is overdue] vì có điều kiện</td></tr>
</tbody>
</table>`),
    books([
      ['plantuml', '"Use Case Diagram", "Component Diagram", "Deployment Diagram", "Sequence Diagram", "State Diagram" — the syntax used in every diagram of this lesson', 'mục "Use Case Diagram", "Component Diagram", "Deployment Diagram", "Sequence Diagram", "State Diagram" — cú pháp dùng trong mọi sơ đồ của bài'],
      ['gof', "Strategy (intent, applicability, consequences) — compare with the AI's answer on slides 12–14; Factory Method, Template Method, Command", 'Strategy (intent, applicability, consequences) — so với câu trả lời AI ở slide 12–14; Factory Method, Template Method, Command'],
      ['fowler', 'Chapter 3 "Class Diagrams: The Essentials" (multiplicity) and Chapter 9 "Use Cases" — the rules to check AI drafts against', 'Chương 3 "Class Diagrams: The Essentials" (bội số) và Chương 9 "Use Cases" — những luật để soát bản AI phác'],
      ['fuSlides', 'deck "Applying AI in Software Architecture and Design", slides 1–18; course document "AI-assisted system design" (Course Project)', 'bộ "Applying AI in Software Architecture and Design", slide 1–18; tài liệu đồ án "AI-assisted system design" (Course Project)'],
    ]),
  ].join('\n'),
};

/* ───────── 5.3 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Design with AI, verified: seven drafts to review, use cases to tables ───────── */
const L_on_ch5 = {
  title: '5.3 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Design with AI, verified: seven drafts to review, use cases to tables|||5.3 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Thiết kế cùng AI có kiểm chứng: bảy bản nháp cần soát',
  slug: 'swd392-on-ch5',
  type: 'VIDEO',
  description: '7 bài tập trên một case xuyên suốt "FU Canteen Pre-order": mỗi bài có đề, prompt mẫu, bản nháp "AI sinh" (minh hoạ gom lỗi AI hay mắc — nhầm include/extend, thiếu bội số, khoá ngoại trong lớp phân tích, trộn tầng boundary/control/entity, statechart thiếu guard và hẹn giờ, microservices quá tay, Singleton thay Observer, nhiều-nhiều không có bảng trung gian), bảng soát lỗi và bản đúng dựng thật bằng PlantUML + giải thích từng quyết định; statechart và Observer kiểm bằng Java chạy thật; bài 7 ánh xạ class diagram sang lược đồ quan hệ (ERD + DDL). Kèm bảng khai báo AI đúng yêu cầu Course Project, 16 thuật ngữ Anh–Việt, tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.3 · Practice &amp; review</span>
<h2>Seven AI drafts, seven reviews — the skill the course project actually grades</h2>
<p class="lead">Chapter 5 has two halves: turning the design model into a relational database (lesson 5.1) and using AI tools in design (lessons 5.2 and 5.A). This page trains both the way the course project is graded: an AI gives you a draft in seconds; you must find what is wrong, fix it, and explain why. The rubric of "AI-assisted system design" scores exactly that — <strong>understanding</strong> of the AI output, <strong>customization and enhancement</strong>, <strong>transparency</strong> (prompt + declaration) and <strong>effective, ethical use</strong>.</p>
<div class="callout"><strong>Honest label.</strong> The "AI drafts" on this page are <strong>illustrations written by the course author</strong>: each gathers the mistakes AI tools typically make for that kind of diagram, so you can practise catching them. Run the prompts in any assistant yourself — your real output will differ, but the review questions stay the same.</div>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the case. For each exercise, look at the prompt and the AI draft and <strong>write your own list of errors before opening the review table</strong>.</li>
<li>Fix the draft on paper or in PlantUML; then compare with the solution and read the "Decisions".</li>
<li>Fill the AI declaration table at the end for one exercise — that is the format your project report needs.</li>
</ol></div>
<h3>The case: FU Canteen Pre-order</h3>
<div class="callout">The campus canteen wants students to <strong>pre-order lunch</strong> from a web app and skip the queue. A student logs in with the university account, browses today's menu, chooses items and quantities and a <strong>pickup slot</strong> (every 15 minutes between 11:00 and 13:30), may enter a <strong>voucher</strong> code for a discount, and pays online through an external <strong>payment gateway</strong> (e-wallet or card). Paid orders appear on the <strong>kitchen screen</strong>; kitchen staff start cooking and mark the order ready; the student is notified (kitchen display, speaker, app). At the counter, staff scan the order's QR code to hand it over. An order not collected 30 minutes after it is ready is marked uncollected. A student may cancel a paid order up to 15 minutes before the pickup slot and gets a refund. The canteen serves about 2,000 orders a day, built by a team of four students; money must never be lost or charged twice.<br>
<em>Dịch:</em> Căn tin trường muốn sinh viên <strong>đặt món trưa trước</strong> trên web và khỏi xếp hàng. Sinh viên đăng nhập bằng tài khoản trường, xem thực đơn hôm nay, chọn món và số lượng cùng một <strong>khung giờ lấy món</strong> (mỗi 15 phút, từ 11:00 tới 13:30), có thể nhập mã <strong>voucher</strong> để được giảm giá, và trả tiền online qua một <strong>cổng thanh toán</strong> bên ngoài (ví điện tử hoặc thẻ). Đơn đã trả hiện lên <strong>màn hình bếp</strong>; nhân viên bếp bắt đầu nấu và đánh dấu đơn đã xong; sinh viên được báo (màn hình, loa, app). Ở quầy, nhân viên quét mã QR của đơn để giao. Đơn không được lấy sau 30 phút kể từ lúc xong thì bị đánh dấu là không lấy. Sinh viên được huỷ đơn đã trả trước giờ lấy ít nhất 15 phút và được hoàn tiền. Căn tin phục vụ khoảng 2.000 đơn/ngày, do một nhóm bốn sinh viên làm; tiền không bao giờ được mất hay bị trừ hai lần.</div>
<table>
<thead><tr><th>Exercise</th><th>Model</th><th>Typical AI error to catch</th><th>Template / lesson</th></tr></thead>
<tbody>
<tr><td>1</td><td>use case diagram + description</td><td>include/extend swapped, "System" as actor</td><td>Assignment 01 · lesson 5.A slides 4–6</td></tr>
<tr><td>2</td><td>entity class diagram</td><td>no multiplicities, foreign keys, wrong composition</td><td>Assignment 02 · Ch.2</td></tr>
<tr><td>3</td><td>sequence diagram</td><td>boundary talks to entities, no control object</td><td>Assignment 02–03 · Ch.2</td></tr>
<tr><td>4</td><td>statechart (+ Java check)</td><td>actions as states, no guards, no timer</td><td>Assignment 02 · Ch.2</td></tr>
<tr><td>5</td><td>architecture: component + deployment</td><td>microservices for a small system</td><td>Evaluation 2 · Ch.3, 5.A slides 15–17</td></tr>
<tr><td>6</td><td>design pattern (+ Java)</td><td>Singleton where Observer fits</td><td>Evaluation 2 · Ch.4, 5.A slides 11–14</td></tr>
<tr><td>7</td><td>relational schema from the class model</td><td>many-to-many as a list, FK on the wrong side</td><td>Assignment 03 · lesson 5.1</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.3 · Thực hành &amp; ôn tập</span>
<h2>Bảy bản nháp AI, bảy lần soát — đúng kỹ năng đồ án môn chấm</h2>
<p class="lead">Chương 5 có hai nửa: biến design model thành cơ sở dữ liệu quan hệ (bài 5.1) và dùng công cụ AI trong thiết kế (bài 5.2 và 5.A). Trang này luyện cả hai theo đúng cách đồ án môn chấm: AI đưa bạn một bản nháp trong vài giây; bạn phải tìm chỗ sai, sửa, và giải thích vì sao. Rubric của "AI-assisted system design" chấm đúng những việc đó — <strong>hiểu</strong> output của AI, <strong>tuỳ chỉnh và nâng cấp</strong>, <strong>minh bạch</strong> (prompt + khai báo) và <strong>dùng hiệu quả, có đạo đức</strong>.</p>
<div class="callout"><strong>Ghi nhãn thật.</strong> Các "bản AI phác" trên trang này là <strong>bản minh hoạ do người soạn viết</strong>: mỗi bản gom những lỗi công cụ AI hay mắc với loại sơ đồ đó, để bạn luyện bắt lỗi. Hãy tự chạy các prompt trên trợ lý AI bất kỳ — output thật của bạn sẽ khác, nhưng câu hỏi soát lỗi vẫn thế.</div>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Đọc case. Với mỗi bài, xem prompt và bản AI phác rồi <strong>tự viết danh sách lỗi trước khi mở bảng soát</strong>.</li>
<li>Sửa bản nháp ra giấy hoặc bằng PlantUML; rồi so với lời giải và đọc phần "Quyết định".</li>
<li>Điền bảng khai báo AI ở cuối cho một bài — đó là dạng báo cáo đồ án của bạn cần.</li>
</ol></div>
<h3>Case dùng chung: FU Canteen Pre-order</h3>
<div class="callout">The campus canteen wants students to <strong>pre-order lunch</strong> from a web app and skip the queue. A student logs in with the university account, browses today's menu, chooses items and quantities and a <strong>pickup slot</strong> (every 15 minutes between 11:00 and 13:30), may enter a <strong>voucher</strong> code for a discount, and pays online through an external <strong>payment gateway</strong> (e-wallet or card). Paid orders appear on the <strong>kitchen screen</strong>; kitchen staff start cooking and mark the order ready; the student is notified (kitchen display, speaker, app). At the counter, staff scan the order's QR code to hand it over. An order not collected 30 minutes after it is ready is marked uncollected. A student may cancel a paid order up to 15 minutes before the pickup slot and gets a refund. The canteen serves about 2,000 orders a day, built by a team of four students; money must never be lost or charged twice.<br>
<em>Dịch:</em> Căn tin trường muốn sinh viên <strong>đặt món trưa trước</strong> trên web và khỏi xếp hàng. Sinh viên đăng nhập bằng tài khoản trường, xem thực đơn hôm nay, chọn món và số lượng cùng một <strong>khung giờ lấy món</strong> (mỗi 15 phút, từ 11:00 tới 13:30), có thể nhập mã <strong>voucher</strong> để được giảm giá, và trả tiền online qua một <strong>cổng thanh toán</strong> bên ngoài (ví điện tử hoặc thẻ). Đơn đã trả hiện lên <strong>màn hình bếp</strong>; nhân viên bếp bắt đầu nấu và đánh dấu đơn đã xong; sinh viên được báo (màn hình, loa, app). Ở quầy, nhân viên quét mã QR của đơn để giao. Đơn không được lấy sau 30 phút kể từ lúc xong thì bị đánh dấu là không lấy. Sinh viên được huỷ đơn đã trả trước giờ lấy ít nhất 15 phút và được hoàn tiền. Căn tin phục vụ khoảng 2.000 đơn/ngày, do một nhóm bốn sinh viên làm; tiền không bao giờ được mất hay bị trừ hai lần.</div>
<table>
<thead><tr><th>Bài</th><th>Mô hình</th><th>Lỗi AI điển hình cần bắt</th><th>Khuôn / bài giảng</th></tr></thead>
<tbody>
<tr><td>1</td><td>use case diagram + đặc tả</td><td>đảo include/extend, "System" làm actor</td><td>Assignment 01 · bài 5.A slide 4–6</td></tr>
<tr><td>2</td><td>entity class diagram</td><td>thiếu bội số, khoá ngoại, hợp thành sai</td><td>Assignment 02 · Ch.2</td></tr>
<tr><td>3</td><td>sequence diagram</td><td>lớp biên nói thẳng với entity, không có đối tượng điều khiển</td><td>Assignment 02–03 · Ch.2</td></tr>
<tr><td>4</td><td>statechart (+ kiểm bằng Java)</td><td>hành động thành trạng thái, thiếu điều kiện canh, thiếu hẹn giờ</td><td>Assignment 02 · Ch.2</td></tr>
<tr><td>5</td><td>kiến trúc: component + deployment</td><td>microservices cho một hệ nhỏ</td><td>Evaluation 2 · Ch.3, 5.A slide 15–17</td></tr>
<tr><td>6</td><td>design pattern (+ Java)</td><td>Singleton ở chỗ hợp với Observer</td><td>Evaluation 2 · Ch.4, 5.A slide 11–14</td></tr>
<tr><td>7</td><td>lược đồ quan hệ từ mô hình lớp</td><td>nhiều-nhiều lưu thành danh sách, FK sai phía</td><td>Assignment 03 · bài 5.1</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — Use cases with AI: diagram and one description (~15 min)</h3>
<p class="nhan">Prompt given to the AI</p>
<pre><code class="language-plaintext">You are a software analyst. From the requirement below, list the actors and use cases
of the FU Canteen system and write PlantUML code for the use case diagram.
&lt;paste the whole case text&gt;</code></pre>
<p class="nhan">AI draft (illustration)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/12e7045a281a2be58070ed5960c81fce40b9fe9d.svg" alt="Exercise 1 — AI draft of the FU Canteen use case diagram (illustration with errors)" loading="lazy" /><p class="chu-thich">🧩 Exercise 1 — AI draft of the FU Canteen use case diagram (illustration with errors)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — AI draft of the FU Canteen use case diagram (illustration with errors)
' Errors planted as an AI typically makes them: System as actor, include for a conditional step, extend reversed, kitchen missing
left to right direction
actor Student
actor System
rectangle "FU Canteen" {
  usecase "Place Pre-order" as UC1
  usecase "Pay Online" as UC2
  usecase "Apply Voucher" as UC3
  usecase "Pick Up Order" as UC4
  usecase "Send Notification" as UC5
}
Student --&gt; UC1
Student --&gt; UC4
UC1 .&gt; UC3 : &lt;&lt;include&gt;&gt;
UC2 .&gt; UC1 : &lt;&lt;include&gt;&gt;
System --&gt; UC5
@enduml</code></pre></details>
<p class="nhan">Task</p>
<p>Find at least five problems, then draw the corrected diagram. Also review the AI's description of Place Pre-order: "1. The student clicks the Menu button. 2. The system queries the menu_item table. 3. The student adds items. 4. The system calls the Momo API. 5. Done."</p>
<p class="nhan">Review</p>
<table>
<thead><tr><th>#</th><th>Problem in the draft</th><th>Why it is wrong</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>1</td><td>actor "System"</td><td>the system cannot be its own actor; time-triggered work has a <strong>Timer</strong> actor</td><td>Timer → UC-06 Cancel Uncollected Orders</td></tr>
<tr><td>2</td><td>Place Pre-order «include» Apply Voucher</td><td>a voucher is optional ("may enter") → conditional → «extend», arrow from the extension to the base</td><td>Apply Voucher ..&gt; Place Pre-order «extend» [student has a voucher]</td></tr>
<tr><td>3</td><td>Pay Online «include» Place Pre-order</td><td>direction reversed: paying is a mandatory part <em>of</em> ordering, so the base includes it</td><td>Place Pre-order ..&gt; Pay Online «include»</td></tr>
<tr><td>4</td><td>no kitchen staff, no payment gateway</td><td>two actors named in the text are missing; the gateway is a secondary actor</td><td>add Kitchen Staff, Payment Gateway</td></tr>
<tr><td>5</td><td>"Send Notification" as a use case of System</td><td>notifying is a step (an action) of Prepare Order, not a goal of an actor</td><td>remove; it appears in the description of UC-05</td></tr>
<tr><td>6</td><td>description with UI and table names</td><td>the main sequence says <em>what</em>, not <em>how</em> (no "clicks", no "menu_item table", no "Momo API"); no alternatives</td><td>rewrite in the 7-row template</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/4727afba46e6b3b29cf2b05d7342f06de8834bfe.svg" alt="Exercise 1 — FU Canteen use case diagram after review" loading="lazy" /><p class="chu-thich">🧩 Exercise 1 — FU Canteen use case diagram after review</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — FU Canteen use case diagram after review
' Fixed: Kitchen Staff and Timer as actors, Payment Gateway secondary, Pay Online included, Apply Voucher extends
left to right direction
actor Student
actor "Kitchen Staff" as K
actor Timer
actor "Payment Gateway" as PG
rectangle "FU Canteen" {
  usecase "UC-01 Place Pre-order" as UC1
  usecase "UC-02 Pay Online" as UC2
  usecase "UC-03 Apply Voucher" as UC3
  usecase "UC-04 Pick Up Order" as UC4
  usecase "UC-05 Prepare Order" as UC5
  usecase "UC-06 Cancel Uncollected Orders" as UC6
}
Student -- UC1
Student -- UC4
K -- UC5
K -- UC4
Timer -- UC6
UC1 .&gt; UC2 : &lt;&lt;include&gt;&gt;
UC3 .&gt; UC1 : &lt;&lt;extend&gt;&gt;\\n[student has a voucher]
UC2 -- PG
@enduml</code></pre></details>
<pre><code class="language-plaintext">UC-01 Place Pre-order
Primary actor: Student          Secondary actor: Payment Gateway (via UC-02)
Description: the student orders lunch for a pickup slot and pays online.
Precondition: the student is logged in; the canteen is open for pre-orders today.
Main sequence:
  1. Student asks to place a pre-order.
  2. System shows today's available menu items and free pickup slots.
  3. Student selects items, quantities and a pickup slot.
  4. System shows the order summary and total.
  5. Student confirms. System performs UC-02 Pay Online (include).
  6. System records the order as paid and sends it to the kitchen.
Alternative sequences:
  3a. Student enters a voucher code: UC-03 Apply Voucher (extend) recalculates the total.
  5a. Payment is declined: System cancels the order and shows the reason.
Postcondition: a paid order exists for the chosen slot and is visible to the kitchen.</code></pre>
<p class="nhan">Decisions</p>
<ul>
<li><strong>Include vs extend</strong> comes from one word in the text: "pays" (always) vs "may enter" (sometimes).</li>
<li>Kitchen Staff is linked to both Prepare Order and Pick Up Order (they hand the food over by scanning the QR code); the Student starts Pick Up Order.</li>
<li>Log In is left out on purpose: the text treats it as a precondition; if your template requires it, add it as its own use case, never as «include» everywhere.</li>
</ul>`,
    `<h3>🧪 Bài 1 — Use case cùng AI: sơ đồ và một bản đặc tả (~15 phút)</h3>
<p class="nhan">Prompt đưa cho AI</p>
<pre><code class="language-plaintext">You are a software analyst. From the requirement below, list the actors and use cases
of the FU Canteen system and write PlantUML code for the use case diagram.
&lt;paste the whole case text&gt;</code></pre>
<p class="nhan">Bản AI phác (minh hoạ)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/12e7045a281a2be58070ed5960c81fce40b9fe9d.svg" alt="Exercise 1 — AI draft of the FU Canteen use case diagram (illustration with errors)" loading="lazy" /><p class="chu-thich">🧩 Exercise 1 — AI draft of the FU Canteen use case diagram (illustration with errors)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — AI draft of the FU Canteen use case diagram (illustration with errors)
' Lỗi cài sẵn theo kiểu AI hay mắc: System làm actor, include cho bước có điều kiện, extend ngược chiều, thiếu bếp
left to right direction
actor Student
actor System
rectangle "FU Canteen" {
  usecase "Place Pre-order" as UC1
  usecase "Pay Online" as UC2
  usecase "Apply Voucher" as UC3
  usecase "Pick Up Order" as UC4
  usecase "Send Notification" as UC5
}
Student --&gt; UC1
Student --&gt; UC4
UC1 .&gt; UC3 : &lt;&lt;include&gt;&gt;
UC2 .&gt; UC1 : &lt;&lt;include&gt;&gt;
System --&gt; UC5
@enduml</code></pre></details>
<p class="nhan">Đề</p>
<p>Tìm ít nhất năm vấn đề, rồi vẽ sơ đồ đã sửa. Soát luôn đoạn đặc tả Place Pre-order AI viết: "1. Sinh viên bấm nút Menu. 2. Hệ thống truy vấn bảng menu_item. 3. Sinh viên thêm món. 4. Hệ thống gọi API Momo. 5. Xong."</p>
<p class="nhan">Soát lỗi</p>
<table>
<thead><tr><th>#</th><th>Vấn đề trong bản nháp</th><th>Vì sao sai</th><th>Sửa</th></tr></thead>
<tbody>
<tr><td>1</td><td>actor "System"</td><td>hệ thống không thể là actor của chính nó; việc chạy theo thời gian có actor <strong>Timer</strong> (bộ hẹn giờ)</td><td>Timer → UC-06 Cancel Uncollected Orders</td></tr>
<tr><td>2</td><td>Place Pre-order «include» Apply Voucher</td><td>voucher là tuỳ chọn ("có thể nhập") → có điều kiện → «extend», mũi tên từ use case mở rộng vào gốc</td><td>Apply Voucher ..&gt; Place Pre-order «extend» [student has a voucher]</td></tr>
<tr><td>3</td><td>Pay Online «include» Place Pre-order</td><td>ngược chiều: trả tiền là phần bắt buộc <em>của</em> việc đặt món, nên gốc include nó</td><td>Place Pre-order ..&gt; Pay Online «include»</td></tr>
<tr><td>4</td><td>thiếu nhân viên bếp, thiếu cổng thanh toán</td><td>hai actor có trong đề bị bỏ sót; cổng thanh toán là actor phụ</td><td>thêm Kitchen Staff, Payment Gateway</td></tr>
<tr><td>5</td><td>"Send Notification" là use case của System</td><td>báo tin là một bước (hành động) của Prepare Order, không phải mục tiêu của actor nào</td><td>bỏ; nó nằm trong đặc tả UC-05</td></tr>
<tr><td>6</td><td>đặc tả có tên giao diện và tên bảng</td><td>luồng chính nói <em>làm gì</em>, không nói <em>làm thế nào</em> (không "bấm", không "bảng menu_item", không "API Momo"); thiếu luồng phụ</td><td>viết lại theo khuôn 7 dòng</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/4727afba46e6b3b29cf2b05d7342f06de8834bfe.svg" alt="Exercise 1 — FU Canteen use case diagram after review" loading="lazy" /><p class="chu-thich">🧩 Exercise 1 — FU Canteen use case diagram after review</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — FU Canteen use case diagram after review
' Đã sửa: Kitchen Staff và Timer là actor, Payment Gateway là actor phụ, Pay Online là include, Apply Voucher là extend
left to right direction
actor Student
actor "Kitchen Staff" as K
actor Timer
actor "Payment Gateway" as PG
rectangle "FU Canteen" {
  usecase "UC-01 Place Pre-order" as UC1
  usecase "UC-02 Pay Online" as UC2
  usecase "UC-03 Apply Voucher" as UC3
  usecase "UC-04 Pick Up Order" as UC4
  usecase "UC-05 Prepare Order" as UC5
  usecase "UC-06 Cancel Uncollected Orders" as UC6
}
Student -- UC1
Student -- UC4
K -- UC5
K -- UC4
Timer -- UC6
UC1 .&gt; UC2 : &lt;&lt;include&gt;&gt;
UC3 .&gt; UC1 : &lt;&lt;extend&gt;&gt;\\n[student has a voucher]
UC2 -- PG
@enduml</code></pre></details>
<pre><code class="language-plaintext">UC-01 Place Pre-order
Primary actor: Student          Secondary actor: Payment Gateway (via UC-02)
Description: the student orders lunch for a pickup slot and pays online.
Precondition: the student is logged in; the canteen is open for pre-orders today.
Main sequence:
  1. Student asks to place a pre-order.
  2. System shows today's available menu items and free pickup slots.
  3. Student selects items, quantities and a pickup slot.
  4. System shows the order summary and total.
  5. Student confirms. System performs UC-02 Pay Online (include).
  6. System records the order as paid and sends it to the kitchen.
Alternative sequences:
  3a. Student enters a voucher code: UC-03 Apply Voucher (extend) recalculates the total.
  5a. Payment is declined: System cancels the order and shows the reason.
Postcondition: a paid order exists for the chosen slot and is visible to the kitchen.</code></pre>
<p class="nhan">Quyết định</p>
<ul>
<li><strong>Include hay extend</strong> đến từ một chữ trong đề: "trả tiền" (luôn luôn) với "có thể nhập" (thỉnh thoảng).</li>
<li>Kitchen Staff nối cả Prepare Order lẫn Pick Up Order (họ giao món bằng cách quét QR); Student khởi động Pick Up Order.</li>
<li>Cố ý không vẽ Log In: đề coi nó là điều kiện trước; nếu khuôn của bạn bắt có, thêm nó thành use case riêng, không bao giờ «include» khắp nơi.</li>
</ul>`),
    bi(`<h3>🧪 Exercise 2 — Entity class diagram: review the AI's static model (~15 min)</h3>
<p class="nhan">Prompt given to the AI</p>
<pre><code class="language-plaintext">Generate a PlantUML class diagram of the entity classes for the FU Canteen system
(students, orders, menu items, vouchers).</code></pre>
<p class="nhan">AI draft (illustration)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e33cbd029969145269fa8a4a465c5ae16decfd4d.svg" alt="Exercise 2 — AI draft of the entity class diagram (illustration with errors)" loading="lazy" /><p class="chu-thich">🧩 Exercise 2 — AI draft of the entity class diagram (illustration with errors)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 2 — AI draft of the entity class diagram (illustration with errors)
' Errors: foreign-key attributes, no multiplicities, composition diamond on the wrong side, many-to-many hidden in a list attribute
class Student &lt;&lt;entity&gt;&gt; {
  - studentId : String
  - name : String
}
class Order &lt;&lt;entity&gt;&gt; {
  - orderId : Long
  - studentId : String
  - itemIds : List&lt;Long&gt;
  - total : double
}
class MenuItem &lt;&lt;entity&gt;&gt; {
  - itemId : Long
  - name : String
  - price : double
}
Order *-- Student
Order -- MenuItem
@enduml</code></pre></details>
<p class="nhan">Review</p>
<table>
<thead><tr><th>#</th><th>Problem</th><th>Why it is wrong</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>studentId</code> inside Order, <code>itemIds : List</code></td><td>foreign keys are a database detail; in the analysis model the <em>association</em> carries that link</td><td>remove; draw associations</td></tr>
<tr><td>2</td><td>no multiplicities anywhere</td><td>the model cannot say "one student, many orders"</td><td>1 — 0..* , 1 — 1..* …</td></tr>
<tr><td>3</td><td><code>Order *-- Student</code></td><td>the diamond is on the whole; this says an Order is <em>made of</em> a Student, and deleting the order deletes the student</td><td>Student 1 — 0..* Order (plain association)</td></tr>
<tr><td>4</td><td>Order — MenuItem many-to-many with no place for quantity or price</td><td>a line has its own data (quantity, price <em>at the time of ordering</em>) → it is a class</td><td>OrderLine, composed into Order</td></tr>
<tr><td>5</td><td><code>double</code> for money, voucher missing</td><td>rounding errors; the text names vouchers</td><td><code>BigDecimal</code>; Voucher 0..1 per order</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/b7a8fbfc52b7a7735deea7875ffa2551bf477927.svg" alt="Exercise 2 — entity class diagram after review" loading="lazy" /><p class="chu-thich">🧩 Exercise 2 — entity class diagram after review</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 2 — entity class diagram after review
' Fixed: OrderLine carries quantity and the price at order time, composition from Order to OrderLine, multiplicities everywhere, no foreign keys
class Student &lt;&lt;entity&gt;&gt; {
  - studentCode : String
  - name : String
}
class Order &lt;&lt;entity&gt;&gt; {
  - orderNo : String
  - pickupSlot : LocalTime
  - status : OrderStatus
}
class OrderLine &lt;&lt;entity&gt;&gt; {
  - quantity : int
  - unitPrice : BigDecimal
}
class MenuItem &lt;&lt;entity&gt;&gt; {
  - name : String
  - price : BigDecimal
  - available : boolean
}
class Voucher &lt;&lt;entity&gt;&gt; {
  - code : String
  - discountPercent : int
}
Student "1" -- "0..*" Order : places &gt;
Order "1" *-- "1..*" OrderLine
OrderLine "0..*" -- "1" MenuItem : refers to &gt;
Order "0..*" -- "0..1" Voucher : uses &gt;
@enduml</code></pre></details>
<p class="nhan">Decisions</p>
<ul>
<li><strong>Composition Order ◆— OrderLine</strong>: a line has no meaning without its order and is deleted with it — the textbook test for composition.</li>
<li><strong>unitPrice on OrderLine</strong> although MenuItem has price: menu prices change tomorrow; the order must keep what the student paid today. AI drafts nearly always miss this "historical value" rule.</li>
<li><strong>Voucher 0..1</strong>: "may enter a voucher" → optional on the order side; many orders can use the same voucher code.</li>
</ul>`,
    `<h3>🧪 Bài 2 — Entity class diagram: soát mô hình tĩnh của AI (~15 phút)</h3>
<p class="nhan">Prompt đưa cho AI</p>
<pre><code class="language-plaintext">Generate a PlantUML class diagram of the entity classes for the FU Canteen system
(students, orders, menu items, vouchers).</code></pre>
<p class="nhan">Bản AI phác (minh hoạ)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e33cbd029969145269fa8a4a465c5ae16decfd4d.svg" alt="Exercise 2 — AI draft of the entity class diagram (illustration with errors)" loading="lazy" /><p class="chu-thich">🧩 Exercise 2 — AI draft of the entity class diagram (illustration with errors)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 2 — AI draft of the entity class diagram (illustration with errors)
' Lỗi: thuộc tính khoá ngoại, thiếu bội số, hình thoi hợp thành đặt sai phía, quan hệ nhiều-nhiều giấu trong thuộc tính danh sách
class Student &lt;&lt;entity&gt;&gt; {
  - studentId : String
  - name : String
}
class Order &lt;&lt;entity&gt;&gt; {
  - orderId : Long
  - studentId : String
  - itemIds : List&lt;Long&gt;
  - total : double
}
class MenuItem &lt;&lt;entity&gt;&gt; {
  - itemId : Long
  - name : String
  - price : double
}
Order *-- Student
Order -- MenuItem
@enduml</code></pre></details>
<p class="nhan">Soát lỗi</p>
<table>
<thead><tr><th>#</th><th>Vấn đề</th><th>Vì sao sai</th><th>Sửa</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>studentId</code> trong Order, <code>itemIds : List</code></td><td>khoá ngoại là chi tiết của CSDL; trong mô hình phân tích, <em>liên kết</em> (association) mới mang mối nối đó</td><td>bỏ; vẽ liên kết</td></tr>
<tr><td>2</td><td>không có bội số ở đâu cả</td><td>mô hình không nói được "một sinh viên, nhiều đơn"</td><td>1 — 0..* , 1 — 1..* …</td></tr>
<tr><td>3</td><td><code>Order *-- Student</code></td><td>hình thoi nằm ở phía toàn thể; câu này nói Order <em>được làm từ</em> một Student, và xoá đơn là xoá luôn sinh viên</td><td>Student 1 — 0..* Order (liên kết thường)</td></tr>
<tr><td>4</td><td>Order — MenuItem nhiều-nhiều, không có chỗ cho số lượng hay giá</td><td>một dòng đơn có dữ liệu riêng (số lượng, giá <em>tại lúc đặt</em>) → nó là một lớp</td><td>OrderLine, hợp thành trong Order</td></tr>
<tr><td>5</td><td><code>double</code> cho tiền, thiếu voucher</td><td>sai số làm tròn; đề có nhắc voucher</td><td><code>BigDecimal</code>; Voucher 0..1 mỗi đơn</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/b7a8fbfc52b7a7735deea7875ffa2551bf477927.svg" alt="Exercise 2 — entity class diagram after review" loading="lazy" /><p class="chu-thich">🧩 Exercise 2 — entity class diagram after review</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 2 — entity class diagram after review
' Đã sửa: OrderLine giữ số lượng và giá lúc đặt, hợp thành từ Order tới OrderLine, đủ bội số, không có khoá ngoại
class Student &lt;&lt;entity&gt;&gt; {
  - studentCode : String
  - name : String
}
class Order &lt;&lt;entity&gt;&gt; {
  - orderNo : String
  - pickupSlot : LocalTime
  - status : OrderStatus
}
class OrderLine &lt;&lt;entity&gt;&gt; {
  - quantity : int
  - unitPrice : BigDecimal
}
class MenuItem &lt;&lt;entity&gt;&gt; {
  - name : String
  - price : BigDecimal
  - available : boolean
}
class Voucher &lt;&lt;entity&gt;&gt; {
  - code : String
  - discountPercent : int
}
Student "1" -- "0..*" Order : places &gt;
Order "1" *-- "1..*" OrderLine
OrderLine "0..*" -- "1" MenuItem : refers to &gt;
Order "0..*" -- "0..1" Voucher : uses &gt;
@enduml</code></pre></details>
<p class="nhan">Quyết định</p>
<ul>
<li><strong>Hợp thành (composition) Order ◆— OrderLine</strong>: dòng đơn không có nghĩa khi thiếu đơn và bị xoá cùng đơn — đúng phép thử của hợp thành trong sách.</li>
<li><strong>unitPrice nằm ở OrderLine</strong> dù MenuItem có price: mai giá thực đơn đổi; đơn phải giữ đúng số tiền sinh viên đã trả hôm nay. Bản AI gần như luôn bỏ sót luật "giá trị lịch sử" này.</li>
<li><strong>Voucher 0..1</strong>: "có thể nhập voucher" → tuỳ chọn ở phía đơn; nhiều đơn dùng chung được một mã voucher.</li>
</ul>`),
    bi(`<h3>🧪 Exercise 3 — Sequence diagram: put the layers back (~15 min)</h3>
<p class="nhan">Prompt given to the AI</p>
<pre><code class="language-plaintext">Draw a PlantUML sequence diagram for the use case "Place Pre-order" of FU Canteen.</code></pre>
<p class="nhan">AI draft (illustration)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/81e16dbfd5d7ad9137659818d84c55a0c1b64f1a.svg" alt="Exercise 3 — AI draft of the Place Pre-order sequence (illustration: layers mixed)" loading="lazy" /><p class="chu-thich">🧩 Exercise 3 — AI draft of the Place Pre-order sequence (illustration: layers mixed)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 3 — AI draft of the Place Pre-order sequence (illustration: layers mixed)
' Errors: the UI talks to entities and the gateway directly, no control object, no failure path
actor Student
participant "OrderScreen" as UI
participant "MenuItem" as MI
participant "Order" as O
participant "Payment Gateway" as PG
Student -&gt; UI : choose items
UI -&gt; MI : getPrice()
UI -&gt; O : new Order(items, total)
UI -&gt; PG : charge(total)
PG --&gt; UI : ok
UI --&gt; Student : order placed
@enduml</code></pre></details>
<p class="nhan">Review</p>
<table>
<thead><tr><th>#</th><th>Problem</th><th>Why it is wrong</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>1</td><td>OrderScreen calls MenuItem, Order and the gateway itself</td><td>a boundary object only talks to the user and forwards requests; the steps of a use case belong to a <strong>control</strong> object</td><td>add PreorderCoordinator «control»</td></tr>
<tr><td>2</td><td>Payment Gateway called directly</td><td>an external system is reached through a <strong>proxy</strong> boundary that hides its protocol</td><td>PaymentGatewayProxy</td></tr>
<tr><td>3</td><td>no message numbers, no arguments on returns</td><td>Gomaa's diagrams number messages so they map to the use case steps</td><td>1, 2, … 8a</td></tr>
<tr><td>4</td><td>only the happy path</td><td>the description has alternative 5a (payment declined)</td><td><code>alt approved / else declined</code></td></tr>
<tr><td>5</td><td>the order is created after payment with no status</td><td>nothing records that money is pending</td><td>create in PENDING_PAYMENT, then markPaid() or cancel()</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/1df825064fca1ee23bf5ae2638275cd7d4f05e8c.svg" alt="Exercise 3 — Place Pre-order after review (boundary, control, entity, proxy)" loading="lazy" /><p class="chu-thich">🧩 Exercise 3 — Place Pre-order after review (boundary, control, entity, proxy)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 3 — Place Pre-order after review (boundary, control, entity, proxy)
' Fixed: the coordinator runs the use case; the proxy hides the gateway; alt for declined payment
actor Student
boundary "OrderUI" as UI
control "PreorderCoordinator" as C
entity "MenuItem" as MI
entity "Order" as O
boundary "PaymentGatewayProxy" as P
Student -&gt; UI : 1: choose items, pickup slot
UI -&gt; C : 2: placeOrder(items, slot)
C -&gt; MI : 3: getPrice(), isAvailable()
MI --&gt; C : 4: prices
C -&gt; O : 5: create(lines, slot)
O --&gt; C : 6: order (PENDING_PAYMENT)
C -&gt; P : 7: charge(orderNo, total)
alt payment approved
  P --&gt; C : 8: approved
  C -&gt; O : 9: markPaid()
  C --&gt; UI : 10: confirmation(orderNo, slot)
else payment declined
  P --&gt; C : 8a: declined(reason)
  C -&gt; O : 9a: cancel()
  C --&gt; UI : 10a: show error
end
UI --&gt; Student : 11: display result
@enduml</code></pre></details>
<p class="nhan">Decisions</p>
<ul>
<li><strong>Coordinator, not state-dependent control</strong>: PreorderCoordinator handles each request completely and keeps no state between requests; the <em>order's</em> state lives in the Order entity (exercise 4).</li>
<li>Message 9a <code>cancel()</code> keeps the database consistent when the payment fails — the same point as the reviewed "Place Order" of lesson 5.A.</li>
</ul>`,
    `<h3>🧪 Bài 3 — Sequence diagram: đặt các tầng về đúng chỗ (~15 phút)</h3>
<p class="nhan">Prompt đưa cho AI</p>
<pre><code class="language-plaintext">Draw a PlantUML sequence diagram for the use case "Place Pre-order" of FU Canteen.</code></pre>
<p class="nhan">Bản AI phác (minh hoạ)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/81e16dbfd5d7ad9137659818d84c55a0c1b64f1a.svg" alt="Exercise 3 — AI draft of the Place Pre-order sequence (illustration: layers mixed)" loading="lazy" /><p class="chu-thich">🧩 Exercise 3 — AI draft of the Place Pre-order sequence (illustration: layers mixed)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 3 — AI draft of the Place Pre-order sequence (illustration: layers mixed)
' Lỗi: giao diện nói chuyện thẳng với entity và cổng thanh toán, không có đối tượng điều khiển, không có luồng thất bại
actor Student
participant "OrderScreen" as UI
participant "MenuItem" as MI
participant "Order" as O
participant "Payment Gateway" as PG
Student -&gt; UI : choose items
UI -&gt; MI : getPrice()
UI -&gt; O : new Order(items, total)
UI -&gt; PG : charge(total)
PG --&gt; UI : ok
UI --&gt; Student : order placed
@enduml</code></pre></details>
<p class="nhan">Soát lỗi</p>
<table>
<thead><tr><th>#</th><th>Vấn đề</th><th>Vì sao sai</th><th>Sửa</th></tr></thead>
<tbody>
<tr><td>1</td><td>OrderScreen tự gọi MenuItem, Order và cổng thanh toán</td><td>đối tượng biên (boundary) chỉ nói chuyện với người dùng và chuyển tiếp yêu cầu; các bước của use case thuộc về một đối tượng <strong>điều khiển</strong> (control)</td><td>thêm PreorderCoordinator «control»</td></tr>
<tr><td>2</td><td>gọi thẳng Payment Gateway</td><td>hệ thống ngoài được gọi qua một lớp biên <strong>proxy</strong> (đại diện) giấu giao thức của nó</td><td>PaymentGatewayProxy</td></tr>
<tr><td>3</td><td>không đánh số thông điệp, trả về không có tham số</td><td>sơ đồ của Gomaa đánh số thông điệp để nối với các bước use case</td><td>1, 2, … 8a</td></tr>
<tr><td>4</td><td>chỉ có đường thuận</td><td>đặc tả có luồng phụ 5a (thanh toán bị từ chối)</td><td><code>alt approved / else declined</code></td></tr>
<tr><td>5</td><td>đơn được tạo sau khi trả tiền, không có trạng thái</td><td>không có gì ghi lại rằng tiền đang chờ</td><td>tạo ở PENDING_PAYMENT, rồi markPaid() hoặc cancel()</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/1df825064fca1ee23bf5ae2638275cd7d4f05e8c.svg" alt="Exercise 3 — Place Pre-order after review (boundary, control, entity, proxy)" loading="lazy" /><p class="chu-thich">🧩 Exercise 3 — Place Pre-order after review (boundary, control, entity, proxy)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 3 — Place Pre-order after review (boundary, control, entity, proxy)
' Đã sửa: coordinator chạy use case; proxy giấu cổng thanh toán; khung alt khi bị từ chối
actor Student
boundary "OrderUI" as UI
control "PreorderCoordinator" as C
entity "MenuItem" as MI
entity "Order" as O
boundary "PaymentGatewayProxy" as P
Student -&gt; UI : 1: choose items, pickup slot
UI -&gt; C : 2: placeOrder(items, slot)
C -&gt; MI : 3: getPrice(), isAvailable()
MI --&gt; C : 4: prices
C -&gt; O : 5: create(lines, slot)
O --&gt; C : 6: order (PENDING_PAYMENT)
C -&gt; P : 7: charge(orderNo, total)
alt payment approved
  P --&gt; C : 8: approved
  C -&gt; O : 9: markPaid()
  C --&gt; UI : 10: confirmation(orderNo, slot)
else payment declined
  P --&gt; C : 8a: declined(reason)
  C -&gt; O : 9a: cancel()
  C --&gt; UI : 10a: show error
end
UI --&gt; Student : 11: display result
@enduml</code></pre></details>
<p class="nhan">Quyết định</p>
<ul>
<li><strong>Coordinator, không phải state-dependent control</strong>: PreorderCoordinator xử lý trọn mỗi yêu cầu và không giữ trạng thái giữa các yêu cầu; trạng thái của <em>đơn</em> nằm trong entity Order (bài 4).</li>
<li>Thông điệp 9a <code>cancel()</code> giữ CSDL nhất quán khi thanh toán hỏng — cùng ý với bản "Place Order" đã soát ở bài 5.A.</li>
</ul>`),
    bi(`<h3>🧪 Exercise 4 — Statechart of Order, checked by running it (~20 min)</h3>
<p class="nhan">Prompt given to the AI</p>
<pre><code class="language-plaintext">Draw a PlantUML state machine diagram for an Order in the FU Canteen system.</code></pre>
<p class="nhan">AI draft (illustration)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/16e7a40f0ff39d5c8b0d635521e1b0c1c5d8a604.svg" alt="Exercise 4 — AI draft of the Order statechart (illustration with errors)" loading="lazy" /><p class="chu-thich">🧩 Exercise 4 — AI draft of the Order statechart (illustration with errors)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 4 — AI draft of the Order statechart (illustration with errors)
' Errors: actions drawn as states, unlabeled arrows, no guard on cancel, no timer for uncollected orders
hide empty description
state "Paying" as Paying
state "Cooking Food" as Cooking
state "Notify Student" as Notify
[*] --&gt; Paying
Paying --&gt; Cooking
Cooking --&gt; Notify
Notify --&gt; PickedUp
Paying --&gt; Cancelled : cancel
Cooking --&gt; Cancelled : cancel
PickedUp --&gt; [*]
Cancelled --&gt; [*]
@enduml</code></pre></details>
<p class="nhan">Review</p>
<table>
<thead><tr><th>#</th><th>Problem</th><th>Why it is wrong</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>1</td><td>states "Paying", "Cooking Food", "Notify Student"</td><td>"Notify Student" is instant — an <strong>action</strong> on a transition, not a state; states are conditions that last and wait for an event</td><td>PENDING_PAYMENT, PAID, PREPARING, READY…</td></tr>
<tr><td>2</td><td>arrows without events</td><td>every transition needs its trigger ("event [guard] / action")</td><td>Payment Approved, Cooking Started, Food Ready…</td></tr>
<tr><td>3</td><td>cancel allowed while cooking, without a condition</td><td>the text allows cancel only "up to 15 minutes before the pickup slot" and only when paid</td><td><code>Cancel [at least 15 min before pickup] / Refund</code> from PAID only</td></tr>
<tr><td>4</td><td>no way out when nobody collects</td><td>"not collected 30 minutes after it is ready" is a <strong>timer event</strong></td><td><code>after (30 min) / Mark Uncollected</code> → EXPIRED</td></tr>
<tr><td>5</td><td>no declined payment</td><td>an order can die before it is paid</td><td>PENDING_PAYMENT → CANCELLED on Payment Declined</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/c2604e5062be83e804e0eaded3a9300fd802caa5.svg" alt="Exercise 4 — Order statechart after review: events, guards, actions, timer event" loading="lazy" /><p class="chu-thich">🧩 Exercise 4 — Order statechart after review: events, guards, actions, timer event</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 4 — Order statechart after review: events, guards, actions, timer event
' Fixed: waiting conditions are states; every arrow is event [guard] / action; after(30 min) handles uncollected orders
hide empty description
[*] --&gt; PENDING_PAYMENT : Order Placed
PENDING_PAYMENT --&gt; PAID : Payment Approved / Send To Kitchen
PENDING_PAYMENT --&gt; CANCELLED : Payment Declined
PAID --&gt; CANCELLED : Cancel [at least 15 min before pickup] / Refund
PAID --&gt; PREPARING : Cooking Started
PREPARING --&gt; READY : Food Ready / Notify Student
READY --&gt; PICKED_UP : QR Scanned [within pickup slot]
READY --&gt; EXPIRED : after (30 min) / Mark Uncollected
PICKED_UP --&gt; [*]
CANCELLED --&gt; [*]
EXPIRED --&gt; [*]
@enduml</code></pre></details>
<p><strong>Check it by running it.</strong> A statechart is a function (state, event) → next state. Written as a table in Java, it can be exercised: the normal path, the "never comes" path, and the pairs the AI draft got wrong must be rejected. The last line checks that no state is unreachable.</p>
<pre class="trich"><code class="language-java">// One row per arrow of the reviewed statechart: from, event, guard needed?, to, action
record Row(St from, Ev ev, String guard, St to, String action) {}

class OrderMachine {
    static final List&lt;Row&gt; TABLE = List.of(
        new Row(St.PENDING_PAYMENT, Ev.PAYMENT_APPROVED, null, St.PAID, "Send To Kitchen"),
        new Row(St.PENDING_PAYMENT, Ev.PAYMENT_DECLINED, null, St.CANCELLED, "-"),
        new Row(St.PAID, Ev.CANCEL, "at least 15 min before pickup", St.CANCELLED, "Refund"),
        new Row(St.PAID, Ev.COOKING_STARTED, null, St.PREPARING, "-"),
        new Row(St.PREPARING, Ev.FOOD_READY, null, St.READY, "Notify Student"),
        new Row(St.READY, Ev.QR_SCANNED, "within pickup slot", St.PICKED_UP, "-"),
        new Row(St.READY, Ev.AFTER_30_MIN, null, St.EXPIRED, "Mark Uncollected"));

    St state = St.PENDING_PAYMENT;

    String fire(Ev e, boolean guardHolds) {
        for (Row r : TABLE) {
            if (r.from() == state &amp;&amp; r.ev() == e) {
                if (r.guard() != null &amp;&amp; !guardHolds) return state + " --" + e + "--&gt; rejected: [" + r.guard() + "] is false";
                St before = state;
                state = r.to();
                return before + " --" + e + "--&gt; " + state + (r.action().equals("-") ? "" : " / " + r.action());
            }
        }
        return state + " --" + e + "--&gt; rejected: no transition";
    }
}</code></pre>
<pre class="trich"><code class="language-java">System.out.println("Scenario A: normal pick-up");
OrderMachine a = new OrderMachine();
System.out.println("  " + a.fire(Ev.PAYMENT_APPROVED, true));
System.out.println("  " + a.fire(Ev.COOKING_STARTED, true));
System.out.println("  " + a.fire(Ev.FOOD_READY, true));
System.out.println("  " + a.fire(Ev.QR_SCANNED, false));
System.out.println("  " + a.fire(Ev.QR_SCANNED, true));

System.out.println("Scenario B: the student never comes");
OrderMachine b = new OrderMachine();
for (Ev e : new Ev[] { Ev.PAYMENT_APPROVED, Ev.COOKING_STARTED, Ev.FOOD_READY, Ev.AFTER_30_MIN }) System.out.println("  " + b.fire(e, true));

System.out.println("Forbidden pairs the AI draft allowed or missed:");
OrderMachine c = new OrderMachine();
c.fire(Ev.PAYMENT_APPROVED, true);
c.fire(Ev.COOKING_STARTED, true);
System.out.println("  " + c.fire(Ev.CANCEL, true));
OrderMachine d = new OrderMachine();
d.fire(Ev.PAYMENT_APPROVED, true);
System.out.println("  " + d.fire(Ev.CANCEL, false));

List&lt;String&gt; unreachable = new ArrayList&lt;&gt;();
for (St s : St.values()) {
    boolean target = s == St.PENDING_PAYMENT || OrderMachine.TABLE.stream().anyMatch(r -&gt; r.to() == s);
    if (!target) unreachable.add(s.name());
}
System.out.println("Unreachable states: " + (unreachable.isEmpty() ? "none" : unreachable));</code></pre>
<div class="out">Scenario A: normal pick-up<br>
&nbsp;&nbsp;PENDING_PAYMENT --PAYMENT_APPROVED--&gt; PAID / Send To Kitchen<br>
&nbsp;&nbsp;PAID --COOKING_STARTED--&gt; PREPARING<br>
&nbsp;&nbsp;PREPARING --FOOD_READY--&gt; READY / Notify Student<br>
&nbsp;&nbsp;READY --QR_SCANNED--&gt; rejected: [within pickup slot] is false<br>
&nbsp;&nbsp;READY --QR_SCANNED--&gt; PICKED_UP<br>
Scenario B: the student never comes<br>
&nbsp;&nbsp;PENDING_PAYMENT --PAYMENT_APPROVED--&gt; PAID / Send To Kitchen<br>
&nbsp;&nbsp;PAID --COOKING_STARTED--&gt; PREPARING<br>
&nbsp;&nbsp;PREPARING --FOOD_READY--&gt; READY / Notify Student<br>
&nbsp;&nbsp;READY --AFTER_30_MIN--&gt; EXPIRED / Mark Uncollected<br>
Forbidden pairs the AI draft allowed or missed:<br>
&nbsp;&nbsp;PREPARING --CANCEL--&gt; rejected: no transition<br>
&nbsp;&nbsp;PAID --CANCEL--&gt; rejected: [at least 15 min before pickup] is false<br>
Unreachable states: none</div>
<p class="nhan">Decisions</p>
<ul>
<li>The guard <code>[within pickup slot]</code> on QR Scanned is a business rule from the text ("pickup slot"); the run shows a scan outside the slot is rejected, not ignored silently.</li>
<li>No final state for READY: it always leaves, by scan or by timer — a statechart where an order can wait forever is a bug in the <em>model</em>.</li>
</ul>`,
    `<h3>🧪 Bài 4 — Statechart của Order, kiểm bằng cách chạy nó (~20 phút)</h3>
<p class="nhan">Prompt đưa cho AI</p>
<pre><code class="language-plaintext">Draw a PlantUML state machine diagram for an Order in the FU Canteen system.</code></pre>
<p class="nhan">Bản AI phác (minh hoạ)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/16e7a40f0ff39d5c8b0d635521e1b0c1c5d8a604.svg" alt="Exercise 4 — AI draft of the Order statechart (illustration with errors)" loading="lazy" /><p class="chu-thich">🧩 Exercise 4 — AI draft of the Order statechart (illustration with errors)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 4 — AI draft of the Order statechart (illustration with errors)
' Lỗi: hành động vẽ thành trạng thái, mũi tên không nhãn, huỷ không có điều kiện canh, thiếu hẹn giờ cho đơn không lấy
hide empty description
state "Paying" as Paying
state "Cooking Food" as Cooking
state "Notify Student" as Notify
[*] --&gt; Paying
Paying --&gt; Cooking
Cooking --&gt; Notify
Notify --&gt; PickedUp
Paying --&gt; Cancelled : cancel
Cooking --&gt; Cancelled : cancel
PickedUp --&gt; [*]
Cancelled --&gt; [*]
@enduml</code></pre></details>
<p class="nhan">Soát lỗi</p>
<table>
<thead><tr><th>#</th><th>Vấn đề</th><th>Vì sao sai</th><th>Sửa</th></tr></thead>
<tbody>
<tr><td>1</td><td>trạng thái "Paying", "Cooking Food", "Notify Student"</td><td>"Notify Student" xảy ra tức thời — là <strong>hành động</strong> trên chuyển tiếp, không phải trạng thái; trạng thái là tình trạng kéo dài và chờ một sự kiện</td><td>PENDING_PAYMENT, PAID, PREPARING, READY…</td></tr>
<tr><td>2</td><td>mũi tên không có sự kiện</td><td>mọi chuyển tiếp cần cái kích hoạt ("event [guard] / action")</td><td>Payment Approved, Cooking Started, Food Ready…</td></tr>
<tr><td>3</td><td>huỷ được khi đang nấu, không có điều kiện</td><td>đề chỉ cho huỷ "trước giờ lấy ít nhất 15 phút" và chỉ khi đã trả tiền</td><td><code>Cancel [at least 15 min before pickup] / Refund</code> chỉ từ PAID</td></tr>
<tr><td>4</td><td>không có lối ra khi không ai tới lấy</td><td>"không được lấy sau 30 phút kể từ lúc xong" là một <strong>sự kiện hẹn giờ</strong> (timer event)</td><td><code>after (30 min) / Mark Uncollected</code> → EXPIRED</td></tr>
<tr><td>5</td><td>thiếu thanh toán bị từ chối</td><td>đơn có thể chết trước khi được trả tiền</td><td>PENDING_PAYMENT → CANCELLED khi Payment Declined</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/c2604e5062be83e804e0eaded3a9300fd802caa5.svg" alt="Exercise 4 — Order statechart after review: events, guards, actions, timer event" loading="lazy" /><p class="chu-thich">🧩 Exercise 4 — Order statechart after review: events, guards, actions, timer event</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 4 — Order statechart after review: events, guards, actions, timer event
' Đã sửa: tình trạng chờ là trạng thái; mọi mũi tên là event [guard] / action; after(30 min) xử lý đơn không lấy
hide empty description
[*] --&gt; PENDING_PAYMENT : Order Placed
PENDING_PAYMENT --&gt; PAID : Payment Approved / Send To Kitchen
PENDING_PAYMENT --&gt; CANCELLED : Payment Declined
PAID --&gt; CANCELLED : Cancel [at least 15 min before pickup] / Refund
PAID --&gt; PREPARING : Cooking Started
PREPARING --&gt; READY : Food Ready / Notify Student
READY --&gt; PICKED_UP : QR Scanned [within pickup slot]
READY --&gt; EXPIRED : after (30 min) / Mark Uncollected
PICKED_UP --&gt; [*]
CANCELLED --&gt; [*]
EXPIRED --&gt; [*]
@enduml</code></pre></details>
<p><strong>Kiểm bằng cách chạy.</strong> Statechart là một hàm (trạng thái, sự kiện) → trạng thái kế. Viết thành bảng trong Java thì chạy thử được: đường bình thường, đường "không bao giờ tới lấy", và các cặp mà bản AI làm sai phải bị từ chối. Dòng cuối kiểm không có trạng thái nào không tới được.</p>
<pre class="trich"><code class="language-java">// Mỗi dòng một mũi tên của statechart đã soát: từ, sự kiện, cần điều kiện canh?, tới, hành động
record Row(St from, Ev ev, String guard, St to, String action) {}

class OrderMachine {
    static final List&lt;Row&gt; TABLE = List.of(
        new Row(St.PENDING_PAYMENT, Ev.PAYMENT_APPROVED, null, St.PAID, "Send To Kitchen"),
        new Row(St.PENDING_PAYMENT, Ev.PAYMENT_DECLINED, null, St.CANCELLED, "-"),
        new Row(St.PAID, Ev.CANCEL, "at least 15 min before pickup", St.CANCELLED, "Refund"),
        new Row(St.PAID, Ev.COOKING_STARTED, null, St.PREPARING, "-"),
        new Row(St.PREPARING, Ev.FOOD_READY, null, St.READY, "Notify Student"),
        new Row(St.READY, Ev.QR_SCANNED, "within pickup slot", St.PICKED_UP, "-"),
        new Row(St.READY, Ev.AFTER_30_MIN, null, St.EXPIRED, "Mark Uncollected"));

    St state = St.PENDING_PAYMENT;

    String fire(Ev e, boolean guardHolds) {
        for (Row r : TABLE) {
            if (r.from() == state &amp;&amp; r.ev() == e) {
                if (r.guard() != null &amp;&amp; !guardHolds) return state + " --" + e + "--&gt; rejected: [" + r.guard() + "] is false";
                St before = state;
                state = r.to();
                return before + " --" + e + "--&gt; " + state + (r.action().equals("-") ? "" : " / " + r.action());
            }
        }
        return state + " --" + e + "--&gt; rejected: no transition";
    }
}</code></pre>
<pre class="trich"><code class="language-java">System.out.println("Scenario A: normal pick-up");
OrderMachine a = new OrderMachine();
System.out.println("  " + a.fire(Ev.PAYMENT_APPROVED, true));
System.out.println("  " + a.fire(Ev.COOKING_STARTED, true));
System.out.println("  " + a.fire(Ev.FOOD_READY, true));
System.out.println("  " + a.fire(Ev.QR_SCANNED, false));
System.out.println("  " + a.fire(Ev.QR_SCANNED, true));

System.out.println("Scenario B: the student never comes");
OrderMachine b = new OrderMachine();
for (Ev e : new Ev[] { Ev.PAYMENT_APPROVED, Ev.COOKING_STARTED, Ev.FOOD_READY, Ev.AFTER_30_MIN }) System.out.println("  " + b.fire(e, true));

System.out.println("Forbidden pairs the AI draft allowed or missed:");
OrderMachine c = new OrderMachine();
c.fire(Ev.PAYMENT_APPROVED, true);
c.fire(Ev.COOKING_STARTED, true);
System.out.println("  " + c.fire(Ev.CANCEL, true));
OrderMachine d = new OrderMachine();
d.fire(Ev.PAYMENT_APPROVED, true);
System.out.println("  " + d.fire(Ev.CANCEL, false));

List&lt;String&gt; unreachable = new ArrayList&lt;&gt;();
for (St s : St.values()) {
    boolean target = s == St.PENDING_PAYMENT || OrderMachine.TABLE.stream().anyMatch(r -&gt; r.to() == s);
    if (!target) unreachable.add(s.name());
}
System.out.println("Unreachable states: " + (unreachable.isEmpty() ? "none" : unreachable));</code></pre>
<div class="out">Scenario A: normal pick-up<br>
&nbsp;&nbsp;PENDING_PAYMENT --PAYMENT_APPROVED--&gt; PAID / Send To Kitchen<br>
&nbsp;&nbsp;PAID --COOKING_STARTED--&gt; PREPARING<br>
&nbsp;&nbsp;PREPARING --FOOD_READY--&gt; READY / Notify Student<br>
&nbsp;&nbsp;READY --QR_SCANNED--&gt; rejected: [within pickup slot] is false<br>
&nbsp;&nbsp;READY --QR_SCANNED--&gt; PICKED_UP<br>
Scenario B: the student never comes<br>
&nbsp;&nbsp;PENDING_PAYMENT --PAYMENT_APPROVED--&gt; PAID / Send To Kitchen<br>
&nbsp;&nbsp;PAID --COOKING_STARTED--&gt; PREPARING<br>
&nbsp;&nbsp;PREPARING --FOOD_READY--&gt; READY / Notify Student<br>
&nbsp;&nbsp;READY --AFTER_30_MIN--&gt; EXPIRED / Mark Uncollected<br>
Forbidden pairs the AI draft allowed or missed:<br>
&nbsp;&nbsp;PREPARING --CANCEL--&gt; rejected: no transition<br>
&nbsp;&nbsp;PAID --CANCEL--&gt; rejected: [at least 15 min before pickup] is false<br>
Unreachable states: none</div>
<p class="nhan">Quyết định</p>
<ul>
<li>Điều kiện canh <code>[within pickup slot]</code> trên QR Scanned là luật nghiệp vụ lấy từ đề ("khung giờ lấy món"); lần chạy cho thấy quét ngoài khung giờ bị từ chối, không bị lờ đi.</li>
<li>READY không phải trạng thái cuối: nó luôn rời đi, bằng quét mã hoặc bằng hẹn giờ — statechart mà đơn có thể chờ mãi là lỗi của <em>mô hình</em>.</li>
</ul>`),
    bi(`<h3>🧪 Exercise 5 — Architecture: when the AI over-engineers (~15 min)</h3>
<p class="nhan">Prompt given to the AI</p>
<pre><code class="language-plaintext">Recommend a modern, scalable architecture for the FU Canteen system and give a PlantUML
component diagram.</code></pre>
<p class="nhan">AI draft (illustration)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/40600e3567e74136bbeddac9d39f5e3bb8318f74.svg" alt="Exercise 5 — AI proposal for FU Canteen: eight microservices (illustration of over-engineering)" loading="lazy" /><p class="chu-thich">🧩 Exercise 5 — AI proposal for FU Canteen: eight microservices (illustration of over-engineering)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 5 — AI proposal for FU Canteen: eight microservices (illustration of over-engineering)
' Over-engineered for one canteen and ~2,000 orders a day; every service still shares the same database
[API Gateway] as GW
[Auth Service] as A
[Menu Service] as M
[Order Service] as O
[Payment Service] as P
[Voucher Service] as V
[Kitchen Service] as K
[Notification Service] as N
[Report Service] as R
database "canteen_db" as DB
GW --&gt; A
GW --&gt; M
GW --&gt; O
GW --&gt; K
GW --&gt; R
O --&gt; P
O --&gt; V
K --&gt; N
A --&gt; DB
M --&gt; DB
O --&gt; DB
P --&gt; DB
V --&gt; DB
K --&gt; DB
N --&gt; DB
R --&gt; DB
@enduml</code></pre></details>
<p class="nhan">Review</p>
<p>The prompt asked for "modern, scalable" and gave <em>no</em> numbers — so the AI answered for an imaginary large system. Put the case's real quality attributes next to its answer:</p>
<table>
<thead><tr><th>Fact from the case</th><th>What it implies</th><th>Eight microservices?</th></tr></thead>
<tbody>
<tr><td>~2,000 orders a day (peak around noon)</td><td>modest load: one application server copes easily</td><td>not needed for performance</td></tr>
<tr><td>a team of four students</td><td>every extra service is a build, a deployment, a log to watch</td><td>too costly to operate</td></tr>
<tr><td>"money never lost or charged twice"</td><td>strong consistency; one database transaction for order + payment status</td><td>harder across services (sagas, outbox)</td></tr>
<tr><td>all services still share <code>canteen_db</code></td><td>services cannot change their tables alone</td><td>a distributed monolith, not microservices</td></tr>
</tbody>
</table>
<p class="nhan">Solution — a layered modular monolith</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/386949ce85307be22b16f720cd021a2f5f7f80c8.svg" alt="Exercise 5 — FU Canteen after review: a layered modular monolith with clear module boundaries" loading="lazy" /><p class="chu-thich">🧩 Exercise 5 — FU Canteen after review: a layered modular monolith with clear module boundaries</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 5 — FU Canteen after review: a layered modular monolith with clear module boundaries
' Chosen from the quality attributes: modest load, one team, strong consistency for money
package "Presentation" {
  [Student Web App] as SW
  [Kitchen Screen] as KS
}
package "canteen-app (Spring Boot)" {
  package "API Controllers" {
    [OrderController] as OC
    [KitchenController] as KC
  }
  package "Domain Services" {
    [menu] as M
    [ordering] as O
    [payment] as P
    [kitchen] as K
    [notification] as N
  }
  package "Data Access" {
    [JPA Repositories] as R
  }
}
database "PostgreSQL" as DB
cloud "Payment Gateway" as PG
SW --&gt; OC
KS --&gt; KC
OC --&gt; O
KC --&gt; K
O --&gt; M
O --&gt; P
K --&gt; N
P --&gt; PG
M --&gt; R
O --&gt; R
K --&gt; R
R --&gt; DB
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/fa37d128f60ac2ecf5f898b6b34756d3b94b5b7c.svg" alt="Exercise 5 — deployment of the FU Canteen monolith" loading="lazy" /><p class="chu-thich">🧩 Exercise 5 — deployment of the FU Canteen monolith</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 5 — deployment of the FU Canteen monolith
' One application server behind a reverse proxy, one database server, one kitchen screen device
node "Student phone" as P {
  artifact "Web browser" as B
}
node "Kitchen tablet" as T {
  artifact "Kitchen screen (browser)" as KSB
}
node "VPS" as V {
  artifact "nginx (reverse proxy)" as NG
  artifact "canteen-app.jar" as JAR
}
node "Database server" as D {
  database "PostgreSQL 16" as PGDB
}
P -- V : HTTPS
T -- V : HTTPS + WebSocket
NG -- JAR
V -- D : JDBC 5432
@enduml</code></pre></details>
<p class="nhan">Decisions</p>
<ul>
<li><strong>Layers</strong> (presentation → controllers → domain services → data access) keep the dependency rule of lesson 5.A slide 9; <strong>modules</strong> (menu, ordering, payment, kitchen, notification) keep the boundaries so one could be split out later if the load grows.</li>
<li>The kitchen screen needs live updates → WebSocket on the same server (deployment diagram), not a separate service.</li>
<li>Write the justification as the rubric wants it: "we asked the AI, it proposed microservices; we rejected that because… (load, team, consistency)". Rejecting an AI suggestion with reasons scores <em>higher</em> than accepting it.</li>
</ul>`,
    `<h3>🧪 Bài 5 — Kiến trúc: khi AI làm quá tay (~15 phút)</h3>
<p class="nhan">Prompt đưa cho AI</p>
<pre><code class="language-plaintext">Recommend a modern, scalable architecture for the FU Canteen system and give a PlantUML
component diagram.</code></pre>
<p class="nhan">Bản AI phác (minh hoạ)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/40600e3567e74136bbeddac9d39f5e3bb8318f74.svg" alt="Exercise 5 — AI proposal for FU Canteen: eight microservices (illustration of over-engineering)" loading="lazy" /><p class="chu-thich">🧩 Exercise 5 — AI proposal for FU Canteen: eight microservices (illustration of over-engineering)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 5 — AI proposal for FU Canteen: eight microservices (illustration of over-engineering)
' Quá tay cho một căn tin ~2.000 đơn/ngày; các service vẫn dùng chung một CSDL
[API Gateway] as GW
[Auth Service] as A
[Menu Service] as M
[Order Service] as O
[Payment Service] as P
[Voucher Service] as V
[Kitchen Service] as K
[Notification Service] as N
[Report Service] as R
database "canteen_db" as DB
GW --&gt; A
GW --&gt; M
GW --&gt; O
GW --&gt; K
GW --&gt; R
O --&gt; P
O --&gt; V
K --&gt; N
A --&gt; DB
M --&gt; DB
O --&gt; DB
P --&gt; DB
V --&gt; DB
K --&gt; DB
N --&gt; DB
R --&gt; DB
@enduml</code></pre></details>
<p class="nhan">Soát lỗi</p>
<p>Prompt đòi "hiện đại, mở rộng được" mà <em>không</em> cho con số nào — nên AI trả lời cho một hệ thống lớn tưởng tượng. Đặt thuộc tính chất lượng thật của case cạnh câu trả lời của nó:</p>
<table>
<thead><tr><th>Sự thật trong case</th><th>Suy ra</th><th>Tám microservice?</th></tr></thead>
<tbody>
<tr><td>~2.000 đơn/ngày (cao điểm quanh trưa)</td><td>tải vừa phải: một máy chủ ứng dụng thừa sức</td><td>không cần cho hiệu năng</td></tr>
<tr><td>nhóm bốn sinh viên</td><td>mỗi service thêm là một lần build, một lần triển khai, một luồng log phải theo dõi</td><td>quá tốn để vận hành</td></tr>
<tr><td>"tiền không bao giờ mất hay bị trừ hai lần"</td><td>nhất quán mạnh; một transaction CSDL cho trạng thái đơn + thanh toán</td><td>khó hơn khi xuyên service (saga, outbox)</td></tr>
<tr><td>mọi service vẫn dùng chung <code>canteen_db</code></td><td>không service nào tự đổi bảng của mình được</td><td>là khối nguyên phân tán, không phải microservices</td></tr>
</tbody>
</table>
<p class="nhan">Lời giải — khối nguyên chia module, phân tầng (layered modular monolith)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/386949ce85307be22b16f720cd021a2f5f7f80c8.svg" alt="Exercise 5 — FU Canteen after review: a layered modular monolith with clear module boundaries" loading="lazy" /><p class="chu-thich">🧩 Exercise 5 — FU Canteen after review: a layered modular monolith with clear module boundaries</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 5 — FU Canteen after review: a layered modular monolith with clear module boundaries
' Chọn từ thuộc tính chất lượng: tải vừa phải, một nhóm, cần nhất quán mạnh cho tiền
package "Presentation" {
  [Student Web App] as SW
  [Kitchen Screen] as KS
}
package "canteen-app (Spring Boot)" {
  package "API Controllers" {
    [OrderController] as OC
    [KitchenController] as KC
  }
  package "Domain Services" {
    [menu] as M
    [ordering] as O
    [payment] as P
    [kitchen] as K
    [notification] as N
  }
  package "Data Access" {
    [JPA Repositories] as R
  }
}
database "PostgreSQL" as DB
cloud "Payment Gateway" as PG
SW --&gt; OC
KS --&gt; KC
OC --&gt; O
KC --&gt; K
O --&gt; M
O --&gt; P
K --&gt; N
P --&gt; PG
M --&gt; R
O --&gt; R
K --&gt; R
R --&gt; DB
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/fa37d128f60ac2ecf5f898b6b34756d3b94b5b7c.svg" alt="Exercise 5 — deployment of the FU Canteen monolith" loading="lazy" /><p class="chu-thich">🧩 Exercise 5 — deployment of the FU Canteen monolith</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 5 — deployment of the FU Canteen monolith
' Một máy chủ ứng dụng sau reverse proxy, một máy CSDL, một màn hình bếp
node "Student phone" as P {
  artifact "Web browser" as B
}
node "Kitchen tablet" as T {
  artifact "Kitchen screen (browser)" as KSB
}
node "VPS" as V {
  artifact "nginx (reverse proxy)" as NG
  artifact "canteen-app.jar" as JAR
}
node "Database server" as D {
  database "PostgreSQL 16" as PGDB
}
P -- V : HTTPS
T -- V : HTTPS + WebSocket
NG -- JAR
V -- D : JDBC 5432
@enduml</code></pre></details>
<p class="nhan">Quyết định</p>
<ul>
<li><strong>Tầng</strong> (trình bày → controller → domain service → truy cập dữ liệu) giữ luật phụ thuộc ở bài 5.A slide 9; <strong>module</strong> (menu, ordering, payment, kitchen, notification) giữ ranh giới để sau này tải tăng thì tách được một phần ra.</li>
<li>Màn hình bếp cần cập nhật trực tiếp → WebSocket ngay trên cùng máy chủ (deployment diagram), không cần một service riêng.</li>
<li>Viết phần biện minh đúng như rubric muốn: "chúng tôi hỏi AI, nó đề xuất microservices; chúng tôi không chọn vì… (tải, nhóm, nhất quán)". Bác một gợi ý AI có lý do được điểm <em>cao hơn</em> nhận nó nguyên xi.</li>
</ul>`),
    bi(`<h3>🧪 Exercise 6 — Pattern suggestion: Singleton or Observer? (~15 min)</h3>
<p class="nhan">Prompt given to the AI</p>
<pre><code class="language-plaintext">When an order is ready, FU Canteen must notify the student on the kitchen display,
the speaker and the app. Which design pattern should I use? Give Java code.</code></pre>
<p class="nhan">AI draft (illustration)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/f8483c3400ed856525463631fb43e099912d7c68.svg" alt="Exercise 6 — AI suggestion: a Singleton NotificationService with one method per channel (illustration)" loading="lazy" /><p class="chu-thich">🧩 Exercise 6 — AI suggestion: a Singleton NotificationService with one method per channel (illustration)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 6 — AI suggestion: a Singleton NotificationService with one method per channel (illustration)
' Problem: a global instance that knows every channel; adding a channel edits this class
class NotificationService &lt;&lt;singleton&gt;&gt; {
  - {static} instance : NotificationService
  - NotificationService()
  + {static} getInstance() : NotificationService
  + notifyScreen(order : Order) : void
  + notifySpeaker(order : Order) : void
  + notifyApp(order : Order) : void
}
class KitchenService {
  + markReady(order : Order) : void
}
KitchenService ..&gt; NotificationService : getInstance()
@enduml</code></pre></details>
<p class="nhan">Review</p>
<table>
<thead><tr><th>Question</th><th>Singleton NotificationService</th><th>Observer</th></tr></thead>
<tbody>
<tr><td>what problem does the text describe?</td><td>— (Singleton answers "exactly one instance")</td><td>"notify many parts when something changes" = Observer's intent</td></tr>
<tr><td>add an SMS channel later</td><td>edit NotificationService (new method) and KitchenService (new call) — breaks Open/Closed</td><td>add one listener class and one subscribe line</td></tr>
<tr><td>testing KitchenService</td><td>hidden global via getInstance() — hard to replace with a fake</td><td>pass a fake listener in</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/5a477ac18884550a29a491efb09a84789698f25b.svg" alt="Exercise 6 — after review: Observer, the kitchen publishes &quot;order ready&quot; and each channel subscribes" loading="lazy" /><p class="chu-thich">🧩 Exercise 6 — after review: Observer, the kitchen publishes "order ready" and each channel subscribes</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 6 — after review: Observer, the kitchen publishes "order ready" and each channel subscribes
' Open/Closed: a new channel is a new listener class; KitchenService never changes
class KitchenService {
  - listeners : List&lt;OrderReadyListener&gt;
  + subscribe(l : OrderReadyListener) : void
  + markReady(order : Order) : void
}
interface OrderReadyListener {
  + onOrderReady(order : Order) : void
}
class ScreenDisplay
class SpeakerAnnouncer
class AppPushNotifier
KitchenService o--&gt; "0..*" OrderReadyListener
OrderReadyListener &lt;|.. ScreenDisplay
OrderReadyListener &lt;|.. SpeakerAnnouncer
OrderReadyListener &lt;|.. AppPushNotifier
@enduml</code></pre></details>
<pre><code class="language-java">// Exercise 6: Observer instead of the AI's Singleton — the kitchen publishes "order ready", each channel subscribes
import java.util.ArrayList;
import java.util.List;

record Order(String orderNo, String student, String pickupSlot) {}

interface OrderReadyListener {
    void onOrderReady(Order order);
}

class KitchenService {
    private final List&lt;OrderReadyListener&gt; listeners = new ArrayList&lt;&gt;();

    void subscribe(OrderReadyListener l) { listeners.add(l); }

    void markReady(Order order) {
        System.out.println("Kitchen: " + order.orderNo() + " is ready");
        for (OrderReadyListener l : listeners) l.onOrderReady(order);   // the kitchen does not know who listens
    }
}

class ScreenDisplay implements OrderReadyListener {
    public void onOrderReady(Order o) { System.out.println("  Screen : show " + o.orderNo()); }
}

class SpeakerAnnouncer implements OrderReadyListener {
    public void onOrderReady(Order o) { System.out.println("  Speaker: \\"Order " + o.orderNo() + ", please come to the counter\\""); }
}

class AppPushNotifier implements OrderReadyListener {
    public void onOrderReady(Order o) { System.out.println("  App    : push to " + o.student() + " (pickup " + o.pickupSlot() + ")"); }
}

public class CanteenObserver {
    public static void main(String[] args) {
        KitchenService kitchen = new KitchenService();
        kitchen.subscribe(new ScreenDisplay());
        kitchen.subscribe(new AppPushNotifier());
        kitchen.markReady(new Order("A-017", "an.nv", "11:45"));

        System.out.println("-- a speaker is installed: one new subscribe line, KitchenService unchanged --");
        kitchen.subscribe(new SpeakerAnnouncer());
        kitchen.markReady(new Order("A-018", "binh.tt", "11:50"));
    }
}</code></pre>
<div class="out">Kitchen: A-017 is ready<br>
&nbsp;&nbsp;Screen : show A-017<br>
&nbsp;&nbsp;App &nbsp;&nbsp;&nbsp;: push to an.nv (pickup 11:45)<br>
-- a speaker is installed: one new subscribe line, KitchenService unchanged --<br>
Kitchen: A-018 is ready<br>
&nbsp;&nbsp;Screen : show A-018<br>
&nbsp;&nbsp;App &nbsp;&nbsp;&nbsp;: push to binh.tt (pickup 11:50)<br>
&nbsp;&nbsp;Speaker: "Order A-018, please come to the counter"</div>
<p class="nhan">Decisions</p>
<ul>
<li>The requirement's verb decides the pattern: "notify … the display, the speaker and the app" is one-to-many notification → Observer (lesson 5.A slide 11 table).</li>
<li>➕ In Spring Boot you rarely write the list yourself: publish an <code>OrderReadyEvent</code> with <code>ApplicationEventPublisher</code> and annotate each channel's method with <code>@EventListener</code> — the same pattern, provided by the framework. And Spring beans are already singletons, so a hand-written Singleton is almost never needed.</li>
</ul>`,
    `<h3>🧪 Bài 6 — Gợi ý pattern: Singleton hay Observer? (~15 phút)</h3>
<p class="nhan">Prompt đưa cho AI</p>
<pre><code class="language-plaintext">When an order is ready, FU Canteen must notify the student on the kitchen display,
the speaker and the app. Which design pattern should I use? Give Java code.</code></pre>
<p class="nhan">Bản AI phác (minh hoạ)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/f8483c3400ed856525463631fb43e099912d7c68.svg" alt="Exercise 6 — AI suggestion: a Singleton NotificationService with one method per channel (illustration)" loading="lazy" /><p class="chu-thich">🧩 Exercise 6 — AI suggestion: a Singleton NotificationService with one method per channel (illustration)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 6 — AI suggestion: a Singleton NotificationService with one method per channel (illustration)
' Vấn đề: một thể hiện toàn cục biết mọi kênh; thêm kênh là phải sửa lớp này
class NotificationService &lt;&lt;singleton&gt;&gt; {
  - {static} instance : NotificationService
  - NotificationService()
  + {static} getInstance() : NotificationService
  + notifyScreen(order : Order) : void
  + notifySpeaker(order : Order) : void
  + notifyApp(order : Order) : void
}
class KitchenService {
  + markReady(order : Order) : void
}
KitchenService ..&gt; NotificationService : getInstance()
@enduml</code></pre></details>
<p class="nhan">Soát lỗi</p>
<table>
<thead><tr><th>Câu hỏi</th><th>Singleton NotificationService</th><th>Observer</th></tr></thead>
<tbody>
<tr><td>đề mô tả vấn đề gì?</td><td>— (Singleton trả lời "đúng một thể hiện")</td><td>"báo cho nhiều bên khi có gì thay đổi" = intent của Observer</td></tr>
<tr><td>thêm kênh SMS sau này</td><td>sửa NotificationService (thêm hàm) và KitchenService (thêm lời gọi) — phá nguyên lý Đóng/Mở</td><td>thêm một lớp listener và một dòng subscribe</td></tr>
<tr><td>kiểm thử KitchenService</td><td>biến toàn cục ẩn qua getInstance() — khó thay bằng bản giả</td><td>truyền vào một listener giả</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/5a477ac18884550a29a491efb09a84789698f25b.svg" alt="Exercise 6 — after review: Observer, the kitchen publishes &quot;order ready&quot; and each channel subscribes" loading="lazy" /><p class="chu-thich">🧩 Exercise 6 — after review: Observer, the kitchen publishes "order ready" and each channel subscribes</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 6 — after review: Observer, the kitchen publishes "order ready" and each channel subscribes
' Đóng/Mở: kênh mới là một lớp listener mới; KitchenService không bao giờ phải sửa
class KitchenService {
  - listeners : List&lt;OrderReadyListener&gt;
  + subscribe(l : OrderReadyListener) : void
  + markReady(order : Order) : void
}
interface OrderReadyListener {
  + onOrderReady(order : Order) : void
}
class ScreenDisplay
class SpeakerAnnouncer
class AppPushNotifier
KitchenService o--&gt; "0..*" OrderReadyListener
OrderReadyListener &lt;|.. ScreenDisplay
OrderReadyListener &lt;|.. SpeakerAnnouncer
OrderReadyListener &lt;|.. AppPushNotifier
@enduml</code></pre></details>
<pre><code class="language-java">// Bài 6: Observer thay cho Singleton của AI — bếp phát "đơn đã xong", mỗi kênh tự đăng ký nhận
import java.util.ArrayList;
import java.util.List;

record Order(String orderNo, String student, String pickupSlot) {}

interface OrderReadyListener {
    void onOrderReady(Order order);
}

class KitchenService {
    private final List&lt;OrderReadyListener&gt; listeners = new ArrayList&lt;&gt;();

    void subscribe(OrderReadyListener l) { listeners.add(l); }

    void markReady(Order order) {
        System.out.println("Kitchen: " + order.orderNo() + " is ready");
        for (OrderReadyListener l : listeners) l.onOrderReady(order);   // bếp không biết ai đang nghe
    }
}

class ScreenDisplay implements OrderReadyListener {
    public void onOrderReady(Order o) { System.out.println("  Screen : show " + o.orderNo()); }
}

class SpeakerAnnouncer implements OrderReadyListener {
    public void onOrderReady(Order o) { System.out.println("  Speaker: \\"Order " + o.orderNo() + ", please come to the counter\\""); }
}

class AppPushNotifier implements OrderReadyListener {
    public void onOrderReady(Order o) { System.out.println("  App    : push to " + o.student() + " (pickup " + o.pickupSlot() + ")"); }
}

public class CanteenObserver {
    public static void main(String[] args) {
        KitchenService kitchen = new KitchenService();
        kitchen.subscribe(new ScreenDisplay());
        kitchen.subscribe(new AppPushNotifier());
        kitchen.markReady(new Order("A-017", "an.nv", "11:45"));

        System.out.println("-- a speaker is installed: one new subscribe line, KitchenService unchanged --");
        kitchen.subscribe(new SpeakerAnnouncer());
        kitchen.markReady(new Order("A-018", "binh.tt", "11:50"));
    }
}</code></pre>
<div class="out">Kitchen: A-017 is ready<br>
&nbsp;&nbsp;Screen : show A-017<br>
&nbsp;&nbsp;App &nbsp;&nbsp;&nbsp;: push to an.nv (pickup 11:45)<br>
-- a speaker is installed: one new subscribe line, KitchenService unchanged --<br>
Kitchen: A-018 is ready<br>
&nbsp;&nbsp;Screen : show A-018<br>
&nbsp;&nbsp;App &nbsp;&nbsp;&nbsp;: push to binh.tt (pickup 11:50)<br>
&nbsp;&nbsp;Speaker: "Order A-018, please come to the counter"</div>
<p class="nhan">Quyết định</p>
<ul>
<li>Động từ trong yêu cầu quyết định pattern: "báo … lên màn hình, loa và app" là báo tin một-nhiều → Observer (bảng ở bài 5.A slide 11).</li>
<li>➕ Trong Spring Boot hiếm khi bạn tự viết danh sách: phát một <code>OrderReadyEvent</code> bằng <code>ApplicationEventPublisher</code> và gắn <code>@EventListener</code> lên hàm của từng kênh — cùng pattern đó, framework làm sẵn. Và bean của Spring vốn đã là singleton, nên Singleton viết tay gần như không bao giờ cần.</li>
</ul>`),
    bi(`<h3>🧪 Exercise 7 — From the class model to tables: review the AI's schema (~20 min)</h3>
<p class="nhan">Prompt given to the AI</p>
<pre><code class="language-plaintext">Convert this class diagram into a relational database schema for PostgreSQL and draw
it as a PlantUML ER diagram.   &lt;paste the class diagram of exercise 2&gt;</code></pre>
<p class="nhan">AI draft (illustration — pretend the AI was given the <em>unreviewed</em> class diagram)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/7f22c90990c096e893451072ebb9a6e465a39e62.svg" alt="Exercise 7 — AI draft of the relational schema (illustration with errors)" loading="lazy" /><p class="chu-thich">🧩 Exercise 7 — AI draft of the relational schema (illustration with errors)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 7 — AI draft of the relational schema (illustration with errors)
' Errors: many-to-many stored as a comma list, foreign key on the "one" side, price not kept per line
hide circle
entity "student" as s {
  * id : bigint &lt;&lt;PK&gt;&gt;
  --
  name : varchar(100)
  order_id : bigint &lt;&lt;FK&gt;&gt;
}
entity "orders" as o {
  * id : bigint &lt;&lt;PK&gt;&gt;
  --
  item_ids : varchar(255)
  total : float
}
entity "menu_item" as m {
  * id : bigint &lt;&lt;PK&gt;&gt;
  --
  name : varchar(100)
  price : float
}
s }o--|| o
@enduml</code></pre></details>
<p class="nhan">Review with the mapping rules of lesson 5.1</p>
<table>
<thead><tr><th>Rule (lesson 5.1)</th><th>What the draft did</th><th>Correct mapping</th></tr></thead>
<tbody>
<tr><td>1-to-many → foreign key on the <strong>many</strong> side</td><td><code>student.order_id</code>: FK on the "one" side, so a student could have only one order</td><td><code>orders.student_id</code> NOT NULL</td></tr>
<tr><td>many-to-many → a junction table</td><td><code>item_ids varchar</code> "1,4,7" — violates 1NF (not atomic), no FK, no quantity</td><td><code>order_line(order_id, menu_item_id, quantity, unit_price)</code>, composite PK</td></tr>
<tr><td>composition → the part's FK is NOT NULL and part of its key</td><td>—</td><td>order_line's PK contains order_id; ON DELETE CASCADE</td></tr>
<tr><td>optional association 0..1</td><td>voucher missing</td><td><code>orders.voucher_id</code> nullable FK</td></tr>
<tr><td>money</td><td><code>float</code></td><td><code>numeric</code> (VND has no decimals: numeric(10,0))</td></tr>
<tr><td>derived value <code>total</code></td><td>stored and never recomputed</td><td>compute from order_line, or store it on purpose and document why (lesson 5.1 ★)</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/f320f12bb8ea382c24f8105fd844322527867e2a.svg" alt="Exercise 7 — relational schema after review (one table per entity class, junction for order lines)" loading="lazy" /><p class="chu-thich">🧩 Exercise 7 — relational schema after review (one table per entity class, junction for order lines)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 7 — relational schema after review (one table per entity class, junction for order lines)
' Mapping rules: 1-to-many = FK on the many side; many-to-many with data = its own table; money = numeric
hide circle
entity "student" as s {
  * id : bigint &lt;&lt;PK&gt;&gt;
  --
  * student_code : varchar(10) &lt;&lt;UK&gt;&gt;
  * name : varchar(100)
}
entity "orders" as o {
  * id : bigint &lt;&lt;PK&gt;&gt;
  --
  * order_no : varchar(20) &lt;&lt;UK&gt;&gt;
  * student_id : bigint &lt;&lt;FK&gt;&gt;
  voucher_id : bigint &lt;&lt;FK&gt;&gt;
  * pickup_slot : time
  * status : varchar(20)
}
entity "order_line" as ol {
  * order_id : bigint &lt;&lt;PK, FK&gt;&gt;
  * menu_item_id : bigint &lt;&lt;PK, FK&gt;&gt;
  --
  * quantity : int
  * unit_price : numeric(10,0)
}
entity "menu_item" as m {
  * id : bigint &lt;&lt;PK&gt;&gt;
  --
  * name : varchar(100)
  * price : numeric(10,0)
  * available : boolean
}
entity "voucher" as v {
  * id : bigint &lt;&lt;PK&gt;&gt;
  --
  * code : varchar(20) &lt;&lt;UK&gt;&gt;
  * discount_percent : int
}
s ||--o{ o
o ||--|{ ol
m ||--o{ ol
v |o--o{ o
@enduml</code></pre></details>
<pre><code class="language-plaintext">CREATE TABLE student   (id bigserial PRIMARY KEY, student_code varchar(10) NOT NULL UNIQUE,
                        name varchar(100) NOT NULL);
CREATE TABLE voucher   (id bigserial PRIMARY KEY, code varchar(20) NOT NULL UNIQUE,
                        discount_percent int NOT NULL CHECK (discount_percent BETWEEN 1 AND 100));
CREATE TABLE menu_item (id bigserial PRIMARY KEY, name varchar(100) NOT NULL,
                        price numeric(10,0) NOT NULL CHECK (price &gt; 0), available boolean NOT NULL);
CREATE TABLE orders    (id bigserial PRIMARY KEY, order_no varchar(20) NOT NULL UNIQUE,
                        student_id bigint NOT NULL REFERENCES student(id),
                        voucher_id bigint REFERENCES voucher(id),
                        pickup_slot time NOT NULL, status varchar(20) NOT NULL);
CREATE TABLE order_line(order_id bigint REFERENCES orders(id) ON DELETE CASCADE,
                        menu_item_id bigint REFERENCES menu_item(id),
                        quantity int NOT NULL CHECK (quantity &gt; 0),
                        unit_price numeric(10,0) NOT NULL,
                        PRIMARY KEY (order_id, menu_item_id));</code></pre>
<p class="nhan">Decisions</p>
<ul>
<li>The table is named <code>orders</code>, not <code>order</code>: ORDER is a reserved word in SQL — an AI draft that names it <code>order</code> fails at the first CREATE.</li>
<li>The status column mirrors the statechart of exercise 4; a <code>CHECK (status IN (…))</code> keeps the database from holding a state the model does not have.</li>
<li>Check the AI schema against the <strong>class diagram</strong>, not the other way round (COMET: the model drives the schema).</li>
</ul>`,
    `<h3>🧪 Bài 7 — Từ mô hình lớp sang bảng: soát lược đồ AI sinh (~20 phút)</h3>
<p class="nhan">Prompt đưa cho AI</p>
<pre><code class="language-plaintext">Convert this class diagram into a relational database schema for PostgreSQL and draw
it as a PlantUML ER diagram.   &lt;paste the class diagram of exercise 2&gt;</code></pre>
<p class="nhan">Bản AI phác (minh hoạ — coi như AI nhận class diagram <em>chưa soát</em>)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/7f22c90990c096e893451072ebb9a6e465a39e62.svg" alt="Exercise 7 — AI draft of the relational schema (illustration with errors)" loading="lazy" /><p class="chu-thich">🧩 Exercise 7 — AI draft of the relational schema (illustration with errors)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 7 — AI draft of the relational schema (illustration with errors)
' Lỗi: nhiều-nhiều lưu thành chuỗi phân cách dấu phẩy, khoá ngoại đặt ở phía "một", giá không lưu theo dòng
hide circle
entity "student" as s {
  * id : bigint &lt;&lt;PK&gt;&gt;
  --
  name : varchar(100)
  order_id : bigint &lt;&lt;FK&gt;&gt;
}
entity "orders" as o {
  * id : bigint &lt;&lt;PK&gt;&gt;
  --
  item_ids : varchar(255)
  total : float
}
entity "menu_item" as m {
  * id : bigint &lt;&lt;PK&gt;&gt;
  --
  name : varchar(100)
  price : float
}
s }o--|| o
@enduml</code></pre></details>
<p class="nhan">Soát theo luật ánh xạ của bài 5.1</p>
<table>
<thead><tr><th>Luật (bài 5.1)</th><th>Bản nháp đã làm</th><th>Ánh xạ đúng</th></tr></thead>
<tbody>
<tr><td>1-nhiều → khoá ngoại ở phía <strong>nhiều</strong></td><td><code>student.order_id</code>: FK ở phía "một", nên mỗi sinh viên chỉ có được một đơn</td><td><code>orders.student_id</code> NOT NULL</td></tr>
<tr><td>nhiều-nhiều → một bảng trung gian (junction table)</td><td><code>item_ids varchar</code> "1,4,7" — vi phạm 1NF (không nguyên tử), không có FK, không có số lượng</td><td><code>order_line(order_id, menu_item_id, quantity, unit_price)</code>, khoá chính phức hợp</td></tr>
<tr><td>hợp thành → FK của bộ phận NOT NULL và nằm trong khoá của nó</td><td>—</td><td>PK của order_line chứa order_id; ON DELETE CASCADE</td></tr>
<tr><td>liên kết tuỳ chọn 0..1</td><td>thiếu voucher</td><td><code>orders.voucher_id</code> FK cho phép NULL</td></tr>
<tr><td>tiền</td><td><code>float</code></td><td><code>numeric</code> (VND không có phần lẻ: numeric(10,0))</td></tr>
<tr><td>giá trị dẫn xuất <code>total</code></td><td>lưu mà không bao giờ tính lại</td><td>tính từ order_line, hoặc cố ý lưu và ghi rõ lý do (bài 5.1 ★)</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/f320f12bb8ea382c24f8105fd844322527867e2a.svg" alt="Exercise 7 — relational schema after review (one table per entity class, junction for order lines)" loading="lazy" /><p class="chu-thich">🧩 Exercise 7 — relational schema after review (one table per entity class, junction for order lines)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 7 — relational schema after review (one table per entity class, junction for order lines)
' Luật ánh xạ: 1-nhiều = FK ở phía nhiều; nhiều-nhiều có dữ liệu = bảng riêng; tiền = numeric
hide circle
entity "student" as s {
  * id : bigint &lt;&lt;PK&gt;&gt;
  --
  * student_code : varchar(10) &lt;&lt;UK&gt;&gt;
  * name : varchar(100)
}
entity "orders" as o {
  * id : bigint &lt;&lt;PK&gt;&gt;
  --
  * order_no : varchar(20) &lt;&lt;UK&gt;&gt;
  * student_id : bigint &lt;&lt;FK&gt;&gt;
  voucher_id : bigint &lt;&lt;FK&gt;&gt;
  * pickup_slot : time
  * status : varchar(20)
}
entity "order_line" as ol {
  * order_id : bigint &lt;&lt;PK, FK&gt;&gt;
  * menu_item_id : bigint &lt;&lt;PK, FK&gt;&gt;
  --
  * quantity : int
  * unit_price : numeric(10,0)
}
entity "menu_item" as m {
  * id : bigint &lt;&lt;PK&gt;&gt;
  --
  * name : varchar(100)
  * price : numeric(10,0)
  * available : boolean
}
entity "voucher" as v {
  * id : bigint &lt;&lt;PK&gt;&gt;
  --
  * code : varchar(20) &lt;&lt;UK&gt;&gt;
  * discount_percent : int
}
s ||--o{ o
o ||--|{ ol
m ||--o{ ol
v |o--o{ o
@enduml</code></pre></details>
<pre><code class="language-plaintext">CREATE TABLE student   (id bigserial PRIMARY KEY, student_code varchar(10) NOT NULL UNIQUE,
                        name varchar(100) NOT NULL);
CREATE TABLE voucher   (id bigserial PRIMARY KEY, code varchar(20) NOT NULL UNIQUE,
                        discount_percent int NOT NULL CHECK (discount_percent BETWEEN 1 AND 100));
CREATE TABLE menu_item (id bigserial PRIMARY KEY, name varchar(100) NOT NULL,
                        price numeric(10,0) NOT NULL CHECK (price &gt; 0), available boolean NOT NULL);
CREATE TABLE orders    (id bigserial PRIMARY KEY, order_no varchar(20) NOT NULL UNIQUE,
                        student_id bigint NOT NULL REFERENCES student(id),
                        voucher_id bigint REFERENCES voucher(id),
                        pickup_slot time NOT NULL, status varchar(20) NOT NULL);
CREATE TABLE order_line(order_id bigint REFERENCES orders(id) ON DELETE CASCADE,
                        menu_item_id bigint REFERENCES menu_item(id),
                        quantity int NOT NULL CHECK (quantity &gt; 0),
                        unit_price numeric(10,0) NOT NULL,
                        PRIMARY KEY (order_id, menu_item_id));</code></pre>
<p class="nhan">Quyết định</p>
<ul>
<li>Bảng tên <code>orders</code>, không phải <code>order</code>: ORDER là từ khoá dành riêng của SQL — bản AI đặt tên <code>order</code> sẽ hỏng ngay câu CREATE đầu tiên.</li>
<li>Cột status phản chiếu statechart ở bài 4; một <code>CHECK (status IN (…))</code> giữ cho CSDL không chứa trạng thái mà mô hình không có.</li>
<li>Soát lược đồ AI theo <strong>class diagram</strong>, không làm ngược lại (COMET: mô hình dẫn dắt lược đồ).</li>
</ul>`),
    bi(`<h3>📝 The AI declaration — fill it for exercise 1</h3>
<p>The course project document asks every team to "clearly declare all AI usage: which prompt was used, what output was generated by AI" and to "explain AI-generated output using their own understanding and justify how/why it's applied". A table per artifact is enough; here it is filled for exercise 1:</p>
<table>
<thead><tr><th>Field</th><th>Content</th></tr></thead>
<tbody>
<tr><td>Artifact</td><td>Use case diagram + UC-01 description, FU Canteen (Evaluation 1)</td></tr>
<tr><td>Tool and date</td><td>ChatGPT, 12/10/2026</td></tr>
<tr><td>Prompt (exact)</td><td>"You are a software analyst. From the requirement below, list the actors and use cases … write PlantUML code …" + case text</td></tr>
<tr><td>AI output (summary, full text in appendix)</td><td>actors Student, System; 5 use cases; include/extend as in the draft; a 5-step description</td></tr>
<tr><td>Kept</td><td>Place Pre-order, Pay Online, Apply Voucher, Pick Up Order; PlantUML as a starting point</td></tr>
<tr><td>Changed and why</td><td>removed "System" actor (a system is not its own actor) → Timer; include/extend corrected by the "always vs sometimes" rule; added Kitchen Staff and Payment Gateway (named in the text); description rewritten in the 7-row template, what not how</td></tr>
<tr><td>Who checked</td><td>team member name; reviewed against lesson 5.A checklist</td></tr>
</tbody>
</table>
<div class="pitfall">Declaring is not a formality: the rubric's first criterion is "Understanding of AI output". In the review meeting you may be asked to explain any line of an AI-made diagram — if you cannot, it counts as not your work.</div>`,
    `<h3>📝 Khai báo AI — điền cho bài 1</h3>
<p>Tài liệu đồ án môn yêu cầu mọi nhóm "khai báo rõ mọi lần dùng AI: đã dùng prompt nào, AI đã sinh ra gì" và "giải thích output của AI bằng hiểu biết của chính mình, biện minh áp dụng thế nào/vì sao". Mỗi sản phẩm một bảng là đủ; đây là bảng đã điền cho bài 1:</p>
<table>
<thead><tr><th>Mục</th><th>Nội dung</th></tr></thead>
<tbody>
<tr><td>Sản phẩm</td><td>Use case diagram + đặc tả UC-01, FU Canteen (Evaluation 1)</td></tr>
<tr><td>Công cụ và ngày</td><td>ChatGPT, 12/10/2026</td></tr>
<tr><td>Prompt (nguyên văn)</td><td>"You are a software analyst. From the requirement below, list the actors and use cases … write PlantUML code …" + đoạn đề</td></tr>
<tr><td>Output của AI (tóm tắt, bản đủ ở phụ lục)</td><td>actor Student, System; 5 use case; include/extend như bản nháp; đặc tả 5 bước</td></tr>
<tr><td>Giữ</td><td>Place Pre-order, Pay Online, Apply Voucher, Pick Up Order; mã PlantUML làm điểm xuất phát</td></tr>
<tr><td>Sửa gì và vì sao</td><td>bỏ actor "System" (hệ thống không là actor của chính nó) → Timer; sửa include/extend theo luật "luôn luôn hay thỉnh thoảng"; thêm Kitchen Staff và Payment Gateway (có trong đề); viết lại đặc tả theo khuôn 7 dòng, nói làm gì chứ không nói làm thế nào</td></tr>
<tr><td>Người kiểm</td><td>tên thành viên; soát theo bảng kiểm của bài 5.A</td></tr>
</tbody>
</table>
<div class="pitfall">Khai báo không phải thủ tục cho có: tiêu chí đầu tiên của rubric là "Understanding of AI output" (hiểu output của AI). Buổi chấm có thể hỏi bạn giải thích bất kỳ dòng nào của một sơ đồ do AI làm — không giải thích được thì coi như không phải bài của bạn.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>prompt</strong></td><td>câu lệnh / yêu cầu gửi cho AI</td><td>The text you give an AI tool: role, context, rules and the output you want.</td></tr>
<tr><td><strong>large language model (LLM)</strong></td><td>mô hình ngôn ngữ lớn</td><td>An AI model trained on huge amounts of text that predicts and generates text, such as the model behind ChatGPT.</td></tr>
<tr><td><strong>hallucination</strong></td><td>ảo giác (AI bịa)</td><td>A confident AI answer that is not true or not in your requirements, such as PayPal in a Momo/ZaloPay system.</td></tr>
<tr><td><strong>AI usage declaration</strong></td><td>khai báo dùng AI</td><td>The record of which prompt was used, what the AI produced, what was kept and what was changed and why.</td></tr>
<tr><td><strong>validation and refinement</strong></td><td>kiểm chứng và chỉnh sửa</td><td>Checking AI output against the requirements and notation rules, then correcting it.</td></tr>
<tr><td><strong>boilerplate code</strong></td><td>code rập khuôn</td><td>Repetitive code with little logic (getters, CRUD, DAO stubs) that tools like Copilot generate well.</td></tr>
<tr><td><strong>multiplicity</strong></td><td>bội số</td><td>The number of objects that can take part at each end of an association, such as 1 and 0..*.</td></tr>
<tr><td><strong>composition</strong></td><td>hợp thành</td><td>A strong whole–part association: the part cannot exist without the whole and is deleted with it.</td></tr>
<tr><td><strong>boundary / control / entity</strong></td><td>biên / điều khiển / thực thể</td><td>COMET's object categories: talks to the outside / runs the use case / holds long-lived data.</td></tr>
<tr><td><strong>guard condition</strong></td><td>điều kiện canh</td><td>A Boolean condition in square brackets that must be true for a transition to fire.</td></tr>
<tr><td><strong>timer event</strong></td><td>sự kiện hẹn giờ</td><td>An event caused by elapsed time, written "after (30 min)" on a transition.</td></tr>
<tr><td><strong>distributed monolith</strong></td><td>khối nguyên phân tán</td><td>Services deployed separately but sharing one database or calling each other synchronously, so they cannot change or fail independently.</td></tr>
<tr><td><strong>modular monolith</strong></td><td>khối nguyên chia module</td><td>One deployable application divided into modules with clear boundaries and interfaces.</td></tr>
<tr><td><strong>junction table</strong></td><td>bảng trung gian</td><td>A table that implements a many-to-many association with two foreign keys, usually forming its primary key.</td></tr>
<tr><td><strong>foreign key</strong></td><td>khoá ngoại</td><td>A column that references the primary key of another table; for 1-to-many it goes on the many side.</td></tr>
<tr><td><strong>first normal form (1NF)</strong></td><td>dạng chuẩn 1</td><td>Every column holds one atomic value — no lists such as "1,4,7" in a cell.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>prompt</strong></td><td>câu lệnh / yêu cầu gửi cho AI</td><td>Đoạn chữ bạn đưa cho công cụ AI: vai, ngữ cảnh, luật và dạng output mong muốn.</td></tr>
<tr><td><strong>large language model (LLM)</strong></td><td>mô hình ngôn ngữ lớn</td><td>Mô hình AI huấn luyện trên lượng chữ khổng lồ, dự đoán và sinh chữ, như mô hình đứng sau ChatGPT.</td></tr>
<tr><td><strong>hallucination</strong></td><td>ảo giác (AI bịa)</td><td>Câu trả lời AI tự tin mà sai hoặc không có trong yêu cầu, như PayPal trong một hệ Momo/ZaloPay.</td></tr>
<tr><td><strong>AI usage declaration</strong></td><td>khai báo dùng AI</td><td>Bản ghi prompt đã dùng, AI đã sinh gì, giữ gì, sửa gì và vì sao.</td></tr>
<tr><td><strong>validation and refinement</strong></td><td>kiểm chứng và chỉnh sửa</td><td>Đối chiếu output của AI với yêu cầu và luật ký pháp, rồi sửa nó.</td></tr>
<tr><td><strong>boilerplate code</strong></td><td>code rập khuôn</td><td>Code lặp lại, ít logic (getter, CRUD, khung DAO) mà công cụ như Copilot sinh tốt.</td></tr>
<tr><td><strong>multiplicity</strong></td><td>bội số</td><td>Số đối tượng có thể tham gia ở mỗi đầu một liên kết, như 1 và 0..*.</td></tr>
<tr><td><strong>composition</strong></td><td>hợp thành</td><td>Quan hệ toàn thể–bộ phận mạnh: bộ phận không tồn tại khi thiếu toàn thể và bị xoá cùng nó.</td></tr>
<tr><td><strong>boundary / control / entity</strong></td><td>biên / điều khiển / thực thể</td><td>Các loại đối tượng của COMET: nói chuyện với bên ngoài / chạy use case / giữ dữ liệu sống lâu.</td></tr>
<tr><td><strong>guard condition</strong></td><td>điều kiện canh</td><td>Điều kiện đúng/sai trong ngoặc vuông phải đúng thì chuyển trạng thái mới xảy ra.</td></tr>
<tr><td><strong>timer event</strong></td><td>sự kiện hẹn giờ</td><td>Sự kiện sinh ra do thời gian trôi qua, ghi "after (30 min)" trên chuyển trạng thái.</td></tr>
<tr><td><strong>distributed monolith</strong></td><td>khối nguyên phân tán</td><td>Các service triển khai riêng nhưng dùng chung CSDL hoặc gọi nhau đồng bộ, nên không đổi hay hỏng độc lập được.</td></tr>
<tr><td><strong>modular monolith</strong></td><td>khối nguyên chia module</td><td>Một ứng dụng triển khai một lần, chia thành các module có ranh giới và giao diện rõ.</td></tr>
<tr><td><strong>junction table</strong></td><td>bảng trung gian</td><td>Bảng hiện thực quan hệ nhiều-nhiều bằng hai khoá ngoại, thường ghép thành khoá chính của nó.</td></tr>
<tr><td><strong>foreign key</strong></td><td>khoá ngoại</td><td>Cột tham chiếu khoá chính của bảng khác; với 1-nhiều nó nằm ở phía nhiều.</td></tr>
<tr><td><strong>first normal form (1NF)</strong></td><td>dạng chuẩn 1</td><td>Mỗi cột chứa một giá trị nguyên tử — không có danh sách kiểu "1,4,7" trong một ô.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 5</h2>
<ol>
<li><strong>AI drafts, you decide</strong>: ChatGPT suggests, PlantUML draws, Copilot types; the school's rule is "AI is a supportive assistant, not a replacement for the designer" (CLO7).</li>
<li><strong>Good prompts</strong>: role + the exact requirement + rules + output form + "list your assumptions". Missing details get invented.</li>
<li><strong>Use case review</strong>: actors outside (no "System", no "Database"); include = always (base → included), extend = sometimes (extension → base); goal-level names; descriptions say what, not how.</li>
<li><strong>Class review</strong>: multiplicities at both ends, no foreign keys, composition diamond on the whole, a class for a many-to-many that has its own data (OrderLine), historical values kept.</li>
<li><strong>Interaction and state review</strong>: boundary → control → entity, proxies for external systems, alternatives shown; states wait, actions happen, every arrow "event [guard] / action", timers "after (t)" — and run the statechart to check it.</li>
<li><strong>Architecture from quality attributes</strong>: give the AI your numbers; microservices need data ownership, otherwise they are a distributed monolith; a modular monolith is a valid, defensible choice.</li>
<li><strong>Patterns from the problem</strong>: match the requirement's verb to a pattern's intent (notify many → Observer, several interchangeable ways → Strategy); AI over-suggests Singleton.</li>
<li><strong>Schema from the model</strong>: one table per entity class, FK on the many side, junction table for many-to-many, composition → NOT NULL FK in the part's key, numeric for money; declare every AI use.</li>
</ol>
<h3>✅ Check yourself before the quiz</h3>
<ol>
<li>An AI diagram shows "Check Stock «extend» Place Order", and stock is checked for every order. What is wrong?</li>
<li>Where does the foreign key of "a Student places 0..* Orders" go?</li>
<li>Name two things the course project requires when you use AI.</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) a mandatory step is «include», drawn from Place Order to Check Stock. (2) In the orders table (the many side): <code>orders.student_id</code>. (3) Declare the prompt and the AI output, and explain the output in your own understanding (plus mark AI-supported content clearly).</p>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 5</h2>
<ol>
<li><strong>AI phác, bạn quyết</strong>: ChatGPT gợi ý, PlantUML vẽ, Copilot gõ; luật của trường là "AI là trợ lý hỗ trợ, không thay người thiết kế" (CLO7).</li>
<li><strong>Prompt tốt</strong>: vai + nguyên văn yêu cầu + luật + dạng output + "liệt kê giả định của bạn". Chi tiết thiếu sẽ bị bịa.</li>
<li><strong>Soát use case</strong>: actor ở ngoài (không "System", không "Database"); include = luôn luôn (gốc → được include), extend = thỉnh thoảng (mở rộng → gốc); tên ở mức mục tiêu; đặc tả nói làm gì chứ không nói làm thế nào.</li>
<li><strong>Soát lớp</strong>: bội số ở cả hai đầu, không khoá ngoại, hình thoi hợp thành ở phía toàn thể, nhiều-nhiều có dữ liệu riêng thì thành một lớp (OrderLine), giữ giá trị lịch sử.</li>
<li><strong>Soát tương tác và trạng thái</strong>: boundary → control → entity, proxy cho hệ thống ngoài, có luồng phụ; trạng thái thì chờ, hành động thì xảy ra, mỗi mũi tên "event [guard] / action", hẹn giờ "after (t)" — và chạy statechart để kiểm.</li>
<li><strong>Kiến trúc từ thuộc tính chất lượng</strong>: đưa AI con số của bạn; microservices phải sở hữu dữ liệu riêng, không thì là khối nguyên phân tán; modular monolith là lựa chọn hợp lệ, bảo vệ được.</li>
<li><strong>Pattern từ vấn đề</strong>: khớp động từ trong yêu cầu với intent của pattern (báo nhiều bên → Observer, nhiều cách thay thế nhau → Strategy); AI hay gợi ý thừa Singleton.</li>
<li><strong>Lược đồ từ mô hình</strong>: mỗi lớp entity một bảng, FK ở phía nhiều, bảng trung gian cho nhiều-nhiều, hợp thành → FK NOT NULL nằm trong khoá của bộ phận, numeric cho tiền; khai báo mọi lần dùng AI.</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm bài trắc nghiệm (quiz)</h3>
<ol>
<li>Một sơ đồ AI vẽ "Check Stock «extend» Place Order", mà đơn nào cũng kiểm kho. Sai ở đâu?</li>
<li>Khoá ngoại của "một Student đặt 0..* Order" nằm ở đâu?</li>
<li>Kể hai điều đồ án môn bắt buộc khi bạn dùng AI.</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) bước bắt buộc là «include», vẽ từ Place Order tới Check Stock. (2) Ở bảng orders (phía nhiều): <code>orders.student_id</code>. (3) Khai báo prompt và output của AI, và giải thích output bằng hiểu biết của chính mình (kèm đánh dấu rõ phần có AI hỗ trợ).</p>`),
  ].join('\n'),
};

/* ───────── Quiz (swd392-quiz-5) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'In the class model, an Order contains many MenuItems and a MenuItem appears in many Orders; each pair has its own quantity. How is this mapped to relational tables?|||Trong mô hình lớp, một Order chứa nhiều MenuItem và một MenuItem có mặt trong nhiều Order; mỗi cặp có số lượng riêng. Ánh xạ sang bảng quan hệ thế nào?',
      options: ['Add a column menu_item_id and a column quantity to the orders table|||Thêm cột menu_item_id và cột quantity vào bảng orders', 'Store the item ids and quantities as a text list in the orders table|||Lưu danh sách id món và số lượng thành một chuỗi trong bảng orders', 'A junction table order_line with foreign keys to both tables, the quantity column, and a primary key made of the two foreign keys|||Một bảng trung gian order_line có khoá ngoại tới cả hai bảng, cột quantity, và khoá chính ghép từ hai khoá ngoại', 'Merge orders and menu_item into one table|||Gộp orders và menu_item thành một bảng'],
      correctIndex: 2,
      points: 1,
      explanation: 'A many-to-many association cannot be stored as a foreign key on either side; it becomes its own table, and data that belongs to the pair (quantity, price at order time) goes into that table. A is tempting but allows only one menu item per order; B breaks first normal form and loses referential integrity.|||Quan hệ nhiều-nhiều không thể lưu bằng khoá ngoại ở bên nào; nó thành một bảng riêng, và dữ liệu thuộc về cặp (số lượng, giá lúc đặt) nằm trong bảng đó. A dễ chọn nhưng mỗi đơn chỉ có được một món; B vi phạm dạng chuẩn 1 và mất toàn vẹn tham chiếu.' },
    { id: 'q2',
      question: 'Read this class diagram fragment. Where does the foreign key go when it is mapped to tables?|||Đọc đoạn class diagram này. Khi ánh xạ sang bảng, khoá ngoại nằm ở đâu?',
      code: `class Student <<entity>>
class Order <<entity>>
Student "1" -- "0..*" Order : places >`,
      codeLang: 'plantuml',
      options: ['In the orders table: orders.student_id references student(id)|||Ở bảng orders: orders.student_id tham chiếu student(id)', 'In the student table: student.order_id references orders(id)|||Ở bảng student: student.order_id tham chiếu orders(id)', 'In both tables, each referencing the other|||Ở cả hai bảng, bảng nào cũng tham chiếu bảng kia', 'In a separate junction table student_order|||Ở một bảng trung gian riêng student_order'],
      correctIndex: 0,
      points: 1,
      explanation: 'For a one-to-many association the foreign key goes on the "many" side: each order row stores the one student it belongs to. B is the classic AI mistake — a foreign key on the "one" side means each student could have only one order. A junction table (D) is needed only for many-to-many.|||Với quan hệ một-nhiều, khoá ngoại nằm ở phía "nhiều": mỗi dòng order lưu một sinh viên mà nó thuộc về. B là lỗi AI kinh điển — khoá ngoại ở phía "một" nghĩa là mỗi sinh viên chỉ có được một đơn. Bảng trung gian (D) chỉ cần cho nhiều-nhiều.' },
    { id: 'q3',
      question: 'Equipment is specialized into Microscope and Oscilloscope. Which mapping of this generalization puts all three classes in ONE table, leaving subclass-specific columns NULL for the other subclass?|||Equipment được chuyên biệt hoá thành Microscope và Oscilloscope. Cách ánh xạ tổng quát hoá nào đặt cả ba lớp vào MỘT bảng, để các cột riêng của lớp con này là NULL ở dòng của lớp con kia?',
      options: ['One table per class, joined by the shared primary key|||Mỗi lớp một bảng, nối bằng khoá chính dùng chung', 'One table per concrete class, repeating the superclass columns|||Mỗi lớp cụ thể một bảng, lặp lại các cột của lớp cha', 'A junction table between the superclass and each subclass|||Một bảng trung gian giữa lớp cha và từng lớp con', 'One table per hierarchy, with a discriminator column for the type|||Một bảng cho cả cây kế thừa, có một cột phân biệt loại'],
      correctIndex: 3,
      points: 1,
      explanation: 'Single table per hierarchy stores every subclass in one table and adds a type (discriminator) column; it is fast (no joins) but columns of one subclass are NULL for the other. A (table per class) avoids NULLs but needs joins; B avoids joins but repeats columns and makes queries over all equipment harder. C is not an inheritance mapping at all.|||Một bảng cho cả cây lưu mọi lớp con trong một bảng và thêm cột loại (discriminator); nhanh (không cần join) nhưng cột của lớp con này là NULL ở lớp con kia. A (mỗi lớp một bảng) tránh NULL nhưng cần join; B tránh join nhưng lặp cột và khó truy vấn trên mọi thiết bị. C hoàn toàn không phải cách ánh xạ kế thừa.' },
    { id: 'q4',
      question: 'Order ◆— OrderLine is a composition (an order line has no meaning without its order). What does this imply for the order_line table?|||Order ◆— OrderLine là quan hệ hợp thành (dòng đơn không có nghĩa khi thiếu đơn). Điều này dẫn tới gì cho bảng order_line?',
      options: ['order_line has no foreign key; the link is kept by the application|||order_line không có khoá ngoại; mối nối do ứng dụng giữ', 'order_line.order_id is NOT NULL, is part of its primary key, and deleting an order deletes its lines (ON DELETE CASCADE)|||order_line.order_id là NOT NULL, nằm trong khoá chính, và xoá đơn thì xoá luôn các dòng (ON DELETE CASCADE)', 'order_line.order_id is nullable so that lines can outlive their order|||order_line.order_id cho phép NULL để dòng đơn sống lâu hơn đơn', 'The orders table gets a column line_id pointing to one line|||Bảng orders thêm cột line_id trỏ tới một dòng'],
      correctIndex: 1,
      points: 1,
      explanation: "Composition means the part's lifetime is bound to the whole: the part must always have its whole (NOT NULL), it is identified inside the whole (the foreign key is part of the key) and it disappears with the whole (cascade delete). C describes aggregation or a plain association, where the part may exist alone; D would allow only one line per order.|||Hợp thành nghĩa là vòng đời bộ phận gắn với toàn thể: bộ phận luôn phải có toàn thể (NOT NULL), được định danh bên trong toàn thể (khoá ngoại nằm trong khoá chính) và biến mất cùng toàn thể (xoá lan). C tả kết tập (aggregation) hoặc liên kết thường, nơi bộ phận có thể tồn tại một mình; D chỉ cho mỗi đơn một dòng." },
    { id: 'q5',
      question: 'An AI-generated schema has a column orders.item_ids containing values such as "1,4,7". Which rule does it break first?|||Một lược đồ do AI sinh có cột orders.item_ids chứa giá trị như "1,4,7". Nó vi phạm luật nào trước tiên?',
      options: ['First normal form: each column must hold a single atomic value|||Dạng chuẩn 1: mỗi cột chỉ chứa một giá trị nguyên tử', 'Third normal form: no transitive dependency between non-key columns|||Dạng chuẩn 3: không có phụ thuộc bắc cầu giữa các cột không khoá', 'The rule that every table needs a surrogate key|||Luật mỗi bảng phải có khoá thay thế (surrogate key)', 'The rule that table names must be plural|||Luật tên bảng phải ở số nhiều'],
      correctIndex: 0,
      points: 1,
      explanation: 'A list in one cell is not atomic, so the table is not even in 1NF; the database cannot enforce foreign keys on "4", cannot index it, and cannot store a quantity per item. The fix is the junction table order_line. B is a real rule but a later one — you cannot talk about 3NF before 1NF holds.|||Một danh sách trong một ô không nguyên tử, nên bảng còn chưa đạt 1NF; CSDL không áp được khoá ngoại lên "4", không đánh chỉ mục được, và không lưu được số lượng từng món. Cách sửa là bảng trung gian order_line. B là luật có thật nhưng đến sau — chưa đạt 1NF thì chưa bàn tới 3NF.' },
    { id: 'q6',
      question: 'An AI produced this use case fragment for a library. Membership is checked on every borrowing; a late fee is paid only when the book is overdue. Which review is correct?|||AI sinh đoạn use case này cho một thư viện. Việc kiểm thẻ thành viên xảy ra ở mọi lần mượn; tiền phạt chỉ trả khi sách quá hạn. Nhận xét soát nào đúng?',
      code: `usecase "Borrow Book" as B
usecase "Check Membership" as C
usecase "Return Book" as R
usecase "Pay Late Fee" as F
B .> C : <<extend>>
R .> F : <<include>>`,
      codeLang: 'plantuml',
      options: ['Both relationships are correct|||Cả hai quan hệ đều đúng', 'Only the arrow directions are wrong; the stereotypes are right|||Chỉ chiều mũi tên sai; stereotype thì đúng', 'They are swapped: Borrow Book should «include» Check Membership, and Pay Late Fee should «extend» Return Book (arrow from Pay Late Fee to Return Book)|||Hai quan hệ bị đảo: Borrow Book phải «include» Check Membership, còn Pay Late Fee phải «extend» Return Book (mũi tên từ Pay Late Fee tới Return Book)', 'Both should be generalizations|||Cả hai phải là tổng quát hoá'],
      correctIndex: 2,
      points: 1,
      explanation: 'A step that happens every time is mandatory and shared → «include», drawn from the base to the included use case. Behaviour that happens only under a condition → «extend», drawn from the extension to the base, with the condition at the extension point. B is tempting because the include arrow B → C is drawn in the correct include direction — but the stereotype on it is the wrong one.|||Bước xảy ra mọi lần là bắt buộc và dùng chung → «include», vẽ từ use case gốc tới use case được include. Hành vi chỉ xảy ra khi có điều kiện → «extend», vẽ từ use case mở rộng tới gốc, kèm điều kiện tại điểm mở rộng. B dễ chọn vì mũi tên B → C đang đúng chiều của include — nhưng stereotype ghi trên nó lại sai.' },
    { id: 'q7',
      question: 'According to the SWD392 course project document "AI-assisted system design", what must a team do if it uses ChatGPT to produce a diagram?|||Theo tài liệu đồ án môn SWD392 "AI-assisted system design", nhóm phải làm gì nếu dùng ChatGPT để làm một sơ đồ?',
      options: ['Nothing, because AI use is optional|||Không cần gì, vì dùng AI là tuỳ chọn', 'Remove every AI-generated part before submitting|||Xoá mọi phần do AI sinh trước khi nộp', 'Ask the lecturer for written permission before each prompt|||Xin phép giảng viên bằng văn bản trước mỗi prompt', 'Declare the prompt and the AI output, and explain the output in their own understanding, justifying how and why it was applied|||Khai báo prompt và output của AI, và giải thích output bằng hiểu biết của mình, biện minh áp dụng thế nào và vì sao'],
      correctIndex: 3,
      points: 1,
      explanation: 'The document allows AI tools under two conditions: declare all AI usage (which prompt, what output) and explain the AI output with your own understanding. The individual AI rubric then grades understanding, customization, transparency and ethical use. A is the trap: AI use is optional, but once used it must be declared.|||Tài liệu cho phép dùng công cụ AI với hai điều kiện: khai báo mọi lần dùng AI (prompt nào, output gì) và giải thích output của AI bằng hiểu biết của chính mình. Rubric AI cá nhân sau đó chấm mức hiểu, tuỳ chỉnh, minh bạch và dùng có đạo đức. A là bẫy: dùng AI là tuỳ chọn, nhưng đã dùng thì phải khai báo.' },
    { id: 'q8',
      question: "The requirement says \"support Momo, ZaloPay and Credit Card\"; the prompt only says \"support different payment methods\"; the AI's Java example implements Credit Card and PayPal. What is the main lesson?|||Yêu cầu ghi \"hỗ trợ Momo, ZaloPay và thẻ tín dụng\"; prompt chỉ ghi \"hỗ trợ nhiều phương thức thanh toán\"; code Java mẫu của AI cài thẻ tín dụng và PayPal. Bài học chính là gì?",
      options: ['Strategy is the wrong pattern for payments|||Strategy là pattern sai cho thanh toán', 'Details left out of the prompt get invented by the AI, so paste the exact requirement and check the output against it|||Chi tiết bị bỏ khỏi prompt sẽ bị AI tự bịa, nên hãy dán nguyên văn yêu cầu và đối chiếu output với nó', 'PayPal must be added to the requirement because the AI suggested it|||Phải thêm PayPal vào yêu cầu vì AI đã gợi ý', 'AI output is always wrong and should not be used|||Output của AI luôn sai và không nên dùng'],
      correctIndex: 1,
      points: 1,
      explanation: "The pattern choice (Strategy, justified by the Open/Closed Principle) was correct; what went wrong is that the prompt dropped the concrete methods, so the AI filled the gap with a generic example. A good prompt carries the exact requirement, and the review checks the output against it. C lets the AI change the requirements; D contradicts the course's own conclusion that AI is a useful assistant whose output must be validated.|||Việc chọn pattern (Strategy, biện minh bằng nguyên lý Đóng/Mở) là đúng; chỗ hỏng là prompt bỏ mất các phương thức cụ thể, nên AI lấp khoảng trống bằng một ví dụ chung chung. Prompt tốt mang nguyên văn yêu cầu, và bước soát đối chiếu output với yêu cầu. C để AI đổi yêu cầu; D trái với kết luận của chính môn học rằng AI là trợ lý có ích nhưng output phải được kiểm chứng." },
    { id: 'q9',
      question: 'A reviewed Strategy implementation for payment fees. What does this program print?|||Một bản cài Strategy đã soát cho phí thanh toán. Chương trình in ra gì?',
      code: `interface Fee { long apply(long amount); }

class NoFee implements Fee { public long apply(long a) { return a; } }
class CardFee implements Fee { public long apply(long a) { return a + a / 50; } }

public class QuizPaymentStrategy {
    public static void main(String[] args) {
        Map<String, Fee> fees = Map.of("MOMO", new NoFee(), "CARD", new CardFee());
        long total = 0;
        for (String m : new String[] { "CARD", "MOMO", "CARD" })
            total += fees.getOrDefault(m, new NoFee()).apply(100000);
        System.out.println(total);
    }
}`,
      codeLang: 'java',
      options: ['304000|||304000', '300000|||300000', '302000|||302000', '306000|||306000'],
      correctIndex: 0,
      points: 1,
      explanation: 'The map picks a strategy per method: CARD adds 2% (100000 / 50 = 2000) → 102000; MOMO has no fee → 100000; CARD again → 102000. Total 102000 + 100000 + 102000 = 304000. B forgets the card fee; C applies it only once.|||Bảng map chọn chiến lược theo phương thức: CARD cộng 2% (100000 / 50 = 2000) → 102000; MOMO không có phí → 100000; lại CARD → 102000. Tổng 102000 + 100000 + 102000 = 304000. B quên phí thẻ; C chỉ tính phí một lần.' },
    { id: 'q10',
      question: 'An AI-drafted statechart for a Reservation contains the states Checking Slot, Sending Email and CONFIRMED, with unlabeled arrows between them. What is the main modeling error?|||Một statechart Reservation do AI phác có các trạng thái Checking Slot, Sending Email và CONFIRMED, giữa chúng là các mũi tên không nhãn. Lỗi mô hình hoá chính là gì?',
      options: ['A statechart may not have more than two states|||Statechart không được có quá hai trạng thái', 'State names must be written in lower case|||Tên trạng thái phải viết chữ thường', 'Checking Slot and Sending Email are actions (instant work), not states; they belong on transitions as "event [guard] / action", and each arrow needs an event|||Checking Slot và Sending Email là hành động (việc tức thời), không phải trạng thái; chúng thuộc về chuyển tiếp dạng "event [guard] / action", và mỗi mũi tên cần một sự kiện', 'The initial state must always be CONFIRMED|||Trạng thái đầu luôn phải là CONFIRMED'],
      correctIndex: 2,
      points: 1,
      explanation: 'A state is a condition that lasts while the object waits for an event (PENDING_APPROVAL, CONFIRMED); sending an email or checking availability happens during a transition, so it is written as an action after "/". Unlabeled arrows hide what triggers the change. The reviewed chart goes from the initial state to PENDING_APPROVAL or CONFIRMED on "Request Submitted [guard] / Send Confirmation".|||Trạng thái là tình trạng kéo dài trong lúc đối tượng chờ một sự kiện (PENDING_APPROVAL, CONFIRMED); gửi email hay kiểm chỗ trống xảy ra trong lúc chuyển tiếp, nên được viết là hành động sau dấu "/". Mũi tên không nhãn che mất cái kích hoạt sự thay đổi. Bản đã soát đi từ trạng thái đầu tới PENDING_APPROVAL hoặc CONFIRMED với "Request Submitted [guard] / Send Confirmation".' },
  ],
};

export default {
  slides: [L_swd27_1],
  practice: L_on_ch5,
  quiz: QUIZ,
  quizDescription: '10 câu lý thuyết kiểu FE/PT cho Chương 5, phủ cả thiết kế CSDL quan hệ từ mô hình (nhiều-nhiều có thuộc tính, khoá ngoại phía nhiều đọc từ PlantUML, ánh xạ kế thừa, hợp thành, dạng chuẩn 1) lẫn dùng AI trong thiết kế (soát include/extend do AI sinh, quy định khai báo AI của đồ án môn, prompt bỏ chi tiết khiến AI bịa, chạy một Strategy viết bằng Java để xác nhận đáp án, statechart AI vẽ hành động thành trạng thái) — mỗi câu có giải thích song ngữ.',
};
